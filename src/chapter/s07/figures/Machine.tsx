import { useEffect, useRef, useState } from 'react';
import {
  ALT, MACHINE, MACHINE_SHAPE, SAMPLES, STACKS, TRUE_DIFF, type MachineVar, type Sample,
} from '../content';
import { de, pText, whole } from '../format';

/* Grundlage 1a „Stichproben-Maschine“ und Bild 1c-1. Alle Zahlen sind vorberechnet (R, set.seed(2026)); keine Mikrodaten. */

const ORANGE = '#F0A27E', DARK = '#8a4a2c', GRAY = '#C9C2B8', RED = '#a0452f', INK = '#5F6A74';

/** Bin index of a difference: working hours [k, k + 1) from 1; life satisfaction symmetric around 0 (Kiste = Vorzeichen × (⌊|d| ÷ 0,2⌋ + 1)). */
export function binOf(v: MachineVar, diff: number): number {
  if (v === 'dw15') return Math.floor(diff + 1e-9) - 1;
  const box = (diff < 0 ? -1 : 1) * (Math.floor(Math.abs(diff) / 0.2 + 1e-9) + 1);
  return box < 0 ? 6 + box : 5 + box;
}
const nBins = (v: MachineVar) => STACKS[v].length;
const binFrom = (v: MachineVar, k: number) => (v === 'dw15' ? 1 + k : -1.2 + 0.2 * k);
const binWidth = (v: MachineVar) => (v === 'dw15' ? 1 : 0.2);
const domain = (v: MachineVar): [number, number] => (v === 'dw15' ? [0, 14] : [-1.2, 1.2]);

/** Stone counts per bin after the first `count` samples (count ≤ 20). */
export function firstStacks(v: MachineVar, count: number): number[] {
  const out = new Array(nBins(v)).fill(0);
  SAMPLES[v].slice(0, count).forEach(s => { out[binOf(v, s.diff)]++; });
  return out;
}

type Col = { count: number; highlight?: boolean; last?: boolean };

/** Stack of stones per bin. With `perStone` 10 the last stone of a column is cut to its share. Decorative; callers give the text. */
export function StackSvg({ v, cols, perStone, truth, countsOver, bracket, gray }: {
  v: MachineVar; cols: Col[]; perStone: number; truth?: boolean; countsOver?: 'all' | 'highlight'; bracket?: string; gray?: boolean;
}) {
  const W = 640, pt = bracket ? 92 : 60, H = pt + 290, pl = 24, pr = 24, pb = 44, iw = W - pl - pr, ih = H - pt - pb, sh = 9;
  const [d0, d1] = domain(v), x = (val: number) => pl + (val - d0) / (d1 - d0) * iw;
  const ticks = v === 'dw15' ? [0, 2, 4, 6, 8, 10, 12, 14] : [-1.2, -0.8, -0.4, 0, 0.4, 0.8, 1.2];
  const base = pt + ih;
  return <svg viewBox={`0 0 ${W} ${H}`} width="100%" aria-hidden="true" focusable="false">
    {cols.map((c, k) => {
      const x0 = x(binFrom(v, k)) + 1.5, bw = x(binFrom(v, k) + binWidth(v)) - x(binFrom(v, k)) - 3;
      const full = Math.floor(c.count / perStone), rest = c.count / perStone - full;
      const fill = c.highlight || !gray ? ORANGE : GRAY;
      const stones = [];
      for (let i = 0; i < full; i++) {
        const isLast = c.last && i === full - 1;
        stones.push(<rect key={i} x={x0} y={base - (i + 1) * (sh + 1)} width={bw} height={sh} rx={2} fill={isLast ? DARK : fill} />);
      }
      if (rest > 0) stones.push(<rect key="r" x={x0} y={base - full * (sh + 1) - rest * sh} width={bw} height={rest * sh} rx={1.5} fill={fill} />);
      const top = base - (full + (rest > 0 ? 1 : 0)) * (sh + 1);
      const showCount = countsOver === 'all' ? c.count > 0 : countsOver === 'highlight' && c.highlight;
      return <g key={k}>{stones}{showCount ? <text x={x0 + bw / 2} y={top - 4} textAnchor="middle" fontFamily="Nunito,sans-serif" fontSize={11} fill={INK}>{String(c.count)}</text> : null}</g>;
    })}
    <line x1={pl} x2={W - pr} y1={base} y2={base} stroke="#9aa4ad" strokeWidth={1.5} />
    {ticks.map(t => <text key={t} x={x(t)} y={base + 16} textAnchor="middle" fontFamily="Nunito,sans-serif" fontSize={12} fill={INK}>{v === 'dw15' ? String(t) : de(t, 1)}</text>)}
    <text x={W / 2} y={H - 6} textAnchor="middle" fontFamily="Nunito,sans-serif" fontSize={12.5} fill={INK}>{`Unterschied Männer minus Frauen (${MACHINE[v].unit})`}</text>
    <line x1={x(0)} x2={x(0)} y1={pt - 26} y2={base} stroke="#8a939c" strokeWidth={1.5} strokeDasharray="5 4" />
    <text x={x(0) + 5} y={pt - 30} textAnchor="start" fontFamily="Nunito,sans-serif" fontSize={12} fill={INK}>kein Unterschied</text>
    {truth ? <>
      <line x1={x(TRUE_DIFF[v])} x2={x(TRUE_DIFF[v])} y1={pt - 10} y2={base} stroke={RED} strokeWidth={2.5} />
      <text x={x(TRUE_DIFF[v]) - 5} y={pt - 14} textAnchor="end" fontFamily="Nunito,sans-serif" fontSize={12} fontWeight={700} fill={RED}>ganzer ALLBUS</text>
    </> : null}
    {bracket ? bracket.split(': ').map((part, i, all) => <text key={i} x={W / 2} y={16 + i * 17} textAnchor="middle" fontFamily="Nunito,sans-serif" fontSize={12.5} fontWeight={700} fill={DARK}>{i < all.length - 1 ? `${part}:` : part}</text>) : null}
    <text x={W - pr} y={bracket ? 52 : 16} textAnchor="end" fontFamily="Nunito,sans-serif" fontSize={11.5} fill={INK}>{perStone === 1 ? '1 Stein = 1 Stichprobe' : `1 Stein = ${perStone} Stichproben`}</text>
  </svg>;
}

const sampleLine = (v: MachineVar, k: number, s: Sample) => {
  const d = MACHINE[v].decimals;
  return `Stichprobe ${k}: Männer ${de(s.men, d)}, Frauen ${de(s.women, d)}, Unterschied ${de(s.diff, d)} ${MACHINE[v].unit}.`;
};

/** Name of the picture for screen readers, following the state. */
export function machineText(v: MachineVar, count: number): string {
  const name = MACHINE[v].name;
  if (count === 0) return `Leerer Stapel für die Unterschiede Männer minus Frauen, ${name}. Noch keine Stichprobe gezogen.`;
  if (count <= 20) {
    const stacks = firstStacks(v, count);
    const parts = stacks.map((c, k) => (c ? `${c} bei ${de(binFrom(v, k), v === 'dw15' ? 0 : 1)} bis ${de(binFrom(v, k) + binWidth(v), v === 'dw15' ? 0 : 1)}` : '')).filter(Boolean);
    return `Stapel der Unterschiede Männer minus Frauen, ${name}, nach ${count} ${count === 1 ? 'Stichprobe' : 'Stichproben'}. Steine je Kiste: ${parts.join('; ')}.`;
  }
  return `Stapel aller 1.000 Unterschiede Männer minus Frauen, ${name}, ein Stein für 10 Stichproben, rote Linie beim wahren Unterschied von ${de(TRUE_DIFF[v], 2)}. ${MACHINE_SHAPE}`;
}

function SampleTable({ v }: { v: MachineVar }) {
  const d = MACHINE[v].decimals;
  return <table className="daten">
    <caption>{`${MACHINE[v].name}: die ersten 20 Stichproben (Männer minus Frauen, ${MACHINE[v].unit})`}</caption>
    <thead><tr><th scope="col">Stichprobe</th><th scope="col">Männer</th><th scope="col">Frauen</th><th scope="col">Unterschied</th><th scope="col">95-%-Intervall</th><th scope="col">t</th><th scope="col">p</th></tr></thead>
    <tbody>{SAMPLES[v].map((s, i) => <tr key={i}>
      <td>{i + 1}</td><td>{de(s.men, d)}</td><td>{de(s.women, d)}</td><td>{de(s.diff, d)}</td><td>{`${de(s.lo, d)} bis ${de(s.hi, d)}`}</td><td>{de(s.t, 2)}</td><td>{pText(s.p, v === 'dw15' ? 3 : 2)}</td>
    </tr>)}</tbody>
  </table>;
}

const binName = (v: MachineVar, k: number) => v === 'dw15'
  ? `${binFrom(v, k)} bis ${binFrom(v, k) + 1}`
  : `${de(binFrom(v, k), 1)} bis ${de(binFrom(v, k) + 0.2, 1)}`;

/** „Werte als Tabelle“: both sample tables, the stack counts as lists and the shape sentence. */
export function MachineValues() {
  return <details className="werte">
    <summary>Werte als Tabelle</summary>
    <SampleTable v="dw15" />
    <SampleTable v="ls01" />
    {(['dw15', 'ls01'] as const).map(v => <div key={v}>
      <p className="absatz"><b>{`Stapel aller 1.000 Stichproben, ${MACHINE[v].name}:`}</b></p>
      <ul>{STACKS[v].map((c, k) => <li key={k}>{`${binName(v, k)} ${MACHINE[v].unit}: ${whole(c)}`}</li>)}</ul>
    </div>)}
    <p>{MACHINE_SHAPE}</p>
  </details>;
}

/** Grundlage 1a: draw samples one by one (up to 20), then 980 at once; the stack grows into a bell. */
export function SamplingMachine() {
  const [v, setV] = useState<MachineVar>('dw15');
  const [count, setCount] = useState(0);
  const drawRef = useRef<HTMLButtonElement>(null);
  const resetRef = useRef<HTMLButtonElement>(null);
  const moveFocus = useRef<'reset' | 'draw' | null>(null);
  useEffect(() => {
    if (moveFocus.current === 'reset' && count === 1000) resetRef.current?.focus();
    else if (moveFocus.current === 'draw' && count === 0) drawRef.current?.focus();
    moveFocus.current = null;
  }, [count]);

  const cols: Col[] = count === 1000
    ? STACKS[v].map(c => ({ count: c }))
    : firstStacks(v, count).map((c, k) => ({ count: c, last: count > 0 && binOf(v, SAMPLES[v][count - 1].diff) === k }));

  function draw() {
    if (count < 20) setCount(count + 1);
    else { moveFocus.current = 'reset'; setCount(1000); }
  }
  function choose(next: MachineVar) { setV(next); setCount(0); }

  const line = count === 0 ? 'Noch keine Stichprobe gezogen.'
    : count <= 20 ? sampleLine(v, count, SAMPLES[v][count - 1])
      : 'Alle 1.000 Stichproben gezogen. 1 Stein = 10 Stichproben.';
  const feedback = count === 0 ? '' : count <= 20 ? MACHINE[v].early : MACHINE[v].all;

  return <div className="s07-maschine">
    <fieldset className="s07-schalter">
      <legend>Welche Frage?</legend>
      <div className="radios">{(['dw15', 'ls01'] as const).map(k => <label key={k}>
        <input type="radio" name="maschine-var" value={k} checked={v === k} onChange={() => choose(k)} /> {MACHINE[k].name}
      </label>)}</div>
    </fieldset>
    <div className="reihe-knoepfe">
      {count < 1000 ? <button type="button" className="knopf" ref={drawRef} onClick={draw}>{count < 20 ? 'Neue Stichprobe ziehen' : '980 weitere auf einmal'}</button> : null}
      <button type="button" className="knopf hell" ref={resetRef} onClick={() => { if (count === 0) drawRef.current?.focus(); else moveFocus.current = 'draw'; setCount(0); }}>Von vorn</button>
    </div>
    <p className="s07-zeile" aria-live="polite">{line}</p>
    <div className="grafik" role="img" aria-label={machineText(v, count)}>
      <StackSvg v={v} cols={cols} perStone={count === 1000 ? 10 : 1} truth={count === 1000} countsOver={count === 1000 ? 'all' : undefined} />
    </div>
    <p className="rueck text" aria-live="polite">{feedback}</p>
    <MachineValues />
  </div>;
}

/** Bild 1c-1: the 1.000 life-satisfaction differences, bins at least 0,6 away from 0 highlighted (63 + 64 = 127). */
export function FarFromZero() {
  const cols = STACKS.ls01.map((c, k) => ({ count: c, highlight: k <= 2 || k >= 9 }));
  return <div className="grafik" role="img" aria-label={ALT.stack1c}>
    <StackSvg v="ls01" cols={cols} perStone={10} gray countsOver="highlight"
      bracket="127 von 1.000 Stichproben: mindestens 0,6 Punkte von 0 entfernt, so weit wie Stichprobe 12 oder weiter" />
  </div>;
}
