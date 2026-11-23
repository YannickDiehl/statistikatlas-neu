import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { LS01, LS01_N } from '../content';
import { de, useFocusLater, whole } from './Bars';

const MAX = Math.max(...LS01);
/** Peak of the data (8) and the share answering 7 or more (76 %). */
const DATA_PEAK = LS01.indexOf(MAX);
const DATA_7UP = LS01.slice(7).reduce((a, b) => a + b, 0) / LS01_N * 100;

/** Feedback after revealing: the sketch's peak and share of 7 or more against the data. */
export function sketchFeedback(heights: number[]): string {
  const sum = heights.reduce((a, b) => a + b, 0);
  const top = Math.max(...heights);
  const peaks = heights.map((h, i) => (h === top ? i : -1)).filter(i => i >= 0);
  const mine7 = heights.slice(7).reduce((a, b) => a + b, 0) / sum * 100;
  const peak = peaks.length > 1 ? `Dein Gipfel ist breit: ${peaks.join(', ')}.` : `Dein Gipfel liegt bei ${peaks[0]}.`;
  return `${peak} In den Daten liegt er bei ${DATA_PEAK}. In deiner Skizze sagen ${de(mine7, 0)} % 7 oder mehr, in den Daten ${de(DATA_7UP, 0)} %.`;
}
const STEP: Record<string, number> = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1, PageUp: 3, PageDown: -3 };

/**
 * Grundlage 1a „Erst schätzen, dann schauen“: eleven columns to draw by pointer or keyboard (role slider),
 * then reveal the data. The sketch lives only in this component (not saved).
 */
export function Sketch() {
  const [heights, setHeights] = useState<number[]>(() => Array(11).fill(0));
  const [revealed, setRevealed] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const cols = useRef<(HTMLDivElement | null)[]>([]);
  const again = useRef<HTMLButtonElement>(null);
  const dragging = useRef(false);
  const focusLater = useFocusLater();

  const set = (i: number, v: number) => {
    if (revealed) return;
    setHeights(hs => hs.map((h, k) => (k === i ? Math.max(0, Math.min(10, v)) : h)));
  };

  const fromPointer = (e: PointerEvent) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    const i = Math.floor((e.clientX - r.left) / (r.width / 11));
    if (i < 0 || i > 10) return;
    set(i, Math.round((r.bottom - e.clientY) / r.height * 10));
  };

  const onKey = (i: number) => (e: KeyboardEvent) => {
    const d = STEP[e.key];
    if (d) { e.preventDefault(); set(i, heights[i] + d); }
    if (e.key === 'Home') { e.preventDefault(); set(i, 0); }
    if (e.key === 'End') { e.preventDefault(); set(i, 10); }
  };

  const sum = heights.reduce((a, b) => a + b, 0);

  function tip() {
    if (!sum) { setFeedback({ ok: false, text: 'Zieh zuerst mindestens eine Säule hoch. Es gibt kein Falsch, nur deine Erwartung.' }); return; }
    setFeedback({ ok: true, text: sketchFeedback(heights) });
    setRevealed(true);
    focusLater(() => again.current);
  }

  function reset() {
    setRevealed(false);
    setHeights(Array(11).fill(0));
    setFeedback(null);
    focusLater(() => cols.current[0]);
  }

  return <>
    <p className="hilfe-zeile" id="sk-anleitung">Zieh jede Säule auf die Höhe, die du erwartest. Mit der Tastatur: Säule mit Tab anwählen, dann Pfeil hoch oder runter. Am Ende zählt nur, wie hoch die Säulen im Vergleich zueinander sind.</p>
    <div className={revealed ? 'aufgedeckt' : undefined}>
      <div className="skizze" ref={box} role="group" aria-label="Deine Skizze: elf Säulen für die Antworten 0 bis 10" aria-describedby="sk-anleitung"
        onPointerDown={e => { if (revealed) return; dragging.current = true; box.current?.setPointerCapture?.(e.pointerId); fromPointer(e); }}
        onPointerMove={e => { if (dragging.current) fromPointer(e); }}
        onPointerUp={() => { dragging.current = false; }}
        onPointerCancel={() => { dragging.current = false; }}>
        {LS01.map((a, i) => <div key={i} className="sk-col" tabIndex={0} ref={el => { cols.current[i] = el; }}
          role="slider" aria-orientation="vertical" aria-label={`Säule für Antwort ${i}`}
          aria-valuemin={0} aria-valuemax={10} aria-valuenow={heights[i]} aria-valuetext={`Höhe ${heights[i]} von 10`}
          aria-readonly={revealed || undefined} onKeyDown={onKey(i)}>
          <div className="sk-ich" style={{ height: `${heights[i] * 10}%` }} />
          <div className="sk-echt" style={{ height: `${a / MAX * 100}%` }} />
        </div>)}
      </div>
      <div className="achse" aria-hidden="true">{LS01.map((_, i) => <span key={i}>{i}</span>)}</div>
      <div className="legende">
        <span><i className="leg-skizze" />deine Skizze</span>
        <span><i className="leg-daten" />die Daten (nach dem Aufdecken)</span>
      </div>
    </div>
    <div className="reihe-knoepfe">
      {revealed
        ? <button type="button" className="knopf hell" ref={again} onClick={reset}>Neu schätzen</button>
        : <button type="button" className="knopf" onClick={tip}>Tipp abgeben und aufdecken</button>}
    </div>
    <p className={`rueck${feedback ? (feedback.ok ? ' fest' : ' no') : ''}`} aria-live="polite">{feedback?.text}</p>
    {revealed ? <div>
      <div className="leseart"><p><b className="t">So liest du das:</b> Der höchste Balken steht bei <b>8</b>: Fast drei von zehn Befragten (29 %) antworten mit 8. Drei von vier antworten mit 7 oder mehr. Unter 5 bleibt nur etwa jede zwölfte Person. Die Antworten ballen sich rechts, nach links läuft die Verteilung flach aus.</p></div>
      <table className="daten">
        <caption>Deine Skizze und die Daten, als Anteile</caption>
        <thead><tr><th scope="col">Wert</th><th scope="col">deine Skizze</th><th scope="col">Daten</th><th scope="col">Befragte</th></tr></thead>
        <tbody>{LS01.map((a, i) => <tr key={i}><td>{i}</td><td>{`${de(heights[i] / sum * 100, 0)} %`}</td><td>{`${de(a / LS01_N * 100, 1)} %`}</td><td>{whole(a)}</td></tr>)}</tbody>
      </table>
    </div> : null}
  </>;
}
