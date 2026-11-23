import { useMemo, useState } from 'react';
import type { SavFile } from '../../sandbox/readSav';
import { de } from '../kit/numbers';
import { collapse, cutPercent, cutTable, type Base, type Cell, type ColRole, type RowRole } from './domain';

/** Kreislauf beim Anklicken: offen → … → fällt heraus → offen. Nichts ist vorbelegt. */
const ROW_CYCLE: RowRole[] = ['open', 'distrust', 'others', 'out'];
const COL_CYCLE: ColRole[] = ['open', 'nonvote', 'vote', 'out'];
const ROW_WORD: Record<RowRole, string> = { open: 'offen', distrust: 'misstraut', others: 'übrige', out: 'fällt heraus' };
const COL_WORD: Record<ColRole, string> = { open: 'offen', nonvote: 'wählt nicht', vote: 'wählt', out: 'raus' };
const next = <T,>(cycle: T[], now: T) => cycle[(cycle.indexOf(now) + 1) % cycle.length];
const BASES: { id: Base; label: string }[] = [
  { id: 'row', label: 'die Misstrauenden' },
  { id: 'col', label: 'die Nichtwählenden' },
  { id: 'all', label: 'alle' },
];
const IN_BASE: Record<Base, Cell[]> = { row: ['a', 'b'], col: ['a', 'c'], all: ['a', 'b', 'c', 'd'] };
const cellOf = (r: RowRole, c: ColRole): Cell | null =>
  r === 'open' || r === 'out' || c === 'open' || c === 'out' ? null : r === 'distrust' ? (c === 'nonvote' ? 'a' : 'b') : (c === 'nonvote' ? 'c' : 'd');
const count = (x: number) => x.toLocaleString('de-DE');

/** Zuschnitt-Tabelle: die ganze Kreuztabelle pe01 × pv01 mit allen Codes. Wer Zeilen- und Spaltenköpfe anklickt,
 *  teilt die Befragten selbst ein – daneben entsteht live die Vierfeldertafel mit der gewählten Prozentbasis. */
export function Zuschnitt({ sav }: { sav: SavFile }) {
  const table = useMemo(() => cutTable(sav), [sav]);
  const [rows, setRows] = useState<Record<number, RowRole>>({});
  const [cols, setCols] = useState<Record<number, ColRole>>({});
  const [base, setBase] = useState<Base>('row');
  const f = collapse(table, rows, cols);
  const ready = f.a + f.b > 0 && f.c + f.d > 0 && f.a + f.c > 0 && f.b + f.d > 0;
  const focus = ready ? cutPercent(f, 'a', base) : null;
  const sentence = focus === null ? 'Teil Zeilen und Spalten ein – dann erscheint hier die Zahl.'
    : base === 'row' ? `Von den Misstrauenden würden ${de(focus, 1)} % nicht wählen.`
    : base === 'col' ? `Von den Nichtwählenden misstrauen ${de(focus, 1)} %.`
    : `${de(focus, 1)} % aller Befragten misstrauen und würden nicht wählen.`;
  const roleOfRow = (code: number) => rows[code] ?? 'open', roleOfCol = (code: number) => cols[code] ?? 'open';

  const small = (cell: Cell, label: string) => {
    const inBase = IN_BASE[base].includes(cell), share = ready && inBase ? cutPercent(f, cell, base) : null;
    return <td className={`s04-cut-four c-${cell}${inBase ? ' in-base' : ''}`} aria-label={`${label}: ${count(f[cell])} Befragte${share === null ? '' : `, ${de(share, 1)} %`}`}>
      <span>{count(f[cell])}</span>{share !== null && <strong>{de(share, 1)} %</strong>}
    </td>;
  };

  return <div className="s04-cut">
    <div className="s04-scroll" tabIndex={0} role="region" aria-label="Originaltabelle pe01 mal pv01">
      <table className="s04-cut-table">
        <caption>pe01 „Politiker kümmern sich nicht um Leute wie mich“ (Zeilen) × pv01 Wahlabsicht (Spalten) – Anzahl Befragte</caption>
        <thead><tr><td className="s04-cut-corner">Klick einen Kopf, um ihn einzuteilen</td>
          {table.cols.map(c => {
            const role = roleOfCol(c.code);
            return <th key={c.code} scope="col" className={`col-${role}`}>
              <button type="button" onClick={() => setCols(prev => ({ ...prev, [c.code]: next(COL_CYCLE, prev[c.code] ?? 'open') }))} aria-label={`Spalte ${c.code} ${c.label}: ${COL_WORD[role]}. Klicken zum Wechseln`}>
                <b>{c.code}</b><span>{c.label}</span><small>{COL_WORD[role]}</small>
              </button>
            </th>;
          })}
        </tr></thead>
        <tbody>{table.rows.map(r => {
          const role = roleOfRow(r.code);
          return <tr key={r.code}>
            <th scope="row" className={`row-${role}`}>
              <button type="button" onClick={() => setRows(prev => ({ ...prev, [r.code]: next(ROW_CYCLE, prev[r.code] ?? 'open') }))} aria-label={`Zeile ${r.code} ${r.label}: ${ROW_WORD[role]}. Klicken zum Wechseln`}>
                <span><b>{r.code}</b> {r.label}</span><small>{ROW_WORD[role]}</small>
              </button>
            </th>
            {table.cols.map(c => {
              const n = table.n.get(`${r.code}|${c.code}`) ?? 0, cell = cellOf(role, roleOfCol(c.code));
              return <td key={c.code} className={cell ? `c-${cell}` : roleOfRow(r.code) === 'out' || roleOfCol(c.code) === 'out' ? 'gone' : ''}>{n || ''}</td>;
            })}
          </tr>;
        })}</tbody>
      </table>
    </div>
    <p className="s04-cut-legend">
      <span><i className="c-a" />misstraut · wählt nicht</span><span><i className="c-b" />misstraut · wählt</span>
      <span><i className="c-c" />übrige · wählt nicht</span><span><i className="c-d" />übrige · wählt</span>
    </p>

    <div className="s04-cut-result">
      <div>
        <p className="task-prompt">Wer ist 100 %?</p>
        <div className="sandbox-chips" role="group" aria-label="Prozentbasis">
          {BASES.map(b => <button key={b.id} type="button" aria-pressed={base === b.id} onClick={() => setBase(b.id)}>{b.label}</button>)}
        </div>
        <table className="s04-cut-small">
          <thead><tr><td /><th scope="col">wählt nicht</th><th scope="col">wählt</th></tr></thead>
          <tbody>
            <tr><th scope="row">misstraut</th>{small('a', 'misstraut, wählt nicht')}{small('b', 'misstraut, wählt')}</tr>
            <tr><th scope="row">übrige</th>{small('c', 'übrige, wählt nicht')}{small('d', 'übrige, wählt')}</tr>
          </tbody>
        </table>
      </div>
      <div className="s04-cut-number" aria-live="polite">
        <strong>{focus === null ? '–' : `${de(focus, 1)} %`}</strong>
        <span>{sentence}</span>
        {f.open > 0 && <small>Noch nicht eingeteilt: {count(f.open)} Befragte – sie zählen erst mit, wenn du für Zeile und Spalte entschieden hast.</small>}
      </div>
    </div>
  </div>;
}
