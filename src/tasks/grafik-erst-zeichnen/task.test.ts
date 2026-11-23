import test from 'node:test';
import assert from 'node:assert/strict';
import { renderSession, testData } from '../testRender';
import { initialGrafik, regionMeans, sketchTruth, type GrafikState } from './domain';

const render = (state: Partial<GrafikState>) => renderSession(3, true, { tasks: { grafik: { ...initialGrafik(), ...state } } });
const truth = sketchTruth(testData().sav);
const means = regionMeans(testData().sav);
const sketch = Array.from({ length: 11 }, (_, i) => (i === 5 ? 100 : 20));

test('session 4 starts with the brief, the drawing pad and all four parts', () => {
  const html = renderSession(3);
  assert.match(html, /Erst zeichnen, dann zeigen/);
  assert.match(html, /AUFGABE · GRAFIKREDAKTION EINES SCHULBUCHVERLAGS/);
  for (const part of ['Teil 1 · Erst zeichnen', 'Teil 2 · Rätselkasten', 'Teil 3 · Der Bauplan', 'Teil 4 · Wo beginnt die Achse?']) assert.match(html, new RegExp(part));
  assert.match(html, /role="slider" aria-label="Wert 0"/);
  assert.match(html, /Balken mit Maus oder Finger hochziehen/);
  assert.match(html, /disabled="">Skizze abgeben/);
  assert.match(html, /library\(tidyverse\)/);
  assert.match(html, /DEIN WERKZEUGKASTEN/);
  assert.match(html, /allbus %&gt;%\n  filter\(!is.na\(educ\)\) %&gt;%\n  ggplot\(aes\(x = educ\)\) \+\n  geom_bar\(\)/);
  assert.match(html, /<code>library\(\), read_spss\(\), codebook\(\)<\/code> kennst du aus Sitzung 1/);
  assert.match(html, /<code>%&gt;%<\/code> kennst du aus Sitzung 2 und 3/);
  // Was der Bauplan anbietet, steht auch im Werkzeugkasten (Balken auf 100 %, Streudiagramm).
  for (const fn of ['geom_bar(position = &quot;fill&quot;)', 'geom_point(), geom_jitter()']) assert.ok(html.includes(`<code>${fn}</code><span class="task-toolbox-new">neu</span>`), fn);
  assert.match(html, /geom_jitter\(width = 0\.3, height = 0\.3, alpha = 0\.2\)/);
  // Pipe-Stil: Daten vorn, kein |>, kein Zwischenobjekt per Funktionsaufruf; mutate() kommt erst in Sitzung 5.
  assert.doesNotMatch(html, /\|&gt;|mutate\(|group_by|summarise|ggplot\(allbus|ggplot\(bild|to_label\(allbus|filter\((allbus|bild)/);
  assert.match(html, /Silhouette A: \d+ Balken ohne Beschriftung/);
  assert.match(html, /FÜR DAS PLENUM/);
  // Die echte Verteilung und der R-Code zum Plotten erst nach der abgegebenen Skizze.
  assert.doesNotMatch(html, /Die echte Verteilung/);
  assert.doesNotMatch(html, /Prozent der Befragten/);
});

test('the real distribution appears only after the sketch is handed in and the plot is read correctly', () => {
  const locked = render({ sketch, locked: true });
  assert.match(locked, /Die echte Verteilung/);
  assert.doesNotMatch(locked, /Prozent der Befragten/);
  const wrong = render({ sketch, locked: true, read: { peak: '5', count: '' } });
  assert.match(wrong, /Gipfel deiner Skizze/);
  const right = render({ sketch, locked: true, read: { peak: String(truth.mode), count: String(truth.modeCount) } });
  assert.match(right, /Prozent der Befragten/);
  assert.match(right, /von 100 Befragten an einer anderen Stelle/);
});

test('the silhouettes reveal their questions only after solving', () => {
  const chosen = { A: 'pa02a', B: 'dw15', C: 'pa01', D: 'age' };
  assert.doesNotMatch(render({ silhouettes: chosen }), /3 von 4 richtig/);
  const solved = render({ silhouettes: chosen, solved: true });
  assert.match(solved, /3 von 4 richtig\. Übrig bleibt: Politisches Interesse/);
  assert.match(solved, /Das ist: Gesundheit/);
  assert.match(solved, /Nadel bei 40/);
});

test('the plan shows the ggplot2 code, the preview and the caption check', () => {
  const html = render({ question: 'demokratie', plan: { geom: 'fill', x: 'eastwest', second: 'ps03' } });
  assert.match(html, /bild %&gt;%\n  ggplot\(aes\(x = eastwest, fill = ps03\)\)/);
  assert.match(html, /role="img" aria-label="Balken: West/);
  assert.match(html, /summiert sich zu 100 %/);
  assert.match(html, /Welche Bildunterschrift bekommt dein Bild im Schulbuch\?/);
  const error = render({ question: 'demokratie', plan: { geom: 'histogram', x: 'eastwest', second: '' } });
  assert.match(error, /stat_bin\(\) requires a continuous x aesthetic/);
  assert.doesNotMatch(error, /role="img" aria-label="Histogramm/);
});

test('the axis slider waits for both means, then shows the picture ratio', () => {
  assert.doesNotMatch(render({ axis: { west: '', east: '', start: 0, reason: '' } }), /type="range"/);
  const html = render({ axis: { west: means.west.toFixed(2), east: means.east.toFixed(2), start: 7.1, reason: '' } });
  assert.match(html, /type="range"/);
  assert.match(html, /Achse beginnt bei 7,1/);
  assert.match(html, /-mal so hoch wie der Ost-Balken/);
});

test('a finished task fills the plenum card, offers the script and marks the session done', () => {
  const done = renderSession(3, true, { tasks: { grafik: {
    ...initialGrafik(), sketch, locked: true, read: { peak: String(truth.mode), count: String(truth.modeCount) },
    silhouettes: { A: 'hs01', B: 'dw15', C: 'pa01', D: 'age' }, solved: true,
    question: 'stunden', plan: { geom: 'boxplot', x: 'sex', second: 'dw15' }, caption: 'Männer arbeiten im Median 40 Stunden (ALLBUS 2023).',
    axis: { west: means.west.toFixed(2), east: means.east.toFixed(2), start: 0, reason: 'Balken beginnen bei null.' },
  } } });
  assert.match(done, /Daten sehen<small>Aufgabe abgeschlossen/);
  assert.match(done, /4 von 4/);
  assert.match(done, /Ein vollständiges R-Skript zum Mitnehmen/);
  assert.match(done, /geom_boxplot\(\)/);
});
