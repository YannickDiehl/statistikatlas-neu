import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ChapterLinksContext, MapLink } from './MapLink';
import { ChapterLayout } from './ChapterLayout';
import { Known } from './Card';
import { TakeAway } from './TakeAway';

const withLinks = (node: ReturnType<typeof h>, onConcept?: (id: string) => void) =>
  renderToStaticMarkup(h(ChapterLinksContext.Provider, { value: { onConcept } }, node));

test('MapLink: a button styled as link when the chapter can open the free map', () => {
  const html = withLinks(h(MapLink, { concept: 'median' }, 'Median'), () => {});
  assert.match(html, /<p class="hilfe-zeile" data-concept="median"><button type="button" class="karte-link">→ In der freien Karte: Median<\/button><\/p>/);
});

test('MapLink: plain text without onConcept or with an unknown concept id', () => {
  const none = renderToStaticMarkup(h(MapLink, { concept: 'median' }, 'Median'));
  assert.equal(none, '<p class="hilfe-zeile" data-concept="median">→ In der freien Karte: Median</p>');
  const unknown = withLinks(h(MapLink, { concept: 'gibt_es_nicht', className: 'x' }, 'Etwas'), () => {});
  assert.equal(unknown, '<p class="x" data-concept="gibt_es_nicht">→ In der freien Karte: Etwas</p>');
});

test('chapter.css styles the map link as a link', () => {
  const css = readFileSync(new URL('../chapter.css', import.meta.url), 'utf8');
  assert.match(css, /\.chapter \.karte-link\{[^}]*text-decoration:underline/);
});

test('LearningPath hands its onConcept to the chapters: map hints of sessions 3 and 10 become buttons', async () => {
  const { renderSession } = await import('../../tasks/testRender');
  const s3 = renderSession(2, true, { tasks: {} }, true);
  assert.match(s3, /<p class="s3-karte-link" data-concept="median"><button type="button" class="karte-link">→ In der freien Karte: Median<\/button>/);
  const s10 = renderSession(9, true, { tasks: {} }, true);
  assert.equal([...s10.matchAll(/class="s10-karte" data-concept="[a-z_]+"><button type="button" class="karte-link">/g)].length, 5);
});

const layout = (extra: Record<string, unknown> = {}) => renderToStaticMarkup(h(ChapterLayout, {
  session: 3, lead: 'Frage', goals: ['etwas können'], known: 'der Startblock (Sitzung 1).', jumps: [], toc: [], ...extra,
})).replace(/<!-- -->/g, '');

test('ChapterLayout: knownNote replaces the badge sentence, howToExtra adds lines; defaults unchanged', () => {
  const plain = layout();
  assert.match(plain, /Schon bekannt und hier nur kurz erinnert: der Startblock \(Sitzung 1\)\. Solche Stellen tragen ein graues Schild „kennst du aus Sitzung …“\.<\/p>/);
  assert.equal([...plain.matchAll(/<div><i aria-hidden="true">/g)].length, 4);
  const custom = layout({ knownNote: 'Solche Stellen tragen ein graues Schild, etwa „kennst du aus Methoden Ia“.', howToExtra: ['Eine Zeile mehr.', h('b', null, 'Noch eine.')] });
  assert.match(custom, /erinnert: der Startblock \(Sitzung 1\)\. Solche Stellen tragen ein graues Schild, etwa „kennst du aus Methoden Ia“\.<\/p>/);
  assert.doesNotMatch(custom, /„kennst du aus Sitzung …“/);
  assert.equal([...custom.matchAll(/<div><i aria-hidden="true">/g)].length, 6);
  assert.match(custom, /<span>Eine Zeile mehr\.<\/span><\/div><div><i aria-hidden="true">•<\/i><span><b>Noch eine\.<\/b><\/span><\/div><\/section>/);
});

test('Known: free label next to the session form', () => {
  assert.equal(renderToStaticMarkup(h(Known, { session: 1, what: 'Startblock' })), '<span class="wdh">Startblock: kennst du aus Sitzung 1</span>');
  assert.equal(renderToStaticMarkup(h(Known, { label: 'kennst du aus Methoden Ia', what: 'Median' })), '<span class="wdh">Median: kennst du aus Methoden Ia</span>');
  assert.equal(renderToStaticMarkup(h(Known, { label: 'kennst du aus Methoden Ia' })), '<span class="wdh">kennst du aus Methoden Ia</span>');
});

test('TakeAway: scriptNote replaces the script sentence', () => {
  const base = { points: ['a'], selfTest: [], script: '#', scriptName: 's.R' };
  assert.match(renderToStaticMarkup(h(TakeAway, base)), /<p>Alle Vorlagen dieser Sitzung in einer Datei, mit Kommentaren\. Öffne sie in RStudio und führe sie Block für Block aus\.<\/p>/);
  const html = renderToStaticMarkup(h(TakeAway, { ...base, scriptNote: 'Diesmal nur zum Lesen.' }));
  assert.match(html, /<p>Diesmal nur zum Lesen\.<\/p>/);
  assert.doesNotMatch(html, /Alle Vorlagen dieser Sitzung/);
});

test('ChoiceCheck lives in the blocks; the old path of session 4 re-exports it', async () => {
  const shared = await import('./ChoiceCheck');
  const old = await import('../s04/figures/ChoiceCheck');
  assert.equal(typeof shared.ChoiceCheck, 'function');
  assert.equal(old.ChoiceCheck, shared.ChoiceCheck);
});

test('Questions: special inputs and wrong options get their own feedback instead of the hint', async () => {
  const { Questions } = await import('./Questions');
  const { ChapterStateProvider } = await import('../ChapterContext');
  const qs = [
    { id: 'n1', label: 'Wie viele?', kind: 'number' as const, target: 37, right: 'Ja, 37.', hint: 'Schau auf Total missing.', specialInput: { '5': 'Das sind nur die Datenfehler.', 'NA': 'Gemeint ist die Zahl im NA-Balken.' } },
    { id: 'c1', label: 'Welche?', kind: 'choice' as const, options: [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }, { value: 'c', label: 'C' }], target: 'a', right: 'A.', hint: 'Lies die Achse.', wrongByOption: { b: 'B ist die Zeile darunter.' } },
  ];
  const html = (answers: Record<string, string>) => renderToStaticMarkup(h(ChapterStateProvider, { sessionId: 99, initial: { predictions: {}, answers } },
    h(Questions, { id: 'f', questions: qs }))).replace(/<!-- -->/g, '');
  const special = html({ n1: '5', c1: 'b' });
  assert.match(special, /✗ Wie viele\?: Das sind nur die Datenfehler\./);
  assert.match(special, /✗ Welche\?: B ist die Zeile darunter\./);
  const text = html({ n1: 'NA', c1: 'c' });
  assert.match(text, /✗ Wie viele\?: Gemeint ist die Zahl im NA-Balken\./);
  assert.match(text, /<input[^>]*id="f-n1"[^>]*aria-invalid="true"/);
  assert.match(text, /✗ Welche\?: Lies die Achse\./);
  const other = html({ n1: '12', c1: 'a' });
  assert.match(other, /✗ Wie viele\?: Schau auf Total missing\./);
  assert.match(other, /✓ Welche\?: A\./);
  assert.match(html({ n1: '37', c1: '' }), /✓ Wie viele\?: Ja, 37\./);
});

test('a session-local special array never counts as an input map', async () => {
  const { wrongFeedback } = await import('../answers');
  const q = { id: 'x', label: 'x', kind: 'number' as const, target: 2, right: 'r', hint: 'h', specialInput: [{ at: 1, text: 't' }] as unknown as Record<string, string> };
  assert.equal(wrongFeedback(q, '0'), undefined);
});
