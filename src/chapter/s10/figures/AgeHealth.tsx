// Sitzung 10, Bild B1 `s10-alter-gesundheit`: life satisfaction by age group, all together and by health (two states).
import { useState } from 'react';
import { AGE_GROUPS, B1 } from '../content';
import { C, Marker, Picture, Switches, T, TextVersion, de } from './common';

type State = 'alle' | 'getrennt';
const STYLE = [
  { shape: 'circle', fill: C.green, stroke: C.greenD, pattern: 'url(#s10-voll)' },
  { shape: 'square', fill: C.blue, stroke: C.blueD, pattern: 'url(#s10-schraffur)' },
  { shape: 'triangle', fill: C.red, stroke: C.redD, pattern: 'url(#s10-punkte)' },
] as const;

const groupWords = ['18 bis 29 Jahre', '30 bis 44', '45 bis 59', '60 bis 74', '75 und älter'];

/** Text version of the state (also read by tests). */
export function ageHealthText(s: State): string {
  if (s === 'alle') return `Mittlere Lebenszufriedenheit nach Altersgruppe: ${B1.all.map((m, i) => `${groupWords[i]} ${de(m, 2)}`).join('; ')}. Von der jüngsten zur ältesten Gruppe steigt sie um ${de(B1.all[4] - B1.all[0], 2)}.`;
  const [g, m, b] = B1.health;
  return `Getrennt nach Gesundheit steigt die Zufriedenheit mit dem Alter in jeder Gruppe stärker. Gute Gesundheit: von ${de(g.means[0], 2)} auf ${de(g.means[4], 2)}, plus ${de(g.rise, 2)}. Zufriedenstellend: von ${de(m.means[0], 2)} auf ${de(m.means[4], 2)}, plus ${de(m.rise, 2)}. Schlechte Gesundheit: von ${de(b.means[0], 2)} auf ${de(b.means[4], 2)}, plus ${de(b.rise, 2)}. Zugleich sind Ältere seltener gesund: Gute Gesundheit haben bei den 18- bis 29-Jährigen ${B1.shares[0][0]} Prozent, bei den ab 75-Jährigen ${B1.shares[4][0]} Prozent; schlechte Gesundheit ${B1.shares[0][2]} gegen ${B1.shares[4][2]} Prozent.`;
}

function Lines({ s }: { s: State }) {
  const w = 760, h = 460, l = 70, rgt = 555, top = 30, bottom = 400;
  const x = (i: number) => l + 40 + i * (rgt - l - 80) / 4;
  const y = (v: number) => bottom - (v - 4) / 5 * (bottom - top);
  const path = (ms: number[]) => ms.map((m, i) => `${i ? 'L' : 'M'}${x(i)},${y(m)}`).join(' ');
  return <svg viewBox={`0 0 ${w} ${h}`} width="100%" aria-hidden="true" focusable="false">
    {[4, 5, 6, 7, 8, 9].map(v => <g key={v}>
      <line x1={l} x2={rgt} y1={y(v)} y2={y(v)} stroke="#E6E3DC" />
      <T x={l - 10} y={y(v) + 4} textAnchor="end">{String(v)}</T>
    </g>)}
    <line x1={l} x2={l} y1={top} y2={bottom} stroke={C.ink} strokeWidth={1.5} />
    <line x1={l} x2={rgt} y1={bottom} y2={bottom} stroke={C.ink} strokeWidth={1.5} />
    {AGE_GROUPS.map((g, i) => <T key={g} x={x(i)} y={bottom + 20} fill={C.ink} fontWeight={700}>{g}</T>)}
    <T x={(l + rgt) / 2} y={bottom + 40} fontSize={13.5}>Altersgruppe</T>
    <T x={18} y={(top + bottom) / 2} fontSize={13.5} transform={`rotate(-90 18 ${(top + bottom) / 2})`}>mittlere Lebenszufriedenheit (0 bis 10)</T>
    <path d={path(B1.all)} fill="none" stroke={s === 'alle' ? C.orangeD : C.gray} strokeWidth={s === 'alle' ? 3 : 2} strokeDasharray={s === 'alle' ? undefined : '6 5'} />
    {s === 'alle' ? B1.all.map((m, i) => <g key={i}>
      <circle cx={x(i)} cy={y(m)} r={6} fill={C.orange} stroke={C.orangeD} strokeWidth={1.5} />
      <T x={x(i)} y={y(m) - 12} fill={C.ink} fontWeight={800}>{de(m, 2)}</T>
    </g>) : null}
    {s === 'alle'
      ? <T x={x(4) + 14} y={y(B1.all[4]) + 4} textAnchor="start" fill={C.orangeD} fontWeight={800}>alle</T>
      : <T x={x(0) + 8} y={y(B1.all[0]) - 10} textAnchor="start" fill={C.mute} fontWeight={800}>alle</T>}
    {s === 'alle' ? <T x={rgt + 10} y={y(7.4)} textAnchor="start" fill={C.ink} fontWeight={700}>von 18–29 bis 75+: +0,50</T> : null}
    {s === 'getrennt' ? B1.health.map((g, k) => <g key={g.key}>
      <path d={path(g.means)} fill="none" stroke={STYLE[k].stroke} strokeWidth={2.5} />
      {g.means.map((m, i) => <Marker key={i} shape={STYLE[k].shape} x={x(i)} y={y(m)} fill={STYLE[k].fill} stroke={STYLE[k].stroke} />)}
      <T x={x(4) + 14} y={y(g.means[4]) + 4} textAnchor="start" fill={STYLE[k].stroke} fontWeight={800}>{`${g.name}  +${de(g.rise, 2)}`}</T>
    </g>) : null}
  </svg>;
}

function Strips() {
  const w = 760, rowH = 26, l = 70, iw = 520;
  return <svg viewBox={`0 0 ${w} ${30 + 5 * (rowH + 6)}`} width="100%" aria-hidden="true" focusable="false">
    <defs>
      <pattern id="s10-voll" width={6} height={6} patternUnits="userSpaceOnUse"><rect width={6} height={6} fill={C.green} /></pattern>
      <pattern id="s10-schraffur" width={6} height={6} patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width={6} height={6} fill={C.blueL} /><rect width={2.5} height={6} fill={C.blue} /></pattern>
      <pattern id="s10-punkte" width={6} height={6} patternUnits="userSpaceOnUse"><rect width={6} height={6} fill="#F6D3CA" /><circle cx={3} cy={3} r={1.4} fill={C.redD} /></pattern>
    </defs>
    <T x={l} y={16} textAnchor="start" fill={C.ink} fontWeight={800}>So gesund ist jede Altersgruppe</T>
    {B1.shares.map((row, i) => {
      let at = l;
      const yy = 26 + i * (rowH + 6);
      return <g key={i}>
        <T x={l - 10} y={yy + rowH / 2 + 4} textAnchor="end" fill={C.ink} fontWeight={700}>{AGE_GROUPS[i]}</T>
        {row.map((p, k) => {
          const bw = p / 100 * iw, x0 = at;
          at += bw;
          return <g key={k}>
            <rect x={x0} y={yy} width={bw} height={rowH} fill={STYLE[k].pattern} stroke="#fff" strokeWidth={1} />
            {p >= 7 ? <T x={x0 + bw / 2} y={yy + rowH / 2 + 4} fill={C.ink} fontWeight={800} fontSize={13.5}>{`${p} %`}</T> : null}
          </g>;
        })}
      </g>;
    })}
    {['gut', 'zufriedenstellend', 'schlecht'].map((n, k) => <g key={n}>
      <rect x={l + iw + 20} y={30 + k * 26} width={16} height={16} fill={STYLE[k].pattern} stroke={STYLE[k].stroke} />
      <T x={l + iw + 42} y={43 + k * 26} textAnchor="start" fill={C.ink}>{n}</T>
    </g>)}
  </svg>;
}

export function AgeHealth() {
  const [s, setS] = useState<State>('alle');
  return <>
    <Switches label="Ansicht des Bildes" value={s} onChange={setS}
      options={[{ value: 'alle', label: 'alle zusammen' }, { value: 'getrennt', label: 'getrennt nach Gesundheit' }]} />
    <Picture label={s === 'alle' ? 'Liniendiagramm: mittlere Lebenszufriedenheit nach fünf Altersgruppen, alle zusammen. Die Werte stehen im Text unter dem Bild.' : 'Liniendiagramm: mittlere Lebenszufriedenheit nach fünf Altersgruppen, getrennt nach Gesundheit, darunter die Gesundheit je Altersgruppe. Die Werte stehen im Text unter dem Bild.'}>
      <Lines s={s} />
      {s === 'getrennt' ? <Strips /> : null}
    </Picture>
    <p className="hilfe-zeile">Achse beginnt bei 4: Hier werden Linien verglichen, keine Balkenlängen.</p>
    <TextVersion live>{ageHealthText(s)}</TextVersion>
    <p className="s10-fuss">ALLBUS 2023, gewichtet, Befragte mit Angaben zu Alter, Gesundheit und Lebenszufriedenheit. Kleinste Gruppe: 18–29 mit schlechter Gesundheit, {B1.smallestCell} Befragte.</p>
    <details className="werte">
      <summary>Werte als Tabelle</summary>
      <table className="daten">
        <caption>Mittlere Lebenszufriedenheit nach Altersgruppe und Gesundheit</caption>
        <thead><tr><th scope="col">Altersgruppe</th><th scope="col">alle</th>{B1.health.map(g => <th key={g.key} scope="col">{g.name}</th>)}<th scope="col">Anteile gut | zufriedenstellend | schlecht (%)</th></tr></thead>
        <tbody>{AGE_GROUPS.map((a, i) => <tr key={a}>
          <th scope="row">{a}</th><td>{de(B1.all[i], 2)}</td>{B1.health.map(g => <td key={g.key}>{de(g.means[i], 2)}</td>)}<td>{B1.shares[i].join(' | ')}</td>
        </tr>)}</tbody>
      </table>
    </details>
  </>;
}
