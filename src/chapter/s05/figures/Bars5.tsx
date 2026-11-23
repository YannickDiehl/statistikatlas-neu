// Balkenbilder: Leserichtung (Grundlage 3) und „Dieselben 127 Menschen, drei Nenner“ (Aufgabe 2).
import type { ReactNode } from 'react';
import { ALT, MISS_NW, SEX_TEILZEIT, margins, percent, round1 } from '../content';
import { Arrow, COLORS, Canvas, Fig, T, de, whole } from './parts';

/** Bild „Balken auf 100 %“ mit Klammer für den Abstand in Prozentpunkten (s5-leserichtung). */
export function ReadingDirectionFigure({ caption }: { caption: ReactNode }) {
  const c = SEX_TEILZEIT, { rowSums } = margins(c);
  const x0 = 170, W = 410, h = 34, top = 54, step = 52;
  const names = ['Mann', 'Frau', 'divers'];
  const part = (i: number) => round1(percent(c, 'row', i, 1));
  const yOf = (i: number) => top + i * step;
  const bx = x0 + W + 14, y1 = yOf(0) + h / 2, y2 = yOf(1) + h / 2;
  return <Fig alt={ALT.leserichtung} caption={caption}>
    <Canvas w={790} h={270}>
      <Arrow x1={x0} x2={x0 + W} y={34} />
      <T x={x0 + W / 2} y={22} fontSize={14} fill={COLORS.green} fontWeight={700}>jede Gruppe der UV = 100 %</T>
      {names.map((name, i) => {
        const y = yOf(i), full = round1(percent(c, 'row', i, 0)), p = part(i), wFull = W * full / 100, faint = i === 2;
        return <g key={name} opacity={faint ? 0.5 : 1}>
          <T x={x0 - 10} y={y + 22} textAnchor="end" fontSize={15} fill={COLORS.ink} fontWeight={700}>{`${name} (n = ${whole(rowSums[i])})`}</T>
          <rect x={x0} y={y} width={wFull} height={h} fill={COLORS.blue} stroke={COLORS.blueD} strokeDasharray={faint ? '5 3' : undefined} />
          <rect x={x0 + wFull} y={y} width={W - wFull} height={h} fill={COLORS.orange} stroke={COLORS.orangeD} strokeDasharray={faint ? '5 3' : undefined} />
          <T x={x0 + wFull / 2} y={y + 22} fontSize={14.5} fill={COLORS.ink} fontWeight={700}>{`${de(full)} %`}</T>
          <T x={x0 + wFull + (W - wFull) / 2} y={y + 22} fontSize={14.5} fill={COLORS.ink} fontWeight={700}>{`${de(p)} %`}</T>
        </g>;
      })}
      <T x={bx} y={yOf(2) + 15} textAnchor="start" fontSize={13.5} fill={COLORS.mute}>nur 14 Menschen:</T>
      <T x={bx} y={yOf(2) + 30} textAnchor="start" fontSize={13.5} fill={COLORS.mute}>Prozent schwanken stark</T>
      <path d={`M${bx},${y1} h8 V${y2} h-8`} fill="none" stroke={COLORS.green} strokeWidth={2.5} />
      <T x={bx + 16} y={(y1 + y2) / 2 - 4} textAnchor="start" fontSize={13.5} fill={COLORS.green} fontWeight={700}>{`vergleichen: ${de(part(1))} − ${de(part(0))}`}</T>
      <T x={bx + 16} y={(y1 + y2) / 2 + 12} textAnchor="start" fontSize={13.5} fill={COLORS.green} fontWeight={700}>{`= ${de(round1(part(1) - part(0)))} Prozentpunkte`}</T>
      {[0, 25, 50, 75, 100].map(v => <g key={v}>
        <line x1={x0 + W * v / 100} x2={x0 + W * v / 100} y1={yOf(3) - 8} y2={yOf(3) - 2} stroke={COLORS.gray} />
        <T x={x0 + W * v / 100} y={yOf(3) + 12} fontSize={13}>{`${v} %`}</T>
      </g>)}
      <line x1={x0} x2={x0 + W} y1={yOf(3) - 8} y2={yOf(3) - 8} stroke={COLORS.gray} />
      <rect x={x0} y={yOf(3) + 26} width={14} height={12} rx={3} fill={COLORS.blue} stroke={COLORS.blueD} />
      <T x={x0 + 20} y={yOf(3) + 37} textAnchor="start" fontSize={14}>Vollzeit</T>
      <rect x={x0 + 100} y={yOf(3) + 26} width={14} height={12} rx={3} fill={COLORS.orange} stroke={COLORS.orangeD} />
      <T x={x0 + 120} y={yOf(3) + 37} textAnchor="start" fontSize={14}>Teilzeit oder nebenher</T>
    </Canvas>
  </Fig>;
}

/** Bild „Dieselben 127 Menschen, drei Nenner“ (s5-nenner): Balken so lang wie ihr Nenner. */
export function DenominatorFigure({ caption }: { caption: ReactNode }) {
  const c = MISS_NW, { rowSums, colSums, n } = margins(c), cell = c.cells[1][1];
  const rows = [
    { name: 'Nichtwählende', base: colSums[1], pct: percent(c, 'col', 1, 1), kind: 'col %' },
    { name: 'Misstrauende', base: rowSums[1], pct: percent(c, 'row', 1, 1), kind: 'row %' },
    { name: 'alle in der Tabelle', base: n, pct: percent(c, 'total', 1, 1), kind: 'total %' },
  ];
  const x0 = 12, W = 520, tx = 552;
  return <Fig alt={ALT.nenner} caption={caption}>
    <Canvas w={800} h={210}>
      {rows.map((r, i) => {
        const y = 24 + i * 62, len = W * r.base / n;
        return <g key={r.name}>
          <T x={x0} y={y} textAnchor="start" fontSize={14.5} fill={COLORS.ink} fontWeight={700}>{`${r.name}: ${whole(r.base)}`}</T>
          <rect x={x0} y={y + 8} width={len} height={28} fill="#E4E1D8" stroke="#8d877b" />
          <rect x={x0} y={y + 8} width={W * cell / n} height={28} fill={COLORS.orange} stroke={COLORS.orangeD} />
          <T x={tx} y={y + 27} textAnchor="start" fontSize={14} fill={COLORS.ink}>{`${cell} von ${whole(r.base)} = ${de(round1(r.pct))} % (${r.kind})`}</T>
        </g>;
      })}
    </Canvas>
  </Fig>;
}
