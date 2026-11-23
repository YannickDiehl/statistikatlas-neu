# Sitzung 9 „Lineare Regression“: Inhaltsplan für das Kapitel

Stand: 23.11.2026. Teil B des Rollouts (`docs/entwicklung/plaene/2026-11-23-lernpfad-kapitel-rollout.md`, Task 8), nach dem Muster von Sitzung 4 (`prototyp/sitzung4.html`, umgesetzt in `src/chapter/s04/`). Bisherige Aufgabe: `src/tasks/s08-automat/` („Der Automat im Foyer“), Konzept `2026-09-29-lernpfad-aufgaben/sitzung-08.md` (alte Nummerierung). Sitzungsplan 10: „Was ist ein Regressionsmodell? Ziel? Voraussetzung und Test der Voraussetzungen. Konstante, Regressionskoeffizient, Residuen. R²“.

- **Daten:** ALLBUS 2023, ZA8831 v1.3.0, **gewichtet mit `wghtpew`** wie die alte Aufgabe und alle Kapitel ab Sitzung 6. Nur Aggregate. Bilder mit einzelnen Punkten (acht Befragte, neun Befragte, zehn Räume) sind konstruierte Beispiele und tragen die Notiz „zum Beispiel …“.
- **Zahlen:** Jede Zahl dieses Plans steht in `sitzung09-zahlen.R` (gleicher Ordner) und wird dort gegen die gedruckte Ausgabe von mariposa 0.7.4 geprüft. Das Skript führt jede Vorlage in einer frischen Umgebung aus, in der nur `allbus` existiert (wie die Code-Werkstatt), einmal so, wie sie dasteht, und einmal gelöst; am Ende prüft es, dass jede Vorlage wörtlich in diesem Plan steht. `Rscript sitzung09-zahlen.R` läuft ohne Fehler (etwa 15 Sekunden).
- **Jede Vorlage läuft für sich:** Die Code-Werkstatt setzt `allbus` vor jedem Ausführen zurück. Darum polt jede Vorlage, die die Demokratiezufriedenheit braucht, `ps03` in ihrer eigenen Kette um („umpolen wie in Aufgabe 1“). Zwischenobjekte gibt es nicht; `allbus <- allbus %>% mutate(…)` steht nur dort, wo dieselbe Vorlage die neuen Spalten danach mehrmals nutzt (A3, A4).
- **Bausteine:** wie Sitzung 4 (`src/chapter/blocks/`, `src/chapter/workshop/`). Texte und Daten in `src/chapter/s09/content.ts`, feste Zielwerte in `allbus.local.test.ts`.
- **Schreibweise in diesem Plan:** Texte in „…“ oder als Absatz sind Volltext fürs Kapitel. `code` bleibt im Kapitel Code. ⟦…⟧ markiert anzupassende Stellen in Vorlagen. Im Kapitel steht für die Multiplikation „mal“ oder „×“, nie „·“.

---

## 1 Kopf

**Stein:** 9. **Titel:** Lineare Regression.

**Leitfrage (Begleitfigur):** „Wie gut sagt eine Gerade etwas vorher – und für wen liegt sie daneben?“ (Abweichung von `curriculum.ts`, siehe Entscheidung 1.)

**Wegweiser (drei Kacheln):**
- „Vorweg: R lesen“ – „die Formel mit ~, die Ausgabe von summary()“
- „Vier Themen“ – „je erst die Grundlage, dann die Aufgabe; im Seminar direkt zur Aufgabe springen“
- „Zum Schluss“ – „Überblick, Wichtigstes, Selbsttest, Skript“

**Was du nach dieser Sitzung kannst** (Lernziele, als Liste):
1. erklären, was eine lineare Regression tut: Sie legt die Gerade durch eine Punktwolke, die im Mittel am nächsten an den Punkten liegt (kleinste Quadrate) *(Verfahren)*
2. Konstante und Steigung (Regressionskoeffizient B) in einfachen Worten deuten und damit eine Vorhersage von Hand ausrechnen *(Interpretation)*
3. Residuen als „wie weit daneben“ lesen und R² als „um wie viel besser als der Mittelwert“ deuten; sagen, warum eine steile Gerade nicht dasselbe ist wie eine gute Vorhersage *(Interpretation)*
4. drei Voraussetzungen prüfen und in Worten erklären: ein gerader Zusammenhang (Linearität), keine einzelnen Punkte, die die Gerade wegziehen (Ausreißer), gleich große Fehler für alle (gleiche Fehlervarianz) *(Voraussetzungen)*
5. wissen, dass eine Regression einen Zusammenhang beschreibt und keine Ursache belegt *(Interpretation)*
6. `linear_regression(y ~ x, weights = wghtpew)` lesen und anpassen, in der Ausgabe von `summary()` B, Beta, R² und N finden, mit `group_by()` getrennt nach Gruppen rechnen und `levene_test()` lesen *(Code lesen)*

**Hinweis „schon bekannt“ (grau):** „Schon bekannt und hier nur kurz erinnert: R als Taschenrechner und TNZ: SPLIT (Sitzung 1); `describe()` (Sitzung 3); Ketten mit `%>%`, `drop_na()`, `show = …` und Ausreißer im Boxplot (Sitzung 4); abhängige und unabhängige Variable (AV und UV), das Umpolen mit `rec(…, rules = "rev")` in `mutate()` und „ein Zusammenhang ist keine Ursache“ (Sitzung 5); das Gewicht `weights = wghtpew`, die Punktwolke, die Pearson-Korrelation r und dass r nur gerade Zusammenhänge sieht (Sitzung 6); `summary()` für die ausführliche Ausgabe, der p-Wert und die Faustregel, ob Gruppen ähnlich stark streuen (Sitzung 7). Solche Stellen tragen ein graues Schild „kennst du aus Sitzung …“.“

**So arbeitest du mit dieser Seite:** die vier Zeilen wie in Sitzung 4 (Genauer erklärt, Kurz überlegen, Code-Werkstatt, markierte Stellen), unverändert.

**Sprungknöpfe fürs Seminar:** „Im Seminar? Jedes Thema beginnt mit seiner Grundlage zum Vertiefen der Folien. Wer sie schon kann, springt direkt zur Aufgabe:“ Aufgabe 1, Aufgabe 2, Aufgabe 3, Aufgabe 4.

**Hinweis Gewichtung (einmal unter den Sprungknöpfen, klein):** „Alle Zahlen aus dem ALLBUS sind in diesem Kapitel gewichtet (`weights = wghtpew`, kennst du aus Sitzung 6), genau wie die Ausgabe deiner Vorlagen.“

---

## 2 Themen, Grundlagen, Aufgaben

| Thema | Grundlage (Variablen) | Aufgabe (Variablen) | Art | Zeit |
|---|---|---|---|---|
| 1 Die Gerade: Konstante und Steigung | 1a Gerade schätzen (ls01 × ep03 umgepolt = `lage`, Blasen aus `crosstab()`), 1b Formel als Bausteine (lage), 1c Vorhersage ist ein Durchschnitt (lage, Konstante bei 0) | A1 „Vertrauen in den Bundestag und Zufriedenheit mit der Demokratie“ (ps03 umgepolt = `demo`, pt03; Taschenrechner) | **Pflicht** | G 15, A 13 Min. |
| 2 Wie gut passt die Gerade? Residuen und R² | 2a Residuen (acht Befragte, konstruiert), 2b kleinste Quadrate zum Drehen (acht Befragte), 2c R² und typischer Fehler (acht Befragte; lage → ls01) | A2 „Vertrauen oder Schicht: Was sagt mehr?“ (demo, pt03, id02) | **Pflicht** | G 12, A 12 Min. |
| 3 Gleich gut für alle? Fehlervarianz und Ausreißer | 3a Streuung je Stufe (lage → ls01, Levene), 3b ein Ausreißer zieht die Gerade (neun Befragte, konstruiert) | A3 „Für wen liegt die Gerade daneben?“ (demo, pt03; `group_by()`, `levene_test()`) | **Pflicht** | G 12, A 16 Min. |
| 4 Gerade oder Kurve? Linearität | 4 Gerade oder Kurve (zehn Räume, konstruiert; lage → ls01 als Gegenbeispiel) | A4 „Links, Mitte, rechts“ (demo, pa01; Taschenrechner) | Zusatz | G 5, A 10 Min. |
| Überblick | Eine Regression berichten (fünf Zahlen), Voraussetzungen (vier kleine Bilder), Zusammenhang und Ursache | – | – | 5 Min. |

Pflichtaufgaben zusammen etwa 41 Minuten (A1 13, A2 12, A3 16; gemessen an langsamer Bearbeitung: Vorlage ausführen und Ausgabe suchen etwa 3 Minuten je Werkstatt, je Frage etwa eine Minute). Lernpfad-Grundlagen nutzen ls01 und ep03 sowie konstruierte Beispiele; die Aufgaben nutzen ps03, pt03, id02 und pa01. Keine Aufgabenvariable kommt in einer Grundlage vor.

**Wiederkehrende Kurzbegriffe:** `demo` = Zufriedenheit mit der Demokratie, umgepolt (1 = sehr unzufrieden … 6 = sehr zufrieden). `lage` = eigene wirtschaftliche Lage, umgepolt (1 = sehr schlecht … 5 = sehr gut). ls01 = Lebenszufriedenheit (0 = ganz unzufrieden … 10 = ganz zufrieden).

---

## 3 Vorweg: R lesen

### Karte R1 „Startblock und was du schon kennst“ (Schilder: „Startblock: kennst du aus Sitzung 1“, „mutate() und rec(): kennst du aus Sitzung 5“, „weights: kennst du aus Sitzung 6“, „Code lesen“)

Text: „Den Startblock kennst du aus Sitzung 1. In RStudio führst du ihn zu Beginn aus. In der Code-Werkstatt hier auf der Seite ist das schon erledigt.“

Vorlage `start` (Kopieren, ohne Ausführen-Knopf wie in Sitzung 4):

```r
# Pakete laden und Daten einlesen
library(tidyverse)
library(mariposa)

allbus <- read_spss("ZA8831_v1-3-0.sav")
```

Hilfezeile: „Rote Zeilen beim Laden, etwa „Attaching core tidyverse packages“, sind normal und kein Fehler. Findet R die Datei nicht, nimm wie in Sitzung 1 `allbus <- read_spss(file.choose())`.“

Text: „Heute kommen drei Dinge aus früheren Sitzungen in fast jeder Vorlage vor:“
- „`mutate(lage = rec(ep03, rules = "rev"))` polt eine Variable um (Sitzung 5). Danach heißt eine hohe Zahl „gut“. Das brauchst du, damit „mehr“ auf beiden Achsen in dieselbe Richtung zeigt.“
- „`weights = wghtpew` gewichtet die Befragten so, dass die Zahlen für ganz Deutschland gelten (Sitzung 6). Der Osten ist im ALLBUS absichtlich stärker vertreten.“
- „`%>% summary()` zeigt die ausführliche Ausgabe (Sitzung 7).“

Hinweis (Kasten „Wichtig in der Code-Werkstatt“): „Jede Werkstatt startet mit dem frisch geladenen ALLBUS. Was eine andere Werkstatt umgepolt oder neu gebildet hat, kennt sie nicht. Darum steht das Umpolen in jeder Vorlage, die es braucht, noch einmal.“

### Karte R2 „Eine Formel mit Tilde: y ~ x“ (Schilder: „neu heute“, „AV und UV: kennst du aus Sitzung 5“, „Code lesen“)

Text: „Neu heute ist die Funktion `linear_regression()`. In ihre Klammer schreibst du eine Formel mit der Tilde `~`. Links steht, was vorhergesagt wird, rechts, woraus. So liest du die Zeile:“

Zeilenbild (Bausteine wie in Sitzung 4, R1; Bild `s9-zeile-tilde`): `allbus` (Objekt) | `%>%` (und dann) | `linear_regression(` (Funktion: was passiert) | `ls01` (links von ~: was vorhergesagt wird, AV) | `~` („aus“) | `lage` (rechts von ~: woraus, UV) | `, weights = wghtpew` (Argument: gewichtet) | `)`. Darunter: „Nimm allbus, und dann sag die Lebenszufriedenheit aus der wirtschaftlichen Lage vorher, gewichtet.“ Textfassung: genau dieser Satz plus die Rollen der Bausteine in Reihenfolge.

Vorlage `r_kurz` (Code-Werkstatt, ausführbar):

```r
# Lineare Regression: Lebenszufriedenheit aus der wirtschaftlichen Lage vorhersagen
# (ep03 umpolen wie in Sitzung 5: hohe Zahl = gute Lage)
allbus %>%
  mutate(
    lage = rec(ep03, rules = "rev")
  ) %>%
  linear_regression(ls01 ~ lage, weights = wghtpew)
```

Ausgabe zur Kontrolle im Text:
```
Linear Regression: ls01 ~ lage [Weighted]
  R2 = 0.203, adj.R2 = 0.203, F(1, 5131) = 1304.29, p < 0.001 ***, N = 5133
Use summary() for detailed output.
```

Kurz gesagt: „`linear_regression(y ~ x)` sagt y aus x vorher. Die **abhängige Variable** (AV, das y) steht links von der Tilde, die **unabhängige Variable** (UV, das x) rechts. In der Regression heißt die UV auch **Prädiktor**, kurz gesagt: das, woraus vorhergesagt wird. Ohne `summary()` zeigt R eine Zeile mit R², Test und N.“

Häufige Verwechslung: „Ein Komma statt der Tilde: `linear_regression(ls01, lage)`. R meldet dann „`formula` must be a formula object“. Zwischen AV und UV steht immer `~`.“

### Karte R3 „Die Ausgabe von summary() lesen“ (Schilder: „summary(): kennst du aus Sitzung 7“, „Im Bild“)

Text: „Mit `summary()` zeigt R alles, was du heute brauchst. Führe die Vorlage aus und wähl dann eine Zahl. Was sie bedeutet, lernst du in den Grundlagen; hier geht es darum, wo sie steht.“

Vorlage `r_summary`:

```r
# Dieselbe Regression ausführlich: mit summary() wie in Sitzung 7
allbus %>%
  mutate(
    lage = rec(ep03, rules = "rev")
  ) %>%
  linear_regression(ls01 ~ lage, weights = wghtpew) %>%
  summary()
```

**Bild B0 `s9-ausgabe` (interaktive Ausgabe, echte HTML-Tabelle bzw. `<pre>` mit markierbaren Zellen, kein SVG):** Die Ausgabe, wie R sie druckt (ohne die Trennstriche aus `-`; gekürzt um die Abschnitte ANOVA und Collinearity Statistics und die Zeile Signif. codes, die als zugeklappte Zeile „… weitere Abschnitte“ erscheinen):

```
Weighted Linear Regression Results
- Formula: ls01 ~ lage
- Method: ENTER (all predictors)
- N: 5133
- Weights: wghtpew
- Note: labelled predictor lage entered with its numeric codes, as SPSS REGRESSION does.
  Use to_label() first to enter it as dummy-coded categories.

  Descriptive Statistics
  Variable   Mean  Std. Deviation     N
  ls01      7.398           1.926  5133
  lage      3.568           0.808  5133

  Model Summary
  R                            0.450
  R Square                     0.203
  Adjusted R Square            0.203
  Std. Error of the Estimate   1.720

  Coefficients
  Term             B  Std. Error   Beta       t   Sig.  95% CI Lower  95% CI Upper
  (Intercept)  3.570       0.109         32.839  <.001         3.357         3.783  ***
  lage         1.073       0.030  0.450  36.115  <.001         1.015         1.131  ***
```

Sechs Umschalter (`aria-pressed`) über der Ausgabe; ohne Auswahl Text „Wähl eine Zahl.“. Bei Auswahl orange Umrandung der Zelle(n), darunter Erklärung (`aria-live`):
- **„Konstante“** (Zelle `3.570` in Zeile `(Intercept)`, Spalte B): „Die **Konstante** steht in der Zeile `(Intercept)`, Spalte B: 3,570. Das ist die Höhe der Geraden bei lage = 0. Mehr in Grundlage 1.“
- **„Steigung“** (Zelle `1.073`, Zeile `lage`, Spalte B): „Die **Steigung** (Regressionskoeffizient B) steht in der Zeile der UV, Spalte B: 1,073. So viel steigt die Vorhersage pro Stufe. Mehr in Grundlage 1.“
- **„Beta“** (Zelle `0.450`, Spalte Beta): „**Beta** ist die Steigung in Standardabweichungen gemessen (standardisierter Koeffizient). Mit nur einer UV ist Beta gleich der Pearson-Korrelation r aus Sitzung 6; R oben in Model Summary ist dieselbe Zahl ohne Vorzeichen. Für Vorhersagen brauchst du B, nicht Beta.“
- **„R²“** (Zelle `0.203` bei R Square): „**R Square** ist R²: 0,203. Die Gerade erklärt gut 20 % der Streuung der Lebenszufriedenheit. Mehr in Grundlage 2.“
- **„Typischer Fehler“** (Zelle `1.720` bei Std. Error of the Estimate): „**Std. Error of the Estimate** sagt, wie weit die Vorhersage typischerweise danebenliegt: 1,72 Punkte. Mehr in Grundlage 2.“
- **„N“** (`- N: 5133` und die Spalte N): „**N** sind alle, die bei beiden Variablen eine gültige Antwort haben: 5.133. Wer bei einer fehlt, fällt weg.“

Textfassung B0: Die Ausgabe selbst ist die Textfassung (`<pre>` mit Beschriftung „Ausgabe von summary() für ls01 ~ lage“); alle sechs Erklärungen zusätzlich in einem zugeklappten `details` „Alle Zahlen erklärt“.

Genauer erklärt „Was der Rest der Ausgabe bedeutet“:
- „**Method: ENTER** heißt: Alle UV kommen auf einmal ins Modell. Heute ist es nur eine.“
- „Die **Note** sagt nur: R rechnet mit den Codes 1 bis 5 von lage, wie SPSS. Das ist hier gewollt. Die zweite Zeile nennt einen anderen Weg (jede Stufe als eigene Gruppe); den lernst du in Sitzung 10 kennen.“
- „**Std. Error** und **95% CI** zeigen, wie genau B geschätzt ist; **t** und **Sig.** testen, ob B von 0 verschieden ist (p-Wert, kennst du aus Sitzung 7). Bei Tausenden Befragten ist fast jede Steigung signifikant. Ob sie groß genug ist, um wichtig zu sein, sagen B und R².“
- „**Adjusted R Square** ist R² mit einem kleinen Abzug für jede UV. Mit einer UV und Tausenden Befragten ist er gleich. Er wird in Sitzung 10 wichtig.“
- „Die Abschnitte **ANOVA** und **Collinearity Statistics** brauchst du heute nicht; ANOVA zeigt die Quadratsummen aus Grundlage 2c, Collinearity wird in Sitzung 10 wichtig.“
- „R schreibt Kommazahlen mit Punkt: 3.570 heißt 3,570.“

Häufige Verwechslung: „B und Beta. Für die Gerade und jede Vorhersage brauchst du **B**. Beta ist dieselbe Steigung, umgerechnet in Standardabweichungen; mit einer UV ist sie gleich r.“

---

## 4 Thema 1: Die Gerade: Konstante und Steigung

### Grundlage 1 „Die Gerade: Konstante und Steigung“ (Kopf: „Grundlage zu Aufgabe 1“, Link „Schon klar? Direkt zu Aufgabe 1 ↓“)

Unterzeile: „Was beschreibt eine Gerade durch eine Punktwolke, und wie liest man sie? Drei kurze Schritte, etwa 15 Minuten.“

#### Karte 1a „Erst schätzen: Wo verläuft die Gerade?“ (Schilder: „Punktwolke: kennst du aus Sitzung 6“, „Schätzen“)

Beispiel zuerst: „Hängt die Lebenszufriedenheit mit der eigenen wirtschaftlichen Lage zusammen? Im Bild steht jede Kombination aus Lage (von 1 sehr schlecht bis 5 sehr gut) und Lebenszufriedenheit (0 bis 10) als Kreis. Je größer der Kreis, desto mehr Befragte haben genau diese Kombination angegeben. Leg eine Gerade durch die Wolke, die die Punkte so gut wie möglich trifft.“

**Bild B1 `s9-schaetzen` (interaktiv):**
- Streudiagramm, x-Achse „Eigene wirtschaftliche Lage“ mit Strichen 1 bis 5 und Beschriftung unten (1 sehr schlecht, 2 schlecht, 3 teils/teils, 4 gut, 5 sehr gut), y-Achse „Lebenszufriedenheit“ 0 bis 10 (Striche bei jeder ganzen Zahl, Beschriftung 0, 2, 4, 6, 8, 10). Leinwand etwa 7,6 × 5,0.
- Kreise in Baukasten-Blau (halbtransparent, dünner Rand), Fläche proportional zur gewichteten Zahl der Befragten, Radius = √N × Faktor (größter Kreis 908 etwa 14 px Radius); Zellen mit 0 werden nicht gezeichnet. Gewichtete Zellenzahlen aus `crosstab(ls01, lage, weights = wghtpew)` (Zeilen ls01 0 bis 10, Spalten lage 1 bis 5):

| ls01 | lage 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| 0 | 9 | 6 | 5 | 8 | 0 |
| 1 | 2 | 14 | 5 | 7 | 1 |
| 2 | 8 | 22 | 21 | 24 | 2 |
| 3 | 11 | 39 | 49 | 16 | 1 |
| 4 | 11 | 36 | 78 | 48 | 1 |
| 5 | 11 | 88 | 187 | 95 | 2 |
| 6 | 6 | 59 | 183 | 140 | 3 |
| 7 | 10 | 73 | 372 | 518 | 26 |
| 8 | 4 | 70 | 382 | 908 | 117 |
| 9 | 1 | 14 | 135 | 620 | 119 |
| 10 | 4 | 15 | 74 | 367 | 105 |

- Eigene Gerade: dunkelgrau gestrichelt, zwei runde Griffe bei x = 1 und x = 5, Start bei Höhe 5,0 und 5,0. Griffe senkrecht ziehbar (0 bis 10, rasten auf 0,1 ein), mit Tastatur: Griff mit Tab anwählen, Pfeil hoch/runter (0,1), Bild auf/ab (1,0). `aria-valuetext` „Deine Gerade bei sehr schlechter Lage: 5,0“.
- Knöpfe „Gerade festlegen und vergleichen“ (sperrt die Griffe) und „Neu schätzen“ (nur vor dem Vergleich).
- Nach dem Vergleich: Gerade aus R in Baukasten-Grün, durchgezogen, von (1 | 4,643) bis (5 | 8,935), beschriftet „Gerade aus R: 3,570 + 1,073 × Lage“; dazu orange Rauten für die Mittelwerte je Stufe (4,377; 5,641; 6,809; 7,905; 8,680), Legende „Mittelwert der Stufe“.
- Rückmeldung (`aria-live`), berechnet aus eigenem Anstieg A = Höhe rechts − Höhe links und echtem Anstieg 4,29:
  - A ≤ 0: „Deine Gerade fällt oder bleibt flach, die echte steigt um 4,3 Punkte von „sehr schlecht“ bis „sehr gut“. Wer seine Lage besser einschätzt, ist im Mittel zufriedener.“
  - 0 < A < 3,79: „Deine Gerade steigt um {A} Punkte, die echte um 4,3. Du hast den Zusammenhang unterschätzt.“
  - 3,79 ≤ A ≤ 4,79: „Deine Gerade steigt um {A} Punkte, die echte um 4,3. Gut geschätzt.“
  - A > 4,79: „Deine Gerade steigt um {A} Punkte, die echte nur um 4,3. Du hast den Zusammenhang überschätzt. Das passiert oft: Das Auge folgt den großen Kreisen oben rechts.“
  - Zusatzsatz, wenn die eigene Höhe bei x = 3 mehr als 0,5 von 6,789 abweicht: „Insgesamt liegt deine Gerade zu {hoch/tief}: Bei „teils/teils“ zeigt sie {eigener Wert}, die echte 6,79.“
  - ({A} mit einer Nachkommastelle, deutsches Komma.)

**Textfassung B1:** „Streudiagramm der Lebenszufriedenheit (0 bis 10) nach der eigenen wirtschaftlichen Lage (1 sehr schlecht bis 5 sehr gut), 5.133 Befragte, gewichtet. Die meisten liegen bei Lage „gut“ und Zufriedenheit 7 bis 9. Mittelwert der Lebenszufriedenheit je Stufe: sehr schlecht 4,38 (77 Befragte), schlecht 5,64 (435), teils/teils 6,81 (1.491), gut 7,91 (2.751), sehr gut 8,68 (378).“ Der Satz „Die Gerade aus R steigt von 4,64 bei sehr schlechter Lage auf 8,94 bei sehr guter Lage.“ wird erst nach „Gerade festlegen und vergleichen“ angehängt, weil die Gerade auch im Bild erst dann erscheint (gleiche Lage für alle Nutzenden). Für die Tastaturbedienung zusätzlich zwei Zahlenfelder „Höhe deiner Geraden bei sehr schlechter Lage“ und „… bei sehr guter Lage“ (0 bis 10), die die Griffe setzen.

Kurz gesagt: „Eine **lineare Regression** legt eine Gerade durch die Punktwolke. Die Gerade sagt für jeden Wert der UV vorher, welchen Wert der AV man im Mittel erwartet. Sie folgt den Mittelwerten der Stufen, nicht den einzelnen Punkten.“

Genauer erklärt „Wozu eine Regression?“:
- „**Beschreiben:** Um wie viel unterscheidet sich die AV, wenn die UV um eine Stufe steigt? Anders als r aus Sitzung 6 antwortet die Regression in der Einheit der AV, hier in Punkten Lebenszufriedenheit.“
- „**Vorhersagen:** Welchen Wert erwarten wir für eine Gruppe, etwa für alle mit guter Lage?“
- „**Erklären** will man oft, aber dafür reicht eine Gerade mit einer UV nicht. Andere Ursachen (Gesundheit, Einkommen, Alter) können hinter beidem stecken, wie die Drittvariable aus Sitzung 6. Wie man sie in einer Regression berücksichtigt, ist Thema in Sitzung 10.“
- „Die Kreise sind Häufigkeiten aus einer Kreuztabelle (kennst du aus Sitzung 5), gewichtet. Bei nur elf und fünf Stufen lägen einzelne Punkte genau übereinander; darum zeigt das Bild, wie viele an jeder Stelle liegen.“

Häufige Verwechslung: „Die Gerade geht nicht durch die meisten Punkte. Sie liegt so, dass alle Punkte zusammen ihr möglichst nahe sind. Kaum eine Person liegt genau auf ihr.“

#### Karte 1b „Konstante und Steigung: die Formel als Bausteine“ (Schilder: „Formel lesen“, „Im Bild“)

Beispiel zuerst: „Jede Gerade ist durch zwei Zahlen festgelegt. R hat für dieses Beispiel ausgerechnet: Konstante 3,570, Steigung 1,073. Wo sie in der Ausgabe stehen, zeigt „R lesen“. Was sagt das über eine Person mit guter Lage (Stufe 4)?“

**Bild B2 `s9-formel` (Formel als Bausteine, mit Schrittleiste „Schritt 1: Formel“, „Schritt 2: einsetzen“, „Schritt 3: ausrechnen“):**
- Schritt 1: vier Steine nebeneinander: grüner Stein „Vorhersage“ | „=“ | blauer Stein „Konstante“ | „+“ | blauer Stein „Steigung“ | „×“ | gelber Stein „Wert der UV“. Unter den Steinen klein die Fachbegriffe: „vorhergesagter Wert (linearer Prädiktor)“, „Achsenabschnitt, B von (Intercept)“, „Regressionskoeffizient, B der UV“, „x“.
- Schritt 2: in die Steine wandern die Zahlen: „?“ = „3,570“ + „1,073“ × „4“.
- Schritt 3: „7,862“ im grünen Stein; daneben eine Mini-Treppe: von Stufe 3 (6,789) zu Stufe 4 (7,862) ein Schritt nach rechts und 1,073 nach oben, beschriftet „eine Stufe mehr: + 1,073“.
- Farben: Baukasten-Blau für die beiden Zahlen aus R, Gelb für den eingesetzten Wert, Grün für die Vorhersage.

**Textfassung B2:** „Vorhersage gleich Konstante plus Steigung mal Wert der UV. Für gute Lage, Stufe 4: 3,570 plus 1,073 mal 4 gleich 7,862. Eine Stufe mehr Lage bringt eine um 1,073 höhere Vorhersage; von teils/teils (6,789) zu gut (7,862) sind es genau 1,073.“

**Kurz überlegen** (Zahlenfeld, Prüfen): „Welche Lebenszufriedenheit sagt die Gerade für Befragte mit schlechter Lage (Stufe 2) vorher?“ Hilfezeile: „Rechne 3,570 plus 1,073 mal 2. Zwei Nachkommastellen reichen.“
- Ziel 5,716, Toleranz 0,01.
- richtig: „5,716: 3,570 + 1,073 × 2. Im Bild ist das die Höhe der grünen Geraden über „schlecht“.“
- Sonderfall 5,641 (± 0,01): „Das ist der Mittelwert der Befragten mit schlechter Lage (die Raute). Gefragt ist der Wert auf der Geraden: Konstante plus Steigung mal 2.“
- Sonderfall 9,286 (± 0,01, (3,570 + 1,073) × 2): „Erst mal, dann plus: Die Steigung wird mit 2 malgenommen, die Konstante nicht.“
- sonst: „Setz 2 in die Formel ein: 3,570 plus 1,073 mal 2.“

Kurz gesagt: „Die **Konstante** ist die Höhe der Geraden, wenn die UV 0 ist. Die **Steigung** (Regressionskoeffizient B) sagt, um wie viel die Vorhersage steigt, wenn die UV um eine Einheit steigt. Konstante plus Steigung mal Wert ergibt die **Vorhersage**, den linearen Prädiktor.“

Genauer erklärt „Steigung in Worten, auch wenn sie negativ ist“:
- „Satzmuster: „Mit jeder Stufe mehr {UV} liegt die vorhergesagte {AV} um {B} Punkte höher.“ Hier: Mit jeder Stufe besserer Lage liegt die vorhergesagte Lebenszufriedenheit um 1,07 Punkte höher.“
- „Ist B negativ, sinkt die Vorhersage: „um … Punkte niedriger“. Ob B positiv oder negativ ist, hängt auch davon ab, wie die Codes laufen. Darum wurde ep03 umgepolt: Im Original heißt 1 „sehr gut“, und B wäre −1,073.“
- „Von der schlechtesten zur besten Stufe sind es vier Schritte: 4 mal 1,073 = 4,29 Punkte.“

Häufige Verwechslung: „Die Steigung ist kein Prozentwert und keine Korrelation. 1,073 heißt „gut einen Punkt Lebenszufriedenheit mehr pro Stufe Lage“, in der Einheit der AV.“

#### Karte 1c „Die Vorhersage ist ein Durchschnitt“ (Schilder: „Im Bild“)

Beispiel zuerst: „Die Gerade sagt für Menschen mit sehr guter Lage 8,94 vorher. Heißt das, alle mit sehr guter Lage sind so zufrieden? Schau ins Bild B1: Bei „sehr gut“ reichen die Kreise von 0 bis 10.“

Text (ohne eigenes Bild, Verweis auf B1): „Die Vorhersage ist der Wert, den man für eine Gruppe **im Mittel** erwartet. Einzelne Menschen liegen darüber oder darunter, oft weit. Wie weit, ist Thema in Grundlage 2.“

Text „Und die Konstante?“: „Die Konstante 3,570 ist die Höhe der Geraden bei Lage 0. Eine Lage 0 gibt es auf der Skala von 1 bis 5 aber nicht. Die Konstante ist dann nur der Punkt, an dem die Gerade die y-Achse schneiden würde: ein Rechenanker, den man nicht deutet.“

**Kurz überlegen** (Auswahl, Auflösen): „Was bedeutet hier die Konstante 3,570?“ Optionen: „die vorhergesagte Lebenszufriedenheit bei Lage 0, einer Stufe, die es nicht gibt“; „die Lebenszufriedenheit der Befragten mit sehr schlechter Lage“; „die durchschnittliche Lebenszufriedenheit aller Befragten“.
- Ziel: Option 1.
- richtig: „Genau. Die Gerade schneidet bei Lage 0 die y-Achse. Weil es Lage 0 nicht gibt, deutet man die Konstante hier nicht, man braucht sie nur zum Rechnen.“
- Option 2: „Für sehr schlechte Lage (Stufe 1) sagt die Gerade 3,570 + 1,073 = 4,643 vorher. Die Konstante gilt für den Wert 0.“
- Option 3: „Der Durchschnitt aller ist 7,398 (Descriptive Statistics). Die Konstante ist die Höhe bei UV = 0.“

Kurz gesagt: „Die Vorhersage einer Regression gilt für eine Gruppe im Mittel, nicht für einzelne Personen. Die Konstante deutet man nur, wenn der Wert 0 bei der UV vorkommt.“

Genauer erklärt „Vorhersagen außerhalb der Daten“: „Die Gerade beschreibt den Bereich, in dem es Daten gibt, hier Lage 1 bis 5. Was außerhalb passiert, weiß sie nicht. Eine „Lage 6“ würde nach der Formel 10,008 ergeben, mehr als die Skala erlaubt.“

Häufige Verwechslung: „„Die Gerade sagt 7,9 vorher“ heißt nicht „wer gut lebt, ist 7,9 zufrieden“. Es heißt: Im Mittel sind Menschen mit guter Lage etwa so zufrieden; einzelne liegen weit daneben.“

Link: „→ In der freien Karte: Lineare Regression“ (Begriff `linear_regression`), „→ Linearer Prädiktor“ (Begriff `prediction`).

### Aufgabe 1 „Vertrauen in den Bundestag und Zufriedenheit mit der Demokratie“ (Pflicht)

Link „↑ Grundlage 1 nachlesen“.

Leitfrage: „Wie viel zufriedener mit der Demokratie sind Menschen, die dem Bundestag mehr vertrauen?“

Ziel: „Am Ende hast du die Gerade aus R abgelesen, kannst Konstante und Steigung in einem Satz deuten und hast eine Vorhersage von Hand ausgerechnet.“

Grundlage: „Grundlage 1, Die Gerade: Konstante und Steigung“.

Einleitung: „Der ALLBUS fragt, wie zufrieden man mit der Demokratie in Deutschland ist (ps03, 1 = sehr zufrieden … 6 = sehr unzufrieden), und wie viel Vertrauen man in den Bundestag hat (pt03, 1 = gar kein Vertrauen … 7 = großes Vertrauen). Bei ps03 heißt eine kleine Zahl „zufrieden“. Die Vorlage polt darum um: In `demo` heißt 6 „sehr zufrieden“.“

**Erst festlegen** (Auswahl, „Tipp abgeben“; wird beim Prüfen zitiert): „Eine Person mit großem Vertrauen (7) und eine ganz ohne Vertrauen (1): Um wie viele Punkte auf der Zufriedenheitsskala von 1 bis 6 unterscheidet sich die Vorhersage wohl?“ Optionen: „kaum, weniger als einen halben Punkt“, „etwa 1 Punkt“, „etwa 3 Punkte“, „mehr als 4 Punkte“. Rückmeldung beim Festlegen: „Festgelegt: … Die Auflösung bekommst du, wenn du am Ende der Aufgabe deine Antworten prüfst.“ Auflösung beim Prüfen: „Von 1 bis 7 sind es sechs Stufen: 6 mal 0,465 = 2,79, also etwa 3 Punkte auf einer Skala von 1 bis 6.“

Text: „Arbeite in der Code-Werkstatt direkt hier oder in RStudio. In RStudio führst du vorher den Startblock aus „R lesen“ aus.“

**Schritte:**

1. „Führe die Vorlage aus. Sie polt ps03 um und rechnet die Regression von `demo` auf pt03, gewichtet.“ Schilder „rec(…, rules = "rev"): kennst du aus Sitzung 5“, „summary(): kennst du aus Sitzung 7“.

```r
# Zufriedenheit mit der Demokratie umpolen (hohe Zahl = zufrieden),
# dann aus dem Vertrauen in den Bundestag vorhersagen
allbus %>%
  mutate(
    demo = rec(ps03, rules = "rev")
  ) %>%
  linear_regression(demo ~ pt03, weights = wghtpew) %>%
  summary()
```

2. „Such in der Tabelle Coefficients die Spalte B: die Konstante in der Zeile `(Intercept)`, die Steigung in der Zeile `pt03`. Oben unter `- N:` steht, wie viele Befragte mitrechnen.“ Hinweis darunter: „ps03 und pt03 standen nur in einem Teil der Fragebögen; 1.596 Befragten wurden sie nicht gestellt (TNZ: SPLIT, kennst du aus Sitzung 1). Es rechnen nur die mit, die beide Fragen gültig beantwortet haben, gut 3.500.“

3. „Rechne die Vorhersage für Menschen mit großem Vertrauen (pt03 = 7) aus. Die Vorlage rechnet noch das Beispiel aus Grundlage 1 (Lage 4). Tausch die drei markierten Zahlen: Konstante, Steigung und den Wert 7.“ Schild „R als Taschenrechner: kennst du aus Sitzung 1“. Hilfezeile: „Kommazahlen schreibst du in R mit Punkt, etwa 2.288.“

```r
# Vorhersage von Hand: Konstante + Steigung * Wert
# (hier noch das Beispiel aus Grundlage 1: lage = 4)
⟦3.570⟧ + ⟦1.073⟧ * ⟦4⟧
```

4. „Deuten: Was bedeuten Steigung und Konstante? (Fragen a1d und a1e unten)“

**Weiterdenken in der Probier-Werkstatt (für die Aufgabe nicht nötig),** zugeklappt: „Für die Aufgabe reichen die Vorlagen oben. Hier ist Platz für eigene Fragen. Eine Idee: Was passiert, wenn du die Seiten tauschst und das Vertrauen aus der Zufriedenheit vorhersagst? Ist es dieselbe Gerade, nur rückwärts gelesen? Die Probier-Werkstatt startet mit einem Vorschlag.“

```r
# Eine Idee: die Seiten tauschen und das Vertrauen aus der Zufriedenheit vorhersagen
allbus %>%
  mutate(
    demo = rec(ps03, rules = "rev")
  ) %>%
  linear_regression(pt03 ~ demo, weights = wghtpew) %>%
  summary()
```

(Zur Information für den Plan, nicht im Kapitel: B = 0,743, Konstante 0,929, R² wieder 0,346; 0,465 mal 0,743 = 0,345 ≈ R². Zwei verschiedene Geraden, beide stimmen; keine belegt eine Richtung. Aufgegriffen im Überblick, Karte Ü3.)

**Antwortfragen** („Antworten prüfen“, Rückmeldung je Frage mit ✓/✗ und Text, am Ende „Deine Festlegung vorher war: …“ mit Auflösung):

| id | Art | Label | Optionen | Ziel | Toleranz | Text richtig | Text falsch / Hinweis | Hilfezeile |
|---|---|---|---|---|---|---|---|---|
| a1a | number | Wie groß ist die Konstante? | – | 2.288 | 0.001 | Konstante 2,288 (Zeile `(Intercept)`, Spalte B). | Lies in Coefficients die Zeile `(Intercept)`, Spalte B. Sonderfälle: 0,046 → „Das ist der Standardfehler (Std. Error). Gesucht ist B.“ 4,157 → „Das ist der Mittelwert von demo (Descriptive Statistics). Gesucht ist B in der Zeile (Intercept).“ 2,168 → „Das stimmt ohne Gewicht. Steht `weights = wghtpew` noch in deiner Vorlage?“ 4,712 → „Diese Zahl kommt heraus, wenn ps03 nicht umgepolt ist. Rechne mit `demo`.“ | Zahl aus Spalte B, so wie R sie zeigt. |
| a1b | number | Wie groß ist die Steigung? | – | 0.465 | 0.001 | Steigung 0,465: Mit jeder Stufe mehr Vertrauen liegt die vorhergesagte Zufriedenheit um 0,465 Punkte höher. | Lies die Zeile `pt03`, Spalte B. Sonderfälle: 0,588 → „Das ist Beta, der standardisierte Koeffizient. Für die Gerade brauchst du B.“ 0,011 → „Das ist der Standardfehler.“ 0,479 → „Das stimmt ohne Gewicht. Steht `weights = wghtpew` noch in deiner Vorlage?“ −0,465 → „Das Vorzeichen ist gedreht: ps03 ist nicht umgepolt. Rechne mit `demo`.“ 0,743 → „Das ist die Gerade mit getauschten Seiten (pt03 ~ demo). Gesucht ist demo ~ pt03.“ | – |
| a1c | number | Welche Zufriedenheit sagt die Gerade für Menschen mit großem Vertrauen (pt03 = 7) vorher? | – | 5.543 | 0.005 | 5,543: 2,288 + 0,465 × 7. Auf der Skala bis 6 ist das „ziemlich“ bis „sehr zufrieden“. | Setz in Schritt 3 Konstante, Steigung und 7 ein. Sonderfälle: 7,862 → „Das ist noch das Beispiel aus Grundlage 1. Tausch alle drei markierten Zahlen.“ 2,753 → „Das ist die Vorhersage für pt03 = 1. Gefragt ist großes Vertrauen, 7.“ 2,79 → „Das ist der Unterschied zwischen 1 und 7. Gefragt ist die Vorhersage selbst.“ 19,271 → „Erst mal, dann plus: (2,288 + 0,465) × 7 ist zu viel. In R rechnet `2.288 + 0.465 * 7` richtig.“ | Ergebnis aus Schritt 3. |
| a1d | choice | Was bedeutet die Steigung 0,465? | a: „Mit jeder Stufe mehr Vertrauen in den Bundestag liegt die vorhergesagte Zufriedenheit mit der Demokratie um knapp einen halben Punkt höher.“; b: „46,5 % der Befragten sind mit der Demokratie zufrieden.“; c: „Wer dem Bundestag eine Stufe mehr vertraut, wird dadurch um 0,465 Punkte zufriedener.“ | a | – | Genau: B ist die Änderung der Vorhersage pro Stufe der UV, in Punkten der AV. | b: „B ist kein Prozentwert. Es ist die Änderung in Punkten der Zufriedenheit pro Stufe Vertrauen.“ c: „„Wird dadurch zufriedener“ behauptet eine Ursache. Die Regression zeigt nur: Wer mehr vertraut, ist im Mittel zufriedener. Es kann auch umgekehrt sein, oder beides hat eine gemeinsame Ursache (Zusammenhang ist keine Ursache, kennst du aus Sitzung 5).“ | – |
| a1e | choice | Was bedeutet hier die Konstante? | a: „die vorhergesagte Zufriedenheit bei Vertrauen 0, einer Stufe, die es nicht gibt“; b: „die Zufriedenheit der Menschen ganz ohne Vertrauen (Stufe 1)“; c: „die durchschnittliche Zufriedenheit aller Befragten“ | a | – | Genau. pt03 läuft von 1 bis 7; bei 0 gibt es niemanden. Die Konstante ist nur der Rechenanker der Geraden. | b: „Für Stufe 1 sagt die Gerade 2,288 + 0,465 = 2,753 vorher. Die Konstante gilt für den Wert 0.“ c: „Der Durchschnitt aller ist 4,157 (Descriptive Statistics).“ | – |
| a1f | number | Wie viele Befragte rechnen mit (N)? | – | 3575 | 0 | 3.575: alle, die beide Fragen gültig beantwortet haben. | Lies oben die Zeile `- N:`. Sonderfall 5246 → „Das sind alle Befragten. ps03 und pt03 standen nur in einem Teil der Fragebögen (TNZ: SPLIT); es rechnen nur die mit, die beide gültig beantwortet haben.“ | Aus `summary()`, Zeile `- N:`. |

**Hilfe, Stufe 1: Denkanstoß:** „Die Gerade braucht zwei Zahlen: ihre Höhe bei 0 (Konstante) und wie stark sie pro Stufe steigt (Steigung). Beide stehen in derselben Spalte der Ausgabe. Die Vorhersage ist Konstante plus Steigung mal Wert.“

**Hilfe, Stufe 2: Wo schaue ich?:** „In der Ausgabe von Schritt 1, Abschnitt Coefficients, Spalte B: Zeile `(Intercept)` ist die Konstante, Zeile `pt03` die Steigung. Nicht Beta, nicht Std. Error. N steht oben unter `- N:`. In Schritt 3 tauschst du alle drei markierten Zahlen.“

**Hilfe, Stufe 3: Lösung:** „Konstante 2,288, Steigung 0,465, N = 3.575. In Schritt 3: `2.288 + 0.465 * 7` ergibt 5.543. Die Steigung heißt: Mit jeder Stufe mehr Vertrauen liegt die vorhergesagte Zufriedenheit um knapp einen halben Punkt höher. Die Konstante ist die Höhe bei Vertrauen 0, das es nicht gibt; man deutet sie hier nicht. Von 1 bis 7 unterscheidet sich die Vorhersage um 6 × 0,465 = 2,79 Punkte.“

**Ohne Grafik lösbar:** „Diese Aufgabe hat keine Grafik. Alle Zahlen stehen in der Ausgabe von Schritt 1 und im Ergebnis von Schritt 3.“

---

## 5 Thema 2: Wie gut passt die Gerade? Residuen und R²

### Grundlage 2 „Wie gut passt die Gerade? Residuen und R²“ (Kopf: „Grundlage zu Aufgabe 2“, „Schon klar? Direkt zu Aufgabe 2 ↓“)

Unterzeile: „Wie misst man, wie weit eine Gerade danebenliegt, und warum heißt das Verfahren „kleinste Quadrate“? Etwa 12 Minuten.“

#### Karte 2a „Residuen: wie weit daneben?“ (Schilder: „Im Bild“)

Beispiel zuerst: „Bei Tausenden Befragten sieht man einzelne Abstände nicht. Darum hier acht Befragte, zum Beispiel. Jede Person hat eine Lage (1 bis 5) und eine Lebenszufriedenheit. Die grüne Gerade ist die beste Gerade für diese acht: 4 + 1 × Lage. Tipp eine Person an.“

**Bild B3 `s9-residuen` (interaktiv):**
- Streudiagramm wie B1 (x 1 bis 5, y 0 bis 10), Notiz oben links grau kursiv „zum Beispiel acht Befragte“. Acht blaue Punkte (Baukasten-Steinoptik, rund): (1 | 4), (2 | 6), (2 | 7), (3 | 6), (3 | 8), (4 | 8), (4 | 9), (5 | 8). Zwei Punkte mit gleichem x leicht nebeneinander versetzt (± 0,06), damit sie nicht überlappen.
- Gerade 4 + 1 × Lage in Baukasten-Grün von (1 | 5) bis (5 | 9). Schwerpunkt (3 | 7) als kleines graues Kreuz mit Beschriftung „Schwerpunkt: Mittelwerte 3 und 7“.
- Von jedem Punkt eine senkrechte orange Linie zur Geraden (Residuum). Sechs Residuen sind 1 lang, zwei 0 (Punkte (2 | 6) und (4 | 8) liegen auf der Geraden).
- Jeder Punkt ist ein Knopf (Tab-Reihenfolge von links nach rechts). Antippen zeigt unter dem Bild (`aria-live`): „Person mit Lage {x} und Zufriedenheit {y}: Die Gerade sagt {4 + x} vorher. Residuum: {y} minus {4 + x} = {r}. {Satz}“ mit Satz: r > 0 „Sie liegt über der Geraden, zufriedener als vorhergesagt.“; r < 0 „Sie liegt unter der Geraden, weniger zufrieden als vorhergesagt.“; r = 0 „Sie liegt genau auf der Geraden.“

**Textfassung B3:** „Acht Befragte, zum Beispiel. Lage und Lebenszufriedenheit: 1 und 4; 2 und 6; 2 und 7; 3 und 6; 3 und 8; 4 und 8; 4 und 9; 5 und 8. Die Gerade 4 plus 1 mal Lage sagt für Lage 1 bis 5 die Werte 5, 6, 7, 8 und 9 vorher. Residuen, also beobachtet minus vorhergesagt: minus 1, 0, plus 1, minus 1, plus 1, 0, plus 1, minus 1. Die Mittelwerte beider Variablen (3 und 7) liegen genau auf der Geraden.“

Kurz gesagt: „Das **Residuum** ist der Abstand eines Punktes von der Geraden, senkrecht gemessen: beobachteter Wert minus vorhergesagter Wert. Positiv heißt „über der Geraden“, negativ „darunter“.“

Häufige Verwechslung: „Ein Residuum ist kein Fehler der Person und kein Messfehler. Es ist das, was die Gerade an dieser Person nicht erklärt.“

#### Karte 2b „Kleinste Quadrate: Dreh die Gerade selbst“ (Schilder: „Im Bild“, „Ausprobieren“)

Beispiel zuerst: „Warum ist gerade 4 + 1 × Lage die beste Gerade? Dreh sie und schau, wie die Fehlerquadrate wachsen oder schrumpfen. Die Gerade dreht sich um den Schwerpunkt (3 | 7).“

**Bild B4 `s9-regler` (interaktiv, Herzstück der Sitzung):**
- Dieselben acht Punkte wie B3. Eine Gerade (dunkelgrau, wird grün, sobald sie die beste ist) durch (3 | 7) mit Steigung b; Konstante 7 − 3b.
- Regler „Steigung“ von −1 bis 3 in Schritten von 0,25 (`input type=range`, `aria-valuetext` „Steigung 0,50, Fehlerquadrate 9“), Start bei 0.
- An jedem Punkt die orange Residuenlinie und ein oranges, halbtransparentes Quadrat mit der Seitenlänge des Residuums (rechts neben der Linie, in Bildpunkten der y-Achse gezeichnet, damit es ein echtes Quadrat ist).
- Rechts daneben eine waagerechte Leiste „Summe der Fehlerquadrate“ von 0 bis 54 mit dem aktuellen Wert als oranger Balken und zwei Marken: grau „Mittelwert-Gerade: 18“, grün „beste Gerade: 6“ (die grüne Marke erst sichtbar, wenn einmal b = 1 eingestellt war).
- Zwei Knöpfe: „Mittelwert-Gerade (Steigung 0)“ setzt b = 0; „Gerade aus R“ setzt b = 1.
- Werte (b → Summe der Fehlerquadrate): −1 → 54; −0,75 → 42,75; −0,5 → 33; −0,25 → 24,75; 0 → 18; 0,25 → 12,75; 0,5 → 9; 0,75 → 6,75; 1 → 6; 1,25 → 6,75; 1,5 → 9; 1,75 → 12,75; 2 → 18; 2,25 → 24,75; 2,5 → 33; 2,75 → 42,75; 3 → 54. (Formel: 18 − 24 b + 12 b².)
- Rückmeldung (`aria-live`, nach jeder Änderung mit 400 ms Verzögerung):
  - b = 0: „Steigung 0: Die Gerade zeigt allen den Mittelwert 7. Fehlerquadrate: 18. So gut kommt man ohne die Lage aus.“
  - b = 1: „Steigung 1: Die Gerade aus R. Fehlerquadrate: 6. Keine andere Steigung kommt mit weniger aus. Genau das heißt kleinste Quadrate.“
  - 0 < b < 1 oder 1 < b < 2: „Steigung {b}: Fehlerquadrate {s}. Weniger als mit dem Mittelwert, aber mehr als 6. {„Steiler“, wenn b < 1 / „Flacher“, wenn b > 1} wird es besser.“
  - b = 2: „Steigung 2: Fehlerquadrate 18, genauso viel wie mit dem Mittelwert. Zu steil ist ebenso schlecht wie flach.“
  - b < 0 oder b > 2: „Steigung {b}: Fehlerquadrate {s}, mehr als mit dem Mittelwert. Diese Gerade ist schlechter als gar keine.“

**Textfassung B4:** „Regler für die Steigung einer Geraden durch den Schwerpunkt 3 und 7. Zu jeder Steigung die Summe der Fehlerquadrate: Steigung 0 ergibt 18, Steigung 0,5 ergibt 9, Steigung 1 ergibt 6, Steigung 1,5 ergibt 9, Steigung 2 ergibt 18. Die kleinste Summe, 6, gibt es bei Steigung 1, der Geraden aus R.“ Die Tabelle aller 17 Werte steht zusätzlich in einem zugeklappten `details` „Alle Stellungen als Tabelle“.

Kurz gesagt: „Die Regression wählt die Gerade, bei der die Summe der quadrierten Residuen am kleinsten ist. Darum heißt das Verfahren **Methode der kleinsten Quadrate** (OLS, ordinary least squares).“

Genauer erklärt „Warum quadrieren?“:
- „Residuen über und unter der Geraden heben sich auf: Bei der besten Geraden ergeben sie zusammen immer 0. Quadriert zählen alle als positiv.“
- „Quadrate bestrafen große Abstände stark: Ein Residuum von 2 zählt 4, eines von 3 zählt 9. Darum zieht ein einzelner Punkt weit draußen die Gerade zu sich (Grundlage 3b).“
- „Die beste Gerade geht immer durch den Schwerpunkt, den Punkt aus den beiden Mittelwerten. Im Bild ist das (3 | 7), darum dreht sich der Regler um diesen Punkt.“

Häufige Verwechslung: „Kleinste Quadrate heißt nicht „trifft am meisten Punkte genau“. Eine Gerade, die drei Punkte genau trifft, kann trotzdem mehr Fehlerquadrate haben als die Gerade aus R.“

Link: „→ In der freien Karte: Residuen und kleinste Quadrate“ (Begriff `residuals`).

#### Karte 2c „R²: um wie viel besser als der Mittelwert?“ (Schilder: „Pearson-Korrelation: kennst du aus Sitzung 6“, „Im Bild“)

Beispiel zuerst: „Ohne die Lage könntest du für alle acht nur den Mittelwert 7 vorhersagen. Das kostet 18 Fehlerquadrate. Mit der Lage sind es 6. Um wie viel besser ist die Gerade?“

**Bild B5 `s9-r2` (Formel als Bausteine, statisch):**
- Zwei waagerechte Balken aus orangen Quadraten: oben „mit dem Mittelwert (ohne UV)“ 18 Quadrate von 1 × 1 in einer Reihe, unten „mit der Geraden“ 6 Quadrate. Rechts neben dem oberen Balken eine Klammer über 12 Quadrate (die, die oben mehr sind), beschriftet „erklärt: 12“.
- Darunter Formel als Bausteine: Stein „R²“ = Bruch aus Stein „erklärte Quadrate 12“ über Stein „alle Quadrate 18“ = „0,67“. Zweite Zeile klein: „= 1 − 6 / 18“.
- Dritte Zeile, abgesetzt, „im echten ALLBUS“: „1 − 15.182 / 19.041 = 0,203“ (Steine „Residual“ und „Total“ aus der ANOVA-Tabelle).

**Textfassung B5:** „Mit dem Mittelwert allein ergeben die acht Befragten 18 Fehlerquadrate, mit der Geraden 6. Die Gerade spart 12 von 18, das sind zwei Drittel: R² gleich 12 durch 18 gleich 0,67. Im echten ALLBUS: Die Gerade aus der Lage spart von 19.041 Fehlerquadraten 3.859; übrig bleiben 15.182. R² gleich 1 minus 15.182 durch 19.041 gleich 0,203.“

**Kurz überlegen** (Zahlenfeld, Prüfen): „Wie viel Prozent der Streuung der Lebenszufriedenheit erklärt die wirtschaftliche Lage im ALLBUS?“ Hilfezeile: „R² steht in „R lesen“ bei R Square. In Prozent: mal 100.“
- Ziel 20,3, Toleranz 0,1.
- richtig: „20,3 %: R² = 0,203. Gut ein Fünftel der Unterschiede in der Lebenszufriedenheit hängt (linear) mit der Lage zusammen; knapp vier Fünftel nicht.“
- Sonderfall 0,203 (± 0,001): „Richtig gelesen, das ist R² als Anteil. In Prozent: mal 100.“
- Sonderfall 45 (± 0,1) oder 0,45: „Das ist R, die Korrelation. R² ist R mal R: 0,45 mal 0,45 ≈ 0,20.“
- sonst: „Lies R Square in der Ausgabe aus „R lesen“ und nimm sie mal 100.“

Kurz gesagt: „**R²** (erklärter Varianzanteil) vergleicht die Gerade mit dem Mittelwert: Um welchen Anteil sind die Fehlerquadrate kleiner als ohne UV? 0 heißt „nicht besser als der Mittelwert“, 1 heißt „alle Punkte liegen auf der Geraden“. Mit einer UV ist R² das Quadrat der Pearson-Korrelation r. Der **typische Fehler** (Std. Error of the Estimate) sagt dasselbe in Punkten der AV: So weit liegt die Vorhersage typischerweise daneben, hier 1,72 Punkte.“

Genauer erklärt „Der typische Fehler und die Verbindung zu r“:
- „Der typische Fehler mit der Lage ist 1,720 Punkte. Ohne Lage, nur mit dem Mittelwert, wären es 1,926 (Standardabweichung der Lebenszufriedenheit). Daraus kommt wieder R²: 1 − (1,720 / 1,926)² ≈ 0,20.“
- „In Sitzung 6 hast du r kennengelernt. Zwischen Lage und Lebenszufriedenheit ist r = 0,450 (gewichtet). 0,450 × 0,450 = 0,2025, also etwa 0,20; mit dem ungerundeten r kommt genau R² = 0,203 heraus. Mit einer UV zeigt die Ausgabe r auch als Beta und, ohne Vorzeichen, als R.“
- „„Erklärt“ ist hier ein statistisches Wort: Mit der Geraden werden die Fehlerquadrate kleiner. Dass die UV die AV verursacht, ist damit nicht gezeigt (Überblick, Karte Ü3).“
- „Was „gut“ ist, hängt vom Thema ab. Bei Einstellungen und Zufriedenheit sind R² von 0,1 bis 0,3 mit einer UV häufig, weil viele Dinge zusammenspielen.“
- „Die Quadratsummen stehen im Abschnitt ANOVA der Ausgabe: Regression 3.858,902 (erklärt), Residual 15.182,029 (übrig), Total 19.040,931 (alle).“

Häufige Verwechslung: „Eine steile Gerade ist nicht automatisch eine gute Vorhersage. Die Steigung sagt, wie viel sich die Vorhersage ändert; R² sagt, wie nah die Punkte an der Geraden liegen. Beides musst du getrennt lesen.“

Link: „→ In der freien Karte: Erklärter Varianzanteil R²“ (Begriff `explained_variance`).

### Aufgabe 2 „Vertrauen oder Schicht: Was sagt mehr?“ (Pflicht)

Link „↑ Grundlage 2 nachlesen“.

Leitfrage: „Sagt das Vertrauen in den Bundestag die Zufriedenheit mit der Demokratie besser vorher als die eigene Schicht?“

Ziel: „Am Ende kannst du R² und den typischen Fehler einer Regression lesen und begründen, warum eine pro Stufe fast gleich steile Gerade viel schlechter vorhersagen kann.“

Grundlage: „Grundlage 2, Wie gut passt die Gerade?“.

Einleitung: „In Aufgabe 1 hast du die Gerade für das Vertrauen in den Bundestag gerechnet. Jetzt vergleichst du sie mit einer zweiten Frage: Welcher Schicht rechnen sich die Befragten zu? (id02, 1 = Unterschicht, 2 = Arbeiterschicht, 3 = Mittelschicht, 4 = obere Mittelschicht, 5 = Oberschicht). Eine hohe Zahl heißt hier schon „höher“; umpolen musst du id02 nicht.“

**Erst festlegen** (Auswahl, „Tipp abgeben“): „Welche Frage sagt die Zufriedenheit mit der Demokratie besser vorher?“ Optionen: „das Vertrauen in den Bundestag“, „die Schicht“, „beide etwa gleich gut“. Auflösung beim Prüfen: „R² für das Vertrauen 0,346, für die Schicht 0,060: Das Vertrauen sagt fast sechsmal so viel vorher.“

**Schritte:**

1. „Führe die Vorlage aus, wie sie ist. Sie rechnet noch einmal die Regression aus Aufgabe 1 (das Umpolen steht wieder drin, weil jede Werkstatt frisch startet). Lies im Abschnitt Model Summary R Square und Std. Error of the Estimate, in Descriptive Statistics die Standardabweichung von demo.“

```r
# Wie gut sagt eine Frage die Zufriedenheit mit der Demokratie vorher?
# (umpolen wie in Aufgabe 1)
allbus %>%
  mutate(
    demo = rec(ps03, rules = "rev")
  ) %>%
  linear_regression(demo ~ ⟦pt03⟧, weights = wghtpew) %>%
  summary()
```

2. „Tausch die markierte Stelle gegen id02 und führe die Vorlage erneut aus. Lies wieder R Square und dazu die Steigung B in der Zeile id02.“

3. „Vergleiche die beiden Ausgaben: erst die Steigungen B, dann R² und den typischen Fehler. Was passt nicht zusammen? (Frage a2f)“

**Weiterdenken in der Probier-Werkstatt (für die Aufgabe nicht nötig):** „Eine Idee: Sagt die Wirtschaftslage in Deutschland (ep01, 1 = sehr gut … 5 = sehr schlecht) die Zufriedenheit besser vorher als die Schicht? Und warum ist ihre Steigung negativ? Die Probier-Werkstatt startet mit einem Vorschlag.“

```r
# Eine Idee: die Wirtschaftslage in Deutschland (ep01, 1 = sehr gut) als Vorhersage
allbus %>%
  mutate(
    demo = rec(ps03, rules = "rev")
  ) %>%
  linear_regression(demo ~ ep01, weights = wghtpew) %>%
  summary()
```

(Zur Information: R² = 0,215, N = 3.593, B = −0,746, negativ, weil bei ep01 eine hohe Zahl „schlecht“ heißt.)

**Antwortfragen:**

| id | Art | Label | Optionen | Ziel | Toleranz | Text richtig | Text falsch / Hinweis | Hilfezeile |
|---|---|---|---|---|---|---|---|---|
| a2a | number | Wie groß ist R² mit dem Vertrauen in den Bundestag (pt03)? | – | 0.346 | 0.001 | R² = 0,346. | Lies R Square im Abschnitt Model Summary. Sonderfälle: 34,6 → „In Prozent richtig gedacht. Trag die Zahl so ein, wie R sie zeigt: 0.346.“ 0,588 → „Das ist R, die Korrelation. R² ist R mal R.“ | Aus Schritt 1, Model Summary. |
| a2b | choice | Was heißt R² = 0,346? | a: „Mit dem Vertrauen sind die Fehlerquadrate um gut ein Drittel kleiner als mit dem Mittelwert allein.“; b: „34,6 % der Befragten sind mit der Demokratie zufrieden.“; c: „Die Vorhersage stimmt bei 34,6 % der Befragten genau.“ | a | – | Genau: R² vergleicht die Gerade mit dem Mittelwert. Gut ein Drittel der Streuung der Zufriedenheit hängt mit dem Vertrauen zusammen. | b: „R² sagt nichts darüber, wie viele zufrieden sind. Es vergleicht Fehlerquadrate mit und ohne UV.“ c: „Genau treffen muss die Gerade niemanden. R² sagt, um wie viel die Fehlerquadrate kleiner werden.“ | – |
| a2c | number | Wie weit liegt die Vorhersage mit pt03 typischerweise daneben (typischer Fehler)? | – | 1.031 | 0.001 | 1,031 Punkte. Ohne Vertrauen, nur mit dem Mittelwert, wären es 1,274 (Standardabweichung von demo). | Lies Std. Error of the Estimate. Sonderfälle: 1,274 → „Das ist die Standardabweichung von demo, der typische Fehler des Mittelwerts. Gesucht ist der Fehler der Geraden.“ 1,063 → „Das ist Mean Square in der ANOVA-Tabelle, ein quadrierter Wert.“ 0,046 → „Das ist der Standardfehler der Konstante.“ | Aus Schritt 1, Model Summary. |
| a2d | number | Wie groß ist R² mit der Schicht (id02)? | – | 0.060 | 0.001 | R² = 0,060: Mit der Schicht sind die Fehlerquadrate nur um 6 % kleiner als mit dem Mittelwert. | Tausch in Schritt 2 pt03 gegen id02. Sonderfälle: 0,346 → „Das ist noch das Ergebnis für pt03. Tausch die markierte Stelle gegen id02.“ 0,246 → „Das ist R. Gesucht ist R Square.“ | Aus Schritt 2. |
| a2e | number | Wie groß ist die Steigung (B) der Schicht? | – | 0.412 | 0.001 | 0,412: Mit jeder Schicht höher liegt die vorhergesagte Zufriedenheit um 0,41 Punkte höher, fast so viel wie pro Stufe Vertrauen (0,465). | Zeile id02, Spalte B. Sonderfälle: 0,246 → „Das ist Beta. Gesucht ist B.“ 2,966 → „Das ist die Konstante.“ 0,465 → „Das ist noch die Steigung von pt03.“ | Aus Schritt 2, Coefficients. |
| a2f | choice | Die Steigungen sind fast gleich. Warum sagt die Schicht trotzdem viel weniger vorher? | a: „Bei der Schicht liegen die Befragten viel weiter von der Geraden entfernt; R² misst die Nähe der Punkte, nicht die Steilheit.“; b: „Die Schicht hat weniger Stufen, darum ist ihre Gerade ungenauer berechnet.“; c: „Bei der Schicht haben weniger Befragte geantwortet.“ | a | – | Genau. Steigung und R² beantworten verschiedene Fragen: wie viel sich die Vorhersage ändert, und wie nah die Punkte an der Geraden liegen. Der typische Fehler zeigt es auch: 1,233 bei der Schicht gegen 1,031 beim Vertrauen. Dazu kommt: Gut drei Viertel ordnen sich der Arbeiter- oder Mittelschicht zu (78 %); die Schicht streut wenig (Standardabweichung 0,76 gegen 1,61 beim Vertrauen). Über so wenige genutzte Stufen ändert auch eine steile Gerade die Vorhersage kaum. | b: „Die Zahl der Stufen ist nicht der Grund. Vergleiche den typischen Fehler: 1,233 bei der Schicht, 1,031 beim Vertrauen.“ c: „Beide Rechnungen haben N = 3.575. An der Zahl der Befragten liegt es nicht.“ | – |

**Hilfe, Stufe 1: Denkanstoß:** „R² vergleicht die Fehlerquadrate der Geraden mit denen des Mittelwerts. Eine Gerade kann steil sein und trotzdem weit an den Punkten vorbeigehen.“

**Hilfe, Stufe 2: Wo schaue ich?:** „R Square und Std. Error of the Estimate stehen im Abschnitt Model Summary, die Standardabweichung von demo in Descriptive Statistics, B in Coefficients. Für die Schicht tauschst du in der Vorlage pt03 gegen id02.“

**Hilfe, Stufe 3: Lösung:** „Vertrauen: R² = 0,346, typischer Fehler 1,031 (ohne UV 1,274). Schicht: R² = 0,060, B = 0,412, typischer Fehler 1,233. Die Steigungen sind fast gleich, aber bei der Schicht streuen die Befragten viel weiter um die Gerade. Das Vertrauen sagt die Zufriedenheit fast sechsmal so gut vorher.“

**Ohne Grafik lösbar:** „Diese Aufgabe hat keine Grafik. Alle Zahlen stehen in den beiden Ausgaben.“

**Fürs Plenum:** „Das Vertrauen in den Bundestag sagt die Zufriedenheit mit der Demokratie gut vorher. Ist das eine Erklärung, oder fragen beide Fragen fast dasselbe? Bringt ein Argument für jede Seite mit.“

---

## 6 Thema 3: Gleich gut für alle? Fehlervarianz und Ausreißer

### Grundlage 3 „Gleich gut für alle?“ (Kopf: „Grundlage zu Aufgabe 3“, „Schon klar? Direkt zu Aufgabe 3 ↓“)

Unterzeile: „Liegt die Gerade für alle Gruppen gleich weit daneben, und was macht ein einzelner Punkt weit draußen? Etwa 12 Minuten.“

#### Karte 3a „Gleiche Fehlervarianz: Streuen die Residuen überall gleich?“ (Schilder: „Ähnliche Streuung: kennst du aus Sitzung 7“, „Im Bild“)

Beispiel zuerst: „Die Gerade aus Grundlage 1 liegt im Mittel 1,72 Punkte daneben. Gilt das für alle? Für jede Stufe der Lage hat R ausgerechnet, wie stark die Residuen streuen (Standardabweichung).“

**Bild B6 `s9-streuung-je-stufe` (statisch, Säulen):**
- Fünf senkrechte Säulen (Baukasten-Stapel in Blau), x-Achse die fünf Stufen der Lage mit Namen, y-Achse „Streuung der Residuen (SD, Punkte)“ von 0 bis 3 (Striche bei 0, 1, 2, 3).
- Höhen: sehr schlecht 2,715; schlecht 2,228; teils/teils 1,816; gut 1,584; sehr gut 1,269. Wert über jeder Säule (deutsche Schreibweise, zwei Stellen: 2,72; 2,23; 1,82; 1,58; 1,27). Unter jeder Säule klein „n = 77“, „435“, „1.491“, „2.751“, „378“ (gewichtet).
- Waagerechte gestrichelte grüne Linie bei 1,720, beschriftet „typischer Fehler insgesamt: 1,72“.
- Rechts ein kleines Symbol „Fächer“: Punkte, die nach links weiter auseinanderliegen (konstruiert, nur Andeutung), beschriftet „so sieht es in der Punktwolke aus“.

**Textfassung B6:** „Streuung der Residuen je Stufe der wirtschaftlichen Lage, gewichtet: sehr schlecht 2,72 Punkte (77 Befragte), schlecht 2,23 (435), teils/teils 1,82 (1.491), gut 1,58 (2.751), sehr gut 1,27 (378). Insgesamt 1,72. Bei sehr schlechter Lage liegt die Gerade etwa doppelt so weit daneben wie bei sehr guter.“

**Kurz überlegen** (Auswahl, Auflösen): „Für wen ist die Vorhersage der Lebenszufriedenheit am ungenauesten?“ Optionen: „für Menschen mit sehr schlechter Lage“, „für Menschen mit sehr guter Lage“, „für alle gleich, die Gerade ist ja eine“.
- Ziel 1. richtig: „Genau. Bei sehr schlechter Lage streuen die Residuen mit 2,72 Punkten am stärksten: Manche sind trotzdem sehr zufrieden, andere sehr unzufrieden. Bei sehr guter Lage sind sich die Befragten einiger (1,27).“
- Option 2: „Bei sehr guter Lage ist die Streuung am kleinsten (1,27). Schau, welche Säule am höchsten ist.“
- Option 3: „Die Gerade ist eine, aber die Punkte liegen unterschiedlich weit von ihr entfernt. Genau das zeigen die Säulen.“

Kurz gesagt: „**Gleiche Fehlervarianz** (Homoskedastizität) heißt: Die Residuen streuen für alle Werte der UV gleich stark. Bei Gruppen hieß das in Sitzung 7 Varianzhomogenität. Ist das verletzt, gilt der typische Fehler nicht für alle; für manche Gruppen liegt die Vorhersage viel weiter daneben. Man sieht es in der Punktwolke als Fächer.“

**Zwei Wege zu prüfen** (Absatz, sichtbar; Schilder „Faustregel: kennst du aus Sitzung 7“, „Levene-Test: neu heute“):
- „**Die Größe ansehen:** Vergleiche die größte und die kleinste Streuung. Faustregel wie in Sitzung 7: Ist die größte mehr als doppelt so groß wie die kleinste, unterscheiden sich die Streuungen deutlich. Hier: 2,72 zu 1,27, gut doppelt so groß.“
- „**Der Levene-Test** prüft, ob die Streuungen in allen Gruppen gleich sein könnten. Kurz gesagt: Ist p kleiner als 0,05, streuen die Gruppen verschieden; R schreibt dann „variances unequal“. Hier: F = 67,18, p < 0,001. Die Streuungen unterscheiden sich also.“
- „Beides gehört zusammen: Bei Tausenden Befragten wird auch ein kleiner Unterschied signifikant. Der Test sagt, ob die Streuungen verschieden sind, die Faustregel, ob der Unterschied groß ist.“

Genauer erklärt „Was hinter den Säulen steckt, und was daraus folgt“:
- „Die Streuung je Stufe lässt du dir in Aufgabe 3 selbst ausgeben: erst für jede Person das Residuum bilden, dann seine Standardabweichung getrennt für jede Stufe.“
- „F misst, wie verschieden die Streuungen sind, ähnlich wie F in der ANOVA aus Sitzung 7 verschiedene Mittelwerte misst. Den Levene-Test kannst du ebenso für die Gruppen eines t-Tests oder einer ANOVA rechnen.“
- „Innerhalb einer Stufe sagt die Gerade allen denselben Wert vorher. Die Streuung der Residuen in einer Stufe ist darum genau die Streuung der Lebenszufriedenheit in dieser Stufe.“
- „Was folgt daraus? Die Gerade bleibt eine faire Beschreibung der Mittelwerte. Aber der typische Fehler und die Tests in der Ausgabe (Std. Error, Sig.) sind dann weniger verlässlich. Und im Bericht gehört dazu, für wen die Vorhersage ungenau ist.“

Häufige Verwechslung: „Gleiche Fehlervarianz heißt nicht, dass die Gruppen gleich zufrieden sind. Es geht nicht um die Mittelwerte, sondern darum, wie weit die Menschen in jeder Gruppe um die Gerade herum streuen.“

Link: „→ In der freien Karte: Gleiche Fehlervarianz“ (Begriff `variance_assumption`).

#### Karte 3b „Ausreißer: Ein Punkt zieht die Gerade“ (Schilder: „Ausreißer: kennst du aus Sitzung 4 und 6“, „Im Bild“)

Beispiel zuerst: „Zu den acht Befragten aus Grundlage 2 kommt eine neunte Person, zum Beispiel: sehr gute Lage, aber Lebenszufriedenheit 2. Was passiert mit der Geraden?“

**Bild B7 `s9-ausreisser` (interaktiv, Umschalter „Neunte Person dazunehmen“ / „ohne sie“, `aria-pressed`):**
- Die acht Punkte und die grüne Gerade 4 + 1 × Lage wie in B3.
- Mit der neunten Person: roter Punkt bei (5 | 2) mit Beschriftung „neunte Person“; neue Gerade 5,8 + 0,2 × Lage in Baukasten-Grün; die alte Gerade bleibt dünn grau gestrichelt stehen. Orange Residuenlinie der neunten Person zur alten Geraden (Länge 7) mit Quadrat 7 × 7, beschriftet „Residuum −7, Quadrat 49“.
- Unter dem Bild eine kleine Tabelle (`aria-live`): „ohne sie: Steigung 1, R² 0,67“ / „mit ihr: Steigung 0,2, R² 0,02“.

**Textfassung B7:** „Ohne die neunte Person: Gerade 4 plus 1 mal Lage, R² 0,67. Die neunte Person hat Lage 5 und Zufriedenheit 2. Zur alten Geraden hat sie ein Residuum von minus 7, quadriert 49, mehr als alle anderen Quadrate zusammen (6). Mit ihr wird die Gerade fast flach: 5,8 plus 0,2 mal Lage, R² 0,02.“

**Kurz überlegen** (Auswahl): „Was passiert mit der Steigung, wenn die neunte Person dazukommt?“ Optionen: „Sie wird viel flacher.“, „Sie bleibt ungefähr gleich, es ist ja nur eine von neun.“, „Sie wird steiler.“ Ziel 1. richtig: „Genau: von 1 auf 0,2. Ein Punkt weit draußen hat ein großes Quadrat, und die Gerade dreht sich zu ihm, um es kleiner zu machen.“ falsch (2): „Eine Person kann viel bewegen, wenn sie weit draußen und am Rand der UV liegt. Ihr Quadrat (49) ist größer als alle anderen zusammen.“ falsch (3): „Sie liegt unten rechts und zieht die Gerade rechts nach unten. Die Gerade wird flacher.“

Kurz gesagt: „Ein **Ausreißer** ist ein Punkt weit weg von den anderen. Weil die Regression quadrierte Abstände klein macht, kann ein einziger Ausreißer, vor allem am Rand der UV, die Gerade stark ziehen. Erst anschauen, dann rechnen.“

Genauer erklärt „Was tun mit Ausreißern?“:
- „Erst prüfen, ob es ein Fehler ist (etwa ein Tippfehler bei der Erfassung). Echte Antworten bleiben drin.“
- „Rechne zur Kontrolle einmal mit und einmal ohne die auffälligen Fälle und berichte beides. Ändert sich die Gerade stark, hängt dein Ergebnis an wenigen Personen.“
- „Bei Skalen wie 0 bis 10 oder 1 bis 6 gibt es kaum Werte weit draußen; bei offenen Angaben wie Stunden oder Einkommen schon (kennst du aus Sitzung 4). Wie man den Einfluss einzelner Fälle misst, kommt in Sitzung 10.“

Häufige Verwechslung: „Viele Befragte machen eine Regression nicht immun. Bei 5.000 Befragten zieht eine einzelne Person wenig; aber eine kleine Gruppe mit extremen Werten kann es schon.“

### Aufgabe 3 „Für wen liegt die Gerade daneben?“ (Pflicht)

Link „↑ Grundlage 3 nachlesen“.

Leitfrage: „Sagt das Vertrauen in den Bundestag die Zufriedenheit für alle gleich gut vorher, oder für manche viel schlechter?“

Ziel: „Am Ende hast du für jede Person das Residuum gebildet, seine Streuung je Stufe des Vertrauens verglichen und den Levene-Test gelesen. Du kannst sagen, ob die Voraussetzung gleicher Fehlervarianz hält und für wen die Gerade am weitesten danebenliegt.“

Grundlage: „Grundlage 3a, Gleiche Fehlervarianz“.

**Erst festlegen** (Auswahl, „Tipp abgeben“): „Für wen liegt die Gerade wohl weiter daneben?“ Optionen: „für Menschen ganz ohne Vertrauen (Stufe 1)“, „für Menschen mit großem Vertrauen (Stufe 7)“, „für alle etwa gleich“. Auflösung: „Stufe 1: Streuung 1,325; Stufe 7: 0,952; am kleinsten in Stufe 6: 0,713. Ganz ohne Vertrauen liegt die Gerade fast doppelt so weit daneben wie in Stufe 6.“

**Schritte:**

1. „Die Vorlage bildet für jede Person die Vorhersage (Konstante + Steigung mal pt03) und das Residuum (beobachtet minus vorhergesagt). Noch stehen dort die Zahlen aus Grundlage 1. Tausch die beiden markierten Zahlen gegen Konstante und Steigung aus Aufgabe 1 und führe die Vorlage aus.“ Schilder „mutate(): kennst du aus Sitzung 5“, „group_by(): neu heute“, „levene_test(): neu heute“. Hilfezeile: „Konstante 2.288, Steigung 0.465, mit Punkt.“

```r
# Vorhersage und Residuum für jede Person (umpolen wie in Aufgabe 1)
allbus <- allbus %>%
  mutate(
    demo       = rec(ps03, rules = "rev"),
    vorhersage = ⟦3.570⟧ + ⟦1.073⟧ * pt03,
    residuum   = demo - vorhersage
  )

# Mittelwert und Streuung des Residuums, getrennt für jede Stufe des Vertrauens
allbus %>%
  drop_na(residuum) %>%
  group_by(pt03) %>%
  describe(residuum, weights = wghtpew, show = c("mean", "sd"))

# Test: Streut das Residuum in allen Stufen gleich stark?
allbus %>%
  levene_test(residuum, group = pt03, weights = wghtpew)
```

Erklärkasten unter der Vorlage (neu heute): „`group_by(pt03)` teilt die Befragten nach ihrer Antwort bei pt03 in sieben Gruppen. Alles, was danach kommt, rechnet R für jede Gruppe getrennt. `describe()` gibt darum sieben kleine Tabellen aus, eine je Stufe, in der Reihenfolge 1 bis 7. Nur 1 und 7 haben einen Namen (GAR KEIN VERTRAUEN, GROSSES VERTRAUEN); die Stufen 2 bis 6 zeigt R als „..“. N ist gewichtet gezählt. `drop_na(residuum)` lässt alle weg, für die es kein Residuum gibt, weil ps03 oder pt03 fehlt (kennst du aus Sitzung 4).“

Bild zu Schritt 1 (B8 `s9-group-by`, Bauplatte wie in Sitzung 4): Eine Bauplatte mit drei Türmen `pt03`, `demo`, `residuum` (sechs Reihen, zum Beispiel); `group_by(pt03)` schiebt die Reihen zu kleinen Platten zusammen, eine je Wert von pt03 (im Beispiel drei Platten 1, 4, 7); unter jeder Platte ein Kärtchen „Mean, SD“. Notiz „zum Beispiel sechs Befragte“. Textfassung: „group_by(pt03) legt alle Reihen mit demselben Wert bei pt03 auf eine eigene Platte. describe() rechnet dann für jede Platte getrennt Mittelwert und Standardabweichung des Residuums.“

2. „Lies in jeder der sieben Tabellen die Spalte SD: So stark streut das Residuum in dieser Stufe. Wo ist sie am größten, wo am kleinsten?“

3. „Lies die letzte Zeile der Ausgabe: den Levene-Test. „variances unequal“ heißt: Die Streuungen sind nicht gleich. Prüf dazu die Größe mit der Faustregel aus Sitzung 7: Ist die größte SD mehr als doppelt so groß wie die kleinste?“ Schild „Faustregel: kennst du aus Sitzung 7“.

4. „Deuten: Was heißt das für einen Bericht? (Frage a3e)“

Hinweis unter Schritt 2 (Genauer erklärt, zugeklappt, „Warum ändern Konstante und Steigung die SD nicht?“): „Innerhalb einer Stufe sagt die Gerade allen denselben Wert vorher. Die SD des Residuums ist dort die SD der Zufriedenheit selbst. Darum stimmen die SD-Werte schon, bevor du die Zahlen tauschst; nur die Mittelwerte (Mean) brauchen die richtige Gerade.“

**Weiterdenken in der Probier-Werkstatt (für die Aufgabe nicht nötig):** „Eine Idee: Wie sieht die Streuung des Residuums je Stufe als Boxplots aus? `to_label()` schreibt die Stufen an die Achse (kennst du aus Sitzung 4). Die Probier-Werkstatt startet mit einem Vorschlag.“

```r
# Eine Idee: das Residuum je Stufe als Boxplots (wie in Sitzung 4)
allbus %>%
  mutate(
    demo       = rec(ps03, rules = "rev"),
    vorhersage = 2.288 + 0.465 * pt03,
    residuum   = demo - vorhersage
  ) %>%
  drop_na(residuum) %>%
  to_label(pt03) %>%
  ggplot(aes(x = pt03, y = residuum)) +
  geom_boxplot()
```

(Die Stufen 2 bis 6 heißen auf der Achse „.. (2)“ bis „.. (6)“.)

**Antwortfragen:**

| id | Art | Label | Optionen | Ziel | Toleranz | Text richtig | Text falsch / Hinweis | Hilfezeile |
|---|---|---|---|---|---|---|---|---|
| a3a | choice | In welcher Stufe des Vertrauens streut das Residuum am wenigsten? | s1: 1 (gar kein Vertrauen); s2: 2; s3: 3; s4: 4; s5: 5; s6: 6; s7: 7 (großes Vertrauen) | s6 | – | Stufe 6: SD 0,713. Hier liegt die Gerade am nächsten an den Befragten. | Vergleiche die Spalte SD der sieben Tabellen; die sechste Tabelle ist Stufe 6. Bei s7: „Stufe 7 hat SD 0,952. Eine Tabelle davor ist es weniger.“ Bei s1: „Stufe 1 hat die größte SD, 1,325.“ | Die Tabellen stehen in der Reihenfolge 1 bis 7. |
| a3b | number | Wie stark streut das Residuum bei Menschen ganz ohne Vertrauen (Stufe 1)? | – | 1.325 | 0.001 | 1,325, fast doppelt so viel wie in Stufe 6 (0,713) und mehr als der typische Fehler insgesamt (1,031). | Erste Tabelle (GAR KEIN VERTRAUEN), Spalte SD. Sonderfälle: −0,289 oder −2,179 → „Das ist der Mittelwert (Mean). Gesucht ist SD.“ 1,031 → „Das ist der typische Fehler für alle zusammen. Gesucht ist die SD in Stufe 1.“ | Spalte SD, Gruppe GAR KEIN VERTRAUEN. |
| a3c | number | Um wie viel liegt die Gerade bei großem Vertrauen (Stufe 7) im Mittel daneben (Mittelwert des Residuums)? | – | -0.405 | 0.01 | −0,405: Bei großem Vertrauen sagt die Gerade im Mittel 0,4 Punkte zu viel vorher (5,54 statt 5,14). Die Gerade kommt nahe an das Ende der Skala (6), höher kann niemand antworten; die Befragten bleiben im Mittel darunter. | Letzte Tabelle (GROSSES VERTRAUEN), Spalte Mean. Sonderfälle: −5,943 → „Das ist mit den Zahlen aus Grundlage 1 gerechnet. Tausch in Schritt 1 die markierten Zahlen gegen 2.288 und 0.465.“ 0,405 → „Achte auf das Minuszeichen: Die Befragten liegen im Mittel unter der Geraden.“ 0,952 → „Das ist SD. Gesucht ist Mean.“ | Spalte Mean, Gruppe GROSSES VERTRAUEN. |
| a3d | choice | Was zeigen der Levene-Test (F = 74,86, p < 0,001) und die SD-Werte zusammen? | a: „Die Streuung des Residuums ist nicht in allen Stufen gleich; die Voraussetzung gleicher Fehlervarianz hält nicht. Die größte SD ist fast doppelt so groß wie die kleinste: ein spürbarer Unterschied.“; b: „Die Streuungen sind gleich, denn die größte SD ist nicht mehr als doppelt so groß wie die kleinste.“; c: „Die Gerade ist falsch berechnet.“; d: „75 % der Vorhersagen liegen daneben.“ | a | – | Genau. p < 0,001 heißt: So verschiedene Streuungen wären bei gleichen Streuungen in der Bevölkerung sehr unwahrscheinlich. Die Größe zeigen die SD-Werte: 1,325 zu 0,713 ist das 1,86-Fache, knapp unter der Faustregel „mehr als doppelt“ aus Sitzung 7. Also: verschieden, und groß genug, um es zu berichten. | b: „Die Faustregel sagt, ob ein Unterschied groß ist, nicht ob es ihn gibt. Der Levene-Test zeigt mit p < 0,001, dass die Streuungen nicht gleich sind. Das 1,86-Fache ist knapp unter „deutlich“, aber weit weg von gleich.“ c: „Die Gerade ist richtig berechnet. Der Test sagt nur, dass sie nicht für alle gleich genau ist.“ d: „F ist keine Prozentzahl. Es misst, wie verschieden die Streuungen sind; p sagt, ob das Zufall sein kann.“ | Letzte Zeile der Ausgabe und die Spalte SD. |
| a3e | choice | Welcher Satz gehört in einen Bericht? | a: „Die Gerade sagt die Zufriedenheit für Menschen ohne Vertrauen in den Bundestag ungenauer vorher (Streuung der Residuen 1,33) als für Menschen mit viel Vertrauen (0,71 in Stufe 6).“; b: „Die Gerade passt für alle gleich gut, denn R² ist 0,35.“; c: „Für Menschen ohne Vertrauen ist die Gerade falsch; man sollte sie aus der Auswertung nehmen.“ | a | – | Genau. Ein ehrlicher Bericht sagt, für wen die Vorhersage ungenau ist. Hier sind es ausgerechnet die, die dem Bundestag nicht vertrauen. | b: „R² gilt für alle zusammen. Ob die Gerade für jede Gruppe gleich gut passt, zeigt erst die SD je Stufe.“ c: „Niemand wird herausgenommen, nur weil die Gerade für ihn schlechter passt. Man berichtet es.“ | – |

**Hilfe, Stufe 1: Denkanstoß:** „Das Residuum ist, wie weit eine Person von der Geraden entfernt ist. Wenn es in einer Gruppe stark streut, liegt die Gerade dort oft weit daneben. group_by() rechnet das für jede Stufe getrennt.“

**Hilfe, Stufe 2: Wo schaue ich?:** „Sieben Tabellen, in der Reihenfolge 1 bis 7. Die Streuung steht in der Spalte SD, der mittlere Abstand in Mean. Der Levene-Test steht ganz unten. Für Mean brauchst du in Schritt 1 Konstante und Steigung aus Aufgabe 1.“

**Hilfe, Stufe 3: Lösung:** „Mit 2.288 und 0.465: SD je Stufe 1,325; 1,250; 1,165; 0,988; 0,853; 0,713; 0,952. Am kleinsten in Stufe 6, am größten in Stufe 1. Mean in Stufe 7: −0,405. Levene: F(6; 3.567,9) = 74,86, p < 0,001, die Streuungen sind ungleich. Größe: 1,325 zu 0,713 ist das 1,86-Fache, knapp unter der Faustregel „mehr als doppelt“. Für den Bericht: Ganz ohne Vertrauen liegt die Gerade fast doppelt so weit daneben wie in Stufe 6.“

**Ohne Grafik lösbar:** „Diese Aufgabe braucht keine Grafik. Das Bild zu Schritt 1 hat eine Textfassung; alle Zahlen stehen in der Ausgabe.“

**Fürs Plenum:** „Die Gerade liegt bei Menschen ohne Vertrauen am weitesten daneben. Warum könnte das so sein? Und was heißt das, wenn eine Zeitung schreibt: „Wer dem Bundestag vertraut, ist zufrieden mit der Demokratie“?“

---

## 7 Thema 4: Gerade oder Kurve? Linearität (Zusatz)

### Grundlage 4 „Gerade oder Kurve?“ (Kopf: „Grundlage zu Aufgabe 4“, „Schon klar? Direkt zu Aufgabe 4 ↓“)

Unterzeile: „Was zeigt eine Gerade, wenn der Zusammenhang gar nicht gerade ist? Etwa 5 Minuten.“

#### Karte 4 „Eine flache Gerade heißt nicht „kein Zusammenhang““ (Schilder: „r sieht nur Geraden: kennst du aus Sitzung 6“, „Im Bild“)

Beispiel zuerst: „Zehn Räume, zum Beispiel, von 14 bis 32 Grad. In jedem sagt eine Person, wie wohl sie sich fühlt (0 bis 10). Zu kalt und zu warm sind beide unangenehm.“

**Bild B9 `s9-kurve` (interaktiv, Umschalter „Gerade zeigen“ / „Mittelwerte verbinden“):**
- x-Achse „Raumtemperatur (Grad)“ 14 bis 32, y-Achse „Wohlbefinden“ 0 bis 10. Notiz „zum Beispiel zehn Räume“.
- Zehn blaue Punkte: (14 | 2), (16 | 4), (18 | 6), (20 | 8), (22 | 9), (24 | 9), (26 | 8), (28 | 6), (30 | 4), (32 | 2).
- „Gerade zeigen“: grüne waagerechte Gerade bei 5,8, beschriftet „Gerade aus R: Steigung 0, R² = 0“.
- „Mittelwerte verbinden“: orange Linie durch die Punkte (umgekehrtes U).

**Textfassung B9:** „Zehn Räume, zum Beispiel. Wohlbefinden bei 14, 16, 18, 20, 22, 24, 26, 28, 30 und 32 Grad: 2, 4, 6, 8, 9, 9, 8, 6, 4, 2. Es steigt bis 22 bis 24 Grad und fällt dann wieder. Die Gerade aus R ist waagerecht bei 5,8: Steigung 0, R² 0.“

**Kurz überlegen** (Auswahl): „Die Gerade ist flach, R² ist 0. Heißt das, das Wohlbefinden hängt nicht mit der Temperatur zusammen?“ Optionen: „Ja, R² = 0 heißt kein Zusammenhang.“, „Nein: Der Zusammenhang ist stark, aber nicht gerade. Eine Gerade kann ihn nicht zeigen.“ Ziel 2. richtig: „Genau. Die Regression misst nur den geraden (linearen) Teil eines Zusammenhangs, wie r in Sitzung 6. Ein Bogen hat keinen.“ falsch: „R² = 0 heißt nur: kein **linearer** Zusammenhang. Schau auf die Punkte: Sie bilden einen deutlichen Bogen.“

Text „Und im ALLBUS?“: „Bei der Lebenszufriedenheit nach Lage (Grundlage 1) passt die Gerade gut: Die Mittelwerte der Stufen liegen höchstens 0,27 Punkte neben ihr, in der Mitte fast genau darauf, an beiden Rändern etwas darunter (−0,27 und −0,26).“ (Werte mit ungerundeten Koeffizienten: −0,266; −0,074; 0,020; 0,043; −0,255. Im Kapitel als „−0,27; −0,07; 0,02; 0,04; −0,26“, die letzte gerundet aus −0,2550.)

Kurz gesagt: „**Linearität** heißt: Der Zusammenhang lässt sich durch eine Gerade beschreiben. Prüfen kannst du das, indem du die Mittelwerte jeder Stufe neben die Gerade legst. Liegen sie in einem Bogen um die Gerade, beschreibt sie den Zusammenhang schlecht.“

Genauer erklärt „Was tun bei einem Bogen?“:
- „Die Gerade nicht deuten, sondern die Mittelwerte je Stufe berichten.“
- „Oder die UV in Gruppen einteilen und jede Gruppe mit einer eigenen Zahl ins Modell nehmen (Dummyvariablen, Sitzung 10).“

Häufige Verwechslung: „Ein signifikantes B heißt nicht, dass die Gerade passt. Auch eine Gerade durch einen Bogen kann bei vielen Befragten signifikant sein.“

### Aufgabe 4 „Links, Mitte, rechts“ (Zusatz)

Link „↑ Grundlage 4 nachlesen“.

Leitfrage: „Sind Menschen umso weniger zufrieden mit der Demokratie, je weiter rechts sie sich einstufen?“

Ziel: „Am Ende kannst du eine Gerade mit den Mittelwerten je Stufe vergleichen und sagen, ob sie den Zusammenhang richtig beschreibt.“

Grundlage: „Grundlage 4, Gerade oder Kurve?“.

Einleitung: „Die Befragten stufen sich politisch selbst ein, von 1 (links) bis 10 (rechts) (pa01).“

**Erst festlegen** (Auswahl, „Tipp abgeben“): „Wie hängt die Zufriedenheit mit der Demokratie mit der Links-rechts-Einstufung zusammen?“ Optionen: „Sie sinkt gleichmäßig von links nach rechts.“, „Beide Ränder sind weniger zufrieden als die Mitte.“, „Es gibt keinen Zusammenhang.“ Auflösung: „Beide Ränder sind weniger zufrieden: ganz links 3,86, in Stufe 3 4,55, ganz rechts 2,54. Die Gerade fällt nur, weil rechts der Abfall stärker ist.“

**Schritte:**

1. „Führe die Vorlage aus. Sie rechnet die Gerade und die Mittelwerte von demo für jede Stufe von pa01.“ Hilfezeile: „Die zehn Tabellen stehen in der Reihenfolge 1 bis 10; nur 1 (LINKS) und 10 (RECHTS) haben einen Namen.“

```r
# Links-rechts und Zufriedenheit mit der Demokratie (umpolen wie in Aufgabe 1)
allbus <- allbus %>%
  mutate(
    demo = rec(ps03, rules = "rev")
  )

# Die Gerade
allbus %>%
  linear_regression(demo ~ pa01, weights = wghtpew) %>%
  summary()

# Mittelwerte je Stufe der Links-rechts-Einstufung
allbus %>%
  drop_na(demo, pa01) %>%
  group_by(pa01) %>%
  describe(demo, weights = wghtpew, show = c("mean", "sd"))
```

2. „Rechne die Vorhersage der Geraden für „ganz links“ (pa01 = 1). Tausch die drei markierten Zahlen. Die Steigung ist negativ: Schreib sie mit Minus.“ Hilfezeile: „`4.857 + -0.140 * 1` und `4.857 - 0.140 * 1` ergeben dasselbe.“

```r
# Vorhersage von Hand für „ganz links“ (pa01 = 1)
# (hier noch das Beispiel aus Grundlage 1: lage = 4)
⟦3.570⟧ + ⟦1.073⟧ * ⟦4⟧
```

3. „Vergleiche: Vorhersage für ganz links gegen den Mittelwert der ersten Tabelle (LINKS).“

**Bild zu Schritt 3, B10 `s9-links-rechts` (erscheint nach „Antworten prüfen“ oder über Knopf „Bild zeigen“, damit es die Fragen nicht vorwegnimmt):** x-Achse pa01 1 bis 10 („links“ … „rechts“), y-Achse „Zufriedenheit mit der Demokratie (1 bis 6)“ von 2 bis 5. Orange Rauten mit Linie: Mittelwerte 3,864; 4,369; 4,549; 4,488; 4,175; 4,057; 3,811; 3,845; 2,776; 2,536. Grüne Gerade von (1 | 4,717) bis (10 | 3,457). Unter den Stufen 9 und 10 klein „n = 37“, „n = 38“ (gewichtet). Textfassung: „Mittelwerte der Zufriedenheit je Stufe von 1 links bis 10 rechts: 3,86; 4,37; 4,55; 4,49; 4,18; 4,06; 3,81; 3,85; 2,78; 2,54. Die Gerade fällt gleichmäßig von 4,72 auf 3,46. Ganz links liegt der Mittelwert 0,85 unter der Geraden, ganz rechts 0,92 (Stufe 9: 0,82); in der Mitte (Stufen 3 bis 6) liegt er knapp darüber.“

**Weiterdenken in der Probier-Werkstatt (für die Aufgabe nicht nötig):** „Eine Idee: Zeigt die Lebenszufriedenheit dasselbe Muster nach Links-rechts? Die Probier-Werkstatt startet mit einem Vorschlag.“

```r
# Eine Idee: die Lebenszufriedenheit nach Links-rechts
allbus %>%
  drop_na(ls01, pa01) %>%
  group_by(pa01) %>%
  describe(ls01, weights = wghtpew, show = c("mean", "sd"))
```

(Zur Information: ganz links 7,050, Stufe 3 7,570, ganz rechts 6,839; ein flacher Bogen.)

**Antwortfragen:**

| id | Art | Label | Optionen | Ziel | Toleranz | Text richtig | Text falsch / Hinweis | Hilfezeile |
|---|---|---|---|---|---|---|---|---|
| a4a | number | Wie groß ist die Steigung (B) von pa01? | – | -0.14 | 0.001 | −0,140: Mit jeder Stufe weiter rechts liegt die vorhergesagte Zufriedenheit um 0,14 Punkte niedriger. | Zeile pa01, Spalte B. Sonderfälle: 0,140 → „Achte auf das Minus: Die Gerade fällt.“ −0,193 → „Das ist Beta. Gesucht ist B.“ | Aus `summary()`, Coefficients. |
| a4b | number | Welche Zufriedenheit sagt die Gerade für „ganz links“ (pa01 = 1) vorher? | – | 4.717 | 0.005 | 4,717: 4,857 − 0,140 × 1. Die Gerade gibt den ganz Linken den höchsten Wert. | Schritt 2: Konstante 4.857, Steigung −0.140, Wert 1. Sonderfälle: 7,862 → „Das ist noch das Beispiel aus Grundlage 1.“ 4,997 → „Die Steigung ist negativ: 4.857 - 0.140 * 1.“ | Ergebnis aus Schritt 2. |
| a4c | number | Wie zufrieden sind die ganz Linken (pa01 = 1) im Mittel tatsächlich? | – | 3.864 | 0.001 | 3,864, fast einen Punkt (0,85) weniger, als die Gerade vorhersagt. | Erste Tabelle (LINKS), Spalte Mean. Sonderfall 1,339 → „Das ist SD. Gesucht ist Mean.“ | Spalte Mean, Gruppe LINKS. |
| a4d | choice | Welches Muster zeigen die Mittelwerte? | a: „Beide Ränder sind weniger zufrieden als die Mitte; ganz rechts am wenigsten.“; b: „Die Zufriedenheit sinkt gleichmäßig von links nach rechts.“; c: „Alle Stufen sind etwa gleich zufrieden.“ | a | – | Genau: von 3,86 links über 4,55 in Stufe 3 bis 2,54 rechts. Ein Bogen, der rechts tiefer endet. | b: „Lies die Mean-Werte der Reihe nach: Von Stufe 1 bis 3 steigen sie, danach fallen sie.“ c: „Zwischen 2,54 und 4,55 liegen zwei Punkte, fast die Hälfte der Skala.“ | – |
| a4e | choice | Was folgt daraus für die Gerade? | a: „Sie beschreibt den Zusammenhang schlecht: Den ganz Linken sagt sie den höchsten Wert vorher, obwohl sie unzufriedener sind als die Mitte. Besser die Mittelwerte je Stufe berichten.“; b: „Sie ist trotzdem richtig, denn B ist signifikant (p < 0,001).“; c: „Sie ist richtig, R² = 0,037 ist nur klein, weil viele nicht geantwortet haben.“ | a | – | Genau. Die Voraussetzung Linearität ist verletzt. R² = 0,037 ist auch deshalb so klein, weil eine Gerade den Bogen nicht abbilden kann. | b: „Signifikant heißt nur, dass die Steigung nicht 0 ist. Ob eine Gerade die richtige Form ist, sagt p nicht.“ c: „Es rechnen 3.444 Befragte mit. R² ist klein, weil die Gerade den Bogen nicht trifft.“ | – |

**Hilfe, Stufe 1: Denkanstoß:** „Eine Gerade kann nur steigen oder fallen. Vergleiche, was sie für die ganz Linken vorhersagt, mit dem, was die ganz Linken im Mittel tatsächlich sagen.“

**Hilfe, Stufe 2: Wo schaue ich?:** „B steht in Coefficients (Zeile pa01). Die Mittelwerte stehen in den zehn Tabellen in der Spalte Mean, von links (1) nach rechts (10).“

**Hilfe, Stufe 3: Lösung:** „B = −0,140, Konstante 4,857, R² = 0,037. Vorhersage ganz links 4,717, tatsächlich 3,864; ganz rechts 3,457 gegen 2,536. Die Mittelwerte steigen bis Stufe 3 (4,549) und fallen dann. Eine Gerade beschreibt diesen Bogen schlecht; besser die Mittelwerte je Stufe berichten. Die Stufen 9 und 10 sind klein (gewichtet 37 und 38 Befragte).“

**Ohne Grafik lösbar:** „Alle Zahlen stehen in der Ausgabe von Schritt 1 und im Ergebnis von Schritt 2; das Bild hat eine Textfassung.“

---

## 8 Hilfe bei R-Fehlermeldungen (unter jeder Aufgabe, zugeklappt „Hilfe: R meldet einen Fehler“)

| R meldet | Das hilft |
|---|---|
| ``Variable not found in data: `demo` `` | `demo` gibt es nur, wenn ps03 vorher umgepolt wurde. Führe die ganze Vorlage aus, mit dem `mutate()`-Block. In der Code-Werkstatt startet jede Vorlage frisch; das Umpolen muss in jeder Vorlage stehen, die `demo` braucht. |
| ``Variable not found in data: `pt3` `` | Der Variablenname ist vertippt. Prüf ihn Zeichen für Zeichen: pt03 mit Null, id02, pa01. |
| `` `formula` must be a formula object (e.g., `y ~ x1 + x2`) `` | Zwischen AV und UV steht die Tilde: `demo ~ pt03`, kein Komma. Die Tilde tippst du auf dem Mac mit Alt + N (danach Leertaste), unter Windows mit AltGr + `+`. |
| ``Unknown argument `weight` of `linear_regression()` `` | Das Argument heißt `weights`, mit s. |
| `` `group` is required for Levene's test `` | `levene_test()` braucht die Gruppe: `levene_test(residuum, group = pt03, weights = wghtpew)`. |
| `Unerwartete(s) ','` (englisch: `unexpected ','`) | Kommazahlen schreibst du in R mit Punkt: `2.288 + 0.465 * 7`. |
| Kein Fehler, aber eine Spalte `288 + 0.465 * pt03` und Mittelwerte weit weg | In `mutate()` steht `2,288` mit Komma. R liest `vorhersage = 2` und eine zweite, unbenannte Spalte. Schreib `2.288`. |
| ``Unknown `show` value`` | Bei `show =` gibt es nur bestimmte Namen, etwa `"mean"` und `"sd"`. N zeigt `describe()` immer. |
| In RStudio erscheint `+` und nichts passiert | Eine Klammer ist nicht geschlossen. Mit Esc abbrechen und die Klammern zählen. |
| Die Ausgabe ist sehr lang und bricht um | Zieh das Konsolenfenster in RStudio breiter. Bei `group_by()` gibt R für jede Gruppe eine eigene kleine Tabelle aus; scroll nach oben. |

---

## 9 Überblick „Eine Regression lesen, prüfen, berichten“

Kopf: „Überblick zu allen Aufgaben“. Unterzeile: „Alle vier Themen zusammen: welche Zahl wofür steht und was du prüfst, bevor du der Geraden glaubst.“

#### Karte Ü1 „Fünf Zahlen für einen Bericht“

| Was | Wo in `summary()` | So schreibst du es (Beispiel Aufgabe 1 bis 3) |
|---|---|---|
| Steigung B | Coefficients, Zeile der UV, Spalte B | „Mit jeder Stufe mehr Vertrauen in den Bundestag liegt die vorhergesagte Zufriedenheit mit der Demokratie um 0,47 Punkte höher.“ |
| Konstante | Coefficients, Zeile `(Intercept)`, Spalte B | nur zum Rechnen, gedeutet nur, wenn 0 bei der UV vorkommt |
| R² | Model Summary, R Square | „Das Vertrauen erklärt statistisch 35 % der Streuung der Zufriedenheit (R² = 0,35).“ |
| typischer Fehler | Model Summary, Std. Error of the Estimate | „Die Vorhersage liegt typischerweise 1,0 Punkte daneben; ganz ohne Vertrauen deutlich mehr.“ |
| N und Gewicht | `- N:` und `- Weights:` | „ALLBUS 2023, gewichtet, n = 3.575.“ |

Text darunter: „Und immer dazu: Welche Variable ist die AV, welche die UV, und in welche Richtung laufen ihre Codes (umgepolt?).“

#### Karte Ü2 „Voraussetzungen: Was du prüfst, bevor du der Geraden glaubst“ (Bild B11 `s9-voraussetzungen`)

**Bild B11:** vier kleine Streudiagramme nebeneinander (auf 390 px zwei mal zwei), je acht bis zehn konstruierte Punkte und eine grüne Gerade, Überschrift je Bild:
1. „passt“: Punkte gleichmäßig um eine steigende Gerade (die acht Befragten aus Grundlage 2).
2. „Kurve“: die zehn Räume aus Grundlage 4 mit flacher Gerade.
3. „Ausreißer“: die neun Befragten aus Grundlage 3b mit gezogener Geraden.
4. „Fächer“: zehn Punkte, links weit gestreut, rechts eng an einer steigenden Geraden: (1 | 2), (1 | 8), (2 | 3), (2 | 8), (3 | 5), (3 | 8), (4 | 6,5), (4 | 8), (5 | 7,5), (5 | 8,5). (Nur Form, keine Zahlen im Text.)
Textfassung B11: „Vier kleine Bilder. Erstens: Punkte liegen gleichmäßig um eine steigende Gerade, alles in Ordnung. Zweitens: Punkte bilden einen Bogen, die Gerade ist flach, Linearität verletzt. Drittens: ein einzelner Punkt unten rechts zieht die Gerade flach, ein Ausreißer. Viertens: links streuen die Punkte weit, rechts eng, gleiche Fehlervarianz verletzt.“

| Voraussetzung | in Worten | so prüfst du | wenn verletzt |
|---|---|---|---|
| Linearität | Der Zusammenhang ist ungefähr gerade. | Mittelwerte je Stufe neben die Gerade legen (A4). | Mittelwerte je Stufe berichten oder Gruppen bilden (Sitzung 10). |
| keine einflussreichen Ausreißer | Kein einzelner Punkt zieht die Gerade weg. | Streudiagramm ansehen; mit und ohne auffällige Fälle rechnen. | Fehler korrigieren; sonst beides berichten. |
| gleiche Fehlervarianz | Die Residuen streuen überall gleich stark. | SD des Residuums je Stufe, Levene-Test (A3). | Berichten, für wen die Vorhersage ungenau ist; Tests vorsichtig lesen. |
| metrische AV | Die AV hat gleich große Abstände (oder viele Stufen). | Skalenniveau prüfen (Sitzung 3). | Bei wenigen Stufen vorsichtig; für zwei Stufen logistische Regression (Sitzung 11). |
| unabhängige Befragte | Jede Person zählt einmal und unabhängig von den anderen. | Durch die Zufallsstichprobe des ALLBUS näherungsweise gegeben. | – |
| Residuen ungefähr normalverteilt | Die Abstände zur Geraden verteilen sich wie eine Glocke. | Nur für die Tests (Sig., 95% CI) wichtig, und nur bei wenigen Befragten; bei Tausenden reicht der zentrale Grenzwertsatz (kennst du aus Sitzung 7). | Bei kleinen Stichproben Tests vorsichtig lesen. |

Text darunter: „Die Zufriedenheitsskalen dieses Kapitels haben 6 und 11 Stufen. Man rechnet mit ihnen wie mit metrischen Variablen; an den Enden der Skala zeigt sich das als Bogen oder als kleinere Streuung (Aufgabe 3, Stufe 7).“

#### Karte Ü3 „Zusammenhang, nicht Ursache“ (Schild „Zusammenhang ist keine Ursache: kennst du aus Sitzung 5“)

Text: „Eine Regression sagt: Wer bei der UV höher liegt, liegt im Mittel bei der AV um B höher. Sie sagt nicht, dass die UV die AV verursacht. Tauschst du die Seiten (Probier-Werkstatt in Aufgabe 1), bekommst du eine andere Gerade (0,743 statt 0,465) mit demselben R² (0,346). Beide stimmen; welche Richtung gilt, entscheidet die Theorie, nicht R.“

Kurz gesagt: „Erst die Gerade lesen (B, Konstante), dann prüfen, wie gut sie passt (R², typischer Fehler), dann, ob sie für alle passt (Linearität, Ausreißer, Fehlervarianz). Und im Bericht von Zusammenhang sprechen, nicht von Wirkung.“

Häufige Verwechslung: „„Die Regression zeigt, dass Vertrauen zufrieden macht.“ Richtig wäre: „Wer dem Bundestag mehr vertraut, ist im Mittel zufriedener mit der Demokratie.““

---

## 10 Mitnehmen

### Das Wichtigste aus dieser Sitzung
- Eine lineare Regression legt die Gerade durch eine Punktwolke, bei der die Summe der quadrierten Residuen am kleinsten ist (kleinste Quadrate).
- Vorhersage = Konstante + Steigung × Wert der UV. Die Steigung B sagt, um wie viel die Vorhersage pro Einheit der UV steigt, in der Einheit der AV. Die Konstante ist die Höhe bei UV = 0.
- Ein Residuum ist beobachtet minus vorhergesagt: wie weit eine Person über oder unter der Geraden liegt.
- R² sagt, um welchen Anteil die Fehlerquadrate mit der Geraden kleiner sind als mit dem Mittelwert. Mit einer UV ist R² = r². Steil heißt nicht gut: Steigung und R² getrennt lesen.
- Voraussetzungen: ein gerader Zusammenhang (Linearität), keine einzelnen Punkte, die die Gerade ziehen (Ausreißer), gleich große Streuung der Residuen für alle (gleiche Fehlervarianz; Levene-Test für „gibt es einen Unterschied?“, Faustregel „mehr als doppelt“ für „ist er groß?“).
- Eine Regression beschreibt einen Zusammenhang, keine Ursache.
- In R: `allbus %>% linear_regression(y ~ x, weights = wghtpew) %>% summary()`; `group_by()` rechnet danach für jede Gruppe getrennt; `levene_test(residuum, group = x, weights = wghtpew)` prüft gleiche Streuung.

### Prüf dich selbst (5 Fragen, je Auswahl mit Prüfen; Rückmeldung „Deine Wahl: „…“.“ plus Begründung)

1. „Eine Regression des Wohlbefindens (0 bis 10) auf die Schlafstunden ergibt B = 0,3. Was heißt das?“ Optionen: „Mit jeder Stunde mehr Schlaf liegt das vorhergesagte Wohlbefinden um 0,3 Punkte höher.“, „30 % des Wohlbefindens hängen am Schlaf.“, „Wer eine Stunde mehr schläft, fühlt sich dadurch um 0,3 Punkte wohler.“ Richtig: 1. Begründung: „B ist die Änderung der Vorhersage pro Einheit der UV, in Punkten der AV. „Dadurch“ wäre eine Ursache, die die Regression nicht zeigt (Grundlage 1b, Überblick Ü3).“
2. „Eine Person liegt im Streudiagramm 2 Punkte unter der Geraden. Wie groß ist ihr Residuum?“ Optionen: „−2“, „+2“, „4“. Richtig: 1. Begründung: „Residuum = beobachtet minus vorhergesagt. Unter der Geraden ist es negativ. Quadriert wäre es 4 (Grundlage 2a).“
3. „Zwei Regressionen: A hat B = 0,8 und R² = 0,05, B hat B = 0,3 und R² = 0,40. Welche UV sagt die AV besser vorher?“ Optionen: „A, weil die Gerade steiler ist.“, „B, weil die Punkte viel näher an der Geraden liegen.“, „Das lässt sich nicht sagen.“ Richtig: 2. Begründung: „Wie gut eine Gerade vorhersagt, sagt R², nicht die Steigung (Grundlage 2c, Aufgabe 2).“
4. „Im Streudiagramm liegen die Punkte links eng an der Geraden und rechts weit gestreut. Welche Voraussetzung ist verletzt?“ Optionen: „Linearität“, „gleiche Fehlervarianz“, „keine Ausreißer“. Richtig: 2. Begründung: „Ein Fächer heißt: Die Residuen streuen nicht überall gleich stark (Grundlage 3a).“
5. „Die Gerade für Alter und Stunden Sport pro Woche ist fast flach, R² = 0,01. Was kannst du sicher sagen?“ Optionen: „Alter und Sport hängen nicht zusammen.“, „Es gibt kaum einen linearen Zusammenhang; ein Bogen wäre noch möglich.“, „Die Regression wurde falsch gerechnet.“ Richtig: 2. Begründung: „R² misst nur den geraden Teil eines Zusammenhangs, wie r in Sitzung 6. Ob ein Bogen dahintersteckt, zeigen die Mittelwerte je Stufe (Grundlage 4).“

### Dein Skript zum Mitnehmen

Text: „Alle Vorlagen dieser Sitzung in einer Datei, mit Kommentaren. Öffne sie in RStudio und führe sie Block für Block aus.“ Knopf „Skript herunterladen (sitzung9.R)“; Link „→ Nachlesen im R-Workshop, Kapitel 9 (9.2 Einfache lineare Regression, 9.6 Residuen-Diagnostik)“.

Skriptteile in dieser Reihenfolge (Titel als Kopfkommentar `# ---- Titel ----`, Marken mit ihrem Beispielwert; ohne Probier-Werkstätten):

| Schlüssel | Titel |
|---|---|
| `start` | Startblock |
| `r_kurz` | Regression: Lebenszufriedenheit aus der Lage, kurz |
| `r_summary` | Regression: Lebenszufriedenheit aus der Lage, ausführlich |
| `a1` | Aufgabe 1: Zufriedenheit mit der Demokratie aus dem Vertrauen |
| `a1r` | Aufgabe 1: Vorhersage von Hand |
| `a2` | Aufgabe 2: R² vergleichen (pt03, dann id02) |
| `a3` | Aufgabe 3: Residuen je Stufe und Levene-Test |
| `a4` | Aufgabe 4: Gerade und Mittelwerte je Stufe |
| `a4r` | Aufgabe 4: Vorhersage für ganz links |

Kopf des Skripts: „# Sitzung 9: Lineare Regression“, „# Statistikatlas, Methoden Ib, ALLBUS 2023 (ZA8831 v1.3.0), gewichtet mit wghtpew“, „# Markierte Stellen aus dem Atlas stehen hier mit ihrem Beispielwert.“ (wie Sitzung 4). Hinweis im Skript über `a3`: „# Tausch 3.570 und 1.073 gegen Konstante und Steigung aus Aufgabe 1.“

Probier-Werkstätten (`frei_a1` bis `frei_a4`) sind als `tryOut` markiert und stehen nicht im Skript.

---

## 11 Entscheidungen (offene Fragen, die ich selbst entschieden habe)

1. **Leitfrage.** `curriculum.ts` nennt „Was sagt eine Gerade über politische Einstellungen?“. Die Grundlagen nutzen bewusst eine unpolitische Variable (Lebenszufriedenheit), die Aufgaben politische. Vorschlag für `question`: „Wie gut sagt eine Gerade etwas vorher – und für wen liegt sie daneben?“ Bis zur Entscheidung des Dozenten kann `curriculum.ts` bleiben.
2. **Variablen.** Kern der alten Aufgabe bleibt: `demo` (ps03 umgepolt) aus pt03, gewichtet, mit Konstante, Steigung, Vorhersage von Hand, R² und Residuen-Streuung je Stufe (Automat, Faulpelz, „Gleich gut für alle?“). Die Grundlagen nutzen ls01 × ep03 (umgepolt, `lage`): eine Skala mit 11 Stufen, ein deutlicher Zusammenhang (B = 1,073, R² = 0,203) und ein klarer Fächer (SD 2,72 bis 1,27). Keine dieser Variablen kommt in den Aufgaben vor. id02 (A2) und pa01 (A4) stammen aus der Automaten-Parade der alten Aufgabe und tragen ihre beiden Überraschungen „steilste Gerade ist nicht der beste Automat“ und „beide Ränder sind unzufriedener“.
3. **Keine Rolle, kein Automat, keine Besucherprobe.** Spec §2: keine Rollenszenarien. Der Faulpelz-Vergleich lebt als „Mittelwert-Gerade“ in Grundlage 2 weiter (Regler, R²). Die Trefferquote (± 1) der alten Aufgabe entfällt: Sie ist ein eigenes Maß, das R² widersprechen kann, und kostete zu viel Zeit.
4. **Konstruierte Beispiele statt echter Einzelpersonen.** Die alte Eyecatcher-Grafik (`Quadrate.tsx`) zeigte 15 echte Befragte; das widerspricht der Regel „nur Aggregate“. Die acht Befragten (Grundlage 2) sind so gebaut, dass alle Zahlen glatt sind (Schwerpunkt 3 und 7, Gerade 4 + 1 × x, Fehlerquadrate 6 gegen 18, R² 2/3), damit die Idee nicht im Rechnen untergeht. Die Lage-Werte 1 bis 5 und die Zufriedenheit 0 bis 10 passen zum echten Beispiel. Das echte Streudiagramm (B1) zeigt nur gewichtete Zellenzahlen aus `crosstab()`.
5. **Regler mit nur einer Stellschraube.** Der Regler dreht die Gerade um den Schwerpunkt; die Konstante folgt. So gibt es genau ein Minimum, das auf dem Raster liegt (b = 1), und die Kurve der Fehlerquadrate ist symmetrisch (6,75 bei 0,75 und 1,25; 18 bei 0 und 2). Zwei Regler (Höhe und Steigung) wären realistischer, aber für schwache Studierende ein Suchspiel in zwei Richtungen. Dass die beste Gerade durch den Schwerpunkt geht, steht in „Genauer erklärt“.
6. **Jede Vorlage für sich.** Wegen des Rücksetzens vor jedem Lauf polt jede Vorlage ps03 selbst um (Kommentar „umpolen wie in Aufgabe 1“). In A3 und A4 steht `allbus <- allbus %>% mutate(…)`, weil dieselbe Vorlage die neuen Spalten zwei- bzw. dreimal nutzt; A1 und A2 rechnen in einer Kette ohne Speichern. Das Skript prüft jede Vorlage in einer frischen Umgebung nur mit `allbus`.
7. **Konstante und Steigung in A3 von Hand eintragen.** Statt `residuals()` (neu, Zeilenabgleich schwierig) bilden die Studierenden Vorhersage und Residuum mit `mutate()` aus den Zahlen von A1, wie die alte Aufgabe. Startwerte sind die Zahlen aus Grundlage 1 (3.570, 1.073), damit die Vorlage läuft. Weil die SD je Stufe von Konstante und Steigung nicht abhängt, sind a3a, a3b und a3d auch richtig, wenn jemand das Tauschen vergisst; a3c (Mean in Stufe 7) erkennt den Fall (−5,943) und gibt einen gezielten Hinweis. Das ist gewollt: Die Kernaussage (ungleiche Streuung) scheitert nicht am Abtippen.
8. **Levene-Test in der Pflicht.** Sitzungsplan 10 verlangt „Test der Voraussetzungen“; Leitfaden-Tabelle führt `levene_test()` in Sitzung 9. Er steht als dritter Block in derselben Vorlage wie `describe()` und hat eine Frage. Die Grundlage betont, dass bei Tausenden Befragten die Größe der Unterschiede (SD je Stufe) zählt, nicht nur p. Sitzung 7 hat `levene_test()` bewusst ausgelassen, nennt die Faustregel „größte SD mehr als doppelt so groß wie die kleinste“ und kündigt den Levene-Test für Sitzung 9 an; Grundlage 3a und a3d übernehmen genau diese Faustregel (Prüfung 23.11.2026).
9. **Linearität als Zusatz (A4).** Die Pflicht (A1–A3) braucht etwa 40 Minuten. Linearität ist trotzdem in Grundlage 4 (kurz), im Überblick und im Selbsttest; A3c (Mean in Stufe 7) streift sie über den Deckeneffekt.
10. **`summary()` in der Kette** (`… %>% summary()`), wie Sitzung 7 bei `t_test()`, statt `modell <- …; summary(modell)` aus der alten Aufgabe: kein Objekt, das in der nächsten Werkstatt fehlt.
11. **Beta nur so weit wie die alte Aufgabe.** Beta erscheint in R3 (Erklärung, Verwechslung mit B), in Grundlage 2c (mit einer UV gleich r) und als Sonderfall-Rückmeldung in a1b, a2e, a4a. Keine eigene Frage nach Beta.
12. **Zielwerte und Toleranzen.** Koeffizienten, R² und SD mit Toleranz 0,001 (R druckt drei Stellen; „0.06“ für 0,060 wird angenommen). Vorhersagen mit 0,005 (deckt 5,543 aus gerundeten und 5,545 aus ungerundeten Koeffizienten). a3c mit 0,01 (deckt leicht anders gerundete Koeffizienten, etwa 2.29 und 0.47 → −0,442 fällt heraus, wird aber vom allgemeinen Hinweis erfasst). Mehrdeutigkeit „2.288“: Die Antwortprüfung liest zuerst die R-Schreibweise (2,288) und dann die deutsche (2288); nur die erste passt zum Zielwert, darum eindeutig. Ganzzahlig nur N = 3575 (keine Toleranz; „3.575“ wird über die zweite Lesart erkannt). Negative Zielwerte (a3c, a4a): Eingaben mit „-“ und „−“ annehmen.
13. **Weighted N in `describe()`.** Bei `group_by()` + `describe(…, weights = …)` zeigt N die gewichtete Zahl (Stufe 1 von pt03: 329, ungewichtet 362). Die Aufgaben fragen nicht nach diesen N; der Erklärkasten sagt „N ist gewichtet gezählt“.
14. **„..“ in den Gruppenköpfen.** pt03 und pa01 haben nur an den Enden Wertelabels; R zeigt die übrigen Gruppen als „..“. Statt einer Umkodierung (mehr Code) erklären Schritttext und Hilfezeile die Reihenfolge; a3a fragt nach der Stufe mit Nummer.
15. **Bildmodul-Name.** Wie in `sitzung03.md` (Entscheidung 13) Vorschlag `bilder/lp09.py`, damit es nicht mit `RWorkshop/figuren/kap09.py` kollidiert.
16. **Fragetexte.** ps03, pt03, id02, pa01 und ep03 sinngemäß aus Variablenlabels und Antwortstufen, ohne wörtliches Zitat. Vor der Live-Schaltung mit dem Codebuch abgleichen.
17. **Sitzung 6 und 8 noch ohne Plan** (Stand beim Schreiben; überholt, siehe Prüfung: Die Schilder sind inzwischen mit den Plänen von Sitzung 5 bis 8 und 10 abgeglichen). Beim Schreiben lagen nur die Pläne von Sitzung 1 bis 3 vor (Sitzung 5 und 7 nur als R-Skripte). „kennst du aus Sitzung 6“ für Gewicht und Pearson r stützt sich auf `curriculum.ts` und die Funktionstabelle im Leitfaden; „kennst du aus Sitzung 7“ für `summary()` und gleiche Streuung auf `sitzung07-zahlen.R` (`t_test()` mit „Equal variances assumed“). Falls Sitzung 6 kein gewichtetes r von ls01 und ep03 zeigt, bleibt die Aussage „R² = r²“ trotzdem richtig; nur das Schild könnte „kennst du aus Sitzung 6: Pearson r“ allgemein bleiben.

## 12 Abweichungen zu den Folien von Sitzung 9

Für Sitzung 9 (Sitzungsplan 10) gibt es noch keine Folien in `Seminarvorbereitung/` (vorhanden sind nur Sitzung 1 bis 4). Abgeglichen wurde mit dem Sitzungsplan 10: „Was ist ein Regressionsmodell? Ziel?“ (Grundlage 1a, Genauer erklärt „Wozu eine Regression?“), „Voraussetzung und Test der Voraussetzungen“ (Grundlagen 3 und 4, Levene-Test in A3, Überblick Ü2), „Konstante, Regressionskoeffizient, Residuen“ (Grundlagen 1b, 1c, 2a), „R²“ (Grundlage 2c, A2). Wer die Folien baut, sollte `linear_regression(… ) %>% summary()` in derselben Schreibweise und andere Variablen als ps03, pt03, id02 und pa01 verwenden.

---

## 13 Prüfung (Agent, 23.11.2026)

Geprüft nach `teil-b-plan-pruefung.md`, abgeglichen mit den Plänen von Sitzung 5, 6, 7, 8 und 10 (nur gelesen). `Rscript sitzung09-zahlen.R` läuft nach den Änderungen mit Exit 0 (etwa 5 Sekunden), alle Vorlagen stehen wörtlich im Plan.

### Blickwinkel 1: schwache Studentin ohne Vorwissen

Durchgespielt (langsam): A1 etwa 13 Minuten (Festlegen 1, Vorlage 3, Taschenrechner-Schritt 2, sechs Fragen 6), A2 etwa 12 (zwei Läufe 5, sechs Fragen 6), A3 etwa 16 (Vorlage verstehen und Zahlen tauschen 4, sieben Tabellen lesen 3, Levene und Faustregel 2, fünf Fragen 6). Pflicht zusammen etwa 41 Minuten, knapp im Rahmen.

Befunde und Änderungen:
1. Der Begriff „typischer Fehler“ stand nur im zugeklappten „Genauer erklärt“ von 2c, wird aber in A2 (a2c) und im Ziel gebraucht. **Geändert:** in „Kurz gesagt“ von 2c aufgenommen.
2. Der Levene-Test, nach dem a3d fragt, war nur im zugeklappten „Genauer erklärt“ von 3a erklärt. **Geändert:** sichtbarer Absatz „Zwei Wege zu prüfen“ (Größe mit Faustregel, Levene-Test mit „Kurz gesagt“ zu p und „variances unequal“).
3. Die Probier-Idee zu A2 fragte „warum ist ihre Steigung negativ?“, die Vorlage zeigte ohne `summary()` aber kein B. **Geändert:** `%>% summary()` ergänzt (Skript prüft B = −0,746, R² = 0,215, N = 3.593).
4. Schritt 3 von A2 nannte beide Steigungen schon vor den Fragen. **Geändert:** Schritt lenkt jetzt auf den Vergleich (B, dann R² und typischer Fehler), ohne Zahlen.
5. Zeiten an den neuen Absatz angepasst: Grundlage 3 etwa 12 Minuten, A3 etwa 16 Minuten, Pflicht etwa 41 Minuten.

### Blickwinkel 2: Didaktik

Grundlagen führen jeweils direkt in ihre Aufgabe, nutzen andere Variablen (ls01, ep03, konstruierte Beispiele) und verraten keine Zielwerte. Festlegen-Schritte und Deuten-Fragen (a1d, a1e, a2f, a3e, a4e) sind gut. Probier-Werkstätten sind echte Anschlussfragen.

Befunde und Änderungen:
1. Die Schilder „kennst du aus …“ passten nicht überall zu den Nachbarplänen: Die Punktwolke kommt aus Sitzung 6 (Grundlage 4), nicht aus Sitzung 4; Ausreißer aus Sitzung 4 (Boxplot) und 6 (r); „r sieht nur Geraden“ aus Sitzung 6; „Zusammenhang ist keine Ursache“ aus Sitzung 5; die Drittvariable aus Sitzung 6; TNZ: SPLIT aus Sitzung 1; `describe()` aus Sitzung 3. **Geändert:** Hinweis „schon bekannt“, Schilder an 1a, 3a, 3b, 4, Ü3, Rückmeldungen a1d, Karte 4 und Selbsttest 5, „Erklären“ in 1a.
2. a3d fragte nur nach dem Testergebnis. **Geändert:** a3d fragt jetzt, was Test und SD-Werte zusammen zeigen, mit dem Ablenker „gleich, weil nicht mehr als doppelt“; so wird der Unterschied „gibt es einen Unterschied?“ (p) gegen „ist er groß?“ (Faustregel) geübt. Schritt 3 von A3 verweist auf die Faustregel aus Sitzung 7.
3. Grundlage 3a nannte R-Funktionen (`group_by()`, `describe()`). **Geändert:** in Worten beschrieben (kein R-Code in Grundlagen).
4. Sitzung 10 schreibt „In Sitzung 9 stand rechts vom `~` ein Prädiktor“, Sitzung 9 nannte das Wort nicht. **Geändert:** „Prädiktor“ in „Kurz gesagt“ von R2 eingeführt.
5. „Erklärt 35 %“ klingt nach Ursache. **Geändert:** Satz in 2c („Erklärt“ ist ein statistisches Wort) und Ü1 („erklärt statistisch“).

### Blickwinkel 3: Fachliches und Barrierefreiheit

Alle Zahlen gegen die Ausgabe geprüft (Rscript Exit 0). Zielwerte entsprechen der gedruckten Ausgabe (drei Stellen), Toleranzen und deutsche/R-Schreibweise sind in Entscheidung 12 sauber geregelt. Jedes Bild hat eine Textfassung mit Werten, jede Aufgabe ist ohne Grafik lösbar. R-Stil (Reihenfolge der Pakete, `%>%`, `rec()` in `mutate()`, `drop_na()`, `to_label()` in der Kette, keine `ifelse()`) und Sprache (Du-Form, kein „(fiktiv)“, kein „·“) passen. Nur Aggregate; Einzelpunkte sind konstruiert.

Befunde und Änderungen:
1. **Widerspruch zu Sitzung 7:** Sitzung 7 lässt `levene_test()` bewusst aus, gibt die Faustregel „größte SD mehr als doppelt so groß wie die kleinste“ und kündigt den Levene-Test für Sitzung 9 an. 3a nannte „mehr als etwa anderthalbmal“. **Geändert:** Faustregel aus Sitzung 7 übernommen (Schild), Begriff „Varianzhomogenität“ aus Sitzung 7 verknüpft, Levene als „neu heute“. Folge: In A3 liegt das Verhältnis bei 1,86, knapp unter der Faustregel; a3d, a3e („ungenauer“ statt „deutlich ungenauer“) und Hilfe 3 sagen das jetzt ehrlich. Skript prüft beide Verhältnisse (2,14 > 2; 1,86 < 2).
2. „ps03 und pt03 wurden nur einer Hälfte gestellt“ war falsch (1.596 von 5.246 nicht gefragt, also etwa zwei Drittel gefragt). **Geändert:** A1 Schritt 2 und a1f mit TNZ: SPLIT und 1.596.
3. „Mit einer UV ist Beta gleich R“ stimmt nur bei positivem Zusammenhang (A4: Beta −0,193, R 0,193). **Geändert:** B0 und 2c: Beta = r, R = r ohne Vorzeichen.
4. Ausgabe B0 wich von der echten Ausgabe ab (fehlende Zeilen `- Method: ENTER (all predictors)` und „Use to_label() first …“), und „Genauer erklärt“ erklärte ein „(recoded)“, das in der Ausgabe nicht vorkommt. **Geändert:** beide Zeilen ergänzt und erklärt, „(recoded)“ gestrichen; Skript prüft beide Zeilen.
5. A2 verglich Steigungen auf verschiedenen Skalen als „fast gleich steil“. Ein Hauptgrund für das kleine R² der Schicht ist ihre geringe Streuung (SD 0,76 gegen 1,61; 78 % Arbeiter- oder Mittelschicht). **Geändert:** Ziel „pro Stufe fast gleich steil“, Rückmeldung a2f ergänzt; Skript prüft SD und Anteile.
6. Ü2: „unabhängige Befragte … durch die Zufallsstichprobe gegeben“ ist für eine Klumpenstichprobe zu stark; Normalverteilung der Residuen fehlte ganz. **Geändert:** „näherungsweise gegeben“; Zeile „Residuen ungefähr normalverteilt“ mit Verweis auf den zentralen Grenzwertsatz aus Sitzung 7.
7. Häufigkeit „R² von 0,1 bis 0,3 üblich“ auf „mit einer UV häufig“ abgeschwächt.

### Offen gelassen (mit Grund)
- a3a, a3b und a3d sind auch ohne das Tauschen der Zahlen richtig (Entscheidung 7, gewollt); a3c fängt den Fall ab.
- Die Gruppen 2 bis 6 heißen in der Ausgabe „..“; man muss die Tabellen abzählen. Eine Umkodierung wäre mehr Code (Entscheidung 14); Schritttext und Hilfezeilen erklären die Reihenfolge.
- Gewichtete Randsummen in B1 (`crosstab()`: 436 und 377) und in der Textfassung (`describe()`: 435 und 378) weichen um 1 ab (Rundung gewichteter Zahlen). Beide sind echte Ausgaben; der Bauende soll die Tabelle für die Kreise und `describe()` für die Textfassung nehmen.
- Sitzung 10 nennt Beta und Adjusted R Square „neu heute“, obwohl Sitzung 9 sie in R3 kurz zeigt; Sitzung 7 schreibt bei pt03 ebenfalls „eine Hälfte“. Beides betrifft Nachbarpläne, die ich nicht ändere; Hinweis an die Prüfung dort.
- Selbsttest 5 ähnelt Frage p5 aus Sitzung 6 (r = 0,02). Gewollte Wiederholung, jetzt mit Verweis auf Sitzung 6.
- Leitfrage weicht von `curriculum.ts` ab (Entscheidung 1); Entscheidung des Dozenten. Folien für Sitzung 9 gibt es noch nicht.

## Nacharbeit nach Kapitelprüfung (23.11.2026)

1. `touch-action: none` liegt nur noch auf den Griffen (`.s9-griff`), nicht auf dem ganzen Bild; das Ziehen bleibt durch Pointer-Capture erhalten, die Seite lässt sich auf Touch-Geräten über das Bild hinweg scrollen.
2. B1, Zahlenfelder: Leere oder ungültige Eingabe wird ignoriert (kein Setzen auf 0); Komma und Punkt als Dezimalzeichen.
3. B1, Textfassung: Der Satz zur Geraden aus R (4,64 bis 8,94) erscheint erst nach „Gerade festlegen und vergleichen“ (siehe Textfassung B1 oben).
4. B3: Jeder Punkt hat einen unsichtbaren Trefferkreis mit Radius 16 (WCAG 2.5.8, Zielgröße).
5. B4: Das Quadrat für Lage 5 liegt links der Geraden, damit es am rechten Rand nicht abgeschnitten wird.
6. B7: Kein `aria-live` mehr auf der Tabelle; die Ansage übernimmt der unsichtbare Satz.
7. Regel: Die Auflösung der Festlegung („Deine Festlegung vorher …“, „Auflösung: …“) erscheint erst, wenn keine Frage der Aufgabe mehr offen ist.
8. Hinweise „→ In der freien Karte“ sind `MapLink`s mit den Begriffen `linear_regression`, `prediction`, `residuals`, `explained_variance`, `variance_assumption`.
