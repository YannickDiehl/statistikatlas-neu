// Sitzung 8: kleine Bausteine für die Bilder (SVG in JSX). Farben wie im Baukasten von Sitzung 4.
import type { ReactNode, SVGProps } from 'react';

export const BLUE = { fill: '#BFE3F7', stroke: '#5f97c2' };
export const GREEN = { fill: '#CDEFD9', stroke: '#2f7a4f' };
export const ORANGE = '#E07B4C';
export const GRAY = '#8a939b';
export const INK = '#1E2D3C';

/** German number with fixed decimals and a real minus sign („−0,373“). */
export const de = (x: number, d = 1) =>
  x.toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d }).replace('-', '−');
/** Whole number with German thousands separator („3.427“). */
export const whole = (x: number) => Math.round(x).toLocaleString('de-DE');
/** Up to two decimals without trailing zeros („2,75“, „1,33“, „4“). */
export const short = (x: number) => x.toLocaleString('de-DE', { maximumFractionDigits: 2 }).replace('-', '−');

/** SVG text with the chapter's defaults (Nunito 13, gray, centred). */
export function T({ children, ...props }: SVGProps<SVGTextElement>) {
  return <text fontFamily="Nunito,sans-serif" fontSize={13} fill="#5F6A74" textAnchor="middle" {...props}>{children}</text>;
}

/** A stone: rounded rectangle with a value (or empty and dashed for NA). */
export function Stone({ x, y, w = 46, h = 28, value, fill = BLUE.fill, stroke = BLUE.stroke, empty = false, dim = false, label }: {
  x: number; y: number; w?: number; h?: number; value?: string; fill?: string; stroke?: string; empty?: boolean; dim?: boolean; label?: string;
}) {
  return <g opacity={dim ? 0.45 : 1}>
    <rect x={x} y={y} width={w} height={h} rx={5} fill={empty ? '#fff' : fill} stroke={empty ? GRAY : stroke} strokeWidth={1.5} strokeDasharray={empty ? '4 3' : undefined} />
    {value !== undefined ? <T x={x + w / 2} y={y + h / 2 + 5} fill={INK} fontWeight={700} fontSize={14}>{value}</T> : null}
    {label ? <T x={x + w / 2} y={y + h + 12} fontSize={9.5} fill="#5F6A74">{label}</T> : null}
  </g>;
}

/** Static picture with its text version as the accessible name (role="img") and an optional caption. */
export function Pic({ alt, caption, children, className }: { alt: string; caption?: ReactNode; children?: ReactNode; className?: string }) {
  if (!alt.trim()) throw new Error('Pic: alt text is required.');
  return <figure className={`ebild${className ? ` ${className}` : ''}`}>
    <div className="ebild-bild" role="img" aria-label={alt}>{children}</div>
    {caption ? <figcaption>{caption}</figcaption> : null}
  </figure>;
}

/** An SVG canvas that screen readers skip (the text version sits outside). */
export function Svg({ w, h, children }: { w: number; h: number; children?: ReactNode }) {
  return <svg viewBox={`0 0 ${w} ${h}`} width="100%" aria-hidden="true" focusable="false">{children}</svg>;
}
