// Kapitel 7, Reiter „Mitnehmen“: das Wichtigste mit Verweisen in Verstehen, Karten zum Nachlesen je Selbsttest-Frage.
// Selbsttest, Skript und Dateiname kommen unverändert aus content.ts (SELF_TEST, SCRIPT, SCRIPT_FILE).
import type { ReactNode } from 'react';
import type { MitnehmenDaten } from '../../react/typen';

const WICHTIG: [ReactNode, string, string][] = [
  [<>Mittelwerte schwanken von Stichprobe zu Stichprobe. Wie stark, sagt der <b>Standardfehler</b>; er wird mit mehr Befragten kleiner.</>, 'k1a', 'Jede Stichprobe ist anders'],
  [<>t = Unterschied ÷ Standardfehler: Signal durch Rauschen. Der <b>p-Wert</b> sagt, wie oft ein mindestens so großer Unterschied ohne echten Unterschied vorkäme; unter 0,05 heißt <b>signifikant</b>.</>, 'k1b', 'Signal durch Rauschen'],
  [<>Das <b>95-%-Konfidenzintervall</b> zeigt, wo der wahre Unterschied plausibel liegt. Enthält es die 0, ist der Unterschied nicht signifikant, aber auch nicht als „gleich“ bewiesen.</>, 'k1c', 'p-Wert und Konfidenzintervall'],
  [<>Signifikant heißt nicht groß: Die <b>Effektstärke</b> (Hedges&apos; g, η²) sagt, wie groß ein Unterschied ist.</>, 'k2a', 'Signifikant heißt nicht wichtig'],
  [<>Zwei Gruppen: <b>t-Test</b>, Welch-Zeile lesen. Drei oder mehr: <b>ANOVA</b>, danach <b>Tukey</b>, weil viele einzelne Tests Fehlalarme anhäufen.</>, 'k3a', 'Viele Paare, viele Fehlalarme'],
  [<>Voraussetzungen: metrische Variable, unabhängige Gruppen, genug Befragte je Gruppe, ähnliche Streuung (sonst Welch). Für Deutschland gewichten.</>, 'k2b', 'Die Voraussetzungen'],
  [<>In R: <code>t_test(y, group = g, weights = wghtpew)</code>, <code>oneway_anova(y, group = g, weights = wghtpew) %&gt;% tukey_test()</code>, <code>pearson_cor(a, b, c, weights = wghtpew)</code>; <code>summary()</code> am Ende zeigt die ganze Tabelle.</>, 'r1', 'Startblock, Kette, Gewicht'],
];

const SELBST_KARTE: [string, string][] = [
  ['k2a', 'Signifikant heißt nicht wichtig'],
  ['k1a', 'Jede Stichprobe ist anders'],
  ['k3a', 'Viele Paare, viele Fehlalarme'],
  ['k1c', 'p-Wert und Konfidenzintervall'],
  ['k2c', 'Welch oder Student?'],
];

export const MITNEHMEN: MitnehmenDaten = { wichtig: WICHTIG, selbstKarte: SELBST_KARTE, workshop: 'Kapitel 7.6 Mittelwertvergleiche' };
