# Lernpfad als Kapitel, Teil A: Bausteine, Freischalten und Pilot Sitzung 4 – Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Der Atlas bekommt die gemeinsamen Bausteine für Kapitel-Sitzungen (Layout, Grundlage, Aufgabe, Code-Werkstatt mit webR), speichert die ALLBUS-Datei dauerhaft im Browser und zeigt Sitzung 4 „Daten sehen“ als erstes Kapitel, zunächst nur über eine Vorschau-Adresse.

**Architecture:** Neuer Ordner `src/chapter/` mit Bausteinen (React-Komponenten), reinen Hilfsfunktionen (Editor-Tastenkürzel, Antwortprüfung, Zustand) und der Code-Werkstatt; Sitzungsinhalte je Kapitel in `src/chapter/sNN/`, Texte als TSX, Zahlen, Vorlagen und Antworten in `content.ts`. Die Datei liegt nach dem Laden in IndexedDB (`src/sandbox/allbusStore.ts`) und wird über einen React-Kontext an alle Sitzungen und Werkstätten gegeben. Ein Kapitel ersetzt in `LearningPath` den Begriffs- und Aufgabenteil, solange es live ist oder die Adresse `?vorschau=kapitel` trägt.

**Tech Stack:** React 19, TypeScript 7, Vite 8, `node --test` mit `tsx`, `react-dom/server` für Rendertests, webR 0.6.1 (R 4.6.0) per CDN, `fake-indexeddb` 6.2.8 (nur Tests), `@fontsource/fredoka`, `@fontsource/nunito`, `@fontsource/jetbrains-mono` 5.3.0, R 4 mit mariposa 0.7.4 und haven zur Prüfung der Vorlagen.

**Spec:** `docs/entwicklung/spezifikationen/2026-11-23-lernpfad-kapitel-design.md`. Referenz für jeden Text, jede Zahl, jede Vorlage und jede Grafik: `docs/entwicklung/spezifikationen/2026-11-23-lernpfad-kapitel/prototyp/sitzung4.html` (Stand v11). Bilder-Modul: `…/2026-11-23-lernpfad-kapitel/bilder/kap90.py`.

## Global Constraints

- Arbeitszweig `lernpfad-kapitel` von `main` im Repository `Kartenkonzept/Statistikatlas-Prototyp`; nach jedem Task ein Commit; **kein Push ohne ausdrückliches Wort des Dozenten** (Push auf `main` geht live).
- Repo liegt in iCloud: vor Git-Befehlen `find .git -flags +dataless | head` prüfen; Treffer zuerst mit `find .git -flags +dataless -type f -print0 | xargs -0 cat > /dev/null` herunterladen (sonst Exit 138, siehe `docs/PRUEFSTAND.md`, 23.11.2026). Ebenso für `node_modules` vor dem ersten Testlauf.
- `pnpm` fehlt im PATH: `node_modules/.bin/tsc`, `node --import tsx --test …`, `node_modules/.bin/vite`.
- Keine ALLBUS-Mikrodaten in Repo, Build, Bildern oder `localStorage`. In IndexedDB liegt nur die Datei der Person selbst. Im Code nur Aggregate (Häufigkeiten, Kennzahlen).
- R-Stil für Studierende: `library(tidyverse)` vor `library(mariposa)`, Pipe `%>%` (nie `|>`), `drop_na(x)` statt `filter(!is.na(x))`, `to_label(x)` direkt in der Kette, Daten vorn in der Kette.
- Sprache: Du-Form, einladend, keine Witz-Pointen; Fachbegriff plus „Kurz gesagt“; kein „·“ als Trenner neben Zahlen oder Formeln; kein „(fiktiv)“; keine Rollenszenarien.
- Nicht wieder einbauen: Kopfzeilen-Untertitel, Lernpfad-Intro, Dateistatus in den Sitzungen, „· STATISTIK IB“, „· mariposa“.
- Barrierefreiheit WCAG 2.2 AA (Spec §7): jede Grafik mit gleichwertiger Textfassung, jede Aufgabe ohne Grafik lösbar, Rückmeldungen per `aria-live`, Tab-Taste wird in der Werkstatt nie abgefangen.
- Bestehende Speicherschlüssel bleiben (`statistikatlas.aufgaben.v1`); neu nur `statistikatlas.kapitel.v1` (localStorage) und IndexedDB `statistikatlas`/Store `dateien`/Schlüssel `allbus`.
- Texte auf Deutsch, Code-Bezeichner auf Englisch wie im bestehenden Code.
- Texte, Zahlen und Vorlagen von Sitzung 4 werden aus `prototyp/sitzung4.html` übernommen, nicht neu formuliert. Abweichungen nur, wo dieser Plan sie nennt.

## Festlegungen dieses Plans (Spec §12)

1. **webR per CDN, Version fest:** `https://webr.r-wasm.org/v0.6.1/webr.mjs` (R 4.6.0), per `import(/* @vite-ignore */ url)` erst beim ersten Ausführen. Kein npm-Paket: Die wasm-Dateien müssten sonst mit ausgeliefert werden.
2. **Bilder als Inline-SVG** über `import svg from './bilder/x.svg?raw'` und eine Komponente `Figure`, damit sie in der Offline-Datei enthalten sind.
3. **Schriften selbst ausgeliefert** über `@fontsource/*` (keine Google-Fonts-Verbindung). In der Offline-Datei greifen die Ersatzschriften (`system-ui`, `ui-monospace`).
4. **Offline-Fassung:** Bei `location.protocol === 'file:'` zeigt die Werkstatt „Ausführen braucht eine Internetverbindung. Kopiere den Code nach RStudio.“ und nur den Kopieren-Knopf.
5. **Entfernen der Datei:** Knopf „Gespeicherte ALLBUS-Datei entfernen“ unten in der linken Sitzungsleiste, nur sichtbar, wenn eine Datei gespeichert ist; kein weiterer Dateistatus.
6. **Kapitel-Zustand** (Festlegungen, Antworten, Probier-Code wird nicht gespeichert) unter `statistikatlas.kapitel.v1` als `{ chapters: { [sessionId]: { predictions: Record<string,string>, answers: Record<string,string> } } }`.

## Review Focus

1. **Gespeicherte Datei passt nicht mehr** (alte Version, beschädigt, andere Datei): Beim Start still verwerfen, Eintrag löschen, Datei-Zone zeigen; kein Absturz, keine Fehlermeldung ohne Handlungsangebot. → Test in Task 2.
2. **IndexedDB fehlt oder schlägt fehl** (privates Fenster, volle Platte, Safari-Sperre): Datei gilt für den Tab, einmalige Notiz „Dein Browser speichert die Datei nicht. Nach dem Neuladen musst du sie erneut wählen.“ → Test in Task 1 und 2.
3. **webR nicht erreichbar** (Uni-Netz, CDN gesperrt, offline): nach 90 s oder beim Importfehler verständliche Meldung mit Kopieren-Hinweis, kein endloser Ladekreis, erneuter Versuch möglich. → Test in Task 5.
4. **Riesige Ausgabe** (`allbus`, `print(allbus)`, `codebook(allbus)`): Textausgabe auf 300 Zeilen kürzen mit Hinweis „… gekürzt“; die Seite friert nicht ein. → Test in Task 5.
5. **Antworten mit Einheiten und Schreibweisen** („37 Personen“, „40 %“, „2.071“, „65.000“, „4,529“, leere Eingabe): richtig gelesen, leere Eingabe zählt als „noch offen“, nicht als falsch. → Test in Task 3.

---

### Task 1: ALLBUS-Datei dauerhaft speichern

**Files:**
- Create: `src/sandbox/allbusStore.ts`
- Test: `src/sandbox/allbusStore.test.ts`
- Modify: `package.json` (devDependency `fake-indexeddb@6.2.8`; Testskript um `src/chapter/*.test.ts src/chapter/*/*.test.ts` ergänzen)

**Interfaces:**
- Produces:
  - `type StoredFile = { name: string; bytes: ArrayBuffer }`
  - `saveStoredAllbus(file: StoredFile, idb?: IDBFactory): Promise<boolean>` – `false`, wenn IndexedDB fehlt oder schreiben scheitert; fragt danach `navigator.storage?.persist?.()` an (Ergebnis egal).
  - `loadStoredAllbus(idb?: IDBFactory): Promise<StoredFile | null>`
  - `removeStoredAllbus(idb?: IDBFactory): Promise<void>`
  - Konstanten `DB_NAME = 'statistikatlas'`, `STORE = 'dateien'`, `KEY = 'allbus'`, DB-Version 1.

- [ ] **Step 1: Write the failing tests** (`import { IDBFactory } from 'fake-indexeddb'`, je Test `new IDBFactory()`)
  - `saves, loads and removes the file`: speichern `{ name: 'ZA8831_v1-3-0.sav', bytes: Uint8Array.of(1,2,3).buffer }` → `true`; laden liefert gleichen Namen und Bytes `[1,2,3]`; nach `removeStoredAllbus` liefert laden `null`.
  - `returns null and false without IndexedDB`: mit `idb = undefined as any` und ohne globales `indexedDB`: `loadStoredAllbus()` → `null`, `saveStoredAllbus(...)` → `false`, kein Wurf.
  - `a second save replaces the first`.
- [ ] **Step 2:** `node --import tsx --test src/sandbox/allbusStore.test.ts` → FAIL (Modul fehlt).
- [ ] **Step 3:** Implementieren; Standard `idb = globalThis.indexedDB`; alle Fehler fangen.
- [ ] **Step 4:** Test → PASS.
- [ ] **Step 5:** Commit `feat: keep the ALLBUS file in the browser (IndexedDB)`.

### Task 2: Freischalten an der Datei-Zone, Laden beim Start, Entfernen

**Files:**
- Modify: `src/sandbox/ui/DataDrop.tsx` (`LoadedData` um `bytes: ArrayBuffer` erweitern; `loadAllbusFile` gibt `bytes` mit; nach erfolgreichem Laden `saveStoredAllbus`; Text der Notiz)
- Create: `src/chapter/allbusContext.tsx`
- Modify: `src/components/LearningPath.tsx` (Kontext bereitstellen, gespeicherte Datei beim Start lesen, Entfernen-Knopf)
- Modify: `src/sandbox/testData.ts` bzw. `src/tasks/testRender.ts` (`testData()` liefert `bytes: new ArrayBuffer(0)`)
- Test: `src/chapter/allbusContext.test.ts`, bestehende `src/tasks/host.test.ts`

**Interfaces:**
- Consumes: Task 1.
- Produces:
  - `restoreAllbus(idb?: IDBFactory): Promise<LoadedData | null>` in `allbusContext.tsx`: lädt, parst mit `loadAllbusFile`, bei Fehler `removeStoredAllbus` und `null`.
  - `AllbusContext` mit `{ data: LoadedData | null; setData(d: LoadedData): void; forget(): Promise<void>; notStored: boolean }`, Hook `useAllbus()`.
  - `DataDrop` neue Prop `onStored?: (ok: boolean) => void`.

- [ ] **Step 1: Write the failing tests**
  - `restoreAllbus returns null and deletes an unreadable entry`: Bytes `[1,2,3]` gespeichert → `null`, danach `loadStoredAllbus` → `null`.
  - `restoreAllbus reads a stored fixture file`: gespeichert `{ name: 'ZA8831_v1-3-0.sav', bytes: fixtureBuffer() }` (aus `src/sandbox/testData.ts`) → `nCases`-Prüfung über `data.sav.nCases === 60`, `data.version` beginnt mit `v1.3.0`.
  - Rendertest Datei-Zone: Text enthält „bleibt in deinem Browser gespeichert, bis du sie entfernst“ und „Hochgeladen wird nichts“; enthält nicht mehr „Nichts wird hochgeladen oder gespeichert“.
- [ ] **Step 2:** Tests → FAIL.
- [ ] **Step 3:** Implementieren. Notiz der Datei-Zone ersetzt den letzten Satz durch: „Die Datei bleibt in deinem Browser gespeichert, bis du sie entfernst. Hochgeladen wird nichts.“ `LearningPath` ruft `restoreAllbus()` in `useEffect` einmal auf, solange `initialData` fehlt. `notStored === true` → einmalige Notiz aus Review Focus 2 unter der Datei-Zone. Entfernen-Knopf laut Festlegung 5, danach `data = null`.
- [ ] **Step 4:** `node --import tsx --test src/chapter/*.test.ts src/tasks/*.test.ts src/tasks/*/*.test.ts` → PASS (alle alten Sitzungen unverändert grün).
- [ ] **Step 5:** Commit `feat: unlock the learning path once, restore the file on start`.

### Task 3: Antwortprüfung und Kapitel-Zustand

**Files:**
- Create: `src/chapter/answers.ts`, `src/chapter/state.ts`
- Test: `src/chapter/answers.test.ts`, `src/chapter/state.test.ts`

**Interfaces:**
- Consumes: `numberReadings` aus `src/tasks/kit/numbers.ts`.
- Produces:
  - `type Question = { id: string; label: string; kind: 'number'; target: number; right: string; hint: string } | { id: string; label: string; kind: 'choice'; options: { value: string; label: string }[]; target: string; right: string; hint: string }`
  - `answerNumbers(input: string): number[]` – erste Zahl im Text, alle Lesarten aus `numberReadings`.
  - `judge(q: Question, input: string | undefined): 'open' | 'right' | 'wrong'`
  - `chapterStorageKey = 'statistikatlas.kapitel.v1'`, `type ChapterState = { predictions: Record<string,string>; answers: Record<string,string> }`, `parseChapterStore(raw: string | null): Record<number, ChapterState>` (defensiv wie `parseTaskStore`, Strings auf 200 Zeichen gekürzt).
  - `chapterStatus(state: ChapterState, required: Question[]): 'open' | 'running' | 'done'`

- [ ] **Step 1: Write the failing tests**
  - `answerNumbers`: `'37 Personen'` enthält 37; `'40 %'` enthält 40; `'2.071'` enthält 2071; `'65.000'` enthält 65; `'4.529'` enthält 4529; `'4,529'` liefert nur 4,529 (deutsches Komma); `''` → `[]`.
  - `judge`: Zahl 5209 mit `'5.209'` → right, mit `'5209'` → right, mit `'5.164'` → wrong, mit `''`/`undefined` → open; Wahl `'MAIL'` → right, `'CAPI'` → wrong.
  - `parseChapterStore('{"chapters":{"4":{"answers":{"a1b":"37"},"x":1}}}')` → `{ 4: { predictions: {}, answers: { a1b: '37' } } }`; Müll → `{}`.
  - `chapterStatus`: nichts beantwortet → open; eine Pflichtfrage richtig → running; alle Pflichtfragen richtig → done.
- [ ] **Step 2:** → FAIL. **Step 3:** implementieren. **Step 4:** → PASS.
- [ ] **Step 5:** Commit `feat: chapter answers accept German and R number formats`.

### Task 4: Editor-Logik der Code-Werkstatt (rein, ohne DOM)

**Files:**
- Create: `src/chapter/workshop/editor.ts`
- Test: `src/chapter/workshop/editor.test.ts`

**Interfaces:**
- Consumes: `tokenizeR` aus `src/tasks/kit/RCode.tsx` (Färbung).
- Produces:
  - `type Edit = { text: string; start: number; end: number }`
  - `type Key = { key: string; ctrl: boolean; meta: boolean; shift: boolean; alt: boolean }`
  - `applyKey(e: Edit, k: Key): Edit | null` – `null` heißt „Browser macht es selbst“.
  - `parseMarks(template: string): { code: string; marks: { line: number; from: number; to: number; word: string }[] }` – Stellen in `⟦…⟧`, Zeilen 0-basiert.
  - `forBrowser(code: string): string` – entfernt Zeilen `library(tidyverse)`, `library(mariposa)` und `allbus <- read_spss(…)`.

- [ ] **Step 1: Write the failing tests** (Cursor als `|` in den Erwartungen)
  - Strg/Cmd+Umschalt+M: `'allbus|'` → `'allbus %>% |'`.
  - Alt+−: `'x|'` → `'x <- |'`.
  - Enter nach `%>%`: `'allbus %>%|'` → `'allbus %>%\n  |'`; nach `+` in eingerückter Zeile: `'  ggplot(aes(x = a)) +|'` → `'  ggplot(aes(x = a)) +\n  |'`; Enter in offener Klammer richtet aus: `'f(a,|'` → `'f(a,\n  |'`.
  - `(` → `'(|)'`, `"` → `'"|"'`; Backspace zwischen `(|)` → `'|'`.
  - Strg/Cmd+Umschalt+C schaltet `# ` am Zeilenanfang aller markierten Zeilen um.
  - Strg/Cmd+Enter → `null` (Ausführen macht die Komponente); **Tab und Umschalt+Tab → `null`**.
  - `parseMarks('drop_na(⟦pa01⟧) %>%\n  ggplot(aes(x = ⟦pa01⟧))')` → Code ohne Klammern, zwei Marken in Zeile 0 und 1, Wort `pa01`.
  - `forBrowser` lässt `allbus %>%\n  frequency(hs01)` unverändert und entfernt die drei Kopfzeilen des Startblocks aus `sitzung4.html` (Vorlage `start`).
- [ ] **Step 2:** → FAIL. **Step 3:** implementieren (Verhalten wie `Live-R`-Abschnitt im Prototyp, Zeilen ab `/* ---------- Live-R`). **Step 4:** → PASS.
- [ ] **Step 5:** Commit `feat: RStudio shortcuts for the code workshop`.

### Task 5: webR-Anbindung

**Files:**
- Create: `src/chapter/workshop/webr.ts`
- Test: `src/chapter/workshop/webr.test.ts`

**Interfaces:**
- Consumes: `forBrowser` (Task 4), `LoadedData.bytes` (Task 2).
- Produces:
  - Konstanten `WEBR_URL = 'https://webr.r-wasm.org/v0.6.1/webr.mjs'`, `PACKAGES = ['mariposa', 'haven', 'ggplot2', 'dplyr', 'tidyr']`, `REPOS = ['https://yannickdiehl.r-universe.dev', 'https://repo.r-wasm.org']`, `START_TIMEOUT_MS = 90_000`, `MAX_LINES = 300`.
  - `type Output = { text: string; messages: { kind: 'warning' | 'error' | 'message'; text: string }[]; images: ImageBitmap[] }`
  - `runR(code: string, file: { name: string; bytes: ArrayBuffer }): Promise<Output>` – startet einmalig (Singleton-Promise), installiert `PACKAGES` mit `{ quiet: true, repos: REPOS }`, lädt `library(dplyr); library(tidyr); library(ggplot2); library(haven); library(mariposa)`, schreibt die Datei einmal nach `/home/web_user/ZA8831_v1-3-0.sav` und liest `allbus <- read_spss("ZA8831_v1-3-0.sav")`; danach `captureR(forBrowser(code), { withAutoprint: true, captureStreams: true, captureConditions: true, captureGraphics: { width: 700, height: 420 } })`; Meldungstexte über `x.data.get('message')`, bei geworfenem Fehler `geterrmessage()`.
  - `toOutput(items: { type: string; data: unknown }[], maxLines = MAX_LINES): Output` (rein, testbar).
  - `resetR(): void` – verwirft das Singleton nach Startfehler.

- [ ] **Step 1: Write the failing tests** für `toOutput`: `stdout`-Zeilen werden verbunden; 400 Zeilen → 300 Zeilen plus `… gekürzt (100 weitere Zeilen)`; `stderr` mit „Removed 220 rows“ landet als `warning`; leere Liste → `text === ''`.
- [ ] **Step 2:** → FAIL. **Step 3:** implementieren; Start mit `Promise.race` gegen `START_TIMEOUT_MS`, Fehlertext „R konnte nicht gestartet werden. Prüfe die Internetverbindung oder kopiere den Code nach RStudio.“; nach Fehler `resetR()`. **Step 4:** → PASS.
- [ ] **Step 5:** Commit `feat: run R in the browser with webR 0.6.1`.

### Task 6: Code-Werkstatt-Komponente

**Files:**
- Create: `src/chapter/workshop/CodeWorkshop.tsx`, `src/chapter/chapter.css` (Abschnitt Werkstatt)
- Test: `src/chapter/workshop/CodeWorkshop.test.ts`

**Interfaces:**
- Consumes: Tasks 2, 4, 5.
- Produces: `CodeWorkshop({ id, title, template, tryOut?, live? }: { id: string; title: string; template: string; tryOut?: boolean; live?: boolean })`.
  - Aufbau und Texte wie `.codewrap` im Prototyp: Kopf „Code-Werkstatt“ + Titel, Knöpfe „▶ Ausführen“, „Zurücksetzen“, „Kopieren“; Zeilennummern; Textarea mit `aria-label="R-Code: {title}"` über zwei Ebenen (Marken, Färbung); Einfüge-Leiste `%>%`, `<-`, `" "`, `( )`; Zeile „Zum Anpassen markiert: Zeile n: `wort`; …“ mit `id="{id}-st"` und `aria-describedby` an der Textarea; Kürzel-Zeile; Ausgabe-Bereich mit `aria-live="polite"`.
  - Ohne `live` nur Kopieren (Startblock, Schichten-Beispiel). Ohne Datei: Ausgabe-Bereich zeigt `DataDrop` mit Satz „Zum Ausführen braucht die Werkstatt einmal deine ALLBUS-Datei.“. Offline siehe Festlegung 4. Bei `tryOut` statt Markenzeile: „Probier-Werkstatt: Ändere den Vorschlag oder schreib ganz neu. Klammern und Anführungszeichen schließen sich wie in RStudio von allein.“
  - Kopieren liefert den Code ohne `⟦⟧`.

- [ ] **Step 1: Write the failing tests** (Render mit `renderToStaticMarkup` und Kontext-Provider)
  - Markenliste und `aria-describedby` vorhanden; im Textarea-Inhalt kein `⟦`.
  - Ohne Datei erscheint die Datei-Zone im Ausgabe-Bereich, mit Datei nicht.
  - Ohne `live` kein Knopf „Ausführen“.
  - CSS-Test: `chapter.css` enthält für `.workshop textarea` `font-variant-ligatures: none`.
- [ ] **Step 2:** → FAIL. **Step 3:** implementieren; Farben aus Spec §4.5. **Step 4:** → PASS.
- [ ] **Step 5:** Commit `feat: code workshop component`.

### Task 7: Kapitel-Bausteine und Layout

**Files:**
- Create: `src/chapter/blocks/ChapterLayout.tsx`, `Foundation.tsx`, `Card.tsx`, `TaskBlock.tsx`, `Predict.tsx`, `Questions.tsx`, `Hints.tsx`, `TryOut.tsx`, `TakeAway.tsx`, `Figure.tsx`; `src/chapter/chapter.css` (übrige Abschnitte); `src/chapter/companions/*.svg` (aus `prototyp/`: `hallo.svg`, `hinweis.svg`, `tipp.svg`, `uebung.svg`, dazu `denken.svg` aus `RWorkshop/Bilder/begleiter/`)
- Modify: `package.json` (`@fontsource/fredoka`, `@fontsource/nunito`, `@fontsource/jetbrains-mono` 5.3.0), `src/main.tsx` (Schrift-Importe)
- Test: `src/chapter/blocks/blocks.test.ts`

**Interfaces:**
- Consumes: Tasks 3, 6.
- Produces (Props; Aussehen und Wortlaut der festen Texte wie die gleichnamigen Klassen im Prototyp):
  - `ChapterLayout({ session, lead, goals, known, toc, children })` – Kopf mit Stein, Lernziele, „So arbeitest du mit dieser Seite“, Sprungleiste `jumps: { href: string; label: string }[]`, rechtes Inhaltsverzeichnis `toc: { group: string; items: { href; label }[] }[]`.
  - `TopicHeading({ id, n, title })` (h2), `Foundation({ id, n, title, intro, taskHref, children })` (h3, Link „Schon klar? Direkt zu Aufgabe n ↓“), `Card({ id, step, title, tag, children })` (h4, Schrittnummer für Screenreader lesbar), `InShort`, `MoreDetail` (natives `details`), `Mixup`, `Known({ session })` (graues Schild „kennst du aus Sitzung n“).
  - `TaskBlock({ id, n, title, required, question, goal, foundationHref, children })` (h3, Link „↑ Grundlage n nachlesen“).
  - `Predict({ id, prompt, options })` – speichert in `predictions[id]`, Text „Festgelegt: … Die Auflösung bekommst du, wenn du am Ende der Aufgabe deine Antworten prüfst.“
  - `Questions({ id, questions, predictionId? })` – Prüfen-Knopf, Zeilen „✓/✗/• Frage: …“, „Deine Festlegung vorher war: …“, `aria-live`, `aria-invalid` an falschen Feldern.
  - `Hints({ steps: [string|ReactNode, string|ReactNode, string|ReactNode] })` – „Hilfe, Stufe 1: Denkanstoß“, „Stufe 2: Wo schaue ich?“, „Stufe 3: Lösung“.
  - `TryOut({ idea, workshop })` – zugeklapptes `details`, Summary „Weiterdenken in der Probier-Werkstatt (für die Aufgabe nicht nötig)“, Text „Für die Aufgabe reichen die Vorlagen oben. Hier ist Platz für eigene Fragen. Eine Idee: {idea} Die Probier-Werkstatt startet mit einem Vorschlag.“
  - `Figure({ svg, alt, caption? })` – Inline-SVG mit `role="img"` und `aria-label` bzw. versteckter Textfassung.
  - `TakeAway({ points, selfTest, script })` – Selbsttest mit Begründungen, Skript-Download als `.R`.

- [ ] **Step 1: Write the failing tests**
  - Überschriften lückenlos: Kapitel-Rendering hat h2 → h3 → h4 ohne Sprung.
  - Jeder `href="#x"` im Rendering hat ein `id="x"`.
  - `Questions` mit gespeicherter falscher Antwort: `aria-invalid="true"` am Feld, Rückmeldung in `aria-live`.
  - `TryOut` ist standardmäßig zu und enthält „für die Aufgabe nicht nötig“.
  - `Figure` ohne `alt` wirft im Test (Pflichtprop, Laufzeitprüfung).
- [ ] **Step 2:** → FAIL. **Step 3:** implementieren; CSS aus dem `<style>`-Block des Prototyps übernehmen, unter `.chapter` geschachtelt, Breite: Inhalt nutzt den Platz zwischen den Seitenleisten. **Step 4:** → PASS.
- [ ] **Step 5:** Commit `feat: chapter building blocks in the Baukasten design`.

### Task 8: Sitzung 4, Inhalte und Echtdaten-Prüfung

**Files:**
- Create: `src/chapter/s04/content.ts`, `src/chapter/s04/allbus.local.test.ts`, `src/chapter/s04/content.test.ts`, `scripts/chapter-r-export.ts`
- Create: `src/chapter/s04/bilder/*.svg` (die sechs `s4-*.svg` aus `prototyp/`)

**Interfaces:**
- Produces in `content.ts` (Werte aus dem Prototyp, Abschnitt „Daten“ und „Codevorlagen“):
  - Aggregate: `LS01` (Häufigkeiten 0–10), `FORMS` (mp05, ls01, dk11, vm18), `AGE` (18–99), `DW15`, `RIDDLE` (Bilder A–D), `HS01`, `XT10`-Kennzahlen, `WEST_EAST`.
  - `TEMPLATES: Record<string, { title: string; code: string; tryOut?: boolean }>` – alle Vorlagen (`start`, `schichten`, `a1v`, `a1n`, `a2`, `a3d`, `a3o`, `a3n`, `a3m`, `a4`, `a4f`, `a4z`, `a4zf`, `frei_a1` … `frei_a4`) im Wortlaut des Prototyps v11, Marken als `⟦…⟧`.
  - `QUESTIONS: Record<'a1' | 'a3' | 'a4', Question[]>` – aus `pruefe(...)` im Prototyp (Ziele: a1 `na`, 37, 5209, `gut`; a3 65, `max`, 4529, `60`, `weg`; a4 `MAIL`, `CAPI`, 306, `lang`, `ehrlich`), dazu Grundlage-Fragen (`v4-frage2` = 38) und A1-Achse (`null`).
  - `REQUIRED = [...QUESTIONS.a1, ...QUESTIONS.a4]` (Pflichtaufgaben A1 und A4).

- [ ] **Step 1: Write the failing tests**
  - `content.test.ts`: jede Vorlage besteht `rStyleProblems` aus `src/tasks/kit/rStyle.ts` ohne Befund; keine Vorlage enthält `|>`, `!is.na`, `ifelse`; jede `tryOut`-Vorlage ist ausführbarer Code (mindestens eine Zeile ohne `#`).
  - `allbus.local.test.ts` (nur mit `ALLBUS_SAV`, Muster wie `src/tasks/allbus.local.test.ts`): `hs01` gültig 5209, fehlend 37, häufigste Kategorie 2 mit 2071; `ls01` gleich `LS01`, n 5164; `xt10` N 5026, fehlend 220 (alle `mode == 4`), Median 65, Maximum 61895, über 180: 497; Mediane je `mode` alle/≤180: MAIL 75/60 (N 1436/1130), CAPI 70/70 (14 heraus), CAWI 49/45; Anteil Vielfache von 5: MAIL 71,5 %, CAPI 39,5 %, CAWI 20 % (gerundet); `mp05`, `dk11`, `vm18`, `vm20`, `pa02a`, `pa01`, `dw15`, `age` gleich den Konstanten; West/Ost `ls01` 7,44/7,18 bei n 3510/1654.
  - `scripts/chapter-r-export.ts s04 > /tmp/s04.R` schreibt alle Vorlagen ohne Marken in ein Skript mit `ALLBUS_SAV` als Pfad.
- [ ] **Step 2:** `node --import tsx --test src/chapter/s04/*.test.ts` → FAIL; mit `ALLBUS_SAV=… ` ebenso.
- [ ] **Step 3:** `content.ts` füllen. **Step 4:** Tests → PASS; dazu `Rscript /tmp/s04.R` mit echter Datei → läuft ohne Fehler (Warnungen „Removed n rows“ erlaubt).
- [ ] **Step 5:** Commit `feat: session 4 chapter content checked against ZA8831 v1.3.0`.

### Task 9: Sitzung 4, Grundlagen und interaktive Bilder

**Files:**
- Create: `src/chapter/s04/figures/Sketch.tsx`, `TowerToStack.tsx`, `ShapeLab.tsx`, `RulerBoxplot.tsx`, `AgeBoxplot.tsx`, `Histogram.tsx`, `AxisStart.tsx`, `DecisionTree.tsx`, `Bars.tsx` (gemeinsame Säulen-SVG), `src/chapter/s04/Foundations.tsx`
- Test: `src/chapter/s04/foundations.test.ts`

**Interfaces:**
- Consumes: Task 7 (`Foundation`, `Card`, `Figure`, `Questions`), Task 8 (Aggregate, `QUESTIONS`).
- Produces: `Foundation1` … `Foundation4`, `Overview` (React-Komponenten ohne Props).
  - Je Bild das Verhalten des gleichnamigen Prototyp-Abschnitts (V1 Skizze, V2 Turm zum Stapel, V3 Formen und Labor, V4 Lineal und Boxplot, Echter Boxplot, V5 Histogramm, V6 Entscheidungsbaum in der v11-Fassung mit Schildern auf den Pfaden, V7 Achse), jeweils mit gleichwertiger Textfassung; Schieberegler mit `aria-valuetext`.

- [ ] **Step 1: Write the failing tests**
  - Jedes `role="img"` hat `aria-label` oder `aria-labelledby` mit Text ≥ 40 Zeichen.
  - Grundlage 4 enthält die Frage `v4-frage2` mit Rückmeldung „Von neun Personen steht die fünfte in der Mitte: 38 Stunden.“
  - Entscheidungsbaum: SVG `viewBox="0 0 760 262"`, Textfassung nennt alle fünf Formen.
  - Kein R-Code in den Grundlagen: Das Rendering von `Foundation1` … `Foundation4` und `Overview` enthält kein Element mit `class="workshop"` und kein `<pre`.
- [ ] **Step 2:** → FAIL. **Step 3:** implementieren. **Step 4:** → PASS.
- [ ] **Step 5:** Commit `feat: session 4 foundations with accessible figures`.

### Task 10: Sitzung 4, Aufgaben, Mitnehmen und Zusammenbau

**Files:**
- Create: `src/chapter/s04/Tasks.tsx` (A1–A4 inklusive Rätselkasten und Achsen-Frage), `src/chapter/s04/Session4.tsx`, `src/chapter/s04/session4.test.ts`

**Interfaces:**
- Consumes: Tasks 7–9.
- Produces: `Session4()` – vollständiges Kapitel in der Reihenfolge der Spec §5 (Variante B: Vorweg R lesen → Thema 1–4 je Grundlage + Aufgabe → Überblick → Mitnehmen); `session4Status(state: ChapterState)` über `chapterStatus(state, REQUIRED)`.

- [ ] **Step 1: Write the failing tests**
  - Reihenfolge der Überschriften: „Vorweg: R lesen“, „Thema 1“, Grundlage 1, „Aufgabe 1“, … „Thema 4“, Grundlage 4, „Aufgabe 4“, „Überblick“, „Das Wichtigste“.
  - Jede Aufgabe enthält Ziel, Link zur Grundlage, Hilfe in drei Stufen und eine zugeklappte Probier-Werkstatt.
  - Aufgabe 2 enthält Vorlage `a2` mit zwei Marken und **keine** Pflichtfrage (Zusatz).
  - Aufgabe 4: Einleitung enthält „71,5 %“ und „220 Papierbögen“.
  - Lösungsweg ohne Grafik: Jede Aufgabe ist mit den Textfassungen lösbar (Test: jede Frage-Zielzahl steht in Text oder Ausgabe-Hilfe der Aufgabe, z. B. 5.209, 4.529, 306).
- [ ] **Step 2:** → FAIL. **Step 3:** implementieren. **Step 4:** → PASS.
- [ ] **Step 5:** Commit `feat: session 4 as a chapter`.

### Task 11: Vorschau-Schalter im Lernpfad

**Files:**
- Create: `src/chapter/registry.ts`
- Modify: `src/components/LearningPath.tsx`, `src/App.tsx` (liest `?vorschau=kapitel`), `src/tasks/testRender.ts` (Option `preview`)
- Test: `src/chapter/registry.test.ts`, bestehende `src/tasks/grafik-erst-zeichnen/task.test.ts`

**Interfaces:**
- Consumes: Task 10, Task 3.
- Produces:
  - `chapterRegistry: Partial<Record<number, { Component: () => ReactNode; status: (s: ChapterState) => 'open' | 'running' | 'done'; live: boolean }>>` mit `4: { Component: Session4, status: session4Status, live: false }`.
  - `LearningPath` neue Prop `preview?: boolean`; `renderSession(index, withData, tasks, preview = false)`.

- [ ] **Step 1: Write the failing tests**
  - `renderSession(3)` zeigt weiter „Erst zeichnen, dann zeigen“ (alte Tests unverändert grün).
  - `renderSession(3, true, { tasks: {} }, true)` zeigt „Thema 1: Balken und Häufigkeiten“ und keinen Text „AUFGABE · GRAFIKREDAKTION“.
  - Sitzungsleiste: Status von Sitzung 4 im Vorschau-Modus kommt aus `session4Status`.
- [ ] **Step 2:** → FAIL. **Step 3:** implementieren; im Kapitel-Modus entfallen `learning-terms` und `learning-mission`, Kopfzeile `learning-meta` und Seitenwechsel bleiben. **Step 4:** alle Tests → PASS.
- [ ] **Step 5:** Commit `feat: preview switch for chapter sessions`.

### Task 12: Prüfen im Browser, Doku, Abschluss

**Files:**
- Modify: `docs/AUFGABEN-LEITFADEN.md` (Regeln aus Spec §9 Punkt 2), `docs/PRUEFSTAND.md` (Eintrag mit Testzahlen, R-Lauf, Browserprüfung), `docs/BESCHREIBUNG.md` (Lernpfad als Kapitel, Datei bleibt im Browser)

- [ ] **Step 1:** `node_modules/.bin/tsc --noEmit` → keine Fehler; `node --import tsx --test …` (Skript `test`) → alle grün; mit `ALLBUS_SAV` → Echtdaten-Tests grün.
- [ ] **Step 2:** `node_modules/.bin/vite build && node scripts/export-offline.mjs` → Build erfolgreich, Offline-Datei zeigt Sitzung 4 alt und Werkstatt-Hinweis bei `file:`.
- [ ] **Step 3:** Browser (Dev-Server, `?vorschau=kapitel`, Sitzung 4) bei 1200 px und 390 px: keine Konsolenfehler; Datei einmal laden, Seite neu laden, Werkstatt in A1 ausführen → Balken und „Removed …“ bzw. NA-Balken wie im Prototyp; A4-Vorlage → drei Boxplots; Datei entfernen → Werkstatt bietet Freischalten an; kein horizontales Scrollen bei 390 px.
- [ ] **Step 4:** Tastatur und Screenreader (VoiceOver): Tab durch eine Werkstatt verlässt sie; Rückmeldungen werden angesagt; Rätselkasten mit Textfassungen lösbar.
- [ ] **Step 5:** Doku aktualisieren, Commit `docs: chapter design, guide and test record`.
- [ ] **Step 6: Keine Live-Schaltung.** Der Dozent hat später am 23.11.2026 entschieden: „schalte doch noch nichts live am ende, sondern lass mich nochmal alles kontrollieren“. Sitzung 4 bleibt `live: false`, kein Push nach `main`; alles bleibt auf dem lokalen Zweig `lernpfad-kapitel` bis zu seiner Kontrolle.

### Task 13 (außerhalb des Repos): Folien Sitzung 4 angleichen

**Files:**
- Modify: `Seminarvorbereitung/_build_folien_s4.py` im Kursordner

- [ ] **Step 1:** Code auf den Folien auf `drop_na()` und `to_label()` in der Kette umstellen; `grep -n "is.na\||>" ` im erzeugten Foliensatz → keine Treffer.
- [ ] **Step 2:** Arbeitsphase und Plenum auf A1–A4 umstellen (alten Rätselkasten, „Grafikredaktion“ und Achse West/Ost entfernen).
- [ ] **Step 3:** Input 9 zeigt statt der Bearbeitungsdauer ein Histogramm einer anderen Variable (Vorschlag `age`, deckt sich mit Grundlage 3).
- [ ] **Step 3a:** Input 10 (Formen) ohne die Bearbeitungsdauer; Plenum auf zwei Fragen umstellen: A1 „Wer steckt im NA-Balken, wo beginnt die Achse?“ und A4 „Hineinzoomen oder Abschneiden, wer fehlt im Bild?“. Inputs 1–6 bleiben.
- [ ] **Step 4:** Folien bauen, als Bilder rendern, durchsehen; dem Dozenten zeigen.
