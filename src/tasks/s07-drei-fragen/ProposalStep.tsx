import type { ReactNode } from 'react';
import { Feedback, type Note } from '../kit/Feedback';
import { HintLadder } from '../kit/HintLadder';
import { hints, ITEM_IDS, ITEMS, R_SETUP, type ItemId } from './content';
import {
  ALPHA_NOT_FOUND, alphaVariants, checkNumber, keptOf, keyOf, labelOf, R_NOT_FOUND, rProposal, rVariants, scaffoldProposal, type Prepared, type Proposal,
} from './domain';
import { TextAnswer } from '../kit/TextAnswer';

/** Sieben Items, vier davon streichen: Knöpfe mit aria-pressed = gestrichen. */
export function ItemPicker({ struck, onToggle, label }: { struck: ItemId[]; onToggle: (id: ItemId) => void; label: string }) {
  return <div className="s07-picker" role="group" aria-label={label}>
    {ITEM_IDS.map(id => {
      const on = struck.includes(id);
      // Sind vier gestrichen, sind die drei übrigen gesperrt – sie sollen aber als „bleibt“ hervortreten, nicht verblassen.
      const kept = !on && struck.length >= 4;
      return <button key={id} aria-pressed={on} disabled={kept} onClick={() => onToggle(id)}
        style={kept ? { opacity: 1, color: 'var(--ink)', background: 'var(--wash)', border: '2px solid var(--green)', fontWeight: 600, cursor: 'default' } : undefined}>
        <code>{id}</code> {ITEMS[id].short}{kept && <span style={{ marginLeft: 6, font: '600 var(--fs-small)/1.3 var(--sans)', color: 'var(--green)' }}>✓ bleibt</span>}
      </button>;
    })}
  </div>;
}

/** Ein Vorschlag: vier Items streichen, begründen, α und Stellvertreter-Wert eintragen. Die Führung (StepGuide) kommt als children. */
export function ProposalStep({ which, heading, children, proposal, p, onToggle, onPatch, onConcept, extra = [] }: {
  which: 'a' | 'b';
  heading: string;
  children: ReactNode;
  proposal: Proposal;
  p: Prepared;
  onToggle: (id: ItemId) => void;
  onPatch: (patch: Partial<Proposal>) => void;
  onConcept: (id: string) => void;
  extra?: Note[];
}) {
  const kept = keptOf(proposal.struck);
  const t = kept ? p.byKey[keyOf(kept)] : null;
  const notes = t ? [
    ...checkNumber(alphaVariants(p, t), proposal.alpha, ALPHA_NOT_FOUND),
    ...checkNumber(rVariants(p, t), proposal.r, R_NOT_FOUND),
  ] : [];
  return <section className="task-step">
    <h3>{heading}</h3>
    {children}
    <p className="task-prompt">Welche vier Items streichst du? Klick ein Item an, um es zu streichen; ein zweiter Klick nimmt es zurück. Die drei übrigen bleiben.</p>
    <ItemPicker struck={proposal.struck} onToggle={onToggle} label={`${heading}: vier Items streichen`} />
    <p className="sandbox-note" aria-live="polite">{kept ? `Gestrichen: ${labelOf(proposal.struck)}. Es bleiben: ${labelOf(kept)}.` : `Noch ${4 - proposal.struck.length} ${4 - proposal.struck.length === 1 ? 'Item' : 'Items'} streichen.`}</p>
    <Feedback notes={extra} />
    <TextAnswer id={`s07-why-${which}`} maxLength={400} label="Warum behältst du genau diese drei Items?" help="Ein Satz – nach Inhalt, noch ohne Zahlen"
      example="Ich behalte …, … und …, weil sie zusammen …" value={proposal.why} onChange={why => onPatch({ why })} />
    {kept && t && <>
      <p className="sandbox-note">Jetzt rechnest du in R. Trag beide Werte so ein, wie R sie zeigt – drei Nachkommastellen.</p>
      <div className="task-grid">
        <label>Wie stimmig messen deine drei Items dasselbe?<small className="task-field-help">Die Stimmigkeit: Cronbachs α aus reliability() mit genau deinen drei Items</small><input type="text" inputMode="decimal" maxLength={12} value={proposal.alpha} onChange={e => onPatch({ alpha: e.target.value })} /></label>
        <label>Wie gut sagen deine drei Items die vier gestrichenen voraus?<small className="task-field-help">Der Stellvertreter-Wert: r aus pearson_cor() zwischen Kurzwert (Mittelwert deiner drei Items) und Restwert (Mittelwert der vier gestrichenen)</small><input type="text" inputMode="decimal" maxLength={12} value={proposal.r} onChange={e => onPatch({ r: e.target.value })} /></label>
      </div>
      <Feedback notes={notes} />
      <HintLadder key={t.key} hint={{ ...hints.proposal, scaffold: scaffoldProposal(which), solution: `${R_SETUP}\n\n${rProposal(kept, which)}` }} onConcept={onConcept} file={`drei-fragen-${which}.R`} />
    </>}
  </section>;
}
