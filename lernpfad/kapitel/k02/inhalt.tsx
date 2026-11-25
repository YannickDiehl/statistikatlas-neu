// Kapitel 2, Reiter „Verstehen“ (Muster: k04/KONZEPT.md): je Aufgabe erklären, was in jedem Schritt passiert und warum.
// Keine Übungen: Die Auswahlfragen der Atlas-Grundlagen (g1_turm, g2_eins, g2_mittel, g3_a–d, g3_k1–k3, g4_verlust) und das
// Zuordnen im Überblick sind hier rhetorische Fragen mit Antwort; ihre Rückmeldungen tragen die Erklärung.
import { Badge, Card, InShort, Known, Mixup, MoreDetail } from '@atlas/chapter/blocks/Card';
import { HeadingLevel } from '@atlas/chapter/blocks/level';
import { ReadR } from '@atlas/chapter/s02/ReadR';
import { CELL_KINDS, CELLS, PV01 } from '@atlas/chapter/s02/content';
import { Convert, SheetsToPlate } from '@atlas/chapter/s02/figures/Interactive';
import { DreiBeschriftungen, Pa02a, Pv01, Typen } from '@atlas/chapter/s02/figures/Pictures';
import '@atlas/chapter/s02/s02.css';
import { Begriff } from '@lernpfad/Begriff';
import type { Thema } from '../../react/typen';
import { AblaufErklaert, VierBoegen } from './figuren';
import { Abschnitt, Bezug, Code, Frage } from '../../react/gemeinsam';

/* ---------- Vorweg ---------- */
export function Vorweg() {
  return <section className="grund-block" id="vorweg" aria-labelledby="vorweg-h">
    <div className="g-kopf">
      <span className="st m c7" aria-hidden="true">R</span>
      <div><div className="ueber">Vorweg, für alle Aufgaben</div><h4 id="vorweg-h">R lesen</h4></div>
    </div>
    <p className="g-intro">Die Aufgaben arbeiten mit drei Werkzeugen: einem Objekt, das du mit <code>&lt;-</code> ablegst, der Pipe <code>%&gt;%</code> mit <code>filter()</code> und dem Nachschlagen mit <code>codebook()</code>. Hier steht, wie du sie liest.</p>
    <HeadingLevel.Provider value={5}><ReadR /></HeadingLevel.Provider>
  </section>;
}

/* ---------- Aufgabe 1 ---------- */
export function Verstehen1() {
  return <Abschnitt id="g1" n={1} titel="Wer hat auf Papier geantwortet?" frage="Wie viele Zeilen des ALLBUS waren einmal ein Papierbogen?"
    ziel="die Ausgabe von R gelesen, mit filter() nur die Papierbögen behalten und kannst sagen, wie viele es sind, was mit den Variablen passiert und für wen ein Ergebnis dann gilt."
    weg={[
      ['Schritt 1', '#a1-p', 'Erst festlegen: Welcher Teil hat auf Papier geantwortet?', 'k1-wege'],
      ['Schritt 2', '#a1-1', 'den Datensatz anzeigen: eine Zeile je Fragebogen', 'k1-matrix'],
      ['Schritt 2', '#a1-1', 'die Ausgabe lesen: Fälle mal Variablen', 'k1-ausgabe'],
      ['Schritt 3', '#a1-2', 'nachschlagen, welcher Code für den Papierbogen steht', 'k1-nachschlagen'],
      ['Schritt 4', '#a1-3', 'mit filter() nur die Papierbögen behalten', 'k1-filter'],
      ['Schritt 5', '#a1-4', 'Ergebnis festhalten: Fälle, Code, Auswahl, für wen es gilt', 'k1-ergebnis'],
    ]}>

    <Card id="k1-wege" title="Worum es geht: drei Erhebungswege" badge={<Bezug href="#a1-p">zu Schritt 1</Bezug>} tag={{ kind: 'interpret', label: 'Hintergrund' }}>
      <p className="lead">Die Frage „Wie viele Zeilen des ALLBUS waren einmal ein Papierbogen?“ führt zurück zu dem Moment, in dem die Daten entstanden sind. Der ALLBUS 2023 wurde auf drei Wegen erhoben: im persönlichen Interview, bei dem die Antworten direkt in einen Laptop getippt werden (<b>CAPI</b>), online (<b>CAWI</b>) und auf Papier, das per Post zurückkam (<b>MAIL</b>). Gespeichert ist der Weg in der Variable <code>mode</code>.</p>
      <Frage>Was ist beim Papier anders?</Frage>
      <p>Im Interview und online landen die Antworten direkt im Computer. Einen Papierbogen musste jemand abtippen: Kreuz für Kreuz wurde daraus eine Zeile im Datensatz. Wie aus einem Fragebogen eine Zeile wird, zeigt die nächste Karte; Aufgabe 2 und 3 schauen sich das genauer an.</p>
      <Frage>Und warum sollst du vorher festlegen, was du erwartest?</Frage>
      <p>Wer vorher eine Erwartung notiert, merkt hinterher, wo das eigene Bild danebenlag. Ohne Festlegung wirkt jedes Ergebnis im Nachhinein „klar“. Am Ende prüfst du deine Festlegung selbst: Zahl der Papierbögen geteilt durch alle Fälle ergibt den Anteil. Holst du die Ergebnisse ins Journal, steht deine Festlegung daneben.</p>
      <InShort>Der <Begriff id="erhebungsweg">Erhebungsweg</Begriff> (im Codebuch: Erhebungsmodus) sagt, auf welchem Weg die Antworten einer Person in den Datensatz kamen. Es gibt drei: Interview, online oder Papier.</InShort>
    </Card>

    <Card id="k1-matrix" title="Vom Fragebogen zur Zeile: die Datenmatrix" badge={<><Bezug href="#a1-1">zu Schritt 2</Bezug> <Badge>Datenmatrix: kennst du aus Methoden Ia</Badge></>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Drei Menschen haben einen Fragebogen ausgefüllt. Aus jedem Fragebogen wird eine <b>Zeile</b> im Datensatz, aus jeder Frage eine <b>Spalte</b>. Im Bild ist jede Zelle ein Stein. Tipp auf einen Stein, um zu sehen, was er ist.</p>
      <SheetsToPlate />
      <InShort>Ein Datensatz ist eine <Begriff id="datenmatrix">Datenmatrix</Begriff>: Jede Zeile ist ein <Begriff id="fall">Fall</Begriff> (im ALLBUS eine befragte Person), jede Spalte eine <Begriff id="variable">Variable</Begriff> (meist eine Frage), jede Zelle ein <Begriff id="wert">Wert</Begriff>. Im Bild ist der Datensatz eine Bauplatte: jeder Fall eine Reihe, jede Variable ein Turm, jeder Wert ein Stein.</InShort>
      <Frage>Wie viele Zellen hat eine einzelne Variable, etwa die Lebenszufriedenheit <code>ls01</code>?</Frage>
      <p>Einen Wert für jede befragte Person, also so viele, wie der Datensatz Fälle hat. Auch wer nicht geantwortet hat, hat bei dieser Variable eine Zelle: einen <Begriff id="fehlende-werte">fehlenden Wert</Begriff>, zu dem der Grund gespeichert ist (mehr dazu in Aufgabe 3). Bei <code>ls01</code> fehlen 82 Werte. Darum ist ein Datensatz immer ein Rechteck. Wie groß das Rechteck beim ALLBUS ist, kennst du aus Sitzung 1; in Schritt 2 liest du es selbst in der Ausgabe ab.</p>
      <MoreDetail summary="Fall, Variable, Wert, Datenreihe">
        <ul>
          <li>Ein <b>Fall</b> ist die Einheit, über die du etwas weißt, im ALLBUS eine befragte Person. Ein anderes Wort dafür ist Merkmalsträger.</li>
          <li>Eine <b>Variable</b> ist ein Merkmal, das von Fall zu Fall verschieden sein kann, meist eine Frage aus dem Fragebogen. Sie hat einen kurzen Namen wie <code>ls01</code>.</li>
          <li>Ein <b>Wert</b> ist, was ein Fall bei einer Variable hat, also eine Antwort. Die möglichen Antworten einer Variable heißen <Begriff id="auspraegung">Ausprägungen</Begriff>.</li>
          <li>Liest du eine Variable von oben nach unten, hast du ihre <Begriff id="datenreihe">Datenreihe</Begriff>: einen Wert je Person, in der Reihenfolge der Personen. Mit ihr beginnt jede Rechnung.</li>
          <li>Im Bild haben die Steine Farben: Blau heißt Zahl. Die Farbe steht für den Datentyp; mehr dazu in <a href="#k4-typen">Verstehen zu Aufgabe 4</a>.</li>
        </ul>
      </MoreDetail>
      <Mixup>Variable und Wert. „Lebenszufriedenheit“ ist die Variable, die ganze Spalte. „8“ ist ein Wert in einer einzelnen Zelle. Und eine Zeile ist eine Person, nicht eine Frage.</Mixup>
    </Card>

    <Card id="k1-ausgabe" title="Die Ausgabe lesen: Fälle mal Variablen" badge={<Bezug href="#a1-1">zu Schritt 2</Bezug>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">Die Vorlage in Schritt 2 besteht nur aus dem Namen <code>allbus</code>. Führst du nur den Namen eines <Begriff id="objekt">Objekts</Begriff> aus, zeigt R es an.</p>
      <Code k="a1a" />
      <Frage>Was steht in welcher Zeile der Ausgabe?</Frage>
      <p>Das Bild in Schritt 2 zeigt den Aufbau. Von oben nach unten:</p>
      <ul>
        <li><b>Die erste Zeile</b> verrät die Größe: <code>A tibble: Fälle × Variablen</code>, erst die Fälle (Zeilen), dann die Variablen (Spalten). Ein <b>tibble</b> ist die Form, in der R eine Datenmatrix zeigt.</li>
        <li><b>Darunter</b> stehen die Namen der ersten Variablen und in spitzen Klammern ihr <Begriff id="datentyp">Typ</Begriff>. Was die Typen heißen, erklärt <a href="#k4-typen">Verstehen zu Aufgabe 4</a>.</li>
        <li><b>Dann</b> folgen die ersten Zeilen.</li>
        <li><b>Die letzten Zeilen</b> sagen, wie viele Fälle und Variablen nicht gezeigt sind („more rows“, „more variables“).</li>
      </ul>
      <Frage>Warum zeigt R nicht alles?</Frage>
      <p>Weil der Datensatz viel zu groß für den Bildschirm ist. R zeigt so viele Variablen, wie in die Breite passen, und die ersten Zeilen. Die Größe in der ersten Zeile gilt trotzdem für den ganzen Datensatz. Im <Begriff id="environment">Environment</Begriff> steht dieselbe Größe noch einmal neben dem Namen.</p>
      <Mixup>R schreibt Tausender mit Komma: 5,246 heißt 5.246, nicht fünf Komma zwei. Ins Antwortfeld tippst du die Zahl ohne das Komma von R.</Mixup>
    </Card>

    <Card id="k1-nachschlagen" title="Nachschlagen: welcher Code wofür steht" badge={<Bezug href="#a1-2">zu Schritt 3</Bezug>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">In <code>mode</code> steht kein Wort wie MAIL, sondern ein <Begriff id="code">Code</Begriff>, eine Zahl. Welcher Code für welchen Erhebungsweg steht, sagen die <Begriff id="wertelabel">Wertelabels</Begriff> im <Begriff id="codebuch">Codebuch</Begriff>. Schritt 3 schlägt sie nach.</p>
      <Code k="a1b" />
      <p><code>codebook(allbus, mode)</code> zeigt den Eintrag einer einzelnen Variable (mehr in <a href="#r3">„Nachschlagen mit codebook()“</a>). Unter <code>Value labels</code> steht, welches Wort zu welchem Code gehört. Dort suchst du MAIL und nimmst die Zahl davor.</p>
      <Frage>Was ist der Unterschied zwischen Values und Value labels?</Frage>
      <p><code>Values</code> zählt die Codes auf, die im Datensatz wirklich vorkommen. <code>Value labels</code> listet alle Wörter, die das Codebuch kennt. PAPI (Code 1, ein älterer Papier-Interviewweg) steht darum unter den Wertelabels, kommt 2023 aber nicht vor.</p>
      <Frage>Warum nicht einfach <code>filter(mode == "MAIL")</code>?</Frage>
      <p>Weil in der Spalte Zahlen stehen, keine Wörter. R meldet dann „Can't combine x &lt;character&gt; and y &lt;double&gt;“: Es soll ein Wort mit einer Zahl vergleichen. Darum schlägst du zuerst den Code nach. Nimmst du einen Code, der nicht vorkommt, etwa die 1 für PAPI, gibt es keine Fehlermeldung, aber einen leeren Datensatz mit 0 Fällen.</p>
      <InShort>Im Datensatz steht für jede Antwort ein <b>Code</b>. Was er bedeutet, sagt das <b>Wertelabel</b> im Codebuch. Darum gilt: erst nachschlagen, dann auswählen.</InShort>
    </Card>

    <Card id="k1-filter" title="Nur bestimmte Fälle behalten: filter()" badge={<Bezug href="#a1-3">zu Schritt 4</Bezug>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">Die Vorlage in Schritt 4 hat dieselbe Form wie das Beispiel mit <code>frauen</code> in <a href="#r2">„Die Pipe mit einem Schritt“</a>. Im Moment steht dort die 2, also die Interviews.</p>
      <Code k="a1c" />
      <p>So liest du den Code: „Nimm <code>allbus</code>, und dann behalte nur die Fälle, bei denen <code>mode</code> gleich dem markierten Code ist. Leg das Ergebnis unter dem Namen <code>auswahl</code> ab.“ Die letzte Zeile zeigt <code>auswahl</code> an. Du tauschst nur die gelbe Zahl.</p>
      <Frage>Was passiert dabei mit Fällen und Variablen?</Frage>
      <p><code>filter()</code> fragt jeden Fall, ob er bleiben darf: Steht in <code>mode</code> dieser Code? Fälle mit Ja bleiben mit allen ihren Werten, die anderen fallen weg. Das Bild in „Die Pipe mit einem Schritt“ zeigt es mit <code>sex</code>: Die Zeilen mit MANN und DIVERS werden grau, alle Variablen bleiben erhalten.</p>
      <Frage>Warum zwei Gleichheitszeichen?</Frage>
      <p><code>==</code> fragt „ist gleich?“ und prüft jeden Fall. Ein einzelnes <code>=</code> stellt dagegen ein <Begriff id="argument">Argument</Begriff> ein. Schreibst du <code>filter(mode = 2)</code>, meldet R „We detected a named input … Did you mean <code>mode == 2</code>?“.</p>
      <InShort>Die <Begriff id="pipe">Pipe</Begriff> <code>%&gt;%</code> gibt den Datensatz an die <Begriff id="funktion">Funktion</Begriff> <code>filter()</code> weiter („und dann“). <code>filter()</code> behält nur die Fälle, für die die Bedingung stimmt. Mit <code>&lt;-</code> legst du das Ergebnis unter einem neuen Namen ab.</InShort>
      <Mixup><code>allbus</code> bleibt, wie es ist. <code>filter()</code> ändert den Datensatz nicht, sondern legt einen neuen an, und der liegt unter <code>auswahl</code>. Darum kannst du mit <code>allbus</code> jederzeit weiterarbeiten.</Mixup>
    </Card>

    <Card id="k1-ergebnis" title="Ergebnis festhalten: wo du was abliest" badge={<Bezug href="#a1-4">zu Schritt 5</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">In Schritt 5 hältst du fünf Dinge fest. Jedes hat einen Ort, an dem du es ablesen oder begründen kannst.</p>
      <ul>
        <li><b>Fälle von <code>allbus</code>:</b> die erste Zahl in der ersten Zeile der Ausgabe aus Schritt 2 (<a href="#k1-ausgabe">Die Ausgabe lesen</a>).</li>
        <li><b>Code für MAIL:</b> Ausgabe aus Schritt 3, unter <code>Value labels</code> (<a href="#k1-nachschlagen">Nachschlagen</a>).</li>
        <li><b>Fälle deiner Auswahl:</b> erste Zeile der Ausgabe aus Schritt 4, nachdem du die 2 getauscht hast. Steht dort noch die Zahl der Interviews, ist die 2 noch drin.</li>
        <li><b>Was <code>filter()</code> gemacht hat:</b> Leg die ersten Zeilen aus Schritt 2 und Schritt 4 nebeneinander. Welche der beiden Zahlen hat sich geändert, welche nicht?</li>
      </ul>
      <Frage>Und für wen gilt ein Ergebnis, das du mit einer Auswahl ausrechnest?</Frage>
      <p>Denk an <code>frauen</code> aus „R lesen“. Rechnest du mit <code>frauen</code> weiter, beschreibt jedes Ergebnis nur die Fälle, die dort noch stehen, also die Frauen unter den Befragten. Eine Auswahl ändert, über wen du sprichst. Und von den Befragten auf alle Menschen in Deutschland zu schließen, braucht mehr als eine Auswahl, unter anderem eine Gewichtung (Sitzung 6).</p>
      <Mixup>Eine Auswahl ist eine Teilgruppe. Wer nur bestimmte Fälle behält, spricht nur noch über diese Fälle, auch wenn der Datensatz genauso viele Variablen hat wie vorher.</Mixup>
    </Card>
  </Abschnitt>;
}

/* ---------- Aufgabe 2 ---------- */
const CODEBUCH_PA02A = `[239] pa02a (haven_labelled<double>)
    Label: POLITISCHES INTERESSE, BEFR. (ORDINAL)
    Values: 1, 2, 3, 4, 5
    Value labels:
      1 = SEHR STARK
      2 = STARK
      3 = MITTEL
      4 = WENIG
      5 = UEBERHAUPT NICHT
    Missing values:
      -42 = DATENFEHLER: MFN (n = 4)
      -9 = KEINE ANGABE (n = 17)`;

export function Verstehen2() {
  return <Abschnitt id="g2" n={2} titel="Ein Fragebogen wird zur Zeile" frage="Welche Zahlen stehen in der Zeile dieser Person?"
    ziel="aus einem ausgefüllten Papierbogen eine Zeile mit vier Codes gemacht und kannst begründen, warum ein höherer Code nicht immer „mehr“ bedeutet."
    weg={[
      ['Schritt 1', '#a2-p', 'Erst festlegen: Welche Zahl bekommt „schlecht“?', 'k2-richtung'],
      ['Schritt 2', '#a2-1', 'den Fragebogen ansehen: Fragen, Kreuze, Variablennamen', 'k2-beschriftungen'],
      ['Schritt 3', '#a2-2', 'vier Variablen im Codebuch nachschlagen', 'k2-eintrag'],
      ['Schritt 4', '#a2-3', 'vom Wort auf dem Fragebogen zum Code', 'k2-zuordnen'],
      ['Schritt 5', '#a2-4', 'Deuten: Menge oder Name?', 'k2-namen'],
      ['Schritt 6', '#a2-5', 'Ergebnis festhalten: deine Zeile', 'k2-ergebnis'],
    ]}>

    <Card id="k2-richtung" title="1 oder 5? Die Polung einer Skala" badge={<Bezug href="#a2-p">zu Schritt 1</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Im ALLBUS steht die Frage <em>„Wie stark interessieren Sie sich für Politik?“</em>. Angekreuzt wird eine von fünf Antwortkategorien: sehr stark, stark, mittel, wenig, überhaupt nicht. Im Datensatz steht aber kein Wort, sondern eine Zahl.</p>
      <Frage>Welche Zahl bekommt „sehr stark“?</Frage>
      <p>Viele tippen auf 5, weil mehr Interesse nach einer höheren Zahl klingt. Im ALLBUS ist es umgekehrt: 1 = SEHR STARK, 5 = UEBERHAUPT NICHT.</p>
      <Pa02a caption={<>Im Bild kleben die Wertelabels als gelbe Aufkleber an den Steinen, also an den Werten. Unter „fehlende Werte“ stehen leere Steine mit ihrem Grund. <span>Codes, Wertelabels und Anzahlen aus dem ALLBUS 2023.</span></>} />
      <p>Deine Festlegung in Schritt 1 stellt dieselbe Frage für eine andere Variable, die eigene wirtschaftliche Lage. Was dort gilt, siehst du im Codebuch in Schritt 3.</p>
      <InShort>Im Datensatz steht für eine Antwort ein <Begriff id="code">Code</Begriff>, eine Zahl. Was sie bedeutet, sagt das <Begriff id="wertelabel">Wertelabel</Begriff>. Welcher Code zu welchem Wort gehört, steht im <Begriff id="codebuch">Codebuch</Begriff>. Raten hilft nicht: Die Richtung einer Skala, ihre <Begriff id="polung">Polung</Begriff>, legt der Fragebogen fest.</InShort>
      <Mixup>Höher heißt nicht mehr. Bei <code>pa02a</code> heißt die höchste Zahl am wenigsten Interesse. Schau vor jeder Deutung ins Codebuch, wie eine Skala gepolt ist.</Mixup>
    </Card>

    <Card id="k2-beschriftungen" title="Drei Beschriftungen" badge={<><Bezug href="#a2-1">zu Schritt 2</Bezug> <Known session={1} what="Variablenlabel und Wertelabel" /></>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Auf dem Fragebogen in Schritt 2 stehen die Fragen in Worten, darunter die Namen der Variablen im ALLBUS. Jede Variable trägt drei Beschriftungen, und nur eine davon steht auf dem Fragebogen.</p>
      <DreiBeschriftungen />
      <ul>
        <li>Der <b>Variablenname</b> ist kurz und für R gemacht: <code>pa02a</code>. Er steht unter dem Fragebogen.</li>
        <li>Das <Begriff id="variablenlabel">Variablenlabel</Begriff> sagt in Worten, was gefragt wurde: POLITISCHES INTERESSE, BEFR. (ORDINAL).</li>
        <li>Die <b>Wertelabels</b> sagen, was jeder Code bedeutet. Im Bild sind sie gelb hinterlegt. Sie stehen im Codebuch, nicht auf dem Fragebogen.</li>
      </ul>
      <Frage>Hat jeder Code ein Wort?</Frage>
      <p>Nein. Bei der Lebenszufriedenheit <code>ls01</code> haben nur die Enden ein Wertelabel: 0 GANZ UNZUFRIEDEN und 10 GANZ ZUFRIEDEN. Dazwischen steht im Codebuch nur „..“: Die Zahlen 1 bis 9 sprechen für sich. Und manche Variablen haben für ihre gültigen Werte gar keine Wertelabels; dort ist die Zahl selbst die Antwort.</p>
      <InShort>Variablenname (kurz, für R), Variablenlabel (was gefragt wurde) und Wertelabels (was ein Code bedeutet) stehen zusammen im Codebuch.</InShort>
      <Mixup>Variablenlabel und Wertelabel. Das Variablenlabel beschriftet die ganze Variable („Politisches Interesse“), ein Wertelabel einen einzelnen Code („SEHR STARK“).</Mixup>
    </Card>

    <Card id="k2-eintrag" title="Einen Eintrag im Codebuch lesen" badge={<Bezug href="#a2-2">zu Schritt 3</Bezug>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">Die Vorlage in Schritt 3 schlägt vier Variablen auf einmal nach; mehrere Variablen trennst du mit Komma. Für jede Variable erscheint ein eigener Eintrag.</p>
      <Code k="a2" />
      <Frage>Wie liest du so einen Eintrag?</Frage>
      <p>Ein Beispiel, wörtlich aus R, für die Variable aus der ersten Karte:</p>
      <pre className="code" tabIndex={0} aria-label="Codebuch-Eintrag von pa02a, wie R ihn als Text ausgibt">{CODEBUCH_PA02A}</pre>
      <ul>
        <li><code>[239]</code> ist die Position im Datensatz: <code>pa02a</code> ist die 239. Variable. In Klammern steht der Typ, eine Zahl mit Wertelabels (<a href="#k4-typen">Verstehen zu Aufgabe 4</a>).</li>
        <li><code>Label</code> ist das Variablenlabel: was gefragt wurde.</li>
        <li><code>Values</code> zählt die <Begriff id="gueltige-werte">gültigen</Begriff> Codes auf. Hat eine Variable für ihre gültigen Werte keine Wertelabels, steht hier nur, von wo bis wo die Zahlen reichen; Wertelabels gibt es dann höchstens für fehlende Werte.</li>
        <li><code>Value labels</code> zeigt, welches Wort zu welchem Code gehört. Hier suchst du die Antworten vom Fragebogen.</li>
        <li><code>Missing values</code> zeigt die <Begriff id="fehlende-werte">fehlenden Werte</Begriff> mit ihrem Grund und wie oft sie vorkommen. Darum geht es in Aufgabe 3.</li>
      </ul>
      <MoreDetail summary="Umlaute, Viewer und eigene Beschriftungen">
        <ul>
          <li>Umlaute schreibt der ALLBUS als ae, oe, ue: UEBERHAUPT. Bei der Suche mit <code>find_var()</code> hilft das (kennst du aus Sitzung 1).</li>
          <li>In RStudio öffnet sich derselbe Eintrag im Viewer als Tabelle; dort zeigt die Spalte Freq. zusätzlich, wie oft jeder gültige Code vorkommt.</li>
          <li>Wer selbst einen Datensatz eingibt, vergibt diese Beschriftungen selbst. Wie das in R geht, zeigt der R-Workshop in Kapitel 4 („Variablen- und Wertelabels lesen und setzen“); im Seminar war es nicht dran.</li>
        </ul>
      </MoreDetail>
    </Card>

    <Card id="k2-zuordnen" title="Vom Wort zum Code" badge={<Bezug href="#a2-3">zu Schritt 4</Bezug>} tag={{ kind: 'interpret', label: 'Hintergrund' }}>
      <p className="lead">In Schritt 4 tust du, was beim ALLBUS mit jedem Papierbogen passiert ist: Du übersetzt Kreuze mit dem Codebuch in Zahlen. Dabei entscheiden verschiedene Menschen Verschiedenes.</p>
      <Frage>Wer entscheidet was?</Frage>
      <ul>
        <li>Die <b>befragte Person</b> entscheidet, wo ihr Kreuz steht oder welche Zahl sie einträgt.</li>
        <li>Die <b>Macherinnen und Macher der Befragung</b> haben festgelegt, welche Zahl welche Antwort bekommt; Lücken und große Zahlen sind dabei erlaubt. Das steht im Codebuch.</li>
        <li>Wer <b>abtippt</b>, schlägt für jedes Kreuz im Codebuch nach und trägt den Code ein.</li>
      </ul>
      <Frage>Wie gehst du bei jeder Antwort vor?</Frage>
      <ol>
        <li>Such den Eintrag der Variable, deren Name unter der Frage steht.</li>
        <li>Such unter <code>Value labels</code> das Wort, das zur Antwort passt. Auf dem Fragebogen steht oft ein ganzer Satz, im Codebuch ein kurzes Wort in Großbuchstaben.</li>
        <li>Nimm die Zahl vor dem Wort. Achte darauf, wie die Skala gepolt ist (<a href="#k2-richtung">1 oder 5?</a>).</li>
        <li>Gibt es für die Antwort kein Wertelabel, ist die Zahl auf dem Fragebogen selbst der Wert.</li>
      </ol>
      <Frage>Warum nicht einfach abzählen, an welcher Stelle das Kreuz steht?</Frage>
      <p>Weil der Platz auf dem Fragebogen nicht der Code sein muss. Bei der Wahlabsicht steht die Linke auf dem Papierbogen an fünfter Stelle, ihr Code ist trotzdem 6. Wer bei <code>pv01</code> die 5 einträgt, macht einen Fehler: Das Codebuch sagt eindeutig 6 = DIE LINKE.</p>
      <InShort>Aus den Kreuzen auf einem Fragebogen Codes im Datensatz machen heißt <Begriff id="kodieren">Kodieren</Begriff> (beim ALLBUS auch: Erfassen). Das heißt: Kreuz suchen, im Codebuch nachschlagen, Zahl eintragen.</InShort>
      <Mixup>Platz auf dem Fragebogen und Code. Wer Listenplätze abzählt, statt im Codebuch nachzusehen, kodiert falsch.</Mixup>
    </Card>

    <Card id="k2-namen" title="Codes sind Namen" badge={<Bezug href="#a2-4">zu Schritt 5</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">Bei der Wahlabsicht <code>pv01</code> („Wenn am nächsten Sonntag Bundestagswahl wäre …“) hat jede Partei einen Code:</p>
      <Pv01 codes={PV01.codes} />
      <p>Die AfD hat den Code 42, die Linke die 6, eine 5 gibt es nicht. Die Codes sind wie Rückennummern: Sie benennen, sie zählen nichts ab.</p>
      <Frage>Rechnet man trotzdem den <Begriff id="mittelwert">Mittelwert</Begriff> aller gültigen Codes von <code>pv01</code> aus, kommt 16,1 heraus. Was sagt diese Zahl über die Wahlabsicht?</Frage>
      <p>Nichts. Der Mittelwert behandelt die Codes wie Mengen, aber die 42 der AfD ist nicht siebenmal so viel wie die 6 der Linken. Für 16,1 gibt es keine Partei. Bei Codes für Kategorien ohne Reihenfolge ist ein Mittelwert sinnlos. Zählen kannst du sie, rechnen nicht. Wie oft jede Partei genannt wird, zeigt <code>frequency()</code> (kennst du aus Sitzung 1); Prozente dazu kommen in Sitzung 3.</p>
      <Frage>Und was heißt das für deine Zeile in Schritt 5?</Frage>
      <p>Schau bei jeder Zahl, was sie bedeutet. Manche Zahlen messen eine Menge: Bei Jahren ist ein Jahr mehr überall gleich viel. Andere stehen für Antworten auf einer Skala mit Reihenfolge, und in welche Richtung sie laufen, sagt das Wertelabel. Wieder andere sind nur Namen. Ob eine Reihenfolge gilt, sagt das Wertelabel, nicht die Zahl.</p>
      <InShort>Codes für Kategorien sind Namen, keine Mengen. Ob du mit einer Zahl rechnen darfst, hängt davon ab, was sie misst. Der Fachbegriff dafür ist <Begriff id="skalenniveau">Skalenniveau</Begriff>; in Sitzung 3 rechnest du damit weiter.</InShort>
      <MoreDetail summary="Die drei Skalenniveaus">
        <ul>
          <li><Begriff id="nominal">Nominal</Begriff>: Die Codes unterscheiden nur, wie Rückennummern. Beispiel: die Parteien bei <code>pv01</code>. Zählen darfst du, einen Mittelwert bilden nicht.</li>
          <li><Begriff id="ordinal">Ordinal</Begriff>, also geordnete Kategorien: Die Kategorien haben eine Reihenfolge, die Abstände sind aber nicht festgelegt. Beispiel: das politische Interesse bei <code>pa02a</code>.</li>
          <li><Begriff id="metrisch">Metrisch</Begriff>: Gleiche Abstände bedeuten überall gleich viel. Beispiel: das Alter in Jahren.</li>
        </ul>
      </MoreDetail>
      <MoreDetail summary="Warum 42?">
        <p>Welche Zahl eine Partei bekommt, legen die Macherinnen und Macher der Befragung fest; Lücken und große Zahlen sind dabei erlaubt. Wichtig ist nur: Gleicher Code heißt gleiche Antwort, und welche Antwort das ist, steht im Codebuch. Zählen darfst du die Codes: Im ALLBUS 2023 nennen 480 Befragte die AfD und 260 die Linke.</p>
      </MoreDetail>
    </Card>

    <Card id="k2-ergebnis" title="Ergebnis festhalten: deine Zeile" badge={<Bezug href="#a2-5">zu Schritt 6</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">In Schritt 6 trägst du deine Zeile ein und deutest sie. Alles steht in der Ausgabe aus Schritt 3.</p>
      <ul>
        <li><b>Bei <code>age</code>:</b> Schau, ob es für die Jahre Wertelabels gibt oder nur einen Bereich unter <code>Values</code> (<a href="#k2-eintrag">Einen Eintrag lesen</a>).</li>
        <li><b>Bei <code>educ</code>, <code>ep03</code> und <code>id02</code>:</b> unter <code>Value labels</code> das passende Wort suchen und die Zahl davor nehmen. Bei <code>ep03</code> lohnt der Blick auf die <Begriff id="polung">Polung</Begriff> (<a href="#k2-richtung">1 oder 5?</a>).</li>
        <li><b>Die letzte Frage</b> vergleicht zwei Codes von <code>educ</code>. Lies, was beide Wertelabels heißen, statt die Zahlen zu vergleichen (<a href="#k2-namen">Codes sind Namen</a>).</li>
      </ul>
      <p>Für das Plenum gibt es eine Zusatzfrage zu „keiner dieser Schichten“. Sie dreht sich um dieselbe Entscheidung wie in Aufgabe 3: Was ist eine Antwort, und was ist ein fehlender Wert?</p>
    </Card>
  </Abschnitt>;
}

/* ---------- Aufgabe 3 ---------- */
const GRUENDE: [string, string, string, string][] = [
  ['−6', 'KENNE ICH NICHT', 'die Person kennt das Gefragte nicht', 'Astrologie und Horoskope (rh08b): 178-mal'],
  ['−8', 'WEISS NICHT', 'die Person weiß keine Antwort', 'Wahlabsicht (pv01): 603-mal'],
  ['−9', 'KEINE ANGABE', 'gefragt, aber nicht geantwortet', 'Lebenszufriedenheit (ls01): 81-mal'],
  ['−10', 'TNZ: FILTER', 'nicht gefragt, weil eine Frage davor sie ausgeschlossen hat', 'Arbeitsstunden (dw15): 2.263-mal'],
  ['−11', 'TNZ: SPLIT', 'nicht gefragt, weil die Frage nur in der anderen Fragebogenversion stand', 'Demokratiezufriedenheit (ps03): 1.596-mal'],
  ['−42', 'DATENFEHLER: MFN', 'mehrere Kreuze, keines lässt sich nehmen', 'Lebenszufriedenheit (ls01): 1-mal'],
];

export function Verstehen3() {
  return <Abschnitt id="g3" n={3} titel="Was nur auf Papier passiert" frage="Welche fehlenden Werte gibt es im ALLBUS nur, weil es Papierbögen gibt?"
    ziel="gesehen, wie der ALLBUS zwei Kreuze und nicht gestellte Fragen speichert, und kannst mit Zahlen aus R begründen, warum „fehlt“ nicht gleich „fehlt“ ist."
    weg={[
      ['Schritt 1', '#a3-p', 'Erst festlegen: Gibt es −42 auch im Interview oder online?', 'k3-boegen'],
      ['Schritt 2', '#a3-1', 'das Codebuch der Papierbögen lesen', 'k3-gruende'],
      ['Schritt 3', '#a3-2', 'mit allen Befragten vergleichen', 'k3-vergleich'],
      ['Schritt 4', '#a3-3', 'nicht gefragt zählen: −11 TNZ: SPLIT', 'k3-split'],
      ['Schritt 5', '#a3-4', 'Ergebnis festhalten: wo, wie oft, was es heißt', 'k3-ergebnis'],
      ['nach Schritt 5: Plenum', '#a3-4', 'Fehler oder Konvention?', 'k3-konvention'],
    ]}>

    <Card id="k3-boegen" title="Was trägst du ein? Vier Fragebögen" badge={<Bezug href="#a3-p">zu Schritt 1</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Nicht jeder Fragebogen ist sauber ausgefüllt. Wer abtippt, muss für jede Frage entscheiden, was in die Zelle kommt. Vier Fragebögen, zum Beispiel, und was der ALLBUS für jeden speichert:</p>
      <VierBoegen />
      <p>Fragebogen C zeigt, wie der Code −42 entsteht. Deine Festlegung in Schritt 1 fragt, ob er auch bei Befragten vorkommt, die im Interview oder online geantwortet haben.</p>
      <InShort>Ein <Begriff id="fehlende-werte">fehlender Wert</Begriff> heißt: Für diese Person gibt es bei dieser Variable keine <Begriff id="gueltige-werte">gültige Antwort</Begriff>. Der ALLBUS speichert dazu den Grund als negativen Code, einen <Begriff id="missing-code">Missing-Code</Begriff>, etwa −9 KEINE ANGABE oder −11 TNZ: SPLIT. In R wird daraus ein <code>NA</code>; den Grund merkt sich R als Wertelabel. Im Bild ist das ein leerer Stein mit Aufkleber.</InShort>
      <Mixup>0 und fehlend. Eine 0 kann eine Antwort sein (ganz unzufrieden, 0 Kinder). „Keine Angabe“ dagegen ist −9 und wird nie mitgerechnet.</Mixup>
    </Card>

    <Card id="k3-gruende" title="Die Gründe im Codebuch" badge={<><Bezug href="#a3-1">zu Schritt 2</Bezug> <Known session={1} what="TNZ: SPLIT und TNZ: FILTER" /></>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">Im Codebuch stehen die fehlenden Werte jeder Variable unter „Missing values“, mit Grund und Anzahl. Im ALLBUS 2023 gibt es 17 verschiedene solche <b>Missing-Codes</b>. Die wichtigsten:</p>
      <table className="daten voll s2-gruende">
        <caption>Fehlende Werte im ALLBUS 2023, Beispiele</caption>
        <thead><tr><th scope="col">Code</th><th scope="col">Wertelabel</th><th scope="col">heißt</th><th scope="col">Beispiel im ALLBUS 2023</th></tr></thead>
        <tbody>{GRUENDE.map(([code, label, means, ex]) => <tr key={code}><td>{code}</td><td>{label}</td><td><b>{means}</b></td><td>{ex}</td></tr>)}</tbody>
      </table>
      <Frage>Was tut die Vorlage in Schritt 2?</Frage>
      <Code k="a3" />
      <p>Der erste Teil ist dir aus Aufgabe 1 bekannt: <code>filter()</code> behält nur die Papierbögen und legt sie unter <code>papier</code> ab. Dann schlägt <code>codebook()</code> drei Variablen nach. Das erste Argument in <code>codebook()</code> sagt, welcher Datensatz gezählt wird; hier steht die markierte Stelle <code>papier</code>.</p>
      <Frage>Wo stehen die Anzahlen?</Frage>
      <p>Oben bei „Observations“ steht, wie viele Fälle der gezählte Datensatz hat, hier also die Zahl der Papierbögen aus Aufgabe 1. Unter „Missing values“ steht jeder fehlende Wert als <code>Code = Wertelabel (n = …)</code>; die Zahl hinter „n =“ sagt, wie oft er vorkommt. Steht dort keine, kommt der Code in dieser Auswahl nicht vor (wie −8 bei <code>st01</code>).</p>
      <InShort>Fehlende Werte haben Gründe: nicht geantwortet, nicht gewusst, nicht gefragt oder nicht lesbar. Der Code hält den Grund fest, damit du später entscheiden kannst, wen du weglässt und was das bedeutet.</InShort>
      <MoreDetail summary="Was R aus den Codes macht">
        <ul>
          <li>Beim Einlesen mit <code>read_spss()</code> werden alle Codes, die im Codebuch als fehlend markiert sind, zu <code>NA</code>, „not available“. Im ALLBUS sind das die negativen Codes unter „Missing values“. So rechnet R nie aus Versehen mit −9, als wäre es eine Antwort.</li>
          <li>Den Grund merkt sich R trotzdem im Hintergrund. Darum zeigt das Codebuch die fehlenden Werte mit Grund und Anzahl.</li>
          <li>Wie viele gültige und fehlende Werte eine Variable hat, zeigt <code>frequency()</code> (kennst du aus Sitzung 1: Zeilen „Total valid“ und „Total missing“). In Sitzung 3 entscheidest du, auf welche Basis sich Prozente beziehen; ab Sitzung 4 lässt du fehlende Werte für eine Grafik ausdrücklich weg.</li>
        </ul>
      </MoreDetail>
      <Mixup>Leere Zelle und fehlender Wert mit Grund. Lässt man beim Kodieren eine Zelle leer, wird sie in R zu einem <code>NA</code> ohne Grund. Niemand weiß dann mehr, ob die Person nicht geantwortet hat oder nicht gefragt wurde.</Mixup>
    </Card>

    <Card id="k3-vergleich" title="Papierbögen oder alle: eine Stelle tauschen" badge={<Bezug href="#a3-2">zu Schritt 3</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">In Schritt 3 tauschst du in deinem Block aus Schritt 2 nur die markierte Stelle: <code>allbus</code> statt <code>papier</code>. Damit zählt das Codebuch alle Befragten; oben steht dann „Observations: 5246“.</p>
      <Frage>Was verrät der Vergleich der beiden Zahlen?</Frage>
      <p>Die Papierbögen sind ein Teil von allen Befragten. Jede Zelle, die bei <code>papier</code> gezählt wird, zählt bei <code>allbus</code> mit. Der Unterschied zwischen beiden Zahlen sind also genau die Fälle aus Interview und online. Ist er groß, kommt der Code dort oft vor; ist er klein, selten.</p>
      <Frage>Und die Zeile mit <code>papier &lt;-</code>?</Frage>
      <p>Sie bleibt stehen und schadet nicht: <code>papier</code> wird angelegt, aber gerade nicht benutzt. Führ trotzdem immer den ganzen Block aus. Läuft nur die Zeile mit <code>codebook(papier, …)</code>, ohne dass <code>papier</code> vorher angelegt wurde, meldet R „object 'papier' not found“.</p>
      <Mixup>Dieselbe Zahl in der Ausgabe heißt nicht dasselbe. „n = …“ unter <code>papier</code> zählt nur Papierbögen, unter <code>allbus</code> alle. Schau immer zuerst oben nach „Observations“, bevor du eine Zahl abschreibst.</Mixup>
    </Card>

    <Card id="k3-split" title="Nicht gefragt ist nicht verweigert" badge={<Bezug href="#a3-3">zu Schritt 4</Bezug>} tag={{ kind: 'interpret', label: 'Hintergrund' }}>
      <p className="lead">Online und auf Papier gab es zwei Fragebogenversionen, A und B; manche Fragen standen nur in einer davon. Wer eine Frage gar nicht bekommen hat, bekommt den Code −11 TNZ: SPLIT. <Begriff id="tnz">TNZ</Begriff> heißt „trifft nicht zu“ (kennst du aus Sitzung 1).</p>
      <Frage>Warum nicht einfach −9 KEINE ANGABE?</Frage>
      <p>Weil −9 heißt: gefragt, aber nicht geantwortet. Wer die Frage nicht auf seinem Fragebogen hatte, wurde nicht gefragt und kann sie auch nicht verweigert haben. Steht eine Frage nicht auf dem Fragebogen und jemand trägt −9 ein, ist das ein Fehler gegen das Codebuch. Bei der Demokratiezufriedenheit <code>ps03</code> haben zum Beispiel 1.596 Befragte die Frage nicht bekommen, alle mit Version B.</p>
      <Frage>Und −10 TNZ: FILTER?</Frage>
      <p>Auch das heißt „nicht gefragt“, aber aus einem anderen Grund: Eine Frage davor hat die Person ausgeschlossen. Arbeitsstunden etwa werden nur erfragt, wenn eine Frage davor das vorsieht. Für eine Auswertung heißt das: Die Arbeitsstunden beschreiben nur die Befragten, die danach gefragt wurden.</p>
      <Frage>Warum zählst du in Schritt 4 zwei Zahlen zusammen?</Frage>
      <p>Weil du so prüfst, ob sich die beiden Gruppen überschneiden: Fehlen dieselben Personen bei beiden Fragen, oder fehlt jede nur bei einer? Das Bild in Schritt 4 zeigt, welche Frage in welcher Version fehlt. Die Summe vergleichst du mit der Zahl der Papierbögen aus Aufgabe 1.</p>
      <InShort><b>TNZ</b> (trifft nicht zu) heißt: nicht gefragt. Bei <b>SPLIT</b> stand die Frage nur in der anderen Fragebogenversion, bei <b>FILTER</b> hat eine Frage davor die Person ausgeschlossen.</InShort>
      <Mixup>„Fehlt“ und „verweigert“. Ein fehlender Wert sagt erst mit seinem Grund, was passiert ist. Wer alle fehlenden Werte als Verweigerung liest, sieht Menschen schweigen, die nie gefragt wurden.</Mixup>
    </Card>

    <Card id="k3-ergebnis" title="Ergebnis festhalten: wo du was abliest" badge={<Bezug href="#a3-4">zu Schritt 5</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">In Schritt 5 brauchst du Zahlen aus zwei Ausgaben. Schau bei jeder zuerst oben nach „Observations“: Zählt das Codebuch gerade die Papierbögen oder alle?</p>
      <ul>
        <li><b>−42 bei <code>pa01</code>, Papier:</b> Ausgabe mit <code>papier</code>, Variable <code>pa01</code>, Zeile −42, hinter „n =“ (<a href="#k3-gruende">Die Gründe im Codebuch</a>).</li>
        <li><b>−42 bei <code>pa01</code>, alle:</b> dieselbe Zeile in der Ausgabe mit <code>allbus</code> aus Schritt 3.</li>
        <li><b>Wo Mehrfachnennungen vorkommen:</b> Vergleiche die beiden Zahlen (<a href="#k3-vergleich">Papierbögen oder alle</a>).</li>
        <li><b>−11 bei <code>st01</code> und bei <code>pt03</code>:</b> wieder die Ausgabe mit <code>papier</code>, Zeile −11 bei der jeweiligen Variable.</li>
        <li><b>Was die Summe heißt:</b> <a href="#k3-split">Nicht gefragt ist nicht verweigert</a>.</li>
      </ul>
    </Card>

    <Card id="k3-konvention" title="Fehler oder Konvention?" badge={<Badge>Hintergrund, fürs Plenum</Badge>} tag={{ kind: 'interpret', label: 'Hintergrund' }}>
      <p className="lead">Beim Kodieren gibt es zwei Arten von Abweichungen. Bei manchen sagt das Codebuch genau, was einzutragen ist. Wer etwas anderes einträgt, macht einen <b>Fehler</b>. Bei anderen entscheidet das Codebuch nichts, etwa bei einem Kreuz genau auf der Linie oder einer Randnotiz. Dann muss jemand eine Regel festlegen und aufschreiben: eine <b>Konvention</b>. Oft gibt es nicht die eine richtige Regel, wohl aber eine gut begründete.</p>
      <Frage>Die Linke steht auf dem Fragebogen an fünfter Stelle; jemand trägt bei <code>pv01</code> die 5 ein. Fehler oder Konvention?</Frage>
      <p>Fehler: Das Codebuch sagt eindeutig 6 = DIE LINKE.</p>
      <Frage>Bei der Lebenszufriedenheit sitzt das Kreuz genau auf der Linie zwischen 7 und 8.</Frage>
      <p>Konvention: Das Codebuch kennt kein Kreuz auf der Linie. Jemand muss eine Regel festlegen, etwa „zählt als −42“ oder „zählt als das Kästchen, in dem der größere Teil des Kreuzes liegt“, und sie für alle Fragebögen gleich anwenden.</p>
      <Frage>Eine Frage steht nicht auf dem Fragebogen; jemand trägt −9 KEINE ANGABE ein.</Frage>
      <p>Fehler: Die Person wurde nicht gefragt. Dafür gibt es −11 TNZ: SPLIT.</p>
      <p>Die Frage im Plenum, ob man bei zwei Kreuzen besser eines genommen hätte, ist genau so eine Entscheidung: Der ALLBUS hat sich für −42 entschieden und rät nicht, welches Kreuz gemeint war.</p>
      <InShort>Jede Zelle im Datensatz ist eine kleine Entscheidung. Wo das Codebuch sie trifft, gibt es eine richtige Zahl. Wo nicht, braucht es eine dokumentierte Regel, sonst bedeutet derselbe Code nicht mehr dasselbe.</InShort>
    </Card>
  </Abschnitt>;
}

/* ---------- Aufgabe 4 ---------- */
export function Verstehen4() {
  return <Abschnitt id="g4" n={4} titel="Drei Datentypen in einem Datensatz" frage="Welche Zahlen im ALLBUS sind Antworten, welche nur Namen?"
    ziel="den Datentyp einer Variable in der Ausgabe von R abgelesen und kannst begründen, warum man mit einer Kennnummer nicht rechnet, obwohl sie eine Zahl ist."
    weg={[
      ['Schritt 1', '#a4-p', 'Erst festlegen: Darf man mit einer Kennnummer rechnen?', 'k4-bedeutung'],
      ['Schritt 2', '#a4-1', 'die Typen in der Ausgabe ablesen', 'k4-typen'],
      ['Schritt 3', '#a4-2', 'Ergebnis festhalten: Typen, eine Zelle, Rechnen, Umwandeln', 'k4-ergebnis'],
    ]}>

    <Card id="k4-bedeutung" title="Typ und Bedeutung" badge={<Bezug href="#a4-p">zu Schritt 1</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">Deine Festlegung in Schritt 1 fragt, ob man mit einer Kennnummer rechnen darf. Dahinter steckt eine allgemeine Frage: Reicht es, dass etwas eine Zahl ist?</p>
      <Frage>Darf man mit jeder Zahl rechnen?</Frage>
      <p>Nein. Der <Begriff id="datentyp">Datentyp</Begriff> <code>&lt;dbl&gt;</code> sagt nur, dass Zahlen in der Spalte stehen. Ob man mit ihnen rechnen darf, hängt davon ab, was sie messen. Auch eine Postleitzahl ist eine Zahl, aber ein Name für einen Ort. Bei der Wahlabsicht hast du dasselbe gesehen: Die Codes sind Namen wie Rückennummern, und ihr <Begriff id="mittelwert">Mittelwert</Begriff> sagt nichts (<a href="#k2-namen">Codes sind Namen</a>).</p>
      <Frage>Woran erkennst du, was eine Zahl misst?</Frage>
      <p>Am Codebuch, nicht an der Zahl selbst. Jahre messen eine Menge: Ein Jahr mehr ist überall gleich viel. Ein Code mit Wertelabel steht für eine Antwort. Ob man rechnen darf, entscheidet also, was hinter der Zahl steckt, nicht ihr Typ.</p>
      <InShort><b>Typ und Bedeutung</b> sind zweierlei. Der Typ sagt, was in einer Variable steht: Zahl, Text oder Zahl mit Wertelabel. Was eine Zahl bedeutet, sagt das Codebuch. Kurz gesagt: Dass eine Variable aus Zahlen besteht, heißt nicht, dass du mit ihr rechnen darfst.</InShort>
    </Card>

    <Card id="k4-typen" title="Datentypen, im Bild als Farben" badge={<Bezug href="#a4-1">zu Schritt 2</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">In R hat jede Variable einen <b>Datentyp</b>. Er sagt, welche Art von Werten darin steht. Im Bild zeigt das die Farbe der Steine, in der Ausgabe von R steht er in spitzen Klammern unter dem Variablennamen. Drei Typen begegnen dir im ALLBUS:</p>
      <Typen />
      <p>Im ALLBUS sind 576 der 579 Variablen Zahlen mit Wertelabels. In der Ausgabe von R siehst du sie als Code mit dem Wertelabel in eckigen Klammern, etwa <code>2 [NEUE BUNDESLAENDER]</code>; lange Wörter kürzt R mit „…“. Nur zwei Variablen sind Text, und eine einzige ist eine Zahl ganz ohne Wertelabel.</p>
      <Frage>Was zeigt die Vorlage in Schritt 2?</Frage>
      <Code k="a4" />
      <p>Sie behält die Papierbögen wie in Aufgabe 3 und zeigt den neuen Datensatz an. Wie die Ausgabe aufgebaut ist, kennst du aus Aufgabe 1 (<a href="#k1-ausgabe">Die Ausgabe lesen</a>). Diesmal schaust du auf die zweite Zeile unter der Größe: Unter jedem Namen steht der Typ, in derselben Reihenfolge wie die Namen. Ist das Fenster schmal, kürzt R auch die Typen: <code>&lt;dbl+l&gt;</code> heißt <code>&lt;dbl+lbl&gt;</code>.</p>
      <InShort>Der <b>Datentyp</b> sagt, was in einer Variable steckt: Zahlen (<code>&lt;dbl&gt;</code>), Text (<code>&lt;chr&gt;</code>) oder Zahlen mit Wertelabels (<code>&lt;dbl+lbl&gt;</code>). R zeigt ihn in spitzen Klammern bei jeder Variable.</InShort>
      <MoreDetail summary="Woher kommt <dbl+lbl>?">
        <ul>
          <li><code>dbl</code> steht für double, eine Zahl. <code>lbl</code> steht für labelled: An der Zahl klebt ihr Wertelabel. So reist das Codebuch mit den Daten mit.</li>
          <li>Dieser Typ entsteht beim Einlesen einer SPSS-Datei mit <code>read_spss()</code>. SPSS speichert Zahlen und Wertelabels getrennt, R klebt sie zusammen.</li>
          <li>Im Codebuch, wie R es als Text ausgibt, heißt derselbe Typ <code>haven_labelled&lt;double&gt;</code>, im Viewer <code>lbl+dbl</code>. Gemeint ist immer: Zahl mit Wertelabel.</li>
          <li>Mehr im R-Workshop, Abschnitt 4 „Datentypen verstehen mit class()“.</li>
        </ul>
      </MoreDetail>
    </Card>

    <Card id="k4-umwandeln" title="Umwandeln: Wertelabel zum Wert machen oder entfernen" badge={<><Bezug href="#a4-2">zu Schritt 3</Bezug> <Badge>Vorgriff auf Sitzung 4</Badge></>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Manchmal braucht man statt der Zahl das Wort, etwa damit auf einer Grafik „FRAU“ statt 2 steht. Manchmal braucht man nur die Zahl. Man kann eine Variable deshalb umwandeln. Der Fachbegriff ist <b>Datentypen umwandeln</b> (Konvertierung). Schalte zwischen den drei Zuständen um.</p>
      <Convert />
      <Frage>Was geht verloren, wenn das Wertelabel zum Wert wird?</Frage>
      <p>Der Grund, warum ein Wert fehlt, und die Codes. Im Zustand „Wertelabel wird zum Wert“ stehen nur noch Wörter in der Variable. Der fehlende Wert ist nur noch <code>NA</code>: Sein Wertelabel KEINE ANGABE ist verloren. Im Bild fällt der Aufkleber ab. Für eine Grafik ist das in Ordnung. Willst du wissen, warum Werte fehlen, schau vorher ins Codebuch.</p>
      <InShort>Umwandeln ändert den Datentyp. Wird das Wertelabel zum Wert, stehen Wörter in der Variable, ein <Begriff id="faktor">Faktor</Begriff>; entfernt man es, bleiben Zahlen ohne Bedeutung. Jeder Weg lässt etwas weg.</InShort>
      <Mixup>Umwandeln und Umkodieren. Umwandeln ändert nur die Form (Zahl oder Wort), nicht die Antworten. Antworten zusammenfassen oder umdrehen heißt Umkodieren; das kommt in Sitzung 5.</Mixup>
    </Card>

    <Card id="k4-ergebnis" title="Ergebnis festhalten: wo du was abliest" badge={<Bezug href="#a4-2">zu Schritt 3</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">In Schritt 3 hältst du fünf Dinge fest. Die ersten drei liest du in der Ausgabe aus Schritt 2 ab, die letzten zwei begründest du.</p>
      <ul>
        <li><b>Typ von <code>respid</code> und <code>doi</code>:</b> die Zeile unter den Namen, in derselben Reihenfolge wie die Namen. <code>+lbl</code> heißt: mit Wertelabel (<a href="#k4-typen">Datentypen</a>).</li>
        <li><b>Was in der Spalte <code>mode</code> steht:</b> Vor der eckigen Klammer steht der Code, in der Klammer das Wertelabel.</li>
        <li><b>Ob ein Mittelwert von <code>respid</code> sinnvoll ist:</b> <a href="#k4-bedeutung">Typ und Bedeutung</a>.</li>
        <li><b>Was nach dem Umwandeln in jeder Zelle stünde:</b> der Zustand „Wertelabel wird zum Wert“ in <a href="#k4-umwandeln">Umwandeln</a>.</li>
      </ul>
    </Card>
  </Abschnitt>;
}

/* ---------- Überblick ---------- */
/** Die Zellen aus CELLS, aber ohne respid (sie würde die Deutungsfrage aus Aufgabe 4 beantworten); dafür eine Stufe von pa02a. */
const ZELLEN = [
  ...CELLS.filter(c => c.variable !== 'respid'),
  { id: 'u_pa02a', variable: 'pa02a', value: '1', answer: 0, why: '1 heißt SEHR STARK, die oberste Ausprägung des politischen Interesses. In welche Richtung die Skala läuft, sagt das Wertelabel.' },
];
const VORHER: [string, string, string][] = [
  ['Was bedeutet der Code?', 'Codebuch, Value labels', 'Höher heißt nicht immer mehr (pa02a).'],
  ['Misst die Zahl etwas, oder benennt sie nur?', 'Codebuch, Variablenlabel und Wertelabels', 'Mit Namen (pv01) rechnet man nicht.'],
  ['Welche Codes sind fehlende Werte, und warum fehlen sie?', 'Codebuch, Missing values', 'Nicht gefragt (−10, −11) ist etwas anderes als nicht geantwortet (−9).'],
  ['Wer ist in meiner Auswahl?', 'erste Zeile der Ausgabe nach filter()', 'Eine Auswahl ändert, über wen du sprichst.'],
];

export function Ueberblick() {
  return <section className="grund-block" id="g5" aria-labelledby="g5-h">
    <div className="g-kopf">
      <span className="st m c7" aria-hidden="true">✓</span>
      <div><div className="ueber">Überblick über alle Aufgaben</div><h4 id="g5-h">Vom Kreuz zur Zelle</h4></div>
    </div>
    <p className="g-intro">Alle vier Aufgaben zusammen: wie eine Zeile entsteht, was in einer Zelle stehen kann und was du vor dem Rechnen prüfst.</p>
    <HeadingLevel.Provider value={5}>
      <Card id="k5-ablauf" title="Vom Kreuz zur Zelle" badge={<Badge>Aufgabe 1 bis 3</Badge>} tag={{ kind: 'picture', label: 'Im Bild' }}>
        <AblaufErklaert />
        <p>Jede Station ist eine Entscheidung: Die befragte Person setzt ihr Kreuz, das Codebuch legt den Code fest, wer abtippt, wendet bei unklaren Kreuzen eine aufgeschriebene Regel an, und fehlt eine Antwort, kommt ein Code mit Grund in die Zelle.</p>
      </Card>

      <Card id="k5-zellen" title="Was in einer Zelle stehen kann" badge={<Badge>Aufgabe 2 bis 4</Badge>} tag={{ kind: 'interpret', label: 'Hintergrund' }}>
        <p className="lead">Eine Zahl in einer Zelle kann Verschiedenes sein. Sechs Zellen als Beispiel; die Zahlen sind ausgedacht.</p>
        <table className="daten voll">
          <caption>Sechs Zellen und ihre Art</caption>
          <thead><tr><th scope="col">Zelle</th><th scope="col">Art</th><th scope="col">Warum</th></tr></thead>
          <tbody>{ZELLEN.map(c => <tr key={c.id}><td><code>{`${c.variable} = ${c.value}`}</code></td><td>{CELL_KINDS[c.answer]}</td><td>{c.why}</td></tr>)}</tbody>
        </table>
        <InShort>Eine Zeile enthält Antworten als Codes, manchmal Zahlen, die etwas messen, fehlende Werte mit Grund und eine Kennnummer. Welche Art eine Zahl ist, verrät das Codebuch, nicht die Zahl selbst.</InShort>
      </Card>

      <Card id="k5-pruefen" title="Bevor du rechnest" badge={<Badge>alle Aufgaben</Badge>} tag={{ kind: 'interpret', label: 'Hintergrund' }}>
        <table className="daten voll">
          <caption>Bevor du rechnest: Fragen an jede Zahl</caption>
          <thead><tr><th scope="col">Frage</th><th scope="col">Wo nachsehen</th><th scope="col">Warum</th></tr></thead>
          <tbody>{VORHER.map(([q, wo, warum]) => <tr key={q}><td>{q}</td><td>{wo}</td><td>{warum}</td></tr>)}</tbody>
        </table>
        <p className="box-notiz">Für alle gilt: Erst nachschlagen, dann deuten. Aussagen über ganz Deutschland brauchen außerdem eine Gewichtung (Sitzung 6).</p>
        <Mixup>„Die Daten sind gegeben.“ Jede Zelle ist eine kleine Entscheidung: vom Fragebogen über das Kreuz bis zur Regel beim Abtippen.</Mixup>
      </Card>
    </HeadingLevel.Provider>
  </section>;
}

/* ---------- Themen für den Reiter „Verstehen“ (Reihenfolge, Karten für die rechte Leiste) ---------- */
export const THEMEN: Thema[] = [
  { id: 'vorweg', n: 'R', kurz: 'R lesen', titel: 'Vorweg: R lesen', minuten: 10, Inhalt: Vorweg,
    karten: [['r1', 'Startblock und Objekt'], ['r2', 'Die Pipe mit einem Schritt'], ['r3', 'Nachschlagen mit codebook()']] },
  { id: 'g1', n: '1', kurz: 'Aufgabe 1', titel: 'Wer hat auf Papier geantwortet?', minuten: 15, Inhalt: Verstehen1, aufgabe: 1,
    karten: [['k1-wege', 'Drei Erhebungswege'], ['k1-matrix', 'Vom Fragebogen zur Zeile'], ['k1-ausgabe', 'Die Ausgabe lesen'], ['k1-nachschlagen', 'Nachschlagen'], ['k1-filter', 'Nur bestimmte Fälle: filter()'], ['k1-ergebnis', 'Ergebnis festhalten']] },
  { id: 'g2', n: '2', kurz: 'Aufgabe 2', titel: 'Ein Fragebogen wird zur Zeile', minuten: 15, Inhalt: Verstehen2, aufgabe: 2,
    karten: [['k2-richtung', '1 oder 5?'], ['k2-beschriftungen', 'Drei Beschriftungen'], ['k2-eintrag', 'Einen Eintrag lesen'], ['k2-zuordnen', 'Vom Wort zum Code'], ['k2-namen', 'Codes sind Namen'], ['k2-ergebnis', 'Ergebnis festhalten']] },
  { id: 'g3', n: '3', kurz: 'Aufgabe 3', titel: 'Was nur auf Papier passiert', minuten: 15, Inhalt: Verstehen3, aufgabe: 3,
    karten: [['k3-boegen', 'Was trägst du ein?'], ['k3-gruende', 'Die Gründe im Codebuch'], ['k3-vergleich', 'Papierbögen oder alle'], ['k3-split', 'Nicht gefragt ist nicht verweigert'], ['k3-ergebnis', 'Ergebnis festhalten'], ['k3-konvention', 'Fehler oder Konvention?']] },
  { id: 'g4', n: '4', kurz: 'Aufgabe 4', titel: 'Drei Datentypen in einem Datensatz', minuten: 10, Inhalt: Verstehen4, aufgabe: 4,
    karten: [['k4-bedeutung', 'Typ und Bedeutung'], ['k4-typen', 'Datentypen'], ['k4-umwandeln', 'Umwandeln'], ['k4-ergebnis', 'Ergebnis festhalten']] },
  { id: 'g5', n: '✓', kurz: 'Überblick', titel: 'Vom Kreuz zur Zelle', minuten: 5, Inhalt: Ueberblick,
    karten: [['k5-ablauf', 'Vom Kreuz zur Zelle'], ['k5-zellen', 'Was in einer Zelle stehen kann'], ['k5-pruefen', 'Bevor du rechnest']] },
];

/* Bilder für die ausgebauten „?“-Fenster in den Aufgaben (Engine: denk(…, { bild: Name })). Nur Bilder, die schon in Verstehen stehen. */
const Pv01Codes = () => <Pv01 codes={PV01.codes} />;
export const BILDER = { SheetsToPlate, DreiBeschriftungen, Pa02a, Pv01Codes, Typen };
