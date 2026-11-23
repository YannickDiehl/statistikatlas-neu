import { useState } from 'react';
import { FORMS, LAB, LAB_NAMES, ZWEI } from '../content';
import { Bars, de, stats, whole } from './Bars';

/** Grundlage 2a: the four real shapes, each with scale, reading, mean and median and the column heights as text. */
export function Shapes() {
  return <div className="raetsel formen">
    {FORMS.map(f => {
      const s = stats(f.values, f.counts);
      return <figure key={f.id}>
        <figcaption>{f.name}</figcaption>
        <p className="f-frage">{f.question} <span>(<code>{f.id}</code>, n = {whole(s.n)})</span></p>
        <div><Bars values={f.values} counts={f.counts} w={320} h={150} stones={12} minStone marker /></div>
        <p className="hilfe-zeile">{f.scale}</p>
        <p className="f-zeile"><b>Erkennen:</b> {f.recognize}</p>
        <p className="f-zeile f-eng"><b>Heißt:</b> {f.means}</p>
        <p className="f-kennzahlen">Mittelwert (Dreieck): {de(s.mean, 2)}<br />Median (Strich): {String(s.median).replace('-', '−')}</p>
        <p className="sr-only">{`Säulenhöhen von links nach rechts: ${f.values.map((v, i) => `${String(v).replace('-', 'minus ')}: ${whole(f.counts[i])}`).join(', ')}.`}</p>
      </figure>;
    })}
  </div>;
}

const LAB_VALUES = [...Array(11).keys()];
const labCounts = (k: number, two: boolean) => (two ? ZWEI : LAB[k]);

/** Live text of the lab: shape, mean, median and where they lie. */
export function labText(k: number, two: boolean): string {
  const s = stats(LAB_VALUES, labCounts(k, two));
  const d = s.mean - s.median;
  const where = two ? 'Mittelwert und Median liegen zwischen den Gipfeln, also genau dort, wo wenige stehen.'
    : Math.abs(d) < 0.25 ? 'Mittelwert und Median liegen fast gleich.'
      : d < 0 ? 'Der Mittelwert liegt links vom Median: Der lange Auslauf zieht ihn nach links.'
        : 'Der Mittelwert liegt rechts vom Median: Der lange Auslauf zieht ihn nach rechts.';
  return `${two ? 'zweigipflig' : LAB_NAMES[k]}: Mittelwert ${de(s.mean, 1)}, Median ${de(s.median, 1)}. ${where}`;
}

/** Column heights of the current lab shape, as in the text versions of the four real shapes. */
export function labHeights(k: number, two: boolean): string {
  return `Säulenhöhen von links nach rechts: ${labCounts(k, two).map((c, v) => `${v}: ${c}`).join(', ')}.`;
}

/** Grundlage 2a „Formen-Labor“: a slider through five shapes (or two peaks); mean and median move along. */
export function ShapeLab() {
  const [k, setK] = useState(2);
  const [two, setTwo] = useState(false);
  const counts = labCounts(k, two);
  return <>
    <div className="feld">
      <label htmlFor="lab-form">Form</label>
      <input type="range" id="lab-form" min={0} max={4} step={1} value={k} disabled={two} aria-valuetext={LAB_NAMES[k]}
        onChange={e => setK(Number(e.target.value))} />
      <label className="lab-zwei"><input type="checkbox" checked={two} onChange={e => setTwo(e.target.checked)} /> zwei Gipfel</label>
    </div>
    <div className="grafik"><Bars values={LAB_VALUES} counts={counts} h={190} stones={Math.max(...counts)} marker /></div>
    <p className="rueck text" aria-live="polite">{labText(k, two)}</p>
    <p className="sr-only">{labHeights(k, two)}</p>
  </>;
}
