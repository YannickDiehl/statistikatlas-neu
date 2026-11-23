import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ChapterStateProvider } from '../ChapterContext';
import { chapterRegistry } from '../registry';
import type { ChapterState } from '../state';
import { PREDICTIONS, QUESTIONS, REQUIRED, SCRIPT_FILE, TEMPLATES } from './content';
import { Session6, session6Status } from './Session6';

const empty: ChapterState = { predictions: {}, answers: {} };

/** Session 6 inside the session frame of LearningPath (h2 title) and a chapter state provider. */
function render(state: ChapterState = empty) {
  return renderToStaticMarkup(h('article', null,
    h('h2', { id: 'learning-heading' }, 'Gewichtung und Zusammenhang'),
    h(ChapterStateProvider, { sessionId: 6, initial: state }, h(Session6))));
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
    'Vorweg: R lesen', 'R Neu heute: ein Gewicht als Argument', 'R Ein Zusammenhangsmaß in R: zwei Variablen, eine Zahl',
    'Thema 1: Gewichtung', 'Gewichtung', 'Aufgabe 1: Wie zufrieden ist Deutschland mit der Demokratie?',
    'Thema 2: Kategorien ohne Reihenfolge: χ², Phi und Cramér-V', 'Zusammenhang in der Kreuztabelle', 'Aufgabe 2: Zufriedenheit und Wahlabsicht',
    'Thema 3: Geordnete Stufen: Gamma und Tau-b', 'Paare vergleichen', 'Aufgabe 3: Wirtschaftslage und Demokratie',
    'Thema 4: Zahlen mit Abständen: Pearson und Spearman, und die Drittvariable', 'Punktwolke, Ausreißer, Drittvariable', 'Aufgabe 4: Lebenszufriedenheit und Demokratie',
    'Überblick: Welches Maß für welche Variablen?', 'Maß wählen, Grenzen kennen',
    'Zum Schluss: Mitnehmen', 'Das Wichtigste aus dieser Sitzung', 'Prüf dich selbst', 'Dein Skript zum Mitnehmen',
  ].map(t => t.replace(/^R /, ''));
  let at = -1;
  for (const t of order) {
    const i = texts.findIndex((x, k) => k > at && (x === t || x.endsWith(` ${t}`)));
    assert.ok(i > at, `„${t}“ after position ${at}`);
    at = i;
  }
  for (const step of ['1a', '1b', '1c', '2a', '2b', '2c', '3a', '3b', '3c', '4a', '4b', '4c', 'Ü1', 'Ü2', 'Ü3']) {
    assert.ok(texts.some(t => t.startsWith(`Schritt ${step} `)), step);
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
  for (const href of [...html.matchAll(/href="#([^"]+)"/g)].map(m => m[1])) assert.ok(ids.includes(href), `#${href} has a target`);
  const toc = html.slice(html.indexOf('class="chapter-toc"'), html.indexOf('class="chapter-body"'));
  for (const target of ['r1', 'r2', 'thema1', 'thema2', 'thema3', 'thema4', 'ueberblick', 'mitnehmen', 'selbsttest', 'skript']) {
    assert.match(toc, new RegExp(`href="#${target}"`));
  }
});

test('jump bar: four separate links to the tasks, no „·“ between them; lead and weighting note', () => {
  const bar = html.match(/<nav class="sprung"[\s\S]*?<\/nav>/)?.[0] ?? '';
  assert.deepEqual([...bar.matchAll(/<a href="#(a\d)">([^<]*)<\/a>/g)].map(m => `${m[1]} ${m[2]}`), ['a1 Aufgabe 1', 'a2 Aufgabe 2', 'a3 Aufgabe 3', 'a4 Aufgabe 4']);
  assert.doesNotMatch(textOf(bar), /·/);
  assert.match(textOf(html), /Was hängt mit der Zufriedenheit mit der Demokratie zusammen – und wie misst man, wie stark\?/);
  assert.match(textOf(html), /Ab heute rechnen alle Vorlagen gewichtet, wenn es um Aussagen über ganz Deutschland geht\. Warum, zeigt Thema 1\./);
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
    const errors = task.match(/<details class="hilfe"><summary>Hilfe: R meldet einen Fehler<\/summary>[\s\S]*?<\/details>/)?.[0] ?? '';
    assert.equal([...errors.matchAll(/<tr>/g)].length - 1, 8, `${id}: eight error rows`);
    assert.doesNotMatch(task.replace(/<code>[^<]*<\/code>/g, ''), /`/, `${id}: backticks only inside code`);
  });
});

test('required and extra tasks as in the plan; plenum boxes in tasks 2 and 3', () => {
  const tag = (id: string) => textOf(elementById(html, id).match(/<span class="art [^"]+">[^<]*<\/span>/)?.[0] ?? '');
  assert.deepEqual(TASKS.map(tag), ['Pflicht', 'Pflicht', 'Pflicht', 'Zusatz']);
  for (const id of ['a2', 'a3']) assert.match(elementById(html, id), /<h5>Fürs Plenum<\/h5>/, id);
  for (const id of ['a1', 'a4']) assert.doesNotMatch(elementById(html, id), /Fürs Plenum/, id);
});

test('every task question is rendered in its task', () => {
  for (const id of TASKS) {
    const task = elementById(html, id);
    for (const q of QUESTIONS[id]) assert.match(task, new RegExp(`id="${id}-fragen-${q.id}`), `${id} ${q.id}`);
  }
});

test('solvable without the graphics: a text route for every task and every numeric target (without help level 3)', () => {
  for (const id of TASKS) {
    const visible = elementById(withoutHelp(html), id);
    assert.match(visible, /<p class="ohne-grafik"><b>Ohne Grafik lösbar:<\/b>/, `${id} has the line`);
    assert.doesNotMatch(visible, /Stufe 3: Lösung/, id);
  }
  const code = (k: string) => TEMPLATES[k].code;
  const visible = (id: string) => textOf(elementById(withoutHelp(html), id));
  // Each numeric target is printed by a template of its own task (R output is text) and the task names where to read it.
  const routes: Record<string, boolean> = {
    'a1-ungewichtet': /frequency\(ps03\)/.test(code('a1a')) && /Cum\. %/.test(visible('a1')),
    'a1-gewichtet': /frequency\(ps03, weights = wghtpew\)/.test(code('a1a')),
    'a1-ost': /filter\(eastwest == ⟦2⟧\)/.test(code('a1b')),
    'a1-west': /filter\(eastwest == ⟦2⟧\)/.test(code('a1b')) && /tausche beide markierten Stellen gegen 1/.test(visible('a1')),
    'a2-gruene': /crosstab\(pv01, zufrieden, percentages = "row", weights = wghtpew\)/.test(code('a2b')) && /row %/.test(visible('a2')),
    'a2-afd': /crosstab\(pv01, zufrieden/.test(code('a2b')),
    'a2-v': /cramers_v\(pv01, zufrieden, weights = wghtpew\)/.test(code('a2c')) && /\[1\]/.test(visible('a2')),
    'a3-gamma': /goodman_gamma\(zufriedenheit, ep01, weights = wghtpew\)/.test(code('a3b')) && /\[1\]/.test(visible('a3')),
    'a3-tau': /kendall_tau\(zufriedenheit, ep01, weights = wghtpew\)/.test(code('a3b')) && /tau = …/.test(visible('a3')),
    'a4-r': /pearson_cor\(zufriedenheit, ls01, weights = wghtpew\)/.test(code('a4b')),
    'a4-rho': /spearman_rho\(zufriedenheit, ls01\)/.test(code('a4b')),
    'a4-west': /filter\(eastwest == ⟦1⟧\)/.test(code('a4c')),
    'a4-ost': /filter\(eastwest == ⟦1⟧\)/.test(code('a4c')) && /tausche die markierte Stelle gegen 2/.test(visible('a4')),
  };
  const targets = TASKS.flatMap(k => QUESTIONS[k]).filter(q => q.kind === 'number').map(q => q.id);
  assert.deepEqual(targets.sort(), Object.keys(routes).sort());
  for (const [t, ok] of Object.entries(routes)) assert.ok(ok, `route for ${t}`);
  // the step pictures carry their text version outside the help levels
  assert.match(elementById(withoutHelp(html), 'a1'), /role="img" aria-label="Beispieltabelle mit vier Codes/);
  assert.match(elementById(withoutHelp(html), 'a3'), /role="img" aria-label="Zwei senkrechte Pfeile/);
  assert.match(elementById(withoutHelp(html), 'a4'), /Textfassung der Grafik: Punktwolke, x-Achse Lebenszufriedenheit/);
});

test('every role="img" has a text version of at least 40 characters', () => {
  const tags = html.match(/<[^>]*\brole="img"[^>]*>/g) ?? [];
  assert.ok(tags.length >= 6);
  for (const tag of tags) {
    const label = tag.match(/\baria-label="([^"]*)"/)?.[1];
    const ids = tag.match(/\baria-labelledby="([^"]*)"/)?.[1];
    const text = label !== undefined ? unescape(label) : textOf(elementById(html, ids ?? ''));
    assert.ok(text.length >= 40, tag.slice(0, 120));
  }
});

test('workshops: start block copy-only, all other templates live, marks listed, four try-out workshops', () => {
  const textareas = [...html.matchAll(/<textarea[^>]*aria-label="R-Code: ([^"]*)"[^>]*>/g)].map(m => ({ title: unescape(m[1]), readOnly: /readOnly|readonly/.test(m[0]) }));
  const byTitle = (t: string) => textareas.filter(x => x.title === t);
  assert.equal(byTitle('Startblock')[0]?.readOnly, true);
  for (const [k, t] of Object.entries(TEMPLATES)) {
    if (k === 'start' || t.tryOut) continue;
    assert.equal(byTitle(t.title).length, 1, t.title);
    assert.equal(byTitle(t.title)[0].readOnly, false, t.title);
  }
  assert.equal(byTitle('Deine Probier-Werkstatt').length, 4);
  const marks = (k: string) => [...elementById(html, `${k}-st`).matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => textOf(m[1]));
  assert.deepEqual(marks('a1b'), ['Zeile 3: 2', 'Zeile 7: 2']);
  assert.deepEqual(marks('a4c'), ['Zeile 7: 1']);
});

test('read R: badges, reading line, output picture, function table', () => {
  const r1 = textOf(elementById(html, 'r1'));
  assert.match(r1, /Startblock: kennst du aus Sitzung 1/);
  assert.match(r1, /frequency\(\): kennst du aus Sitzung 3/);
  assert.match(r1, /Genauer erklärt: Muss ich das Gewicht jedes Mal hinschreiben\?/);
  assert.match(r1, /gewichtet 16,84 %/);
  const r2 = elementById(html, 'r2');
  assert.match(r2, /role="img" aria-label="Ausgabe in drei Zeilen/);
  assert.equal([...elementById(r2, 'r2').matchAll(/<tr>/g)].length, 1 + 6);
  assert.match(textOf(r2), /Genauer erklärt: p-Wert, Sternchen und Warnungen/);
});

test('take-away: the self-test with five questions and the script download', () => {
  const t = textOf(html);
  assert.match(t, /5 Fragen/);
  assert.match(html, new RegExp(`download="${SCRIPT_FILE}"`));
  assert.match(t, /Nachlesen im R-Workshop, Kapitel 7 \(Gewichtung, Zusammenhangsmaße\)/);
});

test('the saved prediction is quoted with its resolution only when no question of the task is open', () => {
  assert.doesNotMatch(html, /Auflösung zu deinem Tipp/);
  const first = QUESTIONS.a1[0];
  const partial = render({ predictions: { 'a1-tipp': 'Er steigt' }, answers: { [first.id]: '73,58' } });
  const p1 = textOf(elementById(partial, 'a1'));
  assert.match(p1, /Deine Festlegung vorher war: Er steigt\./);
  assert.doesNotMatch(p1, /Auflösung zu deinem Tipp/);
  for (const k of ['a1', 'a2', 'a3', 'a4'] as const) {
    const part = render({ predictions: { [PREDICTIONS[k].id]: 'x' }, answers: { [QUESTIONS[k][0].id]: '1' } });
    assert.doesNotMatch(textOf(elementById(part, k)), /Auflösung zu deinem Tipp/, k);
  }
  // Text without a number is still open for a number question: no resolution yet.
  const unread = render({ predictions: { 'a1-tipp': 'Er steigt' }, answers: Object.fromEntries(QUESTIONS.a1.map(q => [q.id, 'weiß nicht'])) });
  assert.doesNotMatch(textOf(elementById(unread, 'a1')), /Auflösung zu deinem Tipp/);
  const all = Object.fromEntries(QUESTIONS.a1.map(q => [q.id, '1']));
  const done = render({ predictions: { 'a1-tipp': 'Er steigt' }, answers: all });
  assert.match(textOf(elementById(done, 'a1')), new RegExp(`Auflösung zu deinem Tipp: ${PREDICTIONS.a1.resolution.replace(/[.%]/g, '\\$&')}`));
});

test('session6Status: open, running, done via the required questions of tasks 1 to 3', () => {
  assert.equal(session6Status(empty), 'open');
  assert.equal(session6Status({ predictions: {}, answers: { 'a4-r': '0,265' } }), 'running');
  const right: Record<string, string> = {};
  for (const q of REQUIRED) right[q.id] = String(q.target);
  assert.equal(session6Status({ predictions: {}, answers: right }), 'done');
  assert.equal(session6Status({ predictions: {}, answers: { ...right, 'a3-gamma': '0,544' } }), 'running');
  assert.equal(chapterRegistry[6]?.live, false);
  assert.equal(chapterRegistry[6]?.status, session6Status);
});

test('review findings: slider step, list roles, caption without colour, shared how-to line and map links', () => {
  assert.match(html, /id="s6-mischpult-p"[^>]*step="0.1"/);
  const lists = [...html.matchAll(/<ol class="s6-bausteine"([^>]*)>/g)];
  assert.ok(lists.length >= 2);
  for (const l of lists) assert.match(l[1], /role="list"/);
  assert.doesNotMatch(textOf(html), /grüne Teil/);
  assert.match(textOf(html), /Teil rechts: gut und sehr gut/);
  assert.doesNotMatch(html, /s6-gewichtet/);
  assert.match(textOf(html), /Neu in dieser Sitzung: Ab heute rechnen alle Vorlagen gewichtet/);
  for (const c of ['weights', 'chi_square', 'cramers_v', 'goodman_gamma', 'kendall_tau', 'pearson', 'spearman', 'confounding'])
    assert.match(html, new RegExp(`data-concept="${c}"`), c);
});
