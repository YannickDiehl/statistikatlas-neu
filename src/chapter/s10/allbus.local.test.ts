// Läuft nur mit der eigenen GESIS-Datei: ALLBUS_SAV=/pfad/ZA8831_v1-3-0.sav node --import tsx --test src/chapter/s10/*.test.ts
// Prüft jede feste Zahl von Sitzung 10 gegen ZA8831 v1.3.0, gewichtet mit wghtpew, so wie mariposa 0.7.4 rechnet
// (Frequenzgewichte wie SPSS WEIGHT BY, listwise; Nachbau in src/tasks/kit/ols.ts, dort gegen mariposa getestet).
// `rec(x, rules = "rev")` polt die gültigen Codes um: bei 1 bis k wird x zu k + 1 − x.
// Nicht aus der Datei prüfbar sind die konstruierten Beispiele: die Würfel in Karte 3b (set.seed(107) in R, die Zahlen
// stehen geprüft in sitzung10-zahlen.R; content.test.ts prüft die Formel des korrigierten R²) und die zwölf Punkte
// in Karte 4a (content.test.ts rechnet sie nach).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { isMissingCode, readSav, type SavFile } from '../../sandbox/readSav';
import { ols, type OlsFit } from '../../tasks/kit/ols';
import {
  A1, A2, A3, A4, B1, COLLINEAR, INTERACTION, MARRIED, MODEL_AG, MODEL_AGE_ONLY, MSTAT_1_FREQ, MSTAT_AS_NUMBER,
  MSTAT_PREDICTIONS, MSTAT_R2, MSTAT_WEIGHTED, PS03_SPLIT, REFERENCES,
} from './content';

const file = process.env.ALLBUS_SAV;
const skip = !file && 'ALLBUS_SAV nicht gesetzt';
let cached: SavFile | null = null;
const load = () => {
  if (cached) return cached;
  const bytes = readFileSync(file!);
  return (cached = readSav(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)));
};

/** Valid values of a variable, NaN for every missing code. */
const col = (name: string): number[] => {
  const v = load().byName.get(name);
  assert.ok(v, name);
  return Array.from(v.values, x => (isMissingCode(v, x) ? NaN : x));
};
const rev = (xs: number[], k: number) => xs.map(x => k + 1 - x);
const map = (xs: number[], f: (x: number) => number) => xs.map(x => (Number.isFinite(x) ? f(x) : NaN));
const r = (x: number, d = 3) => Math.round(x * 10 ** d) / 10 ** d;
/** Sig. as mariposa prints it: „.153“, „<.001“. */
const sig = (p: number) => (p < 0.001 ? '<.001' : p.toFixed(3).replace(/^0/, ''));

/** Weighted VIF of predictor j as mariposa reports it: 1 / (1 − R²) of x_j on the other predictors, same cases and weights. */
function vif(fit: OlsFit, j: number): number {
  const xs = fit.X[0].slice(1).map((_, k) => fit.X.map(row => row[k + 1]));
  const others = xs.filter((_, k) => k !== j);
  return 1 / (1 - ols(xs[j], others, fit.w).r2);
}
const term = (fit: OlsFit, name: string) => {
  const j = fit.terms.indexOf(name);
  assert.ok(j >= 0, name);
  return { b: fit.coef[j], se: fit.se[j], beta: fit.beta[j], t: fit.t[j], p: fit.p[j], lower: fit.ciLower[j], upper: fit.ciUpper[j], vif: () => vif(fit, j - 1) };
};
/** Weighted mean and SD (denominator Σw − 1) as in mariposa's Descriptive Statistics. */
function desc(x: number[], w: number[]) {
  const sw = w.reduce((a, b) => a + b, 0);
  const m = x.reduce((a, v, i) => a + w[i] * v, 0) / sw;
  return { mean: m, sd: Math.sqrt(x.reduce((a, v, i) => a + w[i] * (v - m) ** 2, 0) / (sw - 1)) };
}
const wmean = (x: number[], w: number[], keep: (i: number) => boolean) => {
  let s = 0, sw = 0;
  x.forEach((v, i) => { if (keep(i) && Number.isFinite(v) && Number.isFinite(w[i])) { s += w[i] * v; sw += w[i]; } });
  return { mean: s / sw, sumW: sw };
};

const data = () => {
  const w = col('wghtpew');
  const ls01 = col('ls01'), age = col('age'), hs01 = col('hs01'), mstat = col('mstat'), agec = col('agec'), work = col('work');
  const demo = rev(col('ps03'), 6), lage = rev(col('ep03'), 5), dlage = rev(col('ep01'), 5);
  const ost = map(col('eastwest'), x => (x === 2 ? 1 : 0));
  const abitur = map(col('educ'), x => (x <= 3 ? 0 : x <= 5 ? 1 : NaN));
  const dg03 = col('dg03');
  const gesund = rev(hs01, 5);
  return { w, ls01, age, hs01, gesund, mstat, agec, work, demo, lage, dlage, ost, abitur, dg03 };
};
const dummy = (x: number[], code: number) => map(x, v => (v === code ? 1 : 0));

test('read R: ls01 ~ age + gesund prints the numbers of picture R2', { skip }, () => {
  const d = data();
  const fit = ols(d.ls01, [d.age, d.gesund], d.w, { names: ['age', 'gesund'] });
  assert.equal(fit.nPrinted, MODEL_AG.n);
  const rows = fit.rows;
  const pick = (x: number[]) => rows.map(i => x[i]);
  const wv = pick(d.w);
  for (const [name, x] of [['ls01', d.ls01], ['age', d.age], ['gesund', d.gesund]] as const) {
    const s = desc(pick(x), wv);
    assert.deepEqual([r(s.mean), r(s.sd)], [MODEL_AG.desc[name].mean, MODEL_AG.desc[name].sd], name);
  }
  assert.deepEqual([r(Math.sqrt(fit.r2)), r(fit.r2), r(fit.adjR2), r(fit.sigma)], [MODEL_AG.r, MODEL_AG.r2, MODEL_AG.adjR2, MODEL_AG.see]);
  const i = term(fit, '(Intercept)');
  assert.deepEqual([r(i.b), r(i.se), r(i.t), r(i.lower), r(i.upper)], [MODEL_AG.intercept.b, MODEL_AG.intercept.se, MODEL_AG.intercept.t, MODEL_AG.intercept.lower, MODEL_AG.intercept.upper]);
  for (const name of ['age', 'gesund'] as const) {
    const t = term(fit, name), m = MODEL_AG[name], v = t.vif();
    assert.deepEqual([r(t.b), r(t.se), r(t.beta), r(t.t), r(t.lower), r(t.upper), r(1 / v), r(v)], [m.b, m.se, m.beta, m.t, m.lower, m.upper, m.tolerance, m.vif], name);
    assert.equal(sig(t.p), m.p);
  }
  assert.equal(r(term(fit, 'age').b, 4), MODEL_AG.age.bExact);
  // Reihenfolge der Prädiktoren egal
  const swapped = ols(d.ls01, [d.gesund, d.age], d.w, { names: ['gesund', 'age'] });
  assert.equal(r(term(swapped, 'age').b, 6), r(term(fit, 'age').b, 6));
});

test('foundation 1: age alone, the hidden association and picture B1', { skip }, () => {
  const d = data();
  const alone = ols(d.ls01, [d.age], d.w, { names: ['age'] });
  const a = term(alone, 'age');
  assert.deepEqual([alone.nPrinted, r(a.b), r(a.b, 4), r(a.beta), r(alone.r2)], [MODEL_AGE_ONLY.n, MODEL_AGE_ONLY.b, MODEL_AGE_ONLY.bExact, MODEL_AGE_ONLY.beta, MODEL_AGE_ONLY.r2]);

  const group = (x: number) => (x <= 29 ? 0 : x <= 44 ? 1 : x <= 59 ? 2 : x <= 74 ? 3 : 4);
  const health = (x: number) => (x <= 2 ? 0 : x === 3 ? 1 : 2);
  const ok = (i: number) => [d.ls01[i], d.age[i], d.hs01[i]].every(Number.isFinite);
  const all = [0, 1, 2, 3, 4].map(g => r(wmean(d.ls01, d.w, i => ok(i) && group(d.age[i]) === g).mean, 2));
  assert.deepEqual(all, B1.all);
  B1.health.forEach((h, k) => {
    const means = [0, 1, 2, 3, 4].map(g => r(wmean(d.ls01, d.w, i => ok(i) && group(d.age[i]) === g && health(d.hs01[i]) === k).mean, 2));
    assert.deepEqual(means, h.means, h.key);
    assert.equal(r(h.means[4] - h.means[0], 2), h.rise, h.key);
  });
  // Anteile je Altersgruppe, nach größten Resten auf 100
  const shares = [0, 1, 2, 3, 4].map(g => {
    const total = wmean(d.ls01, d.w, i => ok(i) && group(d.age[i]) === g).sumW;
    const p = [0, 1, 2].map(k => 100 * wmean(d.ls01, d.w, i => ok(i) && group(d.age[i]) === g && health(d.hs01[i]) === k).sumW / total);
    const f = p.map(Math.floor);
    const order = p.map((v, k) => [v - f[k], k]).sort((x, y) => y[0] - x[0]).map(([, k]) => k);
    const rest = 100 - f.reduce((s, v) => s + v, 0);
    for (let k = 0; k < rest; k++) f[order[k]]++;
    return f;
  });
  assert.deepEqual(shares, B1.shares);
  const cells: number[] = [];
  for (let g = 0; g < 5; g++) for (let k = 0; k < 3; k++) cells.push(d.ls01.filter((_, i) => ok(i) && group(d.age[i]) === g && health(d.hs01[i]) === k).length);
  assert.equal(Math.min(...cells), B1.smallestCell);
  assert.equal(cells[2], B1.smallestCell, '18–29 with bad health');
});

test('foundation 2: married as 0/1, five references, the mstat dummies and mstat as a number', { skip }, () => {
  const d = data();
  const married = map(d.mstat, x => (x === 1 ? 1 : 0));
  const m = ols(d.ls01, [married], d.w, { names: ['verheiratet'] });
  assert.deepEqual([r(m.coef[0]), r(m.coef[1]), r(m.r2)], [MARRIED.intercept, MARRIED.b, MARRIED.r2]);
  assert.equal(r(MARRIED.intercept + MARRIED.b), MARRIED.prediction);
  const okLs = (i: number) => Number.isFinite(d.ls01[i]);
  const byGroup = [1, 2, 3, 4, 5].map(c => wmean(d.ls01, d.w, i => okLs(i) && d.mstat[i] === c));
  assert.equal(r(byGroup[0].mean, 2), MARRIED.meanMarried);
  const other = wmean(d.ls01, d.w, i => okLs(i) && d.mstat[i] >= 2);
  assert.equal(r(other.mean, 2), MARRIED.meanOther);
  // Fußnote B6: Nicht-Verheiratete und Ledige gleich bis zur dritten Stelle, verschieden in der vierten
  assert.equal(r(other.mean), r(byGroup[4].mean));
  assert.notEqual(r(other.mean, 4), r(byGroup[4].mean, 4));
  assert.deepEqual([Math.round(byGroup[0].sumW), Math.round(byGroup[1].sumW), Math.round(byGroup[4].sumW)], [MSTAT_WEIGHTED.married, MSTAT_WEIGHTED.separated, MSTAT_WEIGHTED.single]);

  const dummies = [1, 2, 3, 4, 5].map(c => dummy(d.mstat, c));
  REFERENCES.forEach((ref, k) => {
    const others = [0, 1, 2, 3, 4].filter(j => j !== k);
    const fit = ols(d.ls01, others.map(j => dummies[j]), d.w);
    assert.equal(r(fit.coef[0]), ref.intercept, `reference ${k + 1}`);
    assert.deepEqual(others.map((_, j) => r(fit.coef[j + 1])), others.map(j => ref.b[j]), `reference ${k + 1}`);
    assert.equal(r(fit.r2), MSTAT_R2);
    MSTAT_PREDICTIONS.forEach((p, j) => assert.ok(Math.abs(ref.intercept + (ref.b[j] ?? 0) - p) <= 0.0011, `reference ${k + 1}, group ${j + 1}`));
  });

  // frequency(mstat_1, weights = wghtpew): gewichtete Zählung, gerundet
  const valid = (i: number) => Number.isFinite(d.mstat[i]);
  const w0 = wmean(d.mstat, d.w, i => valid(i) && d.mstat[i] !== 1).sumW, w1 = wmean(d.mstat, d.w, i => valid(i) && d.mstat[i] === 1).sumW;
  assert.deepEqual([Math.round(w0), Math.round(w1)], [MSTAT_1_FREQ.zero.n, MSTAT_1_FREQ.one.n]);
  assert.deepEqual([r(100 * w0 / (w0 + w1), 2), r(100 * w1 / (w0 + w1), 2)], [MSTAT_1_FREQ.zero.valid, MSTAT_1_FREQ.one.valid]);
  const wMissing = d.w.reduce((s, w, i) => s + (valid(i) ? 0 : w), 0);
  assert.equal(Math.round(wMissing), MSTAT_1_FREQ.system);

  assert.equal(r(ols(d.ls01, [d.mstat], d.w).coef[1]), MSTAT_AS_NUMBER);
});

test('foundation 3: age and age group together (VIF), the age group alone', { skip }, () => {
  const d = data();
  const fit = ols(d.ls01, [d.age, d.agec, d.gesund], d.w, { names: ['age', 'agec', 'gesund'] });
  const age = term(fit, 'age'), agec = term(fit, 'agec'), ges = term(fit, 'gesund');
  assert.deepEqual([r(age.b), r(age.se), r(age.vif()), r(1 / age.vif())], [COLLINEAR.age.b, COLLINEAR.age.se, COLLINEAR.age.vif, COLLINEAR.age.tolerance]);
  assert.deepEqual([r(agec.b), r(agec.se), sig(agec.p), r(agec.vif())], [COLLINEAR.agec.b, COLLINEAR.agec.se, COLLINEAR.agec.p, COLLINEAR.agec.vif]);
  assert.deepEqual([r(ges.b), r(ges.se), sig(ges.p), r(ges.vif())], [COLLINEAR.gesund.b, COLLINEAR.gesund.se, COLLINEAR.gesund.p, COLLINEAR.gesund.vif]);
  assert.equal(sig(age.p), COLLINEAR.age.p);
  assert.equal(Math.max(...d.age.filter(x => Number.isFinite(x))), 99, 'Alterslineal B8: bis 99');
  const alone = ols(d.ls01, [d.agec, d.gesund], d.w, { names: ['agec', 'gesund'] });
  const a = term(alone, 'agec');
  assert.deepEqual([r(a.b), r(a.vif()), sig(a.p)], [COLLINEAR.agecAlone.b, COLLINEAR.agecAlone.vif, '<.001']);
});

test('foundation 4: employment by age 60, cells and interaction model', { skip }, () => {
  const d = data();
  const erwerb = map(d.work, x => (x <= 3 ? 1 : 0)), ab60 = map(d.age, x => (x >= 60 ? 1 : 0));
  const both = erwerb.map((e, i) => e * ab60[i]);
  const fit = ols(d.ls01, [erwerb, ab60, both], d.w);
  assert.deepEqual(fit.coef.map(x => r(x)), [INTERACTION.intercept, INTERACTION.erwerb, INTERACTION.ab60, INTERACTION.both]);
  assert.equal(r(INTERACTION.erwerb + INTERACTION.both), INTERACTION.gapOver60);
  const ok = (i: number) => [d.ls01[i], d.work[i], d.age[i]].every(Number.isFinite);
  const cell = (old: number, emp: number) => r(wmean(d.ls01, d.w, i => ok(i) && ab60[i] === old && erwerb[i] === emp).mean, 2);
  assert.deepEqual([cell(0, 0), cell(0, 1)], INTERACTION.cells.under60);
  assert.deepEqual([cell(1, 0), cell(1, 1)], INTERACTION.cells.over60);
});

test('task 1: demo ~ lage and demo ~ lage + dlage; the split question', { skip }, () => {
  const d = data();
  const one = ols(d.demo, [d.lage], d.w, { names: ['lage'] });
  assert.deepEqual([one.nPrinted, r(one.coef[0]), r(term(one, 'lage').b), r(term(one, 'lage').beta, 2), r(one.r2)], [A1.one.n, A1.one.intercept, A1.one.lage, A1.one.beta, A1.one.r2]);
  const two = ols(d.demo, [d.lage, d.dlage], d.w, { names: ['lage', 'dlage'] });
  const l = term(two, 'lage'), dl = term(two, 'dlage');
  assert.deepEqual([two.nPrinted, r(l.b), r(l.beta), r(dl.b), r(dl.beta), r(two.r2), r(l.vif())], [A1.two.n, A1.two.lage, A1.two.lageBeta, A1.two.dlage, A1.two.dlageBeta, A1.two.r2, A1.two.vif]);
  const ps03 = load().byName.get('ps03')!;
  assert.equal(Array.from(ps03.values).filter(x => x === -11).length, PS03_SPLIT);
  assert.equal(Math.round(100 * (1 - PS03_SPLIT / ps03.values.length)), 70, 'about two thirds got the question');
});

test('task 2: dg03 dummies with reference West-Bleibende and Ost-Bleibende; counted groups', { skip }, () => {
  const d = data();
  const dg = [1, 2, 3, 4].map(c => dummy(d.dg03, c));
  const west = ols(d.demo, [dg[0], dg[1], dg[2]], d.w, { names: ['dg03_1', 'dg03_2', 'dg03_3'] });
  assert.deepEqual([west.nPrinted, r(west.yMean), r(west.r2), r(west.coef[0])], [A2.nPrinted, A2.mean, A2.r2, A2.west.intercept]);
  ['dg03_1', 'dg03_2', 'dg03_3'].forEach((name, k) => {
    const t = term(west, name);
    assert.deepEqual([r(t.b), r(t.beta), r(t.lower), r(t.upper)], [A2.west.b[k], A2.west.beta[k], A2.west.lower[k], A2.west.upper[k]], name);
  });
  assert.equal(r(A2.west.intercept + A2.west.b[1]), A2.prediction);
  const east = ols(d.demo, [dg[3], dg[1], dg[2]], d.w, { names: ['dg03_4', 'dg03_2', 'dg03_3'] });
  assert.deepEqual([r(east.coef[0]), r(east.coef[1]), r(east.coef[2]), r(east.coef[3])], [A2.east.intercept, A2.east.west, A2.east.b2, A2.east.b3]);
  assert.equal(r(A2.east.intercept + A2.east.b2), A2.prediction);
  const counted = [1, 2, 3, 4].map(c => d.dg03.filter((x, i) => x === c && Number.isFinite(d.demo[i])).length);
  assert.deepEqual(counted, A2.counted);
  assert.equal(west.n, counted.reduce((a, b) => a + b, 0));
});

test('task 3: four predictors, Beta, adjusted R², VIF; the gap alone', { skip }, () => {
  const d = data();
  const names = ['lage', 'dlage', 'ost', 'abitur'] as const;
  const fit = ols(d.demo, [d.lage, d.dlage, d.ost, d.abitur], d.w, { names: [...names] });
  assert.deepEqual([fit.nPrinted, r(fit.r2), r(fit.adjR2), r(fit.coef[0])], [A3.n, A3.r2, A3.adjR2, A3.intercept]);
  assert.equal(r(desc(fit.rows.map(i => d.ost[i]), fit.w).mean), A3.eastShare);
  for (const n of names) {
    const t = term(fit, n);
    assert.deepEqual([r(t.b), r(t.beta), r(t.vif())], [A3.b[n], A3.beta[n], A3.vif[n]], n);
  }
  const alone = ols(d.demo, [d.ost], d.w, { names: ['ost'] });
  assert.deepEqual([r(alone.coef[0]), r(alone.coef[1]), r(term(alone, 'ost').beta), r(alone.r2)], [A3.ostAlone.intercept, A3.ostAlone.b, A3.ostAlone.beta, A3.ostAlone.r2]);
  assert.equal(r(Math.abs(A3.b.ost / A3.ostAlone.b), 2), 0.83);
});

test('task 4: demo ~ ost + abitur and demo ~ ost * abitur', { skip }, () => {
  const d = data();
  const plus = ols(d.demo, [d.ost, d.abitur], d.w);
  assert.deepEqual([r(plus.coef[1]), r(plus.coef[2])], [A4.plus.ost, A4.plus.abitur]);
  const both = d.ost.map((o, i) => o * d.abitur[i]);
  const fit = ols(d.demo, [d.ost, d.abitur, both], d.w, { names: ['ost', 'abitur', 'ost:abitur'] });
  const t = term(fit, 'ost:abitur');
  assert.deepEqual([r(fit.coef[0]), r(fit.coef[1]), r(fit.coef[2]), r(t.b), r(t.beta), sig(t.p), r(t.lower), r(t.upper), r(fit.r2)],
    [A4.times.intercept, A4.times.ost, A4.times.abitur, A4.times.both, A4.times.beta, A4.times.p, A4.times.lower, A4.times.upper, A4.times.r2]);
  assert.equal(r(fit.coef[1] + fit.coef[3]), A4.gapWithAbitur);
  assert.equal(r(fit.coef[2] + fit.coef[3]), 0.510, 'abitur gap in the East');
});
