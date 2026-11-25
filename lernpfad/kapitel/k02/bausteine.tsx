// Kapitel 2, React-Bausteine in den Aufgaben: die festen Bilder aus src/chapter/s02, die im Atlas in den Aufgaben standen.
// Sie zeigen nur (keine Übung) und haben ihre Textfassung im Bild (role="img").
import type { Baustein } from '../../react/typen';
import { BogenA2, OutputRead, Split } from '@atlas/chapter/s02/figures/Pictures';

export const BAUSTEINE: Record<string, Baustein> = {
  /** Aufgabe 1, Schritt 2: Aufbau der Ausgabe von allbus. */
  Ausgabe: () => <OutputRead caption={<>So ist die Ausgabe aufgebaut. Die Zellen der Reihen sind hier durch „…“ ersetzt. <span>Bei einem breiteren Fenster zeigt R mehr Türme und weniger „more variables“.</span></>} />,
  /** Aufgabe 2, Schritt 2: der ausgedachte Bogen. */
  Bogen: () => <BogenA2 caption={<>Ein ausgedachter Bogen mit vier Fragen. <span>Unter dem Bogen stehen die Namen der Variablen im ALLBUS.</span></>} />,
  /** Aufgabe 3, Schritt 4: zwei Fragebogenversionen. */
  Versionen: () => <Split caption={<>Zwei Fragebogenversionen, zwei Reihen: Jede Version lässt eine der beiden Fragen weg. <span>Die Bögen und Steine sind ein Beispiel.</span></>} />,
};
