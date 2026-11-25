// Kapitel 4, Reiter „Mitnehmen“: das Wichtigste mit Verweisen in Verstehen, Karten zum Nachlesen je Selbsttest-Frage.
import type { ReactNode } from 'react';
import { Begriff } from '@lernpfad/Begriff';
import type { MitnehmenDaten } from '../../react/typen';

const WICHTIG: [ReactNode, string, string][] = [
  [<>Eine <Begriff id="verteilung">Verteilung</Begriff> zeigt, wie viele Menschen welchen Wert angegeben haben. Eine Kennzahl allein verschweigt ihre Form.</>, 'k1-verteilung', 'Eine Verteilung'],
  [<>Formen: <b>symmetrisch</b>, <Begriff id="schiefe">linksschief</Begriff> (läuft links aus), <b>rechtsschief</b> (läuft rechts aus), <Begriff id="mehrgipflig">mehrgipflig</Begriff> (gespalten).</>, 'k2-formen', 'Formen erkennen'],
  [<>Der <b>Median</b> bleibt in der Mitte, der <b>Mittelwert</b> wird von <Begriff id="ausreisser">Ausreißern</Begriff> und vom langen Ausläufer gezogen.</>, 'k4-lineal', 'Vom Lineal zum Boxplot'],
  [<>Wenige Ausprägungen: <Begriff id="balkendiagramm">Balkendiagramm</Begriff>. Viele Werte: <Begriff id="histogramm">Histogramm</Begriff> mit passender <Begriff id="klasse">Klassenbreite</Begriff>. Viele Werte nach Gruppen: <Begriff id="boxplot">Boxplots</Begriff>.</>, 'k5-wahl', 'Welche Grafik?'],
  [<>Balken beginnen bei 0. Jede Grafik nennt Quelle, n und ob <Begriff id="gewichte">gewichtet</Begriff> wurde.</>, 'k1-achse', 'Achse und Bildunterschrift'],
  [<>Ein <Begriff id="achsenausschnitt">Achsenausschnitt</Begriff> mit <code>coord_cartesian()</code> ändert nur das Bild, <code>filter()</code> ändert, wer mitgerechnet wird. Sag immer, wer im Bild fehlt.</>, 'k4-zoom', 'Zoomen oder abschneiden'],
  [<>In R: Daten mit der <Begriff id="pipe">Pipe</Begriff> <code>%&gt;%</code> weiterreichen, ab <code>ggplot()</code> Schichten (<Begriff id="layer">Layer</Begriff>) mit <code>+</code> auflegen; <code>drop_na()</code> lässt fehlende Werte ausdrücklich weg.</>, 'k1-kette', 'Pipe und Plus lesen'],
];

const SELBST_KARTE: [string, string][] = [['k2-formen', 'Formen erkennen'], ['k4-lineal', 'Vom Lineal zum Boxplot'], ['k5-wahl', 'Welche Grafik?'], ['k1-na', 'Fehlende Werte und n'], ['k1-achse', 'Achse und Bildunterschrift']];

export const MITNEHMEN: MitnehmenDaten = { wichtig: WICHTIG, selbstKarte: SELBST_KARTE, workshop: 'Kapitel 6' };
