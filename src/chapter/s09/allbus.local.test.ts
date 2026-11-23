// Läuft nur mit der eigenen GESIS-Datei: ALLBUS_SAV=/pfad/ZA8831_v1-3-0.sav node --import tsx --test src/chapter/s09/*.test.ts
// Prüft jede feste ALLBUS-Zahl von Sitzung 9 gegen ZA8831 v1.3.0, gewichtet mit wghtpew, so gerechnet wie mariposa 0.7.4:
// linear_regression() mit Frequenzgewichten (src/tasks/kit/ols.ts), describe() je Gruppe mit Nenner Σw − 1 und N = round(Σw),
// levene_test() als gewichtete ANOVA auf |x − Gruppenmittel|, crosstab() mit gerundeten gewichteten Zellen.
// rec(x, rules = "rev") polt die gültigen Codes um: ps03 (1 bis 6) → 7 − x, ep03 (1 bis 5) → 6 − x. Fehlende Codes sind NaN.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { isMissingCode, readSav, type SavFile } from '../../sandbox/readSav';
import { groupStats, levene, ols, type OlsFit } from '../../tasks/kit/ols';
import { A1_FIT, A2_FIT, A3_STAGES, A4_FIT, EP01_FIT, LAGE_CROSSTAB, LAGE_FIT, LAGE_STAGES, SUMMARY_LINES, SUMMARY_MORE_LINES } from './content';

const file = process.env.ALLBUS_SAV;
const skip = !file && 'ALLBUS_SAV nicht gesetzt';
let cached: SavFile | null = null;
const load = () => {
  if (cached) return cached;
  const bytes = readFileSync(file!);
  return (cached = readSav(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)));
};
/** Gültige Werte einer Variable, fehlende als NaN. */
const col = (name: string) => {
  const v = load().byName.get(name);
  assert.ok(v, name);
  return Float64Array.from(v.values, x => (isMissingCode(v, x) ? NaN : x));
};
const raw = (name: string) => load().byName.get(name)!.values;
const r3 = (x: number) => Math.round(x * 1000) / 1000;
const r2 = (x: number) => Math.round(x * 100) / 100;
const demo = () => col('ps03').map(x => 7 - x);
const lage = () => col('ep03').map(x => 6 - x);
const w = () => col('wghtpew');

/** Gewichteter Mittelwert und SD (Nenner Σw − 1) der Spalte j (0 = y) über die Fälle des Modells, wie „Descriptive Statistics“. */
function descriptive(fit: OlsFit, j: number) {
  const v = fit.y.map((y, i) => (j === 0 ? y : fit.X[i][j]));
  const mean = v.reduce((a, x, i) => a + fit.w[i] * x, 0) / fit.sumW;
  const sd = Math.sqrt(v.reduce((a, x, i) => a + fit.w[i] * (x - mean) ** 2, 0) / (fit.sumW - 1));
  return { mean: r3(mean), sd: r3(sd) };
}
/** Die gedruckten Zahlen eines Modells (drei Stellen wie summary()). */
const printed = (fit: OlsFit) => ({
  intercept: r3(fit.coef[0]), slope: r3(fit.coef[1]), beta: r3(fit.beta[1]), r2: r3(fit.r2), sigma: r3(fit.sigma), n: fit.nPrinted,
});

test('grundlagen: ls01 ~ lage, weighted, as in the output of summary() (Bild B0, R lesen)', { skip }, () => {
  const fit = ols(col('ls01'), [lage()], w());
  const p = printed(fit);
  assert.deepEqual([p.intercept, p.slope, p.beta, p.r2, p.sigma, p.n], [LAGE_FIT.intercept, LAGE_FIT.slope, LAGE_FIT.beta, LAGE_FIT.r2, LAGE_FIT.sigma, LAGE_FIT.n]);
  assert.equal(r3(Math.sqrt(fit.r2)), LAGE_FIT.r);
  assert.equal(r3(fit.adjR2), LAGE_FIT.adjR2);
  assert.equal(r2(fit.F), LAGE_FIT.F);
  assert.equal(Math.round(fit.dfResidual), LAGE_FIT.dfResidual);
  assert.deepEqual(descriptive(fit, 0), { mean: LAGE_FIT.meanY, sd: LAGE_FIT.sdY });
  assert.deepEqual(descriptive(fit, 1), { mean: LAGE_FIT.meanX, sd: LAGE_FIT.sdX });
  assert.deepEqual([r3(fit.ssRegression), r3(fit.ssResidual), r3(fit.ssTotal)], [LAGE_FIT.ssRegression, LAGE_FIT.ssResidual, LAGE_FIT.ssTotal]);
  // standard errors, t and the confidence interval as printed in B0
  assert.deepEqual([r3(fit.se[0]), r3(fit.t[0]), r3(fit.ciLower[0]), r3(fit.ciUpper[0])], [0.109, 32.839, 3.357, 3.783]);
  assert.deepEqual([r3(fit.se[1]), r3(fit.t[1]), r3(fit.ciLower[1]), r3(fit.ciUpper[1])], [0.030, 36.115, 1.015, 1.131]);
  assert.equal(r3(fit.F), 1304.291);
  assert.equal(r3(fit.ssResidual / fit.dfResidual), 2.959);
  // every number in the output lines of B0 is one of these
  const out = [...SUMMARY_LINES, ...SUMMARY_MORE_LINES].join('\n');
  for (const s of ['7.398', '1.926', '3.568', '0.808', '0.450', '0.203', '1.720', '3.570', '1.073', '5133', '3858.902', '15182.029', '19040.931', '1304.291', '2.959', '5131', '5132']) {
    assert.ok(out.includes(s), s);
  }
});

test('grundlagen: crosstab cells, stage means, SD and N per stage, distance of the means to the line', { skip }, () => {
  const ls = col('ls01'), lg = lage(), ww = w();
  const cells = Array.from({ length: 11 }, () => Array(5).fill(0));
  for (let i = 0; i < ls.length; i++) if (Number.isFinite(ls[i]) && Number.isFinite(lg[i]) && Number.isFinite(ww[i])) cells[ls[i]][lg[i] - 1] += ww[i];
  assert.deepEqual(cells.map(row => row.map(Math.round)), LAGE_CROSSTAB);
  const keep = Float64Array.from(ls, (x, i) => (Number.isFinite(lg[i]) ? x : NaN));
  const stages = groupStats(keep, lg, ww);
  assert.deepEqual(stages.map(s => s.value), [1, 2, 3, 4, 5]);
  assert.deepEqual(stages.map(s => r3(s.mean)), LAGE_STAGES.mean);
  assert.deepEqual(stages.map(s => r3(s.sd)), LAGE_STAGES.sd);
  assert.deepEqual(stages.map(s => Math.round(s.sumW)), LAGE_STAGES.n);
  const fit = ols(ls, [lg], ww);
  assert.deepEqual(stages.map(s => r3(s.mean - (fit.coef[0] + fit.coef[1] * s.value))), LAGE_FIT.deviations);
  // Levene on ls01 − (3.570 + 1.073 × lage): F(4, 5128.5) = 67.176
  const rest = Float64Array.from(keep, (x, i) => x - (3.570 + 1.073 * lg[i]));
  const lv = levene(rest, lg, ww);
  assert.deepEqual([r3(lv.F), lv.df1, Math.round(lv.df2 * 10) / 10], [LAGE_FIT.levene.F, LAGE_FIT.levene.df1, LAGE_FIT.levene.df2]);
  assert.ok(lv.p < 0.001);
});

test('task 1: demo ~ pt03 and the variants behind the special feedback', { skip }, () => {
  const fit = ols(demo(), [col('pt03')], w());
  const p = printed(fit);
  assert.deepEqual([p.intercept, p.slope, p.beta, p.r2, p.sigma, p.n], [A1_FIT.intercept, A1_FIT.slope, A1_FIT.beta, A1_FIT.r2, A1_FIT.sigma, A1_FIT.n]);
  assert.equal(r3(Math.sqrt(fit.r2)), A1_FIT.r);
  assert.deepEqual([r3(fit.se[0]), r3(fit.se[1])], [A1_FIT.seIntercept, A1_FIT.seSlope]);
  assert.deepEqual(descriptive(fit, 0), { mean: A1_FIT.meanDemo, sd: A1_FIT.sdDemo });
  assert.equal(descriptive(fit, 1).sd, A1_FIT.sdPt03);
  assert.equal(r3(fit.ssResidual / fit.dfResidual), A1_FIT.msResidual);
  assert.equal(r3(fit.coef[0] + 7 * fit.coef[1]), A1_FIT.predict7Exact);
  const unweighted = ols(demo(), [col('pt03')]);
  assert.deepEqual([r3(unweighted.coef[0]), r3(unweighted.coef[1])], [A1_FIT.unweighted.intercept, A1_FIT.unweighted.slope]);
  const orig = ols(col('ps03'), [col('pt03')], w());
  assert.deepEqual([r3(orig.coef[0]), r3(orig.coef[1])], [A1_FIT.notReversed.intercept, A1_FIT.notReversed.slope]);
  const swapped = ols(col('pt03'), [demo()], w());
  assert.deepEqual([r3(swapped.coef[0]), r3(swapped.coef[1]), r3(swapped.r2)], [A1_FIT.swapped.intercept, A1_FIT.swapped.slope, A1_FIT.r2]);
  // TNZ: SPLIT (-11) for ps03 and pt03, all respondents
  assert.equal(raw('ps03').filter(x => x === -11).length, A1_FIT.split);
  assert.equal(raw('pt03').filter(x => x === -11).length, A1_FIT.split);
  assert.equal(load().nCases, A1_FIT.all);
});

test('task 2: demo ~ id02, the spread of id02 and the share of the middle classes; try-out ep01', { skip }, () => {
  const fit = ols(demo(), [col('id02')], w());
  const p = printed(fit);
  assert.deepEqual([p.intercept, p.slope, p.beta, p.r2, p.sigma, p.n], [A2_FIT.intercept, A2_FIT.slope, A2_FIT.beta, A2_FIT.r2, A2_FIT.sigma, A2_FIT.n]);
  assert.equal(r3(Math.sqrt(fit.r2)), A2_FIT.r);
  assert.equal(descriptive(fit, 1).sd, A2_FIT.sdId02);
  // frequency(id02, weights = wghtpew) after drop_na(demo, id02): ARBEITERSCHICHT 22,17 %, MITTELSCHICHT 55,98 %
  const share = (code: number) => fit.X.reduce((a, row, i) => a + (row[1] === code ? fit.w[i] : 0), 0) / fit.sumW * 100;
  assert.deepEqual([r2(share(2)), r2(share(3))], [22.17, 55.98]);
  assert.equal(Math.round(share(2) + share(3)), A2_FIT.middle);
  assert.equal(r3(Math.round(0.346 / 0.06 * 10) / 10), 5.8);
  const ep = ols(demo(), [col('ep01')], w());
  assert.deepEqual([r3(ep.coef[1]), r3(ep.r2), ep.nPrinted], [EP01_FIT.slope, EP01_FIT.r2, EP01_FIT.n]);
});

test('task 3: residual per stage of pt03 (with 2.288 / 0.465 and with the untouched 3.570 / 1.073) and Levene', { skip }, () => {
  const d = demo(), pt = col('pt03'), ww = w();
  const resid = (a: number, b: number) => Float64Array.from(d, (y, i) => y - (a + b * pt[i]));
  const solved = groupStats(resid(2.288, 0.465), pt, ww);
  assert.deepEqual(solved.map(s => s.value), [1, 2, 3, 4, 5, 6, 7]);
  assert.deepEqual(solved.map(s => r3(s.mean)), A3_STAGES.mean);
  assert.deepEqual(solved.map(s => r3(s.sd)), A3_STAGES.sd);
  assert.deepEqual(solved.map(s => Math.round(s.sumW)), A3_STAGES.n);
  const untouched = groupStats(resid(3.570, 1.073), pt, ww);
  assert.deepEqual([1, 6, 7].map(k => r3(untouched[k - 1].mean)), [A3_STAGES.meanUntouched[1], A3_STAGES.meanUntouched[6], A3_STAGES.meanUntouched[7]]);
  assert.deepEqual(untouched.map(s => r3(s.sd)), A3_STAGES.sd, 'SD does not depend on the line');
  const demoStages = groupStats(d, pt, ww);
  assert.equal(r3(demoStages[6].mean), A3_STAGES.demo7);
  const lv = levene(resid(2.288, 0.465), pt, ww);
  assert.deepEqual([r2(lv.F), lv.df1, Math.round(lv.df2 * 10) / 10], [A3_STAGES.levene.F, A3_STAGES.levene.df1, A3_STAGES.levene.df2]);
  assert.equal(r3(lv.F), 74.86);
  assert.ok(lv.p < 0.001);
  // unweighted counts in the plan (information): 362 in stage 1, 155 in stage 7
  assert.deepEqual([solved[0].n, solved[6].n], [362, 155]);
});

test('task 4: demo ~ pa01 and the means per stage of pa01', { skip }, () => {
  const fit = ols(demo(), [col('pa01')], w());
  const p = printed(fit);
  assert.deepEqual([p.intercept, p.slope, p.beta, p.r2, p.n], [A4_FIT.intercept, A4_FIT.slope, A4_FIT.beta, A4_FIT.r2, A4_FIT.nModel]);
  const stages = groupStats(demo(), col('pa01'), w());
  assert.deepEqual(stages.map(s => s.value), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  assert.deepEqual(stages.map(s => r3(s.mean)), A4_FIT.mean);
  assert.equal(r3(stages[0].sd), A4_FIT.sd1);
  assert.deepEqual(stages.map(s => Math.round(s.sumW)), A4_FIT.nStage);
});
