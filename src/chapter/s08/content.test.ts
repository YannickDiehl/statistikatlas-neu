import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { rStyleProblems } from '../../tasks/kit/rStyle';
import { judge } from '../answers';
import { parseMarks } from '../workshop/editor';
import { rScript } from '../../../scripts/chapter-r-export';
import { verdict } from './Checks';
import {
  ALPHA_EXAMPLES, ALT, CHECKS, ERROR_HELP, FIVE_ROWS, HINTS, LAB, MP_INDEX, MP_INDEX_N, MP_VALID, PN_COR, PN_MEAN_COR, PN_RBAR,
  PREDICTIONS, QUESTIONS, REQUIRED, SCRIPT, SCRIPT_PARTS, SELF_TEST, TEMPLATES, THREE_ROWS, alphaLabel, alphaStd, type S8Question,
} from './content';

const ALL_Q = [...QUESTIONS.a1, ...QUESTIONS.a2, ...QUESTIONS.a3, ...QUESTIONS.a4];
const q = (id: string) => ALL_Q.find(x => x.id === id)!;
const KEYS = ['start', 'r_rev', 'r_rowmeans', 'r_reliability', 'a1', 'a1w', 'frei_a1', 'a2', 'a2ohne', 'frei_a2', 'a3', 'a3um', 'frei_a3', 'a4', 'frei_a4'];
const PLAN = new URL('../../../docs/entwicklung/spezifikationen/2026-11-23-lernpfad-kapitel/sitzung08.md', import.meta.url);

test('all templates of the plan are there, the four free ones marked as try-out', () => {
  assert.deepEqual(Object.keys(TEMPLATES).sort(), [...KEYS].sort());
  for (const [key, t] of Object.entries(TEMPLATES)) {
    assert.ok(t.title.length > 0, key);
    assert.equal(!!t.tryOut, key.startsWith('frei_'), key);
  }
});

test('every template stands word for word in the plan (with its marks)', () => {
  let plan: string;
  try { plan = readFileSync(PLAN, 'utf8'); } catch { return; }
  for (const [key, t] of Object.entries(TEMPLATES)) assert.ok(plan.includes(t.code.replace(/\n$/, '')), key);
});

test('every template passes the R style check of the learning path', () => {
  for (const [key, t] of Object.entries(TEMPLATES)) assert.deepEqual(rStyleProblems(parseMarks(t.code).code), [], key);
});

test('templates follow the session conventions: %>%, no !is.na, no ifelse, tidyverse before mariposa', () => {
  for (const [key, t] of Object.entries(TEMPLATES)) {
    assert.doesNotMatch(t.code, /\|>/, key);
    assert.doesNotMatch(t.code, /!\s*is\.na/, key);
    assert.doesNotMatch(t.code, /ifelse/, key);
  }
  assert.match(TEMPLATES.start.code, /library\(tidyverse\)\nlibrary\(mariposa\)/);
});

test('each template uses only objects it builds itself (besides allbus)', () => {
  const built = (code: string) => [...code.matchAll(/^\s*(\w+)\s*=\s*(?:rec|row_means|row_sums)\(/gm)].map(m => m[1]);
  const all = Object.values(TEMPLATES).flatMap(t => built(t.code));
  for (const [key, t] of Object.entries(TEMPLATES)) {
    const own = new Set(built(t.code));
    const code = parseMarks(t.code).code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
    for (const name of new Set(all)) {
      if (new RegExp(`\\b${name}\\b`).test(code)) assert.ok(own.has(name), `${key} uses ${name} without building it`);
    }
    // Nothing is stored for later templates: only the start block assigns with <-.
    if (key !== 'start') assert.doesNotMatch(code, /<-/, key);
  }
});

test('every try-out template starts with an executable suggestion and has no marks', () => {
  for (const [key, t] of Object.entries(TEMPLATES).filter(([, t]) => t.tryOut)) {
    const lines = t.code.split('\n').map(l => l.trim()).filter(Boolean);
    assert.ok(lines[0].startsWith('#'), key);
    assert.ok(lines.some(l => !l.startsWith('#')), key);
    assert.doesNotMatch(t.code, /⟦/, key);
  }
});

test('marks sit where the plan has them', () => {
  const words = (k: string) => parseMarks(TEMPLATES[k].code).marks.map(m => m.word);
  assert.deepEqual(words('a1'), ['7']);
  assert.deepEqual(words('a2ohne'), ['pa29, ']);
  assert.deepEqual(words('a3um'), ['mm02', 'mm05']);
  assert.deepEqual(words('a4'), ['zustimmungen']);
  for (const k of ['start', 'r_rev', 'r_rowmeans', 'r_reliability', 'a1w', 'a2', 'a3']) assert.deepEqual(words(k), [], k);
});

test('questions carry the targets and tolerances of the plan', () => {
  const targets = (qs: S8Question[]) => qs.map(x => x.target);
  assert.deepEqual(targets(QUESTIONS.a1), [3427, 3595, 'eins', 2.646, 'zu']);
  assert.deepEqual(targets(QUESTIONS.a2), [0.833, 'pa29', 'stimmig', 0.842, 'inhalt']);
  assert.deepEqual(targets(QUESTIONS.a3), ['mm02-mm05', 0.177, 0.840, 'vorb', 'richtung']);
  assert.deepEqual(targets(QUESTIONS.a4), [14.2, 21.71, 'ausgleich']);
  const tol = (id: string) => { const x = q(id); return x.kind === 'number' ? x.tolerance ?? 0 : null; };
  assert.deepEqual(['a1a', 'a1b', 'a1d', 'a2a', 'a2d', 'a3b', 'a3c', 'a4a', 'a4b'].map(tol), [0, 0, 0.005, 0.0015, 0.0005, 0.0015, 0.0015, 0.1, 0.1]);
  assert.deepEqual(REQUIRED, [...QUESTIONS.a1, ...QUESTIONS.a2, ...QUESTIONS.a3]);
  const ids = [...ALL_Q, ...Object.values(CHECKS)].map(x => x.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const x of [...ALL_Q, ...Object.values(CHECKS)]) {
    if (x.kind === 'choice') {
      assert.ok(x.options.some(o => o.value === x.target), x.id);
      for (const s of x.special ?? []) assert.ok(x.options.some(o => o.value === s.match), `${x.id}: ${s.match}`);
    }
    assert.ok(x.label && x.right && x.hint, x.id);
  }
});

test('answers in R and German notation are read as planned, special cases get their own text', () => {
  assert.equal(judge(q('a1a'), '3.427'), 'right');
  assert.equal(judge(q('a1a'), '3427 Befragte'), 'right');
  assert.match(verdict(q('a1a'), '3416').text, /Summe der Gewichte/);
  assert.match(verdict(q('a1a'), '3.595').text, /min_valid = 5/);
  assert.equal(judge(q('a1d'), '2,646'), 'right');
  assert.equal(judge(q('a1d'), '2,648'), 'right');
  assert.equal(judge(q('a1d'), '2,65'), 'right');
  assert.match(verdict(q('a1d'), '2,604').text, /ohne Gewicht/);
  assert.match(verdict(q('a1d'), '2.714').text, /Median/);
  assert.equal(judge(q('a2a'), '0.833'), 'right');
  assert.equal(judge(q('a2a'), '0,833'), 'right');
  assert.match(verdict(q('a2a'), '0,83').text, /standardized/);
  assert.match(verdict(q('a2a'), '0,841').text, /McDonalds ω/);
  assert.match(verdict(q('a2d'), '0,348').text, /Trennschärfe/);
  assert.equal(judge(q('a2d'), '0,842'), 'right');
  assert.notEqual(judge(q('a2d'), '0,841'), 'right');
  assert.match(verdict(q('a2d'), '0,841').text, /McDonalds ω/);
  assert.match(TEMPLATES.a3.code, /# Wie stimmig sind die sechs Aussagen zu Islam und Muslimen, /);
  assert.match(verdict(q('a3c'), '0,540').text, /nur mm02/);
  assert.match(verdict(q('a3c'), '0,62').text, /nur mm05/);
  assert.match(verdict(q('a4a'), '15,44').text, /ohne Gewicht/);
  assert.match(verdict(q('a4b'), '7,61 %').text, /genau 2/);
  assert.equal(judge(q('a4b'), '21,7 %'), 'right');
  assert.match(verdict(q('a2b'), 'pa34').text, /zweitschwächste/);
  assert.match(verdict(q('a2b'), 'pa31').text, /kleinste Zahl/);
  assert.equal(verdict(q('a1a'), '').result, 'open');
});

test('foundation checks: targets, special cases and the second right answer in 3b', () => {
  assert.equal(judge(CHECKS.g1b, '1,33'), 'right');
  assert.match(verdict(CHECKS.g1b, '1').text, /als 0/);
  assert.equal(judge(CHECKS.g1c, '66'), 'right');
  assert.match(verdict(CHECKS.g1c, '78,5').text, /genau 3/);
  assert.equal(judge(CHECKS.g2b, '0,844'), 'right');
  assert.match(verdict(CHECKS.g2b, '0,731').text, /vier Items/);
  assert.equal(judge(CHECKS.g3a, '6'), 'right');
  assert.match(verdict(CHECKS.g3a, '5').text, /7 − 2/);
  assert.equal(verdict(CHECKS.g3b, 'fr07-fr08').result, 'right');
  assert.match(verdict(CHECKS.g3b, 'fr07-fr08').text, /^Auch richtig/);
  assert.match(verdict(CHECKS.g3b, 'alle').text, /−0,210/);
  assert.match(verdict(CHECKS.g3b, 'fr07-fr03b').text, /−1,610/);
  assert.equal(verdict(CHECKS.g2a, 'eu').result, 'right');
  assert.match(verdict(CHECKS.g2a, 'gemeinde').text, /^Fast/);
  assert.equal(verdict(CHECKS.g4b, 'mat-misch').result, 'right');
});

test('help texts keep code in backticks, three levels each, numbers as in the plan', () => {
  for (const [k, steps] of Object.entries(HINTS)) {
    assert.equal(steps.length, 3, k);
    for (const s of steps) assert.doesNotMatch(s, /<\/?code>|&gt;|&lt;/, k);
  }
  assert.match(HINTS.a1[2], /3\.427.*3\.595.*2,646/);
  assert.match(HINTS.a2[2], /0,833.*0,348.*0,842/);
  assert.match(HINTS.a3[2], /−0,373.*−0,411.*0,177.*0,840/);
  assert.match(HINTS.a4[2], /14,20.*21,71/);
});

test('predictions before all four tasks, with options', () => {
  assert.deepEqual(Object.keys(PREDICTIONS), ['a1', 'a2', 'a3', 'a4']);
  assert.equal(PREDICTIONS.a2.options.length, 7);
  assert.deepEqual(PREDICTIONS.a3.options, ['mm01 und mm04', 'mm02 und mm05', 'mm03 und mm06']);
});

test('aggregates are internally consistent', () => {
  assert.equal(MP_INDEX.values.length, 17);
  assert.equal(MP_INDEX.percent.length, 17);
  let cum = 0;
  MP_INDEX.percent.forEach((p, i) => { cum += p; assert.ok(Math.abs(cum - MP_INDEX.cum[i]) < 0.03, String(MP_INDEX.values[i])); });
  assert.equal(MP_INDEX.cum[7], MP_INDEX.below3);
  assert.equal(Math.round((100 - MP_INDEX.cum[8]) * 100) / 100, MP_INDEX.above3);
  assert.equal(MP_VALID.all4 + MP_VALID.three + MP_VALID.two + MP_VALID.one, MP_INDEX_N.none);
  assert.equal(MP_VALID.all4 + MP_VALID.three, MP_INDEX_N.min3);
  // Mittlere Korrelationen aus der Tabelle
  PN_MEAN_COR.forEach((m, i) => assert.equal(Math.round(PN_COR[i].filter((_, j) => j !== i).reduce((a, b) => a + b, 0) / 3 * 1000) / 1000, m));
  const six = [PN_COR[0][1], PN_COR[0][2], PN_COR[0][3], PN_COR[1][2], PN_COR[1][3], PN_COR[2][3]];
  assert.equal(Math.round(six.reduce((a, b) => a + b, 0) / 6 * 1000) / 1000, PN_RBAR);
  for (const [k, r, a] of ALPHA_EXAMPLES) assert.equal(Math.round(alphaStd(k, r) * 1000) / 1000, a, `${k} ${r}`);
  assert.deepEqual([0.9, 0.8, 0.7, 0.6, 0.59, -0.1].map(alphaLabel), ['Excellent', 'Good', 'Acceptable', 'Questionable', 'Poor', 'negative; check item coding']);
  // Umpol-Labor: 16 Zustände, je zwei gespiegelte gleich
  assert.equal(Object.keys(LAB).length, 16);
  const mirror = (k: string) => k.split('').map(c => (c === 'U' ? '-' : 'U')).join('');
  for (const [k, v] of Object.entries(LAB)) assert.deepEqual(LAB[mirror(k)].slice(0, 1), v.slice(0, 1), k);
  // Beispiele: Mittelwerte der konstruierten Reihen
  const mean = (vs: (number | null)[]) => { const g = vs.filter((x): x is number => x !== null); return g.reduce((a, b) => a + b, 0) / g.length; };
  assert.deepEqual(THREE_ROWS.map(r => Math.round(mean(r.values) * 100) / 100), [2.75, 1.33, 4]);
  assert.deepEqual(FIVE_ROWS.slice(0, 3).map(r => Math.round(mean(r) * 100) / 100), [2.43, 2.33, 1.4]);
  assert.deepEqual(FIVE_ROWS.map(r => r.filter(x => x !== null).length), [7, 6, 5, 2, 0]);
});

test('text versions of all pictures have at least 40 characters', () => {
  for (const [k, v] of Object.entries(ALT)) assert.ok(v.length >= 40, k);
});

test('self-test, error help and take-away script are complete', () => {
  assert.equal(SELF_TEST.length, 5);
  for (const s of SELF_TEST) assert.ok(s.answer >= 0 && s.answer < s.options.length && s.why, s.question);
  assert.equal(ERROR_HELP.length, 15);
  assert.match(SCRIPT, /^# Sitzung 8: Index und Skala\n/);
  assert.match(SCRIPT, /# In Aufgabe 3 \(a3um\) musst du mm02 und mm05/);
  assert.doesNotMatch(SCRIPT, /⟦|⟧/);
  assert.deepEqual(SCRIPT_PARTS, ['start', 'r_rev', 'r_rowmeans', 'r_reliability', 'a1', 'a1w', 'a2', 'a2ohne', 'a3', 'a3um', 'a4']);
  for (const k of SCRIPT_PARTS) assert.ok(SCRIPT.includes(`# ---- ${TEMPLATES[k].title} ----\n`), k);
  assert.doesNotMatch(SCRIPT, /Probier-Werkstatt|t_test|crosstab/);
});

test('no middle dot and no „(fiktiv)“ in the chapter data', () => {
  const all = JSON.stringify([QUESTIONS, CHECKS, HINTS, ERROR_HELP, SELF_TEST, ALT, PREDICTIONS]);
  assert.doesNotMatch(all, /·/);
  assert.doesNotMatch(all, /fiktiv/);
});

test('the R export holds every template without marks and reads the file from ALLBUS_SAV', () => {
  const r = rScript(TEMPLATES);
  assert.doesNotMatch(r, /⟦|⟧/);
  assert.equal(r.match(/read_spss\(/g)?.length, 1);
  assert.match(r, /allbus <- read_spss\(Sys\.getenv\("ALLBUS_SAV"\)\)/);
  for (const [key, t] of Object.entries(TEMPLATES)) {
    const body = parseMarks(t.code).code.split('\n').filter(l => l.trim() && !/^library\(|read_spss\(/.test(l));
    for (const line of body) assert.ok(r.includes(line), `${key}: ${line}`);
  }
});
