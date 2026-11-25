# Sitzung 8 „Index und Skala“: Inhaltsplan für das Kapitel

Stand: 23.11.2026. Teil B des Rollouts (`docs/entwicklung/plaene/2026-11-23-lernpfad-kapitel-rollout.md`, Task 7), nach dem Muster von Sitzung 4 (`prototyp/sitzung4.html`, umgesetzt in `src/chapter/s04/`). Curriculum-Eintrag `id: 8` („Sitzungsplan 9“), bisherige Aufgabe `s07` (`src/tasks/s07-drei-fragen/`), Konzept `2026-09-29-lernpfad-aufgaben/sitzung-07.md` (alte Nummerierung), Rechenkern `src/tasks/kit/reliability.ts`.

- **Daten:** ALLBUS 2023, ZA8831 v1.3.0. Nur Aggregate. Steine mit Einzelwerten sind konstruierte Beispiele („zum Beispiel …“).
- **Gewichtung wie in der bisherigen Aufgabe `s07`:** Cronbachs α, Trennschärfen und Personenzahlen (wer bekommt einen Indexwert?) **ungewichtet**; Aussagen über die Bevölkerung (Mittelwerte und Anteile eines Index, Inglehart-Typen) **gewichtet** mit `weights = wghtpew`. Begründung und Hinweistext siehe Kopf und Entscheidung 3.
- **Zahlen:** Jede Zahl dieses Plans steht in `sitzung08-zahlen.R` (gleicher Ordner) und wird dort gegen die gedruckte Ausgabe von mariposa 0.7.4 geprüft. Das Skript führt jede Vorlage in einer frischen Umgebung aus, in der nur `allbus` existiert (wie die Code-Werkstatt, die `allbus` vor jedem Ausführen zurücksetzt), einmal mit Platzhalter und einmal gelöst, und prüft, dass jede Vorlage wörtlich in diesem Plan steht. `Rscript sitzung08-zahlen.R` läuft ohne Fehler.
- **Jede Vorlage läuft für sich** (Nachtrag zum Auftrag): Selbst gebildete Variablen (`populismus`, `mm02_um`, `zustimmungen` …) entstehen in derselben Kette mit `mutate()`; nichts wird über Werkstätten hinweg mitgenommen. Wiederholte Schritte tragen den Kommentar „wie in Aufgabe N“ bzw. „wie in Schritt N“.
- **Bausteine:** wie Sitzung 4 (`src/chapter/blocks/`, `src/chapter/workshop/`). Texte und feste Zielwerte in `src/chapter/s08/content.ts`, Echtdaten-Test in `allbus.local.test.ts`.
- **Schreibweise in diesem Plan:** Texte in „…“ oder als Zitat sind Volltext fürs Kapitel. `code` bleibt im Kapitel Code. ⟦…⟧ markiert anzupassende Stellen in Vorlagen; die Markierung steht nicht im kopierbaren Code. Zahlen im Fließtext deutsch (3.427; 0,833); wo R etwas ausgibt, steht die R-Schreibweise dabei (`0.833`, `3427`).

---

## 1 Kopf

**Stein:** 8. **Titel:** Index und Skala.

**Leitfrage (Begleitfigur `hallo.svg`):** „Wie misst man Populismus mit mehreren Fragen – und woran erkennst du, ob die Fragen zusammenpassen?“

**Wegweiser (drei Kacheln):**
- „Vorweg: R lesen“ – „Umpolen erinnert, ein Wert je Person, Stimmigkeit prüfen“
- „Vier Themen“ – „je erst die Grundlage, dann die Aufgabe; im Seminar direkt zur Aufgabe springen“
- „Zum Schluss“ – „Überblick, Wichtigstes, Selbsttest, Skript“

**Was du nach dieser Sitzung kannst** (Lernziele, als Liste):
1. aus mehreren Fragen (Items) einen **Mittelwertindex** bilden: einen Wert je Person, und erklären, warum mehrere Fragen genauer messen als eine *(Verfahren)*
2. andersherum gefragte Items vor dem Zusammenfassen **umpolen**, damit eine hohe Zahl bei allen Items dasselbe bedeutet *(Verfahren)*
3. **Cronbachs α** und die **Trennschärfe** eines Items lesen und mit den Faustregeln deuten, und sagen, wo diese Faustregeln an Grenzen stoßen *(Interpretation)*
4. einen Indexwert in Worten deuten: was eine hohe oder niedrige Zahl heißt und für wen es überhaupt einen Wert gibt *(Interpretation)*
5. die Voraussetzungen eines Mittelwertindex prüfen (gleiche Richtung, ein gemeinsamer Begriff, genug Antworten je Person) und erklären, warum ein hohes α noch nicht heißt, dass die Fragen das Richtige messen; wissen, wann ein **Kombinationsindex** besser passt *(Voraussetzungen)*
6. Code lesen und anpassen: `row_means(pick(…), min_valid = …)` in `mutate()`, `reliability()` mit `summary()`, `rec(…, rules = "rev")` *(Code lesen)*

**Hinweis „schon bekannt“ (grau):** „Schon bekannt und hier nur kurz erinnert: der Startblock (Sitzung 1), `frequency()` und `describe()` (Sitzung 3), Ketten mit `%>%` (Sitzung 4), neue Variablen mit `mutate()` und `rec()`, auch das Umpolen mit `rules = "rev"` (Sitzung 5), `weights = wghtpew` und die Korrelation r (Sitzung 6), `summary()` und die Korrelationsmatrix (Sitzung 7). Messfehler, Reliabilität und Validität kennst du aus der Vorlesung. Solche Stellen tragen ein graues Schild „kennst du aus Sitzung …“ oder „Wiederholung aus der Vorlesung“.“

**So arbeitest du mit dieser Seite:** die vier Zeilen wie in Sitzung 4 (Genauer erklärt, Kurz überlegen, Code-Werkstatt, markierte Stellen), unverändert.

**Sprungknöpfe fürs Seminar:** „Im Seminar? Jedes Thema beginnt mit seiner Grundlage zum Vertiefen der Folien. Wer sie schon kann, springt direkt zur Aufgabe:“ Aufgabe 1, Aufgabe 2, Aufgabe 3, Aufgabe 4.

**Hinweis Gewichtung (einmal unter den Sprungknöpfen, klein):** „Wie seit Sitzung 6 rechnest du Aussagen über alle Menschen in Deutschland gewichtet: Mittelwerte und Anteile eines Index mit `weights = wghtpew`. Zwei Dinge rechnest du heute ohne Gewicht: wie stimmig die Fragen sind (Cronbachs α) und wie viele Befragte einen Indexwert bekommen. Beides beschreibt das Messinstrument und die Befragung selbst, nicht die Bevölkerung. Gewichtet ändert sich α kaum (Populismus: 0,829 statt 0,833).“

---

## 2 Themen, Grundlagen, Aufgaben

| Thema | Grundlage (Variablen) | Aufgabe (Variablen) | Art | Zeit |
|---|---|---|---|---|
| 1 Mehrere Fragen, ein Wert: der Mittelwertindex | 1a Warum mehrere Fragen? (konstruiertes Beispiel), 1b Eine Reihe, ein Wert (`row_means`, `min_valid`; konstruierte Steine), 1c Der Index im ALLBUS (Geflüchtete: Chance oder Risiko, mp16–mp19, gewichtet) | A1 „Wie populistisch denken die Befragten?“ (pa29–pa35; `row_means`, `min_valid`, `describe` ohne und mit Gewicht) | **Pflicht** | G 12, A 12 Min. |
| 2 Passen die Fragen zusammen? Cronbachs α | 2a Stimmig heißt: dieselben Menschen antworten ähnlich (Verbundenheit pn12, pn13, pn16, pn17; Korrelationstabelle), 2b Formel lesen lernen mit α-Rechner, 2c Die Ausgabe von `reliability()` (pn…) | A2 „Messen die sieben Aussagen dasselbe?“ (pa29–pa35; α, Trennschärfe, α ohne Item) | **Pflicht** | G 15, A 13 Min. |
| 3 Alle in eine Richtung: Umpolen | 3a Andersherum gefragt (Rollenbilder fr07, fr08, fr03b, fr04b), 3b Umpol-Labor (16 Zustände, α und Trennschärfen) | A3 „Andersherum gefragt: Einstellungen zu Islam und Muslimen“ (mm01–mm06; `rec(…, rules = "rev")` und `reliability()`) | **Pflicht** | G 10, A 14 Min. |
| 4 Ausgleichen oder alle? Mittelwert- und Kombinationsindex | 4a Ausgleich im Mittelwert (konstruiertes Beispiel), 4b Ein klassischer Kombinationsindex: Inglehart (va01–va04, ingle, gewichtet) | A4 „Im Schnitt oder durchgehend?“ (pa31, pa32, pa33; `rec()`, `row_sums()`, `frequency(…, weights = wghtpew)`) | Zusatz | G 8, A 12 Min. |
| Überblick | Vom Item zum Index in fünf Schritten, Welcher Index? (Entscheidungsbaum), Voraussetzungen | – | – | 5 Min. |

**Zeit (Seminar, 45 Minuten):** Pflicht A1 12, A2 13, A3 14 Minuten, zusammen etwa 39 Minuten (gemessen an einer langsamen Bearbeitung: Vorlage ausführen, Ausgabe suchen, je Frage etwa eine Minute; A1 und A3 haben je einen Anpassungsschritt mit erneutem Ausführen). A4 als Zusatz etwa 12 Minuten.

**Variablen:** Grundlagen (mp16–mp19, pn12/pn13/pn16/pn17, fr07/fr08/fr03b/fr04b, va01–va04/ingle) und Aufgaben (pa29–pa35, mm01–mm06) überschneiden sich nicht. Keine dieser Variablen ist Grundlage oder Pflichtaufgabe einer früheren Sitzung (früher genutzt: pa35 nur in einer Probier-Werkstatt von Sitzung 5; mp05 und vm… nur in Sitzung 4; pt… in Sitzung 7). Alle Batterien stehen im ALLBUS 2023 nur in einem Teil der Fragebögen (Split): daher n um 3.400 bis 3.600.

---

## 3 Vorweg: R lesen

### Karte R1 „Startblock und Umpolen: kennst du schon“ (Schilder: „Startblock: kennst du aus Sitzung 1“, „mutate() und rec(): kennst du aus Sitzung 5“, „Code lesen“)

Text: „Den Startblock kennst du aus Sitzung 1: Er lädt die Werkzeuge und legt den ALLBUS unter dem Namen `allbus` ab. In RStudio führst du ihn zu Beginn aus. In der Code-Werkstatt hier auf der Seite ist das schon erledigt.“

Vorlage `start` (Kopieren, ohne Ausführen-Knopf wie in Sitzung 4):

```r
# Pakete laden und Daten einlesen
library(tidyverse)
library(mariposa)

allbus <- read_spss("ZA8831_v1-3-0.sav")
```

Hilfezeile: „Rote Zeilen beim Laden, etwa „Attaching core tidyverse packages“, sind normal und kein Fehler. Öffne RStudio über dein Projekt. Findet R die Datei nicht, nimm wie in Sitzung 1 `allbus <- read_spss(file.choose())`.“

Text: „In Sitzung 5 hast du mit `mutate()` und `rec()` neue Variablen gebaut. Eine Regel davon brauchst du heute oft: `rules = "rev"` dreht eine Skala um. Aus der kleinsten Zahl wird die größte und umgekehrt; die Wörter wandern mit. Führe die Vorlage aus: Bei Code 1 steht jetzt STIMME GAR NICHT ZU.“

```r
# Umpolen wie in Sitzung 5: aus 1 wird 4, aus 2 wird 3 und so weiter
allbus %>%
  mutate(
    fr03b_um = rec(fr03b, rules = "rev")
  ) %>%
  frequency(fr03b_um)
```

Ausgabe zur Kontrolle (Auszug): Code 1 STIMME GAR NICHT ZU 1098; Code 4 STIMME VOLL ZU 366 (vorher Code 1). Variablenlabel mit dem Zusatz `(recoded)`.

Text: „Wie in Sitzung 5 steht `mutate()` direkt in der Kette: Es baut die neue Variable, und die nächste Zeile benutzt sie sofort. So läuft jede Vorlage für sich. In RStudio bleibt die neue Variable danach nicht im Datensatz. Willst du sie behalten, legst du das Ergebnis wie in Sitzung 5 wieder unter `allbus` ab: `allbus <- allbus %>% mutate(…)`.“

Kurz gesagt: „`mutate()` stellt neue Türme auf die Bauplatte, `rec(x, rules = "rev")` baut einen umgedrehten Turm. In einer Kette benutzt die nächste Zeile ihn gleich weiter.“

Häufige Verwechslung: „Umpolen ändert nicht die Meinung der Befragten, nur die Zahl, die für sie steht. Aus STIMME VOLL ZU wird nicht „stimme nicht zu“; das Wort bleibt, nur sein Code wechselt von 1 auf 4.“

### Karte R2 „Neu heute: ein Wert je Person und die Stimmigkeit“ (Schilder: „row_means(), pick(), reliability(): neu heute“, „describe() mit Gewicht: kennst du aus Sitzung 6“, „summary(): kennst du aus Sitzung 7“, „Code lesen“)

Text: „Bisher hat jede Funktion einen Turm angeschaut: `describe(age)` fasst alle Werte einer Variable zusammen. Heute rechnest du quer dazu, innerhalb einer Person. `row_means()` nimmt aus jeder Reihe der Bauplatte die Antworten auf mehrere Fragen und bildet ihren Mittelwert. So entsteht ein neuer Turm mit einem Wert je Person.“

**Zeilenbild R2** (Bausteine wie in Sitzung 4, R1; HTML, kein SVG), zweizeilig:
- Zeile 1: `fluechtlinge =` (neuer Name) | `row_means(` (Funktion: Mittelwert je Reihe) | `pick(mp16, mp17, mp18, mp19)` (welche Türme) | `, min_valid = 3` (mindestens so viele gültige Antworten) | `)`
- Darunter: „Nimm für jede Person die Antworten auf mp16 bis mp19 und bilde ihren Mittelwert, aber nur, wenn mindestens drei davon gültig sind. Sonst bleibt der Wert leer (NA).“

Vorlage `r_rowmeans`:

```r
# Ein Wert je Person: Mittelwert der vier Fragen zu Geflüchteten
allbus %>%
  mutate(
    fluechtlinge = row_means(pick(mp16, mp17, mp18, mp19), min_valid = 3)
  ) %>%
  describe(fluechtlinge, weights = wghtpew)
```

Ausgabe zur Kontrolle: `fluechtlinge  2.457   2.500  0.838  4.000  1.000     0.094  3473     1773` (Mean, Median, SD, Range, IQR, Skewness, N, Missing; gewichtet).

Text: „`reliability()` prüft, ob mehrere Fragen stimmig dasselbe messen. Kurz gibt es eine Zeile mit Cronbachs α; mit `summary()` bekommst du eine Tabelle mit einer Zeile je Frage. Was die Zahlen bedeuten, lernst du in Grundlage 2.“

Vorlage `r_reliability`:

```r
# Wie zuverlässig messen die vier Fragen zur Verbundenheit zusammen? Kurz
allbus %>%
  reliability(pn12, pn13, pn16, pn17)

# Dasselbe ausführlich, mit einer Zeile je Item
allbus %>%
  reliability(pn12, pn13, pn16, pn17) %>%
  summary()
```

Ausgabe zur Kontrolle (kurz): `Cronbach's Alpha = 0.726 (Acceptable), McDonald's Omega = 0.733, N = 3521`.

Kurz gesagt: „`row_means(pick(…), min_valid = …)` steht in `mutate()` und bildet einen Mittelwert je Person. `pick()` wählt die Türme aus, `min_valid` sagt, wie viele gültige Antworten jemand mindestens braucht. `reliability()` misst, wie stimmig die Fragen zusammen sind.“

Genauer erklärt „Wie R diese Ausgaben schreibt“:
- „`describe()` mit Gewicht zählt bei N die Gewichte zusammen (kennst du aus Sitzung 6). Darum steht dort 3473, obwohl 3.482 Personen einen Wert haben. Wie viele Personen einen Wert bekommen, siehst du ohne Gewicht.“
- „`reliability()` rechnet nur mit Befragten, die alle genannten Fragen beantwortet haben (N listwise). Darum ist N dort oft kleiner als bei einer einzelnen Frage.“
- „Neben α steht ein Wort: Excellent, Good, Acceptable, Questionable oder Poor. Das ist die Faustregel, mit der mariposa α einstuft (Grundlage 2c).“
- „Mehr dazu im R-Workshop, Kapitel 5 (Skalen bilden mit `row_means`) und Kapitel 8 (`reliability`).“

Häufige Verwechslung: „`row_means(mp16, mp17)` ohne `pick()`: R meldet „`data` must be a data frame or tibble“. Die Fragen gehören in `pick()`, und `pick()` funktioniert nur in `mutate()`.“

---

## 4 Thema 1: Mehrere Fragen, ein Wert: der Mittelwertindex

### Grundlage 1 „Mehrere Fragen, ein Wert“ (Kopf: „Grundlage zu Aufgabe 1“, Link „Schon klar? Direkt zu Aufgabe 1 ↓“)

Unterzeile: „Warum fragt man dasselbe mehrmals, und wie wird daraus eine Zahl je Person? Drei kurze Schritte, etwa 12 Minuten.“

#### Karte 1a „Warum mehrere Fragen?“ (Schilder: „Messfehler: Wiederholung aus der Vorlesung“, „mp16 bis mp19: kennst du aus Sitzung 1“, „Im Bild“)

Beispiel zuerst: „Wie sehen die Menschen in Deutschland Geflüchtete: eher als Chance oder eher als Risiko? Die vier Fragen dazu hast du in Sitzung 1 mit `find_var()` gefunden. Eine einzige Frage reicht dafür nicht. Jemand denkt vielleicht beim Sozialstaat an Risiken, bei der Wirtschaft an Chancen. Der ALLBUS 2023 fragt deshalb viermal: Bringen Geflüchtete für den Sozialstaat, für die Sicherheit, für das Zusammenleben und für die Wirtschaft eher Chancen oder eher Risiken? Antworten von 1 „Risiko überwiegt“ bis 5 „Chance überwiegt“.“

Text: „Die vier Fragen bekommen verschiedene Antworten. „Risiko“ (1 oder 2) sagen beim Sozialstaat 64,9 %, bei der Sicherheit 69,2 %, beim Zusammenleben 49,4 % und bei der Wirtschaft nur 38,7 % (gewichtet). Jede Frage trifft einen anderen Ausschnitt desselben Themas.“

**Bild B1 `s8-messfehler` (statisch):**
- Waagerechte Achse von 1 bis 5 (Striche bei 1, 2, 3, 4, 5; links Beschriftung „Risiko überwiegt“, rechts „Chance überwiegt“), Leinwand etwa 7 × 2,6.
- Oben links Notiz (grau, kursiv): „zum Beispiel eine Befragte“.
- Vier blaue Steine (Baukasten-Blau) über der Achse an ihrer Antwort, jeder mit kleinem Etikett darüber: „Sozialstaat“ bei 2, „Sicherheit“ bei 2, „Zusammenleben“ bei 3, „Wirtschaft“ bei 4 (die beiden Steine bei 2 übereinander gestapelt).
- Ein grünes Dreieck unter der Achse bei 2,75 mit Beschriftung „Mittelwert 2,75“.
- Ein grauer gestrichelter senkrechter Strich über die ganze Höhe bei 2,75, oben beschriftet „ihre Haltung, geschätzt aus vier Fragen“.
- Farben: Steine Blau, Dreieck Grün, Strich Grau; keine weiteren Farben.

**Textfassung B1:** „Eine Achse von 1, Risiko überwiegt, bis 5, Chance überwiegt. Eine Befragte, zum Beispiel, antwortet beim Sozialstaat 2, bei der Sicherheit 2, beim Zusammenleben 3 und bei der Wirtschaft 4. Ihr Mittelwert aus den vier Antworten liegt bei 2,75. Er beschreibt ihre Haltung zum Thema insgesamt besser als jede einzelne Antwort.“

**Kurz überlegen** (Auswahl, Knopf „Auflösen“): „Welche Zahl beschreibt die Haltung dieser Befragten zu Geflüchteten insgesamt am besten?“ Optionen: „ihre Antwort zur Wirtschaft (4)“, „ihre Antwort zum Sozialstaat (2)“, „der Mittelwert der vier Antworten (2,75)“.
- Ziel: dritte.
- richtig: „Genau. Jede einzelne Frage trifft nur einen Ausschnitt und enthält auch Zufall: einen schlechten Tag, eine missverstandene Formulierung. Im Mittelwert gleichen sich solche Ausrutscher teilweise aus.“
- falsch: „Eine einzelne Frage zeigt nur einen Ausschnitt. Mit der Wirtschaft allein wäre sie eher bei „Chance“, mit dem Sozialstaat allein eher bei „Risiko“. Der Mittelwert nimmt alle vier Ausschnitte zusammen.“

Kurz gesagt: „Einstellungen wie „Haltung zu Geflüchteten“ oder „Populismus“ kann man nicht direkt beobachten. Man fragt deshalb mehrere **Items** (einzelne Fragen oder Aussagen) und fasst sie zu einem **Index** zusammen. Jedes Item hat einen eigenen **Messfehler**; im Mittelwert mehrerer Items gleichen sich zufällige Fehler teilweise aus.“

Genauer erklärt „Index, Skala, Item“:
- „Ein **Item** ist eine einzelne Frage mit ihren Antworten, etwa mp16. Eine **Itembatterie** sind mehrere Items, die nacheinander mit denselben Antworten gestellt werden.“
- „Ein **Index** fasst mehrere Items nach einer Regel zu einer neuen Variable zusammen. Die häufigste Regel ist der Mittelwert: der **Mittelwertindex**. Sind die Items vorher auf Stimmigkeit geprüft, spricht man oft von einer **Skala**. Im Alltag werden beide Wörter fast gleich gebraucht.“
- „Der gemeinsame Begriff hinter den Items heißt **Konstrukt** oder latente Variable: etwas, das wir nicht sehen, aber an mehreren Antworten ablesen wollen.“
- „Mehrere Items helfen gegen zufällige Fehler. Gegen einen gemeinsamen Fehler helfen sie nicht: Wenn alle vier Fragen etwas anderes messen als gedacht, misst auch ihr Mittelwert das Falsche. Das ist eine Frage der **Validität** (Gültigkeit), nicht der Genauigkeit.“

Häufige Verwechslung: „Ein Index ist kein Mittelwert über alle Befragten. Er ist ein Wert **je Person**, also eine neue Variable. Den Mittelwert über alle Befragten rechnest du danach, wie bei jeder Variable, mit `describe()`.“

#### Karte 1b „Eine Reihe, ein Wert“ (Schilder: „Bauplatte, Turm, Stein: kennst du aus Sitzung 2“, „Im Bild“)

Beispiel zuerst: „Auf der Bauplatte ist jede Variable ein Turm und jede Person eine Reihe. Für einen Index schaust du nicht in einen Turm, sondern quer durch eine Reihe: Welche vier Antworten hat diese Person gegeben? Hier drei Befragte, zum Beispiel. Person B hat eine Frage nicht beantwortet. Geh die Schritte durch.“

**Bild B2 `s8-reihe` (interaktiv, Schrittleiste mit drei Knöpfen „Schritt 1: Reihe lesen“, „Schritt 2: Mittelwert der Reihe“, „Schritt 3: neuer Turm“; dazu ein Umschalter `min_valid` mit zwei Stellungen „min_valid = 4“ und „min_valid = 3“, Voreinstellung 3):**
- Bauweise wie `kap04.lstein` und `kap04.kopf`; Leinwand etwa 8 × 4.
- Oben links Notiz (grau, kursiv): „zum Beispiel drei Befragte“.
- Bauplatte mit vier Türmen `mp16`, `mp17`, `mp18`, `mp19` (Typ `<dbl+lbl>` grau darüber) und drei Reihen:
  - Person A: 2, 2, 3, 4
  - Person B: 1, 1, 2, leerer gestrichelter Stein (NA)
  - Person C: 4, 3, 5, 4
- **Schritt 1:** Die Reihe von Person A wird orange umrandet (waagerechter Rahmen über alle vier Türme). Text im `aria-live`: „Person A: 2, 2, 3 und 4.“
- **Schritt 2:** Rechts neben jeder Reihe erscheint ein Formel-Baustein „(2 + 2 + 3 + 4) / 4 = 2,75“, „(1 + 1 + 2) / 3 = 1,33“, „(4 + 3 + 5 + 4) / 4 = 4“. Bei Person B ist der leere Stein grau und trägt die Notiz „zählt nicht mit“.
- **Schritt 3:** Rechts entsteht ein neuer Turm `fluechtlinge` (Typ `<dbl>`; grüne Steine) mit 2,75; 1,33; 4. Steht der Umschalter auf „min_valid = 4“, ist der Stein von Person B ein leerer gestrichelter Stein (NA) mit der Notiz „nur 3 von 4 gültig“, und die Formel bei B wird grau durchgestrichen.
- Farben: Steine Blau, neuer Turm Grün, Hervorhebung Orange, leer gestrichelt, grau = fällt weg.

**Textfassung B2 (je Schritt im `aria-live`-Bereich; als Ganzes unter dem Bild):** „Eine Bauplatte mit den vier Türmen mp16 bis mp19 und drei Befragten, zum Beispiel. Person A antwortet 2, 2, 3 und 4, ihr Mittelwert ist 11 geteilt durch 4, also 2,75. Person B antwortet 1, 1 und 2, eine Antwort fehlt; ihr Mittelwert aus drei gültigen Antworten ist 4 geteilt durch 3, also 1,33. Person C antwortet 4, 3, 5 und 4, ihr Mittelwert ist 4. Der neue Turm fluechtlinge enthält 2,75, 1,33 und 4. Mit min_valid gleich 4 bekommt Person B keinen Wert, ihr Stein bleibt leer, weil sie nur drei von vier Fragen beantwortet hat.“

**Formel lesen lernen (unter dem Bild, Bild B2b `s8-formel-index`, Formel als Bausteine wie in Sitzung 4, 1b):** Bruch aus zwei Bausteinen „Summe der gültigen Antworten einer Person“ (oben) und „Anzahl ihrer gültigen Antworten“ (unten), daneben „= Indexwert“. Darunter Bedingung als dritter Baustein (gelb): „nur wenn Anzahl gültiger Antworten ≥ min_valid, sonst leer (NA)“. Eingesetzt: „Person B: (1 + 1 + 2) / 3 = 1,33, denn 3 ≥ 3“.
Textfassung B2b: „Indexwert gleich Summe der gültigen Antworten einer Person geteilt durch die Anzahl ihrer gültigen Antworten. Das gilt nur, wenn die Anzahl gültiger Antworten mindestens min_valid ist, sonst bleibt der Wert leer. Für Person B: 1 plus 1 plus 2 gleich 4, geteilt durch 3 ergibt 1,33.“

**Kurz überlegen** (Zahlenfeld, Prüfen-Knopf): „Welchen Indexwert bekommt Person B mit `min_valid = 3`?“ Hilfezeile: „Eine Kommazahl reicht, zum Beispiel 2,5.“
- Ziel 1,33, Toleranz 0,01.
- richtig: „1,33: Drei gültige Antworten, 1 + 1 + 2 = 4, geteilt durch 3. Die fehlende Antwort zählt nicht als 0, sie fällt einfach weg.“
- Sonderfall 1 (± 0,01): „Das wäre (1 + 1 + 2 + 0) / 4: Dann zähltest du die fehlende Antwort als 0. `row_means()` lässt sie weg und teilt durch 3.“
- falsch sonst: „Zähl nur die gültigen Antworten zusammen und teile durch ihre Anzahl.“

Kurz gesagt: „Ein **Mittelwertindex** ist der Mittelwert der gültigen Antworten einer Person: ein neuer Turm mit einem Wert je Reihe. **`min_valid`** legt fest, wie viele gültige Antworten jemand mindestens braucht, um einen Wert zu bekommen. Ohne `min_valid` reicht eine einzige Antwort.“

Genauer erklärt „Wie streng soll min_valid sein?“:
- „Mit `min_valid` gleich der Zahl der Items bekommt nur einen Wert, wer alle Fragen beantwortet hat. Das ist streng, aber jeder Wert beruht auf denselben Fragen.“
- „Eine verbreitete Faustregel: mindestens zwei Drittel der Items oder mehr als die Hälfte. Bei vier Items also 3, bei sieben Items 5. Wichtig ist, dass du die Regel nennst.“
- „Bei den Fragen zu Geflüchteten haben 3.424 Befragte alle vier beantwortet, 58 drei, 15 zwei und 7 nur eine. Mit `min_valid = 4` bekommen 3.424 einen Wert, mit `min_valid = 3` sind es 3.482, ganz ohne `min_valid` 3.504.“
- „Warum der Mittelwert und nicht die Summe? Die Summe hängt davon ab, wie viele Fragen jemand beantwortet hat: Wer nur eine Frage beantwortet, hat eine kleine Summe und sähe aus wie jemand mit viel „Risiko“. Ohne `min_valid` reicht die Summe der vier Fragen im ALLBUS von 2 bis 20, obwohl mit allen vier Antworten nur 4 bis 20 möglich sind. Der Mittelwert bleibt auf der Antwortskala von 1 bis 5 und lässt sich wie eine Antwort lesen. Eine Summe (`row_sums()`) nimmst du, wenn du etwas zählen willst (Thema 4).“

Häufige Verwechslung: „Eine fehlende Antwort ist keine 0. `row_means()` lässt sie weg und teilt durch die Zahl der gültigen Antworten. Würde sie als 0 zählen, sähe Person B noch viel mehr nach „Risiko“ aus, nur weil sie eine Frage übersprungen hat.“

#### Karte 1c „Der Index im ALLBUS“ (Schilder: „Gewichtet: kennst du aus Sitzung 6“, „Im Bild“)

Beispiel zuerst: „So verteilt sich der Index über alle Befragten, die alle vier Fragen beantwortet haben (gewichtet). Weil ein Mittelwert aus vier Antworten auch Zwischenwerte hat, gibt es 17 mögliche Werte: 1; 1,25; 1,5 … 5.“

**Bild B3 `s8-index-fluechtlinge` (statisch, Stapel wie in Sitzung 4, Säulen):**
- x-Achse: Indexwert 1 bis 5 in Viertelschritten (17 Säulen), Beschriftung unten „1 Risiko überwiegt“, „3 weder noch“, „5 Chance überwiegt“ an den passenden Stellen; y-Achse: Prozent der Befragten mit Indexwert (gewichtet), 0 bis 14, Striche bei 0, 5, 10.
- Säulenhöhen (Valid %, gewichtet): 1: 8,31; 1,25: 3,73; 1,5: 6,15; 1,75: 6,52; 2: 12,48; 2,25: 9,33; 2,5: 10,51; 2,75: 8,87; 3: 12,63; 3,25: 7,36; 3,5: 6,20; 3,75: 4,25; 4: 2,11; 4,25: 0,70; 4,5: 0,25; 4,75: 0,09; 5: 0,51.
- Säulen unter 3 in Baukasten-Blau, die Säule bei 3 grau, Säulen über 3 in Grün. Grünes Dreieck unter der Achse beim Mittelwert 2,45, gestrichelter Strich beim Median 2,5.
- Bildunterschrift: „Index aus mp16 bis mp19, nur Befragte mit allen vier Antworten (min_valid = 4). ALLBUS 2023, gewichtet, n = 3.424 Befragte. Mit min_valid = 3 kommen 58 Befragte dazu, die auch Drittelwerte wie 2,33 haben können (zusammen 1,15 %); das Bild ändert sich dadurch kaum, der Mittelwert steigt nur von 2,452 auf 2,457 (die Zahl aus der Vorlage in „R lesen“).“

**Textfassung B3:** „Säulendiagramm des Index von 1 bis 5 in Viertelschritten, gewichtet, nur Befragte mit allen vier Antworten. Prozent je Wert: 1: 8,31; 1,25: 3,73; 1,5: 6,15; 1,75: 6,52; 2: 12,48; 2,25: 9,33; 2,5: 10,51; 2,75: 8,87; 3: 12,63; 3,25: 7,36; 3,5: 6,20; 3,75: 4,25; 4: 2,11; 4,25: 0,70; 4,5: 0,25; 4,75: 0,09; 5: 0,51. Unter 3 liegen zusammen 65,90 Prozent, genau 3 haben 12,63 Prozent, über 3 liegen 21,46 Prozent. Mittelwert 2,45, Median 2,5.“ Zusätzlich als Tabelle Wert | Prozent | kumuliert (Cum. % aus R) in einem `details` „Alle Werte als Tabelle“; kumuliert: 8,31; 12,04; 18,19; 24,71; 37,19; 46,52; 57,03; 65,90; 78,54; 85,90; 92,10; 96,35; 98,45; 99,16; 99,41; 99,49; 100.

**Kurz überlegen** (Zahlenfeld, Prüfen-Knopf): „Wie viel Prozent der Befragten sehen Geflüchtete insgesamt eher als Risiko, haben also einen Indexwert unter 3?“ Hilfezeile: „Zähl die blauen Säulen zusammen oder lies die Tabelle unter dem Bild. Eine Kommazahl reicht.“
- Ziel 65,90, Toleranz 0,5 (Zusammenzählen gerundeter Säulen ist erlaubt).
- richtig: „Knapp zwei Drittel (65,9 %) haben einen Wert unter 3. Nur gut jeder Fünfte (21,5 %) liegt über 3, also eher bei „Chance“.“
- Sonderfall 78,54 (± 0,5): „Da ist die Säule bei genau 3 mitgezählt. 3 heißt „weder noch“; gefragt ist „unter 3“.“
- falsch sonst: „Zähl die Säulen von 1 bis 2,75 zusammen oder lies „kumuliert“ in der Zeile 2,75.“

Kurz gesagt: „Den Index liest du wie die Antwortskala: Hier heißt ein niedriger Wert „eher Risiko“, ein hoher „eher Chance“. Wie bei jeder Variable gehören Verteilung, Mittelwert, Median und n in den Bericht, und dazu die Regel, wer einen Wert bekommt.“

Genauer erklärt „Was ein Indexwert von 2,5 heißt“:
- „2,5 liegt zwischen „eher Risiko“ (2) und „weder noch“ (3). Es kann heißen: viermal ungefähr 2 oder 3, oder zweimal 1 und zweimal 4. Der Index zeigt die Gesamttendenz, nicht das Muster dahinter (mehr dazu in Thema 4).“
- „Die Zahlen sind gewichtet, weil sie etwas über alle Menschen in Deutschland sagen. Wie viele Personen einen Wert haben (3.424 mit allen vier Antworten), zählst du ohne Gewicht.“

Häufige Verwechslung: „Die Richtung eines Index ergibt sich aus den Items, nicht aus dem Wort „Index“. Bei diesen Fragen ist 1 „Risiko“; ein niedriger Wert heißt also nicht „wenig Haltung“, sondern „eher Risiko“. Schau immer nach, wofür die 1 steht.“

Link: „→ In der freien Karte: Mittelwertindex“ (Begriff `row_operations`), „→ Skalenwert pro Person“ (Begriff `item_score`).

### Aufgabe 1 „Wie populistisch denken die Befragten?“ (Pflicht)

Link „↑ Grundlage 1 nachlesen“.

Leitfrage: „Wie misst man Populismus mit sieben Aussagen, und wer bekommt einen Wert?“

Ziel: „Am Ende hast du für jede befragte Person einen Populismus-Wert gebildet, weißt, wie viele Befragte einen Wert bekommen, und kannst den Mittelwert in Worten deuten.“

Grundlage: „Grundlage 1, Mehrere Fragen, ein Wert; Vorweg: Karte R2“.

Einleitung: „Populismus heißt grob: Man sieht „das Volk“ als Einheit gegen eine abgehobene Elite und will, dass das Volk selbst entscheidet. Der ALLBUS 2023 hat dazu sieben Aussagen gestellt (nur in einem Teil der Fragebögen). Antworten: 1 stimme voll zu, 2 stimme eher zu, 3 teils/teils, 4 lehne eher ab, 5 lehne ganz ab.“

Liste (als Tabelle mit Spalten „Variable“ und „Aussage“):
- pa29 „Die Abgeordneten im Bundestag sollten sich nur dem Willen des Volkes verpflichtet fühlen.“
- pa30 „Die Politiker reden zu viel und handeln zu wenig.“
- pa31 „Ein einfacher Bürger würde meine Interessen besser vertreten als ein Berufspolitiker.“
- pa32 „Was man in der Politik „Kompromiss“ nennt, ist in Wirklichkeit nur ein Verrat der eigenen Prinzipien.“
- pa33 „Das Volk, nicht die Politiker, sollte die wichtigsten politischen Entscheidungen treffen.“
- pa34 „Die Bürger sind sich im Prinzip einig darüber, was politisch passieren muss.“
- pa35 „Politiker vertreten nur die Interessen der Reichen.“

**Erst festlegen** (Optionsfelder, „Tipp abgeben“ sperrt; Rückmeldung „Festgelegt: … Die Auflösung bekommst du, wenn du am Ende der Aufgabe deine Antworten prüfst.“): „Wo liegt der Mittelwert des Populismus-Index ungefähr?“ Optionen: „unter 3: im Mittel eher Zustimmung“, „um 3: im Mittel teils/teils“, „über 3: im Mittel eher Ablehnung“.

Text: „Arbeite in der Code-Werkstatt direkt hier oder in RStudio. In RStudio führst du vorher den Startblock aus „R lesen“ aus.“

**Schritte:**

1. „Bilde den Index und zähle, wie viele Befragte einen Wert bekommen. Die Vorlage verlangt alle sieben Antworten (`min_valid = 7`). Führe sie aus, lies N und merk dir die Zahl (Frage a1a).“ Schilder „row_means(): neu heute“, „describe(): kennst du aus Sitzung 3“.

```r
# Populismus-Index: Mittelwert der sieben Aussagen je Person
# Wie viele Befragte bekommen einen Wert? Personen zählst du ohne Gewicht.
allbus %>%
  mutate(
    populismus = row_means(pick(pa29, pa30, pa31, pa32, pa33, pa34, pa35), min_valid = ⟦7⟧)
  ) %>%
  describe(populismus)
```

Ausgabe mit 7: `populismus  2.604   2.571  0.769  4.000  1.143    -0.043  3427     1819`.

2. „Wer eine oder zwei der sieben Aussagen nicht beantwortet hat, soll trotzdem einen Wert bekommen. Setz die markierte Zahl auf 5 (mindestens fünf von sieben) und führe die Vorlage erneut aus. Wie viele sind es jetzt?“

**Bild B-A1 `s8-min-valid` (statisch, steht unter Schritt 2):**
- Bauplatte mit sieben Türmen `pa29` … `pa35` und fünf Reihen, zum Beispiel fünf Befragte; Spalte rechts „gültig“ mit der Zahl gültiger Steine je Reihe.
  - Reihe 1: 1, 2, 3, 2, 2, 4, 3 → gültig 7
  - Reihe 2: 2, 2, leer, 3, 2, 3, 2 → gültig 6
  - Reihe 3: 1, leer, 2, leer, 1, 2, 1 → gültig 5
  - Reihe 4: leer, leer, leer, 3, leer, 4, leer → gültig 2
  - Reihe 5: alle sieben leer, Aufkleber TNZ: SPLIT am ersten Stein → gültig 0
- Daneben zwei schmale Türme `min_valid = 7` und `min_valid = 5` mit je fünf Steinen: bei 7 grüne Steine nur in Reihe 1 (2,43), sonst leer; bei 5 grüne Steine in Reihe 1 (2,43), Reihe 2 (2,33), Reihe 3 (1,40), Reihen 4 und 5 leer. Leere Reihen grau.
- Bildunterschrift: „Je kleiner min_valid, desto mehr Befragte bekommen einen Wert. Wer die Fragen gar nicht bekam (Split), bekommt nie einen. Die Steine sind ein Beispiel mit fünf Befragten.“
- Textfassung: „Fünf Befragte, zum Beispiel. Reihe 1 hat sieben gültige Antworten: 1, 2, 3, 2, 2, 4, 3, Mittelwert 2,43. Reihe 2 hat sechs: 2, 2, 3, 2, 3, 2, Mittelwert 2,33. Reihe 3 hat fünf: 1, 2, 1, 2, 1, Mittelwert 1,40. Reihe 4 hat zwei gültige Antworten, Reihe 5 keine, weil die Fragen dort nicht gestellt wurden. Mit min_valid gleich 7 bekommt nur Reihe 1 einen Wert, mit min_valid gleich 5 die Reihen 1, 2 und 3.“

3. „Jetzt die Aussage über die Bevölkerung: Wie populistisch sind die Befragten im Mittel? Dafür rechnest du mit Gewicht. Die Vorlage baut den Index wie in Schritt 1, mit `min_valid = 5`.“ Schild „weights = wghtpew: kennst du aus Sitzung 6“.

```r
# Populismus-Index wie in Schritt 1, mit mindestens fünf von sieben Antworten
# Wie populistisch sind die Befragten im Mittel? Aussage über alle: mit Gewicht
allbus %>%
  mutate(
    populismus = row_means(pick(pa29, pa30, pa31, pa32, pa33, pa34, pa35), min_valid = 5)
  ) %>%
  describe(populismus, weights = wghtpew)
```

Ausgabe: `populismus  2.646   2.714  0.760  4.000  1.000    -0.051  3591     1655`.

4. „Deuten: Was heißt der Mittelwert? Achte auf die Richtung der Antworten: 1 heißt „stimme voll zu“. (Frage a1e unten)“

**Weiterdenken in der Probier-Werkstatt (für die Aufgabe nicht nötig),** zugeklappt: „Für die Aufgabe reichen die Vorlagen oben. Hier ist Platz für eigene Fragen. Eine Idee: Unterscheiden sich Westen und Osten im Populismus-Index? Die Probier-Werkstatt startet mit einem Vorschlag.“

```r
# Eine Idee: Populismus-Index wie in Aufgabe 1, Westen und Osten im Vergleich
# (t-Test kennst du aus Sitzung 7)
allbus %>%
  mutate(
    populismus = row_means(pick(pa29, pa30, pa31, pa32, pa33, pa34, pa35), min_valid = 5)
  ) %>%
  t_test(populismus, group = eastwest, weights = wghtpew) %>%
  summary()
```

(Zur Information für den Plan, nicht im Kapitel: gewichtet West 2,694 (N 2.983), Ost 2,412 (N 608); Welch-t(856,1) = 8,264, p < 0,001, Hedges' g = 0,375 (small; wie in Sitzung 7 die Effektstärke aus der Kurzfassung). Der Osten hat den **niedrigeren** Wert und stimmt also im Mittel **mehr** zu. Eine gute Gelegenheit, die Richtung noch einmal zu üben.)

**Antwortfragen** („Antworten prüfen“, Rückmeldung je Frage mit ✓/✗ und Text, am Ende „Deine Festlegung vorher war: …“):

| id | Art | Label | Optionen | Ziel | Toleranz | Text richtig | Text falsch / Hinweis | Hilfezeile |
|---|---|---|---|---|---|---|---|---|
| a1a | number | Wie viele Befragte bekommen mit `min_valid = 7` einen Indexwert? | – | 3427 | 0 | „3.427 Befragte haben alle sieben Aussagen beantwortet.“ | 3595: „Das ist N mit min_valid = 5 aus Schritt 2. Gefragt ist die erste Ausgabe mit 7.“<br>3416: „Das ist N mit Gewicht (Summe der Gewichte). Personen zählst du mit der Vorlage aus Schritt 1, ohne Gewicht.“<br>1819: „Das ist Missing: so viele bekommen keinen Wert.“<br>sonst: „Lies in der Ausgabe von Schritt 1 die Spalte N.“ | „Aus `describe(populismus)` in Schritt 1, Spalte N.“ |
| a1b | number | Wie viele Befragte bekommen mit `min_valid = 5` einen Indexwert? | – | 3595 | 0 | „3.595 Befragte, also 168 mehr als mit 7. Fast alle, die die Fragen bekommen haben, haben auch fast alle beantwortet.“ | 3427: „Das ist noch das Ergebnis mit 7. Setz die markierte Zahl auf 5 und führe die Vorlage erneut aus.“<br>3591: „Das ist N mit Gewicht aus Schritt 3. Personen zählst du ohne Gewicht (Schritt 1 mit 5).“<br>1651: „Das ist Missing.“<br>sonst: „Setz in Schritt 1 min_valid = 5 und lies N.“ | „Schritt 1 mit `min_valid = 5`, Spalte N.“ |
| a1c | choice | Wer bekommt mit `min_valid = 5` zusätzlich einen Wert? | eins: „Befragte, die eine oder zwei der sieben Aussagen nicht beantwortet haben“; null: „Befragte, die gar keine Aussage beantwortet haben“; split: „Befragte aus dem anderen Teil der Fragebögen (Split)“ | eins | – | „Genau. Sie haben fünf oder sechs gültige Antworten; ihr Wert ist der Mittelwert dieser Antworten.“ | null: „Wer keine Antwort hat, bekommt nie einen Wert, auch ohne min_valid nicht.“<br>split: „Wer die Fragen nicht bekam, hat keine einzige Antwort und bekommt nie einen Wert.“ | – |
| a1d | number | Wie hoch ist der gewichtete Mittelwert des Index (Schritt 3)? | – | 2.646 | 0.005 | „2,646: Im Mittel liegt der Index zwischen „stimme eher zu“ (2) und „teils/teils“ (3).“ | 2.602 oder 2.604 (± 0,002): „Das ist der Mittelwert ohne Gewicht aus Schritt 1. Für die Aussage über alle nimm Schritt 3.“<br>2.714 (± 0,002): „Das ist der Median. Gesucht ist Mean.“<br>sonst: „Lies in Schritt 3 die Spalte Mean.“ | „Aus Schritt 3, Spalte Mean. R schreibt Kommazahlen mit Punkt.“ |
| a1e | choice | Welcher Satz beschreibt den Mittelwert richtig? | zu: „Im Mittel stimmen die Befragten den Aussagen eher zu: Der Wert liegt zwischen „stimme eher zu“ (2) und „teils/teils“ (3).“; wenig: „Die Befragten sind im Mittel wenig populistisch, denn 2,65 ist ein niedriger Wert auf einer Skala bis 5.“; anteil: „2,65 von 5 Befragten sind populistisch.“ | zu | – | „Genau. Bei diesen Aussagen heißt eine kleine Zahl Zustimmung. Ein niedriger Index heißt also: eher populistisch.“ | wenig: „Achte auf die Richtung: 1 heißt „stimme voll zu“. Ein niedriger Wert bedeutet hier mehr Zustimmung, also eher populistisch.“<br>anteil: „Der Index ist ein Wert je Person auf der Antwortskala 1 bis 5, kein Anteil an Personen.“ | – |

**Hilfe, Stufe 1: Denkanstoß:** „Der Index ist ein Wert je Person: der Mittelwert ihrer gültigen Antworten. Mit `min_valid` bestimmst du, wie viele Antworten jemand mindestens braucht. Personen zählst du ohne Gewicht, den Mittelwert für alle rechnest du mit Gewicht.“

**Hilfe, Stufe 2: Wo schaue ich?:** „In jeder Ausgabe von `describe()` steht eine Zeile `populismus`. N ist die Zahl der Werte, Mean der Mittelwert. Für a1a und a1b nimmst du Schritt 1 (einmal mit 7, einmal mit 5), für a1d Schritt 3. Wofür 1 und 5 stehen, steht in der Einleitung.“

**Hilfe, Stufe 3: Lösung:** „Mit `min_valid = 7` bekommen 3.427 Befragte einen Wert, mit `min_valid = 5` sind es 3.595. Der gewichtete Mittelwert ist 2,646 (Median 2,714). Weil 1 „stimme voll zu“ heißt, bedeutet das: Im Mittel stimmen die Befragten eher zu, der Wert liegt zwischen „stimme eher zu“ und „teils/teils“.“

**Ohne Grafik lösbar:** „Alle Zahlen stehen in den Ausgaben von Schritt 1 und Schritt 3.“

---

## 5 Thema 2: Passen die Fragen zusammen? Cronbachs α

### Grundlage 2 „Passen die Fragen zusammen?“ (Kopf: „Grundlage zu Aufgabe 2“, Link „Schon klar? Direkt zu Aufgabe 2 ↓“)

Unterzeile: „Wann darf man Fragen zu einem Index zusammenfassen, und was misst Cronbachs α? Drei Schritte, etwa 15 Minuten.“

#### Karte 2a „Stimmig heißt: dieselben Menschen antworten ähnlich“ (Schilder: „Korrelation r: kennst du aus Sitzung 6“, „Korrelationsmatrix: kennst du aus Sitzung 7“, „Im Bild“)

Beispiel zuerst: „Wie verbunden fühlen sich die Menschen mit ihrer Gemeinde, ihrem Bundesland, Deutschland und der EU? Antworten von 1 „stark verbunden“ bis 4 „gar nicht verbunden“. Stark oder ziemlich verbunden fühlen sich mit der Gemeinde 65,7 %, mit dem Bundesland 63,3 %, mit Deutschland 70,9 % und mit der EU 49,5 % (gewichtet). Darf man daraus einen Index „Verbundenheit“ machen? Das hängt davon ab, ob dieselben Menschen bei allen vier ähnlich antworten.“

**Bild B4 `s8-korrelationen-pn` (interaktive Tabelle mit hervorgehobenen Zellen, als echte HTML-Tabelle mit `<caption>`, kein SVG):**
- 4 × 4-Tabelle der Korrelationen r (ungewichtet, listenweise n = 3.521), Zeilen und Spalten „Gemeinde (pn12)“, „Bundesland (pn13)“, „Deutschland (pn16)“, „EU (pn17)“; Diagonale 1 grau.
  - Gemeinde–Bundesland 0,568; Gemeinde–Deutschland 0,340; Gemeinde–EU 0,190; Bundesland–Deutschland 0,528; Bundesland–EU 0,304; Deutschland–EU 0,495.
- Zellen nach Stärke eingefärbt (Blau, drei Stufen: unter 0,3 hell, 0,3 bis 0,5 mittel, über 0,5 kräftig; Zahl immer dabei, Kontrast ≥ 4,5:1).
- Über der Tabelle vier Knöpfe (Umschalter, `aria-pressed`): „Gemeinde“, „Bundesland“, „Deutschland“, „EU“. Bei Auswahl werden Zeile und Spalte orange umrandet, darunter erscheint in `aria-live` die mittlere Korrelation dieses Items mit den drei anderen: Gemeinde 0,366; Bundesland 0,467; Deutschland 0,454; EU 0,330.
- Zustand ohne Auswahl: Text „Wähl eine Ebene.“
- Unter der Tabelle (klein, immer sichtbar): „Eine solche Tabelle kennst du aus Sitzung 7 (`pearson_cor()` mit mehreren Variablen). Ein Unterschied: Hier zählen nur die 3.521 Befragten, die alle vier Fragen beantwortet haben (listenweiser Ausschluss), nicht jedes Paar für sich. So rechnet auch Cronbachs α. Die Tabelle steht deshalb in der ausführlichen Ausgabe von `reliability()` gleich mit (Inter-Item Correlation Matrix, Karte 2c).“

**Textfassung B4:** Die Tabelle selbst (Spaltenköpfe `scope="col"`, Beschriftung „Korrelationen der vier Fragen zur Verbundenheit, ALLBUS 2023, ungewichtet, n = 3.521“) und darunter der Satz: „Am engsten hängen Gemeinde und Bundesland zusammen (0,568), am schwächsten Gemeinde und EU (0,190). Mittlere Korrelation mit den anderen drei: Gemeinde 0,366, Bundesland 0,467, Deutschland 0,454, EU 0,330.“

**Kurz überlegen** (Auswahl, Knopf „Auflösen“): „Welche Ebene passt am wenigsten zu den anderen drei?“ Optionen: „Gemeinde“, „Bundesland“, „Deutschland“, „EU“.
- Ziel: EU.
- richtig: „Genau. Die EU hängt mit den anderen im Mittel am schwächsten zusammen (0,330), besonders mit der Gemeinde (0,190). Wer sich mit seinem Ort verbunden fühlt, fühlt sich nicht unbedingt mit Europa verbunden.“
- Gemeinde: „Fast: Die Gemeinde hängt mit der EU kaum zusammen (0,190), mit dem Bundesland aber eng (0,568). Im Mittel ist die EU noch schwächer verbunden (0,330 gegen 0,366).“
- sonst: „Vergleich die mittlere Korrelation jeder Ebene mit den anderen drei.“

Kurz gesagt: „Items passen zusammen, wenn dieselben Menschen bei ihnen ähnlich antworten, wenn sie also positiv miteinander **korrelieren**. Je höher die Korrelationen, desto stimmiger misst der Index einen gemeinsamen Begriff. Diese Stimmigkeit heißt **Reliabilität** (Zuverlässigkeit); genauer: **interne Konsistenz**.“

Genauer erklärt „Reliabilität und Validität“:
- „**Reliabilität** fragt: Misst das Instrument zuverlässig, also mit wenig Zufall? Bei einem Index heißt das: Zeigen die Items in dieselbe Richtung und hängen sie eng zusammen?“
- „**Validität** fragt: Misst das Instrument das, was es messen soll? Vier Fragen zur Lieblingsfarbe könnten sehr stimmig sein und trotzdem keine Verbundenheit messen.“
- „Reliabilität ist eine Voraussetzung für Validität, aber kein Beweis dafür. Ob die Items den Begriff treffen, entscheidest du am Inhalt.“

Häufige Verwechslung: „Stimmig heißt nicht, dass alle gleich antworten. Die Antworten dürfen über die Befragten weit streuen. Stimmig heißt: Wer bei einem Item hoch liegt, liegt auch bei den anderen eher hoch.“

#### Karte 2b „Formel lesen lernen: Cronbachs α“ (Schilder: „Im Bild“, „Ausprobieren“)

Beispiel zuerst: „Cronbachs α fasst die Korrelationen aller Items in einer Zahl zusammen. In einer einfachen Form hängt α nur von zwei Dingen ab: wie viele Items es sind und wie eng sie im Mittel zusammenhängen.“

**Bild B5 `s8-formel-alpha` (Formel als Bausteine, HTML):**
- Kopf: **α** = Bruch: oben die Bausteine „k“ (blau, „Zahl der Items“) × „r̄“ (orange, „mittlere Korrelation“); unten „1 +“ „(k − 1)“ × „r̄“.
- Zeile 2 eingesetzt für die Verbundenheit: „k = 4, r̄ = 0,404: oben 4 × 0,404 = 1,616; unten 1 + 3 × 0,404 = 2,212; α = 1,616 / 2,212 = 0,731“.
- Zeile 3: „Die mittlere Korrelation 0,404 ist der Durchschnitt der sechs Zahlen aus der Tabelle: (0,568 + 0,340 + 0,190 + 0,528 + 0,304 + 0,495) / 6.“
- Textfassung B5: „Alpha gleich k mal r quer, geteilt durch 1 plus k minus 1 mal r quer. Dabei ist k die Zahl der Items und r quer die mittlere Korrelation zwischen ihnen. Für die Verbundenheit: k gleich 4, r quer gleich 0,404. Oben 4 mal 0,404 gleich 1,616, unten 1 plus 3 mal 0,404 gleich 2,212. 1,616 geteilt durch 2,212 ergibt 0,731.“

**α-Rechner (interaktiv, HTML):**
- Schieberegler „Zahl der Items k“: 2 bis 20, Schritt 1, Voreinstellung 4. Schieberegler „mittlere Korrelation r̄“: 0,00 bis 0,90, Schritt 0,01, Voreinstellung 0,40. Knopf „Verbundenheit einsetzen“ setzt k = 4 und r̄ = 0,404.
- Anzeige (in `aria-live`, 3 Nachkommastellen): die Formel mit eingesetzten Zahlen und „α = …“, daneben die Einstufung nach der Faustregel von mariposa (Grundlage 2c): ab 0,9 Excellent, ab 0,8 Good, ab 0,7 Acceptable, ab 0,6 Questionable, darunter Poor.
- Darunter ein waagerechter Balken von 0 bis 1 mit grauen Marken bei 0,6, 0,7, 0,8, 0,9 und einem grünen Punkt bei α.
- Rechnung: α = (k × r̄) / (1 + (k − 1) × r̄), auf drei Stellen gerundet.
- Textalternative (Tabelle „Beispiele“): k = 2, r̄ = 0,404: 0,575; k = 4, r̄ = 0,404: 0,731; k = 8, r̄ = 0,404: 0,844; k = 12, r̄ = 0,404: 0,891; k = 4, r̄ = 0,2: 0,500; k = 4, r̄ = 0,6: 0,857; k = 20, r̄ = 0,2: 0,833.

**Kurz überlegen** (Zahlenfeld, Prüfen-Knopf): „Angenommen, es gäbe acht statt vier Fragen zur Verbundenheit, mit derselben mittleren Korrelation 0,404. Wie groß wäre α?“ Hilfezeile: „Probier es im α-Rechner. Drei Nachkommastellen, zum Beispiel 0,123.“
- Ziel 0,844, Toleranz 0,005.
- richtig: „0,844. Die Items hängen nicht enger zusammen als vorher, aber es sind doppelt so viele. Darum steigt α von 0,731 auf 0,844.“
- Sonderfall 0,731 (± 0,005): „Das ist α für vier Items. Stell k auf 8.“
- falsch sonst: „Setz k = 8 und r̄ = 0,404 in die Formel oder in den Rechner ein.“

Kurz gesagt: „**Cronbachs α** liegt meist zwischen 0 und 1. Es steigt, wenn die Items enger zusammenhängen, **und** wenn es mehr Items sind. Ein hohes α heißt also nicht automatisch, dass die Items eng zusammenhängen; es können auch einfach viele sein.“

Genauer erklärt „Welches α druckt R?“:
- „Die Formel oben ist das **standardisierte α**; `summary()` zeigt es als „Alpha (standardized)“: für die Verbundenheit 0,731. Ganz oben steht „Cronbach's Alpha“ (0,726). Es rechnet mit den Varianzen der Antworten statt mit Korrelationen. Meist liegen beide nah beieinander; berichtet wird üblicherweise „Cronbach's Alpha“.“
- „Daneben druckt R **McDonalds ω** (Omega, 0,733). ω lässt jedes Item unterschiedlich stark am gemeinsamen Begriff hängen, α behandelt alle gleich. Liegen α und ω nah beieinander, ist das ein gutes Zeichen. In dieser Sitzung schaust du auf α.“
- „α kann auch negativ werden. Das passiert, wenn Items in verschiedene Richtungen zeigen (Thema 3).“

Häufige Verwechslung: „α ist kein Prozentwert und kein Anteil von Befragten. α = 0,73 heißt nicht „73 % antworten stimmig“, sondern: Die Items hängen so eng zusammen, dass ihr Mittelwert recht zuverlässig misst.“

#### Karte 2c „Die Ausgabe von reliability() lesen“ (Schilder: „summary(): kennst du aus Sitzung 7“, „Im Bild“)

Beispiel zuerst: „So sieht die ausführliche Ausgabe für die vier Fragen zur Verbundenheit aus (Vorlage in R lesen, Karte R2). Wähl eine Zahl und schau, was sie sagt.“

**Bild B6 `s8-reliability-ausgabe` (interaktive Tabelle wie B2 in Sitzung 3, echte HTML-Tabelle, Monospace):** zwei Teile der Ausgabe von `summary()`, wie R sie druckt:

```
Reliability Statistics
  Cronbach's Alpha:              0.726
  Alpha (standardized):          0.731
  McDonald's Omega:              0.733
  Omega (standardized):          0.738
  N of Items:                    4
  N (listwise):                  3521

Item-Total Statistics
        Scale Mean  Scale Var.   Corrected  Alpha if  Omega if
  Item  if Deleted  if Deleted  Item-Total   Deleted   Deleted
  pn12       7.001       3.407       0.457     0.700     0.717
  pn13       6.941       3.135       0.620     0.603     0.643
  pn16       7.020       3.265       0.603     0.617     0.668
  pn17       6.634       3.496       0.402     0.733     0.756
```

Über der Tabelle drei Knöpfe (Umschalter, `aria-pressed`): „Cronbach's Alpha“, „Corrected Item-Total“, „Alpha if Deleted“. Zustand ohne Auswahl: „Wähl eine Zahl.“ Bei Auswahl orange Umrandung und Text in `aria-live`:
- **Cronbach's Alpha:** „**Cronbachs α = 0,726**, mit allen vier Items. In der kurzen Ausgabe steht dahinter „Acceptable“: nach der Faustregel annehmbar (ab 0,7). Gerechnet mit den 3.521 Befragten, die alle vier Fragen beantwortet haben.“ Hervorgehoben: Zeile Cronbach's Alpha und N (listwise).
- **Corrected Item-Total:** „Das ist die **Trennschärfe**: die Korrelation eines Items mit der Summe der übrigen Items. Sie zeigt, wie gut ein Item zu den anderen passt. pn13 (Bundesland) passt am besten (0,620), pn17 (EU) am schwächsten (0,402).“ Hervorgehoben: Spalte Corrected Item-Total, Zelle pn17 kräftiger.
- **Alpha if Deleted:** „So hoch wäre α **ohne dieses Item**. Nur bei pn17 (EU) läge α ohne das Item höher als mit ihm: 0,733 statt 0,726. Ohne pn13 (Bundesland) fiele α deutlich, auf 0,603.“ Hervorgehoben: Spalte Alpha if Deleted, Zelle pn17 und die Zahl 0,726 oben gestrichelt.

**Textfassung B6:** Die Tabelle selbst; die drei Erklärungen zusätzlich vollständig in einem zugeklappten `details` „Alle drei Zahlen erklärt“. Die Spalten „Scale Mean if Deleted“, „Scale Var. if Deleted“ und „Omega if Deleted“ bleiben ohne Knopf; ein Satz darunter: „Die übrigen Spalten brauchst du heute nicht. In deiner eigenen Ausgabe stehen zwischen den beiden Teilen noch zwei weitere: „Item Statistics“ (Mittelwert und Streuung je Item) und „Inter-Item Correlation Matrix“ (die Korrelationstabelle aus Karte 2a). Für α und die Trennschärfe springst du zu „Reliability Statistics“ oben und „Item-Total Statistics“ ganz unten.“

**Faustregeln (Tabelle unter B6, Überschrift „So stuft mariposa α ein“):**

| α | mariposa schreibt | heißt etwa |
|---|---|---|
| ab 0,9 | Excellent | sehr hoch; bei vielen Items oder fast gleichen Fragen |
| 0,8 bis unter 0,9 | Good | gut |
| 0,7 bis unter 0,8 | Acceptable | annehmbar, die übliche Untergrenze |
| 0,6 bis unter 0,7 | Questionable | fraglich |
| unter 0,6 | Poor | schwach |
| negativ | negative; check item coding | Items zeigen in verschiedene Richtungen: Polung prüfen |

**Kurz überlegen** (Auswahl, Knopf „Auflösen“): „Ohne welches Item würde α steigen?“ Optionen: „pn12 Gemeinde“, „pn13 Bundesland“, „pn16 Deutschland“, „pn17 EU“.
- Ziel: pn17.
- richtig: „Genau: Ohne die EU läge α bei 0,733, mit ihr bei 0,726. Das ist nur ein kleiner Gewinn. Ob die EU in den Index gehört, ist eine inhaltliche Frage: Willst du Verbundenheit mit Deutschland und seinen Regionen messen oder räumliche Verbundenheit überhaupt?“
- pn12: „Ohne die Gemeinde fiele α auf 0,700. Such in „Alpha if Deleted“ die Zahl, die größer ist als 0,726.“
- sonst: „Vergleich jede Zahl in „Alpha if Deleted“ mit α = 0,726. Nur eine ist größer.“

Kurz gesagt: „`reliability()` zeigt oben **Cronbachs α** für alle Items, unten je Item die **Trennschärfe** (Corrected Item-Total) und **α ohne dieses Item** (Alpha if Deleted). Ein Item mit niedriger Trennschärfe passt schlecht zu den anderen. Steigt α ohne ein Item, prüfst du am Inhalt, ob es wirklich zum Begriff gehört.“

Genauer erklärt „Grenzen der Faustregeln“:
- „Die Grenzen 0,7 oder 0,8 sind Gewohnheiten, keine Naturgesetze. 0,69 ist nicht schlecht und 0,71 nicht gut; nenn immer die Zahl.“
- „α steigt mit der Zahl der Items (Karte 2b). Bei 20 Items reicht schon eine mittlere Korrelation von 0,2 für α = 0,833. Bei drei oder vier Items ist ein α um 0,7 dagegen schon ordentlich.“
- „Ein sehr hohes α (über 0,95) kann heißen, dass die Items fast dasselbe fragen. Dann misst der Index einen engen Ausschnitt des Begriffs.“
- „α prüft nicht, ob die Items **einen** gemeinsamen Begriff messen. Auch zwei Gruppen von Items, die je unter sich eng zusammenhängen, können ein hohes α ergeben. Ob es eine oder mehrere Dimensionen sind, zeigt ein eigenes Verfahren, die Faktorenanalyse; sie kommt im Lernpfad nicht vor. Hier hilft dir der Inhalt: Gehören die Items zu einem Begriff?“
- „α prüft nicht die Validität (Karte 2a).“
- „Ein Item zu streichen, nur weil α dann etwas steigt, ist keine gute Regel. Wer Items streicht, verengt den Begriff.“

Häufige Verwechslung: „Trennschärfe und „Alpha if Deleted“ verwechseln. Die Trennschärfe ist die Korrelation des Items mit den anderen (hoch ist gut). „Alpha if Deleted“ ist α ohne das Item (höher als α heißt: das Item passt schlecht).“

Link: „→ In der freien Karte: Reliabilität, Alpha und Omega“ (Begriff `reliability`).

### Aufgabe 2 „Messen die sieben Aussagen dasselbe?“ (Pflicht)

Link „↑ Grundlage 2 nachlesen“.

Leitfrage: „Darf man die sieben Populismus-Aussagen zu einem Index zusammenfassen, und passt jede dazu?“

Ziel: „Am Ende kannst du sagen, wie stimmig die sieben Aussagen sind (Cronbachs α), welche am schwächsten zu den anderen passt, und begründen, ob sie im Index bleiben soll.“

Grundlage: „Grundlage 2, Passen die Fragen zusammen?“

Einleitung: „In Aufgabe 1 hast du aus den sieben Aussagen pa29 bis pa35 einen Index gebildet. Ob das erlaubt ist, prüfst du jetzt. Die Aussagen findest du in Aufgabe 1.“

**Erst festlegen:** „Welche Aussage passt wohl am wenigsten zu den anderen?“ Optionen (Kurzfassungen): „pa29 Abgeordnete nur dem Volk verpflichtet“, „pa30 Politiker reden zu viel, handeln zu wenig“, „pa31 Einfache Bürger wären bessere Volksvertreter“, „pa32 Kompromiss ist Verrat an Prinzipien“, „pa33 Das Volk sollte entscheiden“, „pa34 Das Volk ist sich einig“, „pa35 Politiker vertreten nur die Reichen“.

**Schritte:**

1. „Führe die Vorlage aus. Oben steht Cronbachs α, unten unter „Item-Total Statistics“ je Aussage eine Zeile.“ Schild „reliability(): neu heute“, „summary(): kennst du aus Sitzung 7“.

```r
# Wie zuverlässig messen die sieben Populismus-Aussagen zusammen? Ausführlich mit summary()
allbus %>%
  reliability(pa29, pa30, pa31, pa32, pa33, pa34, pa35) %>%
  summary()
```

Ausgabe zur Kontrolle: Cronbach's Alpha 0.833, Alpha (standardized) 0.830, McDonald's Omega 0.841, N (listwise) 3427. Item-Total (Corrected Item-Total / Alpha if Deleted): pa29 0.348 / 0.842; pa30 0.588 / 0.811; pa31 0.648 / 0.800; pa32 0.682 / 0.794; pa33 0.639 / 0.801; pa34 0.545 / 0.817; pa35 0.619 / 0.805.

2. „Such die Aussage mit der schwächsten Trennschärfe (Spalte Corrected Item-Total). Prüf dann nach, was „Alpha if Deleted“ bedeutet: Lösch in der Vorlage die markierte Aussage samt Komma und führe sie erneut aus.“

```r
# Gegenprobe: dieselbe Rechnung ohne ein Item
allbus %>%
  reliability(⟦pa29, ⟧pa30, pa31, pa32, pa33, pa34, pa35)
```

Ausgabe wie dasteht: `Cronbach's Alpha = 0.833 (Good), McDonald's Omega = 0.841, N = 3427`. Gelöst: `Cronbach's Alpha = 0.842 (Good), McDonald's Omega = 0.844, N = 3441`.
Hilfezeile unter der Werkstatt: „N ist jetzt 3441 statt 3427: Ohne pa29 zählen auch die 14 Befragten mit, die nur pa29 nicht beantwortet haben. α ist trotzdem dasselbe wie in „Alpha if Deleted“.“

**Bild B-A2 `s8-alpha-ohne` (statisch, steht unter Schritt 2):**
- Waagerechte Balken, eine Zeile je Aussage pa29 bis pa35, x-Achse „α ohne diese Aussage“ von 0,78 bis 0,85 (Achse beginnt nicht bei 0; Hinweis in der Bildunterschrift).
- Balkenenden: pa29 0,842; pa30 0,811; pa31 0,800; pa32 0,794; pa33 0,801; pa34 0,817; pa35 0,805. Senkrechte gestrichelte Linie bei 0,833 „α mit allen sieben“.
- Balken rechts der Linie (nur pa29) orange, alle anderen blau.
- Bildunterschrift: „Nur ohne pa29 läge α höher als mit allen sieben, und auch nur um 0,009. Die Achse beginnt bei 0,78, damit die kleinen Unterschiede sichtbar sind. ALLBUS 2023, ungewichtet, n = 3.427.“
- Textfassung: „α ohne die jeweilige Aussage: pa29 0,842, pa30 0,811, pa31 0,800, pa32 0,794, pa33 0,801, pa34 0,817, pa35 0,805. Mit allen sieben ist α 0,833. Nur ohne pa29 wäre α höher.“

3. „Deuten: Soll pa29 aus dem Index? Denk an den Inhalt der Aussage und an Grundlage 2c. (Frage a2e unten)“

**Weiterdenken in der Probier-Werkstatt (für die Aufgabe nicht nötig),** zugeklappt: „Für die Aufgabe reichen die Vorlagen oben. Hier ist Platz für eigene Fragen. Eine Idee: Wie stimmig sind nur drei der sieben Aussagen? Die Probier-Werkstatt startet mit einem Vorschlag.“

```r
# Eine Idee: Wie zuverlässig messen nur drei der sieben Aussagen zusammen?
allbus %>%
  reliability(pa31, pa32, pa33)
```

(Zur Information: α = 0,759 (Acceptable), N = 3.478. Weniger Items, niedrigeres α, obwohl diese drei gut zusammenpassen: α hängt von der Zahl der Items ab.)

**Antwortfragen:**

| id | Art | Label | Optionen | Ziel | Toleranz | Text richtig | Text falsch / Hinweis | Hilfezeile |
|---|---|---|---|---|---|---|---|---|
| a2a | number | Wie hoch ist Cronbachs α der sieben Aussagen? | – | 0.833 | 0.0015 | „α = 0,833, nach der Faustregel gut (Good, ab 0,8).“ | 0.830: „0,830 steht bei „Alpha (standardized)“. Hast du gerundet? Trag alle drei Nachkommastellen von „Cronbach's Alpha“ ein.“<br>0.841: „Das ist McDonalds ω. Gesucht ist Cronbach's Alpha, zwei Zeilen darüber.“<br>0.842: „Das ist α ohne pa29. Gesucht ist α mit allen sieben, Schritt 1 oben.“<br>sonst: „Lies in Schritt 1 die Zeile „Cronbach's Alpha“.“ | „Drei Nachkommastellen, wie R sie zeigt, zum Beispiel 0,123.“ |
| a2b | choice | Welche Aussage hat die schwächste Trennschärfe? | pa29 … pa35 (Kurzfassungen wie beim Festlegen) | pa29 | – | „pa29 („Abgeordnete nur dem Volk verpflichtet“) mit 0,348. Alle anderen liegen zwischen 0,545 und 0,682.“ | pa34: „pa34 hat mit 0,545 die zweitschwächste. Noch schwächer ist eine andere.“<br>sonst: „Vergleich die Spalte „Corrected Item-Total“: Gesucht ist die kleinste Zahl.“ | „Spalte Corrected Item-Total in Schritt 1.“ |
| a2c | choice | Was sagt α = 0,833? | stimmig: „Die sieben Antworten einer Person hängen so eng zusammen, dass ihr Mittelwert zuverlässig misst.“; prozent: „83 % der Befragten antworten stimmig.“; gueltig: „Die sieben Aussagen messen nachweislich Populismus.“ | stimmig | – | „Genau. α beschreibt, wie zuverlässig (reliabel) der Index misst.“ | prozent: „α ist kein Anteil von Befragten. Es fasst zusammen, wie eng die Items zusammenhängen.“<br>gueltig: „Ob die Aussagen Populismus treffen, ist eine Frage der Validität. Die prüft α nicht; dafür schaust du auf den Inhalt.“ | – |
| a2d | number | Wie hoch ist α ohne pa29 (Schritt 2)? | – | 0.842 | 0.0005 | „0,842, genau wie „Alpha if Deleted“ bei pa29. α steigt also nur um 0,009.“ | 0.841: „Das ist McDonalds ω aus Schritt 1 (alle sieben). Gesucht ist Cronbach's Alpha aus Schritt 2, ohne pa29.“<br>0.833: „Das ist noch α mit allen sieben. Lösch in der Vorlage `pa29, ` und führe sie erneut aus.“<br>0.844: „Das ist McDonalds ω. Gesucht ist Cronbach's Alpha in derselben Zeile.“<br>0.348: „Das ist die Trennschärfe von pa29. Gesucht ist α ohne pa29.“<br>sonst: „Führe Schritt 2 ohne pa29 aus und lies „Cronbach's Alpha =“.“ | „Aus Schritt 2, drei Nachkommastellen.“ |
| a2e | choice | Soll pa29 aus dem Populismus-Index? | raus: „Ja: Ohne pa29 ist α höher, also muss sie raus.“; inhalt: „Nicht automatisch: α steigt nur wenig (0,833 auf 0,842). Ob pa29 zum Begriff gehört, entscheidet der Inhalt.“; nie: „Nein: Items darf man nie aus einem Index nehmen.“ | inhalt | – | „Genau. pa29 („Abgeordnete nur dem Volk verpflichtet“) trifft einen Kern von Populismus. Aber 78 % stimmen ihr voll oder eher zu (gewichtet), sie unterscheidet also kaum zwischen den Befragten. Beides gehört in die Entscheidung.“ | raus: „Ein Gewinn von 0,009 ist sehr klein. Wer pa29 streicht, misst den Begriff enger. Das entscheidest du am Inhalt, nicht an der dritten Nachkommastelle.“<br>nie: „Items zu streichen ist erlaubt, wenn du es inhaltlich begründest und berichtest.“ | – |

**Hilfe, Stufe 1: Denkanstoß:** „Cronbachs α sagt, wie stimmig alle sieben Aussagen zusammen sind. Die Trennschärfe sagt, wie gut eine einzelne Aussage zu den übrigen passt. „Alpha if Deleted“ sagt, wie hoch α ohne diese Aussage wäre.“

**Hilfe, Stufe 2: Wo schaue ich?:** „In Schritt 1 steht α unter „Reliability Statistics“ in der Zeile „Cronbach's Alpha“. Unter „Item-Total Statistics“ suchst du in der Spalte „Corrected Item-Total“ die kleinste Zahl. In Schritt 2 steht α nach dem Löschen in der Zeile „Cronbach's Alpha =“.“

**Hilfe, Stufe 3: Lösung:** „α = 0,833 (Good). Die schwächste Trennschärfe hat pa29 mit 0,348. Ohne pa29 läge α bei 0,842. Ob pa29 bleibt, ist eine inhaltliche Entscheidung: Sie trifft einen Kern des Begriffs, unterscheidet aber kaum, weil fast alle zustimmen. Beides ist vertretbar, wenn du es begründest.“

**Ohne Grafik lösbar:** „Alle Zahlen stehen in den Ausgaben von Schritt 1 und Schritt 2.“

**Fürs Plenum:** „Würdet ihr pa29 im Index behalten? Bringt ein Argument für Behalten und eins für Streichen mit.“

---

## 6 Thema 3: Alle in eine Richtung: Umpolen

### Grundlage 3 „Alle in eine Richtung“ (Kopf: „Grundlage zu Aufgabe 3“, Link „Schon klar? Direkt zu Aufgabe 3 ↓“)

Unterzeile: „Was passiert, wenn Fragen andersherum gestellt sind, und wie bringst du sie in eine Richtung? Zwei Schritte, etwa 10 Minuten.“

#### Karte 3a „Andersherum gefragt“ (Schilder: „Umpolen: kennst du aus Sitzung 5“, „Im Bild“)

Beispiel zuerst: „Der ALLBUS fragt nach Rollenbildern in Familie und Beruf. Antworten von 1 „stimme voll zu“ bis 4 „stimme gar nicht zu“. Vier der Aussagen:
- fr07 „Eine berufstätige Frau kann eine genauso gute Mutter sein.“ (stimmen zu: 68,9 %)
- fr08 „Beide Eltern sollten Vollzeit arbeiten und sich den Haushalt teilen.“ (66,9 %)
- fr03b „Eine Frau sollte nicht arbeiten, solange ihr Kind klein ist.“ (36,2 %)
- fr04b „Die Frau sollte zu Hause bleiben und die Kinder versorgen.“ (20,1 %)
(gewichtet; Kurzfassungen nach den Variablenlabels.) Wer bei fr07 voll zustimmt, denkt eher gleichberechtigt. Wer bei fr03b voll zustimmt, denkt eher traditionell. Dieselbe 1 bedeutet also zweimal das Gegenteil.“

**Bild B7 `s8-umpolen` (statisch):**
- Links Turm-Reihe einer Person, zum Beispiel: vier Steine `fr07` 1, `fr08` 1, `fr03b` 4, `fr04b` 4 mit Aufklebern STIMME VOLL ZU, STIMME VOLL ZU, STIMME GAR NICHT ZU, STIMME GAR NICHT ZU; daneben Formel-Baustein „Mittelwert 2,5“ mit Notiz (orange) „sieht aus wie teils/teils“.
- Grüner Pfeil `rec(…, rules = "rev")` nur bei fr03b und fr04b.
- Rechts dieselbe Person: `fr07` 1, `fr08` 1, `fr03b_um` 1, `fr04b_um` 1 (Aufkleber bleiben STIMME GAR NICHT ZU bei den umgepolten); Formel-Baustein „Mittelwert 1“ mit Notiz (grün) „durchgehend gleichberechtigt“.
- Unter dem Bild **Formel als Bausteine:** „neuer Wert“ = („kleinster Code“ + „größter Code“) − „alter Wert“. Darunter eingesetzt: „Skala 1 bis 4: 5 − 4 = 1; Skala 1 bis 7: 8 − 2 = 6“.
- Bildunterschrift: „Eine Person mit durchgehend gleichberechtigtem Rollenbild, zum Beispiel. Ohne Umpolen landet sie mit 2,5 scheinbar in der Mitte, nach dem Umpolen bei 1.“
- Textfassung: „Eine Person, zum Beispiel, antwortet bei fr07 und fr08 mit 1, stimme voll zu, und bei fr03b und fr04b mit 4, stimme gar nicht zu. Sie denkt durchgehend gleichberechtigt. Ohne Umpolen ist ihr Mittelwert 2,5, als wäre sie unentschieden. Nach dem Umpolen von fr03b und fr04b werden aus den beiden 4 jeweils 1, und ihr Mittelwert ist 1. Umpolen heißt: neuer Wert gleich kleinster plus größter Code minus alter Wert, auf einer Skala von 1 bis 4 also 5 minus alter Wert.“

**Kurz überlegen** (Zahlenfeld, Prüfen-Knopf): „Auf einer Skala von 1 bis 7: Welche Zahl wird beim Umpolen aus einer 2?“ Hilfezeile: „Kleinster plus größter Code, minus alter Wert.“
- Ziel 6, Toleranz 0.
- richtig: „6: 1 + 7 = 8, und 8 − 2 = 6. Aus 1 wird 7, aus 4 bleibt 4: Die Mitte bleibt in der Mitte.“
- Sonderfall 5: „Das wäre 7 − 2. Rechne mit kleinster plus größter Code: 1 + 7 = 8, dann 8 − 2.“
- falsch sonst: „1 + 7 = 8, dann 8 minus 2.“

Kurz gesagt: „Bevor du Items zu einem Index zusammenfasst, müssen alle in **dieselbe Richtung** zeigen: Eine hohe Zahl muss bei jedem Item dasselbe bedeuten. Andersherum gefragte Items (Fachbegriff: **invertierte Items**) polst du um: Die Skala wird gespiegelt, aus der kleinsten Zahl wird die größte.“

Genauer erklärt „Warum fragt man überhaupt andersherum?“:
- „Manche Menschen stimmen fast allem zu, egal was gefragt wird (**Zustimmungstendenz**, englisch Acquiescence). Sind einige Aussagen andersherum gestellt, fällt das auf und verzerrt den Index weniger.“
- „`rec(x, rules = "rev")` nimmt dafür den kleinsten und den größten Code der Skala, so wie die Wertelabels sie angeben, nicht die kleinste und größte Antwort, die tatsächlich vorkommt (kennst du aus Sitzung 5). Fehlende Werte bleiben leer. Das Wort zur Antwort wandert mit: Bei fr03b_um steht STIMME GAR NICHT ZU jetzt bei Code 1.“
- „Welche Items umgepolt werden, entscheidest du am Wortlaut, bevor du rechnest. Die Rechnung (Thema 2) zeigt dir dann, ob du richtig lagst: Ein falsch gepoltes Item hat eine negative Trennschärfe.“

Häufige Verwechslung: „Umpolen und Umkodieren in Gruppen verwechseln. Beim Umpolen bleiben alle Stufen erhalten, nur ihre Reihenfolge dreht sich. Beim Zusammenfassen in Gruppen (Sitzung 5) werden aus mehreren Stufen wenige.“

#### Karte 3b „Umpol-Labor“ (Schilder: „Cronbachs α: Grundlage 2“, „Ausprobieren“)

Beispiel zuerst: „Hier kannst du jedes der vier Items umpolen und sofort sehen, was mit α und den Trennschärfen passiert. Gerechnet mit den 3.517 Befragten, die alle vier beantwortet haben.“

**Interaktion B8 `s8-umpol-labor` (HTML):**
- Vier Schalter (Kippschalter, `role="switch"`, `aria-checked`), je mit Kurzfassung des Items: „fr07 berufstätige Frau gute Mutter“, „fr08 beide Vollzeit, Haushalt teilen“, „fr03b nicht arbeiten bei Kleinkind“, „fr04b Frau zu Hause“; Beschriftung des Zustands „so wie gefragt“ / „umgepolt“.
- Anzeige (in `aria-live`): „Cronbachs α = …“ mit Einstufung (wie mariposa), darunter vier waagerechte Balken für die Trennschärfen von −0,6 bis 0,6 mit senkrechter Nulllinie; negative Balken orange, positive blau, Zahl am Balkenende.
- Ist α negativ, erscheint zusätzlich der Hinweis: „α ist negativ: Die Items zeigen in verschiedene Richtungen. R meldet dann „Cronbach's alpha is negative … check the item codings“.“
- Zustände (Reihenfolge fr07, fr08, fr03b, fr04b; U = umgepolt, - = wie gefragt; Werte: α; Trennschärfen fr07, fr08, fr03b, fr04b):

| Zustand | α | fr07 | fr08 | fr03b | fr04b |
|---|---|---|---|---|---|
| ---- | −0,210 | −0,168 | −0,019 | −0,112 | −0,017 |
| U--- | 0,183 | 0,168 | −0,399 | 0,465 | 0,372 |
| -U-- | −0,158 | −0,530 | 0,019 | 0,213 | 0,347 |
| UU-- | 0,696 | 0,530 | 0,399 | 0,526 | 0,470 |
| --U- | 0,071 | 0,421 | 0,308 | 0,112 | −0,470 |
| U-U- | −1,610 | −0,421 | −0,337 | −0,465 | −0,347 |
| -UU- | −0,926 | −0,213 | −0,308 | −0,213 | −0,372 |
| UUU- | −0,165 | 0,213 | 0,337 | −0,526 | 0,017 |
| ---U | −0,165 | 0,213 | 0,337 | −0,526 | 0,017 |
| U--U | −0,926 | −0,213 | −0,308 | −0,213 | −0,372 |
| -U-U | −1,610 | −0,421 | −0,337 | −0,465 | −0,347 |
| UU-U | 0,071 | 0,421 | 0,308 | 0,112 | −0,470 |
| --UU | 0,696 | 0,530 | 0,399 | 0,526 | 0,470 |
| U-UU | −0,158 | −0,530 | 0,019 | 0,213 | 0,347 |
| -UUU | 0,183 | 0,168 | −0,399 | 0,465 | 0,372 |
| UUUU | −0,210 | −0,168 | −0,019 | −0,112 | −0,017 |

- Rückmeldung bei α = 0,696 (Zustände UU-- und --UU): „Alle vier Trennschärfen sind positiv, α = 0,696. Jetzt zeigen alle Items in dieselbe Richtung.“ Zusatz bei --UU: „Hohe Zahl heißt jetzt bei allen: eher traditionell.“ bei UU--: „Hohe Zahl heißt jetzt bei allen: eher gleichberechtigt.“ Sonst nichts weiter (keine Bewertung).
- Textalternative: die Tabelle oben als `details` „Alle 16 Möglichkeiten als Tabelle“.

**Kurz überlegen** (Auswahl, Knopf „Auflösen“): „Welche Items musst du umpolen, damit alle in dieselbe Richtung zeigen?“ Optionen: „fr03b und fr04b“, „fr07 und fr08“, „fr07 und fr03b“, „alle vier“.
- Ziel: „fr03b und fr04b“ **oder** „fr07 und fr08“ (beide richtig).
- richtig (fr03b und fr04b): „Genau. Dann heißt eine kleine Zahl bei allen vier: gleichberechtigt. Auch umgekehrt ginge es: fr07 und fr08 umpolen. α ist in beiden Fällen 0,696; es dreht sich nur, wofür eine hohe Zahl steht.“
- richtig (fr07 und fr08): „Auch richtig. Dann heißt eine kleine Zahl bei allen vier: traditionell. α ist 0,696, genau wie beim Umpolen von fr03b und fr04b.“
- alle vier: „Wenn du alle umpolst, zeigen sie wieder genauso gegeneinander wie vorher: α bleibt −0,210. Pol nur die um, die andersherum gefragt sind.“
- fr07 und fr03b: „Dann zeigen fr07 und fr04b in die eine Richtung, fr08 und fr03b in die andere. Probier es im Labor: α wird −1,610.“

Kurz gesagt: „Ein **negatives α** oder eine **negative Trennschärfe** sind fast immer ein Zeichen für ein falsch gepoltes Item. Nach dem Umpolen sind die Trennschärfen positiv. Ob du die einen oder die anderen umpolst, ändert α nicht, nur die Richtung des Index.“

Genauer erklärt „Was α nach dem Umpolen sagt“:
- „Mit α = 0,696 liegen die vier Rollenbild-Items knapp unter der üblichen Grenze 0,7 (mariposa: Questionable). Bei vier Items ist das kein schlechter Wert (Grundlage 2c).“
- „Die schwächste Trennschärfe hat fr08 (0,399). Ohne fr08 läge α bei 0,682, also niedriger: fr08 trägt also trotzdem etwas bei.“
- „Bei diesen vier Items, zwei in jeder Richtung, sind ohne Umpolen alle vier Trennschärfen negativ. Die Rechnung zeigt dann nur, dass etwas nicht stimmt, aber nicht, welche Items andersherum sind; das sagt dir erst der Wortlaut. Darum zuerst lesen, dann rechnen.“

Häufige Verwechslung: „Umpolen „verbessert“ nicht die Daten. Es macht nur sichtbar, dass die Antworten zusammenpassen. Ein Item, das inhaltlich nicht passt, wird durch Umpolen nicht passend.“

### Aufgabe 3 „Andersherum gefragt: Einstellungen zu Islam und Muslimen“ (Pflicht)

Link „↑ Grundlage 3 nachlesen“.

Leitfrage: „Wie fasst man sechs Aussagen, die in verschiedene Richtungen gestellt sind, richtig zu einem Index zusammen?“

Ziel: „Am Ende hast du die andersherum gestellten Aussagen erkannt und umgepolt und kannst sagen, wie sich Cronbachs α dadurch verändert und wofür ein hoher Wert jetzt steht.“

Grundlage: „Grundlage 3, Alle in eine Richtung; Grundlage 2c, Die Ausgabe von reliability()“.

Einleitung: „Der ALLBUS 2023 misst in einem Teil der Fragebögen mit sechs Aussagen, wie Menschen in Deutschland zum Islam und zu Muslimen eingestellt sind. Solche Fragen sind in der Einstellungsforschung üblich, um Vorbehalte und Offenheit in der Bevölkerung zu beschreiben. Die Befragten sagen zu jeder Aussage, wie sehr sie zustimmen: von 1 „stimme gar nicht zu“ bis 7 „stimme voll und ganz zu“; dazwischen stehen nur Zahlen. Die Aussagen sind Fragen aus dem Fragebogen, keine Feststellungen dieses Kurses. Ob sie zutreffen, ist hier nicht die Frage: Du prüfst nur, wie man sie richtig zu einem Index zusammenfasst. Sinngemäß nach den Variablenlabels:“
- mm01 „Die Ausübung des islamischen Glaubens in Deutschland sollte eingeschränkt werden.“
- mm02 „Der Islam passt in die deutsche Gesellschaft.“
- mm03 „Die Anwesenheit von Muslimen in Deutschland führt zu Konflikten.“
- mm04 „Der Staat sollte islamische Gruppen beobachten.“
- mm05 „Ein muslimischer Bürgermeister wäre in Ordnung.“
- mm06 „Unter den Muslimen in Deutschland gibt es viele religiöse Fanatiker.“

**Erst festlegen:** „Welche zwei Aussagen sind andersherum gestellt als die übrigen vier?“ Optionen: „mm01 und mm04“, „mm02 und mm05“, „mm03 und mm06“.

**Schritte:**

1. „Führe die Vorlage aus. Sie rechnet α mit den sechs Aussagen so, wie sie im Datensatz stehen. Schau auf α und auf die Spalte Corrected Item-Total.“ Schild „reliability(): Aufgabe 2“.

```r
# Wie zuverlässig messen die sechs Aussagen zu Islam und Muslimen zusammen, so wie sie im Datensatz stehen?
allbus %>%
  reliability(mm01, mm02, mm03, mm04, mm05, mm06) %>%
  summary()
```

Ausgabe zur Kontrolle: Cronbach's Alpha 0.177, Alpha (standardized) 0.207, McDonald's Omega 0.508, N (listwise) 3069. Corrected Item-Total: mm01 0.289, mm02 −0.373, mm03 0.442, mm04 0.474, mm05 −0.411, mm06 0.428. Kurze Einstufung (bei `print`): Poor.

2. „Die Vorlage baut mit `rec(…, rules = "rev")` zwei umgepolte Aussagen, `mm02_um` und `mm05_um`. Führst du sie so aus, ändert sich α noch nicht: In `reliability()` stehen noch die alten Aussagen. Tausch die beiden markierten Stellen gegen ihre umgepolte Fassung und führe die Vorlage erneut aus.“ Schild „rec(…, rules = "rev"): kennst du aus Sitzung 5“.

```r
# Zwei Items umpolen: aus 1 wird 7, aus 2 wird 6 und so weiter
# Dann die Reliabilität mit den umgepolten Items statt der alten
allbus %>%
  mutate(
    mm02_um = rec(mm02, rules = "rev"),
    mm05_um = rec(mm05, rules = "rev")
  ) %>%
  reliability(mm01, ⟦mm02⟧, mm03, mm04, ⟦mm05⟧, mm06) %>%
  summary()
```

Lösung der markierten Stellen: `mm02_um` und `mm05_um`. Ausgabe gelöst: Cronbach's Alpha 0.840, Alpha (standardized) 0.842, McDonald's Omega 0.843, N (listwise) 3069. Corrected Item-Total: mm01 0.709, mm02_um 0.535, mm03 0.633, mm04 0.654, mm05_um 0.539, mm06 0.654. Mit Platzhalter wie Schritt 1 (α 0.177). Nur mm02 getauscht: α 0.540; nur mm05 getauscht: α 0.620.

**Bild B-A3 `s8-trennschaerfe-vorher-nachher` (statisch, steht unter Schritt 2):**
- Zwei Balkendiagramme nebeneinander (bei 390 px untereinander), Titel „vorher“ und „nach dem Umpolen“; je sechs waagerechte Balken mm01 bis mm06 (nachher mit mm02_um, mm05_um beschriftet), x-Achse „Trennschärfe“ von −0,5 bis 0,8 mit senkrechter Nulllinie.
- Vorher: mm01 0,289; mm02 −0,373; mm03 0,442; mm04 0,474; mm05 −0,411; mm06 0,428. Negative Balken orange, positive blau. Unter dem Diagramm „α = 0,177“.
- Nachher: mm01 0,709; mm02_um 0,535; mm03 0,633; mm04 0,654; mm05_um 0,539; mm06 0,654, alle blau. Unter dem Diagramm „α = 0,840“.
- Bildunterschrift: „Vorher zeigen zwei Balken nach links: Diese Aussagen laufen gegen die anderen. Nach dem Umpolen passen alle sechs. ALLBUS 2023, ungewichtet, n = 3.069.“
- Textfassung: „Trennschärfen vorher: mm01 0,289, mm02 minus 0,373, mm03 0,442, mm04 0,474, mm05 minus 0,411, mm06 0,428, Cronbachs Alpha 0,177. Nach dem Umpolen von mm02 und mm05: mm01 0,709, mm02_um 0,535, mm03 0,633, mm04 0,654, mm05_um 0,539, mm06 0,654, Cronbachs Alpha 0,840.“

3. „Deuten: Wofür steht nach dem Umpolen eine hohe Zahl, bei allen sechs Aussagen? (Frage a3d unten)“

**Weiterdenken in der Probier-Werkstatt (für die Aufgabe nicht nötig),** zugeklappt: „Für die Aufgabe reichen die Vorlagen oben. Hier ist Platz für eigene Fragen. Eine Idee: Was passiert mit dem Index, wenn man das Umpolen vergisst? Die Probier-Werkstatt startet mit einem Vorschlag.“

```r
# Eine Idee: der Index mit und ohne Umpolen (umgepolt wie in Aufgabe 3)
allbus %>%
  mutate(
    mm02_um           = rec(mm02, rules = "rev"),
    mm05_um           = rec(mm05, rules = "rev"),
    vorbehalte        = row_means(pick(mm01, mm02_um, mm03, mm04, mm05_um, mm06), min_valid = 5),
    vorbehalte_falsch = row_means(pick(mm01, mm02, mm03, mm04, mm05, mm06), min_valid = 5)
  ) %>%
  describe(vorbehalte, vorbehalte_falsch, weights = wghtpew)
```

(Zur Information, nicht im Kapitel: gewichtet `vorbehalte` Mean 4,012, SD 1,516; `vorbehalte_falsch` Mean 3,862, SD 0,902; N 3.344. Ohne Umpolen rücken alle zur Mitte, die Streuung schrumpft fast auf die Hälfte: Klare Haltungen in beide Richtungen werden unsichtbar. Der Name `vorbehalte` sagt, wofür eine hohe Zahl steht; ein Name wie `islam` würde das verschweigen.)

**Antwortfragen:**

| id | Art | Label | Optionen | Ziel | Toleranz | Text richtig | Text falsch / Hinweis | Hilfezeile |
|---|---|---|---|---|---|---|---|---|
| a3a | choice | Welche zwei Aussagen haben in Schritt 1 eine negative Trennschärfe? | „mm01 und mm04“, „mm02 und mm05“, „mm03 und mm06“ | mm02 und mm05 | – | „mm02 (−0,373) und mm05 (−0,411). Genau die beiden drücken bei Zustimmung eine offene Haltung aus, die anderen vier bei Zustimmung Vorbehalte.“ | sonst: „Such in der Spalte Corrected Item-Total die beiden Zahlen mit Minuszeichen.“ | „Schritt 1, Spalte Corrected Item-Total.“ |
| a3b | number | Wie hoch ist Cronbachs α vor dem Umpolen? | – | 0.177 | 0.0015 | „0,177, nach der Faustregel schwach (Poor). Die Aussagen heben sich gegenseitig auf.“ | 0.207: „Das ist das standardisierte α. Gesucht ist „Cronbach's Alpha“ eine Zeile darüber.“<br>0.508: „Das ist McDonalds ω.“<br>0.840: „Das ist α nach dem Umpolen. Gesucht ist Schritt 1.“<br>sonst: „Lies in Schritt 1 die Zeile Cronbach's Alpha.“ | „Drei Nachkommastellen.“ |
| a3c | number | Wie hoch ist Cronbachs α nach dem Umpolen (Schritt 2)? | – | 0.840 | 0.0015 | „0,840, nach der Faustregel gut (Good). Vorher 0,177: Erst in einer Richtung passen die sechs zusammen.“ | 0.177: „Das ist noch α vor dem Umpolen. In reliability() stehen noch mm02 und mm05; tausch sie gegen mm02_um und mm05_um.“<br>0.540: „Du hast nur mm02 getauscht. Tausch auch mm05 gegen mm05_um.“<br>0.620: „Du hast nur mm05 getauscht. Tausch auch mm02 gegen mm02_um.“<br>0.842: „Das ist das standardisierte α.“<br>0.843: „Das ist McDonalds ω.“<br>sonst: „Führe Schritt 2 mit mm02_um und mm05_um aus und lies Cronbach's Alpha.“ | „Aus Schritt 2, drei Nachkommastellen.“ |
| a3d | choice | Wofür steht nach dem Umpolen eine hohe Zahl bei allen sechs Aussagen? | vorb: „für mehr Vorbehalte gegenüber Islam und Muslimen“; offen: „für mehr Offenheit gegenüber Islam und Muslimen“; versch: „Das ist je nach Aussage verschieden.“ | vorb | – | „Genau. Bei mm01, mm03, mm04 und mm06 steht 7 schon für Vorbehalte. mm02_um und mm05_um sind so gedreht, dass 7 jetzt „stimme gar nicht zu“ heißt, also ebenfalls für Vorbehalte. Ein Index daraus misst also Vorbehalte; nenn diese Richtung immer mit.“ | offen: „Das galt nur für mm02 und mm05 vor dem Umpolen. Jetzt sind sie gedreht und passen zu den vier anderen.“<br>versch: „Genau das hat das Umpolen behoben: Jetzt bedeutet eine hohe Zahl überall dasselbe.“ | – |
| a3e | choice | Warum war α vor dem Umpolen so niedrig? | richtung: „Zwei Aussagen zeigen in die andere Richtung; ihre Antworten heben die der anderen teilweise auf.“; begriff: „Die sechs Aussagen messen ganz Verschiedenes.“; wenige: „Zu wenige Befragte haben geantwortet.“ | richtung | – | „Genau. Nach dem Umpolen steigt α auf 0,840. Die Aussagen messen also einen gemeinsamen Begriff, sie waren nur verschieden gepolt.“ | begriff: „Dann bliebe α auch nach dem Umpolen niedrig. Es steigt aber auf 0,840.“<br>wenige: „3.069 Befragte sind viele. α hängt nicht davon ab, wie viele geantwortet haben.“ | – |

**Hilfe, Stufe 1: Denkanstoß:** „Lies die sechs Aussagen: Bei vier steht Zustimmung für Vorbehalte, bei zwei für eine offene Haltung. Solange sie verschieden gepolt sind, laufen ihre Antworten gegeneinander, und α bleibt niedrig.“

**Hilfe, Stufe 2: Wo schaue ich?:** „α steht in beiden Ausgaben in der Zeile Cronbach's Alpha. Falsch gepolte Aussagen erkennst du in Schritt 1 an einem Minuszeichen in Corrected Item-Total. In Schritt 2 müssen in `reliability()` die Namen mit `_um` stehen, sonst rechnet R wieder mit den alten.“

**Hilfe, Stufe 3: Lösung:** „Negative Trennschärfen haben mm02 (−0,373) und mm05 (−0,411). α vorher 0,177. In Schritt 2 heißt die Zeile `reliability(mm01, mm02_um, mm03, mm04, mm05_um, mm06)`; dann ist α 0,840 und alle Trennschärfen sind positiv. Eine hohe Zahl steht jetzt bei allen sechs für mehr Vorbehalte gegenüber Islam und Muslimen.“

**Ohne Grafik lösbar:** „Alle Zahlen stehen in den Ausgaben von Schritt 1 und Schritt 2.“

---

## 7 Thema 4: Ausgleichen oder alle? Mittelwert- und Kombinationsindex (Zusatz)

### Grundlage 4 „Ausgleichen oder alle?“ (Kopf: „Grundlage zu Aufgabe 4“, Link „Schon klar? Direkt zu Aufgabe 4 ↓“)

Unterzeile: „Wann ist ein Mittelwert die falsche Regel, und wie sieht ein Kombinationsindex aus? Zwei Schritte, etwa 8 Minuten.“

#### Karte 4a „Ausgleich im Mittelwert“ (Schilder: „Im Bild“)

Beispiel zuerst: „Zwei Befragte, zum Beispiel, antworten auf drei Aussagen einer Skala von 1 „stimme voll zu“ bis 5 „lehne ganz ab“. Person A: 1, 1, 4. Person B: 2, 2, 2. Beide haben den Mittelwert 2, also „im Schnitt Zustimmung“. Aber Person A lehnt eine Aussage ab, Person B stimmt allen zu.“

**Bild B9 `s8-ausgleich` (statisch):**
- Zwei Reihen mit je drei Steinen: A: 1, 1, 4 (der Stein 4 orange umrandet, Aufkleber LEHNE EHER AB); B: 2, 2, 2 (Aufkleber STIMME EHER ZU).
- Rechts zwei Spalten mit Formel-Bausteinen: „Mittelwert“: A 2, B 2 (beide grün, gleich); „allen zugestimmt (1 oder 2)?“: A „nein“ (grau), B „ja“ (grün).
- Bildunterschrift: „Im Mittelwert gleicht eine Ablehnung zwei starke Zustimmungen aus. Die Regel „allen zugestimmt“ lässt keinen Ausgleich zu. Die Steine sind ein Beispiel mit zwei Befragten.“
- Textfassung: „Person A antwortet 1, 1 und 4, Person B 2, 2 und 2, zum Beispiel. Beide haben den Mittelwert 2. Nach der Regel allen zugestimmt, also bei jeder Aussage 1 oder 2, gilt nur Person B, denn Person A lehnt die dritte Aussage mit 4 ab.“

Kurz gesagt: „Ein Mittelwertindex ist **kompensatorisch**: Eine hohe Antwort kann eine niedrige ausgleichen. Ein **Kombinationsindex** verbindet die Antworten nach einer festen Regel, etwa „bei allen zugestimmt“ oder „diese Antwort zuerst, jene an zweiter Stelle“. Welche Regel passt, folgt aus dem Begriff, den du messen willst.“

Genauer erklärt „Zählen mit row_sums()“:
- „Für eine Regel wie „allen zugestimmt“ machst du zuerst aus jedem Item eine 0/1-Variable mit `rec()` (kennst du aus Sitzung 5): 1 heißt zugestimmt, 0 nicht. Dann zählt `row_sums(pick(…))` die Einsen je Person: 0 bis 3 Zustimmungen. „Allen zugestimmt“ heißt dann: Summe 3.“
- „Bei `row_sums()` ist `min_valid` besonders wichtig. Ohne `min_valid` zählt R nur die gültigen Antworten zusammen, und wer eine Frage übersprungen hat, sieht aus, als hätte er dort nicht zugestimmt. Mit `min_valid` gleich der Zahl der Items bekommt nur einen Wert, wer alle beantwortet hat.“
- „Auch eine Summe ist ein Index (**Summenindex**). Ohne fehlende Werte enthält er dieselbe Information wie der Mittelwert, nur auf einer anderen Skala.“

Häufige Verwechslung: „„Im Schnitt Zustimmung“ und „überall Zustimmung“ gleichsetzen. Der Mittelwert sagt nichts darüber, ob jemand bei jeder Aussage zustimmt.“

#### Karte 4b „Ein klassischer Kombinationsindex: Inglehart“ (Schilder: „Gewichtet: kennst du aus Sitzung 6“, „Ausprobieren“)

Beispiel zuerst: „Der Politikwissenschaftler Ronald Inglehart hat Menschen vier politische Ziele in eine Rangfolge bringen lassen. Zwei Ziele gelten als materialistisch (Sicherheit und Wohlstand), zwei als postmaterialistisch (Mitbestimmung und Freiheit):
- „Aufrechterhaltung von Ruhe und Ordnung“ (va01, materialistisch)
- „Mehr Einfluss der Bürger auf die Entscheidungen der Regierung“ (va02, postmaterialistisch)
- „Kampf gegen die steigenden Preise“ (va03, materialistisch)
- „Schutz des Rechtes auf freie Meinungsäußerung“ (va04, postmaterialistisch)
Der ALLBUS bildet daraus den Inglehart-Index (ingle). Er schaut nur auf Platz 1 und Platz 2.“

**Interaktion B10 `s8-inglehart` (HTML):**
- Vier Karten mit den Zielen (materialistische mit blauem Rand und Schild „M“, postmaterialistische mit grünem Rand und Schild „P“). Die Person ordnet sie mit Knöpfen „nach oben“ und „nach unten“ je Karte (kein Ziehen nötig; Tastatur: Fokus auf Karte, Knöpfe mit Tab erreichbar). Plätze 1 bis 4 sind nummeriert, Platz 1 und 2 sind hervorgehoben (gelber Rand, Schild „zählt“).
- Anzeige (in `aria-live`): „Platz 1: …, Platz 2: … → Typ: …“ nach dieser Regel:

| Platz 1 | Platz 2 | Typ (ingle) |
|---|---|---|
| P | P | Postmaterialist (1) |
| P | M | postmaterialistischer Mischtyp (2) |
| M | P | materialistischer Mischtyp (3) |
| M | M | Materialist (4) |

- Darunter immer sichtbar: „So verteilen sich die Befragten (gewichtet): Postmaterialisten 18,18 %, postmaterialistischer Mischtyp 31,30 %, materialistischer Mischtyp 35,68 %, Materialisten 14,84 %. Bei wenigen Befragten (gewichtete Anzahl 136) war keine Zuordnung möglich.“ Der Balken des aktuell gewählten Typs ist hervorgehoben (Stapel auf 100 %, vier Abschnitte in den Breiten oben, Beschriftung im Abschnitt).
- Voreinstellung: Reihenfolge va01, va02, va03, va04 → materialistischer Mischtyp.
- Textalternative: die Regeltabelle und die Verteilung als Text (oben).

**Kurz überlegen** (Auswahl, Knopf „Auflösen“): „Eine Person setzt „Ruhe und Ordnung“ auf Platz 1 und „freie Meinungsäußerung“ auf Platz 2. Welcher Typ ist sie?“ Optionen: „Materialist“, „materialistischer Mischtyp“, „postmaterialistischer Mischtyp“, „Postmaterialist“.
- Ziel: materialistischer Mischtyp.
- richtig: „Genau: Platz 1 materialistisch, Platz 2 postmaterialistisch. Das ist mit 35,68 % der häufigste Typ.“
- falsch: „Schau nur auf Platz 1 und 2: Ruhe und Ordnung ist materialistisch (M), freie Meinungsäußerung postmaterialistisch (P). M vor P heißt materialistischer Mischtyp.“

Kurz gesagt: „Der Inglehart-Index ist ein **Kombinationsindex**: Er verbindet zwei Antworten nach einer Regel zu einem Typ. Ein Mittelwert wäre hier sinnlos.“

Genauer erklärt „Warum hier kein Mittelwert?“:
- „Jede Person vergibt die Plätze 1, 2, 3 und 4 genau einmal. Der Mittelwert ihrer vier Ränge ist deshalb bei allen 2,5. Ein Mittelwertindex würde alle Menschen gleich machen.“
- „Der Typ ist eine neue Variable mit vier Stufen, nominal bis ordinal. Du beschreibst ihn wie jede kategoriale Variable mit Anteilen (`frequency()` mit Gewicht), nicht mit einem Mittelwert.“
- „Die Zahlen sind gewichtet, weil sie Anteile in der Bevölkerung beschreiben.“

Häufige Verwechslung: „Den Code des Typs (1 bis 4) wie eine Messzahl behandeln. `describe(ingle, weights = wghtpew)` rechnet zwar einen Mittelwert aus (2,472), aber als „mittlerer Inglehart-Wert“ sagt er nichts: Die Codes sind Namen der Typen mit einer groben Reihenfolge, keine gleich großen Abstände.“

### Aufgabe 4 „Im Schnitt oder durchgehend?“ (Zusatz)

Link „↑ Grundlage 4 nachlesen“.

Leitfrage: „Wie viele Befragte sind „durchgehend“ populistisch, und wie viele nur im Schnitt?“

Ziel: „Am Ende kannst du sagen, wie viel Prozent drei Populismus-Aussagen allen zustimmen und wie viel Prozent ihnen im Schnitt zustimmen, und erklären, warum sich die beiden Zahlen unterscheiden.“

Grundlage: „Grundlage 4, Ausgleichen oder alle?“

Einleitung: „In der Forschung wird diskutiert, ob Populismus wie ein Mittelwert gemessen werden darf: Kann Zustimmung bei einer Seite des Begriffs eine Ablehnung bei einer anderen ausgleichen? Du nimmst drei Aussagen, je eine für eine Seite des Populismus: pa31 (einfache Bürger statt Berufspolitiker: gegen die Elite), pa32 (Kompromiss ist Verrat: ein einiger Volkswille), pa33 (das Volk soll entscheiden). Zustimmung heißt hier 1 oder 2.“

**Erst festlegen:** „Wie viele stimmen allen drei Aussagen zu, verglichen mit denen, die ihnen im Schnitt zustimmen?“ Optionen: „etwa gleich viele“, „deutlich weniger“, „mehr“.

**Schritte:**

1. „Die Vorlage baut zwei Indizes in einer Kette: `zustimmungen` zählt, wie vielen der drei Aussagen jemand zustimmt (0 bis 3), `kurz` ist der Mittelwert der drei Antworten. Führe sie aus: Sie zeigt die Zahl der Zustimmungen.“ Schilder „row_sums(): neu heute“, „rec(): kennst du aus Sitzung 5“, „frequency() mit Gewicht: kennst du aus Sitzung 6“.

```r
# Drei Aussagen, zwei Indizes: Zahl der Zustimmungen und Mittelwert
allbus %>%
  mutate(
    z31          = rec(pa31, rules = "1:2=1 [stimmt zu]; 3:5=0 [stimmt nicht zu]; else=NA"),
    z32          = rec(pa32, rules = "1:2=1 [stimmt zu]; 3:5=0 [stimmt nicht zu]; else=NA"),
    z33          = rec(pa33, rules = "1:2=1 [stimmt zu]; 3:5=0 [stimmt nicht zu]; else=NA"),
    zustimmungen = row_sums(pick(z31, z32, z33), min_valid = 3),
    kurz         = row_means(pick(pa31, pa32, pa33), min_valid = 3)
  ) %>%
  frequency(⟦zustimmungen⟧, weights = wghtpew)
```

Ausgabe (gewichtet, Valid %): 0: 41.61; 1: 26.19; 2: 18.00; 3: 14.20; Total valid 3471.

2. „Tausch die markierte Stelle gegen `kurz` und führe die Vorlage erneut aus. Jetzt siehst du den Mittelwertindex. Er hat 13 mögliche Werte; R schreibt 1,33 als 1.33333333333333. „Im Schnitt Zustimmung“ heißt: Wert höchstens 2. Lies die Spalte Cum. % in der Zeile 2.“

Ausgabe (gewichtet, Auszug): Zeile `2`: N 264, Valid % 7.61, Cum. % 21.71.

3. „Deuten: Warum sind es im Schnitt mehr als durchgehend? Denk an Person A und B aus Grundlage 4a, und überleg, welche Antworten jemand haben kann, der im Schnitt höchstens 2 hat, aber nicht allen drei Aussagen zustimmt. (Frage a4c unten)“

**Weiterdenken in der Probier-Werkstatt (für die Aufgabe nicht nötig),** zugeklappt: „Für die Aufgabe reichen die Vorlagen oben. Hier ist Platz für eigene Fragen. Eine Idee: Stimmen im Osten mehr Befragte allen drei Aussagen zu als im Westen? Die Probier-Werkstatt startet mit einem Vorschlag.“

```r
# Eine Idee: Zahl der Zustimmungen wie in Aufgabe 4, Westen und Osten im Vergleich
allbus %>%
  mutate(
    z31          = rec(pa31, rules = "1:2=1 [stimmt zu]; 3:5=0 [stimmt nicht zu]; else=NA"),
    z32          = rec(pa32, rules = "1:2=1 [stimmt zu]; 3:5=0 [stimmt nicht zu]; else=NA"),
    z33          = rec(pa33, rules = "1:2=1 [stimmt zu]; 3:5=0 [stimmt nicht zu]; else=NA"),
    zustimmungen = row_sums(pick(z31, z32, z33), min_valid = 3)
  ) %>%
  crosstab(zustimmungen, eastwest, percentages = "col", weights = wghtpew)
```

(Zur Information: allen drei zugestimmt, gewichtet: Westen 12,9 %, Osten 20,7 %.)

**Antwortfragen:**

| id | Art | Label | Optionen | Ziel | Toleranz | Text richtig | Text falsch / Hinweis | Hilfezeile |
|---|---|---|---|---|---|---|---|---|
| a4a | number | Wie viel Prozent stimmen allen drei Aussagen zu? | – | 14.2 | 0.1 | „14,2 % (gewichtet) stimmen allen drei zu: durchgehend populistisch nach dieser Regel.“ | 15.44: „Das ist der Anteil ohne Gewicht. Für eine Aussage über alle steht weights = wghtpew in der Vorlage; führe sie unverändert aus.“<br>41.61: „Das sind die, die keiner Aussage zustimmen (Zeile 0).“<br>sonst: „Lies in Schritt 1 die Zeile 3, Spalte Valid %.“ | „Prozent, Valid % in der Zeile 3.“ |
| a4b | number | Wie viel Prozent stimmen im Schnitt zu (Mittelwert höchstens 2)? | – | 21.71 | 0.1 | „21,71 %. Also stimmen 7,5 Prozentpunkte mehr im Schnitt zu als durchgehend.“ | 7.61: „Das sind nur die mit genau 2. Höchstens 2 heißt: auch 1, 1,33 und 1,67. Lies Cum. % in der Zeile 2.“<br>23.35: „Das ist ohne Gewicht.“<br>14.2: „Das ist der Anteil „allen drei zugestimmt“ aus Schritt 1. Tausch zustimmungen gegen kurz.“<br>sonst: „Führe Schritt 2 mit kurz aus und lies Cum. % in der Zeile 2.“ | „Cum. % in der Zeile 2.“ |
| a4c | choice | Warum stimmen im Schnitt mehr zu als durchgehend? | ausgleich: „Im Mittelwert kann Zustimmung bei zwei Aussagen eine schwächere Antwort bei der dritten ausgleichen.“; gewicht: „Weil der Mittelwertindex gewichtet ist und der andere nicht.“; fehlend: „Weil beim Mittelwertindex mehr Befragte einen Wert haben.“ | ausgleich | – | „Genau. Die 7,5 Prozentpunkte Unterschied sind fast alle Befragte, die zwei Aussagen zustimmen, mindestens einer davon voll, und bei der dritten „teils/teils“ sagen (7,3 Prozentpunkte). Dass eine echte Ablehnung ausgeglichen wird (etwa 1, 1, 4), kommt kaum vor (0,2 Prozentpunkte).“ | gewicht: „Beide sind gewichtet (weights = wghtpew in derselben Vorlage).“<br>fehlend: „Beide haben min_valid = 3 und dieselben 3.471 Befragten (gewichtet).“ | – |

**Hilfe, Stufe 1: Denkanstoß:** „`zustimmungen` zählt, wie vielen Aussagen jemand mit 1 oder 2 zustimmt. `kurz` ist der Mittelwert der drei Antworten. Wer allen zustimmt, hat auch im Schnitt höchstens 2, aber nicht umgekehrt.“

**Hilfe, Stufe 2: Wo schaue ich?:** „Schritt 1: Zeile 3 (allen drei zugestimmt), Spalte Valid %. Schritt 2: Zeile 2, Spalte Cum. %; darin stecken alle Werte bis einschließlich 2.“

**Hilfe, Stufe 3: Lösung:** „Allen drei stimmen 14,20 % zu, im Schnitt stimmen 21,71 % zu. 7,5 Prozentpunkte gelten nur nach der Mittelwertlogik als populistisch. Fast alle von ihnen stimmen zwei Aussagen zu, eine davon voll, und sagen bei der dritten „teils/teils“ (7,3 Prozentpunkte); eine echte Ablehnung wird nur selten ausgeglichen (0,2 Prozentpunkte).“

**Ohne Grafik lösbar:** „Diese Aufgabe hat keine Grafik. Alle Zahlen stehen in den Ausgaben von Schritt 1 und Schritt 2.“

**Fürs Plenum:** „Ist jemand populistisch, der zwei Aussagen zustimmt, eine davon voll, und bei der dritten „teils/teils“ sagt? Welche Regel passt besser zum Begriff: Mittelwert oder „allen zugestimmt“?“

---

## 8 Hilfe bei R-Fehlermeldungen (unter jeder Aufgabe, zugeklappt „Hilfe: R meldet einen Fehler“)

| R meldet | Das hilft |
|---|---|
| `konnte Funktion "%>%" nicht finden` (Werkstatt: `could not find function "%>%"`) | Den Startblock in „R lesen“ ausführen. |
| `Objekt 'allbus' nicht gefunden` | Die Zeile mit `read_spss()` aus dem Startblock ausführen. |
| ``Can't select columns that don't exist. ✖ Column `mm02_um` doesn't exist.`` | Die umgepolte Variable gibt es nur in der Kette, die sie mit `mutate()` baut. Lass den `mutate()`-Teil in der Vorlage stehen und führe die ganze Vorlage aus, nicht nur die letzte Zeile. |
| ``Column `pa3` doesn't exist`` | Variablenname vertippt. Prüf ihn Zeichen für Zeichen: pa29 bis pa35, mm01 bis mm06 (mit Null). |
| ``In argument: `p = row_means(pa29, pa30, …)`. … `data` must be a data frame or tibble.`` | Die Items gehören in `pick()`: `row_means(pick(pa29, pa30, …), min_valid = 5)`. |
| ``Caused by error in `pick()`: ! Must only be used inside data-masking verbs like `mutate()` …`` | `row_means(pick(…))` steht immer in `mutate()`, nicht direkt nach `%>%`. |
| ```min_valid` (8) is greater than the number of items (7). All rows will be "NA".`` (Warnung) | `min_valid` darf höchstens so groß sein wie die Zahl der Items in `pick()`. |
| ```min_valid` must be a positive whole number of items. ✖ Got 0.`` | `min_valid` ist eine ganze Zahl ab 1, etwa 5. |
| `` `rules` must be a single character string.`` | Die Regel steht in Anführungszeichen: `rules = "rev"`. |
| `Invalid rule: "reverse". Expected format: "old=new".` | Umpolen heißt genau `rules = "rev"`. |
| ``Unknown argument `weight` of `describe()`. ℹ Did you mean `weights` instead of `weight`?`` | Mit s: `weights = wghtpew`. |
| `` `reliability()` requires at least 2 items.`` | In `reliability()` gehören mindestens zwei Items, durch Kommas getrennt. |
| `konnte Funktion "Reliability" nicht finden` | R unterscheidet Groß- und Kleinschreibung: `reliability()`, `row_means()` klein. |
| `Warnmeldung: Cronbach's alpha is negative (…) … check the item codings.` | Kein Fehler: Items zeigen in verschiedene Richtungen. Andersherum gefragte Items mit `rec(…, rules = "rev")` umpolen (Grundlage 3). |
| α ändert sich nach dem Umpolen nicht | In `reliability()` stehen noch die alten Namen. Tausch sie gegen die Namen mit `_um`. |

---

## 9 Überblick „Vom Item zum Index“

Kopf: „Überblick zu allen Aufgaben“. Unterzeile: „Alle vier Themen zusammen: in welcher Reihenfolge du einen Index baust und welcher Index wann passt.“

#### Karte Ü1 „Vom Item zum Index in fünf Schritten“ (Bild Ü1 `s8-ablauf`)

Bild: fünf Steine in einer Reihe (bei 390 px untereinander), verbunden mit Pfeilen, je mit Nummer, Titel und Funktion (Funktion in Code-Schrift):
1. „Items lesen: Was messen sie, wofür steht die 1?“ – `frequency()`
2. „Gleiche Richtung herstellen“ – `rec(…, rules = "rev")`
3. „Stimmigkeit prüfen: α, Trennschärfen“ – `reliability()` + `summary()`
4. „Index bilden: Regel für fehlende Antworten“ – `row_means(pick(…), min_valid = …)`
5. „Beschreiben und deuten, mit Gewicht“ – `describe(…, weights = wghtpew)`

Textfassung Ü1: „Fünf Schritte vom Item zum Index. Erstens Items lesen: Was messen sie, und wofür steht die 1? Mit frequency. Zweitens gleiche Richtung herstellen, mit rec und rules gleich rev. Drittens Stimmigkeit prüfen, Cronbachs Alpha und Trennschärfen, mit reliability und summary. Viertens Index bilden und festlegen, wie viele gültige Antworten nötig sind, mit row_means, pick und min_valid. Fünftens beschreiben und deuten, mit describe und weights gleich wghtpew.“

Text darunter: „In den Aufgaben hast du die Schritte in anderer Reihenfolge geübt: erst den Index (A1), dann die Stimmigkeit (A2), dann die Richtung (A3). In einer eigenen Auswertung gehst du von 1 bis 5.“

#### Karte Ü2 „Welcher Index?“ (Bild Ü2 `s8-welcher-index`, Entscheidungsbaum wie der Baum im Überblick von Sitzung 4)

Baum von oben nach unten:
- Frage 1 (Kasten): „Darf eine hohe Antwort bei einem Item eine niedrige bei einem anderen ausgleichen?“ – nein → Blatt „**Kombinationsindex**: feste Regel, etwa „allen zugestimmt“ oder ein Typ aus Rängen“ (Beispiel „Inglehart-Index, durchgehend populistisch“; darunter klein `rec()` + `row_sums()`).
- ja → Frage 2: „Zeigen alle Items in dieselbe Richtung?“ – nein → Kasten „erst umpolen“ (`rec(…, rules = "rev")`), Pfeil zurück zu Frage 2.
- ja → Frage 3: „Hängen die Items eng genug zusammen (α, Trennschärfen)?“ – nein → Blatt „Items und Begriff überdenken: ein Item zu viel? zwei Dimensionen?“ (grau).
- ja → Blatt „**Mittelwertindex**“ (Beispiel „Populismus, Haltung zu Geflüchteten“; darunter klein `row_means(pick(…), min_valid = …)`).
Optik: Fragekästen weiß mit dunklem Rand, Blätter als grüne Steine, Pfeile mit „ja“/„nein“.

Textfassung Ü2: „Entscheidungsbaum. Erste Frage: Darf eine hohe Antwort bei einem Item eine niedrige bei einem anderen ausgleichen? Wenn nein, nimmst du einen Kombinationsindex mit einer festen Regel, etwa allen zugestimmt oder einen Typ aus Rängen wie beim Inglehart-Index; in R mit rec und row_sums. Wenn ja, zweite Frage: Zeigen alle Items in dieselbe Richtung? Wenn nein, erst umpolen, dann noch einmal fragen. Wenn ja, dritte Frage: Hängen die Items eng genug zusammen, also Cronbachs Alpha und Trennschärfen? Wenn nein, Items und Begriff überdenken. Wenn ja, bildest du einen Mittelwertindex mit row_means, pick und min_valid.“

Kurz gesagt: „Zuerst entscheidet der Begriff (darf man ausgleichen?), dann prüfen Richtung und α, ob die Items zusammen einen Mittelwert tragen.“

#### Karte Ü3 „Voraussetzungen“

| Schritt | braucht | Vorsicht |
|---|---|---|
| Mittelwertindex | Items mit gleicher Antwortskala, alle in derselben Richtung, ein gemeinsamer Begriff | Mittelwert lässt Ausgleich zu; Richtung des Index nennen („1 heißt …“). |
| `min_valid` | eine begründete Regel, wie viele Antworten nötig sind | Zu streng: viele ohne Wert; zu locker: Werte aus einer einzigen Antwort. Regel und n berichten. |
| Cronbachs α | mindestens zwei Items, Befragte mit allen Antworten (listenweise) | Steigt mit der Zahl der Items; prüft weder eine Dimension noch die Validität; Faustregeln sind keine Grenzen. |
| Trennschärfe, α ohne Item | dieselbe Ausgabe | Ein Item nicht nur wegen der dritten Nachkommastelle streichen; der Inhalt entscheidet. |
| Kombinationsindex | eine inhaltlich begründete Regel | Mit `row_sums()` immer `min_valid` setzen; Ergebnis ist eine kategoriale Variable: Anteile berichten, keinen Mittelwert der Codes. |
| Gewichtung | `weights = wghtpew` für Aussagen über die Bevölkerung | α und Personenzahlen ohne Gewicht; gewichtet ändert sich α kaum. |

Häufige Verwechslung: „„Hohes α, also gute Skala.“ α sagt nur, dass die Items zusammenpassen. Ob sie das Richtige messen (Validität) und ob ein Mittelwert zum Begriff passt, entscheidest du am Inhalt.“

---

## 10 Mitnehmen

### Das Wichtigste aus dieser Sitzung
- Einstellungen misst man mit mehreren Items. Ein Index fasst sie zu einem Wert je Person zusammen; im Mittelwert gleichen sich zufällige Messfehler teilweise aus.
- Ein Mittelwertindex ist der Mittelwert der gültigen Antworten einer Person. `min_valid` legt fest, wie viele Antworten mindestens nötig sind.
- Vorher müssen alle Items in dieselbe Richtung zeigen. Andersherum gefragte Items polst du mit `rec(x, rules = "rev")` um. Eine negative Trennschärfe oder ein negatives α zeigen ein falsch gepoltes Item.
- Cronbachs α misst, wie stimmig die Items zusammen sind (Reliabilität). Faustregel: ab 0,7 annehmbar, ab 0,8 gut. α steigt aber auch mit der Zahl der Items und sagt nichts über die Validität.
- Die Trennschärfe zeigt, wie gut ein Item zu den anderen passt; „Alpha if Deleted“, wie hoch α ohne das Item wäre. Ob ein Item bleibt, entscheidet der Inhalt.
- Ein Kombinationsindex verbindet Antworten nach einer festen Regel und lässt keinen Ausgleich zu, etwa „allen zugestimmt“ oder der Inglehart-Index.
- Einen Index deutest du immer mit seiner Richtung: Wofür steht eine hohe Zahl?
- In R: `mutate(index = row_means(pick(…), min_valid = …))`, `reliability(…) %>% summary()`, `rec(…, rules = "rev")`, zum Zählen `row_sums()`.

### Prüf dich selbst (5 Fragen, je Auswahl mit Prüfen; Rückmeldung „Deine Wahl: „…“.“ plus Begründung)

1. „Eine Skala aus 20 Items hat α = 0,92. Was folgt daraus?“ Optionen: „Die Skala misst sicher, was sie messen soll.“, „Die Items hängen zusammen; wie eng, sagt α allein nicht, weil α mit der Zahl der Items steigt.“, „92 % der Befragten antworten stimmig.“ Richtig: 2. Begründung: „Bei 20 Items reicht schon eine mittlere Korrelation von 0,2 für ein hohes α. Und ob die Skala das Richtige misst, ist eine Frage der Validität (Grundlage 2b und 2c).“
2. „Ein Item hat in `summary()` eine Trennschärfe von −0,35. Was tust du zuerst?“ Optionen: „Item sofort streichen“, „Wortlaut lesen: Ist das Item andersherum gefragt? Dann umpolen.“, „Nichts, negative Werte sind normal“. Richtig: 2. Begründung: „Eine negative Trennschärfe heißt fast immer: Das Item zeigt in die andere Richtung. Nach dem Umpolen passt es meist (Grundlage 3, Aufgabe 3).“
3. „Eine Person hat drei von vier Items beantwortet. Der Index wird mit `min_valid = 4` gebildet. Welchen Wert bekommt sie?“ Optionen: „den Mittelwert ihrer drei Antworten“, „keinen Wert (NA)“, „den Mittelwert, wobei die fehlende Antwort als 0 zählt“. Richtig: 2. Begründung: „min_valid = 4 verlangt vier gültige Antworten. Mit min_valid = 3 bekäme sie den Mittelwert ihrer drei Antworten; als 0 zählt eine fehlende Antwort nie (Grundlage 1b).“
4. „Ein Populismus-Index hat bei einer Person den Wert 1,4. Die Items reichen von 1 „stimme voll zu“ bis 5 „lehne ganz ab“. Was heißt das?“ Optionen: „Die Person ist kaum populistisch.“, „Die Person stimmt den Aussagen im Mittel stark zu, ist also eher populistisch.“, „Die Person hat 1,4 Aussagen zugestimmt.“ Richtig: 2. Begründung: „Ein niedriger Wert heißt hier Zustimmung. Die Richtung eines Index ergibt sich aus den Items (Aufgabe 1).“
5. „Befragte sollen vier Ziele in eine Rangfolge bringen. Welcher Index passt?“ Optionen: „ein Mittelwertindex der vier Ränge“, „ein Kombinationsindex, der nach einer Regel aus den ersten Plätzen einen Typ bildet“, „Cronbachs α der vier Ränge“. Richtig: 2. Begründung: „Der Mittelwert von vier Rängen ist bei allen 2,5. Ein Kombinationsindex wie der Inglehart-Index nutzt die Reihenfolge (Grundlage 4b).“

### Dein Skript zum Mitnehmen

Text: „Alle Vorlagen dieser Sitzung in einer Datei, mit Kommentaren. Öffne sie in RStudio und führe sie Block für Block aus.“ Knopf „Skript herunterladen (sitzung8.R)“; Link „→ Nachlesen im R-Workshop, Kapitel 5 und 8“.

Skriptteile in dieser Reihenfolge (Titel als Kopfkommentar `# ---- Titel ----`, Marken mit ihrem Beispielwert; ohne Probier-Werkstätten):

| Schlüssel | Titel |
|---|---|
| `start` | Startblock |
| `r_rev` | Umpolen erinnert: fr03b |
| `r_rowmeans` | Ein Wert je Person: Index zu Geflüchteten |
| `r_reliability` | Reliabilität: Verbundenheit |
| `a1` | Aufgabe 1: Populismus-Index, wer bekommt einen Wert |
| `a1w` | Aufgabe 1: Populismus-Index gewichtet |
| `a2` | Aufgabe 2: Reliabilität der sieben Aussagen |
| `a2ohne` | Aufgabe 2: Gegenprobe ohne ein Item |
| `a3` | Aufgabe 3: sechs Aussagen zu Islam und Muslimen, wie gefragt |
| `a3um` | Aufgabe 3: umpolen und neu prüfen |
| `a4` | Aufgabe 4: Zahl der Zustimmungen und Mittelwert |

Kopf des Skripts: „# Sitzung 8: Index und Skala“, „# Statistikatlas, Methoden Ib, ALLBUS 2023 (ZA8831 v1.3.0)“, „# Markierte Stellen aus dem Atlas stehen hier mit ihrem Beispielwert.“ (wie Sitzung 4). Zusatzzeile: „# In Aufgabe 3 (a3um) musst du mm02 und mm05 in reliability() noch gegen mm02_um und mm05_um tauschen.“

Probier-Werkstätten (`frei_a1` bis `frei_a4`) sind als `tryOut` markiert und stehen nicht im Skript.

---

## 11 Entscheidungen (offene Fragen, die ich selbst entschieden habe)

1. **Themen und Reihenfolge.** Sitzungsplan 9 nennt Mittelwertindex, Kombinationsindex, Cronbachs α, Reliabilität und Validität. Die Reihenfolge Index → α → Umpolen → Kombinationsindex beginnt mit dem anschaulichsten Teil (ein Wert je Person) und nutzt in Thema 3 das schon bekannte α als Werkzeug, um falsch gepolte Items zu entdecken (negative Trennschärfe). Die Reihenfolge einer echten Auswertung (Richtung → α → Index) steht im Überblick (Ü1) und wird dort ausdrücklich genannt.
2. **Drei Pflichtaufgaben, A4 Zusatz.** Index bilden, α lesen und umpolen sind der Kern (Kern laut Auftrag). A1 12, A2 13, A3 14 Minuten (zusammen 39). Der Kombinationsindex (alte Kür) bleibt Zusatz wie bisher; er braucht eine lange `mutate()`-Kette mit fünf neuen Variablen.
3. **Gewichtung wie in der bisherigen Aufgabe `s07`.** Dort waren α und die Stellvertreter-Korrelation ungewichtet („Die Aufgabe rechnet ungewichtet“), die Kür (Anteile) gewichtet. Übernommen: α, Trennschärfen und Personenzahlen ungewichtet, Mittelwerte und Anteile gewichtet. Begründung im Kapitel: α beschreibt das Messinstrument, nicht die Bevölkerung; gewichtet ändert es sich kaum (0,829 statt 0,833; Islam 0,176 statt 0,177). In A1 gibt es deshalb zwei Vorlagen (Personen zählen ohne, Mittelwert mit Gewicht), weil die gewichtete Ausgabe von `describe()` bei N die Summe der Gewichte zeigt (3416 statt 3427) und eine Frage nach „wie viele Befragte“ sonst mehrdeutig wäre.
4. **Variablen.** Aufgaben: Populismus pa29–pa35 (Leitfrage des Curriculums, alte Aufgabe) und Islam mm01–mm06 (zwei klar andersherum formulierte Items, α 0,177 → 0,840). Grundlagen: mp16–mp19 (vier gleich gepolte Items, gute Verteilung für den Index), pn12/13/16/17 (α 0,726 mit einem Item, ohne das α leicht steigt, und einem inhaltlich verständlichen Grund), fr07/fr08/fr03b/fr04b (zwei gegen zwei; aus dem Einstieg der alten Aufgabe, dort acht Items), va01–va04/ingle (klassischer Kombinationsindex). Die Populismus-Batterie zieht sich durch A1, A2 und A4, damit die Aufgaben aufeinander aufbauen und die Leitfrage beantworten; jede Vorlage baut ihren Index trotzdem selbst.
5. **Thema Islam und Muslime (A3): bleibt, mit neutraler Rahmung (Prüfung 23.11.2026).** Das Thema ist politisch sensibel. Es bleibt, weil die Rahmung jetzt neutral, messbezogen und respektvoll ist: Die Einleitung nennt die Items Messinstrumente der Einstellungsforschung, „keine Feststellungen dieses Kurses“, und sagt, dass nur die Messung geprüft wird; die Richtung heißt „Vorbehalte gegenüber Islam und Muslimen“ (statt „Skepsis“), der Index in der Probier-Werkstatt `vorbehalte` (statt `islam`); keine Aufgabe, kein Plenum und kein Kapiteltext macht eine Aussage über Muslime oder über die Verteilung der Vorbehalte. Die im Plan genannte Alternative (Batterie zu Ausländern mp02–mp12, positiv gestellt mp05, mp10, mp12; α vorher 0,134) ist nicht weniger sensibel („begehen häufiger Straftaten“, „nehmen Arbeitsplätze weg“), didaktisch schwächer (sieben Items, schwächere Trennschärfen nach dem Umpolen), überschneidet sich inhaltlich mit Grundlage 1 (Geflüchtete und Sozialstaat) und mp05 kommt in Sitzung 4 vor. Falls der Dozent das Thema trotzdem nicht möchte: mp-Batterie mit `rec()` für mp05, mp10, mp12 (Zahlen dann neu rechnen).
6. **Kette statt `allbus <- allbus %>% mutate(…)`.** Wegen des Nachtrags (jede Vorlage läuft für sich) bauen alle Vorlagen ihre Variablen in derselben Kette. Karte R1 erklärt, dass die Variable in RStudio danach nicht bleibt und wie man sie mit `allbus <-` behält (Schreibweise aus Sitzung 5). Das weicht vom Leitfaden („Neue Variablen immer mit `allbus <- allbus %>% mutate()`“) ab, folgt aber Sitzung 5, die ebenfalls in Ketten arbeitet.
7. **`row_sums()` neu in Sitzung 8.** Laut Funktionstabelle gehört `row_sums()` zu Sitzung 5; der Plan von Sitzung 5 streicht es ausdrücklich („gehört inhaltlich zu Sitzung 8“). Darum Schild „neu heute“ in A4. `pick()` ist ebenfalls neu.
8. **`min_valid` in A1: erst 7, dann 5.** Die Vorlage startet streng (alle sieben), die Anpassung auf 5 (zwei Drittel) zeigt, wer dazukommt (168 Personen). Für A3-Weiterdenken und A1-Weiterdenken gilt 5 von 7 bzw. 5 von 6, für Grundlage 1 und A4 3 von 4 bzw. 3 von 3. Die Faustregel „zwei Drittel“ steht als Gewohnheit, nicht als Gesetz, in Grundlage 1b.
9. **Formel für α: standardisierte Form.** Die Varianzform (k / (k − 1) × (1 − Summe der Itemvarianzen / Varianz der Summe)) ist für Studierende ohne Vorkenntnisse schwer zu lesen. Die standardisierte Form mit k und r̄ zeigt die beiden Stellschrauben direkt und lässt sich mit der Korrelationstabelle nachrechnen; R druckt sie als „Alpha (standardized)“. Der Unterschied zum gedruckten α wird in „Genauer erklärt“ benannt.
10. **McDonalds ω nur am Rand.** Curriculum nennt „Reliabilität · Alpha & Omega“. ω wird in Grundlage 2b einmal erklärt und in den Antwortprüfungen als Verwechslung erkannt; keine Aufgabe fragt nach ω. Grund: Zeit, und ω bleibt bei falsch gepolten Items scheinbar ordentlich (Islam vorher ω 0,508), was ohne Faktorenmodell schwer zu erklären ist.
11. **Eindimensionalität.** Die Faktorenanalyse (Sitzungsplan 7 und 8) kommt im Lernpfad nicht vor (curriculum.ts springt von „Mittelwerte vergleichen“ zu „Index und Skala“). „Eine Dimension“ wird deshalb inhaltlich über die Verbundenheits-Korrelationen (Gemeinde–EU 0,190) und den Hinweis „α prüft nicht, ob es eine Dimension ist“ behandelt.
12. **Zielwerte und Toleranzen.** α-Werte Toleranz 0,0015 (drei Stellen exakt; Nachbarwerte wie standardisiertes α 0,830 oder ω 0,841 liegen außerhalb und haben eigene Rückmeldungen). Mittelwert A1 Toleranz 0,005 (2,646 gewichtet mit 5 und 2,648 mit 7 werden beide angenommen; 2,65 ebenfalls). Prozentwerte Toleranz 0,1; Grundlage 1c 0,5 (Zusammenzählen gerundeter Säulen). Ganze Zahlen (3427, 3595, 6) ohne Toleranz; „3.427“ wird durch die doppelte Lesart als 3427 erkannt. Mehrdeutig wäre nur ein Zielwert wie 3,427; den gibt es nicht. Eingabe „0,83“ wird als 0,830 gelesen und landet in der Sonderfall-Rückmeldung zum standardisierten α, die auch auf Runden hinweist.
13. **Kombinationsindex mit drei Items (A4)** wie die alte Kür (pa31, pa32, pa33, eine Aussage je Seite des Populismus); die alte Zahl 21,7 % / 14,2 % ist bestätigt. `rec()`-Regeln mit `else=NA` wie in Sitzung 5 (ohne `else` wäre das Ergebnis dasselbe; mit `else=0` würden fehlende Antworten zu 0, das wurde geprüft und vermieden).
14. **Frageformulierungen.** pa29–pa35 und fr-Items wörtlich aus der alten Aufgabe (`content.ts`), mm-, mp-, pn- und va-Items sinngemäß nach den Variablenlabels bzw. dem bekannten Inglehart-Wortlaut. **Vor der Live-Schaltung mit dem Fragebogen abgleichen.**
15. **Bildmodul-Name:** `bilder/lp08.py` (wie in Sitzung 3 vorgeschlagen, um Kollisionen mit `RWorkshop/figuren/kap08.py` zu vermeiden).
16. **Curriculum-Leitfrage** bleibt im Kern („Wie misst man Populismus mit mehreren Fragen?“), ergänzt um „– und woran erkennst du, ob die Fragen zusammenpassen?“. Vorschlag für `question` in curriculum.ts: die ergänzte Fassung.
17. **„Kennst du aus“-Schilder** sind gegen die Pläne `sitzung05.md`, `sitzung06.md` und `sitzung07.md` geprüft (Prüfung 23.11.2026): `rec(…, rules = "rev")` in `mutate()` und Ketten mit `mutate()` aus Sitzung 5 (Grundlage 4 und Zusatzaufgabe 4, dort an ep01/pe05; Sitzung 5 kündigt den Mittelwert über mehrere Fragen ausdrücklich für Sitzung 8 an); `weights = wghtpew` mit `frequency()` und `describe()` und „N gewichtet = Summe der Gewichte“ aus Sitzung 6; `summary()` (R lesen), `t_test()` mit Hedges' g und die Korrelationsmatrix mit `pearson_cor()` (Thema 4, paarweiser Ausschluss) aus Sitzung 7; `find_var()` mit mp16 bis mp19 aus Sitzung 1 (Aufgabe 2). Sitzung 9 setzt aus Sitzung 8 nichts voraus.

## 12 Abweichungen zu den Folien von Sitzung 8

Für Sitzung 8 gibt es noch keine Folien (`Seminarvorbereitung/` enthält Sitzung 1 bis 4). Abgleich nur mit dem Sitzungsplan (Sitzung 9 im Plan WiSe 24/25):

| Sitzungsplan | Kapitel |
|---|---|
| Wiederholung Reliabilität, Validität | Grundlage 2a (Reliabilität und Validität), Schild „Wiederholung aus der Vorlesung“; Validität zusätzlich in A2 (pa29) und im Überblick. |
| Input Mittelwertindex | Thema 1 (Grundlage 1, A1), dazu `min_valid`. |
| Input Kombinationsindex | Thema 4 (Grundlage 4 mit Inglehart, A4 als Zusatz). |
| Input Cronbachs Alpha | Thema 2 (Grundlage 2, A2) und Thema 3 (Umpolen mit α als Prüfwerkzeug). |
| Skalengüte | Faustregeln und ihre Grenzen (2c), Überblick Ü3. |
| Faktorenanalyse (Sitzungen 7 und 8 im Plan) | nicht im Kapitel; nur der Hinweis, dass α keine Dimensionalität prüft (Entscheidung 11). |

Wenn Folien entstehen, sollten sie dieselbe Schreibweise nutzen (`row_means(pick(…), min_valid = …)` in `mutate()`, `reliability(…) %>% summary()`, `rec(…, rules = "rev")`) und im Input andere Batterien als pa29–pa35 und mm01–mm06 zeigen, damit die Arbeitsphase nichts vorwegnimmt.

---

## 13 Prüfung (Agent, 23.11.2026)

Geprüft nach `teil-b-plan-pruefung.md` gegen Design, Prototyp Sitzung 4 und die Nachbarpläne `sitzung05.md`, `sitzung06.md`, `sitzung07.md`, `sitzung09.md` (dazu `sitzung01.md` für mp16 bis mp19). `Rscript sitzung08-zahlen.R` vorher und nachher mit Exit 0; nachher sieben zusätzliche Prüfungen (siehe Blickwinkel 3).

### Blickwinkel 1: schwache Studentin ohne Vorwissen

Durchgespielt (Seminar, nur Aufgaben): A1 etwa 12 Minuten (zwei Ausführungen, eine Anpassung, fünf Fragen), A2 etwa 13 (eine lange Ausgabe, eine Löschung), A3 etwa 14 (zwei Namen tauschen), zusammen knapp 40 Minuten; A4 etwa 12. Grundlagen etwa 12, 15, 10 und 8 Minuten. Jeder Schritt ist mit dem lösbar, was davor steht; Fachbegriffe haben „Kurz gesagt“. Stockstellen:
- Die ausführliche Ausgabe von `reliability()` hat vier Teile, B6 zeigte nur zwei; man sucht. **Geändert:** Satz unter B6, welche Teile dazwischen stehen und wohin man springt.
- In Grundlage 2a wirkte die Korrelationstabelle wie eine neue Sache, obwohl Sitzung 7 die Korrelationsmatrix einführt, dort aber mit paarweisem N. **Geändert:** Satz unter B4 (Anschluss an Sitzung 7, listenweiser Ausschluss wie bei α, dieselbe Tabelle steht in `summary()`).
- „R lesen“ zeigt den Mittelwert 2,457 (min_valid = 3), B3 nennt 2,45 (min_valid = 4); wer vergleicht, stutzt. **Geändert:** Bildunterschrift B3 nennt beide Zahlen.
- mp16 bis mp19 kennen die Studierenden aus Sitzung 1 (Aufgabe 2, `find_var()`). **Geändert:** Schild und ein Satz in Karte 1a.
- A4 Schritt 3 („Warum mehr?“) war nur Ablesen der Option. **Geändert:** Denkanstoß im Schritt (Person A und B, welche Antworten ergeben im Schnitt höchstens 2).

### Blickwinkel 2: Didaktik

Grundlagen führen je direkt in ihre Aufgabe und nutzen andere Variablen (mp/pn/fr/va gegen pa/mm); keine Grundlage verrät eine Lösung. Festlegen vorher gibt es in jeder Aufgabe, Deuten-Fragen (a1e, a2e, a3d, a4c) verlangen Nachdenken über Richtung und Inhalt. Die Probier-Werkstätten sind echte Anschlussfragen. R bleibt Beiwerk.
- **Sensibilität von A3 (Islam-Items), Urteil: behalten, neu gerahmt.** Vorher: Titel „Aussagen zum Islam“, Richtung „Skepsis gegenüber dem Islam“, Index `islam` in der Probier-Werkstatt, Einleitung eher abwehrend („nicht aus diesem Kurs“). „Skepsis“ verharmlost, `islam` als Name für einen Vorbehalts-Index setzt die Religion mit der Ablehnung gleich. **Geändert:** Titel „Einstellungen zu Islam und Muslimen“, Leitfrage messbezogen („Wie fasst man sechs Aussagen, die in verschiedene Richtungen gestellt sind, richtig zu einem Index zusammen?“), Einleitung ordnet die Items als übliche Messinstrumente der Einstellungsforschung ein, „keine Feststellungen dieses Kurses“, und sagt, dass nur die Messung geprüft wird; Richtung durchgehend „Vorbehalte gegenüber Islam und Muslimen“ bzw. „offene Haltung“ (a3a, a3d, Hilfe 1 und 3); Probier-Werkstatt `vorbehalte`/`vorbehalte_falsch`. Kein Kapiteltext, keine Frage und kein Plenum macht eine Aussage über Muslime oder über das Ausmaß der Vorbehalte. Die Alternative aus dem Plan (mp02–mp12) ist nicht weniger sensibel und didaktisch schwächer (Entscheidung 5 neu gefasst).
- **A4 deutete den Unterschied falsch.** Plan: Die 7,5 Prozentpunkte seien Befragte, die eine Aussage „ablehnen“ und das ausgleichen. Nachgerechnet: 7,3 der 7,51 Prozentpunkte sagen bei der dritten Aussage „teils/teils“ (und stimmen einer anderen voll zu); eine echte Ablehnung (1, 1, 4) sind nur 0,2 Punkte. **Geändert:** Option und Rückmeldung a4c, Hilfe 3 und „Fürs Plenum“ (jetzt die datennahe, ergiebigere Frage, ob „zwei zu, einmal teils/teils“ populistisch ist). Grundlage 4a behält das Beispiel 1, 1, 4 als Prinzip.

### Blickwinkel 3: Fachliches und Barrierefreiheit

Alle Zielwerte entsprechen der gedruckten mariposa-Ausgabe (Rundung, Toleranzen, Sonderfälle; keine mehrdeutigen Tausender-Zielwerte). Jedes Bild hat eine Textfassung mit Werten; jede Aufgabe ist ohne Grafik lösbar. Sprache: Du-Form, kein „(fiktiv)“, kein „·“ im Kapiteltext, keine Rollen. R-Stil: tidyverse vor mariposa, `%>%`, `rec()` in `mutate()`, kein `ifelse()` in Vorlagen, kein Filter-Code für fehlende Werte nötig. Keine Einzelfallwerte. Befunde:
- Karte 3a behauptete, `rules = "rev"` nehme den kleinsten und größten **gültigen** Code. mariposa nimmt die Skala aus den Wertelabels (Meldung „on the scale 1-7 defined by its value labels (observed 2-5)“), wie die Prüfung von Sitzung 5 schon korrigiert hat. **Geändert** und im Skript geprüft.
- Karte 3b verallgemeinerte „bei vier Items mit zwei Richtungen sind ohne Umpolen alle Trennschärfen negativ“; das gilt für diese Items, nicht allgemein. **Geändert** (auf das Beispiel bezogen).
- Grundlage 4b nannte „2,48“ als mittleren Inglehart-Code, ohne Rechnung; gewichtet ist es 2,472. **Geändert**, mit der Vorlage-Schreibweise `describe(ingle, weights = wghtpew)`, im Skript geprüft. „136 Befragte (gewichtet)“ umformuliert zu „gewichtete Anzahl 136“.
- Probier-Werkstatt A1, Information: Sitzung 7 arbeitet mit Hedges' g, nicht Cohens d. **Geändert** (g = 0,375, im Skript geprüft).
- „Kennst du aus“-Schilder gegen `sitzung05.md`–`sitzung07.md` abgeglichen: `rec(rev)` Sitzung 5, Gewicht und „N gewichtet = Summe der Gewichte“ Sitzung 6, `summary()` und Korrelationsmatrix Sitzung 7 stimmen. **Geändert:** Entscheidung 17 (vorher „Pläne lagen nicht vor“).
- Skript: neu geprüft werden Hedges' g, der Mittelwert der ingle-Codes, `rev` auf der Label-Skala, die Zerlegung des A4-Unterschieds (21,71; 7,51; 7,3; 0,2; volle Zustimmung bei allen teils/teils-Fällen) und α der Alternativbatterie (0,134). Vorlage `frei_a3` umbenannt und wörtlich abgeglichen.

### Bewusst nicht geändert
- Wortlaut der mm-, pn- und va-Items ist sinngemäß nach den Variablenlabels (Entscheidung 14); vor der Live-Schaltung mit dem Fragebogen abgleichen. Nicht ohne Fragebogen zu klären.
- Die α-Formel ist die standardisierte Form (0,731), gedruckt und abgefragt wird das unstandardisierte α (0,726). Der Unterschied ist in Karte 2b erklärt; die Varianzform wäre für die Zielgruppe zu schwer.
- Das Skript enthält noch die Prüfung „kurz = 2: 174 / 90“ aus der alten Deutung; sie stimmt weiterhin und schadet nicht.
- Zeitbedarf (knapp 40 Minuten Pflicht) ist geschätzt, nicht gemessen; im Testlauf prüfen. Wenn es knapp wird, ist A2 Schritt 2 (Gegenprobe ohne pa29) der Kandidat zum Kürzen.
- Ob das Islam-Thema bleibt, ist am Ende eine Entscheidung des Dozenten; die Ausweichbatterie ist in Entscheidung 5 beschrieben.


## Nacharbeit nach Kapitelprüfung (23.11.2026)

- **Zahlenskript:** `sitzung08-zahlen.R` prüft jetzt auch SD 0,838 (R2), Schiefe 0,094 und Missing 1773 der describe()-Zeile von `fluechtlinge` sowie SD 0,760 (A1). Kommentare in `allbus.local.test.ts` verweisen auf das Skript; die Selbstbestätigung `POP.weighted.median === 2.714` ist entfernt.
- **a2d:** Toleranz 0,0015 auf 0,0005 (0,841 ist McDonalds ω aller sieben Items und galt sonst fälschlich als richtig). Eigene Rückmeldung für 0,841 (Tabelle oben schon nachgetragen). Rückübernahme in Pläne mit α-Zielwerten nahe an ω: Toleranz nie größer als der Abstand zur nächsten Verwechslungszahl.
- **a3-Vorlage:** Kommentar „… sechs Aussagen zu Islam und Muslimen, so wie sie im Datensatz stehen?“ (Plan und Inhalt; der Test legt den Wortlaut fest).
- **α-Rechner:** `aria-valuetext` des r̄-Reglers mit drei Nachkommastellen (wie die angezeigte Zahl, `de(r, 3)`).
- **Ü1:** `aria-label` der Liste kurz („Fünf Schritte vom Item zum Index“); die Liste selbst ist die Textfassung. Der lange Text `ALT.ablauf` entfällt (Textfassung Ü1 oben nur noch Lesehilfe, nicht im Code).
- **Schild „Wiederholung aus der Vorlesung“:** Der Satz steht als `knownNote` des `ChapterLayout` (ersetzt den Standardsatz über graue Schilder).
- **Freie Karte:** Hinweise in Grundlage 1 (Begriffe `row_operations`, `item_score`) und Grundlage 2 (`reliability`) sind `MapLink`.
- **Auflösung der Festlegung:** „Deine Festlegung vorher war: …“ erscheint erst, wenn keine Frage der Aufgabe mehr offen ist (Regel des Leiters).
