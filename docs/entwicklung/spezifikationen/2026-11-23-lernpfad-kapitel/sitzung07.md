# Sitzung 7 „Mittelwerte vergleichen“: Inhaltsplan für das Kapitel

Stand: 23.11.2026. Plan nach Teil B des Rollouts (`docs/entwicklung/plaene/2026-11-23-lernpfad-kapitel-rollout.md`, Task 6), Muster: `prototyp/sitzung4.html`.
Curriculum: `id: 7`, Sitzungsplan 6, bisherige Aufgabe `s06` (`src/tasks/s06-letzte-frage/`), altes Konzept `2026-09-29-lernpfad-aufgaben/sitzung-06.md`.

**Zahlen:** Jede Zahl in diesem Plan stammt aus `sitzung07-zahlen.R` (ALLBUS 2023, ZA8831 v1.3.0, mariposa 0.7.4, gewichtet mit `wghtpew`). Das Skript bricht ab, sobald eine Zahl nicht mehr stimmt, und führt jede Vorlage einmal aus. Konstruierte Beispiele (n-Regler, Welch-Beispiel, F-Labor) sind als solche gekennzeichnet und im Skript nachgerechnet.

**Schreibweise in diesem Plan:** Zahlen im Fließtext deutsch (7,99; 1.530). Code und R-Ausgaben so, wie R sie druckt (7.988; 1530). `⟦…⟧` markiert die Stelle, die Studierende in einer Vorlage anpassen. In Kopfzeilen, Optionslisten und Reglerstufen trennt „·“ nur die Bauteile für den Umsetzenden; auf der Seite erscheint es nicht (Kopfzeilen sind getrennte Elemente wie in Sitzung 4, Optionen getrennte Knöpfe). Jeder ```r-Block dieses Plans wird vom Zahlen-Skript wörtlich mit den geprüften Vorlagen abgeglichen.

---

## 1. Kopf

- **Stein:** 7, Kapitelfarbe wie Sitzungsliste.
- **Titel:** Mittelwerte vergleichen
- **Leitfrage (Begleitfigur):** Unterscheiden sich Gruppen im Mittel – und ist das mehr als Zufall?
- **Wegweiser:** Vorweg: R lesen (Ein Test in R, Ausgabe lesen) · Vier Themen (je erst die Grundlage, dann die Aufgabe; im Seminar direkt zur Aufgabe springen) · Zum Schluss (Überblick, Wichtigstes, Selbsttest, Skript)

### Was du nach dieser Sitzung kannst

- **Verfahren:** erklären, wie ein t-Test einen Unterschied (Signal) gegen den Zufall (Rauschen) abwägt, und warum man bei mehr als zwei Gruppen eine Varianzanalyse (ANOVA) mit anschließendem Tukey-Test rechnet
- **Interpretation:** p-Wert und Konfidenzintervall in eigenen Worten erklären; die Größe eines Unterschieds mit einer Effektstärke (Hedges' g, η²) einordnen; wissen, dass „signifikant“ nicht „groß“ und „nicht signifikant“ nicht „gleich“ heißt
- **Voraussetzungen:** prüfen, ob ein Mittelwertvergleich passt: metrische Variable, unabhängige Gruppen, genug Befragte je Gruppe, ähnliche Streuung (sonst Welch); für Aussagen über Deutschland gewichten
- **Code lesen:** `t_test()`, `oneway_anova()` und `tukey_test()` mit `weights = wghtpew` lesen und anpassen, mit `summary()` die ganze Tabelle holen und die Ausgabe Zeile für Zeile lesen; mit `pearson_cor()` viele Paare auf einmal rechnen (Korrelationsmatrix)

### Schon bekannt (graues Schild „kennst du aus Sitzung …“)

Startblock (Sitzung 1) · Kette mit `%>%` und `filter()` (Sitzung 2 und 4) · Mittelwert, Standardabweichung, `describe()` (Sitzung 3) · Boxplot, Streuung (Sitzung 4) · `mutate()` mit `rec()` (Sitzung 5) · `weights = wghtpew` und Pearsons r mit `pearson_cor()` (Sitzung 6) · Normalverteilung (Wiederholung aus der Vorlesung Statistik I; Schild: „kennst du aus der Vorlesung“).

Text unter den Lernzielen (wie Sitzung 4): „Schon bekannt und hier nur kurz erinnert: der Startblock (Sitzung 1), Ketten mit `%>%` (Sitzung 4), Mittelwert und Standardabweichung (Sitzung 3), `mutate()` mit `rec()` (Sitzung 5), das Gewicht `weights = wghtpew` und Pearsons r (Sitzung 6). Solche Stellen tragen ein graues Schild „kennst du aus Sitzung …“.“

„So arbeitest du mit dieser Seite“: unverändert aus Sitzung 4 übernehmen.

Sprungknöpfe fürs Seminar: Aufgabe 1 (Pflicht) · Aufgabe 2 (Zusatz) · Aufgabe 3 (Pflicht) · Aufgabe 4 (Zusatz).

---

## 2. Themen, Variablen, Aufgaben

| Thema | Grundlage (Variablen) | Aufgabe (Variablen) |
|---|---|---|
| Vorweg: R lesen | Ein t-Test in R und seine Ausgabe (`dw15` × `sex`, auf zwei Gruppen umkodiert) | – |
| 1 Zufall oder Unterschied? Der t-Test | Stichproben-Maschine, Signal durch Rauschen, p-Wert und Konfidenzintervall, Effektstärke (`dw15` und `ls01` je × `sex`) | **A1 Pflicht:** Vertrauen in den Bundestag mit und ohne Abitur (`pt03` × `educ` → `abitur`) |
| 2 Signifikant, groß oder beides? Voraussetzungen | n-Regler (konstruiert), signifikant aber winzig (`li07` × `sex`), Voraussetzungen, Welch gegen Student (konstruiert) | **A2 Zusatz:** Lebenszufriedenheit mit und ohne Abitur, alle und unter 30 (`ls01` × `abitur`, `age`) |
| 3 Mehr als zwei Gruppen: ANOVA und Tukey | Fehlalarme bei vielen Paaren, F-Labor (konstruiert), Alter nach Erhebungsweg (`age` × `mode`) | **A3 Pflicht:** Links-rechts-Einstufung nach Wohnort (`pa01` × `gs01`) |
| 4 Viele Paare auf einen Blick: die Korrelationsmatrix | Matrix aus `age`, `dw15`, `ls01`, `hs01` | **A4 Zusatz:** Vertrauen in Institutionen (`pt03`, `pt12`, `pt14`, `pt11`, `age`) |
| Überblick | Entscheidungsbaum „Welcher Vergleich?“, Voraussetzungen je Verfahren, Bericht | – |

Grundlagen und Aufgaben teilen außer dem Gewicht `wghtpew` zwei Variablen, beide ohne etwas zu verraten: `age` (in Grundlage 3 als abhängige Variable, in A2 nur zum Filtern, in A4 als fünfte Spalte der Matrix) und `ls01` (in Grundlage 1 nach Geschlecht, in Grundlage 4 in der Matrix; in der Zusatzaufgabe A2 nach Abitur). Die Grundlagen zeigen kein Ergebnis, das in einer Aufgabe gefragt wird. Begründung: Entscheidungen, Nr. 18.

**Zeit im Seminar (Arbeitsphase 45 Minuten, gemessen am Durchspielen als schwache Studentin):** A1 etwa 17 Minuten (mit Lesen von R2 in „R lesen“ etwa 22), A3 etwa 19 Minuten; zusammen 36 bis 41 Minuten, Rest als Puffer für den ersten Start der Code-Werkstatt und Nachlesen. Wer schneller ist, macht A2 (etwa 10 Minuten) oder A4 (etwa 8 Minuten). Grundlagen beim Vor- und Nacharbeiten: 1 etwa 15, 2 etwa 10, 3 etwa 15, 4 etwa 8 Minuten.

---

## 3. Vorweg: R lesen

### Block R1 „Erinnerung: Startblock, Kette, Gewicht“ (Schilder: Startblock kennst du aus Sitzung 1; `mutate()` mit `rec()` aus Sitzung 5; Gewicht aus Sitzung 6)

Text:
> Den Startblock kennst du: Er lädt die Werkzeuge und legt den ALLBUS unter dem Namen `allbus` ab. In der Code-Werkstatt hier auf der Seite ist das schon erledigt; in RStudio führst du ihn zu Beginn aus.

```r
# Startblock: Pakete laden, Daten einlesen
library(tidyverse)
library(mariposa)

allbus <- read_spss("ZA8831_v1-3-0.sav")
```

> Rote Zeilen beim Laden sind normal. Findet R die Datei nicht, nimm wie in Sitzung 1 `allbus <- read_spss(file.choose())`.
>
> Heute rechnest du alles **gewichtet**, so wie seit Sitzung 6: `weights = wghtpew` steht in jeder Test-Funktion in den Klammern. Der Grund ist derselbe: Der Osten ist im ALLBUS absichtlich stärker vertreten, das Gewicht gleicht das für Aussagen über ganz Deutschland aus.
>
> Neu heute sind diese Werkzeuge aus mariposa:
> - `t_test()` vergleicht die Mittelwerte von **zwei** Gruppen.
> - `oneway_anova()` vergleicht die Mittelwerte von **drei oder mehr** Gruppen, `tukey_test()` sagt danach, welche Paare sich unterscheiden.
> - `pearson_cor()` kennst du mit zwei Variablen; mit mehr Variablen rechnet es alle Paare auf einmal (Korrelationsmatrix).
>
> Alle lassen fehlende Werte selbst weg; `drop_na()` brauchst du heute nicht.

**Kurz gesagt:** In einem Test steht zuerst die Variable, deren Mittelwerte du vergleichst (abhängige Variable), dann nach `group =` die Variable, die die Gruppen bildet, dann das Gewicht. `summary()` am Ende der Kette holt die ganze Tabelle.

**Häufige Verwechslung:** `group = abitur` und `abitur` allein. Ohne `group =` hält R die zweite Variable für eine weitere abhängige Variable. Bei `oneway_anova()` meldet es dann „Argument `group` is missing“. Bei `t_test()` kommt **keine** Meldung, sondern ein falsches Ergebnis: zwei Blöcke „t-Test: pt03“ und „t-Test: abitur“ mit riesigem t, weil R jede Variable für sich gegen 0 testet. Daran erkennst du es: Es fehlt die Zeile „Groups compared“.

### Block R2 „Ein t-Test in R: Zeile für Zeile“ (Code lesen, Code-Werkstatt)

Text:
> So vergleicht R die Arbeitsstunden pro Woche (`dw15`) von Männern und Frauen. `t_test()` braucht genau zwei Gruppen. Im ALLBUS hat `sex` drei Ausprägungen: Mann, Frau und divers. 18 Befragte haben „divers“ angegeben; für einen eigenen Vergleich ist diese Gruppe zu klein. Darum bildet die Vorlage mit `rec()` zuerst eine Variable `geschlecht` mit zwei Gruppen. Lies die Kette von oben nach unten und führe sie aus.

Vorlage `r_ttest` (läuft ohne Änderung, keine markierten Stellen):

```r
# t-Test: Arbeitsstunden von Männern und Frauen, gewichtet
allbus %>%
  mutate(
    geschlecht = rec(sex, rules = "1=1 [Mann]; 2=2 [Frau]; else=NA")
  ) %>%
  t_test(dw15, group = geschlecht, weights = wghtpew) %>%
  summary()
```

Lesehilfe unter der Werkstatt (Liste, wie Sitzung 4 „So liest du eine Zeile“):
- `allbus %>%` – nimm den ALLBUS, und dann
- `mutate(geschlecht = rec(…))` – bilde die Variable `geschlecht` (1 = Mann, 2 = Frau, alles andere fehlt), und dann
- `t_test(dw15, group = geschlecht, weights = wghtpew)` – vergleiche die Mittelwerte von `dw15` zwischen den Gruppen von `geschlecht`, gewichtet, und dann
- `summary()` – zeig die ganze Tabelle.

**Bild R2 „Die Ausgabe lesen“** (Typ: Tabelle mit hervorgehobenen Zellen; nachgebaute R-Ausgabe in JetBrains Mono auf Weiß, Baukasten-Rahmen; nummerierte Marken ① bis ⑦ in Kreisen am Rand, rechts eine Legende mit denselben Nummern). Inhalt (gekürzt auf die nötigen Zeilen, wie R sie druckt):

```
- Groups compared: Mann vs. Frau                                          ①
Weighted Group Statistics:
  geschlecht     N    Mean  Std. Deviation  Std. Error Mean
  Mann               1530  41.609           8.443            0.216        ②
  Frau               1427  33.620          10.287            0.272        ②
Weighted Independent Samples Test:
                                    t        df      p  Mean Diff.  SE Diff.  95% CI Lower  95% CI Upper
  Equal variances assumed      23.144      2955  <.001       7.988     0.345         7.311         8.665  ***
  Equal variances not assumed  22.988  2763.588  <.001       7.988     0.348         7.307         8.670  ***   ③
Effect Sizes:
  Variable  Cohen's d  Hedges' g  Glass' Delta  Magnitude
  dw15          0.852      0.851         0.946      large                                                      ⑦
```

Hervorhebungen: ① grau gerahmt; ② Spalten N und Mean in Rot (Rolle Mittelwert); ③ ganze Zeile „Equal variances not assumed“ türkis hinterlegt (Rolle R-Ergebnis), darin einzeln umrandet: t ④ (22.988), p ⑤ (<.001), Mean Diff. und 95% CI ⑥ (7.988; 7.307 bis 8.670); ⑦ Hedges' g (0.851) und Magnitude. Zeile „Equal variances assumed“ ausgegraut.

Legende (zugleich Textfassung):
1. **Groups compared:** Reihenfolge der Gruppen. R rechnet immer erste minus zweite Gruppe, hier Mann minus Frau.
2. **N und Mean:** Männer 1.530, im Mittel 41,6 Stunden; Frauen 1.427, im Mittel 33,6 Stunden. N ist hier die gewichtete Zahl.
3. **Die Zeile „Equal variances not assumed“** (Welch-Test) liest du. Warum, steht in Grundlage 2c. Die Kurzfassung ohne `summary()` zeigt genau diese Zeile.
4. **t:** 22,988. Je weiter weg von 0, desto deutlicher hebt sich der Unterschied vom Zufall ab (Grundlage 1b).
5. **p:** „<.001“ heißt kleiner als 0,001 (Grundlage 1c). Die Sterne rechts sagen dasselbe: *** heißt p < 0,001.
6. **Mean Diff. und 95-%-Konfidenzintervall:** Männer arbeiten im Mittel 7,99 Stunden mehr; plausibel sind 7,31 bis 8,67 Stunden.
7. **Hedges' g:** 0,85, „large“: ein großer Unterschied (Grundlage 1d).

Text unter dem Bild:
> R schreibt Kommazahlen mit Punkt: `41.609` heißt 41,609. Ein Minus vor t und Mean Diff. heißt nur: Die zweite Gruppe liegt höher.

**Genauer erklärt: Warum steht bei N nicht die gezählte Zahl?**
> Mit Gewicht zählt R jede Person mit ihrem Gewicht. N ist dann die Summe der Gewichte, gerundet. Gezählt sind es 1.491 Männer und 1.442 Frauen, die ihre Arbeitsstunden angegeben haben; gewichtet stehen dort 1.530 und 1.427. Die Arbeitsstunden haben übrigens nur Erwerbstätige angegeben, alle anderen fehlen bei `dw15` und fallen aus dem Vergleich.

**Kurz gesagt:** `t_test()` gibt eine Kurzfassung mit t, p, Hedges' g und N. Mit `summary()` kommen die Gruppenmittelwerte, der Unterschied mit Konfidenzintervall und beide Testzeilen dazu.

**Häufige Verwechslung:** zwei Zeilen, zwei Ergebnisse? Beide Zeilen testen dasselbe; sie rechnen den Zufall nur verschieden ein. Lies „Equal variances not assumed“.

---

## 4. Thema 1: Zufall oder Unterschied? Der t-Test

### Grundlage 1 (etwa 15 Minuten)

Kopf: „Grundlage zu Aufgabe 1 · Zufall oder Unterschied? · Schon klar? Direkt zu Aufgabe 1 ↓“
Untertitel: „Warum schwanken Mittelwerte von Stichprobe zu Stichprobe, und wie entscheidet ein Test? Vier kurze Schritte, etwa 15 Minuten.“

#### Karte 1a „Jede Stichprobe zeigt einen anderen Unterschied“ (Im Bild, interaktiv; Schild: Normalverteilung kennst du aus der Vorlesung)

Text (Beispiel zuerst):
> Stell dir vor, der ALLBUS wäre ganz Deutschland. Dort arbeiten erwerbstätige Männer im Mittel 7,99 Stunden pro Woche mehr als erwerbstätige Frauen, und bei der Lebenszufriedenheit (0 bis 10) liegen beide fast gleich: Frauen 0,01 Punkte höher.
>
> Eine Umfrage fragt aber nie alle. Was sieht man, wenn man nur 50 Männer und 50 Frauen zufällig zieht? Zieh selbst.

**Interaktion „Stichproben-Maschine“**
- Umschalter (Radiogruppe, Tastatur: Pfeiltasten): „Arbeitsstunden“ (Start) | „Lebenszufriedenheit“.
- Knopf „Neue Stichprobe ziehen“: zeigt die nächste der 20 Stichproben unten (Zeile „Stichprobe k: Männer …, Frauen …, Unterschied …“) und legt einen Stein in den passenden Stapel. Nach Stichprobe 20 wird der Knopf zu „980 weitere auf einmal“, danach zeigt der Stapel alle 1.000. Knopf „Von vorn“ setzt zurück. Fokus bleibt auf dem Knopf; verschwindet er, geht der Fokus auf „Von vorn“.
- Stapel: x-Achse „Unterschied Männer minus Frauen“; Arbeitsstunden in Kisten zu 1 Stunde von 1 bis 14 (linke Grenze gehört zur Kiste), Lebenszufriedenheit in Kisten zu 0,2 Punkten von −1,2 bis 1,2, symmetrisch um 0: Ein Unterschied genau auf einer Grenze (etwa −0,60 oder 0,60) kommt in die Kiste weiter außen, ein Unterschied von genau 0 in die Kiste 0 bis 0,2 (Kiste = Vorzeichen × (abgerundet(Betrag ÷ 0,2) + 1); die Unterschiede sind Vielfache von 0,02, darum gibt es solche Grenzfälle). So enthalten die hervorgehobenen Kisten in Bild 1c-1 genau die gezählten Stichproben. Steine orange (echte Daten), die zuletzt gezogene Stichprobe dunkelorange. Gestrichelte Linie bei 0 (grau, beschriftet „kein Unterschied“). Nach 1.000 Stichproben: rote Linie beim wahren Unterschied (7,99 bzw. −0,01), beschriftet „ganzer ALLBUS“. Bei 1.000 Stichproben ist ein Stein = 10 Stichproben (Beschriftung „1 Stein = 10 Stichproben“); bis 20 ist ein Stein = 1 Stichprobe.
- `aria-live="polite"` sagt nach jedem Ziehen die Zeile der Stichprobe an.

Die ersten 20 Stichproben (aus R, `set.seed(2026)`, je 50 Männer und 50 Frauen, gezogen mit Wahrscheinlichkeit nach `wghtpew`; gerundet). Für die Bildtabelle reichen Unterschied und p; Mittel und Intervall braucht Karte 1c.

Arbeitsstunden (Männer minus Frauen, Stunden):

| k | Männer | Frauen | Unterschied | 95-%-Intervall | t | p |
|---|---|---|---|---|---|---|
| 1 | 42,6 | 34,2 | 8,4 | 5,1 bis 11,6 | 5,17 | < 0,001 |
| 2 | 41,6 | 33,6 | 8,1 | 4,5 bis 11,6 | 4,49 | < 0,001 |
| 3 | 41,1 | 32,3 | 8,8 | 5,2 bis 12,4 | 4,88 | < 0,001 |
| 4 | 40,1 | 34,1 | 6,0 | 2,3 bis 9,7 | 3,25 | 0,002 |
| 5 | 39,6 | 33,8 | 5,9 | 1,5 bis 10,2 | 2,67 | 0,009 |
| 6 | 40,1 | 33,3 | 6,8 | 2,9 bis 10,7 | 3,45 | 0,001 |
| 7 | 40,0 | 31,6 | 8,4 | 4,7 bis 12,2 | 4,48 | < 0,001 |
| 8 | 41,6 | 30,3 | 11,3 | 7,5 bis 15,1 | 5,92 | < 0,001 |
| 9 | 43,0 | 34,6 | 8,4 | 4,9 bis 11,9 | 4,77 | < 0,001 |
| 10 | 39,3 | 31,2 | 8,1 | 4,1 bis 12,2 | 4,00 | < 0,001 |
| 11 | 41,5 | 34,4 | 7,1 | 3,7 bis 10,6 | 4,12 | < 0,001 |
| 12 | 40,0 | 34,1 | 5,9 | 1,8 bis 10,0 | 2,84 | 0,006 |
| 13 | 42,1 | 33,7 | 8,4 | 4,8 bis 11,9 | 4,60 | < 0,001 |
| 14 | 40,0 | 32,9 | 7,1 | 4,2 bis 10,0 | 4,86 | < 0,001 |
| 15 | 42,1 | 35,0 | 7,2 | 3,8 bis 10,5 | 4,19 | < 0,001 |
| 16 | 39,6 | 33,6 | 6,1 | 2,0 bis 10,2 | 2,93 | 0,004 |
| 17 | 43,5 | 32,7 | 10,8 | 6,7 bis 14,9 | 5,22 | < 0,001 |
| 18 | 41,1 | 32,4 | 8,7 | 4,5 bis 12,8 | 4,17 | < 0,001 |
| 19 | 41,8 | 33,7 | 8,0 | 4,0 bis 12,1 | 3,94 | < 0,001 |
| 20 | 41,0 | 34,9 | 6,1 | 2,3 bis 9,9 | 3,19 | 0,002 |

Lebenszufriedenheit (Männer minus Frauen, Punkte):

| k | Männer | Frauen | Unterschied | 95-%-Intervall | t | p |
|---|---|---|---|---|---|---|
| 1 | 7,18 | 7,68 | −0,50 | −1,20 bis 0,20 | −1,41 | 0,16 |
| 2 | 7,64 | 7,40 | 0,24 | −0,42 bis 0,90 | 0,72 | 0,47 |
| 3 | 7,40 | 7,56 | −0,16 | −0,88 bis 0,56 | −0,44 | 0,66 |
| 4 | 7,10 | 7,44 | −0,34 | −1,14 bis 0,46 | −0,85 | 0,40 |
| 5 | 7,24 | 7,26 | −0,02 | −0,80 bis 0,76 | −0,05 | 0,96 |
| 6 | 7,10 | 7,42 | −0,32 | −1,12 bis 0,48 | −0,79 | 0,43 |
| 7 | 7,32 | 7,46 | −0,14 | −0,94 bis 0,66 | −0,35 | 0,73 |
| 8 | 7,14 | 7,24 | −0,10 | −0,94 bis 0,74 | −0,24 | 0,81 |
| 9 | 7,60 | 7,68 | −0,08 | −0,80 bis 0,64 | −0,22 | 0,83 |
| 10 | 7,84 | 7,68 | 0,16 | −0,55 bis 0,87 | 0,45 | 0,66 |
| 11 | 7,38 | 7,80 | −0,42 | −1,12 bis 0,28 | −1,19 | 0,24 |
| 12 | 7,10 | 7,70 | −0,60 | −1,33 bis 0,13 | −1,62 | 0,11 |
| 13 | 7,92 | 7,42 | 0,50 | −0,11 bis 1,11 | 1,62 | 0,11 |
| 14 | 7,38 | 7,46 | −0,08 | −0,79 bis 0,63 | −0,22 | 0,82 |
| 15 | 7,02 | 7,40 | −0,38 | −1,20 bis 0,44 | −0,91 | 0,36 |
| 16 | 7,68 | 7,44 | 0,24 | −0,50 bis 0,98 | 0,64 | 0,52 |
| 17 | 7,74 | 7,64 | 0,10 | −0,57 bis 0,77 | 0,30 | 0,77 |
| 18 | 7,14 | 7,44 | −0,30 | −1,07 bis 0,47 | −0,77 | 0,44 |
| 19 | 7,30 | 7,02 | 0,28 | −0,47 bis 1,03 | 0,74 | 0,46 |
| 20 | 7,14 | 7,42 | −0,28 | −1,07 bis 0,51 | −0,70 | 0,49 |

Stapel aller 1.000 Stichproben (Anzahl je Kiste, Grenzen wie oben beschrieben):

- Arbeitsstunden, Kisten 1–2, 2–3, … 13–14 Stunden: 1, 3, 5, 33, 95, 163, 196, 214, 149, 89, 41, 9, 2.
- Lebenszufriedenheit, Kisten −1,2 bis −1,0, −1,0 bis −0,8, … 1,0 bis 1,2: 4, 16, 43, 101, 165, 176, 185, 159, 87, 42, 18, 4.

Rückmeldetexte (unter dem Stapel, je Zustand):
- nach 1 bis 19 Stichproben (Arbeitsstunden): „Jede Stichprobe zeigt einen anderen Unterschied. Aber bisher liegt jeder deutlich über 0.“
- nach 1 bis 19 Stichproben (Lebenszufriedenheit): „Mal liegen die Männer vorn, mal die Frauen. Die Unterschiede pendeln um 0.“
- nach 1.000 (Arbeitsstunden): „1.000 Stichproben bilden eine Glocke um den wahren Unterschied von 7,99 Stunden. Die Unterschiede reichen von 1,5 bis 13,8 Stunden, keiner liegt bei 0 oder darunter. Die typische Abweichung vom wahren Wert ist 1,83 Stunden.“
- nach 1.000 (Lebenszufriedenheit): „Auch hier eine Glocke, aber um 0: Im Mittel liegt der Unterschied bei −0,01. Einzelne Stichproben zeigen trotzdem gut einen Punkt Unterschied (bis 1,14), mal für die Männer, mal für die Frauen. Die typische Abweichung ist 0,38 Punkte.“

Textfassung des Bilds (für Screenreader, gleichwertig): beide Tabellen oben und die Stapel-Zahlen als Liste; dazu: „Der Stapel der Arbeitsstunden hat die Form einer Glocke mit dem Gipfel bei 8 bis 9 Stunden; der Stapel der Lebenszufriedenheit eine Glocke mit dem Gipfel bei 0.“

**Kurz gesagt:** Der Unterschied in einer Stichprobe schwankt von Stichprobe zu Stichprobe. Wie er schwankt, zeigt die **Stichprobenverteilung**: Sie hat annähernd die Form einer Normalverteilung (Glocke) um den wahren Unterschied. Ihre Breite heißt **Standardfehler**: der typische Abstand zwischen dem Unterschied in einer Stichprobe und dem in der Bevölkerung.

**Genauer erklärt: Warum eine Glocke, und warum wird sie schmaler?**
> Die Arbeitsstunden selbst sind nicht normalverteilt: Viele arbeiten genau 40 Stunden, wenige 10 oder 60. Mittelwerte aus 50 Personen verteilen sich trotzdem fast wie eine Glocke. Dahinter steht der **zentrale Grenzwertsatz**: Je mehr Personen in einen Mittelwert eingehen, desto mehr ähnelt die Verteilung solcher Mittelwerte einer Glocke, egal wie die einzelnen Werte verteilt sind. Als Faustregel reichen etwa 30 Personen je Gruppe; bei sehr schief verteilten Werten braucht es mehr.
>
> Mit mehr Befragten wird die Glocke schmaler, der Standardfehler also kleiner. Bei 50 Männern und 50 Frauen liegt er für die Arbeitsstunden bei etwa 1,88 Stunden (in den 1.000 Stichproben: 1,83). Mit dem ganzen ALLBUS, über 1.400 je Gruppe, sind es nur noch 0,35 Stunden. Wie man ihn ausrechnet, zeigt Karte 1b.
>
> Gezogen wird hier so, dass jede Person mit ihrem Gewicht `wghtpew` zum Zug kommt; so steht der ALLBUS für Deutschland. Gezeigt werden nur Mittelwerte von je 50 Personen, keine einzelnen Antworten.

**Häufige Verwechslung:** Standardabweichung und Standardfehler. Die Standardabweichung (kennst du aus Sitzung 3) misst, wie stark **einzelne Personen** streuen: Bei den Arbeitsstunden der Männer 8,4 Stunden. Der Standardfehler misst, wie stark **Mittelwerte oder Unterschiede** von Stichprobe zu Stichprobe schwanken. Er wird mit mehr Befragten kleiner, die Standardabweichung nicht.

#### Karte 1b „Signal durch Rauschen: der t-Wert“ (Formel lesen lernen)

Text:
> Wir haben nie 1.000 Stichproben, sondern eine. Wie entscheidet man mit einer einzigen, ob ein Unterschied echt ist? Man vergleicht ihn mit dem Standardfehler: Ist der Unterschied viel größer als das, was der Zufall typischerweise anrichtet?

**Bild 1b „t als Bausteine“** (Typ: Formel als Bausteine; drei Ebenen von oben nach unten, jede Zeile ein Stein im Baukasten-Stil, Pfeile nach unten):

1. Oben, als Bruch: großer Stein „Signal: Unterschied der Mittelwerte“ (orange) über einem Strich, darunter Stein „Rauschen: Standardfehler“ (grau), rechts daneben „= t“ (türkis).
2. Mitte, Rauschen aufgeklappt: „Standardfehler = Wurzel aus ( Streuung Männer² ÷ Anzahl Männer + Streuung Frauen² ÷ Anzahl Frauen )“; unter jedem Baustein klein: „wie stark Männer streuen“, „wie viele Männer“, …
3. Unten, mit Zahlen aus dem ganzen ALLBUS:
   - Signal: 41,609 − 33,620 ≈ 7,988 Stunden (R zieht die ungerundeten Mittelwerte ab; mit den gerundeten käme 7,989 heraus)
   - Rauschen: √(8,443² ÷ 1.530 + 10,287² ÷ 1.427) = √(0,0466 + 0,0742) = √0,1208 ≈ 0,348 Stunden
   - t = 7,988 ÷ 0,348 ≈ 22,95, rund 23 (R rechnet mit allen Nachkommastellen: 22,988)

Textfassung: genau die drei Zeilen oben als Text.

Text unter dem Bild:
> Ein t von 23 heißt: Der Unterschied ist 23-mal so groß wie das, was der Zufall typischerweise anrichtet. Bei der Lebenszufriedenheit ist es umgekehrt: Unterschied −0,010, Standardfehler 0,054, t = −0,19. Der Unterschied ist viel kleiner als das Rauschen.
>
> Mit nur 50 je Gruppe wäre der Standardfehler der Arbeitsstunden √(8,443² ÷ 50 + 10,287² ÷ 50) = √(1,4257 + 2,1164) ≈ 1,88 Stunden und t ≈ 7,99 ÷ 1,88 ≈ 4,2. Kleinere Stichprobe, mehr Rauschen, kleineres t.

**Kurz überlegen** (Frage `g1b`, Art choice):
- Label: „Die Gruppen wären viermal so groß, Unterschied und Streuung bleiben gleich. Was passiert mit t?“
- Optionen: `gleich` „t bleibt gleich“ · `doppelt` „t wird etwa doppelt so groß“ · `vier` „t wird viermal so groß“
- Ziel: `doppelt`
- Rückmeldung richtig: „Genau: Unter der Wurzel steht die Anzahl im Nenner. Viermal so viele Befragte machen den Standardfehler halb so groß (Wurzel aus 4 ist 2), und damit wird t doppelt so groß.“
- Rückmeldung falsch: „Schau auf das Rauschen: Die Anzahl steht unter einer Wurzel. Viermal so viele Befragte halbieren den Standardfehler, t wird also doppelt so groß.“

**Kurz gesagt:** Der **t-Wert** teilt den Unterschied der Mittelwerte (Signal) durch seinen Standardfehler (Rauschen). Je weiter t von 0 weg ist, desto weniger lässt sich der Unterschied mit Zufall erklären. Der **t-Test für unabhängige Stichproben** vergleicht so die Mittelwerte zweier Gruppen.

**Genauer erklärt: Freiheitsgrade (df)**
> In der Ausgabe steht neben t die Spalte df (Freiheitsgrade). Sie hängt an der Zahl der Befragten und bestimmt, wie streng R das t beurteilt. Bei mehr als etwa 100 Befragten spielt sie kaum noch eine Rolle. Dass df beim Welch-Test eine krumme Zahl ist (2763.588), ist richtig so.

**Häufige Verwechslung:** Das Vorzeichen von t sagt nur, welche Gruppe höher liegt, nicht wie deutlich. t = −12 ist genauso deutlich wie t = +12.

#### Karte 1c „p-Wert und Konfidenzintervall in Worten“ (Im Bild)

Text (Beispiel zuerst):
> Zurück zur Lebenszufriedenheit, bei der es (fast) keinen Unterschied gibt. In Stichprobe 12 lagen die Frauen trotzdem 0,60 Punkte vorn. Wie ungewöhnlich ist so ein Unterschied, wenn es in Wahrheit keinen gibt?

**Bild 1c-1 „Wie oft passiert das ohne echten Unterschied?“** (Typ: Stapel/Histogramm, die 1.000 Unterschiede der Lebenszufriedenheit aus 1a; Kisten zu 0,2 symmetrisch um 0 wie oben; Steine grau; die drei Kisten links von −0,6 und die drei rechts von 0,6 orange hervorgehoben (63 und 64 Stichproben); Klammer darüber: „127 von 1.000 Stichproben: mindestens 0,6 Punkte von 0 entfernt, so weit wie Stichprobe 12 oder weiter“. Gestrichelte Linie bei 0. Ein Stein = 10 Stichproben wie in 1a; die Zahlen stehen über den hervorgehobenen Kisten.)

Textfassung: „Von 1.000 Stichproben ohne echten Unterschied liegen 127 mindestens 0,6 Punkte von 0 entfernt (in eine der beiden Richtungen: 63 mit den Frauen vorn, 64 mit den Männern vorn), das sind etwa 13 %. Zum Vergleich: 199 liegen mindestens 0,5 Punkte entfernt (etwa 20 %), nur 42 mindestens 0,8 Punkte (etwa 4 %).“

Text:
> Genau das misst der **p-Wert**: Angenommen, in der Bevölkerung gäbe es keinen Unterschied (die **Nullhypothese**). Wie oft käme dann ein Unterschied heraus, der mindestens so weit von 0 entfernt ist wie der in meiner Stichprobe? Für die 0,60 Punkte aus Stichprobe 12: in 127 von 1.000 Stichproben, also in etwa 13 von 100. Das ist nicht selten. Ein Unterschied von 0,8 Punkten käme dagegen nur in etwa 4 von 100 Stichproben vor.
>
> R zieht dafür nicht 1.000 Stichproben. Es nimmt die Glocke aus 1a als Formel, mit dem Standardfehler aus 1b, und liest dort ab, welcher Anteil der Glocke mindestens so weit von 0 entfernt liegt wie der gefundene Unterschied, auf beiden Seiten zusammen. Für Stichprobe 12 kommt R so auf p = 0,11, also nah an den 13 von 100 aus dem Stapel. (Ganz gleich sind die Zahlen nicht, weil R nur die eine Stichprobe kennt und deren Standardfehler schätzt.)
>
> Ist p kleiner als 0,05, nennt man den Unterschied **signifikant**: Er wäre ohne echten Unterschied selten. Die Grenze 0,05 heißt **Signifikanzniveau**, kurz α (Alpha). Sie ist eine Abmachung, keine Naturkonstante.
>
> Ein Stück davon kennst du schon (graues Schild „kennst du aus Sitzung 5“): In Sitzung 5 hat der Chi-Quadrat-Test „p < 0.001“ gemeldet, und dort stand „kaum durch Zufall zu erklären“. In Sitzung 6 standen p-Wert und Sterne neben den Zusammenhangsmaßen, und du hast sie liegen lassen. Jetzt weißt du, was dahintersteckt; es ist bei allen Tests dieselbe Logik.

**Bild 1c-2 „20 Konfidenzintervalle“** (Typ: Achse mit 20 waagerechten Strichen untereinander, je ein 95-%-Intervall der Arbeitsstunden-Stichproben 1 bis 20 aus der Tabelle in 1a, Punkt in der Mitte beim Unterschied; senkrechte rote Linie bei 7,99 „ganzer ALLBUS“, gestrichelte graue Linie bei 0. x-Achse 0 bis 16 Stunden. Alle 20 Striche kreuzen die rote Linie, keiner die 0.)

Textfassung: die Spalte „95-%-Intervall“ der Arbeitsstunden-Tabelle und der Satz „Alle 20 Intervalle enthalten den wahren Unterschied von 7,99 Stunden, keines enthält die 0. In allen 1.000 Stichproben enthalten 963 Intervalle den wahren Wert, also etwa 96 von 100.“

Text:
> Das **95-%-Konfidenzintervall** ist der Bereich, in dem der Unterschied in der Bevölkerung plausibel liegt. Auf lange Sicht treffen etwa 95 von 100 solcher Intervalle den wahren Wert; hier waren es 963 von 1.000. Liegt die 0 nicht im Intervall, ist der Unterschied signifikant (p < 0,05). Liegt sie darin, kann man „kein Unterschied“ nicht ausschließen.

**Kurz überlegen** (Frage `g1c`, choice):
- Label: „In Stichprobe 12 liegen die Frauen 0,60 Punkte vorn, p = 0,11, Intervall −1,33 bis 0,13. Was folgt daraus?“
- Optionen: `frauen` „Frauen sind zufriedener als Männer.“ · `kein_beleg` „Die Stichprobe reicht nicht als Beleg: Ein Unterschied dieser Größe entsteht auch ohne echten Unterschied leicht.“ · `gleich` „Männer und Frauen sind sicher gleich zufrieden.“
- Ziel: `kein_beleg`
- Rückmeldung richtig: „Genau. p = 0,11 liegt über 0,05, und die 0 liegt im Intervall. Das heißt nicht, dass beide gleich sind; diese Stichprobe kann es nur nicht entscheiden.“
- Rückmeldung falsch: „p = 0,11 liegt über 0,05, und das Intervall reicht über die 0. Damit ist der Unterschied kein Beleg für Frauen vorn, aber auch kein Beweis für Gleichheit: Nicht signifikant heißt nur „nicht entschieden“.“

**Kurz gesagt:** Der **p-Wert** sagt, wie oft ein mindestens so großer Unterschied vorkäme, wenn es in der Bevölkerung keinen gäbe (Nullhypothese). Unter 0,05 (dem Signifikanzniveau α) heißt **signifikant**. Das **Konfidenzintervall** zeigt, wo der wahre Unterschied plausibel liegt; enthält es die 0, ist der Unterschied nicht signifikant.

**Genauer erklärt: Fehlalarme und Sterne**
> Auch ohne echten Unterschied meldet der Test manchmal „signifikant“: Bei der Lebenszufriedenheit war das in 54 von 1.000 Stichproben so, gut 5 %. Das ist der Preis der 5-%-Grenze, ein **Fehler 1. Art** (Fehlalarm, auch Alpha-Fehler, weil seine Wahrscheinlichkeit gerade α ist). Er wird in Thema 3 wichtig, wenn man viele Tests auf einmal rechnet.
>
> Die Sterne in der R-Ausgabe übersetzen p: * heißt p < 0,05, ** p < 0,01, *** p < 0,001. In Sitzung 6 standen sie schon neben den Zusammenhangsmaßen; sie bedeuten dort dasselbe.

**Häufige Verwechslung:** „p = 0,03 heißt: Mit 3 % Wahrscheinlichkeit ist das Ergebnis Zufall.“ Nein. p setzt voraus, dass es keinen Unterschied gibt, und fragt, wie selten die Daten dann wären. Wie wahrscheinlich die Nullhypothese selbst ist, sagt p nicht.

#### Karte 1d „Wie groß ist der Unterschied? Die Effektstärke“ (Im Bild)

Text:
> Bei den Arbeitsstunden liegen Männer 7,99 Stunden vorn. Ist das viel? Das hängt davon ab, wie stark die Stunden ohnehin streuen. Die **Effektstärke** misst den Unterschied in Standardabweichungen: 7,988 ÷ 9,38 (gemeinsame Standardabweichung beider Gruppen) ≈ 0,85. Die beiden Gruppen liegen also knapp eine Standardabweichung auseinander.

**Bild 1d „Effektstärken auf einem Lineal“** (Typ: Achse/Lineal von 0 bis 1 in Standardabweichungen; Abschnitte farbig hinterlegt und beschriftet: unter 0,2 „vernachlässigbar“ (hellgrau), 0,2 bis unter 0,5 „klein“, 0,5 bis unter 0,8 „mittel“, ab 0,8 „groß“ (aufsteigend kräftiger, eine Farbskala); zwei Marken: Lebenszufriedenheit Männer/Frauen bei 0,005 („kaum zu sehen“), Arbeitsstunden Männer/Frauen bei 0,85.)

Textfassung: „Lineal von 0 bis 1 Standardabweichung. Unter 0,2 vernachlässigbar, ab 0,2 klein, ab 0,5 mittel, ab 0,8 groß. Lebenszufriedenheit Männer gegen Frauen: 0,005. Arbeitsstunden Männer gegen Frauen: 0,85.“

**Kurz gesagt:** **Cohen's d** teilt den Unterschied durch die gemeinsame Standardabweichung. **Hedges' g** ist dasselbe mit einer kleinen Korrektur; mariposa empfiehlt es und zeigt es in der Kurzfassung. Faustregel nach Cohen: ab 0,2 klein, ab 0,5 mittel, ab 0,8 groß. Das Vorzeichen zeigt nur die Richtung.

**Genauer erklärt: Warum eine eigene Zahl für die Größe?**
> t und p hängen an der Zahl der Befragten, die Effektstärke nicht. Mit sehr vielen Befragten wird auch ein winziger Unterschied signifikant (mehr in Grundlage 2). Darum berichtet man immer beides: ob ein Unterschied über den Zufall hinausgeht (p, Konfidenzintervall) und wie groß er ist (Effektstärke). mariposa schreibt die Einordnung gleich dazu: negligible, small, medium, large.

**Häufige Verwechslung:** Effektstärke und Unterschied in der Einheit. 7,99 Stunden ist ein Unterschied in Stunden, 0,85 eine Effektstärke ohne Einheit. Die Effektstärke erlaubt Vergleiche zwischen Variablen mit verschiedenen Skalen.

### Aufgabe 1: Vertrauen in den Bundestag (Pflicht)

- Kopf: „A1 · Aufgabe 1: Vertrauen in den Bundestag · Pflicht · ↑ Grundlage 1 nachlesen“
- **Leitfrage:** Vertrauen Menschen mit Abitur dem Bundestag mehr als Menschen ohne Abitur?
- **Ziel:** Am Ende kannst du sagen, um wie viel sich die beiden Gruppen im Mittel unterscheiden, ob der Unterschied über den Zufall hinausgeht (t, p, Konfidenzintervall) und wie groß er ist (Hedges' g).
- **Grundlage:** Grundlage 1 (Zufall oder Unterschied?) und „Ein t-Test in R“ in Vorweg.

Einleitung:
> Der ALLBUS fragt: „Wie viel Vertrauen haben Sie in den Bundestag?“ (`pt03`, 1 = gar kein Vertrauen bis 7 = großes Vertrauen). Gestellt wurde die Frage nur etwa zwei Dritteln der Befragten (1.596 haben sie nicht bekommen, im Datensatz „TNZ: SPLIT“), darum haben gut 3.500 Befragte geantwortet. Als „mit Abitur“ zählt hier, wer die Fachhochschulreife oder die allgemeine Hochschulreife hat (`educ` 4 oder 5), als „ohne Abitur“, wer keinen Abschluss, einen Haupt- oder Volksschulabschluss oder die Mittlere Reife hat (`educ` 1 bis 3). Wer noch zur Schule geht oder einen anderen Abschluss hat, fällt heraus.

**Erst festlegen** (Frage `a1-tipp`, choice; wird beim Prüfen zitiert):
- Frage: „Welche Gruppe vertraut dem Bundestag im Mittel mehr?“
- Optionen: `ohne` „ohne Abitur“ · `mit` „mit Abitur“ · `gleich` „beide etwa gleich“
- Knopf „Tipp abgeben“.
- Vergleich: erscheint erst, wenn keine Frage der Aufgabe mehr offen ist (Regel für alle Kapitel). Tipp `mit`: „Dein Tipp: mit Abitur. Stimmt: 4,35 gegen 3,69.“ Tipp `ohne`: „Dein Tipp: ohne Abitur. Die Daten sagen das Gegenteil: Mit Abitur liegt das Vertrauen bei 4,35, ohne bei 3,69.“ Tipp `gleich`: „Dein Tipp: etwa gleich. Der Unterschied ist 0,66 Punkte, und er ist deutlich größer als der Zufall (t = −12,4).“

Hinweis vor den Schritten (wie Sitzung 4): „Arbeite in der Code-Werkstatt direkt hier oder in RStudio. In RStudio führst du vorher den Startblock in „R lesen“ aus.“

**Schritt 1: Gruppen bilden und testen (Kurzfassung).**
> Die Vorlage bildet mit `rec()` die Variable `abitur` (kennst du aus Sitzung 5): `1:3=0` heißt, die Codes 1 bis 3 werden zu 0 „ohne Abitur“, `4:5=1` macht aus 4 und 5 die 1 „mit Abitur“, alles andere fehlt. Dann rechnet sie gleich einen t-Test. Führe sie einmal aus, wie sie ist: Sie vergleicht das Alter. Tausch dann die markierte Stelle `age` gegen `pt03` und führe sie noch einmal aus. Lies die Zeile, die mit `t(` beginnt: t, p und g kennst du aus Grundlage 1.

Vorlage `a1_kurz`:
```r
# t-Test: Unterschied zwischen ohne und mit Abitur, gewichtet
allbus %>%
  mutate(
    abitur = rec(educ, rules = "1:3=0 [ohne Abitur]; 4:5=1 [mit Abitur]; else=NA")
  ) %>%
  t_test(⟦age⟧, group = abitur, weights = wghtpew)
```
Ausgabe vor dem Tausch (zur Kontrolle im Text nennen): `t(5059.1) = 22.239, p < 0.001 ***, g = 0.625 (medium), N = 5067` („Mit Abitur sind die Befragten im Mittel jünger.“)
Ausgabe nach dem Tausch: `t(3482.2) = -12.432, p < 0.001 ***, g = -0.419 (small), N = 3505`

Bild zu Schritt 1: keins (die Lesehilfe ist Bild R2).

**Schritt 2: die ganze Tabelle.**
> Für die Mittelwerte und das Konfidenzintervall hängst du `summary()` an. Die zweite Vorlage ist schon fertig. Führe sie aus und lies sie mit der Lesehilfe aus „R lesen“: zuerst die Gruppen, dann die Zeile „Equal variances not assumed“, dann die Effektstärke.

Vorlage `a1_tabelle`:
```r
# Dieselbe Rechnung mit der ganzen Tabelle
# abitur bilden: wie in Schritt 1
allbus %>%
  mutate(
    abitur = rec(educ, rules = "1:3=0 [ohne Abitur]; 4:5=1 [mit Abitur]; else=NA")
  ) %>%
  t_test(pt03, group = abitur, weights = wghtpew) %>%
  summary()
```
Erwartete Ausgabe (Auszug, für Echtdaten-Test und Lösung):
```
  ohne Abitur  1793  3.688           1.667            0.039
  mit Abitur   1712  4.348           1.474            0.036
  Equal variances assumed      -12.396      3503  <.001      -0.660     0.053        -0.765        -0.556  ***
  Equal variances not assumed  -12.432  3482.193  <.001      -0.660     0.053        -0.764        -0.556  ***
  pt03         -0.419     -0.419        -0.396      small
```

**Schritt 3: Deuten.**
> Beantworte die Fragen unten. Sie gehen die Ausgabe in der Reihenfolge eines Berichts durch: Welche Gruppe liegt höher, um wie viel, geht das über den Zufall hinaus, wo liegt der Unterschied plausibel, wie groß ist er? Wenn du fertig bist und Zeit hast: Schreib daraus einen Satz wie in einem Bericht (fürs Plenum).

Musterformulierung (erscheint erst in Hilfe Stufe 3): „Befragte mit Abitur vertrauen dem Bundestag im Mittel etwas mehr als Befragte ohne Abitur (4,35 gegen 3,69 auf einer Skala von 1 bis 7; Unterschied 0,66 Punkte, 95-%-KI 0,56 bis 0,76; Welch-t = −12,43, p < 0,001; Hedges' g = −0,42, ein kleiner Effekt; ALLBUS 2023, gewichtet, gewichtetes N = 3.505).“

**Weiterdenken in der Probier-Werkstatt (für die Aufgabe nicht nötig)** – zugeklappt.
> Für die Aufgabe reichen die Vorlagen oben. Hier ist Platz für eigene Fragen. Eine Idee: Gilt der Unterschied auch beim Vertrauen in die Polizei (`pt14`)? Die Probier-Werkstatt startet mit einem Vorschlag.

Vorlage `frei_a1` (tryOut):
```r
# Eine Idee: Vertrauen in die Polizei (pt14) mit und ohne Abitur
# abitur bilden: wie in Schritt 1
allbus %>%
  mutate(
    abitur = rec(educ, rules = "1:3=0 [ohne Abitur]; 4:5=1 [mit Abitur]; else=NA")
  ) %>%
  t_test(pt14, group = abitur, weights = wghtpew)
```
(Ergebnis zum Nachlesen im Plan, nicht auf der Seite: `t(3525.5) = -2.833, p = 0.005 **, g = -0.095 (negligible), N = 3538`: signifikant, aber vernachlässigbar klein. Das leitet zu Thema 2 über.)

**Antwortfragen A1** (Knopf „Antworten prüfen“; Rückmeldung per `aria-live`):

| id | Art | Label | Optionen | Ziel | Toleranz | Text richtig | Text falsch / Hinweis | Hilfezeile |
|---|---|---|---|---|---|---|---|---|
| a1a | choice | Welche Gruppe vertraut dem Bundestag im Mittel mehr? | `ohne` ohne Abitur · `mit` mit Abitur | `mit` | – | Mit Abitur: im Mittel 4,35 gegen 3,69 ohne Abitur. | Schau in der Tabelle „Weighted Group Statistics“ auf die Spalte Mean: Welche Zahl ist größer? | – |
| a1b | number | Wie groß ist der Unterschied der Mittelwerte (Mean Diff.)? | – | −0.660 | 0.005 | −0,660: Ohne Abitur liegt 0,66 Punkte unter mit Abitur. Das Minus heißt nur, dass die zweite Gruppe (mit Abitur) höher liegt. | Lies die Spalte „Mean Diff.“ in der Zeile „Equal variances not assumed“ und übernimm die Zahl mit Minus, so wie R sie druckt. Hast du noch `age` statt `pt03` in der Vorlage? | So, wie R sie druckt, mit Vorzeichen. R schreibt Kommazahlen mit Punkt: `-0.123` heißt −0,123. |
| a1d | choice | In der Welch-Zeile stehen t = −12,432 und p < .001. Was heißt das? | `selten` Der Unterschied ist gut zwölfmal so groß wie sein Standardfehler. Gäbe es in der Bevölkerung keinen Unterschied, käme ein mindestens so großer in weniger als 1 von 1.000 Stichproben vor. · `sicher` Mit 99,9 % Wahrscheinlichkeit gibt es einen Unterschied. · `gross` Der Unterschied ist sehr groß. | `selten` | – | Genau: t teilt den Unterschied durch sein Rauschen (Karte 1b), p sagt, wie selten ein so großer Unterschied ohne echten Unterschied wäre (Karte 1c). Signifikant, also kaum durch Zufall zu erklären. | p sagt nichts über die Größe (dafür gibt es g) und ist keine Wahrscheinlichkeit dafür, dass es einen Unterschied gibt. Lies Karte 1c, „Häufige Verwechslung“. Das Minus vor t zeigt nur, dass die zweite Gruppe (mit Abitur) höher liegt. | Die Zahlen stehen in der Zeile „Equal variances not assumed“ und in der Kurzfassung aus Schritt 1. |
| a1e | choice | Was sagt das 95-%-Konfidenzintervall von −0,764 bis −0,556? | `bereich` In der Bevölkerung liegt der Unterschied plausibel zwischen etwa 0,56 und 0,76 Punkten zugunsten der Gruppe mit Abitur. · `personen` 95 % der Befragten liegen zwischen −0,764 und −0,556. · `genau` Der Unterschied ist zu 95 % genau −0,660. | `bereich` | – | Richtig. Die 0 liegt nicht im Intervall, darum ist der Unterschied signifikant. | Das Intervall beschreibt den Unterschied der Mittelwerte, nicht einzelne Personen. Es ist ein Bereich plausibler Werte, keine Wahrscheinlichkeit für einen einzelnen Wert. | – |
| a1f | choice | Wie groß ist der Unterschied nach Hedges' g? | `vernachl` vernachlässigbar (unter 0,2) · `klein` klein (0,2 bis unter 0,5) · `mittel` mittel (0,5 bis unter 0,8) · `gross` groß (ab 0,8) | `klein` | – | g = −0,42: ein kleiner Effekt, mariposa schreibt „small“. Etwa zwei Fünftel einer Standardabweichung. | Lies die Spalte Hedges' g unter „Effect Sizes“ (−0,419) und lass das Minus weg; es zeigt nur die Richtung. Vergleiche mit dem Lineal in Karte 1d. | Unter „Effect Sizes“, Spalte Hedges' g. |

Hilfe in drei Stufen:
1. **Denkanstoß:** „Der t-Test vergleicht zwei Mittelwerte und fragt, ob der Unterschied größer ist als der Zufall. Du brauchst aus der Ausgabe: beide Mittelwerte, den Unterschied, t, p und das Intervall aus der Welch-Zeile und Hedges' g.“
2. **Wo schaue ich?:** „Mittelwerte: Tabelle „Weighted Group Statistics“, Spalte Mean. Unterschied, t, p und Intervall: Zeile „Equal variances not assumed“. Effektstärke: „Effect Sizes“, Spalte Hedges' g. Steht bei dir noch `age` in der ersten Vorlage, tausche es gegen `pt03`.“
3. **Lösung:** „Ohne Abitur 3,69, mit Abitur 4,35. Unterschied −0,660 (das Minus heißt: mit Abitur liegt höher), t = −12,432, p < 0,001, 95-%-KI −0,764 bis −0,556, Hedges' g = −0,42 (klein). Als Satz: Befragte mit Abitur vertrauen dem Bundestag im Mittel etwas mehr (4,35 gegen 3,69 auf der Skala von 1 bis 7). Der Unterschied ist signifikant, aber klein.“

Lösungsweg ohne Grafik: „Alle Antworten stehen in der Textausgabe von `summary()`; diese Aufgabe braucht keine Grafik.“

**Fürs Plenum:** „Bringt euren Bericht-Satz aus Schritt 3 mit. Ist ein Unterschied von 0,66 Punkten auf einer Skala von 1 bis 7 politisch bedeutsam? Und erklärt das Abitur den Unterschied, oder könnte etwas anderes dahinterstecken (etwa das Alter, siehe Schritt 1 vor dem Tausch)?“

---

## 5. Thema 2: Signifikant, groß oder beides? Voraussetzungen

### Grundlage 2 (etwa 10 Minuten)

Kopf: „Grundlage zu Aufgabe 2 · Signifikant, groß oder beides? · Schon klar? Direkt zu Aufgabe 2 ↓“
Untertitel: „Was ein Test braucht und wann man ihm nicht trauen sollte. Drei Schritte, etwa 10 Minuten.“

#### Karte 2a „Signifikant heißt nicht wichtig“ (interaktiv)

Text (Beispiel zuerst):
> Der ALLBUS fragt auch, wie wichtig einem Politik und öffentliches Leben sind (`li07`, 1 = unwichtig bis 7 = sehr wichtig). Männer sagen im Mittel 4,52, Frauen 4,41. Der Unterschied ist 0,11 Punkte, p = 0,011: signifikant. Hedges' g ist aber nur 0,07, vernachlässigbar. Wie geht das zusammen?

**Interaktion „n-Regler“** (konstruiert, im Bild als „zum Beispiel“ gekennzeichnet): zwei Gruppen mit einem Unterschied von 0,3 Punkten und einer Standardabweichung von 2 in beiden Gruppen. Schieberegler (input type range, 8 Stufen, Tastatur Pfeiltasten) „Befragte je Gruppe“. Angezeigt: ein waagerechter Strich (Konfidenzintervall) mit Punkt bei 0,3 auf einer Achse von −1 bis 1,5, gestrichelte Linie bei 0; darunter Zeile „t = …, p = …, Effektstärke d = 0,15“. Liegt die 0 im Intervall, ist der Strich blass (grau-türkis) und gestrichelt; liegt sie außerhalb, ist er kräftig türkis und durchgezogen (der Unterschied steckt also nicht nur in der Farbe). Die Rückmeldung unten sagt es zusätzlich in Worten.

| Befragte je Gruppe | Standardfehler | t | p | 95-%-Intervall |
|---|---|---|---|---|
| 25 | 0,57 | 0,53 | 0,598 | −0,84 bis 1,44 |
| 50 | 0,40 | 0,75 | 0,455 | −0,49 bis 1,09 |
| 100 | 0,28 | 1,06 | 0,290 | −0,26 bis 0,86 |
| 200 | 0,20 | 1,50 | 0,134 | −0,09 bis 0,69 |
| 400 | 0,14 | 2,12 | 0,034 | 0,02 bis 0,58 |
| 800 | 0,10 | 3,00 | 0,003 | 0,10 bis 0,50 |
| 1.600 | 0,07 | 4,24 | < 0,001 | 0,16 bis 0,44 |
| 2.500 | 0,06 | 5,30 | < 0,001 | 0,19 bis 0,41 |

Rückmeldung (`aria-live`): bei 25 bis 200: „Nicht signifikant: Das Intervall enthält die 0.“ ab 400: „Signifikant: Das Intervall enthält die 0 nicht mehr. Der Unterschied ist derselbe geblieben, nur die Stichprobe ist größer.“ Fester Satz darunter: „Die Effektstärke bleibt bei jeder Stufe 0,15.“

Textfassung: die Tabelle.

**Kurz gesagt:** Ob ein Unterschied **signifikant** ist, hängt an seiner Größe **und** an der Zahl der Befragten. Mit genug Befragten wird jeder noch so kleine Unterschied signifikant. Ob er **bedeutsam** ist, sagt die Effektstärke und die inhaltliche Überlegung.

**Genauer erklärt: Was heißt das für den ALLBUS?**
> Mit über 5.000 Befragten sind im ALLBUS viele Unterschiede signifikant, die im Alltag kaum zu spüren sind. Darum gehören zu jedem Testergebnis die Mittelwerte, der Unterschied in der Einheit der Frage und die Effektstärke. Umgekehrt ist ein nicht signifikanter Unterschied in einer kleinen Gruppe kein Beweis, dass es keinen gibt (Karte 1c).

**Häufige Verwechslung:** „Hochsignifikant“ heißt „großer Unterschied“. Nein: Bei der Wichtigkeit von Politik liegen Männer und Frauen signifikant auseinander (p = 0,011), aber nur um 0,07 Standardabweichungen.

#### Karte 2b „Wann passt ein t-Test? Die Voraussetzungen“ (Liste mit Häkchen-Steinen)

Text:
> Ein t-Test rechnet immer, auch wenn er nicht passt. Darum prüfst du vorher vier Dinge.

**Bild 2b „Vier Prüfsteine“** (Typ: vier Steine untereinander, je mit Symbol und Kurztext; Baukasten-Stil, kein Diagramm). Textfassung = Liste:
1. **Metrische abhängige Variable.** Einen Mittelwert darfst du berechnen, wenn die Abstände zwischen den Werten gleich viel bedeuten (kennst du aus Sitzung 4). Stunden und Alter sind metrisch. Skalen mit sieben oder mehr geordneten Stufen wie das Vertrauen (1 bis 7) oder die Links-rechts-Einstufung (1 bis 10) behandelt man in den Sozialwissenschaften meist wie metrisch; das ist eine Annahme, die du nennen solltest. Bei wenigen Stufen ohne gleiche Abstände nimmst du die Kreuztabelle (Sitzung 5) oder ein Rangmaß (Sitzung 6).
2. **Zwei unabhängige Gruppen.** Jede Person gehört zu genau einer Gruppe, und die Gruppen beeinflussen sich nicht. Dieselben Personen zweimal befragt (vorher und nachher) wären verbundene Stichproben; dafür gibt es andere Tests.
3. **Genug Befragte je Gruppe.** Ab etwa 30 je Gruppe verteilen sich die Mittelwerte annähernd wie eine Glocke, auch wenn die Werte selbst schief verteilt sind (Karte 1a); bei sehr schiefen Werten braucht es mehr. Bei sehr kleinen Gruppen müssten die Werte selbst ungefähr normalverteilt sein.
4. **Ähnliche Streuung? Nicht nötig mit Welch.** Der klassische t-Test (nach Student) nimmt an, dass beide Gruppen gleich stark streuen. Der Welch-Test braucht das nicht (Karte 2c).

Dazu, ohne eigenen Stein: „Für Aussagen über ganz Deutschland gewichtest du (Sitzung 6).“

**Kurz gesagt:** **Voraussetzungen des t-Tests:** metrische abhängige Variable, zwei unabhängige Gruppen, genug Befragte je Gruppe (Faustregel 30). Gleiche Streuung braucht nur der klassische Test; der Welch-Test kommt ohne aus.

**Genauer erklärt: Und wenn die Gruppenvariable drei Stufen hat?**
> Dann rechnet `t_test()` gar nicht erst und meldet, dass es genau zwei Gruppen braucht. Entweder du fasst mit `rec()` zu zwei Gruppen zusammen (wie bei `abitur`), oder du nimmst die Varianzanalyse aus Thema 3.

**Häufige Verwechslung:** „Der t-Test braucht normalverteilte Daten.“ Bei großen Gruppen nicht: Es genügt, dass die **Mittelwerte** annähernd normalverteilt sind, und dafür sorgt bei großen Gruppen schon ihre Größe (zentraler Grenzwertsatz, Karte 1a).

#### Karte 2c „Welch oder Student? Zwei Zeilen in der Ausgabe“ (Formel lesen lernen)

Text (Beispiel, konstruiert):
> Zum Beispiel: Gruppe A hat 400 Befragte, die eng beieinander liegen (Standardabweichung 1). Gruppe B hat 40 Befragte, die stark streuen (Standardabweichung 3). B liegt im Mittel 0,8 Punkte höher.

**Bild 2c „Zwei Arten, das Rauschen zu rechnen“** (Typ: Formel als Bausteine, zwei Spalten nebeneinander; links grau „Student: eine gemeinsame Streuung für beide“, rechts türkis „Welch: jede Gruppe mit ihrer eigenen Streuung“).
- Student: gemeinsame Standardabweichung ≈ 1,31 (wird von den 400 eng liegenden Befragten bestimmt). Standardfehler = 1,31 × √(1 ÷ 400 + 1 ÷ 40) ≈ 0,22. t = 0,8 ÷ 0,22 ≈ 3,69, p = 0,0003.
- Welch: Standardfehler = √(1² ÷ 400 + 3² ÷ 40) = √(0,0025 + 0,225) ≈ 0,48. t = 0,8 ÷ 0,48 ≈ 1,68, p = 0,10.
- Unter beiden: Pfeil auf ein Fazit-Schild: „Student: signifikant. Welch: nicht signifikant.“

Textfassung: die drei Zeilen je Spalte als Text.

Text:
> Student nimmt eine gemeinsame Streuung an. Weil Gruppe A groß ist und eng liegt, unterschätzt er, wie unsicher der Mittelwert der kleinen, stark streuenden Gruppe B ist. Welch nimmt jede Gruppe mit ihrer eigenen Streuung und Größe. Sind die Gruppen gleich groß oder streuen sie ähnlich, kommen beide fast auf dasselbe (wie bei den Arbeitsstunden: 23,144 gegen 22,988).

**Kurz überlegen** (Frage `g2c`, choice):
- Label: „In welcher Lage unterscheiden sich die beiden Zeilen der R-Ausgabe am stärksten?“
- Optionen: `gleich` „gleich große Gruppen, gleiche Streuung“ · `ungleich` „ungleich große Gruppen, und die kleine Gruppe streut stärker“ · `gross` „sehr große Gruppen“
- Ziel: `ungleich`
- Richtig: „Genau. Dann verlässt sich Student zu sehr auf die große Gruppe. Welch rechnet ehrlicher.“
- Falsch: „Bei gleich großen Gruppen oder gleicher Streuung kommen beide fast auf dasselbe. Auseinander gehen sie, wenn eine kleine Gruppe stärker streut als eine große.“

**Kurz gesagt:** Der **Welch-Test** rechnet den Standardfehler mit der Streuung jeder Gruppe für sich und braucht deshalb keine gleichen Streuungen (**Varianzhomogenität**). In mariposa ist er die Zeile „Equal variances not assumed“ und steht in der Kurzfassung. Lies immer diese Zeile.

**Genauer erklärt: Wie erkenne ich ungleiche Streuung?**
> Vergleiche in der Gruppentabelle die Spalte „Std. Deviation“. Als Faustregel gilt: Ist die größte Standardabweichung mehr als doppelt so groß wie die kleinste, unterscheiden sich die Streuungen deutlich. Mit Welch bist du in jedem Fall auf der sicheren Seite. Einen eigenen Test dafür (Levene-Test) lernst du in Sitzung 9 kennen.

**Häufige Verwechslung:** „Equal variances not assumed“ heißt nicht, dass die Streuungen ungleich **sind**. Es heißt nur, dass der Test es nicht **voraussetzt**.

### Aufgabe 2: Macht Abitur zufriedener? (Zusatz)

- Kopf: „A2 · Aufgabe 2: Macht Abitur zufriedener? · Zusatz · ↑ Grundlage 2 nachlesen“
- **Leitfrage:** Wie groß ist der Unterschied in der Lebenszufriedenheit zwischen Menschen mit und ohne Abitur, und hängt die Antwort davon ab, wen man fragt?
- **Ziel:** Am Ende kannst du begründen, warum ein Unterschied signifikant und trotzdem klein sein kann, und warum die Welch-Zeile ein breiteres Intervall zeigt, wenn eine kleine Gruppe stärker streut als eine große.
- **Grundlage:** Grundlage 2.

Einleitung:
> Du vergleichst die Lebenszufriedenheit (`ls01`, 0 bis 10) zwischen ohne und mit Abitur, einmal bei allen Befragten und einmal nur bei den unter 30-Jährigen. Die Gruppen bildest du wie in Aufgabe 1.

**Erst festlegen** (`a2-tipp`, choice): „Bei wem ist der Unterschied zwischen ohne und mit Abitur größer?“ Optionen: `alle` „bei allen Befragten“ · `jung` „bei den unter 30-Jährigen“ · `gleich` „etwa gleich“.
Vergleich: `jung`: „Dein Tipp: bei den Jüngeren. Stimmt: fast ein Punkt (0,99) gegen 0,34 bei allen.“ `alle`: „Dein Tipp: bei allen. Die Daten zeigen das Gegenteil: Bei den unter 30-Jährigen ist der Unterschied fast dreimal so groß (0,99 gegen 0,34).“ `gleich`: „Dein Tipp: etwa gleich. Bei den unter 30-Jährigen sind es 0,99 Punkte, bei allen 0,34.“

**Schritt 1: alle Befragten.** „Führe die Vorlage aus. Lies Unterschied, p und Hedges' g.“

Vorlage `a2_alle`:
```r
# Lebenszufriedenheit ohne und mit Abitur, alle Befragten
# abitur bilden: wie in Aufgabe 1
allbus %>%
  mutate(
    abitur = rec(educ, rules = "1:3=0 [ohne Abitur]; 4:5=1 [mit Abitur]; else=NA")
  ) %>%
  t_test(ls01, group = abitur, weights = wghtpew) %>%
  summary()
```
Erwartet: ohne 2539 / 7.239 / SD 2.117; mit 2487 / 7.582 / SD 1.682; Welch t −6.361, df 4820.264, p <.001, Mean Diff. −0.343, KI −0.448 bis −0.237; Hedges' g −0.179 negligible.

**Schritt 2: nur die unter 30-Jährigen.** „Die Vorlage hat eine Zeile mehr: `filter(age < 30)` (kennst du aus Sitzung 2). Vergleiche die beiden Zeilen „Equal variances assumed“ und „not assumed“: Wo ist das Intervall breiter?“

Vorlage `a2_jung`:
```r
# Dasselbe nur für Befragte unter 30 Jahren
# abitur bilden: wie in Aufgabe 1
allbus %>%
  filter(age < 30) %>%
  mutate(
    abitur = rec(educ, rules = "1:3=0 [ohne Abitur]; 4:5=1 [mit Abitur]; else=NA")
  ) %>%
  t_test(ls01, group = abitur, weights = wghtpew) %>%
  summary()
```
Erwartet: ohne 178 / 6.449 / SD 2.433; mit 491 / 7.435 / SD 1.596; Student t −6.077, df 668, SE 0.162, KI −1.304 bis −0.667; Welch t −5.033, df 235.165, SE 0.196, KI −1.371 bis −0.600; Hedges' g −0.530 medium.

**Weiterdenken (zugeklappt, für die Aufgabe nicht nötig):** „Eine Idee: Wie sieht es bei den Befragten ab 65 aus?“

Vorlage `frei_a2` (tryOut):
```r
# Eine Idee: Befragte ab 65 Jahren
# abitur bilden: wie in Aufgabe 1
allbus %>%
  filter(age >= 65) %>%
  mutate(
    abitur = rec(educ, rules = "1:3=0 [ohne Abitur]; 4:5=1 [mit Abitur]; else=NA")
  ) %>%
  t_test(ls01, group = abitur, weights = wghtpew)
```
(Ergebnis im Plan: `t(947.3) = -0.115, p = 0.908, g = -0.006 (negligible), N = 1392`: kein Unterschied.)

**Antwortfragen A2:**

| id | Art | Label | Optionen | Ziel | Toleranz | Text richtig | Text falsch / Hinweis | Hilfezeile |
|---|---|---|---|---|---|---|---|---|
| a2a | number | Alle Befragten: Welches Hedges' g zeigt R? | – | −0.179 | 0.005 | g = −0,18: vernachlässigbar, mariposa schreibt „negligible“. | Lies unter „Effect Sizes“ die Spalte Hedges' g aus Schritt 1 und übernimm das Minus. | Mit Vorzeichen, so wie R es druckt. |
| a2b | choice | Alle Befragten: Was trifft zu? | `beides` signifikant und groß · `sig_klein` signifikant, aber sehr klein · `nichts` nicht signifikant | `sig_klein` | – | Genau: p < 0,001, aber nur 0,34 Punkte auf einer Skala von 0 bis 10 und g = −0,18. Mit über 5.000 Befragten wird auch ein kleiner Unterschied signifikant. | p ist kleiner als 0,001, also signifikant. Die Größe zeigt aber g: unter 0,2 heißt vernachlässigbar. | – |
| a2c | number | Unter 30: Wie groß ist der Unterschied der Mittelwerte (Mean Diff.)? | – | −0.986 | 0.005 | −0,986: Bei den Jüngeren liegen die ohne Abitur fast einen Punkt niedriger. | Nimm die Ausgabe aus Schritt 2, Spalte Mean Diff., mit Minus. | Mit Vorzeichen, so wie R es druckt. |
| a2d | choice | Unter 30: Warum ist das Intervall in der Welch-Zeile breiter (−1,371 bis −0,600 statt −1,304 bis −0,667)? | `streuung` Die kleine Gruppe ohne Abitur (178) streut stärker (2,43 gegen 1,60); Welch rechnet ihre Unsicherheit ehrlich ein. · `fehler` R hat sich in einer der Zeilen verrechnet. · `gewicht` Welch rechnet ohne Gewicht. | `streuung` | – | Genau wie in Karte 2c: ungleich große Gruppen, und die kleine streut stärker. Student unterschätzt dann die Unsicherheit. Beide Zeilen sind hier signifikant, aber Welch ist die ehrlichere. | Beide Zeilen rechnen richtig und beide gewichtet. Schau auf N und Std. Deviation in der Gruppentabelle und lies Karte 2c. | – |

Hilfe:
1. **Denkanstoß:** „Signifikant sagt: kaum Zufall. Groß sagt die Effektstärke. Beides kann auseinanderfallen.“
2. **Wo schaue ich?:** „Hedges' g steht unter „Effect Sizes“, der Unterschied in der Spalte Mean Diff. Für die Frage nach den Zeilen vergleiche die Spalten SE Diff. und 95% CI in den beiden Zeilen und die Spalten N und Std. Deviation oben.“
3. **Lösung:** „Alle: Unterschied −0,343, p < 0,001, g = −0,18: signifikant, aber vernachlässigbar. Unter 30: Unterschied −0,986, g = −0,53 (mittel). Die kleine Gruppe ohne Abitur (178) streut stärker (2,43) als die große mit Abitur (491; 1,60). Darum ist der Standardfehler bei Welch größer (0,196 statt 0,162) und das Intervall breiter.“

Lösungsweg ohne Grafik: Textausgabe genügt.

---

## 6. Thema 3: Mehr als zwei Gruppen: ANOVA und Tukey

### Grundlage 3 (etwa 15 Minuten)

Kopf: „Grundlage zu Aufgabe 3 · Mehr als zwei Gruppen · Schon klar? Direkt zu Aufgabe 3 ↓“
Untertitel: „Warum man bei drei oder mehr Gruppen nicht einfach viele t-Tests rechnet, und was der F-Wert misst. Drei Schritte, etwa 15 Minuten.“

#### Karte 3a „Viele Paare, viele Fehlalarme“ (interaktiv)

Text (Beispiel zuerst):
> Der ALLBUS wurde auf drei Wegen erhoben: persönliches Interview (CAPI), online (CAWI) und auf Papier (MAIL), kennst du aus Sitzung 4. Sind die Befragten auf den drei Wegen unterschiedlich alt? Mit t-Tests bräuchtest du drei Vergleiche: CAPI–CAWI, CAPI–MAIL, CAWI–MAIL. Bei fünf Gruppen wären es schon zehn.

**Interaktion „Paare zählen“:** Radiogruppe „Gruppen“ mit fünf Knöpfen 2, 3, 4, 5 und 6. Bild: so viele Steine im Kreis (Gruppenfarben aus der Palette), jedes Paar mit einer Linie verbunden. Darunter: „… Paare. Wahrscheinlichkeit für mindestens einen Fehlalarm, wenn es nirgends einen Unterschied gibt: … %“.

| Gruppen | Paare | mindestens ein Fehlalarm |
|---|---|---|
| 2 | 1 | 5,0 % |
| 3 | 3 | 14,3 % |
| 4 | 6 | 26,5 % |
| 5 | 10 | 40,1 % |
| 6 | 15 | 53,7 % |

Textfassung: die Tabelle. Rückmeldung (`aria-live`) nennt die Zeile.

Text:
> Jeder einzelne Test hat 5 % Fehlalarm (Karte 1c: 54 von 1.000). Rechnest du zehn Tests, ist die Chance, dass mindestens einer fälschlich anschlägt, schon etwa 40 %. (Gerechnet als 1 − 0,95 hoch Anzahl der Paare, als wären die Tests unabhängig.)

**Kurz gesagt:** Viele Tests auf einmal häufen Fehlalarme an (**Alpha-Fehler-Kumulierung**). Die **einfaktorielle Varianzanalyse (ANOVA)** prüft deshalb mit einem einzigen Test, ob sich irgendwelche Gruppenmittelwerte unterscheiden. Welche, sagt danach ein Test für Paare, der die Zahl der Vergleiche einrechnet (Karte 3c).

**Häufige Verwechslung:** „Mehr Tests = gründlicher.“ Ohne Korrektur heißt mehr Tests vor allem: mehr Zufallstreffer.

#### Karte 3b „Zwischen den Gruppen gegen innerhalb der Gruppen: F“ (interaktiv, Formel lesen lernen)

Text:
> Die ANOVA stellt dieselbe Frage wie der t-Test, Signal gegen Rauschen, nur mit mehr Gruppen. Das Signal ist, wie weit die Gruppenmittelwerte auseinanderliegen. Das Rauschen ist, wie stark die Befragten **innerhalb** ihrer Gruppe streuen.

**Interaktion „F-Labor“** (konstruiert, „zum Beispiel drei Gruppen mit je sechs Befragten“): Lineal von −1 bis 11; drei Reihen Steine (Gruppe A, B, C in drei Palettenfarben), je sechs Steine, Gruppenmittelwert als roter Strich, Gesamtmittel (5) als gestrichelte Linie. Zwei Regler (je Radiogruppe oder Schieberegler mit Stufen, Tastatur Pfeiltasten):
- „Abstand der Gruppen“, Stufen 0, 0,5, 1 und 2 (Mittelwerte 5 − a, 5, 5 + a)
- „Streuung in den Gruppen“, Stufen klein, mittel und groß (Faktor s = 0,5, 1 oder 2; Werte je Gruppe: Mittelwert + (−2, −1, 0, 0, 1, 2) × s)
Darunter die Bausteinzeile: „Streuung zwischen (je Freiheitsgrad) … ÷ Streuung innerhalb (je Freiheitsgrad) … = F …, p …, η² …“

| Streuung s | Abstand a | QS zwischen | QS innerhalb | zwischen ÷ 2 | innerhalb ÷ 15 | F | p | η² |
|---|---|---|---|---|---|---|---|---|
| 0,5 | 0 | 0 | 7,5 | 0 | 0,5 | 0,00 | 1,000 | 0,00 |
| 0,5 | 0,5 | 3 | 7,5 | 1,5 | 0,5 | 3,00 | 0,080 | 0,29 |
| 0,5 | 1 | 12 | 7,5 | 6 | 0,5 | 12,00 | 0,001 | 0,62 |
| 0,5 | 2 | 48 | 7,5 | 24 | 0,5 | 48,00 | < 0,001 | 0,86 |
| 1 | 0 | 0 | 30 | 0 | 2 | 0,00 | 1,000 | 0,00 |
| 1 | 0,5 | 3 | 30 | 1,5 | 2 | 0,75 | 0,489 | 0,09 |
| 1 | 1 | 12 | 30 | 6 | 2 | 3,00 | 0,080 | 0,29 |
| 1 | 2 | 48 | 30 | 24 | 2 | 12,00 | 0,001 | 0,62 |
| 2 | 0 | 0 | 120 | 0 | 8 | 0,00 | 1,000 | 0,00 |
| 2 | 0,5 | 3 | 120 | 1,5 | 8 | 0,19 | 0,831 | 0,02 |
| 2 | 1 | 12 | 120 | 6 | 8 | 0,75 | 0,489 | 0,09 |
| 2 | 2 | 48 | 120 | 24 | 8 | 3,00 | 0,080 | 0,29 |

(p-Werte mit 2 und 15 Freiheitsgraden; Kontrolle s = 1, a = 1 mit `oneway_anova()`: F(2, 15) = 3.000, p = 0.080.)

Rückmeldungen (`aria-live`): Abstand 0: „Alle Gruppen liegen gleich: kein Signal, F = 0.“ F ≥ 12: „Die Gruppen liegen weit auseinander im Vergleich zur Streuung in ihnen: F ist groß, p klein.“ F zwischen 0,19 und 3: „Die Streuung in den Gruppen überdeckt den Abstand: F ist klein, nicht signifikant.“ Zusatz, sobald die Studierenden zwei Zustände mit F = 3,00 gesehen haben (sonst immer unter der Tabelle): „Doppelter Abstand und doppelte Streuung ergeben dasselbe F. Es zählt das Verhältnis.“

Textfassung: die Tabelle.

**Bild 3b „F als Bausteine“** (Formel als Bausteine wie 1b; mit echten Zahlen aus `oneway_anova(age, group = mode, weights = wghtpew)`):
- Oben: „F = (Streuung zwischen den Gruppen ÷ Freiheitsgrade zwischen) ÷ (Streuung innerhalb der Gruppen ÷ Freiheitsgrade innerhalb)“
- Bausteine: „Streuung zwischen“ = Summe über die Gruppen von (Anzahl × (Gruppenmittel − Gesamtmittel)²); „Streuung innerhalb“ = Summe der quadrierten Abstände jeder Person zu ihrem Gruppenmittel. Fachbegriff in Klammern: Quadratsumme (Sum of Squares).
- Mit Zahlen: 101.483,969 ÷ 2 = 50.741,984; 1.645.598,339 ÷ 5.221 = 315,188; F = 50.741,984 ÷ 315,188 ≈ 160,99.
- Daneben: η² = Streuung zwischen ÷ gesamte Streuung = 101.483,969 ÷ 1.747.082,307 ≈ 0,058.

Textfassung: die Zeilen als Text.

**Kurz gesagt:** Der **F-Wert** teilt die mittlere Streuung **zwischen** den Gruppen durch die mittlere Streuung **innerhalb** der Gruppen. Ist F groß und p < 0,05, unterscheiden sich mindestens zwei Gruppen im Mittel (welche, sagt Karte 3c). **Eta-Quadrat (η²)** ist die Effektstärke: der Anteil der gesamten Streuung, der mit der Gruppe zusammenhängt. Faustregel: ab 0,01 klein, ab 0,06 mittel, ab 0,14 groß.

**Genauer erklärt: Warum „Varianzanalyse“, wenn sie Mittelwerte vergleicht?**
> Weil sie dafür zwei Streuungen (Varianzen) vergleicht: die der Gruppenmittelwerte um das Gesamtmittel und die der Befragten um ihr Gruppenmittel. Bei zwei Gruppen kommt die ANOVA zum selben p wie der klassische t-Test; F ist dann genau t².

**Häufige Verwechslung:** η² = 0,058 heißt nicht „5,8 % der Befragten“. Es heißt: 5,8 % der Unterschiede im Alter gehen damit einher, auf welchem Weg jemand befragt wurde. Die übrigen 94,2 % liegen innerhalb der Wege.

#### Karte 3c „Welche Gruppen genau? Der Tukey-Test“ (Im Bild)

Text (Beispiel):
> Die ANOVA für das Alter nach Erhebungsweg ergibt F = 160,99, p < 0,001, η² = 0,058. Irgendwo gibt es also Unterschiede. Wo genau, sagt der **Tukey-Test** (Fachbegriff: Post-hoc-Test, „danach“). Er vergleicht alle Paare und rechnet dabei ein, dass es mehrere Vergleiche sind.

**Bild 3c-1 „Mittelwerte mit Intervall“** (Typ: Punkte mit waagerechten Fehlerbalken, drei Zeilen: CAPI, CAWI, MAIL; x-Achse Alter 40 bis 65 Jahre (Achse beginnt nicht bei 0, Bildunterschrift sagt es); Punkt rot (Mittelwert), Balken = 95-%-KI; Bildunterschrift: „ALLBUS 2023, gewichtet, gewichtetes N = 5.224; Achse beginnt bei 40“.) Werte (zugleich Textfassung):
- CAPI: 51,8 Jahre (51,0 bis 52,6), N = 2.002
- CAWI: 46,7 Jahre (45,9 bis 47,6), N = 1.623
- MAIL: 58,0 Jahre (57,1 bis 58,8), N = 1.599

**Bild 3c-2 „Tukey-Tabelle lesen“** (Typ: Tabelle mit hervorgehobenen Zellen, nachgebaute R-Ausgabe von `tukey_test() %>% summary()`):
```
  (I) - (J)    Mean Difference (I-J)  Std. Error  p-value  Lower CI  Upper CI
  CAPI - CAWI                  5.023       0.593    <.001     3.633     6.413  ***
  CAPI - MAIL                 -6.181       0.595    <.001    -7.577    -4.785  ***
  CAWI - MAIL                -11.204       0.626    <.001   -12.671    -9.738  ***
```
Markiert: Spalte „(I) - (J)“ mit Legende „erste minus zweite Gruppe“; p-value türkis; Lower/Upper CI mit Legende „enthält das Intervall die 0? Hier nie.“

Textfassung: „CAPI minus CAWI: 5,0 Jahre, p < 0,001, Intervall 3,6 bis 6,4. CAPI minus MAIL: −6,2 Jahre, p < 0,001, Intervall −7,6 bis −4,8. CAWI minus MAIL: −11,2 Jahre, p < 0,001, Intervall −12,7 bis −9,7. Alle drei Paare unterscheiden sich: Online-Befragte sind am jüngsten, Papier-Befragte am ältesten.“

Text unter den Bildern:
> In der ANOVA-Ausgabe steht außerdem eine Zeile „Welch“ unter „Robust Tests of Equality of Means“. Sie ist die Welch-Fassung der ANOVA und braucht, wie in Karte 2c, keine gleichen Streuungen. Hier: 166,127, ebenfalls p < 0,001. Kommen klassische Zeile und Welch-Zeile zum selben Schluss, kannst du dich auf das Ergebnis verlassen. Die Streuungen liegen hier eng beieinander: größte durch kleinste Standardabweichung 18,26 ÷ 16,59 ≈ 1,10.

**Kurz gesagt:** Nach einer signifikanten ANOVA zeigt der **Tukey-Test**, welche Paare sich unterscheiden. Seine p-Werte sind für die Zahl der Vergleiche **korrigiert** (adjustiert). Ein Paar unterscheidet sich signifikant, wenn p < 0,05 ist; dann enthält auch sein Intervall die 0 nicht.

**Genauer erklärt: Voraussetzungen der ANOVA**
> Dieselben wie beim t-Test: metrische abhängige Variable, unabhängige Gruppen, genug Befragte je Gruppe. Die klassische ANOVA und Tukey setzen zusätzlich ähnliche Streuungen voraus; prüf das an der Spalte Std. Deviation (Faustregel: größte höchstens doppelt so groß wie die kleinste) und an der Welch-Zeile. Bei sehr kleinen Gruppen wird jeder Vergleich mit dieser Gruppe unsicher.

**Häufige Verwechslung:** „ANOVA signifikant = alle Gruppen unterscheiden sich.“ Nein: Es reicht, dass sich eine Gruppe von einer anderen unterscheidet. Welche, sagt erst Tukey, und oft sind es nicht alle Paare.

### Aufgabe 3: Links, rechts und der Wohnort (Pflicht)

- Kopf: „A3 · Aufgabe 3: Links, rechts und der Wohnort · Pflicht · ↑ Grundlage 3 nachlesen“
- **Leitfrage:** Stehen Menschen in der Großstadt politisch weiter links als in Kleinstadt und Dorf?
- **Ziel:** Am Ende kannst du sagen, ob sich die Wohnorte in der Links-rechts-Einstufung unterscheiden (F, p), wie stark (η²) und welche Wohnorte genau (Tukey), und warum ein großer Unterschied in einer kleinen Gruppe nicht signifikant sein kann.
- **Grundlage:** Grundlage 3.

Einleitung:
> Der ALLBUS fragt: „Viele Leute verwenden die Begriffe links und rechts … Wo würden Sie sich einordnen?“ (`pa01`, 1 = links bis 10 = rechts). Den Wohnort beschreiben die Befragten selbst (`gs01`): Großstadt, Vorort einer Großstadt, Mittel- oder Kleinstadt, ländliches Dorf, Einzelgehöft auf dem Land. Fünf Gruppen, also eine ANOVA.

**Erst festlegen** (`a3-tipp`, choice): „Wo stehen die Befragten im Mittel am weitesten links?“ Optionen: `1` Großstadt · `2` Vorort einer Großstadt · `3` Mittel- oder Kleinstadt · `4` ländliches Dorf · `5` Einzelgehöft.
Vergleich: `1`: „Dein Tipp: Großstadt. Stimmt: 4,45, alle anderen liegen zwischen 4,85 und 5,12.“ Sonst: „Dein Tipp: … Am weitesten links steht die Großstadt (4,45); …“ (den getippten Ort mit seinem Mittelwert nennen: Vorort 4,85, Mittel-/Kleinstadt 5,04, Dorf 5,12, Einzelgehöft 5,05).

**Schritt 1: die ANOVA.**
> Führe die Vorlage aus, wie sie ist: Sie rechnet das Alter nach Erhebungsweg aus Grundlage 3; du solltest F = 160.989 wiederfinden. Tausch dann `age` gegen `pa01` und `mode` gegen `gs01` und führe sie noch einmal aus.

Vorlage `a3_anova`:
```r
# ANOVA: Mittelwerte von mehr als zwei Gruppen vergleichen, gewichtet
allbus %>%
  oneway_anova(⟦age⟧, group = ⟦mode⟧, weights = wghtpew) %>%
  summary()
```

**Bild zu Schritt 1 „Die ANOVA-Ausgabe lesen“** (Tabelle mit hervorgehobenen Zellen; Ausgabe der Vorlage, wie sie startet, also `age` × `mode`, damit nichts verraten wird). Auszug:
```
Weighted Descriptive Statistics:
  mode     N    Mean  Std. Deviation  Std. Error  95% CI Lower  95% CI Upper     ①
  CAPI  2002  51.772          18.258       0.408        50.972        52.572
  CAWI  1623  46.749          16.587       0.412        45.941        47.556
  MAIL  1599  57.953          18.250       0.456        57.058        58.848
Weighted ANOVA Results:
                  Sum of Squares    df  Mean Square        F    Sig
  Between Groups      101483.969     2    50741.984  160.989  <.001  ***          ②
  Within Groups      1645598.339  5221      315.188                              
Robust Tests of Equality of Means:
  Welch    166.127    2  3415.671  <.001  ***                                      ③
Effect Sizes:
  Variable  Eta Squared  Epsilon Squared  Omega Squared  Magnitude
  age             0.058            0.058          0.058      small                  ④
```
Legende/Textfassung: ① Gruppen mit N, Mittelwert (rot), Standardabweichung (Streuung prüfen) und Intervall. ② Zeile „Between Groups“: F (türkis) und p (Sig). ③ Welch-ANOVA: dieselbe Frage ohne Annahme gleicher Streuung. ④ Eta Squared: η². Darunter: „Mit deinen Variablen stehen hier fünf Wohnorte und andere Zahlen.“

**Schritt 2: welche Wohnorte genau?**
> Hänge `tukey_test()` direkt hinter die ANOVA, `summary()` ans Ende. Die Vorlage ist fertig. Die Kurzfassung ohne `summary()` würde nur zählen, wie viele Paare signifikant sind; mit `summary()` siehst du alle zehn.

Vorlage `a3_tukey`:
```r
# Tukey: Welche Paare unterscheiden sich?
allbus %>%
  oneway_anova(pa01, group = gs01, weights = wghtpew) %>%
  tukey_test() %>%
  summary()
```

Erwartete Ausgaben (für Echtdaten-Test und Lösung):
```
  GROSSSTADT           1053  4.453  1.855  0.057  4.341  4.565
  VORORT GROSSSTADT     643  4.846  1.680  0.066  4.715  4.976
  MITTEL-, KLEINSTADT  1719  5.043  1.747  0.042  4.960  5.126
  LAENDL. DORF         1452  5.120  1.697  0.045  5.033  5.208
  EINZELHAUS, LAND       62  5.053  1.905  0.242  4.568  5.537
  Between Groups         318.601     4       79.650  26.015  <.001  ***
  Within Groups        15069.633  4922        3.062
  Welch     24.149    4  433.570  <.001  ***
  pa01            0.021            0.020          0.020      small

  GROSSSTADT - VORORT GROSSSTADT            -0.393  0.088  <.001  -0.632  -0.154  ***
  GROSSSTADT - MITTEL-, KLEINSTADT          -0.590  0.068  <.001  -0.777  -0.403  ***
  GROSSSTADT - LAENDL. DORF                 -0.668  0.071  <.001  -0.861  -0.474  ***
  GROSSSTADT - EINZELHAUS, LAND             -0.600  0.229   .067  -1.225   0.025
  VORORT GROSSSTADT - MITTEL-, KLEINSTADT   -0.197  0.081   .105  -0.418   0.023
  VORORT GROSSSTADT - LAENDL. DORF          -0.275  0.083   .008  -0.501  -0.048  **
  VORORT GROSSSTADT - EINZELHAUS, LAND      -0.207  0.233   .901  -0.843   0.429
  MITTEL-, KLEINSTADT - LAENDL. DORF        -0.077  0.062   .728  -0.247   0.093
  MITTEL-, KLEINSTADT - EINZELHAUS, LAND    -0.010  0.227  1.000  -0.628   0.609
  LAENDL. DORF - EINZELHAUS, LAND            0.068  0.227   .998  -0.552   0.688
```
Kurzfassung von `tukey_test()`: `pa01: 10 comparisons, 4 significant (p < .05)`.

**Schritt 3: Deuten.** „Beantworte die Fragen unten: erst wo, dann ob (F), wie stark (η²), welche Paare (Tukey) und warum ein Paar trotz großem Unterschied offen bleibt. Wenn du fertig bist und Zeit hast: Schreib einen Satz, was man über Stadt und Land sagen darf und was nicht (fürs Plenum).“

**Weiterdenken (zugeklappt, für die Aufgabe nicht nötig):** „Eine Idee: Sind Verheiratete zufriedener mit ihrem Leben als Ledige, Geschiedene oder Verwitwete? Und wäre das eine Wirkung der Ehe?“

Vorlage `frei_a3` (tryOut):
```r
# Eine Idee: Lebenszufriedenheit nach Familienstand
allbus %>%
  oneway_anova(ls01, group = mstat, weights = wghtpew) %>%
  tukey_test() %>%
  summary()
```
(Ergebnis im Plan: F(4, 5142) = 39,756, η² = 0,030; vier von zehn Paaren signifikant, alle mit „verheiratet“; z. B. verheiratet minus ledig 0,653, geschieden minus ledig −0,059, p = 0,979. Ob das an der Ehe liegt, kann eine ANOVA nicht sagen: Ledige sind zum Beispiel viel jünger, Verwitwete viel älter.)

**Antwortfragen A3:**

| id | Art | Label | Optionen | Ziel | Toleranz | Text richtig | Text falsch / Hinweis | Hilfezeile |
|---|---|---|---|---|---|---|---|---|
| a3a | choice | Wo stehen die Befragten im Mittel am weitesten links? | `1` Großstadt · `2` Vorort einer Großstadt · `3` Mittel- oder Kleinstadt · `4` ländliches Dorf · `5` Einzelgehöft | `1` | – | Großstadt: 4,45. Die anderen liegen zwischen 4,85 (Vorort) und 5,12 (Dorf). | 1 heißt links, 10 rechts: Gesucht ist der **kleinste** Mittelwert in der Spalte Mean. Hast du `age` und `mode` getauscht? | Kleinere Zahl = weiter links. |
| a3b | number | Welchen F-Wert zeigt die Zeile „Between Groups“? | – | 26.015 | 0.01 | F = 26,015 mit 4 und 4.922 Freiheitsgraden, p < 0,001: Mindestens ein Wohnort unterscheidet sich. | Lies in „Weighted ANOVA Results“ die Spalte F in der Zeile „Between Groups“. Steht bei dir 160.989, hast du noch `age` und `mode` in der Vorlage. | R schreibt Kommazahlen mit Punkt: `12.345` heißt 12,345. |
| a3d | choice | Lies unter „Effect Sizes“ das Eta Squared (η²). Was bedeutet der Wert? | `anteil` Etwa 2 % der Unterschiede in der Links-rechts-Einstufung gehen mit dem Wohnort einher; 98 % liegen innerhalb der Wohnorte. · `anteil6` Etwa 6 % der Unterschiede in der Links-rechts-Einstufung gehen mit dem Wohnort einher. · `personen` 2 % der Befragten wohnen in der Großstadt. | `anteil` | – | Genau: η² = 0,021, mariposa schreibt „small“. Der Unterschied ist signifikant, aber klein: Innerhalb jedes Wohnorts gibt es fast die ganze Bandbreite von links bis rechts. | η² ist ein Anteil an der gesamten Streuung, keine Zahl von Personen. R schreibt `0.021`, das sind 2,1 %. Steht bei dir 0.058, hast du noch `age` und `mode` in der Vorlage (das sind die 6 % aus Grundlage 3). Lies Karte 3b, „Häufige Verwechslung“. | Unter „Effect Sizes“, Spalte Eta Squared. |
| a3e | number | Wie viele der zehn Paare unterscheiden sich laut Tukey signifikant? | – | 4 | 0 | Vier: Großstadt gegen Vorort, gegen Mittel-/Kleinstadt und gegen Dorf; dazu Vorort gegen Dorf. | Zähl in der Tukey-Tabelle die Zeilen mit p-value unter .05 (mit Sternen). Die Kurzfassung ohne `summary()` nennt die Zahl auch. | Zeilen mit Sternen zählen. |
| a3f | choice | Großstadt gegen Einzelgehöft: Der Unterschied (−0,600) ist fast so groß wie Großstadt gegen Dorf (−0,668), aber nicht signifikant (p = .067). Warum? | `wenige` Auf Einzelgehöften leben nur 62 Befragte (gewichtet); der Standardfehler ist groß, das Intervall (−1,225 bis 0,025) reicht über die 0. · `gleich` Auf Einzelgehöften steht man genauso links wie in der Großstadt. · `fehler` Tukey hat sich verrechnet. | `wenige` | – | Genau: Mit wenigen Befragten ist der Mittelwert unsicher (Standardfehler 0,229 statt 0,071). Nicht signifikant heißt hier „nicht entschieden“, nicht „gleich“. | Schau auf N in der Gruppentabelle (62) und auf Std. Error in der Tukey-Zeile. Nicht signifikant heißt nicht „kein Unterschied“ (Karte 1c). | – |

Hilfe:
1. **Denkanstoß:** „Erst fragt die ANOVA: Unterscheiden sich irgendwelche Wohnorte? Dann fragt Tukey: welche genau? Und η² sagt, wie viel der Wohnort überhaupt erklärt.“
2. **Wo schaue ich?:** „Mittelwerte: „Weighted Descriptive Statistics“, Spalte Mean. F: Zeile „Between Groups“. η²: „Effect Sizes“. Paare: Tukey-Tabelle, Spalte p-value. Achte darauf, dass in der ersten Vorlage `pa01` und `gs01` stehen.“
3. **Lösung:** „Großstadt 4,45, Vorort 4,85, Mittel-/Kleinstadt 5,04, Dorf 5,12, Einzelgehöft 5,05. F(4, 4922) = 26,015, p < 0,001; Welch 24,149, ebenfalls p < 0,001. η² = 0,021: klein. Tukey: Die Großstadt unterscheidet sich von Vorort, Mittel-/Kleinstadt und Dorf, der Vorort vom Dorf. Zwischen Mittel-/Kleinstadt und Dorf ist kein Unterschied nachweisbar (p = .728; mit 0,08 Punkten wäre er ohnehin winzig). Das Einzelgehöft (62 Befragte, gewichtet) ist zu klein für eine Aussage. Als Satz: Großstädter stufen sich im Mittel etwas weiter links ein (um 0,4 bis 0,7 Punkte auf der Skala von 1 bis 10); der Wohnort erklärt aber nur rund 2 % der Unterschiede.“

Lösungsweg ohne Grafik: Textausgabe genügt.

**Fürs Plenum:** „Bringt euren Satz aus Schritt 3 mit. Schreibt eine Schlagzeile, die stimmt, und eine, die zu weit geht. Woran liegt der Unterschied: am Wohnort selbst, oder wohnen in der Großstadt andere Menschen (jünger, mehr mit Abitur)?“

---

## 7. Thema 4: Viele Paare auf einen Blick: die Korrelationsmatrix

### Grundlage 4 (etwa 8 Minuten)

Kopf: „Grundlage zu Aufgabe 4 · Viele Paare auf einen Blick · Schon klar? Direkt zu Aufgabe 4 ↓“
Untertitel: „Wie man eine Korrelationsmatrix liest. Ein Schritt, etwa 8 Minuten.“

#### Karte 4a „Die Korrelationsmatrix lesen“ (Im Bild; Schild: Pearsons r kennst du aus Sitzung 6)

Text (Beispiel):
> Hängen Alter, Arbeitsstunden, Lebenszufriedenheit und Gesundheit zusammen? Pearsons r kennst du aus Sitzung 6 für ein Paar. Gibst du `pearson_cor()` vier Variablen, rechnet es alle sechs Paare auf einmal und legt sie in eine Tabelle: die **Korrelationsmatrix**.

**Bild 4a „Matrix mit Lesehilfe“** (Typ: Tabelle mit hervorgehobenen Zellen, 4 × 4, Zeilen- und Spaltenköpfe `age`, `dw15`, `ls01`, `hs01` mit deutschen Kurznamen darunter: Alter, Arbeitsstunden, Lebenszufriedenheit, Gesundheit (1 = sehr gut … 5 = schlecht)). Diagonale grau mit „1“; obere Hälfte blass (Spiegel der unteren); untere Hälfte mit r und Sternen, Zellen nach Stärke hinterlegt (je stärker, desto kräftiger; positiv und negativ in zwei Farben der Palette, Farbe nie allein: Vorzeichen steht dabei). Neben der Tabelle die zugehörige N-Tabelle klein.

Werte (untere Hälfte, wie R sie druckt):
- age × dw15: −0.036 (p = .051), N = 2.957
- age × ls01: 0.075*** , N = 5.142
- age × hs01: 0.331***, N = 5.189
- dw15 × ls01: 0.025 (p = .180), N = 2.945
- dw15 × hs01: −0.031 (p = .087), N = 2.963
- ls01 × hs01: −0.380***, N = 5.148 (95-%-KI −0,403 bis −0,357)

Lesemarken (Legende): ① Diagonale: jede Variable mit sich selbst, immer 1. ② Die Matrix ist gespiegelt; jedes Paar steht zweimal, lies nur eine Hälfte. ③ Sterne: signifikant. ④ N je Paar: Jedes Paar nutzt alle, die bei **beiden** Variablen geantwortet haben (paarweiser Ausschluss), darum sind die Zahlen verschieden.

Textfassung: die sechs Zeilen oben plus Legende; die Hilfezeile unter dem Bild nennt auch die p-Werte ohne Stern („Ohne Stern: p = .051, .180, .087“).

Text:
> Am stärksten hängen Lebenszufriedenheit und Gesundheit zusammen: r = −0,38. Das Minus erschreckt nur auf den ersten Blick: Bei `hs01` heißt 1 „sehr gut“ und 5 „schlecht“. Wer seine Gesundheit schlechter einschätzt (höhere Zahl), ist also im Mittel weniger zufrieden. Die Gesundheit hat nur fünf geordnete Stufen; für die Übersicht steht sie hier mit in der Matrix, für eine genaue Aussage über dieses eine Paar wäre Spearman-ρ passender (kennst du aus Sitzung 6). Die Arbeitsstunden hängen mit keiner der drei anderen Variablen signifikant zusammen; sie haben nur rund 2.950 Erwerbstätige angegeben.

**Kurz gesagt:** Eine **Korrelationsmatrix** zeigt die Korrelation jedes Paars aus mehreren Variablen. Die Diagonale ist immer 1, die beiden Hälften sind gleich. Jedes Paar hat sein eigenes N (**paarweiser Ausschluss**) und seinen eigenen Test.

**Genauer erklärt: Viele Paare, viele Tests**
> Vier Variablen ergeben 6 Paare, zehn Variablen schon 45. Jedes Paar ist ein eigener Test mit 5 % Fehlalarm (Thema 3). Gäbe es zwischen zehn Variablen gar keinen Zusammenhang, würden trotzdem im Mittel etwa zwei Paare (45 × 0,05 = 2,25) Sterne bekommen. Darum achtest du in großen Matrizen vor allem auf starke und inhaltlich erwartete Zusammenhänge, nicht auf einzelne Sterne. Und wie beim t-Test gilt: Bei Tausenden Befragten sind auch sehr kleine r signifikant (age × ls01: r = 0,075).

**Häufige Verwechslung:** Ein Minus heißt nicht „schlecht“ oder „kein Zusammenhang“. Es sagt nur die Richtung: Steigt die eine Zahl, sinkt die andere. Was das inhaltlich heißt, hängt davon ab, wie die Variablen kodiert sind.

### Aufgabe 4: Wem vertrauen die, die dem Bundestag vertrauen? (Zusatz)

- Kopf: „A4 · Aufgabe 4: Vertrauen in Institutionen · Zusatz · ↑ Grundlage 4 nachlesen“
- **Leitfrage:** Hängt das Vertrauen in verschiedene Institutionen zusammen, und spielt das Alter dabei eine Rolle?
- **Ziel:** Am Ende kannst du eine Korrelationsmatrix lesen: das stärkste Paar finden, signifikante von nicht signifikanten Paaren unterscheiden und erklären, warum die Fallzahlen je Paar verschieden sind.
- **Grundlage:** Grundlage 4.

Einleitung:
> Vier Vertrauensfragen (1 = gar kein Vertrauen bis 7 = großes Vertrauen): Bundestag (`pt03`), Bundesregierung (`pt12`), Polizei (`pt14`), Hochschulen und Universitäten (`pt11`). Dazu das Alter (`age`).

**Erst festlegen** (`a4-tipp`, choice): „Welche zwei Institutionen hängen im Vertrauen am stärksten zusammen?“ Optionen: `pt03-pt12` Bundestag und Bundesregierung · `pt03-pt14` Bundestag und Polizei · `pt14-pt11` Polizei und Hochschulen.
Vergleich: richtig `pt03-pt12`: „Dein Tipp stimmt: r = 0,79.“ Sonst: „Dein Tipp: … (r = 0,46 bzw. 0,44). Am stärksten hängen Bundestag und Bundesregierung zusammen: r = 0,79.“

**Schritt 1: die Matrix.** „Führe die Vorlage aus. Lies zuerst die „Correlation Matrix“, dann die „Sample Size Matrix“.“

Vorlage `a4_matrix`:
```r
# Korrelationsmatrix: Vertrauen in vier Institutionen und Alter, gewichtet
allbus %>%
  pearson_cor(pt03, pt12, pt14, pt11, age, weights = wghtpew) %>%
  summary()
```
Erwartet (Auszug):
```
       pt03       pt12      pt14       pt11        age
pt03      1      0.790***  0.464***   0.461***   0.076***
pt12  0.790***       1     0.476***   0.516***  -0.007
pt14  0.464***   0.476***      1      0.442***   0.071***
pt11  0.461***   0.516***  0.442***       1     -0.080***
age   0.076***  -0.007     0.071***  -0.080***       1
Sample Size Matrix: pt03 3589 3574 3578 3492 3577 … age 3577 3592 3610 3510 5224
  pt12 x age   -0.007   .680
```
Kurzfassung (ohne `summary()`): „9/10 pairs significant (p < .05), N = 3492-3610“.

**Weiterdenken (zugeklappt):** „Eine Idee: neun Vertrauensfragen auf einmal. Wie viele Paare sind das, und wie viele bekommen Sterne?“

Vorlage `frei_a4` (tryOut):
```r
# Eine Idee: neun Vertrauensfragen auf einmal
allbus %>%
  pearson_cor(pt01, pt02, pt03, pt08, pt09, pt10, pt12, pt14, pt15, weights = wghtpew)
```
(Ergebnis im Plan: 36 Paare, alle 36 signifikant; die Kurzfassung zeigt nur die zehn stärksten, `summary()` alle.)

**Antwortfragen A4:**

| id | Art | Label | Optionen | Ziel | Toleranz | Text richtig | Text falsch / Hinweis | Hilfezeile |
|---|---|---|---|---|---|---|---|---|
| a4a | number | Wie groß ist r zwischen Vertrauen in den Bundestag und in die Bundesregierung? | – | 0.790 | 0.005 | r = 0,79: ein sehr starker Zusammenhang. Wer dem einen vertraut, vertraut meist auch der anderen. | Such die Zelle in Zeile `pt03`, Spalte `pt12` (oder umgekehrt) und lies die Zahl ohne Sterne. | R schreibt Kommazahlen mit Punkt: `0.123` heißt 0,123. |
| a4b | number | Wie viele der zehn Paare sind signifikant? | – | 9 | 0 | Neun von zehn. Nur Vertrauen in die Bundesregierung und Alter hängen nicht signifikant zusammen (r = −0,007, p = 0,680). | Zähl in einer Hälfte der Matrix die Zellen mit Sternen, ohne die Diagonale. Die Kurzfassung ohne `summary()` nennt die Zahl auch. | Diagonale nicht mitzählen. |
| a4c | choice | Alter und Vertrauen in den Bundestag: r = 0,076***. Was folgt daraus? | `schwach` Signifikant, aber sehr schwach: Mit dem Alter steigt das Vertrauen kaum. · `stark` Ältere vertrauen dem Bundestag viel mehr. · `nichts` Kein Zusammenhang, weil r unter 0,1 liegt. | `schwach` | – | Genau wie bei t-Test und ANOVA: Bei über 3.500 Befragten wird auch ein kleiner Zusammenhang signifikant. Groß ist er nicht. | Die Sterne sagen „kaum Zufall“, die Zahl sagt die Stärke. 0,076 ist sehr schwach, aber nicht null. | – |
| a4d | choice | Warum steht in der „Sample Size Matrix“ nicht überall dieselbe Zahl? | `paarweise` Jedes Paar nutzt alle, die bei beiden Variablen geantwortet haben. · `gewicht` Das Gewicht ändert sich von Paar zu Paar. · `fehler` Einige Werte wurden doppelt gezählt. | `paarweise` | – | Richtig: paarweiser Ausschluss. Das Alter haben fast alle angegeben (5.224), die Vertrauensfragen wurden nur etwa zwei Dritteln der Befragten gestellt. | Schau auf die Zeile `age`: Mit sich selbst hat das Alter 5.224, mit den Vertrauensfragen nur gut 3.500. Lies Marke ④ in Grundlage 4. | – |

Hilfe:
1. **Denkanstoß:** „Eine Matrix ist nur eine Sammlung von Paaren. Lies eine Hälfte, ohne die Diagonale.“
2. **Wo schaue ich?:** „Stärke: Correlation Matrix. Signifikanz: Sterne oder Significance Matrix. Fallzahlen: Sample Size Matrix.“
3. **Lösung:** „Stärkstes Paar Bundestag und Bundesregierung, r = 0,790. Die fünf anderen Vertrauenspaare liegen zwischen 0,44 und 0,52. Neun von zehn Paaren signifikant; nicht signifikant ist Bundesregierung und Alter (−0,007, p = 0,680). Mit dem Alter hängen alle Vertrauensfragen nur sehr schwach zusammen (−0,08 bis 0,08). Die N sind verschieden, weil jedes Paar alle nimmt, die bei beiden geantwortet haben.“

Lösungsweg ohne Grafik: Textausgabe genügt.

---

## 8. Überblick: Welcher Vergleich für welche Frage?

Kopf: „✓ Überblick zu allen Aufgaben · Vergleichen, prüfen, berichten“
Untertitel: „Alle vier Themen zusammen: welches Verfahren wann passt, was es voraussetzt und was in einen Bericht gehört.“

### Karte Ü1 „Welches Verfahren?“ (Zuordnen)

**Bild Ü1 „Entscheidungsbaum“** (Typ: Entscheidungsbaum wie Sitzung 4, Baukasten-Steine, von oben nach unten):
- Start: „Ist die Variable, deren Werte du vergleichst, metrisch?“
  - nein (wenige Stufen ohne gleiche Abstände) → „Kreuztabelle, Cramér-V oder Rangmaß (Sitzung 5 und 6)“
  - ja → „Wie viele Gruppen?“
    - zwei → „t-Test (Welch): `t_test(…, group = …)`“
    - drei oder mehr → „ANOVA, danach Tukey: `oneway_anova()` und `tukey_test()`“
    - keine Gruppen, sondern eine zweite metrische Variable → „Pearsons r: `pearson_cor()`; bei vielen Variablen die Korrelationsmatrix“

Textfassung: derselbe Baum als verschachtelte Liste.

**Zuordnen** (Fragen `ue1` bis `ue4`, je choice mit Optionen `t` t-Test · `anova` ANOVA und Tukey · `r` Korrelation(smatrix) · `kreuz` Kreuztabelle):

| id | Label | Ziel | Rückmeldung (richtig/falsch zugleich, wie Sitzung 4) |
|---|---|---|---|
| ue1 | Verdienen Menschen in Ost und West im Mittel gleich viel (Nettoeinkommen in Euro)? | `t` | Eine metrische Variable, zwei Gruppen: t-Test. |
| ue2 | Unterscheidet sich die Lebenszufriedenheit (0 bis 10) zwischen den fünf Schichten? | `anova` | Metrisch behandelt, fünf Gruppen: ANOVA, danach Tukey für die Paare. |
| ue3 | Hängen Alter, Einkommen und Arbeitsstunden miteinander zusammen? | `r` | Drei metrische Variablen, keine Gruppen: Korrelationsmatrix. |
| ue4 | Wählen Frauen und Männer verschiedene Parteien? | `kreuz` | Die Partei ist nominal, ein Mittelwert ergibt keinen Sinn: Kreuztabelle (Sitzung 5). |

**Kurz gesagt:** Erst das Skalenniveau, dann die Zahl der Gruppen. Zwei Gruppen: t-Test. Drei oder mehr: ANOVA mit Tukey. Zwei metrische Variablen: Korrelation.

### Karte Ü2 „Voraussetzungen und Bericht“

Tabelle „Voraussetzungen je Verfahren“ (Textfassung = Tabelle):

| Verfahren | braucht | Vorsicht |
|---|---|---|
| t-Test | metrische Variable, zwei unabhängige Gruppen, genug Befragte je Gruppe (Faustregel 30) | Welch-Zeile lesen. Signifikant heißt nicht groß: Hedges' g nennen. |
| ANOVA | wie t-Test, drei oder mehr Gruppen | Klassisches F und Tukey setzen ähnliche Streuungen voraus: Std. Deviation vergleichen, Welch-Zeile prüfen. η² nennen. |
| Tukey | eine ANOVA davor | Kleine Gruppen machen Vergleiche unsicher; nicht signifikant heißt nicht gleich. |
| Korrelationsmatrix | metrische Variablen (oder viele geordnete Stufen) | Viele Paare, viele Fehlalarme; Vorzeichen nach Kodierung lesen; N je Paar verschieden. |

Text:
> Für alle gilt: Ein Test sagt, ob ein Unterschied über den Zufall hinausgeht, nicht warum es ihn gibt. Ob das Abitur, der Wohnort oder etwas Drittes dahintersteckt (Drittvariable, kennst du aus Sitzung 6), klärt kein Mittelwertvergleich. Und für Aussagen über Deutschland gewichtest du.

**So berichtest du einen Mittelwertvergleich** (Muster, mit dem Beispiel aus Grundlage 1, nicht mit einer Aufgabe):
> „Erwerbstätige Männer arbeiten im Mittel 41,6 Stunden pro Woche, erwerbstätige Frauen 33,6 Stunden. Der Unterschied von 8,0 Stunden (95-%-KI 7,3 bis 8,7) ist signifikant (Welch-t = 22,99, p < 0,001) und groß (Hedges' g = 0,85). ALLBUS 2023, gewichtet, gewichtetes N = 2.957.“

Bausteine daneben als Liste: Mittelwerte beider Gruppen; Unterschied mit Einheit und Intervall; Test mit p; Effektstärke; Quelle, Fallzahl, gewichtet. Zur Fallzahl: Mit Gewicht druckt R unter N die Summe der Gewichte; schreib dann „gewichtetes N“ (gezählt waren es hier 2.933 Erwerbstätige).

**Häufige Verwechslung:** „Signifikant = bewiesen.“ Ein Test macht einen Zufallsbefund unwahrscheinlich, beweist aber nichts, schon gar keine Ursache.

---

## 9. Mitnehmen

### Das Wichtigste aus dieser Sitzung

- Mittelwerte schwanken von Stichprobe zu Stichprobe. Wie stark, sagt der Standardfehler; er wird mit mehr Befragten kleiner.
- t = Unterschied ÷ Standardfehler: Signal durch Rauschen. Der p-Wert sagt, wie oft ein mindestens so großer Unterschied ohne echten Unterschied vorkäme; unter 0,05 heißt signifikant.
- Das 95-%-Konfidenzintervall zeigt, wo der wahre Unterschied plausibel liegt. Enthält es die 0, ist der Unterschied nicht signifikant, aber auch nicht als „gleich“ bewiesen.
- Signifikant heißt nicht groß: Die Effektstärke (Hedges' g, η²) sagt, wie groß ein Unterschied ist.
- Zwei Gruppen: t-Test, Welch-Zeile lesen. Drei oder mehr: ANOVA, danach Tukey, weil viele einzelne Tests Fehlalarme anhäufen.
- Voraussetzungen: metrische Variable, unabhängige Gruppen, genug Befragte je Gruppe, ähnliche Streuung (sonst Welch). Für Deutschland gewichten.
- In R: `t_test(y, group = g, weights = wghtpew)`, `oneway_anova(y, group = g, weights = wghtpew) %>% tukey_test()`, `pearson_cor(a, b, c, weights = wghtpew)`; `summary()` am Ende zeigt die ganze Tabelle.

### Prüf dich selbst (5 Fragen, je choice mit Begründung bei richtig und falsch)

| id | Frage | Optionen | Ziel | Begründung |
|---|---|---|---|---|
| p1 | Ein t-Test mit 5.000 Befragten ergibt p < 0,001 und Hedges' g = 0,05. Was schreibst du? | `a` Ein großer, sicherer Unterschied. · `b` Ein signifikanter, aber vernachlässigbar kleiner Unterschied. · `c` Kein Unterschied. | `b` | p hängt an der Zahl der Befragten, g nicht. Bei 5.000 Befragten wird auch ein winziger Unterschied signifikant (Grundlage 2a). |
| p2 | Was misst der Standardfehler? | `a` wie stark einzelne Befragte um ihren Mittelwert streuen · `b` wie stark Mittelwerte oder Unterschiede von Stichprobe zu Stichprobe schwanken · `c` den Fehler, den die Befragten beim Antworten machen | `b` | Die Streuung der Einzelnen ist die Standardabweichung. Der Standardfehler gehört zum Mittelwert und wird mit mehr Befragten kleiner (Grundlage 1a). |
| p3 | Du vergleichst vier Gruppen mit sechs einzelnen t-Tests. Was ist das Problem? | `a` Gibt es in Wahrheit keine Unterschiede, steigt mit sechs Tests die Chance auf mindestens einen Fehlalarm auf etwa 26 %. · `b` t-Tests rechnen bei vier Gruppen falsch. · `c` Es gibt kein Problem. | `a` | Jeder Test hat 5 % Fehlalarm; bei sechs Paaren sind es zusammen etwa 26,5 %. Darum ANOVA und danach Tukey (Grundlage 3a). |
| p4 | Das 95-%-Konfidenzintervall eines Unterschieds reicht von −0,2 bis 0,9. Was gilt? | `a` Der Unterschied ist signifikant. · `b` Der Unterschied ist nicht signifikant; ob es einen gibt, bleibt offen. · `c` Die Gruppen sind gleich. | `b` | Die 0 liegt im Intervall, also p ≥ 0,05. Das ist kein Beweis für Gleichheit; plausibel sind Werte von −0,2 bis 0,9 (Grundlage 1c). |
| p5 | Welche Zeile der t-Test-Ausgabe liest du, und warum? | `a` „Equal variances assumed“, weil sie zuerst steht. · `b` „Equal variances not assumed“ (Welch), weil sie keine gleichen Streuungen voraussetzt. · `c` Egal, beide sind immer gleich. | `b` | Welch rechnet jede Gruppe mit ihrer eigenen Streuung. Bei ungleich großen Gruppen mit ungleicher Streuung können die Zeilen deutlich auseinandergehen (Grundlage 2c). |

### Dein Skript zum Mitnehmen (`sitzung7.R`)

Text: „Alle Vorlagen dieser Sitzung in einer Datei, mit Kommentaren. Öffne sie in RStudio und führe sie Block für Block aus.“ Link daneben: „→ Nachlesen im R-Workshop, Kapitel 7.6 Mittelwertvergleiche“.

Aufbau (Reihenfolge; Vorlagen so, wie sie auf der Seite starten; bei markierten Stellen ein Kommentar, was zu tauschen ist, ohne Ergebnis):
1. Kopfkommentar: „# Sitzung 7: Mittelwerte vergleichen. ALLBUS 2023, gewichtet mit wghtpew.“
2. Startblock.
3. `r_ttest` (Kommentar „# R lesen: ein t-Test, Zeile für Zeile“).
4. `a1_kurz` mit Kommentarzeile davor: „# Aufgabe 1: Tausche age gegen pt03 (Vertrauen in den Bundestag)“.
5. `a1_tabelle`.
6. `a2_alle`, `a2_jung`.
7. `a3_anova` mit Kommentarzeile: „# Aufgabe 3: Tausche age gegen pa01 und mode gegen gs01“.
8. `a3_tukey`.
9. `a4_matrix`.
10. Probier-Ideen als Kommentarblock „# Ideen zum Weiterdenken“ mit `frei_a1` bis `frei_a4`.

Jeder Block ist im Zahlen-Skript ausgeführt, zusätzlich im Wortlaut dieses Plans je für sich in einer frischen Umgebung nur mit `allbus` (Abschnitt „Jede Vorlage für sich“). Der Startblock läuft dort mit dem Pfad aus `ALLBUS_SAV`.

---

## 10. Hilfe bei R-Fehlermeldungen (typisch für diese Sitzung; Wortlaut mariposa 0.7.4, im Zahlen-Skript geprüft)

| Meldung (Auszug) | Was passiert ist | Was du tust |
|---|---|---|
| `Grouping variable `mode` must have exactly 2 groups. ✖ Found 3: "CAPI", "CAWI", and "MAIL". ℹ For 3 or more groups use `oneway_anova()`` | `t_test()` vergleicht genau zwei Gruppen; die Gruppenvariable hat mehr. (Genauso bei `sex`: Found 3: "MANN", "FRAU", and "DIVERS".) | Für drei oder mehr Gruppen `oneway_anova()` nehmen, oder mit `rec()` zwei Gruppen bilden wie bei `abitur`. |
| `Can't select columns that don't exist. ✖ Column `abitur` doesn't exist.` | `abitur` gibt es nur, wenn die `mutate()`-Zeilen davor mitlaufen. | Die ganze Vorlage ausführen, nicht nur die letzte Zeile (in RStudio alles markieren, dann Strg/Cmd+Enter). |
| `Variable `pa01` is not numeric. `oneway_anova()` requires numeric dependent variables.` | Die abhängige Variable wurde vorher mit `to_label()` in Wörter übersetzt. | `to_label()` für die abhängige Variable weglassen; mit Wörtern kann R keinen Mittelwert rechnen. (Für die Gruppenvariable stört `to_label()` nicht.) |
| `Argument `group` is missing, with no default.` | `group =` fehlt vor der Gruppenvariable. | `oneway_anova(pa01, group = gs01, …)` schreiben. |
| `Unknown argument `weight` … Did you mean `weights` instead of `weight`?` | Tippfehler beim Gewicht. | `weights = wghtpew`, mit s. |
| `tukey_test()` is not available for objects of class <t_test>.` | Tukey hinter einem t-Test. | Bei zwei Gruppen brauchst du kein Tukey; der t-Test ist schon der Paarvergleich. Tukey nur hinter `oneway_anova()`. |
| `tukey_test()` is not available for objects of class <summary.oneway_anova>.` | `summary()` steht vor `tukey_test()`. | Reihenfolge: `oneway_anova(…) %>%` → `tukey_test() %>%` → `summary()`. |
| `could not find function "t_test"` (deutsch: `konnte Funktion "t_test" nicht finden`) | mariposa ist nicht geladen. | Startblock ausführen (`library(mariposa)`). |
| Keine Meldung, aber nur eine Zeile `t(…) = …` | `summary()` fehlt; das ist die Kurzfassung. | `%>%` ans Zeilenende, darunter `summary()`. |
| Keine Meldung, aber zwei Blöcke „t-Test: pt03“ und „t-Test: abitur“ mit sehr großem t, ohne „Groups compared“ | `group =` fehlt; R testet jede Variable für sich gegen 0. | `t_test(pt03, group = abitur, weights = wghtpew)` schreiben. |

---

## 11. Entscheidungen (selbst getroffen, mit Begründung)

1. **Experiment der alten Aufgabe nicht übernommen.** Die alte Aufgabe „Die letzte Frage“ arbeitete mit dem Incentive-Experiment (`splt23_3`, `xr21`), einer 0/1-Variable als „Mittelwert“, Rollenszenario und bewusst **ungewichtet** (Experiment). Das widerspricht drei Regeln des Rollouts (keine Rollen, gewichtet ab Sitzung 6, Fokus auf Verfahren statt Fallstricke des Designs) und braucht Confounding als Hauptthema. Neu: metrische abhängige Variablen und einfache Gruppen.
2. **Gewichtung genau wie mariposa.** Alle Vorlagen mit `weights = wghtpew`. mariposa 0.7.4 behandelt Gewichte als Häufigkeitsgewichte: Mittelwerte und Streuungen gewichtet, N = gerundete Summe der Gewichte, Freiheitsgrade aus der Summe der Gewichte; `t_test()` zeigt standardmäßig Welch (`var.equal = FALSE`) und in `summary()` beide Zeilen; `oneway_anova()` rechnet klassisches F (gewichtet) plus gewichtete Welch-ANOVA; `tukey_test()` übernimmt die Gewichte. Darum steht im Kapitel ein Hinweis, dass N die gewichtete Zahl ist (R lesen, „Genauer erklärt“), mit den gezählten Fallzahlen als Beispiel (1.491/1.442 gegen 1.530/1.427). Feste Antworten sind gewichtet gegen gewichtet geprüft.
3. **Stichproben-Maschine aus vorberechneten Aggregaten.** Damit Grundlagen ohne Datei laufen und keine Mikrodaten in den Build kommen, liefert R (`set.seed(2026)`, Ziehen mit Wahrscheinlichkeit nach `wghtpew`) die ersten 20 Stichproben und die Stapel aller 1.000 als Zahlen. Gezeigt werden nur Mittelwerte von je 50 Personen.
4. **Männer/Frauen nur in Grundlage und R lesen.** `sex` hat drei Ausprägungen (18 divers); die Grundlage bildet zwei Gruppen mit `rec()` und sagt offen, warum. In den Aufgaben wird nicht nach Geschlecht gefiltert; dort bilden `abitur` und `gs01` die Gruppen. Die Fehlermeldung bei drei Gruppen steht in der Fehlerhilfe.
5. **„Abitur“ = Fachhochschulreife oder Hochschulreife** (`educ` 4, 5), „ohne“ = `educ` 1 bis 3, Sonstige und Schüler fehlen. Im Aufgabentext erklärt.
6. **Korrelationsmatrix als Thema 4, Zusatz.** Curriculum (`introduced`) und Sitzungsplan 6 nennen sie; sie ist aber kein Mittelwertvergleich. Als Zusatz hält sie die 45 Minuten frei und verknüpft „viele Tests“ mit Thema 3.
7. **Kein `levene_test()`.** Laut Funktionstabelle kommt er in Sitzung 9. Gleiche Streuung prüfen die Studierenden hier an der Spalte Std. Deviation (Faustregel Faktor 2) und an der Welch-Zeile; Welch ist ohnehin Standard.
8. **Kein Normalverteilungstest.** Die Voraussetzung wird über die Gruppengröße (zentraler Grenzwertsatz, in 1a sichtbar) erklärt; `normality_test()` steht nicht in der Funktionstabelle.
9. **p-Wert wird hier vollständig eingeführt.** Sitzung 6 übergeht p-Werte und Sterne ausdrücklich („kommt in Sitzung 7“), Sitzung 5 nennt beim χ²-Test nur „kaum durch Zufall zu erklären“. Karte 1c führt darum Nullhypothese, p-Wert, Signifikanzniveau α, Konfidenzintervall und Fehler 1. Art vollständig ein und knüpft mit grauem Schild an Sitzung 5 und 6 an.
10. **Zahlen mit Vorzeichen so, wie R sie druckt.** Die Antwortprüfung kennt nur ein Ziel je Feld. Gefragt wird deshalb mit Vorzeichen (Hilfezeile „so, wie R es druckt“), Rückmeldungen erklären das Minus. Wer es weglässt, bekommt den Hinweis.
11. **Jede Vorlage läuft für sich** (bindender Nachtrag zum Auftrag: die Werkstatt setzt `allbus` vor jedem Ausführen zurück). Jede Vorlage bildet `abitur` bzw. `geschlecht` in ihrer eigenen Kette; Wiederholungen tragen den Kommentar „# abitur bilden: wie in Schritt 1“ bzw. „wie in Aufgabe 1“. Keine Vorlage speichert etwas mit `<-`. Das Zahlen-Skript führt jede Vorlage im Wortlaut dieses Plans in einer frischen Umgebung aus, in der nur `allbus` existiert (Abschnitt „Jede Vorlage für sich“). Die Fehlerhilfe deckt den Fall ab, dass in RStudio nur die letzte Zeile ausgeführt wird.
12. **Platzhalter, die Bekanntes zeigen.** `a1_kurz` startet mit `age` (ein echtes, harmloses Ergebnis), `a3_anova` mit `age`/`mode`, also genau den Zahlen aus Grundlage 3. So prüfen Studierende zuerst, dass die Vorlage läuft, und sehen beim Tausch, was sich ändert. Antwort-Hinweise erkennen die Platzhalter-Zahlen (160.989, „Hast du age noch drin?“).
13. **Siebener- und Zehnerskalen als metrisch.** `pt03` (1–7), `pa01` (1–10), `ls01` (0–10) werden wie in der Praxis als metrisch behandelt; Karte 2b sagt ausdrücklich, dass das eine Annahme ist.
14. **Effektstärke-Grenzen wie mariposa:** g 0,2/0,5/0,8; η² 0,01/0,06/0,14 (Cohen). „negligible“ heißt im Kapitel „vernachlässigbar“.
15. **Konstruierte Beispiele** (n-Regler, Welch-Beispiel, F-Labor) tragen „zum Beispiel“, nie „(fiktiv)“; jede Zahl ist im Skript nachgerechnet.
16. **Zielwerte und Mehrdeutigkeit:** Keine Ganzzahl-Zielwerte über 999 (keine Verwechslung mit Tausenderpunkt); Dezimalziele mit Toleranz 0,005 (Mean Diff., g, r) bzw. 0,01 (F), sodass R-Schreibweise (`26.015`) und deutsche (26,015) beide passen. (Nach der Prüfung entfallen `a1c` mit t und `a3c` mit η²; damit auch die Abgrenzung zur Student-Zeile.)

17. **`rec()` mit Bereichen wie in Sitzung 5 und 6** (Prüfung 23.11.2026): `"1:3=0 [ohne Abitur]; 4:5=1 [mit Abitur]; else=NA"` statt der Kommaschreibweise `1,2,3`/`4,5`, damit Code aus früheren Sitzungen in derselben Schreibweise wiederkommt. Ergebnis identisch (im Skript geprüft).
18. **`ls01` in Grundlage und Zusatzaufgabe A2** (Prüfung 23.11.2026, bewusst so gelassen): Grundlage 1 nutzt `ls01` nach Geschlecht als Beispiel „kein echter Unterschied“, Grundlage 4 in der Matrix; A2 fragt `ls01` nach Abitur. Keine Zahl aus A2 steht in einer Grundlage. Ein Suchlauf über alle ALLBUS-Variablen mit 7 bis 12 Stufen fand keinen Ersatz für A2 mit demselben Lehrwert (gesucht: bei allen signifikant, aber vernachlässigbar; bei unter 30 ein mittlerer Effekt mit kleiner, stärker streuender Gruppe ohne Abitur; die besten Treffer wie `dk11`, `mn09`, `pt04` waren schwächer und inhaltlich weniger naheliegend). Ein Tausch in Grundlage 1 hätte die ganze Stichproben-Maschine neu verlangt. Abweichung von der Regel „verschiedene Variablen“ daher hingenommen.
19. **Fünf statt sechs Antwortfragen in A1 und A3** (Prüfung 23.11.2026, Zeitbudget): A1 fragt t nicht mehr als eigene Zahl ab; t und p werden in `a1d` gemeinsam gedeutet. A3 fragt η² nicht mehr als Zahl ab; `a3d` verlangt das Ablesen über die Optionen (2 % gegen 6 % aus Grundlage 3). Der Bericht-Satz ist in beiden Aufgaben der letzte, freiwillige Schritt und wandert ins Plenum. IDs `a1c` und `a3c` entfallen; die übrigen IDs bleiben unverändert.

### Bedenken

- **Zeit:** Nach der Prüfung haben A1 und A3 je fünf Fragen (zusammen etwa 36 bis 41 Minuten für schwache Studierende). Zeigen Testläufe trotzdem mehr als 45 Minuten, zuerst `a1e` (Konfidenzintervall) ins Plenum verlegen, dann in A3 `a3b` (F-Wert, reines Ablesen).
- **Stichproben-Maschine:** Die vorberechneten Zahlen hängen am Zufallsgenerator von R (R ≥ 3.6, Standard „Rejection“). Das Zahlen-Skript prüft sie; bei einer R-Version mit anderem Generator bricht es ab.
- **Inhaltliche Fallen:** Abitur und Wohnort hängen mit Alter zusammen; die Aufgaben sprechen das nur im Plenum an (Drittvariable aus Sitzung 6). Wer Kausalität liest, wird in Überblick Ü2 gebremst.

---

## 12. Abweichungen zu den Folien

Für Sitzung 7 gibt es noch keine Folien (`Seminarvorbereitung/` enthält nur Sitzung 1 bis 4). Beim Bau der Folien beachten:
- dieselbe Schreibweise: `t_test(y, group = g, weights = wghtpew)`, `%>% summary()` in eigener Zeile, `oneway_anova() %>% tukey_test() %>% summary()`;
- im Input andere Variablen als die Aufgaben nehmen (nicht `pt03` × `abitur`, nicht `pa01` × `gs01`, nicht `ls01` × `abitur`, nicht die vier Vertrauensfragen); geeignet sind die Grundlagen-Beispiele (`dw15`/`ls01` × Geschlecht, `age` × `mode`) oder eigene;
- „Welch-Zeile lesen“ als feste Regel;
- Normalverteilung als Wiederholung über die Stichprobenverteilung (Glocke der Mittelwerte), nicht über Normalverteilungstests.

---

## Prüfung (Agent, 23.11.2026)

Geprüft nach `.superpowers/sdd/2026-11-23-lernpfad-kapitel-bausteine-und-pilot/teil-b-plan-pruefung.md`, mit Blick auf `sitzung06.md` (verschiebt p-Werte ausdrücklich auf Sitzung 7) und `sitzung05.md` (χ²-Test mit „kaum durch Zufall“). `sitzung08.md` gibt es noch nicht. `Rscript sitzung07-zahlen.R` läuft nach den Änderungen mit Exit 0 (214 Prüfungen, 13 ```r-Blöcke wörtlich abgeglichen).

### 1. Schwache Studentin ohne Vorwissen (Durchspielen, Zeit)

Befunde:
- Vorher A1 etwa 21 Minuten (sechs Fragen, eigener Bericht-Satz vor den Fragen), A3 etwa 24 Minuten (sechs Fragen, Satz): zusammen etwa 45 Minuten ohne Puffer für den ersten Start der Werkstatt, das Lesen von Bild R2 und Nachschlagen. Zu knapp.
- `a1c` (t ablesen) und `a3c` (η² ablesen) waren reines Ablesen direkt vor einer Deutungsfrage zur selben Zahl.
- Karte 1c stellte die Frage „Wie ungewöhnlich sind 0,60 Punkte?“, beantwortete sie aber nur für 0,5 und 0,8 Punkte; man musste raten, wie p = 0,11 in Stichprobe 12 dazu passt.
- Die neue Kommaschreibweise in `rec()` (`1,2,3=0`) war unerklärt.
- `t_test(pt03, abitur, …)` ohne `group =` rechnet ohne Meldung zwei Einstichproben-Tests (t über 200); der Plan behauptete nur die Meldung bei `oneway_anova()`. Wer das übersieht, liest falsche Zahlen ab.

Geändert (7): `a1c` gestrichen, t und p in `a1d` gemeinsam gedeutet; `a3c` gestrichen, `a3d` verlangt das Ablesen über die Optionen (2 % gegen 6 % aus Grundlage 3, zugleich Tausch-Kontrolle); Bericht-Satz in A1 und A3 als letzter, freiwilliger Schritt und im „Fürs Plenum“; `rec()`-Regel in A1 Schritt 1 in Worten erklärt; Karte 1c beantwortet ihre Eingangsfrage (127 von 1.000, etwa 13 %; R: p = 0,11, mit Erklärung des kleinen Unterschieds); stiller Fehler ohne `group =` in R1 („Häufige Verwechslung“) und in der Fehlerhilfe; Zeitangaben neu (A1 etwa 17, A3 etwa 19 Minuten, zusammen 36 bis 41).

### 2. Didaktik

Befunde:
- Grundlagen führen direkt in ihre Aufgaben; Festlegen vor jeder Aufgabe, Deuten-Fragen vorhanden; Probier-Ideen sind echte Anschlussfragen (Polizei leitet zu Thema 2 über, Familienstand zur Kausalfrage). Kein Grundlagen-Ergebnis wird in einer Aufgabe gefragt.
- Karte 1c sagte „vielleicht in Sitzung 6 begegnet“; Sitzung 6 verschiebt p und Sterne aber ausdrücklich hierher, Sitzung 5 kennt nur „kaum durch Zufall“.
- „Alpha-Fehler-Kumulierung“ (Karte 3a) setzte α voraus, das nirgends eingeführt war.
- `rec()` mit `1,2,3`/`4,5` wich von der Schreibweise in Sitzung 5 und 6 (`1:2`, `3:4`) ab.
- Der Plan behauptete, Grundlagen und Aufgaben teilten außer `age` keine Variable; `ls01` steht aber in Grundlage 1 und 4 und in A2.

Geändert (5): Karte 1c knüpft mit grauem Schild an Sitzung 5 und 6 an und führt das Thema vollständig ein; Signifikanzniveau α und „Alpha-Fehler“ in 1c eingeführt; `rec()` auf Bereichsschreibweise umgestellt (Plan und Skript, Ergebnisse identisch); Aussage in §2 berichtigt und Entscheidung 18 ergänzt; Hinweis „`summary()`: neu heute“ in A1 Schritt 2 gestrichen (in R lesen schon eingeführt).

### 3. Fachliches und Barrierefreiheit

Befunde:
- Rscript lief schon vorher mit Exit 0; alle Zielwerte entsprechen der mariposa-Ausgabe (Rundung, Vorzeichen).
- Bild 1c-1 nannte „42 von 1.000“, die hervorgehobenen Kisten enthielten aber nur 40: Zwei Stichproben lagen genau auf −0,80 und fielen bei links geschlossenen Kisten in die innere Kiste.
- „Das gilt allgemein ab 30 je Gruppe“ (zentraler Grenzwertsatz) war zu stark; „unterscheidet sich mindestens eine Gruppe von den anderen“ (F) und „Ein Paar unterscheidet sich, wenn …“ (Tukey) ungenau; A3-Lösung sagte „unterscheiden sich nicht“ für ein nicht signifikantes Paar, entgegen der Kernaussage der Sitzung.
- Berichte nannten das gewichtete N als „n“ (Personen).
- A4-Lösung: „die drei anderen Vertrauenspaare“; es sind fünf.
- `hs01` (fünf Stufen) in einer Pearson-Matrix ohne Hinweis, obwohl Karte 2b metrisch verlangt.
- n-Regler unterschied die Zustände nur über die Farbe (Satz zudem verstümmelt); „·“ stand in 3a und 3b neben Zahlen („s = 0,5 · 1 · 2“ las sich wie ein Produkt); Werteliste zu Bild 3c-1 war nicht als Textfassung gekennzeichnet.

Geändert (13): Stapel der Lebenszufriedenheit symmetrisch um 0 gezählt (Grenzfälle in die äußere Kiste) mit neuen Zahlen 4, 16, 43, 101, 165, 176, 185, 159, 87, 42, 18, 4; Bild 1c-1 hebt jetzt |Unterschied| ≥ 0,6 hervor (63 + 64 = 127), alles im Skript geprüft, dazu größter Abstand 1,14; Grenzwertsatz als Faustregel mit Einschränkung (Karte 1a und 2b), „annähernd“ normalverteilt; F- und Tukey-Sätze präzisiert; A3-Lösung „kein Unterschied nachweisbar“; „gewichtetes N“ in A1-Muster, Ü2-Bericht (mit gezählten 2.933 als Erklärung, im Skript geprüft) und Bild 3c-1; „fünf andere Vertrauenspaare“; Hinweis zu `hs01` mit Verweis auf Spearman aus Sitzung 6; Option `selten` in `a1d` sagt „mindestens so großer“; n-Regler mit gestrichelt/durchgezogen und Text; „·“ neben Zahlen ersetzt und Schreibweise-Hinweis zu „·“ im Kopf des Plans; Bild 3c-1 mit „zugleich Textfassung“; `p3` mit Bedingung „gibt es in Wahrheit keine Unterschiede“; Voraussetzung der Korrelationsmatrix „oder viele geordnete Stufen“. Im Skript zusätzlich: Prüfung des stillen `t_test()` ohne `group =` und Abgleich jedes ```r-Blocks dieses Plans mit den geprüften Vorlagen.

Sprache, R-Stil und Daten geprüft ohne weiteren Befund: Du-Form, keine Witze, kein „(fiktiv)“, keine Rollen; `library(tidyverse)` vor `library(mariposa)`, `%>%`, Daten vorn, `rec()` in `mutate()`, kein `ifelse()` in Vorlagen, jede Vorlage läuft für sich; nur Aggregate (kleinste Zahl: 18 „divers“, 62 gewichtete Befragte im Einzelgehöft).

### Bewusst nicht geändert

- **`ls01` in Grundlage 1/4 und A2** (Entscheidung 18): kein gleichwertiger Ersatz für A2 gefunden, Tausch in Grundlage 1 hätte die Stichproben-Maschine neu verlangt; nichts wird verraten.
- **Länge von Grundlage 1** (vier Karten, etwa 15 Minuten): Sie trägt die ganze Testlogik, die Sitzung 6 hierher verschoben hat; kürzen würde Lücken reißen.
- **`a1a` neben dem Festlegen**: doppelt sich mit dem Tipp, ist aber der leichteste Einstieg in die Ausgabe und kostet kaum Zeit.
- **A2 und A4** nicht gekürzt (Zusatz).
- **„1 Stein = 10 Stichproben“** bei Kistenwerten wie 43 oder 4: Das Runden auf Steine bleibt dem Umsetzenden; die genauen Zahlen stehen in der Textfassung und über den hervorgehobenen Kisten.
- **Folien:** Für Sitzung 7 gibt es keine; Abschnitt 12 bleibt Merkliste.

## Nacharbeit nach Kapitelprüfung (23.11.2026)

- **Live-Region des Tipp-Vergleichs** (`.s07-tipp`): im Leerzustand nicht mehr `display:none` (nahm sie aus dem Zugänglichkeitsbaum), sondern eingeklappt (Rand, Innenabstand und Mindesthöhe 0); sie bleibt gerendert.
- **Tipp-Vergleich** erscheint erst, wenn keine Frage der Aufgabe mehr offen ist (vorher: sobald eine Frage geprüft war).
- **A4-Lösung `a4d`:** „die Vertrauensfragen wurden nur etwa zwei Dritteln der Befragten gestellt“ (Grammatik); ebenso die Einleitung von Aufgabe 1 („zwei Dritteln“, 1.596 ohne Frage) statt „eine Hälfte des Fragebogens“.
- **Formeln als Bausteine (Bild 1b und 3b):** der sichtbare Bruch ist für Screenreader ausgeblendet; ein nur vorgelesener Satz sagt „Signal geteilt durch Rauschen gleich t“ bzw. „Streuung zwischen den Gruppen geteilt durch Streuung innerhalb der Gruppen gleich F“.
- **Stichproben-Maschine:** Nach „Von vorn“ springt der Fokus auf den Knopf zum Ziehen.
- **Bild 4a:** Hilfezeile nennt die p-Werte ohne Stern: „Ohne Stern: p = .051, .180, .087“.
- **Rückport in den Plan:** „zwei Drittel“ für `pt03`; „≈ 7,988“ in Bild 1b mit Hinweis auf die ungerundeten Mittelwerte; neutrale Zahlen in den Hilfezeilen von `a1b`, `a3b`, `a4a` (Beispielzahl statt der Lösung).
- **Freie Karte:** Hinweise als `MapLink` mit Begriffs-Kennung: `sd` (Karte 1a), `ss` (Karte 3b), `pearson` (Karte 4a).
