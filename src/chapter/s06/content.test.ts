import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { rStyleProblems } from '../../tasks/kit/rStyle';
import { pearson, spearman } from '../../tasks/kit/stats';
import { judge } from '../answers';
import { parseMarks } from '../workshop/editor';
import { rScript } from '../../../scripts/chapter-r-export';
import {
  ASSIGN, EASTWEST, ERROR_HELP, HINTS, LAB_PEOPLE, LAB_STEPS, LAB_Z, MEASURE_OPTIONS, MIX_P, PERSONS, PREDICTIONS, QUESTIONS,
  REQUIRED, SCRIPT, SCRIPT_IDEAS, SCRIPT_PARTS, SELF_TEST, TABLE_100, TEMPLATES, THINK, WEIGHT, mix,
} from './content';
import { chiParts } from './figures/Crosstab';
import { PAIRS, pairCounts } from './figures/Pairs';
import { labData } from './figures/Correlation';

const KEYS = ['start', 'lesen_gewicht', 'lesen_mass', 'a1a', 'a1b', 'frei_a1', 'a2b', 'a2c', 'frei_a2', 'a3a', 'a3b', 'frei_a3', 'a4a', 'a4b', 'a4c', 'frei_a4'];

test('all templates of the plan are there, the four free ones marked as try-out', () => {
  assert.deepEqual(Object.keys(TEMPLATES).sort(), [...KEYS].sort());
  for (const [key, t] of Object.entries(TEMPLATES)) {
    assert.ok(t.title.length > 0, key);
    assert.equal(!!t.tryOut, key.startsWith('frei_'), key);
  }
});

test('every template is word for word an r-block of sitzung06.md', () => {
  const md = readFileSync(new URL('../../../docs/entwicklung/spezifikationen/2026-11-23-lernpfad-kapitel/sitzung06.md', import.meta.url), 'utf8');
  const blocks = [...md.matchAll(/```r\n([\s\S]*?)\n```/g)].map(m => m[1]);
  assert.equal(blocks.length, KEYS.length);
  for (const [key, t] of Object.entries(TEMPLATES)) assert.ok(blocks.includes(t.code.replace(/\n+$/, '')), key);
});

test('every template passes the R style check and the session conventions', () => {
  for (const [key, t] of Object.entries(TEMPLATES)) {
    assert.deepEqual(rStyleProblems(parseMarks(t.code).code), [], key);
    assert.doesNotMatch(t.code, /\|>/, key);
    assert.doesNotMatch(t.code, /!\s*is\.na/, key);
    assert.doesNotMatch(t.code, /ifelse/, key);
  }
  assert.match(TEMPLATES.start.code, /library\(tidyverse\)\nlibrary\(mariposa\)/);
});

test('every template only uses objects it builds itself (besides allbus)', () => {
  const builtIn = new Set(['allbus']);
  for (const [key, t] of Object.entries(TEMPLATES)) {
    const code = parseMarks(t.code).code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
    const made = new Set([...code.matchAll(/(\w+)\s*(?:<-|=\s*rec\()/g)].map(m => m[1]));
    // new variables used as arguments: zufrieden, zufriedenheit must be made in the same template
    for (const v of ['zufrieden', 'zufriedenheit']) {
      const used = new RegExp(`[(,]\\s*${v}\\b`).test(code);
      if (used) assert.ok(made.has(v), `${key} uses ${v} without building it`);
    }
    const assigned = [...code.matchAll(/^(\w+) <-/gm)].map(m => m[1]);
    for (const a of assigned) assert.ok(builtIn.has(a), `${key}: only allbus is (re)assigned, found ${a}`);
  }
});

test('marks sit where the plan has them (line 3 and 7 in A1, line 7 in A4)', () => {
  const marks = (k: string) => parseMarks(TEMPLATES[k].code).marks.map(m => [m.line + 1, m.word]);
  assert.deepEqual(marks('a1b'), [[3, '2'], [7, '2']]);
  assert.deepEqual(marks('a4c'), [[7, '1']]);
  for (const k of KEYS.filter(k => !['a1b', 'a4c'].includes(k))) assert.deepEqual(marks(k), [], k);
});

test('every try-out template starts with a comment and an executable suggestion', () => {
  for (const [key, t] of Object.entries(TEMPLATES).filter(([, t]) => t.tryOut)) {
    const lines = t.code.split('\n').map(l => l.trim()).filter(Boolean);
    assert.ok(lines[0].startsWith('# Eine Idee:'), key);
    assert.ok(lines.some(l => !l.startsWith('#')), key);
  }
});

test('questions carry the targets and tolerances of the plan', () => {
  const t = (qs: typeof QUESTIONS.a1) => qs.map(q => [q.id, q.target, q.kind === 'number' ? q.tolerance : undefined]);
  assert.deepEqual(t(QUESTIONS.a1), [['a1-ungewichtet', 70.73, 0.1], ['a1-gewichtet', 73.58, 0.1], ['a1-ost', 58.5, 0.1], ['a1-west', 76.6, 0.1], ['a1-warum', 'a', undefined]]);
  assert.deepEqual(t(QUESTIONS.a2), [['a2-niveau', 'nominal', undefined], ['a2-gruene', 92.9, 0.1], ['a2-afd', 22.8, 0.1], ['a2-v', 0.4783, 0.005], ['a2-staerke', 'mittel', undefined], ['a2-richtung', 'a', undefined]]);
  assert.deepEqual(t(QUESTIONS.a3), [['a3-gamma', -0.5444, 0.005], ['a3-tau', -0.387, 0.005], ['a3-richtung', 'a', undefined], ['a3-staerke', 'mittel', undefined], ['a3-warum', 'a', undefined]]);
  assert.deepEqual(t(QUESTIONS.a4), [['a4-r', 0.265, 0.0005], ['a4-rho', 0.268, 0.0005], ['a4-staerke', 'schwach', undefined], ['a4-west', 0.267, 0.0005], ['a4-ost', 0.239, 0.0005], ['a4-dritt', 'a', undefined], ['a4-satz', 'b', undefined]]);
  assert.deepEqual(REQUIRED, [...QUESTIONS.a1, ...QUESTIONS.a2, ...QUESTIONS.a3]);
  const all = [...Object.values(QUESTIONS).flat(), ...Object.values(THINK)];
  const ids = [...all.map(q => q.id), ...ASSIGN.map(a => a.id), ...Object.values(PREDICTIONS).map(p => p.id)];
  assert.equal(new Set(ids).size, ids.length);
  for (const q of all) {
    if (q.kind === 'choice') assert.ok(q.options.some(o => o.value === q.target), q.id);
    assert.ok(q.label && q.right && q.hint && q.short, q.id);
  }
});

test('answers: German, R and minus notations; unweighted and neighbouring values are wrong', () => {
  const q = (id: string) => [...Object.values(QUESTIONS).flat(), ...Object.values(THINK)].find(x => x.id === id)!;
  assert.equal(judge(q('a1-ungewichtet'), '70,73'), 'right');
  assert.equal(judge(q('a1-gewichtet'), '73.58 %'), 'right');
  assert.equal(judge(q('a1-gewichtet'), '70,73'), 'wrong');
  for (const v of ['58,45', '58,56']) assert.equal(judge(q('a1-ost'), v), 'right', v);
  for (const v of ['76,64', '76,63']) assert.equal(judge(q('a1-west'), v), 'right', v);
  assert.equal(judge(q('a2-v'), '0.4783119'), 'right');
  assert.equal(judge(q('a2-v'), '0,478'), 'right');
  assert.equal(judge(q('a2-v'), '0,484'), 'wrong');
  for (const v of ['-0.5444373', '−0,544', '–0,54']) assert.equal(judge(q('a3-gamma'), v), 'right', v);
  assert.equal(judge(q('a3-gamma'), '0,544'), 'wrong');
  assert.equal(judge(q('a3-gamma'), '-0,553'), 'wrong');
  assert.equal(judge(q('a3-tau'), '-0.387'), 'right');
  assert.equal(judge(q('a3-tau'), '-0.393'), 'wrong');
  // A4: r, ρ, West, Ost and r unweighted are told apart (tolerance 0,0005)
  const values = [0.265, 0.268, 0.267, 0.239, 0.26];
  for (const id of ['a4-r', 'a4-rho', 'a4-west', 'a4-ost']) {
    const hits = values.filter(v => judge(q(id), String(v)) === 'right');
    assert.equal(hits.length, 1, id);
  }
  assert.equal(judge(THINK.g1b, '0,34'), 'right');
  assert.equal(judge(THINK.g2a, '8,8'), 'right');
  assert.equal(judge(THINK.g3b, '0,5'), 'right');
});

test('constructed examples: weights, mixing desk, table with 100 respondents', () => {
  assert.equal(Math.round(EASTWEST.west.wPct / EASTWEST.west.pct * 100) / 100, WEIGHT.west);
  assert.equal(Math.round(EASTWEST.east.wPct / EASTWEST.east.pct * 100) / 100, WEIGHT.east);
  assert.equal(Math.round(EASTWEST.west.n * EASTWEST.west.wPct / EASTWEST.west.pct), EASTWEST.west.wSum);
  assert.equal(Math.round(EASTWEST.east.n * EASTWEST.east.wPct / EASTWEST.east.pct), EASTWEST.east.wSum);
  const r1 = (x: number) => Math.round(x * 10) / 10;
  assert.deepEqual([0, MIX_P.germany, MIX_P.sample, 50, 100].map(p => r1(mix(p / 100))), [33.7, 41.0, 47.7, 55.6, 77.5]);
  const p = chiParts(TABLE_100.observed);
  assert.deepEqual(p.expected.flat().map(v => Math.round(v * 10) / 10), [44.8, 35.2, 11.2, 8.8]);
  assert.deepEqual(p.deviation.flat().map(v => Math.round(v * 10) / 10), [7.2, -7.2, -7.2, 7.2]);
  assert.deepEqual(p.contribution.flat().map(v => Math.round(v * 100) / 100), [1.16, 1.47, 4.63, 5.89]);
  assert.equal(Math.round(p.chi2 * 100) / 100, 13.15);
  assert.equal(Math.round(p.phi * 100) / 100, 0.36);
  assert.equal(Math.round(chiParts(TABLE_100.observed.map(r => r.map(c => 2 * c))).chi2 * 100) / 100, 26.3);
});

test('constructed examples: five persons give 6, 2, 1, 1 pairs, Gamma 0,5 and Tau-b 0,44', () => {
  assert.equal(PERSONS.length, 5);
  assert.deepEqual(PAIRS.map(p => p.id), ['AB', 'AC', 'AD', 'AE', 'BC', 'BD', 'BE', 'CD', 'CE', 'DE']);
  const c = pairCounts(Object.fromEntries(PAIRS.map(p => [p.id, true as const])));
  assert.deepEqual(c, { con: 6, dis: 2, tieLayer: 1, tieHealth: 1 });
  assert.equal((c.con - c.dis) / (c.con + c.dis), 0.5);
  assert.equal(Math.round((c.con - c.dis) / Math.sqrt((c.con + c.dis + c.tieLayer) * (c.con + c.dis + c.tieHealth)) * 100) / 100, 0.44);
  assert.equal(PAIRS.find(p => p.id === 'CD')!.kind, 'Bindung Schicht');
  assert.equal(PAIRS.find(p => p.id === 'BE')!.kind, 'Bindung Gesundheit');
});

test('constructed examples: eight persons, r and ρ for every step of person B, z-values', () => {
  const r3 = (x: number) => Math.round(x * 1000) / 1000;
  for (const s of LAB_STEPS) {
    const d = labData(s.minutes);
    assert.equal(r3(d.r), s.r, `r at ${s.minutes}`);
    assert.equal(r3(d.rho), s.rho, `rho at ${s.minutes}`);
  }
  const ages = LAB_PEOPLE.map(p => p.age), mins = LAB_PEOPLE.map(p => p.minutes);
  const mean = (x: number[]) => x.reduce((a, b) => a + b, 0) / x.length;
  const sd = (x: number[]) => Math.sqrt(x.reduce((a, v) => a + (v - mean(x)) ** 2, 0) / (x.length - 1));
  const z = (x: number[]) => x.map(v => (v - mean(x)) / sd(x));
  const r2 = (x: number) => Math.round(x * 100) / 100 + 0;
  assert.deepEqual(z(ages).map(r2), LAB_Z.age);
  assert.deepEqual(z(mins).map(r2), LAB_Z.minutes);
  const prod = z(ages).map((v, i) => v * z(mins)[i]);
  assert.deepEqual(prod.map(r2), LAB_Z.products);
  assert.equal(r2(prod.reduce((a, b) => a + b, 0)), LAB_Z.sum);
  assert.equal(mean(mins), 59);
  assert.equal(r3(pearson(ages, mins)), 0.974);
  assert.equal(r3(spearman(ages, mins)), 0.952);
});

test('predictions, hints, overview assignment, self-test and error help are complete', () => {
  assert.deepEqual(Object.values(PREDICTIONS).map(p => p.id), ['a1-tipp', 'a2-tipp', 'a3-tipp', 'a4-tipp']);
  for (const p of Object.values(PREDICTIONS)) assert.ok(p.options.length >= 3 && p.resolution, p.id);
  for (const [k, steps] of Object.entries(HINTS)) {
    assert.equal(steps.length, 3, k);
    for (const s of steps) assert.doesNotMatch(s, /<\/?code>|&gt;|&lt;/, k);
  }
  assert.match(HINTS.a1[2], /73,58/);
  assert.match(HINTS.a2[2], /0,478/);
  assert.match(HINTS.a3[2], /−0,544/);
  assert.match(HINTS.a4[2], /0,265/);
  assert.deepEqual(ASSIGN.map(a => MEASURE_OPTIONS[a.answer]), ['Cramér-V', 'Phi', 'Tau-b', 'Pearson-r', 'Spearman-ρ']);
  assert.equal(SELF_TEST.length, 5);
  assert.deepEqual(SELF_TEST.map(s => s.answer), [0, 0, 1, 1, 1]);
  for (const s of SELF_TEST) assert.ok(s.answer < s.options.length && s.why, s.question);
  assert.equal(ERROR_HELP.length, 8);
});

test('texts: no „(fiktiv)“, no middle dot next to numbers', () => {
  const texts = JSON.stringify([QUESTIONS, THINK, HINTS, PREDICTIONS, ASSIGN, SELF_TEST, ERROR_HELP]);
  assert.doesNotMatch(texts, /fiktiv/i);
  assert.doesNotMatch(texts, /·/);
});

test('take-away script: all templates in the planned order, marks with their example value, ideas at the end', () => {
  assert.match(SCRIPT, /^# Sitzung 6: Gewichtung und Zusammenhang\n/);
  assert.doesNotMatch(SCRIPT, /⟦|⟧/);
  let at = -1;
  for (const k of [...SCRIPT_PARTS, ...SCRIPT_IDEAS]) {
    const i = SCRIPT.indexOf(parseMarks(TEMPLATES[k].code).code.replace(/\n+$/, ''));
    assert.ok(i > at, k);
    at = i;
  }
  assert.ok(SCRIPT.indexOf('# ---- Ideen zum Weiterdenken ----') < SCRIPT.indexOf(TEMPLATES.frei_a1.code.split('\n')[0]));
  assert.match(SCRIPT, /# Für den Westen: in beiden filter\(\)-Zeilen 2 durch 1 ersetzen/);
  assert.match(SCRIPT, /# Für den Osten: 1 durch 2 ersetzen/);
  assert.equal(SCRIPT.match(/read_spss\(/g)?.length, 1);
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
