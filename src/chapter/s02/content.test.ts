import test from 'node:test';
import assert from 'node:assert/strict';
import { rStyleProblems } from '../../tasks/kit/rStyle';
import { judge, type Question } from '../answers';
import { parseMarks } from '../workshop/editor';
import { rScript } from '../../../scripts/chapter-r-export';
import {
  ALT, CELL_KINDS, CELLS, CONVENTION, CONVERT_STATES, CONVERT_STONES, ERROR_HELP, G1_TURM, G1_TURM_WRONG, G2_EINS, G2_MITTEL, G4_VERLUST,
  HINTS, MODE, PREDICTIONS, QUESTIONS, REQUIRED, SCRIPT, SCRIPT_PARTS, SELF_TEST, SHEET_QUESTIONS, SHEETS, TEMPLATES,
} from './content';

const ALL_TASK_QUESTIONS = [...QUESTIONS.a1, ...QUESTIONS.a2, ...QUESTIONS.a3, ...QUESTIONS.a4];
const FOUNDATION_QUESTIONS = [G1_TURM, G2_EINS, G2_MITTEL, G4_VERLUST, ...SHEET_QUESTIONS, ...CONVENTION];
const KEYS = ['start', 'rlesen', 'a1a', 'a1b', 'a1c', 'a2', 'a3', 'a4', 'frei_a1', 'frei_a2', 'frei_a3', 'frei_a4'];

test('all templates of the plan are there, the four free ones marked as try-out', () => {
  assert.deepEqual(Object.keys(TEMPLATES).sort(), [...KEYS].sort());
  for (const [key, t] of Object.entries(TEMPLATES)) {
    assert.ok(t.title.length > 0, key);
    assert.equal(!!t.tryOut, key.startsWith('frei_'), key);
  }
});

test('every template passes the R style check of the learning path', () => {
  for (const [key, t] of Object.entries(TEMPLATES)) assert.deepEqual(rStyleProblems(parseMarks(t.code).code), [], key);
});

test('templates follow the session conventions: %>%, no !is.na, no ifelse, tidyverse before mariposa', () => {
  for (const [key, t] of Object.entries(TEMPLATES)) {
    assert.doesNotMatch(t.code, /\|>/, key);
    assert.doesNotMatch(t.code, /!\s*is\.na/, key);
    assert.doesNotMatch(t.code, /ifelse/, key);
    assert.doesNotMatch(t.code, /to_label|drop_na/, `${key}: no conversion and no drop_na in session 2`);
  }
  assert.match(TEMPLATES.start.code, /library\(tidyverse\)\nlibrary\(mariposa\)/);
});

/** Objects a template uses: names before `%>%`, as first argument of codebook(), or alone on a line. */
function usedObjects(code: string): string[] {
  const used = new Set<string>();
  for (const m of code.matchAll(/^\s*([A-Za-z_][\w.]*)\s*%>%/gm)) used.add(m[1]);
  for (const m of code.matchAll(/<-\s*([A-Za-z_][\w.]*)\s*%>%/g)) used.add(m[1]);
  for (const m of code.matchAll(/codebook\(\s*([A-Za-z_][\w.]*)/g)) used.add(m[1]);
  for (const m of code.matchAll(/^([A-Za-z_][\w.]*)\s*$/gm)) used.add(m[1]);
  return [...used];
}

test('every template only uses objects it creates itself (plus allbus)', () => {
  for (const [key, t] of Object.entries(TEMPLATES)) {
    const code = parseMarks(t.code).code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
    const made = new Set([...code.matchAll(/^([A-Za-z_][\w.]*)\s*<-/gm)].map(m => m[1]));
    for (const name of usedObjects(code)) assert.ok(name === 'allbus' || made.has(name), `${key}: ${name} is not created in the template`);
  }
  // the mark in a3 may be swapped for allbus: both work
  assert.deepEqual(usedObjects(parseMarks(TEMPLATES.a3.code).code.replace('codebook(papier', 'codebook(allbus')).sort(), ['allbus']);
});

test('marks sit where the plan has them', () => {
  const words = (k: string) => parseMarks(TEMPLATES[k].code).marks.map(m => m.word);
  assert.deepEqual(words('a1c'), ['2']);
  assert.deepEqual(words('a3'), ['papier']);
  for (const k of ['start', 'rlesen', 'a1a', 'a1b', 'a2', 'a4']) assert.deepEqual(words(k), [], k);
});

test('every try-out template starts with an executable suggestion', () => {
  for (const [key, t] of Object.entries(TEMPLATES).filter(([, t]) => t.tryOut)) {
    const lines = t.code.split('\n').map(l => l.trim()).filter(Boolean);
    assert.ok(lines[0].startsWith('# Eine Idee'), key);
    assert.ok(lines.some(l => !l.startsWith('#')), key);
    assert.doesNotMatch(t.code, /⟦/, key);
  }
});

test('questions carry the targets of the plan', () => {
  const targets = (qs: Question[]) => qs.map(q => q.target);
  assert.deepEqual(targets(QUESTIONS.a1), [5246, 4, 1656, 'reihen', 'papier']);
  assert.deepEqual(targets(QUESTIONS.a2), ['zahl', 7, 4, 2, 'ja']);
  assert.deepEqual(targets(QUESTIONS.a3), [24, 24, 'papier', 858, 798, 'version']);
  assert.deepEqual(targets(QUESTIONS.a4), ['dbl', 'chr', 'code', 'nein', 'mail']);
  assert.deepEqual(ALL_TASK_QUESTIONS.map(q => q.id), [
    'a1_reihen', 'a1_code', 'a1_papier', 'a1_was', 'a1_wer', 'a2_age', 'a2_educ', 'a2_ep03', 'a2_id02', 'a2_rang',
    'a3_mfn_papier', 'a3_mfn_alle', 'a3_wo', 'a3_st01', 'a3_pt03', 'a3_split', 'a4_respid', 'a4_doi', 'a4_mode', 'a4_rechnen', 'a4_wort',
  ]);
  assert.deepEqual(REQUIRED, [...QUESTIONS.a1, ...QUESTIONS.a2, ...QUESTIONS.a3]);
  const ids = [...ALL_TASK_QUESTIONS, ...FOUNDATION_QUESTIONS].map(q => q.id).concat(CELLS.map(c => c.id));
  assert.equal(new Set(ids).size, ids.length, 'ids unique');
  for (const q of [...ALL_TASK_QUESTIONS, ...FOUNDATION_QUESTIONS]) {
    if (q.kind === 'choice') assert.ok(q.options.some(o => o.value === q.target), q.id);
    if (q.kind === 'number') { assert.ok(Number.isInteger(q.target) && q.target > 0, q.id); assert.equal(q.tolerance, undefined, q.id); }
    assert.ok(q.label && q.right && q.hint, q.id);
    assert.doesNotMatch(`${q.right} ${q.hint}`, /\{Tipp\}/, q.id);
  }
  for (const q of ALL_TASK_QUESTIONS) assert.ok(q.help && q.short, `${q.id}: Hilfezeile and short name`);
});

test('answers in R and German notation are read', () => {
  const q = (id: string) => ALL_TASK_QUESTIONS.find(x => x.id === id)!;
  for (const s of ['5246', '5.246', '5246 Reihen']) assert.equal(judge(q('a1_reihen'), s), 'right', s);
  // answers.ts reads „5,246“ as 5,246 (German decimal), not as R's thousands: the help line asks for 5246 or 5.246.
  assert.match(q('a1_reihen').help!, /tipp die Zahl als 5246 oder 5\.246/);
  assert.equal(judge(q('a1_reihen'), '579'), 'wrong');
  assert.equal(judge(q('a1_papier'), '1.656'), 'right');
  assert.equal(judge(q('a1_papier'), '2003'), 'wrong');
  assert.equal(judge(q('a3_st01'), '858'), 'right');
  assert.equal(judge(q('a2_ep03'), ''), 'open');
});

test('feedback for the typical wrong numbers sits in specialInput (579, 2.003, 5.246, ep03 = 2, educ = 5)', () => {
  const q = (id: string) => ALL_TASK_QUESTIONS.find(x => x.id === id)!;
  const own = (id: string, input: string) => (q(id) as { specialInput?: Record<string, string> }).specialInput?.[input] ?? '';
  assert.match(own('a1_reihen', '579'), /579 sind die Variablen/);
  assert.match(own('a1_papier', '2003'), /2\.003 sind die Interviews/);
  assert.match(own('a1_papier', '5246'), /noch der ganze ALLBUS/);
  assert.match(own('a2_ep03', '2'), /2 wäre GUT/);
  assert.match(own('a2_educ', '5'), /5 ist HOCHSCHULREIFE/);
});

test('predictions: four tasks, each a radio group quoted at its question', () => {
  assert.deepEqual(Object.keys(PREDICTIONS), ['a1', 'a2', 'a3', 'a4']);
  for (const p of Object.values(PREDICTIONS)) assert.equal(p.options.length, 3, p.id);
});

test('foundation questions: per-option feedback and the sheets of 3a', () => {
  assert.equal(judge(G1_TURM, '5246'), 'right');
  assert.deepEqual(Object.keys(G1_TURM_WRONG).sort(), ['579', 'geantwortet']);
  assert.equal(judge(G2_EINS, '1'), 'right');
  assert.equal(judge(G2_MITTEL, 'nichts'), 'right');
  assert.equal(judge(G4_VERLUST, 'grund'), 'right');
  assert.deepEqual(SHEETS.map(s => s.target), ['0', '-9', '-42', '-11']);
  assert.deepEqual(CONVENTION.map(q => q.target), ['fehler', 'konvention', 'fehler']);
  for (const q of FOUNDATION_QUESTIONS) assert.doesNotMatch(q.right, /^Genau/, `${q.id}: ChoiceCheck already says „Richtig.“`);
});

test('overview cells and conversion states', () => {
  assert.equal(CELLS.length, 6);
  assert.equal(CELL_KINDS.length, 4);
  assert.deepEqual(CELLS.map(c => c.answer), [0, 2, 1, 3, 2, 0]);
  assert.deepEqual(CONVERT_STATES.map(s => s.type), ['dbl+lbl', 'fct', 'dbl']);
  assert.equal(CONVERT_STONES.filter(c => c.empty).length, 1);
});

test('hints: three levels, code in backticks, solution numbers in level 3', () => {
  for (const [k, steps] of Object.entries(HINTS)) {
    assert.equal(steps.length, 3, k);
    for (const s of steps) assert.doesNotMatch(s, /<\/?code>|&gt;|&lt;/, k);
  }
  assert.match(HINTS.a1[2], /1\.656/);
  assert.match(HINTS.a3[2], /858.*798.*638.*202.*357/);
});

test('self-test, error help and the take-away script are complete', () => {
  assert.equal(SELF_TEST.length, 5);
  for (const s of SELF_TEST) assert.ok(s.answer >= 0 && s.answer < s.options.length && s.why, s.question);
  assert.equal(ERROR_HELP.length, 7);
  assert.match(SCRIPT, /^# Sitzung 2: Vom Fragebogen zum Datensatz\n/);
  assert.doesNotMatch(SCRIPT, /⟦|⟧/);
  assert.deepEqual(SCRIPT_PARTS, ['start', 'rlesen', 'a1a', 'a1b', 'a1c', 'a2', 'a3', 'a4']);
  assert.match(SCRIPT, /# Für die Papierbögen: die 2 gegen den Code für MAIL tauschen\n# Nur die Befragten mit einem Code in mode behalten\nauswahl <- allbus %>%\n {2}filter\(mode == 2\)/);
  assert.match(SCRIPT, /codebook\(papier, pa01, st01, pt03\)/);
  assert.doesNotMatch(SCRIPT, /Eine Idee/);
});

test('texts: no „·“, no „(fiktiv)“, the constructed examples say so', () => {
  const all = JSON.stringify({ QUESTIONS, HINTS, ALT, SHEETS, CELLS, SELF_TEST, ERROR_HELP, PREDICTIONS, CONVERT_STATES });
  assert.doesNotMatch(all, /·/);
  assert.doesNotMatch(all, /fiktiv/i);
  for (const [k, a] of Object.entries(ALT)) assert.ok(a.length >= 40, k);
  assert.match(ALT.filterSex, /ein Beispiel mit sechs Befragten/);
  assert.match(ALT.bogenA2, /ausgedachtes Beispiel/);
  assert.match(ALT.split, /ein Beispiel/);
  assert.equal(MODE.n[2] + MODE.n[3] + MODE.n[4], 5246);
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
