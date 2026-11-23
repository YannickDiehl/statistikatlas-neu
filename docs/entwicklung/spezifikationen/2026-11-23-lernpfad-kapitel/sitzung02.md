# Sitzung 2 „Vom Fragebogen zum Datensatz“: Inhaltsplan für das Kapitel

Stand: 23.11.2026. Plan nach Teil B des Rollouts (`docs/entwicklung/plaene/2026-11-23-lernpfad-kapitel-rollout.md`), Muster: `prototyp/sitzung4.html`, Aufbau nach Design §5 (Variante B). Die Sitzung hat im Seminar schon stattgefunden; das Kapitel dient zum Nachholen und Wiederholen.

- **Daten:** ALLBUS 2023, ZA8831 v1.3.0, mariposa 0.7.4. Alle Zahlen ungewichtet. Gezählt werden Codes und Zellen, keine Anteile in der Bevölkerung; deshalb ändert eine Gewichtung hier nichts (Hinweis im Kapitel, Gewichtung ist Thema in Sitzung 6).
- **Nachrechnen:** `sitzung02-zahlen.R` in diesem Ordner rechnet jede Zahl und führt jede Vorlage aus (`Rscript sitzung02-zahlen.R`, Ergebnis am 23.11.2026: „Alle Prüfungen bestanden.“, Exit 0).
- **Bisherige Aufgabe:** `s02` (`src/tasks/s02-datenerfassung/`), bleibt bis zur Live-Schaltung erreichbar. Kapitelordner später `src/chapter/s02/`, Eintrag mit `live: false`.
- **Bildsprache:** Hier wird sie eingeführt (Bauplatte = Datensatz, Turm = Variable, Stein = Wert, Aufkleber = Wertelabel, leerer gestrichelter Stein = NA, grau = fällt weg), so wie im R-Workshop, Kapitel 3 und 4 (`k03-legende`, `k04-platte`, `k04-labels`, `k04-dbl-lbl`, `k04-filter`, `k04-missing-codes`). Bilder mit Personen zeigen konstruierte Beispielwerte („zum Beispiel“).
- **Schreibweise in diesem Dokument:** ⟦…⟧ markiert anzupassende Stellen in Vorlagen (mit Beispielwert). Zahlen deutsch (5.246), R-Ausgaben wörtlich (5,246).

---

## 0. Kopf

**Stein:** 2 (Kapitelfarbe wie Sitzung 2 in der Sitzungsliste). **Titel:** Vom Fragebogen zum Datensatz.

**Begleitfigur (hallo) mit Leitfrage:** „Was steht eigentlich in einer Zeile des ALLBUS?“

**Wegweiser (drei Kacheln wie in Sitzung 4):**
- Vorweg: R lesen – Objekt, Pipe mit einem Schritt, Nachschlagen
- Vier Themen – je erst die Grundlage, dann die Aufgabe; im Seminar direkt zur Aufgabe springen
- Zum Schluss – Überblick, Wichtigstes, Selbsttest, Skript

### Was du nach dieser Sitzung kannst
- einen Datensatz als Datenmatrix lesen: Jede Zeile ist ein Fall, jede Spalte eine Variable, jede Zelle ein Wert
- aus einem ausgefüllten Fragebogen mit dem Codebuch eine Zeile machen und erklären, wer dabei was entscheidet
- einen Eintrag im Codebuch lesen: Variablenname, Variablenlabel, Wertelabels und die Richtung einer Skala
- erklären, warum Codes Namen sind und nicht immer „mehr“ bedeuten, und wann man mit einer Zahl rechnen darf
- fehlende Werte nach ihrem Grund unterscheiden: keine Angabe, weiß nicht, nicht gefragt, zwei Kreuze
- die Datentypen in R erkennen: Zahl, Text, Zahl mit Wertelabel
- Code lesen und anpassen: mit `<-` etwas unter einem Namen ablegen, mit `codebook()` nachschlagen, mit `%>%` und `filter()` nur bestimmte Befragte behalten, `==` von `=` unterscheiden

**Schon bekannt und hier nur kurz erinnert:** der Startblock mit Objekt und `<-`, `dim(allbus)` und die 3.037.434 Zellen, `find_var()`, das ganze Codebuch mit `codebook(allbus)` in RStudio und der erste Blick mit `frequency()`; Code, Wertelabel, Variablenlabel und die Bedeutung von TNZ (trifft nicht zu, nicht gefragt) (Sitzung 1); die Begriffe Datenmatrix, Fall, Variable, Wert und Datenreihe (Methoden Ia). Solche Stellen tragen ein graues Schild „kennst du aus Sitzung 1“ bzw. „kennst du aus Methoden Ia“. Neu ist heute der Blick von der anderen Seite: wie aus einem ausgefüllten Bogen eine Zeile wird und wer dabei was entscheidet.

### So arbeitest du mit dieser Seite
Wie in Sitzung 4 (vier Zeilen mit Symbolen), mit einem Zusatz:
- **+ Genauer erklärt** klappt Hintergründe auf. Lies sie, wenn dir etwas zu schnell geht.
- **? Kurz überlegen** heißt: erst selbst festlegen, dann auflösen. Danebenliegen gehört dazu.
- **▶ In der Code-Werkstatt** darfst du schreiben und ausprobieren (kennst du aus Sitzung 1). Ausführen zeigt sofort, was R ausgibt. Kaputt machen kannst du nichts: Zurücksetzen holt die Vorlage zurück. Die Tastenkürzel sind dieselben wie in RStudio.
- **ab Markierte Stellen** passt du an. Sobald du eine geändert hast, verschwindet ihre Markierung. Kopieren nimmt deinen Code mit nach RStudio.

**Sprungknöpfe fürs Seminar:** Aufgabe 1, Aufgabe 2, Aufgabe 3, Aufgabe 4 (Zusatz). Text davor: „Im Seminar? Jedes Thema beginnt mit seiner Grundlage zum Vertiefen der Folien. Wer sie schon kann, springt direkt zur Aufgabe:“

**Hinweis zu den Zahlen (einmal im Kopf oder unter R lesen, klein):** „Alle Zahlen auf dieser Seite stammen aus dem ALLBUS 2023 und sind ungewichtet. Hier werden Codes gezählt, keine Anteile in der Bevölkerung geschätzt; Gewichtung ist Thema in Sitzung 6.“

---

## 1. Themen, Grundlagen und Aufgaben

| Thema | Grundlage (Variablen) | Aufgabe (Variablen, Art) |
|---|---|---|
| 1 Die Datenmatrix: Fall, Variable, Wert | 1a Vom Bogen zur Zeile (konstruierte Bauplatte mit `sex`, `ls01`, `rh08b`); 1b die ALLBUS-Bauplatte (5.246 × 579) | **A1 Wer hat auf Papier geantwortet?** Pflicht (`allbus` anzeigen, `mode`, `filter()`) |
| 2 Codes und Labels | 2a „1 oder 5?“ (`pa02a`); 2b drei Beschriftungen (`pa02a`, `ls01`); 2c Codes sind Namen (`pv01`) | **A2 Ein Bogen wird zur Zeile** Pflicht (`age`, `educ`, `ep03`, `id02`) |
| 3 Fehlende Werte haben Gründe | 3a Was trägst du ein? (`ls01`, `ps03`); 3b die Gründe im Codebuch (`ls01`, `ps03`, `dw15`, `rh08b`); 3c Fehler oder Konvention? | **A3 Was nur auf Papier passiert** Pflicht (`papier`: `pa01`, `st01`, `pt03`) |
| 4 Datentypen | 4a Steine haben Farben (konstruiert: `beruf`, `alter`, `eastwest`); 4b Umwandeln, Vorgriff auf Sitzung 4 (konstruiert: `sex`) | **A4 Drei Typen auf einer Bauplatte** Zusatz (`papier` anzeigen: `respid`, `doi`, `mode`) |
| Überblick | Was steht in einer Zeile? Zuordnen, Voraussetzungen „Bevor du rechnest“ | – |

**Zeitplan Seminar (Arbeitsphase etwa 45 Minuten):** A1 etwa 11 Minuten, A2 etwa 12 Minuten, A3 etwa 15 Minuten, zusammen etwa 38 Minuten plus Lesen der Ziele; A4 nur für Schnelle (etwa 8 Minuten). Grundlagen je Thema etwa 10 bis 15 Minuten (vor oder nach dem Seminar).

---

## 2. Vorweg: R lesen

### Karte R1 „Startblock und Objekt“ (Schild: „Startblock, Objekt und `<-`: kennst du aus Sitzung 1“, Art: Code lesen)

Text:
> Den Startblock kennst du aus Sitzung 1: Er lädt die Werkzeuge und legt den ALLBUS unter dem Namen `allbus` ab. In RStudio führst du ihn zu Beginn aus. In der Code-Werkstatt hier auf der Seite ist das schon erledigt.

Vorlage (Werkstatt-Kopf: „Startblock“):
```r
# Pakete laden und Daten einlesen
library(tidyverse)
library(mariposa)

allbus <- read_spss("ZA8831_v1-3-0.sav")
```

> Rote Zeilen beim Laden, etwa „Attaching core tidyverse packages“, sind normal und kein Fehler. Findet R die Datei nicht, nimm wie in Sitzung 1 `allbus <- read_spss(file.choose())`.
>
> `allbus` ist ein **Objekt**: ein Name, unter dem R sich etwas merkt. Mit `<-` legst du etwas unter einem Namen ab. Hier ist es der ganze Datensatz. Im Bild ist er eine **Bauplatte**: Jede Spalte ist ein **Turm**, jede Antwort ein **Stein**. Wie die Bauplatte aussieht, schaust du dir in Grundlage 1 genauer an.

**Kurz gesagt:** Mit `<-` legst du ein Ergebnis unter einem Namen ab. Führst du nur den Namen aus, zeigt R dir das Objekt.

**Häufige Verwechslung:** Ohne `<-` zeigt R das Ergebnis nur an und vergisst es wieder. Mit `<-` wird es gespeichert, angezeigt wird dann nichts. In RStudio siehst du gespeicherte Objekte rechts oben im Environment.

### Karte R2 „Neu heute: die Pipe mit einem Schritt“ (Schild: „neu heute“, Art: Code lesen)

Text:
> Neu heute ist die **Pipe** `%>%`. Du sprichst sie „und dann“. Sie nimmt, was links steht, und gibt es an die Funktion rechts weiter. So liest du die Zeile vom Input:

Token-Bild (wie in Sitzung 4 „So liest du eine Zeile“, Code-Bausteine mit Beschriftung darunter):
`frauen` (Objekt: hier ablegen) `<-` (leg ab unter) `allbus` (Objekt: die Bauplatte) `%>%` (und dann) `filter(` (Funktion: was passiert) `sex == 2` (Argument: welche Reihen bleiben) `)`

> „Nimm `allbus`, und dann behalte nur die Reihen, in denen `sex` gleich 2 ist. Leg das Ergebnis unter dem Namen `frauen` ab.“ Welcher Code für FRAU steht, verrät das Codebuch: Bei `sex` ist 1 MANN, 2 FRAU, 3 DIVERS.
>
> `filter()` wählt **Reihen** aus, also Befragte. Alle Türme bleiben stehen. Die Pipe tippst du mit Strg + Umschalt + M (Mac: Cmd + Umschalt + M).

Vorlage (Werkstatt-Kopf: „Vorlage: nachschlagen und auswählen“), keine markierten Stellen:
```r
# Nachschlagen: Welcher Code steht für FRAU?
codebook(allbus, sex)

# Nur die Befragten behalten, bei denen sex gleich 2 ist
frauen <- allbus %>%
  filter(sex == 2)

# Die neue Bauplatte anzeigen
frauen
```
Erwartete Ausgabe (Auszug): Codebuch-Eintrag `sex` mit `1 = MANN`, `2 = FRAU`, `3 = DIVERS`; danach `# A tibble: 2,672 × 579`, darunter Namen und Typen der ersten Türme und die ersten zehn Reihen.

Bild **s2-filter-sex** (Typ: Bauplatte → Funktion → Bauplatte, wie R-Workshop `k04-filter`):
- Links Bauplatte, dunkles Namensschild `allbus`, daneben grau „5,246 × 579“. Drei Türme `sex`, `ls01`, `rh08b` mit Spaltenkopf und grauem Typ `<dbl+lbl>`, rechts graue Auslassungspunkte (weitere Türme). Sechs Reihen, zum Beispiel: `sex` 1 MANN, 2 FRAU, 1 MANN, 2 FRAU, 3 DIVERS, 2 FRAU (blaue Steine mit gelben Aufklebern); `ls01` 7, 8, 5, 9, 6, 8 (blau, ohne Aufkleber); `rh08b` 3, 3, 2, 1, 3, 2 (blau mit kleinen Aufklebern GAR NICHTS, ETWAS, VIEL). Darunter graue Auslassungspunkte (weitere Reihen).
- Die Reihen 1, 3 und 5 (MANN, MANN, DIVERS) sind ganz grau: Sie fallen weg.
- Grüner Pfeil mit Code-Baustein `filter(sex == 2)` (filter grün, `sex == 2` orange).
- Rechts neue Bauplatte, Namensschild `frauen`, grau „2,672 × 579“, dieselben drei Türme mit den drei FRAU-Reihen, darunter Auslassungspunkte. Unter der rechten Platte ein grauer Hinweis: „alle Türme bleiben“.
- Darunter die Code-Zeile als Bausteine: `frauen <- allbus %>% filter(sex == 2)`.
- **Textfassung:** „Links die Bauplatte allbus mit 5.246 Reihen und 579 Türmen, gezeigt sind sechs Reihen der Türme sex, ls01 und rh08b. Drei Reihen haben bei sex den Code 2 mit dem Aufkleber FRAU, die anderen 1 MANN oder 3 DIVERS; diese drei sind grau. Der Pfeil filter(sex == 2) führt zur Bauplatte frauen mit 2.672 Reihen und weiterhin 579 Türmen: Nur die FRAU-Reihen bleiben, alle Türme bleiben stehen. Die Steine sind ein Beispiel mit sechs Befragten; die Reihenzahlen stammen aus dem ALLBUS 2023.“

**Kurz gesagt:** Die Pipe `%>%` gibt das Ergebnis links an die Funktion rechts weiter („und dann“). `filter()` behält nur die Reihen, für die die Bedingung stimmt.

**Genauer erklärt: `==` und `=`, ein Schritt oder eine Kette**
- `==` fragt „ist gleich?“ und prüft jede Reihe: Bei `sex == 2` ist die Antwort für jede Frau ja, für alle anderen nein. Ein einzelnes `=` stellt dagegen ein Argument ein (kennst du aus Sitzung 1, etwa `path = "…"`). Schreibst du `filter(sex = 2)`, meldet R: „Did you mean `sex == 2`?“
- Auf der Folie stand die Zeile in einer Zeile: `frauen <- allbus %>% filter(sex == 2)`. Im Lernpfad steht nach `%>%` ein Zeilenumbruch und der nächste Schritt eingerückt. Das ist derselbe Code. In Sitzung 4 hängst du so mehrere Schritte untereinander zu einer Kette.
- `allbus %>% filter(sex == 2)` ist dasselbe wie `filter(allbus, sex == 2)`: Die Pipe setzt die Bauplatte in das erste Feld der Funktion. Mehr dazu im R-Workshop, Abschnitt 4.5.2 „Fälle filtern“.

**Häufige Verwechslung:** `filter()` und Nachschlagen. `filter(sex == 2)` braucht den Code, nicht das Wort: `filter(sex == "FRAU")` ergibt einen Fehler. Den Code findest du im Codebuch.

### Karte R3 „Nachschlagen mit codebook()“ (Schilder: „Codebuch: kennst du aus Sitzung 1“, „neu heute: einzelne Variablen nachschlagen“, Art: Code lesen)

Text:
> In Sitzung 1 hast du das ganze Codebuch mit `codebook(allbus)` in RStudio geöffnet und einzelne Variablen mit `frequency()` ausgezählt. Heute schlägst du einzelne Variablen direkt im Codebuch nach: `codebook(allbus, sex)`; mehrere trennst du mit Komma: `codebook(allbus, sex, ls01)`. Das Codebuch zeigt keine Prozente, dafür kurz alles, was du zum Erfassen eines Bogens brauchst: Codes, Wertelabels und die fehlenden Werte mit ihrem Grund. In RStudio öffnet sich der Eintrag rechts unten im Viewer als Tabelle. In der Code-Werkstatt erscheint derselbe Eintrag als Text. Die Wörter darin sind englisch:

| In der Werkstatt | Im Viewer (RStudio) | heißt |
|---|---|---|
| `Label:` | Label | Variablenlabel: was gefragt wurde |
| `Values:` | Values | welche gültigen Codes vorkommen |
| `Value labels:` | Value Labels | Wertelabels: welches Wort zu welchem Code gehört |
| `Missing values: … (n = 81)` | negative Codes mit Freq. | fehlende Werte mit Grund und wie oft sie vorkommen |
| `Observations: 5246` | 5246 observations | wie viele Reihen (Befragte) |

> Der Viewer zeigt zusätzlich bei jedem gültigen Code, wie oft er vorkommt (Spalte Freq.). Für diese Sitzung brauchst du das nicht. Wie oft jeder gültige Code vorkommt und wie viele gültig geantwortet haben, zeigt dir `frequency()` (kennst du aus Sitzung 1); in Sitzung 3 rechnest du damit Prozente.

**Kurz gesagt:** `codebook(daten, variable)` zeigt Variablenlabel, Codes, Wertelabels und fehlende Werte einer Variable.

**Hinweis für den Umsetzenden (nicht im Kapiteltext):** In RStudio öffnet `codebook()` den Viewer, weil `view = interactive()`. In der Werkstatt muss die Ausgabe dem Text von `summary(codebook(…, view = FALSE))` entsprechen (siehe Abschnitt 11, Entscheidung 3). Alle Fragen des Kapitels nutzen nur Angaben, die in beiden Ausgaben stehen.

---

## 3. Thema 1: Die Datenmatrix

### Grundlage 1 „Die Datenmatrix: Fall, Variable, Wert“

Kopf: „Was steht in einem Datensatz, und wie hängt er mit dem Fragebogen zusammen? Zwei kurze Schritte, etwa 10 Minuten.“ Knopf „Schon klar? Direkt zu Aufgabe 1 ↓“.

#### Karte 1a „Vom Bogen zur Zeile“ (Schild: „Datenmatrix: kennst du aus Methoden Ia“, Art: Im Bild)

Text:
> Drei Menschen haben einen Fragebogen ausgefüllt. Aus jedem Bogen wird eine **Zeile** im Datensatz, aus jeder Frage eine **Spalte**. Tipp auf einen Stein, um zu sehen, was er ist.

Bild und Interaktion **s2-bogen-platte** (Typ: neu, einfach; Bögen → Bauplatte, Steine anwählbar):
- Links drei kleine Papierbögen nebeneinander (weiß, dünner grauer Rand, Kopf „Bogen 1“, „Bogen 2“, „Bogen 3“), je drei Fragen mit Kästchen, angekreuzte Kästchen orange:
  - Frage 1 „Sie sind …“ □ ein Mann □ eine Frau □ divers. Bogen 1: Frau, Bogen 2: Mann, Bogen 3: Frau.
  - Frage 2 „Wie zufrieden sind Sie mit Ihrem Leben? 0 (ganz unzufrieden) bis 10 (ganz zufrieden)“. Bogen 1: 8, Bogen 2: 0, Bogen 3: 7.
  - Frage 3 „Was halten Sie von Astrologie und Horoskopen?“ □ viel □ etwas □ gar nichts. Bogen 1: gar nichts, Bogen 2: etwas, Bogen 3: kein Kreuz.
- Pfeil nach rechts zur Bauplatte (dunkles Namensschild „befragte“ hier nicht nötig; Bauplatte ohne Namen, grau „3 × 3“). Drei Türme mit Spaltenkopf `sex`, `ls01`, `rh08b`. Reihen mit grauen Nummern 1, 2, 3 links (wie in der R-Ausgabe).
  - `sex`: 2 FRAU, 1 MANN, 2 FRAU (blaue Steine, gelbe Aufkleber)
  - `ls01`: 8, 0, 7 (blaue Steine; 0 trägt kleinen Aufkleber GANZ UNZUFRIEDEN)
  - `rh08b`: 3 GAR NICHTS, 2 ETWAS, leerer gestrichelter Stein mit blassem Aufkleber KEINE ANGABE
- Jeder der neun Steine ist ein Knopf. Angewählter Stein: orange Rahmen um seine Reihe, grüner Rahmen um seinen Turm. Daneben Erklärkasten (`aria-live="polite"`).
- Zustände (Text im Erklärkasten), Muster: „**Reihe {r}** ist ein **Fall**: die Person von Bogen {r}. **Turm {v}** ist eine **Variable**: {Frage}. Der Stein ist ihr **Wert**: {Wert}.“ Konkrete Werte:
  - sex: „Turm sex ist eine Variable: das Geschlecht. Der Stein ist ihr Wert: 2, das Wertelabel heißt FRAU.“ (bzw. 1 MANN)
  - ls01: „Turm ls01 ist eine Variable: die Lebenszufriedenheit. Der Stein ist ihr Wert: 8.“ Für die 0: „… Der Stein ist ihr Wert: 0, ganz unzufrieden. Auch die 0 ist eine Antwort.“
  - rh08b: „Turm rh08b ist eine Variable: was die Person von Astrologie und Horoskopen hält. Der Stein ist ihr Wert: 3, GAR NICHTS.“ Für den leeren Stein: „… Hier ist der Stein leer: Auf Bogen 3 steht kein Kreuz. Das ist ein **fehlender Wert**; der Aufkleber sagt, warum. Mehr dazu in Grundlage 3.“
- Startzustand (nichts gewählt): „Wähl einen Stein aus.“ Tastatur: Steine sind Knöpfe in Lesereihenfolge (Reihe für Reihe); Tab und Enter genügen.
- **Textfassung (Tabelle mit Beschriftung „Drei Bögen als Datenmatrix“):** Spalten Reihe, sex, ls01, rh08b; Zeilen: 1 | 2 FRAU | 8 | 3 GAR NICHTS; 2 | 1 MANN | 0 GANZ UNZUFRIEDEN | 2 ETWAS; 3 | 2 FRAU | 7 | fehlt (KEINE ANGABE). Darunter: „Jede Zeile ist ein Fall, jede Spalte eine Variable, jede Zelle ein Wert. Die Bögen sind ein Beispiel mit drei Personen.“

**Kurz gesagt:** Ein Datensatz ist eine **Datenmatrix**: Jede Zeile ist ein **Fall** (im ALLBUS eine befragte Person), jede Spalte eine **Variable** (meist eine Frage), jede Zelle ein **Wert**. Im Bild: Reihe, Turm, Stein. Die ganze Bauplatte ist der Datensatz.

**Genauer erklärt: Fall, Variable, Wert, Datenreihe**
- Ein **Fall** ist die Einheit, über die du etwas weißt, im ALLBUS eine befragte Person. Ein anderes Wort dafür ist Merkmalsträger.
- Eine **Variable** ist ein Merkmal, das von Fall zu Fall verschieden sein kann, meist eine Frage aus dem Fragebogen. Sie hat einen kurzen Namen wie `ls01`.
- Ein **Wert** ist, was ein Fall bei einer Variable hat, also eine Antwort. Die möglichen Antworten einer Variable heißen **Ausprägungen**.
- Liest du einen Turm von oben nach unten, hast du die **Datenreihe** dieser Variable: einen Wert je Person, in der Reihenfolge der Personen. Mit ihr beginnt jede Rechnung.
- Die Steine haben Farben: Blau heißt Zahl. Mehr zu den Farben in Grundlage 4.

**Häufige Verwechslung:** Variable und Wert. „Lebenszufriedenheit“ ist die Variable, der ganze Turm. „8“ ist ein Wert, ein einzelner Stein. Und eine Zeile ist eine Person, nicht eine Frage.

→ In der freien Karte: „Datenreihe“ (Link zur Begriffskarte `series`).

#### Karte 1b „Die ALLBUS-Bauplatte“ (Art: Kurz überlegen)

Text:
> Der ALLBUS 2023 ist dieselbe Datenmatrix, nur größer: **5.246 Reihen**, eine für jede befragte Person, und **579 Türme**, einer für jede Variable. Die Zahlen kennst du aus Sitzung 1 (Schild „kennst du aus Sitzung 1“), ebenso die 3.037.434 Zellen, die du dort ausgerechnet hast. R zeigt die Größe als `5,246 × 579` (R schreibt Tausender mit Komma: 5,246 heißt 5.246).

Kurz überlegen (choice, `g1_turm`): „Wie viele Steine hat ein einzelner Turm, etwa die Lebenszufriedenheit `ls01`?“
- Optionen: „579“ | „5.246“ | „so viele, wie Personen geantwortet haben“
- Ziel: „5.246“
- Richtig: „Genau: ein Stein für jede befragte Person, also 5.246. Auch wer nicht geantwortet hat, hat in diesem Turm einen Stein, einen leeren mit Grund. Bei `ls01` sind 82 Steine leer. Darum ist ein Datensatz immer ein Rechteck.“
- Falsch („579“): „579 ist die Zahl der Türme. Ein Turm ist eine Variable und hat einen Stein für jede Reihe, also für jede Person: 5.246.“
- Falsch („so viele, wie Personen geantwortet haben“): „Auch wer nicht geantwortet hat, bekommt einen Stein: einen leeren, auf dem der Grund klebt (Grundlage 3). So hat jeder Turm 5.246 Steine.“

Bild: keins nötig (die Zahl steht im Text). Optional kleines Schema „Bauplatte 5,246 × 579“ ohne Steine; Textfassung dann: „Schema der ALLBUS-Bauplatte: 5.246 Reihen, 579 Türme.“

**Kurz gesagt:** Der ALLBUS 2023 hat 5.246 Fälle und 579 Variablen. Ein Datensatz ist rechteckig: Jeder Fall hat in jeder Variable genau einen Wert, notfalls einen fehlenden.

---

### Aufgabe 1 „Wer hat auf Papier geantwortet?“ (Pflicht)

Kopf: „A1“, Titel, Schild „Pflicht“, Link „↑ Grundlage 1 nachlesen“.

**Leitfrage:** Wie viele Zeilen des ALLBUS waren einmal ein Papierbogen?

**Ziel:** Am Ende kannst du in der Ausgabe von R Reihen und Türme ablesen, mit `filter()` nur die Papierbögen behalten und sagen, wie viele es sind, was mit den Variablen passiert und für wen ein Ergebnis dann gilt.

**Grundlage:** Grundlage 1 „Die Datenmatrix“ und R lesen „Die Pipe mit einem Schritt“.

Einleitung:
> Der ALLBUS 2023 wurde auf drei Wegen erhoben: im persönlichen Interview, bei dem die Antworten direkt in einen Laptop getippt werden (CAPI), online (CAWI) und auf Papier, das per Post zurückkam (MAIL). Die Papierbögen musste jemand abtippen. Welche Zeilen das sind, verrät die Variable `mode`.

**Erst festlegen** (choice, wird beim Prüfen von `a1_papier` zitiert): „Schätz: Welcher Teil der 5.246 Befragten hat wohl auf Papier geantwortet?“
- Optionen: „etwa ein Zehntel“ | „etwa ein Drittel“ | „etwa die Hälfte“
- Knopf „Tipp abgeben“.

Satz davor: „Arbeite in der Code-Werkstatt direkt hier oder in RStudio. In RStudio führst du vorher den Startblock aus R lesen aus.“

**Schritt 1:** „Lass dir die ganze Bauplatte anzeigen. Wenn du nur den Namen eines Objekts ausführst, zeigt R es an.“

Vorlage `a1a` (Kopf: „Vorlage 1: die Bauplatte anzeigen“):
```r
# Die ganze Bauplatte anzeigen
allbus
```
Erwartete Ausgabe (Kopf): `# A tibble: 5,246 × 579`, darunter die Namen der ersten Türme (bei Breite 80 acht: `za_nr doi version respid substudy mode splt23_1 splt23_2`), darunter ihre Typen, dann zehn Reihen; am Ende `# ℹ 5,236 more rows` und `# ℹ 571 more variables: eastwest <dbl+lbl>, german <dbl+lbl>, …` (bei breiterem Fenster mehr Türme, dann weniger „more variables“). Geprüft in `sitzung02-zahlen.R`.

Hilfetext unter der Vorlage:
> Die erste Zeile verrät die Größe: erst die Reihen, dann die Türme. Darunter stehen die Namen der ersten Türme und in spitzen Klammern ihr Typ (mehr dazu in Grundlage 4). Die Reihen zeigt R nur zum Teil, der Rest steht in den letzten Zeilen („more rows“, „more variables“). In RStudio siehst du dieselben Zahlen auch rechts oben im Environment: „5246 obs. of 579 variables“.

Bild **s2-ausgabe-lesen** (Typ: neu, einfach; annotierte R-Ausgabe, Code-Schrift auf Weiß):
- Fünf Zeilen Ausgabe in JetBrains Mono; die Zellen der Reihen sind graue Platzhalter „…“ (im Bild keine Werte einzelner Befragter):
  1. `# A tibble: 5,246 × 579`
  2. `   za_nr          doi   version respid substudy    mode    …`
  3. `   <dbl+lbl>      <chr> <chr>    <dbl> <dbl+lbl>   <dbl+l> …`
  4. ` 1 …              …     …          …   …           …       ` (grau, zwei solche Zeilen)
  5. `# ℹ 5,236 more rows` und `# ℹ 571 more variables: eastwest <dbl+lbl>, …`
- Beschriftungen mit dünnen Linien: an `5,246` „Reihen = Fälle“ (orange), an `579` „Türme = Variablen“ (grün), an Zeile 2 „Namen der Türme“, an Zeile 3 „Typ (Grundlage 4)“, an den grauen Zeilen „die ersten Reihen“, an `more rows`/`more variables` „nicht gezeigt“.
- **Textfassung:** „Aufbau der Ausgabe von allbus: Die erste Zeile lautet A tibble: 5,246 × 579, also 5.246 Reihen (Fälle) mal 579 Türme (Variablen). Es folgen die Namen der ersten Türme, darunter in spitzen Klammern ihr Typ, dann die ersten Reihen. Am Ende steht, wie viele Reihen und Variablen nicht gezeigt sind.“

**Schritt 2:** „Schlag nach, welcher Code in `mode` für den Papierbogen steht. MAIL heißt: Papierbogen per Post.“

Vorlage `a1b` (Kopf: „Vorlage 2: nachschlagen“):
```r
# Welcher Code steht für den Papierbogen?
codebook(allbus, mode)
```
Erwartete Ausgabe (Werkstatt, Auszug): `Label: ERHEBUNGSMODUS DER ALLBUS-HAUPTBEFRAGUNG`, `Values: 2, 3, 4`, `Value labels: 1 = PAPI, 2 = CAPI, 3 = CAWI, 4 = MAIL`.

Hilfetext: „Unter `Values` steht, welche Codes wirklich vorkommen. PAPI (Code 1, ein älterer Papier-Interviewweg) steht im Codebuch, kommt 2023 aber nicht vor.“

**Schritt 3:** „Die dritte Vorlage behält im Moment nur die Interviews (Code 2). Tausch die markierte 2 gegen den Code für Papierbögen aus Schritt 2 und führe sie aus. Lies in der ersten Zeile der Ausgabe ab, wie groß die neue Bauplatte ist.“

Vorlage `a1c` (Kopf: „Vorlage 3: nur einen Erhebungsweg behalten“):
```r
# Nur die Befragten mit einem Code in mode behalten
auswahl <- allbus %>%
  filter(mode == ⟦2⟧)

# Die neue Bauplatte anzeigen
auswahl
```
Erwartete Ausgabe: unverändert `# A tibble: 2,003 × 579`; mit 4: `# A tibble: 1,656 × 579`.

Hilfetext: „`auswahl` ist ein neuer Name für das Ergebnis. `allbus` bleibt dabei unverändert. Mit `==` fragt R in jeder Reihe: Steht in `mode` dieser Code?“

Kein eigenes Bild in Schritt 3 (der Vorgang steht im Bild s2-filter-sex in R lesen); Verweis: „Wie `filter()` Reihen auswählt, zeigt das Bild in R lesen.“

**Antwortfragen** (Knopf „Antworten prüfen“, Rückmeldung je Frage `aria-live`):

| id | Art | Label | Optionen | Ziel | Toleranz | Richtig | Falsch / Hinweis | Hilfezeile |
|---|---|---|---|---|---|---|---|---|
| a1_reihen | number | Wie viele Reihen (Befragte) hat `allbus`? | – | 5246 | exakt | Stimmt: 5.246 Reihen, eine für jede befragte Person. R schreibt sie als 5,246. | Noch nicht. Schau in die erste Zeile der Ausgabe von Vorlage 1: Die erste Zahl nach „A tibble:“ zählt die Reihen. | Erste Zeile der Ausgabe von Vorlage 1. |
| a1_code | number | Welcher Code steht in `mode` für den Papierbogen (MAIL)? | – | 4 | exakt | Stimmt: 4 = MAIL, der Papierbogen per Post. 2 ist das Interview (CAPI), 3 online (CAWI). | Noch nicht. Such in der Ausgabe von Vorlage 2 unter „Value labels“ das Wort MAIL. | Aus Vorlage 2, Value labels. |
| a1_papier | number | Wie viele Reihen hat deine Auswahl mit dem Papier-Code? | – | 1656 | exakt | Stimmt: 1.656 Papierbögen, knapp ein Drittel aller Befragten (31,6 %). Jede dieser Zeilen hat jemand abgetippt. Deine Schätzung vorhin: „{Tipp}“. | Noch nicht. Hast du die markierte 2 gegen den Code für MAIL getauscht? Dann steht die Zahl in der ersten Zeile der Ausgabe. 2.003 sind die Interviews. | Erste Zeile der Ausgabe von Vorlage 3, nach dem Tausch. |
| a1_was | choice | Was hat `filter()` mit der Bauplatte gemacht? | „Reihen weggelassen, alle 579 Türme behalten“ / „Türme weggelassen, alle 5.246 Reihen behalten“ / „die Codes in mode verändert“ | Reihen weggelassen, alle 579 Türme behalten | – | Genau. `filter()` wählt Fälle aus; jede verbliebene Person behält alle ihre Antworten. | Schau noch einmal auf die erste Zeile: Die zweite Zahl, die Türme, ist dieselbe wie bei `allbus`. Geändert hat sich nur die Zahl der Reihen. | Vergleiche die erste Zeile von Vorlage 1 und Vorlage 3. |
| a1_wer | choice | Deuten: Du rechnest mit `auswahl` weiter, etwa wie zufrieden die Menschen mit ihrem Leben sind. Für wen gilt dein Ergebnis? | „für alle 5.246 Befragten des ALLBUS“ / „nur für die 1.656 Befragten, die auf Papier geantwortet haben“ / „für alle Menschen in Deutschland“ | nur für die 1.656 Befragten, die auf Papier geantwortet haben | – | Genau. Eine Auswahl ändert, über wen du sprichst. Wer auf Papier antwortet, kann sich von den anderen unterscheiden: Die Papier-Befragten sind im Schnitt 58 Jahre alt, die Online-Befragten 47. | `filter()` hat alle anderen Reihen weggelassen. Was du mit `auswahl` ausrechnest, beschreibt nur die Reihen, die noch da sind: die 1.656 Papierbögen. | Grundlage 1: Jede Reihe ist eine Person. Wer ist in `auswahl` noch drin? |

Rückmeldung bei `a1_reihen` = 579: zusätzlicher Hinweis „579 sind die Türme. Gefragt sind die Reihen, die erste Zahl.“ Bei `a1_papier` = 2003: wie im Falsch-Text. Bei `a1_papier` = 5246: „Das ist noch der ganze ALLBUS. Hast du Vorlage 3 ausgeführt?“

**Weiterdenken in der Probier-Werkstatt (für die Aufgabe nicht nötig)**, zugeklappt:
> Für die Aufgabe reichen die Vorlagen oben. Hier ist Platz für eigene Fragen. Eine Idee: Ergeben die drei Wege zusammen wirklich alle 5.246 Befragten, oder fehlt jemand? Die Interviews (2.003) und die Papierbögen (1.656) kennst du schon. Die Probier-Werkstatt startet mit den Online-Befragten.
```r
# Eine Idee: nur die Online-Befragten (mode 3 = CAWI)
online <- allbus %>%
  filter(mode == 3)

online
```
(Ergebnis: `# A tibble: 1,587 × 579`. 2.003 + 1.587 + 1.656 = 5.246: Jede befragte Person hat genau einen Erhebungsweg.)

**Hilfe, Stufe 1: Denkanstoß:** „Eine Bauplatte hat zwei Maße: Reihen (Befragte) und Türme (Variablen). `filter()` fragt jede Reihe, ob sie bleiben darf. Was soll mit den Türmen passieren?“

**Hilfe, Stufe 2: Wo schaue ich?:** „Die Größe steht immer in der ersten Zeile der Ausgabe: `A tibble: Reihen × Türme`. Den Code für MAIL findest du in Vorlage 2 unter ‚Value labels‘. In Vorlage 3 tauschst du nur die markierte Zahl.“

**Hilfe, Stufe 3: Lösung:** „`allbus` hat 5.246 Reihen und 579 Türme. MAIL hat den Code 4. Mit `filter(mode == 4)` bleiben 1.656 Reihen und weiterhin 579 Türme: 1.656 Papierbögen, knapp ein Drittel. `filter()` lässt Reihen weg und behält alle Variablen. Was du mit `auswahl` ausrechnest, gilt darum nur für die 1.656 Papier-Befragten.“ Darunter die gelöste Vorlage:
```r
auswahl <- allbus %>%
  filter(mode == 4)

auswahl
```

**Ohne Grafik lösbar:** Alle Antworten stehen als Text in der R-Ausgabe; das Bild s2-ausgabe-lesen hat eine Textfassung.

---

## 4. Thema 2: Codes und Labels

### Grundlage 2 „Codes und Labels“

Kopf: „Wie wird aus einem Kreuz eine Zahl, und woher weißt du, was die Zahl bedeutet? Drei kurze Schritte, etwa 15 Minuten.“ Knopf „Schon klar? Direkt zu Aufgabe 2 ↓“.

#### Karte 2a „1 oder 5?“ (Art: Schätzen)

Text:
> Im ALLBUS steht die Frage: „Wie stark interessieren Sie sich für Politik?“ Angekreuzt wird eines von fünf Kästchen: sehr stark, stark, mittel, wenig, überhaupt nicht. Im Datensatz steht aber kein Wort, sondern eine Zahl. Welche Zahl bekommt „sehr stark“?

Interaktion **„1 oder 5?“** (zwei große Knöpfe „1“ und „5“, danach „Auflösen“):
- Gewählt 5: „Viele tippen auf 5, weil mehr Interesse nach einer höheren Zahl klingt. Im ALLBUS ist es umgekehrt: 1 = SEHR STARK, 5 = UEBERHAUPT NICHT. Woher man das weiß? Nur aus dem Codebuch.“
- Gewählt 1: „Stimmt: 1 = SEHR STARK, 5 = UEBERHAUPT NICHT. Raten hätte hier aber genauso gut danebengehen können. Woher man das sicher weiß? Nur aus dem Codebuch.“
- Nach dem Auflösen erscheint das Bild s2-pa02a.

Bild **s2-pa02a** (Typ: Turm mit Aufklebern, wie R-Workshop `k04-missing-codes`, aber senkrecht):
- Namensschild `pa02a`, darunter grau `<dbl+lbl>`. Turm aus fünf blauen Steinen 1, 2, 3, 4, 5 mit gelben Aufklebern SEHR STARK, STARK, MITTEL, WENIG, UEBERHAUPT NICHT. Darunter, abgesetzt mit Überschrift „fehlende Werte“, zwei leere gestrichelte Steine mit Aufklebern −42 DATENFEHLER: MFN (4-mal) und −9 KEINE ANGABE (17-mal).
- Rechts ein Pfeil von „sehr stark“ (angekreuztes Kästchen, orange) zum Stein 1.
- **Textfassung:** „Codebuch-Eintrag von pa02a, Politisches Interesse: 1 SEHR STARK, 2 STARK, 3 MITTEL, 4 WENIG, 5 UEBERHAUPT NICHT. Fehlende Werte: −42 DATENFEHLER: MFN, 4-mal; −9 KEINE ANGABE, 17-mal. Das Kreuz bei ‚sehr stark‘ wird zum Code 1.“

**Kurz gesagt:** Im Datensatz steht für eine Antwort ein **Code**, eine Zahl. Was sie bedeutet, sagt das **Wertelabel**. Welcher Code zu welchem Wort gehört, steht im **Codebuch**. Raten hilft nicht: Die Richtung einer Skala legt der Fragebogen fest.

**Häufige Verwechslung:** Höher heißt nicht mehr. Bei `pa02a` heißt die höchste Zahl am wenigsten Interesse. Schau vor jeder Deutung ins Codebuch, in welche Richtung eine Skala läuft.

#### Karte 2b „Drei Beschriftungen“ (Schild: „Variablenlabel und Wertelabel: kennst du aus Sitzung 1“, Art: Im Bild)

Text:
> Jede Variable trägt drei Beschriftungen. Der **Variablenname** ist kurz und für R gemacht: `pa02a`. Das **Variablenlabel** sagt in Worten, was gefragt wurde: POLITISCHES INTERESSE, BEFR. (ORDINAL). Die **Wertelabels** sagen, was jeder Code bedeutet. Im Bild kleben sie als gelbe Aufkleber an den Steinen.

Bild **s2-drei-beschriftungen** (wie R-Workshop `k04-labels`, mit pa02a):
- Drei Zeilen. 1: dunkles Namensschild `pa02a`, rechts „Variablenname“. 2: Text „POLITISCHES INTERESSE, BEFR. (ORDINAL)“, rechts „Variablenlabel“. 3: blauer Stein 1 mit Aufkleber SEHR STARK, graue Auslassungspunkte, blauer Stein 5 mit Aufkleber UEBERHAUPT NICHT, rechts „Wertelabels“.
- **Textfassung:** „Die drei Beschriftungen von pa02a: der Variablenname pa02a, das Variablenlabel POLITISCHES INTERESSE, BEFR. (ORDINAL) und die Wertelabels, zum Beispiel 1 SEHR STARK bis 5 UEBERHAUPT NICHT.“

Zweiter Absatz:
> Nicht jeder Code hat ein Wort. Bei der Lebenszufriedenheit `ls01` haben nur die Enden ein Wertelabel: 0 GANZ UNZUFRIEDEN und 10 GANZ ZUFRIEDEN. Dazwischen steht im Codebuch nur „..“: Die Zahlen 1 bis 9 sprechen für sich. Und manche Variablen haben für ihre gültigen Werte gar keine Wertelabels; dort ist die Zahl selbst die Antwort.

**Kurz gesagt:** Variablenname (kurz, für R), Variablenlabel (was gefragt wurde) und Wertelabels (was ein Code bedeutet) stehen zusammen im Codebuch.

**Genauer erklärt: Wie liest du einen Eintrag in der Werkstatt?**
Beispiel (wörtlich aus R, Werkstatt-Fassung):
```
[239] pa02a (haven_labelled<double>)
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
      -9 = KEINE ANGABE (n = 17)
```
- `[239]` ist die Position im Datensatz: pa02a ist der 239. Turm.
- In Klammern steht der Typ: eine Zahl mit Wertelabels (Grundlage 4).
- Umlaute schreibt der ALLBUS als ae, oe, ue: UEBERHAUPT. Bei der Suche mit `find_var()` hilft das (kennst du aus Sitzung 1).
- Wer selbst einen Datensatz eingibt, vergibt diese Beschriftungen selbst. Wie das in R geht, zeigt der R-Workshop in Kapitel 4 („Variablen- und Wertelabels lesen und setzen“); im Seminar war es nicht dran.

**Häufige Verwechslung:** Variablenlabel und Wertelabel. Das Variablenlabel beschriftet den ganzen Turm („Politisches Interesse“), ein Wertelabel einen einzelnen Code („SEHR STARK“).

→ In der freien Karte: „Variablen- und Wertelabels“ (Begriffskarte `labels`), „Codebuch und Variablensuche“ (`codebook`).

#### Karte 2c „Codes sind Namen“ (Art: Kurz überlegen)

Text:
> Bei der Wahlabsicht `pv01` („Wenn am nächsten Sonntag Bundestagswahl wäre …“) hat jede Partei einen Code. Sieh dir die Codes an:

Bild **s2-pv01** (Typ: Reihe von Steinen mit Aufklebern, waagerecht):
- Acht blaue Steine nebeneinander mit gelben Aufklebern: 1 CDU-CSU, 2 SPD, 3 FDP, 4 DIE GRUENEN, 6 DIE LINKE, 42 AFD, 90 ANDERE PARTEI, 91 WUERDE NICHT WAEHLEN. Zwischen 4 und 6 eine schmale Lücke mit grauem Hinweis „keine 5“.
- **Textfassung:** „Codes der Wahlabsicht pv01: 1 CDU-CSU, 2 SPD, 3 FDP, 4 DIE GRUENEN, 6 DIE LINKE, 42 AFD, 90 ANDERE PARTEI, 91 WUERDE NICHT WAEHLEN. Den Code 5 gibt es nicht.“

> Die AfD hat den Code 42, die Linke die 6, eine 5 gibt es nicht. Die Codes sind wie Rückennummern: Sie benennen, sie zählen nichts ab.

Kurz überlegen (choice, `g2_mittel`): „Rechnet man trotzdem den Mittelwert aller gültigen Codes von `pv01` aus, kommt 16,1 heraus. Was sagt diese Zahl über die Wahlabsicht?“
- Optionen: „Die durchschnittliche Wahlabsicht liegt zwischen der Linken (6) und der AfD (42).“ | „Nichts: Für 16,1 gibt es keine Partei, die Codes sind nur Namen.“ | „Die meisten wählen eine Partei mit kleinem Code.“
- Ziel: „Nichts: …“
- Richtig: „Genau. Bei Codes für Kategorien ohne Reihenfolge ist ein Mittelwert sinnlos. Zählen kannst du sie, rechnen nicht. Wie oft jede Partei genannt wird, zeigt `frequency()` (kennst du aus Sitzung 1); Prozente dazu kommen in Sitzung 3.“
- Falsch: „Der Mittelwert behandelt die Codes wie Mengen. Die 42 der AfD ist aber nicht siebenmal so viel wie die 6 der Linken. Für 16,1 gibt es keine Partei.“

**Kurz gesagt:** Codes für Kategorien sind Namen, keine Mengen. Ob du mit einer Zahl rechnen darfst, hängt davon ab, was sie misst; der Fachbegriff dafür ist **Skalenniveau** (Thema in Sitzung 3).

**Genauer erklärt: Warum 42?**
Welche Zahl eine Partei bekommt, legen die Macherinnen und Macher der Befragung fest; Lücken und große Zahlen sind dabei erlaubt. Wichtig ist nur: Gleicher Code heißt gleiche Antwort, und welche Antwort das ist, steht im Codebuch. Zählen darfst du die Codes: Im ALLBUS 2023 nennen 480 Befragte die AfD und 260 die Linke.

**Häufige Verwechslung:** Platz auf dem Bogen und Code. Steht die Linke auf dem Papierbogen an fünfter Stelle, ist ihr Code trotzdem 6. Wer Listenplätze abzählt, statt im Codebuch nachzusehen, erfasst falsch.

---

### Aufgabe 2 „Ein Bogen wird zur Zeile“ (Pflicht)

Kopf: „A2“, Titel, Schild „Pflicht“, Link „↑ Grundlage 2 nachlesen“.

**Leitfrage:** Welche Zahlen stehen in der Zeile dieser Person?

**Ziel:** Am Ende hast du aus einem ausgefüllten Papierbogen eine Zeile mit vier Codes gemacht und kannst begründen, warum ein höherer Code nicht immer „mehr“ bedeutet.

**Grundlage:** Grundlage 2 „Codes und Labels“.

Einleitung:
> Vor dir liegt ein ausgefüllter Papierbogen, zum Beispiel dieser hier. Die Antworten sind ausgedacht; so einen Bogen gibt es im ALLBUS nicht. Mach daraus eine Zeile, wie sie im ALLBUS stehen würde. Welcher Code zu welchem Wertelabel gehört, steht im Codebuch.

Bild **s2-bogen-a2** (Typ: Papierbogen, weiß, dünner grauer Rand, vier Fragen, Kreuze orange; Kopf „Fragebogen, Seite 3“ ohne Logos):
1. „Wie alt sind Sie?“ handschriftlich eingetragen: „19 Jahre“.
2. „Welchen allgemeinbildenden Schulabschluss haben Sie?“ □ ohne Abschluss □ Volks-, Hauptschulabschluss □ Mittlere Reife □ Fachhochschulreife □ Abitur, Hochschulreife □ anderer Abschluss ☒ Ich gehe noch zur Schule.
3. „Wie beurteilen Sie Ihre eigene wirtschaftliche Lage heute?“ □ sehr gut □ gut □ teils/teils ☒ schlecht □ sehr schlecht.
4. „Welcher Schicht rechnen Sie sich selbst zu?“ □ Unterschicht ☒ Arbeiterschicht □ Mittelschicht □ obere Mittelschicht □ Oberschicht □ keiner dieser Schichten.
- Darunter klein: Variablennamen der Fragen im ALLBUS: 1 `age`, 2 `educ`, 3 `ep03`, 4 `id02`.
- Die Antwortkombination ist ausgedacht; `sitzung02-zahlen.R` prüft, dass keine befragte Person im ALLBUS 2023 diese vier Angaben zugleich hat (Anzahl 0).
- **Textfassung:** „Ausgefüllter Papierbogen, ein ausgedachtes Beispiel. Frage 1 Alter (age): 19 Jahre eingetragen. Frage 2 Schulabschluss (educ): angekreuzt ‚Ich gehe noch zur Schule‘. Frage 3 eigene wirtschaftliche Lage (ep03), Antworten sehr gut, gut, teils/teils, schlecht, sehr schlecht: angekreuzt ‚schlecht‘. Frage 4 Schicht (id02), Antworten Unterschicht, Arbeiterschicht, Mittelschicht, obere Mittelschicht, Oberschicht, keiner dieser Schichten: angekreuzt ‚Arbeiterschicht‘.“

**Erst festlegen** (choice, zitiert bei `a2_ep03`): „Welche Zahl bekommt ‚schlecht‘ bei der eigenen wirtschaftlichen Lage?“
- Optionen: „2“ | „4“ | „Das kann ich ohne Codebuch nicht wissen.“
- Knopf „Tipp abgeben“.

**Schritt 1:** „Schlag die vier Variablen im Codebuch nach. Führe die Vorlage aus.“

Vorlage `a2` (Kopf: „Vorlage: vier Variablen nachschlagen“):
```r
# Codes und Wertelabels für die vier Fragen des Bogens
codebook(allbus, age, educ, ep03, id02)
```
Erwartete Ausgabe (Werkstatt, Auszug):
```
[93] age (haven_labelled<double>)
    Label: ALTER: BEFRAGTE(R)
    Values: 18 - 99 (79 distinct)
    Missing values:
      -32 = NICHT GENERIERBAR (n = 23)

[273] educ (haven_labelled<double>)
    Label: ALLGEMEINER SCHULABSCHLUSS
    Values: 1, 2, 3, 4, 5, 6, 7
    Value labels:
      1 = OHNE ABSCHLUSS  2 = VOLKS-,HAUPTSCHULE  3 = MITTLERE REIFE
      4 = FACHHOCHSCHULREIFE  5 = HOCHSCHULREIFE  6 = ANDERER ABSCHLUSS  7 = NOCH SCHUELER
    …
[12] ep03 … 1 = SEHR GUT 2 = GUT 3 = TEILS/TEILS 4 = SCHLECHT 5 = SEHR SCHLECHT …
[35] id02 … 1 = UNTERSCHICHT 2 = ARBEITERSCHICHT 3 = MITTELSCHICHT 4 = OBERE MITTELSCHICHT 5 = OBERSCHICHT
    Missing values: -50 = KEINER DER SCHICHTEN (n = 15) …
```
(In der Werkstatt steht jedes Wertelabel in eigener Zeile; hier gekürzt.)

**Schritt 2:** „Such zu jeder Antwort auf dem Bogen das passende Wertelabel und trag den Code unten in die Antwortfelder ein (die ersten vier Fragen). Achte auf die Richtung der Skala. Steht bei einer Variable kein Wertelabel für die Antwort, ist die Zahl selbst der Wert.“

**Schritt 3 (Deuten):** „Lies deine fertige Zeile: Welche Zahl sagt etwas über eine Menge, welche ist nur ein Name? Dazu gehört die letzte Frage unten.“

**Antwortfragen** (Einleitung: „Deine Zeile für diesen Bogen“):

| id | Art | Label | Optionen | Ziel | Toleranz | Richtig | Falsch / Hinweis | Hilfezeile |
|---|---|---|---|---|---|---|---|---|
| a2_age | choice | Was trägst du bei `age` ein? | „die Zahl vom Bogen, also 19“ / „den Code des Wertelabels für 19 Jahre“ / „−32“ | die Zahl vom Bogen, also 19 | – | Stimmt. `age` hat für gültige Werte keine Wertelabels (unter `Values` steht nur 18 - 99); die Zahl ist selbst die Antwort: Jahre. Nur der fehlende Wert −32 NICHT GENERIERBAR trägt ein Label. | Schau bei age nach „Value labels“: Es gibt keine für die Jahre. −32 ist ein fehlender Wert. Die Zahl vom Bogen ist schon der Wert. | Aus der Vorlage, age, Values. |
| a2_educ | number | Welcher Code gehört bei `educ` zum Wertelabel für „Ich gehe noch zur Schule“? | – | 7 | exakt | Stimmt: 7 = NOCH SCHUELER. | Noch nicht. Such unter „Value labels“ von educ das Wertelabel für jemanden, der noch zur Schule geht. | Aus der Vorlage, educ, Value labels. |
| a2_ep03 | number | Welcher Code gehört bei `ep03` zum angekreuzten „schlecht“? | – | 4 | exakt | Stimmt: 4 = SCHLECHT. Die Skala beginnt mit 1 = SEHR GUT. Dein Tipp vorhin: „{Tipp}“. | Noch nicht. Bei ep03 steht 1 für SEHR GUT. In welche Richtung läuft die Skala, und wo steht SCHLECHT? | Aus der Vorlage, ep03, Value labels. |
| a2_id02 | number | Welcher Code gehört bei `id02` zur angekreuzten „Arbeiterschicht“? | – | 2 | exakt | Stimmt: 2 = ARBEITERSCHICHT. | Noch nicht. Such unter „Value labels“ von id02 das Wort ARBEITERSCHICHT. | Aus der Vorlage, id02, Value labels. |
| a2_rang | choice | Jemand anderes hat bei `educ` den Code 5. Hat diese Person einen höheren Abschluss als die Person auf deinem Bogen mit der 7? | „Nein, umgekehrt: 7 ist der höchste Abschluss.“ / „Ja: 5 heißt HOCHSCHULREIFE, 7 heißt NOCH SCHUELER, also noch gar kein Abschluss.“ / „Das kann man nicht sagen.“ | Ja: 5 heißt HOCHSCHULREIFE … | – | Genau. Bei `educ` laufen die Codes 1 bis 5 von ohne Abschluss bis Hochschulreife; 6 und 7 hängen hinten an und passen in keine Rangfolge. Codes sind Namen: Ob eine Reihenfolge gilt, sagt das Wertelabel, nicht die Zahl. | Lies die Wertelabels von educ: Was heißt 5, was heißt 7? Die höhere Zahl ist hier nicht der höhere Abschluss. | Aus der Vorlage, educ, Value labels. |

Bei `a2_ep03` = 2: zusätzlich „2 wäre GUT. Viele erwarten, dass die höhere Zahl ‚besser‘ heißt; hier ist es umgekehrt.“ Bei `a2_educ` = 5: „5 ist HOCHSCHULREIFE. Die Person geht aber noch zur Schule.“

**Weiterdenken in der Probier-Werkstatt (für die Aufgabe nicht nötig)**, zugeklappt:
> Für die Aufgabe reichen die Vorlagen oben. Eine Idee: Wie ist der Familienstand gespeichert, und gibt es dort eine Rangfolge? Die Probier-Werkstatt startet mit einem Vorschlag.
```r
# Eine Idee: Wie ist der Familienstand gespeichert?
codebook(allbus, mstat)
```
(Ergebnis: 1 = VERHEIRAT.ZUSAM.LEB. bis 5 = LEDIG.)

**Hilfe, Stufe 1: Denkanstoß:** „Auf dem Papier stehen Wörter, im Datensatz Codes. Das Codebuch verbindet beides. Und Vorsicht: Die Reihenfolge der Zahlen sagt nicht, was ‚mehr‘ ist.“

**Hilfe, Stufe 2: Wo schaue ich?:** „In der Ausgabe der Vorlage steht für jede Variable ein Block. Unter ‚Value labels‘ suchst du das Wort vom Bogen und nimmst die Zahl davor. Bei age gibt es keine ‚Value labels‘ für Jahre.“

**Hilfe, Stufe 3: Lösung:** „Die Zeile für diesen ausgedachten Bogen lautet: age 19 (die Zahl selbst, ohne Wertelabel), educ 7 (NOCH SCHUELER), ep03 4 (SCHLECHT), id02 2 (ARBEITERSCHICHT). Bei educ heißt 7 NOCH SCHUELER und liegt damit nicht über 5 HOCHSCHULREIFE. Bei ep03 beginnt die Skala mit 1 = SEHR GUT, ‚schlecht‘ ist 4.“

**Ohne Grafik lösbar:** Der Bogen hat eine Textfassung; alle Codes stehen als Text in der R-Ausgabe.

**Fürs Plenum (optional):** „Hättet ihr ‚keiner dieser Schichten‘ angekreuzt, stünde dort −50, ein fehlender Wert, obwohl die Person geantwortet hat. Ist das richtig so? Bringt eine Begründung mit.“ (Verbindung zu Thema 3.)

---

## 5. Thema 3: Fehlende Werte haben Gründe

### Grundlage 3 „Fehlt ist nicht gleich fehlt“

Kopf: „Was trägt man ein, wenn keine gültige Antwort da ist, und warum steht dort ein Grund? Drei kurze Schritte, etwa 15 Minuten.“ Knopf „Schon klar? Direkt zu Aufgabe 3 ↓“.

Einleitung (mit Schild „fehlende Werte und TNZ: kennst du aus Sitzung 1“): „In Sitzung 1 hast du fehlende Werte in der Ausgabe von `frequency()` gelesen. Heute stehst du auf der anderen Seite: Du hältst einen Bogen in der Hand und entscheidest, was in die Zelle kommt.“

#### Karte 3a „Was trägst du ein?“ (Art: Kurz überlegen, interaktiv)

Text:
> Nicht jeder Bogen ist sauber ausgefüllt. Vier Bögen, zum Beispiel. Entscheide für jeden, was im Datensatz stehen soll.

Interaktion **„Vier Bögen“** (vier kleine Bogenausschnitte nacheinander oder als Raster, je drei Knöpfe als Radiogruppe, Rückmeldung je Bogen `aria-live`):

| Bogen | Frage und Bild | Optionen | richtig | Rückmeldung richtig | Rückmeldung falsch |
|---|---|---|---|---|---|
| A | Lebenszufriedenheit 0 bis 10, Kreuz bei 0 | 0 / −9 / leer lassen | 0 | Die 0 ist eine Antwort: GANZ UNZUFRIEDEN. Im ALLBUS 2023 haben 26 Befragte sie gegeben. | Die Person hat geantwortet, ganz unzufrieden. Die 0 ist ein gültiger Wert, kein Fehlen. |
| B | Lebenszufriedenheit 0 bis 10, kein Kreuz | 0 / −9 / leer lassen | −9 | Genau: −9 KEINE ANGABE. Bei 81 Befragten steht dieser Code. | 0 hieße „ganz unzufrieden“, das hat die Person nicht gesagt. Leer lassen wäre schlechter: R wüsste dann nur „fehlt“, aber nicht warum. Der ALLBUS speichert −9 KEINE ANGABE. |
| C | Lebenszufriedenheit 0 bis 10, Kreuze bei 7 und 8 | 7 / 7,5 / −42 | −42 | Genau: −42 DATENFEHLER: MFN, MFN heißt Mehrfachnennung. Der ALLBUS rät nicht, welches Kreuz gemeint war. | 7,5 gibt es als Code nicht. Und das erste Kreuz zu nehmen, wäre geraten. Der ALLBUS speichert −42 DATENFEHLER: MFN (Mehrfachnennung). |
| D | Demokratiezufriedenheit: Die Frage steht auf diesem Bogen gar nicht (Kopf: „Version B“) | −9 / −11 / leer lassen | −11 | Genau: −11 TNZ: SPLIT. TNZ heißt „trifft nicht zu“ (kennst du aus Sitzung 1): Die Person wurde nicht gefragt. 1.596 Befragte haben diese Frage nicht bekommen, alle mit Version B. | −9 hieße, die Person hat nicht geantwortet. Sie wurde aber gar nicht gefragt: Die Frage stand nur in der anderen Fragebogenversion. Dafür gibt es −11 TNZ: SPLIT. |

Bild der Bögen: je ein kleiner Bogenausschnitt (weiß, grauer Rand), Skala 0 bis 10 als Kästchenreihe, Kreuze orange; Bogen D zeigt Fragen 12 und 14 mit einer Lücke dazwischen und dem grauen Hinweis „Frage 13 fehlt in Version B“ (im ALLBUS 2023 fehlt `ps03` tatsächlich in Version B, `splt23_1` = 2; geprüft im Skript). **Textfassung** je Bogen wie Spalte „Frage und Bild“.

Nach allen vier Antworten erscheint Bild **s2-luecken** (Typ: Türme mit leeren Steinen und Aufklebern, wie R-Workshop `k04-missing-codes`):
- Turm `ls01` (grau `<dbl+lbl>`) mit drei Steinen der Bögen A bis C: blauer Stein 0 mit Aufkleber GANZ UNZUFRIEDEN; leerer gestrichelter Stein mit gelbem Aufkleber −9 KEINE ANGABE; leerer gestrichelter Stein mit Aufkleber −42 DATENFEHLER: MFN.
- Daneben Turm `ps03` mit einem leeren gestrichelten Stein, Aufkleber −11 TNZ: SPLIT (Bogen D).
- Unter den leeren Steinen klein „in R: NA“.
- **Textfassung:** „Die vier Bögen im Datensatz. ls01: der Wert 0 mit dem Wertelabel GANZ UNZUFRIEDEN, dann zwei leere Steine mit den Gründen −9 KEINE ANGABE und −42 DATENFEHLER: MFN. ps03: ein leerer Stein mit dem Grund −11 TNZ: SPLIT. Leere Steine sind in R NA; der Grund bleibt als Aufkleber erhalten.“

**Kurz gesagt:** Ein **fehlender Wert** heißt: Für diese Person gibt es bei dieser Variable keine gültige Antwort. Der ALLBUS speichert dazu den Grund als negativen Code, etwa −9 KEINE ANGABE oder −11 TNZ: SPLIT. In R wird daraus ein `NA`, ein leerer Stein; den Grund merkt sich R als Aufkleber.

**Häufige Verwechslung:** 0 und fehlend. Eine 0 kann eine Antwort sein (ganz unzufrieden, 0 Kinder). „Keine Angabe“ dagegen ist −9 und wird nie mitgerechnet.

#### Karte 3b „Die Gründe im Codebuch“ (Schild: „TNZ: SPLIT und TNZ: FILTER: kennst du aus Sitzung 1“, Art: Im Bild, Tabelle)

Text:
> Im Codebuch stehen die fehlenden Werte jeder Variable unter „Missing values“, mit Grund und Anzahl. Im ALLBUS 2023 gibt es 17 verschiedene solche Codes. Die wichtigsten:

Tabelle **s2-gruende** (Typ: Tabelle mit hervorgehobener Spalte „heißt“; als HTML-Tabelle, kein SVG nötig; Beschriftung „Fehlende Werte im ALLBUS 2023, Beispiele“):

| Code | Wertelabel | heißt | Beispiel im ALLBUS 2023 |
|---|---|---|---|
| −6 | KENNE ICH NICHT | die Person kennt das Gefragte nicht | Astrologie und Horoskope (`rh08b`): 178-mal |
| −8 | WEISS NICHT | die Person weiß keine Antwort | Wahlabsicht (`pv01`): 603-mal |
| −9 | KEINE ANGABE | gefragt, aber nicht geantwortet | Lebenszufriedenheit (`ls01`): 81-mal |
| −10 | TNZ: FILTER | nicht gefragt, weil eine Frage davor sie ausgeschlossen hat | Arbeitsstunden (`dw15`): 2.263-mal |
| −11 | TNZ: SPLIT | nicht gefragt, weil die Frage nur in der anderen Fragebogenversion stand | Demokratiezufriedenheit (`ps03`): 1.596-mal |
| −42 | DATENFEHLER: MFN | mehrere Kreuze, keines lässt sich nehmen | Lebenszufriedenheit (`ls01`): 1-mal |

> TNZ heißt „trifft nicht zu“ (kennst du aus Sitzung 1): Wer nicht gefragt wurde, kann nicht geantwortet haben. Das ist etwas anderes als jemand, der die Antwort verweigert. Online und auf Papier gab es zwei Fragebogenversionen, A und B; manche Fragen standen nur in einer davon.

**Kurz gesagt:** Fehlende Werte haben Gründe: nicht geantwortet, nicht gewusst, nicht gefragt oder nicht lesbar. Der Code hält den Grund fest, damit du später entscheiden kannst, wen du weglässt und was das bedeutet.

**Genauer erklärt: Was R aus den Codes macht**
- Beim Einlesen mit `read_spss()` werden alle Codes, die im Codebuch als fehlend markiert sind, zu `NA`, „not available“. Im ALLBUS sind das die negativen Codes unter „Missing values“. So rechnet R nie aus Versehen mit −9, als wäre es eine Antwort.
- Den Grund merkt sich R trotzdem im Hintergrund. Darum zeigt das Codebuch die fehlenden Werte mit Grund und Anzahl.
- Wie viele gültige und fehlende Werte eine Variable hat, zeigt `frequency()` (kennst du aus Sitzung 1: Zeilen „Total valid“ und „Total missing“). In Sitzung 3 entscheidest du, auf welche Basis sich Prozente beziehen; ab Sitzung 4 lässt du fehlende Werte für eine Grafik ausdrücklich weg.
- Bei −10 TNZ: FILTER: Arbeitsstunden werden nur erfragt, wenn eine Frage davor das vorsieht; wer dort herausfiel, bekommt −10. Für eine Auswertung heißt das: Die Arbeitsstunden beschreiben nur die Befragten, die danach gefragt wurden.

**Häufige Verwechslung:** Leere Zelle und fehlender Wert mit Grund. Lässt man beim Erfassen eine Zelle leer, wird sie in R zu einem `NA` ohne Grund. Niemand weiß dann mehr, ob die Person nicht geantwortet hat oder nicht gefragt wurde.

→ In der freien Karte: „Fehlende Werte“ (Begriffskarte `missing`).

#### Karte 3c „Fehler oder Konvention?“ (Art: Kurz überlegen)

Text:
> Beim Erfassen gibt es zwei Arten von Abweichungen. Bei manchen sagt das Codebuch genau, was einzutragen ist. Wer etwas anderes einträgt, macht einen **Fehler**. Bei anderen entscheidet das Codebuch nichts, etwa bei einem Kreuz genau auf der Linie oder einer Randnotiz. Dann muss jemand eine Regel festlegen und aufschreiben: eine **Konvention**. Oft gibt es nicht die eine richtige Regel, wohl aber eine gut begründete.

Kurz überlegen (drei Fälle, je Radiogruppe „Fehler gegen das Codebuch“ / „Konvention“, Knopf „Auflösen“):

| id | Fall | Ziel | Rückmeldung |
|---|---|---|---|
| g3_k1 | Die Linke steht auf dem Bogen an fünfter Stelle; jemand trägt bei `pv01` die 5 ein. | Fehler | Fehler: Das Codebuch sagt eindeutig 6 = DIE LINKE (Grundlage 2c). |
| g3_k2 | Bei der Lebenszufriedenheit sitzt das Kreuz genau auf der Linie zwischen 7 und 8. | Konvention | Konvention: Das Codebuch kennt kein Kreuz auf der Linie. Jemand muss eine Regel festlegen, etwa „zählt als −42“ oder „zählt als das Kästchen, in dem der größere Teil des Kreuzes liegt“, und sie für alle Bögen gleich anwenden. |
| g3_k3 | Eine Frage steht nicht auf dem Bogen; jemand trägt −9 KEINE ANGABE ein. | Fehler | Fehler: Die Person wurde nicht gefragt. Dafür gibt es −11 TNZ: SPLIT. |

**Kurz gesagt:** Jede Zelle im Datensatz ist eine kleine Entscheidung. Wo das Codebuch sie trifft, gibt es eine richtige Zahl. Wo nicht, braucht es eine dokumentierte Regel, sonst bedeutet derselbe Code nicht mehr dasselbe.

---

### Aufgabe 3 „Was nur auf Papier passiert“ (Pflicht)

Kopf: „A3“, Titel, Schild „Pflicht“, Link „↑ Grundlage 3 nachlesen“.

**Leitfrage:** Welche fehlenden Werte gibt es im ALLBUS nur, weil es Papierbögen gibt?

**Ziel:** Am Ende kannst du sagen, wie der ALLBUS zwei Kreuze und nicht gestellte Fragen speichert, und mit Zahlen aus R begründen, warum „fehlt“ nicht gleich „fehlt“ ist.

**Grundlage:** Grundlage 3 „Fehlt ist nicht gleich fehlt“, dazu Aufgabe 1 (`filter()`).

Einleitung:
> Einen Papierbogen füllt man anders aus als einen Online-Fragebogen oder ein Interview mit Laptop. Und auf Papier wie online gab es zwei Fragebogenversionen, A und B. Beides hinterlässt Spuren in den fehlenden Werten. Du schaust dir drei Fragen an: die Links-rechts-Einstufung `pa01` (1 = links, 10 = rechts), das Vertrauen zu Mitmenschen `st01` und das Vertrauen in den Bundestag `pt03`.

**Erst festlegen** (choice, zitiert bei `a3_wo`): „Kommt der Code für Mehrfachnennung (−42) bei `pa01` auch bei Befragten vor, die im Interview oder online geantwortet haben?“
- Optionen: „ja, ähnlich oft wie auf Papier“ | „ja, aber seltener“ | „nein, nie“
- Knopf „Tipp abgeben“.

**Schritt 1:** „Behalte nur die Papierbögen und schlag drei Fragen im Codebuch nach. Führe die Vorlage so aus, wie sie ist. Schau bei jeder Frage unter ‚Missing values‘.“

Vorlage `a3` (Kopf: „Vorlage: Codebuch der Papierbögen“):
```r
# Nur die Papierbögen behalten
papier <- allbus %>%
  filter(mode == 4)

# Codebuch für drei Fragen, nur Papierbögen
codebook(⟦papier⟧, pa01, st01, pt03)
```
Erwartete Ausgabe (Werkstatt, Auszug, unverändert):
```
  Dataset: papier
  Observations: 1656
[245] pa01 …
    Missing values:
      -42 = DATENFEHLER: MFN (n = 24)
      -9 = KEINE ANGABE (n = 54)
[65] st01 …
    Missing values:
      -42 = DATENFEHLER: MFN (n = 22)
      -11 = TNZ: SPLIT (n = 858)
      -9 = KEINE ANGABE (n = 9)
      -8 = WEISS NICHT
[208] pt03 …
    Missing values:
      -42 = DATENFEHLER: MFN (n = 3)
      -11 = TNZ: SPLIT (n = 798)
      -9 = KEINE ANGABE (n = 13)
```
Hilfetext: „Das Codebuch zählt jetzt nur die Papierbögen: oben steht ‚Observations: 1656‘. Die Anzahl steht hinter ‚n =‘; steht dort keine, kommt der Code in dieser Auswahl nicht vor (wie −8 bei st01). In RStudio stehen die Anzahlen im Viewer in der Spalte Freq.“

**Schritt 2:** „Vergleiche mit allen Befragten: Tausch die markierte Stelle `papier` gegen `allbus` und führe die Vorlage noch einmal aus. Wie oft steht −42 bei `pa01` jetzt?“
Erwartete Ausgabe nach dem Tausch (Auszug): `Observations: 5246`; pa01 `-42 = DATENFEHLER: MFN (n = 24)`, `-9 = KEINE ANGABE (n = 225)`; st01 `-11 = TNZ: SPLIT (n = 1647)`; pt03 `-11 = TNZ: SPLIT (n = 1596)`.

**Schritt 3:** „Zurück zu den Papierbögen (Zurücksetzen oder wieder `papier` eintragen): Wie oft steht −11 TNZ: SPLIT bei `st01`, wie oft bei `pt03`? Zähl beide zusammen und vergleiche mit der Zahl der Papierbögen aus Aufgabe 1.“

Bild **s2-split** (in Schritt 3; Typ: zwei Bögen → zwei Reihen; konstruiert, ohne Gesamtzahlen):
- Links zwei kleine Papierbögen: „Version A“ mit den Fragen „Vertrauen in den Bundestag“ (Kreuz bei 5) und ohne „Vertrauen zu Mitmenschen“ (graue Lücke „steht nicht in Version A“); „Version B“ mit „Vertrauen zu Mitmenschen“ (Kreuz bei „kommt darauf an“) und ohne „Vertrauen in den Bundestag“ (graue Lücke).
- Pfeile zu zwei Reihen einer Bauplatte mit Türmen `st01` und `pt03`: Reihe Version A: `st01` leerer gestrichelter Stein mit Aufkleber −11 TNZ: SPLIT, `pt03` blauer Stein 5. Reihe Version B: `st01` blauer Stein 3 mit Aufkleber KOMMT DARAUF AN, `pt03` leerer Stein mit −11 TNZ: SPLIT.
- **Textfassung:** „Zwei Papierbögen, ein Beispiel. Version A enthält die Frage nach dem Vertrauen in den Bundestag (pt03), aber nicht die nach dem Vertrauen zu Mitmenschen (st01); im Datensatz steht bei st01 −11 TNZ: SPLIT. Version B enthält st01, aber nicht pt03; dort steht bei pt03 −11 TNZ: SPLIT. Jede Reihe hat also genau eine der beiden Lücken.“

**Antwortfragen:**

| id | Art | Label | Optionen | Ziel | Toleranz | Richtig | Falsch / Hinweis | Hilfezeile |
|---|---|---|---|---|---|---|---|---|
| a3_mfn_papier | number | Wie oft steht −42 bei `pa01` in den Papierbögen? | – | 24 | exakt | Stimmt: 24 Papierbögen haben bei der Links-rechts-Frage mehrere Kreuze. | Noch nicht. Schau in Schritt 1 bei pa01 unter „Missing values“ in die Zeile mit −42. Die Zahl steht hinter „n =“. | Schritt 1, pa01, Zeile −42. |
| a3_mfn_alle | number | Wie oft steht −42 bei `pa01` bei allen Befragten? | – | 24 | exakt | Stimmt: ebenfalls 24. | Noch nicht. Hast du in Schritt 2 `papier` gegen `allbus` getauscht? Oben muss „Observations: 5246“ stehen. | Schritt 2, pa01, Zeile −42. |
| a3_wo | choice | Wo kommen Mehrfachnennungen bei `pa01` also vor? | „überall gleich oft“ / „nur auf Papier“ / „vor allem online“ | nur auf Papier | – | Genau: 24 bei allen, 24 auf Papier, also im Interview und online kein einziges Mal. Dort lässt sich nur ein Kästchen wählen. Dein Tipp vorhin: „{Tipp}“. | Vergleiche die beiden Zahlen: Wenn alle 24 Mehrfachnennungen auch unter den Papierbögen sind, wie viele bleiben dann für Interview und online? | Vergleiche Schritt 1 und Schritt 2. |
| a3_st01 | number | Wie oft steht −11 TNZ: SPLIT bei `st01` in den Papierbögen? | – | 858 | exakt | Stimmt: 858 Papierbögen hatten die Frage nach dem Vertrauen zu Mitmenschen nicht. | Noch nicht. Nimm die Ausgabe für `papier` (Observations: 1656), Variable st01, Zeile −11. 1.647 wäre bei allen Befragten. | Schritt 1, st01, Zeile −11. |
| a3_pt03 | number | Wie oft steht −11 TNZ: SPLIT bei `pt03` in den Papierbögen? | – | 798 | exakt | Stimmt: 798 Papierbögen hatten die Frage nach dem Bundestag nicht. | Noch nicht. Nimm die Ausgabe für `papier`, Variable pt03, Zeile −11. 1.596 wäre bei allen Befragten. | Schritt 1, pt03, Zeile −11. |
| a3_split | choice | 858 + 798 = 1.656, genau alle Papierbögen. Was heißt das? | „1.656 Menschen wollten bei beiden Fragen nicht antworten.“ / „Jeder Papierbogen hatte genau eine der beiden Fragen nicht: Version A ohne st01, Version B ohne pt03.“ / „Bei den Papierbögen ist etwas schiefgegangen.“ | Jeder Papierbogen hatte genau eine … | – | Genau. Die 858 Bögen der Version A hatten keine Frage nach dem Vertrauen zu Mitmenschen, die 798 Bögen der Version B keine nach dem Bundestag. Weil jeder Bogen entweder Version A oder Version B war, überschneiden sich die beiden Gruppen nicht. −11 heißt: nicht gefragt, nicht „nicht geantwortet“. | −11 TNZ: SPLIT heißt „nicht gefragt“. Wer nicht gefragt wurde, hat auch nicht verweigert. Zusammen sind es genau alle 1.656 Papierbögen: Jeder fehlt bei genau einer der beiden Fragen. | Grundlage 3b, Zeile −11. |

**Fürs Plenum:**
> Im ganzen ALLBUS steht −42 in 638 Zellen, und 357 der 1.656 Papierbögen haben mindestens eine Mehrfachnennung. Online und im Interview gibt es keine. Was heißt das, wenn du später nur gültige Antworten auswertest: Wessen Antworten fallen häufiger weg? Und wäre es besser gewesen, beim Abtippen eines der zwei Kreuze zu nehmen? Bringt eine Begründung mit.

(Hinweis für den Umsetzenden, nicht im Kapiteltext: Das Kreuz auf der Linie ist schon in Grundlage 3c aufgelöst und wird hier nicht wiederholt.)

**Weiterdenken in der Probier-Werkstatt (für die Aufgabe nicht nötig)**, zugeklappt:
> Für die Aufgabe reichen die Vorlagen oben. Eine Idee: Gab es die zwei Versionen auch online, und im Interview? Die Probier-Werkstatt startet mit einem Vorschlag.
```r
# Eine Idee: Gab es die zwei Versionen auch online? (mode 3 = CAWI)
online <- allbus %>%
  filter(mode == 3)

codebook(online, st01, pt03)
```
(Ergebnis: online st01 −11 = 789, pt03 −11 = 798, zusammen 1.587, alle Online-Befragten. Mit `mode == 2` erscheint bei st01 und pt03 keine Zeile −11: Im Interview bekamen alle beide Fragen.)

**Hilfe, Stufe 1: Denkanstoß:** „Ein Code für zwei Kreuze kann nur dort entstehen, wo man zwei Kreuze setzen kann. Und −11 heißt nicht ‚keine Lust‘, sondern ‚nicht gefragt‘.“

**Hilfe, Stufe 2: Wo schaue ich?:** „Alle Zahlen stehen in der Ausgabe der Vorlage unter ‚Missing values‘, hinter ‚n =‘. Achte darauf, ob oben ‚Observations: 1656‘ (nur Papier) oder ‚5246‘ (alle) steht.“

**Hilfe, Stufe 3: Lösung:** „Bei pa01 steht −42 in 24 Papierbögen und bei allen Befragten ebenfalls 24-mal: Mehrfachnennungen gibt es nur auf Papier. Bei st01 steht −11 in 858 Papierbögen, bei pt03 in 798; zusammen 1.656, also jeder Papierbogen genau einmal: Version A hatte st01 nicht, Version B pt03 nicht. Im ganzen ALLBUS steht −42 in 638 Zellen aus 202 Variablen, alle aus Papierbögen; 357 der 1.656 Papierbögen (21,6 %) haben mindestens eine Mehrfachnennung.“

**Ohne Grafik lösbar:** Alle Zahlen stehen als Text in der R-Ausgabe; das Bild s2-split hat eine Textfassung.

---

## 6. Thema 4: Datentypen

### Grundlage 4 „Datentypen“

Kopf: „Was für Steine liegen auf der Bauplatte, und was passiert, wenn man sie umwandelt? Zwei kurze Schritte, etwa 10 Minuten.“ Knopf „Schon klar? Direkt zu Aufgabe 4 ↓“.

#### Karte 4a „Steine haben Farben“ (Art: Im Bild)

Text:
> In R hat jeder Turm einen **Datentyp**. Er sagt, was für Steine darin liegen. Im Bild zeigt das die Farbe, in der Ausgabe von R steht er in spitzen Klammern über dem Turm. Drei Typen begegnen dir im ALLBUS:

Bild **s2-typen** (Typ: Legende plus konstruierte Bauplatte, wie R-Workshop `k03-legende` und `k03-tibble`):
- Oben Legende in einer Reihe: blauer Stein „52“ mit Unterschrift „Zahl `<dbl>`“; lila Stein „Lehrerin“ mit „Text `<chr>`“; blauer Stein „2“ mit gelbem Aufkleber NEUE BUNDESLAENDER und Unterschrift „Zahl mit Wertelabel `<dbl+lbl>`“; leerer gestrichelter Stein mit „fehlt `NA`“.
- Darunter Bauplatte „zum Beispiel“, 3 × 3: Türme `beruf <chr>` (lila: Lehrerin, Koch, Pflegerin), `alter <dbl>` (blau: 34, 52, 41), `eastwest <dbl+lbl>` (blau mit Aufklebern: 1 ALTE BUNDESLAENDER, 2 NEUE BUNDESLAENDER, 1 ALTE BUNDESLAENDER).
- **Textfassung:** „Drei Datentypen. Zahl, in R <dbl>, blauer Stein, zum Beispiel 52. Text, <chr>, lila Stein, zum Beispiel Lehrerin. Zahl mit Wertelabel, <dbl+lbl>, blauer Stein mit gelbem Aufkleber, zum Beispiel 2 mit NEUE BUNDESLAENDER. Ein fehlender Wert ist ein leerer Stein, NA. Beispiel-Bauplatte mit drei Personen: beruf (Text) Lehrerin, Koch, Pflegerin; alter (Zahl) 34, 52, 41; eastwest (Zahl mit Wertelabel) 1 ALTE BUNDESLAENDER, 2 NEUE BUNDESLAENDER, 1 ALTE BUNDESLAENDER.“

> Im ALLBUS sind 576 der 579 Variablen Zahlen mit Wertelabels. In der Ausgabe von R siehst du sie als Code mit dem Wertelabel in eckigen Klammern, etwa `2 [NEUE BUNDESLAENDER]`; lange Wörter kürzt R mit „…“. Nur zwei Variablen sind Text und eine einzige ist eine Zahl ganz ohne Aufkleber.

**Kurz gesagt:** Der **Datentyp** sagt, was in einem Turm steckt: Zahlen (`<dbl>`), Text (`<chr>`) oder Zahlen mit Wertelabels (`<dbl+lbl>`). R zeigt ihn in spitzen Klammern über jedem Turm.

**Genauer erklärt: Woher kommt `<dbl+lbl>`?**
- `dbl` steht für double, eine Zahl. `lbl` steht für labelled: An der Zahl klebt ihr Wertelabel. So reist das Codebuch mit den Daten mit.
- Dieser Typ entsteht beim Einlesen einer SPSS-Datei mit `read_spss()`. SPSS speichert Zahlen und Wertelabels getrennt, R klebt sie zusammen.
- Im Codebuch der Werkstatt heißt derselbe Typ `haven_labelled<double>`, im Viewer `lbl+dbl`. Gemeint ist immer: Zahl mit Wertelabel.
- Mehr im R-Workshop, Abschnitt 4 „Datentypen verstehen mit class()“.

**Häufige Verwechslung:** Typ und Bedeutung. Dass ein Turm aus Zahlen besteht, heißt nicht, dass du mit ihm rechnen darfst. Auch eine Postleitzahl ist eine Zahl, aber ein Name für einen Ort.

#### Karte 4b „Umwandeln: Aufkleber zum Wert machen oder abziehen“ (Art: Im Bild, interaktiv; Schild „Vorgriff auf Sitzung 4“)

Text:
> Manchmal braucht man statt der Zahl das Wort, etwa damit auf einer Grafik „FRAU“ statt 2 steht. Manchmal braucht man nur die Zahl. Man kann einen Turm deshalb umwandeln. Der Fachbegriff ist **Datentypen umwandeln** (Konvertierung). Probier beide Wege aus.

Interaktion **„Umwandeln“** (drei Umschaltknöpfe, `aria-pressed`, Bild und Text wechseln, Text `aria-live`):
- Turm `sex`, vier Steine, zum Beispiel: 1 MANN, 2 FRAU, 2 FRAU, leerer Stein mit Aufkleber KEINE ANGABE.
- Zustand „Original `<dbl+lbl>`“ (Start): blaue Steine 1, 2, 2 mit gelben Aufklebern MANN, FRAU, FRAU; leerer Stein mit Aufkleber KEINE ANGABE. Text: „So liegt `sex` im ALLBUS: Zahl und Wertelabel kleben zusammen, auch der fehlende Wert hat seinen Grund.“
- Zustand „Aufkleber wird zum Wert `<fct>`“: lila Steine MANN, FRAU, FRAU; leerer Stein ohne Aufkleber (Aufkleber grau, abgefallen daneben). Text: „Jetzt stehen Wörter im Turm, ein **Faktor**: Wörter mit fester Reihenfolge. Die Zahlen sind weg, und der leere Stein ist nur noch NA: Sein Grund KEINE ANGABE ist abgefallen. In R heißt dieser Weg `to_label()`; du lernst ihn in Sitzung 4 kennen, wenn auf einer Grafik Wörter stehen sollen.“
- Zustand „Aufkleber abziehen `<dbl>`“: blaue Steine 1, 2, 2 ohne Aufkleber; leerer Stein ohne Aufkleber. Text: „Jetzt bleiben nur die Zahlen. Was 1 und 2 bedeuten, steht nicht mehr am Turm; dafür brauchst du wieder das Codebuch.“
- **Textfassung (Tabelle):** Spalten Original / Aufkleber wird zum Wert / Aufkleber abziehen; Zeilen: 1 MANN | MANN | 1; 2 FRAU | FRAU | 2; 2 FRAU | FRAU | 2; fehlt (KEINE ANGABE) | NA | NA. Typ: dbl+lbl | fct | dbl.

Kurz überlegen (choice, `g4_verlust`): „Was geht verloren, wenn der Aufkleber zum Wert wird?“
- Optionen: „die Wörter“ | „der Grund, warum ein Wert fehlt, und die Codes“ | „nichts“
- Ziel: „der Grund, warum ein Wert fehlt, und die Codes“
- Richtig: „Genau. Für eine Grafik ist das in Ordnung. Willst du wissen, warum Werte fehlen, schau vorher ins Codebuch.“
- Falsch: „Schalte auf ‚Aufkleber wird zum Wert‘ und schau auf den leeren Stein und auf die Zahlen.“

**Kurz gesagt:** Umwandeln ändert den Datentyp. Wird der Aufkleber zum Wert, stehen Wörter im Turm (Faktor); zieht man ihn ab, bleiben Zahlen ohne Bedeutung. Jeder Weg lässt etwas weg.

**Häufige Verwechslung:** Umwandeln und Umkodieren. Umwandeln ändert nur die Form (Zahl oder Wort), nicht die Antworten. Antworten zusammenfassen oder umdrehen heißt Umkodieren; das kommt in Sitzung 5.

→ In der freien Karte: „Datentypen umwandeln“ (Begriffskarte `conversion`).

---

### Aufgabe 4 „Drei Typen auf einer Bauplatte“ (Zusatz)

Kopf: „A4“, Titel, Schild „Zusatz“, Link „↑ Grundlage 4 nachlesen“.

**Leitfrage:** Welche Zahlen im ALLBUS sind Antworten, welche nur Namen?

**Ziel:** Am Ende kannst du in der Ausgabe von R den Datentyp eines Turms ablesen und begründen, warum man mit einer Kennnummer nicht rechnet, obwohl sie eine Zahl ist.

**Grundlage:** Grundlage 4 „Datentypen“.

**Erst festlegen** (choice, zitiert bei `a4_rechnen`): „Jede befragte Person hat eine Kennnummer. Darf man mit ihr rechnen, etwa einen Mittelwert bilden?“
- Optionen: „ja, es ist eine Zahl“ | „nein“ | „kommt darauf an“
- Knopf „Tipp abgeben“.

**Schritt 1:** „Führe die Vorlage aus und schau in die Zeile unter den Namen der Türme: Dort steht unter jedem Namen in spitzen Klammern sein Typ.“

Vorlage `a4` (Kopf: „Vorlage: Papierbögen anzeigen“):
```r
# Nur die Papierbögen behalten und anzeigen
papier <- allbus %>%
  filter(mode == 4)

papier
```
Erwartete Ausgabe (Kopf, Breite 80): `# A tibble: 1,656 × 579`, dann Namen `za_nr doi version respid substudy mode splt23_1 splt23_2 eastwest`, darunter Typen `<dbl+lbl> <chr> <chr> <dbl> <dbl+lb> <dbl+l> …`; in der Spalte `mode` steht in jeder Reihe `4 [MAI…` (gekürzt für `4 [MAIL]`).

Hilfetext: „`respid` ist die Kennnummer der befragten Person, `doi` die Internetadresse des Datensatzes, `mode` der Erhebungsweg aus Aufgabe 1. Ist dein Fenster schmal, kürzt R Typen und Wörter mit ‚…‘: `<dbl+l>` heißt `<dbl+lbl>`.“

**Antwortfragen:**

| id | Art | Label | Optionen | Ziel | Toleranz | Richtig | Falsch / Hinweis | Hilfezeile |
|---|---|---|---|---|---|---|---|---|
| a4_respid | choice | Welchen Typ hat `respid`? | „`<dbl>` Zahl“ / „`<chr>` Text“ / „`<dbl+lbl>` Zahl mit Wertelabel“ | `<dbl>` Zahl | – | Stimmt: `respid` ist die einzige Variable im ALLBUS, die eine Zahl ganz ohne Aufkleber ist. | Schau in der Ausgabe unter den Namen `respid`: Dort steht `<dbl>`, ohne `+lbl`. | Zeile unter den Namen, bei respid. |
| a4_doi | choice | Welchen Typ hat `doi`? | „`<dbl>` Zahl“ / „`<chr>` Text“ / „`<dbl+lbl>` Zahl mit Wertelabel“ | `<chr>` Text | – | Stimmt: Die Internetadresse ist Text. Mit Text kann man nicht rechnen, man kann ihn nur lesen und vergleichen. | Schau unter `doi`: Dort steht `<chr>`, character, Text. | Zeile unter den Namen, bei doi. |
| a4_mode | choice | In der Spalte `mode` steht in jeder Reihe `4 [MAIL]` (gekürzt `4 [MAI…`). Was ist das? | „die Zahl 4 mit dem Wertelabel MAIL“ / „vier Papierbögen“ / „das Wort MAIL in Reihe 4“ | die Zahl 4 mit dem Wertelabel MAIL | – | Genau: der Code 4, und in eckigen Klammern sein Aufkleber MAIL. So zeigt R den Typ `<dbl+lbl>`. | Vor der Klammer steht der Code, in der Klammer das Wertelabel. Den Code 4 kennst du aus Aufgabe 1. | Spalte mode in der Ausgabe. |
| a4_rechnen | choice | Ist ein Mittelwert von `respid` eine sinnvolle Aussage? | „ja, sie ist eine Zahl ohne Aufkleber“ / „nein: respid ist eine Kennnummer, sie benennt Befragte und misst nichts“ | nein: respid ist eine Kennnummer … | – | Genau. Typ und Bedeutung sind zweierlei: `<dbl>` sagt nur, dass Zahlen im Turm liegen. Ob man mit ihnen rechnen darf, hängt davon ab, was sie messen. Dein Tipp vorhin: „{Tipp}“. | Eine Kennnummer ist wie ein Name. Der Mittelwert aller Kennnummern sagt nichts über die Befragten, genauso wenig wie der Mittelwert der Partei-Codes in Grundlage 2c. | Grundlage 4a, Häufige Verwechslung. |
| a4_wort | choice | Würde man bei `mode` den Aufkleber zum Wert machen (Sitzung 4): Was stünde dann in jeder Zelle von `papier`? | „4“ / „MAIL“ / „4 [MAIL]“ | MAIL | – | Genau: das Wort MAIL, Typ `<fct>`. Die 4 wäre weg. | Schau in Grundlage 4b, Zustand „Aufkleber wird zum Wert“: Aus der Zahl mit Aufkleber wird das Wort. | Grundlage 4b. |

**Weiterdenken in der Probier-Werkstatt (für die Aufgabe nicht nötig)**, zugeklappt:
> Eine Idee: Wie viele verschiedene Werte hat die Kennnummer? Die Probier-Werkstatt startet mit einem Vorschlag.
```r
# Eine Idee: Wie viele verschiedene Werte hat die Kennnummer respid?
codebook(allbus, respid)
```
(Ergebnis: `Values: 1 - 5246 (5246 distinct)`: Jede Person hat ihre eigene Nummer.)

**Hilfe, Stufe 1: Denkanstoß:** „Der Typ steht in spitzen Klammern unter dem Namen. `dbl` heißt Zahl, `chr` Text, `+lbl` heißt: mit Wertelabel.“

**Hilfe, Stufe 2: Wo schaue ich?:** „Die Zeile unter den Namen enthält die Typen, in derselben Reihenfolge wie die Namen: doi ist der zweite Turm, respid der vierte, mode der sechste.“

**Hilfe, Stufe 3: Lösung:** „respid ist `<dbl>`, doi `<chr>`, mode `<dbl+lbl>`: In `papier` steht dort überall der Code 4 mit seinem Wertelabel MAIL. Ein Mittelwert von respid sagt nichts, denn die Kennnummer benennt nur. Würde man bei mode den Aufkleber zum Wert machen, stünde überall MAIL.“

**Ohne Grafik lösbar:** ja, alles steht in der Textausgabe.

---

## 7. Überblick „Was steht in einer Zeile?“

Kopf: „✓ Überblick zu allen Aufgaben“, Titel „Vom Kreuz zur Zelle“, Untertitel: „Alle vier Themen zusammen: wie eine Zeile entsteht und was du vor dem Rechnen prüfst.“

### Karte Ü1 „Vom Kreuz zur Zelle“ (Art: Im Bild)

Bild **s2-ablauf** (Typ: Ablauf in vier Stationen, waagerecht; bei 390 px senkrecht):
1. Fragebogen (Kreuz bei „schlecht“) → 2. Codebuch (Eintrag „4 = SCHLECHT“) → 3. Zeile (vier Steine: 19, 7 NOCH SCHUELER, 4 SCHLECHT, 2 ARBEITERSCHICHT) → 4. Bauplatte (5,246 × 579, die neue Zeile orange umrandet).
- Unter Station 2 ein kleines Schild „Regel bei unklaren Kreuzen“ (Konvention), unter Station 3 „fehlt? Grund als Code“.
- **Textfassung:** „Vom Kreuz zur Zelle in vier Schritten: Das Kreuz auf dem Fragebogen wird mit dem Codebuch in einen Code übersetzt; bei unklaren Kreuzen gilt eine aufgeschriebene Regel. Die Codes einer Person bilden eine Zeile, fehlende Antworten bekommen einen Code mit Grund. Alle Zeilen zusammen sind der Datensatz, beim ALLBUS 5.246 Zeilen und 579 Variablen.“

### Karte Ü2 „Was steht in dieser Zelle?“ (Art: Zuordnen)

Text: „Sechs Zellen, zum Beispiel; die Zahlen sind ausgedacht. Ordne jede einer Art zu.“

Interaktion (je Zelle eine Auswahlliste mit den vier Arten, Knopf „Prüfen“, Rückmeldung je Zeile):

| id | Zelle | Ziel | Rückmeldung |
|---|---|---|---|
| u_1 | `ls01` = 0 | Antwort auf einer Skala (Stufe oder Menge) | Die 0 ist eine Antwort, die unterste Stufe von 0 bis 10: ganz unzufrieden. Wie man mit solchen Stufen rechnen darf, klärt Sitzung 3 (Skalenniveau). |
| u_2 | `ls01` = −9 | fehlender Wert mit Grund | −9 heißt KEINE ANGABE; in R ist das NA. |
| u_3 | `pv01` = 42 | Code für eine Kategorie ohne Reihenfolge | 42 ist der Name der AfD, keine Menge und keine Stufe. |
| u_4 | `respid` = 17 | Kennnummer | Die Nummer benennt eine Person. |
| u_5 | `ps03` = −11 | fehlender Wert mit Grund | −11 TNZ: SPLIT: nicht gefragt. |
| u_6 | `age` = 52 | Antwort auf einer Skala (Stufe oder Menge) | Jahre: Die Zahl misst eine Menge, ein Jahr mehr ist überall gleich viel. |

Arten (Optionen): „Antwort auf einer Skala (Stufe oder Menge)“ / „Code für eine Kategorie ohne Reihenfolge“ / „fehlender Wert mit Grund“ / „Kennnummer“.

**Kurz gesagt:** Eine Zeile enthält Antworten als Codes, manchmal Zahlen, die etwas messen, fehlende Werte mit Grund und eine Kennnummer. Welche Art eine Zahl ist, verrät das Codebuch, nicht die Zahl selbst.

### Karte Ü3 „Bevor du rechnest“ (Voraussetzungen, Tabelle)

| Frage | Wo nachsehen | Warum |
|---|---|---|
| Was bedeutet der Code? | Codebuch, Value labels | Höher heißt nicht immer mehr (pa02a, ep03). |
| Misst die Zahl etwas, oder benennt sie nur? | Codebuch, Variablenlabel und Wertelabels | Mit Namen (pv01, respid) rechnet man nicht. |
| Welche Codes sind fehlende Werte, und warum fehlen sie? | Codebuch, Missing values | Nicht gefragt (−10, −11) ist etwas anderes als nicht geantwortet (−9). |
| Wer ist in meiner Auswahl? | erste Zeile der Ausgabe nach `filter()` | Eine Auswahl ändert, über wen du sprichst (nur Papier: 1.656 von 5.246). |

Satz darunter: „Für alle gilt: Erst nachschlagen, dann deuten. Aussagen über ganz Deutschland brauchen außerdem eine Gewichtung (Sitzung 6).“

**Häufige Verwechslung:** „Die Daten sind gegeben.“ Jede Zelle ist eine kleine Entscheidung: vom Fragebogen über das Kreuz bis zur Regel beim Abtippen.

---

## 8. Mitnehmen

### Das Wichtigste aus dieser Sitzung
- Ein Datensatz ist eine Datenmatrix: Zeile = Fall (befragte Person), Spalte = Variable, Zelle = Wert. Der ALLBUS 2023 hat 5.246 Fälle und 579 Variablen.
- Im Datensatz stehen Codes. Was sie bedeuten, sagen die Wertelabels im Codebuch; die Richtung einer Skala legt der Fragebogen fest.
- Codes für Kategorien sind Namen, keine Mengen: Mit ihnen zählt man, rechnet aber nicht.
- Fehlende Werte haben Gründe: nicht geantwortet (−9), nicht gewusst (−8), nicht gefragt (−10, −11), zwei Kreuze (−42). In R werden sie zu NA, der Grund bleibt im Codebuch sichtbar.
- Wo das Codebuch nicht entscheidet, braucht es eine dokumentierte Regel (Konvention).
- Datentypen: Zahl `<dbl>`, Text `<chr>`, Zahl mit Wertelabel `<dbl+lbl>`. Umwandeln ändert die Form und lässt etwas weg.
- In R: `<-` legt ab, `codebook(daten, variable)` schlägt nach, `daten %>% filter(variable == code)` behält nur bestimmte Reihen; alle Variablen bleiben.

### Prüf dich selbst (5 Fragen, je Radiogruppe, Rückmeldung mit Begründung)

| Nr | Frage | Optionen | richtig | Begründung |
|---|---|---|---|---|
| 1 | Was ist in einem Datensatz eine Zeile? | eine Frage / ein Fall, also eine befragte Person / eine Antwortmöglichkeit | ein Fall, also eine befragte Person | Jede Zeile ist ein Fall, jede Spalte eine Variable (Grundlage 1). |
| 2 | Bei `pa02a` steht im Codebuch 1 = SEHR STARK … 5 = UEBERHAUPT NICHT. Jemand hat den Code 4. Wie stark interessiert er sich für Politik? | stark / wenig / sehr stark | wenig | 4 = WENIG. Die Skala läuft von stark zu schwach; höher heißt hier weniger (Grundlage 2a). |
| 3 | Auf einem Bogen ist bei einer Frage kein Kreuz. Was speichert der ALLBUS? | 0 / nichts, die Zelle bleibt leer / −9 KEINE ANGABE | −9 KEINE ANGABE | 0 wäre eine Antwort, eine leere Zelle verliert den Grund. −9 hält fest: gefragt, nicht geantwortet (Grundlage 3a). |
| 4 | Was macht `allbus %>% filter(mode == 3)`? | behält nur die Online-Befragten, alle Variablen bleiben / behält nur die Variable mode / setzt bei allen mode auf 3 | behält nur die Online-Befragten, alle Variablen bleiben | `filter()` wählt Reihen aus. Code 3 ist CAWI, online: 1.587 Reihen, weiterhin 579 Variablen (R lesen, Aufgabe 1). |
| 5 | Warum ist ein „Mittelwert“ der Wahlabsicht `pv01` Unsinn? | weil zu viele Werte fehlen / weil die Codes Namen für Parteien sind, keine Mengen / weil R damit nicht rechnen kann | weil die Codes Namen für Parteien sind, keine Mengen | 42 = AfD ist eine Rückennummer. R würde rechnen (16,1), die Zahl bedeutet aber nichts (Grundlage 2c). |

### Dein Skript zum Mitnehmen
Text: „Alle Vorlagen dieser Sitzung in einer Datei, mit Kommentaren. Öffne sie in RStudio und führe sie Block für Block aus.“ Knopf „Skript herunterladen (sitzung2.R)“, daneben „→ Nachlesen im R-Workshop, Kapitel 4“.

Kopf der Datei:
```r
# Sitzung 2: Vom Fragebogen zum Datensatz
# Statistikatlas, Methoden Ib, ALLBUS 2023 (ZA8831 v1.3.0)
# Markierte Stellen aus dem Atlas stehen hier mit ihrem Beispielwert.
```
Teile in dieser Reihenfolge (je `# ---- Titel ----`): `start` (Startblock), `rlesen` (Vorlage: nachschlagen und auswählen), `a1a`, `a1b`, `a1c` (mit Beispielwert 2 und der Kommentarzeile darüber `# Für die Papierbögen: die 2 gegen den Code für MAIL tauschen`), `a2`, `a3` (mit `papier`), `a4`. Probier-Vorschläge nicht im Skript.

---

## 9. Hilfe bei R-Fehlermeldungen (typisch für diese Sitzung)

| Meldung (RStudio deutsch / Werkstatt englisch) | Ursache | Abhilfe |
|---|---|---|
| `We detected a named input. … Did you mean mode == 4?` | `filter(mode = 4)` mit einem Gleichheitszeichen | In `filter()` vergleichst du mit `==`. |
| `konnte Funktion "%>%" nicht finden` / `could not find function "%>%"` | Startblock nicht ausgeführt (tidyverse fehlt) | Startblock aus R lesen ausführen, dann noch einmal. |
| `Objekt 'papier' nicht gefunden` / `object 'papier' not found` | nur die Zeile `codebook(papier, …)` ausgeführt, die Zeile mit `papier <- …` davor nicht; oder Tippfehler im Namen | Die ganze Vorlage ausführen (in RStudio beide Zeilen markieren). Namen genau so schreiben, wie sie angelegt wurden. |
| `Can't select columns that don't exist. ✖ Column 'Age' doesn't exist.` | Variablenname falsch geschrieben (R unterscheidet Groß- und Kleinschreibung) | Name klein und genau wie im Codebuch: `age`, `pa01`. Im Zweifel mit `find_var()` suchen (Sitzung 1). |
| `Can't combine x <character> and y <double>.` | `filter(mode == "MAIL")`: Wort statt Code | Den Code nehmen: `filter(mode == 4)`. |
| keine Fehlermeldung, aber `# A tibble: 0 × 579` | ein Code, der nicht vorkommt, etwa `filter(mode == 1)` (PAPI gab es 2023 nicht) | Unter `Values:` im Codebuch nachsehen, welche Codes vorkommen. |
| `Datei existiert nicht` / `does not exist` beim Einlesen | Datei liegt nicht im Arbeitsordner | `allbus <- read_spss(file.choose())` und die Datei auswählen (Sitzung 1). |

---

## 10. Hinweise für den Umsetzenden

- **Werkstatt und `codebook()`:** In webR muss `codebook(...)` die Textfassung zeigen, die `summary(codebook(..., view = FALSE))` ausgibt (siehe Entscheidung 3). Vorschlag: nach `library(mariposa)` in der webR-Sitzung eine Hülle setzen, z. B. `codebook <- function(...) { x <- mariposa::codebook(..., view = FALSE); print(summary(x)); invisible(x) }`, oder `forBrowser` entsprechend erweitern. Im kopierten Code für RStudio bleibt `codebook(allbus, x)` unverändert. Vor dem Bau in webR prüfen, ob `interactive()` dort `TRUE` ist und `codebook()` sonst einen Viewer aufzurufen versucht.
- **Werkstatt und Ausdruck einer Bauplatte:** `allbus`, `frauen`, `auswahl`, `papier`, `online` zeigen zehn Reihen aus der eigenen, lizenzierten Datei der Studierenden im Browser; das ist in Ordnung. In Texten, Bildern, Zielwerten und Tests stehen keine Einzelwerte. Ausgabebreite 80 Zeichen (dann sichtbar: bei `allbus` `za_nr` bis `splt23_2`, bei `papier` `za_nr` bis `eastwest`; die Spaltenbreite hängt von den ersten zehn Reihen ab).
- **Objekte zwischen Werkstätten:** Jede Vorlage ist in sich vollständig (legt `papier` bzw. `auswahl` selbst an), weil `allbus` bei jedem Lauf neu gesetzt wird.
- **Antwortprüfung:** Alle Zahl-Ziele sind ganze Zahlen (19, 7, 4, 2, 24, 858, 798, 1656, 5246); keine Toleranz nötig. „5.246“, „5,246“ und „5246“ müssen als 5246 gelten (vorhandene `answerNumbers`). Keine negativen Zahl-Ziele; die negativen Codes in Grundlage 3a sind Auswahlknöpfe.
- **Erst festlegen:** wird bei der genannten Frage als „Dein Tipp vorhin: …“ zitiert (`{Tipp}` in den Tabellen).
- **Echtdaten-Test** (`src/chapter/s02/allbus.local.test.ts`): prüft alle festen Werte aus Abschnitt 12 gegen die Datei.
- **Speicher:** alter Schlüssel der Aufgabe `s02` bleibt unangetastet; Kapitelstatus in `statistikatlas.kapitel.v1`.
- **Folien nicht anfassen** (Teil B); Abweichungen siehe Abschnitt 13.

---

## 11. Entscheidungen (selbst getroffen, mit Begründung)

1. **Vier Themen, drei Pflicht, ein Zusatz.** Datenmatrix, Codes/Labels und fehlende Werte sind der Kern der Folien (Teil 3 bis 5) und tragen die Leitfrage; Datentypen umwandeln wurde im Seminar gestrichen (Folie 15: „Heute ohne Umwandeln“) und ist laut Auftrag nur Vorgriff. Darum A4 als Zusatz. Die drei Pflichtaufgaben sind kurz (etwa 37 Minuten), weil viele die Sitzung nachholen und R noch neu ist.
2. **`codebook(allbus, x)` mit Variablennamen** statt `codebook(allbus)` und Strg+F (Leitfaden). Grund: So stand es auf den Folien der Sitzung (Folie 4, 11, 13), und in der Werkstatt gibt es keinen Viewer mit Suchfunktion. Das ganze Codebuch bleibt in RStudio möglich (Sitzung 1). Bedenken: Das Kapitel Sitzung 1 sollte dieselbe Form zeigen.
3. **Textfassung von `codebook()` in der Werkstatt** = `summary(codebook(…, view = FALSE))`. Grund: Nur sie zeigt Labels, Codes und fehlende Werte mit Anzahl. Weil der RStudio-Viewer zusätzlich Häufigkeiten gültiger Codes zeigt (Freq.), die Werkstatt aber nicht, fragt das Kapitel nur nach Angaben, die in beiden stehen: Codes, Wertelabels, fehlende Werte mit Anzahl, Zahl der Reihen. Nicht gefragt wird z. B. „Wie oft −8 bei st01 auf Papier?“ (Werkstatt: Zeile ohne n, Viewer: keine Zeile).
4. **Pipe mit Zeilenumbruch** (`papier <- allbus %>%` ↵ `  filter(mode == 4)`) statt einer Zeile wie auf der Folie. Grund: gleiche Schreibweise wie in Sitzung 4 und allen späteren Kapiteln (rStyle-Regel 1); in R lesen ausdrücklich erklärt.
5. **A1 mit `auswahl` und Beispielwert ⟦2⟧** statt `papier` mit 4. Grund: Die Vorlage soll ohne Änderung laufen und die Antwort (Code 4, 1.656 Reihen) nicht vorwegnehmen; der Name `papier` wäre bei Code 2 irreführend. A3 und A4 verwenden danach `papier` mit 4 wie auf den Folien.
6. **Keine Rollen, keine Doppelerfassung mit Ben, kein Zeilencode.** Grund: Design-Nichtziel (Rollenszenarien). Der Kern der alten Aufgabe bleibt: Kreuz → Code (A2, G3a), Fehler oder Konvention (G3c, Plenum A3), −42 und −11 auf Papier (A3), Auflösung 638 / 202 / 357 (A3, Stufe 3).
7. **Getrennte Variablen:** Grundlagen nutzen `sex`, `ls01`, `rh08b`, `pa02a`, `pv01`, `ps03`, `dw15` und konstruierte Beispiele; Aufgaben nutzen `mode`, `age`, `educ`, `ep03`, `id02`, `pa01`, `st01`, `pt03`, `respid`, `doi`. Die R-lesen-Karte nutzt `sex` (wie Leitfaden „frauen“), nicht `mode`, damit A1 offen bleibt.
8. **`to_label()` nur im Text** (G4b), keine Vorlage. Grund: Einführung in Sitzung 4; der Auftrag erlaubt nur den Vorgriff. Die alte Zusatzfrage „Code der AfD nach dem Umwandeln“ entfällt.
9. **Wiederholung aus Methoden Ia** (Datenmatrix, Fall, Variable, Wert, Datenreihe) mit grauem Schild „kennst du aus Methoden Ia“, weil `curriculum.ts` sie als Wiederholung führt und es keine frühere Sitzung dafür gibt.
10. **Kein Datensatz selbst eingeben** (`tibble()`, `var_label()`, `val_labels()`, `set_na()` aus `Sitzung2_Live.R`). Grund: Im Seminar entfallen (Folie 2, Notiz), Funktionen stehen in keiner Funktionstabelle; nur ein Verweis auf den R-Workshop in G2b.
11. **Zahlen nur ganzzahlig und eindeutig.** Keine Dezimal-Ziele; die einzige Dezimalzahl im Text (16,1 als „Mittelwert“ der Partei-Codes, 31,6 % und 21,6 %) wird nicht abgefragt.
12. **Begriff „Wert“ und „Code“:** In Grundlage 1 heißt der Stein „Wert“ (Begriff aus Methoden Ia), ab Grundlage 2 heißt die gespeicherte Zahl für eine Antwort „Code“ (Leitfaden). Der Übergang wird in 2a erklärt.
13. **Bogen in A2 ist ausgedacht** (19 Jahre, geht noch zur Schule, wirtschaftliche Lage schlecht, Arbeiterschicht). Die Ziele sind Strukturfakten des Codebuchs (Code zum Wertelabel: 7 NOCH SCHUELER, 4 SCHLECHT, 2 ARBEITERSCHICHT; `age` ohne Wertelabels), keine Werte einer befragten Person. Das Skript prüft, dass keine Person im ALLBUS 2023 diese Kombination hat (0 Fälle). Grund für die Wahl: macht an `educ` = 7 sichtbar, dass Codes Namen sind.
14. **Keine Einzelfälle in Texten, Bildern und Zielwerten:** Die Werkstatt zeigt beim Ausdruck einer Bauplatte Reihen aus der eigenen Datei der Studierenden (Laufzeit, in Ordnung); im Kapitel selbst steht kein Wert einer einzelnen Person. Das Bild s2-ausgabe-lesen ersetzt die Zellen durch Platzhalter. Die Zellen im Überblick (`respid` = 17, `age` = 52 usw.) und alle Steine in Bildern sind konstruierte Beispiele.
15. **Abstimmung mit Sitzung 1** (bei der Prüfung am 23.11.2026 lag `sitzung01.md` vor): Sitzung 1 führt Startblock, Objekt und `<-`, `dim()`, die 3.037.434 Zellen, `find_var()`, `codebook(allbus)` (ganz, in RStudio), `frequency()` als ersten Blick sowie Code, Wertelabel, Variablenlabel und TNZ (SPLIT, FILTER, MODE) ein. Hier sind diese Stellen mit „kennst du aus Sitzung 1“ markiert; neu sind die Pipe mit `filter()`, `codebook(allbus, x)` für einzelne Variablen, die Bildsprache, die Erfassungsperspektive (Bogen → Zeile, −42, Fehler oder Konvention) und die Datentypen.

---

## 12. Feste Werte (für `content.ts` und den Echtdaten-Test)

Alle mit `sitzung02-zahlen.R` geprüft (ZA8831 v1.3.0, mariposa 0.7.4, ungewichtet).

| Wert | Zahl | wo |
|---|---|---|
| Reihen / Variablen `allbus` | 5.246 / 579 | R1, G1b, A1 |
| Steine | 3.037.434 | G1b |
| `filter(sex == 2)` | 2.672 Reihen, 579 Variablen | R2 (Bild) |
| `mode`: 2 CAPI / 3 CAWI / 4 MAIL / 1 PAPI | 2.003 / 1.587 / 1.656 / 0 | A1, Probier A1 |
| Anteil Papier | 31,6 % | A1 |
| `pa02a`: 1 SEHR STARK … 5 UEBERHAUPT NICHT; −42 / −9 | 4 / 17 | G2a |
| `pv01`: 6 DIE LINKE, 42 AFD, kein Code 5; n AfD / Linke | 480 / 260 | G2c |
| „Mittelwert“ der gültigen `pv01`-Codes | 16,1 | G2c, Selbsttest 5 |
| `ls01`: 0 GANZ UNZUFRIEDEN, 10 GANZ ZUFRIEDEN, 1–9 „..“; n Code 0 / −9 / −42 | 26 / 81 / 1 | G2b, G3a, G3b |
| `ps03` −11 | 1.596 | G3a, G3b |
| `dw15` −10 | 2.263 | G3b |
| `rh08b` −6 | 178 | G3b |
| verschiedene Missing-Codes im ALLBUS 2023 | 17 | G3b |
| A2 (ausgedachter Bogen, Strukturfakten): `age` ohne Wertelabels für gültige Werte; Code für NOCH SCHUELER / SCHLECHT / ARBEITERSCHICHT | – / 7 / 4 / 2 | A2 |
| Turm `ls01`: Steine / leere Steine (NA) | 5.246 / 82 | G1b |
| `pv01` −8 WEISS NICHT | 603 | G3b |
| `ps03` −11 nur in Version B (`splt23_1` = 2) | 1.596 | G3a Bogen D |
| mittleres Alter Papier / online (gerundet) | 58 / 47 | A1 `a1_wer` |
| Ausdruck `allbus` bei Breite 80: sichtbare Türme / „more variables“ | 8 / 571 | A1, Bild s2-ausgabe-lesen |
| Ausdruck `papier` bei Breite 80: sichtbare Türme / „more variables“; Zelle `mode` | 9 / 570; `4 [MAI…` | A4 |
| A2: Befragte mit age 19, educ 7, ep03 4, id02 2 zugleich | 0 (Bogen ist nicht real) | A2, Prüfung |
| `educ` 5 HOCHSCHULREIFE; `id02` −50 KEINER DER SCHICHTEN (n) | 5; 15 | A2 |
| `mstat` 5 LEDIG | 5 | Probier A2 |
| Papier: `pa01` −42 / alle: `pa01` −42 / CAPI, CAWI | 24 / 24 / 0, 0 | A3 |
| Papier: `st01` −11 / `pt03` −11 / Summe | 858 / 798 / 1.656 | A3 |
| alle: `st01` −11 / `pt03` −11 / `pa01` −9 | 1.647 / 1.596 / 225 | A3 Schritt 2 |
| Papier Version A / B (`splt23_1`) | 858 / 798 | A3 (Bild, Lösung) |
| −42 im ALLBUS: Zellen / Variablen / Papierbögen mit mind. einer | 638 / 202 / 357 (21,6 %) | A3 Stufe 3 |
| online: `st01` −11 / `pt03` −11 | 789 / 798 | Probier A3 |
| Typen: `dbl+lbl` / `chr` / `dbl` | 576 / 2 / 1 | G4a |
| `respid` `<dbl>`, `doi` `<chr>`, `mode` `<dbl+lbl>`; `respid` verschiedene Werte | 5.246 | A4, Probier A4 |

---

## 13. Abweichungen zu den Folien von Sitzung 2

Folien: `Seminarvorbereitung/Sitzung 2/Sitzung2_Folien.pptx` (18 Folien), Live-Skript `Sitzung2_Live.R`.

1. **Startblock:** Folien `library(mariposa)` und `library(dplyr)`; Kapitel `library(tidyverse)` vor `library(mariposa)` (Design §3).
2. **Pipe-Schreibweise:** Folie 13 `papier <- allbus %>% filter(mode == 4)` in einer Zeile; Kapitel mit Zeilenumbruch nach `%>%` (gleicher Code, in R lesen erklärt).
3. **R-Einstieg und Station 1 „Schon gefragt?“** (Folien 3 bis 7, im Seminar aus Sitzung 1 nachgeholt) gehören ins Kapitel Sitzung 1, nicht hierher.
4. **Arbeitsphase:** Folien 14 und 15 „Erster Tag in der Datenerfassung“ (Rolle Feldinstitut, drei Bögen, 18 Zellen, Doppelerfassung mit Ben oder Partner, Zeilencode, Regel für 1.656 Bögen); Kapitel ohne Rolle mit A1 (Papierbögen auswählen), A2 (ein Bogen, vier Zellen), A3 (fehlende Werte auf Papier in R).
5. **Codebuch-Aufruf:** Folien `codebook(allbus, pa02a, rh08b, ls01)` im Viewer; Notiz zu Folie 13 nennt für den Atlas `papier %>% codebook(pa01, st01, pt03) %>% summary()`. Kapitel: `codebook(papier, pa01, st01, pt03)` ohne Kette; die Werkstatt zeigt die Details von selbst.
6. **Beispielvariablen:** Folie 10/11 `pa02a` („1 oder 5?“), `rh08b`, `ls01` stehen im Kapitel in den Grundlagen; dazu neu `pv01`, `ps03`, `dw15`, `sex`. Die Aufgaben nutzen andere Variablen.
7. **Umwandeln:** alte Atlas-Aufgabe mit `to_label()`/`to_numeric()` und dem AfD-Code 42 (Folie 15: heute ohne Umwandeln); Kapitel nur Grundlage 4b als Vorgriff auf Sitzung 4, ohne Code.
8. **Live-Skript** (`tibble()`, `var_label()`, `val_labels()`, `set_na()`): im Seminar entfallen, im Kapitel nur als Verweis auf den R-Workshop.
9. **Plenum:** Folien 17 und 18 („Eine Person, viele Zeilen“, Fehler oder Konvention, Doppelkreuz 638 / 202 / 357); Kapitel: Grundlage 3c, „Fürs Plenum“ in A3 (Kreuz auf der Linie) und Zahlen in A3 Hilfe Stufe 3. Die Folie nennt 357 Bögen „mit mindestens einem Doppelkreuz“; das Kapitel sagt gleichbedeutend „mindestens eine Mehrfachnennung“ (Code −42).
10. **Begriffe:** Folie 8 „Zeile = Fall, Spalte = Variable, Zelle = Wert“ wie im Kapitel; das Kapitel ergänzt die Bildsprache (Reihe, Turm, Stein, Aufkleber), die auf den Folien von Sitzung 2 noch fehlt.
11. **Zahlen:** Alle Zahlen der Folien (2.003 / 1.587 / 1.656; −11 auf Papier 858 und 798; 638 / 202 / 357) stimmen mit dem Kapitel überein.

---

## Prüfung (Agent, 23.11.2026)

Geprüft nach `teil-b-plan-pruefung.md`, mit den Plänen von Sitzung 1 und 3 als Nachbarn und einem Hinweis des Koordinators (Sitzung 1 führt TNZ und `frequency()` ein; die Werkstatt zeigt `codebook()` über `summary()`). `Rscript sitzung02-zahlen.R`: Exit 0, „Alle Prüfungen bestanden.“ (neuer Abschnitt „Nachträge aus der Prüfung“ mit 20 weiteren Prüfungen und jeder Vorlage einzeln in einer frischen Umgebung, die nur `allbus` kennt).

### 1. Schwache Studentin ohne Vorwissen (durchgespielt, Pflicht etwa 38 Minuten: A1 11, A2 12, A3 15)
Befunde: Jeder Schritt ist mit Grundlage und Vorlage lösbar; die Zahl-Ziele stehen wörtlich in der Ausgabe. Gestockt hätte man (a) in G1b, weil die 3.037.434 Zellen schon in Sitzung 1 ausgerechnet wurden (Rätsel ohne Neuigkeit), (b) in R3, weil Sitzung 1 einzelne Variablen mit `frequency()` liest und `codebook(allbus, x)` dort nicht übt, (c) in A2, weil unklar war, wo man die Codes „einträgt“, und Schritt 3 keine Frage hatte.
Geändert (4):
- G1b: Kurz überlegen jetzt „Wie viele Steine hat ein Turm?“ (5.246, davon 82 leer bei `ls01`); 3.037.434 nur noch als Erinnerung an Sitzung 1.
- R3 knüpft an Sitzung 1 an (ganzes Codebuch, `frequency()`) und sagt, was heute neu ist und was das Codebuch nicht zeigt.
- A2 Schritt 2 und 3: Codes kommen in die Antwortfelder; Schritt 3 zeigt auf `a2_rang`.
- A1 Zeitplan auf 11 Minuten (neue Deuten-Frage), Summe 38 Minuten.

### 2. Didaktik
Befunde: Grundlagen führen in ihre Aufgaben; Variablen sind getrennt. Aber: Das Erst-festlegen in A1 (bleiben die 579 Variablen?) war durch R lesen und das Bild s2-filter-sex schon beantwortet; die Einleitung von A3 verriet die Antwort auf `a3_wo` (nur auf Papier zwei Kreuze möglich); A1 bestand nur aus Ablesen; das Plenum von A3 wiederholte die in G3c aufgelöste Frage; die Probier-Idee in A1 war nur ein weiterer Code; mehrere Grundlagen-Inhalte (Code, Wertelabel, TNZ) waren aus Sitzung 1 bekannt, aber nicht so markiert.
Geändert (7):
- A1 Erst festlegen: Schätzung des Papier-Anteils (zitiert bei `a1_papier`).
- A1 neue Deuten-Frage `a1_wer`: Für wen gilt ein Ergebnis mit `auswahl`? (mit geprüftem Altersunterschied 58 / 47 Jahre); Ziel und Lösung ergänzt.
- A3 Einleitung verrät den Mechanismus nicht mehr; die Begründung kommt erst in der Rückmeldung.
- A3 Fürs Plenum: Folgen der 357 Papierbögen mit Mehrfachnennung (wessen Antworten fallen weg? Kreuz raten oder −42?), passend zu Folie 18.
- Probier A1: Ergeben die drei Erhebungswege zusammen alle 5.246?
- Schilder „kennst du aus Sitzung 1“ an R1, R3, G1b, G2b, G3 (Einleitung, 3b, TNZ-Sätze), „Schon bekannt“ erweitert; Sätze „zählst du in Sitzung 3 mit `frequency()`“ auf „kennst du aus Sitzung 1“ umgestellt; G3 betont die neue Erfassungsperspektive.
- Überblick Ü2: Kategorie „Antwort, mit der man rechnen kann“ ersetzt durch „Antwort auf einer Skala (Stufe oder Menge)“ und „Code für eine Kategorie ohne Reihenfolge“, damit Skalenniveau (Sitzung 3) nicht vorweggenommen und `ls01` nicht als metrisch erklärt wird.

### 3. Fachliches und Barrierefreiheit
Befunde und Änderungen (8):
- G3a Bogen D war falsch: `ps03` fehlt in Version B (`splt23_1` = 2, 1.596), nicht in A. Kopf und Bildhinweis auf „Version B“ korrigiert, Rückmeldung ergänzt.
- G2c: Ablenkoption „zwischen FDP und Linke“ war in sich falsch (16,1 liegt zwischen 6 und 42); jetzt „zwischen der Linken (6) und der AfD (42)“; Frage spricht von „allen gültigen Codes von `pv01`“ (enthält 90 und 91).
- A1 und Bild s2-ausgabe-lesen: Bei Breite 80 zeigt `allbus` acht Türme und „571 more variables: eastwest …“, nicht neun und 570 (das gilt nur für `papier`); Erwartung, Bild und Umsetzungshinweis korrigiert und im Skript geprüft.
- G3b Genauer erklärt: Nicht „alle negativen Codes“ werden NA, sondern die als fehlend markierten; im ALLBUS hat `splt23_2` den gültigen Wert −15. Satz präzisiert, Skript prüft es.
- G3b Tabelle: leeres Beispiel bei −8 gefüllt (`pv01`, 603).
- R2: `=` stellt ein Argument ein, Verweis auf Sitzung 1 (`path = "…"`) statt auf Sitzung 4.
- A3 `a3_split`: Rückmeldung begründet, warum sich die Gruppen nicht überschneiden (jeder Bogen ist A oder B; aus der Summe allein folgt das nicht).
- Neue feste Werte in Abschnitt 12 ergänzt; Entscheidung 15 auf den vorliegenden Plan von Sitzung 1 umgestellt.
Ohne Befund: Zielwerte sind ganze Zahlen ohne Tausenderproblem (5246 als „5.246“/„5,246“ über `answerNumbers`); alle Zahl-Ziele stehen in `summary(codebook())` bzw. im Tibble-Kopf; jede Grafik hat eine Textfassung mit Werten, jede Aufgabe ist ohne Grafik lösbar; Du-Form, kein „(fiktiv)“, kein „·“, keine Rollen; R-Stil (tidyverse vor mariposa, `%>%`, kein `drop_na()`/`to_label()` in Vorlagen, keine `ifelse()`); keine Einzelfallwerte (Bauplatten im Bild konstruiert, Ausdrucke im Skript nur als Kopf/Fuß). `to_label()`/`to_numeric()` lassen den Grund tatsächlich fallen (geprüft, G4b stimmt). Fehlermeldungen der Hilfe-Tabelle geprüft.

### Offen (bewusst nicht geändert)
- „Methoden Ia“ (hier und in Sitzung 3) gegenüber „Methoden I“ (Sitzung 1): Schildtext sollte einheitlich sein; der Dozent entscheidet die Bezeichnung.
- Breite der Werkstatt-Ausgabe: Die erwarteten Kopfzeilen gelten für 80 Zeichen; ist die Werkstatt breiter, sieht man mehr Türme. Die Fragen hängen davon nicht ab (A4 nennt nur die ersten sechs Türme), der Umsetzende sollte die Breite auf 80 setzen oder die Texte anpassen.
- Im Werkstatt-Codebuch verschwindet bei `ls01` das Wertelabel 10 GANZ ZUFRIEDEN hinter „... (1 more)“. G2b nennt es nur im Grundlagentext, keine Aufgabe liest es aus der Ausgabe; daher keine Änderung.
- A3 Hilfe Stufe 3 enthält zusätzlich 638 / 202 / 357 (Folienbezug); etwas lang, aber nützlich fürs Plenum.

## Nacharbeit nach Kapitelprüfung (23.11.2026)

Abweichungen vom Plan beziehungsweise Klarstellungen bei der Umsetzung:
- G3a: Die Legende jeder Bogenfrage enthält jetzt den Bildtext: „Bogen A, Lebenszufriedenheit 0 bis 10, Kreuz bei 0: Was steht im Datensatz?“ (statt nur „Bogen A, Lebenszufriedenheit 0 bis 10: …“). Der Bildtext von Bogen D ist dafür ohne Doppelpunkt und Klammer umformuliert (Inhalt gleich: Version B, Frage 12 und 14, Hinweis „Frage 13 fehlt in Version B“).
- G3a: Der Satz „Alle vier Bögen aufgelöst: Darunter steht jetzt das Bild der Türme.“ steht in der Live-Region; das Bild der Türme steht außerhalb davon.
- A2 „Fürs Plenum“ beginnt mit „Optional:“ (wie im Plan).
- Die Rückmeldungen für 579, 2.003 (auch 2,003), 5.246 (auch 5,246), ep03 = 2 und educ = 5 stehen wieder in `specialInput` der jeweiligen Frage; die allgemeinen Hinweise (`hint`) enthalten sie nicht mehr. Wortlaut: `a1_reihen` 579 „579 sind die Türme. Gefragt sind die Reihen, die erste Zahl.“; `a1_papier` 2003 „… 2.003 sind die Interviews.“, 5246 „Das ist noch der ganze ALLBUS. Hast du Vorlage 3 ausgeführt?“.
- „So arbeitest du“: Die Zeile „Code-Werkstatt (kennst du aus Sitzung 1)“ kommt über `howToExtra`; der Satz nach „Schon bekannt“ (graue Schilder, „Neu ist heute …“) über `knownNote`.
- Freie-Karte-Hinweise der Grundlagen sind `MapLink` mit den Konzepten `series`, `labels`, `codebook`, `missing`, `conversion`; Beschriftung nach den Titeln der Karte („Variablen- & Wertelabels“, „Codebuch & Variablensuche“).
- Auflösungsregel (keine Auflösung, solange eine Frage der Aufgabe offen ist): Kapitel 2 hat keinen eigenen Auflösungstext. Die Zeile „Deine Festlegung vorher war: …“ setzt der gemeinsame Baustein `Questions` schon nach dem ersten Prüfen, auch bei offenen Fragen; das lässt sich nur im Baustein ändern (hier nicht geändert).
