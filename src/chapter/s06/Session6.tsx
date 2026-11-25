// Sitzung 6 „Gewichtung und Zusammenhang“ als Kapitel (Spec §5, Variante B): Vorweg R lesen → Thema 1–4 je Grundlage und Aufgabe → Überblick → Mitnehmen.
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
export const session6Status = (state: ChapterState) => chapterStatus(state, REQUIRED);

const TOC: TocGroup[] = [
  { group: 'Vorweg', items: [{ href: '#r1', label: 'Gewicht als Argument' }, { href: '#r2', label: 'Ein Zusammenhangsmaß' }] },
  { group: 'Themen', items: [{ href: '#thema1', label: '1 Gewichtung' }, { href: '#thema2', label: '2 Kategorien' }, { href: '#thema3', label: '3 Geordnete Kategorien' }, { href: '#thema4', label: '4 Zahlen mit Abständen' }] },
  { group: 'Zum Schluss', items: [{ href: '#ueberblick', label: 'Überblick' }, { href: '#mitnehmen', label: 'Das Wichtigste' }, { href: '#selbsttest', label: 'Prüf dich selbst' }, { href: '#skript', label: 'Skript' }] },
];

const TAKE_AWAY = [
  <>Der ALLBUS befragt den Osten absichtlich stärker (32 statt 17 von 100). Für Aussagen über ganz Deutschland rechnest du gewichtet mit <code>weights = wghtpew</code>; das Gewicht ist Anteil in Deutschland geteilt durch Anteil in der Stichprobe.</>,
  <>Gewichtung verschiebt Gesamtzahlen, wenn sich West und Ost unterscheiden (Zufriedene: 70,7 % ohne, 73,6 % mit Gewicht); innerhalb eines Landesteils ändert sie fast nichts.</>,
  <>Zusammenhang heißt: Die Verteilung des einen Merkmals ist in den Gruppen des anderen verschieden. <b>χ²</b> misst den Abstand von „kein Zusammenhang“, <b>Phi</b> und <b>Cramér-V</b> machen daraus eine Zahl von 0 bis 1 (zeigt <code>phi()</code> ein Minus, zählt für die Stärke der Betrag).</>,
  <>Haben beide Merkmale eine Reihenfolge, vergleichen <b>Gamma</b> und <b>Tau-b</b> Paare: konkordant (gleichläufig) gegen diskordant (gegenläufig). Gamma lässt Bindungen (Gleichstände) weg und fällt größer aus.</>,
  <>Der <b>Betrag</b> zeigt die Stärke (Faustregel: ab 0,1 schwach, ab 0,3 mittel, ab 0,5 stark), das <b>Vorzeichen</b> die Richtung; was „höher“ heißt, steht im Codebuch.</>,
  <><b>Pearson-r</b> misst lineare Zusammenhänge metrischer Variablen und ist empfindlich für Ausreißer; <b>Spearman-ρ</b> nutzt Ränge.</>,
  <>Ein Zusammenhang ist keine Ursache: Eine <b>Drittvariable</b> kann beide Merkmale beeinflussen. Prüfen kannst du das innerhalb ihrer Kategorien.</>,
  <>In R: Datensatz vorn, dann das Maß mit zwei Variablen: <code>allbus %&gt;% kendall_tau(x, y, weights = wghtpew)</code>.</>,
];

/** The whole session 6 chapter. Expects a `ChapterStateProvider` (sessionId 6) around it; LearningPath keeps the h2 title. */
export function Session6() {
  return <ChapterLayout
    session={6}
    lead="Was hängt mit der Zufriedenheit mit der Demokratie zusammen – und wie misst man, wie stark?"
    route={[
      { href: '#werkzeug', title: 'Vorweg: R lesen', note: 'Gewicht als Argument, Maße mit zwei Variablen' },
      { href: '#thema1', title: 'Vier Themen', note: 'je erst die Grundlage, dann die Aufgabe; im Seminar direkt zur Aufgabe springen' },
      { href: '#ueberblick', title: 'Zum Schluss', note: 'Überblick, Wichtigstes, Selbsttest, Skript' },
    ]}
    goals={[
      <><i>Verfahren:</i> erklären, warum der ALLBUS den Osten stärker befragt und wie das Gewicht <code>wghtpew</code> das ausgleicht; zu zwei Variablen das passende Zusammenhangsmaß wählen: Cramér-V und Phi (nominal), Gamma und Tau-b (ordinal), Spearman-ρ und Pearson-r (metrisch).</>,
      <><i>Interpretation:</i> Stärke am Betrag und Richtung am Vorzeichen ablesen und in einem Satz „Je …, desto …“ sagen; die Stärke mit einer Faustregel einordnen.</>,
      <><i>Voraussetzungen:</i> wissen, welches Skalenniveau ein Maß braucht, warum Gamma größer ausfällt als Tau-b, warum Pearson-r Ausreißer und Kurven schlecht verträgt und wie man mit einer Drittvariable prüft, ob ein Zusammenhang von etwas Drittem herrührt (dass ein Zusammenhang keine Ursache ist, kennst du aus Sitzung 5).</>,
      <><i>Code lesen:</i> <code>weights = wghtpew</code> in eine Funktion setzen; <code>cramers_v()</code>, <code>phi()</code>, <code>goodman_gamma()</code>, <code>kendall_tau()</code>, <code>spearman_rho()</code> und <code>pearson_cor()</code> mit zwei Variablen aufrufen und ihre Ausgabe lesen.</>,
    ]}
    known={<>der Startblock (Sitzung 1), <code>filter(eastwest == 2)</code> (Sitzung 2), <code>frequency()</code> mit Valid % und Cum. % und fehlenden Werten (Sitzung 3), Ketten mit <code>%&gt;%</code>, <code>drop_na()</code>, <code>ggplot()</code> und die Skalenniveaus nominal, ordinal, metrisch (Sitzung 4), <code>mutate()</code> mit <code>rec()</code> samt <code>rules = "rev"</code> (dort am Beispiel der Wirtschaftslage <code>ep01</code>), <code>crosstab()</code> mit Zeilenprozenten, „ein Zusammenhang ist keine Ursache“ und der Chi-Quadrat-Test als Wiederholung aus der Vorlesung (Sitzung 5).</>}
    jumps={[1, 2, 3, 4].map(n => ({ href: `#a${n}`, label: `Aufgabe ${n}` }))}
    howToExtra={[<><b>Neu in dieser Sitzung:</b> Ab heute rechnen alle Vorlagen gewichtet, wenn es um Aussagen über ganz Deutschland geht. Warum, zeigt Thema 1.</>]}
    toc={TOC}>

    <Part id="werkzeug" tone="yellow" title="Vorweg: R lesen" />
    <ReadR />

    <TopicHeading id="thema1" n={1} title="Thema 1: Gewichtung" />
    <Foundation1 />
    <Task1 />

    <TopicHeading id="thema2" n={2} title="Thema 2: Kategorien ohne Reihenfolge: χ², Phi und Cramér-V" />
    <Foundation2 />
    <Task2 />

    <TopicHeading id="thema3" n={3} title="Thema 3: Geordnete Kategorien: Gamma und Tau-b" />
    <Foundation3 />
    <Task3 />

    <TopicHeading id="thema4" n={4} title="Thema 4: Zahlen mit Abständen: Pearson und Spearman, und die Drittvariable" />
    <Foundation4 />
    <Task4 />

    <TopicHeading id="ueberblick" n="✓" title="Überblick: Welches Maß für welche Variablen?" />
    <Overview />

    <TakeAway points={TAKE_AWAY} selfTest={SELF_TEST} script={SCRIPT} scriptName={SCRIPT_FILE}
      more={{ href: workshopUrl, label: 'Nachlesen im R-Workshop, Kapitel 7 (Gewichtung, Zusammenhangsmaße)' }} />
  </ChapterLayout>;
}
