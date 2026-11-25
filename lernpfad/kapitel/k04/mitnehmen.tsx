// Kapitel 4, Reiter „Mitnehmen“: das Wichtigste mit Verweisen in Verstehen, Karten zum Nachlesen je Selbsttest-Frage.
import type { ReactNode } from 'react';
import type { MitnehmenDaten } from '../../react/typen';

const WICHTIG: [ReactNode, string, string][] = [
  [<>Eine <b>Verteilung</b> zeigt, wie viele Menschen welchen Wert angegeben haben. Eine Kennzahl allein verschweigt ihre Form.</>, 'k1-verteilung', 'Eine Verteilung'],
  [<>Formen: <b>symmetrisch</b>, <b>linksschief</b> (läuft links aus), <b>rechtsschief</b> (läuft rechts aus), <b>mehrgipflig</b> (gespalten).</>, 'k2-formen', 'Formen erkennen'],
  [<>Der <b>Median</b> bleibt in der Mitte, der <b>Mittelwert</b> wird von Ausreißern und vom Auslauf gezogen.</>, 'k4-lineal', 'Vom Lineal zum Boxplot'],
  [<>Wenige Stufen: <b>Balken</b>. Viele Werte: <b>Histogramm</b>. Viele Werte nach Gruppen: <b>Boxplots</b>.</>, 'k5-wahl', 'Welche Grafik?'],
  [<>Balken beginnen bei 0. Jede Grafik nennt Quelle, n und ob gewichtet wurde.</>, 'k1-achse', 'Achse und Bildunterschrift'],
  [<>Hineinzoomen mit <code>coord_cartesian()</code> ändert nur den Ausschnitt, <code>filter()</code> ändert, wer mitgerechnet wird. Sag immer, wer im Bild fehlt.</>, 'k4-zoom', 'Zoomen oder abschneiden'],
  [<>In R: Daten mit <code>%&gt;%</code> weiterreichen, ab <code>ggplot()</code> Schichten mit <code>+</code>; <code>drop_na()</code> lässt fehlende Werte ausdrücklich weg.</>, 'k1-kette', 'Die Kette lesen'],
];

const SELBST_KARTE: [string, string][] = [['k2-formen', 'Formen erkennen'], ['k4-lineal', 'Vom Lineal zum Boxplot'], ['k5-wahl', 'Welche Grafik?'], ['k1-na', 'Fehlende Werte und n'], ['k1-achse', 'Achse und Bildunterschrift']];

export const MITNEHMEN: MitnehmenDaten = { wichtig: WICHTIG, selbstKarte: SELBST_KARTE, workshop: 'Kapitel 6' };
