// Läuft nur mit der eigenen GESIS-Datei: ALLBUS_SAV=/pfad/ZA8831_v1-3-0.sav node --import tsx --test …
// Prüft die Referenzwerte aus Spezifikation 4.9 – nur Aggregate. Die Spezifikation nennt die Vorzeichen für ps03 im Original
// (positiv = unzufriedener); die Aufgabe polt ps03 um (Abschnitt 5), deshalb sind die Abstände hier negativ und die
// Konstanten und Vorhersagen 7 − Originalwert (2,76 → 4,24; 2,92 → 4,08).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { readSav } from '../../sandbox/readSav';
import { COMMON_CAUSES, GROUP_IDS, type BuilderBy, type BuilderCode, type BuilderHealth, type HealthCode } from './content';
import { board, builderData, builderModel, dummyVif, maxVif, checkControlled, patternOf, checkInteraction, checkModel, checkPrediction, checkSelection, core, interaction, modelStore, moverVariants, predictions, prepare, selection, wobbleTest, type ModelEntry } from './domain';

const file = process.env.ALLBUS_SAV;
const skip = !file && 'ALLBUS_SAV nicht gesetzt';
const load = () => {
  const bytes = readFileSync(file!);
  return prepare(readSav(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)));
};
const r = (x: number, d: number) => Math.round(x * 10 ** d) / 10 ** d;

test('session 10: dummies with reference West-Bleibende, CIs, invariant predictions and group sizes match spec 4.9', { skip }, () => {
  const p = load(), models = modelStore(p);
  const m = core(models, 4)!;
  assert.deepEqual([r(m.c, 2), r(m.b[1], 2), r(m.b[2], 2), r(m.b[3], 2)], [4.24, -0.71, -0.17, -0.03]);
  assert.deepEqual(m.ci[2].map(x => r(x, 2)), [-0.4, 0.07]);
  assert.deepEqual(m.ci[3].map(x => r(x, 2)), [-0.39, 0.32]);
  assert.deepEqual(m.ci[1].map(x => r(x, 2)), [-0.82, -0.59]);
  assert.equal(r(m.fit.r2, 3), 0.041);
  assert.deepEqual([m.n[1], m.n[2], m.n[3], m.n[4]], [1003, 91, 97, 2063]);
  // Vorhersage Ost→West 4,08 (Original 2,92) bei jeder Referenz
  for (const row of board(models)) assert.equal(r(predictions(row.model)[2].fit, 2), 4.08);
  // Referenz Ost-Bleibende (Original −0,54 / −0,67 / −0,71) und West→Ost (Ost→West, Original +0,13)
  const ost = core(models, 1)!;
  assert.deepEqual([r(ost.c, 2), r(ost.b[2], 2), r(ost.b[3], 2), r(ost.b[4], 2)], [3.54, 0.54, 0.67, 0.71]);
  assert.equal(r(core(models, 3)!.b[2], 2), -0.13);
  // Muster: Ost→West näher bei den West-Bleibenden („Ort“), West→Ost bei den West-Bleibenden („Prägung“) – kein Lager erklärt beide
  const pat = patternOf(m)!;
  assert.deepEqual([pat.movers[2], pat.movers[3], pat.pattern], ['ort', 'praegung', 'dazwischen']);
  // ungewichtet (Original 0,708 / 0,166 / 0,037)
  const u = core(models, 4, 'rev', false)!;
  assert.deepEqual([r(u.b[1], 3), r(u.b[2], 3), r(u.b[3], 3)], [-0.708, -0.166, -0.037]);
});

test('session 10: movers, selection, controls, the pt03 counter-check and the interaction match spec 4.9', { skip }, () => {
  const p = load(), models = modelStore(p);
  const mv = Object.fromEntries(moverVariants(p).map(v => [v.key, v]));
  assert.deepEqual([mv.model.ow, mv.model.wo], [91, 97]);
  assert.deepEqual([mv.all.ow, mv.all.wo], [139, 128]);
  assert.deepEqual([Math.round(mv.allWeighted.ow), Math.round(mv.allWeighted.wo)], [170, 67]);
  const s = selection(p);
  assert.deepEqual(GROUP_IDS.map(g => r(s.weighted[g], 1)), [40.5, 44.1, 78, 50]);
  // so druckt allbus %>% crosstab(dg03, abi, percentages = "row", weights = wghtpew) in mariposa 0.7.4 (gewichtete Zellen gerundet: 52/67)
  assert.deepEqual(GROUP_IDS.map(g => r(s.printed[g], 1)), [40.5, 44, 77.6, 50]);
  assert.match(checkSelection(s, '77.6%')[0].text, /^Stimmt \(gewichtet\)/);
  // gemeinsame Ursachen: West→Ost 0,155 (Original) → −0,155; Ost-Lücke 0,69 → −0,69
  const cc = models({ outcome: 'rev', ref: 4, controls: COMMON_CAUSES, weighted: true })!;
  assert.deepEqual([r(cc.b[1], 2), r(cc.b[2], 2), r(cc.b[3], 3)], [-0.69, -0.17, -0.155]);
  assert.deepEqual(cc.ci[3].map(x => r(x, 2)), [-0.5, 0.19]);
  assert.equal(r(cc.fit.r2, 3), 0.094);
  // Kontrollen, die Folgen sein können: Vertrauen drückt die Ost-Lücke auf 0,49
  const trust = models({ outcome: 'rev', ref: 4, controls: [...COMMON_CAUSES, 'pt03'], weighted: true })!;
  assert.deepEqual([r(trust.b[1], 2), r(trust.b[2], 2), r(trust.b[3], 2)], [-0.49, -0.1, -0.19]);
  const income = models({ outcome: 'rev', ref: 4, controls: [...COMMON_CAUSES, 'di08c'], weighted: true })!;
  assert.deepEqual([r(income.b[1], 2), r(income.b[2], 2), r(income.b[3], 2)], [-0.69, -0.18, -0.18]);
  const lage = models({ outcome: 'rev', ref: 4, controls: [...COMMON_CAUSES, 'ep03'], weighted: true })!;
  assert.deepEqual([r(lage.b[1], 3), r(lage.b[2], 2), r(lage.b[3], 2)], [-0.645, -0.19, -0.15]);
  // Gegenprobe mit pt03 (−0,49 / −0,25 / +0,30)
  const pt = core(models, 4, 'pt03')!;
  assert.deepEqual([r(pt.b[1], 2), r(pt.b[2], 2), r(pt.b[3], 2)], [-0.49, -0.25, 0.3]);
  // Interaktion 0,51 (p = .023) → −0,51; ohne Interaktion 0,36 / 0,32 → −0,36 / −0,32; R² wie das Gruppenmodell
  const it = interaction(p)!;
  assert.deepEqual([r(it.fit.coef[1], 2), r(it.fit.coef[2], 2), r(it.fit.coef[3], 2), r(it.fit.p[3], 3)], [-0.03, -0.17, -0.51, 0.023]);
  assert.deepEqual(it.additive!.coef.slice(1).map(x => r(x, 2)), [-0.36, -0.32]);
  assert.ok(Math.abs(it.fit.r2 - core(models, 4)!.fit.r2) < 1e-10);
});

test('session 10: VIF of the dummies match mariposa „Collinearity Statistics“ for every reference group', { skip }, () => {
  const p = load(), models = modelStore(p);
  const v = (ref: 1 | 2 | 3 | 4) => { const x = dummyVif(p, core(models, ref)!); return GROUP_IDS.filter(g => g !== ref).map(g => r(x[g], 3)); };
  assert.deepEqual(v(4), [1.01, 1.008, 1.004]);
  assert.deepEqual(v(1), [1.173, 1.079, 1.245]);
  assert.deepEqual(v(3), [9.53, 3.117, 10.927]);
  assert.deepEqual(maxVif(p, core(models, 3)!), { g: 4, vif: dummyVif(p, core(models, 3)!)[4] });
});

test('session 10: the wobble test stays far from the 0.7 both camps would need (concept values)', { skip }, () => {
  const models = modelStore(load());
  const w = Object.fromEntries(wobbleTest(core(models, 4)!).map(x => [x.g, x]));
  // Konzept (Original): Ost→West −0,02 … 0,26, West→Ost −0,12 … 0,13 – gerundet aus −0,015 … 0,255 und −0,123 … 0,134
  // (R: dfbeta(lm(…, weights = wghtpew)), explore7.R); umgepolt gespiegelt
  assert.deepEqual([r(w[2].lo, 3), r(w[2].hi, 3)], [-0.255, 0.015]);
  assert.deepEqual([r(w[3].lo, 3), r(w[3].hi, 3)], [-0.134, 0.123]);
  assert.ok(Math.abs(w[2].lo) < 0.7 && Math.abs(w[3].lo) < 0.7);
});

test('session 10: entries typed as R prints them (dot decimals, 78.0%) are recognised', { skip }, () => {
  const p = load(), models = modelStore(p);
  const e: ModelEntry = { c: '4.243', b: ['-0.705', '-0.166', '-0.034', ''] };
  assert.equal(checkModel(p, models, 4, e)[0].tone, 'ok');
  assert.equal(checkPrediction(core(models, 4), e, '4.077')[0].tone, 'ok');
  assert.match(checkSelection(selection(p), '78.0%')[0].text, /^Stimmt \(gewichtet\)/);
  assert.equal(checkControlled(models, 4, COMMON_CAUSES, { c: '', b: ['-0.692', '-0.170', '-0.155', ''] })[0].tone, 'ok');
  assert.match(checkInteraction(interaction(p), core(models, 4)!.fit.r2, '-0.506')[0].text, /^Stimmt: ost:ostjugend = −0,506 \(p = 0,023\)/);
});

// Einstieg: alle 30 Varianten, die das Element zeigen kann – B wie mariposa linear_regression(…, weights = wghtpew) druckt
// (R-Skript: rec(id02 / age / hs01) + to_dummy(), dann filter(!is.na(ls01), !is.na(<gruppe>), !is.na(gesundheit)) und je Formel ein Modell).
// Schlüssel: Gruppenvariable | Referenzgruppe | Gesundheit (ohne / plus = + / mal = *) | Referenz der Gesundheit (0 = nicht im Modell).
const BUILDER_R: Record<string, number[]> = {
  'schicht|1|ohne|0': [6.598, 0.941, 1.548], // ls01 ~ schicht_2 + schicht_3
  'schicht|1|plus|1': [7.172, 0.772, 1.203, -0.989], // ls01 ~ schicht_2 + schicht_3 + gesundheit_2
  'schicht|1|plus|2': [6.184, 0.772, 1.203, 0.989], // ls01 ~ schicht_2 + schicht_3 + gesundheit_1
  'schicht|1|mal|1': [7.371, 0.542, 0.923, -1.330, 0.419, 0.693], // ls01 ~ (schicht_2 + schicht_3) * gesundheit_2
  'schicht|1|mal|2': [6.041, 0.961, 1.616, 1.330, -0.419, -0.693], // ls01 ~ (schicht_2 + schicht_3) * gesundheit_1
  'schicht|2|ohne|0': [7.539, -0.941, 0.607], // ls01 ~ schicht_1 + schicht_3
  'schicht|2|plus|1': [7.944, -0.772, 0.431, -0.989], // ls01 ~ schicht_1 + schicht_3 + gesundheit_2
  'schicht|2|plus|2': [6.956, -0.772, 0.431, 0.989], // ls01 ~ schicht_1 + schicht_3 + gesundheit_1
  'schicht|2|mal|1': [7.912, -0.542, 0.381, -0.911, -0.419, 0.274], // ls01 ~ (schicht_1 + schicht_3) * gesundheit_2
  'schicht|2|mal|2': [7.002, -0.961, 0.655, 0.911, 0.419, -0.274], // ls01 ~ (schicht_1 + schicht_3) * gesundheit_1
  'schicht|3|ohne|0': [8.146, -1.548, -0.607], // ls01 ~ schicht_1 + schicht_2
  'schicht|3|plus|1': [8.375, -1.203, -0.431, -0.989], // ls01 ~ schicht_1 + schicht_2 + gesundheit_2
  'schicht|3|plus|2': [7.387, -1.203, -0.431, 0.989], // ls01 ~ schicht_1 + schicht_2 + gesundheit_1
  'schicht|3|mal|1': [8.294, -0.923, -0.381, -0.637, -0.693, -0.274], // ls01 ~ (schicht_1 + schicht_2) * gesundheit_2
  'schicht|3|mal|2': [7.657, -1.616, -0.655, 0.637, 0.693, 0.274], // ls01 ~ (schicht_1 + schicht_2) * gesundheit_1
  'alter|1|ohne|0': [7.248, 0.103, 0.335], // ls01 ~ alter_2 + alter_3
  'alter|1|plus|1': [7.583, 0.319, 0.796, -1.371], // ls01 ~ alter_2 + alter_3 + gesundheit_2
  'alter|1|plus|2': [6.211, 0.319, 0.796, 1.371], // ls01 ~ alter_2 + alter_3 + gesundheit_1
  'alter|1|mal|1': [7.631, 0.297, 0.647, -1.569, 0.133, 0.372], // ls01 ~ (alter_2 + alter_3) * gesundheit_2
  'alter|1|mal|2': [6.062, 0.430, 1.018, 1.569, -0.133, -0.372], // ls01 ~ (alter_2 + alter_3) * gesundheit_1
  'alter|2|ohne|0': [7.350, -0.103, 0.232], // ls01 ~ alter_1 + alter_3
  'alter|2|plus|1': [7.902, -0.319, 0.477, -1.371], // ls01 ~ alter_1 + alter_3 + gesundheit_2
  'alter|2|plus|2': [6.530, -0.319, 0.477, 1.371], // ls01 ~ alter_1 + alter_3 + gesundheit_1
  'alter|2|mal|1': [7.928, -0.297, 0.350, -1.436, -0.133, 0.239], // ls01 ~ (alter_1 + alter_3) * gesundheit_2
  'alter|2|mal|2': [6.492, -0.430, 0.588, 1.436, 0.133, -0.239], // ls01 ~ (alter_1 + alter_3) * gesundheit_1
  'alter|3|ohne|0': [7.582, -0.335, -0.232], // ls01 ~ alter_1 + alter_2
  'alter|3|plus|1': [8.378, -0.796, -0.477, -1.371], // ls01 ~ alter_1 + alter_2 + gesundheit_2
  'alter|3|plus|2': [7.007, -0.796, -0.477, 1.371], // ls01 ~ alter_1 + alter_2 + gesundheit_1
  'alter|3|mal|1': [8.277, -0.647, -0.350, -1.197, -0.372, -0.239], // ls01 ~ (alter_1 + alter_2) * gesundheit_2
  'alter|3|mal|2': [7.080, -1.018, -0.588, 1.197, 0.372, 0.239], // ls01 ~ (alter_1 + alter_2) * gesundheit_1
};

test('session 10, Einstieg: every model variant (reference, control, interaction) matches mariposa linear_regression()', { skip }, () => {
  const bytes = readFileSync(file!);
  const d = builderData(readSav(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)));
  let checked = 0;
  for (const [key, coefs] of Object.entries(BUILDER_R)) {
    const [by, ref, health, refH] = key.split('|');
    const m = builderModel(d, { by: by as BuilderBy, ref: Number(ref) as BuilderCode, health: health as BuilderHealth, refH: (Number(refH) || 1) as HealthCode })!;
    assert.deepEqual(m.terms.map(t => r(t.b, 3)), coefs, key);
    checked++;
  }
  assert.equal(checked, 30);
  // dieselben Befragten in jeder Variante; mariposa druckt N = round(Σw)
  const schicht = builderModel(d, { by: 'schicht', ref: 1, health: 'ohne', refH: 1 })!, alter = builderModel(d, { by: 'alter', ref: 1, health: 'mal', refH: 2 })!;
  assert.deepEqual([schicht.n, schicht.nPrinted, alter.n, alter.nPrinted], [5091, 5090, 5126, 5128]);
  assert.equal(builderModel(d, { by: 'schicht', ref: 3, health: 'mal', refH: 1 })!.formula, 'ls01 ~ (schicht_1 + schicht_2) * gesundheit_2');
  assert.deepEqual([r(schicht.r2, 3), r(builderModel(d, { by: 'schicht', ref: 2, health: 'plus', refH: 1 })!.r2, 3), r(alter.r2, 3)], [0.076, 0.137, 0.122]);
  // Gruppengrößen je Balken (ungewichtet): untere / mittlere / obere Schicht
  assert.deepEqual(schicht.cells.map(c => c.n), [1439, 2821, 831]);
});
