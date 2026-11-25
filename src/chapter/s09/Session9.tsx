// Sitzung 9 „Lineare Regression“ als Kapitel (Spec §5, Variante B): Vorweg R lesen → Thema 1–4 je Grundlage und Aufgabe → Überblick → Mitnehmen.
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
export const session9Status = (state: ChapterState) => chapterStatus(state, REQUIRED);

const TOC: TocGroup[] = [
  { group: 'Vorweg', items: [{ href: '#r1', label: 'Startblock' }, { href: '#r2', label: 'Formel mit Tilde' }, { href: '#r3', label: 'Ausgabe lesen' }] },
  { group: 'Themen', items: [{ href: '#thema1', label: '1 Die Gerade' }, { href: '#thema2', label: '2 Residuen und R²' }, { href: '#thema3', label: '3 Gleich gut für alle?' }, { href: '#thema4', label: '4 Gerade oder Kurve?' }] },
  { group: 'Zum Schluss', items: [{ href: '#ueberblick', label: 'Überblick' }, { href: '#mitnehmen', label: 'Das Wichtigste' }, { href: '#selbsttest', label: 'Prüf dich selbst' }, { href: '#skript', label: 'Skript' }] },
];

const TAKE_AWAY = [
  <>Eine <b>lineare Regression</b> legt die Gerade durch eine Punktwolke, bei der die Summe der quadrierten Residuen am kleinsten ist (kleinste Quadrate).</>,
  <>Vorhersage = Konstante + Steigung × Wert der UV. Die <b>Steigung B</b> sagt, um wie viel die Vorhersage pro Einheit der UV steigt, in der Einheit der AV. Die <b>Konstante</b> ist die Höhe bei UV = 0.</>,
  <>Ein <b>Residuum</b> ist beobachtet minus vorhergesagt: wie weit eine Person über oder unter der Geraden liegt.</>,
  <><b>R²</b> sagt, um welchen Anteil die Fehlerquadrate mit der Geraden kleiner sind als mit dem Mittelwert. Mit einer UV ist R² = r². Steil heißt nicht gut: Steigung und R² getrennt lesen.</>,
  <>Voraussetzungen: ein gerader Zusammenhang (<b>Linearität</b>), keine einzelnen Punkte, die die Gerade ziehen (<b>Ausreißer</b>), gleich große Streuung der Residuen für alle (<b>gleiche Fehlervarianz</b>; Levene-Test für „gibt es einen Unterschied?“, Faustregel „mehr als doppelt“ für „ist er groß?“).</>,
  <>Eine Regression beschreibt einen Zusammenhang, keine Ursache.</>,
  <>In R: <code>allbus %&gt;% linear_regression(y ~ x, weights = wghtpew) %&gt;% summary()</code>; <code>group_by()</code> rechnet danach für jede Gruppe getrennt; <code>levene_test(residuum, group = x, weights = wghtpew)</code> prüft gleiche Streuung.</>,
];

/** The whole session 9 chapter. Expects a `ChapterStateProvider` (sessionId 9) around it; LearningPath keeps the h2 title. */
export function Session9() {
  return <ChapterLayout
    session={9}
    lead="Wie gut sagt eine Gerade etwas vorher – und für wen liegt sie daneben?"
    route={[
      { href: '#werkzeug', title: 'Vorweg: R lesen', note: 'die Formel mit ~, die Ausgabe von summary()' },
      { href: '#thema1', title: 'Vier Themen', note: 'je erst die Grundlage, dann die Aufgabe; im Seminar direkt zur Aufgabe springen' },
      { href: '#ueberblick', title: 'Zum Schluss', note: 'Überblick, Wichtigstes, Selbsttest, Skript' },
    ]}
    goals={[
      'erklären, was eine lineare Regression tut: Sie legt die Gerade durch ein Streudiagramm, die im Mittel am nächsten an den Punkten liegt (kleinste Quadrate)',
      'Konstante und Steigung (Regressionskoeffizient B) in einfachen Worten deuten und damit eine Vorhersage von Hand ausrechnen',
      'Residuen als „wie weit daneben“ lesen und R² als „um wie viel besser als der Mittelwert“ deuten; sagen, warum eine steile Gerade nicht dasselbe ist wie eine gute Vorhersage',
      'drei Voraussetzungen prüfen und in Worten erklären: ein gerader Zusammenhang (Linearität), keine einzelnen Punkte, die die Gerade wegziehen (Ausreißer), gleich große Fehler für alle (gleiche Fehlervarianz)',
      'wissen, dass eine Regression einen Zusammenhang beschreibt und keine Ursache belegt',
      <><code>linear_regression(y ~ x, weights = wghtpew)</code> lesen und anpassen, in der Ausgabe von <code>summary()</code> B, Beta, R² und N finden, mit <code>group_by()</code> getrennt nach Gruppen rechnen und <code>levene_test()</code> lesen</>,
    ]}
    known={<>R als Taschenrechner und TNZ: SPLIT (Sitzung 1); <code>describe()</code> (Sitzung 3); Ketten mit <code>%&gt;%</code>, <code>drop_na()</code>, <code>show = …</code> und Ausreißer im Boxplot (Sitzung 4); abhängige und unabhängige Variable (AV und UV), das Umpolen mit <code>rec(…, rules = "rev")</code> in <code>mutate()</code> und „ein Zusammenhang ist keine Ursache“ (Sitzung 5); das Gewicht <code>weights = wghtpew</code>, die Punktwolke, die Pearson-Korrelation r und dass r nur gerade Zusammenhänge sieht (Sitzung 6); <code>summary()</code> für die ausführliche Ausgabe, der p-Wert und die Faustregel, ob Gruppen ähnlich stark streuen (Sitzung 7).</>}
    jumps={[1, 2, 3, 4].map(n => ({ href: `#a${n}`, label: `Aufgabe ${n}` }))}
    toc={TOC}>

    <p className="hilfe-zeile s9-gewicht">Alle Zahlen aus dem ALLBUS sind in diesem Kapitel gewichtet (<code>weights = wghtpew</code>, kennst du aus Sitzung 6), genau wie die Ausgabe deiner Vorlagen.</p>

    <Part id="werkzeug" tone="yellow" title="Vorweg: R lesen" />
    <ReadR />

    <TopicHeading id="thema1" n={1} title="Thema 1: Die Gerade: Konstante und Steigung" />
    <Foundation1 />
    <Task1 />

    <TopicHeading id="thema2" n={2} title="Thema 2: Wie gut passt die Gerade? Residuen und R²" />
    <Foundation2 />
    <Task2 />

    <TopicHeading id="thema3" n={3} title="Thema 3: Gleich gut für alle? Fehlervarianz und Ausreißer" />
    <Foundation3 />
    <Task3 />

    <TopicHeading id="thema4" n={4} title="Thema 4: Gerade oder Kurve? Linearität" />
    <Foundation4 />
    <Task4 />

    <TopicHeading id="ueberblick" n="✓" title="Überblick: Eine Regression lesen, prüfen, berichten" />
    <Overview />

    <TakeAway points={TAKE_AWAY} selfTest={SELF_TEST} script={SCRIPT} scriptName={SCRIPT_FILE}
      more={{ href: workshopUrl, label: 'Nachlesen im R-Workshop, Kapitel 9 (9.2 Einfache lineare Regression, 9.6 Residuen-Diagnostik)' }} />
  </ChapterLayout>;
}
