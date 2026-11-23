import { useState } from 'react';
import { C, T } from './plot';

const STEPS = ['Formel', 'einsetzen', 'ausrechnen'];

/** Text version B2 (sitzung09.md). */
export const FORMULA_TEXT = 'Vorhersage gleich Konstante plus Steigung mal Wert der UV. Für gute Lage, Stufe 4: 3,570 plus 1,073 mal 4 gleich 7,862. Eine Stufe mehr Lage bringt eine um 1,073 höhere Vorhersage; von teils/teils (6,789) zu gut (7,862) sind es genau 1,073.';

/** What each step says (announced when the step changes). */
export const FORMULA_STEP_TEXT = [
  'Schritt 1: Vorhersage gleich Konstante plus Steigung mal Wert der UV.',
  'Schritt 2: Die Zahlen wandern in die Steine: Vorhersage gleich 3,570 plus 1,073 mal 4.',
  'Schritt 3: 3,570 plus 1,073 mal 4 gleich 7,862. Eine Stufe mehr Lage: plus 1,073.',
];

function Stone({ tone, value, term }: { tone: 'green' | 'blue' | 'yellow'; value: string; term: string }) {
  return <span className={`s9-stein s9-${tone}`}><b>{value}</b><small>{term}</small></span>;
}

/** Mini staircase: from stage 3 (6,789) to stage 4 (7,862), one step right and 1,073 up. */
function Stair() {
  const x0 = 56, y0 = 92, dx = 90, dy = 52;
  return <svg viewBox="0 0 330 120" width="330" aria-hidden="true" focusable="false" className="s9-treppe">
    <line x1={x0 - 10} x2={x0 + dx + 30} y1={y0 + 5.5} y2={y0 - dy - 5.5} stroke={C.green} strokeWidth={3} strokeLinecap="round" />
    <line x1={x0} x2={x0 + dx} y1={y0} y2={y0} stroke={C.gray} strokeWidth={2} strokeDasharray="5 4" />
    <line x1={x0 + dx} x2={x0 + dx} y1={y0} y2={y0 - dy} stroke={C.blueDark} strokeWidth={3} />
    <circle cx={x0} cy={y0} r={5} fill={C.green} /><circle cx={x0 + dx} cy={y0 - dy} r={5} fill={C.green} />
    <T x={x0} y={y0 + 22} fontSize={12}>Stufe 3: 6,789</T>
    <T x={x0 + dx} y={y0 - dy - 12} fontSize={12}>Stufe 4: 7,862</T>
    <T x={x0 + dx + 8} y={y0 - dy / 2 + 4} textAnchor="start" fill={C.blueDark} fontWeight={700} fontSize={12}>eine Stufe mehr: + 1,073</T>
  </svg>;
}

/** Bild B2 „s9-formel“: the formula as stones in three steps (Formel, einsetzen, ausrechnen). */
export function FormulaSteps() {
  const [s, setS] = useState(1);
  return <div className="s9-bild">
    <ul className="schritt-nav" aria-label="Schritte der Formel">
      {STEPS.map((name, i) => <li key={name}>
        <button type="button" aria-current={i + 1 === s ? 'step' : 'false'} onClick={() => setS(i + 1)}>{`Schritt ${i + 1}: ${name}`}</button>
      </li>)}
    </ul>
    <div className="s9-formel" aria-hidden="true">
      <Stone tone="green" value={s === 1 ? 'Vorhersage' : s === 2 ? '?' : '7,862'} term="vorhergesagter Wert (linearer Prädiktor)" />
      <span className="s9-op">=</span>
      <Stone tone="blue" value={s === 1 ? 'Konstante' : '3,570'} term="Achsenabschnitt, B von (Intercept)" />
      <span className="s9-op">+</span>
      <Stone tone="blue" value={s === 1 ? 'Steigung' : '1,073'} term="Regressionskoeffizient, B der UV" />
      <span className="s9-op">×</span>
      <Stone tone="yellow" value={s === 1 ? 'Wert der UV' : '4'} term="x" />
      {s === 3 ? <Stair /> : null}
    </div>
    <p className="erkl" aria-live="polite">{FORMULA_STEP_TEXT[s - 1]}</p>
    <p className="sr-only">{FORMULA_TEXT}</p>
  </div>;
}
