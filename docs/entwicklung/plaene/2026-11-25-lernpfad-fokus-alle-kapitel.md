# Strukturplan: Alle Lernpfad-Kapitel im Fokus-Format (25.11.2026)

Auftrag des Dozenten am 24.11.2026 abends, zu erledigen bis zum nächsten Morgen:
- Alle elf Kapitel bekommen die Form, die im Prototyp zu Kapitel 4 erarbeitet wurde (`Methoden Ib B.A./.superpowers/brainstorm/kapitel4-fokus/`).
- Das gilt auf allen Ebenen: Aufgaben, Verstehen, Mitnehmen.
- Ergebnis live auf statistikatlas-neu, auf allen Geräten gut benutzbar.
- Unabhängige Prüfung durch Subagenten.

Entscheidungen des Dozenten:
- Unter 1280 px schiebt sich das Lernjournal als Überlagerung über die Aufgabe, mit Lasche und Schrittkarte. Zum Aufklappen dient ein eigener Knopf, nicht der Titel.
- Live geht es nur auf statistikatlas-neu; die Hauptseite bleibt unverändert.
- Fertigstellung nach eigenem Ermessen, er kontrolliert morgens.
- Gespeicherter Fortschritt darf neu beginnen.

## Das Muster (aus Kapitel 4)

1. **Kopf:** Stein mit Nummer, Titel, Leitfrage, Fortschrittszeile. Reiter Aufgaben | Verstehen | Mitnehmen.
2. **Aufgaben:**
   - Jede Aufgabe hat eine Frage, „Am Ende“ und nummerierte Schritte. „Erst festlegen“ zählt als Schritt 1.
   - Schrittarten: festlegen, code (Vorlage mit „→ Journal“, gelben Stellen und Kopieren), lesen, fragen (Prüfen, „→ Ergebnisse ins Journal“) und eigene Bausteine des Kapitels.
   - Zusatzinfos öffnen sich auf Abruf in der Seitenleiste: Bild, Warum …?, Probier, Verweis in Verstehen.
   - Unter jeder Aufgabe steht „Weiter, wenn du magst“ (Abwandeln, Erweitern, Eigene Frage) und „Ohne Grafik“, wo es passt.
   - Der Umschalter „Mit Vorlagen | Erst selbst versuchen“ gilt für das ganze Kapitel.
3. **Lernjournal und Konsole (Arbeitsplatz):**
   - Journal (.qmd, Startblock, Abschnitt je Aufgabe), Environment wie RStudio, Konsole, Plots, Help mit Vignetten, Autovervollständigung, RStudio-Kürzel, Einfüge-Leiste.
   - Download als .qmd (rendert in RStudio) und als HTML.
   - Nebeneinander ab 1280 px. Darunter Überlagerung mit Lasche, hochkant als ganze Fläche. Schrittkarte unter 1280 px.
4. **Verstehen:**
   - Ein Abschnitt je Aufgabe („Verstehen zu Aufgabe n“), davor „Vorweg: R lesen“, danach „Überblick“.
   - Jeder Abschnitt beginnt mit der Frage und „Der Weg durch die Aufgabe“: Schritte → Karten.
   - Jede Karte trägt oben „zu Schritt n“. Die Schrittnummern sind die der Seite.
   - **Keine Übungen:** keine Eingaben, kein Prüfen, kein Schätzen, kein Zuordnen, kein „→ Konsole“.
   - Erklärende Bilder (auch durchklickbar, Schieberegler) und rhetorische Fragen mit Antwort im Text sind erlaubt.
   - Bilder zeigen die Variable der Aufgabe, mit kleinem Beispiel statt echter Zahlen, damit die Antworten der Aufgabe nicht vorweggenommen werden.
   - Code nur zum Lesen.
5. **Mitnehmen:**
   - Das Wichtigste, jeweils mit Verweis auf eine Karte.
   - Prüf dich selbst (SELF_TEST, nach Prüfen „Nachlesen“).
   - Dein Lernjournal (Übersicht, Download, Render-Anleitung).
   - Skript (SCRIPT).
6. **Stil:**
   - Erklärstil: Fachbegriff plus „Kurz gesagt“.
   - Einladender Ton, keine Witzpointen, kein „(fiktiv)“.
   - mariposa-Code im tidy-style: `rec()` statt `ifelse`.
   - Barrierefreiheit: jede Grafik mit Textfassung, jede Aufgabe ohne Grafik lösbar.

## Technischer Aufbau

```
Statistikatlas-Prototyp/
  lernpfad/
    engine/          index.html (Vorlage), stil.css, engine.js (aus app.js), hilfe.js, tasten.js, umgebung.js, hallo.svg
    react/           entry.tsx (Verstehen + Mitnehmen + Bausteine, generisch), verstehen.css, Workshop-Ersatz, gemeinsame Erklärbilder
    kapitel/kNN/     kapitel.js (Meta, TASKS, FREI, BILD, eigene Schrittarten), inhalt.tsx (THEMEN für Verstehen),
                     mitnehmen.ts (WICHTIG, SELBST_KARTE), bausteine.tsx (optional: React-Bausteine für Aufgaben), figuren.tsx (optional)
  scripts/build-lernpfad.mjs   nach `vite build`: daten.js aus src/chapter/sNN/content.ts (tsx), React-Bündel je Kapitel, Seiten nach dist/lernpfad/kNN/
```

- **Daten:** `daten.js` exportiert alle JSON-fähigen Exporte von `content.ts` (`window.KDATEN`). Bilder aus `bilder/` gehören dazu, wo vorhanden.
- **Bündel je Kapitel:** React plus Atlas-Bausteine. `Workshop` wird durch einen Code-Block zum Lesen ersetzt, Texte über die Werkstatt werden umgeschrieben.
- **Speicher je Kapitel:** `kNN-fokus-v1`, `kNN-journal-v1`, `kNN-verstehen-v1`, `kNN-hoehen-v1`. Der ALLBUS liegt einmal für alle Kapitel in IndexedDB `statistikatlas-allbus`.
- **Atlas-Einbindung:** Im Bau mit `VITE_KAPITEL=1` führt der Lernpfad zu `lernpfad/kNN/`. Die Kapitelseite verlinkt zurück auf Atlas und Karte, die linke Leiste auf die anderen Kapitel.
- **Veröffentlichen:** Zweig `lernpfad-kapitel` committen und den Schnappschuss nach `veroeffentlichung-neu` übertragen (per `git commit-tree`, ohne Versionsgeschichte). Push auf `neu` main, Pages baut mit `KAPITEL=1`.

## Ablauf und Prüfungen

1. **Bestandsaufnahme** je Kapitel durch Subagenten, abgelegt in `kapitel4-fokus/_plan/inventar-sNN.md`.
2. **Engine verallgemeinern:** Kapitel 4 als erstes Kapitel auf die neue Struktur umziehen. Abnahme: Kapitel 4 sieht aus und funktioniert wie der Prototyp.
3. **Kapitel 1–3 und 5–11** durch Subagenten, höchstens drei gleichzeitig, jedes in seinem eigenen Ordner. Vorlage ist Kapitel 4 samt KONZEPT.md.
4. **Prüfung je Kapitel** durch einen unabhängigen Agenten:
   - Verstehen passt Schritt für Schritt zu den Aufgaben, mit den Schrittnummern der Seite.
   - Keine Übungen in Verstehen.
   - Fakten belegt.
   - Barrierefreiheit.
   - Befunde einarbeiten.
5. **Technik:**
   - `pnpm test`, `tsc`, Build.
   - Alle Kapitel im Browser bei 1024 × 690, 1280 × 610, 768 × 954 und 1920 × 970: ohne Konsolenfehler, Reiter, Journal, Überlagerung.
   - R-Vorlagen laufen mit dem echten ALLBUS (lokale Tests `allbus.local.test.ts`).
6. **Veröffentlichen, Bericht für den Dozenten** mit offenen Punkten.
