// Erklärfassungen von Atlas-Bildern, die dort eine Übung eingebaut haben:
// OstStichprobe statt EstimateEast (Schätzen mit Regler und „Tipp abgeben“), PaareZeigen statt PairCounter (Einordnen mit Prüfung).
import { useState } from 'react';
import { CAT, ROLE } from '@atlas/tasks/kit/palette';
import { ALT, EASTWEST, PERSONS } from '@atlas/chapter/s06/content';
import { Plate } from '@atlas/chapter/s06/figures/Weighting';
import { END_TEXT, PAIRS, pairSentence, type Pair } from '@atlas/chapter/s06/figures/Pairs';
import { Picture, SvgText } from '@atlas/chapter/s06/figures/util';

/** Zwei Bauplatten aus je 100 Steinen, gleich aufgedeckt: ALLBUS (Stichprobe) und Deutschland. */
export function OstStichprobe() {
  const sample = Math.round(EASTWEST.east.pct), germany = Math.round(EASTWEST.east.wPct);
  return <>
    <Picture text={ALT.stichprobe} className="s6-stichprobe">
      <div className="s6-platten">
        <Plate east={sample} title="ALLBUS (Stichprobe)" />
        <Plate east={germany} title="Deutschland" />
      </div>
    </Picture>
    <p className="legende" aria-hidden="true"><span><i style={{ background: CAT[0] }} />West</span><span><i style={{ background: CAT[1] }} />Ost</span></p>
  </>;
}

type Person = (typeof PERSONS)[number];

/** Raster Schicht × Gesundheit mit den fünf Personen; das gewählte Paar ist verbunden (wie im Atlas-Paar-Zähler). */
function Raster({ pair }: { pair: Pair | null }) {
  const w = 300, h = 260, l = 46, b = 40, step = 52;
  const x = (v: number) => l + (v - 0.5) * step, y = (v: number) => h - b - (v - 0.5) * step;
  const on = (p: Person) => !!pair && (pair.a === p || pair.b === p);
  return <svg viewBox={`0 0 ${w} ${h}`} width="100%" aria-hidden="true" focusable="false">
    {[1, 2, 3, 4].map(v => <g key={v}>
      <SvgText x={x(v)} y={h - b + 18} fontSize={12}>{String(v)}</SvgText>
      <SvgText x={l - 14} y={y(v) + 4} fontSize={12}>{String(v)}</SvgText>
      <line x1={x(v)} x2={x(v)} y1={y(4.5)} y2={y(0.5)} stroke="#eee8dc" />
      <line x1={x(0.5)} x2={x(4.5)} y1={y(v)} y2={y(v)} stroke="#eee8dc" />
    </g>)}
    <line x1={x(0.5)} x2={x(4.5)} y1={y(0.5)} y2={y(0.5)} stroke="#1E2D3C" strokeWidth={1.5} />
    <line x1={x(0.5)} x2={x(0.5)} y1={y(0.5)} y2={y(4.5)} stroke="#1E2D3C" strokeWidth={1.5} />
    <SvgText x={(x(0.5) + x(4.5)) / 2} y={h - 6} fontSize={12} fontWeight={700}>Schicht</SvgText>
    <SvgText x={12} y={(y(0.5) + y(4.5)) / 2} fontSize={12} fontWeight={700} transform={`rotate(-90 12 ${(y(0.5) + y(4.5)) / 2})`}>Gesundheit</SvgText>
    {pair ? <line x1={x(pair.a.layer)} y1={y(pair.a.health)} x2={x(pair.b.layer)} y2={y(pair.b.health)} stroke={ROLE.data} strokeWidth={3} /> : null}
    {PERSONS.map(p => <g key={p.name}>
      <rect x={x(p.layer) - 15} y={y(p.health) - 15} width={30} height={30} rx={6} fill={on(p) ? ROLE.dataLight : '#FFE7A3'} stroke={on(p) ? ROLE.data : '#EFC867'} strokeWidth={on(p) ? 3 : 1.5} />
      <SvgText x={x(p.layer)} y={y(p.health) + 5} fontSize={15} fontWeight={800} fill="#1E2D3C">{p.name}</SvgText>
    </g>)}
  </svg>;
}

const art = (p: Pair) => p.kind.startsWith('Gleichstand') ? 'Gleichstand' : p.kind;

/** Die zehn Paare zum Durchklicken: Jedes Paar zeigt seine Einordnung und den Satz dazu, ohne Frage und ohne Prüfung. */
export function PaareZeigen() {
  const [i, setI] = useState(0); const pair = PAIRS[i];
  const bild = `Raster mit Schicht (1 bis 4) nach rechts und Gesundheit (1 bis 4) nach oben. ${PERSONS.map(p => `${p.name}: Schicht ${p.layer}, Gesundheit ${p.health}`).join('. ')}. Verbunden ist das Paar ${pair.a.name} und ${pair.b.name}: ${art(pair)}.`;
  return <div className="s6-paare">
    <ul className="schritt-nav" aria-label="Paar wählen">
      {PAIRS.map((p, k) => <li key={p.id}><button type="button" aria-current={k === i ? 'step' : 'false'} onClick={() => setI(k)}>{p.id}</button></li>)}
    </ul>
    <div className="s6-paare-grid">
      <div className="grafik" role="img" aria-label={bild}><Raster pair={pair} /></div>
      <div>
        <p className="rueck text" aria-live="polite">{`${pair.id}: ${pairSentence(pair)}`}</p>
        <p className="hilfe-zeile">{`Alle zehn Paare zusammen: ${END_TEXT.replace(/^Endstand: /, '')}`}</p>
      </div>
    </div>
    <details className="werte">
      <summary>Textfassung: alle zehn Paare</summary>
      <ul>{PAIRS.map(p => <li key={p.id}>{`${p.id}: ${p.kind}. ${pairSentence(p)}`}</li>)}</ul>
    </details>
  </div>;
}
