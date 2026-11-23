import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { IDBFactory } from 'fake-indexeddb';
import { fixtureBuffer } from '../sandbox/testData';
import { loadStoredAllbus, saveStoredAllbus } from '../sandbox/allbusStore';
import { DataDrop } from '../sandbox/ui/DataDrop';
import { restoreAllbus, AllbusContext } from './allbusContext';

test('restoreAllbus returns null and deletes an unreadable entry', async () => {
  const idb = new IDBFactory();
  await saveStoredAllbus({ name: 'kaputt.sav', bytes: new Uint8Array([1, 2, 3]).buffer }, idb);
  assert.equal(await restoreAllbus(idb), null);
  assert.equal(await loadStoredAllbus(idb), null);
});

test('restoreAllbus returns null when nothing is stored', async () => {
  assert.equal(await restoreAllbus(new IDBFactory()), null);
});

test('restoreAllbus reads a stored fixture file', async () => {
  const idb = new IDBFactory();
  await saveStoredAllbus({ name: 'ZA8831_v1-3-0.sav', bytes: fixtureBuffer() }, idb);
  const data = await restoreAllbus(idb);
  assert.ok(data);
  assert.equal(data.sav.nCases, 60);
  assert.ok(data.version.startsWith('v1.3.0'));
  assert.equal(data.fileName, 'ZA8831_v1-3-0.sav');
  assert.ok(data.bytes.byteLength > 0);
});

test('the file zone says the file stays in the browser', () => {
  const html = renderToStaticMarkup(createElement(DataDrop, { onLoaded: () => {} }));
  assert.match(html, /bleibt in deinem Browser gespeichert, bis du sie entfernst/);
  assert.match(html, /Hochgeladen wird nichts/);
  assert.doesNotMatch(html, /Nichts wird hochgeladen oder gespeichert/);
});

test('the file zone subtitle names the file with a comma, no middle dot', () => {
  const html = renderToStaticMarkup(createElement(DataDrop, { onLoaded: () => {} }));
  assert.match(html, /<span>ZA8831_v1-3-0\.sav, bleibt auf deinem Rechner<\/span>/);
  assert.doesNotMatch(html, /·/);
});

test('the file zone is a named region by default and a plain div with landmark={false}', () => {
  const region = renderToStaticMarkup(createElement(DataDrop, { onLoaded: () => {} }));
  assert.match(region, /^<section class="sandbox-drop-wrap" aria-labelledby="sandbox-drop-title-/);
  const plain = renderToStaticMarkup(createElement(DataDrop, { onLoaded: () => {}, landmark: false }));
  assert.match(plain, /^<div class="sandbox-drop-wrap">/);
  assert.doesNotMatch(plain, /<section|aria-labelledby/);
});

test('the default context offers a harmless markStored', () => {
  const calls: unknown[] = [];
  const probe = () => { const c = (AllbusContext as unknown as { _currentValue: { markStored: (ok: boolean) => void } })._currentValue; c.markStored(true); calls.push(1); return null; };
  renderToStaticMarkup(createElement(probe));
  assert.equal(calls.length, 1);
});

test('the file zone announces reading the file in a polite live region', () => {
  const html = renderToStaticMarkup(createElement(DataDrop, { onLoaded: () => {} }));
  assert.match(html, /<span class="sr-only" aria-live="polite"><\/span>/);
});

test('the default context is not restoring', () => {
  let seen: boolean | undefined;
  const probe = () => { seen = (AllbusContext as unknown as { _currentValue: { restoring?: boolean } })._currentValue.restoring; return null; };
  renderToStaticMarkup(createElement(probe));
  assert.equal(seen, false);
});

test('while LearningPath restores the stored file, chapter and mission show no file zone', async () => {
  const { renderSession } = await import('../tasks/testRender');
  const g = globalThis as { indexedDB?: unknown };
  const before = g.indexedDB;
  try {
    g.indexedDB = new IDBFactory();
    // Session 1 as a chapter (preview) and as a mission: no drop zone, no „stored“ line until the restore is over.
    const chapter = renderSession(0, false, { tasks: {} }, true);
    assert.doesNotMatch(chapter, /hierher ziehen/);
    assert.doesNotMatch(chapter, /Deine ALLBUS-Datei ist gespeichert/);
    assert.doesNotMatch(chapter, /braucht die Werkstatt einmal/);
    assert.doesNotMatch(renderSession(0, false), /hierher ziehen/);
  } finally {
    if (before === undefined) delete g.indexedDB; else g.indexedDB = before;
  }
  // Without IndexedDB nothing can be restored, so the zones show at once.
  assert.match(renderSession(0, false, { tasks: {} }, true), /hierher ziehen/);
});
