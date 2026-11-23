import test from 'node:test';
import assert from 'node:assert/strict';
import { fakeSav, fixtureSav } from '../../sandbox/testData';
import { inputById, INPUTS, TOOLBOX_SCRIPT } from './content';
import { rStyleProblems } from '../kit/rStyle';
import {
  answerName, compareGuess, checkDisplay, checkLevene, checkSetting, checkSpread, clampShow, codeNumber, compareLine, drawVisitors, groupValues, initialS08, lineScore,
  levelName, leveneVariants, lineAt, lineSse, lineThrough, machineFor, matchReading, NOT_ESTIMABLE, parade, paradeNotes, parseS08, pickInput, plenumLines,
  prepare, probeRows, probeTotals, recognisedLine, recognisedSetting, recognisedSpread, resolution, rSolution, scaffoldSetting, scaffoldSpread, scatter, shown,
  rSettingSolution, signQuestions, spread, spreadRecognised, statusS08, variants, worseThanLazy, type Variant,
  addPoint, clampPoint, incomeMid, INCOME_MID, lessThanMean, movePoint, PLAY_COUNT, PLAY_MAX, PLAY_MIN, playFit, playMean, playPoints, playPool, playSsr,
  pointsChanged, removePoint, type PlayPoint,
} from './domain';

const p = prepare(fixtureSav());
const pt03 = inputById.pt03, vars = variants(p, pt03);
const get = (kind: Variant['kind'], list = vars) => list.find(v => v.kind === kind)!;
const f3 = (x: number) => x.toFixed(3).replace('.', ',').replace('-', '−');
const main = get('main'), unw = get('unweighted');
const entry = (v: Variant) => ({ a: f3(v.a), b: f3(v.b), r2: f3(v.r2) });

test('reverses ps03, groups age like rec() and names the levels', () => {
  const sav = fakeSav({
    ps03: { values: [1, 6, -11, 3], missingFrom: -1 }, wghtpew: { values: [1, 1, 1, 1] }, age: { values: [18, 44, 75, -32], missingFrom: -1 },
  });
  const q = prepare(sav);
  assert.deepEqual([...q.y], [6, 1, NaN, 4]);
  assert.deepEqual([...groupValues(q, inputById.age)], [1, 2, 5, NaN]);
  assert.equal(levelName(pt03, 1), 'Eingabe 1 („gar kein Vertrauen“)');
  assert.equal(levelName(pt03, 4), 'Eingabe 4');
  assert.equal(levelName(inputById.age, 5), 'Alter 75+');
});

test('computes the automaton variants: weight, coding of ps03, swapped axes, age groups', () => {
  assert.deepEqual(vars.map(v => v.kind), ['main', 'unweighted', 'orig', 'origUnweighted', 'swapped', 'swappedUnweighted']);
  assert.ok(Math.abs(get('orig').b + main.b) < 1e-12 && Math.abs(get('orig').a - (7 - main.a)) < 1e-12);
  assert.ok(Math.abs(get('swapped').r2 - main.r2) < 1e-12);
  assert.ok(variants(p, inputById.age).some(v => v.kind === 'grouped'));
  assert.deepEqual(matchReading(0.4652, '0,47'), { x: 0.47, decimals: 2 });
  assert.equal(matchReading(0.4652, '0,5'), null);
  // R druckt mit Punkt: „2.288“ ist 2,288, nicht 2288; describe() lässt Nullen am Ende weg (1,300 → „1.3“)
  assert.deepEqual(matchReading(2.2875, '2.288'), { x: 2.288, decimals: 3 });
  assert.deepEqual(matchReading(2288, '2.288', 0), { x: 2288, decimals: 0 });
  assert.deepEqual(matchReading(1.3, '1.3'), { x: 1.3, decimals: 1 });
  assert.equal(matchReading(1.34, '1.3'), null);
  assert.equal(shown('-0,2170', [-0.217]), '−0,2170');
  assert.equal(shown('1.325', [1.3252]), '1,325');
  assert.equal(shown('9,9', [1.3252]), '9,9 (noch nicht geprüft)');
});

test('the setting detector recognises weighted and unweighted, names every other variant', () => {
  const ok = checkSetting(pt03, vars, entry(main));
  assert.equal(ok[0].tone, 'ok');
  assert.match(ok[0].text, /^Stimmt: Der Automat zeigt 5,126 − 0,217 · Eingabe, gewichtet/);
  assert.equal(recognisedSetting(vars, entry(main)), main);
  assert.match(checkSetting(pt03, vars, entry(unw))[0].text, /ohne Gewicht.*ungewichtet/);
  assert.equal(recognisedSetting(vars, entry(unw)), unw);
  const orig = get('orig');
  const notOk = checkSetting(pt03, vars, { a: f3(orig.a), b: f3(orig.b), r2: f3(orig.r2) });
  assert.equal(notOk.length, 2);
  assert.match(notOk[0].text, /^Konstante: .*ohne Umpolen/);
  assert.match(notOk[1].text, /^Steigung: Das Vorzeichen ist gedreht\..*rec\(ps03, rules = "rev"\)/);
  assert.equal(recognisedSetting(vars, { a: f3(orig.a), b: f3(orig.b), r2: f3(orig.r2) }), null);
  assert.match(checkSetting(pt03, vars, { ...entry(main), b: f3(get('swapped').b) })[0].text, /Achsen vertauscht/);
  assert.match(checkSetting(pt03, vars, { ...entry(main), b: f3(main.beta) })[0].text, /Beta/);
  assert.match(checkSetting(pt03, vars, { ...entry(main), r2: f3(main.adjR2) })[0].text, /korrigierte R²/);
  assert.match(checkSetting(pt03, vars, { ...entry(main), r2: f3(Math.sqrt(main.r2)) })[0].text, /Wurzel aus R²/);
  assert.match(checkSetting(pt03, vars, { ...entry(main), a: '9,999' })[0].text, /^Konstante: Diesen Wert finde ich nicht/);
  assert.match(checkSetting(pt03, vars, { ...entry(main), a: '5,1' })[0].text, /drei Nachkommastellen/);
  assert.match(checkSetting(pt03, vars, { ...entry(main), a: 'x' })[0].text, /keine Zahl/);
  assert.match(checkSetting(pt03, vars, { ...entry(main), a: f3(unw.a) })[0].text, /nicht alle zur selben Rechnung/);
  assert.deepEqual(checkSetting(pt03, vars, { a: '', b: '', r2: '' }), []);
  const age = variants(p, inputById.age), grouped = get('grouped', age);
  assert.match(checkSetting(inputById.age, age, { ...entry(get('main', age)), b: f3(grouped.b) })[0].text, /Altersgruppen/);
});

test('numbers typed as R prints them (dot decimals) are read as R decimals everywhere', () => {
  const dot = (x: number, d = 3) => x.toFixed(d).replace('-', '−');
  const set = { a: dot(main.a), b: dot(main.b), r2: dot(main.r2) };
  assert.equal(recognisedSetting(vars, set), main);
  assert.match(checkSetting(pt03, vars, set)[0].text, /^Stimmt: Der Automat zeigt 5,126 − 0,217 · Eingabe/);
  const m = machineFor(p, pt03, main, set);
  assert.ok(Math.abs(m.a - 5.126) < 1e-12 && Math.abs(m.b + 0.217) < 1e-12);
  assert.equal(checkDisplay(m, 2, dot(m.a + m.b * 2, 2))[0].tone, 'ok');
  const s = spread(m);
  assert.ok(spreadRecognised(s, dot(s.min), dot(s.max)));
  const lv = leveneVariants(m);
  assert.equal(checkLevene(m, lv, dot(lv.main.F))[0].tone, 'ok');
  // Plenumskarte normalisiert erkannte Werte
  const lines = Object.fromEntries(plenumLines({ ...initialS08(), input: 'pt03', ...set, sdMin: dot(s.min), sdMax: dot(s.max) }, main, null, s));
  assert.equal(lines['b · R²'], `b = ${f3(main.b)} · R² = ${f3(main.r2)}`);
  assert.equal(lines['Daneben je Stufe'], `±${f3(s.min)} bis ±${f3(s.max)}`);
});

test('a model that cannot be estimated gets an explanation instead of a value hint', () => {
  const tiny = prepare(fakeSav({ ps03: { values: [1, 2, 3], missingFrom: -1 }, wghtpew: { values: [1, 1, 1] }, pt03: { values: [4, 4, 4], missingFrom: -1 } }));
  const v = variants(tiny, pt03);
  assert.equal(v.some(x => x.kind === 'main'), false);
  assert.deepEqual(checkSetting(pt03, v, { a: '1,000', b: '', r2: '' }), [{ tone: 'warn', text: NOT_ESTIMABLE }]);
});

test('an unweighted automaton accepts the weighted spread and Levene from the scaffold; the weighted one names the unweighted', () => {
  const u = get('unweighted'), mu = machineFor(p, pt03, u, entry(u));
  const own = spread(mu), weighted = spread(mu, true);
  assert.equal(own.weighted, false);
  assert.notEqual(own.max, weighted.max);
  assert.ok(Math.abs(own.other.max - weighted.max) < 1e-12);
  assert.equal(recognisedSpread(mu, f3(weighted.min), f3(weighted.max))?.weighted, true);
  assert.match(checkSpread(mu, own, f3(weighted.min), f3(weighted.max))[0].text, /mit Gewicht gerechnet, deinen Automaten ohne – beides ist vertretbar/);
  const lvu = leveneVariants(mu);
  assert.notEqual(lvu.main.F, lvu.other.F);
  assert.match(checkLevene(mu, lvu, f3(lvu.other.F))[0].text, /^Stimmt: .*beides ist vertretbar/);
  const mw = machineFor(p, pt03, main, entry(main)), sw = spread(mw), lvw = leveneVariants(mw);
  assert.equal(recognisedSpread(mw, f3(sw.other.min), f3(sw.other.max)), null);
  assert.match(checkSpread(mw, sw, f3(sw.min), f3(sw.other.max))[0].text, /SD ohne Gewicht/);
  assert.match(checkLevene(mw, lvw, f3(lvw.other.F))[0].text, /ohne Gewicht/);
});

test('hand displays: constant + slope × input, with typical slips named', () => {
  const m = machineFor(p, pt03, main, entry(main));
  const at2 = m.a + m.b * 2;
  assert.match(checkDisplay(m, 2, at2.toFixed(2).replace('.', ','))[0].text, /Eingabe 2: 5,126 − 0,217 · 2 = .* – stimmt/);
  assert.match(checkDisplay(m, 2, (m.b * 2).toFixed(2).replace('.', ','))[0].text, /fehlt die Konstante/);
  assert.match(checkDisplay(m, 2, m.a.toFixed(2).replace('.', ','))[0].text, /nur die Konstante/);
  assert.match(checkDisplay(m, 2, '9,99')[0].text, /Rechne Konstante/);
  assert.match(checkDisplay(m, 2, '4')[0].text, /zwei Nachkommastellen/);
  assert.deepEqual(checkDisplay(m, 2, ''), []);
});

test('the visitor sample is the same for the same code and differs for another', () => {
  const m = machineFor(p, pt03, main, entry(main));
  const a = drawVisitors(m, 417), b = drawVisitors(m, 417), c = drawVisitors(m, 418);
  assert.equal(a.length, Math.min(20, m.y.length));
  assert.deepEqual(a, b);
  assert.notDeepEqual(a, c);
  assert.equal(new Set(a).size, a.length);
  const rows = probeRows(m, a), t = probeTotals(rows);
  assert.ok(rows.every(r => r.lazy === m.mean && r.hit === Math.abs(r.y - r.show) <= 1));
  assert.ok(t.hits <= rows.length && t.lazyHits <= rows.length && t.sse > 0);
  assert.equal(codeNumber('417'), 417);
  assert.equal(codeNumber('41'), null);
  assert.equal(codeNumber('41a7'), null);
});

test('the resolution: fewer squared errors is R², hits compare with the lazy machine, no other line beats OLS', () => {
  const m = machineFor(p, pt03, main, entry(main));
  const r = resolution(m);
  assert.ok(Math.abs(r.reduction - main.r2) < 1e-12);
  assert.ok(r.hit >= 0 && r.hit <= 1 && r.lazyHit >= 0 && r.lazyHit <= 1);
  assert.ok(r.near.every(n => Math.abs(n.value - r.mean) <= 1));
  // „die häufigsten Antworten“ wird berechnet, nicht behauptet
  const byShare = (vals: number[]) => vals.map(v => m.y.reduce((a, y, i) => a + (y === v ? m.w[i] : 0), 0));
  const all = [...new Set(m.y)], near = r.near.map(n => n.value);
  const top = all.sort((x, y) => byShare([y])[0] - byShare([x])[0]).slice(0, near.length);
  assert.equal(r.nearAreTop, near.every(v => top.includes(v)));
  const best = lineScore(m, main.a, main.b).sse;
  assert.ok(Math.abs(best - main.fit.ssResidual) < 1e-9);
  for (const [da, db] of [[0.1, 0], [0, 0.05], [-0.2, 0.02]]) assert.ok(lineScore(m, main.a + da, main.b + db).sse > best);
});

test('residual spread per level: recognised min/max, diagnoses for other weights, overall spread, other levels and means', () => {
  const m = machineFor(p, pt03, main, entry(main)), s = spread(m);
  assert.deepEqual(s.groups.map(g => g.value), [1, 2, 3, 4, 5, 6, 7]);
  assert.ok(s.min <= s.max && s.max / s.min > 1);
  assert.ok(Math.abs(s.sigma - main.fit.sigma) < 1e-12);
  const lo = f3(s.min), hi = f3(s.max);
  assert.ok(spreadRecognised(s, lo, hi));
  assert.ok(spreadRecognised(s, hi, lo));
  assert.equal(checkSpread(m, s, lo, hi)[0].tone, 'ok');
  assert.match(checkSpread(m, s, lo, hi)[0].text, /am ungenauesten bei Eingabe 7/);
  assert.ok(!spreadRecognised(s, lo, '9,999'));
  assert.match(checkSpread(m, s, lo, f3(s.other.max))[0].text, /ohne Gewicht/);
  assert.match(checkSpread(m, s, lo, f3(s.sigma))[0].text, /über alle Befragten/);
  const middle = s.groups.find(g => Number.isFinite(g.sd) && g.sd !== s.min && g.sd !== s.max)!;
  assert.match(checkSpread(m, s, lo, f3(middle.sd))[0].text, /Das ist die SD bei Eingabe/);
  assert.match(checkSpread(m, s, lo, f3(s.groups[1].mean))[0].text, /Mittelwert der Residuen/);
  assert.match(checkSpread(m, s, lo, '9,999')[0].text, /finde ich nicht/);
  assert.match(checkSpread(m, s, lo, '1,3')[0].text, /drei Nachkommastellen/);
  assert.deepEqual(checkSpread(m, s, '', ''), []);
});

test('Levene as a pro extra: mean centre with own weights; other weights and median named', () => {
  const m = machineFor(p, pt03, main, entry(main)), lv = leveneVariants(m);
  assert.match(checkLevene(m, lv, lv.main.F.toFixed(3).replace('.', ','))[0].text, /^Stimmt: F\(6; 12,3\) = .*dasselbe wie für die Zufriedenheit selbst/);
  assert.match(checkLevene(m, lv, lv.other.F.toFixed(3).replace('.', ','))[0].text, /ohne Gewicht/);
  assert.match(checkLevene(m, lv, lv.median.F.toFixed(3).replace('.', ','))[0].text, /Median/);
  assert.match(checkLevene(m, lv, '99,999')[0].text, /finde ich nicht/);
  assert.deepEqual(checkLevene(m, lv, ''), []);
});

test('sign questions: missing error, overclaim, causal words, missing group – and a short confirmation when the sign is fine', () => {
  const m = machineFor(p, pt03, main, entry(main)), s = spread(m);
  const all = signQuestions('Der Automat weiß, wie zufrieden du bist, weil Vertrauen zufrieden macht.', pt03, s).map(n => n.text).join(' | ');
  assert.match(all, /typischerweise daneben\? Im Mittel etwa ±/);
  assert.match(all, /Durchschnitt von Menschen/);
  assert.match(all, /oder geht es auch umgekehrt/);
  assert.match(all, /Für wen liegt er weiter daneben\? Bei Eingabe 7/);
  // ein gutes Schild: keine Gegenfrage, nur eine Bestätigung
  const fine = signQuestions('Er zeigt den Durchschnitt und liegt im Mittel ±1,6 daneben, bei manchen Menschen mehr.', pt03, s);
  assert.deepEqual(fine.map(n => n.tone), ['ok']);
  assert.deepEqual(signQuestions('', pt03, s), []);
  // „weiß“ endet auf ß – die Wortgrenze muss trotzdem greifen; „Weißwein“ nicht
  assert.ok(signQuestions('Er weiß es ±1 daneben bei manchen Menschen.', pt03, s).some(n => /Durchschnitt von Menschen/.test(n.text)));
  assert.ok(!signQuestions('Weißwein ±1 daneben bei manchen Menschen.', pt03, s).some(n => /Durchschnitt von Menschen/.test(n.text)));
  // Ohne erkannte Streuung: dieselben Fragen ohne Zahl
  const plain = signQuestions('Menschen wie du sind so zufrieden.', pt03, null).map(n => n.text);
  assert.ok(plain.every(t => !/\d/.test(t.replace('Schritt 6', ''))), plain.join(' | '));
});

test('the parade covers all ten inputs and counts where the automaton hits less often than the lazy machine', () => {
  const rows = parade(p, true);
  assert.equal(rows.length, INPUTS.length);
  assert.equal(worseThanLazy(rows), rows.filter(r => r.hit < r.lazyHit - 1e-12).length);
  assert.match(paradeNotes(rows)[0], /^Bei \d+ von 10 Eingaben trifft der Automat auf ±1 seltener als der Faulpelz/);
  assert.equal(parade(p, false).length, INPUTS.length);
});

test('state: defensive parse, a new input resets everything that depends on it, status and plenum lines', () => {
  assert.deepEqual(parseS08(null), initialS08());
  assert.deepEqual(parseS08({ input: 'xx', mode: 'drei', guess: 'vielleicht', decision: 'jein', shows: 'no', a: 42 }), initialS08());
  const s = { ...initialS08(), mode: 'pair' as const, code: '417', input: 'pt03' as const, a: '2,288', b: '0,465', r2: '0,346', sdMin: '0,713', sdMax: '1,325', guess: 'Automat' as const, guessLocked: true, sign: 'Schild', decision: 'nur mit Schild freigeben' as const };
  assert.deepEqual(parseS08(JSON.parse(JSON.stringify(s))), s);
  assert.equal(statusS08(initialS08()), 'open');
  assert.equal(statusS08({ ...initialS08(), input: 'pt03' }), 'running');
  assert.equal(statusS08(s), 'done');
  assert.equal(statusS08({ ...s, guess: '' }), 'running');
  const next = pickInput(s, 'age');
  assert.deepEqual(next, { ...initialS08(), mode: 'pair', code: '417', input: 'age' });
  // Die Zahlen aus s passen nicht zur Testdatei: roh und als „noch nicht geprüft“ markiert
  const lines = Object.fromEntries(plenumLines({ ...s, signedTech: true, signedCurator: true }, recognisedSetting(vars, s), null));
  assert.equal(lines.Eingabe, 'Vertrauen in den Bundestag (pt03)');
  assert.equal(lines['b · R²'], 'b = 0,465 · R² = 0,346 (noch nicht geprüft)');
  assert.equal(lines['Treffer ±1'], '');
  assert.equal(lines['Daneben je Stufe'], '±0,713 bis ±1,325 (noch nicht geprüft)');
  assert.equal(lines.Entscheidung, 'nur mit Schild freigeben (unterschrieben: Technik und Kuratorin)');
});

test('R code: tidyverse then mariposa, %>% pipe style, solution for every input, scaffolds with gaps, grouping for age', () => {
  for (const item of INPUTS) {
    const setting = rSettingSolution(item), code = rSolution(item, { a: 2.288, b: -0.465 });
    const g = item.groups ? 'alter_gruppe' : item.id;
    assert.match(setting, /^library\(tidyverse\)\nlibrary\(mariposa\)\n/);
    assert.match(setting, /# Im Codebuch [^\n]*\ncodebook\(allbus\)\n/);
    assert.match(setting, /allbus <- allbus %>%\n  mutate\(\n    demokratie = rec\(ps03, rules = "rev"\)\n  \)/);
    assert.match(setting, new RegExp(`automat <- allbus %>%\n  linear_regression\\(demokratie ~ ${item.id}, weights = wghtpew\\)\n\n# [^\n]*\nsummary\\(automat\\)`));
    // die Lösung zu „einstellen“ verrät keine Zahlen
    assert.doesNotMatch(setting, /\d\.\d{3}/);
    assert.ok(code.startsWith(setting));
    assert.match(code, new RegExp(`allbus <- allbus %>%\n  mutate\\(\n    anzeige = 2\\.288 - 0\\.465 \\* ${item.id},\n    daneben = demokratie - anzeige\n  \\)`));
    assert.match(code, new RegExp(`allbus %>%\n  group_by\\(${g}\\) %>%\n  describe\\(daneben, weights = wghtpew\\)`));
    assert.match(code, new RegExp(`allbus %>%\n  levene_test\\(daneben, group = ${g}, weights = wghtpew\\)`));
    for (const c of [setting, code, scaffoldSetting(item), scaffoldSpread(item)]) {
      assert.doesNotMatch(c, /\|>|coef\(|ifelse|%in%|library\(dplyr\)|suffix =/);
      assert.doesNotMatch(c, /codebook\(allbus, /);
      // Jeder Aufruf mit Datensatz läuft über die Pipe: kein (allbus, …) außer codebook(allbus).
      assert.doesNotMatch(c.replace(/codebook\(allbus\)/g, ''), /\(allbus\b/);
    }
  }
  assert.match(rSolution(pt03, { a: 1, b: 0.5 }), /anzeige = 1\.000 \+ 0\.500 \* pt03/);
  assert.match(rSolution(pt03, null), /anzeige = ___ \+ ___ \* pt03/);
  assert.match(rSolution(inputById.age, null), /allbus <- allbus %>%\n  mutate\(\n    alter_gruppe = rec\(age, rules = "18:29=1 \[18-29\]/);
  assert.match(scaffoldSetting(pt03), /mutate\(\n    demokratie = rec\(___, rules = "___"\)\n  \)/);
  assert.match(scaffoldSetting(pt03), /automat <- allbus %>%\n  linear_regression\(___ ~ pt03, weights = ___\)/);
  assert.match(scaffoldSpread(pt03), /anzeige = ___ \+ ___ \* pt03/);
  assert.match(scaffoldSpread(pt03), /allbus %>%\n  group_by\(___\) %>%\n  describe\(daneben, weights = ___\)/);
  assert.match(scaffoldSpread(inputById.age), /alter_gruppe = rec\(age/);
});

test('toolbox script: tidyverse then mariposa, whole codebook, every tool of the session on neutral variables, pipe style', () => {
  assert.match(TOOLBOX_SCRIPT, /^library\(tidyverse\)\nlibrary\(mariposa\)\n/);
  for (const call of ['codebook(allbus)\n', 'allbus <- allbus %>%\n  mutate(\n    ausblick = rec(ep04, rules = "rev")\n  )', 'modell <- allbus %>%\n  linear_regression(ausblick ~ pt12, weights = wghtpew)', 'summary(modell)',
    '    vorhersage = 1.887 + 0.194 * pt12,\n    residuum   = ausblick - vorhersage\n',
    'allbus %>%\n  group_by(pt12) %>%\n  describe(residuum, weights = wghtpew)', 'allbus %>%\n  levene_test(residuum, group = pt12, weights = wghtpew)']) assert.ok(TOOLBOX_SCRIPT.includes(call), call);
  // nie an den Variablen der Aufgabe
  for (const v of ['ps03', ...INPUTS.map(i => i.id)]) assert.doesNotMatch(TOOLBOX_SCRIPT, new RegExp(`\\b${v}\\b`), v);
  assert.doesNotMatch(TOOLBOX_SCRIPT, /\|>|coef\(|codebook\(allbus, |suffix =/);
  assert.doesNotMatch(TOOLBOX_SCRIPT.replace(/codebook\(allbus\)/g, ''), /\(allbus\b/);
});

test('guess lock: the resolution counts only after the tip; old saves with a guess count as locked', () => {
  const base = { ...initialS08(), input: 'pt03' as const, a: '2,288', b: '0,465', r2: '0,346', sdMin: '0,713', sdMax: '1,325', sign: 'Schild', decision: 'freigeben' as const };
  assert.equal(statusS08({ ...base, guess: 'Automat', guessLocked: false }), 'running');
  assert.equal(statusS08({ ...base, guess: 'Automat', guessLocked: true }), 'done');
  // gespeichert vor dem Tipp-Schloss: kein Feld guessLocked
  const legacy: Record<string, unknown> = { ...base, guess: 'Faulpelz' };
  delete legacy.guessLocked;
  assert.equal(parseS08(legacy).guessLocked, true);
  assert.equal(parseS08({ ...base, guess: 'Faulpelz', guessLocked: false }).guessLocked, false);
  assert.equal(parseS08({ ...base, guess: '', guessLocked: true }).guessLocked, false);
  assert.equal(parseS08({ ...base, guess: 'Faulpelz', guessLocked: 'ja' }).guessLocked, true);
  assert.equal(pickInput({ ...base, guess: 'Automat', guessLocked: true }, 'age').guessLocked, false);
});

test('your line first: the scatter shows the mean per answer (age in five-year steps), the handles span the answers', () => {
  const sc = scatter(p, pt03, main);
  assert.equal(sc.binned, false);
  assert.deepEqual(sc.dots.map(d => d.x), [...new Set(main.fit.rows.map(i => p.sav.byName.get('pt03')!.values[i]))].sort((a, b) => a - b));
  assert.equal(sc.dots.reduce((a, d) => a + d.n, 0), main.fit.n);
  assert.equal(sc.xMin, sc.dots[0].x);
  assert.equal(sc.xMax, sc.dots[sc.dots.length - 1].x);
  assert.ok(sc.dots.every(d => d.mean >= 1 && d.mean <= 6));
  // gewichtete Mittel je Antwort: über alle Antworten gemittelt ergibt sich der gewichtete Durchschnitt
  const age = inputById.age, va = get('main', variants(p, age)), sa = scatter(p, age, va);
  assert.ok(sa.dots.length <= 17, String(sa.dots.length));
  assert.ok(sa.dots.every(d => d.x >= sa.xMin && d.x <= sa.xMax));
  assert.equal(sa.dots.reduce((a, d) => a + d.n, 0), va.fit.n);
  assert.equal(sa.binned, new Set(va.fit.rows.map(i => p.sav.byName.get('age')!.values[i])).size > 15);
});

test('your line first: two handles make a line; its squared errors never beat R', () => {
  const l = lineThrough(1, 3, 7, 5.4);
  assert.ok(Math.abs(lineAt(l, 1) - 3) < 1e-12 && Math.abs(lineAt(l, 7) - 5.4) < 1e-12 && Math.abs(l.b - 0.4) < 1e-12);
  assert.deepEqual(lineThrough(2, 3, 2, 5), { a: 3, b: 0 });
  assert.deepEqual([clampShow(0.2), clampShow(7), clampShow(3.04)], [1, 6, 3]);
  const real = { a: main.a, b: main.b };
  assert.ok(Math.abs(lineSse(p, pt03, main, real) - main.fit.ssResidual) < 1e-6);
  for (const l2 of [{ a: main.a + 0.2, b: main.b }, { a: main.a, b: main.b + 0.05 }, { a: 3.5, b: 0 }]) assert.ok(lineSse(p, pt03, main, l2) > main.fit.ssResidual);
  // Konstante und Steigung genügen für den Vergleich; R² darf noch fehlen
  assert.equal(recognisedLine(vars, { a: f3(main.a), b: f3(main.b), r2: '' }), main);
  assert.equal(recognisedLine(vars, { a: f3(unw.a), b: f3(unw.b), r2: '' }), unw);
  assert.equal(recognisedLine(vars, { a: f3(main.a), b: '9,999', r2: '' }), null);
  assert.equal(answerName(pt03, 1), 'Antwort 1 („gar kein Vertrauen“)');
  assert.equal(answerName(pt03, 4), 'Antwort 4');
  assert.equal(answerName(inputById.age, 18), 'Alter 18');
});

test('your line first: the comparison names steeper, flatter, the wrong direction, a shifted line and least squares', () => {
  const real = { a: 2.288, b: 0.465 };
  const text = (own: { a: number; b: number }, sse?: { own: number; real: number }) => compareLine(pt03, own, real, 1, 7, sse).map(n => n.text).join(' | ');
  assert.match(text(lineThrough(1, 2, 7, 6)), /^Von Antwort 1 \(„gar kein Vertrauen“\) bis Antwort 7 \(„großes Vertrauen“\): Deine Anzeige steigt um 4,0 Punkte, die echte steigt um 2,8 Punkte\. Deine Gerade ist steiler als die echte – du hast den Zusammenhang überschätzt\./);
  assert.match(text(lineThrough(1, 3.5, 7, 4.5)), /flacher als die echte – du hast den Zusammenhang unterschätzt/);
  assert.match(text(lineThrough(1, 5, 7, 3)), /Deine Gerade fällt, die echte steigt – du hast die Richtung des Zusammenhangs falsch eingeschätzt/);
  const good = compareLine(pt03, lineThrough(1, 2.8, 7, 5.5), real, 1, 7, { own: 3800, real: 3797 });
  assert.equal(good[0].tone, 'ok');
  assert.match(good[0].text, /Deine Steigung passt gut/);
  assert.match(good.map(n => n.text).join(' '), /fast gleich\. Sehr gut geschätzt/);
  assert.match(text(lineThrough(1, 3.4, 7, 6)), /Insgesamt liegt deine Gerade zu hoch: Bei Antwort 4 zeigt dein Automat/);
  assert.match(text(lineThrough(1, 2.8, 7, 5.5)), /In Zahlen: deine Konstante 2,35, deine Steigung 0,450; aus R: Konstante 2,29, Steigung 0,465\.$/);
  assert.match(text(lineThrough(1, 2, 7, 6)), /Eingabe 0 links außerhalb der Skala/);
  assert.match(text(lineThrough(1, 2, 7, 6), { own: 4500, real: 3797 }), /deine Gerade 4\.500, die echte 3\.797 – deine hat 19 % mehr\. .*„kleinste Quadrate“/);
  // fast flache echte Gerade (Alter): zwei flache Geraden passen, eine steile überschätzt
  const age = inputById.age, flat = { a: 3.95, b: 0.004 };
  assert.match(compareLine(age, lineThrough(18, 4, 99, 4.1), flat, 18, 99)[0].text, /^Von Alter 18 bis Alter 99: .*Beide Geraden sind fast flach/);
  assert.match(compareLine(age, lineThrough(18, 3, 99, 5.2), flat, 18, 99)[0].text, /steiler als die echte – du hast den Zusammenhang überschätzt\. Die echte ist fast flach\./);
});

test('your line first: state keeps the line, parses defensively and resets with a new question', () => {
  const s = { ...initialS08(), input: 'pt03' as const, myLine: { a: 2.5, b: 0.4 }, lineLocked: true };
  assert.deepEqual(parseS08(JSON.parse(JSON.stringify(s))), s);
  assert.deepEqual(parseS08({ ...s, myLine: { a: 'x', b: 1 } }), { ...s, myLine: null, lineLocked: false });
  assert.deepEqual(parseS08({ ...s, myLine: { a: 1e9, b: 1 } }).myLine, null);
  assert.equal(parseS08({ ...s, myLine: null }).lineLocked, false);
  assert.deepEqual(pickInput(s, 'age'), { ...initialS08(), input: 'age' });
  assert.equal(statusS08({ ...initialS08(), input: 'pt03', lineLocked: true, myLine: { a: 1, b: 0 } }), 'running');
  const lines = Object.fromEntries(plenumLines(s, main, null));
  assert.equal(lines['Getippte Steigung'], `0,400 (aus R: ${f3(main.b)})`);
  assert.equal(Object.fromEntries(plenumLines({ ...s, lineLocked: false }, null, null))['Getippte Steigung'], '');
});

test('the guess „Wer trifft öfter?“ is compared with the resolution', () => {
  const res = { sse: 1, sst: 2, reduction: 0.5, hit: 0.62, lazyHit: 0.65, mean: 4.2, near: [], nearAreTop: true };
  assert.equal(compareGuess('Faulpelz', res)[0].tone, 'ok');
  assert.match(compareGuess('Automat', res)[0].text, /Die Daten: der Faulpelz trifft öfter/);
  assert.equal(compareGuess('beide gleich oft', { ...res, hit: 0.652, lazyHit: 0.654 })[0].tone, 'ok');
  assert.deepEqual(compareGuess('', res), []);
});

test('Schriftbild: every R code block of the session passes rStyleProblems (toolbox, hints and solutions for all ten inputs)', () => {
  const blocks: [string, string][] = [['toolbox', TOOLBOX_SCRIPT]];
  for (const item of INPUTS) {
    blocks.push([`setting ${item.id}`, rSettingSolution(item)], [`scaffold setting ${item.id}`, scaffoldSetting(item)], [`scaffold spread ${item.id}`, scaffoldSpread(item)]);
    for (const line of [null, { a: 2.288, b: -0.465 }, { a: 3.95, b: 0.004 }]) blocks.push([`solution ${item.id} ${JSON.stringify(line)}`, rSolution(item, line)]);
  }
  for (const [name, code] of blocks) assert.deepEqual(rStyleProblems(code), [], name);
});

/* ---------- Einstieg: Gerade durch Punkte legen ---------- */
const pts = (xy: [number, number][]): PlayPoint[] => xy.map(([x, y], id) => ({ id, x, y }));
const close = (a: number, b: number, tol = 1e-9) => assert.ok(Math.abs(a - b) <= tol * Math.max(1, Math.abs(b)), `${a} ≠ ${b}`);

test('Einstieg: income groups become the middle of their euro range; the open top group stays out', () => {
  assert.equal(INCOME_MID.length, 25);
  assert.deepEqual([incomeMid(1), incomeMid(2), incomeMid(5), incomeMid(13), incomeMid(19), incomeMid(25)], [100, 250, 562.5, 1625, 3250, 8750]);
  for (const v of [0, 26, -50, 2.5, NaN]) assert.ok(Number.isNaN(incomeMid(v)), String(v));
  // aufsteigend: jede Gruppe liegt über der vorigen
  assert.ok(INCOME_MID.every((v, i) => i === 0 || v > INCOME_MID[i - 1]));
});

test('Einstieg: the points follow the documented rule (every step-th of the pool, from the 50th) and skip missing values', () => {
  // vier unbrauchbare Befragte vorn (0 Stunden, Stunden fehlen, offene Einkommensgruppe 26, Einkommen fehlt), dann 30 brauchbare
  const n = 30;
  const sav = fakeSav({
    dw15: { values: [0, -9, 40, 30, ...Array.from({ length: n }, (_, i) => 10 + i)], missingFrom: -1 },
    incc: { values: [10, 10, 26, -50, ...Array.from({ length: n }, (_, i) => (i % 25) + 1)], missingFrom: -1 },
  });
  const pool = playPool(sav)!;
  assert.equal(pool.length, n);
  assert.deepEqual(pool[0], { x: 10, y: 100 });
  const got = playPoints(sav)!;
  assert.equal(got.length, PLAY_COUNT);
  // 30 / 15 = Schritt 2; Anfang (50 − 1) mod 2 = 1 → die 2., 4., 6. … brauchbare Befragte
  assert.deepEqual(got.map(q => q.id), Array.from({ length: 15 }, (_, k) => k));
  assert.deepEqual(got.map(q => q.x), Array.from({ length: 15 }, (_, k) => 11 + 2 * k));
  assert.deepEqual(got.map(q => q.y), Array.from({ length: 15 }, (_, k) => incomeMid(((1 + 2 * k) % 25) + 1)));
  // zu wenige Befragte oder fehlende Variable: keine Punkte
  assert.equal(playPoints(fakeSav({ dw15: { values: [10, 20] }, incc: { values: [3, 4] } })), null);
  assert.equal(playPoints(fakeSav({ dw15: { values: [10, 20] } })), null);
  // die Testdatei hat kein incc: dann zeigt die Sitzung einen Hinweis statt der Grafik
  assert.equal(playPoints(fixtureSav()), null);
});

test('Einstieg: the line from R is least squares (kit/ols like linear_regression), R² compares it with the mean', () => {
  const exact = playFit(pts([[10, 600], [20, 1100], [40, 2100]]))!;
  close(exact.a, 100); close(exact.b, 50); close(exact.r2, 1); close(exact.ssr, 0, 1e-6);
  const set = pts([[10, 450], [12, 2625], [16, 937.5], [28, 3250], [35, 1312.5], [40, 2625], [50, 3750], [50, 4250]]);
  const f = playFit(set)!;
  // B = Kovarianz / Varianz, Konstante durch den Schwerpunkt
  const mx = set.reduce((s, q) => s + q.x, 0) / set.length, my = playMean(set);
  const b = set.reduce((s, q) => s + (q.x - mx) * (q.y - my), 0) / set.reduce((s, q) => s + (q.x - mx) ** 2, 0);
  close(f.b, b); close(f.a, my - b * mx); close(f.mean, my);
  close(playSsr(set, { a: f.a, b: f.b }), f.ssr, 1e-9);
  close(playSsr(set, { a: my, b: 0 }), f.sst, 1e-9);
  close(lessThanMean(f.ssr, f.sst), f.r2);
  // keine andere Gerade macht weniger Fehlerquadrate
  for (const [da, db] of [[50, 0], [-50, 0], [0, 2], [0, -2], [200, -5], [-300, 8]]) assert.ok(playSsr(set, { a: f.a + da, b: f.b + db }) > f.ssr, `${da}/${db}`);
  // eine schlechte Gerade kann mehr Fehlerquadrate machen als der Durchschnitt
  assert.ok(lessThanMean(playSsr(set, { a: 4000, b: -50 }), f.sst) < 0);
  assert.ok(Number.isNaN(lessThanMean(1, 0)));
  // nicht bestimmbar: zu wenige Punkte oder alle bei derselben Stundenzahl
  assert.equal(playFit(pts([[10, 100], [20, 200]])), null);
  assert.equal(playFit(pts([[30, 100], [30, 200], [30, 900]])), null);
});

test('Einstieg: moving, adding and removing points', () => {
  const set = pts([[10, 450], [12, 2625], [16, 937.5], [28, 3250], [35, 1312.5], [40, 2625], [50, 3750]]);
  const before = playFit(set)!;
  // Verschieben bleibt auf der Fläche und rastet ein (halbe Stunden, 10 Euro)
  assert.deepEqual(clampPoint(33.3, 1234), { x: 33.5, y: 1230 });
  assert.deepEqual(clampPoint(-5, 9999), { x: 0, y: 6000 });
  const moved = movePoint(set, 2, 16, 5800);
  assert.deepEqual(moved[2], { id: 2, x: 16, y: 5800 });
  assert.deepEqual(moved.filter(q => q.id !== 2), set.filter(q => q.id !== 2));
  assert.ok(playFit(moved)!.b < before.b);
  assert.equal(pointsChanged(set, set), false);
  assert.equal(pointsChanged(set, moved), true);
  // ein neuer Punkt im Schwerpunkt ändert die Gerade nicht – erst, wenn man ihn wegzieht
  const added = addPoint(set);
  assert.equal(added.length, set.length + 1);
  assert.equal(added.at(-1)!.id, 7);
  const after = playFit(added)!;
  close(after.a, before.a, 1e-9); close(after.b, before.b, 1e-9);
  assert.ok(Math.abs(playFit(movePoint(added, 7, 60, 200))!.b - before.b) > 10);
  assert.equal(pointsChanged(set, added), true);
  // Grenzen: höchstens PLAY_MAX, mindestens PLAY_MIN Punkte
  let many = set;
  for (let i = 0; i < 40; i++) many = addPoint(many);
  assert.equal(many.length, PLAY_MAX);
  let few = set;
  for (const q of set) few = removePoint(few, q.id);
  assert.equal(few.length, PLAY_MIN);
  assert.deepEqual(removePoint(set, 3).map(q => q.id), [0, 1, 2, 4, 5, 6]);
});
