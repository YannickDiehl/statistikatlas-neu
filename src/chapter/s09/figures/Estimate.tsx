import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { LAGE_CROSSTAB, LAGE_PREDICTIONS, LAGE_RISE, LAGE_STAGES } from '../content';
import { useAnnounce } from '../../blocks/announce';
import { Axes, C, de, Diamond, frame, LAGE_TICKS, T, Y10_TICKS } from './plot';

const F = frame(640, 420, { l: 56, r: 20, t: 22, b: 58 }, [0.5, 5.5], [0, 10]);
const MAX_N = Math.max(...LAGE_CROSSTAB.flat());
/** Radius = √N × Faktor; der größte Kreis (908) bekommt etwa 14 px. */
const radius = (n: number) => Math.sqrt(n) * 14 / Math.sqrt(MAX_N);
const clamp = (v: number) => Math.min(10, Math.max(0, Math.round(v * 10) / 10));
/** Mitte der echten Geraden bei „teils/teils“ (Stufe 3). */
const REAL_MID = LAGE_PREDICTIONS[2];

/** Feedback after comparing (sitzung09.md, B1): rise A = right − left against the real rise 4,29, and the height at stage 3. */
export function estimateFeedback(left: number, right: number): string {
  const a = Math.round((right - left) * 10) / 10;
  const real = de(LAGE_RISE, 1);
  let text: string;
  if (a <= 0) text = `Deine Gerade fällt oder bleibt flach, die echte steigt um ${real} Punkte von „sehr schlecht“ bis „sehr gut“. Wer seine Lage besser einschätzt, ist im Mittel zufriedener.`;
  else if (a < 3.79) text = `Deine Gerade steigt um ${de(a)} Punkte, die echte um ${real}. Du hast den Zusammenhang unterschätzt.`;
  else if (a <= 4.79) text = `Deine Gerade steigt um ${de(a)} Punkte, die echte um ${real}. Gut geschätzt.`;
  else text = `Deine Gerade steigt um ${de(a)} Punkte, die echte nur um ${real}. Du hast den Zusammenhang überschätzt. Das passiert oft: Das Auge folgt den großen Kreisen oben rechts.`;
  const mid = (left + right) / 2;
  if (Math.abs(mid - REAL_MID) > 0.5) {
    text += ` Insgesamt liegt deine Gerade zu ${mid > REAL_MID ? 'hoch' : 'tief'}: Bei „teils/teils“ zeigt sie ${de(mid, 2)}, die echte ${de(REAL_MID, 2)}.`;
  }
  return text;
}

/** Text version B1 (sitzung09.md). */
export const ESTIMATE_TEXT = 'Streudiagramm der Lebenszufriedenheit (0 bis 10) nach der eigenen wirtschaftlichen Lage (1 sehr schlecht bis 5 sehr gut), 5.133 Befragte, gewichtet. Die meisten liegen bei Lage „gut“ und Zufriedenheit 7 bis 9. Mittelwert der Lebenszufriedenheit je Stufe: sehr schlecht 4,38 (77 Befragte), schlecht 5,64 (435), teils/teils 6,81 (1.491), gut 7,91 (2.751), sehr gut 8,68 (378).';

/** Appended to the text version only after „Gerade festlegen und vergleichen“, as the line is drawn only then. */
export const ESTIMATE_LINE_TEXT = 'Die Gerade aus R steigt von 4,64 bei sehr schlechter Lage auf 8,94 bei sehr guter Lage.';

/** Number field → height of the line; empty or invalid input is ignored (null), not read as 0. */
export function parseHeight(s: string): number | null {
  const t = s.trim().replace(',', '.');
  if (t === '') return null;
  const v = Number(t);
  return Number.isFinite(v) ? v : null;
}

const STEP: Record<string, number> = { ArrowUp: 0.1, ArrowRight: 0.1, ArrowDown: -0.1, ArrowLeft: -0.1, PageUp: 1, PageDown: -1 };

/**
 * Bild B1 „s9-schaetzen“: bubbles from crosstab(ls01, lage), an own dashed line with two handles (pointer and keyboard,
 * role slider), two number fields; after „Gerade festlegen und vergleichen“ the line from R and the stage means.
 */
export function Estimate() {
  const [h, setH] = useState<[number, number]>([5, 5]);
  const [fixed, setFixed] = useState(false);
  const [feedback, announce] = useAnnounce('', '');
  const svg = useRef<SVGSVGElement>(null);
  const drag = useRef<number | null>(null);

  const set = (i: 0 | 1, v: number) => {
    if (fixed || !Number.isFinite(v)) return;
    setH(old => (i === 0 ? [clamp(v), old[1]] : [old[0], clamp(v)]));
  };

  const fromPointer = (e: PointerEvent) => {
    const i = drag.current, r = svg.current?.getBoundingClientRect();
    if (i === null || !r) return;
    const y = (e.clientY - r.top) / r.height * F.h;
    set(i as 0 | 1, (F.py(0) - y) / F.ky);
  };

  const onKey = (i: 0 | 1) => (e: KeyboardEvent) => {
    const d = STEP[e.key];
    if (d) { e.preventDefault(); set(i, h[i] + d); }
    if (e.key === 'Home') { e.preventDefault(); set(i, 0); }
    if (e.key === 'End') { e.preventDefault(); set(i, 10); }
  };

  function compare() {
    setFixed(true);
    announce(estimateFeedback(h[0], h[1]));
  }

  const where = ['sehr schlechter', 'sehr guter'];
  return <div className="s9-bild">
    <p className="hilfe-zeile" id="s9-schaetzen-anleitung">Zieh die beiden runden Griffe nach oben oder unten. Mit der Tastatur: Griff mit Tab anwählen, dann Pfeil hoch oder runter (0,1), Bild auf oder ab (1,0). Oder trag die Höhen unten ein.</p>
    <div role="group" aria-label="Streudiagramm Lebenszufriedenheit nach wirtschaftlicher Lage mit deiner Geraden" aria-describedby="s9-schaetzen-text s9-schaetzen-anleitung">
      <svg ref={svg} viewBox={`0 0 ${F.w} ${F.h}`} width="100%" className="s9-svg"
        onPointerMove={e => { if (drag.current !== null) fromPointer(e); }}
        onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }}>
        <g aria-hidden="true">
          <Axes f={F} xTicks={LAGE_TICKS} yTicks={Y10_TICKS} xTitle="Eigene wirtschaftliche Lage" yTitle="Lebenszufriedenheit" />
          {LAGE_CROSSTAB.flatMap((row, ls) => row.map((n, k) => n > 0
            ? <circle key={`${ls}-${k}`} cx={F.px(k + 1)} cy={F.py(ls)} r={radius(n)} fill={C.blue} fillOpacity={0.55} stroke={C.blueDark} strokeWidth={0.8} />
            : null))}
          {fixed ? <>
            <line x1={F.px(1)} x2={F.px(5)} y1={F.py(LAGE_PREDICTIONS[0])} y2={F.py(LAGE_PREDICTIONS[4])} stroke={C.green} strokeWidth={3.5} strokeLinecap="round" />
            <T x={F.px(4.95)} y={F.py(LAGE_PREDICTIONS[4]) - 16} textAnchor="end" fill={C.green} fontWeight={700}>Gerade aus R: 3,570 + 1,073 × Lage</T>
            {LAGE_STAGES.mean.map((m, i) => <Diamond key={i} x={F.px(i + 1)} y={F.py(m)} />)}
            <Diamond x={F.l + 14} y={F.t + 10} s={6} />
            <T x={F.l + 26} y={F.t + 14} textAnchor="start" fill={C.ink}>Mittelwert der Stufe</T>
          </> : null}
          <line x1={F.px(1)} x2={F.px(5)} y1={F.py(h[0])} y2={F.py(h[1])} stroke="#3d4650" strokeWidth={2.5} strokeDasharray="8 6" strokeLinecap="round" />
        </g>
        {([0, 1] as const).map(i => <circle key={i} cx={F.px(i ? 5 : 1)} cy={F.py(h[i])} r={11} className="s9-griff"
          fill="#fff" stroke="#3d4650" strokeWidth={3} tabIndex={fixed ? -1 : 0} role="slider"
          aria-label={`Griff: Höhe deiner Geraden bei ${where[i]} Lage`} aria-orientation="vertical"
          aria-valuemin={0} aria-valuemax={10} aria-valuenow={h[i]} aria-valuetext={`Deine Gerade bei ${where[i]} Lage: ${de(h[i])}`}
          aria-readonly={fixed || undefined} onKeyDown={onKey(i)}
          onPointerDown={e => { if (fixed) return; drag.current = i; svg.current?.setPointerCapture?.(e.pointerId); }} />)}
      </svg>
    </div>
    <p className="sr-only" id="s9-schaetzen-text">{fixed ? `${ESTIMATE_TEXT} ${ESTIMATE_LINE_TEXT}` : ESTIMATE_TEXT}</p>
    <div className="s9-felder">
      {([0, 1] as const).map(i => <div className="feld" key={i}>
        <label htmlFor={`s9-hoehe-${i}`}>{`Höhe deiner Geraden bei ${where[i]} Lage`}</label>
        <input type="number" id={`s9-hoehe-${i}`} min={0} max={10} step={0.1} value={h[i]} disabled={fixed}
          onChange={e => { const v = parseHeight(e.target.value); if (v !== null) set(i, v); }} />
      </div>)}
    </div>
    <div className="reihe-knoepfe">
      <button type="button" className="knopf" aria-disabled={fixed || undefined} onClick={() => { if (!fixed) compare(); }}>Gerade festlegen und vergleichen</button>
      {!fixed ? <button type="button" className="knopf hell" onClick={() => setH([5, 5])}>Neu schätzen</button> : null}
    </div>
    <p className={`rueck${feedback ? ' fest' : ''}`} aria-live="polite">{feedback}</p>
  </div>;
}
