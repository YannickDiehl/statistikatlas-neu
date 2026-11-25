import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement as h, type ComponentType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ChapterStateProvider } from '../ChapterContext';
import type { ChapterState } from '../state';
import { ALT, CELLS, CONVERT_STATES, G1_TURM_WRONG, G2_EINS, SHEETS } from './content';
import { Foundation1, Foundation2, Foundation3, Foundation4, Overview } from './Foundations';
import { convertText } from './figures/Interactive';
import { ReadR } from './ReadR';

const ALL: [string, ComponentType][] = [['Foundation1', Foundation1], ['Foundation2', Foundation2], ['Foundation3', Foundation3], ['Foundation4', Foundation4], ['Overview', Overview]];

function render(C: ComponentType, answers: Record<string, string> = {}) {
  const initial: ChapterState = { predictions: {}, answers };
  return renderToStaticMarkup(h(ChapterStateProvider, { sessionId: 2, initial }, h(C)));
}

const unescape = (s: string) => s.replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const textOf = (html: string) => unescape(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const imageNames = (html: string) => [...html.matchAll(/<[^>]*\brole="img"[^>]*>/g)].map(([tag]) => unescape(tag.match(/\baria-label="([^"]*)"/)?.[1] ?? ''));

const SHEETS_DONE = { g3_a: '0', g3_b: '-9', g3_c: '-42', g3_d: '-11' };

test('every role="img" has a text version of at least 40 characters, also after answering', () => {
  let count = 0;
  for (const [name, C] of ALL) for (const answers of [{}, { ...SHEETS_DONE, g2_eins: '1' }]) {
    for (const label of imageNames(render(C, answers))) {
      count++;
      assert.ok(label.length >= 40, `${name}: "${label}"`);
    }
  }
  assert.ok(count >= 10, `${count}`);
});

test('no R workshops in the foundations', () => {
  for (const [name, C] of ALL) assert.doesNotMatch(render(C), /class="workshop"/, name);
});

test('foundation blocks with ids, skip links and step labels as in the plan', () => {
  const steps: Record<string, string[]> = { Foundation1: ['1a', '1b'], Foundation2: ['2a', '2b', '2c'], Foundation3: ['3a', '3b', '3c'], Foundation4: ['4a', '4b'], Overview: ['Ü1', 'Ü2', 'Ü3'] };
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

test('1a: nine stones are buttons in reading order with a live explanation and a value table', () => {
  const html = render(Foundation1);
  const buttons = [...html.matchAll(/<button type="button" class="s2-stein[^"]*" aria-pressed="false" aria-label="([^"]+)"/g)].map(m => m[1]);
  assert.deepEqual(buttons, [
    'Zeile 1, Variable sex: 2 FRAU', 'Zeile 1, Variable ls01: 8', 'Zeile 1, Variable rh08b: 3 GAR NICHTS',
    'Zeile 2, Variable sex: 1 MANN', 'Zeile 2, Variable ls01: 0 GANZ UNZUFRIEDEN', 'Zeile 2, Variable rh08b: 2 ETWAS',
    'Zeile 3, Variable sex: 2 FRAU', 'Zeile 3, Variable ls01: 7', 'Zeile 3, Variable rh08b: fehlt, Wertelabel KEINE ANGABE',
  ]);
  assert.match(html, /<p class="erkl s2-erkl" aria-live="polite">Wähl einen Wert aus, im Bild einen Stein\.<\/p>/);
  const table = textOf(html.match(/<table class="daten"><caption>Drei Fragebögen als Datenmatrix[\s\S]*?<\/table>/)?.[0] ?? '');
  assert.match(table, /1 2 FRAU 8 3 GAR NICHTS 2 1 MANN 0 GANZ UNZUFRIEDEN 2 ETWAS 3 2 FRAU 7 fehlt \(KEINE ANGABE\)/);
  assert.match(textOf(html), /Jede Zeile ist ein Fall, jede Spalte eine Variable, jede Zelle ein Wert\. Die Fragebögen sind ein Beispiel mit drei Personen\./);
});

test('1b: the tower question with feedback per wrong option', () => {
  for (const [v, text] of Object.entries(G1_TURM_WRONG)) assert.ok(unescape(render(Foundation1, { g1_turm: v })).includes(text), v);
  assert.match(textOf(render(Foundation1, { g1_turm: '5246' })), /Richtig\. Einen Wert für jede befragte Person, also 5\.246/);
});

test('2a: the pa02a picture appears only after „1 oder 5?“ is answered', () => {
  assert.doesNotMatch(render(Foundation2), /fehlende Werte/);
  const five = render(Foundation2, { g2_eins: '5' });
  assert.ok(unescape(five).includes(G2_EINS.hint));
  assert.ok(imageNames(five).includes(ALT.pa02a));
  assert.ok(imageNames(render(Foundation2, { g2_eins: '1' })).includes(ALT.pa02a));
});

test('2b and 2c: three labels, the codes of pv01 and the codebook entry as text', () => {
  const html = render(Foundation2);
  assert.ok(imageNames(html).includes(ALT.dreiBeschriftungen));
  assert.ok(imageNames(html).includes(ALT.pv01));
  assert.match(unescape(html), /\[239\] pa02a \(haven_labelled<double>\)/);
  assert.match(textOf(html), /480 Befragte die AfD und 260 die Linke/);
});

test('3a: four sheets, each with its own question; the gaps picture after all four', () => {
  const before = render(Foundation3);
  for (const s of SHEETS) {
    assert.match(before, new RegExp(`<form class="kurzueberlegen" id="${s.id}"`));
    assert.ok(imageNames(before).some(n => n.startsWith(`Fragebogen ${s.letter}: `)), s.letter);
  }
  assert.ok(!imageNames(before).includes(ALT.luecken));
  assert.ok(!imageNames(render(Foundation3, { g3_a: '0', g3_b: '-9', g3_c: '-42' })).includes(ALT.luecken));
  const after = render(Foundation3, SHEETS_DONE);
  assert.ok(imageNames(after).includes(ALT.luecken));
  for (const s of SHEETS) assert.ok(unescape(after).includes(s.right), s.id);
  assert.ok(unescape(render(Foundation3, { g3_d: '-9' })).includes(SHEETS[3].wrong));
});

test('3b and 3c: table of reasons with 17 codes; three cases of error or convention', () => {
  const html = render(Foundation3);
  const t = textOf(html);
  assert.match(t, /17 verschiedene solche Codes/);
  for (const n of ['178-mal', '603-mal', '81-mal', '2.263-mal', '1.596-mal', '1-mal']) assert.ok(t.includes(n), n);
  for (const id of ['g3_k1', 'g3_k2', 'g3_k3']) assert.match(html, new RegExp(`id="${id}"`));
  assert.match(textOf(render(Foundation3, { g3_k2: 'konvention' })), /Richtig\. Konvention: Das Codebuch kennt kein Kreuz auf der Linie/);
});

test('4b: three switches with aria-pressed, live text, picture text and table', () => {
  const html = render(Foundation4);
  const switches = [...html.matchAll(/<button type="button" aria-pressed="(true|false)">([^<]*)/g)].map(m => `${m[1]} ${m[2].trim()}`);
  assert.deepEqual(switches, ['true Original', 'false Wertelabel wird zum Wert', 'false Wertelabel entfernen']);
  assert.match(html, /<p class="erkl" aria-live="polite">So liegt <code>sex<\/code> im ALLBUS/);
  assert.ok(imageNames(html).includes(convertText('original')));
  assert.equal(convertText('original'), 'Variable sex, Typ dbl+lbl: 1 MANN, 2 FRAU, 2 FRAU, ein fehlender Wert mit dem Wertelabel KEINE ANGABE. Die Werte sind ein Beispiel mit vier Befragten.');
  assert.match(convertText('label'), /^Variable sex, Typ fct: MANN, FRAU, FRAU, ein fehlender Wert ohne Wertelabel, NA\. Das Wertelabel KEINE ANGABE liegt abgefallen daneben\./);
  assert.match(convertText('numeric'), /^Variable sex, Typ dbl: 1, 2, 2, ein fehlender Wert ohne Wertelabel, NA\./);
  assert.match(textOf(html), /Typ: dbl\+lbl Typ: fct Typ: dbl/);
  assert.equal(CONVERT_STATES.length, 3);
  assert.ok(imageNames(html).includes(ALT.typen));
});

test('overview: the flow picture, six cells to assign with feedback, the table before calculating', () => {
  const html = render(Overview);
  assert.ok(imageNames(html).includes(ALT.ablauf));
  assert.equal((html.match(/<select/g) ?? []).length, 6);
  const answered = render(Overview, { u_1: '0', u_3: '0' });
  assert.ok(answered.includes('Passt.'));
  assert.ok(answered.includes('Passt nicht:'));
  assert.ok(answered.includes('Noch 4 Zellen ohne Art.'));
  assert.ok(unescape(answered).includes(CELLS[2].why));
  assert.match(textOf(html), /nur Papier: 1\.656 von 5\.246/);
});

test('R lesen: three cards, the reading aid, the filter picture and the codebook words', () => {
  const html = renderToStaticMarkup(h(ChapterStateProvider, { sessionId: 2, initial: { predictions: {}, answers: {} } }, h(ReadR)));
  for (const id of ['r1', 'r2', 'r3']) assert.match(html, new RegExp(`<section class="karte" id="${id}"`));
  assert.ok(imageNames(html).includes(ALT.filterSex));
  assert.ok(imageNames(html).some(n => n.startsWith('frauen, das Objekt')));
  const t = textOf(html);
  for (const w of ['Label:', 'Values:', 'Value labels:', 'Missing values: … (n = 81)', 'Observations: 5246']) assert.ok(t.includes(w), w);
  assert.match(t, /Genauer erklärt: == und =, eine Pipe oder mehrere/);
});

test('review: each 3a legend carries the picture text; the live region announces a sentence, the image sits outside it', () => {
  const before = render(Foundation3);
  for (const s of SHEETS) assert.ok(unescape(before).includes(`>Fragebogen ${s.letter}, ${s.picture}: Was steht im Datensatz?</legend>`), s.letter);
  const after = render(Foundation3, SHEETS_DONE);
  const live = after.match(/<p class="hilfe-zeile" aria-live="polite">([^<]*)<\/p>/)?.[1] ?? '';
  assert.equal(live, 'Alle vier Fragebögen aufgelöst: Darunter steht jetzt das Bild der Variablen.');
  assert.doesNotMatch(after, /aria-live="polite"[^>]*>(?:(?!<\/p>)[\s\S])*role="img"/);
  assert.ok(imageNames(after).includes(ALT.luecken));
});

test('review: concept links to the free map where the map knows the id', () => {
  const all = [Foundation1, Foundation2, Foundation3, Foundation4].map(C => render(C)).join('');
  for (const id of ['series', 'labels', 'codebook', 'missing', 'conversion']) assert.match(all, new RegExp(`data-concept="${id}"`), id);
});
