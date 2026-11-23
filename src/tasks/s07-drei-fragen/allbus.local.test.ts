// Läuft nur mit der eigenen GESIS-Datei: ALLBUS_SAV=/pfad/ZA8831_v1-3-0.sav node --import tsx --test src/tasks/s07-drei-fragen/allbus.local.test.ts
// Prüft die Referenzwerte aus Spezifikation 4.7 (ungewichtet; Kür gewichtet) – nur Aggregate.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { readSav } from '../../sandbox/readSav';
import { FR_IDS, type FrId } from './content';
import {
  frCorrelations, frReliability, prepareFr, shortR, shownCorrelation,
  ALPHA_NOT_FOUND, alphaVariants, checkNumber, detailOf, kuer, KUER_NOT_FOUND, kuerMeanVariants, landscapeNotes, prepare, R_NOT_FOUND, rVariants, weakestItem,
} from './domain';

const file = process.env.ALLBUS_SAV;
const skip = !file && 'ALLBUS_SAV nicht gesetzt';
const sav = () => {
  const bytes = readFileSync(file!);
  return readSav(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
};
const load = () => prepare(sav());
const r3 = (x: number) => Math.round(x * 1000) / 1000;
const r1 = (x: number) => Math.round(x * 10) / 10;

test('session 8: battery, 35 short scales, the example and the bonus task match spec 4.7', { skip }, () => {
  const p = load();
  // Alle sieben Fragen: α = .833, ω = .841, n = 3.427; schwächste Trennschärfe pa29 (.348), ohne pa29 α = .842
  assert.deepEqual([r3(p.full.alpha), r3(p.full.omega), p.full.n], [0.833, 0.841, 3427]);
  assert.deepEqual([r3(p.full.alphaStd), r3(p.full.omegaStd)], [0.83, 0.835]);
  assert.equal(weakestItem(p), 'pa29');
  assert.deepEqual([r3(p.full.items[0].corrected), r3(p.full.items[0].alphaIfDeleted), r3(p.full.items[0].omegaIfDeleted)], [0.348, 0.842, 0.844]);
  // 14 von 35 mit α ≥ .70, keine mit pa29 (höchstens .631); pa29: 78 % Zustimmung (gewichtet)
  assert.equal(p.triples.length, 35);
  const good = p.triples.filter(t => t.alpha >= 0.7);
  assert.equal(good.length, 14);
  assert.equal(good.filter(t => t.items.includes('pa29')).length, 0);
  assert.equal(r3(Math.max(...p.triples.filter(t => t.items.includes('pa29')).map(t => t.alpha))), 0.631);
  assert.equal(Math.round(100 * p.agree.pa29), 78);
  // Höchstes α: pa31 + pa32 + pa35 = .776, als Stellvertreter Rang 26; die zweitstimmigste Rang 34; r(α, Stellvertreter) = .23
  const first = p.triples.find(t => t.rankAlpha === 1)!, second = p.triples.find(t => t.rankAlpha === 2)!;
  assert.deepEqual([first.key, r3(first.alpha), r3(first.r), first.rankR], ['pa31+pa32+pa35', 0.776, 0.702, 26]);
  assert.deepEqual([second.key, r3(second.alpha), second.rankR], ['pa30+pa32+pa35', 0.767, 34]);
  assert.equal(Math.round(p.corAlphaR * 100) / 100, 0.23);
  const bestR = p.triples.find(t => t.rankR === 1)!;
  assert.deepEqual([bestR.key, r3(bestR.r), bestR.rankAlpha], ['pa30+pa32+pa33', 0.764, 11]);
  assert.deepEqual([r3(Math.min(...p.triples.map(t => t.alpha))), r3(Math.min(...p.triples.map(t => t.r)))], [0.527, 0.63]);
  // Beispiel pa31 + pa32 + pa33: α = .759 (n = 3.478), r = .758 (n = 3.427); Varianten wie im Konzept
  const ex = p.byKey['pa31+pa32+pa33'], d = detailOf(p, ex);
  assert.deepEqual([r3(ex.alpha), ex.nAlpha, r3(ex.r), ex.nR, ex.rankAlpha, ex.rankR], [0.759, 3478, 0.758, 3427, 5, 2]);
  assert.deepEqual([r3(ex.alphaStd), r3(d.alphaW), r3(d.rAny[0]), r3(d.rW), r3(d.rLong[0])], [0.759, 0.754, 0.745, 0.749, 0.937]);
  assert.equal(p.byKey['pa29+pa31+pa32'].rankR, 4);
  const alpha = (s: string) => checkNumber(alphaVariants(p, ex), s, ALPHA_NOT_FOUND)[0];
  const r = (s: string) => checkNumber(rVariants(p, ex), s, R_NOT_FOUND)[0];
  assert.equal(alpha('0,759').tone, 'ok');
  assert.match(alpha('0,833').text, /α aller sieben Items/);
  assert.equal(r('.758').tone, 'ok');
  assert.match(r('0,937').text, /Gesamtindex aller sieben/);
  assert.match(r('0,745').text, /wer bekommt überhaupt einen Skalenwert/);
  assert.match(r('0,749').text, /mit Gewicht/);
  // Kein Heywood-Fall auf der echten Datei; bei pa31 + pa32 + pa35 sind ω und standardisiertes α gleich gerundet (.777)
  assert.equal(p.triples.filter(t => t.omegaBoundary).length, 0);
  assert.equal(p.full.omegaBoundary, false);
  const champ = p.byKey['pa31+pa32+pa35'];
  assert.deepEqual([r3(champ.omega), r3(champ.alphaStd)], [0.777, 0.777]);
  const both = checkNumber(alphaVariants(p, champ), '0,777', ALPHA_NOT_FOUND)[0];
  assert.match(both.text, /McDonalds ω oder das standardisierte α – beide liegen hier bei 0,777/);
  assert.equal(checkNumber(alphaVariants(p, champ), '0,776', ALPHA_NOT_FOUND)[0].tone, 'ok');
  assert.match(checkNumber(kuerMeanVariants(kuer(p, ['pa31', 'pa32', 'pa33'])), '21.7%', KUER_NOT_FOUND, 1)[0].text, /^Stimmt/);
  // Kür (gewichtet): 21,7 % im Schnitt gegen 14,2 % durchgehend
  const k = kuer(p, ['pa31', 'pa32', 'pa33']);
  assert.deepEqual([r1(k.meanW), r1(k.allW), r1(k.meanW - k.allW)], [21.7, 14.2, 7.5]);
  assert.match(checkNumber(kuerMeanVariants(k), '14,1', KUER_NOT_FOUND, 1)[0].text, /Kurzwert unter 2/);
  assert.match(checkNumber(kuerMeanVariants(k), '14,2', KUER_NOT_FOUND, 1)[0].text, /zweite Feld/);
  const notes = landscapeNotes(p, [['pa31', 'pa32', 'pa33']], true);
  assert.equal(notes[0], 'Die stimmigste Kurzskala ist pa31 + pa32 + pa35 (α = 0,776). Als Stellvertreter steht sie auf Platz 26 von 35.');
  assert.equal(notes[1], 'Die zweitstimmigste, pa30 + pa32 + pa35, steht als Stellvertreter auf Platz 34.');
  assert.equal(notes[3], 'Über alle 35 Kurzskalen hängen Stimmigkeit und Stellvertreter-Wert nur schwach zusammen (r = 0,228).');
  assert.equal(notes[4], '14 von 35 Kurzskalen erreichen α ≥ 0,70, keine davon mit pa29 (höchstens 0,631).');
});

// Einstieg: Rollenbild-Items fr07, fr08, fr03b, fr04b, fr05b, fr09, fr10, fr12 (Codes 1–4), gegen R geprüft mit
// pearson_cor(fr07, fr08, fr03b, fr04b, fr05b, fr09, fr10, fr12) und reliability() bzw. summary() mit rec(…, rules = "rev").
test('session 8 intro: heat map correlations and alpha with and without reversal match mariposa', { skip }, () => {
  const x = prepareFr(sav())!;
  assert.ok(x, 'alle acht Items in der Datei');
  // pearson_cor() paarweise, fünf Nachkommastellen wie in R
  const R = [
    [1, 0.44773, -0.42592, -0.30880, 0.36595, -0.29311, -0.17575, 0.19228],
    [0.44773, 1, -0.24187, -0.24482, 0.33923, -0.17612, -0.15985, 0.15153],
    [-0.42592, -0.24187, 1, 0.51634, -0.41787, 0.37731, 0.36490, -0.18715],
    [-0.30880, -0.24482, 0.51634, 1, -0.41847, 0.25528, 0.46545, -0.27715],
    [0.36595, 0.33923, -0.41787, -0.41847, 1, -0.21764, -0.25535, 0.18951],
    [-0.29311, -0.17612, 0.37731, 0.25528, -0.21764, 1, 0.27246, -0.12314],
    [-0.17575, -0.15985, 0.36490, 0.46545, -0.25535, 0.27246, 1, -0.30402],
    [0.19228, 0.15153, -0.18715, -0.27715, 0.18951, -0.12314, -0.30402, 1],
  ];
  const cor = frCorrelations(x);
  R.forEach((row, i) => row.forEach((v, j) => assert.ok(Math.abs(cor[i][j] - v) < 6e-6, `${FR_IDS[i]} × ${FR_IDS[j]}: ${cor[i][j]} statt ${v}`)));
  // 16 von 28 Paaren sind am Start negativ; nach dem Umpolen der vier traditionell formulierten Items sind alle positiv.
  const pairs = (flipped: FrId[]) => FR_IDS.flatMap((_, i) => FR_IDS.map((__, j) => (i < j ? shownCorrelation(cor, i, j, flipped) : NaN))).filter(Number.isFinite);
  assert.equal(pairs([]).filter(r => r < 0).length, 16);
  assert.equal(pairs(['fr03b', 'fr04b', 'fr09', 'fr10']).filter(r => r < 0).length, 0);
  assert.deepEqual([shortR(cor[0][1]), shortR(cor[0][2])], [',45', '−,43']);

  const all = [...FR_IDS];
  const near = (a: number, b: number, tol = 6e-6) => Math.abs(a - b) < tol;
  // Start, so wie die Items im Datensatz stehen: α = −0,072 (n = 3.456)
  const raw = frReliability(x, { on: all, flipped: [] });
  assert.equal(raw.n, 3456);
  assert.ok(near(raw.alpha, -0.072108), String(raw.alpha));
  assert.deepEqual(raw.items.map(s => r3(s.corrected)), [-0.102, 0.036, -0.013, 0.014, -0.162, 0.044, 0.124, -0.114]);
  assert.deepEqual(raw.items.map(s => r3(s.alphaIfDeleted)), [0.017, -0.125, -0.074, -0.099, 0.066, -0.131, -0.199, -0.002]);
  // fr03b, fr04b, fr09, fr10 umgepolt: α = 0,772; alle Trennschärfen positiv, kein Item hebt α
  const right = frReliability(x, { on: all, flipped: ['fr03b', 'fr04b', 'fr09', 'fr10'] });
  assert.equal(right.n, 3456);
  assert.ok(near(right.alpha, 0.771723), String(right.alpha));
  assert.deepEqual(right.items.map(s => r3(s.corrected)), [0.522, 0.404, 0.601, 0.577, 0.516, 0.392, 0.447, 0.310]);
  assert.deepEqual(right.items.map(s => r3(s.alphaIfDeleted)), [0.738, 0.760, 0.723, 0.729, 0.740, 0.761, 0.752, 0.770]);
  assert.ok(right.items.every(s => s.alphaIfDeleted < right.alpha));
  // Die andere Seite umgepolt: dasselbe α
  const other = frReliability(x, { on: all, flipped: ['fr07', 'fr08', 'fr05b', 'fr12'] });
  assert.ok(near(other.alpha, 0.771723));
  // fr09 vergessen: α = 0,617; fr09 Trennschärfe −0,392, ohne fr09 wäre α 0,761
  const forgot = frReliability(x, { on: all, flipped: ['fr03b', 'fr04b', 'fr10'] });
  assert.ok(near(forgot.alpha, 0.617003), String(forgot.alpha));
  const f09 = forgot.items.find(s => s.id === 'fr09')!;
  assert.deepEqual([r3(f09.corrected), r3(f09.alphaIfDeleted)], [-0.392, 0.761]);
  // Herausnehmen: ohne fr09 und fr12 α = 0,760 (n = 3.473); nur fr07 und fr03b umgepolt: α = 0,597 (n = 3.553)
  const six = frReliability(x, { on: all.filter(id => id !== 'fr09' && id !== 'fr12'), flipped: ['fr03b', 'fr04b', 'fr10'] });
  assert.deepEqual([six.n, r3(six.alpha)], [3473, 0.76]);
  assert.ok(near(six.alpha, 0.759827));
  const two = frReliability(x, { on: ['fr07', 'fr03b'], flipped: ['fr03b'] });
  assert.deepEqual([two.n, r3(two.alpha), r3(two.items[0].corrected)], [3553, 0.597, 0.426]);
});
