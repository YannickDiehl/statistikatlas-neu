// Sitzung 11, Thema 2: B5a (Formel Logit), B5 (Gerade im Logit, S-Kurve in Prozent), B6 (Faktor), Tabelle B und Exp(B),
// B6b (Formel Prozent) und B7 (die Ausgabe lesen). SVG ist dekorativ; jede Grafik hat eine Textfassung mit Werten.
import { useState } from 'react';
import { useAnnounce } from '../../blocks/announce';
import { SLIDER_AGES, SMARTPHONE, byHand } from '../content';
import { SvgText, de } from '../ui';
import { INK, TEAL } from './Topic1';

/** Chance as in the plan: one decimal from 10 on, two below („191,3“, „9,15“, „2,00“). */
export const chanceText = (c: number) => (c >= 10 ? de(c, 1) : de(c, 2));
/** One step of the chain: logit, chance, probability (by hand with the rounded numbers of the output). */
export function chain(age: number) {
  const h = byHand(age);
  return { logit: de(h.logit, 3), chance: chanceText(h.chance), p: `${de(h.p, 1)} %` };
}
export const chainText = (age: number) => {
  const c = chain(age);
  return `Alter ${age} → Logit ${c.logit} → Chance ${c.chance} → Wahrscheinlichkeit ${c.p}`;
};

/* ---------- B5a Formel ---------- */

export const B5A_TEXT = 'Der Logit ist die Konstante 6,774 plus B, hier minus 0,076, mal das Alter. Für eine 70-Jährige: 6,774 minus 0,076 mal 70 ergibt 1,454.';

/** B5a `s11-formel-logit`: Logit = Konstante + B × Alter, as building blocks with captions. */
export function FormulaLogit() {
  return <div className="formel s11-formel" role="img" aria-label={B5A_TEXT}>
    <span className="s11-baustein lila"><b>Logit</b><small>die Sprache des Modells</small></span><span>=</span>
    <span className="s11-baustein"><b>Konstante 6,774</b><small>Logit bei Alter 0, nur eine Rechengröße</small></span><span>+</span>
    <span className="s11-baustein"><b>B −0,076</b><small>so viel ändert sich der Logit je Lebensjahr</small></span><span>×</span>
    <span className="s11-baustein"><b>Alter</b><small>{' '}</small></span>
    <span className="s11-eingesetzt">Für 70 Jahre: <b>6,774 − 0,076 × 70 = 1,454</b></span>
  </div>;
}

/* ---------- B5 Logit und S-Kurve ---------- */

export const B5_CAPTION = 'Vom Alter zur Wahrscheinlichkeit, Smartphone-Modell, Internetnutzende';
export const B5_AFTER = 'Links steigt der Logit in gleich großen Schritten: je zehn Jahre um 0,76 weniger. Rechts wird daraus eine S-Kurve: bis 50 Jahre kaum Veränderung, danach immer schneller abwärts.';

function Panel({ title, lo, hi, ticks, value, age, zeroLine }: { title: string; lo: number; hi: number; ticks: number[]; value: (a: number) => number; age: number; zeroLine?: boolean }) {
  const W = 320, H = 250, L = 40, R = 12, T = 28, B = 34;
  const x = (a: number) => L + (a - 15) / 80 * (W - L - R);
  const y = (v: number) => T + (hi - v) / (hi - lo) * (H - T - B);
  const path = Array.from({ length: 76 }, (_, i) => 18 + i).map((a, i) => `${i ? 'L' : 'M'}${x(a).toFixed(1)},${y(value(a)).toFixed(1)}`).join(' ');
  return <svg viewBox={`0 0 ${W} ${H}`} width="100%" aria-hidden="true" focusable="false">
    <SvgText x={W / 2} y={16} fontSize={13.5} fontWeight={800} fill={INK}>{title}</SvgText>
    {ticks.map(t => <g key={t}>
      <line x1={L} x2={W - R} y1={y(t)} y2={y(t)} stroke="#EFE6DA" />
      <SvgText x={L - 6} y={y(t) + 4} textAnchor="end" fontSize={11}>{String(t)}</SvgText>
    </g>)}
    {zeroLine ? <>
      <line x1={L} x2={W - R} y1={y(0)} y2={y(0)} stroke="#8a8a8a" strokeWidth={1.5} />
      <SvgText x={L + 6} y={y(0) + 15} textAnchor="start" fontSize={10.5}>Logit 0 = 50 %</SvgText>
    </> : null}
    {[20, 40, 60, 80].map(a => <SvgText key={a} x={x(a)} y={H - B + 16} fontSize={11}>{String(a)}</SvgText>)}
    <SvgText x={(L + W - R) / 2} y={H - 4} fontSize={11.5} fontWeight={700} fill={INK}>Alter</SvgText>
    <line x1={L} x2={L} y1={T} y2={H - B} stroke={INK} strokeWidth={1.2} />
    <line x1={L} x2={W - R} y1={H - B} y2={H - B} stroke={INK} strokeWidth={1.2} />
    <path d={path} fill="none" stroke={TEAL} strokeWidth={3} />
    <line x1={x(age)} x2={x(age)} y1={y(value(age))} y2={H - B} stroke="#5b4fb0" strokeDasharray="4 4" />
    <circle cx={x(age)} cy={y(value(age))} r={7} fill="#A79FE2" stroke="#5b4fb0" strokeWidth={2} />
  </svg>;
}

/** B5 `s11-logit-s`: the same model as a straight line in logits and an S-curve in percent, with an age slider. */
export function LogitAndCurve() {
  const [age, setAge] = useState(70);
  const [live, announce] = useAnnounce(chainText(70), '');
  return <>
    <div className="s11-zwei" role="img" aria-label={`Smartphone-Modell für Internetnutzende. Links in Logits eine fallende Gerade, Logit gleich 6,774 minus 0,076 mal Alter; rechts in Prozent die S-Kurve. Der Punkt steht bei ${chainText(age)}. Alle Werte stehen in der Tabelle darunter.`}>
      <Panel title="In Logits" lo={-1} hi={6} ticks={[0, 2, 4, 6]} value={a => byHand(a).logit} age={age} zeroLine />
      <Panel title="In Prozent" lo={0} hi={100} ticks={[0, 25, 50, 75, 100]} value={a => byHand(a).p} age={age} />
    </div>
    <div className="feld">
      <label htmlFor="s11-alter">Alter</label>
      <input type="range" id="s11-alter" min={20} max={90} step={10} value={age} aria-valuetext={`${age} Jahre`}
        onChange={e => { const a = Number(e.target.value); setAge(a); announce(chainText(a)); }} />
      <output htmlFor="s11-alter" aria-live="off">{`${age} Jahre`}</output>
    </div>
    <p className="rueck text" aria-live="polite">{live}</p>
    <details className="werte">
      <summary>Werte als Tabelle</summary>
      <table className="daten">
        <caption>{B5_CAPTION}</caption>
        <thead><tr><th scope="col">Alter</th><th scope="col">Logit</th><th scope="col">Chance</th><th scope="col">Wahrscheinlichkeit</th></tr></thead>
        <tbody>{SLIDER_AGES.map(a => { const c = chain(a); return <tr key={a}><td>{String(a)}</td><td>{c.logit}</td><td>{c.chance}</td><td>{c.p}</td></tr>; })}</tbody>
      </table>
      <p>{B5_AFTER}</p>
    </details>
  </>;
}

/* ---------- B6 Faktor ---------- */

export const FACTOR_AGES = [30, 40, 50, 60, 70, 80];
export const B6_TEXT = 'Die Chance, das Smartphone zu nennen, mit 30 Jahren 89,5, mit 40 41,8, mit 50 19,6, mit 60 9,15, mit 70 4,28, mit 80 2,00. Von Jahrzehnt zu Jahrzehnt wird sie mit 0,47 malgenommen, also etwa halbiert. Das ergibt sich aus 0,927 je Jahr, zehnmal hintereinander.';

/** B6 `s11-faktor`: the chance at 30, 40, …, 80 years, each step × 0,47. */
export function Factor() {
  const ten = de(SMARTPHONE.expB ** 10, 2);
  return <div className="s11-faktor" role="img" aria-label={B6_TEXT}>
    <p className="s11-ueber">{`ein Jahr: × ${de(SMARTPHONE.expB, 3)}; zehn Jahre: ${de(SMARTPHONE.expB, 3)} × ${de(SMARTPHONE.expB, 3)} × … (zehnmal) = ${ten}`}</p>
    <div className="s11-reihe">{FACTOR_AGES.map((a, i) => <span key={a} className="s11-reihe-teil">
      {i ? <i>{`× ${ten}`}</i> : null}
      <span className="s11-kasten gelb klein"><small>{`${a} Jahre`}</small><b>{chanceText(byHand(a).chance)}</b></span>
    </span>)}</div>
  </div>;
}

/** Table „B und Exp(B) lesen“. */
export function ExpBTable() {
  return <table className="daten voll">
    <caption>B und Exp(B) lesen</caption>
    <thead><tr><th scope="col">B</th><th scope="col">Exp(B)</th><th scope="col">Die Chance …</th></tr></thead>
    <tbody>
      <tr><td>größer als 0</td><td>größer als 1</td><td>steigt je Einheit</td></tr>
      <tr><td>0</td><td>1</td><td>bleibt gleich: kein Zusammenhang</td></tr>
      <tr><td>kleiner als 0</td><td>kleiner als 1</td><td>sinkt je Einheit</td></tr>
    </tbody>
  </table>;
}

/* ---------- B6b Formel Prozent ---------- */

export const B6B_TEXT = 'Die Veränderung der Chance in Prozent ist Exp(B) minus 1, mal 100. Beim Alter: 0,927 minus 1 ist minus 0,073, mal 100 ergibt minus 7,3 Prozent je Lebensjahr.';

/** B6b `s11-formel-prozent`: (Exp(B) − 1) × 100. */
export function FormulaPercent() {
  return <div className="formel s11-formel" role="img" aria-label={B6B_TEXT}>
    <span className="s11-baustein gelb"><b>Veränderung der Chance in Prozent</b></span><span>=</span>
    <span>(</span><span className="s11-baustein"><b>Exp(B)</b></span><span>− 1) × 100</span>
    <span className="s11-eingesetzt"><b>(0,927 − 1) × 100 = −7,3</b><br />Je Lebensjahr wird die Chance um 7,3 % kleiner.</span>
  </div>;
}

/* ---------- B7 Die Ausgabe lesen ---------- */

export type OutputPart = 'eins' | 'b' | 'n';
/** The excerpt of `smartphone %>% summary()`, line by line, with the part each line belongs to. */
export const OUTPUT_LINES: [string, OutputPart?][] = [
  ['- N: 4813', 'n'],
  ['- Weights: wghtpew'],
  [''],
  ['  Dependent Variable Encoding', 'eins'],
  ['  ---------------------------------', 'eins'],
  ['  Original Value     Internal Value', 'eins'],
  ['  ---------------------------------', 'eins'],
  ['  0 (NICHT GENANNT)               0', 'eins'],
  ['  1 (GENANNT)                     1', 'eins'],
  ['  ---------------------------------', 'eins'],
  [''],
  ['  Variables in the Equation'],
  ['  ----------------------------------------------------------------------------------------'],
  ['  Term              B   S.E.     Wald  df   Sig.   Exp(B)  95% CI Lower  95% CI Upper'],
  ['  ----------------------------------------------------------------------------------------'],
  ['  (Intercept)   6.774  0.276  604.222   1  <.001  874.684                              ***'],
  ['  age          -0.076  0.004  328.394   1  <.001    0.927         0.919         0.935  ***', 'b'],
  ['  ----------------------------------------------------------------------------------------'],
];
export const OUTPUT_PARTS: { id: OutputPart; label: string; text: string }[] = [
  { id: 'eins', label: 'Was ist die 1?', text: 'Das Modell sagt die Wahrscheinlichkeit für den Internen Wert 1 vorher, hier GENANNT. Prüf das immer zuerst: Ist die 1 andersherum kodiert, drehen sich alle Vorzeichen um und Exp(B) wird zum Kehrwert.' },
  { id: 'b', label: 'B und Exp(B)', text: 'B −0,076: Der Logit sinkt je Lebensjahr. Exp(B) 0,927: Die Chance wird je Lebensjahr mit 0,927 malgenommen. Sig. <.001: Der Zusammenhang ist signifikant.' },
  { id: 'n', label: 'Wie viele?', text: 'Gewichtete Zahl der Fälle im Modell. Wer bei einer Variable des Modells fehlt, fällt ganz heraus.' },
];

/** B7 `s11-ausgabe`: the real output as text, three buttons mark a part and explain it. */
export function ReadOutput() {
  const [part, setPart] = useState<OutputPart | null>(null);
  const [live, announce] = useAnnounce('', '');
  function choose(p: OutputPart) {
    setPart(p);
    announce(OUTPUT_PARTS.find(o => o.id === p)!.text);
  }
  return <div className="s11-ausgabe">
    <div className="s11-umschalter" role="group" aria-label="Stellen der Ausgabe">
      {OUTPUT_PARTS.map(o => <button key={o.id} type="button" className="knopf hell" aria-pressed={part === o.id} onClick={() => choose(o.id)}>{o.label}</button>)}
    </div>
    <figure className="s11-ausgabe-bild" aria-labelledby="s11-ausgabe-t">
      <figcaption id="s11-ausgabe-t" className="sr-only">Ausschnitt der Ausgabe von smartphone %&gt;% summary(); die markierte Stelle beginnt jeweils mit „Markiert:“.</figcaption>
      <pre className="code s11-pre" tabIndex={0}>{OUTPUT_LINES.map(([text, p], i) => p && p === part
        ? <mark key={i} className="s11-hell"><span className="sr-only">Markiert: </span>{`${text}\n`}</mark>
        : <span key={i}>{`${text}\n`}</span>)}</pre>
    </figure>
    <p className="rueck text" aria-live="polite">{live}</p>
    <ul className="sr-only">{OUTPUT_PARTS.map(o => <li key={o.id}>{`${o.label} ${o.text}`}</li>)}</ul>
  </div>;
}
