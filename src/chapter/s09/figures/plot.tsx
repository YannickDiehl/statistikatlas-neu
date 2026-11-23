// Sitzung 9: gemeinsame Teile der Streudiagramme (Achsen, Maßstab, Farben, Zahlen in deutscher Schreibweise).
import type { ReactNode, SVGProps } from 'react';
import type { Point } from '../content';

/** Baukasten-Farben (wie chapter.css). */
export const C = {
  blue: '#86B9DE', blueDark: '#2C6CA8', green: '#2f7a4f', greenLight: '#8FCBA6', orange: '#F0A27E', orangeDark: '#c97b55',
  red: '#a0452f', gray: '#5F6A74', grayLight: '#9aa4ad', ink: '#1E2D3C', line: '#EFE6DA', yellow: '#EFC867',
};

/** German number with fixed decimals and a real minus sign („−1,07“). */
export const de = (x: number, d = 1) =>
  x.toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d }).replace('-', '−');
/** German number with up to `d` decimals („12,75“, „9“, „−0,25“). */
export const num = (x: number, d = 2) =>
  (Math.round(x * 10 ** d) / 10 ** d).toLocaleString('de-DE', { maximumFractionDigits: d }).replace('-', '−');

/** SVG text with the chapter's defaults (Nunito 13, gray, centred). */
export function T({ children, ...props }: SVGProps<SVGTextElement>) {
  return <text fontFamily="Nunito,sans-serif" fontSize={13} fill={C.gray} textAnchor="middle" {...props}>{children}</text>;
}

export type Frame = {
  w: number; h: number; l: number; r: number; t: number; b: number;
  x0: number; x1: number; y0: number; y1: number;
  px: (x: number) => number; py: (y: number) => number; ky: number;
};

/** A plot frame: pixel size, margins and data ranges; `ky` is pixels per unit on the y axis. */
export function frame(w: number, h: number, m: { l: number; r: number; t: number; b: number }, x: [number, number], y: [number, number]): Frame {
  const iw = w - m.l - m.r, ih = h - m.t - m.b;
  return {
    w, h, ...m, x0: x[0], x1: x[1], y0: y[0], y1: y[1],
    px: v => m.l + (v - x[0]) / (x[1] - x[0]) * iw,
    py: v => m.t + ih - (v - y[0]) / (y[1] - y[0]) * ih,
    ky: ih / (y[1] - y[0]),
  };
}

/** Axes with ticks and labels; `xTicks`/`yTicks` are [value, label] (empty label: tick only). */
export function Axes({ f, xTicks, yTicks, xTitle, yTitle, grid = true }: {
  f: Frame; xTicks: [number, string][]; yTicks: [number, string][]; xTitle: string; yTitle: string; grid?: boolean;
}) {
  const bottom = f.py(f.y0), left = f.px(f.x0);
  return <g>
    {grid ? yTicks.filter(([, s]) => s).map(([v]) => <line key={`g${v}`} x1={left} x2={f.px(f.x1)} y1={f.py(v)} y2={f.py(v)} stroke={C.line} strokeWidth={1} />) : null}
    <line x1={left} x2={f.px(f.x1)} y1={bottom} y2={bottom} stroke={C.grayLight} strokeWidth={1.5} />
    <line x1={left} x2={left} y1={f.py(f.y1)} y2={bottom} stroke={C.grayLight} strokeWidth={1.5} />
    {xTicks.map(([v, s]) => <g key={`x${v}`}>
      <line x1={f.px(v)} x2={f.px(v)} y1={bottom} y2={bottom + 5} stroke={C.grayLight} />
      {s ? <T x={f.px(v)} y={bottom + 20} fontSize={14}>{s}</T> : null}
    </g>)}
    {yTicks.map(([v, s]) => <g key={`y${v}`}>
      <line x1={left - 5} x2={left} y1={f.py(v)} y2={f.py(v)} stroke={C.grayLight} />
      {s ? <T x={left - 9} y={f.py(v) + 5} textAnchor="end" fontSize={14}>{s}</T> : null}
    </g>)}
    <T x={(left + f.px(f.x1)) / 2} y={f.h - 8} fill={C.ink} fontWeight={700} fontSize={15}>{xTitle}</T>
    <T x={16} y={(f.py(f.y1) + bottom) / 2} fill={C.ink} fontWeight={700} fontSize={15} transform={`rotate(-90 16 ${(f.py(f.y1) + bottom) / 2})`}>{yTitle}</T>
  </g>;
}

/** Line y = a + b·x between x = from and x = to. */
export function Line({ f, a, b, from, to, ...props }: { f: Frame; a: number; b: number; from: number; to: number } & SVGProps<SVGLineElement>) {
  return <line x1={f.px(from)} x2={f.px(to)} y1={f.py(a + b * from)} y2={f.py(a + b * to)} strokeLinecap="round" {...props} />;
}

/** Small diamond (mean of a stage). */
export function Diamond({ x, y, s = 7, ...props }: { x: number; y: number; s?: number } & SVGProps<SVGPathElement>) {
  return <path d={`M${x},${y - s} L${x + s},${y} L${x},${y + s} L${x - s},${y} Z`} fill={C.orange} stroke={C.orangeDark} strokeWidth={1.2} {...props} />;
}

/** Grey italic note „zum Beispiel …“ top left. */
export function Note({ f, children }: { f: Frame; children: ReactNode }) {
  return <T x={f.l + 4} y={f.t - 6} textAnchor="start" fontStyle="italic" fill="#6E7882" fontSize={14}>{children}</T>;
}

/** Points with the same x are moved slightly apart (± 0,06), so they never overlap. */
export function spread(points: Point[], dx = 0.06): { x: number; y: number; at: number }[] {
  return points.map(p => {
    const same = points.filter(q => q.x === p.x);
    if (same.length < 2) return { ...p, at: p.x };
    const k = same.indexOf(p);
    return { ...p, at: p.x + (k - (same.length - 1) / 2) * 2 * dx };
  });
}

/** Least squares line through points (for the small overview pictures). */
export function leastSquares(points: Point[]): { a: number; b: number } {
  const n = points.length, mx = points.reduce((s, p) => s + p.x, 0) / n, my = points.reduce((s, p) => s + p.y, 0) / n;
  const sxy = points.reduce((s, p) => s + (p.x - mx) * (p.y - my), 0), sxx = points.reduce((s, p) => s + (p.x - mx) ** 2, 0);
  const b = sxy / sxx;
  return { a: my - b * mx, b };
}

export const LAGE_TICKS: [number, string][] = [[1, '1 sehr schlecht'], [2, '2 schlecht'], [3, '3 teils/teils'], [4, '4 gut'], [5, '5 sehr gut']];
export const LAGE_TICKS_SHORT: [number, string][] = [[1, '1'], [2, '2'], [3, '3'], [4, '4'], [5, '5']];
export const Y10_TICKS: [number, string][] = Array.from({ length: 11 }, (_, i) => [i, i % 2 ? '' : String(i)]);
