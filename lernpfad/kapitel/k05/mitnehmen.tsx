// Kapitel 5, Reiter „Mitnehmen“: das Wichtigste (wörtlich aus Session5.tsx) mit Verweisen in Verstehen, Karten zum Nachlesen je Selbsttest-Frage.
import type { ReactNode } from 'react';
import { Begriff } from '@lernpfad/Begriff';
import type { MitnehmenDaten } from '../../react/typen';

const WICHTIG: [ReactNode, string, string][] = [
  [<><b><Begriff id="rekodieren">Umkodieren</Begriff></b> fasst Antworten nach festen Regeln zu wenigen Kategorien zusammen. Wer in keine Kategorie gehört, wird ein <b>fehlender Wert (NA)</b>, nicht 0. Jede Umkodierung ist eine Entscheidung, die du nennst.</>, 'k1-zuschnitt', 'Kategorien zusammenfassen'],
  [<>Eine <b><Begriff id="dummy">Dummyvariable</Begriff></b> hat nur 0 und 1; ihr Mittelwert ist der Anteil der Einsen.</>, 'k1-regel', 'Eine Regel lesen: misstrauen'],
  [<>Eine <b><Begriff id="kreuztabelle">Kreuztabelle</Begriff></b> zählt die Kombinationen zweier Variablen. Jede Prozentzahl darin hat eine <b>Basis</b>: <b><Begriff id="zeilenprozente">Zeilenprozente</Begriff></b> (jede Zeile 100 %), <b><Begriff id="spaltenprozente">Spaltenprozente</Begriff></b> (jede Spalte 100 %), <b><Begriff id="gesamtprozente">Gesamtprozente</Begriff></b> (alle 100 %).</>, 'k2-drei', 'Drei Fragen an eine Zelle'],
  [<>Dieselbe Zelle beantwortet je nach Basis eine andere Frage: 87,0 % der Nichtwählenden misstrauen, aber nur 6,5 % der Misstrauenden würden nicht wählen.</>, 'k2-all', 'Eine Zelle, drei Prozentbasen'],
  [<><b>Leserichtung:</b> Jede Gruppe der <Begriff id="unabhaengige-variable">UV</Begriff> ist 100 %, dann vergleichst du zwischen den Gruppen. Den Abstand nennst du in <b><Begriff id="prozentpunkte">Prozentpunkten</Begriff></b>.</>, 'k3-vergleich', 'Prozentuieren und vergleichen'],
  [<><b><Begriff id="umpolen">Umpolen</Begriff></b> dreht eine Skala um, damit eine höhere Zahl bei allen Fragen dasselbe heißt.</>, 'k4-umpolen', 'Umpolen'],
  [<>Eine Kreuztabelle zeigt einen <Begriff id="zusammenhang">Zusammenhang</Begriff>, keine <Begriff id="kausalitaet">Ursache</Begriff>. Nenne n, wer fehlt und dass ungewichtet gerechnet wurde.</>, 'k3-deuten', 'Vergleichen und deuten'],
  [<>In R: <code>allbus %&gt;% mutate(neu = rec(alt, rules = "…")) %&gt;% frequency(neu)</code> baut eine neue Variable und prüft sie, <code>crosstab(zeilen, spalten, percentages = "row")</code> zeigt die Tabelle, <code>rules = "rev"</code> polt um. In RStudio legst du neue Variablen mit <code>allbus &lt;- allbus %&gt;% mutate(…)</code> einmal ab.</>, 'k2-neu', 'Warum jede Vorlage neu umkodiert'],
];

const SELBST_KARTE: [string, string][] = [
  ['k2-drei', 'Drei Fragen an eine Zelle'],
  ['k1-nichtwahl', 'Wer in keiner Regel steht'],
  ['k3-vergleich', 'Prozentuieren und vergleichen'],
  ['k3-deuten', 'Vergleichen und deuten'],
  ['k4-richtung', 'Zwei Aussagen, zwei Richtungen'],
  ['k2-ergebnis', 'Wer in der Tabelle steht'],
];

export const MITNEHMEN: MitnehmenDaten = { wichtig: WICHTIG, selbstKarte: SELBST_KARTE, workshop: 'Kapitel 5 und 7' };
