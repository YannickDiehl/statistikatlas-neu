import test from 'node:test';
import assert from 'node:assert/strict';
import { rStyleProblems } from '../../tasks/kit/rStyle';
import { judge } from '../answers';
import { parseMarks } from '../workshop/editor';
import { rScript } from '../../../scripts/chapter-r-export';
import * as figures from './bilder';
import {
  A1_AXIS, AGE, BASIS, DW15, ERROR_HELP, FORMS, FR, FR_OPTIONS, HINTS, HS01, LAB, LAB_NAMES, LS01, PREDICTIONS, QUESTIONS,
  REQUIRED, RIDDLE, RIDDLE_FEATURES, RIDDLE_NAMES, SCRIPT, SELF_TEST, TEMPLATES, V2_Q, V3_Q, V4_Q, V4_Q2, WEST_EAST, XT10, ZW, ZWEI,
} from './content';

test('labels and help texts keep code in backticks', () => {
  const label = (id: string) => [...QUESTIONS.a1, ...QUESTIONS.a3, ...QUESTIONS.a4].find(q => q.id === id)!.label;
  assert.equal(label('a1c'), 'Welche Zahl gehört nach `n =` in deine Bildunterschrift?');
  assert.equal(label('a3c'), 'Wie viele Fälle bleiben mit `filter(xt10 <= 180)` übrig?');
  assert.match(label('a3d'), /^Bei `binwidth = 1`:/);
  assert.match(label('a3e'), /`binwidth = 30`\?$/);
  assert.match(label('a4b'), /^Abschneiden mit `filter\(\)`:/);
  const all = [...QUESTIONS.a1, ...QUESTIONS.a3, ...QUESTIONS.a4, V2_Q];
  assert.deepEqual(all.filter(q => q.help).map(q => q.id), ['a1b', 'a3a', 'a3c', 'a4c', 'v2-frage']);
  assert.match(all.find(q => q.id === 'a1b')!.help!, /`allbus %>% frequency\(hs01\)`/);
  for (const [k, steps] of Object.entries(HINTS)) {
    assert.equal(steps.length, 3, k);
    for (const s of steps) assert.doesNotMatch(s, /<\/?code>|&gt;|&lt;/, k);
  }
  assert.match(HINTS.a1[2], /5\.209/);
  assert.match(HINTS.a3[2], /4\.529/);
  assert.match(HINTS.a4[2], /306/);
});

test('every task question has the short name from pruefe() in the prototype', () => {
  const short = (qs: { short?: string }[]) => qs.map(q => q.short);
  assert.deepEqual(short(QUESTIONS.a1), ['Balken ganz rechts', 'Personen im NA-Balken', 'n für die Bildunterschrift', 'häufigste Antwort']);
  assert.deepEqual(short(QUESTIONS.a3), ['Median', 'Histogramm mit einer Säule', 'übrige Fälle', 'Spitze', 'breite Klassen']);
  assert.deepEqual(short(QUESTIONS.a4), ['Hineinzoomen', 'Abschneiden', 'herausgefallene Papierbögen', 'Reihenfolge', 'Bericht']);
  assert.equal(judge(V2_Q, '19,0'), 'right');
  assert.equal(judge(V2_Q, '21'), 'wrong');
});

test('foundation examples and predictions are ported from the prototype', () => {
  assert.equal(ZW.length, 21);
  assert.equal(ZW.filter(v => v === null).length, 1);
  assert.equal(LAB.length, LAB_NAMES.length);
  for (const shape of [...LAB, ZWEI]) assert.equal(shape.length, 11);
  assert.equal(BASIS.length, 11);
  assert.equal([...BASIS].sort((a, b) => a - b)[5], 40);
  assert.equal(FR.length, 5);
  assert.deepEqual(FR.map(f => f.answer), [0, 1, 2, 3, 4]);
  assert.equal(FR_OPTIONS.length, 5);
  assert.equal(V2_Q.target, 19.3);
  assert.equal(V2_Q.kind === 'number' ? V2_Q.tolerance : undefined, 0.8);
  assert.equal(judge(V3_Q, 'rechts'), 'right');
  assert.deepEqual(PREDICTIONS.a1.options, ['sehr gut', 'gut', 'zufriedenstellend', 'weniger gut', 'schlecht']);
  assert.equal(PREDICTIONS.a3.options, undefined);
  assert.deepEqual(PREDICTIONS.a4.options, ['Interview (CAPI)', 'online (CAWI)', 'Papier (MAIL)']);
});

const KEYS = ['start', 'schichten', 'a1v', 'a1n', 'a2', 'a3d', 'a3o', 'a3m', 'a3n', 'a4', 'a4f', 'a4z', 'a4zf', 'frei_a1', 'frei_a2', 'frei_a3', 'frei_a4'];

test('all templates of the prototype are there, the four free ones marked as try-out', () => {
  assert.deepEqual(Object.keys(TEMPLATES).sort(), [...KEYS].sort());
  for (const [key, t] of Object.entries(TEMPLATES)) {
    assert.ok(t.title.length > 0, key);
    assert.equal(!!t.tryOut, key.startsWith('frei_'), key);
  }
});

test('every template passes the R style check of the learning path', () => {
  for (const [key, t] of Object.entries(TEMPLATES)) assert.deepEqual(rStyleProblems(parseMarks(t.code).code), [], key);
});

test('labs() in the learning-path style: one argument per line, closing parenthesis alone', () => {
  assert.match(TEMPLATES.schichten.code, /\n  labs\(\n    title = "Lebenszufriedenheit",\n    caption = "ALLBUS 2023, n = 5\.164, ungewichtet"\n  \)$/);
  assert.match(TEMPLATES.a1n.code, /\n  labs\(\n    title = "⟦Titel⟧",\n    caption = "ALLBUS 2023, n = ⟦Zahl⟧, ungewichtet"\n  \)$/);
});

test('templates follow the session conventions: %>%, drop_na(), no ifelse', () => {
  for (const [key, t] of Object.entries(TEMPLATES)) {
    assert.doesNotMatch(t.code, /\|>/, key);
    assert.doesNotMatch(t.code, /!\s*is\.na/, key);
    assert.doesNotMatch(t.code, /ifelse/, key);
  }
  assert.match(TEMPLATES.start.code, /library\(tidyverse\)\nlibrary\(mariposa\)/);
});

test('every try-out template starts with an executable suggestion', () => {
  for (const [key, t] of Object.entries(TEMPLATES).filter(([, t]) => t.tryOut)) {
    const lines = t.code.split('\n').map(l => l.trim()).filter(Boolean);
    assert.ok(lines[0].startsWith('#'), key);
    assert.ok(lines.some(l => !l.startsWith('#')), key);
    assert.doesNotMatch(t.code, /⟦/, key);
  }
});

test('marks sit where the prototype has them', () => {
  const words = (k: string) => parseMarks(TEMPLATES[k].code).marks.map(m => m.word);
  assert.deepEqual(words('a1n'), ['Titel', 'Zahl']);
  assert.deepEqual(words('a2'), ['pa01', 'pa01']);
  assert.deepEqual(words('a3m'), ['5']);
  assert.deepEqual(words('a4'), ['180']);
  assert.deepEqual(words('a4z'), ['4']);
  assert.deepEqual(words('a4zf'), ['4']);
  assert.deepEqual(words('a1v'), []);
});

test('aggregates are internally consistent', () => {
  assert.equal(LS01.length, 11);
  assert.equal(LS01.reduce((a, b) => a + b, 0), 5164);
  assert.deepEqual(FORMS.map(f => f.id), ['mp05', 'ls01', 'dk11', 'vm18']);
  for (const f of FORMS) assert.equal(f.values.length, f.counts.length, f.id);
  assert.deepEqual(FORMS[1].counts, LS01);
  assert.equal(AGE.length, 99 - 18 + 1);
  assert.equal(AGE.reduce((a, b) => a + b, 0), 5223);
  assert.equal(DW15.length, 91);
  assert.equal(DW15.reduce((a, b) => a + b, 0), 2945);
  assert.equal(HS01.counts.reduce((a, b) => a + b, 0), HS01.valid);
  assert.equal(HS01.valid, 5209);
  assert.equal(HS01.missing, 37);
  assert.equal(XT10.range, XT10.max - XT10.min);
  assert.equal(XT10.n - XT10.over180, XT10.upTo180);
  assert.equal(XT10.byMode.MAIL.n - XT10.byMode.MAIL.nUpTo180, 306);
  assert.equal(WEST_EAST.age[0].n + WEST_EAST.age[1].n, 5223);
});

test('the riddle has four pictures, one wrong name left over', () => {
  assert.deepEqual(Object.keys(RIDDLE), ['A', 'B', 'C', 'D']);
  assert.deepEqual(RIDDLE.B.counts, DW15);
  const used = Object.values(RIDDLE).map(r => r.answer);
  assert.deepEqual(Object.keys(RIDDLE_NAMES).filter(n => !used.includes(n as never)), ['pt03']);
  assert.deepEqual(Object.keys(RIDDLE_FEATURES), ['A', 'B', 'C', 'D']);
});

test('questions carry the targets of the prototype', () => {
  const targets = (qs: typeof QUESTIONS.a1) => qs.map(q => q.target);
  assert.deepEqual(targets(QUESTIONS.a1), ['na', 37, 5209, 'gut']);
  assert.deepEqual(targets(QUESTIONS.a3), [65, 'max', 4529, '60', 'weg']);
  assert.deepEqual(targets(QUESTIONS.a4), ['MAIL', 'CAPI', 306, 'lang', 'ehrlich']);
  assert.deepEqual(REQUIRED, [...QUESTIONS.a1, ...QUESTIONS.a4]);
  const ids = [...QUESTIONS.a1, ...QUESTIONS.a3, ...QUESTIONS.a4, A1_AXIS, V2_Q, V3_Q, V4_Q, V4_Q2].map(q => q.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const q of [...QUESTIONS.a1, ...QUESTIONS.a3, ...QUESTIONS.a4, A1_AXIS, V3_Q, V4_Q, V4_Q2]) {
    if (q.kind === 'choice') assert.ok(q.options.some(o => o.value === q.target), q.id);
    assert.ok(q.label && q.right && q.hint, q.id);
  }
});

test('answers in R and German notation are read as in the prototype', () => {
  const q = (id: string) => [...QUESTIONS.a1, ...QUESTIONS.a3, ...QUESTIONS.a4].find(x => x.id === id)!;
  assert.equal(judge(q('a1b'), '37 Personen'), 'right');
  assert.equal(judge(q('a1c'), '5.209'), 'right');
  assert.equal(judge(q('a3a'), '65.000'), 'right');
  assert.equal(judge(q('a3c'), '4529'), 'right');
  assert.equal(judge(q('a4c'), '306'), 'right');
  assert.equal(judge(V4_Q2, '38'), 'right');
  assert.equal(V4_Q2.right, 'Von neun Personen steht die fünfte in der Mitte: 38 Stunden.');
  assert.equal(A1_AXIS.id, 'a1-achse');
  assert.equal(judge(A1_AXIS, 'null'), 'right');
});

test('self-test, error help and take-away script are complete', () => {
  assert.equal(SELF_TEST.length, 5);
  for (const s of SELF_TEST) assert.ok(s.answer >= 0 && s.answer < s.options.length && s.why, s.question);
  assert.equal(ERROR_HELP.length, 6);
  assert.match(SCRIPT, /^# Sitzung 4: Daten sehen\n/);
  assert.doesNotMatch(SCRIPT, /⟦|⟧/);
  assert.match(SCRIPT, /# ---- Startblock ----\n/);
  assert.doesNotMatch(SCRIPT, /Probier-Werkstatt/);
});

test('the six figures are inline SVG strings, each with its text version from the prototype', () => {
  const names = ['toLabel', 'dropNa', 'kette', 'filter180', 'binwidth', 'zoomFilter'] as const;
  assert.deepEqual(Object.keys(figures.ALT), [...names]);
  for (const n of names) {
    assert.match(figures[n], /^<svg[\s>]/, n);
    assert.doesNotMatch(figures[n], /<\?xml|<!--/, n);
    assert.ok(figures.ALT[n].length >= 40, n);
  }
});

test('the R export holds every template without marks and reads the file from ALLBUS_SAV', () => {
  const r = rScript(TEMPLATES);
  assert.doesNotMatch(r, /⟦|⟧/);
  assert.equal(r.match(/read_spss\(/g)?.length, 1);
  assert.match(r, /allbus <- read_spss\(Sys\.getenv\("ALLBUS_SAV"\)\)/);
  assert.equal(r.match(/^library\(tidyverse\)$/gm)?.length, 1);
  assert.ok(r.indexOf('library(tidyverse)') < r.indexOf('library(mariposa)'));
  for (const [key, t] of Object.entries(TEMPLATES)) {
    const body = parseMarks(t.code).code.split('\n').filter(l => l.trim() && !/^library\(|read_spss\(/.test(l));
    for (const line of body) assert.ok(r.includes(line), `${key}: ${line}`);
  }
});
