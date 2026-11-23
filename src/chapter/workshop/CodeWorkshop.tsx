import { useEffect, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { DataDrop } from '../../sandbox/ui/DataDrop';
import { tokenizeR } from '../../tasks/kit/RCode';
import { useAllbus } from '../allbusContext';
import { withCode } from '../blocks/rich';
import { applyKey, parseMarks, type Edit } from './editor';
import { runR, START_ERROR, type Output } from './webr';

type Status = { kind: 'idle' | 'starting' | 'running' | 'done' | 'error'; text: string };
const KIND_LABEL = { warning: 'Warnung', message: 'Hinweis', error: 'Fehler' } as const;
let hasRun = false;

const isOffline = () => typeof location !== 'undefined' && location.protocol === 'file:';

/** Einfärbung wie im E-Book: Funktion grün, Text orange, Pipe und Plus braun, Zahlen lila, Kommentar grau. */
function colorLine(line: string): ReactNode[] {
  return tokenizeR(line).flatMap((t, i): ReactNode[] => {
    if (t.kind !== 'plain') return [<span key={i} className={`r-${t.kind}`}>{t.text}</span>];
    return t.text.split(/(\+)/).map((p, j) => (p === '+' ? <span key={`${i}-${j}`} className="r-op">+</span> : p));
  });
}

function Picture({ image, label }: { image: ImageBitmap; label: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    c.width = image.width;
    c.height = image.height;
    c.getContext('2d')?.drawImage(image, 0, 0);
  }, [image]);
  return <canvas ref={ref} role="img" aria-label={label} />;
}

export function CodeWorkshop({ id, title, template, tryOut, live, hint: noMarksHint }: {
  id: string; title: string; template: string; tryOut?: boolean; live?: boolean;
  /** Replaces „Hier ist nichts markiert: einfach ausführen und lesen.“ (e.g. a template that is broken on purpose); code in `backticks`. */
  hint?: string;
}) {
  const { code: original, marks } = useMemo(() => parseMarks(template), [template]);
  const { data, setData, markStored, restoring = false } = useAllbus();
  const [code, setCode] = useState(original);
  const [status, setStatus] = useState<Status>({ kind: 'idle', text: '' });
  const [output, setOutput] = useState<Output | null>(null);
  const [copied, setCopied] = useState('');
  const ta = useRef<HTMLTextAreaElement>(null);
  const runBtn = useRef<HTMLButtonElement>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [focusRun, setFocusRun] = useState(false);
  const back = useRef<HTMLPreElement>(null);
  const colors = useRef<HTMLPreElement>(null);
  const pending = useRef<{ start: number; end: number } | null>(null);
  const offline = isOffline();
  const busy = status.kind === 'starting' || status.kind === 'running';
  const canRun = !!live && !offline && !!data && !busy;
  const lines = code.split('\n');
  const edited = code !== original;

  useEffect(() => () => clearTimeout(copyTimer.current), []);
  useEffect(() => {
    if (focusRun && data) { runBtn.current?.focus(); setFocusRun(false); }
  }, [focusRun, data]);

  useLayoutEffect(() => {
    if (pending.current && ta.current) {
      ta.current.setSelectionRange(pending.current.start, pending.current.end);
      pending.current = null;
    }
  });

  /** Prefer the browser's own insertion so native undo keeps working; fall back to setting the value. */
  function put(e: Edit) {
    const t = ta.current;
    if (t && typeof document !== 'undefined' && typeof document.execCommand === 'function') {
      const old = t.value;
      let p = 0;
      while (p < old.length && p < e.text.length && old[p] === e.text[p]) p++;
      let q = 0;
      while (q < old.length - p && q < e.text.length - p && old[old.length - 1 - q] === e.text[e.text.length - 1 - q]) q++;
      const inserted = e.text.slice(p, e.text.length - q);
      try {
        t.focus();
        t.setSelectionRange(p, old.length - q);
        const ok = inserted ? document.execCommand('insertText', false, inserted) : document.execCommand('delete');
        if (ok && t.value === e.text) { t.setSelectionRange(e.start, e.end); return; }
      } catch { /* fall through */ }
    }
    pending.current = { start: e.start, end: e.end };
    setCode(e.text);
  }

  async function run() {
    if (!canRun || !data) return;
    setStatus(hasRun
      ? { kind: 'running', text: 'R rechnet …' }
      : { kind: 'starting', text: 'R startet … (beim ersten Mal etwa 20 Sekunden)' });
    try {
      const out = await runR(code, { name: data.fileName, bytes: data.bytes }, text => setStatus({ kind: 'starting', text }));
      hasRun = true;
      setOutput(out);
      const failed = out.messages.some(m => m.kind === 'error');
      setStatus({ kind: failed ? 'error' : 'done', text: failed ? 'R meldet einen Fehler. Prüfe die Schreibweise oder setze den Code zurück.' : 'Fertig.' });
    } catch (err) {
      setOutput(null);
      setStatus({ kind: 'error', text: err instanceof Error && err.message ? err.message : START_ERROR });
    }
  }

  function onKeyDown(ev: KeyboardEvent<HTMLTextAreaElement>) {
    if (ev.nativeEvent.isComposing) return;
    if ((ev.ctrlKey || ev.metaKey) && ev.key === 'Enter') {
      ev.preventDefault();
      void run();
      return;
    }
    if (!live) return;
    const key = ev.altKey && ev.code === 'Minus' ? '-' : ev.key;
    const t = ev.currentTarget;
    const next = applyKey(
      { text: t.value, start: t.selectionStart, end: t.selectionEnd },
      { key, ctrl: ev.ctrlKey, meta: ev.metaKey, shift: ev.shiftKey, alt: ev.altKey },
    );
    if (next) { ev.preventDefault(); put(next); }
  }

  function insert(text: string, back = 0) {
    const t = ta.current;
    if (!t || !live) return;
    t.focus();
    const a = t.selectionStart, b = t.selectionEnd;
    const cut = text.startsWith(' ') && (a === 0 || /\s/.test(t.value[a - 1])) ? text.slice(1) : text;
    const pos = a + cut.length - back;
    put({ text: t.value.slice(0, a) + cut + t.value.slice(b), start: pos, end: pos });
  }

  async function copy() {
    try { await navigator.clipboard.writeText(code); setCopied('Kopiert'); }
    catch { setCopied('Kopieren ging nicht. Markiere den Code und kopiere ihn von Hand.'); }
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(''), 2500);
  }

  const backLines = lines.map((line, i) => {
    const here = edited ? [] : marks.filter(m => m.line === i);
    if (!here.length) return line;
    const parts: ReactNode[] = [];
    let at = 0;
    here.forEach((m, k) => { parts.push(line.slice(at, m.from), <mark key={k}>{line.slice(m.from, m.to)}</mark>); at = m.to; });
    parts.push(line.slice(at));
    return parts;
  });

  const interactive = !!live && !offline;
  const liveText = !offline && data ? status.text : '';
  const quietText = offline ? 'Ausführen braucht eine Internetverbindung. Kopiere den Code nach RStudio.'
    : restoring && !data ? ''
    : !data ? 'Zum Ausführen braucht die Werkstatt einmal deine ALLBUS-Datei.'
    : status.text ? ''
    : <>Hier erscheint, was R ausgibt. Ändere den Code, wenn du magst, und drücke <span aria-hidden="true">▶</span> Ausführen.</>;
  const describedBy = [`${id}-st`, interactive ? `${id}-hw` : ''].filter(Boolean).join(' ');
  const hint = tryOut
    ? <p className="stellen-liste" id={`${id}-st`}>Probier-Werkstatt: Ändere den Vorschlag oder schreib ganz neu. Klammern und Anführungszeichen schließen sich wie in RStudio von allein.</p>
    : marks.length
    ? <><p className="stellen-liste" id={`${id}-lead`}>Zum Anpassen markiert:</p>
        <ul className="stellen-liste" id={`${id}-st`} aria-labelledby={`${id}-lead`}>{marks.map((m, i) => <li key={i}>Zeile {m.line + 1}: <code>{m.word}</code></li>)}</ul></>
    : interactive ? <p className="stellen-liste" id={`${id}-st`}>{noMarksHint ? withCode(noMarksHint) : 'Hier ist nichts markiert: einfach ausführen und lesen.'}</p>
    : <p className="stellen-liste sr-only" id={`${id}-st`}>Dieser Code ist zum Lesen und Kopieren.</p>;

  return <div className="workshop">
    <figure className="werkstatt" aria-labelledby={`${id}-t`}>
      <figcaption className="wk-kopf">
        <span className="wk-titel"><span className="wk-chip">Code-Werkstatt</span><span id={`${id}-t`}>{title}</span></span>
        <span className="tasten">
          {live && !offline ? <button type="button" className="run" ref={runBtn} aria-disabled={!canRun} onClick={() => void run()} aria-describedby={`${id}-t`}><span aria-hidden="true">▶</span> Ausführen</button> : null}
          {live && !offline ? <button type="button" onClick={() => { setCode(original); setStatus({ kind: 'idle', text: 'Vorlage wiederhergestellt.' }); ta.current?.focus(); }} aria-describedby={`${id}-t`}>Zurücksetzen</button> : null}
          <button type="button" onClick={() => void copy()} aria-describedby={`${id}-t`}>Kopieren</button>
        </span>
      </figcaption>
      <div className="wk-grid">
        <div>
          <div className={live ? 'wk-editor' : 'wk-editor wk-kurz'}>
            <div className="wk-nr" aria-hidden="true">{lines.map((_, i) => <span key={i}>{i + 1}</span>)}</div>
            <div className="wk-feld">
              <pre className="wk-back" aria-hidden="true" ref={back}>{backLines.map((l, i) => <span key={i}>{l}{'\n'}</span>)}</pre>
              <pre className="wk-farbe" aria-hidden="true" ref={colors}>{lines.map((l, i) => <span key={i}>{colorLine(l)}{'\n'}</span>)}</pre>
              <textarea
                ref={ta} value={code} rows={lines.length} wrap="off" readOnly={!live}
                spellCheck={false} autoCapitalize="off" autoComplete="off"
                aria-label={`R-Code: ${title}`} aria-describedby={describedBy}
                onChange={e => setCode(e.target.value)} onKeyDown={onKeyDown}
                onScroll={e => { const x = e.currentTarget.scrollLeft; if (back.current) back.current.scrollLeft = x; if (colors.current) colors.current.scrollLeft = x; }}
              />
            </div>
          </div>
          {live && !offline ? <div className="wk-leiste" role="group" aria-label="Einfügen">
            <span>Einfügen:</span>
            <button type="button" onClick={() => insert(' %>% ')}>%&gt;%</button>
            <button type="button" onClick={() => insert(' <- ')}>&lt;-</button>
            <button type="button" onClick={() => insert('""', 1)}>" "</button>
            <button type="button" onClick={() => insert('()', 1)}>( )</button>
          </div> : null}
        </div>
        {live ? <div className="wk-aus" role="region" aria-labelledby={`${id}-aus-h`}>
          <p className="label" id={`${id}-aus-h`}>Ausgabe</p>
          <div className="wk-status">
            {/* Idle hints are plain text: loading or restoring the file changes them in every workshop at once. */}
            {quietText ? <span className="wk-ruhe">{quietText}</span> : null}
            {/* Only what a run reports is announced. The region exists from the start, so its first text is read. */}
            <span className="wk-meldung" aria-live="polite">{liveText}</span>
            {status.kind === 'error' && !output && !offline && data ? <> <button type="button" onClick={() => { runBtn.current?.focus(); void run(); }}>Nochmal versuchen</button></> : null}
          </div>
          {!offline && !data && !restoring ? <DataDrop landmark={false} onLoaded={d => { setData(d); setFocusRun(true); }} onStored={markStored} /> : null}
          {output?.text ? <pre className="wk-text" tabIndex={0} aria-label="Ausgabe von R">{output.text}</pre> : null}
          {output?.messages.length ? <ul className="wk-meldungen">
            {output.messages.map((m, i) => <li key={i} className={m.kind} lang="en"><strong lang="de">{KIND_LABEL[m.kind]}:</strong> {m.text}</li>)}
          </ul> : null}
          {output?.images.length ? <div className="wk-bilder">
            {output.images.map((img, i) => <Picture key={i} image={img} label={output.images.length > 1 ? `Grafik ${i + 1} aus R` : 'Grafik aus R'} />)}
            <p className="wk-hinweis">Was die Grafik zeigt, steht auch in der Textfassung der Aufgabe.</p>
          </div> : null}
        </div> : null}
      </div>
    </figure>
    {hint}
    {interactive ? <ul className="wk-tasten" id={`${id}-hw`} aria-label="Tastenkürzel wie in RStudio">
      <li><kbd>Strg</kbd>/<kbd>Cmd</kbd> + <kbd>Enter</kbd> ausführen</li>
      <li><kbd>Strg</kbd>/<kbd>Cmd</kbd> + <kbd>Umschalt</kbd> + <kbd>M</kbd> Pipe <code>%&gt;%</code></li>
      <li><kbd>Alt</kbd> + <kbd>-</kbd> Pfeil <code>&lt;-</code></li>
      <li><kbd>Enter</kbd> nach <code>%&gt;%</code> oder <code>+</code> rückt ein</li>
      <li><kbd>Strg</kbd>/<kbd>Cmd</kbd> + <kbd>Umschalt</kbd> + <kbd>C</kbd> Kommentar an/aus</li>
    </ul> : null}
    <span className="sr-only" aria-live="polite">{copied}</span>
    {copied ? <span className="wk-kopiert" aria-hidden="true">{copied}</span> : null}
  </div>;
}
