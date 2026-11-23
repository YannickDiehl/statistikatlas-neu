// Bild s1-rstudio: die vier Fenster von RStudio; ein Knopf hebt ein Fenster hervor und erklärt es.
import { useState } from 'react';
import { withCode } from '../../blocks/rich';
import { PANES } from '../content';
import { C, M, T } from './Svg';

type PaneId = (typeof PANES)[number]['id'];
const W = 238, H = 154;
const AT: Record<PaneId, [number, number]> = { skript: [2, 2], env: [248, 2], konsole: [2, 164], files: [248, 164] };
const HEAD: Record<PaneId, string> = { skript: 'Skript (Source)', konsole: 'Konsole (Console)', env: 'Environment', files: 'Files  Plots  Viewer  Help' };

function Body({ id, x, y }: { id: PaneId; x: number; y: number }) {
  if (id === 'skript') return <g>
    <M x={x + 10} y={y + 50}><tspan fill={C.fn}>library</tspan>(tidyverse)</M>
    <M x={x + 10} y={y + 70}><tspan fill={C.fn}>library</tspan>(mariposa)</M>
    <M x={x + 10} y={y + 98}>{'allbus <- '}<tspan fill={C.fn}>read_spss</tspan>(</M>
    <M x={x + 24} y={y + 116}><tspan fill={C.str}>"ZA8831_v1-3-0.sav"</tspan>)</M>
  </g>;
  if (id === 'konsole') return <g>
    <M x={x + 10} y={y + 50}>{'> 2 + 3'}</M>
    <M x={x + 10} y={y + 70}>[1] 5</M>
    <M x={x + 10} y={y + 90}>{'>'}</M>
    <rect x={x + 22} y={y + 79} width={7} height={14} fill={C.ink} />
  </g>;
  if (id === 'env') return <g>
    <T x={x + 10} y={y + 50} fontSize={12} fontWeight={800} fill={C.mute}>Data</T>
    <rect x={x + 10} y={y + 60} width={16} height={14} rx={2} fill={C.blauh} stroke={C.blaud} />
    <M x={x + 32} y={y + 72} fontWeight={700}>allbus</M>
    <M x={x + 32} y={y + 92} fill={C.mute}>… obs. of … variables</M>
  </g>;
  return <g>
    {['methoden-ib.Rproj', 'sitzung1.R', 'ZA8831_v1-3-0.sav'].map((f, i) => <M key={f} x={x + 10} y={y + 52 + i * 22}>{f}</M>)}
  </g>;
}

/** Interactive 2 × 2 picture of RStudio with buttons „Fenster wählen“ and a live line; the list below is its text version. */
export function RStudioPanes({ initial = null }: { initial?: PaneId | null }) {
  const [chosen, setChosen] = useState<PaneId | null>(initial);
  const pane = PANES.find(p => p.id === chosen);
  const alt = `RStudio mit vier Fenstern: oben links Skript, unten links Konsole, oben rechts Environment, unten rechts Files, Plots, Viewer, Help.${pane ? ` Hervorgehoben: ${pane.name}.` : ''}`;
  return <>
    <figure className="ebild">
      <div className="ebild-bild" role="img" aria-label={alt}>
        <svg viewBox="0 0 488 320" width="100%" aria-hidden="true" focusable="false">
          {PANES.map(p => {
            const [x, y] = AT[p.id], on = chosen === p.id;
            return <g key={p.id} opacity={chosen && !on ? 0.6 : 1}>
              <rect x={x} y={y} width={W} height={H} rx={8} fill="#fff" stroke={on ? C.blaud : C.line} strokeWidth={on ? 4 : 2} />
              <rect x={x + 2} y={y + 2} width={W - 4} height={26} rx={6} fill={C.side} />
              <T x={x + 10} y={y + 19} fontSize={12.5} fontWeight={800}>{HEAD[p.id]}</T>
              <Body id={p.id} x={x} y={y} />
            </g>;
          })}
        </svg>
      </div>
    </figure>
    <div className="s1-wahl" role="group" aria-label="Fenster wählen">
      {PANES.map(p => <button key={p.id} type="button" aria-pressed={chosen === p.id} onClick={() => setChosen(p.id)}>{p.button}</button>)}
    </div>
    <p className="erkl" aria-live="polite">{pane ? <><b>{pane.name}</b>{` (${pane.where}): `}{withCode(pane.text)}</> : 'Wähl ein Fenster.'}</p>
    <p className="s1-liste-kopf"><b>Die vier Fenster</b></p>
    <ul className="s1-liste">{PANES.map(p => <li key={p.id}><b>{p.name}</b>{` (${p.where}): `}{withCode(p.text)}</li>)}</ul>
  </>;
}
