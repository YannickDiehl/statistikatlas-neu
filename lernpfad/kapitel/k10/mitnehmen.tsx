// Kapitel 10, Reiter „Mitnehmen“: das Wichtigste mit Verweisen in Verstehen, Karten zum Nachlesen je Selbsttest-Frage.
// Der Selbsttest hat je Möglichkeit eine eigene Begründung ({ text, why }); die Fragen kommen aus SELF_TEST,
// nur ohne Backticks im Fragetext (der Reiter zeigt ihn als reinen Text).
import type { ReactNode } from 'react';
import { Begriff } from '@lernpfad/Begriff';
import type { MitnehmenDaten } from '../../react/typen';
import { SELF_TEST } from '@atlas/chapter/s10/content';

const WICHTIG: [ReactNode, string, string][] = [
  [<>In einer multiplen Regression gilt jedes B bei gleichen Werten der anderen Prädiktoren. Kommt ein Prädiktor dazu, der mit beiden zusammenhängt, ändert sich B: Es kann kleiner werden (Aufgabe 1) oder größer, eine <Begriff id="suppression">Suppression</Begriff> (Verstehen zu Aufgabe 1).</>, 'k1-alter', 'Ein zweiter Prädiktor'],
  [<><Begriff id="bruttoeffekt">Bruttoeffekt</Begriff> (ohne Kontrolle) und <Begriff id="nettoeffekt">Nettoeffekt</Begriff> (mit Kontrolle) stimmen beide; sie beantworten verschiedene Fragen. Sag immer, welche <Begriff id="kontrollvariable">Kontrollvariablen</Begriff> konstant gehalten wurden.</>, 'k1-kontrolle', 'Was kontrollieren heißt'],
  [<>Gruppen kommen als Dummies ins Modell: k Gruppen, k − 1 Dummies. Die Konstante ist der Mittelwert der <Begriff id="referenzgruppe">Referenzgruppe</Begriff>, jedes B ein Unterschied zu ihr. Andere Referenz, andere B, gleiche Vorhersagen.</>, 'k2-wechsel', 'Referenz wechseln'],
  [<><Begriff id="beta">Beta</Begriff> vergleicht Prädiktoren in derselben Einheit. Das größte B ist nicht automatisch der stärkste Prädiktor.</>, 'k3-beta', 'Wer wiegt mehr? Beta'],
  [<>R² steigt mit jedem Prädiktor; das <Begriff id="korrigiertes-r2">korrigierte R²</Begriff> nur, wenn er mehr erklärt als Zufall.</>, 'k3-r2', 'Das korrigierte R²'],
  [<>VIF ab 10 heißt: Prädiktoren sagen fast dasselbe (<Begriff id="multikollinearitaet">Multikollinearität</Begriff>). <Begriff id="einfluss">Einflussreiche Fälle</Begriff> können B stark verschieben, vor allem in kleinen Gruppen. Gilt ein Unterschied nicht für alle, gehört eine <Begriff id="interaktion">Interaktion</Begriff> mit <code>*</code> ins Modell.</>, 'k5-voraussetzungen', 'Voraussetzungen'],
  [<>In R: <code>linear_regression(y ~ x1 + x2, weights = wghtpew) %&gt;% summary()</code>, Dummies mit <code>to_dummy()</code>, Interaktion mit <code>*</code>.</>, 'r1', 'Mehrere Prädiktoren'],
];

const SELBST_KARTE: [string, string][] = [
  ['k1-alter', 'Ein zweiter Prädiktor'],
  ['k2-wechsel', 'Referenz wechseln'],
  ['k3-beta', 'Wer wiegt mehr? Beta'],
  ['k3-r2', 'Das korrigierte R²'],
  ['k3-vif', 'Multikollinearität'],
  ['k5-kontrolle', 'Was du kontrollierst'],
];

const ohneTicks = (s: string) => s.replace(/`([^`]+)`/g, '$1');

export const MITNEHMEN: MitnehmenDaten = {
  wichtig: WICHTIG,
  selbstKarte: SELBST_KARTE,
  workshop: 'Kapitel 9',
  selbsttest: SELF_TEST.map(item => ({ ...item, question: ohneTicks(item.question) })),
};
