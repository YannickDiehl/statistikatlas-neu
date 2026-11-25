// Reiter „Verstehen“, neu gedacht (siehe KONZEPT.md): je Aufgabe erklären, was in jedem Schritt passiert und warum.
// Keine Übungen: keine Eingaben, kein Prüfen, kein Schätzen, kein Zuordnen. Bilder und rhetorische Fragen sind erlaubt.
import { Card, InShort, Mixup, MoreDetail, Badge } from '@atlas/chapter/blocks/Card';
import { HeadingLevel } from '@atlas/chapter/blocks/level';
import { ReadR } from '@atlas/chapter/s04/ReadR';
import { Shapes, ShapeLab } from '@atlas/chapter/s04/figures/ShapeLab';
import { Histogram } from '@atlas/chapter/s04/figures/Histogram';
import { AgeBoxplot } from '@atlas/chapter/s04/figures/AgeBoxplot';
import { DecisionTree } from '@atlas/chapter/s04/figures/DecisionTree';
import type { Thema } from '../../react/typen';
import { AchseVergleich, LinealZumBoxplot, TurmZumStapel } from './figuren';
import { Abschnitt, AufgabenBild, Bezug, Code, Frage, Leseart } from '../../react/gemeinsam';

/* ---------- Vorweg ---------- */
export function Vorweg() {
  return <section className="grund-block" id="vorweg" aria-labelledby="vorweg-h">
    <div className="g-kopf">
      <span className="st m c7" aria-hidden="true">R</span>
      <div><div className="ueber">Vorweg, für alle Aufgaben</div><h4 id="vorweg-h">R lesen</h4></div>
    </div>
    <p className="g-intro">Alle vier Aufgaben arbeiten mit Ketten wie <code>allbus %&gt;% … %&gt;% ggplot() + …</code>. Hier steht, wie du so eine Kette liest und wie eine Grafik in R Schicht für Schicht entsteht.</p>
    <HeadingLevel.Provider value={5}><ReadR /></HeadingLevel.Provider>
  </section>;
}

/* ---------- Aufgabe 1 ---------- */
export function Verstehen1() {
  return <Abschnitt id="g1" n={1} titel="Gesundheit zeigen" frage="Wie beurteilen die Befragten ihre Gesundheit?"
    ziel="eine beschriftete Balkengrafik ohne fehlende Werte und kannst sagen, welche Einschätzung am häufigsten ist und wie groß n ist."
    weg={[
      ['Schritt 1', '#a1-p', 'Erst festlegen: Welche Antwort ist wohl am häufigsten?', 'k1-verteilung'],
      ['Schritt 2', '#a1-1', 'Vorlage ausführen: Balken zählen Personen', 'k1-stapel'],
      ['Schritt 2', '#a1-1', 'to_label(): Wörter statt Codes', 'k1-woerter'],
      ['Schritt 3', '#a1-2', 'fehlende Werte weglassen und beschriften', 'k1-na'],
      ['Schritt 4', '#a1-3', 'die Kette lesen', 'k1-kette'],
      ['Schritt 5', '#a1-4', 'Deuten: Wo beginnt die Achse?', 'k1-achse'],
      ['Schritt 6', '#a1-5', 'Ergebnis festhalten: NA-Balken, n, häufigste Antwort', 'k1-ergebnis'],
    ]}>

    <Card id="k1-verteilung" title="Worum es geht: eine Verteilung" badge={<Bezug href="#a1-p">zu Schritt 1</Bezug>} tag={{ kind: 'interpret', label: 'Hintergrund' }}>
      <p className="lead">Die Frage „Wie beurteilen die Befragten ihre Gesundheit?“ fragt nicht nach einer Zahl, sondern nach einer <b>Verteilung</b>: Wie viele Menschen haben „sehr gut“ gesagt, wie viele „gut“, wie viele „schlecht“?</p>
      <Frage>Warum nicht einfach den Mittelwert ausrechnen?</Frage>
      <p>Eine Kennzahl verschweigt die Form. Bei der Lebenszufriedenheit (0 bis 10) liegt der Mittelwert bei 7,36. Diese Zahl verrät nicht, dass 8 die häufigste Antwort ist, und auch nicht, dass fast niemand ganz unten antwortet. Darum schaut man sich vor jeder Kennzahl die Verteilung an.</p>
      <Frage>Und warum sollst du vorher festlegen, was du erwartest?</Frage>
      <p>Wer vorher eine Erwartung notiert, merkt hinterher, wo das eigene Bild von der Gesellschaft danebenlag. Ohne Festlegung wirkt jedes Ergebnis im Nachhinein „klar“. Darum beginnt die Aufgabe mit „Erst festlegen“: Du wählst, welche Antwort wohl am häufigsten ist. Holst du am Ende deine Ergebnisse ins Journal, steht deine Festlegung dort neben dem Ergebnis.</p>
      <InShort>Eine <b>Verteilung</b> zeigt, wie viele Menschen welchen Wert angegeben haben. Der häufigste Wert heißt <b>Modus</b>; im Bild ist er der höchste Balken.</InShort>
    </Card>

    <Card id="k1-stapel" title="Vom Turm zum Stapel: was geom_bar() zählt" badge={<Bezug href="#a1-1">zu Schritt 2</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Die Vorlage in Schritt 2 hat nur drei Zeilen nach <code>allbus %&gt;%</code>, und trotzdem entsteht eine fertige Balkengrafik. Was passiert dabei mit den Antworten? Geh die fünf Schritte am Beispiel von zwölf Befragten durch.</p>
      <TurmZumStapel />
      <Code k="a1v" />
      <Frage>Und wo stehen diese Zahlen für alle Befragten?</Frage>
      <p>In der Tabelle von <code>allbus %&gt;% frequency(hs01)</code>. Die Spalte <b>N</b> ist die Höhe der Stapel, <b>Valid %</b> ist der Anteil an allen gültigen Antworten, und „Total missing“ zählt den Stapel NA. Grafik und Tabelle zeigen dasselbe, einmal als Bild, einmal als Zahlen.</p>
      <InShort>Ein <b>Balkendiagramm</b> ist ein Bild von gezählten Stapeln. Die Höhe eines Stapels ist die <b>absolute Häufigkeit</b>, sein Anteil an allen gültigen Antworten die <b>relative Häufigkeit</b>.</InShort>
      <Mixup>Die y-Achse von <code>geom_bar()</code> zeigt Anzahlen (<code>count</code>), keine Prozent. Wer dort einen Anteil sucht, findet die Zahl der Personen. Die Form der Balken ist dieselbe.</Mixup>
    </Card>

    <Card id="k1-woerter" title="Zahlen oder Wörter: to_label()" badge={<Bezug href="#a1-1">zu Schritt 2</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Im Datensatz steht bei <code>hs01</code> keine Antwort wie „gut“, sondern ein Code, zum Beispiel 2. Die Wörter hängen als Aufkleber (Fachbegriff: <b>Wertelabels</b>) an den Zahlen.</p>
      <Frage>Warum steht in der Vorlage <code>to_label(hs01)</code> vor <code>ggplot()</code>?</Frage>
      <p>Ohne <code>to_label()</code> zeichnet ggplot die Codes 1 bis 5 auf die Achse, und niemand weiß, was „2“ heißt. <code>to_label()</code> macht aus den Aufklebern echte Wörter (eine Variable vom Typ Faktor, <code>fct</code>). Dann steht „sehr gut“, „gut“ und so weiter unter den Balken, und zwar in der Reihenfolge der Codes.</p>
      <AufgabenBild k="toLabel" />
      <Mixup><code>to_label()</code> ändert nicht die Antworten, nur ihre Schreibweise. Wer „gut“ gesagt hat, steht danach im selben Stapel wie vorher, nur mit Wort statt Zahl darunter.</Mixup>
    </Card>

    <Card id="k1-na" title="Fehlende Werte: woher der Balken NA kommt" badge={<Bezug href="#a1-2">zu Schritt 3</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Nach Schritt 2 steht ganz rechts ein Balken <b>NA</b>. Das sind Personen ohne gültige Antwort: Sie haben keine Angabe gemacht, oder ihre Antwort ist ein Datenfehler.</p>
      <Frage>Warum taucht er auf einmal als Balken auf?</Frage>
      <p>Stehen Zahlen auf der Achse, lässt ggplot fehlende Werte weg und warnt nur mit „Removed n rows“. Stehen Wörter auf der Achse, ist <code>NA</code> für ggplot eine eigene Kategorie und bekommt einen Balken. Das ist ehrlich, aber für die Frage „Wie beurteilen die Befragten ihre Gesundheit?“ zählt nur, wer geantwortet hat.</p>
      <AufgabenBild k="dropNa" />
      <p><code>drop_na(hs01)</code> lässt alle ohne gültige Antwort ausdrücklich weg, <b>bevor</b> gezeichnet wird. Ausdrücklich heißt: Du entscheidest es und kannst es in der Bildunterschrift sagen. Die Zahl, die übrig bleibt, ist dein <b>n</b>.</p>
      <Code k="a1n" />
      <p>In der Vorlage sind zwei Stellen markiert. <code>title =</code> sagt in wenigen Wörtern, was die Grafik zeigt. Nach <code>n =</code> gehört die Zahl der gültigen Antworten, also alle, die nach <code>drop_na()</code> übrig sind.</p>
      <Frage>Und warum gehört n in die Bildunterschrift?</Frage>
      <p>Weil ein Balkendiagramm allein nicht verrät, wie viele Menschen dahinterstehen. 30 % von 50 Personen sind etwas anderes als 30 % von 5.000. <code>labs(caption = …)</code> schreibt Quelle, n und „ungewichtet“ unter die Grafik.</p>
      <InShort>Fehlende Werte heißen in R <code>NA</code>. <code>drop_na()</code> lässt sie ausdrücklich weg; was übrig bleibt, ist <b>n</b>, die Zahl der gültigen Antworten.</InShort>
      <MoreDetail summary="Wo finde ich n?">
        <p><code>allbus %&gt;% frequency(hs01)</code> zeigt unten „Total valid“: Das ist dein n. „Total missing“ zählt genau die Personen, die im Balken NA standen. Beides zusammen ergibt alle 5.246 Befragten.</p>
      </MoreDetail>
    </Card>

    <Card id="k1-kette" title="Die Kette lesen: %>% bis zur Leinwand, + danach" badge={<Bezug href="#a1-3">zu Schritt 4</Bezug>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">Deine fertige Kette hat zwei Teile. Oben arbeitest du mit <b>Daten</b>, unten an einem <b>Bild</b>.</p>
      <AufgabenBild k="kette" />
      <Frage>Woran erkennst du, wo der eine Teil aufhört?</Frage>
      <p>An <code>ggplot()</code>. Bis dahin reicht <code>%&gt;%</code> die Bauplatte weiter („und dann“): <code>to_label()</code> übersetzt, <code>drop_na()</code> sortiert aus. Ab <code>ggplot()</code> gibt es eine Leinwand, und <code>+</code> legt Schichten auf: Balken, dann Beschriftung. Wie das Bild Schicht für Schicht entsteht, siehst du in <a href="#r2">„Eine Grafik entsteht in Schichten“</a>.</p>
      <Mixup><code>%&gt;%</code> statt <code>+</code> nach <code>ggplot()</code>. R meldet dann „`mapping` must be created by `aes()`“. Ab der Leinwand verbindet das Plus.</Mixup>
    </Card>

    <Card id="k1-achse" title="Ehrlich zeigen: Achse und Bildunterschrift" badge={<Bezug href="#a1-4">zu Schritt 5</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">Mittlere Lebenszufriedenheit im Westen: 7,44, im Osten: 7,18. Der Unterschied ist klein. Eine Grafik kann ihn trotzdem riesig aussehen lassen, ohne dass eine Zahl falsch ist.</p>
      <AchseVergleich />
      <Frage>Wie kann dieselbe Zahl so verschieden wirken?</Frage>
      <p>Bei Balken liest das Auge die <b>Länge</b>. Beginnt die Achse bei 0, sind die Balken 7,44 und 7,18 lang: fast gleich. Beginnt sie bei 7, sind sichtbar nur noch 0,44 und 0,18 übrig, und der West-Balken wirkt mehr als doppelt so lang.</p>
      <Frage>Was heißt das für deine Grafik in Schritt 5?</Frage>
      <p>Dort zählt die y-Achse Personen. Begänne sie bei 500, würden kurze Balken wie „schlecht“ fast ganz verschwinden, und die Unterschiede zwischen den übrigen Balken sähen viel größer aus, als sie sind. Die Zahlen blieben dieselben, das Bild nicht.</p>
      <InShort>Balken beginnen bei 0. Wer die Achse abschneidet, lässt kleine Unterschiede riesig aussehen. Wer abweicht, sagt es in der Bildunterschrift.</InShort>
      <div className="box-gruen">
        <h6>Das gehört in jede Bildunterschrift (du füllst sie in Schritt 3)</h6>
        <ul><li>Quelle: ALLBUS 2023</li><li>wie viele: n</li><li>gewichtet oder ungewichtet</li><li>wenn die Achse nicht bei 0 beginnt: ausdrücklich sagen</li></ul>
      </div>
      <Mixup>„Doppelt so lang“ heißt nicht „doppelt so zufrieden“. Verglichen werden im Bild Längen, nicht Zufriedenheit.</Mixup>
    </Card>

    <Card id="k1-ergebnis" title="Ergebnis festhalten: was die Fragen wissen wollen" badge={<Bezug href="#a1-5">zu Schritt 6</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">In Schritt 6 hältst du vier Dinge fest. Jedes hat einen Ort, an dem du es ablesen kannst.</p>
      <ul className="v-liste">
        <li><b>Der Balken ganz rechts:</b> In der ersten Grafik, mit Wörtern auf der Achse, ist das der Balken der fehlenden Werte (<a href="#k1-na">Fehlende Werte</a>).</li>
        <li><b>Wie viele darin stecken:</b> <code>allbus %&gt;% frequency(hs01)</code>, Zeile „Total missing“.</li>
        <li><b>n für die Bildunterschrift:</b> dieselbe Tabelle, Zeile „Total valid“: alle, die nach <code>drop_na()</code> übrig bleiben.</li>
        <li><b>Die häufigste Antwort:</b> der höchste Balken, der <b>Modus</b>. Lies das Wort darunter. Ohne <code>to_label()</code> stünde dort nur ein Code, und der Code 1 heißt hier „sehr gut“ (<a href="#k1-woerter">Zahlen oder Wörter</a>).</li>
      </ul>
      <p>Holst du die Ergebnisse ins Journal, steht dort deine Festlegung aus Schritt 1 daneben. Lag sie daneben, ist das kein Fehler, sondern genau der Moment, für den man vorher festlegt.</p>
    </Card>
  </Abschnitt>;
}

/* ---------- Aufgabe 2 ---------- */
export function Verstehen2() {
  return <Abschnitt id="g2" n={2} titel="Der Rätselkasten" frage="Welche Frage steckt hinter welcher Form?"
    ziel="einen Blick dafür, woran man eine Verteilung erkennt: an Stufen, Gipfel und Häufungen."
    weg={[
      ['Schritt 1', '#a2-1', 'vier Formen den Fragen zuordnen', 'k2-formen'],
      ['Hintergrund', '#a2-1', 'was die Form mit Mittelwert und Median macht', 'k2-labor'],
      ['Schritt 2', '#a2-2', 'eine Zuordnung in R prüfen', 'k2-pruefen'],
    ]}>

    <Card id="k2-formen" title="Woran man eine Verteilung erkennt" badge={<Bezug href="#a2-1">zu Schritt 1</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Im Rätselkasten fehlen die Beschriftungen. Was bleibt, ist die Form. Verteilungen haben typische Formen, und jede verrät etwas über die Frage dahinter. Fünf Fragen, vier Bilder: Eine Frage bleibt übrig. Damit du einen Blick für Formen bekommst, hier vier andere echte Beispiele aus dem ALLBUS 2023, mit Beschriftung. Das Dreieck zeigt den Mittelwert, der gestrichelte Strich den Median.</p>
      <Shapes />
      <Frage>Welche drei Dinge schaust du dir bei einer unbeschrifteten Verteilung an?</Frage>
      <ul className="v-liste">
        <li><b>Stufen:</b> Wie viele Säulen gibt es? Fünf, sieben, zehn oder sehr viele? Das verrät die Antwortskala der Frage.</li>
        <li><b>Gipfel:</b> Wo ist die höchste Säule, und gibt es mehrere? Zwei Gipfel heißen oft: Die Befragten sind gespalten.</li>
        <li><b>Häufungen:</b> Ragen einzelne Werte heraus? Bei offenen Zahlenangaben runden Menschen, dann stehen runde Werte wie 60 Minuten besonders hoch.</li>
      </ul>
      <InShort>Die <b>Schiefe</b> sagt, ob eine Verteilung zu einer Seite flach ausläuft. Eine Verteilung heißt nach der Seite, auf der sie <b>ausläuft</b>, nicht nach ihrem Gipfel.</InShort>
      <Frage>Und die Frage, die übrig bleibt?</Frage>
      <p>Zu ihr gibt es im Kasten kein Bild. Wer will, zeichnet ihre Verteilung unter „Weiter, wenn du magst“ selbst und schaut, ob sie zu den eigenen Erwartungen passt.</p>
      <Mixup>„Linksschief“ heißt nicht „die meisten sind links“. Bei der Lebenszufriedenheit stehen die meisten rechts; die Verteilung läuft nur links flach aus.</Mixup>
    </Card>

    <Card id="k2-labor" title="Formen-Labor: Was die Form mit Mittelwert und Median macht" badge={<Badge>Hintergrund, gebraucht in Aufgabe 3 und 4</Badge>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Verändere die Form und beobachte, wohin Mittelwert (Dreieck) und Median (Strich) wandern. 40 Steine, Werte 0 bis 10.</p>
      <ShapeLab />
      <Frage>Warum wandert das Dreieck weiter als der Strich?</Frage>
      <p>Der Mittelwert ist der Schwerpunkt: Jeder Stein zieht mit seinem Wert an ihm, auch die weit draußen. Der Median ist nur die Mitte der Reihe; ihm ist egal, wie weit die äußeren Steine weg sind. Darum zieht ein langer Auslauf den Mittelwert in seine Richtung, den Median kaum.</p>
      <MoreDetail summary="Schiefe als Zahl, und was die Form inhaltlich bedeutet">
        <p><code>describe()</code> aus mariposa gibt die Schiefe als Zahl aus (<em>Skewness</em>). Negativ heißt linksschief (Lebenszufriedenheit: −1,07), positiv rechtsschief, nahe 0 ungefähr symmetrisch. Als grobe Faustregel gilt ein Betrag unter 0,5 als ungefähr symmetrisch.</p>
        <p><b>Aber Vorsicht:</b> Die Schiefe als Zahl sieht keine Gipfel. Die Leihmutterschaft hat eine Schiefe von +0,28 und wäre nach der Faustregel symmetrisch, obwohl sie deutlich mehrgipflig ist. Darum gilt: erst anschauen, dann rechnen.</p>
        <p>Die Form ist eine inhaltliche Aussage. Mehrgipflig heißt oft, dass eine Gesellschaft bei einer Frage gespalten ist. Ein Mittelwert allein würde dann Einigkeit vortäuschen, wo es keine gibt. Bei schiefen Verteilungen berichtest du den Median mit.</p>
      </MoreDetail>
    </Card>

    <Card id="k2-pruefen" title="Eine Zuordnung in R prüfen" badge={<Bezug href="#a2-2">zu Schritt 2</Bezug>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">In Schritt 2 zeichnest du eine Verteilung selbst, um deine Zuordnung zu prüfen. Die Vorlage hat zwei markierte Stellen.</p>
      <Code k="a2" />
      <Frage>Warum musst du beide Stellen tauschen?</Frage>
      <p>Die Variable steht zweimal in der Kette, und jedes Mal mit einer anderen Aufgabe. In <code>drop_na(pa01)</code> sagt sie, bei welcher Frage fehlende Werte wegfallen. In <code>aes(x = pa01)</code> sagt sie, welcher Turm gezählt wird. Tauschst du nur die zweite Stelle, zeichnet R die richtige Frage, lässt aber bei der falschen Frage Personen weg. Tauschst du nur die erste, zeigt die Grafik weiter <code>pa01</code>.</p>
      <Frage>Woran siehst du, dass es geklappt hat?</Frage>
      <p>Unter der x-Achse steht die Beschriftung der Frage, die R aus dem Datensatz nimmt (bei älteren ggplot2-Versionen der Variablenname). Stimmen Beschriftung und deine Zuordnung überein, und passt die Form, ist die Zuordnung bestätigt.</p>
      <Mixup>Dieselbe Form heißt nicht dieselbe Frage. Zwei Fragen mit fünf Stufen und Gipfel in der Mitte sehen sich ähnlich. Erst die Beschriftung sagt, welche es ist.</Mixup>
    </Card>
  </Abschnitt>;
}

/* ---------- Aufgabe 3 ---------- */
export function Verstehen3() {
  return <Abschnitt id="g3" n={3} titel="Wie lange dauert der Fragebogen?" frage="Wie lange brauchen die Befragten für den Fragebogen?"
    ziel="ein Histogramm der Bearbeitungsdauer mit begründetem Ausschnitt und passender Kistenbreite."
    weg={[
      ['Schritt 1', '#a3-p', 'Erst festlegen: Wie lange braucht die Hälfte höchstens?', 'k3-kennzahlen'],
      ['Schritt 2', '#a3-1', 'Kennzahlen ansehen', 'k3-kennzahlen'],
      ['Schritt 3', '#a3-2', 'Histogramm ohne Angaben: Kisten', 'k3-histogramm'],
      ['Schritt 3', '#a3-2', 'warum das erste Bild fast leer aussieht', 'k3-erstes'],
      ['Schritt 4', '#a3-3', 'Extreme abschneiden: wie viele bleiben?', 'k3-kisten'],
      ['Schritt 5', '#a3-4', 'Kistenbreite einstellen', 'k3-breite'],
      ['Schritt 6', '#a3-5', 'Ergebnis festhalten: Median, eine Säule, wie viele bleiben, Spitzen', 'k3-breite'],
    ]}>

    <Card id="k3-kennzahlen" title="Erst die Kennzahlen: was describe() verrät" badge={<Bezug href="#a3-1">zu Schritt 1 und 2</Bezug>} tag={{ kind: 'interpret', label: 'Hintergrund' }}>
      <p className="lead"><code>xt10</code> ist die Bearbeitungsdauer in Minuten. <code>describe()</code> aus Sitzung 3 gibt dir dazu Mittelwert, Median und Spannweite.</p>
      <Code k="a3d" />
      <p>Deine Festlegung in Schritt 1 fragt: Wie viele Minuten braucht die Hälfte der Befragten höchstens? Das ist der <b>Median</b>: Die eine Hälfte braucht so lange oder kürzer, die andere länger. In der Ausgabe steht er in der Spalte Median.</p>
      <Frage>Warum lohnt der Blick auf die Kennzahlen, bevor du zeichnest?</Frage>
      <p>Weil sie dir sagen, was dich im Bild erwartet. Die <b>Spannweite</b> (Range: größter minus kleinster Wert) ist riesig: Einzelne Bögen lagen wochenlang herum, der längste über 61.000 Minuten. Der Mittelwert wird von diesen Bögen nach oben gezogen, der Median kaum. Liegen beide weit auseinander, ist das ein Zeichen für einen langen Auslauf nach rechts.</p>
      <Mixup>R schreibt Kommazahlen mit Punkt. 65.000 heißt in der Ausgabe 65 Minuten, nicht fünfundsechzigtausend.</Mixup>
    </Card>

    <Card id="k3-histogramm" title="Viele Werte: Steine in Kisten (Histogramm)" badge={<Bezug href="#a3-2">zu Schritt 3</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Bei der Dauer gibt es Hunderte verschiedene Werte. Ein Stapel pro Minute wäre unübersichtlich. Darum sammelt man die Steine in <b>Kisten</b>, zum Beispiel alle von 20 bis 24 in eine. Am Alter siehst du, was die Kistenbreite mit dem Bild macht.</p>
      <Histogram />
      <Leseart>Am dichtesten besetzt sind die Jahre von 50 bis 64. Unter 30 und über 80 sind es deutlich weniger. Die Form ist breit und läuft auf keiner Seite lang aus: grob symmetrisch.</Leseart>
      <InShort>Ein <b>Histogramm</b> zeigt eine Variable mit vielen Werten. Jede Säule ist eine Kiste, eine <b>Klasse</b>, und zählt, wie viele Werte hineinfallen. Balken nimmst du für wenige Stufen, das Histogramm für viele Werte.</InShort>
      <Mixup>Wenn du die Kisten breiter machst, werden die Säulen höher, weil mehr Werte hineinfallen. Die Menschen sind dieselben, nur anders sortiert.</Mixup>
    </Card>

    <Card id="k3-erstes" title="Warum das erste Histogramm fast nichts zeigt" badge={<Bezug href="#a3-2">zu Schritt 3</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">In Schritt 3 zeichnest du das Histogramm ohne weitere Angaben. Heraus kommt eine einzige hohe Säule ganz links und sonst fast nichts.</p>
      <Code k="a3o" />
      <Frage>Was ist da passiert?</Frage>
      <p>Ein Histogramm reicht vom kleinsten bis zum größten Wert. Ohne Angabe teilt R diese Strecke in 30 Kisten. Reicht die Strecke bis über 61.000 Minuten, ist jede Kiste rund 2.000 Minuten breit, und fast alle Bögen landen in der ersten. Die wenigen Bögen weit draußen bestimmen also das ganze Bild.</p>
      <Frage>Und die zwei Meldungen von R?</Frage>
      <p>„<code>stat_bin()</code> using <code>bins = 30</code>. Pick better value with <code>binwidth</code>.“ sagt: R hat selbst 30 Kisten gewählt und schlägt vor, die Breite festzulegen. „Removed 220 rows“ sagt, dass 220 Bögen keine Dauer haben (alle auf Papier) und in keinem Bild auftauchen können. Beides sind Hinweise, keine Fehler.</p>
    </Card>

    <Card id="k3-kisten" title="Extreme abschneiden: ein Ausschnitt" badge={<Bezug href="#a3-3">zu Schritt 4</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Damit man etwas sieht, wählt Schritt 4 einen Ausschnitt: <code>filter(xt10 &lt;= 180)</code> behält nur Bögen bis drei Stunden.</p>
      <AufgabenBild k="filter180" />
      <Code k="a3n" />
      <Frage>Wie viele bleiben, und wer fällt weg?</Frage>
      <p>Wie viele Bögen bleiben, steht in der Spalte <b>N</b>. Weggefallen sind zwei Gruppen: die Bögen über 180 Minuten und die 220 Bögen ohne Dauer, denn bei ihnen kann R nicht prüfen, ob sie unter 180 liegen.</p>
      <Frage>Darf man das?</Frage>
      <p>Ja, wenn man es sagt. Der Ausschnitt ist eine Entscheidung, und sie gehört in die Bildunterschrift: „nur Bögen bis 180 Minuten, n = …“. Ab jetzt rechnest du mit weniger Bögen; Median und Mittelwert sind andere als in Schritt 2.</p>
    </Card>

    <Card id="k3-breite" title="Kistenbreite einstellen" badge={<Bezug href="#a3-4">zu Schritt 5 und 6</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Schritt 5 lässt dich verschiedene Kistenbreiten ausprobieren: 5, 30 und 1.</p>
      <AufgabenBild k="binwidth" />
      <Code k="a3m" />
      <Frage>Welche Kistenbreite ist die richtige?</Frage>
      <p>Es gibt keine einzig richtige. Sind die Kisten zu schmal, wird das Bild zappelig, und Zufall sieht aus wie ein Muster. Sind sie zu breit, verschwindet die Form. Man probiert mehrere Breiten und nimmt die, bei der die Form ruhig, aber noch erkennbar ist. <code>binwidth = 5</code> heißt: je 5 Minuten eine Kiste; <code>boundary = 0</code> lässt die Kisten bei 0, 5, 10 beginnen.</p>
      <Mixup><code>binwidth = 30</code> heißt Kisten von 30 Minuten Breite, nicht 30 Kisten wie in der Meldung aus Schritt 3.</Mixup>
      <Frage>Was zeigt sich bei ganz schmalen Kisten?</Frage>
      <p>Bei <code>binwidth = 1</code> hat jede Minute ihre eigene Säule. Dann fällt auf, ob Menschen runden: Wer die Dauer schätzt, schreibt eher eine runde Zahl als eine krumme. Solche Spitzen sind keine Eigenschaft des Fragebogens, sondern der Art, wie gemessen wurde. Genau darum geht es weiter in Aufgabe 4.</p>
      <Frage>Und wo steht was für Schritt 6?</Frage>
      <p>Den Median erklärt <a href="#k3-kennzahlen">Erst die Kennzahlen</a>, die eine hohe Säule <a href="#k3-erstes">Warum das erste Histogramm fast nichts zeigt</a>, wie viele Bögen bleiben <a href="#k3-kisten">Extreme abschneiden</a>, die Spitzen diese Karte.</p>
    </Card>
  </Abschnitt>;
}

/* ---------- Aufgabe 4 ---------- */
export function Verstehen4() {
  return <Abschnitt id="g4" n={4} titel="Papier, online oder Interview?" frage="Dauert das Ausfüllen auf Papier länger als online?"
    ziel="eine begründete Antwort, auf welchem Weg das Ausfüllen am längsten dauert, und weißt, wer dabei im Bild fehlt."
    weg={[
      ['Schritt 1', '#a4-p', 'Erst festlegen: Auf welchem Weg dauert es am längsten?', 'k4-wege'],
      ['Schritt 2 und 3', '#a4-1', 'einen Boxplot lesen', 'k4-lineal'],
      ['Schritt 2', '#a4-1', 'Hineinzoomen', 'k4-zoom'],
      ['Schritt 3', '#a4-2', 'Abschneiden', 'k4-zoom'],
      ['Schritt 4', '#a4-3', 'Zahlen je Weg vergleichen', 'k4-zahlen'],
      ['Schritt 5', '#a4-4', 'Ergebnis festhalten: warum sich die Reihenfolge dreht', 'k4-zahlen'],
    ]}>

    <Card id="k4-wege" title="Drei Wege, ein Fragebogen" badge={<Bezug href="#a4-p">zu Schritt 1</Bezug>} tag={{ kind: 'interpret', label: 'Hintergrund' }}>
      <p className="lead">Der ALLBUS 2023 wurde auf drei Wegen erhoben, gespeichert in <code>mode</code>: <b>CAPI</b> (2) Interview mit Laptop, <b>CAWI</b> (3) online, <b>MAIL</b> (4) Papier per Post.</p>
      <Frage>Warum sollte das Ausfüllen auf verschiedenen Wegen verschieden lange dauern?</Frage>
      <p>Im Interview führt jemand durch den Bogen. Online und auf Papier füllt man allein aus, kann unterbrechen und später weitermachen. Einzelne Bögen lagen wochenlang herum, der längste über 61.000 Minuten.</p>
      <Frage>Was steckt außerdem in den Daten?</Frage>
      <ul className="v-liste">
        <li>71,5 % der Papier-Angaben sind Vielfache von 5 (Interview 39,5 %, online 20 %). Auf Papier wurde die Dauer also vermutlich oft geschätzt.</li>
        <li>Bei 220 Papierbögen fehlt die Dauer ganz. Sie fehlen in jedem Bild und jeder Kennzahl.</li>
        <li>Damit man in der Grafik etwas sieht, braucht es einen Ausschnitt. Dafür gibt es zwei Wege, und sie führen zu verschiedenen Ergebnissen (Schritt 2 und 3).</li>
      </ul>
      <InShort>Wie gemessen wurde, gehört zur Antwort. Ein Vergleich der Wege vergleicht auch verschiedene Arten zu messen.</InShort>
    </Card>

    <Card id="k4-lineal" title="Mitte und Streuung: vom Lineal zum Boxplot" badge={<Bezug href="#a4-1">zu Schritt 2 und 3</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Elf Befragte nennen ihre Wochenarbeitsstunden. Jede Person steht auf dem Lineal an ihrer Stundenzahl. Geh die Schritte durch; die letzten zwei zeigen, was Ausreißer und Weglassen mit der Mitte machen.</p>
      <LinealZumBoxplot />
      <h6 className="zwischen">So sieht ein echter Boxplot aus</h6>
      <p className="unter-zwischen">Das Alter der Befragten im Westen und im Osten, gezeichnet aus allen 5.223 Altersangaben.</p>
      <AgeBoxplot />
      <Leseart>Der Median liegt im Osten 3 Jahre höher (56 statt 53), auch beide Kastenränder liegen höher. Die Kästen sind fast gleich lang: Das Alter streut in beiden Gruppen ähnlich stark.</Leseart>
      <InShort>Der <b>Mittelwert</b> ist der Schwerpunkt, der <b>Median</b> steht in der Mitte der Reihe. Der <b>Boxplot</b> zeigt die mittlere Hälfte als Kasten, den Median als Strich und den Rest als Antennen (Whisker) und Punkte.</InShort>
      <MoreDetail summary="Streuung, Voraussetzungen und Rechenweise">
        <p><b>Streuung</b> sagt, wie weit die Werte auseinanderliegen. Die <b>Spannweite</b> ist größter minus kleinster Wert (45 − 22 = 23 Stunden). Der <b>Interquartilsabstand</b> ist die Länge des Kastens (43 − 34 = 9 Stunden); er reagiert kaum auf Ausreißer.</p>
        <p><b>Voraussetzung:</b> Einen Mittelwert darfst du berechnen, wenn die Abstände zwischen den Werten gleich viel bedeuten (metrisch, etwa Minuten oder Alter). Bei schiefen Verteilungen und Ausreißern gehören Mittelwert und Median beide in den Bericht.</p>
        <p>mariposa und ggplot berechnen Quartile bei manchen Daten leicht unterschiedlich. Bei diesen elf Personen kommt in beiden 34 und 43 heraus.</p>
      </MoreDetail>
      <Mixup>Der Strich im Kasten ist der Median, nicht der Mittelwert. Und ein breiterer Abschnitt heißt nicht „mehr Leute“: In jedem Viertel stehen gleich viele Personen, sie liegen nur weiter auseinander.</Mixup>
    </Card>

    <Card id="k4-zoom" title="Hineinzoomen oder abschneiden?" badge={<Bezug href="#a4-1">zu Schritt 2 und 3</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">Schritt 2 und 3 zeichnen fast dieselbe Grafik. In Schritt 3 steht <code>filter(xt10 &lt;= 180)</code> vor <code>ggplot()</code>, dafür fällt <code>coord_cartesian()</code> weg.</p>
      <Code k="a4" />
      <Code k="a4f" />
      <p><code>to_label(mode)</code> schreibt CAPI, CAWI und MAIL statt 2, 3 und 4 unter die Kästen, wie bei der Gesundheit in Aufgabe 1 (<a href="#k1-woerter">Zahlen oder Wörter</a>). Die markierte 180 in Schritt 2 legt fest, bis wohin das Bild reicht.</p>
      <AufgabenBild k="zoomFilter" />
      <Frage>Warum liegt der Strich im Kasten danach an einer anderen Stelle?</Frage>
      <p><code>coord_cartesian(ylim = c(0, 180))</code> ist eine Lupe: Das Bild zeigt nur 0 bis 180 Minuten, gerechnet wird aber mit <b>allen</b> Bögen. Median und Kasten bleiben, wo sie sind. <code>filter(xt10 &lt;= 180)</code> wirft die langen Bögen hinaus, <b>bevor</b> gerechnet wird. Am oberen Ende fehlen dann Personen, und die Mitte rutscht nach unten, genau wie im letzten Schritt am Lineal.</p>
      <Frage>Welche Grafik ist die richtige?</Frage>
      <p>Beide rechnen richtig, aber sie beantworten verschiedene Fragen. Die Lupe zeigt die Mitte <b>aller</b> Bögen. Der Filter zeigt die Mitte nur der Bögen bis drei Stunden, und wer herausfällt, verschiebt das Ergebnis. Welche ihr druckt und was dann in die Bildunterschrift muss, besprecht ihr im Plenum.</p>
    </Card>

    <Card id="k4-zahlen" title="Zahlen je Weg: describe() mit show" badge={<Bezug href="#a4-3">zu Schritt 4 und 5</Bezug>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">Die Grafik zeigt die Lage, die Zahlen machen sie genau. Schritt 4 rechnet für einen Weg Median und Quartile aus, einmal mit allen Bögen und einmal nur bis 180 Minuten.</p>
      <Code k="a4z" />
      <Code k="a4zf" />
      <Frage>Was bedeuten die Teile der Kette?</Frage>
      <ul className="v-liste">
        <li><code>filter(mode == 4)</code> behält nur einen Weg: 2 = CAPI, 3 = CAWI, 4 = MAIL. Das doppelte Gleichheitszeichen fragt „ist gleich?“.</li>
        <li><code>show =</code> wählt, welche Kennzahlen <code>describe()</code> zeigt. <b>Q25</b> ist das untere Quartil (Q1), <b>Q75</b> das obere (Q3): die Ränder des Kastens.</li>
        <li>Das Komma in <code>filter(mode == 4, xt10 &lt;= 180)</code> heißt „und“: Beides muss stimmen.</li>
        <li>Neben Median und Quartilen zeigt <code>describe()</code> immer <b>N</b> (wie viele Bögen zählen) und <b>Missing</b> (bei wie vielen die Angabe fehlt).</li>
      </ul>
      <Frage>Warum einmal ohne und einmal mit Filter?</Frage>
      <p>Weil du so siehst, wie stark der Ausschnitt das Ergebnis verschiebt. Ändert sich der Median kaum, ist deine Aussage robust. Ändert er sich deutlich, gehört der Ausschnitt in jede Aussage über die Dauer.</p>
      <Frage>Warum kann sich die Reihenfolge der Wege drehen?</Frage>
      <p>Weil der Filter die Wege nicht gleich stark trifft. Vergleiche N je Weg ohne und mit Filter: Wo viele lange Bögen herausfallen, rutscht der Median weit nach unten, wo kaum einer herausfällt, bleibt er fast stehen. Das ist dasselbe wie im letzten Schritt am Lineal, nur mit Tausenden Bögen.</p>
    </Card>
  </Abschnitt>;
}

/* ---------- Überblick ---------- */
export function Ueberblick() {
  return <section className="grund-block" id="g5" aria-labelledby="g5-h">
    <div className="g-kopf">
      <span className="st m c7" aria-hidden="true">✓</span>
      <div><div className="ueber">Überblick über alle Aufgaben</div><h4 id="g5-h">Welche Grafik für welche Frage?</h4></div>
    </div>
    <p className="g-intro">In den vier Aufgaben hast du drei Grafiken gezeichnet. Hier steht, nach welcher Regel man sie wählt und wo jede täuschen kann.</p>
    <HeadingLevel.Provider value={5}>
      <Card id="k5-wahl" title="Zwei Fragen entscheiden" badge={<Badge>Balken, Histogramm, Boxplot</Badge>} tag={{ kind: 'interpret', label: 'Hintergrund' }}>
        <p className="lead">Die Form der Grafik ergibt sich aus zwei Fragen: <b>Wie viele Variablen</b> zeigst du? Und hat jede <b>wenige Stufen</b> oder <b>viele Werte</b>?</p>
        <DecisionTree />
        <Frage>Wie passt das zu den Aufgaben?</Frage>
        <ul className="v-liste">
          <li>Aufgabe 1: eine Variable mit wenigen Stufen (Gesundheit, fünf Stufen) → <b>Balken</b>.</li>
          <li>Aufgabe 3: eine Variable mit vielen Werten (Dauer in Minuten) → <b>Histogramm</b>.</li>
          <li>Aufgabe 4: viele Werte (Dauer) und Gruppen (Erhebungsweg) → <b>Boxplots</b>. Die Gruppe zählt als zweite Variable.</li>
        </ul>
        <InShort>Zähl erst die Variablen, dann ihre Stufen. Wie viele Stufen eine Variable hat und was ihre Zahlen bedeuten, nennt man ihr <b>Skalenniveau</b>.</InShort>
        <MoreDetail summary="nominal, ordinal, metrisch">
          <ul>
            <li><b>Nominal:</b> Kategorien ohne Reihenfolge, etwa der Familienstand.</li>
            <li><b>Ordinal:</b> Kategorien mit Reihenfolge, aber ohne gleich große Abstände, etwa die Gesundheit von „sehr gut“ bis „schlecht“.</li>
            <li><b>Metrisch:</b> Zahlen mit gleich großen Abständen, etwa Alter oder Minuten.</li>
          </ul>
          <p>Die Lebenszufriedenheit (0 bis 10) liegt dazwischen: Man berechnet einen Mittelwert, zeigt sie aber als Balken, weil jede der elf Stufen für sich zählt.</p>
        </MoreDetail>
        <div className="box-gruen">
          <h6>Was jede Grafik braucht und wo sie täuschen kann</h6>
          <table className="daten voll">
            <caption className="sr-only">Voraussetzungen je Grafik</caption>
            <thead><tr><th scope="col">Grafik</th><th scope="col">braucht</th><th scope="col">Vorsicht</th></tr></thead>
            <tbody>
              <tr><td>Balken</td><td>eine Variable mit wenigen Stufen</td><td>Prozent von wem? Gültige Antworten nehmen, fehlende nennen. Achse ab 0.</td></tr>
              <tr><td>Histogramm</td><td>eine Variable mit vielen Werten</td><td>Kistenbreite und Ausschnitt verändern das Bild. Beides nennen.</td></tr>
              <tr><td>Boxplots</td><td>viele Werte und Gruppen</td><td>n je Gruppe nennen. Wer weggelassen oder abgeschnitten wird, verändert den Vergleich.</td></tr>
              <tr><td>Balken auf 100 %</td><td>zwei Variablen mit wenigen Stufen</td><td>Versteckt, wie groß die Gruppen sind. n dazuschreiben.</td></tr>
              <tr><td>Punkte</td><td>zwei Variablen mit vielen Werten</td><td>Bei wenigen Stufen liegen Punkte übereinander. <code>geom_jitter()</code> streut sie leicht.</td></tr>
            </tbody>
          </table>
          <p className="box-notiz">Die letzten zwei Zeilen brauchst du in den Aufgaben nicht; sie zeigen, wie es weitergeht. Für alle gilt: Filtern und Weglassen ändern das Ergebnis. Sag immer, wer im Bild fehlt.</p>
        </div>
        <Mixup>Eine Zahl im Datensatz macht eine Variable nicht metrisch. Beim Familienstand stehen Zahlen für „verheiratet“, „ledig“ und so weiter; rechnen kannst du damit nichts.</Mixup>
      </Card>
    </HeadingLevel.Provider>
  </section>;
}

/* ---------- Themen für den Reiter „Verstehen“ (Reihenfolge, Karten für die rechte Leiste) ---------- */
export const THEMEN: Thema[] = [
  { id: 'vorweg', n: 'R', kurz: 'R lesen', titel: 'Vorweg: R lesen', minuten: 10, Inhalt: Vorweg,
    karten: [['r1', 'Startblock, Zeile, Kette'], ['r2', 'Eine Grafik entsteht in Schichten']] },
  { id: 'g1', n: '1', kurz: 'Aufgabe 1', titel: 'Gesundheit zeigen', minuten: 15, Inhalt: Verstehen1, aufgabe: 1,
    karten: [['k1-verteilung', 'Worum es geht: eine Verteilung'], ['k1-stapel', 'Vom Turm zum Stapel'], ['k1-woerter', 'Zahlen oder Wörter: to_label()'], ['k1-na', 'Fehlende Werte und n'], ['k1-kette', 'Die Kette lesen'], ['k1-achse', 'Achse und Bildunterschrift'], ['k1-ergebnis', 'Ergebnis festhalten']] },
  { id: 'g2', n: '2', kurz: 'Aufgabe 2', titel: 'Der Rätselkasten', minuten: 10, Inhalt: Verstehen2, aufgabe: 2,
    karten: [['k2-formen', 'Woran man eine Verteilung erkennt'], ['k2-labor', 'Formen-Labor'], ['k2-pruefen', 'Eine Zuordnung in R prüfen']] },
  { id: 'g3', n: '3', kurz: 'Aufgabe 3', titel: 'Wie lange dauert der Fragebogen?', minuten: 15, Inhalt: Verstehen3, aufgabe: 3,
    karten: [['k3-kennzahlen', 'Erst die Kennzahlen'], ['k3-histogramm', 'Steine in Kisten'], ['k3-erstes', 'Warum das erste Bild leer wirkt'], ['k3-kisten', 'Extreme abschneiden'], ['k3-breite', 'Kistenbreite einstellen']] },
  { id: 'g4', n: '4', kurz: 'Aufgabe 4', titel: 'Papier, online oder Interview?', minuten: 15, Inhalt: Verstehen4, aufgabe: 4,
    karten: [['k4-wege', 'Drei Wege, ein Fragebogen'], ['k4-lineal', 'Vom Lineal zum Boxplot'], ['k4-zoom', 'Hineinzoomen oder abschneiden?'], ['k4-zahlen', 'Zahlen je Weg']] },
  { id: 'g5', n: '✓', kurz: 'Überblick', titel: 'Welche Grafik für welche Frage?', minuten: 5, Inhalt: Ueberblick,
    karten: [['k5-wahl', 'Zwei Fragen entscheiden']] },
];

/* Bilder für die ausgebauten „?“-Fenster in den Aufgaben (Engine: denk(…, { bild: Name })). */
export const BILDER = { TurmZumStapel, AchseVergleich, LinealZumBoxplot, Shapes };
