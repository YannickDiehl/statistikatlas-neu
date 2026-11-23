// Sitzung 8 „Index und Skala“: Aufgaben 1 bis 4 (Plan Abschnitte 4 bis 8), mit Fehlerhilfe.
import type { ReactNode } from 'react';
import { Badge, Known } from '../blocks/Card';
import { Hints } from '../blocks/Hints';
import { Predict } from '../blocks/Predict';
import { NoGraphic, Plenum, Steps, TaskBlock } from '../blocks/TaskBlock';
import { TryOut } from '../blocks/TryOut';
import { withCode } from '../blocks/rich';
import { TaskQuestions } from './Checks';
import { ERROR_HELP, ERROR_HELP_CAPTION, ERROR_HELP_TITLE, HINTS, MM_ITEMS, PA_ITEMS, PREDICTIONS, QUESTIONS, type Rich } from './content';
import { MinValid } from './figures/Theme1';
import { AlphaWithout } from './figures/Theme2';
import { BeforeAfter } from './figures/Theme3';
import { Workshop } from './Workshop';

/* ---------- Gemeinsame Teile ---------- */

const hints = (key: keyof typeof HINTS) => HINTS[key].map(h => <p key={h}>{withCode(h)}</p>) as [ReactNode, ReactNode, ReactNode];

function rich(parts: Rich): ReactNode {
  return parts.map((p, i) => typeof p === 'string' ? p
    : 'code' in p ? <code key={i}>{p.code}</code>
      : <a key={i} href={p.href}>{p.text}</a>);
}

/** „Hilfe: R meldet einen Fehler“ at the end of every task (closed details with a table). */
export function ErrorHelp() {
  return <details className="hilfe">
    <summary>{ERROR_HELP_TITLE}</summary>
    <table className="daten">
      <caption>{ERROR_HELP_CAPTION}</caption>
      <thead><tr><th scope="col">R meldet</th><th scope="col">Das hilft</th></tr></thead>
      <tbody>{ERROR_HELP.map((row, i) => <tr key={i}><td>{rich(row.says)}</td><td>{rich(row.helps)}</td></tr>)}</tbody>
    </table>
  </details>;
}

function predict(key: keyof typeof PREDICTIONS) {
  const p = PREDICTIONS[key];
  return <Predict id={p.id} prompt={p.prompt} options={p.options} />;
}

function ItemTable({ caption, items }: { caption: string; items: [string, string][] }) {
  return <table className="daten voll">
    <caption>{caption}</caption>
    <thead><tr><th scope="col">Variable</th><th scope="col">Aussage</th></tr></thead>
    <tbody>{items.map(([id, text]) => <tr key={id}><td><code>{id}</code></td><td>{`„${text}“`}</td></tr>)}</tbody>
  </table>;
}

const WORK_HERE = <p>Arbeite in der Code-Werkstatt direkt hier oder in RStudio. In RStudio führst du vorher den <a href="#r1">Startblock aus „R lesen“</a> aus.</p>;

/* ---------- Aufgabe 1 ---------- */

export function Task1() {
  return <TaskBlock id="a1" n={1} title="Wie populistisch denken die Befragten?" required
    question="Wie misst man Populismus mit sieben Aussagen, und wer bekommt einen Wert?"
    goal="Am Ende hast du für jede befragte Person einen Populismus-Wert gebildet, weißt, wie viele Befragte einen Wert bekommen, und kannst den Mittelwert in Worten deuten."
    foundationHref="#g1"
    basis={<><a href="#g1">Grundlage 1, Mehrere Fragen, ein Wert</a>; <a href="#r2">Vorweg: Karte R2</a></>}>
    <p>Populismus heißt grob: Man sieht „das Volk“ als Einheit gegen eine abgehobene Elite und will, dass das Volk selbst entscheidet. Der ALLBUS 2023 hat dazu sieben Aussagen gestellt (nur in einem Teil der Fragebögen). Antworten: 1 stimme voll zu, 2 stimme eher zu, 3 teils/teils, 4 lehne eher ab, 5 lehne ganz ab.</p>
    <ItemTable caption="Die sieben Populismus-Aussagen" items={PA_ITEMS} />
    {predict('a1')}
    {WORK_HERE}
    <Steps>
      <li>Bilde den Index und zähle, wie viele Befragte einen Wert bekommen. Die Vorlage verlangt alle sieben Antworten (<code>min_valid = 7</code>). Führe sie aus, lies N und merk dir die Zahl (Frage a1a). <Badge>row_means(): neu heute</Badge> <Known session={3} what="describe()" />
        <Workshop k="a1" live /></li>
      <li>Wer eine oder zwei der sieben Aussagen nicht beantwortet hat, soll trotzdem einen Wert bekommen. Setz die markierte Zahl auf 5 (mindestens fünf von sieben) und führe die Vorlage erneut aus. Wie viele sind es jetzt?
        <MinValid /></li>
      <li>Jetzt die Aussage über die Bevölkerung: Wie populistisch sind die Befragten im Mittel? Dafür rechnest du mit Gewicht. Die Vorlage baut den Index wie in Schritt 1, mit <code>min_valid = 5</code>. <Known session={6} what="weights = wghtpew" />
        <Workshop k="a1w" live /></li>
      <li><b>Deuten:</b> Was heißt der Mittelwert? Achte auf die Richtung der Antworten: 1 heißt „stimme voll zu“. (Frage a1e unten)</li>
    </Steps>
    <TryOut idea="Unterscheiden sich Westen und Osten im Populismus-Index?" workshop={<Workshop k="frei_a1" live />} />
    <TaskQuestions id="a1-fragen" questions={QUESTIONS.a1} predictionId={PREDICTIONS.a1.id} />
    <Hints steps={hints('a1')} />
    <NoGraphic>Alle Zahlen stehen in den Ausgaben von Schritt 1 und Schritt 3.</NoGraphic>
    <ErrorHelp />
  </TaskBlock>;
}

/* ---------- Aufgabe 2 ---------- */

export function Task2() {
  return <TaskBlock id="a2" n={2} title="Messen die sieben Aussagen dasselbe?" required
    question="Darf man die sieben Populismus-Aussagen zu einem Index zusammenfassen, und passt jede dazu?"
    goal="Am Ende kannst du sagen, wie stimmig die sieben Aussagen sind (Cronbachs α), welche am schwächsten zu den anderen passt, und begründen, ob sie im Index bleiben soll."
    foundationHref="#g2"
    basis={<a href="#g2">Grundlage 2, Passen die Fragen zusammen?</a>}>
    <p>In <a href="#a1">Aufgabe 1</a> hast du aus den sieben Aussagen pa29 bis pa35 einen Index gebildet. Ob das erlaubt ist, prüfst du jetzt. Die Aussagen findest du in Aufgabe 1.</p>
    {predict('a2')}
    {WORK_HERE}
    <Steps>
      <li>Führe die Vorlage aus. Oben steht Cronbachs α, unten unter „Item-Total Statistics“ je Aussage eine Zeile. <Badge>reliability(): neu heute</Badge> <Known session={7} what="summary()" />
        <Workshop k="a2" live /></li>
      <li>Such die Aussage mit der schwächsten Trennschärfe (Spalte Corrected Item-Total). Prüf dann nach, was „Alpha if Deleted“ bedeutet: Lösch in der Vorlage die markierte Aussage samt Komma und führe sie erneut aus.
        <Workshop k="a2ohne" live />
        <p className="hilfe-zeile">N ist jetzt 3441 statt 3427: Ohne pa29 zählen auch die 14 Befragten mit, die nur pa29 nicht beantwortet haben. α ist trotzdem dasselbe wie in „Alpha if Deleted“.</p>
        <AlphaWithout /></li>
      <li><b>Deuten:</b> Soll pa29 aus dem Index? Denk an den Inhalt der Aussage und an <a href="#v2c">Grundlage 2c</a>. (Frage a2e unten)</li>
    </Steps>
    <TryOut idea="Wie stimmig sind nur drei der sieben Aussagen?" workshop={<Workshop k="frei_a2" live />} />
    <TaskQuestions id="a2-fragen" questions={QUESTIONS.a2} predictionId={PREDICTIONS.a2.id} />
    <Plenum><p style={{ margin: '4px 0 0' }}>Würdet ihr pa29 im Index behalten? Bringt ein Argument für Behalten und eins für Streichen mit.</p></Plenum>
    <Hints steps={hints('a2')} />
    <NoGraphic>Alle Zahlen stehen in den Ausgaben von Schritt 1 und Schritt 2.</NoGraphic>
    <ErrorHelp />
  </TaskBlock>;
}

/* ---------- Aufgabe 3 ---------- */

export function Task3() {
  return <TaskBlock id="a3" n={3} title="Andersherum gefragt: Einstellungen zu Islam und Muslimen" required
    question="Wie fasst man sechs Aussagen, die in verschiedene Richtungen gestellt sind, richtig zu einem Index zusammen?"
    goal="Am Ende hast du die andersherum gestellten Aussagen erkannt und umgepolt und kannst sagen, wie sich Cronbachs α dadurch verändert und wofür ein hoher Wert jetzt steht."
    foundationHref="#g3"
    basis={<><a href="#g3">Grundlage 3, Alle in eine Richtung</a>; <a href="#v2c">Grundlage 2c, Die Ausgabe von reliability()</a></>}>
    <p>Der ALLBUS 2023 misst in einem Teil der Fragebögen mit sechs Aussagen, wie Menschen in Deutschland zum Islam und zu Muslimen eingestellt sind. Solche Fragen sind in der Einstellungsforschung üblich, um Vorbehalte und Offenheit in der Bevölkerung zu beschreiben. Die Befragten sagen zu jeder Aussage, wie sehr sie zustimmen: von 1 „stimme gar nicht zu“ bis 7 „stimme voll und ganz zu“; dazwischen stehen nur Zahlen. Die Aussagen sind Fragen aus dem Fragebogen, keine Feststellungen dieses Kurses. Ob sie zutreffen, ist hier nicht die Frage: Du prüfst nur, wie man sie richtig zu einem Index zusammenfasst. Sinngemäß nach den Variablenlabels:</p>
    <ItemTable caption="Die sechs Aussagen zu Islam und Muslimen" items={MM_ITEMS} />
    {predict('a3')}
    {WORK_HERE}
    <Steps>
      <li>Führe die Vorlage aus. Sie rechnet α mit den sechs Aussagen so, wie sie im Datensatz stehen. Schau auf α und auf die Spalte Corrected Item-Total. <Badge>reliability(): Aufgabe 2</Badge>
        <Workshop k="a3" live /></li>
      <li>Die Vorlage baut mit <code>rec(…, rules = "rev")</code> zwei umgepolte Aussagen, <code>mm02_um</code> und <code>mm05_um</code>. Führst du sie so aus, ändert sich α noch nicht: In <code>reliability()</code> stehen noch die alten Aussagen. Tausch die beiden markierten Stellen gegen ihre umgepolte Fassung und führe die Vorlage erneut aus. <Known session={5} what={'rec(…, rules = "rev")'} />
        <Workshop k="a3um" live />
        <BeforeAfter /></li>
      <li><b>Deuten:</b> Wofür steht nach dem Umpolen eine hohe Zahl, bei allen sechs Aussagen? (Frage a3d unten)</li>
    </Steps>
    <TryOut idea="Was passiert mit dem Index, wenn man das Umpolen vergisst?" workshop={<Workshop k="frei_a3" live />} />
    <TaskQuestions id="a3-fragen" questions={QUESTIONS.a3} predictionId={PREDICTIONS.a3.id} />
    <Hints steps={hints('a3')} />
    <NoGraphic>Alle Zahlen stehen in den Ausgaben von Schritt 1 und Schritt 2.</NoGraphic>
    <ErrorHelp />
  </TaskBlock>;
}

/* ---------- Aufgabe 4 ---------- */

export function Task4() {
  return <TaskBlock id="a4" n={4} title="Im Schnitt oder durchgehend?" required={false} kind="interpret"
    question="Wie viele Befragte sind „durchgehend“ populistisch, und wie viele nur im Schnitt?"
    goal="Am Ende kannst du sagen, wie viel Prozent drei Populismus-Aussagen allen zustimmen und wie viel Prozent ihnen im Schnitt zustimmen, und erklären, warum sich die beiden Zahlen unterscheiden."
    foundationHref="#g4"
    basis={<a href="#g4">Grundlage 4, Ausgleichen oder alle?</a>}>
    <p>In der Forschung wird diskutiert, ob Populismus wie ein Mittelwert gemessen werden darf: Kann Zustimmung bei einer Seite des Begriffs eine Ablehnung bei einer anderen ausgleichen? Du nimmst drei Aussagen, je eine für eine Seite des Populismus: pa31 (einfache Bürger statt Berufspolitiker: gegen die Elite), pa32 (Kompromiss ist Verrat: ein einiger Volkswille), pa33 (das Volk soll entscheiden). Zustimmung heißt hier 1 oder 2.</p>
    {predict('a4')}
    {WORK_HERE}
    <Steps>
      <li>Die Vorlage baut zwei Indizes in einer Kette: <code>zustimmungen</code> zählt, wie vielen der drei Aussagen jemand zustimmt (0 bis 3), <code>kurz</code> ist der Mittelwert der drei Antworten. Führe sie aus: Sie zeigt die Zahl der Zustimmungen. <Badge>row_sums(): neu heute</Badge> <Known session={5} what="rec()" /> <Known session={6} what="frequency() mit Gewicht" />
        <Workshop k="a4" live /></li>
      <li>Tausch die markierte Stelle gegen <code>kurz</code> und führe die Vorlage erneut aus. Jetzt siehst du den Mittelwertindex. Er hat 13 mögliche Werte; R schreibt 1,33 als 1.33333333333333. „Im Schnitt Zustimmung“ heißt: Wert höchstens 2. Lies die Spalte Cum. % in der Zeile 2.</li>
      <li><b>Deuten:</b> Warum sind es im Schnitt mehr als durchgehend? Denk an Person A und B aus <a href="#v4a">Grundlage 4a</a>, und überleg, welche Antworten jemand haben kann, der im Schnitt höchstens 2 hat, aber nicht allen drei Aussagen zustimmt. (Frage a4c unten)</li>
    </Steps>
    <TryOut idea="Stimmen im Osten mehr Befragte allen drei Aussagen zu als im Westen?" workshop={<Workshop k="frei_a4" live />} />
    <TaskQuestions id="a4-fragen" questions={QUESTIONS.a4} predictionId={PREDICTIONS.a4.id} />
    <Plenum><p style={{ margin: '4px 0 0' }}>Ist jemand populistisch, der zwei Aussagen zustimmt, eine davon voll, und bei der dritten „teils/teils“ sagt? Welche Regel passt besser zum Begriff: Mittelwert oder „allen zugestimmt“?</p></Plenum>
    <Hints steps={hints('a4')} />
    <NoGraphic>Diese Aufgabe hat keine Grafik. Alle Zahlen stehen in den Ausgaben von Schritt 1 und Schritt 2.</NoGraphic>
    <ErrorHelp />
  </TaskBlock>;
}
