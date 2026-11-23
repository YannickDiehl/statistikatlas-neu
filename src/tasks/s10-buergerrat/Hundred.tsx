import { useState } from 'react';
import { lighten, ROLE } from '../kit/palette';

export const TIP = ROLE.guess, MODEL = ROLE.model;
const EMPTY = ROLE.missing;

/** Eine kleine Figur: Kopf und Körper. */
function Person({ fill }: { fill: string }) {
  return <svg viewBox="0 0 20 32" aria-hidden="true" style={{ width: '100%', height: 'auto', display: 'block' }}>
    <circle cx={10} cy={6} r={5} fill={fill} />
    <rect x={3} y={13} width={14} height={18} rx={6} fill={fill} />
  </svg>;
}

const grid = { display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 4, maxWidth: 300, margin: '6px 0' } as const;

/** 100 Menschen wie Jana: Wer wählen geht, ist gefüllt. Mit onPick zum Anklicken – ein Klick auf Figur n füllt die Figuren 1 bis n
 *  (ein zweiter Klick auf die letzte gefüllte nimmt sie wieder weg); beim Zeigen mit der Maus erscheint die Vorschau. */
export function HundredPeople({ value, color = TIP, onPick, label }: { value: number | null; color?: string; onPick?: (n: number) => void; label: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const filled = value ?? 0;
  if (!onPick) return <div role="img" aria-label={label} style={grid}>
    {Array.from({ length: 100 }, (_, i) => <Person key={i} fill={i < filled ? color : EMPTY} />)}
  </div>;
  return <div role="group" aria-label={label} style={grid} onMouseLeave={() => setHover(null)}>
    {Array.from({ length: 100 }, (_, i) => {
      const n = i + 1, target = hover === null ? filled : hover === filled ? hover - 1 : hover;
      // Vorschau: was ein Klick ergäbe – neu dazukommende Figuren hell, wegfallende blass
      const fill = n <= target ? (n <= filled ? color : ROLE.guessLight) : n <= filled ? lighten(ROLE.guessLight, 0.5) : EMPTY;
      return <button key={i} type="button" aria-label={`${n} von 100 gehen wählen`} aria-pressed={n <= filled}
        onClick={() => onPick(n === filled ? n - 1 : n)} onMouseEnter={() => setHover(n)} onFocus={() => setHover(n)} onBlur={() => setHover(null)}
        style={{ padding: 0, border: 'none', background: 'transparent', cursor: 'pointer', lineHeight: 0, borderRadius: 3 }}>
        <Person fill={fill} />
      </button>;
    })}
  </div>;
}
