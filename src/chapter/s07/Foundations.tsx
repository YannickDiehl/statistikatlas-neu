// Sitzung 7 „Mittelwerte vergleichen“: die vier Grundlagen und der Überblick aus sitzung07.md §4–§8, ohne R-Code zum Ausführen.
import { Badge, Card, InShort, Known, Mixup, MoreDetail } from '../blocks/Card';
import { Foundation } from '../blocks/Foundation';
import { MapLink } from '../blocks/MapLink';
import { Questions } from '../blocks/Questions';
import { ALT, G1B_Q, G1C_Q, G2C_Q, UE_QUESTIONS } from './content';
import { CorrelationMatrix, DecisionTree, EffectRuler, FFormula, FourStones, Intervals, MeansCI, TFormula, WelchFormula } from './figures/Figures';
import { FLab, NSlider, PairsCounter } from './figures/Interactive';
import { FarFromZero, SamplingMachine } from './figures/Machine';
import { ReadTukey } from './figures/ROutput';

/** Grundlage 1: Zufall oder Unterschied? (1a Stichproben-Maschine, 1b t-Wert, 1c p-Wert und Intervall, 1d Effektstärke). */
export function Foundation1() {
  return <Foundation id="g1" n={1} title="Zufall oder Unterschied?" taskHref="#a1"
    intro="Warum schwanken Mittelwerte von Stichprobe zu Stichprobe, und wie entscheidet ein Test? Vier kurze Schritte, etwa 15 Minuten.">

    <Card id="k1a" step="1a" title="Jede Stichprobe zeigt einen anderen Unterschied" badge={<Badge>Normalverteilung: kennst du aus der Vorlesung</Badge>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Stell dir vor, der ALLBUS wäre ganz Deutschland. Dort arbeiten erwerbstätige Männer im Mittel 7,99 Stunden pro Woche mehr als erwerbstätige Frauen, und bei der Lebenszufriedenheit (0 bis 10) liegen beide fast gleich: Frauen 0,01 Punkte höher.</p>
      <p className="absatz">Eine Umfrage fragt aber nie alle. Was sieht man, wenn man nur 50 Männer und 50 Frauen zufällig zieht? Zieh selbst.</p>
      <SamplingMachine />
      <InShort>Der Unterschied in einer Stichprobe schwankt von Stichprobe zu Stichprobe. Wie er schwankt, zeigt die <b>Stichprobenverteilung</b>: Sie hat annähernd die Form einer Normalverteilung, einer Glocke um den wahren Unterschied. Ihre Breite heißt <b>Standardfehler</b>: der typische Abstand zwischen dem Unterschied in einer Stichprobe und dem in der Bevölkerung.</InShort>
      <MoreDetail summary="Warum eine Normalverteilung, und warum wird sie schmaler?">
        <p>Die Arbeitsstunden selbst sind nicht normalverteilt: Viele arbeiten genau 40 Stunden, wenige 10 oder 60. Mittelwerte aus 50 Personen verteilen sich trotzdem fast wie eine Glocke. Dahinter steht der <b>zentrale Grenzwertsatz</b>: Je mehr Personen in einen Mittelwert eingehen, desto mehr ähnelt die Verteilung solcher Mittelwerte einer Glocke, egal wie die einzelnen Werte verteilt sind. Als Faustregel reichen etwa 30 Personen je Gruppe; bei sehr schief verteilten Werten braucht es mehr.</p>
        <p>Mit mehr Befragten wird die Glocke schmaler, der Standardfehler also kleiner. Bei 50 Männern und 50 Frauen liegt er für die Arbeitsstunden bei etwa 1,88 Stunden (in den 1.000 Stichproben: 1,83). Mit dem ganzen ALLBUS, über 1.400 je Gruppe, sind es nur noch 0,35 Stunden. Wie man ihn ausrechnet, zeigt <a href="#k1b">Karte 1b</a>.</p>
        <p>Gezogen wird hier so, dass jede Person mit ihrem Gewicht <code>wghtpew</code> zum Zug kommt; so steht der ALLBUS für Deutschland. Gezeigt werden nur Mittelwerte von je 50 Personen, keine einzelnen Antworten.</p>
      </MoreDetail>
      <Mixup>Standardabweichung und Standardfehler. Die Standardabweichung (kennst du aus Sitzung 3) misst, wie stark <b>einzelne Personen</b> streuen: Bei den Arbeitsstunden der Männer 8,4 Stunden. Der Standardfehler misst, wie stark <b>Mittelwerte oder Unterschiede</b> von Stichprobe zu Stichprobe schwanken. Er wird mit mehr Befragten kleiner, die Standardabweichung nicht.</Mixup>
      <MapLink concept="sd">Standardabweichung</MapLink>
    </Card>

    <Card id="k1b" step="1b" title="Der t-Wert: Unterschied durch Standardfehler" tag={{ kind: 'picture', label: 'Formel lesen' }}>
      <p className="lead">Wir haben nie 1.000 Stichproben, sondern eine. Wie entscheidet man mit einer einzigen, ob ein Unterschied echt ist? Man vergleicht ihn mit dem Standardfehler: Ist der Unterschied viel größer als das, was der Zufall typischerweise anrichtet?</p>
      <TFormula />
      <p className="absatz">Ein t von 23 heißt: Der Unterschied ist 23-mal so groß wie das, was der Zufall typischerweise anrichtet. Bei der Lebenszufriedenheit ist es umgekehrt: Unterschied −0,010, Standardfehler 0,054, t = −0,19. Der Unterschied ist viel kleiner als sein Standardfehler.</p>
      <p className="absatz">Mit nur 50 je Gruppe wäre der Standardfehler der Arbeitsstunden √(8,443² ÷ 50 + 10,287² ÷ 50) = √(1,4257 + 2,1164) ≈ 1,88 Stunden und t ≈ 7,99 ÷ 1,88 ≈ 4,2. Kleinere Stichprobe, größerer Standardfehler, kleineres t.</p>
      <div className="kurzueberlegen">
        <p>Kurz überlegen</p>
        <Questions id="g1b-frage" questions={[G1B_Q]} />
      </div>
      <InShort>Der <b>t-Wert</b> teilt den Unterschied der Mittelwerte durch seinen Standardfehler, im Bild: Signal durch Rauschen. Je weiter t von 0 weg ist, desto weniger lässt sich der Unterschied mit Zufall erklären. Der <b>t-Test für unabhängige Stichproben</b> vergleicht so die Mittelwerte zweier Gruppen.</InShort>
      <MoreDetail summary="Freiheitsgrade (df)">
        <p>In der Ausgabe steht neben t die Spalte df (Freiheitsgrade). Sie hängt an der Zahl der Befragten und bestimmt, wie streng R das t beurteilt. Bei mehr als etwa 100 Befragten spielt sie kaum noch eine Rolle. Dass df beim Welch-Test eine krumme Zahl ist (2763.588), ist richtig so.</p>
      </MoreDetail>
      <Mixup>Das Vorzeichen von t sagt nur, welche Gruppe höher liegt, nicht wie deutlich. t = −12 ist genauso deutlich wie t = +12.</Mixup>
    </Card>

    <Card id="k1c" step="1c" title="p-Wert und Konfidenzintervall in Worten" tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Zurück zur Lebenszufriedenheit, bei der es (fast) keinen Unterschied gibt. In Stichprobe 12 lagen die Frauen trotzdem 0,60 Punkte vorn. Wie ungewöhnlich ist so ein Unterschied, wenn es in Wahrheit keinen gibt?</p>
      <h6 className="zwischen">Wie oft passiert das ohne echten Unterschied?</h6>
      <FarFromZero />
      <p className="absatz">Genau das misst der <b>p-Wert</b>: Angenommen, in der Bevölkerung gäbe es keinen Unterschied (die <b>Nullhypothese</b>). Wie oft käme dann ein Unterschied heraus, der mindestens so weit von 0 entfernt ist wie der in meiner Stichprobe? Für die 0,60 Punkte aus Stichprobe 12: in 127 von 1.000 Stichproben, also in etwa 13 von 100. Das ist nicht selten. Ein Unterschied von 0,8 Punkten käme dagegen nur in etwa 4 von 100 Stichproben vor.</p>
      <p className="absatz">R zieht dafür nicht 1.000 Stichproben. Es nimmt die Glocke aus 1a als Formel, mit dem Standardfehler aus 1b, und liest dort ab, welcher Anteil der Glocke mindestens so weit von 0 entfernt liegt wie der gefundene Unterschied, auf beiden Seiten zusammen. Für Stichprobe 12 kommt R so auf p = 0,11, also nah an den 13 von 100 aus dem Stapel. (Ganz gleich sind die Zahlen nicht, weil R nur die eine Stichprobe kennt und deren Standardfehler schätzt.)</p>
      <p className="absatz">Ist p kleiner als 0,05, nennt man den Unterschied <b>signifikant</b>: Er wäre ohne echten Unterschied selten. Die Grenze 0,05 heißt <b>Signifikanzniveau</b>, kurz α (Alpha). Sie ist eine Abmachung, keine Naturkonstante.</p>
      <p className="absatz"><Known session={5} /> Ein Stück davon kennst du schon: In Sitzung 5 hat der Chi-Quadrat-Test „p &lt; 0.001“ gemeldet, und dort stand „kaum durch Zufall zu erklären“. In Sitzung 6 standen p-Wert und Sterne neben den Zusammenhangsmaßen, und du hast sie liegen lassen. Jetzt weißt du, was dahintersteckt; es ist bei allen Tests dieselbe Logik.</p>
      <h6 className="zwischen">20 Konfidenzintervalle</h6>
      <p className="unter-zwischen">Je ein 95-%-Intervall der Arbeitsstunden-Stichproben 1 bis 20 aus 1a, der Punkt in der Mitte ist der Unterschied der Stichprobe.</p>
      <Intervals />
      <p className="absatz">Das <b>95-%-Konfidenzintervall</b> ist der Bereich, in dem der Unterschied in der Bevölkerung plausibel liegt. Auf lange Sicht treffen etwa 95 von 100 solcher Intervalle den wahren Wert; hier waren es 963 von 1.000. Liegt die 0 nicht im Intervall, ist der Unterschied signifikant (p &lt; 0,05). Liegt sie darin, kann man „kein Unterschied“ nicht ausschließen.</p>
      <div className="kurzueberlegen">
        <p>Kurz überlegen</p>
        <Questions id="g1c-frage" questions={[G1C_Q]} />
      </div>
      <InShort>Der <b>p-Wert</b> sagt, wie oft ein mindestens so großer Unterschied vorkäme, wenn es in der Bevölkerung keinen gäbe (Nullhypothese). Unter 0,05 (dem Signifikanzniveau α) heißt <b>signifikant</b>. Das <b>Konfidenzintervall</b> zeigt, wo der wahre Unterschied plausibel liegt; enthält es die 0, ist der Unterschied nicht signifikant.</InShort>
      <MoreDetail summary="Fehler erster Art und Sterne">
        <p>Auch ohne echten Unterschied meldet der Test manchmal „signifikant“: Bei der Lebenszufriedenheit war das in 54 von 1.000 Stichproben so, gut 5 %. Das ist der Preis der 5-%-Grenze, ein <b>Fehler 1. Art</b> (Fehlalarm, auch Alpha-Fehler, weil seine Wahrscheinlichkeit gerade α ist). Er wird in <a href="#thema3">Thema 3</a> wichtig, wenn man viele Tests auf einmal rechnet.</p>
        <p>Die Sterne in der R-Ausgabe übersetzen p: * heißt p &lt; 0,05, ** p &lt; 0,01, *** p &lt; 0,001. In Sitzung 6 standen sie schon neben den Zusammenhangsmaßen; sie bedeuten dort dasselbe.</p>
      </MoreDetail>
      <Mixup>„p = 0,03 heißt: Mit 3 % Wahrscheinlichkeit ist das Ergebnis Zufall.“ Nein. p setzt voraus, dass es keinen Unterschied gibt, und fragt, wie selten die Daten dann wären. Wie wahrscheinlich die Nullhypothese selbst ist, sagt p nicht.</Mixup>
    </Card>

    <Card id="k1d" step="1d" title="Wie groß ist der Unterschied? Die Effektstärke" tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Bei den Arbeitsstunden liegen Männer 7,99 Stunden vorn. Ist das viel? Das hängt davon ab, wie stark die Stunden ohnehin streuen. Die <b>Effektstärke</b> misst den Unterschied in Standardabweichungen: 7,988 ÷ 9,38 (gemeinsame Standardabweichung beider Gruppen) ≈ 0,85. Die beiden Gruppen liegen also knapp eine Standardabweichung auseinander.</p>
      <EffectRuler />
      <InShort><b>Cohen&apos;s d</b> teilt den Unterschied durch die gemeinsame Standardabweichung. <b>Hedges&apos; g</b> ist dasselbe mit einer kleinen Korrektur; mariposa empfiehlt es und zeigt es in der Kurzfassung. Faustregel nach Cohen: ab 0,2 klein, ab 0,5 mittel, ab 0,8 groß. Das Vorzeichen zeigt nur die Richtung.</InShort>
      <MoreDetail summary="Warum eine eigene Zahl für die Größe?">
        <p>t und p hängen an der Zahl der Befragten, die Effektstärke nicht. Mit sehr vielen Befragten wird auch ein winziger Unterschied signifikant (mehr in <a href="#g2">Grundlage 2</a>). Darum berichtet man immer beides: ob ein Unterschied über den Zufall hinausgeht (p, Konfidenzintervall) und wie groß er ist (Effektstärke). mariposa schreibt die Einordnung gleich dazu: negligible, small, medium, large.</p>
      </MoreDetail>
      <Mixup>Effektstärke und Unterschied in der Einheit. 7,99 Stunden ist ein Unterschied in Stunden, 0,85 eine Effektstärke ohne Einheit. Die Effektstärke erlaubt Vergleiche zwischen Variablen mit verschiedenen Skalen.</Mixup>
    </Card>
  </Foundation>;
}

/** Grundlage 2: Signifikant, groß oder beides? (2a n-Regler, 2b Voraussetzungen, 2c Welch oder Student). */
export function Foundation2() {
  return <Foundation id="g2" n={2} title="Signifikant, groß oder beides?" taskHref="#a2"
    intro="Was ein Test braucht und wann man ihm nicht trauen sollte. Drei Schritte, etwa 10 Minuten.">

    <Card id="k2a" step="2a" title="Signifikant oder groß?" tag={{ kind: 'picture', label: 'Ausprobieren' }}>
      <p className="lead">Der ALLBUS fragt auch, wie wichtig einem Politik und öffentliches Leben sind (<code>li07</code>, 1 = unwichtig bis 7 = sehr wichtig). Männer sagen im Mittel 4,52, Frauen 4,41. Der Unterschied ist 0,11 Punkte, p = 0,011: signifikant. Hedges&apos; g ist aber nur 0,07, vernachlässigbar. Wie geht das zusammen?</p>
      <NSlider />
      <InShort>Ob ein Unterschied <b>signifikant</b> ist, hängt an seiner Größe <b>und</b> an der Zahl der Befragten. Mit genug Befragten wird jeder noch so kleine Unterschied signifikant. Ob er <b>bedeutsam</b> ist, sagt die Effektstärke und die inhaltliche Überlegung.</InShort>
      <MoreDetail summary="Was heißt das für den ALLBUS?">
        <p>Mit über 5.000 Befragten sind im ALLBUS viele Unterschiede signifikant, die im Alltag kaum zu spüren sind. Darum gehören zu jedem Testergebnis die Mittelwerte, der Unterschied in der Einheit der Frage und die Effektstärke. Umgekehrt ist ein nicht signifikanter Unterschied in einer kleinen Gruppe kein Beweis, dass es keinen gibt (<a href="#k1c">Karte 1c</a>).</p>
      </MoreDetail>
      <Mixup>„Hochsignifikant“ heißt „großer Unterschied“. Nein: Bei der Wichtigkeit von Politik liegen Männer und Frauen signifikant auseinander (p = 0,011), aber nur um 0,07 Standardabweichungen.</Mixup>
    </Card>

    <Card id="k2b" step="2b" title="Wann passt ein t-Test? Die Voraussetzungen" tag={{ kind: 'interpret', label: 'Prüfen' }}>
      <p className="lead">Ein t-Test rechnet immer, auch wenn er nicht passt. Darum prüfst du vorher vier Dinge.</p>
      <FourStones items={[
        <><b>Metrische abhängige Variable.</b> Einen Mittelwert darfst du berechnen, wenn die Abstände zwischen den Werten gleich viel bedeuten (kennst du aus Sitzung 4). Stunden und Alter sind metrisch. Skalen mit sieben oder mehr geordneten Stufen wie das Vertrauen (1 bis 7) oder die Links-rechts-Einstufung (1 bis 10) behandelt man in den Sozialwissenschaften meist wie metrisch; das ist eine Annahme, die du nennen solltest. Bei wenigen Stufen ohne gleiche Abstände nimmst du die Kreuztabelle (Sitzung 5) oder ein Rangmaß (Sitzung 6).</>,
        <><b>Zwei unabhängige Gruppen.</b> Jede Person gehört zu genau einer Gruppe, und die Gruppen beeinflussen sich nicht. Dieselben Personen zweimal befragt (vorher und nachher) wären verbundene Stichproben; dafür gibt es andere Tests.</>,
        <><b>Genug Befragte je Gruppe.</b> Ab etwa 30 je Gruppe verteilen sich die Mittelwerte annähernd wie eine Glocke, auch wenn die Werte selbst schief verteilt sind (<a href="#k1a">Karte 1a</a>); bei sehr schiefen Werten braucht es mehr. Bei sehr kleinen Gruppen müssten die Werte selbst ungefähr normalverteilt sein.</>,
        <><b>Ähnliche Streuung? Nicht nötig mit Welch.</b> Der klassische t-Test (nach Student) nimmt an, dass beide Gruppen gleich stark streuen. Der Welch-Test braucht das nicht (<a href="#k2c">Karte 2c</a>).</>,
      ]} />
      <p className="absatz">Für Aussagen über ganz Deutschland gewichtest du (Sitzung 6).</p>
      <InShort><b>Voraussetzungen des t-Tests:</b> metrische abhängige Variable, zwei unabhängige Gruppen, genug Befragte je Gruppe (Faustregel 30). Gleiche Streuung braucht nur der klassische Test; der Welch-Test kommt ohne aus.</InShort>
      <MoreDetail summary="Und wenn die Gruppenvariable drei Stufen hat?">
        <p>Dann rechnet <code>t_test()</code> gar nicht erst und meldet, dass es genau zwei Gruppen braucht. Entweder du fasst mit <code>rec()</code> zu zwei Gruppen zusammen (wie bei <code>abitur</code>), oder du nimmst die Varianzanalyse aus <a href="#thema3">Thema 3</a>.</p>
      </MoreDetail>
      <Mixup>„Der t-Test braucht normalverteilte Daten.“ Bei großen Gruppen nicht: Es genügt, dass die <b>Mittelwerte</b> annähernd normalverteilt sind, und dafür sorgt bei großen Gruppen schon ihre Größe (zentraler Grenzwertsatz, <a href="#k1a">Karte 1a</a>).</Mixup>
    </Card>

    <Card id="k2c" step="2c" title="Welch oder Student? Zwei Zeilen in der Ausgabe" tag={{ kind: 'picture', label: 'Formel lesen' }}>
      <p className="lead">Zum Beispiel: Gruppe A hat 400 Befragte, die eng beieinander liegen (Standardabweichung 1). Gruppe B hat 40 Befragte, die stark streuen (Standardabweichung 3). B liegt im Mittel 0,8 Punkte höher.</p>
      <WelchFormula />
      <p className="absatz">Student nimmt eine gemeinsame Streuung an. Weil Gruppe A groß ist und eng liegt, unterschätzt er, wie unsicher der Mittelwert der kleinen, stark streuenden Gruppe B ist. Welch nimmt jede Gruppe mit ihrer eigenen Streuung und Größe. Sind die Gruppen gleich groß oder streuen sie ähnlich, kommen beide fast auf dasselbe (wie bei den Arbeitsstunden: 23,144 gegen 22,988).</p>
      <div className="kurzueberlegen">
        <p>Kurz überlegen</p>
        <Questions id="g2c-frage" questions={[G2C_Q]} />
      </div>
      <InShort>Der <b>Welch-Test</b> rechnet den Standardfehler mit der Streuung jeder Gruppe für sich und braucht deshalb keine gleichen Streuungen (<b>Varianzhomogenität</b>). In mariposa ist er die Zeile „Equal variances not assumed“ und steht in der Kurzfassung. Lies immer diese Zeile.</InShort>
      <MoreDetail summary="Wie erkenne ich ungleiche Streuung?">
        <p>Vergleiche in der Gruppentabelle die Spalte „Std. Deviation“. Als Faustregel gilt: Ist die größte Standardabweichung mehr als doppelt so groß wie die kleinste, unterscheiden sich die Streuungen deutlich. Mit Welch bist du in jedem Fall auf der sicheren Seite. Einen eigenen Test dafür (Levene-Test) lernst du in Sitzung 9 kennen.</p>
      </MoreDetail>
      <Mixup>„Equal variances not assumed“ heißt nicht, dass die Streuungen ungleich <b>sind</b>. Es heißt nur, dass der Test es nicht <b>voraussetzt</b>.</Mixup>
    </Card>
  </Foundation>;
}

/** Grundlage 3: Mehr als zwei Gruppen (3a Paare zählen, 3b F-Labor und F als Bausteine, 3c Tukey). */
export function Foundation3() {
  return <Foundation id="g3" n={3} title="Mehr als zwei Gruppen" taskHref="#a3"
    intro="Warum man bei drei oder mehr Gruppen nicht einfach viele t-Tests rechnet, und was der F-Wert misst. Drei Schritte, etwa 15 Minuten.">

    <Card id="k3a" step="3a" title="Viele Paare, viele Tests: Alpha-Fehler-Kumulierung" tag={{ kind: 'picture', label: 'Ausprobieren' }}>
      <p className="lead">Der ALLBUS wurde auf drei Wegen erhoben: persönliches Interview (CAPI), online (CAWI) und auf Papier (MAIL), kennst du aus Sitzung 4. Sind die Befragten auf den drei Wegen unterschiedlich alt? Mit t-Tests bräuchtest du drei Vergleiche: CAPI–CAWI, CAPI–MAIL, CAWI–MAIL. Bei fünf Gruppen wären es schon zehn.</p>
      <PairsCounter />
      <p className="absatz">Jeder einzelne Test hat ein Risiko von 5 % für einen Fehler 1. Art, einen Fehlalarm (<a href="#k1c">Karte 1c</a>: 54 von 1.000). Rechnest du zehn Tests, ist die Chance, dass mindestens einer fälschlich anschlägt, schon etwa 40 %. (Gerechnet als 1 − 0,95 hoch Anzahl der Paare, als wären die Tests unabhängig.)</p>
      <InShort>Viele Tests auf einmal häufen Fehler 1. Art an (<b>Alpha-Fehler-Kumulierung</b>). Die <b>einfaktorielle Varianzanalyse (ANOVA)</b> prüft deshalb mit einem einzigen Test, ob sich irgendwelche Gruppenmittelwerte unterscheiden. Welche, sagt danach ein Test für Paare, der die Zahl der Vergleiche einrechnet (<a href="#k3c">Karte 3c</a>).</InShort>
      <Mixup>„Mehr Tests = gründlicher.“ Ohne Korrektur heißt mehr Tests vor allem: mehr Zufallstreffer, also Fehler 1. Art.</Mixup>
    </Card>

    <Card id="k3b" step="3b" title="Zwischen den Gruppen gegen innerhalb der Gruppen: F" tag={{ kind: 'picture', label: 'Formel lesen' }}>
      <p className="lead">Die ANOVA stellt dieselbe Frage wie der t-Test, Signal gegen Rauschen, nur mit mehr Gruppen. Das Signal ist, wie weit die Gruppenmittelwerte auseinanderliegen. Das Rauschen ist, wie stark die Befragten <b>innerhalb</b> ihrer Gruppe streuen.</p>
      <h6 className="zwischen">F-Labor</h6>
      <p className="unter-zwischen">Stell Abstand und Streuung ein und beobachte F.</p>
      <FLab />
      <h6 className="zwischen">F als Bausteine</h6>
      <p className="unter-zwischen">Mit den echten Zahlen für das Alter nach Erhebungsweg (gewichtet).</p>
      <FFormula />
      <MapLink concept="ss">Quadratsumme (Sum of Squares)</MapLink>
      <InShort>Der <b>F-Wert</b> teilt die mittlere Streuung <b>zwischen</b> den Gruppen durch die mittlere Streuung <b>innerhalb</b> der Gruppen. Ist F groß und p &lt; 0,05, unterscheiden sich mindestens zwei Gruppen im Mittel (welche, sagt <a href="#k3c">Karte 3c</a>). <b>Eta-Quadrat (η²)</b> ist die Effektstärke: der Anteil der gesamten Streuung, der mit der Gruppe zusammenhängt. Faustregel: ab 0,01 klein, ab 0,06 mittel, ab 0,14 groß.</InShort>
      <MoreDetail summary="Warum „Varianzanalyse“, wenn sie Mittelwerte vergleicht?">
        <p>Weil sie dafür zwei Streuungen (Varianzen) vergleicht: die der Gruppenmittelwerte um das Gesamtmittel und die der Befragten um ihr Gruppenmittel. Bei zwei Gruppen kommt die ANOVA zum selben p wie der klassische t-Test; F ist dann genau t².</p>
      </MoreDetail>
      <Mixup>η² = 0,058 heißt nicht „5,8 % der Befragten“. Es heißt: 5,8 % der Unterschiede im Alter gehen damit einher, auf welchem Weg jemand befragt wurde. Die übrigen 94,2 % liegen innerhalb der Wege.</Mixup>
    </Card>

    <Card id="k3c" step="3c" title="Welche Gruppen genau? Der Tukey-Test" tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Die ANOVA für das Alter nach Erhebungsweg ergibt F = 160,99, p &lt; 0,001, η² = 0,058. Irgendwo gibt es also Unterschiede. Wo genau, sagt der <b>Tukey-Test</b> (Fachbegriff: Post-hoc-Test, „danach“). Er vergleicht alle Paare und rechnet dabei ein, dass es mehrere Vergleiche sind.</p>
      <h6 className="zwischen">Mittelwerte mit Intervall</h6>
      <MeansCI />
      <h6 className="zwischen">Tukey-Tabelle lesen</h6>
      <ReadTukey after={<p className="absatz">{ALT.tukeyAge}</p>} />
      <p className="absatz">In der ANOVA-Ausgabe steht außerdem eine Zeile „Welch“ unter „Robust Tests of Equality of Means“. Sie ist die Welch-Fassung der ANOVA und braucht, wie in <a href="#k2c">Karte 2c</a>, keine gleichen Streuungen. Hier: 166,127, ebenfalls p &lt; 0,001. Kommen klassische Zeile und Welch-Zeile zum selben Schluss, kannst du dich auf das Ergebnis verlassen. Die Streuungen liegen hier eng beieinander: größte durch kleinste Standardabweichung 18,26 ÷ 16,59 ≈ 1,10.</p>
      <InShort>Nach einer signifikanten ANOVA zeigt der <b>Tukey-Test</b>, welche Paare sich unterscheiden. Seine p-Werte sind für die Zahl der Vergleiche <b>korrigiert</b> (adjustiert). Ein Paar unterscheidet sich signifikant, wenn p &lt; 0,05 ist; dann enthält auch sein Intervall die 0 nicht.</InShort>
      <MoreDetail summary="Voraussetzungen der ANOVA">
        <p>Dieselben wie beim t-Test: metrische abhängige Variable, unabhängige Gruppen, genug Befragte je Gruppe. Die klassische ANOVA und Tukey setzen zusätzlich ähnliche Streuungen voraus; prüf das an der Spalte Std. Deviation (Faustregel: größte höchstens doppelt so groß wie die kleinste) und an der Welch-Zeile. Bei sehr kleinen Gruppen wird jeder Vergleich mit dieser Gruppe unsicher.</p>
      </MoreDetail>
      <Mixup>„ANOVA signifikant = alle Gruppen unterscheiden sich.“ Nein: Es reicht, dass sich eine Gruppe von einer anderen unterscheidet. Welche, sagt erst Tukey, und oft sind es nicht alle Paare.</Mixup>
    </Card>
  </Foundation>;
}

/** Grundlage 4: Viele Paare auf einen Blick (4a Korrelationsmatrix lesen). */
export function Foundation4() {
  return <Foundation id="g4" n={4} title="Viele Paare auf einen Blick" taskHref="#a4"
    intro="Wie man eine Korrelationsmatrix liest. Ein Schritt, etwa 8 Minuten.">
    <Card id="k4a" step="4a" title="Die Korrelationsmatrix lesen" badge={<Known session={6} what="Pearsons r" />} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Hängen Alter, Arbeitsstunden, Lebenszufriedenheit und Gesundheit zusammen? Pearsons r kennst du aus Sitzung 6 für ein Paar. Gibst du <code>pearson_cor()</code> vier Variablen, rechnet es alle sechs Paare auf einmal und legt sie in eine Tabelle: die <b>Korrelationsmatrix</b>.</p>
      <CorrelationMatrix />
      <p className="absatz">Am stärksten hängen Lebenszufriedenheit und Gesundheit zusammen: r = −0,38 (95-%-KI −0,403 bis −0,357). Das Minus erschreckt nur auf den ersten Blick: Bei <code>hs01</code> heißt 1 „sehr gut“ und 5 „schlecht“. Wer seine Gesundheit schlechter einschätzt (höhere Zahl), ist also im Mittel weniger zufrieden. Die Gesundheit hat nur fünf geordnete Stufen; für die Übersicht steht sie hier mit in der Matrix, für eine genaue Aussage über dieses eine Paar wäre Spearman-ρ passender (kennst du aus Sitzung 6). Die Arbeitsstunden hängen mit keiner der drei anderen Variablen signifikant zusammen; sie haben nur rund 2.950 Erwerbstätige angegeben.</p>
      <InShort>Eine <b>Korrelationsmatrix</b> zeigt die Korrelation jedes Paars aus mehreren Variablen. Die Diagonale ist immer 1, die beiden Hälften sind gleich. Jedes Paar hat sein eigenes N (<b>paarweiser Ausschluss</b>) und seinen eigenen Test.</InShort>
      <MoreDetail summary="Viele Paare, viele Tests">
        <p>Vier Variablen ergeben 6 Paare, zehn Variablen schon 45. Jedes Paar ist ein eigener Test mit 5 % Risiko für einen Fehler 1. Art (<a href="#thema3">Thema 3</a>). Gäbe es zwischen zehn Variablen gar keinen Zusammenhang, würden trotzdem im Mittel etwa zwei Paare (45 × 0,05 = 2,25) Sterne bekommen. Darum achtest du in großen Matrizen vor allem auf starke und inhaltlich erwartete Zusammenhänge, nicht auf einzelne Sterne. Und wie beim t-Test gilt: Bei Tausenden Befragten sind auch sehr kleine r signifikant (age × ls01: r = 0,075).</p>
      </MoreDetail>
      <Mixup>Ein Minus heißt nicht „schlecht“ oder „kein Zusammenhang“. Es sagt nur die Richtung: Steigt die eine Zahl, sinkt die andere. Was das inhaltlich heißt, hängt davon ab, wie die Variablen kodiert sind.</Mixup>
      <MapLink concept="pearson">Pearson-Korrelation</MapLink>
    </Card>
  </Foundation>;
}

/** Überblick: welches Verfahren (Entscheidungsbaum, Zuordnen), Voraussetzungen und Bericht. */
export function Overview() {
  return <Foundation id="g5" n="✓" title="Vergleichen, prüfen, berichten" eyebrow="Überblick zu allen Aufgaben"
    intro="Alle vier Themen zusammen: welches Verfahren wann passt, was es voraussetzt und was in einen Bericht gehört.">
    <Card id="kue1" step="Ü1" title="Welches Verfahren?" tag={{ kind: 'estimate', label: 'Zuordnen' }}>
      <DecisionTree />
      <div className="kurzueberlegen weiss">
        <p>Ordne jeder Frage ein Verfahren zu</p>
        <Questions id="ue-fragen" questions={UE_QUESTIONS} />
      </div>
      <InShort>Erst das Skalenniveau, dann die Zahl der Gruppen. Zwei Gruppen: t-Test. Drei oder mehr: ANOVA mit Tukey. Zwei metrische Variablen: Korrelation.</InShort>
    </Card>

    <Card id="kue2" step="Ü2" title="Voraussetzungen und Bericht" tag={{ kind: 'interpret', label: 'Berichten' }}>
      <div className="box-gruen">
        <h6>Voraussetzungen je Verfahren</h6>
        <table className="daten voll">
          <caption className="sr-only">Voraussetzungen je Verfahren</caption>
          <thead><tr><th scope="col">Verfahren</th><th scope="col">braucht</th><th scope="col">Vorsicht</th></tr></thead>
          <tbody>
            <tr><td>t-Test</td><td>metrische Variable, zwei unabhängige Gruppen, genug Befragte je Gruppe (Faustregel 30)</td><td>Welch-Zeile lesen. Signifikant heißt nicht groß: Hedges&apos; g nennen.</td></tr>
            <tr><td>ANOVA</td><td>wie t-Test, drei oder mehr Gruppen</td><td>Klassisches F und Tukey setzen ähnliche Streuungen voraus: Std. Deviation vergleichen, Welch-Zeile prüfen. η² nennen.</td></tr>
            <tr><td>Tukey</td><td>eine ANOVA davor</td><td>Kleine Gruppen machen Vergleiche unsicher; nicht signifikant heißt nicht gleich.</td></tr>
            <tr><td>Korrelationsmatrix</td><td>metrische Variablen (oder viele geordnete Stufen)</td><td>Viele Paare, viele Fehler 1. Art; Vorzeichen nach Kodierung lesen; N je Paar verschieden.</td></tr>
          </tbody>
        </table>
        <p className="box-notiz">Für alle gilt: Ein Test sagt, ob ein Unterschied über den Zufall hinausgeht, nicht warum es ihn gibt. Ob das Abitur, der Wohnort oder etwas Drittes dahintersteckt (Drittvariable, kennst du aus Sitzung 6), klärt kein Mittelwertvergleich. Und für Aussagen über Deutschland gewichtest du.</p>
      </div>
      <h6 className="zwischen">So berichtest du einen Mittelwertvergleich</h6>
      <p className="unter-zwischen">Ein Muster mit dem Beispiel aus Grundlage 1:</p>
      <blockquote className="s07-bericht">„Erwerbstätige Männer arbeiten im Mittel 41,6 Stunden pro Woche, erwerbstätige Frauen 33,6 Stunden. Der Unterschied von 8,0 Stunden (95-%-KI 7,3 bis 8,7) ist signifikant (Welch-t = 22,99, p &lt; 0,001) und groß (Hedges&apos; g = 0,85). ALLBUS 2023, gewichtet, gewichtetes N = 2.957.“</blockquote>
      <p className="absatz"><b>Bausteine eines Berichts:</b></p>
      <ul>
        <li>Mittelwerte beider Gruppen</li>
        <li>Unterschied mit Einheit und Intervall</li>
        <li>Test mit p</li>
        <li>Effektstärke</li>
        <li>Quelle, Fallzahl, gewichtet. Zur Fallzahl: Mit Gewicht druckt R unter N die Summe der Gewichte; schreib dann „gewichtetes N“ (gezählt waren es hier 2.933 Erwerbstätige).</li>
      </ul>
      <Mixup>„Signifikant = bewiesen.“ Ein Test macht einen Zufallsbefund unwahrscheinlich, beweist aber nichts, schon gar keine Ursache.</Mixup>
    </Card>
  </Foundation>;
}
