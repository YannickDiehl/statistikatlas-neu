# Reiter „Verstehen“: Konzept (24.11.2026, gebilligt)

**Zweck.** Verstehen erklärt die Aufgaben in ihren Bezügen, damit man sie lösen kann: Was passiert in jedem Schritt, und warum? Dazu kommen Hintergrund und Fachbegriffe. Geübt wird nur in den Aufgaben.

**Erlaubt**
- Erklärende Bilder, auch zum Durchklicken oder mit Schieberegler (Schichten, Turm zum Stapel, Formen-Labor, Kistenbreite, Lineal zum Boxplot), weil sie einen Prozess zeigen.
- Rhetorische Fragen, die direkt im Text beantwortet werden („Warum steht da ein Balken NA? …“).
- „Kurz gesagt“, „Genauer erklärt“, „Häufige Verwechslung“.
- Code nur zum Lesen, mit Kopieren.

**Nicht erlaubt**
- Nichts mit richtig/falsch oder Eingabe: Schätzen, „Kurz überlegen“ mit „Antworten prüfen“, Auswahlfragen, Zuordnen.
- Kein „→ Konsole“ und kein „→ Journal“.

**Aufbau**
- Ein Abschnitt je Aufgabe („Verstehen zu Aufgabe n“) und davor „Vorweg: R lesen“. Den Schluss bildet ein Überblick „Welche Grafik für welche Frage?“.
- Jeder Abschnitt beginnt mit der Frage der Aufgabe und „Der Weg durch die Aufgabe“. Diese Liste nennt die Schritte der Aufgabe, und jeder Schritt verweist auf die Karte, die ihn erklärt.
- Jede Karte trägt oben einen Verweis „zu Schritt n“. Er führt zurück in die Aufgabe.
- Aus den Aufgaben führen „Warum …?“-Einträge direkt zur passenden Karte.

**Umsetzung im Prototyp**
- Die Atlas-Bausteine bleiben: Card, Kurz gesagt, Genauer erklärt, Verwechslung, die Bilder. Neu zusammengesetzt wird in `_verstehen/inhalt.tsx`.
- Wo ein Atlas-Bild eine Übung eingebaut hat, gibt es eine reine Erklärfassung in `_verstehen/figuren.tsx`. Das betrifft das Lineal mit der Kurzarbeit-Frage und die Achse mit dem Tipp-Feld.
