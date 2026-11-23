# Lernpfad als Kapitel: Sitzungen im Baukasten-Design mit Code-Werkstatt

Stand: 23.11.2026. Entstanden im Gespräch mit dem Dozenten; Referenz-Prototyp für Sitzung 4 in
`2026-11-23-lernpfad-kapitel/prototyp/sitzung4.html` (lokal im Browser öffnen; die Code-Werkstatt braucht Internet für webR).

## 1. Anlass und Ziel

Nach Sitzung 1–3 steigen viele Studierende aus. Rückmeldung: Der Lernpfad sei „zu kryptisch und zu abstrakt“, die Aufgabentexte schwer, der R-Code zu anspruchsvoll (z. B. `filter(!is.na(x))`). Der Input lag nur auf den Folien, im Atlas stand allein die Aufgabe; wer den Input verpasst oder nicht verstanden hat, fand nichts zum Nacharbeiten.

**Ziel:** Jede Sitzung wird im Lernpfad ein in sich geschlossenes, freundlich gestaltetes Kapitel, mit dem Studierende ohne Vorkenntnisse die Verfahren der Sitzung nachvollziehen, im Seminar anwenden und danach nacharbeiten können. Zentral ist das Verständnis der statistischen Verfahren, ihrer Interpretation und ihrer Voraussetzungen. R ist Werkzeug: Code wird gelesen, verstanden und angepasst, nicht frei geschrieben.

**Ablauf einer Sitzung:** Input im Seminar (Folien) → Arbeitsphase im Lernpfad → Plenum. Vor und nach dem Seminar dient der Lernpfad zum Vor- und Nacharbeiten.

## 2. Ziele, Nicht-Ziele, Anti-Ziele

**Ziele**
- Jede Sitzung: Grundlagen in Bildern, die den Folieninput vertiefen, und darauf direkt aufbauende Aufgaben mit klarem Ziel.
- Ausführbarer, kopierbarer R-Code direkt im Lernpfad (Code-Werkstatt), mit denselben Tastenkürzeln wie RStudio.
- Gestaltung wie das R-Workshop-E-Book („Baukasten“), damit E-Book, Atlas und Kurs wie aus einem Guss wirken.
- Volle Barrierefreiheit: alles mit Screenreader und Tastatur nutzbar.

**Nicht-Ziele**
- Studierende sollen R nicht frei schreiben können.
- Die freie Karte wird nicht umgebaut (bleibt Erweiterung bei Interesse; Lernpfad verlinkt hinein).
- Keine Rollenszenarien mehr (z. B. „Grafikredaktion eines Schulbuchverlags“); sie kosten Zeit und lenken vom Kern ab.

**Anti-Ziele (wäre ein Fehlschlag, auch wenn es technisch läuft)**
- Frust durch Unverständnis: Aufgaben, die man nur durch Raten oder Durchklicken löst.
- Die Vorbereitung verrät die Seminaraufgaben (gleiche Variablen, gleiche Auflösungen).
- Zwei Schreibweisen für dasselbe (Folien `filter(!is.na())`, Lernpfad `drop_na()`).
- Grafiken, die etwas anderes zeigen als den Schritt, neben dem sie stehen.
- Mikrodaten aus dem ALLBUS in Repo, Build oder Bildern.

## 3. Rahmenbedingungen

- **Daten:** ALLBUS 2023 (ZA8831 v1.3.0), Lizenz GESIS: Datei nicht ausliefern; Studierende laden ihre eigene Datei. In Texten und Bildern nur Aggregate; Bilder mit Einzelpersonen zeigen konstruierte Beispielwerte („zum Beispiel …“), ohne „(fiktiv)“.
- **R-Stil:** `library(tidyverse)` vor `library(mariposa)`, mariposa 0.7.4, Pipe `%>%` (nie `|>`), Ketten wie im bestehenden Leitfaden (`docs/AUFGABEN-LEITFADEN.md`, Abschnitt R-Code), aber `drop_na(x)` statt `filter(!is.na(x))` und `to_label(x)` direkt in der Kette.
- **Sprache:** Du-Form, einladend, keine Witz-Pointen; Fachbegriff plus „Kurz gesagt“; kein „·“ als Trenner neben Zahlen oder Formeln; ungewichtete Zahlen mit Hinweis, Gewichtung in Sitzung 6.
- **Technik:** Bestehender Atlas (React 19, Vite, TypeScript, GitHub Pages, Push auf `main` geht live, Offline-Fassung als eine HTML-Datei). Repo liegt in iCloud Drive (ausgelagerte Dateien können Git stören, siehe Prüfstand 23.11.2026).
- **Zeit:** Arbeitsphase im Seminar etwa 45 Minuten; Grundlagen je Thema 10 bis 15 Minuten.

## 4. Ansätze und Entscheidungen

### 4.1 Reihenfolge von Verstehen und Aufgaben (entschieden: B)
- A „Verstehen vorn“: erst alle Grundlagen, dann alle Aufgaben. Wie ein E-Book-Kapitel, aber zwischen Grundlage 1 und Aufgabe 1 liegen drei weitere Grundlagen.
- **B „verschränkt“ (gewählt):** Vorweg „R lesen“, dann je Thema erst die Grundlage, unmittelbar danach die Aufgabe; am Ende ein Überblick. Jede Grundlage hat „Schon klar? Direkt zu Aufgabe N ↓“, jede Aufgabe „↑ Grundlage N nachlesen“, oben Sprungknöpfe zu allen Aufgaben fürs Seminar. Grund: Das Verstehen soll unmittelbar zur Aufgabe hinleiten und den Folieninput vertiefen.
- C „Aufgaben vorn, Verstehen hinten“ (früherer Stand): verworfen, die Grundlagen standen zu weit weg.

### 4.2 Zuschnitt der Grundlagen (entschieden: Spiegeln)
Eine Grundlage pro Aufgabe, gleiche Nummer. Kein R-Code in den Grundlagen. Inhalte ohne eigene Aufgabe werden einer Aufgabe zugeordnet (Sitzung 4: „Erst schätzen“ und „Wo beginnt die Achse?“ gehören zu Grundlage 1; Aufgabe 1 hat dazu einen Deuten-Schritt). Ein Überblick am Ende fasst zusammen (Sitzung 4: Grafikwahl und Voraussetzungen).

### 4.3 R im Lernpfad (entschieden: Code-Werkstatt mit webR)
- Nur kopieren nach RStudio: einfach, aber Studierende müssen ständig wechseln.
- **Code-Werkstatt (gewählt):** editierbarer Code im Lernpfad, läuft mit webR im Browser (R 4.6, mariposa 0.7.4 von `yannickdiehl.r-universe.dev`). Im Prototyp getestet: Start etwa 20 s, Einlesen der Datei etwa 10–20 s, danach sofort. Kopieren nach RStudio bleibt möglich.

### 4.4 ALLBUS-Datei (entschieden: einmal freischalten, dauerhaft im Browser)
- Bisher: nur im Tab gehalten, nach Neuladen weg.
- **Gewählt:** Freigeschaltet wird wie heute durch das Laden der Datei an der bestehenden Stelle (die Datei-Zone, die erscheint, solange keine Datei da ist; für die meisten in Sitzung 1). Neu ist nur, dass die Datei danach in IndexedDB des Browsers gespeichert bleibt (bleibt auf dem Rechner, nichts wird hochgeladen) und auch nach dem Neuladen für alle Sitzungen gilt. Keine neue Start- oder Einleitungsseite. In den Sitzungen kein Dateistatus. Fehlt die Datei (anderes Gerät, Speicher gelöscht, Safari nach etwa 7 Tagen ohne Besuch), bietet die Code-Werkstatt selbst das Freischalten an. `navigator.storage.persist()` anfragen. Möglichkeit zum Entfernen der Datei an der Freischalt-Stelle.

### 4.5 Gestaltung (entschieden: Baukasten des E-Books)
Schriften Fredoka (Überschriften), Nunito (Text), JetBrains Mono ohne Ligaturen (Code); Sitzungen als Steine in Kapitelfarben; Begleitfiguren aus `RWorkshop/Bilder/begleiter/`; Bildsprache Stein = Wert, Turm = Variable, Bauplatte = Datensatz, Aufkleber = Wertelabel, leerer gestrichelter Stein = NA, grau = fällt weg; Häufigkeits-Säulen heißen „Stapel“. Code-Werkstatt hell (Kopf hellgelb, Code auf Weiß, Färbung: Funktion grün, Text orange, `%>%`/`+` braun, Zahlen lila, Kommentar grau). Inhalt nutzt die volle Breite zwischen den Seitenleisten.

## 5. Aufbau einer Sitzung

```
Kopf: Stein mit Nummer, Titel, Begleitfigur mit Leitfrage
Wegweiser · Lernziele (Verfahren, Interpretation, Voraussetzungen, Code lesen)
Hinweis „schon bekannt, nur erinnert“ (frühere Sitzungen)
So arbeitest du mit dieser Seite
Sprungknöpfe fürs Seminar: Aufgabe 1 … N
Vorweg: R lesen (nur was in dieser Sitzung neu ist; Bekanntes als Erinnerung mit Schild)
Thema k (k = 1 … N):
  Grundlage k  – Karten nach dem Muster Beispiel → Kurz gesagt → Genauer erklärt → Häufige Verwechslung
               – Bilder zum Verstehen, interaktiv wo sinnvoll, kein R-Code
               – „Schon klar? Direkt zu Aufgabe k“
  Aufgabe k    – Pflicht oder Zusatz; Leitfrage; Ziel („Am Ende …“) mit Verweis auf Grundlage k
               – Erst festlegen (Vorhersage, wird beim Prüfen zitiert)
               – Schritte mit Code-Werkstätten und Bildern genau zu diesem Schritt
               – Probier-Werkstatt „Weiterdenken“: zugeklappt, ausdrücklich „für die Aufgabe nicht nötig“
                 (die Vorlagen lösen die Aufgabe), startet mit einem ausführbaren Vorschlag zu einer Anschlussfrage
               – Antwortfragen mit Begründung bei Fehlern
               – Hilfe in drei Stufen (Denkanstoß, Wo schaue ich?, Lösung), Hilfe bei R-Fehlermeldungen
               – Lösungsweg ohne Grafik (für Screenreader)
               – ggf. „Fürs Plenum“
Überblick (Zusammenfassung der Themen)
Mitnehmen: Das Wichtigste, Prüf dich selbst (mit Begründungen), R-Skript zum Herunterladen
```

Wiederholungen aus früheren Sitzungen bleiben, wo sie für das Neue nötig sind, kurz und mit grauem Schild „kennst du aus Sitzung …“. Lernpfad-Grundlagen und Seminaraufgaben nutzen verschiedene Variablen.

## 6. Bausteine im Atlas

- **Kapitel-Layout** für Sitzungen (ersetzt den bisherigen Aufbau aus `RoleBrief`, `Toolbox`, `StepGuide` usw. für umgebaute Sitzungen). Inhaltsverzeichnis rechts, Sitzungsliste links wie heute, aber im Baukasten-Stil.
- **Grundlage-Block** und Karten-Komponente mit „Kurz gesagt“, „Genauer erklärt“ (natives `details`), „Häufige Verwechslung“, Wiederholungs-Schild.
- **Aufgabe-Block** mit Ziel, Festlegen, Schritten, Antwortprüfung (Zahleneingaben in deutscher und R-Schreibweise, z. B. „65.000“ = 65; „5.209“ = 5209), Hilfe-Stufen, Fehlerhilfe.
- **Code-Werkstatt:** Textarea mit Zeilennummern, Hervorhebung der anzupassenden Stellen (verschwindet nach Änderung), Färbung als Hintergrundebene, Tastenkürzel (Strg/Cmd+Enter ausführen, Strg/Cmd+Umschalt+M Pipe, Alt+− `<-`, Enter rückt nach `%>%`/`+` ein und richtet in offenen Klammern aus, Klammern und Anführungszeichen schließen sich, Strg/Cmd+Umschalt+C Kommentar), Einfüge-Leiste, Ausgabe mit Text, Meldungen und Grafik. Tab-Taste bleibt Fokuswechsel (Barrierefreiheit). webR erst beim ersten Ausführen laden. `installPackages` mit ausdrücklichen `repos` (sonst kommt mariposa 0.7.3 aus repo.r-wasm.org). `library(tidyverse)` im Browser durch die Einzelpakete ersetzen; `read_spss(...)`-Zeile überspringen, weil `allbus` schon geladen ist.
- **Freischalten des Lernpfads** an der bestehenden Datei-Zone (`DataDrop`), die zusätzlich in IndexedDB speichert; beim Start liest der Atlas die gespeicherte Datei und gilt als freigeschaltet. Text der Zone anpassen („bleibt in deinem Browser gespeichert, bis du sie entfernst; hochgeladen wird nichts“) und eine Möglichkeit zum Entfernen anbieten. Der SPSS-Leser `src/sandbox/readSav.ts` bleibt.
- **Bilder:** SVG im Baukasten-Stil, erzeugt mit dem Bild-Werkzeug des E-Books (`RWorkshop/figuren/`, nur lesend genutzt) plus einem Modul je Sitzung (Sitzung 4: `2026-11-23-lernpfad-kapitel/bilder/kap90.py`; das Werkzeug braucht `%>%` statt `|>` und eine Zielordner-Variable, siehe dort). Jedes Bild mit gleichwertigem Alternativtext.
- **Speicher:** Fortschritt wie heute in `localStorage` (Schlüssel bleiben), ALLBUS in IndexedDB.

## 7. Barrierefreiheit (Pflicht, WCAG 2.2 AA)

Jede Grafik mit gleichwertiger Textfassung (Inhalt, Werte); interaktive Diagramme mit Textalternative oder Tabelle; jede Aufgabe ohne Grafik lösbar; Rückmeldungen per `aria-live`, nicht nur per Farbe; Formulare mit Labels und `aria-invalid`; Fokusführung, wenn Knöpfe verschwinden; Überschriften lückenlos; Nicht-Text-Kontraste ≥ 3:1; markierte Code-Stellen zusätzlich als Liste mit Zeilennummer; kein versteckter Text im kopierbaren Code. Test mit Screenreader, möglichst mit der Studentin selbst.

## 8. Pilot: Sitzung 4 „Daten sehen“

Inhalt wie im Referenz-Prototyp (Abschnitt 1). Themen und Variablen:

| Thema | Grundlage (Variablen) | Aufgabe (Variablen) |
|---|---|---|
| 1 Balken und Häufigkeiten | Schätzen, Turm → Stapel, Achse (ls01, West/Ost) | A1 Gesundheit, Pflicht (hs01, `to_label`, `drop_na`, Achse deuten) |
| 2 Formen | vier Formen, Formen-Labor (mp05, ls01, dk11, vm18) | A2 Rätselkasten, Zusatz (dw15, pa01, pa02a, vm20, pt03) |
| 3 Histogramm | Steine in Kisten (age) | A3 Bearbeitungsdauer, Zusatz (xt10, Ausschnitt, `binwidth`) |
| 4 Boxplot | Lineal → Boxplot, Kurzarbeit, Alter West/Ost (age, eastwest) | A4 Erhebungsweg, Pflicht (xt10 × mode, Zoomen gegen Filtern) |
| Überblick | Entscheidungsbaum, Voraussetzungen | – |

Alle Zahlen und Vorlagen sind gegen ZA8831 v1.3.0 mit mariposa 0.7.4 geprüft (Skripte und Ergebnisse siehe Abschlussbericht im Prüfstand, wenn umgesetzt).

## 9. Folgearbeiten außerhalb des Atlas

- **Folien Sitzung 4** (`Seminarvorbereitung/_build_folien_s4.py`): auf `drop_na()` und `to_label()` in der Kette umstellen; Arbeitsphase und Plenum an A1–A4 angleichen (alter Rätselkasten, „Grafikredaktion“, Achse West/Ost); Input 9 (Histogramm der Bearbeitungsdauer) nimmt A3 vorweg und soll eine andere Variable zeigen.
- **Leitfaden** `docs/AUFGABEN-LEITFADEN.md`: durch die Regeln dieses Dokuments ersetzen (Rollentext, `Toolbox`, „kein fertiger Lösungscode im Schritt“ entfallen; `drop_na`; Werkstatt; Grundlage/Aufgabe-Paare). Funktionstabelle je Sitzung behalten, `to_label()` in Sitzung 4 als neu führen.

## 10. Rollout

1. Gemeinsame Bausteine (Abschnitt 6) und Freischalten; Sitzung 4 als Pilot nach dem Prototyp. **Entscheidung des Dozenten: erst Vorschau, dann live.** Die neue Sitzung 4 ist zunächst nur über eine versteckte Vorschau-Adresse erreichbar (z. B. URL-Parameter); bis zur Freigabe bleibt die bisherige Aufgabe `grafik` für alle sichtbar. Das dauerhafte Speichern der Datei darf sofort für alle live gehen. Einen festen Termin gibt es noch nicht; Sitzung 4 hat noch nicht stattgefunden.
2. Testlauf von Sitzung 4 über die Vorschau mit wenigen Studierenden, darunter Studierende, die einen Screenreader nutzen; Zeitbedarf messen (Aufgaben realistisch 45 Minuten?). Danach Freigabe durch den Dozenten.
3. Sitzungen 1–3 nacharbeiten (Studierende holen sie nach), dann 5–11 in der Reihenfolge des Semesters.
4. Je Sitzung: Prototyp → Prüfung durch Agenten (schwache Studentin, Didaktik, Fachliches/Barrierefreiheit) → Umsetzung → Tests, R-Skripte, Browser bei 1200 und 390 px.

## 11. Festlegungen aus der Bauprüfung

- **Antwortprüfung (Festlegung von Claude):** Erwartete Antworten sind feste Werte für ZA8831 v1.3.0 (wie im Prototyp), damit Grundlagen und Antwortprüfung auch ohne geladene Datei funktionieren (anderes Gerät, Vorbereitung). Jeder feste Wert wird in einem Echtdaten-Test (`*.local.test.ts` mit `ALLBUS_SAV`) gegen die Datei geprüft. Die Datei wird nur für die Code-Werkstatt gebraucht. Die vorhandene Versionsprüfung beim Laden (`validateAllbus`) bleibt.
- **Übergangszeit (Festlegung von Claude):** Noch nicht umgebaute Sitzungen nutzen die gespeicherte Datei, wenn sie vorhanden ist; ihre bisherige Datei-Zone bleibt nur als Ausweg und speichert beim Laden ebenfalls in den gemeinsamen Speicher. So gibt es von Anfang an nur einen Ort, an dem die Datei liegt, und nichts im laufenden Semester bricht.
- **Freischalten sperrt nichts (Festlegung von Claude):** Ohne Datei sind alle Grundlagen, Aufgabentexte und Antwortprüfungen nutzbar; nur die Code-Werkstatt bittet um die Datei.

## 12. Dem Umsetzenden überlassen

Komponentenzuschnitt und Dateistruktur in React; ob webR über CDN oder npm eingebunden wird (Version festlegen); Laden der Bilder (Import als Asset oder Inline-SVG); Tests für Tastenkürzel und Antwortprüfung; Umgang mit der Offline-Fassung (Code-Werkstatt braucht Internet: dort Hinweis und nur Kopieren).
