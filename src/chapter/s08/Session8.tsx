// Sitzung 8 „Index und Skala“ als Kapitel (Spec §5, Variante B): Vorweg R lesen → Thema 1–4 je Grundlage und Aufgabe → Überblick → Mitnehmen.
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
export const session8Status = (state: ChapterState) => chapterStatus(state, REQUIRED);

const TOC: TocGroup[] = [
  { group: 'Vorweg', items: [{ href: '#r1', label: 'R lesen' }, { href: '#r2', label: 'Ein Wert je Person' }] },
  { group: 'Themen', items: [{ href: '#thema1', label: '1 Mittelwertindex' }, { href: '#thema2', label: '2 Cronbachs α' }, { href: '#thema3', label: '3 Umpolen' }, { href: '#thema4', label: '4 Kombinationsindex' }] },
  { group: 'Zum Schluss', items: [{ href: '#ueberblick', label: 'Überblick' }, { href: '#mitnehmen', label: 'Das Wichtigste' }, { href: '#selbsttest', label: 'Prüf dich selbst' }, { href: '#skript', label: 'Skript' }] },
];

const TAKE_AWAY = [
  <>Einstellungen misst man mit mehreren <b>Items</b>. Ein <b>Index</b> fasst sie zu einem Wert je Person zusammen; im Mittelwert gleichen sich zufällige Messfehler teilweise aus.</>,
  <>Ein <b>Mittelwertindex</b> ist der Mittelwert der gültigen Antworten einer Person. <code>min_valid</code> legt fest, wie viele Antworten mindestens nötig sind.</>,
  <>Vorher müssen alle Items in dieselbe Richtung zeigen. Andersherum gefragte Items polst du mit <code>rec(x, rules = "rev")</code> um. Eine negative Trennschärfe oder ein negatives α zeigen ein falsch gepoltes Item.</>,
  <><b>Cronbachs α</b> misst, wie stimmig die Items zusammen sind (Reliabilität). Faustregel: ab 0,7 annehmbar, ab 0,8 gut. α steigt aber auch mit der Zahl der Items und sagt nichts über die Validität.</>,
  <>Die <b>Trennschärfe</b> zeigt, wie gut ein Item zu den anderen passt; „Alpha if Deleted“, wie hoch α ohne das Item wäre. Ob ein Item bleibt, entscheidet der Inhalt.</>,
  <>Ein <b>Kombinationsindex</b> verbindet Antworten nach einer festen Regel und lässt keinen Ausgleich zu, etwa „allen zugestimmt“ oder der Inglehart-Index.</>,
  <>Einen Index deutest du immer mit seiner Richtung: Wofür steht eine hohe Zahl?</>,
  <>In R: <code>mutate(index = row_means(pick(…), min_valid = …))</code>, <code>reliability(…) %&gt;% summary()</code>, <code>rec(…, rules = "rev")</code>, zum Zählen <code>row_sums()</code>.</>,
];

/** Hint under the jump bar: what is weighted today and what is not. */
function WeightNote() {
  return <p className="hilfe-zeile s8-gewicht">Wie seit Sitzung 6 rechnest du Aussagen über alle Menschen in Deutschland gewichtet: Mittelwerte und Anteile eines Index mit <code>weights = wghtpew</code>. Zwei Dinge rechnest du heute ohne Gewicht: wie stimmig die Fragen sind (Cronbachs α) und wie viele Befragte einen Indexwert bekommen. Beides beschreibt das Messinstrument und die Befragung selbst, nicht die Bevölkerung. Gewichtet ändert sich α kaum (Populismus: 0,829 statt 0,833).</p>;
}

/** The whole session 8 chapter. Expects a `ChapterStateProvider` (sessionId 8) around it; LearningPath keeps the h2 title. */
export function Session8() {
  return <ChapterLayout
    session={8}
    lead="Wie misst man Populismus mit mehreren Fragen – und woran erkennst du, ob die Fragen zusammenpassen?"
    route={[
      { href: '#werkzeug', title: 'Vorweg: R lesen', note: 'Umpolen erinnert, ein Wert je Person, Reliabilität prüfen' },
      { href: '#thema1', title: 'Vier Themen', note: 'je erst die Grundlage, dann die Aufgabe; im Seminar direkt zur Aufgabe springen' },
      { href: '#ueberblick', title: 'Zum Schluss', note: 'Überblick, Wichtigstes, Selbsttest, Skript' },
    ]}
    goals={[
      <>aus mehreren Fragen (Items) einen <b>Mittelwertindex</b> bilden: einen Wert je Person, und erklären, warum mehrere Fragen genauer messen als eine</>,
      <>andersherum gefragte Items vor dem Zusammenfassen <b>umpolen</b>, damit eine hohe Zahl bei allen Items dasselbe bedeutet</>,
      <><b>Cronbachs α</b> und die <b>Trennschärfe</b> eines Items lesen und mit den Faustregeln deuten, und sagen, wo diese Faustregeln an Grenzen stoßen</>,
      'einen Indexwert in Worten deuten: was eine hohe oder niedrige Zahl heißt und für wen es überhaupt einen Wert gibt',
      <>die Voraussetzungen eines Mittelwertindex prüfen (gleiche Richtung, ein gemeinsamer Begriff, genug Antworten je Person) und erklären, warum ein hohes α noch nicht heißt, dass die Fragen das Richtige messen; wissen, wann ein <b>Kombinationsindex</b> besser passt</>,
      <>Code lesen und anpassen: <code>row_means(pick(…), min_valid = …)</code> in <code>mutate()</code>, <code>reliability()</code> mit <code>summary()</code>, <code>rec(…, rules = "rev")</code></>,
    ]}
    known={<>der Startblock (Sitzung 1), <code>frequency()</code> und <code>describe()</code> (Sitzung 3), Ketten mit <code>%&gt;%</code> (Sitzung 4), neue Variablen mit <code>mutate()</code> und <code>rec()</code>, auch das Umpolen mit <code>rules = "rev"</code> (Sitzung 5), <code>weights = wghtpew</code> und die Korrelation r (Sitzung 6), <code>summary()</code> und die Korrelationsmatrix (Sitzung 7).</>}
    knownNote="Messfehler, Reliabilität und Validität kennst du aus der Vorlesung (Schild „Wiederholung aus der Vorlesung“)."
    jumps={[1, 2, 3, 4].map(n => ({ href: `#a${n}`, label: `Aufgabe ${n}` }))}
    toc={TOC}>

    <WeightNote />

    <Part id="werkzeug" tone="yellow" title="Vorweg: R lesen" />
    <ReadR />

    <TopicHeading id="thema1" n={1} title="Thema 1: Mehrere Fragen, ein Wert: der Mittelwertindex" />
    <Foundation1 />
    <Task1 />

    <TopicHeading id="thema2" n={2} title="Thema 2: Passen die Fragen zusammen? Cronbachs α" />
    <Foundation2 />
    <Task2 />

    <TopicHeading id="thema3" n={3} title="Thema 3: Alle in eine Richtung: Umpolen" />
    <Foundation3 />
    <Task3 />

    <TopicHeading id="thema4" n={4} title="Thema 4: Ausgleichen oder alle? Mittelwert- und Kombinationsindex" />
    <Foundation4 />
    <Task4 />

    <TopicHeading id="ueberblick" n="✓" title="Überblick: Vom Item zum Index" />
    <Overview />

    <TakeAway points={TAKE_AWAY} selfTest={SELF_TEST} script={SCRIPT} scriptName={SCRIPT_FILE}
      more={{ href: workshopUrl, label: 'Nachlesen im R-Workshop, Kapitel 5 und 8' }} />
  </ChapterLayout>;
}
