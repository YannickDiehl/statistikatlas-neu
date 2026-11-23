// Läuft nur mit der eigenen GESIS-Datei: ALLBUS_SAV=/pfad/ZA8831_v1-3-0.sav node --import tsx --test …
// Prüft die Referenzwerte aus Spezifikation 4.8 (gewichtet, ps03 umgepolt) – nur Aggregate.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { readSav } from '../../sandbox/readSav';
import { inputById } from './content';
import { checkLevene, checkSetting, checkSpread, leveneVariants, machineFor, parade, PLAY_X, PLAY_Y, playFit, playPoints, playPool, prepare, recognisedSetting, resolution, spread, variants, worseThanLazy, type Variant } from './domain';

const file = process.env.ALLBUS_SAV;
const skip = !file && 'ALLBUS_SAV nicht gesetzt';
const load = () => {
  const bytes = readFileSync(file!);
  return prepare(readSav(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)));
};
const r = (x: number, d: number) => Math.round(x * 10 ** d) / 10 ** d;

test('session 9: the pt03 automaton, its spread and Levene match spec 4.8', { skip }, () => {
  const p = load(), vars = variants(p, inputById.pt03);
  const get = (kind: Variant['kind']) => vars.find(v => v.kind === kind)!;
  const main = get('main');
  assert.equal(main.fit.n, 3577);
  assert.deepEqual([r(main.a, 3), r(main.b, 3), r(main.r2, 3), r(main.fit.sigma, 3)], [2.288, 0.465, 0.346, 1.031]);
  // Diagnosevarianten aus dem Konzept: ungewichtet, nicht umgepolt, Achsen vertauscht
  assert.deepEqual([r(get('unweighted').a, 3), r(get('unweighted').b, 3), r(get('unweighted').r2, 3)], [2.168, 0.479, 0.354]);
  assert.deepEqual([r(get('orig').a, 3), r(get('orig').b, 3)], [4.712, -0.465]);
  assert.equal(r(get('swapped').b, 3), 0.743);
  const m = machineFor(p, inputById.pt03, main, { a: '2,288', b: '0,465', r2: '0,346' });
  const s = spread(m);
  assert.deepEqual(s.groups.map(g => r(g.sd, 3)), [1.325, 1.25, 1.165, 0.988, 0.853, 0.713, 0.952]);
  assert.deepEqual([r(s.max, 2), s.maxAt, r(s.min, 2), s.minAt], [1.33, 1, 0.71, 6]);
  const lv = leveneVariants(m).main;
  assert.deepEqual([r(lv.F, 1), lv.df1, r(lv.df2, 1)], [74.9, 6, 3567.9]);
  assert.ok(lv.p < 0.001);
  const res = resolution(m);
  assert.deepEqual([Math.round(res.sse), Math.round(res.sst), Math.round(100 * res.reduction)], [3797, 5804, 35]);
  // Faulpelz 65,5 %, Automat 70,8 % (der Browser zeigt eine Nachkommastelle)
  assert.deepEqual([r(100 * res.lazyHit, 1), r(100 * res.hit, 1)], [65.5, 70.8]);
  // So, wie R es druckt (Punkt als Dezimalzeichen): summary() 2.288 / 0.465 / 0.346, describe() 0.713 / 1.325, levene_test() 74.860
  const printed = { a: '2.288', b: '0.465', r2: '0.346' };
  assert.equal(recognisedSetting(vars, printed), main);
  assert.match(checkSetting(inputById.pt03, vars, printed)[0].text, /^Stimmt: Der Automat zeigt 2,288 \+ 0,465 · Eingabe/);
  const mp = machineFor(p, inputById.pt03, main, printed);
  assert.deepEqual([mp.a, mp.b], [2.288, 0.465]);
  assert.equal(checkSpread(mp, spread(mp), '0.713', '1.325')[0].tone, 'ok');
  assert.match(checkLevene(mp, leveneVariants(mp), '74.860')[0].text, /^Stimmt: F\(6; 3\.567,9\) = 74,860/);
});

test('session 9: age – coefficients and residual spread per age group as R prints them (rounded constant and slope)', { skip }, () => {
  const p = load(), vars = variants(p, inputById.age), main = vars.find(v => v.kind === 'main')!;
  assert.deepEqual([r(main.a, 3), r(main.b, 3), r(main.r2, 3)], [3.95, 0.004, 0.003]);
  // summary(): 3.950 / 0.004 / 0.003; allbus %>% group_by(alter_gruppe) %>% describe(daneben, weights = wghtpew) mit anzeige = 3.950 + 0.004 * age
  const printed = { a: '3.950', b: '0.004', r2: '0.003' };
  assert.equal(recognisedSetting(vars, printed), main);
  const m = machineFor(p, inputById.age, main, printed), s = spread(m);
  assert.deepEqual(s.groups.map(g => r(g.sd, 3)), [1.164, 1.31, 1.349, 1.282, 1.085]);
  assert.equal(checkSpread(m, s, '1.085', '1.349')[0].tone, 'ok');
});

test('session 9: the parade of all ten inputs matches spec 4.8', { skip }, () => {
  const rows = parade(load(), true);
  const row = (id: string) => rows.find(x => x.item.id === id)!;
  // Faulpelz ±1: „65 %“ – je Eingabe 65,3 bis 65,9 %; bester Automat 71 % (70,8); bei 5 von 10 Eingaben trifft der Automat seltener
  assert.ok(rows.every(x => Math.floor(100 * x.lazyHit) === 65));
  assert.equal(Math.round(100 * Math.max(...rows.map(x => x.hit))), 71);
  assert.equal(worseThanLazy(rows), 5);
  assert.deepEqual([r(row('id02').b, 2), r(row('id02').r2, 2)], [0.41, 0.06]);
  assert.ok(row('age').p < 0.001);
  assert.equal(r(row('age').r2, 3), 0.003);
  assert.deepEqual(row('pa01').edges.map(x => r(x, 2)), [-0.85, -0.92]);
  assert.deepEqual(rows.map(x => r(x.b, 3)), [0.004, -0.018, -0.238, -0.14, 0.412, 0.177, -0.461, 0.691, -0.746, 0.465]);
  assert.deepEqual(rows.map(x => r(x.r2, 3)), [0.003, 0, 0.035, 0.037, 0.06, 0.07, 0.084, 0.196, 0.215, 0.346]);
});

// Einstieg „Eine Gerade durch die Punkte legen“: 15 Befragte nach fester Regel, geprüft in R (nur Kennwerte, keine Einzelfälle):
//   allbus %>% mutate(stunden = as.numeric(dw15), einkommen = rec(incc, rules = "1=100; 2=250; …; 25=8750; else=NA")) %>%
//     filter(stunden >= 1, !is.na(einkommen))                               → 2698 Befragte, Schritt floor(2698 / 15) = 179
//   punkte <- … %>% slice(seq(50, by = 179, length.out = 15))
//   punkte %>% linear_regression(einkommen ~ stunden)                         → (Intercept) 367.452, B 56.658, R Square 0.392,
//     Sum of Squares Residual 13243832.855, Total 21766395.833; Mittel einkommen 2225.833, stunden 32.800
test('session 9 Einstieg: the 15 points and their line from R match linear_regression() on the same rows', { skip }, () => {
  const bytes = readFileSync(file!);
  const sav = readSav(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
  assert.equal(playPool(sav)!.length, 2698);
  const pts = playPoints(sav)!;
  assert.equal(pts.length, 15);
  // alle Punkte liegen auf der Zeichenfläche
  assert.ok(pts.every(q => q.x >= PLAY_X[0] && q.x <= PLAY_X[1] && q.y >= PLAY_Y[0] && q.y <= PLAY_Y[1]));
  assert.equal(r(pts.reduce((s, q) => s + q.x, 0) / 15, 3), 32.8);
  const f = playFit(pts)!;
  assert.deepEqual([r(f.a, 3), r(f.b, 3), r(f.r2, 3), r(f.mean, 3)], [367.452, 56.658, 0.392, 2225.833]);
  assert.deepEqual([r(f.ssr, 3), r(f.sst, 3)], [13243832.855, 21766395.833]);
  // so zeigt es die Grafik: Fehlerquadrate in Millionen
  assert.deepEqual([r(f.ssr / 1e6, 1), r(f.sst / 1e6, 1)], [13.2, 21.8]);
});
