import { ArrowDown, ArrowUp } from 'lucide-react';
import { useState, type CSSProperties } from 'react';
import { cardById, type CardId } from './content';
import { noPlaceReason, type GuessRow, type View } from './domain';

const list: CSSProperties = { listStyle: 'none', padding: 0, margin: '0 0 12px', display: 'grid', gap: 6 };
const item: CSSProperties = { display: 'flex', alignItems: 'center', gap: 10, border: '1px solid var(--line)', borderRadius: 10, padding: '8px 10px' };
const place: CSSProperties = { font: '600 var(--fs-lead)/1 var(--sans)', minWidth: 28, textAlign: 'right' };
const arrowBtn: CSSProperties = { padding: '4px 8px', lineHeight: 0 };

/** Vergleich einer Karte: getippter Platz (wie links in der Liste) gegen den echten Platz in diesem Maß. */
function Badge({ row, measure, reason }: { row: GuessRow; measure: string; reason: string }) {
  if (row.place === null || row.tip === null) return <span className="s05-guess-badge" style={{ color: 'var(--muted)', fontSize: 'var(--fs-caption)' }}>
    nach {measure} ohne Platz ({reason}) · zählt hier nicht mit
  </span>;
  const s = row.shift!;
  const n = Math.abs(s), places = n === 1 ? '1 Platz' : `${n} Plätze`;
  const text = s === 0 ? 'genau getroffen' : s > 0 ? `↑ ${places} höher als getippt` : `↓ ${places} tiefer als getippt`;
  return <span className={`s05-guess-badge${s === 0 ? ' hit' : ''}`} style={{ fontSize: 'var(--fs-caption)' }}>
    getippt Platz {row.tip} · nach {measure} Platz {row.place} · <strong>{text}</strong>
  </span>;
}

/** Rang-Tipp mit den Kandidaten-Karten selbst: per ↑/↓ oder Ziehen sortieren, Tipp abgeben; nach der Enthüllung mit Pfeilen zur echten Rangliste.
 *  Im Vergleich steht links der getippte Platz so, wie er verglichen wird: Karten ohne Platz bekommen „–“, die übrigen sind ohne sie durchgezählt. */
export function RankGuess({ order, own, locked, rows, measure, view = 'weighted', onMove }: {
  order: CardId[]; own: CardId | null; locked: boolean; rows?: GuessRow[]; measure?: string; view?: View;
  onMove: (from: number, to: number) => void;
}) {
  const [drag, setDrag] = useState<number | null>(null);
  const byId = rows ? Object.fromEntries(rows.map(r => [r.id, r])) as Record<CardId, GuessRow> : null;
  return <ol className={`s05-guess${locked ? ' locked' : ''}`} style={list} aria-label={byId ? `Dein Tipp im Vergleich mit ${measure ?? 'der Rangliste'}` : 'Dein Tipp: stärkster Zusammenhang zuerst'}>
    {order.map((id, i) => {
      const c = cardById[id], mine = id === own;
      return <li key={id} className={`s05-guess-card${mine ? ' own' : ''}${drag === i ? ' dragging' : ''}`} draggable={!locked}
        onDragStart={e => { setDrag(i); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', String(i)); }}
        onDragOver={e => { if (!locked && drag !== null) e.preventDefault(); }}
        onDrop={e => { e.preventDefault(); if (drag !== null) onMove(drag, i); setDrag(null); }}
        onDragEnd={() => setDrag(null)}
        style={{ ...item, cursor: locked ? 'default' : 'grab', borderWidth: mine ? 2 : 1, borderColor: mine ? 'var(--ink)' : 'var(--line)', opacity: drag === i ? 0.5 : byId && byId[id].place === null ? 0.7 : 1 }}>
        <span style={place} aria-hidden="true">{byId ? (byId[id].tip === null ? '–' : `${byId[id].tip}.`) : `${i + 1}.`}</span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <strong>{c.title}</strong>{c.joker && <span className="s05-joker"> Joker</span>}
          {mine && <span style={{ fontSize: 'var(--fs-caption)', color: 'var(--muted)' }}> · deine Karte</span>}
          {byId && measure && <><br /><Badge row={byId[id]} measure={measure} reason={noPlaceReason(id, view)} /></>}
        </span>
        {!locked && <span style={{ display: 'flex', gap: 4 }}>
          <button type="button" style={arrowBtn} disabled={i === 0} aria-label={`${c.title} einen Platz nach oben`} onClick={() => onMove(i, i - 1)}><ArrowUp size={18} aria-hidden="true" /></button>
          <button type="button" style={arrowBtn} disabled={i === order.length - 1} aria-label={`${c.title} einen Platz nach unten`} onClick={() => onMove(i, i + 1)}><ArrowDown size={18} aria-hidden="true" /></button>
        </span>}
      </li>;
    })}
  </ol>;
}
