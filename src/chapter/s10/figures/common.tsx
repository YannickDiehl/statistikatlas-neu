// Sitzung 10: small helpers for the figures (German numbers, SVG text, switches with aria-pressed, colours of the Baukasten).
import type { ReactNode, SVGProps } from 'react';

/** German number with fixed decimals and a real minus sign („−0,653“). */
export const de = (x: number, d = 3) => x.toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d }).replace('-', '−');
/** Like `de`, with a plus sign for positive numbers („+0,653“). */
export const signed = (x: number, d = 3) => (x > 0 ? `+${de(x, d)}` : de(x, d));

export const C = {
  ink: '#1E2D3C', mute: '#5F6A74', line: '#C9CED3', gray: '#9AA3AB', paper: '#F7F5F0',
  blue: '#86B9DE', blueD: '#2C6CA8', blueL: '#C9E1F2',
  green: '#8FCBA6', greenD: '#2f7a4f',
  red: '#E8A595', redD: '#a0452f',
  orange: '#F0A27E', orangeD: '#c25e2e',
  teal: '#2a9d8f',
};

/** SVG text with the chapter defaults (Nunito 14.5, centred). */
export function T({ children, ...props }: SVGProps<SVGTextElement>) {
  return <text fontFamily="Nunito,sans-serif" fontSize={14.5} fill={C.mute} textAnchor="middle" {...props}>{children}</text>;
}

/** A row of switches (`aria-pressed`); `disabled` keeps them focusable but inactive (aria-disabled). */
export function Switches<V extends string>({ label, options, value, onChange, disabled }: {
  label: string;
  options: { value: V; label: string }[];
  value: V | null;
  onChange: (v: V) => void;
  disabled?: boolean;
}) {
  return <div className="s10-schalter" role="group" aria-label={label}>
    {options.map(o => <button key={o.value} type="button" aria-pressed={value === o.value} aria-disabled={disabled || undefined}
      onClick={() => { if (!disabled) onChange(o.value); }}>{o.label}</button>)}
  </div>;
}

/** A picture: `role="img"` with a short name that points to the text version; the SVG inside is decorative. */
export function Picture({ label, children, className = 'grafik' }: { label: string; children?: ReactNode; className?: string }) {
  return <div className={className} role="img" aria-label={label}>{children}</div>;
}

/** Text version under a picture; `live` when it changes with a switch. */
export function TextVersion({ id, live, children }: { id?: string; live?: boolean; children?: ReactNode }) {
  return <p className="rueck text s10-text" id={id} aria-live={live ? 'polite' : undefined}>{children}</p>;
}

/** Marker shapes so that lines differ not only by colour. */
export function Marker({ shape, x, y, fill, stroke, r = 6 }: { shape: 'circle' | 'square' | 'triangle'; x: number; y: number; fill: string; stroke: string; r?: number }) {
  if (shape === 'square') return <rect x={x - r} y={y - r} width={2 * r} height={2 * r} fill={fill} stroke={stroke} strokeWidth={1.5} />;
  if (shape === 'triangle') return <path d={`M${x},${y - r * 1.2} L${x + r * 1.1},${y + r * 0.8} L${x - r * 1.1},${y + r * 0.8} Z`} fill={fill} stroke={stroke} strokeWidth={1.5} />;
  return <circle cx={x} cy={y} r={r} fill={fill} stroke={stroke} strokeWidth={1.5} />;
}

/** Arrow head definition for SVGs (use `markerEnd="url(#<id>)"`). */
export function ArrowDef({ id, color }: { id: string; color: string }) {
  return <defs><marker id={id} viewBox="0 0 10 10" refX={9} refY={5} markerWidth={7} markerHeight={7} orient="auto-start-reverse">
    <path d="M0,0 L10,5 L0,10 Z" fill={color} />
  </marker></defs>;
}
