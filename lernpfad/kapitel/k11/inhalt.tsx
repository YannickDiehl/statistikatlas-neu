// Kapitel 11, Reiter „Verstehen“ (Muster: kapitel/k04/KONZEPT.md): je Aufgabe erklären, was in jedem Schritt passiert und warum.
// Keine Übungen: Die „Kurz überlegen“-Fragen des Atlas (k1b, k1c, k2b, k3b, k4a) sind hier rhetorische Fragen mit Antwort.
// Beispiele mit echten Zahlen kommen aus dem Smartphone-Modell (lm30 ~ age), damit keine Antwort der Aufgaben vorweggenommen wird.
import { Card, InShort, Mixup, MoreDetail, Badge } from '@atlas/chapter/blocks/Card';
import { HeadingLevel } from '@atlas/chapter/blocks/level';
import { ReadR } from '@atlas/chapter/s11/ReadR';
import { Ceiling, LineOrCurve, ThreeLanguages, Translator, ZeroOneTower } from '@atlas/chapter/s11/figures/Topic1';
import { ExpBTable, Factor, FormulaLogit, FormulaPercent, LogitAndCurve, ReadOutput } from '@atlas/chapter/s11/figures/Topic2';
import { WayBack } from '@atlas/chapter/s11/figures/Topic3';
import { FormulaNull, HitRate, MinusTwoLL, WhichRegression } from '@atlas/chapter/s11/figures/Topic4';
import '@atlas/chapter/s11/s11.css';
import type { Thema } from '../../react/typen';
import { ZweiSchritte } from './figuren';
import { Abschnitt, Bezug, Code, Frage } from '../../react/gemeinsam';

/* ---------- Vorweg ---------- */
export function Vorweg() {
  return <section className="grund-block" id="vorweg" aria-labelledby="vorweg-h">
    <div className="g-kopf">
      <span className="st m c7" aria-hidden="true">R</span>
      <div><div className="ueber">Vorweg, für alle Aufgaben</div><h4 id="vorweg-h">R lesen</h4></div>
    </div>
    <p className="g-intro">Die Aufgaben 2 bis 4 schätzen ein Modell mit <code>logistic_regression()</code>; Aufgabe 3 braucht dazu vier kleine Werkzeuge. Hier steht, wie du ein logistisches Modell in R liest. Alle Zahlen in diesem Kapitel sind gewichtet mit <code>wghtpew</code>, genau wie die Ausgabe deiner Vorlagen (kennst du aus Sitzung 6); darum steht unter N oft eine gewichtete Zahl. Jede Vorlage läuft für sich: Sie bildet die Variablen, die sie braucht, selbst. Steht im Kommentar „wie in Aufgabe 1“, kennst du diesen Teil schon.</p>
    <HeadingLevel.Provider value={5}><ReadR /></HeadingLevel.Provider>
  </section>;
}

/* ---------- Aufgabe 1 ---------- */
export function Verstehen1() {
  return <Abschnitt id="g1" n={1} titel="Wer will wählen gehen?" frage="Wie hängt die Absicht zu wählen damit zusammen, ob jemand Wählen für eine Bürgerpflicht hält?"
    ziel="die Wahlabsicht als 0/1-Variable gebildet, liest in einer Kreuztabelle, wie der Anteil der Wählenden mit dem Pflichtgefühl steigt, und kannst mit zwei kleinen Rechnungen zeigen, warum eine Gerade an ihre Grenze stößt und was eine Chance ist."
    weg={[
      ['Schritt 1', '#a1-p', 'Erst festlegen: Wollen auch Menschen ohne Pflichtgefühl wählen?', 'k1-worum'],
      ['Schritt 2', '#a1-1', 'Wählen als 0/1 bilden und auszählen', 'k1-null-eins'],
      ['Schritt 3', '#a1-2', 'Kreuztabelle: der Anteil je Stufe Pflichtgefühl', 'k1-kreuz'],
      ['Schritt 4', '#a1-3', 'Prozentpunkte je Stufe: warum eine Gerade scheitert', 'k1-gerade'],
      ['Schritt 5', '#a1-4', 'einen Anteil in eine Chance umrechnen', 'k1-sprachen'],
      ['Schritt 6', '#a1-5', 'Ergebnis festhalten: wo du was abliest', 'k1-ergebnis'],
    ]}>

    <Card id="k1-worum" title="Worum es geht: Wahlabsicht und Pflichtgefühl" badge={<Bezug href="#a1-p">zu Schritt 1</Bezug>} tag={{ kind: 'interpret', label: 'Hintergrund' }}>
      <p className="lead">Die Aufgabe fragt nach zwei Dingen aus dem ALLBUS: ob jemand wählen würde, wenn am nächsten Sonntag Bundestagswahl wäre (<code>pv01</code>), und wie sehr jemand zustimmt, dass die Beteiligung an Wahlen eine Bürgerpflicht ist (<code>pe09</code>).</p>
      <Frage>Was ist an der Wahlabsicht anders als an den Variablen der letzten Sitzungen?</Frage>
      <p>Bisher hast du Variablen mit vielen Stufen erklärt, etwa die Lebenszufriedenheit von 0 bis 10. Die Wahlabsicht hat für diese Aufgabe nur zwei Antworten: wählen oder nicht wählen. Ja oder Nein. Darum braucht diese Sitzung ein eigenes Verfahren, die <b>logistische Regression</b>. Aufgabe 1 zeigt, warum.</p>
      <Frage>Und warum sollst du vorher festlegen, was du erwartest?</Frage>
      <p>In Schritt 1 schätzt du, wie viele derer, die Wählen gar nicht für eine Bürgerpflicht halten, trotzdem wählen wollen. Wer vorher eine Erwartung notiert, merkt hinterher, wo das eigene Bild danebenlag. Sobald alle Fragen in Schritt 6 richtig sind, steht deine Festlegung neben dem Ergebnis.</p>
      <MoreDetail summary="Zwei Dinge, die du über die Daten wissen solltest">
        <ul>
          <li>Die Frage zur Bürgerpflicht wurde nur einem Teil der Befragten gestellt, gut zwei Dritteln. Die übrigen haben TNZ: SPLIT (kennst du aus Sitzung 1). Sie fehlen überall, wo <code>pe09</code> gebraucht wird.</li>
          <li>Es geht um die geäußerte Absicht, nicht um tatsächliches Wählen. Ob jemand am Wahltag wirklich hingeht, weiß der ALLBUS nicht.</li>
        </ul>
      </MoreDetail>
      <Mixup>Pflichtgefühl und Wahlabsicht für dieselbe Frage halten. Es sind zwei verschiedene Fragen; wie eng sie zusammenhängen, zeigt erst die Kreuztabelle in Schritt 3.</Mixup>
    </Card>

    <Card id="k1-null-eins" title="Ein Turm aus Nullen und Einsen" badge={<Bezug href="#a1-1">zu Schritt 2</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Eine Variable mit nur zwei Antworten schreibt man mit 0 und 1. Am Beispiel des Smartphones: Der ALLBUS fragt alle, die das Internet nutzen, mit welchen Geräten sie es tun. Wer das Smartphone nennt, bekommt bei <code>lm30</code> eine 1, wer es nicht nennt, eine 0. Hier der Turm <code>lm30</code> von zehn Befragten, zum Beispiel.</p>
      <ZeroOneTower />
      <Frage>Warum ist der Mittelwert hier so nützlich?</Frage>
      <p>Weil er der Anteil der Einsen ist. Jede 1 zählt einmal, jede 0 gar nicht; geteilt durch alle Steine ergibt sich der Anteil. Gewichtet geben 91,4 % der Internetnutzenden das Smartphone an, der gewichtete Mittelwert von <code>lm30</code> ist also 0,914. Diesen Anteil liest man als <b>Wahrscheinlichkeit</b>: Wie wahrscheinlich hat eine Person aus dieser Gruppe eine 1?</p>
      <Frage>Wie entsteht aus <code>pv01</code> so ein Turm?</Frage>
      <p>In <code>pv01</code> stehen viele Codes: einer für jede Partei, einer für „würde nicht wählen“ und weitere für andere Antworten. Die Vorlage in Schritt 2 macht daraus mit <code>rec()</code> einen Turm aus Nullen und Einsen:</p>
      <Code k="a1f" />
      <ul className="v-liste">
        <li><code>1:90=1 [würde wählen]</code>: Alle Codes von 1 bis 90, also alle Parteien, werden zur 1.</li>
        <li><code>91=0 [würde nicht wählen]</code>: Der Code 91 wird zur 0.</li>
        <li><code>else=NA</code>: Alles, was in keiner der beiden Regeln vorkommt, wird fehlend und liegt nicht im Turm.</li>
        <li><code>frequency(waehlen, weights = wghtpew)</code> zählt den neuen Turm aus, gewichtet. In der Kopfzeile steht auch der Mittelwert (<code>mean=</code>).</li>
      </ul>
      <p>In der Tabelle von <code>frequency()</code> rechnet <b>Raw %</b> mit allen Befragten, auch denen mit NA. <b>Valid %</b> rechnet nur mit gültigen Antworten. Fehlende Werte stehen unter „System“.</p>
      <InShort>Eine Variable mit genau zwei Ausprägungen heißt <b>dichotom</b> (oder binär). Man kodiert sie mit 0 und 1. Ihr Mittelwert ist der Anteil der Einsen, und diesen Anteil liest man als Wahrscheinlichkeit.</InShort>
      <MoreDetail summary="Warum Wählen die 1 ist">
        <p>In Sitzung 5 hast du <code>nichtwahl</code> andersherum gebildet (91 = 1). Heute ist Wählen die 1, weil das Modell später immer die Wahrscheinlichkeit der 1 vorhersagt. Welche Antwort die 1 bekommt, legst du selbst fest.</p>
      </MoreDetail>
      <Mixup>Die 0 heißt nicht „fehlt“. 0 ist eine gültige Antwort (würde nicht wählen). Wer keine gültige Antwort hat, ist NA und liegt nicht im Turm.</Mixup>
    </Card>

    <Card id="k1-kreuz" title="Kreuztabelle: der Anteil je Stufe" badge={<Bezug href="#a1-2">zu Schritt 3</Bezug>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">Schritt 3 fragt: Wie viel Prozent jeder Stufe Pflichtgefühl wollen wählen? Dafür braucht es zwei Dinge, eine umgepolte Skala und Zeilenprozent.</p>
      <Code k="a1k" />
      <Frage>Warum steht da <code>rec(pe09, rules = "rev")</code>?</Frage>
      <p><code>pe09</code> läuft von 1 = stimme voll zu bis 4 = stimme gar nicht zu. Ein höherer Wert hieße also weniger Pflichtgefühl, und das liest sich verkehrt herum. <code>rules = "rev"</code> dreht die Codes um (kennst du aus Sitzung 5): Aus 1 wird 4, aus 2 wird 3, aus 3 wird 2, aus 4 wird 1. Die neue Variable <code>pflicht</code> läuft von 1 = stimme gar nicht zu bis 4 = stimme voll zu. Die Antworten bleiben dieselben, nur ihre Zahlen laufen andersherum. Unter der Vorlage in der Aufgabe steht dazu eine kleine Tabelle.</p>
      <Frage>Und was zeigen die Zeilenprozent?</Frage>
      <p><code>crosstab(pflicht, waehlen, percentages = "row")</code> setzt die Stufen des Pflichtgefühls in die Zeilen. <code>row %</code> rechnet jede Zeile für sich auf 100 %: Von allen, die etwa „stimme eher zu“ sagen, wie viel Prozent würden wählen, wie viel nicht? So lassen sich die Stufen vergleichen, auch wenn sie verschieden groß sind. Die Zahl, die du suchst, steht jeweils in der Zeile <code>row %</code> unter „würde wählen“.</p>
      <InShort>Mit <b>Zeilenprozent</b> wird aus der Kreuztabelle der Anteil der Einsen je Stufe. Bei einer 0/1-Variable ist das je Stufe die Wahrscheinlichkeit, eine 1 zu haben.</InShort>
      <Mixup>Spaltenprozent statt Zeilenprozent lesen. Dann steht da, wie sich die Wählenden auf die Stufen verteilen, nicht, wie viele jeder Stufe wählen wollen.</Mixup>
    </Card>

    <Card id="k1-gerade" title="Warum eine Gerade scheitert" badge={<Bezug href="#a1-3">zu Schritt 4</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Schritt 4 rechnet, wie viele Prozentpunkte eine Stufe mehr Pflichtgefühl bringt. Die Vorlage zieht dazu zwei Prozentzahlen aus der Kreuztabelle voneinander ab, die größere zuerst. Was diese Schritte verraten, zeigt zuerst ein anderes Beispiel: Je älter, desto seltener das Smartphone? Teil die Internetnutzenden in sieben Altersgruppen und schau, welcher Anteil das Smartphone nennt.</p>
      <LineOrCurve />
      <Frage>Eine lineare Regression aus Sitzung 9 legt eine Gerade durch diese Anteile. Was sagt sie für 18-Jährige voraus?</Frage>
      <p>106,6 %, und für alle unter 32 Jahren mehr als 100 %. Mehr als alle geht nicht. Die Gerade läuft einfach weiter, weil sie überall gleich große Schritte annimmt.</p>
      <Frage>Warum werden die Schritte nach oben kleiner?</Frage>
      <p>Je näher ein Anteil an 100 % liegt, desto weniger Platz bleibt. Bei 99 % kann der Anteil höchstens noch um einen Prozentpunkt steigen. Das Bild zeigt es an vier ausgedachten Stufen; dasselbe Bild steht in der Aufgabe unter Schritt 3.</p>
      <Ceiling />
      <p>Brächte jede Stufe gleich viel wie die erste, läge die vierte über 100 %. Darum flachen Anteile oben ab und unten genauso: Sie folgen einer <b>S-Kurve</b>, keiner Geraden.</p>
      <InShort>Eine Gerade läuft endlos weiter, über 100 % und unter 0 %. Wahrscheinlichkeiten haben aber Grenzen. Darum nimmt man für eine 0/1-Variable eine <b>S-Kurve</b>: Sie nähert sich 0 und 100 % an, ohne sie zu überschreiten. Das Verfahren dazu heißt <b>logistische Regression</b>.</InShort>
      <MoreDetail summary="Prozentpunkte und was noch an der Geraden stört">
        <ul>
          <li>Prozentpunkte sind die Differenz zweier Prozentzahlen, etwa von 50 % auf 70 %: 20 Prozentpunkte. „20 % mehr“ hieße etwas anderes (20 % von 50).</li>
          <li>Die Residuen einer 0/1-Variable sind keine schöne Wolke um die Gerade: Jede Person liegt entweder auf der 0 oder auf der 1. Gleiche Fehlervarianz (Sitzung 9) ist damit verletzt.</li>
          <li>Die Zahlen der Geraden: Konstante 1,151, B −0,005 (genauer −0,00474), R² 0,084, gewichtet. Für 18 Jahre: 1,151 − 0,00474 × 18 = 1,066, also 106,6 %.</li>
        </ul>
      </MoreDetail>
      <Mixup>„Die Gerade passt im Großen und Ganzen, also ist sie gut genug.“ An den Rändern sagt sie Unmögliches voraus, und genau dort, nahe 0 oder 100 %, liegen viele Fragen der Sozialforschung, etwa die Wahlabsicht.</Mixup>
    </Card>

    <Card id="k1-sprachen" title="Drei Sprachen: Wahrscheinlichkeit, Chance, Logit" badge={<Bezug href="#a1-4">zu Schritt 5</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Schritt 5 rechnet einen Anteil in eine <b>Chance</b> um: Prozent „würde wählen“ geteilt durch Prozent „würde nicht wählen“, beides aus derselben Zeile der Kreuztabelle. Am Smartphone: Von 100 Internetnutzenden zwischen 70 und 79 nennen 77,7 das Smartphone, 22,3 nicht. Das kannst du auf drei Arten sagen.</p>
      <ThreeLanguages />
      <h6 className="zwischen">Übersetzer</h6>
      <p className="unter-zwischen">Stell eine Wahrscheinlichkeit ein und lies Chance und Logit ab. Mit den Pfeiltasten gehst du einen Prozentpunkt weiter, mit Bild auf und Bild ab zehn.</p>
      <Translator />
      <Frage>Eine Gruppe hat die Chance 4. Wie viel Prozent der Gruppe sagen Ja?</Frage>
      <p>Chance 4 heißt „4 zu 1“: Auf eine Person mit Nein kommen vier mit Ja. Das sind 4 von 5 Personen, also 80 %. Als Rechnung: Chance / (1 + Chance) = 4 / 5 = 0,8. Wer hier 400 % ausrechnet, hat die Chance als Vielfaches einer Wahrscheinlichkeit gelesen. Mehr als 100 % gibt es nicht.</p>
      <InShort>Die <b>Wahrscheinlichkeit</b> sagt, wie viele von 100 Ja sagen. Die <b>Chance</b> (englisch Odds) teilt Ja durch Nein: „3 zu 1“. Der <b>Logit</b> ist der Logarithmus der Chance. Er hat keine Grenzen nach oben und unten, und darum kann ein Modell in Logits mit einer Geraden rechnen.</InShort>
      <MoreDetail summary="Formel lesen lernen: die drei Übersetzungen">
        <ul>
          <li>Chance = p / (1 − p). Lies: Anteil Ja geteilt durch Anteil Nein. Mit Prozent geht es genauso: 77,7 / 22,3.</li>
          <li>Logit = ln(Chance). ln ist der natürliche Logarithmus. Du musst ihn nie selbst rechnen; merk dir drei Punkte: Chance 1 gibt Logit 0, Chance größer als 1 gibt einen positiven Logit, Chance kleiner als 1 einen negativen.</li>
          <li>Zurück: Chance = exp(Logit), Wahrscheinlichkeit = Chance / (1 + Chance). Das brauchst du in Aufgabe 3.</li>
          <li>Warum der Umweg? Die Wahrscheinlichkeit stößt bei 0 und 100 % an. Die Chance stößt nur unten an (sie wird nie kleiner als 0). Der Logit stößt nirgends an. Auf dieser offenen Skala darf eine Gerade endlos weiterlaufen.</li>
        </ul>
      </MoreDetail>
      <Mixup>Im Alltag heißt „Chance“ oft Wahrscheinlichkeit („die Chance liegt bei 80 %“). Hier ist die Chance immer ein Verhältnis Ja zu Nein in einer Gruppe: 80 % entsprechen der Chance 4. Sie ist auch kein Vergleich zweier Gruppen.</Mixup>
    </Card>

    <Card id="k1-ergebnis" title="Ergebnis festhalten: wo du was abliest" badge={<Bezug href="#a1-5">zu Schritt 6</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">In Schritt 6 hältst du sieben Dinge fest. Hier steht, wo du sie findest.</p>
      <ul className="v-liste">
        <li><b>Was mit anderen Antworten passiert:</b> die Regel in <code>rec()</code>, vor allem ihr letzter Teil (<a href="#k1-null-eins">Ein Turm aus Nullen und Einsen</a>).</li>
        <li><b>Wie viel Prozent wählen wollen:</b> die Ausgabe von Schritt 2, Spalte Valid %; dieselbe Zahl als Anteil steht bei <code>mean=</code>.</li>
        <li><b>Der Anteil bei „stimme gar nicht zu“:</b> die Kreuztabelle aus Schritt 3, Zeile <code>row %</code>, Spalte „würde wählen“.</li>
        <li><b>Die letzte Stufe und warum sie so wenig bringt:</b> deine Rechnung aus Schritt 4, und der Platz bis 100 % (<a href="#k1-gerade">Warum eine Gerade scheitert</a>).</li>
        <li><b>Die Chance und was sie heißt:</b> deine Rechnung aus Schritt 5 und die drei Sprachen (<a href="#k1-sprachen">Drei Sprachen</a>).</li>
      </ul>
      <p>Holst du die Ergebnisse ins Journal, steht dort deine Festlegung aus Schritt 1 daneben. Lag sie daneben, ist das kein Fehler, sondern genau der Moment, für den man vorher festlegt.</p>
    </Card>
  </Abschnitt>;
}

/* ---------- Aufgabe 2 ---------- */
export function Verstehen2() {
  return <Abschnitt id="g2" n={2} titel="Was heißt Exp(B) für das Pflichtgefühl?" frage="Wie stark hängt die Absicht zu wählen mit dem Pflichtgefühl zusammen, wenn man das politische Interesse berücksichtigt?"
    ziel="ein logistisches Modell gewichtet geschätzt und kannst in einem Satz sagen, was Exp(B) für das Pflichtgefühl und für das Interesse heißt, und warum nur gut die Hälfte der Befragten im Modell steckt."
    weg={[
      ['Schritt 1', '#a2-p', 'Erst festlegen: Mit welchem Faktor ändert sich die Chance?', 'k2-faktor'],
      ['Schritt 2', '#a2-1', 'das logistische Modell in R', 'k2-modell'],
      ['Schritt 2', '#a2-1', 'was das Modell rechnet: eine Gerade im Logit', 'k2-logit'],
      ['Schritt 2 und 3', '#a2-1', 'die Ausgabe lesen', 'k2-ausgabe'],
      ['Schritt 3', '#a2-2', 'das Interesse dazunehmen: bei gleichem Interesse', 'k2-zwei'],
      ['Schritt 4', '#a2-3', 'Exp(B) in Prozent', 'k2-faktor'],
      ['Schritt 5', '#a2-4', 'Deuten: ein Faktor für die Chance', 'k2-faktor'],
      ['Schritt 6', '#a2-5', 'Ergebnis festhalten: wo du was abliest', 'k2-ergebnis'],
    ]}>

    <Card id="k2-modell" title="Das Modell in R: logistic_regression()" badge={<Bezug href="#a2-1">zu Schritt 2</Bezug>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">Die Vorlage in Schritt 2 hat zwei Teile: Erst bildet sie die Variablen, dann schätzt sie das Modell.</p>
      <Code k="a2" />
      <ul className="v-liste">
        <li><code>mutate()</code> mit drei <code>rec()</code>: <code>waehlen</code> und <code>pflicht</code> wie in Aufgabe 1, dazu <code>interesse = rec(pa02a, rules = "rev")</code>. <code>pa02a</code> läuft von 1 = sehr stark bis 5 = überhaupt nicht; umgepolt heißt ein höherer Wert mehr Interesse.</li>
        <li><code>modell &lt;-</code> legt das Modell unter dem Namen <code>modell</code> ab, damit <code>summary()</code> es danach zeigen kann.</li>
        <li><code>logistic_regression(waehlen ~ pflicht, weights = wghtpew)</code> ist aufgebaut wie <code>linear_regression()</code> aus Sitzung 9: links von <code>~</code> die 0/1-Variable, rechts der Prädiktor, gewichtet.</li>
        <li>Die markierte Stelle <code>pflicht</code> änderst du in Schritt 3 (<a href="#k2-zwei">Zwei Prädiktoren</a>).</li>
      </ul>
      <InShort><code>logistic_regression()</code> schätzt ein Modell für eine Variable mit 0 und 1. Die Variablen bildet die Vorlage vorher selbst, mit <code>rec()</code> in <code>mutate()</code>.</InShort>
      <Mixup><code>logistic_regression()</code> mit <code>pv01</code> statt <code>waehlen</code>. R meldet dann „must be binary“: <code>pv01</code> hat viele Werte. Erst mit <code>rec()</code> eine 0/1-Variable bilden.</Mixup>
    </Card>

    <Card id="k2-logit" title="Eine Gerade im Logit, eine S-Kurve in Prozent" badge={<Bezug href="#a2-1">zu Schritt 2</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Was rechnet so ein Modell? Am Smartphone-Modell aus „R lesen“: In seiner Ausgabe stehen in der Spalte B zwei Zahlen, die Konstante 6,774 und für das Alter −0,076. Wie in Sitzung 9 ergeben sie eine Gerade, aber nicht in Prozent, sondern in Logits.</p>
      <FormulaLogit />
      <p className="unter-zwischen">Der Regler unter dem Bild geht in Schritten von zehn Jahren. Mit den Pfeiltasten gehst du zehn Jahre weiter.</p>
      <LogitAndCurve />
      <InShort>Die <b>logistische Regression</b> rechnet wie die lineare: Konstante + B × Wert. Heraus kommt aber ein <b>Logit</b>. Übersetzt in Wahrscheinlichkeiten wird aus der Geraden die S-Kurve aus Aufgabe 1.</InShort>
      <MoreDetail summary="Wie R die Zahlen findet">
        <ul>
          <li>Die lineare Regression sucht die Gerade mit den kleinsten quadrierten Residuen (Sitzung 9). Die logistische sucht die Zahlen, unter denen die beobachteten Nullen und Einsen am wahrscheinlichsten sind. Dieses Verfahren heißt <b>Maximum Likelihood</b>. Wie gut das gelingt, misst −2LL (Aufgabe 4).</li>
          <li>R rechnet mit mehr Stellen als den drei, die es zeigt (B genauer −0,0758). Rechnest du von Hand mit den gerundeten Zahlen, weicht das Ergebnis leicht ab: für 80 Jahre 66,7 % statt 67,0 % aus <code>predict()</code>.</li>
        </ul>
      </MoreDetail>
      <Mixup>B ist hier keine Änderung in Prozent. −0,076 heißt: Der Logit sinkt je Lebensjahr um 0,076. Was das in Prozent bedeutet, hängt vom Alter ab (Aufgabe 3).</Mixup>
    </Card>

    <Card id="k2-ausgabe" title="Die Ausgabe lesen" badge={<Bezug href="#a2-1">zu Schritt 2 und 3</Bezug>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead"><code>summary()</code> zeigt viele Tabellen. Für das Deuten brauchst du zuerst drei Stellen. Die übrigen (Model Summary, Classification Table) kommen in Aufgabe 4. Hier am Smartphone-Modell:</p>
      <ReadOutput />
      <Frage>Warum stecken im Modell weniger Personen, als befragt wurden?</Frage>
      <p>Ein Modell nutzt nur Personen, die bei allen Variablen des Modells eine gültige Antwort haben. Wer bei einer fehlt, fällt ganz heraus, auch wenn die anderen Antworten da sind. Beim Smartphone-Modell stecken darum nur Internetnutzende darin, denn <code>lm30</code> wird nur ihnen gestellt. Für dein Modell lohnt der Blick zurück auf Aufgabe 1: Welche der Fragen wurde nicht allen gestellt, und wer hat bei der Wahlabsicht keine gültige Antwort?</p>
      <InShort>Erst nachsehen, wofür die 1 steht. Dann je Prädiktor B (Richtung), Sig. (signifikant?) und Exp(B) (Faktor für die Chance) lesen. <code>N:</code> oben ist die gewichtete Zahl der Fälle im Modell.</InShort>
      <Mixup>Exp(B) der Konstante wird als „Effekt“ gelesen. Die Konstante ist kein Prädiktor; ihr Exp(B) ist nur die Chance beim Wert 0 aller Prädiktoren.</Mixup>
    </Card>

    <Card id="k2-zwei" title="Zwei Prädiktoren: bei gleichem Interesse" badge={<Bezug href="#a2-2">zu Schritt 3</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">In Schritt 3 änderst du im Journal nur eine Stelle deines Blocks aus Schritt 2: Aus <code>waehlen ~ pflicht</code> wird <code>waehlen ~ pflicht + interesse</code>. Mehrere Prädiktoren mit <code>+</code> kennst du aus Sitzung 10.</p>
      <Frage>Was heißt Exp(B) des Pflichtgefühls, wenn das Interesse im Modell ist?</Frage>
      <p>Dann vergleicht es Menschen mit <b>gleichem Interesse</b>, die sich im Pflichtgefühl um eine Stufe unterscheiden. Genau so hast du in Sitzung 10 B in der multiplen Regression gelesen: „bei gleichen Werten der anderen Prädiktoren“. Sinkt Exp(B) eines Prädiktors, wenn ein zweiter dazukommt, geht meist ein Teil des Zusammenhangs auf den zweiten zurück.</p>
      <Frage>Warum zuerst „Dependent Variable Encoding“?</Frage>
      <p>Weil dort steht, wofür das Modell die Wahrscheinlichkeit vorhersagt: für die Antwort mit dem Internal Value 1. Alle Zahlen darunter sprechen über diese Antwort. Wäre die 1 andersherum kodiert, drehten sich alle Vorzeichen um, und Exp(B) würde zum Kehrwert.</p>
      <InShort>Bei zwei Prädiktoren gilt jedes Exp(B) <b>bei gleichem Wert des anderen</b>. In der Ausgabe stehen dann zwei Zeilen unter „Variables in the Equation“, eine je Prädiktor.</InShort>
      <Mixup>Exp(B) deutlich unter 1, etwa 0,27, obwohl mehr Pflichtgefühl mit mehr Wahlabsicht einhergehen sollte. Dann ist etwas andersherum: Ist „würde wählen“ die 1, und sind <code>pe09</code> und <code>pa02a</code> umgepolt?</Mixup>
    </Card>

    <Card id="k2-faktor" title="Exp(B): ein Faktor für die Chance" badge={<Bezug href="#a2-3">zu Schritt 1, 4 und 5</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Neben B steht Exp(B). Das ist e hoch B; mit <code>exp(-0.076)</code> siehst du es in „R lesen“. Beim Smartphone-Modell ist Exp(B) = 0,927: Mit jedem Lebensjahr wird die Chance, das Smartphone zu nennen, mit 0,927 malgenommen. In Schritt 1 schätzt du genau so einen Faktor für das Pflichtgefühl.</p>
      <Factor />
      <ExpBTable />
      <Frage>Und wie viel Prozent sind das? (Schritt 4)</Frage>
      <FormulaPercent />
      <p>Die Vorlage in Schritt 4 rechnet genau diese Formel mit dem Smartphone-Beispiel. Die markierte Zahl tauschst du gegen Exp(B) des Interesses:</p>
      <Code k="a2r" />
      <Frage>Bei einem anderen Modell steht Exp(B) = 2. Verdoppelt sich dann die Wahrscheinlichkeit? (Schritt 5)</Frage>
      <p>Nein, die Chance verdoppelt sich je Einheit. Bei 50 % (Chance 1) wird daraus Chance 2, also 67 %, nicht 100 %. Eine Wahrscheinlichkeit von 60 % kann sich gar nicht verdoppeln, das wären 120 %. Exp(B) ist auch keine Differenz in Prozentpunkten: Es ist ein Faktor, also ein „mal“, kein „plus“.</p>
      <InShort><b>Exp(B)</b>, auch <b>Odds Ratio</b> oder Chancenverhältnis, sagt, mit welchem Faktor sich die Chance ändert, wenn der Prädiktor um eine Einheit steigt. Über 1 heißt: die Chance steigt; unter 1: sie sinkt; genau 1: kein Zusammenhang.</InShort>
      <MoreDetail summary="Zwei Schreibweisen für denselben Zusammenhang">
        <ul>
          <li>B und Exp(B) sagen dasselbe in zwei Sprachen: B in Logits (plus), Exp(B) in Chancen (mal). Ein Logit-Schritt von −0,076 entspricht dem Faktor 0,927.</li>
          <li>Neben Exp(B) steht ein 95-%-Konfidenzintervall (kennst du aus Sitzung 7), beim Alter 0,919 bis 0,935. Liegt die 1 nicht darin, ist der Zusammenhang signifikant; dasselbe zeigt die Spalte Sig. Die Spalte Wald enthält die Prüfgröße dazu.</li>
          <li>Warum Odds <b>Ratio</b>? Exp(B) ist das Verhältnis zweier Chancen: die Chance bei einer Einheit mehr geteilt durch die Chance davor. Für zehn Jahre: Chance mit 40 geteilt durch Chance mit 30, 41,8 / 89,5 = 0,47.</li>
          <li>Die Konstante hat auch ein Exp(B), hier 874,684: die Chance bei Alter 0. Weil es keine Befragten mit 0 Jahren gibt, deutet man sie nicht.</li>
        </ul>
      </MoreDetail>
      <Mixup>„Exp(B) = 0,927 heißt: Die Wahrscheinlichkeit sinkt um 7,3 % je Jahr.“ Es ist die Chance, nicht die Wahrscheinlichkeit. Wie stark sich die Wahrscheinlichkeit ändert, hängt davon ab, wo jemand auf der S-Kurve steht (Aufgabe 3).</Mixup>
    </Card>

    <Card id="k2-ergebnis" title="Ergebnis festhalten: wo du was abliest" badge={<Bezug href="#a2-5">zu Schritt 6</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">Alle Fragen in Schritt 6 beziehen sich auf das Modell mit beiden Prädiktoren, also nach Schritt 3.</p>
      <ul className="v-liste">
        <li><b>Wofür das Modell vorhersagt:</b> „Dependent Variable Encoding“, die Antwort mit dem Internal Value 1 (<a href="#k2-zwei">Zwei Prädiktoren</a>).</li>
        <li><b>Exp(B) des Pflichtgefühls:</b> „Variables in the Equation“, Zeile <code>pflicht</code>, Spalte Exp(B). Nicht B, und nicht das Modell aus Schritt 2.</li>
        <li><b>Der richtige Satz:</b> Faktor für die Chance, bei gleichem Interesse (<a href="#k2-faktor">Exp(B): ein Faktor</a>).</li>
        <li><b>Das Interesse in Prozent:</b> deine Rechnung aus Schritt 4.</li>
        <li><b>Warum so wenige im Modell:</b> wer bei einer der drei Variablen fehlt, fällt heraus (<a href="#k2-ausgabe">Die Ausgabe lesen</a>).</li>
      </ul>
    </Card>
  </Abschnitt>;
}

/* ---------- Aufgabe 3 ---------- */
export function Verstehen3() {
  return <Abschnitt id="g3" n={3} titel="Was heißt das in Prozent?" frage="Was bringt eine Stufe mehr Pflichtgefühl, in Prozent ausgedrückt, und bringt sie allen gleich viel?"
    ziel="für zwei Beispielpersonen vorhergesagt, wie wahrscheinlich sie wählen wollen, mit und ohne eine Stufe mehr Pflichtgefühl, und kannst erklären, warum derselbe Faktor verschieden viele Prozentpunkte bringt. Du kennst den AME als eine Zahl für alle."
    weg={[
      ['Schritt 1', '#a3-p', 'Erst festlegen: Bei wem bringt eine Stufe mehr Prozentpunkte?', 'k3-zwei-schritte'],
      ['Schritt 2', '#a3-1', 'Person A von Hand: Logit, Chance, Wahrscheinlichkeit', 'k3-rueckweg'],
      ['Schritt 3', '#a3-2', 'vier Personen mit tibble() und predict()', 'k3-predict'],
      ['Schritt 3', '#a3-2', 'gleicher Faktor, verschiedene Prozentpunkte', 'k3-zwei-schritte'],
      ['Schritt 4', '#a3-3', 'eine Zahl für alle: der AME', 'k3-ame'],
      ['Schritt 5', '#a3-4', 'Ergebnis festhalten: wo du was abliest', 'k3-ergebnis'],
      ['Schritt 6', '#a3-5', 'im Bild: Person A und Person B', 'k3-ergebnis'],
    ]}>

    <Card id="k3-rueckweg" title="Vom Logit zurück zur Wahrscheinlichkeit" badge={<Bezug href="#a3-1">zu Schritt 2</Bezug>} tag={{ kind: 'interpret', label: 'Formel lesen lernen' }}>
      <p className="lead">Wie wahrscheinlich nennt eine 70-Jährige, die das Internet nutzt, das Smartphone? Das Modell beantwortet das in drei Schritten, genau die drei Sprachen aus Aufgabe 1, nur rückwärts.</p>
      <WayBack />
      <Frage>Und wie sieht das für Person A aus?</Frage>
      <p>Genauso, nur mit zwei Prädiktoren: Jeder bekommt sein eigenes „+ B × Wert“. Die Vorlage in Schritt 2 schreibt die drei Schritte als drei Zeilen:</p>
      <Code k="a3h" />
      <ul className="v-liste">
        <li><code>logit &lt;- -2.154 + 1.326 * … + 0.340 * …</code>: Konstante, dann B des Pflichtgefühls mal seinen Wert, dann B des Interesses mal seinen Wert. Die erste markierte Stelle ist das Pflichtgefühl, die zweite das Interesse.</li>
        <li><code>chance &lt;- exp(logit)</code>: <code>exp()</code> rechnet „e hoch“ und macht aus dem Logit die Chance.</li>
        <li><code>chance / (1 + chance)</code>: die Wahrscheinlichkeit, als Anteil.</li>
        <li>Die Zeilen, in denen nur <code>logit</code> oder <code>chance</code> steht, zeigen das Zwischenergebnis. So gibt R nacheinander drei Zahlen aus.</li>
      </ul>
      <p>Lässt du 1 und 1 stehen, kommen etwa −0,488, 0,614 und 0,380 heraus: Von 100 Menschen, die gar nicht zustimmen und sich überhaupt nicht interessieren, wollen laut Modell etwa 38 wählen. So kannst du prüfen, ob die Vorlage läuft, bevor du Person A einsetzt.</p>
      <InShort>Eine <b>vorhergesagte Wahrscheinlichkeit</b> rechnest du in drei Schritten: Logit aus Konstante und B, mit <code>exp()</code> zur Chance, dann Chance durch 1 plus Chance.</InShort>
      <MoreDetail summary="Was eine vorhergesagte Wahrscheinlichkeit nicht ist">
        <ul>
          <li>81,1 % heißt nicht, dass eine bestimmte 70-Jährige zu 81 % ein Smartphone nutzt. Gemeint ist: Von 100 Internetnutzenden dieses Alters nennen laut Modell etwa 81 das Smartphone. Über Menschen ohne Internet sagt das Modell nichts.</li>
          <li>Von Hand rechnest du mit den gerundeten Zahlen der Ausgabe. <code>predict()</code> rechnet mit allen Stellen; darum weichen beide in der letzten Stelle leicht voneinander ab.</li>
        </ul>
      </MoreDetail>
      <Mixup>Die Chance 4,28 als Wahrscheinlichkeit lesen. Wahrscheinlichkeiten liegen zwischen 0 und 1; 4,28 heißt „4,28 zu 1“, also 81,1 %.</Mixup>
    </Card>

    <Card id="k3-predict" title="Beispielpersonen mit tibble() und predict()" badge={<Bezug href="#a3-2">zu Schritt 3</Bezug>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">Von Hand geht es für eine Person. Für vier Personen auf einmal lässt du R rechnen. Die Vorlage in Schritt 3 schätzt das Modell wie in Aufgabe 2 und baut dann die Personen als kleine Tabelle.</p>
      <Code k="a3p" />
      <ul className="v-liste">
        <li><code>tibble()</code> baut eine Tabelle von Hand. Jede Zeile ist eine Person, jede Spalte ein Prädiktor.</li>
        <li><code>c()</code> zählt die Werte einer Spalte auf, einen je Person. Vier Personen heißt: in jedem <code>c()</code> vier Zahlen. Die erste Zahl in <code>pflicht</code> gehört zur ersten Zahl in <code>interesse</code>.</li>
        <li>Die Spalten heißen genau wie die Prädiktoren im Modell, hier <code>pflicht</code> und <code>interesse</code>. Sonst findet <code>predict()</code> sie nicht.</li>
        <li><code>predict(newdata = profile, type = "response")</code> sagt für jede Person die Wahrscheinlichkeit einer 1 vorher, mit ungerundeten Zahlen.</li>
      </ul>
      <Frage>Wie liest du die Ausgabe?</Frage>
      <p>Über den Zahlen stehen 1 bis 4: die erste bis vierte Person. Darunter stehen Anteile. Beim Smartphone-Modell aus „R lesen“ kommt für 30 und 80 Jahre <code>0.9890025 0.6698802</code> heraus, also 98,9 % und 67,0 %. Wie viele Prozentpunkte dazwischen liegen, rechnest du als Differenz mal 100: (0,9890 − 0,6699) × 100 = 31,9.</p>
      <InShort><code>tibble()</code> mit <code>c()</code> baut Beispielpersonen, <code>predict(…, type = "response")</code> gibt ihre Wahrscheinlichkeiten. Prozentpunkte sind die Differenz zweier Wahrscheinlichkeiten, mal 100.</InShort>
      <Mixup><code>predict()</code> ohne <code>type = "response"</code>. Dann steht bei der 30-Jährigen 4.499 statt 0.989: Das ist ihr Logit, keine Wahrscheinlichkeit.</Mixup>
    </Card>

    <Card id="k3-zwei-schritte" title="Gleicher Faktor, verschiedene Prozentpunkte" badge={<Bezug href="#a3-2">zu Schritt 1 und 3</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Zwei Internetnutzende werden zehn Jahre älter, zum Beispiel: eine Person von 30 auf 40, eine von 70 auf 80. Für beide wird die Chance mit 0,47 malgenommen (<a href="#k2-faktor">Exp(B): ein Faktor</a>). Verlieren beide gleich viel? Klick dich durch.</p>
      <ZweiSchritte />
      <Frage>Bei wem sinkt die Wahrscheinlichkeit um mehr Prozentpunkte?</Frage>
      <p>Bei der 70-Jährigen, und zwar zwölfmal so stark: −14,4 statt −1,2 Prozentpunkte. Der Logit sinkt bei beiden um 0,76, die Chance wird bei beiden mit 0,47 malgenommen. Oben auf der S-Kurve ist sie flach, in der Mitte steil. Für deine Festlegung hilft die Frage, wo eine Person vor dem Schritt steht.</p>
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

    <Card id="k3-ame" title="Eine Zahl im Mittel: der AME" badge={<Bezug href="#a3-3">zu Schritt 4</Bezug>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">Wenn jeder Mensch eine andere Änderung in Prozentpunkten hat, welche Zahl berichtest du dann? Man kann sie mitteln: Für jede Person im Modell schaut R, wie steil die S-Kurve an ihrer Stelle ist, also wie stark sich ihre Wahrscheinlichkeit bei einem kleinen Schritt ändert, umgerechnet auf eine Einheit. Dann bildet R den gewichteten Durchschnitt.</p>
      <Code k="a3m" />
      <p className="absatz">Die Vorlage schätzt das Modell wie in Aufgabe 2 und reicht es mit <code>%&gt;%</code> an <code>marginal_effects()</code> weiter; <code>summary()</code> zeigt das Ergebnis als Tabelle mit der Spalte AME, eine Zeile je Prädiktor. Beim Smartphone-Modell steht dort −0.005: Im Mittel über alle Internetnutzenden im Modell sinkt die Wahrscheinlichkeit je Lebensjahr um etwa 0,5 Prozentpunkte. Für die 30-Jährige waren es über zehn Jahre nur 1,2 Punkte, für die 70-Jährige 14,4: Der AME ist ein Mittelwert, kein Wert für alle.</p>
      <InShort>Der <b>durchschnittliche marginale Effekt (AME)</b> sagt in Prozentpunkten, wie stark sich die Wahrscheinlichkeit je Einheit im Mittel über alle Befragten im Modell ändert. R zeigt ihn als Anteil: −0.005 heißt −0,5 Prozentpunkte.</InShort>
      <MoreDetail summary="Wann welcher Wert?">
        <ul>
          <li>Exp(B): für den Vergleich von Chancen, unabhängig vom Ausgangspunkt. Vorhergesagte Wahrscheinlichkeiten: für Beispielpersonen, am verständlichsten. AME: eine Zahl in Prozentpunkten für alle zusammen.</li>
          <li>Neben dem AME stehen Standardfehler, Sig. (Spalte p) und ein Konfidenzintervall, wie bei B.</li>
          <li>Genau genommen ist der AME die mittlere Steigung der S-Kurve. Für kleine Schritte wie ein Lebensjahr ist das fast dasselbe wie „ein Jahr mehr“. Bei großen Schritten, etwa einer ganzen Stufe einer Skala mit vier Stufen, ist er nur eine Annäherung: Weil die Kurve oben abflacht, bringt eine ganze Stufe dort meist etwas weniger, als der AME sagt.</li>
          <li>„Factor rows show the average discrete change …“ unter der Tabelle betrifft nur Prädiktoren, die als Gruppen ins Modell gehen. Hier gibt es keine.</li>
        </ul>
      </MoreDetail>
      <Mixup>Den AME für jede Person anwenden. Er ist ein Durchschnitt: Bei manchen ist die Änderung viel kleiner, bei anderen viel größer.</Mixup>
    </Card>

    <Card id="k3-ergebnis" title="Ergebnis festhalten: wo du was abliest" badge={<Bezug href="#a3-4">zu Schritt 5 und 6</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">Die Fragen in Schritt 5 folgen den drei Vorlagen.</p>
      <ul className="v-liste">
        <li><b>Chance und Wahrscheinlichkeit von Person A:</b> die zweite und dritte Zahl der Ausgabe von Schritt 2. Die Wahrscheinlichkeit steht als Anteil da; gefragt ist Prozent (<a href="#k3-rueckweg">Vom Logit zurück</a>).</li>
        <li><b>Prozentpunkte bei A und bei B:</b> die vier Anteile aus Schritt 3, Person 2 minus Person 1 und Person 4 minus Person 3, mal 100 (<a href="#k3-predict">Beispielpersonen</a>).</li>
        <li><b>Was bei beiden gleich ist:</b> die drei Sprachen. In welcher wirkt ein Prädiktor überall gleich (<a href="#k3-zwei-schritte">Gleicher Faktor</a>)?</li>
        <li><b>Der AME:</b> Schritt 4, Zeile <code>pflicht</code>, Spalte AME, mal 100.</li>
        <li><b>Ein Satz für Leserinnen ohne Statistik:</b> Welche der Zahlen aus Schritt 2 bis 4 verstehen sie, und für wen gilt sie? (<a href="#k3-ame">Der AME</a>)</li>
      </ul>
      <p>Das Bild in Schritt 6 erscheint erst nach dem Prüfen. Es zeigt die S-Kurven von A und B über die vier Stufen des Pflichtgefühls und, wie weit jede Person mit ihrer zusätzlichen Stufe nach oben kommt. Danach fragt das Plenum, welche der Zahlen in eine Pressemitteilung gehört.</p>
    </Card>
  </Abschnitt>;
}

/* ---------- Aufgabe 4 ---------- */
export function Verstehen4() {
  return <Abschnitt id="g4" n={4} titel="Erkennt das Modell, wer nicht wählen will?" frage="Wie gut sagen Pflichtgefühl und Interesse die Wahlabsicht vorher?"
    ziel="die Trefferquote des Modells mit der einfachsten Regel verglichen, das −2LL des Nullmodells ausgerechnet und kannst Nagelkerke R² richtig in einen Satz bringen."
    weg={[
      ['Schritt 1', '#a4-p', 'Erst festlegen: Wie gut sind 95 von 100 Treffern?', 'k4-treffer'],
      ['Schritt 2', '#a4-1', 'die Güte-Tabellen in summary()', 'k4-tabellen'],
      ['Schritt 3', '#a4-2', 'die Regel „alle wählen“: besser als Raten?', 'k4-treffer'],
      ['Schritt 4', '#a4-3', '−2LL des Nullmodells', 'k4-2ll'],
      ['Schritt 5', '#a4-4', 'Ergebnis festhalten: Pseudo-R²', 'k4-pseudo'],
      ['Schritt 5', '#a4-4', 'Ergebnis festhalten: was in den Bericht gehört', 'k4-ergebnis'],
    ]}>

    <Card id="k4-tabellen" title="Drei Tabellen für die Güte" badge={<Bezug href="#a4-1">zu Schritt 2</Bezug>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">Die Vorlage in Schritt 2 ist das Modell aus Aufgabe 2 mit <code>summary()</code>. Neu ist nur der Blick: nicht auf die Prädiktoren, sondern auf drei Tabellen, die sagen, wie gut das Modell als Ganzes ist.</p>
      <Code k="a4" />
      <ul className="v-liste">
        <li><b>Classification Table:</b> beobachtet gegen vorhergesagt. Das Modell sagt „Ja“, wenn die vorhergesagte Wahrscheinlichkeit über 50 % liegt. Je Zeile steht unter <b>% Correct</b>, wie oft es bei dieser Antwort richtig liegt; <b>Overall Percentage</b> ist die Trefferquote insgesamt.</li>
        <li><b>Model Summary:</b> −2 Log Likelihood und drei Pseudo-R² (Cox &amp; Snell, Nagelkerke, McFadden).</li>
        <li><b>Omnibus Tests:</b> Chi-square und Sig., der Vergleich mit einem Modell ohne Prädiktoren.</li>
      </ul>
      <InShort>Die Güte eines logistischen Modells steht in drei Tabellen: Treffer (Classification Table), Abstand zu den Daten (−2LL, Pseudo-R²) und der Test gegen das Nullmodell (Omnibus).</InShort>
    </Card>

    <Card id="k4-treffer" title="Trefferquote: besser als Raten?" badge={<Bezug href="#a4-2">zu Schritt 1 und 3</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Das Smartphone-Modell meldet „Accuracy = 91.4%“: Bei 91,4 % der Internetnutzenden im Modell liegt es richtig. Klingt gut. Aber wie oft läge man richtig, wenn man einfach für alle „Ja“ sagt?</p>
      <HitRate />
      <Frage>Wie viele der 415 Internetnutzenden (gewichtet), die das Smartphone nicht nennen, erkennt das Modell?</Frage>
      <p>Fast keine: 4 von 415 (0,9 %). Für fast alle Internetnutzenden liegt die vorhergesagte Wahrscheinlichkeit über 50 %, also sagt das Modell „Ja“. Nur bei den Ältesten fällt sie unter 50 % (ab etwa 90 Jahren).</p>
      <Frage>Wie rechnet die Vorlage in Schritt 3 die Regel „alle Ja“?</Frage>
      <p>Wer allen „Ja“ gibt, liegt genau bei denen richtig, die wirklich Ja sagen: die beiden Zellen ihrer Zeile. Geteilt wird durch alle vier Zellen, das ist N oben in der Ausgabe. Beim Smartphone-Beispiel:</p>
      <Code k="a4r" />
      <p>Für dein Modell tauschst du die drei Zahlen gegen die Zellen deiner Classification Table: oben die Zeile „würde wählen“, unten die Summe aller vier Zellen.</p>
      <InShort>Die <b>Trefferquote</b> (Classification Table, Overall Percentage) zählt, wie oft das Modell mit der Schwelle 50 % richtig liegt. Ist eine Antwort selten, trifft schon die Regel „alle bekommen die häufige Antwort“ fast genauso oft. Vergleich die Trefferquote darum immer mit dieser Regel.</InShort>
      <MoreDetail summary="Warum ein Modell trotzdem nützt">
        <ul>
          <li>Das Modell sagt nicht nur Ja oder Nein, sondern Wahrscheinlichkeiten: 99,6 % mit 18 Jahren, 67,0 % mit 80 (aus <code>predict()</code>). Diese Unterschiede gehen in der Trefferquote verloren, weil beide über 50 % liegen.</li>
          <li>Die Zahlen der Tabelle sind gewichtet und gerundet; daraus nachgerechnete Prozente können um ein Zehntel abweichen.</li>
        </ul>
      </MoreDetail>
      <Mixup>„91 % richtig, also ein sehr gutes Modell.“ Bei seltenen Antworten sagt die Trefferquote wenig. Ob das Modell etwas erklärt, zeigen −2LL und Pseudo-R².</Mixup>
    </Card>

    <Card id="k4-2ll" title="−2LL und der Omnibus-Test" badge={<Bezug href="#a4-3">zu Schritt 4</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Das Modell sucht die Zahlen, unter denen die beobachteten Antworten am wahrscheinlichsten sind (Maximum Likelihood, <a href="#k2-logit">Gerade im Logit</a>). −2LL (−2 Log Likelihood) misst, wie schlecht die geschätzten Wahrscheinlichkeiten dann noch zu den beobachteten Nullen und Einsen passen: 0 hieße perfekt, kleiner ist besser. Zum Vergleich braucht man ein <b>Nullmodell</b>, das nur die Konstante kennt und allen denselben Anteil vorhersagt.</p>
      <MinusTwoLL />
      <FormulaNull />
      <p>Genau diese Addition rechnet die Vorlage in Schritt 4, mit dem Smartphone-Beispiel:</p>
      <Code k="a4l" />
      <p>Für dein Modell nimmst du −2 Log Likelihood aus der Model Summary und Chi-square aus den Omnibus Tests.</p>
      <InShort><b>−2LL</b> misst, wie schlecht das Modell die Antworten trifft: kleiner ist besser. Der <b>Omnibus-Test</b> prüft, ob das Modell −2LL gegenüber dem Nullmodell deutlich senkt (Chi-square, Sig.). Ist Sig. &lt; .05, verbessern die Prädiktoren zusammen das Modell mehr, als durch Zufall zu erwarten wäre.</InShort>
      <MoreDetail summary="Hosmer-Lemeshow-Test">
        <p>In der Ausgabe steht noch ein Test, der prüft, ob die vorhergesagten Wahrscheinlichkeiten in Gruppen zu den beobachteten Anteilen passen. Beim Smartphone-Modell ist er unauffällig (Sig. .378): Die S-Kurve passt zu den Altersgruppen. Ein Sig. unter .05 hieße: Irgendwo weicht das Modell ab, etwa weil ein Prädiktor nicht gleichmäßig wirkt. Bei sehr vielen Befragten schlägt er aber schnell an.</p>
      </MoreDetail>
      <Mixup>−2LL für sich allein deuten. Die Zahl hängt von der Zahl der Fälle ab. Aussagekräftig ist nur der Vergleich mit dem Nullmodell.</Mixup>
    </Card>

    <Card id="k4-pseudo" title="Pseudo-R²" badge={<Bezug href="#a4-4">zu Schritt 5</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">In der Model Summary stehen drei Pseudo-R², beim Smartphone-Modell Cox &amp; Snell 0,090, Nagelkerke 0,203, McFadden 0,161. Alle drei liegen zwischen 0 und 1 und sind größer, je mehr das Modell −2LL senkt. Am häufigsten berichtet man <b>Nagelkerke R²</b>; die Kopfzeile zeigt nur diesen.</p>
      <Frage>Darf man Nagelkerke R² lesen wie R² aus Sitzung 9?</Frage>
      <p>Nein. „Nagelkerke 0,203 heißt: Das Alter erklärt 20 % der Smartphone-Nutzung“ wäre falsch. So darf man R² der linearen Regression lesen, Pseudo-R² nicht. Richtig ist: „Das Modell passt deutlich besser als ohne Alter; Nagelkerke R² = 0,20.“</p>
      <InShort><b>Pseudo-R²</b> ist für die logistische Regression, was R² für die lineare ist: eine Zahl von 0 bis 1 für die Güte. Aber es ist <b>kein Anteil erklärter Varianz</b>. Als grobe Faustregel gilt Nagelkerke ab 0,2 als brauchbar, ab 0,4 als gut; eine harte Grenze gibt es nicht.</InShort>
      <MoreDetail summary="Warum drei Zahlen?">
        <ul>
          <li>McFadden: um welchen Anteil −2LL gegenüber dem Nullmodell sinkt (<a href="#k4-2ll">−2LL</a>). Cox &amp; Snell: ähnlich, kann aber 1 nie erreichen. Nagelkerke: Cox &amp; Snell, so gestreckt, dass 1 möglich ist.</li>
          <li>Pseudo-R² verschiedener Modelle vergleicht man nur bei derselben abhängigen Variable und denselben Befragten.</li>
        </ul>
      </MoreDetail>
    </Card>

    <Card id="k4-ergebnis" title="Ergebnis festhalten: wo du was abliest" badge={<Bezug href="#a4-4">zu Schritt 5</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <ul className="v-liste">
        <li><b>Trefferquote:</b> Classification Table, Overall Percentage. Nicht die Zeile einer einzelnen Antwort.</li>
        <li><b>Regel „alle wählen“:</b> deine Rechnung aus Schritt 3, an denselben Befragten wie das Modell, also mit den Zellen der Classification Table.</li>
        <li><b>Wer nicht wählen will:</b> Classification Table, Zeile „würde nicht wählen“, Spalte % Correct.</li>
        <li><b>−2LL des Nullmodells:</b> deine Rechnung aus Schritt 4.</li>
        <li><b>Nagelkerke R² und der Bericht:</b> <a href="#k4-pseudo">Pseudo-R²</a> und <a href="#k4-treffer">Trefferquote</a>.</li>
      </ul>
    </Card>
  </Abschnitt>;
}

/* ---------- Überblick ---------- */
export function Ueberblick() {
  return <section className="grund-block" id="g5" aria-labelledby="g5-h">
    <div className="g-kopf">
      <span className="st m c7" aria-hidden="true">✓</span>
      <div><div className="ueber">Überblick über alle Aufgaben</div><h4 id="g5-h">Logistische Regression lesen</h4></div>
    </div>
    <p className="g-intro">Alle vier Aufgaben zusammen: welche Zahl in welcher Sprache spricht, wann man logistisch rechnet und was ein Modell braucht.</p>
    <HeadingLevel.Provider value={5}>
      <Card id="k5-sprachen" title="Drei Sprachen, eine Zahl" badge={<Badge>Aufgabe 2 und 3</Badge>} tag={{ kind: 'interpret', label: 'Hintergrund' }}>
        <p className="lead">Ein logistisches Modell gibt dir denselben Zusammenhang in mehreren Sprachen. Am Smartphone-Modell:</p>
        <table className="daten voll">
          <caption>Drei Sprachen, eine Zahl: das Alter im Smartphone-Modell</caption>
          <thead><tr><th scope="col">Sprache</th><th scope="col">Zahl in der Ausgabe</th><th scope="col">Alter im Smartphone-Modell</th><th scope="col">gilt für alle gleich?</th></tr></thead>
          <tbody>
            <tr><td>Logit</td><td>B</td><td>− 0,076 je Lebensjahr</td><td>ja</td></tr>
            <tr><td>Chance</td><td>Exp(B)</td><td>× 0,927 je Lebensjahr, × 0,47 je zehn Jahre</td><td>ja</td></tr>
            <tr><td>Wahrscheinlichkeit</td><td><code>predict()</code></td><td>zehn Jahre älter: − 1,2 Prozentpunkte (von 30 auf 40), − 14,4 (von 70 auf 80)</td><td>nein, hängt vom Ausgangspunkt ab</td></tr>
            <tr><td>Wahrscheinlichkeit im Mittel</td><td>AME</td><td>mittlere Steigung: − 0,5 Prozentpunkte je Lebensjahr</td><td>Mittelwert über alle im Modell</td></tr>
          </tbody>
        </table>
        <p className="absatz">Alle Zahlen stammen aus demselben Modell, und alle sind richtig. Wer eine Zahl berichtet, sagt dazu, in welcher Sprache sie spricht. Für Laien am verständlichsten: Wahrscheinlichkeiten für Beispielpersonen oder der AME in Prozentpunkten.</p>
      </Card>

      <Card id="k5-welche" title="Welches Regressionsmodell?" badge={<Badge>linear oder logistisch</Badge>} tag={{ kind: 'interpret', label: 'Hintergrund' }}>
        <WhichRegression />
        <p className="hilfe-zeile">Mehr als zwei ungeordnete oder geordnete Stufen (etwa die Parteiwahl): eigene Verfahren (multinomiale, ordinale Regression), nicht Teil dieses Kurses. Oft fasst man vorher mit <code>rec()</code> zu zwei Gruppen zusammen, wie bei <code>waehlen</code> in Aufgabe 1.</p>
      </Card>

      <Card id="k5-voraus" title="Voraussetzungen" badge={<Badge>für alle Aufgaben</Badge>} tag={{ kind: 'interpret', label: 'Hintergrund' }}>
        <table className="daten voll">
          <caption>Voraussetzungen der logistischen Regression</caption>
          <thead><tr><th scope="col">Voraussetzung</th><th scope="col">heißt</th><th scope="col">prüfen</th><th scope="col">in dieser Sitzung</th></tr></thead>
          <tbody>
            <tr><td>Abhängige Variable 0/1</td><td>genau zwei Ausprägungen, richtig kodiert</td><td>„Dependent Variable Encoding“: Was ist die 1?</td><td><code>waehlen</code>: 1 = würde wählen, 0 = würde nicht wählen, alles andere NA</td></tr>
            <tr><td>Genug Fälle in der selteneren Gruppe</td><td>Faustregel: mindestens 10 Fälle der selteneren Ausprägung je Prädiktor</td><td><code>frequency()</code> der abhängigen Variable im Modell</td><td>146 Befragte, die nicht wählen wollen (gezählt), bei 2 Prädiktoren</td></tr>
            <tr><td>Gleichmäßiger Verlauf im Logit</td><td>jeder Schritt eines Prädiktors ändert den Logit gleich viel</td><td>Anteile je Stufe ansehen (<code>crosstab()</code>), Hosmer-Lemeshow</td><td>Alter beim Smartphone: passt. Interesse: „stark“ 97,5 %, „sehr stark“ 94,1 %, nicht gleichmäßig; Hosmer-Lemeshow Sig. .039</td></tr>
            <tr><td>Unabhängige Fälle</td><td>jede Person einmal, nicht gruppiert</td><td>Erhebung</td><td>ALLBUS: jede befragte Person zählt einmal</td></tr>
            <tr><td>Keine perfekte Abhängigkeit der Prädiktoren</td><td>wie in Sitzung 10 (Multikollinearität)</td><td>Prädiktoren vergleichen</td><td>–</td></tr>
            <tr><td>Gewichtung</td><td>Aussagen über Deutschland</td><td><code>weights = wghtpew</code></td><td>ungewichtet kommt für das Pflichtgefühl ein etwas kleineres Exp(B) heraus</td></tr>
            <tr><td>Keine Ursache aus Zusammenhang</td><td>das Modell vergleicht Menschen</td><td>Begründung, nicht Statistik</td><td>Pflichtgefühl und Wahlabsicht können gemeinsame Ursachen haben</td></tr>
          </tbody>
        </table>
        <p className="absatz">Skalen wie „stimme voll zu“ bis „stimme gar nicht zu“ gehen mit ihren Codes ins Modell (die <code>Note</code> in der Ausgabe). Das setzt voraus, dass die Stufen gleich weit auseinanderliegen. Passt das nicht, kann man sie als Gruppen ins Modell nehmen, als Dummys mit einer Referenzgruppe (kennst du aus Sitzung 10: <code>to_dummy()</code>; die <code>Note</code> schlägt die Abkürzung <code>to_label()</code> vor).</p>
        <Mixup>„Das Modell sagt, wer wählen geht.“ Es sagt für Menschen mit bestimmten Antworten, wie viele von ihnen wählen wollen. Über eine einzelne Person und über tatsächliches Wählen sagt es nichts.</Mixup>
      </Card>
    </HeadingLevel.Provider>
  </section>;
}

/* ---------- Themen für den Reiter „Verstehen“ (Reihenfolge, Karten für die rechte Leiste) ---------- */
export const THEMEN: Thema[] = [
  { id: 'vorweg', n: 'R', kurz: 'R lesen', titel: 'Vorweg: R lesen', minuten: 10, Inhalt: Vorweg,
    karten: [['r1', 'Ein logistisches Modell'], ['r2', 'Vier neue Werkzeuge']] },
  { id: 'g1', n: '1', kurz: 'Aufgabe 1', titel: 'Wer will wählen gehen?', minuten: 15, Inhalt: Verstehen1, aufgabe: 1,
    karten: [['k1-worum', 'Worum es geht'], ['k1-null-eins', 'Ein Turm aus Nullen und Einsen'], ['k1-kreuz', 'Kreuztabelle je Stufe'], ['k1-gerade', 'Warum eine Gerade scheitert'], ['k1-sprachen', 'Drei Sprachen'], ['k1-ergebnis', 'Ergebnis festhalten']] },
  { id: 'g2', n: '2', kurz: 'Aufgabe 2', titel: 'Was heißt Exp(B) für das Pflichtgefühl?', minuten: 15, Inhalt: Verstehen2, aufgabe: 2,
    karten: [['k2-modell', 'Das Modell in R'], ['k2-logit', 'Gerade im Logit, S-Kurve in Prozent'], ['k2-ausgabe', 'Die Ausgabe lesen'], ['k2-zwei', 'Bei gleichem Interesse'], ['k2-faktor', 'Exp(B): ein Faktor'], ['k2-ergebnis', 'Ergebnis festhalten']] },
  { id: 'g3', n: '3', kurz: 'Aufgabe 3', titel: 'Was heißt das in Prozent?', minuten: 15, Inhalt: Verstehen3, aufgabe: 3,
    karten: [['k3-rueckweg', 'Vom Logit zurück'], ['k3-predict', 'Beispielpersonen mit predict()'], ['k3-zwei-schritte', 'Gleicher Faktor, andere Punkte'], ['k3-ame', 'Der AME'], ['k3-ergebnis', 'Ergebnis festhalten']] },
  { id: 'g4', n: '4', kurz: 'Aufgabe 4', titel: 'Erkennt das Modell, wer nicht wählen will?', minuten: 12, Inhalt: Verstehen4, aufgabe: 4,
    karten: [['k4-tabellen', 'Drei Tabellen für die Güte'], ['k4-treffer', 'Trefferquote'], ['k4-2ll', '−2LL und Omnibus-Test'], ['k4-pseudo', 'Pseudo-R²'], ['k4-ergebnis', 'Ergebnis festhalten']] },
  { id: 'g5', n: '✓', kurz: 'Überblick', titel: 'Logistische Regression lesen', minuten: 5, Inhalt: Ueberblick,
    karten: [['k5-sprachen', 'Drei Sprachen, eine Zahl'], ['k5-welche', 'Welches Regressionsmodell?'], ['k5-voraus', 'Voraussetzungen']] },
];
