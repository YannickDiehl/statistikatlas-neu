import { useState, type CSSProperties, type ReactNode } from 'react';
import { de } from '../kit/numbers';
import { CAT, CAT_DARK, lighten, ROLE } from '../kit/palette';
import { areaCaption, BASE_NAMES, BASE_WORDS, baseOf, shortcut, type BaseArea, type Way } from './domain';

const count = (x: number) => x.toLocaleString('de-DE');
/** Je Prozentbasis eine eigene Farbe: Nichtwählende, Misstrauende, alle Befragten. */
const BASE_COLORS = [CAT[0], CAT[4], CAT[2]];

/** Bild der Prozentbasen: dieselbe Zelle (dieselben Menschen), geteilt durch drei verschiedene Gruppen. */
export function DenominatorBars({ cell, nonvoters, distrusting, all }: { cell: number; nonvoters: number; distrusting: number; all: number }) {
  const bars: [string, number][] = [
    [`unter den ${count(nonvoters)} Nichtwählenden`, nonvoters],
    [`unter den ${count(distrusting)} Misstrauenden`, distrusting],
    [`unter allen ${count(all)} Befragten`, all],
  ];
  const W = 800, scale = (x: number) => (x / all) * (W - 4);
  const label = bars.map(([text, n]) => `${text}: ${de(100 * cell / n)} %`).join('; ');
  return <figure className="s04-bars">
    <div className="s04-scroll" tabIndex={0} role="region" aria-label="Bild der Prozentbasen">
    <svg viewBox={`0 0 ${W} 150`} className="s04-bars-svg" role="img" aria-label={`Dieselben ${cell} Befragten, drei Prozentbasen – ${label}`}>
      {bars.map(([text, n], i) => <g key={text} transform={`translate(2 ${i * 50 + 6})`}>
        <rect width={Math.max(scale(n), 3)} height={18} rx={4} fill={lighten(BASE_COLORS[i], 0.55)} stroke={BASE_COLORS[i]} />
        <rect width={Math.max(scale(cell), 3)} height={18} rx={4} fill={ROLE.data} />
        <text x={0} y={36}>{text}: <tspan className="value">{de(100 * cell / n)} %</tspan></text>
      </g>)}
    </svg>
    </div>
    <figcaption>Das orange Stück sind in allen drei Balken dieselben {cell} Befragten. Nur die Prozentbasis wechselt – die Gruppe, die 100 % ist: {bars.map(([text, n]) => `${de(100 * cell / n)} % ${text}`).join(' · ')}.</figcaption>
  </figure>;
}

/** Streifen: die 18 vorbereiteten Lesarten, die eigene Lesart und die 87 % als Fähnchen „andere Prozentbasis“. */
export function ReadingStrip({ readings, own, claimed }: {
  readings: { way: Way; distrusting: number; others: number }[];
  own: { way: Way; distrusting: number; others: number } | null;
  claimed: number;
}) {
  const W = 600, x = (p: number) => 20 + (p / 100) * (W - 40);
  const lo = Math.min(...readings.map(r => r.distrusting)), hi = Math.max(...readings.map(r => r.distrusting));
  const summary = `${readings.length} Lesarten: Von den Misstrauenden wollen ${de(lo)} bis ${de(hi)} % nicht wählen.${own ? ` Deine Lesart ${shortcut(own.way)}: ${de(own.distrusting)} % gegenüber ${de(own.others)} % bei den Übrigen.` : ''} Die ${claimed} % haben eine andere Prozentbasis.`;
  return <figure className="s04-strip">
    <div className="s04-scroll" tabIndex={0} role="region" aria-label="Streifen der Lesarten">
    <svg viewBox={`0 0 ${W} 120`} role="img" aria-label={summary}>
      <line x1={x(0)} x2={x(100)} y1={70} y2={70} stroke={ROLE.ink} />
      {[0, 25, 50, 75, 100].map(p => <g key={p}>
        <line x1={x(p)} x2={x(p)} y1={66} y2={74} stroke={ROLE.ink} />
        <text x={x(p)} y={90} textAnchor="middle">{p} %</text>
      </g>)}
      <line x1={x(50)} x2={x(50)} y1={24} y2={70} stroke={ROLE.mean} strokeDasharray="4 3" />
      {readings.map((r, i) => <g key={i}>
        <line x1={x(r.others)} x2={x(r.distrusting)} y1={58 - (i % 3) * 8} y2={58 - (i % 3) * 8} stroke={lighten(CAT[5], 0.2)} strokeWidth={1.5} />
        <circle cx={x(r.distrusting)} cy={58 - (i % 3) * 8} r={3.5} fill={CAT_DARK[5]} />
      </g>)}
      {own && <g>
        <line x1={x(own.others)} x2={x(own.distrusting)} y1={38} y2={38} stroke={ROLE.guess} strokeWidth={2.5} />
        <circle cx={x(own.distrusting)} cy={38} r={6} fill={ROLE.guess} />
        <circle cx={x(own.others)} cy={38} r={4} fill="#fff" stroke={ROLE.guess} strokeWidth={2} />
        <text x={x(own.distrusting)} y={24} textAnchor="middle" className="own">du</text>
      </g>}
      <g>
        <line x1={x(claimed)} x2={x(claimed)} y1={14} y2={70} stroke={CAT_DARK[1]} />
        <path d={`M${x(claimed)} 14 h 34 l -6 6 l 6 6 h -34 z`} fill={CAT[1]} />
        <text x={x(claimed) + 4} y={24} className="flag">{claimed} %</text>
      </g>
    </svg>
    </div>
    <figcaption>Jede waagrechte Linie ist eine Lesart. Sie reicht vom Anteil „würde nicht wählen“ unter den Übrigen (links) bis zum Anteil unter den Misstrauenden (Punkt); 100 % ist jeweils die eigene Gruppe. Blau: deine Lesart, Türkis: die vorbereiteten. Die rote gestrichelte Linie markiert 50 %, das orange Fähnchen die {claimed} % der Pressemitteilung – sie haben eine andere Prozentbasis (die Nichtwählenden).</figcaption>
  </figure>;
}

/* ---------- Vorab: Wer ist 100 %? Eine Kreuztabelle wie in R, Zeile, Spalte oder ganze Tabelle anklicken ---------- */

type Span = { row: string; col: string; hundred: [number, number] };
/** Lage im Raster – Zeilen und Spalten in der Reihenfolge der R-Ausgabe (0 vor 1, Total am Ende). */
const SPAN: Record<BaseArea, Span> = {
  'row-others': { row: '2 / 3', col: '1 / 5', hundred: [2, 4] },
  'row-distrust': { row: '3 / 4', col: '1 / 5', hundred: [3, 4] },
  'col-vote': { row: '1 / 5', col: '2 / 3', hundred: [4, 2] },
  'col-nonvote': { row: '1 / 5', col: '3 / 4', hundred: [4, 3] },
  total: { row: '1 / 5', col: '1 / 5', hundred: [4, 4] },
};
const BLUE = ROLE.guess, GREEN = '#2e8b57';
type Mark = { area: BaseArea; kind: 'pick' | 'hover' | 'actual'; tag: string; inset?: boolean };

/**
 * Schematische Kreuztabelle misstrauen × nichtwahl, aufgebaut wie die Ausgabe von crosstab().
 * Vor der Rechnung: Zeilen- und Spaltenköpfe sowie „ganze Tabelle“ sind Knöpfe – der gewählte Bereich wird umrandet, in seiner Total-Zelle steht 100 %.
 * Mit `actual`: Vergleich von Tipp (blau gestrichelt) und Prozentbasis der Pressemitteilung (grün).
 */
export function BaseTable({ pick, locked, onPick, actual = null, claimed }: {
  pick: BaseArea | null; locked: boolean; onPick?: (a: BaseArea) => void; actual?: BaseArea | null; claimed: number;
}) {
  const [hover, setHover] = useState<BaseArea | null>(null);
  const active = !locked && !actual && !!onPick;
  const marks: Mark[] = [];
  if (actual) marks.push({ area: actual, kind: 'actual', tag: areaCaption(actual) });
  if (pick) marks.push({ area: pick, kind: 'pick', tag: actual ? 'Dein Tipp' : areaCaption(pick), inset: actual === pick });
  if (active && hover && hover !== pick) marks.push({ area: hover, kind: 'hover', tag: `${areaCaption(hover)}?` });
  const hundreds = new Map(marks.filter(m => m.kind !== 'hover' || !pick).map(m => [SPAN[m.area].hundred.join(','), m.kind === 'actual' ? GREEN : m.kind === 'pick' ? BLUE : '#6b6f68']));

  const cell = (r: number, c: number, extra: CSSProperties = {}): CSSProperties => ({
    gridRow: `${r} / ${r + 1}`, gridColumn: `${c} / ${c + 1}`, padding: '8px 8px', overflowWrap: 'anywhere', textAlign: c === 1 ? 'left' : 'right',
    borderTop: r === 4 ? '3px double var(--line)' : r > 1 ? '1px solid var(--line)' : undefined,
    borderLeft: c === 4 ? '1px solid var(--line)' : undefined, fontVariantNumeric: 'tabular-nums', ...extra,
  });
  const head = (r: number, c: number, area: BaseArea, label: string, code: string, aria: string) => {
    const on = pick === area, hot = active && hover === area;
    const { borderTop, borderLeft, ...place } = cell(r, c);
    return <button key={area} type="button" aria-pressed={on} disabled={!active} aria-label={aria}
      onClick={() => onPick?.(area)} onMouseEnter={() => setHover(area)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(area)} onBlur={() => setHover(null)}
      style={{ ...place, borderTop: borderTop ?? 0, borderLeft: borderLeft ?? 0, borderRight: 0, borderBottom: 0, borderRadius: 0, font: 'inherit', fontWeight: 600, margin: 0,
        background: on ? '#e3e8f4' : hot ? '#eef1f7' : 'transparent', color: active ? BLUE : 'var(--ink)', cursor: active ? 'pointer' : 'default',
        textDecoration: active ? 'underline dotted' : 'none', textUnderlineOffset: 4, position: 'relative', zIndex: 2 }}>
      {label}<small style={{ display: 'block', fontWeight: 400, color: 'var(--muted)', fontSize: 'var(--fs-small)' }}>{code}</small>
    </button>;
  };
  const value = (r: number, c: number): ReactNode => {
    const color = hundreds.get(`${r},${c}`);
    if (color) return <strong style={{ color }}>100 %</strong>;
    if (r === 3 && c === 3) return <strong>{claimed} %</strong>;
    return <span style={{ color: 'var(--muted)' }} aria-hidden="true">…</span>;
  };
  const caption = actual
    ? <>Grün umrandet: So rechnet die Pressemitteilung. 100 % sind {BASE_WORDS[actual]} ({BASE_NAMES[baseOf(actual)]}).{pick && <> Blau gestrichelt: dein Tipp – {BASE_WORDS[pick]}.</>}</>
    : pick ? <>Dein Tipp: {areaCaption(pick)} – {BASE_WORDS[pick]}. Das wären {BASE_NAMES[baseOf(pick)]}.</>
    : <>Noch kein Tipp. Klick auf einen blauen Zeilen- oder Spaltenkopf oder auf „ganze Tabelle“.</>;

  return <figure className="s04-base" style={{ margin: '10px 0' }}>
    <div className="s04-scroll">
      <div role="group" aria-label={`Kreuztabelle misstrauen × nichtwahl. In der Zelle „misstraut“ / „würde nicht wählen“ stehen die ${claimed} % der Pressemitteilung.`}
        style={{ display: 'grid', gridTemplateColumns: 'minmax(108px, 1.25fr) repeat(3, minmax(70px, 1fr))', gridTemplateRows: 'auto auto auto auto',
          minWidth: 340, maxWidth: 680, background: '#fff', border: '1px solid var(--line)', borderRadius: 8, padding: '18px 8px', position: 'relative', fontSize: 'var(--fs-ui)' }}>
        {active
          ? head(1, 1, 'total', 'ganze Tabelle', 'misstrauen × nichtwahl', 'Die ganze Tabelle als 100 % wählen')
          : <div style={cell(1, 1, { color: 'var(--muted)', fontSize: 'var(--fs-caption)' })}>misstrauen × nichtwahl</div>}
        {active ? head(1, 2, 'col-vote', 'würde wählen', 'nichtwahl = 0', 'Spalte „würde wählen“ als 100 % wählen')
          : <div style={cell(1, 2, { fontWeight: 600 })}>würde wählen</div>}
        {active ? head(1, 3, 'col-nonvote', 'würde nicht wählen', 'nichtwahl = 1', 'Spalte „würde nicht wählen“ als 100 % wählen')
          : <div style={cell(1, 3, { fontWeight: 600 })}>würde nicht wählen</div>}
        <div style={cell(1, 4, { fontWeight: 600 })}>Total</div>
        {active ? head(2, 1, 'row-others', 'misstraut nicht', 'misstrauen = 0', 'Zeile „misstraut nicht“ als 100 % wählen')
          : <div style={cell(2, 1, { fontWeight: 600 })}>misstraut nicht</div>}
        {active ? head(3, 1, 'row-distrust', 'misstraut', 'misstrauen = 1', 'Zeile „misstraut“ als 100 % wählen')
          : <div style={cell(3, 1, { fontWeight: 600 })}>misstraut</div>}
        <div style={cell(4, 1, { fontWeight: 600 })}>Total</div>
        {[2, 3, 4].flatMap(r => [2, 3, 4].map(c => <div key={`${r}${c}`} style={cell(r, c, r === 3 && c === 3 ? { background: '#f3eedf' } : {})}>{value(r, c)}</div>))}
        {marks.map(m => {
          const color = m.kind === 'actual' ? GREEN : m.kind === 'pick' ? BLUE : '#6b6f68';
          const dashed = m.kind === 'hover' || (m.kind === 'pick' && !!actual);
          return <div key={m.kind} aria-hidden="true" style={{
            gridRow: SPAN[m.area].row, gridColumn: SPAN[m.area].col, margin: m.inset ? 5 : 0, position: 'relative', pointerEvents: 'none', zIndex: 3,
            border: `3px ${dashed ? 'dashed' : 'solid'} ${color}`, borderRadius: 6, background: m.kind === 'hover' ? 'transparent' : m.kind === 'pick' && !actual ? 'rgba(50,102,184,.08)' : 'transparent',
          }}>
            <span style={{ position: 'absolute', [m.kind === 'pick' && actual ? 'bottom' : 'top']: -13, [m.kind === 'pick' && actual ? 'left' : 'right']: 8,
              background: color, color: '#fff', font: '600 var(--fs-small)/1.5 var(--sans)', padding: '0 8px', borderRadius: 999, whiteSpace: 'nowrap' }}>{m.tag}</span>
          </div>;
        })}
      </div>
    </div>
    <figcaption style={{ fontSize: 'var(--fs-ui)', color: 'var(--muted)', marginTop: 6 }}>{caption}</figcaption>
  </figure>;
}
