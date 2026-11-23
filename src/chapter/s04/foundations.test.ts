import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement as h, type ComponentType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ChapterStateProvider } from '../ChapterContext';
import type { ChapterState } from '../state';
import { FR_OPTIONS, V4_Q, V4_Q2, V4_Q2_WRONG } from './content';
import { Foundation1, Foundation2, Foundation3, Foundation4, Overview } from './Foundations';
import { ageBins, histText } from './figures/Histogram';
import { stats } from './figures/Bars';
import { towerText } from './figures/TowerToStack';
import { labHeights, labText } from './figures/ShapeLab';
import { DOUBLE_FROM, axisSolution, axisText } from './figures/AxisStart';
import { sketchFeedback } from './figures/Sketch';

const ALL: [string, ComponentType][] = [['Foundation1', Foundation1], ['Foundation2', Foundation2], ['Foundation3', Foundation3], ['Foundation4', Foundation4], ['Overview', Overview]];

function render(C: ComponentType, answers: Record<string, string> = {}) {
  const initial: ChapterState = { predictions: {}, answers };
  return renderToStaticMarkup(h(ChapterStateProvider, { sessionId: 4, initial }, h(C)));
}

const unescape = (s: string) => s.replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const textOf = (html: string) => unescape(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();

/** Text of the element with this id (its inner markup up to the first matching close tag, tags stripped). */
function textById(html: string, id: string): string {
  const m = html.match(new RegExp(`<(\\w+)[^>]*\\bid="${id}"[^>]*>([\\s\\S]*?)</\\1>`));
  return m ? textOf(m[2]) : '';
}

/** Accessible names of all role="img" elements. */
function imageNames(html: string): string[] {
  return [...html.matchAll(/<[^>]*\brole="img"[^>]*>/g)].map(([tag]) => {
    const label = tag.match(/\baria-label="([^"]*)"/)?.[1];
    if (label !== undefined) return unescape(label);
    const ids = tag.match(/\baria-labelledby="([^"]*)"/)?.[1] ?? '';
    return ids.split(/\s+/).filter(Boolean).map(id => textById(html, id)).join(' ');
  });
}

test('every role="img" has a text version of at least 40 characters', () => {
  let count = 0;
  for (const [name, C] of ALL) {
    for (const answers of [{}, { 'v4-frage': 'b' }] as Record<string, string>[]) {
      for (const label of imageNames(render(C, answers))) {
        count++;
        assert.ok(label.length >= 40, `${name}: "${label}"`);
      }
    }
  }
  assert.ok(count >= 2, 'at least the ruler boxplot and the decision tree are images');
});

test('no R code in the foundations: no workshop and no <pre>', () => {
  for (const [name, C] of ALL) {
    const html = render(C);
    assert.doesNotMatch(html, /class="workshop"/, name);
    assert.doesNotMatch(html, /<pre/, name);
  }
});

test('foundation blocks with ids, skip links and step labels as in v11', () => {
  const steps: Record<string, string[]> = { Foundation1: ['1a', '1b', '1c'], Foundation2: ['2a'], Foundation3: ['3a'], Foundation4: ['4a'], Overview: ['✓'] };
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

test('every slider has a label and aria-valuetext', () => {
  for (const [name, C] of ALL) {
    const html = render(C);
    for (const [tag] of html.matchAll(/<input[^>]*type="range"[^>]*>/g)) {
      assert.match(tag, /aria-valuetext="[^"]+"/, `${name}: ${tag}`);
      const id = tag.match(/\bid="([^"]+)"/)?.[1];
      assert.ok(id && html.includes(`for="${id}"`), `${name}: label for ${id}`);
    }
  }
  assert.match(render(Foundation3), /aria-valuetext="5 Jahre"/);
  assert.match(render(Foundation2), /aria-valuetext="symmetrisch"/);
  assert.equal((render(Foundation1).match(/role="slider"/g) ?? []).length, 11, 'sketch: eleven columns');
  assert.match(render(Foundation1), /aria-valuetext="Höhe 0 von 10"/);
});

test('foundation 4 has the question v4-frage2 with its feedback, also for each wrong choice', () => {
  const right = render(Foundation4, { 'v4-frage2': '38' });
  assert.match(right, /id="v4-frage2"/);
  assert.ok(right.includes('Von neun Personen steht die fünfte in der Mitte: 38 Stunden.'));
  assert.equal(V4_Q2.right, 'Von neun Personen steht die fünfte in der Mitte: 38 Stunden.');
  for (const v of ['40', '43'] as const) assert.ok(render(Foundation4, { 'v4-frage2': v }).includes(V4_Q2_WRONG[v]), v);
  assert.doesNotMatch(render(Foundation4), /Von neun Personen steht die fünfte/);
});

test('foundation 4 has the short-time question; answering it moves the 22 hours to 0', () => {
  assert.equal(V4_Q.id, 'v4-frage');
  assert.equal(V4_Q.kind === 'choice' ? V4_Q.target : '', 'b');
  const before = render(Foundation4);
  assert.match(before, /id="v4-frage"/);
  assert.match(imageNames(before).join(' '), /Elf Personen auf dem Lineal: 22, 28/);
  const after = render(Foundation4, { 'v4-frage': 'b' });
  const name = imageNames(after).join(' ');
  assert.match(name, /Elf Personen auf dem Lineal: 0, 28/);
  assert.match(name, /die 0 ist ein Ausreißer-Punkt/);
  assert.ok(after.includes(V4_Q.right));
  assert.ok(render(Foundation4, { 'v4-frage': 'a' }).includes(V4_Q.hint));
});

test('decision tree: viewBox 0 0 760 262 and a text version naming all five forms', () => {
  const html = render(Overview);
  assert.match(html, /viewBox="0 0 760 262"/);
  const text = imageNames(html).join(' ').replace(/Prozent/g, '%');
  for (const form of FR_OPTIONS) assert.ok(text.includes(form), form);
  assert.equal((html.match(/<select/g) ?? []).length, 5, 'five assignments');
});

test('overview assignment feedback: per question, and in the live summary', () => {
  const html = render(Overview, { 'v6-1': '0', 'v6-2': '0' });
  assert.ok(html.includes('Passt.'));
  assert.ok(html.includes('Passt nicht:'));
  assert.ok(html.includes('Noch 3 Fragen ohne Form.'));
});

test('helpers: statistics and age bins as in the prototype', () => {
  const ls = stats([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [26, 29, 81, 120, 174, 413, 416, 998, 1506, 868, 533]);
  assert.equal(ls.n, 5164);
  assert.equal(ls.median, 8);
  assert.equal(Math.round(ls.mean * 100) / 100, 7.36);
  const five = ageBins(5);
  assert.equal(five[0].from, 15);
  assert.equal(five.reduce((s, b) => s + b.n, 0), 5223);
  const top = five.reduce((m, b) => (b.n > m.n ? b : m));
  assert.equal(top.from, 55);
  assert.match(render(Foundation3), /Kistenbreite 5 Jahre: 17 Kisten\. Die vollste Kiste: 55 bis 59 Jahre mit/);
});

test('text versions follow the state: tower, lab, axis, histogram, sketch', () => {
  const tower = [0, 1, 2].map(st => towerText(st as 0 | 1 | 2));
  assert.equal(new Set(tower).size, 3);
  assert.match(tower[0], /^Ein Turm ls01 mit 21 Steinen, ungeordnet: 8, 7, 9, .*NA, ein leerer Stein/);
  assert.equal(tower[1], 'Sortiert: 1 Steine bei 4, 2 Steine bei 5, 2 Steine bei 6, 4 Steine bei 7, 6 Steine bei 8, 3 Steine bei 9, 2 Steine bei 10. Der leere Stein liegt auf keinem Stapel. Die Werte 0 bis 3 hat niemand angegeben.');
  assert.equal(tower[2], 'Alle 5.164 gültigen Antworten, ein Stein für 50 Befragte. Höchster Stapel bei 8 mit 1.506 Befragten.');

  assert.match(labText(2, false), /^symmetrisch: Mittelwert 5,0, Median 5,0\. Mittelwert und Median liegen fast gleich\.$/);
  assert.match(labText(0, false), /^stark linksschief: .*Der Mittelwert liegt links vom Median/);
  assert.match(labText(4, false), /^stark rechtsschief: .*Der Mittelwert liegt rechts vom Median/);
  assert.match(labText(0, true), /^zweigipflig: .*zwischen den Gipfeln/);
  assert.equal(labHeights(2, false), 'Säulenhöhen von links nach rechts: 0: 1, 1: 1, 2: 2, 3: 4, 4: 7, 5: 10, 6: 7, 7: 4, 8: 2, 9: 1, 10: 1.');
  assert.notEqual(labHeights(0, false), labHeights(0, true));
  assert.ok(render(Foundation2).includes(labHeights(2, false)));

  assert.equal(axisText(0), 'Achse ab 0,0: Der West-Balken ist im Bild 1,04-mal so lang wie der Ost-Balken. Ab 0 wäre er 1,04-mal so lang.');
  assert.match(axisText(6.9), /^Achse ab 6,9: Der West-Balken ist im Bild 1,93-mal so lang/);
  assert.equal(DOUBLE_FROM, 6.9);
  assert.equal(axisSolution(5), 'Ab etwa 6,9 wirkt der West-Balken doppelt so lang wie der Ost-Balken (dein Tipp war 5,0). Dabei beträgt der Unterschied nur 0,26 Punkte. Ab 0 ist der West-Balken 1,04-mal so lang, ab 7,1 schon 4,29-mal: Die Achse versteckt die 7,1 Punkte, die beide Gruppen gemeinsam haben.');
  assert.doesNotMatch(axisSolution(null), /dein Tipp/);

  assert.notEqual(histText(5), histText(10));
  assert.equal(histText(10), 'Kistenbreite 10 Jahre: 9 Kisten. Die vollste Kiste: 50 bis 59 Jahre mit 999 Befragten.');

  const peak8 = [0, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0];
  assert.equal(sketchFeedback(peak8), 'Dein Gipfel liegt bei 8. In den Daten liegt er bei 8. In deiner Skizze sagen 100 % 7 oder mehr, in den Daten 76 %.');
  assert.match(sketchFeedback([0, 0, 0, 0, 0, 5, 5, 0, 0, 0, 0]), /^Dein Gipfel ist breit: 5, 6\. .* sagen 0 % 7 oder mehr/);
});

test('screen reader details: value table, live solution, quiet outputs, radiogroup, tree text read once', () => {
  const g3 = render(Foundation3);
  const table = g3.match(/<details class="werte"><summary>Werte als Tabelle<\/summary>([\s\S]*?)<\/details>/)?.[1] ?? '';
  assert.equal((table.match(/<tr>/g) ?? []).length, 1 + 17, 'header and 17 bins at 5 years');
  assert.match(table, /<td>55 bis 59 Jahre<\/td><td>544<\/td>/);

  const g1 = render(Foundation1);
  assert.match(g1, /<div class="v7-loesung" aria-live="polite"><\/div>/, 'solution container exists before the solution');
  assert.match(g1, /<p class="rueck" id="v7-frage-r" aria-live="polite">/);
  for (const html of [g1, g3]) for (const [tag] of html.matchAll(/<output[^>]*>/g)) assert.match(tag, /aria-live="off"/);

  const g4 = render(Foundation4, { 'v4-frage2': '40' });
  assert.match(g4, /<fieldset role="radiogroup" aria-labelledby="v4-frage2-l" aria-invalid="true"/);
  assert.match(g4, /<legend id="v4-frage2-l">/);

  assert.match(render(Overview), /<div id="baum-text" class="sr-only" aria-hidden="true">/);
});
