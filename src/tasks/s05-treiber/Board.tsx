import { useMemo, useState } from 'react';
import { de } from '../kit/numbers';
import { CAT, CAT_DARK, lighten, ROLE } from '../kit/palette';
import { BOARD_COLS, BOARD_ROWS, boardMeasures, independentBoard, type BoardMeasures } from './domain';

/** Die vier Maße der Tafel – Farbe je Maß, dazu das Skalenniveau, für das es gedacht ist. */
const SHOW: { id: keyof BoardMeasures; label: string; level: string; signed: boolean }[] = [
  { id: 'V', label: 'Cramér-V', level: 'nominal', signed: false },
  { id: 'gamma', label: 'Gamma', level: 'ordinal', signed: true },
  { id: 'tau', label: 'Tau-b', level: 'ordinal', signed: true },
  { id: 'r', label: 'Pearson-r', level: 'metrisch', signed: true },
];
/** Keine Rollenfarben: Orange (echte Daten) gehört der Tafel, Blau dem Tipp, Rot dem Mittelwert, Türkis dem Modell. */
const COLOR: Record<keyof BoardMeasures, [string, string]> = { V: [CAT[4], CAT_DARK[4]], gamma: [CAT[2], CAT_DARK[2]], tau: [CAT[7], CAT_DARK[7]], r: [CAT[8], CAT_DARK[8]] };
export const BOARD_STEP = 25;
const count = (x: number) => x.toLocaleString('de-DE');
/** Reihenfolgen der Spalten beim Umschalten: wie erhoben, umgedreht, durcheinander (zweimal). */
export const BOARD_ORDERS = [[0, 1, 2], [2, 1, 0], [0, 2, 1], [1, 0, 2]];
const ROW_SHOWN = [2, 1, 0];

/** Einstieg Sitzung 6: Wer Befragte zwischen den Zellen verschiebt oder die Reihenfolge der Stufen ändert,
 *  sieht sofort, wie die vier Maße reagieren – und welches Maß auf die Reihenfolge achtet und welches nicht. */
export function Board({ start }: { start: number[][] }) {
  const [cells, setCells] = useState(start);
  const [colOrder, setColOrder] = useState(0);
  const cols = BOARD_ORDERS[colOrder];
  const m = useMemo(() => boardMeasures(cells, [0, 1, 2], cols), [cells, cols]);
  const n = cells.flat().reduce((a, b) => a + b, 0);
  const max = Math.max(...cells.flat(), 1);
  const change = (r: number, c: number, by: number) =>
    setCells(prev => prev.map((row, i) => row.map((v, j) => (i === r && j === c ? Math.max(0, v + by) : v))));
  const changed = colOrder !== 0 || cells.some((row, i) => row.some((v, j) => v !== start[i][j]));

  return <div className="s05-board">
    <div className="s05-board-left">
      <div className="s05-scroll" tabIndex={0} role="region" aria-label="Kreuztabelle Gesundheit mal Zufriedenheit mit der Demokratie">
        <table className="s05-board-table">
          <caption>Gesundheit (hs01) × Zufriedenheit mit der Demokratie (ps03) – Anzahl Befragte, zusammen {count(n)}</caption>
          <thead><tr>
            <td className="s05-board-corner">Gesundheit ↓<br />Demokratie →</td>
            {cols.map(c => <th key={c} scope="col">{BOARD_COLS[c]}</th>)}
          </tr></thead>
          <tbody>{ROW_SHOWN.map(r => <tr key={r}>
            <th scope="row">{BOARD_ROWS[r]}</th>
            {cols.map(c => {
              const v = cells[r][c];
              return <td key={c} style={{ background: lighten(ROLE.data, 1 - 0.75 * (v / max)) }}>
                <span className="s05-board-n">{count(v)}</span>
                <span className="s05-board-btns">
                  <button type="button" onClick={() => change(r, c, -BOARD_STEP)} disabled={v === 0}
                    aria-label={`${BOARD_STEP} Befragte weniger: Gesundheit ${BOARD_ROWS[r]}, ${BOARD_COLS[c]}`}>−</button>
                  <button type="button" onClick={() => change(r, c, BOARD_STEP)}
                    aria-label={`${BOARD_STEP} Befragte mehr: Gesundheit ${BOARD_ROWS[r]}, ${BOARD_COLS[c]}`}>+</button>
                </span>
              </td>;
            })}
          </tr>)}</tbody>
        </table>
      </div>
      <p className="task-field-help">Mit − und + verschiebst du je {BOARD_STEP} Befragte. Je kräftiger das Orange, desto mehr Befragte stehen in der Zelle.</p>
      <div className="sandbox-chips">
        <button type="button" onClick={() => setColOrder((colOrder + 1) % BOARD_ORDERS.length)}>Spalten anders anordnen</button>
        <button type="button" onClick={() => setCells(independentBoard(cells))}>Zusammenhang auflösen</button>
        <button type="button" disabled={!changed} onClick={() => { setCells(start); setColOrder(0); }}>Zurück zu den ALLBUS-Zahlen</button>
      </div>
      <p className="task-field-help">„Zusammenhang auflösen“ behält die Summen jeder Zeile und Spalte und verteilt die Befragten so, als hinge nichts zusammen.</p>
    </div>

    <div className="s05-board-measures" aria-live="polite">
      <p className="task-prompt">Wie stark ist der Zusammenhang?</p>
      {SHOW.map(s => {
        const v = m[s.id], [fill, dark] = COLOR[s.id];
        const left = s.signed ? 50 + Math.min(0, v) * 50 : 50, width = Math.abs(v) * 50;
        return <div key={s.id} className="s05-board-row">
          <span className="s05-board-label" style={{ color: dark }}>{s.label}<small>{s.level}</small></span>
          <span className="s05-board-bar" role="img" aria-label={`${s.label}: ${de(v, 3)}`}>
            <i className="s05-board-zero" />
            <i className="s05-board-fill" style={{ left: `${left}%`, width: `${width}%`, background: fill }} />
          </span>
          <strong style={{ color: dark }}>{de(v, 3)}</strong>
        </div>;
      })}
      <div className="s05-board-row s05-board-scale" aria-hidden="true"><span /><span><span>−1</span><span>0</span><span>1</span></span><span /></div>
      <p className="task-field-help">Die Mitte ist 0: kein Zusammenhang. Cramér-V kennt kein Vorzeichen und zeigt nur nach rechts.</p>
    </div>
  </div>;
}
