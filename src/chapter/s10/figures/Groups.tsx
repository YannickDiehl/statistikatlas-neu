// Sitzung 10, Grundlage 2 und Aufgabe 2: B4 zwei Gruppen, B5 Dummy-Tabelle, B6 Referenz wechseln, B7 vier Gruppen.
import { useState } from 'react';
import { MARRIED, MSTAT, MSTAT_PREDICTIONS, MSTAT_R2, REFERENCES } from '../content';
import { ArrowDef, C, Picture, Switches, T, TextVersion, de, signed } from './common';

export const B4_TEXT = 'Zwei Stapel: nicht verheiratet, Code 0, mittlere Lebenszufriedenheit 7,04; verheiratet, Code 1, 7,69. Die Konstante 7,042 ist der Mittelwert der Gruppe mit 0. B gleich 0,652 ist der Unterschied der Verheirateten dazu.';

/** Bild B4 `s10-zwei-gruppen`. */
export function TwoGroups() {
  const w = 640, h = 330, l = 60, top = 20, bottom = 290;
  const y = (v: number) => bottom - v / 10 * (bottom - top);
  const stack = (x: number, v: number) => {
    const n = Math.round(v * 2);
    return Array.from({ length: n }, (_, k) => <rect key={k} x={x} y={bottom - (k + 1) * (bottom - y(v)) / n + 1} width={110} height={(bottom - y(v)) / n - 2} rx={3} fill={C.blue} stroke={C.blueD} strokeWidth={1} />);
  };
  return <>
  <Picture label={B4_TEXT}>
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" aria-hidden="true" focusable="false">
      <ArrowDef id="s10-pfeil-b4" color={C.orangeD} />
      {[0, 2, 4, 6, 8, 10].map(v => <g key={v}><line x1={l} x2={l - 5} y1={y(v)} y2={y(v)} stroke={C.ink} /><T x={l - 9} y={y(v) + 4} textAnchor="end">{String(v)}</T></g>)}
      <line x1={l} x2={l} y1={top} y2={bottom} stroke={C.ink} strokeWidth={1.5} />
      <line x1={l} x2={w - 20} y1={bottom} y2={bottom} stroke={C.ink} strokeWidth={1.5} />
      {stack(120, MARRIED.meanOther)}
      {stack(300, MARRIED.meanMarried)}
      <T x={175} y={y(MARRIED.meanOther) - 26} fill={C.ink} fontWeight={800}>{de(MARRIED.meanOther, 2)}</T>
      <T x={355} y={y(MARRIED.meanMarried) - 8} fill={C.ink} fontWeight={800}>{de(MARRIED.meanMarried, 2)}</T>
      <T x={175} y={bottom + 20} fill={C.ink} fontWeight={700}>0: nicht verheiratet</T>
      <T x={355} y={bottom + 20} fill={C.ink} fontWeight={700}>1: verheiratet</T>
      <line x1={100} x2={440} y1={y(MARRIED.intercept)} y2={y(MARRIED.intercept)} stroke={C.mute} strokeWidth={2} strokeDasharray="6 4" />
      <T x={100} y={y(MARRIED.intercept) - 8} textAnchor="start" fill={C.mute} fontWeight={700} fontSize={13.5}>Konstante 7,042 = Mittelwert der Gruppe 0</T>
      <line x1={430} x2={430} y1={y(MARRIED.intercept)} y2={y(MARRIED.meanMarried) + 2} stroke={C.orangeD} strokeWidth={2.5} markerStart="url(#s10-pfeil-b4)" markerEnd="url(#s10-pfeil-b4)" />
      <T x={440} y={y(7.5)} textAnchor="start" fill={C.orangeD} fontWeight={800} fontSize={13.5}>
        <tspan x={440}>B = 0,652: Abstand der</tspan><tspan x={440} dy={15}>Gruppe 1 zur Gruppe 0</tspan>
      </T>
    </svg>
  </Picture>
  <p className="s10-fuss">ALLBUS 2023, gewichtet; Lebenszufriedenheit 0 bis 10.</p>
  </>;
}

const PEOPLE: [string, number][] = [['A', 1], ['B', 5], ['C', 3], ['D', 4], ['E', 2]];
const MSTAT_WORD = ['verheiratet', 'getrennt lebend', 'verwitwet', 'geschieden', 'ledig'];

/** Bild B5 `s10-dummy-tabelle`: a real table, the ones highlighted, mstat_5 as reference. */
export function DummyTable() {
  return <div className="grafik">
    <table className="daten s10-dummies">
      <caption>Fünf Befragte, zum Beispiel</caption>
      <thead><tr>
        <th scope="col">Person</th><th scope="col">mstat (Code und Wort)</th>
        {[1, 2, 3, 4, 5].map(c => <th key={c} scope="col" className={c === 5 ? 'ref' : undefined}>{`mstat_${c}`}{c === 5 ? <small className="s10-ref-schild">bleibt draußen: Referenz</small> : null}</th>)}
      </tr></thead>
      <tbody>{PEOPLE.map(([p, code]) => <tr key={p}>
        <th scope="row">{p}</th><td>{`${code} ${MSTAT_WORD[code - 1]}`}</td>
        {[1, 2, 3, 4, 5].map(c => <td key={c} className={[c === code ? 'eins' : '', c === 5 ? 'ref' : ''].filter(Boolean).join(' ') || undefined}>{c === code ? 1 : 0}</td>)}
      </tr>)}</tbody>
    </table>
    <p className="hilfe-zeile">In jeder Zeile steht genau eine 1. Wer in mstat_1 bis mstat_4 überall 0 hat, ist ledig. Die fünfte Spalte verrät nichts Neues.</p>
  </div>;
}

const MSTAT_GENITIVE = ['der Verheirateten', 'der getrennt Lebenden', 'der Verwitweten', 'der Geschiedenen', 'der Ledigen'];

/** Text version of B6 for reference group `k` (0-based, order of MSTAT). */
export function referenceText(k: number): string {
  const ref = REFERENCES[k];
  const gaps = MSTAT.map((g, j) => (j === k ? null : `${g} ${ref.b[j]! >= 0 ? 'plus' : 'minus'} ${de(Math.abs(ref.b[j]!))}`)).filter(Boolean).join(', ');
  return `Referenz: ${MSTAT[k]}. Konstante ${de(ref.intercept)}, das ist die mittlere Lebenszufriedenheit ${MSTAT_GENITIVE[k]}. Abstände: ${gaps}. Die Vorhersagen für die fünf Gruppen bleiben bei jeder Referenz gleich: ${MSTAT.map((g, j) => `${g} ${de(MSTAT_PREDICTIONS[j])}`).join(', ')}.`;
}

/** Bild B6 `s10-referenz`: choose the reference group; constant, B and the (unchanged) predictions. */
export function Reference() {
  const [k, setK] = useState(4);
  const ref = REFERENCES[k];
  const w = 640, h = 330, l = 70, rgt = 620, top = 30, bottom = 280;
  const x = (j: number) => l + 60 + j * (rgt - l - 110) / 4;
  const y = (v: number) => bottom - (v - 6) / 2 * (bottom - top);
  return <>
    <Switches label="Referenzgruppe wählen" value={String(k)} onChange={v => setK(Number(v))}
      options={MSTAT.map((g, j) => ({ value: String(j), label: `Referenz: ${g}` }))} />
    <div className="s10-zweispaltig">
      <Picture label="Diagramm: Konstante als waagerechte Linie der Referenzgruppe und je Gruppe ein Pfeil bis zu ihrem Mittelwert. Die Werte stehen im Text unter dem Bild.">
        <svg viewBox={`0 0 ${w} ${h}`} width="100%" aria-hidden="true" focusable="false">
          <ArrowDef id="s10-pfeil-b6" color={C.orangeD} />
          {[6, 6.5, 7, 7.5, 8].map(v => <g key={v}><line x1={l} x2={rgt} y1={y(v)} y2={y(v)} stroke="#EEEBE4" /><T x={l - 8} y={y(v) + 4} textAnchor="end">{de(v, 1)}</T></g>)}
          <line x1={l} x2={l} y1={top} y2={bottom} stroke={C.ink} strokeWidth={1.5} />
          <T x={l} y={top - 12} textAnchor="start" fontSize={13.5}>Lebenszufriedenheit (Ausschnitt)</T>
          <line x1={l} x2={rgt} y1={y(ref.intercept)} y2={y(ref.intercept)} stroke={C.mute} strokeWidth={2.5} />
          <T x={rgt} y={y(ref.intercept) - 8} textAnchor="end" fill={C.mute} fontWeight={800} fontSize={13.5}>{`Konstante = ${de(ref.intercept)} (Referenz)`}</T>
          {MSTAT.map((g, j) => <g key={g}>
            {j === k
              ? <><circle cx={x(j)} cy={y(ref.intercept)} r={7} fill={C.mute} /><T x={x(j)} y={y(ref.intercept) + 22} fill={C.mute} fontWeight={800} fontSize={13.5}>Referenz</T></>
              : <>
                <line x1={x(j)} x2={x(j)} y1={y(ref.intercept)} y2={y(MSTAT_PREDICTIONS[j])} stroke={C.orangeD} strokeWidth={2.5} markerEnd="url(#s10-pfeil-b6)" />
                <circle cx={x(j)} cy={y(MSTAT_PREDICTIONS[j])} r={4} fill={C.gray} />
                <T x={x(j) + 8} y={(y(ref.intercept) + y(MSTAT_PREDICTIONS[j])) / 2 + 4} textAnchor="start" fill={C.orangeD} fontWeight={800} fontSize={13.5}>{signed(ref.b[j]!)}</T>
                <T x={x(j)} y={y(MSTAT_PREDICTIONS[j]) + (ref.b[j]! > 0 ? -10 : 18)} fill={C.mute} fontSize={13}>{de(MSTAT_PREDICTIONS[j])}</T>
              </>}
            <T x={x(j)} y={bottom + 22} fill={C.ink} fontWeight={700} fontSize={13.5}>{g}</T>
          </g>)}
        </svg>
      </Picture>
      <table className="daten s10-koeff">
        <caption>Coefficients</caption>
        <thead><tr><th scope="col">Term</th><th scope="col">B</th></tr></thead>
        <tbody>
          <tr><th scope="row">(Intercept)</th><td>{ref.intercept.toFixed(3)}</td></tr>
          {MSTAT.map((g, j) => (j === k ? null : <tr key={g}><th scope="row">{`mstat_${j + 1}`}</th><td>{ref.b[j]!.toFixed(3)}</td></tr>))}
        </tbody>
      </table>
    </div>
    <p className="s10-fest">Vorhersagen (bleiben gleich): {MSTAT.map((g, j) => `${g} ${de(MSTAT_PREDICTIONS[j])}`).join(' | ')}. R² in allen fünf Fällen {de(MSTAT_R2)}.</p>
    <TextVersion live>{referenceText(k)}</TextVersion>
    <p className="s10-fuss">Rechnest du mit den gerundeten Zahlen nach, kann die dritte Stelle um 1 abweichen (in 2a: 7,042 + 0,652 = 7,694, hier 7,695). Dass die Ledigen hier dieselbe Konstante 7,042 haben wie in 2a alle Nicht-Verheirateten zusammen, ist Zufall: Die beiden Mittelwerte unterscheiden sich erst in der vierten Stelle.</p>
  </>;
}

export const B7_TEXT = 'Vier Gruppen in einer Kreuztabelle. Oben im Osten aufgewachsen: links lebt heute im Osten, Gruppe 1, Ost-Bleibende; rechts lebt heute im Westen, Gruppe 2, Ost nach West. Unten im Westen aufgewachsen: links lebt heute im Osten, Gruppe 3, West nach Ost; rechts lebt heute im Westen, Gruppe 4, West-Bleibende, die Referenz in der Vorlage. Bei Prägung wären die Gruppen einer Zeile gleich, bei Ort die Gruppen einer Spalte.';

/** Bild B7 `s10-vier-gruppen`: 2 × 2 grid of the dg03 groups. */
export function FourGroups() {
  return <div className="grafik" role="img" aria-label={B7_TEXT}>
    <div className="s10-raster">
      <span />
      <b className="kopf">lebt heute im Osten</b>
      <b className="kopf">lebt heute im Westen</b>
      <b className="zeile">aufgewachsen im Osten</b>
      <span className="zelle">1 Ost-Bleibende <code>dg03_1</code></span>
      <span className="zelle">2 Ost→West <code>dg03_2</code></span>
      <b className="zeile">aufgewachsen im Westen</b>
      <span className="zelle">3 West→Ost <code>dg03_3</code></span>
      <span className="zelle ref">4 West-Bleibende <code>dg03_4</code><small>Referenz in der Vorlage</small></span>
    </div>
    <p className="s10-pfeile"><span>→ Prägung: gleiche Zeile, gleiche Zufriedenheit</span><span>↓ Ort: gleiche Spalte, gleiche Zufriedenheit</span></p>
  </div>;
}
