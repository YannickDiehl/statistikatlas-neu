import { test, mock, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { toOutput, MAX_LINES, runR, resetR, setWebRLoader, START_ERROR, FILE_ERROR, START_TIMEOUT_MS } from './webr';

test('stdout lines are joined', () => {
  const o = toOutput([{ type: 'stdout', data: 'a' }, { type: 'stdout', data: 'b' }]);
  assert.equal(o.text, 'a\nb');
  assert.deepEqual(o.messages, []);
});

test('long output is cut at 300 lines with a note', () => {
  const items = Array.from({ length: 400 }, (_, i) => ({ type: 'stdout', data: `z${i}` }));
  const lines = toOutput(items).text.split('\n');
  assert.equal(MAX_LINES, 300);
  assert.equal(lines.length, 301);
  assert.equal(lines[299], 'z299');
  assert.equal(lines[300], '… gekürzt (100 weitere Zeilen)');
});

test('stderr is classified as warning or message', () => {
  const o = toOutput([
    { type: 'stderr', data: 'Warning: Removed 220 rows' },
    { type: 'stderr', data: 'Removed 220 rows containing missing values' },
    { type: 'stderr', data: 'Lade Paket: dplyr' },
    { type: 'warning', data: 'w' }, { type: 'error', data: 'e' }, { type: 'message', data: 'm' },
  ]);
  assert.deepEqual(o.messages.map(m => m.kind), ['warning', 'warning', 'message', 'warning', 'error', 'message']);
  assert.equal(o.text, '');
});

test('empty list gives empty text', () => {
  assert.deepEqual(toOutput([]), { text: '', messages: [], images: [] });
});

/** A fake webR that records every R snippet and file write. */
function fakeWebR(opts: {
  failRead?: boolean; failPackages?: boolean;
  /** The user code removes the hidden copy `.za8831`, as `rm(list = ls(all.names = TRUE))` would. */
  removesHidden?: boolean;
  /** `allbus <- .za8831` fails even right after reading the file. */
  failCopy?: boolean;
  /** captureR output instead of one stdout line. */
  output?: { type: string; data: unknown }[];
  /** What R's conditionMessage() gives inside the shelter; a function may throw. */
  conditionMessage?: (cond: unknown) => string;
} = {}) {
  const log = { r: [] as string[], writes: [] as Uint8Array[], inits: 0, closed: 0, captures: 0, shelterR: [] as { code: string; env: unknown }[] };
  let hidden = false;
  class FakeWebR {
    FS = { writeFile: async (_p: string, b: Uint8Array) => { log.writes.push(b); } };
    async init() { log.inits++; }
    close() { log.closed++; }
    async evalRVoid(code: string) {
      log.r.push(code);
      if (opts.failRead && code.includes('read_spss')) throw new Error('boom');
      if (code.includes('read_spss')) hidden = true;
      if (code === 'allbus <- .za8831' && (!hidden || opts.failCopy)) throw new Error("object '.za8831' not found");
    }
    async installPackages() { if (opts.failPackages) throw new Error('no net'); }
    Shelter = class {
      async captureR() { log.captures++; if (opts.removesHidden) hidden = false; return { output: opts.output ?? [{ type: 'stdout', data: 'x' }], images: [] }; }
      async evalR(code: string, o?: { env?: Record<string, unknown> }) {
        log.shelterR.push({ code, env: o?.env });
        const text = (opts.conditionMessage ?? (() => { throw new Error('no R'); }))(o?.env?.cond);
        return { toString: async () => text };
      }
      purge() {}
    };
  }
  return { log, loader: async () => ({ WebR: FakeWebR as never }) };
}
const file = () => ({ name: 'a.sav', bytes: new Uint8Array([1, 2, 3]).buffer });

beforeEach(() => { resetR(); mock.timers.reset(); });

test('allbus is restored from the hidden copy before every run', async () => {
  const f = fakeWebR();
  setWebRLoader(f.loader);
  const fl = file();
  await runR('x', fl);
  await runR('allbus <- NULL', fl);
  assert.equal(f.log.r.filter(r => r === 'allbus <- .za8831').length, 2);
  assert.equal(f.log.r.filter(r => r.includes('.za8831 <- read_spss')).length, 1);
  assert.equal(f.log.writes.length, 1);
  assert.notEqual(f.log.writes[0].buffer, fl.bytes);
  assert.equal(fl.bytes.byteLength, 3);
});

test('a loader that rejects gives the start error and the next call tries again', async () => {
  let calls = 0;
  setWebRLoader(async () => { calls++; throw new Error('blocked'); });
  await assert.rejects(runR('x', file()), { message: START_ERROR });
  await assert.rejects(runR('x', file()), { message: START_ERROR });
  assert.equal(calls, 2);
});

test('a timeout keeps the one boot alive; the retry joins it', async () => {
  mock.timers.enable({ apis: ['setTimeout'] });
  const f = fakeWebR();
  let release: () => void = () => {};
  let calls = 0;
  setWebRLoader(async () => { calls++; await new Promise<void>(r => { release = r; }); return f.loader(); });
  const first = runR('x', file());
  const failed = assert.rejects(first, { message: START_ERROR });
  mock.timers.tick(START_TIMEOUT_MS);
  await failed;
  const second = runR('x', file());
  release();
  const out = await second;
  assert.equal(out.text, 'x');
  assert.equal(calls, 1);
  assert.equal(f.log.inits, 1);
});

test('a failing package install closes webR and the next call boots again', async () => {
  const f = fakeWebR({ failPackages: true });
  setWebRLoader(f.loader);
  await assert.rejects(runR('x', file()), { message: START_ERROR });
  assert.equal(f.log.closed, 1);
  await assert.rejects(runR('x', file()), { message: START_ERROR });
  assert.equal(f.log.inits, 2);
});

test('progress is reported after webR is reachable', async () => {
  setWebRLoader(fakeWebR().loader);
  const seen: string[] = [];
  await runR('x', file(), t => seen.push(t));
  assert.ok(seen.includes('Pakete werden geladen …'));
});

test('an unreadable file gives the file message and is retried', async () => {
  setWebRLoader(fakeWebR({ failRead: true }).loader);
  await assert.rejects(runR('x', file()), { message: FILE_ERROR });
});

test('after library(mariposa) the boot defines a print method so a codebook prints its summary', async () => {
  const f = fakeWebR();
  setWebRLoader(f.loader);
  await runR('x', file());
  const lib = f.log.r.findIndex(r => r.includes('library(mariposa)'));
  const printer = f.log.r.findIndex(r => /print\.codebook\s*<-\s*function\(x, \.\.\.\)/.test(r) && r.includes('print(summary(x))'));
  assert.ok(lib >= 0);
  assert.equal(printer, lib + 1);
  assert.equal(f.log.r.findIndex(r => r === 'options(width = 80)'), lib + 2);
});

test('the codebook print method is only defined when a summary method for codebook exists', async () => {
  const f = fakeWebR();
  setWebRLoader(f.loader);
  await runR('x', file());
  const printer = f.log.r.find(r => /print\.codebook\s*<-/.test(r)) ?? '';
  assert.match(printer, /^if \(!is\.null\(getS3method\("summary", "codebook", optional = TRUE\)\)\)/);
});

/** A captured condition whose `message` field is empty, as rlang/cli conditions often are. */
const cond = (message: string) => ({ get: async (k: string) => ({ toString: async () => (k === 'message' ? message : '') }) });

test('condition texts come from conditionMessage() and lose their ANSI codes', async () => {
  const e = cond('');
  const f = fakeWebR({
    output: [{ type: 'error', data: e }, { type: 'warning', data: cond('') }],
    conditionMessage: c => (c === e ? '\u001b[1m\u001b[22m\u001b[33m!\u001b[39m Can\'t find column `x`.' : 'Removed 3 rows'),
  });
  setWebRLoader(f.loader);
  const out = await runR('x', file());
  assert.deepEqual(out.messages, [
    { kind: 'error', text: "! Can't find column `x`." },
    { kind: 'warning', text: 'Removed 3 rows' },
  ]);
  assert.ok(f.log.shelterR.every(c => /conditionMessage\(cond\)/.test(c.code)));
  assert.equal(f.log.shelterR[0].env && (f.log.shelterR[0].env as { cond: unknown }).cond, e);
});

test('without conditionMessage() the message field is used, then a placeholder', async () => {
  const f = fakeWebR({ output: [{ type: 'error', data: cond('\u001b[31mobject not found\u001b[39m') }, { type: 'message', data: cond('') }] });
  setWebRLoader(f.loader);
  const out = await runR('x', file());
  assert.deepEqual(out.messages.map(m => m.text), ['object not found', '(Meldung)']);
});

test('when the user code removed the hidden copy, the next run reads the file again', async () => {
  const f = fakeWebR({ removesHidden: true });
  setWebRLoader(f.loader);
  const fl = file();
  await runR('rm(list = ls(all.names = TRUE))', fl);
  const out = await runR('x', fl);
  assert.equal(out.text, 'x');
  assert.equal(f.log.r.filter(r => r.includes('.za8831 <- read_spss')).length, 2);
  assert.equal(f.log.writes.length, 2);
  assert.equal(f.log.captures, 2);
});

test('if the copy still fails after reading the file again, the file message follows', async () => {
  const f = fakeWebR({ failCopy: true });
  setWebRLoader(f.loader);
  const fl = file();
  await assert.rejects(runR('x', fl), { message: FILE_ERROR });
  assert.equal(f.log.r.filter(r => r.includes('.za8831 <- read_spss')).length, 2);
  assert.equal(f.log.captures, 0);
  // The marker is reset, so the next run with the same file reads it once more.
  await assert.rejects(runR('x', fl), { message: FILE_ERROR });
  assert.equal(f.log.r.filter(r => r.includes('.za8831 <- read_spss')).length, 4);
});
