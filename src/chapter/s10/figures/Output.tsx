// Sitzung 10, Karte R2 „Die Ausgabe von summary() lesen“ (Bild s10-ausgabe): the real output as text, four switches.
import { useState } from 'react';
import { withCode } from '../../blocks/rich';
import { MODEL_AG, OUTPUT_BLOCKS, OUTPUT_EXPLAIN, OUTPUT_LINES, type OutputBlock } from '../content';
import { Switches } from './common';

type Pick = Exclude<OutputBlock, 'beschreibung' | 'anova'>;
/** Blocks shown pale in every state (not needed today). */
const PALE: OutputBlock[] = ['beschreibung', 'anova'];

export function OutputReader() {
  const [sel, setSel] = useState<Pick | null>(null);
  const explain = OUTPUT_EXPLAIN.find(e => e.block === sel);
  return <>
    <Switches label="Block der Ausgabe wählen" value={sel} onChange={setSel}
      options={OUTPUT_EXPLAIN.map(e => ({ value: e.block as Pick, label: e.label }))} />
    <div role="region" aria-label="Ausgabe von summary() für das Modell ls01 aus age und gesund">
    <pre className="code solo s10-ausgabe" tabIndex={0}>
      {OUTPUT_BLOCKS.map(b => {
        const cls = sel === b.block ? 'blk gewaehlt' : PALE.includes(b.block) || sel ? 'blk blass' : 'blk';
        return <span key={b.block} className={cls} data-block={b.block}>
          {b.block === 'anova' ? <span className="s10-schild"><span className="sr-only">Heute nicht nötig: </span><span aria-hidden="true">heute nicht nötig</span></span> : null}
          {OUTPUT_LINES.slice(b.from, b.to).join('\n') + '\n'}
        </span>;
      })}
    </pre>
    </div>
    <p className="erkl" aria-live="polite">{explain ? <><b>{`${explain.label}: `}</b>{withCode(explain.text)}</> : 'Wähl einen Block.'}</p>
    <details className="genauer">
      <summary>Alle vier Blöcke erklärt</summary>
      {OUTPUT_EXPLAIN.map(e => <p key={e.block}><b>{`${e.label}: `}</b>{withCode(e.text)}</p>)}
    </details>
    <details className="werte">
      <summary>Kopf und drei Blöcke als Tabellen</summary>
      <table className="daten">
        <caption>Kopf der Ausgabe</caption>
        <tbody>
          <tr><th scope="row">Formula</th><td>{MODEL_AG.formula}</td></tr>
          <tr><th scope="row">N</th><td>{String(MODEL_AG.n)}</td></tr>
          <tr><th scope="row">Weights</th><td>{MODEL_AG.weights}</td></tr>
        </tbody>
      </table>
      <table className="daten">
        <caption>Model Summary</caption>
        <tbody>
          <tr><th scope="row">R</th><td>0.436</td></tr>
          <tr><th scope="row">R Square</th><td>0.190</td></tr>
          <tr><th scope="row">Adjusted R Square</th><td>0.190</td></tr>
          <tr><th scope="row">Std. Error of the Estimate</th><td>1.728</td></tr>
        </tbody>
      </table>
      <table className="daten">
        <caption>Coefficients</caption>
        <thead><tr>{['Term', 'B', 'Std. Error', 'Beta', 't', 'Sig.', '95% CI Lower', '95% CI Upper'].map(h => <th key={h} scope="col">{h}</th>)}</tr></thead>
        <tbody>
          <tr><th scope="row">(Intercept)</th><td>3.095</td><td>0.135</td><td></td><td>22.854</td><td>&lt;.001</td><td>2.830</td><td>3.361</td></tr>
          <tr><th scope="row">age</th><td>0.024</td><td>0.001</td><td>0.225</td><td>16.931</td><td>&lt;.001</td><td>0.021</td><td>0.026</td></tr>
          <tr><th scope="row">gesund</th><td>0.861</td><td>0.025</td><td>0.454</td><td>34.124</td><td>&lt;.001</td><td>0.811</td><td>0.910</td></tr>
        </tbody>
      </table>
      <table className="daten">
        <caption>Collinearity Statistics</caption>
        <thead><tr><th scope="col">Term</th><th scope="col">Tolerance</th><th scope="col">VIF</th></tr></thead>
        <tbody>
          <tr><th scope="row">age</th><td>{MODEL_AG.age.tolerance.toFixed(3)}</td><td>{MODEL_AG.age.vif.toFixed(3)}</td></tr>
          <tr><th scope="row">gesund</th><td>{MODEL_AG.gesund.tolerance.toFixed(3)}</td><td>{MODEL_AG.gesund.vif.toFixed(3)}</td></tr>
        </tbody>
      </table>
    </details>
  </>;
}
