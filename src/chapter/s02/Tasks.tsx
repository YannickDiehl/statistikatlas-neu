// Sitzung 2 „Vom Fragebogen zum Datensatz“: Aufgaben 1 bis 4 nach Plan sitzung02.md (Abschnitte 3 bis 6), mit Fehlerhilfe.
import type { ReactNode } from 'react';
import { Hints } from '../blocks/Hints';
import { Predict } from '../blocks/Predict';
import { Questions } from '../blocks/Questions';
import { NoGraphic, Plenum, Steps, TaskBlock } from '../blocks/TaskBlock';
import { TryOut } from '../blocks/TryOut';
import { withCode } from '../blocks/rich';
import { A1_SOLVED, ERROR_HELP, ERROR_HELP_CAPTION, ERROR_HELP_TITLE, HINTS, PREDICTIONS, QUESTIONS, type Rich } from './content';
import { BogenA2, OutputRead, Split } from './figures/Pictures';
import { Workshop } from './ReadR';

/* ---------- Gemeinsame Teile ---------- */

const hint = (h: string) => <p>{withCode(h)}</p>;
const hints = (key: keyof typeof HINTS, solved?: ReactNode) => {
  const [a, b, c] = HINTS[key];
  return [hint(a), hint(b), <>{hint(c)}{solved}</>] as [ReactNode, ReactNode, ReactNode];
};

function rich(parts: Rich): ReactNode {
  return parts.map((p, i) => typeof p === 'string' ? p
    : 'code' in p ? <code key={i}>{p.code}</code>
      : <a key={i} href={p.href}>{p.text}</a>);
}

/** „Hilfe: R meldet einen Fehler“ at the end of every task (closed details with a table). */
export function ErrorHelp() {
  return <details className="hilfe">
    <summary>{ERROR_HELP_TITLE}</summary>
    <table className="daten voll">
      <caption>{ERROR_HELP_CAPTION}</caption>
      <thead><tr><th scope="col">R meldet</th><th scope="col">Ursache</th><th scope="col">Das hilft</th></tr></thead>
      <tbody>{ERROR_HELP.map((row, i) => <tr key={i}><td>{rich(row.says)}</td><td>{rich(row.cause)}</td><td>{rich(row.helps)}</td></tr>)}</tbody>
    </table>
  </details>;
}

function predict(key: keyof typeof PREDICTIONS) {
  const p = PREDICTIONS[key];
  return <Predict id={p.id} prompt={withCode(p.prompt)} options={p.options} />;
}

const WHERE = <p>Arbeite in der Code-Werkstatt direkt hier oder in RStudio. In RStudio führst du vorher den <a href="#r1">Startblock aus R lesen</a> aus.</p>;

/* ---------- Aufgabe 1 ---------- */

export function Task1() {
  return <TaskBlock id="a1" n={1} title="Wer hat auf Papier geantwortet?" required
    question="Wie viele Zeilen des ALLBUS waren einmal ein Papierbogen?"
    goal="Am Ende kannst du in der Ausgabe von R Reihen und Türme ablesen, mit filter() nur die Papierbögen behalten und sagen, wie viele es sind, was mit den Variablen passiert und für wen ein Ergebnis dann gilt."
    foundationHref="#g1"
    basis={<><a href="#g1">Grundlage 1 „Die Datenmatrix“</a> und <a href="#r2">R lesen „Die Pipe mit einem Schritt“</a></>}>
    <p>Der ALLBUS 2023 wurde auf drei Wegen erhoben: im persönlichen Interview, bei dem die Antworten direkt in einen Laptop getippt werden (CAPI), online (CAWI) und auf Papier, das per Post zurückkam (MAIL). Die Papierbögen musste jemand abtippen. Welche Zeilen das sind, verrät die Variable <code>mode</code>.</p>
    {predict('a1')}
    {WHERE}
    <Steps>
      <li>Lass dir die ganze Bauplatte anzeigen. Wenn du nur den Namen eines Objekts ausführst, zeigt R es an.
        <Workshop k="a1a" live />
        <p className="hilfe-zeile">Die erste Zeile verrät die Größe: erst die Reihen, dann die Türme. Darunter stehen die Namen der ersten Türme und in spitzen Klammern ihr Typ (mehr dazu in Grundlage 4). Die Reihen zeigt R nur zum Teil, der Rest steht in den letzten Zeilen („more rows“, „more variables“). In RStudio siehst du dieselben Zahlen auch rechts oben im Environment: „5246 obs. of 579 variables“.</p>
        <OutputRead caption={<>So ist die Ausgabe aufgebaut. Die Zellen der Reihen sind hier durch „…“ ersetzt. <span>Bei einem breiteren Fenster zeigt R mehr Türme und weniger „more variables“.</span></>} /></li>
      <li>Schlag nach, welcher Code in <code>mode</code> für den Papierbogen steht. MAIL heißt: Papierbogen per Post.
        <Workshop k="a1b" live />
        <p className="hilfe-zeile">Unter <code>Values</code> steht, welche Codes wirklich vorkommen. PAPI (Code 1, ein älterer Papier-Interviewweg) steht im Codebuch, kommt 2023 aber nicht vor.</p></li>
      <li>Die dritte Vorlage behält im Moment nur die Interviews (Code 2). Tausch die markierte 2 gegen den Code für Papierbögen aus Schritt 2 und führe sie aus. Lies in der ersten Zeile der Ausgabe ab, wie groß die neue Bauplatte ist.
        <Workshop k="a1c" live />
        <p className="hilfe-zeile"><code>auswahl</code> ist ein neuer Name für das Ergebnis. <code>allbus</code> bleibt dabei unverändert. Mit <code>==</code> fragt R in jeder Reihe: Steht in <code>mode</code> dieser Code? Wie <code>filter()</code> Reihen auswählt, zeigt das Bild in <a href="#r2">R lesen</a>.</p></li>
    </Steps>
    <TryOut idea="Ergeben die drei Wege zusammen wirklich alle 5.246 Befragten, oder fehlt jemand? Die Interviews (2.003) und die Papierbögen (1.656) kennst du schon; der Vorschlag nimmt die Online-Befragten." workshop={<Workshop k="frei_a1" live />} />
    <Questions id="a1-fragen" questions={QUESTIONS.a1} predictionId={PREDICTIONS.a1.id} />
    <Hints steps={hints('a1', <pre className="code" tabIndex={0} aria-label="Gelöste Vorlage 3">{A1_SOLVED}</pre>)} />
    <NoGraphic>Alle Antworten stehen als Text in der R-Ausgabe; das Bild zum Aufbau der Ausgabe hat eine Textfassung.</NoGraphic>
    <ErrorHelp />
  </TaskBlock>;
}

/* ---------- Aufgabe 2 ---------- */

export function Task2() {
  return <TaskBlock id="a2" n={2} title="Ein Bogen wird zur Zeile" required
    question="Welche Zahlen stehen in der Zeile dieser Person?"
    goal="Am Ende hast du aus einem ausgefüllten Papierbogen eine Zeile mit vier Codes gemacht und kannst begründen, warum ein höherer Code nicht immer „mehr“ bedeutet."
    foundationHref="#g2"
    basis={<a href="#g2">Grundlage 2 „Codes und Labels“</a>}>
    <p>Vor dir liegt ein ausgefüllter Papierbogen, zum Beispiel dieser hier. Die Antworten sind ausgedacht; so einen Bogen gibt es im ALLBUS nicht. Mach daraus eine Zeile, wie sie im ALLBUS stehen würde. Welcher Code zu welchem Wertelabel gehört, steht im Codebuch.</p>
    <BogenA2 caption={<>Ein ausgedachter Bogen mit vier Fragen. <span>Unter dem Bogen stehen die Namen der Variablen im ALLBUS.</span></>} />
    {predict('a2')}
    {WHERE}
    <Steps>
      <li>Schlag die vier Variablen im Codebuch nach. Führe die Vorlage aus.
        <Workshop k="a2" live /></li>
      <li>Such zu jeder Antwort auf dem Bogen das passende Wertelabel und trag den Code unten in die Antwortfelder ein (die ersten vier Fragen). Achte auf die Richtung der Skala. Steht bei einer Variable kein Wertelabel für die Antwort, ist die Zahl selbst der Wert.</li>
      <li><b>Deuten:</b> Lies deine fertige Zeile: Welche Zahl sagt etwas über eine Menge, welche ist nur ein Name? Dazu gehört die letzte Frage unten.</li>
    </Steps>
    <TryOut idea="Wie ist der Familienstand gespeichert, und gibt es dort eine Rangfolge?" workshop={<Workshop k="frei_a2" live />} />
    <p className="s2-fragen-intro"><b>Deine Zeile für diesen Bogen</b></p>
    <Questions id="a2-fragen" questions={QUESTIONS.a2} predictionId={PREDICTIONS.a2.id} />
    <Plenum><p style={{ margin: '4px 0 0' }}><b>Optional:</b> Hättet ihr „keiner dieser Schichten“ angekreuzt, stünde dort −50, ein fehlender Wert, obwohl die Person geantwortet hat. Ist das richtig so? Bringt eine Begründung mit.</p></Plenum>
    <Hints steps={hints('a2')} />
    <NoGraphic>Der Bogen hat eine Textfassung; alle Codes stehen als Text in der R-Ausgabe.</NoGraphic>
    <ErrorHelp />
  </TaskBlock>;
}

/* ---------- Aufgabe 3 ---------- */

export function Task3() {
  return <TaskBlock id="a3" n={3} title="Was nur auf Papier passiert" required
    question="Welche fehlenden Werte gibt es im ALLBUS nur, weil es Papierbögen gibt?"
    goal="Am Ende kannst du sagen, wie der ALLBUS zwei Kreuze und nicht gestellte Fragen speichert, und mit Zahlen aus R begründen, warum „fehlt“ nicht gleich „fehlt“ ist."
    foundationHref="#g3"
    basis={<><a href="#g3">Grundlage 3 „Fehlt ist nicht gleich fehlt“</a>, dazu <a href="#a1">Aufgabe 1</a> (<code>filter()</code>)</>}>
    <p>Einen Papierbogen füllt man anders aus als einen Online-Fragebogen oder ein Interview mit Laptop. Und auf Papier wie online gab es zwei Fragebogenversionen, A und B. Beides hinterlässt Spuren in den fehlenden Werten. Du schaust dir drei Fragen an: die Links-rechts-Einstufung <code>pa01</code> (1 = links, 10 = rechts), das Vertrauen zu Mitmenschen <code>st01</code> und das Vertrauen in den Bundestag <code>pt03</code>.</p>
    {predict('a3')}
    {WHERE}
    <Steps>
      <li>Behalte nur die Papierbögen und schlag drei Fragen im Codebuch nach. Führe die Vorlage so aus, wie sie ist. Schau bei jeder Frage unter „Missing values“.
        <Workshop k="a3" live />
        <p className="hilfe-zeile">Das Codebuch zählt jetzt nur die Papierbögen: oben steht „Observations: 1656“. Die Anzahl steht hinter „n =“; steht dort keine, kommt der Code in dieser Auswahl nicht vor (wie −8 bei st01). In RStudio stehen die Anzahlen im Viewer in der Spalte Freq.</p></li>
      <li>Vergleiche mit allen Befragten: Tausch die markierte Stelle <code>papier</code> gegen <code>allbus</code> und führe die Vorlage noch einmal aus. Wie oft steht −42 bei <code>pa01</code> jetzt?</li>
      <li>Zurück zu den Papierbögen (Zurücksetzen oder wieder <code>papier</code> eintragen): Wie oft steht −11 TNZ: SPLIT bei <code>st01</code>, wie oft bei <code>pt03</code>? Zähl beide zusammen und vergleiche mit der Zahl der Papierbögen aus Aufgabe 1.
        <Split caption={<>Zwei Fragebogenversionen, zwei Reihen: Jede Version lässt eine der beiden Fragen weg. <span>Die Bögen und Steine sind ein Beispiel.</span></>} /></li>
    </Steps>
    <TryOut idea="Gab es die zwei Versionen auch online, und im Interview?" workshop={<Workshop k="frei_a3" live />} />
    <Questions id="a3-fragen" questions={QUESTIONS.a3} predictionId={PREDICTIONS.a3.id} />
    <Plenum><p style={{ margin: '4px 0 0' }}>Im ganzen ALLBUS steht −42 in 638 Zellen, und 357 der 1.656 Papierbögen haben mindestens eine Mehrfachnennung. Online und im Interview gibt es keine. Was heißt das, wenn du später nur gültige Antworten auswertest: Wessen Antworten fallen häufiger weg? Und wäre es besser gewesen, beim Abtippen eines der zwei Kreuze zu nehmen? Bringt eine Begründung mit.</p></Plenum>
    <Hints steps={hints('a3')} />
    <NoGraphic>Alle Zahlen stehen als Text in der R-Ausgabe; das Bild zu den zwei Versionen hat eine Textfassung.</NoGraphic>
    <ErrorHelp />
  </TaskBlock>;
}

/* ---------- Aufgabe 4 ---------- */

export function Task4() {
  return <TaskBlock id="a4" n={4} title="Drei Typen auf einer Bauplatte" required={false} kind="interpret"
    question="Welche Zahlen im ALLBUS sind Antworten, welche nur Namen?"
    goal="Am Ende kannst du in der Ausgabe von R den Datentyp eines Turms ablesen und begründen, warum man mit einer Kennnummer nicht rechnet, obwohl sie eine Zahl ist."
    foundationHref="#g4"
    basis={<a href="#g4">Grundlage 4 „Datentypen“</a>}>
    {predict('a4')}
    {WHERE}
    <Steps>
      <li>Führe die Vorlage aus und schau in die Zeile unter den Namen der Türme: Dort steht unter jedem Namen in spitzen Klammern sein Typ.
        <Workshop k="a4" live />
        <p className="hilfe-zeile"><code>respid</code> ist die Kennnummer der befragten Person, <code>doi</code> die Internetadresse des Datensatzes, <code>mode</code> der Erhebungsweg aus Aufgabe 1. Ist dein Fenster schmal, kürzt R Typen und Wörter mit „…“: <code>&lt;dbl+l&gt;</code> heißt <code>&lt;dbl+lbl&gt;</code>.</p></li>
    </Steps>
    <TryOut idea="Wie viele verschiedene Werte hat die Kennnummer?" workshop={<Workshop k="frei_a4" live />} />
    <Questions id="a4-fragen" questions={QUESTIONS.a4} predictionId={PREDICTIONS.a4.id} />
    <Hints steps={hints('a4')} />
    <NoGraphic>Ja, alles steht in der Textausgabe.</NoGraphic>
    <ErrorHelp />
  </TaskBlock>;
}
