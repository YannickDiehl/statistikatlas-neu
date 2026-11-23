import type { ReactNode } from 'react';
import { useChapterState } from '../../ChapterContext';
import { DH04, K1C_Q, K4_Q, LA01, STRIP_DH04_SOLVED, STRIP_DH04_TEXT, STRIP_LA01_SOLVED, STRIP_LA01_TEXT } from '../content';
import { C, HBracket, SvgText, de } from './util';

/** Blues from light to dark; white labels keep at least 4.5:1 on every shade. */
const BLUES = ['#3775AE', '#2F68A0', '#285B91', '#214E82', '#1A4072', '#133260'];

type Segment = { lines: string[]; pct: number };

const W = 760, L = 20, R = 20, IW = W - L - R;
const xOf = (p: number) => L + p / 100 * IW;

/** Cumulative right edges of the segments in percent. */
function edges(segs: Segment[]) {
  let at = 0;
  return segs.map(s => (at += s.pct));
}

/**
 * A strip from 0 to 100 % as a row of stones (Noppen on top), each segment as wide as its Valid %.
 * Labels inside in white; segments narrower than `narrow` px get their label above with a leader line.
 */
function StripBody({ segs, top, h, cumLabels, highlight }: {
  segs: Segment[]; top: number; h: number; cumLabels: string[]; highlight?: number;
}) {
  const ends = edges(segs);
  const parts: ReactNode[] = [];
  let lastLabelX = -Infinity, lift = 0;
  segs.forEach((s, i) => {
    const x0 = xOf(i ? ends[i - 1] : 0), x1 = xOf(ends[i]), w = x1 - x0, cx = (x0 + x1) / 2;
    const knobs = Math.max(1, Math.floor(w / 22));
    parts.push(<g key={`s${i}`}>
      {Array.from({ length: knobs }, (_, k) => <rect key={k} x={x0 + (k + 0.5) * w / knobs - 5} y={top - 5} width={10} height={5} rx={1.5} fill={BLUES[i]} />)}
      <rect x={x0 + 0.5} y={top} width={Math.max(1, w - 1)} height={h} rx={3} fill={BLUES[i]} stroke={i === highlight ? C.orange : '#fff'} strokeWidth={i === highlight ? 4 : 1} />
    </g>);
    if (w >= 60) {
      const n = s.lines.length + 1, y0 = top + h / 2 - (n - 1) * 7 + 4;
      parts.push(<g key={`t${i}`}>
        {s.lines.map((line, k) => <SvgText key={k} x={cx} y={y0 + k * 14} fill="#fff" fontSize={11.5} fontWeight={800}>{line}</SvgText>)}
        <SvgText x={cx} y={y0 + s.lines.length * 14} fill="#fff" fontSize={11.5}>{`${de(s.pct)} %`}</SvgText>
      </g>);
    } else {
      // Narrow segment: label below the strip with a leader line, alternating heights.
      const y = top + h + 18 + (i % 2) * 14;
      parts.push(<g key={`t${i}`}>
        <line x1={cx} x2={cx} y1={top + h} y2={y - 11} stroke={C.mute} strokeWidth={1} />
        <SvgText x={cx > W - 120 ? cx + 4 : cx} y={y} textAnchor={cx > W - 120 ? 'end' : 'middle'} fontSize={11} fill={C.ink} fontWeight={700}>{`${s.lines.join(' ')}: ${de(s.pct)} %`}</SvgText>
      </g>);
    }
    // Cum. % above the right edge; close labels go up a row.
    const ex = xOf(ends[i]);
    lift = ex - lastLabelX < 38 ? lift + 1 : 0;
    lastLabelX = ex;
    parts.push(<SvgText key={`c${i}`} x={Math.min(ex, W - 14)} y={top - 12 - lift * 13} fontSize={11} fill={C.ink}>{cumLabels[i]}</SvgText>);
  });
  return <>{parts}</>;
}

function Axis({ y }: { y: number }) {
  return <g>
    <line x1={xOf(0)} x2={xOf(100)} y1={y} y2={y} stroke="#9aa4ad" strokeWidth={1.2} />
    {[0, 25, 50, 75, 100].map(p => <g key={p}>
      <line x1={xOf(p)} x2={xOf(p)} y1={y} y2={y + 5} stroke="#9aa4ad" />
      <SvgText x={xOf(p)} y={y + 18} fontSize={11}>{`${p} %`}</SvgText>
    </g>)}
  </g>;
}

const LA01_SEGS: Segment[] = [
  { lines: ['TAEGLICH'], pct: LA01.rows[0].valid },
  { lines: ['MIND. 1X', 'PRO WOCHE'], pct: LA01.rows[1].valid },
  { lines: ['MIND. 1X', 'PRO MONAT'], pct: LA01.rows[2].valid },
  { lines: ['SELTENER'], pct: LA01.rows[3].valid },
  { lines: ['NIE'], pct: LA01.rows[4].valid },
];

/** Text version of B3 for the answered state. */
export const laStripText = (solved: boolean) => (solved ? `${STRIP_LA01_TEXT} ${STRIP_LA01_SOLVED}` : STRIP_LA01_TEXT);

/**
 * Bild B3: la01 as a strip from 0 to 100 %. Without marks until the question below is answered; then the 50 % line,
 * the median frame on „mindestens einmal pro Monat“ and the mode flag on „seltener“.
 */
export function BookStrip() {
  const { state } = useChapterState();
  const solved = (state.answers[K1C_Q.id] ?? '') !== '';
  const top = 58, h = 64;
  const ends = edges(LA01_SEGS);
  const cumLabels = LA01.rows.map(r => (r.cum === 100 ? '100' : de(r.cum)));
  const center = (i: number) => (xOf(i ? ends[i - 1] : 0) + xOf(ends[i])) / 2;
  return <>
  <div className="grafik" role="img" aria-label={laStripText(solved)}>
    <svg viewBox={`0 0 ${W} 200`} width="100%" aria-hidden="true" focusable="false">
      <StripBody segs={LA01_SEGS} top={top} h={h} cumLabels={cumLabels} highlight={solved ? 2 : undefined} />
      {solved ? <g>
        <line x1={xOf(50)} x2={xOf(50)} y1={top - 8} y2={top + h + 10} stroke={C.orangeDark} strokeWidth={2.5} strokeDasharray="5 4" />
        <SvgText x={xOf(50)} y={top + h + 24} fontSize={12} fill={C.orangeDark} fontWeight={800}>Mitte: 50 %</SvgText>
        <rect x={center(2) - 34} y={top + h + 30} width={68} height={20} rx={6} fill={C.orangeLight} stroke={C.orange} />
        <SvgText x={center(2)} y={top + h + 44} fontSize={12} fill={C.ink} fontWeight={800}>Median</SvgText>
        <path d={`M${center(3)},${top + h + 2} V${top + h + 50}`} stroke={C.ink} strokeWidth={1.5} />
        <path d={`M${center(3)},${top + h + 30} h40 l-8,10 l8,10 h-40 Z`} fill={C.yellow} stroke={C.yellowStroke} />
        <SvgText x={center(3) + 18} y={top + h + 44} fontSize={12} fill={C.ink} fontWeight={800}>Modus</SvgText>
      </g> : null}
      <Axis y={176} />
    </svg>
  </div>
  <p className="sr-only" aria-live="polite">{solved ? laStripText(true) : ''}</p>
  </>;
}

const DH04_SEGS: Segment[] = [
  { lines: ['1 Person'], pct: DH04.valid[0] },
  { lines: ['2'], pct: DH04.valid[1] },
  { lines: ['3'], pct: DH04.valid[2] },
  { lines: ['4'], pct: DH04.valid[3] },
  { lines: ['5'], pct: DH04.valid[4] },
  { lines: ['6 und mehr'], pct: DH04.sixPlus },
];

/** Text version of B11 for the answered state. */
export const dhStripText = (solved: boolean) => (solved ? `${STRIP_DH04_TEXT} ${STRIP_DH04_SOLVED}` : STRIP_DH04_TEXT);

/**
 * Bild B11: dh04 as a strip; the mean 2,34 sits on the edge between „2“ and „3“, the median line at 50 %.
 * After the question below is answered: brackets „höchstens 2 Personen“ and „über dem Mittelwert“.
 */
export function HouseholdStrip() {
  const { state } = useChapterState();
  const solved = (state.answers[K4_Q.id] ?? '') !== '';
  const top = 70, h = 60;
  const cumLabels = [...DH04.cum.map(c => de(c)), '100'];
  const atMean = DH04.cum[1];
  return <>
  <div className="grafik" role="img" aria-label={dhStripText(solved)}>
    <svg viewBox={`0 0 ${W} 300`} width="100%" aria-hidden="true" focusable="false">
      <StripBody segs={DH04_SEGS} top={top} h={h} cumLabels={cumLabels} />
      <line x1={xOf(50)} x2={xOf(50)} y1={top} y2={top + h + 62} stroke={C.orangeDark} strokeWidth={2.5} strokeDasharray="5 4" />
      <SvgText x={xOf(50) - 6} y={top + h + 74} textAnchor="end" fontSize={12} fill={C.orangeDark} fontWeight={800}>Median</SvgText>
      <path d={`M${xOf(atMean)},${top + h + 50} l-9,16 h18 Z`} fill={C.orange} stroke={C.orangeDark} />
      <SvgText x={xOf(atMean) + 14} y={top + h + 74} textAnchor="start" fontSize={12} fill={C.ink} fontWeight={800}>{`Mittelwert ${de(DH04.describe.mean)}`}</SvgText>
      {solved ? <g>
        <HBracket x1={xOf(0) + 2} x2={xOf(atMean) - 3} y={top + h + 126} color={C.mute} />
        <SvgText x={xOf(atMean / 2)} y={top + h + 144} fontSize={12.5} fill={C.ink} fontWeight={700}>{`höchstens 2 Personen: ${de(atMean)} %`}</SvgText>
        <HBracket x1={xOf(atMean) + 3} x2={xOf(100) - 2} y={top + h + 126} color={C.orangeDark} />
        <SvgText x={xOf((atMean + 100) / 2)} y={top + h + 144} fontSize={12.5} fill={C.orangeDark} fontWeight={800}>{`über dem Mittelwert: ${de(DH04.aboveMean)} %`}</SvgText>
      </g> : null}
      <Axis y={top + h + 90} />
    </svg>
  </div>
  <p className="sr-only" aria-live="polite">{solved ? dhStripText(true) : ''}</p>
  </>;
}
