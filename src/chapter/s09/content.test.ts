import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { rStyleProblems } from '../../tasks/kit/rStyle';
import { ols } from '../../tasks/kit/ols';
import { judge } from '../answers';
import { parseMarks } from '../workshop/editor';
import { rScript } from '../../../scripts/chapter-r-export';
import { feedbackFor } from './check';
import {
  A1_FIT, A3_STAGES, A4_FIT, EIGHT, EIGHT_LINE, ERROR_HELP, FAN, HINTS, K1B_Q, K1C_Q, K2C_Q, K3A_Q, K3B_Q, K4_Q, LAGE_CROSSTAB, LAGE_FIT,
  LAGE_PREDICTIONS, LAGE_STAGES, NINE_LINE, NINTH, PREDICTIONS, QUESTIONS, REQUIRED, ROOMS, ROOMS_LINE, SCRIPT, SCRIPT_PARTS, SELF_TEST,
  SLOPES, SSE_BY_SLOPE, TEMPLATES, type S9Question,
} from './content';

const KEYS = ['start', 'r_kurz', 'r_summary', 'a1', 'a1r', 'frei_a1', 'a2', 'frei_a2', 'a3', 'frei_a3', 'a4', 'a4r', 'frei_a4'];
const ALL_Q: S9Question[] = [...QUESTIONS.a1, ...QUESTIONS.a2, ...QUESTIONS.a3, ...QUESTIONS.a4, K1B_Q, K1C_Q, K2C_Q, K3A_Q, K3B_Q, K4_Q];

test('all templates of the plan are there, the four free ones marked as try-out', () => {
  assert.deepEqual(Object.keys(TEMPLATES), KEYS);
  for (const [key, t] of Object.entries(TEMPLATES)) {
    assert.ok(t.title.length > 0, key);
    assert.equal(!!t.tryOut, key.startsWith('frei_'), key);
  }
});

test('every template stands word for word in sitzung09.md', () => {
  const plan = readFileSync(new URL('../../../docs/entwicklung/spezifikationen/2026-11-23-lernpfad-kapitel/sitzung09.md', import.meta.url), 'utf8');
  for (const [key, t] of Object.entries(TEMPLATES)) assert.ok(plan.includes(t.code.replace(/\n+$/, '')), key);
});

test('every template passes the R style check of the learning path', () => {
  for (const [key, t] of Object.entries(TEMPLATES)) assert.deepEqual(rStyleProblems(parseMarks(t.code).code), [], key);
});

test('templates follow the session conventions: %>%, drop_na(), no ifelse', () => {
  for (const [key, t] of Object.entries(TEMPLATES)) {
    assert.doesNotMatch(t.code, /\|>/, key);
    assert.doesNotMatch(t.code, /!\s*is\.na/, key);
    assert.doesNotMatch(t.code, /ifelse/, key);
  }
  assert.match(TEMPLATES.start.code, /library\(tidyverse\)\nlibrary\(mariposa\)/);
});

/** ALLBUS variables the templates read (everything else must be built in the same template). */
const ALLBUS_VARS = new Set(['ls01', 'ep03', 'ps03', 'pt03', 'id02', 'pa01', 'ep01', 'wghtpew']);

/** Names a template uses but does not build: identifiers outside strings and comments, not called, not an argument name. */
function foreignObjects(code: string): string[] {
  const clean = parseMarks(code).code.split('\n').map(l => l.replace(/#.*$/, '').replace(/^library\([^)]*\)$/, '')).join('\n').replace(/"[^"]*"/g, '""');
  const built = new Set<string>(['allbus']);
  for (const m of clean.matchAll(/([A-Za-z_][A-Za-z0-9_.]*)\s*<-/g)) built.add(m[1]);
  for (const m of clean.matchAll(/mutate\(([\s\S]*?)\n?\s*\)\s*(%>%|$)/g)) for (const d of m[1].matchAll(/([A-Za-z_][A-Za-z0-9_]*)\s*=(?!=)/g)) built.add(d[1]);
  const used: string[] = [];
  for (const m of clean.replace(/\d+\.\d+/g, s => '0'.repeat(s.length)).matchAll(/[A-Za-z_][A-Za-z0-9_.]*/g)) {
    const name = m[0], after = clean.slice(m.index! + name.length);
    if (/^\s*\(/.test(after) || /^\s*=(?!=)/.test(after) || /^\d/.test(name)) continue;
    if (!built.has(name) && !ALLBUS_VARS.has(name)) used.push(name);
  }
  return used;
}

test('every template uses only objects it builds itself (besides allbus and its variables)', () => {
  for (const [key, t] of Object.entries(TEMPLATES)) assert.deepEqual(foreignObjects(t.code), [], key);
  // the checker notices a missing recode (the werkstatt resets allbus before every run)
  assert.deepEqual(foreignObjects('allbus %>%\n  linear_regression(demo ~ pt03, weights = wghtpew)'), ['demo']);
  assert.deepEqual(foreignObjects('summary(modell)'), ['modell']);
  // Every template that needs demo recodes ps03 itself.
  for (const [key, t] of Object.entries(TEMPLATES)) if (/\bdemo\b/.test(t.code)) assert.match(t.code, /demo\s*= rec\(ps03, rules = "rev"\)/, key);
  for (const [key, t] of Object.entries(TEMPLATES)) if (/\blage\b/.test(t.code.replace(/#.*$/gm, ''))) assert.match(t.code, /lage = rec\(ep03, rules = "rev"\)/, key);
});

test('every try-out template starts with an executable suggestion', () => {
  for (const [key, t] of Object.entries(TEMPLATES).filter(([, t]) => t.tryOut)) {
    const lines = t.code.split('\n').map(l => l.trim()).filter(Boolean);
    assert.ok(lines[0].startsWith('# Eine Idee'), key);
    assert.ok(lines.some(l => !l.startsWith('#')), key);
    assert.doesNotMatch(t.code, /⟦/, key);
  }
});

test('marks sit where the plan has them', () => {
  const words = (k: string) => parseMarks(TEMPLATES[k].code).marks.map(m => m.word);
  assert.deepEqual(words('a1r'), ['3.570', '1.073', '4']);
  assert.deepEqual(words('a4r'), ['3.570', '1.073', '4']);
  assert.deepEqual(words('a2'), ['pt03']);
  assert.deepEqual(words('a3'), ['3.570', '1.073']);
  for (const k of ['start', 'r_kurz', 'r_summary', 'a1', 'a4']) assert.deepEqual(words(k), [], k);
});

test('constructed examples: eight persons, the ninth person, ten rooms (least squares in TS)', () => {
  const fit = (pts: { x: number; y: number }[]) => ols(pts.map(p => p.y), [pts.map(p => p.x)]);
  const eight = fit(EIGHT);
  assert.deepEqual(eight.coef.map(v => Math.round(v * 1e9) / 1e9), [EIGHT_LINE.intercept, EIGHT_LINE.slope]);
  assert.ok(Math.abs(eight.ssResidual - EIGHT_LINE.sse) < 1e-9);
  assert.ok(Math.abs(eight.ssTotal - EIGHT_LINE.sseMean) < 1e-9);
  assert.equal(Math.round(eight.r2 * 100) / 100, EIGHT_LINE.r2);
  assert.deepEqual([EIGHT.reduce((s, p) => s + p.x, 0) / 8, EIGHT.reduce((s, p) => s + p.y, 0) / 8], [EIGHT_LINE.centre.x, EIGHT_LINE.centre.y]);
  // residuals: six of length 1, two on the line
  assert.deepEqual(eight.residuals.map(r => Math.round(r)), [-1, 0, 1, -1, 1, 0, 1, -1]);
  // slider: 18 − 24 b + 12 b² through the centre
  SLOPES.forEach((b, i) => {
    const s = EIGHT.reduce((a, p) => a + (p.y - (7 - 3 * b) - b * p.x) ** 2, 0);
    assert.equal(s, SSE_BY_SLOPE[i], `b = ${b}`);
    assert.equal(18 - 24 * b + 12 * b * b, SSE_BY_SLOPE[i]);
  });
  assert.equal(Math.min(...SSE_BY_SLOPE), 6);
  assert.equal(SLOPES[SSE_BY_SLOPE.indexOf(6)], 1);
  const nine = fit([...EIGHT, NINTH]);
  assert.deepEqual(nine.coef.map(v => Math.round(v * 1000) / 1000), [NINE_LINE.intercept, NINE_LINE.slope]);
  assert.equal(Math.round(nine.r2 * 1000) / 1000, NINE_LINE.r2Exact);
  assert.equal(Math.round(nine.r2 * 100) / 100, NINE_LINE.r2);
  assert.equal((NINTH.y - (EIGHT_LINE.intercept + EIGHT_LINE.slope * NINTH.x)) ** 2, 49);
  const rooms = fit(ROOMS);
  assert.deepEqual(rooms.coef.map(v => Math.round(v * 1e9) / 1e9), [ROOMS_LINE.intercept, ROOMS_LINE.slope]);
  assert.ok(Math.abs(rooms.r2) < 1e-12);
  assert.equal(FAN.length, 10);
});

test('ALLBUS aggregates are internally consistent', () => {
  assert.equal(LAGE_CROSSTAB.length, 11);
  for (const row of LAGE_CROSSTAB) assert.equal(row.length, 5);
  const colSums = [0, 1, 2, 3, 4].map(k => LAGE_CROSSTAB.reduce((s, r) => s + r[k], 0));
  assert.deepEqual(colSums, [77, 436, 1491, 2751, 377], 'crosstab totals (rounded cells; describe() shows 435 and 378)');
  assert.equal(Math.max(...LAGE_CROSSTAB.flat()), 908);
  // each describe() N is a rounded weighted count: together 5.132, the model prints round(Σw) = 5.133
  assert.ok(Math.abs(LAGE_STAGES.n.reduce((a, b) => a + b, 0) - LAGE_FIT.n) <= 1);
  // predictions with the printed coefficients
  LAGE_PREDICTIONS.forEach((p, i) => assert.equal(Math.round((LAGE_FIT.intercept + LAGE_FIT.slope * (i + 1)) * 1000) / 1000, p));
  assert.equal(Math.round((LAGE_PREDICTIONS[4] - LAGE_PREDICTIONS[0]) * 100) / 100, 4.29);
  assert.equal(Math.round((LAGE_FIT.intercept + 6 * LAGE_FIT.slope) * 1000) / 1000, 10.008);
  assert.equal(Math.round((1 - LAGE_FIT.ssResidual / LAGE_FIT.ssTotal) * 1000) / 1000, LAGE_FIT.r2);
  assert.equal(Math.round((1 - (LAGE_FIT.sigma / LAGE_FIT.sdY) ** 2) * 100) / 100, 0.2);
  assert.equal(Math.round(100 * LAGE_FIT.ssRegression / LAGE_FIT.ssTotal * 10) / 10, 20.3);
  assert.ok(2.715 / 1.269 > 2, 'Faustregel bei lage erfüllt');
  // task 1
  assert.equal(Math.round((A1_FIT.intercept + 7 * A1_FIT.slope) * 1000) / 1000, A1_FIT.predict7);
  assert.equal(Math.round((A1_FIT.intercept + A1_FIT.slope) * 1000) / 1000, A1_FIT.predict1);
  assert.equal(Math.round(6 * A1_FIT.slope * 100) / 100, A1_FIT.diff1to7);
  assert.equal(Math.round((A1_FIT.intercept + A1_FIT.slope) * 7 * 1000) / 1000, 19.271);
  assert.equal(Math.round(A1_FIT.slope * A1_FIT.swapped.slope * 1000) / 1000, 0.345);
  // task 3
  assert.equal(Math.round(A3_STAGES.sd[0] / A3_STAGES.sd[5] * 100) / 100, 1.86);
  assert.ok(A3_STAGES.sd[0] / A3_STAGES.sd[5] < 2, 'Faustregel bei pt03 knapp nicht erfüllt');
  assert.equal(Math.min(...A3_STAGES.sd), A3_STAGES.sd[5]);
  assert.equal(Math.max(...A3_STAGES.sd), A3_STAGES.sd[0]);
  assert.equal(Math.round((A1_FIT.intercept + 7 * A1_FIT.slope - A3_STAGES.demo7) * 1000) / 1000, -A3_STAGES.mean[6]);
  // task 4
  assert.equal(Math.round((A4_FIT.intercept + A4_FIT.slope) * 1000) / 1000, A4_FIT.predict1);
  assert.equal(Math.round((A4_FIT.intercept + 10 * A4_FIT.slope) * 1000) / 1000, A4_FIT.predict10);
  assert.equal(Math.round((A4_FIT.mean[0] - A4_FIT.predict1) * 1000) / 1000, -0.853);
  assert.equal(Math.round((A4_FIT.mean[9] - A4_FIT.predict10) * 1000) / 1000, -0.921);
  assert.equal(Math.round((A4_FIT.mean[8] - (A4_FIT.intercept + 9 * A4_FIT.slope)) * 1000) / 1000, -0.821);
  for (const k of [3, 4, 5, 6]) {
    const d = A4_FIT.mean[k - 1] - (A4_FIT.intercept + k * A4_FIT.slope);
    assert.ok(d > 0 && d < 0.2, `Stufe ${k}`);
  }
  assert.deepEqual([A4_FIT.nStage[8], A4_FIT.nStage[9]], [37, 38]);
});

test('questions: ids unique, targets as in the plan, choice targets among the options', () => {
  const ids = ALL_Q.map(q => q.id);
  assert.equal(new Set(ids).size, ids.length);
  const targets = (qs: S9Question[]) => qs.map(q => q.target);
  assert.deepEqual(targets(QUESTIONS.a1), [2.288, 0.465, 5.543, 'a', 'a', 3575]);
  assert.deepEqual(targets(QUESTIONS.a2), [0.346, 'a', 1.031, 0.06, 0.412, 'a']);
  assert.deepEqual(targets(QUESTIONS.a3), ['s6', 1.325, -0.405, 'a', 'a']);
  assert.deepEqual(targets(QUESTIONS.a4), [-0.14, 4.717, 3.864, 'a', 'a']);
  assert.deepEqual(REQUIRED, [...QUESTIONS.a1, ...QUESTIONS.a2, ...QUESTIONS.a3]);
  for (const q of ALL_Q) {
    assert.ok(q.label && q.right && q.hint && q.short, q.id);
    if (q.kind === 'choice') {
      assert.ok(q.options.some(o => o.value === q.target), q.id);
      for (const k of Object.keys(q.wrong ?? {})) assert.ok(q.options.some(o => o.value === k) && k !== q.target, `${q.id} ${k}`);
    }
    for (const s of q.special ?? []) for (const v of s.at) assert.equal(judge(q, String(v)), 'wrong', `${q.id}: special ${v} is not right`);
  }
  const tol = (id: string) => { const q = ALL_Q.find(x => x.id === id)!; return q.kind === 'number' ? q.tolerance : undefined; };
  assert.deepEqual(['a1a', 'a1b', 'a1c', 'a1f', 'a3c', 'a4b'].map(tol), [0.001, 0.001, 0.005, undefined, 0.01, 0.005]);
});

test('answers in R and German notation, minus signs and special feedback (decision 12)', () => {
  const q = (id: string) => ALL_Q.find(x => x.id === id)!;
  const right = (id: string, ...xs: string[]) => { for (const x of xs) assert.equal(judge(q(id), x), 'right', `${id}: ${x}`); };
  right('a1a', '2.288', '2,288'); right('a1b', '0.465', '0,465'); right('a1c', '5.543', '5,545', '5.54');
  right('a1f', '3575', '3.575'); right('a2d', '0.06', '0,060'); right('a3c', '-0.405', '−0,405', '-0,4');
  right('a4a', '-0.140', '−0,14'); right('a4b', '4.717'); right('a4c', '3,864');
  assert.equal(judge(q('a1f'), '3574'), 'wrong');
  assert.equal(judge(q('a3c'), '-0.442'), 'wrong');
  assert.equal(judge(q('a1a'), ''), 'open');
  const fb = (id: string, x: string) => feedbackFor(q(id), x).text;
  assert.match(fb('a1a', '0.046'), /Standardfehler/);
  assert.match(fb('a1a', '2.168'), /ohne Gewicht/);
  assert.match(fb('a1b', '-0.465'), /Vorzeichen ist gedreht/);
  assert.match(fb('a1b', '0,743'), /getauschten Seiten/);
  assert.match(fb('a1c', '7.862'), /Beispiel aus Grundlage 1/);
  assert.match(fb('a1c', '19,271'), /Erst mal, dann plus/);
  assert.match(fb('a1f', '5.246'), /alle Befragten/);
  assert.match(fb('a2a', '34,6'), /In Prozent richtig gedacht/);
  assert.match(fb('a2c', '1.274'), /Standardabweichung von demo/);
  assert.match(fb('a2d', '0.346'), /noch das Ergebnis für pt03/);
  assert.match(fb('a2e', '2.966'), /Konstante/);
  assert.match(fb('a3b', '-2.179'), /Mittelwert \(Mean\)/);
  assert.match(fb('a3b', '−0,289'), /Mittelwert \(Mean\)/);
  assert.match(fb('a3c', '-5.943'), /Zahlen aus Grundlage 1/);
  assert.match(fb('a3c', '0.405'), /Minuszeichen/);
  assert.match(fb('a3c', '0.952'), /Das ist SD/);
  assert.match(fb('a4a', '0.14'), /Achte auf das Minus/);
  assert.match(fb('a4b', '4.997'), /Steigung ist negativ/);
  assert.match(fb('a3a', 's7'), /Eine Tabelle davor/);
  assert.equal(fb('a3a', 's3'), q('a3a').hint);
  assert.match(fb('a1d', 'c'), /behauptet eine Ursache/);
  assert.equal(fb('a1b', '0.5'), q('a1b').hint);
});

test('predictions, hints, self-test and error help are complete', () => {
  for (const [k, p] of Object.entries(PREDICTIONS)) {
    assert.equal(p.id, k);
    assert.ok(p.options.length >= 3 && p.resolution && p.prompt, k);
  }
  for (const [k, steps] of Object.entries(HINTS)) {
    assert.equal(steps.length, 3, k);
    for (const s of steps) assert.doesNotMatch(s, /<\/?code>|&gt;|&lt;|·/, k);
  }
  assert.equal(SELF_TEST.length, 5);
  assert.deepEqual(SELF_TEST.map(s => s.answer), [0, 0, 1, 1, 1]);
  for (const s of SELF_TEST) assert.ok(s.answer >= 0 && s.answer < s.options.length && s.why, s.question);
  assert.equal(ERROR_HELP.length, 10);
});

test('no „·“ and no „(fiktiv)“ in any text of the session', () => {
  const texts = JSON.stringify([ALL_Q, PREDICTIONS, HINTS, SELF_TEST, ERROR_HELP]);
  assert.doesNotMatch(texts, /·/);
  assert.doesNotMatch(texts, /fiktiv/i);
});

test('take-away script: header, parts in order, the note above a3, no try-outs, no marks', () => {
  assert.match(SCRIPT, /^# Sitzung 9: Lineare Regression\n# Statistikatlas, Methoden Ib, ALLBUS 2023 \(ZA8831 v1\.3\.0\), gewichtet mit wghtpew\n# Markierte Stellen aus dem Atlas stehen hier mit ihrem Beispielwert\.\n/);
  assert.deepEqual(SCRIPT_PARTS, ['start', 'r_kurz', 'r_summary', 'a1', 'a1r', 'a2', 'a3', 'a4', 'a4r']);
  const titles = [...SCRIPT.matchAll(/^# ---- (.*) ----$/gm)].map(m => m[1]);
  assert.deepEqual(titles, SCRIPT_PARTS.map(k => TEMPLATES[k].title));
  assert.match(SCRIPT, /# ---- Aufgabe 3: Residuen je Stufe und Levene-Test ----\n# Tausch 3\.570 und 1\.073 gegen Konstante und Steigung aus Aufgabe 1\.\n/);
  assert.doesNotMatch(SCRIPT, /⟦|⟧|Eine Idee/);
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
