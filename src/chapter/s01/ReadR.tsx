// Sitzung 1 „Einstieg“: Vorweg R lesen (#r1 eine Zeile lesen, der Startblock; #r2 die Code-Werkstatt).
import { Badge, Card, InShort, Mixup, MoreDetail } from '../blocks/Card';
import { CodeWorkshop } from '../workshop/CodeWorkshop';
import { ALT, COPY_ONLY, TEMPLATES } from './content';
import { WorkshopSchema } from './figures/Pictures';

/** A workshop for one template of `TEMPLATES`; `id` defaults to the key (needed when a template appears twice). */
export function Workshop({ k, id = k }: { k: string; id?: string }) {
  const t = TEMPLATES[k];
  return <CodeWorkshop id={id} title={t.title} template={t.code} live={!COPY_ONLY.includes(k)} tryOut={t.tryOut} />;
}

/** One block of a code line with its small label below (as „So liest du eine Zeile“ in session 4). */
function Piece({ code, bg, note, border }: { code: string; bg: string; note: string; border?: boolean }) {
  return <span><b style={{ background: bg, border: border ? '1.5px solid var(--line)' : undefined }}>{code}</b><small>{note || ' '}</small></span>;
}

/** Bild s1-zeile: two rows of coloured pieces; the text version is the accessible name. */
export function LineBlocks() {
  return <div className="s1-zeilen" role="img" aria-label={ALT.zeile}>
    <div className="lesehilfe">
      <Piece code="allbus" bg="#E5E9EE" note="Objekt: ein Name" />
      <Piece code="<-" bg="var(--gelbh)" note="lege ab unter" />
      <Piece code="read_spss(" bg="var(--gruenh)" note="Funktion: was passiert" />
      <Piece code={'"ZA8831_v1-3-0.sav"'} bg="#FFE3D2" note="Argument: Text in Anführungszeichen" />
      <Piece code=")" bg="var(--gruenh)" note="" />
    </div>
    <div className="lesehilfe">
      <Piece code="find_var(" bg="var(--gruenh)" note="Funktion" />
      <Piece code="allbus" bg="#E5E9EE" note="1. Argument: ein Objekt, ohne Anführungszeichen" />
      <Piece code="," bg="#fff" note="Komma trennt Argumente" border />
      <Piece code={'"klima"'} bg="#FFE3D2" note="2. Argument: Text" />
      <Piece code=")" bg="var(--gruenh)" note="" />
    </div>
  </div>;
}

/** Keyboard shortcuts of the workshop, the same list as under every workshop. */
function Shortcuts() {
  return <ul className="wk-tasten s1-tasten">
    <li><kbd>Strg</kbd>/<kbd>Cmd</kbd> + <kbd>Enter</kbd>: ausführen</li>
    <li><kbd>Alt</kbd> + <kbd>−</kbd>: Pfeil <code>&lt;-</code></li>
    <li><kbd>Strg</kbd>/<kbd>Cmd</kbd> + <kbd>Umschalt</kbd> + <kbd>M</kbd>: Pipe <code>%&gt;%</code> (brauchst du ab Sitzung 2)</li>
    <li><kbd>Enter</kbd> nach <code>%&gt;%</code> oder <code>+</code> rückt ein</li>
    <li><kbd>Strg</kbd>/<kbd>Cmd</kbd> + <kbd>Umschalt</kbd> + <kbd>C</kbd>: Kommentar an oder aus</li>
  </ul>;
}

/** Vorweg: R lesen, two cards (h4): #r1 and #r2. */
export function ReadR() {
  return <>
    <Card id="r1" stone="R" title="Eine Zeile R lesen: der Startblock" badge={<Badge>neu</Badge>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">So beginnt jede Arbeit mit dem ALLBUS in R. Diese vier Zeilen heißen in diesem Kurs <b>Startblock</b>. Du führst sie in RStudio zu Beginn jeder Sitzung aus. In der Code-Werkstatt hier auf der Seite ist das schon für dich erledigt.</p>
      <Workshop k="start" />
      <p className="absatz">Zeilen mit <code>#</code> am Anfang sind <b>Kommentare</b>: Notizen für Menschen, R überspringt sie. <code>library()</code> lädt ein <b>Paket</b>, eine Sammlung von Werkzeugen. Die letzte Zeile liest die Datei und legt sie unter dem Namen <code>allbus</code> ab. So liest du sie, Baustein für Baustein:</p>
      <LineBlocks />
      <p className="absatz">Die erste Zeile liest du von rechts nach links: Lies die Datei ‚ZA8831_v1-3-0.sav‘ ein und leg das Ergebnis unter dem Namen <code>allbus</code> ab. Die zweite Zeile von links nach rechts: Such in <code>allbus</code> nach dem Wort ‚klima‘.</p>
      <InShort>Ein <b>Objekt</b> ist ein Name, unter dem R sich etwas merkt. Mit <code>&lt;-</code> legst du etwas unter einem Namen ab. Eine <b>Funktion</b> sagt, was passiert; ihre <b>Argumente</b> in den Klammern sagen, womit und wie. Mehrere Argumente trennt ein Komma.</InShort>
      <MoreDetail summary="Objekt, Funktion, Argument">
        <ul>
          <li><code>allbus</code> ist nach dem Einlesen der ganze Datensatz. Den Namen hast du selbst vergeben; <code>daten &lt;- read_spss(…)</code> ginge genauso. Wir nehmen in allen Sitzungen <code>allbus</code>, damit jede Vorlage passt.</li>
          <li>Eine Funktion erkennst du an den runden Klammern direkt hinter dem Namen. Sie bekommt etwas, tut etwas und gibt etwas zurück. <code>read_spss()</code> bekommt einen Dateinamen und gibt einen Datensatz zurück.</li>
          <li>Argumente haben Namen. <code>read_spss(path = "ZA8831_v1-3-0.sav")</code> ist dasselbe wie <code>read_spss("ZA8831_v1-3-0.sav")</code>. Den Namen darfst du weglassen, wenn die Argumente in der vorgesehenen Reihenfolge stehen. Was du gar nicht angibst, ist voreingestellt.</li>
          <li><b>Text oder Name?</b> Was in Anführungszeichen steht, ist für R ein Text, etwa ein Dateiname oder ein Suchwort. Was ohne Anführungszeichen steht, ist ein Name: der Name eines Objekts wie <code>allbus</code> oder einer Variable wie <code>pi08</code>.</li>
          <li>Warum erst <code>tidyverse</code>, dann <code>mariposa</code>? Heißen zwei Funktionen aus verschiedenen Paketen gleich, gilt die aus dem zuletzt geladenen Paket. In diesem Kurs ist die Reihenfolge immer dieselbe, damit jede Vorlage bei allen dieselben Funktionen nutzt, zum Beispiel <code>frequency()</code> aus mariposa.</li>
          <li>Mehr dazu im R-Workshop, Kapitel 1.</li>
        </ul>
      </MoreDetail>
      <Mixup><code>&lt;-</code> und <code>=</code>. Mit <code>&lt;-</code> legst du ein Objekt unter einem Namen ab (<code>allbus &lt;- read_spss(…)</code>). Mit <code>=</code> stellst du ein Argument ein (<code>path = "…"</code>). Und: <code>"allbus"</code> mit Anführungszeichen ist nur ein Wort, <code>allbus</code> ohne ist dein Datensatz.</Mixup>
      <p className="absatz">Beim Laden schreibt RStudio farbige Zeilen in die Konsole, etwa ‚Attaching core tidyverse packages‘, ‚Conflicts‘ mit ✖ oder ‚Das folgende Objekt ist maskiert ‘package:stats’: frequency‘. Das sind Hinweise, keine Fehler. Die letzte Zeile heißt: Ab jetzt gilt <code>frequency()</code> aus mariposa, nicht die gleichnamige Funktion aus dem Grundpaket stats. Wie du echte Fehler erkennst, steht in <a href="#thema4">Thema 4</a>.</p>
    </Card>

    <Card id="r2" stone="R" title="Die Code-Werkstatt" badge={<Badge>neu</Badge>} tag={{ kind: 'adapt', label: 'Werkzeug' }}>
      <p className="lead">In jeder Aufgabe stehen Code-Vorlagen in einer <b>Code-Werkstatt</b>. Dort läuft echtes R, direkt hier im Browser. Was du hier ausführst, gibt dasselbe aus wie in RStudio. So sieht eine Werkstatt aus:</p>
      <WorkshopSchema />
      <p className="absatz">Die Werkstatt hat dieselben <b>Tastenkürzel wie RStudio</b>:</p>
      <Shortcuts />
      <p className="absatz">Die Tab-Taste springt zum nächsten Knopf, wie überall auf der Seite; einrücken musst du nicht selbst. Markierte Stellen stehen für Screenreader zusätzlich als Liste mit Zeilennummer unter der Werkstatt.</p>
      <InShort><b>Ausführen</b> zeigt sofort, was R ausgibt. <b>Zurücksetzen</b> holt die Vorlage zurück; kaputt machen kannst du nichts. <b>Kopieren</b> nimmt deinen Code mit nach RStudio. Gelb markierte Stellen passt du an.</InShort>
      <MoreDetail summary="Werkstatt und RStudio">
        <ul>
          <li>In der Werkstatt ist der Startblock schon erledigt: <code>allbus</code> ist deine geladene ALLBUS-Datei. Steht eine Zeile mit <code>library(…)</code> oder <code>allbus &lt;- read_spss(…)</code> in einer Vorlage, überspringt die Werkstatt sie, damit du denselben Code nach RStudio kopieren kannst.</li>
          <li>Jedes Ausführen beginnt mit deiner unveränderten Datei. Was du einmal geändert hast, wirkt nicht in die nächste Werkstatt hinüber. Jede Vorlage ist für sich vollständig.</li>
          <li>Beim ersten Ausführen startet R im Browser. Das dauert einmal etwa 20 Sekunden, dazu 10 bis 20 Sekunden für deine Datei; danach antwortet R sofort.</li>
          <li>Ohne Internet läuft die Werkstatt nicht. Dann kopierst du den Code und führst ihn in RStudio aus.</li>
          <li>Die Werkstatt ersetzt RStudio nicht: Für die Klausur und für eigene Auswertungen arbeitest du in RStudio. Die Werkstatt ist zum Üben da.</li>
        </ul>
      </MoreDetail>
      <Mixup>Ausführen und Prüfen. <span aria-hidden="true">▶</span> Ausführen zeigt dir, was R ausgibt. Ob deine Antwort stimmt, prüfst du am Ende jeder Aufgabe mit ‚Antworten prüfen‘: Dort trägst du ein, was du in der Ausgabe gelesen hast.</Mixup>
    </Card>
  </>;
}
