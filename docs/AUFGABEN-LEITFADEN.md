# Leitfaden für die Kapitel im Lernpfad

Stand: 23.11.2026. Gilt für alle Sitzungen in `src/chapter/`. Grundlage ist die Spezifikation `docs/entwicklung/spezifikationen/2026-11-23-lernpfad-kapitel-design.md` (dort Abschnitt 5 Aufbau, Abschnitt 6 Bausteine, Abschnitt 7 Barrierefreiheit); dieser Leitfaden fasst die verbindlichen Regeln zusammen, einschließlich der Regeln, die beim Bau der elf Kapitel entstanden sind. Er ersetzt den Leitfaden vom 13.11.2026 (Rollentext, Werkzeugkasten, „kein fertiger Lösungscode im Schritt“, `filter(!is.na())`); die alten Aufgaben in `src/tasks/` bleiben nur als Bestand liegen und werden hier nicht mehr beschrieben.

## Grundsatz

Verständnis geht vor Technik: Die Studierenden sollen Verfahren, Interpretation und Voraussetzungen verstehen. R ist Werkzeug; Code wird gelesen, verstanden und angepasst, nicht frei geschrieben. Die Anstrengung gehört ins Denken über die Daten, nicht ins Entschlüsseln von Texten oder Syntax. Eine Aufgabe, die man nur durch Raten oder Durchklicken löst, ist ein Fehlschlag, auch wenn sie technisch läuft.

## Aufbau eines Kapitels (Variante B, verschränkt)

Entschieden ist Variante B: vorweg „R lesen“, dann je Thema erst die Grundlage, unmittelbar danach die Aufgabe, am Ende ein Überblick. Die Reihenfolge Grundlage, dann Aufgabe gilt ausnahmslos; Grundlage und Aufgabe tragen dieselbe Nummer.

```
Kopf: Stein mit Nummer, Titel, Begleitfigur mit Leitfrage
Wegweiser, Lernziele (Verfahren, Interpretation, Voraussetzungen, Code lesen)
Hinweis „schon bekannt, nur erinnert“ (frühere Sitzungen)
So arbeitest du mit dieser Seite
Sprungknöpfe fürs Seminar: Aufgabe 1 … N
Vorweg: R lesen (nur was neu ist; Bekanntes als Erinnerung mit Schild)
Thema k:  Grundlage k  (Karten: Beispiel, Kurz gesagt, Genauer erklärt, Häufige Verwechslung;
                        kein R-Code; „Schon klar? Direkt zu Aufgabe k“)
          Aufgabe k    (Pflicht oder Zusatz; Leitfrage; Ziel „Am Ende …“ mit Verweis auf
                        Grundlage k; „↑ Grundlage k nachlesen“)
Überblick
Mitnehmen: Das Wichtigste, Prüf dich selbst, R-Skript zum Herunterladen
```

Bestandteile einer Aufgabe, in dieser Reihenfolge:

1. **Erst festlegen:** Vorhersage (Auswahl), die beim Prüfen zitiert wird.
2. **Schritte** mit Code-Werkstätten und Bildern, die genau zu diesem Schritt gehören.
3. **Antwortfragen** mit Begründung bei Fehlern (nicht nur „falsch“).
4. **Hilfe in drei Stufen** (Denkanstoß, Wo schaue ich?, Lösung) und Hilfe bei R-Fehlermeldungen.
5. **Probier-Werkstatt** (zugeklappt, Titel „Weiterdenken (für die Aufgabe nicht nötig)“), startet mit einem ausführbaren Vorschlag zu einer Anschlussfrage.
6. **Lösungsweg ohne Grafik** (Text für Screenreader).
7. Bei Bedarf **„Fürs Plenum“**.

Pflicht- und Zusatzaufgaben sind gekennzeichnet; die Zeitplanung (Pflicht etwa 36 bis 43 Minuten Arbeitsphase) steht in den Sitzungsspezifikationen. Wiederholungen aus früheren Sitzungen bleiben, wo sie für das Neue nötig sind, kurz und mit grauem Schild „kennst du aus Sitzung …“ (`Known`; freier Text wie „Methoden Ia“ ist möglich). Lernpfad-Grundlagen und Seminaraufgaben nutzen verschiedene Variablen, damit die Vorbereitung die Seminaraufgabe nicht verrät.

Keine Rollenszenarien, keine „Werkzeugkasten“-Seite, keine Partnervariante: Das Kapitel führt selbst durch die Sitzung. Kein „(fiktiv)“ in Texten; Bilder mit Einzelpersonen zeigen konstruierte Beispielwerte („zum Beispiel …“).

## Code-Werkstatt und vorgefertigte Vorlagen

- **Die Vorlagen lösen die Aufgaben.** Anders als im alten Leitfaden steht der Lösungscode in der Vorlage; die Studierenden führen sie aus, lesen die Ausgabe und passen markierte Stellen an. Das Denken verlagert sich auf das Lesen und Deuten, nicht auf das Tippen.
- **Jede Vorlage läuft für sich allein.** Die Werkstatt setzt `allbus` vor jedem Ausführen auf den frisch geladenen Datensatz zurück. Was eine andere Vorlage umgepolt oder neu gebildet hat, kennt sie nicht. Darum bildet jede Vorlage die Variablen, die sie braucht, selbst (auch ein Umpolen steht in jeder Vorlage, die es braucht). Jede Vorlage wird einzeln mit der Datei durchlaufen (`scripts/chapter-r-export.ts`).
- **Probier-Werkstatt „Weiterdenken (für die Aufgabe nicht nötig)“:** zugeklappt, mit dem ausdrücklichen Hinweis, dass sie für die Aufgabe nicht gebraucht wird, und einem ausführbaren Vorschlag zu einer Anschlussfrage (`tryOut: true`).
- Markierte Stellen (⟦…⟧ im Quelltext) verschwinden nach einer Änderung und stehen zusätzlich als Liste mit Zeilennummer unter der Werkstatt.
- Tab bleibt Fokuswechsel. Tastenkürzel wie in RStudio: Strg/Cmd+Enter, Strg/Cmd+Umschalt+M (Pipe), Alt+− (`<-`), Strg/Cmd+Umschalt+C (Kommentar).
- Im Browser läuft R über webR 0.6.1 mit mariposa von r-universe; `library(tidyverse)` wird dort durch die Einzelpakete ersetzt, die Zeile `read_spss(…)` übersprungen. Ohne Internet (Offline-Datei) kann die Werkstatt nur kopieren.

## R-Code

- Immer `library(tidyverse)` und danach `library(mariposa)` (mariposa als Zweites, damit `read_spss()` usw. aus mariposa kommen); mariposa 0.7.4. Einlesen: `read_spss("ZA8831_v1-3-0.sav")` bzw. mit Dateiwahl.
- Pipe immer `%>%`, nie `|>`. Der Datensatz steht vorn, jede Funktion in eigener, eingerückter Zeile; auch bei nur einem Schritt:
  ```r
  allbus %>%
    frequency(pv01)
  ```
  Ausnahme sind die ersten beiden Sitzungen, die dem Folieneinstieg folgen (Sitzung 1 ohne Pipe, Sitzung 2 einfache Pipe mit einem Schritt, `codebook(allbus)` bleibt so).
- **Fehlende Werte weglassen mit `drop_na(x)`, ab Sitzung 4.** Nie `filter(!is.na(x))`. Die Folien benutzen dieselbe Schreibweise.
- **`to_label(x)` steht ab Sitzung 4 direkt in der Kette**, ohne `mutate()`: `allbus %>% to_label(hs01) %>% drop_na(hs01) %>% …`.
- **Neue Variablen immer mit `rec()` innerhalb von `mutate()`**, mit sprechendem Namen, mehrere zusammengehörige in einem `mutate()`:
  ```r
  allbus <- allbus %>%
    mutate(
      misstrauen = rec(pe01, rules = "1:2=1 [misstraut]; 3:4=0 [misstraut nicht]; else=NA"),
      nichtwahl  = rec(pv01, rules = "91=1 [würde nicht wählen]; 1:90=0 [würde wählen]; else=NA")
    )
  ```
  Ebenso `row_means(pick(…))` und Rechnungen. Datensatz-Funktionen ohne neue Spalte stehen direkt in der Kette (`to_label()`, `to_dummy()`).
- Zusammengehörige Schritte werden verkettet, nicht über Zwischenobjekte gelöst; ein Zwischenobjekt nur, wenn es mehrfach gebraucht wird (`modell <- …`, dann `summary(modell)`).
- Grafiken: zwischen den ggplot-Schichten steht `+` am Zeilenende; `labs(` in der lernpfadüblichen Form (Titel und Quelle je eigene Zeile).
- **Schriftbild** (geprüft mit `rStyleProblems()` aus `src/tasks/kit/rStyle.ts`, jedes Kapitel testet damit alle Vorlagen): `%>%` am Zeilenende; Einrückung zwei Leerzeichen; `mutate(` endet die Zeile und jede neue Variable steht in eigener Zeile; Kommentare in eigener Zeile über dem Block, nie hinter Code; eine Leerzeile zwischen Anweisungen; Zeilen höchstens 100 Zeichen. Für `labs()` gibt es keine Ausnahme mehr: eine R-Schreibweise überall.
- Codebuch immer als Ganzes (`codebook(allbus)`, im Browser als Text mit Wertelabels), nicht `codebook(allbus, a, b)`; wo ein Kapitel einzelne Variablen nachschlägt, steht das ausdrücklich in seinem R-Teil.
- Es werden nur Funktionen verwendet, die das Kapitel selbst oder ein früheres einführt. Auch in Rückmeldungen keine Funktion nennen, die nicht eingeführt ist.
- Jeder Code (Vorlagen, Lösungen, Skript zum Mitnehmen) wird mit der ALLBUS-Datei in R geprüft: `node --import tsx scripts/chapter-r-export.ts s04 > skript.R`, dann mit `ALLBUS_SAV` ausführen; dazu je Sitzung `sitzungNN-zahlen.R` in `docs/entwicklung/spezifikationen/2026-11-23-lernpfad-kapitel/`.

Wo welche Funktion eingeführt wird („neu heute“ im Teil „R lesen“ des Kapitels; spätere Kapitel markieren sie als „kennst du aus Sitzung …“):

| Sitzung | neu |
|---|---|
| 1 | Startblock, `library()`, `read_spss()`, Objekt und `<-`, Argumente; `find_var()`, `codebook()`, `frequency()` (ohne Pipe), R als Taschenrechner |
| 2 | Pipe `%>%` mit einem Schritt, `filter()` mit `==`; `codebook()` für einzelne Variablen nachschlagen |
| 3 | `describe()`; `frequency()` und Taschenrechner vertieft (Prozente selbst ausrechnen); `frequency()` ohne die fehlenden Werte mitzuzählen lesen |
| 4 | Kette mit mehreren Schritten, `to_label()`, `drop_na()`, `ggplot()` mit `aes()`, `geom_bar()`, `geom_histogram()` (`binwidth`), `geom_boxplot()`, `labs()`, `coord_cartesian()` (Zoomen gegen Filtern) |
| 5 | `mutate()` mit `rec()` (auch Umpolen), `crosstab()` mit Prozentbasen, Wiederholung `chi_square()` |
| 6 | Argument `weights = wghtpew`; `cramers_v()`, `phi()`, `goodman_gamma()`, `kendall_tau()`, `spearman_rho()`, `pearson_cor()` |
| 7 | `t_test()`, `summary()`, `oneway_anova()`, `tukey_test()`, Korrelationsmatrix mit `pearson_cor()` |
| 8 | `row_means()` mit `pick()` und `min_valid`, `reliability()` |
| 9 | `linear_regression()` (Formel mit `~`), `summary()` der Regression, `group_by()`, `levene_test()` |
| 10 | mehrere Prädiktoren `y ~ x1 + x2`, Adjusted R Square, VIF (Collinearity Statistics), `to_dummy()`, Interaktion |
| 11 | `logistic_regression()`, `exp()`, `tibble()` mit `c()`, `predict()`, `marginal_effects()` |

Genaue Fassungen stehen jeweils in `ReadR.tsx` des Kapitels; bei Abweichungen gilt das Kapitel.

## Antworten und Rückmeldungen

- **Feste Zielwerte für ZA8831 v1.3.0.** Erwartete Antworten sind feste Werte, damit Grundlagen und Antwortprüfung auch ohne geladene Datei funktionieren (Vorbereitung auf anderem Gerät). Jeder feste Wert wird in `allbus.local.test.ts` des Kapitels mit der echten Datei (`ALLBUS_SAV`) geprüft und liegt zusätzlich in `sitzungNN-zahlen.R` (Spezifikationsordner) mit seiner R-Rechnung vor. Die Versionsprüfung beim Laden (`validateAllbus`) bleibt.
- **Toleranzen dürfen benannte Sonderfälle nicht durchlassen.** Eine Toleranz (`tolerance`) deckt Rundung und Schreibweise ab, nie eine falsche Gruppierung oder einen bekannten Denkfehler: Gibt es einen typischen falschen Wert (z. B. Prozent mit falscher Basis), muss er außerhalb der Toleranz liegen und im Idealfall eine eigene Rückmeldung bekommen (`specialInput` bei Zahlfragen, `wrongByOption` bei Auswahl). Beispiel: In Sitzung 5 liegt die Toleranz so, dass 22,4 % nicht als richtig zählt.
- Zahleneingaben in deutscher und R-Schreibweise („65.000“ = 65, „5.209“ = 5209; ein R-Tausenderkomma „5,246“ zählt bei ganzzahligen Zielen als 5246). Beschriftung der Felder = ganze Frage aus Sicht der Studierenden; Hilfezeile (`help`) nennt Fundort oder Format und verrät nie die Antwort. Backtick-Abschnitte werden als Code dargestellt.
- Antworten in Sätzen mit Beispielsatz in einem anderen Fall oder mit offenen Stellen, nie die Antwort selbst.
- **Vorhersage und Auflösung.** Erst festlegen, dann rechnen: Die Vorhersage wird gesperrt, danach öffnen sich die Felder für R-Ergebnisse. **Die Auflösung der Vorhersage erscheint erst, wenn keine Frage der Aufgabe mehr offen ist.** Sonst verrät schon die erste Teilprüfung die übrigen Antworten. Entsprechend hängt kein Text, der eine R-Zeile oder ein Ergebnis vorwegnimmt, vor der Schätzung; solche Sätze erscheinen erst nach dem Vergleich (gleiche Information für alle, die sehen, und alle, die hören).
- Jedes anklickbare Element: Zeiger als Cursor, sichtbarer Hover-Zustand, eine Zeile Anleitung, Tastaturbedienung.

## Daten und Lizenz

- ALLBUS 2023, ZA8831 v1.3.0, Lizenz GESIS: Die Datei wird nicht ausgeliefert. Studierende laden ihre eigene Datei; sie bleibt im Browser (IndexedDB), bis sie entfernt wird, und wird nicht hochgeladen.
- **Keine Mikrodaten** in Repo, Texten, Zielwerten, Bildern oder Build: nur Aggregate (Häufigkeiten, Kennzahlen, Koeffizienten) und konstruierte Beispielwerte. Zeilen, die die Code-Werkstatt aus der eigenen Datei der Studierenden ausgibt (etwa `print` einzelner Befragter), sind erlaubt; die Regel betrifft nur, was im Repo oder in Texten steht.
- Ungewichtete Zahlen tragen den Hinweis „ungewichtet“; die Gewichtung wird in Sitzung 6 eingeführt, danach rechnen die Kapitel gewichtet (Ausnahmen, etwa α und N in Sitzung 8, stehen im Text).
- Aggregate werden gegen die Datei geprüft, nie nach Gefühl übernommen; Fragewortlaute und Itemtexte werden mit dem Codebuch abgeglichen.

## Barrierefreiheit (Pflicht, WCAG 2.2 AA)

Jedes Kapitel muss vollständig mit Screenreader und Tastatur nutzbar sein. Darum gilt:

- **Jede Grafik hat eine gleichwertige Textfassung mit den Werten** (Alternativtext oder Tabelle); interaktive Diagramme haben eine Textalternative; jede Aufgabe ist ohne Grafik lösbar (Lösungsweg ohne Grafik).
- **Keine Information allein durch Farbe.** Bildunterschriften und Texte nennen eine Farbe nur zusätzlich zu Form, Beschriftung oder Muster; Markierungen tragen Text.
- **Rückmeldungen laufen über Live-Regionen** (`aria-live`), nicht nur über Farbe und nicht doppelt gelesen. Persistente Live-Region, damit Meldungen auch beim ersten Mal vorgelesen werden (kein `display:none` auf leere Regionen); Ruhetexte stehen außerhalb der Live-Region.
- **Fokus:** Verschwindet ein Knopf oder erscheint ein Ergebnis, setzt das Kapitel den Fokus bewusst (z. B. `useFocusLater`, `focus.ts`). Formulare mit Labels und `aria-invalid`; Auswahlgruppen als `radiogroup`.
- Überschriften lückenlos (h2, h3, h4), Nicht-Text-Kontraste mindestens 3:1, Ziehziele mindestens 24 px, Schieber mit `aria-valuetext` (auch mit Dezimalstellen).
- Vorformatierte Ausgaben als Region mit Namen (`aria-label`), nicht als bloßes `pre`; markierte Code-Stellen zusätzlich als Liste mit Zeilennummer; kein versteckter Text im kopierbaren Code.
- Test mit Screenreader, möglichst mit Studierenden, die einen nutzen; in dieser Fassung noch nicht erfolgt (siehe Prüfstand).

## Sprache

Du-Form, kurze Sätze, einladend, keine Befehle oder Parolen, keine Witz-Pointen. Fachbegriff immer, dazu ein einfacher Einschub („Kurz gesagt“). Kein „·“ als Trenner neben Zahlen oder Formeln. Keine Spielmetaphern als Fachwörter. Bildsprache des Baukastens: Stein = Wert, Turm = Variable, Bauplatte = Datensatz, Aufkleber = Wertelabel, leerer gestrichelter Stein = NA, grau = fällt weg; Häufigkeits-Säulen heißen „Stapel“.

| Gemeint | Einheitlich | Nicht mehr |
|---|---|---|
| Person im Datensatz | Befragte | Fälle, obs. |
| Spalte im Datensatz | Variable | Spalte, Merkmal |
| Kurzbeschreibung einer Variable | Variablenlabel | Label, Kurzbeschreibung |
| Zahl im Datensatz | Code | Wert, Zahl |
| Wort zu einem Code | Wertelabel | Antwortstufe |
| mögliche Antworten | Ausprägungen | Kategorien |
| Antwort fehlt mit Grund | fehlende Werte | fehlende Angaben, Missings |
| Antwort fehlt in R ohne Grund | NA | namenloses NA |
| Frage innerhalb einer Skala | Item | Aussage |
| worauf sich Prozente beziehen | Prozentbasis | Nenner |

## Gestaltung

Baukasten wie das R-Workshop-E-Book: Fredoka (Überschriften), Nunito (Text), JetBrains Mono ohne Ligaturen (Code). Farben und Größen aus `src/chapter/chapter.css` und den Tokens in `src/styles.css`; keine eigenen px-Werte unter der Mindestgröße (Test `src/lib/typeScale.test.ts`). Grafiken sind SVG im Baukasten-Stil mit Alternativtext, als TS-Module eingebunden (`scripts/svg-to-ts.mjs` erzeugt `bilder/index.ts`; kein `?raw`-Import, damit Tests unter Node laufen). Code-Werkstatt hell: Funktion grün, Text orange, `%>%` und `+` braun, Zahlen lila, Kommentar grau. Begleitfiguren: `src/chapter/companions/`.

## Ein neues Kapitel anlegen

1. **Ordner** `src/chapter/sNN/` mit `Session<N>.tsx` (exportiert `Session<N>` und `session<N>Status`), `ReadR.tsx`, `Foundations.tsx`, `Tasks.tsx`, `Workshop.tsx` (falls die Sitzung eigene Hilfen braucht), `content.ts` (Texte, feste Zielwerte als benannte Konstanten, Codevorlagen `TEMPLATES`, Fragen `QUESTIONS`, Vorhersagen `PREDICTIONS`, Hilfen `HINTS`, Skript `SCRIPT`), `figures/` und ggf. `bilder/`, `sNN.css`. Bausteine kommen aus `src/chapter/blocks/` (`ChapterLayout`, `Card`, `Foundation`, `TaskBlock`, `Questions`, `Predict`, `TryOut`, `TakeAway` …) und `src/chapter/workshop/` (`CodeWorkshop`).
2. **Registry:** in `src/chapter/registry.ts` ein Import und eine Zeile `N: { Component: Session<N>, status: session<N>Status, live: false }`. `live: false` heißt: nur mit `?vorschau=kapitel` sichtbar; `live: true` ersetzt die bisherige Aufgabe für alle. Über `live` entscheidet allein der Dozent.
3. **CSS:** in `src/main.tsx` die Zeile `import './chapter/sNN/sNN.css';` (nur dort, Komponenten importieren kein CSS, weil ihre Tests unter Node laufen).
4. **R-Export:** in `scripts/chapter-r-export.ts` Import von `TEMPLATES` als `SNN` und Eintrag in `CHAPTERS`.
5. **Tests**, alle in der Kapitelmappe: `content.test.ts` (Struktur, Vorlagen im Schriftbild, feste Werte, Selbstständigkeit jeder Vorlage), `foundations.test.ts`, `sessionN.test.ts` (Überschriften h2 bis h4 lückenlos, Sprungknöpfe, Alternativtexte, Live-Regionen, Status) und `allbus.local.test.ts` (alle festen Zielwerte gegen ZA8831 v1.3.0 mit `ALLBUS_SAV`; ohne Datei übersprungen). Dazu `src/chapter/registry.test.ts` (Vorschau-Verhalten und Sitzungen ohne Kapitel).
6. **Zahlen:** `sitzungNN-zahlen.R` neben die Spezifikation legen und mit der Datei ausführen; jede Zahl im Text ist dort belegt.
7. **Prüfen:** `npx tsc --noEmit`, `npm run test`, dasselbe mit `ALLBUS_SAV=… npm run test`, `scripts/chapter-r-export.ts` mit `Rscript`, Ansicht im Browser bei 1200 und 390 px (`?vorschau=kapitel`), Screenreader-Durchgang.

## Technik

- Fortschritt in `localStorage` (bestehende Schlüssel bleiben; neue Zustandsfelder bekommen Vorgaben und vorsichtiges Einlesen), die ALLBUS-Datei in IndexedDB (`allbusStore`, geteilt von allen Sitzungen und der Datei-Zone).
- Antworten, Vorhersagen und Status laufen über `src/chapter/state.ts` und `answers.ts`; `chapterStatus` liefert „offen/läuft/erledigt“ für die Sitzungsliste.
- Noch nicht umgebaute Sitzungen nutzen die gespeicherte Datei, wenn vorhanden.
