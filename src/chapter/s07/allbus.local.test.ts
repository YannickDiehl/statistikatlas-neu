// Läuft nur mit der eigenen GESIS-Datei: ALLBUS_SAV=/pfad/ZA8831_v1-3-0.sav node --import tsx --test src/chapter/s07/*.test.ts
// Prüft jede feste Zahl von Sitzung 7 gegen ZA8831 v1.3.0, gewichtet mit wghtpew wie mariposa 0.7.4
// (Rechenwege aus src/tasks/kit/means.ts, die mariposas t_test(), oneway_anova(), tukey_test() und pearson_cor() nachbauen).
// Nicht hier geprüft: die Stichproben-Maschine (SAMPLES, STACKS, MACHINE_FACTS). Sie hängt am Zufallsgenerator von R
// (set.seed(2026), sample() mit prob = wghtpew); das in TypeScript nachzubauen wäre ein eigener R-Generator. Diese Zahlen
// prüft sitzung07-zahlen.R mit stopifnot gegen den Plan; hier wird nur der wahre Unterschied (TRUE_DIFF) aus der Datei bestätigt.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { isMissingCode, readSav, type SavFile } from '../../sandbox/readSav';
import { corMatrix, describeGroups, onewayAnova, tTest, tukeyHSD } from '../../tasks/kit/means';
import {
  A1_SHORT, AGE_MODE, AGE_MODE_SHORT, AGE_MODE_TUKEY, COR_A4, COR_A4_SHORT, COR_G4, COR_G4_LS_HS_CI, DW15_SEX, DW15_SEX_COUNTED, DW15_SEX_SHORT,
  LI07_SEX, LS01_ABITUR, LS01_ABITUR_U30, LS01_SEX, PA01_EINZELHAUS_COUNTED, PA01_GS01, PA01_GS01_TUKEY, PA01_GS01_TUKEY_SHORT, PT03_ABITUR, PT03_FACTS,
  SEX_COUNTS, TRUE_DIFF, type AnovaOut, type CorOut, type TTestOut, type TukeyOut,
} from './content';

const file = process.env.ALLBUS_SAV;
const skip = !file && 'ALLBUS_SAV nicht gesetzt';
let cached: SavFile | null = null;
const load = () => {
  if (cached) return cached;
  const bytes = readFileSync(file!);
  return (cached = readSav(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)));
};
const raw = (name: string) => {
  const v = load().byName.get(name);
  assert.ok(v, name);
  return v;
};
/** Werte wie nach read_spss(): Missing-Codes und Systemmissing werden NaN. */
const col = (name: string) => {
  const v = raw(name);
  return Float64Array.from(v.values, x => (isMissingCode(v, x) ? NaN : x));
};
const w = () => col('wghtpew');
/** rec(x, rules = "…"): Codes nach `map`, alles andere NA. */
const rec = (name: string, map: Record<number, number>) => col(name).map(x => (x in map ? map[x] : NaN));
const sexTwo = () => rec('sex', { 1: 1, 2: 2 });
const abitur = () => rec('educ', { 1: 0, 2: 0, 3: 0, 4: 1, 5: 1 });

const r3 = (x: number) => Math.round(x * 1000) / 1000;
const eq3 = (actual: number, expected: number, what: string) => assert.equal(r3(actual), expected, `${what}: ${actual}`);
/** p-Wert, wie mariposa ihn in Tabellen druckt („<.001“, „.011“, „1.000“). */
const fmtP = (p: number) => (p < 0.001 ? '<.001' : p.toFixed(3).replace(/^0(?=\.)/, ''));

type T = NonNullable<ReturnType<typeof tTest>>;
const flipRow = (r: T['welch']): T['welch'] => ({ ...r, t: -r.t, ci: [-r.ci[1], -r.ci[0]] });
/** mariposa 0.7.4 vergleicht in der Reihenfolge der Codes (0 vor 1, 1 vor 2: „ohne Abitur vs. mit Abitur“ auch bei den unter 30-Jährigen).
 *  tTest() aus dem Kit nimmt die Gruppe zuerst, die in den Daten zuerst vorkommt; dann drehen wir hier um. */
function ordered(t: T | null): T | null {
  if (!t || t.levels[0] < t.levels[1]) return t;
  return {
    ...t, levels: [t.levels[1], t.levels[0]], n: [t.n[1], t.n[0]], sumW: [t.sumW[1], t.sumW[0]], means: [t.means[1], t.means[0]],
    diff: -t.diff, welch: flipRow(t.welch), student: flipRow(t.student), d: -t.d, g: -t.g, glass: NaN,
  };
}

function checkTTest(name: string, expected: TTestOut, y: Float64Array, g: Float64Array, ws: Float64Array) {
  const t = ordered(tTest(y, g, ws));
  assert.ok(t, name);
  const groups = describeGroups(y, g, ws);
  assert.deepEqual(t.levels, [groups[0].level, groups[1].level], `${name}: Reihenfolge`);
  expected.groups.forEach((e, k) => {
    assert.equal(groups[k].n, e.n, `${name} ${e.label}: N`);
    eq3(groups[k].mean, e.mean, `${name} ${e.label}: Mean`);
    eq3(groups[k].sd, e.sd, `${name} ${e.label}: SD`);
    eq3(groups[k].se, e.se, `${name} ${e.label}: SE`);
  });
  const rows = [['welch', t.welch, expected.welch], ['student', t.student, expected.student]] as const;
  for (const [what, got, exp] of rows) {
    if (!exp) continue;
    eq3(got.t, exp.t, `${name} ${what}: t`);
    if (what === 'student') assert.equal(Math.round(got.df), exp.df, `${name}: df`);
    else eq3(got.df, exp.df, `${name} ${what}: df`);
    assert.equal(fmtP(got.p), exp.p, `${name} ${what}: p`);
    eq3(t.diff, exp.diff, `${name}: Mean Diff.`);
    eq3(got.se, exp.se, `${name} ${what}: SE Diff.`);
    eq3(got.ci[0], exp.lo, `${name} ${what}: CI lower`);
    eq3(got.ci[1], exp.hi, `${name} ${what}: CI upper`);
  }
  eq3(t.d, expected.effect.d, `${name}: d`);
  eq3(t.g, expected.effect.g, `${name}: g`);
  // Glass' Delta teilt durch die SD der ersten Gruppe; nach dem Umdrehen ist sie aus describeGroups() nachzurechnen.
  eq3(Number.isNaN(t.glass) ? t.diff / groups[0].sd : t.glass, expected.effect.glass, `${name}: Glass`);
  const size = Math.abs(t.g) < 0.2 ? 'negligible' : Math.abs(t.g) < 0.5 ? 'small' : Math.abs(t.g) < 0.8 ? 'medium' : 'large';
  assert.equal(size, expected.effect.magnitude, `${name}: Magnitude`);
  return t;
}

/** Kurzfassung „t(df) = t, p …, g = g (…), N = N“ aus den gerechneten Zahlen. */
function shortLine(t: T) {
  const g = t.g, size = Math.abs(g) < 0.2 ? 'negligible' : Math.abs(g) < 0.5 ? 'small' : Math.abs(g) < 0.8 ? 'medium' : 'large';
  const p = t.welch.p < 0.001 ? 'p < 0.001 ***' : `p = ${t.welch.p.toFixed(3)}`;
  return `t(${t.welch.df.toFixed(1)}) = ${t.welch.t.toFixed(3)}, ${p}, g = ${g.toFixed(3)} (${size}), N = ${t.n[0] + t.n[1]}`;
}

test('read R: working hours by sex, short form, counted cases, three sexes', { skip }, () => {
  const t = checkTTest('dw15 × geschlecht', DW15_SEX, col('dw15'), sexTwo(), w());
  assert.equal(shortLine(t), DW15_SEX_SHORT);
  const dw = col('dw15'), g = sexTwo();
  const counted = [1, 2].map(code => dw.filter((x, i) => !Number.isNaN(x) && g[i] === code).length);
  assert.deepEqual(counted, DW15_SEX_COUNTED);
  assert.equal(counted[0] + counted[1], 2933);
  const sex = col('sex');
  assert.deepEqual([1, 2, 3].map(c => sex.filter(x => x === c).length), [SEX_COUNTS.men, SEX_COUNTS.women, SEX_COUNTS.diverse]);
  assert.equal(sex.filter(x => Number.isNaN(x)).length, SEX_COUNTS.missing);
  assert.equal(Math.round(t.diff * 100) / 100, TRUE_DIFF.dw15);
});

test('foundations 1 and 2: life satisfaction and importance of politics by sex', { skip }, () => {
  const ls = checkTTest('ls01 × geschlecht', LS01_SEX, col('ls01'), sexTwo(), w());
  assert.equal(Math.round(ls.diff * 100) / 100, TRUE_DIFF.ls01);
  checkTTest('li07 × geschlecht', LI07_SEX, col('li07'), sexTwo(), w());
});

test('task 1: trust in the Bundestag by abitur, both short forms, counts', { skip }, () => {
  const t = checkTTest('pt03 × abitur', PT03_ABITUR, col('pt03'), abitur(), w());
  assert.equal(shortLine(t), A1_SHORT.pt03);
  const age = ordered(tTest(col('age'), abitur(), w()));
  assert.ok(age);
  assert.equal(shortLine(age), A1_SHORT.age);
  const pt03 = raw('pt03').values, ab = abitur(), y = col('pt03');
  assert.equal(y.filter(x => !Number.isNaN(x)).length, PT03_FACTS.valid);
  assert.equal(pt03.filter(x => x === -11).length, PT03_FACTS.split);
  // Etwa zwei Drittel wurden gefragt, ein Drittel nicht (TNZ: SPLIT).
  assert.ok(PT03_FACTS.split / pt03.length > 0.28 && PT03_FACTS.split / pt03.length < 0.33);
  assert.deepEqual([0, 1].map(c => y.filter((x, i) => !Number.isNaN(x) && ab[i] === c).length), PT03_FACTS.counted);
  const educ = col('educ');
  assert.deepEqual([educ.filter(x => x === 4).length, educ.filter(x => x === 5).length], [PT03_FACTS.educ4, PT03_FACTS.educ5]);
});

test('task 2: life satisfaction by abitur, all and under 30', { skip }, () => {
  checkTTest('ls01 × abitur', LS01_ABITUR, col('ls01'), abitur(), w());
  const age = col('age'), ab = abitur();
  const young = ab.map((x, i) => (age[i] < 30 ? x : NaN));
  checkTTest('ls01 × abitur, unter 30', LS01_ABITUR_U30, col('ls01'), young, w());
});

function checkAnova(name: string, expected: AnovaOut, y: Float64Array, g: Float64Array) {
  const a = onewayAnova(y, g, w());
  assert.ok(a, name);
  assert.equal(a.groups.length, expected.groups.length, name);
  expected.groups.forEach((e, k) => {
    const got = a.groups[k];
    assert.equal(got.n, e.n, `${name} ${e.label}: N`);
    eq3(got.mean, e.mean, `${name} ${e.label}: Mean`);
    eq3(got.sd, e.sd, `${name} ${e.label}: SD`);
    eq3(got.se, e.se, `${name} ${e.label}: SE`);
    eq3(got.ci[0], e.lo, `${name} ${e.label}: CI lower`);
    eq3(got.ci[1], e.hi, `${name} ${e.label}: CI upper`);
  });
  eq3(a.ssBetween, expected.between.ss, `${name}: SS between`);
  assert.equal(a.dfBetween, expected.between.df);
  eq3(a.msBetween, expected.between.ms, `${name}: MS between`);
  eq3(a.F, expected.between.F, `${name}: F`);
  assert.equal(fmtP(a.p), expected.between.p);
  eq3(a.ssWithin, expected.within.ss, `${name}: SS within`);
  assert.equal(a.dfWithin, expected.within.df);
  eq3(a.msWithin, expected.within.ms, `${name}: MS within`);
  if (expected.total) {
    eq3(a.ssTotal, expected.total.ss, `${name}: SS total`);
    assert.equal(a.dfBetween + a.dfWithin, expected.total.df);
  }
  eq3(a.welch.F, expected.welch.F, `${name}: Welch F`);
  assert.equal(a.welch.df1, expected.welch.df1);
  eq3(a.welch.df2, expected.welch.df2, `${name}: Welch df2`);
  assert.equal(fmtP(a.welch.p), expected.welch.p);
  eq3(a.eta2, expected.effect.eta2, `${name}: eta²`);
  eq3(a.epsilon2, expected.effect.epsilon2, `${name}: epsilon²`);
  eq3(a.omega2, expected.effect.omega2, `${name}: omega²`);
  const size = a.eta2 < 0.01 ? 'negligible' : a.eta2 < 0.06 ? 'small' : a.eta2 < 0.14 ? 'medium' : 'large';
  assert.equal(size, expected.effect.magnitude, name);
  return a;
}

function checkTukey(name: string, expected: TukeyOut[], labels: Map<number, string>, y: Float64Array, g: Float64Array) {
  const rows = tukeyHSD(y, g, w());
  assert.ok(rows, name);
  assert.equal(rows.length, expected.length, name);
  rows.forEach((r, k) => {
    const e = expected[k];
    assert.equal(`${labels.get(r.a)} - ${labels.get(r.b)}`, e.pair, `${name}: Paar ${k + 1}`);
    eq3(r.diff, e.diff, `${e.pair}: diff`);
    assert.equal(fmtP(r.p), e.p, `${e.pair}: p`);
    // Das Kit rechnet die Fehlervarianz mit Σw − k, mariposa offenbar mit abgerundetem Σw; das verschiebt
    // Standardfehler und Grenzen erst in der vierten Nachkommastelle (0,6255 statt 0,6250). Darum ±0,001.
    for (const [got, exp, what] of [[r.se, e.se, 'SE'], [r.lower, e.lo, 'lower'], [r.upper, e.hi, 'upper']] as const) {
      assert.ok(Math.abs(got - exp) <= 0.0011, `${e.pair}: ${what} ${got} statt ${exp}`);
    }
  });
  return rows;
}

test('foundation 3: age by mode, ANOVA and Tukey', { skip }, () => {
  const a = checkAnova('age × mode', AGE_MODE, col('age'), col('mode'));
  const n = a.groups.reduce((s, x) => s + x.n, 0);
  assert.equal(`F(${a.dfBetween}, ${a.dfWithin}) = ${a.F.toFixed(3)}, p < 0.001 ***, eta2 = ${a.eta2.toFixed(3)} (small), N = ${n}`, AGE_MODE_SHORT);
  checkTukey('age × mode', AGE_MODE_TUKEY, new Map([[2, 'CAPI'], [3, 'CAWI'], [4, 'MAIL']]), col('age'), col('mode'));
  assert.deepEqual([...raw('mode').valueLabels].filter(([k]) => k >= 2 && k <= 4).map(([, l]) => l), ['CAPI', 'CAWI', 'MAIL']);
});

test('task 3: left-right by place of residence, ANOVA, Tukey, counted single farms', { skip }, () => {
  checkAnova('pa01 × gs01', PA01_GS01, col('pa01'), col('gs01'));
  const labels = new Map(PA01_GS01.groups.map((g, k) => [k + 1, g.label]));
  assert.deepEqual([1, 2, 3, 4, 5].map(c => raw('gs01').valueLabels.get(c)), PA01_GS01.groups.map(g => g.label));
  const rows = checkTukey('pa01 × gs01', PA01_GS01_TUKEY, labels, col('pa01'), col('gs01'));
  const sig = rows.filter(r => r.p < 0.05).length;
  assert.equal(`pa01: ${rows.length} comparisons, ${sig} significant (p < .05)`, PA01_GS01_TUKEY_SHORT);
  const pa = col('pa01'), gs = col('gs01');
  assert.equal(pa.filter((x, i) => !Number.isNaN(x) && gs[i] === 5).length, PA01_EINZELHAUS_COUNTED);
});

function checkCor(name: string, expected: CorOut) {
  const m = corMatrix(expected.vars.map(col), w());
  const k = expected.vars.length;
  for (let i = 0; i < k; i++) for (let j = 0; j < k; j++) {
    const at = `${name} ${expected.vars[i]} × ${expected.vars[j]}`;
    eq3(m.r[i][j], expected.r[i][j], `${at}: r`);
    if (i !== j) assert.equal(fmtP(m.p[i][j]), expected.p[i][j], `${at}: p`);
    if (expected.n[i][j]) assert.equal(m.n[i][j], expected.n[i][j], `${at}: N`);
  }
  return m;
}

test('foundation 4 and task 4: correlation matrices', { skip }, () => {
  const g4 = checkCor('Grundlage 4', COR_G4);
  eq3(g4.ci[2][3][0], COR_G4_LS_HS_CI[0], 'ls01 × hs01: CI lower');
  eq3(g4.ci[2][3][1], COR_G4_LS_HS_CI[1], 'ls01 × hs01: CI upper');
  const a4 = checkCor('Aufgabe 4', COR_A4);
  let sig = 0, lo = Infinity, hi = 0;
  for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) {
    if (a4.p[i][j] < 0.05) sig++;
    lo = Math.min(lo, a4.n[i][j]);
    hi = Math.max(hi, a4.n[i][j]);
  }
  assert.equal(`${sig}/10 pairs significant (p < .05), N = ${lo}-${hi}`, COR_A4_SHORT);
});
