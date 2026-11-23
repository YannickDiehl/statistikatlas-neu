import type { ReactNode, SVGProps } from 'react';

/** Farben des Baukastens als Hexwerte (SVG-Attribute lesen keine CSS-Variablen zuverlässig). */
export const C = {
  ink: '#1E2D3C', line: '#E0D3BE', soft: '#EFE6DA', side: '#FFF6EC', mute: '#5F6A74', rand: '#857A6B',
  gelbh: '#FFF6DA', gelbd: '#7a5c0c', gruen: '#8FCBA6', gruenh: '#EDF8F1', gruend: '#2f7a4f',
  blau: '#86B9DE', blauh: '#EAF5FC', blaud: '#2C6CA8', roth: '#fdeeea', rot: '#a0452f',
  k: '#FFD2BC', kh: '#FFF0E8', arg: '#FFE3D2', obj: '#E5E9EE', mark: '#FFE58A', markd: '#C9921C',
  fn: '#2f7a4f', str: '#b5541c', comment: '#6b7078', num: '#5b4fb0',
};
export const MONO = 'JetBrains Mono,ui-monospace,monospace';
export const SANS = 'Nunito,sans-serif';

/** SVG text, Nunito 13, left-aligned by default. */
export function T({ children, ...props }: SVGProps<SVGTextElement>) {
  return <text fontFamily={SANS} fontSize={13} fill={C.ink} {...props}>{children}</text>;
}
/** Monospace SVG text (code). */
export function M({ children, ...props }: SVGProps<SVGTextElement>) {
  return <text fontFamily={MONO} fontSize={12} fill={C.ink} {...props}>{children}</text>;
}

/** Numbered circle (dark, white digit) for labelled schemas. */
export function Num({ x, y, n }: { x: number; y: number; n: number }) {
  return <g>
    <circle cx={x} cy={y} r={10} fill={C.ink} />
    <T x={x} y={y + 4.5} textAnchor="middle" fontSize={12} fontWeight={800} fill="#fff">{String(n)}</T>
  </g>;
}

/** Arrow head marker; place `<ArrowDefs />` once per SVG. */
export function ArrowDefs({ id, color }: { id: string; color: string }) {
  return <defs>
    <marker id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill={color} />
    </marker>
  </defs>;
}

/**
 * A drawn picture (JSX SVG) with its equivalent text version as accessible name, like the `Figure` block
 * for SVG strings. `alt` is required: a picture without text fails loudly.
 */
export function SvgFigure({ viewBox, alt, caption, children }: { viewBox: string; alt: string; caption?: ReactNode; children?: ReactNode }) {
  if (typeof alt !== 'string' || !alt.trim()) throw new Error('SvgFigure: alt text is required (equivalent text version of the picture).');
  return <figure className="ebild">
    <div className="ebild-bild" role="img" aria-label={alt}>
      <svg viewBox={viewBox} width="100%" aria-hidden="true" focusable="false">{children}</svg>
    </div>
    {caption ? <figcaption>{caption}</figcaption> : null}
  </figure>;
}
