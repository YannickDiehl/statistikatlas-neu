// Kapitel 11, Reiter „Mitnehmen“: das Wichtigste (nach Session11.tsx, mit Fachbegriffen) mit Verweisen in Verstehen, Karten zum Nachlesen je Selbsttest-Frage.
import type { ReactNode } from 'react';
import { Begriff } from '@lernpfad/Begriff';
import type { MitnehmenDaten } from '../../react/typen';

const WICHTIG: [ReactNode, string, string][] = [
  [<>Ist die abhängige Variable <Begriff id="dichotom">dichotom</Begriff> (0/1), ist ihr Mittelwert der Anteil der Einsen. Eine Gerade würde über 100 % und unter 0 % hinauslaufen; die <Begriff id="logistische-regression">logistische Regression</Begriff> zeichnet eine S-Kurve.</>, 'k1-gerade', 'Warum eine Gerade scheitert'],
  [<>Drei Sprachen: Wahrscheinlichkeit (0 bis 1), <Begriff id="odds">Odds</Begriff> (Chance) = p / (1 − p) („3 zu 1“), <Begriff id="logit">Logit</Begriff> = ln(Chance). Zurück: Chance = exp(Logit), p = Chance / (1 + Chance).</>, 'k1-sprachen', 'Drei Sprachen'],
  [<>Das Modell rechnet in Logits: Logit = Konstante + B × Wert. B &gt; 0 heißt: die Chance steigt.</>, 'k2-logit', 'Gerade im Logit'],
  [<>Exp(B), die <Begriff id="odds-ratio">Odds Ratio</Begriff>, vervielfacht die Chance, nicht die Wahrscheinlichkeit. Exp(B) = 3,77: je Einheit wird die Chance 3,77-mal so groß; (Exp(B) − 1) × 100 ist die Veränderung in Prozent.</>, 'k2-faktor', 'Exp(B): ein Faktor'],
  [<>In Prozentpunkten hängt ein Effekt vom Ausgangspunkt ab: in der Mitte der S-Kurve groß, nahe 0 oder 100 % klein. <code>predict(…, type = "response")</code> gibt <Begriff id="vorhergesagte-wahrscheinlichkeit">vorhergesagte Wahrscheinlichkeiten</Begriff> für Beispielpersonen, der <Begriff id="marginale-effekte">AME</Begriff> einen Mittelwert in Prozentpunkten.</>, 'k3-zwei-schritte', 'Gleicher Faktor, verschiedene Prozentpunkte'],
  [<>Güte: Trefferquote immer mit der <Begriff id="basisrate">Basisrate</Begriff> vergleichen, der Regel „alle bekommen die häufige Antwort“. −2LL vergleichst du mit dem <Begriff id="nullmodell">Nullmodell</Begriff> (Omnibus-Test). <Begriff id="pseudo-r2">Nagelkerke R²</Begriff> ist kein Anteil erklärter Varianz.</>, 'k4-treffer', 'Trefferquote'],
  [<>In R: <code>logistic_regression(y ~ x1 + x2, weights = wghtpew)</code>, dann <code>summary()</code>, <code>predict()</code>, <code>marginal_effects()</code>. Jede Vorlage bildet ihre Variablen mit <code>rec()</code> in <code>mutate()</code> selbst.</>, 'k2-modell', 'Das Modell in R'],
];

const SELBST_KARTE: [string, string][] = [
  ['k1-sprachen', 'Drei Sprachen'],
  ['k2-faktor', 'Exp(B): ein Faktor'],
  ['k3-rueckweg', 'Vom Logit zurück zur Wahrscheinlichkeit'],
  ['k3-zwei-schritte', 'Gleicher Faktor, verschiedene Prozentpunkte'],
  ['k4-treffer', 'Trefferquote'],
];

export const MITNEHMEN: MitnehmenDaten = { wichtig: WICHTIG, selbstKarte: SELBST_KARTE, workshop: 'Kapitel 9.8' };
