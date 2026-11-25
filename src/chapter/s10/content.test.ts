import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { rStyleProblems } from '../../tasks/kit/rStyle';
import { ols } from '../../tasks/kit/ols';
import { answerNumbers, judge } from '../answers';
import { parseMarks } from '../workshop/editor';
import { rScript } from '../../../scripts/chapter-r-export';
import { wrongText } from './Check';
import {
  A2, ASSIGN, ASSIGN_OPTIONS, B1, DICE, ERROR_HELP, HINTS, INFLUENCE_POINTS, INFLUENCE_STATES, MSTAT_PREDICTIONS, OUTPUT_BLOCKS,
  OUTPUT_LINES, PREDICTIONS, QUESTIONS, REFERENCES, REQUIRED, RESOLUTIONS, SCRIPT, SELF_TEST, TEMPLATES, THINK, solve, type S10Question,
} from './content';

const PLAN = readFileSync(new URL('../../../docs/entwicklung/spezifikationen/2026-11-23-lernpfad-kapitel/sitzung10.md', import.meta.url), 'utf8');
const ALL_TASK = [...QUESTIONS.a1, ...QUESTIONS.a2, ...QUESTIONS.a3, ...QUESTIONS.a4];
const ALL = [...ALL_TASK, ...Object.values(THINK)];
const q = (id: string) => ALL.find(x => x.id === id)!;

const KEYS = ['start', 'r_modell', 'r_dummy', 'a1', 'a2', 'a2_rechnen', 'a3', 'a3_ost', 'a4', 'a4_rechnen', 'frei_a1', 'frei_a2', 'frei_a3', 'frei_a4'];

test('all templates of the plan are there, the four free ones marked as try-out', () => {
  assert.deepEqual(Object.keys(TEMPLATES).sort(), [...KEYS].sort());
  for (const [key, t] of Object.entries(TEMPLATES)) {
    assert.ok(t.title.length > 0, key);
    assert.equal(!!t.tryOut, key.startsWith('frei_'), key);
  }
});

test('every template stands word for word in the plan (a3_ost without its optional mark, E13)', () => {
  for (const [key, t] of Object.entries(TEMPLATES)) {
    const code = key === 'a3_ost' ? t.code.replace('demo ~ ost,', 'demo ~ ⟦ost⟧,') : t.code;
    assert.ok(PLAN.includes('```r\n' + code + '\n```'), key);
  }
  assert.deepEqual(parseMarks(TEMPLATES.a3_ost.code).marks, []);
});

test('every template passes the R style check: %>%, no |>, no !is.na, no ifelse', () => {
  for (const [key, t] of Object.entries(TEMPLATES)) {
    const code = parseMarks(t.code).code;
    assert.deepEqual(rStyleProblems(code), [], key);
    assert.doesNotMatch(code, /\|>/, key);
    assert.doesNotMatch(code, /!\s*is\.na/, key);
    assert.doesNotMatch(code, /ifelse/, key);
  }
  assert.match(TEMPLATES.start.code, /library\(tidyverse\)\nlibrary\(mariposa\)/);
});

/** Objects a template creates: variables in mutate(), dummies from to_dummy(x). */
function made(code: string): Set<string> {
  const out = new Set<string>();
  for (const m of code.matchAll(/^\s*(\w+)\s*=\s*rec\(/gm)) out.add(m[1]);
  for (const m of code.matchAll(/to_dummy\((\w+)\)/g)) for (let k = 1; k <= 9; k++) out.add(`${m[1]}_${k}`);
  return out;
}
const DATA = new Set(['ls01', 'age', 'agec', 'hs01', 'mstat', 'ps03', 'ep03', 'ep01', 'ep04', 'eastwest', 'educ', 'dg03', 'pa01', 'wghtpew']);

test('every template only uses objects it creates itself (besides allbus and its variables)', () => {
  for (const [key, t] of Object.entries(TEMPLATES)) {
    const code = parseMarks(t.code).code;
    if (key === 'start') continue;
    assert.doesNotMatch(code, /<-/, `${key}: no objects with <-`);
    const own = made(code);
    for (const f of code.matchAll(/linear_regression\(([^,]+),/g)) {
      for (const v of f[1].split(/[~+*\s]+/).filter(Boolean)) assert.ok(own.has(v) || DATA.has(v), `${key}: ${v}`);
    }
    for (const f of code.matchAll(/frequency\((\w+)/g)) assert.ok(own.has(f[1]) || DATA.has(f[1]), `${key}: ${f[1]}`);
    if (/rechnen$/.test(key)) assert.doesNotMatch(code, /allbus/, key);
    else assert.match(code, /^allbus %>%$/m, key);
  }
  assert.deepEqual([...made(TEMPLATES.a2.code)].filter(v => v.startsWith('dg03_')).slice(0, 4), ['dg03_1', 'dg03_2', 'dg03_3', 'dg03_4']);
});

test('marks sit where the plan has them (line numbers for screen readers)', () => {
  const marks = (k: string) => parseMarks(TEMPLATES[k].code).marks.map(m => `${m.line + 1}:${m.word}`);
  assert.deepEqual(marks('a1'), ['9:lage']);
  assert.deepEqual(marks('a2'), ['9:dg03_1']);
  assert.deepEqual(marks('a2_rechnen'), ['3:7.042', '3:0.652']);
  assert.deepEqual(marks('a4'), ['9:+']);
  assert.deepEqual(marks('a4_rechnen'), ['3:1.091', '3:-1.035']);
  for (const k of ['start', 'r_modell', 'r_dummy', 'a3', 'a3_ost', 'frei_a1', 'frei_a2', 'frei_a3', 'frei_a4']) assert.deepEqual(marks(k), [], k);
  assert.match(solve('a1', 'lage + dlage'), /demo ~ lage \+ dlage,/);
  assert.match(solve('a4', '*'), /demo ~ ost \* abitur,/);
});

test('every try-out template starts with a comment and an executable suggestion', () => {
  for (const [key, t] of Object.entries(TEMPLATES).filter(([, t]) => t.tryOut)) {
    const lines = t.code.split('\n').map(l => l.trim()).filter(Boolean);
    assert.ok(lines[0].startsWith('# Eine Idee:'), key);
    assert.ok(lines.some(l => !l.startsWith('#')), key);
  }
});

test('questions: targets and tolerances as in the plan; no special case within its tolerance', () => {
  const nums = (qs: S10Question[]) => qs.filter(x => x.kind === 'number').map(x => [x.id, x.target, x.kind === 'number' ? x.tolerance : 0]);
  assert.deepEqual(nums(QUESTIONS.a1), [['a1a', 0.461, 0.005], ['a1b', 0.198, 0.005], ['a1c', 0.668, 0.005], ['a1d', 0.228, 0.005]]);
  assert.deepEqual(nums(QUESTIONS.a2), [['a2a', 4.243, 0.005], ['a2b', -0.705, 0.005], ['a2c', 4.077, 0.01], ['a2f', 3.537, 0.005]]);
  assert.deepEqual(nums(QUESTIONS.a3), [['a3b', 0.110, 0.002], ['a3d', 0.258, 0.0004], ['a3f', -0.624, 0.005]]);
  assert.deepEqual(nums(QUESTIONS.a4), [['a4a', 0.060, 0.005], ['a4b', -0.571, 0.01]]);
  assert.deepEqual(nums(Object.values(THINK)), [['k1b', 1.722, 0.01], ['k2a', 7.694, 0.01], ['k2b', -0.653, 0.005], ['k4b', 0.056, 0.01]]);
  const choices = (qs: S10Question[]) => qs.filter(x => x.kind === 'choice').map(x => [x.id, x.target]);
  assert.deepEqual(choices(ALL_TASK), [['a1e', 'gleich'], ['a1f', 'zusammen'], ['a2d', 'weder'], ['a2e', 'null'], ['a3a', 'dlage'], ['a3c', 'lage'], ['a3e', 'gut'], ['a4c', 'nein'], ['a4d', 'einfluss']]);
  for (const x of ALL) {
    if (x.kind === 'number') for (const c of x.cases ?? []) {
      assert.equal(judge(x, String(c.value)), 'wrong', `${x.id}: special case ${c.value} must stay outside`);
      assert.equal(wrongText(x, String(c.value)), `${c.text} ${x.hint}`, `${x.id}: ${c.value}`);
    }
    if (x.kind === 'choice') {
      assert.ok(x.options.some(o => o.value === x.target), x.id);
      for (const o of x.options) if (o.value !== x.target) assert.ok(x.wrong?.[o.value], `${x.id}: text for ${o.value}`);
    }
    assert.ok(x.label && x.right && x.hint, x.id);
  }
  const ids = ALL.map(x => x.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(REQUIRED.map(x => x.id), [...QUESTIONS.a1, ...QUESTIONS.a2, ...QUESTIONS.a3].map(x => x.id));
});

test('answers in R and German notation, with and without sign', () => {
  assert.equal(judge(q('a2a'), '4.243'), 'right');
  assert.equal(judge(q('a2a'), '4,243'), 'right');
  assert.equal(judge(q('a2a'), '4,24'), 'right');
  for (const v of ['-0.705', '−0,705', '-0,705', '-0,70']) assert.equal(judge(q('a2b'), v), 'right', v);
  assert.equal(judge(q('a2b'), '0.705'), 'wrong');
  assert.match(wrongText(q('a2b'), '0,705'), /^Das Vorzeichen fehlt/);
  assert.match(wrongText(q('a2b'), '-0.202'), /^Das ist Beta\./);
  assert.equal(judge(q('a3d'), '0.258'), 'right');
  assert.equal(judge(q('a3d'), '0,259'), 'wrong');
  assert.match(wrongText(q('a3d'), '0.259'), /^Das ist R Square ohne Korrektur\./);
  assert.equal(judge(q('a1a'), '0,46'), 'right');
  assert.match(wrongText(q('a1a'), '2.500'), /^Das ist die Konstante/);
  assert.match(wrongText(q('a1a'), '0,29'), /^Das ist Beta, gefragt ist B\./);
  assert.equal(judge(q('a4b'), '-0.571'), 'right');
  assert.match(wrongText(q('a4b'), '-0.604'), /^Das ist B von `ost` aus Schritt 1/);
  assert.match(wrongText(q('a4b'), '-0.631'), /^Das ist der Unterschied ohne Abitur/);
  assert.equal(judge(q('k1b'), '1,72'), 'right');
  assert.equal(judge(q('k2b'), '−0,653'), 'right');
  assert.equal(wrongText(q('a1e'), 'macht'), q('a1e').kind === 'choice' ? q('a1e').wrong!.macht : '');
  assert.ok(answerNumbers('4.077').includes(4.077));
});

test('aggregates are consistent: references, predictions, B1 shares, output blocks', () => {
  REFERENCES.forEach((r, k) => {
    assert.equal(r.b[k], null);
    r.b.forEach((b, j) => assert.ok(Math.abs(r.intercept + (b ?? 0) - MSTAT_PREDICTIONS[j]) <= 0.0011, `${k}/${j}`));
  });
  for (const row of B1.shares) assert.equal(row.reduce((a, b) => a + b, 0), 100);
  assert.equal(Math.round((A2.west.intercept + A2.west.b[1]) * 1000) / 1000, A2.prediction);
  assert.equal(Math.round((A2.east.intercept + A2.east.b2) * 1000) / 1000, A2.prediction);
  assert.equal(OUTPUT_BLOCKS[0].from, 0);
  OUTPUT_BLOCKS.forEach((b, i) => { if (i) assert.equal(b.from, OUTPUT_BLOCKS[i - 1].to, b.block); });
  assert.equal(OUTPUT_BLOCKS.at(-1)!.to, OUTPUT_LINES.length);
  for (const b of OUTPUT_BLOCKS.slice(1)) assert.equal(OUTPUT_LINES[b.from].trim(), b.name, b.block);
  // Die Ausgabe steht wörtlich im Plan (Bild R2)
  assert.ok(PLAN.includes(OUTPUT_LINES.join('\n')));
});

test('constructed examples: the influence lines are least squares, the dice follow the adjusted R² formula', () => {
  for (const s of INFLUENCE_STATES) {
    const pts = s.l ? [...INFLUENCE_POINTS, s.l] : INFLUENCE_POINTS;
    const fit = ols(pts.map(p => p[1]), [pts.map(p => p[0])]);
    assert.equal(Math.round(fit.coef[0] * 100) / 100, s.intercept, s.key);
    assert.equal(Math.round(fit.coef[1] * 1000) / 1000, s.b, s.key);
  }
  DICE.forEach((d, k) => {
    const adj = 1 - (1 - d.r2) * 29 / (30 - (k + 1) - 1);
    assert.ok(Math.abs(adj - d.adj) <= 0.011, `${k} dice: ${adj}`);
  });
  assert.equal(Math.round((1 - 0.70 * 39 / 31) * 100) / 100, 0.12, 'self-test 4');
});

test('predictions, resolutions, hints, error help, overview, self-test', () => {
  assert.deepEqual(Object.keys(PREDICTIONS), ['a1', 'a2', 'a3', 'a4']);
  for (const p of Object.values(PREDICTIONS)) assert.equal(p.options.length, 3);
  assert.deepEqual(Object.keys(RESOLUTIONS), ['a1', 'a2', 'a3', 'a4']);
  for (const [k, steps] of Object.entries(HINTS)) {
    assert.equal(steps.length, 3, k);
    for (const s of steps) assert.doesNotMatch(s, /<\/?code>|&gt;|&lt;/, k);
  }
  assert.equal(ERROR_HELP.length, 10);
  assert.equal(ASSIGN.length, 3);
  for (const a of ASSIGN) assert.ok(a.answer >= 0 && a.answer < ASSIGN_OPTIONS.length);
  assert.equal(SELF_TEST.length, 6);
  for (const s of SELF_TEST) {
    assert.ok(s.answer >= 0 && s.answer < s.options.length, s.question);
    for (const o of s.options) assert.ok(o.why, s.question);
  }
});

test('no „(fiktiv)“, no „·“ next to numbers, no role scenario wording in texts', () => {
  const texts = JSON.stringify([QUESTIONS, THINK, HINTS, RESOLUTIONS, ERROR_HELP, SELF_TEST, ASSIGN, PREDICTIONS]);
  assert.doesNotMatch(texts, /fiktiv/);
  assert.doesNotMatch(texts, /·/);
});

test('the script sitzung10.R follows the plan: solved templates in order, no marks', () => {
  assert.match(SCRIPT, /^# Sitzung 10: Regression vertiefen\n# ALLBUS 2023, gewichtet mit wghtpew\n\n# Pakete laden/);
  assert.doesNotMatch(SCRIPT, /⟦|⟧/);
  const order = ['# --- R lesen ---', '# --- Aufgabe 1 ---', 'demo ~ lage + dlage,', '# --- Aufgabe 2 ---', 'demo ~ dg03_1 + dg03_2', '4.243 + -0.166',
    '# Referenz Ost-Bleibende: dg03_1 fehlt', 'demo ~ dg03_4 + dg03_2', '3.537 + 0.540', '# --- Aufgabe 3 ---', 'demo ~ lage + dlage + ost + abitur',
    'demo ~ ost,', '# --- Aufgabe 4 (Zusatz) ---', 'demo ~ ost * abitur', '-0.631 + 0.060', '# --- Ideen zum Weiterdenken ---', 'zukunft', 'dg03_3 + abitur', 'demo ~ lage + ost + abitur', 'ost * links'];
  let at = -1;
  for (const s of order) { const i = SCRIPT.indexOf(s, at + 1); assert.ok(i > at, s); at = i; }
  assert.doesNotMatch(SCRIPT, /\|>|is\.na|ifelse/);
  for (const line of SCRIPT.split('\n')) assert.ok(line.length <= 100 || /rules =/.test(line), line);
  assert.deepEqual(rStyleProblems(SCRIPT), []);
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
