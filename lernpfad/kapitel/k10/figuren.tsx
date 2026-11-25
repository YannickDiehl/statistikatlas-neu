// Erklärfassungen von Atlas-Bildern aus src/chapter/s10/figures, die dort an eine Übung gebunden sind.
// Influence (Limits.tsx) bleibt im Atlas gesperrt, bis die Frage k4a beantwortet ist. Hier sind die vier Zustände von Person L
// gleich frei; Zeichnung, Texte und Tabelle sind dieselben. (AgeHealth ist im Atlas selbst ohne Übung; versteckt hat es nur
// GuessReveal. Es steht darum direkt in inhalt.tsx.)
import { useState } from 'react';
import { INFLUENCE_POINTS, INFLUENCE_STATES } from '@atlas/chapter/s10/content';
import { influenceText } from '@atlas/chapter/s10/figures/Limits';
import { ArrowDef, C, Marker, Picture, Switches, T, TextVersion, de, signed } from '@atlas/chapter/s10/figures/common';

/** Bild B13 `s10-einfluss` ohne Sperre: Person L in vier Zuständen, frei umschaltbar. */
export function EinflussErklaert() {
  const [key, setKey] = useState('ohne');
  const s = INFLUENCE_STATES.find(x => x.key === key)!;
  const base = INFLUENCE_STATES[0];
  const w = 760, h = 460, l = 60, rgt = 730, top = 20, bottom = 400;
  const x = (v: number) => l + (v - 20) / 80 * (rgt - l);
  const y = (v: number) => bottom - v / 10 * (bottom - top);
  const line = (a: number, b: number) => ({ x1: x(20), y1: y(a + b * 20), x2: x(100), y2: y(a + b * 100) });
  return <>
    <Switches label="Wo steht Person L?" value={key} onChange={setKey}
      options={INFLUENCE_STATES.map(st => ({ value: st.key, label: st.label }))} />
    <Picture label="Punktwolke: Alter und Lebenszufriedenheit von elf Befragten mit einer Geraden, dazu Person L als Dreieck. Die Werte stehen im Text unter dem Bild.">
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" aria-hidden="true" focusable="false">
        <ArrowDef id="k10-pfeil-einfluss" color={C.mute} />
        {[0, 2, 4, 6, 8, 10].map(v => <g key={v}><line x1={l} x2={rgt} y1={y(v)} y2={y(v)} stroke="#EEEBE4" /><T x={l - 8} y={y(v) + 4} textAnchor="end">{String(v)}</T></g>)}
        {[20, 30, 40, 50, 60, 70, 80, 90, 100].map(v => <g key={v}><line x1={x(v)} x2={x(v)} y1={bottom} y2={bottom + 5} stroke={C.ink} /><T x={x(v)} y={bottom + 20}>{String(v)}</T></g>)}
        <line x1={l} x2={l} y1={top} y2={bottom} stroke={C.ink} strokeWidth={1.5} />
        <line x1={l} x2={rgt} y1={bottom} y2={bottom} stroke={C.ink} strokeWidth={1.5} />
        <T x={(l + rgt) / 2} y={bottom + 42} fontSize={13.5}>Alter</T>
        <T x={16} y={(top + bottom) / 2} fontSize={13.5} transform={`rotate(-90 16 ${(top + bottom) / 2})`}>Lebenszufriedenheit</T>
        {s.l ? <line {...line(base.intercept, base.b)} stroke={C.gray} strokeWidth={2} strokeDasharray="6 5" /> : null}
        <line {...line(s.intercept, s.b)} stroke={C.teal} strokeWidth={3} />
        {INFLUENCE_POINTS.map(([a, z], i) => <circle key={i} cx={x(a)} cy={y(z)} r={7} fill={C.blue} stroke={C.blueD} strokeWidth={1.5} />)}
        {s.l ? <g>
          <Marker shape="triangle" x={x(s.l[0])} y={y(s.l[1])} r={8} fill={C.orange} stroke={C.orangeD} />
          <T x={x(s.l[0]) - 14} y={y(s.l[1]) + 5} textAnchor="end" fill={C.orangeD} fontWeight={800}>L</T>
        </g> : null}
        {key === 'rand' ? <g>
          <line x1={x(95)} x2={x(95)} y1={y(1) - 10} y2={y(base.intercept + base.b * 95)} stroke={C.mute} strokeWidth={1.5} strokeDasharray="3 3" />
          <T x={x(95) - 8} y={y(4.5)} textAnchor="end" fontSize={13.5} fill={C.mute} fontWeight={700}>weit weg von der Geraden</T>
          <line x1={x(95)} x2={x(95)} y1={bottom - 2} y2={y(1) + 14} stroke={C.mute} strokeWidth={1.5} markerEnd="url(#k10-pfeil-einfluss)" />
          <T x={x(95) - 8} y={bottom - 8} textAnchor="end" fontSize={13.5} fill={C.mute} fontWeight={700}>weit draußen beim Alter</T>
        </g> : null}
        <T x={rgt - 6} y={top + 16} textAnchor="end" fill={C.teal} fontWeight={800} fontSize={15}>{`B = ${signed(s.b)}`}</T>
      </svg>
    </Picture>
    <TextVersion live>{influenceText(key)}</TextVersion>
    <details className="werte">
      <summary>Alle vier Zustände als Tabelle</summary>
      <table className="daten">
        <caption>Gerade mit und ohne Person L (zwölf Befragte, zum Beispiel)</caption>
        <thead><tr><th scope="col">Zustand</th><th scope="col">Person L (Alter, Zufriedenheit)</th><th scope="col">Konstante</th><th scope="col">B</th></tr></thead>
        <tbody>{INFLUENCE_STATES.map(st => <tr key={st.key}>
          <th scope="row">{st.label}</th><td>{st.l ? `${st.l[0]} Jahre, ${st.l[1]}` : 'nicht dabei'}</td><td>{de(st.intercept, 2)}</td><td>{de(st.b)}</td>
        </tr>)}</tbody>
      </table>
    </details>
  </>;
}
