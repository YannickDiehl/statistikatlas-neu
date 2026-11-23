// Sitzung 9 „Lineare Regression“: die vier Grundlagen und der Überblick aus sitzung09.md, ohne R-Code.
import { Badge, Card, InShort, Known, Mixup, MoreDetail, Tag } from '../blocks/Card';
import { Foundation } from '../blocks/Foundation';
import { MapLink } from '../blocks/MapLink';
import { QuickCheck } from './blocks';
import { K1B_Q, K1C_Q, K2C_Q, K3A_Q, K3B_Q, K4_Q } from './content';
import { Assumptions } from './figures/Assumptions';
import { Curve } from './figures/Curve';
import { Estimate } from './figures/Estimate';
import { FormulaSteps } from './figures/FormulaSteps';
import { Outlier } from './figures/Outlier';
import { R2Squares } from './figures/R2Squares';
import { Residuals } from './figures/Residuals';
import { Rotate } from './figures/Rotate';
import { SpreadBars } from './figures/SpreadBars';

/** Grundlage 1: Die Gerade: Konstante und Steigung (1a schätzen, 1b Formel als Bausteine, 1c Vorhersage ist ein Durchschnitt). */
export function Foundation1() {
  return <Foundation id="g1" n={1} title="Die Gerade: Konstante und Steigung" taskHref="#a1"
    intro="Was beschreibt eine Gerade durch eine Punktwolke, und wie liest man sie? Drei kurze Schritte, etwa 15 Minuten.">

    <Card id="k1a" step="1a" title="Erst schätzen: Wo verläuft die Gerade?" badge={<Known session={6} what="Punktwolke" />} tag={{ kind: 'estimate', label: 'Schätzen' }}>
      <p className="lead">Hängt die Lebenszufriedenheit mit der eigenen wirtschaftlichen Lage zusammen? Im Bild steht jede Kombination aus Lage (von 1 sehr schlecht bis 5 sehr gut) und Lebenszufriedenheit (0 bis 10) als Kreis. Je größer der Kreis, desto mehr Befragte haben genau diese Kombination angegeben. Leg eine Gerade durch die Wolke, die die Punkte so gut wie möglich trifft.</p>
      <Estimate />
      <InShort>Eine <b>lineare Regression</b> legt eine Gerade durch die Punktwolke. Die Gerade sagt für jeden Wert der UV vorher, welchen Wert der AV man im Mittel erwartet. Sie folgt den Mittelwerten der Stufen, nicht den einzelnen Punkten.</InShort>
      <MoreDetail summary="Wozu eine Regression?">
        <ul>
          <li><b>Beschreiben:</b> Um wie viel unterscheidet sich die AV, wenn die UV um eine Stufe steigt? Anders als r aus Sitzung 6 antwortet die Regression in der Einheit der AV, hier in Punkten Lebenszufriedenheit.</li>
          <li><b>Vorhersagen:</b> Welchen Wert erwarten wir für eine Gruppe, etwa für alle mit guter Lage?</li>
          <li><b>Erklären</b> will man oft, aber dafür reicht eine Gerade mit einer UV nicht. Andere Ursachen (Gesundheit, Einkommen, Alter) können hinter beidem stecken, wie die Drittvariable aus Sitzung 6. Wie man sie in einer Regression berücksichtigt, ist Thema in Sitzung 10.</li>
          <li>Die Kreise sind Häufigkeiten aus einer Kreuztabelle (kennst du aus Sitzung 5), gewichtet. Bei nur elf und fünf Stufen lägen einzelne Punkte genau übereinander; darum zeigt das Bild, wie viele an jeder Stelle liegen.</li>
        </ul>
      </MoreDetail>
      <Mixup>Die Gerade geht nicht durch die meisten Punkte. Sie liegt so, dass alle Punkte zusammen ihr möglichst nahe sind. Kaum eine Person liegt genau auf ihr.</Mixup>
    </Card>

    <Card id="k1b" step="1b" title="Konstante und Steigung: die Formel als Bausteine" tag={{ kind: 'picture', label: 'Im Bild' }} badge={<Tag kind="interpret" label="Formel lesen" />}>
      <p className="lead">Jede Gerade ist durch zwei Zahlen festgelegt. R hat für dieses Beispiel ausgerechnet: Konstante 3,570, Steigung 1,073. Wo sie in der Ausgabe stehen, zeigt <a href="#r3">„R lesen“</a>. Was sagt das über eine Person mit guter Lage (Stufe 4)?</p>
      <FormulaSteps />
      <QuickCheck question={K1B_Q} />
      <InShort>Die <b>Konstante</b> ist die Höhe der Geraden, wenn die UV 0 ist. Die <b>Steigung</b> (Regressionskoeffizient B) sagt, um wie viel die Vorhersage steigt, wenn die UV um eine Einheit steigt. Konstante plus Steigung mal Wert ergibt die <b>Vorhersage</b>, den linearen Prädiktor.</InShort>
      <MoreDetail summary="Steigung in Worten, auch wenn sie negativ ist">
        <ul>
          <li>Satzmuster: „Mit jeder Stufe mehr &#123;UV&#125; liegt die vorhergesagte &#123;AV&#125; um &#123;B&#125; Punkte höher.“ Hier: Mit jeder Stufe besserer Lage liegt die vorhergesagte Lebenszufriedenheit um 1,07 Punkte höher.</li>
          <li>Ist B negativ, sinkt die Vorhersage: „um … Punkte niedriger“. Ob B positiv oder negativ ist, hängt auch davon ab, wie die Codes laufen. Darum wurde ep03 umgepolt: Im Original heißt 1 „sehr gut“, und B wäre −1,073.</li>
          <li>Von der schlechtesten zur besten Stufe sind es vier Schritte: 4 mal 1,073 = 4,29 Punkte.</li>
        </ul>
      </MoreDetail>
      <Mixup>Die Steigung ist kein Prozentwert und keine Korrelation. 1,073 heißt „gut einen Punkt Lebenszufriedenheit mehr pro Stufe Lage“, in der Einheit der AV.</Mixup>
    </Card>

    <Card id="k1c" step="1c" title="Die Vorhersage ist ein Durchschnitt" tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Die Gerade sagt für Menschen mit sehr guter Lage 8,94 vorher. Heißt das, alle mit sehr guter Lage sind so zufrieden? Schau ins Bild in <a href="#k1a">Schritt 1a</a>: Bei „sehr gut“ reichen die Kreise von 0 bis 10.</p>
      <p>Die Vorhersage ist der Wert, den man für eine Gruppe <b>im Mittel</b> erwartet. Einzelne Menschen liegen darüber oder darunter, oft weit. Wie weit, ist Thema in Grundlage 2.</p>
      <p className="absatz"><b>Und die Konstante?</b> Die Konstante 3,570 ist die Höhe der Geraden bei Lage 0. Eine Lage 0 gibt es auf der Skala von 1 bis 5 aber nicht. Die Konstante ist dann nur der Punkt, an dem die Gerade die y-Achse schneiden würde: ein Rechenanker, den man nicht deutet.</p>
      <QuickCheck question={K1C_Q} />
      <InShort>Die Vorhersage einer Regression gilt für eine Gruppe im Mittel, nicht für einzelne Personen. Die Konstante deutet man nur, wenn der Wert 0 bei der UV vorkommt.</InShort>
      <MoreDetail summary="Vorhersagen außerhalb der Daten">
        <p>Die Gerade beschreibt den Bereich, in dem es Daten gibt, hier Lage 1 bis 5. Was außerhalb passiert, weiß sie nicht. Eine „Lage 6“ würde nach der Formel 10,008 ergeben, mehr als die Skala erlaubt.</p>
      </MoreDetail>
      <Mixup>„Die Gerade sagt 7,9 vorher“ heißt nicht „wer gut lebt, ist 7,9 zufrieden“. Es heißt: Im Mittel sind Menschen mit guter Lage etwa so zufrieden; einzelne liegen weit daneben.</Mixup>
      <MapLink concept="linear_regression" className="hilfe-zeile s9-karte">Lineare Regression</MapLink>
      <MapLink concept="prediction" className="hilfe-zeile s9-karte">Linearer Prädiktor</MapLink>
    </Card>
  </Foundation>;
}

/** Grundlage 2: Wie gut passt die Gerade? (2a Residuen, 2b kleinste Quadrate, 2c R²). */
export function Foundation2() {
  return <Foundation id="g2" n={2} title="Wie gut passt die Gerade? Residuen und R²" taskHref="#a2"
    intro="Wie misst man, wie weit eine Gerade danebenliegt, und warum heißt das Verfahren „kleinste Quadrate“? Etwa 12 Minuten.">

    <Card id="k2a" step="2a" title="Residuen: wie weit daneben?" tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Bei Tausenden Befragten sieht man einzelne Abstände nicht. Darum hier acht Befragte, zum Beispiel. Jede Person hat eine Lage (1 bis 5) und eine Lebenszufriedenheit. Die grüne Gerade ist die beste Gerade für diese acht: 4 + 1 × Lage. Tipp eine Person an.</p>
      <Residuals />
      <InShort>Das <b>Residuum</b> ist der Abstand eines Punktes von der Geraden, senkrecht gemessen: beobachteter Wert minus vorhergesagter Wert. Positiv heißt „über der Geraden“, negativ „darunter“.</InShort>
      <Mixup>Ein Residuum ist kein Fehler der Person und kein Messfehler. Es ist das, was die Gerade an dieser Person nicht erklärt.</Mixup>
    </Card>

    <Card id="k2b" step="2b" title="Kleinste Quadrate: Dreh die Gerade selbst" tag={{ kind: 'picture', label: 'Im Bild' }} badge={<Tag kind="adapt" label="Ausprobieren" />}>
      <p className="lead">Warum ist gerade 4 + 1 × Lage die beste Gerade? Dreh sie und schau, wie die Fehlerquadrate wachsen oder schrumpfen. Die Gerade dreht sich um den Schwerpunkt (3 | 7).</p>
      <Rotate />
      <InShort>Die Regression wählt die Gerade, bei der die Summe der quadrierten Residuen am kleinsten ist. Darum heißt das Verfahren <b>Methode der kleinsten Quadrate</b> (OLS, ordinary least squares).</InShort>
      <MoreDetail summary="Warum quadrieren?">
        <ul>
          <li>Residuen über und unter der Geraden heben sich auf: Bei der besten Geraden ergeben sie zusammen immer 0. Quadriert zählen alle als positiv.</li>
          <li>Quadrate bestrafen große Abstände stark: Ein Residuum von 2 zählt 4, eines von 3 zählt 9. Darum zieht ein einzelner Punkt weit draußen die Gerade zu sich (Grundlage 3b).</li>
          <li>Die beste Gerade geht immer durch den Schwerpunkt, den Punkt aus den beiden Mittelwerten. Im Bild ist das (3 | 7), darum dreht sich der Regler um diesen Punkt.</li>
        </ul>
      </MoreDetail>
      <Mixup>Kleinste Quadrate heißt nicht „trifft am meisten Punkte genau“. Eine Gerade, die drei Punkte genau trifft, kann trotzdem mehr Fehlerquadrate haben als die Gerade aus R.</Mixup>
      <MapLink concept="residuals" className="hilfe-zeile s9-karte">Residuen und kleinste Quadrate</MapLink>
    </Card>

    <Card id="k2c" step="2c" title="R²: um wie viel besser als der Mittelwert?" badge={<Known session={6} what="Pearson-Korrelation" />} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Ohne die Lage könntest du für alle acht nur den Mittelwert 7 vorhersagen. Das kostet 18 Fehlerquadrate. Mit der Lage sind es 6. Um wie viel besser ist die Gerade?</p>
      <R2Squares />
      <QuickCheck question={K2C_Q} />
      <InShort><b>R²</b> (erklärter Varianzanteil) vergleicht die Gerade mit dem Mittelwert: Um welchen Anteil sind die Fehlerquadrate kleiner als ohne UV? 0 heißt „nicht besser als der Mittelwert“, 1 heißt „alle Punkte liegen auf der Geraden“. Mit einer UV ist R² das Quadrat der Pearson-Korrelation r. Der <b>typische Fehler</b> (Std. Error of the Estimate) sagt dasselbe in Punkten der AV: So weit liegt die Vorhersage typischerweise daneben, hier 1,72 Punkte.</InShort>
      <MoreDetail summary="Der typische Fehler und die Verbindung zu r">
        <ul>
          <li>Der typische Fehler mit der Lage ist 1,720 Punkte. Ohne Lage, nur mit dem Mittelwert, wären es 1,926 (Standardabweichung der Lebenszufriedenheit). Daraus kommt wieder R²: 1 − (1,720 / 1,926)² ≈ 0,20.</li>
          <li>In Sitzung 6 hast du r kennengelernt. Zwischen Lage und Lebenszufriedenheit ist r = 0,450 (gewichtet). 0,450 × 0,450 = 0,2025, also etwa 0,20; mit dem ungerundeten r kommt genau R² = 0,203 heraus. Mit einer UV zeigt die Ausgabe r auch als Beta und, ohne Vorzeichen, als R.</li>
          <li>„Erklärt“ ist hier ein statistisches Wort: Mit der Geraden werden die Fehlerquadrate kleiner. Dass die UV die AV verursacht, ist damit nicht gezeigt (<a href="#ue3">Überblick, Karte Ü3</a>).</li>
          <li>Was „gut“ ist, hängt vom Thema ab. Bei Einstellungen und Zufriedenheit sind R² von 0,1 bis 0,3 mit einer UV häufig, weil viele Dinge zusammenspielen.</li>
          <li>Die Quadratsummen stehen im Abschnitt ANOVA der Ausgabe: Regression 3.858,902 (erklärt), Residual 15.182,029 (übrig), Total 19.040,931 (alle).</li>
        </ul>
      </MoreDetail>
      <Mixup>Eine steile Gerade ist nicht automatisch eine gute Vorhersage. Die Steigung sagt, wie viel sich die Vorhersage ändert; R² sagt, wie nah die Punkte an der Geraden liegen. Beides musst du getrennt lesen.</Mixup>
      <MapLink concept="explained_variance" className="hilfe-zeile s9-karte">Erklärter Varianzanteil R²</MapLink>
    </Card>
  </Foundation>;
}

/** Grundlage 3: Gleich gut für alle? (3a gleiche Fehlervarianz, 3b Ausreißer). */
export function Foundation3() {
  return <Foundation id="g3" n={3} title="Gleich gut für alle?" taskHref="#a3"
    intro="Liegt die Gerade für alle Gruppen gleich weit daneben, und was macht ein einzelner Punkt weit draußen? Etwa 12 Minuten.">

    <Card id="k3a" step="3a" title="Gleiche Fehlervarianz: Streuen die Residuen überall gleich?" badge={<Known session={7} what="Ähnliche Streuung" />} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Die Gerade aus Grundlage 1 liegt im Mittel 1,72 Punkte daneben. Gilt das für alle? Für jede Stufe der Lage hat R ausgerechnet, wie stark die Residuen streuen (Standardabweichung).</p>
      <SpreadBars />
      <QuickCheck question={K3A_Q} />
      <InShort><b>Gleiche Fehlervarianz</b> (Homoskedastizität) heißt: Die Residuen streuen für alle Werte der UV gleich stark. Bei Gruppen hieß das in Sitzung 7 Varianzhomogenität. Ist das verletzt, gilt der typische Fehler nicht für alle; für manche Gruppen liegt die Vorhersage viel weiter daneben. Man sieht es in der Punktwolke als Fächer.</InShort>
      <div className="absatz s9-zwei-wege">
        <p><b>Zwei Wege zu prüfen</b> <Known session={7} what="Faustregel" /> <Badge>Levene-Test: neu heute</Badge></p>
        <ul>
          <li><b>Die Größe ansehen:</b> Vergleiche die größte und die kleinste Streuung. Faustregel wie in Sitzung 7: Ist die größte mehr als doppelt so groß wie die kleinste, unterscheiden sich die Streuungen deutlich. Hier: 2,72 zu 1,27, gut doppelt so groß.</li>
          <li><b>Der Levene-Test</b> prüft, ob die Streuungen in allen Gruppen gleich sein könnten. Kurz gesagt: Ist p kleiner als 0,05, streuen die Gruppen verschieden; R schreibt dann „variances unequal“. Hier: F = 67,18, p &lt; 0,001. Die Streuungen unterscheiden sich also.</li>
          <li>Beides gehört zusammen: Bei Tausenden Befragten wird auch ein kleiner Unterschied signifikant. Der Test sagt, ob die Streuungen verschieden sind, die Faustregel, ob der Unterschied groß ist.</li>
        </ul>
      </div>
      <MoreDetail summary="Was hinter den Säulen steckt, und was daraus folgt">
        <ul>
          <li>Die Streuung je Stufe lässt du dir in Aufgabe 3 selbst ausgeben: erst für jede Person das Residuum bilden, dann seine Standardabweichung getrennt für jede Stufe.</li>
          <li>F misst, wie verschieden die Streuungen sind, ähnlich wie F in der ANOVA aus Sitzung 7 verschiedene Mittelwerte misst. Den Levene-Test kannst du ebenso für die Gruppen eines t-Tests oder einer ANOVA rechnen.</li>
          <li>Innerhalb einer Stufe sagt die Gerade allen denselben Wert vorher. Die Streuung der Residuen in einer Stufe ist darum genau die Streuung der Lebenszufriedenheit in dieser Stufe.</li>
          <li>Was folgt daraus? Die Gerade bleibt eine faire Beschreibung der Mittelwerte. Aber der typische Fehler und die Tests in der Ausgabe (Std. Error, Sig.) sind dann weniger verlässlich. Und im Bericht gehört dazu, für wen die Vorhersage ungenau ist.</li>
        </ul>
      </MoreDetail>
      <Mixup>Gleiche Fehlervarianz heißt nicht, dass die Gruppen gleich zufrieden sind. Es geht nicht um die Mittelwerte, sondern darum, wie weit die Menschen in jeder Gruppe um die Gerade herum streuen.</Mixup>
      <MapLink concept="variance_assumption" className="hilfe-zeile s9-karte">Gleiche Fehlervarianz</MapLink>
    </Card>

    <Card id="k3b" step="3b" title="Ausreißer: Ein Punkt zieht die Gerade" badge={<Badge>Ausreißer: kennst du aus Sitzung 4 und 6</Badge>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Zu den acht Befragten aus Grundlage 2 kommt eine neunte Person, zum Beispiel: sehr gute Lage, aber Lebenszufriedenheit 2. Was passiert mit der Geraden?</p>
      <Outlier />
      <QuickCheck question={K3B_Q} />
      <InShort>Ein <b>Ausreißer</b> ist ein Punkt weit weg von den anderen. Weil die Regression quadrierte Abstände klein macht, kann ein einziger Ausreißer, vor allem am Rand der UV, die Gerade stark ziehen. Erst anschauen, dann rechnen.</InShort>
      <MoreDetail summary="Was tun mit Ausreißern?">
        <ul>
          <li>Erst prüfen, ob es ein Fehler ist (etwa ein Tippfehler bei der Erfassung). Echte Antworten bleiben drin.</li>
          <li>Rechne zur Kontrolle einmal mit und einmal ohne die auffälligen Fälle und berichte beides. Ändert sich die Gerade stark, hängt dein Ergebnis an wenigen Personen.</li>
          <li>Bei Skalen wie 0 bis 10 oder 1 bis 6 gibt es kaum Werte weit draußen; bei offenen Angaben wie Stunden oder Einkommen schon (kennst du aus Sitzung 4). Wie man den Einfluss einzelner Fälle misst, kommt in Sitzung 10.</li>
        </ul>
      </MoreDetail>
      <Mixup>Viele Befragte machen eine Regression nicht immun. Bei 5.000 Befragten zieht eine einzelne Person wenig; aber eine kleine Gruppe mit extremen Werten kann es schon.</Mixup>
    </Card>
  </Foundation>;
}

/** Grundlage 4: Gerade oder Kurve? (Linearität). */
export function Foundation4() {
  return <Foundation id="g4" n={4} title="Gerade oder Kurve?" taskHref="#a4"
    intro="Was zeigt eine Gerade, wenn der Zusammenhang gar nicht gerade ist? Etwa 5 Minuten.">
    <Card id="k4" step="4" title="Eine flache Gerade heißt nicht „kein Zusammenhang“" badge={<Known session={6} what="r sieht nur Geraden" />} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Zehn Räume, zum Beispiel, von 14 bis 32 Grad. In jedem sagt eine Person, wie wohl sie sich fühlt (0 bis 10). Zu kalt und zu warm sind beide unangenehm.</p>
      <Curve />
      <QuickCheck question={K4_Q} />
      <p className="absatz"><b>Und im ALLBUS?</b> Bei der Lebenszufriedenheit nach Lage (Grundlage 1) passt die Gerade gut: Die Mittelwerte der Stufen liegen höchstens 0,27 Punkte neben ihr, in der Mitte fast genau darauf, an beiden Rändern etwas darunter (−0,27 und −0,26).</p>
      <InShort><b>Linearität</b> heißt: Der Zusammenhang lässt sich durch eine Gerade beschreiben. Prüfen kannst du das, indem du die Mittelwerte jeder Stufe neben die Gerade legst. Liegen sie in einem Bogen um die Gerade, beschreibt sie den Zusammenhang schlecht.</InShort>
      <MoreDetail summary="Was tun bei einem Bogen?">
        <ul>
          <li>Die Gerade nicht deuten, sondern die Mittelwerte je Stufe berichten.</li>
          <li>Oder die UV in Gruppen einteilen und jede Gruppe mit einer eigenen Zahl ins Modell nehmen (Dummyvariablen, Sitzung 10).</li>
        </ul>
      </MoreDetail>
      <Mixup>Ein signifikantes B heißt nicht, dass die Gerade passt. Auch eine Gerade durch einen Bogen kann bei vielen Befragten signifikant sein.</Mixup>
    </Card>
  </Foundation>;
}

/** Überblick „Eine Regression lesen, prüfen, berichten“ (Ü1 fünf Zahlen, Ü2 Voraussetzungen, Ü3 Zusammenhang, nicht Ursache). */
export function Overview() {
  return <Foundation id="g5" n="✓" title="Eine Regression lesen, prüfen, berichten" eyebrow="Überblick zu allen Aufgaben"
    intro="Alle vier Themen zusammen: welche Zahl wofür steht und was du prüfst, bevor du der Geraden glaubst.">

    <Card id="ue1" step="Ü1" title="Fünf Zahlen für einen Bericht" tag={{ kind: 'interpret', label: 'Deuten' }}>
      <table className="daten voll">
        <caption className="sr-only">Fünf Zahlen für einen Bericht</caption>
        <thead><tr><th scope="col">Was</th><th scope="col">Wo in <code>summary()</code></th><th scope="col">So schreibst du es (Beispiel Aufgabe 1 bis 3)</th></tr></thead>
        <tbody>
          <tr><td>Steigung B</td><td>Coefficients, Zeile der UV, Spalte B</td><td>„Mit jeder Stufe mehr Vertrauen in den Bundestag liegt die vorhergesagte Zufriedenheit mit der Demokratie um 0,47 Punkte höher.“</td></tr>
          <tr><td>Konstante</td><td>Coefficients, Zeile <code>(Intercept)</code>, Spalte B</td><td>nur zum Rechnen, gedeutet nur, wenn 0 bei der UV vorkommt</td></tr>
          <tr><td>R²</td><td>Model Summary, R Square</td><td>„Das Vertrauen erklärt statistisch 35 % der Streuung der Zufriedenheit (R² = 0,35).“</td></tr>
          <tr><td>typischer Fehler</td><td>Model Summary, Std. Error of the Estimate</td><td>„Die Vorhersage liegt typischerweise 1,0 Punkte daneben; ganz ohne Vertrauen deutlich mehr.“</td></tr>
          <tr><td>N und Gewicht</td><td><code>- N:</code> und <code>- Weights:</code></td><td>„ALLBUS 2023, gewichtet, n = 3.575.“</td></tr>
        </tbody>
      </table>
      <p className="absatz">Und immer dazu: Welche Variable ist die AV, welche die UV, und in welche Richtung laufen ihre Codes (umgepolt?).</p>
    </Card>

    <Card id="ue2" step="Ü2" title="Voraussetzungen: Was du prüfst, bevor du der Geraden glaubst" tag={{ kind: 'picture', label: 'Im Bild' }}>
      <Assumptions />
      <table className="daten voll">
        <caption className="sr-only">Voraussetzungen der linearen Regression</caption>
        <thead><tr><th scope="col">Voraussetzung</th><th scope="col">in Worten</th><th scope="col">so prüfst du</th><th scope="col">wenn verletzt</th></tr></thead>
        <tbody>
          <tr><td>Linearität</td><td>Der Zusammenhang ist ungefähr gerade.</td><td>Mittelwerte je Stufe neben die Gerade legen (A4).</td><td>Mittelwerte je Stufe berichten oder Gruppen bilden (Sitzung 10).</td></tr>
          <tr><td>keine einflussreichen Ausreißer</td><td>Kein einzelner Punkt zieht die Gerade weg.</td><td>Streudiagramm ansehen; mit und ohne auffällige Fälle rechnen.</td><td>Fehler korrigieren; sonst beides berichten.</td></tr>
          <tr><td>gleiche Fehlervarianz</td><td>Die Residuen streuen überall gleich stark.</td><td>SD des Residuums je Stufe, Levene-Test (A3).</td><td>Berichten, für wen die Vorhersage ungenau ist; Tests vorsichtig lesen.</td></tr>
          <tr><td>metrische AV</td><td>Die AV hat gleich große Abstände (oder viele Stufen).</td><td>Skalenniveau prüfen (Sitzung 3).</td><td>Bei wenigen Stufen vorsichtig; für zwei Stufen logistische Regression (Sitzung 11).</td></tr>
          <tr><td>unabhängige Befragte</td><td>Jede Person zählt einmal und unabhängig von den anderen.</td><td>Durch die Zufallsstichprobe des ALLBUS näherungsweise gegeben.</td><td>–</td></tr>
          <tr><td>Residuen ungefähr normalverteilt</td><td>Die Abstände zur Geraden verteilen sich wie eine Glocke.</td><td>Nur für die Tests (Sig., 95% CI) wichtig, und nur bei wenigen Befragten; bei Tausenden reicht der zentrale Grenzwertsatz (kennst du aus Sitzung 7).</td><td>Bei kleinen Stichproben Tests vorsichtig lesen.</td></tr>
        </tbody>
      </table>
      <p className="absatz">Die Zufriedenheitsskalen dieses Kapitels haben 6 und 11 Stufen. Man rechnet mit ihnen wie mit metrischen Variablen; an den Enden der Skala zeigt sich das als Bogen oder als kleinere Streuung (Aufgabe 3, Stufe 7).</p>
    </Card>

    <Card id="ue3" step="Ü3" title="Zusammenhang, nicht Ursache" badge={<Known session={5} what="Zusammenhang ist keine Ursache" />} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">Eine Regression sagt: Wer bei der UV höher liegt, liegt im Mittel bei der AV um B höher. Sie sagt nicht, dass die UV die AV verursacht. Tauschst du die Seiten (Probier-Werkstatt in Aufgabe 1), bekommst du eine andere Gerade (0,743 statt 0,465) mit demselben R² (0,346). Beide stimmen; welche Richtung gilt, entscheidet die Theorie, nicht R.</p>
      <InShort>Erst die Gerade lesen (B, Konstante), dann prüfen, wie gut sie passt (R², typischer Fehler), dann, ob sie für alle passt (Linearität, Ausreißer, Fehlervarianz). Und im Bericht von Zusammenhang sprechen, nicht von Wirkung.</InShort>
      <Mixup>„Die Regression zeigt, dass Vertrauen zufrieden macht.“ Richtig wäre: „Wer dem Bundestag mehr vertraut, ist im Mittel zufriedener mit der Demokratie.“</Mixup>
    </Card>
  </Foundation>;
}
