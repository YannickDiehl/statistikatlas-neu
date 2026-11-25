# Fachbegriffe im Lernpfad – Umsetzungsplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fachbegriffe in allen 11 Lernpfad-Kapiteln nennen, kontextualisieren und antippbar machen, mit einem zentralen Begriffsverzeichnis, Begriffsliste in „Mitnehmen“ und Prüfskript.

**Architecture:** Ein Verzeichnis `lernpfad/begriffe.json`. Texte in Strings (`kapitel.js`, `src/chapter/sNN/content.ts`) tragen Marken `⟪Text|id⟫`; die Engine macht daraus Knöpfe, Atlas-Build und Lernpfad-React-Build entfernen sie zu bloßem Text. JSX-Texte nutzen `<Begriff id>`: im Atlas bloßer Text, im Lernpfad (per Alias wie beim Werkstatt-Ersatz) derselbe Knopf. Ein Popover der Engine bedient alle Knöpfe.

**Tech Stack:** Vanilla JS (Engine), React 19 + Vite 8 (Bündel), Node `--test` mit tsx, Prüfskripte als `.mjs`.

**Spec:** `docs/entwicklung/spezifikationen/2026-11-25-lernpfad-fachbegriffe-design.md`

## Global Constraints

- Marke: `⟪Anzeigetext|id⟫` oder `⟪Name⟫` (U+27EA/U+27EB); `⟪Median⟫` löst nur über exakten `name` oder `alias` auf (Groß/klein egal), sonst ist `|id` Pflicht.
- Keine Marken in R-Code, Backticks, `<code>`, `<pre>`, `SVG`, `ALT`, `TEMPLATES`, Titeln (`titel` von Aufgaben und Schritten).
- `kurz` höchstens zwei Sätze, Alltagswörter; `fach` ein genauer Satz; `name` bei Atlas-Begriffen wörtlich wie in `src/domain/concepts.ts`.
- Definitionen ohne ALLBUS-Ergebnisse und ohne Zahlen aus Aufgaben.
- Lösungsschutz: Ist ein Begriff die Antwort einer Frage (Begriff oder Maß wählen), erscheint er vor der Antwort weder im Text noch als Marke; erst in der Rückmeldung.
- Markiert wird nur das erste Vorkommen eines Begriffs je Schritt bzw. je Verstehen-Abschnitt.
- Alltagsbilder bleiben nur als Veranschaulichung neben dem Fachbegriff; danach gilt der Fachbegriff.
- Sprache wie `src/explain/AUTHORING.md`: du-Form, Sätze ≤ 25 Wörter, kein „·“ neben Mathematik, keine „(fiktiv)“-Klammern.
- Alte Seite statistikatlas (`origin/main`) bleibt unberührt; Arbeit auf `lernpfad-kapitel`, Veröffentlichung nur als Schnappschuss `veroeffentlichung-neu` → `neu/main`; `lernpfad-kapitel` nie pushen; keine ALLBUS-Mikrodaten, keine Angaben zu einzelnen Studierenden ins Repo.
- Die Liste verratener Lösungen (`.superpowers/…/verratene-loesungen-2026-11-25.md`) bleibt außerhalb des Repos.

## Review Focus

1. R-Code und TS-Arrays mit `[[` (`x[["a"]]`, `[['na','NA']]`) bleiben unverändert; Marken in `<code>`/`<pre>` werden nicht zu Knöpfen.
2. Marken in Attributen (`aria-label="${esc(p.prompt)}"`, `title`) erscheinen nie roh; Bildschirmleser lesen den bloßen Text.
3. Unbekannte id zur Laufzeit (Tippfehler im Inhalt): bloßer Text, `console.warn`, kein Absturz.
4. Popover am rechten Rand bei 390 px und bei offenem Journal: ganz sichtbar; mit Tastatur bedienbar, Esc gibt den Fokus zurück.
5. Atlas-Kapitelseiten von statistikatlas-neu zeigen nirgends `⟪`, auch nicht in Abbildungen unter `src/chapter/sNN/figures/`.

---

### Task 1: Marken-Bibliothek und Atlas-Plugin

**Files:**
- Create: `src/lib/begriffe.ts`, `src/lib/begriffe.test.ts`, `src/chapter/Begriff.tsx`
- Modify: `vite.config.ts`

**Interfaces:**
- Produces:
  - `MARKE: RegExp` = `/⟪([^⟪⟫|]+)(?:\|([a-z0-9-]+))?⟫/g`
  - `ohneMarken(s: string): string`
  - `type Eintrag = { name: string; alias?: string[]; fach: string; kurz: string; bild?: string[]; karte?: string; kapitel: number }`
  - `aufloesen(text: string, id: string | undefined, verzeichnis: Record<string, Eintrag>): string | null` (id, sonst name/alias)
  - `markenEntfernen(): import('vite').Plugin` (transform für `.ts/.tsx` unter `src/`, ersetzt Marken durch ihren Text)
  - `Begriff({ id, children }: { id: string; children: ReactNode }): ReactNode` → im Atlas nur `children`

- [ ] **Step 1: Tests schreiben** – `ohneMarken('Die ⟪Klassen|klasse⟫ und der ⟪Median⟫')` = `'Die Klassen und der Median'`; `ohneMarken("x[['a']] [[1]]")` unverändert; `aufloesen('Median', undefined, {median:{name:'Median',…}})` = `'median'`; `aufloesen('Medians', undefined, …)` = `null`; `aufloesen('x','klasse',{})` = `null`; Plugin-`transform` auf `'const a = "⟪Kisten|klasse⟫";'` mit id `/…/src/chapter/s04/content.ts` liefert `'const a = "Kisten";'`, auf Datei außerhalb `src/` `undefined`.
- [ ] **Step 2:** `node --import tsx --test src/lib/begriffe.test.ts` → FAIL (Modul fehlt).
- [ ] **Step 3:** Implementieren; Plugin in `vite.config.ts` vor `react()` eintragen.
- [ ] **Step 4:** Test → PASS; `pnpm test` (bzw. `npm test`) grün; `npx tsc --noEmit` grün.
- [ ] **Step 5:** Commit `Fachbegriffe: Marken-Bibliothek und Atlas-Plugin`.

### Task 2: Verzeichnis, Build und Lernpfad-React

**Files:**
- Create: `lernpfad/begriffe.json` (Startinhalt: 3 Einträge aus K4 – `klasse`, `median`, `fall` – als Muster), `lernpfad/react/Begriff.tsx`
- Modify: `scripts/build-lernpfad.mjs`, `lernpfad/engine/index.html`, `lernpfad/react/mitnehmen.tsx`, alle `lernpfad/kapitel/kNN/meta.json` (Feld `"begriffe": []`)

**Interfaces:**
- Consumes: `markenEntfernen()`, `Eintrag` aus Task 1.
- Produces:
  - `dist/lernpfad/begriffe.js` = `window.BEGRIFFE = <begriffe.json>;`, in `index.html` vor `daten.js` geladen (`../begriffe.js?v={{V}}`).
  - `window.KMETA.begriffe: string[]` (aus `meta.begriffe`).
  - Lernpfad-`Begriff` rendert `<button type="button" className="begriff" data-b={id}>{children}</button>`; unbekannte id → nur `children`.
  - Im React-Build: `markenEntfernen()` in `plugins`; `resolveId` lenkt Importe, die auf `src/chapter/Begriff` auflösen, auf `lernpfad/react/Begriff.tsx`; Alias `@lernpfad/Begriff` für Kapiteldateien.
  - Mitnehmen bekommt Abschnitt „Fachbegriffe dieses Kapitels“: „Neu“ (Einträge mit `kapitel === KMETA.nr`) und „Schon bekannt“, je `name` als Knopf plus `kurz`.

- [ ] **Step 1:** Build-Änderungen umsetzen.
- [ ] **Step 2:** `node scripts/build-lernpfad.mjs k04` → läuft; `dist/lernpfad/begriffe.js` existiert; `grep -c "⟪" dist/lernpfad/k04/verstehen.js` = 0.
- [ ] **Step 3:** Commit `Fachbegriffe: Verzeichnis, Build, Begriff-Komponente, Liste in Mitnehmen`.

### Task 3: Engine – Knöpfe und Popover

**Files:**
- Create: `lernpfad/engine/begriffe.js`, `src/lib/lernpfad-begriffe.test.ts`
- Modify: `scripts/build-lernpfad.mjs` (Datei kopieren), `lernpfad/engine/index.html` (vor `engine.js` laden), `lernpfad/engine/stil.css`

**Interfaces:**
- Consumes: `window.BEGRIFFE`, `window.KMETA`, `tabWechsel(name, ziel)` aus `engine.js`.
- Produces: `window.Begriffe = { zerlege(text): Array<string | { text, id }>, markieren(root: Node): void, oeffnen(knopf: HTMLElement): void, schliessen(): void }`.
  - `markieren`: Textknoten außerhalb `code, pre, textarea, script, style, svg, .begriff, #p-verstehen, #p-mitnehmen, .d-react, .baustein-wurzel`; Marken in `aria-label`, `title`, `alt`, `placeholder` werden zu bloßem Text.
  - MutationObserver auf `document.body` (childList, subtree, characterData, attributes mit obigem Filter) ruft `markieren`.
  - Popover `#begriff-pop`, `role="dialog"`, `aria-label` = Name: Name fett, „In der Fachsprache: …“, „Kurz gesagt: …“, ggf. „Im Bild: …“ (`bild[0]`), Link „Mehr in Verstehen →“: gleiches Kapitel → `tabWechsel('verstehen', karte)`; anderes Kapitel → `../kNN/` in neuem Tab. Klick außerhalb oder Esc schließt, Fokus zurück an den Knopf; links/rechts im Viewport geklemmt, Breite `min(340px, 100vw - 20px)`.
  - CSS: `.begriff` sieht aus wie Text mit gepunkteter Unterstreichung (`text-decoration: underline dotted`), sichtbarer Fokusrahmen, in `forced-colors` `ButtonText`.

- [ ] **Step 1: Test schreiben** (Datei in `vm` mit Stub-`window` laden): `zerlege('a ⟪Klassen|klasse⟫ b')` = `['a ', {text:'Klassen', id:'klasse'}, ' b']`; `zerlege("x[['a']]")` = `["x[['a']]"]`; `zerlege('⟪Foo|gibtsnicht⟫')` = `['Foo']` (unbekannt → Text).
- [ ] **Step 2:** Test → FAIL.
- [ ] **Step 3:** Implementieren.
- [ ] **Step 4:** Test → PASS. Ein Muster-Satz mit drei Marken in `k04/kapitel.js`; `node scripts/build-lernpfad.mjs k04`, lokal (`python3 -m http.server` in `dist`) prüfen bei 390, 1024 (Journal offen), 1440 px: Knopf sichtbar, Popover ganz im Bild, Tab/Enter/Esc funktionieren, `aria-label` der Fragen ohne `⟪`, Konsole ohne Fehler.
- [ ] **Step 5:** Commit `Fachbegriffe: antippbare Begriffe in der Engine`.

### Task 4: Prüfskripte

**Files:**
- Create: `scripts/begriffe-pruefen.mjs`, `scripts/lernpfad-ueberlappung.mjs` (aus dem Arbeitsskript `ueberlappung.mjs` übernommen)
- Modify: `package.json` (`build`: `node scripts/begriffe-pruefen.mjs` vor `build-lernpfad.mjs`)

**Interfaces:**
- `begriffe-pruefen.mjs [--streng] [kNN…]`, Exit 1 bei Fehlern, mit `--streng` auch bei Warnungen.
  - Fehler: Eintrag ohne `name/fach/kurz/kapitel`; `kurz` > 2 Sätze; Marke oder `<Begriff id>` oder `meta.begriffe` mit unbekannter id; Marke in Backticks, `<code>`, oder in den Daten-Schlüsseln `SVG/ALT/TEMPLATES`.
  - Warnungen: id aus `meta.begriffe` im Kapitel nirgends markiert; String-Literal mit einem `bild`-Wort ohne Namen/Alias/Marke desselben Begriffs.
  - Durchsucht je Kapitel: `lernpfad/kapitel/kNN/*.{js,tsx}`, `src/chapter/<meta.content>/**/*.{ts,tsx}`.
- `lernpfad-ueberlappung.mjs <repo> [N=6] [kNN…]`: wie bisher, `plain()` entfernt Marken; zusätzlich `fach`/`kurz` der in `meta.begriffe` gelisteten Einträge als Quelle „Antipp“ gegen die Antworttexte.

- [ ] **Step 1:** Skripte schreiben; mit einem absichtlich falschen Eintrag (`⟪X|gibtsnicht⟫` in einer Kopie) Exit 1 prüfen, ohne ihn Exit 0.
- [ ] **Step 2:** `node scripts/begriffe-pruefen.mjs` → Exit 0 (nur Warnungen); `node scripts/lernpfad-ueberlappung.mjs . 6` läuft.
- [ ] **Step 3:** Commit `Fachbegriffe: Prüfskripte`.

### Task 5: Begriffslisten entwerfen – Freigabe durch den Dozenten (Haltepunkt)

**Files:**
- Modify: `lernpfad/begriffe.json`, alle `lernpfad/kapitel/kNN/meta.json` (`begriffe`)
- Create (außerhalb Repo, zur Ansicht): Übersicht aller 11 Listen

- [ ] **Step 1:** Je Kapitel Kandidaten sammeln aus `meta.json`-Zielen, `KONZEPT.md`, `src/domain/concepts.ts`, Verstehen-Karten und den Sitzungsfolien; dazu die Umschreibungen im Bestand (Wort, Anzahl, Fundorte), z. B. „Kiste → Klasse“.
- [ ] **Step 2:** Einträge in `begriffe.json` schreiben (ein Autor für alle Definitionen, damit sie einheitlich klingen); `kapitel` = erstes Kapitel, das den Begriff braucht.
- [ ] **Step 3:** `node scripts/begriffe-pruefen.mjs` → keine Fehler; Überlappung der Definitionen gegen Antworttexte = 0 Treffer.
- [ ] **Step 4:** Übersicht (je Kapitel: neu, schon bekannt, ersetzte Umschreibungen, je Begriff `fach` + `kurz`) dem Dozenten vorlegen. **Warten auf Freigabe**; Änderungswünsche einarbeiten.
- [ ] **Step 5:** Commit `Fachbegriffe: Verzeichnis und Kapitellisten (freigegeben)`.

### Task 6–16: Kapitel K01 … K11 überarbeiten (je Kapitel eine Aufgabe)

**Files (je Kapitel kNN, Inhalt sNN = `meta.content`):**
- Modify: `lernpfad/kapitel/kNN/kapitel.js`, `inhalt.tsx`, `bausteine.tsx`, `mitnehmen.tsx`; `src/chapter/sNN/content.ts` und die von Lernpfad genutzten `.tsx` darin; Tests in `src/chapter/sNN/*.test.ts`, die alten Wortlaut festschreiben.

**Interfaces:**
- Consumes: freigegebene `meta.begriffe`, `begriffe.json`, Marken/`<Begriff>` aus Task 1–3.

- [ ] **Step 1 (Schreiber):** Jeden Begriff der Liste beim ersten Vorkommen nennen und mit einem Halbsatz kontextualisieren; Umschreibungen ersetzen, Alltagsbild höchstens als „… – wie eine Kiste, in die …“ daneben; erstes Vorkommen je Schritt bzw. Verstehen-Abschnitt markieren. Lösungsschutz beachten. Keine Zahlen, Fragen-Logik oder Antworten ändern.
- [ ] **Step 2:** `npm test` grün; `npx tsc --noEmit` grün; `node scripts/begriffe-pruefen.mjs --streng kNN` → Exit 0; `node scripts/build-lernpfad.mjs kNN`; `node scripts/lernpfad-ueberlappung.mjs . 6 kNN` → 0 neue Treffer gegenüber vorher.
- [ ] **Step 3 (unabhängiger Gegenleser):** prüft Fachrichtigkeit, Lösungsschutz, Sprachregeln, Atlas-Kapitelseite sNN ohne `⟪` (`grep -c "⟪" dist/assets/*.js` = 0 nach `vite build`). Pflichtkorrekturen einarbeiten.
- [ ] **Step 4:** Lokale Prüfung `LERNPFAD_URL=… node scripts/lernpfad-pruefen.mjs kNN` grün; Stichprobe im Browser (ein Popover, Mitnehmen-Liste).
- [ ] **Step 5:** Commit `Fachbegriffe: Kapitel N`.

### Task 17: Gesamtprüfung und Veröffentlichung

- [ ] **Step 1:** `node scripts/begriffe-pruefen.mjs --streng` → Exit 0; in `package.json` den Build-Aufruf auf `--streng` stellen.
- [ ] **Step 2:** `npm test`, `npm run build` grün; `grep -rc "⟪" dist --include=*.js --include=*.html | grep -v ":0"` zeigt nur `dist/lernpfad/*/kapitel.js`, `daten.js`.
- [ ] **Step 3:** Alle 11 Kapitel lokal prüfen (`lernpfad-pruefen.mjs`), Browser bei 390, 1024, 1440, 1920 px.
- [ ] **Step 4:** ANLEITUNG.md um Abschnitt „Fachbegriffe markieren“ ergänzen; Commit; Bundle-Sicherung nach `~/Backups/statistikatlas/`.
- [ ] **Step 5:** Schnappschuss per `git commit-tree` auf `veroeffentlichung-neu`, `git push neu veroeffentlichung-neu:main`; Pages-Lauf abwarten; Live-Prüfung 11/11.
