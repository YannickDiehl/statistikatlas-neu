// Kapitel 1 „Einstieg“, Reiter „Verstehen“ (Muster: kapitel/k04/KONZEPT.md): je Aufgabe erklären, was in jedem Schritt passiert und warum.
// Keine Übungen: Die fünf „Kurz überlegen“, der Meldungs-Sortierer und die Werkzeug-Zuordnung des Atlas stehen hier als rhetorische Fragen mit Antwort.
import { Card, InShort, Known, Mixup, MoreDetail, Badge } from '@atlas/chapter/blocks/Card';
import { HeadingLevel } from '@atlas/chapter/blocks/level';
import { withCode } from '@atlas/chapter/blocks/rich';
import { LineBlocks } from '@atlas/chapter/s01/ReadR';
import { ALT, CAUSES, EAST, ERROR_CASES, TNZ, TOOLS, TOOL_QUESTIONS } from '@atlas/chapter/s01/content';
import { RStudioPanes } from '@atlas/chapter/s01/figures/RStudioPanes';
import { SearchLab } from '@atlas/chapter/s01/figures/SearchLab';
import { FrequencyTable } from '@atlas/chapter/s01/figures/FrequencyTable';
import { ErrorConsole, FindVarPicture, ProjectPicture, RoutePicture } from '@atlas/chapter/s01/figures/Pictures';
import '@atlas/chapter/s01/s01.css';
import type { Thema } from '../../react/typen';
import { Abschnitt, Bezug, Code, Frage } from '../../react/gemeinsam';

const Ia = () => <Known label="kennst du aus Methoden Ia" />;

/** Tastenkürzel im Lernjournal (dieselben wie in RStudio). */
function Kuerzel() {
  return <ul className="wk-tasten s1-tasten">
    <li><kbd>Strg</kbd>/<kbd>Cmd</kbd> + <kbd>Enter</kbd>: ausführen</li>
    <li><kbd>Alt</kbd> + <kbd>−</kbd>: Pfeil <code>&lt;-</code></li>
    <li><kbd>Strg</kbd>/<kbd>Cmd</kbd> + <kbd>Umschalt</kbd> + <kbd>M</kbd>: Pipe <code>%&gt;%</code> (brauchst du ab Sitzung 2)</li>
    <li><kbd>Enter</kbd> nach <code>%&gt;%</code> oder <code>+</code> rückt ein</li>
    <li><kbd>Strg</kbd>/<kbd>Cmd</kbd> + <kbd>Umschalt</kbd> + <kbd>C</kbd>: Kommentar an oder aus</li>
  </ul>;
}

/* ---------- Vorweg ---------- */
export function Vorweg() {
  return <section className="grund-block" id="vorweg" aria-labelledby="vorweg-h">
    <div className="g-kopf">
      <span className="st m c7" aria-hidden="true">R</span>
      <div><div className="ueber">Vorweg, für alle Aufgaben</div><h4 id="vorweg-h">R lesen</h4></div>
    </div>
    <p className="g-intro">Alle vier Aufgaben arbeiten mit kurzen Zeilen R. Hier steht, wie du eine Zeile liest und wie du mit Vorlage, Lernjournal und Konsole arbeitest.</p>
    <HeadingLevel.Provider value={5}>
      <Card id="r1" stone="R" title="Eine Zeile R lesen: der Startblock" badge={<Badge>neu</Badge>} tag={{ kind: 'picture', label: 'Code lesen' }}>
        <p className="lead">So beginnt jede Arbeit mit dem ALLBUS in R. Diese vier Zeilen heißen in diesem Kurs <b>Startblock</b>. Du führst sie in RStudio zu Beginn jeder Sitzung aus. Hier ist das schon erledigt: Der Startblock steht ganz oben in deinem Lernjournal.</p>
        <Code k="start" />
        <p className="absatz">Zeilen mit <code>#</code> am Anfang sind <b>Kommentare</b>: Notizen für Menschen, R überspringt sie. <code>library()</code> lädt ein <b>Paket</b>, eine Sammlung von Werkzeugen. Die letzte Zeile liest die Datei und legt sie unter dem Namen <code>allbus</code> ab. So liest du sie, Baustein für Baustein:</p>
        <LineBlocks />
        <p className="absatz">Die erste Zeile liest du von rechts nach links: Lies die Datei ‚ZA8831_v1-3-0.sav‘ ein und leg das Ergebnis unter dem Namen <code>allbus</code> ab. Die zweite Zeile von links nach rechts: Such in <code>allbus</code> nach dem Wort ‚klima‘.</p>
        <InShort>Ein <b>Objekt</b> ist ein Name, unter dem R sich etwas merkt. Mit <code>&lt;-</code> legst du etwas unter einem Namen ab. Eine <b>Funktion</b> sagt, was passiert; ihre <b>Argumente</b> in den Klammern sagen, womit und wie. Mehrere Argumente trennt ein Komma.</InShort>
        <MoreDetail summary="Objekt, Funktion, Argument">
          <ul>
            <li><code>allbus</code> ist nach dem Einlesen der ganze Datensatz. Den Namen hast du selbst vergeben; <code>daten &lt;- read_spss(…)</code> ginge genauso. Wir nehmen in allen Sitzungen <code>allbus</code>, damit jede Vorlage passt.</li>
            <li>Eine Funktion erkennst du an den runden Klammern direkt hinter dem Namen. Sie bekommt etwas, tut etwas und gibt etwas zurück. <code>read_spss()</code> bekommt einen Dateinamen und gibt einen Datensatz zurück.</li>
            <li>Argumente haben Namen. <code>read_spss(path = "ZA8831_v1-3-0.sav")</code> ist dasselbe wie <code>read_spss("ZA8831_v1-3-0.sav")</code>. Den Namen darfst du weglassen, wenn die Argumente in der vorgesehenen Reihenfolge stehen. Was du gar nicht angibst, ist voreingestellt.</li>
            <li><b>Text oder Name?</b> Was in Anführungszeichen steht, ist für R ein Text, etwa ein Dateiname oder ein Suchwort. Was ohne Anführungszeichen steht, ist ein Name: der Name eines Objekts wie <code>allbus</code> oder einer Variable wie <code>pi08</code>.</li>
            <li>Warum erst <code>tidyverse</code>, dann <code>mariposa</code>? Heißen zwei Funktionen aus verschiedenen Paketen gleich, gilt die aus dem zuletzt geladenen Paket. In diesem Kurs ist die Reihenfolge immer dieselbe, damit jede Vorlage bei allen dieselben Funktionen nutzt, zum Beispiel <code>frequency()</code> aus mariposa.</li>
            <li>Mehr dazu im R-Workshop, Kapitel 1.</li>
          </ul>
        </MoreDetail>
        <Mixup><code>&lt;-</code> und <code>=</code>. Mit <code>&lt;-</code> legst du ein Objekt unter einem Namen ab (<code>allbus &lt;- read_spss(…)</code>). Mit <code>=</code> stellst du ein Argument ein (<code>path = "…"</code>). Und: <code>"allbus"</code> mit Anführungszeichen ist nur ein Wort, <code>allbus</code> ohne ist dein Datensatz.</Mixup>
        <p className="absatz">Beim Laden schreibt RStudio farbige Zeilen in die Konsole, etwa ‚Attaching core tidyverse packages‘, ‚Conflicts‘ mit ✖ oder ‚Das folgende Objekt ist maskiert ‘package:stats’: frequency‘. Das sind Hinweise, keine Fehler. Die letzte Zeile heißt: Ab jetzt gilt <code>frequency()</code> aus mariposa, nicht die gleichnamige Funktion aus dem Grundpaket stats. Wie du echte Fehler erkennst, steht in <a href="#k4-lesen">„So liest du eine Fehlermeldung“</a>.</p>
      </Card>

      <Card id="r2" stone="R" title="Vorlage, Lernjournal, Konsole" badge={<Badge>neu</Badge>} tag={{ kind: 'interpret', label: 'Werkzeug' }}>
        <p className="lead">In jeder Aufgabe stehen <b>Vorlagen</b>: Code zum Lesen. Gearbeitet wird in deinem <b>Lernjournal</b> rechts. Dort läuft echtes R, direkt hier im Browser, und gibt dasselbe aus wie in RStudio.</p>
        <Frage>Wie kommt eine Vorlage ins Journal, und was machst du dort?</Frage>
        <ul className="v-liste">
          <li><b>→ Journal</b> holt die Vorlage als Block in dein Journal, einsortiert unter ihrer Aufgabe.</li>
          <li>Gelb markierte Stellen passt du im Block an. Unter dem Block stehen sie noch einmal als Liste.</li>
          <li><b>▶ Ausführen</b> zeigt die Antwort von R direkt unter dem Block.</li>
          <li>Ganz oben im Journal steht der Startblock. <code>allbus</code> ist im Journal schon deine Datei.</li>
          <li>Darunter schreibst du Notizen. Ergebnisse aus „Ergebnis festhalten“ holst du mit <b>→ Ergebnisse ins Journal</b> hierher. Am Ende nimmst du das Journal als Dokument mit.</li>
        </ul>
        <p className="absatz">Die <b>Konsole</b> unter dem Journal ist zum schnellen Ausprobieren. Was dort läuft, kommt nicht ins Journal. Was du mit <code>&lt;-</code> speicherst, steht im Environment. Das Journal hat dieselben <b>Tastenkürzel wie RStudio</b>:</p>
        <Kuerzel />
        <InShort>Vorlagen liest du in der Aufgabe. Mit <b>→ Journal</b> holst du sie in dein Lernjournal, passt die gelben Stellen an und führst sie dort aus. Die Vorlage in der Aufgabe bleibt, wie sie ist; geändert wird nur dein Block.</InShort>
        <MoreDetail summary="Lernjournal und RStudio">
          <ul>
            <li>Steht eine Zeile mit <code>library(tidyverse)</code> oder <code>library(mariposa)</code> in einem Block, überspringt das Journal sie: Die Pakete sind hier schon geladen. So kannst du denselben Code nach RStudio kopieren.</li>
            <li>Sobald deine Datei da ist, startet R von selbst, auch nach jedem Neuladen der Seite: etwa 20 Sekunden, dazu 10 bis 20 Sekunden für die Datei. Die Statuszeile zeigt, wann R bereit ist.</li>
            <li>Ohne Internet startet R im Browser nicht. Dann kopierst du den Code und führst ihn in RStudio aus.</li>
            <li>Der Lernpfad ersetzt RStudio nicht: Für die Klausur und für eigene Auswertungen arbeitest du in RStudio. Der Lernpfad ist zum Üben da.</li>
          </ul>
        </MoreDetail>
        <Mixup>Ausführen und Prüfen. <span aria-hidden="true">▶</span> Ausführen zeigt dir, was R ausgibt. Ob deine Antwort stimmt, prüfst du in jeder Aufgabe unter „Ergebnis festhalten“: Dort trägst du ein, was du in der Ausgabe gelesen hast.</Mixup>
      </Card>
    </HeadingLevel.Provider>
  </section>;
}

/* ---------- Aufgabe 1 ---------- */
export function Verstehen1() {
  return <Abschnitt id="g1" n={1} titel="Startklar" frage="Hast du den ALLBUS in R, und wie groß ist er?"
    ziel="deine ALLBUS-Datei im Lernpfad gespeichert, im Lernjournal und in RStudio eingelesen und kannst sagen, wie viele Befragte und Variablen sie hat und wie viele Zellen das sind."
    weg={[
      ['Schritt 1', '#a1-p', 'Erst festlegen: Wie viele Menschen hat der ALLBUS befragt?', 'k1-allbus'],
      ['Schritt 2', '#a1-1', 'deine ALLBUS-Datei laden', 'k1-datei'],
      ['Schritt 3', '#a1-2', 'dim(): Zeilen und Spalten zählen', 'k1-dim'],
      ['Schritt 4', '#a1-3', 'R rechnet: Zellen zählen und unter einem Namen ablegen', 'k1-rechnen'],
      ['Schritt 5', '#a1-4', 'Dasselbe in RStudio: die vier Fenster', 'k1-fenster'],
      ['Schritt 5', '#a1-4', 'RStudio über ein Projekt öffnen', 'k1-projekt'],
      ['Schritt 5', '#a1-4', 'Pakete laden, Startblock ausführen', 'k1-pakete'],
      ['Schritt 6', '#a1-5', 'Ergebnis festhalten: wo du was abliest', 'k1-ergebnis'],
    ]}>

    <Card id="k1-allbus" title="Woher die Datei kommt: ALLBUS und GESIS" badge={<Bezug href="#a1-p">zu Schritt 1</Bezug>} tag={{ kind: 'interpret', label: 'Hintergrund' }}>
      <p className="lead">Die Daten dieses Semesters stammen aus einer echten Befragung: der <b>Allgemeinen Bevölkerungsumfrage der Sozialwissenschaften</b>, kurz <b>ALLBUS</b>.</p>
      <div className="box-gruen s1-steckbrief">
        <p><b>Steckbrief</b></p>
        <ul>
          <li>Seit 1980 befragt, meist alle zwei Jahre.</li>
          <li>Betreut von GESIS, dem Leibniz-Institut für Sozialwissenschaften. Für Wissenschaft und Lehre kostenlos.</li>
          <li>Zufallsstichprobe aus den Einwohnermelderegistern: Erwachsene in Privathaushalten in Deutschland.</li>
          <li>{`Der Osten ist absichtlich stärker vertreten: ${EAST.percent} % der Befragten leben dort, deutlich mehr als im Anteil an der Bevölkerung.`}</li>
          <li>Jede Frage und jeder Code ist dokumentiert: im Codebuch, im Fragebogen und im Methodenbericht.</li>
          <li>Wir nutzen den ALLBUScompact 2023: Studiennummer ZA8831, Version 1.3.0, als SPSS-Datei <code>ZA8831_v1-3-0.sav</code>.</li>
        </ul>
      </div>
      <Frage>Und warum sollst du vorher festlegen, wie viele Menschen befragt wurden?</Frage>
      <p>Wer vorher eine Erwartung notiert, merkt hinterher, wo das eigene Bild danebenlag. Wie groß der ALLBUS wirklich ist, zählt R für dich in Schritt 3. Holst du am Ende deine Ergebnisse ins Journal, steht deine Festlegung daneben.</p>
      <InShort>Der <b>ALLBUS</b> ist eine wiederholte Bevölkerungsumfrage. Die Datei enthält für jede befragte Person eine <b>Zeile</b> und für jede Frage eine <b>Variable</b> (Spalte). Ein Datensatz, den andere erhoben haben und den du auswertest, heißt <b>Sekundärdaten</b>.</InShort>
      <MoreDetail summary="Warum Zahlen hier ungewichtet sind">
        <p>Weil der Osten absichtlich stärker vertreten ist, sprechen einfache Zählungen nicht direkt für ganz Deutschland. Dafür gibt es eine <b>Gewichtung</b>; sie ist Thema in Sitzung 6. Bis dahin sind alle Zahlen im Lernpfad ungewichtet, also einfach gezählt. Für die Fragen dieser Sitzung (Wer wurde was gefragt? Wie viele haben geantwortet?) ist das genau richtig.</p>
      </MoreDetail>
      <Mixup>Befragte und Bevölkerung. Der ALLBUS befragt eine Stichprobe, nicht alle Menschen in Deutschland. Was in der Datei steht, gilt zuerst für die Befragten. Wie man daraus auf alle schließt, kommt im Lauf des Semesters.</Mixup>
    </Card>

    <Card id="k1-datei" title="Deine Datei bleibt bei dir" badge={<Bezug href="#a1-1">zu Schritt 2</Bezug>} tag={{ kind: 'interpret', label: 'Hintergrund' }}>
      <p className="lead">Die Datei bekommst du bei GESIS: kostenlos registrieren, nach ZA8831 suchen, die SPSS-Datei (.sav) herunterladen.</p>
      <Frage>Warum wählst du die Datei selbst, statt dass der Lernpfad sie mitbringt?</Frage>
      <p>Die Nutzung ist an dich gebunden: Gib die Datei nicht weiter und lade sie nirgends hoch. Deshalb liefert auch der Lernpfad keine Daten mit. In Schritt 2 wählst du deine eigene Datei. Hochgeladen wird dabei nichts: Die Datei verlässt deinen Rechner nicht.</p>
      <Frage>Und wo ist sie danach?</Frage>
      <p>In deinem Browser, auf deinem Rechner. Du wählst sie <b>einmal</b>; danach gilt sie für alle Sitzungen des Lernpfads, auch wenn du die Seite neu lädst oder den Browser schließt. Neu wählen musst du sie auf einem anderen Gerät oder in einem anderen Browser, wenn du die Website-Daten gelöscht hast oder Safari sie nach etwa sieben Tagen ohne Besuch entfernt hat.</p>
      <Frage>Wozu braucht der Lernpfad die Datei?</Frage>
      <p>Damit R im Lernjournal und in der Konsole mit echten Daten rechnet: Aus der Datei wird das Objekt <code>allbus</code>. Ohne Datei kannst du alles lesen und deine Antworten prüfen; nur <span aria-hidden="true">▶</span> Ausführen braucht sie.</p>
      <InShort>Die ALLBUS-Datei ist an dich gebunden. Du wählst sie einmal; sie bleibt in deinem Browser auf deinem Rechner und wird nirgends hochgeladen.</InShort>
    </Card>

    <Card id="k1-dim" title="Wie groß ist der ALLBUS? dim()" badge={<Bezug href="#a1-2">zu Schritt 3</Bezug>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">Ein Datensatz ist eine Tabelle: für jede befragte Person eine Zeile, für jede Variable eine Spalte. Im Sommer hattest du 30 Blobs und eine Variable. <Ia /> Wie groß die Tabelle beim ALLBUS ist, fragst du R mit einer einzigen Zeile.</p>
      <Code k="a1_dim" />
      <Frage>Was sagt dir die Ausgabe?</Frage>
      <p><code>dim()</code> steht für <i>dimensions</i>: Die Funktion gibt zwei Zahlen aus, erst die Zeilen (Befragte), dann die Spalten (Variablen). Davor steht <code>[1]</code>. Das heißt nur: Hier beginnt die Ausgabe. Die Zahlen danach sind das Ergebnis.</p>
      <Frage>Warum steht in der Vorlage kein <code>library()</code> und kein <code>read_spss()</code>?</Frage>
      <p>Weil der Startblock im Lernjournal schon erledigt ist: <code>allbus</code> ist dort deine Datei (<a href="#r1">Der Startblock</a>). In RStudio führst du den Startblock selbst aus, das ist Schritt 5.</p>
      <InShort>Eine Zeile ist ein <b>Fall</b>, hier eine befragte Person. Eine Spalte ist eine <b>Variable</b>. <code>dim()</code> zählt beides: erst Zeilen, dann Spalten.</InShort>
      <Mixup>Zeilen und Spalten. Die erste Zahl sind die Zeilen, also die Befragten; die zweite die Spalten, also die Variablen. Jede Variable ist eine Frage oder eine Angabe zum Interview.</Mixup>
    </Card>

    <Card id="k1-rechnen" title="R rechnet: ein Ergebnis unter einem Namen ablegen" badge={<Bezug href="#a1-3">zu Schritt 4</Bezug>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">Jede Befragte hat für jede Variable eine Zelle. Wie viele Zellen sind das? R ist auch ein Taschenrechner.</p>
      <Code k="a1_zellen" />
      <Frage>Was passiert in den drei Teilen der Vorlage?</Frage>
      <ul className="v-liste">
        <li><code>zellen &lt;- … * …</code> rechnet Befragte mal Variablen und legt das Ergebnis unter dem Namen <code>zellen</code> ab. Das Sternchen heißt „mal“.</li>
        <li>Die Zeile <code>zellen</code> allein zeigt, was unter diesem Namen liegt.</li>
        <li>Die letzte Zeile rechnet Sekunden in Tage um: durch 60 (Minuten), durch 60 (Stunden), durch 24 (Tage). So siehst du, wie lange du bei einer Zelle pro Sekunde bräuchtest.</li>
      </ul>
      <Frage>Was gehört an die gelben Stellen?</Frage>
      <p>Die beiden Zahlen aus Schritt 3, so wie R sie schreibt: ohne Tausenderpunkt. Für R ist der Punkt ein Komma. Umgekehrt schreibt R auch Kommazahlen mit Punkt: <code>2.5</code> heißt zweieinhalb.</p>
      <Frage>Und warum meldet R „object 'Befragte' not found“, wenn du nichts änderst?</Frage>
      <p>Ohne Anführungszeichen liest R <code>Befragte</code> als Namen eines Objekts, und ein Objekt mit diesem Namen gibt es nicht (<a href="#r1">Text oder Name?</a>). Erst wenn dort Zahlen stehen, kann R rechnen.</p>
      <InShort>Mit <code>&lt;-</code> legst du ein Ergebnis unter einem Namen ab, als <b>Objekt</b>. Danach steht es im Environment, und du kannst damit weiterrechnen.</InShort>
      <Mixup>Ablegen und anzeigen. <code>zellen &lt;- …</code> zeigt nichts an; R merkt sich das Ergebnis nur. Erst die Zeile <code>zellen</code> zeigt es.</Mixup>
    </Card>

    <Card id="k1-fenster" title="Vier Fenster: R und RStudio" badge={<Bezug href="#a1-4">zu Schritt 5</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Im Sommer hast du 30 Blobs mit Strichliste und Taschenrechner ausgezählt: eine Variable, 30 Werte. <Ia /> Beim ALLBUS geht das von Hand nicht mehr, dafür nimmst du <b>R</b>. R ist die Sprache, die rechnet. <b>RStudio</b> ist das Programm, in dem du mit R arbeitest. Es hat vier Fenster. Wähl ein Fenster und lies, wofür es da ist.</p>
      <RStudioPanes />
      <Frage>Wo schreibst du Code, den du nächste Woche wieder brauchst?</Frage>
      <p>Im Skript. Das Skript speicherst du als .R-Datei. Die Konsole führt aus, vergisst aber alles, sobald du RStudio schließt; das Environment zeigt nur, was R gerade kennt. Aufheben kannst du Code nur im Skript.</p>
      <InShort><b>R</b> ist die Sprache, die rechnet. <b>RStudio</b> ist das Programm drumherum, eine sogenannte Entwicklungsumgebung. Im <b>Skript</b> schreibst du, in der <b>Konsole</b> antwortet R, im <b>Environment</b> siehst du deine Objekte.</InShort>
      <MoreDetail summary="Anordnung und Screenreader">
        <ul>
          <li>Die Fenster können bei dir anders angeordnet sein. Die Namen in den Kopfzeilen bleiben gleich.</li>
          <li>Mit Screenreader: Unter Tools → Global Options → Accessibility schaltest du die Unterstützung für Screenreader ein. Das Environment ist mit Screenreader mühsam; die Zahl der Befragten und Variablen bekommst du auch mit <code>dim(allbus)</code> als Text (Schritt 3).</li>
          <li>So installierst du: erst R von cran.r-project.org, dann RStudio Desktop von posit.co. Hakt es, hilft der Setup-Guide in ILIAS.</li>
        </ul>
      </MoreDetail>
      <Mixup>R und RStudio sind zwei Programme. RStudio braucht R, nicht umgekehrt. Deshalb installierst du zuerst R, dann RStudio. Arbeiten tust du immer in RStudio.</Mixup>
    </Card>

    <Card id="k1-projekt" title="Ein Projekt für das ganze Semester" badge={<Bezug href="#a1-4">zu Schritt 5</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Der Startblock sagt <code>read_spss("ZA8831_v1-3-0.sav")</code>. Aber wo soll R nach dieser Datei suchen? R schaut in genau einem Ordner nach, dem <b>Arbeitsordner</b>. Ein <b>RStudio-Projekt</b> macht einen Ordner zu deinem Arbeitsordner, jedes Mal, wenn du das Projekt öffnest.</p>
      <ProjectPicture />
      <p className="absatz"><b>So legst du das Projekt an:</b></p>
      <ol className="s1-liste">
        <li>In RStudio: File → New Project … → New Directory → New Project.</li>
        <li>Gib einen Namen (zum Beispiel <code>methoden-ib</code>) und einen Ort an, den du wiederfindest. Create Project.</li>
        <li>Verschieb die heruntergeladene Datei <code>ZA8831_v1-3-0.sav</code> in diesen Ordner. Unten rechts unter Files siehst du sie dann.</li>
        <li>Leg ein Skript an (File → New File → R Script) und speichere es im selben Ordner, etwa als <code>sitzung1.R</code>.</li>
        <li>Ab jetzt öffnest du RStudio über dein Projekt: Doppelklick auf <code>methoden-ib.Rproj</code> oder in RStudio über File → Open Project.</li>
      </ol>
      <Frage>Dein Skript liegt im Projektordner, die ALLBUS-Datei aber noch in Downloads. Was passiert beim Einlesen?</Frage>
      <p>R meldet, dass die Datei nicht existiert (‚does not exist‘). R sucht nicht auf dem ganzen Rechner, sondern nur im Arbeitsordner, beim Projekt also im Projektordner. Die Funktion kennt R, sobald mariposa geladen ist; nur die Datei fehlt dort. Verschieb sie in den Projektordner.</p>
      <InShort>Der <b>Arbeitsordner</b> ist der Ordner, in dem R nach Dateien sucht. Ein <b>Projekt</b> setzt ihn automatisch auf deinen Projektordner. Liegen Skript und Datei dort, genügt der Dateiname.</InShort>
      <MoreDetail summary="Der Ausweg file.choose()">
        <ul>
          <li>Findet R die Datei nicht, nimm <code>allbus &lt;- read_spss(file.choose())</code>. Dann öffnet sich ein Fenster, in dem du die Datei auswählst. Unter macOS erscheint dieses Fenster manchmal hinter RStudio; schau dann in der Taskleiste nach.</li>
          <li>Wo R gerade sucht, zeigt <code>getwd()</code> (get working directory) in der Konsole.</li>
          <li>Der Dateiname muss genau stimmen: Bindestriche, Unterstrich, die Endung .sav. Am sichersten kopierst du ihn aus der Vorlage.</li>
        </ul>
      </MoreDetail>
      <Mixup>Projekt und Skript. Das Projekt ist der Ordner mit der Datei <code>.Rproj</code>; das Skript ist eine einzelne <code>.R</code>-Datei darin. Wer nur das Skript öffnet (Doppelklick auf <code>sitzung1.R</code>), hat oft den falschen Arbeitsordner.</Mixup>
    </Card>

    <Card id="k1-pakete" title="Pakete: einmal installieren, jedes Mal laden" badge={<Bezug href="#a1-4">zu Schritt 5</Bezug>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead"><code>read_spss()</code> und <code>find_var()</code> gehören nicht zu R selbst. Sie stecken im <b>Paket</b> mariposa, das für diesen Kurs geschrieben ist. Ein Paket ist wie eine Werkzeugkiste: Du besorgst sie einmal und holst sie dann jedes Mal hervor, wenn du sie brauchst.</p>
      <div className="lesehilfe s1-pakete" role="img" aria-label={ALT.pakete}>
        <span><b style={{ background: 'var(--gruenh)' }}>install.packages("mariposa")</b><small>einmal: besorgen (aus dem Internet installieren)</small></span>
        <span><b style={{ background: 'var(--gruenh)' }}>library(mariposa)</b><small>jedes Mal: hervorholen (für diese Sitzung laden)</small></span>
      </div>
      <p className="hilfe-zeile">Bei <code>install.packages()</code> stehen Anführungszeichen, weil der Name hier ein Text ist.</p>
      <Frage>Du öffnest RStudio am nächsten Tag. Was führst du aus, bevor du arbeitest?</Frage>
      <p>Nur den Startblock: <code>library()</code> und <code>read_spss()</code>. <code>install.packages()</code> brauchst du nur einmal pro Rechner; installiert bleibt installiert. Nach dem Schließen vergisst R aber, welche Pakete geladen waren und was <code>allbus</code> ist. Darum steht der Startblock am Anfang jedes Skripts (<a href="#r1">Der Startblock</a>).</p>
      <InShort>Ein <b>Paket</b> bringt Funktionen mit. <code>install.packages()</code> installiert es einmal pro Rechner, <code>library()</code> lädt es in jeder Sitzung. Wir laden immer zuerst <code>tidyverse</code>, dann <code>mariposa</code>.</InShort>
      <MoreDetail summary="das tidyverse und fehlende Pakete">
        <p>Das tidyverse ist eine Sammlung vieler Pakete; daraus brauchst du ab Sitzung 2 etwa die Pipe <code>%&gt;%</code> und <code>filter()</code>. Fehlt ein Paket, meldet R ‚es gibt kein Paket namens …‘ (englisch: there is no package called …). Dann einmal <code>install.packages("…")</code> mit diesem Namen ausführen. Im Lernjournal sind die Pakete schon geladen.</p>
      </MoreDetail>
      <Mixup>Bei <code>install.packages("mariposa")</code> stehen Anführungszeichen, bei <code>library(mariposa)</code> braucht es keine. Beides funktioniert nur so, wie es in der Vorlage steht.</Mixup>
    </Card>

    <Card id="k1-ergebnis" title="Ergebnis festhalten: wo du was abliest" badge={<Bezug href="#a1-5">zu Schritt 6</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">In Schritt 6 hältst du vier Dinge fest. Jedes hat einen Ort, an dem du es ablesen kannst.</p>
      <ul className="v-liste">
        <li><b>Befragte:</b> die erste Zahl nach <code>[1]</code> in der Ausgabe von Schritt 3, die Zeilen (<a href="#k1-dim">dim()</a>).</li>
        <li><b>Variablen:</b> die zweite Zahl in derselben Ausgabe, die Spalten.</li>
        <li><b>Wie lange bei einer Zelle pro Sekunde:</b> die letzte Zeile der Ausgabe von Schritt 4. Denk daran, dass R Kommazahlen mit Punkt schreibt (<a href="#k1-rechnen">R rechnet</a>).</li>
        <li><b>Wo RStudio zeigt, dass <code>allbus</code> angekommen ist:</b> Welches der vier Fenster deine Objekte auflistet, steht in <a href="#k1-fenster">Vier Fenster</a>.</li>
      </ul>
      <p>Holst du die Ergebnisse ins Journal, steht dort deine Festlegung aus Schritt 1 daneben. Lag sie daneben, ist das kein Fehler, sondern genau der Moment, für den man vorher festlegt.</p>
    </Card>
  </Abschnitt>;
}

/* ---------- Aufgabe 2 ---------- */
export function Verstehen2() {
  return <Abschnitt id="g2" n={2} titel="Schon gefragt?" frage="Hat der ALLBUS 2023 schon gefragt, was dich interessiert?"
    ziel="für vier Ideen geprüft, ob der ALLBUS sie schon fragt, und kannst erklären, warum ‚kein Treffer‘ noch nicht ‚gibt es nicht‘ heißt und ein Treffer nicht immer passt."
    weg={[
      ['Schritt 1', '#a2-p', 'Erst festlegen: Was heißt es, wenn find_var() nichts findet?', 'k2-label'],
      ['Schritt 2', '#a2-1', 'Idee 1: suchen mit find_var()', 'k2-suchen'],
      ['Schritt 3', '#a2-2', 'Idee 2: kein Treffer? anders suchen', 'k2-anders'],
      ['Schritt 4', '#a2-3', 'Idee 3: Treffer lesen, passendes Wort finden', 'k2-passt'],
      ['Schritt 5', '#a2-4', 'Idee 4: Scheintreffer erkennen', 'k2-passt'],
      ['Schritt 6', '#a2-5', 'Ergebnis festhalten und entscheiden', 'k2-ergebnis'],
    ]}>

    <Card id="k2-label" title="Name und Variablenlabel" badge={<Bezug href="#a2-p">zu Schritt 1 und 2</Bezug>} tag={{ kind: 'interpret', label: 'Hintergrund' }}>
      <p className="lead">Der ALLBUS fragt, wie oft Menschen Bücher lesen. In der Datei heißt diese Variable <code>la01</code>. Daneben steht eine kurze Beschreibung: FREIZEIT: BUECHER LESEN. <Known what="Variable" label="kennst du aus Methoden Ia" /></p>
      <p className="absatz">Jede Variable hat zwei Kennzeichen:</p>
      <ul className="s1-liste">
        <li>den <b>Variablennamen</b>, kurz und ohne Leerzeichen, etwa <code>la01</code>. Mit ihm sprichst du die Variable in R an.</li>
        <li>das <b>Variablenlabel</b>, eine kurze Beschreibung der Frage, etwa FREIZEIT: BUECHER LESEN.</li>
      </ul>
      <Frage>Wie sind die Labels geschrieben, und warum ist das für die Suche wichtig?</Frage>
      <p>Die Variablenlabels im ALLBUS stehen in GROSSBUCHSTABEN, ohne Umlaute (ü wird UE) und oft abgekürzt. Gesucht wird in genau dieser Schreibweise. Sie entscheidet in den Schritten 2 bis 5, ob eine Suche etwas findet. Variablen, die zusammengehören, haben oft ähnliche Namen: <code>lm27</code> bis <code>lm34</code> fragen alle, mit welchen Geräten jemand das Internet nutzt.</p>
      <InShort>Der <b>Variablenname</b> ist der Rufname in R (<code>la01</code>). Das <b>Variablenlabel</b> beschreibt kurz, was gefragt wurde (FREIZEIT: BUECHER LESEN).</InShort>
      <MoreDetail summary="Wo steht die ganze Frage?">
        <p>Das Variablenlabel ist eine Kurzfassung. Den genauen Wortlaut der Frage findest du im Fragebogen und im Variablenbericht zum ALLBUS 2023 bei GESIS (Suche nach ZA8831). Für die Suche in R reicht das Variablenlabel.</p>
      </MoreDetail>
      <Mixup>Variablenlabel und Frage. FREIZEIT: BUECHER LESEN ist nicht der Fragetext. Ob gefragt wurde ‚Wie oft lesen Sie Bücher?‘ oder ‚Lesen Sie gern?‘, zeigt erst der Fragebogen; die Antwortmöglichkeiten zeigt das Codebuch (<a href="#k3-codebuch">Verstehen zu Aufgabe 3</a>).</Mixup>
    </Card>

    <Card id="k2-suchen" title="Suchen mit find_var()" badge={<Bezug href="#a2-1">zu Schritt 2</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead"><code>find_var(allbus, "buecher")</code> sucht in allen Variablennamen und Variablenlabels nach dem Wortteil ‚buecher‘ und findet <code>la01</code>.</p>
      <FindVarPicture />
      <p className="absatz">Die Vorlage in Schritt 2 sucht genauso, nur mit einem anderen Suchwort:</p>
      <Code k="a2_idee1" />
      <p className="absatz">Das erste Argument ist der Datensatz (<code>allbus</code>, ohne Anführungszeichen), das zweite das Suchwort (in Anführungszeichen). In der Ausgabe zeigt <code>col</code>, an welcher Stelle die Variable im Datensatz steht, daneben stehen Name und Variablenlabel.</p>
      <h6 className="zwischen">Suchwort-Labor</h6>
      <p className="unter-zwischen">Wähl ein Suchwort und lies, was R antwortet. Die Ausgaben stammen aus dem ALLBUS 2023.</p>
      <SearchLab />
      <InShort><code>find_var()</code> sucht ein Wort oder einen Wortteil in Variablennamen und Variablenlabels. Groß- und Kleinschreibung ist egal.</InShort>
      <MoreDetail summary="Wie find_var() sucht">
        <ul>
          <li>Gefunden wird jedes Label, in dem das Suchwort irgendwo vorkommt, auch mitten in einem Wort.</li>
          <li>Mit dem Argument <code>search</code> kannst du die Suche einschränken: <code>search = "name"</code> sucht nur in den Namen, <code>search = "label"</code> nur in den Labels. Voreingestellt ist beides.</li>
          <li>Findet <code>find_var()</code> nichts, schreibt R: No variables found matching … Das ist ein Hinweis, kein Fehler.</li>
          <li>Mehr im R-Workshop, Abschnitt 4.4.1 <code>find_var()</code>.</li>
        </ul>
      </MoreDetail>
    </Card>

    <Card id="k2-anders" title="Kein Treffer? Anders suchen" badge={<Bezug href="#a2-2">zu Schritt 3</Bezug>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">In Schritt 3 steht das Suchwort gelb markiert. Du führst die Vorlage im Journal erst so aus, wie sie ist, und änderst das Wort, wenn R nichts findet.</p>
      <Code k="a2_idee2" />
      <Frage>Was probierst du, wenn R „No variables found matching …“ meldet?</Frage>
      <ul className="v-liste">
        <li><b>ae, oe, ue statt ä, ö, ü:</b> ‚bücher‘ findet nichts, ‚buecher‘ findet <code>la01</code>.</li>
        <li><b>einen kürzeren Wortanfang:</b> Labels sind oft abgekürzt. Ein kurzer Wortanfang wie ‚fernseh‘ findet FERNSEHER und FERNSEHEN.</li>
        <li><b>ein anderes Wort:</b> Der ALLBUS sagt nicht Handy, sondern Smartphone. Probier Wörter mit gleicher Bedeutung.</li>
      </ul>
      <Frage>Du willst wissen, ob der ALLBUS nach Sport fragt, und ‚sport‘ findet nichts. Was nun?</Frage>
      <p>Ein allgemeineres Wort, etwa ‚freizeit‘. Es findet <code>la01</code> (FREIZEIT: BUECHER LESEN) und <code>li03</code> (WICHTIGKEIT: FREIZEIT UND ERHOLUNG). Eine Sportfrage ist nicht dabei; sicher bist du erst nach mehreren Suchwörtern und einem Blick ins Codebuch. ‚SPORT‘ in Großbuchstaben findet genauso wenig, denn <code>find_var()</code> achtet nicht auf Groß- und Kleinschreibung. Aufgeben ist zu früh.</p>
      <InShort><b>Kein Treffer</b> heißt nicht ‚gibt es nicht‘: Probier ae, oe, ue statt ä, ö, ü, einen kürzeren Wortanfang oder ein anderes Wort.</InShort>
      <Mixup>Kein Treffer und keine Frage. ‚bücher‘ findet nichts, ‚buecher‘ findet la01. Bevor du sagst ‚Der ALLBUS fragt das nicht‘, probier mindestens zwei, drei Suchwörter.</Mixup>
    </Card>

    <Card id="k2-passt" title="Ein Treffer ist ein Kandidat: Passt die Variable?" badge={<Bezug href="#a2-3">zu Schritt 4 und 5</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">In Schritt 4 und 5 findet R etwas. Jetzt beginnt die eigentliche Arbeit: Misst einer der Treffer, was die Idee meint?</p>
      <Code k="a2_idee3" />
      <Code k="a2_idee4" />
      <Frage>Was heißt eigentlich „die Politik“?</Frage>
      <p>‚Die Politik‘ kann Verschiedenes meinen: den Bundestag, die Bundesregierung, die Parteien. Du musst entscheiden, was die Idee meint. Findet die Suche nichts Passendes, frag dich: Welches Wort aus der Idee würde im Label stehen? Das änderst du im Journal an der gelben Stelle.</p>
      <Frage>Warum findet R manchmal etwas, das gar nicht passt?</Frage>
      <p>Weil <code>find_var()</code> das Suchwort auch mitten in einem anderen Wort findet. ‚tier‘ steckt in RESPEKTIEREN; mit Tieren hat diese Frage nichts zu tun. So ein Treffer heißt <b>Scheintreffer</b>. Darum liest du jedes Label Wort für Wort und probierst bei Schritt 5 weitere Wörter, etwa ‚allein‘ oder ‚freund‘.</p>
      <Frage>Und wenn ein Treffer nah dran ist, aber nicht genau?</Frage>
      <p>Dann geht es um <b>Gültigkeit</b> (Validität): Misst die Variable, was du meinst? Ob man eine Variable trotzdem nimmt, ist eine Entscheidung, die du begründest. Manchmal ist die Antwort: Die Frage müsste man neu stellen.</p>
      <InShort><b>Ein Treffer</b> heißt nicht ‚passt‘: Lies das Variablenlabel. Ob eine Variable misst, was du meinst, heißt <b>Gültigkeit</b>: Passt die Frage zu deiner Idee?</InShort>
      <Mixup>Suchwort im Label und Thema der Frage. Dass dein Suchwort im Label steht, heißt nur, dass die Buchstaben vorkommen. Worum es in der Frage geht, sagt erst das ganze Label.</Mixup>
    </Card>

    <Card id="k2-ergebnis" title="Ergebnis festhalten: lesen und entscheiden" badge={<Bezug href="#a2-5">zu Schritt 6</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">Die Fragen in Schritt 6 wollen von dir zweierlei: etwas ablesen und etwas entscheiden.</p>
      <ul className="v-liste">
        <li><b>Welche Variable?</b> Lies das Variablenlabel jedes Treffers und vergleiche es mit der Idee.</li>
        <li><b>Wie viele Treffer?</b> Zähl die Zeilen der Ausgabe. R nummeriert sie am linken Rand.</li>
        <li><b>Misst sie, was die Idee meint?</b> Das ist die Frage nach der Gültigkeit (<a href="#k2-passt">Ein Treffer ist ein Kandidat</a>).</li>
        <li><b>Was folgt daraus?</b> Es gibt drei Ausgänge: Eine Variable passt, eine ist nah dran, oder man müsste neu fragen.</li>
      </ul>
      <p>Fürs Plenum bringst du zu jeder Idee deine Entscheidung und einen Satz Begründung mit. Bei Idee 2 und 3 gibt es keine eindeutige Antwort.</p>
    </Card>
  </Abschnitt>;
}

/* ---------- Aufgabe 3 ---------- */
export function Verstehen3() {
  return <Abschnitt id="g3" n={3} titel="Belegen" frage="Was genau misst die Variable, und wie viele haben gültig geantwortet?"
    ziel="für die Horoskop-Frage rh08b und die Vertrauensfrage pt03 gelesen, was die Codes bedeuten, wie viele gültig geantwortet haben und wem die Frage gar nicht gestellt wurde."
    weg={[
      ['Schritt 1', '#a3-p', 'Erst festlegen: Wem wurde die Frage gestellt?', 'k3-codes'],
      ['Schritt 2', '#a3-1', 'im Codebuch nachschlagen (in RStudio)', 'k3-codebuch'],
      ['Schritt 3', '#a3-2', 'erster Blick mit frequency(): Codes und Wertelabels', 'k3-codes'],
      ['Schritt 4', '#a3-3', 'die Vertrauensfrage: fehlende Werte und TNZ', 'k3-fehlend'],
      ['Schritt 5', '#a3-4', 'Ergebnis festhalten: wo du was abliest', 'k3-ergebnis'],
    ]}>

    <Card id="k3-codebuch" title="Das Codebuch" badge={<Bezug href="#a3-1">zu Schritt 2</Bezug>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">Das <b>Codebuch</b> listet für jede Variable Name, Variablenlabel, Codes mit Wertelabels und wie oft jeder Code vorkommt.</p>
      <Code k="a3_codebuch" />
      <Frage>Wie liest du die Vorlage?</Frage>
      <p>In RStudio öffnet <code>codebook(allbus)</code> das ganze Codebuch im Viewer (unten rechts). Mit dem Symbol ‚Show in new window‘ öffnest du es im Browser und suchst mit Strg + F (Mac: Cmd + F) nach einem Variablennamen. Mit einem Variablennamen schlägt <code>codebook(allbus, rh08b)</code> nur diese eine Variable nach.</p>
      <Frage>Warum ist das ein Schritt in RStudio und nicht im Lernjournal?</Frage>
      <p>Das Lernjournal hier im Browser kann den Viewer nicht öffnen. Darum nimmst du in dieser Sitzung <code>frequency()</code>: Dort stehen die gültigen Antworten als eigene Zeile (Schritt 3). Das Nachschlagen mit <code>codebook()</code> übst du in Sitzung 2.</p>
      <InShort>Das <b>Codebuch</b> beschreibt jede Variable: Name, Variablenlabel, Codes und Wertelabels. <code>codebook()</code> öffnet es in RStudio.</InShort>
      <MoreDetail summary="Mehr zu codebook()">
        <p>Mehr im R-Workshop, Abschnitt 4.4.2 <code>codebook()</code>.</p>
      </MoreDetail>
    </Card>

    <Card id="k3-codes" title="Codes und Wertelabels: frequency() lesen" badge={<Bezug href="#a3-2">zu Schritt 3</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Die Klimafrage <code>pi08</code> (MEINUNG UEBER DEN KLIMAWANDEL) hat vier Antwortmöglichkeiten. <Known what="Wert" label="kennst du aus Methoden Ia" /> Im Datensatz steht aber kein Wort, sondern eine Zahl, ein <b>Code</b>: 1 für ‚keine Klimaänderung‘, 4 für ‚menschliche Ursachen‘. Das Wort zum Code heißt <b>Wertelabel</b>. So sieht die Variable aus, wenn R sie auszählt:</p>
      <FrequencyTable />
      <p className="absatz">Die Prozent-Spalten (Raw %, Valid %, Cum. %) und die Kennzahlen in der Kopfzeile (mean, sd, skewness) schauen wir uns in Sitzung 3 und 4 genauer an. Heute zählen Codes, Wertelabels und N.</p>
      <Frage>Und wie liest du dieselbe Ausgabe für die Horoskop-Frage?</Frage>
      <Code k="a3_rh08b" />
      <p><code>frequency()</code> zählt aus, wie oft jeder Code vorkommt. Erstes Argument: der Datensatz, zweites: die Variable, ohne Anführungszeichen. Value ist der Code, Label das Wertelabel, N die Anzahl. Oben stehen die Antworten, dann ‚Total valid‘, darunter die fehlenden Werte mit negativen Codes. Ausführlich kommt <code>frequency()</code> in Sitzung 3.</p>
      <InShort>Ein <b>Code</b> ist die Zahl im Datensatz, ein <b>Wertelabel</b> das Wort dazu. Das <b>Variablenlabel</b> beschreibt die ganze Variable. Alle Antwortmöglichkeiten zusammen heißen <b>Ausprägungen</b>.</InShort>
      <Mixup>Code und Menge. Code 4 heißt nicht ‚vier Personen‘ oder ‚viermal so stark‘. Die 4 ist nur die Nummer der Antwort MENSCHL. URSACHEN. Wie viele so geantwortet haben, steht in Spalte N.</Mixup>
    </Card>

    <Card id="k3-fehlend" title="Fehlende Werte: wer nicht geantwortet hat und wer gar nicht gefragt wurde" badge={<Bezug href="#a3-3">zu Schritt 1 und 4</Bezug>} tag={{ kind: 'picture', label: 'Formel lesen' }}>
      <p className="lead">Bei pi08 stehen unter den Antworten vier negative Codes. 1.647 Befragte haben den Code −11 TNZ: SPLIT. <b>TNZ</b> heißt ‚trifft nicht zu‘: Diesen Menschen wurde die Frage <b>gar nicht gestellt</b>. Der ALLBUS hat mehrere Fassungen des Fragebogens, und die Klimafrage stand nur in einem Teil davon. Die anderen negativen Codes betreffen Menschen, die gefragt wurden, aber keine gültige Antwort gegeben haben: KEINE ANGABE, WEISS NICHT, DATENFEHLER.</p>
      <div className="formel s1-formel" role="group" aria-label="Formel für die gültigen Antworten">
        <div className="s1-formel-reihe" aria-hidden="true">
          <span className="s1-f gueltig">gültige Antworten</span><span>=</span><span className="s1-f alle">alle Befragten</span><span>−</span><span className="s1-f fehlend">alle fehlenden Werte</span>
        </div>
        <div className="s1-formel-reihe" aria-hidden="true">
          <span className="s1-f gueltig">3.507</span><span>=</span><span className="s1-f alle">5.246</span><span>−</span><span className="s1-f fehlend">1.739</span>
        </div>
        <p className="s1-formel-klein" aria-hidden="true">Die 1.739 fehlenden Werte sind 20 Datenfehler + 1.647 nicht gefragt + 52 keine Angabe + 20 weiß nicht.</p>
        <span className="sr-only">{ALT.formel}</span>
      </div>
      <Frage>Wie vielen Befragten wurde die Klimafrage dann überhaupt gestellt?</Frage>
      <p>3.599: alle 5.246 minus die 1.647 mit TNZ: SPLIT. Wer KEINE ANGABE oder WEISS NICHT hat, wurde gefragt, hat aber nicht gültig geantwortet. Gültig geantwortet haben davon 3.507. Ob pt03 genauso aufgeteilt ist, legst du in Schritt 1 fest und siehst es erst in Schritt 4.</p>
      <Frage>Was hat das mit der Vertrauensfrage zu tun?</Frage>
      <p>Deine Festlegung in Schritt 1 fragt genau das für <code>pt03</code>: Wem wurde die Frage gestellt? In Schritt 4 tauschst du im Journal die gelbe Variable gegen <code>pt03</code> und liest die Zeilen unter ‚Total valid‘. Bei den Codes 2 bis 6 steht als Wertelabel nur ‚..‘: Das sind Zwischenstufen zwischen GAR KEIN VERTRAUEN (1) und GROSSES VERTRAUEN (7) ohne eigenes Wort.</p>
      <Code k="a3_pt03" />
      <InShort><b>Fehlende Werte</b> haben im ALLBUS negative Codes. <b>TNZ</b> (trifft nicht zu) heißt: Die Frage wurde dieser Person nicht gestellt. <b>Gültige Antworten</b> sind alle Befragten minus alle fehlenden Werte. Nur mit ihnen rechnest du.</InShort>
      <MoreDetail summary="Drei Arten von TNZ">
        <ul>
          <li><b>TNZ: SPLIT</b> (−11): Die Frage stand nur in einer Fassung des Fragebogens. Bei pi08 betrifft das 1.647 Befragte.</li>
          <li><b>TNZ: FILTER</b> (−10): Die Frage wurde nur gestellt, wenn eine frühere Antwort passte. Mit welchen Geräten jemand das Internet nutzt (<code>lm27</code> bis <code>lm34</code>), fragt man nur Menschen, die das Internet nutzen. {`Bei `}<code>lm30</code>{` (Smartphone) haben ${TNZ.lm30Filter} Befragte TNZ: FILTER.`}</li>
          <li><b>TNZ: MODE</b> (−15): Die Frage gab es nur auf einem Erhebungsweg. ‚Nutzen Sie privat das Internet?‘ (<code>xr19</code>){` wurde den ${TNZ.xr19Mode.toLocaleString('de-DE')} Menschen, die online geantwortet haben, nicht gestellt; die Antwort ergibt sich ja aus dem Weg.`}</li>
          <li>Beim Einlesen hat <code>read_spss()</code> alle negativen Codes als fehlend markiert. Darum rechnet R später nur mit den gültigen Antworten. Mehr zu fehlenden Werten in Sitzung 3.</li>
        </ul>
      </MoreDetail>
      <Mixup>Total und Total valid. Die letzte Zeile ‚Total‘ sind alle Befragten, nicht alle Antworten. Wie viele geantwortet haben, steht in ‚Total valid‘.</Mixup>
    </Card>

    <Card id="k3-ergebnis" title="Ergebnis festhalten: wo du was abliest" badge={<Bezug href="#a3-4">zu Schritt 5</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">In Schritt 5 liest du zwei Ausgaben: die von Schritt 3 (<code>rh08b</code>) und die von Schritt 4 (<code>pt03</code>).</p>
      <ul className="v-liste">
        <li><b>Was ein Code bedeutet:</b> In der Zeile mit diesem Value steht rechts das Wertelabel (<a href="#k3-codes">Codes und Wertelabels</a>).</li>
        <li><b>Wie viele Horoskope nicht kennen:</b> Diese Antwort ist ein fehlender Wert. Such sie unter ‚Total valid‘ und lies Spalte N.</li>
        <li><b>Gültige Antworten:</b> die Zeile ‚Total valid‘, nicht ‚Total‘.</li>
        <li><b>Wem die Frage nicht gestellt wurde:</b> die Zeile mit TNZ. KEINE ANGABE heißt dagegen: gefragt, aber nicht geantwortet (<a href="#k3-fehlend">Fehlende Werte</a>).</li>
      </ul>
      <p>Steht bei <code>pt03</code> dieselbe Zahl wie bei <code>rh08b</code>, hast du im Journal noch die alte Variable ausgezählt: Tausch die gelbe Stelle gegen <code>pt03</code>.</p>
    </Card>
  </Abschnitt>;
}

/* ---------- Aufgabe 4 ---------- */
const ursache = (k: string) => CAUSES.find(([b]) => b === k)?.[1] ?? '';

export function Verstehen4() {
  return <Abschnitt id="g4" n={4} titel="Reparieren" frage="Was will R dir mit einer Fehlermeldung sagen?"
    ziel="vier kaputte Zeilen im Lernjournal mit Hilfe der Fehlermeldungen repariert und aus den reparierten Ausgaben je eine Zahl abgelesen."
    weg={[
      ['Schritt 1', '#a4-p', 'Erst festlegen: Was machst du zuerst?', 'k4-lesen'],
      ['Schritt 2 bis 5', '#a4-1', 'im Journal ausführen und reparieren', 'k4-reparieren'],
      ['Schritt 2 bis 5', '#a4-1', 'die häufigsten Meldungen und ihre Ursachen', 'k4-meldungen'],
      ['Schritt 6', '#a4-5', 'Ergebnis festhalten: ablesen nach der Reparatur', 'k4-ergebnis'],
    ]}>

    <Card id="k4-lesen" title="So liest du eine Fehlermeldung" badge={<Bezug href="#a4-p">zu Schritt 1</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Jemand will nach ‚klima‘ suchen und schreibt <code>find_var(allbus, klima)</code>. R antwortet in Rot. Das wirkt erschreckend, ist aber eine Auskunft: Die Meldung sagt, wo und was schiefging, und oft auch, wie du es behebst.</p>
      <ErrorConsole />
      <InShort>Eine <b>Fehlermeldung</b> (Error, Fehler) heißt: R hat aufgehört, es gibt kein Ergebnis. Lies sie von vorn: Wo (welche Funktion)? Was? Der Name in Anführungszeichen oder Backticks zeigt meist die Stelle, die du ändern musst.</InShort>
      <MoreDetail summary="Fehler, Warnung, Hinweis">
        <ul>
          <li><b>Fehler</b> (Error, Fehler): kein Ergebnis. Du musst etwas ändern.</li>
          <li><b>Warnung</b> (Warning, Warnmeldung): Es gibt ein Ergebnis, aber R macht dich auf etwas aufmerksam. Lies sie trotzdem.</li>
          <li><b>Hinweis</b> (Message): Information, etwa ‚No variables found matching …‘ oder die Zeilen beim Laden der Pakete. Kein Fehler.</li>
          <li>Manchmal steht hinter ‚Fehler in‘ eine Hilfsfunktion mit seltsamem Namen wie <code>.process_variables(data, ...)</code>. Dann zählt der Text danach.</li>
          <li>RStudio schreibt die Meldungen meist auf Deutsch, das Lernjournal auf Englisch. ‚Objekt nicht gefunden‘ heißt dort ‚object not found‘.</li>
        </ul>
      </MoreDetail>
      <Mixup>Rot und Fehler. Auch die Meldungen beim Laden der Pakete sind farbig, etwa ‚Attaching core tidyverse packages‘ oder ‚Das folgende Objekt ist maskiert‘. Fehler beginnen mit ‚Fehler‘ oder ‚Error‘.</Mixup>
    </Card>

    <Card id="k4-reparieren" title="Reparieren im Lernjournal" badge={<Bezug href="#a4-1">zu Schritt 2 bis 5</Bezug>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">In jeder der vier Vorlagen steckt genau ein Fehler. Gelbe Stellen gibt es hier nicht: Wo der Fehler steckt, sagt dir die Meldung.</p>
      <Code k="a4_1" />
      <Code k="a4_2" />
      <Code k="a4_3" />
      <Code k="a4_4" />
      <Frage>Wie gehst du bei jeder Vorlage vor?</Frage>
      <ol className="v-liste">
        <li>Mit <b>→ Journal</b> holst du die kaputte Vorlage in dein Lernjournal und führst sie dort aus.</li>
        <li>Unter dem Block steht die Meldung. Lies sie: Wo, was, welcher Name?</li>
        <li>Du reparierst die Zeile im Journal und führst den Block noch einmal aus. Läuft er ohne Fehler, ist der Schritt erledigt.</li>
      </ol>
      <Frage>Woher weißt du, was die Zeile eigentlich tun soll?</Frage>
      <p>Aus der Kommentarzeile darüber, und aus Aufgabe 2 und 3: <code>find_var()</code> sucht mit einem Suchwort in Anführungszeichen, <code>frequency()</code> zählt eine Variable aus, deren Name klein und ohne Anführungszeichen steht. Vergleiche jede kaputte Zeile mit diesen Vorlagen.</p>
      <InShort>Erst lesen, dann ändern: Die Meldung zeigt, wo der Fehler steckt. Repariert wird dein Block im Journal; die Vorlage in der Aufgabe bleibt, wie sie war.</InShort>
    </Card>

    <Card id="k4-meldungen" title="Die häufigsten Meldungen" badge={<Bezug href="#a4-1">zu Schritt 2 bis 5</Bezug>} tag={{ kind: 'interpret', label: 'Hintergrund' }}>
      <p className="lead">Die meisten Fehler am Anfang sind Tippfehler. Hier stehen sieben Meldungen mit ihrer Ursache und dem, was hilft.</p>
      <ul className="v-liste">{ERROR_CASES.map((c, i) => <li key={i}>
        <code>{c.code}</code> → {c.only ? 'nur im Lernjournal: ' : ''}<code>{c.message}</code>{c.en ? <>{' (im Lernjournal: '}<code>{c.en}</code>{')'}</> : null}{c.note ? <>{'. '}{withCode(c.note)}</> : null}
        <br /><b>Ursache:</b> {ursache(c.target)}. <b>Das hilft:</b> {withCode(c.right)}
      </li>)}</ul>
      <p className="hilfe-zeile">RStudio schreibt die Meldungen deutsch, das Lernjournal englisch (in Klammern). ‚unexpected end of input‘ gibt es nur im Lernjournal; RStudio wartet mit <code>+</code>, beim Ausführen der ganzen Datei mit Source meldet es ‚unerwartetes Ende der Eingabe‘.</p>
      <InShort>Die meisten Fehlermeldungen am Anfang haben eine von sechs Ursachen: vertippter Funktionsname, falsch geschriebener Name, fehlende Anführungszeichen, fehlende Klammer, Datei am falschen Ort, Paket nicht installiert.</InShort>
      <MoreDetail summary="Wenn die Konsole + zeigt">
        <p>Steht in der RStudio-Konsole am Anfang ein <code>+</code> statt <code>&gt;</code>, wartet R auf den Rest einer Zeile, meist auf eine Klammer oder ein Anführungszeichen. Drück Esc, reparier die Zeile im Skript und führ sie neu aus. Ein vergessenes Komma zwischen zwei Argumenten meldet R als ‚unerwartete Zeichenkettenkonstante‘ (unexpected string constant).</p>
      </MoreDetail>
      <Mixup>Variablenname und Suchwort. Bei <code>frequency(allbus, pi08)</code> steht der Variablenname ohne Anführungszeichen, bei <code>find_var(allbus, "klima")</code> das Suchwort mit.</Mixup>
    </Card>

    <Card id="k4-ergebnis" title="Ergebnis festhalten: ablesen nach der Reparatur" badge={<Bezug href="#a4-5">zu Schritt 6</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">Die Zahlen in Schritt 6 stehen erst in der Ausgabe, wenn die Zeile repariert ist. Vorher gibt es nur die Meldung.</p>
      <ul className="v-liste">
        <li><b>Bei <code>frequency()</code>:</b> Such die Zeile mit dem gefragten Code oder Wertelabel und lies Spalte N. Fehlende Werte stehen unter ‚Total valid‘ (<a href="#k3-codes">Codes und Wertelabels</a>).</li>
        <li><b>Bei <code>find_var()</code>:</b> Zähl die Treffer, also die Zeilen der Ausgabe.</li>
        <li><b>Die Frage zur RStudio-Konsole:</b> Was ein <code>+</code> am Zeilenanfang heißt, steht in <a href="#k4-meldungen">Die häufigsten Meldungen</a> unter „Wenn die Konsole + zeigt“.</li>
      </ul>
    </Card>
  </Abschnitt>;
}

/* ---------- Überblick ---------- */
const werkzeug = (k: string) => TOOLS.find(([id]) => id === k)?.[1] ?? '';

export function Ueberblick() {
  return <section className="grund-block" id="g5" aria-labelledby="g5-h">
    <div className="g-kopf">
      <span className="st m c7" aria-hidden="true">✓</span>
      <div><div className="ueber">Überblick über alle Aufgaben</div><h4 id="g5-h">Vom Rechner bis zur passenden Variable</h4></div>
    </div>
    <p className="g-intro">Alle vier Aufgaben zusammen: welcher Schritt wann dran ist und was dafür stimmen muss.</p>
    <HeadingLevel.Provider value={5}>
      <Card id="ue" title="Welches Werkzeug für welche Frage?" badge={<Badge>Aufgabe 1 bis 4</Badge>} tag={{ kind: 'interpret', label: 'Hintergrund' }}>
        <RoutePicture />
        <Frage>Welches Werkzeug nimmst du wann?</Frage>
        <ul className="v-liste">{TOOL_QUESTIONS.map((q, i) => <li key={i}>{withCode(q.question)} <b>{`→ ${werkzeug(q.target)}`}</b>. {withCode(q.why)}</li>)}</ul>
        <InShort>Erst die Datei an den richtigen Ort, dann der Startblock, dann suchen, dann lesen, dann entscheiden. Bei jedem Schritt kann R sich beschweren; die Meldung sagt dir, wo.</InShort>
        <div className="box-gruen">
          <h6>Voraussetzungen: Was jeder Schritt braucht und wo er täuschen kann</h6>
          <table className="daten voll">
            <caption className="sr-only">Voraussetzungen je Schritt</caption>
            <thead><tr><th scope="col">Schritt</th><th scope="col">braucht</th><th scope="col">Vorsicht</th></tr></thead>
            <tbody>
              <tr><td>Pakete laden: <code>library()</code></td><td>einmal <code>install.packages()</code></td><td>in jeder neuen R-Sitzung neu laden; erst tidyverse, dann mariposa</td></tr>
              <tr><td>Einlesen: <code>read_spss()</code></td><td>die Datei im Projektordner, Name genau so</td><td>sonst <code>file.choose()</code>; die Datei nicht weitergeben (GESIS)</td></tr>
              <tr><td>Suchen: <code>find_var()</code></td><td>Suchwort in Anführungszeichen, kurzer Wortanfang, ae/oe/ue</td><td>kein Treffer heißt nicht „gibt es nicht“; ein Treffer heißt nicht „passt“</td></tr>
              <tr><td>Lesen: <code>frequency()</code>, <code>codebook()</code></td><td>Variablenname genau, klein, ohne Anführungszeichen</td><td>Total ist nicht Total valid; TNZ heißt: nicht gefragt; Zahlen sind ungewichtet</td></tr>
            </tbody>
          </table>
          <p className="box-notiz">Für alle gilt: Das Variablenlabel ist eine Kurzfassung. Ob eine Variable deine Idee misst (ihre <b>Gültigkeit</b>, <a href="#k2-passt">Aufgabe 2</a>), entscheidest du mit Label, Wertelabels und notfalls dem Fragebogen.</p>
        </div>
        <Mixup>Eine Variable finden und eine Variable verstehen. <code>find_var()</code> sagt dir, dass es eine Variable gibt. Erst <code>frequency()</code> oder das Codebuch zeigt, wem sie gestellt wurde und was ihre Stufen bedeuten.</Mixup>
      </Card>
    </HeadingLevel.Provider>
  </section>;
}

/* ---------- Themen für den Reiter „Verstehen“ (Reihenfolge, Karten für die rechte Leiste) ---------- */
export const THEMEN: Thema[] = [
  { id: 'vorweg', n: 'R', kurz: 'R lesen', titel: 'Vorweg: R lesen', minuten: 10, Inhalt: Vorweg,
    karten: [['r1', 'Eine Zeile R lesen'], ['r2', 'Vorlage, Lernjournal, Konsole']] },
  { id: 'g1', n: '1', kurz: 'Aufgabe 1', titel: 'Startklar', minuten: 15, Inhalt: Verstehen1, aufgabe: 1,
    karten: [['k1-allbus', 'ALLBUS und GESIS'], ['k1-datei', 'Deine Datei bleibt bei dir'], ['k1-dim', 'Wie groß ist der ALLBUS?'], ['k1-rechnen', 'R rechnet'], ['k1-fenster', 'Vier Fenster'], ['k1-projekt', 'Ein Projekt'], ['k1-pakete', 'Pakete'], ['k1-ergebnis', 'Ergebnis festhalten']] },
  { id: 'g2', n: '2', kurz: 'Aufgabe 2', titel: 'Schon gefragt?', minuten: 10, Inhalt: Verstehen2, aufgabe: 2,
    karten: [['k2-label', 'Name und Variablenlabel'], ['k2-suchen', 'Suchen mit find_var()'], ['k2-anders', 'Kein Treffer? Anders suchen'], ['k2-passt', 'Ein Treffer ist ein Kandidat'], ['k2-ergebnis', 'Lesen und entscheiden']] },
  { id: 'g3', n: '3', kurz: 'Aufgabe 3', titel: 'Belegen', minuten: 12, Inhalt: Verstehen3, aufgabe: 3,
    karten: [['k3-codebuch', 'Das Codebuch'], ['k3-codes', 'Codes und Wertelabels'], ['k3-fehlend', 'Fehlende Werte'], ['k3-ergebnis', 'Ergebnis festhalten']] },
  { id: 'g4', n: '4', kurz: 'Aufgabe 4', titel: 'Reparieren', minuten: 8, Inhalt: Verstehen4, aufgabe: 4,
    karten: [['k4-lesen', 'Eine Fehlermeldung lesen'], ['k4-reparieren', 'Reparieren im Journal'], ['k4-meldungen', 'Die häufigsten Meldungen'], ['k4-ergebnis', 'Ergebnis festhalten']] },
  { id: 'g5', n: '✓', kurz: 'Überblick', titel: 'Vom Rechner bis zur passenden Variable', minuten: 5, Inhalt: Ueberblick,
    karten: [['ue', 'Welches Werkzeug für welche Frage?']] },
];
