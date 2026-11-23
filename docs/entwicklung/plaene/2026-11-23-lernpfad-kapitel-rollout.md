# Lernpfad als Kapitel, Teil B: alle übrigen Sitzungen umbauen – Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Die Sitzungen 1–3 und 5–11 werden nach dem Muster von Sitzung 4 zu Kapiteln umgebaut, jede mit Grundlagen, Aufgaben, Code-Werkstatt und Mitnehmen, und nach Freigabe durch den Dozenten live geschaltet.

**Architecture:** Jede Sitzung nutzt ausschließlich die Bausteine aus Teil A (`src/chapter/blocks/`, `src/chapter/workshop/`) und bekommt einen eigenen Ordner `src/chapter/sNN/` mit `content.ts`, `allbus.local.test.ts`, `Foundations.tsx`, `Tasks.tsx`, `SessionN.tsx` und Bildern. Inhalte entstehen nicht im Code, sondern zuerst als HTML-Prototyp, der mit dem Dozenten abgestimmt und von Agenten geprüft wird; erst der freigegebene Prototyp wird übertragen. Die alte Aufgabe der Sitzung bleibt bis zur Live-Schaltung erreichbar.

**Tech Stack:** wie Teil A; Prototypen als einzelne HTML-Datei (Vorlage `prototyp/sitzung4.html`); Bilder mit einer Kopie von `RWorkshop/figuren` plus Modul `kapNN.py`.

**Spec:** `docs/entwicklung/spezifikationen/2026-11-23-lernpfad-kapitel-design.md` (§5 Aufbau, §6 Bausteine, §7 Barrierefreiheit, §10 Rollout). Voraussetzung: Teil A (`docs/entwicklung/plaene/2026-11-23-lernpfad-kapitel-bausteine-und-pilot.md`) ist umgesetzt und Sitzung 4 vom Dozenten freigegeben (Spec §10, Schritt 2).

## Global Constraints

- Alle Global Constraints aus Teil A gelten.
- Inhalt jeder Sitzung wird mit dem Dozenten entwickelt: Gliederung und Prototyp brauchen je eine ausdrückliche Freigabe, bevor weitergebaut wird.
- Lernpfad-Grundlagen und Seminaraufgaben nutzen verschiedene Variablen; die Vorbereitung verrät keine Auflösung.
- Wiederholungen aus früheren Sitzungen kurz und mit grauem Schild „kennst du aus Sitzung …“; Code, der in einer früheren Sitzung eingeführt wurde, wird in derselben Schreibweise wiederverwendet.
- Jede Aufgabe: Vorlagen lösen die Aufgabe; die Probier-Werkstatt ist zugeklappt, „für die Aufgabe nicht nötig“ und startet mit einem ausführbaren Vorschlag zu einer Anschlussfrage.
- Grafiken zeigen genau den Schritt, neben dem sie stehen; jede mit gleichwertiger Textfassung.
- Gewichtung: Sitzungen 1–5 ungewichtet mit Hinweis, ab Sitzung 6 gewichtet mit `wghtpew` (wie im bisherigen Lernpfad).
- Speicherschlüssel der alten Aufgaben bleiben unangetastet; der Kapitelstatus kommt aus `statistikatlas.kapitel.v1`.

## Änderung durch den Dozenten (23.11.2026)

„Setze bitte alle Teile um und schaue später drüber – also auch Teil B (alles)“. Daraus folgt für die Umsetzung:
- Schritt 2 und 5 (Freigaben) entfallen. Gliederung und Kapitel entstehen direkt; die Agentenprüfung (Schritt 4) ersetzt die Freigaben, offene Fragen entscheidet der Umsetzende und hält sie in `sitzungNN.md` fest.
- Kein eigener HTML-Prototyp: Das Kapitel wird direkt mit den Bausteinen aus Teil A im Atlas gebaut; geprüft wird die gerenderte Seite (`?vorschau=kapitel`).
- Nichts geht live und nichts wird gepusht („schalte doch noch nichts live am ende, sondern lass mich nochmal alles kontrollieren“): alle Kapitel `live: false`, alles bleibt auf dem lokalen Zweig `lernpfad-kapitel`.
- Folien (Schritt 9) werden für Teil B nicht angefasst; Abweichungen zwischen Folien und Kapitel werden je Sitzung in `sitzungNN.md` aufgelistet.
- Sitzung 3: kein Filter-Code für fehlende Werte; `drop_na()` bleibt in Sitzung 4 neu (wie die Folien von Sitzung 4).

## Review Focus

1. **Studierende mit altem Fortschritt** (Sitzung schon in alter Form bearbeitet): Nach der Live-Schaltung startet das Kapitel offen; kein Fehler, kein Datenverlust im alten Schlüssel. → Test in jedem Sitzungs-Task, Schritt 7.
2. **Sitzung 1 als Ort des Freischaltens**: Wer zum ersten Mal kommt, findet die Datei-Zone ohne Suchen und versteht, dass sie nur einmal nötig ist. → Test in Task 1, Schritt 7.
3. **Code aus früheren Sitzungen, der sich geändert hat** (`filter(!is.na())` → `drop_na()`): In keinem Kapitel steht die alte Schreibweise. → `content.test.ts` je Sitzung.
4. **Sitzungen mit Gewichtung**: Vorlagen und feste Antworten passen zueinander (gewichtet gegen gewichtet). → Echtdaten-Test je Sitzung ab 6.
5. **Zeitbedarf**: Pflichtaufgaben im Seminar realistisch in 45 Minuten. → Simulation „schwache Studentin“ in Schritt 4 jedes Sitzungs-Tasks misst die Zeit.

---

## Ablauf je Sitzung (gilt für Task 1 bis 10)

Jeder Sitzungs-Task hat dieselben Schritte. Die Tabelle am Ende jedes Tasks nennt, was sitzungsspezifisch ist.

- [ ] **Schritt 1: Quellen sammeln.** Folien der Sitzung (`Seminarvorbereitung/` im Kursordner), bisherige Aufgabe (`src/tasks/<ordner>/content.ts`), Konzept (`docs/entwicklung/spezifikationen/2026-09-29-lernpfad-aufgaben/sitzung-NN.md`), Begriffe aus `src/domain/curriculum.ts`. Ergebnis: Liste der Verfahren, Interpretationen, Voraussetzungen und der R-Funktionen, die neu sind.
- [ ] **Schritt 2: Gliederung vorschlagen und freigeben lassen.** Themen 1…N je mit Grundlage (Variablen) und Aufgabe (Variablen, Pflicht oder Zusatz), Überblick, Lernziele. Als Tabelle wie Spec §8 in `docs/entwicklung/spezifikationen/2026-11-23-lernpfad-kapitel/sitzungNN.md`. **Warten auf Freigabe des Dozenten.**
- [ ] **Schritt 3: Prototyp bauen.** `…/2026-11-23-lernpfad-kapitel/prototyp/sitzungNN.html` aus `sitzung4.html` als Vorlage; alle Zahlen mit R gegen ZA8831 v1.3.0 und mariposa 0.7.4 ermitteln, R-Skript dazu unter `…/sitzungNN-zahlen.R`. Bilder mit `bilder/kapNN.py`.
- [ ] **Schritt 4: Agentenprüfung.** Drei Agenten parallel: schwache Studentin ohne Vorwissen (spielt die Seite durch, misst die Zeit, notiert Stolperstellen), Didaktik (Grundlage führt in Aufgabe, Aufgaben bringen zum Nachdenken), Fachliches und Barrierefreiheit (Zahlen, Begriffe, Textfassungen, Überschriften, Tastatur). Danach eine Zusammenhangsprüfung (Opus 5.5, hohe Anstrengung): Führt alles ineinander, hat jede Aufgabe die nötigen Informationen? Befunde einarbeiten.
- [ ] **Schritt 5: Dem Dozenten im Browser zeigen.** Änderungswünsche einarbeiten. **Warten auf Freigabe des Prototyps.**
- [ ] **Schritt 6: Übertragen in den Atlas.** Ordner `src/chapter/sNN/` nach dem Muster von `src/chapter/s04/` (Teil A, Tasks 8–10): erst `content.ts` mit Echtdaten-Test (Test zuerst, FAIL, füllen, PASS), dann Grundlagen, dann Aufgaben und Zusammenbau, je mit Rendertests wie in Teil A Task 9 und 10. Eintrag in `chapterRegistry` mit `live: false`.
- [ ] **Schritt 7: Tests.** `tsc --noEmit`; alle Tests grün; Echtdaten-Test grün; `node --import tsx scripts/chapter-r-export.ts sNN > /tmp/sNN.R && Rscript /tmp/sNN.R` ohne Fehler; Test „alter Fortschritt“: `renderSession(i, true, { tasks: { <alter Schlüssel>: <gespeicherter Endzustand der alten Aufgabe> } }, true)` rendert das Kapitel, Status „Aufgabe offen“.
- [ ] **Schritt 8: Browser.** `?vorschau=kapitel`, 1200 px und 390 px, Werkstätten ausführen, keine Konsolenfehler, VoiceOver-Stichprobe.
- [ ] **Schritt 9: Folien angleichen.** Code auf den Folien in derselben Schreibweise; Arbeitsphase und Plenum verweisen auf die Aufgaben des Kapitels.
- [ ] **Schritt 10: Commit, Bericht, Live-Schaltung.** Commit `feat: session N as a chapter`; Eintrag in `docs/PRUEFSTAND.md`. Live (`live: true`) und Push nur auf Wort des Dozenten.

---

### Task 1: Sitzung 1 „Einstieg“
| Bisher | `s01` (`src/tasks/s01-schon-gefragt/`) |
|---|---|
| Kern | R und RStudio, Daten einlesen, Codebuch und Variablensuche |
| Besonderheit | Hier wird der Lernpfad freigeschaltet: Datei-Zone als eigener Schritt in Thema 1 mit Erklärung „einmal laden, bleibt im Browser“; Werkstatt-Grundlagen (Ausführen, Zurücksetzen, Kürzel) werden hier eingeführt und später nur erinnert. |

### Task 2: Sitzung 2 „Vom Fragebogen zum Datensatz“
| Bisher | `s02` (`src/tasks/s02-datenerfassung/`) |
|---|---|
| Kern | Datenmatrix, Variable, Fall, Wert, Variablen- und Wertelabels, Datentypen umwandeln |
| Besonderheit | Bildsprache Bauplatte/Turm/Stein und Aufkleber (Wertelabel) wird hier eingeführt; `to_label()` als Vorgriff nur erwähnen, Einführung in Sitzung 4 bleibt. |

### Task 3: Sitzung 3 „Erste Auszählung“
| Bisher | `s03` (`src/tasks/s03-stuehle/`) |
|---|---|
| Kern | Häufigkeiten, fehlende Werte, gültige und fehlende Fälle |
| Besonderheit | Fehlende Werte sind hier Thema, `drop_na()` kommt bisher erst in Sitzung 4 (Vorher-Nachher). **In Schritt 2 vom Dozenten entscheiden lassen:** `drop_na()` schon hier einführen (dann in Sitzung 4 nur erinnern, „neu heute“ entfernen, Schild „kennst du aus Sitzung 3“) oder Sitzung 3 ohne Filter-Code lassen. Die alte Schreibweise `filter(!is.na())` taucht in keinem Fall auf. |

### Task 4: Sitzung 5 „Kreuztabellen“
| Bisher | `s04` (`src/tasks/s04-nenner-check/`) |
|---|---|
| Kern | Prozentbasen, Umkodieren mit `rec()` |
| Besonderheit | Rechenkern `src/tasks/kit/stats.ts` weiterverwenden; Grundlage zur Prozentbasis als Bild (Zeile, Spalte, Gesamt). |

### Task 5: Sitzung 6 „Gewichtung und Zusammenhang“
| Bisher | `s05` (`src/tasks/s05-treiber/`) |
|---|---|
| Kern | Gewichte, Zusammenhangsmaße (V, Phi, Gamma, Tau-b, Spearman, Pearson) |
| Besonderheit | Ab hier gewichtet; Formeln der Maße als Bilder („Formel lesen lernen“), Voraussetzungen je Maß im Überblick. |

### Task 6: Sitzung 7 „Mittelwerte vergleichen“
| Bisher | `s06` (`src/tasks/s06-letzte-frage/`) |
|---|---|
| Kern | t-Test, ANOVA, Voraussetzungen |

### Task 7: Sitzung 8 „Index und Skala“
| Bisher | `s07` (`src/tasks/s07-drei-fragen/`) |
|---|---|
| Kern | Index bilden, Reliabilität, Cronbachs α |

### Task 8: Sitzung 9 „Lineare Regression“
| Bisher | `s08` (`src/tasks/s08-automat/`) |
|---|---|
| Kern | Modell, Residuen, R², Voraussetzungen |

### Task 9: Sitzung 10 „Regression vertiefen“
| Bisher | `s09` (`src/tasks/s09-mitgenommen/`) |
|---|---|
| Kern | mehrere Prädiktoren, Kontrolle |

### Task 10: Sitzung 11 „Logistische Regression“
| Bisher | `s10` (`src/tasks/s10-buergerrat/`) |
|---|---|
| Kern | Odds, Logit, Wahrscheinlichkeiten |

### Task 11: Aufräumen nach der letzten Live-Schaltung
- [ ] **Step 1:** Wenn alle Sitzungen live sind: alte Aufgaben-Ordner, `TaskHost`, `kit/RoleBrief.tsx`, `kit/Toolbox.tsx`, `kit/StepGuide.tsx` und ihre Tests entfernen, sofern kein Kapitel sie importiert (`grep -rn "from '../../tasks" src/chapter` → keine Treffer außer `kit/numbers`, `kit/RCode`, `kit/rStyle`, `kit/stats`).
- [ ] **Step 2:** Vorschau-Schalter und `live`-Feld entfernen; `?vorschau=kapitel` wirkungslos.
- [ ] **Step 3:** Alle Tests, Build, Offline-Build grün; Commit `chore: remove the old task layer`. Push nur auf Wort des Dozenten.
