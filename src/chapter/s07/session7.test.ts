import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ChapterStateProvider } from '../ChapterContext';
import type { ChapterState } from '../state';
import { PREDICTIONS, QUESTIONS, REQUIRED, SCRIPT_FILE, TEMPLATES } from './content';
import { readFileSync } from 'node:fs';
import { Session7, session7Status } from './Session7';

const empty: ChapterState = { predictions: {}, answers: {} };

/** Session 7 inside the session frame of LearningPath (h2 title) and a chapter state provider. */
function render(state: ChapterState = empty) {
  return renderToStaticMarkup(h('article', null,
    h('h2', { id: 'learning-heading' }, 'Mittelwerte vergleichen'),
    h(ChapterStateProvider, { sessionId: 7, initial: state }, h(Session7))));
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
/** Every question of the task answered (with its target). */
const answersFor = (task: keyof typeof QUESTIONS) => Object.fromEntries(QUESTIONS[task].map(q => [q.id, String(q.target)]));
const html = render();
const TASKS = ['a1', 'a2', 'a3', 'a4'] as const;

test('headings in the order of spec §5 (Variante B)', () => {
  const texts = headings(html).map(x => x.text);
  const order = [
    'Vorweg: R lesen', 'R Erinnerung: Startblock, Kette, Gewicht', 'R Ein t-Test in R: Zeile für Zeile',
    'Thema 1: Zufall oder Unterschied? Der t-Test', 'Zufall oder Unterschied?', 'Aufgabe 1: Vertrauen in den Bundestag',
    'Thema 2: Signifikant, groß oder beides? Voraussetzungen', 'Signifikant, groß oder beides?', 'Aufgabe 2: Macht Abitur zufriedener?',
    'Thema 3: Mehr als zwei Gruppen: ANOVA und Tukey', 'Mehr als zwei Gruppen', 'Aufgabe 3: Links, rechts und der Wohnort',
    'Thema 4: Viele Paare auf einen Blick: die Korrelationsmatrix', 'Viele Paare auf einen Blick', 'Aufgabe 4: Vertrauen in Institutionen',
    'Überblick: Welcher Vergleich für welche Frage?', 'Vergleichen, prüfen, berichten',
    'Zum Schluss: Mitnehmen', 'Das Wichtigste aus dieser Sitzung', 'Prüf dich selbst', 'Dein Skript zum Mitnehmen',
  ];
  let at = -1;
  for (const t of order) {
    const i = texts.findIndex((x, k) => k > at && x.replace(/^R /, '') === t.replace(/^R /, ''));
    assert.ok(i > at, `„${t}“ after position ${at}`);
    at = i;
  }
  for (const card of ['Schritt 1a Jede Stichprobe zeigt einen anderen Unterschied', 'Schritt 1d Wie groß ist der Unterschied? Die Effektstärke', 'Schritt 2c Welch oder Student? Zwei Zeilen in der Ausgabe', 'Schritt 3c Welche Gruppen genau? Der Tukey-Test', 'Schritt 4a Die Korrelationsmatrix lesen', 'Schritt Ü1 Welches Verfahren?', 'Schritt Ü2 Voraussetzungen und Bericht']) {
    assert.ok(texts.includes(card), card);
  }
});

test('headings without gaps below the h2 of the learning path; none is called „Ausgabe“', () => {
  let prev = 2;
  for (const x of headings(html)) {
    assert.ok(x.level <= prev + 1, `h${x.level} „${x.text}“ after h${prev}`);
    prev = x.level;
  }
  assert.equal(headings(html).filter(x => /^Ausgabe\b/.test(x.text)).length, 0);
});

test('ids are unique; every table of contents and jump link has a target', () => {
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
  assert.deepEqual(ids.filter((x, i) => ids.indexOf(x) !== i), []);
  const hrefs = [...html.matchAll(/href="#([^"]+)"/g)].map(m => m[1]);
  for (const href of hrefs) assert.ok(ids.includes(href), `#${href} has a target`);
  const toc = html.slice(html.indexOf('class="chapter-toc"'), html.indexOf('class="chapter-body"'));
  for (const target of ['r1', 'r2', 'thema1', 'thema2', 'thema3', 'thema4', 'ueberblick', 'mitnehmen', 'selbsttest', 'skript']) {
    assert.match(toc, new RegExp(`href="#${target}"`));
  }
});

test('jump bar: four separate links with required/extra, no „·“; no „·“ anywhere in the text', () => {
  const bar = html.match(/<nav class="sprung"[\s\S]*?<\/nav>/)?.[0] ?? '';
  assert.deepEqual([...bar.matchAll(/<a href="#(a\d)">([^<]*)<\/a>/g)].map(m => `${m[1]} ${m[2]}`),
    ['a1 Aufgabe 1 (Pflicht)', 'a2 Aufgabe 2 (Zusatz)', 'a3 Aufgabe 3 (Pflicht)', 'a4 Aufgabe 4 (Zusatz)']);
  assert.doesNotMatch(textOf(html), /·/);
  assert.doesNotMatch(textOf(html), /fiktiv/i);
});

test('head: guiding question, goals, known and the route', () => {
  const t = textOf(html);
  assert.match(t, /Unterscheiden sich Gruppen im Mittel – und ist das mehr als Zufall\?/);
  for (const g of ['Verfahren:', 'Interpretation:', 'Voraussetzungen:', 'Code lesen:']) assert.ok(t.includes(g), g);
  assert.match(t, /Schon bekannt und hier nur kurz erinnert: der Startblock \(Sitzung 1\), Ketten mit %>% \(Sitzung 4\)/);
  assert.match(t, /Ein Test in R, Ausgabe lesen/);
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
    assert.match(task, /aria-label="R-Code: Deine Probier-Werkstatt"/);
    assert.match(task, /<summary>Hilfe: R meldet einen Fehler<\/summary>/, id);
    assert.equal([...task.matchAll(/<tr>/g)].length, 11, `${id}: error help with ten rows`);
    assert.doesNotMatch(task.replace(/<code>[^<]*<\/code>/g, ''), /`/, `${id}: backticks only inside code (R's own messages)`);
  });
});

test('required and extra tasks as in the plan', () => {
  const tag = (id: string) => textOf(elementById(html, id).match(/<span class="art [^"]+">[^<]*<\/span>/)?.[0] ?? '');
  assert.deepEqual(TASKS.map(tag), ['Pflicht', 'Zusatz', 'Pflicht', 'Zusatz']);
});

test('solvable without the graphics: the text output of the templates holds every answer', () => {
  for (const id of TASKS) {
    const visible = elementById(withoutHelp(html), id);
    assert.match(visible, /<p class="ohne-grafik"><b>Ohne Grafik lösbar:<\/b> Alle Antworten stehen in der Textausgabe von <code>summary\(\)<\/code>/, id);
    assert.doesNotMatch(visible, /Stufe 3: Lösung/, id);
    assert.doesNotMatch(visible, /role="img"/, `${id}: no picture carries an answer`);
  }
  // Every numeric target comes from a live template of its own task that prints it with summary().
  const route: Record<string, [string, string]> = { a1b: ['a1', 'a1_tabelle'], a2a: ['a2', 'a2_alle'], a2c: ['a2', 'a2_jung'], a3b: ['a3', 'a3_anova'], a3e: ['a3', 'a3_tukey'], a4a: ['a4', 'a4_matrix'], a4b: ['a4', 'a4_matrix'] };
  const numeric = TASKS.flatMap(k => QUESTIONS[k]).filter(q => q.kind === 'number').map(q => q.id);
  assert.deepEqual(numeric.sort(), Object.keys(route).sort());
  for (const [qid, [task, k]] of Object.entries(route)) {
    const visible = elementById(withoutHelp(html), task);
    assert.match(visible, new RegExp(`aria-label="R-Code: ${TEMPLATES[k].title}"`), `${qid}: ${k} in ${task}`);
    assert.match(TEMPLATES[k].code, /summary\(\)/, `${qid}: ${k} prints the table`);
  }
  // The swap the questions need is said in the step text, not only in the help.
  assert.match(textOf(elementById(withoutHelp(html), 'a1')), /Tausch dann die markierte Stelle age gegen pt03/);
  assert.match(textOf(elementById(withoutHelp(html), 'a3')), /Tausch dann age gegen pa01 und mode gegen gs01/);
});

test('every role="img" has a text version of at least 40 characters', () => {
  const tags = html.match(/<[^>]*\brole="img"[^>]*>/g) ?? [];
  assert.ok(tags.length >= 5);
  for (const tag of tags) {
    const label = tag.match(/\baria-label="([^"]*)"/)?.[1] ?? '';
    assert.ok(unescape(label).length >= 40 || /aria-labelledby/.test(tag), tag.slice(0, 120));
  }
});

test('task 3: the reading aid shows the template as it starts (age by mode), not the answer', () => {
  const a3 = textOf(elementById(html, 'a3'));
  assert.match(a3, /160\.989/);
  assert.match(a3, /Mit deinen Variablen stehen hier fünf Wohnorte und andere Zahlen\./);
  assert.doesNotMatch(withoutHelp(elementById(html, 'a3')), /26\.015|318\.601|GROSSSTADT/);
});

test('workshops: start block copy-only; reading and task templates live; four try-outs', () => {
  const textareas = [...html.matchAll(/<textarea[^>]*aria-label="R-Code: ([^"]*)"[^>]*>/g)].map(m => ({ title: unescape(m[1]), readOnly: /readOnly|readonly/.test(m[0]) }));
  const byTitle = (t: string) => textareas.filter(x => x.title === t);
  assert.equal(byTitle('Startblock')[0]?.readOnly, true);
  for (const k of ['r_ttest', 'a1_kurz', 'a1_tabelle', 'a2_alle', 'a2_jung', 'a3_anova', 'a3_tukey', 'a4_matrix']) {
    assert.equal(byTitle(TEMPLATES[k].title).length, 1, k);
    assert.equal(byTitle(TEMPLATES[k].title)[0].readOnly, false, k);
  }
  assert.equal(byTitle('Deine Probier-Werkstatt').length, 4);
  for (const k of ['a1_kurz', 'a3_anova']) assert.match(html, new RegExp(`id="${k}-st"`), `${k} lists its marks`);
});

test('read R: badges, new tools, the silent mistake without group =, the output with seven marks', () => {
  const r1 = textOf(elementById(html, 'r1'));
  for (const b of ['Startblock: kennst du aus Sitzung 1', 'mutate() mit rec(): kennst du aus Sitzung 5', 'Gewicht: kennst du aus Sitzung 6']) assert.ok(r1.includes(b), b);
  assert.match(r1, /Häufige Verwechslung: group = abitur und abitur allein/);
  assert.match(r1, /Es fehlt die Zeile „Groups compared“/);
  const r2 = elementById(html, 'r2');
  assert.equal([...r2.matchAll(/class="s07-marke"/g)].length, 7 + 7, 'seven marks in the output and seven in the legend');
  const t = textOf(r2);
  assert.match(t, /Equal variances not assumed\s+22\.988[^.]{0,30}2763\.588[^.]{0,30}<\.001[^.]{0,30}7\.988/);
  assert.match(t, /Männer 1\.530, im Mittel 41,6 Stunden; Frauen 1\.427, im Mittel 33,6 Stunden/);
  assert.match(t, /Gezählt sind es 1\.491 Männer und 1\.442 Frauen/);
  assert.doesNotMatch(elementById(r2, 'bild-r2'), /<pre|role="img"/, 'the output is text, not a picture');
});

test('predictions before all four tasks; after checking, the comparison from the plan', () => {
  for (const id of TASKS) assert.match(elementById(html, id), /<b>Erst festlegen:<\/b>/, id);
  assert.match(elementById(html, 'a1-tipp-vergleich'), /aria-live="polite"><\/p>/);
  const fixedOnly = render({ predictions: { 'a1-tipp': 'mit Abitur' }, answers: {} });
  assert.doesNotMatch(fixedOnly, /Dein Tipp: mit Abitur\./);
  const checked = render({ predictions: { 'a1-tipp': 'mit Abitur', 'a3-tipp': 'Vorort einer Großstadt' }, answers: { ...answersFor('a1'), ...answersFor('a3'), a3a: '2' } });
  assert.match(elementById(checked, 'a1'), /Dein Tipp: mit Abitur\. Stimmt: 4,35 gegen 3,69\./);
  assert.match(elementById(checked, 'a3'), /Dein Tipp: Vorort einer Großstadt\. Am weitesten links steht die Großstadt \(4,45\); der Vorort einer Großstadt liegt bei 4,85\./);
  assert.deepEqual(PREDICTIONS.a1.options, ['ohne Abitur', 'mit Abitur', 'beide etwa gleich']);
});

test('plenum boxes in tasks 1 and 3; task 1 intro says two thirds were asked', () => {
  assert.match(elementById(html, 'a1'), /<h5>Fürs Plenum<\/h5>/);
  assert.match(elementById(html, 'a3'), /<h5>Fürs Plenum<\/h5>/);
  assert.doesNotMatch(elementById(html, 'a2'), /Fürs Plenum/);
  const intro = textOf(elementById(html, 'a1'));
  assert.match(intro, /nur etwa zwei Dritteln der Befragten \(1\.596 haben sie nicht bekommen/);
  assert.doesNotMatch(textOf(html), /Hälfte des Fragebogens/);
  assert.match(textOf(elementById(html, 'a1')), /Musterformulierung:/);
});

test('take-away: seven points, the self-test and the script download', () => {
  const t = textOf(html);
  assert.equal([...elementById(html, 'wichtig').matchAll(/<li>/g)].length, 7);
  assert.match(t, /5 Fragen/);
  assert.match(html, new RegExp(`download="${SCRIPT_FILE}"`));
  assert.match(t, /Nachlesen im R-Workshop, Kapitel 7\.6 Mittelwertvergleiche/);
});

test('session7Status: open, running, done via the required questions of tasks 1 and 3', () => {
  assert.equal(session7Status(empty), 'open');
  assert.equal(session7Status({ predictions: {}, answers: { a2a: '-0.179' } }), 'running');
  const right: Record<string, string> = {};
  for (const q of REQUIRED) right[q.id] = String(q.target);
  assert.equal(session7Status({ predictions: {}, answers: right }), 'done');
  assert.equal(session7Status({ predictions: {}, answers: { ...right, a3b: '160.989' } }), 'running');
  assert.deepEqual(REQUIRED.map(q => q.id), ['a1a', 'a1b', 'a1d', 'a1e', 'a1f', 'a3a', 'a3b', 'a3d', 'a3e', 'a3f']);
});

test('tip comparison appears only when no question of the task is open; its live region stays rendered', () => {
  const partial = render({ predictions: { 'a1-tipp': 'mit Abitur' }, answers: { a1a: 'mit' } });
  assert.doesNotMatch(textOf(elementById(partial, 'a1')), /Dein Tipp: mit Abitur/);
  assert.match(elementById(partial, 'a1-tipp-vergleich'), /aria-live="polite"/);
  const complete = render({ predictions: { 'a1-tipp': 'mit Abitur' }, answers: answersFor('a1') });
  assert.match(textOf(elementById(complete, 'a1')), /Dein Tipp: mit Abitur\./);
});

test('css: the empty live region is collapsed, not removed from the accessibility tree', () => {
  const css = readFileSync(new URL('./s07.css', import.meta.url), 'utf8');
  assert.doesNotMatch(css, /display:\s*none/);
  assert.match(css, /\.s07-tipp:empty\s*\{[^}]*margin:\s*0[^}]*min-height:\s*0/);
});

test('table rows hold only cells: no whitespace text inside <tr> (React warns about it)', () => {
  for (const row of html.match(/<tr\b[^>]*>[^]*?<\/tr>/g) ?? []) {
    const between = row.replace(/^<tr\b[^>]*>/, '').replace(/<\/tr>$/, '').replace(/<(t[dh])\b[^>]*>[^]*?<\/\1>|<t[dh]\b[^>]*\/>/g, '');
    assert.equal(between, '', row.slice(0, 120));
  }
});
