// Läuft nur mit der eigenen GESIS-Datei: ALLBUS_SAV=/pfad/ZA8831_v1-3-0.sav node --import tsx --test src/chapter/s08/*.test.ts
// Prüft jede feste Zahl von Sitzung 8 gegen ZA8831 v1.3.0. Gültig heißt: kein Missing-Code, kein Systemmissing.
// Rechenkern wie mariposa: reliability(), row_means(), row_sums() aus src/tasks/kit/reliability.ts (gegen R geprüft).
// Ungewichtet: α, Trennschärfen, Korrelationen, Personenzahlen. Gewichtet (wghtpew): Mittelwerte und Anteile wie
// describe()/frequency() mit weights (gewichtete Summe durch Summe der Gewichte; N gewichtet = Summe der Gewichte).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { readSav, type SavFile } from '../../sandbox/readSav';
import { validValues } from '../../tasks/kit/stats';
import { reliability, rowMeans, rowSums } from '../../tasks/kit/reliability';
import {
  A4, FR03B_REV, FR_AGREE, FR_IDS, INGLE_CODE_MEAN, INGLE_NOT_GENERATED, INGLE_SHARES, LAB, LAB_ALPHA_WITHOUT_FR08, LAB_N, MM_IDS, MM_REL,
  MP_DESCRIBE_W, MP_INDEX, MP_INDEX_N, MP_INDEX_W, MP_RISK, MP_SUM_RANGE, MP_THIRDS_PERCENT, MP_VALID, PA_IDS, PA_REL, PN_CLOSE, PN_COR,
  PN_IDS, PN_MEAN_COR, PN_RBAR, PN_REL, POP,
} from './content';

const file = process.env.ALLBUS_SAV;
const skip = !file && 'ALLBUS_SAV nicht gesetzt';
let cached: SavFile | null = null;
const load = () => {
  if (cached) return cached;
  const bytes = readFileSync(file!);
  return (cached = readSav(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)));
};
const col = (name: string) => { const v = load().byName.get(name); assert.ok(v, name); return validValues(v); };
const weights = () => col('wghtpew');
const r3 = (x: number) => Math.round(x * 1000) / 1000;
const r2 = (x: number) => Math.round(x * 100) / 100;
const finite = (x: ArrayLike<number>) => Array.from(x).filter(Number.isFinite).length;

/** Gewichtete Anteile wie frequency(x, weights = wghtpew): Valid % je Wert. */
function wShares(x: ArrayLike<number>) {
  const w = weights(), m = new Map<number, number>();
  let total = 0;
  for (let i = 0; i < x.length; i++) if (Number.isFinite(x[i])) { m.set(x[i], (m.get(x[i]) ?? 0) + w[i]); total += w[i]; }
  return { pct: (v: number) => (100 * (m.get(v) ?? 0)) / total, upTo: (v: number) => (100 * [...m].filter(([k]) => k <= v + 1e-9).reduce((s, [, a]) => s + a, 0)) / total, total };
}
/** Gewichteter Mittelwert wie describe(x, weights = wghtpew); n = Summe der Gewichte. */
function wMean(x: ArrayLike<number>) {
  const w = weights();
  let s = 0, t = 0;
  for (let i = 0; i < x.length; i++) if (Number.isFinite(x[i])) { s += w[i] * x[i]; t += w[i]; }
  return { mean: s / t, n: t };
}
const unweightedMean = (x: ArrayLike<number>) => { const v = Array.from(x).filter(Number.isFinite); return v.reduce((a, b) => a + b, 0) / v.length; };
/** Zustimmung (Code 1 oder 2), gewichtet, Prozent. */
const agree = (name: string) => wShares(col(name)).upTo(2);

test('grundlage 1: mp16 to mp19, valid answers, index counts, risk shares and the weighted index', { skip }, () => {
  const mp = ['mp16', 'mp17', 'mp18', 'mp19'].map(col);
  const nValid = Array.from(mp[0], (_, i) => mp.filter(c => Number.isFinite(c[i])).length);
  const count = (k: number) => nValid.filter(n => n === k).length;
  assert.deepEqual([count(4), count(3), count(2), count(1)], [MP_VALID.all4, MP_VALID.three, MP_VALID.two, MP_VALID.one]);
  assert.deepEqual([finite(rowMeans(mp, 4)), finite(rowMeans(mp, 3)), finite(rowMeans(mp))], [MP_INDEX_N.min4, MP_INDEX_N.min3, MP_INDEX_N.none]);
  const sums = Array.from(rowSums(mp)).filter(Number.isFinite);
  assert.deepEqual([Math.min(...sums), Math.max(...sums)], [MP_SUM_RANGE.min, MP_SUM_RANGE.max]);
  for (const [v, p] of Object.entries(MP_RISK)) assert.equal(r2(agree(v)), p, v);
  // Bild B3: Valid % und Cum. % je Viertelwert, gewichtet
  const f4 = rowMeans(mp, 4), s4 = wShares(f4);
  MP_INDEX.values.forEach((v, i) => {
    assert.equal(r2(s4.pct(v)), MP_INDEX.percent[i], `Valid % bei ${v}`);
    assert.equal(r2(s4.upTo(v)), MP_INDEX.cum[i], `Cum. % bei ${v}`);
  });
  assert.equal(r2(100 - s4.upTo(3)), MP_INDEX.above3);
  assert.equal(r2(s4.pct(3)), MP_INDEX.at3);
  assert.equal(finite(f4), MP_INDEX.n);
  // Mittelwerte gewichtet: min_valid = 4 und (R lesen) min_valid = 3
  assert.equal(r3(wMean(f4).mean), MP_INDEX_W.mean);
  const f3 = rowMeans(mp, 3), d3 = wMean(f3);
  assert.equal(r3(d3.mean), MP_DESCRIBE_W.mean);
  assert.equal(Math.round(d3.n), MP_DESCRIBE_W.n);
  // Drittelwerte mit min_valid = 3, gewichtet zusammen
  const s3 = wShares(f3), thirds = Array.from(new Set(Array.from(f3).filter(x => Number.isFinite(x) && Math.abs(x * 4 - Math.round(x * 4)) > 1e-9)));
  assert.equal(r2(thirds.reduce((s, v) => s + s3.pct(v), 0)), MP_THIRDS_PERCENT);
  // Gewichteter Median (2,5) und SD (0,838) rechnet mariposa mit eigener Interpolation; sie sind in sitzung08-zahlen.R
  // („Vorweg R lesen“, R2, und „Grundlage 1“) gegen die gedruckte describe()-Ausgabe geprüft (dort Median, SD, Skewness, Missing).
  // Hier nur: 2,5 ist ein Wert des Index.
  assert.ok(MP_INDEX.values.includes(MP_INDEX_W.median));
});

test('grundlage 2: pn12, pn13, pn16, pn17 correlations, alpha output and weighted closeness', { skip }, () => {
  const pn = PN_IDS.map(col);
  const rel = reliability(pn);
  assert.equal(rel.n, PN_REL.n);
  assert.deepEqual([r3(rel.alpha), r3(rel.alphaStd), r3(rel.omega), r3(rel.omegaStd), rel.k], [PN_REL.alpha, PN_REL.alphaStd, PN_REL.omega, PN_REL.omegaStd, PN_REL.k]);
  rel.items.forEach((it, i) => {
    const want = PN_REL.items[i];
    assert.deepEqual([r3(it.scaleMeanIfDeleted), r3(it.scaleVarIfDeleted), r3(it.corrected), r3(it.alphaIfDeleted), r3(it.omegaIfDeleted)],
      [want.meanIfDeleted, want.varIfDeleted, want.corrected, want.alphaIfDeleted, want.omegaIfDeleted], want.id);
  });
  PN_COR.forEach((row, i) => row.forEach((r, j) => assert.equal(r3(rel.cor[i][j]), r, `${PN_IDS[i]} × ${PN_IDS[j]}`)));
  PN_MEAN_COR.forEach((m, i) => assert.equal(r3(rel.cor[i].filter((_, j) => j !== i).reduce((a, b) => a + b, 0) / 3), m, PN_IDS[i]));
  const off = [rel.cor[0][1], rel.cor[0][2], rel.cor[0][3], rel.cor[1][2], rel.cor[1][3], rel.cor[2][3]];
  assert.equal(r3(off.reduce((a, b) => a + b, 0) / 6), PN_RBAR);
  PN_IDS.forEach((id, i) => assert.equal(r2(agree(id)), PN_CLOSE[i], id));
});

test('grundlage 3: fr items, reversal on the label scale, all 16 lab states', { skip }, () => {
  const fr = Object.fromEntries(FR_IDS.map(id => [id, col(id)])) as Record<(typeof FR_IDS)[number], Float64Array>;
  for (const id of FR_IDS) assert.equal(r2(agree(id)), FR_AGREE[id], id);
  // rec(x, rules = "rev") nimmt die Skala aus den Wertelabels: 1 bis 4 bei fr, 1 bis 7 bei mm
  const scale = (name: string) => { const codes = [...load().byName.get(name)!.valueLabels.keys()].filter(k => k > 0); return [Math.min(...codes), Math.max(...codes)]; };
  assert.deepEqual(scale('fr03b'), [1, 4]);
  assert.deepEqual(scale('mm02'), [1, 7]);
  assert.deepEqual(scale('mm05'), [1, 7]);
  const rev = (x: Float64Array, lo: number, hi: number) => Float64Array.from(x, v => (Number.isFinite(v) ? lo + hi - v : NaN));
  const fr03bUm = rev(fr.fr03b, 1, 4);
  assert.deepEqual([fr03bUm.filter(v => v === 1).length, fr03bUm.filter(v => v === 4).length], [FR03B_REV.code1, FR03B_REV.code4]);
  for (const [key, want] of Object.entries(LAB)) {
    const items = FR_IDS.map((id, j) => (key[j] === 'U' ? rev(fr[id], 1, 4) : fr[id]));
    const rel = reliability(items, null, { omega: false });
    assert.equal(rel.n, LAB_N, key);
    assert.deepEqual([r3(rel.alpha), ...rel.items.map(it => r3(it.corrected))], want, key);
  }
  const right = reliability([fr.fr07, fr.fr08, rev(fr.fr03b, 1, 4), rev(fr.fr04b, 1, 4)], null, { omega: false });
  assert.equal(r3(right.items[1].alphaIfDeleted), LAB_ALPHA_WITHOUT_FR08);
});

test('grundlage 4: Inglehart types weighted, the rule from places 1 and 2, the mean of the codes', { skip }, () => {
  const ingle = col('ingle'), s = wShares(ingle);
  [1, 2, 3, 4].forEach((code, i) => assert.equal(r2(s.pct(code)), INGLE_SHARES[i], String(code)));
  const raw = load().byName.get('ingle')!.values, w = weights();
  let notGenerated = 0;
  for (let i = 0; i < raw.length; i++) if (raw[i] === -32) notGenerated += w[i];
  assert.equal(Math.round(notGenerated), INGLE_NOT_GENERATED);
  assert.equal(r3(wMean(ingle).mean), INGLE_CODE_MEAN);
  // Regel: Platz 1 und 2 (Rang 1 bzw. 2 in va01 bis va04); postmaterialistisch sind va02 und va04
  const va = ['va01', 'va02', 'va03', 'va04'].map(col);
  let checked = 0;
  for (let i = 0; i < ingle.length; i++) {
    if (!Number.isFinite(ingle[i]) || va.some(c => !Number.isFinite(c[i]))) continue;
    const first = va[1][i] === 1 || va[3][i] === 1 ? 'P' : 'M', second = va[1][i] === 2 || va[3][i] === 2 ? 'P' : 'M';
    assert.equal({ PP: 1, PM: 2, MP: 3, MM: 4 }[`${first}${second}`], ingle[i]);
    assert.equal(va.reduce((a, c) => a + c[i], 0) / 4, 2.5);
    checked++;
  }
  assert.ok(checked > 3000, String(checked));
});

test('aufgabe 1: populism index, persons with a value, means without and with weight', { skip }, () => {
  const pa = PA_IDS.map(col);
  const p7 = rowMeans(pa, 7), p5 = rowMeans(pa, 5);
  assert.deepEqual([finite(p7), finite(p5), finite(p5) - finite(p7)], [POP.nMin7, POP.nMin5, POP.extra]);
  assert.deepEqual([pa[0].length - finite(p7), pa[0].length - finite(p5)], [POP.missingMin7, POP.missingMin5]);
  assert.deepEqual([r3(unweightedMean(p7)), r3(unweightedMean(p5))], [POP.meanMin7, POP.meanMin5]);
  const w5 = wMean(p5), w7 = wMean(p7);
  assert.deepEqual([r3(w5.mean), Math.round(w5.n), r3(w7.mean), Math.round(w7.n)], [POP.weighted.mean, POP.weighted.n, POP.weighted.meanMin7, POP.weighted.nMin7]);
  // Gewichteter Median (2,714) und SD (0,760): mariposa-eigene Rechnung; nur in sitzung08-zahlen.R (Abschnitt A1)
  // gegen die gedruckte describe()-Ausgabe geprüft, hier bewusst nicht nachgerechnet.
});

test('aufgabe 2: reliability of the seven statements, without pa29, weighted alpha, pa29 agreement', { skip }, () => {
  const pa = PA_IDS.map(col);
  const rel = reliability(pa);
  assert.deepEqual([r3(rel.alpha), r3(rel.alphaStd), r3(rel.omega), rel.n], [PA_REL.alpha, PA_REL.alphaStd, PA_REL.omega, PA_REL.n]);
  assert.deepEqual(rel.items.map(it => r3(it.corrected)), PA_REL.corrected);
  assert.deepEqual(rel.items.map(it => r3(it.alphaIfDeleted)), PA_REL.alphaIfDeleted);
  const without = reliability(pa.slice(1));
  assert.deepEqual([r3(without.alpha), r3(without.omega), without.n], [PA_REL.without29.alpha, PA_REL.without29.omega, PA_REL.without29.n]);
  assert.equal(r3(reliability(pa, weights(), { omega: false }).alpha), PA_REL.alphaWeighted);
  assert.equal(r2(agree('pa29')), PA_REL.pa29Agree);
});

test('aufgabe 3: statements on Islam and Muslims before and after reversing mm02 and mm05', { skip }, () => {
  const mm = MM_IDS.map(col);
  const before = reliability(mm);
  assert.equal(before.n, MM_REL.n);
  assert.deepEqual([r3(before.alpha), r3(before.alphaStd), r3(before.omega)], [MM_REL.before.alpha, MM_REL.before.alphaStd, MM_REL.before.omega]);
  assert.deepEqual(before.items.map(it => r3(it.corrected)), MM_REL.before.corrected);
  const rev = (x: Float64Array) => Float64Array.from(x, v => (Number.isFinite(v) ? 8 - v : NaN));
  const after = reliability([mm[0], rev(mm[1]), mm[2], mm[3], rev(mm[4]), mm[5]]);
  assert.equal(after.n, MM_REL.n);
  assert.deepEqual([r3(after.alpha), r3(after.alphaStd), r3(after.omega)], [MM_REL.after.alpha, MM_REL.after.alphaStd, MM_REL.after.omega]);
  assert.deepEqual(after.items.map(it => r3(it.corrected)), MM_REL.after.corrected);
  assert.equal(r3(reliability([mm[0], rev(mm[1]), mm[2], mm[3], mm[4], mm[5]], null, { omega: false }).alpha), MM_REL.onlyMm02);
  assert.equal(r3(reliability([mm[0], mm[1], mm[2], mm[3], rev(mm[4]), mm[5]], null, { omega: false }).alpha), MM_REL.onlyMm05);
});

test('aufgabe 4: agreements and the mean of three statements, weighted and unweighted, the gap', { skip }, () => {
  const pa = ['pa31', 'pa32', 'pa33'].map(col);
  const z = pa.map(c => Float64Array.from(c, v => (Number.isNaN(v) ? NaN : v <= 2 ? 1 : 0)));
  const sums = rowSums(z, 3), kurz = rowMeans(pa, 3);
  const s = wShares(sums), k = wShares(kurz);
  assert.deepEqual([0, 1, 2, 3].map(v => r2(s.pct(v))), A4.agreements);
  assert.equal(Math.round(s.total), A4.nWeighted);
  assert.deepEqual([r2(k.upTo(2)), r2(k.pct(2))], [A4.meanUpTo2, A4.meanExactly2]);
  const unw = (x: Float64Array, hit: (v: number) => boolean) => { const v = Array.from(x).filter(Number.isFinite); return (100 * v.filter(hit).length) / v.length; };
  assert.deepEqual([r2(unw(sums, v => v === 3)), r2(unw(kurz, v => v <= 2 + 1e-9))], [A4.unweighted.all3, A4.unweighted.meanUpTo2]);
  assert.equal(r2(A4.meanUpTo2 - A4.agreements[3]), A4.gap);
  // Zerlegung des Unterschieds: im Schnitt höchstens 2, aber nicht allen drei zugestimmt; höchste Antwort 3 oder 4
  const w = weights();
  let all = 0, gap3 = 0, gap4 = 0, partlyWithFull = true;
  for (let i = 0; i < w.length; i++) {
    if (!Number.isFinite(kurz[i])) continue;
    all += w[i];
    if (kurz[i] <= 2 + 1e-9 && sums[i] < 3) {
      const top = Math.max(pa[0][i], pa[1][i], pa[2][i]);
      if (top === 3) { gap3 += w[i]; if (Math.min(pa[0][i], pa[1][i], pa[2][i]) !== 1) partlyWithFull = false; }
      if (top === 4) gap4 += w[i];
    }
  }
  assert.deepEqual([Math.round(1000 * gap3 / all) / 10, Math.round(1000 * gap4 / all) / 10], [A4.gapPartly, A4.gapReject]);
  assert.ok(partlyWithFull, 'every „teils/teils“ case agrees fully with one statement');
});
