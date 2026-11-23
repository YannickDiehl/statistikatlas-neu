import { useEffect, useRef, type ReactNode, type SVGProps } from 'react';

/** German number with fixed decimals and a real minus sign („−0,544“). */
export const de = (x: number, d = 1) =>
  x.toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d }).replace('-', '−');
/** Whole number with German thousands separator („5.246“). */
export const whole = (x: number) => Math.round(x).toLocaleString('de-DE');

/** SVG text with the chapter defaults (Nunito 13, gray, centred). */
export function SvgText({ children, ...props }: SVGProps<SVGTextElement>) {
  return <text fontFamily="Nunito,sans-serif" fontSize={13} fill="#5F6A74" textAnchor="middle" {...props}>{children}</text>;
}

/**
 * A static picture: the drawing is presentational, the accessible name is the full text version (`text`).
 * `caption` is shown below for everyone.
 */
export function Picture({ text, caption, className, children }: { text: string; caption?: ReactNode; className?: string; children?: ReactNode }) {
  if (!text.trim()) throw new Error('Picture: a text version is required.');
  return <figure className={`ebild s6-bild${className ? ` ${className}` : ''}`}>
    <div className="grafik" role="img" aria-label={text}>{children}</div>
    {caption ? <figcaption>{caption}</figcaption> : null}
  </figure>;
}

/** Moves the focus after the next render (e.g. to the feedback once a guess is locked). */
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

/** Toggle buttons (aria-pressed) for a small number of states. */
export function Toggle<T extends string | number>({ label, options, value, onChange }: {
  label: string; options: { value: T; label: string }[]; value: T; onChange: (v: T) => void;
}) {
  return <div className="s6-umschalter" role="group" aria-label={label}>
    {options.map(o => <button key={String(o.value)} type="button" className="knopf hell" aria-pressed={o.value === value} onClick={() => onChange(o.value)}>{o.label}</button>)}
  </div>;
}

export type RulerMark = { value: number; label: string; color: string; shape?: 'circle' | 'diamond'; row?: number };

/**
 * A horizontal ruler from `from` to `to` with tick labels and marks; decorative (the caller supplies the text version).
 * Marks may sit in rows above the line so that close values do not overlap.
 */
export function Ruler({ from, to, ticks, marks, bands, height = 120 }: {
  from: number; to: number; ticks: number[]; marks: RulerMark[];
  bands?: { from: number; to: number; label: string; fill: string; row?: number; start?: boolean }[];
  height?: number;
}) {
  const w = 540, l = 24, r = 24, below = bands?.some(b => b.row) ? 56 : bands ? 40 : 30, base = height - below;
  const x = (v: number) => l + (v - from) / (to - from) * (w - l - r);
  return <svg viewBox={`0 0 ${w} ${height}`} width="100%" aria-hidden="true" focusable="false">
    {bands?.map(b => <g key={b.label}>
      <rect x={x(b.from)} y={base - 14} width={x(b.to) - x(b.from)} height={14} fill={b.fill} />
      <SvgText x={b.start ? x(b.from) : (x(b.from) + x(b.to)) / 2} y={base + 34 + (b.row ?? 0) * 17} textAnchor={b.start ? 'start' : 'middle'} fontSize={13} fill="#1E2D3C" fontWeight={700}>{b.label}</SvgText>
    </g>)}
    <line x1={x(from)} x2={x(to)} y1={base} y2={base} stroke="#1E2D3C" strokeWidth={2} />
    {ticks.map(t => <g key={t}>
      <line x1={x(t)} x2={x(t)} y1={base - 6} y2={base + 6} stroke="#1E2D3C" strokeWidth={1.5} />
      <SvgText x={x(t)} y={base + 19} fontSize={13}>{de(t, Number.isInteger(t) ? 0 : 1)}</SvgText>
    </g>)}
    {marks.map((m, i) => {
      const cx = x(m.value), cy = base - 22 - (m.row ?? 0) * 28;
      return <g key={i}>
        <line x1={cx} x2={cx} y1={cy} y2={base} stroke={m.color} strokeWidth={1.5} strokeDasharray="3 2" />
        {m.shape === 'diamond'
          ? <path d={`M${cx},${cy - 7} L${cx + 7},${cy} L${cx},${cy + 7} L${cx - 7},${cy} Z`} fill={m.color} />
          : <circle cx={cx} cy={cy} r={6} fill={m.color} />}
        <SvgText x={cx} y={cy - 10} fontSize={13} fill="#1E2D3C" fontWeight={700} textAnchor={cx > w - 140 ? 'end' : cx < 140 ? 'start' : 'middle'}>{m.label}</SvgText>
      </g>;
    })}
  </svg>;
}
