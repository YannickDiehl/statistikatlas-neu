import { useState } from 'react';
import { AGE, AGE_FROM } from '../content';
import { SvgText, whole } from './Bars';

const WIDTHS = [1, 2, 5, 10, 20];
const AGE_TO = AGE_FROM + AGE.length - 1;

/** Age counts in bins of `width` years; bins start at multiples of the width (boundary = 0). */
export function ageBins(width: number): { from: number; n: number }[] {
  const start = Math.floor(AGE_FROM / width) * width, bins: { from: number; n: number }[] = [];
  for (let a = start; a <= AGE_TO; a += width) {
    let n = 0;
    for (let j = a; j < a + width; j++) if (j >= AGE_FROM && j <= AGE_TO) n += AGE[j - AGE_FROM];
    bins.push({ from: a, n });
  }
  return bins;
}

const widthText = (b: number) => `${b} ${b === 1 ? 'Jahr' : 'Jahre'}`;
const binLabel = (from: number, b: number) => (b === 1 ? `${from} Jahre` : `${from} bis ${from + b - 1} Jahre`);

/** Live text: bin width, number of bins and the fullest bin. */
export function histText(width: number): string {
  const bins = ageBins(width), top = bins.reduce((m, x) => (x.n > m.n ? x : m));
  return `Klassenbreite ${widthText(width)}: ${bins.length} Klassen. Die vollste Klasse: ${binLabel(top.from, width)} mit ${whole(top.n)} Befragten.`;
}

/** Grundlage 3a: histogram of age with a bin-width slider; the text below names the bins and the fullest one. */
export function Histogram() {
  const [k, setK] = useState(2);
  const b = WIDTHS[k], bins = ageBins(b), start = bins[0].from;
  const w = 660, h = 230, pad = { l: 34, r: 8, t: 8, b: 26 }, iw = w - pad.l - pad.r, ih = h - pad.t - pad.b;
  const max = Math.max(...bins.map(x => x.n)), x = (v: number) => pad.l + (v - start) / (bins.length * b) * iw;
  const labels: number[] = [];
  for (let v = 20; v <= 100; v += 10) if (v >= start) labels.push(v);
  return <>
    <div className="feld">
      <label htmlFor="hist-breite">Klassenbreite</label>
      <input type="range" id="hist-breite" min={0} max={4} step={1} value={k} aria-valuetext={widthText(b)} onChange={e => setK(Number(e.target.value))} />
      {/* The live text below already announces the width; the output (implicit status role) stays silent. */}
      <output htmlFor="hist-breite" aria-live="off">{widthText(b)}</output>
    </div>
    <div className="grafik">
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" aria-hidden="true" focusable="false">
        {bins.map(bin => {
          const bh = bin.n / max * ih;
          return <rect key={bin.from} x={x(bin.from) + 0.5} y={pad.t + ih - bh} width={Math.max(1, x(bin.from + b) - x(bin.from) - 1)} height={bh}
            fill="#86B9DE" stroke="#5f97c2" strokeWidth={0.6} />;
        })}
        <line x1={pad.l} x2={w - pad.r} y1={pad.t + ih} y2={pad.t + ih} stroke="#9aa4ad" strokeWidth={1.5} />
        {labels.map(v => <SvgText key={v} x={x(v)} y={h - 6}>{String(v)}</SvgText>)}
        <SvgText x={10} y={pad.t + 10} textAnchor="start" fontSize={11}>{String(max)}</SvgText>
      </svg>
    </div>
    <p className="rueck text" aria-live="polite">{histText(b)}</p>
    <details className="werte">
      <summary>Werte als Tabelle</summary>
      <table className="daten">
        <caption>{`Befragte je Klasse, Klassenbreite ${widthText(b)}`}</caption>
        <thead><tr><th scope="col">Alter</th><th scope="col">Befragte</th></tr></thead>
        <tbody>{bins.map(bin => <tr key={bin.from}><td>{binLabel(bin.from, b)}</td><td>{whole(bin.n)}</td></tr>)}</tbody>
      </table>
    </details>
  </>;
}
