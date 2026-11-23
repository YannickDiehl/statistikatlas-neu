// Sitzung 11 „Logistische Regression“ als Kapitel (Spec §5, Variante B): Vorweg R lesen → Thema 1–4 je Grundlage und Aufgabe → Überblick → Mitnehmen.
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
export const session11Status = (state: ChapterState) => chapterStatus(state, REQUIRED);

const TOC: TocGroup[] = [
  { group: 'Vorweg', items: [{ href: '#r1', label: 'R lesen' }, { href: '#r2', label: 'Vier Werkzeuge' }] },
  { group: 'Themen', items: [{ href: '#thema1', label: '1 Ja oder nein' }, { href: '#thema2', label: '2 B und Exp(B)' }, { href: '#thema3', label: '3 Wahrscheinlichkeiten' }, { href: '#thema4', label: '4 Modellgüte' }] },
  { group: 'Zum Schluss', items: [{ href: '#ueberblick', label: 'Überblick' }, { href: '#mitnehmen', label: 'Das Wichtigste' }, { href: '#selbsttest', label: 'Prüf dich selbst' }, { href: '#skript', label: 'Skript' }] },
];

const TAKE_AWAY = [
  <>Hat die abhängige Variable nur zwei Ausprägungen (0/1), ist ihr Mittelwert der Anteil der Einsen. Eine Gerade würde über 100 % und unter 0 % hinauslaufen; die logistische Regression zeichnet eine S-Kurve.</>,
  <>Drei Sprachen: Wahrscheinlichkeit (0 bis 1), Chance = p / (1 − p) („3 zu 1“), Logit = ln(Chance). Zurück: Chance = exp(Logit), p = Chance / (1 + Chance).</>,
  <>Das Modell rechnet in Logits: Logit = Konstante + B × Wert. B &gt; 0 heißt: die Chance steigt.</>,
  <>Exp(B) vervielfacht die Chance, nicht die Wahrscheinlichkeit. Exp(B) = 3,77: je Einheit wird die Chance 3,77-mal so groß; (Exp(B) − 1) × 100 ist die Veränderung in Prozent.</>,
  <>In Prozentpunkten hängt ein Effekt vom Ausgangspunkt ab: in der Mitte der S-Kurve groß, nahe 0 oder 100 % klein. <code>predict(…, type = "response")</code> gibt Wahrscheinlichkeiten für Beispielpersonen, der AME einen Mittelwert in Prozentpunkten.</>,
  <>Güte: Trefferquote immer mit der Regel „alle bekommen die häufige Antwort“ vergleichen; −2LL mit dem Nullmodell (Omnibus-Test); Nagelkerke R² ist kein Anteil erklärter Varianz.</>,
  <>In R: <code>logistic_regression(y ~ x1 + x2, weights = wghtpew)</code>, dann <code>summary()</code>, <code>predict()</code>, <code>marginal_effects()</code>. Jede Vorlage bildet ihre Variablen mit <code>rec()</code> in <code>mutate()</code> selbst.</>,
];

/** The whole session 11 chapter. Expects a `ChapterStateProvider` (sessionId 11) around it; LearningPath keeps the h2 title. */
export function Session11() {
  return <ChapterLayout
    session={11}
    lead="Wer geht wählen – und wie wahrscheinlich?"
    route={[
      { href: '#werkzeug', title: 'Vorweg: R lesen', note: 'ein logistisches Modell, exp(), predict(), marginal_effects()' },
      { href: '#thema1', title: 'Vier Themen', note: 'je erst die Grundlage, dann die Aufgabe; im Seminar direkt zur Aufgabe springen' },
      { href: '#ueberblick', title: 'Zum Schluss', note: 'Überblick, Wichtigstes, Selbsttest, Skript' },
    ]}
    goals={[
      'erklären, warum man für eine Variable mit nur zwei Ausprägungen (0 und 1) keine Gerade nimmt, und eine Wahrscheinlichkeit in eine Chance (Odds) und einen Logit übersetzen und zurück',
      'ein logistisches Modell gewichtet schätzen und in der Ausgabe B, Exp(B) und Sig. finden',
      'Exp(B) in Alltagssprache deuten: ein Faktor für die Chance, nicht für die Wahrscheinlichkeit',
      'vorhergesagte Wahrscheinlichkeiten für Beispielpersonen ausrechnen und erklären, warum derselbe Faktor je nach Ausgangspunkt verschieden viele Prozentpunkte bringt; den durchschnittlichen marginalen Effekt (AME) als Mittelwert lesen',
      'die Güte eines Modells einschätzen: Trefferquote gegen die einfachste Regel, −2LL und Omnibus-Test, Pseudo-R²',
      'die Voraussetzungen nennen: richtig kodierte 0/1-Variable, genug Fälle in der selteneren Gruppe, gleichmäßiger Verlauf im Logit, unabhängige Fälle, Gewichtung für Aussagen über Deutschland, keine Ursache aus Zusammenhang',
      <><code>logistic_regression()</code>, <code>exp()</code>, <code>tibble()</code> mit <code>c()</code>, <code>predict(…, type = "response")</code> und <code>marginal_effects()</code> lesen und anpassen</>,
    ]}
    known={<>der Startblock und <code>lm30</code> mit seinem TNZ: FILTER (Sitzung 1), Ketten mit <code>%&gt;%</code> (Sitzung 4), neue Variablen mit <code>rec()</code> in <code>mutate()</code>, auch Umpolen mit <code>rules = "rev"</code>, und Kreuztabellen mit Zeilenprozent (Sitzung 5), Gewichten mit <code>weights = wghtpew</code> (Sitzung 6), <code>summary()</code>, Sig. und Konfidenzintervall (Sitzung 7), die lineare Regression mit Konstante, B und Vorhersage = Konstante + B × Wert (Sitzung 9), mehrere Prädiktoren mit <code>+</code> und „bei gleichem …“ (Sitzung 10).</>}
    howToExtra={['Jede Vorlage läuft für sich: Sie bildet die Variablen, die sie braucht, selbst. Steht im Kommentar „wie in Aufgabe 1“, kennst du diesen Teil schon.']}
    jumps={[1, 2, 3, 4].map(n => ({ href: `#a${n}`, label: `Aufgabe ${n}` }))}
    toc={TOC}>

    <p className="hilfe-zeile s11-gewicht">Alle Zahlen in diesem Kapitel sind gewichtet mit <code>wghtpew</code>, genau wie die Ausgabe deiner Vorlagen (kennst du aus Sitzung 6). Darum steht unter N oft eine gewichtete Zahl, die etwas von der Zahl der befragten Personen abweicht.</p>

    <Part id="werkzeug" tone="yellow" title="Vorweg: R lesen" />
    <ReadR />

    <TopicHeading id="thema1" n={1} title="Thema 1: Ja oder nein: warum keine Gerade?" />
    <Foundation1 />
    <Task1 />

    <TopicHeading id="thema2" n={2} title="Thema 2: Das Modell: B und Exp(B)" />
    <Foundation2 />
    <Task2 />

    <TopicHeading id="thema3" n={3} title="Thema 3: Vorhergesagte Wahrscheinlichkeiten" />
    <Foundation3 />
    <Task3 />

    <TopicHeading id="thema4" n={4} title="Thema 4: Wie gut ist das Modell?" />
    <Foundation4 />
    <Task4 />

    <TopicHeading id="ueberblick" n="✓" title="Überblick: Logistische Regression lesen" />
    <Overview />

    <TakeAway points={TAKE_AWAY} selfTest={SELF_TEST} script={SCRIPT} scriptName={SCRIPT_FILE}
      more={{ href: workshopUrl, label: 'Nachlesen im R-Workshop, Kapitel 9.8' }}
      scriptNote="Alle Vorlagen dieser Sitzung in einer Datei, mit Kommentaren. Öffne sie in RStudio und führe sie Block für Block aus. Jeder Block läuft für sich." />
  </ChapterLayout>;
}
