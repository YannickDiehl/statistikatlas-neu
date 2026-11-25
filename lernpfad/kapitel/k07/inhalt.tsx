// Kapitel 7, Reiter „Verstehen“ (Muster: k04/KONZEPT.md): je Aufgabe erklären, was in jedem Schritt passiert und warum.
// Keine Übungen: Die „Kurz überlegen“-Fragen der alten Grundlagen (g1b, g1c, g2c) und das Zuordnen im Überblick (ue1–ue4)
// stehen hier als rhetorische Fragen mit ihrer Antwort. Karten-IDs der alten Grundlagen (k1a … k4a) bleiben, weil
// „Ein t-Test in R“ (ReadR) auf sie verweist.
import { Badge, Card, InShort, Known, Mixup, MoreDetail } from '@atlas/chapter/blocks/Card';
import { HeadingLevel } from '@atlas/chapter/blocks/level';
import { ReadR } from '@atlas/chapter/s07/ReadR';
import { ALT, A1_SHORT } from '@atlas/chapter/s07/content';
import { CorrelationMatrix, DecisionTree, EffectRuler, FFormula, FourStones, Intervals, MeansCI, TFormula, WelchFormula } from '@atlas/chapter/s07/figures/Figures';
import { NSlider } from '@atlas/chapter/s07/figures/Interactive';
import { FarFromZero } from '@atlas/chapter/s07/figures/Machine';
import { ReadAnova, ReadTukey } from '@atlas/chapter/s07/figures/ROutput';
import '@atlas/chapter/s07/s07.css';
import type { Thema } from '../../react/typen';
import { Abschnitt, Bezug, Code, Frage } from '../../react/gemeinsam';
import { Begriff } from '@lernpfad/Begriff';
import { FLabor, PaareZaehlen, StichprobenMaschine } from './figuren';

/* Verweise zwischen den Themen: Liegt die Zielkarte in einem anderen (verborgenen) Thema, schaltet „Verstehen“ dorthin um.
   Verweise in die Aufgaben (#a…) behandelt die Engine selbst. */
if (typeof document !== 'undefined') {
  document.addEventListener('click', e => {
    const a = (e.target as Element | null)?.closest?.('#p-verstehen a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href')!.slice(1);
    if (!id || /^a\d/.test(id)) return;
    const ziel = document.getElementById(id);
    if (!ziel || !ziel.closest('[data-thema][hidden]')) return;
    e.preventDefault();
    (window as unknown as { Verstehen?: { zeige(id: string): void } }).Verstehen?.zeige(id);
  });
}

/* ---------- Vorweg ---------- */
export function Vorweg() {
  return <section className="grund-block" id="vorweg" aria-labelledby="vorweg-h">
    <div className="g-kopf">
      <span className="st m c7" aria-hidden="true">R</span>
      <div><div className="ueber">Vorweg, für alle Aufgaben</div><h4 id="vorweg-h">R lesen</h4></div>
    </div>
    <p className="g-intro">Alle vier Aufgaben arbeiten mit Tests aus mariposa: <code>t_test()</code>, <code>oneway_anova()</code> mit <code>tukey_test()</code> und <code>pearson_cor()</code>. Hier steht, wie so eine Kette aufgebaut ist und wie du die Ausgabe eines t-Tests Zeile für Zeile liest.</p>
    <HeadingLevel.Provider value={5}><ReadR /></HeadingLevel.Provider>
  </section>;
}

/* ---------- Aufgabe 1 ---------- */
export function Verstehen1() {
  return <Abschnitt id="g1" n={1} titel="Vertrauen in den Bundestag" frage="Vertrauen Menschen mit Abitur dem Bundestag mehr als Menschen ohne Abitur?"
    ziel="eine Antwort darauf, um wie viel sich die beiden Gruppen im Mittel unterscheiden, ob der Unterschied über den Zufall hinausgeht und wie groß er ist."
    weg={[
      ['Schritt 1', '#a1-p', 'Erst festlegen: Welche Gruppe vertraut dem Bundestag mehr?', 'k1-gruppen'],
      ['Schritt 2', '#a1-1', 'die Vorlage lesen: rec() bildet die Gruppen, t_test() vergleicht', 'k1-vorlage'],
      ['Schritt 2', '#a1-1', 'warum der Unterschied von Stichprobe zu Stichprobe schwankt', 'k1a'],
      ['Schritt 2', '#a1-1', 'die Zahl t: Unterschied durch Standardfehler', 'k1b'],
      ['Schritt 3', '#a1-2', 'die ganze Tabelle mit summary()', 'k1-tabelle'],
      ['Schritt 3', '#a1-2', 'p-Wert und Konfidenzintervall', 'k1c'],
      ['Schritt 3', '#a1-2', 'Hedges\' g: Wie groß ist der Unterschied?', 'k1d'],
      ['Schritt 4', '#a1-3', 'Ergebnis festhalten in der Reihenfolge eines Berichts', 'k1-ergebnis'],
    ]}>

    <Card id="k1-gruppen" title="Worum es geht: zwei Gruppen, ein Mittelwert" badge={<Bezug href="#a1-p">zu Schritt 1</Bezug>} tag={{ kind: 'interpret', label: 'Hintergrund' }}>
      <p className="lead">Die Frage vergleicht zwei Gruppen, Menschen mit und ohne Abitur, und zwar ihr <b>mittleres</b> Vertrauen in den Bundestag (<code>pt03</code>, 1 = gar kein Vertrauen bis 7 = großes Vertrauen).</p>
      <Frage>Darf man bei einer Skala von 1 bis 7 einen Mittelwert rechnen?</Frage>
      <p>Einen <Begriff id="mittelwert">Mittelwert</Begriff> darfst du berechnen, wenn die Abstände zwischen den <Begriff id="wert">Werten</Begriff> gleich viel bedeuten. Skalen mit sieben oder mehr geordneten <Begriff id="auspraegung">Ausprägungen</Begriff> wie das Vertrauen behandelt man in den Sozialwissenschaften meist wie <Begriff id="metrisch">metrisch</Begriff>. Das ist eine Annahme über das <Begriff id="skalenniveau">Skalenniveau</Begriff>, die du nennen solltest (mehr in <a href="#k2b">Verstehen zu Aufgabe 2</a>).</p>
      <Frage>Warum haben nur gut 3.500 Befragte geantwortet?</Frage>
      <p>Die Frage wurde nur etwa zwei Dritteln der Befragten gestellt: 1.596 haben sie nicht bekommen, im <Begriff id="datenmatrix">Datensatz</Begriff> steht bei ihnen „<Begriff id="tnz">TNZ: SPLIT</Begriff>“. Wer noch zur Schule geht oder einen anderen Abschluss hat, gehört zu keiner der beiden Gruppen und fällt ebenfalls heraus.</p>
      <Frage>Und warum sollst du vorher festlegen, was du erwartest?</Frage>
      <p>Wer vorher eine Erwartung notiert, merkt hinterher, wo das eigene Bild danebenlag. Ohne Festlegung wirkt jedes Ergebnis im Nachhinein „klar“. Sind am Ende alle Fragen richtig, steht deine Festlegung aus Schritt 1 neben dem Ergebnis.</p>
      <InShort>Ein <b>Mittelwertvergleich</b> fragt: Liegen zwei Gruppen im Mittel verschieden hoch, und ist der Unterschied größer, als der Zufall erklären kann? Die Variable, deren Mittelwerte du vergleichst, heißt <b><Begriff id="abhaengige-variable">abhängige Variable</Begriff></b> (hier <code>pt03</code>). Die Gruppen bildet eine zweite Variable, die <b><Begriff id="unabhaengige-variable">unabhängige Variable</Begriff></b> (hier <code>abitur</code>).</InShort>
    </Card>

    <Card id="k1-vorlage" title="Die Vorlage lesen: rec() bildet die Gruppen, t_test() vergleicht" badge={<Bezug href="#a1-1">zu Schritt 2</Bezug>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">Die Vorlage in Schritt 2 macht zwei Dinge nacheinander: Sie bildet die Gruppen, und sie rechnet den Test.</p>
      <Code k="a1_kurz" />
      <ul className="v-liste">
        <li><code>mutate(abitur = rec(educ, rules = …))</code> bildet die neue <Begriff id="variable">Variable</Begriff> <code>abitur</code>. Dieses <Begriff id="rekodieren">Rekodieren</Begriff> kennst du aus Sitzung 5. <code>1:3=0 [ohne Abitur]</code> heißt: Die <Begriff id="code">Codes</Begriff> 1 bis 3 von <code>educ</code> werden zu 0 mit dem Label „ohne Abitur“. <code>4:5=1 [mit Abitur]</code> macht aus 4 und 5 die 1 „mit Abitur“. <code>else=NA</code>: Alles andere wird zum <Begriff id="fehlende-werte">fehlenden Wert</Begriff>.</li>
        <li><code>t_test(age, group = abitur, weights = wghtpew)</code> vergleicht die Mittelwerte. Zuerst steht die abhängige Variable, nach <code>group =</code> die unabhängige Variable mit den zwei Gruppen, dann das <Begriff id="gewichte">Gewicht</Begriff>.</li>
      </ul>
      <Frage>Warum rechnet die Vorlage zuerst mit dem Alter?</Frage>
      <p>Zur Kontrolle. So weißt du, wie die Ausgabe aussehen muss, bevor du etwas änderst: <code>{A1_SHORT.age}</code>. Erst dann tauschst du im Journal die markierte Stelle <code>age</code> gegen <code>pt03</code> und führst den Block noch einmal aus. Stimmt danach etwas nicht, liegt es am Tausch.</p>
      <Frage>Was steht in dieser einen Zeile?</Frage>
      <ul className="v-liste">
        <li><code>t(5059.1)</code>: In der Klammer stehen die <Begriff id="freiheitsgrade">Freiheitsgrade</Begriff> (df). Sie hängen vor allem an der Zahl der Befragten. Eine krumme Zahl ist beim Welch-Test richtig so.</li>
        <li><code>= 22.239</code>: der <Begriff id="t-test">t-Wert</Begriff>. R rechnet immer erste minus zweite Gruppe, hier „ohne Abitur“ minus „mit Abitur“. Ein Plus heißt also: Ohne Abitur sind die Befragten im Mittel älter, mit Abitur jünger. Ein Minus hieße: Die zweite Gruppe liegt höher.</li>
        <li><code>p &lt; 0.001 ***</code>: der <Begriff id="p-wert">p-Wert</Begriff>, die Sterne sagen dasselbe.</li>
        <li><code>g = 0.625 (medium)</code>: Hedges&apos; g, die Effektstärke, mit der Einordnung von mariposa.</li>
        <li><code>N = 5067</code>: die <Begriff id="fallzahl">Fallzahl</Begriff>, also wie viele Befragte in den Vergleich eingehen. Mit Gewicht ist es die Summe der Gewichte, gerundet.</li>
      </ul>
      <p>Was t, p und g bedeuten, erklären die nächsten Karten: <a href="#k1b">Der t-Wert</a>, <a href="#k1c">p-Wert und Konfidenzintervall</a>, <a href="#k1d">Effektstärke</a>.</p>
      <Mixup>Die Zeile <code>t(…) = …</code> ist nur die Kurzfassung. Mittelwerte und Konfidenzintervall stehen dort nicht; die holt erst <code>summary()</code> in Schritt 3.</Mixup>
    </Card>

    <Card id="k1a" title="Jede Stichprobe zeigt einen anderen Unterschied" badge={<><Bezug href="#a1-1">zu Schritt 2</Bezug><Badge>Normalverteilung: kennst du aus der Vorlesung</Badge></>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Warum braucht man überhaupt einen Test? Stell dir vor, der ALLBUS wäre die <Begriff id="grundgesamtheit">Grundgesamtheit</Begriff>, also ganz Deutschland. Dort arbeiten erwerbstätige Männer im Mittel 7,99 Stunden pro Woche mehr als erwerbstätige Frauen, und bei der Lebenszufriedenheit (0 bis 10) liegen beide fast gleich: Frauen 0,01 Punkte höher.</p>
      <p className="absatz">Eine Umfrage fragt aber nie alle. Was sieht man, wenn man nur 50 Männer und 50 Frauen zufällig zieht, also eine kleine <Begriff id="stichprobe">Stichprobe</Begriff>? Die Simulation zieht für dich: erst 20 Stichproben einzeln, dann 980 weitere auf einmal. Jeder Unterschied landet als Kästchen in seiner <Begriff id="klasse">Klasse</Begriff>, einem Bereich von gleicher Breite. So wächst ein <Begriff id="histogramm">Histogramm</Begriff>.</p>
      <StichprobenMaschine />
      <p className="absatz">Für Aufgabe 1 heißt das: Auch die gut 3.500 Befragten, die die Vertrauensfrage beantwortet haben, sind eine Stichprobe. In einer anderen Stichprobe fiele der Unterschied zwischen mit und ohne Abitur etwas anders aus. Der <Begriff id="t-test">t-Test</Begriff> fragt, ob er trotzdem über den Zufall hinausgeht.</p>
      <InShort>Der Unterschied in einer Stichprobe schwankt von Stichprobe zu Stichprobe. Wie er schwankt, zeigt die <b><Begriff id="stichprobenverteilung">Stichprobenverteilung</Begriff></b>: Sie hat annähernd die Form einer <Begriff id="normalverteilung">Normalverteilung</Begriff>, einer Glocke um den wahren Unterschied. Ihre Breite heißt <b><Begriff id="standardfehler">Standardfehler</Begriff></b>: der typische Abstand zwischen dem Unterschied in einer Stichprobe und dem in der Grundgesamtheit.</InShort>
      <MoreDetail summary="Warum eine Normalverteilung, und warum wird sie schmaler?">
        <p>Die <Begriff id="verteilung">Verteilung</Begriff> der Arbeitsstunden selbst ist keine Normalverteilung: Viele arbeiten genau 40 Stunden, wenige 10 oder 60. Mittelwerte aus 50 Personen verteilen sich trotzdem fast normal. Dahinter steht der <b>zentrale Grenzwertsatz</b>: Je mehr Personen in einen Mittelwert eingehen, desto mehr ähnelt die Verteilung solcher Mittelwerte einer Normalverteilung, egal wie die einzelnen Werte verteilt sind. Als Faustregel reichen etwa 30 Personen je Gruppe; bei sehr <Begriff id="schiefe">schief</Begriff> verteilten Werten braucht es mehr.</p>
        <p>Mit mehr Befragten wird die Stichprobenverteilung schmaler, der Standardfehler also kleiner. Bei 50 Männern und 50 Frauen liegt er für die Arbeitsstunden bei etwa 1,88 Stunden (in den 1.000 Stichproben: 1,83). Mit dem ganzen ALLBUS, über 1.400 je Gruppe, sind es nur noch 0,35 Stunden. Wie man ihn ausrechnet, zeigt <a href="#k1b">die nächste Karte</a>.</p>
        <p>Gezogen wird hier so, dass jede Person mit ihrem Gewicht <code>wghtpew</code> zum Zug kommt; so steht der ALLBUS für Deutschland. Gezeigt werden nur Mittelwerte von je 50 Personen, keine einzelnen Antworten.</p>
      </MoreDetail>
      <Mixup>Standardabweichung und Standardfehler. Die <Begriff id="standardabweichung">Standardabweichung</Begriff> (kennst du aus Sitzung 3) misst, wie stark <b>einzelne Personen</b> <Begriff id="streuung">streuen</Begriff>: Bei den Arbeitsstunden der Männer 8,4 Stunden. Der Standardfehler misst, wie stark <b>Mittelwerte oder Unterschiede</b> von Stichprobe zu Stichprobe schwanken. Er wird mit mehr Befragten kleiner, die Standardabweichung nicht.</Mixup>
    </Card>

    <Card id="k1b" title="Der t-Wert: Unterschied durch Standardfehler" badge={<Bezug href="#a1-1">zu Schritt 2</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Wir haben nie 1.000 Stichproben, sondern eine. Wie entscheidet man mit einer einzigen, ob ein Unterschied echt ist? Man vergleicht ihn mit dem <Begriff id="standardfehler">Standardfehler</Begriff>: Ist der Unterschied viel größer als das, was der Zufall typischerweise anrichtet?</p>
      <TFormula />
      <p className="absatz">Ein t von 23 heißt: Der Unterschied ist 23-mal so groß wie das, was der Zufall typischerweise anrichtet. Bei der Lebenszufriedenheit ist es umgekehrt: Unterschied −0,010, Standardfehler 0,054, t = −0,19. Der Unterschied ist viel kleiner als sein Standardfehler.</p>
      <p className="absatz">Mit nur 50 je Gruppe wäre der Standardfehler der Arbeitsstunden √(8,443² ÷ 50 + 10,287² ÷ 50) = √(1,4257 + 2,1164) ≈ 1,88 Stunden und t ≈ 7,99 ÷ 1,88 ≈ 4,2. Kleinere Stichprobe, größerer Standardfehler, kleineres t.</p>
      <Frage>Und wenn die Gruppen viermal so groß wären, bei gleichem Unterschied und gleicher Streuung?</Frage>
      <p>Dann würde t etwa doppelt so groß. Unter der Wurzel steht die Anzahl im Nenner. Viermal so viele Befragte machen den Standardfehler halb so groß (die Wurzel aus 4 ist 2), und damit wird t doppelt so groß.</p>
      <p>In der Kurzfassung aus Schritt 2 steht t direkt hinter <code>t(…) =</code>, in der ganzen Tabelle aus Schritt 3 in der Spalte t.</p>
      <InShort>Der <b><Begriff id="t-test">t-Wert</Begriff></b> teilt den Unterschied der Mittelwerte durch seinen Standardfehler, im Bild: Signal durch Rauschen. Je weiter t von 0 weg ist, desto weniger lässt sich der Unterschied mit Zufall erklären. Der <b>t-Test für unabhängige Stichproben</b> vergleicht so die Mittelwerte zweier Gruppen.</InShort>
      <MoreDetail summary="Freiheitsgrade (df)">
        <p>In der Ausgabe steht neben t die Spalte df (<Begriff id="freiheitsgrade">Freiheitsgrade</Begriff>). Sie hängt an der Zahl der Befragten und bestimmt, wie streng R das t beurteilt. Bei mehr als etwa 100 Befragten spielt sie kaum noch eine Rolle. Dass df beim Welch-Test eine krumme Zahl ist (2763.588), ist richtig so.</p>
      </MoreDetail>
      <Mixup>Das Vorzeichen von t sagt nur, welche Gruppe höher liegt, nicht wie deutlich. t = −12 ist genauso deutlich wie t = +12.</Mixup>
    </Card>

    <Card id="k1-tabelle" title="Die ganze Tabelle: summary()" badge={<Bezug href="#a1-2">zu Schritt 3</Bezug>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">Die zweite Vorlage rechnet denselben Test und hängt <code>summary()</code> an. Dann zeigt R nicht nur eine Zeile, sondern die ganze Tabelle.</p>
      <Code k="a1_tabelle" />
      <Frage>Warum bildet die Vorlage <code>abitur</code> noch einmal?</Frage>
      <p>Jede Vorlage läuft für sich; nur <code>allbus</code> muss es schon geben. Der Kommentar „wie in Schritt 1“ meint die Kurzfassung in Schritt 2; er zählt „Erst festlegen“ nicht mit.</p>
      <Frage>Was zeigt die Tabelle, von oben nach unten?</Frage>
      <ul className="v-liste">
        <li><b>Weighted Group Statistics:</b> je Gruppe N, Mittelwert (Mean), Standardabweichung (Std. Deviation) und Standardfehler des Mittelwerts.</li>
        <li><b>Weighted Independent Samples Test:</b> zwei Zeilen mit t, df, p, dem Unterschied der Mittelwerte (Mean Diff.), seinem Standardfehler (SE Diff.) und dem 95-%-Konfidenzintervall (95% CI Lower bis Upper). Du liest die Zeile „Equal variances not assumed“, den <Begriff id="welch-test">Welch-Test</Begriff>. Warum, erklärt <a href="#k2c">Verstehen zu Aufgabe 2</a>.</li>
        <li><b>Effect Sizes:</b> Cohen&apos;s d, Hedges&apos; g, Glass&apos; Delta und die Einordnung (Magnitude). Für die Aufgaben brauchst du nur Hedges&apos; g.</li>
      </ul>
      <p>Wie du so eine Ausgabe Zeile für Zeile liest, zeigt die Karte <a href="#r2">„Ein t-Test in R“</a> unter Vorweg, mit Marken am Rand und den Arbeitsstunden als Beispiel.</p>
      <Mixup>Ein Minus vor t und Mean Diff. ist kein Fehler. Es heißt nur: Die zweite Gruppe liegt höher. R schreibt Kommazahlen mit Punkt: <code>-0.123</code> heißt −0,123.</Mixup>
    </Card>

    <Card id="k1c" title="p-Wert und Konfidenzintervall in Worten" badge={<Bezug href="#a1-2">zu Schritt 3</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Zurück zur Lebenszufriedenheit, bei der es (fast) keinen Unterschied gibt. In Stichprobe 12 aus der Simulation lagen die Frauen trotzdem 0,60 Punkte vorn. Wie ungewöhnlich ist so ein Unterschied, wenn es in Wahrheit keinen gibt?</p>
      <h6 className="zwischen">Wie oft passiert das ohne echten Unterschied?</h6>
      <FarFromZero />
      <p className="absatz">Genau das misst der <b><Begriff id="p-wert">p-Wert</Begriff></b>: Angenommen, in der Grundgesamtheit gäbe es keinen Unterschied (die <b><Begriff id="nullhypothese">Nullhypothese</Begriff></b>). Wie oft käme dann ein Unterschied heraus, der mindestens so weit von 0 entfernt ist wie der in meiner Stichprobe? Für die 0,60 Punkte aus Stichprobe 12: in 127 von 1.000 Stichproben, also mit einer <Begriff id="relative-haeufigkeit">relativen Häufigkeit</Begriff> von etwa 13 %. Das ist nicht selten. Ein Unterschied von 0,8 Punkten käme dagegen nur in etwa 4 von 100 Stichproben vor. Die Gegenannahme, es gebe einen Unterschied, heißt <b>Alternativhypothese</b>.</p>
      <p className="absatz">R zieht dafür nicht 1.000 Stichproben. Es nimmt die Normalverteilung als Formel, mit dem Standardfehler aus der Karte davor, und liest dort ab, welcher Teil der Fläche unter der Kurve mindestens so weit von 0 entfernt liegt wie der gefundene Unterschied, auf beiden Seiten zusammen. Für Stichprobe 12 kommt R so auf p = 0,11, also nah an den 13 von 100 aus der Simulation. (Ganz gleich sind die Zahlen nicht, weil R nur die eine Stichprobe kennt und deren Standardfehler schätzt.)</p>
      <p className="absatz">Ist p kleiner als 0,05, nennt man den Unterschied <b>signifikant</b>: Er wäre ohne echten Unterschied selten. Die Grenze 0,05 heißt <b><Begriff id="signifikanzniveau">Signifikanzniveau</Begriff></b>, kurz α (Alpha). Sie ist eine Abmachung, keine Naturkonstante.</p>
      <p className="absatz"><Known session={5} /> Ein Stück davon kennst du schon: In Sitzung 5 hat der <Begriff id="chi-quadrat">Chi-Quadrat-Test</Begriff> „p &lt; 0.001“ gemeldet, und dort stand „kaum durch Zufall zu erklären“. In Sitzung 6 standen p-Wert und Sterne neben Zusammenhangsmaßen wie <Begriff id="cramers-v">Cramér-V</Begriff>. Es ist bei allen Tests dieselbe Logik.</p>
      <h6 className="zwischen">20 Konfidenzintervalle</h6>
      <p className="unter-zwischen">Je ein 95-%-Intervall der Arbeitsstunden-Stichproben 1 bis 20 aus der Simulation, der Punkt in der Mitte ist der Unterschied der Stichprobe.</p>
      <Intervals />
      <p className="absatz">Das <b>95-%-Konfidenzintervall</b> ist der Bereich, in dem der Unterschied in der Bevölkerung plausibel liegt. Auf lange Sicht treffen etwa 95 von 100 solcher Intervalle den wahren Wert; hier waren es 963 von 1.000. Liegt die 0 nicht im Intervall, ist der Unterschied signifikant (p &lt; 0,05). Liegt sie darin, kann man „kein Unterschied“ nicht ausschließen.</p>
      <Frage>Was folgt also aus Stichprobe 12: Frauen 0,60 Punkte vorn, p = 0,11, Intervall −1,33 bis 0,13?</Frage>
      <p>Die Stichprobe reicht nicht als Beleg: Ein Unterschied dieser Größe entsteht auch ohne echten Unterschied leicht. p = 0,11 liegt über 0,05, und die 0 liegt im Intervall. Das heißt aber nicht, dass Männer und Frauen gleich zufrieden sind; diese Stichprobe kann es nur nicht entscheiden. Nicht signifikant heißt „nicht entschieden“.</p>
      <InShort>Der <b>p-Wert</b> sagt, wie oft ein mindestens so großer Unterschied vorkäme, wenn es in der Bevölkerung keinen gäbe (Nullhypothese). Unter 0,05 (dem Signifikanzniveau α) heißt <b>signifikant</b>. Das <b>Konfidenzintervall</b> zeigt, wo der wahre Unterschied plausibel liegt; enthält es die 0, ist der Unterschied nicht signifikant.</InShort>
      <MoreDetail summary="Fehler erster Art und Sterne">
        <p>Auch ohne echten Unterschied meldet der Test manchmal „signifikant“: Bei der Lebenszufriedenheit war das in 54 von 1.000 Stichproben so, gut 5 %. Das ist der Preis der 5-%-Grenze, ein <b><Begriff id="fehlerarten">Fehler 1. Art</Begriff></b> (Fehlalarm, auch Alpha-Fehler, weil seine Wahrscheinlichkeit gerade α ist). Das Gegenstück ist der <b>Fehler 2. Art</b>: Es gibt einen Unterschied, aber der Test findet ihn nicht, etwa weil die Gruppen zu klein sind. Der Fehler 1. Art wird in <a href="#k3a">Aufgabe 3</a> wichtig, wenn man viele Tests auf einmal rechnet.</p>
        <p>Die Sterne in der R-Ausgabe übersetzen p: * heißt p &lt; 0,05, ** p &lt; 0,01, *** p &lt; 0,001. In Sitzung 6 standen sie schon neben den Zusammenhangsmaßen; sie bedeuten dort dasselbe.</p>
      </MoreDetail>
      <Mixup>„p = 0,03 heißt: Mit 3 % Wahrscheinlichkeit ist das Ergebnis Zufall.“ Nein. p setzt voraus, dass es keinen Unterschied gibt, und fragt, wie selten die Daten dann wären. Wie wahrscheinlich die Nullhypothese selbst ist, sagt p nicht.</Mixup>
    </Card>

    <Card id="k1d" title="Wie groß ist der Unterschied? Die Effektstärke" badge={<><Bezug href="#a1-1">zu Schritt 2</Bezug><Bezug href="#a1-2">zu Schritt 3</Bezug></>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Bei den Arbeitsstunden liegen Männer 7,99 Stunden vorn. Ist das viel? Das hängt davon ab, wie stark die Stunden ohnehin streuen. Die <b><Begriff id="effektgroesse">Effektstärke</Begriff></b> (auch Effektgröße) sagt, wie groß ein Unterschied ist. <Begriff id="hedges-g">Hedges&apos; g</Begriff> misst ihn in Standardabweichungen: 7,988 ÷ 9,38 (gemeinsame Standardabweichung beider Gruppen) ≈ 0,85. Die beiden Gruppen liegen also knapp eine Standardabweichung auseinander.</p>
      <EffectRuler />
      <InShort><b>Cohen&apos;s d</b> teilt den Unterschied durch die gemeinsame Standardabweichung. <b>Hedges&apos; g</b> ist dasselbe mit einer kleinen Korrektur; mariposa empfiehlt es und zeigt es in der Kurzfassung. <Begriff id="faustregel-cohen">Faustregel nach Cohen</Begriff>: ab 0,2 klein, ab 0,5 mittel, ab 0,8 groß. Das Vorzeichen zeigt nur die Richtung.</InShort>
      <MoreDetail summary="Warum eine eigene Zahl für die Größe?">
        <p>t und p hängen an der Zahl der Befragten, die Effektstärke nicht. Mit sehr vielen Befragten wird auch ein winziger Unterschied signifikant (mehr in <a href="#k2a">Verstehen zu Aufgabe 2</a>). Darum berichtet man immer beides: ob ein Unterschied über den Zufall hinausgeht (p, Konfidenzintervall) und wie groß er ist (Effektstärke). mariposa schreibt die Einordnung gleich dazu: negligible, small, medium, large.</p>
      </MoreDetail>
      <Mixup>Effektstärke und Unterschied in der Einheit. 7,99 Stunden ist ein Unterschied in Stunden, 0,85 eine Effektstärke ohne Einheit. Die Effektstärke erlaubt Vergleiche zwischen Variablen mit verschiedenen Skalen.</Mixup>
    </Card>

    <Card id="k1-ergebnis" title="Ergebnis festhalten: was die Fragen wissen wollen" badge={<Bezug href="#a1-3">zu Schritt 4</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">Die Fragen in Schritt 4 gehen die Ausgabe aus Schritt 3 in der Reihenfolge eines Berichts durch. Jede Antwort hat einen festen Ort.</p>
      <ul className="v-liste">
        <li><b>Welche Gruppe liegt höher?</b> „Weighted Group Statistics“, Spalte Mean: Die größere Zahl liegt höher.</li>
        <li><b>Um wie viel?</b> Spalte Mean Diff. in der Zeile „Equal variances not assumed“. Übernimm die Zahl so, wie R sie druckt, mit Vorzeichen.</li>
        <li><b>Geht das über den Zufall hinaus?</b> t und p in derselben Zeile. Was sie heißen, steht in <a href="#k1b">Der t-Wert</a> und <a href="#k1c">p-Wert und Konfidenzintervall</a>.</li>
        <li><b>Wo liegt der Unterschied plausibel?</b> 95% CI Lower bis Upper: ein Bereich für den Unterschied der Mittelwerte, nicht für einzelne Personen.</li>
        <li><b>Wie groß ist er?</b> „Effect Sizes“, Spalte Hedges&apos; g. Das Vorzeichen zeigt nur die Richtung; für die Größe zählt der Betrag. Vergleiche ihn mit den Grenzen in <a href="#k1d">Effektstärke</a>.</li>
      </ul>
      <p>Holst du die Ergebnisse ins Journal, kannst du darunter einen Satz wie in einem Bericht schreiben. Was hineingehört und ein Muster mit den Arbeitsstunden steht im <a href="#kue2">Überblick</a>.</p>
    </Card>
  </Abschnitt>;
}

/* ---------- Aufgabe 2 ---------- */
export function Verstehen2() {
  return <Abschnitt id="g2" n={2} titel="Macht Abitur zufriedener?" frage="Wie groß ist der Unterschied in der Lebenszufriedenheit zwischen Menschen mit und ohne Abitur, und hängt die Antwort davon ab, wen man fragt?"
    ziel="eine Einschätzung, ob ein signifikanter Unterschied auch groß ist, und eine Begründung, wann die Welch-Zeile ein breiteres Intervall zeigt."
    weg={[
      ['Schritt 1', '#a2-p', 'Erst festlegen: Bei wem ist der Unterschied größer?', 'k2-frage'],
      ['Schritt 2', '#a2-1', 'alle Befragten: die Vorlage lesen', 'k2-vorlagen'],
      ['Schritt 2', '#a2-1', 'signifikant, aber wie groß?', 'k2a'],
      ['Schritt 3', '#a2-2', 'nur die unter 30-Jährigen: filter() vor dem Test', 'k2-vorlagen'],
      ['Schritt 3', '#a2-2', 'Passt der Test noch? Die Voraussetzungen', 'k2b'],
      ['Schritt 3', '#a2-2', 'zwei Zeilen: Student und Welch', 'k2c'],
      ['Schritt 4', '#a2-3', 'Ergebnis festhalten', 'k2-ergebnis'],
    ]}>

    <Card id="k2-frage" title="Worum es geht: derselbe Vergleich, zweimal gerechnet" badge={<Bezug href="#a2-p">zu Schritt 1</Bezug>} tag={{ kind: 'interpret', label: 'Hintergrund' }}>
      <p className="lead">Du vergleichst die Lebenszufriedenheit (<code>ls01</code>, 0 bis 10) zwischen Menschen ohne und mit Abitur. Die Gruppen bildest du genau wie in Aufgabe 1.</p>
      <Frage>Warum zweimal?</Frage>
      <p>Die Aufgabe fragt, ob die Antwort davon abhängt, wen man fragt. Darum rechnest du denselben Test einmal mit allen Befragten und einmal nur mit den unter 30-Jährigen. Weniger Befragte heißt dabei: Der <Begriff id="standardfehler">Standardfehler</Begriff> wird größer (<a href="#k1b">Der t-Wert</a>).</p>
      <Frage>Was heißt „größer“ in der Festlegung?</Frage>
      <p>Gemeint ist der Unterschied der Mittelwerte in Punkten der Skala, die Spalte Mean Diff. Ob ein Unterschied signifikant ist und wie groß er im Verhältnis zur Streuung ist, sind zwei weitere Fragen. Um den Unterschied zwischen diesen Aussagen geht es in dieser Aufgabe.</p>
      <InShort>„Signifikant“, „groß“ und „größer als bei anderen“ sind drei verschiedene Aussagen. p sagt das Erste, die Effektstärke das Zweite, der Vergleich zweier Rechnungen das Dritte.</InShort>
    </Card>

    <Card id="k2-vorlagen" title="Zwei Vorlagen, eine Zeile Unterschied: filter() vor dem Test" badge={<><Bezug href="#a2-1">zu Schritt 2</Bezug><Bezug href="#a2-2">zu Schritt 3</Bezug></>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">Die beiden Vorlagen sind fast gleich. Beide bilden <code>abitur</code> wie in Aufgabe 1, rechnen den t-Test für <code>ls01</code> und holen mit <code>summary()</code> die ganze Tabelle.</p>
      <Code k="a2_alle" />
      <Code k="a2_jung" />
      <Frage>Was macht die zusätzliche Zeile <code>filter(age &lt; 30)</code>?</Frage>
      <p>Sie behält nur die Befragten, die jünger als 30 sind (<code>filter()</code> kennst du aus Sitzung 2). Weil sie vor <code>mutate()</code> und <code>t_test()</code> steht, rechnet alles danach nur noch mit diesen Befragten.</p>
      <Frage>Was liest du in Schritt 2, was in Schritt 3?</Frage>
      <p>In Schritt 2 den Unterschied (Mean Diff.), p und Hedges&apos; g aus der Welch-Zeile und unter „Effect Sizes“. In Schritt 3 zusätzlich beide Zeilen des Tests: „Equal variances assumed“ und „Equal variances not assumed“. Vergleiche dort SE Diff. und das <Begriff id="konfidenzintervall">Konfidenzintervall</Begriff> (95% CI), und oben in der Gruppentabelle N und Std. Deviation.</p>
      <Mixup><code>filter(age &lt; 30)</code> heißt „jünger als 30“; wer genau 30 ist, fällt heraus. Für „30 und älter“ schreibst du <code>age &gt;= 30</code>.</Mixup>
    </Card>

    <Card id="k2a" title="Signifikant oder groß?" badge={<Bezug href="#a2-1">zu Schritt 2</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Der ALLBUS fragt auch, wie wichtig einem Politik und öffentliches Leben sind (<code>li07</code>, 1 = unwichtig bis 7 = sehr wichtig). Männer sagen im Mittel 4,52, Frauen 4,41. Der Unterschied ist 0,11 Punkte, p = 0,011: signifikant. Hedges&apos; g ist aber nur 0,07, vernachlässigbar. Wie geht das zusammen? Der Regler zeigt es an einem Beispiel: Der Unterschied bleibt gleich, nur die Zahl der Befragten wächst.</p>
      <NSlider />
      <InShort>Ob ein Unterschied <b>signifikant</b> ist, hängt an seiner Größe <b>und</b> an der Zahl der Befragten. Mit genug Befragten wird jeder noch so kleine Unterschied signifikant. Ob er <b>bedeutsam</b> ist, sagt die Effektstärke und die inhaltliche Überlegung.</InShort>
      <MoreDetail summary="Was heißt das für den ALLBUS?">
        <p>Mit über 5.000 Befragten sind im ALLBUS viele Unterschiede signifikant, die im Alltag kaum zu spüren sind. Darum gehören zu jedem Testergebnis die Mittelwerte, der Unterschied in der Einheit der Frage und die Effektstärke. Umgekehrt ist ein nicht signifikanter Unterschied in einer kleinen Gruppe kein Beweis, dass es keinen gibt (<a href="#k1c">p-Wert und Konfidenzintervall</a>).</p>
      </MoreDetail>
      <Mixup>„Hochsignifikant“ heißt „großer Unterschied“. Nein: Bei der Wichtigkeit von Politik liegen Männer und Frauen signifikant auseinander (p = 0,011), aber nur um 0,07 Standardabweichungen.</Mixup>
    </Card>

    <Card id="k2b" title="Wann passt ein t-Test? Die Voraussetzungen" badge={<Bezug href="#a2-2">zu Schritt 3</Bezug>} tag={{ kind: 'interpret', label: 'Hintergrund' }}>
      <p className="lead">Ein t-Test rechnet immer, auch wenn er nicht passt. Vor allem wenn eine Gruppe klein wird, wie bei den unter 30-Jährigen, lohnt der Blick auf vier Dinge.</p>
      <FourStones items={[
        <><b>Metrische abhängige Variable.</b> Einen Mittelwert darfst du berechnen, wenn die Abstände zwischen den Werten gleich viel bedeuten (kennst du aus Sitzung 4). Stunden und Alter sind metrisch. Skalen mit sieben oder mehr geordneten Ausprägungen wie das Vertrauen (1 bis 7) oder die Links-rechts-Einstufung (1 bis 10) behandelt man in den Sozialwissenschaften meist wie metrisch; das ist eine Annahme, die du nennen solltest. Bei wenigen Ausprägungen ohne gleiche Abstände nimmst du die <Begriff id="kreuztabelle">Kreuztabelle</Begriff> (Sitzung 5) oder ein Rangmaß (Sitzung 6).</>,
        <><b>Zwei unabhängige Gruppen.</b> Jede Person gehört zu genau einer Gruppe, und die Gruppen beeinflussen sich nicht. Dieselben Personen zweimal befragt (vorher und nachher) wären verbundene Stichproben; dafür gibt es andere Tests.</>,
        <><b>Genug Befragte je Gruppe.</b> Ab etwa 30 je Gruppe verteilen sich die Mittelwerte annähernd normal, auch wenn die Werte selbst schief verteilt sind (<a href="#k1a">Jede Stichprobe zeigt einen anderen Unterschied</a>); bei sehr schiefen Werten braucht es mehr. Bei sehr kleinen Gruppen müssten die Werte selbst ungefähr normalverteilt sein.</>,
        <><b>Ähnliche Streuung? Nicht nötig mit Welch.</b> Der klassische t-Test (nach Student) nimmt an, dass beide Gruppen gleich stark streuen. Diese Annahme heißt <Begriff id="varianzhomogenitaet">Varianzhomogenität</Begriff>. Der Welch-Test braucht das nicht (<a href="#k2c">Welch oder Student?</a>).</>,
      ]} />
      <p className="absatz">Für Aussagen über ganz Deutschland gewichtest du (Sitzung 6).</p>
      <InShort><b>Voraussetzungen des t-Tests:</b> metrische abhängige Variable, zwei unabhängige Gruppen, genug Befragte je Gruppe (Faustregel 30). Gleiche Streuung braucht nur der klassische Test; der Welch-Test kommt ohne aus.</InShort>
      <MoreDetail summary="Und wenn die unabhängige Variable drei Gruppen hat?">
        <p>Dann rechnet <code>t_test()</code> gar nicht erst und meldet, dass es genau zwei Gruppen braucht. Entweder du fasst mit <code>rec()</code> zu zwei Gruppen zusammen (wie bei <code>abitur</code>), oder du nimmst die Varianzanalyse aus <a href="#k3a">Aufgabe 3</a>.</p>
      </MoreDetail>
      <Mixup>„Der t-Test braucht normalverteilte Daten.“ Bei großen Gruppen nicht: Es genügt, dass die <b>Mittelwerte</b> annähernd normalverteilt sind, und dafür sorgt bei großen Gruppen schon ihre Größe (zentraler Grenzwertsatz).</Mixup>
    </Card>

    <Card id="k2c" title="Welch oder Student? Zwei Zeilen in der Ausgabe" badge={<Bezug href="#a2-2">zu Schritt 3</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">In der ganzen Tabelle stehen zwei Zeilen: „Equal variances assumed“ (Student) und „Equal variances not assumed“ (Welch). Wann gehen sie auseinander? Zum Beispiel: Gruppe A hat 400 Befragte, die eng beieinander liegen (Standardabweichung 1). Gruppe B hat 40 Befragte, die stark streuen (Standardabweichung 3). B liegt im Mittel 0,8 Punkte höher.</p>
      <WelchFormula />
      <p className="absatz">Student nimmt eine gemeinsame Streuung an. Weil Gruppe A groß ist und eng liegt, unterschätzt er, wie unsicher der Mittelwert der kleinen, stark streuenden Gruppe B ist. Welch nimmt jede Gruppe mit ihrer eigenen Streuung und Größe. Sind die Gruppen gleich groß oder streuen sie ähnlich, kommen beide fast auf dasselbe (wie bei den Arbeitsstunden: 23,144 gegen 22,988).</p>
      <Frage>In welcher Lage unterscheiden sich die beiden Zeilen also am stärksten?</Frage>
      <p>Wenn die Gruppen ungleich groß sind und die kleine Gruppe stärker streut. Dann verlässt sich Student zu sehr auf die große Gruppe; Welch rechnet ehrlicher. Bei gleich großen Gruppen oder gleicher Streuung kommen beide fast auf dasselbe, auch bei sehr großen Gruppen.</p>
      <InShort>Der <b><Begriff id="welch-test">Welch-Test</Begriff></b> rechnet den Standardfehler mit der Streuung jeder Gruppe für sich und braucht deshalb keine gleichen Streuungen (<b>Varianzhomogenität</b>). In mariposa ist er die Zeile „Equal variances not assumed“ und steht in der Kurzfassung. Lies immer diese Zeile.</InShort>
      <MoreDetail summary="Wie erkenne ich ungleiche Streuung?">
        <p>Vergleiche in der Gruppentabelle die Spalte „Std. Deviation“. Als Faustregel gilt: Ist die größte Standardabweichung mehr als doppelt so groß wie die kleinste, unterscheiden sich die Streuungen deutlich. Mit Welch bist du in jedem Fall auf der sicheren Seite. Einen eigenen Test dafür (Levene-Test) lernst du in Sitzung 9 kennen.</p>
      </MoreDetail>
      <Mixup>„Equal variances not assumed“ heißt nicht, dass die Streuungen ungleich <b>sind</b>. Es heißt nur, dass der Test es nicht <b>voraussetzt</b>.</Mixup>
    </Card>

    <Card id="k2-ergebnis" title="Ergebnis festhalten: was die Fragen wissen wollen" badge={<Bezug href="#a2-3">zu Schritt 4</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">Die ersten zwei Fragen gehören zu Schritt 2 (alle Befragten), die letzten zwei zu Schritt 3 (unter 30).</p>
      <ul className="v-liste">
        <li><b>Hedges&apos; g bei allen:</b> unter „Effect Sizes“, mit Minus, so wie R es druckt.</li>
        <li><b>Signifikant oder groß?</b> p sagt, ob der Unterschied über den Zufall hinausgeht; g sagt, wie groß er ist. Die Faustregel steht in <a href="#k1d">Effektstärke</a>, das Zusammenspiel in <a href="#k2a">Signifikant oder groß?</a>.</li>
        <li><b>Unterschied unter 30:</b> Spalte Mean Diff. aus Schritt 3, mit Minus.</li>
        <li><b>Warum ist ein Intervall breiter?</b> Schau oben auf N und Std. Deviation der beiden Gruppen und lies dazu <a href="#k2c">Welch oder Student?</a>.</li>
      </ul>
      <p>Sind alle Fragen richtig, steht deine Festlegung aus Schritt 1 neben dem Ergebnis.</p>
    </Card>
  </Abschnitt>;
}

/* ---------- Aufgabe 3 ---------- */
export function Verstehen3() {
  return <Abschnitt id="g3" n={3} titel="Links, rechts und der Wohnort" frage="Stehen Menschen in der Großstadt politisch weiter links als in Kleinstadt und Dorf?"
    ziel="eine Antwort darauf, ob sich die Wohnorte unterscheiden (F, p), wie stark (η²) und welche genau (Tukey), und weißt, warum ein großer Unterschied in einer kleinen Gruppe nicht signifikant sein kann."
    weg={[
      ['Schritt 1', '#a3-p', 'Erst festlegen: Wo steht man am weitesten links?', 'k3-frage'],
      ['Schritt 2', '#a3-1', 'warum nicht zehn t-Tests', 'k3a'],
      ['Schritt 2', '#a3-1', 'die Vorlage: zwei Stellen tauschen, die Ausgabe lesen', 'k3-vorlage'],
      ['Schritt 2', '#a3-1', 'F und η²: zwischen den Gruppen gegen innerhalb', 'k3b'],
      ['Schritt 3', '#a3-2', 'Tukey: welche Paare genau?', 'k3c'],
      ['Schritt 4', '#a3-3', 'Ergebnis festhalten; warum ein großer Unterschied offen bleiben kann', 'k3-ergebnis'],
    ]}>

    <Card id="k3-frage" title="Worum es geht: fünf Wohnorte, eine Skala" badge={<Bezug href="#a3-p">zu Schritt 1</Bezug>} tag={{ kind: 'interpret', label: 'Hintergrund' }}>
      <p className="lead">Die Befragten stufen sich selbst zwischen links und rechts ein (<code>pa01</code>, 1 = links bis 10 = rechts). Ihren Wohnort beschreiben sie ebenfalls selbst (<code>gs01</code>): Großstadt, Vorort einer Großstadt, Mittel- oder Kleinstadt, ländliches Dorf, Einzelgehöft auf dem Land.</p>
      <Frage>Was heißt „weiter links“ in Zahlen?</Frage>
      <p>Ein kleinerer Mittelwert. Wer im Mittel bei 4 steht, steht weiter links als jemand bei 5.</p>
      <Frage>Warum kein t-Test wie in Aufgabe 1?</Frage>
      <p><code>t_test()</code> vergleicht genau zwei Gruppen. Bei mehr Gruppen rechnet es gar nicht erst und meldet, dass die Gruppenvariable genau zwei Gruppen haben muss, und schlägt für drei oder mehr <code>oneway_anova()</code> vor. Fünf Wohnorte, also eine ANOVA. Warum man nicht einfach mehrere t-Tests rechnet, zeigt die nächste Karte.</p>
      <InShort>Die <b><Begriff id="anova">einfaktorielle Varianzanalyse (ANOVA)</Begriff></b> vergleicht die Mittelwerte von drei oder mehr Gruppen. „Einfaktoriell“ heißt: Es gibt eine unabhängige Variable, die die Gruppen bildet, hier den Wohnort.</InShort>
    </Card>

    <Card id="k3a" title="Viele Paare, viele Tests: Alpha-Fehler-Kumulierung" badge={<Bezug href="#a3-1">zu Schritt 2</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Der ALLBUS wurde auf drei <Begriff id="erhebungsweg">Erhebungswegen</Begriff> erhoben: persönliches Interview (CAPI), online (CAWI) und auf Papier (MAIL), kennst du aus Sitzung 4. Sind die Befragten je nach Erhebungsweg unterschiedlich alt? Mit t-Tests bräuchtest du drei Vergleiche: CAPI–CAWI, CAPI–MAIL, CAWI–MAIL. Bei fünf Gruppen, wie den fünf Wohnorten, wären es schon zehn.</p>
      <PaareZaehlen />
      <p className="absatz">Jeder einzelne Test hat ein Risiko von 5 % für einen <Begriff id="fehlerarten">Fehler 1. Art</Begriff>, einen Fehlalarm (bei der Lebenszufriedenheit in der Simulation: 54 von 1.000). Rechnest du zehn Tests, ist die Chance, dass mindestens einer fälschlich anschlägt, schon etwa 40 %. (Gerechnet als 1 − 0,95 hoch Anzahl der Paare, als wären die Tests unabhängig.)</p>
      <InShort>Viele Tests auf einmal häufen Fehler 1. Art an (<b><Begriff id="mehrfachvergleiche">Alpha-Fehler-Kumulierung</Begriff></b>). Die <b>ANOVA</b> prüft deshalb mit einem einzigen Test, ob sich irgendwelche Gruppenmittelwerte unterscheiden. Welche, sagt danach ein Test für Paare, der die Zahl der Vergleiche einrechnet (<a href="#k3c">der Tukey-Test</a>).</InShort>
      <Mixup>„Mehr Tests = gründlicher.“ Ohne Korrektur heißt mehr Tests vor allem: mehr Zufallstreffer, also Fehler 1. Art.</Mixup>
    </Card>

    <Card id="k3-vorlage" title="Die Vorlage: oneway_anova() mit zwei Stellen zum Tauschen" badge={<Bezug href="#a3-1">zu Schritt 2</Bezug>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">Die Vorlage in Schritt 2 ist kurz. Sie braucht kein <code>mutate()</code>, weil <code>gs01</code> die fünf Wohnorte schon als Gruppen mitbringt.</p>
      <Code k="a3_anova" />
      <ul className="v-liste">
        <li><code>oneway_anova(age, group = mode, weights = wghtpew)</code>: zuerst die abhängige Variable, nach <code>group =</code> die Gruppen, dann das Gewicht. Gleicher Aufbau wie bei <code>t_test()</code>.</li>
        <li><code>summary()</code> holt die ganze Tabelle.</li>
      </ul>
      <Frage>Warum stehen dort <code>age</code> und <code>mode</code>?</Frage>
      <p>Die Vorlage startet mit dem Beispiel dieser Karten: dem Alter nach Erhebungsweg. Führst du sie so aus, muss F = 160.989 herauskommen. Dann weißt du, dass alles läuft. Erst danach tauschst du im Journal beide markierten Stellen: <code>age</code> gegen <code>pa01</code> und <code>mode</code> gegen <code>gs01</code>.</p>
      <Frage>Wie liest du die Ausgabe?</Frage>
      <p>So sieht sie für das Beispiel aus, gekürzt auf die nötigen Zeilen. Die Marken erklärt die Liste darunter.</p>
      <ReadAnova />
      <Mixup>Steht nach dem Tausch noch 160.989 in der Ausgabe, hat R noch mit dem Alter und dem Erhebungsweg gerechnet. Dann ist eine der beiden Stellen nicht getauscht, oder der Block ist nach dem Tausch nicht neu gelaufen.</Mixup>
    </Card>

    <Card id="k3b" title="Zwischen den Gruppen gegen innerhalb der Gruppen: F" badge={<Bezug href="#a3-1">zu Schritt 2</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Die <Begriff id="anova">ANOVA</Begriff> stellt dieselbe Frage wie der t-Test, nur mit mehr Gruppen. Sie vergleicht, wie weit die Gruppenmittelwerte auseinanderliegen (im Bild: das Signal), mit der Streuung der Befragten <b>innerhalb</b> ihrer Gruppe (das Rauschen).</p>
      <h6 className="zwischen">F-Labor</h6>
      <p className="unter-zwischen">Wähl Abstand und Streuung und sieh, wie sich F ändert.</p>
      <FLabor />
      <h6 className="zwischen">F als Bausteine</h6>
      <p className="unter-zwischen">Mit den echten Zahlen für das Alter nach Erhebungsweg (gewichtet).</p>
      <FFormula />
      <InShort>Der <b>F-Wert</b> teilt die mittlere Streuung <b>zwischen</b> den Gruppen durch die mittlere Streuung <b>innerhalb</b> der Gruppen. Ist F groß und p &lt; 0,05, unterscheiden sich mindestens zwei Gruppen im Mittel (welche, sagt <a href="#k3c">der Tukey-Test</a>). <b>Eta-Quadrat (η²)</b> ist die Effektstärke: der Anteil der gesamten Streuung, der mit der Gruppe zusammenhängt. Faustregel: ab 0,01 klein, ab 0,06 mittel, ab 0,14 groß.</InShort>
      <MoreDetail summary="Warum „Varianzanalyse“, wenn sie Mittelwerte vergleicht?">
        <p>Weil sie dafür zwei Streuungen (<Begriff id="varianz">Varianzen</Begriff>) vergleicht: die der Gruppenmittelwerte um das Gesamtmittel und die der Befragten um ihr Gruppenmittel. Eine Varianz ist die mittlere quadrierte Abweichung vom Mittelwert; ihre Wurzel ist die Standardabweichung. Fachbegriff für beide ist <b>Quadratsumme</b> (Sum of Squares). Bei zwei Gruppen kommt die ANOVA zum selben p wie der klassische t-Test; F ist dann genau t².</p>
      </MoreDetail>
      <Mixup>η² = 0,058 heißt nicht „5,8 % der Befragten“. Es heißt: 5,8 % der Unterschiede im Alter gehen damit einher, auf welchem Weg jemand befragt wurde. Die übrigen 94,2 % liegen innerhalb der Wege.</Mixup>
    </Card>

    <Card id="k3c" title="Welche Gruppen genau? Der Tukey-Test" badge={<Bezug href="#a3-2">zu Schritt 3</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Die ANOVA für das Alter nach Erhebungsweg ergibt F = 160,99, p &lt; 0,001, η² = 0,058. Irgendwo gibt es also Unterschiede. Wo genau, sagt der <b><Begriff id="tukey">Tukey-Test</Begriff></b> (Fachbegriff: Post-hoc-Test, „danach“). Er vergleicht alle Paare und rechnet dabei ein, dass es mehrere Vergleiche sind.</p>
      <Code k="a3_tukey" />
      <p>Die Tabelle unten zeigt das Beispiel Alter nach Erhebungsweg (drei Paare); mit <code>pa01</code> und <code>gs01</code> stehen dort zehn Paare.</p>
      <Frage>Warum steht <code>tukey_test()</code> zwischen <code>oneway_anova()</code> und <code>summary()</code>?</Frage>
      <p><code>tukey_test()</code> arbeitet mit dem Ergebnis der ANOVA weiter, darum kommt es direkt danach. <code>summary()</code> gehört ans Ende. Steht <code>summary()</code> vor <code>tukey_test()</code>, meldet R einen Fehler. Ohne <code>summary()</code> zählt die Kurzfassung nur, wie viele Paare signifikant sind; mit <code>summary()</code> siehst du jedes Paar.</p>
      <h6 className="zwischen">Mittelwerte mit Intervall</h6>
      <MeansCI />
      <h6 className="zwischen">Tukey-Tabelle lesen</h6>
      <ReadTukey after={<p className="absatz">{ALT.tukeyAge}</p>} />
      <p className="absatz">In der ANOVA-Ausgabe steht außerdem eine Zeile „Welch“ unter „Robust Tests of Equality of Means“. Sie ist die Welch-Fassung der ANOVA und braucht, wie der Welch-Test in <a href="#k2c">Aufgabe 2</a>, keine gleichen Streuungen. Hier: 166,127, ebenfalls p &lt; 0,001. Kommen klassische Zeile und Welch-Zeile zum selben Schluss, kannst du dich auf das Ergebnis verlassen. Die Streuungen liegen hier eng beieinander: größte durch kleinste Standardabweichung 18,26 ÷ 16,59 ≈ 1,10.</p>
      <InShort>Nach einer signifikanten ANOVA zeigt der <b>Tukey-Test</b>, welche Paare sich unterscheiden. Seine p-Werte sind für die Zahl der Vergleiche <b>korrigiert</b> (adjustiert). Ein Paar unterscheidet sich signifikant, wenn p &lt; 0,05 ist; dann enthält auch sein Intervall die 0 nicht.</InShort>
      <MoreDetail summary="Voraussetzungen der ANOVA">
        <p>Dieselben wie beim t-Test: metrische abhängige Variable, unabhängige Gruppen, genug Befragte je Gruppe. Die klassische ANOVA und Tukey setzen zusätzlich ähnliche Streuungen voraus; prüf das an der Spalte Std. Deviation (Faustregel: größte höchstens doppelt so groß wie die kleinste) und an der Welch-Zeile. Bei sehr kleinen Gruppen wird jeder Vergleich mit dieser Gruppe unsicher.</p>
      </MoreDetail>
      <Mixup>„ANOVA signifikant = alle Gruppen unterscheiden sich.“ Nein: Es reicht, dass sich eine Gruppe von einer anderen unterscheidet. Welche, sagt erst Tukey, und oft sind es nicht alle Paare.</Mixup>
    </Card>

    <Card id="k3-ergebnis" title="Ergebnis festhalten: und warum ein großer Unterschied offen bleiben kann" badge={<Bezug href="#a3-3">zu Schritt 4</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">Die Fragen in Schritt 4 folgen der Ausgabe von oben nach unten.</p>
      <ul className="v-liste">
        <li><b>Wo am weitesten links?</b> „Weighted Descriptive Statistics“, Spalte Mean: der kleinste Mittelwert.</li>
        <li><b>F:</b> „Weighted ANOVA Results“, Zeile „Between Groups“, Spalte F (Marke ② im Beispiel oben).</li>
        <li><b>η²:</b> unter „Effect Sizes“, Spalte Eta Squared. Was der Wert bedeutet, steht in <a href="#k3b">Zwischen den Gruppen gegen innerhalb</a>, „Häufige Verwechslung“.</li>
        <li><b>Signifikante Paare:</b> in der Tukey-Tabelle aus Schritt 3 die Zeilen mit p-value unter .05 zählen, also die mit Sternen.</li>
      </ul>
      <Frage>Wie kann ein großer Unterschied nicht signifikant sein?</Frage>
      <p>Der Standardfehler hängt an der Zahl der Befragten: Sie steht unter dem Bruchstrich (<a href="#k1b">Der t-Wert</a>). Hat eine Gruppe nur wenige Befragte, ist ihr Mittelwert unsicher, der Standardfehler groß und das Intervall breit. Es kann dann über die 0 reichen, obwohl der Unterschied groß aussieht. Nicht signifikant heißt in so einem Fall „nicht entschieden“, nicht „gleich“ (<a href="#k1c">p-Wert und Konfidenzintervall</a>). Darum schaust du für so ein Paar auf N in der Gruppentabelle und auf Std. Error in der Tukey-Zeile.</p>
      <p>Sind alle Fragen richtig, steht deine Festlegung aus Schritt 1 neben dem Ergebnis.</p>
    </Card>
  </Abschnitt>;
}

/* ---------- Aufgabe 4 ---------- */
export function Verstehen4() {
  return <Abschnitt id="g4" n={4} titel="Vertrauen in Institutionen" frage="Hängt das Vertrauen in verschiedene Institutionen zusammen, und spielt das Alter dabei eine Rolle?"
    ziel="einen Blick dafür, wie man eine Korrelationsmatrix liest: das stärkste Paar, signifikante und nicht signifikante Paare, die Fallzahl je Paar."
    weg={[
      ['Schritt 1', '#a4-p', 'Erst festlegen: Welches Paar hängt am stärksten zusammen?', 'k4-frage'],
      ['Schritt 2', '#a4-1', 'die Vorlage und die Matrix lesen', 'k4a'],
      ['Schritt 3', '#a4-2', 'Ergebnis festhalten', 'k4-ergebnis'],
    ]}>

    <Card id="k4-frage" title="Worum es geht: vier Vertrauensfragen und das Alter" badge={<Bezug href="#a4-p">zu Schritt 1</Bezug>} tag={{ kind: 'interpret', label: 'Hintergrund' }}>
      <p className="lead">Vier Fragen nach dem Vertrauen (1 = gar kein Vertrauen bis 7 = großes Vertrauen): in den Bundestag (<code>pt03</code>), die Bundesregierung (<code>pt12</code>), die Polizei (<code>pt14</code>) und die Hochschulen und Universitäten (<code>pt11</code>). Dazu das Alter (<code>age</code>).</p>
      <Frage>Was heißt hier „hängen zusammen“?</Frage>
      <p>Hier gibt es keine Gruppen, sondern nur Variablen mit vielen Ausprägungen. Ob zwei davon <Begriff id="zusammenhang">zusammenhängen</Begriff>, misst <Begriff id="pearson">Pearsons r</Begriff> (kennst du aus Sitzung 6): Das Vorzeichen sagt die Richtung, der Betrag die Stärke.</p>
      <Frage>Warum eine Matrix?</Frage>
      <p>Fünf Variablen ergeben zehn Paare. Statt zehnmal <code>pearson_cor()</code> mit zwei Variablen zu rechnen, gibst du ihm alle fünf auf einmal. Heraus kommt eine Tabelle mit allen Paaren.</p>
      <InShort>Eine <b><Begriff id="korrelationsmatrix">Korrelationsmatrix</Begriff></b> zeigt die Korrelation jedes Paars aus mehreren Variablen in einer Tabelle.</InShort>
    </Card>

    <Card id="k4a" title="Die Korrelationsmatrix lesen" badge={<><Bezug href="#a4-1">zu Schritt 2</Bezug><Known session={6} what="Pearsons r" /></>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Die Vorlage in Schritt 2 gibt <code>pearson_cor()</code> fünf Variablen, dazu das Gewicht. <code>summary()</code> holt die ganze Ausgabe, darin die „Correlation Matrix“ und die „Sample Size Matrix“.</p>
      <Code k="a4_matrix" />
      <p className="absatz">Wie man so eine Matrix liest, zeigt ein Beispiel mit vier anderen Variablen: Hängen Alter, Arbeitsstunden, Lebenszufriedenheit und Gesundheit zusammen? Vier Variablen, sechs Paare.</p>
      <CorrelationMatrix />
      <p className="absatz">Am stärksten hängen Lebenszufriedenheit und Gesundheit zusammen: r = −0,38 (95-%-KI −0,403 bis −0,357). Das Minus erschreckt nur auf den ersten Blick: Bei <code>hs01</code> heißt 1 „sehr gut“ und 5 „schlecht“. Wer seine Gesundheit schlechter einschätzt (höhere Zahl), ist also im Mittel weniger zufrieden. Die Gesundheit hat nur fünf geordnete Ausprägungen; für die Übersicht steht sie hier mit in der Matrix, für eine genaue Aussage über dieses eine Paar wäre <Begriff id="spearman">Spearman-ρ</Begriff> passender (kennst du aus Sitzung 6). Die Arbeitsstunden hängen mit keiner der drei anderen Variablen signifikant zusammen; sie haben nur rund 2.950 Erwerbstätige angegeben.</p>
      <InShort>Eine <b>Korrelationsmatrix</b> zeigt die Korrelation jedes Paars aus mehreren Variablen. Die Diagonale ist immer 1, die beiden Hälften sind gleich. Jedes Paar hat sein eigenes N (<b><Begriff id="ausschluss">paarweiser Ausschluss</Begriff></b>) und seinen eigenen Test. Beim fallweisen Ausschluss fiele dagegen jede Person ganz heraus, der eine Angabe fehlt.</InShort>
      <MoreDetail summary="Viele Paare, viele Tests">
        <p>Vier Variablen ergeben 6 Paare, zehn Variablen schon 45. Jedes Paar ist ein eigener Test mit 5 % Risiko für einen Fehler 1. Art (<a href="#k3a">Viele Paare, viele Tests</a>). Gäbe es zwischen zehn Variablen gar keinen Zusammenhang, würden trotzdem im Mittel etwa zwei Paare (45 × 0,05 = 2,25) Sterne bekommen. Darum achtest du in großen Matrizen vor allem auf starke und inhaltlich erwartete Zusammenhänge, nicht auf einzelne Sterne. Und wie beim t-Test gilt: Bei Tausenden Befragten sind auch sehr kleine r signifikant (age × ls01: r = 0,075).</p>
      </MoreDetail>
      <Mixup>Ein Minus heißt nicht „schlecht“ oder „kein Zusammenhang“. Es sagt nur die Richtung: Steigt die eine Zahl, sinkt die andere. Was das inhaltlich heißt, hängt davon ab, wie die Variablen <Begriff id="kodieren">kodiert</Begriff> sind.</Mixup>
    </Card>

    <Card id="k4-ergebnis" title="Ergebnis festhalten: was die Fragen wissen wollen" badge={<Bezug href="#a4-2">zu Schritt 3</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">Alle Antworten stehen in der Ausgabe aus Schritt 2.</p>
      <ul className="v-liste">
        <li><b>r eines Paars:</b> die Zelle in der Zeile der einen und der Spalte der anderen Variable (oder umgekehrt), ohne Sterne gelesen.</li>
        <li><b>Wie viele Paare signifikant?</b> In einer Hälfte der Matrix die Zellen mit Sternen zählen, ohne die Diagonale (Marken ① bis ③ im Beispiel).</li>
        <li><b>Was folgt aus einem kleinen r mit Sternen?</b> Was die Sterne sagen und was die Zahl, steht in <a href="#k4a">„Die Korrelationsmatrix lesen“</a>; denk an <a href="#k2a">„Signifikant oder groß?“</a> (Aufgabe 2).</li>
        <li><b>Warum verschiedene N?</b> Lies Marke ④ im Beispiel, und denk an <a href="#k1-gruppen">Aufgabe 1</a>: Wem wurden die Vertrauensfragen überhaupt gestellt, und wem das Alter?</li>
      </ul>
      <p>Sind alle Fragen richtig, steht deine Festlegung aus Schritt 1 neben dem Ergebnis.</p>
    </Card>
  </Abschnitt>;
}

/* ---------- Überblick ---------- */
export function Ueberblick() {
  return <section className="grund-block" id="g5" aria-labelledby="g5-h">
    <div className="g-kopf">
      <span className="st m c7" aria-hidden="true">✓</span>
      <div><div className="ueber">Überblick über alle Aufgaben</div><h4 id="g5-h">Vergleichen, prüfen, berichten</h4></div>
    </div>
    <p className="g-intro">Alle vier Aufgaben zusammen: welches Verfahren wann passt, was es voraussetzt und was in einen Bericht gehört.</p>
    <HeadingLevel.Provider value={5}>
      <Card id="kue1" title="Welches Verfahren?" badge={<Badge>t-Test, ANOVA, Korrelation</Badge>} tag={{ kind: 'interpret', label: 'Hintergrund' }}>
        <p className="lead">Welches Verfahren passt, entscheiden zwei Fragen: Ist die Variable, deren Werte du vergleichst, metrisch? Und wie viele Gruppen gibt es?</p>
        <DecisionTree />
        <Frage>Wie passt das zu den Aufgaben?</Frage>
        <ul className="v-liste">
          <li>Aufgabe 1 und 2: eine metrisch behandelte Variable (Vertrauen, Lebenszufriedenheit), zwei Gruppen (ohne und mit Abitur) → <b>t-Test</b>, Welch-Zeile.</li>
          <li>Aufgabe 3: eine metrisch behandelte Variable (Links-rechts), fünf Gruppen (Wohnorte) → <b>ANOVA, danach Tukey</b>.</li>
          <li>Aufgabe 4: mehrere Variablen mit vielen Stufen, keine Gruppen → <b>Korrelationsmatrix</b>.</li>
        </ul>
        <Frage>Und bei anderen Fragen?</Frage>
        <ul className="v-liste">
          <li>„Verdienen Menschen in Ost und West im Mittel gleich viel (Nettoeinkommen in Euro)?“ Eine metrische Variable, zwei Gruppen: <b>t-Test</b>.</li>
          <li>„Unterscheidet sich die Lebenszufriedenheit (0 bis 10) zwischen den fünf Schichten?“ Metrisch behandelt, fünf Gruppen: <b>ANOVA</b>, danach Tukey für die Paare.</li>
          <li>„Hängen Alter, Einkommen und Arbeitsstunden miteinander zusammen?“ Drei metrische Variablen, keine Gruppen: <b>Korrelationsmatrix</b>.</li>
          <li>„Wählen Frauen und Männer verschiedene Parteien?“ Die Partei ist <Begriff id="nominal">nominal</Begriff>, ein Mittelwert ergibt keinen Sinn: <b>Kreuztabelle</b> (Sitzung 5).</li>
        </ul>
        <InShort>Erst das <Begriff id="skalenniveau">Skalenniveau</Begriff>, dann die Zahl der Gruppen. Zwei Gruppen: t-Test. Drei oder mehr: ANOVA mit Tukey. Zwei metrische Variablen: Korrelation.</InShort>
      </Card>

      <Card id="kue2" title="Voraussetzungen und Bericht" badge={<Badge>für alle Aufgaben</Badge>} tag={{ kind: 'interpret', label: 'Deuten' }}>
        <div className="box-gruen">
          <h6>Voraussetzungen je Verfahren</h6>
          <table className="daten voll">
            <caption className="sr-only">Voraussetzungen je Verfahren</caption>
            <thead><tr><th scope="col">Verfahren</th><th scope="col">braucht</th><th scope="col">Vorsicht</th></tr></thead>
            <tbody>
              <tr><td>t-Test</td><td>metrische Variable, zwei unabhängige Gruppen, genug Befragte je Gruppe (Faustregel 30)</td><td>Welch-Zeile lesen. Signifikant heißt nicht groß: Hedges&apos; g nennen.</td></tr>
              <tr><td>ANOVA</td><td>wie t-Test, drei oder mehr Gruppen</td><td>Klassisches F und Tukey setzen ähnliche Streuungen voraus: Std. Deviation vergleichen, Welch-Zeile prüfen. <Begriff id="eta-quadrat">η²</Begriff> nennen.</td></tr>
              <tr><td>Tukey</td><td>eine ANOVA davor</td><td>Kleine Gruppen machen Vergleiche unsicher; nicht signifikant heißt nicht gleich.</td></tr>
              <tr><td>Korrelationsmatrix</td><td>metrische Variablen (oder viele geordnete Stufen)</td><td>Viele Paare, viele Fehler 1. Art; Vorzeichen nach Kodierung lesen; N je Paar verschieden.</td></tr>
            </tbody>
          </table>
          <p className="box-notiz">Für alle gilt: Ein Test sagt, ob ein Unterschied über den Zufall hinausgeht, nicht warum es ihn gibt. Ob das Abitur, der Wohnort oder etwas Drittes dahintersteckt (<Begriff id="drittvariable">Drittvariable</Begriff>, kennst du aus Sitzung 6), klärt kein Mittelwertvergleich. Und für Aussagen über Deutschland gewichtest du.</p>
        </div>
        <h6 className="zwischen">So berichtest du einen Mittelwertvergleich</h6>
        <p className="unter-zwischen">Ein Muster mit den Arbeitsstunden aus „Ein t-Test in R“:</p>
        <blockquote className="s07-bericht">„Erwerbstätige Männer arbeiten im Mittel 41,6 Stunden pro Woche, erwerbstätige Frauen 33,6 Stunden. Der Unterschied von 8,0 Stunden (95-%-KI 7,3 bis 8,7) ist signifikant (Welch-t = 22,99, p &lt; 0,001) und groß (Hedges&apos; g = 0,85). ALLBUS 2023, gewichtet, gewichtetes N = 2.957.“</blockquote>
        <p className="absatz"><b>Bausteine eines Berichts:</b></p>
        <ul>
          <li>Mittelwerte beider Gruppen</li>
          <li>Unterschied mit Einheit und Intervall</li>
          <li>Test mit p</li>
          <li>Effektstärke</li>
          <li>Quelle, Fallzahl, gewichtet. Zur Fallzahl: Mit Gewicht druckt R unter N die Summe der Gewichte; schreib dann „gewichtetes N“ (gezählt waren es hier 2.933 Erwerbstätige).</li>
        </ul>
        <Mixup>„Signifikant = bewiesen.“ Ein Test macht einen Zufallsbefund unwahrscheinlich, beweist aber nichts, schon gar keine <Begriff id="kausalitaet">Ursache</Begriff>.</Mixup>
      </Card>
    </HeadingLevel.Provider>
  </section>;
}

/* ---------- Bilder für die „?“-Fenster der Aufgaben (nur zeigende Bilder mit Beispielen, keine Aufgabenzahlen) ---------- */
export const BILDER = { TFormula, EffectRuler, WelchFormula, FFormula, MeansCI };

/* ---------- Themen für den Reiter „Verstehen“ (Reihenfolge, Karten für die rechte Leiste) ---------- */
export const THEMEN: Thema[] = [
  { id: 'vorweg', n: 'R', kurz: 'R lesen', titel: 'Vorweg: R lesen', minuten: 10, Inhalt: Vorweg,
    karten: [['r1', 'Startblock, Kette, Gewicht'], ['r2', 'Ein t-Test in R']] },
  { id: 'g1', n: '1', kurz: 'Aufgabe 1', titel: 'Vertrauen in den Bundestag', minuten: 20, Inhalt: Verstehen1, aufgabe: 1,
    karten: [['k1-gruppen', 'Zwei Gruppen, ein Mittelwert'], ['k1-vorlage', 'Die Vorlage lesen'], ['k1a', 'Jede Stichprobe ist anders'], ['k1b', 'Der t-Wert'], ['k1-tabelle', 'Die ganze Tabelle'], ['k1c', 'p-Wert und Konfidenzintervall'], ['k1d', 'Die Effektstärke'], ['k1-ergebnis', 'Ergebnis festhalten']] },
  { id: 'g2', n: '2', kurz: 'Aufgabe 2', titel: 'Macht Abitur zufriedener?', minuten: 12, Inhalt: Verstehen2, aufgabe: 2,
    karten: [['k2-frage', 'Derselbe Vergleich, zweimal'], ['k2-vorlagen', 'filter() vor dem Test'], ['k2a', 'Signifikant oder groß?'], ['k2b', 'Die Voraussetzungen'], ['k2c', 'Welch oder Student?'], ['k2-ergebnis', 'Ergebnis festhalten']] },
  { id: 'g3', n: '3', kurz: 'Aufgabe 3', titel: 'Links, rechts und der Wohnort', minuten: 15, Inhalt: Verstehen3, aufgabe: 3,
    karten: [['k3-frage', 'Fünf Wohnorte, eine Skala'], ['k3a', 'Viele Paare, viele Tests'], ['k3-vorlage', 'Die Vorlage: oneway_anova()'], ['k3b', 'F und η²'], ['k3c', 'Der Tukey-Test'], ['k3-ergebnis', 'Ergebnis festhalten']] },
  { id: 'g4', n: '4', kurz: 'Aufgabe 4', titel: 'Vertrauen in Institutionen', minuten: 8, Inhalt: Verstehen4, aufgabe: 4,
    karten: [['k4-frage', 'Vier Vertrauensfragen'], ['k4a', 'Die Korrelationsmatrix lesen'], ['k4-ergebnis', 'Ergebnis festhalten']] },
  { id: 'g5', n: '✓', kurz: 'Überblick', titel: 'Vergleichen, prüfen, berichten', minuten: 5, Inhalt: Ueberblick,
    karten: [['kue1', 'Welches Verfahren?'], ['kue2', 'Voraussetzungen und Bericht']] },
];
