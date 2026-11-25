// Sitzung 3 „Erste Auszählung“ als Kapitel (Spec §5, Variante B): Vorweg R lesen → Thema 1–4 je Grundlage und Aufgabe → Überblick → Mitnehmen.
import { workshopUrl } from '../../domain/curriculum';
import { ChapterLayout, Part, type TocGroup } from '../blocks/ChapterLayout';
import { TopicHeading } from '../blocks/Foundation';
import { TakeAway } from '../blocks/TakeAway';
import { chapterStatus, type ChapterState } from '../state';
import { REQUIRED, SCRIPT, SCRIPT_FILE, SELF_TEST } from './content';
import { Foundation1, Foundation2, Foundation3, Foundation4, Overview } from './Foundations';
import { ReadR } from './ReadR';
import { Task1, Task2, Task3, Task4 } from './Tasks';

/** Status for the session rail: done when every required question of tasks 1 to 3 is right. */
export const session3Status = (state: ChapterState) => chapterStatus(state, REQUIRED);

const TOC: TocGroup[] = [
  { group: 'Vorweg', items: [{ href: '#r1', label: 'R lesen' }, { href: '#r2', label: 'Drei Werkzeuge' }] },
  { group: 'Themen', items: [{ href: '#thema1', label: '1 Häufigkeitstabelle' }, { href: '#thema2', label: '2 Fehlende Werte' }, { href: '#thema3', label: '3 Die Mitte' }, { href: '#thema4', label: '4 Über dem Mittelwert' }] },
  { group: 'Zum Schluss', items: [{ href: '#ueberblick', label: 'Überblick' }, { href: '#mitnehmen', label: 'Das Wichtigste' }, { href: '#selbsttest', label: 'Prüf dich selbst' }, { href: '#skript', label: 'Skript' }] },
];

const TAKE_AWAY = [
  <>Eine Häufigkeitstabelle zeigt für jeden Wert, wie viele (N) und welcher Anteil (Prozent). Cum. % zählt die Valid % von oben nach unten zusammen.</>,
  <>Jede Prozentzahl hat eine Basis. Raw % teilt durch alle Befragten, Valid % durch die gültigen Antworten. Eine eigene Basis rechnest du mit R als Taschenrechner.</>,
  <>Fehlende Werte tragen im ALLBUS einen Code mit Grund: nie gefragt (Split, Filter), nicht beantwortet (keine Angabe, weiß nicht, verweigert) oder beim Erfassen verloren. Fehlend heißt nicht verweigert.</>,
  <>Modus: häufigster Wert. Median: Wert der Person in der Mitte, in der Tabelle die erste Zeile mit Cum. % ab 50. Mittelwert: Summe geteilt durch Anzahl.</>,
  <>Welche Mitte passt, sagt das Skalenniveau: nominal Modus, ordinal Median, metrisch Mittelwert und Median.</>,
  <>Der Mittelwert folgt wenigen extremen Werten, der Median bleibt in der Mitte. Liegen sie weit auseinander, gehören beide in den Bericht.</>,
  <>In R: <code>allbus %&gt;% frequency(x)</code> zählt aus, <code>allbus %&gt;% describe(x)</code> fasst zusammen. R schreibt Kommazahlen mit Punkt.</>,
];

/** The whole session 3 chapter. Expects a `ChapterStateProvider` (sessionId 3) around it; LearningPath keeps the h2 title. */
export function Session3() {
  return <ChapterLayout
    session={3}
    lead="Wie viele sagen was – und wen zählst du mit, wenn du Prozent sagst?"
    route={[
      { href: '#werkzeug', title: 'Vorweg: R lesen', note: 'frequency() mit der Pipe, describe(), R als Taschenrechner' },
      { href: '#thema1', title: 'Vier Themen', note: 'je erst die Grundlage, dann die Aufgabe; im Seminar direkt zur Aufgabe springen' },
      { href: '#ueberblick', title: 'Zum Schluss', note: 'Überblick, Wichtigstes, Selbsttest, Skript' },
    ]}
    goals={[
      'eine Häufigkeitstabelle lesen: wie oft jede Antwort vorkommt (absolute Häufigkeit, Spalte N), welcher Anteil das ist (relative Häufigkeit, Raw % und Valid %) und wie viel bis zu einer Ausprägung zusammenkommt (kumulierte Prozent, Cum. %)',
      <>den häufigsten Wert (Modus) und die Mitte einer geordneten Antwortreihe (Median) aus der Tabelle ablesen, den Mittelwert mit <code>describe()</code></>,
      'eine Prozentzahl so in einen Satz schreiben, dass klar ist, von wem sie handelt: von allen Befragten oder nur von denen, die geantwortet haben',
      'Mittelwert und Median vergleichen und sagen, welche Zahl eine schiefe Verteilung ehrlicher beschreibt',
      'fehlende Werte nach ihrem Grund unterscheiden (nie gefragt, nicht beantwortet, beim Erfassen verloren) und wissen, welche Mitte zu welchem Skalenniveau passt',
      <><code>allbus %&gt;% frequency(…)</code> und <code>allbus %&gt;% describe(…)</code> ausführen, die Ausgabe lesen und R als Taschenrechner für eine eigene Prozentbasis nutzen</>,
    ]}
    known={<>der Startblock, R als Taschenrechner und der erste Blick mit <code>frequency(allbus, …)</code> auf Codes, Wertelabels und die Spalte N (Sitzung 1); die Pipe mit einem Schritt wie <code>frauen &lt;- allbus %&gt;% filter(sex == 2)</code>, das Nachschlagen mit <code>codebook(allbus, …)</code>, die Datenmatrix mit Fällen, Variablen, Werten und Wertelabels (im Bild: Bauplatte, Türme, Steine, Aufkleber), die Gründe für fehlende Werte (−9, −10, −11, −42 …) und dass Codes für Parteien nur Namen sind (Sitzung 2). Mittelwert und Median kennst du aus Methoden Ia.</>}
    knownNote={<>Solche Stellen tragen ein graues Schild „kennst du aus Sitzung …“ oder „kennst du aus Methoden Ia“.</>}
    jumps={[1, 2, 3, 4].map(n => ({ href: `#a${n}`, label: `Aufgabe ${n}` }))}
    toc={TOC}>

    <p className="hilfe-zeile s3-gewichtung">Alle Zahlen in diesem Kapitel sind ungewichtet, genau wie die Ausgabe deiner Vorlagen. Gewichtet ändern sie sich etwas; das ist Thema in Sitzung 6.</p>

    <Part id="werkzeug" tone="yellow" title="Vorweg: R lesen" />
    <ReadR />

    <TopicHeading id="thema1" n={1} title="Thema 1: Die Häufigkeitstabelle" />
    <Foundation1 />
    <Task1 />

    <TopicHeading id="thema2" n={2} title="Thema 2: Fehlende Werte: Wer zählt mit?" />
    <Foundation2 />
    <Task2 />

    <TopicHeading id="thema3" n={3} title="Thema 3: Die Mitte: Modus, Median, Mittelwert" />
    <Foundation3 />
    <Task3 />

    <TopicHeading id="thema4" n={4} title="Thema 4: Liegt der Mittelwert in der Mitte?" />
    <Foundation4 />
    <Task4 />

    <TopicHeading id="ueberblick" n="✓" title="Überblick: Eine Tabelle lesen, eine Mitte wählen" />
    <Overview />

    <TakeAway points={TAKE_AWAY} selfTest={SELF_TEST} script={SCRIPT} scriptName={SCRIPT_FILE}
      more={{ href: workshopUrl, label: 'Nachlesen im R-Workshop, Kapitel 7.4' }} />
  </ChapterLayout>;
}
