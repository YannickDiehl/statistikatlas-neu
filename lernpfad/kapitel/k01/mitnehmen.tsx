// Kapitel 1, Reiter „Mitnehmen“: das Wichtigste (wörtlich aus Session1.tsx) mit Verweisen in Verstehen, Karten zum Nachlesen je Selbsttest-Frage.
import type { ReactNode } from 'react';
import type { MitnehmenDaten } from '../../react/typen';

const WICHTIG: [ReactNode, string, string][] = [
  [<><b>R</b> rechnet, <b>RStudio</b> ist das Programm drumherum: Im Skript hebst du Code auf, in der Konsole antwortet R, im Environment siehst du deine Objekte.</>, 'k1-fenster', 'Vier Fenster'],
  [<>Ein <b>Projekt</b> hält alles in einem Ordner. Liegt die Datei dort, genügt <code>read_spss("ZA8831_v1-3-0.sav")</code>; sonst hilft <code>file.choose()</code>.</>, 'k1-projekt', 'Ein Projekt'],
  [<>Pakete <b>einmal installieren</b>, in jeder Sitzung <b>laden</b>: Der Startblock lädt erst tidyverse, dann mariposa, und liest die Datei ein.</>, 'k1-pakete', 'Pakete'],
  [<>Eine Zeile lesen: <b>Objekt</b> <code>&lt;-</code> <b>Funktion</b>(<b>Argumente</b>). Text steht in Anführungszeichen, Namen von Objekten und Variablen nicht.</>, 'r1', 'Eine Zeile R lesen'],
  [<><code>find_var()</code> sucht in Variablennamen und Variablenlabels. Kein Treffer heißt nicht „gibt es nicht“ (ae, oe, ue, Wortanfang, anderes Wort), ein Treffer heißt nicht „passt“ (Label lesen).</>, 'k2-anders', 'Kein Treffer? Anders suchen'],
  [<>Codebuch und <code>frequency()</code> zeigen <b>Codes</b>, <b>Wertelabels</b> und <b>fehlende Werte</b>. Negative Codes sind fehlend; <b>TNZ</b> heißt: Die Frage wurde gar nicht gestellt.</>, 'k3-codes', 'Codes und Wertelabels'],
  [<><b>Gültige Antworten</b> = alle Befragten minus alle fehlenden Werte. Für deine Aussagen zählen nur sie.</>, 'k3-fehlend', 'Fehlende Werte'],
  [<>Eine <b>Fehlermeldung</b> ist eine Auskunft: Lies, wo und was, und schau auf den Namen in Anführungszeichen.</>, 'k4-lesen', 'Eine Fehlermeldung lesen'],
];

const SELBST_KARTE: [string, string][] = [
  ['r1', 'Eine Zeile R lesen'],
  ['k2-anders', 'Kein Treffer? Anders suchen'],
  ['k3-fehlend', 'Fehlende Werte'],
  ['k2-passt', 'Ein Treffer ist ein Kandidat'],
  ['k1-pakete', 'Pakete und Startblock'],
];

export const MITNEHMEN: MitnehmenDaten = { wichtig: WICHTIG, selbstKarte: SELBST_KARTE, workshop: 'Kapitel 1 und Abschnitt 4.4' };
