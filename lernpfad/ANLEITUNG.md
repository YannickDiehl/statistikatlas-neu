# Anleitung: ein Kapitel ins Fokus-Format bringen

Diese Anleitung gilt für jedes Kapitel `kNN` (Sitzung NN). Das fertige Vorbild ist **Kapitel 4**: `lernpfad/kapitel/k04/`. Lies dort zuerst alles:
- `KONZEPT.md`
- `meta.json`
- `kapitel.js`
- `inhalt.tsx`
- `figuren.tsx`
- `mitnehmen.tsx`

Die Quelle des bisherigen Kapitels liegt in `src/chapter/sNN/`; die Bestandsaufnahme in `../.superpowers/brainstorm/kapitel4-fokus/_plan/inventar-sNN.md`. Der absolute Pfad ist `/Users/yannickdiehl/Documents/Universität Marburg/Lehre/Methoden Ib B.A./.superpowers/brainstorm/kapitel4-fokus/_plan/`.

## Was du anfasst, was nicht

- **Du schreibst nur in `lernpfad/kapitel/kNN/`:**
  - `meta.json`
  - `kapitel.js`
  - `inhalt.tsx`
  - `mitnehmen.tsx`
  - bei Bedarf `figuren.tsx` und `bausteine.tsx`
- **Nicht ändern:**
  - `src/` (Atlas, Inhalte, Vorlagen)
  - `lernpfad/engine/`, `lernpfad/react/`, `scripts/`
  - andere Kapitel

  Braucht die Engine etwas, das fehlt, löse es im Kapitel (eigene Schrittart in `kapitel.js` oder Baustein in `bausteine.tsx`) und nenne es im Bericht.
- **Vorlagen und Fragen bleiben aus `content.ts`:** Code nicht verändern, Frage-IDs nicht verändern. Gespeicherte Antworten hängen an den IDs.

## Regeln des Dozenten (verbindlich)

1. **Aufgaben** sind das Zentrum. Jede Aufgabe hat eine Frage, „Am Ende …“ und nummerierte Schritte. Code steht als Vorlage zum Lesen mit „→ Journal“; gearbeitet wird im Lernjournal. Zusatzwissen gibt es auf Abruf (`mehr`).
2. **Verstehen erklärt die Aufgaben**, wie sie formuliert sind, Schritt für Schritt in ihren Bezügen, damit man sie lösen kann.
   - **Keine Übungen in Verstehen:**
     - keine Eingabefelder,
     - kein Prüfen und keine Auswahlfragen,
     - kein Schätzen oder Tipp abgeben,
     - kein Zuordnen,
     - kein „→ Konsole“ oder „→ Journal“.
   - **Erlaubt:**
     - erklärende Bilder, auch zum Durchklicken oder mit Schieberegler, wenn sie nur zeigen;
     - rhetorische Fragen, die direkt im Text beantwortet werden (Baustein `Frage`);
     - Hintergrund, „Kurz gesagt“, „Genauer erklärt“, „Häufige Verwechslung“;
     - Code nur zum Lesen (`<Code k="…"/>`).
3. **Schrittnummern:** Die Seite nummeriert alle Schritte einer Aufgabe der Reihe nach, „Erst festlegen“ ist Schritt 1. Verstehen nennt genau diese Nummern: „zu Schritt 3“ und `#aN-…` für den Schritt mit dieser Nummer. Zähle nach.
4. **Nichts vorwegnehmen:** Verstehen nennt nicht die Lösungen der Fragen in „Ergebnis festhalten“. Bilder zeigen die Variable der Aufgabe, mit kleinem Beispiel (etwa „zum Beispiel zwölf Befragte“) statt echter Zahlen, wenn echte Zahlen die Antwort verraten würden.
5. **Fakten nur aus den Quellen:** `content.ts`, die bisherigen Grundlagen- und Aufgabentexte, Feedback-Texte der Fragen. Nichts erfinden. Was sich rechnen lässt, rechne nach.
6. **Stil:**
   - Deutsch, du-Form, einladend.
   - Keine Witzpointen, kein „(fiktiv)“, kein „·“ als Trenner neben Mathe.
   - Fachbegriff immer, dazu „Kurz gesagt“ in einfachen Worten.
   - mariposa-Code im tidy-style (`rec()`, nie `ifelse`).
7. **Barrierefreiheit:**
   - Jedes Bild hat eine gleichwertige Textfassung (`role="img"` mit `aria-label` oder sr-only-Text).
   - Jede Aufgabe ist ohne Grafik lösbar (`ohneGrafik`).
   - Überschriften und Knöpfe sind beschriftet.
8. **Inhalte aus Übungen retten:** Feedback-Texte von Übungen, die wegfallen, tragen oft die Kernerklärung. Übernimm diese Erklärung als Fließtext oder als rhetorische Frage mit Antwort.

## Die Dateien

### `meta.json`
`{ "nr", "titel", "leitfrage", "ziele": [html…], "bekannt": html, "content": "sNN", "ersetzungen": [[alt, neu], …] }`

- `titel`, `leitfrage`, `ziele` und `bekannt` kommen aus `SessionN.tsx` (`ChapterLayout`).
- `ersetzungen` ändert Texte in `src/chapter/sNN/*` beim Bündeln: Sätze, die von „Code-Werkstatt“ oder „hier auf der Seite ausführen“ sprechen, werden zu Sätzen über das Lernjournal. Zum Beispiel: „Hier ist das schon erledigt: Der Startblock steht ganz oben in deinem Lernjournal.“ Prüfe mit `grep -n "Werkstatt\|hier auf der Seite" src/chapter/sNN/*.tsx`.

### `kapitel.js` (Vanilla-JS, kein Bündel)

```js
'use strict';
window.KAPITEL = ({ D, T, esc, bild, warum, probier }) => {
  const BILD = { … };      // Bildunterschriften zu D.SVG[key] (nur wenn src/chapter/sNN/bilder/ existiert)
  const TASKS = [ … ];
  const FREI = { a1: [ { stufe: 'Abwandeln' | 'Erweitern' | 'Eigene Frage', text, tipp }, … ], … };
  const typen = { … };     // optional: eigene Schrittarten (Vanilla), siehe unten
  return { BILD, TASKS, FREI, typen };
};
```

- **`D`:** alle JSON-fähigen Exporte von `content.ts`, also `TEMPLATES`, `QUESTIONS`, `PREDICTIONS`, `HINTS` usw. Bei `bilder/` kommen `SVG` und `ALT` dazu.
- **`T`:** steht für `D.TEMPLATES`. Gelbe Stellen schreibt man in Vorlagen als `⟦…⟧`.

**Aufgabe:**
`{ id: 'a1', n: 1, titel, pflicht: true|false, grund: 'g1', frage, ziel, info?, infoMehr?: [mehr…], schritte: [ … ], probier?: { idee, code }, ohneGrafik?: html, plenum?: text }`
- `grund`: die ID des Verstehen-Abschnitts dieser Aufgabe, immer `g<n>`.
- `ziel`: beginnt klein, denn die Seite schreibt „Am Ende: …“ davor.

**Schritte:** `id` ist eindeutig, etwa `a1-p` für die Festlegung und `a1-1`, `a1-2` …
- `{ id, art: 'festlegen', titel: 'Erst festlegen', pred: '<PREDICTIONS-Schlüssel>' }`. Alternativ `vorhersage: { id, prompt, options?: [text…], einheit?, aufloesung?: text, vergleich?: { [option]: text } }`. `aufloesung` bzw. `vergleich[gewählte Option]` erscheint, sobald alle Fragen der Aufgabe richtig sind. So ersetzt du `Resolution` oder `TipCompare`.
- `{ id, art: 'code', titel, wk: ['<TEMPLATES-Schlüssel>', …], text: html, neu?: true, bekannt?: 'describe() aus Sitzung 3', mehr?: [ … ] }`. Ein Schritt ohne eigene Vorlage („ändere im Journal …“) hat einfach kein `wk` und sagt im `text` genau, was im Journal zu ändern ist.
- `{ id, art: 'lesen', titel, text }` erscheint mit einem Haken „Gelesen und verstanden“.
- `{ id, art: 'fragen', titel: 'Ergebnis festhalten', fragen: '<QUESTIONS-Gruppe>' }` oder `fragen: [Frage…]`. Eine Frage ist `{ id, kind: 'number'|'choice', label, short?, help?, target, tolerance?, options?: [{value,label}], right, hint, specialInput?, wrongByOption? }`, wie `src/chapter/answers.ts`.
  - Weicht das Format des Kapitels ab (`special`, `wrong`, `cases`, `alsoRight` …), dann bilde es in `kapitel.js` auf dieses Format ab.
  - Oder exportiere in `bausteine.tsx` eine Funktion `PRUEFEN(q, input) → { result: 'open'|'right'|'wrong', text }`, die die Prüfung des Kapitels verwendet. Sie ersetzt dann die Standardprüfung für alle Fragen der Seite.
- **Eigene Schrittart:** `{ id, art: '<name>', titel, text, … }`, dazu `typen.<name> = (s, H) => HTMLElement`.
  - `H` enthält `fertig`, `S`, `sichern`, `D`, `esc`, `$` und `codeHtml`.
  - `H.fertig(s.id)` markiert den Schritt als erledigt.
  - Vorbild sind `achse` und `raetsel` in `k04/kapitel.js`.
- **React-Baustein im Schritt:** `baustein: 'Name'` an einem Schritt; `bausteine.tsx` exportiert `BAUSTEINE: Record<string, Baustein>`. Der Baustein bekommt `{ fertig }`. Damit kannst du ein Atlas-Bild oder eine Kapitel-Prüfung aus `src/chapter/sNN/` in eine Aufgabe setzen. Zeigt ein Bild die Lösungen der Fragen, gehört es hinter die Fragen oder in einen Schritt nach „Ergebnis festhalten“.

**`mehr`-Einträge** (Knöpfe unter einem Schritt, öffnen die Seitenleiste):
- `bild(key, 'Bild: …')`: nur mit `D.SVG[key]` und `BILD[key]`.
- `warum('Frage?', html, '<Verstehen-Karten-ID>')`: Mit der dritten Angabe erscheint „Ausführlich im Teil Verstehen →“, und der Verweis springt direkt zur Karte.
- `probier('Titel', html, code, 'a1')`

**„Weiter, wenn du magst“ (`FREI`):** je Aufgabe 2–3 Ideen mit Tipp. Übernimm die bisherigen TryOut- oder Probier-Vorschläge des Kapitels, wo es sie gibt.

### `inhalt.tsx` (Reiter Verstehen)

```tsx
import type { Thema } from '../../react/typen';
import { Abschnitt, AufgabenBild, Bezug, Code, Frage, Leseart } from '../../react/gemeinsam';
import { Card, InShort, Mixup, MoreDetail, Badge } from '@atlas/chapter/blocks/Card';
import { HeadingLevel } from '@atlas/chapter/blocks/level';
export const THEMEN: Thema[] = [ … ];
```

- **Themen:**
  - `vorweg`: „Vorweg: R lesen“, falls das Kapitel `ReadR` hat.
  - `g1` … `gN`: je Aufgabe ein `<Abschnitt id="gN" n={N} titel frage ziel weg={[…]}>`.
  - Am Ende optional ein Überblick (`g<N+1>`, `n: '✓'`).
  - `karten` jedes Themas listet `[Karten-ID, kurzer Titel]` für die rechte Leiste.
- **„Der Weg durch die Aufgabe“** (`weg`): eine Zeile je Schritt der Seite, auch Festlegen und Ergebnis, als `['Schritt 3', '#a1-2', 'was dort passiert', '<Karten-ID>']`.
- **Karten:**
  - `<Card id="k1-…" title="…" badge={<Bezug href="#a1-2">zu Schritt 3</Bezug>} tag={{ kind: 'picture'|'interpret', label: 'Im Bild'|'Hintergrund'|'Deuten'|'Code lesen' }}>`
  - Kartentypen sind `picture`, `interpret`, `estimate` und `adapt`; für Verstehen nimm `picture` oder `interpret`.
- **Vorweg:**
  - Prüfe `src/chapter/sNN/ReadR.tsx`. Enthält es Übungen (Fragen, Tipp abgeben), baue dein eigenes Vorweg aus den erklärenden Teilen; sonst wickle `ReadR` ein wie in `k04/inhalt.tsx`.
  - Werkstätten in `ReadR` werden beim Bündeln automatisch zu Code-Blöcken zum Lesen.
- **Atlas-Bilder:**
  - Zeigende Bilder aus `src/chapter/sNN/figures/` darfst du direkt verwenden.
  - Hat ein Bild eine Übung eingebaut oder zeigt es seine Erklärung erst nach einer Antwort, schreibe in `figuren.tsx` eine Erklärfassung ohne Übung. Vorbild sind `LinealZumBoxplot`, `AchseVergleich` und `TurmZumStapel` in `k04/figuren.tsx`.
- **Ein Abschnitt je Aufgabe:** Es geht nur um die Aufgaben dieses Kapitels. Grundlagen, die keine Aufgabe braucht, kommen als knapper Hintergrund in den passenden Abschnitt oder fallen weg.

### `mitnehmen.tsx`

`export const MITNEHMEN: MitnehmenDaten = { wichtig: [[Punkt (ReactNode), '<Karten-ID>', 'Linktext'], …], selbstKarte: [['<Karten-ID>', 'Titel'], …], workshop?: 'Kapitel N' }`
- **`wichtig`:** die Take-away-Punkte aus `SessionN.tsx`, wörtlich, jeder mit der passenden Karte.
- **`selbstKarte`:** je Selbsttest-Frage, in derselben Reihenfolge, die Karte zum Nachlesen.
- **Abweichende Formate:** Hat `content.ts` den Selbsttest, das Skript oder den Dateinamen nicht als `SELF_TEST`/`SCRIPT`/`SCRIPT_FILE`, setze `selbsttest`, `skript` und `skriptDatei` in `MITNEHMEN`. Optionen dürfen `{ text, why }` sein.

### `bausteine.tsx` (optional)

```tsx
import type { Baustein } from '../../react/typen';
export const BAUSTEINE: Record<string, Baustein> = { Name: ({ fertig }) => <…/> };
// optional: export function PRUEFEN(q, input) { … }   // eigene Antwortprüfung
```

Hinweise zur Engine (Stand nachts): Jeder Schritt kann `haken: true` oder `haken: 'Text'` bekommen (Haken zum Abhaken). Nach „Prüfen“ feuert `document` das Ereignis `lernpfad:antworten` mit `{ schritt, antworten }` (für Bausteine, die erst nach den Antworten erscheinen). Backticks in Antwortmöglichkeiten und Vorhersage-Prompts werden zu Code. `aufloesung` darf auch `resolution`/`resolve` heißen. Verweise in Verstehen auf Karten in einem anderen Thema schalten das Thema selbst um (kein eigener Klick-Handler nötig). „Richtig:“/„Noch nicht.“ am Anfang von Rückmeldungen werden nicht doppelt gesetzt. Bausteine stehen vor dem Haken eines Schritts.

## Bauen und prüfen (Pflicht, bis alles grün ist)

```bash
cd "/Users/yannickdiehl/Documents/Universität Marburg/Lehre/Methoden Ib B.A./Kartenkonzept/Statistikatlas-Prototyp"
node scripts/build-lernpfad.mjs kNN
node scripts/lernpfad-pruefen.mjs kNN
```

`dist/` wird auf http://127.0.0.1:8777 ausgeliefert. Das Prüfskript meldet:
- Konsolenfehler,
- tote Verweise,
- Eingaben in Verstehen,
- Mitnehmen-Verweise ohne Karte,
- leere Bausteine,
- zu breite Seiten.

Danach prüfst du selbst, Aufgabe für Aufgabe:
- Jede Zeile in „Der Weg“ und jedes „zu Schritt n“ stimmt mit der Seitenzählung überein.
- Jeder Schritt hat eine Erklärung.
- Keine Lösung ist vorweggenommen.
- Keine Übung steckt in Verstehen.
- Jede Vorlage aus der Aufgabe ist in Verstehen erklärt.

## Bericht (am Ende, knapp)

1. **Was gebaut ist:**
   - Aufgaben mit Schrittzahl,
   - Themen und Karten,
   - eigene Schrittarten, Bausteine, Erklärfassungen.
2. **Entscheidungen**, die du selbst getroffen hast, und **offene Punkte** für den Dozenten.
3. **Wünsche an die Engine** (falls etwas nur mit einer Änderung dort ginge).
