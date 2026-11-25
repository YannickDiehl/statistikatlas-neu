// Kapitel 9 „Lineare Regression“, Reiter „Verstehen“ (Muster: kapitel/k04/KONZEPT.md): je Aufgabe erklären, was in jedem Schritt passiert und warum.
// Keine Übungen: Die „Kurz überlegen“-Fragen und das Schätzen der Grundlagen sind als rhetorische Fragen mit Antwort im Text aufgegangen.
// Zahlen im Text stammen aus dem durchgehenden Beispiel (Lebenszufriedenheit nach Lage) oder aus konstruierten Beispielen, nicht aus den Aufgaben.
import { Card, InShort, Mixup, MoreDetail, Badge } from '@atlas/chapter/blocks/Card';
import { HeadingLevel } from '@atlas/chapter/blocks/level';
import { ReadR } from '@atlas/chapter/s09/ReadR';
import { FormulaSteps } from '@atlas/chapter/s09/figures/FormulaSteps';
import { Residuals } from '@atlas/chapter/s09/figures/Residuals';
import { Rotate } from '@atlas/chapter/s09/figures/Rotate';
import { R2Squares } from '@atlas/chapter/s09/figures/R2Squares';
import { SpreadBars } from '@atlas/chapter/s09/figures/SpreadBars';
import { GroupBy } from '@atlas/chapter/s09/figures/GroupBy';
import { Outlier } from '@atlas/chapter/s09/figures/Outlier';
import { Curve } from '@atlas/chapter/s09/figures/Curve';
import { Assumptions } from '@atlas/chapter/s09/figures/Assumptions';
import '@atlas/chapter/s09/s09.css';
import type { Thema } from '../../react/typen';
import { Abschnitt, Bezug, Code, Frage } from '../../react/gemeinsam';
import { PunktwolkeMitGerade } from './figuren';
import { Begriff } from '@lernpfad/Begriff';

/* ---------- Vorweg ---------- */
export function Vorweg() {
  return <section className="grund-block" id="vorweg" aria-labelledby="vorweg-h">
    <div className="g-kopf">
      <span className="st m c7" aria-hidden="true">R</span>
      <div><div className="ueber">Vorweg, für alle Aufgaben</div><h4 id="vorweg-h">R lesen</h4></div>
    </div>
    <p className="g-intro">Alle vier Aufgaben arbeiten mit Ketten aus <Begriff id="pipe">Pipes</Begriff> wie <code>allbus %&gt;% linear_regression(y ~ x, weights = wghtpew) %&gt;% summary()</code>. Hier steht, wie du die Formel mit der Tilde liest und wo in der langen Ausgabe von <code>summary()</code> welche Zahl steht. Alle Zahlen aus dem ALLBUS sind in diesem Kapitel gewichtet (<code>weights = wghtpew</code>, kennst du aus Sitzung 6), genau wie die Ausgabe deiner Vorlagen.</p>
    <HeadingLevel.Provider value={5}><ReadR /></HeadingLevel.Provider>
  </section>;
}

/* ---------- Aufgabe 1 ---------- */
export function Verstehen1() {
  return <Abschnitt id="g1" n={1} titel="Vertrauen in den Bundestag und Zufriedenheit mit der Demokratie"
    frage="Wie viel zufriedener mit der Demokratie sind Menschen, die dem Bundestag mehr vertrauen?"
    ziel="die Gerade aus R abgelesen, kannst Konstante und Steigung in einem Satz deuten und hast eine Vorhersage von Hand ausgerechnet."
    weg={[
      ['Schritt 1', '#a1-p', 'Erst festlegen: Wie weit liegen die Vorhersagen für 1 und 7 auseinander?', 'k1-gerade'],
      ['Schritt 2', '#a1-1', 'Vorlage ausführen: umpolen, dann die Gerade rechnen', 'k1-vorlage'],
      ['Schritt 3', '#a1-2', 'Konstante, Steigung und N ablesen', 'k1-ablesen'],
      ['Schritt 4', '#a1-3', 'Vorhersage von Hand: Konstante plus Steigung mal Wert', 'k1-formel'],
      ['Schritt 5', '#a1-4', 'Deuten: Was bedeuten Steigung und Konstante?', 'k1-deuten'],
      ['Schritt 6', '#a1-5', 'Ergebnis festhalten: Zahlen, Vorhersage, zwei Deutungen, N', 'k1-ergebnis'],
    ]}>

    <Card id="k1-gerade" title="Worum es geht: eine Gerade durch das Streudiagramm" badge={<Bezug href="#a1-p">zu Schritt 1</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Aufgabe 1 fragt, wie viel zufriedener Menschen sind, die dem Bundestag mehr vertrauen. Eine <b><Begriff id="lineare-regression">lineare Regression</Begriff></b> beantwortet so eine Frage mit einer Geraden, der Regressionsgeraden. Wie das aussieht, zeigt ein Beispiel, das dich durch das ganze Kapitel begleitet: die Lebenszufriedenheit (0 bis 10) nach der eigenen wirtschaftlichen Lage (1 sehr schlecht bis 5 sehr gut). Das Bild ist ein <Begriff id="streudiagramm">Streudiagramm</Begriff>, kurz gesagt eine Punktwolke: Jede Kombination steht als Kreis.</p>
      <PunktwolkeMitGerade />
      <Frage>Wo verläuft die Gerade, die die Punkte am besten trifft?</Frage>
      <p>Schalte die Gerade aus R zu. Sie steigt von 4,64 bei sehr schlechter Lage auf 8,94 bei sehr guter, also um 4,29 Punkte. Wer nur auf die großen Kreise oben rechts schaut, schätzt den Anstieg leicht zu steil: Das Auge folgt den vielen Befragten mit guter Lage. Schaltest du die <Begriff id="mittelwert">Mittelwerte</Begriff> der Stufen zu, siehst du, wem die Gerade folgt: Die Rauten liegen fast genau auf ihr.</p>
      <InShort>Eine <b>lineare Regression</b> legt eine Gerade durch das Streudiagramm, die Regressionsgerade. Sie sagt für jeden Wert der <Begriff id="unabhaengige-variable">UV</Begriff> vorher, welchen Wert der <Begriff id="abhaengige-variable">AV</Begriff> man im Mittel erwartet. Sie folgt den Mittelwerten der Stufen, nicht den einzelnen Punkten.</InShort>
      <Frage>Und warum sollst du in Schritt 1 vorher festlegen, was du erwartest?</Frage>
      <p>Die Festlegung fragt, wie weit die Vorhersagen für „gar kein Vertrauen“ (1) und „großes Vertrauen“ (7) auseinanderliegen. Das ist der Anstieg der Geraden über sechs Stufen, so wie die 4,29 Punkte im Beispiel der Anstieg über vier Stufen Lage sind. Wer vorher eine Erwartung notiert, merkt hinterher, wo das eigene Bild danebenlag. Sind alle Fragen in Schritt 6 richtig, erscheint deine Festlegung mit der Auflösung.</p>
      <MoreDetail summary="Wozu eine Regression?">
        <ul>
          <li><b>Beschreiben:</b> Um wie viel unterscheidet sich die AV, wenn die UV um eine Stufe steigt? Anders als die <Begriff id="pearson">Korrelation</Begriff> r aus Sitzung 6 antwortet die Regression in der Einheit der AV, im Beispiel in Punkten Lebenszufriedenheit.</li>
          <li><b>Vorhersagen:</b> Welchen Wert erwarten wir für eine Gruppe, etwa für alle mit guter Lage?</li>
          <li><b>Erklären</b> will man oft, aber dafür reicht eine Gerade mit einer UV nicht. Andere Ursachen (Gesundheit, Einkommen, Alter) können hinter beidem stecken, wie die <Begriff id="drittvariable">Drittvariable</Begriff> aus Sitzung 6. Wie man sie in einer Regression berücksichtigt, ist Thema in Sitzung 10.</li>
          <li>Die Kreise zeigen <Begriff id="absolute-haeufigkeit">Häufigkeiten</Begriff> aus einer <Begriff id="kreuztabelle">Kreuztabelle</Begriff> (kennst du aus Sitzung 5), gewichtet. Bei nur elf und fünf Stufen lägen einzelne Punkte genau übereinander; darum zeigt das Bild, wie viele an jeder Stelle liegen.</li>
        </ul>
      </MoreDetail>
      <Mixup>Die Gerade geht nicht durch die meisten Punkte. Sie liegt so, dass alle Punkte zusammen ihr möglichst nahe sind. Kaum eine Person liegt genau auf ihr.</Mixup>
    </Card>

    <Card id="k1-vorlage" title="Die Vorlage: umpolen, dann die Gerade rechnen" badge={<Bezug href="#a1-1">zu Schritt 2</Bezug>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">Die Vorlage in Schritt 2 hat zwei Teile. Erst wird die Zufriedenheit mit der Demokratie umgepolt, dann rechnet R die Gerade.</p>
      <Code k="a1" />
      <Frage>Warum wird ps03 umgepolt?</Frage>
      <p>Bei ps03 heißt 1 „sehr zufrieden“ und 6 „sehr unzufrieden“: Eine kleine Zahl heißt zufrieden. Bei pt03 heißt eine große Zahl viel Vertrauen. Damit „mehr“ auf beiden Achsen in dieselbe Richtung zeigt, dreht <code>rec(ps03, rules = "rev")</code> die <Begriff id="code">Codes</Begriff> um (<Begriff id="umpolen">Umpolen</Begriff>, Sitzung 5). In der neuen <Begriff id="variable">Variable</Begriff> <code>demo</code> heißt 6 „sehr zufrieden“. Ohne Umpolen bekäme die Steigung das umgekehrte Vorzeichen; im Beispiel der Lage wäre sie −1,073 statt 1,073.</p>
      <Frage>Und was heißt <code>demo ~ pt03</code>?</Frage>
      <p>Die Tilde liest du als „aus“: Sag demo aus pt03 vorher. Links steht die AV, rechts die UV (<a href="#r2">Eine Formel mit Tilde</a>). <code>weights = wghtpew</code> <Begriff id="gewichte">gewichtet</Begriff> die Befragten, damit die Zahlen für ganz Deutschland gelten (Sitzung 6). <code>%&gt;% summary()</code> zeigt die ausführliche Ausgabe (Sitzung 7).</p>
      <InShort><code>linear_regression(AV ~ UV, weights = wghtpew)</code> rechnet die Gerade. Vorher polst du Variablen so um, dass eine hohe Zahl „mehr“ heißt; dann ist die Steigung leicht zu lesen.</InShort>
      <Mixup>Umpolen ändert nicht die Antworten, nur die Richtung der Codes. Wer „sehr zufrieden“ gesagt hat, steht danach bei 6 statt bei 1.</Mixup>
    </Card>

    <Card id="k1-ablesen" title="Konstante, Steigung und N in der Ausgabe finden" badge={<Bezug href="#a1-2">zu Schritt 3</Bezug>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">Die Ausgabe von <code>summary()</code> ist lang. Für die Gerade brauchst du drei Zahlen von zwei Stellen.</p>
      <ul className="v-liste">
        <li><b><Begriff id="konstante">Konstante</Begriff></b> (auch Achsenabschnitt): Abschnitt Coefficients, Zeile <code>(Intercept)</code>, Spalte B.</li>
        <li><b><Begriff id="regressionskoeffizient">Steigung</Begriff></b> (der Regressionskoeffizient B): dieselbe Spalte B, in der Zeile der UV, hier <code>pt03</code>.</li>
        <li><b>N:</b> ganz oben, in der Zeile <code>- N:</code>. N ist die <Begriff id="fallzahl">Fallzahl</Begriff>: So viele Befragte rechnen mit.</li>
      </ul>
      <p>Wie das im Beispiel der Lebenszufriedenheit aussieht, zeigt <a href="#r3">Die Ausgabe von summary() lesen</a>: Wähl dort „Konstante“, „Steigung“ oder „N“, und die Zahl wird in der Ausgabe markiert.</p>
      <Frage>Warum rechnen nicht alle Befragten mit?</Frage>
      <p>N zählt nur, wer bei beiden Variablen eine <Begriff id="gueltige-werte">gültige Antwort</Begriff> hat. ps03 und pt03 standen außerdem nur in einem Teil der Fragebögen; 1.596 Befragten wurden sie gar nicht gestellt (<Begriff id="tnz">TNZ: SPLIT</Begriff>, kennst du aus Sitzung 1). Darum ist N deutlich kleiner als die 5.246 Befragten des ALLBUS.</p>
      <Mixup>In der Zeile stehen mehrere Zahlen. Für die Gerade brauchst du <b>B</b>. <b><Begriff id="standardfehler">Std. Error</Begriff></b> daneben ist der Standardfehler von B: Er sagt nur, wie genau B geschätzt ist. <b><Begriff id="beta">Beta</Begriff></b> ist die Steigung in <Begriff id="standardabweichung">Standardabweichungen</Begriff> gemessen, der standardisierte Koeffizient. Auch der Mittelwert der AV in Descriptive Statistics ist nicht die Konstante.</Mixup>
      <MoreDetail summary="Ohne Gewicht kommt etwas anderes heraus">
        <p>Fehlt <code>weights = wghtpew</code>, rechnet R ungewichtet, und Konstante und Steigung weichen leicht ab. Steht in der Ausgabe oben <code>- Weights: wghtpew</code>, ist das Gewicht dabei.</p>
      </MoreDetail>
    </Card>

    <Card id="k1-formel" title="Konstante und Steigung: die Formel als Bausteine" badge={<Bezug href="#a1-3">zu Schritt 4</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Jede Gerade ist durch zwei Zahlen festgelegt. Für das Beispiel hat R ausgerechnet: Konstante 3,570, Steigung 1,073. Was sagt die Gerade über eine Person mit guter Lage (Stufe 4)? Geh die drei Rechenschritte im Bild durch (sie zählen nicht zu den Schritten der Aufgabe).</p>
      <FormulaSteps />
      <p>Genau diese Rechnung steht in der Vorlage von Schritt 4. Ihr Kommentar nennt das Beispiel noch „Grundlage 1“.</p>
      <Code k="a1r" />
      <p>In Schritt 4 tauschst du die drei markierten Zahlen: die Konstante und die Steigung, die du in Schritt 3 abgelesen hast, und den Wert der UV, für den du vorhersagen willst. Kommazahlen schreibst du in R mit Punkt: 3.570, nicht 3,570.</p>
      <Frage>Und für Befragte mit schlechter Lage (Stufe 2)?</Frage>
      <p>3,570 + 1,073 × 2 = 5,716. Das ist die Höhe der Geraden über „schlecht“. Zwei andere Zahlen liegen nahe und sind trotzdem etwas anderes. 5,641 ist der Mittelwert der Befragten mit schlechter Lage, die Raute im Bild; gefragt ist aber der Wert auf der Geraden. Und wer erst plus, dann mal rechnet, kommt auf (3,570 + 1,073) × 2 = 9,286. Die Steigung wird mit dem Wert malgenommen, die Konstante nicht. R rechnet von selbst erst mal, dann plus.</p>
      <InShort>Die <b>Konstante</b> (auch Achsenabschnitt) ist die Höhe der Geraden, wenn die UV 0 ist. Die <b>Steigung</b> (Regressionskoeffizient B) sagt, um wie viel die Vorhersage steigt, wenn die UV um eine Einheit steigt. Konstante plus Steigung mal <Begriff id="wert">Wert</Begriff> ergibt die <b>Vorhersage</b>, fachlich den <Begriff id="vorhersage">linearen Prädiktor</Begriff> (ŷ).</InShort>
      <MoreDetail summary="Steigung in Worten, auch wenn sie negativ ist">
        <ul>
          <li>Satzmuster: „Mit jeder Stufe mehr &#123;UV&#125; liegt die vorhergesagte &#123;AV&#125; um &#123;B&#125; Punkte höher.“ Im Beispiel: Mit jeder Stufe besserer Lage liegt die vorhergesagte Lebenszufriedenheit um 1,07 Punkte höher.</li>
          <li>Ist B negativ, sinkt die Vorhersage: „um … Punkte niedriger“. Ob B positiv oder negativ ist, hängt auch davon ab, wie die Codes laufen. Darum wurde ep03 umgepolt: Im Original heißt 1 „sehr gut“, und B wäre −1,073.</li>
          <li>Von der schlechtesten zur besten Stufe sind es vier Schritte: 4 mal 1,073 = 4,29 Punkte.</li>
        </ul>
      </MoreDetail>
      <Mixup>Die Steigung ist kein Prozentwert und keine Korrelation. 1,073 heißt „gut einen Punkt Lebenszufriedenheit mehr pro Stufe Lage“, in der Einheit der AV.</Mixup>
    </Card>

    <Card id="k1-deuten" title="Die Vorhersage gilt im Mittel, die Konstante ist ein Achsenabschnitt" badge={<Bezug href="#a1-4">zu Schritt 5</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">Die Gerade sagt für Menschen mit sehr guter Lage 8,94 vorher. Heißt das, alle mit sehr guter Lage sind so zufrieden? Schau ins Bild in <a href="#k1-gerade">Worum es geht</a>: Bei „sehr gut“ reichen die Kreise von 1 bis 10.</p>
      <p>Die Vorhersage ist der Wert, den man für eine Gruppe <b>im Mittel</b> erwartet. Einzelne Menschen liegen darüber oder darunter, oft weit. Wie weit, ist Thema in Aufgabe 2 und 3.</p>
      <Frage>Was bedeutet hier die Konstante 3,570?</Frage>
      <p>Sie ist die Höhe der Geraden bei Lage 0. Eine Lage 0 gibt es auf der Skala von 1 bis 5 aber nicht. Die Konstante ist dann nur der Punkt, an dem die Gerade die y-Achse schneiden würde: der Achsenabschnitt. Man deutet ihn hier nicht, man braucht ihn nur zum Rechnen. Sie ist auch nicht die Zufriedenheit bei sehr schlechter Lage: Für Stufe 1 sagt die Gerade 3,570 + 1,073 = 4,643 vorher. Und sie ist nicht der Durchschnitt aller Befragten; der steht in Descriptive Statistics und liegt bei 7,398.</p>
      <Frage>Und wie sagt man die Steigung in einem Satz?</Frage>
      <p>Mit dem Satzmuster: „Mit jeder Stufe mehr &#123;UV&#125; liegt die vorhergesagte &#123;AV&#125; um &#123;B&#125; Punkte höher.“ Im Beispiel: Mit jeder Stufe besserer Lage liegt die vorhergesagte Lebenszufriedenheit um 1,07 Punkte höher. Das Wort „vorhergesagt“ ist wichtig. „Wer seine Lage besser einschätzt, wird dadurch zufriedener“ behauptet eine <Begriff id="kausalitaet">Ursache</Begriff>. Die Regression zeigt nur einen <Begriff id="zusammenhang">Zusammenhang</Begriff>: Wer seine Lage besser einschätzt, ist im Mittel zufriedener (<a href="#k5-ursache">Zusammenhang, nicht Ursache</a>).</p>
      <InShort>Die Vorhersage einer Regression gilt für eine Gruppe im Mittel, nicht für einzelne Personen. Die Konstante deutet man nur, wenn der Wert 0 bei der UV vorkommt.</InShort>
      <MoreDetail summary="Vorhersagen außerhalb der Daten">
        <p>Die Gerade beschreibt den Bereich, in dem es Daten gibt, im Beispiel Lage 1 bis 5. Was außerhalb passiert, weiß sie nicht. Eine „Lage 6“ würde nach der Formel 10,008 ergeben, mehr als die Skala erlaubt.</p>
      </MoreDetail>
      <Mixup>„Die Gerade sagt 7,9 vorher“ heißt nicht „wer gut lebt, ist 7,9 zufrieden“. Es heißt: Im Mittel sind Menschen mit guter Lage etwa so zufrieden; einzelne liegen weit daneben.</Mixup>
    </Card>

    <Card id="k1-ergebnis" title="Ergebnis festhalten: was die Fragen wissen wollen" badge={<Bezug href="#a1-5">zu Schritt 6</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">In Schritt 6 hältst du sechs Dinge fest. Jedes hat einen Ort, an dem du es findest.</p>
      <ul className="v-liste">
        <li><b>Konstante und Steigung:</b> Ausgabe aus Schritt 2, Coefficients, Spalte B (<a href="#k1-ablesen">Zahlen finden</a>). Gib sie so ein, wie R sie zeigt.</li>
        <li><b>Die Vorhersage für großes Vertrauen:</b> das Ergebnis deiner Rechnung in Schritt 4 (<a href="#k1-formel">Die Formel als Bausteine</a>).</li>
        <li><b>Was die Steigung bedeutet:</b> das Satzmuster, und das Wort „vorhergesagt“ statt „dadurch“ (<a href="#k1-deuten">Deuten</a>).</li>
        <li><b>Was die Konstante bedeutet:</b> Frag dich, ob es bei pt03 den Wert 0 gibt (<a href="#k1-deuten">Deuten</a>).</li>
        <li><b>N:</b> oben in der Ausgabe, Zeile <code>- N:</code>.</li>
      </ul>
      <p>Sind alle Fragen richtig, steht deine Festlegung aus Schritt 1 neben der Auflösung. Lag sie daneben, ist das kein Fehler, sondern genau der Moment, für den man vorher festlegt.</p>
    </Card>
  </Abschnitt>;
}

/* ---------- Aufgabe 2 ---------- */
export function Verstehen2() {
  return <Abschnitt id="g2" n={2} titel="Vertrauen oder Schicht: Was sagt mehr?"
    frage="Sagt das Vertrauen in den Bundestag die Zufriedenheit mit der Demokratie besser vorher als die eigene Schicht?"
    ziel="R² und den Standardfehler der Schätzung gelesen und kannst begründen, was eine fast gleich steile Gerade über die Güte der Vorhersage sagt und was nicht."
    weg={[
      ['Schritt 1', '#a2-p', 'Erst festlegen: Was heißt „besser vorhersagen“?', 'k2-r2'],
      ['Hintergrund', '#a2-1', 'Residuen: wie weit jede Person danebenliegt', 'k2-residuen'],
      ['Hintergrund', '#a2-1', 'Kleinste Quadrate: warum gerade diese Gerade', 'k2-quadrate'],
      ['Schritt 2', '#a2-1', 'Regression mit dem Vertrauen: R², Standardfehler der Schätzung, SD von demo', 'k2-r2'],
      ['Schritt 2', '#a2-1', 'die Vorlage lesen', 'k2-vorlage'],
      ['Schritt 3', '#a2-2', 'die Schicht einsetzen', 'k2-vorlage'],
      ['Schritt 4', '#a2-3', 'die beiden Ausgaben vergleichen', 'k2-vergleich'],
      ['Schritt 5', '#a2-4', 'Ergebnis festhalten', 'k2-ergebnis'],
    ]}>

    <Card id="k2-residuen" title="Residuen: wie weit daneben?" badge={<Badge>Hintergrund für Schritt 2</Badge>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Bei Tausenden Befragten sieht man einzelne Abstände nicht. Darum hier acht Befragte, zum Beispiel. Jede Person hat eine Lage (1 bis 5) und eine Lebenszufriedenheit. Die grüne Gerade ist die beste Gerade für diese acht: 4 + 1 × Lage. Tipp eine Person an, dann siehst du ihre Rechnung.</p>
      <Residuals />
      <InShort>Das <b><Begriff id="residuum">Residuum</Begriff></b> ist der Abstand eines Punktes von der Geraden, senkrecht gemessen: beobachteter Wert minus vorhergesagter Wert. Positiv heißt „über der Geraden“, negativ „darunter“.</InShort>
      <Frage>Was hat das mit Aufgabe 2 zu tun?</Frage>
      <p>Fasst man alle Residuen zusammen, bekommt man zwei Zahlen, die du in Schritt 2 in der Ausgabe liest: R² und den <Begriff id="standardfehler-schaetzung">Standardfehler der Schätzung</Begriff> (Std. Error of the Estimate). Beide sagen, wie weit die Befragten im Ganzen von der Geraden entfernt liegen (<a href="#k2-r2">R²</a>).</p>
      <Mixup>Ein Residuum ist kein Fehler der Person und kein <Begriff id="messfehler">Messfehler</Begriff>. Es ist das, was die Gerade an dieser Person nicht erklärt.</Mixup>
    </Card>

    <Card id="k2-quadrate" title="Kleinste Quadrate: Dreh die Gerade selbst" badge={<Badge>Hintergrund für Schritt 2</Badge>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Warum ist gerade 4 + 1 × Lage die beste Gerade? Dreh sie mit dem Regler und schau, wie die quadrierten Residuen wachsen oder schrumpfen. Die Gerade dreht sich um den Schwerpunkt (3 | 7).</p>
      <Rotate />
      <InShort>Die Regression wählt die Gerade, bei der die Quadratsumme der Residuen (SSE), also die Summe der quadrierten Residuen, am kleinsten ist. Darum heißt das Verfahren <b><Begriff id="kleinste-quadrate">Methode der kleinsten Quadrate</Begriff></b> (OLS, ordinary least squares).</InShort>
      <MoreDetail summary="Warum quadrieren?">
        <ul>
          <li>Residuen über und unter der Geraden heben sich auf: Bei der besten Geraden ergeben sie zusammen immer 0. Quadriert zählen alle als positiv.</li>
          <li>Quadrate bestrafen große Abstände stark: Ein Residuum von 2 zählt 4, eines von 3 zählt 9. Darum zieht ein einzelner Punkt weit draußen die Gerade zu sich (<a href="#k3-ausreisser">Ausreißer</a>).</li>
          <li>Die beste Gerade geht immer durch den Schwerpunkt, den Punkt aus den beiden Mittelwerten. Im Bild ist das (3 | 7), darum dreht sich der Regler um diesen Punkt.</li>
        </ul>
      </MoreDetail>
      <Mixup>Kleinste Quadrate heißt nicht „trifft am meisten Punkte genau“. Eine Gerade, die drei Punkte genau trifft, kann trotzdem eine größere Quadratsumme der Residuen haben als die Gerade aus R.</Mixup>
    </Card>

    <Card id="k2-r2" title="R²: um wie viel besser als der Mittelwert?" badge={<Bezug href="#a2-p">zu Schritt 1 und 2</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">„Besser vorhersagen“ heißt in Aufgabe 2: näher an den Befragten liegen. Gemessen wird das gegen den einfachsten Weg. Ohne die Lage könntest du für alle acht Befragten nur den Mittelwert 7 vorhersagen. Die Quadratsumme der Residuen ist dann 18. Mit der Lage ist sie 6. Um wie viel besser ist die Gerade?</p>
      <R2Squares />
      <Frage>Wie viel Prozent der Streuung erklärt die Lage im ALLBUS?</Frage>
      <p>R² = 0,203, in Prozent 20,3 %. Gut ein Fünftel der Unterschiede in der Lebenszufriedenheit hängt (linear) mit der Lage zusammen, knapp vier Fünftel nicht. In der Ausgabe steht R² als Anteil, bei R Square: 0.203. Verwechsle es nicht mit R eine Zeile darüber: R = 0,450 ist die <Begriff id="pearson">Korrelation</Begriff>, R² ist R mal R, 0,45 mal 0,45 ≈ 0,20.</p>
      <InShort><b><Begriff id="r-quadrat">R²</Begriff></b> (erklärter Varianzanteil) vergleicht die Gerade mit dem Mittelwert: Um welchen Anteil ist die Quadratsumme der Residuen kleiner als ohne UV? 0 heißt „nicht besser als der Mittelwert“, 1 heißt „alle Punkte liegen auf der Geraden“. Mit einer UV ist R² das Quadrat der Pearson-Korrelation r. Der <b>Standardfehler der Schätzung</b> (Std. Error of the Estimate): wie weit die Vorhersage typischerweise danebenliegt, in Punkten der AV. Im Beispiel sind das 1,72 Punkte.</InShort>
      <Frage>Und warum liest du in Schritt 2 auch die Standardabweichung von demo?</Frage>
      <p>Ohne UV sagt man allen den Mittelwert vorher. Wie weit man damit typischerweise danebenliegt, ist die <Begriff id="standardabweichung">Standardabweichung</Begriff> der AV, bei der Lebenszufriedenheit 1,926. Mit der Lage sind es 1,720. Der Vergleich der beiden Zahlen zeigt, wie viel die Gerade gegenüber dem Mittelwert gewinnt. Daraus kommt wieder R²: 1 − (1,720 / 1,926)² ≈ 0,20.</p>
      <MoreDetail summary="Die Verbindung zu r, und was „gut“ ist">
        <ul>
          <li>In Sitzung 6 hast du r kennengelernt. Zwischen Lage und Lebenszufriedenheit ist r = 0,450 (gewichtet). 0,450 × 0,450 = 0,2025, also etwa 0,20; mit dem ungerundeten r kommt genau R² = 0,203 heraus. Mit einer UV zeigt die Ausgabe r auch als Beta und, ohne Vorzeichen, als R.</li>
          <li>„Erklärt“ ist hier ein statistisches Wort: Mit der Geraden wird die Quadratsumme der Residuen kleiner. Dass die UV die AV verursacht, ist damit nicht gezeigt (<a href="#k5-ursache">Zusammenhang, nicht Ursache</a>).</li>
          <li>Was „gut“ ist, hängt vom Thema ab. Bei Einstellungen und Zufriedenheit sind R² von 0,1 bis 0,3 mit einer UV häufig, weil viele Dinge zusammenspielen.</li>
          <li>Die Quadratsummen stehen im Abschnitt ANOVA der Ausgabe: Regression 3.858,902 (erklärt), Residual 15.182,029 (übrig), Total 19.040,931 (alle).</li>
        </ul>
      </MoreDetail>
      <Mixup>R² = 0,203 heißt nicht, dass die Gerade bei 20 % der Befragten genau stimmt, und auch nicht, dass 20 % zufrieden sind. R² vergleicht die Quadratsumme der Residuen mit und ohne UV.</Mixup>
    </Card>

    <Card id="k2-vorlage" title="Die Vorlage, und was du in Schritt 3 tauschst" badge={<Bezug href="#a2-1">zu Schritt 2 und 3</Bezug>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">Schritt 2 rechnet die Regression aus Aufgabe 1 noch einmal, diesmal, um R² und den Standardfehler der Schätzung zu lesen. Schritt 3 tauscht genau eine Stelle.</p>
      <Code k="a2" />
      <Frage>Warum steht das Umpolen schon wieder drin?</Frage>
      <p>Die Kette in Aufgabe 1 beginnt mit <code>allbus %&gt;%</code>, nicht mit <code>allbus &lt;-</code>. Sie hat <code>demo</code> also nur für diese eine Rechnung gebildet und nicht im <Begriff id="datenmatrix">Datensatz</Begriff> gespeichert. Darum polt jede Vorlage, die demo braucht, selbst um (<a href="#r1">Startblock und was du schon kennst</a>).</p>
      <Frage>Was ändert sich in Schritt 3?</Frage>
      <p>Nur die markierte UV: Aus <code>demo ~ pt03</code> wird <code>demo ~ id02</code>. Die AV bleibt demo, darum bleibt auch das Umpolen von ps03. Die Schicht selbst polst du nicht um; bei id02 heißt eine hohe Zahl schon „höher“. Weil die neue Ausgabe im selben Block die alte ersetzt, notierst du die Zahlen für pt03 vorher, oder du rechnest die Schicht in einem eigenen Block.</p>
      <InShort>Mit derselben AV und einer anderen UV vergleichst du, welche UV die AV besser vorhersagt. Verglichen wird R², nicht die Steigung.</InShort>
    </Card>

    <Card id="k2-vergleich" title="Zwei Ausgaben vergleichen: Steigung und R²" badge={<Bezug href="#a2-3">zu Schritt 4</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">In Schritt 4 legst du zwei Ausgaben nebeneinander: zuerst die Steigungen, dann R² und den Standardfehler der Schätzung.</p>
      <Frage>Kann eine fast gleich steile Gerade trotzdem schlechter vorhersagen?</Frage>
      <p>Die Steigung beantwortet eine Frage: Um wie viel ändert sich die Vorhersage pro Stufe der UV? R² und der Standardfehler der Schätzung beantworten eine andere; welche, steht in <a href="#k2-r2">R²</a>. Passen die Reihenfolgen bei B und bei R² nicht zusammen, frag dich, was jede der beiden Zahlen misst.</p>
      <Frage>Und worauf achtest du außerdem?</Frage>
      <p>Darauf, wie stark die UV selbst streut. Eine Steigung gilt pro Stufe. Nutzen fast alle Befragten nur wenige, benachbarte Stufen, dann ändert auch eine steile Gerade die Vorhersage über die Befragten hinweg kaum. Wie stark eine Variable streut, steht in Descriptive Statistics in der Spalte Std. Deviation.</p>
      <Mixup>B steht in Coefficients, R² in Model Summary. Vergleiche B mit B und R² mit R², nicht B der einen mit R² der anderen Ausgabe.</Mixup>
      <MoreDetail summary="Fürs Plenum: Erklärung oder dasselbe gefragt?">
        <p>„Erklärt“ heißt bei R² nur: Mit der Geraden wird die Quadratsumme der Residuen kleiner. Ob die UV die AV verursacht, ob es umgekehrt ist, oder ob beide Fragen fast dasselbe messen, kann R nicht entscheiden. Dafür braucht es inhaltliche Gründe.</p>
      </MoreDetail>
    </Card>

    <Card id="k2-ergebnis" title="Ergebnis festhalten: was die Fragen wissen wollen" badge={<Bezug href="#a2-4">zu Schritt 5</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">In Schritt 5 hältst du sechs Dinge fest, aus zwei Ausgaben.</p>
      <ul className="v-liste">
        <li><b>R² mit dem Vertrauen:</b> Ausgabe aus Schritt 2, Model Summary, R Square. Gib es als Anteil ein, so wie R es zeigt, nicht in Prozent.</li>
        <li><b>Was R² heißt:</b> der Vergleich mit dem Mittelwert (<a href="#k2-r2">R²</a>).</li>
        <li><b>Der Standardfehler der Schätzung:</b> Std. Error of the Estimate in Model Summary. Nicht die Standardabweichung von demo, und nicht Std. Error in Coefficients (der <Begriff id="standardfehler">Standardfehler</Begriff> von B).</li>
        <li><b>R² und Steigung mit der Schicht:</b> Ausgabe aus Schritt 3; die Steigung in der Zeile id02, Spalte B, nicht Beta.</li>
        <li><b>Steigung gegen R²:</b> dein Vergleich aus Schritt 4 (<a href="#k2-vergleich">Zwei Ausgaben vergleichen</a>).</li>
      </ul>
    </Card>
  </Abschnitt>;
}

/* ---------- Aufgabe 3 ---------- */
export function Verstehen3() {
  return <Abschnitt id="g3" n={3} titel="Für wen liegt die Gerade daneben?"
    frage="Sagt das Vertrauen in den Bundestag die Zufriedenheit für alle gleich gut vorher, oder für manche viel schlechter?"
    ziel="für jede Person das Residuum gebildet, seine Streuung je Stufe verglichen und den Levene-Test gelesen, und kannst sagen, für wen die Gerade am weitesten danebenliegt."
    weg={[
      ['Schritt 1', '#a3-p', 'Erst festlegen: Für wen liegt die Gerade weiter daneben?', 'k3-fehlervarianz'],
      ['Schritt 2', '#a3-1', 'Vorhersage und Residuum für jede Person bilden', 'k3-vorlage'],
      ['Schritt 2', '#a3-1', 'group_by(): für jede Stufe getrennt rechnen', 'k3-groupby'],
      ['Schritt 3', '#a3-2', 'die Streuung je Stufe lesen', 'k3-sd'],
      ['Schritt 4', '#a3-3', 'Levene-Test und Faustregel', 'k3-levene'],
      ['Schritt 5', '#a3-4', 'Deuten: Was heißt das für einen Bericht?', 'k3-bericht'],
      ['Schritt 6', '#a3-5', 'Ergebnis festhalten', 'k3-bericht'],
      ['Hintergrund', '#a3-p', 'Ausreißer: ein Punkt zieht die Gerade (keine eigene Aufgabe)', 'k3-ausreisser'],
    ]}>

    <Card id="k3-fehlervarianz" title="Gleiche Fehlervarianz: Streuen die Residuen überall gleich?" badge={<Bezug href="#a3-p">zu Schritt 1</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Die Gerade für die Lebenszufriedenheit nach Lage liegt typischerweise 1,72 Punkte daneben. Gilt das für alle? Für jede Stufe der Lage hat R ausgerechnet, wie stark die <Begriff id="residuum">Residuen</Begriff> <Begriff id="streuung">streuen</Begriff> (Standardabweichung).</p>
      <SpreadBars />
      <Frage>Für wen ist die Vorhersage der Lebenszufriedenheit am ungenauesten?</Frage>
      <p>Für Menschen mit sehr schlechter Lage. Dort streuen die Residuen mit 2,72 Punkten am stärksten: Manche sind trotzdem sehr zufrieden, andere sehr unzufrieden. Bei sehr guter Lage sind sich die Befragten einiger (1,27). Die Gerade ist eine, aber die Punkte liegen unterschiedlich weit von ihr entfernt. Genau das zeigen die Säulen.</p>
      <p>Dieselbe Frage stellt Aufgabe 3 für das Vertrauen in den Bundestag. In Schritt 1 legst du dich fest, für wen die Gerade dort wohl weiter danebenliegt.</p>
      <InShort><b><Begriff id="gleiche-fehlervarianz">Gleiche Fehlervarianz</Begriff></b> (Homoskedastizität) heißt: Die Residuen streuen für alle Werte der UV gleich stark. Bei Gruppen hieß das in Sitzung 7 <Begriff id="varianzhomogenitaet">Varianzhomogenität</Begriff>. Ist sie verletzt (Heteroskedastizität), gilt der <Begriff id="standardfehler-schaetzung">Standardfehler der Schätzung</Begriff> nicht für alle; für manche Gruppen liegt die Vorhersage viel weiter daneben. Im Streudiagramm sieht das aus wie ein Fächer.</InShort>
      <Mixup>Gleiche Fehlervarianz heißt nicht, dass die Gruppen gleich zufrieden sind. Es geht nicht um die Mittelwerte, sondern darum, wie weit die Menschen in jeder Gruppe um die Gerade herum streuen.</Mixup>
    </Card>

    <Card id="k3-vorlage" title="Die Vorlage: Vorhersage und Residuum für jede Person" badge={<Bezug href="#a3-1">zu Schritt 2</Bezug>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">Die Vorlage in Schritt 2 hat drei Teile: Erst bildet sie zwei neue Spalten, dann beschreibt sie das Residuum je Stufe, dann testet sie.</p>
      <Code k="a3" />
      <ul className="v-liste">
        <li><code>vorhersage = … + … * pt03</code> ist die Formel aus Aufgabe 1, Konstante plus Steigung mal Wert, nur jetzt für jede Person mit ihrem eigenen Wert bei pt03 (<a href="#k1-formel">Die Formel als Bausteine</a>).</li>
        <li><code>residuum = demo - vorhersage</code> ist beobachtet minus vorhergesagt (<a href="#k2-residuen">Residuen</a>). Positiv heißt: Die Person ist zufriedener, als die Gerade vorhersagt.</li>
        <li><code>allbus &lt;- allbus %&gt;%</code> speichert die neuen Spalten im Datensatz. Anders als in Aufgabe 1 und 2 werden die Spalten danach noch gebraucht, von den beiden Ketten darunter.</li>
      </ul>
      <Frage>Warum müssen die markierten Zahlen getauscht werden?</Frage>
      <p>Noch stehen dort Konstante und Steigung aus dem Beispiel der Lebenszufriedenheit (3.570 und 1.073). Mit ihnen wären die Vorhersagen für die Zufriedenheit mit der Demokratie viel zu hoch, und die Mittelwerte des Residuums lägen weit weg von 0. Erst mit Konstante und Steigung aus Aufgabe 1 ist es die Gerade dieser Aufgabe.</p>
      <Mixup>Ein Komma in der Zahl, etwa <code>vorhersage = 3,570 + …</code>. R meldet keinen Fehler, liest aber <code>vorhersage = 3</code> und bildet aus dem Rest eine zweite, unbenannte Spalte. Die Mittelwerte liegen dann weit weg. In R schreibst du Kommazahlen mit Punkt.</Mixup>
    </Card>

    <Card id="k3-groupby" title="group_by(): für jede Stufe getrennt rechnen" badge={<Bezug href="#a3-1">zu Schritt 2</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Neu heute ist <code>group_by()</code>. Es teilt die Befragten in Gruppen, eine je <Begriff id="auspraegung">Ausprägung</Begriff> der Variable, und alles, was danach kommt, rechnet R für jede Gruppe getrennt.</p>
      <GroupBy />
      <ul className="v-liste">
        <li><code>group_by(pt03)</code> fasst alle mit derselben Antwort bei pt03 zu einer eigenen Gruppe zusammen: sieben Gruppen.</li>
        <li><code>describe(residuum, weights = wghtpew, show = c("mean", "sd"))</code> gibt darum sieben kleine Tabellen aus, eine je Stufe, in der Reihenfolge 1 bis 7. <code>show</code> wählt Mittelwert und Standardabweichung (kennst du aus Sitzung 4).</li>
        <li>Nur 1 und 7 haben einen Namen (GAR KEIN VERTRAUEN, GROSSES VERTRAUEN); die Stufen 2 bis 6 zeigt R als „..“. N ist gewichtet gezählt.</li>
        <li><code>drop_na(residuum)</code> lässt vorher alle weg, für die es kein Residuum gibt, weil ps03 oder pt03 fehlt (kennst du aus Sitzung 4).</li>
      </ul>
      <InShort><code>group_by()</code> teilt die Daten in Gruppen; die Funktion danach rechnet für jede Gruppe getrennt.</InShort>
      <Mixup><code>group_by()</code> allein ändert keine Zahl. Es merkt sich nur die Gruppen; erst <code>describe()</code> danach rechnet je Gruppe.</Mixup>
    </Card>

    <Card id="k3-sd" title="Die Streuung je Stufe lesen" badge={<Bezug href="#a3-2">zu Schritt 3</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">In Schritt 3 liest du in jeder der sieben Tabellen die Spalte SD. Sie sagt, wie stark die Residuen in dieser Stufe streuen: wie unterschiedlich weit die Befragten dort über oder unter der Geraden liegen. Ob die Gerade die Stufe im Mittel trifft, zeigt Mean.</p>
      <Frage>Warum ändern Konstante und Steigung die SD nicht?</Frage>
      <p>Innerhalb einer Stufe sagt die Gerade allen denselben Wert vorher. Die SD des Residuums ist dort die SD der Zufriedenheit selbst. Darum stimmen die SD-Werte schon, bevor du die Zahlen tauschst; nur die Mittelwerte (Mean) brauchen die richtige Gerade.</p>
      <Frage>Und was zeigt Mean?</Frage>
      <p>Mean ist der Mittelwert des Residuums in einer Stufe. Liegt er nahe 0, trifft die Gerade diese Stufe im Mittel. Ist er negativ, liegen die Befragten der Stufe im Mittel unter der Geraden: Die Gerade sagt ihnen zu viel vorher. Achte darum auf das Vorzeichen.</p>
      <Mixup>SD und Mean nicht verwechseln. SD sagt, wie weit die Befragten einer Stufe auseinanderliegen; Mean sagt, ob die Gerade die Stufe im Mittel trifft. Und die SD einer Stufe ist nicht der Standardfehler der Schätzung: Der gilt für alle zusammen.</Mixup>
    </Card>

    <Card id="k3-levene" title="Zwei Wege zu prüfen: Levene-Test und Faustregel" badge={<Bezug href="#a3-3">zu Schritt 4</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">Ob die Residuen überall gleich stark streuen, prüfst du auf zwei Wegen. Hier am Beispiel der Lebenszufriedenheit nach Lage.</p>
      <ul className="v-liste">
        <li><b>Die Größe ansehen:</b> Vergleiche die größte und die kleinste Streuung. Faustregel wie in Sitzung 7: Ist die größte mehr als doppelt so groß wie die kleinste, unterscheiden sich die Streuungen deutlich. Im Beispiel: 2,72 zu 1,27, gut doppelt so groß.</li>
        <li><b>Der <Begriff id="levene-test">Levene-Test</Begriff></b> prüft, ob die Streuungen in allen Gruppen gleich sein könnten. Kurz gesagt: Ist der <Begriff id="p-wert">p-Wert</Begriff> kleiner als 0,05, streuen die Gruppen verschieden; R schreibt dann „variances unequal“. Im Beispiel: F = 67,18, p &lt; 0,001. Die Streuungen unterscheiden sich also.</li>
        <li>Beides gehört zusammen: Bei Tausenden Befragten wird auch ein kleiner Unterschied <Begriff id="signifikanzniveau">signifikant</Begriff>. Der Test sagt, ob die Streuungen verschieden sind, die Faustregel, ob der Unterschied groß ist.</li>
      </ul>
      <p>In der Vorlage steht der Test in der letzten Kette: <code>levene_test(residuum, group = pt03, weights = wghtpew)</code>. Zuerst kommt die Variable, deren Streuung verglichen wird, nach <code>group =</code> die Gruppen.</p>
      <MoreDetail summary="Was F misst">
        <p>F misst, wie verschieden die Streuungen sind, ähnlich wie F in der <Begriff id="anova">ANOVA</Begriff> aus Sitzung 7 verschiedene Mittelwerte misst. Den Levene-Test kannst du ebenso für die Gruppen eines <Begriff id="t-test">t-Tests</Begriff> oder einer ANOVA rechnen.</p>
      </MoreDetail>
      <Mixup>Die Faustregel beantwortet eine andere Frage als der Test: Sie sagt, ob ein Unterschied groß ist, nicht, ob es ihn gibt. Und F ist keine Prozentzahl; es misst, wie verschieden die Streuungen sind, p sagt, ob das Zufall sein kann.</Mixup>
    </Card>

    <Card id="k3-bericht" title="Was heißt das für einen Bericht?" badge={<Bezug href="#a3-4">zu Schritt 5 und 6</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">Hält die Voraussetzung gleicher Fehlervarianz nicht, ist die Gerade nicht falsch. Sie bleibt eine faire Beschreibung der Mittelwerte.</p>
      <p>Aber der Standardfehler der Schätzung gilt dann nicht für alle: Für manche Gruppen liegt die Vorhersage viel weiter daneben. Auch die Tests in der Ausgabe (Std. Error, Sig.) sind dann weniger verlässlich.</p>
      <Frage>Was schreibt man also?</Frage>
      <p>Ein ehrlicher Bericht nennt, für wen die Vorhersage ungenau ist, mit der Streuung der Residuen in diesen Gruppen.</p>
      <Frage>Und wo steht was für Schritt 6?</Frage>
      <ul className="v-liste">
        <li><b>Kleinste Streuung und Streuung in Stufe 1:</b> die Spalte SD der sieben Tabellen; die erste Tabelle ist Stufe 1 (<a href="#k3-sd">Streuung je Stufe</a>).</li>
        <li><b>Wie weit die Gerade in Stufe 7 im Mittel danebenliegt:</b> die letzte Tabelle, Spalte Mean, mit Vorzeichen (<a href="#k3-sd">Streuung je Stufe</a>).</li>
        <li><b>Levene-Test und SD zusammen:</b> <a href="#k3-levene">Zwei Wege zu prüfen</a>.</li>
        <li><b>Der Satz für den Bericht:</b> diese Karte.</li>
      </ul>
    </Card>

    <Card id="k3-ausreisser" title="Ausreißer: Ein Punkt zieht die Gerade" badge={<Badge>Hintergrund: eine weitere Voraussetzung</Badge>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Eine zweite Frage zu „gleich gut für alle?“: Was macht ein einzelner Punkt weit draußen? Zu den acht Befragten aus <a href="#k2-residuen">Residuen</a> kommt eine neunte Person, zum Beispiel: sehr gute Lage, aber Lebenszufriedenheit 2.</p>
      <Outlier />
      <Frage>Was passiert mit der Steigung, wenn die neunte Person dazukommt?</Frage>
      <p>Sie wird viel flacher: von 1 auf 0,2. Zur alten Geraden hat die neunte Person ein Residuum von −7, quadriert 49, mehr als alle anderen Quadrate zusammen (6). Die Gerade dreht sich zu ihr, um dieses Quadrat kleiner zu machen. Eine einzige Person kann viel bewegen, wenn sie weit draußen und am Rand der UV liegt.</p>
      <InShort>Ein <b><Begriff id="ausreisser">Ausreißer</Begriff></b> ist ein Punkt weit weg von den anderen. Weil die Regression quadrierte Abstände klein macht, kann ein einziger Ausreißer, vor allem am Rand der UV, die Gerade stark ziehen. Erst anschauen, dann rechnen.</InShort>
      <MoreDetail summary="Was tun mit Ausreißern?">
        <ul>
          <li>Erst prüfen, ob es ein Fehler ist (etwa ein Tippfehler bei der Erfassung). Echte Antworten bleiben drin.</li>
          <li>Rechne zur Kontrolle einmal mit und einmal ohne die auffälligen <Begriff id="fall">Fälle</Begriff> und berichte beides. Ändert sich die Gerade stark, hängt dein Ergebnis an wenigen Personen.</li>
          <li>Bei Skalen wie 0 bis 10 oder 1 bis 6 gibt es kaum Werte weit draußen; bei offenen Angaben wie Stunden oder Einkommen schon (kennst du aus Sitzung 4). Wie man den Einfluss einzelner Fälle misst, kommt in Sitzung 10.</li>
        </ul>
      </MoreDetail>
      <Mixup>Viele Befragte machen eine Regression nicht immun. Bei 5.000 Befragten zieht eine einzelne Person wenig; aber eine kleine Gruppe mit extremen Werten kann es schon.</Mixup>
    </Card>
  </Abschnitt>;
}

/* ---------- Aufgabe 4 ---------- */
export function Verstehen4() {
  return <Abschnitt id="g4" n={4} titel="Links, Mitte, rechts"
    frage="Sind Menschen umso weniger zufrieden mit der Demokratie, je weiter rechts sie sich einstufen?"
    ziel="eine Gerade mit den Mittelwerten je Stufe verglichen und kannst sagen, ob sie den Zusammenhang richtig beschreibt."
    weg={[
      ['Schritt 1', '#a4-p', 'Erst festlegen: Wie hängen die beiden zusammen?', 'k4-kurve'],
      ['Schritt 2', '#a4-1', 'Gerade und Mittelwerte je Stufe rechnen', 'k4-vorlage'],
      ['Schritt 3', '#a4-2', 'Vorhersage mit negativer Steigung', 'k4-minus'],
      ['Schritt 4', '#a4-3', 'Gerade gegen Mittelwerte vergleichen', 'k4-vergleich'],
      ['Schritt 5', '#a4-4', 'Ergebnis festhalten', 'k4-vergleich'],
      ['Schritt 6', '#a4-5', 'Im Bild: Gerade und Mittelwerte', 'k4-vergleich'],
    ]}>

    <Card id="k4-kurve" title="Eine flache Gerade heißt nicht „kein Zusammenhang“" badge={<Bezug href="#a4-p">zu Schritt 1</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Zehn Räume, zum Beispiel, von 14 bis 32 Grad. In jedem sagt eine Person, wie wohl sie sich fühlt (0 bis 10). Zu kalt und zu warm sind beide unangenehm.</p>
      <Curve />
      <Frage>Die Gerade ist flach, R² ist 0. Heißt das, das Wohlbefinden hängt nicht mit der Temperatur zusammen?</Frage>
      <p>Nein. Der Zusammenhang ist stark, aber nicht gerade, und eine Gerade kann ihn nicht zeigen. Die Regression misst nur den geraden (linearen) Teil eines Zusammenhangs, wie r in Sitzung 6. Eine solche Kurve hat keinen. R² = 0 heißt darum nur: kein <b>linearer</b> Zusammenhang. Schalte „Mittelwerte verbinden“ zu, dann siehst du die Kurve.</p>
      <p><b>Und im ALLBUS?</b> Bei der Lebenszufriedenheit nach Lage passt die Gerade gut: Die Mittelwerte der Stufen liegen höchstens 0,27 Punkte neben ihr, in der Mitte fast genau darauf, an beiden Rändern etwas darunter (−0,27 und −0,26).</p>
      <InShort>Eine Regression misst nur den geraden Teil eines Zusammenhangs. Ob eine Gerade die Form trifft, siehst du erst, wenn du die Mittelwerte jeder Stufe neben sie legst.</InShort>
      <MoreDetail summary="Was tun bei einer Kurve?">
        <ul>
          <li>Die UV in Gruppen einteilen und jede Gruppe mit einer eigenen Zahl ins Modell nehmen (<Begriff id="dummy">Dummyvariablen</Begriff>, Sitzung 10).</li>
        </ul>
      </MoreDetail>
      <Mixup>Ein signifikantes B heißt nicht, dass die Gerade passt. Auch eine Gerade durch eine Kurve kann bei vielen Befragten signifikant sein.</Mixup>
    </Card>

    <Card id="k4-vorlage" title="Die Vorlage: Gerade und Mittelwerte in einem Durchgang" badge={<Bezug href="#a4-1">zu Schritt 2</Bezug>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">Die Vorlage in Schritt 2 rechnet zwei Dinge, die du danach vergleichst: die Gerade und die Mittelwerte je Stufe.</p>
      <Code k="a4" />
      <ul className="v-liste">
        <li><code>allbus &lt;- allbus %&gt;% mutate(demo = …)</code> polt ps03 um und speichert <code>demo</code> im Datensatz, damit beide Ketten darunter es benutzen können.</li>
        <li><code>linear_regression(demo ~ pa01, weights = wghtpew) %&gt;% summary()</code> rechnet die Gerade, wie in Aufgabe 1.</li>
        <li><code>drop_na(demo, pa01)</code> behält nur, wer bei beiden gültig geantwortet hat. <code>group_by(pa01)</code> teilt in zehn Gruppen, und <code>describe()</code> gibt für jede Stufe Mittelwert und Standardabweichung aus (<a href="#k3-groupby">group_by()</a>).</li>
      </ul>
      <p>pa01 ist nicht umgepolt: 1 heißt links, 10 rechts. Eine negative Steigung heißt dann: Je weiter rechts, desto niedriger die vorhergesagte Zufriedenheit. Die zehn Tabellen stehen in der Reihenfolge 1 bis 10; nur 1 (LINKS) und 10 (RECHTS) haben einen Namen.</p>
    </Card>

    <Card id="k4-minus" title="Vorhersage mit negativer Steigung" badge={<Bezug href="#a4-2">zu Schritt 3</Bezug>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">Schritt 3 rechnet wie Aufgabe 1 eine Vorhersage von Hand, diesmal für „ganz links“ (pa01 = 1). Die Vorlage rechnet noch das Beispiel der Lebenszufriedenheit; ihr Kommentar nennt es „Grundlage 1“.</p>
      <Code k="a4r" />
      <Frage>Wie rechnet man mit einer negativen Steigung?</Frage>
      <p>Genauso: Konstante plus Steigung mal Wert. Das Minus gehört zur Steigung. <code>Konstante + -Steigung * 1</code> und <code>Konstante - Steigung * 1</code> ergeben dasselbe. Mit jeder Stufe weiter rechts wird die Vorhersage kleiner; ganz links ist sie darum am höchsten.</p>
      <Mixup>Wer das Minus vergisst, rechnet Konstante plus Steigung und landet über der Konstante statt darunter.</Mixup>
      <MoreDetail summary="Negative Steigung in Worten">
        <p>„Mit jeder Stufe mehr &#123;UV&#125; liegt die vorhergesagte &#123;AV&#125; um &#123;B&#125; Punkte niedriger.“ Ob B positiv oder negativ ist, hängt auch davon ab, wie die Codes laufen (<a href="#k1-formel">Die Formel als Bausteine</a>).</p>
      </MoreDetail>
    </Card>

    <Card id="k4-vergleich" title="Gerade gegen Mittelwerte: Passt die Form?" badge={<Bezug href="#a4-3">zu Schritt 4, 5 und 6</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">Eine Gerade kann nur steigen oder fallen. Ob sie den Zusammenhang richtig beschreibt, siehst du, wenn du vergleichst, was sie vorhersagt, mit dem, was die Befragten einer Stufe im Mittel tatsächlich sagen.</p>
      <Frage>Wie vergleichst du in Schritt 4?</Frage>
      <p>Erst an einer Stelle: die Vorhersage für ganz links aus Schritt 3 gegen den Mittelwert der ersten Tabelle (LINKS). Dann im Ganzen: Lies die Mittelwerte der zehn Tabellen der Reihe nach. Fallen sie gleichmäßig wie die Gerade, passt sie. Steigen sie erst und fallen dann, oder umgekehrt, liegen sie in einer Kurve um die Gerade, wie die zehn Räume in <a href="#k4-kurve">Eine flache Gerade</a>.</p>
      <Frage>Und wenn die Mittelwerte nicht gleichmäßig fallen?</Frage>
      <p>Dann geh Stufe für Stufe vor: Wo liegen die Mittelwerte über der Geraden, wo darunter? Liegen beide Ränder auf derselben Seite, folgt die Gerade nicht der Form der Mittelwerte. Was das für die Gerade heißt, fragt Schritt 5.</p>
      <Frage>Und wo steht was für Schritt 5?</Frage>
      <ul className="v-liste">
        <li><b>Die Steigung:</b> Ausgabe aus Schritt 2, Coefficients, Zeile pa01, Spalte B, mit Vorzeichen.</li>
        <li><b>Die Vorhersage für ganz links:</b> dein Ergebnis aus Schritt 3 (<a href="#k4-minus">Negative Steigung</a>).</li>
        <li><b>Wie zufrieden die ganz Linken tatsächlich sind:</b> die erste Tabelle, Spalte Mean, nicht SD.</li>
        <li><b>Das Muster und was daraus folgt:</b> die Mean-Werte der Reihe nach, wie oben beschrieben.</li>
      </ul>
      <p>Das Bild in Schritt 6 legt die Mittelwerte als Rauten neben die Gerade. Weil es die Antworten zeigt, erscheint es erst, wenn du deine Antworten geprüft hast. Seine Textfassung nennt alle Mittelwerte.</p>
    </Card>
  </Abschnitt>;
}

/* ---------- Überblick ---------- */
export function Ueberblick() {
  return <section className="grund-block" id="g5" aria-labelledby="g5-h">
    <div className="g-kopf">
      <span className="st m c7" aria-hidden="true">✓</span>
      <div><div className="ueber">Überblick über alle Aufgaben</div><h4 id="g5-h">Eine Regression lesen, prüfen, berichten</h4></div>
    </div>
    <p className="g-intro">Alle vier Aufgaben zusammen: welche Zahl wofür steht und was du prüfst, bevor du der Geraden glaubst. Die Beispiele stammen aus der Lebenszufriedenheit nach Lage.</p>
    <HeadingLevel.Provider value={5}>
      <Card id="k5-zahlen" title="Fünf Zahlen für einen Bericht" badge={<Badge>Aufgabe 1 bis 3</Badge>} tag={{ kind: 'interpret', label: 'Deuten' }}>
        <table className="daten voll">
          <caption className="sr-only">Fünf Zahlen für einen Bericht</caption>
          <thead><tr><th scope="col">Was</th><th scope="col">Wo in <code>summary()</code></th><th scope="col">So schreibst du es (Beispiel Lebenszufriedenheit nach Lage)</th></tr></thead>
          <tbody>
            <tr><td>Steigung B</td><td>Coefficients, Zeile der UV, Spalte B</td><td>„Mit jeder Stufe besserer Lage liegt die vorhergesagte Lebenszufriedenheit um 1,07 Punkte höher.“</td></tr>
            <tr><td>Konstante</td><td>Coefficients, Zeile <code>(Intercept)</code>, Spalte B</td><td>nur zum Rechnen, gedeutet nur, wenn 0 bei der UV vorkommt</td></tr>
            <tr><td>R²</td><td>Model Summary, R Square</td><td>„Die Lage erklärt statistisch 20 % der Streuung der Lebenszufriedenheit (R² = 0,20).“</td></tr>
            <tr><td>Standardfehler der Schätzung</td><td>Model Summary, Std. Error of the Estimate</td><td>„Die Vorhersage liegt typischerweise 1,7 Punkte daneben; bei sehr schlechter Lage deutlich mehr.“</td></tr>
            <tr><td>N und Gewicht</td><td><code>- N:</code> und <code>- Weights:</code></td><td>„ALLBUS 2023, gewichtet, n = 5.133.“</td></tr>
          </tbody>
        </table>
        <p>Und immer dazu: Welche Variable ist die AV, welche die UV, und in welche Richtung laufen ihre Codes (umgepolt?).</p>
      </Card>

      <Card id="k5-voraussetzungen" title="Voraussetzungen: Was du prüfst, bevor du der Geraden glaubst" badge={<Badge>Aufgabe 3 und 4</Badge>} tag={{ kind: 'picture', label: 'Im Bild' }}>
        <Assumptions />
        <table className="daten voll">
          <caption className="sr-only">Voraussetzungen der linearen Regression</caption>
          <thead><tr><th scope="col">Voraussetzung</th><th scope="col">in Worten</th><th scope="col">so prüfst du</th><th scope="col">wenn verletzt</th></tr></thead>
          <tbody>
            <tr><td><Begriff id="linear">Linearität</Begriff></td><td>Der Zusammenhang ist ungefähr gerade.</td><td>Mittelwerte je Stufe neben die Gerade legen (Aufgabe 4).</td><td>Mittelwerte je Stufe berichten oder Gruppen bilden (Sitzung 10).</td></tr>
            <tr><td>keine einflussreichen Ausreißer</td><td>Kein einzelner Punkt zieht die Gerade weg.</td><td>Streudiagramm ansehen; mit und ohne auffällige Fälle rechnen.</td><td>Fehler korrigieren; sonst beides berichten.</td></tr>
            <tr><td>gleiche Fehlervarianz</td><td>Die Residuen streuen überall gleich stark.</td><td>SD des Residuums je Stufe, Levene-Test (Aufgabe 3).</td><td>Berichten, für wen die Vorhersage ungenau ist; Tests vorsichtig lesen.</td></tr>
            <tr><td><Begriff id="metrisch">metrische</Begriff> AV</td><td>Die AV hat gleich große Abstände (oder viele Stufen).</td><td><Begriff id="skalenniveau">Skalenniveau</Begriff> prüfen (Sitzung 3).</td><td>Bei wenigen Stufen vorsichtig; für zwei Stufen logistische Regression (Sitzung 11).</td></tr>
            <tr><td>unabhängige Befragte</td><td>Jede Person zählt einmal und unabhängig von den anderen.</td><td>Durch die Zufallsstichprobe des ALLBUS näherungsweise gegeben.</td><td>–</td></tr>
            <tr><td>Residuen ungefähr <Begriff id="normalverteilung">normalverteilt</Begriff></td><td>Die Abstände zur Geraden verteilen sich wie eine Glocke.</td><td>Nur für die Tests (Sig., 95% CI) wichtig, und nur bei wenigen Befragten; bei Tausenden reicht der zentrale Grenzwertsatz (kennst du aus Sitzung 7).</td><td>Bei kleinen <Begriff id="stichprobe">Stichproben</Begriff> Tests vorsichtig lesen.</td></tr>
          </tbody>
        </table>
        <p>Die Zufriedenheitsskalen dieses Kapitels haben 6 und 11 Stufen. Man rechnet mit ihnen wie mit metrischen Variablen; an den Enden der Skala zeigt sich das als Kurve, also <Begriff id="nichtlinear">nichtlinear</Begriff>, oder als kleinere Streuung.</p>
      </Card>

      <Card id="k5-ursache" title="Zusammenhang, nicht Ursache" badge={<Badge>alle Aufgaben</Badge>} tag={{ kind: 'interpret', label: 'Deuten' }}>
        <p className="lead">Eine Regression sagt: Wer bei der UV höher liegt, liegt im Mittel bei der AV um B höher. Sie sagt nicht, dass die UV die AV verursacht. Tauschst du die Seiten (unter „Weiter, wenn du magst“ in Aufgabe 1), bekommst du eine andere Gerade mit demselben R². Beide stimmen; welche Richtung gilt, entscheidet die Theorie, nicht R.</p>
        <InShort>Erst die Gerade lesen (B, Konstante), dann prüfen, wie gut sie passt (R², Standardfehler der Schätzung), dann, ob sie für alle passt (Linearität, Ausreißer, Fehlervarianz). Und im Bericht von Zusammenhang sprechen, nicht von Wirkung.</InShort>
        <Mixup>„Die Regression zeigt, dass eine gute Lage zufrieden macht.“ Richtig wäre: „Wer seine wirtschaftliche Lage besser einschätzt, ist im Mittel zufriedener mit seinem Leben.“</Mixup>
      </Card>
    </HeadingLevel.Provider>
  </section>;
}

/* ---------- Themen für den Reiter „Verstehen“ (Reihenfolge, Karten für die rechte Leiste) ---------- */
export const THEMEN: Thema[] = [
  { id: 'vorweg', n: 'R', kurz: 'R lesen', titel: 'Vorweg: R lesen', minuten: 10, Inhalt: Vorweg,
    karten: [['r1', 'Startblock und was du schon kennst'], ['r2', 'Eine Formel mit Tilde'], ['r3', 'Die Ausgabe von summary() lesen']] },
  { id: 'g1', n: '1', kurz: 'Aufgabe 1', titel: 'Vertrauen und Zufriedenheit', minuten: 15, Inhalt: Verstehen1, aufgabe: 1,
    karten: [['k1-gerade', 'Eine Gerade durch das Streudiagramm'], ['k1-vorlage', 'Umpolen, dann die Gerade'], ['k1-ablesen', 'Zahlen in der Ausgabe finden'], ['k1-formel', 'Die Formel als Bausteine'], ['k1-deuten', 'Vorhersage und Achsenabschnitt'], ['k1-ergebnis', 'Ergebnis festhalten']] },
  { id: 'g2', n: '2', kurz: 'Aufgabe 2', titel: 'Vertrauen oder Schicht', minuten: 15, Inhalt: Verstehen2, aufgabe: 2,
    karten: [['k2-residuen', 'Residuen'], ['k2-quadrate', 'Kleinste Quadrate'], ['k2-r2', 'R²'], ['k2-vorlage', 'Die Vorlage und der Tausch'], ['k2-vergleich', 'Zwei Ausgaben vergleichen'], ['k2-ergebnis', 'Ergebnis festhalten']] },
  { id: 'g3', n: '3', kurz: 'Aufgabe 3', titel: 'Für wen liegt die Gerade daneben?', minuten: 15, Inhalt: Verstehen3, aufgabe: 3,
    karten: [['k3-fehlervarianz', 'Gleiche Fehlervarianz'], ['k3-vorlage', 'Vorhersage und Residuum'], ['k3-groupby', 'group_by()'], ['k3-sd', 'Streuung je Stufe'], ['k3-levene', 'Levene-Test und Faustregel'], ['k3-bericht', 'Was in den Bericht gehört'], ['k3-ausreisser', 'Ausreißer']] },
  { id: 'g4', n: '4', kurz: 'Aufgabe 4', titel: 'Links, Mitte, rechts', minuten: 10, Inhalt: Verstehen4, aufgabe: 4,
    karten: [['k4-kurve', 'Eine flache Gerade'], ['k4-vorlage', 'Gerade und Mittelwerte'], ['k4-minus', 'Negative Steigung'], ['k4-vergleich', 'Passt die Form?']] },
  { id: 'g5', n: '✓', kurz: 'Überblick', titel: 'Eine Regression lesen, prüfen, berichten', minuten: 5, Inhalt: Ueberblick,
    karten: [['k5-zahlen', 'Fünf Zahlen für einen Bericht'], ['k5-voraussetzungen', 'Voraussetzungen'], ['k5-ursache', 'Zusammenhang, nicht Ursache']] },
];

/* ---------- Bilder für die „?“-Fenster der Aufgaben (denk in kapitel.js); nur zeigende Bilder mit Beispielzahlen ---------- */
export const BILDER = { PunktwolkeMitGerade, FormulaSteps, R2Squares, SpreadBars, GroupBy, Curve };
