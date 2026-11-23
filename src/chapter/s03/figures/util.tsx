import { useEffect, useRef, type ReactNode, type SVGProps } from 'react';

/** German number with fixed decimals and a real minus sign („19,93“, „−9“). */
export const de = (x: number, d = 2) =>
  x.toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d }).replace('-', '−');
/** Whole number with German thousands separator („5.246“). */
export const whole = (x: number) => Math.round(x).toLocaleString('de-DE').replace('-', '−');
/** A percentage as R prints it („19.84“, „100.00“). */
export const r2 = (x: number) => x.toFixed(2);

/** Colours of the stone kit (chapter.css), as constants for SVG. */
export const C = {
  ink: '#1E2D3C', mute: '#5F6A74', blue: '#86B9DE', blueStroke: '#5f97c2', blueDark: '#2C6CA8',
  yellow: '#FFE7A3', yellowStroke: '#EFC867', orange: '#F0A27E', orangeDark: '#C26A3C', orangeLight: '#FFF0E8',
  green: '#2f7a4f', plate: '#C6ECE8', line: '#EFE6DA',
};

/** SVG text with the chapter defaults (Nunito 13, gray, centred). */
export function SvgText({ children, ...props }: SVGProps<SVGTextElement>) {
  return <text fontFamily="Nunito,sans-serif" fontSize={13} fill={C.mute} textAnchor="middle" {...props}>{children}</text>;
}

/** Square bracket on the right of rows, from y1 to y2 at x (ticks point left). */
export function Bracket({ x, y1, y2, color = C.ink }: { x: number; y1: number; y2: number; color?: string }) {
  return <path d={`M${x - 7},${y1} H${x} V${y2} H${x - 7}`} fill="none" stroke={color} strokeWidth={1.8} />;
}

/** Horizontal bracket below a range (ticks point up), from x1 to x2 at y. */
export function HBracket({ x1, x2, y, color = C.ink }: { x1: number; x2: number; y: number; color?: string }) {
  return <path d={`M${x1},${y - 7} V${y} H${x2} V${y - 7}`} fill="none" stroke={color} strokeWidth={2} />;
}

/**
 * Step buttons („Schritt 1: Turm“ …) above a picture; the current one carries aria-current="step".
 * Same look as the layers stepper of session 4 (`.schritt-nav`).
 */
export function StepNav({ steps, current, onSelect, label = 'Schritte' }: {
  steps: string[]; current: number; onSelect: (i: number) => void; label?: string;
}) {
  return <ul className="schritt-nav" aria-label={label}>
    {steps.map((name, i) => <li key={name}>
      <button type="button" aria-current={i === current ? 'step' : 'false'} onClick={() => onSelect(i)}>{`Schritt ${i + 1}: ${name}`}</button>
    </li>)}
  </ul>;
}

/** Closed details with the whole text version of a picture („Bild als Text“). */
export function TextVersion({ children }: { children?: ReactNode }) {
  return <details className="s3-text"><summary>Bild als Text</summary>{children}</details>;
}

/** Moves the focus after the next render, e.g. when the pressed button disappears (Spec §7). */
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
