// Läuft nur mit der eigenen GESIS-Datei: ALLBUS_SAV=/pfad/ZA8831_v1-3-0.sav node --import tsx --test src/chapter/s11/*.test.ts
// Prüft jede feste Zahl von Sitzung 11 gegen ZA8831 v1.3.0, gewichtet mit wghtpew wie mariposa 0.7.4:
// Häufigkeiten und Kreuztabellen als gerundete Summen der Gewichte, Modelle mit src/tasks/kit/logit.ts (glm.fit wie R)
// und src/tasks/kit/ols.ts. Nur der Hosmer-Lemeshow-Test (Sig. .378 und .039) hat in TypeScript kein Gegenstück; er
// steht als geprüfte Zeile der mariposa-Ausgabe in sitzung11-zahlen.R und wird hier nicht nachgerechnet.
// Zwei Eigenheiten von mariposa 0.7.4, die hier nachgebildet sind:
// - crosstab() rundet die gewichteten Zellen zuerst; Summen und Zeilenprozente rechnet es aus den gerundeten Zellen
//   (Zeile „stimme gar nicht zu“: 39 + 62 = 101, 61,4 %; ungerundet wären es 101,5 und 61,37 %).
// - Wald und Konfidenzgrenzen weichen bei kit/logit.ts in der dritten Nachkommastelle ab (Wald 604,191 statt 604,222,
//   obere Grenze 4,627 statt 4,628): Die Standardfehler unterscheiden sich in der fünften Stelle. B, S.E. und Exp(B)
//   stimmen auf drei Stellen; Wald und Grenzen werden darum mit einer kleinen Toleranz verglichen, die gedruckten
//   Werte selbst prüft sitzung11-zahlen.R wörtlich.
// - Die Classification Table zeigt die gerundeten richtigen Zellen und als Rest die gerundete Zeilensumme minus diese
//   (würde nicht wählen: 143 − 18 = 125, ungerundet wären es 124,4).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { isMissingCode, readSav, type SavFile } from '../../sandbox/readSav';
import { averageMarginalEffects, logistic, logitOf, predictProb, type LogitFit } from '../../tasks/kit/logit';
import { ols } from '../../tasks/kit/ols';
import {
  AGE_GROUPS, CROSSTAB, CROSSTAB_TOTAL, INTEREST_ROWS, LINE, PE09, SMARTPHONE, VOTE_FREQ, VOTE_MODEL, VOTE_MODEL_AGE,
  VOTE_MODEL_INTEREST, VOTE_MODEL_PFLICHT,
} from './content';

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
  return Array.from(v.values, x => (isMissingCode(v, x) ? NaN : x));
};
const r = (x: number, d: number) => Math.round(x * 10 ** d) / 10 ** d;
const ok = (x: number) => Number.isFinite(x);
const fit = (res: ReturnType<typeof logistic>): LogitFit => { assert.ok(res.ok, res.ok ? '' : res.problem); return res; };
/** Classification Table wie mariposa: richtige Zellen gerundet, die anderen als gerundete Zeilensumme minus richtige Zelle. */
const cells = (c: LogitFit['classification']) => [Math.round(c.correct0), Math.round(c.n0) - Math.round(c.correct0), Math.round(c.n1) - Math.round(c.correct1), Math.round(c.correct1)];
/** |x − soll| ≤ tol (Wald und Konfidenzgrenzen, siehe oben). */
const near = (x: number, soll: number, tol: number, what: string) => assert.ok(Math.abs(x - soll) <= tol, `${what}: ${x} statt ${soll}`);

/** waehlen, pflicht, interesse wie rec() in den Vorlagen. */
function vote() {
  const pv01 = col('pv01'), pe09 = col('pe09'), pa02a = col('pa02a');
  const waehlen = pv01.map(x => (x >= 1 && x <= 90 ? 1 : x === 91 ? 0 : NaN));
  const pflicht = pe09.map(x => (ok(x) ? 5 - x : NaN));
  const interesse = pa02a.map(x => (ok(x) ? 6 - x : NaN));
  return { waehlen, pflicht, interesse, w: col('wghtpew'), age: col('age') };
}
const smartphoneData = () => ({ y: col('lm30'), age: col('age'), w: col('wghtpew') });

test('smartphone model lm30 ~ age, weighted: the printed numbers', { skip }, () => {
  const { y, age, w } = smartphoneData();
  const m = fit(logistic(y, [age], ['age'], w));
  assert.equal(m.cases, SMARTPHONE.cases);
  assert.equal(m.n, SMARTPHONE.n);
  assert.equal(m.y.filter(v => v === 0).length, 417);
  assert.deepEqual([r(m.coef[0], 3), r(m.coef[1], 3), r(m.coef[1], 4)], [SMARTPHONE.intercept, SMARTPHONE.b, SMARTPHONE.bExact]);
  assert.deepEqual([r(m.se[0], 3), r(m.se[1], 3)], [SMARTPHONE.interceptSe, SMARTPHONE.se]);
  near(m.wald[0], SMARTPHONE.interceptWald, 0.05, 'Wald Konstante');
  near(m.wald[1], SMARTPHONE.wald, 0.05, 'Wald age');
  assert.deepEqual([r(m.expB[0], 3), r(m.expB[1], 3)], [SMARTPHONE.interceptExpB, SMARTPHONE.expB]);
  near(m.ciLower[1], SMARTPHONE.ciLower, 0.0011, 'CI unten');
  near(m.ciUpper[1], SMARTPHONE.ciUpper, 0.0011, 'CI oben');
  assert.deepEqual([r(m.minus2LL, 3), r(m.omnibus.chi2, 3), r(m.minus2LLNull, 3)], [SMARTPHONE.minus2LL, SMARTPHONE.chi2, SMARTPHONE.minus2LLNull]);
  assert.deepEqual([r(m.coxSnell, 3), r(m.nagelkerke, 3), r(m.mcfadden, 3)], [SMARTPHONE.coxSnell, SMARTPHONE.nagelkerke, SMARTPHONE.mcfadden]);
  const c = m.classification, t = SMARTPHONE.table;
  assert.deepEqual(cells(c), [t.no.no, t.no.yes, t.yes.no, t.yes.yes]);
  assert.deepEqual([r(c.pct0, 1), r(c.pct1, 1), r(c.overall, 1)], [t.no.pct, t.yes.pct, t.overall]);
  // gewichteter Mittelwert = Anteil der Einsen
  const sw = m.w.reduce((a, b) => a + b, 0);
  assert.equal(r(m.y.reduce((s, v, i) => s + v * m.w[i], 0) / sw, 3), SMARTPHONE.mean);
});

test('smartphone model: predict(), logits, AME', { skip }, () => {
  const { y, age, w } = smartphoneData();
  const m = fit(logistic(y, [age], ['age'], w));
  for (const [a, p] of Object.entries(SMARTPHONE.predict)) {
    const digits = String(p).split('.')[1].length;
    assert.equal(r(predictProb(m, [Number(a)]), digits), p, a);
  }
  assert.equal(r(logitOf(m, [30]), 3), SMARTPHONE.logit30);
  assert.equal(r(-m.coef[0] / m.coef[1], 1), 89.3, 'Logit 0 (50 %) bei etwa 89 Jahren');
  const ame = averageMarginalEffects(m)[0];
  assert.deepEqual([r(ame.ame, 3), r(ame.ame, 5), r(ame.se * 1e6, 0)], [SMARTPHONE.ame, SMARTPHONE.ameExact, 304]);
  assert.equal(SMARTPHONE.ameSe, '3.04e-04');
});

test('age groups: counted respondents, weighted shares, weighted mean age; the S-curve stays within 1,7 points', { skip }, () => {
  const { y, age, w } = smartphoneData();
  const m = fit(logistic(y, [age], ['age'], w));
  const bounds = [17, 29, 39, 49, 59, 69, 79, 99];
  AGE_GROUPS.forEach((g, k) => {
    let n = 0, sw = 0, sy = 0, sa = 0;
    for (let i = 0; i < y.length; i++) {
      if (!ok(y[i]) || !ok(age[i]) || !(age[i] > bounds[k] && age[i] <= bounds[k + 1])) continue;
      n++; sw += w[i]; sy += w[i] * y[i]; sa += w[i] * age[i];
    }
    assert.deepEqual([n, r(100 * sy / sw, 1), Math.round(sa / sw)], [g.n, g.share, g.mid], g.label);
    const dist = Math.abs(r(100 * predictProb(m, [sa / sw]), 1) - g.share);
    assert.ok(dist <= 1.7 + 0.05, `${g.label}: ${dist}`);
  });
});

test('the straight line (linear regression lm30 ~ age, weighted)', { skip }, () => {
  const { y, age, w } = smartphoneData();
  const keep = y.map((v, i) => ok(v) && ok(age[i]));
  const lin = ols(y.filter((_, i) => keep[i]), [age.filter((_, i) => keep[i])], w.filter((_, i) => keep[i]));
  assert.deepEqual([r(lin.coef[0], 3), r(lin.coef[1], 5), r(lin.coef[1], 3), r(lin.r2, 3)], [LINE.intercept, LINE.slope, LINE.slopePrinted, LINE.r2]);
  assert.equal(r(100 * (lin.coef[0] + lin.coef[1] * 18), 1), 106.6);
  assert.equal(r(100 * (lin.coef[0] + lin.coef[1] * 95), 1), 70.1);
  assert.equal(r((lin.coef[0] - 1) / -lin.coef[1], 1), 31.9);
});

test('task 1: frequency of waehlen and the crosstab with pflicht, weighted', { skip }, () => {
  const { waehlen, pflicht, w } = vote();
  const sum = (keep: (i: number) => boolean) => waehlen.reduce((s, _, i) => s + (keep(i) ? w[i] : 0), 0);
  const yes = sum(i => waehlen[i] === 1), no = sum(i => waehlen[i] === 0), all = sum(() => true);
  assert.deepEqual([Math.round(all), Math.round(yes + no), Math.round(no), Math.round(yes), Math.round(all - yes - no)],
    [VOTE_FREQ.total, VOTE_FREQ.valid, VOTE_FREQ.no, VOTE_FREQ.yes, VOTE_FREQ.system]);
  assert.deepEqual([r(100 * yes / all, 2), r(100 * yes / (yes + no), 2), r(100 * no / (yes + no), 2), r(yes / (yes + no), 2)],
    [VOTE_FREQ.rawYes, VOTE_FREQ.validYes, VOTE_FREQ.validNo, VOTE_FREQ.mean]);
  // Zellen gerundet, Summen und Zeilenprozente aus den gerundeten Zellen (wie mariposa)
  let t0 = 0, t1 = 0;
  for (const row of CROSSTAB) {
    const y1 = Math.round(sum(i => pflicht[i] === row.pflicht && waehlen[i] === 1)), y0 = Math.round(sum(i => pflicht[i] === row.pflicht && waehlen[i] === 0));
    t0 += y0; t1 += y1;
    assert.deepEqual([y0, y1, y0 + y1, r(100 * y0 / (y0 + y1), 1), r(100 * y1 / (y0 + y1), 1)],
      [row.no, row.yes, row.total, row.rowNo, row.rowYes], row.answer);
  }
  assert.deepEqual([t0, t1, t0 + t1], [CROSSTAB_TOTAL.no, CROSSTAB_TOTAL.yes, CROSSTAB_TOTAL.total]);
  // pe09: gültig und TNZ: SPLIT (ungewichtet)
  const pe = load().byName.get('pe09')!;
  const split = [...pe.valueLabels].find(([, l]) => /SPLIT/.test(l));
  assert.ok(split);
  assert.equal(pe.values.filter(x => x === split[0]).length, PE09.split);
  assert.equal(col('pe09').filter(ok).length, PE09.valid);
});

test('task 2 to 4: waehlen ~ pflicht + interesse, weighted', { skip }, () => {
  const { waehlen, pflicht, interesse, w } = vote();
  const m = fit(logistic(waehlen, [pflicht, interesse], ['pflicht', 'interesse'], w));
  const V = VOTE_MODEL;
  assert.deepEqual([m.n, m.cases, m.y.filter(v => v === 0).length, r(m.sumW, 1)], [V.n, V.cases, V.casesNo, V.sumW]);
  assert.deepEqual([r(m.coef[0], 3), r(m.se[0], 3), r(m.expB[0], 3)], [V.intercept, V.interceptSe, V.interceptExpB]);
  for (const [k, term] of [[1, V.pflicht], [2, V.interesse]] as const) {
    assert.deepEqual([r(m.coef[k], 3), r(m.se[k], 3), r(m.expB[k], 3)], [term.b, term.se, term.expB], m.terms[k]);
    near(m.wald[k], term.wald, 0.05, `Wald ${m.terms[k]}`);
    near(m.ciLower[k], term.ciLower, 0.0011, `CI unten ${m.terms[k]}`);
    near(m.ciUpper[k], term.ciUpper, 0.0011, `CI oben ${m.terms[k]}`);
    assert.ok(m.p[k] < 0.001, m.terms[k]);
  }
  assert.deepEqual([r(m.minus2LL, 3), r(m.omnibus.chi2, 3)], [V.minus2LL, V.chi2]);
  // Das Kapitel rechnet das Nullmodell aus den gedruckten Zahlen: 856,448 + 265,831 = 1.122,279 (ungerundet 1.122,2785).
  assert.equal(r(r(m.minus2LL, 3) + r(m.omnibus.chi2, 3), 3), V.minus2LLNull);
  near(m.minus2LLNull, V.minus2LLNull, 0.001, '−2LL Nullmodell');
  assert.deepEqual([r(m.coxSnell, 3), r(m.nagelkerke, 3), r(m.mcfadden, 3)], [V.coxSnell, V.nagelkerke, V.mcfadden]);
  const c = m.classification, t = V.table;
  assert.deepEqual(cells(c), [t.no.no, t.no.yes, t.yes.no, t.yes.yes]);
  assert.deepEqual([r(c.pct0, 1), r(c.pct1, 1), r(c.overall, 1)], [t.no.pct, t.yes.pct, t.overall]);
  // predict() mit sieben Stellen: IRLS-Konvergenz wie glm(), die siebte Stelle darf um 1 abweichen
  [[2, 2], [3, 2], [3, 4], [4, 4]].forEach((x, k) => near(predictProb(m, x), V.predict[k], 1.5e-7, `predict ${x}`));
  [1, 2, 3, 4].forEach((p, k) => near(predictProb(m, [p, 3]), V.steps[k], 1.5e-7, `Stufe ${p}`));
  const ame = averageMarginalEffects(m);
  assert.deepEqual(ame.map(a => [r(a.ame, 3), r(a.se, 3)]), [[V.pflicht.ame, 0.004], [V.interesse.ame, 0.004]]);
  // AME ist die mittlere Steigung: eine ganze Stufe mehr bringt im gewichteten Mittel weniger (Karte 3c)
  const sw = m.w.reduce((a, b) => a + b, 0);
  const whole = m.X.reduce((s, x, i) => s + m.w[i] * (predictProb(m, [x[1] + 1, x[2]]) - predictProb(m, [x[1], x[2]])), 0) / sw;
  assert.ok(whole < ame[0].ame, `${whole} < ${ame[0].ame}`);
  // ungewichtet (Voraussetzungen, Gewichtung)
  const u = fit(logistic(waehlen, [pflicht, interesse], ['pflicht', 'interesse']));
  assert.equal(r(u.expB[1], 3), V.unweightedExpB);
  // gezählt, wie viele nicht wählen wollen (Faustregel 10 je Prädiktor)
  assert.ok(V.casesNo >= 10 * 2);
});

test('task 2 and the try-out workshops: model with duty only, with age, with interest only', { skip }, () => {
  const { waehlen, pflicht, interesse, w, age } = vote();
  const p = fit(logistic(waehlen, [pflicht], ['pflicht'], w));
  assert.deepEqual([r(p.coef[0], 3), r(p.coef[1], 3), r(p.expB[1], 3), p.n],
    [VOTE_MODEL_PFLICHT.intercept, VOTE_MODEL_PFLICHT.b, VOTE_MODEL_PFLICHT.expB, VOTE_MODEL_PFLICHT.n]);
  near(p.ciLower[1], VOTE_MODEL_PFLICHT.ciLower, 0.0011, 'CI unten');
  near(p.ciUpper[1], VOTE_MODEL_PFLICHT.ciUpper, 0.0011, 'CI oben');
  const a = fit(logistic(waehlen, [pflicht, interesse, age], ['pflicht', 'interesse', 'age'], w));
  assert.deepEqual([r(a.expB[1], 3), r(a.expB[2], 3), r(a.expB[3], 3), r(a.p[3], 3), a.n],
    [VOTE_MODEL_AGE.pflichtExpB, VOTE_MODEL_AGE.interesseExpB, VOTE_MODEL_AGE.ageExpB, VOTE_MODEL_AGE.ageSig, VOTE_MODEL_AGE.n]);
  const i = fit(logistic(waehlen, [interesse], ['interesse'], w));
  assert.deepEqual([r(i.nagelkerke, 3), r(i.omnibus.chi2, 2), r(i.classification.overall, 1), i.n],
    [VOTE_MODEL_INTEREST.nagelkerke, VOTE_MODEL_INTEREST.chi2, VOTE_MODEL_INTEREST.accuracy, VOTE_MODEL_INTEREST.n]);
});

test('overview: share who want to vote by interest is not even (row percent, weighted)', { skip }, () => {
  const { waehlen, interesse, w } = vote();
  // Zeilenprozent aus den gerundeten gewichteten Zellen, wie crosstab()
  for (const [level, share] of Object.entries(INTEREST_ROWS)) {
    let y1 = 0, y0 = 0;
    for (let k = 0; k < waehlen.length; k++) {
      if (interesse[k] !== Number(level) || !ok(waehlen[k])) continue;
      if (waehlen[k] === 1) y1 += w[k]; else y0 += w[k];
    }
    assert.equal(r(100 * Math.round(y1) / (Math.round(y0) + Math.round(y1)), 1), share, level);
  }
});
