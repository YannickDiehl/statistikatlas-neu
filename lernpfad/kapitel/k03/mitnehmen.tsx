// Kapitel 3, Reiter „Mitnehmen“: das Wichtigste (wörtlich aus Session3.tsx) mit Verweisen in Verstehen,
// Karten zum Nachlesen je Selbsttest-Frage. Selbsttest, Skript und Dateiname kommen aus content.ts.
import type { ReactNode } from 'react';
import type { MitnehmenDaten } from '../../react/typen';

const WICHTIG: [ReactNode, string, string][] = [
  [<>Eine Häufigkeitstabelle zeigt für jeden Wert, wie viele (N) und welcher Anteil (Prozent). Cum. % zählt die Valid % von oben nach unten zusammen.</>, 'k1-spalten', 'Die Spalten von frequency()'],
  [<>Jede Prozentzahl hat eine Basis. Raw % teilt durch alle Befragten, Valid % durch die gültigen Antworten. Eine eigene Basis rechnest du mit R als Taschenrechner.</>, 'k2-basis', 'Prozent wovon?'],
  [<>Fehlende Werte tragen im ALLBUS einen Code mit Grund: nie gefragt (Split, Filter), nicht beantwortet (keine Angabe, weiß nicht, verweigert) oder beim Erfassen verloren. Fehlend heißt nicht verweigert.</>, 'k2-gruende', 'Warum eine Antwort fehlt'],
  [<>Modus: häufigster Wert. Median: Wert der Person in der Mitte, in der Tabelle die erste Zeile mit Cum. % ab 50. Mittelwert: Summe geteilt durch Anzahl.</>, 'k1-mitte', 'Modus und Median'],
  [<>Welche Mitte passt, sagt das Skalenniveau: nominal Modus, ordinal Median, metrisch Mittelwert und Median.</>, 'k3-skala', 'Welche Mitte passt?'],
  [<>Der Mittelwert folgt wenigen extremen Werten, der Median bleibt in der Mitte. Liegen sie weit auseinander, gehören beide in den Bericht.</>, 'k3-schief', 'Mittelwert und Median vergleichen'],
  [<>In R: <code>allbus %&gt;% frequency(x)</code> zählt aus, <code>allbus %&gt;% describe(x)</code> fasst zusammen. R schreibt Kommazahlen mit Punkt.</>, 'r2', 'Drei Werkzeuge für heute'],
];

const SELBST_KARTE: [string, string][] = [
  ['k2-basis', 'Prozent wovon?'],
  ['k1-spalten', 'Die Spalten von frequency()'],
  ['k2-satz', 'Ein ehrlicher Satz nennt die Basis'],
  ['k3-skala', 'Welche Mitte passt?'],
  ['k3-reihe', 'Die Mitte einer Reihe'],
];

export const MITNEHMEN: MitnehmenDaten = { wichtig: WICHTIG, selbstKarte: SELBST_KARTE, workshop: 'Kapitel 7.4' };
