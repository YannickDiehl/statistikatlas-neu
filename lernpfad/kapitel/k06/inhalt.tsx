// Kapitel 6, Reiter „Verstehen“ (Muster: k04/KONZEPT.md): je Aufgabe erklären, was in jedem Schritt passiert und warum.
// Keine Übungen: Schätzen (EstimateEast), Paare einordnen (PairCounter), Maß zuordnen (MeasureAssignment) und die acht
// „Kurz überlegen“-Fragen sind hier Bilder ohne Prüfung bzw. rhetorische Fragen mit der Antwort im Text.
import { Card, InShort, Mixup, MoreDetail, Badge } from '@atlas/chapter/blocks/Card';
import { HeadingLevel } from '@atlas/chapter/blocks/level';
import { ReadR } from '@atlas/chapter/s06/ReadR';
import { CumTable, MixingDesk, WeightBricks } from '@atlas/chapter/s06/figures/Weighting';
import { ChiBricks, Expected, StrengthRuler } from '@atlas/chapter/s06/figures/Crosstab';
import { Direction, GammaBricks, LayerStack, SignSchema } from '@atlas/chapter/s06/figures/Pairs';
import { OutlierRuler, PointLab, RBricks, ThirdVariable } from '@atlas/chapter/s06/figures/Correlation';
import { MeasureTree } from '@atlas/chapter/s06/figures/Overview';
import { ASSIGN, MEASURE_OPTIONS } from '@atlas/chapter/s06/content';
import '@atlas/chapter/s06/s06.css';
import type { Thema } from '../../react/typen';
import { OstStichprobe, PaareZeigen } from './figuren';
import { Abschnitt, Bezug, Code, Frage } from '../../react/gemeinsam';

/* ---------- Vorweg ---------- */
export function Vorweg() {
  return <section className="grund-block" id="vorweg" aria-labelledby="vorweg-h">
    <div className="g-kopf">
      <span className="st m c7" aria-hidden="true">R</span>
      <div><div className="ueber">Vorweg, für alle Aufgaben</div><h4 id="vorweg-h">R lesen</h4></div>
    </div>
    <p className="g-intro">Ab heute rechnen die Vorlagen gewichtet, wenn es um Aussagen über ganz Deutschland geht, und alle Zusammenhangsmaße haben dieselbe Form: <code>allbus %&gt;% maß(x, y, weights = wghtpew)</code>. Hier steht, wie du solche Zeilen liest und was R antwortet.</p>
    {/* Die breiten Tabellen (r2, k5-tabelle) passen nicht in den Verstehen-Reiter: Code darf umbrechen, notfalls scrollt die Tabelle. */}
    <style>{'#p-verstehen :is(#r2,#k5-tabelle) table.daten{display:block;overflow-x:auto}#p-verstehen :is(#r2,#k5-tabelle) table.daten code{white-space:normal;overflow-wrap:anywhere}'}</style>
    <HeadingLevel.Provider value={5}><ReadR /></HeadingLevel.Provider>
  </section>;
}

/* ---------- Aufgabe 1 ---------- */
export function Verstehen1() {
  return <Abschnitt id="g1" n={1} titel="Wie zufrieden ist Deutschland mit der Demokratie?" frage="Wie viele Menschen in Deutschland sind mit der Demokratie zufrieden, und was ändert die Gewichtung daran?"
    ziel="den Anteil der mindestens etwas Zufriedenen, ohne und mit Gewicht, und kannst erklären, warum die Zahl mit Gewicht anders ausfällt."
    weg={[
      ['Schritt 1', '#a1-p', 'Erst festlegen: Was passiert mit dem Anteil der Zufriedenen, wenn du gewichtest?', 'k1-ost'],
      ['Schritt 2', '#a1-1', 'ohne und mit Gewicht auszählen: was ein Gewicht ist', 'k1-gewicht'],
      ['Schritt 2', '#a1-1', 'Cum. % lesen: mindestens etwas zufrieden', 'k1-cum'],
      ['Schritt 3', '#a1-2', 'in die Landesteile schauen: filter() und zwei markierte Stellen', 'k1-landesteil'],
      ['Schritt 4', '#a1-3', 'Deuten: wann das Gewicht ein Ergebnis verschiebt', 'k1-mischung'],
      ['Schritt 5', '#a1-4', 'Ergebnis festhalten: vier Zahlen und ein Warum', 'k1-ergebnis'],
    ]}>

    <Card id="k1-ost" title="Der Osten ist absichtlich stärker vertreten" badge={<Bezug href="#a1-p">zu Schritt 1</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Der ALLBUS 2023 hat 5.246 Menschen befragt. In Deutschland wohnen knapp 17 von 100 Erwachsenen in den neuen Bundesländern (mit Ost-Berlin).</p>
      <Frage>Wie viele von 100 Befragten im ALLBUS wohnen im Osten?</Frage>
      <p>Fast doppelt so viele: 32 von 100. Die linke Bauplatte zeigt die Befragten, die rechte, wie Deutschland verteilt ist.</p>
      <OstStichprobe />
      <InShort>Der ALLBUS befragt Menschen im Osten absichtlich häufiger, als es ihrem Anteil an der Bevölkerung entspricht. Fachbegriff: <b>disproportionale Stichprobe</b>. Für Aussagen über ganz Deutschland gleicht man das aus: Man <b>gewichtet</b>.</InShort>
      <MoreDetail summary="Warum befragt man den Osten stärker?">
        <p>Mit nur 17 von 100 kämen im ALLBUS knapp 900 Ostdeutsche zusammen. Für Aussagen über den Osten allein, etwa getrennt nach Alter oder Bildung, wäre das schnell zu wenig. Darum befragt der ALLBUS dort mehr Menschen. Der Preis: Wer alle Befragten einfach zusammenzählt, holt den Osten fast doppelt so stark ins Bild, wie er in Deutschland ist.</p>
      </MoreDetail>
      <Frage>Und was heißt das für deine Festlegung in Schritt 1?</Frage>
      <p>Ohne Gewicht steckt in jeder Zahl über alle Befragten fast doppelt so viel Osten, wie Deutschland hat. Ob der Anteil der Zufriedenen mit Gewicht steigt, sinkt oder gleich bleibt, hängt darum davon ab, ob und wie sich Ost und West in ihrer Zufriedenheit unterscheiden. Das siehst du in Schritt 3; wie beides zusammenwirkt, zeigt <a href="#k1-mischung">das Mischpult</a>. Holst du am Ende deine Ergebnisse ins Journal, steht deine Festlegung daneben.</p>
      <Mixup>Die Überquote ist kein Fehler der Stichprobe, sondern geplant. Das Gewicht repariert keinen Fehler, es gleicht einen bekannten Plan aus.</Mixup>
    </Card>

    <Card id="k1-gewicht" title="Formel lesen lernen: Wie groß ist ein Gewicht?" badge={<Bezug href="#a1-1">zu Schritt 2</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Im Westen wohnen 83,16 % der Bevölkerung, aber nur 67,99 % der Befragten. Im Osten ist es umgekehrt: 16,84 % der Bevölkerung, 32,01 % der Befragten.</p>
      <WeightBricks />
      <Frage>Angenommen, eine Umfrage hätte 50 von 100 Befragten im Osten, in der Bevölkerung wären es 17 von 100. Welches Gewicht bekäme dann eine Person aus dem Osten?</Frage>
      <p>17 geteilt durch 50 ergibt 0,34. Je stärker eine Gruppe überrepräsentiert ist, desto kleiner ihr Gewicht.</p>
      <InShort>Ein Gewicht sagt, wie stark eine Person zählt. Fachbegriff: <b>Designgewicht</b>, im ALLBUS die Variable <code>wghtpew</code> (personenbezogenes Ost-West-Gewicht). Unter 1 zählt eine Person weniger, über 1 mehr.</InShort>
      <MoreDetail summary="Wie sieht wghtpew im Datensatz aus?">
        <p>Jede befragte Person hat einen Wert in <code>wghtpew</code>. Im Westen liegt er zwischen 1,20 und 1,25, im Osten zwischen 0,50 und 0,55; je Landesteil gibt es drei leicht verschiedene Werte, weil der ALLBUS 2023 aus mehreren Teilen der Erhebung besteht. Im Mittel liegt <code>wghtpew</code> bei genau 1, darum bleibt die Gesamtzahl gleich (5.246).</p>
      </MoreDetail>
      <Frage>Wie kommt das Gewicht in die Vorlage von Schritt 2?</Frage>
      <Code k="a1a" />
      <p>Die Vorlage zählt <code>ps03</code> zweimal aus. Die zweite Kette hat in der Klammer zusätzlich <code>weights = wghtpew</code>: Dann zählt jede Person so viel, wie ihr Gewicht sagt. Die gewichtete Tabelle erkennst du an der Überschrift „Weighted Frequency Analysis Results“. Ihre Zahlen unter N sind keine Personen mehr, sondern Summen der Gewichte. Wie du die Zeile Baustein für Baustein liest, steht in <a href="#r1">„Neu heute: ein Gewicht als Argument“</a>.</p>
      <Mixup>„Gewichtet zählen die Ostdeutschen weniger, also sind sie weniger wichtig.“ Nein: Sie zählen genau so viel, wie es ihrem Anteil an der Bevölkerung entspricht. Ungewichtet zählten sie fast doppelt.</Mixup>
    </Card>

    <Card id="k1-cum" title="Cum. % lesen: Wie viele sind mindestens etwas zufrieden?" badge={<Bezug href="#a1-1">zu Schritt 2</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Als „zufrieden“ zählen in Aufgabe 1 alle mit 1 sehr zufrieden, 2 ziemlich zufrieden oder 3 etwas zufrieden. Statt drei Zeilen zusammenzuzählen, liest du eine einzige Zahl ab.</p>
      <CumTable />
      <Frage>Was steht in der Spalte Cum. %?</Frage>
      <p>Cum. % zählt die Valid % von oben zusammen. In der Beispieltabelle steht in Zeile 2 die 40: 10 + 30, also alle mit Code 1 oder 2. Bei <code>ps03</code> steht darum in Zeile 3 ETWAS ZUFRIEDEN der Anteil aller, die 1, 2 oder 3 angegeben haben.</p>
      <Frage>Und die vielen fehlenden Werte?</Frage>
      <p>Gut zwei Drittel der Befragten haben die Frage bekommen. Die übrigen hatten eine andere Fragebogen-Variante und stehen bei den fehlenden Werten unter „TNZ: SPLIT“. Valid % und Cum. % rechnen nur mit den gültigen Antworten; die fehlenden zählen nicht mit.</p>
      <InShort><b>Kumulierte Prozent</b> (Cum. %, kennst du aus Sitzung 3) zählen die Prozente von oben nach unten zusammen. In Zeile 3 steht also, wie viel Prozent höchstens Code 3 angegeben haben.</InShort>
      <Mixup>Cum. % in Zeile 3 ist nicht der Anteil von Code 3 allein. Den zeigt Valid %.</Mixup>
    </Card>

    <Card id="k1-landesteil" title="Ein Landesteil: filter() und zwei markierte Stellen" badge={<Bezug href="#a1-2">zu Schritt 3</Bezug>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">Schritt 3 rechnet dieselben zwei Tabellen, aber nur für einen Landesteil.</p>
      <Code k="a1b" />
      <ul className="k6-liste" style={{ margin: "4px 0 10px", paddingLeft: 20 }}>
        <li><code>filter(eastwest == 2)</code> behält nur die Befragten im Osten; 1 heißt Westen, 2 Osten. Das doppelte Gleichheitszeichen fragt „ist gleich?“.</li>
        <li>Die Kette steht zweimal da, erst ohne und dann mit Gewicht. Darum gibt es zwei markierte Stellen, und beide müssen gleich sein.</li>
        <li>Für den Westen tauschst du im Journal beide markierten Stellen gegen 1 und führst den Block noch einmal aus.</li>
      </ul>
      <Frage>Warum ändert das Gewicht innerhalb eines Landesteils fast nichts?</Frage>
      <p>Im Osten haben alle fast dasselbe Gewicht, im Westen ebenso. Ob jede Person 1 oder 0,53 zählt, ändert den Anteil im Osten darum kaum. Beim Beispiel Konfession gehören im Osten 77,4 % ohne und 77,5 % mit Gewicht keiner Religionsgemeinschaft an. Gewichtung wirkt erst, wenn man West und Ost zusammenzählt, weil sich dann das Mischungsverhältnis ändert.</p>
      <InShort>Für einen Vergleich West gegen Ost brauchst du das Gewicht nicht; für eine Zahl über ganz Deutschland schon.</InShort>
      <Mixup><code>weights = wghtpew</code> und <code>filter()</code>. Das Gewicht ändert, wie viel jede Person zählt; alle bleiben drin. <code>filter()</code> ändert, wer überhaupt mitzählt.</Mixup>
    </Card>

    <Card id="k1-mischung" title="Was die Gewichtung am Ergebnis ändert: das Mischpult" badge={<Bezug href="#a1-3">zu Schritt 4</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Ein anderes Beispiel, damit nichts vorweggenommen ist: Wie viele Menschen gehören keiner Religionsgemeinschaft an (Konfession „keine“)? Im Westen sind es 33,7 %, im Osten 77,5 %. Zusammengezählt ohne Gewicht ergibt das 47,7 %, mit Gewicht 41,0 %. Schieb den Regler und sieh, wie der Gesamtanteil wandert.</p>
      <MixingDesk />
      <Frage>Warum verschiebt sich die Zahl für ganz Deutschland?</Frage>
      <p>Sie ist eine Mischung: Anteil West an allen mal Quote im Westen plus Anteil Ost an allen mal Quote im Osten. Die Quoten in West und Ost bleiben fast gleich. Was sich mit Gewicht ändert, ist nur das Mischungsverhältnis: Statt 32 von 100 kommen knapp 17 von 100 aus dem Osten. Darum rückt die Zahl für Deutschland näher an die Quote des Westens.</p>
      <Frage>Was heißt das für Schritt 4?</Frage>
      <p>Leg deine Zahlen aus Schritt 3 neben das Mischpult: Welcher Landesteil hat die höhere Quote, und welcher zählt mit Gewicht weniger? Daraus folgt, in welche Richtung sich die Zahl für Deutschland bewegt und warum sie sich im Osten allein kaum bewegt.</p>
      <InShort>Gewichtung verschiebt ein Ergebnis für ganz Deutschland nur, wenn sich West und Ost unterscheiden. Je größer der Unterschied, desto mehr ändert sie. Innerhalb von West oder Ost ändert sie fast nichts.</InShort>
      <MoreDetail summary="Was das Gewicht nicht ausgleicht">
        <p><code>wghtpew</code> gleicht nur die Ost-West-Verteilung aus. Dass manche Gruppen seltener an Umfragen teilnehmen, gleicht es nicht aus.</p>
      </MoreDetail>
      <Mixup>„Gewichtet ist genauer, ungewichtet ist falsch.“ Beide Zahlen sind richtig gerechnet; sie beantworten verschiedene Fragen. Die ungewichtete Zahl beschreibt die Befragten, die gewichtete schätzt Deutschland.</Mixup>
    </Card>

    <Card id="k1-ergebnis" title="Ergebnis festhalten: wo du was abliest" badge={<Bezug href="#a1-4">zu Schritt 5</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">In Schritt 5 hältst du vier Zahlen und eine Begründung fest. Jede hat einen Ort, an dem du sie ablesen kannst.</p>
      <ul className="k6-liste" style={{ margin: "4px 0 10px", paddingLeft: 20 }}>
        <li><b>Ohne Gewicht:</b> die erste Tabelle aus Schritt 2, Spalte Cum. %, Zeile 3 (<a href="#k1-cum">Cum. % lesen</a>).</li>
        <li><b>Mit Gewicht:</b> die zweite Tabelle aus Schritt 2, die mit „Weighted“ in der Überschrift.</li>
        <li><b>Osten und Westen:</b> Schritt 3, einmal mit 2 und einmal mit 1 an beiden markierten Stellen. Ob du dort die Tabelle ohne oder mit Gewicht nimmst, macht kaum einen Unterschied (<a href="#k1-landesteil">Ein Landesteil</a>).</li>
        <li><b>Warum sich die Zahl mit Gewicht ändert:</b> Vergleiche Ost und West und denk ans Mischpult: Welcher Landesteil zählt mit Gewicht weniger? (<a href="#k1-mischung">Das Mischpult</a>)</li>
      </ul>
      <p>Lag deine Festlegung aus Schritt 1 daneben, ist das kein Fehler, sondern genau der Moment, für den man vorher festlegt.</p>
    </Card>
  </Abschnitt>;
}

/* ---------- Aufgabe 2 ---------- */
export function Verstehen2() {
  return <Abschnitt id="g2" n={2} titel="Zufriedenheit und Wahlabsicht" frage="Hängt die Zufriedenheit mit der Demokratie damit zusammen, welche Partei jemand wählen würde?"
    ziel="Zeilenprozente, die zeigen, in welchen Gruppen die Zufriedenheit hoch oder niedrig ist, und mit Cramér-V eine Zahl für die Stärke des Zusammenhangs."
    weg={[
      ['Schritt 1', '#a2-p', 'Erst festlegen: Wie stark ist der Zusammenhang wohl?', 'k2-staerke'],
      ['Schritt 2', '#a2-1', 'das Skalenniveau bestimmen', 'k2-niveau'],
      ['Schritt 3', '#a2-2', 'zwei Gruppen bilden, Kreuztabelle mit Zeilenprozenten', 'k2-tabelle'],
      ['Schritt 3', '#a2-2', 'Hintergrund: Wie sähe die Tabelle ohne Zusammenhang aus?', 'k2-erwartet'],
      ['Schritt 4', '#a2-3', 'Cramér-V: von χ² zu einer Zahl', 'k2-chi'],
      ['Schritt 5', '#a2-4', 'Ergebnis festhalten: Prozente, V, Stärke, Richtung', 'k2-staerke'],
    ]}>

    <Card id="k2-niveau" title="Welches Maß? Erst das Skalenniveau" badge={<Bezug href="#a2-1">zu Schritt 2</Bezug>} tag={{ kind: 'interpret', label: 'Hintergrund' }}>
      <p className="lead">Für jedes Skalenniveau gibt es eigene Zusammenhangsmaße. Darum fragt Schritt 2 zuerst, welches Skalenniveau die Wahlabsicht hat. Die drei Stufen kennst du aus Sitzung 4.</p>
      <Frage>Woran erkennst du das Skalenniveau?</Frage>
      <ul className="k6-liste" style={{ margin: "4px 0 10px", paddingLeft: 20 }}>
        <li><b>Nominal:</b> Kategorien ohne Reihenfolge. Hat der Familienstand eine Reihenfolge? Nein, also ist er nominal.</li>
        <li><b>Ordinal:</b> Kategorien mit Reihenfolge, aber ohne gleiche Abstände, etwa das politische Interesse (sehr stark bis überhaupt nicht) oder der Schulabschluss (ohne bis Hochschulreife).</li>
        <li><b>Metrisch:</b> Zahlen mit gleichen Abständen, etwa Alter in Jahren oder Arbeitsstunden pro Woche.</li>
      </ul>
      <Frage>Und die Wahlabsicht?</Frage>
      <p>Stell dieselbe Frage an die acht Antworten von <code>pv01</code>: Lässt sich eine Partei sinnvoll über oder unter einer anderen einordnen? Deine Antwort hältst du in Schritt 2 fest. Welches Maß dann passt, zeigt der Entscheidungsbaum im <a href="#k5-baum">Überblick</a>.</p>
      <InShort>Das <b>Skalenniveau</b> sagt, ob die Werte eine Reihenfolge haben und ob ihre Abstände gleich viel bedeuten. Erst fragst du nach der Reihenfolge, dann nach den Abständen. Bei zwei Variablen entscheidet das niedrigere Skalenniveau.</InShort>
    </Card>

    <Card id="k2-tabelle" title="Zwei Gruppen und Zeilenprozente" badge={<Bezug href="#a2-2">zu Schritt 3</Bezug>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">Schritt 3 macht aus der Zufriedenheit zwei Gruppen und vergleicht die Parteien in einer Kreuztabelle. Beides kennst du aus Sitzung 5; neu ist nur das Gewicht.</p>
      <Code k="a2b" />
      <Frage>Was macht <code>rec()</code> hier?</Frage>
      <p><code>rules = "1:3=1 [zufrieden]; 4:6=0 [unzufrieden]; else=NA"</code> heißt: Die Codes 1 bis 3 werden zu 1 mit dem Label „zufrieden“, die Codes 4 bis 6 zu 0 mit dem Label „unzufrieden“, alles andere wird <code>NA</code>. <code>mutate()</code> legt das Ergebnis als neue Variable <code>zufrieden</code> ab, und <code>%&gt;%</code> reicht sie an <code>crosstab()</code> weiter.</p>
      <Frage>Wie liest du die Tabelle?</Frage>
      <p>Jede Wahlabsicht hat zwei Zeilen: oben die Anzahl (gewichtet, also Summe der Gewichte), darunter „row %“. In der Spalte „zufrieden“ steht in der Zeile „row %“, wie viel Prozent dieser Gruppe mindestens etwas zufrieden sind. Dass gewichtet wurde, steht im Kopf der Ausgabe: „Weights variable: wghtpew“.</p>
      <Frage>Warum Zeilenprozente?</Frage>
      <p>Die Wahlabsicht steht in den Zeilen und ist die Gruppe, die du vergleichst. Zeilenprozente teilen jede Zeile durch ihre eigene Summe; so kannst du Parteien mit vielen und mit wenigen Wählenden nebeneinanderstellen.</p>
      <InShort><b>Zeilenprozente</b> (<code>percentages = "row"</code>) sagen für jede Gruppe in den Zeilen, wie sie sich auf die Spalten aufteilt. Hier heißt das: je Partei der Anteil der Zufriedenen.</InShort>
      <Mixup>Die obere Zeile jeder Partei ist gewichtet keine Personenzahl, sondern eine Summe der Gewichte.</Mixup>
    </Card>

    <Card id="k2-erwartet" title="Was wäre, wenn es keinen Zusammenhang gäbe?" badge={<Bezug href="#a2-2">zu Schritt 3</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Zum Beispiel 100 Befragte: 80 aus dem Westen, 20 aus dem Osten. Im Westen gehören 28 keiner Konfession an (35 %), im Osten 16 (80 %). Insgesamt sind es 44 von 100.</p>
      <Frage>Wie viele Befragte aus dem Osten ohne Konfession würdest du erwarten, wenn Region und Konfession nichts miteinander zu tun hätten?</Frage>
      <p>Ohne Zusammenhang hätte der Osten denselben Anteil wie alle: 44 % von 20 Befragten, also 20 × 44 / 100 = 8,8. Beobachtet sind 16, fast doppelt so viele. Schalte zwischen den drei Ansichten der Tafel um.</p>
      <Expected />
      <Frage>Was hat das mit deiner Kreuztabelle zu tun?</Frage>
      <p>Es ist dieselbe Frage im Großen. Wären die Zeilenprozente bei allen Parteien gleich, gäbe es keinen Zusammenhang zwischen Wahlabsicht und Zufriedenheit. Je weiter sie auseinanderliegen, desto stärker der Zusammenhang.</p>
      <InShort>Zwei Merkmale hängen zusammen, wenn die Verteilung des einen in den Gruppen des anderen verschieden ist. Ohne Zusammenhang (Fachbegriff: <b>statistische Unabhängigkeit</b>) hätte jede Gruppe dieselben Prozente wie alle zusammen; daraus ergeben sich die <b>erwarteten Häufigkeiten</b>.</InShort>
      <Mixup>Erwartete Häufigkeiten sind keine Vorhersage, wie es sein sollte. Sie sind ein Vergleichsbild: so sähe die Tabelle aus, wenn es keinen Zusammenhang gäbe.</Mixup>
    </Card>

    <Card id="k2-chi" title="Formel lesen lernen: von χ² zu Phi und Cramér-V" badge={<Bezug href="#a2-3">zu Schritt 4</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">In Sitzung 5 stand neben χ² schon eine Zahl V. Hier siehst du, wie sie entsteht, am Beispiel der 100 Befragten.</p>
      <ChiBricks />
      <InShort><b>χ²</b> misst, wie weit eine Kreuztabelle von „kein Zusammenhang“ entfernt ist. <b>Phi</b> (für Vierfeldertafeln) und <b>Cramér-V</b> (für Tabellen jeder Größe) machen daraus eine Zahl zwischen 0 und 1: 0 heißt kein Zusammenhang, 1 heißt vollständiger Zusammenhang. Für die Stärke zählt diese Zahl ohne Vorzeichen.</InShort>
      <MoreDetail summary="Warum teilt man durch n, und wozu die Klammer?">
        <p>χ² wächst mit der Zahl der Befragten: Mit 200 statt 100 Befragten und denselben Prozenten verdoppelt es sich auf 26,30, der Zusammenhang ist aber derselbe. Phi und V teilen durch n und bleiben bei 0,36. Die Klammer (kleinere Zahl von Zeilen und Spalten minus 1) sorgt bei größeren Tabellen dafür, dass V nicht über 1 steigt.</p>
        <p>Echte Zahlen für Deutschland (gewichtet): Phi für „keine Konfession ja/nein“ und Region 0,33; Cramér-V für vier Konfessionsgruppen (evangelisch, katholisch, andere, keine) und Region 0,34. Ohne Gewicht wären es 0,41 und 0,42: V hängt auch davon ab, wie groß die Gruppen sind, und ohne Gewicht ist der Osten fast doppelt so groß. Für Aussagen über Deutschland gilt der gewichtete Wert.</p>
      </MoreDetail>
      <Frage>Was macht die Vorlage in Schritt 4?</Frage>
      <Code k="a2c" />
      <p><code>cramers_v()</code> erledigt alle fünf Schritte auf einmal: Es bekommt die zwei Variablen und das Gewicht und gibt V zurück. Die Zeilen mit <code>mutate()</code> bilden <code>zufrieden</code> genauso wie in Schritt 3, damit die Vorlage auch für sich allein läuft. R antwortet nur mit einer Zahl, etwa <code>[1] 0.1234567</code>. Die <code>[1]</code> ist keine Zahl des Ergebnisses; R nummeriert damit nur die Ausgabe.</p>
      <MoreDetail summary="Warum zeigt R bei Phi manchmal ein Minus?">
        <p>Aus χ² gerechnet ist Phi nie negativ. <code>phi()</code> in R rechnet bei einer Vierfeldertafel aber mit einer gleichwertigen Formel, die zusätzlich ein Vorzeichen liefert; der Wert liegt dann zwischen −1 und +1. Plus heißt: Der jeweils größere Code der einen Variable kommt häufiger mit dem größeren Code der anderen vor; Minus heißt: mit dem kleineren.</p>
        <p>Tauschst du die Codes einer Variable, dreht sich das Vorzeichen, die Stärke bleibt. Für die Stärke liest du darum den Betrag (−0,15 ist so stark wie 0,15); welche Gruppen zusammengehören, liest du an den Prozenten der Kreuztabelle ab. Cramér-V hat nie ein Vorzeichen; bei zwei mal zwei Kategorien ist V gleich dem Betrag von Phi.</p>
      </MoreDetail>
      <Mixup>„V = 0,36 heißt: 36 % hängen zusammen.“ V ist kein Prozentwert. Es sagt nur, wie stark die Tabelle von „kein Zusammenhang“ abweicht, auf einer Skala von 0 bis 1.</Mixup>
    </Card>

    <Card id="k2-staerke" title="Wie stark ist stark?" badge={<Bezug href="#a2-4">zu Schritt 1 und 5</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">Deine Festlegung in Schritt 1 und die Frage nach der Stärke in Schritt 5 nutzen dieselben Stufen: die Faustregel auf dem Lineal.</p>
      <StrengthRuler />
      <Frage>Phi für Konfession und Region ist 0,33. Wie stark ist der Zusammenhang nach der Faustregel?</Frage>
      <p>Mittel: 0,33 liegt knapp über 0,3, ab 0,5 begänne „stark“.</p>
      <InShort>Für die Stärke gibt es eine <b>Faustregel</b> (nach Cohen): ab 0,1 schwach, ab 0,3 mittel, ab 0,5 stark. Sie gilt für Cramér-V, Phi, Tau-b, Spearman-ρ und Pearson-r.</InShort>
      <MoreDetail summary="Faustregel mit Augenmaß">
        <p>Die Grenzen sind eine Verabredung, kein Naturgesetz. Ob 0,2 „wenig“ ist, hängt von der Frage ab: In den Sozialwissenschaften sind viele wichtige Zusammenhänge schwach. Gamma fällt meist größer aus als die anderen Maße (Aufgabe 3); ordne die Stärke deshalb mit Tau-b ein.</p>
        <p>Bei Cramér-V passt die Faustregel genau für Tabellen mit nur zwei Zeilen oder zwei Spalten (wie in Aufgabe 2); für größere Tabellen setzt Cohen die Grenzen etwas niedriger an. Dieselbe Faustregel steht im R-Workshop, Kapitel 7.</p>
      </MoreDetail>
      <Frage>Und wo steht was für Schritt 5?</Frage>
      <ul className="k6-liste" style={{ margin: "4px 0 10px", paddingLeft: 20 }}>
        <li><b>Das Skalenniveau:</b> hast du schon in Schritt 2 festgehalten (<a href="#k2-niveau">Skalenniveau</a>).</li>
        <li><b>Prozente je Partei:</b> Schritt 3, Zeile „row %“ unter dem Parteinamen, Spalte zufrieden (<a href="#k2-tabelle">Zeilenprozente</a>).</li>
        <li><b>V:</b> Schritt 4, die Zahl hinter <code>[1]</code>.</li>
        <li><b>Die Stärke:</b> V auf dem Lineal oben.</li>
        <li><b>Die Richtung:</b> Überleg, was V überhaupt messen kann (<a href="#k2-chi">von χ² zu V</a>) und ob die Wahlabsicht eine Reihenfolge hat.</li>
      </ul>
      <Mixup>Ein großer Zusammenhang ist nicht automatisch ein wichtiger, und ein kleiner nicht automatisch unwichtig. Die Faustregel ordnet nur die Größe ein.</Mixup>
    </Card>
  </Abschnitt>;
}

/* ---------- Aufgabe 3 ---------- */
export function Verstehen3() {
  return <Abschnitt id="g3" n={3} titel="Wirtschaftslage und Demokratie" frage="Sind Menschen, die die Wirtschaftslage in Deutschland schlechter einschätzen, unzufriedener mit der Demokratie?"
    ziel="Gamma und Tau-b für zwei geordnete Merkmale, kannst Stärke und Richtung in einem Satz sagen und erklären, warum Gamma größer ausfällt."
    weg={[
      ['Schritt 1', '#a3-p', 'Erst festlegen: Welches Vorzeichen erwartest du?', 'k3-richtung'],
      ['Schritt 2', '#a3-1', 'umpolen und prüfen', 'k3-umpolen'],
      ['Schritt 3', '#a3-2', 'Gamma und Tau-b vergleichen Paare', 'k3-paare'],
      ['Schritt 3', '#a3-2', 'die Formeln und die Ausgabe lesen', 'k3-formel'],
      ['Schritt 4', '#a3-3', 'Deuten: Vorzeichen und Stärke', 'k3-richtung'],
      ['Schritt 5', '#a3-4', 'Ergebnis festhalten: zwei Zahlen, Richtung, Stärke, warum Gamma größer', 'k3-formel'],
      ['Schritt 6', '#a3-5', 'Einordnen: dieselben Daten, verschiedene Maße', 'k5-vergleich'],
    ]}>

    <Card id="k3-umpolen" title="Umpolen: damit höher „zufriedener“ heißt" badge={<Bezug href="#a3-1">zu Schritt 2</Bezug>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">Im Datensatz heißt bei <code>ps03</code> die 1 „sehr zufrieden“ und die 6 „sehr unzufrieden“. Ein höherer Code heißt also: unzufriedener. Schritt 2 dreht das um.</p>
      <Code k="a3a" />
      <Frage>Was macht <code>rules = "rev"</code>?</Frage>
      <p><code>rec(ps03, rules = "rev")</code> dreht die Reihenfolge der Codes um: Aus 1 wird 6, aus 6 wird 1, und die Wörter wandern mit. <code>mutate()</code> legt das Ergebnis als neue Variable <code>zufriedenheit</code> ab; mit <code>allbus &lt;- </code> davor bleibt sie im Datensatz. Die Kontrolle mit <code>frequency()</code> zeigt, ob es geklappt hat: Bei Code 6 muss jetzt SEHR ZUFRIEDEN stehen.</p>
      <Frage>Und warum bleibt <code>ep01</code>, wie es ist?</Frage>
      <p>Dann heißt ein höherer Code bei den beiden Variablen Verschiedenes: bei <code>zufriedenheit</code> „zufriedener“, bei <code>ep01</code> „schlechter eingeschätzt“. Genau das brauchst du für die Festlegung in Schritt 1 und fürs Deuten in Schritt 4 (<a href="#k3-richtung">Richtung</a>).</p>
      <Frage>Warum steht das Umpolen in den späteren Vorlagen noch einmal?</Frage>
      <p>Jede Vorlage soll auch für sich allein laufen, etwa in RStudio nach einem Neustart. Im Journal schadet die Wiederholung nicht: Die Variable wird einfach noch einmal gleich gebildet. Fehlt sie, meldet R „Column `zufriedenheit` doesn't exist“; dann führst du zuerst den Block mit <code>mutate()</code> aus.</p>
      <InShort><b>Umpolen</b> dreht die Codes einer Variable um (kennst du aus Sitzung 5). Man polt meist so, dass ein höherer Code „mehr“ oder „besser“ heißt; dann fallen Sätze über das Vorzeichen leichter.</InShort>
      <Mixup>Umpolen ändert nicht, was jemand geantwortet hat. Wer „sehr zufrieden“ gesagt hat, steht danach bei Code 6 statt bei Code 1.</Mixup>
    </Card>

    <Card id="k3-paare" title="Gleichläufig oder gegenläufig?" badge={<Bezug href="#a3-2">zu Schritt 3</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Gamma und Tau-b vergleichen Paare von Befragten. Zum Beispiel fünf Befragte, A bis E. Jede Person stuft ihre Schicht ein (1 Unterschicht, 2 Arbeiterschicht, 3 Mittelschicht, 4 obere Mittelschicht) und ihre Gesundheit (1 schlecht, 2 weniger gut, 3 zufriedenstellend, 4 gut). A: Schicht 1, Gesundheit 1. B: 2 und 3. C: 3 und 2. D: 3 und 4. E: 4 und 3. Klick dich durch die zehn Paare.</p>
      <PaareZeigen />
      <Frage>Woran erkennst du, wie ein Paar einzuordnen ist?</Frage>
      <p>Vergleiche zuerst die Schicht: Wer liegt höher? Hat diese Person auch die bessere Gesundheit, ist das Paar gleichläufig, sonst gegenläufig. Liegen beide bei einem Merkmal gleich, ist es ein Gleichstand; dann ist keine Richtung erkennbar.</p>
      <InShort>Gamma und Tau-b vergleichen Paare von Befragten. <b>Gleichläufig</b> (Fachbegriff: konkordant): Wer bei einem Merkmal höher liegt, liegt auch beim anderen höher. <b>Gegenläufig</b> (diskordant): umgekehrt. <b>Gleichstand</b> (Bindung): Beide liegen bei mindestens einem Merkmal gleich hoch.</InShort>
      <Mixup>„Gleichläufig“ heißt nicht „gleiche Werte“. B (2 und 3) und D (3 und 4) sind gleichläufig, obwohl keine Zahl gleich ist: D liegt bei beiden höher.</Mixup>
    </Card>

    <Card id="k3-formel" title="Formel lesen lernen: Gamma und Tau-b" badge={<Bezug href="#a3-2">zu Schritt 3 und 5</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Aus den gezählten Paaren werden zwei Zahlen. Hier mit dem Endstand der fünf Befragten: 6 gleichläufig, 2 gegenläufig, 1 Gleichstand bei der Schicht, 1 bei der Gesundheit.</p>
      <GammaBricks />
      <Frage>In einer Tabelle gibt es 30 gleichläufige und 10 gegenläufige Paare, dazu 20 Paare mit Gleichstand. Wie groß ist Gamma?</Frage>
      <p>(30 − 10) / (30 + 10) = 0,5. Die 20 Paare mit Gleichstand spielen für Gamma keine Rolle; Tau-b wäre kleiner.</p>
      <InShort><b>Gamma</b> (Fachbegriff: Goodman-Kruskal-Gamma) und <b>Tau-b</b> (Kendall-Tau-b) reichen von −1 bis +1. Gamma lässt Paare mit Gleichstand weg, Tau-b zählt sie im Nenner mit. Darum ist Tau-b dem Betrag nach nie größer als Gamma, meist deutlich kleiner.</InShort>
      <MoreDetail summary="Echte Zahlen und warum Gleichstände so wichtig sind">
        <p>Bei Variablen mit wenigen Stufen haben sehr viele Paare einen Gleichstand: Von Tausenden Befragten mit „Mittelschicht“ liegt jedes Paar bei der Schicht gleich auf. Gamma übergeht all diese Paare und fällt deshalb groß aus.</p>
        <p>Im ALLBUS (gewichtet) hängen Schicht und Gesundheit so zusammen: Gamma 0,36, Tau-b 0,24, wenn die Gesundheit so gepolt ist, dass ein höherer Code „besser“ heißt (warum das fürs Vorzeichen wichtig ist, zeigt <a href="#k3-richtung">die Karte zur Richtung</a>). Unter denen, die sich der Unterschicht zurechnen, beurteilen 22,9 % ihre Gesundheit als gut oder sehr gut, in der Arbeiterschicht 45,3 %, in der Mittelschicht 58,9 %, in der oberen Mittelschicht 76,8 %, in der Oberschicht 72,6 % (gewichtet nur 62). Spearman-ρ passt ebenfalls zu geordneten Stufen; es kommt in Aufgabe 4.</p>
        <LayerStack />
      </MoreDetail>
      <Frage>Was steht in der Vorlage von Schritt 3, und wie liest du die Ausgabe?</Frage>
      <Code k="a3b" />
      <p>Oben polt die Vorlage noch einmal um wie in Schritt 2. Dann rechnet <code>goodman_gamma()</code> Gamma und <code>kendall_tau()</code> Tau-b, beide mit denselben zwei Variablen und gewichtet. Die Ausgabe hat zwei Teile: Zuerst kommt Gamma als einzelne Zahl hinter <code>[1]</code>, darunter der Block „Kendall's Tau“ mit der Zeile <code>tau = …</code>. Bei Gamma meldet R in Rot „2 cells (6.7%) has expected count &lt; 5 …“: ein Hinweis zum χ²-Test, kein Fehler. Wie die Tau-Ausgabe aufgebaut ist, zeigt <a href="#r2">„Ein Zusammenhangsmaß in R“</a>.</p>
      <Mixup>„Gamma ist größer, also ist Gamma besser.“ Gamma ist nur großzügiger, weil es Gleichstände weglässt. Vergleiche nie Gamma des einen mit Tau-b des anderen Zusammenhangs.</Mixup>
    </Card>

    <Card id="k3-richtung" title="Richtung: Das Vorzeichen hängt an der Kodierung" badge={<Bezug href="#a3-3">zu Schritt 1, 4 und 5</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">Ein Beispiel außerhalb der Aufgabe: Im Datensatz heißt bei der Gesundheit (<code>hs01</code>) die 1 „sehr gut“ und die 5 „schlecht“. Ein höherer Code ist also eine schlechtere Gesundheit. Bei der Schicht (<code>id02</code>) heißt ein höherer Code eine höhere Schicht.</p>
      <Frage>Gamma für Schicht und Gesundheit ist −0,36, mit der Gesundheit wie im Datensatz. Was heißt das?</Frage>
      <p>Je höher die Schicht, desto besser die Gesundheit. Ein höherer Schichtcode geht mit kleineren Gesundheitscodes zusammen, und klein heißt hier gut. Schalte die Kodierung um: Der Zusammenhang bleibt derselbe, nur das Vorzeichen dreht sich.</p>
      <Direction />
      <InShort>Der <b>Betrag</b> sagt, wie stark ein Zusammenhang ist; das <b>Vorzeichen</b> sagt, in welche Richtung. Positiv: Höhere Codes gehen mit höheren Codes einher. Negativ: Höhere Codes gehen mit niedrigeren einher. Was „höher“ inhaltlich heißt, steht im Codebuch.</InShort>
      <Frage>Wie hilft dir das in Aufgabe 3?</Frage>
      <p>Das Bild in Schritt 3 zeigt die Codes beider Variablen als Pfeile. Für die Festlegung in Schritt 1 und fürs Deuten in Schritt 4 übersetzt du das Vorzeichen so: Du schaust, ob ein höherer Code bei <code>ep01</code> (schlechter eingeschätzt) mit höheren oder niedrigeren Codes bei <code>zufriedenheit</code> zusammengeht, und sagst das in Worten. Das Bild zeigt beide Möglichkeiten.</p>
      <SignSchema />
      <p>Für die Stärke in Schritt 5 nimmst du den Betrag von Tau-b und die Faustregel (<a href="#k2-staerke">Wie stark ist stark?</a>); warum Gamma größer ausfällt, steht in <a href="#k3-formel">Gamma und Tau-b</a>.</p>
      <MoreDetail summary="Gamma braucht eine sinnvolle Reihenfolge">
        <p>Bei nominalen Merkmalen ist jede Reihenfolge willkürlich, und Gamma hängt davon ab. Beispiel Konfession und Gesundheit (gewichtet): In der Reihenfolge evangelisch, katholisch, andere, keine ist Gamma 0,04; in der Reihenfolge keine, evangelisch, katholisch, andere 0,01; in der Reihenfolge katholisch, keine, andere, evangelisch −0,03. Cramér-V bleibt in allen drei Fällen 0,045. Darum gilt: Gamma und Tau-b nur, wenn beide Merkmale eine Reihenfolge haben.</p>
      </MoreDetail>
      <Mixup>„Negativ heißt schwach.“ Nein: −0,42 ist ein stärkerer Zusammenhang als +0,30. Für die Stärke zählt der Betrag.</Mixup>
    </Card>
  </Abschnitt>;
}

/* ---------- Aufgabe 4 ---------- */
export function Verstehen4() {
  return <Abschnitt id="g4" n={4} titel="Lebenszufriedenheit und Demokratie" frage="Sind Menschen, die mit ihrem Leben zufriedener sind, auch zufriedener mit der Demokratie, und gilt das in West und Ost?"
    ziel="Pearson-r und Spearman-ρ, eingeordnet nach der Faustregel, und weißt, ob der Zusammenhang in beiden Landesteilen gleich stark ist."
    weg={[
      ['Schritt 1', '#a4-p', 'Erst festlegen: Wie stark hängen die beiden zusammen?', 'k4-pearson'],
      ['Schritt 2', '#a4-1', 'umpolen und die Punktwolke ansehen', 'k4-punktwolke'],
      ['Schritt 3', '#a4-2', 'Pearson-r: Punkte und Gerade', 'k4-pearson'],
      ['Schritt 3', '#a4-2', 'Spearman-ρ: Rangplätze statt Werte', 'k4-ausreisser'],
      ['Schritt 4', '#a4-3', 'die Drittvariable Landesteil prüfen', 'k4-dritt'],
      ['Schritt 5', '#a4-4', 'Ergebnis festhalten: r, ρ, Stärke, West und Ost, ein Satz', 'k4-dritt'],
    ]}>

    <Card id="k4-punktwolke" title="Erst das Bild: die Punktwolke" badge={<Bezug href="#a4-1">zu Schritt 2</Bezug>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">Die Lebenszufriedenheit (<code>ls01</code>) hat elf Stufen von 0 bis 10, die man wie Zahlen mit gleichen Abständen behandeln darf (quasi-metrisch). Die umgepolte Zufriedenheit mit der Demokratie behandelst du hier ebenso. Zwei Variablen mit vielen Werten zeigt man als Punkte.</p>
      <Code k="a4a" />
      <ul className="k6-liste" style={{ margin: "4px 0 10px", paddingLeft: 20 }}>
        <li>Oben wird umgepolt wie in Aufgabe 3 (<a href="#k3-umpolen">Umpolen</a>).</li>
        <li><code>drop_na(ls01, zufriedenheit)</code> lässt alle weg, denen bei einer der beiden Variablen die Angabe fehlt.</li>
        <li><code>aes(x = ls01, y = zufriedenheit)</code>: Lebenszufriedenheit nach rechts, Zufriedenheit mit der Demokratie nach oben.</li>
        <li><code>geom_jitter()</code> streut die Punkte leicht, weil sie sonst bei so wenigen Stufen übereinanderliegen; <code>alpha = 0.2</code> macht sie durchscheinend, damit dichte Stellen dunkler wirken.</li>
      </ul>
      <Frage>Warum zuerst ein Bild, bevor du rechnest?</Frage>
      <p>Pearson-r misst nur Geraden. Steigt etwas erst an und fällt dann wieder (ein Bogen), kann r nahe 0 liegen, obwohl ein deutlicher Zusammenhang besteht. Einzelne Punkte weit draußen können r verzerren. Beides siehst du nur im Bild. Eine Gerade wird hier nicht gezeichnet; Regression kommt in Sitzung 9.</p>
      <InShort>Eine <b>Punktwolke</b> zeigt jede Person als Punkt mit ihren zwei Werten. Du schaust, ob die Wolke nach rechts ansteigt, abfällt oder flach liegt. Die Grafik, die R zeichnet, zeigt alle Befragten ohne Gewicht; für einen ersten Blick reicht das.</InShort>
    </Card>

    <Card id="k4-pearson" title="Formel lesen lernen: Pearson-r im Punkte-Labor" badge={<Bezug href="#a4-2">zu Schritt 1 und 3</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Zum Beispiel acht Befragte mit ihrem Alter und den Minuten, die sie für einen Fragebogen gebraucht haben. A: 22 Jahre, 45 Minuten. B: 29, 50. C: 35, 48. D: 41, 60. E: 48, 58. F: 56, 66. G: 63, 70. H: 71, 75. Mittelwerte: 45,6 Jahre und 59 Minuten.</p>
      <p className="hilfe-zeile">Das gestrichelte Kreuz geht durch die Mittelwerte. Oben rechts und unten links liegen die Plus-Felder, oben links und unten rechts die Minus-Felder.</p>
      <PointLab />
      <Frage>Person B (29 Jahre) braucht statt 50 Minuten 1.500, weil der Bogen einen Tag herumlag. Was passiert mit r?</Frage>
      <p>r sinkt stark und wird sogar negativ: Ein einziger Punkt weit draußen im Minus-Feld bringt ein riesiges negatives Produkt mit. r fällt von 0,974 auf −0,38. ρ sinkt nur einmal, von 0,952 auf 0,476, sobald B die Langsamste ist, und bleibt dann dort, egal wie weit B hinausrückt.</p>
      <RBricks />
      <InShort><b>Pearson-r</b> misst, wie gut sich Punkte an eine steigende oder fallende Gerade halten, von −1 bis +1. <b>Spearman-ρ</b> (gesprochen „rho“) macht dasselbe mit Rangplätzen statt mit den Werten selbst. Darum verträgt ρ Ausreißer und passt auch zu geordneten Stufen.</InShort>
      <Frage>Was steht in der Vorlage von Schritt 3?</Frage>
      <Code k="a4b" />
      <p>Oben wird wieder umgepolt, damit die Vorlage für sich allein läuft. <code>pearson_cor()</code> rechnet r gewichtet; die Zahl steht hinter <code>r =</code>. <code>spearman_rho()</code> rechnet ρ zum Vergleich, immer ohne Gewicht; die Zahl steht hinter <code>rho =</code>. Für deine Festlegung in Schritt 1 und die Stärke in Schritt 5 gilt dieselbe Faustregel wie bei den anderen Maßen (<a href="#k2-staerke">Wie stark ist stark?</a>).</p>
      <Mixup>„r = 0,97 heißt: Ältere brauchen 97 % länger.“ r ist keine Prozentzahl und keine Steigung. Es sagt nur, wie eng die Punkte an einer Geraden liegen.</Mixup>
    </Card>

    <Card id="k4-ausreisser" title="Ausreißer und Kurven: Pearson oder Spearman?" badge={<Bezug href="#a4-2">zu Schritt 3</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Brauchen ältere Befragte länger für den Fragebogen? In Sitzung 4 hast du gesehen: Einzelne Bögen lagen wochenlang herum, also Zehntausende Minuten, während die Hälfte nach gut einer Stunde fertig war (Median 65 Minuten). Mit allen Bögen ergibt Pearson-r 0,003 (gewichtet), Spearman-ρ 0,24. Nur mit Bögen bis 180 Minuten: r = 0,25, ρ = 0,27.</p>
      <OutlierRuler />
      <Frage>Mit allen Bögen: r = 0,003, ρ = 0,24. Welche Zahl beschreibt den Zusammenhang besser?</Frage>
      <p>ρ, weil einzelne Bögen mit Zehntausenden Minuten r verzerren. Rangplätze stört es nicht, wie weit ein Ausreißer draußen liegt. Ohne Ausreißer liegt auch r bei 0,25.</p>
      <InShort>Pearson-r braucht metrische Variablen (oder viele Stufen mit etwa gleichen Abständen), einen geradlinigen Zusammenhang und keine extremen Ausreißer. Sonst nimmst du Spearman-ρ.</InShort>
      <MoreDetail summary="Was r nicht sieht">
        <p>r misst nur Geraden. Steigt etwas erst an und fällt dann wieder (ein Bogen), kann r nahe 0 liegen, obwohl ein deutlicher Zusammenhang besteht. Darum: erst die Punktwolke ansehen, dann rechnen. Für die Stärke gilt dieselbe Faustregel wie in Aufgabe 2.</p>
        <p>In R rechnet <code>spearman_rho()</code> immer ohne Gewicht; mit <code>weights = wghtpew</code> kommt derselbe Wert heraus (hier 0,238). Für Aussagen über Deutschland ist das eine kleine Einschränkung, die du im Bericht nennst.</p>
      </MoreDetail>
      <Mixup>„r = 0 heißt: kein Zusammenhang.“ r = 0 heißt nur: kein geradliniger. Mit Ausreißern oder bei einem Bogen kann trotzdem einer da sein.</Mixup>
    </Card>

    <Card id="k4-dritt" title="Zusammenhang ist keine Ursache: die Drittvariable" badge={<Bezug href="#a4-3">zu Schritt 4 und 5</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">Dass ein Zusammenhang keine Ursache ist, kennst du aus Sitzung 5. Neu ist, wie man eine Drittvariable prüft. Wer privat das Internet nutzt, beurteilt die eigene Gesundheit deutlich öfter als gut oder sehr gut: 59,0 % gegen 24,0 % (gewichtet, Phi = 0,22). Macht das Internet gesund?</p>
      <ThirdVariable />
      <Frage>Wird der Unterschied zwischen Nutzern und Nicht-Nutzern innerhalb gleich alter Menschen größer oder kleiner?</Frage>
      <p>Kleiner: Er schrumpft von 35 auf 15 bis 19 Prozentpunkte. Das Alter erklärt einen Teil des Zusammenhangs.</p>
      <InShort>Eine <b>Drittvariable</b> kann zwei Merkmale zugleich beeinflussen. Fachbegriff: <b>Confounding</b>; die Drittvariable heißt dann Störvariable (englisch Confounder), weil sie als gemeinsame Ursache dahinterstecken kann. Dann hängen beide zusammen, auch wenn das eine das andere gar nicht bewirkt. Prüfen kannst du das, indem du den Zusammenhang innerhalb von Gruppen der Drittvariable rechnest.</InShort>
      <MoreDetail summary="Schrumpft, bleibt, kehrt sich um">
        <p>Rechnet man innerhalb der Gruppen einer Drittvariable, kann der Zusammenhang bleiben (dann erklärt sie ihn nicht), schrumpfen (sie erklärt einen Teil), verschwinden oder sich sogar umkehren. Hier schrumpft er, verschwindet aber nicht.</p>
        <p>Ob der Rest eine Ursache ist, zeigt auch das nicht: Vielleicht nutzen Gesunde eher das Internet als umgekehrt. Ein Zusammenhangsmaß sagt nie, was was bewirkt.</p>
      </MoreDetail>
      <Frage>Wie prüft Schritt 4 den Landesteil?</Frage>
      <Code k="a4c" />
      <p>Genauso, nur mit r: <code>filter(eastwest == 1)</code> behält den Westen, und <code>pearson_cor()</code> rechnet r nur für diese Befragten. Für den Osten tauschst du im Journal die markierte 1 gegen 2. Dann legst du die zwei Werte neben den Wert für alle aus Schritt 3: Bleibt der Zusammenhang etwa gleich, schrumpft er, verschwindet er oder kehrt er sich um?</p>
      <Frage>Und wo steht was für Schritt 5?</Frage>
      <ul className="k6-liste" style={{ margin: "4px 0 10px", paddingLeft: 20 }}>
        <li><b>r und ρ:</b> Schritt 3, die Zahlen hinter <code>r =</code> und <code>rho =</code> (<a href="#k4-pearson">Pearson-r</a>).</li>
        <li><b>Die Stärke:</b> der Betrag auf dem Lineal der Faustregel (<a href="#k2-staerke">Wie stark ist stark?</a>).</li>
        <li><b>West und Ost:</b> Schritt 4, einmal mit 1 und einmal mit 2 an der markierten Stelle.</li>
        <li><b>Der Satz für einen Bericht:</b> Was in jeden Bericht über einen Zusammenhang gehört, steht im Überblick (<a href="#k5-tabelle">Voraussetzungen und Eigenheiten</a>).</li>
      </ul>
      <Mixup>„Wenn der Zusammenhang schrumpft, war er falsch.“ Er war richtig gemessen. Er sagt nur etwas anderes, als man zuerst dachte.</Mixup>
    </Card>
  </Abschnitt>;
}

/* ---------- Überblick ---------- */
export function Ueberblick() {
  return <section className="grund-block" id="g5" aria-labelledby="g5-h">
    <div className="g-kopf">
      <span className="st m c7" aria-hidden="true">✓</span>
      <div><div className="ueber">Überblick über alle Aufgaben</div><h4 id="g5-h">Maß wählen, Grenzen kennen</h4></div>
    </div>
    <p className="g-intro">In den vier Aufgaben hast du gewichtet und fünf Zusammenhangsmaße gerechnet: Cramér-V, Gamma, Tau-b, Pearson-r und Spearman-ρ. Hier steht, welches Maß wann passt und was es nicht zeigt.</p>
    <HeadingLevel.Provider value={5}>
      <Card id="k5-baum" title="Das niedrigere Skalenniveau entscheidet" badge={<Badge>Aufgabe 2, 3 und 4</Badge>} tag={{ kind: 'interpret', label: 'Hintergrund' }}>
        <MeasureTree />
        <Frage>Wie sieht das an Beispielen aus?</Frage>
        <ul className="k6-liste" style={{ margin: "4px 0 10px", paddingLeft: 20 }}>
          {/* u1 (Familienstand und Wahlabsicht) fehlt hier: Es nennt das Skalenniveau der Wahlabsicht, das Aufgabe 2 erfragt. */}
          {ASSIGN.filter(a => a.id !== 'u1').map(a => <li key={a.id}><b>{a.pair}:</b> {MEASURE_OPTIONS[a.answer]}. {a.right}</li>)}
        </ul>
        <InShort>Zähl zuerst nicht die Werte, sondern frag nach der Reihenfolge und den Abständen beider Variablen. Das niedrigere Skalenniveau entscheidet, welches Maß passt. Ein Maß für ein höheres Niveau darfst du nicht nehmen; eins für ein niedrigeres geht, verschenkt aber Information.</InShort>
      </Card>

      <Card id="k5-tabelle" title="Voraussetzungen und Eigenheiten" badge={<Badge>alle Maße</Badge>} tag={{ kind: 'interpret', label: 'Hintergrund' }}>
        <table className="daten voll">
          <caption className="sr-only">Voraussetzungen und Eigenheiten je Maß</caption>
          <thead><tr><th scope="col">Maß</th><th scope="col">braucht</th><th scope="col">Wertebereich</th><th scope="col">Richtung</th><th scope="col">in mariposa gewichtet</th><th scope="col">Vorsicht</th></tr></thead>
          <tbody>
            <tr><th scope="row">Cramér-V</th><td>nominal (oder mehr)</td><td>0 bis 1</td><td>nein</td><td>ja</td><td>Hängt auch von der Tabellengröße und den Gruppengrößen ab; Richtung aus den Prozenten lesen.</td></tr>
            <tr><th scope="row">Phi</th><td>zwei mal zwei Kategorien</td><td>0 bis 1; <code>phi()</code> in R zeigt ein Vorzeichen, −1 bis +1</td><td>nur über die Codes: welche Gruppen zusammen vorkommen</td><td>ja</td><td>Das Vorzeichen dreht sich, wenn man die Codes einer Variable tauscht; Stärke am Betrag lesen, die Gruppen an den Prozenten.</td></tr>
            <tr><th scope="row">Gamma</th><td>ordinal</td><td>−1 bis +1</td><td>ja</td><td>ja</td><td>Lässt Gleichstände weg und fällt deshalb größer aus; nur mit sinnvoller Reihenfolge.</td></tr>
            <tr><th scope="row">Tau-b</th><td>ordinal</td><td>−1 bis +1</td><td>ja</td><td>ja</td><td>Zählt Gleichstände mit; gut zum Einordnen der Stärke.</td></tr>
            <tr><th scope="row">Spearman-ρ</th><td>ordinal oder metrisch</td><td>−1 bis +1</td><td>ja</td><td>nein, rechnet immer ohne Gewicht</td><td>Robust gegen Ausreißer.</td></tr>
            <tr><th scope="row">Pearson-r</th><td>metrisch</td><td>−1 bis +1</td><td>ja</td><td>ja</td><td>Nur geradlinige Zusammenhänge; Ausreißer verzerren.</td></tr>
          </tbody>
        </table>
        <p className="box-notiz">Für alle gilt: Für Aussagen über Deutschland gewichtet rechnen und „gewichtet“ dazuschreiben; n nennen; ein Zusammenhang ist keine Ursache.</p>
      </Card>

      <Card id="k5-vergleich" title="Dieselben Daten, verschiedene Maße" badge={<Bezug href="#a3-5">zu Aufgabe 3, Schritt 6</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
        <p className="lead">Für dieselben zwei Variablen liefern verschiedene Maße verschiedene Zahlen. Schicht und Gesundheit (gewichtet, Gesundheit so gepolt, dass höher „besser“ heißt): Gamma 0,36, Tau-b 0,24. Konfession und Region (gewichtet): Phi 0,33 für „keine Konfession ja/nein“, Cramér-V 0,34 für vier Konfessionsgruppen.</p>
        <Frage>Warum kommen verschiedene Zahlen heraus?</Frage>
        <p>Weil die Maße Verschiedenes messen: Gamma übergeht die Gleichstände, Tau-b zählt sie mit, V und Phi schauen auf den Abstand von „kein Zusammenhang“, r auf eine Gerade, ρ auf Rangplätze. Am Ende von Aufgabe 3 siehst du, nach deinen Ergebnissen, fünf Maße für Zufriedenheit und Wirtschaftslage nebeneinander.</p>
        <InShort>Für dieselben Daten liefern die Maße verschiedene Zahlen, weil sie Verschiedenes messen. Vergleiche Zusammenhänge darum nur mit demselben Maß; V hat zudem kein Vorzeichen.</InShort>
        <Mixup>„Der eine Zusammenhang hat ein größeres Gamma als der andere ein V, also ist er stärker.“ Gamma und V sind verschiedene Maßstäbe; so lässt sich das nicht vergleichen.</Mixup>
      </Card>
    </HeadingLevel.Provider>
  </section>;
}

/* ---------- Themen für den Reiter „Verstehen“ (Reihenfolge, Karten für die rechte Leiste) ---------- */
export const THEMEN: Thema[] = [
  { id: 'vorweg', n: 'R', kurz: 'R lesen', titel: 'Vorweg: R lesen', minuten: 10, Inhalt: Vorweg,
    karten: [['r1', 'Ein Gewicht als Argument'], ['r2', 'Ein Zusammenhangsmaß in R']] },
  { id: 'g1', n: '1', kurz: 'Aufgabe 1', titel: 'Wie zufrieden ist Deutschland mit der Demokratie?', minuten: 15, Inhalt: Verstehen1, aufgabe: 1,
    karten: [['k1-ost', 'Der Osten ist stärker vertreten'], ['k1-gewicht', 'Wie groß ist ein Gewicht?'], ['k1-cum', 'Cum. % lesen'], ['k1-landesteil', 'Ein Landesteil'], ['k1-mischung', 'Das Mischpult'], ['k1-ergebnis', 'Ergebnis festhalten']] },
  { id: 'g2', n: '2', kurz: 'Aufgabe 2', titel: 'Zufriedenheit und Wahlabsicht', minuten: 15, Inhalt: Verstehen2, aufgabe: 2,
    karten: [['k2-niveau', 'Erst das Skalenniveau'], ['k2-tabelle', 'Zwei Gruppen und Zeilenprozente'], ['k2-erwartet', 'Ohne Zusammenhang'], ['k2-chi', 'Von χ² zu Cramér-V'], ['k2-staerke', 'Wie stark ist stark?']] },
  { id: 'g3', n: '3', kurz: 'Aufgabe 3', titel: 'Wirtschaftslage und Demokratie', minuten: 15, Inhalt: Verstehen3, aufgabe: 3,
    karten: [['k3-umpolen', 'Umpolen'], ['k3-paare', 'Gleichläufig oder gegenläufig?'], ['k3-formel', 'Gamma und Tau-b'], ['k3-richtung', 'Richtung und Vorzeichen']] },
  { id: 'g4', n: '4', kurz: 'Aufgabe 4', titel: 'Lebenszufriedenheit und Demokratie', minuten: 15, Inhalt: Verstehen4, aufgabe: 4,
    karten: [['k4-punktwolke', 'Erst das Bild: die Punktwolke'], ['k4-pearson', 'Pearson-r im Punkte-Labor'], ['k4-ausreisser', 'Pearson oder Spearman?'], ['k4-dritt', 'Die Drittvariable']] },
  { id: 'g5', n: '✓', kurz: 'Überblick', titel: 'Maß wählen, Grenzen kennen', minuten: 5, Inhalt: Ueberblick,
    karten: [['k5-baum', 'Das niedrigere Skalenniveau entscheidet'], ['k5-tabelle', 'Voraussetzungen und Eigenheiten'], ['k5-vergleich', 'Dieselben Daten, verschiedene Maße']] },
];

/* Bilder für die ausgebauten „?“-Fenster in den Aufgaben (Engine: denk(…, { bild: Name })).
   Nur Erklärbilder, die auch in „Verstehen“ stehen; keins zeigt Zahlen, nach denen die Aufgaben fragen. */
export const BILDER = {
  OstStichprobe, Gewicht: WeightBricks, Mischpult: MixingDesk, ChiQuadrat: ChiBricks, Lineal: StrengthRuler,
  GammaTau: GammaBricks, Richtung: Direction, PunkteLabor: PointLab, Drittvariable: ThirdVariable,
};
