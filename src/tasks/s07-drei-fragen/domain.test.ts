import test from 'node:test';
import assert from 'node:assert/strict';
import { fakeSav, fixtureSav } from '../../sandbox/testData';
import { DUTY_REASONS, FR_IDS, hints, ITEMS, R_BATTERY, R_SETUP, TOOLBOX_SCRIPT, type FrId, type ItemId } from './content';
import { reliability } from '../kit/reliability';
import { pearson } from '../kit/stats';
import { rStyleProblems } from '../kit/rStyle';
import {
  ALPHA_NOT_FOUND, alphaVariants, BATTERY_NOT_FOUND, batteryVariants, checkNumber, checkWeakest, chooseFinal, detailOf, dutyFor, dutyInstruction, dutyMissing,
  facetNote, flipCode, frChanged, frCode, frCorrelations, frReliability, frStart, initialS07, prepareFr, shortR, shownCorrelation, toggleFrFlip, toggleFrOn, keptOf, keyOf, kuer, KUER_NOT_FOUND, kuerAllVariants, kuerMeanVariants, kuerReveal, labelOf, landscapeNotes, pa29Note, parseS07,
  pctText, plenumLines, prepare, R_NOT_FOUND, recognised, revealReady, rKuer, rProposal, rScript, rVariants, scaffoldKuer, scaffoldProposal, statusS07,
  toggleStrike, TRIPLES, weakestItem, compareWeakGuess, lockWeakGuess, pickWeakGuess, unlockWeakGuess, weakFieldsOpen, weakGuessRevealed, type S07State,
} from './domain';

const p = prepare(fixtureSav());
const t = p.byKey['pa31+pa32+pa33'], d = detailOf(p, t);
/** Vier Nachkommastellen: enge Toleranz, damit sich Varianten der kleinen Testdatei nicht zufällig überlappen. */
const f4 = (x: number) => x.toFixed(4).replace('.', ',').replace('-', '−');
const one = (notes: { tone: string; text: string }[]) => { assert.equal(notes.length, 1, JSON.stringify(notes)); return notes[0]; };
const alpha = (input: string) => one(checkNumber(alphaVariants(p, t), input, ALPHA_NOT_FOUND));
const r = (input: string) => one(checkNumber(rVariants(p, t), input, R_NOT_FOUND));

test('prepare(): 35 short scales with ranks, values 1–5 only, weighted agreement per item', () => {
  assert.equal(TRIPLES.length, 35);
  assert.equal(p.triples.length, 35);
  assert.deepEqual(p.triples.map(x => x.rankAlpha).sort((a, b) => a - b), Array.from({ length: 35 }, (_, i) => i + 1));
  assert.deepEqual(p.triples.map(x => x.rankR).sort((a, b) => a - b), Array.from({ length: 35 }, (_, i) => i + 1));
  assert.equal(p.triples[0].key, 'pa29+pa30+pa31');
  assert.deepEqual(t.rest, ['pa29', 'pa30', 'pa34', 'pa35']);
  const col = (v: number[]) => ({ values: v, missingFrom: -1 });
  const sav = fakeSav({
    pa29: col([1, 2, 3, -11, -9, 5]), pa30: col([1, 1, 2, -11, 3, 4]), pa31: col([2, 1, 3, -11, 3, 5]), pa32: col([1, 2, 2, -11, 4, 5]),
    pa33: col([2, 2, 3, -11, 4, 4]), pa34: col([1, 3, 3, -11, 5, 4]), pa35: col([2, 2, 1, -11, 4, 5]), wghtpew: { values: [1, 1, 2, 1, 1, 0.5] },
  });
  const q = prepare(sav);
  assert.deepEqual([...q.x.pa29], [1, 2, 3, NaN, NaN, 5]);
  // pa29: Zustimmung (1–2) bei Gewicht 1 + 1 von 1 + 1 + 2 + 0,5 gültigem Gewicht
  assert.equal(q.agree.pa29, 2 / 4.5);
  assert.equal(q.full.n, 4);
});

test('the value detector names every alpha variant and accepts only alpha, standardised, weighted and listwise-7 alpha', () => {
  assert.equal(alpha(f4(t.alpha)).tone, 'ok');
  assert.match(alpha(f4(t.alpha)).text, /^Stimmt: Die Stimmigkeit deiner drei Items ist α = 0,599 \(n = 36\)\./);
  assert.match(alpha(f4(t.omega)).text, /McDonalds ω/);
  assert.equal(recognised(alphaVariants(p, t), f4(t.omega)), false);
  for (const [value, re] of [[t.alphaStd, /standardisierte α .* angenommen/], [d.alphaW, /gewichtete α .* angenommen/], [d.alphaAll7, /allen sieben Antworten .* angenommen/]] as const) {
    assert.equal(alpha(f4(value)).tone, 'hint');
    assert.match(alpha(f4(value)).text, re);
    assert.equal(recognised(alphaVariants(p, t), f4(value)), true);
  }
  assert.match(alpha(f4(p.full.alpha)).text, /α aller sieben Items/);
  assert.match(alpha(f4(d.alphaRest)).text, /vier gestrichenen Items/);
  assert.match(alpha(f4(p.full.items[0].alphaIfDeleted)).text, /„Alpha if Deleted“ für pa29/);
  assert.match(alpha(f4(t.r)).text, /Stellvertreter-Wert r .* Stimmigkeit α/);
  const other = p.byKey['pa30+pa31+pa35'];
  assert.match(alpha(f4(other.alpha)).text, /Kurzskala pa30 \+ pa31 \+ pa35 .* Behalten hast du pa31 \+ pa32 \+ pa33/);
  for (const wrong of [p.full.alpha, d.alphaRest, t.r, other.alpha]) assert.equal(recognised(alphaVariants(p, t), f4(wrong)), false);
  assert.equal(alpha('0,9999').text, ALPHA_NOT_FOUND);
  assert.match(alpha('0,6').text, /drei Nachkommastellen/);
  assert.match(alpha('abc').text, /nicht als Zahl/);
  assert.deepEqual(checkNumber(alphaVariants(p, t), '  ', ALPHA_NOT_FOUND), []);
  // R-Schreibweise mit Punkt und zwei Stellen (halbe Einheit: ±0,005) werden ebenso gelesen
  assert.equal(alpha(`.${f4(t.alpha).slice(2)}`).tone, 'ok');
  assert.equal(alpha(t.alpha.toFixed(2)).tone, 'ok');
  assert.equal(recognised(alphaVariants(p, t), '0,7'), false);
});

test('omega and standardised alpha: a combined answer when both round alike, no omega at a Heywood boundary', () => {
  // Kurzskala mit ω und standardisiertem α nah beieinander (Werte gesetzt, Rest aus der Testdatei)
  const near = { ...t, omega: t.alpha + 0.0103, alphaStd: t.alpha + 0.0101 };
  const both = one(checkNumber(alphaVariants(p, near), near.alphaStd.toFixed(3).replace('.', ','), ALPHA_NOT_FOUND));
  assert.match(both.text, /^Das ist McDonalds ω oder das standardisierte α – beide liegen hier bei/);
  assert.equal(recognised(alphaVariants(p, near), near.alphaStd.toFixed(3).replace('.', ',')), true);
  assert.match(one(checkNumber(alphaVariants(p, near), f4(near.omega), ALPHA_NOT_FOUND)).text, /^Das ist McDonalds ω \(/);
  assert.match(one(checkNumber(alphaVariants(p, near), f4(near.alphaStd), ALPHA_NOT_FOUND)).text, /^Das ist das standardisierte α/);
  // Heywood-Fall der Testdatei: pa29 + pa31 + pa32 (factanal setzt ψ von pa31 auf 0,005) – ω wird nicht genannt
  const hey = p.byKey['pa29+pa31+pa32'];
  assert.equal(hey.omegaBoundary, true);
  assert.equal(t.omegaBoundary, false);
  assert.doesNotMatch(checkNumber(alphaVariants(p, hey), f4(hey.omega), ALPHA_NOT_FOUND).map(n => n.text).join(' '), /McDonalds ω/);
  assert.ok(alphaVariants(p, t).some(v => v.text.startsWith('Das ist McDonalds ω (')));
});

test('the value detector names every r variant: min_valid, weight, overlap with the total index, alpha', () => {
  assert.equal(r(f4(t.r)).tone, 'ok');
  assert.match(r(f4(t.r)).text, /^Stimmt: Der Stellvertreter-Wert deiner Kurzskala ist r = 0,685 \(n = 32\)\./);
  assert.match(r(f4(d.rAny[0])).text, /Angenommen .* wer bekommt überhaupt einen Skalenwert\?/);
  assert.equal(recognised(rVariants(p, t), f4(d.rAny[0])), true);
  assert.match(r(f4(d.rW)).text, /mit Gewicht .* angenommen/);
  assert.match(r(f4(d.rLong[0])).text, /Gesamtindex aller sieben .* an sich selbst/);
  assert.equal(recognised(rVariants(p, t), f4(d.rLong[0])), false);
  assert.match(r(f4(t.alpha)).text, /Stimmigkeit α .* pearson_cor\(\)/);
  assert.match(r(f4(p.byKey['pa29+pa30+pa33'].r)).text, /Stellvertreter-Wert der Kurzskala pa29 \+ pa30 \+ pa33/);
  assert.equal(r('0,0001').text, R_NOT_FOUND);
  // Zwei Stellen reichen für das Ziel; eine Verwechslung (hier ohne min_valid) wird erst bei drei Stellen benannt und nie geraten angenommen.
  for (const v of [d.rAny[0], d.rW, d.rLong[0], t.alpha]) {
    const typed = v.toFixed(2).replace('.', ',');
    const note = r(typed);
    if (Math.abs(Number(v.toFixed(2)) - t.r) <= 0.005) assert.equal(note.tone, 'ok');
    else { assert.match(note.text, /drei Nachkommastellen/); assert.equal(recognised(rVariants(p, t), typed), false); }
  }
});

test('the battery check accepts the seven-item alpha and names omega and alpha if item deleted', () => {
  const check = (input: string) => one(checkNumber(batteryVariants(p), input, BATTERY_NOT_FOUND));
  const ok = check(f4(p.full.alpha));
  assert.equal(ok.tone, 'ok');
  assert.match(ok.text, /α = 0,722 \(n = 32\)\. Daneben zeigt R McDonalds ω = 0,745/);
  assert.match(check(f4(p.full.alphaStd)).text, /standardisierte α .* angenommen/);
  assert.match(check(f4(p.full.omega)).text, /McDonalds ω .* Cronbachs α/);
  assert.match(check(f4(p.full.omegaStd)).text, /standardisierte ω/);
  assert.match(check(f4(p.full.items[3].alphaIfDeleted)).text, /„Alpha if Deleted“ für pa32/);
  assert.match(check(f4(t.alpha)).text, /Kurzskala pa31 \+ pa32 \+ pa33/);
  assert.equal(check('0,0001').text, BATTERY_NOT_FOUND);
});

test('the weakest item: wrong item without numbers, then the value from corrected_r', () => {
  assert.equal(weakestItem(p), 'pa29');
  assert.deepEqual(checkWeakest(p, '', '0,1'), []);
  const wrong = one(checkWeakest(p, 'pa31', ''));
  assert.match(wrong.text, /pa31 ist nicht das Item mit der schwächsten Trennschärfe/);
  assert.doesNotMatch(wrong.text, /\d,\d/);
  assert.match(one(checkWeakest(p, 'pa29', '')).text, /Richtiges Item/);
  const ok = one(checkWeakest(p, 'pa29', f4(p.full.items[0].corrected)));
  assert.equal(ok.tone, 'ok');
  assert.match(ok.text, /Trennschärfe 0,125\)\. Ohne pa29 läge α bei 0,753 – höher als mit ihm\. Ausgerechnet das Item mit der meisten Zustimmung/);
  assert.match(one(checkWeakest(p, 'pa29', f4(p.full.items[0].alphaIfDeleted))).text, /„Alpha if Deleted“: α ohne dieses Item/);
  assert.match(one(checkWeakest(p, 'pa29', f4(p.full.items[2].corrected))).text, /Trennschärfe von pa31, nicht von pa29/);
  assert.match(one(checkWeakest(p, 'pa29', '0,9999')).text, /Corrected Item-Total/);
});

test('content notes name missing sides; pa29 gets the validity note', () => {
  assert.deepEqual(facetNote(['pa29', 'pa30', 'pa32']), { tone: 'ok', text: 'Jede der drei Seiten ist mit einem Item vertreten.' });
  assert.equal(facetNote(['pa31', 'pa32', 'pa35']).text, 'Aus „Volkssouveränität“ ist kein Item mehr dabei.');
  assert.equal(facetNote(['pa30', 'pa31', 'pa35']).text, 'Aus „Volkssouveränität“ und „Einheit des Volkes“ ist kein Item mehr dabei.');
  assert.deepEqual(pa29Note(p, ['pa31', 'pa32', 'pa33']), []);
  assert.match(pa29Note(p, ['pa29', 'pa31', 'pa32'])[0].text, /pa29 trifft den Kern des Begriffs\. Aber \d+ % stimmen diesem Item zu/);
});

test('landscape notes come from the data: champions, their proxy ranks, alpha ≥ .70 and the pa29 caveat', () => {
  const best = p.triples.find(x => x.rankAlpha === 1)!;
  const notes = landscapeNotes(p, [['pa31', 'pa32', 'pa33'], ['pa30', 'pa31', 'pa32']], false);
  assert.equal(notes[0], `Die stimmigste Kurzskala ist ${labelOf(best.items)} (α = ${best.alpha.toFixed(3).replace('.', ',')}). Als Stellvertreter steht sie auf Platz ${best.rankR} von 35.`);
  assert.match(notes[3], /hängen Stimmigkeit und Stellvertreter-Wert .* zusammen \(r = /);
  assert.match(notes[4], /von 35 Kurzskalen erreichen α ≥ 0,70/);
  assert.equal(notes.length, 5);
  const more = landscapeNotes(p, [['pa29', 'pa31', 'pa32']], true);
  assert.equal(more.length, 7);
  assert.match(more[5], /Alle sieben Items erreichen α = 0,722/);
  assert.match(more[6], /Steht pa29 in der Kurzskala/);
});

test('the duty question is a fixed draw per group number, with reasons that fit any question', () => {
  const items = Array.from({ length: 7 }, (_, g) => dutyFor(g + 1).item);
  assert.equal(new Set(items).size, 7);
  assert.equal(new Set(Array.from({ length: 7 }, (_, g) => dutyFor(g + 1).reason)).size, 7);
  // Keine Begründung behauptet etwas über die Länge oder Einzigartigkeit einer bestimmten Frage.
  for (const reason of DUTY_REASONS) assert.doesNotMatch(reason, /kürzest|längst|als einzige/, reason);
  const shortest = Object.values(ITEMS).sort((a, b) => a.statement.length - b.statement.length)[0].id;
  assert.equal(shortest, 'pa30');
  assert.deepEqual(dutyMissing('pa33', ['pa31', 'pa32', 'pa33'], true), []);
  assert.deepEqual(dutyMissing('pa33', [], true), []);
  assert.match(dutyMissing('pa33', ['pa30', 'pa31', 'pa32'], true)[0].text, /^Deine Pflichtfrage pa33 fehlt .* Wähle eine Kurzskala mit pa33/);
  assert.match(dutyMissing('pa33', ['pa30', 'pa31', 'pa32'], false)[0].text, /^Eure Pflichtfrage pa33 fehlt .* Wählt eine Kurzskala mit pa33/);
  assert.match(dutyInstruction('pa33', ['pa31', 'pa32', 'pa33'], true), /deiner Kurzskala .* deine Wahl enthält sie schon\. Begründe/);
  assert.match(dutyInstruction('pa33', ['pa30', 'pa31', 'pa32'], false), /eurer Kurzskala bleiben: Wählt oben neu/);
  assert.deepEqual(dutyFor(8), dutyFor(1));
  assert.deepEqual(dutyFor(3), dutyFor(3));
  assert.ok(dutyFor(2).reason.length > 10);
});

test('the bonus task: mean index vs combination index, weighted, with its variants', () => {
  const col = (v: number[]) => ({ values: v, missingFrom: -1 });
  const other = col([3, 3, 3, 3, 3, 3]);
  const sav = fakeSav({
    pa29: other, pa30: other, pa34: other, pa35: other,
    pa31: col([1, 1, 2, 4, 2, -9]), pa32: col([2, 3, 1, 5, 2, 1]), pa33: col([1, 2, 2, 3, 5, 1]),
    wghtpew: { values: [1, 2, 1, 1, 1, 1] },
  });
  const q = prepare(sav);
  const k = kuer(q, ['pa31', 'pa32', 'pa33']);
  // Kurzwerte 4/3, 2, 5/3, 4, 3, fehlt; alle drei 1–2: Fälle 1 und 3
  assert.equal(k.meanW, (100 * 4) / 6);
  assert.equal(k.allW, (100 * 2) / 6);
  assert.equal(k.meanU, (100 * 3) / 5);
  assert.equal(k.strictW, (100 * 2) / 6);
  assert.equal(k.meanAnyW, (100 * 5) / 7);
  assert.equal(k.allAnyW, (100 * 2) / 7);
  const fk = kuer(p, ['pa31', 'pa32', 'pa33']);
  const f1 = (x: number) => x.toFixed(2).replace('.', ',');
  const mean = (s: string) => one(checkNumber(kuerMeanVariants(fk), s, KUER_NOT_FOUND, 1));
  const all = (s: string) => one(checkNumber(kuerAllVariants(fk), s, KUER_NOT_FOUND, 1));
  assert.equal(mean(f1(fk.meanW)).tone, 'ok');
  assert.match(mean(f1(fk.meanU)).text, /ohne Gewicht/);
  assert.match(mean(f1(fk.allW)).text, /zweite Feld/);
  assert.match(mean(f1(fk.meanW - fk.allW)).text, /Randsumme/);
  if (Math.abs(fk.gapW - fk.meanW) > 0.1 && Math.abs(fk.gapW - fk.meanU) > 0.1 && Math.abs(fk.gapW - fk.allW) > 0.1) assert.match(mean(f1(fk.gapW)).text, /zwischen 2 und 3/);
  assert.equal(all(f1(fk.allW)).tone, 'ok');
  assert.match(all(f1(fk.meanW)).text, /erste Feld/);
  assert.equal(recognised(kuerMeanVariants(fk), f1(fk.meanU), 1), false);
  // aus crosstab() kopiert: „27.0%“ – Punkt und Prozentzeichen werden gelesen
  assert.equal(mean(`${fk.meanW.toFixed(1)}%`).tone, 'ok');
  assert.equal(all(`${fk.allW.toFixed(1)} %`).tone, 'ok');
  assert.match(mean('27').text, /einer Nachkommastelle|drei Nachkommastellen/);
  assert.equal(pctText('21.7%'), '21,7 %');
  assert.equal(pctText(' 14,2 '), '14,2 %');
  assert.equal(pctText('abc'), 'abc');
  assert.match(kuerReveal(fk), /gelten nur nach der Mittelwertlogik als populistisch/);
});

test('state: striking resets the proposal values, the final choice resets the bonus task, parse is defensive', () => {
  let s = initialS07();
  for (const id of ['pa35', 'pa29', 'pa34', 'pa30'] as ItemId[]) s = toggleStrike(s, 'a', id);
  assert.deepEqual(s.a.struck, ['pa29', 'pa30', 'pa34', 'pa35']);
  assert.deepEqual(keptOf(s.a.struck), ['pa31', 'pa32', 'pa33']);
  s = { ...s, a: { ...s.a, alpha: '0,599', r: '0,685', why: 'weil' } };
  assert.equal(toggleStrike(s, 'a', 'pa31'), s, 'a fifth question is ignored');
  const back = toggleStrike(s, 'a', 'pa35');
  assert.deepEqual([back.a.struck, back.a.alpha, back.a.r, back.a.why], [['pa29', 'pa30', 'pa34'], '', '', 'weil']);
  assert.equal(keptOf(back.a.struck), null);
  let f = chooseFinal({ ...s, kuer: { mean: '21,7', all: '14,2' } }, ['pa33', 'pa31', 'pa32']);
  assert.deepEqual(f.final, ['pa31', 'pa32', 'pa33']);
  assert.deepEqual(f.kuer, { mean: '', all: '' });
  f = { ...f, kuer: { mean: '21,7', all: '' } };
  assert.equal(chooseFinal(f, ['pa31', 'pa32', 'pa33']), f, 'the same choice keeps the bonus entries');
  assert.deepEqual(parseS07({ mode: 'x', a: { struck: ['pa29', 'pa29', 'zz', 3, 'pa30', 'pa31', 'pa32', 'pa33'] }, final: ['pa29', 'pa30'], duty: 99, facetLevel: 7, battery: { weakest: 'pa99' } }),
    { ...initialS07(), a: { struck: ['pa29', 'pa30', 'pa31', 'pa32'], why: '', alpha: '', r: '' } });
  assert.deepEqual(parseS07('garbage'), initialS07());
  assert.deepEqual(parseS07(null), initialS07());
  const round = { ...s, mode: 'pair' as const, facetLevel: 2 as const, final: ['pa29', 'pa30', 'pa31'] as ItemId[], duty: 3, sentence: 'x', reason: 'y', kuer: { mean: '1', all: '2' } };
  assert.deepEqual(parseS07(JSON.parse(JSON.stringify(round))), round);
});

test('status and reveal: both proposals entered and recognised open the landscape', () => {
  const b = p.byKey['pa29+pa30+pa33'];
  const full: S07State = {
    ...initialS07(),
    a: { struck: ['pa29', 'pa30', 'pa34', 'pa35'], why: '', alpha: f4(t.alpha), r: f4(t.r) },
    b: { struck: ['pa31', 'pa32', 'pa34', 'pa35'], why: '', alpha: f4(b.alpha), r: f4(b.r) },
  };
  assert.equal(statusS07(initialS07()), 'open');
  assert.equal(statusS07({ ...initialS07(), battery: { alpha: '0,7', weakest: '', value: '' } }), 'running');
  assert.equal(revealReady(p, full), true);
  assert.equal(revealReady(p, { ...full, b: { ...full.b, r: '0,999' } }), false);
  assert.equal(revealReady(p, { ...full, a: { ...full.a, alpha: f4(t.omega) } }), false, 'omega is named, not accepted');
  assert.equal(revealReady(p, { ...full, a: { ...full.a, r: f4(d.rAny[0]) } }), true, 'r without min_valid is accepted');
  assert.equal(revealReady(p, { ...full, a: { ...full.a, struck: ['pa29', 'pa30', 'pa34'] } }), false);
  assert.equal(statusS07(full), 'running');
  const done = { ...full, final: ['pa31', 'pa32', 'pa33'] as ItemId[], sentence: 'die Einheit des Volkes' };
  assert.equal(statusS07(done), 'done');
  const lines = plenumLines({ ...done, duty: 3, reason: 'Grund', kuer: { mean: '21.7%', all: '14,2' } }, t);
  assert.deepEqual(lines.map(l => l[0]), ['Kurzskala', 'Punkt im Kreuz (α | r)', 'Was sie nicht mehr misst', 'Begründung', 'Vorschläge', 'Pflichtfrage (Gruppe 3)', 'Kür']);
  assert.equal(lines[0][1], 'pa31 + pa32 + pa33');
  assert.equal(lines[1][1], '0,599 | 0,685');
  assert.equal(lines[4][1], 'Stimmigkeit: pa31 + pa32 + pa33 · Inhalt: pa29 + pa30 + pa33');
  assert.match(lines[5][1], new RegExp(`^${dutyFor(3).item} – `));
  assert.equal(lines[6][1], '21,7 % im Schnitt · 14,2 % durchgehend');
  assert.equal(plenumLines(done, null)[1][1], '', 'no point before the reveal');
});

test('R code: piped reliability, row_means with min_valid in one mutate, piped pearson_cor; scaffolds with gaps; %>% not |>, tidyverse before mariposa', () => {
  const code = rProposal(['pa33', 'pa31', 'pa32'], 'a');
  assert.match(code, /^allbus %>%\n  reliability\(pa31, pa32, pa33\)$/m);
  assert.match(code, /allbus <- allbus %>%\n  mutate\(\n    kurz_a = row_means\(pick\(pa31, pa32, pa33\), min_valid = 3\),\n    rest_a = row_means\(pick\(pa29, pa30, pa34, pa35\), min_valid = 4\)\n  \)/);
  assert.match(code, /^allbus %>%\n  pearson_cor\(kurz_a, rest_a\)$/m);
  assert.match(rProposal(['pa29', 'pa30', 'pa33'], 'b'), /kurz_b = row_means\(pick\(pa29, pa30, pa33\)/);
  assert.match(scaffoldProposal('b'), /___/);
  assert.match(scaffoldProposal('b'), /allbus <- allbus %>%\n  mutate\(\n    kurz_b = row_means\(pick\(___, ___, ___\), min_valid = ___\)/);
  assert.match(scaffoldKuer, /___/);
  const k = rKuer(['pa31', 'pa32', 'pa33']);
  assert.match(k, /allbus <- allbus %>%\n  mutate\(\n    kurz +=/);
  assert.match(k, /z1 += rec\(pa31, rules = "1:2=1 \[stimmt zu\]; 3:5=0 \[nicht\]"\)/);
  assert.match(k, /row_sums\(pick\(z1, z2, z3\), min_valid = 3\)/);
  assert.match(k, /^allbus %>%\n  crosstab\(im_schnitt, durchgehend, percentages = "total", weights = wghtpew\)$/m);
  assert.equal(k.match(/mutate\(/g)?.length, 1, 'all Kür variables in one mutate()');
  const all = rScript(['pa31', 'pa32', 'pa35'], ['pa31', 'pa32', 'pa33'], ['pa31', 'pa32', 'pa33']);
  assert.match(all, /^library\(tidyverse\)\nlibrary\(mariposa\)/);
  assert.match(all, /\ncodebook\(allbus\)\n/);
  assert.match(all, /allbus %>%\n  reliability\(pa29, pa30, pa31, pa32, pa33, pa34, pa35\) %>%\n  summary\(\)/);
  assert.match(all, /kurz_a[\s\S]*kurz_b[\s\S]*im_schnitt/);
  for (const text of [all, scaffoldKuer, scaffoldProposal('a'), hints.battery.scaffold!, TOOLBOX_SCRIPT]) {
    assert.doesNotMatch(text, /ifelse|%in%|\|>|library\(dplyr\)|codebook\(allbus, |suffix =/);
    // Jeder Aufruf mit Datensatz läuft über die Pipe: kein (allbus, …) außer codebook(allbus).
    assert.doesNotMatch(text.replace(/codebook\(allbus\)/g, ''), /\(allbus\b/);
  }
  assert.equal(keyOf(['pa33', 'pa29', 'pa31']), 'pa29+pa31+pa33');
});

test('weakest-item tip: pick, lock, reveal after the right item, stays fixed afterwards; parse and status', () => {
  let s = pickWeakGuess(initialS07(), 'pa34');
  assert.equal(s.weakGuess, 'pa34');
  assert.equal(pickWeakGuess(s, 'pa34').weakGuess, '');
  assert.equal(weakFieldsOpen(s), false);
  assert.equal(lockWeakGuess(initialS07()).weakGuessLocked, false);
  s = lockWeakGuess(s);
  assert.equal(s.weakGuessLocked, true);
  assert.equal(weakFieldsOpen(s), true);
  assert.equal(pickWeakGuess(s, 'pa30').weakGuess, 'pa34');
  assert.equal(weakGuessRevealed(p, s), false);
  assert.equal(unlockWeakGuess(p, s).weakGuessLocked, false);
  const revealed = { ...s, battery: { ...s.battery, weakest: weakestItem(p) } };
  assert.equal(weakGuessRevealed(p, revealed), true);
  assert.equal(unlockWeakGuess(p, revealed).weakGuessLocked, true);
  assert.equal(compareWeakGuess(p, weakestItem(p))[0].tone, 'ok');
  assert.match(compareWeakGuess(p, 'pa34')[0].text, /Dein Tipp pa34 hat eine Trennschärfe von \d,\d{3}\. Am schwächsten hängt pa29/);
  assert.equal(statusS07(pickWeakGuess(initialS07(), 'pa31')), 'running');
  assert.deepEqual(parseS07({ weakGuess: 'pa31', weakGuessLocked: true }), { ...initialS07(), weakGuess: 'pa31', weakGuessLocked: true });
  assert.deepEqual(parseS07({ weakGuess: 'pa99', weakGuessLocked: true }), initialS07());
  assert.equal(parseS07({ weakGuess: 'pa31', weakGuessLocked: 'ja' }).weakGuessLocked, false);
});

test('Schriftbild: every R code block of the session passes rStyleProblems (toolbox, hints, solutions, scripts for all 35 triples)', () => {
  const blocks: [string, string][] = [
    ['toolbox', TOOLBOX_SCRIPT],
    ['battery solution', `${R_SETUP}\n\n${R_BATTERY}`],
    ['battery scaffold', hints.battery.scaffold!],
    ['proposal scaffold a', scaffoldProposal('a')],
    ['proposal scaffold b', scaffoldProposal('b')],
    ['kuer scaffold', scaffoldKuer],
  ];
  for (const t of TRIPLES) {
    const k = keyOf(t);
    for (const tag of ['a', 'b'] as const) blocks.push([`proposal ${tag} ${k}`, `${R_SETUP}\n\n${rProposal(t, tag)}`]);
    blocks.push([`kuer ${k}`, `${R_SETUP}\n\n${rKuer(t)}`]);
    blocks.push([`script ${k}`, rScript(t, t, t)]);
  }
  blocks.push(['script without choices', rScript(null, null, null)]);
  for (const [name, code] of blocks) assert.deepEqual(rStyleProblems(code), [], name);
});

/* ---------- Einstieg: Heatmap der Rollenbild-Items ---------- */

/** Kleine Datei mit den acht Einstiegs-Items: fr03b, fr04b, fr09, fr10 laufen gegen die übrigen; −9 ist ein fehlender Wert. */
function frSav(n = 40) {
  const col = (f: (i: number) => number) => ({ values: Array.from({ length: n }, (_, i) => f(i)), missingFrom: -1 });
  const base = (i: number) => 1 + (i % 4), wobble = (i: number, k: number) => Math.min(4, Math.max(1, base(i) + ((i * k) % 3) - 1));
  return {
    fr07: col(i => wobble(i, 1)), fr08: col(i => (i === 3 ? -9 : wobble(i, 2))), fr03b: col(i => 5 - wobble(i, 5)), fr04b: col(i => 5 - wobble(i, 7)),
    fr05b: col(i => wobble(i, 4)), fr09: col(i => 5 - wobble(i, 8)), fr10: col(i => (i === 5 ? 7 : 5 - wobble(i, 10))), fr12: col(i => wobble(i, 11)),
  };
}

test('Einstieg: prepareFr keeps codes 1–4 only and gives null when an item is missing from the file', () => {
  assert.equal(prepareFr(fixtureSav()), null);
  const x = prepareFr(fakeSav(frSav()))!;
  assert.deepEqual(Object.keys(x), [...FR_IDS]);
  assert.ok(Number.isNaN(x.fr08[3]), 'fehlender Wert −9');
  assert.ok(Number.isNaN(x.fr10[5]), 'Code 7 liegt außerhalb der Skala');
  assert.ok([...x.fr07].every(v => v >= 1 && v <= 4));
  const { fr12: _, ...without } = frSav();
  assert.equal(prepareFr(fakeSav(without)), null);
});

test('Einstieg: correlations are pairwise, umpolen flips the sign of row and column only', () => {
  const x = prepareFr(fakeSav(frSav()))!, cor = frCorrelations(x);
  assert.equal(cor.length, 8);
  for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) assert.ok(Math.abs(cor[i][j] - cor[j][i]) < 1e-12);
  assert.ok(Math.abs(cor[0][1] - pearson(x.fr07, x.fr08)) < 1e-12);
  const i07 = FR_IDS.indexOf('fr07'), i03 = FR_IDS.indexOf('fr03b'), i04 = FR_IDS.indexOf('fr04b');
  assert.ok(cor[i07][i03] < 0 && cor[i03][i04] > 0);
  assert.equal(shownCorrelation(cor, i07, i03, ['fr03b']), -cor[i07][i03]);
  assert.equal(shownCorrelation(cor, i03, i04, ['fr03b', 'fr04b']), cor[i03][i04]);
  assert.equal(shownCorrelation(cor, i07, i04, ['fr03b']), cor[i07][i04]);
  assert.equal(shownCorrelation(cor, 2, 2, ['fr03b']), 1);
  // Umpolen per Rechnung: r(5 − a, b) = −r(a, b)
  assert.ok(Math.abs(pearson(Float64Array.from(x.fr03b, flipCode), x.fr07) + cor[i07][i03]) < 1e-12);
  assert.deepEqual([shortR(0.448), shortR(-0.426), shortR(-0.004), shortR(1)], [',45', '−,43', '−,00', '1,00']);
});

test('Einstieg: alpha like reliability() – listwise, umgepolte Items als 5 − Code, Trennschärfe und α ohne Item', () => {
  const x = prepareFr(fakeSav(frSav()))!;
  const start = frStart();
  assert.deepEqual(start, { on: [...FR_IDS], flipped: [] });
  assert.equal(frChanged(start), false);
  const raw = frReliability(x, start), ref = reliability(FR_IDS.map(id => x[id]));
  assert.deepEqual([raw.k, raw.n, raw.alpha], [8, ref.n, ref.alpha]);
  assert.equal(raw.n, 38);
  assert.deepEqual(raw.items.map(s => s.corrected), ref.items.map(s => s.corrected));
  const trad: FrId[] = ['fr03b', 'fr04b', 'fr09', 'fr10'];
  const right = frReliability(x, { on: [...FR_IDS], flipped: trad });
  const other = frReliability(x, { on: [...FR_IDS], flipped: FR_IDS.filter(id => !trad.includes(id)) });
  assert.ok(right.alpha > 0.8 && raw.alpha < right.alpha);
  // Welche Seite umgepolt wird, ist für α egal.
  assert.ok(Math.abs(right.alpha - other.alpha) < 1e-12);
  assert.ok(right.items.every(s => s.corrected > 0));
  // Ein vergessenes Item: negative Trennschärfe, ohne es wäre α höher.
  const forgot = frReliability(x, { on: [...FR_IDS], flipped: ['fr03b', 'fr04b', 'fr10'] });
  const f09 = forgot.items.find(s => s.id === 'fr09')!;
  assert.ok(f09.corrected < 0 && f09.alphaIfDeleted > forgot.alpha && forgot.alpha < right.alpha);
  // Herausnehmen: α wie reliability() nur mit den übrigen Items
  let s = toggleFrOn({ on: [...FR_IDS], flipped: trad }, 'fr12');
  assert.deepEqual(s.on, FR_IDS.filter(id => id !== 'fr12'));
  assert.equal(frChanged(s), true);
  const fewer = frReliability(x, s);
  assert.equal(fewer.k, 7);
  assert.ok(Math.abs(fewer.alpha - right.items.find(i => i.id === 'fr12')!.alphaIfDeleted) < 1e-12);
  s = toggleFrOn(s, 'fr12');
  assert.deepEqual(s.on, [...FR_IDS], 'wieder hinein, in der alten Reihenfolge');
  assert.deepEqual(toggleFrFlip(toggleFrFlip(start, 'fr10'), 'fr03b').flipped, ['fr03b', 'fr10']);
  assert.deepEqual(toggleFrFlip(toggleFrFlip(start, 'fr10'), 'fr10').flipped, []);
  // Unter zwei Items kein α; mit zwei Items kein α ohne Item
  const one = frReliability(x, { on: ['fr07'], flipped: [] });
  assert.ok(Number.isNaN(one.alpha));
  const two = frReliability(x, { on: ['fr07', 'fr03b'], flipped: ['fr03b'] });
  assert.ok(Number.isFinite(two.alpha) && Number.isNaN(two.items[0].alphaIfDeleted));
});

test('Einstieg: the R code mirrors the choice and passes rStyleProblems for every combination', () => {
  assert.equal(frCode(frStart()), '# Stimmigkeit deiner Auswahl\nallbus %>%\n  reliability(fr07, fr08, fr03b, fr04b, fr05b, fr09, fr10, fr12)');
  const code = frCode({ on: FR_IDS.filter(id => id !== 'fr12'), flipped: ['fr03b', 'fr09'] });
  assert.match(code, /mutate\(\n {4}fr03b_umgepolt = rec\(fr03b, rules = "rev"\),\n {4}fr09_umgepolt {2}= rec\(fr09, rules = "rev"\)\n {2}\)/);
  assert.match(code, /reliability\(fr07, fr08, fr03b_umgepolt, fr04b, fr05b, fr09_umgepolt, fr10\)/);
  // Ein umgepoltes, aber herausgenommenes Item wird nicht umkodiert.
  assert.doesNotMatch(frCode({ on: ['fr07', 'fr08'], flipped: ['fr03b'] }), /mutate/);
  assert.match(frCode({ on: ['fr07'], flipped: [] }), /reliability\(fr07, ___\)/);
  for (let mask = 0; mask < 256; mask++) {
    const flipped = FR_IDS.filter((_, i) => mask & (1 << i));
    for (const on of [[...FR_IDS], FR_IDS.filter((_, i) => !(mask & (1 << ((i + 3) % 8)))), []]) {
      const c = frCode({ on, flipped });
      assert.deepEqual(rStyleProblems(c), [], c);
    }
  }
});
