# Fachbegriffe im Lernpfad: nennen, erklären, antippbar machen

Stand 25.11.2026. Gilt für alle 11 Kapitel unter `lernpfad/kapitel/`.

## Warum

Studierende sollen die Fachbegriffe der Statistik lernen und selbst verwenden. Die Lernziele in `meta.json` nennen die Begriffe, die Texte weichen aber oft auf Alltagsbilder aus. Beispiele aus Kapitel 4: „Kiste“ statt Klasse (43-mal), „Bogen“ statt Fall oder Befragte (51-mal), „die mittlere Hälfte als Kasten“ statt Interquartilsabstand; „Häufigkeitsverteilung“, „Lagemaß“, „Streuungsmaß“, „Fallzahl“ fehlen ganz. Ähnlich „Turm“ (K2, K8, K11) und „Lücke“ (K10).

## Ziele

- Jeder Begriff, den ein Kapitel braucht, wird beim ersten Vorkommen **genannt und kontextualisiert** (Fachbegriff plus „Kurz gesagt“, wie im Atlas-Leitfaden `src/explain/AUTHORING.md`).
- Danach verwenden die Texte **den Fachbegriff**. Ein Alltagsbild darf als Veranschaulichung bleiben, ersetzt den Begriff aber nicht mehr.
- Begriffe sind im Text **antippbar**: kurze Erklärung, überall gleich formuliert.
- Jedes Kapitel hat in „Mitnehmen“ eine **Begriffsliste** zum Wiederholen.
- Ein **Prüfskript** meldet unbekannte Begriffe und Alltagsbilder ohne Begriff.

## Nicht-Ziele und Anti-Ziele

- Kein neues Lexikon neben dem Atlas: keine langen Erklärungen, keine Formeln im Antipp-Fenster. Für mehr gibt es Verstehen und die Atlas-Karten.
- **Anti-Ziel:** Begriffe verraten Lösungen. Wo eine Frage verlangt, den Begriff oder das Maß selbst zu wählen (z. B. welches Zusammenhangsmaß zu welchem Skalenniveau), erscheint der Begriff erst in der Rückmeldung nach der Antwort.
- **Anti-Ziel:** Texte werden zur Begriffswand. Markiert wird ein Begriff nur beim ersten Vorkommen je Schritt bzw. je Verstehen-Abschnitt.
- Keine Änderung an den Lösungen, Fragen-Logik oder ALLBUS-Zahlen. Die Liste verratener Lösungen in alten Inhalten ist ein eigenes Vorhaben.

## Ansätze (gewählt: B)

- **A: Nur Text.** Alle Kapitel sprachlich überarbeiten, keine Engine-Änderung. Schneller, aber Einheitlichkeit hängt allein an der Durchsicht.
- **B: Text plus antippbare Begriffe (gewählt vom Dozenten).** Ein zentrales Begriffsverzeichnis, Markierung im Text, Antipp-Fenster, Begriffsliste, Prüfskript. Jede Definition steht genau einmal; Einheitlichkeit ist maschinell prüfbar.
- C: Automatisches Markieren aller Vorkommen per Wortliste. Verworfen: Fehltreffer („auf jeden Fall“, „Wert“) und Lösungsverrat lassen sich nicht steuern.

## Entscheidungen

1. **Ein Verzeichnis für alle Kapitel:** `lernpfad/begriffe.json` (der Build schreibt daraus `window.BEGRIFFE`): `{ id: { name, alias?, fach, kurz, bild?, karte?, kapitel } }`.
   - `name`: Fachbegriff, bei Atlas-Begriffen genau wie der Titel in `src/domain/concepts.ts`.
   - `fach`: ein genauer Satz „In der Fachsprache: …“.
   - `kurz`: höchstens zwei Sätze in Alltagswörtern.
   - `bild` (optional): das Alltagsbild, das der Lernpfad dafür nutzt („Kisten“), damit der Bezug sichtbar bleibt.
   - `atlas` / Verweis (optional): Sprung zur passenden Verstehen-Karte des Kapitels, in dem der Begriff eingeführt wird.
   - `kapitel`: Kapitel der Einführung.
   - Keine ALLBUS-Ergebnisse, keine Zahlen aus Aufgaben in den Definitionen.
2. **Markierung in Aufgabentexten** (`kapitel.js`, `daten.js`, denk-Fenster): `⟪Klassen|klasse⟫` oder `⟪Median⟫` (Zeichen U+27EA/U+27EB; nicht `[[…]]`, weil `[[` in TS-Arrays und R-Code vorkommt; nicht `⟦…⟧`, das ist die Lücken-Syntax der Code-Werkstatt) (id = Name klein, ohne Umlaut-Sonderbehandlung über eine Namenssuche). Die Marke übersteht `esc()` und `codeHtml()`. Ein zentraler Schritt nach dem Rendern ersetzt Marken in Textknoten durch `<button class="begriff" data-b="id">`. In Attributen (aria-label, title) und in Überschriften mit `esc()` werden Marken zu bloßem Text.
3. **Markierung in React** (Verstehen `inhalt.tsx`, `mitnehmen.tsx`, Bausteine): Komponente `<Begriff id="median">Median</Begriff>`, die denselben Knopf rendert. Kein Umschreiben von React-Textknoten von außen.
4. **Antipp-Fenster:** ein kleines Popover am Begriff mit Name, „In der Fachsprache“, „Kurz gesagt“, ggf. Alltagsbild und Link „Mehr in Verstehen →“. Bedienbar mit Tastatur (Enter/Leertaste öffnet, Esc schließt, Fokus zurück), erreichbar auch auf Touch, passt auf 390 px. Darstellung im Text: dezente gepunktete Unterstreichung, in `forced-colors` sichtbar.
5. **Begriffsliste in Mitnehmen:** automatisch aus dem Verzeichnis: neu in diesem Kapitel, dazu „schon bekannt“ (in früheren Kapiteln eingeführt und hier benutzt).
6. **Prüfskript** `scripts/begriffe-pruefen.mjs`: unbekannte ids, Begriffe aus den Lernzielen ohne Markierung, Alltagsbilder (`bild`) ohne Fachbegriff im selben Schritt, Definitionen über zwei Sätze. Läuft im Build-Check mit.
7. **Inhaltliche Überarbeitung** je Kapitel: Lernziel-Begriffe einführen und markieren, Umschreibungen durch Fachbegriffe ersetzen, Alltagsbilder als Veranschaulichung beibehalten. Danach Gegenlesen durch einen zweiten Durchgang und die bestehende Überlappungsprüfung gegen Antworttexte.

8. **Begriffsliste je Kapitel** *(Entscheidung des Umsetzenden)*: neues Feld `begriffe` in `meta.json` mit den ids, die das Kapitel einführt bzw. benutzt. Entwurf aus Lernzielen, `KONZEPT.md`, `concepts.ts` und den Sitzungsfolien; **der Dozent sieht alle 11 Listen in einer Übersicht und gibt sie frei, bevor Texte umgeschrieben werden.**
9. **Überlappungsprüfung** *(Entscheidung des Umsetzenden)*: das bisherige Arbeitsskript (6-Wort-Folgen der Fenster gegen Fragen, Optionen, Rückmeldungen, Hinweise aus `daten.js`) wird als `scripts/lernpfad-ueberlappung.mjs` ins Repo übernommen und auf Antipp-Texte und überarbeitete Schritttexte ausgeweitet.
10. **Prüfskript zunächst als Warnung** *(Entscheidung des Umsetzenden)*: `begriffe-pruefen.mjs` bricht nur bei unbekannten ids hart ab; die übrigen Meldungen sind Warnungen, bis alle Kapitel überarbeitet sind, danach hart.
11. **„Mehr in Verstehen →“** *(Entscheidung des Umsetzenden)*: führt zur Verstehen-Karte im aktuellen Kapitel, wenn es eine gibt; sonst zur Karte des Einführungskapitels in einem neuen Tab, damit der Arbeitsstand nicht verloren geht.
12. **Gemeinsame Quellen mit dem Atlas:** Viele Lernpfad-Texte kommen aus `src/chapter/sNN/` (`content.ts`, `Tasks.tsx`, `Foundations.tsx`, `figures/`), die auch die Atlas-Kapitelseiten nutzen; der Lernpfad-Build ändert sie nur über `ersetzungen`. → **Entscheidung des Dozenten (25.11.2026): direkt in den gemeinsamen Quellen ändern.** Fachbegriffe werden dort eingeführt, damit Atlas-Kapitelseiten und Lernpfad dieselbe Fassung haben. Marken `⟪…⟫` in diesen Quellen werden im Atlas-Build zu bloßem Text, im Lernpfad-Build zu antippbaren Begriffen. Das betrifft nur statistikatlas-neu (Zweig `lernpfad-kapitel` → Schnappschuss `veroeffentlichung-neu`); die alte Seite statistikatlas (`origin/main`) bleibt unberührt.

## Rahmen

- Sprachregeln wie im Atlas-Leitfaden: du-Form, kurze Sätze, Fachbegriff immer vollständig, „Kurz gesagt“ höchstens zwei Sätze, kein „·“ neben Mathematik.
- Barrierefreiheit: Knopf-Semantik, Fokus, Kontrast, Bildschirmleser lesen den Begriff als normalen Text.
- Veröffentlichung wie bisher über einen geprüften Schnappschuss auf `veroeffentlichung-neu`; `lernpfad-kapitel` wird nicht gepusht.

## Dem Umsetzenden überlassen

- Genaue Gestalt und Position des Popovers, Animation.
- Wie die Namenssuche für `⟪Median⟫` ohne id die id findet (z. B. Name oder Alias im Verzeichnis).
- Reihenfolge der Kapitel und Aufteilung auf Arbeitsgänge.
- Ob `bekannt` in `meta.json` künftig aus dem Verzeichnis abgeleitet wird.
