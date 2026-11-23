// Sitzung 10, Grundlage 4: B13 Einfluss eines einzelnen Falls (konstruiert), B14 Interaktion (ALLBUS).
import { useState } from 'react';
import { useChapterState } from '../../ChapterContext';
import { INFLUENCE_POINTS, INFLUENCE_STATES, INTERACTION, THINK } from '../content';
import { ArrowDef, C, Marker, Picture, Switches, T, TextVersion, de, signed } from './common';

/* ---------- B13 ---------- */

const INFLUENCE_TEXT: Record<string, string> = {
  ohne: 'Elf Befragte, zum Beispiel, zwischen 22 und 74 Jahren mit Zufriedenheit zwischen 6 und 8. Ohne Person L steigt die Gerade um 0,022 pro Jahr.',
  mitte: 'L ist 48 Jahre alt, in der Mitte, und sehr unzufrieden (1). Die Gerade rutscht nach unten, ihre Steigung bleibt 0,022.',
  rand: 'L ist 95 Jahre alt, weit draußen, und sehr unzufrieden (1). Die Gerade kippt: Die Steigung wird negativ, minus 0,042.',
  gerade: 'L ist 95 Jahre alt, aber mit Zufriedenheit 8 so, wie die Gerade es erwartet. Die Steigung bleibt fast gleich, 0,020.',
};
export const influenceText = (key: string) => INFLUENCE_TEXT[key];

/** Bild B13 `s10-einfluss`: four states of person L; the switches unlock once the question k4a is answered. */
export function Influence() {
  const { state } = useChapterState();
  const unlocked = !!state.answers[THINK.k4a.id];
  const [key, setKey] = useState('ohne');
  const current = unlocked ? key : 'ohne';
  const s = INFLUENCE_STATES.find(x => x.key === current)!;
  const base = INFLUENCE_STATES[0];
  const w = 760, h = 460, l = 60, rgt = 730, top = 20, bottom = 400;
  const x = (v: number) => l + (v - 20) / 80 * (rgt - l);
  const y = (v: number) => bottom - v / 10 * (bottom - top);
  const line = (a: number, b: number) => ({ x1: x(20), y1: y(a + b * 20), x2: x(100), y2: y(a + b * 100) });
  return <>
    <Switches label="Wo steht Person L?" value={current} onChange={setKey} disabled={!unlocked}
      options={INFLUENCE_STATES.map(st => ({ value: st.key, label: st.label }))} />
    {!unlocked ? <p className="hilfe-zeile">Die Umschalter werden frei, sobald du oben aufgelöst hast.</p> : null}
    <Picture label="Punktwolke: Alter und Lebenszufriedenheit von elf Befragten mit einer Geraden, dazu Person L als Dreieck. Die Werte stehen im Text unter dem Bild.">
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" aria-hidden="true" focusable="false">
        <ArrowDef id="s10-pfeil-b13" color={C.mute} />
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
        {current === 'rand' ? <g>
          <line x1={x(95)} x2={x(95)} y1={y(1) - 10} y2={y(base.intercept + base.b * 95)} stroke={C.mute} strokeWidth={1.5} strokeDasharray="3 3" />
          <T x={x(95) - 8} y={y(4.5)} textAnchor="end" fontSize={13.5} fill={C.mute} fontWeight={700}>weit weg von der Geraden</T>
          <line x1={x(95)} x2={x(95)} y1={bottom - 2} y2={y(1) + 14} stroke={C.mute} strokeWidth={1.5} markerEnd="url(#s10-pfeil-b13)" />
          <T x={x(95) - 8} y={bottom - 8} textAnchor="end" fontSize={13.5} fill={C.mute} fontWeight={700}>weit draußen beim Alter</T>
        </g> : null}
        <T x={rgt - 6} y={top + 16} textAnchor="end" fill={C.teal} fontWeight={800} fontSize={15}>{`B = ${signed(s.b)}`}</T>
      </svg>
    </Picture>
    <TextVersion live>{influenceText(current)}</TextVersion>
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

/* ---------- B14 ---------- */

export const B14_TEXT = 'Mittlere Lebenszufriedenheit. Unter 60 Jahren: nicht erwerbstätig 6,34, erwerbstätig 7,43, Abstand 1,09. Ab 60 Jahren: nicht erwerbstätig 7,57, erwerbstätig 7,63, Abstand 0,06. Die beiden Linien haben ganz verschiedene Neigung: Der Abstand zwischen Erwerbstätigen und Nicht-Erwerbstätigen hängt vom Alter ab.';

/** Bild B14 `s10-interaktion`: two lines with different slopes. */
export function InteractionPlot() {
  const w = 760, h = 330, l = 70, top = 20, bottom = 270;
  const xs = [180, 380];
  const y = (v: number) => bottom - (v - 6) / 2 * (bottom - top);
  const lines = [
    { name: 'unter 60', v: INTERACTION.cells.under60, stroke: C.blueD, fill: C.blue, shape: 'circle' as const, dash: undefined, gap: '+1,09' },
    { name: '60 und älter', v: INTERACTION.cells.over60, stroke: C.greenD, fill: C.green, shape: 'square' as const, dash: '7 5', gap: '+0,06' },
  ];
  return <>
  <Picture label={B14_TEXT}>
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" aria-hidden="true" focusable="false">
      {[6, 6.5, 7, 7.5, 8].map(v => <g key={v}><line x1={l} x2={560} y1={y(v)} y2={y(v)} stroke="#EEEBE4" /><T x={l - 8} y={y(v) + 4} textAnchor="end">{de(v, 1)}</T></g>)}
      <line x1={l} x2={l} y1={top} y2={bottom} stroke={C.ink} strokeWidth={1.5} />
      <line x1={l} x2={560} y1={bottom} y2={bottom} stroke={C.ink} strokeWidth={1.5} />
      <T x={l} y={top - 6} textAnchor="start" fontSize={13}>mittlere Lebenszufriedenheit (Ausschnitt)</T>
      {['nicht erwerbstätig', 'erwerbstätig'].map((n, i) => <T key={n} x={xs[i]} y={bottom + 22} fill={C.ink} fontWeight={700}>{n}</T>)}
      {lines.map(li => <g key={li.name}>
        <line x1={xs[0]} y1={y(li.v[0])} x2={xs[1]} y2={y(li.v[1])} stroke={li.stroke} strokeWidth={3} strokeDasharray={li.dash} />
        {li.v.map((v, i) => <g key={i}>
          <Marker shape={li.shape} x={xs[i]} y={y(v)} fill={li.fill} stroke={li.stroke} r={7} />
          <T x={xs[i] + (i ? 14 : -14)} y={y(v) + (li.name === 'unter 60' ? 16 : -10)} textAnchor={i ? 'start' : 'end'} fill={C.ink} fontWeight={800}>{de(v, 2)}</T>
        </g>)}
        <T x={xs[1] + 70} y={y(li.v[1]) + 4} textAnchor="start" fill={li.stroke} fontWeight={800}>{`${li.name}: Abstand ${li.gap}`}</T>
      </g>)}
      <g transform="translate(580 150)">
        <rect width={170} height={116} rx={10} fill="#FFFCF3" stroke="#E9DFCF" />
        <T x={85} y={18} fontSize={13} fill={C.ink} fontWeight={700}>parallel: keine Interaktion</T>
        <line x1={35} y1={44} x2={135} y2={28} stroke={C.blueD} strokeWidth={2} /><line x1={35} y1={56} x2={135} y2={40} stroke={C.greenD} strokeWidth={2} strokeDasharray="5 4" />
        <T x={85} y={78} fontSize={13} fill={C.ink} fontWeight={700}>verschieden geneigt: Interaktion</T>
        <line x1={35} y1={108} x2={135} y2={88} stroke={C.blueD} strokeWidth={2} /><line x1={35} y1={94} x2={135} y2={96} stroke={C.greenD} strokeWidth={2} strokeDasharray="5 4" />
      </g>
    </svg>
  </Picture>
  <p className="s10-fuss">ALLBUS 2023, gewichtet. Erwerbstätig: Vollzeit, Teilzeit oder nebenher (work 1 bis 3).</p>
  </>;
}
