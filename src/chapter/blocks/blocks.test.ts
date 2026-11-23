import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createElement as h, type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { Question } from '../answers';
import { chapterStorageKey, type ChapterState } from '../state';
import { ChapterStateProvider, loadChapterState, saveChapterState } from '../ChapterContext';
import { Companion } from '../companions/Companion';
import * as companions from '../companions';
import { ChapterLayout, Part } from './ChapterLayout';
import { TopicHeading, Foundation } from './Foundation';
import { Card, InShort, MoreDetail, Mixup, Known } from './Card';
import { TaskBlock, Steps, NoGraphic } from './TaskBlock';
import { Predict } from './Predict';
import { Questions } from './Questions';
import { Hints } from './Hints';
import { TryOut } from './TryOut';
import { TakeAway } from './TakeAway';
import { Figure } from './Figure';
import { withCode } from './rich';
import { prefixIds } from '../../../scripts/svg-to-ts.mjs';

const QUESTIONS: Question[] = [
  { id: 'a1a', label: 'Was steht unter dem Balken ganz rechts?', kind: 'choice', options: [{ value: 'schlecht', label: 'SCHLECHT' }, { value: 'na', label: 'NA' }], target: 'na', right: 'NA, Personen ohne gültige Antwort.', hint: 'Schau auf die Beschriftung ganz rechts.' },
  { id: 'a1b', label: 'Wie viele Personen stecken im NA-Balken?', short: 'Personen im NA-Balken', help: 'Tipp: `allbus %>% frequency(hs01)`, Zeile „Total missing“.', kind: 'number', target: 37, right: '37 (5 Datenfehler, 32 keine Angabe).', hint: 'In frequency(hs01) steht die Zahl in der Zeile „Total missing“.' },
  { id: 'a1c', label: 'Welche Zahl gehört nach n =?', kind: 'number', target: 5209, right: '5.209 gültige Antworten.', hint: 'Total valid.' },
];

const empty: ChapterState = { predictions: {}, answers: {} };

function chapter(state: ChapterState = empty, extra?: ReactNode) {
  return renderToStaticMarkup(h('article', null,
    h('h2', { id: 'learning-heading' }, 'Daten sehen'),
    h(ChapterStateProvider, { sessionId: 4, initial: state },
      h(ChapterLayout, {
        session: 4,
        lead: 'Welche Formen können Antworten haben?',
        route: [{ href: '#vorweg', title: 'Vorweg: R lesen', note: 'Startblock, Kette, Schichten' }, { href: '#thema1', title: 'Vier Themen', note: 'je erst die Grundlage, dann die Aufgabe' }, { href: '#mitnehmen', title: 'Zum Schluss', note: 'Wichtigstes, Selbsttest, Skript' }],
        goals: ['eine Verteilung lesen', 'eine Kette in R lesen'],
        known: 'der Startblock (Sitzung 1).',
        jumps: [{ href: '#a1', label: 'Aufgabe 1' }],
        toc: [
          { group: 'Vorweg', items: [{ href: '#r1', label: 'R lesen' }] },
          { group: 'Themen', items: [{ href: '#thema1', label: '1 Balken' }] },
          { group: 'Zum Schluss', items: [{ href: '#mitnehmen', label: 'Das Wichtigste' }, { href: '#selbsttest', label: 'Prüf dich selbst' }, { href: '#skript', label: 'Skript' }] },
        ],
      },
        h(Part, { id: 'vorweg', tone: 'yellow', title: 'Vorweg: R lesen' }),
        h(Card, { id: 'r1', stone: 'R', title: 'R lesen: Startblock, Zeile, Kette', tag: { kind: 'picture', label: 'Code lesen' }, badge: h(Known, { session: 1, what: 'Startblock' }) },
          h('p', null, 'Den Startblock kennst du.'),
          h(InShort, null, 'Eine Funktion sagt, was passiert.'),
          h(MoreDetail, { summary: 'Objekt, Funktion, Argument' }, h('p', null, 'Ein Objekt ist ein Name.')),
          h(Mixup, null, '= und <-.')),
        h(TopicHeading, { id: 'thema1', n: 1, title: 'Thema 1: Balken und Häufigkeiten' }),
        h(Foundation, { id: 'g1', n: 1, title: 'Balken und Häufigkeiten', intro: 'Drei kurze Schritte.', taskHref: '#a1' },
          h(Card, { id: 'v1', step: '1a', title: 'Erst schätzen, dann schauen', tag: { kind: 'estimate', label: 'Schätzen' }, companion: 'hinweis' },
            h(Figure, { svg: '<svg viewBox="0 0 10 10"><rect width="10" height="10"/></svg>', alt: 'Ein Quadrat als Beispielbild', caption: 'Ein Quadrat.' }))),
        h(TaskBlock, { id: 'a1', n: 1, title: 'Gesundheit zeigen', required: true, question: 'Wie beurteilen die Befragten ihre Gesundheit?', goal: 'Am Ende hast du eine beschriftete Grafik.', foundationHref: '#g1' },
          h(Predict, { id: 'a1f', prompt: 'Welche Antwort wird wohl am häufigsten gegeben?', options: ['sehr gut', 'gut'] }),
          h(Steps, null, h('li', null, 'Führe die erste Vorlage aus.')),
          h(TryOut, { idea: 'Wie schätzen Menschen ab 65 ihre Gesundheit ein?', workshop: h('p', null, 'Werkstatt') }),
          h(Questions, { id: 'a1-fragen', questions: QUESTIONS, predictionId: 'a1f' }),
          h(Hints, { steps: ['Denk an NA.', 'Führe frequency(hs01) aus.', '37 und 5.209.'] }),
          h(NoGraphic, null, 'frequency(hs01) zeigt dieselben Zahlen.')),
        h(TakeAway, {
          points: ['Eine Verteilung zeigt die Form.'],
          selfTest: [{ question: 'Wie heißt sie?', options: ['rechtsschief', 'linksschief'], answer: 1, why: 'Sie heißt nach der Seite, auf der sie ausläuft.' }],
          script: '# Sitzung 4\nallbus %>% frequency(hs01)\n',
          scriptName: 'sitzung-4.R',
        }),
        extra,
      ))));
}

test('headings in the chapter never skip a level (h2 from LearningPath, then h3, h4, h5)', () => {
  const levels = [...chapter().matchAll(/<h([1-6])[\s>]/g)].map(m => Number(m[1]));
  assert.equal(levels[0], 2);
  for (let i = 1; i < levels.length; i++) assert.ok(levels[i] <= levels[i - 1] + 1, `h${levels[i - 1]} → h${levels[i]} at ${i}`);
  for (const l of [3, 4, 5]) assert.ok(levels.includes(l), `h${l} used`);
  assert.ok(!levels.includes(1), 'no h1 inside the chapter');
});

test('every in-page link has a target', () => {
  const html = chapter();
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]));
  const hrefs = [...html.matchAll(/href="#([^"]*)"/g)].map(m => m[1]);
  assert.ok(hrefs.length >= 8);
  for (const x of hrefs) assert.ok(ids.has(x), `#${x} has no id`);
  const all = [...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(all.length, ids.size, 'ids are unique');
});

test('fixed texts follow the prototype', () => {
  const html = chapter().replace(/<!-- -->/g, '');
  assert.match(html, /So arbeitest du mit dieser Seite/);
  assert.match(html, /Was du nach dieser Sitzung kannst/);
  assert.match(html, /Schon bekannt und hier nur kurz erinnert: der Startblock/);
  assert.match(html, /Schon klar\? Direkt zu Aufgabe 1 ↓/);
  assert.match(html, /↑ Grundlage 1 nachlesen/);
  assert.match(html, /Startblock: kennst du aus Sitzung 1/);
  assert.match(html, /Kurz gesagt:/);
  assert.match(html, /<details class="genauer"><summary>Genauer erklärt: Objekt, Funktion, Argument<\/summary>/);
  assert.match(html, /Häufige Verwechslung:/);
  assert.match(html, /Auf dieser Seite/);
  assert.match(html, /<b>Ziel:<\/b> Am Ende hast du/);
  assert.match(html, /Pflicht/);
  assert.match(html, /Ohne Grafik lösbar:/);
  assert.match(html, /Das Wichtigste aus dieser Sitzung/);
  assert.match(html, /Prüf dich selbst/);
  assert.match(html, /Dein Skript zum Mitnehmen/);
});

test('step numbers are readable for screen readers', () => {
  const html = chapter();
  assert.match(html, /<h5 id="v1-h"><span class="g-schritt"><span class="sr-only">Schritt <\/span>1a<\/span>/);
});

test('saved wrong answers: aria-invalid on the field, feedback in aria-live', () => {
  const html = chapter({ predictions: { a1f: 'gut' }, answers: { a1a: 'schlecht', a1b: '40', a1c: '' } }).replace(/<!-- -->/g, '');
  assert.match(html, /<input[^>]*id="a1-fragen-a1b"[^>]*aria-invalid="true"|<input[^>]*aria-invalid="true"[^>]*id="a1-fragen-a1b"/);
  assert.match(html, /<fieldset[^>]*aria-invalid="true"/);
  assert.doesNotMatch(html, /<input[^>]*id="a1-fragen-a1c"[^>]*aria-invalid/);
  const live = html.match(/<div class="rueck[^"]*" aria-live="polite"[^>]*>([^]*?)<\/div><\/form>/);
  assert.ok(live, 'feedback container with aria-live');
  assert.match(live[1], /✗ Personen im NA-Balken: In frequency\(hs01\)/);
  assert.match(live[1], /• Welche Zahl gehört nach n =\?: noch offen\./);
  assert.match(live[1], /Deine Festlegung vorher war: gut\./);
  assert.doesNotMatch(live[1], /Alles richtig/);
});

test('saved right answers: no aria-invalid, “Alles richtig.”', () => {
  const html = chapter({ predictions: {}, answers: { a1a: 'na', a1b: '37 Personen', a1c: '5.209' } }).replace(/<!-- -->/g, '');
  assert.doesNotMatch(html, /aria-invalid="true"/);
  assert.match(html, /✓ Personen im NA-Balken: 37/);
  assert.match(html, /Alles richtig\./);
  assert.doesNotMatch(html, /Deine Festlegung/);
});

test('without saved answers there is no feedback yet, but the live region exists', () => {
  const html = chapter();
  assert.match(html, /<div class="rueck" aria-live="polite"[^>]*><\/div>/);
  assert.doesNotMatch(html, /[✓✗•] /);
  assert.match(html, /inputMode="decimal"|inputmode="decimal"/);
});

test('number questions have labels, choice questions a legend', () => {
  const html = chapter();
  assert.match(html, /<label for="a1-fragen-a1b">Wie viele Personen stecken im NA-Balken\?<\/label>/);
  assert.match(html, /<fieldset[^>]*><legend[^>]*>Was steht unter dem Balken ganz rechts\?<\/legend>/);
});

test('Predict: saved prediction shows the fixed text', () => {
  const html = chapter({ predictions: { a1f: 'gut' }, answers: {} }).replace(/<!-- -->/g, '');
  assert.match(html, /Festgelegt: gut\. Die Auflösung bekommst du, wenn du am Ende der Aufgabe deine Antworten prüfst\./);
  assert.match(html, /<b>Erst festlegen:<\/b> Welche Antwort wird wohl am häufigsten gegeben\?/);
  assert.doesNotMatch(chapter(), /Festgelegt:/);
});

test('TryOut is closed by default and says it is not needed for the task', () => {
  const html = chapter().replace(/<!-- -->/g, '');
  const d = html.match(/<details class="probier"[^>]*>/);
  assert.ok(d);
  assert.doesNotMatch(d[0], /\sopen/);
  assert.match(html, /Weiterdenken in der Probier-Werkstatt <small>\(für die Aufgabe nicht nötig\)<\/small>/);
  assert.match(html, /Für die Aufgabe reichen die Vorlagen oben\. Hier ist Platz für eigene Fragen\. Eine Idee: Wie schätzen Menschen ab 65 ihre Gesundheit ein\? Die Probier-Werkstatt startet mit einem Vorschlag\./);
});

test('Hints come in three levels', () => {
  const html = chapter();
  assert.match(html, /<summary>Hilfe, Stufe 1: Denkanstoß<\/summary>[^]*<summary>Hilfe, Stufe 2: Wo schaue ich\?<\/summary>[^]*<summary>Hilfe, Stufe 3: Lösung<\/summary>/);
});

test('Figure needs alt text', () => {
  const svg = '<svg viewBox="0 0 1 1"></svg>';
  assert.throws(() => renderToStaticMarkup(h(Figure, { svg, alt: '' })), /alt/);
  assert.throws(() => renderToStaticMarkup(h(Figure, { svg, alt: '   ' })), /alt/);
  const html = renderToStaticMarkup(h(Figure, { svg, alt: 'Ein leeres Bild', caption: 'Unterschrift' }));
  assert.match(html, /<figure class="ebild"><div class="ebild-bild" role="img" aria-label="Ein leeres Bild"><svg/);
  assert.match(html, /<figcaption>Unterschrift<\/figcaption>/);
});

test('TakeAway offers the script as a .R download and self-test questions', () => {
  const html = chapter().replace(/<!-- -->/g, '');
  const a = html.match(/<a[^>]*download="sitzung-4\.R"[^>]*>/);
  assert.ok(a);
  assert.match(a[0], /href="data:text\/plain;charset=utf-8,%23%20Sitzung%204%0Aallbus%20%25%3E%25%20frequency\(hs01\)%0A"/);
  assert.match(html, /Skript herunterladen \(sitzung-4\.R\)/);
  assert.match(html, /<legend>1\. Wie heißt sie\?<\/legend>/);
});

test('companions are decorative and come from the generated module', () => {
  for (const name of ['hallo', 'hinweis', 'tipp', 'uebung', 'denken'] as const) {
    const svg = companions[name];
    assert.equal(typeof svg, 'string');
    assert.match(svg, /^<svg[\s>]/);
    assert.doesNotMatch(svg, /<\?xml|<!--/);
  }
  const html = renderToStaticMarkup(h(Companion, { name: 'tipp' }));
  assert.match(html, /^<span class="begleiter" aria-hidden="true"><svg/);
});

test('chapter state is read from and written to statistikatlas.kapitel.v1', () => {
  const mem = new Map<string, string>();
  const storage = { getItem: (k: string) => mem.get(k) ?? null, setItem: (k: string, v: string) => { mem.set(k, v); } };
  mem.set(chapterStorageKey, JSON.stringify({ chapters: { 3: { predictions: {}, answers: { x: '1' } } } }));
  assert.deepEqual(loadChapterState(4, storage), empty);
  saveChapterState(4, { predictions: { a1f: 'gut' }, answers: { a1b: '37' } }, storage);
  const stored = JSON.parse(mem.get(chapterStorageKey)!);
  assert.deepEqual(stored.chapters['3'].answers, { x: '1' });
  assert.deepEqual(loadChapterState(4, storage), { predictions: { a1f: 'gut' }, answers: { a1b: '37' } });
  const broken = { getItem: () => { throw new Error('blocked'); }, setItem: () => { throw new Error('blocked'); } };
  assert.deepEqual(loadChapterState(4, broken), empty);
  assert.doesNotThrow(() => saveChapterState(4, empty, broken));
  assert.deepEqual(loadChapterState(4, undefined), empty);
});

test('chapter.css: scoped, narrow-screen rule, disabled run cue; fonts imported in main.tsx', () => {
  const css = readFileSync(new URL('../chapter.css', import.meta.url), 'utf8');
  assert.match(css, /\.workshop \.run\[aria-disabled="true"\]\{[^}]*opacity:\.55[^}]*cursor:not-allowed/);
  assert.match(css, /@media \(max-width:900px\)/);
  const selectors = css.replace(/\/\*[^]*?\*\//g, '').replace(/@media[^{]*\{/g, '').match(/(^|\})\s*([^{}@]+)\{/g) ?? [];
  for (const s of selectors) {
    const list = s.replace(/^\}?\s*/, '').replace(/\{$/, '').split(/,(?![^()]*\))/).map(x => x.trim()).filter(Boolean);
    for (const sel of list) assert.match(sel, /^(\.chapter(?![\w-])|\.workshop(?![\w-])|\.learning-path:has\(\.chapter\))/, `unscoped selector: ${sel}`);
  }
  const main = readFileSync(new URL('../../main.tsx', import.meta.url), 'utf8');
  for (const f of ['@fontsource/fredoka/500.css', '@fontsource/fredoka/600.css', '@fontsource/nunito/400.css', '@fontsource/nunito/400-italic.css', '@fontsource/nunito/800.css', '@fontsource/jetbrains-mono/400.css', '@fontsource/jetbrains-mono/600.css']) {
    assert.ok(main.includes(`'${f}'`), f);
  }
});

test('withCode turns `backtick` segments into <code>', () => {
  assert.equal(renderToStaticMarkup(h('p', null, withCode('Nach `n =` kommt `5.209`.'))), '<p>Nach <code>n =</code> kommt <code>5.209</code>.</p>');
  assert.equal(renderToStaticMarkup(h('p', null, withCode('ohne Code'))), '<p>ohne Code</p>');
  assert.equal(renderToStaticMarkup(h('p', null, withCode('ein ` allein'))), '<p>ein ` allein</p>');
});

test('Questions: help line under the field, code in label/help/feedback, aria-describedby', () => {
  const html = chapter({ predictions: {}, answers: { a1b: '40' } }).replace(/<!-- -->/g, '');
  assert.match(html, /<span class="hilfe-zeile" id="a1-fragen-a1b-hilfe">Tipp: <code>allbus %&gt;% frequency\(hs01\)<\/code>, Zeile „Total missing“\.<\/span>/);
  assert.match(html, /<input[^>]*id="a1-fragen-a1b"[^>]*aria-describedby="a1-fragen-a1b-hilfe a1-fragen-a1b-r"/);
  const fresh = chapter().replace(/<!-- -->/g, '');
  assert.match(fresh, /<input[^>]*id="a1-fragen-a1b"[^>]*aria-describedby="a1-fragen-a1b-hilfe"/);
  assert.doesNotMatch(fresh, /<input[^>]*id="a1-fragen-a1c"[^>]*aria-describedby/);
});

test('switching sessions remounts the chapter state and shows the new session’s answers', () => {
  const el = ChapterStateProvider({ sessionId: 4, children: null }) as { key: string | null };
  assert.equal(el.key, '4');
  const mem = new Map<string, string>([[chapterStorageKey, JSON.stringify({ chapters: {
    4: { predictions: {}, answers: { a1b: '40' } }, 5: { predictions: {}, answers: { a1b: '37' } },
  } })]]);
  const g = globalThis as { localStorage?: unknown };
  const before = g.localStorage;
  g.localStorage = { getItem: (k: string) => mem.get(k) ?? null, setItem: (k: string, v: string) => { mem.set(k, v); } };
  try {
    const at = (sessionId: number) => renderToStaticMarkup(h(ChapterStateProvider, { sessionId },
      h(Questions, { id: 'q', questions: QUESTIONS }))).replace(/<!-- -->/g, '');
    assert.match(at(4), /id="q-a1b"[^>]*value="40"|value="40"[^>]*id="q-a1b"/);
    assert.match(at(5), /id="q-a1b"[^>]*value="37"|value="37"[^>]*id="q-a1b"/);
    assert.match(at(5), /✓ Personen im NA-Balken/);
  } finally {
    g.localStorage = before;
  }
});

test('Predict as text field asks for a number', () => {
  const html = renderToStaticMarkup(h(Predict, { id: 'a3', prompt: 'Wie viele Minuten?' }));
  assert.match(html, /<input type="text" id="a3-f" inputMode="numeric"|inputmode="numeric"/);
});

test('TOC group names label their lists', () => {
  const html = chapter();
  const ids = [...html.matchAll(/<p class="grp" id="([^"]+)">/g)].map(m => m[1]);
  assert.equal(ids.length, 3);
  for (const id of ids) assert.match(html, new RegExp(`<ul aria-labelledby="${id}">`));
});

test('chapter.css: narrower rail at 1050px; option borders reach 3:1 on the lilac box', () => {
  const css = readFileSync(new URL('../chapter.css', import.meta.url), 'utf8');
  assert.match(css, /@media \(max-width:1050px\)\{\.learning-path:has\(\.chapter\)\{grid-template-columns:270px minmax\(0,1fr\)\}\}/);
  const rand = css.match(/--rand:(#[0-9A-Fa-f]{6})/)![1];
  const lilah = css.match(/--lilah:(#[0-9A-Fa-f]{6})/)![1];
  const lum = (hex: string) => {
    const c = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(v => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const ratio = (a: string, b: string) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  assert.ok(ratio(rand, lilah) >= 3, `--rand ${rand} on ${lilah}: ${ratio(rand, lilah).toFixed(2)}`);
  assert.ok(ratio(rand, '#FFFFFF') >= 3);
});

test('svg-to-ts prefixes ids and their references with the export name', () => {
  const svg = '<svg><defs><linearGradient id="g"/><marker id="pfeil"/></defs><rect fill="url(#g)" marker-end="url(#pfeil)"/><use href="#g"/><use xlink:href="#pfeil"/></svg>';
  assert.equal(prefixIds(svg, 'dropNa'),
    '<svg><defs><linearGradient id="dropNa-g"/><marker id="dropNa-pfeil"/></defs><rect fill="url(#dropNa-g)" marker-end="url(#dropNa-pfeil)"/><use href="#dropNa-g"/><use xlink:href="#dropNa-pfeil"/></svg>');
});
