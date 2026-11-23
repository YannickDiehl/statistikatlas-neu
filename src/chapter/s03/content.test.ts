import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { rStyleProblems } from '../../tasks/kit/rStyle';
import { judge } from '../answers';
import { parseMarks } from '../workshop/editor';
import { rScript } from '../../../scripts/chapter-r-export';
import {
  DH04, EP04, ERROR_HELP, HINTS, HOUSEHOLDS9, K1B_Q, K1C_Q, K2B_Q, K3A_Q, K3C_Q, K4_Q, LA01, MIDDLE_ROWS, MISSING_CODES, PREDICTIONS,
  QUESTIONS, REQUIRED, SCRIPT, SCRIPT_PARTS, SELF_TEST, STONES_ALL, STONES_VALID, TEMPLATES, TOWER12, hintFor, middleFeedback,
  largestRemainder,
} from './content';

const KEYS = ['start', 'r_frequency', 'r_describe', 'r_rechnen', 'a1', 'a1r', 'a2', 'a2r', 'a3', 'a3f', 'a4', 'a4r', 'frei_a1', 'frei_a2', 'frei_a3', 'frei_a4'];
const ALL_QUESTIONS = [...QUESTIONS.a1, ...QUESTIONS.a2, ...QUESTIONS.a3, ...QUESTIONS.a4];
const q = (id: string) => [...ALL_QUESTIONS, K1B_Q, K1C_Q, K2B_Q, K3A_Q, K3C_Q, K4_Q].find(x => x.id === id)!;

test('all templates of the plan are there, the four free ones marked as try-out', () => {
  assert.deepEqual(Object.keys(TEMPLATES).sort(), [...KEYS].sort());
  for (const [key, t] of Object.entries(TEMPLATES)) {
    assert.ok(t.title.length > 0, key);
    assert.equal(!!t.tryOut, key.startsWith('frei_'), key);
  }
});

test('every template stands verbatim as an R block in the plan sitzung03.md', () => {
  const plan = readFileSync(new URL('../../../docs/entwicklung/spezifikationen/2026-11-23-lernpfad-kapitel/sitzung03.md', import.meta.url), 'utf8');
  for (const [key, t] of Object.entries(TEMPLATES)) assert.ok(plan.includes('```r\n' + t.code.replace(/\n+$/, '') + '\n```'), key);
});

test('every template passes the R style check of the learning path', () => {
  for (const [key, t] of Object.entries(TEMPLATES)) assert.deepEqual(rStyleProblems(parseMarks(t.code).code), [], key);
});

test('templates follow the conventions: %>%, no |>, no !is.na, no ifelse, start block order', () => {
  for (const [key, t] of Object.entries(TEMPLATES)) {
    assert.doesNotMatch(t.code, /\|>/, key);
    assert.doesNotMatch(t.code, /!\s*is\.na/, key);
    assert.doesNotMatch(t.code, /ifelse/, key);
  }
  assert.match(TEMPLATES.start.code, /library\(tidyverse\)\nlibrary\(mariposa\)/);
});

test('lecturer ruling: no filter code for missing values; filter() only in the try-out of task 3', () => {
  for (const [key, t] of Object.entries(TEMPLATES)) {
    assert.doesNotMatch(t.code, /drop_na|untag_na|na_frequencies|!=\s*-?\d/, key);
    if (key !== 'frei_a3') assert.doesNotMatch(t.code, /filter\(/, key);
  }
  assert.match(TEMPLATES.frei_a3.code, /frauen <- allbus %>%\n  filter\(sex == 2\)/);
});

test('every template only uses objects it creates itself (besides allbus)', () => {
  for (const [key, t] of Object.entries(TEMPLATES)) {
    const code = parseMarks(t.code).code;
    const made = new Set(['allbus']);
    for (const line of code.split('\n')) {
      const assign = line.match(/^(\w+) <-/);
      const used = line.match(/^(\w+) %>%$/);
      if (used) assert.ok(made.has(used[1]), `${key}: ${used[1]} is not created in the template`);
      if (assign) made.add(assign[1]);
    }
    assert.doesNotMatch(code, /\bpfad\b/, key);
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

test('marks sit where the plan has them: the calculator templates carry an example, never the solution', () => {
  const words = (k: string) => parseMarks(TEMPLATES[k].code).marks.map(m => m.word);
  assert.deepEqual(words('a1r'), ['0.66', '15.67']);
  assert.deepEqual(words('a2r'), ['988']);
  assert.deepEqual(words('a4r'), ['67.42']);
  for (const k of ['start', 'r_frequency', 'r_describe', 'r_rechnen', 'a1', 'a2', 'a3', 'a3f', 'a4']) assert.deepEqual(words(k), [], k);
  // The example of each calculator template is a special case of its question, not the target.
  assert.equal(judge(q('a1e'), String(0.66 + 15.67)), 'wrong');
  assert.equal(judge(q('a2e'), String(988 / (3984 + 603) * 100)), 'wrong');
  assert.equal(judge(q('a4b'), String(100 - 67.42)), 'wrong');
});

test('aggregates are internally consistent', () => {
  assert.equal(LA01.rows.reduce((a, r) => a + r.n, 0), LA01.valid);
  assert.equal(LA01.missing.reduce((a, r) => a + r.n, 0), LA01.totalMissing);
  assert.equal(LA01.valid + LA01.totalMissing, LA01.total);
  let cum = 0;
  for (const r of LA01.rows) { cum += r.n; assert.equal(Math.round(cum / LA01.valid * 10000) / 100, r.cum, r.label); }
  assert.equal(EP04.rows.reduce((a, r) => a + r.n, 0), EP04.valid);
  assert.equal(EP04.missing.dataError + EP04.missing.noAnswer + EP04.missing.dontKnow, EP04.totalMissing);
  assert.equal(Math.round((EP04.rows[3].valid + EP04.rows[4].valid) * 100) / 100, 48.28);
  assert.deepEqual(STONES_ALL, [17, 23, 28, 0, 32]);
  assert.deepEqual(STONES_VALID, [24, 35, 41, 0]);
  assert.deepEqual(largestRemainder([33.4, 33.3, 33.3]), [34, 33, 33]);
  assert.equal(DH04.describe.n + DH04.describe.missing, 5246);
  assert.equal(Math.round((100 - DH04.cum[4]) * 100) / 100, DH04.sixPlus);
  assert.equal(Math.round((100 - DH04.cum[1]) * 100) / 100, DH04.aboveMean);
  assert.equal(TOWER12.length, 12);
  assert.equal(TOWER12.filter(v => v === null).length, 1);
  assert.equal(HOUSEHOLDS9.reduce((a, b) => a + b, 0), 22);
});

test('questions: targets of the plan, unique ids, each choice target is an option', () => {
  const targets = (k: keyof typeof QUESTIONS) => QUESTIONS[k].map(x => x.target);
  assert.deepEqual(targets('a1'), [5188, 58, 'es', 'gl', 48.28, 'knapp']);
  assert.deepEqual(targets('a2'), ['m8', 1262, 18.83, 24.8, 13.15, 'ungenau']);
  assert.deepEqual(targets('a3'), [54.708, 26, 514, 'filter', 'median', 'median']);
  assert.deepEqual(targets('a4'), [75.29, 24.71, 'viertel']);
  assert.deepEqual(REQUIRED, [...QUESTIONS.a1, ...QUESTIONS.a2, ...QUESTIONS.a3]);
  const ids = [...ALL_QUESTIONS, K1B_Q, K1C_Q, K2B_Q, K3A_Q, K3C_Q, K4_Q].map(x => x.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const x of [...ALL_QUESTIONS, K1C_Q, K2B_Q, K3A_Q, K3C_Q]) {
    if (x.kind === 'choice') {
      assert.ok(x.options.some(o => o.value === x.target), x.id);
      for (const k of Object.keys(x.wrongBy ?? {})) assert.ok(x.options.some(o => o.value === k) && k !== x.target, `${x.id} ${k}`);
    }
    assert.ok(x.label && x.right && x.hint, x.id);
  }
  for (const x of ALL_QUESTIONS) assert.ok(x.short, x.id);
});

test('answers in R and German notation, tolerances as in the plan', () => {
  assert.equal(judge(q('a1a'), '5.188'), 'right');
  assert.equal(judge(q('a1a'), '5188 Befragte'), 'right');
  assert.equal(judge(q('a1e'), '48,28 %'), 'right');
  assert.equal(judge(q('a1e'), '48.3'), 'right');
  assert.equal(judge(q('a2b'), '1.262'), 'right');
  assert.equal(judge(q('a2d'), '24,8'), 'right');
  assert.equal(judge(q('a2e'), '13.14585'), 'right');
  assert.equal(judge(q('a3a'), '54.708'), 'right');
  assert.equal(judge(q('a3a'), '55'), 'right');
  assert.equal(judge(q('a3a'), '54'), 'wrong');
  assert.equal(judge(q('a3b'), '26.000'), 'right');
  assert.equal(judge(q('a4a'), '75,29'), 'right');
  assert.equal(judge(q('a4a'), '75,1'), 'wrong');
  assert.equal(judge(q('a4b'), '24.71'), 'right');
  assert.equal(judge(K1B_Q, '47,96'), 'right');
  assert.equal(judge(K1B_Q, '47,76'), 'wrong');
  assert.equal(judge(K4_Q, '32,6'), 'right');
});

test('special cases: typical wrong numbers and options get their own hint', () => {
  const special = (id: string, input: string) => hintFor(q(id), input);
  assert.match(special('a1e', '47,75'), /^Das sind Raw %/);
  assert.match(special('a1e', '16.33'), /besser“-Zeilen/);
  assert.equal(special('a1e', '50'), q('a1e').hint);
  assert.match(special('a1d', 'es'), /^Das ist der Modus/);
  assert.equal(special('a1d', 'wb'), q('a1d').hint);
  assert.match(special('a2e', '15,14'), /selbst zur Basis/);
  assert.match(special('a2e', '11,49'), /Raw % von „weiß nicht“/);
  assert.match(special('a2e', '21.53913'), /CDU\/CSU aus der Vorlage/);
  assert.match(special('a3a', '26'), /^Das ist der Median/);
  assert.match(special('a3b', '54,7'), /^Das ist der Mittelwert/);
  assert.match(special('a3c', '4732'), /Missing/);
  assert.match(special('a3c', '5.246'), /alle Befragten/);
  assert.match(special('a4a', '74,71'), /Zeile 52/);
  assert.match(special('a4a', '75,10'), /Zeile 53/);
  assert.match(special('a4a', '75.49'), /schon über dem Mittelwert/);
  assert.match(special('a4b', '32,58'), /Beispiel aus Grundlage 4/);
  assert.match(special('k1b-frage', '18,27'), /nur NIE/);
  assert.match(special('k1b-frage', '81,73'), /SELTENER/);
  assert.match(special('k1b-frage', '47,76'), /Raw %/);
  assert.match(special('k4-frage', '67,42'), /100 minus diese Zahl/);
  assert.match(special('k4-frage', '50'), /genau in der Mitte/);
  assert.match(special('k1c-frage', 's'), /Modus/);
  assert.match(special('k3a-frage', 'median'), /^Andersherum/);
  assert.match(special('k2b-frage', 'beide'), /Beide sind richtig gerechnet/);
});

test('missing codes and middles: seven codes on three shelves; feedback per row of 3b', () => {
  assert.deepEqual(MISSING_CODES.map(c => c.code), [-11, -10, -9, -8, -7, -42, -41]);
  assert.deepEqual(MISSING_CODES.map(c => c.shelf), [1, 1, 2, 2, 2, 3, 3]);
  const [wahl, gesundheit, alter] = MIDDLE_ROWS;
  assert.deepEqual(middleFeedback(wahl, ['modus']), { ok: true, text: 'Parteien sind nominal: nur der Modus.' });
  assert.match(middleFeedback(wahl, ['modus', 'median']).text, /keine Reihenfolge/);
  assert.match(middleFeedback(wahl, ['modus', 'mittelwert']).text, /Parteicodes/);
  assert.ok(middleFeedback(gesundheit, ['median', 'modus']).ok);
  assert.match(middleFeedback(gesundheit, ['modus']).text, /Reihenfolge; die Mitte/);
  assert.match(middleFeedback(gesundheit, ['modus', 'median', 'mittelwert']).text, /Darum hier Modus und Median/);
  assert.ok(middleFeedback(alter, ['modus', 'median', 'mittelwert']).ok);
  assert.match(middleFeedback(alter, ['modus', 'median']).text, /Ein Jahr ist überall gleich lang/);
  assert.match(middleFeedback(alter, ['mittelwert']).text, /erst recht/);
  assert.equal(middleFeedback(wahl, []).text, 'Parteien sind nominal: nur der Modus.');
});

test('hints, predictions, self-test, error help and script are complete', () => {
  for (const [k, steps] of Object.entries(HINTS)) {
    assert.equal(steps.length, 3, k);
    for (const s of steps) assert.doesNotMatch(s, /<\/?code>|&gt;|&lt;/, k);
  }
  for (const p of Object.values(PREDICTIONS)) assert.equal(p.options.length, 3, p.id);
  assert.equal(SELF_TEST.length, 5);
  assert.deepEqual(SELF_TEST.map(s => s.answer), [0, 1, 1, 1, 0]);
  assert.equal(ERROR_HELP.length, 9);
  assert.match(SCRIPT, /^# Sitzung 3: Erste Auszählung\n# Statistikatlas, Methoden Ib, ALLBUS 2023 \(ZA8831 v1\.3\.0\)\n/);
  assert.doesNotMatch(SCRIPT, /⟦|⟧|Probier-Werkstatt|Eine Idee/);
  for (const k of SCRIPT_PARTS) assert.ok(SCRIPT.includes(`# ---- ${TEMPLATES[k].title} ----\n`), k);
  assert.ok(SCRIPT.includes('0.66 + 15.67') && SCRIPT.includes('988 / (3984 + 603) * 100') && SCRIPT.includes('100 - 67.42'));
});

test('texts: no „(fiktiv)“, no middle dot next to numbers', () => {
  const all = JSON.stringify([QUESTIONS, HINTS, SELF_TEST, ERROR_HELP, K1B_Q, K1C_Q, K2B_Q, K3A_Q, K3C_Q, K4_Q, MIDDLE_ROWS, MISSING_CODES]);
  assert.doesNotMatch(all, /fiktiv/);
  assert.doesNotMatch(all, /·/);
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
