import { useState, type ReactNode } from 'react';
import { useChapterState } from '../../ChapterContext';
import { BASIS, V4_Q } from '../content';
import { ChoiceCheck } from './ChoiceCheck';
import { SvgText, de } from './Bars';

const STEPS = ['Mittelwert', 'Median', 'Quartile', 'Box und Whisker'];
const Q1 = 34, Q3 = 43, MEDIAN = 40;

function explain(step: number, values: number[]): ReactNode {
  const sum = values.reduce((a, b) => a + b, 0), mean = sum / values.length;
  switch (step) {
    case 1: return <><b>Mittelwert:</b> Stell dir das Lineal als Wippe vor. Der Mittelwert ist der Punkt, an dem sie im Gleichgewicht ist: alle Stunden zusammen ({sum}) geteilt durch 11 Personen = <b>{`${de(mean, 1)} Stunden`}</b>. Kurz gesagt: der Schwerpunkt.</>;
    case 2: return <><b>Median:</b> Zähl von links. Die sechste Person steht genau in der Mitte: fünf links, fünf rechts. Sie arbeitet <b>40 Stunden</b>. Kurz gesagt: Die eine Hälfte arbeitet weniger, die andere mehr.</>;
    case 3: return <><b>Quartile:</b> Die mittlere Person zählt zu keiner Hälfte. Links von ihr stehen fünf, rechts fünf. Teil jede Hälfte noch einmal in der Mitte: Die dritte Person (<b>34 Stunden</b>) ist das untere Quartil, die neunte (<b>43 Stunden</b>) das obere. Kurz gesagt: Zwischen ihnen steht die mittlere Hälfte der Personen.</>;
    default: return <><b>Box und Whisker:</b> Um die mittlere Hälfte zeichnest du einen Kasten, die <b>Box</b>, den Median als Linie hinein. Die <b>Whisker</b> (im Bild: Antennen) reichen links und rechts bis zum kleinsten und größten Wert (höchstens anderthalb Boxlängen weit, siehe Genauer erklärt). Fertig ist der <b>Boxplot</b>. Die Länge der Box (43 − 34 = 9 Stunden) heißt <b>Interquartilsabstand</b>.</>;
  }
}

/** Text version of the ruler picture; it names exactly what the current step shows. */
export function rulerText(step: number, short: boolean, values: number[]) {
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  return `Elf Personen auf dem Lineal: ${[...values].sort((a, b) => a - b).join(', ')} Stunden. Mittelwert ${de(mean, 1)}.`
    + (step >= 2 ? ' Median 40.' : '') + (step >= 3 ? ' Quartile 34 und 43.' : '')
    + (step >= 4 ? (short ? ' Box von 34 bis 43, Whisker von 28 bis 45, die 0 ist ein Ausreißer-Punkt.' : ' Box von 34 bis 43, Whisker von 22 bis 45.') : '');
}

function Ruler({ step, short, values }: { step: number; short: boolean; values: number[] }) {
  const w = 540, h = 300, line = 170, x = (v: number) => 22 + v / 50 * (w - 44);
  const sorted = [...values].sort((a, b) => a - b), taken: { s: number; x: number }[] = [];
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const ticks: ReactNode[] = [];
  for (let v = 0; v <= 50; v += 5) {
    ticks.push(<line key={`t${v}`} x1={x(v)} x2={x(v)} y1={line} y2={line + (v % 10 ? 5 : 9)} stroke="#1E2D3C" />);
    if (v % 10 === 0) ticks.push(<SvgText key={`l${v}`} x={x(v)} y={line + 22} fontSize={12}>{`${v} Std.`}</SvgText>);
  }
  const people = sorted.map((v, i) => {
    let s = 1;
    while (taken.some(b => b.s === s && Math.abs(b.x - x(v)) < 23)) s++;
    taken.push({ s, x: x(v) });
    const y = line - 6 - s * 25;
    const middle = step >= 2 && i === 5, quart = step >= 3 && (i === 2 || i === 8), isNew = short && v === 0;
    return <g key={i}>
      <rect x={x(v) - 11} y={y} width={22} height={22} rx={5} strokeWidth={1.5}
        fill={isNew ? '#fdeeea' : middle ? '#FFD2BC' : quart ? '#E6D3F2' : '#FFF6DA'}
        stroke={isNew ? '#a0452f' : middle ? '#c97b55' : quart ? '#8a6fc9' : '#E0C46A'} />
      <SvgText x={x(v)} y={y + 15} fontSize={11} fill="#1E2D3C" fontWeight={800}>{String(i + 1)}</SvgText>
    </g>;
  });
  let box: ReactNode = null;
  if (step >= 4) {
    const by = 258, fence = Q1 - 1.5 * (Q3 - Q1), inside = values.filter(v => v >= fence), outside = values.filter(v => v < fence);
    const lo = Math.min(...inside), hi = Math.max(...values);
    box = <>
      <line x1={x(lo)} x2={x(Q1)} y1={by} y2={by} stroke="#1E2D3C" strokeWidth={2} />
      <line x1={x(Q3)} x2={x(hi)} y1={by} y2={by} stroke="#1E2D3C" strokeWidth={2} />
      {[lo, hi].map((v, k) => <line key={k} x1={x(v)} x2={x(v)} y1={by - 8} y2={by + 8} stroke="#1E2D3C" strokeWidth={2} />)}
      <rect x={x(Q1)} y={by - 18} width={x(Q3) - x(Q1)} height={36} rx={5} fill="#FFF0E8" stroke="#1E2D3C" strokeWidth={2.2} />
      <line x1={x(MEDIAN)} x2={x(MEDIAN)} y1={by - 18} y2={by + 18} stroke="#8a4a2c" strokeWidth={3.5} />
      {outside.map((v, k) => <circle key={k} cx={x(v)} cy={by} r={6} fill="#fdeeea" stroke="#a0452f" strokeWidth={2} />)}
      {short ? <>
        <line x1={x(fence)} x2={x(fence)} y1={by - 26} y2={by + 26} stroke="#a0452f" strokeWidth={1.8} strokeDasharray="4 3" />
        <SvgText x={x(fence)} y={by - 30} fontSize={11.5} fill="#a0452f" fontWeight={800}>Grenze 20,5</SvgText>
      </> : null}
      <SvgText x={x(lo) + (x(Q1) - x(lo)) / 2} y={by - 8} fontSize={11.5}>Whisker</SvgText>
      <SvgText x={x(Q1) - 4} y={by + 34} fontSize={11.5} textAnchor="start">Box: mittlere Hälfte</SvgText>
    </>;
  }
  return <svg viewBox={`0 0 ${w} ${h}`} width="100%" aria-hidden="true" focusable="false">
    <line x1={x(0)} x2={x(50)} y1={line} y2={line} stroke="#1E2D3C" strokeWidth={2} />
    {ticks}
    {people}
    <path d={`M${x(mean) - 9},${line + 2} L${x(mean) + 9},${line + 2} L${x(mean)},${line - 12} Z`} fill="#2C6CA8" />
    <SvgText x={x(mean)} y={line + 40} fill="#2C6CA8" fontWeight={800} fontSize={12.5}>{`Mittelwert ${de(mean, 1)}`}</SvgText>
    {step >= 2 ? <>
      <line x1={x(MEDIAN)} x2={x(MEDIAN)} y1={22} y2={line} stroke="#8a4a2c" strokeWidth={2.5} strokeDasharray="5 4" />
      <SvgText x={x(MEDIAN)} y={16} fill="#8a4a2c" fontWeight={800} fontSize={12.5}>Median 40</SvgText>
    </> : null}
    {step >= 3 ? [Q1, Q3].map((v, i) => <g key={v}>
      <line x1={x(v)} x2={x(v)} y1={34} y2={line} stroke="#8a6fc9" strokeWidth={1.8} strokeDasharray="3 4" />
      <SvgText x={x(v) + (i ? 22 : -22)} y={30} fill="#5b4fb0" fontWeight={800} fontSize={12.5}>{`${i ? 'Q3' : 'Q1'} ${v}`}</SvgText>
    </g>) : null}
    {box}
  </svg>;
}

/**
 * Grundlage 4a „vom Lineal zum Boxplot“: four steps over eleven people, the picture as role img with a text version
 * that follows the step, and the question on short-time work (V4_Q). Answering it sets the 22 hours to 0
 * and shows step 4; „Wieder 22 Stunden“ takes it back.
 */
export function RulerBoxplot({ leseart }: { leseart: ReactNode }) {
  const { state } = useChapterState();
  const short = (state.answers[V4_Q.id] ?? '') !== '';
  const [step, setStep] = useState(short ? 4 : 1);
  const [wasShort, setWasShort] = useState(short);
  if (short !== wasShort) {
    setWasShort(short);
    if (short) setStep(4);
  }
  const values = short ? [0, ...BASIS.slice(1)] : BASIS;
  return <>
    <ul className="schritt-nav" aria-label="Schritte zum Boxplot">
      {STEPS.map((s, i) => <li key={s}>
        <button type="button" aria-current={step === i + 1 ? 'step' : 'false'} onClick={() => setStep(i + 1)}>{`Schritt ${i + 1}: ${s}`}</button>
      </li>)}
    </ul>
    <div className="grafik" role="img" aria-label={rulerText(step, short, values)}><Ruler step={step} short={short} values={values} /></div>
    <div className="erkl" aria-live="polite">{explain(step, values)}</div>
    <ChoiceCheck question={V4_Q} resetLabel="Wieder 22 Stunden" after={leseart} />
  </>;
}
