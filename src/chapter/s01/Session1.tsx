// Sitzung 1 „Einstieg“ als Kapitel (Spec §5, Variante B): Vorweg R lesen → Thema 1–4 je Grundlage und Aufgabe → Überblick → Mitnehmen.
import { workshopUrl } from '../../domain/curriculum';
import { ChapterLayout, Part, type TocGroup } from '../blocks/ChapterLayout';
import { TopicHeading } from '../blocks/Foundation';
import { TakeAway } from '../blocks/TakeAway';
import { chapterStatus, type ChapterState } from '../state';
import { REQUIRED, SCRIPT, SCRIPT_FILE, SELF_TEST } from './content';
import { Foundation1, Foundation2, Foundation3, Foundation4, Overview } from './Foundations';
import { ReadR } from './ReadR';
import { Task1, Task2, Task3, Task4 } from './Tasks';

/** Status for the session rail: done when every required question of tasks 1, 2 and 3 is right. */
export const session1Status = (state: ChapterState) => chapterStatus(state, REQUIRED);

const TOC: TocGroup[] = [
  { group: 'Vorweg', items: [{ href: '#r1', label: 'R lesen' }, { href: '#r2', label: 'Code-Werkstatt' }] },
  { group: 'Themen', items: [{ href: '#thema1', label: '1 Startklar' }, { href: '#thema2', label: '2 Variablen finden' }, { href: '#thema3', label: '3 Variable lesen' }, { href: '#thema4', label: '4 Fehlermeldungen' }] },
  { group: 'Zum Schluss', items: [{ href: '#ueberblick', label: 'Überblick' }, { href: '#mitnehmen', label: 'Das Wichtigste' }, { href: '#selbsttest', label: 'Prüf dich selbst' }, { href: '#skript', label: 'Skript' }] },
];

const TAKE_AWAY = [
  <><b>R</b> rechnet, <b>RStudio</b> ist das Programm drumherum: Im Skript hebst du Code auf, in der Konsole antwortet R, im Environment siehst du deine Objekte.</>,
  <>Ein <b>Projekt</b> hält alles in einem Ordner. Liegt die Datei dort, genügt <code>read_spss("ZA8831_v1-3-0.sav")</code>; sonst hilft <code>file.choose()</code>.</>,
  <>Pakete <b>einmal installieren</b>, in jeder Sitzung <b>laden</b>: Der Startblock lädt erst tidyverse, dann mariposa, und liest die Datei ein.</>,
  <>Eine Zeile lesen: <b>Objekt</b> <code>&lt;-</code> <b>Funktion</b>(<b>Argumente</b>). Text steht in Anführungszeichen, Namen von Objekten und Variablen nicht.</>,
  <><code>find_var()</code> sucht in Variablennamen und Variablenlabels. Kein Treffer heißt nicht „gibt es nicht“ (ae, oe, ue, Wortanfang, anderes Wort), ein Treffer heißt nicht „passt“ (Label lesen).</>,
  <>Codebuch und <code>frequency()</code> zeigen <b>Codes</b>, <b>Wertelabels</b> und <b>fehlende Werte</b>. Negative Codes sind fehlend; <b>TNZ</b> heißt: Die Frage wurde gar nicht gestellt.</>,
  <><b>Gültige Antworten</b> = alle Befragten minus alle fehlenden Werte. Für deine Aussagen zählen nur sie.</>,
  <>Eine <b>Fehlermeldung</b> ist eine Auskunft: Lies, wo und was, und schau auf den Namen in Anführungszeichen.</>,
];

/** The whole session 1 chapter. Expects a `ChapterStateProvider` (sessionId 1) around it; LearningPath keeps the h2 title. */
export function Session1() {
  return <ChapterLayout
    session={1}
    lead="Wie kommt der ALLBUS in R, und wie findest du darin die Frage, die dich interessiert?"
    route={[
      { href: '#werkzeug', title: 'Vorweg: R lesen', note: 'Eine Zeile lesen, die Code-Werkstatt' },
      { href: '#thema1', title: 'Vier Themen', note: 'je erst die Grundlage, dann die Aufgabe; im Seminar direkt zur Aufgabe springen' },
      { href: '#ueberblick', title: 'Zum Schluss', note: 'Überblick, Wichtigstes, Selbsttest, Skript' },
    ]}
    goals={[
      'in RStudio die vier Fenster unterscheiden: Wo schreibe ich Code, wo antwortet R, wo sehe ich meine Daten?',
      'ein Projekt anlegen und die ALLBUS-Datei so ablegen, dass R sie findet',
      <>den Startblock lesen und ausführen: Pakete laden, die Datei einlesen und unter dem Namen <code>allbus</code> ablegen</>,
      <>eine Zeile R lesen: Objekt, Pfeil <code>&lt;-</code>, Funktion, Argumente, Text in Anführungszeichen</>,
      <>mit <code>find_var()</code> Variablen suchen und erklären, warum „kein Treffer“ nicht „gibt es nicht“ heißt und ein Treffer noch nicht passen muss</>,
      <>mit dem Codebuch (<code>codebook()</code>) und einem ersten Blick in <code>frequency()</code> lesen, was eine Variable misst: Variablenlabel, Codes, Wertelabels, fehlende Werte</>,
      'sagen, wem eine Frage gestellt wurde und wie viele gültig geantwortet haben',
      'eine Fehlermeldung lesen und die häufigsten Fehler selbst beheben',
    ]}
    jumps={[1, 2, 3, 4].map(n => ({ href: `#a${n}`, label: `Aufgabe ${n}` }))}
    known={<>Variable, Fall und Wert aus Methoden Ia; im Sommer hast du 30 Blobs von Hand ausgezählt. R ist neu: Alles, was du hier brauchst, wird Schritt für Schritt eingeführt.</>}
    knownNote="Stellen, die du aus Methoden Ia kennst, tragen ein graues Schild ‚kennst du aus Methoden Ia‘."
    toc={TOC}>


    <Part id="werkzeug" tone="yellow" title="Vorweg: R lesen" />
    <ReadR />

    <TopicHeading id="thema1" n={1} title="Thema 1: Startklar: R, RStudio und deine Datei" />
    <Foundation1 />
    <Task1 />

    <TopicHeading id="thema2" n={2} title="Thema 2: Variablen finden" />
    <Foundation2 />
    <Task2 />

    <TopicHeading id="thema3" n={3} title="Thema 3: Eine Variable lesen" />
    <Foundation3 />
    <Task3 />

    <TopicHeading id="thema4" n={4} title="Thema 4: Wenn R sich beschwert" />
    <Foundation4 />
    <Task4 />

    <TopicHeading id="ueberblick" n="✓" title="Überblick: Welches Werkzeug für welche Frage?" />
    <Overview />

    <TakeAway points={TAKE_AWAY} selfTest={SELF_TEST} script={SCRIPT} scriptName={SCRIPT_FILE}
      more={{ href: workshopUrl, label: 'Nachlesen im R-Workshop, Kapitel 1 und Abschnitt 4.4' }} />
  </ChapterLayout>;
}
