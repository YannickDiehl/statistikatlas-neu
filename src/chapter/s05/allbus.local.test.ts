// Läuft nur mit der eigenen GESIS-Datei: ALLBUS_SAV=/pfad/ZA8831_v1-3-0.sav node --import tsx --test src/chapter/s05/*.test.ts
// Prüft jede feste Zahl von Sitzung 5 gegen ZA8831 v1.3.0. rec() ist hier nachgebaut wie in mariposa: fehlende Codes sind leer (NA),
// else=NA lässt alles andere leer, else=0 macht auch fehlende Werte zu 0. Prozent wie crosstab() mit einer Nachkommastelle;
// gewichtet rundet crosstab() die Zellen vorher auf ganze Zahlen (roundTable, geprüft gegen mariposa 0.7.4).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { readSav, type SavFile } from '../../sandbox/readSav';
import { chiSquare, crosstab, roundTable, validValues, type Table } from '../../tasks/kit/stats';
import {
  ALLBUS_DIM, CHI, CUTS, EAST_WEST, EP01, MISSTRAUEN, MISS_NW, NICHTWAHL, PA35, PE01, PE01_WITH_VOTE, PE05_NW, PE05_UM, SEX_TEILZEIT,
  TEILZEIT, WEIGHTED, WORK,
} from './content';

const file = process.env.ALLBUS_SAV;
const skip = !file && 'ALLBUS_SAV nicht gesetzt';
let cached: SavFile | null = null;
const load = () => {
  if (cached) return cached;
  const bytes = readFileSync(file!);
  return (cached = readSav(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)));
};
const raw = (name: string) => { const v = load().byName.get(name); assert.ok(v, name); return v; };
/** Werte wie nach read_spss(): fehlende Codes sind NaN. */
const col = (name: string) => validValues(raw(name));
const countCode = (name: string, code: number) => raw(name).values.filter(x => x === code).length;

type Rule = [(x: number) => boolean, number];
/** rec(x, rules = "…; else=…") nachgebaut; `otherwise` null heißt else=NA. */
function rec(xs: Float64Array, rules: Rule[], otherwise: number | null = null): Float64Array {
  return Float64Array.from(xs, x => {
    if (Number.isFinite(x)) for (const [hit, to] of rules) if (hit(x)) return to;
    return otherwise ?? NaN;
  });
}
const between = (a: number, b: number) => (x: number) => x >= a && x <= b;
const is = (a: number) => (x: number) => x === a;
const freq = (xs: Float64Array, codes: number[]) => codes.map(c => xs.filter(x => x === c).length);
const valid = (xs: Float64Array) => xs.filter(Number.isFinite).length;
const mean = (xs: Float64Array) => { const v = xs.filter(Number.isFinite); return v.reduce((a, b) => a + b, 0) / v.length; };
const r1 = (x: number) => Math.round(x * 10) / 10;
const r2 = (x: number) => Math.round(x * 100) / 100;
const rowPct = (t: Table, i: number, j: number) => r1(t.cells[i][j] / t.cells[i].reduce((a, b) => a + b, 0) * 100);
const colPct = (t: Table, i: number, j: number) => r1(t.cells[i][j] / t.cells.reduce((a, r) => a + r[j], 0) * 100);

const misstrauen = () => rec(col('pe01'), [[between(1, 2), 1], [between(3, 4), 0]]);
const nichtwahl = () => rec(col('pv01'), [[is(91), 1], [between(1, 90), 0]]);
const teilzeit = () => rec(col('work'), [[between(2, 3), 1], [is(1), 0]]);
const pe05um = () => Float64Array.from(col('pe05'), x => (Number.isFinite(x) ? 5 - x : NaN));

test('allbus: 5,246 × 579', { skip }, () => {
  assert.equal(load().nCases, ALLBUS_DIM.rows);
  assert.equal(load().variables.length, ALLBUS_DIM.cols);
});

test('work and teilzeit: counts, missing, mean of the dummy', { skip }, () => {
  const w = col('work');
  assert.deepEqual(freq(w, [1, 2, 3, 4]), WORK.slice(0, 4).map(x => x.n));
  assert.equal(w.length - valid(w), WORK[4].n);
  const t = teilzeit();
  assert.deepEqual(freq(t, [0, 1]), [TEILZEIT.vollzeit, TEILZEIT.teilzeit]);
  assert.equal(valid(t), TEILZEIT.valid);
  assert.equal(t.length - valid(t), TEILZEIT.system);
  assert.deepEqual([r2(TEILZEIT.vollzeit / TEILZEIT.valid * 100), r2(TEILZEIT.teilzeit / TEILZEIT.valid * 100)], TEILZEIT.validPct);
  assert.equal(r2(mean(t)), TEILZEIT.mean);
});

test('cutting groups: every named cut computed from the file, with else=0 for missing values (cut E)', { skip }, () => {
  const w = col('work');
  const groupOf = (x: number) => (Number.isFinite(x) ? x - 1 : 4); // Zeile in WORK
  for (const c of CUTS) {
    let n1 = 0, n0 = 0;
    for (const x of w) { const g = c.groups[groupOf(x)]; if (g === '1') n1++; else if (g === '0') n0++; }
    assert.equal(r1(n1 / (n1 + n0) * 100), c.share, c.id);
  }
  // E ist genau rec(work, "2:3=1; else=0")
  const e = rec(w, [[between(2, 3), 1]], 0);
  assert.equal(r1(mean(e) * 100), CUTS.find(c => c.id === 'E')!.share);
});

test('sex × teilzeit: cells and missing; weighted row percent', { skip }, () => {
  const t = crosstab(col('sex'), teilzeit());
  assert.deepEqual(t.rows, [1, 2, 3]);
  assert.deepEqual(t.cols, [0, 1]);
  assert.deepEqual(t.cells, SEX_TEILZEIT.cells);
  assert.equal(ALLBUS_DIM.rows - t.n, SEX_TEILZEIT.missing);
  const w = roundTable(crosstab(col('sex'), teilzeit(), col('wghtpew')));
  assert.deepEqual([rowPct(w, 1, 1), rowPct(w, 0, 1)], [WEIGHTED.womenPart, WEIGHTED.menPart]);
});

test('pe01, misstrauen (solved and placeholder), nichtwahl', { skip }, () => {
  const p = col('pe01');
  assert.deepEqual(freq(p, [1, 2, 3, 4]), PE01.counts);
  assert.equal(valid(p), PE01.valid);
  assert.equal(p.length - valid(p), PE01.missing);
  assert.equal(countCode('pe01', -11), PE01.split);
  assert.deepEqual(PE01.labels, [1, 2, 3, 4].map(c => raw('pe01').valueLabels.get(c)));
  const m = misstrauen();
  assert.deepEqual(freq(m, [1, 0]), [MISSTRAUEN.yes, MISSTRAUEN.no]);
  assert.equal(m.length - valid(m), MISSTRAUEN.system);
  assert.equal(r2(mean(m)), MISSTRAUEN.mean);
  const ph = rec(p, [[is(1), 1], [between(2, 4), 0]]);
  assert.deepEqual(freq(ph, [1, 0]), [MISSTRAUEN.placeholderYes, MISSTRAUEN.placeholderNo]);
  const n = nichtwahl();
  assert.deepEqual(freq(n, [1, 0]), [NICHTWAHL.yes, NICHTWAHL.no]);
  assert.equal(n.length - valid(n), NICHTWAHL.system);
  assert.equal(r2(mean(n)), NICHTWAHL.mean);
  assert.equal(countCode('pv01', -50), NICHTWAHL.notEligible);
  assert.equal(countCode('pv01', -8), NICHTWAHL.dontKnow);
  // drop_na(nichtwahl) %>% frequency(pe01)
  const keep = p.filter((_, i) => Number.isFinite(n[i]));
  assert.equal(keep.length, PE01_WITH_VOTE.total);
  assert.equal(valid(keep), PE01_WITH_VOTE.valid);
  assert.deepEqual(freq(keep, [1, 2, 3, 4]).map(c => r2(c / PE01_WITH_VOTE.valid * 100)), PE01_WITH_VOTE.validPct);
});

test('misstrauen × nichtwahl: cells, missing, chi-square, Cramér V, smallest expected count, weighted col percent', { skip }, () => {
  const t = crosstab(misstrauen(), nichtwahl());
  assert.deepEqual(t.cells, MISS_NW.cells);
  assert.equal(ALLBUS_DIM.rows - t.n, MISS_NW.missing);
  const { chi2, df, n } = chiSquare(t.cells);
  assert.deepEqual([Math.round(chi2 * 1000) / 1000, df, n], [CHI.chi2, CHI.df, CHI.n]);
  assert.ok(chi2 > 10.828, 'p < 0.001');
  assert.equal(Math.round(Math.sqrt(chi2 / n) * 1000) / 1000, CHI.v);
  const w = crosstab(misstrauen(), nichtwahl(), col('wghtpew'));
  // crosstab(…, weights = wghtpew) rundet die gewichteten Zellen erst auf ganze Zahlen (123 von 142); ungerundet wären es 86,5.
  assert.equal(colPct(roundTable(w), 1, 1), WEIGHTED.col87);
  assert.equal(colPct(w, 1, 1), 86.5);
});

test('ep01 and pe05: counts, mean before and after reversing, labels after rev', { skip }, () => {
  const e = col('ep01');
  assert.deepEqual(freq(e, [1, 2, 3, 4, 5]), EP01.counts);
  assert.equal(valid(e), EP01.n);
  assert.equal(r2(mean(e)), EP01.mean);
  assert.equal(r2(6 - mean(e)), EP01.meanRev);
  assert.deepEqual(EP01.labels, [1, 2, 3, 4, 5].map(c => raw('ep01').valueLabels.get(c)));
  const u = pe05um();
  assert.deepEqual(freq(u, [1, 2, 3, 4]), PE05_UM.counts);
  // rev: the word of old code 5 − k sits at new code k
  assert.deepEqual(PE05_UM.labels, [1, 2, 3, 4].map(k => raw('pe05').valueLabels.get(5 - k)));
  assert.equal(countCode('pe05', -11), PE05_UM.split);
});

test('task 4: solved, placeholder and without reversing', { skip }, () => {
  const u = pe05um(), nw = nichtwahl();
  const solved = crosstab(rec(u, [[between(1, 2), 1], [between(3, 4), 0]]), nw);
  assert.deepEqual([rowPct(solved, 0, 1), rowPct(solved, 1, 1)], [PE05_NW.solved.no.pct, PE05_NW.solved.yes.pct]);
  assert.deepEqual(solved.cells.map(r => r[0] + r[1]), [PE05_NW.solved.no.n, PE05_NW.solved.yes.n]);
  assert.equal(solved.cells[1][1], PE05_NW.solved.yes.count);
  assert.equal(solved.n, PE05_NW.solved.valid);
  const ph = crosstab(rec(u, [[is(1), 1], [between(2, 4), 0]]), nw);
  assert.deepEqual([rowPct(ph, 0, 1), rowPct(ph, 1, 1)], [PE05_NW.placeholder.no, PE05_NW.placeholder.yes]);
  const without = crosstab(rec(col('pe05'), [[between(1, 2), 1], [between(3, 4), 0]]), nw);
  assert.deepEqual([rowPct(without, 0, 1), rowPct(without, 1, 1)], [PE05_NW.without.no, PE05_NW.without.yes]);
});

test('try-out workshops: east and west, pa35 with two rules', { skip }, () => {
  const ew = crosstab(col('eastwest'), misstrauen());
  assert.deepEqual([rowPct(ew, 0, 1), rowPct(ew, 1, 1)], [EAST_WEST.west, EAST_WEST.east]);
  const nw = nichtwahl(), pa = col('pa35');
  const two = crosstab(rec(pa, [[between(1, 2), 1], [between(3, 5), 0]]), nw);
  assert.deepEqual([rowPct(two, 1, 1), rowPct(two, 0, 1)], [PA35.split2.yes, PA35.split2.no]);
  const three = crosstab(rec(pa, [[between(1, 3), 1], [between(4, 5), 0]]), nw);
  assert.deepEqual([rowPct(three, 1, 1), rowPct(three, 0, 1)], [PA35.split3.yes, PA35.split3.no]);
});
