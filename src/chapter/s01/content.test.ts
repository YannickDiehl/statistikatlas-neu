import test from 'node:test';
import assert from 'node:assert/strict';
import { rStyleProblems } from '../../tasks/kit/rStyle';
import { judge } from '../answers';
import { parseMarks } from '../workshop/editor';
import { rScript } from '../../../scripts/chapter-r-export';
import {
  ALT, BROKEN, CAUSES, CELLS, DAYS_WITH_POINT, DAYS_WITH_POINT_TEXT, COPY_ONLY, DIM, ERROR_CASES, ERROR_HELP, freqTotals, G1_PAKETE, G1_PROJEKT, G1_SKRIPT, G2_SPORT, G3_GEFRAGT,
  HINTS, LAB, PI08, PREDICTIONS, PT03, QUESTIONS, R_CHECK, REPAIRED, REQUIRED, RH08B, SCRIPT, SCRIPT_PARTS, SELF_TEST, TEMPLATES, TOOL_QUESTIONS, TOOLS,
} from './content';
import { freqLines } from './figures/FrequencyTable';

const KEYS = ['start', 'a1_dim', 'a1_zellen', 'frei_a1', 'a2_idee1', 'a2_idee2', 'a2_idee3', 'a2_idee4', 'frei_a2',
  'a3_codebuch', 'a3_rh08b', 'a3_pt03', 'frei_a3', 'a4_1', 'a4_2', 'a4_3', 'a4_4', 'frei_a4'];
const ALL_QUESTIONS = [...QUESTIONS.a1, ...QUESTIONS.a2, ...QUESTIONS.a3, ...QUESTIONS.a4, G1_SKRIPT, G1_PROJEKT, G1_PAKETE, G2_SPORT, G3_GEFRAGT];

test('all templates of the plan are there, the four free ones marked as try-out', () => {
  assert.deepEqual(Object.keys(TEMPLATES).sort(), [...KEYS].sort());
  for (const [key, t] of Object.entries(TEMPLATES)) {
    assert.ok(t.title.length > 0, key);
    assert.equal(!!t.tryOut, key.startsWith('frei_'), key);
  }
  assert.deepEqual(COPY_ONLY, ['start', 'a3_codebuch']);
});

test('every template and its filled form pass the R style check of the learning path', () => {
  for (const [key, t] of Object.entries(TEMPLATES)) {
    if (BROKEN.includes(key)) continue; // a missing parenthesis is the point of a4_4
    assert.deepEqual(rStyleProblems(parseMarks(t.code).code), [], key);
  }
  for (const [key, t] of Object.entries(R_CHECK)) assert.deepEqual(rStyleProblems(t.code), [], key);
});

test('templates follow the session conventions: no pipe in session 1, no !is.na, no ifelse, tidyverse before mariposa', () => {
  for (const [key, t] of Object.entries({ ...TEMPLATES, ...R_CHECK })) {
    assert.doesNotMatch(t.code, /\|>/, key);
    assert.doesNotMatch(t.code, /%>%/, key);
    assert.doesNotMatch(t.code, /!\s*is\.na/, key);
    assert.doesNotMatch(t.code, /ifelse/, key);
  }
  assert.match(TEMPLATES.start.code, /library\(tidyverse\)\nlibrary\(mariposa\)\n\nallbus <- read_spss\("ZA8831_v1-3-0\.sav"\)$/);
});

test('every template uses only objects it creates itself (besides allbus)', () => {
  const known = new Set(['allbus', 'zellen']);
  for (const [key, t] of Object.entries(R_CHECK)) {
    const code = parseMarks(t.code).code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n').replace(/"[^"]*"/g, '""');
    const made = new Set([...code.matchAll(/^(\w+) <-/gm)].map(m => m[1]));
    // Bare names that are no function call, no argument name and no variable inside a call.
    for (const line of code.split('\n').filter(l => l.trim() && !/[(=]/.test(l))) {
      for (const name of line.match(/[A-Za-z_][\w.]*/g) ?? []) assert.ok(known.has(name) || made.has(name), `${key}: ${name}`);
    }
    if (/zellen/.test(code)) assert.ok(made.has('zellen'), `${key} creates zellen itself`);
  }
});

test('every try-out template starts with an executable suggestion', () => {
  for (const [key, t] of Object.entries(TEMPLATES).filter(([, t]) => t.tryOut)) {
    const lines = t.code.split('\n').map(l => l.trim()).filter(Boolean);
    assert.ok(lines[0].startsWith('#'), key);
    assert.ok(lines.some(l => !l.startsWith('#')), key);
    assert.doesNotMatch(t.code, /⟦/, key);
  }
});

test('marks sit where the plan has them; the A4 templates carry exactly one error and no mark', () => {
  const words = (k: string) => parseMarks(TEMPLATES[k].code).marks.map(m => m.word);
  assert.deepEqual(words('a1_zellen'), ['Befragte', 'Variablen']);
  assert.deepEqual(words('a2_idee2'), ['flüchtling']);
  assert.deepEqual(words('a2_idee3'), ['politik']);
  assert.deepEqual(words('a2_idee4'), ['einsam']);
  assert.deepEqual(words('a3_pt03'), ['rh08b']);
  for (const k of ['a1_dim', 'a2_idee1', 'a3_rh08b', ...BROKEN]) assert.deepEqual(words(k), [], k);
  assert.match(TEMPLATES.a4_1.code, /frequenzy\(allbus, rh09b\)$/);
  assert.match(TEMPLATES.a4_2.code, /find_var\(allbus, nachbar\)$/);
  assert.match(TEMPLATES.a4_3.code, /frequency\(allbus, Li04\)$/);
  assert.match(TEMPLATES.a4_4.code, /find_var\(allbus, "kirche"$/);
  for (const k of BROKEN) {
    assert.equal(R_CHECK[k].code, `${TEMPLATES[k].code.split('\n')[0]}\n${REPAIRED[k]}`, k);
  }
  assert.match(R_CHECK.a1_zellen.code, /zellen <- 5246 \* 579/);
  assert.match(R_CHECK.a2_idee2.code, /"fluecht"/);
  assert.match(R_CHECK.a3_pt03.code, /frequency\(allbus, pt03\)$/);
});

test('aggregates are internally consistent', () => {
  assert.equal(DIM.rows * DIM.cols, CELLS);
  assert.equal((CELLS / 60 / 60 / 24).toFixed(5), '35.15549');
  assert.deepEqual(freqTotals(PI08), { valid: 3507, missing: 1739, total: 5246 });
  assert.deepEqual(freqTotals(RH08B), { valid: 5030, missing: 216, total: 5246 });
  assert.deepEqual(freqTotals(PT03), { valid: 3592, missing: 1654, total: 5246 });
  assert.equal(5246 - PI08.rows.find(r => r.value === -11)!.n, G3_GEFRAGT.kind === 'number' ? G3_GEFRAGT.target : NaN);
  assert.equal(5246 - PT03.rows.find(r => r.value === -11)!.n, 3650);
});

test('the pi08 table has the percentages that frequency() prints', () => {
  const t = freqLines(PI08);
  assert.deepEqual(t.answers.map(r => [r.raw, r.valid, r.cum]), [['1.33', '2.00', '2.00'], ['5.15', '7.70', '9.69'], ['25.83', '38.64', '48.33'], ['34.54', '51.67', '100.00']]);
  assert.deepEqual(t.missings.map(r => r.raw), ['0.38', '31.40', '0.99', '0.38']);
  assert.deepEqual([t.validRaw, t.missingRaw], ['66.85', '33.15']);
});

test('questions carry the targets of the plan, read in R and German notation', () => {
  const targets = (k: keyof typeof QUESTIONS) => QUESTIONS[k].map(q => q.target);
  assert.deepEqual(targets('a1'), [5246, 579, '35', 'env']);
  assert.deepEqual(targets('a2'), ['rh08b', 5, 'risiko', 'pt03', 'neu']);
  assert.deepEqual(targets('a3'), ['viel', 178, 5030, 1596, 3592, 'split']);
  assert.deepEqual(targets('a4'), [248, 2, 1534, 11, 'wartet']);
  assert.deepEqual(REQUIRED, [...QUESTIONS.a1, ...QUESTIONS.a2, ...QUESTIONS.a3]);
  const ids = ALL_QUESTIONS.map(q => q.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const q of ALL_QUESTIONS) {
    if (q.kind === 'choice') assert.ok(q.options.some(o => o.value === q.target), q.id);
    if (q.kind === 'number') assert.equal(q.tolerance ?? 0, 0, q.id);
    assert.ok(q.label && q.right && q.hint, q.id);
  }
  const q = (id: string) => ALL_QUESTIONS.find(x => x.id === id)!;
  assert.equal(judge(q('a1-befragte'), '5.246'), 'right');
  assert.equal(judge(q('a1-befragte'), '5246'), 'right');
  assert.equal(judge(q('a1-befragte'), '5246 Befragte'), 'right');
  assert.equal(judge(q('a3-gueltig-rh'), '5.030'), 'right');
  assert.equal(judge(q('a3-gueltig-pt'), '5030'), 'wrong');
  assert.equal(judge(q('g3-gefragt'), '3.599'), 'right');
  assert.equal(judge(q('a4-freunde'), ''), 'open');
});

test('choice options of a2-angst are built alike (no length hint)', () => {
  const q = QUESTIONS.a2.find(x => x.id === 'a2-angst')!;
  assert.ok(q.kind === 'choice');
  const lengths = q.options.map(o => o.label.length);
  assert.ok(Math.max(...lengths) - Math.min(...lengths) < 40, String(lengths));
});

test('predictions, help levels, sorter, tool assignment, error help and self-test are complete', () => {
  assert.deepEqual(Object.keys(PREDICTIONS), ['a1', 'a2', 'a3', 'a4']);
  assert.deepEqual(PREDICTIONS.a1.options, ['etwa 500', 'etwa 5.000', 'etwa 50.000', 'etwa 500.000']);
  for (const [k, steps] of Object.entries(HINTS)) {
    assert.equal(steps.length, 3, k);
    for (const s of steps) assert.doesNotMatch(s, /<\/?code>|&gt;|&lt;/, k);
  }
  // Level 2 of task 4 points to the sorter without naming the causes.
  assert.doesNotMatch(HINTS.a4[1], /Anführungszeichen|Klammer|Tippfehler/);
  assert.equal(ERROR_CASES.length, 7);
  assert.deepEqual(ERROR_CASES.map(c => c.target), ['A', 'B', 'B', 'C', 'D', 'E', 'F']);
  for (const c of ERROR_CASES) assert.ok(CAUSES.some(([v]) => v === c.target), c.code);
  assert.deepEqual(TOOL_QUESTIONS.map(t => t.target), ['start', 'find', 'freq', 'cb', 'dim']);
  for (const t of TOOL_QUESTIONS) assert.ok(TOOLS.some(([v]) => v === t.target));
  assert.equal(ERROR_HELP.length, 11);
  assert.equal(SELF_TEST.length, 5);
  for (const s of SELF_TEST) assert.ok(s.answer >= 0 && s.answer < s.options.length && s.why, s.question);
  assert.equal(LAB.length, 7);
  for (const w of LAB) assert.equal(w.output.startsWith('No variables'), w.hits.length === 0, w.word);
});

test('texts: no „·“, no „(fiktiv)“, no pipe before session 2', () => {
  const texts = JSON.stringify([ALL_QUESTIONS, HINTS, PREDICTIONS, ERROR_CASES, ERROR_HELP, SELF_TEST, LAB, ALT, TOOL_QUESTIONS]);
  assert.doesNotMatch(texts, /·/);
  assert.doesNotMatch(texts, /fiktiv/);
  for (const [k, a] of Object.entries(ALT)) assert.ok(a.length >= 40, k);
});

test('the script holds every part in the order of the plan, filled and repaired, without try-outs', () => {
  assert.match(SCRIPT, /^# Sitzung 1: Einstieg\n# Statistikatlas, Methoden Ib, ALLBUS 2023 \(ZA8831 v1\.3\.0\)\n# Markierte Stellen aus dem Atlas stehen hier mit ihrem Beispielwert\.\n/);
  assert.doesNotMatch(SCRIPT, /⟦|⟧|Probier-Werkstatt|frequenzy|Li04|Befragte \* Variablen/);
  assert.match(SCRIPT, /# ---- Startblock ----\n[\s\S]*allbus <- read_spss\("ZA8831_v1-3-0\.sav"\)\n# Findet R die Datei nicht: allbus <- read_spss\(file\.choose\(\)\)\n/);
  let at = -1;
  for (const k of SCRIPT_PARTS) {
    const i = SCRIPT.indexOf(`# ---- ${R_CHECK[k].title} ----`);
    assert.ok(i > at, k);
    at = i;
  }
  for (const line of ['zellen <- 5246 * 579', 'find_var(allbus, "fluecht")', 'find_var(allbus, "vertrauen")', 'frequency(allbus, pt03)', 'find_var(allbus, "kirche")']) assert.ok(SCRIPT.includes(line), line);
});

test('the R export holds every template (filled and repaired) and reads the file from ALLBUS_SAV', () => {
  const r = rScript(R_CHECK);
  assert.doesNotMatch(r, /⟦|⟧/);
  assert.equal(r.match(/read_spss\(/g)?.length, 1);
  assert.match(r, /allbus <- read_spss\(Sys\.getenv\("ALLBUS_SAV"\)\)/);
  for (const [key, t] of Object.entries(R_CHECK)) {
    const body = parseMarks(t.code).code.split('\n').filter(l => l.trim() && !/^library\(|read_spss\(/.test(l));
    for (const line of body) assert.ok(r.includes(line), `${key}: ${line}`);
  }
});

test('the 0.0351… in the hint is the truncated value of the constant, not typed by hand', () => {
  const exact = (DIM.rows / 1000) * DIM.cols / 86400;
  assert.equal(DAYS_WITH_POINT_TEXT, '0.0351');
  assert.equal(Number(DAYS_WITH_POINT_TEXT), Math.floor(exact * 1e4) / 1e4);
  assert.equal(DAYS_WITH_POINT, Math.round(exact * 1e4) / 1e4);
  assert.ok(JSON.stringify(QUESTIONS.a1).includes(`${DAYS_WITH_POINT_TEXT}…`));
});
