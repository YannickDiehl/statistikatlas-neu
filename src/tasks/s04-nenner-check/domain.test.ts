import test from 'node:test';
import assert from 'node:assert/strict';
import { fakeSav, fixtureSav } from '../../sandbox/testData';
import {
  allTables, BASE_AREAS, baseOf, checkExtra, checkP1, checkP2, checkP3, checkSentence, CLAIM_AREA, compareBase, denominators, factSentence, fourfold,
  initialS04, lookup, parseS04, PARTY, percent, plenumLines, prepare, questions, rCodeFor, readings, shortcut, stairs, statusS04,
} from './domain';

// Handgebaute Vierfeldertafel (pe01 × pv01): misstraut (1–2) & nicht wählen (91) = 5, misstraut & wählen = 10,
// übrige & nicht wählen = 1, übrige & wählen = 9; dazu 2× „weiß nicht“ und 3× „nicht wahlberechtigt“.
const rows: [pe01: number, pv01: number, pe05: number, times: number, weight?: number][] = [
  [1, 91, 2, 2, 2], [1, 91, 4, 1, 2], [2, 91, 3, 2], [3, 91, 4, 1], [4, 1, 1, 4], [1, 1, 3, 6], [2, 2, 2, 1], [2, 2, 3, 3], [3, 2, 3, 5],
  [2, -8, 1, 2], [4, -50, 1, 3],
];
const col = (k: 0 | 1 | 2 | 4) => rows.flatMap(r => Array(r[3]).fill(k === 4 ? r[4] ?? 1 : r[k]));
const sav = fakeSav({
  pe01: { values: col(0), missingFrom: -1 }, pv01: { values: col(1), missingFrom: -1 }, pe05: { values: col(2), missingFrom: -1 },
  pa35: { values: col(0).map(() => -11), missingFrom: -1 }, wghtpew: { values: col(4) },
});
const joint = prepare(sav), tables = allTables(joint);

test('counts the fourfold table and its three bases', () => {
  assert.equal(tables.length, 1856);
  const t = fourfold(joint, PARTY);
  assert.deepEqual(t.n, { a: 5, b: 10, c: 1, d: 9 });
  assert.equal(percent(t, 'a', 'col'), 500 / 6);
  assert.equal(percent(t, 'a', 'row'), 100 / 3);
  assert.equal(percent(t, 'c', 'row'), 10);
  assert.equal(percent(t, 'a', 'all'), 20);
  assert.deepEqual(denominators(joint), { cell: 5, nonvoters: 6, distrusting: 15, all: 25 });
  assert.deepEqual(fourfold(joint, { ...PARTY, nonvote: [-8] }).n, { a: 7, b: 10, c: 1, d: 9 });
  assert.deepEqual(fourfold(joint, { ...PARTY, else0: true }).n, { a: 5, b: 12, c: 1, d: 12 });
});

test('names who the 100 % are and recognises the press-release way', () => {
  assert.match(checkP1(tables, joint, '83,3', '5')[0].text, /unter den 6, die nicht wählen wollen\. Genau so hat der Parteivorstand gerechnet/);
  assert.match(checkP1(tables, joint, '83', '')[0].text, /Trag noch die Anzahl der Befragten/);
  assert.match(checkP1(tables, joint, '88,9', '8')[0].text, /gewichtet.*Gewichtet ist das vertretbar/);
  assert.match(checkP1(tables, joint, '33,3', '5')[0].text, /unter den 15 Befragten mit pe01 1–2.*Die Prozentbasis ist vertauscht/);
  assert.match(checkP1(tables, joint, '20,0', '5')[0].text, /an allen 25 Befragten.*alle Befragten 100 %/);
  assert.match(checkP1(tables, joint, '16,7', '1')[0].text, /pe01 3–4.*andere Zelle/);
  assert.match(checkP1(tables, joint, '28,6', '2')[0].text, /pe05 1–2.*Lies pe05 noch einmal/);
  assert.match(checkP1(tables, joint, '66,7', '4')[0].text, /Vertretbar anders gerechnet: pe05 3–4 · pv01 91\./);
  assert.match(checkP1(tables, joint, '29,4', '5')[0].text, /Mit else=0 zählen bei dir auch 3 Nicht-Wahlberechtigte/);
  assert.match(checkP1(tables, joint, '41,7', '99')[0].text, /finde ich unter den gut 1\.800/);
  assert.deepEqual(checkP1(tables, joint, '', ''), []);
});

test('the right percentage with the wrong count points to the cell count without giving it away', () => {
  // 83,3 % stimmt; in der Zelle stehen 5 Befragte. Falsche Häufigkeiten, die in dieser winzigen Tafel nicht zufällig zu einem anderen Weg passen
  // (die Spaltensumme 6 tut das hier zufällig: pe01 3), darunter die Zeilensumme 15 und alle 25.
  for (const wrong of ['7', '99', '15', '25']) {
    const [note] = checkP1(tables, joint, '83,3', wrong);
    assert.equal(note.tone, 'hint');
    assert.match(note.text, /Der Prozentwert stimmt.*Parteivorstand.*Zahl der Befragten in genau dieser Zelle.*nicht die Summe der Spalte/);
    assert.doesNotMatch(note.text, /\d/);
  }
  // Mit richtiger Häufigkeit bleibt es bei der Bestätigung, ohne Häufigkeit bei der Bitte um sie.
  assert.match(checkP1(tables, joint, '83,3', '5')[0].text, /Genau so hat der Parteivorstand gerechnet/);
  assert.match(checkP1(tables, joint, '83,3', '')[0].text, /Trag noch die Anzahl der Befragten/);
  // Ein falscher Prozentwert bleibt bei der Checkliste, auch mit falscher Häufigkeit.
  assert.match(checkP1(tables, joint, '12,3', '7')[0].text, /finde ich unter den gut 1\.800/);
});

test('finds the way behind a number, merging mirror twins and silent else=0 variants', () => {
  const hits = lookup(tables, 500 / 6, 5);
  assert.equal(shortcut(hits[0].table.way), 'pe01 1–2 · pv01 91');
  // In so kleinen Daten passt dieselbe Zahl zufällig auch zu pe01 3 (Wählende) – aber nie doppelt über wirkungslose Entscheidungen.
  assert.deepEqual(hits.map(h => `${shortcut(h.table.way)} ${h.cell} ${h.base}`), ['pe01 1–2 · pv01 91 a col', 'pe01 3 · pv01 91 b row', 'pe01 1–2, 4 · pv01 91 a col']);
  assert.equal(shortcut({ item: 'pe05', distrust: [3, 4], nonvote: [-8, -7], else0: false, weighted: true }), 'pe05 3–4 · pv01 91, -8, -7 · gewichtet');
});

test('checks three denominators and the own reading', () => {
  assert.deepEqual(checkP2(tables, joint, { rowDistrust: '33,3', rowOthers: '10', total: '20' }).map(n => n.tone), ['ok', 'ok', 'ok']);
  assert.match(checkP2(tables, joint, { rowDistrust: '83,3', rowOthers: '', total: '' })[0].text, /unter den 6.*andere Prozentbasis/);
  const p3 = { item: 'pe01' as const, distrust: [1, 2], nonvote: [-8], weighted: false, rowDistrust: '41,2', rowOthers: '10,0', n: '7' };
  assert.match(checkP3(tables, joint, p3).at(-1)!.text, /Stimmt für deine Lesart pe01 1–2 · pv01 91, -8/);
  assert.match(checkP3(tables, joint, { ...p3, rowDistrust: '33,3', n: '5' }).at(-1)!.text, /untag_na\(\) vergessen/);
  assert.match(checkP3(tables, joint, { ...p3, rowOthers: '20,0' }).at(-1)!.text, /Der Wert der Übrigen passt nicht/);
  assert.match(checkP3(tables, joint, { ...p3, n: '8' }).at(-1)!.text, /die Anzahl nicht/);
  assert.match(checkP3(tables, joint, { ...p3, item: 'pe05', distrust: [3, 4], nonvote: [], rowDistrust: '28,6', rowOthers: '', n: '2' }).at(-1)!.text, /Die Richtung ist gekippt/);
  assert.doesNotMatch(checkP3(tables, joint, { ...p3, rowOthers: '' }).at(-1)!.text, /Übrigen/);
  assert.match(checkP3(tables, joint, { ...p3, nonvote: [] }).at(0)!.text, /genau der Weg des Parteivorstands/);
  assert.match(checkP3(tables, joint, { ...p3, item: 'pe05', distrust: [1, 2] })[0].text, /Misst deine Gruppe wirklich Misstrauen/);
  assert.equal(readings(joint).length, 18);
});

test('asks at most three questions and builds the plenum card', () => {
  assert.deepEqual(questions(joint, { ...initialS04(), verdict: 1 }).map(x => x.id), ['intention']);
  // „stimmt“: Die Gegenfrage trennt Zahl und Behauptung, ohne eine Zahl zu nennen.
  const claim = questions(joint, { ...initialS04(), verdict: 0 });
  assert.deepEqual(claim.map(x => x.id), ['claim', 'intention']);
  assert.doesNotMatch(claim[0].text, /\d+[,.]\d/);
  const s = { ...initialS04(), guess: 'Nichtwähler', verdict: 2, reason: 'weil Misstrauen abhält', sentence: 'Von denen …', p1: { pct: '83,3', n: '5' },
    p3: { item: 'pe01' as const, distrust: [1, 2], nonvote: [], weighted: false, rowDistrust: '33,3', rowOthers: '10', n: '5' } };
  const q = questions(joint, s);
  assert.deepEqual(q.map(x => x.id), ['causal', 'dk', 'size']);
  assert.match(q[1].text, /41,2 % der Misstrauenden nicht wählen statt 33,3 %/);
  assert.deepEqual(plenumLines(s)[1], ['Meine Lesart', 'pe01 1–2 · pv01 91']);
  assert.deepEqual(plenumLines(s)[2], ['Misstrauende · Übrige (nicht wählen)', '33,3 % · 10,0 %']);
  assert.equal(plenumLines(s)[3][1], 'irreführend');
});

test('writes R code for the own reading in pipe style: untag_na() in the chain, mutate() with rec() and named variables', () => {
  assert.equal(rCodeFor({ item: 'pe05', distrust: [3, 4], nonvote: [-8], else0: false, weighted: false }), [
    '# Deine Lesart: pe05 3–4 · pv01 91, -8',
    '# pe05 misst Vertrauen: Ablehnung zählt als Misstrauen.',
    '# untag_na() holt die fehlenden Werte als Codes zurück, dann zählen sie als Nichtwahl.',
    'allbus <- allbus %>%',
    '  untag_na(pv01) %>%',
    '  mutate(',
    '    misstrauen_lesart = rec(pe05, rules = "3:4=1 [misstraut]; 1:2=0 [misstraut nicht]; else=NA"),',
    '    nichtwahl_lesart  = rec(pv01, rules = "91=1 [würde nicht wählen]; -8=1; 1:90=0 [würde wählen]; else=NA")',
    '  )',
    '',
    '# Zeilenprozente: Die Misstrauenden sind 100 %',
    'allbus %>%',
    '  crosstab(misstrauen_lesart, nichtwahl_lesart, percentages = "row")',
  ].join('\n'));
  const pa35 = rCodeFor({ item: 'pa35', distrust: [1, 3], nonvote: [], else0: false, weighted: true });
  assert.match(pa35, /allbus <- allbus %>%\n  mutate\(\n    misstrauen_lesart = rec\(pa35, rules = "1=1 \[misstraut\]; 3=1; 2=0 \[misstraut nicht\]; 4:5=0; else=NA"\),/);
  assert.match(pa35, /nichtwahl_lesart  = rec\(pv01, rules = "91=1 \[würde nicht wählen\]; 1:90=0 \[würde wählen\]; else=NA"\)[\s\S]*allbus %>%\n  crosstab\(misstrauen_lesart, nichtwahl_lesart, percentages = "row", weights = wghtpew\)/);
  assert.doesNotMatch(pa35, /untag_na|suffix|\|>|rec\(allbus|crosstab\(allbus|summary/);
});

test('counts the distrust stairs and checks the top step', () => {
  const real = fixtureSav(), steps = stairs(real);
  assert.deepEqual(steps.map(s => s.step), [0, 1, 2, 3]);
  assert.deepEqual(steps.map(s => s.n), [1, 3, 2, 3]);
  assert.equal(steps[3].share.toFixed(1), '33.3');
  const top = steps[3];
  assert.match(checkExtra(real, top.share.toFixed(1).replace('.', ','))[0].text, /Stimmt/);
});

test('restores state defensively and reports status', () => {
  assert.deepEqual(parseS04(null), initialS04());
  const s = parseS04({ verdict: 9, p3: { item: 'pa35', distrust: [1, 9, 'x'], nonvote: [-8, -50] }, p1: { pct: 87 } });
  assert.equal(s.verdict, null);
  assert.deepEqual(s.p3.distrust, [1]);
  assert.deepEqual(s.p3.nonvote, [-8]);
  assert.equal(s.p1.pct, '');
  assert.equal(statusS04(initialS04()), 'open');
  assert.equal(statusS04({ ...initialS04(), guess: 'x' }), 'running');
  assert.equal(statusS04({ ...initialS04(), p1: { pct: '87', n: '127' }, p2: { rowDistrust: '6,5', rowOthers: '', total: '' },
    p3: { ...initialS04().p3, rowDistrust: '21,5' }, verdict: 2, sentence: 'Satz' }), 'done');
});

test('compares the clicked base with the base of the press release', () => {
  assert.equal(CLAIM_AREA, 'col-nonvote');
  assert.equal(baseOf(CLAIM_AREA), 'col');
  assert.equal(compareBase('col-nonvote')[0].tone, 'ok');
  assert.match(compareBase('col-nonvote')[0].text, /Richtig getippt.*Spaltenprozente.*alle, die nicht wählen wollen/);
  assert.match(compareBase('row-distrust')[0].text, /Dein Tipp: alle Misstrauenden sind 100 % \(Zeilenprozente\).*Von den Misstrauenden wollen 87 % nicht wählen/);
  assert.match(compareBase('col-vote')[0].text, /Spaltenprozente stimmen – aber.*anderen Spalte/);
  assert.match(compareBase('total')[0].text, /Gesamtprozente.*nicht über alle Befragten/);
  for (const a of BASE_AREAS.filter(a => a !== CLAIM_AREA)) assert.equal(compareBase(a)[0].tone, 'hint');
  const s = { ...initialS04(), baseGuess: 'row-distrust' as const };
  assert.equal(plenumLines(s)[0][1], '', 'ein nicht abgegebener Tipp steht nicht auf der Karte');
  assert.equal(plenumLines({ ...s, baseLocked: true })[0][1], 'alle Misstrauenden (Zeilenprozente)');
  assert.equal(plenumLines({ ...initialS04(), guess: 'Nichtwähler' })[0][1], 'Nichtwähler', 'alter Freitext-Tipp bleibt lesbar');
});

test('checks the gap sentence against the chosen reading without giving numbers away', () => {
  const base = { ...initialS04(), p3: { item: 'pe01' as const, distrust: [1, 2], nonvote: [-8], weighted: false, rowDistrust: '', rowOthers: '', n: '' } };
  const fact = (distrust: string, others: string, reading: 'party' | 'own' = 'party') => ({ ...base, fact: { reading, distrust, others } });
  assert.deepEqual(checkSentence(joint, fact('', '')), []);
  // Parteivorstand: 5 von 15 Misstrauenden (33,3 %), 1 von 10 Übrigen (10,0 %); eigene Lesart mit „weiß nicht“: 7 von 17 (41,2 %).
  const ok = checkSentence(joint, fact('33,3', '10'));
  assert.equal(ok[0].tone, 'ok');
  assert.match(ok[0].text, /Stimmt für die Lesart des Parteivorstands \(pe01 1–2 · pv01 91\): .*33,3 %.*10,0 %.*Zeilenprozente/);
  assert.equal(checkSentence(joint, fact('41,2', '10,0', 'own'))[0].tone, 'ok');
  assert.match(checkSentence(joint, fact('41,2', '10,0'))[0].text, /passen zur eigenen Lesart \(Prüfauftrag 3\)\. Stell oben die Lesart um/);
  assert.match(checkSentence(joint, fact('33,3', '10'), )[0].text, /Zeilenprozente/);
  assert.match(checkSentence(joint, fact('10', '33,3'))[0].text, /vertauscht/);
  assert.match(checkSentence(joint, fact('83,3', '10'))[0].text, /Spaltenprozent.*Nichtwählenden/);
  assert.match(checkSentence(joint, fact('66,7', ''))[0].text, /wählen wollen/);
  assert.match(checkSentence(joint, fact('33,3', ''))[0].text, /Die erste Zahl stimmt\. Trag noch/);
  const wrong = checkSentence(joint, fact('12,3', '45,6'));
  assert.deepEqual(wrong.map(n => n.tone), ['warn', 'warn']);
  for (const n of wrong) assert.doesNotMatch(n.text.replace(/pe01 1–2 · pv01 91/, ''), /\d/);
  assert.match(checkSentence(joint, { ...fact('33,3', '10', 'own'), p3: { ...base.p3, distrust: [] } })[0].text, /Leg in Prüfauftrag 3 zuerst fest/);
});

test('builds the fact sentence from the gaps and keeps old free-text states working', () => {
  const s = { ...initialS04(), fact: { reading: 'party' as const, distrust: '33.3', others: '10' } };
  assert.equal(factSentence(s), 'Von denen, die misstrauen, wollen 33,3 % nicht wählen, von den übrigen 10,0 % (Lesart pe01 1–2 · pv01 91).');
  assert.equal(plenumLines(s)[4][1], factSentence(s));
  assert.equal(factSentence({ ...s, fact: { ...s.fact, others: '' }, sentence: 'Alter Satz' }), 'Alter Satz');
  // Ältere Speicherstände: freier Satz → Zahlen wandern in die Lücken; ohne zwei Prozentzahlen bleiben die Lücken leer.
  const old = parseS04({ sentence: 'Von denen, die misstrauen, wollen 6,5 % nicht wählen, von den übrigen 2,3 %.', guess: 'Nichtwähler' });
  assert.deepEqual(old.fact, { reading: 'party', distrust: '6,5', others: '2,3' });
  assert.equal(old.guess, 'Nichtwähler');
  assert.deepEqual(parseS04({ sentence: 'Misstrauen ist verbreitet.' }).fact, { reading: 'party', distrust: '', others: '' });
  assert.deepEqual(parseS04({ sentence: '6,5 % und 2,3 %', fact: { reading: 'own', distrust: '1', others: 7 } }).fact, { reading: 'own', distrust: '1', others: '' });
  // Tipp: nur gültige Bereiche, gesperrt nur mit Tipp.
  assert.deepEqual([parseS04({ baseGuess: 'col-nonvote', baseLocked: true }).baseGuess, parseS04({ baseGuess: 'col-nonvote', baseLocked: true }).baseLocked], ['col-nonvote', true]);
  assert.deepEqual([parseS04({ baseGuess: 'diagonal', baseLocked: true }).baseGuess, parseS04({ baseGuess: 'diagonal', baseLocked: true }).baseLocked], [null, false]);
  // Status: ein Tipp allein heißt „läuft“; „fertig“ braucht beide Lücken (oder einen alten Satz).
  assert.equal(statusS04({ ...initialS04(), baseGuess: 'total' }), 'running');
  const almost = { ...initialS04(), p1: { pct: '87', n: '127' }, p2: { rowDistrust: '6,5', rowOthers: '', total: '' }, p3: { ...initialS04().p3, rowDistrust: '21,5' }, verdict: 2 };
  assert.equal(statusS04({ ...almost, fact: { reading: 'party', distrust: '6,5', others: '' } }), 'running');
  assert.equal(statusS04({ ...almost, fact: { reading: 'party', distrust: '6,5', others: '2,3' } }), 'done');
});
