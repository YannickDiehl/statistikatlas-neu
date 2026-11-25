// Kapitel 6, Reiter „Mitnehmen“: das Wichtigste (wörtlich aus Session6.tsx) mit Verweisen in Verstehen, Karten zum Nachlesen je Selbsttest-Frage.
import type { ReactNode } from 'react';
import type { MitnehmenDaten } from '../../react/typen';

const WICHTIG: [ReactNode, string, string][] = [
  [<>Der ALLBUS befragt den Osten absichtlich stärker (32 statt 17 von 100). Für Aussagen über ganz Deutschland rechnest du gewichtet mit <code>weights = wghtpew</code>; das Gewicht ist Anteil in Deutschland geteilt durch Anteil in der Stichprobe.</>, 'k1-gewicht', 'Wie groß ist ein Gewicht?'],
  [<>Gewichtung verschiebt Gesamtzahlen, wenn sich West und Ost unterscheiden (Zufriedene: 70,7 % ohne, 73,6 % mit Gewicht); innerhalb eines Landesteils ändert sie fast nichts.</>, 'k1-mischung', 'Das Mischpult'],
  [<>Zusammenhang heißt: Die Verteilung des einen Merkmals ist in den Gruppen des anderen verschieden. <b>χ²</b> misst den Abstand von „kein Zusammenhang“, <b>Phi</b> und <b>Cramér-V</b> machen daraus eine Zahl von 0 bis 1 (zeigt <code>phi()</code> ein Minus, zählt für die Stärke der Betrag).</>, 'k2-chi', 'Von χ² zu Cramér-V'],
  [<>Haben beide Merkmale eine Reihenfolge, vergleichen <b>Gamma</b> und <b>Tau-b</b> Paare: gleichläufig gegen gegenläufig. Gamma lässt Gleichstände weg und fällt größer aus.</>, 'k3-paare', 'Gleichläufig oder gegenläufig?'],
  [<>Der <b>Betrag</b> zeigt die Stärke (Faustregel: ab 0,1 schwach, ab 0,3 mittel, ab 0,5 stark), das <b>Vorzeichen</b> die Richtung; was „höher“ heißt, steht im Codebuch.</>, 'k3-richtung', 'Richtung und Vorzeichen'],
  [<><b>Pearson-r</b> misst geradlinige Zusammenhänge metrischer Variablen und ist empfindlich für Ausreißer; <b>Spearman-ρ</b> nutzt Rangplätze.</>, 'k4-ausreisser', 'Pearson oder Spearman?'],
  [<>Ein Zusammenhang ist keine Ursache: Eine <b>Drittvariable</b> kann beide Merkmale beeinflussen. Prüfen kannst du das innerhalb ihrer Gruppen.</>, 'k4-dritt', 'Die Drittvariable'],
  [<>In R: Datensatz vorn, dann das Maß mit zwei Variablen: <code>allbus %&gt;% kendall_tau(x, y, weights = wghtpew)</code>.</>, 'r2', 'Ein Zusammenhangsmaß in R'],
];

const SELBST_KARTE: [string, string][] = [
  ['k1-ost', 'Der Osten ist stärker vertreten'],
  ['k1-landesteil', 'Ein Landesteil'],
  ['k5-baum', 'Das niedrigere Skalenniveau entscheidet'],
  ['k3-richtung', 'Richtung und Vorzeichen'],
  ['k4-ausreisser', 'Pearson oder Spearman?'],
];

export const MITNEHMEN: MitnehmenDaten = { wichtig: WICHTIG, selbstKarte: SELBST_KARTE, workshop: 'Kapitel 7' };
