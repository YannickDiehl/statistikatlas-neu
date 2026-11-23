// Sitzung 7 „Mittelwerte vergleichen“: Vorweg R lesen (#r1 Erinnerung, #r2 Ein t-Test in R) aus sitzung07.md §3.
import { Card, InShort, Known, Mixup, MoreDetail } from '../blocks/Card';
import { ReadTTest } from './figures/ROutput';
import { Workshop } from './Workshop';

/** Vorweg: R lesen, two cards (h4): #r1 and #r2. */
export function ReadR() {
  return <>
    <Card id="r1" stone="R" title="Erinnerung: Startblock, Kette, Gewicht" tag={{ kind: 'picture', label: 'Code lesen' }}
      badge={<><Known session={1} what="Startblock" /><Known session={5} what="mutate() mit rec()" /><Known session={6} what="Gewicht" /></>}>
      <p className="lead">Den Startblock kennst du: Er lädt die Werkzeuge und legt den ALLBUS unter dem Namen <code>allbus</code> ab. In der Code-Werkstatt hier auf der Seite ist das schon erledigt; in RStudio führst du ihn zu Beginn aus.</p>
      <Workshop k="start" />
      <p className="hilfe-zeile">Rote Zeilen beim Laden sind normal. Findet R die Datei nicht, nimm wie in Sitzung 1 <code>allbus &lt;- read_spss(file.choose())</code>.</p>
      <p className="absatz">Heute rechnest du alles <b>gewichtet</b>, so wie seit Sitzung 6: <code>weights = wghtpew</code> steht in jeder Test-Funktion in den Klammern. Der Grund ist derselbe: Der Osten ist im ALLBUS absichtlich stärker vertreten, das Gewicht gleicht das für Aussagen über ganz Deutschland aus.</p>
      <p className="absatz">Neu heute sind diese Werkzeuge aus mariposa:</p>
      <ul>
        <li><code>t_test()</code> vergleicht die Mittelwerte von <b>zwei</b> Gruppen.</li>
        <li><code>oneway_anova()</code> vergleicht die Mittelwerte von <b>drei oder mehr</b> Gruppen, <code>tukey_test()</code> sagt danach, welche Paare sich unterscheiden.</li>
        <li><code>pearson_cor()</code> kennst du mit zwei Variablen; mit mehr Variablen rechnet es alle Paare auf einmal (Korrelationsmatrix).</li>
      </ul>
      <p className="absatz">Alle lassen fehlende Werte selbst weg; <code>drop_na()</code> brauchst du heute nicht.</p>
      <InShort>In einem Test steht zuerst die Variable, deren Mittelwerte du vergleichst (<b>abhängige Variable</b>), dann nach <code>group =</code> die Variable, die die Gruppen bildet, dann das Gewicht. <code>summary()</code> am Ende der Kette holt die ganze Tabelle.</InShort>
      <Mixup><code>group = abitur</code> und <code>abitur</code> allein. Ohne <code>group =</code> hält R die zweite Variable für eine weitere abhängige Variable. Bei <code>oneway_anova()</code> meldet es dann „Argument <code>group</code> is missing“. Bei <code>t_test()</code> kommt <b>keine</b> Meldung, sondern ein falsches Ergebnis: zwei Blöcke „t-Test: pt03“ und „t-Test: abitur“ mit riesigem t, weil R jede Variable für sich gegen 0 testet. Daran erkennst du es: Es fehlt die Zeile „Groups compared“.</Mixup>
    </Card>

    <Card id="r2" stone="R" title="Ein t-Test in R: Zeile für Zeile" tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">So vergleicht R die Arbeitsstunden pro Woche (<code>dw15</code>) von Männern und Frauen. <code>t_test()</code> braucht genau zwei Gruppen. Im ALLBUS hat <code>sex</code> drei Ausprägungen: Mann, Frau und divers. 18 Befragte haben „divers“ angegeben; für einen eigenen Vergleich ist diese Gruppe zu klein. Darum bildet die Vorlage mit <code>rec()</code> zuerst eine Variable <code>geschlecht</code> mit zwei Gruppen. Lies die Kette von oben nach unten und führe sie aus.</p>
      <Workshop k="r_ttest" live />
      <p className="absatz"><b>So liest du die Kette</b>, Zeile für Zeile:</p>
      <ul>
        <li><code>allbus %&gt;%</code>: nimm den ALLBUS, und dann</li>
        <li><code>mutate(geschlecht = rec(…))</code>: bilde die Variable <code>geschlecht</code> (1 = Mann, 2 = Frau, alles andere fehlt), und dann</li>
        <li><code>t_test(dw15, group = geschlecht, weights = wghtpew)</code>: vergleiche die Mittelwerte von <code>dw15</code> zwischen den Gruppen von <code>geschlecht</code>, gewichtet, und dann</li>
        <li><code>summary()</code>: zeig die ganze Tabelle.</li>
      </ul>
      <h5 className="zwischen">Die Ausgabe lesen</h5>
      <p className="unter-zwischen">Die Ausgabe, gekürzt auf die nötigen Zeilen. Die Marken am Rand erklärt die Liste darunter.</p>
      <ReadTTest />
      <p className="absatz">R schreibt Kommazahlen mit Punkt: <code>41.609</code> heißt 41,609. Ein Minus vor t und Mean Diff. heißt nur: Die zweite Gruppe liegt höher.</p>
      <MoreDetail summary="Warum steht bei N nicht die gezählte Zahl?">
        <p>Mit Gewicht zählt R jede Person mit ihrem Gewicht. N ist dann die Summe der Gewichte, gerundet. Gezählt sind es 1.491 Männer und 1.442 Frauen, die ihre Arbeitsstunden angegeben haben; gewichtet stehen dort 1.530 und 1.427. Die Arbeitsstunden haben übrigens nur Erwerbstätige angegeben, alle anderen fehlen bei <code>dw15</code> und fallen aus dem Vergleich.</p>
      </MoreDetail>
      <InShort><code>t_test()</code> gibt eine Kurzfassung mit t, p, Hedges&apos; g und N. Mit <code>summary()</code> kommen die Gruppenmittelwerte, der Unterschied mit Konfidenzintervall und beide Testzeilen dazu.</InShort>
      <Mixup>zwei Zeilen, zwei Ergebnisse? Beide Zeilen testen dasselbe; sie rechnen den Zufall nur verschieden ein. Lies „Equal variances not assumed“.</Mixup>
    </Card>
  </>;
}
