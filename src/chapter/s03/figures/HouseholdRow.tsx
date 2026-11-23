import { useEffect, useRef, useState } from 'react';
import { useChapterState } from '../../ChapterContext';
import { HOUSEHOLDS9, K3A_Q, MEAN_FORMULA_TEXT, ROW_TEXT, WG } from '../content';
import { C, StepNav, SvgText, TextVersion, de, useFocusLater } from './util';

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b), n = s.length;
  return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
};
/** Mean, median and sum of the nine households, with and without the WG. */
export const ROW_STATS = {
  nine: { sum: sum(HOUSEHOLDS9), mean: sum(HOUSEHOLDS9) / HOUSEHOLDS9.length, median: median(HOUSEHOLDS9) },
  ten: { sum: sum(HOUSEHOLDS9) + WG, mean: (sum(HOUSEHOLDS9) + WG) / (HOUSEHOLDS9.length + 1), median: median([...HOUSEHOLDS9, WG]) },
};

const xr = (v: number) => 170 + v * 45;
const BASE = 250, SH = 22, SW = 34;

function Stone({ x, y, v, frame, pale }: { x: number; y: number; v: number; frame?: boolean; pale?: boolean }) {
  return <g opacity={pale ? 0.35 : 1}>
    <rect x={x} y={y} width={SW} height={SH - 2} rx={3} fill={C.blue} stroke={frame ? C.orangeDark : C.blueStroke} strokeWidth={frame ? 3 : 1} />
    <SvgText x={x + SW / 2} y={y + 15} fontSize={12.5} fill={C.ink} fontWeight={800}>{String(v)}</SvgText>
  </g>;
}

function Tower() {
  return <g>
    <SvgText x={16} y={22} textAnchor="start" fontStyle="italic" fontSize={12.5}>zum Beispiel neun Befragte</SvgText>
    <SvgText x={80} y={48} fontFamily="JetBrains Mono,monospace" fontSize={11}>{'<dbl>'}</SvgText>
    <rect x={48} y={53} width={64} height={20} rx={6} fill={C.ink} />
    <SvgText x={80} y={67} fill="#fff" fontFamily="JetBrains Mono,monospace" fontSize={12}>dh04</SvgText>
    {HOUSEHOLDS9.map((v, i) => <Stone key={i} x={63} y={80 + i * 22} v={v} />)}
    <rect x={40} y={80 + 9 * 22 + 2} width={80} height={10} rx={4} fill={C.plate} />
  </g>;
}

/** Sorted row on top (with ordinal numbers) and the stacks on the ruler 0 to 12. */
function Ruler({ step }: { step: number }) {
  const withWg = step === 3;
  const values = [...HOUSEHOLDS9, ...(withWg ? [WG] : [])].sort((a, b) => a - b);
  const n = values.length, mid = (n - 1) / 2;
  const isMid = (i: number) => (n % 2 ? i === mid : i === Math.floor(mid) || i === Math.ceil(mid));
  const stats = withWg ? ROW_STATS.ten : ROW_STATS.nine;
  const height: Record<number, number> = {};
  return <g>
    {values.map((v, i) => <g key={`r${i}`}>
      <SvgText x={150 + i * 40 + SW / 2} y={34} fontSize={11}>{`${i + 1}.`}</SvgText>
      <Stone x={150 + i * 40} y={40} v={v} frame={isMid(i)} />
    </g>)}
    {n % 2 ? <>
      <path d={`M150,70 V76 H${150 + 3 * 40 + SW} V70`} fill="none" stroke={C.mute} strokeWidth={1.5} />
      <SvgText x={150 + 1.5 * 40 + SW / 2} y={92} fontSize={11.5}>4 Steine</SvgText>
      <path d={`M${150 + 5 * 40},70 V76 H${150 + 8 * 40 + SW} V70`} fill="none" stroke={C.mute} strokeWidth={1.5} />
      <SvgText x={150 + 6.5 * 40 + SW / 2} y={92} fontSize={11.5}>4 Steine</SvgText>
    </> : null}
    {values.map((v, i) => {
      const k = height[v] = (height[v] ?? 0) + 1;
      const fresh = withWg && v === WG;
      return <Stone key={`s${i}`} x={xr(v) - SW / 2} y={BASE - k * SH} v={v} frame={fresh || (!withWg && i === 4)} />;
    })}
    {withWg ? <SvgText x={xr(WG)} y={BASE - SH - 6} fontSize={11} fill={C.orangeDark} fontWeight={800}>neu</SvgText> : null}
    <line x1={xr(0)} x2={xr(12)} y1={BASE + 2} y2={BASE + 2} stroke={C.ink} strokeWidth={2} />
    {Array.from({ length: 13 }, (_, v) => <g key={v}>
      <line x1={xr(v)} x2={xr(v)} y1={BASE + 2} y2={BASE + (v % 2 ? 6 : 9)} stroke={C.ink} />
      {v % 2 ? null : <SvgText x={xr(v)} y={BASE + 22} fontSize={11.5}>{String(v)}</SvgText>}
    </g>)}
    <line x1={xr(stats.median)} x2={xr(stats.median)} y1={BASE - 4 * SH - 16} y2={BASE + 2} stroke={C.orangeDark} strokeWidth={2.2} strokeDasharray="5 4" />
    <SvgText x={xr(stats.median) + 6} y={BASE - 4 * SH - 6} textAnchor="start" fontSize={12} fill={C.orangeDark} fontWeight={800}>
      {withWg ? 'Median 2 (zwischen dem 5. und 6. Stein)' : `Median ${stats.median}`}</SvgText>
    {step >= 2 ? <>
      {withWg ? <path d={`M${xr(ROW_STATS.nine.mean)},${BASE + 28} l-8,14 h16 Z`} fill={C.orange} opacity={0.3} /> : null}
      <path d={`M${xr(stats.mean)},${BASE + 28} l-9,16 h18 Z`} fill={C.orange} stroke={C.orangeDark} />
      <SvgText x={xr(stats.mean) + 14} y={BASE + 42} textAnchor="start" fontSize={12} fill={C.ink} fontWeight={800}>{`Mittelwert ${de(stats.mean, withWg ? 1 : 2)}`}</SvgText>
    </> : null}
  </g>;
}

/** The step button number `i` (0-based) inside the step navigation of `root`. */
export const stepButton = (root: ParentNode | null, i: number) => root?.querySelectorAll<HTMLElement>('.schritt-nav button')[i];

/**
 * Bild B8 „Die Mitte einer Reihe“: nine households (an example) as a tower, as a sorted row on a ruler, with the mean.
 * Step 4 (the WG with 12) appears once the question below is answered; „Wieder ohne die WG“ goes back to step 3.
 */
export function HouseholdRow() {
  const { state } = useChapterState();
  const answered = (state.answers[K3A_Q.id] ?? '') !== '';
  const [step, setStep] = useState(answered ? 3 : 0);
  const was = useRef(answered);
  const root = useRef<HTMLDivElement>(null);
  const focusLater = useFocusLater();
  /** Back to step 3: the pressed button disappears, so the focus moves to the „Schritt 3“ button. */
  const backToMean = () => { focusLater(() => stepButton(root.current, 2)); setStep(2); };
  useEffect(() => {
    if (answered && !was.current) setStep(3);
    if (!answered && step === 3) setStep(2);
    was.current = answered;
  }, [answered, step]);
  const steps = ['Turm', 'Reihe', 'Mittelwert', ...(answered ? ['mit der WG'] : [])];
  const stats = step === 3 ? ROW_STATS.ten : ROW_STATS.nine;
  const sorted = [...HOUSEHOLDS9].sort((a, b) => a - b);

  return <div ref={root}>
    <StepNav steps={steps} current={step} onSelect={setStep} />
    <div className="grafik">
      <svg viewBox="0 0 760 300" width="100%" aria-hidden="true" focusable="false">
        {step === 0 ? <Tower /> : <Ruler step={step} />}
      </svg>
    </div>
    {step >= 2 ? <div className="s3-rechnung" aria-hidden="true">
      {step === 3
        ? <><span>{`${ROW_STATS.nine.sum} + ${WG} = ${ROW_STATS.ten.sum}`}</span><span>{`${ROW_STATS.ten.sum} geteilt durch 10 Steine = ${de(ROW_STATS.ten.mean, 1)}`}</span></>
        : <><span>{`${sorted.join(' + ')} = ${stats.sum}`}</span><span>{`${stats.sum} geteilt durch 9 Steine = ${de(stats.mean)}`}</span></>}
      <small>Das Dreieck ist der Schwerpunkt: Auf diesem Punkt würde das Lineal im Gleichgewicht liegen.</small>
    </div> : null}
    {step === 3 ? <div className="reihe-knoepfe"><button type="button" className="knopf hell" onClick={backToMean}>Wieder ohne die WG</button></div> : null}
    <p className="sr-only" aria-live="polite">{`Schritt ${step + 1}: ${ROW_TEXT[step]}`}</p>
    <TextVersion><p>{ROW_TEXT.map((t, i) => `Schritt ${i + 1}: ${t}`).join(' ')}</p></TextVersion>
  </div>;
}

/** Bild B9 „Formel lesen lernen: der Mittelwert“: x̄ = Σx / n, each sign a tile with its name, then the example. */
export function MeanFormula() {
  const tile = (sign: string, name: string) => <span className="s3-baustein"><b>{sign}</b><small>{name}</small></span>;
  return <div className="formel s3-formel" role="img" aria-label={MEAN_FORMULA_TEXT}>
    {tile('x̄', 'der Mittelwert, gesprochen „x quer“')}
    <span className="gross">=</span>
    <span className="s3-bruch">
      <span className="s3-oben">{tile('Σ', 'zähl alle zusammen, gesprochen „Summe“')}{tile('x', 'jeder einzelne Wert')}</span>
      <span className="s3-unten">{tile('n', 'wie viele Werte es sind')}</span>
    </span>
    <ul className="s3-eingesetzt">
      <li>{`Σx = ${[...HOUSEHOLDS9].sort((a, b) => a - b).join(' + ')} = ${ROW_STATS.nine.sum}`}</li>
      <li>{`n = ${HOUSEHOLDS9.length}`}</li>
      <li>{`x̄ = ${ROW_STATS.nine.sum} / ${HOUSEHOLDS9.length} = ${de(ROW_STATS.nine.mean)}`}</li>
    </ul>
  </div>;
}
