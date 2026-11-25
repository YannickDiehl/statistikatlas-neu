import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ChapterStateProvider } from '../ChapterContext';
import { chapterRegistry } from '../registry';
import type { ChapterState } from '../state';
import { judgeWithFeedback } from '../answers';
import { ALT, HINTS, QUESTIONS, REQUIRED, SCRIPT_FILE } from './content';
import { Session2, session2Status } from './Session2';

const empty: ChapterState = { predictions: {}, answers: {} };

/** Session 2 inside the session frame of LearningPath (h2 title) and a chapter state provider. */
function render(state: ChapterState = empty) {
  return renderToStaticMarkup(h('article', null,
    h('h2', { id: 'learning-heading' }, 'Vom Fragebogen zum Datensatz'),
    h(ChapterStateProvider, { sessionId: 2, initial: state }, h(Session2))));
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

/** The markup without the third help level („Lösung“). */
const withoutSolution = (html: string) => html.replace(/<details class="hilfe"><summary>Hilfe, Stufe 3: Lösung<\/summary>[\s\S]*?<\/details>/g, '');

const headings = (html: string) => [...html.matchAll(/<h([2-6])\b[^>]*>([\s\S]*?)<\/h\1>/g)].map(m => ({ level: Number(m[1]), text: textOf(m[2]) }));
const html = render();
const TASKS = ['a1', 'a2', 'a3', 'a4'] as const;

test('registered as a preview-only chapter', () => {
  assert.equal(chapterRegistry[2]?.live, false);
  assert.equal(chapterRegistry[2]?.status, session2Status);
  assert.equal(chapterRegistry[2]?.Component, Session2);
});

test('headings in the order of spec §5 (Variante B)', () => {
  const texts = headings(html).map(x => x.text);
  const order = [
    'Vorweg: R lesen', 'R Startblock und Objekt', 'R Neu heute: die Pipe mit einem Schritt', 'R Nachschlagen mit codebook()',
    'Thema 1: Die Datenmatrix', 'Die Datenmatrix: Fall, Variable, Wert', 'Schritt 1a Vom Fragebogen zur Zeile', 'Schritt 1b Der ALLBUS als Datenmatrix', 'Aufgabe 1: Wer hat auf Papier geantwortet?',
    'Thema 2: Codes und Labels', 'Codes und Labels', 'Schritt 2a 1 oder 5?', 'Schritt 2b Drei Beschriftungen', 'Schritt 2c Codes sind Namen', 'Aufgabe 2: Ein Fragebogen wird zur Zeile',
    'Thema 3: Fehlende Werte haben Gründe', 'Fehlt ist nicht gleich fehlt', 'Schritt 3a Was trägst du ein?', 'Schritt 3b Die Gründe im Codebuch', 'Schritt 3c Fehler oder Konvention?', 'Aufgabe 3: Was nur auf Papier passiert',
    'Thema 4: Datentypen', 'Datentypen', 'Schritt 4a Datentypen, im Bild als Farben', 'Schritt 4b Umwandeln: Wertelabel zum Wert machen oder entfernen', 'Aufgabe 4: Drei Datentypen in einem Datensatz',
    'Überblick: Was steht in einer Zeile?', 'Vom Kreuz zur Zelle', 'Schritt Ü1 Vom Kreuz zur Zelle', 'Schritt Ü2 Was steht in dieser Zelle?', 'Schritt Ü3 Bevor du rechnest',
    'Zum Schluss: Mitnehmen', 'Das Wichtigste aus dieser Sitzung', 'Prüf dich selbst', 'Dein Skript zum Mitnehmen',
  ].map(t => t.replace(/^R /, ''));
  let at = -1;
  for (const t of order) {
    const i = texts.indexOf(t, at + 1);
    assert.ok(i > at, `„${t}“ after position ${at} (found ${texts.indexOf(t)}); headings: ${texts.join(' | ')}`);
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
  for (const state of [empty, { predictions: { a1: 'etwa ein Drittel' }, answers: { g3_a: '0', g3_b: '-9', g3_c: '-42', g3_d: '-11', g2_eins: '5', a1_reihen: '5246' } }]) {
    const page = render(state);
    const ids = [...page.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
    assert.deepEqual(ids.filter((x, i) => ids.indexOf(x) !== i), []);
    for (const href of [...page.matchAll(/href="#([^"]+)"/g)].map(m => m[1])) assert.ok(ids.includes(href), `#${href} has a target`);
  }
  const toc = html.slice(html.indexOf('class="chapter-toc"'), html.indexOf('class="chapter-body"'));
  for (const target of ['r1', 'r2', 'r3', 'thema1', 'thema2', 'thema3', 'thema4', 'ueberblick', 'mitnehmen', 'selbsttest', 'skript']) {
    assert.match(toc, new RegExp(`href="#${target}"`));
  }
});

test('jump bar: four separate links to the tasks, no „·“ anywhere in the text', () => {
  const bar = html.match(/<nav class="sprung"[\s\S]*?<\/nav>/)?.[0] ?? '';
  assert.deepEqual([...bar.matchAll(/<a href="#(a\d)">([^<]*)<\/a>/g)].map(m => `${m[1]} ${m[2]}`), ['a1 Aufgabe 1', 'a2 Aufgabe 2', 'a3 Aufgabe 3', 'a4 Aufgabe 4 (Zusatz)']);
  assert.doesNotMatch(textOf(html), /·/);
  assert.doesNotMatch(textOf(html), /fiktiv/i);
});

test('head: guiding question, three signposts, goals, „kennst du aus“', () => {
  const t = textOf(html);
  assert.match(t, /Was steht eigentlich in einer Zeile des ALLBUS\?/);
  assert.equal([...html.matchAll(/<ul class="weg">[\s\S]*?<\/ul>/g)][0]?.[0].match(/<li>/g)?.length, 3);
  assert.match(t, /Objekt, Pipe mit einem Schritt, Nachschlagen/);
  assert.match(t, /Datenmatrix: kennst du aus Methoden Ia/);
  assert.match(t, /Startblock, Objekt und <-: kennst du aus Sitzung 1/);
  assert.match(t, /Alle Zahlen auf dieser Seite stammen aus dem ALLBUS 2023 und sind ungewichtet/);
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
    assert.match(task, /<b>Ohne Grafik lösbar:<\/b>/, id);
    assert.doesNotMatch(task.replace(/<code>[^<]*<\/code>/g, ''), /`/, `${id}: backticks only inside code`);
  });
});

test('required and extra tasks as in the plan', () => {
  const tag = (id: string) => textOf(elementById(html, id).match(/<span class="art [^"]+">[^<]*<\/span>/)?.[0] ?? '');
  assert.deepEqual(TASKS.map(tag), ['Pflicht', 'Pflicht', 'Pflicht', 'Zusatz']);
});

test('workshops: start block copy-only, every template live, marks as in the plan', () => {
  const textareas = [...html.matchAll(/<textarea[^>]*aria-label="R-Code: ([^"]*)"[^>]*>/g)].map(m => ({ title: unescape(m[1]), readOnly: /readOnly|readonly/.test(m[0]) }));
  const byTitle = (t: string) => textareas.filter(x => x.title === t);
  assert.equal(byTitle('Startblock')[0]?.readOnly, true);
  for (const t of ['Vorlage: nachschlagen und auswählen', 'Vorlage 1: den Datensatz anzeigen', 'Vorlage 2: nachschlagen', 'Vorlage 3: nur einen Erhebungsweg behalten', 'Vorlage: vier Variablen nachschlagen', 'Vorlage: Codebuch der Papierbögen', 'Vorlage: Papierbögen anzeigen']) {
    assert.equal(byTitle(t).length, 1, t);
    assert.equal(byTitle(t)[0].readOnly, false, t);
  }
  assert.equal(byTitle('Deine Probier-Werkstatt').length, 4);
  assert.equal([...elementById(html, 'a1c-st').matchAll(/<li>/g)].length, 1);
  assert.equal([...elementById(html, 'a3-st').matchAll(/<li>/g)].length, 1);
});

test('solvable without the graphics: the way to every answer is in the text, without help level 3', () => {
  for (const key of TASKS) {
    const task = withoutSolution(elementById(html, key));
    const text = textOf(task);
    assert.doesNotMatch(task, /Hilfe, Stufe 3/, key);
    // every question names where to read its answer (help line), and that place is a live template of the task
    for (const q of QUESTIONS[key]) assert.ok(q.help && text.includes(q.help.replace(/`/g, '')), `${key} ${q.id}: help line`);
    assert.match(task, /<textarea(?![^>]*readOnly)[^>]*aria-label="R-Code: Vorlage/, `${key}: a live template`);
    for (const tag of task.match(/<[^>]*\brole="img"[^>]*>/g) ?? []) assert.ok(unescape(tag.match(/aria-label="([^"]*)"/)?.[1] ?? '').length >= 40, `${key}: ${tag.slice(0, 80)}`);
  }
  // A2: the sheet itself is graphic; its text version holds every answer that comes from the sheet
  const a2 = withoutSolution(elementById(html, 'a2'));
  for (const s of ['19 Jahre', 'Ich gehe noch zur Schule', '‚schlecht‘', '‚Arbeiterschicht‘']) assert.ok(unescape(a2).includes(s), s);
  assert.ok(unescape(a2).includes(ALT.bogenA2));
  // A3: the version picture is not needed; the answer to a3_split is in the question itself
  assert.match(textOf(withoutSolution(elementById(html, 'a3'))), /858 \+ 798 = 1\.656/);
  // the solution of help level 3 is not the only place with the paper count of task 1
  assert.match(textOf(withoutSolution(elementById(html, 'a1'))), /1\.656/);
  assert.ok(HINTS.a1[2].includes('1.656'));
});

test('every role="img" has a text version of at least 40 characters', () => {
  const pages = [html, render({ predictions: {}, answers: { g2_eins: '1', g3_a: '0', g3_b: '-9', g3_c: '-42', g3_d: '-11' } })];
  let n = 0;
  for (const page of pages) for (const tag of page.match(/<[^>]*\brole="img"[^>]*>/g) ?? []) {
    n++;
    assert.ok(unescape(tag.match(/\baria-label="([^"]*)"/)?.[1] ?? '').length >= 40, tag.slice(0, 120));
  }
  assert.ok(n >= 12, `${n} pictures`);
});

test('pictures: filter in R lesen, output in task 1, sheet in task 2, versions in task 3', () => {
  assert.ok(unescape(elementById(html, 'r2')).includes(ALT.filterSex));
  assert.ok(unescape(elementById(html, 'a1')).includes(ALT.ausgabe));
  assert.ok(unescape(elementById(html, 'a3')).includes(ALT.split));
  assert.equal([...elementById(html, 'a4').matchAll(/class="ebild"/g)].length, 0);
});

test('plenum boxes in tasks 2 and 3; prediction quoted after checking', () => {
  for (const id of ['a2', 'a3']) assert.match(elementById(html, id), /<h5>Fürs Plenum<\/h5>/);
  const checked = render({ predictions: { a1: 'etwa ein Drittel' }, answers: { a1_reihen: '5246' } });
  assert.match(elementById(checked, 'a1'), /Deine Festlegung vorher war: etwa ein Drittel\./);
  assert.match(elementById(checked, 'a1'), /✓ Fälle von allbus: Stimmt: 5\.246 Fälle/);
});

test('take-away: seven points, five self-test questions, script download and the R workshop', () => {
  const t = textOf(html);
  assert.equal(elementById(html, 'wichtig').match(/<li>/g)?.length, 7);
  assert.match(t, /5 Fragen/);
  assert.match(html, new RegExp(`download="${SCRIPT_FILE}"`));
  assert.match(t, /Nachlesen im R-Workshop, Kapitel 4/);
});

test('session2Status: open, running, done via the required questions of tasks 1, 2 and 3', () => {
  assert.equal(session2Status(empty), 'open');
  assert.equal(session2Status({ predictions: {}, answers: { a4_doi: 'chr' } }), 'running');
  const right: Record<string, string> = {};
  for (const q of REQUIRED) right[q.id] = String(q.target);
  assert.equal(session2Status({ predictions: {}, answers: right }), 'done');
  assert.equal(session2Status({ predictions: {}, answers: { ...right, a3_st01: '1647' } }), 'running');
  assert.ok(QUESTIONS.a4.every(q => !REQUIRED.includes(q)), 'task 4 is extra');
});

test('review: A2 plenum is marked optional; own feedback for typical wrong numbers sits in specialInput', () => {
  assert.match(textOf(elementById(html, 'a2').match(/<div class="box-gruen plenum">[\s\S]*?<\/div>/)?.[0] ?? ''), /^Fürs Plenum Optional:/);
  const q = (list: typeof QUESTIONS.a1, id: string) => list.find(x => x.id === id)!;
  const feedback = (list: typeof QUESTIONS.a1, id: string, input: string) => judgeWithFeedback(q(list, id), input).text;
  assert.match(feedback(QUESTIONS.a1, 'a1_reihen', '579'), /^Noch nicht\. 579 sind die Variablen \(Spalten\)\. Gefragt sind die Fälle/);
  for (const x of ['2003', '2.003', '2,003']) assert.match(feedback(QUESTIONS.a1, 'a1_papier', x), /2\.003 sind die Interviews/, x);
  for (const x of ['5246', '5.246', '5,246']) assert.match(feedback(QUESTIONS.a1, 'a1_papier', x), /noch der ganze ALLBUS\. Hast du Vorlage 3 ausgeführt\?/, x);
  assert.match(feedback(QUESTIONS.a2, 'a2_ep03', '2'), /2 wäre GUT/);
  assert.match(feedback(QUESTIONS.a2, 'a2_educ', '5'), /5 ist HOCHSCHULREIFE\. Die Person geht aber noch zur Schule/);
  // the general hints no longer carry these per-value remarks
  assert.doesNotMatch(q(QUESTIONS.a1, 'a1_reihen').hint, /579/);
  assert.doesNotMatch(q(QUESTIONS.a1, 'a1_papier').hint, /2\.003|5\.246/);
  assert.doesNotMatch(q(QUESTIONS.a2, 'a2_ep03').hint, /2 wäre GUT/);
  assert.doesNotMatch(q(QUESTIONS.a2, 'a2_educ').hint, /HOCHSCHULREIFE/);
  const shown = textOf(render({ predictions: {}, answers: { a1_reihen: '579' } }));
  assert.match(shown, /✗ Fälle von allbus: Noch nicht\. 579 sind die Variablen/);
});

test('review: Code-Werkstatt „kennst du aus Sitzung 1“ and the note after „Schon bekannt“ come from the shared slots', () => {
  const t = textOf(html);
  assert.match(t, /Die Code-Werkstatt kennst du aus Sitzung 1\./);
  assert.match(t, /Solche Stellen tragen ein graues Schild „kennst du aus Sitzung 1“ bzw\. „kennst du aus Methoden Ia“\./);
});
