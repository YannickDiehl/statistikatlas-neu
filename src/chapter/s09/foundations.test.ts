import test from 'node:test';
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { createElement as h, type ComponentType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ChapterStateProvider } from '../ChapterContext';
import type { ChapterState } from '../state';
import { EIGHT, K1B_Q, K1C_Q, K2C_Q, K3A_Q, K3B_Q, K4_Q, OUTPUT_PICKS, SLOPES, SSE_BY_SLOPE, SUMMARY_LINES } from './content';
import { feedbackFor } from './check';
import { Foundation1, Foundation2, Foundation3, Foundation4, Overview } from './Foundations';
import { ReadR } from './ReadR';
import { estimateFeedback, ESTIMATE_TEXT, ESTIMATE_LINE_TEXT, parseHeight } from './figures/Estimate';
import { residualText, RESIDUALS_TEXT } from './figures/Residuals';
import { rotateFeedback, ROTATE_TEXT, sse, squareX } from './figures/Rotate';
import { CURVE_TEXT } from './figures/Curve';
import { OUTLIER_TEXT } from './figures/Outlier';
import { FORMULA_TEXT } from './figures/FormulaSteps';

const ALL: [string, ComponentType][] = [['Foundation1', Foundation1], ['Foundation2', Foundation2], ['Foundation3', Foundation3], ['Foundation4', Foundation4], ['Overview', Overview]];

function render(C: ComponentType, answers: Record<string, string> = {}) {
  const initial: ChapterState = { predictions: {}, answers };
  return renderToStaticMarkup(h(ChapterStateProvider, { sessionId: 9, initial }, h(C)));
}
const unescape = (s: string) => s.replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const textOf = (html: string) => unescape(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();

test('every role="img" has a text version of at least 40 characters', () => {
  let count = 0;
  for (const [name, C] of ALL) {
    for (const tag of render(C).match(/<[^>]*\brole="img"[^>]*>/g) ?? []) {
      count++;
      assert.ok(unescape(tag.match(/\baria-label="([^"]*)"/)?.[1] ?? '').length >= 40, `${name}: ${tag.slice(0, 120)}`);
    }
  }
  assert.equal(count, 3, 'R², spread per stage, the four small pictures');
});

test('interactive pictures carry their full text version (sr-only) and announce changes with aria-live', () => {
  const t1 = textOf(render(Foundation1)), t2 = textOf(render(Foundation2)), t3 = textOf(render(Foundation3)), t4 = textOf(render(Foundation4));
  for (const [t, version] of [[t1, ESTIMATE_TEXT], [t1, FORMULA_TEXT], [t2, RESIDUALS_TEXT], [t2, ROTATE_TEXT], [t3, OUTLIER_TEXT], [t4, CURVE_TEXT]] as const) {
    assert.ok(t.includes(version), version.slice(0, 40));
    assert.ok(version.length >= 40);
  }
  const f1 = render(Foundation1);
  assert.match(f1, /role="group" aria-label="Streudiagramm Lebenszufriedenheit nach wirtschaftlicher Lage mit deiner Geraden" aria-describedby="s9-schaetzen-text s9-schaetzen-anleitung"/);
  assert.match(f1, /<p class="sr-only" id="s9-schaetzen-text">/);
  const f2 = render(Foundation2);
  assert.ok((f2.match(/aria-live="polite"/g) ?? []).length >= 3, 'residuals, slider, quick check');
  assert.doesNotMatch(render(Foundation3), /<table class="daten" aria-live/, 'a live region on a table only talks too much');
});

test('no R code in the foundations: no workshop and no <pre>', () => {
  for (const [name, C] of ALL) {
    const html = render(C);
    assert.doesNotMatch(html, /class="workshop"/, name);
    assert.doesNotMatch(html, /<pre/, name);
  }
});

test('foundation blocks with ids, skip links and step labels as in the plan', () => {
  const steps: Record<string, string[]> = { Foundation1: ['1a', '1b', '1c'], Foundation2: ['2a', '2b', '2c'], Foundation3: ['3a', '3b'], Foundation4: ['4'], Overview: ['Ü1', 'Ü2', 'Ü3'] };
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

test('estimate (B1): two handles as sliders with value text, two number fields, buttons', () => {
  const html = render(Foundation1);
  const sliders = [...html.matchAll(/<circle[^>]*role="slider"[^>]*>/g)].map(m => m[0]);
  assert.equal(sliders.length, 2);
  assert.match(sliders[0], /aria-valuetext="Deine Gerade bei sehr schlechter Lage: 5,0"/);
  assert.match(sliders[1], /aria-valuetext="Deine Gerade bei sehr guter Lage: 5,0"/);
  for (const s of sliders) assert.match(s, /tabindex="0"/);
  assert.match(html, /<label for="s9-hoehe-0">Höhe deiner Geraden bei sehr schlechter Lage<\/label>/);
  assert.match(html, /<label for="s9-hoehe-1">Höhe deiner Geraden bei sehr guter Lage<\/label>/);
  assert.match(html, />Gerade festlegen und vergleichen<\/button>/);
  assert.match(html, />Neu schätzen<\/button>/);
  assert.equal((html.match(/<circle[^>]*fill="#86B9DE"[^>]*fill-opacity/g) ?? []).length, 54, 'one bubble per non-empty cell (55 cells, one is 0)');
});

test('estimate (B1): feedback for each case in the plan', () => {
  assert.match(estimateFeedback(6, 5), /^Deine Gerade fällt oder bleibt flach, die echte steigt um 4,3 Punkte/);
  assert.match(estimateFeedback(5, 5), /fällt oder bleibt flach/);
  assert.equal(estimateFeedback(5.8, 7.8), 'Deine Gerade steigt um 2,0 Punkte, die echte um 4,3. Du hast den Zusammenhang unterschätzt.');
  assert.equal(estimateFeedback(4.6, 8.9), 'Deine Gerade steigt um 4,3 Punkte, die echte um 4,3. Gut geschätzt.');
  assert.match(estimateFeedback(4.4, 8.2), /steigt um 3,8 Punkte.*Gut geschätzt\./);
  assert.match(estimateFeedback(4.3, 9.0), /steigt um 4,7 Punkte.*Gut geschätzt\./);
  assert.match(estimateFeedback(4.3, 9.1), /steigt um 4,8 Punkte, die echte nur um 4,3\. Du hast den Zusammenhang überschätzt/);
  assert.match(estimateFeedback(4, 9.9), /steigt um 5,9 Punkte, die echte nur um 4,3\. Du hast den Zusammenhang überschätzt\. Das passiert oft/);
  assert.match(estimateFeedback(2, 5), /Insgesamt liegt deine Gerade zu tief: Bei „teils\/teils“ zeigt sie 3,50, die echte 6,79\.$/);
  assert.match(estimateFeedback(8, 9), /Insgesamt liegt deine Gerade zu hoch/);
  assert.doesNotMatch(estimateFeedback(4.6, 8.9), /Insgesamt/);
});

test('formula (B2): three steps; quick check 1b with its special cases', () => {
  const html = render(Foundation1);
  assert.deepEqual([...html.matchAll(/<button[^>]*>(Schritt \d: [^<]*)<\/button>/g)].map(m => m[1]), ['Schritt 1: Formel', 'Schritt 2: einsetzen', 'Schritt 3: ausrechnen']);
  assert.equal(feedbackFor(K1B_Q, '5,716').result, 'right');
  assert.equal(feedbackFor(K1B_Q, '5.72').result, 'right');
  assert.match(feedbackFor(K1B_Q, '5,641').text, /Mittelwert der Befragten mit schlechter Lage/);
  assert.match(feedbackFor(K1B_Q, '9.286').text, /Erst mal, dann plus/);
  assert.equal(feedbackFor(K1B_Q, '7').text, K1B_Q.hint);
  assert.match(render(Foundation1, { 'k1b-frage': '5,641' }), /Noch nicht\. Das ist der Mittelwert der Befragten/);
  assert.match(feedbackFor(K1C_Q, 'b').text, /4,643/);
  assert.match(feedbackFor(K1C_Q, 'c').text, /7,398/);
  assert.equal(feedbackFor(K1C_Q, 'a').result, 'right');
});

test('residuals (B3): eight point buttons left to right and the text per person', () => {
  const html = render(Foundation2);
  const buttons = [...html.matchAll(/<g role="button" tabindex="0"[^>]*aria-label="([^"]*)"/g)].map(m => m[1]);
  assert.deepEqual(buttons, EIGHT.map(p => `Person mit Lage ${p.x} und Zufriedenheit ${p.y}`));
  assert.equal(residualText({ x: 3, y: 8 }), 'Person mit Lage 3 und Zufriedenheit 8: Die Gerade sagt 7 vorher. Residuum: 8 minus 7 = 1. Sie liegt über der Geraden, zufriedener als vorhergesagt.');
  assert.match(residualText({ x: 1, y: 4 }), /= −1\. Sie liegt unter der Geraden, weniger zufrieden als vorhergesagt\.$/);
  assert.match(residualText({ x: 2, y: 6 }), /= 0\. Sie liegt genau auf der Geraden\.$/);
});

test('slider (B4): −1 to 3 in steps of 0,25, value text, feedback per range, table of all 17 positions', () => {
  const html = render(Foundation2);
  const slider = html.match(/<input type="range"[^>]*>/)?.[0] ?? '';
  assert.match(slider, /min="-1"/); assert.match(slider, /max="3"/); assert.match(slider, /step="0.25"/);
  assert.match(slider, /aria-valuetext="Steigung 0,00, Fehlerquadrate 18"/);
  assert.match(html, /<label for="s9-steigung">Steigung<\/label>/);
  SLOPES.forEach((b, i) => assert.equal(sse(b), SSE_BY_SLOPE[i], `b = ${b}`));
  assert.match(rotateFeedback(0), /^Steigung 0: Die Gerade zeigt allen den Mittelwert 7\. Fehlerquadrate: 18\./);
  assert.match(rotateFeedback(1), /^Steigung 1: Die Gerade aus R\. Fehlerquadrate: 6\./);
  assert.match(rotateFeedback(2), /^Steigung 2: Fehlerquadrate 18, genauso viel wie mit dem Mittelwert\./);
  assert.equal(rotateFeedback(0.5), 'Steigung 0,50: Fehlerquadrate 9. Weniger als mit dem Mittelwert, aber mehr als 6. Steiler wird es besser.');
  assert.equal(rotateFeedback(1.25), 'Steigung 1,25: Fehlerquadrate 6,75. Weniger als mit dem Mittelwert, aber mehr als 6. Flacher wird es besser.');
  assert.equal(rotateFeedback(-0.25), 'Steigung −0,25: Fehlerquadrate 24,75, mehr als mit dem Mittelwert. Diese Gerade ist schlechter als gar keine.');
  assert.match(rotateFeedback(3), /^Steigung 3,00: Fehlerquadrate 54, mehr als mit dem Mittelwert/);
  assert.equal((html.match(/<tr><td>/g) ?? []).length, 17, 'table of all positions');
  assert.match(html, />Mittelwert-Gerade \(Steigung 0\)<\/button>/);
  assert.match(html, />Gerade aus R<\/button>/);
});

test('R² (B5) and quick check 2c with its special cases', () => {
  assert.equal(feedbackFor(K2C_Q, '20,3').result, 'right');
  assert.equal(feedbackFor(K2C_Q, '20,3 %').result, 'right');
  assert.match(feedbackFor(K2C_Q, '0.203').text, /^Richtig gelesen, das ist R² als Anteil/);
  assert.match(feedbackFor(K2C_Q, '45').text, /^Das ist R, die Korrelation/);
  assert.match(feedbackFor(K2C_Q, '0,45').text, /^Das ist R, die Korrelation/);
  assert.equal(feedbackFor(K2C_Q, '30').text, K2C_Q.hint);
});

test('foundation 3: spread per stage, two ways to check, outlier toggle; quick checks 3a and 3b', () => {
  const html = render(Foundation3);
  const t = textOf(html);
  assert.match(t, /Zwei Wege zu prüfen Faustregel: kennst du aus Sitzung 7 Levene-Test: neu heute/);
  assert.match(t, /F = 67,18, p < 0,001/);
  assert.match(html, /aria-pressed="true"[^>]*>ohne sie<\/button>/);
  assert.match(html, /aria-pressed="false"[^>]*>Neunte Person dazunehmen<\/button>/);
  assert.match(feedbackFor(K3A_Q, 'b').text, /am kleinsten \(1,27\)/);
  assert.match(feedbackFor(K3B_Q, 'c').text, /unten rechts/);
  assert.equal(feedbackFor(K3B_Q, 'a').result, 'right');
});

test('foundation 4: curve toggles and quick check', () => {
  const html = render(Foundation4);
  assert.match(html, /aria-pressed="true"[^>]*>Gerade zeigen<\/button>/);
  assert.match(html, /aria-pressed="false"[^>]*>Mittelwerte verbinden<\/button>/);
  assert.equal(feedbackFor(K4_Q, 'nein').result, 'right');
  assert.match(textOf(render(Foundation4, { 'k4-frage': 'ja' })), /Noch nicht\. R² = 0 heißt nur: kein linearer Zusammenhang\./);
  assert.match(textOf(html), /−0,27 und −0,26/);
});

test('review: the R line stays hidden before comparing, empty input is ignored, no page-wide touch-action', () => {
  assert.doesNotMatch(ESTIMATE_TEXT, /4,64|8,94|Gerade aus R/);
  assert.match(ESTIMATE_LINE_TEXT, /Die Gerade aus R steigt von 4,64 bei sehr schlechter Lage auf 8,94 bei sehr guter Lage\./);
  assert.equal(parseHeight(''), null);
  assert.equal(parseHeight('  '), null);
  assert.equal(parseHeight('abc'), null);
  assert.equal(parseHeight('6,5'), 6.5);
  assert.equal(parseHeight('0'), 0);
  const css = readFileSync(new URL('./s09.css', import.meta.url), 'utf8');
  assert.doesNotMatch(css.match(/\.chapter \.s9-svg\{[^}]*\}/)![0], /touch-action/);
  assert.match(css, /\.chapter \.s9-griff\{[^}]*touch-action:none/);
});

test('review: residual points have an invisible hit circle of r = 16; rotate squares at x = 5 go left', () => {
  assert.equal((render(Foundation2).match(/<circle[^>]*\br="16"/g) ?? []).length, 8);
  assert.ok(squareX(5, 5, 40) < 5);
  assert.equal(squareX(3, 3, 40), 3 + 1);
  assert.ok(squareX(4.94, 5, 40) < 4.94);
});

test('free map hints name the concepts and link by concept id', () => {
  const all = ALL.map(([, C]) => render(C)).join('');
  for (const id of ['linear_regression', 'prediction', 'residuals', 'explained_variance', 'variance_assumption']) {
    assert.ok(all.includes(`data-concept="${id}"`), id);
  }
  for (const c of ['Lineare Regression', 'Linearer Prädiktor', 'Residuen und kleinste Quadrate', 'Erklärter Varianzanteil R²', 'Gleiche Fehlervarianz']) {
    assert.ok(textOf(all).includes(`→ In der freien Karte: ${c}`), c);
  }
});

test('output picker (B0): every marked cell exists in its line; the R lesen cards render it', () => {
  for (const p of OUTPUT_PICKS) for (const c of p.cells) assert.ok(SUMMARY_LINES[c.line].includes(c.text), `${p.id}: ${c.text}`);
  const pick = (id: string) => OUTPUT_PICKS.find(p => p.id === id)!.cells.map(c => SUMMARY_LINES[c.line].trim().split(/\s+/)[0]);
  assert.deepEqual(pick('konstante'), ['(Intercept)']);
  assert.deepEqual(pick('steigung'), ['lage']);
  assert.deepEqual(pick('beta'), ['lage']);
  assert.deepEqual(pick('r2'), ['R']);
  assert.match(SUMMARY_LINES[15], /^ {2}R Square/);
  assert.deepEqual(pick('fehler'), ['Std.']);
  assert.deepEqual(pick('n'), ['-', 'ls01', 'lage']);
  const html = renderToStaticMarkup(h(ChapterStateProvider, { sessionId: 9, initial: { predictions: {}, answers: {} } }, h(ReadR)));
  assert.match(html, /<figcaption>Ausgabe von summary\(\) für ls01 ~ lage<\/figcaption>/);
  assert.doesNotMatch(html, /-{5}/, 'no separator dashes in the output');
});
