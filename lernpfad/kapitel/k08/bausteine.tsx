// Kapitel 8: React-Bausteine in den Aufgaben und die Antwortprüfung des Kapitels.
// AlphaWithout und BeforeAfter zeigen die Lösungen von Fragen; sie stehen darum in einem Schritt nach „Ergebnis festhalten“
// und erscheinen erst auf Knopfdruck. MinValid ist ein konstruiertes Beispiel und steht direkt im Schritt.
import { useState, type ReactNode } from 'react';
import type { Baustein } from '../../react/typen';
import { verdict } from '@atlas/chapter/s08/Checks';
import type { S8Question } from '@atlas/chapter/s08/content';
import { MinValid } from '@atlas/chapter/s08/figures/Theme1';
import { AlphaWithout } from '@atlas/chapter/s08/figures/Theme2';
import { BeforeAfter } from '@atlas/chapter/s08/figures/Theme3';
import '@atlas/chapter/s08/s08.css';

/** Die Baustein-Wurzel ist ein .chapter-Raster mit Seitenspalte; volle Breite über beide Spalten. */
const VOLL = { gridColumn: '1 / -1' } as const;

/** Ein Bild, das Lösungen zeigt: erst nach einem bewussten Klick, der den Schritt als erledigt meldet. */
function Nachher({ fertig, was, children }: { fertig: () => void; was: string; children: ReactNode }) {
  const [offen, setOffen] = useState(false);
  return <div style={VOLL}>
    <button type="button" className="knopf hell" aria-expanded={offen} onClick={() => { setOffen(o => !o); fertig(); }}>
      {offen ? `${was} verbergen` : `${was} zeigen`}
    </button>
    {offen ? <div style={{ marginTop: 10 }}>{children}</div> : null}
  </div>;
}

export const BAUSTEINE: Record<string, Baustein> = {
  MinValid: () => <div style={VOLL}><MinValid /></div>,
  AlphaOhne: ({ fertig }) => <Nachher fertig={fertig} was="Bild"><AlphaWithout /></Nachher>,
  VorherNachher: ({ fertig }) => <Nachher fertig={fertig} was="Bild"><BeforeAfter /></Nachher>,
};

/**
 * Antwortprüfung von Sitzung 8 (Checks.tsx): erst das Ziel, dann eine zweite richtige Möglichkeit (alsoRight),
 * dann die eigenen Rückmeldungen zu bekannten Fehlantworten (special), sonst der Hinweis.
 */
export function PRUEFEN(q: S8Question, input: string | undefined): { result: 'open' | 'right' | 'wrong'; text: string } {
  return verdict(q, input);
}
