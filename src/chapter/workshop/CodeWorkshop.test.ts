import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { fixtureBuffer } from '../../sandbox/testData';
import { loadAllbusFile } from '../../sandbox/ui/DataDrop';
import { AllbusContext, type AllbusState } from '../allbusContext';
import { CodeWorkshop } from './CodeWorkshop';

const template = 'allbus %>%\n  frequency(⟦hs01⟧)\n# ⟦Kommentar⟧';
const ctx = (data: AllbusState['data'], restoring = false): AllbusState => ({ data, setData: () => {}, forget: async () => {}, notStored: false, markStored: () => {}, restoring });
const render = (props: Record<string, unknown>, data: AllbusState['data'] = null, restoring = false) =>
  renderToStaticMarkup(createElement(AllbusContext.Provider, { value: ctx(data, restoring) },
    createElement(CodeWorkshop, { id: 'w1', title: 'Häufigkeiten', template, ...props } as never)));

test('marks list and aria-describedby, no brackets in the editor text', () => {
  const html = render({ live: true }).replace(/<!-- -->|<span>|<\/span>/g, '');
  assert.match(html, /<ul[^>]*id="w1-st"/);
  assert.match(html, /<li>Zeile 2: <code>hs01<\/code><\/li><li>Zeile 3: <code>Kommentar<\/code><\/li>/);
  assert.match(html, /<textarea[^>]*aria-describedby="w1-st w1-hw"/);
  assert.match(html, /aria-label="R-Code: Häufigkeiten"/);
  const ta = html.match(/<textarea[^>]*>([^]*?)<\/textarea>/)![1];
  assert.doesNotMatch(ta, /[⟦⟧]/);
  assert.match(ta, /frequency\(hs01\)/);
});

test('try-out text replaces the marks line', () => {
  const html = render({ live: true, tryOut: true, template: 'x' });
  assert.match(html, /Probier-Werkstatt: Ändere den Vorschlag oder schreib ganz neu\./);
  const both = render({ live: true, tryOut: true });
  assert.match(both, /Probier-Werkstatt/);
  assert.doesNotMatch(both, /Zum Anpassen markiert/);
});

test('run button uses aria-disabled so it stays focusable', () => {
  const html = render({ live: true });
  assert.match(html, /<button[^>]*class="run"[^>]*aria-disabled="true"/);
  assert.doesNotMatch(html, /class="run"[^>]*\sdisabled/);
});

test('shortcut list and run hint only appear when the workshop can run', () => {
  const quiet = render({ template: 'x' });
  assert.doesNotMatch(quiet, /Tastenkürzel/);
  assert.doesNotMatch(quiet, /einfach ausführen/);
  assert.match(render({ live: true, template: 'x' }), /Tastenkürzel/);
  assert.match(render({ template: 'x' }), /<textarea[^>]*aria-describedby="w1-st"/);
});

test('without a file the output area shows the file zone, with a file it does not', async () => {
  assert.match(render({ live: true }), /Zum Ausführen braucht die Werkstatt einmal deine ALLBUS-Datei\.[^]*ALLBUS-Datei hierher ziehen/);
  const data = await loadAllbusFile({ name: 'ZA8831_v1-3-0.sav', arrayBuffer: async () => fixtureBuffer() });
  const html = render({ live: true }, data);
  assert.doesNotMatch(html, /hierher ziehen/);
  assert.match(html, /aria-live="polite"/);
});

test('without live only copy is offered', () => {
  const html = render({});
  assert.doesNotMatch(html, /Ausführen/);
  assert.match(html, /Kopieren/);
  assert.doesNotMatch(html, /hierher ziehen/);
});

test('live offers run, reset and copy', () => {
  const html = render({ live: true });
  assert.match(html, /<span aria-hidden="true">▶<\/span> Ausführen<\/button>/);
  assert.match(html, /Zurücksetzen/);
  assert.match(html, /Kopieren/);
});

test('chapter.css switches ligatures off in the workshop textarea', () => {
  const css = readFileSync(new URL('../chapter.css', import.meta.url), 'utf8');
  assert.match(css, /\.workshop textarea[^{]*\{[^}]*font:[^;}]*;[^}]*font-variant-ligatures:\s*none/);
});

test('the output label is not a heading and names the output region', () => {
  const html = render({ live: true });
  assert.doesNotMatch(html, /<h4/);
  assert.match(html, /<p class="[^"]*label[^"]*" id="w1-aus-h">Ausgabe<\/p>/);
  assert.match(html, /<div class="wk-aus" role="region" aria-labelledby="w1-aus-h">/);
});

test('copy-only workshops fit the code lines, live ones keep the minimum height', () => {
  const quiet = render({});
  assert.match(quiet, /class="wk-editor wk-kurz"/);
  assert.match(quiet, /<textarea[^>]*rows="3"/);
  assert.doesNotMatch(render({ live: true }), /wk-kurz/);
  const css = readFileSync(new URL('../chapter.css', import.meta.url), 'utf8');
  assert.match(css, /\.workshop \.wk-editor\.wk-kurz\{[^}]*min-height:\s*0/);
});

/** Inner HTML of every aria-live region (no nesting inside them). */
const liveRegions = (html: string) => [...html.matchAll(/<(\w+)[^>]*aria-live="[^"]+"[^>]*>([^]*?)<\/\1>/g)].map(m => m[2]);

test('idle hints are not announced: they stay outside every live region', async () => {
  const none = render({ live: true });
  assert.match(none, /Zum Ausführen braucht die Werkstatt einmal deine ALLBUS-Datei\./);
  assert.ok(liveRegions(none).every(t => !/braucht die Werkstatt/.test(t)));
  const data = await loadAllbusFile({ name: 'ZA8831_v1-3-0.sav', arrayBuffer: async () => fixtureBuffer() });
  const ready = render({ live: true }, data);
  assert.match(ready, /Hier erscheint, was R ausgibt\./);
  assert.match(ready, /drücke <span aria-hidden="true">▶<\/span> Ausführen\./);
  assert.ok(liveRegions(ready).every(t => !/Hier erscheint/.test(t)));
  // The status line itself is a live region, present (empty) before anything runs.
  assert.match(ready, /<span[^>]*class="wk-meldung"[^>]*aria-live="polite"[^>]*><\/span>/);
});

test('while the stored file is being restored, neither the file zone nor the file hint shows', () => {
  const html = render({ live: true }, null, true);
  assert.doesNotMatch(html, /hierher ziehen/);
  assert.doesNotMatch(html, /braucht die Werkstatt/);
  assert.doesNotMatch(html, /Hier erscheint/);
});

test('a hint replaces the line for templates without marks', () => {
  const plain = render({ live: true, template: 'x' });
  assert.match(plain, /Hier ist nichts markiert: einfach ausführen und lesen\./);
  const broken = render({ live: true, template: 'x', hint: 'Dieser Code hat absichtlich einen Fehler in `frequency()`.' });
  assert.doesNotMatch(broken, /Hier ist nichts markiert/);
  assert.match(broken, /<p class="stellen-liste" id="w1-st">Dieser Code hat absichtlich einen Fehler in <code>frequency\(\)<\/code>\.<\/p>/);
});
