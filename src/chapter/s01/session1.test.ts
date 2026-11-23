import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { AllbusContext, type AllbusState } from '../allbusContext';
import { ChapterStateProvider } from '../ChapterContext';
import type { ChapterState } from '../state';
import { testData } from '../../tasks/testRender';
import { BROKEN, COPY_ONLY, HINTS, QUESTIONS, REQUIRED, SCRIPT_FILE, TEMPLATES } from './content';
import { ErrorConsole } from './figures/Pictures';
import { RStudioPanes } from './figures/RStudioPanes';
import { SearchLab } from './figures/SearchLab';
import { Session1, session1Status } from './Session1';
import { FILE_NOT_STORED, FILE_STORED } from './Tasks';

const empty: ChapterState = { predictions: {}, answers: {} };
const allbus = (data: AllbusState['data'], extra: Partial<AllbusState> = {}): AllbusState => ({ data, setData: () => {}, forget: async () => {}, notStored: false, markStored: () => {}, ...extra });

/** Session 1 inside the session frame of LearningPath (h2 title), an ALLBUS context and a chapter state provider. */
function render(state: ChapterState = empty, data: AllbusState['data'] = null, extra: Partial<AllbusState> = {}) {
  return renderToStaticMarkup(h(AllbusContext.Provider, { value: allbus(data, extra) }, h('article', null,
    h('h2', { id: 'learning-heading' }, 'Einstieg'),
    h(ChapterStateProvider, { sessionId: 1, initial: state }, h(Session1)))));
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
    'Vorweg: R lesen', 'Eine Zeile R lesen: der Startblock', 'Die Code-Werkstatt',
    'Thema 1: Startklar: R, RStudio und deine Datei', 'R, RStudio und deine Datei', 'Schritt 1a Vier Fenster: R und RStudio',
    'Schritt 1b Woher die Datei kommt: ALLBUS und GESIS', 'Schritt 1c Ein Projekt für das ganze Semester', 'Schritt 1d Pakete: einmal installieren, jedes Mal laden',
    'Aufgabe 1: Startklar',
    'Thema 2: Variablen finden', 'Variablen finden', 'Schritt 2a Name und Variablenlabel', 'Schritt 2b Suchen mit find_var()', 'Aufgabe 2: Schon gefragt?',
    'Thema 3: Eine Variable lesen', 'Codebuch und erster Blick', 'Schritt 3a Codes und Wertelabels', 'Aufgabe 3: Belegen',
    'Thema 4: Wenn R sich beschwert', 'Fehlermeldungen lesen', 'Schritt 4a So liest du eine Fehlermeldung', 'Schritt 4b Die häufigsten Meldungen', 'Aufgabe 4: Reparieren',
    'Überblick: Welches Werkzeug für welche Frage?', 'Vom Rechner bis zur passenden Variable',
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
  for (const page of [html, render(empty, testData())]) {
    const ids = [...page.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
    assert.deepEqual(ids.filter((x, i) => ids.indexOf(x) !== i), []);
    for (const href of [...page.matchAll(/href="#([^"]+)"/g)].map(m => m[1])) assert.ok(ids.includes(href), `#${href} has a target`);
  }
  const toc = html.slice(html.indexOf('class="chapter-toc"'), html.indexOf('class="chapter-body"'));
  for (const target of ['r1', 'r2', 'thema1', 'thema2', 'thema3', 'thema4', 'ueberblick', 'mitnehmen', 'selbsttest', 'skript']) {
    assert.match(toc, new RegExp(`href="#${target}"`));
  }
});

test('jump bar: four separate links to the tasks, no „·“ anywhere next to them', () => {
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
    assert.match(task, /<b>Ohne Grafik lösbar:<\/b> Alle Ausgaben dieser Aufgabe sind Text\./, id);
    assert.doesNotMatch(task.replace(/<code>[^<]*<\/code>/g, ''), /`/, `${id}: backticks only inside code`);
  });
});

test('required and extra tasks as in the plan', () => {
  const tag = (id: string) => textOf(elementById(html, id).match(/<span class="art [^"]+">[^<]*<\/span>/)?.[0] ?? '');
  assert.deepEqual(TASKS.map(tag), ['Pflicht', 'Pflicht', 'Pflicht', 'Zusatz']);
  assert.match(elementById(html, 'a2'), /<h5>Fürs Plenum<\/h5>/);
});

test('solvable without graphics and without help level 3: text outputs only, each question says where to read', () => {
  for (const [key, t] of Object.entries(TEMPLATES)) assert.doesNotMatch(t.code, /ggplot|geom_|plot\(|hist\(/, key);
  for (const key of TASKS) {
    const task = elementById(html, key);
    const third = task.match(/<summary>Hilfe, Stufe 3: Lösung<\/summary>[\s\S]*?<\/details>/)?.[0] ?? '';
    assert.ok(third, key);
    const squeeze = (x: string) => x.replace(/\s+/g, '');
    const without = squeeze(textOf(task.replace(third, '')));
    for (const q of QUESTIONS[key]) {
      assert.ok(q.help, `${key} ${q.id}: help line says where to read`);
      assert.ok(without.includes(squeeze(q.help!.replace(/`/g, ''))), `${key} ${q.id}: help line is on the page`);
    }
    // The workshops that produce the numbers are part of the task itself, not of the solution.
    assert.ok([...task.replace(third, '').matchAll(/aria-label="R-Code: /g)].length >= 2, key);
  }
  for (const n of ['5.246', '3.592', '5.030']) assert.ok(HINTS.a1.concat(HINTS.a3).some(h => h.includes(n)), n);
});

test('every role="img" has a text version of at least 40 characters', () => {
  for (const tag of html.match(/<[^>]*\brole="img"[^>]*>/g) ?? []) {
    const label = tag.match(/\baria-label="([^"]*)"/)?.[1] ?? '';
    assert.ok(unescape(label).length >= 40, tag.slice(0, 120));
  }
  assert.equal([...html.matchAll(/role="img"/g)].length, 9, 'zeile, werkstatt, rstudio, projekt, pakete, environment, find-var, fehler, weg');
});

test('workshops: start block and codebook copy-only, all others live, try-outs marked, A4 without marks', () => {
  const textareas = [...html.matchAll(/<textarea[^>]*aria-label="R-Code: ([^"]*)"[^>]*>/g)].map(m => ({ title: unescape(m[1]), readOnly: /readOnly|readonly/.test(m[0]) }));
  const byTitle = (t: string) => textareas.filter(x => x.title === t);
  assert.equal(byTitle('Startblock').length, 2);
  for (const k of COPY_ONLY) for (const w of byTitle(TEMPLATES[k].title)) assert.equal(w.readOnly, true, k);
  for (const [k, t] of Object.entries(TEMPLATES)) {
    if (COPY_ONLY.includes(k) || t.tryOut) continue;
    assert.equal(byTitle(t.title).length, 1, t.title);
    assert.equal(byTitle(t.title)[0].readOnly, false, t.title);
  }
  assert.equal(byTitle('Deine Probier-Werkstatt').length, 4);
  for (const k of BROKEN) assert.doesNotMatch(elementById(html, `${k}-st`), /<li>/, k);
  assert.equal([...elementById(html, 'a1_zellen-st').matchAll(/<li>/g)].length, 2);
});

test('task 1, step 1: the drop zone of the atlas without a file, the stored state with one', () => {
  const step = (page: string) => {
    const a1 = elementById(page, 'a1');
    return a1.slice(a1.indexOf('<ol class="schritte">'), a1.indexOf('Wie groß ist der ALLBUS?'));
  };
  const without = step(html);
  assert.match(without, /Deine ALLBUS-Datei laden\./);
  assert.match(without, /class="sandbox-drop-wrap"/);
  assert.match(textOf(without), /ALLBUS-Datei hierher ziehen oder auswählen/);
  assert.match(textOf(without), /ZA8831_v1-3-0\.sav, bleibt auf deinem Rechner/);
  assert.match(textOf(without), /Hochgeladen wird nichts/);
  assert.match(without, /<div role="status"><\/div>/, 'the status wrapper is always there, empty without a file');
  const withFile = step(render(empty, testData()));
  assert.doesNotMatch(withFile, /sandbox-drop/);
  assert.match(withFile, /role="status"/);
  assert.ok(textOf(withFile).includes(FILE_STORED));
  assert.equal([...withFile.matchAll(/role="status"/g)].length, 1);
  assert.match(withFile, /<div role="status"><p[^>]*tabindex="-1"/);
  for (const t of ['Entfernen:', 'Wann musst du sie neu laden?', 'Nur ▶ Ausführen braucht die Datei.']) assert.ok(textOf(withFile).includes(t), t);
});

test('read R and the workshop: line pieces, shortcuts, schema; the overview with route and tool assignment', () => {
  const r1 = textOf(elementById(html, 'r1'));
  assert.match(r1, /Genauer erklärt: Objekt, Funktion, Argument/);
  assert.match(r1, /Häufige Verwechslung: <- und =/);
  const r2 = textOf(elementById(html, 'r2'));
  assert.match(r2, /Strg \/ Cmd \+ Umschalt \+ M : Pipe %>% \(brauchst du ab Sitzung 2\)/);
  assert.match(r2, /Genauer erklärt: Werkstatt und RStudio/);
  const ue = elementById(html, 'g5');
  assert.equal([...ue.matchAll(/<select/g)].length, 5);
  assert.match(textOf(ue), /Voraussetzungen: Was jeder Schritt braucht/);
});

test('take-away: eight points, five self-test questions and the script download', () => {
  const t = textOf(html);
  assert.equal([...elementById(html, 'wichtig').matchAll(/<li>/g)].length, 8);
  assert.match(t, /5 Fragen/);
  assert.match(html, new RegExp(`download="${SCRIPT_FILE}"`));
  assert.match(t, /Nachlesen im R-Workshop, Kapitel 1 und Abschnitt 4\.4/);
});

test('the saved prediction is quoted, and task 2 adds its sentence when everything is right', () => {
  const right: Record<string, string> = {};
  for (const q of QUESTIONS.a2) right[q.id] = String(q.target);
  const page = render({ predictions: { 'a2-fest': 'R hat einen Fehler gemacht.' }, answers: right });
  const a2 = textOf(elementById(page, 'a2'));
  assert.match(a2, /Deine Festlegung vorher war: R hat einen Fehler gemacht\./);
  assert.match(a2, /Alles richtig\. ‚Kein Treffer‘ hieß bei Idee 2 nur: anders schreiben\./);
  assert.doesNotMatch(textOf(elementById(html, 'a2')), /hieß bei Idee 2 nur/);
});

test('session1Status: open, running, done via the required questions of tasks 1 to 3', () => {
  assert.equal(session1Status(empty), 'open');
  assert.equal(session1Status({ predictions: {}, answers: { 'a4-tarot': '248' } }), 'running');
  const right: Record<string, string> = {};
  for (const q of REQUIRED) right[q.id] = String(q.target);
  assert.equal(session1Status({ predictions: {}, answers: right }), 'done');
  assert.equal(session1Status({ predictions: {}, answers: { ...right, 'a3-split': '1647' } }), 'running');
  assert.ok(!REQUIRED.some(q => q.id.startsWith('a4')));
});

test('task 1, step 1: loaded but not stored by the browser says so instead of „gespeichert“', () => {
  const a1 = elementById(render(empty, testData(), { notStored: true }), 'a1');
  assert.ok(textOf(a1).includes(FILE_NOT_STORED));
  assert.equal(FILE_NOT_STORED, '✓ Deine ALLBUS-Datei ist geladen. Dein Browser speichert sie aber nicht: Nach dem Neuladen wählst du sie hier erneut.');
  assert.ok(!textOf(a1).includes(FILE_STORED));
});

test('task 1, step 1: while the stored file is being restored neither zone nor text show, the status wrapper stays', () => {
  const a1 = elementById(render(empty, null, { restoring: true }), 'a1');
  assert.doesNotMatch(a1, /sandbox-drop-wrap/);
  assert.match(a1, /<div role="status"><\/div>/);
});

test('search lab output is a keyboard-scrollable labelled region', () => {
  const out = renderToStaticMarkup(h(SearchLab, { initialAt: 0 }));
  assert.match(out, /<pre[^>]*role="region"/);
  assert.match(out, /<pre[^>]*aria-label="Ausgabe von R"/);
  assert.match(out, /<pre[^>]*tabindex="0"/);
});

test('RStudio panes: the panes that are not chosen are 40 % paler (opacity 0.6)', () => {
  const none = renderToStaticMarkup(h(RStudioPanes));
  assert.doesNotMatch(none, /opacity="0\.[0-9]"/);
  const chosen = renderToStaticMarkup(h(RStudioPanes, { initial: 'skript' }));
  assert.equal([...chosen.matchAll(/opacity="0\.6"/g)].length, 3);
});

test('session 1 uses the shared known note and the Methoden-Ia shield', () => {
  assert.doesNotMatch(html, /s1-bekannt/);
  assert.match(textOf(html), /Schon bekannt und hier nur kurz erinnert: .*Methoden Ia.*Schild.*kennst du aus Methoden Ia/);
});

test('free-map hints are MapLinks, not bare links', () => {
  assert.doesNotMatch(html, /href="\?ansicht=karte"/);
  assert.match(html, /data-concept="/);
});

test('error figure: fonts of at least 12 in the viewBox, viewBox no wider than 420', () => {
  const fig = renderToStaticMarkup(h(ErrorConsole));
  const sizes = [...fig.matchAll(/font-size="([\d.]+)"/g)].map(m => Number(m[1]));
  assert.ok(sizes.length > 0 && Math.min(...sizes) >= 12, String(Math.min(...sizes)));
  assert.ok(Number(/viewBox="0 0 (\d+)/.exec(fig)![1]) <= 420);
});
