import { createContext, useContext } from 'react';
import { loadAllbusFile, type LoadedData } from '../sandbox/ui/DataDrop';
import { loadStoredAllbus, removeStoredAllbus } from '../sandbox/allbusStore';

export type AllbusState = {
  data: LoadedData | null;
  setData: (d: LoadedData) => void;
  /** Removes the stored file; afterwards `data` is null. */
  forget: () => Promise<void>;
  /** True when the browser could not keep the file (shown once as a note). */
  notStored: boolean;
  /** Reports whether the browser kept a file chosen inside a chapter (DataDrop's onStored). */
  markStored: (ok: boolean) => void;
  /**
   * True until the first attempt to restore the stored file has finished. Hosts of a file zone then show neither the
   * zone nor a „stored“ text, so nothing flickers or is announced twice. Optional for older test contexts: missing = false.
   */
  restoring?: boolean;
};

/** Longest wait for the initial restore; afterwards the file zones show even if IndexedDB never answers. */
export const RESTORE_LIMIT_MS = 5000;

/** Whether this browser offers IndexedDB at all (reading it can throw when site data is blocked). Without it nothing is restored. */
export function canRestore(): boolean {
  try { return typeof globalThis.indexedDB !== 'undefined' && globalThis.indexedDB !== null; } catch { return false; }
}

/** Reads the stored file; silently discards an entry that no longer fits. Never throws. */
export async function restoreAllbus(idb?: IDBFactory): Promise<LoadedData | null> {
  const stored = await loadStoredAllbus(idb);
  if (!stored) return null;
  try {
    return await loadAllbusFile({ name: stored.name, arrayBuffer: async () => stored.bytes });
  } catch {
    await removeStoredAllbus(idb);
    return null;
  }
}

export const AllbusContext = createContext<AllbusState>({
  data: null, setData: () => {}, forget: async () => {}, notStored: false, markStored: () => {}, restoring: false,
});
export const useAllbus = () => useContext(AllbusContext);
