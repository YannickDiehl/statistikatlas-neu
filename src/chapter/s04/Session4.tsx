// Sitzung 4 „Daten sehen“ als Kapitel (Spec §5, Variante B): Vorweg R lesen → Thema 1–4 je Grundlage und Aufgabe → Überblick → Mitnehmen.
import { workshopUrl } from '../../domain/curriculum';
import { ChapterLayout, Part, type TocGroup } from '../blocks/ChapterLayout';
import { TopicHeading } from '../blocks/Foundation';
import { TakeAway } from '../blocks/TakeAway';
import { chapterStatus, type ChapterState } from '../state';
import { REQUIRED, SCRIPT, SCRIPT_FILE, SELF_TEST } from './content';
import { Foundation1, Foundation2, Foundation3, Foundation4, Overview } from './Foundations';
import { ReadR } from './ReadR';
import { Task1, Task2, Task3, Task4 } from './Tasks';

/** Status for the session rail: done when every required question of tasks 1 and 4 is right. */
export const session4Status = (state: ChapterState) => chapterStatus(state, REQUIRED);

const TOC: TocGroup[] = [
  { group: 'Vorweg', items: [{ href: '#r1', label: 'R lesen' }, { href: '#r2', label: 'Schichten' }] },
  { group: 'Themen', items: [{ href: '#thema1', label: '1 Balken' }, { href: '#thema2', label: '2 Formen' }, { href: '#thema3', label: '3 Histogramm' }, { href: '#thema4', label: '4 Boxplot' }] },
  { group: 'Zum Schluss', items: [{ href: '#ueberblick', label: 'Überblick' }, { href: '#mitnehmen', label: 'Das Wichtigste' }, { href: '#selbsttest', label: 'Prüf dich selbst' }, { href: '#skript', label: 'Skript' }] },
];

const TAKE_AWAY = [
  <>Eine <b>Verteilung</b> zeigt, wie viele Menschen welchen Wert angegeben haben. Eine Kennzahl allein verschweigt ihre Form.</>,
  <>Formen: <b>symmetrisch</b>, <b>linksschief</b> (läuft links aus), <b>rechtsschief</b> (läuft rechts aus), <b>mehrgipflig</b> (gespalten).</>,
  <>Der <b>Median</b> bleibt in der Mitte, der <b>Mittelwert</b> wird von Ausreißern und vom Auslauf gezogen.</>,
  <>Wenige Stufen: <b>Balken</b>. Viele Werte: <b>Histogramm</b>. Viele Werte nach Gruppen: <b>Boxplots</b>. Zwei Variablen mit wenigen Stufen: <b>Balken auf 100 %</b>. Zwei mit vielen Werten: <b>Punkte</b>.</>,
  <>Balken beginnen bei 0. Jede Grafik nennt Quelle, n und ob gewichtet wurde.</>,
  <>Filtern und Weglassen ändern das Ergebnis. Hineinzoomen mit <code>coord_cartesian()</code> ändert nur den Ausschnitt, <code>filter()</code> ändert, wer mitgerechnet wird. Sag immer, wer im Bild fehlt (Aufgabe 4).</>,
  <>In R: Daten mit <code>%&gt;%</code> weiterreichen, ab <code>ggplot()</code> Schichten mit <code>+</code>; <code>drop_na()</code> lässt fehlende Werte ausdrücklich weg.</>,
];

/** The whole session 4 chapter. Expects a `ChapterStateProvider` (sessionId 4) around it; LearningPath keeps the h2 title. */
export function Session4() {
  return <ChapterLayout
    session={4}
    lead="Welche Formen können Antworten haben – und wie zeigst du sie, ohne dass die Grafik mehr verspricht als die Daten?"
    route={[
      { href: '#werkzeug', title: 'Vorweg: R lesen', note: 'Startblock, Kette, Schichten' },
      { href: '#thema1', title: 'Vier Themen', note: 'je erst die Grundlage, dann die Aufgabe; im Seminar direkt zur Aufgabe springen' },
      { href: '#ueberblick', title: 'Zum Schluss', note: 'Überblick, Wichtigstes, Selbsttest, Skript' },
    ]}
    goals={[
      'eine Verteilung lesen: Wo liegt der Gipfel, wie breit ist sie, läuft sie zu einer Seite aus?',
      'typische Formen erkennen: symmetrisch, linksschief, rechtsschief, mehrgipflig',
      'Mittelwert, Median und Boxplot im Bild verstehen und wissen, wann der Mittelwert in die Irre führt',
      'zur Frage die passende Grafik wählen: Balken, Histogramm, Boxplots, Balken auf 100 %, Punkte',
      'erkennen, wann eine Grafik mehr verspricht als die Daten',
      <>eine Kette in R lesen und anpassen: mit <code>%&gt;%</code> Daten weiterreichen, mit <code>to_label()</code> Codes in Wörter übersetzen, ab <code>ggplot()</code> mit <code>+</code> Schichten auflegen, mit <code>drop_na()</code> fehlende Werte ausdrücklich weglassen</>,
      'erklären, warum Hineinzoomen und Abschneiden zu verschiedenen Ergebnissen führen',
    ]}
    known={<>der Startblock (Sitzung 1), die Pipe mit einem Schritt wie <code>allbus %&gt;% filter(mode == 4)</code> (Sitzung 2), <code>frequency()</code>, <code>describe()</code>, Median und fehlende Werte (Sitzung 3).</>}
    jumps={[1, 2, 3, 4].map(n => ({ href: `#a${n}`, label: `Aufgabe ${n}` }))}
    toc={TOC}>

    <Part id="werkzeug" tone="yellow" title="Vorweg: R lesen" />
    <ReadR />

    <TopicHeading id="thema1" n={1} title="Thema 1: Balken und Häufigkeiten" />
    <Foundation1 />
    <Task1 />

    <TopicHeading id="thema2" n={2} title="Thema 2: Formen von Verteilungen" />
    <Foundation2 />
    <Task2 />

    <TopicHeading id="thema3" n={3} title="Thema 3: Viele Werte: das Histogramm" />
    <Foundation3 />
    <Task3 />

    <TopicHeading id="thema4" n={4} title="Thema 4: Mitte, Streuung und Boxplot" />
    <Foundation4 />
    <Task4 />

    <TopicHeading id="ueberblick" n="✓" title="Überblick: Welches Bild für welche Frage?" />
    <Overview />

    <TakeAway points={TAKE_AWAY} selfTest={SELF_TEST} script={SCRIPT} scriptName={SCRIPT_FILE}
      more={{ href: workshopUrl, label: 'Nachlesen im R-Workshop, Kapitel 6' }} />
  </ChapterLayout>;
}
