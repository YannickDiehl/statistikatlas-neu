import { useEffect, useRef, useState } from 'react';
import { EIGHT, EIGHT_LINE, SLOPES, SSE_BY_SLOPE, SSE_MAX } from '../content';
import { Axes, C, de, frame, LAGE_TICKS, Note, num, spread, T, Y10_TICKS } from './plot';

const F = frame(560, 400, { l: 56, r: 20, t: 26, b: 58 }, [0.5, 5.5], [0, 10]);
const { x: CX, y: CY } = EIGHT_LINE.centre;

/** Left edge of the square on a residual: right of the line, but left of it at Lage 5 (right margin is too narrow). */
export const squareX = (at: number, x: number, side: number) => (x >= 5 ? at - side - 1 : at + 1);

/** Sum of squared residuals of the line through (3 | 7) with slope b. */
export const sse = (b: number) => EIGHT.reduce((s, p) => s + (p.y - (CY + b * (p.x - CX))) ** 2, 0);

/** Feedback for a slope (sitzung09.md, B4). */
export function rotateFeedback(b: number): string {
  const s = num(sse(b));
  if (b === 0) return 'Steigung 0: Die Gerade zeigt allen den Mittelwert 7. Fehlerquadrate: 18. So gut kommt man ohne die Lage aus.';
  if (b === 1) return 'Steigung 1: Die Gerade aus R. Fehlerquadrate: 6. Keine andere Steigung kommt mit weniger aus. Genau das heißt kleinste Quadrate.';
  if (b === 2) return 'Steigung 2: Fehlerquadrate 18, genauso viel wie mit dem Mittelwert. Zu steil ist ebenso schlecht wie flach.';
  if ((b > 0 && b < 1) || (b > 1 && b < 2)) return `Steigung ${de(b, 2)}: Fehlerquadrate ${s}. Weniger als mit dem Mittelwert, aber mehr als 6. ${b < 1 ? 'Steiler' : 'Flacher'} wird es besser.`;
  return `Steigung ${de(b, 2)}: Fehlerquadrate ${s}, mehr als mit dem Mittelwert. Diese Gerade ist schlechter als gar keine.`;
}

/** Text version B4 (sitzung09.md). */
export const ROTATE_TEXT = 'Regler für die Steigung einer Geraden durch den Schwerpunkt 3 und 7. Zu jeder Steigung die Summe der Fehlerquadrate: Steigung 0 ergibt 18, Steigung 0,5 ergibt 9, Steigung 1 ergibt 6, Steigung 1,5 ergibt 9, Steigung 2 ergibt 18. Die kleinste Summe, 6, gibt es bei Steigung 1, der Geraden aus R.';

const valueText = (b: number) => `Steigung ${de(b, 2)}, Fehlerquadrate ${num(sse(b))}`;

/** The bar „Summe der Fehlerquadrate“ 0 to 54 with marks for the mean line (18) and, once seen, the best line (6). */
function SseBar({ value, best }: { value: number; best: boolean }) {
  const w = 300, l = 12, r = 12, iw = w - l - r, x = (v: number) => l + v / SSE_MAX * iw;
  return <svg viewBox={`0 0 ${w} 92`} width="100%" aria-hidden="true" focusable="false" className="s9-leiste">
    <T x={l} y={14} textAnchor="start" fill={C.ink} fontWeight={700}>Summe der Fehlerquadrate</T>
    <rect x={l} y={30} width={iw} height={18} rx={4} fill="#fff" stroke={C.grayLight} />
    <rect x={l} y={30} width={x(value) - l} height={18} rx={4} fill={C.orange} />
    <T x={Math.min(x(value) + 4, w - 4)} y={44} textAnchor={x(value) > w - 40 ? 'end' : 'start'} fill={C.ink} fontWeight={700}>{num(value)}</T>
    <line x1={x(18)} x2={x(18)} y1={24} y2={56} stroke={C.gray} strokeWidth={2.5} />
    <T x={x(18)} y={72} fontSize={13}>Mittelwert-Gerade: 18</T>
    {best ? <>
      <line x1={x(6)} x2={x(6)} y1={24} y2={56} stroke={C.green} strokeWidth={2.5} />
      <T x={x(6)} y={88} fontSize={13} fill={C.green} textAnchor="start">beste Gerade: 6</T>
    </> : null}
    <T x={l} y={66} textAnchor="start" fontSize={13}>0</T>
    <T x={w - r} y={66} textAnchor="end" fontSize={13}>54</T>
  </svg>;
}

/** Bild B4 „s9-regler“: rotate a line about the centre (3 | 7); residuals as orange squares and their sum as a bar. */
export function Rotate() {
  const [b, setB] = useState(0);
  const [seenBest, setSeenBest] = useState(false);
  const [feedback, setFeedback] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const change = (v: number) => {
    setB(v);
    if (v === 1) setSeenBest(true);
    clearTimeout(timer.current);
    setFeedback('');
    timer.current = setTimeout(() => setFeedback(rotateFeedback(v)), 400);
  };

  const a = CY - CX * b, best = b === 1;
  const pts = spread(EIGHT);
  return <div className="s9-bild">
    <div className="s9-regler-reihe">
      <svg viewBox={`0 0 ${F.w} ${F.h}`} width="100%" aria-hidden="true" focusable="false" className="s9-svg">
        <Note f={F}>zum Beispiel acht Befragte</Note>
        <Axes f={F} xTicks={LAGE_TICKS} yTicks={Y10_TICKS} xTitle="Eigene wirtschaftliche Lage" yTitle="Lebenszufriedenheit" />
        <defs><clipPath id="s9-regler-clip"><rect x={F.l} y={F.t} width={F.w - F.l - F.r} height={F.py(0) - F.t} /></clipPath></defs>
        <g clipPath="url(#s9-regler-clip)">
          {pts.map((p, i) => {
            const fit = a + b * p.x, side = Math.abs(p.y - fit) * F.ky;
            return <g key={i}>
              <rect x={squareX(F.px(p.at), p.x, side)} y={Math.min(F.py(p.y), F.py(fit))} width={side} height={side} fill={C.orange} fillOpacity={0.22} stroke={C.orange} strokeWidth={1} />
              <line x1={F.px(p.at)} x2={F.px(p.at)} y1={F.py(p.y)} y2={F.py(fit)} stroke={C.orange} strokeWidth={2.5} />
            </g>;
          })}
          <line x1={F.px(0.5)} x2={F.px(5.5)} y1={F.py(a + b * 0.5)} y2={F.py(a + b * 5.5)} stroke={best ? C.green : '#3d4650'} strokeWidth={3.5} strokeLinecap="round" />
        </g>
        {pts.map((p, i) => <circle key={i} cx={F.px(p.at)} cy={F.py(p.y)} r={8} fill={C.blue} stroke={C.blueDark} strokeWidth={1.5} />)}
        <circle cx={F.px(CX)} cy={F.py(CY)} r={4} fill={C.ink} />
      </svg>
      <div className="s9-regler-seite">
        <div className="feld">
          <label htmlFor="s9-steigung">Steigung</label>
          <input type="range" id="s9-steigung" min={-1} max={3} step={0.25} value={b} aria-valuetext={valueText(b)}
            onChange={e => change(Number(e.target.value))} />
          <output htmlFor="s9-steigung" aria-hidden="true">{de(b, 2)}</output>
        </div>
        <SseBar value={sse(b)} best={seenBest} />
        <div className="reihe-knoepfe">
          <button type="button" className="knopf hell" onClick={() => change(0)}>Mittelwert-Gerade (Steigung 0)</button>
          <button type="button" className="knopf hell" onClick={() => change(1)}>Gerade aus R</button>
        </div>
      </div>
    </div>
    <p className="sr-only">{ROTATE_TEXT}</p>
    <p className={`rueck${feedback ? (best ? ' ok' : ' fest') : ''}`} aria-live="polite">{feedback}</p>
    <details className="genauer">
      <summary>Alle Stellungen als Tabelle</summary>
      <table className="daten">
        <caption>Steigung und Summe der Fehlerquadrate</caption>
        <thead><tr><th scope="col">Steigung</th><th scope="col">Konstante</th><th scope="col">Fehlerquadrate</th></tr></thead>
        <tbody>{SLOPES.map((s, i) => <tr key={s}><td>{de(s, 2)}</td><td>{num(CY - CX * s)}</td><td>{num(SSE_BY_SLOPE[i])}</td></tr>)}</tbody>
      </table>
    </details>
  </div>;
}
