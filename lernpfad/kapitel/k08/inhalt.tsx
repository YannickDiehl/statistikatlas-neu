// Kapitel 8, Reiter „Verstehen“ (Muster aus k04/KONZEPT.md): je Aufgabe erklären, was in jedem Schritt passiert und warum.
// Keine Übungen: Die „Kurz überlegen“-Fragen der bisherigen Grundlagen stehen hier als rhetorische Fragen mit Antwort.
// Karten, die aus den bisherigen Grundlagen kommen, behalten ihre IDs (v1a, v2c …); neue Karten heißen v<n>-….
import { Card, InShort, Mixup, MoreDetail, Badge } from '@atlas/chapter/blocks/Card';
import { HeadingLevel } from '@atlas/chapter/blocks/level';
import { ReadR } from '@atlas/chapter/s08/ReadR';
import { INGLE_GOALS } from '@atlas/chapter/s08/content';
import { IndexBars, IndexFormula, MeasurementError, RowMean } from '@atlas/chapter/s08/figures/Theme1';
import { AlphaCalculator, AlphaFormula, AlphaRules, CorrelationTable, ReliabilityOutput } from '@atlas/chapter/s08/figures/Theme2';
import { Reverse, ReverseLab } from '@atlas/chapter/s08/figures/Theme3';
import { Balance, Flow, Inglehart, WhichIndex } from '@atlas/chapter/s08/figures/Theme4';
import '@atlas/chapter/s08/s08.css';
import type { Thema } from '../../react/typen';
import { AlphaOhneBeispiel } from './figuren';
import { Abschnitt, Bezug, Code, Frage, Leseart } from '../../react/gemeinsam';

/* ---------- Vorweg ---------- */
export function Vorweg() {
  return <section className="grund-block" id="vorweg" aria-labelledby="vorweg-h">
    <div className="g-kopf">
      <span className="st m c7" aria-hidden="true">R</span>
      <div><div className="ueber">Vorweg, für alle Aufgaben</div><h4 id="vorweg-h">R lesen</h4></div>
    </div>
    <p className="g-intro">Alle vier Aufgaben arbeiten mit Ketten wie <code>allbus %&gt;% mutate(…) %&gt;% describe(…)</code> oder <code>allbus %&gt;% reliability(…)</code>. Hier steht, was du aus früheren Sitzungen schon kennst und was heute neu dazukommt. Die Ausgaben zur Kontrolle helfen dir, deine eigenen im Lernjournal zu vergleichen.</p>
    <HeadingLevel.Provider value={5}><ReadR /></HeadingLevel.Provider>
  </section>;
}

/* ---------- Aufgabe 1 ---------- */
export function Verstehen1() {
  return <Abschnitt id="g1" n={1} titel="Wie populistisch denken die Befragten?" frage="Wie misst man Populismus mit sieben Aussagen, und wer bekommt einen Wert?"
    ziel="für jede befragte Person einen Populismus-Wert gebildet, weißt, wie viele Befragte einen Wert bekommen, und kannst den Mittelwert in Worten deuten."
    weg={[
      ['Schritt 1', '#a1-p', 'Erst festlegen: Wo liegt der Mittelwert ungefähr?', 'v1a'],
      ['Schritt 2', '#a1-1', 'Index bilden: ein Wert je Person', 'v1b'],
      ['Schritt 3', '#a1-2', 'min_valid lockern: mindestens fünf Antworten', 'v1-streng'],
      ['Schritt 4', '#a1-3', 'Mittelwert für alle: mit Gewicht', 'v1-gewicht'],
      ['Schritt 5', '#a1-4', 'Deuten: wofür eine hohe, wofür eine niedrige Zahl steht', 'v1c'],
      ['Schritt 6', '#a1-5', 'Ergebnis festhalten: wo du was abliest', 'v1-ergebnis'],
    ]}>

    <Card id="v1a" title="Warum mehrere Fragen?" badge={<><Bezug href="#a1-p">zu Schritt 1</Bezug><Badge>Messfehler: Wiederholung aus der Vorlesung</Badge></>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Populismus kann man nicht direkt beobachten. Darum fragt der ALLBUS nicht einmal, sondern siebenmal, jedes Mal mit einer anderen Aussage. Warum das genauer misst, siehst du an einem kleineren Beispiel: den vier Fragen zu Geflüchteten (mp16 bis mp19), die du in Sitzung 1 mit <code>find_var()</code> gefunden hast.</p>
      <p className="absatz">Bringen Geflüchtete für den Sozialstaat, für die Sicherheit, für das Zusammenleben und für die Wirtschaft eher Chancen oder eher Risiken? Antworten von 1 „Risiko überwiegt“ bis 5 „Chance überwiegt“. „Risiko“ (1 oder 2) sagen beim Sozialstaat 64,9 %, bei der Sicherheit 69,2 %, beim Zusammenleben 49,4 % und bei der Wirtschaft nur 38,7 % (gewichtet). Jede Frage trifft einen anderen Ausschnitt desselben Themas.</p>
      <MeasurementError />
      <Frage>Welche Zahl beschreibt die Haltung dieser Befragten zu Geflüchteten insgesamt am besten?</Frage>
      <p>Der Mittelwert ihrer vier Antworten, hier 2,75. Mit der Wirtschaft allein wäre sie eher bei „Chance“, mit dem Sozialstaat allein eher bei „Risiko“. Jede einzelne Frage trifft nur einen Ausschnitt und enthält auch Zufall: einen schlechten Tag, eine missverstandene Formulierung. Im Mittelwert gleichen sich solche Ausrutscher teilweise aus.</p>
      <Frage>Und was heißt das für deine Festlegung in Schritt 1?</Frage>
      <p>Der Populismus-Index ist genauso ein Mittelwert, nur aus sieben Antworten je Person. Er bleibt auf der Antwortskala von 1 „stimme voll zu“ bis 5 „lehne ganz ab“ und lässt sich wie eine Antwort lesen: Ein Wert unter 3 heißt im Mittel eher Zustimmung, um 3 teils/teils, über 3 eher Ablehnung. Wo der Mittelwert über alle Befragten liegt, legst du vorher fest. Holst du am Ende deine Ergebnisse ins Journal, steht deine Festlegung daneben.</p>
      <InShort>Einstellungen wie „Haltung zu Geflüchteten“ oder „Populismus“ kann man nicht direkt beobachten. Man fragt deshalb mehrere <b>Items</b> (einzelne Fragen oder Aussagen) und fasst sie zu einem <b>Index</b> zusammen. Jedes Item hat einen eigenen <b>Messfehler</b>; im Mittelwert mehrerer Items gleichen sich zufällige Fehler teilweise aus.</InShort>
      <MoreDetail summary="Index, Skala, Item">
        <ul>
          <li>Ein <b>Item</b> ist eine einzelne Frage mit ihren Antworten, etwa mp16. Eine <b>Itembatterie</b> sind mehrere Items, die nacheinander mit denselben Antworten gestellt werden.</li>
          <li>Ein <b>Index</b> fasst mehrere Items nach einer Regel zu einer neuen Variable zusammen. Die häufigste Regel ist der Mittelwert: der <b>Mittelwertindex</b>. Sind die Items vorher auf Stimmigkeit geprüft, spricht man oft von einer <b>Skala</b>. Im Alltag werden beide Wörter fast gleich gebraucht.</li>
          <li>Der gemeinsame Begriff hinter den Items heißt <b>Konstrukt</b> oder latente Variable: etwas, das wir nicht sehen, aber an mehreren Antworten ablesen wollen.</li>
          <li>Mehrere Items helfen gegen zufällige Fehler. Gegen einen gemeinsamen Fehler helfen sie nicht: Wenn alle vier Fragen etwas anderes messen als gedacht, misst auch ihr Mittelwert das Falsche. Das ist eine Frage der <b>Validität</b> (Gültigkeit), nicht der Genauigkeit.</li>
        </ul>
      </MoreDetail>
    </Card>

    <Card id="v1b" title="Eine Reihe, ein Wert: row_means()" badge={<><Bezug href="#a1-1">zu Schritt 2</Bezug><Badge>Bauplatte, Turm, Stein: kennst du aus Sitzung 2</Badge></>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Auf der Bauplatte ist jede Variable ein Turm und jede Person eine Reihe. Für einen Index schaust du nicht in einen Turm, sondern quer durch eine Reihe: Welche Antworten hat diese Person gegeben? Hier drei Befragte mit den vier Fragen zu Geflüchteten, zum Beispiel. Person B hat eine Frage nicht beantwortet. Geh die Schritte durch und schalte <code>min_valid</code> um.</p>
      <RowMean />
      <p className="absatz"><b>Formel lesen lernen:</b> So steht der Mittelwertindex als Formel.</p>
      <IndexFormula />
      <Frage>Warum bekommt Person B mit <code>min_valid = 3</code> den Wert 1,33 und nicht 1?</Frage>
      <p>Sie hat drei gültige Antworten: 1 + 1 + 2 = 4, geteilt durch 3. Die fehlende Antwort zählt nicht als 0, sie fällt einfach weg. Als 0 gezählt wäre es (1 + 1 + 2 + 0) / 4 = 1, und Person B sähe noch viel mehr nach „Risiko“ aus, nur weil sie eine Frage übersprungen hat. Mit <code>min_valid = 4</code> bekommt sie gar keinen Wert: Sie hat nur drei von vier Fragen beantwortet.</p>
      <h6 className="zwischen">Die Vorlage in Schritt 2</h6>
      <Code k="a1" />
      <Frage>Was macht jede Zeile?</Frage>
      <ul className="v-liste">
        <li><code>mutate(populismus = …)</code> stellt einen neuen Turm mit dem Namen <code>populismus</code> auf die Bauplatte (kennst du aus Sitzung 5).</li>
        <li><code>row_means(…)</code> bildet je Reihe den Mittelwert. <code>pick(pa29, …, pa35)</code> wählt die sieben Türme aus, deren Antworten zusammengefasst werden.</li>
        <li><code>min_valid = 7</code> ist die gelbe Stelle: Nur wer alle sieben Aussagen beantwortet hat, bekommt einen Wert.</li>
        <li><code>describe(populismus)</code> fasst den neuen Turm zusammen wie jede Variable. <b>N</b> ist die Zahl der Befragten mit Wert, <b>Missing</b> die Zahl ohne Wert. Ohne Gewicht, weil du hier Personen zählst.</li>
      </ul>
      <p>Wie die lange Zeile Stück für Stück aufgebaut ist, zeigt die Lesehilfe in <a href="#r2">„Neu heute“</a> im Vorweg.</p>
      <InShort>Ein <b>Mittelwertindex</b> ist der Mittelwert der gültigen Antworten einer Person: ein neuer Turm mit einem Wert je Reihe. <b><code>min_valid</code></b> legt fest, wie viele gültige Antworten jemand mindestens braucht, um einen Wert zu bekommen. Ohne <code>min_valid</code> reicht eine einzige Antwort.</InShort>
      <Mixup>Ein Index ist kein Mittelwert über alle Befragten. Er ist ein Wert <b>je Person</b>, also eine neue Variable. Den Mittelwert über alle Befragten rechnest du danach, wie bei jeder Variable, mit <code>describe()</code>.</Mixup>
    </Card>

    <Card id="v1-streng" title="Wie streng soll min_valid sein?" badge={<Bezug href="#a1-2">zu Schritt 3</Bezug>} tag={{ kind: 'interpret', label: 'Hintergrund' }}>
      <p className="lead">In Schritt 3 lockerst du die Regel: Statt alle sieben verlangt die Vorlage nur noch mindestens fünf Antworten. Du änderst dafür im Journal nur die gelbe Zahl im Block aus Schritt 2.</p>
      <Frage>Was regelt <code>min_valid</code> genau?</Frage>
      <p>Wie viele gültige Antworten jemand mindestens braucht, um einen Wert zu bekommen. Wer weniger hat, bekommt keinen Wert (NA). Wer genug hat, bekommt den Mittelwert seiner gültigen Antworten, egal ob es alle sind oder nicht. Bei den Fragen zu Geflüchteten haben 3.424 Befragte alle vier beantwortet, 58 drei, 15 zwei und 7 nur eine. Mit <code>min_valid = 4</code> bekommen 3.424 einen Wert, mit <code>min_valid = 3</code> sind es 3.482, ganz ohne <code>min_valid</code> 3.504.</p>
      <Frage>Welche Regel ist die richtige?</Frage>
      <ul className="v-liste">
        <li>Mit <code>min_valid</code> gleich der Zahl der Items bekommt nur einen Wert, wer alle Fragen beantwortet hat. Das ist streng, aber jeder Wert beruht auf denselben Fragen.</li>
        <li>Eine verbreitete Faustregel: mindestens zwei Drittel der Items (bei vier Items 3, bei sieben 5); lockerer: mehr als die Hälfte (bei sieben 4). Wichtig ist, dass du die Regel nennst.</li>
      </ul>
      <Frage>Und warum steht bei Missing so eine große Zahl?</Frage>
      <p>Die Populismus-Aussagen wurden nur in einem Teil der Fragebögen gestellt (Split). Wer die Fragen nicht bekam, hat keine einzige Antwort. Diese Befragten stehen in der Ausgabe von <code>describe()</code> bei Missing.</p>
      <InShort><code>min_valid</code> ist eine Entscheidung. Zu streng, und viele bekommen keinen Wert; zu locker, und manche Werte beruhen auf einer einzigen Antwort. Regel und n gehören in den Bericht.</InShort>
      <MoreDetail summary="Warum der Mittelwert und nicht die Summe?">
        <p>Die Summe hängt davon ab, wie viele Fragen jemand beantwortet hat: Wer nur eine Frage beantwortet, hat eine kleine Summe und sähe aus wie jemand mit viel „Risiko“. Ohne <code>min_valid</code> reicht die Summe der vier Fragen zu Geflüchteten im ALLBUS von 2 bis 20, obwohl mit allen vier Antworten nur 4 bis 20 möglich sind. Der Mittelwert bleibt auf der Antwortskala von 1 bis 5 und lässt sich wie eine Antwort lesen. Eine Summe (<code>row_sums()</code>) nimmst du, wenn du etwas zählen willst, wie in Aufgabe 4.</p>
      </MoreDetail>
    </Card>

    <Card id="v1-gewicht" title="Mit oder ohne Gewicht?" badge={<><Bezug href="#a1-3">zu Schritt 4</Bezug><Badge>Gewichtet: kennst du aus Sitzung 6</Badge></>} tag={{ kind: 'interpret', label: 'Code lesen' }}>
      <p className="lead">Wie seit Sitzung 6 rechnest du Aussagen über alle Menschen in Deutschland gewichtet: Mittelwerte und Anteile eines Index mit <code>weights = wghtpew</code>. Zwei Dinge rechnest du heute ohne Gewicht: wie stimmig die Fragen sind (Cronbachs α) und wie viele Befragte einen Indexwert bekommen. Beides beschreibt das Messinstrument und die Befragung selbst, nicht die Bevölkerung.</p>
      <Code k="a1w" />
      <p>Die Vorlage in Schritt 4 baut den Index wie in Schritt 2, aber gleich mit <code>min_valid = 5</code>, und gibt <code>describe()</code> das Gewicht mit. Damit ändert sich die Frage: nicht mehr „Wer bekommt einen Wert?“, sondern „Wie populistisch sind die Befragten im Mittel?“.</p>
      <Frage>Warum steht bei N jetzt eine andere Zahl?</Frage>
      <p><code>describe()</code> mit Gewicht zählt bei N die Gewichte zusammen. Beim Index zu Geflüchteten mit <code>min_valid = 3</code> steht dort zum Beispiel 3473, obwohl 3.482 Personen einen Wert haben. Wie viele Personen einen Wert bekommen, siehst du ohne Gewicht.</p>
      <Frage>Mean oder Median?</Frage>
      <p>Gefragt ist der Mittelwert, in der Spalte <b>Mean</b>. Daneben steht der <b>Median</b>, die Mitte der Reihe. Beim Index zu Geflüchteten liegt der Mittelwert bei 2,457, der Median bei 2,5. R schreibt Kommazahlen mit Punkt: 2.457 heißt 2,457.</p>
      <InShort>Aussagen über alle Menschen in Deutschland rechnest du mit Gewicht. Personen zählen und α rechnest du ohne Gewicht. Gewichtet ändert sich α kaum.</InShort>
      <Mixup>Das gewichtete N als Zahl der Befragten lesen. Mit Gewicht ist N die Summe der Gewichte, keine Personenzahl.</Mixup>
    </Card>

    <Card id="v1c" title="Den Index deuten: Wofür steht eine hohe, wofür eine niedrige Zahl?" badge={<Bezug href="#a1-4">zu Schritt 5</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">So verteilt sich der Index zu Geflüchteten über alle Befragten, die alle vier Fragen beantwortet haben (gewichtet). Weil ein Mittelwert aus vier Antworten auch Zwischenwerte hat, gibt es 17 mögliche Werte: 1; 1,25; 1,5 … 5.</p>
      <IndexBars />
      <Frage>Wie viele sehen Geflüchtete insgesamt eher als Risiko?</Frage>
      <p>Alle mit einem Indexwert unter 3, also die blauen Säulen von 1 bis 2,75. Zusammen sind das knapp zwei Drittel (65,9 %). Nur gut jeder Fünfte (21,5 %) liegt über 3, also eher bei „Chance“. Wer die Säule bei genau 3 mitzählt, kommt auf 78,5 %; aber 3 heißt „weder noch“.</p>
      <Frage>Was heißt das für den Populismus-Index in Schritt 5?</Frage>
      <p>Einen Index liest du wie die Antwortskala seiner Items. Bei den Fragen zu Geflüchteten heißt 1 „Risiko überwiegt“, ein niedriger Wert also „eher Risiko“. Bei den Populismus-Aussagen schaust du genauso nach, wofür die 1 steht, und deutest den Mittelwert damit.</p>
      <InShort>Den Index liest du wie die Antwortskala: Hier heißt ein niedriger Wert „eher Risiko“, ein hoher „eher Chance“. Wie bei jeder Variable gehören Verteilung, Mittelwert, Median und n in den Bericht, und dazu die Regel, wer einen Wert bekommt.</InShort>
      <MoreDetail summary="Was ein Indexwert von 2,5 heißt">
        <ul>
          <li>2,5 liegt zwischen „eher Risiko“ (2) und „weder noch“ (3). Es kann heißen: viermal ungefähr 2 oder 3, oder zweimal 1 und zweimal 4. Der Index zeigt die Gesamttendenz, nicht das Muster dahinter (mehr dazu in Aufgabe 4).</li>
          <li>Die Zahlen sind gewichtet, weil sie etwas über alle Menschen in Deutschland sagen. Wie viele Personen einen Wert haben (3.424 mit allen vier Antworten), zählst du ohne Gewicht.</li>
        </ul>
      </MoreDetail>
      <Mixup>Die Richtung eines Index ergibt sich aus den Items, nicht aus dem Wort „Index“. Bei den Fragen zu Geflüchteten ist 1 „Risiko“; ein niedriger Wert heißt also nicht „wenig Haltung“, sondern „eher Risiko“. Schau immer nach, wofür die 1 steht.</Mixup>
    </Card>

    <Card id="v1-ergebnis" title="Ergebnis festhalten: wo du was abliest" badge={<Bezug href="#a1-5">zu Schritt 6</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">In Schritt 6 hältst du fünf Dinge fest. Jedes hat einen Ort, an dem du es ablesen kannst.</p>
      <ul className="v-liste">
        <li><b>Wer mit <code>min_valid = 7</code> einen Wert bekommt:</b> Ausgabe von Schritt 2, Spalte N. Missing daneben zählt die Befragten ohne Wert.</li>
        <li><b>Wer mit <code>min_valid = 5</code> einen Wert bekommt:</b> dieselbe Spalte, nachdem du in Schritt 3 die Zahl geändert und den Block erneut ausgeführt hast. Nicht das N aus Schritt 4: Das ist mit Gewicht.</li>
        <li><b>Wer dazukommt:</b> Überleg, was <code>min_valid</code> regelt (<a href="#v1-streng">Wie streng soll min_valid sein?</a>).</li>
        <li><b>Der gewichtete Mittelwert:</b> Ausgabe von Schritt 4, Spalte Mean, nicht Median. Der Mittelwert ohne Gewicht aus Schritt 2 ist ein anderer.</li>
        <li><b>Die Deutung:</b> Achte auf die Richtung der Antwortskala (<a href="#v1c">Den Index deuten</a>).</li>
      </ul>
    </Card>
  </Abschnitt>;
}

/* ---------- Aufgabe 2 ---------- */
export function Verstehen2() {
  return <Abschnitt id="g2" n={2} titel="Messen die sieben Aussagen dasselbe?" frage="Darf man die sieben Populismus-Aussagen zu einem Index zusammenfassen, und passt jede dazu?"
    ziel="eine Zahl für die Stimmigkeit der sieben Aussagen (Cronbachs α), kennst die Aussage, die am schwächsten passt, und kannst begründen, ob sie im Index bleiben soll."
    weg={[
      ['Schritt 1', '#a2-p', 'Erst festlegen: Welche Aussage passt am wenigsten?', 'v2a'],
      ['Schritt 2', '#a2-1', 'Cronbachs α: was die Zahl misst', 'v2b'],
      ['Schritt 2', '#a2-1', 'die Ausgabe von reliability() lesen', 'v2c'],
      ['Schritt 3', '#a2-2', 'Gegenprobe ohne eine Aussage', 'v2-gegenprobe'],
      ['Schritt 4', '#a2-3', 'Deuten: Soll ein Item raus?', 'v2-behalten'],
      ['Schritt 5', '#a2-4', 'Ergebnis festhalten: wo du was abliest', 'v2-ergebnis'],
      ['Schritt 6', '#a2-5', 'das Bild nach dem Prüfen lesen', 'v2-gegenprobe'],
    ]}>

    <Card id="v2a" title="Stimmig heißt: dieselben Menschen antworten ähnlich" badge={<><Bezug href="#a2-p">zu Schritt 1</Bezug><Badge>Korrelation r und Korrelationsmatrix: kennst du aus Sitzung 6 und 7</Badge></>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Die Festlegung in Schritt 1 fragt, welche Aussage am wenigsten zu den anderen passt. Was heißt „passen“ bei Fragen? Ein Beispiel mit vier Fragen: Wie verbunden fühlen sich die Menschen mit ihrer Gemeinde, ihrem Bundesland, Deutschland und der EU? Antworten von 1 „stark verbunden“ bis 4 „gar nicht verbunden“. Stark oder ziemlich verbunden fühlen sich mit der Gemeinde 65,7 %, mit dem Bundesland 63,3 %, mit Deutschland 70,9 % und mit der EU 49,5 % (gewichtet).</p>
      <p className="absatz">Darf man daraus einen Index „Verbundenheit“ machen? Das hängt davon ab, ob dieselben Menschen bei allen vier ähnlich antworten. Wähl eine Ebene, um ihre Zeile in der Tabelle hervorzuheben.</p>
      <CorrelationTable />
      <Frage>Welche Ebene passt am wenigsten zu den anderen drei?</Frage>
      <p>Die EU. Sie hängt mit den anderen im Mittel am schwächsten zusammen (0,330), besonders mit der Gemeinde (0,190). Wer sich mit seinem Ort verbunden fühlt, fühlt sich nicht unbedingt mit Europa verbunden. Die Gemeinde hängt mit der EU zwar auch kaum zusammen, mit dem Bundesland aber eng (0,568); im Mittel liegt sie mit 0,366 etwas höher als die EU.</p>
      <InShort>Items passen zusammen, wenn dieselben Menschen bei ihnen ähnlich antworten, wenn sie also positiv miteinander <b>korrelieren</b>. Je höher die Korrelationen, desto stimmiger misst der Index einen gemeinsamen Begriff. Diese Stimmigkeit heißt <b>Reliabilität</b> (Zuverlässigkeit); genauer: <b>interne Konsistenz</b>.</InShort>
      <MoreDetail summary="Reliabilität und Validität">
        <ul>
          <li><b>Reliabilität</b> fragt: Misst das Instrument zuverlässig, also mit wenig Zufall? Bei einem Index heißt das: Zeigen die Items in dieselbe Richtung und hängen sie eng zusammen?</li>
          <li><b>Validität</b> fragt: Misst das Instrument das, was es messen soll? Vier Fragen zur Lieblingsfarbe könnten sehr stimmig sein und trotzdem keine Verbundenheit messen.</li>
          <li>Reliabilität ist eine Voraussetzung für Validität, aber kein Beweis dafür. Ob die Items den Begriff treffen, entscheidest du am Inhalt.</li>
        </ul>
      </MoreDetail>
      <Mixup>Stimmig heißt nicht, dass alle gleich antworten. Die Antworten dürfen über die Befragten weit streuen. Stimmig heißt: Wer bei einem Item hoch liegt, liegt auch bei den anderen eher hoch.</Mixup>
    </Card>

    <Card id="v2b" title="Formel lesen lernen: Cronbachs α" badge={<Bezug href="#a2-1">zu Schritt 2</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Cronbachs α fasst die Korrelationen aller Items in einer Zahl zusammen. In einer einfachen Form hängt α nur von zwei Dingen ab: wie viele Items es sind und wie eng sie im Mittel zusammenhängen.</p>
      <AlphaFormula />
      <h6 className="zwischen">α-Rechner</h6>
      <p className="unter-zwischen">Verändere k und r̄ und beobachte, wie sich α verändert.</p>
      <AlphaCalculator />
      <Frage>Was passiert, wenn es acht statt vier Fragen zur Verbundenheit gäbe, mit derselben mittleren Korrelation 0,404?</Frage>
      <p>Dann wäre α 0,844 statt 0,731. Die Items hängen nicht enger zusammen als vorher, aber es sind doppelt so viele. Darum steigt α.</p>
      <InShort><b>Cronbachs α</b> liegt meist zwischen 0 und 1. Es steigt, wenn die Items enger zusammenhängen, <b>und</b> wenn es mehr Items sind. Ein hohes α heißt also nicht automatisch, dass die Items eng zusammenhängen; es können auch einfach viele sein.</InShort>
      <MoreDetail summary="Welches α druckt R?">
        <ul>
          <li>Die Formel oben ist das <b>standardisierte α</b>; <code>summary()</code> zeigt es als „Alpha (standardized)“: für die Verbundenheit 0,731. Ganz oben steht „Cronbach's Alpha“ (0,726). Es rechnet mit Varianzen und Kovarianzen der Antworten statt mit Korrelationen. Meist liegen beide nah beieinander; berichtet wird üblicherweise „Cronbach's Alpha“.</li>
          <li>Daneben druckt R <b>McDonalds ω</b> (Omega, 0,733). ω lässt jedes Item unterschiedlich stark am gemeinsamen Begriff hängen, α behandelt alle gleich. Liegen α und ω nah beieinander, ist das ein gutes Zeichen. In dieser Sitzung schaust du auf α.</li>
          <li>α kann auch negativ werden. Das passiert, wenn Items in verschiedene Richtungen zeigen (Aufgabe 3).</li>
        </ul>
      </MoreDetail>
      <Mixup>α ist kein Prozentwert und kein Anteil von Befragten.</Mixup>
    </Card>

    <Card id="v2c" title="Die Ausgabe von reliability() lesen" badge={<><Bezug href="#a2-1">zu Schritt 2</Bezug><Badge>summary(): kennst du aus Sitzung 7</Badge></>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">In Schritt 2 bekommst du mit dieser Vorlage die ausführliche Ausgabe für die sieben Populismus-Aussagen:</p>
      <Code k="a2" />
      <p><code>reliability()</code> bekommt die Items, deren Stimmigkeit es prüfen soll. Ohne <code>summary()</code> gäbe es nur eine Zeile mit α; mit <code>summary()</code> kommt eine Zeile je Item dazu. Wie man die Ausgabe liest, zeigt hier dieselbe Ausgabe für die vier Fragen zur Verbundenheit. Wähl eine Zahl und schau, was sie sagt.</p>
      <ReliabilityOutput />
      <AlphaRules />
      <Frage>Ohne welches Item würde α bei der Verbundenheit steigen?</Frage>
      <p>Ohne die EU (pn17): Dann läge α bei 0,733, mit ihr bei 0,726. Alle anderen Zahlen in „Alpha if Deleted“ sind kleiner als 0,726; ohne die Gemeinde fiele α zum Beispiel auf 0,700. Der Gewinn ohne die EU ist klein.</p>
      <InShort><code>reliability()</code> zeigt oben <b>Cronbachs α</b> für alle Items, unten je Item die <b>Trennschärfe</b> (Corrected Item-Total) und <b>α ohne dieses Item</b> (Alpha if Deleted). Ein Item mit niedriger Trennschärfe passt schlecht zu den anderen. Steigt α ohne ein Item, prüfst du am Inhalt, ob es wirklich zum Begriff gehört.</InShort>
      <MoreDetail summary="Grenzen der Faustregeln">
        <ul>
          <li>Die Grenzen 0,7 oder 0,8 sind Gewohnheiten, keine Naturgesetze. 0,69 ist nicht schlecht und 0,71 nicht gut; nenn immer die Zahl.</li>
          <li>α steigt mit der Zahl der Items (<a href="#v2b">Formel lesen lernen</a>). Bei 20 Items reicht schon eine mittlere Korrelation von 0,2 für α = 0,833. Bei drei oder vier Items ist ein α um 0,7 dagegen schon ordentlich.</li>
          <li>Ein sehr hohes α (über 0,95) kann heißen, dass die Items fast dasselbe fragen. Dann misst der Index einen engen Ausschnitt des Begriffs.</li>
          <li>α prüft nicht, ob die Items <b>einen</b> gemeinsamen Begriff messen. Auch zwei Gruppen von Items, die je unter sich eng zusammenhängen, können ein hohes α ergeben. Ob es eine oder mehrere Dimensionen sind, zeigt ein eigenes Verfahren, die Faktorenanalyse; sie kommt im Lernpfad nicht vor. Hier hilft dir der Inhalt: Gehören die Items zu einem Begriff?</li>
          <li>α prüft nicht die Validität (<a href="#v2a">Reliabilität und Validität</a>).</li>
        </ul>
      </MoreDetail>
      <Mixup>Trennschärfe und „Alpha if Deleted“ verwechseln. Die Trennschärfe ist die Korrelation des Items mit der Summe der übrigen Items (hoch ist gut). „Alpha if Deleted“ ist α ohne das Item (höher als α heißt: das Item passt schlecht).</Mixup>
    </Card>

    <Card id="v2-gegenprobe" title="Gegenprobe: dieselbe Rechnung ohne ein Item" badge={<Bezug href="#a2-2">zu Schritt 3 und 6</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">„Alpha if Deleted“ sagt, wie hoch α ohne ein Item wäre. In Schritt 3 prüfst du das nach: Du rechnest α noch einmal, diesmal ohne die markierte Aussage.</p>
      <Code k="a2ohne" />
      <Frage>Was genau löschst du?</Frage>
      <p>Die gelbe Stelle umfasst die Aussage samt Komma und Leerzeichen; du löschst beides. Danach stehen in <code>reliability()</code> nur noch sechs Aussagen. Ohne <code>summary()</code> bekommst du die kurze Fassung: eine Zeile mit Cronbach's Alpha, McDonalds Omega und N, wie in der Kontrollausgabe in <a href="#r2">„Neu heute“</a>.</p>
      <Frage>Warum ändert sich N?</Frage>
      <p><code>reliability()</code> rechnet nur mit Befragten, die alle genannten Fragen beantwortet haben (N listwise). Fehlt eine Frage in der Liste, zählen auch die mit, die nur diese eine nicht beantwortet haben. Darum ist N ohne ein Item etwas größer. Vergleich α danach mit der Zahl in „Alpha if Deleted“ aus Schritt 2.</p>
      <Frage>Wie sieht „α ohne jedes Item“ als Bild aus?</Frage>
      <p>Hier für die vier Fragen zur Verbundenheit. Dasselbe Bild für die sieben Populismus-Aussagen zeigt dir Schritt 6, nachdem du deine Antworten geprüft hast.</p>
      <AlphaOhneBeispiel />
      <Leseart>Die gestrichelte Linie ist α mit allen vier Fragen. Nur der Balken der EU reicht darüber hinaus: Ohne sie wäre α etwas höher. Ohne das Bundesland fiele α am stärksten, auf 0,603.</Leseart>
    </Card>

    <Card id="v2-behalten" title="Soll ein Item raus? Zahlen und Inhalt" badge={<Bezug href="#a2-3">zu Schritt 4</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">In Schritt 4 überlegst du, ob eine Aussage aus dem Index soll. Zwei Dinge gehören in diese Entscheidung: die Zahlen und der Inhalt. Am Beispiel der Verbundenheit: Ohne die EU stiege α von 0,726 auf 0,733.</p>
      <Frage>Reicht es, dass α ohne das Item höher ist?</Frage>
      <p>Ein Gewinn in der dritten Nachkommastelle ist sehr klein, und die Faustregeln sind Gewohnheiten, keine Naturgesetze. Wer ein Item streicht, misst den Begriff enger. Ein Item zu streichen, nur weil α dann etwas steigt, ist darum keine gute Regel. Streichen ist erlaubt, wenn du es inhaltlich begründest und berichtest.</p>
      <Frage>Was heißt „am Inhalt entscheiden“?</Frage>
      <p>Du fragst, was der Index messen soll. Bei der Verbundenheit: Willst du Verbundenheit mit Deutschland und seinen Regionen messen oder räumliche Verbundenheit überhaupt? Im ersten Fall gehört die EU nicht hinein, im zweiten schon. Dazu kommt eine zweite Frage: Unterscheidet das Item überhaupt zwischen den Befragten? Ein Item, dem fast alle zustimmen, sagt wenig darüber, wer mehr und wer weniger von einem Begriff hat.</p>
      <InShort>Die <b>Trennschärfe</b> zeigt, wie gut ein Item zu den anderen passt; „Alpha if Deleted“, wie hoch α ohne das Item wäre. Ob ein Item bleibt, entscheidet der Inhalt.</InShort>
    </Card>

    <Card id="v2-ergebnis" title="Ergebnis festhalten: wo du was abliest" badge={<Bezug href="#a2-4">zu Schritt 5</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">In Schritt 5 hältst du fünf Dinge fest.</p>
      <ul className="v-liste">
        <li><b>Cronbachs α:</b> Ausgabe von Schritt 2, ganz oben, Zeile „Cronbach's Alpha“, mit drei Nachkommastellen. Darunter stehen „Alpha (standardized)“ und McDonalds ω; die sind hier nicht gefragt.</li>
        <li><b>Die schwächste Trennschärfe:</b> Ausgabe von Schritt 2, Spalte Corrected Item-Total, die kleinste Zahl.</li>
        <li><b>Was α sagt:</b> Überleg, was α zusammenfasst und was es nicht prüft (<a href="#v2b">Formel lesen lernen</a>; <a href="#v2a">Reliabilität und Validität</a>).</li>
        <li><b>α ohne die Aussage:</b> Ausgabe von Schritt 3, Zeile „Cronbach's Alpha =“. Nicht ω daneben, und nicht die Trennschärfe aus Schritt 2.</li>
        <li><b>Behalten oder streichen:</b> <a href="#v2-behalten">Zahlen und Inhalt</a>.</li>
      </ul>
      <p>Schritt 6 zeigt dir danach α ohne jede der sieben Aussagen als Bild. Es ist gebaut wie das Beispiel in der <a href="#v2-gegenprobe">Gegenprobe</a>. Ob ihr die schwächste Aussage behalten würdet, besprecht ihr im Plenum.</p>
    </Card>
  </Abschnitt>;
}

/* ---------- Aufgabe 3 ---------- */
export function Verstehen3() {
  return <Abschnitt id="g3" n={3} titel="Andersherum gefragt: Einstellungen zu Islam und Muslimen" frage="Wie fasst man sechs Aussagen, die in verschiedene Richtungen gestellt sind, richtig zu einem Index zusammen?"
    ziel="die andersherum gestellten Aussagen erkannt und umgepolt und kannst sagen, wie sich Cronbachs α dadurch verändert und wofür ein hoher Wert jetzt steht."
    weg={[
      ['Schritt 1', '#a3-p', 'Erst festlegen: Welche Aussagen sind andersherum gestellt?', 'v3a'],
      ['Schritt 2', '#a3-1', 'falsch gepolte Items in der Ausgabe erkennen', 'v3b'],
      ['Schritt 3', '#a3-2', 'umpolen und in reliability() tauschen', 'v3-um'],
      ['Schritt 4', '#a3-3', 'Deuten: wofür eine hohe Zahl steht', 'v3-richtung'],
      ['Schritt 5', '#a3-4', 'Ergebnis festhalten: wo du was abliest', 'v3-ergebnis'],
      ['Schritt 6', '#a3-5', 'das Bild nach dem Prüfen lesen', 'v3b'],
    ]}>

    <Card id="v3a" title="Andersherum gefragt" badge={<><Bezug href="#a3-p">zu Schritt 1</Bezug><Badge>Umpolen: kennst du aus Sitzung 5</Badge></>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Die Festlegung in Schritt 1 fragt, welche zwei der sechs Aussagen andersherum gestellt sind. Was heißt das? Ein Beispiel: Der ALLBUS fragt nach Rollenbildern in Familie und Beruf, mit Antworten von 1 „stimme voll zu“ bis 4 „stimme gar nicht zu“. Vier der Aussagen:</p>
      <ul>
        <li>fr07 „Eine berufstätige Frau kann eine genauso gute Mutter sein.“ (stimmen zu: 68,9 %)</li>
        <li>fr08 „Beide Eltern sollten Vollzeit arbeiten und sich den Haushalt teilen.“ (66,9 %)</li>
        <li>fr03b „Eine Frau sollte nicht arbeiten, solange ihr Kind klein ist.“ (36,2 %)</li>
        <li>fr04b „Die Frau sollte zu Hause bleiben und die Kinder versorgen.“ (20,1 %)</li>
      </ul>
      <p>(gewichtet; Kurzfassungen nach den Variablenlabels.) Wer bei fr07 voll zustimmt, denkt eher gleichberechtigt. Wer bei fr03b voll zustimmt, denkt eher traditionell. Dieselbe 1 bedeutet also zweimal das Gegenteil. Welche Aussagen andersherum gestellt sind, erkennst du am Wortlaut.</p>
      <Reverse />
      <Frage>Was wird beim Umpolen aus einer 2, auf einer Skala von 1 bis 7 wie in Aufgabe 3?</Frage>
      <p>Eine 6: kleinster plus größter Code, 1 + 7 = 8, und 8 − 2 = 6. Aus 1 wird 7, die 4 bleibt 4: Die Mitte bleibt in der Mitte. Wer nur 7 − 2 rechnet, kommt auf 5 und liegt eins daneben.</p>
      <InShort>Bevor du Items zu einem Index zusammenfasst, müssen alle in <b>dieselbe Richtung</b> zeigen: Eine hohe Zahl muss bei jedem Item dasselbe bedeuten. Andersherum gefragte Items (Fachbegriff: <b>invertierte Items</b>) polst du um: Die Skala wird gespiegelt, aus der kleinsten Zahl wird die größte.</InShort>
      <MoreDetail summary="Warum fragt man überhaupt andersherum?">
        <ul>
          <li>Manche Menschen stimmen fast allem zu, egal was gefragt wird (<b>Zustimmungstendenz</b>, englisch Acquiescence). Sind einige Aussagen andersherum gestellt, fällt das auf und verzerrt den Index weniger.</li>
          <li><code>rec(x, rules = "rev")</code> nimmt dafür den kleinsten und den größten Code der Skala, so wie die Wertelabels sie angeben, nicht die kleinste und größte Antwort, die tatsächlich vorkommt (kennst du aus Sitzung 5). Fehlende Werte bleiben leer. Das Wort zur Antwort wandert mit: Bei fr03b_um steht STIMME GAR NICHT ZU jetzt bei Code 1.</li>
          <li>Welche Items umgepolt werden, entscheidest du am Wortlaut, bevor du rechnest. Die Rechnung zeigt dir dann, ob du richtig lagst: Ein falsch gepoltes Item hat eine negative Trennschärfe.</li>
        </ul>
      </MoreDetail>
      <Mixup>Umpolen und Umkodieren in Gruppen verwechseln. Beim Umpolen bleiben alle Stufen erhalten, nur ihre Reihenfolge dreht sich. Beim Zusammenfassen in Gruppen (Sitzung 5) werden aus mehreren Stufen wenige.</Mixup>
    </Card>

    <Card id="v3b" title="Falsch gepolt: was die Ausgabe zeigt (Umpol-Labor)" badge={<Bezug href="#a3-1">zu Schritt 2 und 6</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Die Vorlage in Schritt 2 rechnet α für die sechs Aussagen so, wie sie im Datensatz stehen, wie in Aufgabe 2 mit <code>summary()</code>:</p>
      <Code k="a3" />
      <p>Was passiert in so einer Ausgabe, wenn Items verschieden gepolt sind? Am Beispiel der Rollenbilder kannst du jedes der vier Items umpolen und sofort sehen, was mit α und den Trennschärfen passiert. Gerechnet mit den 3.517 Befragten, die alle vier beantwortet haben.</p>
      <ReverseLab />
      <Frage>Welche Items musst du umpolen, damit alle vier in dieselbe Richtung zeigen?</Frage>
      <p>fr03b und fr04b. Dann heißt eine kleine Zahl bei allen vier: gleichberechtigt. Auch umgekehrt ginge es: fr07 und fr08 umpolen; dann heißt eine kleine Zahl bei allen vier: traditionell. α ist in beiden Fällen 0,696; es dreht sich nur, wofür eine hohe Zahl steht. Wer alle vier umpolt, hat dieselbe Lage wie vorher: α bleibt −0,210. Und wer fr07 und fr03b umpolt, lässt je zwei gegeneinander laufen: α wird −1,610.</p>
      <InShort>Ein <b>negatives α</b> oder eine <b>negative Trennschärfe</b> sind fast immer ein Zeichen für ein falsch gepoltes Item. Nach dem Umpolen sind die Trennschärfen positiv. Ob du die einen oder die anderen umpolst, ändert α nicht, nur die Richtung des Index.</InShort>
      <MoreDetail summary="Was α nach dem Umpolen sagt">
        <ul>
          <li>Mit α = 0,696 liegen die vier Rollenbild-Items knapp unter der üblichen Grenze 0,7 (mariposa: Questionable). Bei vier Items ist das kein schlechter Wert (<a href="#v2c">Grenzen der Faustregeln</a>).</li>
          <li>Die schwächste Trennschärfe hat fr08 (0,399). Ohne fr08 läge α bei 0,682, also niedriger: fr08 trägt also trotzdem etwas bei.</li>
          <li>Bei diesen vier Items, zwei in jeder Richtung, sind ohne Umpolen alle vier Trennschärfen negativ. Die Rechnung zeigt dann nur, dass etwas nicht stimmt, aber nicht, welche Items andersherum sind; das sagt dir erst der Wortlaut. Darum zuerst lesen, dann rechnen.</li>
        </ul>
      </MoreDetail>
      <Mixup>Umpolen „verbessert“ nicht die Daten. Es macht nur sichtbar, dass die Antworten zusammenpassen. Ein Item, das inhaltlich nicht passt, wird durch Umpolen nicht passend.</Mixup>
    </Card>

    <Card id="v3-um" title="Umpolen in der Kette: bauen, dann tauschen" badge={<><Bezug href="#a3-2">zu Schritt 3</Bezug><Badge>rec(…, rules = "rev"): kennst du aus Sitzung 5</Badge></>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">Die Vorlage in Schritt 3 hat zwei Teile in einer Kette: Erst baut <code>mutate()</code> die umgepolten Aussagen, dann rechnet <code>reliability()</code> die Stimmigkeit.</p>
      <Code k="a3um" />
      <Frage>Warum ändert sich α nicht, wenn du die Vorlage unverändert ausführst?</Frage>
      <p>Weil in <code>reliability()</code> noch die alten Namen stehen. <code>mutate()</code> hat die umgepolten Aussagen zwar gebaut, aber <code>reliability()</code> rechnet mit dem, was in seiner Klammer steht. Erst wenn du die beiden gelben Stellen gegen ihre umgepolte Fassung (Endung <code>_um</code>) tauschst, gehen die umgepolten Aussagen in die Rechnung ein.</p>
      <Frage>Muss ich wirklich beide tauschen?</Frage>
      <p>Ja. Tauschst du nur eine, steht die andere noch in der alten Richtung und läuft weiter gegen die übrigen.</p>
      <Frage>Und wenn R meldet, dass es eine Variable mit <code>_um</code> nicht gibt?</Frage>
      <p>Die umgepolte Variable gibt es nur in der Kette, die sie mit <code>mutate()</code> baut. Lass den <code>mutate()</code>-Teil stehen und führ den ganzen Block aus, nicht nur die letzte Zeile. Wie du eine neue Variable dauerhaft im Datensatz behältst, steht in <a href="#r1">„Startblock und Umpolen“</a> im Vorweg.</p>
      <InShort><code>rec(x, rules = "rev")</code> baut in <code>mutate()</code> einen umgedrehten Turm. Damit er zählt, muss sein neuer Name auch dort stehen, wo gerechnet wird.</InShort>
    </Card>

    <Card id="v3-richtung" title="Wofür steht eine hohe Zahl?" badge={<Bezug href="#a3-3">zu Schritt 4</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">Nach dem Umpolen zeigen alle Aussagen in dieselbe Richtung. Aber in welche? Das bestimmen die Aussagen, die du nicht umgepolt hast.</p>
      <p>Bei den Rollenbildern: Polst du fr03b und fr04b um, behalten fr07 und fr08 ihre Richtung. Eine kleine Zahl heißt dann bei allen vier „gleichberechtigt“, eine hohe „eher traditionell“. Polst du stattdessen fr07 und fr08 um, ist es genau umgekehrt. α ist beide Male gleich; nur die Deutung dreht sich.</p>
      <Frage>Wie findest du die Richtung bei den sechs Aussagen in Aufgabe 3?</Frage>
      <p>Lies die vier Aussagen, die du nicht umgepolt hast, und frag: Wofür steht dort eine 7, „stimme voll und ganz zu“? Genau dafür steht nach dem Umpolen eine hohe Zahl bei allen sechs.</p>
      <p>Die Aussagen in Aufgabe 3 sind Fragen aus dem Fragebogen, keine Feststellungen dieses Kurses. Die Richtung zu nennen heißt nur zu sagen, was eine Zahl im Index bedeutet.</p>
      <InShort>Einen Index deutest du immer mit seiner Richtung: Wofür steht eine hohe Zahl?</InShort>
    </Card>

    <Card id="v3-ergebnis" title="Ergebnis festhalten: wo du was abliest" badge={<Bezug href="#a3-4">zu Schritt 5</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">In Schritt 5 hältst du fünf Dinge fest.</p>
      <ul className="v-liste">
        <li><b>Negative Trennschärfe:</b> Ausgabe von Schritt 2, Spalte Corrected Item-Total, die zwei Zahlen mit Minuszeichen.</li>
        <li><b>α vor dem Umpolen:</b> Ausgabe von Schritt 2, Zeile „Cronbach's Alpha“. Nicht das standardisierte α darunter, nicht ω.</li>
        <li><b>α nach dem Umpolen:</b> Ausgabe von Schritt 3, nachdem du beide Stellen getauscht hast. Steht dort dieselbe Zahl wie in Schritt 2, rechnet R noch mit den alten Namen (<a href="#v3-um">Umpolen in der Kette</a>).</li>
        <li><b>Die Richtung:</b> <a href="#v3-richtung">Wofür steht eine hohe Zahl?</a></li>
        <li><b>Warum α vorher so niedrig war:</b> Vergleich α vor und nach dem Umpolen: Was hat sich zwischen beiden Rechnungen geändert, was nicht?</li>
      </ul>
      <p>Schritt 6 zeigt dir danach die Trennschärfen vorher und nachher als Bild, gebaut wie die Balken im <a href="#v3b">Umpol-Labor</a>.</p>
    </Card>
  </Abschnitt>;
}

/* ---------- Aufgabe 4 ---------- */
export function Verstehen4() {
  return <Abschnitt id="g4" n={4} titel="Im Schnitt oder durchgehend?" frage="Wie viele Befragte sind „durchgehend“ populistisch, und wie viele nur im Schnitt?"
    ziel="zwei Zahlen, „allen drei zugestimmt“ und „im Schnitt zugestimmt“, und kannst erklären, warum sie sich unterscheiden."
    weg={[
      ['Schritt 1', '#a4-p', 'Erst festlegen: durchgehend oder im Schnitt?', 'v4a'],
      ['Schritt 2', '#a4-1', 'Zustimmungen zählen mit rec() und row_sums()', 'v4-zaehlen'],
      ['Schritt 3', '#a4-2', 'den Mittelwertindex lesen: Cum. %', 'v4-kurz'],
      ['Schritt 4', '#a4-3', 'Deuten: Ausgleich im Mittelwert', 'v4a'],
      ['Hintergrund', '#a4-3', 'ein klassischer Kombinationsindex: Inglehart', 'v4b'],
      ['Schritt 5', '#a4-4', 'Ergebnis festhalten: wo du was abliest', 'v4-ergebnis'],
    ]}>

    <Card id="v4a" title="Ausgleich im Mittelwert" badge={<Bezug href="#a4-p">zu Schritt 1 und 4</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Zwei Befragte, zum Beispiel, antworten auf drei Aussagen einer Skala von 1 „stimme voll zu“ bis 5 „lehne ganz ab“. Person A: 1, 1, 4. Person B: 2, 2, 2. Beide haben den Mittelwert 2, also „im Schnitt Zustimmung“. Aber Person A lehnt eine Aussage ab, Person B stimmt allen zu.</p>
      <Balance />
      <InShort>Ein Mittelwertindex ist <b>kompensatorisch</b>: Eine hohe Antwort kann eine niedrige ausgleichen. Ein <b>Kombinationsindex</b> verbindet die Antworten nach einer festen Regel, etwa „bei allen zugestimmt“ oder „diese Antwort zuerst, jene an zweiter Stelle“. Welche Regel passt, folgt aus dem Begriff, den du messen willst.</InShort>
      <Mixup>„Im Schnitt Zustimmung“ und „überall Zustimmung“ gleichsetzen. Der Mittelwert sagt nichts darüber, ob jemand bei jeder Aussage zustimmt.</Mixup>
    </Card>

    <Card id="v4-zaehlen" title="Zählen mit rec() und row_sums()" badge={<><Bezug href="#a4-1">zu Schritt 2</Bezug><Badge>rec(): kennst du aus Sitzung 5</Badge></>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">Die Vorlage in Schritt 2 ist lang, aber sie hat nur drei Teile: drei 0/1-Variablen, zwei Indizes, eine Häufigkeitstabelle.</p>
      <Code k="a4" />
      <Frage>Was macht jeder Teil?</Frage>
      <ul className="v-liste">
        <li><code>rec(pa31, rules = "1:2=1 [stimmt zu]; 3:5=0 [stimmt nicht zu]; else=NA")</code>: Aus 1 und 2 wird 1 („stimmt zu“), aus 3 bis 5 wird 0 („stimmt nicht zu“), alles andere wird NA. So entstehen <code>z31</code>, <code>z32</code> und <code>z33</code>.</li>
        <li><code>row_sums(pick(z31, z32, z33), min_valid = 3)</code> zählt die Einsen je Person: 0 bis 3 Zustimmungen. „Allen zugestimmt“ heißt dann: Summe 3.</li>
        <li><code>row_means(pick(pa31, pa32, pa33), min_valid = 3)</code> ist der Mittelwertindex derselben drei Aussagen, wie in Aufgabe 1. Er heißt <code>kurz</code> und wird hier schon gebaut, aber erst in Schritt 3 gezeigt.</li>
        <li><code>frequency(zustimmungen, weights = wghtpew)</code> zeigt, wie viel Prozent 0, 1, 2 oder 3 Aussagen zustimmen, gewichtet wie seit Sitzung 6. <b>Valid %</b> ist der Anteil an allen mit Wert.</li>
      </ul>
      <Frage>Warum steht auch bei <code>row_sums()</code> ein <code>min_valid</code>?</Frage>
      <p>Ohne <code>min_valid</code> zählt R nur die gültigen Antworten zusammen, und wer eine Frage übersprungen hat, sieht aus, als hätte er dort nicht zugestimmt. Mit <code>min_valid</code> gleich der Zahl der Items bekommt nur einen Wert, wer alle beantwortet hat.</p>
      <InShort>Auch eine Summe ist ein Index (<b>Summenindex</b>). <code>row_sums()</code> nimmst du, wenn du etwas zählen willst. Ein Summenindex aus denselben Items enthält ohne fehlende Werte dieselbe Information wie ihr Mittelwert. <code>zustimmungen</code> ist etwas anderes: Es zählt 0/1-Variablen, also nur, ob jemand zustimmt, nicht wie stark.</InShort>
      <Mixup>Die 0 in <code>z31</code> heißt „stimmt nicht zu“, nicht „lehnt ab“: Nach der Regel in <code>rec()</code> wird auch „teils/teils“ (3) zu 0.</Mixup>
    </Card>

    <Card id="v4-kurz" title="Den Mittelwertindex lesen: Cum. %" badge={<Bezug href="#a4-2">zu Schritt 3</Bezug>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">In Schritt 3 änderst du im Journal in derselben Vorlage nur die gelbe Stelle: <code>frequency(kurz, weights = wghtpew)</code> statt <code>frequency(zustimmungen, …)</code>. Der Rest der Kette bleibt, denn <code>kurz</code> wird dort schon gebaut.</p>
      <Frage>Warum hat <code>kurz</code> so krumme Werte?</Frage>
      <p>Ein Mittelwert aus drei Antworten von 1 bis 5 kann auch Drittelwerte haben: 1, 1,33, 1,67, 2 und so weiter bis 5. Das sind 13 mögliche Werte. R schreibt 1,33 als 1.33333333333333.</p>
      <Frage>Was zeigt Cum. %?</Frage>
      <p>Cum. % zählt die Prozente von oben bis zu dieser Zeile zusammen. In der Zeile 2 stecken also alle Werte bis einschließlich 2. Genau das heißt „im Schnitt Zustimmung“: Wert höchstens 2. Valid % in der Zeile 2 wären nur die mit genau 2.</p>
      <InShort>Für „höchstens“ liest du <b>Cum. %</b>, für „genau“ <b>Valid %</b>.</InShort>
    </Card>

    <Card id="v4b" title="Ein klassischer Kombinationsindex: Inglehart" badge={<Badge>Hintergrund</Badge>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Der Politikwissenschaftler Ronald Inglehart hat Menschen vier politische Ziele in eine Rangfolge bringen lassen. Zwei Ziele gelten als materialistisch (Sicherheit und Wohlstand), zwei als postmaterialistisch (Mitbestimmung und Freiheit):</p>
      <ul>{INGLE_GOALS.map(g => <li key={g.id}>{`„${g.text}“ (${g.id}, ${g.kind === 'M' ? 'materialistisch' : 'postmaterialistisch'})`}</li>)}</ul>
      <p>Der ALLBUS bildet daraus den Inglehart-Index (ingle). Er schaut nur auf Platz 1 und Platz 2. Ordne die Ziele mit den Knöpfen und schau, welcher Typ herauskommt.</p>
      <Inglehart />
      <Frage>Welcher Typ ist eine Person, die „Ruhe und Ordnung“ auf Platz 1 und „freie Meinungsäußerung“ auf Platz 2 setzt?</Frage>
      <p>Ein materialistischer Mischtyp: Platz 1 ist materialistisch (M), Platz 2 postmaterialistisch (P). M vor P heißt materialistischer Mischtyp. Mit 35,68 % ist das der häufigste Typ.</p>
      <InShort>Der Inglehart-Index ist ein <b>Kombinationsindex</b>: Er verbindet zwei Antworten nach einer Regel zu einem Typ. Ein Mittelwert wäre hier sinnlos.</InShort>
      <MoreDetail summary="Warum hier kein Mittelwert?">
        <ul>
          <li>Jede Person vergibt die Plätze 1, 2, 3 und 4 genau einmal. Der Mittelwert ihrer vier Ränge ist deshalb bei allen 2,5. Ein Mittelwertindex würde alle Menschen gleich machen.</li>
          <li>Der Typ ist eine neue Variable mit vier Stufen, nominal bis ordinal. Du beschreibst ihn wie jede kategoriale Variable mit Anteilen (<code>frequency()</code> mit Gewicht), nicht mit einem Mittelwert.</li>
          <li>Die Zahlen sind gewichtet, weil sie Anteile in der Bevölkerung beschreiben.</li>
        </ul>
      </MoreDetail>
      <Mixup>Den Code des Typs (1 bis 4) wie eine Messzahl behandeln. <code>describe(ingle, weights = wghtpew)</code> rechnet zwar einen Mittelwert aus (2,472), aber als „mittlerer Inglehart-Wert“ sagt er nichts: Die Codes sind Namen der Typen mit einer groben Reihenfolge, keine gleich großen Abstände.</Mixup>
    </Card>

    <Card id="v4-ergebnis" title="Ergebnis festhalten: wo du was abliest" badge={<Bezug href="#a4-4">zu Schritt 5</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">In Schritt 5 hältst du drei Dinge fest.</p>
      <ul className="v-liste">
        <li><b>Allen drei zugestimmt:</b> Ausgabe von Schritt 2, Zeile 3, Spalte Valid %. Die Zeile 0 sind die, die keiner Aussage zustimmen.</li>
        <li><b>Im Schnitt zugestimmt:</b> Ausgabe von Schritt 3, Zeile 2, Spalte Cum. % (<a href="#v4-kurz">Den Mittelwertindex lesen</a>).</li>
        <li><b>Warum im Schnitt mehr zustimmen als durchgehend:</b> Überleg, welche Antworten jemand haben kann, der im Schnitt höchstens 2 hat, aber nicht allen drei Aussagen zustimmt. Person A und B helfen (<a href="#v4a">Ausgleich im Mittelwert</a>).</li>
      </ul>
      <p>Welche Regel besser zum Begriff Populismus passt, besprecht ihr im Plenum.</p>
    </Card>
  </Abschnitt>;
}

/* ---------- Überblick ---------- */
export function Ueberblick() {
  return <section className="grund-block" id="g5" aria-labelledby="g5-h">
    <div className="g-kopf">
      <span className="st m c7" aria-hidden="true">✓</span>
      <div><div className="ueber">Überblick über alle Aufgaben</div><h4 id="g5-h">Vom Item zum Index</h4></div>
    </div>
    <p className="g-intro">Alle vier Aufgaben zusammen: in welcher Reihenfolge du einen Index baust und welcher Index wann passt.</p>
    <HeadingLevel.Provider value={5}>
      <Card id="u1" title="Vom Item zum Index in fünf Schritten" badge={<Badge>Aufgabe 1 bis 3</Badge>} tag={{ kind: 'picture', label: 'Im Bild' }}>
        <Flow />
        <p className="absatz">In den Aufgaben hast du die Schritte in anderer Reihenfolge geübt: erst den Index (Aufgabe 1), dann die Stimmigkeit (Aufgabe 2), dann die Richtung (Aufgabe 3). In einer eigenen Auswertung gehst du von 1 bis 5.</p>
      </Card>
      <Card id="u2" title="Welcher Index?" badge={<Badge>Aufgabe 1 bis 4</Badge>} tag={{ kind: 'picture', label: 'Im Bild' }}>
        <WhichIndex />
        <InShort>Zuerst entscheidet der Begriff (darf man ausgleichen?), dann prüfen Richtung und α, ob die Items zusammen einen Mittelwert tragen.</InShort>
      </Card>
      <Card id="u3" title="Voraussetzungen" badge={<Badge>Überblick</Badge>} tag={{ kind: 'interpret', label: 'Hintergrund' }}>
        <table className="daten voll">
          <caption className="sr-only">Voraussetzungen je Schritt</caption>
          <thead><tr><th scope="col">Schritt</th><th scope="col">braucht</th><th scope="col">Vorsicht</th></tr></thead>
          <tbody>
            <tr><td>Mittelwertindex</td><td>Items mit gleicher Antwortskala, alle in derselben Richtung, ein gemeinsamer Begriff</td><td>Mittelwert lässt Ausgleich zu; Richtung des Index nennen („1 heißt …“).</td></tr>
            <tr><td><code>min_valid</code></td><td>eine begründete Regel, wie viele Antworten nötig sind</td><td>Zu streng: viele ohne Wert; zu locker: Werte aus einer einzigen Antwort. Regel und n berichten.</td></tr>
            <tr><td>Cronbachs α</td><td>mindestens zwei Items, Befragte mit allen Antworten (listenweise)</td><td>Steigt mit der Zahl der Items; prüft weder eine Dimension noch die Validität; Faustregeln sind keine Grenzen.</td></tr>
            <tr><td>Trennschärfe, α ohne Item</td><td>dieselbe Ausgabe</td><td>Ein Item nicht nur wegen der dritten Nachkommastelle streichen; der Inhalt entscheidet.</td></tr>
            <tr><td>Kombinationsindex</td><td>eine inhaltlich begründete Regel</td><td>Mit <code>row_sums()</code> immer <code>min_valid</code> setzen; Ergebnis ist eine kategoriale Variable: Anteile berichten, keinen Mittelwert der Codes.</td></tr>
            <tr><td>Gewichtung</td><td><code>weights = wghtpew</code> für Aussagen über die Bevölkerung</td><td>α und Personenzahlen ohne Gewicht; gewichtet ändert sich α kaum.</td></tr>
          </tbody>
        </table>
        <Mixup>„Hohes α, also gute Skala.“ α sagt nur, dass die Items zusammenpassen. Ob sie das Richtige messen (Validität) und ob ein Mittelwert zum Begriff passt, entscheidest du am Inhalt.</Mixup>
      </Card>
    </HeadingLevel.Provider>
  </section>;
}

/* ---------- Bilder für die „?“-Fenster der Aufgaben (nur zeigende Beispielbilder, keine Aufgabenzahlen) ---------- */
export const BILDER = { RowMean, ReliabilityOutput, AlphaOhneBeispiel, ReverseLab, Reverse };

/* ---------- Themen für den Reiter „Verstehen“ (Reihenfolge, Karten für die rechte Leiste) ---------- */
export const THEMEN: Thema[] = [
  { id: 'vorweg', n: 'R', kurz: 'R lesen', titel: 'Vorweg: R lesen', minuten: 10, Inhalt: Vorweg,
    karten: [['r1', 'Startblock und Umpolen'], ['r2', 'Neu heute: ein Wert je Person, Stimmigkeit']] },
  { id: 'g1', n: '1', kurz: 'Aufgabe 1', titel: 'Wie populistisch denken die Befragten?', minuten: 15, Inhalt: Verstehen1, aufgabe: 1,
    karten: [['v1a', 'Warum mehrere Fragen?'], ['v1b', 'Eine Reihe, ein Wert'], ['v1-streng', 'Wie streng soll min_valid sein?'], ['v1-gewicht', 'Mit oder ohne Gewicht?'], ['v1c', 'Den Index deuten: hoch oder niedrig?'], ['v1-ergebnis', 'Ergebnis festhalten']] },
  { id: 'g2', n: '2', kurz: 'Aufgabe 2', titel: 'Messen die sieben Aussagen dasselbe?', minuten: 15, Inhalt: Verstehen2, aufgabe: 2,
    karten: [['v2a', 'Stimmig heißt …'], ['v2b', 'Formel lesen lernen: α'], ['v2c', 'Die Ausgabe von reliability()'], ['v2-gegenprobe', 'Gegenprobe ohne ein Item'], ['v2-behalten', 'Soll ein Item raus?'], ['v2-ergebnis', 'Ergebnis festhalten']] },
  { id: 'g3', n: '3', kurz: 'Aufgabe 3', titel: 'Andersherum gefragt', minuten: 12, Inhalt: Verstehen3, aufgabe: 3,
    karten: [['v3a', 'Andersherum gefragt'], ['v3b', 'Falsch gepolt: Umpol-Labor'], ['v3-um', 'Umpolen in der Kette'], ['v3-richtung', 'Wofür steht eine hohe Zahl?'], ['v3-ergebnis', 'Ergebnis festhalten']] },
  { id: 'g4', n: '4', kurz: 'Aufgabe 4', titel: 'Im Schnitt oder durchgehend?', minuten: 10, Inhalt: Verstehen4, aufgabe: 4,
    karten: [['v4a', 'Ausgleich im Mittelwert'], ['v4-zaehlen', 'Zählen mit row_sums()'], ['v4-kurz', 'Cum. % lesen'], ['v4b', 'Inglehart'], ['v4-ergebnis', 'Ergebnis festhalten']] },
  { id: 'g5', n: '✓', kurz: 'Überblick', titel: 'Vom Item zum Index', minuten: 5, Inhalt: Ueberblick,
    karten: [['u1', 'Fünf Schritte'], ['u2', 'Welcher Index?'], ['u3', 'Voraussetzungen']] },
];
