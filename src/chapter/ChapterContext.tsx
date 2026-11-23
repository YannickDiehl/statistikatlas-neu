import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { chapterStorageKey, parseChapterStore, type ChapterState } from './state';

export type ChapterStorage = Pick<Storage, 'getItem' | 'setItem'>;

const emptyState = (): ChapterState => ({ predictions: {}, answers: {} });

function browserStorage(): ChapterStorage | undefined {
  try {
    return typeof localStorage === 'undefined' ? undefined : localStorage;
  } catch {
    return undefined;
  }
}

/** Reads one session's chapter state. Never throws; missing or broken storage gives an empty state. */
export function loadChapterState(sessionId: number, storage: ChapterStorage | undefined = browserStorage()): ChapterState {
  if (!storage) return emptyState();
  try {
    return parseChapterStore(storage.getItem(chapterStorageKey))[sessionId] ?? emptyState();
  } catch {
    return emptyState();
  }
}

/** Writes one session's chapter state and keeps the other sessions. Returns false when the browser refuses. */
export function saveChapterState(sessionId: number, state: ChapterState, storage: ChapterStorage | undefined = browserStorage()): boolean {
  if (!storage) return false;
  try {
    const chapters = { ...parseChapterStore(storage.getItem(chapterStorageKey)), [sessionId]: state };
    storage.setItem(chapterStorageKey, JSON.stringify({ chapters }));
    return true;
  } catch {
    return false;
  }
}

export type ChapterStateApi = {
  sessionId: number;
  state: ChapterState;
  setPrediction: (id: string, value: string) => void;
  /** Saves the answers of one „Antworten prüfen“. */
  setAnswers: (values: Record<string, string>) => void;
};

const ChapterStateContext = createContext<ChapterStateApi>({
  sessionId: 0, state: emptyState(), setPrediction: () => {}, setAnswers: () => {},
});

export const useChapterState = () => useContext(ChapterStateContext);

type ProviderProps = {
  sessionId: number;
  initial?: ChapterState;
  children?: ReactNode;
  /** Called after every change, e.g. to update the session status in the rail. */
  onChange?: (state: ChapterState) => void;
};

/**
 * Keeps predictions and answers of one session under `statistikatlas.kapitel.v1`.
 * `initial` replaces the stored state (tests, previews); without it the provider reads localStorage.
 * Keyed by session: another session remounts the provider and everything inside it, so no block keeps
 * the previous session's state, and the old state is never saved under the new id.
 */
export function ChapterStateProvider(props: ProviderProps) {
  return <SessionState key={props.sessionId} {...props} />;
}

function SessionState({ sessionId, initial, children, onChange }: ProviderProps) {
  const [state, setState] = useState<ChapterState>(() => initial ?? loadChapterState(sessionId));
  const changed = useRef(false);
  const onChangeRef = useRef(onChange);
  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);

  useEffect(() => {
    if (!changed.current) return;
    saveChapterState(sessionId, state);
    onChangeRef.current?.(state);
  }, [sessionId, state]);

  const update = useCallback((f: (s: ChapterState) => ChapterState) => {
    changed.current = true;
    setState(f);
  }, []);

  const api = useMemo<ChapterStateApi>(() => ({
    sessionId,
    state,
    setPrediction: (id, value) => update(s => ({ ...s, predictions: { ...s.predictions, [id]: value } })),
    setAnswers: values => update(s => ({ ...s, answers: { ...s.answers, ...values } })),
  }), [sessionId, state, update]);

  return <ChapterStateContext.Provider value={api}>{children}</ChapterStateContext.Provider>;
}
