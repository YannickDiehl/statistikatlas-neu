// Erklärfassung eines Atlas-Bilds, das dort eine Übung eingebaut hat: TwoSteps (B9) zeichnet die beiden Schritte auf der
// S-Kurve erst nach „Festlegen“ und „Auflösen“. Hier ohne Festlegen: zum Durchklicken, erst ein Schritt, dann der andere, dann beide.
import { useState } from 'react';
import { byHand } from '@atlas/chapter/s11/content';
import { SvgText } from '@atlas/chapter/s11/ui';
import { INK, TEAL } from '@atlas/chapter/s11/figures/Topic1';
import { B9_TEXT, stepLines } from '@atlas/chapter/s11/figures/Topic3';

const SCHRITTE = [{ from: 30, color: '#2C6CA8', fill: '#EAF5FC' }, { from: 70, color: '#c97b55', fill: '#FFF0E8' }];
const ANSICHTEN: { name: string; zeige: number[]; text: string }[] = [
  { name: 'Von 30 auf 40', zeige: [30],
    text: 'Von 30 auf 40 Jahre: Der Logit sinkt um 0,76, die Chance wird mit 0,47 malgenommen (von 89,5 auf 41,8). In Prozent geht es nur von 98,9 auf 97,7 %, also 1,2 Prozentpunkte. Oben ist die S-Kurve flach.' },
  { name: 'Von 70 auf 80', zeige: [70],
    text: 'Von 70 auf 80 Jahre: Der Logit sinkt wieder um 0,76, die Chance wird wieder mit 0,47 malgenommen (von 4,28 auf 2,00). In Prozent geht es aber von 81,1 auf 66,7 %, also 14,4 Prozentpunkte. Hier ist die S-Kurve steil.' },
  { name: 'Beide', zeige: [30, 70],
    text: 'Beide zusammen: In Logits und in Chancen derselbe Schritt. In Prozentpunkten verliert die 70-Jährige zwölfmal so viel wie die 30-Jährige: 14,4 statt 1,2. Wie viel ein Schritt in Prozentpunkten bringt, hängt davon ab, wo jemand auf der S-Kurve steht.' },
];

/** B9 als Erklärbild: dieselben zehn Jahre an zwei Stellen der S-Kurve, ohne Festlegen. */
export function ZweiSchritte() {
  const [i, setI] = useState(2); const a = ANSICHTEN[i];
  const W = 660, H = 330, L = 50, R = 250, T = 20, B = 40;
  const x = (age: number) => L + (age - 15) / 80 * (W - L - R);
  const y = (p: number) => T + (100 - p) / 100 * (H - T - B);
  const path = Array.from({ length: 78 }, (_, k) => 18 + k).map((age, k) => `${k ? 'L' : 'M'}${x(age).toFixed(1)},${y(byHand(age).p).toFixed(1)}`).join(' ');
  return <>
    <ul className="schritt-nav" aria-label="Welcher Schritt im Bild">
      {ANSICHTEN.map((v, k) => <li key={v.name}><button type="button" aria-current={k === i ? 'step' : 'false'} onClick={() => setI(k)}>{v.name}</button></li>)}
    </ul>
    <div className="grafik" role="img" aria-label={B9_TEXT}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" aria-hidden="true" focusable="false">
        {[0, 25, 50, 75, 100].map(p => <g key={p}>
          <line x1={L} x2={W - R} y1={y(p)} y2={y(p)} stroke="#EFE6DA" />
          <SvgText x={L - 6} y={y(p) + 4} textAnchor="end" fontSize={11}>{`${p} %`}</SvgText>
        </g>)}
        {[20, 40, 60, 80].map(age => <SvgText key={age} x={x(age)} y={H - B + 16} fontSize={11}>{String(age)}</SvgText>)}
        <SvgText x={(L + W - R) / 2} y={H - 6} fontSize={12} fontWeight={700} fill={INK}>Alter in Jahren</SvgText>
        <line x1={L} x2={L} y1={T} y2={H - B} stroke={INK} strokeWidth={1.2} />
        <line x1={L} x2={W - R} y1={H - B} y2={H - B} stroke={INK} strokeWidth={1.2} />
        <path d={path} fill="none" stroke={TEAL} strokeWidth={3} />
        {SCHRITTE.map((s, k) => {
          const p0 = byHand(s.from), p1 = byHand(s.from + 10), an = a.zeige.includes(s.from);
          return <g key={s.from} opacity={an ? 1 : 0.25}>
            <circle cx={x(s.from)} cy={y(p0.p)} r={6} fill={s.fill} stroke={s.color} strokeWidth={2.5} />
            <line x1={x(s.from)} x2={x(s.from + 10)} y1={y(p0.p)} y2={y(p0.p)} stroke={s.color} strokeWidth={2.5} />
            <line x1={x(s.from + 10)} x2={x(s.from + 10)} y1={y(p0.p)} y2={y(p1.p)} stroke={s.color} strokeWidth={4} />
            <circle cx={x(s.from + 10)} cy={y(p1.p)} r={6} fill={s.color} />
            <g transform={`translate(${W - R + 14},${k ? 170 : 40})`}>
              <rect width={236} height={84} rx={10} fill={s.fill} stroke={s.color} />
              <SvgText x={10} y={20} textAnchor="start" fontWeight={800} fill={INK} fontSize={12.5}>{`${s.from} → ${s.from + 10} Jahre`}</SvgText>
              {stepLines(s.from).map((t, j) => <SvgText key={j} x={10} y={40 + j * 16} textAnchor="start" fontSize={10.5} fill={INK}>{t}</SvgText>)}
            </g>
          </g>;
        })}
      </svg>
    </div>
    <div className="erkl" aria-live="polite">{a.text}</div>
  </>;
}
