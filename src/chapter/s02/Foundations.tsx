// Sitzung 2 „Vom Fragebogen zum Datensatz“: die vier Grundlagen und der Überblick nach Plan sitzung02.md (Abschnitte 3 bis 7).
import { useChapterState } from '../ChapterContext';
import { Badge, Card, InShort, Known, Mixup, MoreDetail } from '../blocks/Card';
import { Foundation } from '../blocks/Foundation';
import { MapLink } from '../blocks/MapLink';
import { ChoiceCheck } from '../s04/figures/ChoiceCheck';
import { CONVENTION, G1_TURM, G1_TURM_WRONG, G2_EINS, G2_MITTEL, G4_VERLUST, PV01, SHEET_QUESTIONS, SHEETS } from './content';
import { CellAssign, Convert, Flow, SheetsToPlate } from './figures/Interactive';
import { DreiBeschriftungen, Luecken, Pa02a, Pv01, SmallSheet, Typen } from './figures/Pictures';

/** Grundlage 1: Die Datenmatrix (1a Vom Bogen zur Zeile, 1b Die ALLBUS-Bauplatte). */
export function Foundation1() {
  return <Foundation id="g1" n={1} title="Die Datenmatrix: Fall, Variable, Wert" taskHref="#a1"
    intro="Was steht in einem Datensatz, und wie hängt er mit dem Fragebogen zusammen? Zwei kurze Schritte, etwa 10 Minuten.">

    <Card id="g1a" step="1a" title="Vom Bogen zur Zeile" badge={<Badge>Datenmatrix: kennst du aus Methoden Ia</Badge>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Drei Menschen haben einen Fragebogen ausgefüllt. Aus jedem Bogen wird eine <b>Zeile</b> im Datensatz, aus jeder Frage eine <b>Spalte</b>. Tipp auf einen Stein, um zu sehen, was er ist.</p>
      <SheetsToPlate />
      <InShort>Ein Datensatz ist eine <b>Datenmatrix</b>: Jede Zeile ist ein <b>Fall</b> (im ALLBUS eine befragte Person), jede Spalte eine <b>Variable</b> (meist eine Frage), jede Zelle ein <b>Wert</b>. Im Bild: Reihe, Turm, Stein. Die ganze Bauplatte ist der Datensatz.</InShort>
      <MoreDetail summary="Fall, Variable, Wert, Datenreihe">
        <ul>
          <li>Ein <b>Fall</b> ist die Einheit, über die du etwas weißt, im ALLBUS eine befragte Person. Ein anderes Wort dafür ist Merkmalsträger.</li>
          <li>Eine <b>Variable</b> ist ein Merkmal, das von Fall zu Fall verschieden sein kann, meist eine Frage aus dem Fragebogen. Sie hat einen kurzen Namen wie <code>ls01</code>.</li>
          <li>Ein <b>Wert</b> ist, was ein Fall bei einer Variable hat, also eine Antwort. Die möglichen Antworten einer Variable heißen <b>Ausprägungen</b>.</li>
          <li>Liest du einen Turm von oben nach unten, hast du die <b>Datenreihe</b> dieser Variable: einen Wert je Person, in der Reihenfolge der Personen. Mit ihr beginnt jede Rechnung.</li>
          <li>Die Steine haben Farben: Blau heißt Zahl. Mehr zu den Farben in <a href="#g4">Grundlage 4</a>.</li>
        </ul>
      </MoreDetail>
      <Mixup>Variable und Wert. „Lebenszufriedenheit“ ist die Variable, der ganze Turm. „8“ ist ein Wert, ein einzelner Stein. Und eine Zeile ist eine Person, nicht eine Frage.</Mixup>
      <MapLink concept="series">„Datenreihe“</MapLink>
    </Card>

    <Card id="g1b" step="1b" title="Die ALLBUS-Bauplatte" badge={<Known session={1} />} tag={{ kind: 'estimate', label: 'Kurz überlegen' }}>
      <p className="lead">Der ALLBUS 2023 ist dieselbe Datenmatrix, nur größer: <b>5.246 Reihen</b>, eine für jede befragte Person, und <b>579 Türme</b>, einer für jede Variable. Die Zahlen kennst du aus Sitzung 1, ebenso die 3.037.434 Zellen, die du dort ausgerechnet hast. R zeigt die Größe als <code>5,246 × 579</code> (R schreibt Tausender mit Komma: 5,246 heißt 5.246).</p>
      <ChoiceCheck question={G1_TURM} wrong={G1_TURM_WRONG} />
      <InShort>Der ALLBUS 2023 hat 5.246 Fälle und 579 Variablen. Ein Datensatz ist rechteckig: Jeder Fall hat in jeder Variable genau einen Wert, notfalls einen fehlenden.</InShort>
    </Card>
  </Foundation>;
}

/** Grundlage 2: Codes und Labels (2a 1 oder 5?, 2b drei Beschriftungen, 2c Codes sind Namen). */
export function Foundation2() {
  return <Foundation id="g2" n={2} title="Codes und Labels" taskHref="#a2"
    intro="Wie wird aus einem Kreuz eine Zahl, und woher weißt du, was die Zahl bedeutet? Drei kurze Schritte, etwa 15 Minuten.">

    <Card id="g2a" step="2a" title="1 oder 5?" tag={{ kind: 'estimate', label: 'Schätzen' }}>
      <p className="lead">Im ALLBUS steht die Frage: <em>„Wie stark interessieren Sie sich für Politik?“</em> Angekreuzt wird eines von fünf Kästchen: sehr stark, stark, mittel, wenig, überhaupt nicht. Im Datensatz steht aber kein Wort, sondern eine Zahl. Welche Zahl bekommt „sehr stark“?</p>
      <ChoiceCheck question={G2_EINS} wrong={{ '5': G2_EINS.hint }}
        after={<Pa02a caption={<>Die Wertelabels kleben als gelbe Aufkleber an den Steinen. Unter „fehlende Werte“ stehen leere Steine mit ihrem Grund. <span>Codes, Wertelabels und Anzahlen aus dem ALLBUS 2023.</span></>} />} />
      <InShort>Im Datensatz steht für eine Antwort ein <b>Code</b>, eine Zahl. Was sie bedeutet, sagt das <b>Wertelabel</b>. Welcher Code zu welchem Wort gehört, steht im <b>Codebuch</b>. Raten hilft nicht: Die Richtung einer Skala legt der Fragebogen fest.</InShort>
      <Mixup>Höher heißt nicht mehr. Bei <code>pa02a</code> heißt die höchste Zahl am wenigsten Interesse. Schau vor jeder Deutung ins Codebuch, in welche Richtung eine Skala läuft.</Mixup>
    </Card>

    <Card id="g2b" step="2b" title="Drei Beschriftungen" badge={<Known session={1} what="Variablenlabel und Wertelabel" />} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Jede Variable trägt drei Beschriftungen. Der <b>Variablenname</b> ist kurz und für R gemacht: <code>pa02a</code>. Das <b>Variablenlabel</b> sagt in Worten, was gefragt wurde: POLITISCHES INTERESSE, BEFR. (ORDINAL). Die <b>Wertelabels</b> sagen, was jeder Code bedeutet. Im Bild kleben sie als gelbe Aufkleber an den Steinen.</p>
      <DreiBeschriftungen />
      <p>Nicht jeder Code hat ein Wort. Bei der Lebenszufriedenheit <code>ls01</code> haben nur die Enden ein Wertelabel: 0 GANZ UNZUFRIEDEN und 10 GANZ ZUFRIEDEN. Dazwischen steht im Codebuch nur „..“: Die Zahlen 1 bis 9 sprechen für sich. Und manche Variablen haben für ihre gültigen Werte gar keine Wertelabels; dort ist die Zahl selbst die Antwort.</p>
      <InShort>Variablenname (kurz, für R), Variablenlabel (was gefragt wurde) und Wertelabels (was ein Code bedeutet) stehen zusammen im Codebuch.</InShort>
      <MoreDetail summary="Wie liest du einen Eintrag in der Werkstatt?">
        <p>Beispiel, wörtlich aus R (Werkstatt-Fassung):</p>
        <pre className="code" tabIndex={0} aria-label="Codebuch-Eintrag von pa02a in der Werkstatt">{`[239] pa02a (haven_labelled<double>)
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
      -9 = KEINE ANGABE (n = 17)`}</pre>
        <ul>
          <li><code>[239]</code> ist die Position im Datensatz: pa02a ist der 239. Turm.</li>
          <li>In Klammern steht der Typ: eine Zahl mit Wertelabels (<a href="#g4">Grundlage 4</a>).</li>
          <li>Umlaute schreibt der ALLBUS als ae, oe, ue: UEBERHAUPT. Bei der Suche mit <code>find_var()</code> hilft das (kennst du aus Sitzung 1).</li>
          <li>Wer selbst einen Datensatz eingibt, vergibt diese Beschriftungen selbst. Wie das in R geht, zeigt der R-Workshop in Kapitel 4 („Variablen- und Wertelabels lesen und setzen“); im Seminar war es nicht dran.</li>
        </ul>
      </MoreDetail>
      <Mixup>Variablenlabel und Wertelabel. Das Variablenlabel beschriftet den ganzen Turm („Politisches Interesse“), ein Wertelabel einen einzelnen Code („SEHR STARK“).</Mixup>
      <MapLink concept="labels">„Variablen- & Wertelabels“</MapLink>
      <MapLink concept="codebook">„Codebuch & Variablensuche“</MapLink>
    </Card>

    <Card id="g2c" step="2c" title="Codes sind Namen" tag={{ kind: 'estimate', label: 'Kurz überlegen' }}>
      <p className="lead">Bei der Wahlabsicht <code>pv01</code> („Wenn am nächsten Sonntag Bundestagswahl wäre …“) hat jede Partei einen Code. Sieh dir die Codes an:</p>
      <Pv01 codes={PV01.codes} />
      <p>Die AfD hat den Code 42, die Linke die 6, eine 5 gibt es nicht. Die Codes sind wie Rückennummern: Sie benennen, sie zählen nichts ab.</p>
      <ChoiceCheck question={G2_MITTEL} />
      <InShort>Codes für Kategorien sind Namen, keine Mengen. Ob du mit einer Zahl rechnen darfst, hängt davon ab, was sie misst; der Fachbegriff dafür ist <b>Skalenniveau</b> (Thema in Sitzung 3).</InShort>
      <MoreDetail summary="Warum 42?">
        <p>Welche Zahl eine Partei bekommt, legen die Macherinnen und Macher der Befragung fest; Lücken und große Zahlen sind dabei erlaubt. Wichtig ist nur: Gleicher Code heißt gleiche Antwort, und welche Antwort das ist, steht im Codebuch. Zählen darfst du die Codes: Im ALLBUS 2023 nennen 480 Befragte die AfD und 260 die Linke.</p>
      </MoreDetail>
      <Mixup>Platz auf dem Bogen und Code. Steht die Linke auf dem Papierbogen an fünfter Stelle, ist ihr Code trotzdem 6. Wer Listenplätze abzählt, statt im Codebuch nachzusehen, erfasst falsch.</Mixup>
    </Card>
  </Foundation>;
}

const MISSING_TABLE: [string, string, string, string][] = [
  ['−6', 'KENNE ICH NICHT', 'die Person kennt das Gefragte nicht', 'Astrologie und Horoskope (rh08b): 178-mal'],
  ['−8', 'WEISS NICHT', 'die Person weiß keine Antwort', 'Wahlabsicht (pv01): 603-mal'],
  ['−9', 'KEINE ANGABE', 'gefragt, aber nicht geantwortet', 'Lebenszufriedenheit (ls01): 81-mal'],
  ['−10', 'TNZ: FILTER', 'nicht gefragt, weil eine Frage davor sie ausgeschlossen hat', 'Arbeitsstunden (dw15): 2.263-mal'],
  ['−11', 'TNZ: SPLIT', 'nicht gefragt, weil die Frage nur in der anderen Fragebogenversion stand', 'Demokratiezufriedenheit (ps03): 1.596-mal'],
  ['−42', 'DATENFEHLER: MFN', 'mehrere Kreuze, keines lässt sich nehmen', 'Lebenszufriedenheit (ls01): 1-mal'],
];

/** Grundlage 3a: four sheets, each with „Kurz überlegen“; once all four are answered the gaps picture appears. */
function FourSheets() {
  const { state } = useChapterState();
  const all = SHEETS.every(s => (state.answers[s.id] ?? '') !== '');
  return <>
    <div className="s2-vier">
      {SHEETS.map((s, i) => <div key={s.id}>
        <SmallSheet letter={s.letter} crosses={s.letter === 'A' ? [0] : s.letter === 'C' ? [7, 8] : []} missing={s.letter === 'D'} alt={`Bogen ${s.letter}: ${s.picture}.`} />
        <ChoiceCheck question={SHEET_QUESTIONS[i]} />
      </div>)}
    </div>
    <p className="hilfe-zeile" aria-live="polite">{all ? 'Alle vier Bögen aufgelöst: Darunter steht jetzt das Bild der Türme.' : 'Wenn du alle vier Bögen aufgelöst hast, erscheint hier das Bild der Türme.'}</p>
    {all ? <Luecken /> : null}
  </>;
}

/** Grundlage 3: Fehlende Werte haben Gründe (3a Was trägst du ein?, 3b Gründe im Codebuch, 3c Fehler oder Konvention?). */
export function Foundation3() {
  return <Foundation id="g3" n={3} title="Fehlt ist nicht gleich fehlt" taskHref="#a3"
    intro="Was trägt man ein, wenn keine gültige Antwort da ist, und warum steht dort ein Grund? Drei kurze Schritte, etwa 15 Minuten.">
    <p className="g-intro"><Known session={1} what="fehlende Werte und TNZ" /> In Sitzung 1 hast du fehlende Werte in der Ausgabe von <code>frequency()</code> gelesen. Heute stehst du auf der anderen Seite: Du hältst einen Bogen in der Hand und entscheidest, was in die Zelle kommt.</p>

    <Card id="g3a" step="3a" title="Was trägst du ein?" tag={{ kind: 'estimate', label: 'Kurz überlegen' }}>
      <p className="lead">Nicht jeder Bogen ist sauber ausgefüllt. Vier Bögen, zum Beispiel. Entscheide für jeden, was im Datensatz stehen soll.</p>
      <FourSheets />
      <InShort>Ein <b>fehlender Wert</b> heißt: Für diese Person gibt es bei dieser Variable keine gültige Antwort. Der ALLBUS speichert dazu den Grund als negativen Code, etwa −9 KEINE ANGABE oder −11 TNZ: SPLIT. In R wird daraus ein <code>NA</code>, ein leerer Stein; den Grund merkt sich R als Aufkleber.</InShort>
      <Mixup>0 und fehlend. Eine 0 kann eine Antwort sein (ganz unzufrieden, 0 Kinder). „Keine Angabe“ dagegen ist −9 und wird nie mitgerechnet.</Mixup>
    </Card>

    <Card id="g3b" step="3b" title="Die Gründe im Codebuch" badge={<Known session={1} what="TNZ: SPLIT und TNZ: FILTER" />} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Im Codebuch stehen die fehlenden Werte jeder Variable unter „Missing values“, mit Grund und Anzahl. Im ALLBUS 2023 gibt es 17 verschiedene solche Codes. Die wichtigsten:</p>
      <table className="daten voll s2-gruende">
        <caption>Fehlende Werte im ALLBUS 2023, Beispiele</caption>
        <thead><tr><th scope="col">Code</th><th scope="col">Wertelabel</th><th scope="col">heißt</th><th scope="col">Beispiel im ALLBUS 2023</th></tr></thead>
        <tbody>{MISSING_TABLE.map(([code, label, means, ex]) => <tr key={code}><td>{code}</td><td>{label}</td><td><b>{means}</b></td><td>{ex}</td></tr>)}</tbody>
      </table>
      <p>TNZ heißt „trifft nicht zu“ (kennst du aus Sitzung 1): Wer nicht gefragt wurde, kann nicht geantwortet haben. Das ist etwas anderes als jemand, der die Antwort verweigert. Online und auf Papier gab es zwei Fragebogenversionen, A und B; manche Fragen standen nur in einer davon.</p>
      <InShort>Fehlende Werte haben Gründe: nicht geantwortet, nicht gewusst, nicht gefragt oder nicht lesbar. Der Code hält den Grund fest, damit du später entscheiden kannst, wen du weglässt und was das bedeutet.</InShort>
      <MoreDetail summary="Was R aus den Codes macht">
        <ul>
          <li>Beim Einlesen mit <code>read_spss()</code> werden alle Codes, die im Codebuch als fehlend markiert sind, zu <code>NA</code>, „not available“. Im ALLBUS sind das die negativen Codes unter „Missing values“. So rechnet R nie aus Versehen mit −9, als wäre es eine Antwort.</li>
          <li>Den Grund merkt sich R trotzdem im Hintergrund. Darum zeigt das Codebuch die fehlenden Werte mit Grund und Anzahl.</li>
          <li>Wie viele gültige und fehlende Werte eine Variable hat, zeigt <code>frequency()</code> (kennst du aus Sitzung 1: Zeilen „Total valid“ und „Total missing“). In Sitzung 3 entscheidest du, auf welche Basis sich Prozente beziehen; ab Sitzung 4 lässt du fehlende Werte für eine Grafik ausdrücklich weg.</li>
          <li>Bei −10 TNZ: FILTER: Arbeitsstunden werden nur erfragt, wenn eine Frage davor das vorsieht; wer dort herausfiel, bekommt −10. Für eine Auswertung heißt das: Die Arbeitsstunden beschreiben nur die Befragten, die danach gefragt wurden.</li>
        </ul>
      </MoreDetail>
      <Mixup>Leere Zelle und fehlender Wert mit Grund. Lässt man beim Erfassen eine Zelle leer, wird sie in R zu einem <code>NA</code> ohne Grund. Niemand weiß dann mehr, ob die Person nicht geantwortet hat oder nicht gefragt wurde.</Mixup>
      <MapLink concept="missing">„Fehlende Werte“</MapLink>
    </Card>

    <Card id="g3c" step="3c" title="Fehler oder Konvention?" tag={{ kind: 'estimate', label: 'Kurz überlegen' }}>
      <p className="lead">Beim Erfassen gibt es zwei Arten von Abweichungen. Bei manchen sagt das Codebuch genau, was einzutragen ist. Wer etwas anderes einträgt, macht einen <b>Fehler</b>. Bei anderen entscheidet das Codebuch nichts, etwa bei einem Kreuz genau auf der Linie oder einer Randnotiz. Dann muss jemand eine Regel festlegen und aufschreiben: eine <b>Konvention</b>. Oft gibt es nicht die eine richtige Regel, wohl aber eine gut begründete.</p>
      {CONVENTION.map(q => <ChoiceCheck key={q.id} question={q} />)}
      <InShort>Jede Zelle im Datensatz ist eine kleine Entscheidung. Wo das Codebuch sie trifft, gibt es eine richtige Zahl. Wo nicht, braucht es eine dokumentierte Regel, sonst bedeutet derselbe Code nicht mehr dasselbe.</InShort>
    </Card>
  </Foundation>;
}

/** Grundlage 4: Datentypen (4a Steine haben Farben, 4b Umwandeln). */
export function Foundation4() {
  return <Foundation id="g4" n={4} title="Datentypen" taskHref="#a4"
    intro="Was für Steine liegen auf der Bauplatte, und was passiert, wenn man sie umwandelt? Zwei kurze Schritte, etwa 10 Minuten.">

    <Card id="g4a" step="4a" title="Steine haben Farben" tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">In R hat jeder Turm einen <b>Datentyp</b>. Er sagt, was für Steine darin liegen. Im Bild zeigt das die Farbe, in der Ausgabe von R steht er in spitzen Klammern über dem Turm. Drei Typen begegnen dir im ALLBUS:</p>
      <Typen />
      <p>Im ALLBUS sind 576 der 579 Variablen Zahlen mit Wertelabels. In der Ausgabe von R siehst du sie als Code mit dem Wertelabel in eckigen Klammern, etwa <code>2 [NEUE BUNDESLAENDER]</code>; lange Wörter kürzt R mit „…“. Nur zwei Variablen sind Text und eine einzige ist eine Zahl ganz ohne Aufkleber.</p>
      <InShort>Der <b>Datentyp</b> sagt, was in einem Turm steckt: Zahlen (<code>&lt;dbl&gt;</code>), Text (<code>&lt;chr&gt;</code>) oder Zahlen mit Wertelabels (<code>&lt;dbl+lbl&gt;</code>). R zeigt ihn in spitzen Klammern über jedem Turm.</InShort>
      <MoreDetail summary="Woher kommt <dbl+lbl>?">
        <ul>
          <li><code>dbl</code> steht für double, eine Zahl. <code>lbl</code> steht für labelled: An der Zahl klebt ihr Wertelabel. So reist das Codebuch mit den Daten mit.</li>
          <li>Dieser Typ entsteht beim Einlesen einer SPSS-Datei mit <code>read_spss()</code>. SPSS speichert Zahlen und Wertelabels getrennt, R klebt sie zusammen.</li>
          <li>Im Codebuch der Werkstatt heißt derselbe Typ <code>haven_labelled&lt;double&gt;</code>, im Viewer <code>lbl+dbl</code>. Gemeint ist immer: Zahl mit Wertelabel.</li>
          <li>Mehr im R-Workshop, Abschnitt 4 „Datentypen verstehen mit class()“.</li>
        </ul>
      </MoreDetail>
      <Mixup>Typ und Bedeutung. Dass ein Turm aus Zahlen besteht, heißt nicht, dass du mit ihm rechnen darfst. Auch eine Postleitzahl ist eine Zahl, aber ein Name für einen Ort.</Mixup>
    </Card>

    <Card id="g4b" step="4b" title="Umwandeln: Aufkleber zum Wert machen oder abziehen" badge={<Badge>Vorgriff auf Sitzung 4</Badge>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Manchmal braucht man statt der Zahl das Wort, etwa damit auf einer Grafik „FRAU“ statt 2 steht. Manchmal braucht man nur die Zahl. Man kann einen Turm deshalb umwandeln. Der Fachbegriff ist <b>Datentypen umwandeln</b> (Konvertierung). Probier beide Wege aus.</p>
      <Convert />
      <ChoiceCheck question={G4_VERLUST} />
      <InShort>Umwandeln ändert den Datentyp. Wird der Aufkleber zum Wert, stehen Wörter im Turm (Faktor); zieht man ihn ab, bleiben Zahlen ohne Bedeutung. Jeder Weg lässt etwas weg.</InShort>
      <Mixup>Umwandeln und Umkodieren. Umwandeln ändert nur die Form (Zahl oder Wort), nicht die Antworten. Antworten zusammenfassen oder umdrehen heißt Umkodieren; das kommt in Sitzung 5.</Mixup>
      <MapLink concept="conversion">„Datentypen umwandeln“</MapLink>
    </Card>
  </Foundation>;
}

const BEFORE: [string, string, string][] = [
  ['Was bedeutet der Code?', 'Codebuch, Value labels', 'Höher heißt nicht immer mehr (pa02a, ep03).'],
  ['Misst die Zahl etwas, oder benennt sie nur?', 'Codebuch, Variablenlabel und Wertelabels', 'Mit Namen (pv01, respid) rechnet man nicht.'],
  ['Welche Codes sind fehlende Werte, und warum fehlen sie?', 'Codebuch, Missing values', 'Nicht gefragt (−10, −11) ist etwas anderes als nicht geantwortet (−9).'],
  ['Wer ist in meiner Auswahl?', 'erste Zeile der Ausgabe nach filter()', 'Eine Auswahl ändert, über wen du sprichst (nur Papier: 1.656 von 5.246).'],
];

/** Überblick: Vom Kreuz zur Zelle (Ablauf, Zellen zuordnen, Bevor du rechnest). */
export function Overview() {
  return <Foundation id="g5" n="✓" title="Vom Kreuz zur Zelle" eyebrow="Überblick zu allen Aufgaben"
    intro="Alle vier Themen zusammen: wie eine Zeile entsteht und was du vor dem Rechnen prüfst.">
    <Card id="ue1" step="Ü1" title="Vom Kreuz zur Zelle" tag={{ kind: 'picture', label: 'Im Bild' }}>
      <Flow />
    </Card>
    <Card id="ue2" step="Ü2" title="Was steht in dieser Zelle?" tag={{ kind: 'estimate', label: 'Zuordnen' }}>
      <p className="lead">Sechs Zellen, zum Beispiel; die Zahlen sind ausgedacht. Ordne jede einer Art zu.</p>
      <CellAssign />
      <InShort>Eine Zeile enthält Antworten als Codes, manchmal Zahlen, die etwas messen, fehlende Werte mit Grund und eine Kennnummer. Welche Art eine Zahl ist, verrät das Codebuch, nicht die Zahl selbst.</InShort>
    </Card>
    <Card id="ue3" step="Ü3" title="Bevor du rechnest" tag={{ kind: 'interpret', label: 'Voraussetzungen' }}>
      <table className="daten voll">
        <caption>Bevor du rechnest: Fragen an jede Zahl</caption>
        <thead><tr><th scope="col">Frage</th><th scope="col">Wo nachsehen</th><th scope="col">Warum</th></tr></thead>
        <tbody>{BEFORE.map(([q, where, why]) => <tr key={q}><td>{q}</td><td>{where}</td><td>{why}</td></tr>)}</tbody>
      </table>
      <p className="box-notiz">Für alle gilt: Erst nachschlagen, dann deuten. Aussagen über ganz Deutschland brauchen außerdem eine Gewichtung (Sitzung 6).</p>
      <Mixup>„Die Daten sind gegeben.“ Jede Zelle ist eine kleine Entscheidung: vom Fragebogen über das Kreuz bis zur Regel beim Abtippen.</Mixup>
    </Card>
  </Foundation>;
}
