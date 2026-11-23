# Sitzung 1 „Einstieg“: Inhaltsplan für das Kapitel

Stand: 23.11.2026. Teil B des Rollouts (`docs/entwicklung/plaene/2026-11-23-lernpfad-kapitel-rollout.md`, Task 1), gebaut nach dem Muster von `prototyp/sitzung4.html` und Design §5, Variante B.
Quellen: `src/domain/curriculum.ts` (id 1), alte Aufgabe `src/tasks/s01-schon-gefragt/`, Konzept `2026-09-29-lernpfad-aufgaben/sitzung-01.md`, Folien `Seminarvorbereitung/Sitzung 1/Sitzung1_Folien.pptx`, Leitfaden `docs/AUFGABEN-LEITFADEN.md`, Sitzungsplan WiSe 24/25 (Sitzung 1: Einführung, RStudio als IDE).

**Daten:** ALLBUS 2023, ZA8831 v1.3.0, ungewichtet, nur Aggregate. Jede Zahl unten ist in `sitzung01-zahlen.R` mit `stopifnot()` gegen die Datei geprüft (Rscript läuft ohne Fehler, Ende „Alle Zahlen geprüft.“). mariposa 0.7.4, tidyverse 2.0.0, R 4.6.2.

**Besonderheit dieser Sitzung:** Hier wird der Lernpfad freigeschaltet (Aufgabe 1, Schritt 1 „Deine ALLBUS-Datei laden“), und hier werden die Code-Werkstatt (Vorweg R2) und das Lesen einer R-Zeile (Vorweg R1) eingeführt. Spätere Kapitel erinnern nur daran. Die Bildsprache Bauplatte/Turm/Stein beginnt erst in Sitzung 2 und kommt hier nicht vor. Die Studierenden hatten die Sitzung schon im Seminar; das Kapitel dient vor allem zum Nachholen und Wiederholen, ist aber wie jedes Kapitel für eine Arbeitsphase von etwa 45 Minuten gebaut.

**Schreibweise in diesem Dokument:** `⟦…⟧` markiert in Vorlagen die Stelle, die angepasst wird (wie in Sitzung 4); der Inhalt zwischen den Klammern steht so in der Vorlage. „copy-only“ heißt: Werkstatt nur zum Lesen und Kopieren (`live = false`), weil der Code nur in RStudio sinnvoll ist.

---

## 0 Kopf

- **Stein:** 1, Kapitelfarbe wie im Atlas für Sitzung 1.
- **Titel:** Einstieg
- **Begleitfigur** `hallo.svg` **mit Leitfrage:** „Wie kommt der ALLBUS in R, und wie findest du darin die Frage, die dich interessiert?“
  (Die kurze Frage in `curriculum.ts`, „Wie kommen die Daten auf meinen Rechner?“, kann für die Sitzungsliste bleiben; siehe Entscheidung E10.)

**Wegweiser** (drei Felder wie in Sitzung 4):
1. **Vorweg: R lesen** – „Eine Zeile lesen, die Code-Werkstatt“
2. **Vier Themen** – „je erst die Grundlage, dann die Aufgabe; im Seminar direkt zur Aufgabe springen“
3. **Zum Schluss** – „Überblick, Wichtigstes, Selbsttest, Skript“

### Was du nach dieser Sitzung kannst
- in RStudio die vier Fenster unterscheiden: Wo schreibe ich Code, wo antwortet R, wo sehe ich meine Daten?
- ein Projekt anlegen und die ALLBUS-Datei so ablegen, dass R sie findet
- den Startblock lesen und ausführen: Pakete laden, die Datei einlesen und unter dem Namen `allbus` ablegen
- eine Zeile R lesen: Objekt, Pfeil `<-`, Funktion, Argumente, Text in Anführungszeichen
- mit `find_var()` Variablen suchen und erklären, warum „kein Treffer“ nicht „gibt es nicht“ heißt und ein Treffer noch nicht passen muss
- mit dem Codebuch (`codebook()`) und einem ersten Blick in `frequency()` lesen, was eine Variable misst: Variablenlabel, Codes, Wertelabels, fehlende Werte
- sagen, wem eine Frage gestellt wurde und wie viele gültig geantwortet haben
- eine Fehlermeldung lesen und die häufigsten Fehler selbst beheben

### Schon bekannt
Text: „Aus Methoden Ia kennst du Variable, Fall und Wert und hast im Sommer 30 Blobs von Hand ausgezählt. R ist neu: Alles, was du hier brauchst, wird Schritt für Schritt eingeführt. Stellen, die du aus Methoden Ia kennst, tragen ein graues Schild ‚kennst du aus Methoden Ia‘.“

### So arbeitest du mit dieser Seite
Vier Zeilen mit Symbol (wie Sitzung 4), Wortlaut:
- **+** „**Genauer erklärt** klappt Hintergründe auf. Lies sie, wenn dir etwas zu schnell geht.“
- **?** „**Kurz überlegen** heißt: erst selbst festlegen, dann auflösen. Danebenliegen gehört dazu.“
- **▶** „In der **Code-Werkstatt** schreibst du R-Code und führst ihn direkt hier aus. Wie sie funktioniert, steht gleich unten in ‚Vorweg: Die Code-Werkstatt‘. Zum Ausführen braucht sie einmal deine ALLBUS-Datei; die lädst du in Aufgabe 1.“
- **ab** „<mark>Markierte Stellen</mark> passt du an. Sobald du eine geändert hast, verschwindet ihre Markierung. **Kopieren** nimmt deinen Code mit nach RStudio.“

**Sprungknöpfe** (Zeile unter „Vorweg“): „**Im Seminar?** Jedes Thema beginnt mit seiner Grundlage. Wer sie schon kann, springt direkt zur Aufgabe:“ [Aufgabe 1] [Aufgabe 2] [Aufgabe 3] [Aufgabe 4]

---

## 1 Themen, Variablen, Zeit

| Thema | Grundlage (Variablen, Beispiele) | Aufgabe (Variablen) | Art | Zeit |
|---|---|---|---|---|
| 1 Startklar: R, RStudio und deine Datei | 1a Vier Fenster, 1b ALLBUS und GESIS (`eastwest`: 32 % Osten), 1c Projekt, 1d Pakete; keine Datenzahlen außer dem Ost-Anteil | A1 Startklar: Datei laden (Freischalten), `dim(allbus)`, R rechnet die Zellen, Startblock in RStudio (5.246, 579, 3.037.434, 35 Tage) | Pflicht | G 15 min, A 15 min |
| 2 Variablen finden | Suchwort-Labor: `bücher`/`buecher` (la01), `handy`/`smartphone` (lm30), `tier` (vi01), `internet` (10 Treffer), `klima` (pi08), `sport`/`freizeit` | A2 Schon gefragt? Vier Ideen: `horoskop` (rh08b), `flüchtling`/`fluecht` (mi05, mp16–mp19), `politik`/`vertrauen` (pt03, pt12, pt15), `einsam`/`allein`/`freund` (dp03, xs01, li04) | Pflicht | G 10 min, A 15 min |
| 3 Eine Variable lesen: Codebuch und erster Blick | pi08 Klimawandel (Codes, Wertelabels, TNZ: SPLIT), lm30 (TNZ: FILTER), xr19 (TNZ: MODE) | A3 Belegen: rh08b (Code 1, 178 KENNE ICH NICHT, 5.030 gültig), pt03 (1.596 TNZ: SPLIT, 3.592 gültig) | Pflicht | G 12 min, A 11 min |
| 4 Wenn R sich beschwert: Fehlermeldungen | Sieben Beispielmeldungen (`codebuch`, `Allbus`, `Pi08`, `klima` ohne Anführungszeichen, fehlende Klammer, Datei fehlt, Paket fehlt) | A4 Reparieren: `frequenzy`/rh09b (248), `nachbar` (2 Treffer), `Li04` (1.534), `"kirche"` ohne Klammer (11 Treffer) | Zusatz | G 8 min, A 10 min |
| Überblick | Welches Werkzeug für welche Frage? Weg vom Rechner zur Variable, Voraussetzungen | – | – | 5 min |

Pflichtaufgaben im Seminar: A1 + A2 + A3 ≈ 41 Minuten (schwache Studentin, ohne Lesen der Grundlagen, mit Datei laden, Startzeit der Werkstatt und Schritt 4 in RStudio); das ist knapp, aber in 45 Minuten machbar. Wer in RStudio noch hängt, beantwortet A1 mit der Werkstatt und holt Schritt 4 nach; A4 als Zusatz für Schnelle oder zum Nacharbeiten. Grundlagen und Aufgaben nutzen verschiedene Variablen und Suchwörter.

Gewichtung: Alle Zahlen sind ungewichtete Zählungen. Hinweis steht in Grundlage 1b.

---

## 2 Vorweg: R lesen

Kopfzeile des Abschnitts: „Vorweg: R lesen“. Darunter die Sprungknöpfe (siehe Kopf).

### R1 Eine Zeile R lesen: der Startblock
Schilder: „neu“, „Code lesen“.

**Text (Beispiel zuerst):**
„So beginnt jede Arbeit mit dem ALLBUS in R. Diese vier Zeilen heißen in diesem Kurs **Startblock**. Du führst sie in RStudio zu Beginn jeder Sitzung aus. In der Code-Werkstatt hier auf der Seite ist das schon für dich erledigt.“

**Vorlage `start`** (copy-only, Titel „Startblock“):
```r
# Pakete laden und Daten einlesen
library(tidyverse)
library(mariposa)

allbus <- read_spss("ZA8831_v1-3-0.sav")
```

**Text:** „Zeilen mit `#` am Anfang sind **Kommentare**: Notizen für Menschen, R überspringt sie. `library()` lädt ein **Paket**, eine Sammlung von Werkzeugen. Die letzte Zeile liest die Datei und legt sie unter dem Namen `allbus` ab. So liest du sie, Baustein für Baustein:“

**Bild `s1-zeile` (HTML-Bausteine wie „So liest du eine Zeile“ in Sitzung 4, kein SVG nötig).** Zwei Reihen farbiger Bausteine mit kleiner Beschriftung darunter:
- Reihe 1: `allbus` (Hintergrund #E5E9EE, Beschriftung „Objekt: ein Name“) | `<-` (Hintergrund `--gelbh`, „lege ab unter“) | `read_spss(` (Hintergrund `--gruenh`, „Funktion: was passiert“) | `"ZA8831_v1-3-0.sav"` (Hintergrund #FFE3D2, „Argument: Text in Anführungszeichen“) | `)` (`--gruenh`, leer)
- Reihe 2: `find_var(` (`--gruenh`, „Funktion“) | `allbus` (#E5E9EE, „1. Argument: ein Objekt, ohne Anführungszeichen“) | `,` (weiß, „Komma trennt Argumente“) | `"klima"` (#FFE3D2, „2. Argument: Text“) | `)` (`--gruenh`)
- **Textfassung** (unsichtbar für Sehende, für Screenreader): „Erste Zeile: allbus ist das Objekt, also ein Name. Der Pfeil heißt: lege ab unter. read_spss ist die Funktion, sie sagt, was passiert. Der Dateiname in Anführungszeichen ist ihr Argument. Zweite Zeile: find_var ist die Funktion. Ihr erstes Argument ist das Objekt allbus ohne Anführungszeichen, ein Komma trennt es vom zweiten Argument, dem Text klima in Anführungszeichen.“

**Text unter dem Bild:** „Die erste Zeile liest du von rechts nach links: Lies die Datei ‚ZA8831_v1-3-0.sav‘ ein und leg das Ergebnis unter dem Namen `allbus` ab. Die zweite Zeile von links nach rechts: Such in `allbus` nach dem Wort ‚klima‘.“

**Kurz gesagt** (Kasten mit `tipp.svg`): „Ein **Objekt** ist ein Name, unter dem R sich etwas merkt. Mit `<-` legst du etwas unter einem Namen ab. Eine **Funktion** sagt, was passiert; ihre **Argumente** in den Klammern sagen, womit und wie. Mehrere Argumente trennt ein Komma.“

**Genauer erklärt: Objekt, Funktion, Argument** (`details`):
- „`allbus` ist nach dem Einlesen der ganze Datensatz. Den Namen hast du selbst vergeben; `daten <- read_spss(…)` ginge genauso. Wir nehmen in allen Sitzungen `allbus`, damit jede Vorlage passt.“
- „Eine Funktion erkennst du an den runden Klammern direkt hinter dem Namen. Sie bekommt etwas, tut etwas und gibt etwas zurück. `read_spss()` bekommt einen Dateinamen und gibt einen Datensatz zurück.“
- „Argumente haben Namen. `read_spss(path = "ZA8831_v1-3-0.sav")` ist dasselbe wie `read_spss("ZA8831_v1-3-0.sav")`. Den Namen darfst du weglassen, wenn die Argumente in der vorgesehenen Reihenfolge stehen. Was du gar nicht angibst, ist voreingestellt.“
- „**Text oder Name?** Was in Anführungszeichen steht, ist für R ein Text, etwa ein Dateiname oder ein Suchwort. Was ohne Anführungszeichen steht, ist ein Name: der Name eines Objekts wie `allbus` oder einer Variable wie `pi08`.“
- „Warum erst `tidyverse`, dann `mariposa`? Heißen zwei Funktionen aus verschiedenen Paketen gleich, gilt die aus dem zuletzt geladenen Paket. In diesem Kurs ist die Reihenfolge immer dieselbe, damit jede Vorlage bei allen dieselben Funktionen nutzt, zum Beispiel `frequency()` aus mariposa.“
- „Mehr dazu im R-Workshop, Kapitel 1.“

**Häufige Verwechslung:** „`<-` und `=`. Mit `<-` legst du ein Objekt unter einem Namen ab (`allbus <- read_spss(…)`). Mit `=` stellst du ein Argument ein (`path = "…"`). Und: `"allbus"` mit Anführungszeichen ist nur ein Wort, `allbus` ohne ist dein Datensatz.“

**Text am Ende von R1:** „Beim Laden schreibt RStudio farbige Zeilen in die Konsole, etwa ‚Attaching core tidyverse packages‘, ‚Conflicts‘ mit ✖ oder ‚Das folgende Objekt ist maskiert ‘package:stats’: frequency‘. Das sind Hinweise, keine Fehler. Die letzte Zeile heißt: Ab jetzt gilt `frequency()` aus mariposa, nicht die gleichnamige Funktion aus dem Grundpaket stats. Wie du echte Fehler erkennst, steht in Thema 4.“

### R2 Die Code-Werkstatt
Schilder: „neu“, „Werkzeug“.

**Text (Beispiel zuerst):** „In jeder Aufgabe stehen Code-Vorlagen in einer **Code-Werkstatt**. Dort läuft echtes R, direkt hier im Browser. Was du hier ausführst, gibt dasselbe aus wie in RStudio. So sieht eine Werkstatt aus:“

**Bild `s1-werkstatt` (SVG, etwa 760 × 400, Baukasten-Stil, helle Werkstatt wie in Teil A).**
Schemabild einer Werkstatt mit nummerierten Kreisen (Kreis `--ink`, weiße Ziffer) und kurzen Beschriftungen rechts daneben:
- Kopfleiste hellgelb (`--gelbh`), links Titel „Vorlage: Zellen zählen“ ①, rechts drei Knöpfe: „▶ Ausführen“ (grün gefüllt `--gruend`, weiße Schrift) ②, „Zurücksetzen“ ③, „Kopieren“ ④ (beide weiß mit Rand `--rand`).
- Code auf Weiß mit grauen Zeilennummern 1–5 ⑤: Zeile 1 grauer Kommentar `# Zellen zählen: Befragte mal Variablen`, Zeile 2 `zellen <- ` gefolgt von einer gelb hinterlegten, gestrichelt umrandeten Stelle `Befragte` ⑥ (markierte Stelle), dann ` * `, dann zweite markierte Stelle `Variablen`.
- Darunter eine Leiste „Einfügen: %>%  <-  " "  ( )“ ⑦.
- Rechts bzw. darunter ein Feld „Ausgabe“ ⑧ mit grauem Text „Hier erscheint, was R ausgibt.“
- Beschriftungen: ① „Name der Vorlage“, ② „führt den Code aus“, ③ „holt die Vorlage zurück“, ④ „kopiert deinen Code für RStudio“, ⑤ „Zeilennummern“, ⑥ „markierte Stelle: hier anpassen“, ⑦ „Zeichen einfügen, die schwer zu tippen sind“, ⑧ „Antwort von R: Text, Hinweise, Fehler“.
- **Textfassung:** „Schema einer Code-Werkstatt. Oben eine Kopfleiste mit dem Namen der Vorlage und drei Knöpfen: Ausführen führt den Code aus, Zurücksetzen holt die Vorlage zurück, Kopieren kopiert deinen Code für RStudio. Darunter der Code mit Zeilennummern; zwei Stellen sind gelb markiert, dort passt du an. Darunter eine Leiste zum Einfügen von Zeichen: Pipe, Pfeil, Anführungszeichen, Klammern. Ganz unten das Feld Ausgabe mit der Antwort von R.“

**Text:** „Die Werkstatt hat dieselben **Tastenkürzel wie RStudio**:“ (Liste, identisch mit der Liste unter jeder Werkstatt)
- Strg/Cmd + Enter: ausführen
- Alt + −: Pfeil `<-`
- Strg/Cmd + Umschalt + M: Pipe `%>%` (brauchst du ab Sitzung 2)
- Enter nach `%>%` oder `+` rückt ein
- Strg/Cmd + Umschalt + C: Kommentar an oder aus

„Die Tab-Taste springt zum nächsten Knopf, wie überall auf der Seite; einrücken musst du nicht selbst. Markierte Stellen stehen für Screenreader zusätzlich als Liste mit Zeilennummer unter der Werkstatt.“

**Kurz gesagt:** „**Ausführen** zeigt sofort, was R ausgibt. **Zurücksetzen** holt die Vorlage zurück; kaputt machen kannst du nichts. **Kopieren** nimmt deinen Code mit nach RStudio. Gelb markierte Stellen passt du an.“

**Genauer erklärt: Werkstatt und RStudio** (`details`):
- „In der Werkstatt ist der Startblock schon erledigt: `allbus` ist deine geladene ALLBUS-Datei. Steht eine Zeile mit `library(…)` oder `allbus <- read_spss(…)` in einer Vorlage, überspringt die Werkstatt sie, damit du denselben Code nach RStudio kopieren kannst.“
- „Jedes Ausführen beginnt mit deiner unveränderten Datei. Was du einmal geändert hast, wirkt nicht in die nächste Werkstatt hinüber. Jede Vorlage ist für sich vollständig.“
- „Beim ersten Ausführen startet R im Browser. Das dauert einmal etwa 20 Sekunden, dazu 10 bis 20 Sekunden für deine Datei; danach antwortet R sofort.“
- „Ohne Internet läuft die Werkstatt nicht. Dann kopierst du den Code und führst ihn in RStudio aus.“
- „Die Werkstatt ersetzt RStudio nicht: Für die Klausur und für eigene Auswertungen arbeitest du in RStudio. Die Werkstatt ist zum Üben da.“

**Häufige Verwechslung:** „Ausführen und Prüfen. ▶ Ausführen zeigt dir, was R ausgibt. Ob deine Antwort stimmt, prüfst du am Ende jeder Aufgabe mit ‚Antworten prüfen‘: Dort trägst du ein, was du in der Ausgabe gelesen hast.“

---

## 3 Thema 1: Startklar: R, RStudio und deine Datei

Kopf: Stein „1“, „Thema 1: Startklar: R, RStudio und deine Datei“.

### Grundlage 1
Kopf: „Grundlage zu Aufgabe 1“, Titel „R, RStudio und deine Datei“, Knopf „Schon klar? Direkt zu Aufgabe 1 ↓“.
Einleitung: „Was brauchst du, damit R mit dem ALLBUS rechnet? Vier kurze Schritte, etwa 15 Minuten.“

#### 1a Vier Fenster: R und RStudio
Schilder: „Im Bild“.

**Beispiel zuerst:** „Im Sommer hast du 30 Blobs mit Strichliste und Taschenrechner ausgezählt: eine Variable, 30 Werte. Der ALLBUS hat einige tausend Befragte und mehrere hundert Variablen. Von Hand geht das nicht mehr, dafür nimmst du **R**. R ist die Sprache, die rechnet. **RStudio** ist das Programm, in dem du mit R arbeitest. Es hat vier Fenster. Wähl ein Fenster und lies, wofür es da ist.“ (graues Schild am Satz mit den Blobs: „kennst du aus Methoden Ia“)

**Bild `s1-rstudio` (SVG, etwa 720 × 440, interaktiv).** Ein Rechteck im Seitenverhältnis eines Bildschirms, geteilt in 2 × 2 Felder mit 8 px Abstand, jedes Feld weiß mit Rand `--line`, Kopfzeile in `--side` mit Name:
- oben links **Skript** („Source“): drei Codezeilen in Werkstatt-Färbung: `library(tidyverse)`, `library(mariposa)`, `allbus <- read_spss("ZA8831_v1-3-0.sav")`.
- unten links **Konsole** („Console“): `> 2 + 3` und darunter `[1] 5`, danach `>` mit Cursor.
- oben rechts **Environment**: Tabelle mit einer Zeile `allbus` und daneben grau `… obs. of … variables` (Zahlen bewusst ausgelassen).
- unten rechts **Files, Plots, Viewer, Help**: Reiter-Zeile mit diesen vier Wörtern, darunter drei Dateizeilen `methoden-ib.Rproj`, `sitzung1.R`, `ZA8831_v1-3-0.sav`.
- **Interaktion:** Unter dem Bild vier Knöpfe in einer Gruppe („Fenster wählen“): „Skript“, „Konsole“, „Environment“, „Files und Viewer“. Klick oder Enter hebt das Feld hervor (Rand 4 px `--blaud`, die anderen Felder 40 % blasser) und zeigt darunter in einer `aria-live`-Zeile den Text. Startzustand: kein Feld gewählt, Zeile „Wähl ein Fenster.“
  - Skript: „**Skript** (oben links): Hier schreibst du deinen Code und speicherst ihn als Datei mit der Endung .R. So hast du ihn nächste Woche noch. Eine Zeile führst du aus, indem du den Cursor hineinsetzt und Strg/Cmd + Enter drückst. Fehlt das Fenster, öffnest du es über File → New File → R Script.“
  - Konsole: „**Konsole** (unten links): Hier führt R den Code aus und antwortet, auch mit Fehlermeldungen. Was du direkt hier tippst, ist nach dem Schließen weg.“
  - Environment: „**Environment** (oben rechts): Zeigt alle Objekte, die R gerade kennt. Nach dem Einlesen steht hier `allbus`, dahinter, wie viele Befragte (obs.) und Variablen (variables) der Datensatz hat.“
  - Files und Viewer: „**Files, Plots, Viewer, Help** (unten rechts): Files zeigt die Dateien in deinem Projektordner, Plots deine Grafiken, Viewer das Codebuch aus `codebook()`, Help die Hilfeseiten.“
- **Textfassung** (immer vorhanden, unter dem Bild als Liste „Die vier Fenster“): die vier Texte oben, jeweils ohne den Hervorhebungszustand.

**Kurz überlegen** (choice, id `g1-skript`): „Wo schreibst du Code, den du nächste Woche wieder brauchst?“
Optionen: `konsole` „in der Konsole“, `skript` „im Skript“, `env` „im Environment“. Ziel: `skript`.
Rückmeldung richtig: „Genau: Das Skript speicherst du als .R-Datei. Die Konsole vergisst alles, sobald du RStudio schließt.“
Rückmeldung falsch: „Die Konsole führt aus, vergisst aber alles beim Schließen; das Environment zeigt nur, was R gerade kennt. Aufheben kannst du Code nur im Skript.“

**Kurz gesagt:** „**R** ist die Sprache, die rechnet. **RStudio** ist das Programm drumherum, eine sogenannte Entwicklungsumgebung. Im **Skript** schreibst du, in der **Konsole** antwortet R, im **Environment** siehst du deine Objekte.“

**Genauer erklärt: Anordnung und Screenreader** (`details`):
- „Die Fenster können bei dir anders angeordnet sein. Die Namen in den Kopfzeilen bleiben gleich.“
- „Mit Screenreader: Unter Tools → Global Options → Accessibility schaltest du die Unterstützung für Screenreader ein. Das Environment ist mit Screenreader mühsam; die Zahl der Befragten und Variablen bekommst du auch mit `dim(allbus)` als Text (Aufgabe 1).“
- „Installiert hast du R und RStudio im Seminar: erst R von cran.r-project.org, dann RStudio Desktop von posit.co. Hakt es noch, hilft der Setup-Guide in ILIAS.“

**Häufige Verwechslung:** „R und RStudio sind zwei Programme. RStudio braucht R, nicht umgekehrt. Deshalb installierst du zuerst R, dann RStudio. Arbeiten tust du immer in RStudio.“

#### 1b Woher die Datei kommt: ALLBUS und GESIS
Schilder: „Steckbrief“.

**Beispiel zuerst:** „Die Daten dieses Semesters stammen aus einer echten Befragung: der **Allgemeinen Bevölkerungsumfrage der Sozialwissenschaften**, kurz **ALLBUS**.“

**Steckbrief** (Kasten, Liste):
- „Seit 1980 befragt, meist alle zwei Jahre.“
- „Betreut von GESIS, dem Leibniz-Institut für Sozialwissenschaften. Für Wissenschaft und Lehre kostenlos.“
- „Zufallsstichprobe aus den Einwohnermelderegistern: Erwachsene in Privathaushalten in Deutschland.“
- „Der Osten ist absichtlich stärker vertreten: 32 % der Befragten leben dort, deutlich mehr als im Anteil an der Bevölkerung.“
- „Jede Frage und jeder Code ist dokumentiert: im Codebuch, im Fragebogen und im Methodenbericht.“
- „Wir nutzen den ALLBUScompact 2023: Studiennummer ZA8831, Version 1.3.0, als SPSS-Datei `ZA8831_v1-3-0.sav`.“

**Text:** „Die Datei bekommst du bei GESIS: kostenlos registrieren, nach ZA8831 suchen, die SPSS-Datei (.sav) herunterladen. Die Nutzung ist an dich gebunden: Gib die Datei nicht weiter und lade sie nirgends hoch. Deshalb liefert auch der Atlas keine Daten mit; du lädst deine eigene Datei (Aufgabe 1).“

**Kurz gesagt:** „Der **ALLBUS** ist eine wiederholte Bevölkerungsumfrage. Die Datei enthält für jede befragte Person eine **Zeile** und für jede Frage eine **Variable** (Spalte). Ein Datensatz, den andere erhoben haben und den du auswertest, heißt **Sekundärdaten**.“

**Genauer erklärt: Warum Zahlen hier ungewichtet sind** (`details`): „Weil der Osten absichtlich stärker vertreten ist, sprechen einfache Zählungen nicht direkt für ganz Deutschland. Dafür gibt es eine **Gewichtung**; sie ist Thema in Sitzung 6. Bis dahin sind alle Zahlen im Lernpfad ungewichtet, also einfach gezählt. Für die Fragen dieser Sitzung (Wer wurde was gefragt? Wie viele haben geantwortet?) ist das genau richtig.“

**Häufige Verwechslung:** „Befragte und Bevölkerung. Der ALLBUS befragt einige tausend Menschen, nicht alle in Deutschland. Was in der Datei steht, gilt zuerst für die Befragten. Wie man daraus auf alle schließt, kommt im Lauf des Semesters.“

#### 1c Ein Projekt für das ganze Semester
Schilder: „Im Bild“.

**Beispiel zuerst:** „Dein Skript sagt `read_spss("ZA8831_v1-3-0.sav")`. Aber wo soll R nach dieser Datei suchen? R schaut in genau einem Ordner nach, dem **Arbeitsordner**. Ein **RStudio-Projekt** macht einen Ordner zu deinem Arbeitsordner, jedes Mal, wenn du das Projekt öffnest.“

**Bild `s1-projekt` (SVG, etwa 720 × 320, zwei Hälften).**
- Links, überschrieben „So findet R die Datei“ (grün `--gruend`): oben die Codezeile `read_spss("ZA8831_v1-3-0.sav")` als Baustein; ein grüner Pfeil nach unten in einen Ordner (Ordnersymbol `--gelbh`, Rand `--gelbd`, beschriftet „methoden-ib (Projektordner)“), darin drei Dateikärtchen untereinander: `methoden-ib.Rproj`, `sitzung1.R`, `ZA8831_v1-3-0.sav` (das letzte grün umrandet). Unter dem Ordner ein grünes Häkchen „gefunden“.
- Rechts, überschrieben „So nicht“ (`--rot`): dieselbe Codezeile; Pfeil in den Ordner „methoden-ib (Projektordner)“ mit nur `methoden-ib.Rproj` und `sitzung1.R`; daneben ein zweiter, grauer Ordner „Downloads“ mit `ZA8831_v1-3-0.sav`. Unter dem Projektordner ein rotes ✗ und in Monospace `File 'ZA8831_v1-3-0.sav' does not exist.`
- **Textfassung:** „Zwei Fälle. Links liegt die Datei ZA8831_v1-3-0.sav im Projektordner methoden-ib, zusammen mit methoden-ib.Rproj und sitzung1.R. read_spss mit dem Dateinamen findet sie. Rechts liegt die Datei noch im Ordner Downloads, der Projektordner enthält nur methoden-ib.Rproj und sitzung1.R. R sucht im Projektordner und meldet: File ZA8831_v1-3-0.sav does not exist.“

**Text: So legst du das Projekt an** (nummerierte Liste):
1. „In RStudio: File → New Project … → New Directory → New Project.“
2. „Gib einen Namen (zum Beispiel `methoden-ib`) und einen Ort an, den du wiederfindest. Create Project.“
3. „Verschieb die heruntergeladene Datei `ZA8831_v1-3-0.sav` in diesen Ordner. Unten rechts unter Files siehst du sie dann.“
4. „Leg ein Skript an (File → New File → R Script) und speichere es im selben Ordner, etwa als `sitzung1.R`.“
5. „Ab jetzt öffnest du RStudio über dein Projekt: Doppelklick auf `methoden-ib.Rproj` oder in RStudio über File → Open Project.“

**Kurz überlegen** (choice, id `g1-projekt`): „Dein Skript liegt im Projektordner, die ALLBUS-Datei aber noch in Downloads. Was passiert bei `read_spss("ZA8831_v1-3-0.sav")`?“
Optionen: `klappt` „Es klappt, R sucht auf dem ganzen Rechner.“, `fehlt` „R meldet, dass die Datei nicht existiert.“, `funktion` „R meldet, dass es die Funktion nicht kennt.“ Ziel: `fehlt`.
Richtig: „Genau: R sucht nur im Arbeitsordner und meldet ‚does not exist‘. Verschieb die Datei in den Projektordner.“
Falsch: „R sucht nicht auf dem ganzen Rechner, sondern nur im Arbeitsordner, beim Projekt also im Projektordner. Die Funktion kennt R, sobald mariposa geladen ist; nur die Datei fehlt dort.“

**Kurz gesagt:** „Der **Arbeitsordner** ist der Ordner, in dem R nach Dateien sucht. Ein **Projekt** setzt ihn automatisch auf deinen Projektordner. Liegen Skript und Datei dort, genügt der Dateiname.“

**Genauer erklärt: Der Ausweg `file.choose()`** (`details`):
- „Findet R die Datei nicht, nimm `allbus <- read_spss(file.choose())`. Dann öffnet sich ein Fenster, in dem du die Datei auswählst. Unter macOS erscheint dieses Fenster manchmal hinter RStudio; schau dann in der Taskleiste nach.“
- „Wo R gerade sucht, zeigt `getwd()` (get working directory) in der Konsole.“
- „Der Dateiname muss genau stimmen: Bindestriche, Unterstrich, die Endung .sav. Am sichersten kopierst du ihn aus der Vorlage.“

**Häufige Verwechslung:** „Projekt und Skript. Das Projekt ist der Ordner mit der Datei `.Rproj`; das Skript ist eine einzelne `.R`-Datei darin. Wer nur das Skript öffnet (Doppelklick auf `sitzung1.R`), hat oft den falschen Arbeitsordner.“

#### 1d Pakete: einmal installieren, jedes Mal laden
Schilder: „Code lesen“.

**Beispiel zuerst:** „`read_spss()` und `find_var()` gehören nicht zu R selbst. Sie stecken im **Paket** mariposa, das für diesen Kurs geschrieben ist. Ein Paket ist wie eine Werkzeugkiste: Du besorgst sie einmal und holst sie dann jedes Mal hervor, wenn du sie brauchst.“

**Zwei Bausteine nebeneinander (HTML wie R1):**
- links: `install.packages("mariposa")` mit Beschriftung „einmal: besorgen (aus dem Internet installieren)“; Anführungszeichen, weil der Name hier ein Text ist.
- rechts: `library(mariposa)` mit Beschriftung „jedes Mal: hervorholen (für diese Sitzung laden)“.
- Textfassung: „install.packages mit dem Namen in Anführungszeichen installiert ein Paket einmal. library mit dem Namen lädt es in jeder Sitzung.“

**Kurz überlegen** (choice, id `g1-pakete`): „Du öffnest RStudio am nächsten Tag. Was führst du aus, bevor du arbeitest?“
Optionen: `alles` „install.packages() und den Startblock“, `start` „nur den Startblock: library() und read_spss()“, `nichts` „nichts, R merkt sich alles“. Ziel: `start`.
Richtig: „Genau: Installiert bleibt installiert. Laden und Einlesen gelten aber nur, solange RStudio offen ist; deshalb steht der Startblock am Anfang jedes Skripts.“
Falsch: „install.packages() brauchst du nur einmal pro Rechner. Nach dem Schließen vergisst R aber, welche Pakete geladen waren und was `allbus` ist. Darum führst du jedes Mal den Startblock aus.“

**Kurz gesagt:** „Ein **Paket** bringt Funktionen mit. `install.packages()` installiert es einmal pro Rechner, `library()` lädt es in jeder Sitzung. Wir laden immer zuerst `tidyverse`, dann `mariposa`.“

**Genauer erklärt** (`details`): „Das tidyverse ist eine Sammlung vieler Pakete; daraus brauchst du ab Sitzung 2 etwa die Pipe `%>%` und `filter()`. Fehlt ein Paket, meldet R ‚es gibt kein Paket namens …‘ (englisch: there is no package called …). Dann einmal `install.packages("…")` mit diesem Namen ausführen. In der Code-Werkstatt sind alle Pakete schon da.“

**Häufige Verwechslung:** „Bei `install.packages("mariposa")` stehen Anführungszeichen, bei `library(mariposa)` braucht es keine. Beides funktioniert nur so, wie es in der Vorlage steht.“

### Aufgabe 1: Startklar (Pflicht)
Kopf: „A1“, „Aufgabe 1: Startklar“, Schild „Pflicht“. Link „↑ Grundlage 1 nachlesen“.

**Leitfrage:** „Hast du den ALLBUS in R, und wie groß ist er?“

**Ziel:** „Am Ende ist deine ALLBUS-Datei im Lernpfad gespeichert, du hast sie in der Code-Werkstatt und in RStudio eingelesen und kannst sagen, wie viele Befragte und Variablen sie hat und wie viele Zellen das sind.“ Grundlage: „Grundlage 1, R, RStudio und deine Datei“ und „Vorweg: Die Code-Werkstatt“.

**Erst festlegen** (Radios, id `a1-fest`): „**Erst festlegen:** Wie viele Menschen hat der ALLBUS 2023 befragt, was schätzt du?“
Optionen: „etwa 500“, „etwa 5.000“, „etwa 50.000“, „etwa 500.000“. Knopf „Tipp abgeben“. Rückmeldung: „Festgelegt: … Die Auflösung bekommst du, wenn du am Ende der Aufgabe deine Antworten prüfst.“ Wird beim Prüfen zitiert („Deine Festlegung vorher war: …“).

**Schritte:**

1. **Deine ALLBUS-Datei laden.** Schild „neu“.
   Text vor der Zone: „Die Code-Werkstatt rechnet mit deiner eigenen ALLBUS-Datei. Du lädst sie hier **einmal**. Danach gilt sie für alle Sitzungen des Lernpfads, auch wenn du die Seite neu lädst oder den Browser schließt. Die Datei bleibt in deinem Browser auf deinem Rechner gespeichert, bis du sie entfernst. **Hochgeladen wird nichts**: Die Datei verlässt deinen Rechner nicht.“
   **[UI-Baustein: bestehende Datei-Zone `DataDrop`, erscheint, solange keine Datei gespeichert ist.]** Ihr eigener Text bleibt: „ALLBUS-Datei hierher ziehen oder auswählen“, „ZA8831_v1-3-0.sav, bleibt auf deinem Rechner“, „Noch keine Datei? Den ALLBUScompact 2023 (ZA8831) gibt es nach kostenloser Registrierung bei GESIS. Die Datei bleibt in deinem Browser gespeichert, bis du sie entfernst. Hochgeladen wird nichts.“
   **Zustand „Datei schon gespeichert“** (statt der Zone, `role="status"`): „✓ Deine ALLBUS-Datei ist gespeichert. Du kannst direkt mit Schritt 2 weitermachen.“
   Text nach der Zone (immer sichtbar):
   - „**Entfernen:** Links unter der Sitzungsliste steht ‚Gespeicherte ALLBUS-Datei entfernen‘. Danach ist die Datei aus dem Browser gelöscht; auf deinem Rechner bleibt deine heruntergeladene Datei natürlich erhalten.“
   - „**Wann musst du sie neu laden?** Auf einem anderen Gerät oder in einem anderen Browser, wenn du die Website-Daten gelöscht hast oder Safari sie nach etwa sieben Tagen ohne Besuch entfernt hat. Dann bittet dich die Code-Werkstatt selbst darum.“
   - „Ohne Datei kannst du alles lesen und deine Antworten prüfen. Nur ▶ Ausführen braucht die Datei.“
   - Falls der Browser dauerhaftes Speichern ablehnt, zeigt der Atlas schon heute oben „Dein Browser speichert die Datei nicht. Nach dem Neuladen musst du sie erneut wählen.“ (bestehender Text, bleibt).

2. **Wie groß ist der ALLBUS?** Schild „neu“. Text: „Jetzt deine erste Werkstatt. `allbus` ist hier schon deine Datei. `dim()` steht für *dimensions*: Die Funktion gibt zwei Zahlen aus, erst die Zeilen (Befragte), dann die Spalten (Variablen). Drück **▶ Ausführen** oder setz den Cursor in die Zeile und drück Strg/Cmd + Enter. Beim ersten Mal startet R; das dauert etwa eine halbe Minute.“
   **Vorlage `a1_dim`** (live, Titel „Vorlage: Zeilen und Spalten zählen“):
   ```r
   # Wie viele Zeilen (Befragte) und Spalten (Variablen) hat allbus?
   dim(allbus)
   ```
   Ausgabe (geprüft): `[1] 5246  579`. Text darunter: „`[1]` heißt: Hier beginnt die Ausgabe. Die Zahlen danach sind das Ergebnis.“

3. **R rechnet: Wie viele Zellen sind das?** Text: „Jede Befragte hat für jede Variable eine Zelle. Setz an den markierten Stellen die beiden Zahlen aus Schritt 2 ein, so wie R sie schreibt: ohne Tausenderpunkt, also `5246`, nicht `5.246`. Für R ist der Punkt ein Komma: `5.246` wäre fünf Komma zwei. Führ die Vorlage dann aus. Probier danach Zurücksetzen: Die Vorlage kommt zurück.“
   **Vorlage `a1_zellen`** (live, Titel „Vorlage: Zellen zählen“):
   ```r
   # Zellen zählen: Befragte mal Variablen, unter dem Namen zellen ablegen
   zellen <- ⟦Befragte⟧ * ⟦Variablen⟧

   # zellen anzeigen
   zellen

   # Bei einer Zelle pro Sekunde: Sekunden in Tage (durch 60, durch 60, durch 24)
   zellen / 60 / 60 / 24
   ```
   Ausgabe mit 5246 und 579 (geprüft): `[1] 3037434` und `[1] 35.15549`.
   Text: „Unverändert ausgeführt meldet R ‚Objekt 'Befragte' nicht gefunden‘ (in der Werkstatt englisch: object 'Befragte' not found): Ohne Anführungszeichen liest R `Befragte` als Namen eines Objekts, und das gibt es nicht. Setz die Zahlen ein. R schreibt Kommazahlen mit Punkt: 35.15549 heißt etwa 35,2.“

4. **Dasselbe in RStudio.** Text: „Öffne RStudio über dein Projekt (Grundlage 1c), kopiere den Startblock in dein Skript und führ ihn Zeile für Zeile mit Strg/Cmd + Enter aus. Schau dann oben rechts ins Environment.“
   **Vorlage `start`** (copy-only, wie in R1).
   **Bild `s1-environment` (SVG, etwa 640 × 150).** Ausschnitt des Environment-Fensters: Kopfzeile „Environment“ mit Reitern, darunter „Data“, eine Zeile mit blauem Tabellensymbol, Name `allbus`, rechts daneben `⟨Zahl⟩ obs. of ⟨Zahl⟩ variables`, wobei die beiden Zahlen als graue Platzhalterkästen gezeichnet sind. Zwei Beschriftungspfeile von unten: unter dem ersten Kasten „obs. = Befragte (Zeilen)“, unter dem zweiten „variables = Variablen (Spalten)“.
   Bildunterschrift: „So zeigt RStudio dein Objekt `allbus`. Die Zahlen siehst du bei dir; sie sind dieselben wie bei `dim(allbus)`.“
   Textfassung: „Ausschnitt aus dem Environment in RStudio. Unter Data steht allbus, daneben: Zahl obs. of Zahl variables. Die erste Zahl sind die Befragten (Zeilen), die zweite die Variablen (Spalten). Die Zahlen sind im Bild ausgelassen.“
   Text: „Läuft RStudio bei dir noch nicht, kannst du die Fragen mit der Werkstatt beantworten und die Installation mit dem Setup-Guide in ILIAS nachholen.“

**Weiterdenken in der Probier-Werkstatt** (zugeklappt, Zusatz „(für die Aufgabe nicht nötig)“):
„Für die Aufgabe reichen die Vorlagen oben. Hier ist Platz für eigene Fragen. Eine Idee: Wie heißen die Variablen? `names()` zeigt alle Variablennamen. Woran erkennst du Variablen, die zusammengehören? Die Probier-Werkstatt startet mit einem Vorschlag.“
**Vorlage `frei_a1`:**
```r
# Eine Idee: alle Variablennamen anzeigen
names(allbus)
```
(Ausgabe: 579 Namen in etwa 97 Zeilen; die ersten sind `za_nr`, `doi`, `version`, `respid`, `substudy`, `mode`; `lm27` bis `lm34` stehen nebeneinander. Kein Rückmeldetext nötig.)

**Antwortfragen** (Knopf „Antworten prüfen“, Ausgabe je Frage ✓/✗ mit Text, dann „Deine Festlegung vorher war: …“, bei allen richtig „Alles richtig.“):

| id | Art | Label | Optionen | Ziel | Toleranz | Text richtig | Text falsch/Hinweis | Hilfezeile |
|---|---|---|---|---|---|---|---|---|
| a1-befragte | number | Wie viele Befragte (Zeilen) hat `allbus`? | – | 5246 | 0 | 5.246 Befragte. R schreibt die Zahl ohne Punkt: 5246. | Führe in Schritt 2 `dim(allbus)` aus. Die erste Zahl nach `[1]` sind die Zeilen, also die Befragten. | Aus Schritt 2, erste Zahl. |
| a1-variablen | number | Wie viele Variablen (Spalten) hat `allbus`? | – | 579 | 0 | 579 Variablen, jede eine Frage oder eine Angabe zum Interview. | Die zweite Zahl nach `[1]` in Schritt 2 sind die Spalten, also die Variablen. | Aus Schritt 2, zweite Zahl. |
| a1-tage | choice | Bei einer Zelle pro Sekunde: Wie lange bräuchtest du für alle Zellen? | `4` etwa 4 Tage; `35` etwa 35 Tage; `350` etwa 350 Tage | `35` | – | Etwa 35 Tage und Nächte: 3.037.434 Zellen sind 3.037.434 Sekunden. Spätestens hier lohnt sich R. | Setz in Schritt 3 beide Zahlen aus `dim(allbus)` ein, ohne Tausenderpunkt (`5246`), und lies die letzte Ausgabe. R schreibt Kommazahlen mit Punkt: 35.15549 heißt etwa 35. Steht bei dir 0.0351…, hast du `5.246` geschrieben. | Aus Schritt 3, letzte Zeile der Ausgabe. |
| a1-env | choice | Wo zeigt dir RStudio, dass `allbus` angekommen ist? | `konsole` in der Konsole unten links; `env` im Environment oben rechts; `viewer` im Viewer unten rechts | `env` | – | Im Environment steht `allbus` mit „5246 obs. of 579 variables“: obs. sind die Befragten, variables die Variablen. | Die Konsole zeigt, was R antwortet. Welche Objekte R kennt, listet das Environment (Grundlage 1a). | Grundlage 1a, Fenster „Environment“. |

**Hilfe, Stufe 1: Denkanstoß:** „Jede Befragte ist eine Zeile, jede Variable eine Spalte. Eine Funktion in dieser Aufgabe zählt beides, die andere Vorlage rechnet mit diesen Zahlen weiter.“
**Hilfe, Stufe 2: Wo schaue ich?:** „Die beiden Zahlen stehen in der Ausgabe von `dim(allbus)` in Schritt 2. Setz sie in Schritt 3 an den markierten Stellen ein, ohne Punkt, also `5246` und nicht `5.246`. In RStudio stehen dieselben Zahlen im Environment hinter `allbus`.“
**Hilfe, Stufe 3: Lösung:** „`dim(allbus)` gibt `5246 579` aus: 5.246 Befragte, 579 Variablen. In Schritt 3 steht dann `zellen <- 5246 * 579`; R antwortet 3037434 Zellen und 35.15549 Tage, also gut 35 Tage. In RStudio zeigt das Environment ‚allbus: 5246 obs. of 579 variables‘.“

**Ohne Grafik lösbar:** „Alle Ausgaben dieser Aufgabe sind Text.“

---

## 4 Thema 2: Variablen finden

Kopf: Stein „2“, „Thema 2: Variablen finden“.

### Grundlage 2
Kopf: „Grundlage zu Aufgabe 2“, Titel „Variablen finden“, Knopf „Schon klar? Direkt zu Aufgabe 2 ↓“.
Einleitung: „Wie findest du unter Hunderten Variablen die eine, die zu deiner Frage passt? Etwa 10 Minuten.“

#### 2a Name und Variablenlabel
Schilder: „Variable: kennst du aus Methoden Ia“.

**Beispiel zuerst:** „Der ALLBUS fragt, wie oft Menschen Bücher lesen. In der Datei heißt diese Variable `la01`. Daneben steht eine kurze Beschreibung: FREIZEIT: BUECHER LESEN.“

**Text:** „Jede Variable hat zwei Kennzeichen:
- den **Variablennamen**, kurz und ohne Leerzeichen, etwa `la01`. Mit ihm sprichst du die Variable in R an.
- das **Variablenlabel**, eine kurze Beschreibung der Frage, etwa FREIZEIT: BUECHER LESEN.
Die Variablenlabels im ALLBUS stehen in GROSSBUCHSTABEN, ohne Umlaute (ü wird UE) und oft abgekürzt. Variablen, die zusammengehören, haben oft ähnliche Namen: `lm27` bis `lm34` fragen alle, mit welchen Geräten jemand das Internet nutzt.“

**Kurz gesagt:** „Der **Variablenname** ist der Rufname in R (`la01`). Das **Variablenlabel** beschreibt kurz, was gefragt wurde (FREIZEIT: BUECHER LESEN).“

**Genauer erklärt: Wo steht die ganze Frage?** (`details`): „Das Variablenlabel ist eine Kurzfassung. Den genauen Wortlaut der Frage findest du im Fragebogen und im Variablenbericht zum ALLBUS 2023 bei GESIS (Suche nach ZA8831). Für die Suche in R reicht das Variablenlabel.“

**Häufige Verwechslung:** „Variablenlabel und Frage. FREIZEIT: BUECHER LESEN ist nicht der Fragetext. Ob gefragt wurde ‚Wie oft lesen Sie Bücher?‘ oder ‚Lesen Sie gern?‘, zeigt erst der Fragebogen; die Antwortmöglichkeiten zeigt das Codebuch (Thema 3).“

#### 2b Suchen mit `find_var()`
Schilder: „Im Bild“, „Ausprobieren“.

**Beispiel zuerst:** „`find_var(allbus, "buecher")` sucht in allen Variablennamen und Variablenlabels nach dem Wortteil ‚buecher‘ und findet `la01`. Probier verschiedene Suchwörter aus; die Ergebnisse stammen aus dem ALLBUS 2023.“

**Bild `s1-find-var` (SVG, etwa 720 × 300).** Links ein Baustein `"buecher"` (Hintergrund #FFE3D2) mit Beschriftung „Suchwort“, ein grüner Pfeil `find_var()` nach rechts zu einer Tabelle „Alle Variablen“ mit zwei Spalten „Name“ und „Variablenlabel“, sechs Zeilen: `la01` FREIZEIT: BUECHER LESEN; `li03` WICHTIGKEIT: FREIZEIT UND ERHOLUNG; `lm30` INTERNETNUTZUNG MIT: SMARTPHONE; `pi08` MEINUNG UEBER DEN KLIMAWANDEL; `vi01` WICHTIG: GESETZ UND ORDNUNG RESPEKTIEREN; `xr19` NUTZEN SIE PRIVAT DAS INTERNET?; darunter „… und viele weitere“. In Zeile `la01` ist „BUECHER“ orange hinterlegt (`--k`), die Zeile grün umrandet. Rechts davon ein Ergebniskasten „1 Treffer: la01 FREIZEIT: BUECHER LESEN“. Über der Tabelle zwei kleine Pfeile auf die Spaltenköpfe: „sucht im Namen“ und „sucht im Variablenlabel“.
Textfassung: „find_var sucht das Suchwort buecher in zwei Spalten einer Liste aller Variablen: im Namen und im Variablenlabel. Gezeigt sind sechs Variablen, darunter la01 FREIZEIT: BUECHER LESEN. Nur dort steht BUECHER, also gibt es einen Treffer: la01.“

**Interaktion „Suchwort-Labor“** (HTML, keine Datei nötig, feste Ausgaben): Reihe von Knöpfen mit den Suchwörtern; Klick zeigt darunter in einem Ausgabefeld (Monospace, `aria-live`) die R-Ausgabe und darunter einen Satz „Was lernst du daraus?“. Startzustand: „Wähl ein Suchwort.“
| Knopf | R-Ausgabe (genau so) | Was lernst du daraus? |
|---|---|---|
| `"bücher"` | `No variables found matching "bücher".` | Kein Treffer, obwohl es die Frage gibt: Die Labels schreiben ü als UE. |
| `"buecher"` | `  col name                   label` / `1  25 la01 FREIZEIT: BUECHER LESEN` | Mit ue statt ü klappt es. Groß- und Kleinschreibung ist egal. |
| `"handy"` | `No variables found matching "handy".` | Kein Treffer: Der ALLBUS sagt nicht Handy … |
| `"smartphone"` | `  col name                           label` / `1  20 lm30 INTERNETNUTZUNG MIT: SMARTPHONE` | … sondern Smartphone. Probier Wörter mit gleicher Bedeutung. |
| `"tier"` | `  col name                                    label` / `1  47 vi01 WICHTIG: GESETZ UND ORDNUNG RESPEKTIEREN` | Ein **Scheintreffer**: ‚tier‘ steckt in RESPEKTIEREN. Mit Tieren hat die Frage nichts zu tun. |
| `"internet"` | 10 Zeilen: `xr19` NUTZEN SIE PRIVAT DAS INTERNET?, `xr20` HAEUFIGKEIT INTERNETNUTZUNG PRIVAT, `lm27` INTERNETNUTZUNG MIT: PC, `lm28` … LAPTOP, `lm29` … TABLET, `lm30` … SMARTPHONE, `lm31` … FERNSEHER, `lm32` … SPIELEKONSOLE, `lm33` … E-BOOK-READER, `lm34` … ANDERE GERAETE (Spalte col: 15 bis 24) | Viele Treffer: Jetzt musst du die Labels lesen und die passende Variable auswählen. |
| `"klima"` | `  col name                         label` / `1 531 pi08 MEINUNG UEBER DEN KLIMAWANDEL` | Ein Treffer, und er passt. Was die Codes von pi08 bedeuten, zeigt Thema 3. |
Hinweis für den Bau: Die Spalte `col` ist die Position der Variable im Datensatz; im Text kurz erklären: „`col` zeigt, an welcher Stelle die Variable im Datensatz steht.“ Bei „internet“ die vollständige Ausgabe aus `sitzung01-zahlen.R` übernehmen (Abschnitt „Grundlage 2: Suchwort-Labor“ ihrer Ausgabe).

**Kurz überlegen** (choice, id `g2-sport`): „Du willst wissen, ob der ALLBUS nach Sport fragt. `find_var(allbus, "sport")` findet nichts. Was probierst du als Nächstes?“
Optionen: `aufgeben` „Nichts mehr: Die Frage gibt es nicht.“, `anders` „Ein allgemeineres Wort, etwa "freizeit".“, `gross` „Dasselbe Wort in Großbuchstaben: "SPORT".“ Ziel: `anders`.
Richtig: „Genau. ‚freizeit‘ findet la01 (FREIZEIT: BUECHER LESEN) und li03 (WICHTIGKEIT: FREIZEIT UND ERHOLUNG). Eine Sportfrage ist nicht dabei; sicher bist du erst nach mehreren Suchwörtern und einem Blick ins Codebuch.“
Falsch: „find_var() achtet nicht auf Groß- und Kleinschreibung, ‚SPORT‘ findet genauso wenig. Aufgeben ist zu früh: Ein anderes Wort findet vielleicht, was du suchst.“

**Kurz gesagt:** „`find_var()` sucht ein Wort oder einen Wortteil in Variablennamen und Variablenlabels. **Kein Treffer** heißt nicht ‚gibt es nicht‘: Probier ae, oe, ue statt ä, ö, ü, einen kürzeren Wortanfang oder ein anderes Wort. **Ein Treffer** heißt nicht ‚passt‘: Lies das Variablenlabel.“

**Genauer erklärt: Wie `find_var()` sucht** (`details`):
- „Das erste Argument ist der Datensatz (`allbus`, ohne Anführungszeichen), das zweite das Suchwort (in Anführungszeichen).“
- „Gefunden wird jedes Label, in dem das Suchwort irgendwo vorkommt, auch mitten in einem Wort. Ein kurzer Wortanfang wie ‚fernseh‘ findet FERNSEHER und FERNSEHEN.“
- „Mit dem Argument `search` kannst du die Suche einschränken: `search = "name"` sucht nur in den Namen, `search = "label"` nur in den Labels. Voreingestellt ist beides.“
- „Findet `find_var()` nichts, schreibt R: No variables found matching … Das ist ein Hinweis, kein Fehler.“
- „Mehr im R-Workshop, Abschnitt 4.4.1 `find_var()`.“

**Häufige Verwechslung:** „Kein Treffer und keine Frage. ‚bücher‘ findet nichts, ‚buecher‘ findet la01. Bevor du sagst ‚Der ALLBUS fragt das nicht‘, probier mindestens zwei, drei Suchwörter.“

**Link:** „→ In der freien Karte: Codebuch und Variablensuche“ (Konzept `codebook`).

### Aufgabe 2: Schon gefragt? (Pflicht)
Kopf: „A2“, „Aufgabe 2: Schon gefragt?“, Schild „Pflicht“. Link „↑ Grundlage 2 nachlesen“.

**Leitfrage:** „Hat der ALLBUS 2023 schon gefragt, was dich interessiert?“

**Ziel:** „Am Ende hast du für vier Ideen geprüft, ob der ALLBUS sie schon fragt, und kannst erklären, warum ‚kein Treffer‘ noch nicht ‚gibt es nicht‘ heißt und ein Treffer nicht immer passt.“ Grundlage: „Grundlage 2, Variablen finden“.

**Text:** „Vier Ideen für Fragen an die Bevölkerung:
1. Halten die Leute etwas von Horoskopen?
2. Wie viele haben Angst vor Geflüchteten?
3. Vertrauen die Menschen der Politik noch?
4. Wie einsam sind die Menschen?
Für jede suchst du im ALLBUS: Gibt es eine Variable, die das misst? Wenn nicht, müsste man die Frage neu stellen.“

**Erst festlegen** (Radios, id `a2-fest`): „**Erst festlegen:** `find_var()` findet zu einem Suchwort nichts. Was heißt das?“
Optionen: „Der ALLBUS hat diese Frage nicht.“, „Vielleicht schreibt der ALLBUS es anders, als ich gesucht habe.“, „R hat einen Fehler gemacht.“

**Schritte:**

1. **Idee 1: Horoskope.** Text: „Die erste Suche ist vorgemacht. Führ sie aus und lies das Variablenlabel.“
   **Vorlage `a2_idee1`** (live, Titel „Idee 1: Horoskope“):
   ```r
   # Idee 1: Gibt es eine Frage zu Horoskopen?
   find_var(allbus, "horoskop")
   ```
   Ausgabe: `1 153 rh08b HALTE VON: ASTROLOGIE, HOROSKOPE`.

2. **Idee 2: Angst vor Geflüchteten.** Text: „Führ die Vorlage erst so aus, wie sie ist. Findet R nichts, ändere das markierte Suchwort so, wie du es in Grundlage 2 gelernt hast, und führ sie noch einmal aus. Tipp: Ein kurzer Wortanfang findet auch abgekürzte Labels. Lies alle Treffer: Misst einer davon Angst?“
   **Vorlage `a2_idee2`** (live, Titel „Idee 2: Geflüchtete“):
   ```r
   # Idee 2: Gibt es eine Frage zu Geflüchteten?
   find_var(allbus, "⟦flüchtling⟧")
   ```
   Ausgaben (geprüft): unverändert `No variables found matching "flüchtling".`; mit `"fluecht"` fünf Treffer `mi05` ZUZUG VON: KRIEGSFLUECHTLINGEN, `mp16` FLUECHTL. CHANCE O.RISIKO: SOZIALSTAAT, `mp17` … SICHERHEIT, `mp18` … ZUSAMMENLEBEN, `mp19` … WIRTSCHAFT; mit `"fluechtling"` nur `mi05` (weil mp16 bis mp19 FLUECHTL. abkürzen); mit `"angst"` nichts.

3. **Idee 3: Vertrauen in die Politik.** Text: „Führ die Vorlage aus und lies die Treffer. Misst einer davon Vertrauen? Wenn nicht: Welches Wort aus der Idee würde im Label stehen? Ändere die markierte Stelle.“
   **Vorlage `a2_idee3`** (live, Titel „Idee 3: Vertrauen in die Politik“):
   ```r
   # Idee 3: Gibt es eine Frage zum Vertrauen in die Politik?
   find_var(allbus, "⟦politik⟧")
   ```
   Ausgaben (geprüft): unverändert 8 Treffer (`li07`, `lp05`, `pe01`, `pe04`, `pe05`, `pe06`, `pa30`, `pa35`), keiner mit VERTRAUEN im Label; mit `"vertrauen"` 16 Treffer, darunter `pt03` VERTRAUEN: BUNDESTAG, `pt12` VERTRAUEN: BUNDESREGIERUNG, `pt15` VERTRAUEN: POLITISCHE PARTEIEN und `st01` VERTRAUEN ZU MITMENSCHEN.
   Text nach der Vorlage: „‚Die Politik‘ kann Verschiedenes meinen: den Bundestag, die Bundesregierung, die Parteien. Du musst entscheiden, was die Idee meint.“

4. **Idee 4: Einsamkeit.** Text: „Führ die Vorlage aus. Prüf jeden Treffer: Geht es wirklich um Einsamkeit? Probier danach weitere Wörter, etwa ‚allein‘ oder ‚freund‘.“
   **Vorlage `a2_idee4`** (live, Titel „Idee 4: Einsamkeit“):
   ```r
   # Idee 4: Gibt es eine Frage zur Einsamkeit?
   find_var(allbus, "⟦einsam⟧")
   ```
   Ausgaben (geprüft): `"einsam"` → `dp03` LEBENSPARTNER: GEMEINSAMER HAUSHALT?; `"allein"` → `xs01` INTERVIEW: ALLEINE DURCHGEFUEHRT; `"freund"` → `li04` WICHTIGKEIT: FREUNDE UND BEKANNTE, `mc04` AUSLAENDER: KONTAKT IM FREUNDESKREIS?

**Weiterdenken in der Probier-Werkstatt** (zugeklappt, „(für die Aufgabe nicht nötig)“):
„Für die Aufgabe reichen die Vorlagen oben. Hier ist Platz für eigene Fragen. Eine Idee: Wenn der ALLBUS nach Horoskopen fragt, fragt er vielleicht auch nach Tarot-Karten? Oder such nach einer Frage, die dich selbst interessiert. Die Probier-Werkstatt startet mit einem Vorschlag.“
**Vorlage `frei_a2`:**
```r
# Eine Idee: Fragt der ALLBUS auch nach Tarot-Karten?
# Danach: Such nach deiner eigenen Idee
find_var(allbus, "tarot")
```
(Ausgabe: `rh09b` HALTE VON: TAROT-KARTEN, WAHRSAGEN.)

**Antwortfragen:**

| id | Art | Label | Optionen | Ziel | Toleranz | Text richtig | Text falsch/Hinweis | Hilfezeile |
|---|---|---|---|---|---|---|---|---|
| a2-horoskop | choice | Idee 1: Welche Variable misst, was die Befragten von Horoskopen halten? | `rh08b`; `rh09b`; `la01` | `rh08b` | – | rh08b, Variablenlabel HALTE VON: ASTROLOGIE, HOROSKOPE. Ein Treffer, und er passt. | Lies das Variablenlabel in der Ausgabe von Schritt 1. rh09b ist Tarot, la01 Bücherlesen. | Schritt 1. |
| a2-fluecht | number | Idee 2: Wie viele Treffer findet `find_var()` mit dem Suchwort `"fluecht"`? | – | 5 | 0 | 5 Treffer: mi05 und mp16 bis mp19. Mit ‚flüchtling‘ gab es keinen, weil die Labels ü als UE schreiben. | Schreib ü als ue und nimm nur den Wortanfang: `"fluecht"`. Mit ‚fluechtling‘ findest du nur mi05, weil mp16 bis mp19 FLUECHTL. abkürzen. Zähl die Zeilen der Ausgabe. | Schritt 2, Suchwort `"fluecht"`. |
| a2-angst | choice | Idee 2: Messen mp16 bis mp19 die Angst vor Geflüchteten? | `genau` Ja, sie fragen nach Angst vor Geflüchteten.; `risiko` Nicht genau: Sie fragen, ob Geflüchtete eher eine Chance oder ein Risiko sind.; `zuzug` Nein, sie fragen, ob man den Zuzug begrenzen will. | `risiko` | – | Genau: Die Labels sagen CHANCE O.RISIKO. Ein Risiko für die Sicherheit zu sehen ist nicht dasselbe wie Angst. Ob eine Variable misst, was du meinst, heißt **Gültigkeit** (Validität). Kurz gesagt: Passt die Frage zu deiner Idee? Ob man mp16 bis mp19 trotzdem nimmt, ist eine Entscheidung, die du begründest. | Lies die Labels: FLUECHTL. CHANCE O.RISIKO. Das Wort Angst steht nirgends; den Zuzug fragt mi05. | Schritt 2, Labels der Treffer. |
| a2-bundestag | choice | Idee 3: Mit ‚der Politik‘ ist der Bundestag gemeint. Welche Variable nimmst du? | `pe01`; `pt03`; `pt12`; `st01` | `pt03` | – | pt03, VERTRAUEN: BUNDESTAG. Gefunden erst mit ‚vertrauen‘; die Suche nach ‚politik‘ findet keine Vertrauensfrage. | pe01 fand die Suche nach ‚politik‘, misst aber, ob Politiker sich um einen kümmern, nicht Vertrauen. pt12 ist die Bundesregierung, st01 das Vertrauen zu Mitmenschen. Such mit `"vertrauen"`. | Schritt 3, Suchwort `"vertrauen"`. |
| a2-einsam | choice | Idee 4: Was folgt für die Einsamkeit? | `dp03` dp03 misst Einsamkeit.; `neu` Keine Variable misst Einsamkeit: dp03 und xs01 sind Scheintreffer, li04 ist nur nah dran. Die Frage müsste man neu stellen.; `kaputt` find_var() funktioniert bei diesem Wort nicht. | `neu` | – | Genau: In GEMEINSAMER steckt ‚einsam‘, xs01 fragt, ob das Interview allein durchgeführt wurde. li04 fragt, wie wichtig Freunde sind, nicht, ob man sich einsam fühlt. | Lies die Labels: dp03 heißt LEBENSPARTNER: GEMEINSAMER HAUSHALT?. find_var() funktioniert; es findet ‚einsam‘ eben auch mitten in einem anderen Wort. | Schritt 4, Labels lesen. |

Nach dem Prüfen zusätzlich: „Deine Festlegung vorher war: …“ und, wenn alle richtig, „Alles richtig. ‚Kein Treffer‘ hieß bei Idee 2 nur: anders schreiben.“

**Fürs Plenum:** „Bei welchen Ideen würdet ihr eine vorhandene Variable nehmen, bei welchen neu fragen? Bei Idee 2 und 3 gibt es keine eindeutige Antwort. Bringt eure Entscheidung und einen Satz Begründung mit.“

**Hilfe, Stufe 1: Denkanstoß:** „Die Variablenlabels stehen in Großbuchstaben, ohne Umlaute und oft abgekürzt. Wie sähe ‚Flüchtling‘ dort aus? Und: Ein Treffer ist erst ein Kandidat. Passt das Label wirklich zur Idee?“
**Hilfe, Stufe 2: Wo schaue ich?:** „Grundlage 2b, Suchwort-Labor: ‚bücher‘ gegen ‚buecher‘ und der Scheintreffer ‚tier‘. In jeder Ausgabe steht rechts das Variablenlabel; lies es Wort für Wort.“
**Hilfe, Stufe 3: Lösung:** „Idee 1: `find_var(allbus, "horoskop")` findet rh08b. Idee 2: `"flüchtling"` findet nichts, `"fluecht"` findet 5 Treffer: mi05 (Zuzug begrenzen) und mp16 bis mp19 (Chance oder Risiko); Angst misst keine genau. Idee 3: `"politik"` findet 8 Treffer ohne Vertrauen, `"vertrauen"` 16, darunter pt03 (Bundestag), pt12 (Bundesregierung), pt15 (Parteien). Idee 4: `"einsam"` findet nur dp03 (gemEINSAMer Haushalt), `"allein"` nur xs01 (Interview allein), `"freund"` li04 (Freunde wichtig): keine Frage zur Einsamkeit.“

**Ohne Grafik lösbar:** „Alle Ausgaben dieser Aufgabe sind Text.“

---

## 5 Thema 3: Eine Variable lesen: Codebuch und erster Blick

Kopf: Stein „3“, „Thema 3: Eine Variable lesen“.

### Grundlage 3
Kopf: „Grundlage zu Aufgabe 3“, Titel „Codebuch und erster Blick“, Knopf „Schon klar? Direkt zu Aufgabe 3 ↓“.
Einleitung: „Was genau misst eine Variable, und wer hat darauf geantwortet? Etwa 12 Minuten.“

#### 3a Codes und Wertelabels
Schilder: „Wert: kennst du aus Methoden Ia“, „Im Bild“.

**Beispiel zuerst:** „Die Klimafrage `pi08` (MEINUNG UEBER DEN KLIMAWANDEL) hat vier Antwortmöglichkeiten. Im Datensatz steht aber kein Wort, sondern eine Zahl, ein **Code**: 1 für ‚keine Klimaänderung‘, 4 für ‚menschliche Ursachen‘. Das Wort zum Code heißt **Wertelabel**. So sieht die Variable aus, wenn R sie auszählt:“

**Bild `s1-pi08` (HTML-Tabelle, keine SVG; Monospace-Ausgabe von `frequency(allbus, pi08)` als echte Tabelle nachgebaut, mit Hervorhebungen).**
Spalten: Value | Label | N | Raw % | Valid % | Cum. %. Kopf darüber: „pi08 (MEINUNG UEBER DEN KLIMAWANDEL)“, darunter „# total N=5246 valid N=3507 mean=3.40 sd=0.72 skewness=-1.09“.
Zeilen genau so:
| Value | Label | N | Raw % | Valid % | Cum. % |
|---|---|---|---|---|---|
| 1 | KEINE KLIMAAENDERUNG | 70 | 1.33 | 2.00 | 2.00 |
| 2 | NATUERLICHE URSACHEN | 270 | 5.15 | 7.70 | 9.69 |
| 3 | MENSCH+NATUR | 1355 | 25.83 | 38.64 | 48.33 |
| 4 | MENSCHL. URSACHEN | 1812 | 34.54 | 51.67 | 100.00 |
| Total valid | | 3507 | 66.85 | 100.00 | |
| -42 | DATENFEHLER: MFN | 20 | 0.38 | | |
| -11 | TNZ: SPLIT | 1647 | 31.40 | | |
| -9 | KEINE ANGABE | 52 | 0.99 | | |
| -8 | WEISS NICHT | 20 | 0.38 | | |
| Total missing | | 1739 | 33.15 | | |
| Total | | 5246 | 100.00 | | |
**Interaktion:** Fünf Umschaltknöpfe darüber („Zeig mir …“, `aria-pressed`): „Codes“ (Spalte Value, Hintergrund `--lilah`), „Wertelabels“ (Spalte Label, `--kh`), „Anzahl“ (Spalte N, `--blauh`), „gültige Antworten“ (Zeile Total valid, `--gruenh`, Rand `--gruend`), „fehlende Werte“ (Zeilen −42 bis −8 und Total missing, `--roth`, Rand `--rot`). Mehrere gleichzeitig möglich. Zu jedem Knopf erscheint ein Satz in einer `aria-live`-Zeile:
- Codes: „**Codes** sind die Zahlen im Datensatz. Die positiven (1 bis 4) sind Antworten, die negativen (−42 bis −8) sind fehlende Werte.“
- Wertelabels: „**Wertelabels** übersetzen jeden Code in Worte: 4 heißt MENSCHL. URSACHEN.“
- Anzahl: „**N** zählt, wie viele Befragte diesen Code haben: 1.812 sagen ‚menschliche Ursachen‘.“
- gültige Antworten: „**Total valid** sind die gültigen Antworten: 3.507 Befragte haben eine der vier Antworten gegeben.“
- fehlende Werte: „**Fehlende Werte** haben negative Codes: 1.739 Befragte haben keine gültige Antwort.“
Text unter der Tabelle: „Die Prozent-Spalten (Raw %, Valid %, Cum. %) und die Kennzahlen in der Kopfzeile (mean, sd, skewness) schauen wir uns in Sitzung 3 und 4 genauer an. Heute zählen Codes, Wertelabels und N.“
Textfassung: Die Tabelle ist echte HTML-Tabelle mit `caption` „Ausgabe von frequency(allbus, pi08), ALLBUS 2023, ungewichtet“ und `scope`-Köpfen; Hervorhebungen zusätzlich als Text in der Live-Zeile, nie nur Farbe.

**Kurz gesagt:** „Ein **Code** ist die Zahl im Datensatz, ein **Wertelabel** das Wort dazu. Das **Variablenlabel** beschreibt die ganze Variable. Alle Antwortmöglichkeiten zusammen heißen **Ausprägungen**.“

**Genauer erklärt: Codebuch und `frequency()`** (`details`):
- „Das **Codebuch** listet für jede Variable Name, Variablenlabel, Codes mit Wertelabels und wie oft jeder Code vorkommt. In RStudio öffnet `codebook(allbus)` das ganze Codebuch im Viewer (unten rechts). Mit dem Symbol ‚Show in new window‘ öffnest du es im Browser und suchst mit Strg + F (Mac: Cmd + F) nach einem Variablennamen.“
- „`frequency(allbus, pi08)` zeigt dasselbe für eine einzelne Variable als Tabelle, wie oben. Das ist dein **erster Blick** auf eine Variable: Welche Codes gibt es, was heißen sie, wie viele haben geantwortet? Ausführlich kommt `frequency()` in Sitzung 3.“
- „Mit einem Variablennamen schlägt `codebook(allbus, pi08)` nur diese eine Variable nach. Die Werkstatt hier im Browser kann den Viewer nicht öffnen und zeigt den Eintrag als Text, aber ohne die Zahl der gültigen Antworten. Darum nimmst du in dieser Sitzung `frequency()`: Dort stehen die gültigen Antworten als eigene Zeile. Das Nachschlagen mit `codebook()` übst du in Sitzung 2.“
- „Mehr im R-Workshop, Abschnitt 4.4.2 `codebook()`.“

**Häufige Verwechslung:** „Code und Menge. Code 4 heißt nicht ‚vier Personen‘ oder ‚viermal so stark‘. Die 4 ist nur die Nummer der Antwort MENSCHL. URSACHEN. Wie viele so geantwortet haben, steht in Spalte N.“

#### 3b Fehlende Werte: wer nicht geantwortet hat und wer gar nicht gefragt wurde
Schilder: „Formel lesen“.

**Beispiel zuerst:** „Bei pi08 stehen unter den Antworten vier negative Codes. 1.647 Befragte haben den Code −11 TNZ: SPLIT. **TNZ** heißt ‚trifft nicht zu‘: Diesen Menschen wurde die Frage **gar nicht gestellt**. Der ALLBUS hat mehrere Fassungen des Fragebogens, und die Klimafrage stand nur in einem Teil davon. Die anderen negativen Codes betreffen Menschen, die gefragt wurden, aber keine gültige Antwort gegeben haben: KEINE ANGABE, WEISS NICHT, DATENFEHLER.“

**Formel als Bausteine („Formel lesen lernen“, HTML wie der Anteils-Baustein in Sitzung 4):**
Reihe 1 in Worten: [gültige Antworten] = [alle Befragten] − [alle fehlenden Werte]
Reihe 2 mit Zahlen für pi08: [3.507] = [5.246] − [1.739]
Farben: gültige `--gruenh`, alle `--blauh`, fehlende `--roth`.
Darunter, kleiner: „Die 1.739 fehlenden Werte sind 20 Datenfehler + 1.647 nicht gefragt + 52 keine Angabe + 20 weiß nicht.“
Textfassung: „Gültige Antworten gleich alle Befragten minus alle fehlenden Werte. Für pi08: 3.507 gleich 5.246 minus 1.739. Die 1.739 fehlenden Werte sind 20 Datenfehler, 1.647 nicht gefragt, 52 keine Angabe und 20 weiß nicht.“

**Kurz überlegen** (number, id `g3-gefragt`): Label „Wie vielen Befragten wurde die Klimafrage pi08 gestellt?“, Hilfezeile „Gefragt wurden alle außer denen mit TNZ.“ Ziel 3599, Toleranz 0.
Richtig: „3.599: alle 5.246 minus die 1.647 mit TNZ: SPLIT. Gültig geantwortet haben davon 3.507.“
Falsch: „Zieh nur die Zeile −11 TNZ: SPLIT von allen 5.246 ab. Wer KEINE ANGABE oder WEISS NICHT hat, wurde gefragt, hat aber nicht gültig geantwortet.“

**Kurz gesagt:** „**Fehlende Werte** haben im ALLBUS negative Codes. **TNZ** (trifft nicht zu) heißt: Die Frage wurde dieser Person nicht gestellt. **Gültige Antworten** sind alle Befragten minus alle fehlenden Werte. Nur mit ihnen rechnest du.“

**Genauer erklärt: Drei Arten von TNZ** (`details`):
- „**TNZ: SPLIT** (−11): Die Frage stand nur in einer Fassung des Fragebogens. Bei pi08 betrifft das 1.647 Befragte.“
- „**TNZ: FILTER** (−10): Die Frage wurde nur gestellt, wenn eine frühere Antwort passte. Mit welchen Geräten jemand das Internet nutzt (`lm27` bis `lm34`), fragt man nur Menschen, die das Internet nutzen. Bei `lm30` (Smartphone) haben 436 Befragte TNZ: FILTER.“
- „**TNZ: MODE** (−15): Die Frage gab es nur auf einem Erhebungsweg. ‚Nutzen Sie privat das Internet?‘ (`xr19`) wurde den 1.587 Menschen, die online geantwortet haben, nicht gestellt; die Antwort ergibt sich ja aus dem Weg.“
- „Beim Einlesen hat `read_spss()` alle negativen Codes als fehlend markiert. Darum rechnet R später nur mit den gültigen Antworten. Mehr zu fehlenden Werten in Sitzung 3.“

**Häufige Verwechslung:** „Total und Total valid. Die letzte Zeile ‚Total 5246‘ sind alle Befragten, nicht alle Antworten. Wie viele geantwortet haben, steht in ‚Total valid‘.“

### Aufgabe 3: Belegen (Pflicht)
Kopf: „A3“, „Aufgabe 3: Belegen“, Schild „Pflicht“. Link „↑ Grundlage 3 nachlesen“.

**Leitfrage:** „Was genau misst die Variable, und wie viele haben gültig geantwortet?“

**Ziel:** „Am Ende kannst du für die Horoskop-Frage `rh08b` und die Vertrauensfrage `pt03` aus Aufgabe 2 sagen, was die Codes bedeuten, wie viele gültig geantwortet haben und wem die Frage gar nicht gestellt wurde.“ Grundlage: „Grundlage 3, Codebuch und erster Blick“.

**Erst festlegen** (Radios, id `a3-fest`): „**Erst festlegen:** Wie vielen Befragten wurde die Frage nach dem Vertrauen in den Bundestag (pt03) gestellt?“
Optionen: „allen“, „etwa zwei Dritteln“, „etwa der Hälfte“.

**Schritte:**

1. **Im Codebuch nachschlagen (in RStudio).** Text: „Öffne in RStudio das ganze Codebuch und such darin mit Strg + F (Mac: Cmd + F) nach `rh08b`. Dort siehst du Variablenlabel, Codes, Wertelabels und Häufigkeiten. Die letzte Zeile der Vorlage schlägt nur `rh08b` nach. Ohne RStudio: weiter mit Schritt 2, dort steht dasselbe.“
   **Vorlage `a3_codebuch`** (copy-only, Titel „Codebuch öffnen (in RStudio)“):
   ```r
   # Das ganze Codebuch im Viewer öffnen (in RStudio)
   # Darin mit Strg + F (Mac: Cmd + F) nach rh08b suchen
   codebook(allbus)

   # Nur eine Variable nachschlagen
   codebook(allbus, rh08b)
   ```

2. **Erster Blick auf rh08b.** Schild „neu: erster Blick, ausführlich in Sitzung 3“. Text: „`frequency()` zählt aus, wie oft jeder Code vorkommt. Erstes Argument: der Datensatz, zweites: die Variable, ohne Anführungszeichen. Lies in der Ausgabe: Value ist der Code, Label das Wertelabel, N die Anzahl. Unter ‚Total valid‘ stehen die gültigen Antworten, darunter die fehlenden Werte.“
   **Vorlage `a3_rh08b`** (live, Titel „Vorlage: Horoskope auszählen“):
   ```r
   # Codes, Wertelabels und Anzahlen der Horoskop-Frage
   frequency(allbus, rh08b)
   ```
   Ausgabe (geprüft): 1 VIEL 169, 2 ETWAS 1321, 3 GAR NICHTS 3540, Total valid 5030; −42 DATENFEHLER: MFN 4, −9 KEINE ANGABE 34, −6 KENNE ICH NICHT 178, Total missing 216, Total 5246.

3. **Die Vertrauensfrage pt03.** Text: „Tausch die markierte Variable gegen `pt03` und führ die Vorlage aus. Bei den Codes 2 bis 6 steht als Wertelabel nur ‚..‘: Das sind Zwischenstufen zwischen GAR KEIN VERTRAUEN (1) und GROSSES VERTRAUEN (7) ohne eigenes Wort.“
   **Vorlage `a3_pt03`** (live, Titel „Vorlage: eine Variable auszählen“):
   ```r
   # Codes, Wertelabels und Anzahlen einer Variable
   frequency(allbus, ⟦rh08b⟧)
   ```
   Ausgabe mit `pt03` (geprüft): 1 GAR KEIN VERTRAUEN 365, 2 .. 386, 3 .. 556, 4 .. 837, 5 .. 820, 6 .. 472, 7 GROSSES VERTRAUEN 156, Total valid 3592; −42 DATENFEHLER: MFN 3, −11 TNZ: SPLIT 1596, −9 KEINE ANGABE 55, Total missing 1654, Total 5246.

**Weiterdenken in der Probier-Werkstatt** (zugeklappt, „(für die Aufgabe nicht nötig)“):
„Für die Aufgabe reichen die Vorlagen oben. Hier ist Platz für eigene Fragen. Eine Idee: Vertrauen die Befragten den politischen Parteien (`pt15`) weniger als dem Bundestag? Vergleiche, wie viele GAR KEIN VERTRAUEN und wie viele GROSSES VERTRAUEN haben. Die Probier-Werkstatt startet mit einem Vorschlag.“
**Vorlage `frei_a3`:**
```r
# Eine Idee: Vertrauen in die politischen Parteien
frequency(allbus, pt15)
```
(Ausgabe zum Vergleich: pt15 GAR KEIN VERTRAUEN 539, GROSSES VERTRAUEN 28, gültig 3586; pt03: 365 und 156.)

**Antwortfragen:**

| id | Art | Label | Optionen | Ziel | Toleranz | Text richtig | Text falsch/Hinweis | Hilfezeile |
|---|---|---|---|---|---|---|---|---|
| a3-code1 | choice | rh08b: Was bedeutet der Code 1? | `viel` VIEL; `nichts` GAR NICHTS; `kenne` KENNE ICH NICHT | `viel` | – | Code 1 heißt VIEL: 169 Befragte halten viel von Horoskopen. | In der Zeile mit Value 1 steht rechts das Wertelabel. KENNE ICH NICHT hat den Code −6, ist also ein fehlender Wert. | Schritt 2, Spalte Label. |
| a3-kenne | number | rh08b: Wie viele Befragte kennen Horoskope nicht? | – | 178 | 0 | 178 Befragte mit dem Code −6 KENNE ICH NICHT. Sie zählen zu den fehlenden Werten. | Such in Schritt 2 unter ‚Total valid‘ die Zeile KENNE ICH NICHT und lies Spalte N. | Schritt 2, unter Total valid. |
| a3-gueltig-rh | number | rh08b: Wie viele gültige Antworten gibt es? | – | 5030 | 0 | 5.030 gültige Antworten: alle 5.246 minus 216 fehlende Werte. | Gesucht ist ‚Total valid‘, nicht ‚Total‘. Total sind alle Befragten. | Schritt 2, Zeile Total valid. |
| a3-split | number | pt03: Wie vielen Befragten wurde die Frage gar nicht gestellt? | – | 1596 | 0 | 1.596 Befragte mit −11 TNZ: SPLIT. Gefragt wurden also 3.650, gut zwei Drittel (knapp 70 %). | Gesucht ist die Zeile mit TNZ (trifft nicht zu). KEINE ANGABE heißt: gefragt, aber nicht geantwortet. Hast du in Schritt 3 `pt03` eingesetzt? | Schritt 3, Zeile −11. |
| a3-gueltig-pt | number | pt03: Wie viele gültige Antworten gibt es? | – | 3592 | 0 | 3.592 gültige Antworten. Für Aussagen zum Vertrauen in den Bundestag zählen nur sie. | Lies in Schritt 3 die Zeile ‚Total valid‘. Steht dort 5030, hast du noch rh08b ausgezählt: Tausch die markierte Stelle gegen `pt03`. | Schritt 3, Zeile Total valid. |
| a3-tnz | choice | Was heißt TNZ: SPLIT bei pt03? | `wollte` Die Person wollte nicht antworten.; `split` Die Frage stand nicht in ihrer Fassung des Fragebogens; sie wurde ihr gar nicht gestellt.; `verloren` Die Antwort ist verloren gegangen. | `split` | – | Genau: Der ALLBUS hat mehrere Fassungen des Fragebogens. Wer nicht antworten wollte, hat KEINE ANGABE (−9). | TNZ heißt ‚trifft nicht zu‘: Die Frage kam bei dieser Person gar nicht vor. Nicht antworten wollen ist KEINE ANGABE (−9), verlorene Antworten sind DATENFEHLER (−42). | Grundlage 3b. |

Nach dem Prüfen: „Deine Festlegung vorher war: …“.

**Hilfe, Stufe 1: Denkanstoß:** „In jeder Ausgabe stehen oben die Antworten, dann ‚Total valid‘, darunter die fehlenden Werte mit negativen Codes. Welche Zeile sagt ‚nicht gefragt‘, welche ‚gefragt, aber nicht geantwortet‘?“
**Hilfe, Stufe 2: Wo schaue ich?:** „rh08b: Schritt 2. pt03: Schritt 3, nachdem du `rh08b` gegen `pt03` getauscht hast. Codes stehen in Spalte Value, Wertelabels in Label, Anzahlen in N.“
**Hilfe, Stufe 3: Lösung:** „rh08b: Code 1 heißt VIEL, 178 kennen Horoskope nicht (−6), 5.030 gültige Antworten. pt03: 1.596 wurde die Frage nicht gestellt (−11 TNZ: SPLIT), gefragt wurden also 3.650 (gut zwei Drittel), gültig geantwortet haben 3.592. TNZ: SPLIT heißt: Die Frage stand nicht in ihrer Fassung des Fragebogens.“

**Ohne Grafik lösbar:** „Alle Ausgaben dieser Aufgabe sind Text.“

---

## 6 Thema 4: Wenn R sich beschwert

Kopf: Stein „4“, „Thema 4: Wenn R sich beschwert“.

### Grundlage 4
Kopf: „Grundlage zu Aufgabe 4“, Titel „Fehlermeldungen lesen“, Knopf „Schon klar? Direkt zu Aufgabe 4 ↓“.
Einleitung: „Was will R dir mit einer roten Meldung sagen? Etwa 8 Minuten.“

#### 4a So liest du eine Fehlermeldung
Schilder: „Im Bild“.

**Beispiel zuerst:** „Jemand will nach ‚klima‘ suchen und schreibt `find_var(allbus, klima)`. R antwortet in Rot. Das wirkt erschreckend, ist aber eine Auskunft: Die Meldung sagt, wo und was schiefging, und oft auch, wie du es behebst.“

**Bild `s1-fehler` (SVG, etwa 720 × 260).** Ein Konsolen-Ausschnitt (weiß, Rand `--line`, Monospace):
- Zeile 1 schwarz: `> find_var(allbus, klima)`
- Zeile 2 rot (`--rot`): `Fehler in find_var(allbus, klima) :`
- Zeile 3 rot: `` `pattern` must be a single character string.``
- Zeile 4 rot: `` ✖ Object `klima` not found (a variable name is not accepted here).``
Rechts daneben drei nummerierte Kreise mit Linien zu den Zeilen: ① an Zeile 2 „**wo:** in welcher Funktion“, ② an Zeile 3 „**was:** Das Suchmuster (pattern) muss ein Text sein.“, ③ an Zeile 4 „**Hinweis:** klima wurde als Name gelesen. Es fehlen Anführungszeichen: "klima".“ Unten klein: „In der Werkstatt steht ‚Error in‘ statt ‚Fehler in‘; der Rest ist gleich.“
Textfassung: „Konsole: find_var(allbus, klima). Darunter rot: Fehler in find_var(allbus, klima): pattern must be a single character string. Object klima not found, a variable name is not accepted here. Erstens zeigt die Meldung, wo: in find_var. Zweitens, was: Das Suchmuster muss ein Text sein. Drittens einen Hinweis: klima wurde als Name gelesen; es fehlen Anführungszeichen.“

**Kurz gesagt:** „Eine **Fehlermeldung** (Error, Fehler) heißt: R hat aufgehört, es gibt kein Ergebnis. Lies sie von vorn: Wo (welche Funktion)? Was? Der Name in Anführungszeichen oder Backticks zeigt meist die Stelle, die du ändern musst.“

**Genauer erklärt: Fehler, Warnung, Hinweis** (`details`):
- „**Fehler** (Error, Fehler): kein Ergebnis. Du musst etwas ändern.“
- „**Warnung** (Warning, Warnmeldung): Es gibt ein Ergebnis, aber R macht dich auf etwas aufmerksam. Lies sie trotzdem.“
- „**Hinweis** (Message): Information, etwa ‚No variables found matching …‘ oder die Zeilen beim Laden der Pakete. Kein Fehler.“
- „Manchmal steht hinter ‚Fehler in‘ eine Hilfsfunktion mit seltsamem Namen wie `.process_variables(data, ...)`. Dann zählt der Text danach.“
- „RStudio schreibt die Meldungen meist auf Deutsch, die Werkstatt auf Englisch. ‚Objekt nicht gefunden‘ heißt dort ‚object not found‘.“

**Häufige Verwechslung:** „Rot und Fehler. Auch die Meldungen beim Laden der Pakete sind farbig, etwa ‚Attaching core tidyverse packages‘ oder ‚Das folgende Objekt ist maskiert‘. Fehler beginnen mit ‚Fehler‘ oder ‚Error‘.“

#### 4b Die häufigsten Meldungen
Schilder: „Zuordnen“.

**Beispiel zuerst:** „Die meisten Fehler am Anfang sind Tippfehler. Sieben Meldungen, sechs Ursachen: Ordne jeder Meldung ihre Ursache zu.“

**Interaktion „Meldungs-Sortierer“** (wie das Zuordnen in Sitzung 4, Überblick: je Meldung ein `select` mit Label, Knopf „Prüfen“, Rückmeldung je Zeile in einer Hilfezeile mit `aria-describedby`, gesamt in `aria-live`):
Ursachen (Optionen, gleich für alle):
- `A` Funktionsname vertippt oder Paket nicht geladen
- `B` Objekt- oder Variablenname falsch geschrieben (Groß- und Kleinschreibung zählt)
- `C` Anführungszeichen fehlen
- `D` Klammer fehlt, die Zeile ist nicht fertig
- `E` Datei liegt nicht im Projektordner
- `F` Paket nicht installiert

| Nr. | Code | Meldung | Ziel | Rückmeldung richtig | Rückmeldung falsch |
|---|---|---|---|---|---|
| 1 | `codebuch(allbus)` | `konnte Funktion "codebuch" nicht finden` | A | Die Funktion heißt `codebook`. Dieselbe Meldung kommt, wenn `library(mariposa)` fehlt. | R kennt keine Funktion dieses Namens: vertippt oder Paket nicht geladen. |
| 2 | `find_var(Allbus, "klima")` | `Objekt 'Allbus' nicht gefunden` | B | R unterscheidet groß und klein: `allbus` gibt es, `Allbus` nicht. | Der Name in Anführungszeichen ist `Allbus` mit großem A. |
| 3 | `frequency(allbus, Pi08)` | ``Can't select columns that don't exist. ✖ Column `Pi08` doesn't exist.`` | B | Variablennamen sind klein geschrieben: `pi08`. | Column heißt Spalte, also Variable. Schau auf die Schreibweise von `Pi08`. |
| 4 | `find_var(allbus, klima)` | `` `pattern` must be a single character string.`` | C | Das Suchwort ist ein Text und braucht Anführungszeichen: `"klima"`. | Pattern heißt Suchmuster; es muss ein Text sein. |
| 5 | `find_var(allbus, "klima"` | Werkstatt: `unexpected end of input`. In RStudio erscheint keine Meldung, die Konsole zeigt nur `+` und wartet. | D | Die schließende Klammer fehlt. R wartet auf den Rest. | Die Zeile endet, bevor die Klammer zu ist. |
| 6 | `read_spss("ZA8831_v1-3-0.sav")` | `File 'ZA8831_v1-3-0.sav' does not exist.` | E | R sucht im Arbeitsordner. Leg die Datei in den Projektordner oder nimm `file.choose()`. | Den Dateinamen kennt R, die Datei liegt nur nicht dort, wo R sucht. |
| 7 | `library(mariposa)` | `es gibt kein Paket namens ‘mariposa’` | F | Einmal `install.packages("mariposa")` ausführen. | Laden geht erst, wenn das Paket installiert ist. |
Gesamtrückmeldung: alle richtig „Alle sieben richtig. Die meisten Fehler sind Tippfehler; der Name in der Meldung zeigt dir, wo.“; sonst „… von 7 richtig. Unter jeder Meldung steht, worauf du achten kannst.“; offene: „Noch … ohne Zuordnung.“
Textfassung: Die Zuordnung ist selbst Text; keine Grafik.
(Meldungen 1, 2, 7 in RStudio-Deutsch; in der Werkstatt englisch: `could not find function "codebuch"`, `object 'Allbus' not found`, `there is no package called 'mariposa'`. Beide Fassungen in der Rückmeldung nennen. Meldung 5 gibt es nur in der Werkstatt; RStudio wartet mit `+`, beim Ausführen der ganzen Datei mit Source meldet es `unerwartetes Ende der Eingabe`.)

**Kurz gesagt:** „Die meisten Fehlermeldungen am Anfang haben eine von sechs Ursachen: vertippter Funktionsname, falsch geschriebener Name, fehlende Anführungszeichen, fehlende Klammer, Datei am falschen Ort, Paket nicht installiert.“

**Genauer erklärt: Wenn die Konsole `+` zeigt** (`details`): „Steht in der RStudio-Konsole am Anfang ein `+` statt `>`, wartet R auf den Rest einer Zeile, meist auf eine Klammer oder ein Anführungszeichen. Drück Esc, reparier die Zeile im Skript und führ sie neu aus. Ein vergessenes Komma zwischen zwei Argumenten meldet R als ‚unerwartete Zeichenkettenkonstante‘ (unexpected string constant).“

**Häufige Verwechslung:** „Variablenname und Suchwort. Bei `frequency(allbus, pi08)` steht der Variablenname ohne Anführungszeichen, bei `find_var(allbus, "klima")` das Suchwort mit.“

### Aufgabe 4: Reparieren (Zusatz)
Kopf: „A4“, „Aufgabe 4: Reparieren“, Schild „Zusatz“. Link „↑ Grundlage 4 nachlesen“.

**Leitfrage:** „Was will R dir mit einer Fehlermeldung sagen?“

**Ziel:** „Am Ende hast du vier kaputte Zeilen mit Hilfe der Fehlermeldungen repariert und aus den reparierten Ausgaben je eine Zahl abgelesen.“ Grundlage: „Grundlage 4, Fehlermeldungen lesen“.

**Erst festlegen** (Radios, id `a4-fest`): „**Erst festlegen:** R zeigt eine Fehlermeldung. Was machst du zuerst?“
Optionen: „Den ganzen Code neu abtippen.“, „Die Meldung lesen: Welcher Name steht darin?“, „RStudio neu starten.“

**Text:** „In jeder Vorlage steckt genau ein Fehler. Führ sie aus, lies die Meldung, repariere die Zeile und führ sie noch einmal aus. Zurücksetzen holt die kaputte Zeile zurück.“ (Keine Markierungen in diesen Vorlagen, damit die Stelle nicht verraten wird; der Werkstatt-Hinweis zu markierten Stellen entfällt hier.)

**Schritte:**
1. **Vorlage `a4_1`** (live, Titel „Reparieren 1“):
   ```r
   # Wie viele kennen Tarot-Karten nicht?
   frequenzy(allbus, rh09b)
   ```
   Meldung: `konnte Funktion "frequenzy" nicht finden` (Werkstatt: `could not find function "frequenzy"`). Repariert: `frequency(allbus, rh09b)` → −6 KENNE ICH NICHT 248.
2. **Vorlage `a4_2`** (live, Titel „Reparieren 2“):
   ```r
   # Gibt es Fragen zur Nachbarschaft?
   find_var(allbus, nachbar)
   ```
   Meldung: `` `pattern` must be a single character string. ✖ Object `nachbar` not found (a variable name is not accepted here).`` Repariert: `find_var(allbus, "nachbar")` → 2 Treffer: `li08` WICHTIGKEIT: NACHBARSCHAFT, `mc03` AUSLAENDER: KONTAKT IN D. NACHBARSCHAFT?
3. **Vorlage `a4_3`** (live, Titel „Reparieren 3“):
   ```r
   # Wie wichtig sind Freunde und Bekannte?
   frequency(allbus, Li04)
   ```
   Meldung: ``Can't select columns that don't exist. ✖ Column `Li04` doesn't exist.`` Repariert: `frequency(allbus, li04)` → Code 7 (7 - SEHR WICHTIG) 1534, gültig 5218.
4. **Vorlage `a4_4`** (live, Titel „Reparieren 4“):
   ```r
   # Welche Fragen drehen sich um die Kirche?
   find_var(allbus, "kirche"
   ```
   Meldung in der Werkstatt: `unexpected end of input`. In RStudio erscheint keine Meldung; die Konsole zeigt `+` und wartet auf die Klammer (Esc bricht ab). Repariert: `find_var(allbus, "kirche")` → 11 Treffer (li09, mn06, rd04, rd08, rd11, rd13, rd15, rd20, rd21, pt06, pt07).

**Weiterdenken in der Probier-Werkstatt** (zugeklappt, „(für die Aufgabe nicht nötig)“):
„Für die Aufgabe reichen die Vorlagen oben. Hier ist Platz für eigene Fragen. Eine Idee: Manche Fehlermeldungen sagen dir sogar, was erlaubt ist. Die Vorlage sucht nur in den Variablennamen. Ändere `"name"` in `"titel"` und lies, welche Einstellungen R vorschlägt. Die Probier-Werkstatt startet mit einem Vorschlag.“
**Vorlage `frei_a4`:**
```r
# Eine Idee: nur in den Variablennamen suchen
# Probier danach search = "titel" und lies die Meldung
find_var(allbus, "pt", search = "name")
```
(Ausgabe: 15 Vertrauensfragen pt01 bis pt20. Mit `"titel"`: `'arg' should be one of “name_label”, “name”, “label”` bzw. deutsch `'arg' sollte eines von '“name_label”, “name”, “label”' sein`.)

**Antwortfragen:**

| id | Art | Label | Optionen | Ziel | Toleranz | Text richtig | Text falsch/Hinweis | Hilfezeile |
|---|---|---|---|---|---|---|---|---|
| a4-tarot | number | Reparieren 1: Wie viele Befragte kennen Tarot-Karten nicht? | – | 248 | 0 | 248 mit −6 KENNE ICH NICHT. Der Fehler war ein Tippfehler im Funktionsnamen: frequency. | R kennt keine Funktion `frequenzy`. Schreib `frequency` und lies dann die Zeile KENNE ICH NICHT. | Schritt 1, Zeile −6. |
| a4-nachbar | number | Reparieren 2: Wie viele Treffer findet die Suche nach Nachbarschaft? | – | 2 | 0 | 2 Treffer: li08 und mc03. Das Suchwort braucht Anführungszeichen. | Die Meldung sagt: pattern muss ein Text sein. Setz `nachbar` in Anführungszeichen und zähl die Zeilen. | Schritt 2. |
| a4-freunde | number | Reparieren 3: Wie viele Befragte finden Freunde und Bekannte sehr wichtig (Code 7)? | – | 1534 | 0 | 1.534 Befragte. Der Variablenname ist klein geschrieben: li04. | Column `Li04` doesn't exist: Schreib den Namen klein, `li04`, und lies in Spalte N die Zeile mit Value 7. | Schritt 3, Value 7. |
| a4-kirche | number | Reparieren 4: Wie viele Treffer findet die Suche nach ‚kirche‘? | – | 11 | 0 | 11 Treffer, von WICHTIGKEIT: KIRCHE bis zum Vertrauen in die Kirchen. Die schließende Klammer hatte gefehlt. | Am Ende der Zeile fehlt die schließende Klammer `)`. Ergänze sie und zähl die Zeilen der Ausgabe. | Schritt 4. |
| a4-plus | choice | In der RStudio-Konsole steht am Anfang ein `+` statt `>`. Was ist los? | `kaputt` R ist abgestürzt.; `wartet` R wartet auf den Rest der Zeile: Meist fehlt eine Klammer oder ein Anführungszeichen.; `plus` R will etwas addieren. | `wartet` | – | Genau: Esc drücken, die Zeile im Skript reparieren und neu ausführen. | R ist nicht abgestürzt. Das `+` heißt: Die letzte Zeile ist noch nicht fertig (Grundlage 4b). | Grundlage 4b, „Wenn die Konsole + zeigt“. |

Nach dem Prüfen: „Deine Festlegung vorher war: …“.

**Hilfe, Stufe 1: Denkanstoß:** „Jede Meldung nennt einen Namen in Anführungszeichen oder Backticks. Genau dort steckt der Fehler. Vergleiche die Schreibweise mit Grundlage 4b.“
**Hilfe, Stufe 2: Wo schaue ich?:** „Grundlage 4b, Meldungs-Sortierer: Jede der vier Meldungen steht dort fast wörtlich, nur mit einem anderen Namen. Such die Meldung, die zu deiner passt, und lies, welche Ursache dazugehört. Die Tabelle ‚Hilfe: R meldet einen Fehler‘ unter der Aufgabe sagt dir, was hilft.“
**Hilfe, Stufe 3: Lösung:** „1 `frequency(allbus, rh09b)`: 248 kennen Tarot nicht. 2 `find_var(allbus, "nachbar")`: 2 Treffer. 3 `frequency(allbus, li04)`: 1.534 bei Code 7. 4 `find_var(allbus, "kirche")`: 11 Treffer. Ein `+` in der Konsole heißt: R wartet auf den Rest der Zeile.“

**Ohne Grafik lösbar:** „Alle Ausgaben dieser Aufgabe sind Text.“

---

## 7 Überblick: Vom Rechner bis zur passenden Variable

Kopf: Stein „✓“, „Überblick zu allen Aufgaben“, Titel „Welches Werkzeug für welche Frage?“
Einleitung: „Alle vier Themen zusammen: welcher Schritt wann dran ist und was dafür stimmen muss.“

**Bild `s1-weg` (SVG, etwa 760 × 220, Ablauf wie der Entscheidungsbaum in Sitzung 4, aber als Kette).** Fünf abgerundete Kästen von links nach rechts, verbunden durch grüne Pfeile:
1. „Projekt öffnen“ (darunter klein: „Datei im Projektordner“)
2. „Startblock“ (`library()`, `read_spss()`; darunter „allbus im Environment, dim(allbus)“)
3. „Suchen“ (`find_var()`; darunter „kurzer Wortanfang, ü als ue“)
4. „Lesen“ (`frequency()`, `codebook()`; darunter „Codes, Wertelabels, fehlende Werte“)
5. „Entscheiden“ (darunter „passt / nah dran / neu fragen“)
Von Kasten 3 ein gestrichelter Pfeil zurück auf sich selbst, beschriftet „kein Treffer? anders suchen“. Unter der Kette ein schmales Band „Fehlermeldung? Lesen: wo, was, welcher Name“ über die ganze Breite (Farbe `--roth`, Rand `--rot`).
Farben: Kästen `--blauh` mit Rand `--blaud`, Funktionsnamen in Monospace grün (`--gruend`).
Textfassung: „Ablauf in fünf Schritten. Erstens Projekt öffnen; die Datei liegt im Projektordner. Zweitens den Startblock ausführen: library und read_spss; allbus steht dann im Environment, prüfen mit dim(allbus). Drittens suchen mit find_var: kurzer Wortanfang, ü als ue; bei keinem Treffer anders suchen. Viertens lesen mit frequency oder codebook: Codes, Wertelabels, fehlende Werte. Fünftens entscheiden: passt, nah dran oder neu fragen. Bei jeder Fehlermeldung: lesen, wo, was, welcher Name.“

**Interaktion „Ordne jeder Frage ein Werkzeug zu“** (`select` je Zeile, wie Sitzung 4 V6; Knopf „Prüfen“):
Optionen: `start` „Startblock ausführen“, `dim` „dim()“, `find` „find_var()“, `freq` „frequency()“, `cb` „codebook() in RStudio“.
| Nr. | Frage | Ziel | Rückmeldung (Hilfezeile) |
|---|---|---|---|
| 1 | R meldet: Objekt 'allbus' nicht gefunden. | start | Erst der Startblock legt `allbus` an. |
| 2 | Gibt es eine Frage zum Bücherlesen? | find | Suchen in Namen und Variablenlabels: `find_var()`. |
| 3 | Welche Codes hat pi08, und wie viele haben gültig geantwortet? Du arbeitest hier in der Werkstatt. | freq | Für eine Variable als Text: `frequency()`. Den Viewer von `codebook()` gibt es nur in RStudio. |
| 4 | Du willst alle Variablen mit ihren Codes durchblättern und mit Strg + F suchen. | cb | Das ganze Codebuch im Viewer: `codebook(allbus)`. |
| 5 | Ist der ganze Datensatz angekommen: wie viele Befragte, wie viele Variablen? | dim | `dim(allbus)` zählt Zeilen und Spalten. |
Gesamt: alle richtig „Alle fünf richtig.“; sonst „… von 5 richtig. Unter jeder Frage steht, warum.“
Bei falscher Wahl: Hilfezeile „Passt nicht. “ + Rückmeldung der Zeile; bei richtiger „Passt: “ + Rückmeldung.

**Kurz gesagt:** „Erst die Datei an den richtigen Ort, dann der Startblock, dann suchen, dann lesen, dann entscheiden. Bei jedem Schritt kann R sich beschweren; die Meldung sagt dir, wo.“

**Voraussetzungen: Was jeder Schritt braucht und wo er täuschen kann** (Tabelle mit `caption` „Voraussetzungen je Schritt“):
| Schritt | braucht | Vorsicht |
|---|---|---|
| Pakete laden: `library()` | einmal `install.packages()` | in jeder neuen R-Sitzung neu laden; erst tidyverse, dann mariposa |
| Einlesen: `read_spss()` | die Datei im Projektordner, Name genau so | sonst `file.choose()`; die Datei nicht weitergeben (GESIS) |
| Suchen: `find_var()` | Suchwort in Anführungszeichen, kurzer Wortanfang, ae/oe/ue | kein Treffer heißt nicht „gibt es nicht“; ein Treffer heißt nicht „passt“ |
| Lesen: `frequency()`, `codebook()` | Variablenname genau, klein, ohne Anführungszeichen | Total ist nicht Total valid; TNZ heißt: nicht gefragt; Zahlen sind ungewichtet |
Darunter: „Für alle gilt: Das Variablenlabel ist eine Kurzfassung. Ob eine Variable deine Idee misst (ihre **Gültigkeit**, Aufgabe 2), entscheidest du mit Label, Wertelabels und notfalls dem Fragebogen.“

**Häufige Verwechslung:** „Eine Variable finden und eine Variable verstehen. `find_var()` sagt dir, dass es pt03 gibt. Erst `frequency()` oder das Codebuch zeigt, dass nur gut zwei Drittel gefragt wurden und was die sieben Stufen bedeuten.“

---

## 8 Zum Schluss: Mitnehmen

### Das Wichtigste aus dieser Sitzung
- **R** rechnet, **RStudio** ist das Programm drumherum: Im Skript hebst du Code auf, in der Konsole antwortet R, im Environment siehst du deine Objekte.
- Ein **Projekt** hält alles in einem Ordner. Liegt die Datei dort, genügt `read_spss("ZA8831_v1-3-0.sav")`; sonst hilft `file.choose()`.
- Pakete **einmal installieren**, in jeder Sitzung **laden**: Der Startblock lädt erst tidyverse, dann mariposa, und liest die Datei ein.
- Eine Zeile lesen: **Objekt** `<-` **Funktion**(**Argumente**). Text steht in Anführungszeichen, Namen von Objekten und Variablen nicht.
- `find_var()` sucht in Variablennamen und Variablenlabels. Kein Treffer heißt nicht „gibt es nicht“ (ae, oe, ue, Wortanfang, anderes Wort), ein Treffer heißt nicht „passt“ (Label lesen).
- Codebuch und `frequency()` zeigen **Codes**, **Wertelabels** und **fehlende Werte**. Negative Codes sind fehlend; **TNZ** heißt: Die Frage wurde gar nicht gestellt.
- **Gültige Antworten** = alle Befragten minus alle fehlenden Werte. Für deine Aussagen zählen nur sie.
- Eine **Fehlermeldung** ist eine Auskunft: Lies, wo und was, und schau auf den Namen in Anführungszeichen.

### Prüf dich selbst (5 Fragen, je Prüfen-Knopf, Rückmeldung „Deine Wahl: „…“. “ + Begründung)
1. „In `allbus <- read_spss("ZA8831_v1-3-0.sav")`: Was ist `allbus`?“ Optionen: „eine Funktion“, „ein Objekt: der Name, unter dem R den Datensatz ablegt“, „ein Argument“. Richtig: 2. Begründung: „`<-` legt das Ergebnis rechts unter dem Namen links ab. `read_spss()` ist die Funktion, der Dateiname ihr Argument (Vorweg: R lesen).“
2. „`find_var(allbus, "ärztl")` findet nichts. Was probierst du als Nächstes?“ Optionen: „nichts, die Frage gibt es nicht“, „`"aerzt"`“, „`"ÄRZTL"`“. Richtig: 2. Begründung: „Die Labels schreiben ä als AE. `"aerzt"` findet ca04 VERHALTENSBEURTEIL: AERZTL. STERBEHILFE. Groß- und Kleinschreibung ist egal (Grundlage 2).“
3. „Bei einer Frage steht ‚−11 TNZ: SPLIT‘ mit 1.647 Befragten. Was heißt das?“ Optionen: „1.647 wollten nicht antworten“, „1.647 wurde die Frage gar nicht gestellt“, „1.647 haben ‚weiß nicht‘ gesagt“. Richtig: 2. Begründung: „TNZ heißt ‚trifft nicht zu‘: Die Frage stand nicht in ihrer Fassung des Fragebogens. Nicht antworten wollen ist KEINE ANGABE, ‚weiß nicht‘ hat einen eigenen Code (Grundlage 3b).“
4. „`find_var()` findet zu deinem Suchwort einen Treffer. Was weißt du jetzt?“ Optionen: „Die Variable misst genau, was ich suche.“, „Das Suchwort steht im Namen oder im Variablenlabel. Ob die Variable passt, zeigen Label und Codes.“, „Die Frage wurde allen gestellt.“ Richtig: 2. Begründung: „‚tier‘ findet RESPEKTIEREN, ‚einsam‘ findet GEMEINSAMER HAUSHALT. Ein Treffer ist ein Kandidat (Grundlage 2, Aufgabe 2).“
5. „Du startest RStudio neu und führst sofort `find_var(allbus, "klima")` aus. R meldet: Objekt 'allbus' nicht gefunden. Was fehlt?“ Optionen: „`install.packages("mariposa")`“, „der Startblock: `library()` und `read_spss()`“, „Anführungszeichen um allbus“. Richtig: 2. Begründung: „Nach dem Neustart kennt R weder die Pakete noch `allbus`. Installiert bleibt installiert; laden und einlesen musst du jedes Mal (Grundlage 1d).“

### Dein Skript zum Mitnehmen
Text: „Alle Vorlagen dieser Sitzung in einer Datei, mit Kommentaren. Öffne sie in RStudio in deinem Projekt und führe sie Block für Block aus.“ Knopf „Skript herunterladen (sitzung1.R)“, Link „→ Nachlesen im R-Workshop, Kapitel 1 und Abschnitt 4.4“.
Kopf der Datei:
```r
# Sitzung 1: Einstieg
# Statistikatlas, Methoden Ib, ALLBUS 2023 (ZA8831 v1.3.0)
# Markierte Stellen aus dem Atlas stehen hier mit ihrem Beispielwert.
```
Teile in dieser Reihenfolge (je `# ---- Titel ----` davor; markierte Stellen mit Beispielwert ersetzt):
1. `start` (Startblock), darunter als Kommentar: `# Findet R die Datei nicht: allbus <- read_spss(file.choose())`
2. `a1_dim`
3. `a1_zellen` mit `5246` und `579`
4. `a2_idee1`, `a2_idee2` mit `"fluecht"`, `a2_idee3` mit `"vertrauen"`, `a2_idee4` mit `"einsam"`
5. `a3_codebuch`, `a3_rh08b`, `a3_pt03` mit `pt03`
6. A4 repariert: `frequency(allbus, rh09b)`, `find_var(allbus, "nachbar")`, `frequency(allbus, li04)`, `find_var(allbus, "kirche")` (je mit dem Kommentar der Vorlage)
Alle Teile laufen in `sitzung01-zahlen.R` fehlerfrei; der Startblock dort mit vollem Pfad.

---

## 9 Hilfe bei R-Fehlermeldungen (unter jeder Aufgabe, zugeklappt „Hilfe: R meldet einen Fehler“)

Tabelle mit `caption` „Was R sagt und was du tust“:
| R meldet (RStudio deutsch / Werkstatt englisch) | Das hilft |
|---|---|
| `es gibt kein Paket namens ‘mariposa’` / `there is no package called 'mariposa'` | Einmal `install.packages("mariposa")` ausführen (ebenso `"tidyverse"`), dann den Startblock noch einmal. |
| `konnte Funktion "find_var" nicht finden` / `could not find function "find_var"` | Den Startblock ausführen (`library(mariposa)`). Läuft er schon: Schreibweise der Funktion prüfen. |
| `Objekt 'allbus' nicht gefunden` / `object 'allbus' not found` | Die Zeile mit `read_spss()` aus dem Startblock ausführen; `allbus` klein schreiben. |
| `File 'ZA8831_v1-3-0.sav' does not exist.` | RStudio über dein Projekt öffnen und die Datei in den Projektordner legen (Grundlage 1c). Sonst `allbus <- read_spss(file.choose())`; unter macOS öffnet sich das Fenster manchmal hinter RStudio. |
| `` `pattern` must be a single character string.`` | Das Suchwort in Anführungszeichen setzen: `find_var(allbus, "klima")`. |
| ``Can't select columns that don't exist. ✖ Column `…` doesn't exist.`` | Den Variablennamen klein und genau so schreiben, wie `find_var()` ihn zeigt. |
| `unerwartetes Ende der Eingabe` / `unexpected end of input`; die Konsole zeigt `+` | Eine Klammer oder ein Anführungszeichen fehlt. In der Konsole Esc drücken, die Zeile reparieren. |
| `unerwartete Zeichenkettenkonstante` / `unexpected string constant` | Zwischen zwei Argumenten fehlt ein Komma. |
| `No variables found matching "…".` | Kein Fehler: anders suchen (ae, oe, ue statt Umlaut, kürzerer Wortanfang, anderes Wort). |
| `Objekt 'Befragte' nicht gefunden` / `object 'Befragte' not found` (Aufgabe 1) | Die markierten Stellen durch Zahlen ersetzen. |
| Farbige Zeilen beim Laden: „Attaching core tidyverse packages“, „Conflicts“, „Das folgende Objekt ist maskiert“ (englisch: „masked from“) | Kein Fehler. Weiterarbeiten. |

---

## 10 Entscheidungen (selbst getroffen, mit Begründung)

- **E1 `frequency()` schon in Sitzung 1 (als „erster Blick“).** Der Auftrag nennt sie; vor allem kann die Code-Werkstatt den Viewer von `codebook()` nicht zeigen. `frequency(allbus, x)` liefert dieselben Angaben (Codes, Wertelabels, N, fehlende Werte, gültige Antworten) als Text, auch für Screenreader. Nur gelesen werden Codes, Labels und N; Prozente, Kennzahlen und fehlende Werte als Thema bleiben Sitzung 3. **Folge für Sitzung 3:** `frequency()` dort als „kennst du aus Sitzung 1“ markieren und vertiefen (Prozentbasis, Valid %). Die Funktionstabelle im Leitfaden (Sitzung 3: `frequency()` neu) sollte angepasst werden.
- **E2 Keine Pipe in Sitzung 1.** Leitfaden und Folien: Pipe ab Sitzung 2. Darum `frequency(allbus, rh08b)` statt `allbus %>% frequency(rh08b)`. Sitzung 4 erklärt ausdrücklich, dass beides dasselbe ist (R lesen, Genauer erklärt). Die Tastenkürzel nennen `%>%` nur mit „brauchst du ab Sitzung 2“.
- **E3 `dim(allbus)` statt nur Environment.** Barrierefrei (Text statt Fenster), funktioniert in der Werkstatt, zeigt Funktion mit einem Argument. RStudio-Environment bleibt als zweiter Weg (Frage a1-env).
- **E4 R als Taschenrechner (`zellen <- 5246 * 579`).** Greift die Folie „Drei Millionen Zellen“ auf, übt `<-` und markierte Stellen mit Zahlen aus der eigenen Ausgabe. Leitfaden nennt R als Taschenrechner erst in Sitzung 3; hier nur als Einstieg in die Werkstatt.
- **E5 Rollenszenario entfällt** (Design §2). Die vier Ideen der alten Aufgabe bleiben als Aufgabe 2, damit Nachholende dasselbe Material wie im Seminar finden. Statt „übernehmen/beauftragen“-Stempeln gibt es Antwortfragen; die offene Entscheidung (Idee 2 und 3) wandert in „Fürs Plenum“.
- **E6 Vorbelegte falsche Suchwörter in A2** (`"flüchtling"`, `"politik"`, `"einsam"`) als markierte Stellen: Die Studierenden erleben „kein Treffer“ bzw. „falscher Treffer“ selbst und wenden Grundlage 2 an. Grundlage 2 nutzt andere Wörter (bücher/buecher, handy/smartphone, tier, internet, klima, sport/freizeit) und verrät die Lösungswörter nicht.
- **E7 `codebook(allbus)` als copy-only-Vorlage, dazu `codebook(allbus, rh08b)`.** Leitfaden: Codebuch als Ganzes, darin mit Strg + F suchen; das geht nur im RStudio-Viewer. Die zweite Zeile zeigt die Form mit Variablennamen, die Sitzung 2 als „kennst du aus Sitzung 1“ aufgreift (dort Entscheidung 2). Die Werkstatt zeigt von `codebook()` ohne Hülle nur eine Kurzfassung (Zahl der Variablen und Fälle), mit der in Sitzung 2 geplanten Hülle (`summary(codebook(…, view = FALSE))`) Labels und fehlende Werte, aber keine Zahl der gültigen Antworten. Die Aufgaben lesen darum mit `frequency()`, wo „Total valid“ als eigene Zeile steht (Zielwerte a3-gueltig-rh, a3-gueltig-pt).
- **E8 Thema 4 (Fehlermeldungen) als Zusatz am Ende.** Fehler sind die größte Hürde der ersten Sitzung (alter Fehler-Decoder, Folien „Falls es hakt“), aber die drei Pflichtaufgaben füllen die 45 Minuten. Die Fehlerhilfe-Tabelle unter jeder Aufgabe deckt die Pflichtaufgaben ab. Die A4-Vorlagen haben keine Markierung, damit die Fehlerstelle nicht verraten wird.
- **E9 Variablen:** Grundlagen la01, lm30, vi01, xr19/xr20/lm27–lm34, pi08, li03, mode (nur Zahl 1.587 in Genauer erklärt), eastwest; Aufgaben rh08b, mi05, mp16–mp19, pt03/pt12/pt15, st01, pe01, dp03, xs01, li04, mc04, rh09b, li08, mc03, Kirche-Treffer. Keine Überschneidung zwischen Grundlage und Aufgabe. hs01 und ls01 (Sitzung 4) und pa02a (Folien Sitzung 2) sind nicht verwendet.
- **E10 Leitfrage im Kapitelkopf** erweitert („… und wie findest du darin die Frage, die dich interessiert?“), weil die Sitzung neben dem Einlesen vor allem das Finden und Lesen von Variablen übt. `curriculum.ts` kann die kurze Frage behalten.
- **E11 Keine Bevölkerungszahl für den Osten.** Die Folie nennt „knapp 17 %“; das lässt sich nicht aus der Datei rechnen. Im Text steht nur der Anteil unter den Befragten (32 %, berechnet).
- **E12 Grundlage 1 nennt keine genaue Befragten- oder Variablenzahl** („einige tausend“, „mehrere hundert“), damit Festlegen und Fragen in Aufgabe 1 offen bleiben. Ab Thema 3 (nach Aufgabe 1) stehen die Zahlen in Ausgaben.
- **E13 Alle Zahlenziele ganzzahlig, Toleranz 0.** `judge()` prüft exakt; deutsche und R-Schreibweise („5.030“, „5030“) werden beide erkannt. Die einzige Kommazahl (35,15549 Tage) ist als Auswahlfrage gestellt.
- **E14 Projekt statt `file.choose()` als Standard.** Sitzung 4 setzt „RStudio über das Projekt öffnen“ voraus; die alte Aufgabe nahm `file.choose()` als Standard. `file.choose()` bleibt als Ausweg.
- **E15 Datei-Zone:** Text der bestehenden `DataDrop` bleibt; neu sind nur die Sätze um die Zone und der Zustand „schon gespeichert“.

## 11 Abweichungen zu den Folien der Sitzung (`Sitzung1_Folien.pptx`, `_build_folien.py`)

1. **Rolle:** Folien 21–22, 24, 27–28: Abgeordnetenbüro, „übernehmen/beauftragen“, Stempel, Stempelbilanz. Kapitel: keine Rolle, vier Ideen als Aufgabe 2 mit Antwortfragen, Plenum als „Fürs Plenum“.
2. **Startblock:** Folie 21 nennt nur `library(mariposa)`; Kapitel: `library(tidyverse)` vor `library(mariposa)`.
3. **Projekt:** Die Folien führen kein RStudio-Projekt ein (Sitzung 2 nutzt „Set Working Directory“). Kapitel: Projekt als Standard, `file.choose()` als Ausweg.
4. **`frequency()`, `dim()`, R als Taschenrechner** sind neu gegenüber den Folien (Folien Sitzung 2, Notizen: „Gültige Antworten bräuchte frequency() … kommt in Sitzung 3“).
5. **„Handschlag“** (5.246/579 im Environment ablesen und eintragen, Folien 21–24) heißt im Kapitel nicht mehr so; die Zahlen kommen aus `dim(allbus)` und dem Environment (Aufgabe 1).
6. **Fehler-Decoder, Partnermodus, Notfallkonsole** (Folien 19, 22, 26) gibt es im Kapitel nicht; dafür Thema 4, die Fehlerhilfe-Tabelle und die Code-Werkstatt (ersetzt die Notfallkonsole).
7. **Gestufte Hilfen:** Folie 16 „Denkanstoß → Verweis → Gerüst → Lösung“ (vier Stufen); Kapitel: drei Stufen (Denkanstoß, Wo schaue ich?, Lösung).
8. **Ablauf der Sitzung:** Folie 15 „Auftrag im Atlas mit einer Rolle … gerechnet wird in RStudio, der Browser prüft“; Kapitel: Grundlage und Aufgabe je Thema, gerechnet in der Werkstatt oder in RStudio.
9. **Folie 17 „Zehn Stationen“, „jede mit eigener Rolle“:** Der Lernpfad hat elf Sitzungen, ohne Rollen.
10. **Datei laden:** Folie 21 „ALLBUS-Datei in den Browser laden“ (jede Sitzung neu); Kapitel: einmal laden, bleibt gespeichert.
11. **Zeitplan:** Folien: Arbeitsphase nur bis Idee 1, Idee 2 danach, Ideen 3, 4 und eigene Idee bis Sitzung 2. Kapitel: alle vier Ideen in Aufgabe 2 (Pflicht), eigene Idee in der Probier-Werkstatt.
12. **Codebuch:** Die Folien von Sitzung 2 nutzen `codebook(allbus, hs01)` mit Variablenname; das Kapitel bleibt beim Leitfaden: `codebook(allbus)` als Ganzes, Einzelvariable mit `frequency()`.
13. **Folie 11 „Drei Millionen Zellen“** gibt 3.037.434 vor; im Kapitel rechnen die Studierenden die Zahl selbst aus (Aufgabe 1, Schritt 3).

## 12 Selbstprüfung (schwache Studentin ohne Vorwissen, Pflichtaufgaben)

- **Jede Vorlage läuft für sich:** Alle Werkstatt-Vorlagen (a1_dim, a1_zellen, frei_a1, a2_idee1–4, frei_a2, a3_codebuch, a3_rh08b, a3_pt03, frei_a3, a4_1–4 in reparierter Form, frei_a4) brauchen nur `allbus`; keine nutzt Objekte aus einer anderen Werkstatt (`zellen` entsteht in derselben Vorlage). Geprüft in `sitzung01-zahlen.R`, Abschnitt „Vorlagen einzeln“: jede in einer frischen Umgebung, die nur `allbus` enthält. Die kaputten A4-Vorlagen und a1_zellen ohne eingesetzte Zahlen werfen genau die beschriebenen Fehler.

- **A1 (etwa 15 min):** Datei laden braucht nur die .sav aus dem Seminar; ohne Datei sagt der Text, wo es sie gibt. Erster Lauf etwa 30–40 s Wartezeit, steht im Text. `dim()` ist erklärt (Zeilen, Spalten). Schritt 3: Wer die Marken nicht ersetzt, bekommt „object 'Befragte' not found“; der Text unter der Vorlage erklärt genau diese Meldung. Die Kommazahl 35.15549 ist im Text erklärt, Frage als Auswahl. Frage a1-env ist auch ohne RStudio aus Grundlage 1a lösbar. Zielwerte = Ausgabe: 5246, 579 (geprüft).
- **A2 (etwa 15 min):** Jede Vorlage startet mit einem Wort, das scheitert oder in die Irre führt; der Schritttext sagt, was zu tun ist („so ändern, wie in Grundlage 2 gelernt“, „Wortanfang“, „welches Wort stünde im Label“, „allein“, „freund“). Stolperstelle „fluechtling“ (nur 1 Treffer) ist im Schritttext („kurzer Wortanfang“) und in der Rückmeldung abgefangen. Zielwert 5 = Zeilen der Ausgabe von `"fluecht"` (geprüft). Auswahlfragen sind aus den Labels lesbar.
- **A3 (etwa 11 min):** `frequency()`-Ausgabe ist im Schritttext Spalte für Spalte erklärt; „..“ als Wertelabel ist erklärt. Typischer Fehler: Marke nicht getauscht → 5030 statt 3592; die Rückmeldung zu a3-gueltig-pt fängt das ab. Zielwerte = Spalte N der Ausgabe (178, 5030, 1596, 3592; geprüft).
- **Summe Pflicht:** etwa 41 Minuten (nach der Prüfung vom 23.11. angehoben), knapp unter 45. Wer RStudio noch nicht hat, kann alle Pflichtfragen mit der Werkstatt lösen.
- **Barrierefreiheit:** Keine Aufgabe braucht eine Grafik; alle R-Ausgaben sind Text. Bilder: s1-zeile, s1-werkstatt, s1-rstudio, s1-projekt, s1-find-var, s1-environment, s1-fehler, s1-weg mit Textfassung; s1-pi08 und die Formel sind HTML-Text. Interaktionen (Fensterwahl, Suchwort-Labor, Tabellen-Hervorhebung, Sortierer, Zuordnen) haben Knöpfe/Selects mit Labels und `aria-live`-Rückmeldung, Hervorhebung nie nur über Farbe.

## 13 Offene Punkte für den Bau (Bedenken)

- In webR ungeprüft: Ausgabe von `find_var()` ohne Treffer (sollte als Hinweis/Message erscheinen, das unsichtbare leere Ergebnis wird nicht gedruckt), Breite der `frequency()`-Tabelle in der Ausgabe, Parse-Fehler bei fehlender Klammer (A4, Schritt 4). Bitte im Browser prüfen.
- `names(allbus)` (Probier-Werkstatt A1) gibt etwa 97 Zeilen aus; liegt unter `MAX_LINES = 300`.
- Sitzung 3 wird parallel geplant: Abstimmung nötig, dass `frequency()` dort als „kennst du aus Sitzung 1“ läuft (E1).

---

## Prüfung (Agent, 23.11.2026)

Geprüft nach `teil-b-plan-pruefung.md` gegen Design, Muster `prototyp/sitzung4.html`, Nachbarplan `sitzung02.md` (und `sitzung03.md` für den Anschluss von `frequency()`). `Rscript sitzung01-zahlen.R`: Exit 0, Ende „Alle Zahlen geprüft.“, alle 17 Vorlagen laufen einzeln in frischer Umgebung. Alle Zielwerte entsprechen genau der Ausgabe (ganze Zahlen aus Spalte N, Total valid, Trefferzahlen; die einzige Kommazahl ist eine Auswahlfrage).

### 1 Schwache Studentin ohne Vorwissen
Befunde:
- Durchgespielt: A1 etwa 15 min (Datei suchen und laden 2–3, erste Werkstatt mit Startzeit 1–2, Zellen mit dem eingeplanten Fehler 3, Schritt 4 in RStudio 4–5, Antworten 2), A2 etwa 15 min (vier Ideen je 3, Antworten 3), A3 etwa 11 min. Summe etwa 41 min statt 36; machbar, aber knapp. Jeder Schritt ist mit Grundlage und Schritttext lösbar; „..“ als Wertelabel, `[1]`, Punkt als Dezimaltrenner und der Fehler bei unveränderter Vorlage sind erklärt.
- Stolperstelle A1 Schritt 3: Wer die Zahl so einträgt, wie sie im Text steht (`5.246`), rechnet mit 5,246 und bekommt 0.0351… Tage. Stand nur in Hilfe Stufe 2.
- a2-angst: Die richtige Option war deutlich länger und enthielt eine Begründung; man konnte sie an der Länge erraten.
Geändert (3):
- A1 Schritt 3: „ohne Tausenderpunkt, `5246`, nicht `5.246`“ direkt im Schritttext; Rückmeldung a1-tage erkennt den Fall 0.0351….
- a2-angst: drei gleich lange, gleich gebaute Optionen.
- Zeiten in Tabelle und Selbstprüfung realistisch (15/15/11, Summe etwa 41 min) mit Ausweg „Schritt 4 nachholen“.

### 2 Didaktik
Befunde:
- Jede Grundlage führt direkt in ihre Aufgabe, nutzt andere Variablen und Suchwörter und verrät keine Lösung (Grundlage 2 lehrt ue/Wortanfang/Scheintreffer an bücher, handy, tier; A2 wendet es an flüchtling, politik, einsam an). Festlegen vorher in allen vier Aufgaben; A2 und A3 verlangen Deuten (passt der Treffer? nicht gefragt oder nicht geantwortet?). Probier-Werkstätten sind echte Anschlussfragen (Tarot, Parteien gegen Bundestag, Fehlermeldung mit erlaubten Werten).
- Der inhaltliche Kern von A2 (passt die Variable zur Idee?) hatte keinen Fachbegriff.
- A4 Hilfe Stufe 2 nannte alle vier Ursachen und war damit schon die Lösung.
- Anschluss: Sitzung 2 und 3 schreiben „kennst du aus Methoden Ia“; hier stand „Methoden I“. Sitzung 2 (Entscheidung 2, R3) erinnert an `codebook(allbus, x)` mit Variablennamen als „kennst du aus Sitzung 1“; Sitzung 1 zeigte nur `codebook(allbus)`.
Geändert (4):
- Fachbegriff **Gültigkeit** (Validität) mit „Kurz gesagt“ in der Rückmeldung zu a2-angst und im Überblick.
- A4 Hilfe Stufe 2 verweist auf den Sortierer und die Fehlertabelle, ohne die Ursachen zu nennen.
- „Methoden I“ → „Methoden Ia“ (Schilder und Kopf).
- Vorlage `a3_codebuch` um `codebook(allbus, rh08b)` ergänzt (copy-only), Schritttext angepasst, E7 neu begründet.

### 3 Fachliches und Barrierefreiheit
Befunde:
- Falsch: 3a „Genauer erklärt“ und E7 sagten, `codebook(allbus, pi08)` zeige in der Werkstatt die Angaben als Text. Ohne Hülle druckt mariposa 0.7.4 nur eine Kurzfassung (Zahl der Variablen und Fälle, Hinweis auf den Viewer); mit der Hülle aus Sitzung 2 Labels und fehlende Werte mit n, aber keine Zahl gültiger Antworten (in R geprüft).
- Ungenau: R1 begründete die Ladereihenfolge damit, dass sonst `read_spss()` nicht aus mariposa käme. tidyverse hängt haven nicht an; mariposa maskiert tatsächlich `stats::frequency` (und `%>%`). Die Lademeldung lautet in deutschem RStudio „Das folgende Objekt ist maskiert ‘package:stats’: frequency“, nicht englisch.
- Ungenau: Eine fehlende Klammer erzeugt in RStudio beim zeilenweisen Ausführen keine Meldung, die Konsole zeigt nur `+`; `unexpected end of input` kommt in der Werkstatt (bzw. bei Source).
- Nicht geprüft waren: „fernseh“ findet FERNSEHER und FERNSEHEN (stimmt: lm31, pt09), die Meldung zu `search = "titel"`, der Code 2 von eastwest.
- Korrekt: alle übrigen Zahlen (5.246, 579, 3.037.434, 35.15549, 32 %, pi08-Tabelle, 3.599, 436, 1.587, Suchtreffer, rh08b, pt03, pt15, rh09b, li04, Kirche 11, 15 Treffer für „pt“ in den Namen), Prozentbasis „Total gegen Total valid“, TNZ-Arten, Ungewichtet-Hinweis mit Verweis auf Sitzung 6. Keine Einzelfallwerte. Sprache: Du-Form, kein „(fiktiv)“, kein „·“, keine Rolle; R-Stil: keine Pipe (Sitzung 1), tidyverse vor mariposa, kein Filter-Code. Jedes Bild hat eine Textfassung mit Werten, jede Aufgabe ist ohne Grafik lösbar, Interaktionen mit `aria-live` und Text statt nur Farbe.
- Kleinigkeit: „etwa zwei Drittel“ für 3.650 von 5.246 (69,6 %).
Geändert (6):
- 3a „Genauer erklärt“ und E7 korrigiert (Werkstatt zeigt keine gültigen Antworten, darum `frequency()`; Nachschlagen mit `codebook()` in Sitzung 2).
- R1 „Genauer erklärt“ (Ladereihenfolge) und „Text am Ende von R1“ korrigiert; deutsche Maskiert-Meldung auch in 4a und der Fehlertabelle.
- Fehlende Klammer: Sortierer Zeile 5, Hinweis darunter, A4 Schritt 4 unterscheiden Werkstatt (`unexpected end of input`) und RStudio (`+`, keine Meldung).
- „gut zwei Drittel (knapp 70 %)“ in a3-split, Hilfe Stufe 3 und Überblick.
- `sitzung01-zahlen.R`: neue Prüfungen für „fernseh“, `search = "titel"`, eastwest-Code 2, den Tausenderpunkt-Fall, die Textfassung von `codebook(allbus, rh08b)` (n = 178, keine 5030); `a3_codebuch` läuft mit beiden Zeilen einzeln.
- Selbstprüfung (§12) an die neuen Zeiten angepasst.

### Offene Punkte (bewusst nicht geändert)
- **Doppelung mit Sitzung 2, Thema 3 „Fehlende Werte haben Gründe“:** Sitzung 1 führt TNZ (SPLIT, FILTER, MODE) schon ein, weil A3 ohne „nicht gefragt“ nicht lösbar ist. Nicht hier kürzen; besser in `sitzung02.md` TNZ als „kennst du aus Sitzung 1“ markieren. Ebenso `sitzung02.md` Zeile „Wie viele gültige und fehlende Werte … zählst du in Sitzung 3 mit `frequency()`“: Sitzung 1 nutzt `frequency()` schon als ersten Blick (E1), Sitzung 3 baut darauf auf.
- **Grundlage 1 ist lang** (vier Karten, etwa 15 min) und überwiegend Bedienung (RStudio, Projekt, Pakete). Für eine Einstiegssitzung nötig; Statistik-Inhalt liegt in Thema 2 und 3. Nicht gekürzt.
- **Zeitpuffer knapp** (etwa 41 von 45 min). Falls der Testlauf mehr zeigt: Idee 4 in A2 oder Schritt 4 in A1 als „nach dem Seminar“ kennzeichnen.
- **Bau prüfen (webR):** wie bisher §13; zusätzlich ob `interactive()` in webR `TRUE` ist (sonst kein Problem, `codebook()` ist in Sitzung 1 nur copy-only) und dass Sitzung 2 die `codebook()`-Hülle einbaut.
- **a2-fluecht** nennt im Label das Suchwort `"fluecht"`. Bewusst gelassen: Die Frage kommt nach dem Schritt und fängt ab, wer nur „fluechtling“ (1 Treffer) probiert hat.


## Nacharbeit nach Kapitelprüfung (23.11.2026)

- **Datei-Zone Schritt 1:** Neuer Zustand „✓ Deine ALLBUS-Datei ist geladen. Dein Browser speichert sie aber nicht: Nach dem Neuladen wählst du sie hier erneut.“ (`notStored`), sonst unverändert „gespeichert“. Die Hülle `<div role="status">` steht immer da (ohne Datei leer); nur der Text darin wechselt. Kam die Datei über diese Zone, springt der Fokus auf die Statuszeile (`tabindex="-1"`); beim Wiederherstellen nach dem Neuladen nicht. Während `restoring` erscheinen weder Zone noch Text.
- **Suchwort-Labor:** Die Ausgabe (`<pre>`) ist `role="region"` mit `aria-label` und `tabindex="0"` (per Tastatur scrollbar).
- **RStudio-Fenster:** nicht gewählte Felder mit Deckkraft 0,6 („40 % blasser“, bisher 0,4 und damit zu blass).
- **Hilfe a1-tage:** Das „0.0351…“ im Text kommt aus der Konstante `DAYS_WITH_POINT_TEXT` (auf vier Stellen gekürzt, R-Ausgabe 0.03515549); ein Test sichert Übereinstimmung mit `DAYS_WITH_POINT` (gerundet 0.0352).
- **Bild „Fehlermeldung“:** Schrift mindestens 12 im viewBox; viewBox von 520 auf 420 Breite verkleinert, die zwei langen Zeilen (✖-Zeile, Fußnote) umbrochen.
- **Gemeinsame Bausteine:** Methoden-Ia-Hinweis über `known`/`knownNote` des `ChapterLayout`, Schilder über `Known`; der freie-Karte-Hinweis in Grundlage 2 ist ein `MapLink` (Konzept `codebook`). `scriptNote`/`howToExtra` waren in Sitzung 1 nicht nötig (Standardtexte passen).
- **Auflösungsregel:** Sitzung 1 hat keine Auflösung, die vor den offenen Fragen erscheint („Alles richtig“-Satz in Aufgabe 2 erst, wenn alles richtig ist); keine Änderung nötig.
