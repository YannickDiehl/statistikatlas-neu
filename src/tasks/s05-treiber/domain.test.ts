import test from 'node:test';
import assert from 'node:assert/strict';
import { fakeSav, fixtureSav } from '../../sandbox/testData';
import { rStyleProblems } from '../kit/rStyle';
import { CARD_IDS, cardById, CARDS, LEVEL_MEASURES, MEASURE_INFO, TOOLBOX_SCRIPT } from './content';
import {
  boardMeasures, boardTable, independentBoard, cardValues, checkCodeFor, checkEntry, checkLevel, checkOutcomeLevel, compareRankGuess, COMPARE_BY, defaultGuess, guessRows, MEASURE_IDS, measureFit, moveGuess, checkStamp, checkStrata, chooseMeasure, direction, driverQuestion, fitNotes, initialS05, parseS05, pickCard, plenumLines, prepare,
  randomCard, ranks, rCodeFor, recognised, reducedNote, reveal, revealNotes, rMeasureFor, rSetupFor, rSplitFor, scaffoldFor, splitScaffoldFor, stampReading, stampRule, statusS05, strata, tolerance, variants,
} from './domain';

const p = prepare(fixtureSav());

test('board: health × satisfaction in three groups each, measures react to order and to independence', () => {
  const sav = fakeSav({
    hs01: { values: [1, 2, 3, 4, 5, -9, 1], missingFrom: -1 }, ps03: { values: [1, 2, 4, 6, 5, 1, -11], missingFrom: -1 },
    ep01: { values: [1, 1, 1, 1, 1, 1, 1] }, wghtpew: { values: [1, 1, 1, 1, 1, 1, 1] }, eastwest: { values: [1, 1, 1, 1, 1, 1, 1] },
  });
  // Zeilen schlecht/mittel/gut, Spalten unzufrieden/teils/zufrieden; fehlende Werte fallen weg
  assert.deepEqual(boardTable(prepare(sav)), [[2, 0, 0], [0, 1, 0], [0, 0, 2]]);
  // Echte ALLBUS-Tafel (in R nachgezählt): Gamma .273, Tau-b .166, r .183, V .136
  const real = [[129, 247, 154], [169, 394, 452], [260, 659, 1146]];
  const r3 = (x: number) => Math.round(x * 1000) / 1000;
  const m = boardMeasures(real);
  assert.deepEqual([m.V, m.gamma, m.tau, m.r].map(r3), [0.136, 0.273, 0.166, 0.183]);
  // Umgedrehte Spalten: Vorzeichen kippt, V bleibt
  const flipped = boardMeasures(real, [0, 1, 2], [2, 1, 0]);
  assert.equal(r3(flipped.V), r3(m.V));
  assert.equal(r3(flipped.gamma), -r3(m.gamma));
  // Durcheinander: V bleibt, Gamma schrumpft
  const mixed = boardMeasures(real, [0, 1, 2], [0, 2, 1]);
  assert.equal(r3(mixed.V), r3(m.V));
  assert.ok(Math.abs(mixed.gamma) < Math.abs(m.gamma));
  // Zusammenhang aufgelöst: gleiche Randsummen, alle Maße nahe 0
  const free = independentBoard(real);
  assert.deepEqual(free.map(r => r.reduce((a, b) => a + b, 0)), real.map(r => r.reduce((a, b) => a + b, 0)));
  for (let j = 0; j < 3; j++) assert.ok(Math.abs(free.reduce((a, r) => a + r[j], 0) - real.reduce((a, r) => a + r[j], 0)) <= 1);
  for (const v of Object.values(boardMeasures(free))) assert.ok(Math.abs(v) < 0.01, String(v));
  // Leere Tafel: keine NaN, sondern 0
  assert.deepEqual(Object.values(boardMeasures([[0, 0, 0], [0, 0, 0], [0, 0, 0]])), [0, 0, 0, 0]);
});
const ep01 = cardById.ep01, vars = variants(p, ep01);
const value = (measure: string, weighted: boolean, stratum = -1, reversed = true) =>
  vars.find(v => v.measure === measure && v.weighted === weighted && v.stratum === stratum && v.reversed === reversed)!.value;
const fmt = (x: number) => x.toFixed(3).replace('.', ',').replace('-', '−');

test('reverses ps03, recodes cards like rec() and groups the economy as a third variable', () => {
  const sav = fakeSav({
    ps03: { values: [1, 6, -11, 3], missingFrom: -1 }, ep01: { values: [1, 3, 5, -9], missingFrom: -1 }, wghtpew: { values: [1, 1, 1, 1] },
    eastwest: { values: [1, 2, 1, 2] }, rd01: { values: [2, 3, 5, 6], missingFrom: -1 }, educ: { values: [1, 5, 6, 7], missingFrom: -1 },
  });
  const q = prepare(sav);
  assert.deepEqual([...q.y], [6, 1, NaN, 4]);
  assert.deepEqual([...q.lage], [1, 2, 3, NaN]);
  assert.deepEqual([...cardValues(q, cardById.konf)], [1, 2, 3, 4]);
  assert.deepEqual([...cardValues(q, cardById.educ5)], [1, 5, NaN, NaN]);
  assert.deepEqual(strata(q, cardById.eastwest).map(s => s.label), ['Wirtschaftslage gut', 'Wirtschaftslage teils/teils', 'Wirtschaftslage schlecht']);
});

test('computes every variant: measure × weight × region × coding of ps03', () => {
  assert.equal(vars.length, 60);
  assert.equal(variants(p, cardById.eastwest).length, 80);
  assert.equal(value('gamma', true, -1, false), -value('gamma', true));
  assert.equal(value('rho', true), value('rho', false));
  assert.equal(tolerance('0,54'), 0.005 + 1e-9);
  assert.equal(tolerance('0,5'), null);
});

test('the value detector names which variant a number is', () => {
  const check = (measure: 'gamma' | 'tau' | 'rho', weighted: boolean, input: string) => checkEntry(p, ep01, vars, { measure, weighted, value: input });
  assert.match(check('gamma', true, fmt(value('gamma', true)))[0].text, /^Stimmt: Gamma mit Gewicht/);
  assert.match(check('gamma', true, fmt(value('gamma', false)))[0].text, /Gamma ohne Gewicht.*weights = wghtpew/);
  assert.match(check('gamma', true, fmt(-value('gamma', true)))[0].text, /Originalkodierung.*umgepolt/);
  assert.match(check('tau', true, fmt(value('tau', false, 0)))[0].text, /\(West\).*ganz Deutschland/);
  assert.match(check('tau', true, fmt(value('gamma', true)))[0].text, /Gamma mit Gewicht.*Tau-b gewählt/);
  assert.match(check('gamma', true, '0,5')[0].text, /drei Nachkommastellen/);
  assert.match(check('gamma', true, '0,999')[0].text, /finde ich für diese Karte nicht/);
  assert.match(check('rho', true, fmt(value('rho', true)))[0].text, /nur zur Fallauswahl/);
  assert.deepEqual(checkStrata(p, ep01, vars, 'tau', [fmt(value('tau', false, 0)), fmt(value('tau', true, 1))]).map(n => n.tone), ['ok', 'ok']);
});

test('reads the stamp by the disclosed rule (real ALLBUS values)', () => {
  assert.equal(stampReading(-0.387, [-0.367, -0.436], true), 'trägt');
  assert.equal(stampReading(-0.136, [-0.109, -0.076], true), 'schrumpft');
  assert.equal(stampReading(-0.057, [-0.063, -0.136], true), 'nur in einem Landesteil');
  assert.equal(stampReading(0.059, [0.095, -0.045], true), 'kehrt sich um');
  assert.equal(stampReading(-0.028, [-0.040, 0.005], true), 'nur in einem Landesteil');
  assert.match(checkStamp(p, ep01, vars, 'tau', 'kehrt sich um')[0].text, /die Entscheidung bleibt bei dir/);
});

test('the stamp reading names numbers only when the own strata values are right', () => {
  const right = [fmt(value('tau', false, 0)), fmt(value('tau', false, 1))];
  const total = fmt(value('tau', true)), parts = [fmt(value('tau', false, 0)), fmt(value('tau', false, 1))];
  for (const stamp of ['trägt', 'kehrt sich um'] as const) {
    const ok = checkStamp(p, ep01, vars, 'tau', stamp, right)[0].text;
    assert.ok(ok.includes(total) && parts.every(x => ok.includes(x)), ok);
    // Falsche, Platzhalter-, leere oder fehlende Teilwerte: nur die Lesart, keine einzige Ziffer.
    for (const wrong of [['0,999', '0,999'], ['0,000', '0,000'], [right[0], '0,999'], ['x', 'y'], ['', ''], []]) {
      const text = checkStamp(p, ep01, vars, 'tau', stamp, wrong)[0].text;
      assert.doesNotMatch(text, /\d/, text);
      assert.match(text, /Nach der offengelegten Regel lese ich|Meine Lesart nach der offengelegten Regel ist auch/);
    }
  }
  // Ohne Maß lässt sich nichts prüfen, also auch keine Zahl; ohne Teilwerte-Argument ebenso.
  assert.doesNotMatch(checkStamp(p, ep01, vars, '', 'trägt', right)[0].text, /\d/);
  assert.doesNotMatch(checkStamp(p, ep01, vars, 'tau', 'trägt')[0].text, /\d/);
});

test('the disclosed stamp rule names the parts of the card and keeps the thresholds', () => {
  const ew = cardById.eastwest;
  assert.match(stampRule(ep01), /Landesteile/);
  assert.doesNotMatch(stampRule(ep01), /Wirtschaftslage/);
  assert.match(stampRule(ew), /Gruppen der Wirtschaftslage/);
  assert.doesNotMatch(stampRule(ew), /Landesteile haben|Landesteile unter|beide/);
  for (const rule of [stampRule(ep01), stampRule(ew), stampRule(null)]) for (const threshold of ['0,03', 'doppelt so groß', '0,1', '85 %']) assert.ok(rule.includes(threshold), `${threshold}: ${rule}`);
  assert.equal(stampRule(null), stampRule(ep01));
  // Die Schwellen gelten für beide Fassungen so, wie stampReading() sie anwendet.
  assert.equal(stampReading(0.2, [0.03, -0.03], true), 'kehrt sich um');
  assert.equal(stampReading(0.2, [0.03, 0.2, -0.03], true), 'kehrt sich um');
  assert.equal(stampReading(0.2, [0.029, -0.2], true), 'nur in einem Landesteil');
  assert.equal(stampReading(0.3, [0.05, 0.11, 0.3], false), 'nur in einem Landesteil');
  assert.equal(stampReading(0.3, [0.2, 0.25, 0.3], false), 'schrumpft');
  assert.equal(stampReading(0.3, [0.26, 0.3, 0.3], false), 'trägt');
});

test('numbers in the fit prompts need a value the detector recognises', () => {
  assert.equal(recognised(vars, fmt(value('gamma', true))), true);
  assert.equal(recognised(vars, fmt(value('tau', false, 1))), true);
  assert.equal(recognised(vars, fmt(-value('gamma', true))), true);
  assert.equal(recognised(vars, '0,999'), false);
  assert.equal(recognised(vars, '12,345'), false);
  assert.equal(recognised(vars, 'x'), false);
  assert.equal(recognised(vars, ''), false);
  assert.equal(recognised(vars, '0,5'), false);
});

test('gives fit prompts without grading', () => {
  const konf = cardById.konf, kv = variants(p, konf);
  assert.match(fitNotes(p, konf, kv, 'gamma')[0].text, /willkürlich.*\/.*\//);
  assert.match(fitNotes(p, ep01, vars, 'phi')[0].text, /Vierfeldertafeln/);
  assert.match(fitNotes(p, ep01, vars, 'gamma')[0].text, /Bindungen.*dem Betrag nach größer als Tau-b/);
  assert.match(fitNotes(p, ep01, vars, 'r')[0].text, /gleiche Abstände/);
  assert.match(fitNotes(p, cardById.age, variants(p, cardById.age), 'V')[0].text, /Zufalls-V/);
  assert.doesNotMatch(fitNotes(p, ep01, vars, 'gamma', false)[0].text, /γ|τ/);
  assert.doesNotMatch(fitNotes(p, cardById.age, variants(p, cardById.age), 'V', false)[0].text, /≈/);
  assert.doesNotMatch(fitNotes(p, cardById.konf, variants(p, cardById.konf), 'gamma', false)[0].text, /\d,\d{3}/);
  assert.equal(checkLevel(cardById.pa01, 'ordinal')[0].tone, 'ok');
  assert.equal(checkLevel(ep01, 'nominal')[0].tone, 'hint');
  assert.equal(direction(ep01, -0.5), 'Wer die Wirtschaftslage schlechter einschätzt, ist eher unzufriedener mit der Demokratie.');
  assert.equal(direction(ep01, 0.02), 'Der Zusammenhang ist so schwach, dass sich keine Richtung angeben lässt.');
  assert.match(driverQuestion('Die Wirtschaftslage treibt die Zufriedenheit')[0].text, /Drittvariable/);
  assert.deepEqual(driverQuestion('hängt zusammen'), []);
});

test('reveals the ranking by four measures', () => {
  assert.deepEqual(ranks({ ep01: -0.5, age: 0.1, konf: NaN, pt03: 0.6 }), { pt03: 1, ep01: 2, age: 3 });
  const r = reveal(p);
  assert.ok(Number.isNaN(r.west.eastwest.V));
  assert.ok(Number.isNaN(r.weighted.konf.gamma) && Number.isNaN(r.weighted.konf.r) && Number.isFinite(r.weighted.konf.V));
  // Die Testdatei hat im Alter in West und Ost dasselbe Vorzeichen – die ALLBUS-Bemerkung darf dann nicht erscheinen.
  const notes = revealNotes(r, 'weighted');
  assert.ok(notes.length >= 1);
  assert.ok(notes.every(n => !/verschiedene Richtungen/.test(n)));
});

test('writes the R script for each kind of card, in the %>% pipe style', () => {
  assert.match(rCodeFor(cardById.konf), /allbus <- allbus %>%\n  mutate\(\n    zufriedenheit = rec\(ps03, rules = "rev"\),\n    konf {10}= rec\(rd01, rules = "1:2=1 \[evangelisch\]; 3=2 \[katholisch\]; 4:5=3 \[andere\]; 6=4 \[keine\]; else=NA"\)\n  \)/);
  assert.match(rCodeFor(ep01), /allbus <- allbus %>%\n  mutate\(\n    zufriedenheit = rec\(ps03, rules = "rev"\)\n  \)/);
  assert.match(rCodeFor(ep01), /^# Pakete laden[^\n]*\nlibrary\(tidyverse\)\nlibrary\(mariposa\)\n\n# Daten einlesen[^\n]*\nallbus <- read_spss\(file\.choose\(\)\)/);
  assert.match(rCodeFor(ep01), /# Codebuch öffnen: mit Strg\/Cmd \+ F nach ps03 und ep01 suchen\ncodebook\(allbus\)\n\n/);
  assert.match(rCodeFor(cardById.konf), /# [^\n]*Westen \(eastwest 1\)\nallbus %>%\n  filter\(eastwest == 1\) %>%\n  cramers_v\(zufriedenheit, konf\)\n\n# [^\n]*Osten \(eastwest 2\)\nallbus %>%\n  filter\(eastwest == 2\) %>%\n  cramers_v\(zufriedenheit, konf\)/);
  assert.match(rCodeFor(ep01), /allbus %>%\n  kendall_tau\(zufriedenheit, ep01, weights = wghtpew\)/);
  assert.match(rCodeFor(cardById.age), /allbus %>%\n  pearson_cor\(zufriedenheit, age, weights = wghtpew\)/);
  assert.match(rCodeFor(cardById.eastwest), /allbus <- allbus %>%\n  mutate\(\n    lage = rec\(ep01, rules = "1:2=1 \[gut\]; 3=2 \[teils\/teils\]; 4:5=3 \[schlecht\]; else=NA"\)\n  \)/);
  assert.match(rCodeFor(cardById.eastwest), /# [^\n]*„schlecht“ \(lage 3\)\nallbus %>%\n  filter\(lage == 3\) %>%\n  goodman_gamma\(zufriedenheit, eastwest\)/);
  for (const card of CARDS) {
    const code = rCodeFor(card);
    assert.doesNotMatch(code, /\|>|group_by|unlabel|crosstab|library\(dplyr\)|suffix/, card.id);
    assert.doesNotMatch(code, /codebook\(allbus, /, card.id);
    // Datensatz vorn: kein Maß und kein filter() mit allbus oder einer Teilmenge in der Klammer, keine Zwischenobjekte.
    assert.doesNotMatch(code, /(cramers_v|phi|goodman_gamma|kendall_tau|spearman_rho|pearson_cor|filter|mutate)\((allbus|west|ost|gut|teils|schlecht)\b/, card.id);
    assert.doesNotMatch(code, /^(west|ost|gut|teils|schlecht)\s*<-/m, card.id);
    // Reihenfolge wie in der Aufgabe: Schritt 3, 4, 6.
    assert.ok(code.indexOf('Schritt 3') < code.indexOf('Schritt 4') && code.indexOf('Schritt 4') < code.indexOf('Schritt 6'), card.id);
    assert.ok(code.startsWith(`${rSetupPart(code)}`));
    assert.ok(code.includes(rMeasureFor(card)) && code.includes(rSplitFor(card)), card.id);
  }
  assert.match(scaffoldFor(ep01), /mutate\(\n    zufriedenheit = rec\(ps03, rules = "___"\)\n  \)\n\n# [^\n]*\nallbus %>%\n  goodman_gamma\(zufriedenheit, ep01, weights = ___\)$/);
  assert.match(scaffoldFor(cardById.konf), /konf {10}= rec\(rd01, rules = "___"\)/);
  assert.match(splitScaffoldFor(cardById.eastwest), /lage = rec\(ep01, rules = "___"\)\n  \)\n\n# [^\n]*\nallbus %>%\n  filter\(lage == ___\) %>%\n  goodman_gamma\(zufriedenheit, ___\)$/);
  assert.match(splitScaffoldFor(ep01), /# nur im Westen[^\n]*\nallbus %>%\n  filter\(eastwest == ___\) %>%\n  ___\(zufriedenheit, ep01\)/);
  // Schritt 6: Lückencode verrät die zweite Funktion nicht, die Lösung nimmt das gewählte oder ein passendes Maß.
  assert.match(checkCodeFor(ep01, 'gamma', '', true), /^# zweites Maß[\s\S]*allbus %>%\n  ___\(zufriedenheit, ep01, weights = wghtpew\)[\s\S]*ohne Gewicht[\s\S]*allbus %>%\n  ___\(zufriedenheit, ep01\)$/);
  assert.match(checkCodeFor(ep01, 'gamma', '', false), /allbus %>%\n  kendall_tau\(zufriedenheit, ep01, weights = wghtpew\)\n\n# dein erstes Maß ohne Gewicht\nallbus %>%\n  goodman_gamma\(zufriedenheit, ep01\)$/);
  assert.match(checkCodeFor(ep01, 'gamma', 'rho', false), /allbus %>%\n  spearman_rho\(zufriedenheit, ep01, weights = wghtpew\)/);
  assert.match(checkCodeFor(cardById.konf, 'V', '', false), /# zweites Maß, gewichtet – Phi ist für 2 × 2 gedacht, hier nur zum Vergleich\nallbus %>%\n  phi\(zufriedenheit, konf, weights = wghtpew\)/);
  assert.match(checkCodeFor(cardById.eastwest, 'V', '', false), /allbus %>%\n  goodman_gamma\(zufriedenheit, eastwest, weights = wghtpew\)/);
  assert.match(checkCodeFor(cardById.age, '', '', false), /spearman_rho[\s\S]*allbus %>%\n  pearson_cor\(zufriedenheit, age\)$/);
  for (const code of CARDS.flatMap(c => [scaffoldFor(c), splitScaffoldFor(c), checkCodeFor(c, '', '', true), checkCodeFor(c, '', '', false)])) assert.doesNotMatch(code, /\|>|suffix/);
});

test('every R code block of the session follows the uniform layout (rStyleProblems)', () => {
  const ids = ['', ...MEASURE_IDS] as const;
  const codes: [string, string][] = [['toolbox', TOOLBOX_SCRIPT]];
  for (const card of CARDS) {
    codes.push([`${card.id} full`, rCodeFor(card)], [`${card.id} step 3`, `${rSetupFor(card)}\n\n${rMeasureFor(card)}`], [`${card.id} step 4`, rSplitFor(card)],
      [`${card.id} scaffold 3`, scaffoldFor(card)], [`${card.id} scaffold 4`, splitScaffoldFor(card)]);
    for (const first of ids) for (const second of ids) for (const blank of [true, false]) codes.push([`${card.id} step 6 ${first}/${second}/${blank}`, checkCodeFor(card, first, second, blank)]);
  }
  for (const [name, code] of codes) assert.deepEqual(rStyleProblems(code), [], `${name}\n${code}`);
});
const rSetupPart = (code: string) => code.slice(0, code.indexOf('\n'));

test('the toolbox script loads tidyverse before mariposa, shows every measure with weights and uses no variable of the tasks', () => {
  assert.match(TOOLBOX_SCRIPT, /^# Pakete laden[^\n]*\nlibrary\(tidyverse\)\nlibrary\(mariposa\)\n/);
  for (const fn of ['cramers_v(', 'phi(', 'goodman_gamma(', 'kendall_tau(', 'spearman_rho(', 'pearson_cor(', 'filter(', 'mutate(', 'rec(', 'frequency(']) assert.ok(TOOLBOX_SCRIPT.includes(fn), fn);
  assert.match(TOOLBOX_SCRIPT, /weights = wghtpew/);
  assert.doesNotMatch(TOOLBOX_SCRIPT, /\|>|group_by|suffix/);
  // Pipe-Stil: Datensatz vorn, neue Variable mit mutate() und rec(), Teilmenge in der Kette statt als Zwischenobjekt.
  assert.match(TOOLBOX_SCRIPT, /allbus %>%\n  cramers_v\(gesundheit, sex, weights = wghtpew\)/);
  assert.match(TOOLBOX_SCRIPT, /allbus <- allbus %>%\n  mutate\(\n    gesundheit = rec\(hs01, rules = "rev"\)\n  \)/);
  assert.match(TOOLBOX_SCRIPT, /allbus %>%\n  filter\(sex == 2\) %>%\n  goodman_gamma\(gesundheit, incc\)/);
  assert.doesNotMatch(TOOLBOX_SCRIPT, /\((allbus|frauen)\b|frauen <-/);
  const code = TOOLBOX_SCRIPT.split('\n').filter(l => !l.startsWith('#')).join('\n');
  for (const v of ['ps03', ...CARDS.map(c => c.source), 'eastwest', 'zufriedenheit', 'lage']) assert.doesNotMatch(code, new RegExp(`\\b${v}\\b`), v);
});

test('restores state defensively, reports status and builds the plenum card', () => {
  assert.deepEqual(parseS05(null), initialS05());
  const s = parseS05({ card: 'xx', measure: 'gamma', stamp: 'trägt', strata: ['-0,5', 7] });
  assert.equal(s.card, null);
  assert.deepEqual(s.strata, ['-0,5', '', '']);
  const done = { ...initialS05(), card: 'ep01' as const, measure: 'gamma' as const, value: '-0,544', stamp: 'trägt' as const, sentence: 'Satz', recommendation: 'Empfehlung',
    second: { measure: 'tau' as const, value: '-0,387', unweighted: '', veto: true } };
  assert.equal(statusS05(initialS05()), 'open');
  assert.equal(statusS05({ ...initialS05(), card: 'age' }), 'running');
  assert.equal(statusS05(done), 'done');
  assert.deepEqual(plenumLines(done).slice(0, 4), [['Kandidat', 'Wirtschaftslage in Deutschland (ep01)'], ['Maß = Wert · Urteil', 'Gamma = -0,544 · trägt'], ['Zweites Maß', 'Tau-b = -0,387'], ['„Treiber“?', 'Veto: kein Treiber']]);
  for (const [label, text] of plenumLines(done)) assert.doesNotMatch(`${label} ${text}`, /Stempel|Währung/);
});

test('the card West oder Ost checks the economy groups with Gamma, whatever measure was chosen', () => {
  const ew = cardById.eastwest, ev = variants(p, ew);
  const g = (s: number) => ev.find(v => v.measure === 'gamma' && !v.weighted && v.stratum === s && v.reversed)!.value;
  assert.deepEqual(checkStrata(p, ew, ev, 'V', [fmt(g(0)), fmt(g(1)), fmt(g(2))]).map(n => n.tone), ['ok', 'ok', 'ok']);
  assert.match(checkStamp(p, ew, ev, 'V', 'trägt', [fmt(g(0)), fmt(g(1)), fmt(g(2))])[0].text, /Gamma gesamt/);
  assert.doesNotMatch(checkStamp(p, ew, ev, 'V', 'trägt', ['0,999', '0,999', '0,999'])[0].text, /\d/);
});

test('West oder Ost: Cramér-V per group gets the pointer to Gamma, without any reference number', () => {
  const ew = cardById.eastwest, ev = variants(p, ew);
  const vPerGroup = (s: number) => ev.find(v => v.measure === 'V' && !v.weighted && v.stratum === s && v.reversed)!.value;
  const gammaPerGroup = (s: number) => ev.find(v => v.measure === 'gamma' && !v.weighted && v.stratum === s && v.reversed)!.value;
  // Der Test braucht V-Werte, die nicht zugleich ein Gamma-Wert derselben Gruppe sind.
  for (const s of [0, 1, 2]) assert.ok(Math.abs(vPerGroup(s) - gammaPerGroup(s)) > 0.01 && Math.abs(vPerGroup(s) + gammaPerGroup(s)) > 0.01);
  for (const chosen of ['V', 'gamma', ''] as const) {
    for (const s of [0, 1, 2]) {
      const inputs = ['', '', ''];
      inputs[s] = fmt(vPerGroup(s));
      const [note] = checkStrata(p, ew, ev, chosen, inputs);
      assert.equal(note.tone, 'warn');
      assert.match(note.text, /Das ist Cramér-V\. Bei dieser Karte rechnest du je Gruppe Gamma \(goodman_gamma\(\)\)/);
      assert.ok(!note.text.includes(fmt(vPerGroup(s))) && !note.text.includes(fmt(gammaPerGroup(s))), note.text);
    }
  }
  // Ein Wert, der gar nichts trifft, bekommt den kartenbewussten Rückfalltext: Gamma, nicht „dasselbe Maß“.
  const [lost] = checkStrata(p, ew, ev, 'V', ['0,999', '', '']);
  assert.match(lost.text, /Diesen Wert finde ich nicht.*rechne Gamma/);
  assert.doesNotMatch(lost.text, /dasselbe Maß/);
  // Andere Karten behalten den alten Text und nennen Gamma nicht als Pflichtmaß.
  assert.match(checkStrata(p, ep01, vars, 'tau', ['0,999', ''])[0].text, /rechne darin dasselbe Maß wie in Schritt 3/);
  // Gamma je Gruppe ist und bleibt richtig.
  assert.equal(checkStrata(p, ew, ev, 'V', [fmt(gammaPerGroup(0)), '', ''])[0].tone, 'ok');
});

test('the R solution of West oder Ost contains the weighted Gamma total before the economy groups', () => {
  const ew = cardById.eastwest;
  assert.match(rMeasureFor(ew), /allbus %>%\n  goodman_gamma\(zufriedenheit, eastwest, weights = wghtpew\)/);
  const code = rCodeFor(ew);
  assert.ok(code.indexOf('goodman_gamma(zufriedenheit, eastwest, weights') < code.indexOf('lage = rec('), code);
  assert.doesNotMatch(rCodeFor(cardById.konf), /goodman_gamma/);
  assert.doesNotMatch(scaffoldFor(cardById.konf), /goodman_gamma/);
});

test('choosing the main measure that is already the second currency clears the second currency and its value', () => {
  const s = { ...initialS05(), card: 'ep01' as const, measure: 'gamma' as const, value: '-0,544',
    second: { measure: 'tau' as const, value: '-0,387', unweighted: '-0,553', veto: true } };
  // Kollision: Das neue Maß ist die zweite Währung → zweite Währung und ihr Wert werden geleert, der Rest bleibt.
  assert.deepEqual(chooseMeasure(s, 'tau'), { ...s, measure: 'tau', second: { measure: '', value: '', unweighted: '-0,553', veto: true } });
  // Keine Kollision: nichts außer dem Maß ändert sich.
  assert.deepEqual(chooseMeasure(s, 'rho'), { ...s, measure: 'rho' });
  assert.deepEqual(chooseMeasure(s, ''), { ...s, measure: '' });
  // Leere zweite Währung ist keine Kollision mit dem leeren Maß.
  assert.deepEqual(chooseMeasure(initialS05(), ''), initialS05());
});

test('a new card starts the card-bound work from scratch and a draw never repeats the current card', () => {
  const s = { ...initialS05(), mode: 'pair' as const, card: 'ep01' as const, measure: 'gamma' as const, value: '-0,544', stamp: 'trägt' as const, sentence: 'Satz', recommendation: 'Empfehlung',
    second: { measure: 'tau' as const, value: '-0,387', unweighted: '-0,553', veto: true }, view: 'ost' as const };
  assert.deepEqual(pickCard(s, 'age'), { ...initialS05(), mode: 'pair', card: 'age' });
  for (let i = 0; i < 50; i++) assert.notEqual(randomCard('ep01', () => i / 50), 'ep01');
  assert.equal(randomCard('ep01', () => 0.9999999), 'pt03');
});

test('the decision path greys exactly the measures that do not fit the level and names a reason', () => {
  for (const level of ['nominal', 'ordinal', 'metrisch'] as const) for (const m of MEASURE_IDS) {
    const fit = measureFit(level, m);
    assert.equal(fit.fits, LEVEL_MEASURES[level].includes(m), `${level} ${m}`);
    assert.equal(Boolean(MEASURE_INFO[m].misfit[level]), !fit.fits, `${level} ${m}: Grund nur bei unpassenden Maßen`);
  }
  assert.ok(MEASURE_IDS.every(m => measureFit('', m).fits));
  assert.equal(checkOutcomeLevel('ordinal')[0].tone, 'ok');
  assert.equal(checkOutcomeLevel('metrisch')[0].tone, 'ok');
  assert.equal(checkOutcomeLevel('nominal')[0].tone, 'hint');
  assert.deepEqual(checkOutcomeLevel(''), []);
});

test('the rank guess moves cards, restores defensively and compares with the real ranking', () => {
  const start = defaultGuess();
  assert.equal(start.length, CARD_IDS.length);
  assert.equal(new Set(start).size, CARD_IDS.length);
  assert.deepEqual(moveGuess(['ep01', 'age', 'konf'] as const as never, 2, 0), ['konf', 'ep01', 'age']);
  assert.deepEqual(moveGuess(start, 0, -1), start);
  // Gespeicherter Tipp: nur eine vollständige Reihenfolge zählt; gesperrt nur mit gültigem Tipp.
  assert.deepEqual(parseS05({ rankGuess: start, rankLocked: true }).rankGuess, start);
  assert.equal(parseS05({ rankGuess: start, rankLocked: true }).rankLocked, true);
  for (const bad of [start.slice(1), [...start.slice(1), start[1]], 'x', [1, 2]]) {
    const s = parseS05({ rankGuess: bad, rankLocked: true });
    assert.deepEqual(s.rankGuess, []);
    assert.equal(s.rankLocked, false);
  }
  assert.equal(parseS05({ outcomeLevel: 'ordinal' }).outcomeLevel, 'ordinal');
  assert.equal(parseS05({ outcomeLevel: 'kardinal' }).outcomeLevel, '');

  const r = reveal(p);
  const real = ranks(Object.fromEntries(CARD_IDS.map(id => [id, r.weighted[id].V])));
  const perfect = [...CARD_IDS].sort((a, b) => real[a]! - real[b]!);
  assert.ok(guessRows(perfect, r, 'weighted', 'V').every(x => x.shift === 0));
  assert.match(compareRankGuess(perfect, r, 'weighted', 'V')[0].text, /im Mittel 0,0 Plätze daneben\. 13 Karten hast du genau getroffen/);
  assert.equal(compareRankGuess(perfect, r, 'weighted', 'V')[0].tone, 'ok');
  // Umgedreht: weit daneben, mit überraschender Karte; Konfession hat bei Gamma keinen Platz.
  const reversed = [...perfect].reverse();
  const notes = compareRankGuess(reversed, r, 'weighted', 'gamma');
  assert.equal(notes[0].tone, 'hint');
  assert.match(notes[1].text, /^Am meisten überrascht .*: getippt auf Platz \d+, tatsächlich Platz \d+ \(gezählt ohne Konfession\)\.$/);
  assert.match(notes.map(n => n.text).join(' '), /Ohne Platz nach Gamma: Konfession\. Diese Karte zählt hier nicht mit – weder im Tipp noch in der Rangliste\./);
  const rows = guessRows(reversed, r, 'weighted', 'gamma');
  assert.equal(rows.find(x => x.id === 'konf')!.place, null);
  assert.equal(rows.find(x => x.id === 'konf')!.tip, null);
  assert.equal(rows.find(x => x.id === 'konf')!.shift, null);
  assert.deepEqual(rows.filter(x => x.place !== null).map(x => x.tip), [...Array(12)].map((_, i) => i + 1));
  // Ohne Kartenausfall (V) gibt es keinen Hinweis; die Tipp-Plätze sind die Plätze der Liste.
  assert.equal(reducedNote(guessRows(reversed, r, 'weighted', 'V'), 'weighted', 'V'), null);
  assert.deepEqual(guessRows(reversed, r, 'weighted', 'V').map(x => x.tip), [...Array(13)].map((_, i) => i + 1));
  assert.match(reducedNote(rows, 'weighted', 'gamma')!, /^„Konfession“ \(keine Reihenfolge der Kategorien, darum nur mit Cramér-V\) hat nach Gamma \(gewichtet\) keinen Platz\. Darum zählen hier beide Seiten nur 12 Karten/);
  // West und Ost: „West oder Ost“ fällt heraus, bei Gamma zusätzlich Konfession.
  const west = guessRows(reversed, r, 'west', 'gamma');
  assert.deepEqual(west.filter(x => x.place === null).map(x => x.id).sort(), ['eastwest', 'konf']);
  assert.match(reducedNote(west, 'west', 'gamma')!, /„Wohnort West oder Ost“ \(innerhalb eines Landesteils nicht berechenbar\) haben nach Gamma \(nur West\) keinen Platz\. Darum zählen hier beide Seiten nur 11 Karten/);
  assert.equal(COMPARE_BY.rho, 'tau');
  assert.deepEqual(compareRankGuess([], r, 'weighted', 'V'), []);
});
