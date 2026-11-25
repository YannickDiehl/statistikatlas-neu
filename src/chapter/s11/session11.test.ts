import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ChapterStateProvider } from '../ChapterContext';
import { chapterRegistry } from '../registry';
import type { ChapterState } from '../state';
import { PREDICTIONS, QUESTIONS, REQUIRED, SCRIPT_FILE, TEMPLATES } from './content';
import { Session11, session11Status } from './Session11';

const empty: ChapterState = { predictions: {}, answers: {} };

/** Session 11 inside the session frame of LearningPath (h2 title) and a chapter state provider. */
function render(state: ChapterState = empty) {
  return renderToStaticMarkup(h('article', null,
    h('h2', { id: 'learning-heading' }, 'Logistische Regression'),
    h(ChapterStateProvider, { sessionId: 11, initial: state }, h(Session11))));
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
    'Vorweg: R lesen', 'R lesen: ein logistisches Modell', 'Vier neue Werkzeuge',
    'Thema 1: Ja oder nein: warum keine Gerade?', 'Ja oder nein: warum keine Gerade?', 'Schritt 1a Dichotome Variable: ein Turm aus Nullen und Einsen',
    'Schritt 1b Warum eine Gerade scheitert', 'Schritt 1c Drei Sprachen: Wahrscheinlichkeit, Chance, Logit', 'Aufgabe 1: Wer will wählen gehen?',
    'Thema 2: Das Modell: B und Exp(B)', 'Das Modell: B und Exp(B)', 'Aufgabe 2: Was heißt Exp(B) für das Pflichtgefühl?',
    'Thema 3: Vorhergesagte Wahrscheinlichkeiten', 'Vorhergesagte Wahrscheinlichkeiten', 'Aufgabe 3: Was heißt das in Prozent?',
    'Thema 4: Wie gut ist das Modell?', 'Wie gut ist das Modell?', 'Aufgabe 4: Erkennt das Modell, wer nicht wählen will?',
    'Überblick: Logistische Regression lesen', 'Logistische Regression lesen', 'Schritt Ü1 Drei Sprachen, eine Zahl', 'Schritt Ü2 Welches Regressionsmodell?', 'Schritt Ü3 Voraussetzungen',
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
  for (const state of [empty, { predictions: { a3: 'bei Person A' }, answers: { a3a: '3,248', 'k3b-frage': 'von 70 auf 80' } }]) {
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

test('jump bar: four separate links to the tasks, no „·“ anywhere in the chapter text', () => {
  const bar = html.match(/<nav class="sprung"[\s\S]*?<\/nav>/)?.[0] ?? '';
  assert.deepEqual([...bar.matchAll(/<a href="#(a\d)">([^<]*)<\/a>/g)].map(m => `${m[1]} ${m[2]}`), ['a1 Aufgabe 1', 'a2 Aufgabe 2', 'a3 Aufgabe 3', 'a4 Aufgabe 4']);
  assert.doesNotMatch(textOf(html), /·/);
  assert.doesNotMatch(textOf(html), /\(fiktiv\)/);
});

test('head: guiding question, three signposts, seven goals, known items, fifth line and weighting note', () => {
  const t = textOf(html);
  assert.match(t, /Wer geht wählen – und wie wahrscheinlich\?/);
  assert.equal([...html.matchAll(/<ul class="weg">[\s\S]*?<\/ul>/g)].length, 1);
  assert.equal([...(html.match(/<ul class="weg">[\s\S]*?<\/ul>/)?.[0] ?? '').matchAll(/<li>/g)].length, 3);
  const goals = html.match(/<section class="box-gruen" aria-labelledby="ziele-h">[\s\S]*?<\/ul>/)?.[0] ?? '';
  assert.equal([...goals.matchAll(/<li>/g)].length, 7);
  assert.match(t, /Schon bekannt und hier nur kurz erinnert: der Startblock und lm30 mit seinem TNZ: FILTER \(Sitzung 1\)/);
  assert.match(t, /Jede Vorlage läuft für sich: Sie bildet die Variablen, die sie braucht, selbst\./);
  const so = html.match(/<section class="so" aria-label="So arbeitest du mit dieser Seite">[\s\S]*?<\/section>/)?.[0] ?? '';
  assert.match(so, /Jede Vorlage läuft für sich/, 'fifth line comes from the shared howToExtra');
  assert.doesNotMatch(html, /s11-so-extra/);
  assert.match(textOf(elementById(html, 'skript')), /Block für Block aus\. Jeder Block läuft für sich\./);
  assert.match(t, /Alle Zahlen in diesem Kapitel sind gewichtet mit wghtpew/);
});

test('every task: goal, link to its foundation, three help levels, closed try-out workshop, error help', () => {
  TASKS.forEach((id, i) => {
    const task = elementById(html, id);
    assert.ok(task, id);
    assert.match(task, /<b>Ziel:<\/b> Am Ende/, id);
    assert.match(task, new RegExp(`<a class="zur-grund" href="#g${i + 1}">`), id);
    assert.match(task, /<p class="grundlage">Grundlage: <a href="#g\d">Grundlage \d, /, id);
    for (const s of ['Stufe 1: Denkanstoß', 'Stufe 2: Wo schaue ich?', 'Stufe 3: Lösung']) assert.match(task, new RegExp(`<summary>Hilfe, ${s.replace('?', '\\?')}</summary>`), `${id} ${s}`);
    const tryOut = task.match(/<details class="probier"[^>]*>/)?.[0];
    assert.ok(tryOut, `${id} try-out`);
    assert.doesNotMatch(tryOut!, /\bopen\b/);
    assert.match(task, /für die Aufgabe nicht nötig/);
    assert.match(task, /aria-label="R-Code: Deine Probier-Werkstatt"/);
    assert.match(task, /<summary>Hilfe: R meldet einen Fehler<\/summary>/, id);
    assert.equal([...task.matchAll(/<tr>/g)].length >= 12, true, `${id}: error help table with 11 rows`);
    assert.match(task, /<b>Erst festlegen:<\/b>/, id);
    assert.doesNotMatch(task.replace(/<code>[^<]*<\/code>/g, ''), /`/, `${id}: backticks only inside code`);
  });
});

test('required and extra tasks as in the plan', () => {
  const tag = (id: string) => textOf(elementById(html, id).match(/<span class="art [^"]+">[^<]*<\/span>/)?.[0] ?? '');
  assert.deepEqual(TASKS.map(tag), ['Pflicht', 'Pflicht', 'Pflicht', 'Zusatz']);
});

/** Markup without the help levels: their „Lösung“ must not count as a route to the answer. */
const withoutHelp = (markup: string) => markup.replace(/<details class="hilfe"[^>]*>[\s\S]*?<\/details>/g, '');

test('solvable without the graphics: a text route for every task and every numeric target (without help level 3)', () => {
  const visible = withoutHelp(html);
  for (const id of TASKS) {
    const task = elementById(visible, id);
    assert.match(task, /<p class="ohne-grafik"><b>Ohne Grafik lösbar:<\/b>/, `${id} has the line`);
    assert.doesNotMatch(task, /Stufe 3: Lösung/, id);
  }
  const text = (id: string) => textOf(elementById(visible, id));
  const code = (k: string) => TEMPLATES[k].code;
  // Jede Zahl wird von einer Vorlage gedruckt, und der Aufgabentext sagt, was einzusetzen ist.
  const routes: Record<string, boolean> = {
    a1b: /frequency\(waehlen, weights = wghtpew\)/.test(code('a1f')) && /Valid %|Spalte Valid/.test(QUESTIONS.a1[1].hint),
    a1c: /crosstab\(pflicht, waehlen, percentages = "row"/.test(code('a1k')) && /row %/.test(text('a1')),
    a1d: /⟦78\.3⟧ - ⟦61\.4⟧/.test(code('a1r')) && /von „stimme eher zu“ zu „stimme voll zu“/.test(text('a1')),
    a1f: /⟦61\.4⟧ \/ ⟦38\.6⟧/.test(code('a1c')) && /Tausch die Zahlen gegen die Zeile „stimme voll zu“/.test(text('a1')),
    a2b: /summary\(\)/.test(code('a2')) && /Ersetze die markierte Stelle durch pflicht \+ interesse/.test(text('a2')),
    a2d: /\(⟦0\.927⟧ - 1\) \* 100/.test(code('a2r')) && /gegen Exp\(B\) des Interesses/.test(text('a2')),
    a3a: /chance <- exp\(logit\)/.test(code('a3h')) && /hat A also pflicht 2 und interesse 2/.test(text('a3')),
    a3b: /chance \/ \(1 \+ chance\)/.test(code('a3h')) && /hat A also pflicht 2 und interesse 2/.test(text('a3')),
    a3c: /predict\(newdata = profile, type = "response"\)/.test(code('a3p')) && /Person 2 minus Person 1/.test(text('a3')),
    a3d: /predict\(newdata = profile, type = "response"\)/.test(code('a3p')) && /\(pflicht 3, interesse 4\) und B mit einer Stufe mehr \(pflicht 4, interesse 4\)/.test(text('a3')),
    a3f: /marginal_effects\(\)/.test(code('a3m')),
    a4a: /summary\(\)/.test(code('a4')) && /Classification Table/.test(text('a4')),
    a4b: /\(⟦5⟧ \+ ⟦4393⟧\) \/ ⟦4813⟧ \* 100/.test(code('a4r')) && /die beiden Zellen der Zeile „würde wählen“ und die Summe aller vier Zellen/.test(text('a4')),
    a4c: /summary\(\)/.test(code('a4')),
    a4d: /⟦2370\.945⟧ \+ ⟦453\.950⟧/.test(code('a4l')) && /−2 Log Likelihood \(Model Summary\) und Chi-square \(Omnibus Tests\)/.test(text('a4')),
  };
  const numeric = Object.values(QUESTIONS).flat().filter(q => q.kind === 'number').map(q => q.id);
  assert.deepEqual(numeric.sort(), Object.keys(routes).sort());
  for (const [id, ok] of Object.entries(routes)) assert.ok(ok, `route for ${id}`);
  // Die Bilder in den Aufgaben haben ihre Textfassung außerhalb der Hilfen
  assert.match(elementById(visible, 'a1'), /role="img" aria-label="Zum Beispiel vier Stufen mit 50, 70, 88 und 97 Prozent\./);
});

test('every role="img" has a text version of at least 40 characters, also after checking', () => {
  for (const state of [empty, { predictions: {}, answers: { a3a: '3,248', 'k1b-frage': 'genau 100 %', 'k3b-frage': 'von 70 auf 80' } }]) {
    for (const tag of render(state).match(/<[^>]*\brole="img"[^>]*>/g) ?? []) {
      const label = tag.match(/\baria-label="([^"]*)"/)?.[1] ?? '';
      assert.ok(unescape(label).length >= 40 || /aria-labelledby/.test(tag), tag.slice(0, 120));
    }
  }
});

test('B10 appears only after the answers of task 3 are checked, with its text version', () => {
  assert.doesNotMatch(elementById(html, 'a3'), /Person A: Wahrscheinlichkeit von 76,4 auf 92,4 Prozent/);
  const partly = render({ predictions: {}, answers: { a3a: '3' } });
  assert.doesNotMatch(elementById(partly, 'a3'), /aria-label="Person A: Wahrscheinlichkeit/, 'B10 waits while a question is open');
  const allA3: Record<string, string> = {};
  for (const q of QUESTIONS.a3) allA3[q.id] = q.kind === 'number' ? String(q.target) : q.options[0].value;
  const after = render({ predictions: {}, answers: allA3 });
  assert.match(elementById(after, 'a3'), /aria-label="Person A: Wahrscheinlichkeit von 76,4 auf 92,4 Prozent, plus 16,0 Prozentpunkte/);
});

test('feedback: special cases get their own hint, the prediction is quoted and resolved', () => {
  const a1answers: Record<string, string> = {};
  for (const q of QUESTIONS.a1) a1answers[q.id] = q.kind === 'number' ? String(q.target) : q.options[0].value;
  const page = render({ predictions: { a1: 'unter 40 %' }, answers: { ...a1answers, a1b: '0,94', a1d: '16,9', a1f: '83,76', a1g: 'mal' } });
  const a1 = textOf(elementById(page, 'a1'));
  assert.match(a1, /✗ Anteil, der wählen will: Das ist der Mittelwert als Anteil; gefragt ist Prozent, also 94\./);
  assert.match(a1, /✗ letzte Stufe: Das ist die erste Stufe aus der Vorlage\./);
  assert.match(a1, /✓ Chance bei „stimme voll zu“: Etwa 82/);
  assert.match(a1, /Deine Festlegung vorher war: unter 40 %\./);
  assert.match(a1, /Tatsächlich wollen 61,4 % derer, die Wählen gar nicht für eine Bürgerpflicht halten, trotzdem wählen\./);
  const a2 = textOf(elementById(render({ predictions: {}, answers: { a2c: 'wahrsch', a2b: '1,326' } }), 'a2'));
  assert.match(a2, /61,4 % × 3,8 wären 233 %/);
  assert.match(a2, /Das ist B, nicht Exp\(B\)\./);
  assert.doesNotMatch(a2, /Tatsächlich/, 'no resolution without a prediction');
  const k1c = textOf(elementById(render({ predictions: {}, answers: { 'k1c-frage': '400' } }), 'k1c'));
  assert.match(k1c, /Eine Chance ist kein Vielfaches einer Wahrscheinlichkeit\./);
});

test('workshops: start block copy-only, everything else runnable, four try-out workshops', () => {
  const textareas = [...html.matchAll(/<textarea[^>]*aria-label="R-Code: ([^"]*)"[^>]*>/g)].map(m => ({ title: unescape(m[1]), readOnly: /readOnly|readonly/.test(m[0]) }));
  assert.equal(textareas.find(x => x.title === 'Startblock')?.readOnly, true);
  for (const [k, t] of Object.entries(TEMPLATES).filter(([k, t]) => k !== 'start' && !t.tryOut)) {
    const hits = textareas.filter(x => x.title === t.title);
    assert.equal(hits.length, 1, k);
    assert.equal(hits[0].readOnly, false, k);
  }
  assert.equal(textareas.filter(x => x.title === 'Deine Probier-Werkstatt').length, 4);
});

test('read R: badges, the reading line and the four tools', () => {
  const r1 = textOf(elementById(html, 'r1'));
  assert.match(r1, /Startblock: kennst du aus Sitzung 1/);
  assert.match(r1, /Modell wie linear_regression\(\): kennst du aus Sitzung 9/);
  assert.match(r1, /Nagelkerke R2 = 0\.203, chi2\(1\) = 453\.95, p < 0\.001 \*\*\*, Accuracy = 91\.4%, N = 4813/);
  assert.match(r1, /Häufige Verwechslung: logistic_regression\(\) mit einer Variable, die mehr als zwei Werte hat/);
  const r2 = textOf(elementById(html, 'r2'));
  assert.match(r2, /exp\(\), tibble\(\), predict\(\), marginal_effects\(\): neu heute/);
  assert.match(r2, /\[1\] 0\.9268162/);
  assert.match(r2, /0\.9890025 0\.6698802/);
  assert.match(r2, /Factor rows show the average discrete change vs\. the reference level\./);
});

test('take-away: seven points, five self-test questions, the script download and the R workshop link', () => {
  const t = textOf(html);
  assert.equal([...(elementById(html, 'wichtig').match(/<li>/g) ?? [])].length, 7);
  assert.match(t, /5 Fragen/);
  assert.match(html, new RegExp(`download="${SCRIPT_FILE}"`));
  assert.match(t, /Nachlesen im R-Workshop, Kapitel 9\.8/);
});

test('predictions before every task with the options of the plan; the saved prediction is quoted', () => {
  for (const [k, p] of Object.entries(PREDICTIONS)) {
    const task = elementById(html, k);
    for (const o of p.options) assert.ok(task.includes(`value="${o}"`), `${k}: ${o}`);
  }
  const some = render({ predictions: { a2: 'etwa × 4' }, answers: { a2a: 'waehlen' } });
  assert.match(elementById(some, 'a2'), /Deine Festlegung vorher war: etwa × 4\./);
  assert.doesNotMatch(elementById(some, 'a2'), /Tatsächlich/, 'resolution waits while a question is open');
  const all: Record<string, string> = {};
  for (const q of QUESTIONS.a2) all[q.id] = q.kind === 'number' ? String(q.target) : q.options[0].value;
  const withAnswers = render({ predictions: { a2: 'etwa × 4' }, answers: all });
  assert.match(elementById(withAnswers, 'a2'), /Deine Festlegung vorher war: etwa × 4\./);
  assert.match(elementById(withAnswers, 'a2'), /Tatsächlich wird die Chance je Stufe mit 3,77 malgenommen/);
});

test('session11Status: open, running, done via the required questions of tasks 1 to 3', () => {
  assert.equal(session11Status(empty), 'open');
  assert.equal(session11Status({ predictions: {}, answers: { a4a: '95,1' } }), 'running');
  const right: Record<string, string> = {};
  for (const q of REQUIRED) right[q.id] = String(q.target);
  assert.equal(session11Status({ predictions: {}, answers: right }), 'done');
  assert.equal(session11Status({ predictions: {}, answers: { ...right, a3b: '0,76' } }), 'running');
});

test('session 11 is registered as a preview-only chapter', () => {
  const entry = chapterRegistry[11];
  assert.ok(entry);
  assert.equal(entry.live, false);
  assert.equal(entry.status, session11Status);
  assert.equal(entry.Component, Session11);
});

test('review findings: split wording, AME wording, du-form', () => {
  const t = textOf(html);
  assert.doesNotMatch(t, /Split-Hälfte|nur eine Hälfte|einer Hälfte der Befragten/);
  assert.match(t, /gut zwei Dritteln/);
  assert.match(t, /1\.596 haben TNZ: SPLIT/);
  assert.match(t, /Bring eine Antwort mit Begründung mit/);
  assert.doesNotMatch(t, /Bringt eine Antwort/);
});
