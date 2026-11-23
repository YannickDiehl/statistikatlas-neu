import { useState, type ReactNode } from 'react';
import { OUTPUT_PICKS, SUMMARY_LINES, SUMMARY_MORE_LINES } from '../content';
import { rich } from '../check';

/** A line of the output with the cells of the chosen number marked. */
function markLine(line: string, i: number, pick: string | null): ReactNode {
  const cells = OUTPUT_PICKS.find(p => p.id === pick)?.cells.filter(c => c.line === i) ?? [];
  if (!cells.length) return line;
  const parts: ReactNode[] = [];
  let at = 0;
  for (const [k, c] of cells.entries()) {
    const from = line.indexOf(c.text, at);
    if (from < 0) continue;
    parts.push(line.slice(at, from), <mark key={k} className="s9-zelle">{c.text}</mark>);
    at = from + c.text.length;
  }
  parts.push(line.slice(at));
  return parts;
}

/**
 * Bild B0 „s9-ausgabe“: the output of summary() as text with six toggles (aria-pressed). The chosen number is outlined,
 * its explanation is announced. The output itself is the text version; all explanations also in a closed details.
 */
export function OutputPicker() {
  const [pick, setPick] = useState<string | null>(null);
  const chosen = OUTPUT_PICKS.find(p => p.id === pick);
  return <div className="s9-ausgabe">
    <div className="s9-umschalter" role="group" aria-label="Eine Zahl in der Ausgabe zeigen">
      {OUTPUT_PICKS.map(p => <button key={p.id} type="button" className="s9-schalter" aria-pressed={pick === p.id}
        onClick={() => setPick(x => (x === p.id ? null : p.id))}>{p.label}</button>)}
    </div>
    <figure className="s9-pre">
      <figcaption>Ausgabe von summary() für ls01 ~ lage</figcaption>
      <pre tabIndex={0}>{SUMMARY_LINES.map((l, i) => <span key={i}>{markLine(l, i, pick)}{'\n'}</span>)}</pre>
      <details className="s9-mehr">
        <summary>… weitere Abschnitte</summary>
        <pre tabIndex={0}>{SUMMARY_MORE_LINES.join('\n')}</pre>
      </details>
    </figure>
    <p className="erkl" aria-live="polite">{chosen ? rich(chosen.text) : 'Wähl eine Zahl.'}</p>
    <details className="genauer">
      <summary>Alle Zahlen erklärt</summary>
      <ul>{OUTPUT_PICKS.map(p => <li key={p.id}><b>{`${p.label}: `}</b>{rich(p.text)}</li>)}</ul>
    </details>
  </div>;
}
