import { useEffect, useRef, useState, type FormEvent } from 'react';
import { WEST_EAST } from '../content';
import { SvgText, de, parseNumber } from './Bars';

const WEST = WEST_EAST.ls01.west.mean, EAST = WEST_EAST.ls01.east.mean;
/** Highest start of the axis on the slider (just below the East mean). */
const MAX_START = 7.1;
/** Length ratio West to East in the picture when the axis starts at `start`. */
const ratioAt = (start: number) => (WEST - start) / (EAST - start);
/** From this start on (one decimal) the West bar looks twice as long: WEST − a = 2 (EAST − a). */
export const DOUBLE_FROM = Math.floor((2 * EAST - WEST) * 10) / 10;

/** Live text under the picture. */
export function axisText(start: number): string {
  return `Achse ab ${de(start, 1)}: Der West-Balken ist im Bild ${de(ratioAt(start), 2)}-mal so lang wie der Ost-Balken. Ab 0 wäre er ${de(ratioAt(0), 2)}-mal so lang.`;
}

/** Solution once the slider was let go at or above DOUBLE_FROM; quotes the guess if there was one. */
export function axisSolution(tip: number | null): string {
  return `Ab etwa ${de(DOUBLE_FROM, 1)} wirkt der West-Balken doppelt so lang wie der Ost-Balken${tip !== null ? ` (dein Tipp war ${de(tip, 1)})` : ''}. Dabei beträgt der Unterschied nur ${de(WEST - EAST, 2)} Punkte. Ab 0 ist der West-Balken ${de(ratioAt(0), 2)}-mal so lang, ab ${de(MAX_START, 1)} schon ${de(ratioAt(MAX_START), 2)}-mal: Die Achse versteckt die ${de(MAX_START, 1)} Punkte, die beide Gruppen gemeinsam haben.`;
}

function Axis({ start }: { start: number }) {
  const w = 660, h = 260, pad = { l: 60, t: 24, b: 34 }, ih = h - pad.t - pad.b, top = 8;
  const y = (v: number) => pad.t + ih - (v - start) / (top - start) * ih;
  const bars: [string, number, string, string, number][] = [['West', WEST, '#86B9DE', '#5f97c2', 150], ['Ost', EAST, '#F0A27E', '#c97b55', 330]];
  return <svg viewBox={`0 0 ${w} ${h}`} width="100%" aria-hidden="true" focusable="false">
    <defs>
      <pattern id="achse-versteckt" width={6} height={6} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width={3} height={6} fill="#c9ced3" />
      </pattern>
    </defs>
    {bars.map(([name, v, fill, stroke, x]) => <g key={name}>
      <rect x={x} y={y(v)} width={130} height={pad.t + ih - y(v)} rx={6} fill={fill} stroke={stroke} strokeWidth={1.5} />
      <SvgText x={x + 65} y={y(v) - 6} fill="#1E2D3C" fontWeight={800} fontSize={15}>{de(v, 2)}</SvgText>
      <SvgText x={x + 65} y={h - 10} fill="#1E2D3C" fontWeight={800} fontSize={14}>{name}</SvgText>
      {start > 0 ? <rect x={x} y={pad.t + ih + 2} width={130} height={8} rx={2} fill="url(#achse-versteckt)" /> : null}
    </g>)}
    <line x1={pad.l} x2={pad.l} y1={pad.t - 6} y2={pad.t + ih} stroke="#1E2D3C" strokeWidth={1.5} />
    <line x1={pad.l} x2={w - 20} y1={pad.t + ih} y2={pad.t + ih} stroke="#1E2D3C" strokeWidth={1.5} />
    <SvgText x={pad.l - 8} y={pad.t + ih + 4} textAnchor="end" fill="#1E2D3C" fontWeight={800}>{de(start, 1).replace(',0', '')}</SvgText>
    {/* Two lines right of the bars: on one line (as in the prototype) the label ran into „Ost“. */}
    {start > 0 ? <SvgText x={476} y={pad.t + ih + 16} fontSize={12} fill="#a0452f" fontWeight={700} textAnchor="start">
      <tspan x={476}>{`versteckt: die ersten ${de(start, 1)}`}</tspan>
      <tspan x={476} dy={14}>Punkte beider Balken</tspan>
    </SvgText> : null}
  </svg>;
}

/**
 * Grundlage 1c „Ehrlich zeigen“: first a guess, then a slider for the start of the axis. The text below the picture
 * gives the length ratio for every position; from DOUBLE_FROM (6,9) on (after letting go of the slider) the solution appears.
 */
export function AxisStart() {
  const [start, setStart] = useState(0);
  const [tip, setTip] = useState<number | null>(null);
  const [tipError, setTipError] = useState(false);
  const [draft, setDraft] = useState('');
  const [found, setFound] = useState<number | null | undefined>(undefined);
  const slider = useRef<HTMLInputElement>(null);
  const tipRef = useRef<number | null>(null);
  useEffect(() => { tipRef.current = tip; }, [tip]);

  // Like the prototype, the solution is checked on the native `change` (slider let go), not on every step while dragging.
  useEffect(() => {
    const el = slider.current;
    if (!el) return;
    const onChange = () => { if (Number(el.value) >= DOUBLE_FROM) setFound(f => (f === undefined ? tipRef.current : f)); };
    el.addEventListener('change', onChange);
    return () => el.removeEventListener('change', onChange);
  }, []);

  function submitTip(e: FormEvent) {
    e.preventDefault();
    const v = parseNumber(draft);
    if (Number.isNaN(v)) { setTipError(true); setTip(null); return; }
    setTipError(false);
    setTip(v);
  }

  return <>
    <form className="kurzueberlegen" id="v7-frage" noValidate onSubmit={submitTip}>
      <p>Kurz überlegen</p>
      <div className="feld">
        <label htmlFor="v7-in">Ab welchem Startwert der Achse wirkt der West-Balken doppelt so lang wie der Ost-Balken?</label>
        <input type="text" id="v7-in" inputMode="decimal" autoComplete="off" value={draft} onChange={e => setDraft(e.target.value)} aria-invalid={tipError || undefined} aria-describedby={tipError ? 'v7-frage-r' : undefined} />
        <button type="submit" className="knopf">Festlegen</button>
      </div>
      <p className={`rueck${tipError ? ' no' : tip !== null ? ' fest' : ''}`} id="v7-frage-r" aria-live="polite">
        {tipError ? 'Gib einen Startwert ein, zum Beispiel 5.'
          : tip !== null ? `Festgelegt: ${de(tip, 1)}. Schieb jetzt den Regler und such die Stelle, an der der West-Balken doppelt so lang wirkt.` : ''}
      </p>
    </form>
    <div className="feld">
      <label htmlFor="achse">Achse beginnt bei</label>
      <input type="range" id="achse" ref={slider} min={0} max={MAX_START} step={0.1} value={start} aria-valuetext={de(start, 1)}
        onChange={e => setStart(Number(e.target.value))} />
      {/* The live text below already announces the start; the output (implicit status role) stays silent. */}
      <output htmlFor="achse" aria-live="off">{de(start, 1)}</output>
    </div>
    <div className="grafik"><Axis start={start} /></div>
    <p className="rueck text" aria-live="polite">{axisText(start)}</p>
    <div className="v7-loesung" aria-live="polite">
      {found !== undefined ? <div className="leseart"><p><b className="t">Gefunden:</b> {axisSolution(found)}</p></div> : null}
    </div>
  </>;
}
