import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ChapterStateProvider } from '../ChapterContext';
import type { ChapterState } from '../state';
import { QUESTIONS, REQUIRED, RIDDLE, SCRIPT_FILE, TEMPLATES } from './content';
import { Session4, session4Status } from './Session4';

const empty: ChapterState = { predictions: {}, answers: {} };

/** Session 4 inside the session frame of LearningPath (h2 title) and a chapter state provider. */
function render(state: ChapterState = empty) {
  return renderToStaticMarkup(h('article', null,
    h('h2', { id: 'learning-heading' }, 'Daten sehen'),
    h(ChapterStateProvider, { sessionId: 4, initial: state }, h(Session4))));
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

test('headings in the order of spec §5 (Variante B)', () => {
  const texts = headings(html).map(x => x.text);
  const order = [
    'Vorweg: R lesen',
    'Thema 1: Balken und Häufigkeiten', 'Balken und Häufigkeiten', 'Aufgabe 1: Gesundheit zeigen',
    'Thema 2: Formen von Verteilungen', 'Formen von Verteilungen', 'Aufgabe 2: Der Rätselkasten',
    'Thema 3: Viele Werte: das Histogramm', 'Viele Werte: das Histogramm', 'Aufgabe 3: Wie lange dauert der Fragebogen?',
    'Thema 4: Mitte, Streuung und Boxplot', 'Mitte, Streuung und Boxplot', 'Aufgabe 4: Papier, online oder Interview?',
    'Überblick: Welches Bild für welche Frage?', 'Grafik wählen, Grenzen kennen',
    'Zum Schluss: Mitnehmen', 'Das Wichtigste aus dieser Sitzung', 'Prüf dich selbst', 'Dein Skript zum Mitnehmen',
  ];
  let at = -1;
  for (const t of order) {
    const i = texts.indexOf(t, at + 1);
    assert.ok(i > at, `„${t}“ after position ${at} (found ${texts.indexOf(t)})`);
    at = i;
  }
  assert.ok(texts.indexOf('R lesen: Startblock, Zeile, Pipe') > texts.indexOf('Vorweg: R lesen'));
  assert.ok(texts.indexOf('Eine Grafik entsteht in Schichten') < texts.indexOf('Thema 1: Balken und Häufigkeiten'));
});

test('headings without gaps below the h2 of the learning path', () => {
  let prev = 2;
  for (const x of headings(html)) {
    assert.ok(x.level <= prev + 1, `h${x.level} „${x.text}“ after h${prev}`);
    prev = x.level;
  }
});

test('ids are unique; every table of contents and jump link has a target', () => {
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
  const dup = ids.filter((x, i) => ids.indexOf(x) !== i);
  assert.deepEqual(dup, []);
  const hrefs = [...html.matchAll(/href="#([^"]+)"/g)].map(m => m[1]);
  for (const href of hrefs) assert.ok(ids.includes(href), `#${href} has a target`);
  const toc = html.slice(html.indexOf('class="chapter-toc"'), html.indexOf('class="chapter-body"'));
  for (const target of ['r1', 'r2', 'thema1', 'thema2', 'thema3', 'thema4', 'ueberblick', 'mitnehmen', 'selbsttest', 'skript']) {
    assert.match(toc, new RegExp(`href="#${target}"`));
  }
});

test('jump bar: four separate links to the tasks, no „·“ between them', () => {
  const bar = html.match(/<nav class="sprung"[\s\S]*?<\/nav>/)?.[0] ?? '';
  assert.deepEqual([...bar.matchAll(/<a href="#(a\d)">([^<]*)<\/a>/g)].map(m => `${m[1]} ${m[2]}`), ['a1 Aufgabe 1', 'a2 Aufgabe 2', 'a3 Aufgabe 3', 'a4 Aufgabe 4']);
  assert.doesNotMatch(textOf(bar), /·/);
});

test('every task: goal, link to its foundation, three help levels, closed try-out workshop, error help', () => {
  TASKS.forEach((id, i) => {
    const task = elementById(html, id);
    assert.ok(task, id);
    assert.match(task, /<b>Ziel:<\/b> Am Ende/, id);
    assert.match(task, new RegExp(`<a class="zur-grund" href="#g${i + 1}">`), id);
    for (const s of ['Stufe 1: Denkanstoß', 'Stufe 2: Wo schaue ich?', 'Stufe 3: Lösung']) assert.match(task, new RegExp(`<summary>Hilfe, ${s.replace('?', '\\?')}</summary>`), `${id} ${s}`);
    const tryOut = task.match(/<details class="probier"[^>]*>/)?.[0];
    assert.ok(tryOut, `${id} try-out`);
    assert.doesNotMatch(tryOut!, /\bopen\b/);
    assert.match(task, /für die Aufgabe nicht nötig/);
    assert.match(task, new RegExp(`aria-label="R-Code: Deine Probier-Werkstatt"`));
    assert.match(task, /<summary>Hilfe: R meldet einen Fehler<\/summary>/, id);
    assert.doesNotMatch(task.replace(/<code>[^<]*<\/code>/g, ''), /`/, `${id}: backticks only inside code (R's own messages)`);
  });
});

test('required and extra tasks as in the prototype', () => {
  const tag = (id: string) => textOf(elementById(html, id).match(/<span class="art [^"]+">[^<]*<\/span>/)?.[0] ?? '');
  assert.deepEqual(TASKS.map(tag), ['Pflicht', 'Zusatz', 'Zusatz', 'Pflicht']);
});

test('task 2: template a2 with two marks, the riddle, and no required question', () => {
  const a2 = elementById(html, 'a2');
  assert.match(a2, /aria-label="R-Code: Vorlage: eine Verteilung prüfen"/);
  const marks = elementById(a2, 'a2-st');
  assert.equal([...marks.matchAll(/<li>/g)].length, 2);
  assert.doesNotMatch(a2, /class="fragen"/);
  for (const q of REQUIRED) assert.doesNotMatch(a2, new RegExp(`name="[^"]*${q.id}"|id="[^"]*-${q.id}"`), q.id);
  for (const k of Object.keys(RIDDLE)) {
    const select = a2.match(new RegExp(`<select[^>]*id="a2-${k}"[^>]*>([\\s\\S]*?)</select>`));
    assert.ok(select, `select ${k}`);
    assert.equal([...select![1].matchAll(/<option/g)].length, 6, `five options plus „wählen“ for ${k}`);
    assert.match(a2, new RegExp(`<label for="a2-${k}"[^>]*>Frage zu ${k}</label>`));
  }
  const text = textOf(a2);
  assert.match(text, /Verteilung A: 7 Balken, relative Höhen von links nach rechts: 5, 3, 3, 8, 6, 7, 10\./);
  assert.match(text, /Verteilung B: viele schmale Balken von 0 bis 90/);
  assert.match(text, /Verteilung C: 5 Balken, relative Höhen von links nach rechts: 2, 7, 10, 3, 1\./);
  assert.match(text, /Verteilung D: 10 Balken/);
});

test('task 4: introduction with 71,5 % and 220 Papierbögen, plenum box', () => {
  const a4 = elementById(html, 'a4');
  const intro = textOf(a4.slice(0, a4.indexOf('class="festlegen"')));
  assert.match(intro, /71,5 %/);
  assert.match(intro, /220 Papierbögen/);
  assert.match(a4, /<h5>Fürs Plenum<\/h5>/);
});

/** Markup without the help levels: their „Lösung“ must not count as a route to the answer. */
const withoutHelp = (markup: string) => markup.replace(/<details class="hilfe"[^>]*>[\s\S]*?<\/details>/g, '');

test('solvable without the graphics: a text route for every task and every numeric target', () => {
  for (const id of TASKS) {
    const visible = elementById(withoutHelp(html), id);
    assert.match(visible, /<p class="ohne-grafik"><b>Ohne Grafik lösbar:<\/b>/, `${id} has the line`);
    assert.doesNotMatch(visible, /Stufe 3: Lösung/, id);
  }
  const noGraphic = (id: string) => textOf(elementById(withoutHelp(html), id).match(/<p class="ohne-grafik">[\s\S]*?<\/p>/)?.[0] ?? '');
  assert.match(noGraphic('a1'), /frequency\(hs01\)/);
  assert.match(noGraphic('a2'), /Unter jedem Bild steht eine Textfassung mit der Zahl der Balken und ihren Höhen\. Prüfen kannst du in R mit allbus %>% frequency\(pa01\) ?\./);
  assert.match(noGraphic('a3'), /describe\(xt10\)/);
  assert.match(noGraphic('a4'), /Median, Quartile, N und Missing/);
  // Each numeric target has a describe()/frequency() route: a line in the task or a template that prints it.
  const code = (k: string) => TEMPLATES[k].code;
  const routes: Record<string, boolean> = {
    '37': /frequency\(hs01\)/.test(noGraphic('a1')),
    '5209': /frequency\(hs01\)/.test(noGraphic('a1')),
    '65': /describe\(xt10\)/.test(code('a3d')),
    '4529': /filter\(xt10 <= 180\)/.test(code('a3n')) && /describe\(xt10\)/.test(code('a3n')),
    '306': /describe\(xt10/.test(code('a4z')) && /describe\(xt10/.test(code('a4zf')) && /filter\(mode == .*xt10 <= 180\)/.test(code('a4zf')),
  };
  const targets = (['a1', 'a3', 'a4'] as const).flatMap(k => QUESTIONS[k]).filter(q => q.kind === 'number').map(q => String(q.target));
  assert.deepEqual(targets.sort(), Object.keys(routes).sort());
  for (const [t, ok] of Object.entries(routes)) assert.ok(ok, `route for ${t}`);
});

test('text versions: figures and riddle pictures carry their description outside the help levels', () => {
  const visible = withoutHelp(html);
  for (const [id, n] of [['a1', 3], ['a3', 2], ['a4', 1]] as const) {
    const figures = [...elementById(visible, id).matchAll(/<figure class="ebild"[\s\S]*?<\/figure>/g)].map(m => m[0]);
    assert.equal(figures.length, n, id);
    for (const f of figures) {
      assert.match(f, /<figcaption/, `${id} caption`);
      assert.ok(unescape(f.match(/aria-label="([^"]*)"/)?.[1] ?? '').length >= 40 || /aria-labelledby/.test(f), `${id} aria-label`);
    }
  }
  const a2 = elementById(visible, 'a2');
  for (const k of Object.keys(RIDDLE)) assert.match(a2, new RegExp(`<p class="sr-only"[^>]*>Verteilung ${k}: `), k);
});

test('workshops add no region landmarks of their own for the file zone', () => {
  assert.match(html, /class="sandbox-drop-wrap"/);
  assert.doesNotMatch(html, /<section class="sandbox-drop-wrap"/);
});

test('riddle selects are described by their text version and, after a check only, by the feedback', () => {
  for (const k of Object.keys(RIDDLE)) {
    const select = html.match(new RegExp(`<select[^>]*id="a2-${k}"[^>]*>`))?.[0] ?? '';
    assert.match(select, new RegExp(`aria-describedby="a2-t${k}"`), k);
    assert.match(html, new RegExp(`<p class="sr-only" id="a2-t${k}">`), k);
  }
});

test('axis question: radiogroup labelled by its legend, not invalid before a check', () => {
  const axis = elementById(html, 'a1-achse');
  assert.match(axis, /<fieldset role="radiogroup" aria-labelledby="a1-achse-l"/);
  assert.match(axis, /<legend id="a1-achse-l">/);
  assert.doesNotMatch(axis, /aria-invalid/);
});

test('no heading is called „Ausgabe“', () => {
  assert.equal(headings(html).filter(x => /^Ausgabe\b/.test(x.text)).length, 0);
});

test('every role="img" has a text version, every figure picture inside a task has its alt', () => {
  for (const tag of html.match(/<[^>]*\brole="img"[^>]*>/g) ?? []) {
    const label = tag.match(/\baria-label="([^"]*)"/)?.[1] ?? '';
    assert.ok(unescape(label).length >= 40 || /aria-labelledby/.test(tag), tag.slice(0, 120));
  }
  assert.equal([...elementById(html, 'a1').matchAll(/class="ebild"/g)].length, 3);
  assert.equal([...elementById(html, 'a3').matchAll(/class="ebild"/g)].length, 2);
  assert.equal([...elementById(html, 'a4').matchAll(/class="ebild"/g)].length, 1);
});

test('workshops: start block and layers copy-only, task templates live, try-out workshops marked', () => {
  const textareas = [...html.matchAll(/<textarea[^>]*aria-label="R-Code: ([^"]*)"[^>]*>/g)].map(m => ({ title: unescape(m[1]), readOnly: /readOnly|readonly/.test(m[0]) }));
  const byTitle = (t: string) => textareas.filter(x => x.title === t);
  assert.equal(byTitle('Startblock')[0]?.readOnly, true);
  assert.equal(byTitle('Vorlage: Balkendiagramm')[0]?.readOnly, true);
  for (const t of ['Vorlage 1: Gesundheit, mit fehlenden Werten', 'Vorlage 2: ohne fehlende Werte, beschriftet', 'Vorlage: eine Verteilung prüfen', 'Kennzahlen der Bearbeitungsdauer', 'Histogramm ohne Angaben', 'Kennzahlen nach dem Ausschnitt', 'Histogramm mit Ausschnitt und Klassenbreite', 'Boxplots, hineingezoomt (alle Fälle zählen)', 'Boxplots, abgeschnitten (nur Fälle bis 180 Minuten)', 'Zahlen für einen Erhebungsweg, alle Fälle', 'Zahlen für einen Erhebungsweg, nur bis 180 Minuten']) {
    assert.equal(byTitle(t).length, 1, t);
    assert.equal(byTitle(t)[0].readOnly, false, t);
  }
  assert.equal(byTitle('Deine Probier-Werkstatt').length, 4);
  assert.equal([...html.matchAll(/Probier-Werkstatt: Ändere den Vorschlag/g)].length, 4);
});

test('read R: start block, reading a line, chain, objects, = and <-; layers stepper with five steps', () => {
  const r1 = textOf(elementById(html, 'r1'));
  assert.match(r1, /Startblock: kennst du aus Sitzung 1/);
  assert.match(r1, /Genauer erklärt: Objekt, Funktion, Argument/);
  assert.match(r1, /Häufige Verwechslung: = und <-/);
  assert.match(r1, /Neu heute: die Kette\./);
  const r2 = elementById(html, 'r2');
  assert.deepEqual([...r2.matchAll(/<button[^>]*>(Schritt \d: [^<]*)<\/button>/g)].map(m => m[1]),
    ['Schritt 1: Daten', 'Schritt 2: Achsen', 'Schritt 3: Form', 'Schritt 4: Fehlende weglassen', 'Schritt 5: Beschriftung']);
  assert.match(r2, /aria-current="step"[^>]*>Schritt 1: Daten/);
  assert.match(textOf(r2), /Bild: noch leer\./);
});

test('take-away: the self-test and the script download', () => {
  const t = textOf(html);
  assert.match(t, /5 Fragen/);
  assert.match(html, new RegExp(`download="${SCRIPT_FILE}"`));
  assert.match(t, /Nachlesen im R-Workshop, Kapitel 6/);
});

test('predictions before tasks 1, 3 and 4 and the saved prediction is quoted', () => {
  for (const id of ['a1', 'a3', 'a4']) assert.match(elementById(html, id), /<b>Erst festlegen:<\/b>/);
  assert.doesNotMatch(elementById(html, 'a2'), /Erst festlegen/);
  const withAnswers = render({ predictions: { a1: 'gut' }, answers: { a1a: 'na' } });
  assert.match(elementById(withAnswers, 'a1'), /Deine Festlegung vorher war: gut\./);
});

test('session4Status: open, running, done via the required questions of tasks 1 and 4', () => {
  assert.equal(session4Status(empty), 'open');
  assert.equal(session4Status({ predictions: {}, answers: { a3a: '65' } }), 'running');
  const right: Record<string, string> = {};
  for (const q of REQUIRED) right[q.id] = String(q.target);
  assert.equal(session4Status({ predictions: {}, answers: right }), 'done');
  assert.equal(session4Status({ predictions: {}, answers: { ...right, a4c: '305' } }), 'running');
});
