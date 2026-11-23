import { useEffect, useRef, type ReactNode, type SVGProps } from 'react';

/* ---------- Zahlen wie im Prototyp ---------- */

/** German number with fixed decimals and a real minus sign („−1,07“). */
export const de = (x: number, d = 1) =>
  x.toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d }).replace('-', '−');
/** Whole number with German thousands separator („5.164“). */
export const whole = (x: number) => Math.round(x).toLocaleString('de-DE');
/** Reads „19,3“, „19.3“, „19,3 %“, „5.164“ like the prototype; NaN when empty. */
export const parseNumber = (s: string) => {
  const t = s.replace(/\s|%/g, '').replace(/\.(?=\d{3}\b)/g, '').replace(',', '.');
  return t === '' ? NaN : Number(t);
};

/** Number of persons, mean and median of a frequency table (values with counts). */
export function stats(values: number[], counts: number[]) {
  const n = counts.reduce((a, b) => a + b, 0);
  const sum = values.reduce((s, v, i) => s + v * counts[i], 0);
  const at = (k: number) => {
    let c = 0;
    for (let i = 0; i < counts.length; i++) { c += counts[i]; if (c >= k) return values[i]; }
    return values[values.length - 1];
  };
  const median = n % 2 ? at((n + 1) / 2) : (at(n / 2) + at(n / 2 + 1)) / 2;
  return { n, mean: sum / n, median };
}

/* ---------- SVG ---------- */

/** SVG text with the prototype's defaults (Nunito 13, gray, centred). */
export function SvgText({ children, ...props }: SVGProps<SVGTextElement>) {
  return <text fontFamily="Nunito,sans-serif" fontSize={13} fill="#5F6A74" textAnchor="middle" {...props}>{children}</text>;
}

/**
 * Columns of a frequency table (port of `saeulen` in prototyp/sitzung4.html). Decorative: the SVG is aria-hidden,
 * every user supplies its own text version. With `stones` each column is a stack of stones; with `marker`
 * a triangle shows the mean and a dashed line the median. `children` are drawn on top (extra labels).
 */
export function Bars({ values, counts, w = 640, h = 200, right = 8, stones = 0, fill = '#86B9DE', stroke = '#5f97c2', highlight = -1, labels = true, marker = false, labelEvery = 1, minStone = false, label, children }: {
  values: number[];
  counts: number[];
  w?: number;
  h?: number;
  /** Free space right of the columns, e.g. for the NA stone. */
  right?: number;
  stones?: number;
  fill?: string;
  stroke?: string;
  highlight?: number;
  labels?: boolean;
  marker?: boolean;
  labelEvery?: number;
  /** Every column with at least one person gets at least one stone. */
  minStone?: boolean;
  label?: (v: number) => string;
  children?: ReactNode;
}) {
  const pad = { l: 8, r: right, t: marker ? 26 : 10, b: labels ? 24 : 6 };
  const iw = w - pad.l - pad.r, ih = h - pad.t - pad.b, bw = iw / counts.length, max = Math.max(...counts);
  const parts: ReactNode[] = [];
  counts.forEach((a, i) => {
    const x = pad.l + i * bw + bw * 0.12, bwi = bw * 0.76, col = i === highlight ? '#F0A27E' : fill;
    if (stones) {
      let n = Math.round(a / max * stones);
      if (minStone && a > 0) n = Math.max(1, n);
      const sh = ih / stones;
      for (let j = 0; j < n; j++) {
        parts.push(<rect key={`s${i}-${j}`} x={x} y={pad.t + ih - (j + 1) * sh + 1} width={bwi} height={sh - 2} rx={2.5} fill={col}
          stroke={i === highlight ? '#c97b55' : '#5f97c2'} strokeWidth={0.8} />);
      }
    } else {
      const bh = a / max * ih;
      if (bh > 0) parts.push(<rect key={`b${i}`} x={x} y={pad.t + ih - bh} width={bwi} height={bh} rx={3} fill={col} stroke={stroke} strokeWidth={1} />);
    }
    if (labels && i % labelEvery === 0) {
      parts.push(<SvgText key={`l${i}`} x={pad.l + i * bw + bw / 2} y={h - 6}>{label ? label(values[i]) : String(values[i]).replace('-', '−')}</SvgText>);
    }
  });
  let markers: ReactNode = null;
  if (marker) {
    const s = stats(values, counts);
    const xv = (v: number) => pad.l + (values.indexOf(Math.floor(v)) + (v - Math.floor(v)) + 0.5) * bw;
    const xm = xv(s.mean), xd = xv(s.median);
    markers = <>
      <line x1={xd} x2={xd} y1={pad.t - 4} y2={pad.t + ih} stroke="#8a4a2c" strokeWidth={2.5} strokeDasharray="4 3" />
      <path d={`M${xm - 7},${pad.t - 16} L${xm + 7},${pad.t - 16} L${xm},${pad.t - 4} Z`} fill="#2C6CA8" />
    </>;
  }
  return <svg viewBox={`0 0 ${w} ${h}`} width="100%" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet">
    {parts}
    <line x1={pad.l} x2={w - pad.r} y1={pad.t + ih} y2={pad.t + ih} stroke="#9aa4ad" strokeWidth={1.5} />
    {markers}
    {children}
  </svg>;
}

/* ---------- Fokus ---------- */

/**
 * Moves the focus after the next render, e.g. when the pressed button disappears (Spec §7).
 * `later(() => ref.current)` schedules it; the element must exist after the state change.
 */
export function useFocusLater() {
  const pending = useRef<(() => HTMLElement | null | undefined) | null>(null);
  useEffect(() => {
    const get = pending.current;
    if (!get) return;
    pending.current = null;
    get()?.focus();
  });
  return (get: () => HTMLElement | null | undefined) => { pending.current = get; };
}
