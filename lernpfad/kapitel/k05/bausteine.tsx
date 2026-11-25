// Kapitel 5: Bilder in den Aufgaben und die Antwortprüfung des Kapitels (check.ts).
import { useEffect, useState, type ReactNode } from 'react';
import type { Baustein } from '../../react/typen';
import { Begriff } from '@lernpfad/Begriff';
import '@atlas/chapter/s05/s05.css';
import { judge5, wrongText } from '@atlas/chapter/s05/check';
import { A2_REVEAL, QUESTIONS, type Q5 } from '@atlas/chapter/s05/content';
import { DenominatorFigure } from '@atlas/chapter/s05/figures/Bars5';
import { MutateA1Figure, UmpolenPe05Figure } from '@atlas/chapter/s05/figures/Towers';

/**
 * Antwortprüfung wie in Questions5 des Atlas: ganze Zahlen zählen bei Prozentfragen innerhalb ±0,55,
 * „2,630“ wird als Tausender gelesen, und typische falsche Werte bekommen ihre eigene Rückmeldung (`wrong`).
 */
export function PRUEFEN(q: Q5, input: string | undefined): { result: 'open' | 'right' | 'wrong'; text: string } {
  const result = judge5(q, input);
  if (result === 'right') return { result, text: q.right };
  if (result === 'wrong') return { result, text: wrongText(q, input ?? '') };
  return { result, text: '' };
}

/* ---------- Bilder, die Antworten zeigen: erst nach richtigen Antworten ---------- */

/** Gespeicherte Antworten der Seite (die Engine legt sie unter k05-fokus-v1 ab). */
function antworten(): Record<string, string> {
  try { return JSON.parse(localStorage.getItem('k05-fokus-v1') || '{}').antwort || {}; } catch { return {}; }
}

/** Zeigt `bild`, sobald alle `fragen` richtig sind, und meldet den Schritt dann als erledigt. */
function Aufdecken({ fragen, schritt, welche, bild, fertig }: { fragen: Q5[]; schritt: number; welche: string; bild: ReactNode; fertig: () => void }) {
  const [a, setA] = useState(antworten);
  // Die Engine speichert beim Prüfen (Formular absenden); danach neu lesen.
  useEffect(() => {
    const neu = () => setTimeout(() => setA(antworten()));
    document.addEventListener('submit', neu);
    return () => document.removeEventListener('submit', neu);
  }, []);
  const offen = fragen.some(q => judge5(q, a[q.id]) !== 'right');
  useEffect(() => { if (!offen) fertig(); }, [offen]); // eslint-disable-line react-hooks/exhaustive-deps
  if (offen) return <p className="s-text">{`Das Bild erscheint hier, sobald in Schritt ${schritt} ${welche} richtig sind. Es zeigt Antworten.`}</p>;
  return <>{bild}</>;
}

export const BAUSTEINE: Record<string, Baustein> = {
  MutateA1: ({ fertig }) => <Aufdecken fertig={fertig} fragen={QUESTIONS.a1} schritt={5} welche="alle Fragen" bild={<MutateA1Figure caption={<><code>mutate()</code> stellt neue <Begriff id="variable">Variablen</Begriff> neben die alten (im Bild: Türme), in Schritt 3 <code>misstrauen</code>, in Schritt 4 <code>nichtwahl</code>. Bei <code>nichtwahl</code> wird aus 91 eine 1 und aus jeder Partei eine 0. Wer nicht wahlberechtigt ist (Code −50), steht in keiner Regel und wird mit <code>else=NA</code> leer. Wer im Split die Frage nicht bekam, bleibt auch bei <code>misstrauen</code> leer. Wie die übrigen <Begriff id="wert">Werte</Begriff> von <code>misstrauen</code> aussehen (im Bild: Steine), entscheidet deine Regel. <span>Die Werte sind ein Beispiel mit fünf Befragten.</span></>} />} />,
  UmpolenPe05: ({ fertig }) => <Aufdecken fertig={fertig} fragen={QUESTIONS.a4} schritt={5} welche="alle Fragen" bild={<UmpolenPe05Figure caption={<><Begriff id="umpolen">Umpolen</Begriff> dreht die Codes, die Wertelabels wandern mit. Danach heißt eine kleine Zahl bei pe05 dasselbe wie bei pe01: Misstrauen. Fehlende Werte bleiben leer. <span>Die Werte sind ein Beispiel mit fünf Befragten.</span></>} />} />,
  Nenner: ({ fertig }) => <Aufdecken fertig={fertig} fragen={QUESTIONS.a2.filter(q => A2_REVEAL.includes(q.id))} schritt={4} welche="die Fragen zur Einstellung, zur Anzahl in der Zelle, zu den Nichtwählenden in der Tabelle und (1) bis (3)"
    bild={<DenominatorFigure caption={<>Das orange Stück ist immer gleich: 127 Menschen, die misstrauen und nicht wählen würden. Wie groß es wirkt, hängt am Balken, in den du es legst. <span>ALLBUS 2023, n = 2.785, ungewichtet.</span></>} />} />,
};
