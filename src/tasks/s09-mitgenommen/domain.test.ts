import test from 'node:test';
import assert from 'node:assert/strict';
import { fakeSav, fixtureSav } from '../../sandbox/testData';
import { ols } from '../kit/ols';
import { BUILDER_CODES, BUILDER_VARS, COMMON_CAUSES, CONTROL_IDS, GROUP_IDS, HEALTH_CODES, hints, TOOLBOX_SCRIPT, type ControlId, type GroupId } from './content';
import { rStyleProblems } from '../kit/rStyle';
import {
  board, builderData, builderFormula, builderHeights, builderModel, ghostFit, termBefore, checkControlled, checkCounter, checkDecide, checkInteraction, checkModel, checkMovers, checkPrediction, checkSelection, chooseRef, chooseSecondRef,
  controlEffect, core, emptyEntry, initialS09, interaction, interactionRecognised, modelRecognised, modelStore, moverVariants, moversRecognised,
  matchReading, offQuestions, parseS09, plenumLines, predictions, prepare, rControls, rInteraction, rModel, rMovers, rSetup, rSolution, scaffoldControls, scaffoldCounter, scaffoldInteraction,
  scaffoldModel, scaffoldMovers, selection, selectionRecognised, sortNote, statusS09, dummyVif, maxVif,
  shown, toggleControl, wobbleTest, wordCount, comparePattern, patternOf, predictionParts, type Model, type ModelEntry,
} from './domain';

const p = prepare(fixtureSav()), models = modelStore(p);
const f3 = (x: number) => x.toFixed(3).replace('.', ',').replace('-', '−');
const entry = (m: Model, withC = true): ModelEntry => ({ c: withC ? f3(m.c) : '', b: GROUP_IDS.map(g => (g === m.spec.ref ? '' : f3(m.b[g]))) as ModelEntry['b'] });
const m4 = core(models, 4)!, m1 = core(models, 1)!;

test('prepares dg03 groups, dummies like to_dummy(), ost/ostjugend and the controls like rec()', () => {
  const sav = fakeSav({
    ps03: { values: [1, 6, 3, -11, 2], missingFrom: -1 }, wghtpew: { values: [1, 1, 1, 1, 1] }, dg03: { values: [1, 2, 3, 4, -10], missingFrom: -1 },
    eastwest: { values: [2, 1, 2, 1, 1] }, age: { values: [30, 40, 50, 60, -32], missingFrom: -1 }, sex: { values: [1, 2, 3, -9, 1], missingFrom: -1 },
    educ: { values: [2, 4, 5, 6, 3], missingFrom: -1 }, di08c: { values: [5, -50, 10, 12, 3], missingFrom: -1 }, ep03: { values: [1, 2, 3, 4, 5] }, pt03: { values: [1, 7, -11, 4, 2], missingFrom: -1 },
  });
  const q = prepare(sav);
  assert.deepEqual([...q.y], [6, 1, 4, NaN, 5]);
  assert.deepEqual([...q.dummy[2]], [0, 1, 0, 0, NaN]);
  assert.deepEqual([...q.ostjugend], [1, 1, 0, 0, NaN]);
  assert.deepEqual([...q.ost], [1, 0, 1, 0, 0]);
  assert.deepEqual([...q.controls.frau], [0, 1, NaN, NaN, 0]);
  assert.deepEqual([...q.controls.abi], [0, 1, 1, NaN, 0]);
  assert.deepEqual([...q.controls.di08c], [5, NaN, 10, 12, 3]);
});

test('models with any reference: same predictions, coefficients are distances to the reference', () => {
  assert.equal(m4.b[4], 0);
  assert.ok(Math.abs(m1.b[4] + m4.b[1]) < 1e-10);
  const a = predictions(m4), b = predictions(m1);
  for (const g of GROUP_IDS) { assert.ok(Math.abs(a[g].fit - b[g].fit) < 1e-10); assert.ok(Math.abs(a[g].lower - b[g].lower) < 1e-9); }
  assert.ok(Math.abs(a[4].fit - m4.c) < 1e-12);
  assert.equal(board(models).length, 4);
  assert.equal(models({ outcome: 'rev', ref: 4, controls: [], weighted: true }), m4);
  assert.deepEqual(GROUP_IDS.map(g => m4.n[g]), [10, 12, 7, 14]);
});

test('the model detector: correct table, other reference and the dummy trap, unweighted, unreversed, dg03 as number, eastwest alone', () => {
  const ok = checkModel(p, models, 4, entry(m4));
  assert.equal(ok[0].tone, 'ok');
  assert.match(ok[0].text, /Referenzgruppe \(West-Bleibende\)/);
  assert.ok(modelRecognised(m4, 4, entry(m4)));
  // Zahlen der Referenz 4 bei gewählter Referenz 1: andere Referenz, dazu der Hinweis auf die Dummyfalle
  const other: ModelEntry = { c: f3(m4.c), b: ['', f3(m4.b[2]), f3(m4.b[3]), f3(m4.b[1])] };
  assert.match(checkModel(p, models, 1, other)[0].text, /Referenzgruppe West-Bleibende – oben hast du Ost-Bleibende gewählt\. Oder stehen alle vier Dummies im Modell\?/);
  assert.ok(!modelRecognised(m1, 1, other));
  assert.match(checkModel(p, models, 4, entry(core(models, 4, 'rev', false)!))[0].text, /ohne Gewicht/);
  assert.match(checkModel(p, models, 4, entry(core(models, 4, 'orig')!))[0].text, /ohne Umpolen/);
  const num = (y: Float64Array, x: Float64Array) => ols(y, [x], p.w).coef;
  const dg = num(p.y, p.dg);
  assert.match(checkModel(p, models, 4, { c: f3(dg[0]), b: [f3(dg[1]), '', '', ''] })[0].text, /Skala von 1 bis 4/);
  const ew = num(p.y, p.ost);
  assert.match(checkModel(p, models, 4, { c: f3(m4.c), b: [f3(ew[1]), '', '', ''] })[0].text, /Ost-West-Unterschied allein/);
  assert.match(checkModel(p, models, 4, { ...entry(m4), c: '9,999' })[0].text, /^Konstante: Diesen Wert finde ich nicht\. \(Ost-Bleibende, Ost→West, West→Ost stimmen\.\)/);
  assert.match(checkModel(p, models, 4, { c: f3(m4.c), b: ['', '', '', ''] })[0].text, /Bisher stimmt alles – trag noch/);
  assert.match(checkModel(p, models, 4, { ...entry(m4), c: '4,0' })[0].text, /drei Nachkommastellen/);
  assert.match(checkModel(p, models, 4, { ...entry(m4), c: 'x' })[0].text, /keine Zahl/);
  assert.deepEqual(checkModel(p, models, 4, emptyEntry()), []);
});

test('numbers typed as R prints them (dot decimals, 78.0%) are read as R decimals', () => {
  const dot = (x: number, d = 3) => x.toFixed(d).replace('-', '−');
  const e: ModelEntry = { c: dot(m4.c), b: GROUP_IDS.map(g => (g === 4 ? '' : dot(m4.b[g]))) as ModelEntry['b'] };
  assert.ok(modelRecognised(m4, 4, e));
  assert.equal(checkModel(p, models, 4, e)[0].tone, 'ok');
  // Vorhersage von Hand aus den gedruckten Werten: 3.995 + 0.169 = 4.164
  const hand = (Number(dot(m4.c)) + Number(dot(m4.b[2]))).toFixed(3);
  assert.equal(checkPrediction(m4, e, hand)[0].tone, 'ok');
  const s = selection(p);
  assert.ok(selectionRecognised(s, `${s.weighted[3].toFixed(1)}%`));
  assert.match(checkSelection(s, `${s.weighted[3].toFixed(1)}%`)[0].text, /^Stimmt \(gewichtet\)/);
  assert.match(checkSelection(s, '40,3 %')[0].text, /^Stimmt/);
  const it = interaction(p)!;
  assert.ok(interactionRecognised(it, dot(it.fit.coef[3])));
  assert.deepEqual(matchReading(3.9953, '3.995'), { x: 3.995, decimals: 3 });
  assert.equal(matchReading(3995, '3.995'), null);
  const cc = models({ outcome: 'rev', ref: 4, controls: COMMON_CAUSES, weighted: true })!;
  assert.equal(checkControlled(models, 4, COMMON_CAUSES, { c: '', b: GROUP_IDS.map(g => (g === 4 ? '' : dot(cc.b[g]))) as ModelEntry['b'] })[0].tone, 'ok');
  const lines = Object.fromEntries(plenumLines({ ...initialS09(), ref: 4, model: e, pred: hand }, models));
  assert.equal(lines['B Ost→West'], f3(m4.b[2]));
  assert.equal(lines['Vorhersage Ost→West'], hand.replace('.', ','));
});

test('the prediction for Ost→West is reference-invariant and the typical slips are named', () => {
  const at = (m: Model) => (m.c + m.b[2]).toFixed(2).replace('.', ',');
  assert.match(checkPrediction(m4, entry(m4), at(m4))[0].text, /^Stimmt: Konstante \+ B\(Ost→West\)/);
  assert.equal(at(m4), at(m1));
  const m2 = core(models, 2)!;
  assert.match(checkPrediction(m2, entry(m2), m2.c.toFixed(2).replace('.', ','))[0].text, /Ost→West ist die Referenz/);
  assert.match(checkPrediction(m4, entry(m4), m4.b[2].toFixed(2).replace('.', ','))[0].text, /nur der Abstand/);
  assert.match(checkPrediction(m4, entry(m4), m4.c.toFixed(2).replace('.', ','))[0].text, /Das ist die Konstante/);
  assert.match(checkPrediction(m4, entry(m4), '9,99')[0].text, /Rechne Konstante/);
  assert.deepEqual(checkPrediction(m4, entry(m4), ''), []);
});

test('movers: all cases, weighted, and the cases in the model are recognised; the film is carried by the model cases', () => {
  const v = moverVariants(p), model = v.find(x => x.key === 'model')!, all = v.find(x => x.key === 'all')!;
  assert.deepEqual([model.ow, model.wo], [12, 7]);
  assert.match(checkMovers(v, String(all.ow), String(all.wo))[0].text, /ohne Gewicht über alle.*12 Ost→West und 7 West→Ost/);
  assert.match(checkMovers(v, '12', '7')[0].text, /^Das sind die Umgezogenen, die auch ps03 beantwortet haben – genau sie tragen das Modell\.$/);
  assert.equal(moversRecognised(v, '12', '7')?.key, 'model');
  const w = v.find(x => x.key === 'allWeighted')!;
  assert.equal(moversRecognised(v, String(Math.round(w.ow)), String(Math.round(w.wo)))?.key, 'allWeighted');
  assert.match(checkMovers(v, '7', '12')[0].text, /Vertauscht/);
  assert.match(checkMovers(v, '1', '2')[0].text, /finde ich nicht/);
  assert.doesNotMatch(checkMovers(v, '1', '2')[0].text, /\b(12|7|18|10)\b/);
  assert.deepEqual(checkMovers(v, '12', ''), []);
});

test('selection: row percentages of the Abitur, other rows, column percentages and no-Abitur named', () => {
  const s = selection(p), d1 = (x: number) => x.toFixed(1).replace('.', ',');
  assert.ok(selectionRecognised(s, d1(s.weighted[3])));
  assert.match(checkSelection(s, d1(s.weighted[3]))[0].text, /^Stimmt \(gewichtet\)\. Abitur-Anteile \(gewichtet\): Ost-Bleibende/);
  // so wie crosstab() druckt: gewichtete Zellen erst gerundet, dann Prozent
  assert.ok(selectionRecognised(s, d1(s.printed[3])));
  assert.match(checkSelection(s, d1(s.printed[3]))[0].text, /^Stimmt \(gewichtet\)/);
  assert.match(checkSelection(s, d1(s.colPrinted))[0].text, /Spaltenprozente/);
  // Rückmeldungen verraten keinen Code, den die Hilfeleiter zurückhält
  for (const v of ['99,9', d1(s.col), d1(100 - s.weighted[3])]) assert.doesNotMatch(checkSelection(s, v)[0].text, /crosstab\(|percentages =/);
  // ohne Gewicht – außer die Zahl passt zufällig auch zu einer gewichteten Lesart (Fixture: gerundete Zellen = ungewichtete)
  const plainOnly = ![s.weighted[3], s.printed[3]].some(v => Math.abs(v - s.unweighted[3]) < 0.05);
  assert.match(checkSelection(s, d1(s.unweighted[3]))[0].text, plainOnly ? /ohne Gewicht/ : /^Stimmt/);
  assert.match(checkSelection(s, d1(100 - s.weighted[3]))[0].text, /ohne Abitur/);
  assert.match(checkSelection(s, d1(s.weighted[4]))[0].text, /Zeile West-Bleibende/);
  assert.match(checkSelection(s, d1(s.col))[0].text, /Spaltenprozente/);
  assert.match(checkSelection(s, '99,9')[0].text, /finde ich nicht/);
  assert.ok(!selectionRecognised(s, '99,9'));
});

test('control cards: prompts per sorting, effect of controls, the controlled table and its variants', () => {
  // neutral: nie „ok“, immer ein Argument für die gewählte Seite und eines für die andere (keine Musterlösung)
  for (const id of ['age', 'pt03'] as const) for (const sort of ['vorher', 'folge'] as const) assert.equal(sortNote(id, sort)[0].tone, 'hint');
  assert.match(sortNote('pt03', 'vorher')[0].text, /^Vertrauen in den Bundestag – ein Argument dafür: Vertrauen in Institutionen bringt man vielleicht aus der Jugend mit\. Bedenke auch: Vertrauen wird heute gemessen/);
  assert.match(sortNote('pt03', 'folge')[0].text, /ein Argument dafür: Vertrauen wird heute gemessen.*Bedenke auch: Vertrauen in Institutionen/);
  assert.doesNotMatch(sortNote('di08c', 'folge')[0].text, /Gut begründet/);
  assert.deepEqual(sortNote('abi', ''), []);
  const cc = models({ outcome: 'rev', ref: 4, controls: COMMON_CAUSES, weighted: true })!;
  assert.equal(checkControlled(models, 4, COMMON_CAUSES, entry(cc, false))[0].tone, 'ok');
  assert.ok(modelRecognised(cc, 4, entry(cc, false), false));
  assert.match(checkControlled(models, 4, COMMON_CAUSES, entry(m4, false))[0].text, /ohne Kontrollen/);
  const noAge = models({ outcome: 'rev', ref: 4, controls: ['abi', 'frau'], weighted: true })!;
  assert.match(checkControlled(models, 4, COMMON_CAUSES, entry(noAge, false))[0].text, /Da fehlt eine Kontrolle: Alter/);
  const extra = models({ outcome: 'rev', ref: 4, controls: [...COMMON_CAUSES, 'ep03'], weighted: true })!;
  assert.match(checkControlled(models, 4, COMMON_CAUSES, entry(extra, false))[0].text, /zusätzlich Eigene wirtschaftliche Lage/);
  const eff = controlEffect(models, 4, COMMON_CAUSES)!;
  assert.deepEqual(eff.map(x => x.g), [1, 2, 3]);
  assert.ok(Math.abs(eff[0].with - cc.b[1]) < 1e-12);
});

test('counter-check with pt03 and the interaction as a second notation', () => {
  const pt = core(models, 4, 'pt03')!;
  assert.equal(checkCounter(models, 4, entry(pt, false))[0].tone, 'ok');
  assert.match(checkCounter(models, 4, entry(m4, false))[0].text, /pt03 links vom ~/);
  const it = interaction(p)!;
  const txt = (x: number) => f3(x);
  assert.ok(interactionRecognised(it, txt(it.fit.coef[3])));
  assert.match(checkInteraction(it, m4.fit.r2, txt(it.fit.coef[3]))[0].text, /^Stimmt: ost:ostjugend = .*dieselbe Information, zweite Schreibweise/);
  assert.ok(Math.abs(it.fit.r2 - m4.fit.r2) < 1e-10);
  assert.match(checkInteraction(it, m4.fit.r2, txt(it.orig!.coef[3]))[0].text, /ohne Umpolen/);
  assert.match(checkInteraction(it, m4.fit.r2, txt(it.additive!.coef[1]))[0].text, /ohne Interaktion/);
  assert.match(checkInteraction(it, m4.fit.r2, txt(it.fit.coef[1]))[0].text, /Koeffizient für ost/);
  assert.match(checkInteraction(it, m4.fit.r2, '9,999')[0].text, /finde ich nicht/);
  // Interaktion = O-O − (O→W) − (W→O) + W-W im Modell mit vier Gruppen
  assert.ok(Math.abs(it.fit.coef[3] - (m4.b[1] - m4.b[2] - m4.b[3])) < 1e-9);
});

test('the wobble test and the off-text questions (numbers only with recognised own values)', () => {
  const w = wobbleTest(m4);
  assert.deepEqual(w.map(x => x.g), [1, 2, 3]);
  assert.ok(w.every(x => x.lo <= x.hi));
  assert.equal(wordCount('  Ein  Satz mit   fünf Wörtern '), 5);
  const empty = { selection: null, movers: null, wobble: null, consequences: [], effectWithout: null };
  const q = offQuestions('Die Prägung macht alle Ostdeutschen unzufrieden, wenn sie in den Westen ziehen.', empty).map(n => n.text);
  assert.ok(q.some(t => /^Wer zieht um\? Unterscheiden/.test(t)));
  assert.ok(q.some(t => /^Wie viele Menschen tragen diesen Satz\?$/.test(t)));
  assert.ok(q.some(t => /Und die andere Gruppe\? Du sprichst nur von Ost→West/.test(t)));
  assert.ok(q.some(t => /^Wie sicher ist das\?/.test(t)));
  assert.ok(q.every(t => !/\d/.test(t)), q.join(' | '));
  const full = { selection: selection(p), movers: moverVariants(p)[2], wobble: w, consequences: ['pt03' as const], effectWithout: [{ g: 2 as GroupId, value: -0.17 }] };
  const q2 = offQuestions('Die Prägung macht alle Ostdeutschen unzufrieden, wenn sie in den Westen ziehen.', full).map(n => n.text);
  assert.ok(q2.some(t => /Abitur/.test(t)) && q2.some(t => /Im Modell 12 Ost→West und 7 West→Ost/.test(t)) && q2.some(t => /Vertrauen in den Bundestag kontrolliert.*Ohne diese Kontrolle: Ost→West −0,17/.test(t)) && q2.some(t => /Wackeltest/.test(t)));
  assert.deepEqual(offQuestions('Wer in den Osten oder in den Westen zieht, ähnelt eher den West-Bleibenden – bei wenigen Umgezogenen.', empty).map(n => n.tone), ['ok']);
  assert.match(offQuestions(Array.from({ length: 31 }, () => 'Wort').join(' ') + ' etwa in den Osten und in den Westen', empty)[0].text, /Wörter – die Sprecherin hat Platz für höchstens 30/);
  assert.deepEqual(checkDecide([]), []);
  assert.equal(checkDecide([2])[0].tone, 'ok');
  assert.equal(checkDecide([1, 4])[0].tone, 'hint');
});

test('state: defensive parse, reference changes reset dependent tables, status and the cutting-plan card', () => {
  assert.deepEqual(parseS09(undefined), initialS09());
  assert.deepEqual(parseS09({ ref: 9, decide: 'x', sort: { age: 'bald' }, controls: ['foo'], model: { c: 5, b: 'no' }, second: { ref: 9 } }), initialS09());
  const s = { ...initialS09(), ref: 4 as const, model: entry(m4), pred: '4,16', movers: ['12', '7'] as [string, string], abi: '40,3', controls: COMMON_CAUSES, cmodel: entry(m4, false), offText: 'Satz', second: { ref: 1 as const, model: entry(m1), pred: '4,16' } };
  assert.deepEqual(parseS09(JSON.parse(JSON.stringify(s))), s);
  assert.equal(parseS09({ ref: 2, second: { ref: 2 } }).second.ref, 0);
  assert.equal(statusS09(s), 'done');
  assert.equal(statusS09({ ...s, cmodel: emptyEntry() }), 'running');
  assert.equal(statusS09(initialS09()), 'open');
  const changed = chooseRef({ ...s, refReason: 'Weil' }, 1);
  assert.deepEqual([changed.model, changed.pred, changed.cmodel, changed.second.ref, changed.refReason], [emptyEntry(), '', emptyEntry(), 0, '']);
  assert.equal(chooseRef(s, 2).second.ref, 1);
  assert.equal(chooseRef(s, 4), s);
  assert.deepEqual(chooseSecondRef(s, 2).second, { ref: 2, model: emptyEntry(), pred: '' });
  const toggled = toggleControl(s, 'pt03');
  assert.deepEqual([toggled.controls, toggled.cmodel], [['age', 'frau', 'abi', 'pt03'], emptyEntry()]);
  assert.deepEqual(toggleControl(toggled, 'pt03').controls, ['age', 'frau', 'abi']);
  const lines = Object.fromEntries(plenumLines({ ...s, sort: { ...s.sort, di08c: 'folge', pt03: 'folge' } }, models));
  assert.equal(lines.Referenzgruppe, 'West-Bleibende');
  assert.equal(lines['B Ost→West'], f3(m4.b[2]));
  assert.equal(lines['Vorhersage Ost→West'], '4,16');
  assert.equal(lines['Zweite Referenz'], 'Ost-Bleibende · Vorhersage Ost→West 4,16');
  assert.equal(lines['Bewusst nicht kontrolliert'], 'Einkommen heute, Vertrauen in den Bundestag (kann Folge des Umzugs sein)');
  assert.equal(Object.fromEntries(plenumLines({ ...s, ref: 2 }, models))['B Ost→West'], 'Referenz');
  // nicht erkannte Werte: roh und markiert
  const raw = Object.fromEntries(plenumLines({ ...s, model: { ...s.model, b: [s.model.b[0], '9,999', s.model.b[2], ''] }, pred: '9,99' }, models));
  assert.equal(raw['B Ost→West'], '9,999 (noch nicht geprüft)');
  assert.equal(raw['Vorhersage Ost→West'], '9,99 (noch nicht geprüft)');
  assert.equal(shown('-0,1700', [-0.17]), '−0,1700');
});

/** Pipe-Stil wie in den Seminar-Live-Skripten: %>% statt |>, Datensatz vorn, neue Variablen mit rec() in mutate() und eigenem Namen. */
function assertPipeStyle(code: string, name: string) {
  assert.doesNotMatch(code, /\|>|library\(dplyr\)|coef_table|suffix =/, name);
  // jeder Aufruf mit dem Datensatz läuft über die Pipe; nur codebook(allbus) bleibt so
  assert.doesNotMatch(code.replace(/codebook\(allbus\)/g, ''), /\w+\(allbus\b/, name);
  // rec() nur innerhalb von mutate()
  for (const line of code.split('\n').map(l => l.replace(/#.*$/, '')).filter(l => /\brec\(/.test(l))) assert.match(line, /^\s+\w+\s+= rec\(|mutate\(\w+ = rec\(/, `${name}: ${line}`);
}

test('R code: never all four dummies, pipe style like the live scripts, scaffolds with gaps, no code in feedback', () => {
  for (const ref of GROUP_IDS) {
    const code = rSolution(ref);
    assert.match(code, /^library\(tidyverse\)\nlibrary\(mariposa\)/);
    assert.match(code, /^# Im Codebuch mit Strg\/Cmd \+ F nach dg03 suchen\ncodebook\(allbus\)$/m);
    assert.doesNotMatch(code, /codebook\(allbus, /);
    assertPipeStyle(code, `rSolution(${ref})`);
    assert.match(code, /allbus <- allbus %>%\n  mutate\(\n    demokratie = rec\(ps03, rules = "rev"\)\n  \) %>%\n  to_dummy\(dg03\)/);
    const formulas = code.match(/allbus %>%\n  linear_regression\((demokratie|pt03) ~ [^,]+/g)!.filter(f => f.includes('dg03_'));
    assert.equal(formulas.length, 3);
    for (const f of formulas) assert.equal((f.match(/dg03_\d/g) ?? []).length, 3, f);
    assert.ok(!code.includes(`dg03_${ref} +`) && !code.includes(`+ dg03_${ref},`));
    assert.doesNotMatch(code, /ifelse|%in%/);
  }
  assert.match(rSolution(4), /modell_k <- allbus %>%\n  linear_regression\(demokratie ~ dg03_1 \+ dg03_2 \+ dg03_3 \+ age \+ frau \+ abi, weights = wghtpew\)\n\nmodell_k %>%\n  summary\(\)/);
  assert.match(rSolution(4), /allbus %>%\n  crosstab\(dg03, abi, percentages = "row", weights = wghtpew\)/);
  // lange Formel: nach dem Komma umbrochen
  assert.match(rSolution(4, CONTROL_IDS), /modell_k <- allbus %>%\n  linear_regression\(\n    demokratie ~ dg03_1 \+ dg03_2 \+ dg03_3 \+ age \+ frau \+ abi \+ di08c \+ ep03 \+ pt03,\n    weights = wghtpew\n  \)/);
  assert.match(rSolution(4), /allbus <- allbus %>%\n  mutate\(\n    abi  = rec\(educ, [^\n]+\),\n    frau = rec\(sex, [^\n]+\)\n  \)/);
  assert.match(rSolution(4), /modell_i <- allbus %>%\n  linear_regression\(demokratie ~ ost \* ostjugend, weights = wghtpew\)/);
  assert.match(rSetup(), /^library\(tidyverse\)\nlibrary\(mariposa\)/);
  assert.match(rMovers(), /^allbus %>%\n  frequency\(dg03\)$/m);
  assert.match(rModel(1, 'pt03'), /gegenprobe <- allbus %>%\n  linear_regression\(pt03 ~ dg03_2 \+ dg03_3 \+ dg03_4, weights = wghtpew\)\n\ngegenprobe %>%\n  summary\(\)$/);
  assertPipeStyle(rSolution(4, ['age', 'frau', 'abi', 'di08c', 'ep03', 'pt03']), 'alle Kontrollen');
  // mariposa 0.7.4: auch lange Formeln gehen mit summary()
  assert.match(rControls(4, ['age', 'frau', 'abi', 'di08c', 'ep03', 'pt03']), /modell_k %>%\n  summary\(\)$/);
  for (const sc of [scaffoldMovers(), scaffoldModel(), scaffoldControls(4), scaffoldCounter(), scaffoldInteraction()]) {
    assert.match(sc, /___/);
    assert.match(sc, /allbus %>%/);
    assertPipeStyle(sc, sc);
  }
  assert.match(scaffoldModel(), /allbus <- allbus %>%\n  mutate\(\n    demokratie = rec\(___, rules = "___"\)\n  \) %>%\n  to_dummy\(___\)/);
  // Rückmeldungen nennen höchstens Funktionsnamen, keinen fertigen Aufruf
  const v = moverVariants(p), it = interaction(p)!;
  const texts = [checkMovers(v, '1', '2'), checkInteraction(it, m4.fit.r2, '9,999'), checkInteraction(it, m4.fit.r2, f3(it.additive!.coef[1])), checkModel(p, models, 4, entry(core(models, 4, 'orig')!))].flat().map(n => n.text);
  for (const t of texts) assert.doesNotMatch(t, /\w+\([a-z_]+[,)]|rules = /, t);
});

test('the toolbox: all functions of the session on neutral variables, run-tested in R', () => {
  assert.match(TOOLBOX_SCRIPT, /^library\(tidyverse\)\nlibrary\(mariposa\)\n\nallbus <- read_spss\(file\.choose\(\)\)/);
  assert.match(TOOLBOX_SCRIPT, /^codebook\(allbus\)$/m);
  for (const fn of ['allbus %>%\n  frequency(work)', 'allbus <- allbus %>%\n  mutate(\n', 'gesund   = rec(hs01, rules = "rev")', '  ) %>%\n  to_dummy(work)', 'allbus %>%\n  crosstab(work, gut, percentages = "row", weights = wghtpew)',
    'modell <- allbus %>%\n  linear_regression(ls01 ~ work_1 + work_2 + work_3, weights = wghtpew)', 'ls01 ~ work_1 + work_2 + work_3 + gesund', 'ls01 ~ vollzeit * gut', 'modell_i %>%\n  summary()']) {
    assert.ok(TOOLBOX_SCRIPT.includes(fn), fn);
  }
  // keine Variable aus den Aufgaben
  const code = TOOLBOX_SCRIPT.split('\n').map(l => l.replace(/#.*$/, '')).join('\n');
  for (const v of ['ps03', 'dg03', 'eastwest', 'educ', 'sex', 'age', 'di08c', 'ep03', 'pt03', 'demokratie', 'abi', 'frau', 'ost']) assert.doesNotMatch(code, new RegExp(`\\b${v}\\b`), v);
  assertPipeStyle(TOOLBOX_SCRIPT, 'Werkzeugkasten');
});

test('VIF of the dummies like mariposa: small reference group, high VIF; reference 4 close to 1', () => {
  const v4 = dummyVif(p, m4);
  assert.ok(Number.isNaN(v4[4]));
  for (const g of [1, 2, 3] as const) assert.ok(v4[g] >= 1 && v4[g] < 2, String(v4[g]));
  // die kleinste Gruppe als Referenz treibt die VIF hoch
  const smallest = GROUP_IDS.reduce((a, g) => (m4.n[g] < m4.n[a] ? g : a), 1 as GroupId);
  const worst = maxVif(p, core(models, smallest)!)!;
  assert.ok(worst.vif > maxVif(p, m4)!.vif);
});

test('the pattern of the data: position of the movers between the stayers, compared with the guess', () => {
  const r = patternOf(m4)!;
  assert.equal(r.pos[1] + 0, 0);
  assert.equal(r.pos[4], 1);
  // Fixture: Ost→West in the middle, West→Ost beyond the Ost-Bleibende (as „Ort“ expects)
  assert.deepEqual([r.movers[2], r.movers[3], r.pattern], ['dazwischen', 'ort', 'dazwischen']);
  // The pattern does not depend on the reference
  assert.deepEqual(patternOf(m1), r);
  const hit = comparePattern('dazwischen', m4), miss = comparePattern('praegung', m4);
  assert.equal(hit[0].tone, 'ok');
  assert.equal(miss[0].tone, 'hint');
  assert.match(miss[0].text, /^Dein Tipp: „Prägung“\. Deine Daten zeigen: etwas dazwischen\.$/);
  assert.match(miss[1].text, /Ost→West \(4,16\) liegt etwa in der Mitte .* West→Ost \(4,71\) liegt sogar jenseits der Ost-Bleibenden \(4,41\) – so erwartet es „Ort“\./);
  assert.match(miss[2].text, /nur 12 Ost→West- und 7 West→Ost-Befragte/);
  // Own numbers for the building blocks; the reference group has no B
  assert.deepEqual(predictionParts(m4, entry(m4)), { c: Number(m4.c.toFixed(3)), b: Number(m4.b[2].toFixed(3)) });
  assert.equal(predictionParts(m4, { ...entry(m4), c: 'x' }), null);
  assert.equal(predictionParts(core(models, 2)!, entry(core(models, 2)!))!.b, 0);
});

test('the pattern guess is parsed defensively and lands on the card', () => {
  assert.deepEqual([initialS09().pattern, initialS09().patternLocked], ['', false]);
  assert.deepEqual([parseS09({ pattern: 'ort', patternLocked: true }).pattern, parseS09({ pattern: 'ort', patternLocked: true }).patternLocked], ['ort', true]);
  assert.equal(parseS09({ pattern: 'irgendwas', patternLocked: true }).patternLocked, false);
  assert.equal(parseS09({ pattern: 'ort', patternLocked: 'ja' }).patternLocked, false);
  assert.equal(statusS09({ ...initialS09(), pattern: 'ort', patternLocked: true }), 'running');
  assert.equal(Object.fromEntries(plenumLines({ ...initialS09(), pattern: 'praegung', patternLocked: true }))['Tipp vor dem Modell'], 'Prägung');
  assert.equal(Object.fromEntries(plenumLines({ ...initialS09(), pattern: 'praegung' }))['Tipp vor dem Modell'], '');
});

test('every R code of the session follows the uniform layout (kit/rStyle)', () => {
  // alle Kontrollauswahlen: keine, die Lösung, jede einzelne, alle sechs
  const choices: ControlId[][] = [[], COMMON_CAUSES, ...CONTROL_IDS.map(id => [id]), CONTROL_IDS];
  const codes: Record<string, string> = {
    toolbox: TOOLBOX_SCRIPT, movers: rMovers(), setup: rSetup(), interaction: rInteraction(),
    scaffoldMovers: scaffoldMovers(), scaffoldModel: scaffoldModel(), scaffoldCounter: scaffoldCounter(), scaffoldInteraction: scaffoldInteraction(), hintMovers: hints.movers.scaffold,
    hintInteraction: `${rSetup()}\n\n${rInteraction()}`,
  };
  for (const ref of GROUP_IDS) {
    codes[`scaffoldControls ${ref}`] = scaffoldControls(ref);
    codes[`hintModel ${ref}`] = `${rSetup()}\n\n${rModel(ref)}`;
    codes[`hintCounter ${ref}`] = `${rSetup()}\n\n${rModel(ref, 'pt03')}`;
    for (const c of choices) {
      codes[`hintControls ${ref} ${c.join('+')}`] = `${rSetup()}\n\n${rControls(ref, c)}`;
      codes[`solution ${ref} ${c.join('+')}`] = rSolution(ref, c);
    }
  }
  for (const [name, code] of Object.entries(codes)) assert.deepEqual(rStyleProblems(code), [], name);
});

/* ---------- Einstieg: Referenzgruppe, Kontrolle und Interaktion ausprobieren ---------- */

// 14 Befragte: 12 vollständige (Schicht 1–3 × Gesundheit gut/nicht gut, je zwei), eine ohne Gesundheit, eine ohne Schicht.
const builderSav = () => fakeSav({
  ls01: { values: [8, 6, 7, 5, 9, 7, 9, 5, 8, 4, 9, 8, 10, 4], missingFrom: -1 },
  wghtpew: { values: [1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1] },
  id02: { values: [1, 2, 3, 3, 4, 5, 2, 1, 3, 3, 5, 4, 3, -9], missingFrom: -1 },
  age: { values: [20, 45, 70, 30, 59, 60, 39, 40, 18, 99, 61, 25, 50, -32], missingFrom: -1 },
  hs01: { values: [1, 3, 2, 4, 1, 5, 2, 5, 1, 3, 2, 4, -9, 2], missingFrom: -1 },
});
const wmean = (d: ReturnType<typeof builderData>, keep: (i: number) => boolean) => {
  let s = 0, sw = 0;
  for (let i = 0; i < d.y.length; i++) if (keep(i)) { s += d.w[i] * d.y[i]; sw += d.w[i]; }
  return s / sw;
};
const close = (a: number, b: number, tol = 1e-9) => assert.ok(Math.abs(a - b) < tol, `${a} vs ${b}`);

test('Einstieg: groups like rec() (Schicht from id02, Altersgruppe from age, Gesundheit from hs01), missing codes stay NaN', () => {
  const d = builderData(builderSav());
  assert.deepEqual([...d.by.schicht], [1, 1, 2, 2, 3, 3, 1, 1, 2, 2, 3, 3, 2, NaN]);
  assert.deepEqual([...d.by.alter], [1, 2, 3, 1, 2, 3, 1, 2, 1, 3, 3, 1, 2, NaN]);
  assert.deepEqual([...d.health], [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, NaN, 1]);
  assert.equal(BUILDER_VARS.schicht.rules, '1:2=1 [untere]; 3=2 [mittlere]; 4:5=3 [obere]; else=NA');
});

test('Einstieg: without health the constant is the mean of the reference group and each B the distance to it – the same Befragte in every variant', () => {
  const d = builderData(builderSav());
  const means = BUILDER_CODES.map(g => wmean(d, i => d.by.schicht[i] === g && !Number.isNaN(d.health[i])));
  for (const ref of BUILDER_CODES) {
    const m = builderModel(d, { by: 'schicht', health: 'ohne', ref, refH: 1 })!;
    assert.equal(m.n, 12); // Befragte ohne Gesundheit fehlen auch hier (feste Fallauswahl)
    close(m.terms[0].b, means[ref - 1]);
    for (const t of m.terms.slice(1)) close(t.b, means[t.g! - 1] - means[ref - 1]);
    for (const c of m.cells) close(c.fit, means[c.g - 1]);
    assert.equal(m.cells.find(c => c.g === ref)!.parts.length, 1);
    assert.equal(m.formula, `ls01 ~ ${BUILDER_CODES.filter(g => g !== ref).map(g => `schicht_${g}`).join(' + ')}`);
  }
  assert.deepEqual(builderModel(d, { by: 'schicht', health: 'ohne', ref: 1, refH: 1 })!.cells.map(c => c.n), [4, 4, 4]);
});

test('Einstieg: the interaction model reproduces every group × health mean; the interaction B is the extra bit of the combined bar', () => {
  const d = builderData(builderSav());
  for (const ref of BUILDER_CODES) for (const refH of HEALTH_CODES) {
    const m = builderModel(d, { by: 'schicht', health: 'mal', ref, refH })!;
    assert.equal(m.terms.length, 6);
    for (const c of m.cells) close(c.fit, wmean(d, i => d.by.schicht[i] === c.g && d.health[i] === c.h), 1e-8);
    const combined = m.cells.find(c => c.g !== ref && c.h !== refH)!;
    assert.deepEqual(combined.parts.map(t => t.kind), ['const', 'group', 'health', 'inter']);
    assert.equal(m.cells.find(c => c.g === ref && c.h === refH)!.parts.length, 1);
  }
  assert.equal(builderFormula({ by: 'schicht', health: 'mal', ref: 2, refH: 1 }), 'ls01 ~ (schicht_1 + schicht_3) * gesundheit_2');
  assert.equal(builderFormula({ by: 'alter', health: 'plus', ref: 3, refH: 2 }), 'ls01 ~ alter_1 + alter_2 + gesundheit_1');
  assert.deepEqual(builderModel(d, { by: 'schicht', health: 'mal', ref: 1, refH: 1 })!.terms.map(t => t.name),
    ['(Intercept)', 'schicht_2', 'schicht_3', 'gesundheit_2', 'schicht_2:gesundheit_2', 'schicht_3:gesundheit_2']);
});

test('Einstieg: heights never depend on the references; a control changes the group B; ghosts and earlier B', () => {
  const d = builderData(fixtureSav());
  for (const by of ['schicht', 'alter'] as const) for (const health of ['ohne', 'plus', 'mal'] as const) {
    const base = builderHeights(d, by, health)!;
    for (const ref of BUILDER_CODES) for (const refH of HEALTH_CODES) {
      const m = builderModel(d, { by, health, ref, refH })!;
      m.cells.forEach((c, i) => close(c.fit, base.cells[i].fit, 1e-9));
      assert.equal(m.n, base.n);
    }
  }
  const tiny = builderData(builderSav());
  const ohne = builderModel(tiny, { by: 'schicht', health: 'ohne', ref: 1, refH: 1 })!, plus = builderModel(tiny, { by: 'schicht', health: 'plus', ref: 1, refH: 1 })!;
  assert.ok(Math.abs(termBefore(ohne, 'schicht_3')! - plus.terms[2].b) > 1e-6);
  assert.equal(termBefore(ohne, 'gesundheit_2'), null);
  assert.equal(termBefore(null, '(Intercept)'), null);
  // Geister: ohne → mit Gesundheit = Höhe der ganzen Gruppe; mit → ohne gibt es keinen einen Vergleichswert
  close(ghostFit(ohne, { g: 2, h: 1 })!, ohne.cells[1].fit);
  assert.equal(ghostFit(plus, { g: 2, h: null }), null);
  close(ghostFit(plus, { g: 3, h: 2 })!, plus.cells.find(c => c.g === 3 && c.h === 2)!.fit);
  assert.equal(ghostFit(null, { g: 1, h: null }), null);
});

test('Einstieg: an empty group gives no model instead of a wrong one', () => {
  const sav = builderSav();
  const id02 = sav.byName.get('id02')!;
  id02.values = Float64Array.from(id02.values, v => (v === 4 || v === 5 ? 3 : v));
  const d = builderData(sav);
  assert.equal(builderModel(d, { by: 'schicht', health: 'ohne', ref: 1, refH: 1 }), null);
  assert.equal(builderHeights(d, 'schicht', 'plus'), null);
  assert.ok(builderHeights(d, 'alter', 'mal'));
});
