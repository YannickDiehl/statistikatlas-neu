// Sitzung 5 „Kreuztabellen“ als Kapitel (Spec §5, Variante B): Vorweg R lesen → Thema 1–4 je Grundlage und Aufgabe → Überblick → Mitnehmen.
import { workshopUrl } from '../../domain/curriculum';
import { ChapterLayout, Part, type TocGroup } from '../blocks/ChapterLayout';
import { TopicHeading } from '../blocks/Foundation';
import { TakeAway } from '../blocks/TakeAway';
import { chapterStatus, type ChapterState } from '../state';
import { withWholeNumbers } from './check';
import { REQUIRED, SCRIPT, SCRIPT_FILE, SELF_TEST } from './content';
import { Foundation1, Foundation2, Foundation3, Foundation4, Overview } from './Foundations';
import { ReadR } from './ReadR';
import { Task1, Task2, Task3, Task4 } from './Tasks';

/**
 * Status for the session rail: done when every required question of tasks 1 to 3 is right.
 * Whole numbers within ±0,55 count as right here as in the feedback (see check.ts).
 */
export const session5Status = (state: ChapterState) => chapterStatus(withWholeNumbers(state, REQUIRED), REQUIRED);

const TOC: TocGroup[] = [
  { group: 'Vorweg', items: [{ href: '#r1', label: 'R lesen' }, { href: '#r2', label: 'Neue Variable' }, { href: '#r3', label: 'Kreuztabelle' }] },
  { group: 'Themen', items: [{ href: '#thema1', label: '1 Umkodieren' }, { href: '#thema2', label: '2 Prozentbasen' }, { href: '#thema3', label: '3 Leserichtung' }, { href: '#thema4', label: '4 Umpolen' }] },
  { group: 'Zum Schluss', items: [{ href: '#ueberblick', label: 'Überblick' }, { href: '#mitnehmen', label: 'Das Wichtigste' }, { href: '#selbsttest', label: 'Prüf dich selbst' }, { href: '#skript', label: 'Skript' }] },
];

const TAKE_AWAY = [
  <><b>Umkodieren</b> fasst Antworten nach festen Regeln zu Gruppen zusammen. Wer in keine Gruppe gehört, wird <b>leer (NA)</b>, nicht 0. Jede Einteilung ist eine Entscheidung, die du nennst.</>,
  <>Eine <b>Dummyvariable</b> hat nur 0 und 1; ihr Mittelwert ist der Anteil der Einsen.</>,
  <>Eine <b>Kreuztabelle</b> zählt die Kombinationen zweier Variablen. Jede Prozentzahl darin hat eine <b>Basis</b>: <b>Zeilenprozente</b> (jede Zeile 100 %), <b>Spaltenprozente</b> (jede Spalte 100 %), <b>Gesamtprozente</b> (alle 100 %).</>,
  <>Dieselbe Zelle beantwortet je nach Basis eine andere Frage: 87,0 % der Nichtwählenden misstrauen, aber nur 6,5 % der Misstrauenden würden nicht wählen.</>,
  <><b>Leserichtung:</b> Jede Gruppe der UV ist 100 %, dann vergleichst du zwischen den Gruppen. Den Abstand nennst du in <b>Prozentpunkten</b>.</>,
  <><b>Umpolen</b> dreht eine Skala um, damit eine höhere Zahl bei allen Fragen dasselbe heißt.</>,
  <>Eine Kreuztabelle zeigt einen Zusammenhang, keine Ursache. Nenne n, wer fehlt und dass ungewichtet gerechnet wurde.</>,
  <>In R: <code>allbus %&gt;% mutate(neu = rec(alt, rules = "…")) %&gt;% frequency(neu)</code> baut eine neue Variable und prüft sie, <code>crosstab(zeilen, spalten, percentages = "row")</code> zeigt die Tabelle, <code>rules = "rev"</code> polt um. In RStudio legst du neue Variablen mit <code>allbus &lt;- allbus %&gt;% mutate(…)</code> einmal ab.</>,
];

/** The whole session 5 chapter. Expects a `ChapterStateProvider` (sessionId 5) around it; LearningPath keeps the h2 title. */
export function Session5() {
  return <ChapterLayout
    session={5}
    lead="Gehen Misstrauende nicht mehr wählen? Und auf wen beziehen sich die Prozent, die man darüber liest?"
    route={[
      { href: '#werkzeug', title: 'Vorweg: R lesen', note: 'neue Variable, Kreuztabelle' },
      { href: '#thema1', title: 'Vier Themen', note: 'je erst die Grundlage, dann die Aufgabe; im Seminar direkt zur Aufgabe springen' },
      { href: '#ueberblick', title: 'Zum Schluss', note: 'Überblick, Wichtigstes, Selbsttest, Skript' },
    ]}
    goals={[
      <><b>Verfahren:</b> aus einer Frage mit vielen Antworten Gruppen bilden (umkodieren), auch eine Dummyvariable mit nur 0 und 1; zwei Variablen in einer Kreuztabelle gegenüberstellen</>,
      <><b>Interpretation:</b> dieselbe Zelle als Zeilen-, Spalten- und Gesamtprozent lesen und sagen, welche Frage jede Zahl beantwortet; Gruppen vergleichen und den Unterschied in Prozentpunkten angeben</>,
      <><b>Voraussetzungen:</b> wissen, wer in der Tabelle fehlt (fehlende Werte, Split), warum kleine Gruppen wackelige Prozent liefern und warum ein Zusammenhang noch keine Ursache ist</>,
      <><b>Code lesen:</b> eine neue Variable mit <code>mutate()</code> und <code>rec()</code> lesen und ihre Regel anpassen; mit <code>crosstab()</code> und <code>percentages =</code> die passende Prozentbasis einstellen; eine Skala mit <code>rules = "rev"</code> umpolen</>,
    ]}
    known={<>der Startblock und <code>&lt;-</code> (Sitzung 1), die Pipe und die Codes der Wahlabsicht <code>pv01</code> (Sitzung 2), <code>frequency()</code> mit Valid % und fehlenden Werten, und dass dieselbe Zahl mit verschiedenen Basen verschiedene Prozent ergibt (Sitzung 3, Wahlabsicht), die Kette aus mehreren Schritten, <code>drop_na()</code>, <code>to_label()</code> und Balken auf 100 % (Sitzung 4). Alle Zahlen sind ungewichtet; wie man gewichtet, lernst du in Sitzung 6.</>}
    knownNote={<>Solche Stellen tragen ein graues Schild „kennst du aus Sitzung …“. Aus der Vorlesung kennst du abhängige und unabhängige Variable (AV und UV) und den Chi-Quadrat-Test; diese Stellen tragen das Schild „Wiederholung aus der Vorlesung“.</>}
    jumps={[1, 2, 3, 4].map(n => ({ href: `#a${n}`, label: `Aufgabe ${n}` }))}
    toc={TOC}>

    <Part id="werkzeug" tone="yellow" title="Vorweg: R lesen" />
    <ReadR />

    <TopicHeading id="thema1" n={1} title="Thema 1: Gruppen bilden: Umkodieren" />
    <Foundation1 />
    <Task1 />

    <TopicHeading id="thema2" n={2} title="Thema 2: Eine Zelle, drei Prozentbasen" />
    <Foundation2 />
    <Task2 />

    <TopicHeading id="thema3" n={3} title="Thema 3: Leserichtung: Gruppen vergleichen" />
    <Foundation3 />
    <Task3 />

    <TopicHeading id="thema4" n={4} title="Thema 4: Umpolen" />
    <Foundation4 />
    <Task4 />

    <TopicHeading id="ueberblick" n="✓" title="Überblick: Welche Prozentbasis für welche Frage?" />
    <Overview />

    <TakeAway points={TAKE_AWAY} selfTest={SELF_TEST} script={SCRIPT} scriptName={SCRIPT_FILE}
      more={{ href: workshopUrl, label: 'Nachlesen im R-Workshop, Kapitel 5 und 7' }} />
  </ChapterLayout>;
}
