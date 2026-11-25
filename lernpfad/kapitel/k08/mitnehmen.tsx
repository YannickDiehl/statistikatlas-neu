// Kapitel 8, Reiter „Mitnehmen“: das Wichtigste (wörtlich aus Session8.tsx) mit Verweisen in Verstehen, Karten zum Nachlesen je Selbsttest-Frage.
import type { ReactNode } from 'react';
import type { MitnehmenDaten } from '../../react/typen';

const WICHTIG: [ReactNode, string, string][] = [
  [<>Einstellungen misst man mit mehreren <b>Items</b>. Ein <b>Index</b> fasst sie zu einem Wert je Person zusammen; im Mittelwert gleichen sich zufällige Messfehler teilweise aus.</>, 'v1a', 'Warum mehrere Fragen?'],
  [<>Ein <b>Mittelwertindex</b> ist der Mittelwert der gültigen Antworten einer Person. <code>min_valid</code> legt fest, wie viele Antworten mindestens nötig sind.</>, 'v1b', 'Eine Reihe, ein Wert'],
  [<>Vorher müssen alle Items in dieselbe Richtung zeigen. Andersherum gefragte Items polst du mit <code>rec(x, rules = "rev")</code> um. Eine negative Trennschärfe oder ein negatives α zeigen ein falsch gepoltes Item.</>, 'v3b', 'Falsch gepolt: Umpol-Labor'],
  [<><b>Cronbachs α</b> misst, wie stimmig die Items zusammen sind (Reliabilität). Faustregel: ab 0,7 annehmbar, ab 0,8 gut. α steigt aber auch mit der Zahl der Items und sagt nichts über die Validität.</>, 'v2b', 'Formel lesen lernen: α'],
  [<>Die <b>Trennschärfe</b> zeigt, wie gut ein Item zu den anderen passt; „Alpha if Deleted“, wie hoch α ohne das Item wäre. Ob ein Item bleibt, entscheidet der Inhalt.</>, 'v2c', 'Die Ausgabe von reliability()'],
  [<>Ein <b>Kombinationsindex</b> verbindet Antworten nach einer festen Regel und lässt keinen Ausgleich zu, etwa „allen zugestimmt“ oder der Inglehart-Index.</>, 'v4a', 'Ausgleich im Mittelwert'],
  [<>Einen Index deutest du immer mit seiner Richtung: Wofür steht eine hohe Zahl?</>, 'v3-richtung', 'Wofür steht eine hohe Zahl?'],
  [<>In R: <code>mutate(index = row_means(pick(…), min_valid = …))</code>, <code>reliability(…) %&gt;% summary()</code>, <code>rec(…, rules = "rev")</code>, zum Zählen <code>row_sums()</code>.</>, 'r2', 'Neu heute im Vorweg'],
];

// Reihenfolge wie SELF_TEST in content.ts: α bei 20 Items, negative Trennschärfe, min_valid, Richtung eines Index, Rangfolge.
const SELBST_KARTE: [string, string][] = [
  ['v2b', 'Formel lesen lernen: Cronbachs α'],
  ['v3b', 'Falsch gepolt: Umpol-Labor'],
  ['v1b', 'Eine Reihe, ein Wert'],
  ['v1c', 'Den Index deuten'],
  ['v4b', 'Ein klassischer Kombinationsindex: Inglehart'],
];

export const MITNEHMEN: MitnehmenDaten = { wichtig: WICHTIG, selbstKarte: SELBST_KARTE, workshop: 'Kapitel 5 und 8' };
