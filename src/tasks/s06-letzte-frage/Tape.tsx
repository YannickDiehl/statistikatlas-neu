import { useEffect, useRef } from 'react';
import { de } from '../kit/numbers';
import { CAT_DARK, ROLE } from '../kit/palette';
import type { Tape } from './domain';

/** Ein Maßband von 0 bis 100 %: die eigene Spanne als markierte Strecke, die versprochene Quote als Strich,
 *  darunter (wenn freigegeben) das 95-%-Intervall aus R als zweite Strecke. */
const X0 = 24, X1 = 616, TOP = 34, H = 34;
const x = (v: number) => X0 + (Math.max(0, Math.min(100, v)) / 100) * (X1 - X0);
const labelX = (v: number, half = 125) => Math.max(X0 - 16 + half, Math.min(X1 + 16 - half, x(v)));
const p1 = (v: number) => de(v, 1).replace(/,0$/, '');

function Bracket({ lo, hi, y, color, dashed = false, up = false }: { lo: number; hi: number; y: number; color: string; dashed?: boolean; up?: boolean }) {
  const cap = up ? 6 : -6;
  return <g style={{ stroke: color }} strokeWidth={2} fill="none" strokeDasharray={dashed ? '5 3' : undefined}>
    <polyline points={`${x(lo)},${y + cap} ${x(lo)},${y} ${x(hi)},${y} ${x(hi)},${y + cap}`} />
  </g>;
}

export function SpanTape({ tape }: { tape: Tape }) {
  const { rate, low, high, ci } = tape;
  const span = low !== null && high !== null ? [Math.min(low, high), Math.max(low, high)] as const : null;
  const one = span ? null : low ?? high;
  const height = ci ? 130 : 100;
  // Auf dem Handy ist das Band breiter als der Bildschirm: Es rückt die eigene Quote (oder Spanne) in die Mitte.
  const scroller = useRef<HTMLDivElement>(null);
  const focus = rate ?? (span ? (span[0] + span[1]) / 2 : one);
  useEffect(() => {
    const el = scroller.current;
    if (!el || focus === null || el.scrollWidth <= el.clientWidth) return;
    el.scrollLeft = Math.max(0, (x(focus) / 640) * el.scrollWidth - el.clientWidth / 2);
  }, [focus]);
  const said = [
    span ? `deine Spanne von ${p1(span[0])} bis ${p1(span[1])} %` : '',
    rate !== null ? `versprochene Quote ${p1(rate)} %` : '',
    ci ? `95-%-Intervall aus R von ${p1(ci.lo)} bis ${p1(ci.hi)} %` : '',
  ].filter(Boolean).join(', ');
  return <figure style={{ margin: '12px 0' }}>
    {/* Auf dem Handy bleibt das Band lesbar breit und lässt sich seitlich schieben. */}
    <div ref={scroller} className="s04-scroll" style={{ overflowX: 'auto' }}>
      <svg viewBox={`0 0 640 ${height}`} width="100%" style={{ display: 'block', maxWidth: 760, minWidth: 520 }} role="img"
        aria-label={`Maßband von 0 bis 100 Prozent${said ? `: ${said}` : ' – noch leer'}.`}>
        {/* Band */}
        <rect x={X0 - 8} y={TOP} width={X1 - X0 + 16} height={H} rx={3} fill="#f6ecc2" stroke="#c8b46a" />
        {span && <rect x={x(span[0])} y={TOP} width={Math.max(2, x(span[1]) - x(span[0]))} height={H} style={{ fill: ROLE.guess }} opacity={0.3} />}
        {Array.from({ length: 101 }, (_, i) => <line key={i} x1={x(i)} x2={x(i)} y1={TOP} y2={TOP + (i % 10 === 0 ? 14 : i % 5 === 0 ? 9 : 5)} stroke="#6b5d2a" strokeWidth={i % 10 === 0 ? 1.4 : 0.8} />)}
        {Array.from({ length: 11 }, (_, k) => <text key={k} x={x(10 * k)} y={TOP + 28} textAnchor="middle" fontSize={14} fill="#4a4020" style={{ fontFamily: 'var(--sans)' }}>{10 * k}{k === 10 ? ' %' : ''}</text>)}
        {/* eigene Spanne */}
        {span && <>
          <Bracket lo={span[0]} hi={span[1]} y={TOP - 8} color={ROLE.guess} up />
          <text x={labelX((span[0] + span[1]) / 2)} y={TOP - 14} textAnchor="middle" fontSize={15} style={{ fill: ROLE.guess, fontFamily: 'var(--sans)', fontWeight: 600 }}>deine Spanne {p1(span[0])}–{p1(span[1])} %</text>
        </>}
        {one !== null && <line x1={x(one)} x2={x(one)} y1={TOP - 8} y2={TOP + H} style={{ stroke: ROLE.guess }} strokeWidth={2} strokeDasharray="3 2" />}
        {/* versprochene Quote */}
        {rate !== null && <>
          <line x1={x(rate)} x2={x(rate)} y1={TOP - 2} y2={TOP + H + 2} stroke="#242822" strokeWidth={3} />
          <polygon points={`${x(rate) - 6},${TOP + H + 10} ${x(rate) + 6},${TOP + H + 10} ${x(rate)},${TOP + H + 2}`} fill="#242822" />
          <text x={labelX(rate, 75)} y={TOP + H + 24} textAnchor="middle" fontSize={15} fill="#242822" style={{ fontFamily: 'var(--sans)', fontWeight: 600 }}>versprochen: {p1(rate)} %</text>
        </>}
        {/* 95-%-Intervall aus R */}
        {ci && <>
          <rect x={x(ci.lo)} y={TOP - 3} width={Math.max(2, x(ci.hi) - x(ci.lo))} height={H + 6} fill="none" style={{ stroke: CAT_DARK[1] }} strokeWidth={2} strokeDasharray="5 3" />
          <Bracket lo={ci.lo} hi={ci.hi} y={TOP + H + 34} color={CAT_DARK[1]} dashed />
          <text x={labelX((ci.lo + ci.hi) / 2)} y={TOP + H + 52} textAnchor="middle" fontSize={15} style={{ fill: CAT_DARK[1], fontFamily: 'var(--sans)', fontWeight: 600 }}>95-%-Intervall aus R: {p1(ci.lo)}–{p1(ci.hi)} %</text>
        </>}
      </svg>
    </div>
    <figcaption className="sandbox-note" style={{ marginTop: 4 }}>
      {said ? '' : 'Trag Quote und Spanne ein – das Maßband zeichnet mit. '}
      <strong style={{ color: ROLE.guess }}>Blau:</strong> deine Spanne{span ? ` (${p1(span[0])}–${p1(span[1])} %)` : ''}. <strong>Schwarzer Strich:</strong> die Quote, die du versprichst{rate !== null ? ` (${p1(rate)} %)` : ''}.{ci && <> <strong style={{ color: CAT_DARK[1] }}>Orange gestrichelt:</strong> das 95-%-Intervall aus R ({p1(ci.lo)}–{p1(ci.hi)} %).</>}
      <br />Ein 95-%-Konfidenzintervall ist eine Spanne um die Quote aus der Stichprobe. Würde man die Befragung sehr oft wiederholen, träfe eine so berechnete Spanne bei 95 von 100 Wiederholungen die wahre Online-Quote.
    </figcaption>
  </figure>;
}
