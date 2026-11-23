import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement as h, type ComponentType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ChapterStateProvider } from '../ChapterContext';
import type { ChapterState } from '../state';
import { ERROR_CASES, LAB, PANES, SORTER_ALL_RIGHT, TOOL_QUESTIONS } from './content';
import { Foundation1, Foundation2, Foundation3, Foundation4, Overview } from './Foundations';
import { labOutput } from './figures/SearchLab';
import { PARTS } from './figures/FrequencyTable';

const ALL: [string, ComponentType][] = [['Foundation1', Foundation1], ['Foundation2', Foundation2], ['Foundation3', Foundation3], ['Foundation4', Foundation4], ['Overview', Overview]];

function render(C: ComponentType, answers: Record<string, string> = {}) {
  return renderToStaticMarkup(h(ChapterStateProvider, { sessionId: 1, initial: { predictions: {}, answers } as ChapterState }, h(C)));
}
const unescape = (s: string) => s.replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const textOf = (html: string) => unescape(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();

test('every role="img" has a text version of at least 40 characters', () => {
  let count = 0;
  for (const [name, C] of ALL) for (const [tag] of render(C).matchAll(/<[^>]*\brole="img"[^>]*>/g)) {
    count++;
    assert.ok(unescape(tag.match(/\baria-label="([^"]*)"/)?.[1] ?? '').length >= 40, `${name}: ${tag.slice(0, 100)}`);
  }
  assert.equal(count, 6, 'rstudio, projekt, pakete, find-var, fehler, weg');
});

test('no code workshop in the foundations', () => {
  for (const [name, C] of ALL) assert.doesNotMatch(render(C), /class="workshop"/, name);
});

test('foundation blocks with ids, skip links and step labels as in the plan', () => {
  const steps: Record<string, string[]> = { Foundation1: ['1a', '1b', '1c', '1d'], Foundation2: ['2a', '2b'], Foundation3: ['3a', '3b'], Foundation4: ['4a', '4b'], Overview: ['✓'] };
  ALL.forEach(([name, C], i) => {
    const html = render(C), n = i + 1;
    assert.match(html, new RegExp(`<section class="grund-block" id="g${n}"`), name);
    if (n <= 4) assert.match(html, new RegExp(`<a class="zur" href="#a${n}">Schon klar\\? Direkt zu Aufgabe ${n} ↓</a>`), name);
    const found = [...html.matchAll(/<span class="g-schritt"><span class="sr-only">Schritt <\/span>([^<]+)<\/span>/g)].map(m => m[1]);
    assert.deepEqual(found, steps[name], name);
  });
});

test('„Kurz überlegen“ in 1a, 1c, 1d, 2b and 3b; saved answers give the plan feedback', () => {
  const g1 = render(Foundation1, { 'g1-skript': 'konsole', 'g1-projekt': 'fehlt' });
  for (const id of ['g1-skript-q', 'g1-projekt-q', 'g1-pakete-q']) assert.match(g1, new RegExp(`id="${id}"`));
  assert.ok(textOf(g1).includes('Die Konsole führt aus, vergisst aber alles beim Schließen'));
  assert.ok(textOf(g1).includes('Genau: R sucht nur im Arbeitsordner'));
  assert.match(render(Foundation2), /id="g2-sport-q"/);
  const g3 = textOf(render(Foundation3, { 'g3-gefragt': '3.599' }));
  assert.ok(g3.includes('3.599: alle 5.246 minus die 1.647 mit TNZ: SPLIT.'));
});

test('RStudio picture: four buttons in a group, live line, text version of all four windows', () => {
  const html = render(Foundation1);
  const group = html.match(/<div class="s1-wahl" role="group" aria-label="Fenster wählen">([\s\S]*?)<\/div>/)?.[1] ?? '';
  assert.deepEqual([...group.matchAll(/<button[^>]*aria-pressed="false"[^>]*>([^<]*)<\/button>/g)].map(m => m[1]), ['Skript', 'Konsole', 'Environment', 'Files und Viewer']);
  assert.match(html, /<p class="erkl" aria-live="polite">Wähl ein Fenster\.<\/p>/);
  const list = textOf(html.slice(html.indexOf('Die vier Fenster')));
  for (const p of PANES) assert.ok(list.includes(`${p.name} (${p.where}):`), p.id);
});

test('search lab: seven words as toggle buttons, empty start, outputs exactly as R prints them', () => {
  const html = render(Foundation2);
  const group = html.match(/role="group" aria-label="Suchwort wählen">([\s\S]*?)<\/div>/)?.[1] ?? '';
  assert.equal([...group.matchAll(/aria-pressed="false"/g)].length, LAB.length);
  assert.match(textOf(html), /Wähl ein Suchwort\./);
  assert.equal(labOutput(0), '> find_var(allbus, "bücher")\nNo variables found matching "bücher".');
  assert.equal(labOutput(5).split('\n').length, 12, 'command, header and ten hits');
  assert.match(textOf(html), /col zeigt, an welcher Stelle die Variable im Datensatz steht/);
});

test('pi08 table: caption, scope heads, rows as frequency() prints them, five toggles', () => {
  const html = render(Foundation3);
  assert.match(html, /<caption>Ausgabe von frequency\(allbus, pi08\), ALLBUS 2023, ungewichtet<\/caption>/);
  assert.equal([...html.matchAll(/<th scope="col">/g)].length, 6, 'six column heads');
  const t = textOf(html);
  for (const row of ['1 KEINE KLIMAAENDERUNG 70 1.33 2.00 2.00', '4 MENSCHL. URSACHEN 1812 34.54 51.67 100.00', 'Total valid 3507 66.85 100.00', '-11 TNZ: SPLIT 1647 31.40', 'Total missing 1739 33.15', 'Total 5246 100.00']) assert.ok(t.includes(row), row);
  assert.ok(t.includes('# total N=5246 valid N=3507 mean=3.40 sd=0.72 skewness=-1.09'));
  assert.equal([...html.matchAll(/<button type="button" aria-pressed="false">/g)].length, PARTS.length);
  const formula = html.match(/<div class="formel s1-formel" role="group"[\s\S]*?<span class="sr-only">([^<]*)<\/span>/)?.[1] ?? '';
  assert.match(formula, /3\.507 gleich 5\.246 minus 1\.739/);
});

test('message sorter: seven labelled selects; feedback per message and in the live summary', () => {
  const html = render(Foundation4);
  for (let i = 1; i <= 7; i++) assert.match(html, new RegExp(`<label for="g4-sort-${i}">`));
  assert.equal([...html.matchAll(/<select id="g4-sort-\d"/g)].length, 7);
  const right = Object.fromEntries(ERROR_CASES.map((c, i) => [`g4-sort-${i + 1}`, c.target]));
  assert.ok(textOf(render(Foundation4, right)).includes(SORTER_ALL_RIGHT));
  const some = textOf(render(Foundation4, { 'g4-sort-1': 'A', 'g4-sort-2': 'C' }));
  assert.ok(some.includes('Noch 5 ohne Zuordnung.'));
  assert.ok(some.includes('Passt: Die Funktion heißt codebook'));
  assert.ok(some.includes('Passt nicht. Der Name in Anführungszeichen ist Allbus mit großem A.'));
  const all = textOf(html);
  for (const en of ['could not find function "codebuch"', "object 'Allbus' not found", "there is no package called 'mariposa'"]) assert.ok(all.includes(en), en);
});

test('overview: route picture and tool assignment with feedback', () => {
  const answers = Object.fromEntries(TOOL_QUESTIONS.map((q, i) => [`ue-werkzeug-${i + 1}`, i === 0 ? 'dim' : q.target]));
  const t = textOf(render(Overview, answers));
  assert.ok(t.includes('4 von 5 richtig. Unter jeder Frage steht, warum.'));
  assert.ok(t.includes('Passt nicht. Erst der Startblock legt allbus an.'));
  assert.ok(t.includes('Passt: dim(allbus) zählt Zeilen und Spalten.'));
});
