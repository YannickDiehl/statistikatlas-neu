// Bilder aus HTML-Bausteinen: Regel lesen (R2), Ausgabe von crosstab() (R3), drei Prozentbasen (Grundlage 2), Formeln.
import type { CSSProperties, ReactNode } from 'react';
import { ALT, SEX_TEILZEIT, margins, percent, round1, type Basis, type Cross } from '../content';
import { Fig, de, whole } from './parts';

/* ---------- R2: Eine Regel lesen ---------- */

type Brick = { text: string; kind: 'num' | 'lbl' | 'op' | 'kw'; note?: string };
const RULES: { bricks: Brick[]; sum: string; empty?: boolean }[] = [
  { bricks: [{ text: '2:3', kind: 'num', note: 'alte Codes: 2 bis 3' }, { text: '=', kind: 'op', note: 'werden zu' }, { text: '1', kind: 'num', note: 'neuer Code' }, { text: '[Teilzeit]', kind: 'lbl', note: 'Aufkleber (Wertelabel)' }], sum: 'Teilzeit und nebenher werden 1, Wertelabel Teilzeit' },
  { bricks: [{ text: '1', kind: 'num' }, { text: '=', kind: 'op' }, { text: '0', kind: 'num' }, { text: '[Vollzeit]', kind: 'lbl' }], sum: 'Vollzeit wird 0, Wertelabel Vollzeit' },
  { bricks: [{ text: 'else', kind: 'kw' }, { text: '=', kind: 'op' }, { text: 'NA', kind: 'kw' }], sum: 'alles andere wird leer: nicht erwerbstätig, keine Angabe', empty: true },
];

/** Bild „Eine Regel lesen“ (s5-regel): die Regel als Bausteine mit Beschriftung je Teil. */
export function RuleFigure({ caption }: { caption?: ReactNode }) {
  return <Fig alt={ALT.regel} caption={caption}>
    <div className="s5-regel">
      {RULES.map((r, i) => <div className="s5-regel-teil" key={i}>
        {i > 0 ? <span className="s5-semi"><b className="s5-op">;</b><small>nächste Regel</small></span> : null}
        <span className="s5-block">
          <span className="s5-bricks">{r.bricks.map((b, k) => <span className="s5-brick" key={k}>
            <b className={`s5-${b.kind}`}>{b.text}</b>{b.note ? <small>{b.note}</small> : null}
          </span>)}{r.empty ? <span className="s5-brick"><b className="s5-leer"> </b></span> : null}</span>
          <span className="s5-sum">{r.sum}</span>
        </span>
      </div>)}
    </div>
  </Fig>;
}

/* ---------- R3: Ausgabe von crosstab() ---------- */

const OUT: [string, number?, string?][] = [
  ['Crosstabulation: GESCHLECHT, BEFRAGTE(R) x BEFRAGTE(R) BERUFSTAETIG? (recoded)'],
  ['- Row variable: sex', 1],
  ['- Column variable: teilzeit', 1],
  ['- Percentages: Row percentages', 2],
  ['- N (valid): 3359', 3],
  ['- Missing: 1887', 3],
  ['| GESCHLECHT, BEFRAGTE(R) | Vollzeit | Teilzeit |  Total |', 5],
  ['| MANN                    |     1379 |      301 |   1680 |'],
  ['|   row %                 |    82.1% |    17.9% | 100.0% |'],
  ['| FRAU                    |      805 |      860 |   1665 |', 4, ' 860'],
  ['|   row %                 |    48.3% |    51.7% | 100.0% |', undefined, '51.7%'],
  ['| DIVERS                  |        8 |        6 |     14 |'],
  ['|   row %                 |    57.1% |    42.9% | 100.0% |'],
  ['| Total                   |     2192 |     1167 |   3359 |', 6],
  ['|   row %                 |    65.3% |    34.7% | 100.0% |'],
];
const NOTES = [
  'Zeilen: Geschlecht. Spalten: Teilzeit.',
  'welche Prozent: hier Zeilenprozente',
  '3.359 stehen in der Tabelle, 1.887 fehlen bei mindestens einer der beiden Variablen',
  'obere Zahl: Anzahl (860), darunter Prozent (51,7 %)',
  'Zeilensumme',
  'Spaltensumme; unten rechts alle',
];
const CIRCLED = ['①', '②', '③', '④', '⑤', '⑥'];
/** Marks the cell Frau/Teilzeit (count and percent) in its line. */
function marked(line: string, cell: string) {
  const at = line.lastIndexOf(cell);
  return <>{line.slice(0, at)}<mark>{cell}</mark>{line.slice(at + cell.length)}</>;
}

/** Bild „Ausgabe mit Beschriftungen“ (s5-crosstab-ausgabe). */
export function CrosstabOutputFigure({ caption }: { caption?: ReactNode }) {
  return <Fig alt={ALT.crosstab} caption={caption} className="s5-ausgabe-bild">
    <div className="s5-ausgabe">
      <pre>{OUT.map(([line, n, cell], i) => <span key={i}>
        {cell ? marked(line, cell) : line}
        {n ? <b className="s5-nr">{` ${CIRCLED[n - 1]}`}</b> : null}{'\n'}
      </span>)}</pre>
      <ol>{NOTES.map((t, i) => <li key={i}><b className="s5-nr">{CIRCLED[i]}</b> {t}</li>)}</ol>
    </div>
  </Fig>;
}

/* ---------- Grundlage 2: Tabellen mit Basis ---------- */

/**
 * Yellow frame of the basis: borders on the outer sides of the group a cell belongs to.
 * `only` limits it to the basis of one chosen cell (Basis-Schalter); without it every group of the basis is framed.
 */
export function frame(c: Cross, basis: Basis, i: number, j: number, only?: [number, number]): CSSProperties | undefined {
  const R = c.rows.length, C = c.cols.length, line = '3px solid #EFC867';
  if (basis === 'row') {
    if (only ? i !== only[0] : i === R) return undefined;
    return { background: '#FFE7A3', borderTop: line, borderBottom: line, borderLeft: j === 0 ? line : undefined, borderRight: j === C ? line : undefined };
  }
  if (basis === 'col') {
    if (only ? j !== only[1] : j === C) return undefined;
    return { background: '#FFE7A3', borderLeft: line, borderRight: line, borderTop: i === 0 ? line : undefined, borderBottom: i === R ? line : undefined };
  }
  return { background: '#FFE7A3', borderTop: i === 0 ? line : undefined, borderBottom: i === R ? line : undefined, borderLeft: j === 0 ? line : undefined, borderRight: j === C ? line : undefined };
}

export const BASIS_TITLE: Record<Basis, [string, string]> = {
  row: ['Zeilenprozente', 'jede Zeile ist 100 %'],
  col: ['Spaltenprozente', 'jede Spalte ist 100 %'],
  total: ['Gesamtprozente', 'alle zusammen sind 100 %'],
};
const QUESTION: Record<Basis, string> = {
  row: 'Wie viele der Frauen arbeiten Teilzeit?',
  col: 'Wie viele der Teilzeitkräfte sind Frauen?',
  total: 'Wie viele aller Erwerbstätigen sind Frauen in Teilzeit?',
};

/** Count of a cell including the margins (i = R is Total, j = C is Total). */
export function countOf(c: Cross, i: number, j: number) {
  const { rowSums, colSums, n } = margins(c);
  if (i === c.rows.length) return j === c.cols.length ? n : colSums[j];
  return j === c.cols.length ? rowSums[i] : c.cells[i][j];
}
/** Percent as printed: one decimal, 100 without decimals in the picture. */
export const pctText = (x: number) => (round1(x) === 100 ? '100' : de(round1(x)));

function SmallTable({ basis }: { basis: Basis }) {
  const c = SEX_TEILZEIT;
  const rows = [...c.rows.map(r => r.toUpperCase()), 'Total'];
  const cols = [...c.cols, 'Total'];
  return <div className="s5-mini">
    <p><b>{BASIS_TITLE[basis][0]}:</b> {BASIS_TITLE[basis][1]}</p>
    <table>
      <thead><tr><th></th>{cols.map(h => <th key={h}>{h}</th>)}</tr></thead>
      <tbody>{rows.map((r, i) => <tr key={r}>
        <th>{r}</th>
        {cols.map((_, j) => {
          const hot = i === 1 && j === 1;
          return <td key={j} className={hot ? 's5-zelle' : undefined} style={frame(c, basis, i, j)}>
            <b>{whole(countOf(c, i, j))}</b><span>{pctText(percent(c, basis, i, j))}</span>
          </td>;
        })}
      </tr>)}</tbody>
    </table>
    <p className="s5-mini-frage">{QUESTION[basis]} <b>{`${de(round1(percent(c, basis, 1, 1)))} %`}</b></p>
  </div>;
}

/** Bild „Tabelle mit hervorgehobenen Zellen, dreimal“ (s5-drei-basen) and its text version as a table. */
export function ThreeBasesFigure({ caption }: { caption: ReactNode }) {
  const c = SEX_TEILZEIT;
  const lines: [string, string, number, number][] = [];
  c.rows.forEach((r, i) => c.cols.forEach((col, j) => lines.push([r, col, i, j])));
  c.cols.forEach((col, j) => lines.push(['Total', col, c.rows.length, j]));
  return <>
    <Fig alt={ALT.dreiBasen} caption={caption}>
      <div className="s5-drei">{(['row', 'col', 'total'] as Basis[]).map(b => <SmallTable key={b} basis={b} />)}</div>
    </Fig>
    <details className="werte">
      <summary>Die drei Tabellen als Zahlen</summary>
      <div className="s5-scroll" tabIndex={0} role="region" aria-label="Die drei Tabellen als Zahlen, seitlich verschiebbar"><table className="daten s5-werte">
        <caption className="sr-only">Die drei Tabellen als Zahlen</caption>
        <thead><tr><th scope="col">Zeile</th><th scope="col">Spalte</th><th scope="col">Anzahl</th><th scope="col">Zeilen-%</th><th scope="col">Spalten-%</th><th scope="col">Gesamt-%</th></tr></thead>
        <tbody>{lines.map(([r, col, i, j]) => <tr key={`${r}-${col}`}>
          <td>{r}</td><td style={{ textAlign: 'left' }}>{col}</td><td>{whole(countOf(c, i, j))}</td>
          {(['row', 'col', 'total'] as Basis[]).map(b => <td key={b}>{pctText(percent(c, b, i, j))}</td>)}
        </tr>)}</tbody>
      </table></div>
    </details>
  </>;
}

/* ---------- Formeln als Bausteine ---------- */

/** Grundlage 2: Prozent = Anzahl in der Zelle / Anzahl in der Basis, dreimal. */
export function PercentFormula() {
  const c = SEX_TEILZEIT, { rowSums, colSums, n } = margins(c), cell = c.cells[1][1];
  const lines: [string, number][] = [['Zeile Frau', rowSums[1]], ['Spalte Teilzeit', colSums[1]], ['alle', n]];
  const sr = `Prozent gleich Anzahl in der Zelle geteilt durch Anzahl in der Basis, mal hundert. Zelle Frau und Teilzeit: ${cell}. `
    + lines.map(([name, base]) => `Basis ${name} ${whole(base)}, ergibt ${de(round1(cell / base * 100))} Prozent.`).join(' ');
  return <div className="formel s5-formel" role="group" aria-label="Formel für Prozent in einer Kreuztabelle">
    <div className="s5-formel-zeile" aria-hidden="true">
      <span><b>Prozent</b></span><span>=</span>
      <span className="frac"><span>Anzahl in der Zelle</span><span>Anzahl in der Basis</span></span><span>× 100</span>
    </div>
    {lines.map(([name, base]) => <div className="s5-formel-zeile" aria-hidden="true" key={name}>
      <span className="s5-basis-schild">{name}</span>
      <span className="frac"><span>{whole(cell)}</span><span>{whole(base)}</span></span><span>≈</span>
      <span className="gross">{`${de(round1(cell / base * 100))} %`}</span>
    </div>)}
    <span className="sr-only">{sr}</span>
    <p className="s5-formel-satz">Der Zähler bleibt gleich. Nur der Nenner, die Basis, wechselt.</p>
  </div>;
}

/** Grundlage 3: Prozentpunkte oder Prozent? */
export function PointsFormula() {
  const c = SEX_TEILZEIT, w = round1(percent(c, 'row', 1, 1)), m = round1(percent(c, 'row', 0, 1));
  const diff = round1(w - m), ratio = Math.round(w / m * 10) / 10;
  return <div className="formel s5-formel" role="group" aria-label="Prozentpunkte oder Prozent?">
    <div className="s5-formel-zeile" aria-hidden="true">
      <span><b>Abstand</b></span><span>=</span><span>{`${de(w)} % − ${de(m)} %`}</span><span>=</span><span className="gross">{`${de(diff)} Prozentpunkte`}</span>
      <small>abziehen: um wie viel höher?</small>
    </div>
    <div className="s5-formel-zeile" aria-hidden="true">
      <span><b>Verhältnis</b></span><span>=</span><span>{`${de(w)} ÷ ${de(m)}`}</span><span>≈</span><span className="gross">{de(ratio)}</span>
      <small>teilen: wievielmal so häufig?</small>
    </div>
    <span className="sr-only">{`Abstand: ${de(w)} Prozent minus ${de(m)} Prozent gleich ${de(diff)} Prozentpunkte. Verhältnis: ${de(w)} geteilt durch ${de(m)} ungefähr ${de(ratio)}, also fast dreimal so häufig.`}</span>
    <p className="s5-formel-satz">Beides ist richtig, aber nicht dasselbe. ‚33,8 Prozentpunkte mehr‘ und ‚fast dreimal so häufig‘ beschreiben denselben Unterschied. ‚33,8 Prozent mehr‘ wäre falsch.</p>
  </div>;
}
