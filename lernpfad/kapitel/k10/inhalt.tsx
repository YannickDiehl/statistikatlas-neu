// Kapitel 10 „Regression vertiefen“, Reiter „Verstehen“: je Aufgabe erklären, was in jedem Schritt passiert und warum.
// Keine Übungen: Die „Kurz überlegen“-Fragen der bisherigen Grundlagen sind hier rhetorische Fragen mit ihrer Antwort (aus den Feedback-Texten).
import { Card, InShort, Mixup, MoreDetail, Badge } from '@atlas/chapter/blocks/Card';
import { HeadingLevel } from '@atlas/chapter/blocks/level';
import { ReadR } from '@atlas/chapter/s10/ReadR';
import { AgeHealth } from '@atlas/chapter/s10/figures/AgeHealth';
import { BetaRuler, Dice, VifCircles } from '@atlas/chapter/s10/figures/Compare';
import { FormulaAdjR2, FormulaBeta, FormulaGrows, FormulaTwo } from '@atlas/chapter/s10/figures/Formulas';
import { DummyTable, FourGroups, Reference, TwoGroups } from '@atlas/chapter/s10/figures/Groups';
import { InteractionPlot } from '@atlas/chapter/s10/figures/Limits';
import { DecisionTree } from '@atlas/chapter/s10/figures/Tree';
import '@atlas/chapter/s10/s10.css';
import type { Thema } from '../../react/typen';
import { EinflussErklaert } from './figuren';
import { Abschnitt, Bezug, Code, Frage, Leseart } from '../../react/gemeinsam';

/* ---------- Vorweg ---------- */
export function Vorweg() {
  return <section className="grund-block" id="vorweg" aria-labelledby="vorweg-h">
    <div className="g-kopf">
      <span className="st m c7" aria-hidden="true">R</span>
      <div><div className="ueber">Vorweg, für alle Aufgaben</div><h4 id="vorweg-h">R lesen</h4></div>
    </div>
    <p className="g-intro">Alle vier Aufgaben rechnen Modelle wie <code>linear_regression(y ~ x1 + x2, weights = wghtpew) %&gt;% summary()</code>. Hier steht, wie du eine Formel mit mehreren Prädiktoren liest, wo in der Ausgabe was steht und was <code>to_dummy()</code> tut. Alle Zahlen in diesem Kapitel sind gewichtet mit <code>wghtpew</code> (kennst du aus Sitzung 6); in der Ausgabe ist N dann die Summe der Gewichte, gerundet, nicht die Zahl der Befragten.</p>
    <HeadingLevel.Provider value={5}><ReadR /></HeadingLevel.Provider>
  </section>;
}

/* ---------- Aufgabe 1 ---------- */
export function Verstehen1() {
  return <Abschnitt id="g1" n={1} titel="Eigene Lage oder Lage des Landes?"
    frage="Hängt die Zufriedenheit mit der Demokratie an der eigenen wirtschaftlichen Lage, oder daran, wie man die Lage in Deutschland sieht?"
    ziel="eine Zahl für den Zusammenhang der eigenen Lage mit der Demokratiezufriedenheit, einmal allein und einmal bei gleicher Einschätzung der Lage Deutschlands, und kannst erklären, warum sich die Zahl ändert."
    weg={[
      ['Schritt 1', '#a1-p', 'Erst festlegen: Was passiert mit B, wenn ein zweiter Prädiktor dazukommt?', 'k1-alter'],
      ['Schritt 2', '#a1-1', 'Modell mit der eigenen Lage: die Vorlage lesen', 'k1-variablen'],
      ['Schritt 3', '#a1-2', 'die Lage Deutschlands dazunehmen: die Formel wächst', 'k1-formel'],
      ['Schritt 3', '#a1-2', 'eine Vorhersage mit zwei Prädiktoren lesen', 'k1-vorhersage'],
      ['Schritt 4', '#a1-3', 'Deuten: warum sich B ändert', 'k1-alter'],
      ['Schritt 4', '#a1-3', 'Deuten: was kontrollieren heißt', 'k1-kontrolle'],
      ['Schritt 5', '#a1-4', 'Ergebnis festhalten: wo du was abliest', 'k1-ergebnis'],
    ]}>

    <Card id="k1-variablen" title="Worum es geht: drei Einschätzungen, umgepolt" badge={<Bezug href="#a1-1">zu Schritt 2</Bezug>} tag={{ kind: 'interpret', label: 'Hintergrund' }}>
      <p className="lead">Die Aufgabe arbeitet mit drei Fragen aus dem ALLBUS: wie zufrieden man mit der Demokratie in Deutschland ist (<code>ps03</code>), wie man die eigene wirtschaftliche Lage einschätzt (<code>ep03</code>) und wie die wirtschaftliche Lage in Deutschland (<code>ep01</code>). Alle drei zählen von „sehr gut“ oder „sehr zufrieden“ nach unten.</p>
      <Code k="a1" />
      <Frage>Warum polt die Vorlage alle drei um?</Frage>
      <p>Damit eine höhere Zahl „zufriedener“ bzw. „besser“ heißt. <code>rec(…, rules = "rev")</code> kennst du aus Sitzung 5. Danach reicht <code>demo</code> von 1 (sehr unzufrieden) bis 6 (sehr zufrieden), <code>lage</code> und <code>dlage</code> von 1 (sehr schlecht) bis 5 (sehr gut). <code>dlage</code> bildet die Vorlage schon jetzt, gebraucht wird es erst in Schritt 3. (Der Kommentar in der Vorlage sagt „Schritt 2“; er zählt „Erst festlegen“ nicht mit.)</p>
      <Frage>Was rechnet die Vorlage?</Frage>
      <p><code>linear_regression(demo ~ lage, weights = wghtpew)</code> kennst du aus Sitzung 9: Links vom <code>~</code> steht, was vorhergesagt wird, rechts der Prädiktor. <code>summary()</code> druckt die ganze Ausgabe. B von <code>lage</code> steht unter <b>Coefficients</b> in der Spalte B, R Square unter <b>Model Summary</b>. Wie die Ausgabe aufgebaut ist, zeigt <a href="#r2">„Die Ausgabe von summary() lesen“</a>.</p>
      <Frage>Warum ist N viel kleiner als die Zahl aller Befragten?</Frage>
      <p>Die Demokratiefrage haben nur etwa zwei Drittel der Befragten bekommen; die anderen haben TNZ: SPLIT (kennst du aus Sitzung 1). Außerdem ist N bei Gewichtung die Summe der Gewichte, gerundet.</p>
      <InShort><code>demo</code> ist die <b>abhängige Variable</b> (AV), <code>lage</code> der <b>Prädiktor</b>. <b>B</b> sagt, um wie viel sich die Vorhersage ändert, wenn der Prädiktor um eine Stufe steigt. <b>R²</b> sagt, welchen Anteil der Streuung das Modell erklärt.</InShort>
    </Card>

    <Card id="k1-alter" title="Ein zweiter Prädiktor kann B verändern: Alter und Gesundheit" badge={<Bezug href="#a1-p">zu Schritt 1 und 4</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">In Schritt 1 legst du fest, was mit B der eigenen Lage passiert, wenn ein zweiter Prädiktor dazukommt. Was dabei grundsätzlich passieren kann, zeigt ein anderes Beispiel: die Lebenszufriedenheit (0 bis 10) und das Alter.</p>
      <Frage>Wer ist im Schnitt zufriedener, die Jüngsten (18 bis 29) oder die Ältesten (75 und älter)?</Frage>
      <p>Die Ältesten, aber nur etwas: 7,65 gegen 7,15. Spannend wird es, wenn man die Gesundheit dazunimmt. Schalte im Bild auf „getrennt nach Gesundheit“.</p>
      <AgeHealth />
      <Leseart>In jeder Gesundheitsgruppe sind Ältere deutlich zufriedener als Jüngere. Zusammen sieht man davon nur wenig, weil Ältere öfter krank sind, und Krankheit drückt die Zufriedenheit. Zwei Dinge wirken gegeneinander: das Alter nach oben, die schlechtere Gesundheit nach unten.</Leseart>
      <Frage>Was passiert mit B für das Alter, wenn die Gesundheit als zweiter Prädiktor ins Modell kommt?</Frage>
      <p>Mit dem Alter allein ergibt die Regression B = 0,008 pro Jahr. Mit der Gesundheit im Modell ist B für das Alter 0,024, dreimal so groß. Das Modell vergleicht jetzt Ältere und Jüngere mit gleicher Gesundheit, wie die drei farbigen Linien im Bild.</p>
      <Frage>Wird ein B nicht meistens kleiner, wenn ein Prädiktor dazukommt?</Frage>
      <p>Oft ja. Hier nicht: Die Gesundheit hat den Alterszusammenhang <b>verdeckt</b>, nicht erklärt. Gleich bliebe B nur, wenn Alter und Gesundheit nichts miteinander zu tun hätten. Ältere sind aber seltener gesund.</p>
      <InShort>In einer <b>multiplen Regression</b> stehen mehrere Prädiktoren im Modell. Jedes B sagt dann, wie sich die Vorhersage ändert, wenn sich nur dieser Prädiktor um eins erhöht und die anderen gleich bleiben. Das nennt man <b>konstant halten</b> oder <b>kontrollieren</b>: B für das Alter vergleicht Menschen mit gleicher Gesundheit.</InShort>
      <MoreDetail summary="Warum sich B ändert, und wann nicht">
        <ul>
          <li>B ändert sich, wenn der neue Prädiktor mit beiden zusammenhängt: mit dem alten Prädiktor (Ältere sind seltener gesund) und mit der abhängigen Variable (Gesündere sind zufriedener).</li>
          <li>Hier hat die Gesundheit den Zusammenhang verdeckt: B steigt. Häufiger ist der umgekehrte Fall: Ein Teil des Zusammenhangs gehört eigentlich zum neuen Prädiktor, und B wird kleiner. Welcher Fall in Aufgabe 1 eintritt, findest du dort selbst heraus.</li>
          <li>Hängt der neue Prädiktor mit dem alten gar nicht zusammen, bleibt B fast gleich. Dann steigt nur R².</li>
          <li>R² steigt hier von 0,006 (Alter allein) auf 0,190. Die Gesundheit erklärt viel mehr von der Lebenszufriedenheit als das Alter.</li>
          <li>Eine Feinheit: Alter allein rechnet R mit 5.142 Befragten (gewichtet), mit Gesundheit mit 5.128, weil einige keine Gesundheitsangabe haben. Bei so wenigen Fehlenden ändert das die Zahlen kaum.</li>
        </ul>
      </MoreDetail>
      <Mixup>„Mit Gesundheit im Modell“ heißt nicht, dass die Gesundheit aus den Daten entfernt wird. Alle Befragten bleiben drin. Das Modell rechnet nur so, als hätten alle dieselbe Gesundheit.</Mixup>
    </Card>

    <Card id="k1-formel" title="Die Formel wächst: + dlage" badge={<Bezug href="#a1-2">zu Schritt 3</Bezug>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">Für Schritt 3 holst du keine neue Vorlage. Du änderst im Journal eine Stelle im Block aus Schritt 2: In der Formel kommt ein Prädiktor dazu.</p>
      <FormulaGrows />
      <Frage>Wo genau änderst du?</Frage>
      <p>In Zeile 9 des Blocks steht <code>linear_regression(demo ~ lage, weights = wghtpew)</code>, mit <code>lage</code> gelb markiert. Dahinter schreibst du <code>+ dlage</code>, sodass dort <code>demo ~ lage + dlage</code> steht. <code>dlage</code> gibt es schon: Die Vorlage bildet es in Zeile 7. Dann führst du den Block erneut aus. Die alte Ausgabe wird dabei ersetzt; wer beide Modelle vergleichen will, notiert sich die Zahlen aus Schritt 2 vorher.</p>
      <Frage>Woran siehst du, dass es geklappt hat?</Frage>
      <p>Im Kopf der Ausgabe steht in der Zeile „Formula“ jetzt <code>demo ~ lage + dlage</code>, und unter Coefficients gibt es eine eigene Zeile für <code>dlage</code>. Jeder Prädiktor bekommt dort sein eigenes B.</p>
      <Frage>Warum ändert sich N ein wenig?</Frage>
      <p>Im Modell zählt nur, wer bei allen Variablen der Formel einen gültigen Wert hat. Fehlt jemandem die Einschätzung der Lage Deutschlands, fällt er jetzt heraus. Das nennt man fallweisen Ausschluss (listwise).</p>
      <InShort><b>Fallweiser Ausschluss</b> (listwise): Ins Modell geht nur ein, wer bei allen Variablen der Formel einen gültigen Wert hat. Mit jedem Prädiktor kann N darum etwas kleiner werden.</InShort>
      <Mixup>Komma statt Plus. <code>demo ~ lage, dlage</code> gibt keinen Fehler, aber R rechnet still das Modell nur mit <code>lage</code>. Prüf in der Ausgabe die Zeile „Formula“: Dort muss jeder Prädiktor stehen.</Mixup>
    </Card>

    <Card id="k1-vorhersage" title="Formel lesen lernen: Vorhersage mit zwei Prädiktoren" badge={<Bezug href="#a1-2">zu Schritt 3</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Ein Modell mit zwei Prädiktoren macht für jede Person eine Vorhersage. Am Modell aus Alter und Gesundheit (aus <a href="#r1">„R lesen“</a>): Frau A ist 40 Jahre alt, Herr B ist 50, beide schätzen ihre Gesundheit als „gut“ ein (gesund = 4).</p>
      <FormulaTwo />
      <p>Von links nach rechts gelesen: Starte bei der Konstante, leg für jedes Jahr 0,024 dazu und für jede Gesundheitsstufe 0,861. Vergleichst du zwei Personen, die sich nur in einem Prädiktor unterscheiden, fällt alles andere weg. Genau das ist „konstant halten“.</p>
      <Frage>Zwei Personen sind gleich alt. Eine schätzt ihre Gesundheit „sehr gut“ ein (5), die andere „zufriedenstellend“ (3). Um wie viel liegt die Vorhersage der ersten höher?</Frage>
      <p>Um 1,722: zwei Stufen mal 0,861. Das Alter fällt weg, weil es bei beiden gleich ist. Eine Stufe allein wären nur 0,861; von 3 bis 5 sind es zwei.</p>
      <InShort>Die <b>Vorhersage</b> einer multiplen Regression ist Konstante plus jedes B mal seinem Wert. Unterscheiden sich zwei Personen nur in einem Prädiktor, ist ihr Unterschied genau dieses B mal den Unterschied im Prädiktor.</InShort>
      <MoreDetail summary="Was die Konstante hier heißt">
        <p>Die Konstante 3,095 ist die Vorhersage für Alter 0 und Gesundheit 0. Beides gibt es nicht (gesund reicht von 1 bis 5). Die Konstante ist hier nur der Startwert der Rechnung, keine Aussage über Menschen. Das kennst du aus Sitzung 9. Bei Dummies (<a href="#g2">Verstehen zu Aufgabe 2</a>) bekommt sie wieder eine Bedeutung.</p>
      </MoreDetail>
      <Mixup>B der Gesundheit (0,861) ist viel größer als B des Alters (0,024). Das heißt nicht, dass die Gesundheit 36-mal so wichtig ist: Ein Jahr ist ein viel kleinerer Schritt als eine Gesundheitsstufe. Wie man fair vergleicht, zeigt <a href="#k3-beta">„Wer wiegt mehr? Beta“</a>.</Mixup>
    </Card>

    <Card id="k1-kontrolle" title="Was kontrollieren heißt, und was nicht" badge={<Bezug href="#a1-3">zu Schritt 4 und 5</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">Zwei Zahlen für das Alter: 0,008 (ohne Gesundheit) und 0,024 (mit Gesundheit). Welche stimmt?</p>
      <Frage>Eine Journalistin fragt: „Unterscheiden sich Ältere und Jüngere mit gleicher Gesundheit in ihrer Lebenszufriedenheit?“ Welche Zahl beantwortet genau diese Frage?</Frage>
      <p>0,024, denn diese Zahl vergleicht Menschen mit gleicher Gesundheit. 0,008 ist nicht falsch, sie beantwortet eine andere Frage: Wie unterscheiden sich Ältere und Jüngere insgesamt, so wie sie sind, also auch mit ihrer schlechteren Gesundheit?</p>
      <InShort>Beide B stimmen. Sie beantworten verschiedene Fragen. Ohne Kontrolle: Wie unterscheiden sich die Gruppen insgesamt? Mit Kontrolle: Wie unterscheiden sie sich, wenn der kontrollierte Prädiktor gleich ist? Sag beim Berichten immer dazu, was konstant gehalten wurde.</InShort>
      <MoreDetail summary="Was man kontrollieren sollte">
        <ul>
          <li>Gut zum Kontrollieren sind <b>gemeinsame Ursachen</b> (Fachbegriff: Confounder; die Drittvariable aus Sitzung 6): Dinge, die vor beiden Variablen feststehen und beide beeinflussen können, etwa Geschlecht oder wo jemand aufgewachsen ist.</li>
          <li>Vorsicht bei <b>Folgen</b>: Die Gesundheit ist zum Teil eine Folge des Alters. Wer sie kontrolliert, fragt nach dem Alter „ohne den Weg über die Gesundheit“. Das ist eine berechtigte Frage, aber nicht dieselbe wie „Wie hängt das Alter mit der Zufriedenheit zusammen?“.</li>
          <li>Nicht kontrollieren solltest du etwas, das sehr Ähnliches misst wie die abhängige Variable oder eher ihre Folge ist. Dann rechnest du einen Teil dessen heraus, was du eigentlich verstehen willst.</li>
          <li>Eine Regression zeigt Zusammenhänge. Auch mit vielen Kontrollen beweist sie keine Ursache: Es kann immer etwas fehlen, das man nicht gemessen hat.</li>
        </ul>
      </MoreDetail>
      <Mixup>„Kontrolliert für Gesundheit“ heißt nicht „Gesundheit spielt keine Rolle“. Es heißt: Der Zusammenhang des Alters ist so berechnet, als wären alle gleich gesund. Die Gesundheit selbst hat ihr eigenes, großes B.</Mixup>
    </Card>

    <Card id="k1-ergebnis" title="Ergebnis festhalten: wo du was abliest" badge={<Bezug href="#a1-4">zu Schritt 5</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">In Schritt 5 hältst du vier Zahlen und zwei Deutungen fest. Jede hat einen Ort.</p>
      <ul className="v-liste">
        <li><b>B von <code>lage</code> allein:</b> Ausgabe aus Schritt 2, unter Coefficients die Zeile <code>lage</code>, Spalte B. Nicht die Spalte Beta und nicht die Zeile (Intercept).</li>
        <li><b>B von <code>lage</code> und B von <code>dlage</code> mit beiden Prädiktoren:</b> Ausgabe nach Schritt 3, dieselbe Spalte.</li>
        <li><b>R Square mit beiden:</b> Model Summary in der Ausgabe nach Schritt 3.</li>
        <li><b>Was die neue Zahl heißt:</b> ein Satz mit „bei gleicher …“ (<a href="#k1-alter">Ein zweiter Prädiktor</a>, Satzmuster im <a href="#k5-satz">Überblick</a>).</li>
        <li><b>Warum sie sich ändert:</b> „Warum sich B ändert, und wann nicht“ in <a href="#k1-alter">Ein zweiter Prädiktor</a>.</li>
      </ul>
      <p>Holst du die Ergebnisse ins Journal, steht dort deine Festlegung aus Schritt 1 daneben. Lag sie daneben, ist das kein Fehler, sondern genau der Moment, für den man vorher festlegt.</p>
    </Card>
  </Abschnitt>;
}

/* ---------- Aufgabe 2 ---------- */
export function Verstehen2() {
  return <Abschnitt id="g2" n={2} titel="Prägung oder Ort?"
    frage="Im Osten sind die Befragten im Schnitt weniger zufrieden mit der Demokratie. Liegt das daran, wo jemand aufgewachsen ist, oder daran, wo er heute lebt?"
    ziel="für vier Gruppen den Abstand zu einer Referenzgruppe und kannst sagen, ob die Umgezogenen eher ihrer Herkunft oder ihrem Wohnort ähneln, und hast gezeigt, dass ein Wechsel der Referenz die B ändert, die Vorhersagen aber nicht."
    weg={[
      ['Schritt 1', '#a2-p', 'Erst festlegen: Prägung, Ort oder weder noch?', 'k2-gruppen'],
      ['Schritt 2', '#a2-1', 'Herkunft und Wohnort als Dummies', 'k2-dummies'],
      ['Schritt 2', '#a2-1', 'warum ein Dummy draußen bleibt', 'k2-falle'],
      ['Schritt 3', '#a2-2', 'Vorhersage einer Gruppe mit R als Taschenrechner', 'k2-zwei'],
      ['Schritt 4', '#a2-3', 'die Referenz wechseln', 'k2-wechsel'],
      ['Schritt 5', '#a2-4', 'Deuten: Muster und Unsicherheit', 'k2-deuten'],
      ['Schritt 6', '#a2-5', 'Ergebnis festhalten', 'k2-deuten'],
    ]}>

    <Card id="k2-gruppen" title="Vier Gruppen: Herkunft und Wohnort" badge={<Bezug href="#a2-p">zu Schritt 1</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Die Variable <code>dg03</code> teilt die Befragten in vier Gruppen: wo sie ihre Jugend verbracht haben, im Osten oder im Westen, und wo sie heute befragt wurden.</p>
      <FourGroups />
      <Frage>Was müsste man sehen, wenn die Prägung zählt, und was, wenn der Ort zählt?</Frage>
      <p><b>Prägung:</b> Wer im Osten aufwuchs, bleibt so zufrieden oder unzufrieden wie dort, egal wo er heute lebt. Dann ähneln die Ost→West-Umgezogenen den Ost-Bleibenden: Im Raster wären die Gruppen einer Zeile gleich. <b>Ort:</b> Es zählt, wo man heute lebt. Dann ähneln die West→Ost-Umgezogenen den Ost-Bleibenden: Gleich wären die Gruppen einer Spalte. Liegen beide Umzugsgruppen nah bei den West-Bleibenden, passt keins der beiden Bilder. Diese drei Möglichkeiten stehen in Schritt 1 zur Wahl.</p>
      <Frage>Warum kommt es so sehr auf die Umgezogenen an?</Frage>
      <p>Nur bei ihnen fallen Herkunft und Wohnort auseinander. Bei den Bleibenden steckt beides in derselben Gruppe. Allerdings sind die Umgezogenen wenige: Von den Befragten mit Demokratiefrage sind 91 von Ost nach West und 97 von West nach Ost gezogen (gezählt, nicht gewichtet). Was das für die Sicherheit der Zahlen heißt, steht in <a href="#k2-deuten">„Muster und Unsicherheit deuten“</a>.</p>
      <InShort>Vier Gruppen ohne Reihenfolge kommen nicht als eine Zahl ins Modell, sondern als <b>Dummyvariablen</b>: eine 0/1-Variable je Gruppe.</InShort>
    </Card>

    <Card id="k2-dummies" title="Mehr als zwei Gruppen: ein Dummy je Gruppe, eine bleibt draußen" badge={<Bezug href="#a2-1">zu Schritt 2</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Am Familienstand siehst du, wie das geht. Er hat fünf Gruppen: verheiratet (1), verheiratet getrennt lebend (2), verwitwet (3), geschieden (4), ledig (5). Die Codes 1 bis 5 sind nur Namen, keine Stufen. „Geschieden“ ist nicht „doppelt so viel“ wie „getrennt lebend“. Darum bekommt jede Gruppe ihre eigene 0/1-Variable.</p>
      <DummyTable />
      <p>Ins Modell kommen nur vier der fünf Dummies. Die Gruppe, die draußen bleibt, heißt <b>Referenzgruppe</b>. Ihr Mittelwert ist die Konstante, und jedes B ist der Abstand einer Gruppe zur Referenz. Welche Gruppe die Referenz ist, entscheidest du.</p>
      <Frage>Wie sieht das in der Vorlage von Schritt 2 aus?</Frage>
      <Code k="a2" />
      <ul className="v-liste">
        <li><code>demo</code> entsteht wie in Aufgabe 1: <code>ps03</code> umgepolt.</li>
        <li><code>to_dummy(dg03)</code> hängt vier 0/1-Variablen an: <code>dg03_1</code> bis <code>dg03_4</code>. Die Zahl hinter dem Unterstrich ist der Code der Gruppe (<a href="#r3">„Neu: to_dummy()“</a>).</li>
        <li>In der Formel stehen drei davon. <code>dg03_4</code> fehlt, also sind die West-Bleibenden die Referenz. Die Konstante (Intercept) ist ihr Mittelwert, die drei B sind die Abstände der anderen Gruppen zu ihnen.</li>
        <li>Die gelbe Stelle <code>dg03_1</code> in Zeile 9 tauschst du in Schritt 4.</li>
      </ul>
      <InShort>Eine Variable mit k Gruppen kommt als <b>k − 1 Dummies</b> ins Modell. Die weggelassene Gruppe ist die <b>Referenzgruppe</b>: Die Konstante ist ihr Mittelwert, jedes B der Abstand einer Gruppe zu ihr.</InShort>
      <MoreDetail summary="Welche Referenz wählen?">
        <ul>
          <li>Nimm als Referenz die Gruppe, mit der du vergleichen willst. Oft ist das die größte Gruppe oder eine, die man als „normal“ ansieht. Sag im Bericht immer, welche Gruppe die Referenz ist.</li>
          <li>Eine sehr kleine Referenzgruppe ist ungünstig: Ihr Mittelwert ist unsicher, und damit werden alle B unsicher. Mit „getrennt lebend“ (85 Befragte gewichtet) als Referenz sind die Konfidenzintervalle viel breiter als mit „verheiratet“ (2.823).</li>
          <li>Signifikanz gilt immer für den Abstand zur Referenz. „Geschieden ist nicht signifikant“ heißt nur: nicht deutlich anders als die Referenz.</li>
          <li>Es gibt eine Abkürzung: Mit <code>to_label(mstat)</code> vor <code>linear_regression()</code> macht R die Dummies selbst und nimmt die erste Gruppe als Referenz. Darauf weist die Notiz „Use to_label() first …“ in der Ausgabe hin. Heute nutzt du <code>to_dummy()</code>, weil du dann selbst siehst und wählst, wer die Referenz ist.</li>
        </ul>
      </MoreDetail>
      <Mixup>B eines Dummys ist nicht der Mittelwert der Gruppe, sondern ihr Abstand zur Referenz. Der Mittelwert ist Konstante plus B.</Mixup>
    </Card>

    <Card id="k2-falle" title="Die Dummyfalle, und warum die Codes nicht als Zahl ins Modell gehören" badge={<Bezug href="#a2-1">zu Schritt 2</Bezug>} tag={{ kind: 'interpret', label: 'Hintergrund' }}>
      <p className="lead">Was passiert, wenn du alle fünf Dummies des Familienstands ins Modell nimmst? R meldet: <code>ℹ Excluded due to perfect collinearity (matching SPSS): `mstat_5`</code> und rechnet mit vier.</p>
      <Frage>Warum wirft R den fünften Dummy hinaus?</Frage>
      <p>Weil er nichts Neues sagt: Wer bei den anderen vier überall 0 hat, ist ledig. Der fünfte Dummy steckt vollständig in den anderen vier. Ein Modell kann zwei Dinge, die immer zusammen auftreten, nicht auseinanderhalten. Das nennt man perfekte Multikollinearität, mehr dazu in <a href="#k3-vif">„Multikollinearität“</a>. Mit der Größe der Gruppe hat das nichts zu tun: Ledige sind mit 1.459 (gewichtet) die zweitgrößte Gruppe. Und R rechnet auch mit viel mehr als vier Prädiktoren.</p>
      <InShort>Die <b>Dummyfalle</b>: Alle Dummies einer Variable zusammen sagen nichts Neues, weil jede Person in genau einer Gruppe ist. Darum bleibt eine draußen. mariposa wirft sie selbst hinaus und meldet es; welche Gruppe dann die Referenz ist, steht in der Meldung.</InShort>
      <MoreDetail summary="Codes als Zahl: was dann passiert">
        <p>Nimmst du <code>mstat</code> ohne Dummies ins Modell, rechnet R mit den Codes 1 bis 5, als wären es Stufen. Heraus kommt B = −0,171 „pro Stufe Familienstand“, als wäre „ledig“ (5) viermal so weit weg von „verheiratet“ wie „getrennt lebend“ (2). Das ergibt keinen Sinn. Die Notiz „labelled predictor mstat entered with its numeric codes“ warnt dich davor.</p>
      </MoreDetail>
      <Mixup>Eine Zahl im Datensatz macht eine Variable nicht zu einer Stufe (Codes sind oft nur Namen, kennst du aus Sitzung 2). Familienstand, Partei oder Herkunft kommen als Dummies ins Modell, nicht als Zahl.</Mixup>
    </Card>

    <Card id="k2-zwei" title="Zwei Gruppen und die Vorhersage einer Gruppe" badge={<Bezug href="#a2-2">zu Schritt 3</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Die Taschenrechner-Vorlage in Schritt 3 startet mit einem Beispiel (im Kommentar heißt es „Grundlage 2a“): Sind Verheiratete zufriedener mit ihrem Leben? Teil die Befragten in zwei Gruppen: verheiratet und zusammenlebend (1) und alle anderen (0). Im Modell <code>ls01 ~ verheiratet</code> rechnet R: Konstante 7,042, B 0,652.</p>
      <TwoGroups />
      <Frage>Welche mittlere Lebenszufriedenheit sagt das Modell für die Verheirateten voraus?</Frage>
      <p>7,694: 7,042 plus 0,652. Für die Verheirateten ist die Dummyvariable 1, also rechnet man Konstante plus B mal 1. Das ist genau der Mittelwert der Verheirateten (gerundet 7,69). 0,652 allein ist nur der Abstand.</p>
      <Code k="a2_rechnen" />
      <p>Genau diese Rechnung steht in der Vorlage, und R gibt <code>[1] 7.694</code> aus. In der Aufgabe tauschst du die beiden gelben Zahlen gegen die Konstante und das B von <code>dg03_2</code> aus Schritt 2. Dann rechnet R die Vorhersage für die Gruppe Ost→West. Kommazahlen schreibst du mit Punkt, ein Minus gehört mit dazu: Bei einem negativen B steht dort zum Beispiel <code>4.1 + -0.5</code>.</p>
      <InShort>Eine <b>Dummyvariable</b> ist 1 für eine Gruppe und 0 für alle anderen. Im Modell ist die <b>Konstante</b> der Mittelwert der Gruppe mit 0, und <b>B</b> ist der Abstand der Gruppe mit 1 zu ihr. Die Vorhersage einer Gruppe ist Konstante plus ihr B.</InShort>
      <MoreDetail summary="Dasselbe wie ein Mittelwertvergleich">
        <p>Mit nur einer Dummyvariable im Modell ist B genau der Unterschied der beiden Gruppenmittelwerte, den du in Sitzung 7 mit dem t-Test geprüft hast. Der Vorteil der Regression: Du kannst weitere Prädiktoren dazunehmen und den Abstand bei gleichem Alter oder gleicher Gesundheit berechnen.</p>
      </MoreDetail>
      <Mixup>Bei einer Dummyvariable ist „eine Stufe mehr“ der ganze Schritt von der einen Gruppe zur anderen. B = 0,652 heißt nicht „ein bisschen verheirateter“.</Mixup>
    </Card>

    <Card id="k2-wechsel" title="Referenz wechseln: andere B, gleiche Vorhersagen" badge={<Bezug href="#a2-3">zu Schritt 4</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">In Schritt 4 wechselst du die Referenz. Was dabei passiert, zeigt das Bild am Familienstand: Schalte die Referenzgruppe um und beobachte Konstante, Pfeile und Vorhersagen.</p>
      <Reference />
      <Frage>Mit der Referenz „verheiratet“: Wie groß ist B für die Ledigen?</Frage>
      <p>−0,653: Ledige liegen 0,653 Punkte unter den Verheirateten. Mit der Referenz „ledig“ stand dort +0,653 für die Verheirateten: derselbe Abstand, nur von der anderen Seite. Das Vorzeichen gehört dazu.</p>
      <Frage>Was änderst du in Schritt 4 genau?</Frage>
      <p>Im Journal den Block aus Schritt 2: In Zeile 9 tauschst du die gelbe Stelle <code>dg03_1</code> gegen <code>dg03_4</code>. Jetzt fehlt <code>dg03_1</code> in der Formel, und die Ost-Bleibenden sind die Referenz. In der Zeile „Formula“ steht dann <code>demo ~ dg03_4 + dg03_2 + dg03_3</code>. Die Konstante ist jetzt der Mittelwert der Ost-Bleibenden, jedes B der Abstand einer Gruppe zu ihnen. Danach rechnest du im Block aus Schritt 3 die Vorhersage für Ost→West noch einmal: neue Konstante plus neues B von <code>dg03_2</code>.</p>
      <Frage>Und was erwartest du von dieser zweiten Rechnung?</Frage>
      <p>Die Vorhersage einer Gruppe ist ihr Mittelwert, und der hängt nicht davon ab, mit wem man vergleicht. Darum bleibt sie gleich, auch wenn Konstante und B sich ändern. Weicht sie mehr als in der dritten Stelle ab (Rundung), steckt meist ein Tippfehler oder ein fehlendes Minus in der Rechnung.</p>
      <InShort>Andere Referenz, andere Konstante und andere B, aber dieselben <b>Vorhersagen</b>. Welche Referenz du nimmst, entscheidet nur, welche Abstände du direkt ablesen kannst.</InShort>
    </Card>

    <Card id="k2-deuten" title="Muster und Unsicherheit deuten" badge={<Bezug href="#a2-4">zu Schritt 5 und 6</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">Schritt 5 fragt zweierlei: Welches Muster zeigen die Zahlen? Und wie sicher sind sie?</p>
      <Frage>Wie liest du das Muster aus den B?</Frage>
      <p>Mit Referenz West-Bleibende ist jedes B der Abstand zu den West-Bleibenden. Vergleiche die B der beiden Umzugsgruppen mit dem B der Ost-Bleibenden. Liegt das B einer Umzugsgruppe nah am B der Ost-Bleibenden, ähnelt sie ihnen. Liegt es nah bei 0, ähnelt sie den West-Bleibenden. Dann schau, welches der drei Bilder aus <a href="#k2-gruppen">„Vier Gruppen“</a> passt.</p>
      <Frage>Was sagt das Konfidenzintervall dazu?</Frage>
      <p>Das 95-%-Konfidenzintervall (95% CI Lower und Upper, kennst du aus Sitzung 7) zeigt, welche Abstände mit den Daten vereinbar sind. Schließt es 0 ein, ist auch „kein Abstand zur Referenz“ möglich. Lies auch das andere Ende: Welche Abstände schließt das Intervall aus? Je weniger Befragte hinter einer Zahl stehen, desto breiter ist ihr Intervall.</p>
      <Frage>Warum sind die Intervalle der Umzugsgruppen breiter als das der Ost-Bleibenden?</Frage>
      <p>Weil hinter ihnen nur 91 und 97 Befragte stehen, hinter den Ost-Bleibenden 1.003 (gezählt). Was einzelne Personen in so kleinen Gruppen ausmachen, steht in <a href="#k4-einfluss">„Ein einzelner Fall kann die Gerade kippen“</a>.</p>
      <Frage>Und warum steht in der Ausgabe N = 3.222, obwohl 3.254 Befragte gezählt sind?</Frage>
      <p>N ist die Summe der Gewichte. Weil der Osten im ALLBUS absichtlich stärker vertreten ist, zählen Befragte im Osten gewichtet weniger.</p>
      <div className="box-gruen">
        <h6>Wo du die Ergebnisse für Schritt 6 abliest</h6>
        <ul>
          <li>Konstante und B der Ost-Bleibenden: Ausgabe aus Schritt 2, Coefficients, Spalte B, mit Vorzeichen.</li>
          <li>Vorhersage für Ost→West: das Ergebnis der Taschenrechner-Vorlage aus Schritt 3.</li>
          <li>Muster und Konfidenzintervalle: diese Karte.</li>
          <li>Konstante mit Referenz Ost-Bleibende: Ausgabe nach Schritt 4.</li>
        </ul>
      </div>
      <Mixup>Signifikanz gilt immer für den Abstand zur Referenz. „Nicht signifikant“ heißt bei einer Gruppe nur: nicht deutlich anders als die Referenz. Über den Abstand zu den anderen Gruppen sagt es nichts.</Mixup>
    </Card>
  </Abschnitt>;
}

/* ---------- Aufgabe 3 ---------- */
export function Verstehen3() {
  return <Abschnitt id="g3" n={3} titel="Was wiegt mehr, und was bleibt von der Ost-West-Lücke?"
    frage="Welche von vier Eigenschaften hängt am stärksten mit der Demokratiezufriedenheit zusammen, und wie groß bleibt der Abstand zwischen Ost und West, wenn die anderen drei gleich sind?"
    ziel="die Prädiktoren mit Beta verglichen, korrigiertes R² und VIF gelesen und kannst sagen, wie viel von der Ost-West-Lücke bleibt, wenn wirtschaftliche Lage und Abitur konstant gehalten werden."
    weg={[
      ['Schritt 1', '#a3-p', 'Erst festlegen: Wie viel bleibt von der Lücke?', 'k3-luecke'],
      ['Schritt 2', '#a3-1', 'Modell mit vier Prädiktoren: die Vorlage lesen', 'k3-modell'],
      ['Schritt 2', '#a3-1', 'Adjusted R Square', 'k3-r2'],
      ['Schritt 2', '#a3-1', 'Collinearity Statistics (VIF)', 'k3-vif'],
      ['Schritt 3', '#a3-2', 'B und Beta vergleichen', 'k3-beta'],
      ['Schritt 4', '#a3-3', 'die Ost-West-Lücke allein', 'k3-luecke'],
      ['Schritt 5', '#a3-4', 'Ergebnis festhalten', 'k3-luecke'],
    ]}>

    <Card id="k3-modell" title="Vier Prädiktoren, drei Blöcke der Ausgabe" badge={<Bezug href="#a3-1">zu Schritt 2</Bezug>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">Die Vorlage in Schritt 2 sagt die Demokratiezufriedenheit aus vier Prädiktoren vorher. Zwei kennst du aus Aufgabe 1, zwei sind 0/1-Variablen.</p>
      <Code k="a3" />
      <ul className="v-liste">
        <li><code>demo</code>, <code>lage</code> und <code>dlage</code> entstehen wie in Aufgabe 1.</li>
        <li><code>ost = rec(eastwest, rules = "1=0 [West]; 2=1 [Ost]")</code> macht aus dem Wohngebiet eine 0/1-Variable: 1 Osten, 0 Westen (0/1-Variablen mit <code>rec()</code> kennst du aus Sitzung 5).</li>
        <li><code>abitur = rec(educ, rules = "1:3=0 [kein Abitur]; 4:5=1 [Abitur]; else=NA")</code>: 1 heißt Fachhochschulreife oder Abitur, 0 ohne Abschluss, Volks- oder Hauptschule oder Mittlere Reife. <code>else=NA</code> setzt alle übrigen Codes auf fehlend; „anderer Abschluss“ und „noch Schüler“ fallen so aus dem Modell.</li>
        <li>In der Formel stehen alle vier, verbunden mit <code>+</code>.</li>
      </ul>
      <Frage>Wo stehen die Zahlen, die du brauchst?</Frage>
      <p>B und Beta stehen unter <b>Coefficients</b> nebeneinander, R Square und Adjusted R Square unter <b>Model Summary</b>, die VIF ganz unten unter <b>Collinearity Statistics</b>. Wie die Blöcke aussehen, zeigt <a href="#r2">„Die Ausgabe von summary() lesen“</a>.</p>
      <Frage>Was heißt B von <code>ost</code> in diesem Modell?</Frage>
      <p>Den Abstand zwischen Osten und Westen bei gleicher eigener Lage, gleicher Einschätzung der Lage Deutschlands und gleichem Abitur. Wie in Aufgabe 1 gilt jedes B bei gleichen Werten der anderen Prädiktoren (<a href="#k1-alter">„Ein zweiter Prädiktor“</a>).</p>
      <InShort>Bei einer <b>0/1-Variable</b> ist B der Abstand der Gruppe 1 zur Gruppe 0, bei mehreren Prädiktoren bei gleichen Werten der anderen.</InShort>
    </Card>

    <Card id="k3-beta" title="Wer wiegt mehr? Beta" badge={<Bezug href="#a3-2">zu Schritt 2 und 3</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Im Modell aus <a href="#r1">„R lesen“</a> ist B für das Alter 0,024 pro Jahr und für die Gesundheit 0,861 pro Stufe. Ein Jahr und eine Gesundheitsstufe sind verschieden große Schritte. Fair vergleichen kannst du erst, wenn beide in derselben Einheit gemessen sind. Diese Einheit ist die Standardabweichung: ein typischer Abstand vom Mittelwert (kennst du aus Sitzung 3).</p>
      <BetaRuler />
      <h6 className="zwischen">Formel lesen lernen</h6>
      <FormulaBeta />
      <p>Von innen nach außen: Erst rechnest du B auf einen typischen Schritt des Prädiktors um (mal SD des Prädiktors). Dann drückst du das Ergebnis in typischen Schritten der abhängigen Variable aus (geteilt durch ihre SD). So haben alle Prädiktoren dieselbe Einheit.</p>
      <Frage>Welcher Prädiktor hängt also stärker mit der Lebenszufriedenheit zusammen?</Frage>
      <p>Die Gesundheit: Beta 0,454 gegen 0,225, etwa doppelt so viel. Pro Standardabweichung bringt das Alter 0,43 Punkte, die Gesundheit 0,87. Mit B allein könnte man das nicht sagen, weil Jahre und Stufen verschieden sind.</p>
      <Frage>Was heißt das für Schritt 3?</Frage>
      <p>Zum Vergleichen der vier Prädiktoren nimmst du die Spalte Beta und vergleichst die Zahlen ohne Vorzeichen; ein negatives Beta heißt nur, dass die Richtung umgekehrt ist. Weicht die Reihenfolge der B von der Reihenfolge der Beta ab, liegt das an den Einheiten: Bei einer Variable mit fünf Stufen ist ein Schritt eine Stufe, bei einer 0/1-Variable der ganze Weg von einer Gruppe zur anderen.</p>
      <InShort>Der <b>standardisierte Koeffizient Beta</b> ist B in Standardabweichungen: Um wie viele Standardabweichungen ändert sich die Vorhersage, wenn der Prädiktor um eine Standardabweichung steigt? Mit Beta vergleichst du Prädiktoren in einem Modell. B brauchst du für Vorhersagen und für Sätze in der Einheit der Variable.</InShort>
      <MoreDetail summary="Grenzen von Beta">
        <ul>
          <li>In Sitzung 9 war Beta mit nur einer UV gleich der Korrelation r. Mit mehreren Prädiktoren gilt das nicht mehr: Beta ist dann der Zusammenhang bei gleichen Werten der anderen Prädiktoren, in Standardabweichungen.</li>
          <li>Beta vergleicht nur innerhalb eines Modells und derselben Daten. Zwischen Studien oder Gruppen vergleicht man besser B.</li>
          <li>Bei 0/1-Variablen hängt Beta auch davon ab, wie groß die Gruppen sind: Ein großer Abstand, der nur wenige betrifft, bekommt ein kleines Beta. Beta sagt dann: Wie viel bewegt dieser Prädiktor in der ganzen Bevölkerung? Den Abstand zwischen den Gruppen liest du an B.</li>
          <li>Rechnest du mit den gerundeten Zahlen nach, weicht das Ergebnis manchmal in der dritten Stelle ab: 0,024 × 18,212 ÷ 1,919 ergibt 0,228, R gibt 0,225 aus, weil es mit dem ungerundeten B (0,0237) rechnet.</li>
          <li>Die Konstante hat kein Beta. Darum ist ihre Zelle in der Spalte Beta leer.</li>
        </ul>
      </MoreDetail>
      <Mixup>Das größte B ist nicht automatisch der stärkste Prädiktor. B hängt an der Einheit: In Monaten gemessen hätte das Alter ein zwölfmal kleineres B, in Jahrzehnten ein zehnmal größeres. Beta bleibt gleich.</Mixup>
    </Card>

    <Card id="k3-r2" title="R² steigt immer: das korrigierte R²" badge={<Bezug href="#a3-1">zu Schritt 2</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Jeder zusätzliche Prädiktor lässt R² steigen, auch einer, der mit nichts zu tun hat. Ein Beispiel mit 30 Befragten: Die Lebenszufriedenheit wird aus der Gesundheit vorhergesagt. Dann kommen Würfel dazu, für jede Person einmal gewürfelt. Klick dich durch.</p>
      <Dice />
      <h6 className="zwischen">Formel lesen lernen</h6>
      <FormulaAdjR2 />
      <p>Von innen nach außen: Der nicht erklärte Teil (1 − R²) wird mit einem Bruch etwas größer gemacht. Der Bruch ist umso größer, je mehr Prädiktoren auf je weniger Befragte kommen. Bei Tausenden Befragten ist er fast 1.</p>
      <Frage>Im Modell aus „R lesen“ sind R² und korrigiertes R² beide 0,190. Warum ziehen die zwei Prädiktoren dort fast nichts ab?</Frage>
      <p>Weil auf jeden Prädiktor über 2.500 Befragte kommen: 5.128 Befragte, 2 Prädiktoren. Ob das Modell gut ist oder die Prädiktoren wichtig sind, spielt für den Abzug keine Rolle; er hängt nur an n und k. Wichtig wird das korrigierte R² bei kleinen Gruppen und vielen Prädiktoren.</p>
      <InShort><b>R²</b> steigt mit jedem Prädiktor, auch einem nutzlosen. Das <b>korrigierte R²</b> (Adjusted R Square) zieht für jeden Prädiktor etwas ab und steigt nur, wenn ein neuer Prädiktor mehr erklärt, als ein Zufallsprädiktor wie ein Würfel im Schnitt erklären würde. Vergleichst du Modelle mit verschieden vielen Prädiktoren, nimm das korrigierte R².</InShort>
      <MoreDetail summary="Wann der Unterschied zählt">
        <p>Bei den meisten ALLBUS-Modellen mit Tausenden Befragten liegen R² und korrigiertes R² gleichauf. Rechnest du aber nur mit einer kleinen Gruppe, etwa den 91 Ost→West-Umgezogenen aus Aufgabe 2, und nimmst viele Prädiktoren, kann R² gut aussehen, während das korrigierte R² fast null ist. Das korrigierte R² kann sogar negativ werden: Dann erklärt das Modell weniger, als so viele Prädiktoren schon durch Zufall erklären würden.</p>
      </MoreDetail>
      <Mixup>Ein höheres R² heißt nicht, dass jeder Prädiktor etwas beiträgt. Ob ein einzelner Prädiktor etwas beiträgt, siehst du an seinem B, seinem Konfidenzintervall und seiner Signifikanz.</Mixup>
    </Card>

    <Card id="k3-vif" title="Zwei Prädiktoren, die fast dasselbe sagen: Multikollinearität" badge={<Bezug href="#a3-1">zu Schritt 2</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Was passiert, wenn zwei Prädiktoren fast dasselbe messen? Nimm zum Alter in Jahren noch die Altersgruppe dazu (<code>agec</code>: 18–29, 30–44 und so weiter). Wer 70 ist, ist auch in der Gruppe 60–74. Die beiden laufen fast immer zusammen.</p>
      <VifCircles />
      <Frage>Im Modell mit Alter und Altersgruppe ist die Altersgruppe nicht signifikant (Sig. ,153). Heißt das, dass das Alter in Gruppen nichts mit der Zufriedenheit zu tun hat?</Frage>
      <p>Nein. Alter und Altersgruppe teilen sich fast dieselbe Information, und das Modell kann sie nicht auseinanderhalten. Allein mit der Gesundheit hat die Altersgruppe ein deutliches B (0,344 pro Gruppe, Sig. &lt;,001, VIF 1,1). Erst neben dem Alter in Jahren verliert sie, weil fast alles, was sie weiß, schon im Alter steckt.</p>
      <InShort><b>Multikollinearität</b> heißt: Prädiktoren hängen so eng zusammen, dass das Modell ihre Anteile kaum trennen kann. Die B werden unsicher (große Standardfehler) und können springen. Der <b>VIF</b> (Varianzinflationsfaktor) misst das je Prädiktor: 1 heißt unabhängig von den anderen, ab 10 meldet mariposa ein Problem, manche sagen schon ab 5.</InShort>
      <MoreDetail summary="VIF und Toleranz lesen">
        <ul>
          <li>Die <b>Toleranz</b> ist 1 geteilt durch den VIF. Sie sagt, welcher Anteil eines Prädiktors nicht schon in den anderen steckt. Toleranz 0,053 beim Alter heißt: Nur gut 5 % der Streuung des Alters stecken nicht schon in den anderen Prädiktoren, hier vor allem in der Altersgruppe.</li>
          <li>Was tun? Einen der beiden weglassen oder beide zu einem Index zusammenfassen (Sitzung 8). Wichtig ist, dass jeder Prädiktor etwas Eigenes misst.</li>
          <li>Die Dummyfalle (<a href="#k2-falle">Verstehen zu Aufgabe 2</a>) ist der Extremfall: Der fünfte Dummy steckt ganz in den anderen vier, der VIF wäre unendlich. Darum wirft R ihn hinaus.</li>
          <li>In Modellen mit Interaktion (<a href="#k4-interaktion">Verstehen zu Aufgabe 4</a>) ist ein höherer VIF normal, weil die Interaktion aus den beiden Prädiktoren gebaut ist. Dort deutet man ihn nicht als Problem.</li>
        </ul>
      </MoreDetail>
      <Mixup>Multikollinearität heißt nicht, dass Prädiktor und abhängige Variable eng zusammenhängen. Das ist erwünscht. Gemeint ist der Zusammenhang der Prädiktoren untereinander.</Mixup>
    </Card>

    <Card id="k3-luecke" title="Was bleibt von der Lücke? Mit und ohne Kontrollen" badge={<Bezug href="#a3-3">zu Schritt 1, 4 und 5</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">In Schritt 1 legst du fest, wie viel von der Ost-West-Lücke bleibt, wenn Lage und Abitur konstant gehalten werden. Dafür brauchst du zwei Zahlen: B von <code>ost</code> mit den anderen Prädiktoren (Schritt 2) und ohne sie. Die zweite rechnet die Vorlage in Schritt 4.</p>
      <Code k="a3_ost" />
      <Frage>Warum noch ein Modell, nur mit <code>ost</code>?</Frage>
      <p>Hier ist B von <code>ost</code> die Lücke insgesamt: der Abstand zwischen Osten und Westen, so wie die Menschen sind, mit ihrer Lage und ihrem Abschluss. Im Modell aus Schritt 2 ist es die Lücke bei gleicher Lage und gleichem Abitur. Beide Zahlen stimmen, sie beantworten verschiedene Fragen (<a href="#k1-kontrolle">„Was kontrollieren heißt“</a>).</p>
      <Frage>Wie sagst du, wie viel von der Lücke bleibt?</Frage>
      <p>Teil das B mit Kontrollen durch das B ohne Kontrollen. Wäre die Lücke ohne Kontrollen zum Beispiel −0,8 und mit Kontrollen −0,4, bliebe die Hälfte (0,4 ÷ 0,8 = 0,5). Je näher das Ergebnis an 1 liegt, desto weniger hängt die Lücke mit Unterschieden in den kontrollierten Variablen zusammen.</p>
      <Frage>Und was heißt es, wenn viel oder wenig bleibt?</Frage>
      <p>Bleibt viel, hängt die Lücke nur zum kleinen Teil mit Unterschieden in Lage und Abitur zusammen. Bleibt wenig, hängt sie zum großen Teil damit zusammen. Woran es liegt, sagt das Modell in beiden Fällen nicht: Eine Regression zeigt Zusammenhänge, keine Ursachen.</p>
      <InShort>Anteil, der bleibt = <b>B mit Kontrollen</b> ÷ <b>B ohne Kontrollen</b>.</InShort>
      <div className="box-gruen">
        <h6>Wo du die Ergebnisse für Schritt 5 abliest</h6>
        <ul>
          <li>Größtes Beta und Beta von <code>lage</code>: Ausgabe aus Schritt 2, Spalte Beta (<a href="#k3-beta">Beta</a>).</li>
          <li>Welcher Satz über B und Beta stimmt: <a href="#k3-beta">„Was heißt das für Schritt 3?“</a></li>
          <li>Korrigiertes R²: Model Summary, Zeile Adjusted R Square (<a href="#k3-r2">korrigiertes R²</a>).</li>
          <li>Was die VIF sagen: Collinearity Statistics (<a href="#k3-vif">Multikollinearität</a>).</li>
          <li>B von <code>ost</code> allein: Ausgabe aus Schritt 4.</li>
        </ul>
      </div>
    </Card>
  </Abschnitt>;
}

/* ---------- Aufgabe 4 ---------- */
export function Verstehen4() {
  return <Abschnitt id="g4" n={4} titel="Ist die Ost-West-Lücke mit Abitur kleiner?"
    frage="Sind Befragte mit Abitur im Osten ähnlich zufrieden mit der Demokratie wie im Westen, oder gilt die Ost-West-Lücke für beide gleich?"
    ziel="eine Interaktion gerechnet und gelesen, die Lücke in zwei Gruppen ausgerechnet und begründet, ob sie sich unterscheidet. Dazu kannst du sagen, warum kleine Gruppen vorsichtig machen."
    weg={[
      ['Schritt 1', '#a4-p', 'Erst festlegen: Ist die Lücke mit Abitur anders?', 'k4-interaktion'],
      ['Schritt 2', '#a4-1', 'eine Lücke für alle', 'k4-interaktion'],
      ['Schritt 3', '#a4-2', 'Plus gegen Sternchen tauschen', 'k4-stern'],
      ['Schritt 4', '#a4-3', 'die Lücke in der zweiten Gruppe ausrechnen', 'k4-rechnen'],
      ['Schritt 5', '#a4-4', 'Deuten: nicht signifikant heißt nicht gleich', 'k4-deuten'],
      ['Schritt 5', '#a4-4', 'Deuten: was kleine Gruppen vorsichtig macht', 'k4-einfluss'],
      ['Schritt 6', '#a4-5', 'Ergebnis festhalten', 'k4-deuten'],
    ]}>

    <Card id="k4-interaktion" title="Gilt ein Abstand für alle? Interaktion" badge={<Bezug href="#a4-p">zu Schritt 1 und 2</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Sind Erwerbstätige zufriedener mit ihrem Leben als Nicht-Erwerbstätige? Das hängt vom Alter ab. Unter 60 heißt „nicht erwerbstätig“ oft arbeitslos, krank oder in Ausbildung, ab 60 meist in Rente.</p>
      <InteractionPlot />
      <p>Im Modell schreibt man dafür <code>ls01 ~ erwerb * ab60</code>. R gibt vier Zeilen aus: Konstante 6,339 (nicht erwerbstätig, unter 60), <code>erwerb</code> 1,091 (Abstand der Erwerbstätigen unter 60), <code>ab60</code> 1,233 (Abstand der Älteren zu den Jüngeren, beide nicht erwerbstätig), <code>erwerb:ab60</code> −1,035 (um so viel ist der Erwerbs-Abstand ab 60 anders). Der Doppelpunkt bezeichnet die Interaktion.</p>
      <Frage>Und was rechnet die Vorlage in Schritt 2?</Frage>
      <Code k="a4" />
      <p>Mit <code>+</code> zwischen <code>ost</code> und <code>abitur</code> nimmt das Modell an, dass die Ost-West-Lücke mit und ohne Abitur gleich groß ist: eine Lücke für alle. Ob das stimmt, prüft erst das Modell mit <code>*</code> in Schritt 3.</p>
      <InShort>Eine <b>Interaktion</b> heißt: Der Zusammenhang eines Prädiktors hängt vom Wert eines anderen ab. In R schreibst du <code>*</code> statt <code>+</code>. Die Zeile mit dem Doppelpunkt sagt, um wie viel der Abstand in der zweiten Gruppe anders ist.</InShort>
      <MoreDetail summary="B lesen, wenn eine Interaktion im Modell ist">
        <ul>
          <li>Mit Interaktion gilt B von <code>erwerb</code> nur für die Gruppe, in der <code>ab60</code> 0 ist, also unter 60. Es ist kein Durchschnitt über alle mehr.</li>
          <li>Ohne Interaktion (<code>ls01 ~ erwerb + ab60</code>) nimmt das Modell an, dass der Abstand in beiden Altersgruppen gleich ist. Das ist eine Voraussetzung: Stimmt sie nicht, beschreibt ein einzelnes B niemanden richtig.</li>
          <li>Die VIF steigen in Modellen mit Interaktion, weil <code>erwerb:ab60</code> aus <code>erwerb</code> und <code>ab60</code> gebaut ist. Das ist hier kein Problem (<a href="#k3-vif">Multikollinearität</a>).</li>
        </ul>
      </MoreDetail>
      <Mixup>Interaktion heißt nicht, dass zwei Prädiktoren miteinander zusammenhängen. Erwerbstätigkeit und Alter hängen zusammen (Ältere sind seltener erwerbstätig), das ist Thema von <a href="#k1-alter">Aufgabe 1</a> und <a href="#k3-vif">Multikollinearität</a>. Interaktion heißt: Der Abstand, den der eine Prädiktor macht, ist je nach dem anderen verschieden.</Mixup>
    </Card>

    <Card id="k4-stern" title="Plus gegen Sternchen: die Zeile mit dem Doppelpunkt" badge={<Bezug href="#a4-2">zu Schritt 3</Bezug>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">Für Schritt 3 änderst du im Journal ein einziges Zeichen im Block aus Schritt 2: In Zeile 9 wird das gelbe <code>+</code> zu <code>*</code>. Dann führst du den Block erneut aus.</p>
      <Frage>Was steht danach in der Ausgabe?</Frage>
      <p><code>ost * abitur</code> heißt: beide Prädiktoren und dazu ihre Interaktion. Unter Coefficients gibt es jetzt eine dritte Zeile, <code>ost:abitur</code>. Ihr B sagt, um wie viel die Ost-West-Lücke bei Befragten mit Abitur anders ist als ohne.</p>
      <Frage>Warum ändert sich B von <code>ost</code>?</Frage>
      <p>Mit Interaktion gilt B von <code>ost</code> nur noch für die Gruppe, in der <code>abitur</code> 0 ist: Es ist die Lücke ohne Abitur, kein Durchschnitt über alle mehr. Genauso gilt B von <code>abitur</code> jetzt nur für den Westen, wo <code>ost</code> 0 ist.</p>
      <Frage>Was liest du in der Zeile <code>ost:abitur</code>?</Frage>
      <p>Drei Dinge: B (wie groß der Unterschied der Lücke in diesen Daten ist), Sig. (ob er mehr als Zufall sein dürfte) und das Konfidenzintervall (welche Unterschiede mit den Daten vereinbar sind). Wie du die drei zusammen deutest, steht in <a href="#k4-deuten">„Nicht signifikant heißt nicht gleich“</a>.</p>
      <Mixup>Das Sternchen multipliziert hier keine Zahlen aus. In der Formel heißt <code>*</code>: „beide Prädiktoren und ihre Interaktion“, so wie <code>+</code> „und dieser Prädiktor auch“ heißt.</Mixup>
    </Card>

    <Card id="k4-rechnen" title="Den Abstand in der zweiten Gruppe ausrechnen" badge={<Bezug href="#a4-3">zu Schritt 4</Bezug>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">Die Taschenrechner-Vorlage in Schritt 4 startet mit dem Beispiel aus <a href="#k4-interaktion">„Gilt ein Abstand für alle?“</a> (im Kommentar heißt es „Grundlage 4b“): Erwerbstätigkeit und Alter ab 60.</p>
      <Frage>Wie groß ist der Abstand zwischen Erwerbstätigen und Nicht-Erwerbstätigen ab 60 laut Modell?</Frage>
      <p>0,056: B von <code>erwerb</code> plus B von <code>erwerb:ab60</code>, also 1,091 minus 1,035. Ab 60 macht die Erwerbstätigkeit fast keinen Unterschied, unter 60 einen großen (1,091). 1,091 allein wäre nur der Abstand unter 60; ab 60 kommt die Interaktion dazu.</p>
      <Code k="a4_rechnen" />
      <p>Genau diese Rechnung steht in der Vorlage, und R gibt <code>[1] 0.056</code> aus. In der Aufgabe tauschst du die beiden gelben Zahlen gegen B von <code>ost</code> und B von <code>ost:abitur</code> aus Schritt 3. Heraus kommt die Ost-West-Lücke bei Befragten mit Abitur. Kommazahlen mit Punkt, ein Minus gehört mit dazu.</p>
      <InShort>Mit Interaktion ist der Abstand in der zweiten Gruppe <b>B des Prädiktors plus B der Interaktion</b>.</InShort>
    </Card>

    <Card id="k4-deuten" title="Deuten: nicht signifikant heißt nicht gleich" badge={<Bezug href="#a4-4">zu Schritt 5 und 6</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">Schritt 5 fragt: Ist die Lücke mit Abitur anders? Die Antwort steht in der Zeile <code>ost:abitur</code>, aber nicht in einer Zahl allein.</p>
      <Frage>Wie liest du B, Sig. und Konfidenzintervall zusammen?</Frage>
      <p>Ist die Zeile mit dem Doppelpunkt klein und nicht signifikant, zeigen die Daten keinen Hinweis, dass der Abstand in den Gruppen verschieden ist; dann reicht meist das einfachere Modell mit <code>+</code>. „Nicht signifikant“ heißt aber nicht „sicher gleich“ (kennst du aus Sitzung 7). Wie groß ein Unterschied höchstens sein könnte, in die eine wie in die andere Richtung, zeigt das Konfidenzintervall.</p>
      <Frage>Warum ist das für die zwei Sätze im Plenum wichtig?</Frage>
      <p>Weil der eine Satz mehr behauptet als der andere. Prüf bei jedem Satz: Würde er auch noch stimmen, wenn der Unterschied in Wirklichkeit am Rand des Konfidenzintervalls läge?</p>
      <InShort><b>Nicht signifikant</b> heißt: kein Hinweis auf einen Unterschied, nicht „gleich“. Wie groß ein Unterschied höchstens sein könnte, zeigt das <b>Konfidenzintervall</b>.</InShort>
      <div className="box-gruen">
        <h6>Wo du die Ergebnisse für Schritt 6 abliest</h6>
        <ul>
          <li>B von <code>ost:abitur</code>: Ausgabe nach Schritt 3, Spalte B (nicht Beta).</li>
          <li>Lücke mit Abitur: das Ergebnis der Taschenrechner-Vorlage aus Schritt 4.</li>
          <li>Was die Zeile <code>ost:abitur</code> sagt: diese Karte.</li>
          <li>Was kleine Gruppen bedeuten: <a href="#k4-einfluss">„Ein einzelner Fall kann die Gerade kippen“</a>.</li>
        </ul>
      </div>
    </Card>

    <Card id="k4-einfluss" title="Ein einzelner Fall kann die Gerade kippen: Ausreißer und Einfluss" badge={<Bezug href="#a4-4">zu Schritt 5</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Schritt 5 fragt, was kleine Gruppen vorsichtig macht. Was einzelne Personen ausmachen können, zeigt ein Beispiel mit elf Befragten, mit Alter und Lebenszufriedenheit. Die Gerade steigt leicht. Jetzt kommt eine zwölfte Person dazu, Person L. Sie ist sehr unzufrieden (1). Wo sie steht, entscheidet, was mit der Geraden passiert.</p>
      <Frage>In welchem Fall verändert Person L die Steigung am stärksten?</Frage>
      <p>Wenn sie ganz rechts steht und sehr unzufrieden ist. Großen Einfluss hat ein Fall, der beim Prädiktor weit draußen liegt und zugleich weit weg von der Geraden. Hier kippt die Steigung von +0,022 auf −0,042. In der Mitte zieht L die Gerade nur nach unten, ihre Neigung bleibt 0,022. Ganz rechts, aber so zufrieden wie erwartet, bestätigt L die Gerade nur: Steigung 0,020. Schalte die vier Zustände durch.</p>
      <EinflussErklaert />
      <InShort>In der Regression unterscheidet man drei Dinge. Ein <b>Ausreißer</b> liegt weit weg von der Geraden (großes Residuum). Ein Fall mit großer <b>Hebelwirkung</b> (Fachbegriff: Leverage) liegt beim Prädiktor weit draußen. <b>Einfluss</b> hat ein Fall, wenn das Modell ohne ihn deutlich andere B ergibt. Das passiert vor allem, wenn beides zusammenkommt: weit draußen und weit weg von der Geraden.</InShort>
      <MoreDetail summary="Und im ALLBUS?">
        <ul>
          <li>Bei Tausenden Befragten kippt ein Einzelner die Gerade kaum. Bei kleinen Gruppen ist das anders: Eine Gruppe mit wenigen Befragten trägt ihr B allein, und jede einzelne Person zählt darin viel.</li>
          <li>Was tun? Ausreißer nicht einfach löschen. Erst prüfen, ob es ein Fehler ist (wie die wochenlangen Fragebögen in Sitzung 4). Ist es keiner, rechnet man das Modell einmal mit und einmal ohne die auffälligen Fälle und berichtet, ob sich das Ergebnis ändert.</li>
          <li>Für den Einfluss gibt es Maßzahlen, etwa Cooks Distanz; mariposa gibt keine aus. Die Idee dahinter ist genau der Vergleich mit und ohne den Fall. Für diese Prüfung reicht <code>filter()</code> aus Sitzung 2 vor <code>linear_regression()</code>.</li>
        </ul>
      </MoreDetail>
      <Mixup>Ein Ausreißer ist nicht automatisch ein Fehler, und weit draußen heißt nicht automatisch Einfluss: L am Rand auf der Geraden liegt weit draußen, ändert die Steigung aber kaum. L in der Mitte ist ein deutlicher Ausreißer, kippt die Steigung aber nicht.</Mixup>
    </Card>
  </Abschnitt>;
}

/* ---------- Überblick ---------- */
export function Ueberblick() {
  return <section className="grund-block" id="g5" aria-labelledby="g5-h">
    <div className="g-kopf">
      <span className="st m c7" aria-hidden="true">✓</span>
      <div><div className="ueber">Überblick über alle Aufgaben</div><h4 id="g5-h">Ein Modell bauen und prüfen</h4></div>
    </div>
    <p className="g-intro">Alle vier Aufgaben zusammen: wie Variablen ins Modell kommen, was du kontrollierst und was du prüfst.</p>
    <HeadingLevel.Provider value={5}>
      <Card id="k5-weg" title="Wie kommt eine Variable ins Modell?" badge={<Badge>alle Aufgaben</Badge>} tag={{ kind: 'interpret', label: 'Hintergrund' }}>
        <p className="lead">Die erste Frage ist immer: Was für eine Variable ist es? Danach richtet sich, ob sie direkt in die Formel kommt, als 0/1-Variable oder als Dummies.</p>
        <DecisionTree />
        <Frage>Wie passt das zu den Aufgaben?</Frage>
        <ul className="v-liste">
          <li><code>lage</code> und <code>dlage</code> (Aufgabe 1): Stufen mit Reihenfolge, umgepolt, direkt in die Formel.</li>
          <li>Herkunft und Wohnort (Aufgabe 2): vier Gruppen ohne Reihenfolge, mit <code>to_dummy()</code>, einer bleibt als Referenz draußen.</li>
          <li><code>ost</code> und <code>abitur</code> (Aufgabe 3): zwei Gruppen, je eine 0/1-Variable mit <code>rec()</code>.</li>
          <li>Ost-West-Lücke mit und ohne Abitur (Aufgabe 4): Gilt ein Abstand nicht für alle, kommt eine Interaktion mit <code>*</code> dazu.</li>
        </ul>
        <Frage>Und bei Variablen, die in den Aufgaben nicht vorkommen?</Frage>
        <ul className="v-liste">
          <li>Konfession (evangelisch, katholisch, andere, keine): vier Gruppen ohne Reihenfolge, also Dummies mit <code>to_dummy()</code>, eine als Referenz. Die Codes der Konfession sind Namen, keine Stufen.</li>
          <li>Vertrauen in die Polizei, 1 bis 7: sieben Stufen mit Reihenfolge, also direkt in die Formel.</li>
          <li>Deutsche Staatsangehörigkeit, ja oder nein: zwei Gruppen, also eine 0/1-Variable mit <code>rec()</code>.</li>
        </ul>
      </Card>

      <Card id="k5-kontrolle" title="Was du kontrollierst" badge={<Badge>Aufgabe 1 bis 3</Badge>} tag={{ kind: 'interpret', label: 'Hintergrund' }}>
        <table className="daten voll">
          <caption className="sr-only">Was du kontrollierst</caption>
          <thead><tr><th scope="col">Art von Variable</th><th scope="col">Beispiel aus diesem Kapitel</th><th scope="col">kontrollieren?</th></tr></thead>
          <tbody>
            <tr><td>gemeinsame Ursache: steht vor beiden fest</td><td>das Alter, wenn du fragst, wie Gesundheit und Lebenszufriedenheit zusammenhängen</td><td>ja</td></tr>
            <tr><td>Folge oder Zwischenschritt</td><td>Gesundheit beim Alter</td><td>nur, wenn du genau nach „bei gleicher …“ fragst; dann so berichten</td></tr>
            <tr><td>misst sehr Ähnliches wie die abhängige Variable oder ist eher ihre Folge</td><td>Vertrauen in den Bundestag, wenn du nach der Ost-West-Lücke in der Demokratiezufriedenheit fragst (der enge Zusammenhang der beiden: Sitzung 9)</td><td>nein, es rechnet einen Teil dessen heraus, was du messen willst</td></tr>
            <tr><td>misst fast dasselbe wie ein anderer Prädiktor</td><td>Alter und Altersgruppe</td><td>nein, einen weglassen oder Index bilden</td></tr>
          </tbody>
        </table>
        <p>Bei jeder Kontrolle gehört in den Bericht: was konstant gehalten wurde, und was das B dann bedeutet.</p>
      </Card>

      <Card id="k5-voraussetzungen" title="Voraussetzungen: was jede multiple Regression braucht" badge={<Badge>alle Aufgaben</Badge>} tag={{ kind: 'interpret', label: 'Hintergrund' }}>
        <table className="daten voll">
          <caption className="sr-only">Voraussetzungen der multiplen Regression</caption>
          <thead><tr><th scope="col">Voraussetzung</th><th scope="col">So prüfst du</th><th scope="col">Wo im Kapitel</th></tr></thead>
          <tbody>
            <tr><td>abhängige Variable metrisch oder mit vielen Stufen</td><td>Skalenniveau, Codebuch</td><td>Sitzung 9</td></tr>
            <tr><td>linearer Zusammenhang je Prädiktor</td><td>Mittelwerte je Stufe, Punktwolke</td><td>Sitzung 9</td></tr>
            <tr><td>gleiche Fehlervarianz</td><td>Residuen je Stufe, <code>levene_test()</code></td><td>Sitzung 9</td></tr>
            <tr><td>keine starke Multikollinearität</td><td>VIF unter 10 (besser unter 5), keine Dummyfalle</td><td><a href="#k2-falle">Dummyfalle</a>, <a href="#k3-vif">Multikollinearität</a>, <a href="#a3">Aufgabe 3</a></td></tr>
            <tr><td>keine einzelnen Fälle mit großem Einfluss</td><td>Modell mit und ohne auffällige Fälle vergleichen</td><td><a href="#k4-einfluss">Ausreißer und Einfluss</a></td></tr>
            <tr><td>gleicher Zusammenhang für alle</td><td>sonst Interaktion ins Modell</td><td><a href="#k4-interaktion">Interaktion</a>, <a href="#a4">Aufgabe 4</a></td></tr>
            <tr><td>genug Befragte je Gruppe und je Prädiktor</td><td>N, Gruppengrößen, korrigiertes R²</td><td><a href="#a2">Aufgabe 2</a>, <a href="#k3-r2">korrigiertes R²</a></td></tr>
            <tr><td>Aussagen über Deutschland</td><td>gewichtet rechnen</td><td>Sitzung 6</td></tr>
          </tbody>
        </table>
        <p>Für alle gilt: Eine Regression zeigt Zusammenhänge. Ob etwas Ursache ist, entscheidet nicht die Zahl, sondern die Begründung, was vor was kommt und was fehlen könnte.</p>
      </Card>

      <Card id="k5-satz" title="So schreibst du einen Satz über ein B" badge={<Badge>alle Aufgaben</Badge>} tag={{ kind: 'interpret', label: 'Deuten' }}>
        <div className="box-gruen">
          <p className="box-notiz">„Bei gleicher/gleichem [kontrollierte Prädiktoren] geht [ein Schritt im Prädiktor] mit [B] Punkten mehr/weniger [abhängige Variable] einher.“</p>
          <p className="box-notiz">Für Dummies: „[Gruppe] liegt im Mittel [B] Punkte über/unter [Referenzgruppe], bei gleicher/gleichem [Kontrollen].“</p>
        </div>
        <p>Beispiel mit Alter und Gesundheit: „Bei gleicher Gesundheit geht ein Jahr mehr Alter mit 0,024 Punkten mehr Lebenszufriedenheit einher; zehn Jahre mit 0,24 Punkten.“</p>
        <Mixup>„einhergehen“ ist kein umständliches Wort für „bewirken“. Es sagt genau, was die Regression zeigt: Wer höhere Werte hat, hat im Mittel auch höhere Vorhersagen.</Mixup>
      </Card>
    </HeadingLevel.Provider>
  </section>;
}

/* ---------- Themen für den Reiter „Verstehen“ (Reihenfolge, Karten für die rechte Leiste) ---------- */
export const THEMEN: Thema[] = [
  { id: 'vorweg', n: 'R', kurz: 'R lesen', titel: 'Vorweg: R lesen', minuten: 10, Inhalt: Vorweg,
    karten: [['r1', 'Mehrere Prädiktoren'], ['r2', 'Die Ausgabe von summary()'], ['r3', 'Neu: to_dummy()']] },
  { id: 'g1', n: '1', kurz: 'Aufgabe 1', titel: 'Eigene Lage oder Lage des Landes?', minuten: 15, Inhalt: Verstehen1, aufgabe: 1,
    karten: [['k1-variablen', 'Drei Einschätzungen, umgepolt'], ['k1-alter', 'Ein zweiter Prädiktor'], ['k1-formel', 'Die Formel wächst'], ['k1-vorhersage', 'Vorhersage mit zwei Prädiktoren'], ['k1-kontrolle', 'Was kontrollieren heißt'], ['k1-ergebnis', 'Ergebnis festhalten']] },
  { id: 'g2', n: '2', kurz: 'Aufgabe 2', titel: 'Prägung oder Ort?', minuten: 15, Inhalt: Verstehen2, aufgabe: 2,
    karten: [['k2-gruppen', 'Vier Gruppen'], ['k2-dummies', 'Ein Dummy je Gruppe'], ['k2-falle', 'Die Dummyfalle'], ['k2-zwei', 'Vorhersage einer Gruppe'], ['k2-wechsel', 'Referenz wechseln'], ['k2-deuten', 'Muster und Unsicherheit']] },
  { id: 'g3', n: '3', kurz: 'Aufgabe 3', titel: 'Was wiegt mehr, was bleibt von der Lücke?', minuten: 15, Inhalt: Verstehen3, aufgabe: 3,
    karten: [['k3-modell', 'Vier Prädiktoren'], ['k3-beta', 'Wer wiegt mehr? Beta'], ['k3-r2', 'Das korrigierte R²'], ['k3-vif', 'Multikollinearität'], ['k3-luecke', 'Was bleibt von der Lücke?']] },
  { id: 'g4', n: '4', kurz: 'Aufgabe 4', titel: 'Ist die Lücke mit Abitur kleiner?', minuten: 12, Inhalt: Verstehen4, aufgabe: 4,
    karten: [['k4-interaktion', 'Interaktion'], ['k4-stern', 'Plus gegen Sternchen'], ['k4-rechnen', 'Abstand in der zweiten Gruppe'], ['k4-deuten', 'Nicht signifikant heißt nicht gleich'], ['k4-einfluss', 'Ausreißer und Einfluss']] },
  { id: 'g5', n: '✓', kurz: 'Überblick', titel: 'Ein Modell bauen und prüfen', minuten: 5, Inhalt: Ueberblick,
    karten: [['k5-weg', 'Wie kommt eine Variable ins Modell?'], ['k5-kontrolle', 'Was du kontrollierst'], ['k5-voraussetzungen', 'Voraussetzungen'], ['k5-satz', 'Ein Satz über ein B']] },
];

/* ---------- Bilder für die „?“-Fenster der Aufgaben (denk in kapitel.js); nur zeigende Bilder mit Beispielzahlen ---------- */
export const BILDER = { AgeHealth, FormulaGrows, FourGroups, DummyTable, TwoGroups, Reference, BetaRuler, InteractionPlot, EinflussErklaert };
