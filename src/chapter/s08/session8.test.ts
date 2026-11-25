import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ChapterStateProvider } from '../ChapterContext';
import { chapterRegistry } from '../registry';
import type { ChapterState } from '../state';
import { HINTS, QUESTIONS, REQUIRED, SCRIPT_FILE, TEMPLATES } from './content';
import { Session8, session8Status } from './Session8';

const empty: ChapterState = { predictions: {}, answers: {} };

/** Session 8 inside the session frame of LearningPath (h2 title) and a chapter state provider. */
function render(state: ChapterState = empty) {
  return renderToStaticMarkup(h('article', null,
    h('h2', { id: 'learning-heading' }, 'Index und Skala'),
    h(ChapterStateProvider, { sessionId: 8, initial: state }, h(Session8))));
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

test('session 8 is registered as a preview-only chapter', () => {
  const entry = chapterRegistry[8];
  assert.ok(entry);
  assert.equal(entry.live, false);
  assert.equal(entry.status, session8Status);
});

test('headings in the order of spec §5 (Variante B)', () => {
  const texts = headings(html).map(x => x.text);
  const order = [
    'Vorweg: R lesen', 'R Startblock und Umpolen: kennst du schon', 'R Neu heute: ein Wert je Person und die Reliabilität',
    'Thema 1: Mehrere Fragen, ein Wert: der Mittelwertindex', 'Mehrere Fragen, ein Wert', 'Aufgabe 1: Wie populistisch denken die Befragten?',
    'Thema 2: Passen die Fragen zusammen? Cronbachs α', 'Passen die Fragen zusammen?', 'Aufgabe 2: Messen die sieben Aussagen dasselbe?',
    'Thema 3: Alle in eine Richtung: Umpolen', 'Alle in eine Richtung', 'Aufgabe 3: Andersherum gefragt: Einstellungen zu Islam und Muslimen',
    'Thema 4: Ausgleichen oder alle? Mittelwert- und Kombinationsindex', 'Ausgleichen oder alle?', 'Aufgabe 4: Im Schnitt oder durchgehend?',
    'Überblick: Vom Item zum Index', 'Vom Item zum Index',
    'Zum Schluss: Mitnehmen', 'Das Wichtigste aus dieser Sitzung', 'Prüf dich selbst', 'Dein Skript zum Mitnehmen',
  ];
  let at = -1;
  for (const t of order) {
    const i = texts.findIndex((x, k) => k > at && (x === t || x === t.replace(/^R /, '')));
    assert.ok(i > at, `„${t}“ after position ${at}`);
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
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
  assert.deepEqual(ids.filter((x, i) => ids.indexOf(x) !== i), []);
  const hrefs = [...html.matchAll(/href="#([^"]+)"/g)].map(m => m[1]);
  for (const href of hrefs) assert.ok(ids.includes(href), `#${href} has a target`);
  const toc = html.slice(html.indexOf('class="chapter-toc"'), html.indexOf('class="chapter-body"'));
  for (const target of ['r1', 'r2', 'thema1', 'thema2', 'thema3', 'thema4', 'ueberblick', 'mitnehmen', 'selbsttest', 'skript']) assert.match(toc, new RegExp(`href="#${target}"`));
});

test('jump bar: four separate links to the tasks, no „·“ in the chapter text, weighting note below', () => {
  const bar = html.match(/<nav class="sprung"[\s\S]*?<\/nav>/)?.[0] ?? '';
  assert.deepEqual([...bar.matchAll(/<a href="#(a\d)">([^<]*)<\/a>/g)].map(m => `${m[1]} ${m[2]}`), ['a1 Aufgabe 1', 'a2 Aufgabe 2', 'a3 Aufgabe 3', 'a4 Aufgabe 4']);
  assert.doesNotMatch(textOf(html), /·/);
  assert.doesNotMatch(textOf(html), /fiktiv/);
  const after = html.slice(html.indexOf('</nav>', html.indexOf('class="sprung"')));
  assert.match(after, /^<\/nav><p class="hilfe-zeile s8-gewicht">Wie seit Sitzung 6 rechnest du/);
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
    assert.match(task, /class="fragen"/, id);
    assert.doesNotMatch(task.replace(/<code[^>]*>[^<]*<\/code>/g, ''), /`/, `${id}: backticks only inside code`);
  });
});

test('required and extra tasks as in the plan; plenum in tasks 2 and 4', () => {
  const tag = (id: string) => textOf(elementById(html, id).match(/<span class="art [^"]+">[^<]*<\/span>/)?.[0] ?? '');
  assert.deepEqual(TASKS.map(tag), ['Pflicht', 'Pflicht', 'Pflicht', 'Zusatz']);
  assert.match(elementById(html, 'a2'), /<h5>Fürs Plenum<\/h5>/);
  assert.match(elementById(html, 'a4'), /<h5>Fürs Plenum<\/h5>/);
  assert.doesNotMatch(elementById(html, 'a1'), /Fürs Plenum/);
});

/** Markup without the help levels: their „Lösung“ must not count as a route to the answer. */
const withoutHelp = (markup: string) => markup.replace(/<details class="hilfe"[^>]*>[\s\S]*?<\/details>/g, '');

test('solvable without the graphics: a text line in every task and a template that prints every target', () => {
  for (const id of TASKS) {
    const visible = elementById(withoutHelp(html), id);
    assert.match(visible, /<p class="ohne-grafik"><b>Ohne Grafik lösbar:<\/b>/, `${id} has the line`);
    assert.doesNotMatch(visible, /Stufe 3: Lösung/, id);
  }
  assert.match(textOf(elementById(html, 'a4').match(/<p class="ohne-grafik">[\s\S]*?<\/p>/)?.[0] ?? ''), /Diese Aufgabe hat keine Grafik/);
  // Each numeric target is printed by a template of its task: describe() for N and Mean, reliability() for α, frequency() for %.
  const code = (k: string) => TEMPLATES[k].code;
  const routes: Record<string, boolean> = {
    a1a: /describe\(populismus\)/.test(code('a1')),
    a1b: /min_valid = ⟦7⟧/.test(code('a1')),
    a1d: /describe\(populismus, weights = wghtpew\)/.test(code('a1w')),
    a2a: /reliability\(pa29, .*\) %>%\n  summary\(\)/.test(code('a2')),
    a2d: /reliability\(⟦pa29, ⟧pa30/.test(code('a2ohne')),
    a3b: /reliability\(mm01, mm02, mm03, mm04, mm05, mm06\) %>%\n  summary\(\)/.test(code('a3')),
    a3c: /mm02_um = rec\(mm02, rules = "rev"\)/.test(code('a3um')) && /summary\(\)/.test(code('a3um')),
    a4a: /frequency\(⟦zustimmungen⟧, weights = wghtpew\)/.test(code('a4')),
    a4b: /kurz += row_means\(pick\(pa31, pa32, pa33\), min_valid = 3\)/.test(code('a4')),
  };
  const numeric = TASKS.flatMap(k => QUESTIONS[k]).filter(q => q.kind === 'number').map(q => q.id);
  assert.deepEqual(numeric.sort(), Object.keys(routes).sort());
  for (const [id, ok] of Object.entries(routes)) assert.ok(ok, `route for ${id}`);
});

test('text versions: figures inside tasks carry their description outside the help levels', () => {
  const visible = withoutHelp(html);
  for (const [id, n] of [['a1', 1], ['a2', 1], ['a3', 1], ['a4', 0]] as const) {
    const figures = [...elementById(visible, id).matchAll(/<figure class="ebild[^"]*"[\s\S]*?<\/figure>/g)].map(m => m[0]);
    assert.equal(figures.length, n, id);
    for (const f of figures) {
      assert.match(f, /<figcaption/, `${id} caption`);
      assert.ok(unescape(f.match(/aria-label="([^"]*)"/)?.[1] ?? '').length >= 40, `${id} aria-label`);
    }
  }
});

test('every role="img" has a text version of at least 40 characters', () => {
  for (const tag of html.match(/<[^>]*\brole="img"[^>]*>/g) ?? []) {
    const label = tag.match(/\baria-label="([^"]*)"/)?.[1] ?? '';
    assert.ok(unescape(label).length >= 40 || /aria-labelledby/.test(tag), tag.slice(0, 120));
  }
});

test('workshops: start block copy-only, every other template live, try-out workshops marked', () => {
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

test('read R: badges and texts of R1 and R2, the line picture of row_means', () => {
  const r1 = textOf(elementById(html, 'r1'));
  assert.match(r1, /Startblock: kennst du aus Sitzung 1/);
  assert.match(r1, /mutate\(\) und rec\(\): kennst du aus Sitzung 5/);
  assert.match(r1, /Häufige Verwechslung: Umpolen ändert nicht die Meinung/);
  const r2 = elementById(html, 'r2');
  assert.match(textOf(r2), /row_means\(\), pick\(\), reliability\(\): neu heute/);
  assert.match(textOf(r2), /Genauer erklärt: Wie R diese Ausgaben schreibt/);
  assert.match(r2, /class="lesehilfe" role="img" aria-label="fluechtlinge gleich, der neue Name/);
});

test('task texts: the sensitive task 3 is framed as measurement, help levels with the solution numbers', () => {
  const a3 = textOf(elementById(html, 'a3'));
  assert.match(a3, /keine Feststellungen dieses Kurses/);
  assert.match(a3, /Du prüfst nur, wie man sie richtig zu einem Index zusammenfasst/);
  assert.doesNotMatch(a3, /Skepsis/);
  const noSpace = (s: string) => s.replace(/\s+/g, '');
  assert.ok(noSpace(textOf(elementById(html, 'a3'))).includes(noSpace(HINTS.a3[2].replace(/`/g, ''))));
  assert.match(textOf(elementById(html, 'a1')), /pa35 „Politiker vertreten nur die Interessen der Reichen\.“/);
});

test('take-away: the self-test and the script download', () => {
  const t = textOf(html);
  assert.match(t, /5 Fragen/);
  assert.match(html, new RegExp(`download="${SCRIPT_FILE}"`));
  assert.match(t, /Nachlesen im R-Workshop, Kapitel 5 und 8/);
});

test('answers: saved prediction quoted, special feedback after a check', () => {
  const withAnswers = render({ predictions: { a1: 'unter 3: im Mittel eher Zustimmung' }, answers: { a1a: '3416', a1d: '2,646' } });
  const a1 = textOf(elementById(withAnswers, 'a1'));
  assert.doesNotMatch(a1, /Deine Festlegung vorher war/, 'resolution waits while a question is open');
  assert.match(a1, /✗ Indexwert mit min_valid = 7: Das ist N mit Gewicht/);
  assert.match(a1, /✓ gewichteter Mittelwert: 2,646/);
  assert.match(a1, /• Deutung: noch offen\./);
  const all: Record<string, string> = {};
  for (const q of QUESTIONS.a1) all[q.id] = String(q.target);
  const done = textOf(elementById(render({ predictions: { a1: 'unter 3: im Mittel eher Zustimmung' }, answers: all }), 'a1'));
  assert.match(done, /Deine Festlegung vorher war: unter 3: im Mittel eher Zustimmung\./);
});

test('layout: the lecture sentence sits in knownNote, not in the known list', () => {
  const t = textOf(render());
  assert.match(t, /Schon bekannt und hier nur kurz erinnert: der Startblock[^.]*\. Messfehler, Reliabilität und Validität kennst du aus der Vorlesung \(Schild „Wiederholung aus der Vorlesung“\)\./);
});

test('session8Status: open, running, done via the required questions of tasks 1 to 3', () => {
  assert.equal(session8Status(empty), 'open');
  assert.equal(session8Status({ predictions: {}, answers: { a4a: '14,2' } }), 'running');
  const right: Record<string, string> = {};
  for (const q of REQUIRED) right[q.id] = String(q.target);
  assert.equal(session8Status({ predictions: {}, answers: right }), 'done');
  assert.equal(session8Status({ predictions: {}, answers: { ...right, a3c: '0,177' } }), 'running');
});
