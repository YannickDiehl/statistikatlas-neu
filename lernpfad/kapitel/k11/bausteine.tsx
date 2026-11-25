// Kapitel 11: Bausteine in den Aufgaben (Tabelle „umgepolt“ mit Decken-Bild, Bild Person A und B nach den Fragen)
// und die Antwortprüfung mit den Sonderfällen aus content.ts (SPECIAL), wie im Atlas (SpecialQuestions).
import { useEffect, useState } from 'react';
import type { Baustein } from '../../react/typen';
import { judgeWithFeedback, type Question } from '@atlas/chapter/answers';
import { CROSSTAB, QUESTIONS, withSpecialHint } from '@atlas/chapter/s11/content';
import { Ceiling } from '@atlas/chapter/s11/figures/Topic1';
import { PersonAB } from '@atlas/chapter/s11/figures/Topic3';
import '@atlas/chapter/s11/s11.css';
import { Begriff } from '@lernpfad/Begriff';

/**
 * Prüfung aller Fragen der Seite: wie der Atlas, dazu die Sonderfälle aus SPECIAL (eine typische falsche Zahl mit Spielraum
 * oder eine Option). Bei Auswahlfragen ersetzt der Sonderfall den allgemeinen Hinweis, bei Zahlen steht er davor.
 */
export function PRUEFEN(q: Question, input: string | undefined): { result: 'open' | 'right' | 'wrong'; text: string } {
  const r = judgeWithFeedback(q, input);
  if (r.result !== 'wrong') return { ...r, text: neuerVerweis(r.text) };
  return { result: 'wrong', text: neuerVerweis(withSpecialHint(q, input).hint) };
}

/** Verweise der Rückmeldungen („Grundlage 2b“) auf die Karten in „Verstehen“, wie in kapitel.js. */
const KARTE: Record<string, string> = { '1b': 'Warum eine Gerade scheitert', '1c': 'Drei Sprachen', '2b': 'Exp(B): ein Faktor für die Chance', '3b': 'Gleicher Faktor, verschiedene Prozentpunkte', '3c': 'Eine Zahl im Mittel: der AME', '4a': 'Die Trefferquote einordnen', '4c': 'Pseudo-R²' };
const neuerVerweis = (t: string) => t.replace(/Grundlage (\d[a-c])/g, (m, k: string) => KARTE[k] ? `„${KARTE[k]}“ in Verstehen` : m);

/** Aufgabe 1, Schritt 3: welche Antwort welchen Code hat (pe09 und pflicht) und das Bild „Decke“. */
/** Die Wurzel eines Bausteins trägt die Klasse .chapter (ein Raster mit Randspalte); in der Aufgabe soll sie einspaltig sein. */
const EINSPALTIG = <style>{'[data-baustein] > .baustein-wurzel{display:block}'}</style>;

function Umgepolt() {
  return <>
    {EINSPALTIG}
    <table className="daten" id="umgepolt">
      <caption>umgepolt: <code>pflicht = rec(pe09, rules = "rev")</code></caption>
      <thead><tr><th scope="col">Antwort</th><th scope="col"><code>pe09</code></th><th scope="col"><code>pflicht</code></th></tr></thead>
      <tbody>{[...CROSSTAB].reverse().map(r => <tr key={r.pflicht}><td>{r.answer}</td><td>{String(r.pe09)}</td><td>{String(r.pflicht)}</td></tr>)}</tbody>
    </table>
    <figure className="ebild">
      <Ceiling />
      <figcaption>Zu Schritt 3 und 4: Je näher ein Anteil an 100 % liegt, desto weniger kann die nächste Stufe noch bringen. <span>Die Säulen sind ein Beispiel, nicht die Zahlen deiner Kreuztabelle.</span></figcaption>
    </figure>
  </>;
}

/** Gespeicherte Antworten der Engine (localStorage, k11-fokus-v1). */
function antworten(): Record<string, string> {
  try { return JSON.parse(localStorage.getItem('k11-fokus-v1') || '{}').antwort || {}; } catch { return {}; }
}
const alleBeantwortet = () => { const a = antworten(); return QUESTIONS.a3.every(q => (a[q.id] ?? '').trim() !== ''); };

/** Aufgabe 3, Schritt 6: das Bild erscheint erst, wenn jede Frage aus Schritt 5 eine geprüfte Antwort hat. */
const PersonABNachFragen: Baustein = ({ fertig }) => {
  const [da, setDa] = useState(alleBeantwortet);
  useEffect(() => {
    const pruefen = () => setTimeout(() => setDa(alleBeantwortet()));
    document.addEventListener('submit', pruefen);
    return () => document.removeEventListener('submit', pruefen);
  }, []);
  useEffect(() => { if (da) fertig(); }, [da, fertig]);
  return <div aria-live="polite">{EINSPALTIG}{da
    ? <figure className="ebild">
      <PersonAB />
      <figcaption>Person A und Person B bekommen eine Stufe mehr Pflichtgefühl. B steht schon oben, wo kaum noch Platz ist: ein <Begriff id="deckeneffekt">Deckeneffekt</Begriff>. <span>Die Kurven sind mit den gerundeten Zahlen aus Aufgabe 2 gezeichnet, die Punkte stammen aus <code>predict()</code>.</span></figcaption>
    </figure>
    : <p className="hilfe-zeile">Noch verdeckt: Beantworte zuerst alle Fragen in Schritt 5 und drück <b>Prüfen</b>.</p>}</div>;
};

export const BAUSTEINE: Record<string, Baustein> = { Umgepolt, PersonAB: PersonABNachFragen };
