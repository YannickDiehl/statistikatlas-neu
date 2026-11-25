import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement as h, type ComponentType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ChapterStateProvider } from '../ChapterContext';
import { ageHealthText } from './figures/AgeHealth';
import { betaText, diceText, vifText } from './figures/Compare';
import { B2_TEXT, B3_TEXT, B9_TEXT, B11_TEXT } from './figures/Formulas';
import { B4_TEXT, B7_TEXT, referenceText } from './figures/Groups';
import { B14_TEXT, influenceText, InteractionPlot } from './figures/Limits';
import { OutputReader } from './figures/Output';
import { TwoGroups } from './figures/Groups';
import { VifCircles } from './figures/Compare';
import { COLLINEAR, MODEL_AG, OUTPUT_LINES } from './content';
import { TREE_TEXT } from './figures/Tree';
import { Foundation1, Foundation2, Foundation3, Foundation4, Overview } from './Foundations';

const ALL: [string, ComponentType][] = [['Foundation1', Foundation1], ['Foundation2', Foundation2], ['Foundation3', Foundation3], ['Foundation4', Foundation4], ['Overview', Overview]];
const render = (C: ComponentType, answers: Record<string, string> = {}) =>
  renderToStaticMarkup(h(ChapterStateProvider, { sessionId: 10, initial: { predictions: {}, answers } }, h(C)));

test('text versions follow the state and carry the values of the plan', () => {
  assert.equal(ageHealthText('alle'), 'Mittlere Lebenszufriedenheit nach Altersgruppe: 18 bis 29 Jahre 7,15; 30 bis 44 7,33; 45 bis 59 7,36; 60 bis 74 7,55; 75 und älter 7,65. Von der jüngsten zur ältesten Gruppe steigt sie um 0,50.');
  assert.equal(ageHealthText('getrennt'), 'Getrennt nach Gesundheit steigt die Zufriedenheit mit dem Alter in jeder Gruppe stärker. Gute Gesundheit: von 7,56 auf 8,41, plus 0,85. Zufriedenstellend: von 6,25 auf 7,74, plus 1,49. Schlechte Gesundheit: von 4,78 auf 6,73, plus 1,95. Zugleich sind Ältere seltener gesund: Gute Gesundheit haben bei den 18- bis 29-Jährigen 76 Prozent, bei den ab 75-Jährigen 29 Prozent; schlechte Gesundheit 7 gegen 29 Prozent.');
  assert.equal(referenceText(4), 'Referenz: ledig. Konstante 7,042, das ist die mittlere Lebenszufriedenheit der Ledigen. Abstände: verheiratet plus 0,653, getrennt lebend minus 0,432, verwitwet plus 0,191, geschieden minus 0,059. Die Vorhersagen für die fünf Gruppen bleiben bei jeder Referenz gleich: verheiratet 7,695, getrennt lebend 6,610, verwitwet 7,233, geschieden 6,983, ledig 7,042.');
  assert.match(referenceText(0), /^Referenz: verheiratet\. Konstante 7,695.*ledig minus 0,653\./);
  assert.equal(new Set([0, 1, 2, 3, 4].map(referenceText)).size, 5);
  assert.equal(betaText('sd'), 'Pro Standardabweichung: 18,2 Jahre mehr Alter bringen 0,43 Punkte, 1,01 Gesundheitsstufen bringen 0,87 Punkte. Die Gesundheit wiegt etwa doppelt so viel. Geteilt durch die Standardabweichung der Lebenszufriedenheit, 1,919, ergibt das Beta: 0,225 für das Alter, 0,454 für die Gesundheit.');
  assert.equal(diceText(0), 'Mit Gesundheit und keinem Würfel: R² 0,27, korrigiertes R² 0,25.');
  assert.equal(diceText(4), 'Mit Gesundheit und vier Würfeln: R² 0,31, korrigiertes R² 0,17.');
  assert.notEqual(vifText('gesundheit'), vifText('gruppe'));
  assert.equal(new Set(['ohne', 'mitte', 'rand', 'gerade'].map(influenceText)).size, 4);
  assert.match(influenceText('rand'), /minus 0,042/);
  for (const t of [B2_TEXT, B3_TEXT, B4_TEXT, B7_TEXT, B9_TEXT, B11_TEXT, B14_TEXT, TREE_TEXT]) assert.ok(t.length >= 40, t);
});

test('foundation blocks with ids, skip links and step labels', () => {
  const steps: Record<string, string[]> = { Foundation1: ['1a', '1b', '1c'], Foundation2: ['2a', '2b', '2c'], Foundation3: ['3a', '3b', '3c'], Foundation4: ['4a', '4b'], Overview: ['Ü1', 'Ü2', 'Ü3', 'Ü4'] };
  ALL.forEach(([name, C], i) => {
    const html = render(C);
    const n = i + 1;
    assert.match(html, new RegExp(`<section class="grund-block" id="g${n}"`), name);
    if (n <= 4) assert.match(html, new RegExp(`<a class="zur" href="#a${n}">Schon klar\\? Direkt zu Aufgabe ${n} ↓</a>`), name);
    else assert.doesNotMatch(html, /class="zur"/, name);
    const found = [...html.matchAll(/<span class="g-schritt"><span class="sr-only">Schritt <\/span>([^<]+)<\/span>/g)].map(m => m[1]);
    assert.deepEqual(found, steps[name], name);
  });
});

test('„Kurz überlegen“ gives the plan feedback per option and per special case', () => {
  assert.match(render(Foundation1, { 'k1a-b': 'kleiner' }), /Noch nicht\. Oft wird ein B kleiner/);
  assert.match(render(Foundation1, { 'k1a-b': 'groesser' }), /Richtig\. Genau\. Mit Gesundheit im Modell ist B für das Alter 0,024/);
  assert.match(render(Foundation1, { k1b: '0,861' }), /Noch nicht\. Das ist eine Stufe\. Von 3 bis 5 sind es zwei\./);
  assert.match(render(Foundation2, { k2b: '0.653' }), /Das Vorzeichen fehlt: Ledige liegen unter den Verheirateten\./);
  assert.match(render(Foundation2, { k2a: '7,69' }), /Richtig\. 7,694: 7,042 plus 0,652/);
  assert.match(render(Foundation4, { k4b: '1.091' }), /Das ist der Unterschied unter 60\./);
  assert.match(render(Overview, { 'u1-1': '2', 'u1-2': '1' }), /Passt\.<\/b> Vier Gruppen ohne Reihenfolge/);
  assert.match(render(Overview, { 'u1-1': '2', 'u1-2': '1' }), /Noch 1 ohne Zuordnung\./);
  assert.match(render(Overview, { 'u1-1': '2', 'u1-2': '0', 'u1-3': '1' }), /Alles richtig zugeordnet\./);
});

test('tables are real tables with captions and column headers', () => {
  const g2 = render(Foundation2, {});
  assert.match(g2, /<caption>Fünf Befragte, zum Beispiel<\/caption>/);
  assert.equal((g2.match(/<th scope="col"[^>]*>mstat_\d/g) ?? []).length, 5);
  const ov = render(Overview);
  assert.equal((ov.match(/<table/g) ?? []).length, 2);
});

test('review findings: output region, header table, ruler, footers outside the picture, VIF table from constants', () => {
  const out = renderToStaticMarkup(h(OutputReader));
  assert.match(out, /<div role="region" aria-label="Ausgabe von summary\(\) für das Modell ls01 aus age und gesund"><pre[^>]*tabindex="0"/);
  assert.doesNotMatch(out, /<pre[^>]*aria-label/);
  assert.match(out, /<span class="sr-only">Heute nicht nötig: <\/span>/);
  assert.match(out, /<caption>Kopf der Ausgabe<\/caption>/);
  for (const v of [MODEL_AG.formula, String(MODEL_AG.n), MODEL_AG.weights]) {
    assert.ok(out.includes(`<td>${v}</td>`), v);
    assert.ok(OUTPUT_LINES.join("\n").includes(v), v);
  }
  const g4 = render(Foundation3).replace(/&lt;/g, '<');
  assert.match(g4, /Alter 18 bis 99/);
  assert.doesNotMatch(g4, /Alter 18 bis 98/);
  assert.match(renderToStaticMarkup(h(VifCircles)), /<td>0\.861<\/td><td>0\.025<\/td><td>&lt;\.001<\/td>/);
  assert.equal(COLLINEAR.age.p, '.006');
  assert.equal(COLLINEAR.gesund.se, 0.025);
  for (const [C, fuss] of [[TwoGroups, 'ALLBUS 2023, gewichtet; Lebenszufriedenheit'], [InteractionPlot, 'Erwerbstätig: Vollzeit']] as const) {
    const html = renderToStaticMarkup(h(ChapterStateProvider, { sessionId: 10, initial: { predictions: {}, answers: {} } }, h(C as ComponentType)));
    const i = html.indexOf(fuss), imgStart = html.lastIndexOf('role="img"', i), imgEnd = html.indexOf('</div>', imgStart);
    assert.ok(i > imgEnd, String(C.name));
  }
  assert.match(referenceText(4), /der Ledigen\./);
});
