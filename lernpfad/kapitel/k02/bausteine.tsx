// Kapitel 2, React-Bausteine in den Aufgaben: die festen Bilder aus src/chapter/s02, die im Atlas in den Aufgaben standen.
// Sie zeigen nur (keine Übung) und haben ihre Textfassung im Bild (role="img").
import type { Baustein } from '../../react/typen';
import { BogenA2, OutputRead, Split } from '@atlas/chapter/s02/figures/Pictures';

export const BAUSTEINE: Record<string, Baustein> = {
  /** Aufgabe 1, Schritt 2: Aufbau der Ausgabe von allbus. */
  Ausgabe: () => <OutputRead caption={<>So ist die Ausgabe aufgebaut. Die Werte der ersten Zeilen sind hier durch „…“ ersetzt. <span>Bei einem breiteren Fenster zeigt R mehr Variablen und weniger „more variables“.</span></>} />,
  /** Aufgabe 2, Schritt 2: der ausgedachte Fragebogen. */
  Fragebogen: () => <BogenA2 caption={<>Ein ausgedachter Fragebogen mit vier Fragen. <span>Darunter stehen die Namen der Variablen im ALLBUS.</span></>} />,
  /** Aufgabe 3, Schritt 4: zwei Fragebogenversionen. */
  Versionen: () => <Split caption={<>Zwei Fragebogenversionen, zwei Fälle: Jede Version lässt eine der beiden Fragen weg. <span>Fragebögen und Werte sind ein Beispiel.</span></>} />,
};
