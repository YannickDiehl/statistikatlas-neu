import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ChapterStateProvider } from '../ChapterContext';
import type { ChapterState } from '../state';
import { QUESTIONS, REQUIRED, SCRIPT_FILE, TEMPLATES } from './content';
import { Session5, session5Status } from './Session5';

const empty: ChapterState = { predictions: {}, answers: {} };

/** Session 5 inside the session frame of LearningPath (h2 title) and a chapter state provider. */
function render(state: ChapterState = empty) {
  return renderToStaticMarkup(h('article', null,
    h('h2', { id: 'learning-heading' }, 'Kreuztabellen'),
    h(ChapterStateProvider, { sessionId: 5, initial: state }, h(Session5))));
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
const html = render();
const TASKS = ['a1', 'a2', 'a3', 'a4'] as const;
/** Markup without the help levels: their „Lösung“ must not count as a route to the answer. */
const withoutHelp = (markup: string) => markup.replace(/<details class="hilfe"[^>]*>[\s\S]*?<\/details>/g, '');

test('headings in the order of spec §5 (Variante B)', () => {
  const texts = headings(html).map(x => x.text);
  const order = [
    'Vorweg: R lesen', 'Erinnerung: Startblock und <-', 'Neu heute: eine neue Variable mit mutate() und rec()', 'Neu heute: eine Kreuztabelle mit crosstab() lesen',
    'Thema 1: Kategorien bilden: Umkodieren', 'Kategorien bilden: Umkodieren', 'Schritt 1a Kategorien zusammenfassen', 'Aufgabe 1: Zwei neue Variablen für die Wahlfrage',
    'Thema 2: Eine Zelle, drei Prozentbasen', 'Eine Zelle, drei Prozentbasen', 'Schritt 2a Drei Fragen an eine Zelle', 'Aufgabe 2: Stimmt die 87 %?',
    'Thema 3: Leserichtung: prozentuieren und vergleichen', 'Leserichtung: prozentuieren und vergleichen', 'Aufgabe 3: Gehen Misstrauende nicht mehr wählen?',
    'Thema 4: Umpolen', 'Umpolen: eine Skala umdrehen', 'Schritt 4a Wenn 1 sehr gut heißt', 'Schritt 4b Zwei Aussagen, zwei Richtungen', 'Aufgabe 4: Gegenprobe mit einer umgedrehten Aussage',
    'Überblick: Welche Prozentbasis für welche Frage?', 'Basis wählen, Grenzen kennen', 'Schritt Ü1 Wer ist 100 %?', 'Schritt Ü3 Zufall oder Zusammenhang?',
    'Zum Schluss: Mitnehmen', 'Das Wichtigste aus dieser Sitzung', 'Prüf dich selbst', 'Dein Skript zum Mitnehmen',
  ];
  let at = -1;
  for (const t of order) {
    const i = texts.indexOf(t, at + 1);
    assert.ok(i > at, `„${t}“ after position ${at} (found ${texts.indexOf(t)})`);
    at = i;
  }
});

test('headings without gaps below the h2 of the learning path', () => {
  let prev = 2;
  for (const x of headings(html)) {
    assert.ok(x.level <= prev + 1, `h${x.level} „${x.text}“ after h${prev}`);
    prev = x.level;
  }
});

test('ids are unique; every table of contents and jump link has a target', () => {
  for (const markup of [html, render({ predictions: {}, answers: { a2a: 'col', a2b: '127', a2c: '146', a2d1: '6.5', a2d2: '87.0', a2d3: '4.6' } })]) {
    const ids = [...markup.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
    assert.deepEqual(ids.filter((x, i) => ids.indexOf(x) !== i), []);
    for (const href of [...markup.matchAll(/href="#([^"]+)"/g)].map(m => m[1])) assert.ok(ids.includes(href), `#${href} has a target`);
  }
  const toc = html.slice(html.indexOf('class="chapter-toc"'), html.indexOf('class="chapter-body"'));
  for (const target of ['r1', 'r2', 'r3', 'thema1', 'thema2', 'thema3', 'thema4', 'ueberblick', 'mitnehmen', 'selbsttest', 'skript']) {
    assert.match(toc, new RegExp(`href="#${target}"`));
  }
});

test('jump bar: four separate links to the tasks, no „·“ anywhere in the chapter text', () => {
  const bar = html.match(/<nav class="sprung"[\s\S]*?<\/nav>/)?.[0] ?? '';
  assert.deepEqual([...bar.matchAll(/<a href="#(a\d)">([^<]*)<\/a>/g)].map(m => `${m[1]} ${m[2]}`), ['a1 Aufgabe 1', 'a2 Aufgabe 2', 'a3 Aufgabe 3', 'a4 Aufgabe 4']);
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
  });
});

test('required and extra tasks as in the plan: A1 to A3 Pflicht, A4 Zusatz', () => {
  const tag = (id: string) => textOf(elementById(html, id).match(/<span class="art [^"]+">[^<]*<\/span>/)?.[0] ?? '');
  assert.deepEqual(TASKS.map(tag), ['Pflicht', 'Pflicht', 'Pflicht', 'Zusatz']);
  assert.deepEqual(REQUIRED.map(q => q.id), [...QUESTIONS.a1, ...QUESTIONS.a2, ...QUESTIONS.a3].map(q => q.id));
});

test('solvable without the graphics: a text route for every task and every numeric target', () => {
  for (const id of TASKS) {
    const visible = elementById(withoutHelp(html), id);
    assert.match(visible, /<p class="ohne-grafik"><b>Ohne Grafik lösbar:<\/b>/, `${id} has the line`);
    assert.doesNotMatch(visible, /Stufe 3: Lösung/, id);
  }
  // Each numeric target is printed as text by a live template of its task (frequency() or crosstab(), no graphic).
  const routes: Record<string, string> = { a1a: 'a1_misstrauen', a1b: 'a1_nichtwahl', a2b: 'a2_ct', a2c: 'a2_ct', a3b: 'a3_ct', a3c: 'a3_ct', a3d: 'a3_ct', a4b: 'a4_mutate', a4c: 'a4_mutate' };
  const numeric = TASKS.flatMap(k => QUESTIONS[k]).filter(q => q.kind === 'number').map(q => q.id);
  assert.deepEqual(numeric.sort(), Object.keys(routes).sort());
  for (const [qid, k] of Object.entries(routes)) {
    const task = qid.slice(0, 2);
    assert.match(TEMPLATES[k].code, /(frequency|crosstab)\([^)]*\)$/, `${qid}: ${k} prints a table`);
    assert.doesNotMatch(TEMPLATES[k].code, /ggplot/, k);
    assert.match(elementById(withoutHelp(html), task), new RegExp(`aria-label="R-Code: ${TEMPLATES[k].title.replace(/[()?%]/g, '\\$&')}"`), `${qid}: ${k} is in ${task}`);
  }
  // Choice targets that need an output are in a live template too; the figures only repeat what the tables say.
  for (const id of TASKS) {
    for (const f of [...elementById(withoutHelp(html), id).matchAll(/<figure class="ebild[^"]*"[\s\S]*?<\/figure>/g)].map(m => m[0])) {
      assert.match(f, /<figcaption/, `${id} caption`);
      assert.ok(unescape(f.match(/aria-label="([^"]*)"/)?.[1] ?? '').length >= 40, `${id} aria-label`);
    }
  }
});

test('every role="img" has a text version of at least 40 characters', () => {
  let n = 0;
  for (const tag of html.match(/<[^>]*\brole="img"[^>]*>/g) ?? []) {
    n++;
    const label = tag.match(/\baria-label="([^"]*)"/)?.[1] ?? '';
    assert.ok(unescape(label).length >= 40, tag.slice(0, 120));
  }
  assert.ok(n >= 8, `${n} pictures`);
  assert.equal([...elementById(html, 'a1').matchAll(/class="ebild[" ]/g)].length, 1);
  assert.equal([...elementById(html, 'a2').matchAll(/class="ebild[" ]/g)].length, 0, 'the denominator picture only after a right check');
  assert.equal([...elementById(html, 'a4').matchAll(/class="ebild[" ]/g)].length, 1);
});

test('task 2: the denominator picture appears once a2a to a2d are right', () => {
  const solved = render({ predictions: {}, answers: { a2a: 'col', a2b: '127', a2c: '146', a2d1: '6.5', a2d2: '87.0', a2d3: '4.6' } });
  const a2 = elementById(solved, 'a2');
  assert.match(a2, /127 von 146 = 87,0 % \(col %\)/);
  assert.match(a2, /Das orange Stück ist immer gleich/);
  const half = render({ predictions: {}, answers: { a2a: 'row', a2b: '127' } });
  assert.doesNotMatch(elementById(half, 'a2'), /Das orange Stück/);
});

test('workshops: start block and chi-square copy-only, task templates live, try-out workshops marked', () => {
  const textareas = [...html.matchAll(/<textarea[^>]*aria-label="R-Code: ([^"]*)"[^>]*>/g)].map(m => ({ title: unescape(m[1]), readOnly: /readOnly|readonly/.test(m[0]) }));
  const byTitle = (t: string) => textareas.filter(x => x.title === t);
  assert.equal(byTitle('Startblock')[0]?.readOnly, true);
  assert.equal(byTitle(TEMPLATES.ueb_chi.title)[0]?.readOnly, true);
  for (const k of ['r2_rec', 'r3_ct', 'a1_freq', 'a1_misstrauen', 'a1_nichtwahl', 'a2_ct', 'a2_all', 'a3_ct', 'a4_um', 'a4_mutate', 'a4_ohne']) {
    assert.equal(byTitle(TEMPLATES[k].title).length, 1, k);
    assert.equal(byTitle(TEMPLATES[k].title)[0].readOnly, false, k);
  }
  assert.equal(byTitle('Deine Probier-Werkstatt').length, 4);
});

test('marked places are listed in the workshops', () => {
  const marks = (k: string) => [...elementById(html, `${k}-st`).matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => textOf(m[1]));
  assert.deepEqual(marks('a1_misstrauen'), ['Zeile 4: 1', 'Zeile 4: 2:4']);
  assert.deepEqual(marks('a2_ct'), ['Zeile 8: row']);
  assert.deepEqual(marks('a3_ct'), ['Zeile 8: col']);
  assert.deepEqual(marks('a4_mutate'), ['Zeile 6: 1', 'Zeile 6: 2:4']);
});

test('read R: badges, reading bricks, rule and crosstab output pictures', () => {
  const r1 = textOf(elementById(html, 'r1'));
  assert.match(r1, /Startblock und <- ?: kennst du aus Sitzung 1, Kette: kennst du aus Sitzung 4/);
  const r2 = elementById(html, 'r2');
  assert.match(textOf(r2), /Genauer erklärt: Regeln schreiben und prüfen/);
  assert.match(textOf(r2), /Häufige Verwechslung: = in einer Regel und == in filter\(\)/);
  assert.match(r2, /aria-label="allbus %&gt;%: nimm allbus, und dann\. mutate\(: füge eine Variable hinzu/);
  const r3 = textOf(elementById(html, 'r3'));
  assert.match(r3, /① Zeilen: Geschlecht\. Spalten: Teilzeit\./);
  assert.match(r3, /Genauer erklärt: Wer steht in der Tabelle\?/);
});

test('task 3: plenum box; task 1: graue Schilder', () => {
  assert.match(elementById(html, 'a3'), /<h5>Fürs Plenum<\/h5>/);
  assert.match(textOf(elementById(html, 'a1')), /pv01 und seine fehlenden Werte: kennst du aus Sitzung 2 und 3/);
});

test('take-away: eight points, six self-test questions, the script download', () => {
  const t = textOf(html);
  assert.equal([...elementById(html, 'wichtig').matchAll(/<li>/g)].length, 8);
  assert.match(t, /6 Fragen/);
  assert.match(html, new RegExp(`download="${SCRIPT_FILE}"`));
  assert.match(t, /Nachlesen im R-Workshop, Kapitel 5 und 7/);
});

test('the saved prediction is quoted with its resolution, per-value feedback is shown', () => {
  const a1 = elementById(render({ predictions: { a1: 'etwa die Hälfte' }, answers: { a1a: '1144', a1b: '236', a1c: 'na', a1d: 'anteil' } }), 'a1');
  assert.match(a1, /Deine Festlegung vorher war: etwa die Hälfte\. Tatsächlich sind es 73,1 %, also mehr als zwei Drittel\./);
  assert.match(a1, /✗ misstraut: 1\.144 sind nur die mit ‚stimme voll zu‘/);
  assert.match(a1, /✓ würde nicht wählen: 236 Befragte/);
});

test('the resolution of a prediction appears only when no question of the task is open', () => {
  const open = elementById(render({ predictions: { a1: 'etwa die Hälfte' }, answers: { a1a: '1144', a1b: '236' } }), 'a1');
  assert.doesNotMatch(open, /Deine Festlegung vorher war/);
  assert.match(open, /✗ misstraut: 1\.144 sind nur/);
  const done = elementById(render({ predictions: { a1: 'etwa die Hälfte' }, answers: { a1a: '1144', a1b: '236', a1c: 'nicht', a1d: 'anteil' } }), 'a1');
  assert.match(done, /Deine Festlegung vorher war: etwa die Hälfte\. Tatsächlich sind es 73,1 %/);
});

test('the intro names the weighting before the badge sentence of the layout', () => {
  const known = textOf(html.match(/<p class="grundlage">[\s\S]*?<\/p>/)?.[0] ?? '');
  assert.ok(known.indexOf('lernst du in Sitzung 6') > -1);
  assert.ok(known.indexOf('lernst du in Sitzung 6') < known.indexOf('graues Schild'), known);
  assert.match(known, /Schild „Wiederholung aus der Vorlesung“/);
});

test('the free map is linked from the crosstab foundation', () => {
  assert.match(elementById(html, 'v2'), /data-concept="crosstab"[^>]*>→ In der freien Karte: Kreuztabelle mit Zeilen-, Spalten- und Zellenprozenten/);
});

test('table rows of the cutting table keep their table semantics on narrow screens', () => {
  const table = elementById(html, 'v1').match(/<table[^>]*s5-zuschnitt-tabelle[^>]*>[\s\S]*?<\/table>/)?.[0] ?? '';
  assert.match(table, /<table[^>]*role="table"/);
  assert.match(table, /<tr[^>]*role="row"/);
  assert.match(table, /<t[dh][^>]*role="(cell|rowheader|columnheader)"/);
});

test('session5Status: open, running, done via the required questions of tasks 1 to 3', () => {
  assert.equal(session5Status(empty), 'open');
  assert.equal(session5Status({ predictions: {}, answers: { a4b: '6,9' } }), 'running');
  const right: Record<string, string> = {};
  for (const q of REQUIRED) right[q.id] = String(q.target);
  assert.equal(session5Status({ predictions: {}, answers: right }), 'done');
  assert.equal(session5Status({ predictions: {}, answers: { ...right, a3b: '7' } }), 'done', 'whole number ±0,55');
  assert.equal(session5Status({ predictions: {}, answers: { ...right, a3b: '87' } }), 'running');
  assert.equal(session5Status({ predictions: {}, answers: { ...right, a1a: '2631' } }), 'running');
});
