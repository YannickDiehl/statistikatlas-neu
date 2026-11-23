// Läuft nur mit der eigenen GESIS-Datei: ALLBUS_SAV=/pfad/ZA8831_v1-3-0.sav node --import tsx --test src/chapter/s04/*.test.ts
// Prüft jede Zahl von Sitzung 4 gegen ZA8831 v1.3.0 (ungewichtet). Gültig heißt: kein Missing-Code, kein Systemmissing.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { isMissingCode, readSav, type SavFile } from '../../sandbox/readSav';
import { AGE, DW15, FORMS, HS01, LS01, RIDDLE, WEST_EAST, XT10 } from './content';

const file = process.env.ALLBUS_SAV;
const skip = !file && 'ALLBUS_SAV nicht gesetzt';
let cached: SavFile | null = null;
const load = () => {
  if (cached) return cached;
  const bytes = readFileSync(file!);
  return (cached = readSav(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)));
};
const column = (name: string) => {
  const v = load().byName.get(name);
  assert.ok(v, name);
  return { v, valid: (i: number) => !isMissingCode(v, v.values[i]) };
};
/** Gültige Werte, optional nur für Fälle, die `keep` erfüllen. */
const validValues = (name: string, keep: (i: number) => boolean = () => true) => {
  const { v, valid } = column(name);
  const out: number[] = [];
  for (let i = 0; i < v.values.length; i++) if (valid(i) && keep(i)) out.push(v.values[i]);
  return out;
};
const missingCount = (name: string, keep: (i: number) => boolean = () => true) => {
  const { v, valid } = column(name);
  let n = 0;
  for (let i = 0; i < v.values.length; i++) if (!valid(i) && keep(i)) n++;
  return n;
};
const countsFor = (xs: number[], values: number[]) => values.map(w => xs.filter(x => x === w).length);
const sorted = (xs: number[]) => [...xs].sort((a, b) => a - b);
const median = (xs: number[]) => {
  const s = sorted(xs), n = s.length;
  return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
};
/** Quantil wie R `quantile(type = 7)`, das auch geom_boxplot() nimmt. */
const quantile7 = (xs: number[], p: number) => {
  const s = sorted(xs), h = (s.length - 1) * p, lo = Math.floor(h);
  return s[lo] + (h - lo) * ((s[lo + 1] ?? s[lo]) - s[lo]);
};
const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i);
const codeOf = (name: string, label: string) => {
  const hit = [...column(name).v.valueLabels].find(([, l]) => l === label);
  assert.ok(hit, `${name}: ${label}`);
  return hit[0];
};
const mode = () => column('mode').v.values;

test('hs01: valid, missing and the most frequent answer', { skip }, () => {
  const xs = validValues('hs01');
  assert.equal(xs.length, 5209);
  assert.equal(missingCount('hs01'), 37);
  assert.deepEqual(countsFor(xs, HS01.values), HS01.counts);
  assert.equal(xs.length, HS01.valid);
  assert.equal(missingCount('hs01'), HS01.missing);
  const counts = countsFor(xs, HS01.values), top = Math.max(...counts);
  assert.equal(HS01.values[counts.indexOf(top)], 2);
  assert.equal(top, 2071);
  assert.deepEqual([HS01.missingParts.dataError, HS01.missingParts.noAnswer], [
    column('hs01').v.values.filter(x => x === -42).length,
    column('hs01').v.values.filter(x => x === -9).length,
  ]);
});

test('ls01: frequencies 0 to 10 and n', { skip }, () => {
  const xs = validValues('ls01');
  assert.equal(xs.length, 5164);
  assert.deepEqual(countsFor(xs, range(0, 10)), LS01);
  assert.equal(missingCount('ls01'), 82);
});

test('xt10: N, missing, median, maximum and the cut at 180 minutes', { skip }, () => {
  const xs = validValues('xt10'), m = mode();
  assert.equal(xs.length, 5026);
  assert.equal(xs.length, XT10.n);
  assert.equal(missingCount('xt10'), 220);
  assert.equal(missingCount('xt10', i => m[i] === 4), 220);
  assert.equal(missingCount('xt10'), XT10.missing);
  assert.equal(median(xs), 65);
  assert.equal(median(xs), XT10.median);
  assert.equal(Math.max(...xs), 61895);
  assert.equal(Math.max(...xs), XT10.max);
  assert.equal(Math.min(...xs), XT10.min);
  assert.equal(xs.filter(x => x > 180).length, 497);
  assert.equal(xs.filter(x => x > 180).length, XT10.over180);
  const cut = xs.filter(x => x <= 180);
  assert.equal(cut.length, XT10.upTo180);
  assert.equal(cut.filter(x => x === 60).length, XT10.at60);
  assert.equal(cut.filter(x => x === 59).length, XT10.at59);
});

test('xt10 by mode: medians with all forms and up to 180 minutes, rounding to multiples of 5', { skip }, () => {
  const m = mode();
  const expect = { MAIL: [75, 60, 1436, 1130, 71.5], CAPI: [70, 70, 2003, 1989, 39.5], CAWI: [49, 45] } as const;
  for (const label of ['MAIL', 'CAPI', 'CAWI'] as const) {
    const code = codeOf('mode', label), all = validValues('xt10', i => m[i] === code), cut = all.filter(x => x <= 180);
    const c = XT10.byMode[label];
    assert.equal(c.code, code, label);
    assert.equal(median(all), expect[label][0], label);
    assert.equal(median(cut), expect[label][1], label);
    assert.deepEqual([c.median, c.medianUpTo180, c.n, c.nUpTo180], [median(all), median(cut), all.length, cut.length], label);
    assert.equal(c.missing, missingCount('xt10', i => m[i] === code), label);
    const share = Math.round(all.filter(x => x % 5 === 0).length / all.length * 1000) / 10;
    assert.equal(c.multiplesOf5, share, label);
  }
  assert.deepEqual([XT10.byMode.MAIL.n, XT10.byMode.MAIL.nUpTo180], [1436, 1130]);
  assert.equal(XT10.byMode.CAPI.n - XT10.byMode.CAPI.nUpTo180, 14);
  assert.deepEqual([XT10.byMode.MAIL.multiplesOf5, XT10.byMode.CAPI.multiplesOf5, Math.round(XT10.byMode.CAWI.multiplesOf5)], [71.5, 39.5, 20]);
});

test('shapes, riddle, working hours and age equal the constants', { skip }, () => {
  for (const f of FORMS) {
    const xs = validValues(f.id), codes = [...new Set(xs)].sort((a, b) => a - b);
    assert.equal(codes.length, f.counts.length, f.id);
    assert.deepEqual(countsFor(xs, codes), f.counts, f.id);
  }
  // vm18: Codes 1 bis 7 tragen die Beschriftungen −3 bis +3
  assert.deepEqual([...column('vm18').v.valueLabels].filter(([k]) => k > 0).map(([, l]) => parseInt(l.replace('+', ''), 10)), FORMS[3].values);
  for (const r of Object.values(RIDDLE)) {
    if (r.answer === 'dw15') continue;
    const xs = validValues(r.answer);
    assert.deepEqual(countsFor(xs, range(1, r.counts.length)), r.counts, r.answer);
    assert.equal(xs.length, r.counts.reduce((a, b) => a + b, 0), r.answer);
  }
  const dw = validValues('dw15');
  // dw15 kennt halbe Stunden (37,5 usw.): DW15 zählt Kisten zu einer Stunde, [k, k + 1)
  assert.ok(dw.every(x => x >= 0 && x <= 90));
  assert.ok(dw.some(x => !Number.isInteger(x)));
  assert.deepEqual(countsFor(dw.map(Math.floor), range(0, 90)), DW15);
  assert.equal(dw.length, 2945);
  const age = validValues('age');
  assert.ok(age.every(x => x >= 18 && x <= 99));
  assert.deepEqual(countsFor(age, range(18, 99)), AGE);
});

test('west and east: life satisfaction and age boxplots', { skip }, () => {
  const ew = column('eastwest').v.values;
  const groups = [{ code: 1, ls: WEST_EAST.ls01.west, box: WEST_EAST.age[0] }, { code: 2, ls: WEST_EAST.ls01.east, box: WEST_EAST.age[1] }];
  for (const g of groups) {
    const ls = validValues('ls01', i => ew[i] === g.code);
    assert.equal(ls.length, g.ls.n);
    assert.equal(Math.round(mean(ls) * 10000) / 10000, g.ls.mean);
    const age = validValues('age', i => ew[i] === g.code), q1 = quantile7(age, 0.25), q3 = quantile7(age, 0.75), fence = 1.5 * (q3 - q1);
    assert.deepEqual(g.box, {
      group: g.box.group, n: age.length, lo: Math.min(...age.filter(x => x >= q1 - fence)), q1, median: median(age), q3,
      hi: Math.max(...age.filter(x => x <= q3 + fence)),
    });
  }
  assert.deepEqual([WEST_EAST.ls01.west.n, WEST_EAST.ls01.east.n], [3510, 1654]);
  assert.deepEqual([WEST_EAST.ls01.west.mean.toFixed(2), WEST_EAST.ls01.east.mean.toFixed(2)], ['7.44', '7.18']);
});
