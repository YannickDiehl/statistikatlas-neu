# Sitzung 6 „Gewichtung und Zusammenhang“: Inhaltsplan des Kapitels

Stand: 23.11.2026. Plan für den Bau im Atlas (`src/chapter/s06/`), nach dem Muster von Sitzung 4 (`prototyp/sitzung4.html`). Curriculum: id 6, Sitzungsplan 5, bisherige Aufgabe `s05` (`src/tasks/s05-treiber/`). Alle Zahlen: ALLBUS 2023, ZA8831 v1.3.0, mariposa 0.7.4, **gewichtet mit `wghtpew`**, ungewichtete Werte nur zum Vergleich. Jede Zahl und jede Vorlage ist in `sitzung06-zahlen.R` geprüft (läuft mit `Rscript` ohne Fehler; prüft am Ende, dass jeder ```r-Block dieser Datei wörtlich eine geprüfte Vorlage ist).

Schreibweisen in diesem Plan: `⟦…⟧` markiert eine Stelle in einer Vorlage, die angepasst wird (im Atlas: Hervorhebung, verschwindet nach Änderung); der Inhalt ist der lauffähige Beispielwert. Zahlen im Fließtext deutsch (Komma, Tausenderpunkt), in R-Ausgaben so, wie R sie druckt.

---

## 1. Kopf

**Stein:** 6. **Titel:** Gewichtung und Zusammenhang.

**Leitfrage (Begleitfigur):** Was hängt mit der Zufriedenheit mit der Demokratie zusammen – und wie misst man, wie stark?

**Wegweiser (drei Kacheln wie in Sitzung 4):**
- Vorweg: R lesen – Gewicht als Argument, Maße mit zwei Variablen
- Vier Themen – je erst die Grundlage, dann die Aufgabe; im Seminar direkt zur Aufgabe springen
- Zum Schluss – Überblick, Wichtigstes, Selbsttest, Skript

**Was du nach dieser Sitzung kannst**
- *Verfahren:* erklären, warum der ALLBUS den Osten stärker befragt und wie das Gewicht `wghtpew` das ausgleicht; zu zwei Variablen das passende Zusammenhangsmaß wählen: Cramér-V und Phi (nominal), Gamma und Tau-b (ordinal), Spearman-ρ und Pearson-r (metrisch).
- *Interpretation:* Stärke am Betrag und Richtung am Vorzeichen ablesen und in einem Satz „Je …, desto …“ sagen; die Stärke mit einer Faustregel einordnen.
- *Voraussetzungen:* wissen, welches Skalenniveau ein Maß braucht, warum Gamma größer ausfällt als Tau-b, warum Pearson-r Ausreißer und Kurven schlecht verträgt und wie man mit einer Drittvariable prüft, ob ein Zusammenhang von etwas Drittem herrührt (dass ein Zusammenhang keine Ursache ist, kennst du aus Sitzung 5).
- *Code lesen:* `weights = wghtpew` in eine Funktion setzen; `cramers_v()`, `phi()`, `goodman_gamma()`, `kendall_tau()`, `spearman_rho()` und `pearson_cor()` mit zwei Variablen aufrufen und ihre Ausgabe lesen.

**Schon bekannt und hier nur kurz erinnert** (graues Schild „kennst du aus Sitzung …“): der Startblock (Sitzung 1), `filter(eastwest == 2)` (Sitzung 2), `frequency()` mit Valid % und Cum. % und fehlenden Werten (Sitzung 3), Ketten mit `%>%`, `drop_na()`, `ggplot()` und die Skalenniveaus nominal, ordinal, metrisch (Sitzung 4), `mutate()` mit `rec()` samt `rules = "rev"` (dort am Beispiel der Wirtschaftslage `ep01`), `crosstab()` mit Zeilenprozenten, „ein Zusammenhang ist keine Ursache“ und der Chi-Quadrat-Test als Wiederholung aus der Vorlesung (Sitzung 5).

**So arbeitest du mit dieser Seite:** wie in Sitzung 4 (Genauer erklärt, Kurz überlegen, Code-Werkstatt, markierte Stellen). Zusatzsatz für diese Sitzung: „Ab heute rechnen alle Vorlagen gewichtet, wenn es um Aussagen über ganz Deutschland geht. Warum, zeigt Thema 1.“

**Sprungknöpfe fürs Seminar:** vier Knöpfe „Aufgabe 1“, „Aufgabe 2“, „Aufgabe 3“, „Aufgabe 4“.

---

## 2. Themen im Überblick

| Thema | Grundlage (Variablen) | Aufgabe (Variablen) | Art | Zeit |
|---|---|---|---|---|
| 1 Gewichtung | Ost-Überquote, Gewicht als Bruch, Mischpult (eastwest, wghtpew, rd01 als „konfessionslos“) | A1 Wie zufrieden ist Deutschland? (ps03 ungewichtet und gewichtet, je Landesteil) | Pflicht | G 12 Min., A 10 Min. |
| 2 Kategorien ohne Reihenfolge: χ², Phi, Cramér-V | erwartet gegen beobachtet, χ² in Bausteinen, Stärke-Lineal (konstruierte Tafel mit 100 Befragten; echt: rd01 × eastwest) | A2 Zufriedenheit und Wahlabsicht (ps03 in zwei Gruppen × pv01, `crosstab()`, `cramers_v()`) | Pflicht | G 15 Min., A 15 Min. |
| 3 Geordnete Stufen: Gamma und Tau-b | Paare vergleichen, Gamma und Tau-b in Bausteinen, Vorzeichen und Kodierung (fünf konstruierte Personen; echt: hs01 × id02; Reihenfolge: rd01 × hs01) | A3 Wirtschaftslage und Demokratie (ps03 umgepolt × ep01, `goodman_gamma()`, `kendall_tau()`) | Pflicht | G 15 Min., A 15 Min. |
| 4 Zahlen mit Abständen: Pearson und Spearman, Drittvariable | Punkte-Labor, r in Bausteinen, Ausreißer (konstruiert: acht Personen; echt: age × xt10), Drittvariable (xr19 × hs01 nach Alter) | A4 Lebenszufriedenheit und Demokratie (ps03 umgepolt × ls01, `pearson_cor()`, `spearman_rho()`, West/Ost) | Zusatz | G 15 Min., A 15 Min. |
| Überblick | Entscheidungsbaum „welches Maß?“, Voraussetzungen, dieselben Daten in fünf Maßen | – | – | 5 Min. |

Pflichtaufgaben zusammen etwa 40 Minuten (A1 10, A2 15, A3 15). Die Grundlagen nutzen keine Variable der Aufgaben außer `eastwest`, das als Gewichtungsmerkmal in Thema 1 nötig ist (siehe Entscheidungen).

---

## 3. Vorweg: R lesen

### Karte R1: Neu heute: ein Gewicht als Argument (Code lesen)

**Schild:** „Startblock: kennst du aus Sitzung 1“, „`frequency()`: kennst du aus Sitzung 3“.

**Text:** Den Startblock kennst du: Er lädt die Werkzeuge und legt den ALLBUS unter dem Namen `allbus` ab. In der Code-Werkstatt hier ist das schon erledigt, in RStudio führst du ihn zu Beginn aus.

```r
# Pakete laden und Daten einlesen
library(tidyverse)
library(mariposa)

allbus <- read_spss("ZA8831_v1-3-0.sav")
```

Neu ist heute ein Argument, das du an fast jede Funktion hängen kannst: `weights = wghtpew`. So liest du die Zeile (Bild `s6-lesezeile`, wie die Lesezeile in Sitzung 4):

| Baustein | gesprochen |
|---|---|
| `allbus` | Objekt: der ganze Datensatz |
| `%>%` | und dann |
| `frequency(` | Funktion: zähle aus |
| `eastwest` | Argument: welche Variable |
| `weights = wghtpew` | Argument: und lass dabei jede Person so viel zählen, wie ihr Gewicht sagt |
| `)` | |

Probier es aus (Werkstatt, ohne markierte Stellen):

```r
# Wohnort West oder Ost: erst ungewichtet, dann gewichtet
allbus %>%
  frequency(eastwest)

allbus %>%
  frequency(eastwest, weights = wghtpew)
```

Die zweite Tabelle trägt die Überschrift „Weighted Frequency Analysis Results“. Ungewichtet wohnen 32,01 % der Befragten im Osten (NEUE BUNDESLAENDER), gewichtet 16,84 %. Warum, klärt Thema 1.

**Kurz gesagt:** `weights = wghtpew` lässt jede Person so viel zählen, wie ihr Gewicht sagt. Das Argument steht in der Klammer der Funktion, die gewichtet rechnen soll, und gilt nur dort.

**Genauer erklärt: Muss ich das Gewicht jedes Mal hinschreiben?** Ja. In SPSS schaltet man die Gewichtung einmal für alles ein. In R gehört `weights = wghtpew` in jede Funktion, die gewichtet rechnen soll; R merkt es sich nicht für die nächste Zeile. Fehlt es, rechnet R ungewichtet, ohne zu warnen. Daran erkennst du eine gewichtete Ausgabe: „Weighted“ in der Überschrift von `frequency()` und `describe()`, „[Weighted]“ hinter den Variablennamen bei `kendall_tau()` und `pearson_cor()`, „Weights variable: wghtpew“ im Kopf von `crosstab()`. Bei `cramers_v()`, `phi()` und `goodman_gamma()` siehst du nur eine Zahl; dort zeigt allein dein Code, ob gewichtet wurde. Die Zahlen unter N sind gewichtet keine Personen mehr, sondern Summen der Gewichte (im Osten 883 statt 1.679).

**Häufige Verwechslung:** `weights = wghtpew` und `filter()`. Das Gewicht ändert, wie viel jede Person zählt; alle bleiben drin. `filter()` ändert, wer überhaupt mitzählt.

### Karte R2: Ein Zusammenhangsmaß in R: zwei Variablen, eine Zahl (Code lesen)

**Text:** Alle Zusammenhangsmaße dieser Sitzung haben dieselbe Form: Datensatz vorn, dann die Funktion mit zwei Variablen und, wenn es um Deutschland geht, dem Gewicht.

```r
# Ein Zusammenhangsmaß: zwei Variablen und das Gewicht in einer Klammer
allbus %>%
  kendall_tau(hs01, id02, weights = wghtpew)
```

R antwortet so (Bild `s6-ausgabe-lesen`: diese drei Zeilen mit Pfeilen auf „tau = -0.241“ „das Maß“, „p < 0.001 ***“ „p-Wert, heute nicht nötig“, „N = 5151“ „so viele zählen mit (gewichtet: Summe der Gewichte)“, „[Weighted]“ „gewichtet gerechnet“):

```text
Kendall's Tau: hs01 x id02 [Weighted]
  tau = -0.241, p < 0.001 ***, N = 5151
Use summary() for detailed output.
```

Die Funktionen der Sitzung (Tabelle):

| Funktion | Maß | passt zu | Gewicht? | Ausgabe |
|---|---|---|---|---|
| `cramers_v(x, y, weights = wghtpew)` | Cramér-V | nominal | ja | nur die Zahl hinter `[1]` |
| `phi(x, y, weights = wghtpew)` | Phi | zwei mal zwei Kategorien | ja | nur die Zahl, manchmal mit Minus (Thema 2) |
| `goodman_gamma(x, y, weights = wghtpew)` | Gamma | ordinal | ja | nur die Zahl |
| `kendall_tau(x, y, weights = wghtpew)` | Tau-b | ordinal | ja | `tau = …` |
| `spearman_rho(x, y)` | Spearman-ρ | ordinal, metrisch | rechnet immer ohne Gewicht | `rho = …` |
| `pearson_cor(x, y, weights = wghtpew)` | Pearson-r | metrisch | ja | `r = …` |

**Kurz gesagt:** Ein Zusammenhangsmaß bekommt zwei Variablen und gibt eine Zahl zurück. Lies die Zahl hinter dem Gleichheitszeichen; R schreibt Kommazahlen mit Punkt: `-0.241` heißt −0,241.

**Genauer erklärt: p-Wert, Sternchen und Warnungen.** Den p-Wert und die Sternchen lässt du heute links liegen. Kurz begegnet ist dir ein p-Wert beim Chi-Quadrat-Test in Sitzung 5; was er genau bedeutet, kommt in Sitzung 7. Heute zählt nur die Zahl des Maßes. Bei `cramers_v()`, `phi()` und `goodman_gamma()` meldet R manchmal in Rot „2 cells (6.7%) has expected count < 5. Chi-squared approximation may be unreliable.“ Das ist ein Hinweis zum χ²-Test, kein Fehler; die Zahl darüber kannst du verwenden. Die Reihenfolge der zwei Variablen ändert den Wert nicht: `kendall_tau(hs01, id02)` und `kendall_tau(id02, hs01)` geben dasselbe.

**Häufige Verwechslung:** `[1]` ist keine Zahl des Ergebnisses. R nummeriert damit nur die Ausgabe; das Ergebnis steht dahinter.

---

## 4. Thema 1: Gewichtung

### Grundlage 1: Gewichtung (etwa 12 Minuten)

Einleitungssatz: Warum zählt im ALLBUS nicht jede Person gleich, und was ändert das? Drei kurze Schritte.

#### 1a Der Osten ist absichtlich stärker vertreten (Schätzen)

**Beispiel zuerst:** Der ALLBUS 2023 hat 5.246 Menschen befragt. In Deutschland wohnen knapp 17 von 100 Erwachsenen in den neuen Bundesländern (mit Ost-Berlin). Bevor du die Daten siehst: Wie viele von 100 Befragten im ALLBUS wohnen im Osten?

**Interaktion `s6-schaetzen-ost`:** Bauplatte aus 10 × 10 Steinen, alle grau. Schieberegler „Befragte aus dem Osten (von 100)“, 0 bis 100, Start 50; die entsprechende Zahl Steine färbt sich in der Ost-Farbe (CAT[1]), der Rest in der West-Farbe (CAT[0]). Tastatur: Regler mit Tab, Pfeiltasten. Knopf „Tipp abgeben und aufdecken“; danach bleibt der Regler gesperrt, und der Fokus springt auf die Rückmeldung.
Nach dem Aufdecken erscheinen zwei Bauplatten nebeneinander (Bild `s6-stichprobe`): links „ALLBUS (Stichprobe)“ 68 West, 32 Ost; rechts „Deutschland“ 83 West, 17 Ost. Darunter die eigene Platte mit Beschriftung „dein Tipp“.
Rückmeldung (aria-live), je nach Tipp t:
- t ≤ 22: „Du hast ungefähr den Anteil in der Bevölkerung getippt. Im ALLBUS sind es fast doppelt so viele: 32 von 100.“
- 23 ≤ t ≤ 40: „Nah dran: 32 von 100 Befragten wohnen im Osten. In der Bevölkerung sind es nur 17.“
- t > 40: „So viele sind es nicht: 32 von 100 Befragten wohnen im Osten, in der Bevölkerung 17.“
Textfassung des Bildes: „Zwei Bauplatten aus je 100 Steinen. ALLBUS: 68 Steine West, 32 Ost (genau 67,99 % und 32,01 %, also 3.567 und 1.679 Befragte). Deutschland: 83 West, 17 Ost (83,16 % und 16,84 %, so verteilt das Gewicht die Befragten).“

**Kurz gesagt:** Der ALLBUS befragt Menschen im Osten absichtlich häufiger, als es ihrem Anteil an der Bevölkerung entspricht. Fachbegriff: disproportionale Stichprobe. Für Aussagen über ganz Deutschland gleicht man das aus: Man gewichtet.

**Genauer erklärt: Warum befragt man den Osten stärker?** Mit nur 17 von 100 kämen im ALLBUS knapp 900 Ostdeutsche zusammen. Für Aussagen über den Osten allein, etwa getrennt nach Alter oder Bildung, wäre das schnell zu wenig. Darum befragt der ALLBUS dort mehr Menschen. Der Preis: Wer alle Befragten einfach zusammenzählt, holt den Osten fast doppelt so stark ins Bild, wie er in Deutschland ist.

**Häufige Verwechslung:** Die Überquote ist kein Fehler der Stichprobe, sondern geplant. Das Gewicht repariert keinen Fehler, es gleicht einen bekannten Plan aus.

#### 1b Formel lesen lernen: Wie groß ist ein Gewicht? (Im Bild)

**Beispiel zuerst:** Im Westen wohnen 83,16 % der Bevölkerung, aber nur 67,99 % der Befragten. Im Osten ist es umgekehrt: 16,84 % der Bevölkerung, 32,01 % der Befragten.

**Bild `s6-gewicht-bausteine` (Formel als Bausteine):** Oben die Formel aus drei Steinen: [Gewicht] = [Anteil in Deutschland] geteilt durch [Anteil in der Stichprobe] (Bruchstrich als waagrechter Balken, kein „·“). Darunter zwei Zeilen, jeder Baustein in der Farbe seiner Gruppe:
- West: 83,16 % geteilt durch 67,99 % = 1,22. Satz: „Eine Person aus dem Westen zählt wie 1,22 Personen.“
- Ost: 16,84 % geteilt durch 32,01 % = 0,53. Satz: „Eine Person aus dem Osten zählt wie gut eine halbe Person.“
Rechts daneben ein Stapel aus Steinen, deren Breite ihr Gewicht zeigt: drei West-Steine (breit, Aufschrift 1,22) und drei Ost-Steine (schmal, Aufschrift 0,53); Beschriftung „Beispielsteine, kein echter Befragter“.
Ganz unten die Probe: „3.567 Befragte im Westen mal 1,22 ergibt etwa 4.363. 1.679 Befragte im Osten mal 0,53 ergibt etwa 883. Zusammen 5.246: so viele wie vorher, nur anders verteilt.“
Textfassung: wie oben, als Liste in dieser Reihenfolge (Formel, West, Ost, Probe).

**Kurz überlegen (Frage `g1b`, Zahl):** „Angenommen, eine Umfrage hätte 50 von 100 Befragten im Osten, in der Bevölkerung wären es 17 von 100. Welches Gewicht bekäme dann eine Person aus dem Osten?“ Hilfezeile: „Anteil in Deutschland geteilt durch Anteil in der Stichprobe. Eine Kommazahl reicht, zum Beispiel 0,75.“ Ziel 0,34, Toleranz 0,01. Richtig: „Stimmt: 17 geteilt durch 50 ergibt 0,34. Je stärker eine Gruppe überrepräsentiert ist, desto kleiner ihr Gewicht.“ Falsch: „Teile den Anteil in Deutschland (17) durch den Anteil in der Umfrage (50).“

**Kurz gesagt:** Ein Gewicht sagt, wie stark eine Person zählt. Fachbegriff: Designgewicht, im ALLBUS die Variable `wghtpew` (personenbezogenes Ost-West-Gewicht). Unter 1 zählt eine Person weniger, über 1 mehr.

**Genauer erklärt: Wie sieht `wghtpew` im Datensatz aus?** Jede befragte Person hat einen Wert in `wghtpew`. Im Westen liegt er zwischen 1,20 und 1,25, im Osten zwischen 0,50 und 0,55; je Landesteil gibt es drei leicht verschiedene Werte, weil der ALLBUS 2023 aus mehreren Teilen der Erhebung besteht. Im Mittel liegt `wghtpew` bei genau 1, darum bleibt die Gesamtzahl gleich (5.246). Mehr zum Ziehen von Stichproben in der freien Karte.
→ In der freien Karte: Gewichte (Begriff `weights`).

**Häufige Verwechslung:** „Gewichtet zählen die Ostdeutschen weniger, also sind sie weniger wichtig.“ Nein: Sie zählen genau so viel, wie es ihrem Anteil an der Bevölkerung entspricht. Ungewichtet zählten sie fast doppelt.

#### 1c Was die Gewichtung am Ergebnis ändert (Im Bild, interaktiv)

**Beispiel zuerst:** Wie viele Menschen gehören keiner Religionsgemeinschaft an (Konfession „keine“)? Im Westen sind es 33,7 %, im Osten 77,5 %. Zusammengezählt ohne Gewicht ergibt das 47,7 %, mit Gewicht 41,0 %.

**Interaktion `s6-mischpult` (Formel lesen lernen):** Formel als Bausteine oben: [Anteil in ganz Deutschland] = [Anteil West an allen] mal [Quote im Westen] + [Anteil Ost an allen] mal [Quote im Osten]. Darunter ein Schieberegler „Anteil der Befragten aus dem Osten“, 0 bis 100 % (Schritt 1), plus zwei Knöpfe „wie im ALLBUS (32,0 %)“ und „wie in Deutschland (16,8 %)“. Rechts ein waagrechter Balken 0–100 % für den Gesamtanteil „keine Konfession“, mit zwei festen Marken bei 33,7 % („nur West“) und 77,5 % („nur Ost“). Live gerechnet: Gesamtanteil = (1 − p) × 33,66 + p × 77,55 (exakt 1440/4278 und 670/864, gewichtete Quoten), Anzeige mit einer Nachkommastelle.
Zustände (aria-live, ein Satz): bei p = 32,0 %: „Ost-Anteil 32,0 %: insgesamt 47,7 % ohne Konfession. So rechnet der ALLBUS ohne Gewicht.“; bei p = 16,8 %: „Ost-Anteil 16,8 %: insgesamt 41,0 % ohne Konfession. So rechnet der ALLBUS mit Gewicht.“; sonst: „Ost-Anteil p %: insgesamt x % ohne Konfession.“ (Werte zur Kontrolle: 0 % → 33,7; 50 % → 55,6; 100 % → 77,5.)
Unter dem Regler die Bausteine mit Zahlen für beide Fälle:
- ohne Gewicht: 0,68 × 33,7 + 0,32 × 77,4 = 22,9 + 24,8 = 47,7 %
- mit Gewicht: 0,832 × 33,66 + 0,168 × 77,55 = 28,0 + 13,0 = 41,0 %
Textfassung: „Je größer der Anteil der Befragten aus dem Osten, desto näher rückt der Gesamtanteil an die Ost-Quote von 77,5 %. Bei 32,0 % Ost-Anteil (ALLBUS ohne Gewicht) sind es 47,7 %, bei 16,8 % (mit Gewicht) 41,0 %. Ganz ohne Osten wären es 33,7 %, nur mit Osten 77,5 %.“

**Kurz gesagt:** Gewichtung verschiebt ein Ergebnis für ganz Deutschland nur, wenn sich West und Ost unterscheiden. Je größer der Unterschied, desto mehr ändert sie. Innerhalb von West oder Ost ändert sie fast nichts.

**Genauer erklärt: Warum bleibt innerhalb der Landesteile alles gleich?** Im Osten haben alle fast dasselbe Gewicht. Ob jede Person 1 oder 0,53 zählt, ändert den Anteil im Osten darum kaum: 77,4 % ohne, 77,5 % mit Gewicht. Gewichtung wirkt erst, wenn man West und Ost zusammenzählt, weil sich dann das Mischungsverhältnis ändert. Daraus folgt: Für einen Vergleich West gegen Ost brauchst du das Gewicht nicht; für eine Zahl über ganz Deutschland schon. `wghtpew` gleicht nur die Ost-West-Verteilung aus. Dass manche Gruppen seltener an Umfragen teilnehmen, gleicht es nicht aus.

**Häufige Verwechslung:** „Gewichtet ist genauer, ungewichtet ist falsch.“ Beide Zahlen sind richtig gerechnet; sie beantworten verschiedene Fragen. Die ungewichtete Zahl beschreibt die Befragten, die gewichtete schätzt Deutschland.

„Schon klar? Direkt zu Aufgabe 1 ↓“

### Aufgabe 1: Wie zufrieden ist Deutschland mit der Demokratie? (Pflicht)

↑ Grundlage 1 nachlesen

**Leitfrage:** Wie viele Menschen in Deutschland sind mit der Demokratie zufrieden, und was ändert die Gewichtung daran?

**Ziel:** Am Ende kannst du sagen, wie viel Prozent mindestens etwas zufrieden sind, ohne und mit Gewicht, und erklären, warum die Zahl mit Gewicht anders ausfällt. Grundlage: Grundlage 1, Gewichtung.

**Einleitung:** Der ALLBUS fragt nach der Zufriedenheit mit der Demokratie in Deutschland (`ps03`). Es gibt sechs Stufen: 1 sehr zufrieden, 2 ziemlich zufrieden, 3 etwas zufrieden, 4 etwas unzufrieden, 5 ziemlich unzufrieden, 6 sehr unzufrieden. Gut zwei Drittel der Befragten haben diese Frage bekommen; die übrigen hatten eine andere Fragebogen-Variante und stehen bei den fehlenden Werten unter „TNZ: SPLIT“ (fehlende Werte kennst du aus Sitzung 3). Als „zufrieden“ zählen hier alle mit 1, 2 oder 3.

**Erst festlegen (Frage `a1-tipp`, Knöpfe, wird beim Prüfen zitiert):** „Was passiert mit dem Anteil der Zufriedenen, wenn du gewichtest?“ Optionen: „Er steigt.“ / „Er sinkt.“ / „Er bleibt gleich.“ Nach „Tipp abgeben“ gesperrt. Beim Prüfen: „Dein Tipp war: … Mit Gewicht steigt der Anteil von 70,7 % auf 73,6 %.“

**Hinweis vor den Schritten:** „Arbeite in der Code-Werkstatt direkt hier oder in RStudio. In RStudio führst du vorher den Startblock aus ‚R lesen‘ aus.“

**Schritt 1:** Zähle `ps03` einmal ohne und einmal mit Gewicht aus. Lies jeweils in der Spalte **Cum. %** die Zeile **3 ETWAS ZUFRIEDEN** (Schild: „Cum. %: kennst du aus Sitzung 3“). Cum. % zählt die Prozente von oben zusammen; in Zeile 3 steht also, wie viele 1, 2 oder 3 angegeben haben.

```r
# Zufriedenheit mit der Demokratie: erst ungewichtet, dann gewichtet
allbus %>%
  frequency(ps03)

allbus %>%
  frequency(ps03, weights = wghtpew)
```

Bild am Schritt `s6-cum-lesen` (Tabelle mit hervorgehobenen Zellen, konstruiert): eine kleine Häufigkeitstabelle mit vier Zeilen, Codes 1 bis 4, N 10, 30, 40, 20 (zusammen 100), Valid % 10, 30, 40, 20, Cum. % 10, 40, 80, 100. Hervorgehoben (Rahmen in der Baukasten-Markierfarbe): die Zelle Cum. % in Zeile 2 mit „40“ und die Zellen Valid % der Zeilen 1 und 2 (10 und 30), Klammer daneben „10 + 30 = 40: alle mit Code 1 oder 2“. Beschriftung „Beispieltabelle“. Textfassung: „Beispieltabelle mit vier Codes. Valid %: 10, 30, 40, 20. Cum. %: 10, 40, 80, 100. Die 40 in Zeile 2 ist die Summe aus 10 und 30: alle, die Code 1 oder 2 angegeben haben.“

**Schritt 2:** Schau in die Landesteile. Die Vorlage zeigt den Osten (`eastwest == 2`). Führe sie aus, dann tausche beide markierten Stellen gegen 1 (Westen) und führe sie noch einmal aus. Beide Stellen müssen gleich sein. (Schild: „`filter()`: kennst du aus Sitzung 2“.)

```r
# Nur ein Landesteil (1 = West, 2 = Ost): erst ungewichtet, dann gewichtet
allbus %>%
  filter(eastwest == ⟦2⟧) %>%
  frequency(ps03)

allbus %>%
  filter(eastwest == ⟦2⟧) %>%
  frequency(ps03, weights = wghtpew)
```

Markierte Stellen als Liste (Barrierefreiheit): Zeile 3 und Zeile 7, jeweils `2`.

**Schritt 3 (Deuten):** Vergleiche: Wie stark ändert das Gewicht die Zahl im Osten, wie stark für ganz Deutschland? Die Fragen unten führen dich hin.

**Antwortfragen A1**

| id | Art | Label | Optionen | Ziel | Toleranz | Text richtig | Text falsch / Hinweis | Hilfezeile |
|---|---|---|---|---|---|---|---|---|
| a1-ungewichtet | number | Wie viel Prozent sind ohne Gewicht mindestens etwas zufrieden (Codes 1 bis 3)? | – | 70.73 | 0,1 | Stimmt: 70,73 % haben 1, 2 oder 3 angegeben. | Lies in der ersten Tabelle von Schritt 1 die Spalte Cum. % in der Zeile 3 ETWAS ZUFRIEDEN. | Spalte Cum. %, Zeile 3, Tabelle ohne „Weighted“. |
| a1-gewichtet | number | Und mit Gewicht? | – | 73.58 | 0,1 | Stimmt: Mit Gewicht sind es 73,58 %, fast drei Prozentpunkte mehr. | Nimm die zweite Tabelle von Schritt 1, die mit „Weighted“ in der Überschrift. | Spalte Cum. %, Zeile 3, Tabelle mit „Weighted“. |
| a1-ost | number | Wie viel Prozent sind im Osten mindestens etwas zufrieden? | – | 58.5 | 0,1 | Stimmt: Im Osten sind es 58,5 % (ohne Gewicht 58,45, mit Gewicht 58,56). Das Gewicht ändert hier fast nichts. | Führe Schritt 2 mit `eastwest == 2` aus und lies Cum. % in Zeile 3. | Aus Schritt 2, `eastwest == 2`. Ob mit oder ohne Gewicht, zählt hier nicht. |
| a1-west | number | Und im Westen? | – | 76.6 | 0,1 | Stimmt: Im Westen sind es 76,6 %, gut 18 Prozentpunkte mehr als im Osten. | Tausche in Schritt 2 beide markierten Stellen gegen 1 und lies Cum. % in Zeile 3. | Aus Schritt 2, `eastwest == 1`. |
| a1-warum | choice | Warum steigt der Anteil der Zufriedenen mit Gewicht? | a) „Im Osten sind weniger Menschen zufrieden, und mit Gewicht zählt der Osten nur so viel, wie es seinem Anteil an der Bevölkerung entspricht.“ b) „Das Gewicht macht die Antworten jeder Person etwas zufriedener.“ c) „Mit Gewicht zählen mehr Befragte, darum wird das Ergebnis höher.“ | a | – | Genau. Ohne Gewicht stammt ein Drittel der Antworten aus dem Osten, mit Gewicht nur ein Sechstel. Weil der Osten weniger zufrieden ist (58,5 % gegen 76,6 %), steigt der Anteil für ganz Deutschland. | Vergleiche Ost und West aus Schritt 2: Wer ist zufriedener? Und welcher Landesteil zählt mit Gewicht weniger? Das Gewicht ändert keine Antwort und keine Personenzahl. | – |

Prüfknopf „Antworten prüfen“; Rückmeldung je Frage per aria-live, mit dem zitierten Tipp aus „Erst festlegen“.

**Hilfe, Stufe 1 (Denkanstoß):** Cum. % zählt von oben nach unten zusammen. In Zeile 3 stehen alle, die 1, 2 oder 3 angegeben haben. Mit Gewicht zählt eine Person aus dem Westen 1,22-fach, eine aus dem Osten 0,53-fach.

**Hilfe, Stufe 2 (Wo schaue ich?):** Schritt 1 gibt zwei Tabellen untereinander: erst ohne Gewicht, dann mit der Überschrift „Weighted Frequency Analysis Results“. Für Ost und West nimmst du Schritt 2, einmal mit 2 und einmal mit 1 in beiden markierten Stellen.

**Hilfe, Stufe 3 (Lösung):** Ohne Gewicht sind 70,73 % mindestens etwas zufrieden, mit Gewicht 73,58 %. Im Osten sind es 58,45 % (mit Gewicht 58,56 %), im Westen 76,64 % (mit Gewicht 76,63 %). Ohne Gewicht stammt knapp ein Drittel der gültigen Antworten aus dem Osten (32,5 %), mit Gewicht etwa ein Sechstel (16,9 %). Darum rückt die Zahl für Deutschland näher an den Westen: 0,831 × 76,63 + 0,169 × 58,56 = 73,6 %. Für einen Bericht über Deutschland gilt: 73,6 % sind mindestens etwas zufrieden (ALLBUS 2023, gewichtet).

**Ohne Grafik lösbar:** Alle Antworten stehen in den Tabellen von `frequency()`.

**Weiterdenken in der Probier-Werkstatt (für die Aufgabe nicht nötig, zugeklappt):** „Für die Aufgabe reichen die Vorlagen oben. Eine Idee: Ändert die Gewichtung auch Mittelwert und Median? Die Probier-Werkstatt startet mit einem Vorschlag.“

```r
# Eine Idee: Ändert die Gewichtung auch Mittelwert und Median?
allbus %>%
  describe(ps03)

allbus %>%
  describe(ps03, weights = wghtpew)
```

(Ergebnis zur Kontrolle, nicht abgefragt: Mittelwert 2,938 ohne, 2,840 mit Gewicht; Median 3 ohne, 2 mit Gewicht.)

---

## 5. Thema 2: Kategorien ohne Reihenfolge: χ², Phi und Cramér-V

### Grundlage 2: Zusammenhang in der Kreuztabelle (etwa 15 Minuten)

Einleitungssatz: Wann hängen zwei Merkmale zusammen, und wie macht man daraus eine Zahl? Drei Schritte, ein konstruiertes Beispiel mit 100 Befragten, das ungefähr wie Deutschland verteilt ist.

#### 2a Was wäre, wenn es keinen Zusammenhang gäbe? (Im Bild, interaktiv)

**Schild:** „Kreuztabelle und Zeilenprozente: kennst du aus Sitzung 5“.

**Beispiel zuerst:** Zum Beispiel 100 Befragte: 80 aus dem Westen, 20 aus dem Osten. Im Westen gehören 28 keiner Konfession an (35 %), im Osten 16 (80 %). Insgesamt sind es 44 von 100.

**Interaktion `s6-erwartet` (Tabelle mit hervorgehobenen Zellen):** Vierfeldertafel, Zeilen West (80) und Ost (20), Spalten „Mitglied“ und „keine“, Ränder 56 und 44, Gesamt 100. Drei Knöpfe (Umschalter, aria-pressed):
- „beobachtet“: Zellen 52, 28 / 4, 16. Satz: „So sind die 100 Befragten verteilt.“
- „erwartet ohne Zusammenhang“: Zellen 44,8, 35,2 / 11,2, 8,8. Satz: „Gäbe es keinen Zusammenhang, wären im Osten genauso viele ohne Konfession wie insgesamt: 44 %. Von 20 Befragten wären das 8,8.“ Unter der Tafel die Rechenregel als Bausteine: [erwartet] = [Zeilensumme] mal [Spaltensumme] geteilt durch [alle]; Beispiel Ost, keine: 20 × 44 / 100 = 8,8.
- „Abweichung“ (beobachtet minus erwartet): West, Mitglied +7,2; West, keine −7,2; Ost, Mitglied −7,2; Ost, keine +7,2. Satz: „Im Osten sind 7,2 Personen mehr ohne Konfession, als man ohne Zusammenhang erwarten würde. Die Abweichungen gleichen sich in jeder Zeile und Spalte aus.“
Farben: beobachtet orange (ROLE.data), erwartet türkis (ROLE.model), Abweichung als Zahl mit Pfeil nach oben/unten (nicht nur Farbe).
Textfassung: alle drei Tafeln als Tabellen mit Überschrift.

**Kurz überlegen (Frage `g2a`, Zahl):** „Wie viele Befragte aus dem Osten ohne Konfession würdest du erwarten, wenn Region und Konfession nichts miteinander zu tun hätten?“ Hilfezeile: „Zeilensumme Ost mal Spaltensumme ‚keine‘ geteilt durch alle 100.“ Ziel 8,8, Toleranz 0,05. Richtig: „Stimmt: 20 × 44 / 100 = 8,8. Beobachtet sind 16, fast doppelt so viele.“ Falsch: „Ohne Zusammenhang hätte der Osten denselben Anteil wie alle: 44 % von 20 Befragten.“ Die Frage steht über der Tafel; die Knöpfe sind trotzdem frei bedienbar.

**Kurz gesagt:** Zwei Merkmale hängen zusammen, wenn die Verteilung des einen in den Gruppen des anderen verschieden ist. Ohne Zusammenhang (Fachbegriff: statistische Unabhängigkeit) hätte jede Gruppe dieselben Prozente wie alle zusammen; daraus ergeben sich die erwarteten Häufigkeiten.

**Häufige Verwechslung:** Erwartete Häufigkeiten sind keine Vorhersage, wie es sein sollte. Sie sind ein Vergleichsbild: so sähe die Tabelle aus, wenn es keinen Zusammenhang gäbe.

#### 2b Formel lesen lernen: von χ² zu Phi und Cramér-V (Im Bild)

**Schild:** „χ²: kennst du aus Sitzung 5 (Überblick, als Test)“. Anschlusssatz unter dem Schild: „In Sitzung 5 stand neben χ² schon eine Zahl V. Heute siehst du, wie sie entsteht.“

**Bild `s6-chi-bausteine` (Formel als Bausteine, vier Schritte untereinander, je ein Stein mit Schrittnummer über dem Zeichen, kein „·“ zwischen Nummer und Zeichen):**
- Schritt 1, Abweichung: beobachtet minus erwartet, je Zelle: +7,2; −7,2; −7,2; +7,2.
- Schritt 2, quadrieren und durch erwartet teilen: 51,84 / 44,8 = 1,16 (West, Mitglied); 51,84 / 35,2 = 1,47 (West, keine); 51,84 / 11,2 = 4,63 (Ost, Mitglied); 51,84 / 8,8 = 5,89 (Ost, keine). Merksatz am Stein: „Durch erwartet teilen: Dieselbe Abweichung wiegt in einer kleinen Zelle schwerer.“
- Schritt 3, zusammenzählen: χ² = 1,16 + 1,47 + 4,63 + 5,89 = 13,15 (gesprochen „Chi-Quadrat“).
- Schritt 4, durch die Zahl der Befragten teilen und die Wurzel ziehen: Phi = √(13,15 / 100) = 0,36.
- Daneben, als fünfter Stein für größere Tabellen: Cramér-V = √(χ² / (n × (kleinere Zahl von Zeilen und Spalten − 1))). Bei zwei Zeilen ist die Klammer 1, darum ist V hier gleich Phi: 0,36.
Textfassung: dieselben fünf Schritte als nummerierte Liste mit allen Zahlen; die Formeln vorlesbar („V gleich Wurzel aus Chi-Quadrat geteilt durch n mal, in Klammern, kleinere Zahl von Zeilen und Spalten minus 1“).

**Kurz gesagt:** χ² misst, wie weit eine Kreuztabelle von „kein Zusammenhang“ entfernt ist. Phi (für Vierfeldertafeln) und Cramér-V (für Tabellen jeder Größe) machen daraus eine Zahl zwischen 0 und 1: 0 heißt kein Zusammenhang, 1 heißt vollständiger Zusammenhang. Für die Stärke zählt diese Zahl ohne Vorzeichen.

**Genauer erklärt: Warum teilt man durch n, und wozu die Klammer?** χ² wächst mit der Zahl der Befragten: Mit 200 statt 100 Befragten und denselben Prozenten verdoppelt es sich auf 26,30, der Zusammenhang ist aber derselbe. Phi und V teilen durch n und bleiben bei 0,36. Die Klammer (kleinere Zahl von Zeilen und Spalten minus 1) sorgt bei größeren Tabellen dafür, dass V nicht über 1 steigt. Echte Zahlen für Deutschland (gewichtet): Phi für „keine Konfession ja/nein“ und Region 0,33; Cramér-V für vier Konfessionsgruppen (evangelisch, katholisch, andere, keine) und Region 0,34. Ohne Gewicht wären es 0,41 und 0,42: V hängt auch davon ab, wie groß die Gruppen sind, und ohne Gewicht ist der Osten fast doppelt so groß. Für Aussagen über Deutschland gilt der gewichtete Wert. Prozente zur Konfession (gewichtet): Westen 28,4 % evangelisch, 31,0 % katholisch, 7,0 % andere, 33,7 % keine; Osten 14,7 %, 4,7 %, 3,0 %, 77,5 %.
→ In der freien Karte: χ² Schritt für Schritt (Begriff `chi_square`), Cramér-V (Begriff `cramers_v`).

**Genauer erklärt: Warum zeigt R bei Phi manchmal ein Minus?** Aus χ² gerechnet ist Phi nie negativ. `phi()` in R rechnet bei einer Vierfeldertafel aber mit einer gleichwertigen Formel, die zusätzlich ein Vorzeichen liefert; der Wert liegt dann zwischen −1 und +1. Plus heißt: Der jeweils größere Code der einen Variable kommt häufiger mit dem größeren Code der anderen vor; Minus heißt: mit dem kleineren. Tauschst du die Codes einer Variable, dreht sich das Vorzeichen, die Stärke bleibt. Für die Stärke liest du darum den Betrag (−0,15 ist so stark wie 0,15); welche Gruppen zusammengehören, liest du an den Prozenten der Kreuztabelle ab. Cramér-V hat nie ein Vorzeichen; bei zwei mal zwei Kategorien ist V gleich dem Betrag von Phi.

**Häufige Verwechslung:** „V = 0,36 heißt: 36 % hängen zusammen.“ V ist kein Prozentwert. Es sagt nur, wie stark die Tabelle von „kein Zusammenhang“ abweicht, auf einer Skala von 0 bis 1.

#### 2c Wie stark ist stark? (Im Bild)

**Bild `s6-lineal-staerke` (Achse):** waagrechtes Lineal von 0 bis 1 mit Teilstrichen bei 0,1, 0,3 und 0,5. Abschnitte beschriftet: „unter 0,1: kein oder sehr schwacher Zusammenhang“, „ab 0,1: schwach“, „ab 0,3: mittel“, „ab 0,5: stark“. Eine Marke bei 0,33 „Konfession und Region (Phi, gewichtet)“. Abschnitte in einer geordneten Farbreihe (hell nach dunkel), Beschriftung immer als Text.
Textfassung: „Faustregel für die Stärke: unter 0,1 kein oder sehr schwacher Zusammenhang, ab 0,1 schwach, ab 0,3 mittel, ab 0,5 stark. Konfession und Region: Phi 0,33, also mittel.“

**Kurz überlegen (Frage `g2c`, Auswahl):** „Phi für Konfession und Region ist 0,33. Wie stark ist der Zusammenhang nach der Faustregel?“ Optionen: schwach / mittel / stark. Ziel: mittel. Richtig: „Ja: 0,33 liegt knapp über 0,3, also mittel.“ Falsch: „Schau aufs Lineal: Ab 0,3 beginnt ‚mittel‘, ab 0,5 ‚stark‘.“

**Kurz gesagt:** Für die Stärke gibt es eine Faustregel (nach Cohen): ab 0,1 schwach, ab 0,3 mittel, ab 0,5 stark. Sie gilt für Cramér-V, Phi, Tau-b, Spearman-ρ und Pearson-r.

**Genauer erklärt: Faustregel mit Augenmaß.** Die Grenzen sind eine Verabredung, kein Naturgesetz. Ob 0,2 „wenig“ ist, hängt von der Frage ab: In den Sozialwissenschaften sind viele wichtige Zusammenhänge schwach. Gamma fällt meist größer aus als die anderen Maße (Thema 3); ordne die Stärke deshalb mit Tau-b ein. Bei Cramér-V passt die Faustregel genau für Tabellen mit nur zwei Zeilen oder zwei Spalten (wie in Aufgabe 2); für größere Tabellen setzt Cohen die Grenzen etwas niedriger an. Dieselbe Faustregel steht im R-Workshop, Kapitel 7.

**Häufige Verwechslung:** Ein großer Zusammenhang ist nicht automatisch ein wichtiger, und ein kleiner nicht automatisch unwichtig. Die Faustregel ordnet nur die Größe ein.

„Schon klar? Direkt zu Aufgabe 2 ↓“

### Aufgabe 2: Zufriedenheit und Wahlabsicht (Pflicht)

↑ Grundlage 2 nachlesen

**Leitfrage:** Hängt die Zufriedenheit mit der Demokratie damit zusammen, welche Partei jemand wählen würde?

**Ziel:** Am Ende kannst du mit Zeilenprozenten zeigen, in welchen Gruppen die Zufriedenheit hoch oder niedrig ist, und mit Cramér-V sagen, wie stark der Zusammenhang ist. Grundlage: Grundlage 2, χ², Phi und Cramér-V.

**Einleitung:** Die Wahlabsicht (`pv01`) fragt, welche Partei jemand bei einer Bundestagswahl wählen würde. Die Antworten: CDU-CSU, SPD, FDP, DIE GRUENEN, DIE LINKE, AFD, ANDERE PARTEI, WUERDE NICHT WAEHLEN. Wer nicht wahlberechtigt ist oder nichts angibt, fehlt. Die Zufriedenheit (`ps03`) teilst du wie in Aufgabe 1 in zwei Gruppen: zufrieden (1 bis 3) und unzufrieden (4 bis 6).

**Erst festlegen (Frage `a2-tipp`):** „Wie stark ist der Zusammenhang zwischen Wahlabsicht und Zufriedenheit wohl?“ Optionen: „kein oder sehr schwach (unter 0,1)“ / „schwach (0,1 bis 0,3)“ / „mittel (0,3 bis 0,5)“ / „stark (ab 0,5)“. Beim Prüfen zitiert: „Dein Tipp war: … R ergibt V = 0,48: mittel, knapp unter stark.“

**Schritt 1:** Welches Skalenniveau hat die Wahlabsicht? Beantworte zuerst die Frage `a2-niveau` unten. Davon hängt ab, welches Maß passt.

**Schritt 2:** Teile die Zufriedenheit in zwei Gruppen und lass dir die Kreuztabelle mit Zeilenprozenten ausgeben, gewichtet. Die Kette bildet zuerst mit `mutate()` und `rec()` die neue Variable `zufrieden` (1 bis 3 zufrieden, 4 bis 6 unzufrieden; Schild: „`mutate()` mit `rec()`: kennst du aus Sitzung 5“) und reicht sie dann an `crosstab()` weiter (Schild: „`crosstab()`: kennst du aus Sitzung 5“, neu nur `weights = wghtpew`). Jede Wahlabsicht hat zwei Zeilen: oben die Anzahl (gewichtet, also Summe der Gewichte), darunter „row %“. In der Spalte „zufrieden“ steht in der Zeile „row %“, wie viel Prozent dieser Gruppe mindestens etwas zufrieden sind. Die Wahlabsicht steht in den Zeilen und ist hier die Gruppe, die du vergleichst; darum Zeilenprozente (kennst du aus Sitzung 5).

```r
# Zufriedenheit in zwei Gruppen (1 bis 3 zufrieden, 4 bis 6 unzufrieden),
# dann Anteil Zufriedener je Wahlabsicht (Zeilenprozente), gewichtet
allbus %>%
  mutate(
    zufrieden = rec(ps03, rules = "1:3=1 [zufrieden]; 4:6=0 [unzufrieden]; else=NA")
  ) %>%
  crosstab(pv01, zufrieden, percentages = "row", weights = wghtpew)
```

**Schritt 3:** Fass die ganze Tabelle in einer Zahl zusammen: Cramér-V, gewichtet. Neu heute: `cramers_v()`. Jede Werkstatt beginnt mit dem frisch geladenen `allbus`; darum bildet die Vorlage `zufrieden` noch einmal genauso wie in Schritt 2.

```r
# Cramér-V für Wahlabsicht und Zufriedenheit, gewichtet
# (zwei Gruppen bilden: kennst du aus Schritt 2)
allbus %>%
  mutate(
    zufrieden = rec(ps03, rules = "1:3=1 [zufrieden]; 4:6=0 [unzufrieden]; else=NA")
  ) %>%
  cramers_v(pv01, zufrieden, weights = wghtpew)
```

Hinweis am Schritt: „R gibt nur eine Zahl aus, zum Beispiel `[1] 0.1234567`. Lies sie mit drei Nachkommastellen.“ (Beispielzahl bewusst nicht die Lösung.)

**Antwortfragen A2**

| id | Art | Label | Optionen | Ziel | Toleranz | Text richtig | Text falsch / Hinweis | Hilfezeile |
|---|---|---|---|---|---|---|---|---|
| a2-niveau | choice | Welches Skalenniveau hat die Wahlabsicht `pv01`? | nominal / ordinal / metrisch | nominal | – | Genau: Parteien haben keine Reihenfolge. Darum passt Cramér-V. | Lässt sich „SPD“ sinnvoll über oder unter „FDP“ einordnen? Kategorien ohne Reihenfolge heißen nominal. | – |
| a2-gruene | number | Wie viel Prozent derer, die die Grünen wählen würden, sind mindestens etwas zufrieden? | – | 92.9 | 0,1 | Stimmt: 92,9 %. | Lies in Schritt 2 die Zeile DIE GRUENEN, darunter „row %“, Spalte zufrieden. | Zeile DIE GRUENEN, Zeile „row %“, Spalte zufrieden. |
| a2-afd | number | Und unter denen, die die AfD wählen würden? | – | 22.8 | 0,1 | Stimmt: 22,8 %. Zwischen den Gruppen liegen 70 Prozentpunkte. | Lies in Schritt 2 die Zeile AFD, darunter „row %“, Spalte zufrieden. | Zeile AFD, Spalte zufrieden. |
| a2-v | number | Wie groß ist Cramér-V (gewichtet)? | – | 0.4783 | 0,005 | Stimmt: V = 0,478. | Führe Schritt 3 aus und lies die Zahl hinter `[1]`. Hast du `weights = wghtpew` drin? Ohne Gewicht kommt 0,484 heraus. | Drei Nachkommastellen, zum Beispiel 0,123. |
| a2-staerke | choice | Wie stark ist der Zusammenhang nach der Faustregel? | schwach / mittel / stark | mittel | – | Ja: 0,48 liegt zwischen 0,3 und 0,5, also mittel, knapp unter stark. | Schau aufs Lineal aus Grundlage 2c: ab 0,3 mittel, ab 0,5 stark. | – |
| a2-richtung | choice | Was sagt dir V über die Richtung des Zusammenhangs? | a) „Nichts. Wer zufriedener ist, liest du an den Zeilenprozenten ab.“ b) „V ist positiv, also sind Wählende weiter rechts zufriedener.“ c) „V ist kleiner als 0,5, also sind die meisten unzufrieden.“ | a | – | Genau: V hat kein Vorzeichen, und bei Parteien gibt es kein „höher“. Wo die Zufriedenheit hoch oder niedrig ist, zeigen die Zeilenprozente. | Bei nominalen Merkmalen gibt es keine Reihenfolge, also auch kein „je mehr, desto …“. V misst nur die Stärke. | – |

**Hilfe, Stufe 1 (Denkanstoß):** Parteien haben keine Reihenfolge, darum misst du mit Cramér-V. V sagt, wie stark sich die Prozente zwischen den Gruppen unterscheiden. Wo die Unterschiede liegen, steht in der Kreuztabelle.

**Hilfe, Stufe 2 (Wo schaue ich?):** Die Prozente für die Grünen und die AfD stehen in Schritt 2, jeweils in der Zeile „row %“ unter dem Parteinamen, in der Spalte zufrieden. V steht in Schritt 3 hinter `[1]`.

**Hilfe, Stufe 3 (Lösung):** Die Wahlabsicht ist nominal, also Cramér-V. Mindestens etwas zufrieden sind (gewichtet): Grüne 92,9 %, SPD 87,2 %, FDP 80,7 %, CDU-CSU 79,5 %, Linke 61,6 %, andere Partei 51,6 %, würde nicht wählen 50,7 %, AfD 22,8 %; alle zusammen 74,8 % (mehr als die 73,6 % aus Aufgabe 1, weil hier nur Befragte mit gültiger Wahlabsicht zählen). Cramér-V = 0,478, nach der Faustregel ein mittlerer Zusammenhang, knapp unter stark. V hat keine Richtung; dass die Zufriedenheit bei Grünen- und SPD-Wählenden hoch und bei AfD-Wählenden niedrig ist, liest du an den Zeilenprozenten ab.

**Ohne Grafik lösbar:** ja, alles steht in Tabelle und Zahl.

**Fürs Plenum:** „V = 0,48 ist ein deutlicher Zusammenhang. Heißt das, die Wahlabsicht macht zufrieden oder unzufrieden, oder könnte es auch umgekehrt sein? Bringt einen Satz mit.“

**Weiterdenken in der Probier-Werkstatt (für die Aufgabe nicht nötig):** „Eine Idee: Wie unterscheiden sich West und Ost, und was sagt Phi dazu? Bei einer Vierfeldertafel zeigt `phi()` ein Vorzeichen (Grundlage 2b); für die Stärke zählt der Betrag.“

```r
# Eine Idee: Zufriedenheit nach Landesteil, eine Vierfeldertafel mit Phi
allbus <- allbus %>%
  mutate(
    zufrieden = rec(ps03, rules = "1:3=1 [zufrieden]; 4:6=0 [unzufrieden]; else=NA")
  )

allbus %>%
  crosstab(eastwest, zufrieden, percentages = "row", weights = wghtpew)

allbus %>%
  phi(eastwest, zufrieden, weights = wghtpew)
```

(Kontrolle, nicht abgefragt: West 76,6 % zufrieden, Ost 58,6 %; Phi = −0,153, Betrag 0,153, also schwach; `cramers_v()` gibt hier 0,153 ohne Minus. Das Minus heißt: Der größere Code von `eastwest` (2, Ost) kommt häufiger mit dem kleineren Code von `zufrieden` (0, unzufrieden) vor. Hätte „unzufrieden“ den Code 1 und „zufrieden“ 0, stünde dort +0,153.)

---

## 6. Thema 3: Geordnete Stufen: Gamma und Tau-b

### Grundlage 3: Paare vergleichen (etwa 15 Minuten)

Einleitungssatz: Wenn beide Merkmale eine Reihenfolge haben, kann man mehr sagen als „hängt zusammen“: in welche Richtung. Drei Schritte.

#### 3a Gleichläufig oder gegenläufig? (Im Bild, interaktiv)

**Beispiel zuerst:** Zum Beispiel fünf Befragte, A bis E. Jede Person stuft ihre Schicht ein (1 Unterschicht, 2 Arbeiterschicht, 3 Mittelschicht, 4 obere Mittelschicht) und ihre Gesundheit (1 schlecht, 2 weniger gut, 3 zufriedenstellend, 4 gut). A: Schicht 1, Gesundheit 1. B: 2 und 3. C: 3 und 2. D: 3 und 4. E: 4 und 3.

**Interaktion `s6-paare` (Paar-Zähler):** Links ein Raster, x-Achse Schicht 1–4, y-Achse Gesundheit 1–4, die fünf Personen als beschriftete Steine an ihren Plätzen. Rechts die zehn Paare als Knöpfe (AB, AC, AD, AE, BC, BD, BE, CD, CE, DE). Wählt man ein Paar, werden beide Steine hervorgehoben und mit einer Linie verbunden; darunter drei Knöpfe zum Einordnen: „gleichläufig“, „gegenläufig“, „Gleichstand“. Rückmeldung (aria-live) und Zähler oben (gleichläufig, gegenläufig, Gleichstand bei Schicht, Gleichstand bei Gesundheit). Knopf „Alle zeigen“ ordnet alle ein.
Lösung je Paar mit Rückmeldesatz:
- AB, AC, AD, AE, BD, CE: gleichläufig. Satz (Beispiel AB): „B hat die höhere Schicht und die bessere Gesundheit: gleichläufig.“
- BC: gegenläufig. „C hat die höhere Schicht, aber die schlechtere Gesundheit: gegenläufig.“
- DE: gegenläufig. „E hat die höhere Schicht, aber die schlechtere Gesundheit: gegenläufig.“
- CD: Gleichstand bei der Schicht. „C und D haben dieselbe Schicht: Gleichstand, keine Richtung erkennbar.“
- BE: Gleichstand bei der Gesundheit. „B und E haben dieselbe Gesundheit: Gleichstand.“
Falsche Wahl: „Vergleiche zuerst die Schicht: Wer liegt höher? Hat diese Person auch die bessere Gesundheit?“
Endstand: 6 gleichläufig, 2 gegenläufig, 1 Gleichstand bei der Schicht, 1 bei der Gesundheit.
Textfassung: die fünf Personen als Liste mit Werten, dann die zehn Paare mit Einordnung, dann der Endstand.

**Kurz gesagt:** Gamma und Tau-b vergleichen Paare von Befragten. Gleichläufig (Fachbegriff: konkordant): Wer bei einem Merkmal höher liegt, liegt auch beim anderen höher. Gegenläufig (diskordant): umgekehrt. Gleichstand (Bindung): Beide liegen bei mindestens einem Merkmal gleich hoch.

**Häufige Verwechslung:** „Gleichläufig“ heißt nicht „gleiche Werte“. B (2 und 3) und D (3 und 4) sind gleichläufig, obwohl keine Zahl gleich ist: D liegt bei beiden höher.

#### 3b Formel lesen lernen: Gamma und Tau-b (Im Bild)

**Bild `s6-gamma-bausteine` (Formel als Bausteine, zwei Formeln untereinander):**
- Gamma = [gleichläufig − gegenläufig] geteilt durch [gleichläufig + gegenläufig] = (6 − 2) / (6 + 2) = 4 / 8 = 0,5. Merksatz am Nenner: „Paare mit Gleichstand fallen weg.“
- Tau-b = [gleichläufig − gegenläufig] geteilt durch √( [gleichläufig + gegenläufig + Gleichstand nur bei der Schicht] × [gleichläufig + gegenläufig + Gleichstand nur bei der Gesundheit] ) = 4 / √(9 × 9) = 4 / 9 = 0,44. Merksatz am Nenner: „Paare mit Gleichstand zählen mit.“
- Rand: „Zähler: Überwiegen die gleichläufigen Paare, wird das Maß positiv, überwiegen die gegenläufigen, negativ.“
Textfassung: beide Formeln vorlesbar, dann die eingesetzten Zahlen, dann die Merksätze.

**Kurz überlegen (Frage `g3b`, Zahl):** „In einer Tabelle gibt es 30 gleichläufige und 10 gegenläufige Paare, dazu 20 Paare mit Gleichstand. Wie groß ist Gamma?“ Hilfezeile: „Gleichläufig minus gegenläufig, geteilt durch gleichläufig plus gegenläufig.“ Ziel 0,5, Toleranz 0,01. Richtig: „Stimmt: (30 − 10) / (30 + 10) = 0,5. Die 20 Paare mit Gleichstand spielen für Gamma keine Rolle; Tau-b wäre kleiner.“ Falsch: „Die Paare mit Gleichstand gehören bei Gamma nicht in den Nenner: (30 − 10) / (30 + 10).“

**Kurz gesagt:** Gamma (Fachbegriff: Goodman-Kruskal-Gamma) und Tau-b (Kendall-Tau-b) reichen von −1 bis +1. Gamma lässt Paare mit Gleichstand weg, Tau-b zählt sie im Nenner mit. Darum ist Tau-b dem Betrag nach nie größer als Gamma, meist deutlich kleiner.

**Genauer erklärt: Echte Zahlen und warum Gleichstände so wichtig sind.** Bei Variablen mit wenigen Stufen haben sehr viele Paare einen Gleichstand: Von Tausenden Befragten mit „Mittelschicht“ liegt jedes Paar bei der Schicht gleich auf. Gamma übergeht all diese Paare und fällt deshalb groß aus. Im ALLBUS (gewichtet) hängen Schicht und Gesundheit so zusammen: Gamma 0,36, Tau-b 0,24, wenn die Gesundheit so gepolt ist, dass ein höherer Code „besser“ heißt (warum das fürs Vorzeichen wichtig ist, zeigt 3c). Unter denen, die sich der Unterschicht zurechnen, beurteilen 22,9 % ihre Gesundheit als gut oder sehr gut, in der Arbeiterschicht 45,3 %, in der Mittelschicht 58,9 %, in der oberen Mittelschicht 76,8 %, in der Oberschicht 72,6 % (nur 62 Befragte, gewichtet). Spearman-ρ passt ebenfalls zu geordneten Stufen; es kommt in Thema 4.
Bild `s6-schicht-stapel` (Balken auf 100 %, waagrecht): je Schicht ein Balken, unterteilt in die fünf Gesundheitsstufen von „schlecht“ (links) bis „sehr gut“ (rechts), Farbreihe `ordered(5)` von rot nach grün; Werte (Prozent, gewichtet), von schlecht bis sehr gut: Unterschicht 17,6, 34,6, 24,9, 14,1, 8,8 (n = 205); Arbeiterschicht 5,6, 17,0, 32,2, 34,2, 11,1 (n = 1.153); Mittelschicht 2,3, 9,9, 28,9, 42,7, 16,2 (n = 2.862); obere Mittelschicht 1,4, 3,7, 18,1, 46,8, 30,0 (n = 871); Oberschicht 0,0, 3,2, 24,2, 33,9, 38,7 (n = 62). Bildunterschrift: „ALLBUS 2023, gewichtet. Je höher die Schicht, desto größer der grüne Teil.“ Textfassung: die Tabelle mit diesen Werten.
→ In der freien Karte: Gamma (Begriff `goodman_gamma`), Tau-b (Begriff `kendall_tau`).

**Häufige Verwechslung:** „Gamma ist größer, also ist Gamma besser.“ Gamma ist nur großzügiger, weil es Gleichstände weglässt. Vergleiche nie Gamma des einen mit Tau-b des anderen Zusammenhangs.

#### 3c Richtung: Das Vorzeichen hängt an der Kodierung (Deuten, interaktiv)

**Beispiel zuerst:** Im Datensatz heißt bei der Gesundheit (`hs01`) die 1 „sehr gut“ und die 5 „schlecht“: Ein höherer Code ist also eine schlechtere Gesundheit. Bei der Schicht (`id02`) heißt ein höherer Code eine höhere Schicht.

**Interaktion `s6-richtung` (Schalter):** Umschalter mit zwei Stellungen (aria-pressed): „Gesundheit wie im Datensatz (1 = sehr gut)“ und „Gesundheit umgedreht (höher = besser)“. Angezeigt: Gamma und Tau-b als Marken auf einem Lineal von −1 bis +1, dazu ein Satz.
- Stellung „wie im Datensatz“: Gamma −0,36, Tau-b −0,24. Satz: „Negativ: Höhere Schicht geht mit kleineren Gesundheitscodes einher. Kleinere Codes heißen hier bessere Gesundheit.“
- Stellung „umgedreht“: Gamma +0,36, Tau-b +0,24. Satz: „Positiv: Je höher die Schicht, desto besser im Schnitt die Gesundheit. Derselbe Zusammenhang, nur das Vorzeichen hat sich gedreht.“
Textfassung: beide Stellungen mit Zahlen und Satz.

**Kurz überlegen (Frage `g3c`, Auswahl):** „Gamma für Schicht und Gesundheit ist −0,36, mit der Gesundheit wie im Datensatz (1 = sehr gut, 5 = schlecht). Was heißt das?“ Optionen: a) „Je höher die Schicht, desto besser die Gesundheit.“ b) „Je höher die Schicht, desto schlechter die Gesundheit.“ c) „Es gibt keinen Zusammenhang, weil das Vorzeichen negativ ist.“ Ziel: a. Richtig: „Genau: Ein höherer Schichtcode geht mit kleineren Gesundheitscodes zusammen, und klein heißt hier gut.“ Falsch: „Lies die Codes: Bei der Gesundheit heißt ein kleinerer Code ‚besser‘. Negativ heißt: höhere Schicht, kleinerer Code.“

**Kurz gesagt:** Der Betrag sagt, wie stark ein Zusammenhang ist; das Vorzeichen sagt, in welche Richtung. Positiv: Höhere Codes gehen mit höheren Codes einher. Negativ: Höhere Codes gehen mit niedrigeren einher. Was „höher“ inhaltlich heißt, steht im Codebuch. Damit Sätze leicht fallen, polt man Variablen oft um, sodass ein höherer Code „mehr“ oder „besser“ heißt (Umpolen kennst du aus Sitzung 5).

**Genauer erklärt: Gamma braucht eine sinnvolle Reihenfolge.** Bei nominalen Merkmalen ist jede Reihenfolge willkürlich, und Gamma hängt davon ab. Beispiel Konfession und Gesundheit (gewichtet): In der Reihenfolge evangelisch, katholisch, andere, keine ist Gamma 0,04; in der Reihenfolge keine, evangelisch, katholisch, andere 0,01; in der Reihenfolge katholisch, keine, andere, evangelisch −0,03. Cramér-V bleibt in allen drei Fällen 0,045. Darum gilt: Gamma und Tau-b nur, wenn beide Merkmale eine Reihenfolge haben.

**Häufige Verwechslung:** „Negativ heißt schwach.“ Nein: −0,42 ist ein stärkerer Zusammenhang als +0,30. Für die Stärke zählt der Betrag.

„Schon klar? Direkt zu Aufgabe 3 ↓“

### Aufgabe 3: Wirtschaftslage und Demokratie (Pflicht)

↑ Grundlage 3 nachlesen

**Leitfrage:** Sind Menschen, die die Wirtschaftslage in Deutschland schlechter einschätzen, unzufriedener mit der Demokratie?

**Ziel:** Am Ende kannst du Gamma und Tau-b für zwei geordnete Merkmale ausrechnen, Stärke und Richtung in einem Satz sagen und erklären, warum Gamma größer ausfällt. Grundlage: Grundlage 3, Gamma und Tau-b.

**Einleitung:** Die Wirtschaftslage in Deutschland (`ep01`; Schild: „kennst du aus Sitzung 5, Grundlage Umpolen“) hat fünf Stufen: 1 sehr gut, 2 gut, 3 teils/teils, 4 schlecht, 5 sehr schlecht. Ein höherer Code heißt also: schlechter eingeschätzt. Diesmal bleibt `ep01`, wie es ist. Die Zufriedenheit mit der Demokratie (`ps03`) polst du zuerst um, damit ein höherer Code „zufriedener“ heißt. Beide Merkmale haben eine Reihenfolge, aber keine sicher gleichen Abstände: ordinal.

**Erst festlegen (Frage `a3-tipp`):** „Welches Vorzeichen erwartest du? Höhere Codes heißen bei der Zufriedenheit ‚zufriedener‘ (nach dem Umpolen) und bei der Wirtschaftslage ‚schlechter‘.“ Optionen: „positiv“ / „negativ“ / „etwa 0“. Beim Prüfen zitiert: „Dein Tipp war: … Gamma ist −0,54: negativ.“

**Schritt 1:** Pole die Zufriedenheit um und prüfe es (Schild: „`rules = "rev"`: kennst du aus Sitzung 5“). In der Kontrolle muss bei Code 6 jetzt SEHR ZUFRIEDEN stehen.

```r
# Zufriedenheit umpolen: höher heißt jetzt zufriedener
allbus <- allbus %>%
  mutate(
    zufriedenheit = rec(ps03, rules = "rev")
  )

# Kontrolle: Welches Wort steht jetzt bei Code 6?
allbus %>%
  frequency(zufriedenheit)
```

**Schritt 2:** Rechne Gamma und Tau-b, gewichtet. Neu heute: `goodman_gamma()` und `kendall_tau()`. Jede Werkstatt beginnt mit dem frisch geladenen `allbus`; darum polt die Vorlage oben noch einmal um wie in Schritt 1. Die Ausgabe hat zwei Teile: Zuerst kommt Gamma als einzelne Zahl hinter `[1]`, darunter der Block „Kendall's Tau“ mit der Zeile `tau = …`. Bei Gamma meldet R in Rot „2 cells (6.7%) has expected count < 5 …“: ein Hinweis, kein Fehler.

```r
# Zufriedenheit umpolen: kennst du aus Schritt 1
allbus <- allbus %>%
  mutate(
    zufriedenheit = rec(ps03, rules = "rev")
  )

# Gamma für Zufriedenheit und Wirtschaftslage, gewichtet
allbus %>%
  goodman_gamma(zufriedenheit, ep01, weights = wghtpew)

# Tau-b für dieselben Variablen, gewichtet
allbus %>%
  kendall_tau(zufriedenheit, ep01, weights = wghtpew)
```

Bild am Schritt `s6-vorzeichen-lesen` (Schema, ohne Zahlen der Lösung): zwei senkrechte Pfeile nebeneinander. Links „zufriedenheit“: unten „1 sehr unzufrieden“, oben „6 sehr zufrieden“. Rechts „ep01“: unten „1 sehr gut“, oben „5 sehr schlecht“. Darunter zwei Lesehilfen: „positiv: beide Pfeile gehen zusammen nach oben, also: je schlechter die Lage eingeschätzt wird, desto zufriedener“; „negativ: wenn der eine nach oben geht, geht der andere nach unten, also: je schlechter die Lage eingeschätzt wird, desto unzufriedener“. Textfassung: genau diese Sätze.

**Schritt 3 (Deuten):** Sag in einem Satz, was das Vorzeichen bedeutet, und ordne die Stärke mit Tau-b ein (Fragen unten).

**Antwortfragen A3**

| id | Art | Label | Optionen | Ziel | Toleranz | Text richtig | Text falsch / Hinweis | Hilfezeile |
|---|---|---|---|---|---|---|---|---|
| a3-gamma | number | Wie groß ist Gamma (gewichtet)? | – | -0.5444 | 0,005 | Stimmt: Gamma = −0,544. | Führe Schritt 2 aus und lies die erste Zahl der Ausgabe, hinter `[1]`. Achte auf das Minus. Bei 0,544 ohne Minus: Hast du `ps03` umgepolt und `zufriedenheit` verwendet? Bei −0,553: Da fehlt `weights = wghtpew`. | Mit Vorzeichen und drei Nachkommastellen, zum Beispiel −0,123. |
| a3-tau | number | Wie groß ist Tau-b (gewichtet)? | – | -0.387 | 0,005 | Stimmt: Tau-b = −0,387. | Lies in Schritt 2 im Block „Kendall's Tau“ die Zahl hinter `tau =`. Bei −0,393 fehlt das Gewicht. | Mit Vorzeichen, aus der Zeile `tau = …`. |
| a3-richtung | choice | Welcher Satz beschreibt die Richtung? | a) „Wer die Wirtschaftslage schlechter einschätzt, ist eher unzufriedener mit der Demokratie.“ b) „Wer die Wirtschaftslage schlechter einschätzt, ist eher zufriedener mit der Demokratie.“ c) „Das Minus heißt: Es gibt keinen Zusammenhang.“ | a | – | Genau: Ein höherer Code bei `ep01` (schlechter) geht mit einem niedrigeren Code bei `zufriedenheit` (unzufriedener) einher. | Schau aufs Bild in Schritt 2: Negativ heißt, der eine Pfeil geht hoch, der andere runter. Bei `ep01` heißt höher „schlechter“, bei `zufriedenheit` „zufriedener“. | – |
| a3-staerke | choice | Wie stark ist der Zusammenhang nach der Faustregel (mit Tau-b eingeordnet)? | schwach / mittel / stark | mittel | – | Ja: Der Betrag von Tau-b ist 0,387, also mittel. | Für die Stärke zählt der Betrag, ohne Vorzeichen: 0,387 liegt zwischen 0,3 und 0,5. | – |
| a3-warum | choice | Warum ist Gamma dem Betrag nach größer als Tau-b? | a) „Gamma lässt die vielen Paare mit Gleichstand weg, Tau-b zählt sie mit.“ b) „Gamma rechnet mit Gewicht, Tau-b ohne.“ c) „Gamma misst einen anderen Zusammenhang als Tau-b.“ | a | – | Genau: Bei fünf und sechs Stufen liegen sehr viele Paare bei einem Merkmal gleichauf. Gamma übergeht sie, darum fällt es größer aus. | Schau in Grundlage 3b: Was steht bei Gamma im Nenner, was bei Tau-b? Beide hast du hier gewichtet gerechnet. | – |

**Hilfe, Stufe 1 (Denkanstoß):** Für die Richtung brauchst du die Codes beider Variablen: Was heißt bei `zufriedenheit` ein höherer Code, was bei `ep01`? Für die Stärke zählt nur der Betrag.

**Hilfe, Stufe 2 (Wo schaue ich?):** Gamma steht in der Ausgabe von Schritt 2 hinter `[1]`, Tau-b in der Zeile `tau = …`. Die Codes stehen in der Einleitung und in der Kontrolle von Schritt 1.

**Hilfe, Stufe 3 (Lösung):** Gamma = −0,544, Tau-b = −0,387 (gewichtet; ohne Gewicht −0,553 und −0,393). Negativ: Wer die Wirtschaftslage schlechter einschätzt, ist eher unzufriedener mit der Demokratie. Nach Tau-b ein mittlerer Zusammenhang. Gamma ist größer, weil es die vielen Paare mit Gleichstand weglässt. Zum Ansehen (gewichtet): Mindestens etwas zufrieden sind 95,7 % derer, die die Lage „sehr gut“ finden, 90,1 % bei „gut“, 76,9 % bei „teils/teils“, 45,6 % bei „schlecht“ und 14,0 % bei „sehr schlecht“.

**Ohne Grafik lösbar:** ja; das Bild in Schritt 2 ist auch als Text da.

**Fürs Plenum:** „Für dieselben Daten gibt es −0,54 (Gamma) und −0,39 (Tau-b). Welche Zahl schreibt ihr in einen Bericht, und was muss dazu?“

**Weiterdenken in der Probier-Werkstatt (für die Aufgabe nicht nötig):** „Eine Idee: Hängt die Zufriedenheit genauso stark mit der eigenen wirtschaftlichen Lage zusammen (`ep03`, gleiche Codes wie `ep01`)?“

```r
# Eine Idee: die eigene wirtschaftliche Lage (ep03) statt der Lage in Deutschland
allbus <- allbus %>%
  mutate(
    zufriedenheit = rec(ps03, rules = "rev")
  )

allbus %>%
  kendall_tau(zufriedenheit, ep03, weights = wghtpew)
```

(Kontrolle, nicht abgefragt: Tau-b = −0,249, schwach. Die Lage des Landes hängt stärker mit der Demokratiezufriedenheit zusammen als die eigene.)

---

## 7. Thema 4: Zahlen mit Abständen: Pearson und Spearman, und die Drittvariable

### Grundlage 4: Punktwolke, Ausreißer, Drittvariable (etwa 15 Minuten)

Einleitungssatz: Wie misst man einen Zusammenhang, wenn die Abstände zwischen den Werten etwas bedeuten, und wann täuscht die Zahl? Drei Schritte.

#### 4a Formel lesen lernen: Pearson-r im Punkte-Labor (Im Bild, interaktiv)

**Beispiel zuerst:** Zum Beispiel acht Befragte mit ihrem Alter und den Minuten, die sie für einen Fragebogen gebraucht haben. A: 22 Jahre, 45 Minuten. B: 29, 50. C: 35, 48. D: 41, 60. E: 48, 58. F: 56, 66. G: 63, 70. H: 71, 75. Mittelwerte: 45,6 Jahre und 59 Minuten.

**Interaktion `s6-punktlabor` (Punktwolke mit Linie):** Punktwolke, x-Achse Alter 20–75 Jahre, y-Achse Minuten. Ein gestricheltes Kreuz durch die Mittelwerte (45,6 und 59) teilt die Fläche in vier Felder; Felder oben rechts und unten links leicht grün hinterlegt mit „+“, oben links und unten rechts leicht rot mit „−“ (Zeichen immer sichtbar, nicht nur Farbe). Punkte als beschriftete Steine A–H. Keine Gerade (Regression kommt in Sitzung 9); die „Linie“ ist das Kreuz der Mittelwerte.
Steuerung: Person B lässt sich verschieben über einen Stufenschalter „Minuten von Person B“ mit den Stufen 50 (Ausgang), 76, 100, 200, 500, 1.500. Bei 200 und mehr wird die y-Achse automatisch gestreckt, ein Hinweis „Achse gestreckt“ erscheint. Live angezeigt (aria-live): r und ρ.
Zustände und Sätze:
- 50: r = 0,974, ρ = 0,952. „Fast alle Punkte liegen in den Plus-Feldern: starker positiver Zusammenhang.“
- 76: r = 0,597, ρ = 0,476. „B braucht jetzt am längsten von allen, obwohl B zu den Jüngsten gehört. r fällt deutlich, ρ auch, denn bei den Minuten springt B vom drittkleinsten auf den größten Rangplatz.“
- 100: r = 0,207, ρ = 0,476. „B liegt weit oben im Minus-Feld. r bricht ein; ρ bleibt, denn B ist ja schon die Langsamste.“
- 200: r = −0,205, ρ = 0,476. „Ein einziger Punkt dreht r ins Negative.“
- 500: r = −0,335, ρ = 0,476.
- 1.500: r = −0,377, ρ = 0,476. „Ein Bogen, der einen Tag herumlag: r zeigt jetzt einen negativen Zusammenhang, den die anderen sieben Personen gar nicht haben. ρ bleibt bei 0,476.“
Textfassung: Werte der acht Personen, Lage im Kreuz, Tabelle der sechs Zustände mit r und ρ.

**Bild `s6-r-bausteine` (Formel als Bausteine, unter dem Labor, für den Ausgangszustand):**
- Schritt 1, Abstand vom Mittelwert, gemessen in Standardabweichungen (Fachbegriff: z-Wert; Standardabweichung kennst du aus Sitzung 3): Alter A bis H: −1,39, −0,98, −0,62, −0,27, 0,14, 0,61, 1,02, 1,49. Minuten A bis H: −1,29, −0,83, −1,01, 0,09, −0,09, 0,64, 1,01, 1,47.
- Schritt 2, je Person malnehmen: 1,79, 0,81, 0,63, −0,03, −0,01, 0,39, 1,03, 2,20. Merksatz: „Beide auf derselben Seite des Mittelwerts: Plus. Auf verschiedenen Seiten: Minus.“
- Schritt 3, zusammenzählen und durch n − 1 teilen: 6,81 / 7 = 0,97.
- Ergebnis: r = 0,97 (genau 0,974).
Textfassung: die drei Schritte als Liste mit allen Zahlen; Formel vorlesbar „r gleich Summe der Produkte der z-Werte, geteilt durch n minus 1“.

**Kurz überlegen (Frage `g4a`, Auswahl, steht vor dem Stufenschalter):** „Person B (29 Jahre) braucht statt 50 Minuten 1.500, weil der Bogen einen Tag herumlag. Was passiert mit r?“ Optionen: „r steigt.“ / „r sinkt stark, kann sogar negativ werden.“ / „r bleibt fast gleich.“ Ziel: zweite Option. Richtig: „Genau: Ein einziger Punkt weit draußen im Minus-Feld bringt ein riesiges negatives Produkt mit. r fällt auf −0,38.“ Falsch: „Probier es mit dem Schalter aus: B liegt dann weit oben links, im Minus-Feld.“

**Kurz gesagt:** Pearson-r misst, wie gut sich Punkte an eine steigende oder fallende Gerade halten, von −1 bis +1. Spearman-ρ (gesprochen „rho“) macht dasselbe mit Rangplätzen statt mit den Werten selbst. Darum verträgt ρ Ausreißer und passt auch zu geordneten Stufen.

**Häufige Verwechslung:** „r = 0,97 heißt: Ältere brauchen 97 % länger.“ r ist keine Prozentzahl und keine Steigung. Es sagt nur, wie eng die Punkte an einer Geraden liegen.

#### 4b Ausreißer und Kurven: Pearson oder Spearman? (Im Bild)

**Schild:** „Bearbeitungsdauer `xt10`: kennst du aus Sitzung 4“.

**Beispiel zuerst:** Brauchen ältere Befragte länger für den Fragebogen? In Sitzung 4 hast du gesehen: Einzelne Bögen lagen wochenlang herum, also Zehntausende Minuten, während die Hälfte nach gut einer Stunde fertig war (Median 65 Minuten). Mit allen Bögen ergibt Pearson-r 0,003 (gewichtet), Spearman-ρ 0,24. Nur mit Bögen bis 180 Minuten: r = 0,25, ρ = 0,27.

**Bild `s6-ausreisser-lineal` (Achse):** Lineal von −1 bis +1, vier Marken: „r, alle Bögen: 0,003“, „ρ, alle Bögen: 0,24“, „r, bis 180 Minuten: 0,25“, „ρ, bis 180 Minuten: 0,27“. r-Marken in einer Farbe, ρ-Marken in einer zweiten, Form zusätzlich verschieden (Kreis, Raute). Textfassung: die vier Werte als Liste und der Satz: „Mit Ausreißern zeigt r fast nichts, ρ einen schwachen Zusammenhang. Ohne die Ausreißer sind beide ähnlich.“

**Kurz überlegen (Frage `g4b`, Auswahl):** „Mit allen Bögen: r = 0,003, ρ = 0,24. Welche Zahl beschreibt den Zusammenhang besser?“ Optionen: „r, weil es die genauen Minuten nutzt.“ / „ρ, weil einzelne Bögen mit Zehntausenden Minuten r verzerren.“ / „Beide gleich gut.“ Ziel: zweite. Richtig: „Ja: Rangplätze stört es nicht, wie weit ein Ausreißer draußen liegt. Ohne Ausreißer liegt auch r bei 0,25.“ Falsch: „Denk an Person B im Punkte-Labor: Ein Punkt weit draußen bestimmt r. Was ändert sich bei Rangplätzen?“

**Kurz gesagt:** Pearson-r braucht metrische Variablen (oder viele Stufen mit etwa gleichen Abständen), einen geradlinigen Zusammenhang und keine extremen Ausreißer. Sonst nimmst du Spearman-ρ.

**Genauer erklärt: Was r nicht sieht.** r misst nur Geraden. Steigt etwas erst an und fällt dann wieder (ein Bogen), kann r nahe 0 liegen, obwohl ein deutlicher Zusammenhang besteht. Darum: erst die Punktwolke ansehen, dann rechnen. Für die Stärke gilt dieselbe Faustregel wie in Grundlage 2c. In R rechnet `spearman_rho()` immer ohne Gewicht; mit `weights = wghtpew` kommt derselbe Wert heraus (hier 0,238). Für Aussagen über Deutschland ist das eine kleine Einschränkung, die du im Bericht nennst.
→ In der freien Karte: Pearson-Korrelation (Begriff `pearson`), Spearman-Korrelation (Begriff `spearman`).

**Häufige Verwechslung:** „r = 0 heißt: kein Zusammenhang.“ r = 0 heißt nur: kein geradliniger. Mit Ausreißern oder bei einem Bogen kann trotzdem einer da sein.

#### 4c Zusammenhang ist keine Ursache: die Drittvariable (Deuten, interaktiv)

**Schild:** „Ein Zusammenhang ist keine Ursache: kennst du aus Sitzung 5“. Neu ist, wie man eine Drittvariable prüft.

**Beispiel zuerst:** Wer privat das Internet nutzt, beurteilt die eigene Gesundheit deutlich öfter als gut oder sehr gut: 59,0 % gegen 24,0 % (gewichtet, Phi = 0,22). Macht das Internet gesund?

**Interaktion `s6-drittvariable`:** Oben ein Pfeilbild (Entscheidungsbaum-Stil): Kasten „Alter“ mit zwei Pfeilen nach rechts zu „Internet nutzen“ (Beschriftung „Ältere nutzen es seltener“) und zu „Gesundheit“ („Ältere sind seltener gesund“); zwischen „Internet nutzen“ und „Gesundheit“ eine gestrichelte Linie mit Fragezeichen. Darunter Balken: Anteil „gute oder sehr gute Gesundheit“ (Prozent, gewichtet), je zwei Balken „nutzt Internet“ und „nutzt kein Internet“. Umschalter (aria-pressed): „alle“, „60 bis 74 Jahre“, „75 und älter“.
- alle: 59,0 % gegen 24,0 %, Abstand 35 Prozentpunkte, Phi 0,22. Satz: „Ein deutlicher Unterschied. Aber die Nicht-Nutzer sind im Schnitt viel älter.“
- 60 bis 74: 48,3 % gegen 29,6 % (867 und 98 Befragte, gewichtet), Abstand 18,7 Punkte, Phi 0,11.
- 75 und älter: 35,5 % gegen 20,4 % (310 und 255), Abstand 15,1 Punkte, Phi 0,17. Satz: „Innerhalb gleich alter Menschen schrumpft der Unterschied auf etwa die Hälfte. Ein Teil des Zusammenhangs kommt vom Alter.“
Fußnote am Umschalter: „Unter 60 nutzen 98,5 % das Internet; für einen Vergleich bleiben dort zu wenige ohne Internet (31, gewichtet).“ Weitere Zahlen für die Textfassung: Internetnutzung 98,5 % (18 bis 59), 89,8 % (60 bis 74), 54,9 % (75 und älter); gute oder sehr gute Gesundheit 67,2 %, 47,7 %, 29,1 %. Die Internet-Frage bekamen nicht alle Befragten (gewichtet 3.603 gültige). Zweite Fußnote: „Vergleiche hier die Prozentpunkte. Phi hängt auch davon ab, wie ungleich groß die Gruppen sind: Bei 60 bis 74 nutzen fast alle das Internet, darum fällt Phi dort kleiner aus, obwohl der Abstand größer ist.“
Textfassung: Pfeilbild in Worten, dann die drei Zustände als Tabelle.

**Kurz überlegen (Frage `g4c`, Auswahl, vor dem Umschalter):** „Was erwartest du: Wird der Unterschied zwischen Nutzern und Nicht-Nutzern innerhalb gleich alter Menschen größer oder kleiner?“ Optionen: „größer“ / „kleiner“ / „gleich“. Ziel: kleiner. Richtig: „Ja: Er schrumpft von 35 auf 15 bis 19 Prozentpunkte. Das Alter erklärt einen Teil.“ Falsch: „Schalte auf ‚60 bis 74‘ und ‚75 und älter‘ und vergleiche die Abstände mit ‚alle‘.“

**Kurz gesagt:** Eine Drittvariable kann zwei Merkmale zugleich beeinflussen. Fachbegriff: Confounding; die Drittvariable heißt dann Störvariable (englisch Confounder), weil sie als gemeinsame Ursache dahinterstecken kann. Dann hängen beide zusammen, auch wenn das eine das andere gar nicht bewirkt. Prüfen kannst du das, indem du den Zusammenhang innerhalb von Gruppen der Drittvariable rechnest.

**Genauer erklärt: Schrumpft, bleibt, kehrt sich um.** Rechnet man innerhalb der Gruppen einer Drittvariable, kann der Zusammenhang bleiben (dann erklärt sie ihn nicht), schrumpfen (sie erklärt einen Teil), verschwinden oder sich sogar umkehren. Hier schrumpft er, verschwindet aber nicht. Ob der Rest eine Ursache ist, zeigt auch das nicht: Vielleicht nutzen Gesunde eher das Internet als umgekehrt. Ein Zusammenhangsmaß sagt nie, was was bewirkt. In Aufgabe 4 prüfst du, ob ein Zusammenhang in West und Ost gleich stark ist.
→ In der freien Karte: Confounding (Begriff `confounding`).

**Häufige Verwechslung:** „Wenn der Zusammenhang schrumpft, war er falsch.“ Er war richtig gemessen. Er sagt nur etwas anderes, als man zuerst dachte.

„Schon klar? Direkt zu Aufgabe 4 ↓“

### Aufgabe 4: Lebenszufriedenheit und Demokratie (Zusatz)

↑ Grundlage 4 nachlesen

**Leitfrage:** Sind Menschen, die mit ihrem Leben zufriedener sind, auch zufriedener mit der Demokratie, und gilt das in West und Ost?

**Ziel:** Am Ende kannst du Pearson-r und Spearman-ρ rechnen und einordnen und prüfen, ob der Zusammenhang in beiden Landesteilen gleich stark ist. Grundlage: Grundlage 4.

**Einleitung:** Die Lebenszufriedenheit (`ls01`) reicht von 0 (ganz unzufrieden) bis 10 (ganz zufrieden); elf Stufen, die man wie Zahlen mit gleichen Abständen behandeln darf (quasi-metrisch). Die Zufriedenheit mit der Demokratie hat sechs Stufen; umgepolt (höher = zufriedener) behandelst du sie hier ebenfalls als quasi-metrisch und vergleichst zur Sicherheit mit Spearman-ρ.

**Erst festlegen (Frage `a4-tipp`):** „Wie stark hängen Lebenszufriedenheit und Zufriedenheit mit der Demokratie zusammen?“ Optionen: „kein oder sehr schwach (unter 0,1)“ / „schwach (0,1 bis 0,3)“ / „mittel (0,3 bis 0,5)“ / „stark (ab 0,5)“. Beim Prüfen: „Dein Tipp war: … r = 0,265: schwach.“

**Schritt 1:** Pole um (wie in Aufgabe 3) und sieh dir die Punktwolke an. `geom_jitter()` streut die Punkte leicht, weil sie sonst bei so wenigen Stufen übereinanderliegen (in Sitzung 4 im Überblick erwähnt; `ggplot()` kennst du von dort); `alpha = 0.2` macht sie durchscheinend, damit dichte Stellen dunkler wirken. Das Bild zeigt alle Befragten ohne Gewicht; für einen ersten Blick reicht das.

```r
# Zufriedenheit umpolen (kennst du aus Aufgabe 3), dann die Punktwolke
allbus <- allbus %>%
  mutate(
    zufriedenheit = rec(ps03, rules = "rev")
  )

allbus %>%
  drop_na(ls01, zufriedenheit) %>%
  ggplot(aes(x = ls01, y = zufriedenheit)) +
  geom_jitter(alpha = 0.2)
```

Textfassung der entstehenden Grafik (für den Screenreader neben der Werkstatt): „Punktwolke, x-Achse Lebenszufriedenheit 0 bis 10, y-Achse Zufriedenheit mit der Demokratie 1 bis 6. Die meisten Punkte liegen rechts oben (Lebenszufriedenheit 7 bis 9, Demokratie 4 bis 5). Links stehen wenige Punkte, sie streuen über alle Stufen. Die Wolke steigt nach rechts nur leicht an.“

**Schritt 2:** Rechne Pearson-r (gewichtet) und Spearman-ρ. Neu heute: `pearson_cor()` und `spearman_rho()`. Die Vorlage polt oben wieder um, weil jede Werkstatt mit dem frisch geladenen `allbus` beginnt.

```r
# Zufriedenheit umpolen: kennst du aus Aufgabe 3
allbus <- allbus %>%
  mutate(
    zufriedenheit = rec(ps03, rules = "rev")
  )

# Pearson r, gewichtet
allbus %>%
  pearson_cor(zufriedenheit, ls01, weights = wghtpew)

# Spearman rho zum Vergleich (rechnet ohne Gewicht)
allbus %>%
  spearman_rho(zufriedenheit, ls01)
```

**Schritt 3:** Prüfe die Drittvariable Landesteil: Rechne r einmal nur im Westen (1, wie vorgegeben) und einmal nur im Osten (tausche die markierte Stelle gegen 2).

```r
# Pearson r in einem Landesteil (1 = West, 2 = Ost), gewichtet
# (Zufriedenheit umpolen: kennst du aus Aufgabe 3)
allbus %>%
  mutate(
    zufriedenheit = rec(ps03, rules = "rev")
  ) %>%
  filter(eastwest == ⟦1⟧) %>%
  pearson_cor(zufriedenheit, ls01, weights = wghtpew)
```

Markierte Stelle als Liste: Zeile 7, `1`.

**Antwortfragen A4**

| id | Art | Label | Optionen | Ziel | Toleranz | Text richtig | Text falsch / Hinweis | Hilfezeile |
|---|---|---|---|---|---|---|---|---|
| a4-r | number | Wie groß ist Pearson-r (gewichtet)? | – | 0.265 | 0,0005 | Stimmt: r = 0,265. | Lies in Schritt 2 die Zahl hinter `r =`. Bei 0,260 fehlt das Gewicht; bei 0,268 hast du ρ eingetragen. | Drei Nachkommastellen, wie in der Zeile `r = …`. |
| a4-rho | number | Wie groß ist Spearman-ρ? | – | 0.268 | 0,0005 | Stimmt: ρ = 0,268, fast dasselbe wie r. | Lies in Schritt 2 die Zahl hinter `rho =`. | Drei Nachkommastellen, Zeile `rho = …`. |
| a4-staerke | choice | Wie stark ist der Zusammenhang nach der Faustregel? | kein oder sehr schwach / schwach / mittel / stark | schwach | – | Ja: 0,265 liegt zwischen 0,1 und 0,3, also schwach. | Vergleiche mit den Grenzen 0,1, 0,3 und 0,5. | – |
| a4-west | number | Wie groß ist r im Westen? | – | 0.267 | 0,0005 | Stimmt: r = 0,267 im Westen. | Führe Schritt 3 mit `eastwest == 1` aus. Bei 0,265 hast du den Wert für alle aus Schritt 2 genommen. | Aus Schritt 3 mit 1, drei Nachkommastellen. |
| a4-ost | number | Und im Osten? | – | 0.239 | 0,0005 | Stimmt: r = 0,239 im Osten. | Tausche in Schritt 3 die markierte 1 gegen 2. | Aus Schritt 3 mit 2, drei Nachkommastellen. |
| a4-dritt | choice | Erklärt der Landesteil den Zusammenhang? | a) „Nein: In West und Ost ist er etwa gleich stark wie insgesamt.“ b) „Ja: Im Osten verschwindet er.“ c) „Ja: Er kehrt sich im Osten um.“ | a | – | Genau: 0,267 im Westen, 0,239 im Osten, 0,265 insgesamt. Der Zusammenhang hält in beiden Landesteilen. | Vergleiche die beiden Werte aus Schritt 3 mit dem Wert aus Schritt 2. Sind sie deutlich kleiner oder haben sie ein anderes Vorzeichen? | – |
| a4-satz | choice | Welcher Satz passt in einen Bericht? | a) „Lebenszufriedenheit macht zufrieden mit der Demokratie.“ b) „Wer mit dem eigenen Leben zufriedener ist, ist im Schnitt etwas zufriedener mit der Demokratie (r = 0,27, gewichtet). Ob das eine das andere bewirkt, zeigt r nicht.“ c) „Ein Viertel der Zufriedenheit mit der Demokratie kommt von der Lebenszufriedenheit.“ | b | – | Genau: Richtung, Stärke, Gewicht, und keine Ursache behauptet. | r misst einen Zusammenhang, keine Ursache, und ist kein Prozentanteil. | – |

**Hilfe, Stufe 1 (Denkanstoß):** r und ρ stehen hinter `r =` und `rho =`. Für die Drittvariable rechnest du dasselbe Maß in jeder Gruppe und vergleichst mit dem Gesamtwert.

**Hilfe, Stufe 2 (Wo schaue ich?):** Gesamtwerte in Schritt 2; West und Ost in Schritt 3, einmal mit 1 und einmal mit 2 an der markierten Stelle.

**Hilfe, Stufe 3 (Lösung):** r = 0,265 (gewichtet), ρ = 0,268: ein schwacher positiver Zusammenhang. Im Westen r = 0,267, im Osten 0,239; der Landesteil erklärt den Zusammenhang nicht. Satz: Wer mit dem eigenen Leben zufriedener ist, ist im Schnitt etwas zufriedener mit der Demokratie; eine Ursache zeigt r nicht.

**Ohne Grafik lösbar:** ja; die Punktwolke ist nur zum Ansehen, alle Antworten kommen aus Schritt 2 und 3.

**Weiterdenken in der Probier-Werkstatt (für die Aufgabe nicht nötig):** „Eine Idee: Hängt die Links-rechts-Einstufung mit der Zufriedenheit zusammen? Für West oder Ost setzt du die Zeile `filter(eastwest == 1) %>%` aus Schritt 3 vor `pearson_cor()`.“

```r
# Eine Idee: Links-rechts-Einstufung (pa01: 1 = links, 10 = rechts) und Zufriedenheit
allbus <- allbus %>%
  mutate(
    zufriedenheit = rec(ps03, rules = "rev")
  )

allbus %>%
  pearson_cor(zufriedenheit, pa01, weights = wghtpew)
```

(Kontrolle, nicht abgefragt: r = −0,193; im Westen −0,191, im Osten −0,283.)

---

## 8. Überblick: Welches Maß für welche Variablen?

### Karte Ü1: Das niedrigere Skalenniveau entscheidet (Zuordnen)

**Bild `s6-entscheidungsbaum` (Entscheidungsbaum wie in Sitzung 4):** Start „Welches Skalenniveau haben beide Variablen? Das niedrigere zählt.“
- Mindestens eine nominal → „Cramér-V“ (`cramers_v()`); Zweig „beide mit genau zwei Kategorien“ → „Phi“ (`phi()`).
- Beide mindestens ordinal, mindestens eine ordinal → „Tau-b“ (`kendall_tau()`), daneben „Gamma“ (`goodman_gamma()`) und „Spearman-ρ“ (`spearman_rho()`).
- Beide metrisch → „Pearson-r“ (`pearson_cor()`); Zweig „Ausreißer oder kein geradliniger Verlauf“ → „Spearman-ρ“.
Textfassung: dieselben Regeln als Liste.

**Ordne jedem Paar ein Maß zu (Zuordnen, Auswahl je Zeile, Optionen: Cramér-V, Phi, Tau-b, Pearson-r, Spearman-ρ):**

| id | Paar | Ziel | Rückmeldung richtig | Rückmeldung falsch |
|---|---|---|---|---|
| u1 | Familienstand und Wahlabsicht | Cramér-V | Beide nominal, mehr als zwei Kategorien. | Hat der Familienstand eine Reihenfolge? |
| u2 | Geschlecht (Mann, Frau) und Gewerkschaftsmitglied (ja, nein) | Phi | Zwei mal zwei Kategorien: Phi (dem Betrag nach gleich Cramér-V). | Zähl die Kategorien: je zwei. |
| u3 | Politisches Interesse (sehr stark bis überhaupt nicht) und Schulabschluss (ohne bis Hochschulreife) | Tau-b | Beide geordnet, wenige Stufen. Gamma ginge auch, fällt aber größer aus. | Beide haben eine Reihenfolge, aber keine gleichen Abstände. |
| u4 | Alter und Arbeitsstunden pro Woche | Pearson-r | Beide metrisch. Vorher die Punktwolke ansehen. | Jahre und Stunden haben gleiche Abstände. |
| u5 | Alter und Bearbeitungsdauer, wobei einzelne Bögen wochenlang herumlagen | Spearman-ρ | Ausreißer verzerren r; Rangplätze nicht. | Denk an Grundlage 4b. |

Prüfknopf; Rückmeldung je Zeile.

**Kurz gesagt:** Zähl zuerst nicht die Werte, sondern frag nach der Reihenfolge und den Abständen beider Variablen. Das niedrigere Skalenniveau entscheidet, welches Maß passt. Ein Maß für ein höheres Niveau darfst du nicht nehmen; eins für ein niedrigeres geht, verschenkt aber Information.

### Karte Ü2: Voraussetzungen und Eigenheiten (Tabelle)

| Maß | braucht | Wertebereich | Richtung | in mariposa gewichtet | Vorsicht |
|---|---|---|---|---|---|
| Cramér-V | nominal (oder mehr) | 0 bis 1 | nein | ja | Hängt auch von der Tabellengröße und den Gruppengrößen ab; Richtung aus den Prozenten lesen. |
| Phi | zwei mal zwei Kategorien | 0 bis 1; `phi()` in R zeigt ein Vorzeichen, −1 bis +1 | nur über die Codes: welche Gruppen zusammen vorkommen | ja | Das Vorzeichen dreht sich, wenn man die Codes einer Variable tauscht; Stärke am Betrag lesen, die Gruppen an den Prozenten. |
| Gamma | ordinal | −1 bis +1 | ja | ja | Lässt Gleichstände weg und fällt deshalb größer aus; nur mit sinnvoller Reihenfolge. |
| Tau-b | ordinal | −1 bis +1 | ja | ja | Zählt Gleichstände mit; gut zum Einordnen der Stärke. |
| Spearman-ρ | ordinal oder metrisch | −1 bis +1 | ja | nein, rechnet immer ohne Gewicht | Robust gegen Ausreißer. |
| Pearson-r | metrisch | −1 bis +1 | ja | ja | Nur geradlinige Zusammenhänge; Ausreißer verzerren. |

Für alle gilt: Für Aussagen über Deutschland gewichtet rechnen und „gewichtet“ dazuschreiben; n nennen; ein Zusammenhang ist keine Ursache.

### Karte Ü3: Dieselben Daten, fünf Maße (Im Bild)

**Bild `s6-fuenf-masse` (Achse):** Lineal von −1 bis +1 mit fünf Marken für Zufriedenheit (umgepolt) und Wirtschaftslage aus Aufgabe 3, gewichtet: Cramér-V 0,28; Tau-b −0,39; Spearman-ρ −0,45; Pearson-r −0,46; Gamma −0,54. Textfassung: die fünf Werte als Liste und der Satz unten.

**Kurz gesagt:** Für dieselben Daten liefern die Maße verschiedene Zahlen, weil sie Verschiedenes messen. Vergleiche Zusammenhänge darum nur mit demselben Maß; V hat zudem kein Vorzeichen.

**Häufige Verwechslung:** „Die Wirtschaftslage hängt mit Gamma 0,54 stärker mit der Demokratie zusammen als die Wahlabsicht mit V 0,48.“ Gamma und V sind verschiedene Maßstäbe; so lässt sich das nicht vergleichen.

---

## 9. Zum Schluss: Mitnehmen

### Das Wichtigste aus dieser Sitzung
- Der ALLBUS befragt den Osten absichtlich stärker (32 statt 17 von 100). Für Aussagen über ganz Deutschland rechnest du gewichtet mit `weights = wghtpew`; das Gewicht ist Anteil in Deutschland geteilt durch Anteil in der Stichprobe.
- Gewichtung verschiebt Gesamtzahlen, wenn sich West und Ost unterscheiden (Zufriedene: 70,7 % ohne, 73,6 % mit Gewicht); innerhalb eines Landesteils ändert sie fast nichts.
- Zusammenhang heißt: Die Verteilung des einen Merkmals ist in den Gruppen des anderen verschieden. χ² misst den Abstand von „kein Zusammenhang“, Phi und Cramér-V machen daraus eine Zahl von 0 bis 1 (zeigt `phi()` ein Minus, zählt für die Stärke der Betrag).
- Haben beide Merkmale eine Reihenfolge, vergleichen Gamma und Tau-b Paare: gleichläufig gegen gegenläufig. Gamma lässt Gleichstände weg und fällt größer aus.
- Der Betrag zeigt die Stärke (Faustregel: ab 0,1 schwach, ab 0,3 mittel, ab 0,5 stark), das Vorzeichen die Richtung; was „höher“ heißt, steht im Codebuch.
- Pearson-r misst geradlinige Zusammenhänge metrischer Variablen und ist empfindlich für Ausreißer; Spearman-ρ nutzt Rangplätze.
- Ein Zusammenhang ist keine Ursache: Eine Drittvariable kann beide Merkmale beeinflussen. Prüfen kannst du das innerhalb ihrer Gruppen.
- In R: Datensatz vorn, dann das Maß mit zwei Variablen: `allbus %>% kendall_tau(x, y, weights = wghtpew)`.

### Prüf dich selbst (5 Fragen, Auswahl, Begründung nach dem Prüfen)

| id | Frage | Optionen | Ziel | Begründung |
|---|---|---|---|---|
| p1 | Ein Bericht über ganz Deutschland nennt den Anteil ohne Gewicht. Was ist das Problem? | a) Der Osten zählt fast doppelt so stark, wie er in Deutschland vertreten ist. b) Ohne Gewicht fehlen Befragte. c) Ohne Gewicht sind die Prozente falsch gerechnet. | a | Der ALLBUS befragt den Osten absichtlich stärker. Gerechnet ist richtig, aber die Zahl beschreibt die Befragten, nicht Deutschland. |
| p2 | Du vergleichst nur den Osten mit dem Westen. Ändert das Gewicht die Prozente in den Landesteilen? | a) Kaum, weil innerhalb eines Landesteils alle fast dasselbe Gewicht haben. b) Ja, stark. c) Nur im Westen. | a | Im Osten 58,45 % ohne, 58,56 % mit Gewicht. Das Gewicht wirkt erst, wenn West und Ost zusammengezählt werden. |
| p3 | Konfession (evangelisch, katholisch, andere, keine) und Wahlabsicht: Welches Maß passt? | a) Gamma b) Cramér-V c) Pearson-r | b | Beide nominal. Gamma bräuchte eine sinnvolle Reihenfolge; die Konfessionen haben keine. |
| p4 | Zwischen Bildung (höher = höherer Abschluss) und einer Einstellung kommt Tau-b = −0,32 heraus. Was stimmt? | a) Schwach, weil negativ. b) Mittel; höhere Bildung geht mit niedrigeren Codes der Einstellung einher. c) Kein Zusammenhang. | b | Der Betrag 0,32 zeigt die Stärke (mittel), das Minus die Richtung. Was ein niedrigerer Code bei der Einstellung heißt, steht im Codebuch. |
| p5 | Zwischen zwei metrischen Variablen kommt r = 0,02 heraus. Was schließt du? | a) Es gibt sicher keinen Zusammenhang. b) Es gibt keinen geradlinigen Zusammenhang; Punktwolke und Spearman-ρ prüfen. c) Die Variablen sind falsch kodiert. | b | r sieht nur Geraden und reagiert stark auf Ausreißer. Beim Alter und der Bearbeitungsdauer war r = 0,003, ρ aber 0,24. |

### Dein Skript zum Mitnehmen
„Alle Vorlagen dieser Sitzung in einer Datei, mit Kommentaren. Öffne sie in RStudio und führe sie Block für Block aus.“ Knopf „Skript herunterladen (sitzung6.R)“, Link „→ Nachlesen im R-Workshop, Kapitel 7 (Gewichtung, Zusammenhangsmaße)“.

Inhalt von `sitzung6.R` in dieser Reihenfolge (Vorlagen wörtlich, markierte Stellen mit ihrem Beispielwert, je mit Überschrift als Kommentar `# ---- … ----` davor): Startblock; Vorweg (Gewicht lesen, ein Zusammenhangsmaß); Aufgabe 1 (Schritt 1, Schritt 2 mit Ost; Zeile darunter als Kommentar: „# Für den Westen: in beiden filter()-Zeilen 2 durch 1 ersetzen“); Aufgabe 2 (Schritt 2 und 3); Aufgabe 3 (Schritt 1 und 2); Aufgabe 4 (Schritt 1 bis 3; Kommentar „# Für den Osten: 1 durch 2 ersetzen“). Die Probier-Vorschläge stehen am Ende unter „# ---- Ideen zum Weiterdenken ----“.

---

## 10. Hilfe bei R-Fehlermeldungen (typisch für diese Sitzung)

| Meldung (Wortlaut, englisch; in deutscher R-Version ähnlich) | Was passiert ist | Was du tust |
|---|---|---|
| `Unknown argument `weight` of `frequency()`. Did you mean `weights` instead of `weight`?` | Das s fehlt. | `weights = wghtpew` schreiben, mit s. |
| `Weights variable `wghtpwe` not found in data.` | Tippfehler im Namen des Gewichts. | Genau `wghtpew` schreiben: w, g, h, t, p, e, w. |
| `Can't select columns that don't exist. ✖ Column `zufriedenheit` doesn't exist.` | Die neue Variable gibt es noch nicht: Der Block mit `mutate()` wurde nicht ausgeführt (oder der Name ist anders geschrieben). | Erst den Block mit `mutate()` ausführen, dann das Maß. In RStudio nach einem Neustart auch den Startblock. |
| `unexpected symbol` (deutsch: `unerwartetes Symbol`) | Zwischen den zwei Variablen fehlt ein Komma, z. B. `kendall_tau(zufriedenheit ep01)`. | Komma setzen: `kendall_tau(zufriedenheit, ep01)`. |
| `could not find function "cramers_v"` (deutsch: `konnte Funktion "cramers_v" nicht finden`) | mariposa ist nicht geladen. | Startblock ausführen (`library(mariposa)`). |
| Warnung in Rot: `2 cells (6.7%) has expected count < 5. Chi-squared approximation may be unreliable.` | Kein Fehler: ein Hinweis zum χ²-Test, weil einige Zellen der Tabelle sehr klein sind. | Nichts; die Zahl darüber gilt. |
| Kein Fehler, aber eine andere Zahl als erwartet (z. B. −0,553 statt −0,544) | `weights = wghtpew` fehlt. | Gewicht in die Klammer setzen. |
| Kein Fehler, aber das Vorzeichen ist umgekehrt (z. B. 0,544 statt −0,544) | `ps03` statt `zufriedenheit` verwendet, also nicht umgepolt. | Den Block mit `rec(ps03, rules = "rev")` ausführen und `zufriedenheit` einsetzen. |

---

## 11. Entscheidungen (von mir getroffen, mit Begründung)

1. **Vier Themen nach Skalenniveau, davor die Gewichtung.** Gewichtung ist Voraussetzung für alles Weitere (ab hier gewichtet) und bekommt ein eigenes Thema; die Zusammenhangsmaße folgen der Entscheidung „nominal, ordinal, metrisch“, die im Überblick als Baum zusammenläuft. Drittvariable und Confounding (laut Curriculum neu) stecken in Grundlage 4c und in Aufgabe 4, Schritt 3, statt ein fünftes Thema aufzumachen.
2. **Pflicht A1 bis A3, A4 Zusatz.** Gewichtung, nominale und ordinale Maße sind der Kern des Sitzungsplans („Gewichtung, bivariate Zusammenhangsmaße für verschiedene Skalenarten“). Zusammen etwa 40 Minuten: A1 zwei Vorlagen, fünf Fragen; A2 drei Vorlagen, sechs Fragen; A3 zwei Vorlagen, fünf Fragen. Pearson/Spearman ist Zusatz, weil es in Sitzung 7 (Korrelationsmatrix) wiederkommt.
3. **Alle Aufgaben um `ps03`.** Die Leitfrage im Curriculum lautet „Was hängt mit der Zufriedenheit mit der Demokratie zusammen?“. Ein durchgehendes Thema macht die Aufgaben vergleichbar (Überblick Ü3) und spart Einlesezeit. Die Grundlagen nutzen andere Variablen (rd01, hs01, id02, age, xt10, xr19) oder konstruierte Beispiele. Ausnahme `eastwest`: als Gewichtungsmerkmal in Grundlage 1 und 2 unvermeidlich; in A1 und A4 dient es nur zum Aufteilen. Die Grundlage verrät keine Zahl einer Aufgabe.
4. **Keine „Treiber-Rangliste“ mehr.** Die alte Aufgabe `s05` (Beratungsbüro, Förderfonds, zwölf Karten, Stempel) war ein Rollenszenario mit Kartenziehung; das widerspricht dem neuen Design. Übernommen: `ps03` mit `rec(ps03, rules = "rev")` umpolen, `ep01` als stärkster Kandidat (A3), West/Ost als Prüfung (A4), „verschiedene Maße, verschiedene Zahlen“ (Ü3), Gamma und Reihenfolge der Konfession (3c). Das Wort „Treiber“ wird nicht mehr benutzt; die Kausalitätsfrage steht in 4c, A2 (Plenum) und A4.
5. **A2 mit zweigeteilter Zufriedenheit.** `rec(ps03, "1:3=1; 4:6=0")` ergibt eine lesbare 8 × 2-Tabelle (ein Prozentwert je Partei) und dieselbe Grenze wie in A1. Mit allen sechs Stufen wäre V = 0,248 und die Tabelle 8 × 6 schwer lesbar. Das V im Plan (0,478) gilt nur für die Zweiteilung; das steht in der Vorlage.
6. **`kendall_tau()` ohne `unlabel()`.** Der alte Plan (mariposa 0.7.3) brauchte `unlabel()`, weil Tau-b mit Wertelabels sehr langsam war. Mit 0.7.4 laufen `goodman_gamma()` und `kendall_tau()` mit Labels zusammen in etwa 0,01 Sekunden (gemessen im Skript). Darum keine zusätzliche Funktion. Sollte webR deutlich langsamer sein, wäre die Rückfallebene `allbus %>% unlabel(zufriedenheit, ep01, wghtpew) %>% kendall_tau(…)`.
7. **Faustregel 0,1 / 0,3 / 0,5** wie im R-Workshop, Kapitel 7 (Cohen), für V, Phi, Tau-b, ρ und r; die Stärke wird in A3 ausdrücklich mit Tau-b eingeordnet, weil Gamma größer ausfällt.
8. **p-Werte und Sternchen werden übergangen** („kommt in Sitzung 7“), weil Testen dort eingeführt wird und hier nur die Stärke zählt.
9. **Phi mit Vorzeichen nur am Rand.** mariposa 0.7.4 gibt bei 2 × 2 ein Vorzeichen aus (A2-Probier: −0,153). Es sagt nur, welche Codes zusammen vorkommen, und dreht sich beim Tauschen der Codes; erklärt in Grundlage 2b („Warum zeigt R bei Phi manchmal ein Minus?“), in der Probier-Werkstatt und in Ü2, nicht abgefragt. „Phi zwischen 0 und 1“ gilt für Phi aus χ²; für `phi()` steht überall dazu, dass es ein Vorzeichen zeigen kann.
10. **`spearman_rho()` in den Vorlagen ohne `weights`.** Die Funktion rechnet immer ungewichtet (mit `weights` kommt dieselbe Zahl, geprüft); das Argument hinzuschreiben würde Gewichtung vortäuschen.
11. **χ² über erwartete Häufigkeiten an einem konstruierten Beispiel (100 Befragte).** Die Rechnung von Hand bleibt so kurz und rund (13,15; 0,36); die echten Werte (0,33 und 0,34) stehen daneben. χ² als Test war in Sitzung 5 nur Wiederholung im Überblick; deshalb wird es hier vollständig erklärt, mit Schild.
12. **Konstruierte Beispiele** (Tafel mit 100 Befragten, fünf Personen A bis E, acht Personen A bis H) sind als „zum Beispiel“ eingeführt, ohne „(fiktiv)“; alle Werte und Maße sind im Skript mit mariposa nachgerechnet.
13. **Drittvariable mit Internet, Gesundheit und Alter** statt mit einer Variable der Aufgaben: Der Effekt ist groß und anschaulich (35 Punkte schrumpfen auf 15 bis 19), die Altersgruppe unter 60 wird wegen zu weniger Nicht-Nutzer (31 gewichtet) nicht gezeigt, nur erwähnt.
14. **Antworttoleranzen.** Prozente ±0,1; V, Gamma, Tau-b ±0,005 (drei oder zwei Nachkommastellen werden akzeptiert, Gegenwerte ohne Gewicht liegen außerhalb: 0,484, −0,553, −0,393); in A4 ±0,0005 (nur die drei gedruckten Nachkommastellen), damit r (0,265), ρ (0,268) und West-r (0,267) sich nicht gegenseitig als richtig durchgehen; mit ±0,001 hätte a4-west den ρ-Wert 0,268 und a4-rho den West-Wert 0,267 akzeptiert (Prüfung 23.11.). a1-ost und a1-west akzeptieren mit Ziel 58,5 bzw. 76,6 sowohl den gewichteten als auch den ungewichteten Wert, weil es dort gerade um „fast gleich“ geht. Negative Zielwerte: Eingaben mit „−“, „-“ oder „–“ werden gelesen (`answerNumbers`).
15. **ALLBUS-Fragetexte** werden nicht wörtlich zitiert (kein Fragebogen zur Hand), sondern über Variablenlabel und Codes beschrieben.
16. **Punkte-Labor mit festen Stufen** statt freiem Ziehen: Die sechs Zustände sind geprüft und haben je einen Satz; so bleibt die Interaktion mit Tastatur und Screenreader eindeutig. Eine Regressionsgerade wird nicht gezeichnet (kommt in Sitzung 9).
17. **Jede Vorlage läuft für sich** (Nachtrag zum Auftrag): Die Werkstatt lädt `allbus` vor jedem Ausführen neu. Vorlagen mit einer selbst gebildeten Variable bilden sie selbst: in der Kette (`mutate()` vor `crosstab()`, `cramers_v()`, `filter()`), oder, wenn zwei Maße folgen, mit `allbus <- allbus %>% mutate(…)` am Anfang derselben Vorlage. Wiederholungen sind kommentiert („kennst du aus Schritt 1“, „kennst du aus Aufgabe 3“). Der frühere eigene Schritt „nur umkodieren“ in A2 entfällt; Bilden und Auszählen stehen in einer Kette. Das Skript prüft jede Vorlage in einer frischen Umgebung, in der nur der unveränderte `allbus` liegt.
18. **`geom_jitter(alpha = 0.2)`** in A4: `alpha` ist neu, aber nur ein Satz Erklärung; die Grafik ist für die Antworten nicht nötig.

---

## 12. Abweichungen zu den Folien

Für Sitzung 6 gibt es noch keine Folien (`Seminarvorbereitung/` enthält Sitzung 1 bis 4, `_build_folien*.py` bis Sitzung 4). Darum keine Abweichungsliste. Für den späteren Folienbau, damit Folien und Kapitel zusammenpassen:
- `weights = wghtpew` in jeder Funktion, keine einmalige Gewichtung; `kendall_tau()` ohne `unlabel()`; `spearman_rho()` ohne `weights`.
- Umpolen mit `rec(ps03, rules = "rev")` in `mutate()`, Variable `zufriedenheit`; Zweiteilung `zufrieden` mit `"1:3=1 [zufrieden]; 4:6=0 [unzufrieden]; else=NA"`.
- Faustregel 0,1 / 0,3 / 0,5; Stärke ordinal mit Tau-b einordnen.
- Input-Beispiele auf den Folien mit den Variablen der Grundlagen (rd01 × eastwest, hs01 × id02, age × xt10) oder anderen, nicht mit denen der Aufgaben (ps03 × pv01, ep01, ls01).
- Arbeitsphase und Plenum verweisen auf A1 bis A4; Plenumsfragen aus A2 und A3 übernehmen.

---

## 13. Prüfung (Agent, 23.11.2026)

Geprüft gegen den Design-Auftrag (mit Nachtrag „Jede Vorlage läuft für sich“), das Design, den Prototyp Sitzung 4 und die Nachbarpläne `sitzung05.md` (Stand 23.11., wird parallel noch bearbeitet) und `sitzung07.md`. `Rscript sitzung06-zahlen.R` läuft vor und nach den Änderungen mit Exit 0 (alle 16 ```r-Blöcke wörtlich geprüft); jede Zahl der R-Ausgaben in A1 bis A4 zusätzlich von Hand gegen die gedruckte Ausgabe gelesen.

### Blickwinkel 1: schwache Studentin ohne Vorwissen
Durchgespielt (Seminar, nur Aufgaben): A1 etwa 10 bis 12 Minuten (Startzeit der Werkstatt eingerechnet), A2 etwa 15, A3 etwa 13 bis 15; zusammen 38 bis 42 Minuten, also knapp in 45. Grundlagen je 12 bis 15 Minuten, passt.
- A3: Die Hinweise verwiesen auf einen Block „Gamma …“, den die Ausgabe nicht hat (`goodman_gamma()` druckt nur `[1] -0.5444373`). **Geändert:** Schritt 2 beschreibt die Ausgabe (erst `[1]`, dann der Block „Kendall's Tau“), Hinweise in a3-gamma und a3-tau angepasst.
- A2, Schritt 2: Wer `crosstab()` gewichtet zum ersten Mal sieht, stockt an den zwei Zeilen je Partei und an gewichteten Anzahlen. **Geändert:** ein Satz zu „Anzahl (Summe der Gewichte)“ und „row %“ sowie, warum Zeilenprozente (Anschluss an die Leserichtung aus Sitzung 5).
- A2, Hilfe 3: „alle zusammen 74,8 %“ wirkt wie ein Widerspruch zu 73,6 % aus A1. **Geändert:** Grund dazugeschrieben (nur gültige Wahlabsicht).
- Grundlage 1a: widersprüchliche Bedienbeschreibung („Neu schätzen nur bis zum Aufdecken“). **Geändert:** Regler bleibt nach dem Aufdecken gesperrt, Fokus auf die Rückmeldung.
- Grundlage 4a, Zustand 76: „B rutscht auf den letzten Rangplatz“ war missverständlich und falsch gezählt. **Geändert:** „springt vom drittkleinsten auf den größten Rangplatz“.
- A4-Probier: Die Anschlussfrage nannte West/Ost, der Vorschlag rechnet nur gesamt. **Geändert:** Satz, wo die `filter()`-Zeile aus Schritt 3 hingehört (Code unverändert).
- Grundlage 4c: Phi wird in der Untergruppe 60 bis 74 kleiner (0,11) als bei 75+ (0,17), obwohl der Abstand größer ist; das irritiert. **Geändert:** zweite Fußnote, dass hier die Prozentpunkte verglichen werden und Phi von ungleichen Gruppengrößen abhängt.

### Blickwinkel 2: Didaktik
Grundlage → Aufgabe trägt in allen vier Themen; Festlegen vorher und Deuten-Fragen (a1-warum, a2-richtung, a3-richtung/-warum, a4-dritt/-satz) sind gut. Fokus Verfahren/Interpretation stimmt, R bleibt Beiwerk. Probier-Werkstätten sind echte Anschlussfragen.
- Grundlage 3c verriet eine Lösung: „−0,54 ist ein stärkerer Zusammenhang als +0,30“ ist genau a3-gamma. **Geändert:** −0,42.
- Anschlüsse an Sitzung 5 geprüft: `mutate()`/`rec()`, `rules = "rev"`, `crosstab()`, Zeilenprozente, χ² (S5 Ü3, „Wiederholung aus der Vorlesung“, mit Hinweis „V ist Thema in Sitzung 6“) stimmen. Gefehlt hat: „Zusammenhang ist keine Ursache“ ist in S5 schon Lernziel und Thema (Grundlage 3, a3f „etwas Drittes“); `ep01` war in S5 das Umpol-Beispiel. **Geändert:** Lernziel „Voraussetzungen“ auf das Neue (Drittvariable prüfen) zugespitzt, Schild in 4c, Schild an `ep01` in A3 (mit „bleibt, wie es ist“), „Schon bekannt“ ergänzt, Anschlusssatz zu V aus Sitzung 5 in 2b.
- `geom_jitter()` steht in Sitzung 4 nur in der Überblickstabelle, nicht in einer Vorlage; „kennst du aus Sitzung 4“ war zu viel. **Geändert:** „in Sitzung 4 im Überblick erwähnt“, `ggplot()` als bekannt.
- p-Wert: durchgehend „heute links liegen lassen, kommt in Sitzung 7“; `sitzung07.md` führt p vollständig ein und rechnet vorsichtig damit, dass Sterne in S6 nur auftauchten. Da S5 (Ü3) beim χ²-Test schon „p < 0.001“ zeigt, **geändert:** R2 nennt das kurz („begegnet in Sitzung 5, erklärt in Sitzung 7“). Kein Widerspruch zu S7.

### Blickwinkel 3: Fachliches und Barrierefreiheit
Zahlen: alle Zielwerte entsprechen der gedruckten mariposa-Ausgabe (Cum. % zwei Stellen, row % eine Stelle, `[1]` sieben Stellen, tau/r/rho drei Stellen); deutsche/R-Schreibweise eindeutig (keine Zielwerte mit Tausenderpunkt). Gewichtung, Prozentbasis, Skalenniveaus korrekt. Bilder haben Textfassungen mit Werten; alle Aufgaben ohne Grafik lösbar. Sprache: Du-Form, keine Witze, kein „(fiktiv)“, kein „·“ neben Zahlen; R-Stil eingehalten (`%>%`, `rec()` in `mutate()`, `drop_na()` nur in A4, kein `ifelse()`).
- **Phi (mariposa `phi()` ist bei 2 × 2 vorzeichenbehaftet):** „Phi zwischen 0 und 1, keine Richtung“ stimmte nur für Phi aus χ². **Geändert:** neue Karte „Genauer erklärt: Warum zeigt R bei Phi manchmal ein Minus?“ in 2b (−1 bis +1, Vorzeichen dreht sich beim Tauschen der Codes, Stärke am Betrag, V = Betrag von Phi); R2-Tabelle, Ü2, u2, Mitnehmen, A2-Probier und Entscheidung 9 angeglichen. Im Skript neu geprüft: `cramers_v()` = 0,153 = |Phi|, Phi mit getauschten Codes +0,153.
- A4-Toleranz ±0,001 ließ Werte durchgehen, die gerade ausgeschlossen werden sollten (a4-west akzeptierte ρ = 0,268, a4-rho den West-Wert 0,267); die Skriptprüfung dazu war nur ein `cat()`. **Geändert:** ±0,0005 in allen vier A4-Zahlfragen, echte Prüfung im Skript, Entscheidung 14 angepasst.
- Tau-b ist dem Betrag nach nie größer als Gamma (nicht nur „meist kleiner“). **Geändert** in 3b.
- 3b nannte Gamma 0,36 / Tau-b 0,24 für Schicht × Gesundheit ohne Polung; im Datensatz sind beide negativ (R2 zeigt −0,241). **Geändert:** „wenn die Gesundheit so gepolt ist, dass höher besser heißt“.
- Einzelfallwert: „der längste Bogen über 61.000 Minuten“ ist der Wert einer Person. **Geändert** in 4b und u5 (wochenlang, Zehntausende Minuten; Median 65 Minuten, im Skript geprüft).
- „gut 17 von 100“ bei 16,84 %: **geändert** auf „knapp 17 (mit Ost-Berlin)“. A1-Lösung „33 von 100 aus dem Osten“ (genau 32,5 %): **geändert** auf „knapp ein Drittel (32,5 %) … etwa ein Sechstel (16,9 %)“, im Skript geprüft.
- Faustregel für Cramér-V: Cohens Grenzen gelten so nur bei zwei Zeilen oder Spalten. **Geändert:** ein Satz in 2c (A2 ist 8 × 2, passt).
- Confounding: Fachbegriff präzisiert (Störvariable/Confounder) und „ohne dass das eine das andere bewirkt“ zu „auch wenn … gar nicht bewirkt“ abgeschwächt.

Änderungen gesamt: Blickwinkel 1: 7, Blickwinkel 2: 5, Blickwinkel 3: 8. Skript: vier neue Prüfungen (32,5/16,9 %, V = |Phi|, Phi mit getauschten Codes, Median `xt10`), Toleranzprüfung A4 ersetzt.

### Offene Punkte (bewusst nicht geändert)
- **Zeit:** Pflicht A1 bis A3 liegt mit 38 bis 42 Minuten am oberen Rand. Nicht gekürzt, weil jede Frage einen eigenen Lernschritt trägt; beim Testlauf messen. Falls zu lang: a2-staerke (wiederholt g2c) oder a1-west (Gegenstück zu a1-ost) zuerst streichen.
- **`eastwest` in Grundlage und Aufgaben:** bleibt (Entscheidung 3); als Gewichtungsmerkmal unvermeidlich, keine Aufgabenzahl wird verraten.
- **`spearman_rho()` nimmt `weights` an und ignoriert es** (gleiches ρ, kein „[Weighted]“). Der Plan sagt das ehrlich; ob das in mariposa eine Warnung bekommen sollte, ist eine Paketfrage.
- **Drei Werte von `wghtpew` je Landesteil** hängen mit dem Erhebungsweg (`mode`) zusammen; die Begründung „mehrere Teile der Erhebung“ bleibt bewusst allgemein.
- **Sitzung 5 wird parallel bearbeitet:** Die Schilder verlassen sich auf S5-Stand 23.11. (`rules = "rev"` mit `ep01` in Grundlage 4, χ² mit V in Ü3, „Zusammenhang ist keine Ursache“ in Grundlage 3). Beim Bau gegen die endgültige `sitzung05.md` abgleichen.

## Nacharbeit nach Kapitelprüfung (23.11.2026)
- **Auflösung zum Tipp** erscheint erst, wenn keine Frage der Aufgabe mehr offen ist (alle Fragen beantwortet), nicht schon nach der ersten gespeicherten Antwort (sie verriet V = 0,48, Gamma −0,54, r = 0,265). Gilt für A1 bis A4.
- **Mischpult** (Grundlage 1c): Regler Schrittweite 0,1; der Knopf „wie in Deutschland“ setzt 16,8.
- **Schichtbild:** Bildunterschrift ohne Farbwort („Teil rechts: gut und sehr gut“).
- **Bausteinlisten** (`s6-bausteine`) tragen `role="list"` (WebKit entfernt sonst die Listenrolle).
- **Gemeinsame Bausteine:** Die Zeile „Ab heute rechnen alle Vorlagen gewichtet …“ steht in `howToExtra`; Hinweise auf die freie Karte sind `MapLink` mit Begriffs-ID (weights, chi_square, cramers_v, goodman_gamma, kendall_tau, pearson, spearman, confounding).
- **Zahlen aus Konstanten:** V in der Auflösung zu A2 und im Plenum-Satz kommt aus `A2.v` über `de(...)`; übrige Zahlen bleiben Literale (vom Zahlenskript geprüft).
