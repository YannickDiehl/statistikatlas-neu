# Sitzung 11 „Logistische Regression“: Inhaltsplan für das Kapitel

Stand: 23.11.2026. Teil B des Rollouts (`docs/entwicklung/plaene/2026-11-23-lernpfad-kapitel-rollout.md`, Task 10), nach dem Muster von Sitzung 4 (`prototyp/sitzung4.html`, umgesetzt in `src/chapter/s04/`). Bisherige Aufgabe: `src/tasks/s10-buergerrat/` (Konzept `2026-09-29-lernpfad-aufgaben/sitzung-10.md`, alte Nummerierung). Sitzungsplan 12 („andere Regressionsarten, vor allem logistische Regression“).

- **Daten:** ALLBUS 2023, ZA8831 v1.3.0, **gewichtet mit `wghtpew`** (wie ab Sitzung 6 und wie die alte Aufgabe). Nur Aggregate. Steine und Personen mit Einzelwerten sind konstruierte Beispiele („zum Beispiel …“).
- **Zahlen:** jede Zahl dieses Plans steht in `sitzung11-zahlen.R` (gleicher Ordner) und wird dort gegen die gedruckte Ausgabe von mariposa 0.7.4 geprüft. Das Skript führt jede Codevorlage **in einer frischen Umgebung** aus, in der nur `allbus` (frisch geladen) existiert, genau wie die Code-Werkstatt, und prüft, dass jede Vorlage wörtlich in diesem Plan steht. `Rscript sitzung11-zahlen.R` läuft ohne Fehler (etwa 15 Sekunden).
- **Jede Vorlage läuft für sich** (Nachtrag zum Auftrag): Die Werkstatt setzt `allbus` vor jedem Ausführen zurück. Darum bildet jede Vorlage `waehlen`, `pflicht` und `interesse` in ihrer eigenen Kette (`mutate()` vorn), und der Kommentar sagt „wie in Aufgabe 1“ bzw. „Modell wie in Aufgabe 2“. Zwischenobjekte (`modell`, `profile`, `smartphone`, `leute`) entstehen nur innerhalb derselben Vorlage.
- **Bausteine:** wie Sitzung 4 (`src/chapter/blocks/`, `src/chapter/workshop/`). Daten und Texte gehören in `src/chapter/s11/content.ts`, feste Zielwerte in `allbus.local.test.ts`.
- **Schreibweise in diesem Plan:** Texte in „…“ oder als Absatz sind Volltext fürs Kapitel. `code` bleibt im Kapitel Code. ⟦…⟧ markiert anzupassende Stellen in Vorlagen.

---

## 1 Kopf

**Stein:** 11. **Titel:** Logistische Regression.

**Leitfrage (Begleitfigur):** „Wer geht wählen – und wie wahrscheinlich?“ (wie in `curriculum.ts`).

**Wegweiser (drei Kacheln):**
- „Vorweg: R lesen“ – „ein logistisches Modell, exp(), predict(), marginal_effects()“
- „Vier Themen“ – „je erst die Grundlage, dann die Aufgabe; im Seminar direkt zur Aufgabe springen“
- „Zum Schluss“ – „Überblick, Wichtigstes, Selbsttest, Skript“

**Was du nach dieser Sitzung kannst** (Lernziele, als Liste):
1. erklären, warum man für eine Variable mit nur zwei Ausprägungen (0 und 1) keine Gerade nimmt, und eine Wahrscheinlichkeit in eine Chance (Odds) und einen Logit übersetzen und zurück *(Verfahren)*
2. ein logistisches Modell gewichtet schätzen und in der Ausgabe B, Exp(B) und Sig. finden *(Verfahren)*
3. Exp(B) in Alltagssprache deuten: ein Faktor für die Chance, nicht für die Wahrscheinlichkeit *(Interpretation)*
4. vorhergesagte Wahrscheinlichkeiten für Beispielpersonen ausrechnen und erklären, warum derselbe Faktor je nach Ausgangspunkt verschieden viele Prozentpunkte bringt; den durchschnittlichen marginalen Effekt (AME) als Mittelwert lesen *(Interpretation)*
5. die Güte eines Modells einschätzen: Trefferquote gegen die einfachste Regel, −2LL und Omnibus-Test, Pseudo-R² *(Interpretation)*
6. die Voraussetzungen nennen: richtig kodierte 0/1-Variable, genug Fälle in der selteneren Gruppe, gleichmäßiger Verlauf im Logit, unabhängige Fälle, Gewichtung für Aussagen über Deutschland, keine Ursache aus Zusammenhang *(Voraussetzungen)*
7. `logistic_regression()`, `exp()`, `tibble()` mit `c()`, `predict(…, type = "response")` und `marginal_effects()` lesen und anpassen *(Code lesen)*

**Hinweis „schon bekannt“ (grau):** „Schon bekannt und hier nur kurz erinnert: der Startblock und `lm30` mit seinem TNZ: FILTER (Sitzung 1), Ketten mit `%>%` (Sitzung 4), neue Variablen mit `rec()` in `mutate()`, auch Umpolen mit `rules = "rev"`, und Kreuztabellen mit Zeilenprozent (Sitzung 5), Gewichten mit `weights = wghtpew` (Sitzung 6), `summary()`, Sig. und Konfidenzintervall (Sitzung 7), die lineare Regression mit Konstante, B und Vorhersage = Konstante + B × Wert (Sitzung 9), mehrere Prädiktoren mit `+` und „bei gleichem …“ (Sitzung 10). Solche Stellen tragen ein graues Schild „kennst du aus Sitzung …“.“

**So arbeitest du mit dieser Seite:** die vier Zeilen wie in Sitzung 4 (Genauer erklärt, Kurz überlegen, Code-Werkstatt, markierte Stellen), dazu eine fünfte Zeile (gemeinsamer Baustein `howToExtra`): „Jede Vorlage läuft für sich: Sie bildet die Variablen, die sie braucht, selbst. Steht im Kommentar „wie in Aufgabe 1“, kennst du diesen Teil schon.“

**Sprungknöpfe fürs Seminar:** „Im Seminar? Jedes Thema beginnt mit seiner Grundlage zum Vertiefen der Folien. Wer sie schon kann, springt direkt zur Aufgabe:“ Aufgabe 1, Aufgabe 2, Aufgabe 3, Aufgabe 4.

**Hinweis Gewichtung (klein, unter den Sprungknöpfen):** „Alle Zahlen in diesem Kapitel sind gewichtet mit `wghtpew`, genau wie die Ausgabe deiner Vorlagen (kennst du aus Sitzung 6). Darum steht unter N oft eine gewichtete Zahl, die etwas von der Zahl der befragten Personen abweicht.“

---

## 2 Themen, Grundlagen, Aufgaben

| Thema | Grundlage (Variablen) | Aufgabe (Variablen) | Art | Zeit |
|---|---|---|---|---|
| 1 Ja oder nein: warum keine Gerade? | 1a 0/1-Turm (Beispiel zehn Steine), 1b Smartphone fürs Internet nach Alter: Punkte, Gerade, S-Kurve (`lm30` × `age`), 1c drei Sprachen: Wahrscheinlichkeit, Chance, Logit (Übersetzer) | A1 „Wer will wählen gehen?“ (`pv01` → `waehlen`, `pe09` → `pflicht`; `frequency()`, `crosstab()`, Taschenrechner) | **Pflicht** | G 15, A 14 Min. |
| 2 Das Modell: B und Exp(B) | 2a Gerade im Logit, S-Kurve in Prozent (`lm30 ~ age`), 2b Exp(B) als Faktor für die Chance, 2c die Ausgabe lesen | A2 „Was heißt Exp(B) für das Pflichtgefühl?“ (`waehlen ~ pflicht + interesse`, `pa02a` → `interesse`) | **Pflicht** | G 12, A 12 Min. |
| 3 Vorhergesagte Wahrscheinlichkeiten | 3a vom Logit zurück zur Wahrscheinlichkeit, 3b gleicher Faktor, verschiedene Prozentpunkte (30 → 40 und 70 → 80 Jahre), 3c AME | A3 „Was heißt das in Prozent?“ (Person A und B, von Hand, `predict()`, `marginal_effects()`) | **Pflicht** | G 12, A 17 Min. |
| 4 Wie gut ist das Modell? | 4a Trefferquote gegen „alle Ja“, 4b −2LL und Omnibus-Test, 4c Pseudo-R² (`lm30 ~ age`) | A4 „Erkennt das Modell, wer nicht wählen will?“ (Modell aus A2) | Zusatz | G 10, A 10 Min. |
| Überblick | Drei Sprachen, eine Zahl; welche Regression wann (Entscheidungsbaum); Voraussetzungen | – | – | 5 Min. |

Pflichtaufgaben zusammen etwa 43 Minuten (langsame Bearbeitung: Vorlage ausführen, Ausgabe suchen, je Frage etwa eine Minute). Die Grundlagen nutzen nur `lm30` und `age`, die Aufgaben nur `pv01`, `pe09` und `pa02a`; die Grundlagen verraten keine Zahl der Aufgaben. Die Variablen der Aufgaben kennen die Studierenden aus früheren Sitzungen (`pv01` Sitzung 2, 3, 5; `pa02a` Sitzung 2, 4), `pe09` ist neu.

---

## 3 Vorweg: R lesen

### Karte R1 „R lesen: ein logistisches Modell“ (Schilder: „Startblock: kennst du aus Sitzung 1“, „Modell wie linear_regression(): kennst du aus Sitzung 9“, „logistic_regression(): neu heute“, „Code lesen“)

Text: „Den Startblock kennst du aus Sitzung 1. In RStudio führst du ihn zu Beginn aus. In der Code-Werkstatt hier auf der Seite ist das schon erledigt; dort wird `allbus` vor jedem Ausführen frisch geladen. Darum bildet jede Vorlage die Variablen, die sie braucht, selbst.“

Vorlage `start` (Kopieren, ohne Ausführen-Knopf wie in Sitzung 4):

```r
# Pakete laden und Daten einlesen
library(tidyverse)
library(mariposa)

allbus <- read_spss("ZA8831_v1-3-0.sav")
```

Hilfezeile: „Rote Zeilen beim Laden, etwa „Attaching core tidyverse packages“, sind normal und kein Fehler. Findet R die Datei nicht, nimm wie in Sitzung 1 `allbus <- read_spss(file.choose())`.“

Text: „Ein logistisches Modell schreibst du genau wie eine lineare Regression aus Sitzung 9: links von `~` steht, was erklärt wird, rechts, womit. Neu ist nur der Name der Funktion. Das Beispiel kennst du aus den Grundlagen: Gehen Menschen mit dem Smartphone ins Internet (`lm30`, 1 = genannt, 0 = nicht genannt), je nach Alter (`age`)?“

Zeilenbild (Bausteine wie in Sitzung 4, R1): `smartphone <-` (Name für das Modell) | `allbus %>%` (Daten, und dann) | `logistic_regression(` (Funktion: logistisches Modell) | `lm30` (erklärt wird: 0 oder 1) | `~` („erklärt durch“) | `age` (Prädiktor) | `, weights = wghtpew)` (gewichtet). Darunter: „Nimm allbus, und dann schätz ein logistisches Modell für lm30, erklärt durch das Alter, gewichtet, und leg es unter dem Namen smartphone ab.“

Vorlage `r_modell` (Ausführen):

```r
# Logistisches Modell: Internet mit dem Smartphone (lm30) nach Alter, gewichtet
smartphone <- allbus %>%
  logistic_regression(lm30 ~ age, weights = wghtpew)

# Kurz: eine Zeile mit den wichtigsten Zahlen
smartphone

# Ausführlich: alle Tabellen
smartphone %>%
  summary()
```

Ausgabe der Kurzzeile zur Kontrolle (im Text): `Nagelkerke R2 = 0.203, chi2(1) = 453.95, p < 0.001 ***, Accuracy = 91.4%, N = 4813`.

Kurz gesagt: „`logistic_regression()` schätzt ein Modell für eine Variable mit 0 und 1. Aufgebaut ist es wie `linear_regression()`. Mit `summary()` siehst du alle Tabellen; was darin steht, lernst du in den Grundlagen 2 und 4.“

Genauer erklärt: „Was die ersten Zeilen der Ausgabe sagen“
- „`[P(lm30 = GENANNT)]` sagt, wofür das Modell eine Wahrscheinlichkeit schätzt: für die 1, hier „Smartphone genannt“. Unter „Dependent Variable Encoding“ steht dasselbe als Tabelle.“
- „`Note: labelled predictor age entered with its numeric codes` ist kein Fehler. R rechnet mit den Zahlen der Variable, hier den Lebensjahren. Bei Skalen wie „stimme voll zu“ bis „stimme gar nicht zu“ heißt das: R behandelt die Stufen 1, 2, 3, 4 wie gleich weit auseinander (mehr dazu in den Voraussetzungen im Überblick).“
- „`N: 4813` ist gewichtet, also die Summe der Gewichte. Gezählt stecken 4.777 Personen im Modell: alle Internetnutzenden mit gültiger Antwort bei `lm30` und beim Alter (`lm30` wird nur Internetnutzenden gestellt, die übrigen haben TNZ: FILTER, kennst du aus Sitzung 1). Alle Zahlen dieses Modells gelten darum nur für Menschen, die das Internet nutzen.“
- „Mehr dazu im R-Workshop, Kapitel 9.8 (Logistische Regression).“

Häufige Verwechslung: „`logistic_regression()` mit einer Variable, die mehr als zwei Werte hat, etwa `pv01` mit allen Parteien. R meldet dann „must be binary“. Erst mit `rec()` eine 0/1-Variable bilden.“

### Karte R2 „Vier neue Werkzeuge“ (Schilder: „exp(), tibble(), predict(), marginal_effects(): neu heute“, „Code lesen“)

Text: „Mit vier kleinen Werkzeugen übersetzt du ein Modell in Zahlen, die man versteht. Führe jede Vorlage einmal aus. Was die Zahlen bedeuten, lernst du in den Grundlagen 2 und 3.“

1. „`exp()` rechnet „e hoch eine Zahl“ (e ist ungefähr 2,718). Damit wird aus B die Zahl Exp(B) und aus einem Logit eine Chance.“

```r
# Aus B wird Exp(B): e hoch B
exp(-0.076)
```

Ausgabe zur Kontrolle: `[1] 0.9268162`, in der Modellausgabe gerundet `0.927`.

2. „`tibble()` baut eine kleine Tabelle von Hand, zum Beispiel Beispielpersonen. `c()` zählt die Werte einer Spalte auf, einen je Person. `predict()` sagt für diese Personen vorher, wie wahrscheinlich bei ihnen eine 1 ist. Wichtig ist `type = "response"`: Ohne dieses Argument bekommst du Logits statt Wahrscheinlichkeiten.“

```r
# Modell wie oben, dann zwei Beispielpersonen: 30 und 80 Jahre alt
smartphone <- allbus %>%
  logistic_regression(lm30 ~ age, weights = wghtpew)

leute <- tibble(
  age = c(30, 80)
)

smartphone %>%
  predict(newdata = leute, type = "response")
```

Ausgabe zur Kontrolle: `0.9890025 0.6698802` (über den Zahlen stehen 1 und 2: die erste und die zweite Person). „R zeigt Anteile: 0.989 heißt 98,9 %.“

3. „`marginal_effects()` rechnet den durchschnittlichen marginalen Effekt (AME): um wie viel sich die Wahrscheinlichkeit je Einheit im Mittel ändert. `summary()` zeigt ihn in der Spalte AME. Das Modell steht hier direkt in der Kette: erst schätzen, dann den AME, dann die Tabelle.“

```r
# Durchschnittlicher marginaler Effekt (AME) des Alters
allbus %>%
  logistic_regression(lm30 ~ age, weights = wghtpew) %>%
  marginal_effects() %>%
  summary()
```

Ausgabe zur Kontrolle: Zeile `age  -0.005  3.04e-04  -17.529  <.001  -0.006  -0.005  ***`.

Kurz gesagt: „`exp()` übersetzt in Chancen, `tibble()` mit `c()` baut Beispielpersonen, `predict(…, type = "response")` gibt ihre Wahrscheinlichkeiten, `marginal_effects()` den mittleren Effekt in Prozentpunkten.“

Genauer erklärt: „Wie R diese Zahlen schreibt“
- „`3.04e-04` heißt 3,04 mal 10 hoch −4, also 0,000304. R schreibt sehr kleine Zahlen so.“
- „Der AME ist ein Anteil: −0.005 heißt −0,5 Prozentpunkte je Lebensjahr.“
- „In `tibble()` braucht jede Spalte gleich viele Werte. Zwei Personen heißt: in jedem `c()` zwei Zahlen. Die Spalten heißen genau wie die Prädiktoren im Modell (hier `age`).“
- „Unter der AME-Tabelle steht „Factor rows show the average discrete change vs. the reference level.“ Das betrifft nur Prädiktoren, die als Gruppen ins Modell gehen (mit `to_label()`). Hier gibt es keine; du kannst den Satz überspringen.“

Häufige Verwechslung: „`predict()` ohne `type = "response"`. Dann steht bei der 30-Jährigen 4.499 statt 0.989: Das ist ihr Logit, keine Wahrscheinlichkeit.“

---

## 4 Thema 1: Ja oder nein: warum keine Gerade?

### Grundlage 1 „Ja oder nein: warum keine Gerade?“ (Kopf: „Grundlage zu Aufgabe 1“, Link „Schon klar? Direkt zu Aufgabe 1 ↓“)

Unterzeile: „Was ist anders, wenn die Antwort nur Ja oder Nein ist? Drei kurze Schritte, etwa 15 Minuten.“

#### Karte 1a „Ein Turm aus Nullen und Einsen“ (Schilder: „Turm und Stein: kennst du aus Sitzung 2“, „Mittelwert: kennst du aus Sitzung 3“, „Im Bild“)

Beispiel zuerst: „Bisher hast du Variablen mit vielen Stufen erklärt, etwa die Lebenszufriedenheit von 0 bis 10. Manche Fragen haben nur zwei Antworten: Ja oder Nein. Der ALLBUS fragt alle, die das Internet nutzen, mit welchen Geräten sie es tun. Wer das Smartphone nennt, bekommt bei `lm30` eine 1, wer es nicht nennt, eine 0. Hier siehst du den Turm `lm30` von zehn Befragten, zum Beispiel.“

**Bild B1 `s11-null-eins` (statisch):**
- Baukasten-Stil wie `kap04.lstein`/`kap04.kopf`: links ein Turm `lm30` (Kopf `lm30`, Typ `<dbl+lbl>` grau darüber) aus zehn Steinen, von oben: 1, 1, 0, 1, 1, 1, 0, 1, 1, 0. Steine mit 1 grün (`--gruen`) mit Aufkleber GENANNT, Steine mit 0 hell (`--paper` mit Rand `--rand`) mit Aufkleber NICHT GENANNT. Oben links Notiz (grau, kursiv): „zum Beispiel zehn Befragte“.
- Rechts daneben eine Rechnung als Bausteine: „Summe der Steine“ = 7, geteilt durch „Anzahl der Steine“ = 10, gleich „0,7“, darunter „= 70 % haben eine 1“.
- Textfassung B1: „Ein Turm lm30 aus zehn Steinen, zum Beispiel. Sieben Steine tragen eine 1 (Smartphone genannt), drei eine 0 (nicht genannt). Zählt man die Steine zusammen, kommt 7 heraus; geteilt durch 10 ergibt sich der Mittelwert 0,7. Das ist der Anteil der Einsen: 70 Prozent.“

Kurz gesagt: „Eine Variable mit genau zwei Ausprägungen heißt **dichotom** (oder binär). Man kodiert sie mit 0 und 1. Ihr Mittelwert ist der Anteil der Einsen. Diesen Anteil liest man als **Wahrscheinlichkeit**: Wie wahrscheinlich hat eine Person aus dieser Gruppe eine 1?“

Genauer erklärt: „Was das im ALLBUS heißt“
- „Gewichtet geben 91,4 % der Internetnutzenden das Smartphone an. Der gewichtete Mittelwert von `lm30` ist also 0,914.“
- „Eine Wahrscheinlichkeit liegt immer zwischen 0 (niemand) und 1 (alle), in Prozent zwischen 0 und 100.“
- „Welche Antwort die 1 bekommt, legst du fest. Das Modell sagt später immer die Wahrscheinlichkeit der 1 vorher.“

Häufige Verwechslung: „Die 0 heißt nicht „fehlt“. 0 ist eine gültige Antwort (nicht genannt). Wer gar nicht geantwortet hat, ist NA und liegt nicht im Turm.“

#### Karte 1b „Warum eine Gerade scheitert“ (Schilder: „Gerade: kennst du aus Sitzung 9“, „Im Bild“, „Kurz überlegen“)

Beispiel zuerst: „Je älter, desto seltener das Smartphone? Teil die Internetnutzenden in sieben Altersgruppen und schau, welcher Anteil das Smartphone nennt.“

**Kurz überlegen (vor dem Bild, Auswahl, „Festlegen“, danach Auflösen):** „Eine lineare Regression aus Sitzung 9 legt eine Gerade durch diese Anteile. Was sagt sie wohl für 18-Jährige voraus?“ Optionen: „etwa 95 %“, „genau 100 %“, „mehr als 100 %“. Auflösung: „Die Gerade sagt für 18-Jährige 106,6 % voraus, für alle unter 32 Jahren mehr als 100 %. Mehr als alle geht nicht.“ (Die Auflösung ist für alle Optionen gleich; vorangestellt „Deine Wahl: …“.)

**Bild B2 `s11-gerade-s` (interaktiv, Umschalter mit drei Knöpfen „Nur die Daten“, „Mit Gerade“, „Mit S-Kurve“, `aria-pressed`; Start „Nur die Daten“):**
- Achsen: x „Alter in Jahren“ von 15 bis 100 (Striche bei 20, 40, 60, 80, 100), y „Anteil mit Smartphone (%)“ von 0 bis 110 (Striche bei 0, 25, 50, 75, 100). Eine waagerechte gestrichelte Linie bei 100 % (Farbe `--rot`), beschriftet „100 %: mehr geht nicht“.
- Sieben Punkte (orange, Rolle „echte Daten“) über den Gruppenmitten: 24 Jahre 99,2 %; 35 Jahre 98,5 %; 44 Jahre 96,8 %; 55 Jahre 94,0 %; 64 Jahre 85,4 %; 74 Jahre 77,7 %; 83 Jahre 59,3 %. Kleine Beschriftung je Punkt mit der Gruppe (18–29, 30–39, 40–49, 50–59, 60–69, 70–79, 80–99).
- „Mit Gerade“: eine braune Gerade von (18 | 106,6) bis (95 | 70,1), Formel nach Sitzung 9: Vorhersage = 1,151 − 0,00474 × Alter (B mit mehr Stellen als in der Ausgabe, damit die Rechnung aufgeht: 1,151 − 0,00474 × 18 = 1,066, also 106,6 %). Der Teil über 100 % ist rot hinterlegt, Beschriftung „über 100 %“.
- „Mit S-Kurve“: eine türkise Kurve (Rolle „Modell“) p(Alter) = 1 / (1 + e^−(6,774 − 0,0758 × Alter)), gezeichnet von 18 (99,6 %) bis 95 (39,4 %), durch die Punkte (Abstand höchstens 1,7 Prozentpunkte). Die Gerade bleibt blass sichtbar.
- Unter dem Bild ein Satz je Zustand (aria-live): „Nur die Daten“: „Bis etwa 50 nennen fast alle das Smartphone, danach sinkt der Anteil immer schneller.“ „Mit Gerade“: „Die Gerade sagt für 18-Jährige 106,6 % voraus und unterschätzt die Mitte: Sie kann nicht biegen.“ „Mit S-Kurve“: „Die S-Kurve bleibt unter 100 % und folgt den Punkten: oben flach, in der Mitte steil.“
- Textfassung B2 (als Tabelle mit `<caption>`): „Anteil der Internetnutzenden, die das Smartphone nennen, nach Alter, gewichtet, ALLBUS 2023.“ Spalten Altersgruppe | befragte Personen | Anteil mit Smartphone: 18–29 | 692 | 99,2 %; 30–39 | 791 | 98,5 %; 40–49 | 712 | 96,8 %; 50–59 | 974 | 94,0 %; 60–69 | 902 | 85,4 %; 70–79 | 550 | 77,7 %; 80–99 | 156 | 59,3 %. Darunter: „Eine Gerade (lineare Regression) sagt für 18-Jährige 106,6 % voraus, für 95-Jährige 70,1 %. Eine S-Kurve (logistische Regression) sagt 99,6 % und 39,4 % voraus und liegt an jeder Altersgruppe höchstens 1,7 Prozentpunkte neben dem Anteil.“

Kurz gesagt: „Eine Gerade läuft endlos weiter, über 100 % und unter 0 %. Wahrscheinlichkeiten haben aber Grenzen. Darum nimmt man für eine 0/1-Variable eine **S-Kurve**: Sie nähert sich 0 und 100 % an, ohne sie zu überschreiten. Das Verfahren dazu heißt **logistische Regression**.“

Genauer erklärt: „Was noch an der Geraden stört“
- „Nahe an 0 oder 100 % ist kaum Platz für Veränderung: Bei 99 % kann der Anteil höchstens noch um einen Prozentpunkt steigen. In der Mitte kann er viel stärker wachsen. Eine Gerade nimmt aber überall gleich große Schritte an.“
- „Die Residuen einer 0/1-Variable sind keine schöne Wolke um die Gerade: Jede Person liegt entweder auf der 0 oder auf der 1. Gleiche Fehlervarianz (Sitzung 9) ist damit verletzt.“
- „Die Zahlen der Geraden: Konstante 1,151, B −0,005 (genauer −0,00474), R² 0,084, gewichtet. Für 18 Jahre: 1,151 − 0,00474 × 18 = 1,066, also 106,6 %. Mit dem gerundeten B −0,005 kämen 106,1 % heraus, ebenfalls über 100 %.“

Häufige Verwechslung: „„Die Gerade passt im Großen und Ganzen, also ist sie gut genug.“ An den Rändern sagt sie Unmögliches voraus, und genau dort, nahe 0 oder 100 %, liegen viele Fragen der Sozialforschung, etwa die Wahlabsicht.“

#### Karte 1c „Drei Sprachen: Wahrscheinlichkeit, Chance, Logit“ (Schilder: „Im Bild“, „Formel lesen lernen“)

Beispiel zuerst: „Von 100 Internetnutzenden zwischen 70 und 79 nennen 77,7 das Smartphone, 22,3 nicht. Das kannst du auf drei Arten sagen, und jede hat ihren Zweck.“

**Bild B3 `s11-drei-sprachen` (Formel als Bausteine, statisch, drei Kästen nebeneinander mit Pfeilen):**
- Kasten 1 „Wahrscheinlichkeit p“ (Hintergrund `--blauh`, Rand `--blaud`): „77,7 von 100“, darunter „von 0 bis 1 (0 bis 100 %)“.
- Pfeil nach rechts, beschriftet „p / (1 − p)“; Kasten 2 „Chance (Odds)“ (Hintergrund `--gelbh`, Rand `--gelbd`): „77,7 / 22,3 = 3,48“, darunter „„3,48 zu 1“, von 0 bis unendlich“.
- Pfeil nach rechts, beschriftet „ln( )“; Kasten 3 „Logit“ (Hintergrund `--lilah`, Rand `--lilad`): „ln(3,48) = 1,25“, darunter „von minus bis plus unendlich“.
- Unter den Kästen Pfeile zurück nach links (gestrichelt), beschriftet „exp( )“ (Logit → Chance) und „Chance / (1 + Chance)“ (Chance → p).
- Jedes Formelzeichen als Baustein mit Unterschrift: „p: Anteil mit Ja“, „1 − p: Anteil mit Nein“, „ln: natürlicher Logarithmus, die Umkehrung von exp“, „exp: e hoch …“.
- Textfassung B3: „Drei Sprachen für dieselbe Gruppe. Wahrscheinlichkeit: 77,7 von 100 nennen das Smartphone, das ist p gleich 0,777; sie liegt zwischen 0 und 1. Chance, englisch Odds: p geteilt durch 1 minus p, also 77,7 geteilt durch 22,3 gleich 3,48, gesprochen „3,48 zu 1“; sie liegt zwischen 0 und unendlich. Logit: der natürliche Logarithmus der Chance, ln von 3,48 gleich 1,25; er kann jede Zahl annehmen. Zurück geht es mit exp: e hoch Logit ergibt die Chance, und Chance geteilt durch 1 plus Chance ergibt die Wahrscheinlichkeit.“

**Interaktion „Übersetzer“ (unter B3):** Regler „Wahrscheinlichkeit“ von 1 bis 99 % in Schritten von 1 (Tastatur: Pfeil links/rechts 1, Bild auf/ab 10), Start bei 78 %. Daneben drei Zahlen (aria-live, auf zwei Stellen gerundet): „Wahrscheinlichkeit 78 %“, „Chance 3,55 („3,55 zu 1“)“, „Logit 1,27“; Rechnung im Atlas: Chance = p/(1 − p), Logit = ln(Chance). Darunter ein Raster aus 100 Steinen (10 × 10), p Steine grün (Ja), Rest hell (Nein). Drei Merkknöpfe „50 %“, „90 %“, „99 %“ setzen den Regler. Rückmeldung bei 50 %: „Bei 50 % ist die Chance 1 („1 zu 1“) und der Logit 0.“ Bei 90 %: „Von 90 auf 99 % sind es nur 9 Prozentpunkte, aber die Chance wächst von 9 auf 99.“
Textfassung Übersetzer (Tabelle mit `<caption>` „Wahrscheinlichkeit, Chance und Logit“): 1 % | 0,01 | −4,60; 5 % | 0,05 | −2,94; 10 % | 0,11 | −2,20; 20 % | 0,25 | −1,39; 25 % | 0,33 | −1,10; 50 % | 1 | 0; 75 % | 3 | 1,10; 80 % | 4 | 1,39; 90 % | 9 | 2,20; 95 % | 19 | 2,94; 99 % | 99 | 4,60. Darunter: „Die echten Altersgruppen: 18–29 Jahre 99,2 %, Chance 124, Logit 4,82; 70–79 Jahre 77,7 %, Chance 3,48, Logit 1,25; 80–99 Jahre 59,3 %, Chance 1,46, Logit 0,38.“

**Kurz überlegen (Zahl, Prüfen):** „Eine Gruppe hat die Chance 4. Wie viel Prozent der Gruppe sagen Ja?“ Ziel 80, Toleranz 0,5. Richtig: „Genau: Chance 4 heißt „4 zu 1“, also 4 von 5 Personen: 80 %. Rechnung: 4 / (1 + 4) = 0,8.“ Falsch: „Chance 4 heißt: auf eine Person mit Nein kommen vier mit Ja. Wie viele von fünf sagen Ja? Rechne Chance / (1 + Chance).“ Sonderfall 400: „Eine Chance ist kein Vielfaches einer Wahrscheinlichkeit. Mehr als 100 % gibt es nicht.“ Hilfezeile: „In Prozent, eine ganze Zahl reicht.“

Kurz gesagt: „Die **Wahrscheinlichkeit** sagt, wie viele von 100 Ja sagen. Die **Chance** (englisch Odds) teilt Ja durch Nein: „3 zu 1“. Der **Logit** ist der Logarithmus der Chance. Er hat keine Grenzen nach oben und unten, und darum kann ein Modell in Logits mit einer Geraden rechnen.“

Genauer erklärt: „Formel lesen lernen: die drei Übersetzungen“
- „Chance = p / (1 − p). Lies: Anteil Ja geteilt durch Anteil Nein. Mit Prozent geht es genauso: 77,7 / 22,3.“
- „Logit = ln(Chance). ln ist der natürliche Logarithmus. Du musst ihn nie selbst rechnen; merk dir drei Punkte: Chance 1 gibt Logit 0, Chance größer als 1 gibt einen positiven Logit, Chance kleiner als 1 einen negativen.“
- „Zurück: Chance = exp(Logit), Wahrscheinlichkeit = Chance / (1 + Chance). Das brauchst du in Aufgabe 3.“
- „Warum der Umweg? Die Wahrscheinlichkeit stößt bei 0 und 100 % an. Die Chance stößt nur unten an (sie wird nie kleiner als 0). Der Logit stößt nirgends an. Auf dieser offenen Skala darf eine Gerade endlos weiterlaufen.“

Häufige Verwechslung: „Im Alltag heißt „Chance“ oft Wahrscheinlichkeit („die Chance liegt bei 80 %“). Hier ist die Chance immer ein Verhältnis Ja zu Nein: 80 % entsprechen der Chance 4.“

### Aufgabe 1 „Wer will wählen gehen?“ (Pflicht)

Link „↑ Grundlage 1 nachlesen“.

Leitfrage: „Wie hängt die Absicht zu wählen damit zusammen, ob jemand Wählen für eine Bürgerpflicht hält?“

Ziel: „Am Ende hast du die Wahlabsicht als 0/1-Variable gebildet, liest in einer Kreuztabelle, wie der Anteil der Wählenden mit dem Pflichtgefühl steigt, und kannst mit zwei kleinen Rechnungen zeigen, warum eine Gerade hier an ihre Grenze stößt und was eine Chance ist.“

Grundlage: „Grundlage 1, Ja oder nein: warum keine Gerade?“

Einleitung: „Der ALLBUS fragt, welche Partei man wählen würde, wenn am nächsten Sonntag Bundestagswahl wäre (`pv01`). Eine Antwort ist „würde nicht wählen“ (Code 91). Außerdem sollten die Befragten sagen, wie sehr sie zustimmen, dass die Beteiligung an Wahlen eine Bürgerpflicht ist (`pe09`, 1 = stimme voll zu bis 4 = stimme gar nicht zu). Diese Frage wurde nur einem Teil der Befragten gestellt, gut zwei Dritteln (1.596 haben TNZ: SPLIT, kennst du aus Sitzung 1). Es geht um die geäußerte Absicht, nicht um tatsächliches Wählen.“

**Erst festlegen** (Auswahl, „Tipp abgeben“; wird beim Prüfen zitiert): „Wie viel Prozent derer, die Wählen gar nicht für eine Bürgerpflicht halten, wollen trotzdem wählen?“ Optionen: „unter 40 %“, „40 bis 55 %“, „über 55 %“. Rückmeldung beim Festlegen: „Festgelegt: … Die Auflösung bekommst du, wenn du am Ende der Aufgabe deine Antworten prüfst.“

Text: „Arbeite in der Code-Werkstatt direkt hier oder in RStudio. In RStudio führst du vorher den Startblock aus „R lesen“ aus.“

**Schritte:**

1. „Bilde die 0/1-Variable `waehlen` und zähl sie aus. `rec()` macht aus allen Parteien (1 bis 90) eine 1 und aus „würde nicht wählen“ (91) eine 0; alles andere wird NA. Führe die Vorlage aus.“ Schild „rec() in mutate(): kennst du aus Sitzung 5“, „weights: kennst du aus Sitzung 6“.

```r
# Wählen als 0/1 bilden und auszählen, gewichtet
allbus %>%
  mutate(
    waehlen = rec(pv01, rules = "1:90=1 [würde wählen]; 91=0 [würde nicht wählen]; else=NA")
  ) %>%
  frequency(waehlen, weights = wghtpew)
```

Hilfezeile: „In Sitzung 5 hast du `nichtwahl` andersherum gebildet (91 = 1). Heute ist Wählen die 1, weil das Modell die Wahrscheinlichkeit der 1 vorhersagt.“

2. „Jetzt die Kreuztabelle: Wie viel Prozent jeder Stufe wollen wählen? `pe09` läuft von „stimme voll zu“ (1) bis „stimme gar nicht zu“ (4). Damit ein höherer Wert mehr Pflichtgefühl heißt, polt die Vorlage um: `pflicht` läuft von 1 = stimme gar nicht zu bis 4 = stimme voll zu. Führe die Vorlage aus und lies die Zeilen `row %` in der Spalte „würde wählen“.“ Schild „crosstab() mit Zeilenprozent: kennst du aus Sitzung 5“.

```r
# Wählen als 0/1 und Pflichtgefühl umgepolt; Kreuztabelle mit Zeilenprozent, gewichtet
allbus %>%
  mutate(
    waehlen = rec(pv01, rules = "1:90=1 [würde wählen]; 91=0 [würde nicht wählen]; else=NA"),
    pflicht = rec(pe09, rules = "rev")
  ) %>%
  crosstab(pflicht, waehlen, percentages = "row", weights = wghtpew)
```

Tabelle „umgepolt“ (klein, unter der Vorlage; gilt auch für Aufgabe 3):

| Antwort | `pe09` | `pflicht` |
|---|---|---|
| stimme voll zu | 1 | 4 |
| stimme eher zu | 2 | 3 |
| stimme eher nicht zu | 3 | 2 |
| stimme gar nicht zu | 4 | 1 |

**Bild B4 `s11-decke` (zu Schritt 2 und 3, statisch, konstruierte Werte, damit es nichts verrät):** vier Säulen nebeneinander, beschriftet „Stufe 1“ bis „Stufe 4“, Höhen zum Beispiel 50, 70, 88, 97 %, oben eine rote gestrichelte Linie „100 %“. Zwischen den Säulen Treppenstufen mit den Zuwächsen „+20“, „+18“, „+9“ Prozentpunkte. Eine zweite, blasse Säulenreihe zeigt „gleich große Schritte“: 50, 70, 90, 110 % – die letzte ragt rot schraffiert über die 100-%-Linie. Notiz grau: „zum Beispiel“. Textfassung B4: „Zum Beispiel vier Stufen mit 50, 70, 88 und 97 Prozent. Die Zuwächse werden nach oben kleiner: plus 20, plus 18, plus 9 Prozentpunkte, weil bis 100 Prozent immer weniger Platz bleibt. Mit gleich großen Schritten von 20 Punkten läge die vierte Stufe bei 110 Prozent, und das ist unmöglich.“

3. „Wie viele Prozentpunkte bringt eine Stufe mehr Pflichtgefühl? Die Vorlage rechnet die erste Stufe vor: von „stimme gar nicht zu“ (61.4) zu „stimme eher nicht zu“ (78.3). Tausch die beiden markierten Zahlen gegen die Werte für die letzte Stufe, von „stimme eher zu“ zu „stimme voll zu“.“ Schild „R als Taschenrechner: kennst du aus Sitzung 1“. Hilfezeile: „Kommazahlen schreibst du in R mit Punkt, die größere Zahl zuerst.“

```r
# Wie viele Prozentpunkte bringt eine Stufe? Hier die erste Stufe
⟦78.3⟧ - ⟦61.4⟧
```

4. „Rechne einen Anteil in eine Chance um (Grundlage 1c): Prozent „würde wählen“ geteilt durch Prozent „würde nicht wählen“. Die Vorlage rechnet „stimme gar nicht zu“ vor. Tausch die Zahlen gegen die Zeile „stimme voll zu“.“

```r
# Chance = Prozent „wählen“ geteilt durch Prozent „nicht wählen“, hier „stimme gar nicht zu“
⟦61.4⟧ / ⟦38.6⟧
```

**Weiterdenken in der Probier-Werkstatt (für die Aufgabe nicht nötig),** zugeklappt: „Für die Aufgabe reichen die Vorlagen oben. Hier ist Platz für eigene Fragen. Eine Idee: Was sagt eine Gerade (lineare Regression aus Sitzung 9) für die vier Stufen voraus? Die Probier-Werkstatt startet mit einem Vorschlag.“

```r
# Eine Idee: Was sagt eine Gerade (lineare Regression) für die vier Stufen voraus?
allbus %>%
  mutate(
    waehlen = rec(pv01, rules = "1:90=1 [würde wählen]; 91=0 [würde nicht wählen]; else=NA"),
    pflicht = rec(pe09, rules = "rev")
  ) %>%
  linear_regression(waehlen ~ pflicht, weights = wghtpew) %>%
  summary()
```

(Zur Information, nicht im Kapitel: Konstante 0,596, B 0,101. Bei Stufe 4: 0,596 + 0,101 × 4 = 1,000, also genau 100 %; bei Stufe 1: 69,7 % statt der echten 61,4 %. Eine fünfte Stufe läge über 100 %.)

**Antwortfragen** („Antworten prüfen“, Rückmeldung je Frage mit ✓/✗ und Text, am Ende „Deine Festlegung vorher war: …“):

| id | Art | Label | Optionen | Ziel | Toleranz | Text richtig | Text falsch / Hinweis | Hilfezeile |
|---|---|---|---|---|---|---|---|---|
| a1a | choice | Was passiert mit Befragten, die „weiß nicht“ oder „nicht wahlberechtigt“ angegeben haben? | na: „Sie werden NA und zählen nicht mit“; null: „Sie zählen als 0, also „würde nicht wählen““; eins: „Sie zählen als 1“ | na | – | Genau: `else=NA` macht alles außer 1 bis 91 zu NA. In der Ausgabe stehen sie unter „System“ (gewichtet 1.269). Wer nicht wählen darf oder noch unentschieden ist, hat sich nicht gegen das Wählen entschieden. | Schau auf `else=NA` in der Regel: Alles, was nicht 1 bis 90 oder 91 ist, wird fehlend. Als 0 zählt nur Code 91. | Aus der Regel in `rec()`. |
| a1b | number | Wie viel Prozent der Befragten mit gültiger Antwort wollen wählen? | – | 94.17 | 0.2 | 94,17 % (Valid %). Dasselbe steht als Mittelwert in der Kopfzeile: mean=0.94. Der Mittelwert einer 0/1-Variable ist der Anteil der Einsen. | Lies in der Zeile „würde wählen“ die Spalte Valid %. Sonderfall 0,94 (± 0,01): Das ist der Mittelwert als Anteil; gefragt ist Prozent, also 94. Sonderfall 71,38 (± 0,1): Das sind Raw %, von allen Befragten. | Prozent, eine Kommazahl reicht. |
| a1c | number | Wie viel Prozent derer, die „stimme gar nicht zu“ sagen, wollen trotzdem wählen? | – | 61.4 | 0.1 | 61,4 %, fast zwei Drittel. Bei „stimme voll zu“ sind es 98,8 %. | Lies in der Zeile STIMME GAR NICHT ZU die Zeile `row %`, Spalte „würde wählen“. Sonderfall 38,6: Das sind die, die nicht wählen wollen. | Aus der Kreuztabelle, Schritt 2. |
| a1d | number | Wie viele Prozentpunkte bringt die letzte Stufe, von „stimme eher zu“ zu „stimme voll zu“? | – | 4 | 0.1 | 4,0 Prozentpunkte (98,8 − 94,8). Die erste Stufe brachte 16,9, die zweite 16,5. | Tausch in der Vorlage aus Schritt 3 die Zahlen: 98.8 und 94.8. Sonderfall 16,9: Das ist die erste Stufe aus der Vorlage. Sonderfall −4: die größere Zahl zuerst. | Prozentpunkte, eine Kommazahl reicht. |
| a1e | choice | Warum bringt die letzte Stufe so wenig? | decke: „Oben ist kaum noch Platz: Bei 94,8 % fehlen bis 100 % nur 5,2 Prozentpunkte.“; schwach: „Bei „stimme voll zu“ wirkt das Pflichtgefühl schwächer.“; gewicht: „Das liegt an der Gewichtung.“ | decke | – | Genau. Brächte jede Stufe so viel wie die erste, läge „stimme voll zu“ bei 61,4 + 3 × 16,9 = 112,1 %. Mehr als alle geht nicht. Deshalb flacht der Anstieg oben ab: Die Anteile folgen einer S-Kurve, keiner Geraden (Grundlage 1b). | Schau, wie weit 94,8 % von 100 % entfernt sind. Wie viel kann eine Stufe da noch bringen? Grundlage 1b. | – |
| a1f | number | Wie groß ist die Chance zu wählen bei „stimme voll zu“? | – | 82.33 | 1.6 | Etwa 82 („82 zu 1“): 98,8 / 1,2 = 82,33. Bei „stimme gar nicht zu“ war sie 1,59. | Tausch in der Vorlage aus Schritt 4 die Zahlen: 98.8 und 1.2. Sonderfall 1,59: Das ist die Vorlage für „stimme gar nicht zu“. Sonderfall 0,012: Du hast „nicht wählen“ durch „wählen“ geteilt. Sonderfall 98,8: Das ist der Anteil, nicht die Chance. | Eine Zahl, eine Kommazahl reicht. |
| a1g | choice | Was heißt diese Chance? | zuEins: „Auf eine Person, die nicht wählen will, kommen etwa 82, die wählen wollen.“; prozent: „82 % wollen wählen.“; mal: „Wählen ist 82-mal so wahrscheinlich wie bei „stimme gar nicht zu“.“ | zuEins | – | Genau: Eine Chance ist ein Verhältnis Ja zu Nein (Grundlage 1c). | Eine Chance ist keine Prozentzahl und kein Vergleich zweier Gruppen, sondern „Ja zu Nein“ in einer Gruppe: 98,8 zu 1,2. | – |

Rückmeldung zur Festlegung (beim Prüfen): „Du hattest festgelegt: … Tatsächlich wollen 61,4 % derer, die Wählen gar nicht für eine Bürgerpflicht halten, trotzdem wählen.“

Erlaubte Lesarten (für die Antwortprüfung): a1f Zielbereich 80,73 bis 83,93 umfasst auch die Rechnung aus den gewichteten Anzahlen (1759 / 21 = 83,76).

**Hilfe, Stufe 1: Denkanstoß:** „Die Kreuztabelle zeigt je Stufe, wie viel Prozent wählen wollen. Schau, wie groß die Schritte von Stufe zu Stufe sind und wie viel Platz bis 100 % bleibt. Eine Chance teilt „wählen“ durch „nicht wählen“.“

**Hilfe, Stufe 2: Wo schaue ich?:** „Valid % und mean= in der Ausgabe von Schritt 1. Die Prozente je Stufe in Schritt 2, Zeilen `row %`, Spalte „würde wählen“; daneben „würde nicht wählen“. In Schritt 3 und 4 tauschst du die markierten Zahlen gegen diese Prozente.“

**Hilfe, Stufe 3: Lösung:** „„Weiß nicht“ und „nicht wahlberechtigt“ werden NA. 94,17 % wollen wählen (mean=0.94). Je Stufe Pflichtgefühl: 61,4 %, 78,3 %, 94,8 %, 98,8 %. Die letzte Stufe bringt `98.8 - 94.8`, also 4 Prozentpunkte, weil oben kaum Platz ist. Chance bei „stimme voll zu“: `98.8 / 1.2` ergibt 82.33333, also „82 zu 1“.“

**Ohne Grafik lösbar:** „Alle Zahlen stehen in den Ausgaben von `frequency()` und `crosstab()`; Bild B4 hat eine Textfassung.“

---

## 5 Thema 2: Das Modell: B und Exp(B)

### Grundlage 2 „Das Modell: B und Exp(B)“ (Kopf: „Grundlage zu Aufgabe 2“, „Schon klar? Direkt zu Aufgabe 2 ↓“)

Unterzeile: „Was rechnet ein logistisches Modell, und wie liest man seine Zahlen? Drei Schritte, etwa 12 Minuten.“

#### Karte 2a „Eine Gerade im Logit, eine S-Kurve in Prozent“ (Schilder: „Konstante + B × Wert: kennst du aus Sitzung 9“, „Im Bild“)

Beispiel zuerst: „Das Modell aus „R lesen“ sagt unter den Internetnutzenden die Smartphone-Nutzung aus dem Alter vorher. In seiner Ausgabe stehen in der Spalte B zwei Zahlen: die Konstante 6,774 und für das Alter −0,076. Wie in Sitzung 9 ergeben sie eine Gerade, aber nicht in Prozent, sondern in Logits.“

**Formel als Bausteine (Bild B5a `s11-formel-logit`):** „Logit“ = „Konstante 6,774“ + „B −0,076“ × „Alter“. Unterschriften: „Logit: die Sprache des Modells“, „Konstante: Logit bei Alter 0, nur eine Rechengröße“, „B: so viel ändert sich der Logit je Lebensjahr“. Darunter eingesetzt für 70 Jahre: „6,774 − 0,076 × 70 = 1,454“. Textfassung B5a: „Der Logit ist die Konstante 6,774 plus B, hier minus 0,076, mal das Alter. Für eine 70-Jährige: 6,774 minus 0,076 mal 70 ergibt 1,454.“

**Bild B5 `s11-logit-s` (interaktiv, zwei Felder nebeneinander, darunter ein Regler „Alter“ von 20 bis 90 in Schritten von 10, Start 70; über dem Bild der Satz „Der Regler unter dem Bild geht in Schritten von zehn Jahren. Mit den Pfeiltasten gehst du zehn Jahre weiter.“; die Textfassung des Bildes nennt „Smartphone-Modell für Internetnutzende“):**
- Links „In Logits“: x Alter 15 bis 95, y Logit von −1 bis 6 (Striche bei 0, 2, 4, 6); eine türkise Gerade Logit = 6,774 − 0,076 × Alter. Waagerechte graue Linie bei 0, beschriftet „Logit 0 = 50 %“.
- Rechts „In Prozent“: x Alter 15 bis 95, y 0 bis 100 %; die S-Kurve p = Chance / (1 + Chance).
- Der Regler setzt in beiden Feldern einen Punkt an dieselbe Stelle und zeigt darunter die Kette (aria-live): „Alter 70 → Logit 1,454 → Chance 4,28 → Wahrscheinlichkeit 81,1 %“.
- Werte je Reglerstellung (mit den gerundeten Zahlen aus der Ausgabe): 20: 5,254 | 191,3 | 99,5 %; 30: 4,494 | 89,5 | 98,9 %; 40: 3,734 | 41,8 | 97,7 %; 50: 2,974 | 19,6 | 95,1 %; 60: 2,214 | 9,15 | 90,1 %; 70: 1,454 | 4,28 | 81,1 %; 80: 0,694 | 2,00 | 66,7 %; 90: −0,066 | 0,94 | 48,4 %.
- Textfassung B5 (Tabelle mit `<caption>` „Vom Alter zur Wahrscheinlichkeit, Smartphone-Modell, Internetnutzende“): Spalten Alter | Logit | Chance | Wahrscheinlichkeit, die acht Zeilen oben. Darunter: „Links steigt der Logit in gleich großen Schritten: je zehn Jahre um 0,76 weniger. Rechts wird daraus eine S-Kurve: bis 50 Jahre kaum Veränderung, danach immer schneller abwärts.“

Kurz gesagt: „Die **logistische Regression** rechnet wie die lineare: Konstante + B × Wert. Heraus kommt aber ein **Logit**. Übersetzt in Wahrscheinlichkeiten wird aus der Geraden die S-Kurve.“

Genauer erklärt: „Wie R die Zahlen findet“
- „Die lineare Regression sucht die Gerade mit den kleinsten quadrierten Residuen (Sitzung 9). Die logistische sucht die Zahlen, unter denen die beobachteten Nullen und Einsen am wahrscheinlichsten sind. Dieses Verfahren heißt **Maximum Likelihood**. Wie gut das gelingt, misst −2LL (Grundlage 4).“
- „R rechnet mit mehr Stellen als den drei, die es zeigt (B genauer −0,0758). Rechnest du von Hand mit den gerundeten Zahlen, weicht das Ergebnis leicht ab: für 80 Jahre 66,7 % statt 67,0 % aus `predict()`.“

Häufige Verwechslung: „B ist hier keine Änderung in Prozent. −0,076 heißt: Der Logit sinkt je Lebensjahr um 0,076. Was das in Prozent bedeutet, hängt vom Alter ab (Grundlage 3).“

#### Karte 2b „Exp(B): ein Faktor für die Chance“ (Schilder: „Im Bild“, „Formel lesen lernen“, „Kurz überlegen“)

Beispiel zuerst: „Neben B steht Exp(B) = 0,927. Das ist e hoch B, mit `exp(-0.076)` hast du es in „R lesen“ selbst gerechnet. Exp(B) sagt: Mit jedem Lebensjahr wird die Chance, das Smartphone zu nennen, mit 0,927 malgenommen.“

**Bild B6 `s11-faktor` (statisch, Bausteine):** eine Reihe von Chancen-Kästen (gelb, `--gelbh`) für die Alter 30, 40, 50, 60, 70, 80: „89,5“, „41,8“, „19,6“, „9,15“, „4,28“, „2,00“. Zwischen je zwei Kästen ein Pfeil, beschriftet „× 0,47 (zehn Jahre)“. Über der Reihe klein: „ein Jahr: × 0,927; zehn Jahre: 0,927 × 0,927 × … (zehnmal) = 0,47“. Textfassung B6: „Die Chance, das Smartphone zu nennen, mit 30 Jahren 89,5, mit 40 41,8, mit 50 19,6, mit 60 9,15, mit 70 4,28, mit 80 2,00. Von Jahrzehnt zu Jahrzehnt wird sie mit 0,47 malgenommen, also etwa halbiert. Das ergibt sich aus 0,927 je Jahr, zehnmal hintereinander.“

Tabelle „B und Exp(B) lesen“ (als HTML-Tabelle):

| B | Exp(B) | Die Chance … |
|---|---|---|
| größer als 0 | größer als 1 | steigt je Einheit |
| 0 | 1 | bleibt gleich: kein Zusammenhang |
| kleiner als 0 | kleiner als 1 | sinkt je Einheit |

**Formel lesen lernen (Bild B6b `s11-formel-prozent`):** „Veränderung der Chance in Prozent“ = („Exp(B)“ − 1) × 100. Darunter eingesetzt: „(0,927 − 1) × 100 = −7,3“. Unterschrift: „Je Lebensjahr wird die Chance um 7,3 % kleiner.“ Textfassung B6b: „Die Veränderung der Chance in Prozent ist Exp(B) minus 1, mal 100. Beim Alter: 0,927 minus 1 ist minus 0,073, mal 100 ergibt minus 7,3 Prozent je Lebensjahr.“

**Kurz überlegen (Auswahl, Prüfen):** „Bei einem anderen Modell steht Exp(B) = 2. Was heißt das?“ Optionen: „Die Chance verdoppelt sich je Einheit“ (richtig), „Die Wahrscheinlichkeit verdoppelt sich je Einheit“, „Die Wahrscheinlichkeit steigt um 2 Prozentpunkte“. Richtig: „Genau. Exp(B) vervielfacht die Chance. Bei 50 % (Chance 1) wird daraus Chance 2, also 67 %, nicht 100 %.“ Falsch: „Exp(B) ist ein Faktor für die Chance (Ja zu Nein). Eine Wahrscheinlichkeit von 60 % kann sich nicht verdoppeln, das wären 120 %.“

Kurz gesagt: „**Exp(B)**, auch **Odds Ratio** oder Chancenverhältnis, sagt, mit welchem Faktor sich die Chance ändert, wenn der Prädiktor um eine Einheit steigt. Über 1 heißt: die Chance steigt; unter 1: sie sinkt; genau 1: kein Zusammenhang.“

Genauer erklärt: „Zwei Schreibweisen für denselben Zusammenhang“
- „B und Exp(B) sagen dasselbe in zwei Sprachen: B in Logits (plus), Exp(B) in Chancen (mal). Ein Logit-Schritt von −0,076 entspricht dem Faktor 0,927.“
- „Neben Exp(B) steht ein 95-%-Konfidenzintervall (kennst du aus Sitzung 7), beim Alter 0,919 bis 0,935. Liegt die 1 nicht darin, ist der Zusammenhang signifikant; dasselbe zeigt die Spalte Sig. Die Spalte Wald enthält die Prüfgröße dazu.“
- „Warum Odds **Ratio**? Exp(B) ist das Verhältnis zweier Chancen: die Chance bei einer Einheit mehr geteilt durch die Chance davor. Für zehn Jahre: Chance mit 40 geteilt durch Chance mit 30, 41,8 / 89,5 = 0,47.“
- „Bei mehreren Prädiktoren gilt Exp(B) „bei gleichen Werten der anderen Prädiktoren“, wie B in der multiplen Regression (Sitzung 10).“
- „Die Konstante hat auch ein Exp(B), hier 874,684: die Chance bei Alter 0. Weil es keine Befragten mit 0 Jahren gibt, deutet man sie nicht.“

Häufige Verwechslung: „„Exp(B) = 0,927 heißt: Die Wahrscheinlichkeit sinkt um 7,3 % je Jahr.“ Es ist die Chance, nicht die Wahrscheinlichkeit. Wie stark sich die Wahrscheinlichkeit ändert, hängt davon ab, wo jemand auf der S-Kurve steht (Grundlage 3).“

#### Karte 2c „Die Ausgabe lesen“ (Schilder: „summary(): kennst du aus Sitzung 7“, „Sig.: kennst du aus Sitzung 7 und 9“, „Code lesen“)

Text: „`summary()` zeigt viele Tabellen. Für das Deuten brauchst du zuerst drei Stellen. Die übrigen (Model Summary, Classification Table) kommen in Grundlage 4.“

**Bild B7 `s11-ausgabe` (interaktive Tabelle als echtes `<pre>` mit drei markierbaren Bereichen; drei Knöpfe „Was ist die 1?“, „B und Exp(B)“, „Wie viele?“, die je einen Bereich gelb hinterlegen und erklären):** Ausschnitt der Ausgabe von `smartphone %>% summary()` in Monospace:

```
- N: 4813
- Weights: wghtpew

  Dependent Variable Encoding
  ---------------------------------
  Original Value     Internal Value
  ---------------------------------
  0 (NICHT GENANNT)               0
  1 (GENANNT)                     1
  ---------------------------------

  Variables in the Equation
  ----------------------------------------------------------------------------------------
  Term              B   S.E.     Wald  df   Sig.   Exp(B)  95% CI Lower  95% CI Upper
  ----------------------------------------------------------------------------------------
  (Intercept)   6.774  0.276  604.222   1  <.001  874.684                              ***
  age          -0.076  0.004  328.394   1  <.001    0.927         0.919         0.935  ***
  ----------------------------------------------------------------------------------------
```

(Dieser Block ist Ausgabe, keine Vorlage; im Atlas als Ausgabe-Kasten, nicht als Werkstatt.)

Erklärungen (aria-live):
- „Was ist die 1?“ markiert „Dependent Variable Encoding“: „Das Modell sagt die Wahrscheinlichkeit für den Internen Wert 1 vorher, hier GENANNT. Prüf das immer zuerst: Ist die 1 andersherum kodiert, drehen sich alle Vorzeichen um und Exp(B) wird zum Kehrwert.“
- „B und Exp(B)“ markiert die Zeile `age`: „B −0,076: Der Logit sinkt je Lebensjahr. Exp(B) 0,927: Die Chance wird je Lebensjahr mit 0,927 malgenommen. Sig. <.001: Der Zusammenhang ist signifikant.“
- „Wie viele?“ markiert `N: 4813`: „Gewichtete Zahl der Fälle im Modell. Wer bei einer Variable des Modells fehlt, fällt ganz heraus.“

Textfassung B7: der Ausschnitt als Text (Screenreader liest `<pre>`), dazu die drei Erklärungen als Liste. Das `<pre>` ist fokussierbar und trägt kein `aria-label`; der Name kommt per `aria-labelledby` von einer umgebenden `<figure>` (unsichtbare `<figcaption>`). Die markierte Stelle ist nicht nur gelb: jede Zeile steckt in einem `<mark>`, ist fett und hat einen Balken links, und für Screenreader beginnt sie mit „Markiert: “.

Kurz gesagt: „Erst nachsehen, wofür die 1 steht. Dann je Prädiktor B (Richtung), Sig. (signifikant?) und Exp(B) (Faktor für die Chance) lesen.“

Häufige Verwechslung: „Exp(B) der Konstante wird als „Effekt“ gelesen. Die Konstante ist kein Prädiktor; ihr Exp(B) ist nur die Chance beim Wert 0 aller Prädiktoren.“

### Aufgabe 2 „Was heißt Exp(B) für das Pflichtgefühl?“ (Pflicht)

Link „↑ Grundlage 2 nachlesen“.

Leitfrage: „Wie stark hängt die Absicht zu wählen mit dem Pflichtgefühl zusammen, wenn man das politische Interesse berücksichtigt?“

Ziel: „Am Ende hast du ein logistisches Modell gewichtet geschätzt und kannst in einem Satz sagen, was Exp(B) für das Pflichtgefühl und für das Interesse heißt, und warum nur gut die Hälfte der Befragten im Modell steckt.“

Grundlage: „Grundlage 2, Das Modell: B und Exp(B)“.

Einleitung: „Du erklärst `waehlen` (1 = würde wählen) aus Aufgabe 1 mit zwei Prädiktoren: dem Pflichtgefühl (`pflicht`, 1 = stimme gar nicht zu bis 4 = stimme voll zu) und dem politischen Interesse (`pa02a`, 1 = sehr stark bis 5 = überhaupt nicht, kennst du aus Sitzung 2). Auch das Interesse wird umgepolt: `interesse` läuft von 1 = überhaupt nicht bis 5 = sehr stark. Höhere Werte heißen also mehr Pflichtgefühl und mehr Interesse.“

**Erst festlegen:** „Eine Stufe mehr Pflichtgefühl, bei gleichem Interesse: Mit welchem Faktor ändert sich wohl die Chance zu wählen?“ Optionen: „etwa × 1,2“, „etwa × 4“, „etwa × 20“.

**Schritte:**

1. „Führe die Vorlage aus. Sie bildet die Variablen wie in Aufgabe 1 und schätzt ein Modell, zunächst nur mit dem Pflichtgefühl. Lies in „Variables in the Equation“ Exp(B) für `pflicht` (3.888).“ Schild „logistic_regression(): neu heute“, „mutate() mit rec(): wie in Aufgabe 1“.

```r
# Variablen wie in Aufgabe 1, dazu Interesse umgepolt; dann das logistische Modell, gewichtet
modell <- allbus %>%
  mutate(
    waehlen   = rec(pv01, rules = "1:90=1 [würde wählen]; 91=0 [würde nicht wählen]; else=NA"),
    pflicht   = rec(pe09, rules = "rev"),
    interesse = rec(pa02a, rules = "rev")
  ) %>%
  logistic_regression(waehlen ~ ⟦pflicht⟧, weights = wghtpew)

modell %>%
  summary()
```

2. „Nimm das Interesse dazu: Ersetze die markierte Stelle durch `pflicht + interesse` und führe die Vorlage erneut aus. Mehrere Prädiktoren mit `+` kennst du aus Sitzung 10. Lies zuerst „Dependent Variable Encoding“, dann in „Variables in the Equation“ beide Zeilen.“ Hilfezeile: „Exp(B) des Pflichtgefühls ändert sich ein wenig, wenn das Interesse dazukommt: Jetzt gilt es „bei gleichem Interesse“.“

3. „Wie viel Prozent mehr Chance bringt eine Stufe mehr Interesse? Die Vorlage rechnet das Beispiel aus Grundlage 2 vor (Alter, 0.927). Tausch die markierte Zahl gegen Exp(B) des Interesses.“ Schild „R als Taschenrechner: kennst du aus Sitzung 1“.

```r
# Exp(B) als Veränderung der Chance in Prozent, hier das Alter aus Grundlage 2
(⟦0.927⟧ - 1) * 100
```

4. „Deuten: Welcher Satz beschreibt das Pflichtgefühl richtig? (Frage a2c)“

**Weiterdenken in der Probier-Werkstatt (für die Aufgabe nicht nötig),** zugeklappt: „Eine Idee: Bleibt der Zusammenhang, wenn auch das Alter im Modell ist?“

```r
# Eine Idee: Bleibt Exp(B) des Pflichtgefühls, wenn auch das Alter im Modell ist?
allbus %>%
  mutate(
    waehlen   = rec(pv01, rules = "1:90=1 [würde wählen]; 91=0 [würde nicht wählen]; else=NA"),
    pflicht   = rec(pe09, rules = "rev"),
    interesse = rec(pa02a, rules = "rev")
  ) %>%
  logistic_regression(waehlen ~ pflicht + interesse + age, weights = wghtpew) %>%
  summary()
```

(Zur Information: pflicht Exp(B) 3,724, interesse 1,408, age 1,008 mit Sig. .146, N 2.751. Das Pflichtgefühl bleibt fast gleich, das Alter hängt bei gleichem Pflichtgefühl und Interesse nicht signifikant mit der Wahlabsicht zusammen.)

**Antwortfragen:**

| id | Art | Label | Optionen | Ziel | Toleranz | Text richtig | Text falsch / Hinweis | Hilfezeile |
|---|---|---|---|---|---|---|---|---|
| a2a | choice | Wofür sagt das Modell die Wahrscheinlichkeit vorher? | waehlen: „für „würde wählen““; nicht: „für „würde nicht wählen““; beide: „für beides zugleich“ | waehlen | – | Genau: Internal Value 1 ist „würde wählen“. Alle Zahlen sprechen also über die Absicht zu wählen. | Schau in „Dependent Variable Encoding“: Welche Antwort hat den Internal Value 1? | Ganz oben in `summary()`. |
| a2b | number | Wie groß ist Exp(B) für das Pflichtgefühl, wenn das Interesse im Modell ist? | – | 3.765 | 0.01 | 3,765, gerundet 3,77. Ohne Interesse waren es 3,888: Ein kleiner Teil des Zusammenhangs geht auf das Interesse zurück. | Lies Exp(B) in der Zeile `pflicht`, nachdem du `pflicht + interesse` eingesetzt hast. Sonderfall 3,888 (± 0,01): Das ist das Modell nur mit dem Pflichtgefühl; setz `pflicht + interesse` ein. Sonderfall 1,326 oder 1,358: Das ist B, nicht Exp(B). Sonderfall 0,27: Kehrwert; ist die 1 richtig kodiert und ist umgepolt? | Aus `summary()`, Spalte Exp(B). |
| a2c | choice | Welcher Satz beschreibt das Pflichtgefühl richtig? | chance: „Bei gleichem Interesse wird die Chance zu wählen mit jeder Stufe mehr Pflichtgefühl etwa 3,8-mal so groß.“; wahrsch: „Mit jeder Stufe mehr Pflichtgefühl gehen Menschen 3,8-mal so wahrscheinlich wählen.“; pp: „Mit jeder Stufe mehr Pflichtgefühl steigt die Wahrscheinlichkeit um 3,77 Prozentpunkte.“ | chance | – | Genau: Exp(B) ist ein Faktor für die Chance, und er gilt bei gleichem Interesse. | Bei „wahrsch“: Mach die Probe an der ersten Stufe aus Aufgabe 1: 61,4 % × 3,8 wären 233 %. Exp(B) vervielfacht die Chance, nicht die Wahrscheinlichkeit. Bei „pp“: Exp(B) ist ein Faktor, keine Differenz in Prozentpunkten. Grundlage 2b. | – |
| a2d | number | Um wie viel Prozent steigt die Chance zu wählen je Stufe mehr Interesse? | – | 40.5 | 0.6 | Um 40,5 %: (1,405 − 1) × 100. Exp(B) des Interesses ist 1,405, deutlich kleiner als beim Pflichtgefühl, aber ebenfalls signifikant (Sig. <.001). | Tausch in der Vorlage aus Schritt 3 die 0.927 gegen Exp(B) von `interesse`. Sonderfall −7,3: Das ist das Beispiel aus der Vorlage. Sonderfall 1,405: Das ist der Faktor; gefragt ist die Veränderung in Prozent. Sonderfall 276,5 (± 1): Das ist das Pflichtgefühl. | Prozent, eine Kommazahl reicht. |
| a2e | choice | Im Modell stecken N = 2.758 (gewichtet), befragt wurden 5.246. Warum so wenige? | split: „Die Pflichtfrage bekam nur ein Teil der Befragten (Split-Teil), und wer bei einer der drei Variablen fehlt, fällt heraus.“; gewicht: „Die Gewichtung hat Befragte gelöscht.“; fehler: „R hat nur einen Teil eingelesen.“ | split | – | Genau: `pe09` haben nur 3.602 Befragte gültig beantwortet (1.596 TNZ: SPLIT). Dazu fallen alle ohne Wahlabsicht heraus (weiß nicht, nicht wahlberechtigt …). Gezählt sind es 2.778 Personen, gewichtet 2.758. | Ein Modell nutzt nur Fälle, die bei allen Variablen eine gültige Antwort haben. Welche der drei Fragen wurde nicht allen gestellt? | – |

Rückmeldung zur Festlegung: „Du hattest festgelegt: … Tatsächlich wird die Chance je Stufe mit 3,77 malgenommen, also knapp vervierfacht.“

**Hilfe, Stufe 1: Denkanstoß:** „Das Modell spricht über die 1. Exp(B) ist ein Faktor für die Chance „wählen zu nicht wählen“. Bei zwei Prädiktoren gilt jeder Faktor bei gleichem Wert des anderen.“

**Hilfe, Stufe 2: Wo schaue ich?:** „Nach dem Einsetzen von `pflicht + interesse`: „Dependent Variable Encoding“ für die 1, „Variables in the Equation“ Spalte Exp(B) für die Faktoren, `N:` oben in der Ausgabe. Für Prozent rechnest du (Exp(B) − 1) × 100.“

**Hilfe, Stufe 3: Lösung:** „Die 1 ist „würde wählen“. Mit `waehlen ~ pflicht + interesse`: pflicht B 1,326, Exp(B) 3,765 (Konfidenzintervall 3,154 bis 4,495); interesse B 0,340, Exp(B) 1,405, also `(1.405 - 1) * 100` = 40,5 % mehr Chance je Stufe. Satz: „Bei gleichem Interesse wird die Chance zu wählen mit jeder Stufe mehr Pflichtgefühl etwa 3,8-mal so groß.“ N = 2.758 (gewichtet), weil `pe09` nur einem Teil der Befragten (dem Split-Teil, gut zwei Drittel) gestellt wurde und Fälle mit fehlenden Werten herausfallen.“

**Ohne Grafik lösbar:** „Diese Aufgabe hat keine Grafik. Alle Zahlen stehen in der Ausgabe von `summary()`.“

---

## 6 Thema 3: Vorhergesagte Wahrscheinlichkeiten

### Grundlage 3 „Vorhergesagte Wahrscheinlichkeiten“ (Kopf: „Grundlage zu Aufgabe 3“, „Schon klar? Direkt zu Aufgabe 3 ↓“)

Unterzeile: „Was heißt ein Modell für einzelne Menschen, und warum gibt es nicht den einen Effekt in Prozent? Drei Schritte, etwa 12 Minuten.“

#### Karte 3a „Vom Logit zurück zur Wahrscheinlichkeit“ (Schilder: „Vorhersage: kennst du aus Sitzung 9“, „Formel lesen lernen“)

Beispiel zuerst: „Wie wahrscheinlich nennt eine 70-Jährige, die das Internet nutzt, das Smartphone? Das Modell beantwortet das in drei Schritten, genau die Kette aus Grundlage 1c, nur rückwärts.“

**Bild B8 `s11-rueckweg` (Formel als Bausteine, drei Stufen untereinander, je ein Kasten mit Rechnung und Ergebnis):**
1. „Logit = Konstante + B × Wert“ → „6,774 − 0,076 × 70 = 1,454“ (lila Kasten).
2. „Chance = exp(Logit)“ → „exp(1,454) = 4,28“ (gelber Kasten), Unterschrift „„4,28 zu 1““.
3. „Wahrscheinlichkeit = Chance / (1 + Chance)“ → „4,28 / 5,28 = 0,811“ (blauer Kasten), Unterschrift „81,1 %“.
Textfassung B8: „Erstens der Logit: Konstante plus B mal Wert, 6,774 minus 0,076 mal 70 ergibt 1,454. Zweitens die Chance: e hoch 1,454 ergibt 4,28, also 4,28 zu 1. Drittens die Wahrscheinlichkeit: Chance geteilt durch 1 plus Chance, 4,28 geteilt durch 5,28 ergibt 0,811, also 81,1 Prozent.“

Text: „`predict(…, type = "response")` macht alle drei Schritte auf einmal, mit ungerundeten Zahlen: 81,2 % für 70 Jahre.“

Kurz gesagt: „Eine **vorhergesagte Wahrscheinlichkeit** rechnest du in drei Schritten: Logit aus Konstante und B, mit `exp()` zur Chance, dann Chance durch 1 plus Chance. `predict()` mit `type = "response"` erledigt das für dich.“

Genauer erklärt: „Was eine vorhergesagte Wahrscheinlichkeit nicht ist“
- „81,1 % heißt nicht, dass eine bestimmte 70-Jährige zu 81 % ein Smartphone nutzt. Gemeint ist: Von 100 Internetnutzenden dieses Alters nennen laut Modell etwa 81 das Smartphone. Über Menschen ohne Internet sagt das Modell nichts.“
- „Mehrere Prädiktoren: Jeder bekommt sein eigenes „+ B × Wert“. Für Beispielpersonen setzt du ihre Werte ein; mit `tibble()` baust du sie für `predict()`.“

Häufige Verwechslung: „Die Chance 4,28 als Wahrscheinlichkeit lesen. Wahrscheinlichkeiten liegen zwischen 0 und 1; 4,28 heißt „4,28 zu 1“, also 81,1 %.“

#### Karte 3b „Gleicher Faktor, verschiedene Prozentpunkte“ (Schilder: „Prozentpunkte: kennst du aus Sitzung 5“, „Im Bild“, „Kurz überlegen“)

Beispiel zuerst: „Zwei Internetnutzende werden zehn Jahre älter, zum Beispiel: eine Person von 30 auf 40, eine von 70 auf 80. Für beide wird die Chance mit 0,47 malgenommen (Grundlage 2b). Verlieren beide gleich viel?“

**Kurz überlegen (Auswahl, Festlegen, dann Auflösen im Bild):** „Bei wem sinkt die Wahrscheinlichkeit um mehr Prozentpunkte?“ Optionen: „von 30 auf 40“, „von 70 auf 80“, „bei beiden gleich“.

**Bild B9 `s11-zwei-schritte` (interaktiv, Knopf „Auflösen“ nach dem Festlegen):**
- S-Kurve wie B2 rechts (türkis), x Alter 15 bis 95, y 0 bis 100 %.
- Zwei Treppen (waagerecht zehn Jahre, senkrecht die Änderung): blau bei 30 → 40 (98,9 % → 97,7 %), orange bei 70 → 80 (81,1 % → 66,7 %). Neben jeder Treppe ein Kasten mit drei Zeilen: „Logit: −0,76“, „Chance: × 0,47 (89,5 → 41,8 bzw. 4,28 → 2,00)“, „Wahrscheinlichkeit: −1,2 bzw. −14,4 Prozentpunkte“.
- Nach „Auflösen“ (aria-live): „Der Logit sinkt bei beiden um 0,76, die Chance wird bei beiden mit 0,47 malgenommen. In Prozentpunkten verliert die 70-Jährige zwölfmal so viel: −14,4 statt −1,2. Oben auf der S-Kurve ist sie flach, in der Mitte steil.“
- Textfassung B9: „Zwei Schritte von zehn Jahren auf derselben S-Kurve. Von 30 auf 40 Jahre: Logit von 4,494 auf 3,734, Chance von 89,5 auf 41,8, Wahrscheinlichkeit von 98,9 auf 97,7 Prozent, also minus 1,2 Prozentpunkte. Von 70 auf 80 Jahre: Logit von 1,454 auf 0,694, Chance von 4,28 auf 2,00, Wahrscheinlichkeit von 81,1 auf 66,7 Prozent, also minus 14,4 Prozentpunkte. In beiden Fällen sinkt der Logit um 0,76 und die Chance wird mit 0,47 malgenommen.“

Kurz gesagt: „In Logits und in Chancen wirkt ein Prädiktor überall gleich. In **Prozentpunkten** hängt seine Wirkung vom Ausgangspunkt ab: in der Mitte der S-Kurve (um 50 %) groß, nahe 0 oder 100 % klein.“

Genauer erklärt: „Prozent und Prozentpunkte“
- „Prozentpunkte sind die Differenz zweier Prozentzahlen: von 81,1 % auf 66,7 % sind es 14,4 Prozentpunkte weniger. „14,4 % weniger“ hieße etwas anderes (14,4 % von 81,1).“
- „Die S-Kurve ist um 50 % am steilsten. Dort bringt eine Einheit am meisten Prozentpunkte.“
- „Darum berichtet man für Laien am besten Wahrscheinlichkeiten für typische Beispielpersonen, mit ihren Werten dazu.“

Häufige Verwechslung: „„Das Alter wirkt bei Jüngeren kaum.“ In Chancen wirkt es bei allen gleich stark. Bei Jüngeren ist nur kaum noch Platz nach oben: Fast alle nennen das Smartphone schon.“

#### Karte 3c „Eine Zahl im Mittel: der AME“ (Schilder: „Code lesen“)

Beispiel zuerst: „Wenn jeder Mensch eine andere Änderung in Prozentpunkten hat, welche Zahl berichtest du dann? Man kann sie mitteln: Für jede Person im Modell schaut R, wie steil die S-Kurve an ihrer Stelle ist, also wie stark sich ihre Wahrscheinlichkeit bei einem kleinen Schritt ändert, umgerechnet auf eine Einheit. Dann bildet R den gewichteten Durchschnitt.“

Text: „Das Ergebnis heißt durchschnittlicher marginaler Effekt (AME). Beim Smartphone-Modell steht in der Spalte AME −0.005: Im Mittel über alle Internetnutzenden im Modell sinkt die Wahrscheinlichkeit je Lebensjahr um etwa 0,5 Prozentpunkte, grob gerechnet über zehn Jahre um etwa 5 Prozentpunkte. Für die 30-Jährige waren es nur 1,2 Punkte, für die 70-Jährige 14,4: Der AME ist ein Mittelwert, kein Wert für alle.“

Kurz gesagt: „Der **durchschnittliche marginale Effekt (AME)** sagt in Prozentpunkten, wie stark sich die Wahrscheinlichkeit je Einheit im Mittel über alle Befragten im Modell ändert. R zeigt ihn als Anteil: −0.005 heißt −0,5 Prozentpunkte.“

Genauer erklärt: „Wann welcher Wert?“
- „Exp(B): für den Vergleich von Chancen, unabhängig vom Ausgangspunkt. Vorhergesagte Wahrscheinlichkeiten: für Beispielpersonen, am verständlichsten. AME: eine Zahl in Prozentpunkten für alle zusammen.“
- „Neben dem AME stehen Standardfehler, Sig. (Spalte p) und ein Konfidenzintervall, wie bei B.“
- „Genau genommen ist der AME die mittlere Steigung der S-Kurve. Für kleine Schritte wie ein Lebensjahr ist das fast dasselbe wie „ein Jahr mehr“. Bei großen Schritten, etwa einer ganzen Stufe einer Skala mit vier Stufen, ist er nur eine Annäherung: Weil die Kurve oben abflacht, bringt eine ganze Stufe dort meist etwas weniger, als der AME sagt.“

Häufige Verwechslung: „Den AME für jede Person anwenden. Er ist ein Durchschnitt: Bei manchen ist die Änderung viel kleiner, bei anderen viel größer.“

### Aufgabe 3 „Was heißt das in Prozent?“ (Pflicht)

Link „↑ Grundlage 3 nachlesen“.

Leitfrage: „Was bringt eine Stufe mehr Pflichtgefühl, in Prozent ausgedrückt, und bringt sie allen gleich viel?“

Ziel: „Am Ende hast du für zwei Beispielpersonen vorhergesagt, wie wahrscheinlich sie wählen wollen, mit und ohne eine Stufe mehr Pflichtgefühl, und kannst erklären, warum derselbe Faktor 3,77 verschieden viele Prozentpunkte bringt. Du kennst den AME als eine Zahl für alle.“

Grundlage: „Grundlage 3, Vorhergesagte Wahrscheinlichkeiten“.

Einleitung: „Zwei Beispielpersonen. Person A stimmt „eher nicht zu“, dass Wählen Bürgerpflicht ist, und interessiert sich „wenig“ für Politik. Person B stimmt „eher zu“ und interessiert sich „stark“. Auf den umgepolten Skalen (Tabelle in Aufgabe 1; Interesse: 1 = überhaupt nicht, 2 = wenig, 3 = mittel, 4 = stark, 5 = sehr stark) hat A also `pflicht` 2 und `interesse` 2, B hat `pflicht` 3 und `interesse` 4. Die Zahlen des Modells kennst du aus Aufgabe 2: Konstante −2.154, B für pflicht 1.326, B für interesse 0.340.“

**Erst festlegen:** „Beide bekommen eine Stufe mehr Pflichtgefühl. Bei wem steigt die Wahrscheinlichkeit zu wählen um mehr Prozentpunkte?“ Optionen: „bei Person A“, „bei Person B“, „bei beiden gleich“.

**Schritte:**

1. „Rechne Person A von Hand, wie in Grundlage 3a. Die Vorlage rechnet eine Person mit 1 und 1 (stimme gar nicht zu, überhaupt kein Interesse). Setz an den beiden markierten Stellen die Werte von Person A ein und führe die Vorlage aus. R zeigt nacheinander Logit, Chance und Wahrscheinlichkeit.“ Schild „exp(): neu heute“.

```r
# Von Hand: Logit, Chance, Wahrscheinlichkeit (Konstante und B aus Aufgabe 2, Spalte B)
logit <- -2.154 + 1.326 * ⟦1⟧ + 0.340 * ⟦1⟧

logit

chance <- exp(logit)

chance

chance / (1 + chance)
```

Hilfezeile: „Die erste markierte Stelle ist das Pflichtgefühl, die zweite das Interesse.“

2. „Jetzt lässt du R rechnen, für vier Personen auf einmal: A, A mit einer Stufe mehr Pflichtgefühl, B und B mit einer Stufe mehr. Die Vorlage schätzt das Modell wie in Aufgabe 2 und baut die vier Personen mit `tibble()`; jede Spalte zählt mit `c()` vier Werte auf, einen je Person. Die ersten zwei Personen stehen schon da. Setz an den markierten Stellen die Werte für B (pflicht 3, interesse 4) und B mit einer Stufe mehr (pflicht 4, interesse 4) ein.“ Schilder „tibble(), predict(): neu heute“, „Modell: wie in Aufgabe 2“.

```r
# Modell wie in Aufgabe 2
modell <- allbus %>%
  mutate(
    waehlen   = rec(pv01, rules = "1:90=1 [würde wählen]; 91=0 [würde nicht wählen]; else=NA"),
    pflicht   = rec(pe09, rules = "rev"),
    interesse = rec(pa02a, rules = "rev")
  ) %>%
  logistic_regression(waehlen ~ pflicht + interesse, weights = wghtpew)

# Vier Beispielpersonen: A, A mit einer Stufe mehr Pflichtgefühl, B, B mit einer Stufe mehr
profile <- tibble(
  pflicht   = c(2, 3, ⟦2⟧, ⟦3⟧),
  interesse = c(2, 2, ⟦2⟧, ⟦2⟧)
)

modell %>%
  predict(newdata = profile, type = "response")
```

Hilfezeile: „Unter 1 bis 4 stehen die Wahrscheinlichkeiten der vier Personen, als Anteil: 0.76 heißt 76 %. Prozentpunkte: Person 2 minus Person 1 und Person 4 minus Person 3, jeweils mal 100.“

3. „Eine Zahl für alle: Führe die Vorlage aus und lies den AME des Pflichtgefühls.“ Schild „marginal_effects(): neu heute“.

```r
# Modell wie in Aufgabe 2, dann der durchschnittliche marginale Effekt (AME)
allbus %>%
  mutate(
    waehlen   = rec(pv01, rules = "1:90=1 [würde wählen]; 91=0 [würde nicht wählen]; else=NA"),
    pflicht   = rec(pe09, rules = "rev"),
    interesse = rec(pa02a, rules = "rev")
  ) %>%
  logistic_regression(waehlen ~ pflicht + interesse, weights = wghtpew) %>%
  marginal_effects() %>%
  summary()
```

**Weiterdenken in der Probier-Werkstatt (für die Aufgabe nicht nötig),** zugeklappt: „Eine Idee: Wie sieht die S-Kurve des Pflichtgefühls aus, wenn das Interesse mittel ist?“

```r
# Eine Idee: Modell wie in Aufgabe 2; alle vier Stufen Pflichtgefühl bei mittlerem Interesse
modell <- allbus %>%
  mutate(
    waehlen   = rec(pv01, rules = "1:90=1 [würde wählen]; 91=0 [würde nicht wählen]; else=NA"),
    pflicht   = rec(pe09, rules = "rev"),
    interesse = rec(pa02a, rules = "rev")
  ) %>%
  logistic_regression(waehlen ~ pflicht + interesse, weights = wghtpew)

stufen <- tibble(
  pflicht   = c(1, 2, 3, 4),
  interesse = c(3, 3, 3, 3)
)

modell %>%
  predict(newdata = stufen, type = "response")
```

(Zur Information: 0.5477045, 0.8201193, 0.9449511, 0.9847629, also 54,8 %, 82,0 %, 94,5 %, 98,5 %: +27,2, +12,5, +4,0 Prozentpunkte.)

**Antwortfragen:**

| id | Art | Label | Optionen | Ziel | Toleranz | Text richtig | Text falsch / Hinweis | Hilfezeile |
|---|---|---|---|---|---|---|---|---|
| a3a | number | Wie groß ist die Chance zu wählen bei Person A? | – | 3.248 | 0.01 | 3,248, also gut „3 zu 1“: exp(1,178). | Setz in Schritt 1 an beiden markierten Stellen 2 ein; die Chance ist die zweite Zahl der Ausgabe. Sonderfall 0,614 (± 0,01): Das ist die Vorlage mit 1 und 1. Sonderfall 1,178: Das ist der Logit. Sonderfall 0,765 oder 76,5: Das ist die Wahrscheinlichkeit. | Zweite Zahl der Ausgabe von Schritt 1. |
| a3b | number | Mit welcher Wahrscheinlichkeit will Person A wählen, in Prozent? | – | 76.45 | 0.11 | 76,5 %: Von 100 Menschen wie A wollen etwa 76 wählen. `predict()` gibt mit ungerundeten Zahlen 76,4 %. | Dritte Zahl der Ausgabe von Schritt 1, mal 100. Sonderfall 0,76 (± 0,01): Das ist der Anteil; gefragt ist Prozent. Sonderfall 38,0 (± 0,1): Das ist die Vorlage mit 1 und 1. | In Prozent, eine Kommazahl reicht. R zeigt einen Anteil: 0.55 heißt 55 %. |
| a3c | number | Um wie viele Prozentpunkte steigt die Wahrscheinlichkeit bei Person A mit einer Stufe mehr Pflichtgefühl? | – | 16 | 0.15 | +16,0 Prozentpunkte: von 76,4 % auf 92,4 %. | Person 2 minus Person 1 aus Schritt 2, mal 100: 0.9243 − 0.7644. Sonderfall 0,16: mal 100 rechnen. | Prozentpunkte, eine Kommazahl reicht. |
| a3d | number | Um wie viele Prozentpunkte steigt sie bei Person B? | – | 2.9 | 0.15 | +2,9 Prozentpunkte: von 96,0 % auf 98,9 %. B startet schon fast oben. | Person 4 minus Person 3 aus Schritt 2, mal 100. Sonderfall 16,0 (± 0,15): Du hast die markierten Stellen noch nicht auf Person B gesetzt (3, 4 und 4, 4). Sonderfall 0,029: mal 100 rechnen. | Prozentpunkte, eine Kommazahl reicht. |
| a3e | choice | Was ist bei A und B gleich? | chance: „Die Chance wird mit 3,77 malgenommen.“; pp: „Die Wahrscheinlichkeit steigt um gleich viele Prozentpunkte.“; nichts: „Nichts, die Personen sind zu verschieden.“ | chance | – | Genau: A von 3,25 auf 12,2, B von 24,1 auf 90,8, beide × 3,77. Auch der Logit steigt bei beiden um 1,33. Nur in Prozentpunkten unterscheiden sie sich (16,0 gegen 2,9), weil B schon oben auf der S-Kurve steht (Grundlage 3b). | Vergleich deine beiden Antworten zu Prozentpunkten: gleich? Rechne die Chancen nach: Wahrscheinlichkeit / (1 − Wahrscheinlichkeit). Grundlage 3b. | – |
| a3f | number | Wie groß ist der AME des Pflichtgefühls, in Prozentpunkten je Stufe, im Mittel über alle Befragten im Modell? | – | 5.4 | 0.1 | 5,4 Prozentpunkte (AME 0.054). Ein Mittel aus vielen Menschen wie B, bei denen wenig passiert, und wenigen wie A. Es gilt für die 2.758 (gewichtet) im Modell, also der Split-Teil mit gültigen Antworten. Der AME ist die mittlere Steigung der S-Kurve; eine ganze Stufe bringt meist etwas weniger (Grundlage 3c). | Lies die Zeile `pflicht`, Spalte AME, mal 100. Sonderfall 0,054: R zeigt einen Anteil; das sind 5,4 Prozentpunkte. Sonderfall 1,4: Das ist das Interesse. | Prozentpunkte, eine Kommazahl reicht. |
| a3g | choice | Welcher Satz gehört in einen Bericht für Leserinnen ohne Statistik? | gut: „Je Stufe mehr Pflichtgefühl steigt die Wahrscheinlichkeit, wählen zu wollen, im Mittel um etwa 5 Prozentpunkte (mittlerer marginaler Effekt; eine ganze Stufe bringt meist etwas weniger) – bei Menschen, die ohnehin fast sicher wählen, weniger, bei Zögernden mehr.“; mal: „Wer eine Stufe mehr Pflichtgefühl hat, geht 3,77-mal so wahrscheinlich wählen.“; alle: „Eine Stufe mehr Pflichtgefühl erhöht bei allen die Wahlbeteiligung um 5,4 %.“ | gut | – | Genau: Prozentpunkte, „im Mittel“ und der Hinweis auf den Ausgangspunkt. Und „wollen“: Es geht um die Absicht, und das Modell vergleicht Menschen; ob eine Kampagne für mehr Pflichtgefühl wirkt, zeigt es nicht. | Bei „mal“: Probe an Person A: 76,4 % × 3,77 wären 288 %. Bei „alle“: Der AME ist ein Mittelwert in Prozentpunkten, nicht „bei allen“ und nicht Prozent; außerdem misst die Frage die Absicht, nicht die Beteiligung. | – |

Rückmeldung zur Festlegung: „Du hattest festgelegt: … Tatsächlich bringt die Stufe bei Person A 16,0, bei Person B 2,9 Prozentpunkte; in Chancen bei beiden × 3,77.“

**Bild B10 `s11-person-ab` (erscheint erst nach „Antworten prüfen“, damit es nichts vorwegnimmt; statisch):** Kurve der Wahrscheinlichkeit über `pflicht` 1 bis 4 für Interesse 2 (A, blau) und für Interesse 4 (B, orange), Punkte bei A: (2 | 76,4 %) → (3 | 92,4 %), B: (3 | 96,0 %) → (4 | 98,9 %), Treppen mit „+16,0“ und „+2,9 Prozentpunkte“; daneben „Chance × 3,77“ für beide. Textfassung B10: „Person A: Wahrscheinlichkeit von 76,4 auf 92,4 Prozent, plus 16,0 Prozentpunkte, Chance von 3,25 auf 12,2. Person B: von 96,0 auf 98,9 Prozent, plus 2,9 Prozentpunkte, Chance von 24,1 auf 90,8. Bei beiden wird die Chance mit 3,77 malgenommen.“ (Kurvenwerte für die Zeichnung aus `predict()` mit pflicht 1 bis 4 und interesse 2 bzw. 4; nur die vier Punkte sind im Plan geprüft.)

**Fürs Plenum:** „Welche Zahl gehört in eine Pressemitteilung: 3,77, +16,0, +2,9 oder +5,4 Prozentpunkte? Bring eine Antwort mit Begründung mit und einen Satz, wie eine Zeitung die Zahl falsch verstehen könnte.“

**Hilfe, Stufe 1: Denkanstoß:** „Das Modell rechnet in Logits. Von dort geht es mit `exp()` zur Chance und mit Chance / (1 + Chance) zur Wahrscheinlichkeit. In Chancen wirkt eine Stufe überall gleich, in Prozentpunkten nicht.“

**Hilfe, Stufe 2: Wo schaue ich?:** „Schritt 1: drei Zahlen, Logit, Chance, Wahrscheinlichkeit (als Anteil). Schritt 2: vier Anteile für A, A+1, B, B+1; Prozentpunkte sind Differenzen mal 100. Schritt 3: Spalte AME, Zeile `pflicht`.“

**Hilfe, Stufe 3: Lösung:** „Person A von Hand: Logit 1,178, Chance 3,248, Wahrscheinlichkeit 0,765, also 76,5 %. Mit `predict()` (in `profile` stehen `pflicht = c(2, 3, 3, 4)` und `interesse = c(2, 2, 4, 4)`): 0.7644409, 0.9243475, 0.9601851, 0.9891065. A gewinnt 16,0 Prozentpunkte, B 2,9. Gleich ist der Faktor für die Chance: × 3,77. AME 0.054, also im Mittel 5,4 Prozentpunkte (mittlere Steigung je Stufe; eine ganze Stufe bringt etwas weniger).“

**Ohne Grafik lösbar:** „Alle Zahlen stehen in den Ausgaben der drei Vorlagen; Bild B10 hat eine Textfassung.“

---

## 7 Thema 4: Wie gut ist das Modell? (Zusatz)

### Grundlage 4 „Wie gut ist das Modell?“ (Kopf: „Grundlage zu Aufgabe 4“, „Schon klar? Direkt zu Aufgabe 4 ↓“)

Unterzeile: „Trefferquote, −2LL und Pseudo-R²: was sie messen und wo sie täuschen. Etwa 10 Minuten.“

#### Karte 4a „Trefferquote: besser als Raten?“ (Schilder: „Im Bild“, „Kurz überlegen“)

Beispiel zuerst: „Das Smartphone-Modell meldet „Accuracy = 91.4%“: Bei 91,4 % der Internetnutzenden im Modell liegt es richtig. Klingt gut. Aber wie oft läge man richtig, wenn man einfach für alle „Ja“ sagt?“

**Bild B11 `s11-trefferquote` (Tabelle mit hervorgehobenen Zellen, HTML-Tabelle mit `<caption>`; Umschalter „Modell“ / „Regel: alle Ja“):**

Classification Table des Smartphone-Modells, wie R sie druckt (gewichtet, gerundet), Schwelle 0,5:

| beobachtet \ vorhergesagt | NICHT GENANNT | GENANNT | % richtig |
|---|---|---|---|
| NICHT GENANNT | **4** | 411 | 0,9 |
| GENANNT | 5 | **4.393** | 99,9 |
| insgesamt | | | 91,4 |

- „Modell“: die zwei fetten Zellen (richtig) grün hinterlegt, Text: „Richtig: 4 + 4.393 = 4.397 von 4.813, das sind 91,4 %.“
- „Regel: alle Ja“: die ganze Zeile GENANNT grün, Text: „Wer für alle „Ja“ sagt, liegt bei allen richtig, die das Smartphone nennen: 5 + 4.393 = 4.398 von 4.813, das sind 91,4 %. Genauso gut wie das Modell, sogar um einen (gewichteten) Fall besser.“
- Textfassung B11: die Tabelle selbst plus beide Texte.

**Kurz überlegen (Auswahl):** „Wie viele der 415 Internetnutzenden (gewichtet), die das Smartphone nicht nennen, erkennt das Modell?“ Optionen: „fast alle“, „etwa die Hälfte“, „fast keine“. Auflösung: „Fast keine: 4 von 415 (0,9 %). Für fast alle Internetnutzenden liegt die vorhergesagte Wahrscheinlichkeit über 50 %, also sagt das Modell „Ja“. Nur bei den Ältesten fällt sie unter 50 % (ab etwa 90 Jahren).“

Kurz gesagt: „Die **Trefferquote** (Classification Table, Overall Percentage) zählt, wie oft das Modell mit der Schwelle 50 % richtig liegt. Ist eine Antwort selten, trifft schon die Regel „alle bekommen die häufige Antwort“ fast genauso oft. Vergleich die Trefferquote darum immer mit dieser Regel.“

Genauer erklärt: „Warum ein Modell trotzdem nützt“
- „Das Modell sagt nicht nur Ja oder Nein, sondern Wahrscheinlichkeiten: 99,6 % mit 18 Jahren, 67,0 % mit 80 (aus `predict()`). Diese Unterschiede gehen in der Trefferquote verloren, weil beide über 50 % liegen.“
- „Die Zahlen der Tabelle sind gewichtet und gerundet; daraus nachgerechnete Prozente können um ein Zehntel abweichen.“

Häufige Verwechslung: „„91 % richtig, also ein sehr gutes Modell.“ Bei seltenen Antworten sagt die Trefferquote wenig. Ob das Modell etwas erklärt, zeigen −2LL und Pseudo-R².“

#### Karte 4b „−2LL und der Omnibus-Test“ (Schilder: „Im Bild“, „Formel lesen lernen“)

Beispiel zuerst: „Das Modell sucht die Zahlen, unter denen die beobachteten Antworten am wahrscheinlichsten sind (Maximum Likelihood, Grundlage 2a). −2LL (−2 Log Likelihood) misst, wie schlecht die geschätzten Wahrscheinlichkeiten dann noch zu den beobachteten Nullen und Einsen passen: 0 hieße perfekt, kleiner ist besser. Zum Vergleich braucht man ein **Nullmodell**, das nur die Konstante kennt und allen denselben Anteil vorhersagt.“

**Bild B12 `s11-minus2ll` (statisch, zwei liegende Balken):** oben „Nullmodell (nur Konstante)“ 2.824,895 (grau), unten „Modell mit Alter“ 2.370,945 (türkis). Der Unterschied 453,950 als gelbe Klammer, beschriftet „Chi-square im Omnibus-Test: 453,950“. Textfassung B12: „Das Nullmodell hat −2LL 2.824,895, das Modell mit dem Alter 2.370,945. Der Unterschied, 453,950, ist das Chi-square im Omnibus-Test. −2LL sinkt um 16 Prozent.“

**Formel lesen lernen (Bild B12b `s11-formel-null`):** „−2LL Nullmodell“ = „−2LL Modell“ (Model Summary) + „Chi-square“ (Omnibus Tests). Eingesetzt: „2370,945 + 453,950 = 2824,895“. Darunter: „McFadden R² = Chi-square / −2LL Nullmodell = 453,950 / 2824,895 = 0,161“. Textfassung B12b: „Das Nullmodell steht nicht direkt in der Ausgabe. Du bekommst es, indem du −2LL des Modells und das Chi-square des Omnibus-Tests addierst: 2370,945 plus 453,950 gleich 2824,895. Teilst du das Chi-square durch diese Zahl, erhältst du McFadden R², 0,161: −2LL ist um 16,1 Prozent gesunken.“

Kurz gesagt: „**−2LL** misst, wie schlecht das Modell die Antworten trifft: kleiner ist besser. Der **Omnibus-Test** prüft, ob das Modell −2LL gegenüber dem Nullmodell deutlich senkt (Chi-square, Sig.). Ist Sig. < .05, verbessern die Prädiktoren zusammen das Modell mehr, als durch Zufall zu erwarten wäre.“

Genauer erklärt: „Hosmer-Lemeshow-Test“
- „In der Ausgabe steht noch ein Test, der prüft, ob die vorhergesagten Wahrscheinlichkeiten in Gruppen zu den beobachteten Anteilen passen. Hier ist er unauffällig (Sig. .378): Die S-Kurve passt zu den Altersgruppen (Grundlage 1b). Ein Sig. unter .05 hieße: Irgendwo weicht das Modell ab, etwa weil ein Prädiktor nicht gleichmäßig wirkt. Bei sehr vielen Befragten schlägt er aber schnell an.“

Häufige Verwechslung: „−2LL für sich allein deuten. Die Zahl hängt von der Zahl der Fälle ab. Aussagekräftig ist nur der Vergleich mit dem Nullmodell.“

#### Karte 4c „Pseudo-R²“ (Schilder: „R²: kennst du aus Sitzung 9“)

Text: „In der Model Summary stehen drei Pseudo-R²: Cox & Snell 0,090, Nagelkerke 0,203, McFadden 0,161. Alle drei liegen zwischen 0 und 1 und sind größer, je mehr das Modell −2LL senkt. Am häufigsten berichtet man **Nagelkerke R²**; die Kopfzeile zeigt nur diesen.“

Kurz gesagt: „**Pseudo-R²** ist für die logistische Regression, was R² für die lineare ist: eine Zahl von 0 bis 1 für die Güte. Aber es ist **kein Anteil erklärter Varianz**. Als grobe Faustregel gilt Nagelkerke ab 0,2 als brauchbar, ab 0,4 als gut.“

Genauer erklärt: „Warum drei Zahlen?“
- „McFadden: um welchen Anteil −2LL gegenüber dem Nullmodell sinkt (Karte 4b). Cox & Snell: ähnlich, kann aber 1 nie erreichen. Nagelkerke: Cox & Snell, so gestreckt, dass 1 möglich ist.“
- „Pseudo-R² verschiedener Modelle vergleicht man nur bei derselben abhängigen Variable und denselben Befragten.“

Häufige Verwechslung: „„Nagelkerke 0,203 heißt: Das Alter erklärt 20 % der Smartphone-Nutzung.“ So darf man R² aus Sitzung 9 lesen, Pseudo-R² nicht. Sag: „Das Modell passt deutlich besser als ohne Alter; Nagelkerke R² = 0,20.““

### Aufgabe 4 „Erkennt das Modell, wer nicht wählen will?“ (Zusatz)

Link „↑ Grundlage 4 nachlesen“.

Leitfrage: „Wie gut sagen Pflichtgefühl und Interesse die Wahlabsicht vorher?“

Ziel: „Am Ende kannst du die Trefferquote des Modells mit der einfachsten Regel vergleichen, das −2LL des Nullmodells ausrechnen und Nagelkerke R² richtig in einen Satz bringen.“

Grundlage: „Grundlage 4, Wie gut ist das Modell?“

**Erst festlegen:** „Stell dir vor, ein Modell sagt für 95 von 100 Befragten richtig vorher, ob sie wählen wollen. Wie gut ist das?“ Optionen: „sehr gut, fast immer richtig“, „kommt darauf an, wie oft man mit Raten richtig läge“, „schlecht“.

**Schritte:**

1. „Führe die Vorlage aus: das Modell aus Aufgabe 2, diesmal mit dem Blick auf Classification Table, Model Summary und Omnibus Tests.“ Schild „Modell: wie in Aufgabe 2“.

```r
# Modell wie in Aufgabe 2, ausführliche Ausgabe
allbus %>%
  mutate(
    waehlen   = rec(pv01, rules = "1:90=1 [würde wählen]; 91=0 [würde nicht wählen]; else=NA"),
    pflicht   = rec(pe09, rules = "rev"),
    interesse = rec(pa02a, rules = "rev")
  ) %>%
  logistic_regression(waehlen ~ pflicht + interesse, weights = wghtpew) %>%
  summary()
```

2. „Wie oft läge die Regel „alle wählen“ richtig? Die Vorlage rechnet das Smartphone-Beispiel aus Grundlage 4a. Tausch die drei Zahlen: die beiden Zellen der Zeile „würde wählen“ und die Summe aller vier Zellen der Classification Table.“ Hilfezeile: „Die Summe aller vier Zellen ist N oben in der Ausgabe (gewichtet).“

```r
# Wie oft läge die Regel „alle Ja“ richtig? Hier das Smartphone-Beispiel aus Grundlage 4
(⟦5⟧ + ⟦4393⟧) / ⟦4813⟧ * 100
```

3. „Rechne das −2LL des Nullmodells aus (Grundlage 4b). Tausch die Zahlen gegen −2 Log Likelihood (Model Summary) und Chi-square (Omnibus Tests) deines Modells.“

```r
# −2LL des Nullmodells = −2LL des Modells + Chi-square; hier das Smartphone-Beispiel
⟦2370.945⟧ + ⟦453.950⟧
```

**Weiterdenken in der Probier-Werkstatt (für die Aufgabe nicht nötig),** zugeklappt: „Eine Idee: Wie gut ist ein Modell nur mit dem Interesse? Vergleich die Kopfzeile mit deinem Modell.“

```r
# Eine Idee: Wie gut ist ein Modell nur mit dem Interesse?
allbus %>%
  mutate(
    waehlen   = rec(pv01, rules = "1:90=1 [würde wählen]; 91=0 [würde nicht wählen]; else=NA"),
    interesse = rec(pa02a, rules = "rev")
  ) %>%
  logistic_regression(waehlen ~ interesse, weights = wghtpew)
```

(Zur Information: Nagelkerke R2 = 0.050, Accuracy = 94.2%, N = 3970. Ohne Pflichtgefühl ist das Modell viel schwächer; es hat aber mehr Fälle, weil der Split wegfällt, und ist darum nur grob vergleichbar.)

**Antwortfragen:**

| id | Art | Label | Optionen | Ziel | Toleranz | Text richtig | Text falsch / Hinweis | Hilfezeile |
|---|---|---|---|---|---|---|---|---|
| a4a | number | Bei wie viel Prozent der Befragten im Modell liegt es richtig? | – | 95.1 | 0.05 | 95,1 % (Overall Percentage). | Classification Table, Zeile Overall Percentage. Sonderfall 99,5: Das gilt nur für die, die wählen wollen. | Prozent, aus `summary()`. |
| a4b | number | Bei wie viel Prozent derselben Befragten läge die Regel „alle wählen“ richtig? | – | 94.82 | 0.05 | 94,82 %: (12 + 2603) / 2758 × 100. Das Modell trifft nur 0,3 Prozentpunkte öfter. 94,82 % ist der Anteil derer, die wählen wollen, unter den 2.758 im Modell (dem Split-Teil mit gültigen Antworten bei allen drei Fragen), etwas mehr als die 94,17 % aus Aufgabe 1. | Tausch in der Vorlage aus Schritt 2: 12 und 2603 oben, 2758 unten (18 + 125 + 12 + 2603). Sonderfall 91,38 (± 0,05): Das ist das Smartphone-Beispiel. Sonderfall 94,17 (± 0,05): Das ist der Anteil aus Aufgabe 1, über alle mit gültiger Wahlabsicht; die Regel muss man an denselben Befragten messen wie das Modell, also an der Classification Table. Sonderfall 5,18: Das ist die Regel „alle nicht“. | Prozent, zwei Kommastellen reichen. |
| a4c | number | Wie viel Prozent der Befragten, die nicht wählen wollen, erkennt das Modell? | – | 12.8 | 0.25 | 12,8 %: 18 von 143 (R rechnet mit ungerundeten Zellen, von Hand mit den gedruckten Zahlen kommen 12,6 heraus). Fast alle, die nicht wählen wollen, sagt das Modell als Wählende vorher. | Classification Table, Zeile „würde nicht wählen“, Spalte % Correct. | Prozent, aus `summary()`. |
| a4d | number | Wie groß ist −2LL im Nullmodell (nur mit der Konstante)? | – | 1122.279 | 0.05 | 1.122,279 = 856,448 + 265,831. −2LL sinkt um 23,7 %; genau das ist McFadden R² (0,237). | Tausch in der Vorlage aus Schritt 3: −2 Log Likelihood (856.448) und Chi-square (265.831). Sonderfall 2.824,895: Das ist das Smartphone-Beispiel. Sonderfall 856,448: Das ist −2LL des Modells selbst. | Eine Zahl, die Kommastellen von R reichen. |
| a4e | choice | Welcher Satz zu Nagelkerke R² = 0,275 stimmt? | gut: „Das Modell passt deutlich besser als eines ohne Prädiktoren; einen Anteil erklärter Varianz darf man daraus nicht lesen.“; prozent: „Pflichtgefühl und Interesse erklären 27,5 % der Wahlabsicht.“; schlecht: „Unter 0,5 ist ein Modell wertlos.“ | gut | – | Genau. Nach der groben Faustregel ist 0,275 brauchbar; als Prozent erklärter Varianz liest man es nicht (Grundlage 4c). | Pseudo-R² ist kein Anteil erklärter Varianz und hat keine harte Grenze. Grundlage 4c. | – |
| a4f | choice | Was gehört in deinen Bericht? | beides: „Das Modell trifft 95,1 %, aber die Regel „alle wählen“ schon 94,8 %; von denen, die nicht wählen wollen, erkennt es nur 12,8 %. −2LL sinkt deutlich (Omnibus-Test signifikant, Nagelkerke 0,275).“; nur: „Das Modell ist mit 95 % Trefferquote sehr gut.“ | beides | – | Genau: Trefferquote immer mit der einfachsten Regel vergleichen und die seltene Gruppe nennen. Der Zusammenhang ist trotzdem deutlich. | Die Trefferquote allein täuscht bei seltenen Antworten: Nur gut 5 % wollen nicht wählen. Grundlage 4a. | – |

Rückmeldung zur Festlegung: „Du hattest festgelegt: … Tatsächlich liegt das Modell aus Aufgabe 2 bei 95,1 % richtig, aber schon die Regel „alle wählen“ träfe 94,8 %.“

**Hilfe, Stufe 1: Denkanstoß:** „Wenn fast alle wählen wollen, liegt man mit „alle wählen“ fast immer richtig. Vergleich das Modell mit dieser Regel. −2LL vergleicht man mit dem Nullmodell.“

**Hilfe, Stufe 2: Wo schaue ich?:** „Classification Table: Overall Percentage, die Zeile „würde nicht wählen“ und die vier Zellen. Model Summary: −2 Log Likelihood und Nagelkerke R Square. Omnibus Tests: Chi-square.“

**Hilfe, Stufe 3: Lösung:** „Trefferquote 95,1 %, Regel „alle wählen“ `(12 + 2603) / 2758 * 100` = 94,82 %. Von 143 (gewichtet), die nicht wählen wollen, erkennt das Modell 18 (12,8 %). −2LL Nullmodell `856.448 + 265.831` = 1.122,279; das Modell senkt es um 265,831 (Omnibus-Test Sig. <.001), McFadden 0,237, Nagelkerke 0,275. Das Modell erklärt die Wahlabsicht deutlich, kann aber kaum vorhersagen, wer nicht wählen will.“

**Ohne Grafik lösbar:** „Diese Aufgabe hat keine Grafik. Alle Zahlen stehen in der Ausgabe von `summary()`.“

---

## 8 Hilfe bei R-Fehlermeldungen (unter jeder Aufgabe, zugeklappt „Hilfe: R meldet einen Fehler“)

| R meldet | Das hilft |
|---|---|
| `konnte Funktion "logistic_regression" nicht finden` oder `konnte Funktion "%>%" nicht finden` | Den Startblock in „R lesen“ ausführen. |
| ``Variables not found in data: `waehlen` and `pflicht`.`` | Die Variablen gibt es nur, wenn `mutate()` mit `rec()` in derselben Kette steht. Nimm die ganze Vorlage, auch den Teil „wie in Aufgabe 1“. |
| ``Dependent variable `pv01` must be binary: it has 8 distinct values.`` | Links von `~` steht eine Variable mit mehr als zwei Werten. Nimm die 0/1-Variable `waehlen`. |
| `Tibble columns must have compatible sizes.` | In `tibble()` hat ein `c()` mehr oder weniger Zahlen als das andere. Jede Spalte braucht vier Werte, einen je Person. |
| `Objekt 'age' nicht gefunden` (bei `predict()`) | Die Spalten in `tibble()` müssen genau so heißen wie die Prädiktoren im Modell. |
| `konnte Funktion "marginal_effect" nicht finden` | Schreibweise: `marginal_effects()` mit s am Ende. |
| `konnte Funktion "Exp" nicht finden` | R unterscheidet Groß- und Kleinschreibung: `exp()` klein. |
| `Unerwartete(s) ','` | Kommazahlen in R mit Punkt: `98.8 / 1.2`, nicht `98,8 / 1,2`. |
| `predict()` gibt Zahlen über 1, etwa `4.499` | `type = "response"` fehlt; das sind Logits, keine Wahrscheinlichkeiten. |
| Exp(B) deutlich unter 1, etwa 0,27 | Richtung prüfen: Ist „würde wählen“ die 1, und sind `pe09` und `pa02a` mit `rules = "rev"` umgepolt? 0,27 ist der Kehrwert von 3,77. |
| In RStudio erscheint `+` und nichts passiert (in der Werkstatt: `unerwartetes Ende der Eingabe`) | Eine Klammer ist nicht geschlossen. In RStudio mit Esc abbrechen, dann die Klammern zählen. |

---

## 9 Überblick „Logistische Regression lesen“

Kopf: „Überblick zu allen Aufgaben“. Unterzeile: „Alle vier Themen zusammen: welche Zahl in welcher Sprache spricht, wann man logistisch rechnet und was ein Modell braucht.“

#### Karte Ü1 „Drei Sprachen, eine Zahl“

| Sprache | Zahl in der Ausgabe | Pflichtgefühl, eine Stufe mehr (Aufgaben 2 und 3) | gilt für alle gleich? |
|---|---|---|---|
| Logit | B | + 1,326 | ja |
| Chance | Exp(B) | × 3,77 | ja |
| Wahrscheinlichkeit | `predict()` | + 16,0 Prozentpunkte (Person A), + 2,9 (Person B) | nein, hängt vom Ausgangspunkt ab |
| Wahrscheinlichkeit im Mittel | AME | mittlere Steigung: 5,4 Prozentpunkte je Stufe | Mittelwert über alle im Modell; eine ganze Stufe bringt meist etwas weniger |

Text darunter: „Alle Zahlen stammen aus demselben Modell, und alle sind richtig. Wer eine Zahl berichtet, sagt dazu, in welcher Sprache sie spricht. Für Laien am verständlichsten: Wahrscheinlichkeiten für Beispielpersonen oder der AME in Prozentpunkten.“

#### Karte Ü2 „Welches Regressionsmodell?“ (Bild B13 `s11-welche-regression`, Entscheidungsbaum wie im Überblick von Sitzung 4)

Baum von oben nach unten:
- Frage (Kasten): „Was ist die abhängige Variable?“
- „metrisch, viele Werte (etwa Lebenszufriedenheit 0 bis 10, Einkommen)“ → Blatt „**lineare Regression**, `linear_regression()`; B in Einheiten der Variable, R²“ (Sitzung 9 und 10).
- „zwei Ausprägungen (Ja/Nein, 0/1)“ → Blatt „**logistische Regression**, `logistic_regression()`; Exp(B) für Chancen, `predict()` und AME für Prozentpunkte, Pseudo-R²“.
- Unter dem Baum klein, grau: „Mehr als zwei ungeordnete oder geordnete Stufen (etwa die Parteiwahl): eigene Verfahren (multinomiale, ordinale Regression), nicht Teil dieses Kurses. Oft fasst man vorher mit `rec()` zu zwei Gruppen zusammen.“
Optik: Fragekasten weiß mit dunklem Rand, Blätter als grüne Steine.

Textfassung B13: „Entscheidungsbaum. Frage: Was ist die abhängige Variable? Wenn sie metrisch ist und viele Werte hat, etwa Lebenszufriedenheit oder Einkommen: lineare Regression mit linear_regression, gedeutet über B und R². Wenn sie genau zwei Ausprägungen hat, Ja oder Nein: logistische Regression mit logistic_regression, gedeutet über Exp(B) für Chancen, vorhergesagte Wahrscheinlichkeiten und AME für Prozentpunkte, Pseudo-R² für die Güte. Für mehr als zwei Stufen gibt es eigene Verfahren, die nicht Teil dieses Kurses sind.“

#### Karte Ü3 „Voraussetzungen“

| Voraussetzung | heißt | prüfen | in dieser Sitzung |
|---|---|---|---|
| Abhängige Variable 0/1 | genau zwei Ausprägungen, richtig kodiert | „Dependent Variable Encoding“: Was ist die 1? | `waehlen`: 1 = würde wählen; „weiß nicht“ und Nicht-Wahlberechtigte NA |
| Genug Fälle in der selteneren Gruppe | Faustregel: mindestens 10 Fälle der selteneren Ausprägung je Prädiktor | `frequency()` der abhängigen Variable im Modell | 146 Befragte, die nicht wählen wollen (gezählt), bei 2 Prädiktoren |
| Gleichmäßiger Verlauf im Logit | jeder Schritt eines Prädiktors ändert den Logit gleich viel | Anteile je Stufe ansehen (`crosstab()`), Hosmer-Lemeshow | Alter beim Smartphone: passt. Interesse: „stark“ 97,5 %, „sehr stark“ 94,1 %, nicht gleichmäßig; Hosmer-Lemeshow Sig. .039 |
| Unabhängige Fälle | jede Person einmal, nicht gruppiert | Erhebung | ALLBUS: jede befragte Person zählt einmal |
| Keine perfekte Abhängigkeit der Prädiktoren | wie in Sitzung 10 (Multikollinearität) | Prädiktoren vergleichen | – |
| Gewichtung | Aussagen über Deutschland | `weights = wghtpew` | ungewichtet Exp(B) 3,703 statt 3,765 |
| Keine Ursache aus Zusammenhang | das Modell vergleicht Menschen | Begründung, nicht Statistik | Pflichtgefühl und Wahlabsicht können gemeinsame Ursachen haben |

Text darunter: „Skalen wie „stimme voll zu“ bis „stimme gar nicht zu“ gehen mit ihren Codes ins Modell (die `Note` in der Ausgabe). Das setzt voraus, dass die Stufen gleich weit auseinanderliegen. Passt das nicht, kann man sie als Gruppen ins Modell nehmen, als Dummys mit einer Referenzgruppe (kennst du aus Sitzung 10: `to_dummy()`; die `Note` schlägt die Abkürzung `to_label()` vor).“

Häufige Verwechslung: „„Das Modell sagt, wer wählen geht.“ Es sagt für Menschen mit bestimmten Antworten, wie viele von ihnen wählen wollen. Über eine einzelne Person und über tatsächliches Wählen sagt es nichts.“

---

## 10 Mitnehmen

### Das Wichtigste aus dieser Sitzung
- Hat die abhängige Variable nur zwei Ausprägungen (0/1), ist ihr Mittelwert der Anteil der Einsen. Eine Gerade würde über 100 % und unter 0 % hinauslaufen; die logistische Regression zeichnet eine S-Kurve.
- Drei Sprachen: Wahrscheinlichkeit (0 bis 1), Chance = p / (1 − p) („3 zu 1“), Logit = ln(Chance). Zurück: Chance = exp(Logit), p = Chance / (1 + Chance).
- Das Modell rechnet in Logits: Logit = Konstante + B × Wert. B > 0 heißt: die Chance steigt.
- Exp(B) vervielfacht die Chance, nicht die Wahrscheinlichkeit. Exp(B) = 3,77: je Einheit wird die Chance 3,77-mal so groß; (Exp(B) − 1) × 100 ist die Veränderung in Prozent.
- In Prozentpunkten hängt ein Effekt vom Ausgangspunkt ab: in der Mitte der S-Kurve groß, nahe 0 oder 100 % klein. `predict(…, type = "response")` gibt Wahrscheinlichkeiten für Beispielpersonen, der AME einen Mittelwert in Prozentpunkten.
- Güte: Trefferquote immer mit der Regel „alle bekommen die häufige Antwort“ vergleichen; −2LL mit dem Nullmodell (Omnibus-Test); Nagelkerke R² ist kein Anteil erklärter Varianz.
- In R: `logistic_regression(y ~ x1 + x2, weights = wghtpew)`, dann `summary()`, `predict()`, `marginal_effects()`. Jede Vorlage bildet ihre Variablen mit `rec()` in `mutate()` selbst.

### Prüf dich selbst (5 Fragen, je Auswahl mit Prüfen; Rückmeldung „Deine Wahl: „…“.“ plus Begründung)

1. „Eine Gruppe hat die Wahrscheinlichkeit 75 %. Wie groß ist ihre Chance?“ Optionen: „0,75“, „3“, „75“. Richtig: 2. Begründung: „Chance = 75 / 25 = 3, also „3 zu 1“ (Grundlage 1c).“
2. „In einem Modell steht für einen Prädiktor B = −0,5. Was gilt für Exp(B)?“ Optionen: „größer als 1“, „genau 1“, „kleiner als 1“. Richtig: 3. Begründung: „Negatives B heißt: Der Logit sinkt, die Chance wird kleiner. Exp(−0,5) ist etwa 0,61 (Grundlage 2b).“
3. „Exp(B) = 2 für ein Merkmal. Eine Person hat die Wahrscheinlichkeit 60 %. Was gilt mit einer Einheit mehr?“ Optionen: „120 %“, „Die Chance steigt von 1,5 auf 3, die Wahrscheinlichkeit auf 75 %“, „62 %“. Richtig: 2. Begründung: „Exp(B) vervielfacht die Chance: 60 / 40 = 1,5, mal 2 ist 3, und 3 / (1 + 3) = 0,75 (Grundlagen 2b und 3a).“
4. „Dasselbe Exp(B) bringt Person X +15 Prozentpunkte und Person Y +2. Was ist wahrscheinlich?“ Optionen: „X startet in der Mitte der S-Kurve, Y nahe 100 %“, „Das Modell ist falsch“, „Bei Y wirkt das Merkmal schwächer“. Richtig: 1. Begründung: „In Chancen wirkt es bei beiden gleich; in Prozentpunkten ist die S-Kurve in der Mitte steil und an den Rändern flach (Grundlage 3b).“
5. „Nur 3 % einer Stichprobe sagen Ja. Ein Modell trifft 97 % richtig. Was folgt daraus?“ Optionen: „Das Modell ist sehr gut“, „Noch nichts: Die Regel „alle Nein“ trifft auch 97 %“, „Das Modell ist schlecht“. Richtig: 2. Begründung: „Bei seltenen Antworten erreicht schon die einfachste Regel eine hohe Trefferquote. Erst der Vergleich und −2LL zeigen, was das Modell leistet (Grundlage 4a).“

### Dein Skript zum Mitnehmen

Text: „Alle Vorlagen dieser Sitzung in einer Datei, mit Kommentaren. Öffne sie in RStudio und führe sie Block für Block aus. Jeder Block läuft für sich.“ Der Satz kommt über den gemeinsamen Baustein (`scriptNote`). Knopf „Skript herunterladen (sitzung11.R)“; Link „→ Nachlesen im R-Workshop, Kapitel 9.8“.

Skriptteile in dieser Reihenfolge (Titel als Kopfkommentar `# ---- Titel ----`, Marken mit ihrem Beispielwert; ohne Probier-Werkstätten):

| Schlüssel | Titel |
|---|---|
| `start` | Startblock |
| `r_modell` | Logistisches Modell: Smartphone nach Alter |
| `r_exp` | Aus B wird Exp(B) |
| `r_predict` | Vorhergesagte Wahrscheinlichkeiten für zwei Beispielpersonen |
| `r_ame` | Durchschnittlicher marginaler Effekt |
| `a1f` | Aufgabe 1: Wählen als 0/1 |
| `a1k` | Aufgabe 1: Kreuztabelle Pflichtgefühl × Wählen |
| `a1r` | Aufgabe 1: Prozentpunkte je Stufe |
| `a1c` | Aufgabe 1: Chance |
| `a2` | Aufgabe 2: logistisches Modell |
| `a2r` | Aufgabe 2: Exp(B) in Prozent |
| `a3h` | Aufgabe 3: von Hand |
| `a3p` | Aufgabe 3: predict() für vier Personen |
| `a3m` | Aufgabe 3: AME |
| `a4` | Aufgabe 4: Modellgüte |
| `a4r` | Aufgabe 4: Regel „alle Ja“ |
| `a4l` | Aufgabe 4: −2LL des Nullmodells |

Kopf des Skripts: „# Sitzung 11: Logistische Regression“, „# Statistikatlas, Methoden Ib, ALLBUS 2023 (ZA8831 v1.3.0), gewichtet mit wghtpew“, „# Markierte Stellen aus dem Atlas stehen hier mit ihrem Beispielwert.“ (wie Sitzung 4). Probier-Werkstätten (`frei_a1` bis `frei_a4`) sind als `tryOut` markiert und stehen nicht im Skript.

---

## 11 Entscheidungen (offene Fragen, die ich selbst entschieden habe)

1. **Variablen.** Die Aufgaben übernehmen den Kern der alten Aufgabe (Wahlabsicht `pv01` aus Pflichtgefühl `pe09` und Interesse `pa02a`, gewichtet), weil er alle Kernbegriffe trägt: Deckeneffekt bei 94 % Wahlabsicht, Exp(B) 3,77 gegen +16,0 und +2,9 Prozentpunkte, AME 5,4, Trefferquote 95,1 gegen 94,8. Die Grundlagen nutzen das Neutral-Beispiel der alten Aufgabe (Smartphone `lm30` nach Alter, Einstieg „S-Kurve selbst einstellen“): `lm30` ist schon 0/1 kodiert (kein Umkodieren in „R lesen“), aus Sitzung 1 bekannt, und die S-Kurve passt sehr gut zu den Altersgruppen. Grundlage und Aufgabe teilen keine Variable.
2. **`lm30` nur unter Internetnutzenden.** Die alte Aufgabe zählte Nicht-Nutzende (TNZ: FILTER) als „nein“; das geht mit `rec()` nicht (getaggte fehlende Werte werden NA, geprüft). Das Kapitel bleibt bei den 4.777 Internetnutzenden und sagt das in Karte 1a und R1. Dadurch flacht die Kurve unten ab (59,3 % bei 80–99), sie reicht nicht bis 0; für die Lehrziele (Gerade über 100 %, S-Form, gleiche Faktoren, verschiedene Prozentpunkte) genügt das.
3. **Keine Rollen, keine Namen.** Statt Bürgerrat, Jana und Herrn Wiegand: „Person A“ und „Person B“ mit denselben Antwortprofilen (2 | 2 und 3 | 4). Die alte Leitidee „dieselbe Zahl in drei Sprachen“ steckt in Aufgabe 3 und Überblick Ü1; die Entscheidung „welche Zahl in den Bericht“ wird Frage a3g und „Fürs Plenum“.
4. **Vier Themen, drei Pflicht.** Modellgüte (alte Station 6, dort optional) ist Zusatz A4; Pflicht A1–A3 etwa 43 Minuten. Nagelkerke und Omnibus-Test bekommt jede Studentin trotzdem in Grundlage 4 und im Überblick; Pflicht-A2 berührt die Güte nur über N und Sig.
5. **A1 ohne Modell.** A1 bereitet mit `frequency()`, `crosstab()` und Taschenrechner vor (0/1, Deckeneffekt, Chance). „Warum keine Gerade“ wird an den echten Zeilenprozenten gezeigt (Zuwachs 16,9 → 4,0 Punkte; gedachte gleiche Schritte 112,1 %), die lineare Regression nur in der Probier-Werkstatt, weil sie bei `pflicht` genau 100,0 % trifft und das Argument dort schwach wäre.
6. **Vorlagen für sich lauffähig (Nachtrag).** Jede Vorlage mit Modell wiederholt den `mutate()`-Block. Das macht A3 und A4 länger, hält aber die Schreibweise von Aufgabe 1 bis 4 gleich und ist im Kommentar „wie in Aufgabe 1/2“ benannt. `modell` als Zwischenobjekt nur in A2, A3 (Schritt 2) und der Probier-Werkstatt A3, jeweils innerhalb derselben Vorlage.
7. **A2 mit markierter Formel.** Die Vorlage startet mit `waehlen ~ ⟦pflicht⟧`, die Studierenden ergänzen `+ interesse`. So sehen sie Exp(B) 3,888 → 3,765 („bei gleichem Interesse“, Rückgriff auf Sitzung 10); die Antwortprüfung erkennt 3,888 als Sonderfall.
8. **Wahrscheinlichkeiten als Prozent abgefragt.** Die Antwortprüfung kennt je Frage nur ein Ziel. Darum fragen a3b–a3d in Prozent bzw. Prozentpunkten (Hilfezeile „0.55 heißt 55 %“), Anteile wie 0,76 sind Sonderfälle mit Hinweis. a3b Ziel 76,45 ± 0,11 nimmt die Handrechnung (76,46, gerundet 76,5) und `predict()` (76,44, gerundet 76,4) an.
9. **Toleranzen.** Exp(B) ± 0,01 (3,77 und 3,765); Chancen aus Prozent ± 1,6 bei a1f (deckt 82,33 aus Zeilenprozent und 83,76 aus gewichteten Anzahlen), ± 0,01 bei a3a; Prozentwerte aus der Ausgabe ± 0,05–0,2; −2LL ± 0,05. Kein Ziel ist durch Tausenderpunkte mehrdeutig: 1122.279 wird als 1122,279 oder 1122279 gelesen, nur die erste Lesart liegt im Ziel; 94.82, 95.1, 12.8, 3.765 sind eindeutig.
10. **Gerundete Koeffizienten von Hand.** Grundlagen 2 und 3 und A3 Schritt 1 rechnen mit den drei Nachkommastellen der Ausgabe (so können Studierende nachrechnen). Abweichungen zu `predict()` sind genannt (66,7 gegen 67,0 %; 76,5 gegen 76,4 %).
11. **Funktionen.** Neu laut Leitfaden-Tabelle (Sitzung 11): `logistic_regression()`, `exp()`, `tibble()` + `c()`, `predict()`, `marginal_effects()`, alle in R2 eingeführt. `log()` kommt nicht vor; ln wird nur im Bild erklärt. Keine weitere neue Funktion.
12. **Kein Locale-Hinweis.** Die Warnung „Nicht-ganzzahlige #Erfolge in einem binomial-GLM“ aus dem alten Konzept tritt mit mariposa 0.7.4 auch unter `de_DE.UTF-8` nicht mehr auf (geprüft); sie steht darum nicht in der Fehlerhilfe.
13. **Faustregeln.** Nagelkerke „ab 0,2 brauchbar, ab 0,4 gut“ und „10 Fälle je Prädiktor“ sind als grobe Faustregeln markiert, nicht als Grenzwerte.
14. **Leitfrage** wie in `curriculum.ts`; keine Änderung nötig.
15. **Bildmodul-Name.** Wie in Sitzung 3 vorgeschlagen `bilder/lp11.py` statt `kap11.py`, um Namenskonflikte mit `RWorkshop/figuren/` zu vermeiden.
16. **Frageformulierungen.** `pv01` als Sonntagsfrage und `pe09` sinngemäß („dass die Beteiligung an Wahlen eine Bürgerpflicht ist“) aus Variablenlabel und Antwortstufen; vor der Live-Schaltung mit dem Codebuch abgleichen, falls ein wörtliches Zitat gewünscht ist.

## 12 Abweichungen zu den Folien von Sitzung 11

Für Sitzung 11 (Sitzungsplan 12) liegen noch keine Folien vor (`Seminarvorbereitung/` enthält Sitzung 1 bis 4). Es gibt darum keine Abweichungsliste. Für spätere Folien: dieselben Begriffe (Chance statt „Odds“ im Fließtext, Exp(B), AME, Prozentpunkte), dieselbe Schreibweise der Vorlagen (`rec()` in `mutate()` in der Kette, `%>% summary()`, `predict(…, type = "response")`) und für den Input andere Variablen als `pv01`, `pe09`, `pa02a` (etwa `lm30` × `age` wie die Grundlagen), damit der Input die Aufgaben nicht vorwegnimmt.

## Prüfung (Agent, 23.11.2026)

Geprüft nach `.superpowers/sdd/2026-11-23-lernpfad-kapitel-bausteine-und-pilot/teil-b-plan-pruefung.md`, mit Blick auf `sitzung07.md` (p-Wert), `sitzung09.md` (Regression, B, R², Spalte Sig.) und `sitzung10.md` (mehrere Prädiktoren, Dummys mit `to_dummy()`, Multikollinearität). `Rscript sitzung11-zahlen.R` lief vorher und nach den Änderungen mit Exit 0 (etwa 4 Sekunden); sechs Prüfungen kamen dazu (Gerade mit −0,00474 und mit gerundetem B, Odds Ratio 41,8 / 89,5, AME als `dydx` und ganze Stufe im Mittel kleiner als der AME, Zeile „Factor rows …“ in der Ausgabe von `r_ame`). Alle ```r-Blöcke sind unverändert und werden weiter wörtlich abgeglichen.

### 1. Schwache Studentin ohne Vorwissen (Durchspielen, Zeit)

Befunde:
- Zeit: A1 etwa 14 Minuten (vier kurze Vorlagen, sieben Fragen, meist Ablesen und Tauschen), A2 etwa 12, A3 etwa 17 (drei Vorlagen, sieben Fragen); zusammen etwa 43 Minuten. Mit dem ersten Start der Werkstatt (etwa 30 Sekunden) knapp, aber machbar. Jeder Schritt ist mit Grundlage und Vorlage lösbar; die markierten Stellen sind eindeutig benannt (A3 Schritt 2 nennt die einzusetzenden Werte).
- Die AME-Ausgabe druckt „Factor rows show the average discrete change …“; unerklärt lässt das rätseln, ob etwas falsch ist.
- B2 und Karte 1b nannten die Gerade „1,151 − 0,005 × Alter“, aber 106,6 % für 18-Jährige ergibt sich nur mit −0,00474; wer nachrechnet, kommt auf 106,1 und zweifelt.
- `a4b`: Wer den Anteil aus Aufgabe 1 (94,17 %) einsetzt, bekam nur „falsch“, ohne Hinweis, warum die Regel an der Modellstichprobe gemessen wird.
- Prozentpunkte (Sitzung 5) ohne graues Schild; `a2e` nannte das gewichtete N „Befragte“.

Geändert (5): Erklärsatz zu „Factor rows …“ in Karte R2; Geradenformel in B2 mit −0,00474 und Rechnung, in 1b zusätzlich 106,1 % mit gerundetem B; `a4b` mit Label „derselben Befragten“, Erklärung 94,82 gegen 94,17 und Sonderfall 94,17; Schild „Prozentpunkte: kennst du aus Sitzung 5“ an Karte 3b; `a2e` „N = 2.758 (gewichtet)“.

### 2. Didaktik

Befunde:
- Grundlagen (`lm30` × `age`) führen direkt in die Aufgaben (`pv01`, `pe09`, `pa02a`), keine Variable doppelt, keine Zahl der Aufgaben vorweggenommen; jede Aufgabe hat Festlegen und Deuten-Fragen; Probier-Werkstätten sind echte Anschlussfragen (Gerade bei `pflicht`, Alter als Kontrolle, S-Kurve über alle Stufen, Modell nur mit Interesse).
- Der Titel von A2 „Was heißt Exp(B) = 3,77?“ verriet Zielwert `a2b` und die Auflösung des Festlegens (× 1,2 / × 4 / × 20).
- Das Festlegen in A4 nannte 95,1 % und damit die Antwort auf `a4a`; die Hilfezeile in A4 Schritt 2 rechnete die Summe schon vor.
- „Odds Ratio“ fiel als Name, ohne zu sagen, welche zwei Chancen ins Verhältnis gesetzt werden.

Geändert (4): A2 heißt „Was heißt Exp(B) für das Pflichtgefühl?“ (Kapitel und Tabelle §2); A4-Festlegen als gedachtes Modell („95 von 100“), Rückmeldung nennt danach 95,1 und 94,8; Hilfezeile Schritt 2 verweist auf N in der Ausgabe; Karte 2b mit Zeile „Warum Odds Ratio?“ (41,8 / 89,5 = 0,47, Zahlen aus B6).

### 3. Fachliches und Barrierefreiheit

Befunde:
- Chance und Wahrscheinlichkeit werden durchgehend sauber getrennt (1c, 2b, `a1g`, `a2c`, `a3e`, `a3g`, Selbsttest 3); Exp(B) ist überall Faktor für die Chance, „bei gleichem Interesse“ steht, wo zwei Prädiktoren im Modell sind. Alle Zielwerte entsprechen der gedruckten mariposa-Ausgabe; Toleranzen decken Hand- und `predict()`-Rechnung.
- **AME:** mariposa rechnet für metrische Prädiktoren die mittlere Steigung (`dydx`). Der Plan beschrieb ihn als Änderung „bei einem Jahr/einer Stufe mehr“. Für `pflicht` ist das deutlich zu hoch: eine ganze Stufe mehr bringt im gewichteten Mittel nur 3,5 statt 5,4 Prozentpunkte (im Skript geprüft, nicht im Kapitel).
- −2LL hieß „wie weit es [das Modell] davon [vom Maximum] noch entfernt ist“; das Modell liegt aber im Maximum. Omnibus: „erklären mehr als der Zufall“ ungenau.
- Grundgesamtheit: Mehrere Deutungen des Smartphone-Modells (2a, 3a „von 100 Menschen dieses Alters“, 3c, 4a „der Befragten“, „415 Befragte“) sagten nicht, dass sie nur für Internetnutzende gelten; R1 nannte die 4.777 als „alle, die das Internet nutzen und ihr Alter angegeben haben“ (es fehlen auch 11 ohne gültige Antwort bei `lm30`). Beim Wahlmodell sagten `a3f`, `a4a`, `a4b` und Kurz gesagt 3c „alle Befragten“, obwohl nur die Split-Hälfte mit gültigen Antworten im Modell ist.
- Karte 4a mischte `predict()` (99,6 % mit 18) und Handrechnung (66,7 % mit 80).
- „Nichtwählende“ (A4-Titel, `a4f`, Hilfe, Ü3) klang nach tatsächlichem Verhalten; gemessen ist die Absicht.
- Ü3 empfahl `to_label()` für Dummys „wie in Sitzung 10“; Sitzung 10 arbeitet mit `to_dummy()` und nennt `to_label()` nur als Abkürzung. Spalte Sig. ist erst in Sitzung 9 eingeführt (p-Wert in Sitzung 7).
- Gewichtete Fallzahlen der Classification Table hießen „Fall“/„Befragte“.
- Barrierefreiheit: Jedes Bild hat eine Textfassung mit Werten; B10 erscheint erst nach dem Prüfen und hat Textfassung; alle Aufgaben ohne Grafik lösbar. Sprache, R-Stil, Aggregate: ohne Befund (kein „·“, kein „(fiktiv)“, kein `ifelse()`, `%>%`, `rec()` in `mutate()`, kleinste Zahlen sind die Zellen 4 und 5 der Classification Table des Smartphone-Modells, gewichtete Modellzählungen ohne Merkmale einzelner Personen).

Geändert (10): AME in Karte 3c als mittlere Steigung erklärt (Beispiel, neue Zeile „Genau genommen …“ mit Hinweis auf ganze Stufen), `a3f` mit Label „Wie groß ist der AME …“ und Hinweis auf Annäherung, `a3g` „etwa 5“ statt „gut 5“, Ü1 „mittlere Steigung“; −2LL-Beschreibung in 4b berichtigt; Omnibus-Satz präzisiert; „Internetnutzende“ in R1, 1a, 2a, B5, 3a, 3c, 4a ergänzt; 4a mit 67,0 % aus `predict()`; „im Modell“/Split-Hälfte in Kurz gesagt 3c, `a3f`, `a4a`, `a4b`; A4 heißt „Erkennt das Modell, wer nicht wählen will?“, „Nichtwählende“ überall durch die Absicht ersetzt; Ü3 nennt `to_dummy()` (Sitzung 10) und `to_label()` als Abkürzung aus der `Note`; Schild „Sig.: kennst du aus Sitzung 7 und 9“; „(gewichtet)“ bei 415, 143 und „einem Fall“.

### Bewusst nicht geändert

- **Zahl 3,5 Prozentpunkte (ganze Stufe) nicht ins Kapitel:** Sie bräuchte eine weitere Rechnung und Erklärung (Personen auf Stufe 4 haben keine Stufe 5). Der Hinweis „nur eine Annäherung, oben meist weniger“ reicht für das Lernziel; die Zahl steht als Prüfung im Skript.
- **Unabhängige Fälle (Ü3):** Der ALLBUS ist nach Gemeinden geklumpt; das wird wie in Sitzung 9 und 10 nicht vertieft.
- **Handrechnung neben `predict()` in B5, B8, B9** (66,7 gegen 67,0 %, 81,1 gegen 81,2 %): So können Studierende jede Zahl mit den gedruckten drei Stellen nachrechnen; die Abweichung ist in 2a und 3a benannt.
- **Faustregeln** Nagelkerke 0,2/0,4 und „10 Fälle je Prädiktor“ bleiben, ausdrücklich als grob markiert.
- **A3 mit 17 Minuten** nicht gekürzt: Handrechnung, `predict()` und AME tragen zusammen das Kernziel (gleicher Faktor, verschiedene Prozentpunkte).
- **Wortlaut von `pv01`/`pe09`** (Entscheidung 16) bleibt vor der Live-Schaltung mit dem Codebuch abzugleichen.

## Nacharbeit nach Kapitelprüfung (23.11.2026)

Befunde der Kapitelprüfung, im Kapitel und hier im Plan geändert:

- **Split-Anteil (wichtig):** `pe09` haben 3.602 Befragte gültig beantwortet, 1.596 haben TNZ: SPLIT, von 5.246 also gut zwei Drittel, nicht „eine Hälfte“. Geändert: Einleitung Aufgabe 1 („gut zwei Dritteln (1.596 haben TNZ: SPLIT …)“), Option `a2e` („nur ein Teil der Befragten (Split-Teil)“), Auflösung `a3f`, `a4b`, Hilfe a2 Stufe 3. „Nur gut die Hälfte … im Modell“ (Ziel Aufgabe 2) bleibt: 2.758 von 5.246 sind 52,6 %.
- **AME (wichtig):** Der AME ist die mittlere Steigung; eine ganze Stufe bringt etwa 3,5 Prozentpunkte. `a3g` (richtige Option): „im Mittel um etwa 5 Prozentpunkte (mittlerer marginaler Effekt; eine ganze Stufe bringt meist etwas weniger)“; `a3f`-Auflösung, Hilfe a3 Stufe 3 („mittlere Steigung je Stufe“) und Ü1 („mittlere Steigung: 5,4 Prozentpunkte je Stufe“) entsprechend. Die Zahl 3,5 steht weiter nur im Skript.
- **K3B:** Auflösung beginnt jetzt mit „Der Logit sinkt bei beiden um 0,76, die Chance wird bei beiden mit 0,47 malgenommen.“ (Karte 3b, Text im Kapitel; die Textfassung B9 sagt dasselbe in ihrem letzten Satz).
- **`a4c`:** Toleranz 0.25 statt 0.05 (18 / 143 = 12,6 von Hand, R rechnet mit ungerundeten Zellen 12,8); die Auflösung sagt es.
- **B7:** Die markierte Stelle ist nicht nur farbig (`<mark>`, fett, Balken, „Markiert: “ für Screenreader); das fokussierbare `<pre>` hat kein `aria-label` mehr, der Name steht per `aria-labelledby` an der `<figure>`.
- **B5:** Satz zur Tastatur („Mit den Pfeiltasten gehst du zehn Jahre weiter“) und „Internetnutzende“ in der Bildbeschreibung.
- **Du-Form:** Fürs Plenum in Aufgabe 3: „Bring eine Antwort mit Begründung mit und einen Satz …“.
- **Gemeinsame Bausteine:** die fünfte Zeile von „So arbeitest du“ über `howToExtra` (statt eigenem Block), „Jeder Block läuft für sich.“ über `scriptNote`.
- **Regel Auflösung (Entscheidung des Leiters):** „Tatsächlich …“ (Festlegen) und Bild B10 erscheinen erst, wenn keine Frage der Aufgabe mehr offen ist (bisher: sobald eine Frage geprüft war). Die Rückmeldung nach „Antworten prüfen“ zeigt weiter jede Frage einzeln.
