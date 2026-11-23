import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { rStyleProblems } from '../../tasks/kit/rStyle';
import { pf, pt, qt } from '../../tasks/kit/dist';
import { judge } from '../answers';
import { parseMarks } from '../workshop/editor';
import { rScript } from '../../../scripts/chapter-r-export';
import * as content from './content';
import {
  ALARM, DW15_SEX, ERROR_HELP, F_LAB, F_LAB_DISTANCES, F_LAB_OFFSETS, F_LAB_SPREADS, G1B_Q, G1C_Q, G2C_Q, HINTS, LS01_SEX, MACHINE_FACTS, N_DIFF, N_SD, N_STEPS,
  PREDICTIONS, QUESTIONS, REQUIRED, SAMPLES, SCRIPT, SCRIPT_IDEAS, SCRIPT_PARTS, SELF_TEST, STACKS, TEMPLATES, UE_QUESTIONS, WELCH_EXAMPLE,
} from './content';
import { binOf, firstStacks } from './figures/Machine';

const ALL_Q = [...QUESTIONS.a1, ...QUESTIONS.a2, ...QUESTIONS.a3, ...QUESTIONS.a4, G1B_Q, G1C_Q, G2C_Q, ...UE_QUESTIONS];
const q = (id: string) => ALL_Q.find(x => x.id === id)!;
const round = (x: number, d: number) => Math.round(x * 10 ** d) / 10 ** d;

/* ---------- Vorlagen ---------- */

const KEYS = ['start', 'r_ttest', 'a1_kurz', 'a1_tabelle', 'frei_a1', 'a2_alle', 'a2_jung', 'frei_a2', 'a3_anova', 'a3_tukey', 'frei_a3', 'a4_matrix', 'frei_a4'];

test('all templates of the plan are there, the four free ones marked as try-out', () => {
  assert.deepEqual(Object.keys(TEMPLATES).sort(), [...KEYS].sort());
  for (const [key, t] of Object.entries(TEMPLATES)) {
    assert.ok(t.title.length > 0, key);
    assert.equal(!!t.tryOut, key.startsWith('frei_'), key);
  }
});

test('every template passes the R style check: %>%, no |>, no !is.na, no ifelse, weights = wghtpew in every test', () => {
  for (const [key, t] of Object.entries(TEMPLATES)) {
    const code = parseMarks(t.code).code;
    assert.deepEqual(rStyleProblems(code), [], key);
    assert.doesNotMatch(code, /\|>/, key);
    assert.doesNotMatch(code, /!\s*is\.na/, key);
    assert.doesNotMatch(code, /ifelse/, key);
    if (/t_test|oneway_anova|pearson_cor/.test(code)) assert.match(code, /weights = wghtpew/, key);
    if (/t_test\(|oneway_anova\(/.test(code)) assert.match(code, /group = /, key);
  }
  assert.match(TEMPLATES.start.code, /library\(tidyverse\)\nlibrary\(mariposa\)/);
});

test('every template uses only objects it builds itself (besides allbus); no template stores anything', () => {
  for (const [key, t] of Object.entries(TEMPLATES)) {
    const code = parseMarks(t.code).code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
    if (key !== 'start') assert.doesNotMatch(code, /<-/, key);
    for (const made of ['abitur', 'geschlecht']) {
      if (new RegExp(`\\b${made}\\b`).test(code)) assert.match(code, new RegExp(`\\b${made} = rec\\(`), `${key} builds ${made}`);
    }
    if (key !== 'start') assert.match(code, /^allbus %>%/m, key);
  }
});

test('marks sit where the plan has them; try-out templates start with a comment and run', () => {
  const words = (k: string) => parseMarks(TEMPLATES[k].code).marks.map(m => m.word);
  assert.deepEqual(words('a1_kurz'), ['age']);
  assert.deepEqual(words('a3_anova'), ['age', 'mode']);
  for (const k of KEYS.filter(k => !['a1_kurz', 'a3_anova'].includes(k))) assert.deepEqual(words(k), [], k);
  for (const k of KEYS.filter(k => k.startsWith('frei_'))) {
    const lines = TEMPLATES[k].code.split('\n').map(l => l.trim()).filter(Boolean);
    assert.ok(lines[0].startsWith('#'), k);
    assert.ok(lines.some(l => !l.startsWith('#')), k);
  }
});

const PLAN = 'docs/entwicklung/spezifikationen/2026-11-23-lernpfad-kapitel/sitzung07.md';
test('every ```r block of the plan is a template word for word, and every template is in the plan', { skip: !existsSync(PLAN) && 'Plan fehlt' }, () => {
  const md = readFileSync(PLAN, 'utf8');
  const blocks = [...md.matchAll(/```r\n([\s\S]*?)\n```/g)].map(m => m[1].replace(/[⟦⟧]/g, ''));
  const templates = Object.fromEntries(Object.entries(TEMPLATES).map(([k, t]) => [k, parseMarks(t.code).code.replace(/\n+$/, '')]));
  for (const b of blocks) assert.ok(Object.values(templates).includes(b), `Block im Plan ohne Vorlage:\n${b}`);
  for (const [k, code] of Object.entries(templates)) assert.ok(blocks.includes(code), `Vorlage ${k} steht nicht im Plan`);
});

/* ---------- Fragen ---------- */

test('questions carry the targets of the plan; required are tasks 1 and 3', () => {
  const targets = (qs: typeof QUESTIONS.a1) => qs.map(x => x.target);
  assert.deepEqual(QUESTIONS.a1.map(x => x.id), ['a1a', 'a1b', 'a1d', 'a1e', 'a1f']);
  assert.deepEqual(targets(QUESTIONS.a1), ['mit', -0.660, 'selten', 'bereich', 'klein']);
  assert.deepEqual(targets(QUESTIONS.a2), [-0.179, 'sig_klein', -0.986, 'streuung']);
  assert.deepEqual(QUESTIONS.a3.map(x => x.id), ['a3a', 'a3b', 'a3d', 'a3e', 'a3f']);
  assert.deepEqual(targets(QUESTIONS.a3), ['1', 26.015, 'anteil', 4, 'wenige']);
  assert.deepEqual(targets(QUESTIONS.a4), [0.790, 9, 'schwach', 'paarweise']);
  assert.deepEqual(REQUIRED, [...QUESTIONS.a1, ...QUESTIONS.a3]);
  assert.deepEqual([G1B_Q.target, G1C_Q.target, G2C_Q.target], ['doppelt', 'kein_beleg', 'ungleich']);
  assert.deepEqual(UE_QUESTIONS.map(x => x.target), ['t', 'anova', 'r', 'kreuz']);
  const ids = ALL_Q.map(x => x.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const x of ALL_Q) {
    if (x.kind === 'choice') assert.ok(x.options.some(o => o.value === x.target), x.id);
    assert.ok(x.label && x.right && x.hint && x.short, x.id);
  }
  for (const x of UE_QUESTIONS) assert.equal(x.right, x.hint, x.id);
});

test('answers in R and German notation are read; the placeholder numbers are wrong', () => {
  for (const s of ['-0.660', '−0,660', '-0,66', 'Mean Diff. -0.660']) assert.equal(judge(q('a1b'), s), 'right', s);
  assert.equal(judge(q('a1b'), '0.660'), 'wrong');
  assert.equal(judge(q('a2a'), '-0.179'), 'right');
  assert.equal(judge(q('a2a'), '-0,18'), 'right');
  assert.equal(judge(q('a2c'), '−0,986'), 'right');
  for (const s of ['26.015', '26,015', '26,02']) assert.equal(judge(q('a3b'), s), 'right', s);
  assert.equal(judge(q('a3b'), '160.989'), 'wrong');
  assert.equal(judge(q('a3e'), '4'), 'right');
  assert.equal(judge(q('a3e'), '10'), 'wrong');
  for (const s of ['0.790', '0,79']) assert.equal(judge(q('a4a'), s), 'right', s);
  assert.equal(judge(q('a4b'), '9'), 'right');
  assert.equal(judge(q('a1b'), ''), 'open');
});

test('help lines and hints keep code in backticks; three hint levels each', () => {
  assert.deepEqual(ALL_Q.filter(x => x.help).map(x => x.id), ['a1b', 'a1d', 'a1f', 'a2a', 'a2c', 'a3a', 'a3b', 'a3d', 'a3e', 'a4a', 'a4b']);
  assert.match(q('a1b').help!, /`-0\.123` heißt −0,123/);
  // Die Hilfezeilen nennen die Schreibweise an einer anderen Zahl, nie die gesuchte.
  for (const x of ALL_Q) if (x.kind === 'number' && x.help) assert.ok(!x.help.includes(Math.abs(x.target).toFixed(3)), x.id);
  for (const [k, steps] of Object.entries(HINTS)) {
    assert.equal(steps.length, 3, k);
    for (const s of steps) assert.doesNotMatch(s, /<\/?code>|&gt;|&lt;/, k);
  }
  assert.match(HINTS.a1[1], /`age`.*`pt03`/);
  assert.match(HINTS.a3[1], /`pa01` und `gs01`/);
});

test('predictions: every option has its comparison text from the plan', () => {
  assert.deepEqual(Object.values(PREDICTIONS).map(p => p.id), ['a1-tipp', 'a2-tipp', 'a3-tipp', 'a4-tipp']);
  for (const p of Object.values(PREDICTIONS)) {
    assert.deepEqual(Object.keys(p.compare).sort(), [...p.options].sort(), p.id);
    for (const o of p.options) assert.match(p.compare[o], /^Dein Tipp/, `${p.id} ${o}`);
  }
  assert.equal(PREDICTIONS.a1.compare['mit Abitur'], 'Dein Tipp: mit Abitur. Stimmt: 4,35 gegen 3,69.');
  assert.equal(PREDICTIONS.a3.compare['ländliches Dorf'], 'Dein Tipp: ländliches Dorf. Am weitesten links steht die Großstadt (4,45); das ländliche Dorf liegt bei 5,12.');
  assert.equal(PREDICTIONS.a4.compare['Bundestag und Bundesregierung'], 'Dein Tipp stimmt: r = 0,79.');
});

/* ---------- Rechenwege und konstruierte Beispiele ---------- */

test('formula as building blocks: t, standard error, 50 per group, effect size', () => {
  const [m, f] = DW15_SEX.groups;
  assert.equal(round(m.sd ** 2 / m.n, 4), 0.0466);
  assert.equal(round(f.sd ** 2 / f.n, 4), 0.0742);
  assert.equal(round(Math.sqrt(0.0466 + 0.0742), 3), 0.348);
  assert.equal(round(7.988 / 0.348, 2), 22.95);
  // Mit den gedruckten (gerundeten) Mittelwerten käme 7,989 heraus, R zieht die ungerundeten ab: 7,988.
  assert.equal(round(m.mean - f.mean, 3), 7.989);
  assert.ok(Math.abs(m.mean - f.mean - DW15_SEX.welch.diff) <= 0.0015);
  const se50 = Math.sqrt(m.sd ** 2 / 50 + f.sd ** 2 / 50);
  assert.deepEqual([round(m.sd ** 2 / 50, 4), round(f.sd ** 2 / 50, 4), round(se50, 2), round(7.988 / se50, 1)], [1.4257, 2.1164, 1.88, 4.2]);
  const pooled = Math.sqrt(((m.n - 1) * m.sd ** 2 + (f.n - 1) * f.sd ** 2) / (m.n + f.n - 2));
  assert.deepEqual([round(pooled, 2), round(7.988 / pooled, 2)], [9.38, 0.85]);
  const [lm, lf] = LS01_SEX.groups;
  assert.equal(round(Math.sqrt(lm.sd ** 2 / lm.n + lf.sd ** 2 / lf.n), 3), 0.054);
});

test('n slider: standard error, t, p and interval recomputed (difference 0,3, SD 2)', () => {
  for (const s of N_STEPS) {
    const se = N_SD * Math.sqrt(2 / s.n), t = N_DIFF / se, df = 2 * s.n - 2, half = qt(0.975, df) * se, p = 2 * pt(-t, df);
    assert.equal(round(se, 2), s.se, `${s.n} se`);
    assert.equal(round(t, 2), s.t, `${s.n} t`);
    assert.equal(s.p === 0 ? p < 0.001 : round(p, 3) === s.p, true, `${s.n} p ${p}`);
    assert.equal(round(N_DIFF - half, 2), s.lo, `${s.n} lo`);
    assert.equal(round(N_DIFF + half, 2), s.hi, `${s.n} hi`);
  }
  assert.deepEqual(N_STEPS.filter(s => s.lo > 0).map(s => s.n), [400, 800, 1600, 2500]);
  assert.equal(N_DIFF / N_SD, 0.15);
});

test('Welch against Student: the constructed example', () => {
  const { a, b, diff } = WELCH_EXAMPLE;
  const sp = Math.sqrt(((a.n - 1) * a.sd ** 2 + (b.n - 1) * b.sd ** 2) / (a.n + b.n - 2));
  const seS = sp * Math.sqrt(1 / a.n + 1 / b.n), seW = Math.sqrt(a.sd ** 2 / a.n + b.sd ** 2 / b.n);
  const dfW = seW ** 4 / ((a.sd ** 2 / a.n) ** 2 / (a.n - 1) + (b.sd ** 2 / b.n) ** 2 / (b.n - 1));
  assert.equal(round(sp, 2), WELCH_EXAMPLE.student.pooledSd);
  assert.equal(round(seS, 2), WELCH_EXAMPLE.student.se);
  assert.equal(round(diff / seS, 2), WELCH_EXAMPLE.student.t);
  assert.equal(round(2 * pt(-diff / seS, a.n + b.n - 2), 4), WELCH_EXAMPLE.student.p);
  assert.equal(round(seW, 2), WELCH_EXAMPLE.welch.se);
  assert.equal(round(diff / seW, 2), WELCH_EXAMPLE.welch.t);
  assert.equal(round(2 * pt(-diff / seW, dfW), 2), WELCH_EXAMPLE.welch.p);
  assert.deepEqual(WELCH_EXAMPLE.welch.parts, [a.sd ** 2 / a.n, b.sd ** 2 / b.n]);
});

test('pairs and false alarms; F lab recomputed from the stones', () => {
  for (const x of ALARM) {
    assert.equal(x.pairs, x.groups * (x.groups - 1) / 2);
    assert.equal(round(100 * (1 - 0.95 ** x.pairs), 1), x.risk);
  }
  assert.equal(F_LAB.length, F_LAB_SPREADS.length * F_LAB_DISTANCES.length);
  for (const row of F_LAB) {
    const groups = [5 - row.a, 5, 5 + row.a].map(m => F_LAB_OFFSETS.map(o => m + o * row.s));
    const all = groups.flat(), grand = all.reduce((s, v) => s + v, 0) / all.length;
    const means = groups.map(g => g.reduce((s, v) => s + v, 0) / g.length);
    const ssB = groups.reduce((s, g, i) => s + g.length * (means[i] - grand) ** 2, 0);
    const ssW = groups.reduce((s, g, i) => s + g.reduce((t, v) => t + (v - means[i]) ** 2, 0), 0);
    const F = (ssB / 2) / (ssW / 15), p = pf(F, 2, 15, false);
    const at = `s ${row.s}, a ${row.a}`;
    assert.deepEqual([round(ssB, 6), round(ssW, 6), round(ssB / 2, 6), round(ssW / 15, 6)], [row.ssBetween, row.ssWithin, row.msBetween, row.msWithin], at);
    assert.equal(round(F, 2), row.F, at);
    assert.equal(row.p === 0 ? p < 0.001 : round(p, 3) === row.p, true, `${at}: p ${p}`);
    assert.equal(round(ssB / (ssB + ssW), 2), row.eta2, at);
  }
  assert.equal(F_LAB.filter(r => r.F === 3).length, 3);
});

/* ---------- Stichproben-Maschine (Zahlen aus R; hier nur innere Stimmigkeit) ---------- */

test('sampling machine: 20 samples each, consistent rows, stacks of 1.000, highlighted bins', () => {
  for (const v of ['dw15', 'ls01'] as const) {
    assert.equal(SAMPLES[v].length, 20, v);
    const step = v === 'dw15' ? 0.1 : 0.01;
    SAMPLES[v].forEach((s, i) => {
      const at = `${v} ${i + 1}`;
      assert.ok(Math.abs(s.men - s.women - s.diff) <= step + 1e-9, `${at}: diff`);
      assert.ok(s.lo < s.diff && s.diff < s.hi, `${at}: interval`);
      assert.equal(Math.sign(s.t), Math.sign(s.diff), `${at}: sign`);
      assert.equal(s.p < 0.05, s.lo > 0 || s.hi < 0, `${at}: p and interval agree`);
    });
    assert.equal(STACKS[v].reduce((a, b) => a + b, 0), 1000, v);
    firstStacks(v, 20).forEach((c, k) => assert.ok(c === 0 || STACKS[v][k] > 0, `${v} bin ${k}`));
    assert.equal(firstStacks(v, 20).reduce((a, b) => a + b, 0), 20);
  }
  assert.ok(SAMPLES.dw15.every(s => s.p < 0.05));
  assert.ok(SAMPLES.ls01.every(s => s.p >= 0.05));
  const ls = STACKS.ls01;
  assert.deepEqual([ls[0] + ls[1] + ls[2], ls[9] + ls[10] + ls[11]], [63, 64]);
  assert.equal(63 + 64, MACHINE_FACTS.ls01.atLeast06);
  assert.equal(SAMPLES.ls01[11].diff, -0.60);
  assert.equal(SAMPLES.ls01[11].p, 0.11);
  // Grenzfälle: genau −0,60 und 0,60 gehören in die äußere Kiste, 0 in die Kiste 0 bis 0,2.
  assert.deepEqual([binOf('ls01', -0.6), binOf('ls01', 0.6), binOf('ls01', 0), binOf('ls01', -0.02), binOf('ls01', 1.14)], [2, 9, 6, 5, 11]);
  assert.deepEqual([binOf('dw15', 1.5), binOf('dw15', 6.0), binOf('dw15', 13.8)], [0, 5, 12]);
});

/* ---------- Texte, Fehlerhilfe, Selbsttest, Skript ---------- */

const allStrings = (x: unknown): string[] => typeof x === 'string' ? [x] : Array.isArray(x) ? x.flatMap(allStrings)
  : x && typeof x === 'object' ? Object.values(x).flatMap(allStrings) : [];

test('texts: no „·“, no „(fiktiv)“, pt03 asked of about two thirds (not „eine Hälfte“)', () => {
  const texts = allStrings(Object.fromEntries(Object.entries(content).filter(([k]) => k !== 'TEMPLATES' && k !== 'SCRIPT')));
  for (const t of texts) {
    assert.doesNotMatch(t, /·/, t);
    assert.doesNotMatch(t, /fiktiv/i, t);
    assert.doesNotMatch(t, /Hälfte des Fragebogens|Fragebogenhälfte|eine Hälfte der Befragten/, t);
  }
  assert.match(q('a4d').right, /die Vertrauensfragen wurden nur etwa zwei Dritteln der Befragten gestellt\./);
});

test('error help: ten rows with message, cause and fix; self-test with five questions', () => {
  assert.equal(ERROR_HELP.length, 10);
  for (const row of ERROR_HELP) assert.ok(row.says.length && row.why.length && row.helps.length);
  assert.equal(SELF_TEST.length, 5);
  for (const s of SELF_TEST) assert.ok(s.answer >= 0 && s.answer < s.options.length && s.why, s.question);
  assert.deepEqual(SELF_TEST.map(s => s.answer), [1, 1, 0, 1, 1]);
});

test('script sitzung7.R: header, order of the plan, swap notes, ideas at the end, no marks', () => {
  assert.match(SCRIPT, /^# Sitzung 7: Mittelwerte vergleichen\. ALLBUS 2023, gewichtet mit wghtpew\.\n/);
  assert.doesNotMatch(SCRIPT, /⟦|⟧/);
  assert.match(SCRIPT, /# R lesen: ein t-Test, Zeile für Zeile\n/);
  assert.match(SCRIPT, /# Aufgabe 1: Tausche age gegen pt03 \(Vertrauen in den Bundestag\)\n/);
  assert.match(SCRIPT, /# Aufgabe 3: Tausche age gegen pa01 und mode gegen gs01\n/);
  let at = -1;
  for (const k of [...SCRIPT_PARTS.map(p => p.key), ...SCRIPT_IDEAS]) {
    const body = parseMarks(TEMPLATES[k].code).code.replace(/\n+$/, '');
    const i = SCRIPT.indexOf(body, at + 1);
    assert.ok(i > at, `${k} in order`);
    at = i;
  }
  assert.ok(SCRIPT.indexOf('# ==== Ideen zum Weiterdenken ====') < SCRIPT.indexOf(TEMPLATES.frei_a1.code.split('\n')[0]));
  assert.deepEqual([...SCRIPT_PARTS.map(p => p.key), ...SCRIPT_IDEAS].sort(), [...KEYS].sort());
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
