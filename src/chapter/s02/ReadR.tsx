// Sitzung 2 „Vom Fragebogen zum Datensatz“: Vorweg R lesen (#r1 Startblock und Objekt, #r2 Pipe mit einem Schritt,
// #r3 Nachschlagen mit codebook()), nach Plan sitzung02.md, Abschnitt 2.
import { Begriff } from '../Begriff';
import { Badge, Card, InShort, Known, Mixup, MoreDetail } from '../blocks/Card';
import { CodeWorkshop } from '../workshop/CodeWorkshop';
import { TEMPLATES } from './content';
import { FilterSex } from './figures/Pictures';

/** A workshop for one template of `TEMPLATES` (id = template key). */
export function Workshop({ k, live = false }: { k: string; live?: boolean }) {
  const t = TEMPLATES[k];
  return <CodeWorkshop id={k} title={t.title} template={t.code} live={live} tryOut={t.tryOut} />;
}

const TOKENS: [string, string, string][] = [
  ['frauen', 'Objekt: hier ablegen', '#E5E9EE'],
  ['<-', 'leg ab unter', 'var(--gelbh)'],
  ['allbus', 'Objekt: der Datensatz', '#E5E9EE'],
  ['%>%', 'und dann', 'var(--gelbh)'],
  ['filter(', 'Funktion: was passiert', 'var(--gruenh)'],
  ['sex == 2', 'Argument: welche Fälle bleiben', '#FFE3D2'],
  [')', ' ', 'var(--gruenh)'],
];

const CODEBOOK_WORDS: [string, string, string][] = [
  ['Label:', 'Label', 'Variablenlabel: was gefragt wurde'],
  ['Values:', 'Values', 'welche gültigen Codes vorkommen'],
  ['Value labels:', 'Value Labels', 'Wertelabels: welches Wort zu welchem Code gehört'],
  ['Missing values: … (n = 81)', 'negative Codes mit Freq.', 'fehlende Werte mit Grund und wie oft sie vorkommen'],
  ['Observations: 5246', '5246 observations', 'wie viele Fälle (Befragte)'],
];

/** Vorweg: R lesen, three cards (h4): #r1, #r2 and #r3. */
export function ReadR() {
  return <>
    <p className="hilfe-zeile">Alle Zahlen auf dieser Seite stammen aus dem ALLBUS 2023 und sind ungewichtet. Hier werden Codes gezählt, keine Anteile in der Bevölkerung geschätzt; Gewichtung ist Thema in Sitzung 6.</p>

    <Card id="r1" stone="R" title="Startblock und Objekt" badge={<Known session={1} what="Startblock, Objekt und <-" />} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">Den Startblock kennst du aus Sitzung 1: Er lädt die Werkzeuge und legt den ALLBUS unter dem Namen <code>allbus</code> ab. In RStudio führst du ihn zu Beginn aus. In der Code-Werkstatt hier auf der Seite ist das schon erledigt.</p>
      <Workshop k="start" />
      <p className="hilfe-zeile">Rote Zeilen beim Laden, etwa „Attaching core tidyverse packages“, sind normal und kein Fehler. Findet R die Datei nicht, nimm wie in Sitzung 1 <code>allbus &lt;- read_spss(file.choose())</code>.</p>
      <p><code>allbus</code> ist ein <Begriff id="objekt">Objekt</Begriff>: ein Name, unter dem R sich etwas merkt. Mit <code>&lt;-</code> legst du etwas unter einem Namen ab. Hier ist es der ganze Datensatz, eine <Begriff id="datenmatrix">Datenmatrix</Begriff>. Im Bild ist er eine Bauplatte: Jede Variable ist ein Turm, jeder Wert ein Stein. Wie die Datenmatrix aussieht, schaust du dir in <a href="#g1">Grundlage 1</a> genauer an.</p>
      <InShort>Mit <code>&lt;-</code> legst du ein Ergebnis unter einem Namen ab. Führst du nur den Namen aus, zeigt R dir das Objekt.</InShort>
      <Mixup>Ohne <code>&lt;-</code> zeigt R das Ergebnis nur an und vergisst es wieder. Mit <code>&lt;-</code> wird es gespeichert, angezeigt wird dann nichts. In RStudio siehst du gespeicherte Objekte rechts oben im <Begriff id="environment">Environment</Begriff>.</Mixup>
    </Card>

    <Card id="r2" stone="R" title="Neu heute: die Pipe mit einem Schritt" badge={<Badge>neu heute</Badge>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">Neu heute ist die <Begriff id="pipe">Pipe</Begriff> <code>%&gt;%</code>. Du sprichst sie „und dann“. Sie nimmt, was links steht, und gibt es an die <Begriff id="funktion">Funktion</Begriff> rechts weiter. So liest du die Zeile vom Input:</p>
      <div className="lesehilfe" role="img" aria-label="frauen, das Objekt, unter dem das Ergebnis abgelegt wird. Pfeil, leg ab unter. allbus, das Objekt: der Datensatz. Pipe, und dann. filter, die Funktion: was passiert. In Klammern sex == 2, das Argument: welche Fälle bleiben.">
        {TOKENS.map(([code, note, bg], i) => <span key={i}><b style={{ background: bg }}>{code}</b><small>{note}</small></span>)}
      </div>
      <p>„Nimm <code>allbus</code>, und dann behalte nur die Fälle, bei denen <code>sex</code> gleich 2 ist. Leg das Ergebnis unter dem Namen <code>frauen</code> ab.“ Welcher Code für FRAU steht, verrät das Codebuch: Bei <code>sex</code> ist 1 MANN, 2 FRAU, 3 DIVERS.</p>
      <p><code>filter()</code> wählt <Begriff id="fall">Fälle</Begriff> aus, also Zeilen mit Befragten. Alle Variablen bleiben erhalten. Die Pipe tippst du mit Strg + Umschalt + M (Mac: Cmd + Umschalt + M).</p>
      <Workshop k="rlesen" live />
      <FilterSex caption={<><code>filter(sex == 2)</code> prüft jeden Fall: Steht bei <code>sex</code> eine 2? Die Zeilen mit MANN und DIVERS werden grau und fallen weg, die FRAU-Zeilen bleiben mit allen ihren Werten. <span>Die Werte sind ein Beispiel mit sechs Befragten; die Fallzahlen stammen aus dem ALLBUS 2023.</span></>} />
      <InShort>Die Pipe <code>%&gt;%</code> gibt das Ergebnis links an die Funktion rechts weiter („und dann“). <code>filter()</code> behält nur die Fälle, für die die Bedingung stimmt.</InShort>
      <MoreDetail summary="== und =, eine Pipe oder mehrere">
        <p><code>==</code> fragt „ist gleich?“ und prüft jeden Fall: Bei <code>sex == 2</code> ist die Antwort für jede Frau ja, für alle anderen nein. Ein einzelnes <code>=</code> stellt dagegen ein <Begriff id="argument">Argument</Begriff> ein (kennst du aus Sitzung 1, etwa <code>path = "…"</code>). Schreibst du <code>filter(sex = 2)</code>, meldet R: „Did you mean <code>sex == 2</code>?“</p>
        <p>Auf der Folie stand die Zeile in einer Zeile: <code>frauen &lt;- allbus %&gt;% filter(sex == 2)</code>. Im Lernpfad steht nach <code>%&gt;%</code> ein Zeilenumbruch und der nächste Schritt eingerückt. Das ist derselbe Code. In Sitzung 4 hängst du so mit mehreren Pipes mehrere Schritte untereinander.</p>
        <p><code>allbus %&gt;% filter(sex == 2)</code> ist dasselbe wie <code>filter(allbus, sex == 2)</code>: Die Pipe setzt den Datensatz als erstes Argument in die Funktion. Mehr dazu im R-Workshop, Abschnitt 4.5.2 „Fälle filtern“.</p>
      </MoreDetail>
      <Mixup><code>filter()</code> und Nachschlagen. <code>filter(sex == 2)</code> braucht den Code, nicht das Wort: <code>filter(sex == "FRAU")</code> ergibt einen Fehler. Den Code findest du im Codebuch.</Mixup>
    </Card>

    <Card id="r3" stone="R" title="Nachschlagen mit codebook()" badge={<><Known session={1} what="Codebuch" /> <Badge>neu heute: einzelne Variablen nachschlagen</Badge></>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">In Sitzung 1 hast du das ganze Codebuch mit <code>codebook(allbus)</code> in RStudio geöffnet und einzelne Variablen mit <code>frequency()</code> ausgezählt. Heute schlägst du einzelne Variablen direkt im <Begriff id="codebuch">Codebuch</Begriff> nach: <code>codebook(allbus, sex)</code>; mehrere trennst du mit Komma: <code>codebook(allbus, sex, ls01)</code>. Das Codebuch zeigt keine Prozente, dafür kurz alles, was du zum Kodieren eines Fragebogens brauchst: Codes, Wertelabels und die fehlenden Werte mit ihrem Grund. In RStudio öffnet sich der Eintrag rechts unten im Viewer als Tabelle. In der Code-Werkstatt erscheint derselbe Eintrag als Text. Die Wörter darin sind englisch:</p>
      <table className="daten voll">
        <caption>Die Wörter im Codebuch</caption>
        <thead><tr><th scope="col">In der Werkstatt</th><th scope="col">Im Viewer (RStudio)</th><th scope="col">heißt</th></tr></thead>
        <tbody>{CODEBOOK_WORDS.map(([w, v, m]) => <tr key={w}><td><code>{w}</code></td><td>{v}</td><td>{m}</td></tr>)}</tbody>
      </table>
      <p>Der Viewer zeigt zusätzlich bei jedem gültigen Code, wie oft er vorkommt (Spalte Freq.). Für diese Sitzung brauchst du das nicht. Wie oft jeder gültige Code vorkommt und wie viele gültig geantwortet haben, zeigt dir <code>frequency()</code> (kennst du aus Sitzung 1); in Sitzung 3 rechnest du damit Prozente.</p>
      <InShort><code>codebook(daten, variable)</code> zeigt Variablenlabel, Codes, Wertelabels und fehlende Werte einer Variable.</InShort>
    </Card>
  </>;
}
