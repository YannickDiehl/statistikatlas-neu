import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement as h, type ComponentType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ChapterStateProvider } from '../ChapterContext';
import type { ChapterState } from '../state';
import { CUTS, WORK, type Group } from './content';
import { Foundation1, Foundation2, Foundation3, Foundation4, Overview } from './Foundations';
import { baseSentence, cutResult, ruleInWords } from './figures/Interactive';

const ALL: [string, ComponentType][] = [['Foundation1', Foundation1], ['Foundation2', Foundation2], ['Foundation3', Foundation3], ['Foundation4', Foundation4], ['Overview', Overview]];

function render(C: ComponentType, answers: Record<string, string> = {}) {
  const initial: ChapterState = { predictions: {}, answers };
  return renderToStaticMarkup(h(ChapterStateProvider, { sessionId: 5, initial }, h(C)));
}
const unescape = (s: string) => s.replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const textOf = (html: string) => unescape(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();

test('every role="img" has a text version of at least 40 characters', () => {
  let count = 0;
  for (const [name, C] of ALL) {
    for (const tag of render(C).match(/<[^>]*\brole="img"[^>]*>/g) ?? []) {
      count++;
      assert.ok(unescape(tag.match(/\baria-label="([^"]*)"/)?.[1] ?? '').length >= 40, `${name}: ${tag.slice(0, 100)}`);
    }
  }
  assert.ok(count >= 3, 'three bases, reading direction, umpolen');
});

test('no R workshop in foundations 1 to 4; the overview has the chi-square template to copy', () => {
  for (const [name, C] of ALL.slice(0, 4)) assert.doesNotMatch(render(C), /class="workshop"/, name);
  assert.doesNotMatch(render(Foundation1), /<code>/, 'Grundlage 1 ohne R-Code');
  const o = render(Overview);
  assert.equal([...o.matchAll(/class="workshop"/g)].length, 1);
  assert.match(o, /readOnly|readonly/);
});

test('foundation blocks with ids, skip links and step labels', () => {
  const steps: Record<string, string[]> = { Foundation1: ['1a'], Foundation2: ['2a'], Foundation3: ['3a'], Foundation4: ['4a', '4b'], Overview: ['Ü1', 'Ü2', 'Ü3'] };
  ALL.forEach(([name, C], i) => {
    const html = render(C), n = i + 1;
    assert.match(html, new RegExp(`<section class="grund-block" id="g${n}"`), name);
    if (n <= 4) assert.match(html, new RegExp(`<a class="zur" href="#a${n}">Schon klar\\? Direkt zu Aufgabe ${n} ↓</a>`), name);
    const found = [...html.matchAll(/<span class="g-schritt"><span class="sr-only">Schritt <\/span>([^<]+)<\/span>/g)].map(m => m[1]);
    assert.deepEqual(found, steps[name], name);
  });
});

test('each foundation has Kurz gesagt, Genauer erklärt and Häufige Verwechslung', () => {
  for (const [name, C] of ALL.slice(0, 4)) {
    const t = textOf(render(C));
    for (const s of ['Kurz gesagt:', 'Genauer erklärt:', 'Häufige Verwechslung:', 'Kurz überlegen']) assert.ok(t.includes(s), `${name}: ${s}`);
  }
});

/* ---------- Kategorien zusammenfassen ---------- */

test('cutting groups: all rows start open, no share and no feedback yet', () => {
  const html = render(Foundation1);
  assert.doesNotMatch(html, /type="radio"[^>]*checked/);
  assert.equal([...html.matchAll(/name="s5-zuschnitt-/g)].length, WORK.length * 3);
  assert.match(textOf(html), /noch offen: 5\.246/);
  assert.match(textOf(html), /Noch 5 Zeilen offen\./);
  const r = cutResult(WORK.map(() => null));
  assert.deepEqual([r.n1, r.n0, r.share, r.feedback], [0, 0, null, '']);
});

test('cutting groups: each named cut gives its share and text; others get the general feedback', () => {
  for (const c of CUTS) {
    const r = cutResult(c.groups);
    assert.equal(Math.round(r.share! * 10) / 10, c.share, c.id);
    assert.equal(r.feedback, c.text, c.id);
  }
  const other = cutResult(['1', '0', '0', 'na', 'na'] as Group[]);
  assert.match(other.feedback, /^Deine Umkodierung ergibt 65,2 %\. Frag dich bei jeder Zeile/);
  assert.match(cutResult(['na', '1', '1', 'na', 'na'] as Group[]).feedback, /Noch kein Anteil/);
  assert.equal(ruleInWords(CUTS[0].groups), 'Deine Regel in Worten: Teilzeit (1): Teilzeit, nebenher berufstätig. Vollzeit (0): Vollzeit, ganztags. leer: nicht erwerbstätig, ohne gültige Angabe.');
  const partial = cutResult(['0', '1', null, null, null]);
  assert.equal(partial.open, 3);
  assert.equal(Math.round(partial.share! * 10) / 10, 26.3);
});

/* ---------- Basis-Schalter ---------- */

test('base switch: starts with row percent and the cell Frau/Teilzeit, sentences per basis', () => {
  const t = textOf(render(Foundation2));
  assert.match(t, /Von den 1\.665 Frauen arbeiten 860 Teilzeit oder nebenher: 51,7 %\. Die Basis ist die Zeile Frau\./);
  assert.equal(baseSentence('col', 1, 1), 'Von den 1.167 Teilzeitkräften sind 860 Frauen: 73,7 %. Die Basis ist die Spalte Teilzeit.');
  assert.equal(baseSentence('total', 1, 1), 'Von allen 3.359 Erwerbstätigen in der Tabelle sind 860 Frauen in Teilzeit: 25,6 %. Die Basis ist die ganze Tabelle.');
  assert.equal(baseSentence('col', 0, 1), 'Von den 1.167 Teilzeitkräften sind 301 Männer: 25,8 %. Die Basis ist die Spalte Teilzeit.');
  assert.match(baseSentence('row', 2, 1), /^Von den 14 Befragten mit der Angabe divers arbeiten 6 Teilzeit oder nebenher: 42,9 %\. .* Vorsicht: Die Basis sind nur 14 Menschen/);
  assert.doesNotMatch(baseSentence('col', 2, 1), /Vorsicht/);
});

test('three bases: text version as a table, formula with screen-reader text', () => {
  const html = render(Foundation2), t = textOf(html);
  assert.match(t, /Die drei Tabellen als Zahlen/);
  assert.match(t, /Frau Teilzeit 860 51,7 73,7 25,6/);
  assert.match(t, /Total Teilzeit 1\.167 34,7 100 34,7/);
  assert.match(t, /Basis Zeile Frau 1\.665, ergibt 51,7 Prozent\. Basis Spalte Teilzeit 1\.167, ergibt 73,7 Prozent\. Basis alle 3\.359, ergibt 25,6 Prozent\./);
  assert.match(t, /Gewichtet arbeiten 53,5 % der Frauen und 17,8 % der Männer Teilzeit/);
});

test('reading direction: picture text and points formula', () => {
  const t = textOf(render(Foundation3));
  assert.match(t, /Abstand: 51,7 Prozent minus 17,9 Prozent gleich 33,8 Prozentpunkte\. Verhältnis: 51,7 geteilt durch 17,9 ungefähr 2,9/);
  assert.match(t, /Kurz überlegen/);
});

test('overview: who is 100 %, prerequisites table and chi-square numbers', () => {
  const html = render(Overview), t = textOf(html);
  assert.equal([...html.matchAll(/<select id="u1-\d"/g)].length, 4);
  assert.match(t, /Voraussetzungen der Kreuztabelle/);
  assert.match(t, /chi2\(1\) = 20\.685, p < 0\.001 \*\*\*/);
  assert.match(t, /V = 0\.086 \(negligible\)/);
  const solved = textOf(render(Overview, { 'u1-1': '0', 'u1-2': '1', 'u1-3': '2', 'u1-4': '3' }));
  assert.match(solved, /Alle vier richtig\. In R gibt crosstab\(eastwest, misstrauen, percentages = "row"\) die Antwort/);
  assert.match(textOf(render(Overview, { 'u1-1': '1', 'u1-2': '1', 'u1-3': '2', 'u1-4': '3' })), /3 von 4 richtig/);
});
