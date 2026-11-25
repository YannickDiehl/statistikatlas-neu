import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ChapterStateProvider } from '../ChapterContext';
import { chapterRegistry } from '../registry';
import type { ChapterState } from '../state';
import { HINTS, QUESTIONS, REQUIRED, SCRIPT_FILE, TEMPLATES } from './content';
import { Session3, session3Status } from './Session3';

const empty: ChapterState = { predictions: {}, answers: {} };

/** Session 3 inside the session frame of LearningPath (h2 title) and a chapter state provider. */
function render(state: ChapterState = empty) {
  return renderToStaticMarkup(h('article', null,
    h('h2', { id: 'learning-heading' }, 'Erste Auszählung'),
    h(ChapterStateProvider, { sessionId: 3, initial: state }, h(Session3))));
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
/** Markup without the help levels: their „Lösung“ must not count as a route to the answer. */
const withoutHelp = (markup: string) => markup.replace(/<details class="hilfe"[^>]*>[\s\S]*?<\/details>/g, '');
const html = render();
const TASKS = ['a1', 'a2', 'a3', 'a4'] as const;

test('registered as a preview-only chapter for session 3', () => {
  assert.equal(chapterRegistry[3]?.live, false);
  assert.equal(chapterRegistry[3]?.status, session3Status);
});

test('headings in the order of spec §5 (Variante B)', () => {
  const texts = headings(html).map(x => x.text);
  const order = [
    'Vorweg: R lesen', 'R lesen: Startblock und eine Zeile', 'Drei Werkzeuge für heute',
    'Thema 1: Die Häufigkeitstabelle', 'Die Häufigkeitstabelle', 'Aufgabe 1: Wie geht es der Wirtschaft in einem Jahr?',
    'Thema 2: Fehlende Werte: Wer zählt mit?', 'Fehlende Werte: Wer zählt mit?', 'Aufgabe 2: Wahlabsicht: drei Prozentzahlen für dieselbe Partei',
    'Thema 3: Die Mitte: Modus, Median, Mittelwert', 'Die Mitte: Modus, Median, Mittelwert', 'Aufgabe 3: Wie lange dauert Arbeitslosigkeit?',
    'Thema 4: Liegt der Mittelwert in der Mitte?', 'Liegt der Mittelwert in der Mitte?', 'Aufgabe 4: Wie viele liegen über dem Mittelwert?',
    'Überblick: Eine Tabelle lesen, eine Mitte wählen', 'Eine Tabelle lesen, eine Mitte wählen',
    'Zum Schluss: Mitnehmen', 'Das Wichtigste aus dieser Sitzung', 'Prüf dich selbst', 'Dein Skript zum Mitnehmen',
  ];
  let at = -1;
  for (const t of order) {
    const i = texts.indexOf(t, at + 1);
    assert.ok(i > at, `„${t}“ after position ${at} (found ${texts.indexOf(t)})`);
    at = i;
  }
});

test('headings without gaps below the h2 of the learning path; no heading called „Ausgabe“', () => {
  let prev = 2;
  for (const x of headings(html)) {
    assert.ok(x.level <= prev + 1, `h${x.level} „${x.text}“ after h${prev}`);
    prev = x.level;
  }
  assert.equal(headings(html).filter(x => /^Ausgabe\b/.test(x.text)).length, 0);
});

test('ids are unique; every table of contents and jump link has a target', () => {
  for (const state of [empty, { predictions: { a1: 'etwa gleich viele' }, answers: { 'k1c-frage': 'm', 'k3a-frage': 'mittel', 'k4-frage': '32,58', 'k2a-11': '1', 'k3b-wahl': 'modus' } }]) {
    const page = render(state);
    const ids = [...page.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
    assert.deepEqual(ids.filter((x, i) => ids.indexOf(x) !== i), []);
    for (const href of [...page.matchAll(/href="#([^"]+)"/g)].map(m => m[1])) assert.ok(ids.includes(href), `#${href} has a target`);
  }
  const toc = html.slice(html.indexOf('class="chapter-toc"'), html.indexOf('class="chapter-body"'));
  for (const target of ['r1', 'r2', 'thema1', 'thema2', 'thema3', 'thema4', 'ueberblick', 'mitnehmen', 'selbsttest', 'skript']) {
    assert.match(toc, new RegExp(`href="#${target}"`));
  }
});

test('head: guiding question, three signposts, six goals, known note with Methoden Ia, weighting note', () => {
  assert.match(html, /<p class="bubble">Wie viele sagen was – und wen zählst du mit, wenn du Prozent sagst\?<\/p>/);
  assert.equal((elementById(html, 'ziele-h') ? html.match(/<section class="box-gruen" aria-labelledby="ziele-h">[\s\S]*?<\/ul>/)![0].match(/<li>/g) ?? [] : []).length, 6);
  assert.deepEqual([...html.matchAll(/<ul class="weg">[\s\S]*?<\/ul>/g)][0][0].match(/<b>[^<]*<\/b>/g), ['<b>Vorweg: R lesen</b>', '<b>Vier Themen</b>', '<b>Zum Schluss</b>']);
  const t = textOf(html);
  assert.match(t, /Schon bekannt und hier nur kurz erinnert: der Startblock, R als Taschenrechner/);
  assert.match(t, /Mittelwert und Median kennst du aus Methoden Ia\./);
  assert.equal(t.split('Solche Stellen').length - 1, 1);
  assert.match(t, /Solche Stellen tragen ein graues Schild „kennst du aus Sitzung …“ oder „kennst du aus Methoden Ia“/);
  assert.match(t, /Alle Zahlen in diesem Kapitel sind ungewichtet, genau wie die Ausgabe deiner Vorlagen\./);
});

test('jump bar: four separate links to the tasks, no „·“ between them', () => {
  const bar = html.match(/<nav class="sprung"[\s\S]*?<\/nav>/)?.[0] ?? '';
  assert.deepEqual([...bar.matchAll(/<a href="#(a\d)">([^<]*)<\/a>/g)].map(m => `${m[1]} ${m[2]}`), ['a1 Aufgabe 1', 'a2 Aufgabe 2', 'a3 Aufgabe 3', 'a4 Aufgabe 4']);
  assert.doesNotMatch(textOf(bar), /·/);
  assert.doesNotMatch(textOf(html), /·/);
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
    assert.match(textOf(task), /Vor dem Schrägstrich steht die Meldung, wie RStudio sie auf Deutsch zeigt/);
    assert.doesNotMatch(task.replace(/<code[^>]*>[^<]*<\/code>/g, ''), /`/, `${id}: backticks only inside code`);
  });
});

test('required and extra tasks as in the plan: tasks 1 to 3 required, task 4 extra', () => {
  const tag = (id: string) => textOf(elementById(html, id).match(/<span class="art [^"]+">[^<]*<\/span>/)?.[0] ?? '');
  assert.deepEqual(TASKS.map(tag), ['Pflicht', 'Pflicht', 'Pflicht', 'Zusatz']);
});

test('solvable without the graphics, without the help levels: a text route for every task and every target', () => {
  const visible = withoutHelp(html);
  for (const id of TASKS) {
    const task = elementById(visible, id);
    assert.match(task, /<p class="ohne-grafik"><b>Ohne Grafik lösbar:<\/b>/, `${id} has the line`);
    assert.doesNotMatch(task, /Stufe 3: Lösung/, id);
  }
  for (const [k, steps] of Object.entries(HINTS)) assert.doesNotMatch(textOf(visible), new RegExp(steps[2].slice(0, 40).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), k);
  const noGraphic = (id: string) => textOf(elementById(visible, id).match(/<p class="ohne-grafik">[\s\S]*?<\/p>/)?.[0] ?? '');
  assert.match(noGraphic('a1'), /allbus %>% frequency\(ep04\)/);
  assert.match(noGraphic('a2'), /allbus %>% frequency\(pv01\) und in der Ausgabe der Vorlage/);
  assert.match(noGraphic('a3'), /Ausgabe der beiden Vorlagen/);
  assert.match(noGraphic('a4'), /allbus %>% frequency\(dw19\)/);
  // Every question has a route: a template inside its task (live, outside the help) that prints the number or computes it.
  const route: Record<string, string> = {
    a1a: 'a1', a1b: 'a1', a1c: 'a1', a1d: 'a1', a1e: 'a1r', a1f: 'a1',
    a2a: 'a2', a2b: 'a2', a2c: 'a2', a2d: 'a2', a2e: 'a2r', a2f: 'a2',
    a3a: 'a3', a3b: 'a3', a3c: 'a3', a3d: 'a3f', a3e: 'a3', a3f: 'a1',
    a4a: 'a4', a4b: 'a4r', a4c: 'a4',
  };
  for (const key of TASKS) for (const q of QUESTIONS[key]) {
    const k = route[q.id];
    assert.ok(k, `${q.id} has a route`);
    const task = elementById(visible, k === 'a1' && q.id === 'a3f' ? 'a1' : key);
    assert.match(task, new RegExp(`<textarea[^>]*aria-label="R-Code: ${TEMPLATES[k].title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`), `${q.id} via ${k}`);
  }
  // The B7 picture in task 2 carries no results.
  const b7 = elementById(visible, 'a2').match(/<figure class="ebild"[\s\S]*?<\/figure>/)?.[0] ?? '';
  assert.match(b7, /<figcaption/);
  for (const n of ['18,83', '24,8', '21,5', '13,15']) assert.ok(!textOf(b7).includes(n), n);
});

test('every role="img" has a text version of at least 40 characters, in every answered state', () => {
  const answered = render({ predictions: {}, answers: { 'k1c-frage': 'm', 'k3a-frage': 'mittel', 'k4-frage': '1', 'k2b-frage': 'v41' } });
  let n = 0;
  for (const page of [html, answered]) {
    for (const tag of page.match(/<[^>]*\brole="img"[^>]*>/g) ?? []) {
      n++;
      const label = tag.match(/\baria-label="([^"]*)"/)?.[1];
      if (label !== undefined) assert.ok(unescape(label).length >= 40, tag.slice(0, 120));
      else {
        const id = tag.match(/aria-labelledby="([^"]+)"/)?.[1] ?? '';
        assert.ok(textOf(elementById(page, id)).length >= 40, tag.slice(0, 120));
      }
    }
  }
  assert.ok(n >= 16, `${n} pictures`);
});

test('workshops: start block copy-only, every other template live, four try-outs', () => {
  const textareas = [...html.matchAll(/<textarea[^>]*aria-label="R-Code: ([^"]*)"[^>]*>/g)].map(m => ({ title: unescape(m[1]), readOnly: /readOnly|readonly/.test(m[0]) }));
  const byTitle = (t: string) => textareas.filter(x => x.title === t);
  assert.equal(byTitle('Startblock')[0]?.readOnly, true);
  for (const [k, t] of Object.entries(TEMPLATES)) {
    if (k === 'start' || t.tryOut) continue;
    assert.equal(byTitle(t.title).length, 1, t.title);
    assert.equal(byTitle(t.title)[0].readOnly, false, t.title);
  }
  assert.equal(byTitle('Deine Probier-Werkstatt').length, 4);
});

test('badges: known from session 1 and 2, „kennst du aus Methoden Ia“, „neu heute“', () => {
  const badges = [...html.matchAll(/<span class="wdh">([^<]*)<\/span>/g)].map(m => unescape(m[1]));
  for (const b of ['Startblock und frequency(): kennst du aus Sitzung 1', 'Pipe: kennst du aus Sitzung 2', 'describe(): neu heute',
    'Modus und Median: kennst du aus Methoden Ia', 'Mittelwert und Median: kennst du aus Methoden Ia', 'Skalenniveau: neu heute',
    'Gründe für fehlende Werte: kennst du aus Sitzung 2', 'R als Taschenrechner: kennst du aus Sitzung 1', 'filter(): kennst du aus Sitzung 2']) {
    assert.ok(badges.includes(b), b);
  }
});

test('plenum boxes in tasks 1 to 3, the weighted note under task 2', () => {
  for (const id of ['a1', 'a2', 'a3']) assert.match(elementById(html, id), /<h5>Fürs Plenum<\/h5>/, id);
  assert.doesNotMatch(elementById(html, 'a4'), /Fürs Plenum/);
  assert.match(textOf(elementById(html, 'a2')), /Mit Gewichtung kommt die CDU\/CSU auf 25,81 % der gültigen Antworten statt 24,80 %/);
});

test('saved prediction is quoted, a special case shows its own hint', () => {
  const page = render({ predictions: { a2: '5 bis 15 %' }, answers: { a2e: '15,14', a2a: 'm8' } });
  const a2 = textOf(elementById(page, 'a2'));
  assert.match(a2, /Deine Festlegung vorher war: 5 bis 15 %\./);
  assert.match(a2, /✗ Unentschlossene, eigene Basis: Die 603 gehören selbst zur Basis/);
  assert.match(a2, /✓ häufigster Grund: „weiß nicht“ mit 603 Befragten/);
});

test('take-away: seven points, five self-test questions and the script download', () => {
  const t = textOf(html);
  assert.equal((elementById(html, 'wichtig').match(/<li>/g) ?? []).length, 7);
  assert.match(t, /5 Fragen/);
  assert.match(html, new RegExp(`download="${SCRIPT_FILE}"`));
  assert.match(t, /Nachlesen im R-Workshop, Kapitel 7\.4/);
});

test('session3Status: open, running, done via the required questions of tasks 1 to 3', () => {
  assert.equal(session3Status(empty), 'open');
  assert.equal(session3Status({ predictions: {}, answers: { a4a: '75,29' } }), 'running');
  const right: Record<string, string> = {};
  for (const q of REQUIRED) right[q.id] = String(q.target);
  assert.equal(session3Status({ predictions: {}, answers: right }), 'done');
  assert.equal(session3Status({ predictions: {}, answers: { ...right, a2e: '15,14' } }), 'running');
});
