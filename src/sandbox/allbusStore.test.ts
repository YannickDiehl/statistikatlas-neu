import test from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory } from 'fake-indexeddb';
import { loadStoredAllbus, removeStoredAllbus, saveStoredAllbus } from './allbusStore';

const file = () => ({ name: 'ZA8831_v1-3-0.sav', bytes: Uint8Array.of(1, 2, 3).buffer as ArrayBuffer });

test('saves, loads and removes the file', async () => {
  const idb = new IDBFactory();
  assert.equal(await saveStoredAllbus(file(), idb), true);
  const loaded = await loadStoredAllbus(idb);
  assert.equal(loaded?.name, 'ZA8831_v1-3-0.sav');
  assert.deepEqual([...new Uint8Array(loaded!.bytes)], [1, 2, 3]);
  await removeStoredAllbus(idb);
  assert.equal(await loadStoredAllbus(idb), null);
});

test('returns null and false without IndexedDB', async () => {
  const idb = undefined as any;
  assert.equal(await loadStoredAllbus(idb), null);
  assert.equal(await saveStoredAllbus(file(), idb), false);
  await removeStoredAllbus(idb);
});

test('a second save replaces the first', async () => {
  const idb = new IDBFactory();
  await saveStoredAllbus(file(), idb);
  await saveStoredAllbus({ name: 'neu.sav', bytes: Uint8Array.of(9).buffer as ArrayBuffer }, idb);
  const loaded = await loadStoredAllbus(idb);
  assert.equal(loaded?.name, 'neu.sav');
  assert.deepEqual([...new Uint8Array(loaded!.bytes)], [9]);
});

test('a throwing IndexedDB factory never rejects', async () => {
  const idb = { open() { throw new Error('SecurityError'); } } as unknown as IDBFactory;
  assert.equal(await loadStoredAllbus(idb), null);
  assert.equal(await saveStoredAllbus(file(), idb), false);
  await removeStoredAllbus(idb);
});

test('save resolves even if storage.persist() never settles', async () => {
  const desc = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
  Object.defineProperty(globalThis, 'navigator', {
    configurable: true,
    value: { storage: { persist: () => new Promise(() => {}) } },
  });
  try {
    const result = await Promise.race([
      saveStoredAllbus(file(), new IDBFactory()),
      new Promise(r => setTimeout(() => r('hung'), 1000)),
    ]);
    assert.equal(result, true);
  } finally {
    if (desc) Object.defineProperty(globalThis, 'navigator', desc);
    else delete (globalThis as any).navigator;
  }
});

test('save works when navigator is undefined', async () => {
  const desc = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: undefined });
  try {
    assert.equal(await saveStoredAllbus(file(), new IDBFactory()), true);
  } finally {
    if (desc) Object.defineProperty(globalThis, 'navigator', desc);
    else delete (globalThis as any).navigator;
  }
});
