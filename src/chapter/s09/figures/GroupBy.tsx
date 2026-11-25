import { C, T } from './plot';

/** Text version B8 (sitzung09.md). */
export const GROUP_BY_TEXT = 'group_by(pt03) legt alle Fälle mit demselben Wert bei pt03 in eine eigene Gruppe. describe() rechnet dann für jede Gruppe getrennt Mittelwert und Standardabweichung des Residuums.';

/** Six example rows: pt03, demo, residuum (= demo − (2.288 + 0.465 × pt03), gerundet). */
const ROWS: [number, number, string][] = [[1, 2, '-0.75'], [4, 5, '0.85'], [7, 6, '0.46'], [1, 4, '1.25'], [4, 3, '-1.15'], [7, 5, '-0.54']];
const COLS = ['pt03', 'demo', 'residuum'];
const MONO = 'Menlo, Consolas, monospace';

/** One plate with the three towers; `rows` are drawn from top to bottom. */
function Plate({ x, y, rows, w = 210 }: { x: number; y: number; rows: [number, number, string][]; w?: number }) {
  const rh = 26, cw = w / 3;
  return <g>
    <rect x={x - 6} y={y - 30} width={w + 12} height={rows.length * rh + 40} rx={8} fill="#FFF6DA" stroke={C.yellow} strokeWidth={1.5} />
    {COLS.map((c, j) => <text key={c} x={x + cw * j + cw / 2} y={y - 10} textAnchor="middle" fontFamily={MONO} fontSize={w < 200 ? 12 : 14} fontWeight={700} fill={C.ink}>{c}</text>)}
    {rows.map((r, i) => r.map((v, j) => <g key={`${i}-${j}`}>
      <rect x={x + cw * j + 3} y={y + i * rh} width={cw - 6} height={rh - 4} rx={3} fill={j === 0 ? '#FFE7A3' : j === 1 ? C.blue : '#FFD2BC'} stroke={j === 0 ? C.yellow : j === 1 ? C.blueDark : C.orangeDark} strokeWidth={0.8} />
      <text x={x + cw * j + cw / 2} y={y + i * rh + 16} textAnchor="middle" fontFamily={MONO} fontSize={14} fontWeight={700} fill={C.ink}>{String(v)}</text>
    </g>))}
  </g>;
}

/** Bild B8 „s9-group-by“ (static): one plate of six rows, group_by(pt03) splits it into one plate per value. */
export function GroupBy() {
  const groups = [1, 4, 7].map(g => ROWS.filter(r => r[0] === g));
  return <figure className="ebild">
    <div className="ebild-bild" role="img" aria-label={GROUP_BY_TEXT}>
      <svg viewBox="0 0 520 470" width="100%" aria-hidden="true" focusable="false">
        <T x={10} y={20} textAnchor="start" fontStyle="italic" fill="#6E7882" fontSize={14}>zum Beispiel sechs Befragte</T>
        <Plate x={140} y={66} rows={ROWS} w={240} />
        <defs><marker id="s9-gb-pfeil" markerWidth={8} markerHeight={8} refX={6} refY={4} orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill={C.ink} /></marker></defs>
        <path d="M260,234 L260,272" stroke={C.ink} strokeWidth={2.5} markerEnd="url(#s9-gb-pfeil)" />
        <text x={272} y={258} textAnchor="start" fontFamily={MONO} fontSize={15} fontWeight={700} fill={C.green}>group_by(pt03)</text>
        {groups.map((rows, k) => {
          const x = 12 + k * 172;
          return <g key={k}>
            <Plate x={x} y={322} rows={rows} w={154} />
            <rect x={x} y={322 + rows.length * 26 + 22} width={154} height={46} rx={6} fill="#fff" stroke={C.green} strokeWidth={1.5} />
            <T x={x + 77} y={322 + rows.length * 26 + 41} fill={C.green} fontWeight={700} fontSize={14}>{`pt03 = ${[1, 4, 7][k]}`}</T>
            <T x={x + 77} y={322 + rows.length * 26 + 60} fill={C.ink} fontSize={14}>Mean, SD</T>
          </g>;
        })}
      </svg>
    </div>
  </figure>;
}
