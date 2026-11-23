import { useState, type KeyboardEvent } from 'react';
import { de } from '../kit/numbers';
import { CAT, PARTY, ROLE } from '../kit/palette';
import { quantile6, type Describe } from './domain';

/** Parteien in ihren offiziellen Farben (kit/palette, nach Code); fehlende Werte hellgrau. */
const MISSING = ROLE.missing;
const EMPTY = ROLE.empty;
const ABOVE = ROLE.data;
const BELOW = '#bfe3dd';
const GUESS = ROLE.guess;
const MEAN = ROLE.mean;

/** Ein Stuhl als kleines Symbol: Lehne, Sitzfläche, zwei Beine. (x, y) ist die linke obere Ecke einer 40 × 40-Zelle. */
function Chair({ x, y, fill, stroke = '#242822', title, onClick, className }: {
  x: number; y: number; fill: string; stroke?: string; title: string; onClick?: () => void; className?: string;
}) {
  return <g className={className} onClick={onClick}>
    <title>{title}</title>
    <rect x={x} y={y} width={40} height={40} fill="transparent" />
    <rect x={x + 10} y={y + 4} width={20} height={15} rx={3} fill={fill} stroke={stroke} strokeWidth={1.2} />
    <rect x={x + 7} y={y + 19} width={26} height={6} rx={2} fill={fill} stroke={stroke} strokeWidth={1.2} />
    <rect x={x + 9} y={y + 25} width={3} height={11} fill={stroke} />
    <rect x={x + 28} y={y + 25} width={3} height={11} fill={stroke} />
  </g>;
}

export type HallGroup = { code: number; label: string; seats: number; missing: boolean };
const groupColor = (groups: HallGroup[], i: number) => groups[i].missing ? MISSING : PARTY[groups[i].code] ?? CAT[i % CAT.length];

/** Saal 1: 100 Stühle im 10×10-Raster, gefüllt in der Reihenfolge der Gruppen. Mit `onPick` lassen sich Stühle anklicken:
 *  Der Klick legt fest, bis zu welchem Stuhl der Block der gewählten Gruppe reicht. */
export function Hall({ groups, active = null, onPick }: { groups: HallGroup[]; active?: number | null; onPick?: (index: number) => void }) {
  const cells: { label: string; color: string }[] = [];
  groups.forEach((g, i) => {
    const color = groupColor(groups, i);
    for (let k = 0; k < Math.min(Math.max(0, g.seats), 120); k++) cells.push({ label: g.label, color });
  });
  const shown = cells.slice(0, 120);
  const slots = Math.max(100, shown.length), rows = Math.ceil(slots / 10);
  const total = groups.reduce((a, g) => a + Math.max(0, g.seats), 0);
  const summary = groups.map(g => `${g.label} ${g.seats}`).join(', ');
  const pickable = Boolean(onPick) && active !== null;
  return <figure className="s03-hall">
    <svg viewBox={`0 0 400 ${rows * 40}`} role="img" aria-label={`Saal mit ${total} Stühlen: ${summary}`}>
      {Array.from({ length: slots }, (_, i) => {
        const c = shown[i];
        return <Chair key={i} x={(i % 10) * 40} y={Math.floor(i / 10) * 40} fill={c ? c.color : EMPTY} stroke={c ? '#242822' : '#b8b4a8'}
          title={`Stuhl ${i + 1}: ${c ? c.label : 'noch frei'}`} className={pickable ? 's03-chair-pick' : undefined}
          onClick={pickable ? () => onPick!(i) : undefined} />;
      })}
    </svg>
    <figcaption>
      {groups.map((g, i) => <span key={g.code} className={active === i ? 'active' : undefined}>
        <i style={{ background: groupColor(groups, i) }} aria-hidden="true" />{g.label} {g.seats}
      </span>)}
      <span className="s03-hall-free"><i aria-hidden="true" />noch frei {Math.max(0, 100 - total)}</span>
    </figcaption>
  </figure>;
}

export const chairsOf = (values: number[]) => {
  const sorted = [...values].sort((a, b) => a - b);
  return Array.from({ length: 100 }, (_, i) => quantile6(sorted, (i + 0.5) / 100));
};
export const hoursLabel = (h: number) => (Math.round(h * 2) / 2).toLocaleString('de-DE');

/** Senkrechter Strich vor Stuhl `index` (0–100) im 10er-Raster, mit Beschriftung. */
function Divider({ index, color, label, dashed, labelBelow }: { index: number; color: string; label: string; dashed?: boolean; labelBelow?: boolean }) {
  const row = Math.min(9, Math.floor(index / 10)), col = index === 100 ? 10 : index % 10;
  const x = col * 50 + 2, y = row * 62;
  // Am rechten Rand nach links schreiben, sonst wird die Beschriftung abgeschnitten.
  const end = col >= 8;
  // Unten: zwischen der Stundenzahl (Grundlinie y + 52) und dem nächsten Stuhl, damit nichts überlappt.
  const below = labelBelow && row < 9;
  return <g>
    <line x1={x} x2={x} y1={y + 2} y2={y + 58} stroke={color} strokeWidth={3} strokeDasharray={dashed ? '5 3' : undefined} />
    <text x={end ? x - 4 : x + 4} y={below ? y + 65 : y + 10} textAnchor={end ? 'end' : undefined} className="s03-divider" fill={color}>{label}</text>
  </g>;
}

/** Saal 2: 100 Stühle, sortiert von wenig nach viel Arbeit (zeilenweise wie Sitzreihen), unter jedem Stuhl seine Stunden.
 *  Vor der Rechnung: Klick auf den ersten Stuhl, der über dem Mittelwert liegt. Mit `stats`: Tipp und echter Mittelwert. */
export function ChairRow({ values, guess, onPick, locked = false, stats }: {
  values: number[]; guess: number | null; onPick?: (index: number) => void; locked?: boolean; stats?: Describe;
}) {
  const chairs = chairsOf(values);
  const meanIndex = stats ? chairs.filter(c => c <= stats.mean).length : null;
  const pickable = Boolean(onPick) && !locked;
  // Vorschau: Beim Zeigen auf einen Stuhl färbt sich die Reihe probeweise, ein Klick legt den Tipp fest.
  const [hover, setHover] = useState<number | null>(null);
  const preview = pickable ? hover : null;
  const boundary = meanIndex ?? preview ?? guess;
  // Tastatur: Pfeiltasten verschieben den Tipp um einen Stuhl, hoch/runter um eine Reihe.
  const onKey = (e: KeyboardEvent<SVGSVGElement>) => {
    if (!pickable) return;
    const step = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 10, ArrowUp: -10 }[e.key];
    if (step === undefined) return;
    e.preventDefault();
    onPick!(Math.max(0, Math.min(99, (guess ?? 50) + step)));
  };
  const label = stats
    ? `100 Stühle sortiert nach Stunden. Q1 ${de(stats.q1)}, Median ${de(stats.median)}, Q3 ${de(stats.q3)}, Durchschnitt ${de(stats.mean)}. ${Math.round(stats.above * 100)} Stühle liegen über dem Mittelwert.${guess === null ? '' : ` Dein Tipp: ${100 - guess}.`}`
    : `100 Stühle sortiert nach Stunden, ohne Kennzahlen.${guess === null ? '' : ` Dein Tipp: ${100 - guess} Stühle über dem Mittelwert.`}`;
  return <div className="s03-row-wrap">
    <svg viewBox="0 0 504 620" className={`s03-row${pickable ? ' s03-row-pickable' : ''}`} role={pickable ? 'slider' : 'img'} aria-label={label}
      tabIndex={pickable ? 0 : undefined} onKeyDown={onKey} onMouseLeave={() => setHover(null)}
      aria-valuemin={pickable ? 0 : undefined} aria-valuemax={pickable ? 100 : undefined}
      aria-valuenow={pickable && guess !== null ? 100 - guess : undefined}
      aria-valuetext={pickable && guess !== null ? `${100 - guess} Stühle über dem Durchschnitt` : undefined}>
      {chairs.map((h, i) => {
        const x = (i % 10) * 50 + 5, y = Math.floor(i / 10) * 62;
        const fill = boundary === null ? BELOW : i >= boundary ? ABOVE : BELOW;
        return <g key={i}>
          <g onMouseEnter={pickable ? () => setHover(i) : undefined}>
            <Chair x={x} y={y} fill={fill} title={`Stuhl ${i + 1}: ${hoursLabel(h)} Stunden`} className={pickable ? 's03-chair-pick' : undefined}
              onClick={pickable ? () => onPick!(i) : undefined} />
          </g>
          <text x={x + 20} y={y + 53} textAnchor="middle" className="s03-hours" style={{ fontSize: 'var(--fs-caption)' }}>{hoursLabel(h)}</text>
        </g>;
      })}
      {stats && <Divider index={50} color="#5c6157" label="Mitte (Median)" labelBelow />}
      {stats && guess !== null && guess !== meanIndex && <Divider index={guess} color={GUESS} label="Dein Tipp" />}
      {stats && meanIndex !== null && <Divider index={meanIndex} color={MEAN} label={`Ø ${de(stats.mean)}`} dashed />}
      {!stats && preview !== null && preview !== guess && <Divider index={preview} color={ROLE.guessLight} label="hier?" dashed />}
      {!stats && guess !== null && <Divider index={guess} color={GUESS} label="Dein Tipp" />}
    </svg>
    <p className="s03-row-legend">
      <span><i style={{ background: BELOW }} aria-hidden="true" />höchstens Durchschnitt</span>
      <span><i style={{ background: ABOVE }} aria-hidden="true" />mehr als der Durchschnitt</span>
      <span className="s03-row-order">Gelesen wird wie ein Buch: oben links wenig Stunden → unten rechts viele Stunden.{pickable ? ' Mit den Pfeiltasten kannst du deinen Tipp auch verschieben.' : ''}</span>
    </p>
  </div>;
}
