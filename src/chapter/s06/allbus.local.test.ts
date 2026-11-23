// Läuft nur mit der eigenen GESIS-Datei: ALLBUS_SAV=/pfad/ZA8831_v1-3-0.sav node --import tsx --test src/chapter/s06/*.test.ts
// Prüft jede feste Zahl von Sitzung 6 gegen ZA8831 v1.3.0. Gewichtet rechnet src/tasks/kit/stats.ts wie mariposa 0.7.4:
// Häufigkeiten mit Summen der Gewichte; crosstab(), χ²-Maße und Gamma auf ganzzahlig gerundeten gewichteten Zellen;
// Tau-b mit √(wᵢ·wⱼ) je Paar; Pearson-r gewichtet; Spearman-ρ immer ungewichtet. Einzige Ausnahme: mariposa::phi() gibt bei
// 2 × 2 ein Vorzeichen aus, kit/stats nicht; das Vorzeichen rechnet signedPhi() unten aus denselben gerundeten Zellen.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { readSav, type SavFile } from '../../sandbox/readSav';
import { chiSquare, cramersV, crosstab, gamma, pearson, phi, roundTable, spearman, tauB, validValues, type Table } from '../../tasks/kit/stats';
import {
  A2, A2_TRY, A3, A4, AGE_XT10, EASTWEST, EP01_SATISFIED, FIVE, HS_ID, INTERNET, KONF, KONF_ORDER, LAYER_STACK, NONE, PARTIES, PS03, WGHTPEW,
} from './content';

const file = process.env.ALLBUS_SAV;
const skip = !file && 'ALLBUS_SAV nicht gesetzt';
let cached: SavFile | null = null;
const load = () => {
  if (cached) return cached;
  const bytes = readFileSync(file!);
  return (cached = readSav(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)));
};
const col = (name: string) => {
  const v = load().byName.get(name);
  assert.ok(v, name);
  return validValues(v);
};
type Arr = Float64Array;
/** Recode like rec(): a function from a valid value to the new code (NaN = NA). */
const rec = (x: Arr, f: (v: number) => number) => Float64Array.from(x, v => (Number.isFinite(v) ? f(v) : NaN));
/** Keep only cases where `keep` holds (others NA), like filter() before the measure. */
const only = (x: Arr, keep: (i: number) => boolean) => Float64Array.from(x, (v, i) => (keep(i) ? v : NaN));
const r = (x: number, d: number) => Math.round(x * 10 ** d) / 10 ** d + 0;
const w = () => col('wghtpew');
const ew = () => col('eastwest');
const zufrieden = () => rec(col('ps03'), v => (v <= 3 ? 1 : 0));
const zufriedenheit = () => rec(col('ps03'), v => 7 - v);

/** Weighted (or unweighted) frequencies: share of each code among the valid cases, in %. */
function freq(x: Arr, wt: Arr | null) {
  const sums = new Map<number, number>();
  let total = 0;
  x.forEach((v, i) => { if (!Number.isFinite(v)) return; const a = wt ? wt[i] : 1; sums.set(v, (sums.get(v) ?? 0) + a); total += a; });
  const pct = (codes: number[]) => codes.reduce((a, c) => a + (sums.get(c) ?? 0), 0) / total * 100;
  return { sums, total, pct };
}

/** Rounded weighted table as in crosstab(weights = …); unweighted without rounding. */
const table = (x: Arr, y: Arr, wt: Arr | null): Table => (wt ? roundTable(crosstab(x, y, wt)) : crosstab(x, y));
const rowSum = (t: Table, row: number) => t.cells[t.rows.indexOf(row)].reduce((a, b) => a + b, 0);
const rowPct = (t: Table, row: number, colCode: number) => t.cells[t.rows.indexOf(row)][t.cols.indexOf(colCode)] / rowSum(t, row) * 100;
const colPct = (t: Table, colCode: number) => t.cells.reduce((a, row) => a + row[t.cols.indexOf(colCode)], 0) / t.n * 100;

/** Phi with sign for a 2 × 2 table, as mariposa::phi() prints it: (ad − bc) / √(row and column sums). */
function signedPhi(x: Arr, y: Arr, wt: Arr | null) {
  const [[a, b], [c, d]] = table(x, y, wt).cells;
  return (a * d - b * c) / Math.sqrt((a + b) * (c + d) * (a + c) * (b + d));
}

test('eastwest and wghtpew: counts, weighted sums, ranges, mean 1', { skip }, () => {
  const e = ew(), wt = w();
  const un = freq(e, null), we = freq(e, wt);
  assert.deepEqual([un.sums.get(1), un.sums.get(2), un.total], [EASTWEST.west.n, EASTWEST.east.n, EASTWEST.total]);
  assert.deepEqual([r(un.pct([1]), 2), r(un.pct([2]), 2)], [EASTWEST.west.pct, EASTWEST.east.pct]);
  assert.deepEqual([Math.round(we.sums.get(1)!), Math.round(we.sums.get(2)!)], [EASTWEST.west.wSum, EASTWEST.east.wSum]);
  assert.deepEqual([r(we.pct([1]), 2), r(we.pct([2]), 2)], [EASTWEST.west.wPct, EASTWEST.east.wPct]);
  const part = (code: number) => [...wt].filter((_, i) => e[i] === code);
  const west = part(1), east = part(2);
  // „zwischen 1,20 und 1,25“ bzw. „0,50 und 0,55“: auf zwei Stellen gerundet (1,2038 … 1,2524 und 0,5011 … 0,5446)
  assert.deepEqual([r(Math.min(...west), 2), r(Math.max(...west), 2)], [WGHTPEW.westFrom, WGHTPEW.westTo]);
  assert.equal(r(Math.min(...east), 2), WGHTPEW.eastFrom);
  assert.ok(Math.max(...east) > WGHTPEW.eastTo - 0.01 && Math.max(...east) < WGHTPEW.eastTo);
  assert.equal(new Set(west).size, WGHTPEW.valuesPerPart);
  assert.equal(new Set(east).size, WGHTPEW.valuesPerPart);
  assert.equal(r([...wt].reduce((a, b) => a + b, 0) / wt.length, 3), WGHTPEW.mean);
});

test('no denomination (rd01 = 6) by region: unweighted and weighted, mixing desk counts', { skip }, () => {
  const none = rec(col('rd01'), v => (v === 6 ? 1 : 0)), e = ew();
  const un = table(e, none, null), we = table(e, none, w());
  assert.equal(r(rowPct(un, 1, 1), 1), NONE.west.pct);
  assert.equal(r(rowPct(un, 2, 1), 1), NONE.east.pct);
  assert.equal(r(colPct(un, 1), 1), NONE.all.pct);
  assert.equal(r(colPct(we, 1), 1), NONE.all.wPct);
  assert.deepEqual([we.cells[0][1], rowSum(we, 1), we.cells[1][1], rowSum(we, 2)], [NONE.west.wNone, NONE.west.wN, NONE.east.wNone, NONE.east.wN]);
  assert.equal(r(rowPct(we, 1, 1), 1), NONE.wWestPct);
  assert.equal(r(rowPct(we, 2, 1), 1), NONE.wEastPct);
  // Ost-Anteil an allen mit gültiger Konfession: 32 % ohne, 16,8 % mit Gewicht
  assert.equal(Math.round(rowSum(un, 2) / un.n * 100), 32);
  assert.equal(r(rowSum(we, 2) / we.n * 100, 1), 16.8);
});

test('denomination in four groups by region; Phi and V weighted and unweighted', { skip }, () => {
  const rd = col('rd01'), e = ew(), wt = w();
  const konf = rec(rd, v => (v <= 2 ? 1 : v === 3 ? 2 : v <= 5 ? 3 : 4)), none = rec(rd, v => (v === 6 ? 1 : 0));
  const t = table(e, konf, wt);
  assert.deepEqual([1, 2, 3, 4].map(c => r(rowPct(t, 1, c), 1)), KONF.west);
  assert.deepEqual([1, 2, 3, 4].map(c => r(rowPct(t, 2, c), 1)), KONF.east);
  assert.equal(r(phi(e, none, wt), 2), KONF.phi.weighted);
  assert.equal(r(phi(e, none), 2), KONF.phi.unweighted);
  assert.equal(r(cramersV(e, konf, wt), 2), KONF.v.weighted);
  assert.equal(r(cramersV(e, konf), 2), KONF.v.unweighted);
});

test('ps03: Cum. % at code 3, unweighted and weighted, overall and by region; valid and missing', { skip }, () => {
  const ps = col('ps03'), e = ew(), wt = w();
  const v = load().byName.get('ps03')!;
  const split = [...v.valueLabels].find(([, l]) => l === 'TNZ: SPLIT')![0];
  assert.equal(v.values.filter(x => x === split).length, PS03.split);
  assert.equal(ps.filter(x => !Number.isFinite(x)).length, PS03.missing);
  const all = freq(ps, null), allW = freq(ps, wt);
  assert.deepEqual([all.total, Math.round(allW.total)], [PS03.valid, PS03.wValid]);
  assert.deepEqual([r(all.pct([1, 2, 3]), 2), r(allW.pct([1, 2, 3]), 2)], [PS03.cum3, PS03.wCum3]);
  for (const [code, part] of [[1, PS03.west], [2, PS03.east]] as const) {
    const x = only(ps, i => e[i] === code), un = freq(x, null), we = freq(x, wt);
    assert.deepEqual([r(un.pct([1, 2, 3]), 2), r(we.pct([1, 2, 3]), 2)], [part.cum3, part.wCum3], `eastwest ${code}`);
    assert.deepEqual([un.total, Math.round(we.total)], [part.valid, part.wValid], `eastwest ${code}`);
  }
  // Lösung A1: Ost-Anteil an den gültigen Antworten 32,5 % ohne, 16,9 % mit Gewicht
  assert.equal(r(PS03.east.valid / PS03.valid * 100, 1), 32.5);
  assert.equal(r(PS03.east.wValid / PS03.wValid * 100, 1), 16.9);
});

test('task 2: satisfied by vote intention (row %, weighted), group sizes, Cramér-V', { skip }, () => {
  const pv = col('pv01'), z = zufrieden(), wt = w();
  const t = table(pv, z, wt);
  for (const p of PARTIES) {
    assert.equal(r(rowPct(t, p.code, 1), 1), p.pct, p.label);
    assert.equal(rowSum(t, p.code), p.n, p.label);
  }
  assert.equal(r(colPct(t, 1), 1), A2.allPct);
  assert.equal(t.n, A2.nValid);
  assert.equal(r(cramersV(pv, z, wt), 4), A2.v);
  assert.equal(r(cramersV(pv, z), 3), A2.vUnweighted);
  assert.equal(r(cramersV(pv, col('ps03'), wt), 3), A2.vSixLevels);
  // Probier-Werkstatt: Landesteil × zufrieden; Phi mit Vorzeichen wie mariposa, V = Betrag
  const e = ew(), te = table(e, z, wt);
  assert.deepEqual([r(rowPct(te, 1, 1), 1), r(rowPct(te, 2, 1), 1)], [A2_TRY.west, A2_TRY.east]);
  assert.equal(r(signedPhi(e, z, wt), 3), A2_TRY.phi);
  assert.equal(r(cramersV(e, z, wt), 3), Math.abs(A2_TRY.phi));
  assert.equal(r(signedPhi(e, rec(col('ps03'), v => (v <= 3 ? 0 : 1)), wt), 3), -A2_TRY.phi);
});

test('foundation 3: layer and health, Gamma and Tau-b, health by layer, order of denominations', { skip }, () => {
  const hs = col('hs01'), id = col('id02'), wt = w();
  const health = rec(hs, v => 6 - v);
  assert.equal(r(gamma(health, id, wt), 3), HS_ID.gamma);
  assert.equal(r(gamma(hs, id, wt), 3), -HS_ID.gamma);
  assert.equal(r(tauB(health, id, wt), 3), HS_ID.tau);
  assert.equal(r(tauB(hs, id, wt), 3), -HS_ID.tau);
  assert.equal(Math.round(crosstab(hs, id, wt).n), HS_ID.nTau);
  const t = table(id, health, wt);
  LAYER_STACK.forEach((row, k) => {
    assert.deepEqual([1, 2, 3, 4, 5].map(c => r(rowPct(t, k + 1, c), 1)), row.pct, row.label);
    assert.equal(rowSum(t, k + 1), row.n, row.label);
  });
  const rd = col('rd01');
  const orders = [[1, 1, 2, 3, 3, 4], [2, 2, 3, 4, 4, 1], [4, 4, 1, 3, 3, 2]].map(o => rec(rd, v => o[v - 1]));
  assert.deepEqual(orders.map(k => r(gamma(k, health, wt), 2)), KONF_ORDER.gammas);
  for (const k of orders) assert.equal(r(cramersV(k, health, wt), 3), KONF_ORDER.v);
});

test('task 3: Gamma and Tau-b for satisfaction (reversed) and economy, weighted and unweighted', { skip }, () => {
  const zh = zufriedenheit(), ep = col('ep01'), wt = w();
  assert.equal(r(gamma(zh, ep, wt), 4), A3.gamma);
  assert.equal(r(tauB(zh, ep, wt), 3), A3.tau);
  assert.equal(r(gamma(zh, ep), 3), A3.gammaUnweighted);
  assert.equal(r(tauB(zh, ep), 3), A3.tauUnweighted);
  assert.equal(r(gamma(col('ps03'), ep, wt), 4), -A3.gamma);
  assert.equal(Math.round(crosstab(zh, ep, wt).n), A3.n);
  assert.equal(r(tauB(zh, col('ep03'), wt), 3), A3.tauEp03);
  const t = table(ep, zufrieden(), wt);
  assert.deepEqual([1, 2, 3, 4, 5].map(c => r(rowPct(t, c, 1), 1)), EP01_SATISFIED.map(s => s.pct));
  // Ü3: dieselben Daten, fünf Maße
  const five = { 'Cramér-V': cramersV(zh, ep, wt), 'Tau-b': tauB(zh, ep, wt), 'Spearman-ρ': spearman(zh, ep), 'Pearson-r': pearson(zh, ep, wt), Gamma: gamma(zh, ep, wt) };
  for (const m of FIVE) assert.equal(r(five[m.label as keyof typeof five], 2), m.value, m.label);
});

test('foundation 4: age and duration with and without outliers', { skip }, () => {
  const age = col('age'), xt = col('xt10'), wt = w();
  assert.equal(r(pearson(age, xt, wt), 3), AGE_XT10.rAll);
  assert.equal(r(spearman(age, xt), 3), AGE_XT10.rhoAll);
  assert.equal(r(spearman(age, xt, wt), 3), AGE_XT10.rhoAll);
  const cut = only(xt, i => xt[i] <= 180);
  assert.equal(r(pearson(age, cut, wt), 3), AGE_XT10.r180);
  assert.equal(r(spearman(age, cut), 3), AGE_XT10.rho180);
  const s = [...xt].filter(Number.isFinite).sort((a, b) => a - b);
  assert.equal((s[(s.length - 1) >> 1] + s[s.length >> 1]) / 2, AGE_XT10.median);
});

test('foundation 4c: internet, health and age groups (weighted)', { skip }, () => {
  const wt = w(), age = col('age');
  const healthy = rec(col('hs01'), v => (v <= 2 ? 1 : 0)), net = rec(col('xr19'), v => (v === 1 ? 1 : 0));
  const group = rec(age, v => (v <= 59 ? 1 : v <= 74 ? 2 : 3));
  const t = table(net, healthy, wt);
  assert.deepEqual([r(rowPct(t, 1, 1), 1), r(rowPct(t, 0, 1), 1)], [INTERNET.all.yes, INTERNET.all.no]);
  assert.equal(r(phi(net, healthy, wt), 2), INTERNET.all.phi);
  assert.equal(r(signedPhi(net, healthy, wt), 2), INTERNET.all.phi);
  assert.equal(t.n, INTERNET.valid);
  for (const [code, g] of [[2, INTERNET.mid], [3, INTERNET.old]] as const) {
    const n = only(net, i => group[i] === code), tg = table(n, healthy, wt);
    assert.deepEqual([r(rowPct(tg, 1, 1), 1), r(rowPct(tg, 0, 1), 1)], [g.yes, g.no], g.label);
    assert.deepEqual([rowSum(tg, 1), rowSum(tg, 0)], [g.nYes, g.nNo], g.label);
    assert.equal(r(phi(n, healthy, wt), 2), g.phi, g.label);
  }
  const young = table(only(net, i => group[i] === 1), healthy, wt);
  assert.equal(rowSum(young, 0), INTERNET.youngNo);
  const use = table(group, net, wt), hg = table(group, healthy, wt);
  assert.deepEqual([1, 2, 3].map(c => r(rowPct(use, c, 1), 1)), INTERNET.use);
  assert.deepEqual([1, 2, 3].map(c => r(rowPct(hg, c, 1), 1)), INTERNET.healthy);
});

test('task 4: Pearson-r and Spearman-ρ for life and democracy satisfaction, by region; left-right', { skip }, () => {
  const zh = zufriedenheit(), ls = col('ls01'), e = ew(), wt = w();
  assert.equal(r(pearson(zh, ls, wt), 3), A4.r);
  assert.equal(r(spearman(zh, ls), 3), A4.rho);
  assert.equal(r(pearson(zh, ls), 3), A4.rUnweighted);
  assert.equal(r(pearson(only(zh, i => e[i] === 1), ls, wt), 3), A4.west);
  assert.equal(r(pearson(only(zh, i => e[i] === 2), ls, wt), 3), A4.east);
  const pa = col('pa01');
  assert.equal(r(pearson(zh, pa, wt), 3), A4.pa01);
  assert.equal(r(pearson(only(zh, i => e[i] === 1), pa, wt), 3), A4.pa01West);
  assert.equal(r(pearson(only(zh, i => e[i] === 2), pa, wt), 3), A4.pa01East);
});

test('task 2: V comes from the weighted cells rounded to whole numbers, as in mariposa', { skip }, () => {
  // Rundung der gewichteten Zellen wie mariposa: ohne sie wiche V für A2 in der vierten Stelle ab
  const pv = col('pv01'), z = zufrieden(), wt = w();
  const raw = crosstab(pv, z, wt), rounded = roundTable(raw);
  const v = (t: Table) => Math.sqrt(chiSquare(t.cells).chi2 / t.n);
  assert.equal(r(v(rounded), 4), A2.v);
});
