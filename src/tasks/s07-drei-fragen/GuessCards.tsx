import { useState, type CSSProperties } from 'react';
import { de } from '../kit/numbers';
import { ITEM_IDS, ITEMS, type ItemId } from './content';

const badge = (color: string, filled: boolean): CSSProperties => ({
  display: 'inline-block', alignSelf: 'flex-start', font: '600 var(--fs-small)/1.3 var(--sans)', borderRadius: 999, padding: '2px 9px', marginTop: 8, marginRight: 6,
  border: `1.5px solid ${color}`, color: filled ? '#fff' : color, background: filled ? color : '#fff',
});

/** Die sieben Items als Karten. Vor dem Rechnen: Klick auf eine Karte = Tipp „passt am schlechtesten“.
 *  Die Zustimmung in Prozent erscheint erst mit dem Vergleich Tipp gegen R (showAgree) – vorher würde sie den Tipp lenken, auch über „Neu tippen“.
 *  Nach dem Vergleich trägt das echte schwächste Item ein zweites Abzeichen. */
/** Zustimmung auf der Karte: erst wenn der Vergleich sichtbar ist, sonst leer. */
export const agreeText = (show: boolean, share: number) => (show && Number.isFinite(share) ? `${de(100 * share, 0)} % Zustimmung` : '');

export function GuessCards({ guess, locked, weakest, agree, showAgree, onPick }: {
  guess: ItemId | ''; locked: boolean; weakest: ItemId | null; agree: Record<ItemId, number>; showAgree: boolean; onPick: (id: ItemId) => void;
}) {
  const [hover, setHover] = useState<ItemId | null>(null);
  return <ol className="s07-items">
    {ITEM_IDS.map(id => {
      const selected = guess === id, hot = !locked && hover === id;
      const border = selected ? '2px solid var(--green)' : hot ? '1px solid var(--green)' : undefined;
      return <li key={id} className="task-card" onMouseEnter={() => setHover(id)} onMouseLeave={() => setHover(null)}
        style={{ border, padding: selected ? '11px 15px' : undefined, background: selected ? 'var(--wash)' : hot ? '#f6f8f1' : undefined, boxShadow: hot ? '0 2px 6px rgba(0,0,0,.08)' : undefined, transition: 'background .12s, box-shadow .12s' }}>
        <button type="button" aria-pressed={selected} aria-disabled={locked || undefined} onClick={() => { if (!locked) onPick(id); }}
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch', width: '100%', height: '100%', textAlign: 'left', background: 'transparent', border: 0, padding: 0, color: 'inherit', fontWeight: 400, cursor: locked ? 'default' : 'pointer' }}>
          <span style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 8px', alignItems: 'baseline', font: '600 var(--fs-body)/1.4 var(--sans)', margin: '0 0 6px' }}>
            <code style={{ fontSize: 'var(--fs-caption)', color: 'var(--muted)' }}>{id}</code> {ITEMS[id].short}{showAgree && <span className="s07-agree">{agreeText(showAgree, agree[id])}</span>}
          </span>
          <span style={{ display: 'block', font: 'var(--fs-body)/1.45 Georgia,serif' }}>{ITEMS[id].statement}</span>
          {selected && <span style={badge('var(--green)', true)}>✓ Dein Tipp: passt am schlechtesten</span>}
          {weakest === id && <span style={badge('var(--red)', false)}>schwächste Trennschärfe in R</span>}
        </button>
      </li>;
    })}
  </ol>;
}
