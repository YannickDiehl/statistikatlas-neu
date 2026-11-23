import { ArrowLeft, ArrowRight, BookOpen, Check, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { activeChapter, chapterRegistry } from '../chapter/registry';
import { ChapterStateProvider } from '../chapter/ChapterContext';
import { ChapterLinksContext } from '../chapter/blocks/MapLink';
import { chapterStorageKey, parseChapterStore, type ChapterState } from '../chapter/state';
import { AllbusContext, canRestore, restoreAllbus, RESTORE_LIMIT_MS } from '../chapter/allbusContext';
import { sessions, workshopUrl, type Session, type Term } from '../domain/curriculum';
import type { LoadedData } from '../sandbox/ui/DataDrop';
import { removeStoredAllbus } from '../sandbox/allbusStore';
import { emptyTaskStore, parseTaskStore, taskStorageKey, type TaskStore } from '../tasks/kit/storage';
import { taskRegistry } from '../tasks/registry';
import { TaskHost } from '../tasks/TaskHost';

const STORAGE_WARNING = 'Dein Browser erlaubt keine lokale Speicherung. Deine Arbeit bleibt nur erhalten, solange dieser Tab offen ist.';
const TASK_TEXT = { open: 'Aufgabe offen', running: 'Aufgabe läuft', done: 'Aufgabe abgeschlossen' } as const;

export const FORGOTTEN_TEXT = 'Gespeicherte Datei entfernt.';

const focusHeading = () => requestAnimationFrame(() => document.getElementById('learning-heading')?.focus({ preventScroll: true }));

/** The rail button vanishes with the file: announce the removal and put focus on the session heading. */
export async function forgetStoredFile(forget: () => Promise<void>, announce: (text: string) => void) {
  await forget();
  announce(FORGOTTEN_TEXT);
  focusHeading();
}

function readStore(): { tasks: TaskStore; warning: string } {
  if (typeof localStorage === 'undefined') return { tasks: emptyTaskStore(), warning: '' };
  try {
    return { tasks: parseTaskStore(localStorage.getItem(taskStorageKey)), warning: '' };
  } catch {
    return { tasks: emptyTaskStore(), warning: STORAGE_WARNING };
  }
}

function readChapters(): Record<number, ChapterState> {
  try {
    return typeof localStorage === 'undefined' ? {} : parseChapterStore(localStorage.getItem(chapterStorageKey));
  } catch {
    return {};
  }
}

function sessionStatus(session: Session, tasks: TaskStore, preview: boolean, chapters: Record<number, ChapterState>): string {
  const chapter = activeChapter(chapterRegistry, session.id, preview);
  if (chapter) return TASK_TEXT[chapter.status(chapters[session.id] ?? { predictions: {}, answers: {} })];
  const def = session.task ? taskRegistry[session.task] : undefined;
  if (!def) return 'Aufgabe folgt';
  const raw = tasks.tasks[def.id];
  return TASK_TEXT[def.status(raw === undefined ? def.initial() : def.parse(raw))];
}

function Terms({ label, terms, onConcept }: { label: string; terms: Term[]; onConcept: (id: string) => void }) {
  if (!terms.length) return null;
  return <>
    <span className="learning-eyebrow">{label}</span>
    <ul className="learning-term-list">
      {terms.map(term => <li key={term.label}>{term.concept
        ? <button onClick={() => onConcept(term.concept!)}>{term.label}</button>
        : <span title="Steht im Sitzungsplan, fehlt der Karte noch">{term.label}</span>}</li>)}
    </ul>
  </>;
}

export function LearningPath({ onConcept, sessionIndex = 0, onSessionChange, initialData = null, initialTasks, preview = false }: {
  onConcept: (id: string) => void;
  sessionIndex?: number;
  onSessionChange: (index: number) => void;
  initialData?: LoadedData | null;
  initialTasks?: TaskStore;
  /** ?vorschau=kapitel: sessions with a chapter show it instead of terms and mission. */
  preview?: boolean;
}) {
  const [chapters, setChapters] = useState(readChapters);
  const [data, setData] = useState<LoadedData | null>(initialData);
  const dataRef = useRef(data);
  dataRef.current = data;
  const [stored, setStored] = useState(false);
  const [notStored, setNotStored] = useState(false);
  const [forgotten, setForgotten] = useState('');
  const [{ tasks: loadedTasks, warning: loadWarning }] = useState(readStore);
  const [tasks, setTasks] = useState<TaskStore>(initialTasks ?? loadedTasks);
  const [warning, setWarning] = useState(loadWarning);
  const index = Math.min(Math.max(sessionIndex, 0), sessions.length - 1);
  const session = sessions[index];

  /** True until the first restore attempt is over: file zones and „stored“ texts wait for it instead of flickering. */
  const [restoring, setRestoring] = useState(() => !initialData && canRestore());

  useEffect(() => {
    if (initialData) return;
    let alive = true;
    const done = () => { if (alive) setRestoring(false); };
    const limit = setTimeout(done, RESTORE_LIMIT_MS);
    void restoreAllbus().catch(() => null).then(restored => {
      if (!alive || !restored) return;
      if (dataRef.current) return; // the person already chose a file; onStored owns the flag
      setData(restored);
      setStored(true);
    }).finally(() => { clearTimeout(limit); done(); });
    return () => { alive = false; clearTimeout(limit); };
  }, [initialData]);

  const onStored = (ok: boolean) => { setStored(ok); setNotStored(!ok); if (ok) setForgotten(''); };
  const forget = async () => {
    await removeStoredAllbus();
    setStored(false);
    setNotStored(false);
    setData(null);
  };

  useEffect(() => {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(taskStorageKey, JSON.stringify(tasks));
    } catch {
      setWarning(STORAGE_WARNING);
    }
  }, [tasks]);

  const choose = (next: number) => {
    onSessionChange(next);
    focusHeading();
    document.getElementById('learning-main')?.scrollTo({ top: 0 });
  };
  const chapter = activeChapter(chapterRegistry, session.id, preview);
  const chapterLinks = useMemo(() => ({ onConcept }), [onConcept]);
  const taskDef = session.task ? taskRegistry[session.task] : undefined;

  return <AllbusContext.Provider value={{ data, setData, forget, notStored, markStored: onStored, restoring }}>
  <main className="learning-path" id="learning-main">
    <aside className="learning-rail">
      <a className="learning-brand" href="#learning-main">Statistikatlas<span>.</span></a>
      <span className="learning-eyebrow">LERNPFAD</span>
      <h1>Statistik als Entscheidungshilfe</h1>
      <nav aria-label="Sitzungen"><ol>
        {sessions.map((s, i) => {
          const status = sessionStatus(s, tasks, preview, chapters);
          const done = status === TASK_TEXT.done;
          return <li key={s.id} className={`${i === index ? 'current' : ''}${done ? ' done' : ''}`}>
            <button aria-current={i === index ? 'page' : undefined} onClick={() => choose(i)}>
              <span>{s.id}</span><strong>{s.title}<small>{status}</small></strong>
              {done && <Check size={16} aria-hidden="true" />}
            </button>
          </li>;
        })}
      </ol></nav>
      <a className="learning-source" href={workshopUrl} target="_blank" rel="noreferrer"><BookOpen size={16} aria-hidden="true" /> R-Workshop von Diehl und Moosdorf</a>
      {stored && <button className="learning-forget" onClick={() => void forgetStoredFile(forget, setForgotten)}><Trash2 size={16} aria-hidden="true" /> Gespeicherte ALLBUS-Datei entfernen</button>}
      <p className="learning-forget-status" role="status">{forgotten}</p>
    </aside>

    <article className="learning-lesson" aria-labelledby="learning-heading">
      <div className="learning-meta"><span>Sitzung {session.id}</span><span>{session.short}</span><span>{session.plan}</span></div>
      <h2 id="learning-heading" tabIndex={-1}>{session.title}</h2>
      {!chapter && <p className="learning-lead">{session.question}</p>}
      {warning && <p className="sandbox-warning" role="status">{warning}</p>}
      {notStored && <p className="sandbox-warning" role="status">Dein Browser speichert die Datei nicht. Nach dem Neuladen musst du sie erneut wählen.</p>}

      {chapter ? <ChapterStateProvider sessionId={session.id} onChange={state => setChapters(c => ({ ...c, [session.id]: state }))}><ChapterLinksContext.Provider value={chapterLinks}><chapter.Component /></ChapterLinksContext.Provider></ChapterStateProvider> : <>
      <section className="learning-terms" aria-label="Begriffe dieser Sitzung">
        <Terms label="WIEDERHOLUNG" terms={session.repetition} onConcept={onConcept} />
        <Terms label="NEU IN DIESER SITZUNG" terms={session.introduced} onConcept={onConcept} />
        <p className="learning-term-note">Begriffe öffnen die freie Karte. Gestrichelte stehen im Sitzungsplan und fehlen der Karte noch.</p>
      </section>

      <section className="sandbox learning-mission" aria-label="Aufgabe">
        {taskDef && <TaskHost key={taskDef.id} def={taskDef} data={data} raw={tasks.tasks[taskDef.id]}
          onRaw={next => setTasks(t => ({ tasks: { ...t.tasks, [taskDef.id]: next } }))} restoring={restoring} onData={setData} onStored={onStored} onReset={() => setData(null)} onConcept={onConcept} />}
        {!taskDef && <div className="learning-mission-soon">
          <span className="learning-eyebrow">AUFGABE FOLGT</span>
          <p>Für diese Sitzung entsteht eine eigene Aufgabe mit echten ALLBUS-Daten. Bis dahin: Begriffe oben in der Karte erkunden und im Seminar in R arbeiten.</p>
        </div>}
      </section>
      </>}

      <nav className="learning-pagination" aria-label="Sitzung wechseln">
        <button disabled={index === 0} onClick={() => choose(index - 1)}><ArrowLeft size={17} aria-hidden="true" /> {index > 0 ? `Sitzung ${sessions[index - 1].id}: ${sessions[index - 1].title}` : 'Anfang'}</button>
        <button disabled={index === sessions.length - 1} onClick={() => choose(index + 1)}>{index < sessions.length - 1 ? `Sitzung ${sessions[index + 1].id}: ${sessions[index + 1].title}` : 'Ende'} <ArrowRight size={17} aria-hidden="true" /></button>
      </nav>
    </article>
  </main>
  </AllbusContext.Provider>;
}
