// Kapitel 5, Reiter „Verstehen“ (Muster aus k04/KONZEPT.md): je Aufgabe erklären, was in jedem Schritt passiert und warum.
// Keine Übungen: keine Eingaben, kein Prüfen, kein Schätzen, kein Zuordnen. Die „Kurz überlegen“-Fragen und „Wer ist 100 %?“
// des Atlas sind hier Fließtext oder rhetorische Fragen mit Antwort; Gruppen zuschneiden und Basis-Schalter zeigen nur.
import { Card, InShort, Mixup, MoreDetail, Badge } from '@atlas/chapter/blocks/Card';
import { HeadingLevel } from '@atlas/chapter/blocks/level';
import { ReadR } from '@atlas/chapter/s05/ReadR';
import { CHI, PREREQUISITES, U1, U1_OPTIONS, WEIGHTED } from '@atlas/chapter/s05/content';
import { ReadingDirectionFigure } from '@atlas/chapter/s05/figures/Bars5';
import { PercentFormula, PointsFormula, RuleFigure, ThreeBasesFigure } from '@atlas/chapter/s05/figures/Tables';
import { UmpolenFigure } from '@atlas/chapter/s05/figures/Towers';
import { de } from '@atlas/chapter/s05/figures/parts';
import type { Thema } from '../../react/typen';
import { Abschnitt, Bezug, Code, Frage } from '../../react/gemeinsam';
import { BasisSchalter, NennerBeispiel, ZuschnittZeigen } from './figuren';

/* ---------- Vorweg ---------- */
export function Vorweg() {
  return <section className="grund-block" id="vorweg" aria-labelledby="vorweg-h">
    <div className="g-kopf">
      <span className="st m c7" aria-hidden="true">R</span>
      <div><div className="ueber">Vorweg, für alle Aufgaben</div><h4 id="vorweg-h">R lesen</h4></div>
    </div>
    <p className="g-intro">Alle vier Aufgaben bauen neue Variablen mit <code>mutate()</code> und <code>rec()</code> und lesen Kreuztabellen mit <code>crosstab()</code>. Hier steht, wie du beides liest, am Beispiel der Erwerbstätigkeit.</p>
    <HeadingLevel.Provider value={5}><ReadR /></HeadingLevel.Provider>
  </section>;
}

/* ---------- Aufgabe 1 ---------- */
export function Verstehen1() {
  return <Abschnitt id="g1" n={1} titel="Zwei Gruppen für die Wahlfrage" frage="Wer misstraut den Politikern, und wer würde nicht wählen?"
    ziel="zwei neue Variablen mit nur 0 und 1, misstrauen und nichtwahl, und kannst sagen, wie groß jede Gruppe ist und wer herausfällt."
    weg={[
      ['Schritt 1', '#a1-p', 'Erst festlegen: Wie viele stimmen der Aussage zu?', 'k1-aussage'],
      ['Schritt 2', '#a1-1', 'die Codes von pe01 und der Fragebogensplit', 'k1-codes'],
      ['Schritt 3', '#a1-2', 'eine Regel lesen und anpassen: misstrauen', 'k1-regel'],
      ['Schritt 3', '#a1-2', 'Hintergrund: Gruppen zuschneiden, leer oder 0', 'k1-zuschnitt'],
      ['Schritt 4', '#a1-3', 'nichtwahl: wer in keiner Regel steht', 'k1-nichtwahl'],
      ['Schritt 5', '#a1-4', 'Ergebnis festhalten: Gruppengrößen, wer herausfällt, mean=', 'k1-ergebnis'],
      ['Schritt 6', '#a1-5', 'Im Bild: zwei neue Türme (nach den richtigen Antworten)', 'k1-ergebnis'],
    ]}>

    <Card id="k1-aussage" title="Worum es geht: zwei Fragen, je zwei Gruppen" badge={<Bezug href="#a1-p">zu Schritt 1</Bezug>} tag={{ kind: 'interpret', label: 'Hintergrund' }}>
      <p className="lead">Die Leitfrage „Gehen Misstrauende nicht mehr wählen?“ verbindet zwei Fragen aus dem ALLBUS 2023. Bei <code>pe01</code> sagen die Befragten, ob sie der Aussage „Die Politiker kümmern sich nicht viel darum, was Leute wie ich denken.“ zustimmen, von „stimme voll zu“ bis „stimme gar nicht zu“. Bei <code>pv01</code> sagen sie, welche Partei sie wählen würden, wenn am nächsten Sonntag Bundestagswahl wäre; Code 91 heißt „würde nicht wählen“.</p>
      <Frage>Warum braucht die Aufgabe aus jeder Frage zwei Gruppen?</Frage>
      <p>Weil eine Kreuztabelle jede Kombination zweier Variablen zählt. Mit vier Stufen bei <code>pe01</code> und allen Parteien bei <code>pv01</code> würde sie unlesbar. Darum fasst du erst zu Gruppen zusammen: misstraut oder nicht, würde wählen oder nicht. Wie du zusammengefasst hast, sagst du später dazu.</p>
      <Frage>Misst <code>pe01</code> überhaupt Misstrauen?</Frage>
      <p>Streng genommen fragt <code>pe01</code>, ob man sich von Politikern beachtet fühlt, nicht nach Vertrauen. Die Aufgabe nennt die Gruppe kurz <code>misstrauen</code>. Wenn du über das Ergebnis berichtest, nennst du die genaue Aussage.</p>
      <InShort><b>Gültigkeit</b> (kennst du aus Sitzung 1) heißt: Eine Frage misst das, was du messen willst. Passt der Name der Variable zu dem, was wirklich gefragt wurde?</InShort>
      <Frage>Und warum sollst du vorher festlegen, wie viele zustimmen?</Frage>
      <p>Wer vorher eine Erwartung notiert, merkt hinterher, wo das eigene Bild von der Gesellschaft danebenlag. Ohne Festlegung wirkt jedes Ergebnis im Nachhinein „klar“. Sind in Schritt 5 alle Fragen richtig, erscheint unter den Fragen, was tatsächlich herauskommt, und im Journal steht deine Festlegung neben dem Ergebnis.</p>
    </Card>

    <Card id="k1-codes" title="Die Codes von pe01 und der Fragebogensplit" badge={<Bezug href="#a1-1">zu Schritt 2</Bezug>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">Bevor du Gruppen bildest, brauchst du die Codes. Die Vorlage in Schritt 2 zählt <code>pe01</code> mit <code>frequency()</code> aus, das kennst du aus Sitzung 3.</p>
      <Code k="a1_freq" />
      <Frage>Was steht in der Ausgabe?</Frage>
      <p>In der Spalte <b>Value</b> steht der Code jeder Antwort, daneben ihr Wort (Label), dann wie viele Befragte sie gegeben haben (<b>N</b>) und ihr Anteil an allen gültigen Antworten (<b>Valid %</b>). Darunter stehen die fehlenden Werte, jeder mit seinem eigenen Aufkleber. Die Codes aus der Spalte Value brauchst du gleich für die Regel.</p>
      <Frage>Warum fehlen bei <code>pe01</code> so viele?</Frage>
      <p>Unten fällt eine große Zahl auf: 1.596 Befragte bei ‚TNZ: SPLIT‘. Diese Frage stand nur in einem Teil der Fragebögen. Diese Menschen haben also nicht verweigert, sie wurden nicht gefragt. Sie fehlen in jeder Auswertung mit <code>pe01</code>, auch später in der Kreuztabelle.</p>
      <InShort>Ein <b>Fragebogensplit</b> heißt: Nicht alle Befragten bekommen alle Fragen. Wer eine Frage nicht bekam, hat keine Antwort, ohne verweigert zu haben.</InShort>
      <Mixup>Links vom <code>=</code> einer Regel stehen Codes aus der Spalte Value, keine Wörter. Schreibst du ein Wort hin, meldet R <code>Invalid old value: "STIMME VOLL ZU"</code>.</Mixup>
    </Card>

    <Card id="k1-regel" title="Eine Regel lesen und anpassen: misstrauen" badge={<Bezug href="#a1-2">zu Schritt 3</Bezug>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">In Schritt 3 baust du die erste neue Variable. Die Vorlage ist gebaut wie <code>teilzeit</code> in <a href="#r2">„R lesen“</a>, nur mit <code>pe01</code>.</p>
      <Code k="a1_misstrauen" />
      <Frage>Was tut jede Zeile?</Frage>
      <ul className="v-liste">
        <li><code>allbus %&gt;%</code> nimmt den ALLBUS und reicht ihn weiter („und dann“).</li>
        <li><code>mutate(misstrauen = …)</code> fügt eine Variable mit dem Namen <code>misstrauen</code> hinzu. <code>pe01</code> bleibt, wie es war.</li>
        <li><code>rec(pe01, rules = "…")</code> kodiert die Codes von <code>pe01</code> nach den Regeln um.</li>
        <li><code>frequency(misstrauen)</code> zählt die neue Variable gleich aus. So prüfst du sofort, ob die Gruppen stimmen.</li>
      </ul>
      <Frage>Wie liest du die Regel?</Frage>
      <p>Jeder Teil heißt ‚aus diesen alten Codes wird dieser neue Code, mit diesem Aufkleber‘. <code>1=1 [misstraut]</code>: Aus Code 1 wird 1 mit dem Aufkleber ‚misstraut‘. <code>2:4=0 [misstraut nicht]</code>: Aus 2 bis 4 wird 0. <code>else=NA</code>: Alles andere wird leer. Gelb markiert sind die alten Codes links vom <code>=</code>. Genau sie passt du im Journal an.</p>
      <Frage>Woher weißt du, welche Codes zu ‚misstraut‘ gehören?</Frage>
      <p>Aus der Aussage und den Wörtern in Schritt 2. Wer der Aussage zustimmt, sagt, dass sich Politiker nicht kümmern, und Zustimmung gibt es in zwei Stärken. Welche Codes diese Antworten haben, liest du in der Spalte Value neben ihren Wörtern ab. Mehrere Codes nacheinander schreibst du von bis mit Doppelpunkt, wie <code>2:3</code> bei <code>teilzeit</code>; Regeln trennt ein Semikolon.</p>
      <Frage>Und was zeigt <code>mean=</code> über der Tabelle?</Frage>
      <p>Bei einer Variable mit nur 0 und 1 zählt jede 1 als eins und jede 0 als null. Der Mittelwert ist dann der Anteil der Einsen. Bei <code>teilzeit</code> aus „R lesen“ steht <code>mean=0.35</code>, und 34,77 % der gültigen Antworten sind 1. Ein Mittelwert von 0,35 heißt also: 35 % sind in Gruppe 1.</p>
      <InShort>Eine <b>Dummyvariable</b> hat nur 0 und 1. 1 heißt „trifft zu“, 0 heißt „trifft nicht zu“. Ihr Mittelwert ist der Anteil der Einsen.</InShort>
      <Mixup>Regeln trennt ein Semikolon <code>;</code>, kein Komma. Mit Komma meldet R <code>Invalid new value</code>.</Mixup>
    </Card>

    <Card id="k1-zuschnitt" title="Gruppen zuschneiden: jede Einteilung ist eine Entscheidung" badge={<Bezug href="#a1-2">zu Schritt 3</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Wie viel eine Regel entscheidet, siehst du gut an einer Frage, die in der Aufgabe nicht vorkommt. Der ALLBUS 2023 fragt, ob jemand berufstätig ist: Vollzeit, Teilzeit, nebenher oder nicht erwerbstätig. Für die Frage „Wie viele Erwerbstätige arbeiten Teilzeit?“ braucht man zwei Gruppen. Wer kommt in welche Gruppe, und wer zählt gar nicht mit? Schalte durch sechs Einteilungen.</p>
      <ZuschnittZeigen />
      <Frage>Warum kommt jedes Mal eine andere Zahl heraus?</Frage>
      <p>Weil jede Einteilung eine andere Frage beantwortet. Bleibt eine Antwort leer, fällt sie aus dem Nenner. Kommt sie in Gruppe 0, zählt sie im Nenner mit. Bei Einteilung D zählen die nicht Erwerbstätigen als Vollzeit: Die Basis sind dann fast alle Befragten, nicht die Erwerbstätigen. Bei F heißt die Gruppe Teilzeit, misst aber etwas anderes. Nur die Einteilung passt, bei der jede Antwort zum Namen ihrer Gruppe passt.</p>
      <InShort><b>Umkodieren</b> heißt, Antworten nach festen Regeln zu neuen Gruppen zusammenzufassen. aus vielen Antworten wenige Gruppen machen. Wer in keine Gruppe passt, wird <b>leer (NA)</b> und zählt nicht mit. Jede dieser Entscheidungen verändert das Ergebnis.</InShort>
      <MoreDetail summary="Was beim Zusammenfassen verloren geht">
        <p>Zusammenfassen kostet Information. Nach dem Umkodieren weißt du nicht mehr, wer Teilzeit und wer nebenher arbeitet. Darum legst du immer eine <b>neue</b> Variable an und behältst die alte.</p>
        <p>Welche Gruppen sinnvoll sind, entscheidet die Frage, nicht die Statistik. Prüf bei jeder Antwort: Passt sie zum Namen der Gruppe? Und sag in deinem Bericht, wie du zusammengefasst hast.</p>
      </MoreDetail>
      <Mixup>„leer“ und „0“. Eine 0 ist eine Antwort („trifft nicht zu“) und zählt im Nenner mit. Leer (NA) heißt „gehört nicht dazu“ und fällt aus der Rechnung. Wer nicht erwerbstätig ist, arbeitet nicht Vollzeit, gehört aber gar nicht in die Frage nach Teilzeit unter Erwerbstätigen.</Mixup>
    </Card>

    <Card id="k1-nichtwahl" title="nichtwahl: Wer in keiner Regel steht" badge={<Bezug href="#a1-3">zu Schritt 4</Bezug>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">Die Regel für <code>nichtwahl</code> ist schon fertig. In Schritt 4 führst du sie aus und schaust, wer in welcher Gruppe landet.</p>
      <Code k="a1_nichtwahl" />
      <Frage>Was heißen die beiden Regeln?</Frage>
      <p><code>91=1 [würde nicht wählen]</code>: Aus Code 91 wird 1. <code>1:90=0 [würde wählen]</code>: Aus 1 bis 90 wird 0; das sind alle Parteien. Die Gruppe 1 ist also die, nach der die Leitfrage fragt, die Gruppe 0 alle, die eine Partei nennen.</p>
      <Frage>Und alle übrigen Codes?</Frage>
      <p>Jeder Code, der in keiner Regel vorkommt, fällt unter <code>else</code>. Mit <code>else=NA</code> wird er leer. Dazu kommen alle, die in <code>pv01</code> schon einen fehlenden Wert hatten, etwa „weiß nicht“. Bei <code>teilzeit</code> aus „R lesen“ ist es genauso: Die nicht Erwerbstätigen (Code 4) stehen in keiner Regel. Leer sind dort 1.884: die 1.849 nicht Erwerbstätigen und 35 ohne gültige Angabe.</p>
      <Frage>Wo stehen die Leeren in der Ausgabe?</Frage>
      <p>Bei neuen Variablen fasst <code>frequency()</code> alle Leeren in einer Zeile zusammen: <b>System</b>. Wer dort steht, fehlt später in jeder Kreuztabelle mit <code>nichtwahl</code>.</p>
      <InShort><code>else</code> steht für alle Codes, die in keiner Regel vorkommen. <code>else=NA</code> macht den Rest leer, <code>else=0</code> würde ihn als 0 mitzählen (<a href="#k1-zuschnitt">Einteilung E</a>).</InShort>
      <Mixup>Codes für fehlende Werte, etwa −8, kannst du in einer Regel nicht ansprechen. <code>rec()</code> sieht sie nur als leer; eine Regel wie <code>-8=2</code> ändert nichts und meldet auch keinen Fehler.</Mixup>
    </Card>

    <Card id="k1-ergebnis" title="Ergebnis festhalten: wo du was abliest" badge={<Bezug href="#a1-4">zu Schritt 5 und 6</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">In Schritt 5 hältst du vier Dinge fest. Jedes hat einen Ort, an dem du es ablesen kannst.</p>
      <ul className="v-liste">
        <li><b>Wie viele misstrauen:</b> die Ausgabe von Schritt 3, Spalte N in der Zeile ‚misstraut‘. Die Zahl stimmt nur, wenn deine Regel beide Stärken der Zustimmung als ‚misstraut‘ zählt (<a href="#k1-regel">Eine Regel lesen</a>).</li>
        <li><b>Wie viele nicht wählen würden:</b> die Ausgabe von Schritt 4, Spalte N in der Zeile ‚würde nicht wählen‘.</li>
        <li><b>Was mit den nicht Wahlberechtigten passiert:</b> Prüf, ob ihr Code in einer der beiden Regeln vorkommt. Wenn nicht, greift <code>else</code> (<a href="#k1-nichtwahl">Wer in keiner Regel steht</a>).</li>
        <li><b>Was <code>mean=</code> heißt:</b> Bei 0 und 1 ist der Mittelwert ein Anteil. Vergleiche ihn mit Valid % in der Zeile ‚misstraut‘.</li>
      </ul>
      <p className="absatz">Holst du die Ergebnisse ins Journal, steht dort deine Festlegung aus Schritt 1 daneben. Lag sie daneben, ist das kein Fehler, sondern genau der Moment, für den man vorher festlegt. Sind alle Fragen richtig, zeigt Schritt 6 im Bild, was <code>mutate()</code> mit den Türmen gemacht hat.</p>
    </Card>
  </Abschnitt>;
}

/* ---------- Aufgabe 2 ---------- */
export function Verstehen2() {
  return <Abschnitt id="g2" n={2} titel="Stimmt die 87 %?" frage="„87 Prozent der Nichtwähler sagen, dass sich Politiker nicht darum kümmern, was Leute wie sie denken.“ Stimmt die Zahl, und worauf bezieht sie sich?"
    ziel="die 87 % in R gefunden, kannst sagen, wer dabei 100 % ist, und weißt, welche Zahl derselben Zelle welche Frage beantwortet."
    weg={[
      ['Schritt 1', '#a2-p', 'Erst festlegen: Wer ist bei „87 Prozent der Nichtwähler“ 100 %?', 'k2-drei'],
      ['Schritt 2', '#a2-1', 'die Prozentbasis in R einstellen: percentages =', 'k2-code'],
      ['Schritt 2', '#a2-1', 'warum die Vorlage misstrauen und nichtwahl neu bildet', 'k2-neu'],
      ['Schritt 3', '#a2-2', 'eine Zelle, drei Prozentbasen: "all"', 'k2-all'],
      ['Schritt 4', '#a2-3', 'Ergebnis festhalten: Einstellung, Zelle, Basis, Zuordnung', 'k2-ergebnis'],
      ['Schritt 5', '#a2-4', 'Im Bild: dieselben Menschen, drei Nenner', 'k2-all'],
    ]}>

    <Card id="k2-drei" title="Prozent von wem? Drei Fragen an eine Zelle" badge={<Bezug href="#a2-p">zu Schritt 1</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Eine Prozentzahl sagt erst etwas, wenn klar ist, wer 100 % ist. Am Beispiel der Erwerbstätigkeit: 860 erwerbstätige Frauen im ALLBUS 2023 arbeiten Teilzeit oder nebenher. Ist das viel? Das hängt davon ab, womit du sie vergleichst: mit allen erwerbstätigen Frauen, mit allen Teilzeitkräften oder mit allen Erwerbstätigen. Jede dieser Gruppen kann die <b>Basis</b> sein, also die 100 %.</p>
      <p className="absatz">Die Idee kennst du aus Sitzung 3: Dort ergab dieselbe Zahl von CDU/CSU-Wählenden mit drei Basen drei verschiedene Prozent (Raw %, Valid % und eine eigene Basis). In einer Kreuztabelle gibt es für jede Zelle wieder drei Basen.</p>
      <ThreeBasesFigure caption={<>Dieselben 860 Frauen in Teilzeit, dreimal gerechnet. Gelb ist jeweils die Basis, also die 100 %. Die Anzahl in der Zelle bleibt gleich, nur der Nenner wechselt. <span>ALLBUS 2023, Erwerbstätige mit gültiger Angabe bei Geschlecht und Erwerbsform, n = 3.359, ungewichtet; Teilzeit heißt Teilzeit oder nebenher.</span></>} />
      <PercentFormula />
      <h6 className="zwischen">Basis-Schalter</h6>
      <p className="unter-zwischen">Stell die Prozent um und wähle eine Zelle. Gelb umrahmt ist die Basis der gewählten Zelle, der Satz darunter sagt, welche Frage die Zahl beantwortet.</p>
      <BasisSchalter />
      <Frage>Wie findest du in einem Satz die Basis?</Frage>
      <p>Lies, wie der Satz gebaut ist: „Wie viele <b>der</b> Teilzeitkräfte sind Frauen?“ Die Gruppe nach „der“ ist die Basis, hier die Teilzeitkräfte. Genauso: „Wie viel Prozent der Teilzeitkräfte sind Männer?“, sind die 1.167 Teilzeitkräfte 100 %, davon sind 301 Männer: 25,8 %, ein Spaltenprozent. 17,9 % wäre der Anteil der Männer, die Teilzeit arbeiten, ein Zeilenprozent; 9,0 % der Anteil der Männer in Teilzeit an allen Erwerbstätigen, ein Gesamtprozent. Eine Schlagzeile wie „74 % der Teilzeitkräfte sind Frauen“ beantwortet darum die Frage nach den Teilzeitkräften, nicht die Frage, ob Frauen häufiger Teilzeit arbeiten als Männer.</p>
      <InShort>Eine Prozentzahl in einer Kreuztabelle braucht immer eine <b>Basis</b>, den Nenner, also die Gruppe, die 100 % ist. <b>Zeilenprozente</b> nehmen jede Zeile als 100 %, <b>Spaltenprozente</b> jede Spalte, <b>Gesamtprozente</b> (auch <b>Zellenprozente</b>) die ganze Tabelle. „Wie viele der …?“ – die Gruppe nach „der“ ist die Basis.</InShort>
      <MoreDetail summary="Wo sich 100 % ergeben">
        <p>Bei Zeilenprozenten ergibt jede <b>Zeile</b> zusammen 100 % (48,3 + 51,7). Bei Spaltenprozenten jede <b>Spalte</b> (36,7 + 62,9 + 0,4 = 100). Bei Gesamtprozenten nur alle Zellen zusammen. So erkennst du in jeder Tabelle, welche Basis gemeint ist, auch wenn es nicht dabeisteht: Such die 100 %.</p>
        <p>Alle Zahlen sind ungewichtet. Gewichtet arbeiten {de(WEIGHTED.womenPart)} % der Frauen und {de(WEIGHTED.menPart)} % der Männer Teilzeit. Warum man gewichtet, ist Thema in Sitzung 6.</p>
      </MoreDetail>
      <Mixup>Spaltenprozente lesen und eine Aussage über die Zeile machen. „73,7 % der Teilzeitkräfte sind Frauen“ heißt nicht „73,7 % der Frauen arbeiten Teilzeit“. Das sind 51,7 %. Wer die Basis wechselt, ohne es zu merken, verdreht die Aussage.</Mixup>
    </Card>

    <Card id="k2-code" title="Die Prozentbasis in R einstellen" badge={<Bezug href="#a2-1">zu Schritt 2</Bezug>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">In Schritt 2 änderst du nur die letzte Zeile. <code>crosstab()</code> nimmt zuerst die Variable für die Zeilen, hier <code>misstrauen</code>, dann die für die Spalten, hier <code>nichtwahl</code>.</p>
      <Code k="a2_ct" />
      <Frage>Was stellt <code>percentages =</code> ein?</Frage>
      <p>Worauf sich die Prozent unter jeder Anzahl beziehen: <code>"row"</code> nimmt jede Zeile als 100 %, <code>"col"</code> jede Spalte, <code>"total"</code> die ganze Tabelle. Die gelbe Stelle ist die Einstellung, die du im Journal tauschst. Jede Zelle hat zwei Zeilen: oben die Anzahl, darunter die Prozent. Die Anzahl bleibt beim Umstellen gleich, nur die Prozent ändern sich.</p>
      <Frage>Woran siehst du in der Ausgabe, welche Basis gerade gilt?</Frage>
      <p>An der Kopfzeile <code>- Percentages:</code>, dort steht etwa <code>Row percentages</code>. Und an den 100 %: Bei Zeilenprozenten steht 100.0% am Ende jeder Zeile, bei Spaltenprozenten unter jeder Spalte. R schreibt Kommazahlen mit Punkt: 51.7% heißt 51,7 %.</p>
      <Mixup><code>percentages</code> falsch geschrieben oder ohne Anführungszeichen. R meldet dann <code>'arg' should be one of …</code>. Erlaubt sind <code>"row"</code>, <code>"col"</code>, <code>"total"</code> und <code>"all"</code>, in Anführungszeichen.</Mixup>
    </Card>

    <Card id="k2-neu" title="Warum jede Vorlage neu umkodiert" badge={<Bezug href="#a2-1">zu Schritt 2</Bezug>} tag={{ kind: 'interpret', label: 'Code lesen' }}>
      <p className="lead">Ab Aufgabe 2 beginnt jede Vorlage mit einem <code>mutate()</code>, das <code>misstrauen</code> und <code>nichtwahl</code> noch einmal bildet, genau wie in Aufgabe 1. Die Kommentarzeile sagt es: „misstrauen und nichtwahl bilden: kennst du aus Aufgabe 1“.</p>
      <Frage>Hast du die Variablen in Aufgabe 1 nicht schon gebildet?</Frage>
      <p>Gebildet ja, abgelegt nein. Eine Kette wie <code>allbus %&gt;% mutate(…) %&gt;% frequency(…)</code> stellt die neue Variable nur auf die Bauplatte, die durch diese eine Kette gereicht wird. <code>allbus</code> selbst bleibt, wie es war, denn vorne steht kein <code>allbus &lt;-</code>. In der nächsten Vorlage kennt R <code>misstrauen</code> darum nicht. Fehlt die <code>mutate()</code>-Zeile, meldet R, dass es die Variable nicht gibt.</p>
      <Frage>Warum ist das hier so gewollt?</Frage>
      <p>Weil jede Vorlage dann für sich allein läuft. Du kannst sie in beliebiger Reihenfolge ins Journal holen und ausführen, auch wenn du eine frühere Aufgabe übersprungen hast. Und du siehst in jeder Vorlage, nach welcher Regel die Gruppen gebildet wurden, die in der Tabelle stehen.</p>
      <Frage>Und in RStudio?</Frage>
      <p>Dort kannst du neue Variablen auch einmal ablegen und dann in vielen Auswertungen nutzen. So ist das Skript zum Mitnehmen gebaut: oben einmal <code>allbus &lt;- allbus %&gt;% mutate(…)</code>, danach kurze Aufrufe. Am Beispiel aus „R lesen“:</p>
      <div className="v-vorlage"><div className="cb"><div className="cb-kopf"><span className="cb-titel">Beispiel: eine neue Variable einmal ablegen</span><span className="cb-notiz">zum Lesen</span></div><pre aria-label="Beispiel: eine neue Variable einmal ablegen">{`allbus <- allbus %>%
  mutate(
    teilzeit = rec(work, rules = "2:3=1 [Teilzeit]; 1=0 [Vollzeit]; else=NA")
  )

allbus %>%
  crosstab(sex, teilzeit, percentages = "row")`}</pre></div></div>
      <InShort>Mit <code>&lt;-</code> legst du ein Ergebnis unter einem Namen ab (kennst du aus Sitzung 1). Ohne <code>&lt;-</code> zeigt R das Ergebnis einer Kette nur an und vergisst es dann wieder.</InShort>
      <Mixup>Wer die Vorlagen dieses Kapitels kürzt und die <code>mutate()</code>-Zeilen weglässt, bekommt <code>Column `misstrauen` doesn't exist</code>. Kopiere die Vorlage dann neu und ändere nur die markierten Stellen.</Mixup>
    </Card>

    <Card id="k2-all" title="Eine Zelle, drei Prozentbasen: percentages = &quot;all&quot;" badge={<Bezug href="#a2-2">zu Schritt 3 und 5</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Mit <code>"all"</code> stehen in jeder Zelle unter der Anzahl drei Prozentzahlen: <code>row %</code>, <code>col %</code> und <code>total %</code>. Alle drei gehören zu denselben Menschen in dieser Zelle.</p>
      <Code k="a2_all" />
      <Frage>Warum sind die drei Zahlen so verschieden?</Frage>
      <p>Weil sie dieselbe Anzahl durch verschiedene Nenner teilen. Prozent ist Anzahl in der Zelle geteilt durch Anzahl in der Basis, mal 100. Im Bild ein Beispiel mit 40 Befragten: Dieselben 6 Menschen sind ein großer Teil einer kleinen Gruppe und ein kleiner Teil aller.</p>
      <NennerBeispiel />
      <Frage>Wie findest du zu einer Frage die passende der drei Zahlen?</Frage>
      <p>Such die Gruppe nach „der“: Sie ist die Basis. Steht diese Gruppe in den Zeilen, ist es <code>row %</code>; steht sie in den Spalten, <code>col %</code>; sind es alle in der Tabelle, <code>total %</code>. In Schritt 5 erscheint das Bild mit den echten Zahlen, sobald deine Antworten in Schritt 4 stimmen.</p>
      <Mixup>Die drei Prozentzahlen einer Zelle ergeben zusammen keine 100 %. Jede hat ihren eigenen Nenner; 100 % ergeben sich nur entlang einer Zeile, einer Spalte oder der ganzen Tabelle.</Mixup>
    </Card>

    <Card id="k2-ergebnis" title="Ergebnis festhalten: wer in der Tabelle steht" badge={<Bezug href="#a2-3">zu Schritt 4</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">Schritt 4 fragt nach der Einstellung für die 87 %, nach der Anzahl in der Zelle, nach der Basis, nach der Zuordnung der drei Zahlen und danach, ob die Zahl aus dem Satz stimmt.</p>
      <ul className="v-liste">
        <li><b>Einstellung:</b> Probier in Schritt 2 alle drei und schau immer auf dieselbe Zelle (<a href="#k2-code">Prozentbasis einstellen</a>).</li>
        <li><b>Anzahl in der Zelle:</b> die obere Zahl in der Zelle, nicht die Summe am Rand.</li>
        <li><b>Basis:</b> die Summe der Gruppe, die 100 % ist, steht am Rand in der Zeile oder Spalte <b>Total</b>.</li>
        <li><b>Zuordnung:</b> Gruppe nach „der“ suchen (<a href="#k2-all">Eine Zelle, drei Prozentbasen</a>).</li>
        <li><b>Stimmt die Zahl?</b> Ob sie in der Ausgabe steht, prüfst du in Schritt 2. Ob sie die Leitfrage beantwortet, ist eine andere Frage; sie kommt in Aufgabe 3.</li>
      </ul>
      <Frage>Wer steht überhaupt in der Tabelle?</Frage>
      <p>Nur wer bei <b>beiden</b> Variablen eine gültige Angabe hat. Wer <code>pe01</code> im Split nicht bekam oder bei <code>nichtwahl</code> leer ist, fehlt. Darum nennst du zu jeder Tabelle das N, das R in der Kopfzeile unter <code>N (valid)</code> angibt; <code>Missing</code> zählt, wer fehlt. Alle Zahlen sind ungewichtet; wie man gewichtet, lernst du in Sitzung 6.</p>
      <InShort><b>N (valid)</b> zählt alle, die bei beiden Variablen eine gültige Angabe haben. Nur sie stehen in der Tabelle.</InShort>
      <Mixup>Die Zahl der Nichtwählenden in der Tabelle ist nicht die aus <code>frequency(nichtwahl)</code>. In der Tabelle fehlen alle, die bei <code>pe01</code> keine gültige Angabe haben. Lies sie in der Tabelle selbst ab, in der Zeile Total.</Mixup>
    </Card>
  </Abschnitt>;
}

/* ---------- Aufgabe 3 ---------- */
export function Verstehen3() {
  return <Abschnitt id="g3" n={3} titel="Gehen Misstrauende nicht mehr wählen?" frage="Gehen Misstrauende nicht mehr wählen?"
    ziel="mit der passenden Prozentbasis gesagt, ob Misstrauende häufiger nicht wählen wollen als die übrigen, um wie viele Prozentpunkte, und was die Tabelle nicht zeigt."
    weg={[
      ['Schritt 1', '#a3-p', 'Erst festlegen: Welche Gruppen vergleichst du?', 'k3-vergleich'],
      ['Schritt 2', '#a3-1', 'die Prozentbasis für den Vergleich einstellen', 'k3-code'],
      ['Schritt 3', '#a3-2', 'vergleichen und deuten: Prozentpunkte, Ursachen', 'k3-deuten'],
      ['Schritt 4', '#a3-3', 'Ergebnis festhalten und Faktencheck', 'k3-ergebnis'],
    ]}>

    <Card id="k3-vergleich" title="Innerhalb der Gruppen prozentuieren, zwischen den Gruppen vergleichen" badge={<Bezug href="#a3-p">zu Schritt 1</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Die Leitfrage fragt nach einem Unterschied. Wie man einen Unterschied fair misst, zeigt wieder die Erwerbstätigkeit: Arbeiten Frauen häufiger Teilzeit als Männer? Damit der Vergleich fair ist, muss jede Gruppe für sich 100 % sein. Sonst hinge das Ergebnis auch davon ab, wie viele Frauen und Männer überhaupt in der Tabelle stehen.</p>
      <p className="absatz">Aus der Vorlesung kennst du die <b>unabhängige Variable (UV)</b>, die mögliche Ursache, hier das Geschlecht, und die <b>abhängige Variable (AV)</b>, das, was erklärt werden soll, hier die Erwerbsform. Die Faustregel: <b>Jede Gruppe der UV ist 100 %. Dann vergleichst du die Gruppen miteinander.</b></p>
      <ReadingDirectionFigure caption={<>Jede Zeile ist eine Gruppe der UV und für sich 100 %. Verglichen wird von oben nach unten: Frauen arbeiten 33,8 Prozentpunkte häufiger Teilzeit als Männer. <span>ALLBUS 2023, Erwerbstätige, n = 3.359, ungewichtet. In R sind das die Zeilenprozente aus ‚R lesen‘.</span></>} />
      <Frage>Welche Gruppen vergleicht man also?</Frage>
      <p>Die Gruppen der UV, jede mit ihrem eigenen Anteil an der AV. Bei der Erwerbstätigkeit vergleicht man den Teilzeit-Anteil der Frauen mit dem der Männer, nicht den Frauenanteil unter Teilzeit- und Vollzeitkräften. Welche Variable die UV ist, ergibt sich aus der Frage: Was soll was erklären?</p>
      <InShort>Für einen Vergleich setzt du <b>jede Gruppe der UV auf 100 %</b> und vergleichst dann die Anteile der AV zwischen den Gruppen. innerhalb der Gruppen prozentuieren, zwischen den Gruppen vergleichen. Steht die UV in den Zeilen, sind das die Zeilenprozente.</InShort>
    </Card>

    <Card id="k3-code" title="Die Leserichtung in R einstellen" badge={<Bezug href="#a3-1">zu Schritt 2</Bezug>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">Die Vorlage in Schritt 2 bildet wieder beide Variablen (<a href="#k2-neu">warum</a>) und nutzt noch die Einstellung aus Aufgabe 2. <code>misstrauen</code> ist hier die mögliche Ursache (UV) und steht als erste Variable in den Zeilen.</p>
      <Code k="a3_ct" />
      <Frage>Welche Einstellung setzt jede Gruppe von <code>misstrauen</code> auf 100 %?</Frage>
      <p>Die, bei der die Gruppen der UV jeweils für sich 100 % ergeben. Wo die UV steht, sagt dir, ob das Zeilen oder Spalten sind (<a href="#k2-drei">Drei Fragen an eine Zelle</a>). Prüfen kannst du es an der Ausgabe: Die 100 % stehen dann am Ende jeder Gruppe der UV.</p>
      <MoreDetail summary="Tauschprobe">
        <p>Schreibst du in R die Variablen andersherum, <code>crosstab(teilzeit, sex, percentages = "col")</code>, steht das Geschlecht in den Spalten. Jetzt sind die Spaltenprozente die richtigen, und dort steht wieder 51,7 % für Frauen in Teilzeit. Ob „row“ oder „col“ passt, hängt also davon ab, wo die UV steht. Entscheidend ist nur: Wer ist 100 %?</p>
      </MoreDetail>
      <Mixup>Die passende Einstellung hängt nicht an den Wörtern „Zeile“ und „Spalte“, sondern daran, wo die UV steht. Tauschst du die Reihenfolge in <code>crosstab()</code>, tauscht auch die passende Einstellung.</Mixup>
    </Card>

    <Card id="k3-deuten" title="Vergleichen und deuten: Prozentpunkte, kleine Gruppen, Ursachen" badge={<Bezug href="#a3-2">zu Schritt 3</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">In Schritt 3 liest du in der Spalte ‚würde nicht wählen‘ beide Gruppen ab und beschreibst den Unterschied.</p>
      <Frage>Wie beschreibst du einen Unterschied zwischen zwei Anteilen?</Frage>
      <p>Durch Abziehen: Das ergibt den Abstand in <b>Prozentpunkten</b>. Teilen ergibt das Verhältnis, „wievielmal so häufig“. Beides ist richtig, aber nicht dasselbe. Am Beispiel der Erwerbstätigkeit:</p>
      <PointsFormula />
      <Frage>Warum sollst du auch in die Spalte ‚würde wählen‘ schauen?</Frage>
      <p>Weil ein Unterschied zwischen zwei Gruppen noch nicht sagt, wie es innerhalb einer Gruppe aussieht. Ein Satz über eine ganze Gruppe („alle“, „keiner mehr“) muss auch zum Anteil innerhalb der Gruppe passen.</p>
      <Frage>Was zeigt eine Kreuztabelle über Ursachen?</Frage>
      <p>Eine Kreuztabelle zeigt, was zusammen vorkommt, nicht warum. Die Tabelle zur Erwerbstätigkeit zeigt, dass Frauen häufiger Teilzeit arbeiten. Warum, zeigt sie nicht; dafür bräuchte man weitere Variablen, etwa Kinder im Haushalt. Bei Einstellungen ist oft sogar unklar, was die UV ist; was zuerst kommt, ist dann eine Annahme, die du begründen musst.</p>
      <Frage>Und wenn eine Gruppe sehr klein ist?</Frage>
      <p>Dann wackeln ihre Prozent. 42,9 % bei den Befragten mit der Angabe divers klingt genau, sind aber 6 von 14 Menschen. Arbeitete eine dieser Personen Teilzeit statt Vollzeit, wären es 50 %. Nenne deshalb zu jeder Gruppe ihr n und deute kleine Gruppen vorsichtig.</p>
      <InShort>Einen <b>Zusammenhang</b> zeigt eine Kreuztabelle, wenn sich die Anteile der AV zwischen den Gruppen der UV unterscheiden. Was zusammen vorkommt, ist noch keine Erklärung, warum.</InShort>
      <Mixup>Prozent und Prozentpunkte. Steigt ein Anteil von 20 % auf 30 %, sind das 10 Prozentpunkte mehr, aber 50 Prozent mehr (die 10 sind die Hälfte von 20). In Berichten über Anteile nennst du den Abstand in Prozentpunkten.</Mixup>
    </Card>

    <Card id="k3-ergebnis" title="Ergebnis festhalten und Faktencheck" badge={<Bezug href="#a3-3">zu Schritt 4</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">In Schritt 4 hältst du fest, welche Basis du eingestellt hast, die beiden Anteile, ihren Abstand, einen passenden Satz und ob die Tabelle eine Ursache zeigt.</p>
      <ul className="v-liste">
        <li><b>Basis und Anteile:</b> die Tabelle aus Schritt 2, Spalte ‚würde nicht wählen‘, einmal in der Zeile ‚misstraut‘, einmal in ‚misstraut nicht‘ (<a href="#k3-code">Leserichtung einstellen</a>).</li>
        <li><b>Abstand:</b> abziehen, in Prozentpunkten (<a href="#k3-deuten">Vergleichen und deuten</a>).</li>
        <li><b>Passender Satz:</b> Er muss zum Unterschied <b>und</b> zur Spalte ‚würde wählen‘ passen.</li>
        <li><b>Ursache:</b> was eine Kreuztabelle zeigen kann und was nicht (<a href="#k3-deuten">Vergleichen und deuten</a>).</li>
      </ul>
      <Frage>Was gehört in den Faktencheck?</Frage>
      <p>Zwei Zahlen aus derselben Tabelle: die 87 % aus Aufgabe 2 und dein Vergleich aus Aufgabe 3. Zu jeder Zahl nennst du, wer 100 % ist. Dann sagst du, welche der beiden die Frage beantwortet, ob Misstrauende nicht mehr wählen gehen. Ob ein Unterschied größer ist, als der Zufall erwarten lässt, steht im <a href="#k5-chi">Überblick</a>.</p>
    </Card>
  </Abschnitt>;
}

/* ---------- Aufgabe 4 ---------- */
export function Verstehen4() {
  return <Abschnitt id="g4" n={4} titel="Gegenprobe mit einer umgedrehten Aussage" frage="Kommt dasselbe heraus, wenn man Misstrauen mit einer anderen Aussage misst?"
    ziel="eine zweite Aussage umgepolt, daraus eine Misstrauens-Gruppe gebildet und weißt, warum die Regel aus Aufgabe 1 ohne Umpolen das Gegenteil misst."
    weg={[
      ['Schritt 1', '#a4-p', 'Erst festlegen: Was misst die Regel ohne Umpolen?', 'k4-richtung'],
      ['Schritt 2', '#a4-1', 'pe05 umpolen mit rules = "rev"', 'k4-umpolen'],
      ['Schritt 3', '#a4-2', 'die Misstrauens-Gruppe aus pe05_um bilden', 'k4-gegenprobe'],
      ['Schritt 4', '#a4-3', 'zum Vergleich: ohne Umpolen', 'k4-ohne'],
      ['Schritt 5', '#a4-4', 'Ergebnis festhalten: Bestätigt die Gegenprobe Aufgabe 3?', 'k4-ohne'],
      ['Schritt 6', '#a4-5', 'Im Bild: pe05 umgepolt (nach den richtigen Antworten)', 'k4-ohne'],
    ]}>

    <Card id="k4-richtung" title="Zwei Aussagen, zwei Richtungen" badge={<Bezug href="#a4-p">zu Schritt 1</Bezug>} tag={{ kind: 'interpret', label: 'Hintergrund' }}>
      <p className="lead">Manchmal sollen mehrere Fragen dasselbe messen, sind aber in verschiedene Richtungen gestellt. Zum Beispiel: „Ich fühle mich in meinem Viertel sicher.“ und „Nachts habe ich in meinem Viertel Angst.“ Wer der ersten Aussage zustimmt, fühlt sich sicher. Wer der zweiten zustimmt, fühlt sich unsicher. Ein „stimme voll zu“ (Code 1) heißt also einmal das eine, einmal das Gegenteil.</p>
      <p className="absatz">Genau so liegen <code>pe01</code> und <code>pe05</code>: Bei <code>pe01</code> („Die Politiker kümmern sich nicht viel darum, was Leute wie ich denken.“) zeigt Zustimmung Misstrauen. Bei <code>pe05</code> („Die Politiker vertreten die Interessen der Bevölkerung.“) zeigt Zustimmung Vertrauen. Beide reichen von 1 „stimme voll zu“ bis 4 „stimme gar nicht zu“.</p>
      <Frage>Was heißt das für eine Regel, die für die eine Aussage passt?</Frage>
      <p>Eine Regel arbeitet nur mit Codes. Sie weiß nicht, wie die Aussage dahinter lautet. Bevor du solche Fragen gemeinsam auswertest oder für beide dieselbe Regel nimmst, polst du eine um. Dann heißt Code 1 bei beiden dasselbe.</p>
      <Frage>Und wozu überhaupt eine zweite Aussage?</Frage>
      <p>Das Ergebnis aus Aufgabe 3 hängt an einer einzigen Formulierung, und <code>pe01</code> misst Misstrauen nur ungefähr (<a href="#k1-aussage">Gültigkeit</a>). Zeigt eine zweite Aussage in dieselbe Richtung, steht das Ergebnis auf festeren Füßen.</p>
      <InShort>Eine <b>Gegenprobe</b> misst dasselbe noch einmal mit einer anderen Frage. Kommt mit einer zweiten Aussage dasselbe Bild heraus, hängt das Ergebnis nicht an einer einzigen Formulierung.</InShort>
      <Mixup>Umpolen ist kein Fehlerbeheben. Die Daten waren vorher nicht falsch, sie zählten nur in die andere Richtung. Wichtig ist, dass du weißt, welche Richtung gilt, und es bei der Auswertung dazuschreibst.</Mixup>
    </Card>

    <Card id="k4-umpolen" title="Umpolen: eine Skala umdrehen" badge={<Bezug href="#a4-1">zu Schritt 2</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Am Beispiel einer anderen Frage: Der ALLBUS fragt, wie man die wirtschaftliche Lage in Deutschland heute beurteilt. Gespeichert ist: 1 = sehr gut, 2 = gut, 3 = teils/teils, 4 = schlecht, 5 = sehr schlecht. Eine höhere Zahl heißt also: schlechter. Wer sagen will „je höher, desto besser“, dreht die Skala um. Das heißt <b>umpolen</b>.</p>
      <UmpolenFigure caption={<>Umpolen dreht nur die Zahlen um. Jeder Aufkleber wandert mit seinem Stein, und in jeder Stufe stehen gleich viele Menschen wie vorher. Aus ‚höher heißt schlechter‘ wird ‚höher heißt besser‘. <span>Anzahlen: ALLBUS 2023, n = 5.194, ungewichtet.</span></>} />
      <Frage>Wie rechnet R beim Umpolen?</Frage>
      <p><code>rec()</code> polt mit <code>rules = "rev"</code> um. Es nimmt dafür den kleinsten und den größten Code der Skala, so wie die Wertelabels sie angeben (bei der Wirtschaftslage 1 und 5), und rechnet kleinster plus größter minus alter Code: Aus 2 „gut“ wird 6 − 2 = 4. Fehlende Werte bleiben leer, die Aufkleber wandern mit. Bei <code>pe05</code> mit vier Stufen ist es 1 + 4 = 5 minus alter Code.</p>
      <Code k="a4_um" />
      <p className="absatz">Die Kette polt um und zählt gleich aus. Mit <code>frequency(pe05_um)</code> prüfst du, ob die Wörter jetzt bei den neuen Codes stehen.</p>
      <InShort><b>Umpolen</b> dreht die Codes einer Skala um: Der kleinste wird der größte und umgekehrt. Die Antworten bleiben dieselben, nur die Richtung der Zahlen ändert sich. Man polt um, damit eine höhere Zahl immer „mehr“ von dem heißt, was man messen will.</InShort>
      <MoreDetail summary="Umpolen oder anders zusammenfassen?">
        <p>Willst du nur zwei Gruppen bilden, geht es auch ohne Umpolen: Du schreibst die Regel einfach andersherum. Umpolen lohnt sich, wenn du danach mit mehreren Fragen gleich weiterarbeiten willst, etwa dieselbe Regel für alle oder später einen Mittelwert über mehrere Fragen (Sitzung 8).</p>
      </MoreDetail>
    </Card>

    <Card id="k4-gegenprobe" title="Die Gegenprobe bauen: drei Variablen in einem mutate()" badge={<Bezug href="#a4-2">zu Schritt 3</Bezug>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">In Schritt 3 bildet ein einziges <code>mutate()</code> drei Variablen und kreuzt dann zwei davon.</p>
      <Code k="a4_mutate" />
      <ul className="v-liste">
        <li><code>pe05_um = rec(pe05, rules = "rev")</code> polt <code>pe05</code> um wie in Schritt 2.</li>
        <li><code>misstrauen_pe05 = rec(pe05_um, …)</code> bildet die Misstrauens-Gruppe aus der <b>umgepolten</b> Variable. Die gelben Stellen sind wieder die alten Codes, die du anpasst.</li>
        <li><code>nichtwahl = …</code> bildet die Wahlabsicht wie in Aufgabe 1.</li>
        <li><code>crosstab(misstrauen_pe05, nichtwahl, percentages = "row")</code> vergleicht die Gruppen wie in Aufgabe 3.</li>
      </ul>
      <Frage>Darf <code>misstrauen_pe05</code> schon <code>pe05_um</code> benutzen?</Frage>
      <p>Ja. <code>mutate()</code> bildet die Variablen von oben nach unten. Was eine Zeile darüber entsteht, kann die nächste schon benutzen.</p>
      <Frage>Welche Codes heißen nach dem Umpolen Misstrauen?</Frage>
      <p>Nach dem Umpolen heißt eine kleine Zahl bei <code>pe05_um</code> dasselbe wie bei <code>pe01</code>. Darum stellst du dieselbe Überlegung an wie in Aufgabe 1: Welche Antworten zeigen Misstrauen, und welche Codes haben sie jetzt? Das Wort zu jedem Code steht in der Ausgabe von Schritt 2.</p>
    </Card>

    <Card id="k4-ohne" title="Ohne Umpolen: dieselbe Regel, eine andere Richtung" badge={<Bezug href="#a4-3">zu Schritt 4 bis 6</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">Schritt 4 zeigt, was passiert wäre, wenn du die Regel aus Aufgabe 1 einfach auf <code>pe05</code> übertragen hättest. Die Zeile mit <code>rev</code> fehlt.</p>
      <Code k="a4_ohne" />
      <Frage>Was steckt dann in der Gruppe ‚misstraut‘?</Frage>
      <p>Die Regel zählt die Codes 1 und 2 von <code>pe05</code> als ‚misstraut‘, genau wie bei <code>pe01</code>. Welche Antworten hinter diesen Codes stehen und was Zustimmung zu <code>pe05</code> bedeutet, steht in der Aufgabe und in <a href="#k4-richtung">Zwei Aussagen, zwei Richtungen</a>. Der Aufkleber <code>[misstraut]</code> ist nur ein Name, den die Regel vergibt. R prüft nicht, ob er zu den Antworten passt.</p>
      <Frage>Und wie hältst du in Schritt 5 das Ergebnis fest?</Frage>
      <ul className="v-liste">
        <li><b>Wort bei Code 1:</b> die Ausgabe von Schritt 2, Zeile mit Value 1.</li>
        <li><b>Die beiden Anteile:</b> die Tabelle aus Schritt 3, Spalte ‚würde nicht wählen‘, beide Zeilen.</li>
        <li><b>Ohne Umpolen:</b> Vergleiche die Zeile ‚misstraut‘ in Schritt 3 und Schritt 4.</li>
        <li><b>Gegenprobe:</b> Zeigt der Vergleich aus Schritt 3 in dieselbe Richtung wie Aufgabe 3, und wie viele der Misstrauenden würden trotzdem wählen?</li>
      </ul>
      <p className="absatz">Sind alle Fragen richtig, zeigt Schritt 6 im Bild, wie die Codes beim Umpolen wandern.</p>
    </Card>
  </Abschnitt>;
}

/* ---------- Überblick ---------- */
export function Ueberblick() {
  return <section className="grund-block" id="g5" aria-labelledby="g5-h">
    <div className="g-kopf">
      <span className="st m c7" aria-hidden="true">✓</span>
      <div><div className="ueber">Überblick über alle Aufgaben</div><h4 id="g5-h">Basis wählen, Grenzen kennen</h4></div>
    </div>
    <p className="g-intro">Alle vier Aufgaben zusammen: welche Prozentbasis welche Frage beantwortet, was eine Kreuztabelle braucht und was der Chi-Quadrat-Test dazu sagt.</p>
    <HeadingLevel.Provider value={5}>
      <Card id="k5-basis" title="Wer ist 100 %?" badge={<Badge>Aufgaben 2 und 3</Badge>} tag={{ kind: 'interpret', label: 'Hintergrund' }}>
        <p className="lead">Such in jeder Frage die Gruppe nach „der“ oder „von“: Sie ist die Basis. Fragst du nach einem Unterschied zwischen Gruppen, ist jede Gruppe für sich 100 %. Vier Fragen an eine Tabelle mit Wohngebiet (West, Ost) und Misstrauen (misstraut, misstraut nicht):</p>
        <ul className="v-liste">
          {U1.map(u => <li key={u.question}><b>{u.question}</b> Basis: {U1_OPTIONS[u.answer]}. {u.right.replace(/^Basis: [^.]*\.\s*/, '')}</li>)}
        </ul>
        <p className="absatz">In R gibt <code>crosstab(eastwest, misstrauen, percentages = "row")</code> die Antwort auf die letzte Frage: Im Westen misstrauen 70,6 %, im Osten 78,3 %.</p>
        <InShort>Erst die Frage, dann die Basis: „Wie viele der …“ legt fest, wer 100 % ist. Für einen Vergleich setzt du jede Gruppe der UV auf 100 % und gibst den Abstand in Prozentpunkten an.</InShort>
      </Card>

      <Card id="k5-voraus" title="Voraussetzungen: was eine Kreuztabelle braucht und wo sie täuschen kann" badge={<Badge>alle Aufgaben</Badge>} tag={{ kind: 'interpret', label: 'Hintergrund' }}>
        <table className="daten voll">
          <caption>Voraussetzungen der Kreuztabelle</caption>
          <thead><tr><th scope="col">Was</th><th scope="col">braucht</th><th scope="col">Vorsicht</th></tr></thead>
          <tbody>{PREREQUISITES.map(([what, needs, careful]) => <tr key={what}><td>{what}</td><td>{needs}</td><td>{careful.replace('(Grundlage 1)', '(Aufgabe 1)')}</td></tr>)}</tbody>
        </table>
      </Card>

      <Card id="k5-chi" title="Zufall oder Zusammenhang?" badge={<Badge>Wiederholung aus der Vorlesung</Badge>} tag={{ kind: 'interpret', label: 'Hintergrund' }}>
        <p className="lead">Die {CHI.n.toLocaleString('de-DE')} Befragten in deiner Tabelle aus Aufgabe 3 sind eine <b>Stichprobe</b> aus einer <b>Grundgesamtheit</b>, beim ALLBUS den Erwachsenen, die in Deutschland in Privathaushalten leben. Auch wenn es dort keinen Zusammenhang gäbe, wären die Anteile in einer Stichprobe nie ganz gleich. Ob der Unterschied zwischen Misstrauenden und übrigen größer ist, als der Zufall erwarten lässt, prüft der <b>Chi-Quadrat-Test</b> aus der Vorlesung. In R:</p>
        <Code k="ueb_chi" />
        <p className="absatz">R meldet <code>{`chi2(${CHI.df}) = ${CHI.chi2.toFixed(3)}, p < 0.001 ***`}</code> bei N = {CHI.n.toLocaleString('de-DE')}. Gäbe es in der Grundgesamtheit keinen Zusammenhang, wäre ein so großer Unterschied in einer Stichprobe dieser Größe sehr unwahrscheinlich. Der Test sagt aber nichts darüber, wie stark der Zusammenhang ist und was die Ursache ist. Die Stärke steht in derselben Zeile: <code>{`V = ${CHI.v.toFixed(3)} (negligible)`}</code>, auf Deutsch „vernachlässigbar“. Was V ist, lernst du in Sitzung 6.</p>
        <p className="absatz">Der Test hat selbst eine Voraussetzung: In jeder Zelle müssten ohne Zusammenhang genug Befragte zu erwarten sein (Faustregel: mindestens 5). Hier ist die kleinste erwartete Zahl gut 43; sonst warnt R (mehr dazu in Sitzung 6). Die Zahlen sind ungewichtet.</p>
        <InShort>Der <b>Chi-Quadrat-Test</b> prüft, ob ein Zusammenhang in der Stichprobe größer ist, als der Zufall erwarten lässt. Er sagt „wahrscheinlich kein Zufall“, aber nicht „groß“ und nicht „warum“.</InShort>
        <Mixup>„Signifikant“ heißt nicht „groß“ oder „wichtig“. Bei vielen Befragten wird auch ein Unterschied von wenigen Prozentpunkten signifikant; R nennt ihn hier zugleich „negligible“.</Mixup>
      </Card>
    </HeadingLevel.Provider>
  </section>;
}

/* ---------- Themen für den Reiter „Verstehen“ (Reihenfolge, Karten für die rechte Leiste) ---------- */
export const THEMEN: Thema[] = [
  { id: 'vorweg', n: 'R', kurz: 'R lesen', titel: 'Vorweg: R lesen', minuten: 10, Inhalt: Vorweg,
    karten: [['r1', 'Startblock und <-'], ['r2', 'Neue Variable: mutate() und rec()'], ['r3', 'Kreuztabelle: crosstab()']] },
  { id: 'g1', n: '1', kurz: 'Aufgabe 1', titel: 'Zwei Gruppen für die Wahlfrage', minuten: 15, Inhalt: Verstehen1, aufgabe: 1,
    karten: [['k1-aussage', 'Zwei Fragen, je zwei Gruppen'], ['k1-codes', 'Codes und Fragebogensplit'], ['k1-regel', 'Eine Regel lesen: misstrauen'], ['k1-zuschnitt', 'Gruppen zuschneiden'], ['k1-nichtwahl', 'Wer in keiner Regel steht'], ['k1-ergebnis', 'Ergebnis festhalten']] },
  { id: 'g2', n: '2', kurz: 'Aufgabe 2', titel: 'Stimmt die 87 %?', minuten: 15, Inhalt: Verstehen2, aufgabe: 2,
    karten: [['k2-drei', 'Drei Fragen an eine Zelle'], ['k2-code', 'Prozentbasis einstellen'], ['k2-neu', 'Warum jede Vorlage neu umkodiert'], ['k2-all', 'Eine Zelle, drei Prozentbasen'], ['k2-ergebnis', 'Wer in der Tabelle steht']] },
  { id: 'g3', n: '3', kurz: 'Aufgabe 3', titel: 'Gehen Misstrauende nicht mehr wählen?', minuten: 12, Inhalt: Verstehen3, aufgabe: 3,
    karten: [['k3-vergleich', 'Gruppen vergleichen'], ['k3-code', 'Leserichtung einstellen'], ['k3-deuten', 'Vergleichen und deuten'], ['k3-ergebnis', 'Ergebnis und Faktencheck']] },
  { id: 'g4', n: '4', kurz: 'Aufgabe 4', titel: 'Gegenprobe mit einer umgedrehten Aussage', minuten: 10, Inhalt: Verstehen4, aufgabe: 4,
    karten: [['k4-richtung', 'Zwei Aussagen, zwei Richtungen'], ['k4-umpolen', 'Umpolen'], ['k4-gegenprobe', 'Die Gegenprobe bauen'], ['k4-ohne', 'Ohne Umpolen']] },
  { id: 'g5', n: '✓', kurz: 'Überblick', titel: 'Basis wählen, Grenzen kennen', minuten: 8, Inhalt: Ueberblick,
    karten: [['k5-basis', 'Wer ist 100 %?'], ['k5-voraus', 'Voraussetzungen'], ['k5-chi', 'Zufall oder Zusammenhang?']] },
];

/* ---------- Bilder für die ausgebauten „?“-Fenster in den Aufgaben (Engine: denk(…, { bild: Name })) ----------
   Nur Erklärbilder, die auch in „Verstehen“ stehen; alle am Beispiel der Erwerbstätigkeit oder der Wirtschaftslage. */
function Leserichtung() {
  return <ReadingDirectionFigure caption={<>Jede Zeile ist eine Gruppe der UV und für sich 100 %. Verglichen wird von oben nach unten: Frauen arbeiten 33,8 Prozentpunkte häufiger Teilzeit als Männer. <span>ALLBUS 2023, Erwerbstätige, n = 3.359, ungewichtet.</span></>} />;
}
function Umpolen() {
  return <UmpolenFigure caption={<>Umpolen dreht nur die Zahlen um. Jeder Aufkleber wandert mit seinem Stein, und in jeder Stufe stehen gleich viele Menschen wie vorher. Aus ‚höher heißt schlechter‘ wird ‚höher heißt besser‘. <span>Anzahlen: ALLBUS 2023, n = 5.194, ungewichtet.</span></>} />;
}
export const BILDER = { Regel: RuleFigure, BasisSchalter, NennerBeispiel, Leserichtung, Prozentpunkte: PointsFormula, Umpolen };
