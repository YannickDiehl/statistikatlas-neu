# Sitzung 3 „Erste Auszählung“: Inhaltsplan für das Kapitel

Stand: 23.11.2026. Teil B des Rollouts (`docs/entwicklung/plaene/2026-11-23-lernpfad-kapitel-rollout.md`, Task 3), nach dem Muster von Sitzung 4 (`prototyp/sitzung4.html`, umgesetzt in `src/chapter/s04/`). Die Sitzung hat im Seminar schon stattgefunden; das Kapitel dient zum Nacharbeiten und Wiederholen.

- **Daten:** ALLBUS 2023, ZA8831 v1.3.0, **ungewichtet** (Hinweis im Kapitel, Gewichtung in Sitzung 6). Nur Aggregate. Steine mit Einzelwerten sind konstruierte Beispiele („zum Beispiel …“).
- **Zahlen:** jede Zahl dieses Plans steht in `sitzung03-zahlen.R` (gleicher Ordner) und wird dort gegen die gedruckte Ausgabe von mariposa 0.7.4 geprüft; das Skript führt auch jede Codevorlage einmal aus und prüft, dass jede Vorlage wörtlich in diesem Plan steht. `Rscript sitzung03-zahlen.R` läuft ohne Fehler.
- **Dozentenentscheid:** Kein Filter-Code für fehlende Werte. `drop_na()` bleibt in Sitzung 4 neu. Fehlende Werte werden über die Ausgabe von `frequency()` verstanden (Total valid, Total missing, Raw % gegen Valid %, Missing-Codes).
- **Bausteine:** wie Sitzung 4 (`src/chapter/blocks/`, `src/chapter/workshop/`). Daten und Texte gehören in `src/chapter/s03/content.ts`, feste Zielwerte in `allbus.local.test.ts`.
- **Schreibweise in diesem Plan:** Texte in „…“ oder als Absatz sind Volltext fürs Kapitel. `code` bleibt im Kapitel Code. ⟦…⟧ markiert anzupassende Stellen in Vorlagen.

---

## 1 Kopf

**Stein:** 3. **Titel:** Erste Auszählung.

**Leitfrage (Begleitfigur):** „Wie viele sagen was – und wen zählst du mit, wenn du Prozent sagst?“

**Wegweiser (drei Kacheln):**
- „Vorweg: R lesen“ – „frequency() mit der Pipe, describe(), R als Taschenrechner“
- „Vier Themen“ – „je erst die Grundlage, dann die Aufgabe; im Seminar direkt zur Aufgabe springen“
- „Zum Schluss“ – „Überblick, Wichtigstes, Selbsttest, Skript“

**Was du nach dieser Sitzung kannst** (Lernziele, als Liste):
1. eine Häufigkeitstabelle lesen: wie oft jede Antwort vorkommt (absolute Häufigkeit, Spalte N), welcher Anteil das ist (relative Häufigkeit, Raw % und Valid %) und wie viel bis zu einer Stufe zusammenkommt (kumulierte Prozent, Cum. %) *(Verfahren)*
2. den häufigsten Wert (Modus) und die Mitte einer geordneten Antwortreihe (Median) aus der Tabelle ablesen, den Mittelwert mit `describe()` *(Verfahren)*
3. eine Prozentzahl so in einen Satz schreiben, dass klar ist, von wem sie handelt: von allen Befragten oder nur von denen, die geantwortet haben *(Interpretation)*
4. Mittelwert und Median vergleichen und sagen, welche Zahl eine schiefe Verteilung ehrlicher beschreibt *(Interpretation)*
5. fehlende Werte nach ihrem Grund unterscheiden (nie gefragt, nicht beantwortet, beim Erfassen verloren) und wissen, welche Mitte zu welchem Skalenniveau passt *(Voraussetzungen)*
6. `allbus %>% frequency(…)` und `allbus %>% describe(…)` ausführen, die Ausgabe lesen und R als Taschenrechner für eine eigene Prozentbasis nutzen *(Code lesen)*

**Hinweis „schon bekannt“ (grau):** „Schon bekannt und hier nur kurz erinnert: der Startblock, R als Taschenrechner und der erste Blick mit `frequency(allbus, …)` auf Codes, Wertelabels und die Spalte N (Sitzung 1); die Pipe mit einem Schritt wie `frauen <- allbus %>% filter(sex == 2)`, das Nachschlagen mit `codebook(allbus, …)`, die Bauplatte mit ihren Türmen, Steinen und Aufklebern, die Gründe für fehlende Werte (−9, −10, −11, −42 …) und dass Codes für Parteien nur Namen sind (Sitzung 2). Mittelwert und Median kennst du aus Methoden Ia. Solche Stellen tragen ein graues Schild „kennst du aus Sitzung …“ bzw. „kennst du aus Methoden Ia“.“

**So arbeitest du mit dieser Seite:** die vier Zeilen wie in Sitzung 4 (Genauer erklärt, Kurz überlegen, Code-Werkstatt, markierte Stellen), unverändert.

**Sprungknöpfe fürs Seminar:** „Im Seminar? Jedes Thema beginnt mit seiner Grundlage zum Vertiefen der Folien. Wer sie schon kann, springt direkt zur Aufgabe:“ Aufgabe 1, Aufgabe 2, Aufgabe 3, Aufgabe 4.

**Hinweis Gewichtung (einmal unter den Sprungknöpfen, klein):** „Alle Zahlen in diesem Kapitel sind ungewichtet, genau wie die Ausgabe deiner Vorlagen. Gewichtet ändern sie sich etwas; das ist Thema in Sitzung 6.“

---

## 2 Themen, Grundlagen, Aufgaben

| Thema | Grundlage (Variablen) | Aufgabe (Variablen) | Art | Zeit |
|---|---|---|---|---|
| 1 Die Häufigkeitstabelle | 1a Turm → Tabelle (Beispiel mit zwölf Steinen, la01), 1b Spalten von `frequency()` (la01), 1c Modus und Median aus Cum. % (la01) | A1 „Wie geht es der Wirtschaft in einem Jahr?“ (ep04; Taschenrechner) | **Pflicht** | G 15, A 13 Min. |
| 2 Fehlende Werte: Wer zählt mit? | 2a Gründe für eine Lücke (Codes, Beispiele dh04, id02), 2b Prozent wovon? (st01, 100 Steine) | A2 „Wahlabsicht: drei Prozentzahlen für dieselbe Partei“ (pv01; Taschenrechner) | **Pflicht** | G 12, A 15 Min. |
| 3 Die Mitte: Modus, Median, Mittelwert | 3a Mitte einer Reihe (Beispiel neun Haushalte), 3b Welche Mitte passt? (rd01, la01, dh04), 3c `describe()` lesen (dh04) | A3 „Wie lange dauert Arbeitslosigkeit?“ (dw19; Rückgriff auf ep04) | **Pflicht** | G 12, A 13 Min. |
| 4 Liegt der Durchschnitt in der Mitte? | 4 Cum. % und Mittelwert (dh04) | A4 „Wie viele liegen über dem Durchschnitt?“ (dw19; Taschenrechner) | Zusatz | G 5, A 8 Min. |
| Überblick | Eine Tabelle lesen, eine Mitte wählen (Entscheidungsbaum „Welche Mitte?“, Satzmuster) | – | – | 5 Min. |

Pflichtaufgaben zusammen etwa 41 Minuten (gemessen an einer langsamen Bearbeitung: Vorlage ausführen, Tabelle suchen, je Frage etwa eine Minute). Keine der Variablen kommt in Sitzung 4 vor (dort: ls01, mp05, dk11, vm18, age, eastwest, hs01, dw15, pa01, pa02a, vm20, pt03, xt10, mode); `eastwest` und `mode` erscheinen hier nicht.

---

## 3 Vorweg: R lesen

### Karte R1 „R lesen: Startblock und eine Zeile“ (Schilder: „Startblock und frequency(): kennst du aus Sitzung 1“, „Pipe: kennst du aus Sitzung 2“, „Code lesen“)

Text: „Den Startblock kennst du aus Sitzung 1: Er lädt die Werkzeuge und legt den ALLBUS unter dem Namen `allbus` ab. `allbus` ist der ganze Datensatz, im Bild eine Bauplatte: jede Variable ein Turm, jede Antwort ein Stein. In RStudio führst du ihn zu Beginn aus. In der Code-Werkstatt hier auf der Seite ist das schon erledigt.“

Vorlage `start` (Kopieren, ohne Ausführen-Knopf wie in Sitzung 4):

```r
# Pakete laden und Daten einlesen
library(tidyverse)
library(mariposa)

allbus <- read_spss("ZA8831_v1-3-0.sav")
```

Hilfezeile: „Rote Zeilen beim Laden, etwa „Attaching core tidyverse packages“, sind normal und kein Fehler. Öffne RStudio über dein Projekt. Findet R die Datei nicht, nimm wie in Sitzung 1 `allbus <- read_spss(file.choose())`.“

Text: „So liest du eine Zeile: von links nach rechts, die Pipe `%>%` sprichst du „und dann“.“

Zeilenbild (Bausteine wie in Sitzung 4, R1): `allbus` (Objekt) | `%>%` (und dann) | `frequency(` (Funktion: was passiert) | `la01` (Argument: womit) | `)`. Darunter: „Nimm allbus, und dann zähl aus, wie oft jede Antwort bei la01 vorkommt.“

Text: „In Sitzung 1 hast du `frequency(allbus, rh08b)` geschrieben: erst der Datensatz, dann die Variable. Mit der Pipe aus Sitzung 2 schreibst du dasselbe als `allbus %>% frequency(rh08b)`. Beides gibt genau dieselbe Tabelle. Ab jetzt steht der Datensatz vorn, wie bei `filter()` in Sitzung 2; ab Sitzung 4 hängst du so mehrere Schritte aneinander.“

Kurz gesagt: „Eine Funktion sagt, was passiert, ihr Argument sagt, womit. Die Pipe `%>%` setzt den Datensatz links in das erste Feld der Funktion rechts: `allbus %>% frequency(la01)` ist dasselbe wie `frequency(allbus, la01)`. Heute steht hinter der Pipe immer genau ein Schritt.“

Häufige Verwechslung: „`frequency(la01)` ohne `allbus %>%` davor: R weiß dann nicht, in welchem Datensatz la01 steht. Der Datensatz kommt immer zuerst.“

### Karte R2 „Drei Werkzeuge für heute“ (Schilder: „frequency() und Taschenrechner: kennst du aus Sitzung 1“, „describe(): neu heute“, „Code lesen“)

Text: „Heute brauchst du drei Werkzeuge. Zwei kennst du schon und lernst sie heute genauer kennen, eins ist neu. Führe jede Vorlage einmal aus und schau dir die Ausgabe an. Was die einzelnen Spalten bedeuten, lernst du in den Grundlagen.“

1. „`frequency()` zählt, wie oft jede Antwort vorkommt, und macht daraus eine Häufigkeitstabelle. In Sitzung 1 hast du darin Codes, Wertelabels und N gelesen; heute kommen die drei Prozentspalten dazu. Beispiel: Wie oft lesen die Befragten in ihrer Freizeit Bücher?“

```r
# Häufigkeitstabelle: Wie oft lesen die Befragten Bücher?
allbus %>%
  frequency(la01)
```

2. „Neu: `describe()` fasst eine Variable mit Zahlen in wenigen Kennzahlen zusammen, darunter Mittelwert und Median. Beispiel: Wie viele Personen leben im Haushalt der Befragten?“

```r
# Kennzahlen: Wie viele Personen leben im Haushalt?
allbus %>%
  describe(dh04)
```

3. „R als Taschenrechner kennst du aus Sitzung 1: `/` teilt, `*` multipliziert, `+` und `-` zählen zusammen und ziehen ab, Klammern rechnet R zuerst. Heute rechnest du damit eine Prozentzahl selbst aus.“

```r
# R als Taschenrechner: 1041 von 5223 gültigen Antworten in Prozent
1041 / 5223 * 100
```

Ausgabe dazu (zur Kontrolle im Text): `[1] 19.93107`.

Kurz gesagt: „`frequency()` zählt aus, `describe()` fasst zusammen, und mit `/`, `*`, `+`, `-` und Klammern rechnest du selbst.“

Genauer erklärt: „Wie R Zahlen schreibt“
- „R schreibt Kommazahlen mit Punkt: 19.93 heißt 19,93. In `describe()` stehen bei Mean, Median und den anderen Kennzahlen drei Nachkommastellen: 2.000 heißt 2, 26.000 heißt 26. N und Missing sind ganze Zahlen.“
- „Tausender schreibt R ohne Trennzeichen: 5223 heißt 5.223.“
- „Wenn du rechnest, schreibst du genauso: Komma nur mit Punkt (`39.84`), Tausender ohne Punkt (`5223`). Mit `1.041 / 5223 * 100` rechnet R „eins Komma null vier eins“ geteilt durch 5.223 und kommt auf 0.01993107, also fast null.“
- „Die Wertelabels stehen im ALLBUS in Großbuchstaben und ohne Umlaute, etwa TAEGLICH für „täglich“ oder WEISS NICHT.“
- „Breite Tabellen brechen in einer schmalen RStudio-Konsole um. Zieh das Konsolenfenster dann breiter.“
- „Mehr dazu im R-Workshop, Kapitel 7.4.1 (`frequency()`) und 7.4.2 (`describe()`).“

Häufige Verwechslung: „Deutsches Komma in R: `39,84 + 8,44` ergibt einen Fehler („Unerwartete(s) ','“). In R heißt es `39.84 + 8.44`.“

---

## 4 Thema 1: Die Häufigkeitstabelle

### Grundlage 1 „Die Häufigkeitstabelle“ (Kopf: „Grundlage zu Aufgabe 1“, Link „Schon klar? Direkt zu Aufgabe 1 ↓“)

Unterzeile: „Wie liest man eine Tabelle von `frequency()`, und wo stehen Modus und Median? Drei kurze Schritte, etwa 15 Minuten.“

#### Karte 1a „Vom Turm zur Tabelle: Steine zählen“ (Schilder: „Turm, Stein, Aufkleber: kennst du aus Sitzung 2“, „Spalte N: kennst du aus Sitzung 1“, „Im Bild“)

Beispiel zuerst: „In Sitzung 1 hast du in der Spalte N abgelesen, wie viele eine Antwort gegeben haben. Woher kommt diese Zahl? Der ALLBUS fragt, wie oft man in der Freizeit Bücher liest, mit fünf Antworten von „täglich“ bis „nie“. Hier siehst du den Turm la01 von zwölf Befragten, zum Beispiel. Jeder Stein ist eine Antwort, der Aufkleber sagt, was der Code bedeutet. Eine Person hat nichts angegeben: Ihr Stein ist leer, trägt aber einen Aufkleber mit dem Grund, KEINE ANGABE. Geh die drei Schritte durch.“

**Bild B1 `s3-turm-tabelle` (interaktiv, Schrittleiste mit drei Knöpfen „Schritt 1: Turm“, „Schritt 2: Stapel“, „Schritt 3: Tabelle“):**
- Bauweise wie `kap04.lstein` (Stein mit Wert und gelbem Aufkleber) und `kap04.kopf` (Name `la01`, Typ `<dbl+lbl>` grau darüber), Leinwand etwa 7,6 × 4,6.
- Oben links Notiz (grau, kursiv): „zum Beispiel zwölf Befragte“.
- **Schritt 1:** links ein Turm `la01` aus zwölf Steinen (blau, Typ numeric) in dieser Reihenfolge von oben: 4 SELTENER, 1 TAEGLICH, 3 MIND. 1X PRO MONAT, 4 SELTENER, 2 MIND. 1X PRO WOCHE, leer (gestrichelt) mit Aufkleber KEINE ANGABE und grauem Code −9 links daneben, 1 TAEGLICH, 4 SELTENER, 5 NIE, 2 MIND. 1X PRO WOCHE, 4 SELTENER, 1 TAEGLICH. Unter dem Turm eine Bauplatte.
- **Schritt 2:** rechts daneben fünf waagerechte Stapel, je eine Zeile pro Code (1 bis 5), die Steine liegen nebeneinander: Code 1 drei Steine, Code 2 zwei, Code 3 einer, Code 4 vier, Code 5 einer. Darunter, abgesetzt durch eine dünne graue Linie, eine sechste Zeile mit dem leeren Stein (−9 KEINE ANGABE). Der Turm links wird grau (seine Steine sind „umgezogen“).
- **Schritt 3:** rechts neben jedem Stapel erscheint eine Tabellenspalte „N“ mit 3, 2, 1, 4, 1 und unter der Linie 1; links die Spalten „Value“ (1 … 5, −9) und „Label“ (Aufkleber-Text). Eckige Klammer (wie `kap07.klammer`) rechts über den fünf oberen Zeilen: „Total valid 11“ (schwarz); über der Zeile unter der Linie: „Total missing 1“ (grau); über allen: „Total 12“.
- Farben: Steine Baukasten-Blau, Aufkleber gelb, leerer Stein gestrichelt, Klammern INK bzw. GRAY, keine weiteren Farben.

**Textfassung B1 (für Screenreader, je Schritt im `aria-live`-Bereich; als Ganzes auch unter dem Bild):** „Schritt 1: Ein Turm la01 mit zwölf Steinen, zum Beispiel zwölf Befragte. Elf Steine tragen einen Code: dreimal 1 TÄGLICH, zweimal 2 MINDESTENS EINMAL PRO WOCHE, einmal 3 MINDESTENS EINMAL PRO MONAT, viermal 4 SELTENER, einmal 5 NIE. Ein Stein ist leer und trägt den Aufkleber −9 KEINE ANGABE. Schritt 2: Gleiche Steine liegen jetzt auf einem Stapel nebeneinander, in der Reihenfolge der Codes: 3, 2, 1, 4 und 1 Steine. Der leere Stein liegt getrennt darunter. Schritt 3: Neben jedem Stapel steht seine Höhe als Zahl in der Spalte N. Die fünf Stapel zusammen sind 11 gültige Antworten (Total valid), der leere Stein ist 1 fehlende (Total missing), alle zusammen 12 (Total).“

Kurz gesagt: „Eine Häufigkeitstabelle zählt, wie oft jeder Wert vorkommt. Diese Zahl heißt absolute Häufigkeit, in R die Spalte **N**. Gleiche Steine kommen auf einen Stapel, und N ist die Höhe des Stapels. Steine mit einem Missing-Code zählt die Tabelle getrennt: unter „Total missing“.“

Genauer erklärt „Warum der leere Stein einen Aufkleber hat“: „Im ALLBUS fehlt keine Antwort einfach so. Jede Lücke hat einen Code mit Grund, etwa −9 KEINE ANGABE oder −11 TNZ: SPLIT. `read_spss()` macht daraus in R einen fehlenden Wert (NA), behält den Grund aber als Aufkleber. Darum kann `frequency()` dir unten in der Tabelle zeigen, warum wie viele Antworten fehlen. Mehr dazu in Grundlage 2.“

Häufige Verwechslung: „Die Spalte **Value** ist der Code, nicht die Anzahl. „4“ in der Spalte Value heißt SELTENER; wie viele das gesagt haben, steht in der Spalte N.“

#### Karte 1b „Die Spalten von `frequency()`“ (Schilder: „Value, Label, N: kennst du aus Sitzung 1“, „Prozentspalten: neu heute“, „Im Bild“)

Beispiel zuerst: „So sieht die echte Tabelle für alle 5.246 Befragten aus. Wähl eine Spalte und schau, was sie zählt.“

**Bild B2 `s3-spalten` (interaktive Tabelle, als echte HTML-Tabelle mit `<caption>`, kein SVG):** Die Ausgabe von `allbus %>% frequency(la01)` (Kopfzeile und Tabelle, Monospace), mit den Zahlen genau wie R sie druckt; die Überschrift „Frequency Analysis Results“ und die Trennlinien aus `+---+` lässt die HTML-Tabelle weg:

```
la01 (FREIZEIT: BUECHER LESEN)
# total N=5246 valid N=5223 mean=3.08 sd=1.42 skewness=-0.17

| Value | Label              |    N |  Raw % | Valid % | Cum. % |
|     1 | TAEGLICH           | 1041 |  19.84 |   19.93 |  19.93 |
|     2 | MIND. 1X PRO WOCHE |  973 |  18.55 |   18.63 |  38.56 |
|     3 | MIND. 1X PRO MONAT |  704 |  13.42 |   13.48 |  52.04 |
|     4 | SELTENER           | 1551 |  29.57 |   29.70 |  81.73 |
|     5 | NIE                |  954 |  18.19 |   18.27 | 100.00 |
| Total valid                | 5223 |  99.56 |  100.00 |        |
|   -42 | DATENFEHLER: MFN   |    4 |   0.08 |         |        |
|    -9 | KEINE ANGABE       |   19 |   0.36 |         |        |
| Total missing              |   23 |   0.44 |         |        |
| Total                      | 5246 | 100.00 |         |        |
```

Über der Tabelle vier Knöpfe (Umschalter, `aria-pressed`): „N“, „Raw %“, „Valid %“, „Cum. %“. Zustand ohne Auswahl: keine Hervorhebung, Text „Wähl eine Spalte.“ Bei Auswahl wird die Spalte orange umrandet, die zugehörigen Zellen hellorange hinterlegt, und darunter erscheint (in `aria-live`):
- **N:** „**N** ist die absolute Häufigkeit: wie viele Befragte diese Antwort gegeben haben. 1.551 Befragte lesen seltener als einmal im Monat Bücher. Unter der Linie stehen die fehlenden Antworten mit ihrem Grund: 4 Datenfehler, 19 ohne Angabe.“ Hervorgehoben: alle Zellen der Spalte N.
- **Raw %:** „**Raw %** teilt durch alle 5.246 Befragten, auch durch die 23 ohne gültige Antwort. Darum hat auch die Lücke eine Prozentzahl, und erst alle Zeilen zusammen ergeben 100. 19,84 % aller Befragten lesen täglich.“ Hervorgehoben: Spalte Raw % einschließlich der Missing-Zeilen und „Total 100.00“.
- **Valid %:** „**Valid %** teilt nur durch die 5.223 gültigen Antworten (Total valid). Fehlende Werte zählen nicht mit. 19,93 % derer, die geantwortet haben, lesen täglich.“ Hervorgehoben: Spalte Valid % der fünf gültigen Zeilen und „Total valid 100.00“.
- **Cum. %:** „**Cum. %** zählt die Valid % von oben nach unten zusammen. In der Zeile MIND. 1X PRO WOCHE steht 38.56: 19,93 + 18,63. So viel Prozent lesen mindestens einmal pro Woche.“ Hervorgehoben: Spalte Cum. %, zusätzlich die beiden Valid-%-Zellen 19.93 und 18.63 mit gestrichelter Umrandung.

**Textfassung B2:** Die Tabelle selbst ist die Textfassung (echte `<table>` mit Spaltenköpfen `scope="col"`, Beschriftung „Ausgabe von frequency(la01)“). Die Erklärungen stehen zusätzlich vollständig in einem zugeklappten `details` „Alle vier Spalten erklärt“ unter der Tabelle.

**Formel lesen lernen (unter der Tabelle, Bild B2b `s3-formel-prozent`, Formel als Bausteine wie die Formel in Sitzung 4, 1b):** Bruch aus zwei Bausteinen „Steine im Stapel“ (oben) und „Steine in der Basis“ (unten), daneben „× 100 = Prozent“. Darunter zwei Zeilen mit eingesetzten Zahlen:
- „Valid %: 1.041 Steine im Stapel TAEGLICH, geteilt durch 5.223 gültige Steine, mal 100 = 19,93“
- „Raw %: 1.041 geteilt durch alle 5.246 Steine, mal 100 = 19,84“
Textfassung B2b: „Prozent gleich Steine im Stapel geteilt durch Steine in der Basis, mal 100. Für TAEGLICH mit der Basis 5.223 gültige Antworten: 1.041 geteilt durch 5.223 mal 100 ergibt 19,93, das ist Valid %. Mit der Basis 5.246 alle Befragten ergibt es 19,84, das ist Raw %.“

**Kurz überlegen** (Zahlenfeld, Prüfen-Knopf): „Und von unten: Wie viel Prozent der gültigen Antworten lesen seltener als einmal im Monat oder nie Bücher?“ Hilfezeile: „Eine Kommazahl reicht, zum Beispiel 12,5.“
- Ziel 47,97, Toleranz 0,1 (nimmt auch 47,96 an).
- richtig: „Rund 48 %: 29,70 + 18,27 = 47,97. Oder von oben: 100 minus Cum. % bei MIND. 1X PRO MONAT, 100 − 52,04 = 47,96. Der kleine Unterschied kommt vom Runden der Prozentzahlen.“
- falsch: „Gefragt sind die beiden untersten Zeilen, SELTENER und NIE. Zähl ihre Valid % zusammen, oder zieh Cum. % der Zeile darüber (MIND. 1X PRO MONAT) von 100 ab.“
- Sonderfall 18,27 (± 0,1): „Das ist nur NIE. Wer seltener als einmal im Monat liest, gehört auch dazu: Zähl SELTENER dazu.“
- Sonderfall 81,73 (± 0,1): „Das ist Cum. % bei SELTENER: alle von „täglich“ bis „seltener“. Gefragt sind nur die beiden untersten Zeilen.“
- Sonderfall 47,76 (± 0,1, Raw % 29,57 + 18,19): „Das sind Raw %, also von allen 5.246. Gefragt ist der Anteil der gültigen Antworten (Valid %).“

Kurz gesagt: „Die Häufigkeitstabelle zeigt für jeden Wert die **absolute Häufigkeit** (N, wie viele) und die **relative Häufigkeit** (Prozent, welcher Anteil). Raw % rechnet mit allen Befragten, Valid % nur mit denen, die gültig geantwortet haben. **Kumulierte Prozent** (Cum. %) zählen die Valid % von oben nach unten zusammen: „bis einschließlich dieser Zeile“.“

Genauer erklärt „Die Kopfzeile und die Summenzeilen“:
- „Die Kopfzeile `# total N=5246 valid N=5223` nennt dieselben Zahlen wie Total und Total valid. Dahinter rechnet R Mittelwert (mean), Standardabweichung (sd) und Schiefe (skewness) mit den Codes aus, ob das sinnvoll ist oder nicht. Wann es sinnvoll ist, klärt Grundlage 3.“
- „Raw % ergibt über alle Zeilen 100, Valid % nur über die gültigen. Darum steht bei den fehlenden Werten keine Valid-%-Zahl.“
- „Cum. % ergibt nur Sinn, wenn die Codes eine Reihenfolge haben, wie hier von „täglich“ bis „nie“. Bei Parteien oder Konfessionen hängt die Summe davon ab, in welcher Reihenfolge die Codes zufällig stehen.“
- „Die Prozentzahlen sind auf zwei Stellen gerundet. Zählst du gerundete Zahlen zusammen, kann am Ende 99,99 oder 100,01 herauskommen.“
- „Die Zahlen sind ungewichtet.“

Häufige Verwechslung: „Cum. % ist nicht der Anteil einer einzelnen Antwort. 52,04 in der Zeile MIND. 1X PRO MONAT heißt: 52,04 % lesen mindestens einmal im Monat (täglich, wöchentlich oder monatlich), nicht: 52,04 % lesen genau einmal im Monat. Das sind 13,48 %.“

Link: „→ In der freien Karte: Häufigkeiten“ (Begriff `frequency`).

#### Karte 1c „Modus und Median aus der Tabelle“ (Schilder: „Modus und Median: kennst du aus Methoden Ia“, „Im Bild“)

Beispiel zuerst: „Welche Antwort ist am häufigsten, und was antwortet die Person in der Mitte? Stell dir vor, alle 5.223 gültigen Antworten liegen der Reihe nach in einer langen Reihe, von „täglich“ bis „nie“. Das Bild zeigt diese Reihe auf 100 % gestaucht.“

**Bild B3 `s3-streifen-la01` (interaktiv: erst ohne Markierung, Knopf „Auflösen“ nach der Frage):**
- Ein waagerechter Streifen über die volle Breite, Achse darunter von 0 bis 100 % (Striche bei 0, 25, 50, 75, 100). Fünf Abschnitte, Breite = Valid %: TAEGLICH 19,93; MIND. 1X PRO WOCHE 18,63; MIND. 1X PRO MONAT 13,48; SELTENER 29,70; NIE 18,27. Jeder Abschnitt in Baukasten-Steinoptik (Noppen oben) in abgestuftem Blau von hell (täglich) nach dunkel (nie), mit weißer Beschriftung des Labels und der Valid % (zweizeilig; bei schmalen Abschnitten Beschriftung darüber mit Linie). Über den Abschnittsgrenzen klein die Cum. %: 19,93 | 38,56 | 52,04 | 81,73 | 100.
- Vor dem Auflösen gibt es keine Markierung.
- Nach „Auflösen“: senkrechte orange gestrichelte Linie bei 50 % mit Beschriftung „Mitte: 50 %“, der Abschnitt MIND. 1X PRO MONAT erhält einen orangen Rahmen und das Schild „Median“; SELTENER erhält das Fähnchen „Modus“.

**Textfassung B3:** „Ein Streifen von 0 bis 100 Prozent, in fünf Abschnitte geteilt, so breit wie die Valid %: täglich 19,93, mindestens einmal pro Woche 18,63, mindestens einmal pro Monat 13,48, seltener 29,70, nie 18,27. Die Grenzen liegen bei 19,93, 38,56, 52,04 und 81,73 Prozent.“ Nach dem Auflösen zusätzlich: „Die Mitte bei 50 Prozent liegt im Abschnitt mindestens einmal pro Monat (zwischen 38,56 und 52,04): Das ist der Median. Der breiteste Abschnitt ist seltener: Das ist der Modus.“

**Kurz überlegen** (Auswahl, Knopf „Auflösen“): „Die Person genau in der Mitte der Reihe: Wie oft liest sie Bücher?“ Optionen: „täglich“, „mindestens einmal pro Woche“, „mindestens einmal pro Monat“, „seltener“, „nie“.
- Ziel: „mindestens einmal pro Monat“.
- Rückmeldung richtig: „Genau. Bis „pro Woche“ kommen erst 38,56 % zusammen, bis „pro Monat“ sind es 52,04 %. Die 50-%-Marke liegt also in der Stufe „mindestens einmal pro Monat“: Das ist der Median.“
- Rückmeldung „seltener“: „„Seltener“ ist die häufigste Antwort, der Modus. Gefragt ist die Person in der Mitte: Geh in Cum. % von oben, bis du über 50 kommst.“
- Rückmeldung sonst: „Geh in der Spalte Cum. % von oben nach unten. Die erste Zeile, in der du 50 erreichst oder überschreitest, ist die Stufe der mittleren Person.“

Kurz gesagt: „Der **Modus** ist der häufigste Wert: die Zeile mit dem größten N. Der **Median** ist der Wert der Person in der Mitte, wenn alle gültigen Antworten der Reihe nach stehen. In der Tabelle ist das die erste Zeile, in der Cum. % die 50 erreicht.“

Genauer erklärt „Warum der Median eine Reihenfolge braucht“:
- „Der Median setzt voraus, dass die Antworten eine Reihenfolge haben (ordinal oder metrisch). „Täglich“ liest mehr als „pro Woche“, das ergibt eine Reihe. Bei Parteien gibt es keine Reihe und damit keine Mitte, nur einen Modus.“
- „Bei la01 liegt der Median bei „mindestens einmal pro Monat“, der Modus bei „seltener“. Beides stimmt: Die größte Gruppe liest selten, aber gut die Hälfte (52,04 %) liest mindestens einmal im Monat.“
- „Trifft Cum. % genau die 50, liegt die Mitte zwischen dieser und der nächsten Stufe. Bei Tausenden Befragten kommt das kaum vor.“
- „Die Kopfzeile nennt mean=3.08. Bei Häufigkeitsstufen wie „täglich“ bis „nie“ sind die Abstände nicht gleich groß; ein Mittelwert von 3,08 lässt sich deshalb nur mit Vorsicht deuten. Mehr in Grundlage 3.“

Häufige Verwechslung: „Modus und Median verwechseln. Der höchste Stapel muss nicht in der Mitte stehen: Hier ist „seltener“ am häufigsten, die Mitte liegt bei „mindestens einmal pro Monat“.“

Link: „→ In der freien Karte: Median“ (Begriff `median`).

### Aufgabe 1 „Wie geht es der Wirtschaft in einem Jahr?“ (Pflicht)

Link „↑ Grundlage 1 nachlesen“.

Leitfrage: „Erwarten die Befragten, dass es der Wirtschaft in Deutschland in einem Jahr besser oder schlechter geht?“

Ziel: „Am Ende kannst du aus einer Häufigkeitstabelle ablesen, wie viele gültig geantwortet haben und wie viele Antworten fehlen, welche Erwartung am häufigsten ist (Modus) und wo die Mitte liegt (Median), und du hast einen Anteil mit R selbst zusammengezählt.“

Grundlage: „Grundlage 1, Die Häufigkeitstabelle“.

Einleitung: „Der ALLBUS 2023 fragt, wie die wirtschaftliche Lage in Deutschland in einem Jahr sein wird, verglichen mit heute. Antworten von 1 „wesentlich besser“ bis 5 „wesentlich schlechter“. Die Variable heißt ep04.“

**Erst festlegen** (Auswahl, „Tipp abgeben“; wird beim Prüfen zitiert): „Erwarten mehr Befragte eine bessere oder eine schlechtere Wirtschaftslage?“ Optionen: „mehr erwarten eine bessere“, „etwa gleich viele“, „mehr erwarten eine schlechtere“. Rückmeldung beim Festlegen: „Festgelegt: … Die Auflösung bekommst du, wenn du am Ende der Aufgabe deine Antworten prüfst.“

Text: „Arbeite in der Code-Werkstatt direkt hier oder in RStudio. In RStudio führst du vorher den Startblock aus „R lesen“ aus.“

**Schritte:**

1. „Führe die Vorlage aus. Sie zählt aus, wie oft jede Erwartung vorkommt.“ Schild „frequency(): kennst du aus Sitzung 1“.

```r
# Häufigkeitstabelle: Wirtschaftslage in Deutschland in einem Jahr
allbus %>%
  frequency(ep04)
```

2. „Lies die Tabelle von unten: Wie viele haben gültig geantwortet (Total valid), wie viele Antworten fehlen (Total missing), und aus welchen Gründen?“

3. „Such den Modus (die Zeile mit dem größten N) und den Median (die erste Zeile, in der Cum. % die 50 erreicht).“

4. „Wie viele erwarten eine schlechtere Lage? Dafür zählst du zwei Zeilen zusammen. Die Vorlage zeigt, wie das geht: Sie zählt die Valid % der beiden „besser“-Zeilen zusammen und kommt auf 16.33, genau die Zahl in Cum. % bei ETWAS BESSER. Tausch die beiden markierten Zahlen gegen die Valid % von ETWAS SCHLECHTER und WESENTL. SCHLECHTER und führe die Vorlage erneut aus.“ Schild „R als Taschenrechner: kennst du aus Sitzung 1“. Hilfezeile: „Kommazahlen schreibst du in R mit Punkt, etwa 15.67.“

```r
# Zwei Zeilen zusammenzählen (Valid %): hier „wesentlich besser“ und „etwas besser“
⟦0.66⟧ + ⟦15.67⟧
```

5. „Deuten: Welcher Satz beschreibt die Tabelle richtig? (Frage a1f unten)“

**Weiterdenken in der Probier-Werkstatt (für die Aufgabe nicht nötig),** zugeklappt: „Für die Aufgabe reichen die Vorlagen oben. Hier ist Platz für eigene Fragen. Eine Idee: Sehen die Befragten ihre eigene wirtschaftliche Lage in einem Jahr ähnlich? Die Probier-Werkstatt startet mit einem Vorschlag.“

```r
# Eine Idee: die eigene wirtschaftliche Lage in einem Jahr
allbus %>%
  frequency(ep06)
```

(Zur Information für den Plan, nicht im Kapitel: Bei ep06 erwarten 60,68 % „gleichbleibend“, 20,03 % besser, 19,28 % schlechter.)

**Antwortfragen** („Antworten prüfen“, Rückmeldung je Frage mit ✓/✗ und Text, am Ende „Deine Festlegung vorher war: …“):

| id | Art | Label | Optionen | Ziel | Toleranz | Text richtig | Text falsch / Hinweis | Hilfezeile |
|---|---|---|---|---|---|---|---|---|
| a1a | number | Wie viele Befragte haben eine gültige Antwort gegeben? | – | 5188 | 0 | 5.188 gültige Antworten (Total valid). | Lies die Zeile „Total valid“, Spalte N. Gemeint sind nur die Antworten 1 bis 5. | Aus `frequency(ep04)`, Zeile „Total valid“. |
| a1b | number | Wie viele Antworten fehlen? | – | 58 | 0 | 58: 37 ohne Angabe, 16 „weiß nicht“, 5 Datenfehler. | Lies die Zeile „Total missing“, Spalte N. | – |
| a1c | choice | Welche Erwartung ist am häufigsten (Modus)? | wb: wesentlich besser; eb: etwas besser; gl: gleichbleibend; es: etwas schlechter; ws: wesentlich schlechter | es | – | „etwas schlechter“ mit 2.067 Antworten, 39,84 % der gültigen. | Der Modus ist die Zeile mit dem größten N, nicht die mittlere Zeile der Tabelle. | – |
| a1d | choice | In welcher Stufe liegt der Median? | wie a1c | gl | – | „gleichbleibend“: Dort erreicht Cum. % zum ersten Mal die 50 (51,72). Die Person in der Mitte erwartet also keine Veränderung, obwohl „etwas schlechter“ häufiger genannt wird. | bei „es“: Das ist der Modus. Der Median ist die erste Stufe, bei der Cum. % die 50 erreicht. Sonst: Geh in der Spalte Cum. % von oben nach unten: Wo kommst du zum ersten Mal auf 50 oder mehr? | – |
| a1e | number | Wie viel Prozent der gültigen Antworten erwarten eine schlechtere Lage (etwas oder wesentlich schlechter)? | – | 48.28 | 0.1 | 48,28 %: 39,84 + 8,44. Oder: 100 minus 51,72. | Tausch in der Vorlage aus Schritt 4 die markierten Zahlen gegen die Valid % von ETWAS SCHLECHTER und WESENTL. SCHLECHTER. Sonderfall 47,75 (± 0,1): Das sind Raw %, also von allen 5.246. Gefragt ist der Anteil der gültigen Antworten (Valid %). Sonderfall 16,33: Das sind die „besser“-Zeilen aus der Vorlage; tausch die beiden markierten Zahlen. | Prozent der gültigen Antworten, eine Kommazahl reicht. |
| a1f | choice | Welcher Satz beschreibt die Tabelle richtig? | meisten: „Die meisten Befragten erwarten eine schlechtere Wirtschaftslage.“; knapp: „Knapp die Hälfte der Befragten mit gültiger Antwort (48 %) erwartet eine schlechtere Lage, nur 16 % eine bessere.“; mittel: „Im Mittel erwarten die Befragten eine etwas schlechtere Lage.“ | knapp | – | Genau. 48 % sind knapp die Hälfte, nicht „die meisten“. Und die Mitte (Median) liegt bei „gleichbleibend“. | bei „meisten“: „Die meisten“ hieße mehr als die Hälfte. Schlechter erwarten 48,28 %, also knapp weniger als die Hälfte. Bei „mittel“: Die Person in der Mitte (Median) erwartet „gleichbleibend“; „etwas schlechter“ ist nur die häufigste Antwort. | – |

**Hilfe, Stufe 1: Denkanstoß:** „Die Tabelle hat zwei Teile: oben die gültigen Antworten 1 bis 5, unten die fehlenden mit ihrem Grund. Der Modus ist der höchste Stapel, der Median die Stufe der Person in der Mitte. Für „schlechter“ zählst du zwei Stufen zusammen.“

**Hilfe, Stufe 2: Wo schaue ich?:** „Alles steht in der Ausgabe von `allbus %>% frequency(ep04)`. Total valid und Total missing in der Spalte N. Den Modus findest du an der größten Zahl in N, den Median in Cum. %. Zum Zusammenzählen nimmst du Valid %, nicht Raw %.“

**Hilfe, Stufe 3: Lösung:** „5.188 gültige Antworten, 58 fehlen (37 ohne Angabe, 16 „weiß nicht“, 5 Datenfehler). Modus: „etwas schlechter“ (2.067, 39,84 %). Median: „gleichbleibend“ (Cum. % 51,72). Schlechter: `39.84 + 8.44` ergibt 48.28, also 48,28 %; besser 16,33 %. Richtig ist der Satz „Knapp die Hälfte der Befragten mit gültiger Antwort (48 %) erwartet eine schlechtere Lage, nur 16 % eine bessere.““

**Ohne Grafik lösbar:** „Diese Aufgabe hat keine Grafik. Alle Zahlen stehen in der Ausgabe von `allbus %>% frequency(ep04)`.“

**Fürs Plenum:** „Für Deutschland erwartet fast die Hälfte eine schlechtere Lage. Wie ist das für die eigene Lage? Schau in die Probier-Werkstatt (ep06) und bring eine Vermutung mit, woran der Unterschied liegen könnte.“

---

## 5 Thema 2: Fehlende Werte: Wer zählt mit?

### Grundlage 2 „Fehlende Werte: Wer zählt mit?“ (Kopf: „Grundlage zu Aufgabe 2“, „Schon klar? Direkt zu Aufgabe 2 ↓“)

Unterzeile: „Warum fehlen Antworten, und wovon ist eine Prozentzahl ein Anteil? Zwei Schritte, etwa 12 Minuten.“

#### Karte 2a „Warum eine Antwort fehlt“ (Schilder: „Gründe für fehlende Werte: kennst du aus Sitzung 2“, „Zuordnen“)

Beispiel zuerst: „Aus Sitzung 2 weißt du: Im ALLBUS steht hinter jeder Lücke ein negativer Code mit einem Grund. Zur Erinnerung eine kurze Übung mit den sieben Codes, die dir in diesem Kapitel begegnen. Fünf kennst du schon, −7 VERWEIGERT und −41 DATENFEHLER sind neu, aber ihre Namen verraten viel. Sortier sie: Wo entsteht die Lücke? Das brauchst du gleich, um zu entscheiden, wen du beim Prozentrechnen mitzählst.“

**Bild/Interaktion B4 `s3-regale` (Zuordnen):** Drei Regale nebeneinander (Karten mit Titel und Unterzeile):
- „1 Studiendesign“ – „Die Frage kam nie bei der Person an.“
- „2 Befragte“ – „Die Person hat so geantwortet oder nicht geantwortet.“
- „3 Erfassung“ – „Die Lücke entstand beim Ausfüllen oder Abtippen.“

Darüber sieben Code-Steine (leere, gestrichelte Steine mit gelbem Aufkleber, Code grau davor): −11 TNZ: SPLIT, −10 TNZ: FILTER, −9 KEINE ANGABE, −8 WEISS NICHT, −7 VERWEIGERT, −42 DATENFEHLER: MFN, −41 DATENFEHLER. Bedienung barrierefrei: je Code-Stein eine Auswahl (`select`) mit den drei Regalen; Knopf „Prüfen“. Richtige Steine wandern ins Regal (visuell), Rückmeldung je Stein in `aria-live`:
- −11 TNZ: SPLIT → 1. „Richtig. TNZ heißt „trifft nicht zu“. Der ALLBUS hat zwei Fragebogenversionen; wer die andere Version hatte, hat die Frage nie gesehen.“ Falsch: „Bei einem Split bekommt nur ein Teil der Befragten die Frage. Die Person konnte gar nicht antworten.“
- −10 TNZ: FILTER → 1. „Richtig. Eine Filterfrage leitet die Person an der Frage vorbei, etwa Fragen zum Beruf, wenn jemand nicht berufstätig ist.“ Falsch: „Bei einem Filter wird die Frage übersprungen, weil sie nicht passt. Die Person konnte gar nicht antworten.“
- −9 KEINE ANGABE → 2. „Richtig. Die Frage wurde gestellt, aber nicht beantwortet.“ Falsch: „Die Person hatte die Frage, hat aber nichts angegeben.“
- −8 WEISS NICHT → 2. „Richtig. „Weiß nicht“ ist eine Antwort der Person, nur keine gültige im Sinne der Skala.“ Falsch: „„Weiß nicht“ hat die Person selbst gesagt oder angekreuzt.“
- −7 VERWEIGERT → 2. „Richtig. Die Person wollte nicht antworten.“ Falsch: „Verweigern ist eine Entscheidung der Person.“
- −42 DATENFEHLER: MFN → 3. „Richtig. MFN heißt Mehrfachnennung: zwei Kreuze, wo nur eins erlaubt ist, wie beim Bogen mit zwei Kreuzen in Sitzung 2.“ Falsch: „Zwei Kreuze auf dem Papierbogen: Die Antwort lässt sich beim Erfassen nicht eindeutig ablesen.“
- −41 DATENFEHLER → 3. „Richtig. Ein Fehler in den Daten, der beim Erfassen oder Prüfen auffiel.“ Falsch: „Ein Datenfehler entsteht nicht bei der Person, sondern in den Daten.“
- Alle richtig: „Alle sieben richtig sortiert.“ Sonst: „… von 7 richtig. Unter jedem Stein steht, worauf du achten kannst.“

**Textfassung B4:** „Drei Regale: 1 Studiendesign, die Frage kam nie bei der Person an. 2 Befragte, die Person hat so geantwortet oder nicht geantwortet. 3 Erfassung, die Lücke entstand beim Ausfüllen oder Abtippen. Dazu sieben Missing-Codes zum Zuordnen, je mit einer Auswahlliste.“ Nach dem Prüfen: „Richtig ist: −11 und −10 ins Regal Studiendesign, −9, −8 und −7 ins Regal Befragte, −42 und −41 ins Regal Erfassung.“

Text unter dem Bild: „Dazu kommen Codes, die zu einer bestimmten Frage gehören, etwa −6 KENNE ICH NICHT (Sitzung 1 und 2). −50 heißt bei der Wahlabsicht NICHT WAHLBERECHTIGT, bei der Schichteinstufung KEINER DER SCHICHTEN (15 Befragte). −32 NICHT GENERIERBAR steht bei Variablen, die der ALLBUS aus anderen Angaben berechnet, etwa die Zahl der Personen im Haushalt (102 Befragte). Was ein Code bei einer Variable heißt, steht im Codebuch und unten in der Tabelle von `frequency()`.“

Kurz gesagt: „**Fehlende Werte** (Fachbegriff auch Missing) sind Antworten, die nicht in die Auswertung eingehen. Im ALLBUS trägt jede einen Code mit Grund: nie gefragt (Studiendesign), nicht beantwortet (Befragte) oder beim Erfassen verloren. `frequency()` zeigt sie unter der Linie mit Grund und Anzahl und zählt sie zusammen unter „Total missing“.“

Genauer erklärt „Was R aus den Codes macht“:
- „Wie in Sitzung 2: `read_spss()` aus mariposa liest jeden Missing-Code als fehlenden Wert (NA), behält aber den Code und sein Wertelabel als Aufkleber. Deshalb kann `frequency()` die Gründe getrennt zählen, während `describe()` alle zusammen unter „Missing“ meldet.“
- „Für Mittelwert und Prozent zählen fehlende Werte nicht mit. Das ist meistens richtig. Aber nicht jede Lücke ist gleich: Wer nie gefragt wurde, hat keine Meinung verweigert. Und „weiß nicht“ kann selbst eine Aussage sein, etwa bei einer Wahlabsicht.“
- „Fehlende Werte ausdrücklich weglassen, etwa für eine Grafik, lernst du in Sitzung 4.“
- „Mehr dazu im R-Workshop, Kapitel 4.8.“

Häufige Verwechslung: „Fehlend heißt nicht „hat die Antwort verweigert“. Bei der Frage nach dem Vertrauen zu Mitmenschen (st01) fehlen 1.686 Antworten, aber 1.647 davon tragen −11 TNZ: SPLIT: Diese Menschen wurden nie gefragt.“

Link: „→ In der freien Karte: Fehlende Werte“ (Begriff `missing`).

#### Karte 2b „Prozent wovon?“ (Schilder: „Im Bild“, „Kurz überlegen“)

Beispiel zuerst: „„Kann man den meisten Menschen vertrauen, oder muss man im Umgang mit anderen vorsichtig sein?“ Antworten: man kann trauen, man muss vorsichtig sein, kommt darauf an. Diese Frage (st01) kennst du vom Bogen in Sitzung 2. Wie viele sagen „kommt darauf an“? Das hängt davon ab, wen du mitzählst.“

**Bild B5 `s3-hundert-steine` (interaktiv, Umschalter mit zwei Knöpfen „Basis: alle 5.246 Befragten“ und „Basis: 3.560 gültige Antworten“, `aria-pressed`):**
- Raster aus 10 × 10 Steinen (Draufsicht, runde Noppe), jeder Stein steht für 1 %. Verteilung nach größten Resten.
- Farben: „man kann trauen“ grün (GREEN), „muss vorsichtig sein“ orange (ORANGE), „kommt darauf an“ dunkelblau (INK oder Baukasten-Blau dunkel), „fehlt“ leerer gestrichelter Stein (grau gestrichelt, kein Füllton). Kontrast ≥ 3:1 zum Hintergrund; zusätzlich Muster in der Legende nicht nötig, weil die Gruppen als zusammenhängende Blöcke in fester Reihenfolge liegen (zeilenweise: trauen, vorsichtig, darauf an, fehlt).
- **Zustand „alle“:** 17 grün, 23 orange, 28 dunkelblau, 32 leer. Legende rechts: „Basis: alle 5.246“, „kann trauen 16,5 %“, „vorsichtig sein 23,4 %“, „kommt darauf an 27,9 %“, „fehlt 32,1 %“, groß: „kommt darauf an: 28 %“.
- **Zustand „gültig“:** 24 grün, 35 orange, 41 dunkelblau, keine leeren. Legende: „Basis: 3.560 gültige“, „kann trauen 24,3 %“, „vorsichtig sein 34,4 %“, „kommt darauf an 41,1 %“, groß: „kommt darauf an: 41 %“.
- Fußzeile klein: „„Sonstiges“ (7 Personen, unter 1 %) bekommt keinen eigenen Stein. ALLBUS 2023, ungewichtet.“
- Startzustand: „alle“.

**Textfassung B5** (wechselt mit dem Zustand, `aria-live`): Zustand alle: „Hundert Steine, jeder steht für ein Prozent aller 5.246 Befragten. 17 Steine man kann trauen, 23 muss vorsichtig sein, 28 kommt darauf an, 32 Steine sind leer: Hier fehlt die Antwort, meist weil die Frage nie gestellt wurde.“ Zustand gültig: „Hundert Steine, jeder steht für ein Prozent der 3.560 gültigen Antworten. 24 Steine man kann trauen, 35 muss vorsichtig sein, 41 kommt darauf an. Leere Steine gibt es nicht mehr.“

Text unter dem Bild: „Niemand hat seine Antwort geändert. Nur die Basis ist eine andere: einmal alle Befragten, einmal nur die, die gültig geantwortet haben. Die Tabelle von `frequency(st01)` zeigt beides nebeneinander: Raw % 27.89 und Valid % 41.10.“

**Kurz überlegen** (Auswahl, Knopf „Auflösen“): „Eine Zeitung will schreiben, wie viele bei st01 „kommt darauf an“ sagen. Welcher Satz ist am ehrlichsten?“ Optionen: „28 % der Befragten sagen: kommt darauf an.“, „41 % der Befragten, die die Frage beantwortet haben, sagen: kommt darauf an.“, „Beide Zahlen sind falsch gerechnet; richtig wäre ein Wert dazwischen.“
- Ziel: der zweite Satz. Rückmeldung je Wahl:
  - „28 % …“: „Richtig gerechnet, aber irreführend: 28 % aller Befragten schließt die 1.647 ein, die die Frage nie bekommen haben. Ein knappes Drittel der Basis konnte gar nicht „kommt darauf an“ sagen.“
  - „41 % … die die Frage beantwortet haben …“: „Genau. Valid % mit Basis: Der Zusatz sagt, für wen die Zahl gilt. Ohne ihn klänge 41 % so, als gälte die Zahl für alle Befragten.“
  - „Beide falsch gerechnet“: „Beide sind richtig gerechnet: 1.463 geteilt durch 5.246 und 1.463 geteilt durch 3.560. Entscheidend ist, was der Satz behauptet.“
  - Nach jeder Wahl zusätzlich: „Am ehrlichsten: Valid % mit Basis nennen, also „41 % derer, die geantwortet haben (n = 3.560)“.“

Kurz gesagt: „Jede Prozentzahl hat eine **Prozentbasis**: die Gruppe, durch die geteilt wird. Raw % teilt durch alle Befragten, Valid % nur durch die gültigen Antworten. Wenn du eine Prozentzahl nennst, sag dazu, wovon.“

Genauer erklärt „Eine eigene Basis rechnen“:
- Bild B6 `s3-basis-formel` (Formel als Bausteine): „Steine im Stapel“ (1.463, dunkelblau) geteilt durch drei mögliche Basen untereinander, je mal 100: „alle 5.246 → 27,89 (Raw %)“, „gültige 3.560 → 41,10 (Valid %)“, „gültige plus „weiß nicht“ 3.560 + 5 = 3.565 → 41,04 (eigene Basis)“. Textfassung B6: „Dieselben 1.463 Antworten „kommt darauf an“, geteilt durch drei verschiedene Basen, jeweils mal 100. Durch alle 5.246 Befragten: 27,89 Prozent, das ist Raw %. Durch die 3.560 gültigen: 41,10 Prozent, das ist Valid %. Durch die gültigen plus die 5 „weiß nicht“, zusammen 3.565: 41,04 Prozent, eine eigene Basis.“
- „Manchmal passt keine der beiden Spalten. Soll „weiß nicht“ mitzählen, weil es eine Aussage ist, rechnest du selbst: `1463 / (3560 + 5) * 100`. Die Klammer sorgt dafür, dass R erst die Basis zusammenzählt und dann teilt.“
- „Bei st01 macht das kaum etwas aus, weil nur 5 Befragte „weiß nicht“ sagen. In Aufgabe 2 ist das anders.“

Häufige Verwechslung: „Valid % heißt nicht „Prozent aller Befragten“. Valid % gilt nur für die, die gültig geantwortet haben. Wer fehlt, zählt dort nicht mit.“

### Aufgabe 2 „Wahlabsicht: drei Prozentzahlen für dieselbe Partei“ (Pflicht)

Link „↑ Grundlage 2 nachlesen“.

Leitfrage: „Wie groß ist die Union, und wie groß sind die Unentschlossenen, je nachdem, wen du mitzählst?“

Ziel: „Am Ende kannst du für eine Partei drei Prozentzahlen nennen, jede mit ihrer Basis, und begründen, welche Zahl zu welchem Satz passt.“

Grundlage: „Grundlage 2, Fehlende Werte: Wer zählt mit?“

Einleitung: „Der ALLBUS fragt, welche Partei man wählen würde, wenn am nächsten Sonntag Bundestagswahl wäre. Die Variable heißt pv01. Hier fehlt fast ein Viertel der Antworten, aus fünf verschiedenen Gründen.“

**Erst festlegen** (Auswahl, „Tipp abgeben“): „Wie viel Prozent aller Befragten sagen bei der Wahlabsicht „weiß nicht“?“ Optionen: „unter 5 %“, „5 bis 15 %“, „über 15 %“. (Auflösung beim Prüfen: 11,49 %, Raw % von −8.)

**Schritte:**

1. „Führe die Vorlage aus und schau zuerst nach unten: Welche Gründe für eine fehlende Antwort gibt es, und welcher ist am häufigsten?“

```r
# Häufigkeitstabelle: Wahlabsicht bei der nächsten Bundestagswahl
allbus %>%
  frequency(pv01)
```

2. „Such die Zeile CDU-CSU. Lies zwei Prozentzahlen ab: Raw % (von allen Befragten) und Valid % (von den gültigen Antworten).“

3. „Eine dritte Basis rechnest du selbst: Die Unentschlossenen („weiß nicht“) sollen mitzählen, weil auch sie eine Aussage machen. Die Basis ist dann 3.984 gültige plus 603 „weiß nicht“. Die Vorlage rechnet so für CDU/CSU. Tausch die markierte Zahl gegen die Zahl der „weiß nicht“-Antworten und führe sie erneut aus: Wie groß sind die Unentschlossenen auf dieser Basis?“ Schild „R als Taschenrechner: kennst du aus Sitzung 1“. Hilfezeile: „Die Klammer sorgt dafür, dass R erst die Basis zusammenzählt und dann teilt.“

```r
# Eigene Basis: gültige Antworten plus „weiß nicht“
# N der Gruppe geteilt durch (3984 gültige + 603 „weiß nicht“), mal 100
⟦988⟧ / (3984 + 603) * 100
```

   Bild zum Schritt B7 `s3-ein-zaehler-drei-nenner` (Formel als Bausteine, statisch): oben ein Stapel aus Steinen mit Aufkleber CDU-CSU und der Zahl 988 („Steine im Stapel“), darunter drei Bruchstriche nebeneinander mit je einer Basis als Bauplatte unterschiedlicher Länge: „alle Befragten 5.246“ (lange Platte, darin ein grauer Abschnitt „fehlt 1.262“), „gültige plus „weiß nicht“ 3.984 + 603“ (mittlere Platte, Abschnitt „weiß nicht 603“ hellgelb), „gültige 3.984“ (kurze Platte). Unter jeder Platte der Spaltenname: „Raw %“, „deine Basis (Vorlage)“, „Valid %“. Keine Ergebnisse im Bild. Je kürzer die Platte, desto größer der Anteil: kleine Notiz rechts „kleinere Basis, größerer Anteil“.
   Textfassung B7: „Dieselben 988 Antworten CDU-CSU, geteilt durch drei Basen: alle 5.246 Befragten, darunter 1.262 ohne gültige Antwort, das ergibt Raw %. Die 3.984 gültigen plus die 603 „weiß nicht“, das rechnet die Vorlage. Nur die 3.984 gültigen, das ergibt Valid %. Je kleiner die Basis, desto größer der Anteil.“

4. „Deuten: Eine Zeitung schreibt „Ein Viertel der Befragten würde die Union wählen.“ Passt das? (Frage a2f unten)“

**Weiterdenken in der Probier-Werkstatt (für die Aufgabe nicht nötig):** „Für die Aufgabe reichen die Vorlagen oben. Hier ist Platz für eigene Fragen. Eine Idee: Bei welcher Frage sagen besonders viele „weiß nicht“? Probier die Sterbehilfe bei psychischer Krankheit (vm21) oder eine eigene Variable. Die Probier-Werkstatt startet mit einem Vorschlag.“

```r
# Eine Idee: Sterbehilfe bei psychischer Krankheit, eine Frage mit vielen „weiß nicht“
allbus %>%
  frequency(vm21)
```

(Zur Information: vm21 hat 494 „weiß nicht“ und 1.647 Split, 3.030 gültige.)

**Antwortfragen:**

| id | Art | Label | Optionen | Ziel | Toleranz | Text richtig | Text falsch / Hinweis | Hilfezeile |
|---|---|---|---|---|---|---|---|---|
| a2a | choice | Welcher Grund für eine fehlende Antwort kommt bei pv01 am häufigsten vor? | m50: nicht wahlberechtigt (−50); m8: weiß nicht (−8); m7: verweigert (−7); m9: keine Angabe (−9) | m8 | – | „weiß nicht“ mit 603 Befragten, 11,49 % aller Befragten und fast die Hälfte der 1.262 fehlenden. Dann folgen verweigert (306), nicht wahlberechtigt (186), keine Angabe (149) und Datenfehler (18). | Vergleiche im unteren Teil von `frequency(pv01)` die Zahlen in der Spalte N. | – |
| a2b | number | Wie viele Befragte haben keine gültige Antwort (Total missing)? | – | 1262 | 0 | 1.262, fast jede vierte befragte Person (24,06 %). | Lies die Zeile „Total missing“, Spalte N. | – |
| a2c | number | CDU/CSU: Wie viel Prozent aller Befragten (Raw %)? | – | 18.83 | 0.1 | 18,83 %: 988 von allen 5.246. | Lies in der Zeile CDU-CSU die Spalte Raw %. Sonderfall 24,8: Das ist Valid %, also nur von den gültigen. | Eine Kommazahl reicht. |
| a2d | number | CDU/CSU: Wie viel Prozent der gültigen Antworten (Valid %)? | – | 24.8 | 0.1 | 24,80 %: 988 von 3.984 gültigen. | Lies in der Zeile CDU-CSU die Spalte Valid %. Sonderfall 18,83: Das ist Raw %, also von allen. | Eine Kommazahl reicht. |
| a2e | number | Unentschlossene: Wie viel Prozent sind es, wenn „weiß nicht“ zur Basis gehört? | – | 13.15 | 0.1 | 603 / (3.984 + 603) × 100 = 13,15 %. Auf dieser Basis sind die Unentschlossenen größer als AfD (10,46 %), FDP und Linke. | Tausch in der Vorlage aus Schritt 3 die markierte Zahl 988 gegen 603. Der Nenner bleibt 3984 + 603. Sonderfall 15,14 (± 0,1, 603 / 3984): Die 603 gehören selbst zur Basis, darum teilst du durch 3984 + 603. Sonderfall 11,49: Das ist Raw % von „weiß nicht“, also von allen 5.246. Sonderfall 21,54: Das ist die CDU/CSU aus der Vorlage; tausch die markierte Zahl. | Ergebnis der Vorlage aus Schritt 3, eine Kommazahl reicht. |
| a2f | choice | Eine Zeitung schreibt: „Ein Viertel der Befragten würde die Union wählen.“ Was sagst du dazu? | stimmt: Stimmt, Valid % ist 24,8.; ungenau: Ungenau: 24,8 % gilt nur für die 3.984 mit gültiger Antwort, von allen Befragten sind es 18,8 %. Der Satz muss die Basis nennen.; falsch: Falsch gerechnet, richtig wären 21,5 %. | ungenau | – | Genau. Ehrlich wäre: „Knapp 25 % der Befragten mit einer gültigen Antwort würden die Union wählen; knapp ein Viertel aller Befragten gibt keine an.“ | bei „stimmt“: Die Zahl stimmt, der Satz nicht: „der Befragten“ klingt nach allen 5.246. Bei „falsch“: Alle drei Zahlen sind richtig gerechnet, nur mit verschiedenen Basen. Entscheidend ist, was der Satz behauptet. | – |

**Fürs Plenum:** „Sollen die 603 Unentschlossenen in einer Wahlumfrage mitzählen? Und die 186 Nicht-Wahlberechtigten? Bringt je einen Satz mit, für wen eure Zahl gilt.“

**Hilfe, Stufe 1: Denkanstoß:** „Dieselben 988 Menschen ergeben verschiedene Prozentzahlen, je nachdem, durch wen du teilst. Raw % teilt durch alle, Valid % durch die gültigen, und eine eigene Basis rechnest du selbst.“

**Hilfe, Stufe 2: Wo schaue ich?:** „Die fehlenden Werte und Total missing stehen unten in `allbus %>% frequency(pv01)`, die Prozente für CDU/CSU in der ersten Zeile. Für die eigene Basis führst du die Vorlage aus Schritt 3 aus, mit 603 statt 988 vorne.“

**Hilfe, Stufe 3: Lösung:** „Häufigster Grund: „weiß nicht“ (603). Total missing: 1.262. CDU/CSU: Raw % 18,83, Valid % 24,80, mit „weiß nicht“ in der Basis 21,54. Unentschlossene: `603 / (3984 + 603) * 100` ergibt 13.14585, also 13,15 %. Der Zeitungssatz ist ungenau, weil er die Basis nicht nennt.“

**Ohne Grafik lösbar:** „Das Bild in Schritt 3 zeigt nur die drei Basen. Alle Zahlen stehen in `allbus %>% frequency(pv01)` und in der Ausgabe der Vorlage.“

Hinweis unter den Antworten (klein): „Ungewichtet. Mit Gewichtung kommt die CDU/CSU auf 25,81 % der gültigen Antworten statt 24,80 %; warum, zeigt Sitzung 6.“

---

## 6 Thema 3: Die Mitte: Modus, Median, Mittelwert

### Grundlage 3 „Die Mitte: Modus, Median, Mittelwert“ (Kopf: „Grundlage zu Aufgabe 3“, „Schon klar? Direkt zu Aufgabe 3 ↓“)

Unterzeile: „Welche Zahl beschreibt die Mitte, und welche passt zu welcher Variable? Drei Schritte, etwa 12 Minuten.“

#### Karte 3a „Die Mitte einer Reihe“ (Schilder: „Mittelwert und Median: kennst du aus Methoden Ia“, „Im Bild“)

Beispiel zuerst: „Neun Befragte sagen, wie viele Personen in ihrem Haushalt leben, zum Beispiel. Geh die Schritte durch.“

**Bild B8 `s3-reihe-mitte` (interaktiv, Schrittleiste „Schritt 1: Turm“, „Schritt 2: Reihe“, „Schritt 3: Mittelwert“; Schritt 4 erscheint nach dem Kurz überlegen):**
- **Schritt 1:** Turm `dh04` (Typ `<dbl>`) aus neun blauen Steinen mit Zahlen, von oben: 2, 1, 4, 2, 3, 2, 5, 1, 2. Notiz: „zum Beispiel neun Befragte“.
- **Schritt 2:** Die Steine liegen sortiert nebeneinander auf einem Lineal von 0 bis 12 (Striche bei jeder ganzen Zahl, beschriftet 0, 2, 4, …, 12): bei 1 zwei Steine übereinander, bei 2 vier, bei 3 einer, bei 4 einer, bei 5 einer. Darüber die Reihenfolge als Zählung 1. bis 9.; der 5. Stein (ein Stein bei 2) hat einen orangen Rahmen; gestrichelte senkrechte Linie bei 2 mit Schild „Median 2“. Links und rechts der Mitte je eine Klammer „4 Steine“.
- **Schritt 3:** zusätzlich unter dem Lineal ein Dreieck (Spitze nach oben, orange gefüllt) bei 2,44 mit Schild „Mittelwert 2,44“. Rechts eine Rechnung als Bausteine: „1 + 1 + 2 + 2 + 2 + 2 + 3 + 4 + 5 = 22“, „22 geteilt durch 9 Steine = 2,44“. Kleiner Text: „Das Dreieck ist der Schwerpunkt: Auf diesem Punkt würde das Lineal im Gleichgewicht liegen.“
- **Schritt 4 (nach dem Kurz überlegen):** ein zehnter Stein bei 12 (eine Wohngemeinschaft mit 12 Personen), orange umrandet als „neu“. Median: gestrichelte Linie bleibt bei 2, Schild „Median 2 (zwischen dem 5. und 6. Stein)“. Dreieck wandert zu 3,4, Schild „Mittelwert 3,4“; das alte Dreieck bei 2,44 bleibt blass stehen. Rechnung: „22 + 12 = 34“, „34 geteilt durch 10 Steine = 3,4“. Knopf „Wieder ohne die WG“ führt zurück zu Schritt 3.

**Textfassung B8:** Schritt 1: „Ein Turm mit neun Zahlen, zum Beispiel neun Befragte: 2, 1, 4, 2, 3, 2, 5, 1, 2 Personen im Haushalt.“ Schritt 2: „Sortiert: 1, 1, 2, 2, 2, 2, 3, 4, 5. Der fünfte Wert steht in der Mitte, vier davor, vier danach: 2. Das ist der Median.“ Schritt 3: „Alle Werte zusammen ergeben 22, geteilt durch 9 ergibt 2,44. Das ist der Mittelwert, der Schwerpunkt der Reihe.“ Schritt 4: „Mit einer zehnten Person aus einer WG mit 12 Personen: Sortiert 1, 1, 2, 2, 2, 2, 3, 4, 5, 12. Die Mitte liegt zwischen dem fünften und sechsten Wert, beide sind 2: Der Median bleibt 2. Der Mittelwert steigt auf 34 geteilt durch 10, also 3,4.“

**Kurz überlegen** (Auswahl, „Auflösen“): „Eine zehnte Person kommt dazu: Sie lebt in einer Wohngemeinschaft mit 12 Personen. Was passiert mit Mittelwert und Median?“ Optionen: „beide steigen“, „nur der Mittelwert steigt“, „nur der Median steigt“, „nichts ändert sich“.
- Ziel: „nur der Mittelwert steigt“.
- richtig: „Genau. Der Mittelwert steigt von 2,44 auf 3,4, weil die 12 mit ihrem ganzen Gewicht in die Summe eingeht. Der Median bleibt 2, weil sich in der Mitte der Reihe nichts ändert.“
- „beide steigen“: „Der Median schaut nur auf die Mitte der sortierten Reihe. Dort stehen weiter zwei Steine mit 2. Der Mittelwert steigt auf 3,4.“
- „nur der Median steigt“: „Andersherum: Der Mittelwert zählt jede Zahl zusammen und steigt auf 3,4. Der Median bleibt bei 2.“
- „nichts ändert sich“: „Der Median bleibt tatsächlich bei 2. Der Mittelwert aber steigt: 34 geteilt durch 10 ist 3,4.“

Kurz gesagt: „Der **Mittelwert** (arithmetisches Mittel) ist die Summe aller Werte geteilt durch ihre Anzahl, der Schwerpunkt der Reihe. Der **Median** ist der Wert in der Mitte der sortierten Reihe. Ein einzelner Wert weit draußen zieht den Mittelwert mit, den Median kaum.“

Genauer erklärt „Formel lesen lernen: der Mittelwert“:
- Bild B9 `s3-formel-mittelwert` (Formel als Bausteine, wie B2b): Formel x̄ = Σx / n, jedes Zeichen als Baustein mit Unterschrift: „x̄: der Mittelwert, gesprochen „x quer““, „Σ: zähl alle zusammen, gesprochen „Summe““, „x: jeder einzelne Wert“, „n: wie viele Werte es sind“. Darunter eingesetzt: „Σx = 1 + 1 + 2 + 2 + 2 + 2 + 3 + 4 + 5 = 22“, „n = 9“, „x̄ = 22 / 9 = 2,44“. Textfassung B9: „Der Mittelwert x quer ist die Summe aller Werte x geteilt durch ihre Anzahl n. Im Beispiel: Die Summe der neun Werte ist 22, n ist 9, 22 geteilt durch 9 ergibt 2,44.“
- „Von innen nach außen gelesen: Erst zählst du alle Werte zusammen (Σx). Dann teilst du durch ihre Anzahl (n). Weil jeder Wert in die Summe eingeht, verschiebt ein einziger großer Wert das Ergebnis.“
- „Beim Median gibt es keine Rechnung mit allen Werten: Du sortierst und nimmst den mittleren. Bei einer geraden Anzahl liegt die Mitte zwischen zwei Werten; dann ist der Median der Wert genau dazwischen.“
- „Der **Modus**, der häufigste Wert, ist hier ebenfalls 2: Vier der neun Befragten leben zu zweit.“

Häufige Verwechslung: „„Durchschnitt“ und „Mitte“ sind nicht dasselbe. Im Alltag sagt man „im Durchschnitt“ und meint oft „das Übliche“. Statistisch ist der Durchschnitt der Mittelwert, und der kann weit von der mittleren Person entfernt liegen.“

#### Karte 3b „Welche Mitte passt zu welcher Variable?“ (Schilder: „Codes sind Namen: kennst du aus Sitzung 2“, „Skalenniveau: neu heute“, „Zuordnen“)

Beispiel zuerst: „In Sitzung 2 hast du gesehen: Der Mittelwert der Partei-Codes, 16,1, sagt nichts über die Wahlabsicht. Genau diese Zahl steht in der Kopfzeile von `frequency(pv01)`: `frequency()` rechnet dort immer einen Mittelwert aus, auch wo er nichts bedeutet. Bei der Konfession (rd01) steht mean=4.06. Die Codes sind dort 1 evangelisch (ohne Freikirchen), 3 römisch-katholisch, 6 keiner Religionsgemeinschaft und so weiter. Was wäre eine Konfession „4,06“? Ob eine Mitte sinnvoll ist, hängt vom Skalenniveau ab.“

**Bild B10 `s3-skalenniveau` (statisch, drei Stufen einer Treppe, von unten nach oben; als Tabelle aufgebaut):**

| Stufe | Was die Codes sagen | Beispiel | Modus | Median | Mittelwert |
|---|---|---|---|---|---|
| nominal | nur Namen, keine Reihenfolge | Konfession (rd01) | ja | nein | nein |
| ordinal | Reihenfolge, aber ungleiche Abstände | Bücher lesen (la01), „täglich“ bis „nie“ | ja | ja | nur mit Vorsicht |
| metrisch | Zahlen mit gleichen Abständen | Personen im Haushalt (dh04) | ja | ja | ja |

Optik: drei Steinstufen (unten nominal, Mitte ordinal, oben metrisch), jede Stufe trägt die Zeile; „ja“ als grüner Haken, „nein“ als grauer Strich, „nur mit Vorsicht“ als oranges Ausrufezeichen mit Text. Textfassung B10 = die Tabelle selbst (als echte `<table>` unter dem Bild oder als einzige Darstellung).

**Kurz überlegen** (Zuordnen, je Variable drei Kontrollkästchen Modus, Median, Mittelwert, Knopf „Prüfen“): „Welche Mitte darfst du berichten? Kreuz für jede Variable alles an, was sinnvoll ist.“ Variablen: „Wahlabsicht, Parteien“, „Gesundheitszustand, sehr gut bis schlecht“, „Alter in Jahren“.
- Ziel: Wahlabsicht nur Modus; Gesundheitszustand Modus und Median; Alter alle drei. (Beispiele ohne ALLBUS-Zahlen; hs01 und age dienen hier nur als Begriffe, keine Werte.)
- Rückmeldung je Zeile: Wahlabsicht richtig: „Parteien sind nominal: nur der Modus.“ Falsch mit Median: „Parteien haben keine Reihenfolge, also keine Mitte.“ Falsch mit Mittelwert: „Ein Mittelwert aus Parteicodes ergibt keinen Sinn; die Codes sind nur Namen.“ Gesundheitszustand richtig: „Ordinal: Modus und Median. Ein Mittelwert setzt gleiche Abstände voraus, etwa zwischen „gut“ und „sehr gut“; die gibt es hier nicht sicher.“ Falsch ohne Median: „Die Stufen haben eine Reihenfolge; die Mitte lässt sich bestimmen.“ Gesundheitszustand falsch mit Mittelwert: „Ein Mittelwert setzt gleiche Abstände zwischen den Stufen voraus. Ob „gut“ und „sehr gut“ so weit auseinanderliegen wie „schlecht“ und „weniger gut“, weiß niemand. Darum hier Modus und Median.“ Alter richtig: „Metrisch: Alle drei sind sinnvoll. Bei schiefen Verteilungen gehören Mittelwert und Median zusammen in den Bericht.“ Falsch ohne Mittelwert: „Ein Jahr ist überall gleich lang; hier darfst du rechnen.“ Falsch ohne Median oder Modus: „Was bei ordinalen Variablen geht, geht bei metrischen erst recht: Median und Modus sind auch beim Alter erlaubt.“
- Gesamt: „Alles richtig zugeordnet.“ oder „… von 3 Zeilen richtig.“

Hinweis für den Bau: Die Variablennamen hs01 und age werden hier nicht genannt, nur die Beschreibung, damit nichts aus Sitzung 4 vorweggenommen wird.

Kurz gesagt: „Das **Skalenniveau** sagt, was die Codes einer Variable bedeuten. **Nominal**: nur Namen, dann gibt es nur den Modus. **Ordinal**: eine Reihenfolge, dazu der Median. **Metrisch**: gleiche Abstände, erst dann ist der Mittelwert sicher sinnvoll.“

Genauer erklärt „Nominal und der Median“: „Auch bei der Konfession kannst du in `frequency(rd01)` die Spalte Cum. % lesen. Sie erreicht die 50 erst beim Code 5, „andere nicht-christliche Religion“ (Cum. % 49,31 bei Code 4, 52,32 bei Code 5). Ein „Median“ wäre das trotzdem nicht: Er hängt nur davon ab, in welcher Reihenfolge die Codes zufällig vergeben wurden. Stünde „keiner Religionsgemeinschaft“ vorn, käme etwas anderes heraus.“

Genauer erklärt „Ordinal und der Mittelwert“: „In der Forschung werden Skalen wie „1 sehr gut bis 5 schlecht“ oft wie metrisch behandelt und gemittelt. Das ist eine Annahme: dass der Schritt von „gut“ zu „sehr gut“ genauso groß ist wie der von „schlecht“ zu „weniger gut“. Wer einen Mittelwert einer ordinalen Variable berichtet, sollte Median und Häufigkeiten danebenstellen.“

Häufige Verwechslung: „Eine Zahl im Datensatz macht eine Variable nicht metrisch. Auch Parteien und Konfessionen sind im ALLBUS als Zahlen gespeichert. R rechnet mit ihnen, ob es Sinn ergibt oder nicht. Ob es Sinn ergibt, entscheidest du.“

Link: „→ In der freien Karte: Arithmetisches Mittel“ (Begriff `mean`).

#### Karte 3c „Kennzahlen mit `describe()`“ (Schilder: „describe(): neu heute“, „Code lesen“)

Beispiel zuerst: „So fasst `describe()` die Zahl der Personen im Haushalt für alle Befragten zusammen.“

Ausgabe als Monospace-Block, Spalten Mean, Median, N und Missing hervorgehoben (oranger Rahmen um die vier Spalten; die übrigen Spalten grau):

```
Descriptive Statistics
----------------------

  ----------------------------------------------------------------------
  Variable   Mean  Median     SD   Range    IQR  Skewness     N  Missing
  ----------------------------------------------------------------------
  dh04      2.342   2.000  1.177  11.000  1.000     1.209  5144      102
  ----------------------------------------------------------------------
```

Text: „So liest du die Zeile:
- **Mean** ist der Mittelwert: 2.342, also 2,34 Personen.
- **Median**: 2.000, also 2 Personen. Die Person in der Mitte der Reihe lebt zu zweit; allein oder zu zweit leben mindestens die Hälfte der Befragten.
- **N**: 5144 Befragte mit gültiger Angabe gehen in die Rechnung ein.
- **Missing**: 102 ohne gültige Angabe, hier alle mit −32 NICHT GENERIERBAR. `describe()` zählt alle Gründe zusammen; welche es sind, zeigt `frequency()`.
- **SD** ist die Standardabweichung, der typische Abstand zum Mittelwert (kennst du aus Methoden Ia). **Range**, **IQR** und **Skewness** liest du in Sitzung 4.“

Textfassung: Die Aufzählung ist die Textfassung; der Ausgabe-Block ist zusätzlich als `<table>` mit den neun Spalten verfügbar.

**Kurz überlegen** (Auswahl, „Auflösen“): „Der Mittelwert liegt mit 2,34 über dem Median 2. Woran liegt das?“ Optionen: „An den größeren Haushalten: Nach oben reicht die Reihe viel weiter als nach unten“, „An den 102 fehlenden Angaben“, „R rundet den Median ab“.
- Ziel: erste Option.
- richtig: „Genau. Unter dem Median 2 gibt es nur noch Haushalte mit 1 Person, darüber Haushalte mit 3, 4, 5 und mehr Personen. Diese größeren Haushalte ziehen den Mittelwert nach oben, der Median bleibt bei 2.“
- fehlende: „Fehlende Angaben gehen gar nicht in die Rechnung ein, weder in den Mittelwert noch in den Median.“
- rundet: „R rundet nicht ab: 2.000 ist genau 2. Der Unterschied kommt von den großen Haushalten.“

Kurz gesagt: „`describe()` fasst eine Variable in Kennzahlen zusammen. Für die Mitte schaust du auf **Mean** (Mittelwert) und **Median**, für die Basis auf **N** (wie viele gültige Werte eingehen) und **Missing** (wie viele fehlen).“

Häufige Verwechslung: „N in `describe()` ist nicht die Zahl aller Befragten, sondern die Zahl der gültigen Werte. Alle Befragten sind N plus Missing: 5.144 + 102 = 5.246.“

Link: „→ In der freien Karte: Deskriptiver Überblick“ (Begriff `describe`).

### Aufgabe 3 „Wie lange dauert Arbeitslosigkeit?“ (Pflicht)

Link „↑ Grundlage 3 nachlesen“.

Leitfrage: „Wie lange waren Menschen ohne Arbeit, und welche Zahl beschreibt das ehrlich?“

Ziel: „Am Ende kannst du mit `describe()` Mittelwert, Median und N ablesen, sagen, wer in diesen Zahlen fehlt, und begründen, welche Zahl die typische Dauer besser beschreibt.“

Grundlage: „Grundlage 3, Die Mitte: Modus, Median, Mittelwert“.

Einleitung: „Der ALLBUS fragt alle, die in Voll- oder Teilzeit berufstätig sind, ob sie in den letzten zehn Jahren arbeitslos waren. Wer ja sagt, wird gefragt, wie lange. Die Antwort steht in Wochen in der Variable dw19.“

**Erst festlegen** (Auswahl, „Tipp abgeben“): „Wie liegt der Mittelwert der Dauer im Vergleich zum Median?“ Optionen: „deutlich darüber“, „etwa gleich“, „deutlich darunter“. (Auflösung: deutlich darüber, 54,7 gegen 26.)

**Schritte:**

1. „Führe die Vorlage aus und lies Mean, Median, N und Missing ab.“ Schild „describe(): neu heute“. Hilfezeile: „R schreibt drei Nachkommastellen mit Punkt: 26.000 heißt 26.“

```r
# Kennzahlen: Dauer der Arbeitslosigkeit in Wochen
allbus %>%
  describe(dw19)
```

2. „Bei 4.732 Befragten fehlt die Dauer. Warum? `describe()` sagt es nicht. Führe die Häufigkeitstabelle aus und schau ganz nach unten. Die Tabelle ist lang, weil jede Wochenzahl eine eigene Zeile hat.“

```r
# Häufigkeitstabelle derselben Variable: Wer fehlt, steht ganz unten
allbus %>%
  frequency(dw19)
```

3. „Vergleiche Mittelwert und Median. Was zieht den Mittelwert so weit nach oben? Ein Blick ans Ende der gültigen Zeilen hilft: Die längsten Zeiten reichen bis 520 Wochen, das sind zehn Jahre.“

4. „Deuten: Welcher Satz gehört in einen Bericht? Und zum Schluss ein Blick zurück auf Aufgabe 1: Was machst du mit dem Mittelwert in der Kopfzeile von `frequency(ep04)`? (Fragen a3e und a3f unten)“

**Weiterdenken in der Probier-Werkstatt (für die Aufgabe nicht nötig):** „Für die Aufgabe reichen die Vorlagen oben. Hier ist Platz für eigene Fragen. Eine Idee: Waren Frauen anders lange arbeitslos als Männer? Der Vorschlag wählt wie in Sitzung 2 nur die Frauen aus (`sex == 2`); für Männer tauschst du die 2 gegen eine 1. Der Name `frauen` ist nur ein Name; wenn du magst, nennst du das Objekt `maenner`, dann aber an beiden Stellen. Die Probier-Werkstatt startet mit einem Vorschlag.“ Schild „filter(): kennst du aus Sitzung 2“.

```r
# Eine Idee: nur Frauen (sex == 2), Befragte auswählen wie in Sitzung 2
frauen <- allbus %>%
  filter(sex == 2)

frauen %>%
  describe(dw19)
```

(Zur Information: Frauen Mean 55,936, Median 29,5, N 236; Männer Mean 53,610, Median 26, N 272.)

**Antwortfragen:**

| id | Art | Label | Optionen | Ziel | Toleranz | Text richtig | Text falsch / Hinweis | Hilfezeile |
|---|---|---|---|---|---|---|---|---|
| a3a | number | Mittelwert (Mean) der Dauer in Wochen: | – | 54.708 | 0.3 | 54,7 Wochen, gut ein Jahr. R schreibt 54.708. | Lies in `describe(dw19)` die Spalte Mean. Sonderfall 26: Das ist der Median. | Wochen, eine Kommazahl reicht; auf ganze Wochen gerundet geht auch. |
| a3b | number | Median der Dauer in Wochen: | – | 26 | 0 | 26 Wochen, ein halbes Jahr. R schreibt 26.000; der Punkt ist dort ein Komma. | Lies in `describe(dw19)` die Spalte Median. Sonderfall 54,7 (± 0,3): Das ist der Mittelwert. | Wochen. |
| a3c | number | Wie viele Befragte gehen in diese Kennzahlen ein (N)? | – | 514 | 0 | 514 Befragte mit gültiger Angabe. | Lies in `describe(dw19)` die Spalte N. Sonderfall 4732: Das ist Missing, also alle ohne gültige Angabe. Sonderfall 5246: Das sind alle Befragten, auch die ohne Angabe. | – |
| a3d | choice | Warum fehlt bei 4.732 Befragten die Dauer? | verw: Die meisten wollten nicht antworten.; filter: Die meisten wurden gar nicht gefragt (−10 TNZ: FILTER): Die Frage ging nur an Berufstätige, die in den letzten zehn Jahren arbeitslos waren.; geloescht: R hat ungültige Werte gelöscht. | filter | – | 4.709 der 4.732 tragen −10 TNZ: FILTER. Dazu kommen 16 ohne Angabe und 7 Datenfehler. Beachte: Wer heute nicht erwerbstätig ist, also auch, wer gerade arbeitslos ist, wurde nicht gefragt. Die Zahlen beschreiben Berufstätige, die früher einmal arbeitslos waren. | Schau ganz unten in `frequency(dw19)`: Welcher Code steht bei den meisten fehlenden? −10 heißt TNZ: FILTER (Grundlage 2). | – |
| a3e | choice | Welcher Satz beschreibt die typische Dauer am besten? | mean: „Wer arbeitslos war, war im Schnitt gut ein Jahr ohne Arbeit (55 Wochen).“; median: „Die Hälfte war höchstens ein halbes Jahr arbeitslos (Median 26 Wochen); wenige sehr lange Zeiten ziehen den Mittelwert auf 55 Wochen.“; gleich: „Mittelwert und Median sagen hier dasselbe.“ | median | – | Genau. Der Mittelwert ist gut doppelt so groß wie der Median. Wenige sehr lange Zeiten, bis zu zehn Jahre, ziehen ihn nach oben. Wer nur den Mittelwert nennt, macht die typische Arbeitslosigkeit doppelt so lang. | bei „mean“: Der Mittelwert stimmt, beschreibt aber nicht die typische Person: Die Hälfte war höchstens 26 Wochen arbeitslos. Bei „gleich“: 54,7 und 26 liegen weit auseinander. | – |
| a3f | choice | In der Kopfzeile von `frequency(ep04)` aus Aufgabe 1 steht mean=3.40. Was gehört in deinen Bericht? | mittel: „Im Mittel 3,40: Die Befragten erwarten eine Lage zwischen gleichbleibend und etwas schlechter.“; median: „Median „gleichbleibend“, dazu die Anteile: 48 % erwarten schlechter, 16 % besser.“; nichts: „Bei ep04 lässt sich keine Mitte angeben.“ | median | – | Genau. ep04 ist ordinal: Die Stufen haben eine Reihenfolge, aber niemand weiß, ob „etwas“ und „wesentlich“ gleich weit auseinanderliegen. Darum Median und Häufigkeiten. | bei „mittel“: Ein Mittelwert setzt gleiche Abstände zwischen den Stufen voraus (metrisch). Bei „wesentlich besser“ bis „wesentlich schlechter“ ist das nicht gesichert. Bei „nichts“: Die Stufen haben eine Reihenfolge, also gibt es einen Median (Grundlage 3b). | – |

**Hilfe, Stufe 1: Denkanstoß:** „Der Mittelwert zählt jeden Wert zusammen, auch die wenigen sehr langen. Der Median schaut nur auf die Person in der Mitte. Und nicht jede fehlende Angabe ist eine verweigerte: Wer wurde überhaupt gefragt?“

**Hilfe, Stufe 2: Wo schaue ich?:** „Mean, Median, N und Missing stehen in der Ausgabe von `allbus %>% describe(dw19)`. Die Gründe für die fehlenden Angaben stehen ganz unten in `allbus %>% frequency(dw19)`. Was −10 heißt, steht in Grundlage 2a. `codebook(allbus, dw18, dw19)` zeigt die beiden Fragen (in der Werkstatt als Text mit Wertelabels, in RStudio im Viewer): erst ob jemand in den letzten zehn Jahren arbeitslos war (dw18), dann wie lange (dw19). Für Aufgabe 1 zurück: Grundlage 3b.“

**Hilfe, Stufe 3: Lösung:** „Mittelwert 54,7 Wochen, Median 26 Wochen, N = 514. Von den 4.732 fehlenden tragen 4.709 −10 TNZ: FILTER: nicht in Voll- oder Teilzeit berufstätig (auch wer gerade arbeitslos ist) oder in den letzten zehn Jahren nicht arbeitslos. Der Median beschreibt die typische Dauer besser, weil wenige sehr lange Zeiten (bis 520 Wochen) den Mittelwert auf mehr als das Doppelte ziehen. Bei ep04 (ordinal) berichtest du statt mean=3.40 den Median „gleichbleibend“ und die Häufigkeiten.“

**Ohne Grafik lösbar:** „Diese Aufgabe hat keine Grafik. Alle Zahlen stehen in der Ausgabe der beiden Vorlagen.“

**Fürs Plenum:** „Eine Zeitung schreibt: „Arbeitslose bleiben im Schnitt über ein Jahr ohne Job.“ Was ist richtig daran, was fehlt? Denkt an den Median und daran, wer gefragt wurde: Wer gerade arbeitslos ist, steht nicht in dw19.“

---

## 7 Thema 4: Liegt der Durchschnitt in der Mitte? (Zusatz)

### Grundlage 4 „Liegt der Durchschnitt in der Mitte?“ (Kopf: „Grundlage zu Aufgabe 4“, „Schon klar? Direkt zu Aufgabe 4 ↓“)

Unterzeile: „Wie viele liegen über dem Mittelwert, und was verrät das? Etwa 5 Minuten.“

#### Karte 4 „Cum. % und der Mittelwert“ (Schilder: „Cum. %: Grundlage 1“, „Im Bild“)

Beispiel zuerst: „Im Mittel leben 2,34 Personen im Haushalt der Befragten (Grundlage 3c). Wie viele leben in einem größeren Haushalt als dem Durchschnitt? Die Spalte Cum. % von `frequency(dh04)` verrät es.“

**Bild B11 `s3-streifen-dh04` (interaktiv: Knopf „Auflösen“ nach der Frage):**
- Streifen 0 bis 100 % wie B3, sechs Abschnitte nach Valid %: „1 Person“ 22,96; „2“ 44,46; „3“ 15,01; „4“ 12,58; „5“ 3,79; „6 und mehr“ 1,21 (100 minus 98,79). Über den Grenzen die Cum. %: 22,96 | 67,42 | 82,43 | 95,00 | 98,79 | 100.
- Vor dem Auflösen: Dreieck (orange) „Mittelwert 2,34“ über der Grenze zwischen „2“ und „3“ (er liegt zwischen den Stufen 2 und 3, also rechts vom Ende des Abschnitts „2“); gestrichelte Linie bei 50 % mit „Median“ im Abschnitt „2“.
- Nach dem Auflösen: Der Teil rechts der Grenze 67,42 bekommt eine orange Klammer „über dem Mittelwert: 32,58 %“, links eine graue Klammer „höchstens 2 Personen: 67,42 %“.

**Textfassung B11:** „Ein Streifen von 0 bis 100 Prozent in sechs Abschnitten nach Valid %: 1 Person 22,96, 2 Personen 44,46, 3 Personen 15,01, 4 Personen 12,58, 5 Personen 3,79, 6 und mehr 1,21. Kumuliert: bis 1 Person 22,96, bis 2 Personen 67,42, bis 3 Personen 82,43, bis 4 Personen 95,00, bis 5 Personen 98,79. Der Mittelwert 2,34 liegt zwischen 2 und 3 Personen, der Median bei 2.“ Nach dem Auflösen: „Höchstens 2 Personen: 67,42 Prozent. Über dem Mittelwert, also 3 Personen und mehr: 100 minus 67,42, das sind 32,58 Prozent.“

**Kurz überlegen** (Zahlenfeld, „Prüfen“): „Wie viel Prozent der Befragten leben in einem Haushalt mit mehr Personen als im Durchschnitt (2,34)?“ Hilfezeile: „Eine Kommazahl reicht.“
- Ziel 32,58, Toleranz 0,1.
- richtig: „32,58 %: Bis 2 Personen kommen 67,42 % zusammen, über dem Mittelwert liegen also 100 − 67,42 = 32,58 %. Nur ein Drittel liegt über dem Durchschnitt.“
- falsch: „Such in Cum. % die letzte Zeile unter dem Mittelwert 2,34, das ist 2 Personen (67,42), und zieh sie von 100 ab.“
- Sonderfall 67,42: „Das sind alle bis einschließlich 2 Personen, also höchstens beim Mittelwert. Gefragt ist der Rest: 100 minus diese Zahl.“
- Sonderfall 50: „50 % lägen darüber, wenn der Mittelwert genau in der Mitte der Reihe stünde. Such in Cum. % die Zeile 2 Personen und zieh ihre Zahl von 100 ab.“

Kurz gesagt: „Cum. % sagt, wie viel Prozent höchstens bis zu einem Wert kommen. **100 minus Cum. %** sind die, die darüber liegen. Über dem Median liegt höchstens die Hälfte, bei Variablen mit vielen verschiedenen Werten fast genau die Hälfte. Über dem Mittelwert können es bei einer schiefen Verteilung viel weniger oder viel mehr sein.“

Genauer erklärt: „Rechtsschiefe Verteilungen haben einen langen Auslauf zu großen Werten (Fachbegriff: Schiefe, mehr in Sitzung 4). Dann liegt der Mittelwert meist über dem Median, und meist liegt deutlich weniger als die Hälfte über dem Mittelwert. Bei wenigen Stufen wie hier kann auch über dem Median weniger als die Hälfte liegen: 44,46 % leben genau zu zweit, also genau auf dem Median, und über ihm liegen nur 32,58 %. Bei einem langen Auslauf zu kleinen Werten ist es umgekehrt. Wie viele über dem Mittelwert liegen, ist darum ein schneller Test, ob „Durchschnitt“ und „Mitte“ zusammenpassen.“

Häufige Verwechslung: „„Durchschnitt“ heißt nicht, dass die Hälfte darüber liegt. Für den Median gilt: Über ihm liegt höchstens die Hälfte, unter ihm ebenso.“

### Aufgabe 4 „Wie viele liegen über dem Durchschnitt?“ (Zusatz)

Link „↑ Grundlage 4 nachlesen“.

Leitfrage: „Wie viele waren länger arbeitslos als der Durchschnitt?“

Ziel: „Am Ende kannst du mit Cum. % und dem Taschenrechner ausrechnen, wie viel Prozent über dem Mittelwert liegen, und sagen, was das über die Verteilung verrät.“

Grundlage: „Grundlage 4, Liegt der Durchschnitt in der Mitte?“

Einleitung: „In Aufgabe 3 lag der Mittelwert der Arbeitslosigkeitsdauer bei 54,7 Wochen. Liegt die Hälfte darüber?“

**Erst festlegen** (Auswahl): „Wie viel Prozent liegen über dem Mittelwert von 54,7 Wochen?“ Optionen: „etwa die Hälfte“, „deutlich weniger als die Hälfte“, „deutlich mehr als die Hälfte“. (Auflösung: deutlich weniger, 24,71 %.)

**Schritte:**

1. „Führe die Häufigkeitstabelle aus. Geh in der Spalte Value nach unten bis zur letzten Wochenzahl unter dem Mittelwert 54,7. Welche Zahl steht dort in Cum. %?“

```r
# Häufigkeitstabelle der Wochen mit Cum. %
allbus %>%
  frequency(dw19)
```

2. „Rechne 100 minus diese Zahl. Die Vorlage rechnet das Beispiel aus Grundlage 4 (Personen im Haushalt). Tausch die markierte Zahl gegen deinen Wert aus Schritt 1.“

```r
# Anteil über dem Mittelwert: 100 minus Cum. % der letzten Zeile darunter
100 - ⟦67.42⟧
```

**Weiterdenken in der Probier-Werkstatt (für die Aufgabe nicht nötig):** „Für die Aufgabe reichen die Vorlagen oben. Hier ist Platz für eigene Fragen. Eine Idee: Der ALLBUS hat die Wochen auch in sechs Stufen zusammengefasst (dw19c). In welcher Stufe liegt dort der Median, und passt das zu 26 Wochen? Die Probier-Werkstatt startet mit einem Vorschlag.“

```r
# Eine Idee: dieselbe Dauer in sechs Stufen zusammengefasst
allbus %>%
  frequency(dw19c)
```

(Zur Information: Cum. % 41,25 bis „12 bis 25 Wochen“, 62,65 bis „26 bis 51 Wochen“; Median-Stufe „26 bis 51 Wochen“.)

**Antwortfragen:**

| id | Art | Label | Optionen | Ziel | Toleranz | Text richtig | Text falsch / Hinweis | Hilfezeile |
|---|---|---|---|---|---|---|---|---|
| a4a | number | Letzte Zeile unter dem Mittelwert: Welche Zahl steht dort in Cum. %? | – | 75.29 | 0.05 | 75,29 in der Zeile 54 Wochen: Drei Viertel waren höchstens 54 Wochen arbeitslos. | Unter 54,7 liegt als letzte Wochenzahl die 54, nicht die 52. Sonderfall 74,71: Das ist die Zeile 52; danach kommen noch 53 und 54. Sonderfall 75,10: Das ist die Zeile 53; danach kommt noch 54. Sonderfall 75,49: Das ist 55, schon über dem Mittelwert. | Aus `frequency(dw19)`, Spalte Cum. %. |
| a4b | number | Wie viel Prozent liegen über dem Mittelwert? | – | 24.71 | 0.1 | 100 − 75,29 = 24,71 %, das sind 127 der 514 Befragten. | Tausch in der Vorlage aus Schritt 2 die markierte Zahl gegen deinen Wert aus Frage a4a. Sonderfall 32,58: Das ist das Beispiel aus Grundlage 4; tausch die markierte Zahl. | Prozent, eine Kommazahl reicht. |
| a4c | choice | Was zeigt das? | mitte: Der Mittelwert liegt in der Mitte der Reihe.; viertel: Nur ein Viertel liegt über dem Mittelwert: Wenige sehr lange Zeiten ziehen ihn nach oben, die Mitte (Median 26) liegt viel tiefer.; fehler: R hat sich verrechnet. | viertel | – | Genau. Drei Viertel liegen unter dem Durchschnitt. Ein langer Auslauf zu großen Werten zieht den Mittelwert nach oben: Die Verteilung ist rechtsschief. | Über der Mitte läge die Hälfte. Hier ist es nur ein Viertel, also liegt der Mittelwert nicht in der Mitte. R rechnet richtig. | – |

**Hilfe, Stufe 1: Denkanstoß:** „Cum. % sagt, wie viele höchstens bis zu einer Wochenzahl kommen. Wer darüber liegt, ist der Rest bis 100.“

**Hilfe, Stufe 2: Wo schaue ich?:** „In `allbus %>% frequency(dw19)` stehen die Wochenzahlen in der Spalte Value. Such die letzte Zeile unter 54,7. Das ist 54. Dann rechnest du mit der Vorlage aus Schritt 2.“

**Hilfe, Stufe 3: Lösung:** „In der Zeile 54 steht Cum. % 75,29. `100 - 75.29` ergibt 24.71: Nur 24,71 % (127 von 514) waren länger arbeitslos als der Durchschnitt. Wenige sehr lange Zeiten ziehen den Mittelwert nach oben; die Mitte liegt bei 26 Wochen.“

**Ohne Grafik lösbar:** „Diese Aufgabe hat keine Grafik. Alle Zahlen stehen in `allbus %>% frequency(dw19)`.“

---

## 8 Hilfe bei R-Fehlermeldungen (unter jeder Aufgabe, zugeklappt „Hilfe: R meldet einen Fehler“)

Satz über der Tabelle: „Vor dem Schrägstrich steht die Meldung, wie RStudio sie auf Deutsch zeigt, danach, wie die Code-Werkstatt sie auf Englisch zeigt.“

| R meldet | Das hilft |
|---|---|
| `konnte Funktion "%>%" nicht finden` / `could not find function "%>%"` | Den Startblock in „R lesen“ ausführen. |
| `Objekt 'allbus' nicht gefunden` / `object 'allbus' not found` | Die Zeile mit `read_spss()` aus dem Startblock ausführen. |
| `File 'ZA8831_v1-3-0.sav' does not exist.` (nur in RStudio) | Öffne RStudio über dein Projekt. Findet R die Datei nicht, nimm wie in Sitzung 1 `allbus <- read_spss(file.choose())`. |
| ``Can't select columns that don't exist. ✖ Column `ep4` doesn't exist.`` (in RStudio und Werkstatt gleich) | Der Variablenname ist vertippt. Prüf ihn Zeichen für Zeichen: ep04 mit Null, dw19 mit Eins und Neun. |
| `konnte Funktion "Frequency" nicht finden` / `could not find function "Frequency"` | R unterscheidet Groß- und Kleinschreibung: `frequency()` und `describe()` schreibst du klein. |
| `Unerwartete(s) ','` / `unexpected ','` | In R schreibst du Kommazahlen mit Punkt: `39.84 + 8.44`, nicht `39,84 + 8,44`. |
| Ergebnis fast null, etwa `0.01993107` | Tausenderpunkt weglassen: `1041`, nicht `1.041`. |
| In RStudio erscheint `+` und nichts passiert (in der Werkstatt: `unexpected end of input`) | Eine Klammer ist nicht geschlossen. In RStudio mit Esc abbrechen, dann die Klammern zählen: `988 / (3984 + 603) * 100`. |
| Tabelle bricht um und ist schwer zu lesen | Das Konsolenfenster in RStudio breiter ziehen und die Vorlage erneut ausführen. |

---

## 9 Überblick „Eine Tabelle lesen, eine Mitte wählen“

Kopf: „Überblick zu allen Aufgaben“. Unterzeile: „Alle vier Themen zusammen: welche Zahl wofür steht und welche Mitte wann passt.“

#### Karte Ü1 „Vier Fragen an eine Häufigkeitstabelle“

| Frage | Wo in der Ausgabe | So schreibst du es |
|---|---|---|
| Wie viele? | Spalte N | „2.067 Befragte erwarten eine etwas schlechtere Lage.“ |
| Welcher Anteil derer, die geantwortet haben? | Valid % (Basis: Total valid) | „39,8 % der Befragten mit gültiger Antwort erwarten eine etwas schlechtere Lage.“ |
| Welcher Anteil aller Befragten? | Raw % (Basis: Total) | „39,4 % aller Befragten, auch derer ohne gültige Antwort, erwarten eine etwas schlechtere Lage.“ |
| Wie viele bis zu einer Stufe? | Cum. % | „16,3 % der Befragten mit gültiger Antwort erwarten eine bessere Lage.“ |

Text darunter: „Die Beispiele stammen aus Aufgabe 1 (ep04). Und immer dazu: wie viele fehlen (Total missing) und warum (Codes unten in der Tabelle). Alle Zahlen hier sind ungewichtet.“

#### Karte Ü2 „Welche Mitte passt?“ (Bild B12 `s3-welche-mitte`, Entscheidungsbaum wie der Baum im Überblick von Sitzung 4)

Baum von oben nach unten:
- Frage 1 (Kasten): „Haben die Codes eine Reihenfolge?“ – nein → Blatt „nominal: **Modus**“ (Beispiel „Wahlabsicht, Konfession“).
- ja → Frage 2: „Sind die Abstände gleich groß?“ – nein → Blatt „ordinal: **Median** und Modus“ (Beispiel „Bücher lesen, Wirtschaftslage in einem Jahr“).
- ja → Blatt „metrisch: **Mittelwert und Median**“ (Beispiel „Personen im Haushalt, Wochen ohne Arbeit“), darunter klein: „liegen sie weit auseinander: beide berichten“.
Optik: Fragekästen weiß mit dunklem Rand, Blätter als grüne Steine, Pfeile mit „ja“/„nein“.

Textfassung B12: „Entscheidungsbaum. Erste Frage: Haben die Codes eine Reihenfolge? Wenn nein, ist die Variable nominal, du berichtest den Modus, zum Beispiel bei Wahlabsicht oder Konfession. Wenn ja, zweite Frage: Sind die Abstände gleich groß? Wenn nein, ist sie ordinal, du berichtest Median und Modus, zum Beispiel bei Bücher lesen oder Wirtschaftslage in einem Jahr. Wenn ja, ist sie metrisch, du berichtest Mittelwert und Median, zum Beispiel bei Personen im Haushalt oder Wochen ohne Arbeit. Liegen beide weit auseinander, gehören beide in den Bericht.“

Kurz gesagt: „Erst prüfen, wer mitzählt; dann die Mitte nach dem Skalenniveau wählen. Eine Prozentzahl ohne Basis und ein Mittelwert ohne Median können in die Irre führen.“

#### Karte Ü3 „Voraussetzungen“

| Kennzahl | braucht | Vorsicht |
|---|---|---|
| Raw %, Valid % | jede Variable, auch nominal | Basis nennen; bei Split und Filter ist Raw % fast immer irreführend. |
| Cum. % | geordnete Codes | Bei nominalen Variablen hängt Cum. % von der zufälligen Reihenfolge der Codes ab. |
| Modus | jede Variable, auch nominal | Bei mehreren fast gleich hohen Stapeln wenig aussagekräftig. |
| Median | geordnete Codes | Liegt Cum. % genau bei 50, liegt er zwischen zwei Stufen. |
| Mittelwert | gleiche Abstände (metrisch) | Wird von wenigen extremen Werten gezogen; die Kopfzeile von `frequency()` rechnet ihn auch dort, wo er nichts bedeutet. |

Häufige Verwechslung: „Fehlende Werte „verschwinden“ nicht. Sie stehen in jeder Tabelle unten, mit Grund. Wer sie nicht nennt, verschweigt, für wen die Zahl gilt.“

---

## 10 Mitnehmen

### Das Wichtigste aus dieser Sitzung
- Eine Häufigkeitstabelle zeigt für jeden Wert, wie viele (N) und welcher Anteil (Prozent). Cum. % zählt die Valid % von oben nach unten zusammen.
- Jede Prozentzahl hat eine Basis. Raw % teilt durch alle Befragten, Valid % durch die gültigen Antworten. Eine eigene Basis rechnest du mit R als Taschenrechner.
- Fehlende Werte tragen im ALLBUS einen Code mit Grund: nie gefragt (Split, Filter), nicht beantwortet (keine Angabe, weiß nicht, verweigert) oder beim Erfassen verloren. Fehlend heißt nicht verweigert.
- Modus: häufigster Wert. Median: Wert der Person in der Mitte, in der Tabelle die erste Zeile mit Cum. % ab 50. Mittelwert: Summe geteilt durch Anzahl.
- Welche Mitte passt, sagt das Skalenniveau: nominal Modus, ordinal Median, metrisch Mittelwert und Median.
- Der Mittelwert folgt wenigen extremen Werten, der Median bleibt in der Mitte. Liegen sie weit auseinander, gehören beide in den Bericht.
- In R: `allbus %>% frequency(x)` zählt aus, `allbus %>% describe(x)` fasst zusammen. R schreibt Kommazahlen mit Punkt.

### Prüf dich selbst (5 Fragen, je Auswahl mit Prüfen; Rückmeldung „Deine Wahl: „…“.“ plus Begründung)

1. „In `frequency()` steht bei einer Antwort Raw % = 20 und Valid % = 30. Was heißt das?“ Optionen: „20 % aller Befragten und 30 % derer mit gültiger Antwort haben so geantwortet“, „30 % aller Befragten, 20 % der gültigen“, „Die Antwort wurde 20- oder 30-mal gegeben“. Richtig: 1. Begründung: „Raw % teilt durch alle Befragten, Valid % nur durch die gültigen. Weil die Basis kleiner ist, ist Valid % größer (Grundlage 2b).“
2. „In der Zeile „gut“ einer Skala von „sehr gut“ bis „schlecht“ steht Cum. % = 60. Was heißt das?“ Optionen: „60 % antworten „gut““, „60 % antworten „gut“ oder „sehr gut““, „60 % antworten schlechter als „gut““. Richtig: 2. Begründung: „Cum. % zählt von oben bis einschließlich dieser Zeile zusammen (Grundlage 1b).“
3. „Bei einer Frage wurde einem Drittel der Befragten die Frage nie gestellt (−11 TNZ: SPLIT). Welche Prozentzahl gehört in deinen Bericht?“ Optionen: „Raw %, denn sie bezieht alle Befragten ein“, „Valid %, mit dem Zusatz, dass sie für die gilt, die geantwortet haben“, „egal, beide sind richtig gerechnet“. Richtig: 2. Begründung: „Raw % zählt auch die mit, die gar nicht antworten konnten, und macht den Anteil künstlich klein. Valid % mit Basis sagt ehrlich, für wen die Zahl gilt (Grundlage 2b).“
4. „`frequency()` zeigt bei der Konfession mean=4.06. Was berichtest du stattdessen?“ Optionen: „den Median“, „den Modus, die häufigste Konfession“, „den Mittelwert, gerundet auf 4“. Richtig: 2. Begründung: „Konfessionen sind nominal: Die Codes sind nur Namen. Es bleibt nur der Modus (Grundlage 3b).“
5. „Zu neun Befragten kommt eine Person mit einem sehr großen Wert dazu. Was verändert sich stärker?“ Optionen: „der Mittelwert“, „der Median“, „beide gleich stark“. Richtig: 1. Begründung: „Der Mittelwert zählt jeden Wert zusammen, der Median schaut nur auf die Mitte der sortierten Reihe (Grundlage 3a).“

### Dein Skript zum Mitnehmen

Text: „Alle Vorlagen dieser Sitzung in einer Datei, mit Kommentaren. Öffne sie in RStudio und führe sie Block für Block aus.“ Knopf „Skript herunterladen (sitzung3.R)“; Link „→ Nachlesen im R-Workshop, Kapitel 7.4“.

Skriptteile in dieser Reihenfolge (Titel als Kopfkommentar `# ---- Titel ----`, Marken mit ihrem Beispielwert; ohne Probier-Werkstätten):

| Schlüssel | Titel |
|---|---|
| `start` | Startblock |
| `r_frequency` | Häufigkeitstabelle: Bücher lesen |
| `r_describe` | Kennzahlen: Personen im Haushalt |
| `r_rechnen` | R als Taschenrechner |
| `a1` | Aufgabe 1: Häufigkeitstabelle ep04 |
| `a1r` | Aufgabe 1: zwei Zeilen zusammenzählen |
| `a2` | Aufgabe 2: Häufigkeitstabelle pv01 |
| `a2r` | Aufgabe 2: eigene Basis |
| `a3` | Aufgabe 3: Kennzahlen dw19 |
| `a3f` | Aufgabe 3: wer fehlt |
| `a4` | Aufgabe 4: Cum. % der Wochen |
| `a4r` | Aufgabe 4: über dem Mittelwert |

Kopf des Skripts: „# Sitzung 3: Erste Auszählung“, „# Statistikatlas, Methoden Ib, ALLBUS 2023 (ZA8831 v1.3.0)“, „# Markierte Stellen aus dem Atlas stehen hier mit ihrem Beispielwert.“ (wie Sitzung 4).

Probier-Werkstätten (`frei_a1` bis `frei_a4`) sind als `tryOut` markiert und stehen nicht im Skript.

---

## 11 Entscheidungen (offene Fragen, die ich selbst entschieden habe)

1. **Variablen.** Die Folien nutzen pa02a (Häufigkeiten) und dw15 (Saal 2). Beide sind Variablen der Seminaraufgaben in Sitzung 4 (Rätselkasten). Darum nimmt das Kapitel la01 (Grundlage 1) und ep04 (Aufgabe 1) für die Häufigkeitstabelle sowie dw19 (Aufgaben 3 und 4) für Mittelwert und Median. st01 (Folie Input 3) und pv01 (Saal 1) bleiben, weil sie in Sitzung 4 nicht vorkommen und den Folieninput direkt aufgreifen. la01 und ep04 haben beide einen Median, der vom Modus abweicht; so lässt sich der Unterschied zeigen.
2. **dw19 statt dw15.** dw19 (Wochen ohne Arbeit; gefragt: Berufstätige, die in den letzten zehn Jahren arbeitslos waren) ist stark rechtsschief (Mittelwert 54,7, Median 26) und hat 4.709-mal −10 TNZ: FILTER. Damit tragen zwei Aufgaben die Kernaussagen der alten Aufgabe (Saal 2: „Wer wurde gefragt?“ und „Der Durchschnitt ist nicht die Mitte“), ohne Sitzung 4 vorwegzunehmen. Die Frageformulierung im Kapitel stützt sich auf die Variablenlabels (dw18 „Berufst.: arbeitslos i. d. letzten 10 J.?“, dw19 „Dauer der Arbeitslosigkeit in Wochen“, Höchstwert 520 Wochen = zehn Jahre) und auf die Filterkette in den Daten (dw19 gültig nur bei dw18 = ja). **Vor der Live-Schaltung den Fragetext im Codebuch prüfen**; steht dort „insgesamt in den letzten zehn Jahren“, kann die Einleitung von Aufgabe 3 das so sagen.
3. **Kein Filter für fehlende Werte, keine `untag_na()`, keine `na_frequencies()`.** Die Folien (Input 5) zeigen `untag_na()` und `filter(wahl != -50, …)`; laut Dozentenentscheid und Funktionstabelle (`untag_na()` in Sitzung 5) entfällt das. Die Stuhlregel aus Saal 1 wird stattdessen mit dem Taschenrechner nachgebaut (eigene Basis 3984 + 603). Das erfüllt denselben Lernzweck („wer zählt mit?“) ohne Filter-Code.
4. **`filter()` nur in einer Probier-Werkstatt** (A3, `filter(sex == 2)`), als „kennst du aus Sitzung 2“, mit Zwischenobjekt und ohne Kette, damit „Ketten“ in Sitzung 4 neu bleiben. Ketten mit mehreren Schritten kommen im Kapitel nicht vor.
5. **Pipe-Schriftbild.** Auch Einzelschritte stehen zweizeilig (`allbus %>%` ↵ `  frequency(…)`), damit alle Kapitel `rStyleProblems()` bestehen und Sitzung 4 nahtlos anschließt. Im Fließtext bleibt Code einzeilig.
6. **Thema 4 als Zusatz statt Pflicht.** Die Pflicht (A1–A3) braucht etwa 41 Minuten. „Wie viele liegen über dem Mittelwert?“ (alte Aufgabe, Saal 2) ist lehrreich, aber für schwache Studierende eine zweite lange Tabelle; darum Zusatz mit eigener kurzer Grundlage.
7. **Taschenrechner-Vorlagen tragen ein Beispiel aus der Grundlage oder einen Teilschritt** (A1: „besser“, A2: CDU/CSU, A4: dh04), nie die Lösung. Die Studierenden tauschen die markierten Zahlen; Sonderfall-Rückmeldungen erkennen, wenn jemand nur die Vorlage ausgeführt hat.
8. **Grauer Hinweis „kennst du aus Methoden Ia“** für Mittelwert und Median (wie `sitzung02.md`, die dasselbe Schild nutzt). Das Skalenniveau ist laut `sitzung02.md` (Karte 2c: „Thema in Sitzung 3“) hier neu und trägt deshalb „neu heute“; die Idee „Codes sind Namen“ (pv01, Mittelwert 16,1) ist „kennst du aus Sitzung 2“.
9. **Abstimmung mit den Plänen von Sitzung 1 und 2** (beide lagen beim Abschluss vor): `frequency()` ist nach `sitzung01.md` (E1) „kennst du aus Sitzung 1“ (erster Blick: Value, Label, N, Total valid); Sitzung 3 vertieft Raw %, Valid %, Cum. %, die Kopfzeile und die Missing-Zeilen. R als Taschenrechner ist ebenfalls aus Sitzung 1 (E4). Sitzung 1 schreibt `frequency(allbus, x)` ohne Pipe; Karte R1 erklärt, dass `allbus %>% frequency(x)` dasselbe ist. Die Gründe für fehlende Werte (Codes −6, −8, −9, −10, −11, −42) führt `sitzung02.md` (Grundlage 3) ein; Karte 2a ist darum eine kurze Wiederholung mit Zuordnen, neu ist, wie `frequency()` sie zählt und was das für die Prozentbasis heißt. `codebook()` steht wie in Sitzung 2 mit Variablennamen (`codebook(allbus, dw18, dw19)`, A3 Hilfe 2). Einzige wirklich neue Funktion ist `describe()`; die Funktionstabelle im Leitfaden (Sitzung 3: `frequency()`, `describe()`, Taschenrechner neu) sollte entsprechend angepasst werden.
10. **Leitfrage des Kapitels** weicht von `curriculum.ts` ab („Wie viele interessieren sich eigentlich für Politik?“ passt zu pa02a, das hier nicht vorkommt). Vorschlag für `question` in curriculum.ts: „Wie viele sagen was – und wen zählst du mit, wenn du Prozent sagst?“ Bis zur Entscheidung des Dozenten kann curriculum.ts bleiben; das Kapitel zeigt die neue Leitfrage.
11. **Zielwerte und Toleranzen.** Prozentwerte mit Toleranz 0,1 (Ablesen aus der Tabelle, Rundung auf eine Stelle zulässig), a4a 0,05 (exaktes Ablesen, Nachbarzeilen 74,71, 75,10 und 75,49 liegen weiter weg). Mittelwert dw19 Toleranz 0,3 (54,7 und 55 werden angenommen; 54.708 in R-Schreibweise wird über die zweite Lesart als 54,708 erkannt). Ganzzahlige Zielwerte (5188, 58, 1262, 514, 26) ohne Toleranz; die Eingaben „5.188“ und „26.000“ werden durch die doppelte Lesart der Antwortprüfung richtig erkannt (5.188 → 5188; 26.000 → 26). Mehrdeutig wäre nur ein Zielwert wie 5,188 oder 26000, den es hier nicht gibt.
12. **Interaktion 3b nutzt Gesundheitszustand und Alter nur als Beschreibung** (ohne Variablennamen und Zahlen), damit nichts aus Sitzung 4 (hs01, age) vorweggenommen wird.
13. **Bildmodul-Name.** `bilder/kap03.py` würde mit `RWorkshop/figuren/kap03.py` kollidieren, das `kap90.py` importiert (`from kap03 import mono, notiz, platte`). Vorschlag: `bilder/lp03.py`.
14. **Fragetexte.** Die Einleitungen geben die Fragen sinngemäß wieder (aus Variablenlabels und Antwortstufen); nur st01 steht wörtlich wie auf der Folie (Input 3). Vor der Live-Schaltung mit dem Codebuch abgleichen, wenn ein wörtliches Zitat gewünscht ist.
15. **Gewichtung:** ungewichtet mit Hinweis; als einzige gewichtete Vergleichszahl steht CDU/CSU Valid % 25,81 (statt 24,80) unter Aufgabe 2, analog zu Sitzung 4 (Mittelwert 7,40 statt 7,36).
16. **Keine Doppelung mit Sitzung 2:** Die Frage „Was sagt der Mittelwert der Partei-Codes?“ stellt schon Sitzung 2 (Karte 2c). A3 fragt darum nach dem Mittelwert einer ordinalen Variable (ep04, mean=3.40), und Prüf dich selbst fragt nicht noch einmal, was TNZ: SPLIT heißt (steht in Sitzung 1), sondern welche Prozentspalte dann in den Bericht gehört. st01 kommt in Sitzung 2 (A3, nur Papierbögen) vor; Grundlage 2b nutzt alle Befragten und verrät dort nichts.

## 12 Abweichungen zu den Folien von Sitzung 3

| Folie | Folien-Inhalt | Kapitel |
|---|---|---|
| Titel „Heute“ | `frequency()` und `describe()`, Raw % und Valid %, `filter()` und `%>%`, `untag_na()` | `frequency()`, `describe()`, Raw %, Valid %, Cum. %, Taschenrechner; `filter()` nur als Erinnerung in einer Probier-Werkstatt; kein `untag_na()`. |
| Rückblick Station 1 und 2 | Lösungen der alten Stationen | entfällt (gehört zu den Kapiteln 1 und 2); die Codes −11, −9, −42 tauchen als „kennst du aus Sitzung 1 und 2“ wieder auf. |
| Input 1 „Wer hat die Lücke gemacht?“ | sieben Codes in drei Spalten, −50 als offene Frage | Grundlage 2a, gleiche drei Regale, −41 statt −50 im Zuordnen; −50 und −32 als Text darunter. |
| Input 2 Häufigkeiten | pa02a, Raw/Valid/Cum. %, mean=2.70 | Grundlage 1 mit la01 (pa02a ist Variable in Sitzung 4); Mittelwert aus Codes in Grundlage 3b mit pv01 (Erinnerung an Sitzung 2) und rd01; in A3 der Mittelwert einer ordinalen Variable (ep04). |
| Input 3 „Prozent wovon?“ | st01, 100 Punkte, 28 % gegen 41 % | Grundlage 2b, dieselben Zahlen als 100 Steine; Raster mit 17/23/28/32 bzw. 24/35/41 (Folie fasst „Sonstiges“ mit „kommt darauf an“ zusammen und kommt deshalb auf leicht andere Punktzahlen). |
| Input 4 Pipe und `filter()` | `papier <- allbus %>% filter(mode == 4)`, `!=`, `>`, Komma als „und“ | nur als Erinnerung an Sitzung 2 (Hinweis oben, Probier-Werkstatt A3); keine eigene Grundlage. `!=`, `>` und das Komma kommen nicht vor. |
| Input 5 `untag_na()` | `filter(st01 != -11)`, `na_frequencies()`, `untag_na()` | entfällt (Dozentenentscheid; `untag_na()` ist Sitzung 5). Die Aussage „Für Rechnungen zählen fehlende Werte nicht mit“ steht in Grundlage 2a. |
| Input 6 „Was gehört aufs Schild?“ | neun Personen, Arbeitsstunden, Person verliert Job (0 Stunden), `describe()` mit `tibble()` | Grundlage 3a mit neun Haushalten und einer WG mit 12 Personen (Arbeitsstunden und die Null-Stunden-Idee nutzt Sitzung 4 in Grundlage 4); `describe()` an dh04 statt an einem `tibble()`. |
| Arbeitsphase „100 Stühle“ | Rolle Szenografie, Saal 1 (pv01, Stuhlregel, `untag_na()`, `filter()`), Saal 2 (dw15, Schild, Fallauswahl Vollzeit/Teilzeit) | ohne Rolle; A2 pv01 mit drei Basen per Taschenrechner; A3/A4 dw19 statt dw15; keine Stühle, keine größten Reste in den Aufgaben. |
| Plenum Saal 1 | Tabelle Regel × Stühle, „Welche Zahl gehört an die Wand?“ | „Fürs Plenum“ unter A2: Sollen „weiß nicht“ und Nicht-Wahlberechtigte mitzählen? |
| Plenum Saal 2 | Zahlenstrahl 21,4 / 37,9 / 40 / 41,7 Stunden, 66 % über dem Mittel | A3 und A4 mit dw19: Mittelwert 54,7, Median 26, nur 24,71 % über dem Mittel (dort umgekehrt schief als bei dw15). |
| Ausblick | `install.packages("ggplot2")` | nicht im Kapitel (gehört in Sitzung 4 bzw. den Startblock). |

---

## 13 Prüfung (Agent, 23.11.2026)

Geprüft nach `teil-b-plan-pruefung.md` gegen den Design-Auftrag (mit Nachtrag „Jede Vorlage läuft für sich“), das Design, `prototyp/sitzung4.html` und `sitzung02.md`. Alle Zahlen und Fehlermeldungen mit R gegen ZA8831 v1.3.0 nachgeprüft. `Rscript sitzung03-zahlen.R` nach den Änderungen: „Fertig: alle Zahlen von Sitzung 3 stimmen.“, Exit 0.

### Blickwinkel 1: schwache Studentin ohne Vorwissen
Durchgespielt (langsam, je Frage etwa eine Minute): G1 15, A1 13, G2 12, A2 15, G3 12, A3 14, G4 5, A4 8 Minuten. Pflicht A1–A3 etwa 42 Minuten plus einmal webR-Start (etwa 30–40 s): knapp, aber machbar. Jeder Schritt ist mit dem Vorherigen lösbar; Fachbegriffe haben ihr „Kurz gesagt“.

Geändert (7):
1. **Kurz überlegen 1b** war wörtlich beantwortet: Der Knopf „Cum. %“ direkt darüber nennt 38,56 für „mindestens einmal pro Woche“. Neue Frage „seltener oder nie“ (47,97; auch 47,96 über 100 − 52,04), mit Sonderfällen 18,27, 81,73 und Raw % 47,76.
2. **Kurz überlegen 2b** widersprach Aufgabe 2: Dort ist Valid % in einem Satz über „die Befragten“ ungenau (a2f), hier galt „41 %“ in genau so einem Satz als richtig. Die Optionen sind jetzt ganze Sätze; richtig ist der Satz mit Basis.
3. **Fehlerhilfe:** In der Werkstatt erscheinen die Meldungen englisch. Beide Fassungen stehen jetzt in der Tabelle (wie in `sitzung01.md` und `sitzung02.md`); die Meldungen sind mit R auf Deutsch und Englisch nachgeprüft.
4. **a4a:** Sonderfall 75,10 (Zeile 53) ergänzt; wer eine Zeile zu früh stoppt, bekommt einen gezielten Hinweis.
5. **Kurz überlegen 3b:** Rückmeldungen für „Gesundheitszustand mit Mittelwert“ und „Alter ohne Median oder Modus“ fehlten; ergänzt.
6. **Probier-Werkstatt A3:** Hinweis, dass das Objekt nach dem Tausch auf `sex == 1` weiter `frauen` heißt und umbenannt werden darf.
7. **R2 Genauer erklärt:** „In `describe()` stehen immer drei Nachkommastellen“ stimmt für N und Missing nicht; präzisiert.

### Blickwinkel 2: Didaktik
Grundlagen führen direkt in die Aufgaben, jede Aufgabe hat Festlegen und mindestens eine Deuten-Frage; R bleibt Beiwerk. Keine Grundlage verrät eine Lösung (Grundlagen la01, st01, dh04, rd01; Aufgaben ep04, pv01, dw19). Probier-Werkstätten sind echte Anschlussfragen.

Geändert (4):
1. Die neue Frage in 1b verlangt Deuten statt Ablesen (zwei Rechenwege, Rundung) und bereitet A1 Schritt 4 („schlechter“ zusammenzählen) und A4 („100 minus Cum. %“) vor.
2. **Grundlage 3b:** neues „Genauer erklärt: Nominal und der Median“. Bei rd01 erreicht Cum. % die 50 erst bei Code 5 (49,31 → 52,32); ein „Median“ hinge nur an der Reihenfolge der Codes. Das vertieft die Voraussetzung „Median braucht Reihenfolge“ mit einer echten Ausgabe.
3. **A3 (a3d, Hilfe 3, Plenum):** Selektion ergänzt: Wer heute nicht in Voll- oder Teilzeit arbeitet, auch wer gerade arbeitslos ist, bekam dw18/dw19 nicht (geprüft: dw18 gültig bei `work` 3 oder 4: 0). Die Zahlen beschreiben Berufstätige, die früher arbeitslos waren; das schärft die Plenumsfrage zum Zeitungssatz.
4. **Karte 2a:** „Sieben Codes kommen besonders oft vor“ war nicht belegt (−41 ist selten). Jetzt: die sieben Codes, die im Kapitel vorkommen; −7 und −41 als neu benannt (Sitzung 2 hatte sie nicht).

### Blickwinkel 3: Fachliches und Barrierefreiheit
Geändert (8):
1. **Fachfehler in Grundlage 4:** „Über dem Median liegt immer etwa die Hälfte“ und der Sonderfall „50 % liegen über dem Median“ stimmen gerade beim Beispiel dh04 nicht: Median 2, über ihm liegen nur 32,58 % (44,46 % genau auf dem Median). Kurz gesagt, Genauer erklärt, Häufige Verwechslung und Sonderfall 50 korrigiert („höchstens die Hälfte; bei vielen verschiedenen Werten fast genau die Hälfte“); „rechtsschief → weniger als die Hälfte über dem Mittelwert“ als Faustregel („meist“) formuliert.
2. **Karte 3c:** „Median 2: Die Hälfte lebt allein oder zu zweit“ (tatsächlich 67,42 %) → „mindestens die Hälfte“; ebenso 1c „die Hälfte liest mindestens monatlich“ → „gut die Hälfte (52,04 %)“.
3. **Einzelfallwert entfernt:** „bis zu 12 Personen“, „der größte hat 12 Personen“ (dh04 = 12 kommt genau einmal vor). Option und Rückmeldung in 3c neu (größere Haushalte, Reihe reicht nach oben weiter).
4. rd01: Code 1 heißt „evangelisch (ohne Freikirchen)“.
5. `describe()`-Block in 3c wie gedruckt (Trennlinie unter „Descriptive Statistics“); bei B2 vermerkt, dass die HTML-Tabelle Kopf und `+---+`-Linien weglässt.
6. Überblick Ü3: „braucht: nichts“ bzw. „eine gezählte Variable“ → „jede Variable, auch nominal“.
7. **R-Skript:** Zahlen, die im Plan standen, aber nicht geprüft wurden, ergänzt: B11 (dh04 3–5 Personen, Cum. %, 6 und mehr 1,21), rd01-Codes und Cum. %, Männer bei dw19 (53,610; 26; 272), vm21 Split 1.647, st01 Raw/Valid % der 100 Steine, dw19 Cum. % bei 53, dw18 nach `work`, neue Werte aus 1b.
8. Sprache und Stil geprüft: Du-Form, kein „(fiktiv)“, kein „·“, keine Rollen, `%>%`, kein `drop_na()`/`to_label()`/`ifelse()`; jede Vorlage läuft für sich (Skript prüft frische Umgebung). Jedes Bild hat eine Textfassung mit Werten, jede Aufgabe ist ohne Grafik lösbar.

### Offene Punkte (bewusst nicht geändert)
- **Doppelung mit Sitzung 4:** Kurz überlegen 3a (WG mit 12 Personen: „Was passiert mit Mittelwert und Median?“, vier gleich gebaute Optionen) gleicht fast wörtlich Sitzung 4, 4a (Kurzarbeit null). Sitzung 3 führt das Prinzip ein; Sitzung 4 ist fertig. Vorschlag: In Sitzung 4 die Frage als Wiederholung kennzeichnen oder dort nach dem neuen Median fragen.
- **Fragetext dw19** (insgesamt in zehn Jahren oder letzte Phase?) weiter im Codebuch prüfen (Entscheidung 2).
- **A2 Schritt 3** nennt 603 schon im Kommentar der Vorlage; a2e ist damit vor allem Tauschen. Bleibt als Gerüst für Schwache, a2a verlangt das Suchen der 603 ohnehin.
- **−42 im Regal „Erfassung“:** Die zwei Kreuze macht die Person; die Lücke entsteht beim Erfassen. So in Folie Input 1 und Sitzung 2; beibehalten.
- **Konstruierte WG mit 12 Personen** fällt zufällig mit dem echten Höchstwert zusammen; da konstruiert und ohne Bezug im Text, beibehalten.

## Nacharbeit nach Kapitelprüfung (23.11.2026)
1. **Fokus (B8):** „Wieder ohne die WG“ verschiebt den Fokus mit `useFocusLater` auf den Knopf „Schritt 3: Mittelwert“ der Schrittleiste (Hilfsfunktion `stepButton`).
2. **Live-Zusammenfassungen:** Regale (B4) und Zeilen 3b hängen die Rückmeldetexte falsch zugeordneter Steine bzw. Zeilen an die vorgelesene Zusammenfassung an.
3. **K2B_AFTER** steht jetzt im Live-Text der Frage 2b (lokales `ChoiceCheck`: `after` ist ein Text, kein eigener Absatz mehr); erscheint wie bisher erst nach der Antwort.
4. **Streifen B3/B11:** eigene Live-Zeile (sr-only), die erst nach der Antwort den aufgelösten Text vorliest.
5. **describe()-Ausgabe:** `<pre role="region" aria-label=… tabIndex=0>`.
6. **ALLBUS-Test:** 603 „weiß nicht“ liegt über AfD, FDP und Linke und unter den Grünen (Vergleich a2e).
7. **Kopfzeile:** Doppelung vermieden; `knownNote` nennt beide Schilder, das Methoden-Ia-Schild nutzt `Known label`.
8. **Freie-Karte-Hinweise** sind `MapLink`s (Test prüft die fünf Begriffe).
