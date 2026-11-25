// Sitzung 5 „Kreuztabellen“: die vier Grundlagen und der Überblick, ohne R-Code (außer der Wiederholung Chi-Quadrat im Überblick).
import { Badge, Card, InShort, Mixup, MoreDetail } from '../blocks/Card';
import { Foundation } from '../blocks/Foundation';
import { MapLink } from '../blocks/MapLink';
import { CHI, G1_Q, G2_Q, G3_Q1, G3_Q2, G4_Q, PREREQUISITES, WEIGHTED } from './content';
import { de } from './figures/parts';
import { ReadingDirectionFigure } from './figures/Bars5';
import { BaseSwitch, GroupCutter, WhoIs100 } from './figures/Interactive';
import { PercentFormula, PointsFormula, ThreeBasesFigure } from './figures/Tables';
import { UmpolenFigure } from './figures/Towers';
import { Questions5 } from './Questions5';
import { Workshop } from './Workshop';

/** „Kurz überlegen“ box with one or two questions of this session. */
function Think({ id, questions }: { id: string; questions: Parameters<typeof Questions5>[0]['questions'] }) {
  return <div className="kurzueberlegen">
    <p>Kurz überlegen</p>
    <Questions5 id={id} questions={questions} />
  </div>;
}

/** Grundlage 1: Kategorien bilden: Umkodieren (1a Kategorien zusammenfassen). */
export function Foundation1() {
  return <Foundation id="g1" n={1} title="Kategorien bilden: Umkodieren" taskHref="#a1"
    intro="Warum fasst man Antworten zu Kategorien zusammen, und was ändert sich dabei? Etwa 12 Minuten.">
    <Card id="v1" step="1a" title="Kategorien zusammenfassen" tag={{ kind: 'estimate', label: 'Ausprobieren' }}>
      <p className="lead">Der ALLBUS 2023 fragt, ob jemand berufstätig ist. Die Antworten: Vollzeit, Teilzeit, nebenher oder nicht erwerbstätig. Für die Frage „Wie viele Erwerbstätige arbeiten Teilzeit?“ brauchst du zwei Kategorien: Teilzeit und Vollzeit. Wer kommt in welche Kategorie, und wer zählt gar nicht mit? Entscheide selbst für jede Zeile.</p>
      <GroupCutter />
      <InShort><b>Umkodieren</b> heißt, Antworten nach festen Regeln zu neuen Kategorien zusammenzufassen. Eine Variable mit nur zwei Kategorien, 1 für „trifft zu“ und 0 für „trifft nicht zu“, heißt <b>Dummyvariable</b>. Wer in keine Kategorie passt, wird zum <b>fehlenden Wert (NA)</b> und zählt nicht mit. Jede dieser Entscheidungen verändert das Ergebnis.</InShort>
      <Think id="g1-q" questions={[G1_Q]} />
      <MoreDetail summary="Dummyvariablen, und was beim Zusammenfassen verloren geht">
        <p>Eine <b>Dummyvariable</b> hat nur 0 und 1. Das hat einen praktischen Vorteil: Ihr <b>Mittelwert ist der Anteil der Einsen</b>. Bei Teilzeit (1) und Vollzeit (0) liegt der Mittelwert bei 0,35, und 34,77 % der Erwerbstätigen haben den Code 1. Ein Mittelwert von 0,35 heißt also: 35 % sind 1.</p>
        <p>Zusammenfassen kostet Information. Nach dem Umkodieren weißt du nicht mehr, wer Teilzeit und wer nebenher arbeitet. Darum legst du immer eine <b>neue</b> Variable an und behältst die alte.</p>
        <p>Welche Kategorien sinnvoll sind, entscheidet die Frage, nicht die Statistik. Prüf bei jeder Antwort: Passt sie zum Namen der Kategorie? Und sag in deinem Bericht, wie du zusammengefasst hast.</p>
      </MoreDetail>
      <Mixup>„leer“ und „0“. Eine 0 ist eine Antwort („trifft nicht zu“) und zählt im Nenner mit. Leer (NA) heißt „gehört nicht dazu“ und fällt aus der Rechnung. Wer nicht erwerbstätig ist, arbeitet nicht Vollzeit, gehört aber gar nicht in die Frage nach Teilzeit unter Erwerbstätigen.</Mixup>
    </Card>
  </Foundation>;
}

/** Grundlage 2: Eine Zelle, drei Prozentbasen (2a Drei Fragen an eine Zelle, Basis-Schalter). */
export function Foundation2() {
  return <Foundation id="g2" n={2} title="Eine Zelle, drei Prozentbasen" taskHref="#a2"
    intro="Dieselbe Zahl von Menschen kann 52 %, 74 % oder 26 % sein. Wovon hängt das ab? Etwa 15 Minuten.">
    <Card id="v2" step="2a" title="Drei Fragen an eine Zelle" badge={<Badge>Basis, ein Zähler und verschiedene Nenner: kennst du aus Sitzung 3</Badge>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">860 erwerbstätige Frauen im ALLBUS 2023 arbeiten Teilzeit oder nebenher. Ist das viel? Das hängt davon ab, womit du sie vergleichst: mit allen erwerbstätigen Frauen, mit allen Teilzeitkräften oder mit allen Erwerbstätigen. Jede dieser Gruppen kann die <b>Basis</b> sein, also die 100 %.</p>
      <p className="absatz">Die Idee kennst du aus Sitzung 3: Dort ergab dieselbe Zahl von CDU/CSU-Wählenden mit drei Basen drei verschiedene Prozent (Raw %, Valid % und eine eigene Basis). In einer Kreuztabelle gibt es für jede Zelle wieder drei Basen.</p>
      <ThreeBasesFigure caption={<>Dieselben 860 Frauen in Teilzeit, dreimal gerechnet. Gelb ist jeweils die Basis, also die 100 %. Die Anzahl in der Zelle bleibt gleich, nur der Nenner wechselt. <span>ALLBUS 2023, Erwerbstätige mit gültiger Angabe bei Geschlecht und Erwerbsform, n = 3.359, ungewichtet; Teilzeit heißt Teilzeit oder nebenher.</span></>} />
      <PercentFormula />
      <h6 className="zwischen">Basis-Schalter</h6>
      <p className="unter-zwischen">Stell die Prozent um und wähle eine Zelle. Gelb umrahmt ist die Basis der gewählten Zelle.</p>
      <BaseSwitch />
      <InShort>Eine Prozentzahl in einer Kreuztabelle braucht immer eine <b>Basis</b>, den Nenner, also die Gruppe, die 100 % ist. <b>Zeilenprozente</b> nehmen jede Zeile als 100 %, <b>Spaltenprozente</b> jede Spalte, <b>Gesamtprozente</b> (auch <b>Zellenprozente</b>) die ganze Tabelle. Welche du nimmst, hängt von der Frage ab: „Wie viele der …?“ – die Gruppe nach „der“ ist die Basis.</InShort>
      <Think id="g2-q" questions={[G2_Q]} />
      <MoreDetail summary="Wo sich 100 % ergeben, und wer in der Tabelle fehlt">
        <p>Bei Zeilenprozenten ergibt jede <b>Zeile</b> zusammen 100 % (48,3 + 51,7). Bei Spaltenprozenten jede <b>Spalte</b> (36,7 + 62,9 + 0,4 = 100). Bei Gesamtprozenten nur alle Zellen zusammen. So erkennst du in jeder Tabelle, welche Basis gemeint ist, auch wenn es nicht dabeisteht: Such die 100 %.</p>
        <p>In der Tabelle stehen nur Menschen, die bei beiden Fragen eine gültige Angabe haben. Hier sind es 3.359 Erwerbstätige; nicht Erwerbstätige sind leer (<a href="#g1">Grundlage 1</a>). Alle Zahlen sind ungewichtet. Gewichtet arbeiten {de(WEIGHTED.womenPart)} % der Frauen und {de(WEIGHTED.menPart)} % der Männer Teilzeit. Warum man gewichtet, ist Thema in Sitzung 6.</p>
      </MoreDetail>
      <MapLink concept="crosstab">Kreuztabelle mit Zeilen-, Spalten- und Zellenprozenten</MapLink>
      <Mixup>Spaltenprozente lesen und eine Aussage über die Zeile machen. „73,7 % der Teilzeitkräfte sind Frauen“ heißt nicht „73,7 % der Frauen arbeiten Teilzeit“. Das sind 51,7 %. Wer die Basis wechselt, ohne es zu merken, verdreht die Aussage.</Mixup>
    </Card>
  </Foundation>;
}

/** Grundlage 3: Leserichtung: prozentuieren und vergleichen (3a). */
export function Foundation3() {
  return <Foundation id="g3" n={3} title="Leserichtung: prozentuieren und vergleichen" taskHref="#a3"
    intro="Welche der drei Prozentbasen beantwortet eine Frage nach einem Unterschied, und wie beschreibst du ihn? Etwa 12 Minuten.">
    <Card id="v3" step="3a" title="Innerhalb der Gruppen der UV prozentuieren, zwischen ihnen vergleichen" badge={<Badge>Wiederholung: AV und UV</Badge>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Arbeiten Frauen häufiger Teilzeit als Männer? Um das zu beantworten, vergleichst du Frauen mit Männern. Damit der Vergleich fair ist, muss jede Gruppe für sich 100 % sein. Sonst hinge das Ergebnis auch davon ab, wie viele Frauen und Männer überhaupt in der Tabelle stehen.</p>
      <p className="absatz">Aus der Vorlesung kennst du die <b>unabhängige Variable (UV)</b>, die mögliche Ursache, hier das Geschlecht, und die <b>abhängige Variable (AV)</b>, das, was erklärt werden soll, hier die Erwerbsform. Die Faustregel: <b>Jede Gruppe der UV ist 100 %. Dann vergleichst du die Gruppen miteinander.</b></p>
      <ReadingDirectionFigure caption={<>Jede Zeile ist eine Gruppe der UV und für sich 100 %. Verglichen wird von oben nach unten: Frauen arbeiten 33,8 Prozentpunkte häufiger Teilzeit als Männer. <span>ALLBUS 2023, Erwerbstätige, n = 3.359, ungewichtet. In R sind das die Zeilenprozente aus ‚R lesen‘.</span></>} />
      <PointsFormula />
      <InShort>Für einen Vergleich setzt du <b>jede Gruppe der UV auf 100 %</b> und vergleichst dann die Anteile der AV zwischen den Gruppen. Steht die UV in den Zeilen, sind das die Zeilenprozente. Den Abstand zweier Anteile gibst du in <b>Prozentpunkten</b> an.</InShort>
      <Think id="g3-q" questions={[G3_Q1, G3_Q2]} />
      <MoreDetail summary="Tauschprobe, kleine Fallzahlen und Ursachen">
        <p><b>Tauschprobe:</b> Schreibst du in R die Variablen andersherum, <code>crosstab(teilzeit, sex, percentages = "col")</code>, steht das Geschlecht in den Spalten. Jetzt sind die Spaltenprozente die richtigen, und dort steht wieder 51,7 % für Frauen in Teilzeit. Ob „row“ oder „col“ passt, hängt also davon ab, wo die UV steht. Entscheidend ist nur: Wer ist 100 %?</p>
        <p><b>Kleine Gruppen:</b> 42,9 % klingt genau, sind aber 6 von 14 Menschen. Arbeitete eine dieser Personen Teilzeit statt Vollzeit, wären es 50 %. Nenne deshalb zu jeder Gruppe ihr n und deute kleine Gruppen vorsichtig.</p>
        <p><b>Zusammenhang ist nicht Ursache:</b> Die Tabelle zeigt, dass Frauen häufiger Teilzeit arbeiten. Warum, zeigt sie nicht; dafür bräuchte man weitere Variablen, etwa Kinder im Haushalt. Bei Einstellungen ist oft sogar unklar, was die UV ist: Was zuerst kommt, ist dann eine Annahme, die du begründen musst.</p>
      </MoreDetail>
      <Mixup>Prozent und Prozentpunkte. Steigt ein Anteil von 20 % auf 30 %, sind das 10 Prozentpunkte mehr, aber 50 Prozent mehr (die 10 sind die Hälfte von 20). In Berichten über Anteile nennst du den Abstand in Prozentpunkten.</Mixup>
    </Card>
  </Foundation>;
}

/** Grundlage 4: Umpolen: eine Skala umdrehen (4a, 4b). */
export function Foundation4() {
  return <Foundation id="g4" n={4} title="Umpolen: eine Skala umdrehen" taskHref="#a4"
    intro="Was tun, wenn bei einer Frage die kleine Zahl das Gute heißt? Etwa 10 Minuten.">
    <Card id="v4" step="4a" title="Wenn 1 sehr gut heißt" tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Der ALLBUS fragt, wie man die wirtschaftliche Lage in Deutschland heute beurteilt. Gespeichert ist: 1 = sehr gut, 2 = gut, 3 = teils/teils, 4 = schlecht, 5 = sehr schlecht. Eine höhere Zahl heißt also: schlechter. Wer sagen will „je höher, desto besser“, dreht die Skala um. Das heißt <b>umpolen</b>.</p>
      <UmpolenFigure caption={<>Umpolen dreht nur die Zahlen um. Jedes Wertelabel wandert mit seinem Code, und in jeder Kategorie stehen gleich viele Menschen wie vorher. Aus ‚höher heißt schlechter‘ wird ‚höher heißt besser‘. <span>Anzahlen: ALLBUS 2023, n = 5.194, ungewichtet.</span></>} />
      <InShort><b>Umpolen</b> dreht die Codes einer Skala um: Der kleinste wird der größte und umgekehrt. Die Antworten bleiben dieselben, nur die Richtung der Zahlen ändert sich. Man polt um, damit eine höhere Zahl immer „mehr“ von dem heißt, was man messen will.</InShort>
      <Think id="g4-q" questions={[G4_Q]} />
    </Card>
    <Card id="v5" step="4b" title="Zwei Aussagen, zwei Richtungen" tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">Umpolen brauchst du vor allem, wenn mehrere Fragen dasselbe messen sollen, aber in verschiedene Richtungen gestellt sind. Zum Beispiel: „Ich fühle mich in meinem Viertel sicher.“ und „Nachts habe ich in meinem Viertel Angst.“ Wer der ersten Aussage zustimmt, fühlt sich sicher. Wer der zweiten zustimmt, fühlt sich unsicher. Ein „stimme voll zu“ (Code 1) heißt also einmal das eine, einmal das Gegenteil.</p>
      <p className="absatz">Bevor du solche Fragen gemeinsam auswertest oder für beide dieselbe Regel nimmst, polst du eine um. Dann heißt Code 1 bei beiden dasselbe.</p>
      <MoreDetail summary="Umpolen oder anders zusammenfassen?">
        <p>In R polt <code>rec()</code> mit <code>rules = "rev"</code> um. Es nimmt dafür den kleinsten und den größten Code der Skala, so wie die Wertelabels sie angeben (bei <code>ep01</code> 1 und 5), und rechnet kleinster plus größter minus alter Code; fehlende Werte bleiben leer, die Wertelabels wandern mit. Mit <code>frequency()</code> prüfst du danach, ob die Wörter jetzt bei den neuen Codes stehen.</p>
        <p>Willst du nur zwei Kategorien bilden, geht es auch ohne Umpolen: Du schreibst die Regel einfach andersherum. Umpolen lohnt sich, wenn du danach mit mehreren Fragen gleich weiterarbeiten willst, etwa dieselbe Regel für alle oder später einen Mittelwert über mehrere Fragen (Sitzung 8).</p>
      </MoreDetail>
      <Mixup>Umpolen ist kein Fehlerbeheben. Die Daten waren vorher nicht falsch, sie zählten nur in die andere Richtung. Wichtig ist, dass du weißt, welche Richtung gilt, und es bei der Auswertung dazuschreibst.</Mixup>
    </Card>
  </Foundation>;
}

/** Überblick: Basis wählen, Grenzen kennen (Ü1 Zuordnen, Ü2 Voraussetzungen, Ü3 Chi-Quadrat als Wiederholung). */
export function Overview() {
  return <Foundation id="g5" n="✓" title="Basis wählen, Grenzen kennen" eyebrow="Überblick zu allen Aufgaben"
    intro="Alle vier Themen zusammen: welche Prozentbasis welche Frage beantwortet und was eine Kreuztabelle braucht.">
    <Card id="u1" step="Ü1" title="Wer ist 100 %?" tag={{ kind: 'estimate', label: 'Zuordnen' }}>
      <p className="lead">Such in jeder Frage die Gruppe nach „der“ oder „von“: Sie ist die Basis. Fragst du nach einem Unterschied zwischen Gruppen, ist jede Gruppe für sich 100 %. Alle Fragen beziehen sich auf eine Tabelle mit Wohngebiet (West, Ost) und Misstrauen (misstraut, misstraut nicht).</p>
      <WhoIs100 />
      <InShort>Erst die Frage, dann die Basis: „Wie viele der …“ legt fest, wer 100 % ist. Für einen Vergleich setzt du jede Gruppe der UV auf 100 % und gibst den Abstand in Prozentpunkten an.</InShort>
    </Card>
    <Card id="u2" step="Ü2" title="Voraussetzungen: Was eine Kreuztabelle braucht und wo sie täuschen kann">
      <table className="daten voll">
        <caption>Voraussetzungen der Kreuztabelle</caption>
        <thead><tr><th scope="col">Was</th><th scope="col">braucht</th><th scope="col">Vorsicht</th></tr></thead>
        <tbody>{PREREQUISITES.map(([what, needs, careful]) => <tr key={what}><td>{what}</td><td>{needs}</td><td>{careful}</td></tr>)}</tbody>
      </table>
    </Card>
    <Card id="u3" step="Ü3" title="Zufall oder Zusammenhang?" badge={<Badge>Wiederholung aus der Vorlesung</Badge>}>
      <p className="lead">Die 2.785 Befragten in deiner Tabelle sind eine <b>Stichprobe</b> aus einer <b>Grundgesamtheit</b>, beim ALLBUS den Erwachsenen, die in Deutschland in Privathaushalten leben. Auch wenn es dort keinen Zusammenhang gäbe, wären die Anteile in einer Stichprobe nie ganz gleich. Ob der Unterschied zwischen 6,5 % und 2,3 % größer ist, als der Zufall erwarten lässt, prüft der <b>Chi-Quadrat-Test</b> aus der Vorlesung. In R:</p>
      <Workshop k="ueb_chi" />
      <p className="absatz">R meldet <code>{`chi2(${CHI.df}) = ${CHI.chi2.toFixed(3)}, p < 0.001 ***`}</code> bei N = {CHI.n}. Das p ist der p-Wert. Er sagt hier: Gäbe es in der Grundgesamtheit keinen Zusammenhang, wäre ein so großer Unterschied in einer Stichprobe dieser Größe sehr unwahrscheinlich. Liegt p unter einer vorher festgelegten Schwelle, meist 5 %, dem Signifikanzniveau, nennt man den Unterschied <b>signifikant</b>. Der Test sagt aber nichts darüber, wie stark der Zusammenhang ist und was die Ursache ist. Die Stärke steht in derselben Zeile: <code>{`V = ${CHI.v.toFixed(3)} (negligible)`}</code>, auf Deutsch „vernachlässigbar“. Was V ist, lernst du in Sitzung 6.</p>
      <p className="absatz">Der Test hat selbst eine Voraussetzung: In jeder Zelle müssten ohne Zusammenhang genug Befragte zu erwarten sein (Faustregel: mindestens 5). Hier ist die kleinste erwartete Zahl gut 43; sonst warnt R (mehr dazu in Sitzung 6). Die Zahlen sind ungewichtet.</p>
      <Mixup>„Signifikant“ heißt nicht „groß“ oder „wichtig“. Bei vielen Befragten wird auch ein kleiner Unterschied wie 4,2 Prozentpunkte signifikant; R nennt ihn zugleich „negligible“.</Mixup>
    </Card>
  </Foundation>;
}

