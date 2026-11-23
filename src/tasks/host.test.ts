import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { fixtureSav } from '../sandbox/testData';
import { TaskHost } from './TaskHost';
import type { TaskDef } from './types';

type Dummy = { clicks: number };
const dummy: TaskDef<Dummy> = {
  id: 's10', title: 'Attrappe', role: 'Testrolle', intro: 'Nur für Tests.', requiredVariables: ['pa02a'],
  initial: () => ({ clicks: 0 }),
  parse: raw => ({ clicks: typeof (raw as Dummy)?.clicks === 'number' ? (raw as Dummy).clicks : 0 }),
  status: s => s.clicks > 0 ? 'running' : 'open',
  Component: ({ state }) => createElement('p', null, `Klicks: ${state.clicks}`),
};
const data = { sav: fixtureSav(), fileName: 'ZA8831_v1-3-0.sav', version: 'v1.3.0', bytes: new ArrayBuffer(0) };
const host = (props: Partial<Parameters<typeof TaskHost<Dummy>>[0]>) => renderToStaticMarkup(createElement(TaskHost<Dummy>, {
  def: dummy, data, raw: undefined, onRaw: () => {}, onData: () => {}, onConcept: () => {}, ...props,
}));

test('asks for the file first, then checks variables, then shows the task with restored state', () => {
  const empty = host({ data: null });
  assert.match(empty, /AUFGABE · TESTROLLE/);
  assert.match(empty, /ALLBUS-Datei hierher ziehen/);
  assert.match(host({ def: { ...dummy, requiredVariables: ['gibtesnicht'] } }), /fehlen in deiner Datei die Variablen gibtesnicht/);
  assert.match(host({}), /Klicks: 0/);
  assert.match(host({ raw: { clicks: 3 } }), /Klicks: 3/);
  assert.match(host({ raw: { clicks: 'x' } }), /Klicks: 0/);
});

test('the remove button is hidden until a stored file exists', async () => {
  const { renderSession } = await import('./testRender');
  assert.doesNotMatch(renderSession(0), /Gespeicherte ALLBUS-Datei entfernen/);
});

test('the remove-file status line is always in the page, empty until a file is removed', async () => {
  const { renderSession } = await import('./testRender');
  assert.match(renderSession(0), /<p class="learning-forget-status" role="status"><\/p>/);
});

test('removing the stored file announces it and moves focus to the session heading', async () => {
  const { forgetStoredFile, FORGOTTEN_TEXT } = await import('../components/LearningPath');
  const calls: string[] = [];
  const g = globalThis as Record<string, unknown>;
  const before = { document: g.document, raf: g.requestAnimationFrame };
  g.requestAnimationFrame = (fn: () => void) => { fn(); return 0; };
  g.document = { getElementById: (id: string) => ({ focus: () => calls.push(`focus ${id}`) }) };
  try {
    await forgetStoredFile(async () => { calls.push('forget'); }, text => calls.push(`say ${text}`));
  } finally {
    g.document = before.document;
    g.requestAnimationFrame = before.raf;
  }
  assert.equal(FORGOTTEN_TEXT, 'Gespeicherte Datei entfernt.');
  assert.deepEqual(calls, ['forget', 'say Gespeicherte Datei entfernt.', 'focus learning-heading']);
});
