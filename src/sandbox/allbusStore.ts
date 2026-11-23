// Keeps the person's own ALLBUS file in the browser (IndexedDB), never anywhere else.
export type StoredFile = { name: string; bytes: ArrayBuffer };

export const DB_NAME = 'statistikatlas';
export const STORE = 'dateien';
export const KEY = 'allbus';
const DB_VERSION = 1;

// Reading indexedDB can throw (SecurityError when site data is blocked).
function defaultIdb(): IDBFactory | undefined {
  try {
    return globalThis.indexedDB;
  } catch {
    return undefined;
  }
}

function open(idb: IDBFactory | undefined): Promise<IDBDatabase | null> {
  if (!idb) return Promise.resolve(null);
  return new Promise(resolve => {
    let settled = false;
    const finish = (db: IDBDatabase | null) => {
      if (settled) {
        try { db?.close(); } catch { /* ignore */ }
        return;
      }
      settled = true;
      resolve(db);
    };
    try {
      const req = idb.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE);
      };
      req.onsuccess = () => finish(req.result);
      req.onerror = () => finish(null);
      req.onblocked = () => finish(null);
    } catch {
      finish(null);
    }
  });
}

async function run<T>(
  idb: IDBFactory | undefined,
  mode: IDBTransactionMode,
  fallback: T,
  action: (store: IDBObjectStore) => IDBRequest,
): Promise<T> {
  const db = await open(idb);
  if (!db) return fallback;
  return new Promise<T>(resolve => {
    try {
      const tx = db.transaction(STORE, mode);
      const req = action(tx.objectStore(STORE));
      let result: unknown;
      req.onsuccess = () => { result = req.result; };
      tx.oncomplete = () => { db.close(); resolve(mode === 'readonly' ? ((result ?? fallback) as T) : (true as T)); };
      tx.onerror = tx.onabort = () => { db.close(); resolve(fallback); };
    } catch {
      try { db.close(); } catch { /* ignore */ }
      resolve(fallback);
    }
  });
}

export async function saveStoredAllbus(file: StoredFile, idb: IDBFactory | undefined = defaultIdb()): Promise<boolean> {
  const ok = await run<boolean>(idb, 'readwrite', false, store => store.put({ name: file.name, bytes: file.bytes }, KEY));
  if (ok) {
    // Fire and forget: Firefox may show a prompt and leave the promise pending.
    if (typeof navigator !== 'undefined') {
      void Promise.resolve().then(() => navigator.storage?.persist?.()).catch(() => {});
    }
  }
  return ok;
}

export async function loadStoredAllbus(idb: IDBFactory | undefined = defaultIdb()): Promise<StoredFile | null> {
  const value = await run<unknown>(idb, 'readonly', null, store => store.get(KEY));
  const v = value as Partial<StoredFile> | null;
  if (v && typeof v.name === 'string' && v.bytes instanceof ArrayBuffer) return { name: v.name, bytes: v.bytes };
  return null;
}

export async function removeStoredAllbus(idb: IDBFactory | undefined = defaultIdb()): Promise<void> {
  await run<boolean>(idb, 'readwrite', false, store => store.delete(KEY));
}
