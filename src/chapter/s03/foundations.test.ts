import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement as h, type ComponentType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ChapterStateProvider } from '../ChapterContext';
import type { ChapterState } from '../state';
import {
  K1C_Q, K2B_AFTER, MISSING_CODES, MIDDLE_ROWS, middleFeedback, K3A_Q, K3C_Q, LA01, ROW_TEXT, SHELVES_SOLVED, STONES_TEXT, STRIP_DH04_SOLVED, STRIP_LA01_SOLVED, TOWER_TEXT, TREE_TEXT,
} from './content';
import { Foundation1, Foundation2, Foundation3, Foundation4, Overview } from './Foundations';
import { ROW_STATS, stepButton } from './figures/HouseholdRow';
import { DESCRIBE_LINES, middlesSummary, middlesWrongTexts } from './figures/Middles';
import { shelvesSummary, shelvesWrongTexts } from './figures/Shelves';
import { stoneOrder } from './figures/Stones';
import { dhStripText, laStripText } from './figures/Strip';
import { TOWER_COUNTS, TOWER_EMPTY, TOWER_VALID } from './figures/TowerToTable';

const ALL: [string, ComponentType][] = [['Foundation1', Foundation1], ['Foundation2', Foundation2], ['Foundation3', Foundation3], ['Foundation4', Foundation4], ['Overview', Overview]];

function render(C: ComponentType, answers: Record<string, string> = {}) {
  const initial: ChapterState = { predictions: {}, answers };
  return renderToStaticMarkup(h(ChapterStateProvider, { sessionId: 3, initial }, h(C)));
}
const unescape = (s: string) => s.replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const textOf = (html: string) => unescape(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
/** Accessible names of all role="img" elements (aria-label, or the text of the aria-labelledby target). */
const imageNames = (html: string) => [...html.matchAll(/<[^>]*\brole="img"[^>]*>/g)].map(([tag]) => {
  const label = tag.match(/\baria-label="([^"]*)"/)?.[1];
  if (label !== undefined) return unescape(label);
  const id = tag.match(/\baria-labelledby="([^"]*)"/)?.[1] ?? '';
  return textOf(html.match(new RegExp(`<div id="${id}"[^>]*>([\\s\\S]*?)</div>`))?.[1] ?? '');
});

test('foundation blocks with ids, skip links and step labels as in the plan', () => {
  const steps: Record<string, string[]> = { Foundation1: ['1a', '1b', '1c'], Foundation2: ['2a', '2b'], Foundation3: ['3a', '3b', '3c'], Foundation4: ['4'], Overview: ['Ü1', 'Ü2', 'Ü3'] };
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

test('no R code to run in the foundations: no workshop', () => {
  for (const [name, C] of ALL) assert.doesNotMatch(render(C), /class="workshop"|<textarea/, name);
});

test('every role="img" has a text version of at least 40 characters', () => {
  for (const [name, C] of ALL) for (const label of imageNames(render(C))) assert.ok(label.length >= 40, `${name}: "${label}"`);
});

test('B1 tower to table: three steps, counts from the example, text per step and as a whole', () => {
  assert.deepEqual(TOWER_COUNTS, [3, 2, 1, 4, 1]);
  assert.deepEqual([TOWER_VALID, TOWER_EMPTY], [11, 1]);
  const g1 = render(Foundation1);
  assert.deepEqual([...g1.matchAll(/<button[^>]*>(Schritt \d: [^<]*)<\/button>/g)].map(m => m[1]), ['Schritt 1: Turm', 'Schritt 2: Stapel', 'Schritt 3: Tabelle']);
  assert.match(g1, /aria-current="step"[^>]*>Schritt 1: Turm/);
  assert.match(g1, new RegExp(`<p class="sr-only" aria-live="polite">${TOWER_TEXT[0].slice(0, 30)}`));
  assert.ok(textOf(g1).includes(TOWER_TEXT.join(' ')), 'whole text version under the picture');
  assert.match(TOWER_TEXT[1], /3, 2, 1, 4 und 1 Steine/);
});

test('B2 frequency table: real table with caption, four toggles, every printed number, explanations in details', () => {
  const g1 = render(Foundation1);
  assert.match(g1, /<caption>Ausgabe von frequency\(la01\)<\/caption>/);
  assert.deepEqual([...g1.matchAll(/<button[^>]*aria-pressed="false"[^>]*>([^<]*)<\/button>/g)].map(m => m[1]), ['N', 'Raw %', 'Valid %', 'Cum. %']);
  assert.match(g1, /<p class="erkl" aria-live="polite">Wähl eine Spalte\.<\/p>/);
  for (const r of LA01.rows) for (const v of [String(r.n), r.raw.toFixed(2), r.valid.toFixed(2), r.cum.toFixed(2)]) assert.ok(g1.includes(`>${v}<`), `${r.label} ${v}`);
  assert.match(g1, /<th scope="row" colSpan="2">Total valid<\/th>/i);
  assert.match(textOf(g1), /Alle vier Spalten erklärt N ist die absolute Häufigkeit/);
  assert.match(textOf(g1), /# total N=5246 valid N=5223 mean=3\.08 sd=1\.42 skewness=-0\.17/);
});

test('B3 strip la01: no marks until 1c is answered, then median and mode in picture and text', () => {
  assert.equal(laStripText(false).includes(STRIP_LA01_SOLVED), false);
  const before = render(Foundation1);
  assert.ok(imageNames(before).includes(laStripText(false)));
  assert.doesNotMatch(before, /font-weight="800">(Median|Modus|Mitte: 50 %)<\/text>/);
  const after = render(Foundation1, { [K1C_Q.id]: 's' });
  assert.ok(imageNames(after).includes(laStripText(true)));
  assert.match(after, /font-weight="800">Median<\/text>/);
  assert.match(after, /font-weight="800">Modus<\/text>/);
  assert.match(after, /font-weight="800">Mitte: 50 %<\/text>/);
  assert.match(textOf(after), /Noch nicht\. „Seltener“ ist die häufigste Antwort, der Modus\./);
  assert.match(textOf(render(Foundation1, { [K1C_Q.id]: 'm' })), /Genau\. Bis „pro Woche“ kommen erst 38,56 %/);
});

test('B4 shelves: seven selects with labels, summary and solution after checking, right stones move into the shelf', () => {
  const g2 = render(Foundation2);
  assert.equal((g2.match(/<select/g) ?? []).length, 7);
  for (const c of ['−11 TNZ: SPLIT', '−41 DATENFEHLER']) assert.ok(textOf(g2).includes(`Regal für ${c}`), c);
  assert.equal(shelvesSummary({}), 'Noch 7 Steine ohne Regal.');
  const all = { 'k2a-11': '1', 'k2a-10': '1', 'k2a-9': '2', 'k2a-8': '2', 'k2a-7': '2', 'k2a-42': '3', 'k2a-41': '3' };
  assert.equal(shelvesSummary(all), 'Alle sieben richtig sortiert.');
  assert.equal(shelvesSummary({ ...all, 'k2a-42': '2' }), '6 von 7 richtig. Unter jedem Stein steht, worauf du achten kannst.');
  const checked = render(Foundation2, { ...all, 'k2a-42': '2' });
  assert.ok(textOf(checked).includes(SHELVES_SOLVED));
  assert.match(textOf(checked), /Noch nicht\. Zwei Kreuze auf dem Papierbogen/);
  assert.match(textOf(checked), /Richtig\. TNZ heißt „trifft nicht zu“/);
  const shelf1 = checked.match(/<li class="s3-regal"><b>1 Studiendesign<\/b>[\s\S]*?<\/li>/)?.[0] ?? '';
  assert.match(textOf(shelf1), /−11 TNZ: SPLIT −10 TNZ: FILTER/);
});

test('B5 hundred stones: 100 per base, start „alle“, text in aria-live; 2b question with the extra line', () => {
  for (const base of ['all', 'valid'] as const) assert.equal(stoneOrder(base).length, 100);
  assert.equal(stoneOrder('all').filter(x => x === null).length, 32);
  assert.equal(stoneOrder('valid').filter(x => x === 2).length, 41);
  const g2 = render(Foundation2);
  assert.match(g2, /aria-pressed="true"[^>]*>Basis: alle 5\.246 Befragten/);
  assert.ok(g2.includes(`<p class="sr-only" aria-live="polite">${STONES_TEXT.all}</p>`));
  assert.match(textOf(g2), /kommt darauf an: 28 %/);
  assert.doesNotMatch(textOf(g2), new RegExp(K2B_AFTER.slice(0, 20)));
  assert.ok(textOf(render(Foundation2, { 'k2b-frage': 'r28' })).includes(K2B_AFTER));
  assert.match(textOf(g2), /Genauer erklärt: Eine eigene Basis rechnen/);
});

test('B8 household row: steps, statistics, step 4 only after answering 3a', () => {
  assert.deepEqual([ROW_STATS.nine.sum, Math.round(ROW_STATS.nine.mean * 100) / 100, ROW_STATS.nine.median], [22, 2.44, 2]);
  assert.deepEqual([ROW_STATS.ten.sum, ROW_STATS.ten.mean, ROW_STATS.ten.median], [34, 3.4, 2]);
  const before = render(Foundation3);
  const steps = (html: string) => [...html.matchAll(/<button[^>]*>(Schritt \d: [^<]*)<\/button>/g)].map(m => m[1]);
  assert.deepEqual(steps(before), ['Schritt 1: Turm', 'Schritt 2: Reihe', 'Schritt 3: Mittelwert']);
  assert.ok(before.includes(`Schritt 1: ${ROW_TEXT[0]}`));
  const after = render(Foundation3, { [K3A_Q.id]: 'mittel' });
  assert.deepEqual(steps(after), ['Schritt 1: Turm', 'Schritt 2: Reihe', 'Schritt 3: Mittelwert', 'Schritt 4: mit der WG']);
  assert.match(after, /aria-current="step"[^>]*>Schritt 4: mit der WG/);
  assert.ok(after.includes(`Schritt 4: ${ROW_TEXT[3]}`));
  assert.match(textOf(after), /Wieder ohne die WG/);
  assert.match(textOf(after), /22 \+ 12 = 34/);
});

test('3b scale levels as a table and the middle check; 3c describe() output with highlighted columns', () => {
  const g3 = render(Foundation3);
  assert.match(g3, /<caption>Welche Mitte passt zu welchem Skalenniveau\?<\/caption>/);
  assert.match(textOf(g3), /ordinal Reihenfolge, aber ungleiche Abstände Bücher lesen \(la01\), „täglich“ bis „nie“ ✓ ja ✓ ja ! nur mit Vorsicht/);
  assert.equal((g3.match(/type="checkbox"/g) ?? []).length, 9);
  assert.equal(middlesSummary({ 'k3b-wahl': 'modus', 'k3b-gesundheit': 'modus,median', 'k3b-alter': 'modus,median,mittelwert' }), 'Alles richtig zugeordnet.');
  assert.equal(middlesSummary({ 'k3b-wahl': 'modus,mittelwert', 'k3b-gesundheit': '-', 'k3b-alter': 'modus,median,mittelwert' }), '1 von 3 Zeilen richtig.');
  assert.match(textOf(render(Foundation3, { 'k3b-wahl': 'modus,median' })), /Noch nicht\. Parteien haben keine Reihenfolge, also keine Mitte\./);
  const hl = [...g3.matchAll(/<span class="s3-hl">([^<]*)<\/span>/g)].map(m => m[1].trim());
  assert.deepEqual(hl, ['Mean', 'Median', 'N', 'Missing', '2.342', '2.000', '5144', '102']);
  assert.ok(DESCRIBE_LINES.includes('  dh04      2.342   2.000  1.177  11.000  1.000     1.209  5144      102'));
  assert.match(textOf(render(Foundation3, { [K3C_Q.id]: 'rundet' })), /R rundet nicht ab: 2\.000 ist genau 2\./);
});

test('B11 strip dh04: brackets and solved text after the number question', () => {
  const before = render(Foundation4);
  assert.ok(imageNames(before).includes(dhStripText(false)));
  assert.doesNotMatch(before, /über dem Mittelwert: 32,58 %/);
  const after = render(Foundation4, { 'k4-frage': '67,42' });
  assert.ok(imageNames(after).includes(dhStripText(true)));
  assert.ok(dhStripText(true).endsWith(STRIP_DH04_SOLVED));
  assert.match(after, /über dem Mittelwert: 32,58 %/);
  assert.match(textOf(after), /Das sind alle bis einschließlich 2 Personen/);
});

test('overview: tables and the decision tree read once via aria-labelledby', () => {
  const ov = render(Overview);
  assert.match(ov, /role="img" aria-labelledby="mitte-baum-text"/);
  assert.ok(ov.includes(`<div id="mitte-baum-text" class="sr-only" aria-hidden="true">${TREE_TEXT}</div>`));
  assert.match(textOf(ov), /„39,4 % aller Befragten, auch derer ohne gültige Antwort, erwarten eine etwas schlechtere Lage\.“/);
  assert.match(textOf(ov), /Mittelwert gleiche Abstände \(metrisch\)/);
});

const liveOf = (html: string) => [...html.matchAll(/<p class="[^"]*"[^>]*aria-live="polite"[^>]*>([\s\S]*?)<\/p>/g)].map(m => textOf(m[1]));

test('review: wrong stones and rows are part of the live summaries', () => {
  const all = { 'k2a-11': '1', 'k2a-10': '1', 'k2a-9': '2', 'k2a-8': '2', 'k2a-7': '2', 'k2a-42': '3', 'k2a-41': '3' };
  const stone = MISSING_CODES.find(c => c.code === -42)!;
  assert.ok(shelvesWrongTexts({ ...all, 'k2a-42': '2' }).includes(stone.wrong));
  assert.equal(shelvesWrongTexts(all), '');
  assert.ok(liveOf(render(Foundation2, { ...all, 'k2a-42': '2' })).some(t => t.includes(stone.wrong) && t.includes('6 von 7 richtig')));
  const row = MIDDLE_ROWS[0];
  const bad = { 'k3b-wahl': 'modus,median', 'k3b-gesundheit': 'modus,median', 'k3b-alter': 'modus,median,mittelwert' };
  assert.ok(middlesWrongTexts(bad).includes(middleFeedback(row, ['modus', 'median']).text));
  assert.ok(liveOf(render(Foundation3, bad)).some(t => t.includes('2 von 3 Zeilen richtig.') && t.includes('Parteien haben keine Reihenfolge')));
});

test('review: K2B_AFTER sits inside the live text, strips announce their solved text, describe output is a region', () => {
  assert.ok(liveOf(render(Foundation2, { 'k2b-frage': 'r28' })).some(t => t.includes(K2B_AFTER)));
  assert.ok(!liveOf(render(Foundation2)).some(t => t.includes(K2B_AFTER)));
  assert.ok(liveOf(render(Foundation1, { [K1C_Q.id]: 's' })).includes(laStripText(true)));
  assert.ok(!liveOf(render(Foundation1)).includes(laStripText(true)));
  assert.ok(liveOf(render(Foundation4, { 'k4-frage': '67,42' })).includes(dhStripText(true)));
  assert.match(render(Foundation3), /<pre[^>]*role="region"[^>]*aria-label="Ausgabe von describe\(dh04\)"/);
});

test('review: focus target of „Wieder ohne die WG“ is the step 3 button', () => {
  const buttons = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
  const root = { querySelectorAll: (sel: string) => (sel === '.schritt-nav button' ? buttons : []) } as unknown as ParentNode;
  assert.deepEqual(stepButton(root, 2), buttons[2]);
  assert.equal(stepButton(null, 2), undefined);
});

test('review: free-map hints are MapLinks with a concept id', () => {
  const html = [Foundation1, Foundation2, Foundation3].map(C => render(C)).join('');
  assert.deepEqual([...html.matchAll(/<p class="s3-karte-link" data-concept="([^"]+)">/g)].map(m => m[1]), ['frequency', 'median', 'missing', 'mean', 'describe']);
});
