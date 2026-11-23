import test from 'node:test';
import assert from 'node:assert/strict';
import { sessions } from '../domain/curriculum';
import { activeChapter, chapterRegistry, type ChapterEntry } from './registry';
import { session4Status } from './s04/Session4';
import { chapterStorageKey } from './state';
import { renderSession } from '../tasks/testRender';

test('session 4 is registered as a preview-only chapter', () => {
  const entry = chapterRegistry[4];
  assert.ok(entry);
  assert.equal(entry.live, false);
  assert.equal(entry.status, session4Status);
});

test('without preview the old mission stays, with preview the chapter replaces terms and mission', () => {
  assert.match(renderSession(3), /Erst zeichnen, dann zeigen/);
  const html = renderSession(3, true, { tasks: {} }, true);
  assert.match(html, /Thema 1: Balken und Häufigkeiten/);
  assert.doesNotMatch(html, /AUFGABE · GRAFIKREDAKTION/);
  assert.doesNotMatch(html, /learning-terms|learning-mission/);
  assert.match(html, /learning-meta/);
  assert.match(html, /aria-label="Sitzung wechseln"/);
});

test('sessions without a chapter keep their normal layout in preview mode', (t) => {
  const index = sessions.findIndex(s => !chapterRegistry[s.id]);
  if (index < 0) { t.skip('every session has a chapter'); return; }
  assert.match(renderSession(index, true, { tasks: {} }, true), /learning-terms/);
});

test('rail status of session 4 in preview comes from the stored chapter state', () => {
  const store = (answers: Record<string, string>) => ({ getItem: (k: string) => k === chapterStorageKey ? JSON.stringify({ chapters: { 4: { predictions: {}, answers } } }) : null });
  const rail = (html: string) => html.match(/<span>4<\/span><strong>[^<]*<small>([^<]*)<\/small>/)?.[1];
  assert.equal(rail(renderSession(3, true, { tasks: {} }, true)), 'Aufgabe offen');
  const g = globalThis as { localStorage?: unknown };
  g.localStorage = store({ 'x': 'irgendwas' });
  try {
    assert.equal(rail(renderSession(3, true, { tasks: {} }, true)), 'Aufgabe läuft');
  } finally { delete g.localStorage; }
});

test('activeChapter: a preview-only chapter needs the preview, a live one shows for everyone', () => {
  const base = chapterRegistry[4] as ChapterEntry;
  const registry = { 4: { ...base, live: false }, 5: { ...base, live: true } };
  assert.equal(activeChapter(registry, 4, false), undefined);
  assert.equal(activeChapter(registry, 4, true), registry[4]);
  assert.equal(activeChapter(registry, 5, false), registry[5]);
  assert.equal(activeChapter(registry, 5, true), registry[5]);
  assert.equal(activeChapter(registry, 6, true), undefined);
});

test('a live chapter replaces the mission and sets the rail status without the preview', () => {
  const entry = chapterRegistry[4] as ChapterEntry;
  const was = entry.live;
  entry.live = true;
  try {
    const html = renderSession(3, true, { tasks: {} });
    assert.match(html, /Thema 1: Balken und Häufigkeiten/);
    assert.doesNotMatch(html, /learning-mission/);
    assert.equal(html.match(/<span>4<\/span><strong>[^<]*<small>([^<]*)<\/small>/)?.[1], 'Aufgabe offen');
  } finally { entry.live = was; }
});
