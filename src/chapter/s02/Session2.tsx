// Sitzung 2 „Vom Fragebogen zum Datensatz“ als Kapitel (Spec §5, Variante B): Vorweg R lesen → Thema 1–4 je Grundlage
// und Aufgabe → Überblick → Mitnehmen. Plan: docs/entwicklung/spezifikationen/2026-11-23-lernpfad-kapitel/sitzung02.md.
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
export const session2Status = (state: ChapterState) => chapterStatus(state, REQUIRED);

const TOC: TocGroup[] = [
  { group: 'Vorweg', items: [{ href: '#r1', label: 'Startblock' }, { href: '#r2', label: 'Pipe' }, { href: '#r3', label: 'Nachschlagen' }] },
  { group: 'Themen', items: [{ href: '#thema1', label: '1 Datenmatrix' }, { href: '#thema2', label: '2 Codes und Labels' }, { href: '#thema3', label: '3 Fehlende Werte' }, { href: '#thema4', label: '4 Datentypen' }] },
  { group: 'Zum Schluss', items: [{ href: '#ueberblick', label: 'Überblick' }, { href: '#mitnehmen', label: 'Das Wichtigste' }, { href: '#selbsttest', label: 'Prüf dich selbst' }, { href: '#skript', label: 'Skript' }] },
];

const TAKE_AWAY = [
  <>Ein Datensatz ist eine <b>Datenmatrix</b>: Zeile = Fall (befragte Person), Spalte = Variable, Zelle = Wert. Der ALLBUS 2023 hat 5.246 Fälle und 579 Variablen.</>,
  <>Im Datensatz stehen <b>Codes</b>. Was sie bedeuten, sagen die <b>Wertelabels</b> im Codebuch; die Polung einer Skala legt der Fragebogen fest.</>,
  <>Codes für Kategorien sind Namen, keine Mengen: Mit ihnen zählt man, rechnet aber nicht.</>,
  <><b>Fehlende Werte</b> haben Gründe: nicht geantwortet (−9), nicht gewusst (−8), nicht gefragt (−10, −11), zwei Kreuze (−42). In R werden sie zu NA, der Grund bleibt im Codebuch sichtbar.</>,
  <>Wo das Codebuch nicht entscheidet, braucht es eine dokumentierte Regel (<b>Konvention</b>).</>,
  <><b>Datentypen</b>: Zahl <code>&lt;dbl&gt;</code>, Text <code>&lt;chr&gt;</code>, Zahl mit Wertelabel <code>&lt;dbl+lbl&gt;</code>. Umwandeln ändert die Form und lässt etwas weg.</>,
  <>In R: <code>&lt;-</code> legt ab, <code>codebook(daten, variable)</code> schlägt nach, <code>daten %&gt;% filter(variable == code)</code> behält nur bestimmte Fälle; alle Variablen bleiben.</>,
];

/** The whole session 2 chapter. Expects a `ChapterStateProvider` (sessionId 2) around it; LearningPath keeps the h2 title. */
export function Session2() {
  return <ChapterLayout
    session={2}
    lead="Was steht eigentlich in einer Zeile des ALLBUS?"
    route={[
      { href: '#werkzeug', title: 'Vorweg: R lesen', note: 'Objekt, Pipe mit einem Schritt, Nachschlagen' },
      { href: '#thema1', title: 'Vier Themen', note: 'je erst die Grundlage, dann die Aufgabe; im Seminar direkt zur Aufgabe springen' },
      { href: '#ueberblick', title: 'Zum Schluss', note: 'Überblick, Wichtigstes, Selbsttest, Skript' },
    ]}
    goals={[
      'einen Datensatz als Datenmatrix lesen: Jede Zeile ist ein Fall, jede Spalte eine Variable, jede Zelle ein Wert',
      'aus einem ausgefüllten Fragebogen mit dem Codebuch eine Zeile machen und erklären, wer dabei was entscheidet',
      'einen Eintrag im Codebuch lesen: Variablenname, Variablenlabel, Wertelabels und die Richtung einer Skala',
      'erklären, warum Codes Namen sind und nicht immer „mehr“ bedeuten, und wann man mit einer Zahl rechnen darf',
      'fehlende Werte nach ihrem Grund unterscheiden: keine Angabe, weiß nicht, nicht gefragt, zwei Kreuze',
      'die Datentypen in R erkennen: Zahl, Text, Zahl mit Wertelabel',
      <>Code lesen und anpassen: mit <code>&lt;-</code> etwas unter einem Namen ablegen, mit <code>codebook()</code> nachschlagen, mit <code>%&gt;%</code> und <code>filter()</code> nur bestimmte Befragte behalten, <code>==</code> von <code>=</code> unterscheiden</>,
    ]}
    known={<>der Startblock mit Objekt und <code>&lt;-</code>, <code>dim(allbus)</code> und die 3.037.434 Zellen, <code>find_var()</code>, das ganze Codebuch mit <code>codebook(allbus)</code> in RStudio und der erste Blick mit <code>frequency()</code>; Code, Wertelabel, Variablenlabel und die Bedeutung von TNZ (trifft nicht zu, nicht gefragt) (Sitzung 1); die Begriffe Datenmatrix, Fall, Variable, Wert und Datenreihe (Methoden Ia).</>}
    knownNote={<>Solche Stellen tragen ein graues Schild „kennst du aus Sitzung 1“ bzw. „kennst du aus Methoden Ia“. Neu ist heute der Blick von der anderen Seite: wie aus einem ausgefüllten Fragebogen eine Zeile wird und wer dabei was entscheidet.</>}
    howToExtra={[<>Die <b>Code-Werkstatt</b> kennst du aus Sitzung 1. Neu ist, dass du in einer Vorlage nur die markierte Stelle tauschst.</>]}
    jumps={[{ href: '#a1', label: 'Aufgabe 1' }, { href: '#a2', label: 'Aufgabe 2' }, { href: '#a3', label: 'Aufgabe 3' }, { href: '#a4', label: 'Aufgabe 4 (Zusatz)' }]}
    toc={TOC}>

    <Part id="werkzeug" tone="yellow" title="Vorweg: R lesen" />
    <ReadR />

    <TopicHeading id="thema1" n={1} title="Thema 1: Die Datenmatrix" />
    <Foundation1 />
    <Task1 />

    <TopicHeading id="thema2" n={2} title="Thema 2: Codes und Labels" />
    <Foundation2 />
    <Task2 />

    <TopicHeading id="thema3" n={3} title="Thema 3: Fehlende Werte haben Gründe" />
    <Foundation3 />
    <Task3 />

    <TopicHeading id="thema4" n={4} title="Thema 4: Datentypen" />
    <Foundation4 />
    <Task4 />

    <TopicHeading id="ueberblick" n="✓" title="Überblick: Was steht in einer Zeile?" />
    <Overview />

    <TakeAway points={TAKE_AWAY} selfTest={SELF_TEST} script={SCRIPT} scriptName={SCRIPT_FILE}
      more={{ href: workshopUrl, label: 'Nachlesen im R-Workshop, Kapitel 4' }} />
  </ChapterLayout>;
}
