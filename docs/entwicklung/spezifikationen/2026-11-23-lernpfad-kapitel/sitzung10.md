# Sitzung 10 „Regression vertiefen“: Inhaltsplan für das Kapitel

Stand: 23.11.2026. Teil B des Rollouts (`docs/entwicklung/plaene/2026-11-23-lernpfad-kapitel-rollout.md`, Task 9), nach dem Muster von Sitzung 4 (`prototyp/sitzung4.html`, umgesetzt in `src/chapter/s04/`). Bisherige Aufgabe: `src/tasks/s09-mitgenommen/` („Mitgenommen“, Rollenszenario Doku-Redaktion, entfällt); Konzept `docs/entwicklung/spezifikationen/2026-09-29-lernpfad-aufgaben/sitzung-09.md` (alte Nummerierung). Sitzungsplan 11: „lineare Regressionsanalyse – Vertiefung, Anwendung“. Folien zu dieser Sitzung gibt es noch nicht.

- **Daten:** ALLBUS 2023, ZA8831 v1.3.0, **gewichtet mit `wghtpew`** (wie ab Sitzung 6 und wie die alte Aufgabe). Nur Aggregate. Steine und Punkte mit Einzelwerten sind konstruierte Beispiele („zum Beispiel …“).
- **Zahlen:** Jede Zahl dieses Plans steht in `sitzung10-zahlen.R` (gleicher Ordner) und wird dort gegen die gedruckte Ausgabe von mariposa 0.7.4 geprüft. Das Skript führt jede Vorlage in einer frischen Umgebung aus, in der nur `allbus` existiert (wie die Code-Werkstatt, Nachtrag zum Auftrag), einmal so, wie sie dasteht, und einmal gelöst, und prüft, dass jede Vorlage wörtlich in diesem Plan steht. `Rscript sitzung10-zahlen.R` läuft ohne Fehler.
- **Jede Vorlage läuft für sich:** Jede Vorlage bildet die Variablen, die sie braucht (`demo`, `lage`, `ost` …), in ihrer eigenen Kette mit `mutate()`. Wiederholte Schritte tragen den Kommentar „wie in Aufgabe 1“.
- **Variablen getrennt:** Die Grundlagen nutzen Lebenszufriedenheit (ls01), Alter (age, agec), Gesundheit (hs01), Familienstand (mstat), Erwerbstätigkeit (work) und konstruierte Beispiele. Die Aufgaben nutzen Demokratiezufriedenheit (ps03), eigene und gesamtwirtschaftliche Lage (ep03, ep01, ep04), Herkunft und Wohnort (dg03), Wohngebiet (eastwest), Schulabschluss (educ) und in einer Probier-Werkstatt die Links-rechts-Einstufung (pa01). Keine Variable kommt in beiden vor.
- **Bausteine:** wie Sitzung 4 (`src/chapter/blocks/`, `src/chapter/workshop/`). Daten und Texte gehören in `src/chapter/s10/content.ts`, feste Zielwerte in `allbus.local.test.ts`.
- **Schreibweise in diesem Plan:** Texte in „…“ oder als Absatz sind Volltext fürs Kapitel. `code` bleibt im Kapitel Code. ⟦…⟧ markiert anzupassende Stellen in Vorlagen; die Vorlage läuft auch unverändert.
- **Zahlen in Texten:** deutsch geschrieben (0,461; 3.222). Wo die R-Ausgabe zitiert wird, steht sie in R-Schreibweise (`0.461`). Antwortfelder lesen Eingaben zuerst in R-Schreibweise („4.243“ = 4,243), dann deutsch (siehe Entscheidungen, E9).

---

## 1 Kopf

**Stein:** 10. **Titel:** Regression vertiefen.

**Leitfrage (Begleitfigur):** „Was bleibt von einem Zusammenhang, wenn man mehr berücksichtigt?“

**Wegweiser (drei Kacheln):**
- „Vorweg: R lesen“ – „mehrere Prädiktoren in der Formel, die Ausgabe von summary(), to_dummy()“
- „Vier Themen“ – „je erst die Grundlage, dann die Aufgabe; im Seminar direkt zur Aufgabe springen“
- „Zum Schluss“ – „Überblick, Wichtigstes, Selbsttest, Skript“

**Was du nach dieser Sitzung kannst** (Lernziele, als Liste):
1. eine lineare Regression mit mehreren Prädiktoren rechnen und Gruppen als Dummyvariablen mit einer Referenzgruppe ins Modell nehmen *(Verfahren)*
2. einen Regressionskoeffizienten B in einem Modell mit mehreren Prädiktoren als „bei gleichen Werten der anderen Prädiktoren“ lesen und erklären, warum sich B ändert, wenn ein zweiter Prädiktor dazukommt *(Interpretation)*
3. B einer Dummyvariable als Abstand zur Referenzgruppe lesen und die Konstante als Mittelwert der Referenzgruppe *(Interpretation)*
4. Prädiktoren mit dem standardisierten Koeffizienten Beta vergleichen und R² gegen das korrigierte R² abwägen *(Interpretation)*
5. die Voraussetzungen einer multiplen Regression nennen und prüfen: keine starke Multikollinearität (VIF), keine Dummyfalle, keine einzelnen Fälle mit großem Einfluss, ein Zusammenhang, der für alle gleich gilt oder als Interaktion ins Modell kommt; dazu, was man kontrollieren sollte und was nicht *(Voraussetzungen)*
6. `y ~ x1 + x2` in `linear_regression()` lesen und anpassen, mit `to_dummy()` Dummies bilden, in der Ausgabe von `summary()` Model Summary, Coefficients und Collinearity Statistics finden; `*` für eine Interaktion lesen *(Code lesen)*

**Hinweis „schon bekannt“ (grau):** „Schon bekannt und hier nur kurz erinnert: der Startblock und TNZ: SPLIT (Sitzung 1), `filter()` und dass Codes oft nur Namen sind (Sitzung 2), die Standardabweichung (Sitzung 3), Ketten mit `%>%` und Ausreißer im Boxplot (Sitzung 4), AV und UV, `mutate()` mit `rec()`, `rules = "rev"` zum Umpolen und Dummyvariablen mit 0 und 1 (Sitzung 5), Gewichten mit `weights = wghtpew` und die Drittvariable (Sitzung 6), t-Test, Konfidenzintervall und p-Wert (Sitzung 7), der Index (Sitzung 8), `linear_regression()` mit `summary()`, Prädiktor, Konstante, Steigung B, Beta bei einer UV, Residuum, R², Linearität, Ausreißer und gleiche Fehlervarianz sowie die Variablen `demo` und `lage` (Sitzung 9). Solche Stellen tragen ein graues Schild „kennst du aus Sitzung …“.“

**So arbeitest du mit dieser Seite:** die vier Zeilen wie in Sitzung 4 (Genauer erklärt, Kurz überlegen, Code-Werkstatt, markierte Stellen), unverändert.

**Sprungknöpfe fürs Seminar:** „Im Seminar? Jedes Thema beginnt mit seiner Grundlage zum Vertiefen der Folien. Wer sie schon kann, springt direkt zur Aufgabe:“ Aufgabe 1, Aufgabe 2, Aufgabe 3, Aufgabe 4.

**Hinweis Gewichtung (einmal unter den Sprungknöpfen, klein):** „Alle Zahlen in diesem Kapitel sind gewichtet mit `wghtpew`, genau wie die Ausgabe deiner Vorlagen (kennst du aus Sitzung 6). In der Ausgabe ist N dann die Summe der Gewichte, gerundet, nicht die Zahl der Befragten.“

---

## 2 Themen, Grundlagen, Aufgaben

| Thema | Grundlage (Variablen) | Aufgabe (Variablen) | Art | Zeit |
|---|---|---|---|---|
| 1 Mehrere Prädiktoren: konstant halten | 1a Sind Ältere zufriedener? (ls01 nach Altersgruppe und Gesundheit, hs01), 1b Formel lesen: Vorhersage mit zwei Prädiktoren (ls01 ~ age + gesund), 1c Was „kontrollieren“ heißt | A1 „Eigene Lage oder Lage des Landes?“ (ps03 → demo, ep03 → lage, ep01 → dlage) | **Pflicht** | G 15, A 13 Min. |
| 2 Gruppen als Prädiktoren: Dummyvariablen | 2a Zwei Gruppen als 0/1 (ls01 nach verheiratet ja/nein, mstat), 2b Ein Dummy je Gruppe, eine Referenz (mstat, fünf Gruppen), 2c Die Dummyfalle | A2 „Prägung oder Ort?“ (demo nach dg03, `to_dummy()`, Referenz wechseln) | **Pflicht** | G 12, A 15 Min. |
| 3 Vergleichen und prüfen | 3a Beta (ls01 ~ age + gesund), 3b korrigiertes R² (konstruiert: 30 Befragte, Würfel als Prädiktoren), 3c Multikollinearität (age + agec) | A3 „Was wiegt mehr, und was bleibt von der Ost-West-Lücke?“ (demo ~ lage + dlage + ost + abitur; eastwest, educ) | **Pflicht** | G 15, A 12 Min. |
| 4 Grenzen des Modells | 4a Ausreißer und Einfluss (konstruiert: zwölf Befragte), 4b Interaktion (ls01 ~ erwerb * ab60; work, age) | A4 „Ist die Ost-West-Lücke mit Abitur kleiner?“ (demo ~ ost * abitur) | Zusatz | G 12, A 10 Min. |
| Überblick | Wie kommt eine Variable ins Modell? Was kontrollieren? Voraussetzungen | – | – | 5 Min. |

Pflichtaufgaben zusammen etwa 40 Minuten (langsame Bearbeitung: Vorlage lesen und ausführen etwa 2 Minuten, Ausgabe suchen und je Frage etwa eine Minute, eine Änderung an der Vorlage etwa 2 Minuten). A1 bis A3 nutzen dieselbe abhängige Variable `demo` (wie in Sitzung 9), damit niemand jedes Mal neu verstehen muss, was links vom `~` steht.

---

## 3 Vorweg: R lesen

### Karte R1 „Ein Modell mit mehreren Prädiktoren“ (Schilder: „Startblock: kennst du aus Sitzung 1“, „linear_regression() und summary(): kennst du aus Sitzung 9“, „mehrere Prädiktoren: neu heute“, „Code lesen“)

Text: „Den Startblock kennst du aus Sitzung 1. In RStudio führst du ihn zu Beginn aus. In der Code-Werkstatt hier auf der Seite ist das schon erledigt, und jede Werkstatt beginnt mit dem frisch geladenen `allbus`. Darum bildet jede Vorlage die Variablen, die sie braucht, selbst.“

Vorlage `start` (Kopieren, ohne Ausführen-Knopf wie in Sitzung 4):

```r
# Pakete laden und Daten einlesen
library(tidyverse)
library(mariposa)

allbus <- read_spss("ZA8831_v1-3-0.sav")
```

Hilfezeile: „Rote Zeilen beim Laden, etwa „Attaching core tidyverse packages“, sind normal und kein Fehler. Findet R die Datei nicht, nimm wie in Sitzung 1 `allbus <- read_spss(file.choose())`.“

Text: „In Sitzung 9 stand rechts vom `~` ein Prädiktor. Heute stehen dort mehrere, verbunden mit `+`. So liest du die Formel: links, was vorhergesagt wird, rechts, woraus.“

Zeilenbild (Bausteine wie in Sitzung 4, R1): `ls01` (abhängige Variable: was vorhergesagt wird) | `~` (wird vorhergesagt aus) | `age` (Prädiktor 1) | `+` (und) | `gesund` (Prädiktor 2) | `, weights = wghtpew` (gewichtet, kennst du aus Sitzung 6). Darunter: „Sag die Lebenszufriedenheit aus Alter und Gesundheit vorher, gewichtet.“

Vorlage `r_modell` (Code-Werkstatt, Ausführen):

```r
# Lebenszufriedenheit aus Alter und Gesundheit (gesund umgepolt: höher = gesünder)
allbus %>%
  mutate(
    gesund = rec(hs01, rules = "rev")
  ) %>%
  linear_regression(ls01 ~ age + gesund, weights = wghtpew) %>%
  summary()
```

Text unter der Vorlage: „`hs01` zählt von 1 „sehr gut“ bis 5 „schlecht“. Umgepolt heißt `gesund` 5 „sehr gut“ und 1 „schlecht“, damit eine höhere Zahl „gesünder“ heißt (umpolen kennst du aus Sitzung 5).“

Kurz gesagt: „In der Formel steht links vom `~` die abhängige Variable (AV), rechts stehen die Prädiktoren, verbunden mit `+`. Prädiktor ist ein anderes Wort für unabhängige Variable (Prädiktor kennst du aus Sitzung 9, AV und UV aus Sitzung 5). Jeder Prädiktor bekommt in der Ausgabe eine eigene Zeile mit seinem B.“

Genauer erklärt „Plus in der Formel und Plus bei ggplot“:
- „Das `+` in der Formel heißt „und dieser Prädiktor auch“. Es rechnet nichts zusammen. Mit dem `+` zwischen ggplot-Schichten aus Sitzung 4 hat es nur das Zeichen gemeinsam.“
- „Die Reihenfolge der Prädiktoren ändert an den Zahlen nichts. `ls01 ~ gesund + age` ergibt dieselben B wie `ls01 ~ age + gesund`.“
- „In Aufgabe 4 (Zusatz) kommt `*` statt `+` vor. Das heißt: beide Prädiktoren und dazu ihre Interaktion. Was das ist, steht in Grundlage 4.“
- „Mehr dazu im R-Workshop, Kapitel 9.4 (Multiple lineare Regression).“

Häufige Verwechslung: „Komma statt Plus. `linear_regression(demo ~ lage, dlage, weights = wghtpew)` gibt keinen Fehler, aber R rechnet still das Modell nur mit `lage`. Prüf in der Ausgabe die Zeile „Formula“: Dort muss jeder Prädiktor stehen.“

### Karte R2 „Die Ausgabe von summary() lesen“ (Schilder: „Model Summary, B, Beta, Konstante, Adjusted R Square: kennst du aus Sitzung 9“, „Adjusted R Square wichtig ab heute“, „Collinearity Statistics (VIF): neu heute“, „Im Bild“)

Text: „Die Ausgabe ist lang. Heute brauchst du drei Blöcke. Wähl einen Block und lies, was darin steht.“

**Bild R2 `s10-ausgabe` (interaktive Ausgabe, Monospace-Block mit Hervorhebung, kein SVG):** die Ausgabe der Vorlage `r_modell`, wie R sie druckt:

```

Weighted Linear Regression Results
----------------------------------
- Formula: ls01 ~ age + gesund
- Method: ENTER (all predictors)
- N: 5128
- Weights: wghtpew
- Note: labelled predictors age, gesund entered with their numeric codes, as SPSS REGRESSION does.
  Use to_label() first to enter them as dummy-coded categories.

  Descriptive Statistics
  --------------------------------------
  Variable    Mean  Std. Deviation     N
  --------------------------------------
  ls01       7.407           1.919  5128
  age       52.032          18.212  5128
  gesund     3.573           1.012  5128
  --------------------------------------

  Model Summary
  ----------------------------------
  R                            0.436
  R Square                     0.190
  Adjusted R Square            0.190
  Std. Error of the Estimate   1.728
  ----------------------------------

  ANOVA
  ------------------------------------------------------------------
  Source      Sum of Squares    df  Mean Square        F   Sig.
  ------------------------------------------------------------------
  Regression        3585.593     2     1792.797  600.742  <.001  ***
  Residual         15293.382  5125        2.984
  Total            18878.975  5127
  ------------------------------------------------------------------

  Coefficients
  -------------------------------------------------------------------------------------
  Term             B  Std. Error   Beta       t   Sig.  95% CI Lower  95% CI Upper
  -------------------------------------------------------------------------------------
  (Intercept)  3.095       0.135         22.854  <.001         2.830         3.361  ***
  age          0.024       0.001  0.225  16.931  <.001         0.021         0.026  ***
  gesund       0.861       0.025  0.454  34.124  <.001         0.811         0.910  ***
  -------------------------------------------------------------------------------------

  Collinearity Statistics
  ------------------------
  Term    Tolerance    VIF
  ------------------------
  age         0.893  1.120
  gesund      0.893  1.120
  ------------------------
  VIF > 10 (Tolerance < 0.1) indicates problematic collinearity.
```

(Die Ausgabe steht hier vollständig, ohne die letzte Zeile „Signif. codes“. Im Bild ist der ANOVA-Block blass mit dem Schild „heute nicht nötig“; Descriptive Statistics ebenfalls blass.)

Über dem Block vier Umschalter (`aria-pressed`): „Kopf“, „Model Summary“, „Coefficients“, „Collinearity Statistics“. Ohne Auswahl: keine Hervorhebung, Text „Wähl einen Block.“ Bei Auswahl wird der Block orange umrandet, der Rest blass, darunter (in `aria-live`):
- **Kopf:** „Hier prüfst du, ob R das Richtige gerechnet hat: Formula zeigt das Modell, Weights das Gewicht. N ist bei Gewichtung die Summe der Gewichte, gerundet (Sitzung 6). In das Modell gehen nur Befragte ein, die bei allen Variablen der Formel einen gültigen Wert haben. Die Notiz „labelled predictors age, gesund entered with their numeric codes“ heißt: R rechnet mit den Codes als Zahlen, beim Alter mit den Jahren, bei `gesund` mit 1 bis 5. Bei Jahren und Stufen ist das gewollt. Bei Gruppen ohne Reihenfolge wäre es falsch; dafür gibt es Dummies (Grundlage 2).“
- **Model Summary:** „R Square kennst du aus Sitzung 9: Alter und Gesundheit zusammen erklären 19,0 % der Streuung der Lebenszufriedenheit. Adjusted R Square, das korrigierte R², hast du in Sitzung 9 kurz gesehen: Mit einer UV war es gleich R². Ab heute zählt es, denn es zieht für jeden Prädiktor ein wenig ab (Grundlage 3). Hier sind beide 0.190.“
- **Coefficients:** „Jede Zeile ein Prädiktor. B kennst du aus Sitzung 9. Neu: Jedes B gilt jetzt „bei gleichen Werten der anderen Prädiktoren“ (Grundlage 1). Beta kennst du aus Sitzung 9 als Steigung in Standardabweichungen. Mit mehreren Prädiktoren ist Beta nicht mehr gleich r, sondern dient zum Vergleichen der Prädiktoren (Grundlage 3). Sig. und 95% CI kennst du aus Sitzung 7.“
- **Collinearity Statistics:** „Neu: Der VIF sagt, wie sehr ein Prädiktor schon in den anderen steckt. 1 heißt: gar nicht. Ab 10 meldet mariposa ein Problem. Hier 1.120: kein Problem (Grundlage 3).“

**Textfassung R2:** Die Ausgabe ist echter Text (als `<pre>` mit Überschriften je Block, für Screenreader zusätzlich je Block eine Tabelle). Die vier Erklärungen stehen zusätzlich vollständig in einem zugeklappten `details` „Alle vier Blöcke erklärt“.

Kurz gesagt: „Für ein Modell mit mehreren Prädiktoren liest du drei Blöcke: **Model Summary** (R² und korrigiertes R²), **Coefficients** (B, Beta, Sig., Konfidenzintervall je Prädiktor) und **Collinearity Statistics** (VIF). Im Kopf prüfst du Formel, Gewicht und N.“

Genauer erklärt „Warum N kleiner ist als bei einer Variable allein“: „Im Modell zählt nur, wer bei allen Variablen der Formel einen gültigen Wert hat. Fehlt einer Person die Gesundheit, fällt sie ganz heraus. Darum kann N von Modell zu Modell schwanken, wenn du Prädiktoren hinzunimmst. Das nennt man fallweisen Ausschluss (listwise).“

Häufige Verwechslung: „Descriptive Statistics zeigt Mittelwerte und Standardabweichungen der Variablen, nicht die Ergebnisse des Modells. B und Beta stehen erst unter Coefficients.“

### Karte R3 „Neu: to_dummy()“ (Schilder: „to_dummy(): neu heute“, „Code lesen“)

Text: „`to_dummy()` macht aus einer Variable mit Gruppen für jede Gruppe eine eigene 0/1-Variable. Aus dem Familienstand `mstat` mit fünf Gruppen werden `mstat_1` bis `mstat_5`: Die Zahl hinter dem Unterstrich ist der Code der Gruppe. `mstat_1` ist 1 für alle Verheirateten (Code 1) und 0 für alle anderen. Was das für die Regression bedeutet, zeigt Grundlage 2.“

Vorlage `r_dummy` (Code-Werkstatt):

```r
# Aus dem Familienstand fünf 0/1-Variablen machen, eine davon auszählen
allbus %>%
  to_dummy(mstat) %>%
  frequency(mstat_1, weights = wghtpew)
```

Ausgabe dazu (zur Kontrolle im Text): Zeile `0` mit N 2343 und Valid % 45.01, Zeile `1` mit N 2863 und Valid % 54.99; „System“ 40 (Befragte ohne Familienstand bekommen auch bei den Dummies keinen Wert).

Kurz gesagt: „`to_dummy(mstat)` hängt an die Daten für jede Gruppe eine 0/1-Variable an: 1 heißt „gehört zu dieser Gruppe“, 0 heißt „gehört nicht dazu“. Die Namen sind Variable, Unterstrich, Code.“

Genauer erklärt „to_dummy() in der Kette“: „`to_dummy()` steht direkt in der Kette, ohne `mutate()`, wie `to_label()` aus Sitzung 4. Danach kannst du die neuen Variablen in derselben Kette benutzen, etwa in der Formel von `linear_regression()`. Welcher Code welche Gruppe ist, steht im Codebuch oder in `frequency(mstat)`. Mehr im R-Workshop, Kapitel 9.3 (Dummy-Codierung).“

Häufige Verwechslung: „`mstat_1` heißt nicht „die erste Zeile“ oder „die erste Person“, sondern „Gruppe mit dem Code 1“. Bei `dg03` in Aufgabe 2 ist `dg03_4` die Gruppe mit dem Code 4.“

---

## 4 Thema 1: Mehrere Prädiktoren: konstant halten

### Grundlage 1 „Mehrere Prädiktoren: konstant halten“ (Kopf: „Grundlage zu Aufgabe 1“, Link „Schon klar? Direkt zu Aufgabe 1 ↓“)

Unterzeile: „Was ändert sich, wenn ein zweiter Prädiktor ins Modell kommt? Drei Schritte, etwa 15 Minuten.“

#### Karte 1a „Sind Ältere zufriedener?“ (Schilder: „Kurz überlegen“, „Im Bild“)

Beispiel zuerst: „Der ALLBUS fragt, wie zufrieden man alles in allem mit seinem Leben ist, von 0 bis 10. Bevor du die Daten siehst: Wer ist im Schnitt zufriedener, die Jüngsten (18 bis 29) oder die Ältesten (75 und älter)?“

**Kurz überlegen** (Auswahl, „Festlegen“, danach Bild aufdecken): Optionen „die Jüngsten“, „etwa gleich“, „die Ältesten“. Rückmeldung (für alle Optionen gleich, mit Zitat der Wahl): „Du hast „…“ gewählt. Die Daten: Die Ältesten sind im Schnitt etwas zufriedener, 7,65 gegen 7,15. Spannend wird es, wenn man die Gesundheit dazunimmt.“

**Bild B1 `s10-alter-gesundheit` (interaktiv, zwei Zustände, Umschalter „alle zusammen“ / „getrennt nach Gesundheit“, `aria-pressed`):**
- Liniendiagramm, Leinwand etwa 7,6 × 4,6. x-Achse: fünf Altersgruppen „18–29“, „30–44“, „45–59“, „60–74“, „75+“ (gleiche Abstände). y-Achse: „mittlere Lebenszufriedenheit (0 bis 10)“, Ausschnitt von 4 bis 9, Striche bei 4, 5, 6, 7, 8, 9. Unter der Achse kleiner Hinweis: „Achse beginnt bei 4: Hier werden Linien verglichen, keine Balkenlängen.“
- **Zustand „alle zusammen“:** eine Linie mit Punkten, orange (echte Daten), Werte 7,15 | 7,33 | 7,36 | 7,55 | 7,65, Wert über jedem Punkt. Rechts am Linienende „alle“. Schild am Rand: „von 18–29 bis 75+: +0,50“.
- **Zustand „getrennt nach Gesundheit“:** Die orange Linie bleibt grau gestrichelt stehen (Beschriftung „alle“). Dazu drei Linien mit verschiedenen Punktformen (nicht nur Farbe): „Gesundheit gut“ (sehr gut oder gut; Kreise, Baukasten-Grün) 7,56 | 7,76 | 7,94 | 8,24 | 8,41; „zufriedenstellend“ (Quadrate, Baukasten-Blau) 6,25 | 6,59 | 7,05 | 7,42 | 7,74; „Gesundheit schlecht“ (weniger gut oder schlecht; Dreiecke, Baukasten-Rot) 4,78 | 5,26 | 5,71 | 6,01 | 6,73. Beschriftung am rechten Linienende. Schilder am Rand: „+0,85“, „+1,49“, „+1,95“.
- Unter dem Diagramm (nur im zweiten Zustand) je Altersgruppe ein waagerechter Streifen auf 100 % (Stapel aus drei Abschnitten in denselben Farben und mit Mustern: gut voll, zufriedenstellend schraffiert, schlecht gepunktet), Titel „So gesund ist jede Altersgruppe“: 18–29: 76 | 17 | 7; 30–44: 73 | 19 | 8; 45–59: 57 | 28 | 15; 60–74: 48 | 34 | 18; 75+: 29 | 42 | 29 (Prozent, gerundet nach größten Resten).
- Fußzeile: „ALLBUS 2023, gewichtet, Befragte mit Angaben zu Alter, Gesundheit und Lebenszufriedenheit. Kleinste Gruppe: 18–29 mit schlechter Gesundheit, 46 Befragte.“

**Textfassung B1** (wechselt mit dem Zustand, `aria-live`; als Ganzes auch als Tabelle unter dem Bild): Zustand „alle“: „Mittlere Lebenszufriedenheit nach Altersgruppe: 18 bis 29 Jahre 7,15; 30 bis 44 7,33; 45 bis 59 7,36; 60 bis 74 7,55; 75 und älter 7,65. Von der jüngsten zur ältesten Gruppe steigt sie um 0,50.“ Zustand „getrennt“: „Getrennt nach Gesundheit steigt die Zufriedenheit mit dem Alter in jeder Gruppe stärker. Gute Gesundheit: von 7,56 auf 8,41, plus 0,85. Zufriedenstellend: von 6,25 auf 7,74, plus 1,49. Schlechte Gesundheit: von 4,78 auf 6,73, plus 1,95. Zugleich sind Ältere seltener gesund: Gute Gesundheit haben bei den 18- bis 29-Jährigen 76 Prozent, bei den ab 75-Jährigen 29 Prozent; schlechte Gesundheit 7 gegen 29 Prozent.“

Text unter dem Bild: „So liest du das: In jeder Gesundheitsgruppe sind Ältere deutlich zufriedener als Jüngere. Zusammen sieht man davon nur wenig, weil Ältere öfter krank sind, und Krankheit drückt die Zufriedenheit. Zwei Dinge wirken gegeneinander: das Alter nach oben, die schlechtere Gesundheit nach unten.“

**Kurz überlegen** (Auswahl, „Auflösen“): „Eine Regression mit Alter allein ergibt für das Alter B = 0,008 pro Jahr. Was passiert mit B, wenn die Gesundheit als zweiter Prädiktor ins Modell kommt?“ Optionen: „B wird kleiner“, „B bleibt gleich“, „B wird größer“.
- Ziel: „B wird größer“.
- richtig: „Genau. Mit Gesundheit im Modell ist B für das Alter 0,024, dreimal so groß. Das Modell vergleicht jetzt Ältere und Jüngere mit gleicher Gesundheit, wie die drei farbigen Linien.“
- „kleiner“: „Oft wird ein B kleiner, wenn ein zweiter Prädiktor dazukommt. Hier nicht: Die Gesundheit hat den Alterszusammenhang verdeckt, nicht erklärt. Mit Gesundheit im Modell ist B 0,024.“
- „gleich“: „Gleich bliebe B nur, wenn Alter und Gesundheit nichts miteinander zu tun hätten. Ältere sind aber seltener gesund. B steigt auf 0,024.“

Kurz gesagt: „In einer **multiplen Regression** stehen mehrere Prädiktoren im Modell. Jedes B sagt dann, wie sich die Vorhersage ändert, wenn sich nur dieser Prädiktor um eins erhöht und die anderen gleich bleiben. Das nennt man **konstant halten** oder **kontrollieren**: B für das Alter vergleicht Menschen mit gleicher Gesundheit.“

Genauer erklärt „Warum sich B ändert, und wann nicht“:
- „B ändert sich, wenn der neue Prädiktor mit beiden zusammenhängt: mit dem alten Prädiktor (Ältere sind seltener gesund) und mit der abhängigen Variable (Gesündere sind zufriedener).“
- „Hier hat die Gesundheit den Zusammenhang **verdeckt**: B steigt. Häufiger ist der umgekehrte Fall: Ein Teil des Zusammenhangs gehört eigentlich zum neuen Prädiktor, und B wird kleiner. Welcher Fall in Aufgabe 1 eintritt, findest du dort selbst heraus.“
- „Hängt der neue Prädiktor mit dem alten gar nicht zusammen, bleibt B fast gleich. Dann steigt nur R².“
- „R² steigt hier von 0,006 (Alter allein) auf 0,190. Die Gesundheit erklärt viel mehr von der Lebenszufriedenheit als das Alter.“
- „Eine Feinheit: Alter allein rechnet R mit 5.142 Befragten (gewichtet), mit Gesundheit mit 5.128, weil einige keine Gesundheitsangabe haben. Bei so wenigen Fehlenden ändert das die Zahlen kaum.“

Häufige Verwechslung: „„Mit Gesundheit im Modell“ heißt nicht, dass die Gesundheit aus den Daten entfernt wird. Alle Befragten bleiben drin. Das Modell rechnet nur so, als hätten alle dieselbe Gesundheit.“

#### Karte 1b „Formel lesen lernen: Vorhersage mit zwei Prädiktoren“ (Schilder: „Vorhersage: kennst du aus Sitzung 9“, „Im Bild“)

Beispiel zuerst: „Das Modell aus Alter und Gesundheit macht für jede Person eine Vorhersage. Nimm zwei Personen, zum Beispiel: Frau A ist 40 Jahre alt, Herr B ist 50, beide schätzen ihre Gesundheit als „gut“ ein (gesund = 4).“

**Bild B2 `s10-formel-zwei` (Formel als Bausteine, statisch, wie die Formel in Sitzung 4, 1b):**
- Obere Reihe Bausteine: „Vorhersage“ = „Konstante 3,095“ + „B Alter 0,024“ × „Alter“ + „B Gesundheit 0,861“ × „Gesundheit“. Unter den Bausteinen kleine Unterschriften: „Startwert“, „pro Jahr“, „pro Stufe“.
- Zweite Reihe (Frau A): 3,095 + 0,024 × 40 + 0,861 × 4 = 3,095 + 0,96 + 3,444 = 7,50.
- Dritte Reihe (Herr B): 3,095 + 0,024 × **50** + 0,861 × 4 = 3,095 + **1,20** + 3,444 = 7,74. Die geänderte Zahl ist orange umrandet, die gleich gebliebene Gesundheit grau.
- Rechts eine Klammer über beiden Ergebnissen: „Unterschied 0,24 = 10 Jahre × 0,024“.
- Farben: Konstante grau, Alter Baukasten-Blau, Gesundheit Baukasten-Grün, Ergebnis orange.

**Textfassung B2:** „Vorhersage gleich Konstante 3,095 plus 0,024 mal Alter plus 0,861 mal Gesundheit. Frau A, 40 Jahre, Gesundheit 4: 3,095 plus 0,96 plus 3,444 ergibt 7,50. Herr B, 50 Jahre, Gesundheit 4: 3,095 plus 1,20 plus 3,444 ergibt 7,74. Weil die Gesundheit gleich ist, kommt der Unterschied von 0,24 nur vom Alter: 10 Jahre mal 0,024.“

Text: „Von links nach rechts gelesen: Starte bei der Konstante, leg für jedes Jahr 0,024 dazu und für jede Gesundheitsstufe 0,861. Vergleichst du zwei Personen, die sich nur in einem Prädiktor unterscheiden, fällt alles andere weg. Genau das ist „konstant halten“.“

**Kurz überlegen** (Zahlenfeld, „Prüfen“): „Zwei Personen sind gleich alt. Eine schätzt ihre Gesundheit „sehr gut“ ein (gesund = 5), die andere „zufriedenstellend“ (gesund = 3). Um wie viel liegt die Vorhersage der ersten höher?“ Hilfezeile: „Eine Kommazahl reicht, zum Beispiel 0,5.“
- Ziel 1,722, Toleranz 0,01.
- richtig: „1,722: zwei Stufen mal 0,861. Das Alter fällt weg, weil es bei beiden gleich ist.“
- falsch: „Die beiden unterscheiden sich um zwei Gesundheitsstufen (5 minus 3). Jede Stufe bringt 0,861.“
- Sonderfall 0,861 (± 0,01): „Das ist eine Stufe. Von 3 bis 5 sind es zwei.“

Kurz gesagt: „Die **Vorhersage** einer multiplen Regression ist Konstante plus jedes B mal seinem Wert. Unterscheiden sich zwei Personen nur in einem Prädiktor, ist ihr Unterschied genau dieses B mal den Unterschied im Prädiktor.“

Genauer erklärt „Was die Konstante hier heißt“: „Die Konstante 3,095 ist die Vorhersage für Alter 0 und Gesundheit 0. Beides gibt es nicht (gesund reicht von 1 bis 5). Die Konstante ist hier nur der Startwert der Rechnung, keine Aussage über Menschen. Das kennst du aus Sitzung 9. Bei Dummies (Grundlage 2) bekommt sie wieder eine Bedeutung.“

Häufige Verwechslung: „B der Gesundheit (0,861) ist viel größer als B des Alters (0,024). Das heißt nicht, dass die Gesundheit 36-mal so wichtig ist: Ein Jahr ist ein viel kleinerer Schritt als eine Gesundheitsstufe. Wie man fair vergleicht, zeigt Grundlage 3.“

#### Karte 1c „Was kontrollieren heißt, und was nicht“ (Schilder: „Drittvariable: kennst du aus Sitzung 6“, „Kurz überlegen“)

Beispiel zuerst: „Zwei Zahlen für das Alter: 0,008 (ohne Gesundheit) und 0,024 (mit Gesundheit). Welche stimmt?“

**Kurz überlegen** (Auswahl, „Auflösen“): „Eine Journalistin fragt: „Unterscheiden sich Ältere und Jüngere mit gleicher Gesundheit in ihrer Lebenszufriedenheit?“ Welche Zahl beantwortet genau diese Frage?“ Optionen: „0,008 pro Jahr“, „0,024 pro Jahr“, „keine von beiden“.
- Ziel: „0,024 pro Jahr“.
- richtig: „Genau. 0,024 vergleicht Menschen mit gleicher Gesundheit. 0,008 beantwortet eine andere Frage: Wie unterscheiden sich Ältere und Jüngere insgesamt, so wie sie sind, mit ihrer Gesundheit?“
- „0,008“: „0,008 vergleicht Ältere und Jüngere insgesamt, so wie sie sind, also auch mit ihrer schlechteren Gesundheit. Für „bei gleicher Gesundheit“ brauchst du das Modell mit Gesundheit: 0,024.“
- „keine“: „Beide beantworten eine Frage, nur verschiedene. „Bei gleicher Gesundheit“ ist das Modell mit Gesundheit: 0,024.“

Kurz gesagt: „Beide B stimmen. Sie beantworten verschiedene Fragen. Ohne Kontrolle: Wie unterscheiden sich die Gruppen insgesamt? Mit Kontrolle: Wie unterscheiden sie sich, wenn der kontrollierte Prädiktor gleich ist? Sag beim Berichten immer dazu, was konstant gehalten wurde.“

Genauer erklärt „Was man kontrollieren sollte“:
- „Gut zum Kontrollieren sind **gemeinsame Ursachen** (Fachbegriff: Confounder; die Drittvariable aus Sitzung 6): Dinge, die vor beiden Variablen feststehen und beide beeinflussen können, etwa Geschlecht oder wo jemand aufgewachsen ist.“
- „Vorsicht bei **Folgen**: Die Gesundheit ist zum Teil eine Folge des Alters. Wer sie kontrolliert, fragt nach dem Alter „ohne den Weg über die Gesundheit“. Das ist eine berechtigte Frage, aber nicht dieselbe wie „Wie hängt das Alter mit der Zufriedenheit zusammen?“.“
- „Nicht kontrollieren solltest du etwas, das sehr Ähnliches misst wie die abhängige Variable oder eher ihre Folge ist. Dann rechnest du einen Teil dessen heraus, was du eigentlich verstehen willst.“
- „Eine Regression zeigt Zusammenhänge. Auch mit vielen Kontrollen beweist sie keine Ursache: Es kann immer etwas fehlen, das man nicht gemessen hat.“

Häufige Verwechslung: „„Kontrolliert für Gesundheit“ heißt nicht „Gesundheit spielt keine Rolle“. Es heißt: Der Zusammenhang des Alters ist so berechnet, als wären alle gleich gesund. Die Gesundheit selbst hat ihr eigenes, großes B.“

Link: „→ In der freien Karte: Confounding und gemeinsame Ursachen“ (Begriff `confounding`).

### Aufgabe 1 „Eigene Lage oder Lage des Landes?“ (Pflicht)

Link „↑ Grundlage 1 nachlesen“.

Leitfrage: „Hängt die Zufriedenheit mit der Demokratie an der eigenen wirtschaftlichen Lage, oder daran, wie man die Lage in Deutschland sieht?“

Ziel: „Am Ende kannst du sagen, wie stark die eigene wirtschaftliche Lage mit der Demokratiezufriedenheit zusammenhängt, einmal allein und einmal bei gleicher Einschätzung der Lage Deutschlands, und erklären, warum sich die Zahl ändert.“

Grundlage: „Grundlage 1, Mehrere Prädiktoren: konstant halten“.

Einleitung: „Der ALLBUS fragt, wie zufrieden man mit der Demokratie in Deutschland ist (ps03), wie man die eigene wirtschaftliche Lage einschätzt (ep03) und wie die wirtschaftliche Lage in Deutschland (ep01). Alle drei zählen von „sehr gut“ oder „sehr zufrieden“ nach unten. Die Vorlage polt sie um, damit eine höhere Zahl „zufriedener“ bzw. „besser“ heißt: `demo` reicht dann von 1 (sehr unzufrieden) bis 6 (sehr zufrieden), `lage` und `dlage` von 1 (sehr schlecht) bis 5 (sehr gut). Die Demokratiefrage haben nur etwa zwei Drittel der Befragten bekommen; die anderen haben TNZ: SPLIT (kennst du aus Sitzung 1).“

**Erst festlegen** (Auswahl, „Tipp abgeben“; wird beim Prüfen zitiert): „Was passiert mit dem B der eigenen Lage, wenn die Lage Deutschlands als zweiter Prädiktor dazukommt?“ Optionen: „wird deutlich kleiner“, „bleibt etwa gleich“, „wird größer“. Rückmeldung beim Festlegen: „Festgelegt: … Die Auflösung bekommst du, wenn du am Ende der Aufgabe deine Antworten prüfst.“

Text: „Arbeite in der Code-Werkstatt direkt hier oder in RStudio. In RStudio führst du vorher den Startblock aus „R lesen“ aus.“

**Schritte:**

1. „Führe die Vorlage aus. Sie sagt die Demokratiezufriedenheit aus der eigenen Lage vorher. Lies unter Coefficients das B von `lage` und unter Model Summary R Square.“ Schilder „rec() mit rules = "rev": kennst du aus Sitzung 5“, „demo und lage, linear_regression(): kennst du aus Sitzung 9“.

```r
# Demokratiezufriedenheit aus der eigenen wirtschaftlichen Lage
# umgepolt, damit höher = zufriedener bzw. besser (dlage brauchst du in Schritt 2)
allbus %>%
  mutate(
    demo  = rec(ps03, rules = "rev"),
    lage  = rec(ep03, rules = "rev"),
    dlage = rec(ep01, rules = "rev")
  ) %>%
  linear_regression(demo ~ ⟦lage⟧, weights = wghtpew) %>%
  summary()
```

   Markierte Stellen (Liste für Screenreader): „Zeile 9: `lage` in der Formel, in Schritt 2 ergänzen.“

2. „Nimm die Lage Deutschlands dazu: Schreib in der Formel hinter `lage` noch ` + dlage`, sodass dort `demo ~ lage + dlage` steht, und führe die Vorlage erneut aus. Lies wieder B von `lage`, dazu B von `dlage` und R Square.“ Hilfezeile: „Prüf in der Ausgabe die Zeile „Formula“: Dort muss `demo ~ lage + dlage` stehen.“

   **Bild zum Schritt B3 `s10-formel-waechst` (statisch, Bausteine, keine Ergebnisse):** zwei Zeilen untereinander. Oben: Bausteine `demo` `~` `lage`, darunter Schild „B von lage: Wie hängt die eigene Lage mit der Zufriedenheit zusammen?“. Unten: Bausteine `demo` `~` `lage` `+` `dlage` (dlage orange umrandet als „neu“), darunter Schild „B von lage: … bei gleicher Einschätzung der Lage Deutschlands“. Pfeil von oben nach unten: „ein Prädiktor mehr“.
   Textfassung B3: „Oben das Modell demo aus lage. Sein B beantwortet: Wie hängt die eigene Lage mit der Zufriedenheit zusammen? Unten das Modell demo aus lage plus dlage. Jetzt beantwortet B von lage: Wie hängt die eigene Lage mit der Zufriedenheit zusammen, wenn die Einschätzung der Lage Deutschlands gleich ist?“

3. „Deuten: Vergleiche die beiden B von `lage`. Was heißt die neue Zahl, und warum ist sie anders? (Fragen a1e und a1f unten)“

**Weiterdenken in der Probier-Werkstatt (für die Aufgabe nicht nötig),** zugeklappt: „Für die Aufgabe reichen die Vorlagen oben. Hier ist Platz für eigene Fragen. Eine Idee: Spielt auch die erwartete Lage Deutschlands in einem Jahr (ep04) eine Rolle? Die Probier-Werkstatt startet mit einem Vorschlag.“

```r
# Eine Idee: Kommt die erwartete Lage Deutschlands in einem Jahr noch dazu?
# demo, lage und dlage wie in Aufgabe 1, dazu zukunft (ep04 umgepolt: höher = besser)
allbus %>%
  mutate(
    demo    = rec(ps03, rules = "rev"),
    lage    = rec(ep03, rules = "rev"),
    dlage   = rec(ep01, rules = "rev"),
    zukunft = rec(ep04, rules = "rev")
  ) %>%
  linear_regression(demo ~ lage + dlage + zukunft, weights = wghtpew) %>%
  summary()
```

(Zur Information für den Plan, nicht im Kapitel: B lage 0,188, dlage 0,561, zukunft 0,312; R² 0,270, korrigiert 0,269; N 3.565.)

**Antwortfragen** („Antworten prüfen“, Rückmeldung je Frage mit ✓/✗ und Text, am Ende „Deine Festlegung vorher war: …“ und die Auflösung: „B der eigenen Lage fällt von 0,461 auf 0,198, also auf weniger als die Hälfte.“):

| id | Art | Label | Optionen | Ziel | Toleranz | Text richtig | Text falsch / Hinweis | Hilfezeile |
|---|---|---|---|---|---|---|---|---|
| a1a | number | Modell nur mit `lage`: Wie groß ist B von `lage`? | – | 0.461 | 0.005 | 0,461: Pro Stufe bessere eigene Lage sagt das Modell 0,46 Punkte mehr Demokratiezufriedenheit voraus. | Lies unter Coefficients in der Zeile `lage` die Spalte B. Sonderfall 2,5 (± 0,005): Das ist die Konstante (Intercept). Sonderfall 0,29 (± 0,005): Das ist Beta, gefragt ist B. | Aus Schritt 1, Spalte B. |
| a1b | number | Modell mit `lage + dlage`: Wie groß ist B von `lage` jetzt? | – | 0.198 | 0.005 | 0,198: weniger als halb so viel wie allein. | Hast du `+ dlage` ergänzt? In der Zeile „Formula“ muss `demo ~ lage + dlage` stehen. Sonderfall 0,461: Das ist noch das Modell aus Schritt 1. | Aus Schritt 2, Zeile `lage`, Spalte B. |
| a1c | number | Modell mit `lage + dlage`: Wie groß ist B von `dlage`? | – | 0.668 | 0.005 | 0,668: Pro Stufe bessere Einschätzung der Lage Deutschlands 0,67 Punkte mehr, bei gleicher eigener Lage. | Lies die Zeile `dlage`, Spalte B. Sonderfall 0,415 (± 0,005): Das ist Beta. | – |
| a1d | number | Wie groß ist R Square im Modell mit beiden Prädiktoren? | – | 0.228 | 0.005 | 0,228: Beide zusammen erklären knapp 23 % der Streuung, die eigene Lage allein 8,4 %. | Lies unter Model Summary die Zeile R Square. Sonderfall 0,084: Das ist das Modell aus Schritt 1. | – |
| a1e | choice | Was heißt B = 0,198 für `lage` im Modell mit beiden? | gleich: „Bei gleicher Einschätzung der Lage Deutschlands geht eine Stufe bessere eigene Lage mit 0,2 Punkten mehr Demokratiezufriedenheit einher.“; prozent: „Die eigene Lage erklärt 19,8 % der Demokratiezufriedenheit.“; macht: „Wer seine eigene Lage um eine Stufe verbessert, wird dadurch 0,2 Punkte zufriedener mit der Demokratie.“ | gleich | – | Genau: B gilt bei gleichem Wert des anderen Prädiktors. | bei „prozent“: B ist keine Prozentzahl. Wie viel erklärt wird, sagt R², und das für das ganze Modell. Bei „macht“: Die Regression vergleicht Menschen, sie zeigt nicht, was passiert, wenn sich eine Person verändert. „Dadurch“ behauptet eine Ursache. | – |
| a1f | choice | Warum ist B von `lage` mit `dlage` im Modell kleiner? | zusammen: „Wer die eigene Lage gut einschätzt, sieht meist auch die Lage Deutschlands besser. Ein Teil des ersten B gehörte zur Einschätzung der Lage Deutschlands.“; r2: „Weil R² größer geworden ist.“; weniger: „Weil im zweiten Modell weniger Befragte sind.“ | zusammen | – | Genau. Die beiden Einschätzungen hängen zusammen. Hält man die Lage Deutschlands gleich, bleibt für die eigene Lage nur noch 0,198. | bei „r2“: R² steigt, weil `dlage` viel erklärt. Das ändert aber nicht von selbst B von `lage`; B ändert sich, weil die beiden Prädiktoren zusammenhängen. Bei „weniger“: N sinkt nur von 3.603 auf 3.589 (gewichtet). Das erklärt keinen Sprung von 0,461 auf 0,198. | – |

**Hilfe, Stufe 1: Denkanstoß:** „Im ersten Modell steckt in B von `lage` alles, was mit der eigenen Lage zusammenhängt, auch die Einschätzung des Landes, die oft mitläuft. Im zweiten Modell hat die Lage Deutschlands ihre eigene Zeile. B von `lage` gilt jetzt bei gleicher Einschätzung des Landes.“

**Hilfe, Stufe 2: Wo schaue ich?:** „B steht unter Coefficients in der Spalte B, in der Zeile der Variable. R Square steht unter Model Summary. Für Schritt 2 änderst du nur die Formel: `demo ~ lage + dlage`. Die Variable `dlage` bildet die Vorlage schon in `mutate()`.“

**Hilfe, Stufe 3: Lösung:** „Schritt 1: B von `lage` 0,461, R² 0,084. Schritt 2 mit `demo ~ lage + dlage`: B von `lage` 0,198, B von `dlage` 0,668, R² 0,228. Richtig ist der Satz „Bei gleicher Einschätzung der Lage Deutschlands geht eine Stufe bessere eigene Lage mit 0,2 Punkten mehr Demokratiezufriedenheit einher.“ B wird kleiner, weil die beiden Einschätzungen zusammenhängen.“

**Ohne Grafik lösbar:** „Diese Aufgabe braucht keine Grafik. Alle Zahlen stehen in der Ausgabe von `summary()` unter Coefficients und Model Summary.“

---

## 5 Thema 2: Gruppen als Prädiktoren: Dummyvariablen

### Grundlage 2 „Gruppen als Prädiktoren: Dummyvariablen“ (Kopf: „Grundlage zu Aufgabe 2“, „Schon klar? Direkt zu Aufgabe 2 ↓“)

Unterzeile: „Wie kommen Gruppen wie der Familienstand in eine Regression? Drei Schritte, etwa 12 Minuten.“

#### Karte 2a „Zwei Gruppen: eine 0/1-Variable“ (Schilder: „Dummyvariable mit 0 und 1: kennst du aus Sitzung 5“, „Mittelwertvergleich: kennst du aus Sitzung 7“, „Im Bild“)

Beispiel zuerst: „Sind Verheiratete zufriedener mit ihrem Leben? Teil die Befragten in zwei Gruppen: verheiratet und zusammenlebend (1) und alle anderen (0). Eine solche Variable mit nur 0 und 1 heißt Dummyvariable. Im Modell `ls01 ~ verheiratet` rechnet R: Konstante 7,042, B 0,652.“

**Bild B4 `s10-zwei-gruppen` (statisch):**
- Zwei Stapel nebeneinander (Steinoptik, Baukasten-Blau), Höhe = Mittelwert auf einer y-Achse von 0 bis 10 (Striche bei 0, 2, 4, 6, 8, 10). Links „0: nicht verheiratet“ mit Wert 7,04 über dem Stapel; rechts „1: verheiratet“ mit 7,69.
- Waagerechte gestrichelte graue Linie auf Höhe 7,042 über beide Stapel, beschriftet „Konstante 7,042 = Mittelwert der Gruppe 0“.
- Zwischen der Linie und der Oberkante des rechten Stapels ein oranger Doppelpfeil, beschriftet „B = 0,652: Abstand der Gruppe 1 zur Gruppe 0“.
- Fußzeile: „ALLBUS 2023, gewichtet; Lebenszufriedenheit 0 bis 10.“

**Textfassung B4:** „Zwei Stapel: nicht verheiratet, Code 0, mittlere Lebenszufriedenheit 7,04; verheiratet, Code 1, 7,69. Die Konstante 7,042 ist der Mittelwert der Gruppe mit 0. B gleich 0,652 ist der Abstand der Verheirateten dazu.“

**Kurz überlegen** (Zahlenfeld, „Prüfen“): „Welche mittlere Lebenszufriedenheit sagt das Modell für die Verheirateten voraus?“ Hilfezeile: „Konstante plus B. Eine Kommazahl reicht.“
- Ziel 7,694, Toleranz 0,01.
- richtig: „7,694: 7,042 plus 0,652. Das ist genau der Mittelwert der Verheirateten (gerundet 7,69).“
- falsch: „Für die Verheirateten ist die Dummyvariable 1. Rechne Konstante plus B mal 1.“
- Sonderfall 0,652: „Das ist nur der Abstand. Die Vorhersage ist Konstante plus Abstand.“

Kurz gesagt: „Eine **Dummyvariable** ist 1 für eine Gruppe und 0 für alle anderen. Im Modell ist die **Konstante** der Mittelwert der Gruppe mit 0, und **B** ist der Abstand der Gruppe mit 1 zu ihr.“

Genauer erklärt „Dasselbe wie ein Mittelwertvergleich“: „Mit nur einer Dummyvariable im Modell ist B genau der Unterschied der beiden Gruppenmittelwerte, den du in Sitzung 7 mit dem t-Test geprüft hast. Der Vorteil der Regression: Du kannst weitere Prädiktoren dazunehmen und den Abstand bei gleichem Alter oder gleicher Gesundheit berechnen.“

Häufige Verwechslung: „Bei einer Dummyvariable ist „eine Stufe mehr“ der ganze Schritt von der einen Gruppe zur anderen. B = 0,652 heißt nicht „ein bisschen verheirateter“.“

#### Karte 2b „Mehr als zwei Gruppen: ein Dummy je Gruppe, eine bleibt draußen“ (Schilder: „Im Bild“, „Ausprobieren“)

Beispiel zuerst: „Der Familienstand hat fünf Gruppen: verheiratet (1), verheiratet getrennt lebend (2), verwitwet (3), geschieden (4), ledig (5). Die Codes 1 bis 5 sind nur Namen, keine Stufen. „Geschieden“ ist nicht „doppelt so viel“ wie „getrennt lebend“. Darum bekommt jede Gruppe ihre eigene 0/1-Variable.“

**Bild B5 `s10-dummy-tabelle` (Tabelle mit hervorgehobenen Zellen, echte HTML-Tabelle mit `<caption>`):** „Fünf Befragte, zum Beispiel“. Spalten: Person | mstat (Code und Wort) | mstat_1 | mstat_2 | mstat_3 | mstat_4 | mstat_5. Zeilen:
- A | 1 verheiratet | **1** | 0 | 0 | 0 | 0
- B | 5 ledig | 0 | 0 | 0 | 0 | **1**
- C | 3 verwitwet | 0 | 0 | **1** | 0 | 0
- D | 4 geschieden | 0 | 0 | 0 | **1** | 0
- E | 2 getrennt lebend | 0 | **1** | 0 | 0 | 0
Die Einsen sind orange hinterlegt. Die Spalte mstat_5 ist grau schraffiert mit Überschrift-Schild „bleibt draußen: Referenz“. Unter der Tabelle: „In jeder Zeile steht genau eine 1. Wer in mstat_1 bis mstat_4 überall 0 hat, ist ledig. Die fünfte Spalte verrät nichts Neues.“

**Textfassung B5:** die Tabelle selbst (echte `<table>`, Spaltenköpfe `scope="col"`), dazu der Satz unter der Tabelle.

Text: „Ins Modell kommen nur vier der fünf Dummies. Die Gruppe, die draußen bleibt, heißt **Referenzgruppe**. Ihr Mittelwert ist die Konstante, und jedes B ist der Abstand einer Gruppe zur Referenz. Welche Gruppe die Referenz ist, entscheidest du. Probier es aus.“

**Bild/Interaktion B6 `s10-referenz` (interaktiv, fünf Umschalter „Referenz: verheiratet“, „… getrennt lebend“, „… verwitwet“, „… geschieden“, „… ledig“, `aria-pressed`; Start: „ledig“):**
- Diagramm mit fünf Säulen-Positionen (x: die fünf Gruppen in Code-Reihenfolge), y-Achse „Lebenszufriedenheit“ von 6 bis 8 (Striche bei 6,0; 6,5; 7,0; 7,5; 8,0; Hinweis „Ausschnitt“).
- Die Referenzgruppe: waagerechte graue Linie über die ganze Breite auf Höhe ihres Mittelwerts, beschriftet „Konstante = … (Referenz)“. Bei der Referenzgruppe selbst ein Punkt auf der Linie mit „Referenz“.
- Jede andere Gruppe: ein Pfeil (orange) von der Referenzlinie zu ihrem Mittelwert, beschriftet mit B (mit Vorzeichen). Am Pfeilende ein Punkt mit dem vorhergesagten Wert (grau, klein).
- Daneben eine kleine Tabelle „Coefficients“ mit Konstante und vier B, wie R sie ausgibt, und darunter in fester Zeile „Vorhersagen (bleiben gleich): verheiratet 7,695 | getrennt lebend 6,610 | verwitwet 7,233 | geschieden 6,983 | ledig 7,042“.
- Werte je Referenz (Konstante; B in der Reihenfolge verheiratet, getrennt lebend, verwitwet, geschieden, ledig, die Referenz entfällt):
  - Referenz verheiratet: 7,695; –; −1,085; −0,462; −0,712; −0,653
  - Referenz getrennt lebend: 6,610; 1,085; –; 0,623; 0,373; 0,432
  - Referenz verwitwet: 7,233; 0,462; −0,623; –; −0,250; −0,191
  - Referenz geschieden: 6,983; 0,712; −0,373; 0,250; –; 0,059
  - Referenz ledig: 7,042; 0,653; −0,432; 0,191; −0,059; –
- R² in allen fünf Fällen 0,030.
- Kleine Fußnote unter der Tabelle: „Rechnest du mit den gerundeten Zahlen nach, kann die dritte Stelle um 1 abweichen (in 2a: 7,042 + 0,652 = 7,694, hier 7,695). Dass die Ledigen hier dieselbe Konstante 7,042 haben wie in 2a alle Nicht-Verheirateten zusammen, ist Zufall: Die beiden Mittelwerte unterscheiden sich erst in der vierten Stelle.“

**Textfassung B6** (wechselt mit der Wahl, `aria-live`), Beispiel für „Referenz ledig“: „Referenz: ledig. Konstante 7,042, das ist die mittlere Lebenszufriedenheit der Ledigen. Abstände: verheiratet plus 0,653, getrennt lebend minus 0,432, verwitwet plus 0,191, geschieden minus 0,059. Die Vorhersagen für die fünf Gruppen bleiben bei jeder Referenz gleich: verheiratet 7,695, getrennt lebend 6,610, verwitwet 7,233, geschieden 6,983, ledig 7,042.“ Für die anderen Referenzen nach demselben Muster mit den Werten oben.

**Kurz überlegen** (Zahlenfeld, „Prüfen“, steht unter der Interaktion): „Stell die Referenz auf „verheiratet“. Wie groß ist dann B für die Ledigen?“
- Ziel −0,653, Toleranz 0,005.
- richtig: „−0,653: Ledige liegen 0,653 Punkte unter den Verheirateten. Mit der Referenz „ledig“ stand dort +0,653 für die Verheirateten: derselbe Abstand, nur von der anderen Seite.“
- falsch: „Mit der Referenz „verheiratet“ ist jedes B der Abstand zu den Verheirateten. Ledige sind weniger zufrieden, das B ist also negativ.“
- Sonderfall 0,653 (positiv): „Das Vorzeichen fehlt: Ledige liegen unter den Verheirateten.“

Kurz gesagt: „Eine Variable mit k Gruppen kommt als **k − 1 Dummies** ins Modell. Die weggelassene Gruppe ist die **Referenzgruppe**: Die Konstante ist ihr Mittelwert, jedes B der Abstand einer Gruppe zu ihr. Andere Referenz, andere B, aber dieselben Vorhersagen.“

Genauer erklärt „Welche Referenz wählen?“:
- „Nimm als Referenz die Gruppe, mit der du vergleichen willst. Oft ist das die größte Gruppe oder eine, die man als „normal“ ansieht. Sag im Bericht immer, welche Gruppe die Referenz ist.“
- „Eine sehr kleine Referenzgruppe ist ungünstig: Ihr Mittelwert ist unsicher, und damit werden alle B unsicher. Mit „getrennt lebend“ (85 Befragte gewichtet) als Referenz sind die Konfidenzintervalle viel breiter als mit „verheiratet“ (2.823).“
- „Signifikanz gilt immer für den Abstand zur Referenz. „Geschieden ist nicht signifikant“ heißt nur: nicht deutlich anders als die Referenz.“
- „Es gibt eine Abkürzung: Mit `to_label(mstat)` vor `linear_regression()` macht R die Dummies selbst und nimmt die erste Gruppe als Referenz. Darauf weist die Notiz „Use to_label() first …“ in der Ausgabe hin. Heute nutzt du `to_dummy()`, weil du dann selbst siehst und wählst, wer die Referenz ist.“

Häufige Verwechslung: „B eines Dummys ist nicht der Mittelwert der Gruppe, sondern ihr Abstand zur Referenz. Der Mittelwert ist Konstante plus B.“

#### Karte 2c „Die Dummyfalle, und warum die Codes nicht als Zahl ins Modell gehören“ (Schilder: „Kurz überlegen“)

Beispiel zuerst: „Was passiert, wenn du alle fünf Dummies ins Modell nimmst? R meldet: „ℹ Excluded due to perfect collinearity (matching SPSS): `mstat_5`“ und rechnet mit vier.“

**Kurz überlegen** (Auswahl, „Auflösen“): „Warum wirft R den fünften Dummy hinaus?“ Optionen: „Weil die Ledigen zu wenige sind“, „Weil der fünfte Dummy nichts Neues sagt: Wer bei den anderen vier überall 0 hat, ist ledig“, „Weil R höchstens vier Prädiktoren rechnen kann“.
- Ziel: zweite Option.
- richtig: „Genau. Der fünfte Dummy steckt vollständig in den anderen vier. Ein Modell kann zwei Dinge, die immer zusammen auftreten, nicht auseinanderhalten. Das nennt man perfekte Multikollinearität, mehr dazu in Grundlage 3.“
- „zu wenige“: „Ledige sind mit 1.459 (gewichtet) die zweitgrößte Gruppe. Der Grund ist ein anderer: Der fünfte Dummy sagt nichts Neues.“
- „höchstens vier“: „R rechnet auch mit viel mehr Prädiktoren. Hier stört, dass der fünfte Dummy schon in den anderen vier steckt.“

Kurz gesagt: „Die **Dummyfalle**: Alle Dummies einer Variable zusammen sagen nichts Neues, weil jede Person in genau einer Gruppe ist. Darum bleibt eine draußen. mariposa wirft sie selbst hinaus und meldet es; welche Gruppe dann die Referenz ist, steht in der Meldung.“

Genauer erklärt „Codes als Zahl: was dann passiert“: „Nimmst du `mstat` ohne Dummies ins Modell, rechnet R mit den Codes 1 bis 5, als wären es Stufen. Heraus kommt B = −0,171 „pro Stufe Familienstand“, als wäre „ledig“ (5) viermal so weit weg von „verheiratet“ wie „getrennt lebend“ (2). Das ergibt keinen Sinn. Die Notiz „labelled predictor mstat entered with its numeric codes“ warnt dich davor.“

Häufige Verwechslung: „Eine Zahl im Datensatz macht eine Variable nicht zu einer Stufe (Codes sind oft nur Namen, kennst du aus Sitzung 2). Familienstand, Partei oder Herkunft kommen als Dummies ins Modell, nicht als Zahl.“

Link: „→ In der freien Karte: Dummyvariablen“ (Begriff `dummy`).

### Aufgabe 2 „Prägung oder Ort?“ (Pflicht)

Link „↑ Grundlage 2 nachlesen“.

Leitfrage: „Im Osten sind die Befragten im Schnitt weniger zufrieden mit der Demokratie. Liegt das daran, wo jemand aufgewachsen ist, oder daran, wo er heute lebt?“

Ziel: „Am Ende kannst du für vier Gruppen sagen, wie weit sie von einer Referenzgruppe entfernt liegen, ob die Umgezogenen eher ihrer Herkunft oder ihrem Wohnort ähneln, und zeigen, dass ein Wechsel der Referenz die B ändert, die Vorhersagen aber nicht.“

Grundlage: „Grundlage 2, Gruppen als Prädiktoren: Dummyvariablen“.

Einleitung: „Die Variable `dg03` teilt die Befragten in vier Gruppen, je nachdem, wo sie ihre Jugend verbracht haben und wo sie heute befragt wurden:“

| Code | Wertelabel im ALLBUS | Gruppe | Dummy |
|---|---|---|---|
| 1 | O.JUGEND-O.INT. | Ost-Bleibende: im Osten aufgewachsen, lebt im Osten | `dg03_1` |
| 2 | O.JUGEND-W.INT. | Ost→West: im Osten aufgewachsen, lebt im Westen | `dg03_2` |
| 3 | W.JUGEND-O.INT. | West→Ost: im Westen aufgewachsen, lebt im Osten | `dg03_3` |
| 4 | W.JUGEND-W.INT. | West-Bleibende: im Westen aufgewachsen, lebt im Westen | `dg03_4` |

„Zwei Vermutungen stehen gegeneinander. **Prägung:** Wer im Osten aufwuchs, bleibt so zufrieden oder unzufrieden wie dort, egal wo er heute lebt. Dann ähneln die Ost→West-Umgezogenen den Ost-Bleibenden. **Ort:** Es zählt, wo man heute lebt. Dann ähneln die West→Ost-Umgezogenen den Ost-Bleibenden. Die Umgezogenen sind wenige: Von den Befragten mit Demokratiefrage sind 91 von Ost nach West und 97 von West nach Ost gezogen (gezählt, nicht gewichtet).“

**Bild zur Einleitung B7 `s10-vier-gruppen` (statisch, keine Ergebnisse):** 2 × 2-Raster. Spalten „lebt heute im Osten“ | „lebt heute im Westen“, Zeilen „aufgewachsen im Osten“ | „aufgewachsen im Westen“. Zellen: oben links „1 Ost-Bleibende, dg03_1“, oben rechts „2 Ost→West, dg03_2“, unten links „3 West→Ost, dg03_3“, unten rechts „4 West-Bleibende, dg03_4“ (grau hinterlegt, Schild „Referenz in der Vorlage“). Zwei Pfeile in den Rand: „Prägung: gleiche Zeile, gleiche Zufriedenheit“ (waagerecht), „Ort: gleiche Spalte, gleiche Zufriedenheit“ (senkrecht).
Textfassung B7: „Vier Gruppen in einem Raster. Oben im Osten aufgewachsen: links lebt heute im Osten, Gruppe 1, Ost-Bleibende; rechts lebt heute im Westen, Gruppe 2, Ost nach West. Unten im Westen aufgewachsen: links lebt heute im Osten, Gruppe 3, West nach Ost; rechts lebt heute im Westen, Gruppe 4, West-Bleibende, die Referenz in der Vorlage. Bei Prägung wären die Gruppen einer Zeile gleich, bei Ort die Gruppen einer Spalte.“

**Erst festlegen** (Auswahl, „Tipp abgeben“): „Welches Muster erwartest du?“ Optionen: „Prägung: Ost→West ähnelt den Ost-Bleibenden“, „Ort: West→Ost ähnelt den Ost-Bleibenden“, „Weder noch: Beide Umzugsgruppen ähneln den West-Bleibenden“.

**Schritte:**

1. „Führe die Vorlage aus. `to_dummy(dg03)` bildet die vier Dummies, in die Formel kommen drei. `dg03_4` fehlt, also sind die West-Bleibenden die Referenz. Lies unter Coefficients die Konstante (Intercept) und die drei B.“ Schilder „to_dummy(): neu heute“, „demo wie in Aufgabe 1“.

```r
# Demokratiezufriedenheit nach Herkunft und Wohnort
# demo wie in Aufgabe 1; to_dummy() macht aus dg03 vier 0/1-Variablen
# Referenz ist die Gruppe, die in der Formel fehlt (hier dg03_4, West-Bleibende)
allbus %>%
  mutate(
    demo = rec(ps03, rules = "rev")
  ) %>%
  to_dummy(dg03) %>%
  linear_regression(demo ~ ⟦dg03_1⟧ + dg03_2 + dg03_3, weights = wghtpew) %>%
  summary()
```

   Markierte Stellen (Liste für Screenreader): „Zeile 9: `dg03_1` in der Formel, in Schritt 3 tauschen.“

2. „Rechne mit R als Taschenrechner die Vorhersage für die Gruppe Ost→West aus: Konstante plus B von `dg03_2`. Die Vorlage rechnet noch das Beispiel aus Grundlage 2a (Konstante 7,042 plus B 0,652 für die Verheirateten). Tausch beide markierten Zahlen gegen deine aus Schritt 1 und führe sie aus.“ Schild „R als Taschenrechner: kennst du aus Sitzung 1“. Hilfezeile: „Kommazahlen mit Punkt, ein Minus gehört mit dazu, etwa `-0.5`.“

```r
# Vorhersage einer Gruppe: Konstante plus B ihres Dummys
# (hier noch das Beispiel aus Grundlage 2a: Verheiratete)
⟦7.042⟧ + ⟦0.652⟧
```

   Ausgabe vor dem Tausch (zur Kontrolle im Text): `[1] 7.694`. Markierte Stellen (Liste für Screenreader): „Zeile 3: zwei Zahlen, die Konstante und das B.“

3. „Wechsle die Referenz zu den Ost-Bleibenden: Tausch in der ersten Vorlage `dg03_1` gegen `dg03_4` und führe sie erneut aus. Jetzt fehlt `dg03_1`. Lies wieder Konstante und B. Rechne die Vorhersage für Ost→West noch einmal mit der Taschenrechner-Vorlage: Konstante plus B von `dg03_2`.“ Hilfezeile: „In der Zeile „Formula“ muss jetzt `demo ~ dg03_4 + dg03_2 + dg03_3` stehen.“

4. „Deuten: Welches Muster zeigen die Zahlen, und wie sicher sind sie? Schau bei den Umzugsgruppen auch auf das Konfidenzintervall (95% CI Lower und Upper, kennst du aus Sitzung 7). (Fragen a2d und a2e unten)“

**Weiterdenken in der Probier-Werkstatt (für die Aufgabe nicht nötig),** zugeklappt: „Für die Aufgabe reichen die Vorlagen oben. Hier ist Platz für eigene Fragen. Eine Idee: Wer von West nach Ost zieht, hat oft Abitur. Ändert sich das Bild, wenn du das Abitur konstant hältst? Die Probier-Werkstatt startet mit einem Vorschlag.“

```r
# Eine Idee: das Abitur konstant halten (Modell wie in Aufgabe 2, dazu abitur)
allbus %>%
  mutate(
    demo   = rec(ps03, rules = "rev"),
    abitur = rec(educ, rules = "1:3=0 [kein Abitur]; 4:5=1 [Abitur]; else=NA")
  ) %>%
  to_dummy(dg03) %>%
  linear_regression(demo ~ dg03_1 + dg03_2 + dg03_3 + abitur, weights = wghtpew) %>%
  summary()
```

(Zur Information: Konstante 4,017; dg03_1 −0,666; dg03_2 −0,135; dg03_3 −0,170; abitur 0,465; R² 0,075. Der Abstand der West→Ost-Gruppe wächst von −0,034 auf −0,170: Kontrolle kann einen Abstand auch vergrößern.)

**Antwortfragen** (am Ende „Deine Festlegung vorher war: …“ und die Auflösung: „Weder noch: Ost→West liegt 0,17 und West→Ost 0,03 unter den West-Bleibenden, die Ost-Bleibenden 0,71.“):

| id | Art | Label | Optionen | Ziel | Toleranz | Text richtig | Text falsch / Hinweis | Hilfezeile |
|---|---|---|---|---|---|---|---|---|
| a2a | number | Referenz West-Bleibende: Wie groß ist die Konstante (Intercept)? | – | 4.243 | 0.005 | 4,243: die mittlere Demokratiezufriedenheit der West-Bleibenden, auf der Skala von 1 bis 6. | Lies unter Coefficients die Zeile (Intercept), Spalte B. Sonderfall 4,122 (± 0,005): Das ist der Mittelwert aller Befragten im Modell (Descriptive Statistics). Sonderfall 3,537: Das ist die Konstante mit Referenz Ost-Bleibende; die gehört zu Schritt 3. | Aus Schritt 1. |
| a2b | number | Referenz West-Bleibende: Wie groß ist B der Ost-Bleibenden (`dg03_1`)? | – | -0.705 | 0.005 | −0,705: Die Ost-Bleibenden liegen 0,7 Punkte unter den West-Bleibenden. | Lies die Zeile `dg03_1`, Spalte B, mit Vorzeichen. Sonderfall 0,705 (positiv): Das Vorzeichen fehlt; die Ost-Bleibenden sind weniger zufrieden. Sonderfall −0,202 (± 0,005): Das ist Beta. | – |
| a2c | number | Welchen Wert sagt das Modell für die Gruppe Ost→West voraus? | – | 4.077 | 0.01 | 4,077: Konstante 4,243 plus B −0,166. | Vorhersage einer Gruppe: Konstante plus B ihres Dummys. Sonderfall −0,166: Das ist nur der Abstand zur Referenz. | Ergebnis von Schritt 2. |
| a2d | choice | Welches Muster zeigen die Daten? | praegung: „Prägung: Ost→West ähnelt den Ost-Bleibenden“; ort: „Ort: West→Ost ähnelt den Ost-Bleibenden“; weder: „Weder noch: Beide Umzugsgruppen liegen nah bei den West-Bleibenden“ | weder | – | Genau. Ost→West liegt 0,17, West→Ost 0,03 unter den West-Bleibenden; die Ost-Bleibenden 0,71. Der Abstand sitzt bei denen, die im Osten aufwuchsen und dort leben. Eine mögliche Erklärung: Wer umzieht, unterscheidet sich auch sonst von denen, die bleiben. | bei „praegung“: Dann müsste Ost→West etwa −0,7 haben wie die Ost-Bleibenden. Es sind −0,17. Bei „ort“: Dann müsste West→Ost etwa −0,7 haben. Es sind −0,03. | – |
| a2e | choice | Bei Ost→West reicht das Konfidenzintervall von −0,404 bis 0,072, bei West→Ost von −0,385 bis 0,317. Was heißt das? | null: „Ein Abstand von 0 zu den West-Bleibenden ist mit den Daten vereinbar. Die Gruppen sind klein, die Lage ist unsicher.“; gleich: „Die Umzugsgruppen sind sicher genauso zufrieden wie die West-Bleibenden.“; falsch: „Das Modell ist falsch, weil die Intervalle so breit sind.“ | null | – | Genau. Beide Intervalle schließen 0 ein; mit 91 und 97 Befragten bleibt viel Unsicherheit. Aber beide Intervalle enden weit vor −0,7: Dass die Umgezogenen so unzufrieden sind wie die Ost-Bleibenden, passt nicht zu den Daten. | bei „gleich“: Ein Intervall um 0 heißt nicht „sicher gleich“, sondern „Abstand 0 ist möglich, aber auch einige Zehntel“. Bei „falsch“: Breite Intervalle sind kein Fehler, sondern ehrlich: Bei wenigen Befragten weiß man weniger genau. | – |
| a2f | number | Referenz Ost-Bleibende (Schritt 3): Wie groß ist jetzt die Konstante? | – | 3.537 | 0.005 | 3,537: der Mittelwert der Ost-Bleibenden. Vorhersage Ost→West jetzt: 3,537 plus 0,540 = 4,077, genau wie vorher. Andere Referenz, andere B, gleiche Vorhersagen. | Hast du `dg03_1` gegen `dg03_4` getauscht? In der Zeile „Formula“ muss `demo ~ dg03_4 + dg03_2 + dg03_3` stehen. Sonderfall 4,243: Das ist noch die Referenz West-Bleibende. | Aus Schritt 3. |

**Fürs Plenum:** „Mit Referenz West-Bleibende hat Ost→West B = −0,166, mit Referenz Ost-Bleibende +0,540. Welche Zahl würdet ihr in einem Zeitungsartikel nennen, und welchen Satz schreibt ihr dazu?“

**Hilfe, Stufe 1: Denkanstoß:** „Die Konstante ist der Mittelwert der Gruppe, deren Dummy in der Formel fehlt. Jedes B ist der Abstand einer Gruppe zu ihr. Die Vorhersage einer Gruppe ist Konstante plus ihr B.“

**Hilfe, Stufe 2: Wo schaue ich?:** „Konstante und B stehen unter Coefficients in der Spalte B: (Intercept) ist die Konstante, `dg03_1` die Ost-Bleibenden, `dg03_2` Ost→West, `dg03_3` West→Ost. Die Konfidenzintervalle stehen in den Spalten 95% CI Lower und Upper. Für Schritt 3 tauschst du nur `dg03_1` gegen `dg03_4`.“

**Hilfe, Stufe 3: Lösung:** „Referenz West-Bleibende: Konstante 4,243; Ost-Bleibende −0,705; Ost→West −0,166 (KI −0,404 bis 0,072); West→Ost −0,034 (KI −0,385 bis 0,317). Vorhersage Ost→West: in der Taschenrechner-Vorlage `4.243 + -0.166`, ergibt 4.077. Referenz Ost-Bleibende: Konstante 3,537; West-Bleibende +0,705; Ost→West +0,540; West→Ost +0,671; Vorhersage Ost→West 3,537 + 0,540 = 4,077. Muster: weder Prägung noch Ort; beide Umzugsgruppen liegen nah bei den West-Bleibenden, sicher ist das bei so kleinen Gruppen aber nicht.“

**Ohne Grafik lösbar:** „Das Raster in der Einleitung zeigt nur die vier Gruppen. Alle Zahlen stehen in der Ausgabe von `summary()` unter Coefficients.“

Hinweis unter den Antworten (klein): „N = 3.222 in der Ausgabe ist die Summe der Gewichte. Gezählt sind es 3.254 Befragte: 1.003 Ost-Bleibende, 91 Ost→West, 97 West→Ost, 2.063 West-Bleibende. Weil der Osten im ALLBUS absichtlich stärker vertreten ist, zählen Befragte im Osten gewichtet weniger.“

---

## 6 Thema 3: Vergleichen und prüfen

### Grundlage 3 „Vergleichen und prüfen: Beta, korrigiertes R², Multikollinearität“ (Kopf: „Grundlage zu Aufgabe 3“, „Schon klar? Direkt zu Aufgabe 3 ↓“)

Unterzeile: „Welcher Prädiktor wiegt mehr, was taugt R² bei vielen Prädiktoren, und wann stören sich Prädiktoren gegenseitig? Drei Schritte, etwa 15 Minuten.“

#### Karte 3a „Wer wiegt mehr? Beta“ (Schilder: „Standardabweichung: kennst du aus Sitzung 3“, „Beta: kennst du aus Sitzung 9, neu zum Vergleichen“, „Im Bild“)

Beispiel zuerst: „Im Modell aus R lesen ist B für das Alter 0,024 pro Jahr und für die Gesundheit 0,861 pro Stufe. Ein Jahr und eine Gesundheitsstufe sind verschieden große Schritte. Fair vergleichen kannst du erst, wenn beide in derselben Einheit gemessen sind. Diese Einheit ist die Standardabweichung: ein typischer Abstand vom Mittelwert.“

**Bild B8 `s10-beta-lineal` (interaktiv, zwei Zustände „pro Einheit“ / „pro Standardabweichung“):**
- Zwei waagerechte Lineale übereinander, links beschriftet „Alter“ und „Gesundheit“, darunter je ein waagerechter Balken (orange) für die vorhergesagte Veränderung der Lebenszufriedenheit, Skala 0 bis 1 Punkt (Striche bei 0; 0,25; 0,5; 0,75; 1).
- **Zustand „pro Einheit“:** Lineal Alter: ein markierter Schritt „1 Jahr“ (winzig). Balken Alter 0,024. Lineal Gesundheit: ein Schritt „1 Stufe“. Balken Gesundheit 0,861. Schild: „B: pro Jahr gegen pro Stufe“.
- **Zustand „pro Standardabweichung“:** Lineal Alter: Schritt „18,2 Jahre (1 SD)“. Balken Alter 0,43 (0,0237 × 18,212). Lineal Gesundheit: Schritt „1,01 Stufen (1 SD)“. Balken Gesundheit 0,87 (0,861 × 1,012). Schild: „Gesundheit etwa doppelt so viel“. Darunter klein: „Geteilt durch die SD der Lebenszufriedenheit (1,919) ergibt das Beta: Alter 0,225, Gesundheit 0,454.“
- Farben: Lineale grau, Schritte Baukasten-Blau, Balken orange.

**Textfassung B8:** Zustand 1: „Pro Einheit: Ein Jahr mehr Alter bringt 0,024 Punkte Lebenszufriedenheit, eine Gesundheitsstufe 0,861.“ Zustand 2: „Pro Standardabweichung: 18,2 Jahre mehr Alter bringen 0,43 Punkte, 1,01 Gesundheitsstufen bringen 0,87 Punkte. Die Gesundheit wiegt etwa doppelt so viel. Geteilt durch die Standardabweichung der Lebenszufriedenheit, 1,919, ergibt das Beta: 0,225 für das Alter, 0,454 für die Gesundheit.“

**Formel lesen lernen (unter dem Bild, Bild B9 `s10-formel-beta`, Bausteine):** „Beta“ = „B“ × „SD des Prädiktors“ ÷ „SD der abhängigen Variable“. Unterschriften: „was R in Spalte B ausgibt“, „aus Descriptive Statistics“, „aus Descriptive Statistics“. Darunter eingesetzt: „Gesundheit: 0,861 × 1,012 ÷ 1,919 = 0,454“.
Textfassung B9: „Beta gleich B mal Standardabweichung des Prädiktors geteilt durch Standardabweichung der abhängigen Variable. Für die Gesundheit: 0,861 mal 1,012 geteilt durch 1,919 ergibt 0,454. Alle drei Zahlen stehen in der Ausgabe von summary().“
Text: „Von innen nach außen: Erst rechnest du B auf einen typischen Schritt des Prädiktors um (mal SD des Prädiktors). Dann drückst du das Ergebnis in typischen Schritten der abhängigen Variable aus (geteilt durch ihre SD). So haben alle Prädiktoren dieselbe Einheit.“

**Kurz überlegen** (Auswahl, „Auflösen“): „Welcher Prädiktor hängt stärker mit der Lebenszufriedenheit zusammen?“ Optionen: „das Alter“, „die Gesundheit“, „kann man nicht sagen“.
- Ziel: „die Gesundheit“.
- richtig: „Genau: Beta 0,454 gegen 0,225, etwa doppelt so viel.“
- „das Alter“: „Pro Standardabweichung bringt das Alter 0,43 Punkte, die Gesundheit 0,87. Beta: 0,225 gegen 0,454.“
- „kann man nicht sagen“: „Mit B allein nicht, weil Jahre und Stufen verschieden sind. Mit Beta schon: 0,454 gegen 0,225.“

Kurz gesagt: „Der **standardisierte Koeffizient Beta** ist B in Standardabweichungen: Um wie viele Standardabweichungen ändert sich die Vorhersage, wenn der Prädiktor um eine Standardabweichung steigt? Mit Beta vergleichst du Prädiktoren in einem Modell. B brauchst du für Vorhersagen und für Sätze in der Einheit der Variable.“

Genauer erklärt „Grenzen von Beta“:
- „In Sitzung 9 war Beta mit nur einer UV gleich der Korrelation r. Mit mehreren Prädiktoren gilt das nicht mehr: Beta ist dann der Zusammenhang bei gleichen Werten der anderen Prädiktoren, in Standardabweichungen.“
- „Beta vergleicht nur innerhalb eines Modells und derselben Daten. Zwischen Studien oder Gruppen vergleicht man besser B.“
- „Bei 0/1-Variablen hängt Beta auch davon ab, wie groß die Gruppen sind: Ein großer Abstand, der nur wenige betrifft, bekommt ein kleines Beta. Beta sagt dann: Wie viel bewegt dieser Prädiktor in der ganzen Bevölkerung? Den Abstand zwischen den Gruppen liest du an B.“
- „Rechnest du mit den gerundeten Zahlen nach, weicht das Ergebnis manchmal in der dritten Stelle ab: 0,024 × 18,212 ÷ 1,919 ergibt 0,228, R gibt 0,225 aus, weil es mit dem ungerundeten B (0,0237) rechnet.“
- „Die Konstante hat kein Beta. Darum ist ihre Zelle in der Spalte Beta leer.“

Häufige Verwechslung: „Das größte B ist nicht automatisch der stärkste Prädiktor. B hängt an der Einheit: In Monaten gemessen hätte das Alter ein zwölfmal kleineres B, in Jahrzehnten ein zehnmal größeres. Beta bleibt gleich.“

#### Karte 3b „R² steigt immer: das korrigierte R²“ (Schilder: „R² und Adjusted R Square: kennst du aus Sitzung 9“, „Ausprobieren“)

Beispiel zuerst: „Jeder zusätzliche Prädiktor lässt R² steigen, auch einer, der mit nichts zu tun hat. Probier es mit 30 Befragten, zum Beispiel: Die Lebenszufriedenheit wird aus der Gesundheit vorhergesagt. Dann kommen Würfel dazu, für jede Person einmal gewürfelt.“

**Bild/Interaktion B10 `s10-wuerfel` (interaktiv, Knöpfe „+ Würfel“ und „− Würfel“, 0 bis 4 Würfel; Start 0):**
- Links eine Formelzeile aus Bausteinen: `zufriedenheit ~ gesundheit` und je Würfel ein weiterer Baustein `+ würfel1` … `+ würfel4` (Würfelsymbol).
- Rechts zwei waagerechte Balken auf einer Skala 0 bis 0,4: „R²“ (Baukasten-Blau) und „korrigiertes R²“ (orange), Wert am Balkenende.
- Werte (konstruiertes Beispiel mit 30 Personen, unten nachgerechnet): 0 Würfel: R² 0,27, korrigiert 0,25. 1 Würfel: 0,28 | 0,23. 2 Würfel: 0,29 | 0,21. 3 Würfel: 0,30 | 0,19. 4 Würfel: 0,31 | 0,17.
- Unter dem Diagramm klein: „Die Würfel sagen nichts über Zufriedenheit. R² steigt trotzdem, das korrigierte R² sinkt.“

**Textfassung B10** (wechselt, `aria-live`): „Mit Gesundheit und keinem Würfel: R² 0,27, korrigiertes R² 0,25.“ … „Mit Gesundheit und vier Würfeln: R² 0,31, korrigiertes R² 0,17.“ Zusätzlich eine Tabelle mit allen fünf Zeilen.

**Formel lesen lernen (Bild B11 `s10-formel-r2korr`, Bausteine):** „korrigiertes R²“ = 1 − „(1 − R²)“ × „(n − 1)“ ÷ „(n − k − 1)“. Unterschriften: „was nicht erklärt ist“, „Befragte minus 1“, „Befragte minus Prädiktoren minus 1“. Eingesetzt (4 Würfel, n = 30, k = 5): „1 − (1 − 0,31) × 29 ÷ 24 = 1 − 0,69 × 1,21 = 0,17“. Zweite eingesetzte Zeile (ALLBUS, R lesen): „n = 5.128, k = 2, R² 0,190: 1 − 0,810 × 5.127 ÷ 5.125 = 0,190“.
Textfassung B11: „Korrigiertes R² gleich 1 minus den nicht erklärten Anteil, mal n minus 1, geteilt durch n minus k minus 1. n ist die Zahl der Befragten, k die Zahl der Prädiktoren. Bei 30 Befragten und 5 Prädiktoren: 1 minus 0,69 mal 29 geteilt durch 24 ergibt 0,17. Bei 5.128 Befragten und 2 Prädiktoren ist der Bruch fast 1, und das korrigierte R² bleibt 0,190.“
Text: „Von innen nach außen: Der nicht erklärte Teil (1 − R²) wird mit einem Bruch etwas größer gemacht. Der Bruch ist umso größer, je mehr Prädiktoren auf je weniger Befragte kommen. Bei Tausenden Befragten ist er fast 1.“

**Kurz überlegen** (Auswahl, „Auflösen“): „Im Modell aus R lesen sind R² und korrigiertes R² beide 0,190. Warum ziehen die zwei Prädiktoren dort fast nichts ab?“ Optionen: „Weil das Modell sehr gut ist“, „Weil auf jeden Prädiktor über 2.500 Befragte kommen“, „Weil Alter und Gesundheit wichtig sind“.
- Ziel: zweite Option.
- richtig: „Genau. Mit 5.128 Befragten und 2 Prädiktoren ist der Abzug winzig. Wichtig wird das korrigierte R² bei kleinen Gruppen und vielen Prädiktoren.“
- „sehr gut“: „R² 0,19 ist ordentlich, aber das ist nicht der Grund. Der Abzug hängt nur an n und k: 5.128 Befragte, 2 Prädiktoren.“
- „wichtig“: „Auch unwichtige Prädiktoren würden hier kaum etwas abziehen. Entscheidend sind viele Befragte für wenige Prädiktoren.“

Kurz gesagt: „**R²** steigt mit jedem Prädiktor, auch einem nutzlosen. Das **korrigierte R²** (Adjusted R Square) zieht für jeden Prädiktor etwas ab und steigt nur, wenn ein neuer Prädiktor mehr erklärt, als ein Zufallsprädiktor wie ein Würfel im Schnitt erklären würde. Vergleichst du Modelle mit verschieden vielen Prädiktoren, nimm das korrigierte R².“

Genauer erklärt „Wann der Unterschied zählt“: „Bei den meisten ALLBUS-Modellen mit Tausenden Befragten liegen R² und korrigiertes R² gleichauf. Rechnest du aber nur mit einer kleinen Gruppe, etwa den 91 Ost→West-Umgezogenen aus Aufgabe 2, und nimmst viele Prädiktoren, kann R² gut aussehen, während das korrigierte R² fast null ist. Das korrigierte R² kann sogar negativ werden: Dann erklärt das Modell weniger, als so viele Prädiktoren schon durch Zufall erklären würden.“

Häufige Verwechslung: „Ein höheres R² heißt nicht, dass jeder Prädiktor etwas beiträgt. Ob ein einzelner Prädiktor etwas beiträgt, siehst du an seinem B, seinem Konfidenzintervall und seiner Signifikanz.“

#### Karte 3c „Zwei Prädiktoren, die fast dasselbe sagen: Multikollinearität“ (Schilder: „Im Bild“)

Beispiel zuerst: „Was passiert, wenn zwei Prädiktoren fast dasselbe messen? Nimm zum Alter in Jahren noch die Altersgruppe dazu (agec: 18–29, 30–44 und so weiter). Wer 70 ist, ist auch in der Gruppe 60–74. Die beiden laufen fast immer zusammen.“

**Bild B12 `s10-vif-kreise` (interaktiv, zwei Zustände „Alter und Gesundheit“ / „Alter und Altersgruppe“):**
- Je zwei Kreise, die sich überlappen (Venn-Bild). Die Überlappung steht für das, was beide gemeinsam haben.
- **Zustand „Alter und Gesundheit“:** Kreise „Alter“ (Baukasten-Blau) und „Gesundheit“ (Baukasten-Grün) überlappen wenig. Daneben eine kleine Tabelle wie in R: „age: B 0,024, Std. Error 0,001, VIF 1,120; gesund: B 0,861, Std. Error 0,025, VIF 1,120“.
- **Zustand „Alter und Altersgruppe“:** Kreise „Alter“ und „Altersgruppe“ (Baukasten-Blau, heller) überlappen fast vollständig. Tabelle: „age: B 0,016, Std. Error 0,006, VIF 18,995; agec: B 0,121, Std. Error 0,084, Sig. ,153, VIF 18,963“ (Gesundheit ist in beiden Modellen dabei; Zeile „gesund: B 0,862, VIF 1,121“ grau).
- Am rechten Rand eine senkrechte VIF-Skala von 1 bis 20 mit Marke „10: mariposa meldet ein Problem“ (rot gestrichelt) und einem Pfeil auf den aktuellen größten VIF.

**Textfassung B12:** Zustand 1: „Alter und Gesundheit überlappen wenig. B Alter 0,024 mit Standardfehler 0,001, VIF 1,12. B Gesundheit 0,861, VIF 1,12.“ Zustand 2: „Alter und Altersgruppe überlappen fast ganz. B Alter fällt auf 0,016 mit sechsmal so großem Standardfehler, 0,006; die Altersgruppe bekommt 0,121 und ist nicht signifikant. Der VIF ist bei beiden fast 19, über der Grenze von 10.“

**Kurz überlegen** (Auswahl, „Auflösen“): „Im zweiten Modell ist die Altersgruppe nicht signifikant (Sig. ,153). Heißt das, dass das Alter in Gruppen nichts mit der Zufriedenheit zu tun hat?“ Optionen: „Ja, die Altersgruppe spielt keine Rolle“, „Nein: Alter und Altersgruppe teilen sich fast dieselbe Information, und das Modell kann sie nicht auseinanderhalten“.
- Ziel: zweite Option.
- richtig: „Genau. Allein mit der Gesundheit hat die Altersgruppe ein deutliches B (0,344 pro Gruppe, VIF 1,1). Erst neben dem Alter in Jahren verliert sie, weil fast alles, was sie weiß, schon im Alter steckt.“
- falsch: „Ohne das Alter in Jahren ist die Altersgruppe sehr wohl deutlich (B 0,344, Sig. <,001). Neben dem Alter in Jahren hat sie nur nichts Eigenes mehr zu sagen.“

Kurz gesagt: „**Multikollinearität** heißt: Prädiktoren hängen so eng zusammen, dass das Modell ihre Anteile kaum trennen kann. Die B werden unsicher (große Standardfehler) und können springen. Der **VIF** (Varianzinflationsfaktor) misst das je Prädiktor: 1 heißt unabhängig von den anderen, ab 10 meldet mariposa ein Problem, manche sagen schon ab 5.“

Genauer erklärt „VIF und Toleranz lesen“:
- „Die **Toleranz** ist 1 geteilt durch den VIF. Sie sagt, welcher Anteil eines Prädiktors nicht schon in den anderen steckt. Toleranz 0,053 beim Alter heißt: Nur gut 5 % der Streuung des Alters stecken nicht schon in den anderen Prädiktoren, hier vor allem in der Altersgruppe.“
- „Was tun? Einen der beiden weglassen oder beide zu einem Index zusammenfassen (Sitzung 8). Wichtig ist, dass jeder Prädiktor etwas Eigenes misst.“
- „Die Dummyfalle aus Grundlage 2 ist der Extremfall: Der fünfte Dummy steckt ganz in den anderen vier, der VIF wäre unendlich. Darum wirft R ihn hinaus.“
- „In Modellen mit Interaktion (Grundlage 4) ist ein höherer VIF normal, weil die Interaktion aus den beiden Prädiktoren gebaut ist. Dort deutet man ihn nicht als Problem.“

Häufige Verwechslung: „Multikollinearität heißt nicht, dass Prädiktor und abhängige Variable eng zusammenhängen. Das ist erwünscht. Gemeint ist der Zusammenhang der Prädiktoren untereinander.“

Link: „→ In der freien Karte: Multikollinearität“ (Begriff `multicollinearity`).

### Aufgabe 3 „Was wiegt mehr, und was bleibt von der Ost-West-Lücke?“ (Pflicht)

Link „↑ Grundlage 3 nachlesen“.

Leitfrage: „Welche von vier Eigenschaften hängt am stärksten mit der Demokratiezufriedenheit zusammen, und wie groß bleibt der Abstand zwischen Ost und West, wenn die anderen drei gleich sind?“

Ziel: „Am Ende kannst du Prädiktoren mit Beta vergleichen, korrigiertes R² und VIF eines Modells lesen und sagen, wie viel von der Ost-West-Lücke bleibt, wenn wirtschaftliche Lage und Abitur konstant gehalten werden.“

Grundlage: „Grundlage 3, Vergleichen und prüfen“.

Einleitung: „Ins Modell kommen vier Prädiktoren: die eigene wirtschaftliche Lage (`lage`) und die Lage Deutschlands (`dlage`) aus Aufgabe 1, beide von 1 sehr schlecht bis 5 sehr gut; das Wohngebiet (`ost`: 1 Osten, 0 Westen, eine 0/1-Variable wie in Grundlage 2a) und der Schulabschluss (`abitur`: 1 Fachhochschulreife oder Abitur, 0 ohne Abschluss, Volks- oder Hauptschule oder Mittlere Reife; „anderer Abschluss“ und „noch Schüler“ fehlen im Modell).“

**Erst festlegen** (Auswahl, „Tipp abgeben“): „Wie viel bleibt von der Ost-West-Lücke, wenn Lage und Abitur konstant gehalten werden?“ Optionen: „fast nichts“, „etwa die Hälfte“, „das meiste“.

**Schritte:**

1. „Führe die Vorlage aus. Lies unter Coefficients die Spalten B und Beta, unter Model Summary R Square und Adjusted R Square, unter Collinearity Statistics die VIF.“ Schild „0/1-Variable mit rec(): wie in Grundlage 2a“.

```r
# Demokratiezufriedenheit aus vier Prädiktoren
# demo, lage und dlage wie in Aufgabe 1; ost und abitur als 0/1-Variablen
allbus %>%
  mutate(
    demo   = rec(ps03, rules = "rev"),
    lage   = rec(ep03, rules = "rev"),
    dlage  = rec(ep01, rules = "rev"),
    ost    = rec(eastwest, rules = "1=0 [West]; 2=1 [Ost]"),
    abitur = rec(educ, rules = "1:3=0 [kein Abitur]; 4:5=1 [Abitur]; else=NA")
  ) %>%
  linear_regression(demo ~ lage + dlage + ost + abitur, weights = wghtpew) %>%
  summary()
```

2. „Vergleiche B und Beta: Welcher Prädiktor hat das größte Beta? Und stimmt die Reihenfolge der B mit der Reihenfolge der Beta überein? Schau besonders auf `lage` und `abitur`.“

3. „Zum Vergleich die Ost-West-Lücke ohne weitere Prädiktoren. Führe die zweite Vorlage aus und vergleiche B von `ost` mit dem aus Schritt 1.“

```r
# Zum Vergleich: der Ost-West-Unterschied ohne weitere Prädiktoren
# demo wie in Aufgabe 1, ost wie oben
allbus %>%
  mutate(
    demo = rec(ps03, rules = "rev"),
    ost  = rec(eastwest, rules = "1=0 [West]; 2=1 [Ost]")
  ) %>%
  linear_regression(demo ~ ⟦ost⟧, weights = wghtpew) %>%
  summary()
```

   Markierte Stellen (Liste für Screenreader): „Zeile 8: `ost` in der Formel. Für die Aufgabe nicht ändern; zum Ausprobieren kannst du einen weiteren Prädiktor mit `+` ergänzen, etwa `ost + abitur` (dann `abitur` wie in der ersten Vorlage in `mutate()` bilden).“

   (Entscheidung zum Bau: Die Markierung zeigt hier nur, wo man weiterbauen könnte; die Antwortfragen nutzen die Vorlage unverändert. Wenn das im Bau stört, Markierung weglassen.)

**Weiterdenken in der Probier-Werkstatt (für die Aufgabe nicht nötig),** zugeklappt: „Für die Aufgabe reichen die Vorlagen oben. Hier ist Platz für eigene Fragen. Eine Idee: Wie viel trägt die Lage Deutschlands? Nimm sie heraus und vergleiche R², korrigiertes R² und die übrigen B. Die Probier-Werkstatt startet mit einem Vorschlag.“

```r
# Eine Idee: dasselbe Modell ohne die Lage Deutschlands (dlage)
allbus %>%
  mutate(
    demo   = rec(ps03, rules = "rev"),
    lage   = rec(ep03, rules = "rev"),
    ost    = rec(eastwest, rules = "1=0 [West]; 2=1 [Ost]"),
    abitur = rec(educ, rules = "1:3=0 [kein Abitur]; 4:5=1 [Abitur]; else=NA")
  ) %>%
  linear_regression(demo ~ lage + ost + abitur, weights = wghtpew) %>%
  summary()
```

(Zur Information: R² 0,131, korrigiert 0,130; B lage 0,408, ost −0,573, abitur 0,348. Ohne die Lage Deutschlands übernimmt die eigene Lage einen Teil ihres Zusammenhangs, wie in Aufgabe 1 umgekehrt.)

**Antwortfragen** (am Ende „Deine Festlegung vorher war: …“ und die Auflösung: „Das meiste: von −0,624 bleiben −0,521, gut vier Fünftel.“):

| id | Art | Label | Optionen | Ziel | Toleranz | Text richtig | Text falsch / Hinweis | Hilfezeile |
|---|---|---|---|---|---|---|---|---|
| a3a | choice | Welcher Prädiktor hat den größten Betrag von Beta? | lage; dlage; ost; abitur | dlage | – | Die Lage Deutschlands, Beta 0,394. Danach kommt `ost` mit −0,154 (Betrag 0,154). | Vergleiche in der Spalte Beta die Zahlen ohne Vorzeichen. bei „ost“: B von `ost` ist mit −0,521 fast so groß wie das von `dlage`, aber Beta ist viel kleiner (−0,154): Bei `ost` ist ein Schritt der ganze Weg von West nach Ost, und nur 17 % leben im Osten. | Spalte Beta, ohne Vorzeichen vergleichen. |
| a3b | number | Wie groß ist Beta von `lage`? | – | 0.110 | 0.002 | 0,110. | Lies die Zeile `lage`, Spalte Beta (nicht B). Sonderfall 0,176 (± 0,002): Das ist B. | – |
| a3c | choice | `abitur` hat das größere B (0,216) als `lage` (0,176). Welcher Satz stimmt? | abitur: „Abitur hängt stärker mit der Demokratiezufriedenheit zusammen als die eigene Lage, weil sein B größer ist.“; lage: „Gemessen an Beta hängt die eigene Lage etwas stärker zusammen (0,110 gegen 0,085). B ist größer bei abitur, weil ein Schritt dort der ganze Schritt von „kein Abitur“ zu „Abitur“ ist.“; gleich: „Beide hängen gleich stark zusammen.“ | lage | – | Genau. Die Reihenfolge der B und der Beta ist hier verschieden. Zum Vergleichen nimmst du Beta. | bei „abitur“: B hängt an der Einheit. `lage` hat fünf Stufen, `abitur` nur zwei; vergleiche Beta: 0,110 gegen 0,085. Bei „gleich“: Beta unterscheidet sich, 0,110 gegen 0,085. Der Unterschied ist klein, aber da. | – |
| a3d | number | Wie groß ist das korrigierte R² (Adjusted R Square)? | – | 0.258 | 0.0004 | 0,258, fast gleich R² 0,259: Bei über 3.500 Befragten (gewichtet) und vier Prädiktoren zieht die Korrektur fast nichts ab. | Lies unter Model Summary die Zeile Adjusted R Square. Sonderfall 0,259: Das ist R Square ohne Korrektur. | – |
| a3e | choice | Was sagen die VIF-Werte (1,005 bis 1,208)? | gut: „Kein Problem: Die Prädiktoren hängen kaum untereinander zusammen.“; schlecht: „Problem: Die Werte liegen über 1, also gibt es Multikollinearität.“; avz: „Die Prädiktoren hängen kaum mit der Demokratiezufriedenheit zusammen.“ | gut | – | Genau. Der größte VIF ist 1,208 (dlage), weit unter 10. Eigene Lage und Lage Deutschlands hängen etwas zusammen, das hast du in Aufgabe 1 gesehen, aber nicht so eng, dass das Modell sie nicht trennen kann. | bei „schlecht“: 1 ist der kleinste mögliche VIF. Ein Problem meldet mariposa ab 10. Bei „avz“: Der VIF sagt nichts über den Zusammenhang mit der abhängigen Variable, nur über die Prädiktoren untereinander. | Collinearity Statistics, Spalte VIF. |
| a3f | number | Zweite Vorlage, `ost` allein: Wie groß ist B von `ost`? | – | -0.624 | 0.005 | −0,624 ohne Kontrollen, −0,521 mit Lage und Abitur. Gut vier Fünftel der Lücke bleiben (0,521 ÷ 0,624 ≈ 0,83). Mit Unterschieden in Lage und Abitur hängt nur ein kleiner Teil des Ost-West-Unterschieds zusammen. | Lies in der Ausgabe der zweiten Vorlage die Zeile `ost`, Spalte B. Sonderfall −0,521: Das ist das B aus der ersten Vorlage, mit Kontrollen. | Aus Schritt 3. |

**Hilfe, Stufe 1: Denkanstoß:** „B sagt, wie viel sich die Vorhersage pro Schritt ändert, und ein Schritt ist bei jedem Prädiktor etwas anderes. Beta rechnet alle auf dieselbe Einheit um. Für die Lücke vergleichst du B von `ost` mit und ohne die anderen Prädiktoren.“

**Hilfe, Stufe 2: Wo schaue ich?:** „B und Beta stehen unter Coefficients, nebeneinander. Adjusted R Square steht unter Model Summary, die VIF ganz unten unter Collinearity Statistics. Das B von `ost` ohne Kontrollen steht in der Ausgabe der zweiten Vorlage.“

**Hilfe, Stufe 3: Lösung:** „B: lage 0,176, dlage 0,635, ost −0,521, abitur 0,216. Beta: lage 0,110, dlage 0,394, ost −0,154, abitur 0,085. Am stärksten: die Lage Deutschlands. `abitur` hat das größere B als `lage`, aber das kleinere Beta. R² 0,259, korrigiert 0,258. VIF 1,005 bis 1,208: kein Problem. `ost` allein: −0,624; mit Kontrollen −0,521, gut vier Fünftel bleiben.“

**Ohne Grafik lösbar:** „Diese Aufgabe hat keine Grafik. Alle Zahlen stehen in den Ausgaben der beiden Vorlagen.“

---

## 7 Thema 4: Grenzen des Modells

### Grundlage 4 „Grenzen des Modells: Einfluss und Interaktion“ (Kopf: „Grundlage zu Aufgabe 4“, „Schon klar? Direkt zu Aufgabe 4 ↓“)

Unterzeile: „Wann kippt ein einzelner Fall die Gerade, und was, wenn ein Zusammenhang nicht für alle gleich ist? Zwei Schritte, etwa 12 Minuten.“

#### Karte 4a „Ein einzelner Fall kann die Gerade kippen: Ausreißer und Einfluss“ (Schilder: „Ausreißer: kennst du aus Sitzung 4 und 9“, „Einfluss: neu heute“, „Ausprobieren“)

Beispiel zuerst: „Elf Befragte, zum Beispiel, mit Alter und Lebenszufriedenheit. Die Gerade steigt leicht. Jetzt kommt eine zwölfte Person dazu, Person L. Sie ist sehr unzufrieden (1). Wo sie steht, entscheidet, was mit der Geraden passiert.“

**Bild/Interaktion B13 `s10-einfluss` (interaktiv, vier Zustände als Umschalter: „ohne L“, „L in der Mitte“, „L am Rand, weit weg von der Geraden“, „L am Rand, auf der Geraden“):**
- Punktwolke mit Gerade, Leinwand etwa 7,6 × 4,6. x-Achse „Alter“ von 20 bis 100 (Striche alle 10), y-Achse „Lebenszufriedenheit“ von 0 bis 10 (Striche bei 0, 2, …, 10).
- Elf blaue Punkte (Baukasten-Blau, Kreise): (22 | 6), (28 | 8), (33 | 6), (38 | 7), (44 | 8), (49 | 6), (53 | 8), (58 | 7), (63 | 8), (68 | 7), (74 | 8).
- Person L als oranges Dreieck mit Beschriftung „L“: Zustand 2 bei (48 | 1), Zustand 3 bei (95 | 1), Zustand 4 bei (95 | 8).
- Gerade (türkis, Modell) je Zustand, mit Schild „B = …“ oben rechts: ohne L: Konstante 6,14, B 0,022. L in der Mitte: 5,61, B 0,022. L am Rand, weit weg: 8,85, B −0,042. L am Rand, auf der Geraden: 6,21, B 0,020. Im Zustand 2 bis 4 bleibt die Gerade „ohne L“ grau gestrichelt stehen.
- Bei Zustand 3 zusätzlich ein grauer Pfeil vom Rand auf L: „weit draußen beim Alter“ und ein senkrechter Strich von L zur alten Geraden: „weit weg von der Geraden“.

**Textfassung B13** (wechselt, `aria-live`; als Ganzes auch als Tabelle): „Elf Befragte, zum Beispiel, zwischen 22 und 74 Jahren mit Zufriedenheit zwischen 6 und 8. Ohne Person L steigt die Gerade um 0,022 pro Jahr.“ Zustand 2: „L ist 48 Jahre alt, in der Mitte, und sehr unzufrieden (1). Die Gerade rutscht nach unten, ihre Steigung bleibt 0,022.“ Zustand 3: „L ist 95 Jahre alt, weit draußen, und sehr unzufrieden (1). Die Gerade kippt: Die Steigung wird negativ, minus 0,042.“ Zustand 4: „L ist 95 Jahre alt, aber mit Zufriedenheit 8 so, wie die Gerade es erwartet. Die Steigung bleibt fast gleich, 0,020.“

**Kurz überlegen** (Auswahl, steht vor dem Umschalter; Auflösen schaltet die Zustände frei): „In welchem Fall verändert Person L die Steigung am stärksten?“ Optionen: „L in der Mitte, sehr unzufrieden“, „L ganz rechts, sehr unzufrieden“, „L ganz rechts, so zufrieden wie erwartet“.
- Ziel: zweite Option.
- richtig: „Genau. Großen Einfluss hat ein Fall, der beim Prädiktor weit draußen liegt und zugleich weit weg von der Geraden. Hier kippt die Steigung von +0,022 auf −0,042.“
- „Mitte“: „In der Mitte zieht L die Gerade nur nach unten, ihre Neigung bleibt 0,022. Weit draußen wirkt L wie an einem langen Hebel.“
- „wie erwartet“: „Weit draußen allein reicht nicht. Liegt L auf der Geraden, bestätigt L sie nur: Steigung 0,020.“

Kurz gesagt: „In der Regression unterscheidet man drei Dinge. Ein **Ausreißer** liegt weit weg von der Geraden (großes Residuum). Ein Fall mit großer **Hebelwirkung** (Fachbegriff: Leverage) liegt beim Prädiktor weit draußen. **Einfluss** hat ein Fall, wenn das Modell ohne ihn deutlich andere B ergibt. Das passiert vor allem, wenn beides zusammenkommt: weit draußen und weit weg von der Geraden.“

Genauer erklärt „Und im ALLBUS?“:
- „Bei Tausenden Befragten kippt ein Einzelner die Gerade kaum. Bei kleinen Gruppen ist das anders: Die 91 Ost→West-Umgezogenen aus Aufgabe 2 tragen ihr B allein. Wenige ungewöhnliche Personen können es merklich verschieben. Auch darum ist ihr Konfidenzintervall breit.“
- „Was tun? Ausreißer nicht einfach löschen. Erst prüfen, ob es ein Fehler ist (wie die wochenlangen Fragebögen in Sitzung 4). Ist es keiner, rechnet man das Modell einmal mit und einmal ohne die auffälligen Fälle und berichtet, ob sich das Ergebnis ändert.“
- „Für den Einfluss gibt es Maßzahlen, etwa Cooks Distanz; mariposa gibt keine aus. Die Idee dahinter ist genau der Vergleich mit und ohne den Fall. Für diese Prüfung reicht `filter()` aus Sitzung 2 vor `linear_regression()`.“

Häufige Verwechslung: „Ein Ausreißer ist nicht automatisch ein Fehler, und weit draußen heißt nicht automatisch Einfluss: L am Rand auf der Geraden (Zustand 4) liegt weit draußen, ändert die Steigung aber kaum. L in der Mitte (Zustand 2) ist ein deutlicher Ausreißer, kippt die Steigung aber nicht.“

Link: „→ In der freien Karte: Ausreißer und Einfluss“ (Begriff `outliers_influence`).

#### Karte 4b „Gilt ein Abstand für alle? Interaktion“ (Schilder: „Im Bild“, „Kurz überlegen“)

Beispiel zuerst: „Sind Erwerbstätige zufriedener mit ihrem Leben als Nicht-Erwerbstätige? Das hängt vom Alter ab. Unter 60 heißt „nicht erwerbstätig“ oft arbeitslos, krank oder in Ausbildung, ab 60 meist in Rente.“

**Bild B14 `s10-interaktion` (statisch):**
- Interaktionsdiagramm: x-Achse zwei Positionen „nicht erwerbstätig“ und „erwerbstätig“; y-Achse „mittlere Lebenszufriedenheit“, Ausschnitt 6 bis 8 (Striche 6,0; 6,5; 7,0; 7,5; 8,0; Hinweis „Ausschnitt“).
- Zwei Linien: „unter 60“ (Baukasten-Blau, Kreise, durchgezogen): 6,34 → 7,43; „60 und älter“ (Baukasten-Grün, Quadrate, gestrichelt): 7,57 → 7,63. Werte an den Punkten.
- Schilder an den Linien: „Abstand +1,09“ (unter 60) und „Abstand +0,06“ (60 und älter).
- Kleiner Kasten daneben: „Parallele Linien = keine Interaktion. Linien mit verschiedener Neigung = Interaktion.“ mit zwei Mini-Skizzen.
- Fußzeile: „ALLBUS 2023, gewichtet. Erwerbstätig: Vollzeit, Teilzeit oder nebenher (work 1 bis 3).“

**Textfassung B14:** „Mittlere Lebenszufriedenheit. Unter 60 Jahren: nicht erwerbstätig 6,34, erwerbstätig 7,43, Abstand 1,09. Ab 60 Jahren: nicht erwerbstätig 7,57, erwerbstätig 7,63, Abstand 0,06. Die beiden Linien haben ganz verschiedene Neigung: Der Abstand zwischen Erwerbstätigen und Nicht-Erwerbstätigen hängt vom Alter ab.“

Text: „Im Modell schreibt man dafür `ls01 ~ erwerb * ab60`. R gibt vier Zeilen aus: Konstante 6,339 (nicht erwerbstätig, unter 60), `erwerb` 1,091 (Abstand der Erwerbstätigen unter 60), `ab60` 1,233 (Abstand der Älteren zu den Jüngeren, beide nicht erwerbstätig), `erwerb:ab60` −1,035 (um so viel ist der Erwerbs-Abstand ab 60 anders). Der Doppelpunkt bezeichnet die Interaktion.“

**Kurz überlegen** (Zahlenfeld, „Prüfen“): „Wie groß ist der Abstand zwischen Erwerbstätigen und Nicht-Erwerbstätigen ab 60 laut Modell? Rechne B von `erwerb` plus B von `erwerb:ab60`.“
- Ziel 0,056, Toleranz 0,01.
- richtig: „0,056: 1,091 minus 1,035. Ab 60 macht die Erwerbstätigkeit fast keinen Unterschied, unter 60 einen großen (1,091).“
- falsch: „Der Abstand ab 60 ist der Abstand unter 60 (B von `erwerb`, 1,091) plus die Interaktion (−1,035).“
- Sonderfall 1,091: „Das ist der Abstand unter 60. Ab 60 kommt die Interaktion dazu.“

Kurz gesagt: „Eine **Interaktion** heißt: Der Zusammenhang eines Prädiktors hängt vom Wert eines anderen ab. In R schreibst du `*` statt `+`. Die Zeile mit dem Doppelpunkt sagt, um wie viel der Abstand in der zweiten Gruppe anders ist. Ist sie klein und nicht signifikant, zeigen die Daten keinen Hinweis, dass der Abstand in den Gruppen verschieden ist; dann reicht meist das Modell mit `+`. „Nicht signifikant“ heißt aber nicht „sicher gleich“ (kennst du aus Sitzung 7): Wie groß ein Unterschied höchstens sein könnte, zeigt das Konfidenzintervall.“

Genauer erklärt „B lesen, wenn eine Interaktion im Modell ist“:
- „Mit Interaktion gilt B von `erwerb` nur für die Gruppe, in der `ab60` 0 ist, also unter 60. Es ist kein Durchschnitt über alle mehr.“
- „Ohne Interaktion (`ls01 ~ erwerb + ab60`) nimmt das Modell an, dass der Abstand in beiden Altersgruppen gleich ist. Das ist eine Voraussetzung: Stimmt sie nicht, beschreibt ein einzelnes B niemanden richtig.“
- „Die VIF steigen in Modellen mit Interaktion, weil `erwerb:ab60` aus `erwerb` und `ab60` gebaut ist. Das ist hier kein Problem (siehe Grundlage 3c).“

Häufige Verwechslung: „Interaktion heißt nicht, dass zwei Prädiktoren miteinander zusammenhängen. Erwerbstätigkeit und Alter hängen zusammen (Ältere sind seltener erwerbstätig), das ist Thema von Grundlage 1 und 3c. Interaktion heißt: Der Abstand, den der eine Prädiktor macht, ist je nach dem anderen verschieden.“

Link: „→ In der freien Karte: Interaktion“ (Begriff `interaction`).

### Aufgabe 4 „Ist die Ost-West-Lücke mit Abitur kleiner?“ (Zusatz)

Link „↑ Grundlage 4 nachlesen“.

Leitfrage: „Sind Befragte mit Abitur im Osten ähnlich zufrieden mit der Demokratie wie im Westen, oder gilt die Ost-West-Lücke für beide gleich?“

Ziel: „Am Ende kannst du eine Interaktion rechnen und lesen, die Lücke in zwei Gruppen ausrechnen und begründen, ob sie sich unterscheidet. Dazu kannst du sagen, warum kleine Gruppen vorsichtig machen.“

Grundlage: „Grundlage 4, Grenzen des Modells“.

Einleitung: „In Aufgabe 3 ist die Ost-West-Lücke mit Lage und Abitur im Modell nur wenig kleiner geworden. Das sagt aber noch nicht, ob die Lücke bei Befragten mit und ohne Abitur gleich groß ist. Das prüft eine Interaktion.“

**Erst festlegen** (Auswahl, „Tipp abgeben“): „Wie groß ist die Ost-West-Lücke bei Befragten mit Abitur, verglichen mit denen ohne?“ Optionen: „deutlich kleiner“, „kaum anders“, „deutlich größer“.

**Schritte:**

1. „Führe die Vorlage aus. Sie rechnet `demo ~ ost + abitur`: eine Lücke für alle. Lies B von `ost`.“

```r
# Ost-West-Unterschied und Abitur
# demo wie in Aufgabe 1, ost und abitur wie in Aufgabe 3
allbus %>%
  mutate(
    demo   = rec(ps03, rules = "rev"),
    ost    = rec(eastwest, rules = "1=0 [West]; 2=1 [Ost]"),
    abitur = rec(educ, rules = "1:3=0 [kein Abitur]; 4:5=1 [Abitur]; else=NA")
  ) %>%
  linear_regression(demo ~ ost ⟦+⟧ abitur, weights = wghtpew) %>%
  summary()
```

   Markierte Stellen (Liste für Screenreader): „Zeile 9: das Plus zwischen `ost` und `abitur`, in Schritt 2 gegen ein Sternchen tauschen.“

2. „Tausch das `+` gegen `*` und führe die Vorlage erneut aus. Jetzt gibt es eine Zeile `ost:abitur`. Lies B, Sig. und das Konfidenzintervall dieser Zeile.“ Schild „`*` in der Formel: neu heute“.

3. „Rechne die Lücke für Befragte mit Abitur aus: B von `ost` plus B von `ost:abitur`. B von `ost` ist jetzt die Lücke ohne Abitur. Die Vorlage rechnet noch das Beispiel aus Grundlage 4b (Abstand der Erwerbstätigen ab 60). Tausch beide markierten Zahlen gegen deine aus Schritt 2.“ Hilfezeile: „Kommazahlen mit Punkt, ein Minus gehört mit dazu.“

```r
# Unterschied in der zweiten Gruppe: B des Prädiktors plus B der Interaktion
# (hier noch das Beispiel aus Grundlage 4b: Erwerbstätige ab 60)
⟦1.091⟧ + ⟦-1.035⟧
```

   Ausgabe vor dem Tausch: `[1] 0.056`. Markierte Stellen: „Zeile 3: zwei Zahlen, B von `ost` und B von `ost:abitur`.“

4. „Deuten: Ist die Lücke mit Abitur anders? Und: In Aufgabe 2 beruhten zwei Gruppen auf 91 und 97 Befragten. Was folgt daraus für ihre B? (Fragen a4c und a4d unten)“

**Weiterdenken in der Probier-Werkstatt (für die Aufgabe nicht nötig),** zugeklappt: „Für die Aufgabe reichen die Vorlagen oben. Hier ist Platz für eigene Fragen. Eine Idee: Ist die Lücke bei Menschen, die sich politisch links einstufen, anders? Die Probier-Werkstatt startet mit einem Vorschlag.“

```r
# Eine Idee: Ist der Ost-West-Unterschied bei Menschen, die sich links einstufen, anders?
# links: pa01 1 bis 4 = links, 5 bis 10 = Mitte oder rechts
allbus %>%
  mutate(
    demo  = rec(ps03, rules = "rev"),
    ost   = rec(eastwest, rules = "1=0 [West]; 2=1 [Ost]"),
    links = rec(pa01, rules = "1:4=1 [links]; 5:10=0 [Mitte oder rechts]; else=NA")
  ) %>%
  linear_regression(demo ~ ost * links, weights = wghtpew) %>%
  summary()
```

(Zur Information: Konstante 4,128; ost −0,757; links 0,411; ost:links 0,286, Sig. ,011. Bei Links-Eingestuften ist die Lücke kleiner: −0,757 + 0,286 = −0,471.)

**Antwortfragen** (am Ende „Deine Festlegung vorher war: …“ und die Auflösung: „Kein deutlicher Unterschied: −0,631 ohne, −0,571 mit Abitur. Der Unterschied von 0,060 ist nicht signifikant; ganz ausschließen lässt sich ein Unterschied aber nicht (Konfidenzintervall −0,158 bis 0,277).“):

| id | Art | Label | Optionen | Ziel | Toleranz | Text richtig | Text falsch / Hinweis | Hilfezeile |
|---|---|---|---|---|---|---|---|---|
| a4a | number | Modell mit `*`: Wie groß ist B von `ost:abitur`? | – | 0.060 | 0.005 | 0,060: In diesen Daten ist die Lücke mit Abitur um 0,06 Punkte kleiner (weniger negativ). Ob das mehr als Zufall ist, klärt Frage a4c. | Hast du `+` gegen `*` getauscht? Dann gibt es eine Zeile `ost:abitur`, Spalte B. Sonderfall 0,012 (± 0,002): Das ist Beta. | Aus Schritt 2. |
| a4b | number | Wie groß ist die Ost-West-Lücke bei Befragten mit Abitur? | – | -0.571 | 0.01 | −0,571: −0,631 plus 0,060. Ohne Abitur −0,631. | Die Lücke mit Abitur ist B von `ost` (ohne Abitur) plus B der Interaktion. Sonderfall −0,604 (± 0,005): Das ist B von `ost` aus Schritt 1, eine Lücke für alle. Sonderfall −0,631: Das ist die Lücke ohne Abitur. | Ergebnis von Schritt 3. |
| a4c | choice | Was sagt die Zeile `ost:abitur` über die Lücke mit und ohne Abitur? | nein: „Die Daten zeigen keinen deutlichen Unterschied: 0,06 ist klein, nicht signifikant (Sig. ,590), und das Konfidenzintervall von −0,158 bis 0,277 schließt 0 ein.“; ja: „Mit Abitur ist die Lücke kleiner, also hilft Bildung gegen Unzufriedenheit im Osten.“; gleich: „Die Lücke ist mit und ohne Abitur nachweislich gleich groß, weil das Ergebnis nicht signifikant ist.“ | nein | – | Genau. Mit Abitur liegt die Demokratiezufriedenheit im Westen 0,450 höher, im Osten 0,510 (0,450 + 0,060): fast derselbe Abstand. Einen Unterschied der Lücke zeigen die Daten nicht; darum reicht das einfachere Modell ohne Interaktion (Schritt 1). Ganz ausschließen lässt er sich nicht: Nach dem Intervall könnte die Lücke mit Abitur auch bis zu 0,28 Punkte kleiner oder bis zu 0,16 Punkte größer sein. | bei „ja“: 0,06 ist sehr wenig, und die Daten passen auch zu 0 oder zu einer etwas größeren Lücke (Intervall −0,158 bis 0,277). Und „hilft gegen“ behauptet eine Ursache. Bei „gleich“: „Nicht signifikant“ heißt „kein Hinweis auf einen Unterschied“, nicht „gleich“ (kennst du aus Sitzung 7). Das Intervall reicht von −0,158 bis 0,277; auch ein mittlerer Unterschied passt noch zu den Daten. | Zeile `ost:abitur`: B, Sig., 95% CI. |
| a4d | choice | In Aufgabe 2 beruhte B von Ost→West auf 91 Befragten. Was folgt daraus? | einfluss: „Wenige ungewöhnliche Personen können dieses B merklich verschieben. Darum ist das Konfidenzintervall breit, und man prüft, ob das Ergebnis ohne auffällige Fälle hält.“; egal: „Nichts, die Gewichtung gleicht kleine Gruppen aus.“; falsch: „Das B ist falsch und sollte nicht berichtet werden.“ | einfluss | – | Genau. Bei kleinen Gruppen haben einzelne Fälle mehr Einfluss (Grundlage 4a). Berichten darf man das B, aber mit Konfidenzintervall und dem Hinweis auf die kleine Gruppe. | bei „egal“: Die Gewichtung passt die Anteile an, sie macht aus 91 Befragten nicht mehr Information. Bei „falsch“: Das B ist richtig gerechnet, nur unsicher. Unsicherheit berichtet man, statt das Ergebnis wegzulassen. | – |

**Hilfe, Stufe 1: Denkanstoß:** „Mit `*` bekommt das Modell eine eigene Zeile für die Frage „Ist der Abstand in der zweiten Gruppe anders?“. B von `ost` gilt dann nur für die Gruppe mit `abitur` = 0.“

**Hilfe, Stufe 2: Wo schaue ich?:** „Unter Coefficients die Zeilen `ost` und `ost:abitur`, Spalten B, Sig. und 95% CI. Für die Lücke mit Abitur zählst du die beiden B zusammen.“

**Hilfe, Stufe 3: Lösung:** „Schritt 1 (`+`): ost −0,604, abitur 0,460. Schritt 2 (`*`): Konstante 4,042, ost −0,631, abitur 0,450, ost:abitur 0,060 (Sig. ,590; KI −0,158 bis 0,277). Lücke mit Abitur: in der Taschenrechner-Vorlage `-0.631 + 0.060`, ergibt −0,571. Einen Unterschied der Lücke mit und ohne Abitur zeigen die Daten nicht (Sig. ,590, das Intervall schließt 0 ein); „sicher gleich“ ist das aber nicht. Kleine Gruppen wie die 91 Ost→West-Umgezogenen: einzelne Fälle haben mehr Einfluss, das B ist unsicher, also mit Konfidenzintervall berichten.“

**Ohne Grafik lösbar:** „Diese Aufgabe hat keine Grafik. Die Zahlen stehen in der Ausgabe der Vorlage, einmal mit `+` und einmal mit `*`.“

**Fürs Plenum:** „Zwei Sätze zur Wahl: „Mit und ohne Abitur ist die Ost-West-Lücke gleich groß.“ und „Wir finden keinen Hinweis, dass die Ost-West-Lücke mit Abitur anders ist.“ Welcher passt zu den Daten, und warum ist der Unterschied wichtig? Zum Vergleich: Die Probier-Idee mit der Links-rechts-Einstufung zeigt eine Interaktion, die signifikant ist.“

---

## 8 Überblick: Ein Modell bauen und prüfen

Kopf: „Überblick zu allen Aufgaben“, Titel „Ein Modell bauen und prüfen“. Unterzeile: „Alle vier Themen zusammen: wie Variablen ins Modell kommen, was du kontrollierst und was du prüfst.“

### Karte Ü1 „Wie kommt eine Variable ins Modell?“ (Schild „Zuordnen“)

**Bild Ü1 `s10-entscheidungsbaum` (Entscheidungsbaum wie in Sitzung 4):** Start „Was für eine Variable?“
- „Zahl oder Stufen mit Reihenfolge (Alter, Lage 1 bis 5)“ → „direkt in die Formel; bei Bedarf umpolen mit `rec(…, rules = "rev")`“
- „zwei Gruppen (Ost/West, Abitur ja/nein)“ → „0/1-Variable mit `rec()`; B = Abstand der Gruppe 1 zur Gruppe 0“
- „mehr als zwei Gruppen ohne Reihenfolge (Familienstand, Herkunft)“ → „`to_dummy()`, alle Dummies bis auf einen in die Formel; der fehlende ist die Referenz“
- Zusatzast: „Gilt ein Abstand nicht für alle?“ → „Interaktion mit `*`“
Textfassung Ü1: „Entscheidungsbaum. Zahlen oder Stufen mit Reihenfolge kommen direkt in die Formel, bei Bedarf umgepolt. Zwei Gruppen werden zu einer 0/1-Variable mit rec; B ist der Abstand der Gruppe 1 zur Gruppe 0. Mehr als zwei Gruppen ohne Reihenfolge werden mit to_dummy zu Dummies; alle bis auf einen kommen in die Formel, der fehlende ist die Referenz. Gilt ein Abstand nicht für alle, kommt eine Interaktion mit Sternchen dazu.“

**Zuordnen** (je Zeile Auswahl mit drei Optionen „direkt“, „0/1 mit rec()“, „to_dummy()“, Knopf „Prüfen“):
- „Konfession (evangelisch, katholisch, andere, keine)“ → to_dummy(). Rückmeldung richtig: „Vier Gruppen ohne Reihenfolge: Dummies, eine als Referenz.“ Falsch: „Die Codes der Konfession sind Namen, keine Stufen. Mehr als zwei Gruppen: to_dummy().“
- „Vertrauen in die Polizei, 1 bis 7“ → direkt. Richtig: „Stufen mit Reihenfolge: direkt.“ Falsch: „Sieben Stufen mit Reihenfolge kommen direkt in die Formel.“
- „deutsche Staatsangehörigkeit, ja oder nein“ → 0/1. Richtig: „Zwei Gruppen: eine 0/1-Variable.“ Falsch: „Bei zwei Gruppen reicht eine 0/1-Variable mit rec().“
- Gesamt: „Alles richtig zugeordnet.“ oder „… von 3 richtig.“

### Karte Ü2 „Was du kontrollierst“

Tabelle (echte `<table>`):

| Art von Variable | Beispiel aus diesem Kapitel | kontrollieren? |
|---|---|---|
| gemeinsame Ursache: steht vor beiden fest | das Alter, wenn du fragst, wie Gesundheit und Lebenszufriedenheit zusammenhängen | ja |
| Folge oder Zwischenschritt | Gesundheit beim Alter | nur, wenn du genau nach „bei gleicher …“ fragst; dann so berichten |
| misst sehr Ähnliches wie die abhängige Variable oder ist eher ihre Folge | Vertrauen in den Bundestag, wenn du nach der Ost-West-Lücke in der Demokratiezufriedenheit fragst (der enge Zusammenhang der beiden: Sitzung 9) | nein, es rechnet einen Teil dessen heraus, was du messen willst |
| misst fast dasselbe wie ein anderer Prädiktor | Alter und Altersgruppe | nein, einen weglassen oder Index bilden |

Text: „Bei jeder Kontrolle gehört in den Bericht: was konstant gehalten wurde, und was das B dann bedeutet.“

### Karte Ü3 „Voraussetzungen: was jede multiple Regression braucht“

Tabelle (echte `<table>`):

| Voraussetzung | So prüfst du | Wo im Kapitel |
|---|---|---|
| abhängige Variable metrisch oder mit vielen Stufen | Skalenniveau, Codebuch | Sitzung 9 |
| linearer Zusammenhang je Prädiktor | Mittelwerte je Stufe, Punktwolke | Sitzung 9 |
| gleiche Fehlervarianz | Residuen je Stufe, `levene_test()` | Sitzung 9 |
| keine starke Multikollinearität | VIF unter 10 (besser unter 5), keine Dummyfalle | Grundlage 2c, 3c, Aufgabe 3 |
| keine einzelnen Fälle mit großem Einfluss | Modell mit und ohne auffällige Fälle vergleichen | Grundlage 4a |
| gleicher Zusammenhang für alle | sonst Interaktion ins Modell | Grundlage 4b, Aufgabe 4 |
| genug Befragte je Gruppe und je Prädiktor | N, Gruppengrößen, korrigiertes R² | Aufgabe 2, Grundlage 3b |
| Aussagen über Deutschland | gewichtet rechnen | Sitzung 6 |

Text: „Für alle gilt: Eine Regression zeigt Zusammenhänge. Ob etwas Ursache ist, entscheidet nicht die Zahl, sondern die Begründung, was vor was kommt und was fehlen könnte.“

### Karte Ü4 „So schreibst du einen Satz über ein B“

Satzmuster (Kasten): „Bei gleicher/gleichem [kontrollierte Prädiktoren] geht [ein Schritt im Prädiktor] mit [B] Punkten mehr/weniger [abhängige Variable] einher.“ Und für Dummies: „[Gruppe] liegt im Mittel [B] Punkte über/unter [Referenzgruppe], bei gleicher/gleichem [Kontrollen].“
Beispiel (aus Grundlage 1, nicht aus einer Aufgabe): „Bei gleicher Gesundheit geht ein Jahr mehr Alter mit 0,024 Punkten mehr Lebenszufriedenheit einher; zehn Jahre mit 0,24 Punkten.“

Häufige Verwechslung: „„einhergehen“ ist kein umständliches Wort für „bewirken“. Es sagt genau, was die Regression zeigt: Wer höhere Werte hat, hat im Mittel auch höhere Vorhersagen.“

---

## 9 Mitnehmen

### Das Wichtigste aus dieser Sitzung
- „In einer multiplen Regression gilt jedes B bei gleichen Werten der anderen Prädiktoren. Kommt ein Prädiktor dazu, der mit beiden zusammenhängt, ändert sich B: Es kann kleiner werden (Aufgabe 1) oder größer (Grundlage 1).“
- „Beide B, mit und ohne Kontrolle, stimmen; sie beantworten verschiedene Fragen. Sag immer, was konstant gehalten wurde.“
- „Gruppen kommen als Dummies ins Modell: k Gruppen, k − 1 Dummies. Die Konstante ist der Mittelwert der Referenzgruppe, jedes B ein Abstand zu ihr. Andere Referenz, andere B, gleiche Vorhersagen.“
- „Beta vergleicht Prädiktoren in derselben Einheit. Das größte B ist nicht automatisch der stärkste Prädiktor.“
- „R² steigt mit jedem Prädiktor; das korrigierte R² nur, wenn er mehr erklärt als Zufall.“
- „VIF ab 10 heißt: Prädiktoren sagen fast dasselbe. Einzelne Fälle weit draußen können B kippen, vor allem in kleinen Gruppen. Gilt ein Abstand nicht für alle, gehört eine Interaktion mit `*` ins Modell.“
- „In R: `linear_regression(y ~ x1 + x2, weights = wghtpew) %>% summary()`, Dummies mit `to_dummy()`, Interaktion mit `*`.“

### Prüf dich selbst (6 Fragen, je Auswahl mit Begründung bei jeder Option)

1. „Im Modell `ls01 ~ age + gesund` ist B für `age` 0,024. Was heißt das?“
   - „Bei gleicher Gesundheit geht ein Jahr mehr mit 0,024 Punkten mehr Lebenszufriedenheit einher.“ ✓ „Genau: B gilt bei gleichem Wert der anderen Prädiktoren.“
   - „Ältere sind insgesamt 0,024 Punkte pro Jahr zufriedener.“ ✗ „Insgesamt, ohne Gesundheit, sind es 0,008 pro Jahr. 0,024 gilt bei gleicher Gesundheit.“
   - „Das Alter erklärt 2,4 % der Lebenszufriedenheit.“ ✗ „B ist keine Prozentzahl; wie viel erklärt wird, sagt R².“
2. „Mit Referenz „ledig“ hat „geschieden“ B = −0,059. Was ist −0,059?“
   - „der Abstand der Geschiedenen zu den Ledigen“ ✓ „Genau. Der Mittelwert der Geschiedenen ist Konstante plus B: 7,042 − 0,059 = 6,983.“
   - „die mittlere Zufriedenheit der Geschiedenen“ ✗ „Das wäre Konstante plus B, 6,983. B allein ist der Abstand.“
   - „der Abstand der Geschiedenen zum Durchschnitt aller“ ✗ „Verglichen wird mit der Referenzgruppe, nicht mit allen.“
3. „Prädiktor A hat B = 0,8 und Beta = 0,10, Prädiktor B hat B = 0,02 und Beta = 0,30 (im selben Modell). Welcher hängt stärker mit der abhängigen Variable zusammen?“
   - „B, wegen des größeren Beta“ ✓ „Genau. B hängt an der Einheit, Beta nicht.“
   - „A, wegen des größeren B“ ✗ „Ein großes B kann von einer großen Einheit kommen. Vergleich mit Beta.“
   - „Beide gleich stark“ ✗ „Beta unterscheidet sich deutlich: 0,30 gegen 0,10.“
4. „Ein Modell mit 40 Befragten und 8 Prädiktoren hat R² 0,30 und korrigiertes R² 0,12. Was schließt du?“
   - „Ein großer Teil von R² könnte Zufall sein; viele Prädiktoren für wenige Befragte.“ ✓ „Genau. Die Korrektur zieht viel ab, weil auf jeden Prädiktor nur 5 Befragte kommen.“
   - „Das Modell erklärt sicher 30 %.“ ✗ „R² steigt mit jedem Prädiktor, auch mit nutzlosen. Bei so wenigen Befragten ist das korrigierte R² ehrlicher.“
   - „R hat falsch gerechnet.“ ✗ „Beide Zahlen sind richtig. Sie unterscheiden sich, weil das korrigierte R² für jeden Prädiktor etwas abzieht.“
5. „Zwei Prädiktoren haben VIF 15. Was passiert?“
   - „Ihre B werden unsicher, weil das Modell die beiden kaum trennen kann.“ ✓ „Genau. Die Standardfehler werden groß, B kann springen.“
   - „Beide hängen sehr stark mit der abhängigen Variable zusammen.“ ✗ „Der VIF misst den Zusammenhang der Prädiktoren untereinander, nicht mit der abhängigen Variable.“
   - „Nichts, VIF ist nur eine Zusatzinformation.“ ✗ „Ab 10 meldet mariposa ein Problem. Einen weglassen oder zusammenfassen.“
6. „Du willst wissen, ob Ostdeutsche weniger zufrieden mit der Demokratie sind. Solltest du das Vertrauen in den Bundestag kontrollieren?“
   - „Nein: Es misst sehr Ähnliches wie die Demokratiezufriedenheit und kann selbst eine Folge davon sein.“ ✓ „Genau. Wer es kontrolliert, rechnet einen großen Teil dessen heraus, was er messen will.“
   - „Ja: Je mehr Kontrollen, desto genauer.“ ✗ „Mehr Kontrollen sind nicht automatisch besser. Kontrolliere gemeinsame Ursachen, nicht Variablen, die fast dasselbe messen wie die abhängige Variable oder aus ihr folgen.“
   - „Ja, weil es mit beiden zusammenhängt.“ ✗ „Zusammenhang allein reicht nicht. Entscheidend ist, ob es vorher feststeht (gemeinsame Ursache) oder fast dasselbe misst.“

### Dein Skript zum Mitnehmen

Text: „Alle Vorlagen dieser Sitzung in einer Datei, mit Kommentaren. Öffne sie in RStudio und führe sie Block für Block aus.“ Knopf „Skript herunterladen (sitzung10.R)“, Link „→ Nachlesen im R-Workshop, Kapitel 9“.

Inhalt von `sitzung10.R` (in dieser Reihenfolge, Vorlagen gelöst, jeweils mit einer Leerzeile dazwischen):
1. Kopfkommentar: „# Sitzung 10: Regression vertiefen“ und „# ALLBUS 2023, gewichtet mit wghtpew“.
2. Vorlage `start`.
3. Kommentar „# --- R lesen ---“, Vorlagen `r_modell`, `r_dummy`.
4. Kommentar „# --- Aufgabe 1 ---“, Vorlage `a1` gelöst (`demo ~ lage + dlage`), davor Kommentar „# Schritt 1 mit demo ~ lage, Schritt 2 mit demo ~ lage + dlage“.
5. Kommentar „# --- Aufgabe 2 ---“, Vorlage `a2` wie sie dasteht (Referenz West-Bleibende), Vorlage `a2_rechnen` gelöst (`4.243 + -0.166`), dann „# Referenz Ost-Bleibende: dg03_1 fehlt“, `a2` gelöst (`dg03_4` statt `dg03_1`) und `a2_rechnen` mit `3.537 + 0.540`.
6. Kommentar „# --- Aufgabe 3 ---“, Vorlagen `a3` und `a3_ost`.
7. Kommentar „# --- Aufgabe 4 (Zusatz) ---“, Vorlage `a4` gelöst (`ost * abitur`) und Vorlage `a4_rechnen` gelöst (`-0.631 + 0.060`).
8. Kommentar „# --- Ideen zum Weiterdenken ---“, die vier Probier-Vorschläge.

(Das Skript `sitzung10-zahlen.R` baut genau diese Datei zusammen und führt sie einmal am Stück aus.)

---

## 10 Hilfe bei R-Fehlermeldungen (für die Fehlerhilfe der Werkstatt und Hilfe-Stufe 2)

| Meldung (Ausschnitt) | Was passiert ist | Was du tust |
|---|---|---|
| `Variables not found in data: `demo` and `lage`.` | Die Variablen gibt es noch nicht: Der `mutate()`-Teil fehlt oder wurde gelöscht. Jede Werkstatt beginnt mit dem frischen `allbus`. | Die ganze Vorlage ausführen, mit `mutate()`. Mit „Zurücksetzen“ holst du sie zurück. |
| `Variable not found in data: `dg03_5`.` | `dg03` hat nur vier Gruppen, also gibt es nur `dg03_1` bis `dg03_4`. | Nur Dummies mit vorhandenen Codes nehmen. |
| `Variables not found in data: `dg03_1` and `dg03_2`.` | `to_dummy(dg03)` fehlt in der Kette. | Die Zeile `to_dummy(dg03) %>%` vor `linear_regression()` stehen lassen. |
| `konnte Funktion "dlage" nicht finden` | In der Formel steht `%>%` statt `+` (`demo ~ lage %>% dlage`). | Prädiktoren in der Formel mit `+` verbinden. |
| `Unerwartete(s) ','` | In der Formel steht ein `+` ohne Prädiktor dahinter (`demo ~ lage + , weights = …`). | Den Prädiktor hinter `+` ergänzen oder das `+` löschen. |
| kein Fehler, aber in „Formula“ fehlt ein Prädiktor | Komma statt Plus (`demo ~ lage, dlage`). R rechnet still nur mit `lage`. | Zeile „Formula“ prüfen; Prädiktoren mit `+` verbinden. |
| `ℹ Excluded due to perfect collinearity (matching SPSS): `dg03_4`` | Kein Fehler: Alle vier Dummies stehen in der Formel (Dummyfalle). R wirft einen hinaus; er wird zur Referenz. | Absichtlich einen Dummy weglassen, damit du selbst wählst, wer die Referenz ist. |
| `Note: labelled predictor(s) … entered with their numeric codes` | Kein Fehler: R rechnet mit den Codes als Zahlen. | Bei Stufen (Lage 1 bis 5) in Ordnung. Bei Gruppen ohne Reihenfolge Dummies bilden. |
| Kopfzeile „Linear Regression Results“ ohne „Weighted“ | `weights = wghtpew` fehlt; die Zahlen weichen dann von den Zielwerten ab. | `weights = wghtpew` ergänzen. |
| `konnte Funktion "linear_regresion" nicht finden` | Tippfehler im Funktionsnamen. | `linear_regression` mit zwei s. |

---

## 11 Entscheidungen (selbst getroffen, mit Begründung)

- **E1 Themenzuschnitt:** Kontrollieren zuerst, Dummies danach. Grund: Der Kern der Sitzung ist die Leitfrage „Was bleibt, wenn man mehr berücksichtigt?“, und der Schritt von Sitzung 9 (ein Prädiktor) zu zwei Prädiktoren ist der kleinste. Dummies erweitern das dann auf Gruppen. Beta, korrigiertes R² und VIF stehen zusammen in Thema 3, weil sie alle in derselben Ausgabe stehen und Aufgabe 3 sie gemeinsam liest. Ausreißer/Einfluss und Interaktion (beide in `curriculum.ts` als eingeführt geführt) bilden Thema 4 als Zusatz; ihre Voraussetzungen-Seite steht im Überblick für alle.
- **E2 Drei Pflichtaufgaben:** A1 bis A3 Pflicht (etwa 40 Minuten), A4 Zusatz. Interaktion ist für schwache Studierende der schwerste Teil und wird im Überblick und in der Grundlage trotzdem erklärt.
- **E3 Variablen getrennt, Alter nur in den Grundlagen:** Das Alter ist für die Grundlagen das anschaulichste Beispiel (verdeckter Zusammenhang, Beta mit Jahren gegen Stufen, VIF mit Altersgruppe, Interaktion mit „ab 60“). Darum kommt es in keiner Aufgabe vor; Aufgabe 3 zeigt die Einheiten-Falle stattdessen an `abitur` gegen `lage` (größeres B, kleineres Beta). Aufgabe 4 nutzt deshalb `abitur` als zweite Variable statt einer Altersgrenze; ost × ab60 wäre signifikant (−0,317), ist aber gesperrt, weil `ab60` in Grundlage 4b steht.
- **E4 Durchgehende abhängige Variable `demo`:** A1 bis A4 nutzen die umgepolte Demokratiezufriedenheit mit demselben Namen `demo` wie Sitzung 9 (`sitzung09-zahlen.R`) und `lage` = `rec(ep03, rules = "rev")` wie dort. So müssen Studierende nur die Prädiktoren neu verstehen. Die alte Aufgabe nutzte dieselbe Variable (ps03) und dieselbe Kernfrage (dg03, Prägung oder Ort); ihr Rollenszenario entfällt.
- **E5 `pa01` nur in einer Probier-Werkstatt:** Sitzung 9 zeigt in ihrer Zusatzaufgabe, dass `pa01` nicht linear mit `demo` zusammenhängt. Als linearer Prädiktor in A3 wäre das ein Widerspruch. In der Probier-Idee zu A4 kommt es nur als 0/1-Variable `links` vor.
- **E6 `to_dummy()` statt `to_label()`:** Der Leitfaden führt `to_dummy()` für Sitzung 10. Mit `to_dummy()` sieht und wählt man die Referenz selbst (Kern von A2). Die Abkürzung über `to_label()` wird in Grundlage 2b nur genannt, weil die Notiz in jeder Ausgabe darauf verweist.
- **E7 Dummyfalle in mariposa 0.7.4:** Das alte Konzept nannte einen VIF-Fehler (negative Riesenwerte) in 0.7.3. In 0.7.4 wirft mariposa den überzähligen Dummy hinaus und meldet „Excluded due to perfect collinearity (matching SPSS)“. Das Kapitel nutzt diese Meldung als Lernanlass (Grundlage 2c, Fehlerhilfe).
- **E8 Gewichtetes N:** mariposa gibt bei Gewichtung N als gerundete Summe der Gewichte aus (z. B. 3.222 statt gezählter 3.254 in A2). Keine Antwortfrage fragt nach N; der Unterschied steht als Hinweis unter A2 und in R2.
- **E9 Antwortprüfung:** Alle Zielwerte sind Dezimalzahlen mit drei Stellen wie in der mariposa-Ausgabe. Die Antwortprüfung (`src/chapter/answers.ts`) prüft jede Lesart einer Eingabe („4.243“ als 4,243 und als 4243); weil kein Zielwert eine ganze Zahl über 999 ist, trifft nur die gemeinte Lesart. Negative Zielwerte (a2b, a3f, a4b) nehmen „-0.705“, „−0,705“ und „-0,705“ an. Toleranzen: 0,005 für B und Konstanten (nimmt auch zwei Stellen an), 0,002 für Beta, 0,0004 für korrigiertes R² (sonst gälte der Sonderfall R² 0,259 als richtig), 0,01 für selbst gerechnete Summen. Kein Sonderfall liegt innerhalb der Toleranz seines Zielwerts (im Skript geprüft).
- **E10 Konstruierte Beispiele:** Einfluss (4a, zwölf Punkte) und korrigiertes R² (3b, 30 Befragte mit Würfeln, `set.seed(107)`) sind konstruiert und im Skript nachgerechnet. Echte Einzelfälle aus dem ALLBUS kommen nicht vor.
- **E11 Jede Vorlage für sich:** Jede Vorlage bildet ihre Variablen in der eigenen Kette (Nachtrag zum Auftrag). Darum gibt es kein `allbus <- allbus %>% mutate(…)` und keine Objekte wie `modell <-`. Zusammengehörige Schritte (vor und nach einer Änderung) nutzen dieselbe Vorlage, die zweimal ausgeführt wird.
- **E12 Zahlen im Bild B1:** Die Mittelwerte je Altersgruppe sind auf Befragte mit Angaben zu Alter, Gesundheit und Lebenszufriedenheit gerechnet, damit „alle“ und die drei Gesundheitslinien dieselben Personen zeigen. Die Prozentstreifen sind nach größten Resten gerundet (Summe 100).
- **E13 Markierung in `a3_ost`:** Die zweite Vorlage von A3 trägt eine Markierung nur als Einladung zum Weiterbauen; die Antworten nutzen sie unverändert. Der Bauende kann sie weglassen, falls die Werkstatt Markierungen nur für Pflichtänderungen vorsieht.

## 12 Abweichungen zu den Folien

Folien zu Sitzung 10 gibt es noch nicht (`Seminarvorbereitung/` enthält nur Sitzung 1 bis 4). Für die spätere Folienarbeit: Code in derselben Schreibweise (`demo`, `to_dummy()`, Kette mit `mutate()` in jeder Vorlage, `%>% summary()`), Aufgaben-Variablen nicht auf den Folien vorwegnehmen (ps03 mit ep03/ep01, dg03, eastwest × educ), Grundlagen-Beispiele dürfen auf die Folien.

---

## Prüfung (Agent, 23.11.2026)

Geprüft nach `teil-b-plan-pruefung.md`, abgeglichen mit `sitzung09.md` (nach dessen Prüfung) und `sitzung11.md`. `Rscript sitzung10-zahlen.R` läuft mit Exit 0 (etwa 5 Sekunden); neue Zahlen stehen im Abschnitt „Nachgetragen bei der Prüfung“ des Skripts.

### 1 Schwache Studentin ohne Vorwissen
Durchgespielt (langsam): R lesen 8 Min., A1 13, A2 16, A3 13 Min.; Pflicht zusammen etwa 42 Minuten, knapp, aber machbar. Jeder Schritt ist mit Grundlage, Vorlage und Hilfezeilen lösbar; die Taschenrechner-Vorlagen mit Minuszahlen sind durch die Hilfezeile abgesichert.
- **Geändert:** Grundlage 1a verriet die Auflösung von „Erst festlegen“ in A1 („B wird kleiner … das siehst du in Aufgabe 1“). Jetzt: „Welcher Fall in Aufgabe 1 eintritt, findest du dort selbst heraus.“
- **Geändert:** In B6 stand die Vorhersage für Verheiratete als 7,695, in 2a als 7,694, und die Konstante 7,042 erscheint sowohl für alle Nicht-Verheirateten (2a) als auch für die Ledigen (B6). Fußnote erklärt Rundung und Zufall (4. Stelle verschieden, im Skript geprüft), damit niemand „7,042 = Ledige“ verallgemeinert.
- **Geändert:** Abgrenzung von `abitur` in der Einleitung zu A3 nach den Codes von `educ` (vorher „ein anderer deutscher Schulabschluss“, obwohl Code 1 „ohne Abschluss“ ist).
- **Offen, bewusst nicht geändert:** A2 bis A3 haben je sechs Antwortfragen. Kürzen hätte Deuten-Fragen gekostet; wenn der Testlauf in Sitzung 4 zeigt, dass 45 Minuten nicht reichen, a2f (Referenzwechsel) zur Zusatzfrage machen.

### 2 Didaktik
Jede Grundlage führt direkt in ihre Aufgabe; die Aufgaben verlangen Festlegen und Deuten. Kontrast Grundlage 1 (B steigt, verdeckter Zusammenhang) gegen A1 (B sinkt) ist gelungen.
- **A4 als Lernmoment:** Die nicht signifikante Interaktion ist ein guter Lernanlass, aber nur, wenn „kein Hinweis auf einen Unterschied“ nicht als „gleich“ gelesen wird. Vorher stand in a4c, im Hilfetext und in Grundlage 4b „gilt etwa gleich“ bzw. „Die Lücke ist mit und ohne Abitur etwa gleich“, dazu „Abitur hebt die Demokratiezufriedenheit“ (kausal) und „in Ost und West etwa gleich (B 0,450)“, obwohl 0,450 nur für den Westen gilt. **Geändert:** a4c fragt jetzt „Was sagt die Zeile `ost:abitur` …?“; der Ablenker zu R² ist ersetzt durch „nachweislich gleich, weil nicht signifikant“ (Rückgriff auf Sitzung 7). Die Rückmeldung nennt den Abitur-Abstand im Westen 0,450 und im Osten 0,510 und den Spielraum aus dem Konfidenzintervall (bis 0,28 kleiner, bis 0,16 größer). Auflösung, Hilfe Stufe 3, a4a und Grundlage 4b „Kurz gesagt“ entsprechend. Neu: „Fürs Plenum“ mit zwei Sätzen zur Wahl („gleich groß“ gegen „kein Hinweis auf einen Unterschied“) und dem Verweis auf die signifikante Interaktion in der Probier-Idee.
- **Geändert:** Einleitung A4 schrieb das Ergebnis von A3 dem Abitur allein zu; jetzt „mit Lage und Abitur im Modell“.
- **Geändert:** Grundlage 4a trennt Ausreißer (Residuum), Hebelwirkung (Leverage, neu als Fachbegriff, weil die Rückmeldung schon vom „Hebel“ spricht) und Einfluss; Cooks Distanz als Name genannt (Sitzung 9 kündigt an, dass Sitzung 10 zeigt, wie man Einfluss misst). Die „Häufige Verwechslung“ passte nicht zu ihrem Beispiel (behauptete „Einfluss ist kein Ausreißer“, zeigte „weit draußen ohne Einfluss“); jetzt stimmig mit Zustand 2 und 4.
- **Geändert:** a2d nennt Selektion als mögliche Erklärung (Umziehende unterscheiden sich auch sonst).
- **Offen:** Die Probier-Werkstätten sind echte Anschlussfragen; nichts geändert.

### 3 Fachliches und Barrierefreiheit
Alle Zahlen per Rscript bestätigt; zusätzlich nachgerechnet: Abstand im Osten 0,510, KI-Spielraum, Gleichstand 7,042, KI-Breite je Referenz (0,86 gegen 0,47), 1.596 TNZ: SPLIT bei ps03.
- **Geändert (Zielwert):** a3d hatte Toleranz 0,001 bei Ziel 0,258; damit hätte die Antwortprüfung (`answers.ts`: richtig, wenn irgendeine Lesart innerhalb der Toleranz liegt) den Sonderfall R² 0,259 als richtig gewertet. Toleranz jetzt 0,0004; das Skript prüft für alle 17 Zahlenfragen, dass kein Sonderfall in der Toleranz liegt. E9 an die tatsächliche Arbeitsweise von `answers.ts` angepasst.
- **Geändert (Formulierung):** Ü2 nannte „Abitur bei Herkunft und Demokratiezufriedenheit“ als gemeinsame Ursache; das Abitur kann nicht die Herkunft (Jugend) verursachen. Jetzt: das Alter bei Gesundheit und Lebenszufriedenheit (Gegenstück zur Zeile „Gesundheit beim Alter“). „Vertrauen in den Bundestag misst fast dasselbe wie die Demokratiezufriedenheit“ war überzogen; jetzt „sehr Ähnliches oder eher ihre Folge“ (Ü2, 1c, Prüf dich 6). a3f ohne „erklären“ im kausalen Sinn. 3b: „weniger als der Zufall“ präzisiert; Toleranz beim VIF bezieht sich auf alle anderen Prädiktoren.
- **Geändert (Anschlüsse an Sitzung 9 und früher):** AV/UV aus Sitzung 5 (vorher 9), Prädiktor aus 9; Dummyvariable 0/1 aus Sitzung 5 (Schild in 2a); Drittvariable aus Sitzung 6 (Schild in 1c); „Codes sind Namen“ aus Sitzung 2 (vorher 3); TNZ: SPLIT aus Sitzung 1 (vorher „Split, Sitzung 3“). Adjusted R Square zeigt Sitzung 9 kurz („wird in Sitzung 10 wichtig“): R2- und 3b-Schilder jetzt „kennst du aus Sitzung 9“, nur VIF „neu heute“. A1 trägt „demo und lage: kennst du aus Sitzung 9“ (gleiche Bildung wie dort). Die Demokratiefrage bekamen etwa zwei Drittel (vorher „ein Teil“). Liste „schon bekannt“ im Kopf ergänzt.
- **Barrierefreiheit:** Jedes Bild hat eine Textfassung mit Werten, alle Aufgaben sind ohne Grafik lösbar. Keine Änderung nötig. Sprache: Du-Form, kein „(fiktiv)“, kein „·“; R-Stil eingehalten (Skript prüft `|>`, `is.na`, `ifelse`).
- **Offen, bewusst nicht geändert:** „Eine Journalistin fragt“ in 1c ist eine einzelne Frageformel, kein Rollenszenario. E13 (Markierung in `a3_ost` nur als Einladung) bleibt dem Bauenden überlassen.

## Nacharbeit nach Kapitelprüfung (23.11.2026)

- **R2 Ausgabe:** Der Text der Ausgabe steht jetzt in einem Bereich (`role="region"`, Name „Ausgabe von summary() …“), das `<pre>` bleibt mit `tabIndex 0` fokussierbar, trägt aber kein eigenes `aria-label` mehr. Das Schild „heute nicht nötig“ am ANOVA-Block hat eine Lesetext-Fassung („Heute nicht nötig: “, nur für Screenreader) statt `aria-hidden` allein. Neu in der Tabellenfassung: Tabelle „Kopf der Ausgabe“ mit Formula, N und Weights (Werte aus `MODEL_AG`: `formula`, `n`, `weights`).
- **B12 VIF:** Die Werte der Tabelle (Sig. .006, Standardfehler 0,025, Sig. <.001) stehen jetzt in `COLLINEAR` und `MODEL_AG` (Felder `p`, `se`) und die Tabelle liest sie von dort. Der lokale Test (`allbus.local.test.ts`) prüft sie gegen die ALLBUS-Daten.
- **B8 Lineal:** Beschriftung „Alter 18 bis 99“ (der Test prüft das Höchstalter 99 in den Daten); die Skala des Lineals läuft entsprechend über 81 Jahre.
- **B12 Marke:** „10: mariposa meldet ein Problem“ (zweizeilig, Bild etwas breiter).
- **B6 Textfassung:** „… die mittlere Lebenszufriedenheit der Ledigen“ (je Gruppe der passende Genitiv) statt „der Gruppe ledig“.
- **B4 und B14:** Die Fußzeilen („ALLBUS 2023, gewichtet …“, „Erwerbstätig: … (work 1 bis 3)“) stehen außerhalb von `role="img"`, damit sie vorgelesen werden.
- **A4 Festlegen:** Die Option „etwa gleich“ heißt jetzt „kaum anders“ (die Lücke ist nicht „gleich“; passt zur Rückmeldung zu `ost:abitur`).
- **Auflösung:** Die Auflösung erscheint nur, wenn keine Frage der Aufgabe mehr offen ist (`noneOpen` in `Check.tsx`); geprüft, unverändert.
- **Nicht umgebaut:** `MapLink`, `knownNote` und weitere neue Bausteine ersetzen hier keine lokale Notlösung, die sich ohne Umbau funktionierender Fragen-Komponenten lohnt.
