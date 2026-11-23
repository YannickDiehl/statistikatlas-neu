// Läuft nur mit der eigenen GESIS-Datei: ALLBUS_SAV=/pfad/ZA8831_v1-3-0.sav node --import tsx --test src/chapter/s01/*.test.ts
// Prüft jede feste Zahl und jeden Suchtreffer von Sitzung 1 gegen ZA8831 v1.3.0 (ungewichtet).
// find_var() wird nachgebaut wie in mariposa 0.7.4: Suchwort klein, Name oder Variablenlabel klein enthält es (fixed).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { isMissingCode, readSav, type SavFile } from '../../sandbox/readSav';
import {
  CELLS, DAYS, DAYS_WITH_POINT, DIM, EAST, FIND_VAR_ROWS, LAB, LABELS, LI04, PI08, PI08_HEAD, PT03, PT15, PT_IN_NAMES, QUESTIONS,
  RH08B, RH09B_UNKNOWN, SEARCHES, TNZ, TRUST, freqTotals, type Freq,
} from './content';

const file = process.env.ALLBUS_SAV;
const skip = !file && 'ALLBUS_SAV nicht gesetzt';
let cached: SavFile | null = null;
const load = () => {
  if (cached) return cached;
  const bytes = readFileSync(file!);
  return (cached = readSav(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)));
};
const column = (name: string) => {
  const v = load().byName.get(name);
  assert.ok(v, name);
  return v;
};
/** Anzahl der Befragten mit genau diesem Code (auch negative Missing-Codes). */
const nCode = (name: string, code: number) => column(name).values.filter(x => x === code).length;
const nValid = (name: string) => { const v = column(name); return v.values.filter(x => !isMissingCode(v, x)).length; };
/** find_var(allbus, word, search) wie in mariposa: Spaltennummer, Name, Variablenlabel. */
const findVar = (word: string, search: 'name_label' | 'name' = 'name_label') => {
  const w = word.toLowerCase();
  return load().variables.map((v, i) => ({ col: i + 1, name: v.name, label: v.label }))
    .filter(v => v.name.toLowerCase().includes(w) || (search === 'name_label' && v.label.toLowerCase().includes(w)));
};

test('dim(allbus), cells, days and the share of the east', { skip }, () => {
  const sav = load();
  assert.deepEqual([sav.nCases, sav.variables.length], [DIM.rows, DIM.cols]);
  assert.equal(sav.nCases * sav.variables.length, CELLS);
  assert.equal((CELLS / 60 / 60 / 24).toFixed(5), DAYS);
  assert.equal(Math.round(5.246 * 579 / 60 / 60 / 24 * 10000) / 10000, DAYS_WITH_POINT);
  const ew = column('eastwest');
  assert.equal(ew.valueLabels.get(2), 'NEUE BUNDESLAENDER');
  assert.equal(nCode('eastwest', 2), EAST.n);
  assert.equal(Math.round(100 * EAST.n / sav.nCases), EAST.percent);
  const q = QUESTIONS.a1;
  assert.deepEqual([q[0].target, q[1].target], [sav.nCases, sav.variables.length]);
});

test('search lab: every hit with position and label, exactly as find_var() prints it', { skip }, () => {
  for (const w of LAB) assert.deepEqual(findVar(w.word), w.hits, w.word);
  for (const [name, label] of FIND_VAR_ROWS) assert.equal(column(name).label, label, name);
  assert.deepEqual(findVar('buecher').map(v => v.name), ['la01']);
  assert.deepEqual(findVar('HOROSKOP').map(v => v.name), ['rh08b'], 'case does not matter');
  const names = load().variables.map(v => v.name);
  assert.deepEqual(names.slice(16, 24), ['lm27', 'lm28', 'lm29', 'lm30', 'lm31', 'lm32', 'lm33', 'lm34']);
  assert.deepEqual(names.slice(0, 6), ['za_nr', 'doi', 'version', 'respid', 'substudy', 'mode']);
});

test('every search word of the chapter finds exactly the named variables', { skip }, () => {
  for (const [word, hits] of Object.entries(SEARCHES)) assert.deepEqual(findVar(word).map(v => v.name), hits, word);
  const trust = findVar('vertrauen').map(v => v.name);
  assert.equal(trust.length, TRUST.hits);
  for (const n of TRUST.among) assert.ok(trust.includes(n), n);
  assert.ok(!findVar('politik').some(v => /VERTRAUEN/.test(v.label)));
  assert.equal(findVar('pt', 'name').length, PT_IN_NAMES);
  for (const [name, label] of Object.entries(LABELS)) assert.equal(column(name).label, label, name);
  for (const n of ['mp16', 'mp17', 'mp18', 'mp19']) assert.match(column(n).label, /^FLUECHTL\. CHANCE O\.RISIKO/, n);
  assert.equal(QUESTIONS.a2.find(q => q.id === 'a2-fluecht')!.target, findVar('fluecht').length);
  assert.equal(QUESTIONS.a4.find(q => q.id === 'a4-nachbar')!.target, findVar('nachbar').length);
  assert.equal(QUESTIONS.a4.find(q => q.id === 'a4-kirche')!.target, findVar('kirche').length);
});

/** Codes, Wertelabels und N einer Tabelle gegen die Datei; gültig heißt: kein Missing-Code. */
function checkFreq(f: Freq) {
  const v = column(f.name);
  assert.equal(v.label, f.label, f.name);
  for (const r of f.rows) {
    assert.equal(nCode(f.name, r.value), r.n, `${f.name} ${r.value}`);
    assert.equal(v.valueLabels.get(r.value), r.label, `${f.name} ${r.value}`);
    assert.equal(isMissingCode(v, r.value), r.value < 0, `${f.name} ${r.value} missing`);
  }
  const t = freqTotals(f);
  assert.equal(nValid(f.name), t.valid, f.name);
  assert.equal(t.total, v.values.length, f.name);
}

test('pi08, rh08b and pt03: codes, value labels, N, valid and missing', { skip }, () => {
  for (const f of [PI08, RH08B, PT03]) checkFreq(f);
  const xs = column('pi08').values.filter(x => x > 0), n = xs.length;
  const mean = xs.reduce((a, b) => a + b, 0) / n;
  const sd = Math.sqrt(xs.reduce((a, b) => a + (b - mean) ** 2, 0) / (n - 1));
  // Schiefe wie SPSS und mariposa (G1 mit Stichprobenkorrektur).
  const skew = n / ((n - 1) * (n - 2)) * xs.reduce((a, b) => a + ((b - mean) / sd) ** 3, 0);
  assert.deepEqual([mean.toFixed(2), sd.toFixed(2), skew.toFixed(2)], [PI08_HEAD.mean, PI08_HEAD.sd, PI08_HEAD.skewness]);
  const target = (id: string) => QUESTIONS.a3.find(q => q.id === id)!.target;
  assert.equal(target('a3-kenne'), nCode('rh08b', -6));
  assert.equal(target('a3-gueltig-rh'), nValid('rh08b'));
  assert.equal(target('a3-split'), nCode('pt03', -11));
  assert.equal(target('a3-gueltig-pt'), nValid('pt03'));
  assert.equal(DIM.rows - nCode('pi08', -11), 3599);
  assert.equal(Math.round(100 * (DIM.rows - nCode('pt03', -11)) / DIM.rows), 70);
});

test('TNZ examples, pt15, rh09b and li04', { skip }, () => {
  assert.equal(nCode('lm30', -10), TNZ.lm30Filter);
  assert.equal(column('lm30').valueLabels.get(-10), 'TNZ: FILTER');
  assert.equal(nCode('xr19', -15), TNZ.xr19Mode);
  assert.equal(column('xr19').valueLabels.get(-15), 'TNZ: MODE');
  assert.equal(nCode('mode', 3), TNZ.xr19Mode);
  assert.deepEqual([nCode('pt15', 1), nCode('pt15', 7), nValid('pt15')], [PT15.none, PT15.great, PT15.valid]);
  assert.equal(nCode('rh09b', -6), RH09B_UNKNOWN);
  assert.equal(column('rh09b').valueLabels.get(-6), 'KENNE ICH NICHT');
  assert.deepEqual([nCode('li04', 7), nValid('li04')], [LI04.code7, LI04.valid]);
  const a4 = (id: string) => QUESTIONS.a4.find(q => q.id === id)!.target;
  assert.deepEqual([a4('a4-tarot'), a4('a4-freunde')], [RH09B_UNKNOWN, LI04.code7]);
});
