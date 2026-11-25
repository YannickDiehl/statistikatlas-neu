import type { ReactNode } from 'react';
import { WEST_EAST } from '../content';
import { SvgText, whole } from './Bars';

/** Text version of the real boxplot, from the same numbers as the picture. */
export const AGE_BOXPLOT_TEXT = `Zwei Boxplots. ${WEST_EAST.age.map(g =>
  `${g.group}, ${whole(g.n)} Personen: Box von ${g.q1} bis ${g.q3} Jahre, Median ${g.median}, Whisker von ${g.lo} bis ${g.hi}.`).join(' ')}`;

/** „So sieht ein echter Boxplot aus“: age in West and East (aggregates only), with a text version for screen readers. */
export function AgeBoxplot() {
  const w = 620, h = 170, x = (v: number) => 120 + (v - 10) / 90 * (w - 150);
  const ticks: ReactNode[] = [];
  for (let v = 20; v <= 100; v += 10) {
    ticks.push(<line key={`t${v}`} x1={x(v)} x2={x(v)} y1={h - 26} y2={h - 21} stroke="#5F6A74" />);
    ticks.push(<SvgText key={`l${v}`} x={x(v)} y={h - 8}>{String(v)}</SvgText>);
  }
  return <>
    <div className="grafik">
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" aria-hidden="true" focusable="false">
        {WEST_EAST.age.map((g, i) => {
          const y = 40 + i * 58;
          return <g key={g.group}>
            <SvgText x={40} y={y + 5} fill="#1E2D3C" fontWeight={800} fontSize={14}>{g.group}</SvgText>
            <SvgText x={40} y={y + 20} fontSize={11}>{`n = ${whole(g.n)}`}</SvgText>
            <line x1={x(g.lo)} x2={x(g.hi)} y1={y} y2={y} stroke="#1E2D3C" strokeWidth={2} />
            {[g.lo, g.hi].map((v, k) => <line key={k} x1={x(v)} x2={x(v)} y1={y - 9} y2={y + 9} stroke="#1E2D3C" strokeWidth={2} />)}
            <rect x={x(g.q1)} y={y - 18} width={x(g.q3) - x(g.q1)} height={36} rx={5} fill="#FFF0E8" stroke="#1E2D3C" strokeWidth={2.2} />
            <line x1={x(g.median)} x2={x(g.median)} y1={y - 18} y2={y + 18} stroke="#8a4a2c" strokeWidth={3.5} />
            <SvgText x={x(g.median)} y={y - 23} fill="#8a4a2c" fontWeight={800} fontSize={12}>{String(g.median)}</SvgText>
          </g>;
        })}
        {ticks}
        <line x1={x(10)} x2={x(100)} y1={h - 26} y2={h - 26} stroke="#5F6A74" />
        <SvgText x={x(10) - 4} y={h - 8} textAnchor="end" fontSize={11.5} fontWeight={700}>Alter in Jahren</SvgText>
      </svg>
    </div>
    <p className="sr-only">{AGE_BOXPLOT_TEXT}</p>
  </>;
}
