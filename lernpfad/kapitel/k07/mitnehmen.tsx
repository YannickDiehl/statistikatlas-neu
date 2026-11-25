// Kapitel 7, Reiter „Mitnehmen“: das Wichtigste mit Verweisen in Verstehen, Karten zum Nachlesen je Selbsttest-Frage.
// Selbsttest, Skript und Dateiname kommen unverändert aus content.ts (SELF_TEST, SCRIPT, SCRIPT_FILE).
import type { ReactNode } from 'react';
import type { MitnehmenDaten } from '../../react/typen';
import { Begriff } from '@lernpfad/Begriff';

const WICHTIG: [ReactNode, string, string][] = [
  [<>Mittelwerte schwanken von Stichprobe zu Stichprobe. Wie stark, sagt der <b><Begriff id="standardfehler">Standardfehler</Begriff></b>; er wird mit mehr Befragten kleiner.</>, 'k1a', 'Jede Stichprobe ist anders'],
  [<>Der <b><Begriff id="t-test">t-Wert</Begriff></b> ist Unterschied ÷ Standardfehler, im Bild: Signal durch Rauschen. Der <b><Begriff id="p-wert">p-Wert</Begriff></b> sagt, wie oft ein mindestens so großer Unterschied ohne echten Unterschied vorkäme; unter 0,05 heißt <b><Begriff id="signifikanzniveau">signifikant</Begriff></b>.</>, 'k1b', 'Der t-Wert'],
  [<>Das <b>95-%-<Begriff id="konfidenzintervall">Konfidenzintervall</Begriff></b> zeigt, wo der wahre Unterschied plausibel liegt. Enthält es die 0, ist der Unterschied nicht signifikant, aber auch nicht als „gleich“ bewiesen.</>, 'k1c', 'p-Wert und Konfidenzintervall'],
  [<>Signifikant heißt nicht groß: Die <b><Begriff id="effektgroesse">Effektstärke</Begriff></b> (Hedges&apos; g, <Begriff id="eta-quadrat">η²</Begriff>) sagt, wie groß ein Unterschied ist.</>, 'k2a', 'Signifikant oder groß?'],
  [<>Zwei Gruppen: <b>t-Test</b>, Welch-Zeile lesen. Drei oder mehr: <b><Begriff id="anova">ANOVA</Begriff></b>, danach <b><Begriff id="tukey">Tukey</Begriff></b>, weil sich bei vielen einzelnen Tests die Fehler 1. Art häufen.</>, 'k3a', 'Viele Paare, viele Tests'],
  [<>Voraussetzungen: metrische Variable, unabhängige Gruppen, genug Befragte je Gruppe, ähnliche Streuung, also <Begriff id="varianzhomogenitaet">Varianzhomogenität</Begriff> (sonst <Begriff id="welch-test">Welch-Test</Begriff>). Für Deutschland gewichten.</>, 'k2b', 'Die Voraussetzungen'],
  [<>In R: <code>t_test(y, group = g, weights = wghtpew)</code>, <code>oneway_anova(y, group = g, weights = wghtpew) %&gt;% tukey_test()</code>, <code>pearson_cor(a, b, c, weights = wghtpew)</code>; <code>summary()</code> am Ende zeigt die ganze Tabelle.</>, 'r1', 'Startblock, Kette, Gewicht'],
];

const SELBST_KARTE: [string, string][] = [
  ['k2a', 'Signifikant oder groß?'],
  ['k1a', 'Jede Stichprobe ist anders'],
  ['k3a', 'Viele Paare, viele Tests'],
  ['k1c', 'p-Wert und Konfidenzintervall'],
  ['k2c', 'Welch oder Student?'],
];

export const MITNEHMEN: MitnehmenDaten = { wichtig: WICHTIG, selbstKarte: SELBST_KARTE, workshop: 'Kapitel 7.6 Mittelwertvergleiche' };
