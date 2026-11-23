// Sitzung 11, Thema 4 und Überblick: B11 (Trefferquote), B12 (−2LL), B12b (Formel Nullmodell) und B13 (welche Regression).
// SVG ist dekorativ; jede Grafik hat eine Textfassung mit Werten.
import { useState } from 'react';
import { useAnnounce } from '../../blocks/announce';
import { SMARTPHONE } from '../content';
import { SvgText, de, whole } from '../ui';
import { INK, TEAL } from './Topic1';

/* ---------- B11 Trefferquote ---------- */

const T = SMARTPHONE.table;
export const B11_MODEL = `Richtig: ${T.no.no} + ${whole(T.yes.yes)} = ${whole(T.no.no + T.yes.yes)} von ${whole(SMARTPHONE.n)}, das sind ${de(T.overall, 1)} %.`;
export const B11_RULE = `Wer für alle „Ja“ sagt, liegt bei allen richtig, die das Smartphone nennen: ${T.yes.no} + ${whole(T.yes.yes)} = ${whole(T.yes.no + T.yes.yes)} von ${whole(SMARTPHONE.n)}, das sind ${de(100 * (T.yes.no + T.yes.yes) / SMARTPHONE.n, 1)} %. Genauso gut wie das Modell, sogar um einen (gewichteten) Fall besser.`;

/** B11 `s11-trefferquote`: the Classification Table with a switch between the model and the rule „alle Ja“. */
export function HitRate() {
  const [view, setView] = useState<'modell' | 'regel'>('modell');
  const [live, announce] = useAnnounce(B11_MODEL, '');
  const hot = (row: 'no' | 'yes', col: 'no' | 'yes') => (view === 'modell' ? row === col : row === 'yes') ? 's11-richtig' : undefined;
  function choose(v: 'modell' | 'regel') { setView(v); announce(v === 'modell' ? B11_MODEL : B11_RULE); }
  return <div className="s11-treffer">
    <div className="s11-umschalter" role="group" aria-label="Was richtig ist">
      <button type="button" className="knopf hell" aria-pressed={view === 'modell'} onClick={() => choose('modell')}>Modell</button>
      <button type="button" className="knopf hell" aria-pressed={view === 'regel'} onClick={() => choose('regel')}>Regel: alle Ja</button>
    </div>
    <table className="daten">
      <caption>Classification Table des Smartphone-Modells, wie R sie druckt (gewichtet, gerundet), Schwelle 0,5</caption>
      <thead><tr><th scope="col">beobachtet \ vorhergesagt</th><th scope="col">NICHT GENANNT</th><th scope="col">GENANNT</th><th scope="col">% richtig</th></tr></thead>
      <tbody>
        <tr><th scope="row">NICHT GENANNT</th><td className={hot('no', 'no')}><b>{String(T.no.no)}</b></td><td className={hot('no', 'yes')}>{String(T.no.yes)}</td><td>{de(T.no.pct, 1)}</td></tr>
        <tr><th scope="row">GENANNT</th><td className={hot('yes', 'no')}>{String(T.yes.no)}</td><td className={hot('yes', 'yes')}><b>{whole(T.yes.yes)}</b></td><td>{de(T.yes.pct, 1)}</td></tr>
        <tr><th scope="row">insgesamt</th><td /><td /><td>{de(T.overall, 1)}</td></tr>
      </tbody>
    </table>
    <p className="rueck text" aria-live="polite">{live}</p>
    <details className="werte">
      <summary>Beide Lesarten als Text</summary>
      <p><b>Modell:</b> {B11_MODEL}</p>
      <p><b>Regel „alle Ja“:</b> {B11_RULE}</p>
    </details>
  </div>;
}

/* ---------- B12 −2LL ---------- */

export const B12_TEXT = 'Das Nullmodell hat −2LL 2.824,895, das Modell mit dem Alter 2.370,945. Der Unterschied, 453,950, ist das Chi-square im Omnibus-Test. −2LL sinkt um 16 Prozent.';

/** B12 `s11-minus2ll`: two lying bars, the difference is the chi-square of the omnibus test. */
export function MinusTwoLL() {
  const W = 600, H = 190, L = 190, max = 3000, len = (v: number) => v / max * (W - L - 30);
  return <div className="grafik" role="img" aria-label={B12_TEXT}>
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" aria-hidden="true" focusable="false">
      <SvgText x={L - 10} y={44} textAnchor="end" fontWeight={700} fill={INK}>Nullmodell (nur Konstante)</SvgText>
      <rect x={L} y={26} width={len(SMARTPHONE.minus2LLNull)} height={28} rx={5} fill="#c9ced3" stroke="#8a8f94" />
      <SvgText x={L + len(SMARTPHONE.minus2LLNull) - 8} y={45} textAnchor="end" fontWeight={800} fill={INK}>{de(SMARTPHONE.minus2LLNull, 3)}</SvgText>
      <SvgText x={L - 10} y={104} textAnchor="end" fontWeight={700} fill={INK}>Modell mit Alter</SvgText>
      <rect x={L} y={86} width={len(SMARTPHONE.minus2LL)} height={28} rx={5} fill="#BFE3DF" stroke={TEAL} />
      <SvgText x={L + len(SMARTPHONE.minus2LL) - 8} y={105} textAnchor="end" fontWeight={800} fill={INK}>{de(SMARTPHONE.minus2LL, 3)}</SvgText>
      <rect x={L + len(SMARTPHONE.minus2LL)} y={122} width={len(SMARTPHONE.chi2)} height={10} rx={3} fill="#FFE7A3" stroke="#7a5c0c" />
      <SvgText x={W - 10} y={152} textAnchor="end" fontWeight={800} fill="#7a5c0c">{`Chi-square im Omnibus-Test: ${de(SMARTPHONE.chi2, 3)}`}</SvgText>
      <SvgText x={W / 2} y={H - 8} fontSize={11.5}>kleiner ist besser</SvgText>
    </svg>
  </div>;
}

/* ---------- B12b Formel Nullmodell ---------- */

export const B12B_TEXT = 'Das Nullmodell steht nicht direkt in der Ausgabe. Du bekommst es, indem du −2LL des Modells und das Chi-square des Omnibus-Tests addierst: 2370,945 plus 453,950 gleich 2824,895. Teilst du das Chi-square durch diese Zahl, erhältst du McFadden R², 0,161: −2LL ist um 16,1 Prozent gesunken.';

/** B12b `s11-formel-null`: −2LL of the null model = −2LL of the model + chi-square; McFadden R². */
export function FormulaNull() {
  return <div className="formel s11-formel" role="img" aria-label={B12B_TEXT}>
    <span className="s11-baustein"><b>−2LL Nullmodell</b></span><span>=</span>
    <span className="s11-baustein"><b>−2LL Modell</b><small>Model Summary</small></span><span>+</span>
    <span className="s11-baustein gelb"><b>Chi-square</b><small>Omnibus Tests</small></span>
    <span className="s11-eingesetzt"><b>2370,945 + 453,950 = 2824,895</b><br />McFadden R² = Chi-square / −2LL Nullmodell = 453,950 / 2824,895 = 0,161</span>
  </div>;
}

/* ---------- B13 Welche Regression? ---------- */

export const B13_TEXT = 'Entscheidungsbaum. Frage: Was ist die abhängige Variable? Wenn sie metrisch ist und viele Werte hat, etwa Lebenszufriedenheit oder Einkommen: lineare Regression mit linear_regression, gedeutet über B und R². Wenn sie genau zwei Ausprägungen hat, Ja oder Nein: logistische Regression mit logistic_regression, gedeutet über Exp(B) für Chancen, vorhergesagte Wahrscheinlichkeiten und AME für Prozentpunkte, Pseudo-R² für die Güte. Für mehr als zwei Stufen gibt es eigene Verfahren, die nicht Teil dieses Kurses sind.';

const STROKE = '#978B7B';
const Curve = ({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) =>
  <path d={`M${x1},${y1} C${x1},${(y1 + y2) / 2} ${x2},${(y1 + y2) / 2} ${x2},${y2}`} fill="none" stroke={STROKE} strokeWidth={2} />;

function Leaf({ x, y, title, code, lines }: { x: number; y: number; title: string; code: string; lines: string[] }) {
  return <g>
    <rect x={x - 150} y={y} width={300} height={44 + lines.length * 15} rx={12} fill="#EDF8F1" stroke="#2f7a4f" strokeWidth={2} />
    <SvgText x={x} y={y + 20} fill={INK} fontWeight={800} fontSize={14}>{title}</SvgText>
    <SvgText x={x} y={y + 37} fontFamily="JetBrains Mono,monospace" fontSize={11.5} fill="#5b4fb0">{code}</SvgText>
    {lines.map((l, i) => <SvgText key={i} x={x} y={y + 54 + i * 15} fontSize={11.5} fill={INK}>{l}</SvgText>)}
  </g>;
}

/** B13 `s11-welche-regression`: which regression for which dependent variable. */
export function WhichRegression() {
  return <div className="grafik" role="img" aria-label={B13_TEXT}>
    <svg viewBox="0 0 720 240" width="100%" aria-hidden="true" focusable="false">
      <Curve x1={360} y1={56} x2={180} y2={150} /><Curve x1={360} y1={56} x2={540} y2={150} />
      <rect x={210} y={14} width={300} height={42} rx={12} fill="#fff" stroke={INK} strokeWidth={2} />
      <SvgText x={360} y={40} fill={INK} fontWeight={800} fontSize={14.5}>Was ist die abhängige Variable?</SvgText>
      <SvgText x={180} y={100} fontSize={11.5} fontWeight={700}>metrisch, viele Werte</SvgText>
      <SvgText x={180} y={115} fontSize={11}>(etwa Lebenszufriedenheit 0 bis 10, Einkommen)</SvgText>
      <SvgText x={540} y={100} fontSize={11.5} fontWeight={700}>zwei Ausprägungen</SvgText>
      <SvgText x={540} y={115} fontSize={11}>(Ja/Nein, 0/1)</SvgText>
      <Leaf x={180} y={150} title="lineare Regression" code="linear_regression()" lines={['B in Einheiten der Variable, R²', 'Sitzung 9 und 10']} />
      <Leaf x={540} y={150} title="logistische Regression" code="logistic_regression()" lines={['Exp(B) für Chancen; predict() und AME', 'für Prozentpunkte; Pseudo-R²']} />
    </svg>
  </div>;
}
