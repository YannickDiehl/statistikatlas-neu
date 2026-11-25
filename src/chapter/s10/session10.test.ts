import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ChapterStateProvider } from '../ChapterContext';
import { activeChapter, chapterRegistry } from '../registry';
import type { ChapterState } from '../state';
import { QUESTIONS, REQUIRED, SCRIPT_FILE, TEMPLATES, THINK } from './content';
import { Session10, session10Status } from './Session10';

const empty: ChapterState = { predictions: {}, answers: {} };

/** Session 10 inside the session frame of LearningPath (h2 title) and a chapter state provider. */
function render(state: ChapterState = empty) {
  return renderToStaticMarkup(h('article', null,
    h('h2', { id: 'learning-heading' }, 'Regression vertiefen'),
    h(ChapterStateProvider, { sessionId: 10, initial: state }, h(Session10))));
}

const unescape = (s: string) => s.replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const textOf = (html: string) => unescape(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();

/** Markup of the element with this id, including nested elements of the same tag. */
function elementById(html: string, id: string): string {
  const open = new RegExp(`<(\\w+)[^>]*\\bid="${id}"[^>]*>`).exec(html);
  if (!open) return '';
  const tag = open[1];
  const re = new RegExp(`<${tag}\\b[^>]*>|</${tag}>`, 'g');
  re.lastIndex = open.index + open[0].length;
  let depth = 1;
  for (let m = re.exec(html); m; m = re.exec(html)) {
    depth += m[0].startsWith('</') ? -1 : 1;
    if (!depth) return html.slice(open.index, m.index + m[0].length);
  }
  return html.slice(open.index);
}

const headings = (html: string) => [...html.matchAll(/<h([2-6])\b[^>]*>([\s\S]*?)<\/h\1>/g)].map(m => ({ level: Number(m[1]), text: textOf(m[2]) }));
/** Every answer given, so that all pictures behind „Festlegen“/„Auflösen“ are rendered. */
const allAnswered: ChapterState = { predictions: { a1: 'bleibt etwa gleich' }, answers: { k1a: 'die Ältesten', [THINK.k4a.id]: 'mitte' } };
const html = render();
const full = render(allAnswered);
const TASKS = ['a1', 'a2', 'a3', 'a4'] as const;

test('registered as a preview-only chapter for session 10', () => {
  const entry = chapterRegistry[10];
  assert.ok(entry);
  assert.equal(entry.live, false);
  assert.equal(entry.Component, Session10);
  assert.equal(activeChapter(chapterRegistry, 10, false), undefined);
  assert.equal(activeChapter(chapterRegistry, 10, true), entry);
});

test('headings in the order of spec §5 (Variante B)', () => {
  const texts = headings(full).map(x => x.text);
  const order = [
    'Vorweg: R lesen', 'Ein Modell mit mehreren Prädiktoren', 'Die Ausgabe von summary() lesen', 'Neu: to_dummy()',
    'Thema 1: Mehrere Prädiktoren: konstant halten', 'Mehrere Prädiktoren: konstant halten', 'Aufgabe 1: Eigene Lage oder Lage des Landes?',
    'Thema 2: Gruppen als Prädiktoren: Dummyvariablen', 'Gruppen als Prädiktoren: Dummyvariablen', 'Aufgabe 2: Prägung oder Ort?',
    'Thema 3: Vergleichen und prüfen', 'Vergleichen und prüfen: Beta, korrigiertes R², Multikollinearität', 'Aufgabe 3: Was wiegt mehr, und was bleibt vom Ost-West-Unterschied?',
    'Thema 4: Grenzen des Modells', 'Grenzen des Modells: Einfluss und Interaktion', 'Aufgabe 4: Ist der Ost-West-Unterschied mit Abitur kleiner?',
    'Überblick: Ein Modell bauen und prüfen', 'Ein Modell bauen und prüfen',
    'Zum Schluss: Mitnehmen', 'Das Wichtigste aus dieser Sitzung', 'Prüf dich selbst', 'Dein Skript zum Mitnehmen',
  ];
  let at = -1;
  for (const t of order) {
    const i = texts.indexOf(t, at + 1);
    assert.ok(i > at, `„${t}“ after position ${at} (found ${texts.indexOf(t)})`);
    at = i;
  }
  for (const step of ['1a', '1b', '1c', '2a', '2b', '2c', '3a', '3b', '3c', '4a', '4b', 'Ü1', 'Ü2', 'Ü3', 'Ü4']) assert.ok(texts.some(t => t.startsWith(`Schritt ${step}`)), step);
});

test('headings without gaps below the h2 of the learning path', () => {
  for (const markup of [html, full]) {
    let prev = 2;
    for (const x of headings(markup)) {
      assert.ok(x.level <= prev + 1, `h${x.level} „${x.text}“ after h${prev}`);
      prev = x.level;
    }
  }
});

test('ids are unique; every table of contents and jump link has a target', () => {
  for (const markup of [html, full]) {
    const ids = [...markup.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
    assert.deepEqual(ids.filter((x, i) => ids.indexOf(x) !== i), []);
    const hrefs = [...markup.matchAll(/href="#([^"]+)"/g)].map(m => m[1]);
    for (const href of hrefs) assert.ok(ids.includes(href), `#${href} has a target`);
    for (const ref of [...markup.matchAll(/aria-(?:labelledby|describedby)="([^"]+)"/g)].flatMap(m => m[1].split(/\s+/))) assert.ok(ids.includes(ref), `aria reference ${ref}`);
  }
  const toc = html.slice(html.indexOf('class="chapter-toc"'), html.indexOf('class="chapter-body"'));
  for (const target of ['r1', 'r2', 'r3', 'thema1', 'thema2', 'thema3', 'thema4', 'ueberblick', 'mitnehmen', 'selbsttest', 'skript']) assert.match(toc, new RegExp(`href="#${target}"`));
});

test('jump bar: four separate links to the tasks, no „·“; the weighting note right below', () => {
  const bar = html.match(/<nav class="sprung"[\s\S]*?<\/nav>/)?.[0] ?? '';
  assert.deepEqual([...bar.matchAll(/<a href="#(a\d)">([^<]*)<\/a>/g)].map(m => `${m[1]} ${m[2]}`), ['a1 Aufgabe 1', 'a2 Aufgabe 2', 'a3 Aufgabe 3', 'a4 Aufgabe 4']);
  assert.doesNotMatch(textOf(bar), /·/);
  const after = html.slice(html.indexOf(bar) + bar.length, html.indexOf('id="werkzeug"'));
  assert.match(textOf(after), /^Alle Zahlen in diesem Kapitel sind gewichtet mit wghtpew/);
  assert.doesNotMatch(textOf(html), /·/);
  assert.doesNotMatch(textOf(html), /fiktiv/);
});

test('every task: goal, link to its foundation, prediction, three help levels, closed try-out workshop, error help', () => {
  TASKS.forEach((id, i) => {
    const task = elementById(html, id);
    assert.ok(task, id);
    assert.match(task, /<b>Ziel:<\/b> Am Ende/, id);
    assert.match(task, new RegExp(`<a class="zur-grund" href="#g${i + 1}">`), id);
    assert.match(task, /<b>Erst festlegen:<\/b>/, id);
    for (const s of ['Stufe 1: Denkanstoß', 'Stufe 2: Wo schaue ich?', 'Stufe 3: Lösung']) assert.match(task, new RegExp(`<summary>Hilfe, ${s.replace('?', '\\?')}</summary>`), `${id} ${s}`);
    const tryOut = task.match(/<details class="probier"[^>]*>/)?.[0];
    assert.ok(tryOut, `${id} try-out`);
    assert.doesNotMatch(tryOut!, /\bopen\b/);
    assert.match(task, /für die Aufgabe nicht nötig/);
    assert.match(task, /aria-label="R-Code: Deine Probier-Werkstatt"/);
    assert.match(task, /<summary>Hilfe: R meldet einen Fehler<\/summary>/, id);
    assert.doesNotMatch(task.replace(/<code>[^<]*<\/code>/g, ''), /`/, `${id}: backticks only inside code`);
    assert.equal([...task.matchAll(/class="(?:frage feld|frage)"/g)].length, QUESTIONS[id].length, `${id}: all questions`);
  });
});

test('required and extra tasks as in the plan', () => {
  const tag = (id: string) => textOf(elementById(html, id).match(/<span class="art [^"]+">[^<]*<\/span>/)?.[0] ?? '');
  assert.deepEqual(TASKS.map(tag), ['Pflicht', 'Pflicht', 'Pflicht', 'Zusatz']);
});

test('plenum boxes in tasks 2 and 4; the note on weighted N under task 2', () => {
  assert.match(elementById(html, 'a2'), /<h5>Fürs Plenum<\/h5>/);
  assert.match(elementById(html, 'a4'), /<h5>Fürs Plenum<\/h5>/);
  assert.match(textOf(elementById(html, 'a2')), /N = 3\.222 in der Ausgabe ist die Summe der Gewichte\. Gezählt sind es 3\.254 Befragte/);
});

/** Markup without the help levels: their „Lösung“ must not count as a route to the answer. */
const withoutHelp = (markup: string) => markup.replace(/<details class="hilfe"[^>]*>[\s\S]*?<\/details>/g, '');

test('solvable without the graphics: the line in every task, and every number comes from a template output', () => {
  for (const id of TASKS) {
    const visible = elementById(withoutHelp(html), id);
    assert.match(visible, /<p class="ohne-grafik"><b>Ohne Grafik lösbar:<\/b>/, `${id} has the line`);
    assert.doesNotMatch(visible, /Stufe 3: Lösung/, id);
    assert.match(textOf(visible.match(/<p class="ohne-grafik">[\s\S]*?<\/p>/)![0]), /summary\(\)|Ausgabe/, id);
  }
  // Every task template prints with summary(); every number question names where to read (label, help or hint), not a picture.
  for (const k of ['a1', 'a2', 'a3', 'a3_ost', 'a4']) assert.match(TEMPLATES[k].code, /summary\(\)$/, k);
  for (const k of TASKS) for (const q of QUESTIONS[k]) if (q.kind === 'number') {
    assert.match(`${q.label} ${q.help ?? ''} ${q.hint}`, /Coefficients|Model Summary|Spalte|Schritt|Konstante plus|B von|Zeile/, q.id);
    assert.doesNotMatch(`${q.label} ${q.help ?? ''}`, /Bild|Grafik|Raster/, q.id);
  }
});

test('every role="img" has a text version of at least 40 characters (all states rendered)', () => {
  let count = 0;
  for (const markup of [html, full]) {
    for (const tag of markup.match(/<[^>]*\brole="img"[^>]*>/g) ?? []) {
      count++;
      const label = tag.match(/\baria-label="([^"]*)"/)?.[1];
      if (label !== undefined) { assert.ok(unescape(label).length >= 40, tag.slice(0, 160)); continue; }
      const ids = tag.match(/\baria-labelledby="([^"]*)"/)?.[1] ?? '';
      const text = ids.split(/\s+/).map(id => textOf(elementById(markup, id))).join(' ');
      assert.ok(text.length >= 40, tag.slice(0, 160));
    }
  }
  assert.ok(count >= 20, `pictures: ${count}`);
});

test('pictures that change have a live text version with values; switches carry aria-pressed', () => {
  const live = [...full.matchAll(/<p class="rueck text s10-text"[^>]*aria-live="polite"[^>]*>([\s\S]*?)<\/p>/g)].map(m => textOf(m[1]));
  for (const start of ['Mittlere Lebenszufriedenheit nach Altersgruppe: 18 bis 29 Jahre 7,15', 'Referenz: ledig. Konstante 7,042', 'Pro Einheit:', 'Mit Gesundheit und keinem Würfel: R² 0,27, korrigiertes R² 0,25.', 'Alter und Gesundheit überlappen wenig', 'Elf Befragte, zum Beispiel']) {
    assert.ok(live.some(t => t.startsWith(start)), start);
  }
  const groups = [...full.matchAll(/<div class="s10-schalter" role="group" aria-label="([^"]+)">([\s\S]*?)<\/div>/g)];
  assert.equal(groups.length, 6, 'R2, B1, B6, B8, B12, B13');
  for (const [, , inner] of groups) {
    const buttons = [...inner.matchAll(/<button[^>]*>/g)].map(m => m[0]);
    assert.ok(buttons.every(b => /aria-pressed="(true|false)"/.test(b)));
  }
  // R2 starts without a selection
  assert.match(elementById(html, 'r2'), /Wähl einen Block\./);
  assert.equal((elementById(html, 'r2').match(/aria-pressed="true"/g) ?? []).length, 0);
});

test('foundation 1a reveals picture B1 only after the guess; B13 switches unlock after k4a', () => {
  assert.doesNotMatch(elementById(html, 'v1a'), /Liniendiagramm/);
  assert.match(textOf(elementById(html, 'v1a')), /Das Bild erscheint, sobald du dich festgelegt hast\./);
  assert.match(elementById(full, 'v1a'), /Liniendiagramm/);
  assert.match(textOf(elementById(full, 'v1a')), /Du hast „die Ältesten“ gewählt\. Die Daten: Die Ältesten sind im Schnitt etwas zufriedener, 7,65 gegen 7,15\./);
  const locked = elementById(html, 'v4a').match(/<div class="s10-schalter"[\s\S]*?<\/div>/)![0];
  assert.match(locked, /aria-disabled="true"/);
  const open = elementById(full, 'v4a').match(/<div class="s10-schalter"[\s\S]*?<\/div>/)![0];
  assert.doesNotMatch(open, /aria-disabled/);
});

test('foundations: no live workshop, and „Kurz überlegen“ as in the plan', () => {
  for (const g of ['g1', 'g2', 'g3', 'g4', 'g5']) assert.doesNotMatch(elementById(full, g), /class="workshop"|<textarea/, g);
  for (const id of ['k1a-b', 'k1c', 'k2c', 'k3a', 'k3b', 'k3c', 'k4a']) assert.match(full, new RegExp(`<form class="kurzueberlegen" id="${id}"`), id);
  for (const id of ['k1b', 'k2a', 'k2b', 'k4b']) assert.match(full, new RegExp(`id="${id}-q-${id}"`), id);
  assert.match(full, /id="u1-frage"/);
  for (const c of ['confounding', 'dummy', 'multicollinearity', 'outliers_influence', 'interaction']) assert.match(full, new RegExp(`data-concept="${c}"`), c);
});

test('workshops: start block copy-only, task and R templates live, four try-out workshops', () => {
  const textareas = [...html.matchAll(/<textarea[^>]*aria-label="R-Code: ([^"]*)"[^>]*>/g)].map(m => ({ title: unescape(m[1]), readOnly: /readOnly|readonly/.test(m[0]) }));
  const byTitle = (t: string) => textareas.filter(x => x.title === t);
  assert.equal(byTitle('Startblock')[0]?.readOnly, true);
  for (const [k, t] of Object.entries(TEMPLATES)) {
    if (t.tryOut || k === 'start') continue;
    assert.equal(byTitle(t.title).length, 1, t.title);
    assert.equal(byTitle(t.title)[0].readOnly, false, t.title);
  }
  assert.equal(byTitle('Deine Probier-Werkstatt').length, 4);
});

test('take-away: six self-test questions, the script download, R-Workshop chapter 9', () => {
  const t = textOf(html);
  assert.match(t, /6 Fragen/);
  assert.match(html, new RegExp(`download="${SCRIPT_FILE}"`));
  assert.match(t, /Nachlesen im R-Workshop, Kapitel 9/);
});

test('the saved prediction is quoted with the resolution once every question has an answer', () => {
  const answers = Object.fromEntries(QUESTIONS.a1.map(q => [q.id, q.kind === 'number' ? String(q.target) : q.target]));
  const done = elementById(render({ predictions: { a1: 'wird deutlich kleiner' }, answers }), 'a1');
  assert.match(done, /Deine Festlegung vorher war: wird deutlich kleiner\./);
  assert.match(textOf(done), /Auflösung: B der eigenen Lage fällt von 0,461 auf 0,198/);
  assert.match(done, /Alles richtig\./);
  const partial = elementById(render({ predictions: { a1: 'wird größer' }, answers: { a1a: '2.5' } }), 'a1');
  assert.doesNotMatch(partial, /Auflösung:/);
  assert.match(textOf(partial), /✗ B von lage allein: Das ist die Konstante \(Intercept\)\. Lies unter Coefficients/);
});

test('session10Status: open, running, done via the required questions of tasks 1 to 3', () => {
  assert.equal(session10Status(empty), 'open');
  assert.equal(session10Status({ predictions: {}, answers: { a4a: '0.06' } }), 'running');
  const right: Record<string, string> = {};
  for (const q of REQUIRED) right[q.id] = String(q.target);
  assert.equal(session10Status({ predictions: {}, answers: right }), 'done');
  assert.equal(session10Status({ predictions: {}, answers: { ...right, a3d: '0.259' } }), 'running');
  assert.equal(REQUIRED.some(q => q.id.startsWith('a4')), false);
});
