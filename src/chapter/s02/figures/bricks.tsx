// Bildsprache des R-Workshops (Kapitel 3 und 4) als SVG-Bausteine: Bauplatte = Datensatz, Turm = Variable,
// Stein = Wert, Aufkleber = Wertelabel, leerer gestrichelter Stein = NA, grau = fällt weg.
// Farben wie in den Bildern von Sitzung 4 (prototyp/s4-*.svg).
import type { ReactNode, SVGProps } from 'react';

export const MONO = "'JetBrains Mono', Menlo, Consolas, monospace";
export const SANS = 'Nunito, system-ui, sans-serif';
export const C = {
  ink: '#1E2D3C', mute: '#6E7882', blue: '#85B7EB', blueLine: '#042C53', lila: '#AFA9EC', lilaLine: '#26215C',
  sticker: '#FAC775', gray: '#E4E1D8', grayLine: '#D7D1C4', grayText: '#A8A69E', green: '#36A266', orange: '#E6A033',
  paper: '#FFFFFF', paperLine: '#B9B2A6', cross: '#D9741F',
};

/** SVG text, sans by default, centred. */
export function T({ children, ...props }: SVGProps<SVGTextElement>) {
  return <text fontFamily={SANS} fontSize={13} fill={C.mute} textAnchor="middle" {...props}>{children}</text>;
}

/** Code text (mono). */
export function M({ children, ...props }: SVGProps<SVGTextElement>) {
  return <text fontFamily={MONO} fontSize={13} fill={C.ink} textAnchor="middle" {...props}>{children}</text>;
}

export type BrickKind = 'num' | 'chr' | 'na' | 'gray';
export const BRICK_H = 27;
/** Distance between two stacked bricks (brick plus studs). */
export const PITCH = 34;

const STYLE: Record<BrickKind, { fill: string; line: string; text: string }> = {
  num: { fill: C.blue, line: C.blueLine, text: C.blueLine },
  chr: { fill: C.lila, line: C.lilaLine, text: C.lilaLine },
  na: { fill: '#fff', line: C.mute, text: C.mute },
  gray: { fill: C.gray, line: C.grayLine, text: C.grayText },
};

/** Font size so that `text` fits into `width` (mono, about 0.62 em per character). */
export const fit = (text: string, width: number, max = 11.5) => Math.min(max, width / (Math.max(text.length, 1) * 0.62));

/**
 * One stone (a LEGO brick with studs). `value` is the code or word, `label` the yellow sticker (value label).
 * An empty stone (`na`) is white and dashed; its sticker can be `faded`.
 */
export function Brick({ x, y, w, kind, value = '', label, faded = false, studs }: {
  x: number; y: number; w: number; kind: BrickKind; value?: string; label?: string; faded?: boolean; studs?: number;
}) {
  const s = STYLE[kind];
  const n = studs ?? Math.max(1, Math.round(w / 42));
  const step = w / n;
  const dash = kind === 'na' ? '4 3' : undefined;
  const hasValue = value !== '';
  const sx = hasValue ? x + 26 : x + 6, sw = x + w - 6 - sx;
  return <g>
    {Array.from({ length: n }, (_, i) => <rect key={i} x={x + step * i + step / 2 - 8.5} y={y - 6} width={17} height={6.5}
      fill={kind === 'na' ? '#fff' : s.fill} stroke={kind === 'na' ? C.mute : 'none'} strokeWidth={0.7} />)}
    <rect x={x} y={y} width={w} height={BRICK_H} fill={s.fill} stroke={s.line} strokeWidth={1} strokeDasharray={dash} />
    {label ? <>
      {hasValue ? <M x={x + 13} y={y + 18.5} fontSize={14} fontWeight={700} fill={s.text}>{value}</M> : null}
      <rect x={sx} y={y + 6} width={sw} height={15} fill={kind === 'gray' ? '#F1ECE0' : C.sticker} opacity={faded ? 0.55 : 1} />
      <M x={sx + sw / 2} y={y + 17.5} fontSize={fit(label, sw - 6)} fontWeight={700} fill={kind === 'gray' ? C.grayText : C.ink} opacity={faded ? 0.75 : 1}>{label}</M>
    </> : <M x={x + w / 2} y={y + 18.5} fontSize={fit(value, w - 8, 14)} fontWeight={700} fill={s.text}>{value}</M>}
  </g>;
}

/** Name and type over a tower („sex“, „<dbl+lbl>“). */
export function Head({ x, y, name, type }: { x: number; y: number; name: string; type?: string }) {
  return <g>
    <M x={x} y={y} fontSize={14} fontWeight={700}>{name}</M>
    {type ? <M x={x} y={y + 17} fontSize={11.5} fill={C.mute}>{`<${type}>`}</M> : null}
  </g>;
}

/** Dark name tag of a whole plate (an object such as `allbus`). */
export function NameTag({ x, y, text }: { x: number; y: number; text: string }) {
  const w = text.length * 8.6 + 18;
  return <g>
    <rect x={x} y={y} width={w} height={22} rx={6} fill={C.ink} />
    <M x={x + w / 2} y={y + 15.5} fill="#fff" fontWeight={600}>{text}</M>
  </g>;
}

/** The gray base plate under the towers. */
export function Plate({ x, y, w }: { x: number; y: number; w: number }) {
  return <rect x={x} y={y} width={w} height={6} fill={C.mute} />;
}

/** Green arrow from x1 to x2 at height y, optionally with code above it. */
export function Arrow({ x1, x2, y, children }: { x1: number; x2: number; y: number; children?: ReactNode }) {
  return <g>
    <rect x={x1} y={y - 5} width={x2 - x1 - 14} height={10} fill={C.green} />
    <path d={`M${x2 - 16},${y - 13} L${x2},${y} L${x2 - 16},${y + 13} Z`} fill={C.green} />
    {children}
  </g>;
}

/** Arrow pointing down from y1 to y2 at x. */
export function ArrowDown({ x, y1, y2 }: { x: number; y1: number; y2: number }) {
  return <g>
    <rect x={x - 5} y={y1} width={10} height={y2 - y1 - 14} fill={C.green} />
    <path d={`M${x - 13},${y2 - 16} L${x},${y2} L${x + 13},${y2 - 16} Z`} fill={C.green} />
  </g>;
}

/** A paper questionnaire: white sheet, gray border, title. */
export function Sheet({ x, y, w, h, title, children }: { x: number; y: number; w: number; h: number; title?: string; children?: ReactNode }) {
  return <g>
    <rect x={x} y={y} width={w} height={h} rx={4} fill={C.paper} stroke={C.paperLine} strokeWidth={1.2} />
    {title ? <T x={x + 10} y={y + 18} textAnchor="start" fontSize={12.5} fontWeight={800} fill={C.ink}>{title}</T> : null}
    {children}
  </g>;
}

/** A tick box with label; `checked` draws an orange cross. `size` is the side length. */
export function TickBox({ x, y, label, checked = false, size = 11, fontSize = 11.5 }: { x: number; y: number; label?: string; checked?: boolean; size?: number; fontSize?: number }) {
  return <g>
    <rect x={x} y={y} width={size} height={size} fill="#fff" stroke="#5F6A74" strokeWidth={1} />
    {checked ? <path d={`M${x - 1},${y - 1} L${x + size + 1},${y + size + 1} M${x + size + 1},${y - 1} L${x - 1},${y + size + 1}`} stroke={C.cross} strokeWidth={2.4} strokeLinecap="round" /> : null}
    {label ? <T x={x + size + 5} y={y + size - 1.5} textAnchor="start" fontSize={fontSize} fill="#2B3540">{label}</T> : null}
  </g>;
}

/**
 * A picture with its text version: `role="img"` carries the text, the SVG inside is decorative.
 * Built like the `Figure` block, but for SVG written in JSX.
 */
export function Pic({ alt, caption, children, className }: { alt: string; caption?: ReactNode; children: ReactNode; className?: string }) {
  if (!alt.trim()) throw new Error('Pic: alt text is required.');
  return <figure className={`ebild${className ? ` ${className}` : ''}`}>
    <div className="ebild-bild" role="img" aria-label={alt}>{children}</div>
    {caption ? <figcaption>{caption}</figcaption> : null}
  </figure>;
}

/** Outer SVG of a picture (decorative; the text version sits on the surrounding role="img"). */
export function Svg({ w, h, children }: { w: number; h: number; children: ReactNode }) {
  return <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} aria-hidden="true" focusable="false">{children}</svg>;
}
