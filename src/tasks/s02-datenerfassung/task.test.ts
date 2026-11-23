import test from 'node:test';
import assert from 'node:assert/strict';
import { countCode, initialS02 } from './domain';
import { renderSession, testData } from '../testRender';

test('session 2 shows three paper sheets, the entry grid and the release step', () => {
  const html = renderSession(1);
  assert.match(html, /Erster Tag in der Datenerfassung/);
  assert.match(html, /Fragebogen · Version A · Bogen 1/);
  assert.match(html, /Fragebogen · Version B · Bogen 2/);
  assert.match(html, /Kreuze bei „5“ und „6“/);
  assert.match(html, /Randnotiz/);
  assert.match(html, /aria-label="Bogen 2, pa01"/);
  assert.match(html, /Erfassung abschließen/);
  assert.match(html, /So gehst du vor/);
  assert.match(html, /Vorgemacht: Bogen 1/);
  assert.match(html, /<strong>0 von 18<\/strong> Zellen ausgefüllt/);
  assert.doesNotMatch(html, /erfunden/);
  assert.match(html, /3 · Doppelerfassung/);
  assert.match(html, /Dieser Schritt öffnet sich/);
  assert.doesNotMatch(html, /Abgleich mit Ben/);
  assert.match(html, /FÜR DAS PLENUM/);
  assert.doesNotMatch(html, /Dein ganzes R-Skript/);
});

test('after grading, open cells ask for a rule and Ben is compared', () => {
  const state = { ...initialS02(), graded: true, entries: { ...initialS02().entries, '2': { pa02a: '4', pa01: '5', pt03: '-11', st01: '3', pv01: '-8', ls01: '8' } } };
  const html = renderSession(1, true, { tasks: { s02: state } });
  assert.match(html, /Hier musstest du entscheiden/);
  assert.match(html, /Welche Regel gilt für Bogen 2, <code>pa01<\/code>\?.*Du hast 5 eingetragen/);
  assert.match(html, /3 · Doppelerfassung/);
  assert.match(html, /du leer · Ben 5/);
});

test('settling a difference keeps the row, shows the note and remembers the own number', () => {
  const graded = { ...initialS02(), graded: true, entries: { ...initialS02().entries, '1': { pa02a: '1', pa01: '3', pt03: '6', st01: '-11', pv01: '6', ls01: '8' } } };
  assert.match(renderSession(1, true, { tasks: { s02: graded } }), /Bogen 1, <code>pa02a<\/code>: du 1 · Ben 5/);
  const taken = { ...graded, entries: { ...graded.entries, '1': { ...graded.entries['1'], pa02a: '5' } }, settled: { '1.pa02a': 'other' as const }, kept: { '1.pa02a': '1' } };
  const html = renderSession(1, true, { tasks: { s02: taken } });
  assert.match(html, /Bogen 1, <code>pa02a<\/code>: du 1 · Ben 5/);
  assert.match(html, /Ben hat die Richtung der Skala verwechselt/);
  assert.match(html, /aria-label="Übernehmen – Bogen 1, pa02a, Zahl von Ben"/);
});

test('the toolbox shows every function on neutral examples; the solution code and the whole script stay hidden', () => {
  const start = renderSession(1);
  assert.match(start, /DEIN WERKZEUGKASTEN/);
  // Wie auf der Folie: eine einfache Pipe mit filter(), Umwandeln nur im freiwilligen Zusatz
  assert.match(start, /frauen &lt;- allbus %&gt;% filter\(sex == 2\)/);
  assert.doesNotMatch(start, /mode == 4|to_label\(allbus, pv01\)|<code>to_label\(\)<\/code><span class="task-toolbox-new">/);
  assert.match(start, /5 · Deine Regel festlegen/);
  assert.match(start, /Zusatz \(freiwillig\) · Parteinamen statt Codes/);
  assert.match(start, /Codes speichern mehr als Wörter/);
  assert.doesNotMatch(start, /Dein ganzes R-Skript/);
  const sav = testData().sav;
  const numbers = { mfn: String(countCode(sav, 'pa01', -42, 4)), dk: String(countCode(sav, 'st01', -8, 4)), afd: '' };
  const right = renderSession(1, true, { tasks: { s02: { ...initialS02(), numbers, revealed: true } } });
  assert.match(right, /Dein ganzes R-Skript zum Mitnehmen/);
  assert.match(right, /Zellen mit −42/);
});

test('the partner variant shows the row code after grading', () => {
  const html = renderSession(1, true, { tasks: { s02: { ...initialS02(), mode: 'pair' as const, graded: true } } });
  assert.match(html, /Dein Zeilencode/);
  assert.match(html, /value="S02:/);
});
