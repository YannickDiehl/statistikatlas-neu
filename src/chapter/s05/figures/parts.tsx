// Gemeinsame Teile der Bilder von Sitzung 5: Bildrahmen mit Textfassung, Zahlen deutsch, Steine, Türme, Pfeile (SVG in JSX).
import type { ReactNode, SVGProps } from 'react';

/** German number with fixed decimals („51,7“). */
export const de = (x: number, d = 1) => x.toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d });
/** Whole number with German thousands separator („3.359“). */
export const whole = (x: number) => Math.round(x).toLocaleString('de-DE');

export const COLORS = {
  blue: '#85B7EB', blueD: '#2C6CA8', lila: '#AFA9EC', lilaD: '#5b4fb0', orange: '#FAC775', orangeD: '#B86E0A',
  green: '#36A266', gray: '#9aa4ad', ink: '#1E2D3C', mute: '#5F6A74', line: '#EFE6DA', yellow: '#FFE7A3', yellowD: '#EFC867',
};
const MONO = 'JetBrains Mono,ui-monospace,monospace';

/**
 * Picture with an equivalent text version: the drawing is one role="img" with `alt` as its name,
 * the caption stays readable text below.
 */
export function Fig({ alt, caption, children, className }: { alt: string; caption?: ReactNode; children: ReactNode; className?: string }) {
  if (!alt.trim()) throw new Error('Fig: alt text is required.');
  return <figure className={`ebild${className ? ` ${className}` : ''}`}>
    <div className="ebild-bild" role="img" aria-label={alt}>{children}</div>
    {caption ? <figcaption>{caption}</figcaption> : null}
  </figure>;
}

/** SVG canvas: decorative, its text version is the `alt` of the surrounding Fig. */
export function Canvas({ w, h, children }: { w: number; h: number; children: ReactNode }) {
  return <svg viewBox={`0 0 ${w} ${h}`} width="100%" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet">{children}</svg>;
}

export function T({ children, mono, ...props }: SVGProps<SVGTextElement> & { mono?: boolean }) {
  return <text fontFamily={mono ? MONO : 'Nunito,sans-serif'} fontSize={13} fill={COLORS.mute} textAnchor="middle" {...props}>{children}</text>;
}

/** Width of mono text at `size` px (JetBrains Mono ≈ 0.6 em per character). */
export const monoWidth = (s: string, size = 13) => s.length * size * 0.6;

export type Stone = {
  /** Code in the stone; null is an empty stone (NA). */
  code: string | null;
  /** Sticker (value label) next to the stone. */
  label?: string;
  /** Orange outline, e.g. the stone that else=NA makes empty. */
  hot?: boolean;
  /** Dashed stone with a question mark (decided by your rule). */
  open?: boolean;
};

export const STONE = { w: 36, h: 30, gap: 8 };

/** One stone with its sticker at (x, y); `labelW` is the width of the sticker column. */
export function StoneRow({ x, y, s, labelW }: { x: number; y: number; s: Stone; labelW: number }) {
  const empty = s.code === null || s.open;
  return <g>
    <rect x={x} y={y} width={STONE.w} height={STONE.h} rx={4}
      fill={s.open ? '#fff' : empty ? '#F6F4EF' : COLORS.blue}
      stroke={s.hot ? COLORS.orangeD : empty ? COLORS.gray : COLORS.blueD}
      strokeWidth={s.hot ? 2.5 : 1.2} strokeDasharray={empty ? '4 3' : undefined} />
    {s.hot ? <rect x={x - 3} y={y - 3} width={STONE.w + 6} height={STONE.h + 6} rx={6} fill="none" stroke={COLORS.orange} strokeWidth={3} /> : null}
    <T x={x + STONE.w / 2} y={y + 20} mono fontSize={14.5} fill={COLORS.ink} fontWeight={600}>{s.open ? '?' : s.code ?? 'NA'}</T>
    {s.label ? <g>
      <rect x={x + STONE.w + 5} y={y + 2} width={labelW} height={STONE.h - 4} rx={4}
        fill={s.code === null ? '#F1EFFC' : COLORS.lila} stroke={s.code === null ? '#D6D2F2' : '#8d85d6'} strokeWidth={1} />
      <T x={x + STONE.w + 12} y={y + 19.5} mono fontSize={13} textAnchor="start" fill={s.code === null ? '#8b86b5' : COLORS.ink}>{s.label}</T>
    </g> : null}
  </g>;
}

/** A tower: name and type above, stones from top to bottom. Returns nothing else; `labelW` defaults to the longest sticker. */
export function Tower({ x, y, name, type = '<dbl+lbl>', stones, labelW, highlight }: {
  x: number; y: number; name: string; type?: string; stones: Stone[]; labelW?: number; highlight?: boolean;
}) {
  const lw = labelW ?? Math.max(0, ...stones.map(s => (s.label ? monoWidth(s.label) + 16 : 0)));
  return <g>
    <T x={x} y={y - 24} mono fontSize={15.5} fontWeight={700} textAnchor="start" fill={highlight ? COLORS.green : COLORS.ink}>{name}</T>
    <T x={x} y={y - 8} mono fontSize={12.5} textAnchor="start">{type}</T>
    {stones.map((s, i) => <StoneRow key={i} x={x} y={y + i * (STONE.h + STONE.gap)} s={s} labelW={lw} />)}
  </g>;
}
export const towerWidth = (stones: Stone[]) => STONE.w + 5 + Math.max(0, ...stones.map(s => (s.label ? monoWidth(s.label) + 16 : 0)));
export const rowY = (y: number, i: number) => y + i * (STONE.h + STONE.gap);

/** Green arrow from (x1, y) to (x2, y), optional label lines above it (mono). */
export function Arrow({ x1, x2, y, label, size = 13 }: { x1: number; x2: number; y: number; label?: string[]; size?: number }) {
  return <g>
    <line x1={x1} x2={x2 - 10} y1={y} y2={y} stroke={COLORS.green} strokeWidth={3} />
    <path d={`M${x2 - 12},${y - 7} L${x2},${y} L${x2 - 12},${y + 7} Z`} fill={COLORS.green} />
    {label?.map((l, i) => <T key={i} x={(x1 + x2) / 2} y={y - 10 - (label.length - 1 - i) * (size + 4)} mono fontSize={size} fill="#1f6b43" fontWeight={600}>{l}</T>)}
  </g>;
}
