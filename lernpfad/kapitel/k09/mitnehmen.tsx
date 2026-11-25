// Kapitel 9, Reiter „Mitnehmen“: das Wichtigste (wörtlich aus Session9.tsx) mit Verweisen in Verstehen, Karten zum Nachlesen je Selbsttest-Frage.
// Selbsttest, Skript und Dateiname kommen im üblichen Format aus content.ts (SELF_TEST, SCRIPT, SCRIPT_FILE).
import type { ReactNode } from 'react';
import type { MitnehmenDaten } from '../../react/typen';

const WICHTIG: [ReactNode, string, string][] = [
  [<>Eine <b>lineare Regression</b> legt die Gerade durch eine Punktwolke, bei der die Summe der quadrierten Residuen am kleinsten ist (kleinste Quadrate).</>, 'k2-quadrate', 'Kleinste Quadrate'],
  [<>Vorhersage = Konstante + Steigung × Wert der UV. Die <b>Steigung B</b> sagt, um wie viel die Vorhersage pro Einheit der UV steigt, in der Einheit der AV. Die <b>Konstante</b> ist die Höhe bei UV = 0.</>, 'k1-formel', 'Die Formel als Bausteine'],
  [<>Ein <b>Residuum</b> ist beobachtet minus vorhergesagt: wie weit eine Person über oder unter der Geraden liegt.</>, 'k2-residuen', 'Residuen'],
  [<><b>R²</b> sagt, um welchen Anteil die Fehlerquadrate mit der Geraden kleiner sind als mit dem Mittelwert. Mit einer UV ist R² = r². Steil heißt nicht gut: Steigung und R² getrennt lesen.</>, 'k2-r2', 'R²'],
  [<>Voraussetzungen: ein gerader Zusammenhang (<b>Linearität</b>), keine einzelnen Punkte, die die Gerade ziehen (<b>Ausreißer</b>), gleich große Streuung der Residuen für alle (<b>gleiche Fehlervarianz</b>; Levene-Test für „gibt es einen Unterschied?“, Faustregel „mehr als doppelt“ für „ist er groß?“).</>, 'k5-voraussetzungen', 'Voraussetzungen'],
  [<>Eine Regression beschreibt einen Zusammenhang, keine Ursache.</>, 'k5-ursache', 'Zusammenhang, nicht Ursache'],
  [<>In R: <code>allbus %&gt;% linear_regression(y ~ x, weights = wghtpew) %&gt;% summary()</code>; <code>group_by()</code> rechnet danach für jede Gruppe getrennt; <code>levene_test(residuum, group = x, weights = wghtpew)</code> prüft gleiche Streuung.</>, 'r2', 'Eine Formel mit Tilde'],
];

const SELBST_KARTE: [string, string][] = [
  ['k1-deuten', 'Die Steigung in Worten'],
  ['k2-residuen', 'Residuen'],
  ['k2-vergleich', 'Steil heißt nicht gut'],
  ['k3-fehlervarianz', 'Gleiche Fehlervarianz'],
  ['k4-kurve', 'Eine flache Gerade'],
];

export const MITNEHMEN: MitnehmenDaten = { wichtig: WICHTIG, selbstKarte: SELBST_KARTE, workshop: 'Kapitel 9 (9.2 Einfache lineare Regression, 9.6 Residuen-Diagnostik)' };
