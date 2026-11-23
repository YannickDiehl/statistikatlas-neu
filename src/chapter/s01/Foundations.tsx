// Sitzung 1 „Einstieg“: die vier Grundlagen und der Überblick, ohne Code-Werkstatt.
import { Card, InShort, Known, Mixup, MoreDetail, Tag } from '../blocks/Card';
import { MapLink } from '../blocks/MapLink';
import { Foundation } from '../blocks/Foundation';
import { Questions } from '../blocks/Questions';
import { ALT, EAST, G1_PAKETE, G1_PROJEKT, G1_SKRIPT, G2_SPORT, G3_GEFRAGT, TNZ } from './content';
import { FrequencyTable } from './figures/FrequencyTable';
import { MessageSorter, ToolAssignment } from './figures/Match';
import { ErrorConsole, FindVarPicture, ProjectPicture, RoutePicture } from './figures/Pictures';
import { RStudioPanes } from './figures/RStudioPanes';
import { SearchLab } from './figures/SearchLab';

const Ia = () => <Known label="kennst du aus Methoden Ia" />;

/** Grundlage 1: R, RStudio und deine Datei (1a Fenster, 1b ALLBUS, 1c Projekt, 1d Pakete). */
export function Foundation1() {
  return <Foundation id="g1" n={1} title="R, RStudio und deine Datei" taskHref="#a1"
    intro="Was brauchst du, damit R mit dem ALLBUS rechnet? Vier kurze Schritte, etwa 15 Minuten.">

    <Card id="g1a" step="1a" title="Vier Fenster: R und RStudio" tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Im Sommer hast du 30 Blobs mit Strichliste und Taschenrechner ausgezählt: eine Variable, 30 Werte. <Ia /> Der ALLBUS hat einige tausend Befragte und mehrere hundert Variablen. Von Hand geht das nicht mehr, dafür nimmst du <b>R</b>. R ist die Sprache, die rechnet. <b>RStudio</b> ist das Programm, in dem du mit R arbeitest. Es hat vier Fenster. Wähl ein Fenster und lies, wofür es da ist.</p>
      <RStudioPanes />
      <div className="kurzueberlegen">
        <p>Kurz überlegen</p>
        <Questions id="g1-skript-q" questions={[G1_SKRIPT]} />
      </div>
      <InShort><b>R</b> ist die Sprache, die rechnet. <b>RStudio</b> ist das Programm drumherum, eine sogenannte Entwicklungsumgebung. Im <b>Skript</b> schreibst du, in der <b>Konsole</b> antwortet R, im <b>Environment</b> siehst du deine Objekte.</InShort>
      <MoreDetail summary="Anordnung und Screenreader">
        <ul>
          <li>Die Fenster können bei dir anders angeordnet sein. Die Namen in den Kopfzeilen bleiben gleich.</li>
          <li>Mit Screenreader: Unter Tools → Global Options → Accessibility schaltest du die Unterstützung für Screenreader ein. Das Environment ist mit Screenreader mühsam; die Zahl der Befragten und Variablen bekommst du auch mit <code>dim(allbus)</code> als Text (<a href="#a1">Aufgabe 1</a>).</li>
          <li>Installiert hast du R und RStudio im Seminar: erst R von cran.r-project.org, dann RStudio Desktop von posit.co. Hakt es noch, hilft der Setup-Guide in ILIAS.</li>
        </ul>
      </MoreDetail>
      <Mixup>R und RStudio sind zwei Programme. RStudio braucht R, nicht umgekehrt. Deshalb installierst du zuerst R, dann RStudio. Arbeiten tust du immer in RStudio.</Mixup>
    </Card>

    <Card id="g1b" step="1b" title="Woher die Datei kommt: ALLBUS und GESIS" tag={{ kind: 'interpret', label: 'Steckbrief' }}>
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
      <p className="absatz">Die Datei bekommst du bei GESIS: kostenlos registrieren, nach ZA8831 suchen, die SPSS-Datei (.sav) herunterladen. Die Nutzung ist an dich gebunden: Gib die Datei nicht weiter und lade sie nirgends hoch. Deshalb liefert auch der Atlas keine Daten mit; du lädst deine eigene Datei (<a href="#a1">Aufgabe 1</a>).</p>
      <InShort>Der <b>ALLBUS</b> ist eine wiederholte Bevölkerungsumfrage. Die Datei enthält für jede befragte Person eine <b>Zeile</b> und für jede Frage eine <b>Variable</b> (Spalte). Ein Datensatz, den andere erhoben haben und den du auswertest, heißt <b>Sekundärdaten</b>.</InShort>
      <MoreDetail summary="Warum Zahlen hier ungewichtet sind">
        <p>Weil der Osten absichtlich stärker vertreten ist, sprechen einfache Zählungen nicht direkt für ganz Deutschland. Dafür gibt es eine <b>Gewichtung</b>; sie ist Thema in Sitzung 6. Bis dahin sind alle Zahlen im Lernpfad ungewichtet, also einfach gezählt. Für die Fragen dieser Sitzung (Wer wurde was gefragt? Wie viele haben geantwortet?) ist das genau richtig.</p>
      </MoreDetail>
      <Mixup>Befragte und Bevölkerung. Der ALLBUS befragt einige tausend Menschen, nicht alle in Deutschland. Was in der Datei steht, gilt zuerst für die Befragten. Wie man daraus auf alle schließt, kommt im Lauf des Semesters.</Mixup>
    </Card>

    <Card id="g1c" step="1c" title="Ein Projekt für das ganze Semester" tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Dein Skript sagt <code>read_spss("ZA8831_v1-3-0.sav")</code>. Aber wo soll R nach dieser Datei suchen? R schaut in genau einem Ordner nach, dem <b>Arbeitsordner</b>. Ein <b>RStudio-Projekt</b> macht einen Ordner zu deinem Arbeitsordner, jedes Mal, wenn du das Projekt öffnest.</p>
      <ProjectPicture />
      <p className="absatz"><b>So legst du das Projekt an:</b></p>
      <ol className="s1-liste">
        <li>In RStudio: File → New Project … → New Directory → New Project.</li>
        <li>Gib einen Namen (zum Beispiel <code>methoden-ib</code>) und einen Ort an, den du wiederfindest. Create Project.</li>
        <li>Verschieb die heruntergeladene Datei <code>ZA8831_v1-3-0.sav</code> in diesen Ordner. Unten rechts unter Files siehst du sie dann.</li>
        <li>Leg ein Skript an (File → New File → R Script) und speichere es im selben Ordner, etwa als <code>sitzung1.R</code>.</li>
        <li>Ab jetzt öffnest du RStudio über dein Projekt: Doppelklick auf <code>methoden-ib.Rproj</code> oder in RStudio über File → Open Project.</li>
      </ol>
      <div className="kurzueberlegen">
        <p>Kurz überlegen</p>
        <Questions id="g1-projekt-q" questions={[G1_PROJEKT]} />
      </div>
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

    <Card id="g1d" step="1d" title="Pakete: einmal installieren, jedes Mal laden" tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead"><code>read_spss()</code> und <code>find_var()</code> gehören nicht zu R selbst. Sie stecken im <b>Paket</b> mariposa, das für diesen Kurs geschrieben ist. Ein Paket ist wie eine Werkzeugkiste: Du besorgst sie einmal und holst sie dann jedes Mal hervor, wenn du sie brauchst.</p>
      <div className="lesehilfe s1-pakete" role="img" aria-label={ALT.pakete}>
        <span><b style={{ background: 'var(--gruenh)' }}>install.packages("mariposa")</b><small>einmal: besorgen (aus dem Internet installieren)</small></span>
        <span><b style={{ background: 'var(--gruenh)' }}>library(mariposa)</b><small>jedes Mal: hervorholen (für diese Sitzung laden)</small></span>
      </div>
      <p className="hilfe-zeile">Bei <code>install.packages()</code> stehen Anführungszeichen, weil der Name hier ein Text ist.</p>
      <div className="kurzueberlegen">
        <p>Kurz überlegen</p>
        <Questions id="g1-pakete-q" questions={[G1_PAKETE]} />
      </div>
      <InShort>Ein <b>Paket</b> bringt Funktionen mit. <code>install.packages()</code> installiert es einmal pro Rechner, <code>library()</code> lädt es in jeder Sitzung. Wir laden immer zuerst <code>tidyverse</code>, dann <code>mariposa</code>.</InShort>
      <MoreDetail summary="das tidyverse und fehlende Pakete">
        <p>Das tidyverse ist eine Sammlung vieler Pakete; daraus brauchst du ab Sitzung 2 etwa die Pipe <code>%&gt;%</code> und <code>filter()</code>. Fehlt ein Paket, meldet R ‚es gibt kein Paket namens …‘ (englisch: there is no package called …). Dann einmal <code>install.packages("…")</code> mit diesem Namen ausführen. In der Code-Werkstatt sind alle Pakete schon da.</p>
      </MoreDetail>
      <Mixup>Bei <code>install.packages("mariposa")</code> stehen Anführungszeichen, bei <code>library(mariposa)</code> braucht es keine. Beides funktioniert nur so, wie es in der Vorlage steht.</Mixup>
    </Card>
  </Foundation>;
}

/** Grundlage 2: Variablen finden (2a Name und Variablenlabel, 2b find_var() mit Suchwort-Labor). */
export function Foundation2() {
  return <Foundation id="g2" n={2} title="Variablen finden" taskHref="#a2"
    intro="Wie findest du unter Hunderten Variablen die eine, die zu deiner Frage passt? Etwa 10 Minuten.">

    <Card id="g2a" step="2a" title="Name und Variablenlabel" badge={<Known what="Variable" label="kennst du aus Methoden Ia" />}>
      <p className="lead">Der ALLBUS fragt, wie oft Menschen Bücher lesen. In der Datei heißt diese Variable <code>la01</code>. Daneben steht eine kurze Beschreibung: FREIZEIT: BUECHER LESEN.</p>
      <p className="absatz">Jede Variable hat zwei Kennzeichen:</p>
      <ul className="s1-liste">
        <li>den <b>Variablennamen</b>, kurz und ohne Leerzeichen, etwa <code>la01</code>. Mit ihm sprichst du die Variable in R an.</li>
        <li>das <b>Variablenlabel</b>, eine kurze Beschreibung der Frage, etwa FREIZEIT: BUECHER LESEN.</li>
      </ul>
      <p className="absatz">Die Variablenlabels im ALLBUS stehen in GROSSBUCHSTABEN, ohne Umlaute (ü wird UE) und oft abgekürzt. Variablen, die zusammengehören, haben oft ähnliche Namen: <code>lm27</code> bis <code>lm34</code> fragen alle, mit welchen Geräten jemand das Internet nutzt.</p>
      <InShort>Der <b>Variablenname</b> ist der Rufname in R (<code>la01</code>). Das <b>Variablenlabel</b> beschreibt kurz, was gefragt wurde (FREIZEIT: BUECHER LESEN).</InShort>
      <MoreDetail summary="Wo steht die ganze Frage?">
        <p>Das Variablenlabel ist eine Kurzfassung. Den genauen Wortlaut der Frage findest du im Fragebogen und im Variablenbericht zum ALLBUS 2023 bei GESIS (Suche nach ZA8831). Für die Suche in R reicht das Variablenlabel.</p>
      </MoreDetail>
      <Mixup>Variablenlabel und Frage. FREIZEIT: BUECHER LESEN ist nicht der Fragetext. Ob gefragt wurde ‚Wie oft lesen Sie Bücher?‘ oder ‚Lesen Sie gern?‘, zeigt erst der Fragebogen; die Antwortmöglichkeiten zeigt das Codebuch (<a href="#thema3">Thema 3</a>).</Mixup>
    </Card>

    <Card id="g2b" step="2b" title={<>Suchen mit <code>find_var()</code></>} badge={<Tag kind="adapt" label="Ausprobieren" />} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead"><code>find_var(allbus, "buecher")</code> sucht in allen Variablennamen und Variablenlabels nach dem Wortteil ‚buecher‘ und findet <code>la01</code>. Probier verschiedene Suchwörter aus; die Ergebnisse stammen aus dem ALLBUS 2023.</p>
      <FindVarPicture />
      <h6 className="zwischen">Suchwort-Labor</h6>
      <p className="unter-zwischen">Wähl ein Suchwort und lies, was R antwortet. <code>col</code> zeigt, an welcher Stelle die Variable im Datensatz steht.</p>
      <SearchLab />
      <div className="kurzueberlegen">
        <p>Kurz überlegen</p>
        <Questions id="g2-sport-q" questions={[G2_SPORT]} />
      </div>
      <InShort><code>find_var()</code> sucht ein Wort oder einen Wortteil in Variablennamen und Variablenlabels. <b>Kein Treffer</b> heißt nicht ‚gibt es nicht‘: Probier ae, oe, ue statt ä, ö, ü, einen kürzeren Wortanfang oder ein anderes Wort. <b>Ein Treffer</b> heißt nicht ‚passt‘: Lies das Variablenlabel.</InShort>
      <MoreDetail summary="Wie find_var() sucht">
        <ul>
          <li>Das erste Argument ist der Datensatz (<code>allbus</code>, ohne Anführungszeichen), das zweite das Suchwort (in Anführungszeichen).</li>
          <li>Gefunden wird jedes Label, in dem das Suchwort irgendwo vorkommt, auch mitten in einem Wort. Ein kurzer Wortanfang wie ‚fernseh‘ findet FERNSEHER und FERNSEHEN.</li>
          <li>Mit dem Argument <code>search</code> kannst du die Suche einschränken: <code>search = "name"</code> sucht nur in den Namen, <code>search = "label"</code> nur in den Labels. Voreingestellt ist beides.</li>
          <li>Findet <code>find_var()</code> nichts, schreibt R: No variables found matching … Das ist ein Hinweis, kein Fehler.</li>
          <li>Mehr im R-Workshop, Abschnitt 4.4.1 <code>find_var()</code>.</li>
        </ul>
      </MoreDetail>
      <Mixup>Kein Treffer und keine Frage. ‚bücher‘ findet nichts, ‚buecher‘ findet la01. Bevor du sagst ‚Der ALLBUS fragt das nicht‘, probier mindestens zwei, drei Suchwörter.</Mixup>
      <MapLink concept="codebook" className="absatz">Codebuch und Variablensuche</MapLink>
    </Card>
  </Foundation>;
}

/** Grundlage 3: Codebuch und erster Blick (3a Codes und Wertelabels, 3b fehlende Werte). */
export function Foundation3() {
  return <Foundation id="g3" n={3} title="Codebuch und erster Blick" taskHref="#a3"
    intro="Was genau misst eine Variable, und wer hat darauf geantwortet? Etwa 12 Minuten.">

    <Card id="g3a" step="3a" title="Codes und Wertelabels" badge={<Known what="Wert" label="kennst du aus Methoden Ia" />} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Die Klimafrage <code>pi08</code> (MEINUNG UEBER DEN KLIMAWANDEL) hat vier Antwortmöglichkeiten. Im Datensatz steht aber kein Wort, sondern eine Zahl, ein <b>Code</b>: 1 für ‚keine Klimaänderung‘, 4 für ‚menschliche Ursachen‘. Das Wort zum Code heißt <b>Wertelabel</b>. So sieht die Variable aus, wenn R sie auszählt:</p>
      <FrequencyTable />
      <p className="absatz">Die Prozent-Spalten (Raw %, Valid %, Cum. %) und die Kennzahlen in der Kopfzeile (mean, sd, skewness) schauen wir uns in Sitzung 3 und 4 genauer an. Heute zählen Codes, Wertelabels und N.</p>
      <InShort>Ein <b>Code</b> ist die Zahl im Datensatz, ein <b>Wertelabel</b> das Wort dazu. Das <b>Variablenlabel</b> beschreibt die ganze Variable. Alle Antwortmöglichkeiten zusammen heißen <b>Ausprägungen</b>.</InShort>
      <MoreDetail summary="Codebuch und frequency()">
        <ul>
          <li>Das <b>Codebuch</b> listet für jede Variable Name, Variablenlabel, Codes mit Wertelabels und wie oft jeder Code vorkommt. In RStudio öffnet <code>codebook(allbus)</code> das ganze Codebuch im Viewer (unten rechts). Mit dem Symbol ‚Show in new window‘ öffnest du es im Browser und suchst mit Strg + F (Mac: Cmd + F) nach einem Variablennamen.</li>
          <li><code>frequency(allbus, pi08)</code> zeigt dasselbe für eine einzelne Variable als Tabelle, wie oben. Das ist dein <b>erster Blick</b> auf eine Variable: Welche Codes gibt es, was heißen sie, wie viele haben geantwortet? Ausführlich kommt <code>frequency()</code> in Sitzung 3.</li>
          <li>Mit einem Variablennamen schlägt <code>codebook(allbus, pi08)</code> nur diese eine Variable nach. Die Werkstatt hier im Browser kann den Viewer nicht öffnen und zeigt den Eintrag als Text, aber ohne die Zahl der gültigen Antworten. Darum nimmst du in dieser Sitzung <code>frequency()</code>: Dort stehen die gültigen Antworten als eigene Zeile. Das Nachschlagen mit <code>codebook()</code> übst du in Sitzung 2.</li>
          <li>Mehr im R-Workshop, Abschnitt 4.4.2 <code>codebook()</code>.</li>
        </ul>
      </MoreDetail>
      <Mixup>Code und Menge. Code 4 heißt nicht ‚vier Personen‘ oder ‚viermal so stark‘. Die 4 ist nur die Nummer der Antwort MENSCHL. URSACHEN. Wie viele so geantwortet haben, steht in Spalte N.</Mixup>
    </Card>

    <Card id="g3b" step="3b" title="Fehlende Werte: wer nicht geantwortet hat und wer gar nicht gefragt wurde" tag={{ kind: 'picture', label: 'Formel lesen' }}>
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
      <div className="kurzueberlegen">
        <p>Kurz überlegen</p>
        <Questions id="g3-gefragt-q" questions={[G3_GEFRAGT]} />
      </div>
      <InShort><b>Fehlende Werte</b> haben im ALLBUS negative Codes. <b>TNZ</b> (trifft nicht zu) heißt: Die Frage wurde dieser Person nicht gestellt. <b>Gültige Antworten</b> sind alle Befragten minus alle fehlenden Werte. Nur mit ihnen rechnest du.</InShort>
      <MoreDetail summary="Drei Arten von TNZ">
        <ul>
          <li><b>TNZ: SPLIT</b> (−11): Die Frage stand nur in einer Fassung des Fragebogens. Bei pi08 betrifft das 1.647 Befragte.</li>
          <li><b>TNZ: FILTER</b> (−10): Die Frage wurde nur gestellt, wenn eine frühere Antwort passte. Mit welchen Geräten jemand das Internet nutzt (<code>lm27</code> bis <code>lm34</code>), fragt man nur Menschen, die das Internet nutzen. {`Bei `}<code>lm30</code>{` (Smartphone) haben ${TNZ.lm30Filter} Befragte TNZ: FILTER.`}</li>
          <li><b>TNZ: MODE</b> (−15): Die Frage gab es nur auf einem Erhebungsweg. ‚Nutzen Sie privat das Internet?‘ (<code>xr19</code>){` wurde den ${TNZ.xr19Mode.toLocaleString('de-DE')} Menschen, die online geantwortet haben, nicht gestellt; die Antwort ergibt sich ja aus dem Weg.`}</li>
          <li>Beim Einlesen hat <code>read_spss()</code> alle negativen Codes als fehlend markiert. Darum rechnet R später nur mit den gültigen Antworten. Mehr zu fehlenden Werten in Sitzung 3.</li>
        </ul>
      </MoreDetail>
      <Mixup>Total und Total valid. Die letzte Zeile ‚Total 5246‘ sind alle Befragten, nicht alle Antworten. Wie viele geantwortet haben, steht in ‚Total valid‘.</Mixup>
    </Card>
  </Foundation>;
}

/** Grundlage 4: Fehlermeldungen lesen (4a eine Meldung lesen, 4b Meldungs-Sortierer). */
export function Foundation4() {
  return <Foundation id="g4" n={4} title="Fehlermeldungen lesen" taskHref="#a4"
    intro="Was will R dir mit einer roten Meldung sagen? Etwa 8 Minuten.">

    <Card id="g4a" step="4a" title="So liest du eine Fehlermeldung" tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Jemand will nach ‚klima‘ suchen und schreibt <code>find_var(allbus, klima)</code>. R antwortet in Rot. Das wirkt erschreckend, ist aber eine Auskunft: Die Meldung sagt, wo und was schiefging, und oft auch, wie du es behebst.</p>
      <ErrorConsole />
      <InShort>Eine <b>Fehlermeldung</b> (Error, Fehler) heißt: R hat aufgehört, es gibt kein Ergebnis. Lies sie von vorn: Wo (welche Funktion)? Was? Der Name in Anführungszeichen oder Backticks zeigt meist die Stelle, die du ändern musst.</InShort>
      <MoreDetail summary="Fehler, Warnung, Hinweis">
        <ul>
          <li><b>Fehler</b> (Error, Fehler): kein Ergebnis. Du musst etwas ändern.</li>
          <li><b>Warnung</b> (Warning, Warnmeldung): Es gibt ein Ergebnis, aber R macht dich auf etwas aufmerksam. Lies sie trotzdem.</li>
          <li><b>Hinweis</b> (Message): Information, etwa ‚No variables found matching …‘ oder die Zeilen beim Laden der Pakete. Kein Fehler.</li>
          <li>Manchmal steht hinter ‚Fehler in‘ eine Hilfsfunktion mit seltsamem Namen wie <code>.process_variables(data, ...)</code>. Dann zählt der Text danach.</li>
          <li>RStudio schreibt die Meldungen meist auf Deutsch, die Werkstatt auf Englisch. ‚Objekt nicht gefunden‘ heißt dort ‚object not found‘.</li>
        </ul>
      </MoreDetail>
      <Mixup>Rot und Fehler. Auch die Meldungen beim Laden der Pakete sind farbig, etwa ‚Attaching core tidyverse packages‘ oder ‚Das folgende Objekt ist maskiert‘. Fehler beginnen mit ‚Fehler‘ oder ‚Error‘.</Mixup>
    </Card>

    <Card id="g4b" step="4b" title="Die häufigsten Meldungen" tag={{ kind: 'estimate', label: 'Zuordnen' }}>
      <p className="lead">Die meisten Fehler am Anfang sind Tippfehler. Sieben Meldungen, sechs Ursachen: Ordne jeder Meldung ihre Ursache zu.</p>
      <MessageSorter />
      <p className="hilfe-zeile">Meldungen 1, 2 und 7 stehen so in RStudio; die Werkstatt schreibt sie englisch (in Klammern). Meldung 5 gibt es nur in der Werkstatt; RStudio wartet mit <code>+</code>, beim Ausführen der ganzen Datei mit Source meldet es ‚unerwartetes Ende der Eingabe‘.</p>
      <InShort>Die meisten Fehlermeldungen am Anfang haben eine von sechs Ursachen: vertippter Funktionsname, falsch geschriebener Name, fehlende Anführungszeichen, fehlende Klammer, Datei am falschen Ort, Paket nicht installiert.</InShort>
      <MoreDetail summary="Wenn die Konsole + zeigt">
        <p>Steht in der RStudio-Konsole am Anfang ein <code>+</code> statt <code>&gt;</code>, wartet R auf den Rest einer Zeile, meist auf eine Klammer oder ein Anführungszeichen. Drück Esc, reparier die Zeile im Skript und führ sie neu aus. Ein vergessenes Komma zwischen zwei Argumenten meldet R als ‚unerwartete Zeichenkettenkonstante‘ (unexpected string constant).</p>
      </MoreDetail>
      <Mixup>Variablenname und Suchwort. Bei <code>frequency(allbus, pi08)</code> steht der Variablenname ohne Anführungszeichen, bei <code>find_var(allbus, "klima")</code> das Suchwort mit.</Mixup>
    </Card>
  </Foundation>;
}

/** Überblick: vom Rechner bis zur passenden Variable (Weg, Werkzeug zuordnen, Voraussetzungen). */
export function Overview() {
  return <Foundation id="g5" n="✓" title="Vom Rechner bis zur passenden Variable" eyebrow="Überblick zu allen Aufgaben"
    intro="Alle vier Themen zusammen: welcher Schritt wann dran ist und was dafür stimmen muss.">
    <Card id="ue" step="✓" title="Welches Werkzeug für welche Frage?" tag={{ kind: 'estimate', label: 'Zuordnen' }}>
      <RoutePicture />
      <ToolAssignment />
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
        <p className="box-notiz">Für alle gilt: Das Variablenlabel ist eine Kurzfassung. Ob eine Variable deine Idee misst (ihre <b>Gültigkeit</b>, <a href="#a2">Aufgabe 2</a>), entscheidest du mit Label, Wertelabels und notfalls dem Fragebogen.</p>
      </div>
      <Mixup>Eine Variable finden und eine Variable verstehen. <code>find_var()</code> sagt dir, dass es pt03 gibt. Erst <code>frequency()</code> oder das Codebuch zeigt, dass nur gut zwei Drittel gefragt wurden und was die sieben Stufen bedeuten.</Mixup>
    </Card>
  </Foundation>;
}
