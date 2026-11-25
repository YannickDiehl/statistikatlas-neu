// Kapitel 9, Bausteine in Aufgaben und eigene Antwortprüfung.
// PRUEFEN: die Prüfung des Kapitels (feedbackFor aus src/chapter/s09/check.tsx) mit Sonderfällen je falscher Zahl (special)
// und je falscher Option (wrong). Die Engine nutzt sie für alle Fragen dieser Seite.
// LinksRechts: das Bild zu Aufgabe 4 (Mittelwerte gegen Gerade). Es zeigt die Antworten und erscheint darum erst,
// wenn eine Antwort zu Aufgabe 4 geprüft ist (beim Laden: gespeicherter Stand; danach: Ereignis der Engine), oder auf Knopfdruck.
import { useEffect, useState } from 'react';
import type { Baustein } from '../../react/typen';
import { feedbackFor } from '@atlas/chapter/s09/check';
import type { S9Question } from '@atlas/chapter/s09/content';
import { LeftRight } from '@atlas/chapter/s09/figures/LeftRight';

export function PRUEFEN(q: S9Question, input: string | undefined) {
  return feedbackFor(q, input);
}

const A4_IDS = ['a4a', 'a4b', 'a4c', 'a4d', 'a4e'];
/** Hat die Engine schon eine Antwort zu Aufgabe 4 gespeichert? (Stand der Seite: k09-fokus-v1, Feld antwort) */
function a4Geprueft(): boolean {
  try {
    const s = JSON.parse(localStorage.getItem('k09-fokus-v1') || '{}') as { antwort?: Record<string, string> };
    return A4_IDS.some(id => (s.antwort?.[id] ?? '').trim() !== '');
  } catch { return false; }
}

function LinksRechts({ fertig }: { fertig: () => void }) {
  const [zeigen, setZeigen] = useState(a4Geprueft);
  useEffect(() => {
    if (zeigen) { fertig(); return; }
    // Die Engine meldet jedes Prüfen mit „lernpfad:antworten“ (detail: { schritt, antworten }).
    const pruefen = (e: Event) => {
      const a = (e as CustomEvent<{ schritt: string; antworten: Record<string, string> }>).detail?.antworten ?? {};
      if (A4_IDS.some(id => (a[id] ?? '').trim() !== '')) setZeigen(true);
    };
    document.addEventListener('lernpfad:antworten', pruefen);
    return () => document.removeEventListener('lernpfad:antworten', pruefen);
  }, [zeigen, fertig]);
  if (zeigen) return <LeftRight />;
  return <div className="reihe-knoepfe">
    <button type="button" className="knopf hell" onClick={() => setZeigen(true)}>Bild zeigen</button>
    <span className="hilfe-zeile">Das Bild erscheint auch, sobald du deine Antworten in Schritt 5 prüfst.</span>
  </div>;
}

export const BAUSTEINE: Record<string, Baustein> = { LinksRechts };
