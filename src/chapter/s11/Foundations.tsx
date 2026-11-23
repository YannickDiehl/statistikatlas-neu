// Sitzung 11 „Logistische Regression“: die vier Grundlagen und der Überblick aus sitzung11.md (§4 bis §7 und §9), ohne R-Code.
import { Badge, Card, InShort, Known, Mixup, MoreDetail, Tag } from '../blocks/Card';
import { Foundation } from '../blocks/Foundation';
import { K1B, K1C_Q, K2B_Q, K4A } from './content';
import { LineOrCurve, ThreeLanguages, Translator, ZeroOneTower } from './figures/Topic1';
import { ExpBTable, Factor, FormulaLogit, FormulaPercent, LogitAndCurve, ReadOutput } from './figures/Topic2';
import { TwoSteps, WayBack } from './figures/Topic3';
import { FormulaNull, HitRate, MinusTwoLL, WhichRegression } from './figures/Topic4';
import { RevealChoice, SpecialQuestions } from './ui';

/** Extra labels next to the main tag of a card (the plan gives some cards two or three). */
const FORMULA = <Tag kind="interpret" label="Formel lesen lernen" />;
const THINK = <Tag kind="estimate" label="Kurz überlegen" />;

/** Grundlage 1: Ja oder nein: warum keine Gerade? (1a Turm, 1b Gerade, 1c drei Sprachen). */
export function Foundation1() {
  return <Foundation id="g1" n={1} title="Ja oder nein: warum keine Gerade?" taskHref="#a1"
    intro="Was ist anders, wenn die Antwort nur Ja oder Nein ist? Drei kurze Schritte, etwa 15 Minuten.">

    <Card id="k1a" step="1a" title="Ein Turm aus Nullen und Einsen"
      badge={<><Known session={2} what="Turm und Stein" /><Known session={3} what="Mittelwert" /></>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Bisher hast du Variablen mit vielen Stufen erklärt, etwa die Lebenszufriedenheit von 0 bis 10. Manche Fragen haben nur zwei Antworten: Ja oder Nein. Der ALLBUS fragt alle, die das Internet nutzen, mit welchen Geräten sie es tun. Wer das Smartphone nennt, bekommt bei <code>lm30</code> eine 1, wer es nicht nennt, eine 0. Hier siehst du den Turm <code>lm30</code> von zehn Befragten, zum Beispiel.</p>
      <ZeroOneTower />
      <InShort>Eine Variable mit genau zwei Ausprägungen heißt <b>dichotom</b> (oder binär). Man kodiert sie mit 0 und 1. Ihr Mittelwert ist der Anteil der Einsen. Diesen Anteil liest man als <b>Wahrscheinlichkeit</b>: Wie wahrscheinlich hat eine Person aus dieser Gruppe eine 1?</InShort>
      <MoreDetail summary="Was das im ALLBUS heißt">
        <ul>
          <li>Gewichtet geben 91,4 % der Internetnutzenden das Smartphone an. Der gewichtete Mittelwert von <code>lm30</code> ist also 0,914.</li>
          <li>Eine Wahrscheinlichkeit liegt immer zwischen 0 (niemand) und 1 (alle), in Prozent zwischen 0 und 100.</li>
          <li>Welche Antwort die 1 bekommt, legst du fest. Das Modell sagt später immer die Wahrscheinlichkeit der 1 vorher.</li>
        </ul>
      </MoreDetail>
      <Mixup>Die 0 heißt nicht „fehlt“. 0 ist eine gültige Antwort (nicht genannt). Wer gar nicht geantwortet hat, ist NA und liegt nicht im Turm.</Mixup>
    </Card>

    <Card id="k1b" step="1b" title="Warum eine Gerade scheitert" badge={<><Known session={9} what="Gerade" />{THINK}</>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Je älter, desto seltener das Smartphone? Teil die Internetnutzenden in sieben Altersgruppen und schau, welcher Anteil das Smartphone nennt.</p>
      <RevealChoice id={K1B.id} label={`Kurz überlegen: ${K1B.label}`} options={K1B.options} resolution={K1B.resolution} />
      <LineOrCurve />
      <InShort>Eine Gerade läuft endlos weiter, über 100 % und unter 0 %. Wahrscheinlichkeiten haben aber Grenzen. Darum nimmt man für eine 0/1-Variable eine <b>S-Kurve</b>: Sie nähert sich 0 und 100 % an, ohne sie zu überschreiten. Das Verfahren dazu heißt <b>logistische Regression</b>.</InShort>
      <MoreDetail summary="Was noch an der Geraden stört">
        <ul>
          <li>Nahe an 0 oder 100 % ist kaum Platz für Veränderung: Bei 99 % kann der Anteil höchstens noch um einen Prozentpunkt steigen. In der Mitte kann er viel stärker wachsen. Eine Gerade nimmt aber überall gleich große Schritte an.</li>
          <li>Die Residuen einer 0/1-Variable sind keine schöne Wolke um die Gerade: Jede Person liegt entweder auf der 0 oder auf der 1. Gleiche Fehlervarianz (Sitzung 9) ist damit verletzt.</li>
          <li>Die Zahlen der Geraden: Konstante 1,151, B −0,005 (genauer −0,00474), R² 0,084, gewichtet. Für 18 Jahre: 1,151 − 0,00474 × 18 = 1,066, also 106,6 %. Mit dem gerundeten B −0,005 kämen 106,1 % heraus, ebenfalls über 100 %.</li>
        </ul>
      </MoreDetail>
      <Mixup>„Die Gerade passt im Großen und Ganzen, also ist sie gut genug.“ An den Rändern sagt sie Unmögliches voraus, und genau dort, nahe 0 oder 100 %, liegen viele Fragen der Sozialforschung, etwa die Wahlabsicht.</Mixup>
    </Card>

    <Card id="k1c" step="1c" title="Drei Sprachen: Wahrscheinlichkeit, Chance, Logit" badge={FORMULA} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Von 100 Internetnutzenden zwischen 70 und 79 nennen 77,7 das Smartphone, 22,3 nicht. Das kannst du auf drei Arten sagen, und jede hat ihren Zweck.</p>
      <ThreeLanguages />
      <h6 className="zwischen">Übersetzer</h6>
      <p className="unter-zwischen">Stell eine Wahrscheinlichkeit ein und lies Chance und Logit ab. Mit den Pfeiltasten gehst du einen Prozentpunkt weiter, mit Bild auf und Bild ab zehn.</p>
      <Translator />
      <div className="kurzueberlegen">
        <p>Kurz überlegen</p>
        <SpecialQuestions id="k1c-q" questions={[K1C_Q]} />
      </div>
      <InShort>Die <b>Wahrscheinlichkeit</b> sagt, wie viele von 100 Ja sagen. Die <b>Chance</b> (englisch Odds) teilt Ja durch Nein: „3 zu 1“. Der <b>Logit</b> ist der Logarithmus der Chance. Er hat keine Grenzen nach oben und unten, und darum kann ein Modell in Logits mit einer Geraden rechnen.</InShort>
      <MoreDetail summary="Formel lesen lernen: die drei Übersetzungen">
        <ul>
          <li>Chance = p / (1 − p). Lies: Anteil Ja geteilt durch Anteil Nein. Mit Prozent geht es genauso: 77,7 / 22,3.</li>
          <li>Logit = ln(Chance). ln ist der natürliche Logarithmus. Du musst ihn nie selbst rechnen; merk dir drei Punkte: Chance 1 gibt Logit 0, Chance größer als 1 gibt einen positiven Logit, Chance kleiner als 1 einen negativen.</li>
          <li>Zurück: Chance = exp(Logit), Wahrscheinlichkeit = Chance / (1 + Chance). Das brauchst du in Aufgabe 3.</li>
          <li>Warum der Umweg? Die Wahrscheinlichkeit stößt bei 0 und 100 % an. Die Chance stößt nur unten an (sie wird nie kleiner als 0). Der Logit stößt nirgends an. Auf dieser offenen Skala darf eine Gerade endlos weiterlaufen.</li>
        </ul>
      </MoreDetail>
      <Mixup>Im Alltag heißt „Chance“ oft Wahrscheinlichkeit („die Chance liegt bei 80 %“). Hier ist die Chance immer ein Verhältnis Ja zu Nein: 80 % entsprechen der Chance 4.</Mixup>
    </Card>
  </Foundation>;
}

/** Grundlage 2: Das Modell: B und Exp(B) (2a Gerade im Logit, 2b Exp(B), 2c die Ausgabe lesen). */
export function Foundation2() {
  return <Foundation id="g2" n={2} title="Das Modell: B und Exp(B)" taskHref="#a2"
    intro="Was rechnet ein logistisches Modell, und wie liest man seine Zahlen? Drei Schritte, etwa 12 Minuten.">

    <Card id="k2a" step="2a" title="Eine Gerade im Logit, eine S-Kurve in Prozent" badge={<Known session={9} what="Konstante + B × Wert" />} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Das Modell aus „R lesen“ sagt unter den Internetnutzenden die Smartphone-Nutzung aus dem Alter vorher. In seiner Ausgabe stehen in der Spalte B zwei Zahlen: die Konstante 6,774 und für das Alter −0,076. Wie in Sitzung 9 ergeben sie eine Gerade, aber nicht in Prozent, sondern in Logits.</p>
      <FormulaLogit />
      <p className="unter-zwischen">Der Regler unter dem Bild geht in Schritten von zehn Jahren. Mit den Pfeiltasten gehst du zehn Jahre weiter.</p>
      <LogitAndCurve />
      <InShort>Die <b>logistische Regression</b> rechnet wie die lineare: Konstante + B × Wert. Heraus kommt aber ein <b>Logit</b>. Übersetzt in Wahrscheinlichkeiten wird aus der Geraden die S-Kurve.</InShort>
      <MoreDetail summary="Wie R die Zahlen findet">
        <ul>
          <li>Die lineare Regression sucht die Gerade mit den kleinsten quadrierten Residuen (Sitzung 9). Die logistische sucht die Zahlen, unter denen die beobachteten Nullen und Einsen am wahrscheinlichsten sind. Dieses Verfahren heißt <b>Maximum Likelihood</b>. Wie gut das gelingt, misst −2LL (Grundlage 4).</li>
          <li>R rechnet mit mehr Stellen als den drei, die es zeigt (B genauer −0,0758). Rechnest du von Hand mit den gerundeten Zahlen, weicht das Ergebnis leicht ab: für 80 Jahre 66,7 % statt 67,0 % aus <code>predict()</code>.</li>
        </ul>
      </MoreDetail>
      <Mixup>B ist hier keine Änderung in Prozent. −0,076 heißt: Der Logit sinkt je Lebensjahr um 0,076. Was das in Prozent bedeutet, hängt vom Alter ab (Grundlage 3).</Mixup>
    </Card>

    <Card id="k2b" step="2b" title="Exp(B): ein Faktor für die Chance" badge={<>{FORMULA}{THINK}</>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Neben B steht Exp(B) = 0,927. Das ist e hoch B, mit <code>exp(-0.076)</code> hast du es in „R lesen“ selbst gerechnet. Exp(B) sagt: Mit jedem Lebensjahr wird die Chance, das Smartphone zu nennen, mit 0,927 malgenommen.</p>
      <Factor />
      <ExpBTable />
      <FormulaPercent />
      <div className="kurzueberlegen">
        <p>Kurz überlegen</p>
        <SpecialQuestions id="k2b-q" questions={[K2B_Q]} />
      </div>
      <InShort><b>Exp(B)</b>, auch <b>Odds Ratio</b> oder Chancenverhältnis, sagt, mit welchem Faktor sich die Chance ändert, wenn der Prädiktor um eine Einheit steigt. Über 1 heißt: die Chance steigt; unter 1: sie sinkt; genau 1: kein Zusammenhang.</InShort>
      <MoreDetail summary="Zwei Schreibweisen für denselben Zusammenhang">
        <ul>
          <li>B und Exp(B) sagen dasselbe in zwei Sprachen: B in Logits (plus), Exp(B) in Chancen (mal). Ein Logit-Schritt von −0,076 entspricht dem Faktor 0,927.</li>
          <li>Neben Exp(B) steht ein 95-%-Konfidenzintervall (kennst du aus Sitzung 7), beim Alter 0,919 bis 0,935. Liegt die 1 nicht darin, ist der Zusammenhang signifikant; dasselbe zeigt die Spalte Sig. Die Spalte Wald enthält die Prüfgröße dazu.</li>
          <li>Warum Odds <b>Ratio</b>? Exp(B) ist das Verhältnis zweier Chancen: die Chance bei einer Einheit mehr geteilt durch die Chance davor. Für zehn Jahre: Chance mit 40 geteilt durch Chance mit 30, 41,8 / 89,5 = 0,47.</li>
          <li>Bei mehreren Prädiktoren gilt Exp(B) „bei gleichen Werten der anderen Prädiktoren“, wie B in der multiplen Regression (Sitzung 10).</li>
          <li>Die Konstante hat auch ein Exp(B), hier 874,684: die Chance bei Alter 0. Weil es keine Befragten mit 0 Jahren gibt, deutet man sie nicht.</li>
        </ul>
      </MoreDetail>
      <Mixup>„Exp(B) = 0,927 heißt: Die Wahrscheinlichkeit sinkt um 7,3 % je Jahr.“ Es ist die Chance, nicht die Wahrscheinlichkeit. Wie stark sich die Wahrscheinlichkeit ändert, hängt davon ab, wo jemand auf der S-Kurve steht (Grundlage 3).</Mixup>
    </Card>

    <Card id="k2c" step="2c" title="Die Ausgabe lesen"
      badge={<><Known session={7} what="summary()" /><Badge>Sig.: kennst du aus Sitzung 7 und 9</Badge></>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead"><code>summary()</code> zeigt viele Tabellen. Für das Deuten brauchst du zuerst drei Stellen. Die übrigen (Model Summary, Classification Table) kommen in Grundlage 4.</p>
      <ReadOutput />
      <InShort>Erst nachsehen, wofür die 1 steht. Dann je Prädiktor B (Richtung), Sig. (signifikant?) und Exp(B) (Faktor für die Chance) lesen.</InShort>
      <Mixup>Exp(B) der Konstante wird als „Effekt“ gelesen. Die Konstante ist kein Prädiktor; ihr Exp(B) ist nur die Chance beim Wert 0 aller Prädiktoren.</Mixup>
    </Card>
  </Foundation>;
}

/** Grundlage 3: Vorhergesagte Wahrscheinlichkeiten (3a Rückweg, 3b gleicher Faktor, 3c AME). */
export function Foundation3() {
  return <Foundation id="g3" n={3} title="Vorhergesagte Wahrscheinlichkeiten" taskHref="#a3"
    intro="Was heißt ein Modell für einzelne Menschen, und warum gibt es nicht den einen Effekt in Prozent? Drei Schritte, etwa 12 Minuten.">

    <Card id="k3a" step="3a" title="Vom Logit zurück zur Wahrscheinlichkeit" badge={<Known session={9} what="Vorhersage" />} tag={{ kind: 'interpret', label: 'Formel lesen lernen' }}>
      <p className="lead">Wie wahrscheinlich nennt eine 70-Jährige, die das Internet nutzt, das Smartphone? Das Modell beantwortet das in drei Schritten, genau die Kette aus Grundlage 1c, nur rückwärts.</p>
      <WayBack />
      <p className="absatz"><code>predict(…, type = "response")</code> macht alle drei Schritte auf einmal, mit ungerundeten Zahlen: 81,2 % für 70 Jahre.</p>
      <InShort>Eine <b>vorhergesagte Wahrscheinlichkeit</b> rechnest du in drei Schritten: Logit aus Konstante und B, mit <code>exp()</code> zur Chance, dann Chance durch 1 plus Chance. <code>predict()</code> mit <code>type = "response"</code> erledigt das für dich.</InShort>
      <MoreDetail summary="Was eine vorhergesagte Wahrscheinlichkeit nicht ist">
        <ul>
          <li>81,1 % heißt nicht, dass eine bestimmte 70-Jährige zu 81 % ein Smartphone nutzt. Gemeint ist: Von 100 Internetnutzenden dieses Alters nennen laut Modell etwa 81 das Smartphone. Über Menschen ohne Internet sagt das Modell nichts.</li>
          <li>Mehrere Prädiktoren: Jeder bekommt sein eigenes „+ B × Wert“. Für Beispielpersonen setzt du ihre Werte ein; mit <code>tibble()</code> baust du sie für <code>predict()</code>.</li>
        </ul>
      </MoreDetail>
      <Mixup>Die Chance 4,28 als Wahrscheinlichkeit lesen. Wahrscheinlichkeiten liegen zwischen 0 und 1; 4,28 heißt „4,28 zu 1“, also 81,1 %.</Mixup>
    </Card>

    <Card id="k3b" step="3b" title="Gleicher Faktor, verschiedene Prozentpunkte" badge={<><Known session={5} what="Prozentpunkte" />{THINK}</>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Zwei Internetnutzende werden zehn Jahre älter, zum Beispiel: eine Person von 30 auf 40, eine von 70 auf 80. Für beide wird die Chance mit 0,47 malgenommen (Grundlage 2b). Verlieren beide gleich viel?</p>
      <TwoSteps />
      <InShort>In Logits und in Chancen wirkt ein Prädiktor überall gleich. In <b>Prozentpunkten</b> hängt seine Wirkung vom Ausgangspunkt ab: in der Mitte der S-Kurve (um 50 %) groß, nahe 0 oder 100 % klein.</InShort>
      <MoreDetail summary="Prozent und Prozentpunkte">
        <ul>
          <li>Prozentpunkte sind die Differenz zweier Prozentzahlen: von 81,1 % auf 66,7 % sind es 14,4 Prozentpunkte weniger. „14,4 % weniger“ hieße etwas anderes (14,4 % von 81,1).</li>
          <li>Die S-Kurve ist um 50 % am steilsten. Dort bringt eine Einheit am meisten Prozentpunkte.</li>
          <li>Darum berichtet man für Laien am besten Wahrscheinlichkeiten für typische Beispielpersonen, mit ihren Werten dazu.</li>
        </ul>
      </MoreDetail>
      <Mixup>„Das Alter wirkt bei Jüngeren kaum.“ In Chancen wirkt es bei allen gleich stark. Bei Jüngeren ist nur kaum noch Platz nach oben: Fast alle nennen das Smartphone schon.</Mixup>
    </Card>

    <Card id="k3c" step="3c" title="Eine Zahl im Mittel: der AME" tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">Wenn jeder Mensch eine andere Änderung in Prozentpunkten hat, welche Zahl berichtest du dann? Man kann sie mitteln: Für jede Person im Modell schaut R, wie steil die S-Kurve an ihrer Stelle ist, also wie stark sich ihre Wahrscheinlichkeit bei einem kleinen Schritt ändert, umgerechnet auf eine Einheit. Dann bildet R den gewichteten Durchschnitt.</p>
      <p className="absatz">Das Ergebnis heißt durchschnittlicher marginaler Effekt (AME). Beim Smartphone-Modell steht in der Spalte AME −0.005: Im Mittel über alle Internetnutzenden im Modell sinkt die Wahrscheinlichkeit je Lebensjahr um etwa 0,5 Prozentpunkte, grob gerechnet über zehn Jahre um etwa 5 Prozentpunkte. Für die 30-Jährige waren es nur 1,2 Punkte, für die 70-Jährige 14,4: Der AME ist ein Mittelwert, kein Wert für alle.</p>
      <InShort>Der <b>durchschnittliche marginale Effekt (AME)</b> sagt in Prozentpunkten, wie stark sich die Wahrscheinlichkeit je Einheit im Mittel über alle Befragten im Modell ändert. R zeigt ihn als Anteil: −0.005 heißt −0,5 Prozentpunkte.</InShort>
      <MoreDetail summary="Wann welcher Wert?">
        <ul>
          <li>Exp(B): für den Vergleich von Chancen, unabhängig vom Ausgangspunkt. Vorhergesagte Wahrscheinlichkeiten: für Beispielpersonen, am verständlichsten. AME: eine Zahl in Prozentpunkten für alle zusammen.</li>
          <li>Neben dem AME stehen Standardfehler, Sig. (Spalte p) und ein Konfidenzintervall, wie bei B.</li>
          <li>Genau genommen ist der AME die mittlere Steigung der S-Kurve. Für kleine Schritte wie ein Lebensjahr ist das fast dasselbe wie „ein Jahr mehr“. Bei großen Schritten, etwa einer ganzen Stufe einer Skala mit vier Stufen, ist er nur eine Annäherung: Weil die Kurve oben abflacht, bringt eine ganze Stufe dort meist etwas weniger, als der AME sagt.</li>
        </ul>
      </MoreDetail>
      <Mixup>Den AME für jede Person anwenden. Er ist ein Durchschnitt: Bei manchen ist die Änderung viel kleiner, bei anderen viel größer.</Mixup>
    </Card>
  </Foundation>;
}

/** Grundlage 4: Wie gut ist das Modell? (4a Trefferquote, 4b −2LL, 4c Pseudo-R²). */
export function Foundation4() {
  return <Foundation id="g4" n={4} title="Wie gut ist das Modell?" taskHref="#a4"
    intro="Trefferquote, −2LL und Pseudo-R²: was sie messen und wo sie täuschen. Etwa 10 Minuten.">

    <Card id="k4a" step="4a" title="Trefferquote: besser als Raten?" badge={THINK} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Das Smartphone-Modell meldet „Accuracy = 91.4%“: Bei 91,4 % der Internetnutzenden im Modell liegt es richtig. Klingt gut. Aber wie oft läge man richtig, wenn man einfach für alle „Ja“ sagt?</p>
      <HitRate />
      <RevealChoice id={K4A.id} label={`Kurz überlegen: ${K4A.label}`} options={K4A.options} resolution={K4A.resolution} button="Auflösen" />
      <InShort>Die <b>Trefferquote</b> (Classification Table, Overall Percentage) zählt, wie oft das Modell mit der Schwelle 50 % richtig liegt. Ist eine Antwort selten, trifft schon die Regel „alle bekommen die häufige Antwort“ fast genauso oft. Vergleich die Trefferquote darum immer mit dieser Regel.</InShort>
      <MoreDetail summary="Warum ein Modell trotzdem nützt">
        <ul>
          <li>Das Modell sagt nicht nur Ja oder Nein, sondern Wahrscheinlichkeiten: 99,6 % mit 18 Jahren, 67,0 % mit 80 (aus <code>predict()</code>). Diese Unterschiede gehen in der Trefferquote verloren, weil beide über 50 % liegen.</li>
          <li>Die Zahlen der Tabelle sind gewichtet und gerundet; daraus nachgerechnete Prozente können um ein Zehntel abweichen.</li>
        </ul>
      </MoreDetail>
      <Mixup>„91 % richtig, also ein sehr gutes Modell.“ Bei seltenen Antworten sagt die Trefferquote wenig. Ob das Modell etwas erklärt, zeigen −2LL und Pseudo-R².</Mixup>
    </Card>

    <Card id="k4b" step="4b" title="−2LL und der Omnibus-Test" badge={FORMULA} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Das Modell sucht die Zahlen, unter denen die beobachteten Antworten am wahrscheinlichsten sind (Maximum Likelihood, Grundlage 2a). −2LL (−2 Log Likelihood) misst, wie schlecht die geschätzten Wahrscheinlichkeiten dann noch zu den beobachteten Nullen und Einsen passen: 0 hieße perfekt, kleiner ist besser. Zum Vergleich braucht man ein <b>Nullmodell</b>, das nur die Konstante kennt und allen denselben Anteil vorhersagt.</p>
      <MinusTwoLL />
      <FormulaNull />
      <InShort><b>−2LL</b> misst, wie schlecht das Modell die Antworten trifft: kleiner ist besser. Der <b>Omnibus-Test</b> prüft, ob das Modell −2LL gegenüber dem Nullmodell deutlich senkt (Chi-square, Sig.). Ist Sig. &lt; .05, verbessern die Prädiktoren zusammen das Modell mehr, als durch Zufall zu erwarten wäre.</InShort>
      <MoreDetail summary="Hosmer-Lemeshow-Test">
        <p>In der Ausgabe steht noch ein Test, der prüft, ob die vorhergesagten Wahrscheinlichkeiten in Gruppen zu den beobachteten Anteilen passen. Hier ist er unauffällig (Sig. .378): Die S-Kurve passt zu den Altersgruppen (Grundlage 1b). Ein Sig. unter .05 hieße: Irgendwo weicht das Modell ab, etwa weil ein Prädiktor nicht gleichmäßig wirkt. Bei sehr vielen Befragten schlägt er aber schnell an.</p>
      </MoreDetail>
      <Mixup>−2LL für sich allein deuten. Die Zahl hängt von der Zahl der Fälle ab. Aussagekräftig ist nur der Vergleich mit dem Nullmodell.</Mixup>
    </Card>

    <Card id="k4c" step="4c" title="Pseudo-R²" badge={<Known session={9} what="R²" />}>
      <p className="lead">In der Model Summary stehen drei Pseudo-R²: Cox &amp; Snell 0,090, Nagelkerke 0,203, McFadden 0,161. Alle drei liegen zwischen 0 und 1 und sind größer, je mehr das Modell −2LL senkt. Am häufigsten berichtet man <b>Nagelkerke R²</b>; die Kopfzeile zeigt nur diesen.</p>
      <InShort><b>Pseudo-R²</b> ist für die logistische Regression, was R² für die lineare ist: eine Zahl von 0 bis 1 für die Güte. Aber es ist <b>kein Anteil erklärter Varianz</b>. Als grobe Faustregel gilt Nagelkerke ab 0,2 als brauchbar, ab 0,4 als gut.</InShort>
      <MoreDetail summary="Warum drei Zahlen?">
        <ul>
          <li>McFadden: um welchen Anteil −2LL gegenüber dem Nullmodell sinkt (Karte 4b). Cox &amp; Snell: ähnlich, kann aber 1 nie erreichen. Nagelkerke: Cox &amp; Snell, so gestreckt, dass 1 möglich ist.</li>
          <li>Pseudo-R² verschiedener Modelle vergleicht man nur bei derselben abhängigen Variable und denselben Befragten.</li>
        </ul>
      </MoreDetail>
      <Mixup>„Nagelkerke 0,203 heißt: Das Alter erklärt 20 % der Smartphone-Nutzung.“ So darf man R² aus Sitzung 9 lesen, Pseudo-R² nicht. Sag: „Das Modell passt deutlich besser als ohne Alter; Nagelkerke R² = 0,20.“</Mixup>
    </Card>
  </Foundation>;
}

/** Überblick „Logistische Regression lesen“: drei Sprachen, welche Regression, Voraussetzungen. */
export function Overview() {
  return <Foundation id="g5" n="✓" title="Logistische Regression lesen" eyebrow="Überblick zu allen Aufgaben"
    intro="Alle vier Themen zusammen: welche Zahl in welcher Sprache spricht, wann man logistisch rechnet und was ein Modell braucht.">

    <Card id="u1" step="Ü1" title="Drei Sprachen, eine Zahl">
      <table className="daten voll">
        <caption>Drei Sprachen, eine Zahl</caption>
        <thead><tr><th scope="col">Sprache</th><th scope="col">Zahl in der Ausgabe</th><th scope="col">Pflichtgefühl, eine Stufe mehr (Aufgaben 2 und 3)</th><th scope="col">gilt für alle gleich?</th></tr></thead>
        <tbody>
          <tr><td>Logit</td><td>B</td><td>+ 1,326</td><td>ja</td></tr>
          <tr><td>Chance</td><td>Exp(B)</td><td>× 3,77</td><td>ja</td></tr>
          <tr><td>Wahrscheinlichkeit</td><td><code>predict()</code></td><td>+ 16,0 Prozentpunkte (Person A), + 2,9 (Person B)</td><td>nein, hängt vom Ausgangspunkt ab</td></tr>
          <tr><td>Wahrscheinlichkeit im Mittel</td><td>AME</td><td>mittlere Steigung: 5,4 Prozentpunkte je Stufe</td><td>Mittelwert über alle im Modell; eine ganze Stufe bringt meist etwas weniger</td></tr>
        </tbody>
      </table>
      <p className="absatz">Alle Zahlen stammen aus demselben Modell, und alle sind richtig. Wer eine Zahl berichtet, sagt dazu, in welcher Sprache sie spricht. Für Laien am verständlichsten: Wahrscheinlichkeiten für Beispielpersonen oder der AME in Prozentpunkten.</p>
    </Card>

    <Card id="u2" step="Ü2" title="Welches Regressionsmodell?">
      <WhichRegression />
      <p className="hilfe-zeile">Mehr als zwei ungeordnete oder geordnete Stufen (etwa die Parteiwahl): eigene Verfahren (multinomiale, ordinale Regression), nicht Teil dieses Kurses. Oft fasst man vorher mit <code>rec()</code> zu zwei Gruppen zusammen.</p>
    </Card>

    <Card id="u3" step="Ü3" title="Voraussetzungen">
      <table className="daten voll">
        <caption>Voraussetzungen der logistischen Regression</caption>
        <thead><tr><th scope="col">Voraussetzung</th><th scope="col">heißt</th><th scope="col">prüfen</th><th scope="col">in dieser Sitzung</th></tr></thead>
        <tbody>
          <tr><td>Abhängige Variable 0/1</td><td>genau zwei Ausprägungen, richtig kodiert</td><td>„Dependent Variable Encoding“: Was ist die 1?</td><td><code>waehlen</code>: 1 = würde wählen; „weiß nicht“ und Nicht-Wahlberechtigte NA</td></tr>
          <tr><td>Genug Fälle in der selteneren Gruppe</td><td>Faustregel: mindestens 10 Fälle der selteneren Ausprägung je Prädiktor</td><td><code>frequency()</code> der abhängigen Variable im Modell</td><td>146 Befragte, die nicht wählen wollen (gezählt), bei 2 Prädiktoren</td></tr>
          <tr><td>Gleichmäßiger Verlauf im Logit</td><td>jeder Schritt eines Prädiktors ändert den Logit gleich viel</td><td>Anteile je Stufe ansehen (<code>crosstab()</code>), Hosmer-Lemeshow</td><td>Alter beim Smartphone: passt. Interesse: „stark“ 97,5 %, „sehr stark“ 94,1 %, nicht gleichmäßig; Hosmer-Lemeshow Sig. .039</td></tr>
          <tr><td>Unabhängige Fälle</td><td>jede Person einmal, nicht gruppiert</td><td>Erhebung</td><td>ALLBUS: jede befragte Person zählt einmal</td></tr>
          <tr><td>Keine perfekte Abhängigkeit der Prädiktoren</td><td>wie in Sitzung 10 (Multikollinearität)</td><td>Prädiktoren vergleichen</td><td>–</td></tr>
          <tr><td>Gewichtung</td><td>Aussagen über Deutschland</td><td><code>weights = wghtpew</code></td><td>ungewichtet Exp(B) 3,703 statt 3,765</td></tr>
          <tr><td>Keine Ursache aus Zusammenhang</td><td>das Modell vergleicht Menschen</td><td>Begründung, nicht Statistik</td><td>Pflichtgefühl und Wahlabsicht können gemeinsame Ursachen haben</td></tr>
        </tbody>
      </table>
      <p className="absatz">Skalen wie „stimme voll zu“ bis „stimme gar nicht zu“ gehen mit ihren Codes ins Modell (die <code>Note</code> in der Ausgabe). Das setzt voraus, dass die Stufen gleich weit auseinanderliegen. Passt das nicht, kann man sie als Gruppen ins Modell nehmen, als Dummys mit einer Referenzgruppe (kennst du aus Sitzung 10: <code>to_dummy()</code>; die <code>Note</code> schlägt die Abkürzung <code>to_label()</code> vor).</p>
      <Mixup>„Das Modell sagt, wer wählen geht.“ Es sagt für Menschen mit bestimmten Antworten, wie viele von ihnen wählen wollen. Über eine einzelne Person und über tatsächliches Wählen sagt es nichts.</Mixup>
    </Card>
  </Foundation>;
}
