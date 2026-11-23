import { useState, type KeyboardEvent } from 'react';

/** 100 Eingeladene als 10×10 Briefumschläge. Gefüllt = sagt Ja. Ohne onPick nur zum Ansehen. */
const COLS = 10, CW = 30, CH = 24;
const YES = { fill: '#59a14f', stroke: '#3b7d33', flap: '#fff' };
const NO = { fill: '#fff', stroke: '#9aa093', flap: '#9aa093' };
const PREVIEW = { fill: '#cfe8c9', stroke: '#3b7d33', flap: '#3b7d33' };

function Envelope({ i, look }: { i: number; look: typeof YES }) {
  const x = (i % COLS) * CW + 3, y = Math.floor(i / COLS) * CH + 3;
  return <g>
    <rect x={x} y={y} width={CW - 6} height={CH - 7} rx={2} style={{ fill: look.fill, stroke: look.stroke }} strokeWidth={1.2} />
    <polyline points={`${x},${y} ${x + (CW - 6) / 2},${y + (CH - 7) * 0.55} ${x + CW - 6},${y}`} fill="none" style={{ stroke: look.flap }} strokeWidth={1.2} />
  </g>;
}

export function InviteGrid({ count, onPick, locked = false, label }: { count: number | null; onPick?: (n: number) => void; locked?: boolean; label: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const active = Boolean(onPick) && !locked;
  const n = count ?? 0;
  const pick = (k: number) => { if (active && onPick) onPick(Math.max(0, Math.min(100, k))); };
  // Klick auf den letzten gefüllten Umschlag nimmt ihn zurück – so ist auch 0 erreichbar.
  const click = (i: number) => pick(i + 1 === n ? i : i + 1);
  const key = (e: KeyboardEvent) => {
    const step: Record<string, number> = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1, PageUp: 10, PageDown: -10 };
    if (e.key in step) pick(n + step[e.key]);
    else if (e.key === 'Home') pick(0);
    else if (e.key === 'End') pick(100);
    else return;
    e.preventDefault();
  };
  const shownHover = active ? hover : null;
  const look = (i: number) => (shownHover !== null ? (i < shownHover ? (i < n ? YES : PREVIEW) : NO) : i < n ? YES : NO);
  const valueText = count === null ? 'noch nichts markiert' : `${n} von 100 sagen Ja`;
  return <svg viewBox={`0 0 ${COLS * CW} ${10 * CH}`} width="100%" style={{ maxWidth: 330, display: 'block', cursor: active ? 'pointer' : 'default', outlineOffset: 3 }}
    {...(active
      ? { role: 'slider', tabIndex: 0, 'aria-label': label, 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': n, 'aria-valuetext': valueText, onKeyDown: key }
      : { role: 'img', 'aria-label': `${label}: ${valueText}` })}
    onMouseLeave={() => setHover(null)}>
    {Array.from({ length: 100 }, (_, i) => <g key={i} onMouseEnter={() => setHover(i + 1)} onClick={() => click(i)}>
      <rect x={(i % COLS) * CW} y={Math.floor(i / COLS) * CH} width={CW} height={CH} fill="transparent" />
      <Envelope i={i} look={look(i)} />
    </g>)}
  </svg>;
}

/** Kleine Legende unter den Umschlägen. */
export function InviteLegend() {
  const swatch = (look: typeof YES) => <svg viewBox="0 0 30 24" width={22} height={18} aria-hidden="true" style={{ verticalAlign: -3, marginRight: 4 }}><Envelope i={0} look={look} /></svg>;
  return <p className="sandbox-note" style={{ display: 'flex', gap: 16, flexWrap: 'wrap', margin: '4px 0' }}>
    <span>{swatch(YES)}sagt Ja</span><span>{swatch(NO)}sagt Nein</span>
  </p>;
}
