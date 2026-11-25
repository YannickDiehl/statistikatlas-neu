// Sitzung 4 „Daten sehen“: die vier Grundlagen und der Überblick aus prototyp/sitzung4.html (v11), ohne R-Code.
import { Badge, Card, InShort, Mixup, MoreDetail } from '../blocks/Card';
import { Begriff } from '../Begriff';
import { Foundation } from '../blocks/Foundation';
import { Questions } from '../blocks/Questions';
import { V2_Q, V3_Q, V4_Q2, V4_Q2_WRONG } from './content';
import { AgeBoxplot } from './figures/AgeBoxplot';
import { AxisStart } from './figures/AxisStart';
import { ChoiceCheck } from './figures/ChoiceCheck';
import { Assignment, DecisionTree } from './figures/DecisionTree';
import { Histogram } from './figures/Histogram';
import { RulerBoxplot } from './figures/RulerBoxplot';
import { ShapeLab, Shapes } from './figures/ShapeLab';
import { Sketch } from './figures/Sketch';
import { TowerToStack } from './figures/TowerToStack';

/** Grundlage 1: Balken und Häufigkeiten (1a Erst schätzen, 1b Vom Turm zum Stapel, 1c Achse und Bildunterschrift). */
export function Foundation1() {
  return <Foundation id="g1" n={1} title="Balken und Häufigkeiten" taskHref="#a1"
    intro="Was zeigt ein Balkendiagramm, und wann übertreibt es? Drei kurze Schritte, etwa 15 Minuten.">

    <Card id="v1" step="1a" title="Erst schätzen, dann schauen" tag={{ kind: 'estimate', label: 'Schätzen' }}>
      <p className="lead">Der ALLBUS 2023 hat über 5.000 Menschen gefragt: <em>„Wie zufrieden sind Sie gegenwärtig, alles in allem, mit Ihrem Leben?“</em> Geantwortet wird von 0 (ganz unzufrieden) bis 10 (ganz zufrieden). Bevor du die Daten siehst: Wie, glaubst du, verteilen sich die Antworten?</p>
      <Sketch />
      <InShort>Eine <Begriff id="verteilung">Verteilung</Begriff> zeigt, wie viele Menschen welchen Wert angegeben haben. Der häufigste Wert heißt <Begriff id="modus">Modus</Begriff>, im Bild ist er der Gipfel. Eine Verteilung zeigt die ganze Form der Antworten, nicht nur eine Zahl.</InShort>
      <MoreDetail summary="Warum erst schätzen, und warum nicht gleich den Mittelwert?">
        <p>Der Mittelwert der Lebenszufriedenheit liegt bei 7,36. Diese eine Zahl verrät dir nicht, dass 8 die häufigste Antwort ist, und auch nicht, dass fast niemand ganz unten antwortet. Darum schaut man sich vor jeder Kennzahl die Verteilung an.</p>
        <p>Das Schätzen hat einen eigenen Zweck: Wer vorher eine Erwartung festlegt, merkt, wo das eigene Bild von der Gesellschaft danebenliegt. Häufig liegt der geschätzte Modus bei 5 oder 6, also deutlich unter dem, was die Befragten tatsächlich sagen.</p>
        <p>Die Zahlen sind <Begriff id="gewichte">ungewichtet</Begriff>: Jede Person zählt gleich viel. Gewichtet ändert sich wenig (Mittelwert 7,40). Gewichtung ist Thema in Sitzung 6.</p>
      </MoreDetail>
    </Card>

    <Card id="v2" step="1b" title="Von der Variable zum Balken: Häufigkeiten zählen" badge={<Badge>Tabelle: kennst du aus Sitzung 3, Balken: neu</Badge>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">In R ist jede <Begriff id="variable">Variable</Begriff> eine Spalte, im Bild ein Turm: Jeder Stein darin ist der <Begriff id="wert">Wert</Begriff> einer Person. Hier siehst du die Variable <code>ls01</code> von 21 Befragten. Eine Person hat nicht geantwortet: Ihr Platz ist ein leerer Stein, ein <Begriff id="fehlende-werte">fehlender Wert</Begriff> (<code>NA</code>). Sortier die Steine nach ihrem Wert und leg gleiche Werte aufeinander.</p>
      <TowerToStack />
      <div className="formel" role="group" aria-label="Formel für die relative Häufigkeit">
        <span><b>Anteil</b> eines Werts</span><span aria-hidden="true">=</span>
        <span className="frac" aria-hidden="true"><span>Steine im Stapel</span><span>alle gültigen Steine</span></span><span aria-hidden="true">=</span>
        <span className="frac" aria-hidden="true"><span>1.506</span><span>5.164</span></span><span aria-hidden="true">≈</span><span className="gross" aria-hidden="true">29 %</span>
        <span className="sr-only">Anteil eines Werts gleich Steine im Stapel geteilt durch alle gültigen Steine. Für den Wert 8: 1.506 geteilt durch 5.164, also etwa 29 Prozent.</span>
      </div>
      <div className="kurzueberlegen">
        <p>Kurz überlegen</p>
        <Questions id="v2-q" questions={[V2_Q]} />
      </div>
      <InShort>Ein <Begriff id="balkendiagramm">Balkendiagramm</Begriff> zeigt gezählte Antworten, im Bild als Stapel. Die Länge eines Balkens ist die <Begriff id="absolute-haeufigkeit">absolute Häufigkeit</Begriff>, in der Tabelle aus Sitzung 3 die Spalte N. Der Anteil an allen gültigen Antworten ist die <Begriff id="relative-haeufigkeit">relative Häufigkeit</Begriff> (Valid %).</InShort>
      <MoreDetail summary="Tabelle und Balken in R">
        <p>Die Tabelle dazu kennst du aus Sitzung 3: <code>allbus %&gt;% frequency(ls01)</code>. Die Spalte <b>N</b> ist die Höhe der Stapel (für die 8: 1.506), <b>Valid %</b> ihr Anteil an den 5.164 gültigen Antworten (29,16 %). Die 82 Personen ohne gültige Antwort stehen unter „Total missing“ und liegen auf keinem Stapel.</p>
        <p>Neu ist der Schritt ins Bild: <code>geom_bar()</code> zählt die Steine selbst. Du gibst ihm keine Tabelle, sondern den Datensatz, und sagst mit <code>aes(x = ls01)</code>, welche Variable gezählt wird. So siehst du es in <a href="#r2">Vorweg: „Eine Grafik entsteht in Schichten“</a> und in <a href="#a1">Aufgabe 1</a>.</p>
      </MoreDetail>
      <Mixup>Die y-Achse von <code>geom_bar()</code> zeigt Anzahlen (<code>count</code>), keine Prozent. Wer beim Wert 8 „29 %“ sucht, findet dort 1.506. Die Form der Balken ist dieselbe.</Mixup>
    </Card>

    <Card id="v7" step="1c" title="Ehrlich zeigen: Achse und Bildunterschrift" tag={{ kind: 'interpret', label: 'Deuten' }} companion="hinweis">
      <p className="lead">Mittlere Lebenszufriedenheit im Westen: 7,44, im Osten: 7,18. Der Unterschied ist klein. Eine Grafik kann ihn trotzdem riesig aussehen lassen, ohne dass eine Zahl falsch ist.</p>
      <AxisStart />
      <InShort>Bei Balken liest das Auge die <b>Länge</b>. Deshalb beginnen Balken bei 0. Wer die Achse abschneidet, lässt kleine Unterschiede riesig aussehen, ohne dass eine Zahl falsch ist. Wer abweicht, sagt es in der Bildunterschrift.</InShort>
      <div className="box-gruen">
        <h6>Das gehört in jede Bildunterschrift</h6>
        <ul><li>Quelle: ALLBUS 2023</li><li>wie viele: n = 3.510 (West) und 1.654 (Ost)</li><li>gewichtet oder ungewichtet</li><li>wenn die Achse nicht bei 0 beginnt: ausdrücklich sagen</li></ul>
      </div>
      <Mixup>„Doppelt so lang“ heißt nicht „doppelt so zufrieden“. Wie lang ein Balken wirkt, hängt davon ab, wo die Achse beginnt. Verglichen werden im Bild Längen, nicht Zufriedenheit.</Mixup>
    </Card>
  </Foundation>;
}

/** Grundlage 2: Formen von Verteilungen (2a vier echte Formen und das Formen-Labor). */
export function Foundation2() {
  return <Foundation id="g2" n={2} title="Formen von Verteilungen" taskHref="#a2"
    intro="Woran erkennt man eine Verteilung auf einen Blick? Etwa 10 Minuten.">
    <Card id="v3" step="2a" title="Welche Formen kann eine Verteilung haben?" tag={{ kind: 'picture', label: 'Im Bild' }} companion="uebung">
      <p className="lead">Verteilungen haben typische Formen. Wer sie erkennt, kann eine Grafik in Sekunden lesen. Hier sind vier echte Beispiele aus dem ALLBUS 2023. Das Dreieck zeigt den Mittelwert, der gestrichelte Strich den Median (mehr dazu in Grundlage 4).</p>
      <p className="hilfe-zeile">Jede Säule hat mindestens einen Stein, auch wenn nur wenige Personen dahinterstehen. Die genauen Zahlen stehen unter jedem Bild für den Screenreader und in „Genauer erklärt“.</p>
      <Shapes />
      <h6 className="zwischen">Formen-Labor</h6>
      <p className="unter-zwischen">Verändere die Form und beobachte, wohin Mittelwert und Median wandern. 40 Steine, Werte 0 bis 10.</p>
      <ShapeLab />
      <InShort>Die <Begriff id="schiefe">Schiefe</Begriff> sagt, ob eine Verteilung zu einer Seite flach ausläuft. Eine Verteilung heißt nach der Seite, auf der sie <b>ausläuft</b>, nicht nach ihrem Modus. Der Mittelwert wird vom langen Ausläufer mitgezogen, der Median kaum.</InShort>
      <div className="kurzueberlegen">
        <Questions id="v3-q" questions={[V3_Q]} />
      </div>
      <p className="absatz"><b>Was die Form über die Frage verrät:</b> Zähl die <Begriff id="auspraegung">Ausprägungen</Begriff> (fünf, sieben, zehn oder sehr viele Werte), such den Modus und achte auf Häufungen. Bei offenen Zahlenangaben runden Menschen, dann ragen runde Werte wie 40 heraus.</p>
      <MoreDetail summary="Schiefe als Zahl und was die Form inhaltlich bedeutet">
        <p><code>describe()</code> aus mariposa gibt die Schiefe als Zahl aus (<em>Skewness</em>). Negativ heißt linksschief (Lebenszufriedenheit: −1,07), positiv heißt rechtsschief, nahe 0 heißt ungefähr symmetrisch. Als grobe Faustregel gilt ein Betrag unter 0,5 als ungefähr symmetrisch.</p>
        <p><b>Aber Vorsicht:</b> Die Schiefe als Zahl sieht keine Gipfel. Die Leihmutterschaft hat eine Schiefe von +0,28 und wäre nach der Faustregel symmetrisch, obwohl sie deutlich <Begriff id="mehrgipflig">mehrgipflig</Begriff> ist. Darum gilt: erst anschauen, dann rechnen. (Im Datensatz ist <code>vm18</code> als 1 bis 7 gespeichert; −3 entspricht 1.)</p>
        <p>Die Form ist eine inhaltliche Aussage: Linksschief heißt hier, dass die meisten zufrieden sind und wenige sehr unzufrieden. Mehrgipflig heißt oft, dass eine Gesellschaft bei einer Frage gespalten ist. Ein Mittelwert allein würde dann Einigkeit vortäuschen, wo es keine gibt.</p>
        <p>Bei schiefen Verteilungen berichtest du den Median mit, weil der Mittelwert in Richtung des Ausläufers gezogen wird.</p>
      </MoreDetail>
      <Mixup>„Linksschief“ heißt nicht „die meisten sind links“. Bei der Lebenszufriedenheit stehen die meisten rechts. Die Verteilung läuft nur links flach aus.</Mixup>
    </Card>
  </Foundation>;
}

/** Grundlage 3: Viele Werte, das Histogramm (3a Steine in Kisten). */
export function Foundation3() {
  return <Foundation id="g3" n={3} title="Viele Werte: das Histogramm" taskHref="#a3"
    intro="Wie zeigt man eine Variable mit sehr vielen Werten, und was macht die Klassenbreite? Etwa 10 Minuten.">
    <Card id="v5" step="3a" title="Viele Werte: Klassen im Histogramm" tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Beim Alter gibt es 79 verschiedene Werte, von 18 bis 99 Jahren. Das Alter ist <Begriff id="diskret-stetig">stetig</Begriff>: Zwischen zwei Jahren wäre jeder Wert möglich. Ein Balken pro Jahr wäre unübersichtlich. Darum zeichnet man ein <Begriff id="histogramm">Histogramm</Begriff>. Es fasst die Werte in <Begriff id="klasse">Klassen</Begriff> zusammen, zum Beispiel alle von 20 bis 24 Jahren (im Bild: eine Kiste). Verändere die Klassenbreite und schau, wie sich das Bild verändert.</p>
      <Histogram />
      <div className="leseart"><p><b className="t">So liest du das:</b> Am dichtesten besetzt sind die Jahre von 50 bis 64, dort stehen knapp drei von zehn Befragten. Unter 30 und über 80 sind es deutlich weniger. Die Form ist breit und läuft auf keiner Seite lang aus: grob symmetrisch. Der Mittelwert (52,5) liegt etwas unter dem Median (54), die Schiefe ist aber fast 0 (−0,03). Bei breiten, flachen Verteilungen können Mittelwert und Median ein wenig auseinanderliegen, ohne dass die Verteilung schief ist.</p></div>
      <p className="absatz"><b>Werte weit draußen:</b> Ein Histogramm reicht vom kleinsten bis zum größten Wert. Liegen einzelne Werte weit draußen, landet der Rest in einer Klasse; dann hilft ein Ausschnitt, und der gehört in die Bildunterschrift.</p>
      <InShort>Ein <b>Histogramm</b> zeigt eine stetige Variable mit vielen Werten. Jede Säule steht für eine <b>Klasse</b> und zählt, wie viele Werte hineinfallen. Für <b>diskrete</b> Variablen mit wenigen Ausprägungen nimmst du Balken.</InShort>
      <MoreDetail summary="Wie breit sollen die Klassen sein?">
        <p>Sind die Klassen zu schmal, wird das Bild zappelig, und Zufall sieht aus wie ein Muster. Sind sie zu breit, verschwindet die Form. Probier mehrere Breiten und wähl die, bei der die Form ruhig, aber noch erkennbar ist. Beim Alter sind 5 Jahre ein guter Start.</p>
        <p>In R stellst du die Breite mit <code>binwidth</code> ein, zum Beispiel <code>binwidth = 5</code>. Mit <code>boundary = 0</code> beginnen die Klassen bei 0, 5, 10 und so weiter. Was passiert, wenn du keine Breite angibst, findest du in Aufgabe 3 heraus. Zwischen den Säulen eines Histogramms gibt es keine Lücken, weil die Werte lückenlos ineinander übergehen.</p>
      </MoreDetail>
      <Mixup>Wenn du die Klassen breiter machst, werden die Säulen höher, weil mehr Werte hineinfallen. Die Menschen sind dieselben, nur anders sortiert.</Mixup>
    </Card>
  </Foundation>;
}

/** Grundlage 4: Mitte, Streuung und Boxplot (4a vom Lineal zum Boxplot, echter Boxplot). */
export function Foundation4() {
  return <Foundation id="g4" n={4} title="Mitte, Streuung und Boxplot" taskHref="#a4"
    intro="Wie liest man einen Boxplot, und was passiert mit Mittelwert und Median, wenn sich einzelne Werte ändern? Etwa 15 Minuten.">
    <Card id="v4" step="4a" title="Mitte und Streuung: vom Lineal zum Boxplot" badge={<Badge>Median: kennst du aus Sitzung 3, Boxplot: neu</Badge>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Elf Befragte nennen ihre Wochenarbeitsstunden. Jede Person steht auf dem Lineal an ihrer Stundenzahl. Geh die vier Schritte durch.</p>
      <RulerBoxplot leseart={<div className="leseart"><p><b className="t">So liest du das:</b> Der Mittelwert fällt von 37,4 auf 35,4 Stunden, der Median bleibt bei 40. Die 0 liegt jetzt so weit draußen (links von der gestrichelten Grenze), dass R sie als eigenen Punkt zeichnet: als <Begriff id="ausreisser">Ausreißer</Begriff>. Der Whisker endet bei der nächsten Person, 28 Stunden. Ein Ausreißer ist kein Fehler: Er wird markiert, nicht gelöscht.</p></div>} />
      <ChoiceCheck question={V4_Q2} wrong={V4_Q2_WRONG}
        after={<div className="leseart"><p><b className="t">So liest du das:</b> Neun Personen bleiben: 22, 28, 34, 34, 38, 40, 40, 43, 43. Die fünfte steht in der Mitte, vier links, vier rechts. Sie arbeitet 38 Stunden. Ein einzelner Ausreißer bewegt den Median kaum, das hat die Kurzarbeit null gezeigt. Wer aber Personen weglässt, verschiebt die Mitte der Reihe, und damit kann sich auch der Median verschieben.</p></div>} />
      <p className="absatz"><b>Hineinzoomen oder Abschneiden?</b> Beim Hineinzoomen zeigt die Grafik nur einen <Begriff id="achsenausschnitt">Achsenausschnitt</Begriff>, gerechnet wird weiter mit allen. Beim Abschneiden fallen Fälle vorher weg, und Median und Box ändern sich, wie eben ohne die 44 und 45 Stunden. Beides probierst du in <a href="#a4">Aufgabe 4</a> aus.</p>
      <h6 className="zwischen">So sieht ein echter Boxplot aus</h6>
      <p className="unter-zwischen">Das Alter der Befragten im Westen und im Osten, gezeichnet aus allen 5.223 Altersangaben. Jede Box fasst Tausende Personen zusammen.</p>
      <AgeBoxplot />
      <div className="leseart"><p><b className="t">So liest du das:</b> Der Median liegt im Osten 3 Jahre höher (56 statt 53), auch beide Ränder der Box liegen höher. Die Befragten im Osten sind im Mittel also etwas älter. Die Boxen sind fast gleich lang: Das Alter streut im Westen und im Osten ähnlich stark.</p></div>
      <InShort>Der <b>Mittelwert</b> ist der Schwerpunkt, der <b>Median</b> steht in der Mitte der Reihe (beides kennst du aus Sitzung 3). Neu ist der <Begriff id="boxplot">Boxplot</Begriff>: Er zeigt die mittlere Hälfte als Box, vom unteren bis zum oberen <Begriff id="quartil">Quartil</Begriff>, den Median als Linie und den Rest als <b>Whisker</b> (im Bild: Antennen) und Punkte.</InShort>
      <MoreDetail summary="Streuung, Voraussetzungen und Rechenweise">
        <p><Begriff id="streuung">Streuung</Begriff> sagt, wie weit die Werte auseinanderliegen. Die <Begriff id="spannweite">Spannweite</Begriff> ist größter minus kleinster Wert (45 − 22 = 23 Stunden). Der <Begriff id="interquartilsabstand">Interquartilsabstand</Begriff> ist die Länge der Box (43 − 34 = 9 Stunden); er reagiert kaum auf Ausreißer. Die <Begriff id="standardabweichung">Standardabweichung</Begriff> misst den typischen Abstand zum Mittelwert; sie kommt in der freien Karte Schritt für Schritt.</p>
        <p><b>Voraussetzung:</b> Einen Mittelwert darfst du berechnen, wenn die Abstände zwischen den Werten gleich viel bedeuten (<Begriff id="metrisch">metrisch</Begriff>, etwa Stunden oder Alter). Bei einer Rangfolge wie „sehr gut … schlecht“ berichtest du besser den Median. Bei schiefen Verteilungen und Ausreißern gehören beide in den Bericht.</p>
        <p><b>Wo endet ein Whisker?</b> Beim äußersten Wert, der noch innerhalb von anderthalb Boxlängen von der Box liegt. Hier: Boxlänge 9, mal 1,5 sind 13,5. Die Grenze links liegt bei 34 − 13,5 = 20,5 Stunden. Wer weiter draußen liegt, wird als Punkt gezeichnet. Mit 22 Stunden liegt niemand draußen, mit 0 Stunden schon.</p>
        <p>mariposa und ggplot berechnen Quartile bei manchen Daten leicht unterschiedlich. Bei diesen elf Personen kommt in beiden 34 und 43 heraus.</p>
      </MoreDetail>
      <Mixup>Die Linie in der Box ist der Median, nicht der Mittelwert. Und ein breiterer Abschnitt heißt nicht „mehr Leute“: In jedem Viertel stehen gleich viele Personen, sie liegen nur weiter auseinander.</Mixup>
    </Card>
  </Foundation>;
}

/** Überblick: Grafik wählen, Grenzen kennen (Entscheidungsbaum, Zuordnung, Voraussetzungen). */
export function Overview() {
  return <Foundation id="g5" n="✓" title="Grafik wählen, Grenzen kennen" eyebrow="Überblick zu allen Aufgaben"
    intro="Alle vier Themen zusammen: welche Grafik wann passt und wo sie täuschen kann.">
    <Card id="v6" step="✓" title="Welches Bild für welche Frage?" tag={{ kind: 'estimate', label: 'Zuordnen' }}>
      <p className="lead">Die Form der Grafik ergibt sich aus zwei Fragen: <b>Wie viele Variablen</b> zeigst du? Und hat jede <b>wenige Ausprägungen</b> (zum Beispiel „gar kein“ bis „großes Vertrauen“) oder <b>viele Werte</b> (zum Beispiel das Alter)?</p>
      <DecisionTree />
      <Assignment />
      <InShort>Zähl erst die Variablen, dann ihre Ausprägungen. Eine Gruppe wie Ost/West zählt mit: „Alter nach Ost und West“ sind zwei Variablen, eine mit vielen Werten und eine mit zwei Ausprägungen. Wie viele Ausprägungen eine Variable hat und was ihre Zahlen bedeuten, nennt man ihr <Begriff id="skalenniveau">Skalenniveau</Begriff>.</InShort>
      <MoreDetail summary="nominal, ordinal, metrisch">
        <ul>
          <li><b><Begriff id="nominal">Nominal</Begriff>:</b> Kategorien ohne Reihenfolge, etwa der Familienstand (verheiratet, ledig, geschieden …).</li>
          <li><b><Begriff id="ordinal">Ordinal</Begriff>:</b> Kategorien mit Reihenfolge, aber ohne gleich große Abstände, etwa das Vertrauen in Zeitungen von „gar kein“ bis „groß“.</li>
          <li><b>Metrisch:</b> Zahlen mit gleich großen Abständen, etwa Alter oder Stunden.</li>
        </ul>
        <p>Nominal und ordinal mit wenigen Ausprägungen fasst man als <b>kategorial</b> zusammen. Die Lebenszufriedenheit (0 bis 10) liegt dazwischen: Man berechnet einen Mittelwert, zeigt sie aber als Balken, weil jede der elf Ausprägungen für sich zählt. Für den Entscheidungsbaum zählt sie deshalb als „wenige Ausprägungen“.</p>
      </MoreDetail>
      <div className="box-gruen">
        <h6>Voraussetzungen: Was jede Grafik braucht und wo sie täuschen kann</h6>
        <table className="daten voll">
          <caption className="sr-only">Voraussetzungen je Grafik</caption>
          <thead><tr><th scope="col">Grafik</th><th scope="col">braucht</th><th scope="col">Vorsicht</th></tr></thead>
          <tbody>
            <tr><td>Balken</td><td>eine Variable mit wenigen Ausprägungen</td><td>Prozent von wem? Gültige Antworten (Valid %) nehmen, fehlende nennen.</td></tr>
            <tr><td>Histogramm</td><td>eine Variable mit vielen Werten (metrisch)</td><td>Klassenbreite und Ausschnitt verändern das Bild. Beides nennen.</td></tr>
            <tr><td>Boxplots</td><td>viele Werte und Gruppen</td><td>Genug Personen je Gruppe; n je Gruppe nennen. Wer weggelassen oder abgeschnitten wird, verändert den Vergleich.</td></tr>
            <tr><td>Balken auf 100 %</td><td>zwei Variablen mit wenigen Ausprägungen</td><td>Versteckt, wie groß die Gruppen sind. n dazuschreiben.</td></tr>
            <tr><td>Punkte</td><td>zwei Variablen mit vielen Werten</td><td>Bei wenigen Ausprägungen liegen Punkte übereinander. <code>geom_jitter()</code> streut sie leicht.</td></tr>
          </tbody>
        </table>
        <p className="box-notiz">Für alle gilt: Filtern und Weglassen ändern das Ergebnis. Sag immer, wer im Bild fehlt. Aussagen über ganz Deutschland brauchen eine Gewichtung, weil der Osten im ALLBUS absichtlich stärker vertreten ist (Sitzung 6).</p>
      </div>
      <Mixup>Eine Zahl im Datensatz macht eine Variable nicht metrisch. Beim Familienstand stehen Zahlen für „verheiratet“, „ledig“ und so weiter. Die Zahlen sind nur Namen; rechnen kannst du damit nichts.</Mixup>
    </Card>
  </Foundation>;
}
