import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ChapterStateProvider } from '../ChapterContext';
import type { ChapterState } from '../state';
import { activeChapter, chapterRegistry } from '../registry';
import { HINTS, PREDICTIONS, QUESTIONS, REQUIRED, SCRIPT_FILE, TEMPLATES } from './content';
import { Session9, session9Status } from './Session9';

const empty: ChapterState = { predictions: {}, answers: {} };

/** Session 9 inside the session frame of LearningPath (h2 title) and a chapter state provider. */
function render(state: ChapterState = empty) {
  return renderToStaticMarkup(h('article', null,
    h('h2', { id: 'learning-heading' }, 'Lineare Regression'),
    h(ChapterStateProvider, { sessionId: 9, initial: state }, h(Session9))));
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

test('registered as preview-only chapter 9', () => {
  const entry = chapterRegistry[9];
  assert.ok(entry);
  assert.equal(entry.live, false);
  assert.equal(entry.Component, Session9);
  assert.equal(entry.status, session9Status);
  assert.equal(activeChapter(chapterRegistry, 9, false), undefined);
  assert.equal(activeChapter(chapterRegistry, 9, true), entry);
});

test('headings in the order of spec §5 (Variante B)', () => {
  const texts = headings(html).map(x => x.text);
  const order = [
    'Vorweg: R lesen', 'Startblock und was du schon kennst', 'Eine Formel mit Tilde: y ~ x', 'Die Ausgabe von summary() lesen',
    'Thema 1: Die Gerade: Konstante und Steigung', 'Die Gerade: Konstante und Steigung',
    'Schritt 1a Erst schätzen: Wo verläuft die Gerade?', 'Schritt 1b Konstante und Steigung: die Formel als Bausteine', 'Schritt 1c Die Vorhersage ist ein Durchschnitt',
    'Aufgabe 1: Vertrauen in den Bundestag und Zufriedenheit mit der Demokratie',
    'Thema 2: Wie gut passt die Gerade? Residuen und R²', 'Wie gut passt die Gerade? Residuen und R²',
    'Schritt 2a Residuen: wie weit daneben?', 'Schritt 2b Kleinste Quadrate: Dreh die Gerade selbst', 'Schritt 2c R²: um wie viel besser als der Mittelwert?',
    'Aufgabe 2: Vertrauen oder Schicht: Was sagt mehr?',
    'Thema 3: Gleich gut für alle? Fehlervarianz und Ausreißer', 'Gleich gut für alle?',
    'Schritt 3a Gleiche Fehlervarianz: Streuen die Residuen überall gleich?', 'Schritt 3b Ausreißer: Ein Punkt zieht die Gerade',
    'Aufgabe 3: Für wen liegt die Gerade daneben?',
    'Thema 4: Gerade oder Kurve? Linearität', 'Gerade oder Kurve?', 'Schritt 4 Eine flache Gerade heißt nicht „kein Zusammenhang“',
    'Aufgabe 4: Links, Mitte, rechts',
    'Überblick: Eine Regression lesen, prüfen, berichten', 'Eine Regression lesen, prüfen, berichten',
    'Schritt Ü1 Fünf Zahlen für einen Bericht', 'Schritt Ü2 Voraussetzungen: Was du prüfst, bevor du der Geraden glaubst', 'Schritt Ü3 Zusammenhang, nicht Ursache',
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
  for (const markup of [html, render({ predictions: { a1: 'etwa 3 Punkte' }, answers: { a4a: '-0.14' } })]) {
    const ids = [...markup.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
    const dup = ids.filter((x, i) => ids.indexOf(x) !== i);
    assert.deepEqual(dup, []);
    const hrefs = [...markup.matchAll(/href="#([^"]+)"/g)].map(m => m[1]);
    for (const href of hrefs) assert.ok(ids.includes(href), `#${href} has a target`);
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
  assert.doesNotMatch(textOf(html), /fiktiv/i);
  assert.match(textOf(html.slice(html.indexOf('class="sprung"'))), /^.*?Aufgabe 4 Alle Zahlen aus dem ALLBUS sind in diesem Kapitel gewichtet/);
});

test('every task: goal, link to its foundation, three help levels, closed try-out workshop, error help', () => {
  TASKS.forEach((id, i) => {
    const task = elementById(html, id);
    assert.ok(task, id);
    assert.match(task, /<b>Ziel:<\/b> Am Ende/, id);
    assert.match(task, new RegExp(`<a class="zur-grund" href="#g${i + 1}">`), id);
    assert.match(task, /<p class="grundlage">Grundlage: <a href="#(g|k)\d/, id);
    for (const s of ['Stufe 1: Denkanstoß', 'Stufe 2: Wo schaue ich?', 'Stufe 3: Lösung']) assert.match(task, new RegExp(`<summary>Hilfe, ${s.replace('?', '\\?')}</summary>`), `${id} ${s}`);
    const tryOut = task.match(/<details class="probier"[^>]*>/)?.[0];
    assert.ok(tryOut, `${id} try-out`);
    assert.doesNotMatch(tryOut!, /\bopen\b/);
    assert.match(task, /für die Aufgabe nicht nötig/);
    assert.match(task, /aria-label="R-Code: Deine Probier-Werkstatt"/);
    assert.match(task, /<summary>Hilfe: R meldet einen Fehler<\/summary>/, id);
    assert.match(task, /<b>Erst festlegen:<\/b>/, id);
    assert.doesNotMatch(task.replace(/<code>[^<]*<\/code>/g, ''), /`/, `${id}: backticks only inside code`);
  });
});

test('required and extra tasks as in the plan: tasks 1 to 3 Pflicht, task 4 Zusatz', () => {
  const tag = (id: string) => textOf(elementById(html, id).match(/<span class="art [^"]+">[^<]*<\/span>/)?.[0] ?? '');
  assert.deepEqual(TASKS.map(tag), ['Pflicht', 'Pflicht', 'Pflicht', 'Zusatz']);
  assert.deepEqual(REQUIRED.map(q => q.id), [...QUESTIONS.a1, ...QUESTIONS.a2, ...QUESTIONS.a3].map(q => q.id));
});

test('questions of every task are rendered with their ids; plenum boxes in tasks 2 and 3', () => {
  for (const id of TASKS) {
    const form = elementById(html, `${id}-fragen`);
    for (const q of QUESTIONS[id]) assert.match(form, new RegExp(`id="${id}-fragen-${q.id}(-l)?"`), q.id);
  }
  assert.match(elementById(html, 'a2'), /<h5>Fürs Plenum<\/h5>/);
  assert.match(elementById(html, 'a3'), /<h5>Fürs Plenum<\/h5>/);
  assert.doesNotMatch(elementById(html, 'a1'), /Fürs Plenum/);
});

/** Markup without the help levels: their „Lösung“ must not count as a route to the answer. */
const withoutHelp = (markup: string) => markup.replace(/<details class="hilfe"[^>]*>[\s\S]*?<\/details>/g, '');

test('solvable without the graphics: the line in every task, and a text route for every numeric target', () => {
  for (const id of TASKS) {
    const visible = elementById(withoutHelp(html), id);
    assert.match(visible, /<p class="ohne-grafik"><b>Ohne Grafik lösbar:<\/b>/, `${id} has the line`);
    assert.doesNotMatch(visible, /Stufe 3: Lösung/, id);
  }
  // Every number target comes from a template that prints it (summary(), describe() or the calculator line), not from a picture.
  const code = (k: string) => TEMPLATES[k].code;
  const routes: Record<string, boolean> = {
    a1a: /linear_regression\(demo ~ pt03, weights = wghtpew\) %>%\n  summary\(\)/.test(code('a1')),
    a1b: /summary\(\)/.test(code('a1')),
    a1c: /⟦3\.570⟧ \+ ⟦1\.073⟧ \* ⟦4⟧/.test(code('a1r')),
    a1f: /summary\(\)/.test(code('a1')),
    a2a: /summary\(\)/.test(code('a2')),
    a2c: /summary\(\)/.test(code('a2')),
    a2d: /⟦pt03⟧/.test(code('a2')),
    a2e: /⟦pt03⟧/.test(code('a2')),
    a3b: /describe\(residuum, weights = wghtpew, show = c\("mean", "sd"\)\)/.test(code('a3')),
    a3c: /group_by\(pt03\)/.test(code('a3')),
    a4a: /linear_regression\(demo ~ pa01, weights = wghtpew\) %>%\n  summary\(\)/.test(code('a4')),
    a4b: /⟦3\.570⟧ \+ ⟦1\.073⟧ \* ⟦4⟧/.test(code('a4r')),
    a4c: /describe\(demo, weights = wghtpew/.test(code('a4')),
  };
  const numeric = TASKS.flatMap(k => QUESTIONS[k]).filter(q => q.kind === 'number').map(q => q.id);
  assert.deepEqual(numeric.sort(), Object.keys(routes).sort());
  for (const [id, ok] of Object.entries(routes)) assert.ok(ok, `route for ${id}`);
  // The visible text (without help level 3) never needs a picture: no question refers to „im Bild“.
  for (const q of TASKS.flatMap(k => QUESTIONS[k])) assert.doesNotMatch(q.label, /Bild/, q.id);
});

test('every role="img" has a text version of at least 40 characters (also after checking task 4)', () => {
  const checked = render({ predictions: {}, answers: { a4a: '-0.14' } });
  let count = 0;
  for (const markup of [html, checked]) {
    for (const tag of markup.match(/<[^>]*\brole="img"[^>]*>/g) ?? []) {
      count++;
      const label = tag.match(/\baria-label="([^"]*)"/)?.[1] ?? '';
      assert.ok(unescape(label).length >= 40, tag.slice(0, 160));
    }
  }
  // five static pictures (tilde line, R², spread, group_by, assumptions); after the check also the left-right picture
  assert.equal(count, 5 + 6);
});

test('task 3 has the group_by picture with its text version; task 4 shows its picture only after a check or on request', () => {
  const a3 = elementById(html, 'a3');
  assert.match(a3, /role="img" aria-label="group_by\(pt03\) legt alle Reihen mit demselben Wert/);
  assert.match(textOf(a3), /Neu heute: group_by\(pt03\) teilt die Befragten/);
  assert.match(textOf(a3), /Genauer erklärt: Warum ändern Konstante und Steigung die SD nicht\?/);
  const a4 = elementById(html, 'a4');
  assert.doesNotMatch(a4, /role="img"/);
  assert.match(a4, />Bild zeigen<\/button>/);
  const checked = elementById(render({ predictions: {}, answers: { a4c: '3.864' } }), 'a4');
  assert.match(checked, /role="img" aria-label="Mittelwerte der Zufriedenheit je Stufe von 1 links bis 10 rechts/);
});

test('workshops: start block copy-only, every other template live, four try-out workshops', () => {
  const textareas = [...html.matchAll(/<textarea[^>]*aria-label="R-Code: ([^"]*)"[^>]*>/g)].map(m => ({ title: unescape(m[1]), readOnly: /readOnly|readonly/.test(m[0]) }));
  const byTitle = (t: string) => textareas.filter(x => x.title === t);
  assert.equal(byTitle('Startblock')[0]?.readOnly, true);
  for (const [k, t] of Object.entries(TEMPLATES)) {
    if (k === 'start' || t.tryOut) continue;
    assert.equal(byTitle(t.title).length, 1, t.title);
    assert.equal(byTitle(t.title)[0].readOnly, false, t.title);
  }
  assert.equal(byTitle('Deine Probier-Werkstatt').length, 4);
  assert.equal(byTitle('Deine Probier-Werkstatt').filter(x => !x.readOnly).length, 4);
});

test('read R: the line picture with the tilde, the control output and the output picker with six toggles', () => {
  const r2 = elementById(html, 'r2');
  assert.match(r2, /role="img" aria-label="Nimm allbus, und dann sag die Lebenszufriedenheit aus der wirtschaftlichen Lage vorher, gewichtet\./);
  assert.match(textOf(r2), /R2 = 0\.203, adj\.R2 = 0\.203, F\(1, 5131\) = 1304\.29, p < 0\.001 \*\*\*, N = 5133/);
  const r3 = elementById(html, 'r3');
  assert.deepEqual([...r3.matchAll(/<button[^>]*aria-pressed="false"[^>]*>([^<]*)<\/button>/g)].map(m => m[1]), ['Konstante', 'Steigung', 'Beta', 'R²', 'Typischer Fehler', 'N']);
  assert.match(r3, /<p class="erkl" aria-live="polite">Wähl eine Zahl\.<\/p>/);
  assert.match(textOf(r3), /Ausgabe von summary\(\) für ls01 ~ lage/);
  assert.match(textOf(r3), /… weitere Abschnitte/);
  assert.match(textOf(r3), /Alle Zahlen erklärt/);
  assert.match(textOf(elementById(html, 'r1')), /Startblock: kennst du aus Sitzung 1 mutate\(\) und rec\(\): kennst du aus Sitzung 5 weights: kennst du aus Sitzung 6/);
});

test('predictions are quoted with their resolution after a check', () => {
  const open = textOf(elementById(render({ predictions: { a1: 'etwa 3 Punkte' }, answers: { a1a: '2.288' } }), 'a1-fragen'));
  assert.match(open, /✓ Konstante: Konstante 2,288/);
  assert.match(open, /• Steigung: noch offen\./);
  assert.doesNotMatch(open, /Auflösung:/, 'no resolution while a question of the task is open');
  assert.doesNotMatch(open, /Deine Festlegung vorher/);
  const all: Record<string, string> = {};
  for (const q of QUESTIONS.a1) all[q.id] = String(q.target);
  const a1 = textOf(elementById(render({ predictions: { a1: 'etwa 3 Punkte' }, answers: all }), 'a1-fragen'));
  assert.match(a1, /Deine Festlegung vorher war: etwa 3 Punkte\./);
  assert.match(a1, new RegExp(`Auflösung: ${PREDICTIONS.a1.resolution.replace(/[.*+?()]/g, '\\$&')}`));
  const special = textOf(elementById(render({ predictions: {}, answers: { a1b: '0.588' } }), 'a1-fragen'));
  assert.match(special, /✗ Steigung: Das ist Beta, der standardisierte Koeffizient\./);
});

test('take-away: the self-test, the script download and the workshop chapter', () => {
  const t = textOf(html);
  assert.match(t, /5 Fragen/);
  assert.match(html, new RegExp(`download="${SCRIPT_FILE}"`));
  assert.match(t, /Nachlesen im R-Workshop, Kapitel 9 \(9\.2 Einfache lineare Regression, 9\.6 Residuen-Diagnostik\)/);
  for (const k of Object.keys(HINTS)) assert.equal(HINTS[k as keyof typeof HINTS].length, 3);
});

test('session9Status: open, running, done via the required questions of tasks 1 to 3', () => {
  assert.equal(session9Status(empty), 'open');
  assert.equal(session9Status({ predictions: {}, answers: { a4a: '-0.14' } }), 'running');
  const right: Record<string, string> = {};
  for (const q of REQUIRED) right[q.id] = String(q.target);
  assert.equal(session9Status({ predictions: {}, answers: right }), 'done');
  assert.equal(session9Status({ predictions: {}, answers: { ...right, a3b: '0.713' } }), 'running');
});
