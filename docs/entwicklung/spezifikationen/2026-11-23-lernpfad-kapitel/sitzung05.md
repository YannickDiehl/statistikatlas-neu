# Sitzung 5 „Kreuztabellen“: Inhaltsplan für das Kapitel

Stand: 23.11.2026. Curriculum-Eintrag `id: 5` („Sitzungsplan 4“), bisherige Aufgabe `s04` (`src/tasks/s04-nenner-check/`), Konzept `2026-09-29-lernpfad-aufgaben/sitzung-04.md` (alte Nummerierung). Muster: `prototyp/sitzung4.html`.

Alle Zahlen: ALLBUS 2023 (ZA8831 v1.3.0), ungewichtet, mit R 4 und mariposa 0.7.4 gerechnet; jede Zahl und jede Vorlage wird von `sitzung05-zahlen.R` geprüft (läuft mit `Rscript` ohne Fehler, 244 Prüfungen; jede Vorlage läuft dort wie in der Code-Werkstatt in einer frischen Umgebung, in der nur der frisch geladene `allbus` existiert). Nur Aggregate. Bilder mit Einzelpersonen zeigen konstruierte Beispielwerte („zum Beispiel …“).

Schreibweisen in diesem Plan: Zahlen im Fließtext deutsch (2.630; 87,0 %). Wo R etwas ausgibt, steht die R-Schreibweise dabei (`87.0%`, `2630`). ⟦…⟧ markiert in Vorlagen die Stellen, die Studierende anpassen; die Markierung selbst steht nicht im kopierbaren Code.

---

## 1. Kopf

**Stein:** 5 / **Titel:** Kreuztabellen / **Überzeile:** Sitzung 5

**Begleitfigur mit Leitfrage** (`hallo.svg`):
> Gehen Misstrauende nicht mehr wählen? Und auf wen beziehen sich die Prozent, die man darüber liest?

**Wegweiser** (drei Kacheln wie Sitzung 4):
- **Vorweg: R lesen** – neue Variable, Kreuztabelle
- **Vier Themen** – je erst die Grundlage, dann die Aufgabe; im Seminar direkt zur Aufgabe springen
- **Zum Schluss** – Überblick, Wichtigstes, Selbsttest, Skript

### Was du nach dieser Sitzung kannst (Lernziele)
- **Verfahren:** aus einer Frage mit vielen Antworten Gruppen bilden (umkodieren), auch eine Dummyvariable mit nur 0 und 1; zwei Variablen in einer Kreuztabelle gegenüberstellen
- **Interpretation:** dieselbe Zelle als Zeilen-, Spalten- und Gesamtprozent lesen und sagen, welche Frage jede Zahl beantwortet; Gruppen vergleichen und den Unterschied in Prozentpunkten angeben
- **Voraussetzungen:** wissen, wer in der Tabelle fehlt (fehlende Werte, Split), warum kleine Gruppen wackelige Prozent liefern und warum ein Zusammenhang noch keine Ursache ist
- **Code lesen:** eine neue Variable mit `mutate()` und `rec()` lesen und ihre Regel anpassen; mit `crosstab()` und `percentages =` die passende Prozentbasis einstellen; eine Skala mit `rules = "rev"` umpolen

### Schon bekannt und hier nur kurz erinnert
Text (unter den Lernzielen, wie Sitzung 4):
> Schon bekannt und hier nur kurz erinnert: der Startblock und `<-` (Sitzung 1), die Pipe und die Codes der Wahlabsicht `pv01` (Sitzung 2), `frequency()` mit Valid % und fehlenden Werten, und dass dieselbe Zahl mit verschiedenen Basen verschiedene Prozent ergibt (Sitzung 3, Wahlabsicht), die Kette aus mehreren Schritten, `drop_na()`, `to_label()` und Balken auf 100 % (Sitzung 4). Aus der Vorlesung kennst du abhängige und unabhängige Variable (AV und UV) und den Chi-Quadrat-Test. Solche Stellen tragen ein graues Schild „kennst du aus Sitzung …“ oder „Wiederholung aus der Vorlesung“. Alle Zahlen sind ungewichtet; wie man gewichtet, lernst du in Sitzung 6.

### So arbeitest du mit dieser Seite
Unverändert aus Sitzung 4 (vier Zeilen: Genauer erklärt, Kurz überlegen, Code-Werkstatt, Markierte Stellen).

### Sprungknöpfe fürs Seminar
> **Im Seminar?** Jedes Thema beginnt mit seiner Grundlage zum Vertiefen der Folien. Wer sie schon kann, springt direkt zur Aufgabe: [Aufgabe 1] [Aufgabe 2] [Aufgabe 3] [Aufgabe 4]

**Grundsatz für alle Vorlagen (bindend, Nachtrag zum Auftrag):** Die Code-Werkstatt setzt `allbus` vor jedem Ausführen auf die frisch geladene Datei zurück. Darum bildet jede Vorlage die Variablen, die sie braucht, in ihrer eigenen Kette (`allbus %>% mutate(…) %>% crosstab(…)`); wiederholte Schritte tragen den Kommentar „kennst du aus Aufgabe 1“. Keine Vorlage legt etwas mit `<-` ab (geprüft in `sitzung05-zahlen.R`). Nur das Skript zum Mitnehmen bildet die Variablen einmal oben und legt sie ab.

---

## 2. Themen, Variablen, Aufgaben

| Thema | Grundlage (Variablen) | Aufgabe (Variablen, Art) |
|---|---|---|
| Vorweg: R lesen | Neue Variable `teilzeit` aus `work`; Kreuztabelle `sex` × `teilzeit` | – |
| 1 Gruppen bilden: Umkodieren | Gruppen zuschneiden (work: Vollzeit, Teilzeit, nebenher, nicht erwerbstätig) | A1 Zwei Gruppen für die Wahlfrage, **Pflicht** (pe01 → `misstrauen`, pv01 → `nichtwahl`) |
| 2 Eine Zelle, drei Prozentbasen | Geschlecht × Teilzeit, Basis-Schalter (sex, teilzeit) | A2 Stimmt die 87 %?, **Pflicht** (misstrauen × nichtwahl, `"col"`, `"all"`) |
| 3 Leserichtung: Gruppen vergleichen | UV/AV, Balken auf 100 %, Prozentpunkte (sex, teilzeit) | A3 Gehen Misstrauende nicht mehr wählen?, **Pflicht** (misstrauen × nichtwahl, `"row"`) |
| 4 Umpolen | Wirtschaftslage umdrehen (ep01) | A4 Gegenprobe mit einer umgedrehten Aussage, **Zusatz** (pe05 → `pe05_um` → `misstrauen_pe05`) |
| Überblick | Welche Basis für welche Frage (eastwest × misstrauen, nur Fragen), Voraussetzungen, Chi-Quadrat (Wiederholung) | – |

Variablen der Grundlagen (work, sex, ep01) kommen in keiner Aufgabe vor; die Aufgaben-Variablen (pe01, pv01, pe05) in keiner Grundlage. Aus dem Kapitel von Sitzung 4 wird keine Variable wiederverwendet außer `eastwest`, und zwar nur in einer Probier-Werkstatt (A2) und im Zuordnen des Überblicks.

**Zeit (Seminar, 45 Minuten):** A1 etwa 15, A2 etwa 12, A3 etwa 10 Minuten (zusammen 37); A4 als Zusatz etwa 12 Minuten. Grundlagen je 10 bis 15 Minuten zum Vor- und Nacharbeiten.

---

## 3. Vorweg: R lesen

Kopf wie Sitzung 4: Trennüberschrift „Vorweg: R lesen“, darunter die Sprungknöpfe (siehe oben). Drei Karten.

### R1 „Erinnerung: Startblock und `<-`“
Schilder: `R` / **Startblock und `<-`: kennst du aus Sitzung 1, Kette: kennst du aus Sitzung 4** (grau) / „Code lesen“

Text:
> Den Startblock kennst du aus Sitzung 1. Er lädt die Werkzeuge und legt den ALLBUS unter dem Namen `allbus` ab. In RStudio führst du ihn zu Beginn aus, in der Code-Werkstatt hier ist das schon erledigt.

Vorlage `start` (statisch, Knopf „Kopieren“):
```r
# Pakete laden und Daten einlesen
library(tidyverse)
library(mariposa)

allbus <- read_spss("ZA8831_v1-3-0.sav")
```

Text darunter:
> `<-` legt ein Ergebnis unter einem Namen ab. Ketten aus mehreren Schritten liest du wie in Sitzung 4 von oben nach unten, `%>%` sprichst du „und dann“. Heute kommt in der Kette ein neuer Schritt dazu: eine neue Variable bauen.

Keine weitere Erklärung (alles bekannt).

### R2 „Neu heute: eine neue Variable mit `mutate()` und `rec()`“
Schilder: `R` / „neu heute“ / „Code lesen“

Text vor der Werkstatt:
> Im ALLBUS steht bei `work`, ob jemand Vollzeit arbeitet (Code 1), Teilzeit (2), nebenher (3) oder nicht erwerbstätig ist (4). Für die Frage „Wer arbeitet Teilzeit?“ brauchst du nur zwei Gruppen. Dafür baust du eine neue Variable. Warum man das tut und was dabei zu entscheiden ist, steht in Grundlage 1. Hier geht es nur darum, den Code zu lesen.

**Code-Werkstatt** `r2_rec` (live; Titel „Vorlage: eine neue Variable bauen“; keine markierten Stellen):
```r
# Neue Variable teilzeit aus work bilden und gleich prüfen
allbus %>%
  mutate(
    teilzeit = rec(work, rules = "2:3=1 [Teilzeit]; 1=0 [Vollzeit]; else=NA")
  ) %>%
  frequency(teilzeit)
```
Ausgabe (zur Kontrolle für den Umsetzenden): Vollzeit 2193 (Valid % 65.23), Teilzeit 1169 (34.77), Total valid 3362, System 1884, Kopf `mean=0.35`.

**So liest du die Vorlage** (Bausteinreihe wie „So liest du eine Zeile“ in Sitzung 4, eine Kachel je Teil):

| Baustein | darunter klein |
|---|---|
| `allbus %>%` | nimm allbus, und dann |
| `mutate(` | füge eine Variable hinzu |
| `teilzeit =` | Name der neuen Variable |
| `rec(work,` | umkodieren: aus der Variable work |
| `rules = "…"` | nach diesen Regeln |
| `) %>%` | und dann |
| `frequency(teilzeit)` | zähle die neue Variable aus |

**Bild `s5-regel.svg`** („Eine Regel lesen“, Formel als Bausteine):
- Typ: Bausteinreihe in einer Zeile (bei 390 px umbrechen in drei Zeilen), Code-Bausteine in JetBrains Mono auf weißen Kacheln mit grauem Rand (CARDLINE), Bausteinfarben wie die Code-Färbung der Werkstatt: Zahlen lila, Text in `[ ]` orange, `;` und `=` braun.
- Obere Reihe (der ganze String, in drei Regelblöcke geteilt, zwischen den Blöcken je ein `;`):
  - Block 1: `2:3` `=` `1` `[Teilzeit]`
  - `;`
  - Block 2: `1` `=` `0` `[Vollzeit]`
  - `;`
  - Block 3: `else` `=` `NA`
- Unter Block 1 kleine Beschriftungen je Baustein: `2:3` „alte Codes: 2 bis 3“; `=` „werden zu“; `1` „neuer Code“; `[Teilzeit]` „Aufkleber (Wertelabel)“. Unter dem ganzen Block 1 in Grün: „Teilzeit und nebenher werden 1, Aufkleber Teilzeit“.
- Unter Block 2 in Grün: „Vollzeit wird 0, Aufkleber Vollzeit“.
- Unter Block 3 in Grün: „alles andere wird leer: nicht erwerbstätig, keine Angabe“. Neben NA ein leerer gestrichelter Stein.
- Unter jedem `;` klein: „nächste Regel“.
- Alternativtext/Textfassung: „Die Regel "2:3=1 [Teilzeit]; 1=0 [Vollzeit]; else=NA" in drei Teilen, getrennt durch Semikolons, die „nächste Regel“ bedeuten. Erster Teil: 2:3 sind die alten Codes 2 bis 3, das Gleichheitszeichen heißt „werden zu“, 1 ist der neue Code, Teilzeit in eckigen Klammern ist der Aufkleber; zusammen: Teilzeit und nebenher werden 1 mit dem Aufkleber Teilzeit. Zweiter Teil: Code 1 wird 0 mit dem Aufkleber Vollzeit. Dritter Teil: else=NA, alles andere wird leer, also nicht Erwerbstätige und alle ohne Angabe.“

**Bild `s5-rec.svg`** (Turm → neuer Turm, Bauplatte wächst):
- Oben links Turm `work` mit Typschild `<dbl+lbl>`, blaue Steine (#85B7EB) mit lila Aufklebern (#AFA9EC), zum Beispiel sechs Befragte von oben nach unten: 1 VOLLZEIT, GANZTAGS; 2 TEILZEIT; 4 NICHT ERWERBSTAETIG; 3 NEBENHER BERUFSTAE.; leerer gestrichelter Stein mit blassem Aufkleber KEINE ANGABE; 1 VOLLZEIT, GANZTAGS.
- Grüner Pfeil (#36A266) nach rechts, beschriftet `rec(work, rules = "2:3=1 [Teilzeit]; 1=0 [Vollzeit]; else=NA")` (bei 390 px zweizeilig).
- Rechts Turm `teilzeit` `<dbl+lbl>`: 0 Vollzeit; 1 Teilzeit; leerer gestrichelter Stein NA (orange umrandet, #FAC775, Notiz „else=NA“); 1 Teilzeit; leerer Stein NA; 0 Vollzeit.
- Unten eine Bauplatte-Leiste: links „allbus 5,246 × 579“, grüner Pfeil `mutate()`, rechts „allbus 5,246 × 580“, an deren rechtem Rand ein neuer Turm, beschriftet `teilzeit`, hervorgehoben.
- Bildunterschrift: „`rec()` liest jeden Stein von `work` und gibt nach der Regel einen neuen Stein zurück: aus 2 und 3 wird 1, aus 1 wird 0, alles andere wird leer. `mutate()` stellt den neuen Turm `teilzeit` zusätzlich auf die Bauplatte; `work` bleibt, wie es war. `%>%` reicht die größere Bauplatte gleich weiter an `frequency()`. R schreibt Tausender mit Komma: 5,246 heißt 5.246. *Die Steine sind ein Beispiel mit sechs Befragten; die Größe der Bauplatte stammt aus dem ALLBUS 2023.*“
- Alternativtext: „Links der Turm work vom Typ dbl+lbl mit sechs Steinen, zum Beispiel sechs Befragte: 1 VOLLZEIT, GANZTAGS; 2 TEILZEIT; 4 NICHT ERWERBSTAETIG; 3 NEBENHER BERUFSTAE.; ein leerer gestrichelter Stein mit dem Aufkleber KEINE ANGABE; 1 VOLLZEIT, GANZTAGS. Ein grüner Pfeil mit dem Code rec(work, rules = "2:3=1 [Teilzeit]; 1=0 [Vollzeit]; else=NA") führt zum Turm teilzeit: 0 Vollzeit; 1 Teilzeit; ein leerer Stein NA, orange umrandet mit der Notiz else=NA; 1 Teilzeit; ein leerer Stein NA; 0 Vollzeit. Darunter wird die Bauplatte allbus mit 5,246 × 579 durch einen grünen Pfeil mutate() zur Bauplatte mit 5,246 × 580; ihr neuer Turm ganz rechts heißt teilzeit.“

Kurz gesagt (Tipp-Kasten):
> **Kurz gesagt:** **Umkodieren** (auch **Rekodieren**) heißt: aus den Codes einer Variable nach festen Regeln neue Codes machen. `rec()` macht das, `mutate()` stellt das Ergebnis als **neue Variable** in den Datensatz, und `%>%` reicht ihn weiter, etwa an `frequency()` oder `crosstab()`. Die alte Variable bleibt unverändert.

Genauer erklärt (zugeklappt), Titel „Genauer erklärt: Regeln schreiben und prüfen“:
> Eine Regel hat immer die Form **alte Codes = neuer Code [Aufkleber]**. Mehrere alte Codes schreibst du von bis mit Doppelpunkt (`2:3`) oder einzeln mit Komma (`1,3`). Regeln trennt ein Semikolon `;`. `else` steht für alle Codes, die in keiner Regel vorkommen; `else=NA` macht sie leer. Fehlende Werte wie „keine Angabe“ bleiben mit `else=NA` leer. Vorsicht: `else=0` macht auch sie zu 0 (Grundlage 1, Kurz überlegen). Codes für fehlende Werte wie −8 kannst du in einer Regel nicht ansprechen: `rec()` sieht sie nur als leer, eine Regel wie `-8=2` ändert nichts.
>
> Die Codes findest du in der Ausgabe von `frequency()` in der Spalte **Value** (kennst du aus Sitzung 3). Links vom `=` stehen immer Codes, nie die Wörter.
>
> Nach jedem Umkodieren prüfst du mit `frequency()`, ob die Gruppen stimmen: Hier sind es 2.193 in Vollzeit und 1.169 in Teilzeit, zusammen 3.362. Leer sind 1.884: die 1.849 nicht Erwerbstätigen und 35 ohne gültige Angabe. Bei neuen Variablen fasst `frequency()` alle Leeren in der Zeile **System** zusammen.
>
> Hier auf der Seite beginnt jede Code-Werkstatt mit dem frisch geladenen `allbus`. Darum bildet jede Vorlage ihre neuen Variablen selbst, am Anfang ihrer Kette. In RStudio kannst du eine neue Variable auch einmal ablegen und dann in vielen Auswertungen nutzen: `allbus <- allbus %>% mutate(…)`. So ist das Skript zum Mitnehmen gebaut. Mehr dazu im R-Workshop, Kapitel 5.

Häufige Verwechslung:
> **Häufige Verwechslung:** `=` in einer Regel und `==` in `filter()`. In `rules` steht ein einfaches `=` („wird zu“). Das doppelte `==` aus Sitzung 2 fragt dagegen „ist gleich?“ und gehört in `filter()`.

### R3 „Neu heute: eine Kreuztabelle mit `crosstab()` lesen“
Schilder: `R` / „neu heute“ / „Code lesen“

Text:
> Eine **Kreuztabelle** zählt, wie oft jede Kombination zweier Variablen vorkommt. `crosstab()` aus mariposa nimmt zuerst die Variable für die Zeilen, dann die für die Spalten. Mit `percentages =` stellst du ein, welche Prozent darunter stehen. Was die Prozent bedeuten, ist Thema der Grundlagen 2 und 3.

**Code-Werkstatt** `r3_ct` (live; Titel „Vorlage: eine Kreuztabelle“; keine markierten Stellen). Text davor: „Die ersten Zeilen bilden `teilzeit` wie in der Vorlage darüber. Neu ist nur die letzte Zeile.“
```r
# Kreuztabelle: Geschlecht in den Zeilen, Teilzeit in den Spalten
# teilzeit bilden: wie in der Vorlage darüber
allbus %>%
  mutate(
    teilzeit = rec(work, rules = "2:3=1 [Teilzeit]; 1=0 [Vollzeit]; else=NA")
  ) %>%
  crosstab(sex, teilzeit, percentages = "row")
```

**Bild `s5-crosstab-ausgabe.svg`** (Ausgabe mit Beschriftungen):
- Typ: die Textausgabe von `r3_ct` in JetBrains Mono, hellgrauer Hintergrund wie die Werkstatt-Ausgabe; rechts daneben (bei 390 px darunter) sechs nummerierte Beschriftungen in Kreisen 1 bis 6, mit dünnen grauen Linien zu den Stellen in der Ausgabe.
- Gezeigte Ausgabe (gekürzt auf das Wesentliche, wörtlich aus R):
  ```
  Crosstabulation: GESCHLECHT, BEFRAGTE(R) x BEFRAGTE(R) BERUFSTAETIG? (recoded)
  - Row variable: sex
  - Column variable: teilzeit
  - Percentages: Row percentages
  - N (valid): 3359
  - Missing: 1887
  | GESCHLECHT, BEFRAGTE(R) | Vollzeit | Teilzeit |  Total |
  | MANN                    |     1379 |      301 |   1680 |
  |   row %                 |    82.1% |    17.9% | 100.0% |
  | FRAU                    |      805 |      860 |   1665 |
  |   row %                 |    48.3% |    51.7% | 100.0% |
  | DIVERS                  |        8 |        6 |     14 |
  |   row %                 |    57.1% |    42.9% | 100.0% |
  | Total                   |     2192 |     1167 |   3359 |
  |   row %                 |    65.3% |    34.7% | 100.0% |
  ```
- Beschriftungen: (1) bei `Row variable` / `Column variable`: „Zeilen: Geschlecht. Spalten: Teilzeit.“ (2) bei `Percentages: Row percentages`: „welche Prozent: hier Zeilenprozente“. (3) bei `N (valid)` und `Missing`: „3.359 stehen in der Tabelle, 1.887 fehlen bei mindestens einer der beiden Variablen“. (4) bei der Zelle FRAU/Teilzeit (orange umrandet): „obere Zahl: Anzahl (860), darunter Prozent (51,7 %)“. (5) bei der Spalte Total: „Zeilensumme“. (6) bei der Zeile Total: „Spaltensumme; unten rechts alle“.
- Bildunterschrift: „Jede Zelle hat zwei Zeilen: oben die Anzahl, darunter die Prozent, die du mit `percentages =` gewählt hast. Die Ränder (Total) sind die Summen. R schreibt Kommazahlen mit Punkt: 51.7% heißt 51,7 %.“
- Textfassung: „Ausgabe von crosstab(sex, teilzeit, percentages = "row"). Kopf: Zeilenvariable sex, Spaltenvariable teilzeit, Zeilenprozente, N (valid) 3359, Missing 1887. Männer: 1379 Vollzeit (82,1 %), 301 Teilzeit (17,9 %), zusammen 1680. Frauen: 805 Vollzeit (48,3 %), 860 Teilzeit (51,7 %), zusammen 1665. Divers: 8 Vollzeit (57,1 %), 6 Teilzeit (42,9 %), zusammen 14. Total: 2192 Vollzeit (65,3 %), 1167 Teilzeit (34,7 %), zusammen 3359. Beschriftet sind: die Zeilen- und Spaltenvariable, die Art der Prozent, N und Missing, die Zelle Frau/Teilzeit mit Anzahl oben und Prozent unten, und die Total-Spalte und -Zeile als Summen.“

Kurz gesagt:
> **Kurz gesagt:** Eine **Kreuztabelle** (auch **Kontingenztabelle**) zeigt zwei Variablen zugleich: Jede **Zelle** zählt die Befragten mit genau dieser Kombination. Die Summen am Rand heißen **Randhäufigkeiten**. `percentages = "row"`, `"col"` oder `"total"` wählt, worauf sich die Prozent beziehen, `"all"` zeigt alle drei.

Genauer erklärt, Titel „Genauer erklärt: Wer steht in der Tabelle?“:
> In einer Kreuztabelle stehen nur Befragte, die bei **beiden** Variablen eine gültige Angabe haben. Hier sind es 3.359. Bei `frequency(teilzeit)` waren es 1.169 in Teilzeit, in der Tabelle sind es 1.167: Zwei Teilzeitkräfte haben beim Geschlecht keine gültige Angabe und fallen heraus. Darum nennst du zu jeder Tabelle das N, das R unter `N (valid)` angibt.
>
> Lässt du `percentages` weg, zeigt `crosstab()` Zeilenprozente. Schreib es trotzdem hin, dann sieht jede, worauf sich die Prozent beziehen. Mehr dazu im R-Workshop, Kapitel 7.

Häufige Verwechslung:
> **Häufige Verwechslung:** Die Reihenfolge in `crosstab(sex, teilzeit)` ist nicht egal. Die erste Variable kommt in die Zeilen, die zweite in die Spalten. Tauschst du sie, tauschen auch Zeilen- und Spaltenprozente ihre Namen.

---

## 4. Thema 1: Gruppen bilden: Umkodieren

Trennüberschrift „Thema 1: Gruppen bilden: Umkodieren“ mit Stein 1.

### Grundlage 1 „Gruppen bilden: Umkodieren“
Kopf: Überzeile „Grundlage zu Aufgabe 1“, Titel, Link „Schon klar? Direkt zu Aufgabe 1 ↓“. Einleitung:
> Warum fasst man Antworten zu Gruppen zusammen, und was ändert sich dabei? Etwa 12 Minuten.

#### 1a „Gruppen zuschneiden“ (Schild „Ausprobieren“)
Text (Beispiel zuerst):
> Der ALLBUS 2023 fragt, ob jemand berufstätig ist. Die Antworten: Vollzeit, Teilzeit, nebenher oder nicht erwerbstätig. Für die Frage „Wie viele Erwerbstätige arbeiten Teilzeit?“ brauchst du zwei Gruppen: Teilzeit und Vollzeit. Wer kommt in welche Gruppe, und wer zählt gar nicht mit? Entscheide selbst für jede Zeile.

**Bedienelement „Gruppen zuschneiden“** (interaktiv; HTML, kein SVG):
- Tabelle mit fünf Zeilen, je links die Antwort und die Zahl der Befragten, rechts eine Gruppe aus drei Optionsfeldern (`radio`, gemeinsamer `name` je Zeile, Legende = Antwort):

  | Antwort (Code) | Befragte |
  |---|---|
  | Vollzeit, ganztags (1) | 2.193 |
  | Teilzeit (2) | 784 |
  | nebenher berufstätig (3) | 385 |
  | nicht erwerbstätig (4) | 1.849 |
  | ohne gültige Angabe (Datenfehler, keine Angabe) | 35 |

  Optionen je Zeile: „Gruppe 1: Teilzeit“, „Gruppe 0: Vollzeit“, „leer (NA): zählt nicht mit“. **Start: keine Option gewählt** (Zeile „offen“, nichts vorgeben).
- Ergebnis rechts (bei 390 px darunter), `aria-live="polite"`:
  - Eine kleine Liste mit vier Zeilen: „Gruppe 1 (Teilzeit): n1“, „Gruppe 0 (Vollzeit): n0“, „leer: nL“, „noch offen: nO“ (Zahlen mit Tausenderpunkt).
  - Ein Balken auf 100 % (nur Gruppe 1 und 0): Gruppe 1 orange (#FAC775, Rand #B86E0A), Gruppe 0 blau (#85B7EB, Rand #2C6CA8), mit Prozent im Segment.
  - Satz: „Anteil Teilzeit: x %, gerechnet als n1 geteilt durch (n1 + n0).“ Rundung auf eine Nachkommastelle, deutsches Komma.
  - „Deine Regel in Worten: Teilzeit (1): … Vollzeit (0): … leer: …“ (Antwortnamen in der Reihenfolge der Tabelle).
  - Solange eine Zeile offen ist: „Noch x Zeilen offen.“ Kein Anteil, solange Gruppe 1 oder Gruppe 0 leer ist.
- Rückmeldung, sobald alle fünf Zeilen eingeteilt sind (Texte genau so; Prozentwerte sind in `sitzung05-zahlen.R` geprüft):

  | Einteilung | Anteil | Rückmeldung |
  |---|---|---|
  | A: Teilzeit, nebenher → 1; Vollzeit → 0; nicht erwerbstätig, ohne Angabe → leer | 34,8 % | „34,8 % der Erwerbstätigen arbeiten Teilzeit oder nebenher. So ist auch die Regel in ‚R lesen‘ gebaut.“ |
  | B: Teilzeit → 1; Vollzeit → 0; nebenher, nicht erwerbstätig, ohne Angabe → leer | 26,3 % | „26,3 %: Wer nebenher arbeitet, zählt jetzt gar nicht mit. Die Zahl beantwortet eine engere Frage: Wie viele von denen, die Vollzeit oder Teilzeit arbeiten, arbeiten Teilzeit?“ |
  | C: Teilzeit → 1; Vollzeit, nebenher → 0; Rest leer | 23,3 % | „23,3 %: Nebenher Arbeitende zählen jetzt als Vollzeit. Passt das zu ihrer Antwort?“ |
  | D: wie A, aber nicht erwerbstätig → 0 | 22,4 % | „22,4 %: Nicht Erwerbstätige zählen als Vollzeit. Die Basis sind jetzt fast alle Befragten, nicht die Erwerbstätigen.“ |
  | E: wie A, aber nicht erwerbstätig und ohne Angabe → 0 | 22,3 % | „22,3 %: So rechnet R mit else=0. Dann zählt auch, wer gar nichts angegeben hat, als Vollzeit.“ |
  | F: Teilzeit, nebenher, nicht erwerbstätig → 1; Vollzeit → 0; ohne Angabe leer | 57,9 % | „57,9 %: Nicht Erwerbstätige zählen als Teilzeit. Die Gruppe heißt Teilzeit, misst aber etwas anderes.“ |
  | jede andere Einteilung | n1 / (n1 + n0) | „Deine Einteilung ergibt x %. Frag dich bei jeder Zeile: Passt die Antwort zum Namen der Gruppe?“ |
- Knopf „Zurücksetzen“ (alle Zeilen wieder offen; Fokus auf die erste Zeile).
- Textfassung: Die Tabelle selbst ist die Textfassung; der Balken hat `aria-hidden="true"`, sein Inhalt steht im Satz darüber.

Kurz gesagt:
> **Kurz gesagt:** **Umkodieren** heißt, Antworten nach festen Regeln zu neuen Gruppen zusammenzufassen. Eine Variable mit nur zwei Gruppen, 1 für „trifft zu“ und 0 für „trifft nicht zu“, heißt **Dummyvariable**. Wer in keine Gruppe passt, wird **leer (NA)** und zählt nicht mit. Jede dieser Entscheidungen verändert das Ergebnis.

Kurz überlegen (Zahl):
- Label: „In R steht ‚else=0‘ statt ‚else=NA‘: Alles, was nicht Teilzeit oder nebenher ist, kommt in Gruppe 0. Wie viel Prozent sind dann Teilzeit?“
- Hilfezeile: „Probier es oben aus: Auch ‚ohne gültige Angabe‘ kommt in Gruppe 0. Eine Kommazahl reicht, zum Beispiel 12,5.“
- Ziel 22,3; Toleranz ±0,05 (ganze Zahl ±0,55); 22,4 (Zuschnitt D, ohne Angabe leer) zählt nicht als richtig und hat eine eigene Rückmeldung.
- Richtig: „22,3 %. Mit else=0 zählen auch die 1.849 nicht Erwerbstätigen und die 35 ohne Angabe als Vollzeit. Die Zahl sieht harmlos aus, beantwortet aber eine andere Frage.“
- Falsch, Wert 34,8: „34,8 % sind es mit else=NA. Leg ‚nicht erwerbstätig‘ und ‚ohne gültige Angabe‘ in Gruppe 0.“
- Falsch, sonst: „Leg alle Zeilen außer Teilzeit und nebenher in Gruppe 0, auch ‚ohne gültige Angabe‘, und lies den Anteil ab.“

Genauer erklärt, Titel „Genauer erklärt: Dummyvariablen, und was beim Zusammenfassen verloren geht“:
> Eine **Dummyvariable** hat nur 0 und 1. Das hat einen praktischen Vorteil: Ihr **Mittelwert ist der Anteil der Einsen**. Bei Teilzeit (1) und Vollzeit (0) liegt der Mittelwert bei 0,35, und 34,77 % der Erwerbstätigen sind in Gruppe 1. Ein Mittelwert von 0,35 heißt also: 35 % sind 1.
>
> Zusammenfassen kostet Information. Nach dem Umkodieren weißt du nicht mehr, wer Teilzeit und wer nebenher arbeitet. Darum legst du immer eine **neue** Variable an und behältst die alte.
>
> Welche Gruppen sinnvoll sind, entscheidet die Frage, nicht die Statistik. Prüf bei jeder Antwort: Passt sie zum Namen der Gruppe? Und sag in deinem Bericht, wie du zusammengefasst hast.

Häufige Verwechslung:
> **Häufige Verwechslung:** „leer“ und „0“. Eine 0 ist eine Antwort („trifft nicht zu“) und zählt im Nenner mit. Leer (NA) heißt „gehört nicht dazu“ und fällt aus der Rechnung. Wer nicht erwerbstätig ist, arbeitet nicht Vollzeit, gehört aber gar nicht in die Frage nach Teilzeit unter Erwerbstätigen.

Link (wie Sitzung 4): „→ In der freien Karte: Rekodieren und Umpolen“ (Begriff `recode`).

---

### Aufgabe 1 „Zwei Gruppen für die Wahlfrage“ / **Pflicht**
Kopf: Stein A1, Schild „Pflicht“, Link „↑ Grundlage 1 nachlesen“.

Leitfrage:
> Wer misstraut den Politikern, und wer würde nicht wählen?

Ziel-Kasten:
> **Ziel:** Am Ende hast du zwei neue Variablen mit nur 0 und 1, `misstrauen` und `nichtwahl`, und kannst sagen, wie groß jede Gruppe ist und wer herausfällt.
> Grundlage: Grundlage 1, Gruppen bilden; Vorweg: eine neue Variable mit `mutate()` und `rec()`

Einleitung:
> Im ALLBUS 2023 sollten die Befragten sagen, ob sie dieser Aussage zustimmen: „Die Politiker kümmern sich nicht viel darum, was Leute wie ich denken.“ (`pe01`, von „stimme voll zu“ bis „stimme gar nicht zu“). Und sie wurden gefragt, welche Partei sie wählen würden, wenn am nächsten Sonntag Bundestagswahl wäre (`pv01`). Wer antwortet, er würde nicht wählen, hat den Code 91. Für eine Kreuztabelle brauchst du aus beiden Fragen je zwei Gruppen.
>
> Ob die Zustimmung zu dieser Aussage Misstrauen misst, ist eine Frage der **Gültigkeit** (kennst du aus Sitzung 1): Streng genommen fragt `pe01`, ob man sich von Politikern beachtet fühlt, nicht nach Vertrauen. Wir nennen die Gruppe hier kurz `misstrauen`. Wenn du über das Ergebnis berichtest, nennst du die genaue Aussage.

Graues Schild an der Einleitung: „`pv01` und seine fehlenden Werte: kennst du aus Sitzung 2 und 3“.

**Erst festlegen** (Optionsfelder, „Tipp abgeben“ sperrt; Rückmeldung „Festgelegt: … Die Auflösung bekommst du, wenn du am Ende der Aufgabe deine Antworten prüfst.“):
- Frage: „Was schätzt du: Wie viele der Befragten mit gültiger Antwort stimmen der Aussage ‚Die Politiker kümmern sich nicht viel darum, was Leute wie ich denken‘ zu, voll oder eher?“
- Optionen: „weniger als ein Drittel“ / „etwa die Hälfte“ / „mehr als zwei Drittel“
- Auflösung beim Prüfen (nach a1a): „Deine Festlegung vorher war: … Tatsächlich sind es 73,1 %, also mehr als zwei Drittel.“

**Schritte**
1. **Schau dir die Codes von `pe01` an.** Schild „frequency(): kennst du aus Sitzung 3“.
   Text: „Führe die Vorlage aus. In der Spalte Value steht der Code jeder Antwort, daneben ihr Wort. Unten fällt eine große Zahl auf: 1.596 Befragte bei ‚TNZ: SPLIT‘. Das heißt: Diese Frage stand nur in einem Teil der Fragebögen (Fragebogensplit). Diese Menschen haben also nicht verweigert, sie wurden nicht gefragt.“
   Werkstatt `a1_freq` (keine Markierung):
   ```r
   # Welche Codes hat pe01?
   allbus %>%
     frequency(pe01)
   ```
2. **Bilde die Gruppe `misstrauen` und prüfe sie.** Schild „neu heute“.
   Text: „Eine Regel liest du ‚aus diesen alten Codes wird dieser neue Code‘: `1=1` heißt, aus 1 wird 1; `2:4=0` heißt, aus 2 bis 4 wird 0. Die Vorlage zählt bisher nur ‚stimme voll zu‘ als Misstrauen. Wer zustimmt, ob voll oder eher, sagt aber, dass sich Politiker nicht kümmern. Passe die beiden markierten Stellen an: Welche Codes gehören zu ‚misstraut‘, welche zu ‚misstraut nicht‘? Die Codes stehen in Schritt 1 in der Spalte Value. Die Kette bildet die Variable und zählt sie gleich aus: Schau auf die Spalte N und auf die Kopfzeile mit `mean=`.“
   Werkstatt `a1_misstrauen` (markiert: Zeile 4 `1`, Zeile 4 `2:4`):
   ```r
   # Neue Variable misstrauen bilden und gleich prüfen
   allbus %>%
     mutate(
       misstrauen = rec(pe01, rules = "⟦1⟧=1 [misstraut]; ⟦2:4⟧=0 [misstraut nicht]; else=NA")
     ) %>%
     frequency(misstrauen)
   ```
   Lösung der markierten Stellen: `1:2` und `3:4`. Ausgabe gelöst: misstraut nicht 968 (26.90), misstraut 2630 (73.10), Total valid 3598, System 1648, Kopf `mean=0.73`. Mit Platzhalter: misstraut 1144, misstraut nicht 2454.
   **Bild `s5-mutate-a1.svg`** (zwei neue Türme; steht unter Schritt 3, weil es beide Variablen zeigt):
   - Links Bauplatte `allbus` mit zwei Türmen `pe01` und `pv01` (je `<dbl+lbl>`) und Auslassungspunkten, zum Beispiel fünf Befragte. pe01 von oben: 2 STIMME EHER ZU; 4 STIMME GAR NICHT ZU; leerer gestrichelter Stein mit blassem Aufkleber TNZ: SPLIT; 1 STIMME VOLL ZU; 3 STIMME EHER NICHT ZU. pv01: 91 WUERDE NICHT WAEHLEN; 2 SPD; leerer Stein NICHT WAHLBERECHTIGT; 4 DIE GRUENEN; 1 CDU-CSU.
   - Grüner Pfeil `mutate()` nach rechts zu derselben Bauplatte mit zwei neuen Türmen am rechten Rand:
     - `nichtwahl`: 1 würde nicht wählen; 0 würde wählen; leerer Stein NA (orange umrandet, Notiz „−50 steht in keiner Regel: else=NA“); 0 würde wählen; 0 würde wählen. Dünne graue Linien verbinden je Zeile pv01 und nichtwahl.
     - `misstrauen`: vier gestrichelte Steine mit einem Fragezeichen, beschriftet „deine Regel aus Schritt 2“; in der Split-Zeile (dritte Zeile) ein leerer Stein NA (Split bleibt leer).
   - Bildunterschrift: „`mutate()` stellt neue Türme neben die alten, in Schritt 2 `misstrauen`, in Schritt 3 `nichtwahl`. Bei `nichtwahl` wird aus 91 eine 1 und aus jeder Partei eine 0. Wer nicht wahlberechtigt ist (Code −50), steht in keiner Regel und wird mit `else=NA` leer. Wer im Split die Frage nicht bekam, bleibt auch bei `misstrauen` leer. Wie die übrigen Steine von `misstrauen` aussehen, entscheidet deine Regel. *Die Steine sind ein Beispiel mit fünf Befragten.*“
   - Alternativtext: „Links die Bauplatte allbus mit den Türmen pe01 und pv01, zum Beispiel fünf Befragte. pe01: 2 STIMME EHER ZU, 4 STIMME GAR NICHT ZU, ein leerer Stein mit dem Aufkleber TNZ: SPLIT, 1 STIMME VOLL ZU, 3 STIMME EHER NICHT ZU. pv01: 91 WUERDE NICHT WAEHLEN, 2 SPD, ein leerer Stein mit dem Aufkleber NICHT WAHLBERECHTIGT, 4 DIE GRUENEN, 1 CDU-CSU. Ein grüner Pfeil mutate() führt zur Bauplatte mit zwei neuen Türmen. nichtwahl: 1 würde nicht wählen, 0 würde wählen, ein leerer Stein NA, orange umrandet mit der Notiz minus 50 steht in keiner Regel, else gleich NA, dann 0 würde wählen und 0 würde wählen. misstrauen: vier gestrichelte Steine mit Fragezeichen, beschriftet deine Regel aus Schritt 2, und in der Split-Zeile ein leerer Stein NA.“
3. **Bilde die Gruppe `nichtwahl` und prüfe sie.**
   Text: „Diese Regel ist fertig: `91=1` heißt, aus 91 wird 1; `1:90=0` heißt, aus 1 bis 90 wird 0 (das sind alle Parteien); alles andere wird leer. Führe die Vorlage aus und schau, wie viele in jeder Gruppe sind und wie viele leer bleiben (Zeile System).“
   Werkstatt `a1_nichtwahl` (keine Markierung):
   ```r
   # Neue Variable nichtwahl bilden und gleich prüfen
   allbus %>%
     mutate(
       nichtwahl = rec(pv01, rules = "91=1 [würde nicht wählen]; 1:90=0 [würde wählen]; else=NA")
     ) %>%
     frequency(nichtwahl)
   ```
   Ausgabe: würde wählen 3748 (94.08), würde nicht wählen 236 (5.92), Total valid 3984, System 1262, Kopf `mean=0.06`.
   Das Bild `s5-mutate-a1.svg` (Bauanleitung bei Schritt 2 beschrieben) steht hier, unter Schritt 3.

**Probier-Werkstatt** (zugeklappt), Summary „Weiterdenken in der Probier-Werkstatt (für die Aufgabe nicht nötig)“:
> Für die Aufgabe reichen die Vorlagen oben. Hier ist Platz für eigene Fragen. Eine Idee: Bei `nichtwahl` fallen 1.262 Befragte heraus, darunter 603 mit „weiß nicht“ (kennst du aus Sitzung 3). Antworten die übrigen auf `pe01` anders als alle zusammen? Der Vorschlag behält nur, wer bei `nichtwahl` eine gültige Angabe hat (`drop_na()` kennst du aus Sitzung 4), und zählt dann `pe01` aus. Vergleiche die Spalte Valid % mit Schritt 1. Die Probier-Werkstatt startet mit diesem Vorschlag.
```r
# Eine Idee: pe01 nur bei denen, die bei der Wahlabsicht eine gültige Angabe haben
# nichtwahl bilden: wie in Schritt 3
allbus %>%
  mutate(
    nichtwahl = rec(pv01, rules = "91=1 [würde nicht wählen]; 1:90=0 [würde wählen]; else=NA")
  ) %>%
  drop_na(nichtwahl) %>%
  frequency(pe01)
```
(Ausgabe zur Kontrolle: Kopf `total N=3984 valid N=2785`; Valid % STIMME VOLL ZU 29.91, EHER ZU 40.32, EHER NICHT ZU 26.89, GAR NICHT ZU 2.87; in Schritt 1 waren es 31.80, 41.30, 24.12, 2.78. Wer keine gültige Wahlabsicht angibt, stimmt der Aussage also etwas häufiger zu. Solche Unterschiede bleiben in jeder Kreuztabelle mit `nichtwahl` unsichtbar, weil diese Menschen dort fehlen.)

**Antwortfragen** („Antworten prüfen“; Rückmeldung je Frage mit ✓/✗ und Text, am Ende „Deine Festlegung vorher war: …“):

| id | Art | Label | Optionen | Ziel | Toleranz | Text richtig | Text falsch / Hinweis | Hilfezeile |
|---|---|---|---|---|---|---|---|---|
| a1a | number | Wie viele Befragte zählen nach deiner Regel als „misstraut“? | – | 2630 | 0 | „2.630 Befragte, 73,1 % der gültigen Antworten: 1.144 stimmen voll zu, 1.486 eher.“ | 1144: „1.144 sind nur die mit ‚stimme voll zu‘. ‚Stimme eher zu‘ (Code 2) ist auch Zustimmung: Regel 1:2=1, dann 3:4=0.“<br>968: „968 ist die Gruppe ‚misstraut nicht‘. Gesucht ist die Zeile ‚misstraut‘.“<br>sonst: „Lies in frequency(misstrauen) die Spalte N in der Zeile ‚misstraut‘. Steht in deiner Regel 1:2=1 und 3:4=0?“ | „Aus Schritt 2, Spalte N.“ |
| a1b | number | Wie viele Befragte würden nicht wählen? | – | 236 | 0 | „236 Befragte sagen, sie würden nicht wählen, 3.748 würden wählen.“ | 3748: „3.748 würden wählen. Gesucht ist die Zeile ‚würde nicht wählen‘.“<br>sonst: „Lies in frequency(nichtwahl) die Spalte N in der Zeile ‚würde nicht wählen‘.“ | „Aus Schritt 3, Spalte N.“ |
| a1c | choice | Was ist in `nichtwahl` mit den 186 nicht Wahlberechtigten passiert? | „Sie zählen als ‚würde nicht wählen‘“ / „Sie zählen als ‚würde wählen‘“ / „Sie sind leer (NA) und zählen nicht mit“ | dritte | – | „Code −50 steht weder bei 91 noch bei 1:90, also greift else=NA. Sie stehen mit allen anderen fehlenden Angaben in der Zeile ‚System‘ (1.262).“ | „Schau in die Regel: Aus 91 wird 1, aus 1 bis 90 wird 0. Kommt −50 darin vor? Was macht else=NA mit allem anderen?“ | – |
| a1d | choice | Über der Tabelle von `misstrauen` steht `mean=0.73`. Was heißt das? | „73 % der gültigen Antworten sind 1, also ‚misstraut‘“ / „Die Befragten misstrauen im Schnitt mit 0,73 Punkten auf der Skala von 1 bis 4“ / „73 % der Antworten fehlen“ | erste | – | „Bei einer Dummyvariable ist der Mittelwert der Anteil der Einsen: 0,73 heißt 73 %, wie Valid % 73,10 in der Zeile ‚misstraut‘.“ | „Bei einer Variable mit nur 0 und 1 zählt jede 1 als eins, jede 0 als null. Der Mittelwert ist dann der Anteil der Einsen. Vergleiche mit Valid % in der Zeile ‚misstraut‘.“ | „Grundlage 1, Genauer erklärt.“ |

Hilfe:
- **Stufe 1, Denkanstoß:** „Eine Regel liest du ‚aus diesen alten Codes wird dieser neue Code‘. Zustimmung heißt hier: ‚stimme voll zu‘ und ‚stimme eher zu‘. Welche Codes haben diese beiden Antworten?“
- **Stufe 2, Wo schaue ich?:** „Die Codes von pe01 stehen in Schritt 1 in der Spalte Value. Von bis schreibt R mit Doppelpunkt: 1:2 heißt 1 bis 2. Die Größe der Gruppen steht in den Ausgaben von Schritt 2 und 3 in der Spalte N, der Mittelwert in der Kopfzeile darüber.“
- **Stufe 3, Lösung:** „In Schritt 2 heißt die Regel für misstrauen `"1:2=1 [misstraut]; 3:4=0 [misstraut nicht]; else=NA"`. Dann misstrauen 2.630 Befragte, 968 nicht; 236 würden nicht wählen, 3.748 wählen. Die 186 nicht Wahlberechtigten sind leer (NA). mean=0.73 heißt: 73 % misstrauen.“

**Ohne Grafik lösbar:** „Alle Antworten stehen in den Tabellen der Schritte 1 bis 3.“

---

## 5. Thema 2: Eine Zelle, drei Prozentbasen

### Grundlage 2 „Eine Zelle, drei Prozentbasen“
Kopf: „Grundlage zu Aufgabe 2“, Link „Schon klar? Direkt zu Aufgabe 2 ↓“. Einleitung:
> Dieselbe Zahl von Menschen kann 52 %, 74 % oder 26 % sein. Wovon hängt das ab? Etwa 15 Minuten.

#### 2a „Drei Fragen an eine Zelle“ (Schild „Im Bild“)
Text (Beispiel zuerst):
> 860 erwerbstätige Frauen im ALLBUS 2023 arbeiten Teilzeit oder nebenher. Ist das viel? Das hängt davon ab, womit du sie vergleichst: mit allen erwerbstätigen Frauen, mit allen Teilzeitkräften oder mit allen Erwerbstätigen. Jede dieser Gruppen kann die **Basis** sein, also die 100 %.
>
> Die Idee kennst du aus Sitzung 3: Dort ergab dieselbe Zahl von CDU/CSU-Wählenden mit drei Basen drei verschiedene Prozent (Raw %, Valid % und eine eigene Basis). In einer Kreuztabelle gibt es für jede Zelle wieder drei Basen.

Graues Schild an der Karte: „Basis, ein Zähler und verschiedene Nenner: kennst du aus Sitzung 3“.

**Bild `s5-drei-basen.svg`** (Tabelle mit hervorgehobenen Zellen, dreimal):
- Typ: drei gleich gebaute Kreuztabellen nebeneinander (bei 390 px untereinander), je Zeilen MANN, FRAU, DIVERS, Total und Spalten Vollzeit, Teilzeit, Total; in jeder Zelle oben die Anzahl (fett), darunter der Prozentwert der jeweiligen Basis (normal). Rahmen der Zellen CARDLINE, Schrift Nunito, Zahlen tabellarisch.
- Die Zelle FRAU/Teilzeit ist in allen drei Tabellen orange gefüllt (#FAC775) und dunkel umrandet.
- Gelbe Basis (#FFE7A3 Füllung, 3 px Rand #EFC867; Text dazu #7a5c0c):
  - Tabelle 1 „**Zeilenprozente:** jede Zeile ist 100 %“: drei gelbe Rahmen, je um eine ganze Zeile MANN, FRAU, DIVERS (mit Total-Spalte). Prozent je Zelle: MANN 82,1 / 17,9 / 100; FRAU 48,3 / **51,7** / 100; DIVERS 57,1 / 42,9 / 100; Total 65,3 / 34,7 / 100. Darunter: „Wie viele der Frauen arbeiten Teilzeit? **51,7 %**“
  - Tabelle 2 „**Spaltenprozente:** jede Spalte ist 100 %“: zwei gelbe Rahmen, je um eine ganze Spalte Vollzeit und Teilzeit (mit Total-Zeile). Prozent: MANN 62,9 / 25,8 / 50,0; FRAU 36,7 / **73,7** / 49,6; DIVERS 0,4 / 0,5 / 0,4; Total 100 / 100 / 100. Darunter: „Wie viele der Teilzeitkräfte sind Frauen? **73,7 %**“
  - Tabelle 3 „**Gesamtprozente:** alle zusammen sind 100 %“: ein gelber Rahmen um die ganze Tabelle. Prozent: MANN 41,1 / 9,0 / 50,0; FRAU 24,0 / **25,6** / 49,6; DIVERS 0,2 / 0,2 / 0,4; Total 65,3 / 34,7 / 100. Darunter: „Wie viele aller Erwerbstätigen sind Frauen in Teilzeit? **25,6 %**“
  - Anzahlen in allen drei Tabellen gleich: MANN 1.379 / 301 / 1.680; FRAU 805 / 860 / 1.665; DIVERS 8 / 6 / 14; Total 2.192 / 1.167 / 3.359.
- Bildunterschrift: „Dieselben 860 Frauen in Teilzeit, dreimal gerechnet. Gelb ist jeweils die Basis, also die 100 %. Die Anzahl in der Zelle bleibt gleich, nur der Nenner wechselt. *ALLBUS 2023, Erwerbstätige mit gültiger Angabe bei Geschlecht und Erwerbsform, n = 3.359, ungewichtet; Teilzeit heißt Teilzeit oder nebenher.*“
- Textfassung (als Tabelle unter dem Bild, Überschrift „Die drei Tabellen als Zahlen“, oder als `<details>`): eine Tabelle mit Spalten „Zeile“, „Spalte“, „Anzahl“, „Zeilenprozent“, „Spaltenprozent“, „Gesamtprozent“ und den sechs inneren Zellen plus Total-Zeile:

  | Zeile | Spalte | Anzahl | Zeilen-% | Spalten-% | Gesamt-% |
  |---|---|---|---|---|---|
  | Mann | Vollzeit | 1.379 | 82,1 | 62,9 | 41,1 |
  | Mann | Teilzeit | 301 | 17,9 | 25,8 | 9,0 |
  | Frau | Vollzeit | 805 | 48,3 | 36,7 | 24,0 |
  | Frau | Teilzeit | 860 | 51,7 | 73,7 | 25,6 |
  | Divers | Vollzeit | 8 | 57,1 | 0,4 | 0,2 |
  | Divers | Teilzeit | 6 | 42,9 | 0,5 | 0,2 |
  | Total | Vollzeit | 2.192 | 65,3 | 100 | 65,3 |
  | Total | Teilzeit | 1.167 | 34,7 | 100 | 34,7 |

**Formel als Bausteine** (wie „Anteil eines Werts“ in Sitzung 4, Grundlage 1b; HTML-Bausteine, nicht SVG), dreimal untereinander:
- Kopf: **Prozent** = Bruch „Anzahl in der Zelle“ über „Anzahl in der Basis“ × 100
- Zeile 1 (Basis gelb markiert „Zeile Frau“): 860 / 1.665 ≈ 51,7 %
- Zeile 2 („Spalte Teilzeit“): 860 / 1.167 ≈ 73,7 %
- Zeile 3 („alle“): 860 / 3.359 ≈ 25,6 %
- Unsichtbare Textfassung (`sr`): „Prozent gleich Anzahl in der Zelle geteilt durch Anzahl in der Basis, mal hundert. Zelle Frau und Teilzeit: 860. Basis Zeile Frau 1.665, ergibt 51,7 Prozent. Basis Spalte Teilzeit 1.167, ergibt 73,7 Prozent. Basis alle 3.359, ergibt 25,6 Prozent.“
- Satz darunter: „Der Zähler bleibt gleich. Nur der Nenner, die Basis, wechselt.“

**Bedienelement „Basis-Schalter“** (interaktiv; HTML-Tabelle):
- Oben eine Gruppe aus drei Umschaltknöpfen (`role="radiogroup"` bzw. Optionsfelder): „Zeilenprozente“, „Spaltenprozente“, „Gesamtprozente“. Start: Zeilenprozente.
- Darunter die Kreuztabelle (Zahlen wie oben); jede der sechs inneren Zellen ist ein Knopf (Tab-Reihenfolge zeilenweise, Pfeiltasten optional). Start: Zelle Frau/Teilzeit gewählt (orange).
- Jede Zelle zeigt Anzahl und den Prozentwert der gewählten Basis. Gelber Rahmen um die Basis der gewählten Zelle: Zeilenprozente → ihre Zeile; Spaltenprozente → ihre Spalte; Gesamtprozente → ganze Tabelle.
- Satz unter der Tabelle (`aria-live="polite"`), Vorlagen:
  - Zeilenprozente: „Von den {Zeilensumme} {Zeile-Dativ} arbeiten {Anzahl} {Spalte-Wort}: {Zeilen-%} %. Die Basis ist die Zeile {Zeile-Nominativ}.“
  - Spaltenprozente: „Von den {Spaltensumme} {Spalte-Dativ} sind {Anzahl} {Zeile-Prädikat}: {Spalten-%} %. Die Basis ist die Spalte {Spalte-Nominativ}.“
  - Gesamtprozente: „Von allen 3.359 Erwerbstätigen in der Tabelle sind {Anzahl} {Zeile-Prädikat} in {Spalte-Nominativ}: {Gesamt-%} %. Die Basis ist die ganze Tabelle.“
  - Wortformen: Mann → Dativ „Männern“, Prädikat „Männer“, Nominativ „Mann“; Frau → „Frauen“, „Frauen“, „Frau“; Divers → „Befragten mit der Angabe divers“, „Befragte mit der Angabe divers“, „divers“; Vollzeit → Spalte-Wort „Vollzeit“, Dativ „Vollzeitkräften“, Nominativ „Vollzeit“; Teilzeit → „Teilzeit oder nebenher“, „Teilzeitkräften“, „Teilzeit“.
  - Beispiel (Start): „Von den 1.665 Frauen arbeiten 860 Teilzeit oder nebenher: 51,7 %. Die Basis ist die Zeile Frau.“
  - Zusatz bei jeder Zelle der Zeile Divers, nur bei Zeilenprozenten: „Vorsicht: Die Basis sind nur 14 Menschen. Stünde eine Person in der anderen Spalte, läge der Wert gut 7 Prozentpunkte anders.“
- Textfassung: Der Satz und die Tabelle sind die Textfassung; die Zahlen aller Basen stehen in der Tabelle unter dem Bild.

Kurz gesagt:
> **Kurz gesagt:** Eine Prozentzahl in einer Kreuztabelle braucht immer eine **Basis**, den Nenner, also die Gruppe, die 100 % ist. **Zeilenprozente** nehmen jede Zeile als 100 %, **Spaltenprozente** jede Spalte, **Gesamtprozente** (auch **Zellenprozente**) die ganze Tabelle. Welche du nimmst, hängt von der Frage ab: „Wie viele der …?“ – die Gruppe nach „der“ ist die Basis.

Kurz überlegen (Zahl):
- Label: „Wie viel Prozent der Teilzeitkräfte sind Männer?“
- Hilfezeile: „Probier es im Basis-Schalter aus. Eine Kommazahl reicht.“
- Ziel 25,8; Toleranz ±0,1 (ganze Zahl ±0,55).
- Richtig: „25,8 %, ein Spaltenprozent: Die 1.167 Teilzeitkräfte sind 100 %, davon sind 301 Männer.“
- Falsch, 17,9: „17,9 % ist der Anteil der Männer, die Teilzeit arbeiten: ein Zeilenprozent. Gefragt ist ‚der Teilzeitkräfte‘: Die Spalte Teilzeit ist 100 %.“
- Falsch, 9,0 oder 9: „9,0 % ist ein Gesamtprozent: Männer in Teilzeit unter allen Erwerbstätigen. Gefragt ist ‚der Teilzeitkräfte‘.“
- Falsch, sonst: „Wer ist 100 %? ‚Der Teilzeitkräfte‘: die Spalte Teilzeit. Stell den Schalter auf Spaltenprozente und wähle die Zelle Mann/Teilzeit.“

Genauer erklärt, Titel „Genauer erklärt: Wo sich 100 % ergeben, und wer in der Tabelle fehlt“:
> Bei Zeilenprozenten ergibt jede **Zeile** zusammen 100 % (48,3 + 51,7). Bei Spaltenprozenten jede **Spalte** (36,7 + 62,9 + 0,4 = 100). Bei Gesamtprozenten nur alle Zellen zusammen. So erkennst du in jeder Tabelle, welche Basis gemeint ist, auch wenn es nicht dabeisteht: Such die 100 %.
>
> In der Tabelle stehen nur Menschen, die bei beiden Fragen eine gültige Angabe haben. Hier sind es 3.359 Erwerbstätige; nicht Erwerbstätige sind leer (Grundlage 1). Alle Zahlen sind ungewichtet. Gewichtet arbeiten 53,5 % der Frauen und 17,8 % der Männer Teilzeit. Warum man gewichtet, ist Thema in Sitzung 6.

Häufige Verwechslung:
> **Häufige Verwechslung:** Spaltenprozente lesen und eine Aussage über die Zeile machen. „73,7 % der Teilzeitkräfte sind Frauen“ heißt nicht „73,7 % der Frauen arbeiten Teilzeit“. Das sind 51,7 %. Wer die Basis wechselt, ohne es zu merken, verdreht die Aussage.

Link: „→ In der freien Karte: Kreuztabelle mit Zeilen-, Spalten- und Zellenprozenten“ (Begriff `crosstab`).

---

### Aufgabe 2 „Stimmt die 87 %?“ / **Pflicht**
Kopf: Stein A2, „Pflicht“, „↑ Grundlage 2 nachlesen“.

Leitfrage:
> Angenommen, du liest diesen Satz: „87 Prozent der Nichtwähler sagen, dass sich Politiker nicht darum kümmern, was Leute wie sie denken.“ Stimmt die Zahl, und worauf bezieht sie sich?

Ziel-Kasten:
> **Ziel:** Am Ende hast du die 87 % in R gefunden, kannst sagen, wer dabei 100 % ist, und weißt, welche Zahl derselben Zelle welche Frage beantwortet.
> Grundlage: Grundlage 2, Eine Zelle, drei Prozentbasen; Vorweg: Kreuztabelle lesen


**Erst festlegen** (Optionsfelder):
- Frage: „Wer ist bei ‚87 Prozent der Nichtwähler‘ die Basis, also 100 %?“
- Optionen: „alle Befragten“ / „die Nichtwählenden“ / „die Misstrauenden“

**Schritte**
1. **Finde die Prozentbasis, die 87 % ergibt.** Schild „neu heute“.
   Text: „Die ersten Zeilen der Vorlage bilden `misstrauen` und `nichtwahl` wie in Aufgabe 1. Du änderst nur die letzte Zeile. Die Vorlage zeigt Zeilenprozente (`"row"`). Probier auch `"col"` (Spaltenprozente) und `"total"` (Gesamtprozente). Schau jedes Mal auf dieselbe Zelle: Zeile ‚misstraut‘, Spalte ‚würde nicht wählen‘. Bei welcher Basis steht dort 87.0%?“
   Werkstatt `a2_ct` (markiert: Zeile 8 `row`):
   ```r
   # Kreuztabelle: Welche Prozentbasis ergibt die 87 %?
   # misstrauen und nichtwahl bilden: kennst du aus Aufgabe 1
   allbus %>%
     mutate(
       misstrauen = rec(pe01, rules = "1:2=1 [misstraut]; 3:4=0 [misstraut nicht]; else=NA"),
       nichtwahl  = rec(pv01, rules = "91=1 [würde nicht wählen]; 1:90=0 [würde wählen]; else=NA")
     ) %>%
     crosstab(misstrauen, nichtwahl, percentages = "⟦row⟧")
   ```
   Lösung: `col`. Ausgaben in der Zelle misstraut/würde nicht wählen: row 6.5%, col 87.0%, total 4.6%; Anzahl 127; N (valid) 2785, Missing 2461.
2. **Eine Zelle, drei Prozentbasen.**
   Text: „Mit `"all"` stehen in jeder Zelle drei Prozentzahlen untereinander: `row %`, `col %` und `total %`. Alle drei gehören zu denselben 127 Menschen. Ordne unten jeder Frage ihre Zahl zu.“
   Werkstatt `a2_all` (keine Markierung):
   ```r
   # Dieselbe Tabelle mit allen drei Prozentbasen
   # misstrauen und nichtwahl bilden: kennst du aus Aufgabe 1
   allbus %>%
     mutate(
       misstrauen = rec(pe01, rules = "1:2=1 [misstraut]; 3:4=0 [misstraut nicht]; else=NA"),
       nichtwahl  = rec(pv01, rules = "91=1 [würde nicht wählen]; 1:90=0 [würde wählen]; else=NA")
     ) %>%
     crosstab(misstrauen, nichtwahl, percentages = "all")
   ```
   Ausgabe (zur Kontrolle): misstraut nicht 810 / 19 / 829 (row 97.7 / 2.3; col 30.7 / 13.0 / 29.8; total 29.1 / 0.7 / 29.8); misstraut 1829 / 127 / 1956 (row 93.5 / 6.5; col 69.3 / 87.0 / 70.2; total 65.7 / 4.6 / 70.2); Total 2639 / 146 / 2785 (row 94.8 / 5.2).

**Probier-Werkstatt** (zugeklappt):
> Für die Aufgabe reichen die Vorlagen oben. Hier ist Platz für eigene Fragen. Eine Idee: Misstrauen Befragte im Osten häufiger als im Westen? Die Probier-Werkstatt startet mit einem Vorschlag.
```r
# Eine Idee: Misstrauen in West und Ost
# misstrauen bilden: kennst du aus Aufgabe 1
allbus %>%
  mutate(
    misstrauen = rec(pe01, rules = "1:2=1 [misstraut]; 3:4=0 [misstraut nicht]; else=NA")
  ) %>%
  crosstab(eastwest, misstrauen, percentages = "row")
```
(Kontrolle: West 70.6 % misstraut, Ost 78.3 %.)

**Antwortfragen:**

| id | Art | Label | Optionen | Ziel | Toleranz | Text richtig | Text falsch / Hinweis | Hilfezeile |
|---|---|---|---|---|---|---|---|---|
| a2a | choice | Bei welcher Einstellung steht in der Zelle „misstraut“ und „würde nicht wählen“ 87.0%? | `"row"` (Zeilenprozente) / `"col"` (Spaltenprozente) / `"total"` (Gesamtprozente) | col | – | „Mit `percentages = "col"` steht dort 87.0%, also 87,0 %: Spaltenprozente. Die Nichtwählenden sind 100 %.“ | row: „Bei "row" steht dort 6.5%: Anteil an den Misstrauenden. Probier "col".“<br>total: „Bei "total" steht dort 4.6%: Anteil an allen 2.785 in der Tabelle. Probier "col".“ | „Probier in Schritt 1 alle drei Einstellungen und schau immer auf dieselbe Zelle.“ |
| a2b | number | Wie viele Befragte stecken in dieser Zelle? | – | 127 | 0 | „127 Befragte misstrauen und würden nicht wählen.“ | 146: „146 sind alle Nichtwählenden in der Tabelle (Zeile Total). Gesucht ist die Zelle selbst.“<br>1956: „1.956 sind alle Misstrauenden (Spalte Total). Gesucht ist die Zelle selbst.“<br>sonst: „Die obere Zahl in der Zelle ist die Anzahl.“ | „Die obere Zahl in der Zelle.“ |
| a2c | number | Wie viele Nichtwählende stehen in der Tabelle? Sie sind bei den 87 % die 100 %. | – | 146 | 0 | „146: 127 Misstrauende und 19 übrige. 127 von 146 sind 87,0 %.“ | 236: „236 würden insgesamt nicht wählen. In der Tabelle stehen nur die, die auch pe01 beantwortet haben; pe01 stand nur in einem Teil der Fragebögen. Lies die Zeile Total.“<br>2785: „2.785 sind alle in der Tabelle. Gesucht ist die Summe der Spalte ‚würde nicht wählen‘.“<br>sonst: „Lies in der Zeile Total die Spalte ‚würde nicht wählen‘.“ | „Zeile Total.“ |
| a2d | choice ×3 (Zuordnen, je ein Auswahlfeld) | Welche Zahl derselben Zelle beantwortet welche Frage? (1) Wie viele der Misstrauenden würden nicht wählen? (2) Wie viele der Nichtwählenden misstrauen? (3) Wie viele aller Befragten in der Tabelle misstrauen und würden nicht wählen? | je „6,5 %“ / „87,0 %“ / „4,6 %“ | (1) 6,5 %, (2) 87,0 %, (3) 4,6 % | – | (1) „Zeilenprozent: Die 1.956 Misstrauenden sind 100 %.“ (2) „Spaltenprozent: Die 146 Nichtwählenden sind 100 %.“ (3) „Gesamtprozent: Alle 2.785 sind 100 %.“ | je: „Such die Gruppe nach ‚der‘: Sie ist die Basis. Misstrauende = Zeile, Nichtwählende = Spalte, alle = ganze Tabelle.“ | „Aus Schritt 2: row %, col %, total %.“ |
| a2e | choice | Stimmt die Zahl aus dem Satz? | „Ja: 87,0 % der Nichtwählenden misstrauen den Politikern.“ / „Nein, R zeigt 6,5 %.“ / „Nein, die Zahl stimmt nur gewichtet.“ | erste | – | „Die Zahl stimmt, als Spaltenprozent. Ob sie die Behauptung ‚Wer misstraut, geht nicht wählen‘ trägt, prüfst du in Aufgabe 3.“ | „6,5 % ist eine andere Zahl derselben Zelle, mit einer anderen Basis. Beide stimmen; sie beantworten verschiedene Fragen. Gewichtet ändert sich wenig (86,6 %).“ | – |

**Nach dem Prüfen (wenn a2a bis a2d richtig), aufgedeckt: Bild `s5-nenner.svg`** („Dieselben 127 Menschen, drei Nenner“):
- Typ: drei waagrechte Balken untereinander, Länge proportional zum Nenner (2.785 = volle Breite). Balken hellgrau (#E4E1D8) mit dunkelgrauem Rand; am linken Ende in jedem Balken dasselbe orange Segment (#FAC775) für 127 Menschen, gleich lang in allen drei.
  - Balken 1 (Länge 146/2.785): „Nichtwählende: 146“ → rechts „127 von 146 = 87,0 % (col %)“
  - Balken 2 (Länge 1.956/2.785): „Misstrauende: 1.956“ → „127 von 1.956 = 6,5 % (row %)“
  - Balken 3 (volle Länge): „alle in der Tabelle: 2.785“ → „127 von 2.785 = 4,6 % (total %)“
- Bildunterschrift: „Das orange Stück ist immer gleich: 127 Menschen, die misstrauen und nicht wählen würden. Wie groß es wirkt, hängt am Balken, in den du es legst. *ALLBUS 2023, n = 2.785, ungewichtet.*“
- Alternativtext: „Drei waagrechte Balken, so lang wie ihr Nenner. Oben ein kurzer Balken, die 146 Nichtwählenden; das orange Stück von 127 Menschen füllt ihn fast ganz: 87,0 Prozent, Spaltenprozent. In der Mitte ein langer Balken, die 1.956 Misstrauenden; dasselbe orange Stück ist ein kleiner Teil: 6,5 Prozent, Zeilenprozent. Unten der längste Balken, alle 2.785 in der Tabelle: 4,6 Prozent, Gesamtprozent.“

Hilfe:
- **Stufe 1:** „Bei ‚87 Prozent der Nichtwähler‘ sind die Nichtwählenden 100 %. In der Tabelle sind sie eine Spalte.“
- **Stufe 2:** „Stell in Schritt 1 `percentages = "col"` ein und lies die Zelle Zeile ‚misstraut‘, Spalte ‚würde nicht wählen‘: oben die Anzahl, darunter das Prozent. In Schritt 2 stehen row %, col % und total % derselben Zelle untereinander.“
- **Stufe 3:** „Mit `"col"`: 87,0 %, 127 Befragte, Basis 146 Nichtwählende. Zuordnung: Misstrauende → 6,5 % (row), Nichtwählende → 87,0 % (col), alle → 4,6 % (total). Die Zahl stimmt.“

**Ohne Grafik lösbar:** „Alle Zahlen stehen in der Ausgabe von Schritt 2.“

---

## 6. Thema 3: Leserichtung: Gruppen vergleichen

### Grundlage 3 „Leserichtung: Gruppen vergleichen“
Kopf: „Grundlage zu Aufgabe 3“, Link „Schon klar? Direkt zu Aufgabe 3 ↓“. Einleitung:
> Welche der drei Prozentbasen beantwortet eine Frage nach einem Unterschied, und wie beschreibst du ihn? Etwa 12 Minuten.

#### 3a „Innerhalb der Gruppen prozentuieren, zwischen den Gruppen vergleichen“ (Schilder „Wiederholung: AV und UV“ grau, „Im Bild“)
Text (Beispiel zuerst):
> Arbeiten Frauen häufiger Teilzeit als Männer? Um das zu beantworten, vergleichst du Frauen mit Männern. Damit der Vergleich fair ist, muss jede Gruppe für sich 100 % sein. Sonst hinge das Ergebnis auch davon ab, wie viele Frauen und Männer überhaupt in der Tabelle stehen.
>
> Aus der Vorlesung kennst du die **unabhängige Variable (UV)**, die mögliche Ursache, hier das Geschlecht, und die **abhängige Variable (AV)**, das, was erklärt werden soll, hier die Erwerbsform. Die Faustregel: **Jede Gruppe der UV ist 100 %. Dann vergleichst du die Gruppen miteinander.**

**Bild `s5-leserichtung.svg`** (Balken auf 100 %; bekannte Form aus Sitzung 4):
- Typ: drei waagrechte Balken auf 100 % untereinander, links beschriftet mit der Gruppe und ihrem n: „Mann (n = 1.680)“, „Frau (n = 1.665)“, „divers (n = 14)“. Segmente: Vollzeit blau (#85B7EB, Rand #2C6CA8) links, Teilzeit orange (#FAC775, Rand #B86E0A) rechts, Prozent im Segment.
  - Mann: Vollzeit 82,1 % | Teilzeit 17,9 %
  - Frau: Vollzeit 48,3 % | Teilzeit 51,7 %
  - divers: Vollzeit 57,1 % | Teilzeit 42,9 %; dieser Balken blass (50 % Deckkraft) mit gestricheltem Rand und Notiz rechts „nur 14 Menschen: Prozent schwanken stark“.
- Über den Balken links Pfeil nach rechts, beschriftet „jede Gruppe der UV = 100 %“. Rechts eine senkrechte grüne Klammer (#36A266) zwischen den Teilzeit-Segmenten von Mann und Frau, beschriftet „vergleichen: 51,7 − 17,9 = 33,8 Prozentpunkte“.
- Achse unten 0 bis 100 %, Legende „Vollzeit“ / „Teilzeit oder nebenher“.
- Bildunterschrift: „Jede Zeile ist eine Gruppe der UV und für sich 100 %. Verglichen wird von oben nach unten: Frauen arbeiten 33,8 Prozentpunkte häufiger Teilzeit als Männer. *ALLBUS 2023, Erwerbstätige, n = 3.359, ungewichtet. In R sind das die Zeilenprozente aus ‚R lesen‘.*“
- Textfassung: „Drei Balken auf 100 Prozent. Männer, 1.680 Personen: 82,1 Prozent Vollzeit, 17,9 Prozent Teilzeit. Frauen, 1.665 Personen: 48,3 Prozent Vollzeit, 51,7 Prozent Teilzeit. Divers, 14 Personen, blass gezeichnet mit dem Hinweis, dass Prozent bei so wenigen Menschen stark schwanken: 57,1 Prozent Vollzeit, 42,9 Prozent Teilzeit. Eine grüne Klammer zwischen den Teilzeit-Anteilen von Männern und Frauen: 51,7 minus 17,9 gleich 33,8 Prozentpunkte.“

**Formel als Bausteine** „Prozentpunkte oder Prozent?“ (HTML-Bausteine):
- Zeile 1: **Abstand** = 51,7 % − 17,9 % = **33,8 Prozentpunkte** (Beschriftung: „abziehen: um wie viel höher?“)
- Zeile 2: **Verhältnis** = 51,7 ÷ 17,9 ≈ **2,9** (Beschriftung: „teilen: wievielmal so häufig?“)
- Satz darunter: „Beides ist richtig, aber nicht dasselbe. ‚33,8 Prozentpunkte mehr‘ und ‚fast dreimal so häufig‘ beschreiben denselben Unterschied. ‚33,8 Prozent mehr‘ wäre falsch.“
- `sr`-Textfassung: „Abstand: 51,7 Prozent minus 17,9 Prozent gleich 33,8 Prozentpunkte. Verhältnis: 51,7 geteilt durch 17,9 ungefähr 2,9, also fast dreimal so häufig.“

Kurz gesagt:
> **Kurz gesagt:** Für einen Vergleich setzt du **jede Gruppe der UV auf 100 %** und vergleichst dann die Anteile der AV zwischen den Gruppen. Steht die UV in den Zeilen, sind das die Zeilenprozente. Den Abstand zweier Anteile gibst du in **Prozentpunkten** an.

Kurz überlegen 1 (Zahl):
- Label: „Um wie viele Prozentpunkte liegt der Teilzeitanteil der Frauen über dem der Männer?“
- Hilfezeile: „Die Zahlen stehen im Bild. Prozentpunkte: abziehen.“
- Ziel 33,8; Toleranz ±0,1 (ganze Zahl ±0,55).
- Richtig: „33,8 Prozentpunkte: 51,7 minus 17,9.“
- Falsch, 2,9: „2,9 ist das Verhältnis: Frauen arbeiten fast dreimal so häufig Teilzeit. Gefragt ist der Abstand: abziehen.“
- Falsch, sonst: „Nimm die beiden Teilzeit-Anteile, 51,7 und 17,9, und zieh den kleineren vom größeren ab.“

Kurz überlegen 2 (Auswahl):
- Legende: „Eine Schlagzeile: ‚Teilzeit ist Frauensache: 74 % der Teilzeitkräfte sind Frauen.‘ Welche Frage beantwortet die 74 %?“
- Optionen: „Wie viele der Frauen arbeiten Teilzeit?“ / „Wie viele der Teilzeitkräfte sind Frauen?“ / „Arbeiten Frauen häufiger Teilzeit als Männer?“
- Ziel: zweite.
- Richtig: „Ein Spaltenprozent: Die Teilzeitkräfte sind 100 %. Für den Vergleich von Frauen und Männern brauchst du die Zeilenprozente: 51,7 % gegenüber 17,9 %.“
- Falsch (erste): „Das wären die Zeilenprozente, 51,7 %. Die 74 % haben eine andere Basis: ‚der Teilzeitkräfte‘.“
- Falsch (dritte): „Für einen Vergleich muss jede Gruppe der UV 100 % sein. Bei den 74 % sind die Teilzeitkräfte 100 %, nicht Frauen und Männer je für sich.“

Genauer erklärt, Titel „Genauer erklärt: Tauschprobe, kleine Gruppen und Ursachen“:
> **Tauschprobe:** Schreibst du in R die Variablen andersherum, `crosstab(teilzeit, sex, percentages = "col")`, steht das Geschlecht in den Spalten. Jetzt sind die Spaltenprozente die richtigen, und dort steht wieder 51,7 % für Frauen in Teilzeit. Ob „row“ oder „col“ passt, hängt also davon ab, wo die UV steht. Entscheidend ist nur: Wer ist 100 %?
>
> **Kleine Gruppen:** 42,9 % klingt genau, sind aber 6 von 14 Menschen. Arbeitete eine dieser Personen Teilzeit statt Vollzeit, wären es 50 %. Nenne deshalb zu jeder Gruppe ihr n und deute kleine Gruppen vorsichtig.
>
> **Zusammenhang ist nicht Ursache:** Die Tabelle zeigt, dass Frauen häufiger Teilzeit arbeiten. Warum, zeigt sie nicht; dafür bräuchte man weitere Variablen, etwa Kinder im Haushalt. Bei Einstellungen ist oft sogar unklar, was die UV ist: Was zuerst kommt, ist dann eine Annahme, die du begründen musst.

Häufige Verwechslung:
> **Häufige Verwechslung:** Prozent und Prozentpunkte. Steigt ein Anteil von 20 % auf 30 %, sind das 10 Prozentpunkte mehr, aber 50 Prozent mehr (die 10 sind die Hälfte von 20). In Berichten über Anteile nennst du den Abstand in Prozentpunkten.

---

### Aufgabe 3 „Gehen Misstrauende nicht mehr wählen?“ / **Pflicht**
Kopf: Stein A3, „Pflicht“, „↑ Grundlage 3 nachlesen“.

Leitfrage:
> Gehen Misstrauende nicht mehr wählen?

Ziel-Kasten:
> **Ziel:** Am Ende kannst du mit der passenden Prozentbasis sagen, ob Misstrauende häufiger nicht wählen wollen als die übrigen, um wie viele Prozentpunkte, und was die Tabelle nicht zeigt.
> Grundlage: Grundlage 3, Leserichtung


Einleitung:
> In Aufgabe 2 hast du gesehen: Die 87 % stimmen, aber ihre Basis sind die Nichtwählenden. Die Leitfrage fragt etwas anderes: Ob Misstrauen mit Nichtwahl zusammenhängt, siehst du nur, wenn du Misstrauende mit den übrigen vergleichst.

**Erst festlegen** (Optionsfelder):
- Frage: „Welche Gruppen musst du vergleichen, um die Leitfrage zu beantworten?“
- Optionen: „Misstrauende mit übrigen: Wie viele von ihnen würden nicht wählen?“ / „Nichtwählende mit Wählenden: Wie viele von ihnen misstrauen?“

**Schritte**
1. **Stell die Prozentbasis ein.**
   Text: „Die ersten Zeilen bilden wieder `misstrauen` und `nichtwahl` wie in Aufgabe 1. Die Vorlage nutzt noch die Spaltenprozente aus Aufgabe 2. `misstrauen` ist hier die mögliche Ursache (UV) und steht in den Zeilen. Stell die markierte Stelle so ein, dass jede Gruppe von `misstrauen` 100 % ist.“
   Werkstatt `a3_ct` (markiert: Zeile 8 `col`):
   ```r
   # Misstrauende und übrige vergleichen
   # misstrauen und nichtwahl bilden: kennst du aus Aufgabe 1
   allbus %>%
     mutate(
       misstrauen = rec(pe01, rules = "1:2=1 [misstraut]; 3:4=0 [misstraut nicht]; else=NA"),
       nichtwahl  = rec(pv01, rules = "91=1 [würde nicht wählen]; 1:90=0 [würde wählen]; else=NA")
     ) %>%
     crosstab(misstrauen, nichtwahl, percentages = "⟦col⟧")
   ```
   Lösung: `row`. Ausgabe: misstraut nicht 97.7% / 2.3%; misstraut 93.5% / 6.5%; Total 94.8% / 5.2%.
2. **Vergleiche und deute.**
   Text: „Lies in der Spalte ‚würde nicht wählen‘ beide Gruppen ab und zieh ab: Das ist der Abstand in Prozentpunkten. Schau auch in die Spalte ‚würde wählen‘: Wie viele der Misstrauenden wollen wählen?“

**Probier-Werkstatt** (zugeklappt):
> Für die Aufgabe reichen die Vorlagen oben. Hier ist Platz für eigene Fragen. Eine Idee: Wie sieht die Tabelle als Bild aus? Balken auf 100 % zeigen genau die Zeilenprozente. `drop_na()`, `to_label()` und `position = "fill"` kennst du aus Sitzung 4. Die Probier-Werkstatt startet mit einem Vorschlag.
```r
# Eine Idee: die Zeilenprozente als Balken auf 100 %
# misstrauen und nichtwahl bilden: kennst du aus Aufgabe 1
allbus %>%
  mutate(
    misstrauen = rec(pe01, rules = "1:2=1 [misstraut]; 3:4=0 [misstraut nicht]; else=NA"),
    nichtwahl  = rec(pv01, rules = "91=1 [würde nicht wählen]; 1:90=0 [würde wählen]; else=NA")
  ) %>%
  drop_na(misstrauen, nichtwahl) %>%
  to_label(misstrauen, nichtwahl) %>%
  ggplot(aes(x = misstrauen, fill = nichtwahl)) +
  geom_bar(position = "fill")
```
(Kontrolle: zwei Säulen auf Höhe 1, „misstraut nicht“ und „misstraut“, oben je ein schmales Stück „würde nicht wählen“, 2.785 Befragte.)

**Antwortfragen:**

| id | Art | Label | Optionen | Ziel | Toleranz | Text richtig | Text falsch / Hinweis | Hilfezeile |
|---|---|---|---|---|---|---|---|---|
| a3a | choice | Welche Prozentbasis hast du eingestellt? | `"row"` (Zeilenprozente) / `"col"` (Spaltenprozente) / `"total"` (Gesamtprozente) | row | – | „Zeilenprozente: misstrauen steht in den Zeilen, also ist jede Gruppe 100 %. Jetzt vergleichst du Misstrauende mit übrigen.“ | col: „Bei "col" sind die Nichtwählenden 100 %; das war die Frage aus Aufgabe 2.“<br>total: „Bei "total" ist die ganze Tabelle 100 %; dann kannst du die Gruppen nicht vergleichen.“ | – |
| a3b | number | Wie viel Prozent der Misstrauenden würden nicht wählen? | – | 6,5 | ±0,1 (ganze Zahl ±0,55) | „6,5 %: 127 von 1.956 Misstrauenden.“ | 87: „87,0 % sind Spaltenprozente. Stell "row" ein.“<br>93,5: „93,5 % würden wählen. Gesucht ist die Spalte ‚würde nicht wählen‘.“<br>sonst: „Zeile ‚misstraut‘, Spalte ‚würde nicht wählen‘, mit "row".“ | „Aus Schritt 1, Zeile ‚misstraut‘.“ |
| a3c | number | Und wie viel Prozent der übrigen (Zeile „misstraut nicht“)? | – | 2,3 | ±0,1 (ganze Zahl ±0,55) | „2,3 %: 19 von 829.“ | 13,0: „13,0 % sind Spaltenprozente. Stell "row" ein.“<br>97,7: „97,7 % würden wählen. Gesucht ist ‚würde nicht wählen‘.“<br>sonst: „Zeile ‚misstraut nicht‘, Spalte ‚würde nicht wählen‘.“ | „Aus Schritt 1, Zeile ‚misstraut nicht‘.“ |
| a3d | number | Um wie viele Prozentpunkte unterscheiden sich die beiden Gruppen? | – | 4,2 | ±0,1 (ganze Zahl ±0,55) | „4,2 Prozentpunkte: 6,5 minus 2,3. Misstrauende wollen fast dreimal so häufig nicht wählen, auf niedrigem Niveau.“ | 2,8: „2,8 ist das Verhältnis (6,5 geteilt durch 2,3). Gefragt ist der Abstand: abziehen.“<br>sonst: „Zieh die beiden Prozentzahlen voneinander ab.“ | „Prozentpunkte: abziehen.“ |
| a3e | choice | Welcher Satz passt zu deiner Tabelle? | „Wer Politikern misstraut, geht gar nicht mehr wählen.“ / „Misstrauende wollen etwas häufiger nicht wählen als die übrigen, 6,5 % gegenüber 2,3 %. Aber auch von ihnen wollen 93,5 % wählen.“ / „Misstrauen und Wahlabsicht haben nichts miteinander zu tun.“ | zweite | – | „Genau: Es gibt einen Zusammenhang, aber ‚gar nicht mehr‘ trägt er nicht. Die große Mehrheit der Misstrauenden will wählen.“ | erste: „Dann müssten fast alle Misstrauenden ‚würde nicht wählen‘ sagen. Es sind 6,5 %.“<br>dritte: „Die Anteile unterscheiden sich: 6,5 % gegenüber 2,3 %. Ein Zusammenhang ist da, nur ein kleiner.“ | – |
| a3f | choice | Zeigt die Tabelle, dass Misstrauen Menschen vom Wählen abhält? | „Ja, die Prozentzahlen beweisen es.“ / „Nein: Sie zeigt einen Zusammenhang. Ob Misstrauen die Ursache ist, ob es umgekehrt wirkt oder ob etwas Drittes beides beeinflusst, etwa politisches Interesse, zeigt sie nicht.“ / „Nein, weil 6,5 % zu wenig sind.“ | zweite | – | „Eine Kreuztabelle zeigt, was zusammen vorkommt, nicht warum. Die Richtung ist hier eine Annahme.“ | erste: „Prozent zeigen, was zusammen vorkommt. Eine Ursache bräuchte mehr: zeitliche Abfolge und den Ausschluss anderer Erklärungen.“<br>dritte: „Auch ein kleiner Unterschied ist ein Zusammenhang. Der Punkt ist ein anderer: Die Tabelle zeigt nicht, was Ursache ist.“ | „Grundlage 3, Genauer erklärt.“ |

**Fürs Plenum** (Kasten):
> Euer Faktencheck in zwei Sätzen: Was stimmt an „87 Prozent der Nichtwähler …“, und beantwortet die Zahl die Frage, ob Misstrauende nicht mehr wählen gehen? Nennt beide Zahlen mit ihrer Basis.

Hilfe:
- **Stufe 1:** „Die Leitfrage fragt nach den Misstrauenden: Wie viele von ihnen würden nicht wählen? Dann sind die Misstrauenden 100 %. Zum Vergleich brauchst du dieselbe Zahl für die übrigen.“
- **Stufe 2:** „Stell `percentages = "row"` ein, weil misstrauen in den Zeilen steht. Lies in der Spalte ‚würde nicht wählen‘ beide Zeilen ab. Prozentpunkte: die beiden Zahlen abziehen.“
- **Stufe 3:** „Mit `"row"`: Misstrauende 6,5 % (127 von 1.956), übrige 2,3 % (19 von 829), Abstand 4,2 Prozentpunkte. 93,5 % der Misstrauenden würden wählen. Ein Zusammenhang ja, ‚gar nicht mehr‘ nein. Die Tabelle zeigt keine Ursache.“

**Ohne Grafik lösbar:** „Die Tabelle aus Schritt 1 enthält alle Zahlen.“

---

## 7. Thema 4: Umpolen

### Grundlage 4 „Umpolen: eine Skala umdrehen“
Kopf: „Grundlage zu Aufgabe 4“, Link „Schon klar? Direkt zu Aufgabe 4 ↓“. Einleitung:
> Was tun, wenn bei einer Frage die kleine Zahl das Gute heißt? Etwa 10 Minuten.

#### 4a „Wenn 1 sehr gut heißt“ (Schilder „Im Bild“)
Text (Beispiel zuerst):
> Der ALLBUS fragt, wie man die wirtschaftliche Lage in Deutschland heute beurteilt. Gespeichert ist: 1 = sehr gut, 2 = gut, 3 = teils/teils, 4 = schlecht, 5 = sehr schlecht. Eine höhere Zahl heißt also: schlechter. Wer sagen will „je höher, desto besser“, dreht die Skala um. Das heißt **umpolen**.

**Bild `s5-umpolen.svg`** (Achse/Turm → Turm, Aufkleber wandern mit):
- Links ein Turm „ep01 vorher“ mit fünf Steinen von unten nach oben: 1 SEHR GUT (95), 2 GUT (1.338), 3 TEILS/TEILS (2.684), 4 SCHLECHT (919), 5 SEHR SCHLECHT (158); Code im blauen Stein, Aufkleber lila daneben, Anzahl klein grau.
- Rechts ein Turm „nach dem Umpolen“: 1 SEHR SCHLECHT (158), 2 SCHLECHT (919), 3 TEILS/TEILS (2.684), 4 GUT (1.338), 5 SEHR GUT (95).
- Grüne Pfeile verbinden gleiche Aufkleber (SEHR GUT links unten → rechts oben usw.), TEILS/TEILS geradeaus.
- Darunter Formel als Bausteine: „**neuer Code** = 6 − **alter Code**“, mit Beschriftung unter der 6: „kleinster plus größter Code: 1 + 5“. Drei Beispiele klein: „6 − 1 = 5“, „6 − 2 = 4“, „6 − 3 = 3“.
- Unten zwei Kennzahlen: „Mittelwert vorher 2,94“ → „nachher 3,06 (= 6 − 2,94)“.
- Bildunterschrift: „Umpolen dreht nur die Zahlen um. Jeder Aufkleber wandert mit seinem Stein, und in jeder Stufe stehen gleich viele Menschen wie vorher. Aus ‚höher heißt schlechter‘ wird ‚höher heißt besser‘. *Anzahlen: ALLBUS 2023, n = 5.194, ungewichtet.*“
- Textfassung: „Links die Wirtschaftslage vorher: Code 1 sehr gut, 95 Befragte; 2 gut, 1.338; 3 teils/teils, 2.684; 4 schlecht, 919; 5 sehr schlecht, 158. Rechts nach dem Umpolen: Code 1 sehr schlecht, 158; 2 schlecht, 919; 3 teils/teils, 2.684; 4 gut, 1.338; 5 sehr gut, 95. Pfeile verbinden gleiche Wörter. Formel: neuer Code gleich 6 minus alter Code, weil 1 plus 5 gleich 6; zum Beispiel 6 minus 1 gleich 5, 6 minus 2 gleich 4, 6 minus 3 gleich 3. Mittelwert vorher 2,94, nachher 3,06.“

Kurz gesagt:
> **Kurz gesagt:** **Umpolen** dreht die Codes einer Skala um: Der kleinste wird der größte und umgekehrt. Die Antworten bleiben dieselben, nur die Richtung der Zahlen ändert sich. Man polt um, damit eine höhere Zahl immer „mehr“ von dem heißt, was man messen will.

Kurz überlegen (Zahl):
- Label: „Nach dem Umpolen: Welcher Code steht bei ‚GUT‘?“
- Hilfezeile: „Neuer Code = 6 − alter Code.“
- Ziel 4; Toleranz 0.
- Richtig: „4: Vorher war GUT die 2, und 6 − 2 = 4.“
- Falsch, 2: „2 war GUT vor dem Umpolen. Rechne 6 − 2.“
- Falsch, sonst: „Such GUT im linken Turm (Code 2) und folge dem Pfeil.“

#### 4b „Zwei Aussagen, zwei Richtungen“ (Schild „Deuten“)
Text:
> Umpolen brauchst du vor allem, wenn mehrere Fragen dasselbe messen sollen, aber in verschiedene Richtungen gestellt sind. Zum Beispiel: „Ich fühle mich in meinem Viertel sicher.“ und „Nachts habe ich in meinem Viertel Angst.“ Wer der ersten Aussage zustimmt, fühlt sich sicher. Wer der zweiten zustimmt, fühlt sich unsicher. Ein „stimme voll zu“ (Code 1) heißt also einmal das eine, einmal das Gegenteil.
>
> Bevor du solche Fragen gemeinsam auswertest oder für beide dieselbe Regel nimmst, polst du eine um. Dann heißt Code 1 bei beiden dasselbe.

Genauer erklärt, Titel „Genauer erklärt: Umpolen oder anders zusammenfassen?“:
> In R polt `rec()` mit `rules = "rev"` um. Es nimmt dafür den kleinsten und den größten Code der Skala, so wie die Wertelabels sie angeben (bei `ep01` 1 und 5), und rechnet kleinster plus größter minus alter Code; fehlende Werte bleiben leer, die Aufkleber wandern mit. Mit `frequency()` prüfst du danach, ob die Wörter jetzt bei den neuen Codes stehen.
>
> Willst du nur zwei Gruppen bilden, geht es auch ohne Umpolen: Du schreibst die Regel einfach andersherum. Umpolen lohnt sich, wenn du danach mit mehreren Fragen gleich weiterarbeiten willst, etwa dieselbe Regel für alle oder später einen Mittelwert über mehrere Fragen (Sitzung 8).

Häufige Verwechslung:
> **Häufige Verwechslung:** Umpolen ist kein Fehlerbeheben. Die Daten waren vorher nicht falsch, sie zählten nur in die andere Richtung. Wichtig ist, dass du weißt, welche Richtung gilt, und es bei der Auswertung dazuschreibst.

---

### Aufgabe 4 „Gegenprobe mit einer umgedrehten Aussage“ / **Zusatz**
Kopf: Stein A4, Schild „Zusatz“, „↑ Grundlage 4 nachlesen“.

Leitfrage:
> Kommt dasselbe heraus, wenn man Misstrauen mit einer anderen Aussage misst?

Ziel-Kasten:
> **Ziel:** Am Ende hast du eine zweite Aussage umgepolt, daraus eine Misstrauens-Gruppe gebildet und weißt, warum die Regel aus Aufgabe 1 ohne Umpolen das Gegenteil misst.
> Grundlage: Grundlage 4, Umpolen


Einleitung:
> Im selben Fragebogenteil stand die Aussage: „Die Politiker vertreten die Interessen der Bevölkerung.“ (`pe05`, wieder von 1 „stimme voll zu“ bis 4 „stimme gar nicht zu“). Wer hier zustimmt, vertraut den Politikern. Misstrauen zeigt, wer **nicht** zustimmt. Die Aussage ist also andersherum gestellt als `pe01`.

**Erst festlegen** (Optionsfelder):
- Frage: „Du nimmst die Regel aus Aufgabe 1, `1:2=1 [misstraut]`, ohne Umpolen für pe05. Wen zählt die neue Variable dann als ‚misstraut‘?“
- Optionen: „Menschen, die den Politikern misstrauen“ / „Menschen, die den Politikern vertrauen“

**Schritte**
1. **Pol pe05 um.** Schild „neu heute“.
   Text: „`rules = "rev"` dreht die Codes um: Aus 1 wird 4, aus 2 wird 3, aus 3 wird 2, aus 4 wird 1. Prüf in der Ausgabe, welches Wort jetzt bei Code 1 steht.“
   Werkstatt `a4_um` (keine Markierung):
   ```r
   # pe05 umpolen und gleich prüfen: Welches Wort steht jetzt bei Code 1?
   allbus %>%
     mutate(
       pe05_um = rec(pe05, rules = "rev")
     ) %>%
     frequency(pe05_um)
   ```
   Ausgabe: 1 STIMME GAR NICHT ZU 578; 2 STIMME EHER NICHT ZU 1476; 3 STIMME EHER ZU 1399; 4 STIMME VOLL ZU 149; fehlend wie pe05 (TNZ: SPLIT 1596 usw.).
   **Bild `s5-umpolen-pe05.svg`**:
   - Links Turm `pe05` (`<dbl+lbl>`), zum Beispiel fünf Befragte: 1 STIMME VOLL ZU; 3 STIMME EHER NICHT ZU; 4 STIMME GAR NICHT ZU; 2 STIMME EHER ZU; leerer Stein TNZ: SPLIT.
   - Grüner Pfeil `rec(pe05, rules = "rev")` zu Turm `pe05_um`: 4 STIMME VOLL ZU; 2 STIMME EHER NICHT ZU; 1 STIMME GAR NICHT ZU; 3 STIMME EHER ZU; leerer Stein NA.
   - Unter `pe05_um` eine Klammer über die Codes 1 und 2: „jetzt wie bei pe01: kleine Zahl = Misstrauen“. Unter `pe05` dieselbe Stelle grau: „vorher: kleine Zahl = Vertrauen“.
   - Bildunterschrift: „Umpolen dreht die Codes, die Wörter wandern mit. Danach heißt eine kleine Zahl bei pe05 dasselbe wie bei pe01: Misstrauen. Fehlende Werte bleiben leer. *Die Steine sind ein Beispiel mit fünf Befragten.*“
   - Alternativtext: „Links der Turm pe05, zum Beispiel fünf Befragte: 1 STIMME VOLL ZU, 3 STIMME EHER NICHT ZU, 4 STIMME GAR NICHT ZU, 2 STIMME EHER ZU und ein leerer Stein TNZ: SPLIT. Ein grüner Pfeil rec(pe05, rules = "rev") führt zum Turm pe05_um: 4 STIMME VOLL ZU, 2 STIMME EHER NICHT ZU, 1 STIMME GAR NICHT ZU, 3 STIMME EHER ZU und ein leerer Stein NA. Unter pe05_um sind die Codes 1 und 2 eingeklammert mit dem Text: jetzt wie bei pe01, kleine Zahl gleich Misstrauen. Unter pe05 grau: vorher, kleine Zahl gleich Vertrauen.“
2. **Bilde die Misstrauens-Gruppe und vergleiche.**
   Text: „Die Kette polt pe05 wie in Schritt 1 um, bildet daraus `misstrauen_pe05` und dazu `nichtwahl` wie in Aufgabe 1. Nach dem Umpolen steht bei `pe05_um` die 1 für ‚stimme gar nicht zu‘ und die 2 für ‚stimme eher nicht zu‘. Wie in Aufgabe 1 zählt bisher nur der äußerste Code als Misstrauen. Passe die markierten Stellen an: Welche Codes von `pe05_um` heißen jetzt Misstrauen?“
   Werkstatt `a4_mutate` (markiert: Zeile 6 `1`, Zeile 6 `2:4`):
   ```r
   # pe05 umpolen, Misstrauen daraus bilden und mit der Nichtwahl kreuzen
   # nichtwahl bilden: kennst du aus Aufgabe 1
   allbus %>%
     mutate(
       pe05_um         = rec(pe05, rules = "rev"),
       misstrauen_pe05 = rec(pe05_um, rules = "⟦1⟧=1 [misstraut]; ⟦2:4⟧=0 [misstraut nicht]; else=NA"),
       nichtwahl       = rec(pv01, rules = "91=1 [würde nicht wählen]; 1:90=0 [würde wählen]; else=NA")
     ) %>%
     crosstab(misstrauen_pe05, nichtwahl, percentages = "row")
   ```
   Lösung: `1:2` und `3:4`. Ausgabe gelöst: misstraut nicht 96.8% / 3.2% (n 1267); misstraut 93.1% / 6.9% (104 von 1512); N (valid) 2779. Mit Platzhalter: 95.8% / 4.2% und 89.4% / 10.6%.
3. **Zum Vergleich: ohne Umpolen.**
   Text: „Was wäre passiert, wenn du die Regel aus Aufgabe 1 einfach auf pe05 übertragen hättest? Führe die Vorlage aus und vergleiche mit Schritt 2. Hier fehlt die Zeile mit `rev`.“
   Werkstatt `a4_ohne` (keine Markierung):
   ```r
   # Zum Vergleich: die Regel aus Aufgabe 1 ohne Umpolen auf pe05
   # nichtwahl bilden: kennst du aus Aufgabe 1
   allbus %>%
     mutate(
       misstrauen_ohne = rec(pe05, rules = "1:2=1 [misstraut]; 3:4=0 [misstraut nicht]; else=NA"),
       nichtwahl       = rec(pv01, rules = "91=1 [würde nicht wählen]; 1:90=0 [würde wählen]; else=NA")
     ) %>%
     crosstab(misstrauen_ohne, nichtwahl, percentages = "row")
   ```
   Ausgabe: misstraut nicht 93.1% / 6.9%; misstraut 96.8% / 3.2% (die Gruppen sind vertauscht).

**Probier-Werkstatt** (zugeklappt):
> Für die Aufgabe reichen die Vorlagen oben. Hier ist Platz für eigene Fragen. Eine Idee: Eine dritte Aussage, „Politiker vertreten nur die Interessen der Reichen“ (`pa35`), hat fünf Stufen mit „teils/teils“ in der Mitte. Wohin gehört „teils/teils“, und ändert das etwas? Die Probier-Werkstatt startet mit einem Vorschlag.
```r
# Eine Idee: Gegenprobe mit pa35 („Politiker vertreten nur die Reichen“)
# 3 = teils/teils zählt hier als „misstraut nicht“. Probier auch 1:3=1 und 4:5=0.
allbus %>%
  mutate(
    misstrauen_pa35 = rec(pa35, rules = "1:2=1 [misstraut]; 3:5=0 [misstraut nicht]; else=NA"),
    nichtwahl       = rec(pv01, rules = "91=1 [würde nicht wählen]; 1:90=0 [würde wählen]; else=NA")
  ) %>%
  crosstab(misstrauen_pa35, nichtwahl, percentages = "row")
```
(Kontrolle: misstraut 8.3 %, übrige 3.5 % würden nicht wählen; mit `"1:3=1 …; 4:5=0 …"` 6.6 % gegenüber 1.8 %.)

**Antwortfragen:**

| id | Art | Label | Optionen | Ziel | Toleranz | Text richtig | Text falsch / Hinweis | Hilfezeile |
|---|---|---|---|---|---|---|---|---|
| a4a | choice | Welches Wort steht nach dem Umpolen bei Code 1? | „STIMME VOLL ZU“ / „STIMME GAR NICHT ZU“ / „TNZ: SPLIT“ | zweite | – | „Aus 4 ‚stimme gar nicht zu‘ wurde 1. Jetzt heißt eine kleine Zahl Misstrauen, wie bei pe01.“ | erste: „Das war Code 1 vor dem Umpolen. Schau in die Ausgabe von Schritt 1.“<br>dritte: „TNZ: SPLIT ist ein fehlender Wert und bleibt leer.“ | „Aus Schritt 1, Zeile mit Value 1.“ |
| a4b | number | Wie viel Prozent der Misstrauenden (nach pe05) würden nicht wählen? | – | 6,9 | ±0,1 (ganze Zahl ±0,55) | „6,9 %: 104 von 1.512.“ | 10,6: „Bei dir zählt nur Code 1 (‚stimme gar nicht zu‘). ‚Stimme eher nicht zu‘ (Code 2) ist auch Misstrauen: 1:2=1, 3:4=0.“<br>3,2: „Das ist die andere Zeile, oder deine Regel nimmt 3:4 als Misstrauen. Nach dem Umpolen heißen 1 und 2 Misstrauen.“<br>sonst: „Zeile ‚misstraut‘, Spalte ‚würde nicht wählen‘ in Schritt 2.“ | „Aus Schritt 2.“ |
| a4c | number | Und wie viel Prozent der übrigen? | – | 3,2 | ±0,1 (ganze Zahl ±0,55) | „3,2 %: Auch mit pe05 wollen Misstrauende etwa doppelt so häufig nicht wählen.“ | 4,2: „Bei dir zählt nur Code 1. Passe die Regel an: 1:2=1, 3:4=0.“<br>6,9: „Das ist die Zeile ‚misstraut‘. Gesucht ist ‚misstraut nicht‘.“<br>sonst: „Zeile ‚misstraut nicht‘, Spalte ‚würde nicht wählen‘.“ | „Aus Schritt 2.“ |
| a4d | choice | Was zeigt die Tabelle ohne Umpolen (Schritt 3)? | „Die Gruppen sind vertauscht: Unter ‚misstraut‘ stehen die, die pe05 zustimmen, also vertrauen. Darum sieht es aus, als wollten Misstrauende seltener nicht wählen.“ / „Dasselbe Ergebnis wie mit Umpolen.“ / „R rechnet ohne Umpolen falsch.“ | erste | – | „Genau: 3,2 % und 6,9 % tauschen die Plätze. R rechnet richtig, aber die Regel passt nicht zur Richtung der Aussage.“ | zweite: „Vergleiche die Zeile ‚misstraut‘ in Schritt 2 (6,9 %) und Schritt 3 (3,2 %).“<br>dritte: „R rechnet in beiden Fällen richtig. Der Unterschied liegt in der Regel: Ohne Umpolen heißt 1:2 bei pe05 Zustimmung, also Vertrauen.“ | – |
| a4e | choice | Bestätigt die Gegenprobe dein Ergebnis aus Aufgabe 3? | „Ja: Auch mit pe05 wollen Misstrauende häufiger nicht wählen (6,9 % gegenüber 3,2 %), und auch hier wollen über 90 % von ihnen wählen.“ / „Nein, das Ergebnis dreht sich um.“ / „Nein, mit pe05 würde die Mehrheit der Misstrauenden nicht wählen.“ | erste | – | „Zwei Aussagen, dasselbe Bild. Das macht das Ergebnis aus Aufgabe 3 belastbarer.“ | zweite: „Umgedreht ist es nur ohne Umpolen. Mit Umpolen zeigt es in dieselbe Richtung wie Aufgabe 3.“<br>dritte: „93,1 % der Misstrauenden würden wählen.“ | – |

Hilfe:
- **Stufe 1:** „Wer pe05 zustimmt, vertraut. Nach dem Umpolen steht die kleine Zahl für Ablehnung, also für Misstrauen, genau wie bei pe01.“
- **Stufe 2:** „Welches Wort bei welchem Code steht, zeigt Schritt 1. Misstrauen sind nach dem Umpolen die Codes 1 und 2. Die Prozent liest du in Schritt 2 in der Spalte ‚würde nicht wählen‘.“
- **Stufe 3:** „Regel in Schritt 2: `"1:2=1 [misstraut]; 3:4=0 [misstraut nicht]; else=NA"`. Ergebnis: 6,9 % der Misstrauenden und 3,2 % der übrigen würden nicht wählen. Ohne Umpolen sind die Gruppen vertauscht (3,2 % und 6,9 %). Die Gegenprobe bestätigt Aufgabe 3.“

**Ohne Grafik lösbar:** „Alle Zahlen stehen in den Ausgaben der Schritte 1 bis 3.“

---

## 8. Überblick: Welche Prozentbasis für welche Frage?

Trennüberschrift mit Stein ✓. Kopf „Überblick zu allen Aufgaben“, Titel „Basis wählen, Grenzen kennen“. Einleitung:
> Alle vier Themen zusammen: welche Prozentbasis welche Frage beantwortet und was eine Kreuztabelle braucht.

### Ü1 „Wer ist 100 %?“ (Schild „Zuordnen“)
Text:
> Such in jeder Frage die Gruppe nach „der“ oder „von“: Sie ist die Basis. Fragst du nach einem Unterschied zwischen Gruppen, ist jede Gruppe für sich 100 %.

**Zuordnen** (je Frage ein Auswahlfeld, Knopf „Prüfen“, Rückmeldung je Feld und gesamt, `aria-live`):
- Alle Fragen beziehen sich auf eine Tabelle mit Wohngebiet (West, Ost) und Misstrauen (misstraut, misstraut nicht).
- Optionen für jedes Feld: „alle im Osten“ / „alle Misstrauenden“ / „alle Befragten in der Tabelle“ / „West und Ost je für sich“.

| Frage | Ziel | Rückmeldung richtig | Rückmeldung falsch |
|---|---|---|---|
| Wie viel Prozent der Befragten im Osten misstrauen den Politikern? | alle im Osten | „Basis: die Befragten im Osten.“ | „Die Gruppe nach ‚der‘: die Befragten im Osten.“ |
| Wie viel Prozent der Misstrauenden leben im Osten? | alle Misstrauenden | „Basis: die Misstrauenden.“ | „Die Gruppe nach ‚der‘: die Misstrauenden.“ |
| Wie viel Prozent aller Befragten sind Misstrauende aus dem Osten? | alle Befragten in der Tabelle | „Basis: alle. Das sind Gesamtprozente.“ | „‚Aller Befragten‘: Die ganze Tabelle ist 100 %.“ |
| Misstrauen Befragte im Osten häufiger als im Westen? | West und Ost je für sich | „Ein Vergleich: Jede Gruppe der UV ist 100 %.“ | „Für einen Vergleich ist jede Gruppe für sich 100 %, dann vergleichst du die Anteile.“ |

Gesamtrückmeldung bei 4 von 4: „Alle vier richtig. In R gibt `crosstab(eastwest, misstrauen, percentages = "row")` die Antwort auf die letzte Frage: Im Westen misstrauen 70,6 %, im Osten 78,3 %.“ Sonst: „x von 4 richtig. Unter jedem Feld steht, worauf du achten kannst.“

Kurz gesagt:
> **Kurz gesagt:** Erst die Frage, dann die Basis: „Wie viele der …“ legt fest, wer 100 % ist. Für einen Vergleich setzt du jede Gruppe der UV auf 100 % und gibst den Abstand in Prozentpunkten an.

### Ü2 „Voraussetzungen: Was eine Kreuztabelle braucht und wo sie täuschen kann“
Tabelle (Überschrift „Voraussetzungen der Kreuztabelle“):

| Was | braucht | Vorsicht |
|---|---|---|
| Variablen | zwei Variablen mit wenigen Stufen | Viele Stufen machen die Tabelle unlesbar. Erst zu Gruppen zusammenfassen (Grundlage 1) und sagen, wie. |
| Gruppen | genug Menschen je Gruppe | Prozent aus 14 Menschen schwanken stark. n je Gruppe nennen. |
| fehlende Werte | gültige Angaben bei beiden Variablen | Wer bei einer Variable fehlt, steht nicht in der Tabelle; bei Split-Fragen fast ein Drittel. N (valid) nennen. |
| Prozentbasis | eine Basis, die zur Frage passt | Gleiche Zelle, andere Basis, andere Aussage. Immer sagen, wer 100 % ist. |
| Deutung | eine begründete Leserichtung (UV, AV) | Ein Zusammenhang ist keine Ursache. Andere Erklärungen bedenken. |
| Gewichtung | Aussagen über ganz Deutschland brauchen Gewichte | Der Osten ist im ALLBUS absichtlich stärker vertreten. Hier ungewichtet; Gewichtung in Sitzung 6. |

### Ü3 „Zufall oder Zusammenhang?“ (Schild „Wiederholung aus der Vorlesung“)
Text:
> Die 2.785 Befragten in deiner Tabelle sind eine **Stichprobe** aus einer **Grundgesamtheit**, beim ALLBUS den Erwachsenen, die in Deutschland in Privathaushalten leben. Auch wenn es dort keinen Zusammenhang gäbe, wären die Anteile in einer Stichprobe nie ganz gleich. Ob der Unterschied zwischen 6,5 % und 2,3 % größer ist, als der Zufall erwarten lässt, prüft der **Chi-Quadrat-Test** aus der Vorlesung. In R:

Statische Vorlage `ueb_chi` (Kopieren; keine Werkstatt nötig, darf aber eine sein):
```r
# Wiederholung: Ist der Unterschied größer, als der Zufall erwarten lässt?
# misstrauen und nichtwahl bilden: kennst du aus Aufgabe 1
allbus %>%
  mutate(
    misstrauen = rec(pe01, rules = "1:2=1 [misstraut]; 3:4=0 [misstraut nicht]; else=NA"),
    nichtwahl  = rec(pv01, rules = "91=1 [würde nicht wählen]; 1:90=0 [würde wählen]; else=NA")
  ) %>%
  chi_square(misstrauen, nichtwahl)
```
Text darunter:
> R meldet `chi2(1) = 20.685, p < 0.001 ***` bei N = 2785. Gäbe es in der Grundgesamtheit keinen Zusammenhang, wäre ein so großer Unterschied in einer Stichprobe dieser Größe sehr unwahrscheinlich. Der Test sagt aber nichts darüber, wie stark der Zusammenhang ist und was die Ursache ist. Die Stärke steht in derselben Zeile: `V = 0.086 (negligible)`, auf Deutsch „vernachlässigbar“. Was V ist, lernst du in Sitzung 6.
>
> Der Test hat selbst eine Voraussetzung: In jeder Zelle müssten ohne Zusammenhang genug Befragte zu erwarten sein (Faustregel: mindestens 5). Hier ist die kleinste erwartete Zahl gut 43; sonst warnt R (mehr dazu in Sitzung 6). Die Zahlen sind ungewichtet.

Häufige Verwechslung:
> **Häufige Verwechslung:** „Signifikant“ heißt nicht „groß“ oder „wichtig“. Bei vielen Befragten wird auch ein kleiner Unterschied wie 4,2 Prozentpunkte signifikant; R nennt ihn zugleich „negligible“.

---

## 9. Zum Schluss: Mitnehmen

### Das Wichtigste aus dieser Sitzung
- **Umkodieren** fasst Antworten nach festen Regeln zu Gruppen zusammen. Wer in keine Gruppe gehört, wird **leer (NA)**, nicht 0. Jede Einteilung ist eine Entscheidung, die du nennst.
- Eine **Dummyvariable** hat nur 0 und 1; ihr Mittelwert ist der Anteil der Einsen.
- Eine **Kreuztabelle** zählt die Kombinationen zweier Variablen. Jede Prozentzahl darin hat eine **Basis**: **Zeilenprozente** (jede Zeile 100 %), **Spaltenprozente** (jede Spalte 100 %), **Gesamtprozente** (alle 100 %).
- Dieselbe Zelle beantwortet je nach Basis eine andere Frage: 87,0 % der Nichtwählenden misstrauen, aber nur 6,5 % der Misstrauenden würden nicht wählen.
- **Leserichtung:** Jede Gruppe der UV ist 100 %, dann vergleichst du zwischen den Gruppen. Den Abstand nennst du in **Prozentpunkten**.
- **Umpolen** dreht eine Skala um, damit eine höhere Zahl bei allen Fragen dasselbe heißt.
- Eine Kreuztabelle zeigt einen Zusammenhang, keine Ursache. Nenne n, wer fehlt und dass ungewichtet gerechnet wurde.
- In R: `allbus %>% mutate(neu = rec(alt, rules = "…")) %>% frequency(neu)` baut eine neue Variable und prüft sie, `crosstab(zeilen, spalten, percentages = "row")` zeigt die Tabelle, `rules = "rev"` polt um. In RStudio legst du neue Variablen mit `allbus <- allbus %>% mutate(…)` einmal ab.

### Prüf dich selbst (6 Fragen; je Frage Optionsfelder, „Prüfen“, Rückmeldung „Deine Wahl: … Begründung“)

| # | Frage | Optionen | richtig | Begründung |
|---|---|---|---|---|
| 1 | In einer Tabelle steht: „78 % der Befragten im Osten misstrauen den Politikern.“ Wer ist 100 %? | alle Misstrauenden / alle Befragten im Osten / alle Befragten | alle Befragten im Osten | „Die Gruppe nach ‚der‘ ist die Basis: die Befragten im Osten (Grundlage 2).“ |
| 2 | Was macht `else=NA` in `rec()`? | setzt alle nicht genannten Codes auf 0 / macht alle nicht genannten Codes leer, sie zählen nicht mit / löscht die alte Variable | macht … leer | „Alles, was in keiner Regel steht, wird NA und fällt aus Tabellen und Prozenten heraus. Mit else=0 würde es als 0 mitgezählt (Grundlage 1).“ |
| 3 | Du willst wissen, ob Ältere häufiger wählen wollen als Jüngere. Altersgruppen stehen in den Zeilen. Welche Prozent nimmst du? | Zeilenprozente / Spaltenprozente / Gesamtprozente | Zeilenprozente | „Das Alter ist die UV. Jede Altersgruppe ist 100 %, und sie steht in den Zeilen (Grundlage 3).“ |
| 4 | Ein Anteil steigt von 20 % auf 30 %. Wie beschreibst du das richtig? | um 10 Prozent / um 10 Prozentpunkte / um 30 Prozentpunkte | um 10 Prozentpunkte | „Abstand zweier Anteile: abziehen, 30 − 20 = 10 Prozentpunkte. In Prozent wären es 50 % mehr (Grundlage 3).“ |
| 5 | Eine Aussage lautet „Ich vertraue …“, eine andere „Ich misstraue …“, beide von 1 „stimme voll zu“ bis 4. Was tust du, bevor du für beide dieselbe Regel nimmst? | nichts, die Codes sind gleich / eine der beiden umpolen / beide löschen | eine umpolen | „Bei gleicher Regel hieße Code 1 einmal Vertrauen, einmal Misstrauen. Nach dem Umpolen meint eine kleine Zahl bei beiden dasselbe (Grundlage 4, Aufgabe 4).“ |
| 6 | Warum stehen in deiner Kreuztabelle nur 2.785 von 5.246 Befragten? | R hat Befragte zufällig weggelassen / wer bei einer der beiden Variablen keine gültige Angabe hat, fehlt / es sind nur Nichtwählende | wer … fehlt | „Eine Kreuztabelle braucht gültige Angaben bei beiden Variablen. pe01 stand zudem nur in einem Teil der Fragebögen. Darum nennst du N (valid) (Aufgabe 2).“ |

### Dein Skript zum Mitnehmen
Text: „Alle Vorlagen dieser Sitzung in einer Datei, mit Kommentaren. Öffne sie in RStudio und führe sie Block für Block aus.“ Knopf „Skript herunterladen (sitzung5.R)“, Link „→ Nachlesen im R-Workshop, Kapitel 5 und 7“.

Inhalt der Datei (wörtlich; als Ganzes in `sitzung05-zahlen.R` in einer frischen Umgebung ausgeführt). Anders als die Werkstatt-Vorlagen bildet das Skript alle neuen Variablen einmal oben und legt sie mit `allbus <-` ab; danach folgen die Auswertungen der Seite in kurzer Form. Ohne die Probier-Werkstätten.
```r
# Sitzung 5: Kreuztabellen
# Statistikatlas, Methoden Ib, ALLBUS 2023 (ZA8831 v1.3.0), ungewichtet
# Angepasste Stellen stehen hier in ihrer gelösten Form.

# ---- Startblock ----
library(tidyverse)
library(mariposa)

allbus <- read_spss("ZA8831_v1-3-0.sav")

# ---- Alle neuen Variablen dieser Sitzung einmal bilden und ablegen ----
# teilzeit: R lesen; misstrauen, nichtwahl: Aufgabe 1; pe05_um bis misstrauen_ohne: Aufgabe 4
allbus <- allbus %>%
  mutate(
    teilzeit        = rec(work, rules = "2:3=1 [Teilzeit]; 1=0 [Vollzeit]; else=NA"),
    misstrauen      = rec(pe01, rules = "1:2=1 [misstraut]; 3:4=0 [misstraut nicht]; else=NA"),
    nichtwahl       = rec(pv01, rules = "91=1 [würde nicht wählen]; 1:90=0 [würde wählen]; else=NA"),
    pe05_um         = rec(pe05, rules = "rev"),
    misstrauen_pe05 = rec(pe05_um, rules = "1:2=1 [misstraut]; 3:4=0 [misstraut nicht]; else=NA"),
    misstrauen_ohne = rec(pe05, rules = "1:2=1 [misstraut]; 3:4=0 [misstraut nicht]; else=NA")
  )

# ---- R lesen: die neue Variable prüfen ----
allbus %>%
  frequency(teilzeit)

# ---- R lesen: eine Kreuztabelle ----
allbus %>%
  crosstab(sex, teilzeit, percentages = "row")

# ---- Aufgabe 1: Codes von pe01 ----
allbus %>%
  frequency(pe01)

# ---- Aufgabe 1: Gruppen prüfen ----
allbus %>%
  frequency(misstrauen)

allbus %>%
  frequency(nichtwahl)

# ---- Aufgabe 2: Spaltenprozente, die 87 % ----
allbus %>%
  crosstab(misstrauen, nichtwahl, percentages = "col")

# ---- Aufgabe 2: alle drei Prozentbasen ----
allbus %>%
  crosstab(misstrauen, nichtwahl, percentages = "all")

# ---- Aufgabe 3: Zeilenprozente, Gruppen vergleichen ----
allbus %>%
  crosstab(misstrauen, nichtwahl, percentages = "row")

# ---- Aufgabe 4: pe05 umgepolt prüfen ----
allbus %>%
  frequency(pe05_um)

# ---- Aufgabe 4: Gegenprobe ----
allbus %>%
  crosstab(misstrauen_pe05, nichtwahl, percentages = "row")

# ---- Aufgabe 4: zum Vergleich ohne Umpolen ----
allbus %>%
  crosstab(misstrauen_ohne, nichtwahl, percentages = "row")

# ---- Wiederholung: Chi-Quadrat ----
allbus %>%
  chi_square(misstrauen, nichtwahl)
```

---

## 10. Hilfe bei R-Fehlermeldungen

Zugeklappt unter jeder Aufgabe („Hilfe: R meldet einen Fehler“), Tabelle „Was R sagt und was du tust“. In RStudio kommen manche Meldungen deutsch, in der Code-Werkstatt (webR) englisch; beide Fassungen nennen.

| R meldet | Das hilft |
|---|---|
| `konnte Funktion "rec" nicht finden` (oder `"%>%"`, `"crosstab"`); englisch `could not find function "rec"` | Den Startblock aus „R lesen“ ausführen. |
| `Objekt 'allbus' nicht gefunden` / `object 'allbus' not found` | Die Zeile mit `read_spss()` aus dem Startblock ausführen. |
| `Can't select columns that don't exist. ✖ Column `misstrauen` doesn't exist.` oder `Row variable `misstrauen` not found in data.` | R kennt die Variable nicht. Steht die `mutate()`-Zeile, die sie bildet, oben in derselben Vorlage, und ist der Name dort genauso geschrieben? Kopiere die Vorlage neu und ändere nur die markierten Stellen. |
| Erst erscheint eine lange Tabelle (`# A tibble: 5,246 × …`), dann `Objekt 'misstrauen' nicht gefunden` / `object 'misstrauen' not found` | Nach `)` am Ende von `mutate(` fehlt `%>%`. Dann endet die Kette dort, und `crosstab()` oder `frequency()` bekommt keine Daten. |
| `Invalid new value: "1 [misstraut], 3:4=0 …"` | Regeln trennt ein Semikolon `;`, kein Komma. |
| `Invalid new value: "=1" in rule "1:2==1"` | In `rules` steht ein einfaches `=`. Das doppelte `==` gehört in `filter()`. |
| `Invalid old value: "STIMME VOLL ZU"` | Links vom `=` stehen Codes (Spalte Value in `frequency()`), keine Wörter. |
| `` `rules` is required `` | Vor der Regel fehlt `rules =`. |
| `Objekt 'misstraut' nicht gefunden` / `object 'misstraut' not found` | Die Regel braucht Anführungszeichen außen herum: `rules = "1:2=1 [misstraut]; …"`. |
| `'arg' sollte eines von '"row", "none", "col", "total", "all"' sein` / `'arg' should be one of …` | `percentages` falsch geschrieben. Erlaubt sind `"row"`, `"col"`, `"total"`, `"all"`, in Anführungszeichen. |
| In der Konsole erscheint `+` und nichts passiert | Eine Klammer oder ein Anführungszeichen ist nicht geschlossen. Drück Esc und kopiere die Vorlage neu. |
| Keine Fehlermeldung, aber eine Regel für einen fehlenden Wert (z. B. `-8=2 [weiß nicht]`) erzeugt keine neue Gruppe | Fehlende Werte sind für `rec()` schon leer; ihre Codes lassen sich in einer Regel nicht ansprechen. Für die Aufgaben ist das nicht nötig. |
| Keine Fehlermeldung, aber die Zahl passt nicht | Prüf die neue Variable mit `frequency()`: Stimmen die Gruppen? Und in der Tabelle: Wer ist 100 %, Zeile oder Spalte? |

---

## 11. Entscheidungen (selbst getroffen, mit Begründung)

1. **Vier Themen, drei Pflichtaufgaben.** Umkodieren, Prozentbasen und Leserichtung sind der Kern laut Sitzungsplan und Auftrag; Umpolen steht im Sitzungsplan („recode: zusammenfassen, umpolen“) und in der Funktionstabelle (`rules = "rev"`), wird aber als Zusatz geführt, damit die Pflicht in 45 Minuten machbar bleibt (A1 15, A2 12, A3 10 Minuten). A3 ist bewusst kurz und vor allem Deuten, weil es die Leitfrage der Sitzung beantwortet.
2. **Die 87 % bleiben, ohne Rolle.** Der „Nenner-Check“ aus dem alten Konzept trägt die Sitzung (Bedingungsrichtung als zentrales Missverständnis). Pressemitteilung, Parteivorstand und Faktencheck-Redaktion entfallen (keine Rollenszenarien, kein „(fiktiv)“); die Zahl kommt als „Angenommen, du liest diesen Satz“.
3. **Grundlagen-Variablen** `work` (→ `teilzeit`), `sex`, `ep01`: alltagsnah, kein Bezug zur Wahlfrage, nicht im Kapitel von Sitzung 4. Geschlecht × Teilzeit zeigt den Basiswechsel besonders deutlich (51,7 % gegenüber 73,7 %), ohne eine Zahl der Aufgaben vorwegzunehmen. `eastwest` erscheint nur in einer Probier-Werkstatt und im Zuordnen des Überblicks (ohne Rechnung in der Aufgabe).
4. **Die Zeile „divers“ bleibt in der Grundlage** (14 Personen). Sie entspricht der R-Ausgabe und zeigt nebenbei die Voraussetzung „genug Fälle je Gruppe“. Weglassen hätte andere Spaltenprozente als in R ergeben.
5. **`untag_na()` und `row_sums()` entfallen**, obwohl die Funktionstabelle im Leitfaden sie für Sitzung 5 führt. `untag_na()` braucht das Verständnis getaggter fehlender Werte und kostete im alten Format viel Zeit; Wer bei der Wahlabsicht „weiß nicht“ sagt und darum fehlt, wird stattdessen in der Probier-Werkstatt von A1 Thema (Prüfung 23.11.: dort mit `drop_na()` statt der bloßen Wiederholung von `frequency(pv01)` aus Sitzung 3). `row_sums()` („Rechnen innerhalb einer Person“) gehört inhaltlich zu Sitzung 8 (`row_means()`). Die Funktionstabelle im Leitfaden sollte für Sitzung 5 auf `mutate()` mit `rec()` (auch `"rev"`) und `crosstab()` gekürzt werden. `count()` und `select()` aus dem Sitzungsplan werden nicht gebraucht.
6. **Jede Vorlage läuft für sich** (Nachtrag zum Auftrag): Die Werkstatt setzt `allbus` vor jedem Ausführen zurück. A2 bis A4, die Probier-Werkstätten und der Überblick bilden `misstrauen`, `nichtwahl` bzw. `pe05_um` in ihrer eigenen Kette mit dem Kommentar „kennst du aus Aufgabe 1“; keine Vorlage nutzt `<-`. Folge: Die Regel `1:2=1` für pe01 steht ab A2 sichtbar in den Vorlagen. Das ist hinnehmbar, weil A2 nach A1 kommt und die Lösung von A1 ohnehin in Hilfe Stufe 3 steht. Eingaben aus einem falsch angepassten A1 können A2 und A3 nicht mehr verfälschen; die entsprechenden Rückmeldungen (50,0; 73; 8,8; 3,7) sind entfallen.
7. **Platzhalter sind lauffähige, aber unpassende Werte** (A1 und A4: nur der äußerste Code als Misstrauen; A2: `"row"`; A3: `"col"`). So läuft jede Vorlage sofort, und die Antwortprüfung erkennt typische Platzhalter-Ergebnisse (A1: 1.144; A2: Wahl "row" oder "total" in a2a; A3: 87,0 und 13,0; A4: 10,6 und 4,2) und verweist auf die richtige Stelle.
8. **Grundlage 1 ohne R-Code:** Das Bedienelement zeigt die Regel in Worten, nicht als R-Regel; die R-Schreibweise steht in „R lesen“ (R2). Alle Zeilen starten „offen“ (Leitfaden „nichts vorgeben“).
9. **Gelb = Basis**, wie im Leitfaden („Gelber Rahmen = 100 % / Basis“); orange = die betrachtete Zelle.
10. **Chi-Quadrat nur als Wiederholung im Überblick** (Sitzungsplan: „Wiederholung … Chi²-Test“), ohne Aufgabe; V wird nur erwähnt und auf Sitzung 6 verwiesen.
11. **Skript zum Mitnehmen mit gelösten Stellen und einem `mutate()` oben.** Abweichend von Sitzung 4 (Beispielwerte), weil die Platzhalter hier inhaltlich falsche Gruppen bilden; ein Skript zum Nacharbeiten soll die richtigen Zahlen liefern. Die Lösungen stehen ohnehin in Hilfe Stufe 3. Das Skript zeigt zugleich den RStudio-Weg „einmal ablegen, oft auswerten“ (`allbus <- allbus %>% mutate(…)`).
12. **Antwortprüfung:** Prozentwerte mit Toleranz ±0,1, bei ganzzahliger Eingabe ±0,55 (wie im alten Konzept); Anzahlen exakt. Eingaben in deutscher und R-Schreibweise (`87,0`, `87.0`, `2.630`, `2630`, `2,630`) werden wie im Prototyp über beide Lesarten geprüft; kein Zielwert ist so gewählt, dass eine der beiden Lesarten einen anderen Zielwert trifft.
13. **Gewichtung:** alle Zielwerte ungewichtet; gewichtete Vergleichswerte nur in „Genauer erklärt“ und in einer Rückmeldung (86,6 %; Frauen 53,5 %, Männer 17,8 %), geprüft im Skript.
14. **Prozentpunkte** werden hier eingeführt (Grundlage 3, A3), weil der Vergleich von Gruppen sonst unsauber formuliert wird; das Verhältnis (2,8 bzw. 2,9) wird als zweite, ebenfalls richtige Beschreibung gezeigt.
15. **Freie-Karte-Links:** Begriffe `recode` und `crosstab` aus `curriculum.ts`; die genauen Ziele setzt der Umsetzende (vorhandene Knoten).

## 12. Abweichungen zu den Folien

Für Sitzung 5 gibt es noch keine Folien: `Seminarvorbereitung/` enthält nur `Sitzung 1` bis `Sitzung 4` und `_build_folien_s4.py`. Daher keine Abweichungen im engeren Sinn. Wenn die Folien entstehen, sollten sie:
- dieselbe Schreibweise nutzen: `allbus %>%` + `mutate(` + `rec(…, rules = "…")` mit `else=NA` + `) %>%` + Auswertung in einer Kette (zum Ablegen in RStudio `allbus <- allbus %>% mutate(…)`), `crosstab(zeilen, spalten, percentages = "row")`; kein `untag_na()`, kein `row_sums()`, kein `filter(!is.na())`;
- im Input andere Beispiele zeigen als die Aufgaben (nicht pe01, pv01, pe05); Geschlecht × Teilzeit aus den Grundlagen eignet sich, dann aber nicht dieselben Zahlen als „Lösung“ präsentieren, die Grundlage 2 schon erklärt, sondern ergänzend (etwa Altersgruppen × eine Freizeitfrage);
- die Begriffe dieses Kapitels verwenden: Basis, Zeilen-, Spalten-, Gesamtprozente, Prozentpunkte, Dummyvariable, Umpolen;
- in Arbeitsphase und Plenum auf A1 bis A3 (Pflicht) und A4 (Zusatz) verweisen; das Plenum nimmt den Faktencheck-Satz aus A3 auf;
- die Wiederholung (AV/UV, Kausalität, Stichprobe und Grundgesamtheit, Chi-Quadrat) knapp halten; im Kapitel stehen sie in Grundlage 3 und im Überblick.

## 13. Selbstprüfung „schwache Studentin“ (durchgespielt)

- **A1 (15 Min.):** Schritt 1 ausführen (1 Min.), Text zu Split lesen. Schritt 2: Die Regel-Erklärung steht im Schritt selbst (`1=1`, `2:4=0`), der Auftrag sagt, dass „voll oder eher“ zählt, und wo die Codes stehen; die Ausgabe kommt sofort mit. Häufigster Fehler: Platzhalter nicht angepasst → a1a gibt 1.144 ein → Rückmeldung nennt die Regel. Schritt 3 ausführen (fertige Regel), vier Fragen (8 Min.). Machbar.
- **A2 (12 Min.):** Drei Basen ausprobieren ist reines Umschalten; die Zelle ist im Text benannt. Zuordnen a2d verlangt das Verstehen aus Grundlage 2; Hilfezeile nennt die Fundstelle, Rückmeldung erklärt „Gruppe nach ‚der‘“. Jede Vorlage bildet ihre Variablen selbst; ein Fehler aus A1 wirkt nicht nach. Die längeren Vorlagen (sieben Zeilen) sind durch den Kommentar „kennst du aus Aufgabe 1“ und den Satz „Du änderst nur die letzte Zeile“ entschärft.
- **A3 (10 Min.):** Eine Umstellung (`col` → `row`), zwei Zahlen ablesen, eine Subtraktion, zwei Deutungsfragen. Die Begründung für `row` steht im Schritt („misstrauen steht in den Zeilen … jede Gruppe 100 %“).
- **Zielwerte = Ausgabe:** Alle Prozentziele sind genau die einstelligen Werte aus `crosstab()` (`6.5%`, `2.3%`, `6.9%`, `3.2%`; `87.0%` steht seit der Prüfung nur noch als Option in a2d), Anzahlen die Werte aus `frequency()`/`crosstab()`; 4,2 = 6,5 − 2,3 aus den gedruckten Werten. Alles in `sitzung05-zahlen.R` gegen die gedruckte Ausgabe geprüft (Parser liest die Textausgabe von mariposa, nicht nachgerechnete Werte).
- **Ohne Grafik:** Keine Aufgabe braucht ein Bild; alle Bilder haben Textfassungen mit den Werten; die Bedienelemente haben Tabellen bzw. Sätze als Textfassung.

---

## Prüfung (Agent, 23.11.2026)

Geprüft nach `teil-b-plan-pruefung.md` gegen Design, Prototyp Sitzung 4, die Pläne von Sitzung 1, 2, 3, 6 und 7 und die Datei ZA8831 v1.3.0. `Rscript sitzung05-zahlen.R` läuft danach mit Exit 0 (244 Prüfungen, vorher 230).

### 1. Schwache Studentin ohne Vorwissen (durchgespielt)
Zeit: R lesen 8 Min.; A1 etwa 15 (Codes lesen 2, Regel anpassen 5, nichtwahl 2, Fragen 6); A2 etwa 13 (drei Basen probieren 5, all 2, Fragen 6); A3 etwa 10; Pflicht zusammen etwa 38 Minuten, im Rahmen von 45. Jeder Schritt ist mit dem Davorstehenden lösbar; die Regel-Schreibweise steht im Schritt selbst, die Codes in Schritt 1.
- Befund: Das Festlegen in A1 fragte genau dasselbe wie a1c (nicht Wahlberechtigte) und war nach Sitzung 3 (−50 ist ein fehlender Wert) ohne Nachdenken lösbar. **Geändert:** Festlegen ist jetzt eine Schätzung, wie groß die Zustimmung zu pe01 ist (Auflösung 73,1 %); a1c bleibt als Prüffrage.
- Befund: a2a fragte nach der Prozentzahl, die schon in der Leitfrage steht (87), und war ohne Ausführen lösbar. **Geändert:** a2a ist jetzt eine Auswahl der Einstellung (`"row"`/`"col"`/`"total"`), die Rückmeldungen nennen die Werte 6.5% und 4.6%; Entscheidung 7 und die Selbstprüfung sind angepasst.
- Befund: `pv01` und das Prinzip „ein Zähler, mehrere Nenner“ kennen die Studierenden aus Sitzung 2 und 3 (Aufgabe 2 dort), der Plan sagte das nicht. **Geändert:** „Schon bekannt“ ergänzt, graues Schild an der Einleitung von A1 und an Grundlage 2a mit einem Satz zum Anschluss an Sitzung 3.

### 2. Didaktik
Jede Grundlage führt direkt in ihre Aufgabe (G1 Zuschneiden → A1 Regel; G2 Basis-Schalter → A2; G3 Leserichtung → A3; G4 Umpolen → A4) und verrät keine Lösung (andere Variablen; G1 ist eine Übertragung, keine Vorlage). Deuten statt Ablesen ist in a1d, a2d/a2e, a3e/a3f, a4d/a4e gut angelegt.
- Befund: Die Probier-Werkstatt von A1 (`frequency(pv01)`) wiederholte wörtlich einen Schritt aus Aufgabe 2 von Sitzung 3, keine Anschlussfrage. **Geändert:** neue Idee „Antworten die Befragten mit gültiger Wahlabsicht auf pe01 anders?“ mit `drop_na(nichtwahl)` und `frequency(pe01)` (Valid % 29,91/40,32/26,89/2,87 gegenüber 31,80/41,30/24,12/2,78). Sie macht sichtbar, wen jede Kreuztabelle mit `nichtwahl` verliert, und verrät die Regel von A1 nicht.
- Befund: Sitzung 1 (Aufgabe 2) hält ausdrücklich fest, dass pe01 kein Vertrauen misst; „misstrauen“ widerspräche dem ohne Kommentar. **Geändert:** A1-Einleitung mit einem Absatz zur Gültigkeit (Schild Sitzung 1); der Name `misstrauen` bleibt, weil Leitfrage im Curriculum und altes Konzept ihn tragen.
- Befund: Ü3 deutete den p-Wert verkürzt („kaum durch Zufall zu erklären“) und zeigte nicht, dass dieselbe Zeile V = 0.086 „negligible“ meldet, was genau die Verwechslung „signifikant = groß“ entkräftet. **Geändert:** Deutung über die Grundgesamtheit, V mit Übersetzung, Häufige Verwechslung ergänzt, Voraussetzung des Tests (erwartete Häufigkeit ≥ 5; hier kleinste 43,5) als Satz.

### 3. Fachliches und Barrierefreiheit
Alle Zahlen stimmen mit dem Skript; die Zielwerte entsprechen der gedruckten mariposa-Ausgabe (eine Nachkommastelle in `crosstab()`, zwei in `frequency()`). R-Stil eingehalten (tidyverse vor mariposa, `%>%`, `rec()` in `mutate()`, `drop_na()`/`to_label()` nur in Probier-Werkstätten, kein `ifelse`/`%in%`/`|>`); kein „·“, kein „(fiktiv)“, keine Rollen; keine Einzelfallwerte.
- Befund: R2 „Genauer erklärt“ behauptete allgemein, fehlende Werte blieben leer; mit `else=0` werden sie 0 (G1, Fall E, geprüft: Vollzeit 4.077). **Geändert:** Satz präzisiert; dazu, dass Codes fehlender Werte (−8) in Regeln still nichts bewirken (geprüft), auch als neue Zeile in der Fehlerhilfe.
- Befund: G4 beschrieb `rules = "rev"` als „kleinster und größter gültiger Code“; mariposa nimmt die Skala aus den Wertelabels. **Geändert.**
- Befund: Grundgesamtheit „alle Menschen in Deutschland“ ungenau. **Geändert:** Erwachsene in Privathaushalten.
- Befund: Bild `s5-mutate-a1`: Bauanleitung (fünf Fragezeichen-Steine) und Alternativtext (vier plus NA) widersprachen sich. **Geändert:** einheitlich vier plus NA in der Split-Zeile.
- Kleinigkeiten: „Gesamtprozente (auch Zellenprozente)“ ergänzt, weil Curriculum und freie Karte „Zellenprozente“ sagen; G1 „Häufige Verwechslung“ ohne „er“.

### Anschluss an Sitzung 6 (nicht geändert, nur geprüft)
Sitzung 6 setzt `mutate()` mit `rec()` samt `rules = "rev"`, `crosstab()` mit Zeilenprozenten und χ² als Test aus Sitzung 5 voraus: alles vorhanden (rev in Grundlage 4, Zusatzaufgabe 4 und „Das Wichtigste“; S6 erklärt das Umpolen in seiner Vorlage noch einmal). Die Zweiteilung mit `rec(…, "1:3=1 …; 4:6=0 …")` und die Zeilenprozente in S6 A2 passen zur Schreibweise hier.

### Offene Punkte (bewusst nicht geändert)
- **p-Wert:** Sitzung 6 schreibt, was p-Wert und Sternchen bedeuten, komme in Sitzung 7; hier wird p im Überblick als Wiederholung aus der Vorlesung gedeutet. Kein Widerspruch im Inhalt, aber der Satz in Sitzung 6 sollte „kennst du als Wiederholung aus Sitzung 5, genauer in Sitzung 7“ lauten (Datei von S6 nicht bearbeitet).
- **`untag_na()`:** Sitzung 3 (Entscheidung 3 und Folienliste) verweist `untag_na()` auf Sitzung 5, dieser Plan streicht es (Entscheidung 5). Der Verweis in Sitzung 3 und die Funktionstabelle im Leitfaden müssen nachgezogen werden; Entscheidung des Dozenten.
- **„Rechnen innerhalb einer Person“** (`row_operations`) steht im Curriculum unter Sitzung 5, kommt aber erst in Sitzung 8; Curriculum-Eintrag anpassen oder bewusst so lassen.
- **Variablenname `misstrauen`** bleibt trotz der Gültigkeitsfrage (siehe oben); ein neutralerer Name wäre `ungehoert`, würde aber Leitfrage und Plenum sprachlich holpriger machen.
- **Zeitbedarf A2** liegt für langsame Studierende eher bei 13 bis 15 Minuten; der Testlauf sollte das messen.

## Nacharbeit nach Kapitelprüfung (23.11.2026)
- **G1 „else=0“ (Kurz überlegen):** Toleranz ±0,05 statt ±0,1, damit 22,4 (Zuschnitt D, „ohne gültige Angabe“ bleibt leer) nicht als richtig zählt. Eigene Rückmeldung für 22,4: „22,4 % ergibt sich, wenn ‚ohne gültige Angabe‘ leer bleibt. Mit else=0 kommt auch sie in Gruppe 0.“
- **Einleitung:** Der Satz zur Gewichtung steht im Text `known`, der Vorlesungs-Satz in `knownNote`; der Schild-Satz des Layouts („kennst du aus Sitzung …“) folgt so dem richtigen Text.
- **Bild `s5-mutate-a1`:** alte und neue Türme stehen jetzt nebeneinander (pe01 → misstrauen, pv01 → nichtwahl), dünne graue Linien verbinden je Zeile denselben Befragten. Statt zwei übereinanderliegender Kästen also zwei Paare; Alternativtext angepasst.
- **A2 Zuordnen (a2d1 bis a2d3):** alle drei Auswahlfelder tragen die Hilfezeile „Aus Schritt 2: row %, col %, total %.“.
- **Tote Hinweistexte** (a2a, a3a, a3e, a3f, a4a, a4d, a4e, g3-frage2; alle falschen Optionen haben eine eigene Rückmeldung) auf „Lies die Frage noch einmal.“ gekürzt; leeres `@media (max-width:900px){}` entfernt. Die Tabelle „Gruppen zuschneiden“ trägt `role="table"`, `row`, `rowheader`, `columnheader`, `cell`, damit `tr{display:grid}` bei ≤ 520 px die Tabellensemantik behält.
- **Auflösungsregel (alle Aufgaben):** „Deine Festlegung vorher war … Tatsächlich …“ erscheint erst, wenn keine Frage der Aufgabe mehr offen ist (`resolutionVisible` in `check.ts`).
- **Freie Karte:** `MapLink` zu `crosstab` am Ende von Grundlage 2 („Kreuztabelle mit Zeilen-, Spalten- und Zellenprozenten“). Der Begriff `recode` aus dem Plan fehlt in `concepts.ts`; ein Link zu ihm würde ins Leere führen und steht deshalb nicht im Kapitel (Entscheidung offen: Begriff in die Karte aufnehmen).
