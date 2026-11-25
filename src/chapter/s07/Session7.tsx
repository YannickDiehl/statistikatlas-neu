// Sitzung 7 „Mittelwerte vergleichen“ als Kapitel (Spec §5, Variante B): Vorweg R lesen → Thema 1–4 je Grundlage und Aufgabe → Überblick → Mitnehmen.
import { workshopUrl } from '../../domain/curriculum';
import { ChapterLayout, Part, type TocGroup } from '../blocks/ChapterLayout';
import { TopicHeading } from '../blocks/Foundation';
import { TakeAway } from '../blocks/TakeAway';
import { chapterStatus, type ChapterState } from '../state';
import { REQUIRED, SCRIPT, SCRIPT_FILE, SELF_TEST } from './content';
import { Foundation1, Foundation2, Foundation3, Foundation4, Overview } from './Foundations';
import { ReadR } from './ReadR';
import { Task1, Task2, Task3, Task4 } from './Tasks';

/** Status for the session rail: done when every required question of tasks 1 and 3 is right. */
export const session7Status = (state: ChapterState) => chapterStatus(state, REQUIRED);

const TOC: TocGroup[] = [
  { group: 'Vorweg', items: [{ href: '#r1', label: 'R lesen' }, { href: '#r2', label: 'Ein t-Test in R' }] },
  { group: 'Themen', items: [{ href: '#thema1', label: '1 t-Test' }, { href: '#thema2', label: '2 Voraussetzungen' }, { href: '#thema3', label: '3 ANOVA und Tukey' }, { href: '#thema4', label: '4 Korrelationsmatrix' }] },
  { group: 'Zum Schluss', items: [{ href: '#ueberblick', label: 'Überblick' }, { href: '#mitnehmen', label: 'Das Wichtigste' }, { href: '#selbsttest', label: 'Prüf dich selbst' }, { href: '#skript', label: 'Skript' }] },
];

const TAKE_AWAY = [
  <>Mittelwerte schwanken von Stichprobe zu Stichprobe. Wie stark, sagt der <b>Standardfehler</b>; er wird mit mehr Befragten kleiner.</>,
  <>Der <b>t-Wert</b> ist Unterschied ÷ Standardfehler, im Bild: Signal durch Rauschen. Der <b>p-Wert</b> sagt, wie oft ein mindestens so großer Unterschied ohne echten Unterschied vorkäme; unter 0,05 heißt <b>signifikant</b>.</>,
  <>Das <b>95-%-Konfidenzintervall</b> zeigt, wo der wahre Unterschied plausibel liegt. Enthält es die 0, ist der Unterschied nicht signifikant, aber auch nicht als „gleich“ bewiesen.</>,
  <>Signifikant heißt nicht groß: Die <b>Effektstärke</b> (Hedges&apos; g, η²) sagt, wie groß ein Unterschied ist.</>,
  <>Zwei Gruppen: <b>t-Test</b>, Welch-Zeile lesen. Drei oder mehr: <b>ANOVA</b>, danach <b>Tukey</b>, weil sich bei vielen einzelnen Tests die Fehler 1. Art häufen.</>,
  <>Voraussetzungen: metrische Variable, unabhängige Gruppen, genug Befragte je Gruppe, ähnliche Streuung (sonst Welch). Für Deutschland gewichten.</>,
  <>In R: <code>t_test(y, group = g, weights = wghtpew)</code>, <code>oneway_anova(y, group = g, weights = wghtpew) %&gt;% tukey_test()</code>, <code>pearson_cor(a, b, c, weights = wghtpew)</code>; <code>summary()</code> am Ende zeigt die ganze Tabelle.</>,
];

/** The whole session 7 chapter. Expects a `ChapterStateProvider` (sessionId 7) around it; LearningPath keeps the h2 title. */
export function Session7() {
  return <ChapterLayout
    session={7}
    lead="Unterscheiden sich Gruppen im Mittel – und ist das mehr als Zufall?"
    route={[
      { href: '#werkzeug', title: 'Vorweg: R lesen', note: 'Ein Test in R, Ausgabe lesen' },
      { href: '#thema1', title: 'Vier Themen', note: 'je erst die Grundlage, dann die Aufgabe; im Seminar direkt zur Aufgabe springen' },
      { href: '#ueberblick', title: 'Zum Schluss', note: 'Überblick, Wichtigstes, Selbsttest, Skript' },
    ]}
    goals={[
      <><b>Verfahren:</b> erklären, wie ein t-Test einen Unterschied (Signal) gegen den Zufall (Rauschen) abwägt, und warum man bei mehr als zwei Gruppen eine Varianzanalyse (ANOVA) mit anschließendem Tukey-Test rechnet</>,
      <><b>Interpretation:</b> p-Wert und Konfidenzintervall in eigenen Worten erklären; die Größe eines Unterschieds mit einer Effektstärke (Hedges&apos; g, η²) einordnen; wissen, dass „signifikant“ nicht „groß“ und „nicht signifikant“ nicht „gleich“ heißt</>,
      <><b>Voraussetzungen:</b> prüfen, ob ein Mittelwertvergleich passt: metrische Variable, unabhängige Gruppen, genug Befragte je Gruppe, ähnliche Streuung (sonst Welch); für Aussagen über Deutschland gewichten</>,
      <><b>Code lesen:</b> <code>t_test()</code>, <code>oneway_anova()</code> und <code>tukey_test()</code> mit <code>weights = wghtpew</code> lesen und anpassen, mit <code>summary()</code> die ganze Tabelle holen und die Ausgabe Zeile für Zeile lesen; mit <code>pearson_cor()</code> viele Paare auf einmal rechnen (Korrelationsmatrix)</>,
    ]}
    known={<>der Startblock (Sitzung 1), Ketten mit <code>%&gt;%</code> (Sitzung 4), Mittelwert und Standardabweichung (Sitzung 3), <code>mutate()</code> mit <code>rec()</code> (Sitzung 5), das Gewicht <code>weights = wghtpew</code> und Pearsons r (Sitzung 6).</>}
    jumps={[['1', 'Pflicht'], ['2', 'Zusatz'], ['3', 'Pflicht'], ['4', 'Zusatz']].map(([n, kind]) => ({ href: `#a${n}`, label: `Aufgabe ${n} (${kind})` }))}
    toc={TOC}>

    <Part id="werkzeug" tone="yellow" title="Vorweg: R lesen" />
    <ReadR />

    <TopicHeading id="thema1" n={1} title="Thema 1: Zufall oder Unterschied? Der t-Test" />
    <Foundation1 />
    <Task1 />

    <TopicHeading id="thema2" n={2} title="Thema 2: Signifikant, groß oder beides? Voraussetzungen" />
    <Foundation2 />
    <Task2 />

    <TopicHeading id="thema3" n={3} title="Thema 3: Mehr als zwei Gruppen: ANOVA und Tukey" />
    <Foundation3 />
    <Task3 />

    <TopicHeading id="thema4" n={4} title="Thema 4: Viele Paare auf einen Blick: die Korrelationsmatrix" />
    <Foundation4 />
    <Task4 />

    <TopicHeading id="ueberblick" n="✓" title="Überblick: Welcher Vergleich für welche Frage?" />
    <Overview />

    <TakeAway points={TAKE_AWAY} selfTest={SELF_TEST} script={SCRIPT} scriptName={SCRIPT_FILE}
      more={{ href: workshopUrl, label: 'Nachlesen im R-Workshop, Kapitel 7.6 Mittelwertvergleiche' }} />
  </ChapterLayout>;
}
