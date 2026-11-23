import test from 'node:test';
import assert from 'node:assert/strict';
import { fakeSav, fixtureSav } from '../../sandbox/testData';
import { tTest } from '../kit/means';
import { validValues } from '../kit/stats';
import {
  CLOUD_SHIFT_MAX, CLOUD_START, clampShift, cloudChanged, cloudDraw, cloudN, cloudOutside, cloudPopulation, cloudSample, cloudShape, cloudShiftRange, cloudTest, cloudTrueDiff,
  type CloudPopulation,
} from './domain';

const sorted = (x: number[]) => [...x].sort((a, b) => a - b);
const mean = (x: number[]) => x.reduce((a, b) => a + b, 0) / x.length;
const sd = (x: number[]) => { const m = mean(x); return Math.sqrt(x.reduce((a, b) => a + (b - m) ** 2, 0) / (x.length - 1)); };
const close = (a: number, b: number, eps = 1e-9) => assert.ok(Math.abs(a - b) < eps, `${a} ≠ ${b}`);
/** Größere künstliche Gruppen für die Mechanik: Codes 0 bis 10, West etwas zufriedener. */
const synthetic = (): CloudPopulation => {
  const west = Array.from({ length: 2000 }, (_, i) => (i * 7) % 11), east = Array.from({ length: 1500 }, (_, i) => (i * 5) % 10);
  return { values: [west, east], centers: [mean(west), mean(east)] };
};

test('einstieg: population = valid ls01 per eastwest group, missing values and other codes dropped', () => {
  const sav = fakeSav({
    ls01: { values: [7, 8, -9, 5, 10, 3, 6, -42], missingFrom: -1 },
    eastwest: { values: [1, 1, 1, 2, 2, 2, 3, 1] },
  });
  const pop = cloudPopulation(sav)!;
  assert.deepEqual(pop.values, [[7, 8], [5, 10, 3]]);
  assert.deepEqual(pop.centers, [7.5, 6]);
  // fehlt eine Variable oder hat eine Gruppe weniger als zwei Befragte: kein Einstieg
  assert.equal(cloudPopulation(fakeSav({ ls01: { values: [1, 2, 3] } })), null);
  assert.equal(cloudPopulation(fakeSav({ ls01: { values: [1, 2, 3] }, eastwest: { values: [1, 1, 2] } })), null);
});

test('einstieg: samples are drawn without replacement, reproducible per seed, capped at the group size', () => {
  const pop = synthetic();
  const a = cloudSample(pop, 30, 1), b = cloudSample(pop, 30, 1), c = cloudSample(pop, 30, 2);
  assert.deepEqual(a, b);
  assert.notDeepEqual(a, c);
  assert.deepEqual(a.map(x => x.length), [30, 30]);
  // ohne Zurücklegen: jede Ziehung ist eine Teilmenge (als Multimenge) der Gruppe
  for (const k of [0, 1]) {
    const left = new Map<number, number>();
    for (const v of pop.values[k]) left.set(v, (left.get(v) ?? 0) + 1);
    for (const v of cloudSample(pop, 1000, 5)[k]) { assert.ok((left.get(v) ?? 0) > 0); left.set(v, left.get(v)! - 1); }
  }
  // 'alle' = alle Befragten, nur gemischt; zu große Gruppengröße wird gekappt
  const all = cloudSample(pop, 'alle', 3);
  assert.deepEqual(all.map(sorted), pop.values.map(sorted));
  const small: CloudPopulation = { values: [[1, 2, 3], [4, 5]], centers: [2, 4.5] };
  assert.deepEqual(cloudN(small, 10), [3, 2]);
  assert.deepEqual(cloudSample(small, 10, 1).map(sorted), [[1, 2, 3], [4, 5]]);
  assert.deepEqual(cloudN(pop, 'alle'), [2000, 1500]);
});

test('einstieg: shift moves the mean, spread stretches the distances to the group mean', () => {
  const x = [2, 4, 6, 8, 10], c = 6;
  assert.deepEqual(cloudShape(x, c, 1, 0), x);
  close(mean(cloudShape(x, c, 1, 1.5)), mean(x) + 1.5);
  close(sd(cloudShape(x, c, 0.5, 0)), sd(x) * 0.5);
  close(sd(cloudShape(x, c, 1.5, -1)), sd(x) * 1.5);
  // gestreckt wird um den Mittelwert aller Befragten der Gruppe: der bleibt stehen
  assert.deepEqual(cloudShape([c], c, 1.5, 0), [c]);
  // Grenzen: höchstens ±2,5, der Mittelwert bleibt auf der Skala 0 bis 10, Schritte von 0,05
  assert.deepEqual(cloudShiftRange(7.4), [-CLOUD_SHIFT_MAX, CLOUD_SHIFT_MAX]);
  assert.deepEqual(cloudShiftRange(9).map(v => Math.round(v * 100) / 100), [-2.5, 1]);
  assert.equal(clampShift(9, 3), 1);
  assert.equal(clampShift(5, -9), -2.5);
  assert.equal(clampShift(5, 0.4321), 0.45);
  assert.ok(Object.is(clampShift(5, -0.01), 0));
  assert.deepEqual(cloudOutside([-3, -2, 0, 12, 12.5, 13]), [1, 2]);
  assert.equal(cloudChanged(CLOUD_START), false);
  assert.equal(cloudChanged({ ...CLOUD_START, size: 'alle' }), false);
  assert.equal(cloudChanged({ ...CLOUD_START, spread: 0.5 }), true);
  assert.equal(cloudChanged({ ...CLOUD_START, shift: [0, 0.1] }), true);
});

test('einstieg: the t-test is Welch, West − Ost, like t.test() in R', () => {
  // R: t.test(c(7, 8, 9, 6, 10), c(5, 6, 7, 8, 4, 6)) → t = 2.19089, df = 8.19672, p = 0.059043, KI −0.096322 bis 4.096322, SE 0.912871
  const r = cloudTest([7, 8, 9, 6, 10], [5, 6, 7, 8, 4, 6])!;
  close(r.t, 2.19089023, 1e-7);
  close(r.df, 8.196721311, 1e-8);
  close(r.p, 0.05904292106, 1e-9);
  close(r.ci[0], -0.09632244038, 1e-9);
  close(r.ci[1], 4.09632244038, 1e-9);
  close(r.se, 0.9128709292, 1e-9);
  assert.deepEqual(r.n, [5, 6]);
  close(r.diff, 8 - 6);
  // umgekehrt eingegeben: gleiches |t|, anderes Vorzeichen
  close(cloudTest([5, 6, 7, 8, 4, 6], [7, 8, 9, 6, 10])!.t, -r.t);
  assert.equal(cloudTest([1], [2, 3]), null);
  assert.equal(cloudTest([4, 4, 4], [4, 4, 4]), null);
});

test('einstieg: the mechanics – difference on top, standard error from spread and size below', () => {
  const pop = synthetic(), seed = 4;
  const base = cloudDraw(pop, { size: 100, spread: 1, shift: [0, 0] }, seed).result!;
  // Verschieben ändert nur den Zähler: gleiche Befragte, gleicher Standardfehler, Unterschied um die Verschiebung größer
  const moved = cloudDraw(pop, { size: 100, spread: 1, shift: [1, -0.5] }, seed).result!;
  close(moved.se, base.se);
  close(moved.diff, base.diff + 1.5);
  close(moved.t, (base.diff + 1.5) / base.se);
  close(cloudTrueDiff(pop, { size: 100, spread: 1, shift: [1, -0.5] }), pop.centers[0] - pop.centers[1] + 1.5);
  // Streuung ändert den Nenner: Standardfehler wächst genau mit dem Faktor
  close(cloudDraw(pop, { size: 100, spread: 0.5, shift: [0, 0] }, seed).result!.se, base.se * 0.5);
  close(cloudDraw(pop, { size: 100, spread: 1.5, shift: [0, 0] }, seed).result!.se, base.se * 1.5);
  // mehr Befragte: kleinerer Standardfehler, engeres Intervall
  const big = cloudDraw(pop, { size: 1000, spread: 1, shift: [0, 0] }, seed).result!;
  assert.ok(big.se < base.se / 2);
  assert.ok(big.ci[1] - big.ci[0] < (base.ci[1] - base.ci[0]) / 2);
  // dieselbe Ziehung bleibt dieselbe, eine neue Ziehung springt
  assert.deepEqual(cloudDraw(pop, CLOUD_START, 9), cloudDraw(pop, CLOUD_START, 9));
  assert.notEqual(cloudDraw(pop, CLOUD_START, 9).result!.t, cloudDraw(pop, CLOUD_START, 10).result!.t);
});

test('einstieg on the fixture: with all respondents and unchanged values it is t_test(ls01, group = eastwest)', () => {
  const sav = fixtureSav(), pop = cloudPopulation(sav)!;
  const ls = validValues(sav.byName.get('ls01')!), ew = validValues(sav.byName.get('eastwest')!);
  const ref = tTest(ls, Float64Array.from(ew, v => (v === 1 || v === 2 ? v : NaN)))!;
  assert.deepEqual(pop.values.map(v => v.length), ref.levels[0] === 1 ? ref.n : [ref.n[1], ref.n[0]]);
  const r = cloudDraw(pop, { ...CLOUD_START, size: 'alle' }, 1).result!;
  const sign = ref.levels[0] === 1 ? 1 : -1;
  close(r.t, sign * ref.welch.t);
  close(r.df, ref.welch.df);
  close(r.p, ref.welch.p);
  close(r.diff, sign * ref.diff);
});
