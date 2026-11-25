// Kapitel 6: Atlas-Bilder in Aufgaben-Schritten. Alle drei zeigen nur; keins verlangt eine Antwort.
// CumTabelle: Beispieltabelle zu Cum. % (Aufgabe 1, Schritt 2). Vorzeichen: Codes als Pfeile (Aufgabe 3, Schritt 3).
// FuenfMasse: fünf Maße für Zufriedenheit und Wirtschaftslage; zeigt Gamma und Tau-b der Aufgabe, darum erst nach „Ergebnis festhalten“ (Aufgabe 3, Schritt 6).
import type { Baustein } from '../../react/typen';
import { CumTable } from '@atlas/chapter/s06/figures/Weighting';
import { SignSchema } from '@atlas/chapter/s06/figures/Pairs';
import { FiveMeasures } from '@atlas/chapter/s06/figures/Overview';
import '@atlas/chapter/s06/s06.css';

export const BAUSTEINE: Record<string, Baustein> = {
  CumTabelle: () => <CumTable />,
  Vorzeichen: () => <SignSchema />,
  FuenfMasse: () => <FiveMeasures />,
};
