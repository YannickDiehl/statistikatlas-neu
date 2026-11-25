// Sitzung 10 „Regression vertiefen“ als Kapitel (Spec §5, Variante B): Vorweg R lesen → Thema 1–4 je Grundlage und Aufgabe → Überblick → Mitnehmen.
import { workshopUrl } from '../../domain/curriculum';
import { ChapterLayout, Part, type TocGroup } from '../blocks/ChapterLayout';
import { TopicHeading } from '../blocks/Foundation';
import { chapterStatus, type ChapterState } from '../state';
import { TakeAway10 } from './Check';
import { REQUIRED, SCRIPT, SCRIPT_FILE, SELF_TEST } from './content';
import { Foundation1, Foundation2, Foundation3, Foundation4, Overview } from './Foundations';
import { ReadR } from './ReadR';
import { Task1, Task2, Task3, Task4 } from './Tasks';

/** Status for the session rail: done when every required question of tasks 1 to 3 is right. */
export const session10Status = (state: ChapterState) => chapterStatus(state, REQUIRED);

const TOC: TocGroup[] = [
  { group: 'Vorweg', items: [{ href: '#r1', label: 'Mehrere Prädiktoren' }, { href: '#r2', label: 'Ausgabe lesen' }, { href: '#r3', label: 'to_dummy()' }] },
  { group: 'Themen', items: [{ href: '#thema1', label: '1 Konstant halten' }, { href: '#thema2', label: '2 Dummyvariablen' }, { href: '#thema3', label: '3 Vergleichen und prüfen' }, { href: '#thema4', label: '4 Grenzen des Modells' }] },
  { group: 'Zum Schluss', items: [{ href: '#ueberblick', label: 'Überblick' }, { href: '#mitnehmen', label: 'Das Wichtigste' }, { href: '#selbsttest', label: 'Prüf dich selbst' }, { href: '#skript', label: 'Skript' }] },
];

const TAKE_AWAY = [
  <>In einer multiplen Regression gilt jedes B bei gleichen Werten der anderen Prädiktoren. Kommt ein Prädiktor dazu, der mit beiden zusammenhängt, ändert sich B: Es kann kleiner werden (Aufgabe 1) oder größer (Grundlage 1).</>,
  <>Beide B, mit und ohne Kontrolle, stimmen; sie beantworten verschiedene Fragen. Sag immer, was konstant gehalten wurde.</>,
  <>Gruppen kommen als Dummies ins Modell: k Gruppen, k − 1 Dummies. Die Konstante ist der Mittelwert der Referenzgruppe, jedes B ein Abstand zu ihr. Andere Referenz, andere B, gleiche Vorhersagen.</>,
  <>Beta vergleicht Prädiktoren in derselben Einheit. Das größte B ist nicht automatisch der stärkste Prädiktor.</>,
  <>R² steigt mit jedem Prädiktor; das korrigierte R² nur, wenn er mehr erklärt als Zufall.</>,
  <>VIF ab 10 heißt: Prädiktoren sagen fast dasselbe (Multikollinearität). Einflussreiche Fälle können B stark verschieben, vor allem in kleinen Gruppen. Gilt ein Unterschied nicht für alle, gehört eine Interaktion mit <code>*</code> ins Modell.</>,
  <>In R: <code>linear_regression(y ~ x1 + x2, weights = wghtpew) %&gt;% summary()</code>, Dummies mit <code>to_dummy()</code>, Interaktion mit <code>*</code>.</>,
];

/** The whole session 10 chapter. Expects a `ChapterStateProvider` (sessionId 10) around it; LearningPath keeps the h2 title. */
export function Session10() {
  return <ChapterLayout
    session={10}
    lead="Was bleibt von einem Zusammenhang, wenn man mehr berücksichtigt?"
    route={[
      { href: '#werkzeug', title: 'Vorweg: R lesen', note: 'mehrere Prädiktoren in der Formel, die Ausgabe von summary(), to_dummy()' },
      { href: '#thema1', title: 'Vier Themen', note: 'je erst die Grundlage, dann die Aufgabe; im Seminar direkt zur Aufgabe springen' },
      { href: '#ueberblick', title: 'Zum Schluss', note: 'Überblick, Wichtigstes, Selbsttest, Skript' },
    ]}
    goals={[
      'eine lineare Regression mit mehreren Prädiktoren rechnen und Gruppen als Dummyvariablen mit einer Referenzgruppe ins Modell nehmen',
      'einen Regressionskoeffizienten B in einem Modell mit mehreren Prädiktoren als „bei gleichen Werten der anderen Prädiktoren“ lesen und erklären, warum sich B ändert, wenn ein zweiter Prädiktor dazukommt',
      'B einer Dummyvariable als Abstand zur Referenzgruppe lesen und die Konstante als Mittelwert der Referenzgruppe',
      'Prädiktoren mit dem standardisierten Koeffizienten Beta vergleichen und R² gegen das korrigierte R² abwägen',
      'die Voraussetzungen einer multiplen Regression nennen und prüfen: keine starke Multikollinearität (VIF), keine Dummyfalle, keine einzelnen Fälle mit großem Einfluss, ein Zusammenhang, der für alle gleich gilt oder als Interaktion ins Modell kommt; dazu, was man kontrollieren sollte und was nicht',
      <><code>y ~ x1 + x2</code> in <code>linear_regression()</code> lesen und anpassen, mit <code>to_dummy()</code> Dummies bilden, in der Ausgabe von <code>summary()</code> Model Summary, Coefficients und Collinearity Statistics finden; <code>*</code> für eine Interaktion lesen</>,
    ]}
    known={<>der Startblock und TNZ: SPLIT (Sitzung 1), <code>filter()</code> und dass Codes oft nur Namen sind (Sitzung 2), die Standardabweichung (Sitzung 3), die Pipe <code>%&gt;%</code> und Ausreißer im Boxplot (Sitzung 4), AV und UV, <code>mutate()</code> mit <code>rec()</code>, <code>rules = "rev"</code> zum Umpolen und Dummyvariablen mit 0 und 1 (Sitzung 5), Gewichten mit <code>weights = wghtpew</code> und die Drittvariable (Sitzung 6), t-Test, Konfidenzintervall und p-Wert (Sitzung 7), der Index (Sitzung 8), <code>linear_regression()</code> mit <code>summary()</code>, Prädiktor, Konstante, Steigung B, Beta bei einer UV, Residuum, R², Linearität, Ausreißer und gleiche Fehlervarianz sowie die Variablen <code>demo</code> und <code>lage</code> (Sitzung 9).</>}
    jumps={[1, 2, 3, 4].map(n => ({ href: `#a${n}`, label: `Aufgabe ${n}` }))}
    toc={TOC}>

    <p className="s10-gewicht">Alle Zahlen in diesem Kapitel sind gewichtet mit <code>wghtpew</code>, genau wie die Ausgabe deiner Vorlagen (kennst du aus Sitzung 6). In der Ausgabe ist N dann die Summe der Gewichte, gerundet, nicht die Zahl der Befragten.</p>

    <Part id="werkzeug" tone="yellow" title="Vorweg: R lesen" />
    <ReadR />

    <TopicHeading id="thema1" n={1} title="Thema 1: Mehrere Prädiktoren: konstant halten" />
    <Foundation1 />
    <Task1 />

    <TopicHeading id="thema2" n={2} title="Thema 2: Gruppen als Prädiktoren: Dummyvariablen" />
    <Foundation2 />
    <Task2 />

    <TopicHeading id="thema3" n={3} title="Thema 3: Vergleichen und prüfen" />
    <Foundation3 />
    <Task3 />

    <TopicHeading id="thema4" n={4} title="Thema 4: Grenzen des Modells" />
    <Foundation4 />
    <Task4 />

    <TopicHeading id="ueberblick" n="✓" title="Überblick: Ein Modell bauen und prüfen" />
    <Overview />

    <TakeAway10 points={TAKE_AWAY} selfTest={SELF_TEST} script={SCRIPT} scriptName={SCRIPT_FILE}
      more={{ href: workshopUrl, label: 'Nachlesen im R-Workshop, Kapitel 9' }} />
  </ChapterLayout>;
}
