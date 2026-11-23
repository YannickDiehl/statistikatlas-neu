import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { rStyleProblems } from '../../tasks/kit/rStyle';
import { judge } from '../answers';
import { parseMarks } from '../workshop/editor';
import { rScript } from '../../../scripts/chapter-r-export';
import {
  AGE_GROUPS, CROSSTAB, CROSSTAB_TOTAL, ERROR_HELP, HINTS, K1C_Q, K2B_Q, PREDICTIONS, QUESTIONS, REQUIRED, SCRIPT, SCRIPT_PARTS,
  K3B, SELF_TEST, SMARTPHONE, SPECIAL, TEMPLATES, VOTE_FREQ, VOTE_MODEL, byHand, specialFor, withSpecialHint,
} from './content';
import { chain, chanceText } from './figures/Topic2';
import { stepLines } from './figures/Topic3';
import { TRANSLATOR_ROWS, chanceOf, logitOf, two } from './figures/Topic1';

const PLAN = new URL('../../../docs/entwicklung/spezifikationen/2026-11-23-lernpfad-kapitel/sitzung11.md', import.meta.url);

const KEYS = ['start', 'r_modell', 'r_exp', 'r_predict', 'r_ame', 'a1f', 'a1k', 'a1r', 'a1c', 'frei_a1', 'a2', 'a2r', 'frei_a2',
  'a3h', 'a3p', 'a3m', 'frei_a3', 'a4', 'a4r', 'a4l', 'frei_a4'];

test('all 21 templates of the plan are there, the four free ones marked as try-out', () => {
  assert.deepEqual(Object.keys(TEMPLATES).sort(), [...KEYS].sort());
  for (const [key, t] of Object.entries(TEMPLATES)) {
    assert.ok(t.title.length > 0, key);
    assert.equal(!!t.tryOut, key.startsWith('frei_'), key);
  }
});

test('every template stands word for word as an ```r block in the plan', { skip: !existsSync(PLAN) && 'Plan nicht im Arbeitsbaum' }, () => {
  const plan = readFileSync(PLAN, 'utf8');
  for (const [key, t] of Object.entries(TEMPLATES)) assert.ok(plan.includes('```r\n' + t.code + '\n```'), key);
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

test('every template only uses objects and variables it builds itself (apart from allbus)', () => {
  const objects = ['smartphone', 'modell', 'profile', 'leute', 'stufen', 'logit', 'chance'];
  const variables = ['waehlen', 'pflicht', 'interesse'];
  for (const [key, t] of Object.entries(TEMPLATES)) {
    const code = parseMarks(t.code).code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
    for (const o of objects) if (new RegExp(`\\b${o}\\b(?!\\s*=)`).test(code)) assert.match(code, new RegExp(`^${o} <- `, 'm'), `${key}: ${o}`);
    for (const v of variables) if (new RegExp(`\\b${v}\\b`).test(code)) assert.match(code, new RegExp(`\\b${v}\\s+= rec\\(`), `${key}: ${v}`);
    // Nur mutate() bildet neue Spalten; die Kette beginnt mit allbus oder rechnet ohne Daten.
    if (/%>%/.test(code)) assert.match(code, /^(\w+ <- )?allbus %>%|^\w+ %>%$/m, key);
  }
});

test('marks sit where the plan has them', () => {
  const words = (k: string) => parseMarks(TEMPLATES[k].code).marks.map(m => m.word);
  assert.deepEqual(words('a1r'), ['78.3', '61.4']);
  assert.deepEqual(words('a1c'), ['61.4', '38.6']);
  assert.deepEqual(words('a2'), ['pflicht']);
  assert.deepEqual(words('a2r'), ['0.927']);
  assert.deepEqual(words('a3h'), ['1', '1']);
  assert.deepEqual(words('a3p'), ['2', '3', '2', '2']);
  assert.deepEqual(words('a4r'), ['5', '4393', '4813']);
  assert.deepEqual(words('a4l'), ['2370.945', '453.950']);
  for (const k of ['start', 'r_modell', 'r_exp', 'r_predict', 'r_ame', 'a1f', 'a1k', 'a3m', 'a4']) assert.deepEqual(words(k), [], k);
  for (const k of KEYS.filter(k => k.startsWith('frei_'))) assert.doesNotMatch(TEMPLATES[k].code, /⟦/, k);
});

test('questions carry the targets and tolerances of the plan; tasks 1 to 3 are required', () => {
  const t = (qs: typeof QUESTIONS.a1) => qs.map(q => (q.kind === 'number' ? [q.target, q.tolerance] : q.target));
  assert.deepEqual(t(QUESTIONS.a1), ['na', [94.17, 0.2], [61.4, 0.1], [4, 0.1], 'decke', [82.33, 1.6], 'zuEins']);
  assert.deepEqual(t(QUESTIONS.a2), ['waehlen', [3.765, 0.01], 'chance', [40.5, 0.6], 'split']);
  assert.deepEqual(t(QUESTIONS.a3), [[3.248, 0.01], [76.45, 0.11], [16, 0.15], [2.9, 0.15], 'chance', [5.4, 0.1], 'gut']);
  assert.deepEqual(t(QUESTIONS.a4), [[95.1, 0.05], [94.82, 0.05], [12.8, 0.25], [1122.279, 0.05], 'gut', 'beides']);
  assert.deepEqual(REQUIRED, [...QUESTIONS.a1, ...QUESTIONS.a2, ...QUESTIONS.a3]);
  const all = [...QUESTIONS.a1, ...QUESTIONS.a2, ...QUESTIONS.a3, ...QUESTIONS.a4, K1C_Q, K2B_Q];
  const ids = all.map(q => q.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const q of all) {
    if (q.kind === 'choice') assert.ok(q.options.some(o => o.value === q.target), q.id);
    assert.ok(q.label && q.right && q.hint && q.short, q.id);
  }
});

test('answers in R and German notation; both readings the plan allows are right', () => {
  const q = (id: string) => [...QUESTIONS.a1, ...QUESTIONS.a2, ...QUESTIONS.a3, ...QUESTIONS.a4].find(x => x.id === id)!;
  const right: [string, string][] = [['a1b', '94,17 %'], ['a1b', '94'], ['a1c', '61.4'], ['a1d', '4,0'], ['a1f', '82,33'], ['a1f', '83,76'],
    ['a2b', '3,77'], ['a2b', '3.765'], ['a2d', '40,5 %'], ['a3a', '3,248'], ['a3b', '76,5'], ['a3b', '76,4'], ['a3c', '16'], ['a3d', '2,9'],
    ['a3f', '5,4'], ['a4a', '95,1'], ['a4b', '94,82'], ['a4c', '12,8 %'], ['a4d', '1.122,279'], ['a4d', '1122.279'], ['a4d', '1122,279']];
  for (const [id, a] of right) assert.equal(judge(q(id), a), 'right', `${id} ${a}`);
  assert.equal(judge(K1C_Q, '80 %'), 'right');
  assert.equal(judge(q('a3b'), '0,76'), 'wrong');
  assert.equal(judge(q('a4d'), ''), 'open');
});

test('special cases: each is a wrong answer and gets its own hint', () => {
  for (const [id, list] of Object.entries(SPECIAL)) {
    const q = [...Object.values(QUESTIONS).flat(), K1C_Q].find(x => x.id === id);
    assert.ok(q, id);
    for (const s of list) {
      const answer = String(s.at).replace('.', ',');
      assert.equal(judge(q, typeof s.at === 'string' ? s.at : answer), 'wrong', `${id} ${s.at}`);
      assert.equal(specialFor(q, typeof s.at === 'string' ? s.at : answer)?.text, s.text, `${id} ${s.at}`);
    }
  }
  const a1b = QUESTIONS.a1[1];
  assert.equal(withSpecialHint(a1b, '0,94').hint, 'Das ist der Mittelwert als Anteil; gefragt ist Prozent, also 94. Lies in der Zeile „würde wählen“ die Spalte Valid %.');
  assert.equal(withSpecialHint(a1b, '50').hint, a1b.hint);
  assert.equal(withSpecialHint(a1b, '94').hint, a1b.hint, 'right answers keep their text');
  assert.equal(withSpecialHint(QUESTIONS.a1[3], '-4').hint.startsWith('Die größere Zahl zuerst.'), true);
  assert.equal(withSpecialHint(QUESTIONS.a2[2], 'wahrsch').hint, SPECIAL.a2c[0].text);
  assert.equal(withSpecialHint(K1C_Q, '400').hint.startsWith('Eine Chance ist kein Vielfaches'), true);
  assert.equal(specialFor(QUESTIONS.a2[3], '−7,3')?.text, 'Das ist das Beispiel aus der Vorlage.');
});

test('predictions and their resolutions as in the plan', () => {
  assert.deepEqual(Object.keys(PREDICTIONS), ['a1', 'a2', 'a3', 'a4']);
  assert.deepEqual(PREDICTIONS.a1.options, ['unter 40 %', '40 bis 55 %', 'über 55 %']);
  assert.deepEqual(PREDICTIONS.a2.options, ['etwa × 1,2', 'etwa × 4', 'etwa × 20']);
  for (const p of Object.values(PREDICTIONS)) assert.match(p.resolution, /^Tatsächlich /);
});

test('hints: three levels per task, code in backticks, no markup', () => {
  for (const [k, steps] of Object.entries(HINTS)) {
    assert.equal(steps.length, 3, k);
    for (const s of steps) assert.doesNotMatch(s, /<\/?code>|&gt;|&lt;/, k);
  }
  assert.match(HINTS.a1[2], /`98\.8 \/ 1\.2` ergibt 82\.33333/);
  assert.match(HINTS.a4[2], /`856\.448 \+ 265\.831` = 1\.122,279/);
});

test('aggregates are internally consistent', () => {
  assert.equal(AGE_GROUPS.reduce((s, g) => s + g.n, 0), SMARTPHONE.cases);
  const t = SMARTPHONE.table;
  assert.equal(t.no.no + t.no.yes + t.yes.no + t.yes.yes, SMARTPHONE.n);
  assert.equal(Math.round((t.no.no + t.yes.yes) / SMARTPHONE.n * 1000) / 10, t.overall);
  assert.equal(Math.round((SMARTPHONE.minus2LL + SMARTPHONE.chi2) * 1000) / 1000, SMARTPHONE.minus2LLNull);
  assert.equal(Math.round(SMARTPHONE.chi2 / SMARTPHONE.minus2LLNull * 1000) / 1000, SMARTPHONE.mcfadden);
  assert.equal(Math.round(Math.exp(SMARTPHONE.b) * 1000) / 1000, SMARTPHONE.expB);
  for (const r of CROSSTAB) {
    assert.equal(r.no + r.yes, r.total, String(r.pflicht));
    assert.equal(Math.round(r.rowNo * 10 + r.rowYes * 10), 1000);
    assert.equal(r.pflicht + r.pe09, 5, 'umgepolt');
  }
  assert.deepEqual([CROSSTAB.reduce((s, r) => s + r.no, 0), CROSSTAB.reduce((s, r) => s + r.yes, 0)], [CROSSTAB_TOTAL.no, CROSSTAB_TOTAL.yes]);
  assert.equal(VOTE_FREQ.no + VOTE_FREQ.yes, VOTE_FREQ.valid);
  assert.equal(VOTE_FREQ.valid + VOTE_FREQ.system, VOTE_FREQ.total - 0, 'valid + system = all (weighted, rounded)');
  const m = VOTE_MODEL;
  assert.equal(m.table.no.no + m.table.no.yes + m.table.yes.no + m.table.yes.yes, m.n);
  assert.equal(Math.round((m.minus2LL + m.chi2) * 1000) / 1000, m.minus2LLNull);
  assert.equal(Math.round(m.chi2 / m.minus2LLNull * 1000) / 1000, m.mcfadden);
  assert.equal(Math.round((m.table.yes.no + m.table.yes.yes) / m.n * 10000) / 100, 94.82);
  // Person A von Hand und die Probe der Chancen aus predict()
  const lA = m.intercept + m.pflicht.b * 2 + m.interesse.b * 2;
  assert.equal(Math.round(lA * 1000) / 1000, 1.178);
  assert.equal(Math.round(Math.exp(lA) * 1000) / 1000, 3.248);
  const ch = m.predict.map(p => p / (1 - p));
  assert.deepEqual([ch[0], ch[1], ch[2], ch[3]].map((c, i) => Math.round(c * (i ? 10 : 100)) / (i ? 10 : 100)), [3.25, 12.2, 24.1, 90.8]);
  assert.equal(Math.round(ch[1] / ch[0] * 1000) / 1000, m.pflicht.expB);
  assert.equal(Math.round(ch[3] / ch[2] * 1000) / 1000, m.pflicht.expB);
});

test('values by hand (rounded output numbers) give the table of B5 and the steps of B9', () => {
  const rows = [[20, '5,254', '191,3', '99,5 %'], [30, '4,494', '89,5', '98,9 %'], [40, '3,734', '41,8', '97,7 %'], [50, '2,974', '19,6', '95,1 %'],
    [60, '2,214', '9,15', '90,1 %'], [70, '1,454', '4,28', '81,1 %'], [80, '0,694', '2,00', '66,7 %'], [90, '−0,066', '0,94', '48,4 %']] as const;
  for (const [age, logit, chance, p] of rows) assert.deepEqual(chain(age), { logit, chance, p }, String(age));
  assert.equal(chanceText(byHand(70).chance), '4,28');
  assert.deepEqual(stepLines(30), ['Logit: −0,76', 'Chance: × 0,47 (89,5 → 41,8)', 'Wahrscheinlichkeit: −1,2 Prozentpunkte']);
  assert.deepEqual(stepLines(70), ['Logit: −0,76', 'Chance: × 0,47 (4,28 → 2,00)', 'Wahrscheinlichkeit: −14,4 Prozentpunkte']);
});

test('translator table as in the plan', () => {
  const plan = '1 % | 0,01 | −4,60; 5 % | 0,05 | −2,94; 10 % | 0,11 | −2,20; 20 % | 0,25 | −1,39; 25 % | 0,33 | −1,10; 50 % | 1 | 0; 75 % | 3 | 1,10; 80 % | 4 | 1,39; 90 % | 9 | 2,20; 95 % | 19 | 2,94; 99 % | 99 | 4,60';
  assert.equal(TRANSLATOR_ROWS.map(p => `${p} % | ${two(chanceOf(p))} | ${two(logitOf(p))}`).join('; '), plan);
  assert.deepEqual([two(chanceOf(78)), two(logitOf(78))], ['3,55', '1,27']);
});

test('self-test, error help and take-away script are complete', () => {
  assert.equal(SELF_TEST.length, 5);
  assert.deepEqual(SELF_TEST.map(s => s.answer), [1, 2, 1, 0, 1]);
  for (const s of SELF_TEST) assert.ok(s.answer >= 0 && s.answer < s.options.length && s.why, s.question);
  assert.equal(ERROR_HELP.length, 11);
  assert.match(SCRIPT, /^# Sitzung 11: Logistische Regression\n# Statistikatlas, Methoden Ib, ALLBUS 2023 \(ZA8831 v1\.3\.0\), gewichtet mit wghtpew\n/);
  assert.doesNotMatch(SCRIPT, /⟦|⟧/);
  assert.equal(SCRIPT_PARTS.length, 17);
  assert.ok(SCRIPT_PARTS.every(k => !TEMPLATES[k].tryOut));
  assert.deepEqual(KEYS.filter(k => !k.startsWith('frei_')), SCRIPT_PARTS);
  assert.match(SCRIPT, /# ---- Startblock ----\n/);
  assert.match(SCRIPT, /# ---- Aufgabe 4: −2LL des Nullmodells ----\n# −2LL des Nullmodells = −2LL des Modells \+ Chi-square; hier das Smartphone-Beispiel\n2370\.945 \+ 453\.950\n/);
  assert.doesNotMatch(SCRIPT, /Eine Idee/);
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

test('review findings: wording of the split, the AME and the K3B resolution; a4c tolerance', () => {
  const all = JSON.stringify([QUESTIONS, HINTS]);
  assert.doesNotMatch(all, /Hälfte/);
  assert.match(all, /Split-Teil/);
  const q = (id: string) => [...QUESTIONS.a3, ...QUESTIONS.a4].find(x => x.id === id)!;
  assert.match(JSON.stringify(q('a3g')), /mittlerer marginaler Effekt; eine ganze Stufe bringt meist etwas weniger/);
  assert.doesNotMatch(HINTS.a3[2], /\+5,4 Prozentpunkte je Stufe/);
  assert.match(HINTS.a3[2], /mittlere Steigung je Stufe/);
  assert.ok(K3B.resolution.startsWith('Der Logit sinkt bei beiden um 0,76, die Chance wird bei beiden mit 0,47 malgenommen.'));
  assert.equal(judge(q('a4c'), '12,6'), 'right', 'R rechnet mit ungerundeten Zellen: 18/143 = 12,6');
  assert.match(JSON.stringify(q('a4c')), /ungerundeten Zellen/);
});
