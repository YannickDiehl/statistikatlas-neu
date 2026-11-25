import { useState } from 'react';
import { COLUMNS, LA01, PERCENT_FORMULA_TEXT, type Column } from '../content';
import { r2, whole } from './util';

/** Explanation of a column: its name in bold, then the text. */
export function columnText(key: Column) {
  const c = COLUMNS.find(x => x.key === key)!;
  return <><b>{c.name}</b>{c.text}</>;
}

/**
 * Bild B2 „Die Spalten von frequency()“: the printed table of `allbus %>% frequency(la01)` as a real table.
 * Four toggle buttons highlight one column and explain it (aria-live). The table itself is the text version.
 */
export function FrequencyTable() {
  const [col, setCol] = useState<Column | null>(null);
  const pick = (k: Column) => setCol(c => (c === k ? null : k));
  const hl = (k: Column, extra = '') => (col === k ? `hl${extra}` : extra.trim() || undefined);
  const cumHelper = (i: number) => (col === 'cum' && i < 2 ? 'hl-strich' : undefined);

  return <div className="s3-freq">
    <div className="reihe-knoepfe" role="group" aria-label="Spalte hervorheben">
      {COLUMNS.map(c => <button key={c.key} type="button" className="knopf hell" aria-pressed={col === c.key} onClick={() => pick(c.key)}>{c.name}</button>)}
    </div>
    <pre className="s3-ausgabe">{`${LA01.title}\n${LA01.header}`}</pre>
    <div className="s3-tabelle">
      <table className="daten s3-mono">
        <caption>Ausgabe von frequency(la01)</caption>
        <thead><tr>{['Value', 'Label', 'N', 'Raw %', 'Valid %', 'Cum. %'].map(h => <th key={h} scope="col">{h}</th>)}</tr></thead>
        <tbody>
          {LA01.rows.map((r, i) => <tr key={r.value}>
            <td>{r.value}</td><td>{r.label}</td>
            <td className={hl('n')}>{r.n}</td><td className={hl('raw')}>{r2(r.raw)}</td>
            <td className={hl('valid') ?? cumHelper(i)}>{r2(r.valid)}</td><td className={hl('cum')}>{r2(r.cum)}</td>
          </tr>)}
          <tr className="summe"><th scope="row" colSpan={2}>Total valid</th>
            <td className={hl('n')}>{LA01.valid}</td><td className={hl('raw')}>{r2(LA01.rawValid)}</td><td className={hl('valid')}>100.00</td><td></td></tr>
          {LA01.missing.map(m => <tr key={m.value} className="fehlt">
            <td>{m.value}</td><td>{m.label}</td>
            <td className={hl('n')}>{m.n}</td><td className={hl('raw')}>{r2(m.raw)}</td><td></td><td></td>
          </tr>)}
          <tr className="summe"><th scope="row" colSpan={2}>Total missing</th>
            <td className={hl('n')}>{LA01.totalMissing}</td><td className={hl('raw')}>{r2(LA01.rawMissing)}</td><td></td><td></td></tr>
          <tr className="summe"><th scope="row" colSpan={2}>Total</th>
            <td className={hl('n')}>{LA01.total}</td><td className={hl('raw')}>100.00</td><td></td><td></td></tr>
        </tbody>
      </table>
    </div>
    <p className="erkl" aria-live="polite">{col ? columnText(col) : 'Wähl eine Spalte.'}</p>
    <details className="genauer s3-alle">
      <summary>Alle vier Spalten erklärt</summary>
      <ul>{COLUMNS.map(c => <li key={c.key}>{columnText(c.key)}</li>)}</ul>
    </details>
  </div>;
}

/** Bild B2b „Formel lesen lernen“: Prozent als Bausteine, mit eingesetzten Zahlen für Valid % und Raw %. */
export function PercentFormula() {
  const daily = LA01.rows[0];
  return <div className="formel s3-formel" role="img" aria-label={PERCENT_FORMULA_TEXT}>
    <span className="frac"><span>absolute Häufigkeit (N)</span><span>Prozentbasis</span></span>
    <span aria-hidden="true">× 100 =</span><span className="gross">Prozent</span>
    <ul className="s3-eingesetzt">
      <li><b>Valid %:</b> {`${whole(daily.n)} Befragte mit TAEGLICH, geteilt durch ${whole(LA01.valid)} gültige Antworten, mal 100 = 19,93`}</li>
      <li><b>Raw %:</b> {`${whole(daily.n)} geteilt durch alle ${whole(LA01.total)} Befragten, mal 100 = 19,84`}</li>
    </ul>
  </div>;
}
