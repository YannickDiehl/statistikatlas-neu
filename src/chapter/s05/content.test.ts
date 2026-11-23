import test from 'node:test';
import assert from 'node:assert/strict';
import { rStyleProblems } from '../../tasks/kit/rStyle';
import { parseMarks } from '../workshop/editor';
import { rScript } from '../../../scripts/chapter-r-export';
import { judge5, wholeNumber, withWholeNumbers, wrongText } from './check';
import {
  ALT, CHI, CUTS, EP01, ERROR_HELP, G1_Q, G2_Q, G3_Q1, G3_Q2, G4_Q, HINTS, MISSTRAUEN, MISS_NW, NICHTWAHL, PE01, PE01_WITH_VOTE,
  PE05_NW, PE05_UM, PREDICTIONS, QUESTIONS, REQUIRED, SCRIPT, SELF_TEST, SEX_TEILZEIT, TEILZEIT, TEMPLATES, U1, U1_OPTIONS, WORK,
  margins, percent, round1, type Basis, type Q5,
} from './content';

const KEYS = ['start', 'r2_rec', 'r3_ct', 'a1_freq', 'a1_misstrauen', 'a1_nichtwahl', 'frei_a1', 'a2_ct', 'a2_all', 'frei_a2',
  'a3_ct', 'frei_a3', 'a4_um', 'a4_mutate', 'a4_ohne', 'frei_a4', 'ueb_chi'];
const code = (k: string) => parseMarks(TEMPLATES[k].code).code;

test('all templates of the plan are there, the four free ones marked as try-out', () => {
  assert.deepEqual(Object.keys(TEMPLATES), KEYS);
  for (const [key, t] of Object.entries(TEMPLATES)) {
    assert.ok(t.title.length > 0, key);
    assert.equal(!!t.tryOut, key.startsWith('frei_'), key);
  }
  assert.equal(TEMPLATES.r2_rec.title, 'Vorlage: eine neue Variable bauen');
  assert.equal(TEMPLATES.r3_ct.title, 'Vorlage: eine Kreuztabelle');
});

test('every template and the script pass the R style check of the learning path', () => {
  for (const k of KEYS) assert.deepEqual(rStyleProblems(code(k)), [], k);
  assert.deepEqual(rStyleProblems(SCRIPT), []);
});

test('templates follow the session conventions: %>%, drop_na(), no ifelse, tidyverse before mariposa', () => {
  for (const text of [...KEYS.map(k => TEMPLATES[k].code), SCRIPT]) {
    assert.doesNotMatch(text, /\|>/);
    assert.doesNotMatch(text, /!\s*is\.na/);
    assert.doesNotMatch(text, /ifelse/);
    assert.doesNotMatch(text, /%in%/);
  }
  assert.match(TEMPLATES.start.code, /library\(tidyverse\)\nlibrary\(mariposa\)/);
  assert.match(SCRIPT, /library\(tidyverse\)\nlibrary\(mariposa\)/);
});

/** New variables of this session; each template must build those it uses in its own chain. */
const NEW = ['teilzeit', 'misstrauen', 'nichtwahl', 'pe05_um', 'misstrauen_pe05', 'misstrauen_ohne', 'misstrauen_pa35'];

test('every template builds the objects it uses itself (the workshop starts with a fresh allbus), no <- except the start block', () => {
  for (const k of KEYS) {
    const c = code(k).split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
    if (k !== 'start') assert.doesNotMatch(c, /<-/, `${k}: no <-`);
    const built = [...c.matchAll(/^\s+(\w+)\s+=\s+rec\(/gm)].map(m => m[1]);
    for (const v of NEW) {
      const used = new RegExp(`\\b${v}\\b`).test(c.replace(/^\s+\w+\s+=\s+/gm, ''));
      if (used) assert.ok(built.includes(v), `${k} uses ${v} without building it`);
    }
    // in the order of use: a variable is built before rec() reads it
    built.forEach((v, i) => {
      const reads = [...c.matchAll(/rec\((\w+),/g)].map(m => m[1]);
      if (NEW.includes(reads[i])) assert.ok(built.indexOf(reads[i]) < i, `${k}: ${reads[i]} built before ${v}`);
    });
    // only allbus, packages and functions: no other object names
    assert.ok(c.trim() === '' || /^(library|allbus)/m.test(c), k);
  }
  assert.match(SCRIPT, /^allbus <- allbus %>%\n {2}mutate\(/m);
});

test('marks sit where the plan has them, placeholders run and give the wrong-but-runnable result', () => {
  const words = (k: string) => parseMarks(TEMPLATES[k].code).marks.map(m => `${m.line + 1}:${m.word}`);
  assert.deepEqual(words('a1_misstrauen'), ['4:1', '4:2:4']);
  assert.deepEqual(words('a2_ct'), ['8:row']);
  assert.deepEqual(words('a3_ct'), ['8:col']);
  assert.deepEqual(words('a4_mutate'), ['6:1', '6:2:4']);
  for (const k of KEYS.filter(k => !['a1_misstrauen', 'a2_ct', 'a3_ct', 'a4_mutate'].includes(k))) assert.deepEqual(words(k), [], k);
});

test('every try-out template starts with a comment and an executable suggestion', () => {
  for (const k of KEYS.filter(k => TEMPLATES[k].tryOut)) {
    const lines = TEMPLATES[k].code.split('\n').map(l => l.trim()).filter(Boolean);
    assert.ok(lines[0].startsWith('# Eine Idee'), k);
    assert.ok(lines.some(l => !l.startsWith('#')), k);
  }
});

test('the script is the one of the plan: all new variables once on top, solved rules, no try-out', () => {
  assert.match(SCRIPT, /^# Sitzung 5: Kreuztabellen\n/);
  assert.doesNotMatch(SCRIPT, /⟦|⟧|Eine Idee/);
  for (const v of NEW.filter(v => v !== 'misstrauen_pa35')) assert.equal(SCRIPT.match(new RegExp(`^ +${v} += rec\\(`, 'gm'))?.length, 1, v);
  assert.match(SCRIPT, /misstrauen {6}= rec\(pe01, rules = "1:2=1 \[misstraut\]; 3:4=0 \[misstraut nicht\]; else=NA"\)/);
  assert.match(SCRIPT, /chi_square\(misstrauen, nichtwahl\)\n$/);
});

test('the R export holds every template without marks and reads the file from ALLBUS_SAV', () => {
  const r = rScript(TEMPLATES);
  assert.doesNotMatch(r, /⟦|⟧/);
  assert.equal(r.match(/read_spss\(/g)?.length, 1);
  assert.match(r, /allbus <- read_spss\(Sys\.getenv\("ALLBUS_SAV"\)\)/);
  for (const k of KEYS) {
    const body = code(k).split('\n').filter(l => l.trim() && !/^library\(|read_spss\(/.test(l));
    for (const line of body) assert.ok(r.includes(line), `${k}: ${line}`);
  }
});

/* ---------- Zahlen ---------- */

const pctTable = (basis: Basis) => SEX_TEILZEIT.rows.map((_, i) => [0, 1, 2].map(j => round1(percent(SEX_TEILZEIT, basis, i, j))));

test('sex × teilzeit: counts and all three bases as printed in the plan', () => {
  const m = margins(SEX_TEILZEIT);
  assert.deepEqual(m.rowSums, [1680, 1665, 14]);
  assert.deepEqual(m.colSums, [2192, 1167]);
  assert.equal(m.n, 3359);
  assert.deepEqual(pctTable('row'), [[82.1, 17.9, 100], [48.3, 51.7, 100], [57.1, 42.9, 100]]);
  assert.deepEqual(pctTable('col'), [[62.9, 25.8, 50.0], [36.7, 73.7, 49.6], [0.4, 0.5, 0.4]]);
  assert.deepEqual(pctTable('total'), [[41.1, 9.0, 50.0], [24.0, 25.6, 49.6], [0.2, 0.2, 0.4]]);
  assert.deepEqual([0, 1].map(j => round1(percent(SEX_TEILZEIT, 'row', 3, j))), [65.3, 34.7]);
  assert.equal(round1(51.7 - 17.9), 33.8);
  assert.equal(Math.round(51.7 / 17.9 * 10) / 10, 2.9);
  assert.equal(TEILZEIT.teilzeit - m.colSums[1], 2, 'two part-timers without valid sex');
});

test('misstrauen × nichtwahl: counts, the 87 % and its two sisters', () => {
  const m = margins(MISS_NW), at = (b: Basis, i: number, j: number) => round1(percent(MISS_NW, b, i, j));
  assert.deepEqual(m.rowSums, [829, 1956]);
  assert.deepEqual(m.colSums, [2639, 146]);
  assert.equal(m.n, 2785);
  assert.deepEqual([at('row', 1, 1), at('col', 1, 1), at('total', 1, 1)], [6.5, 87.0, 4.6]);
  assert.deepEqual([at('row', 0, 0), at('row', 0, 1), at('row', 1, 0), at('row', 2, 0), at('row', 2, 1)], [97.7, 2.3, 93.5, 94.8, 5.2]);
  assert.deepEqual([at('col', 0, 0), at('col', 0, 1), at('col', 0, 2), at('col', 1, 0), at('col', 1, 2)], [30.7, 13.0, 29.8, 69.3, 70.2]);
  assert.deepEqual([at('total', 0, 0), at('total', 0, 1), at('total', 1, 0)], [29.1, 0.7, 65.7]);
  assert.equal(round1(6.5 - 2.3), 4.2);
  assert.equal(Math.round(6.5 / 2.3 * 10) / 10, 2.8);
  const expected = Math.min(...m.rowSums.flatMap(r => m.colSums.map(c => r * c / m.n)));
  assert.equal(round1(expected), CHI.minExpected);
  assert.equal(MISS_NW.missing + m.n, 5246);
});

test('frequencies: work, teilzeit, pe01, misstrauen, nichtwahl, ep01, pe05_um are consistent', () => {
  assert.deepEqual(WORK.map(w => w.n), [2193, 784, 385, 1849, 35]);
  assert.equal(WORK.reduce((a, w) => a + w.n, 0), 5246);
  assert.equal(TEILZEIT.teilzeit, 784 + 385);
  assert.equal(TEILZEIT.valid + TEILZEIT.system, 5246);
  assert.equal(TEILZEIT.system, 1849 + 35);
  assert.equal(Math.round(TEILZEIT.teilzeit / TEILZEIT.valid * 10000) / 100, TEILZEIT.validPct[1]);
  assert.equal(PE01.counts.reduce((a, b) => a + b, 0), PE01.valid);
  assert.deepEqual(PE01.counts.map(c => Math.round(c / PE01.valid * 10000) / 100), PE01.validPct);
  assert.equal(PE01.valid + PE01.missing, 5246);
  assert.equal(MISSTRAUEN.yes, PE01.counts[0] + PE01.counts[1]);
  assert.equal(MISSTRAUEN.placeholderYes, PE01.counts[0]);
  assert.equal(round1(MISSTRAUEN.yes / MISSTRAUEN.valid * 100), MISSTRAUEN.share);
  assert.equal(NICHTWAHL.yes + NICHTWAHL.no, NICHTWAHL.valid);
  assert.equal(NICHTWAHL.valid + NICHTWAHL.system, 5246);
  assert.equal(PE01_WITH_VOTE.valid, MISS_NW.cells.flat().reduce((a, b) => a + b, 0));
  assert.equal(EP01.counts.reduce((a, b) => a + b, 0), EP01.n);
  assert.equal(Math.round(EP01.counts.reduce((a, c, i) => a + c * (i + 1), 0) / EP01.n * 100) / 100, EP01.mean);
  assert.equal(Math.round((6 - EP01.mean) * 100) / 100, EP01.meanRev);
  assert.equal(PE05_NW.solved.no.n + PE05_NW.solved.yes.n, PE05_NW.solved.valid);
  assert.equal(round1(PE05_NW.solved.yes.count / PE05_NW.solved.yes.n * 100), PE05_NW.solved.yes.pct);
  assert.deepEqual([PE05_NW.without.yes, PE05_NW.without.no], [PE05_NW.solved.no.pct, PE05_NW.solved.yes.pct]);
  assert.equal(PE05_UM.counts.length, 4);
});

test('cutting groups: the shares of the six named cuts follow from the counts', () => {
  for (const c of CUTS) {
    const sum = (g: string) => WORK.reduce((a, w, i) => a + (c.groups[i] === g ? w.n : 0), 0);
    assert.equal(round1(sum('1') / (sum('1') + sum('0')) * 100), c.share, c.id);
    assert.match(c.text, new RegExp(`^${String(c.share).replace('.', ',')} %`), c.id);
  }
  assert.equal(new Set(CUTS.map(c => c.groups.join())).size, CUTS.length);
});

/* ---------- Fragen ---------- */

const ALL: Q5[] = [...QUESTIONS.a1, ...QUESTIONS.a2, ...QUESTIONS.a3, ...QUESTIONS.a4, G1_Q, G2_Q, G3_Q1, G3_Q2, G4_Q];

test('questions carry the targets of the plan, ids are unique, every choice target is an option', () => {
  const targets = (k: keyof typeof QUESTIONS) => QUESTIONS[k].map(q => q.target);
  assert.deepEqual(targets('a1'), [2630, 236, 'na', 'anteil']);
  assert.deepEqual(targets('a2'), ['col', 127, 146, '6.5', '87.0', '4.6', 'ja']);
  assert.deepEqual(targets('a3'), ['row', 6.5, 2.3, 4.2, 'etwas', 'nein']);
  assert.deepEqual(targets('a4'), ['garnicht', 6.9, 3.2, 'vertauscht', 'ja']);
  assert.deepEqual([G1_Q, G2_Q, G3_Q1, G3_Q2, G4_Q].map(q => q.target), [22.3, 25.8, 33.8, 'teilzeit', 4]);
  const ids = ALL.map(q => q.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const q of ALL) {
    if (q.kind === 'choice') {
      assert.ok(q.options.some(o => o.value === q.target), q.id);
      for (const k of Object.keys(q.wrong ?? {})) assert.ok(q.options.some(o => o.value === k && k !== q.target), `${q.id} ${k}`);
    }
    assert.ok(q.label && q.right && q.hint && q.short, q.id);
  }
  assert.deepEqual(REQUIRED, [...QUESTIONS.a1, ...QUESTIONS.a2, ...QUESTIONS.a3]);
});

test('percent answers: ±0,1, whole numbers ±0,55; counts exact; German and R notation', () => {
  const q = (id: string) => ALL.find(x => x.id === id)!;
  assert.equal(judge5(q('a3b'), '6,5'), 'right');
  assert.equal(judge5(q('a3b'), '6.5%'), 'right');
  assert.equal(judge5(q('a3b'), '6,6'), 'right');
  assert.equal(judge5(q('a3b'), '6,7'), 'wrong');
  assert.equal(judge5(q('a3b'), '7'), 'right');
  assert.equal(judge5(q('a3b'), '7,0'), 'wrong');
  assert.equal(judge5(q('a3d'), '4'), 'right');
  assert.equal(judge5(q('g1-frage'), '22'), 'right');
  assert.equal(judge5(q('g1-frage'), '22,3'), 'right');
  assert.equal(judge5(q('g1-frage'), '22,4'), 'wrong', 'grouping D (missing left out) is not the else=0 result');
  assert.equal(judge5(q('g1-frage'), '22.4%'), 'wrong');
  assert.equal(judge5(q('a1a'), '2.630'), 'right');
  assert.equal(judge5(q('a1a'), '2,630'), 'right');
  assert.equal(judge5(q('a1a'), '2630 Befragte'), 'right');
  assert.equal(judge5(q('a1a'), '2631'), 'wrong');
  assert.equal(judge5(q('a1a'), ''), 'open');
  assert.equal(judge5(q('g4-frage'), '4'), 'right');
  assert.equal(wholeNumber('34 %'), 34);
  assert.equal(wholeNumber('34,0'), null);
  // no reading of a target hits another target of the same task
  for (const k of ['a1', 'a2', 'a3', 'a4'] as const) {
    const nums = QUESTIONS[k].filter(x => x.kind === 'number');
    for (const a of nums) for (const b of nums) if (a !== b && b.kind === 'number') assert.notEqual(judge5(a, String(b.target).replace('.', ',')), 'right', `${a.id} vs ${b.id}`);
  }
});

test('feedback per typical wrong value', () => {
  const q = (id: string) => ALL.find(x => x.id === id)!;
  assert.match(wrongText(q('a1a'), '1144'), /^1\.144 sind nur/);
  assert.match(wrongText(q('a1a'), '968'), /^968 ist die Gruppe/);
  assert.match(wrongText(q('a1a'), '12'), /^Lies in frequency\(misstrauen\)/);
  assert.match(wrongText(q('a3b'), '87,0'), /Spaltenprozente/);
  assert.match(wrongText(q('a3b'), '93.5'), /würden wählen/);
  assert.match(wrongText(q('a3d'), '2,8'), /Verhältnis/);
  assert.match(wrongText(q('g2-frage'), '9'), /Gesamtprozent/);
  assert.match(wrongText(q('g2-frage'), '9,0'), /Gesamtprozent/);
  assert.match(wrongText(q('a4b'), '10,6'), /nur Code 1/);
  assert.match(wrongText(q('a2a'), 'total'), /4\.6%/);
  assert.match(wrongText(q('a4c'), '4,2'), /nur Code 1/);
  assert.match(wrongText(q('g3-frage1'), '2,9'), /Verhältnis/);
  assert.match(wrongText(q('g1-frage'), '22,4'), /^22,4 % ergibt sich, wenn ‚ohne gültige Angabe‘ leer bleibt\. Mit else=0 kommt auch sie in Gruppe 0\.$/);
  assert.match(wrongText(q('g1-frage'), '22.4'), /ohne gültige Angabe/);
});

test('choice questions whose wrong options all have feedback keep only a minimal fallback hint', () => {
  for (const q of ALL) {
    if (q.kind !== 'choice') continue;
    const covered = q.options.every(o => o.value === q.target || q.wrong?.[o.value]);
    if (covered) assert.ok(q.hint.length <= 40, `${q.id}: hint never shows, keep it minimal`);
  }
});

test('whole-number answers count in the session status as in the feedback', () => {
  const st = withWholeNumbers({ predictions: {}, answers: { a3b: '7', a3c: '2', a1a: '2630' } }, REQUIRED);
  assert.deepEqual([st.answers.a3b, st.answers.a3c, st.answers.a1a], ['6.5', '2.3', '2630']);
});

test('predictions, hints, error help, self-test and overview are complete', () => {
  assert.deepEqual(Object.keys(PREDICTIONS), ['a1', 'a2', 'a3', 'a4']);
  assert.match(PREDICTIONS.a1.resolve!, /73,1 %/);
  for (const [k, steps] of Object.entries(HINTS)) {
    assert.equal(steps.length, 3, k);
    for (const s of steps) assert.doesNotMatch(s, /<\/?code>|&gt;|&lt;/, k);
  }
  assert.equal(ERROR_HELP.length, 13);
  assert.equal(SELF_TEST.length, 6);
  for (const s of SELF_TEST) assert.ok(s.answer >= 0 && s.answer < s.options.length && s.why, s.question);
  assert.deepEqual(U1.map(u => U1_OPTIONS[u.answer]), ['alle im Osten', 'alle Misstrauenden', 'alle Befragten in der Tabelle', 'West und Ost je für sich']);
  for (const [k, v] of Object.entries(ALT)) assert.ok(v.length >= 40, k);
});
