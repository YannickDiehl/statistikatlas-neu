// Sitzung 9 „Lineare Regression“: Aufgaben 1 bis 4 aus sitzung09.md, mit Festlegen, Fragen mit Sonderfällen, Hilfen und Fehlerhilfe.
import { useState, type ReactNode } from 'react';
import { Badge, Known, MoreDetail } from '../blocks/Card';
import { Hints } from '../blocks/Hints';
import { Predict } from '../blocks/Predict';
import { NoGraphic, Plenum, Steps, TaskBlock } from '../blocks/TaskBlock';
import { TryOut } from '../blocks/TryOut';
import { useChapterState } from '../ChapterContext';
import { ErrorHelp, TaskQuestions, Workshop } from './blocks';
import { rich } from './check';
import { HINTS, PREDICTIONS, QUESTIONS } from './content';
import { GroupBy } from './figures/GroupBy';
import { LeftRight } from './figures/LeftRight';

const hints = (key: keyof typeof HINTS) => HINTS[key].map(h => <p key={h}>{rich(h)}</p>) as [ReactNode, ReactNode, ReactNode];

function predict(key: keyof typeof PREDICTIONS) {
  const p = PREDICTIONS[key];
  return <Predict id={p.id} prompt={p.prompt} options={p.options} />;
}

function questions(key: keyof typeof QUESTIONS) {
  return <TaskQuestions id={`${key}-fragen`} questions={QUESTIONS[key]} prediction={PREDICTIONS[key]} />;
}

const WHERE = <>Arbeite in der Code-Werkstatt direkt hier oder in RStudio. In RStudio führst du vorher den <a href="#r1">Startblock aus „R lesen“</a> aus.</>;

/* ---------- Aufgabe 1 ---------- */

export function Task1() {
  return <TaskBlock id="a1" n={1} title="Vertrauen in den Bundestag und Zufriedenheit mit der Demokratie" required
    question="Wie viel zufriedener mit der Demokratie sind Menschen, die dem Bundestag mehr vertrauen?"
    goal="Am Ende hast du die Gerade aus R abgelesen, kannst Konstante und Steigung in einem Satz deuten und hast eine Vorhersage von Hand ausgerechnet."
    foundationHref="#g1"
    basis={<a href="#g1">Grundlage 1, Die Gerade: Konstante und Steigung</a>}>
    <p>Der ALLBUS fragt, wie zufrieden man mit der Demokratie in Deutschland ist (<code>ps03</code>, 1 = sehr zufrieden … 6 = sehr unzufrieden), und wie viel Vertrauen man in den Bundestag hat (<code>pt03</code>, 1 = gar kein Vertrauen … 7 = großes Vertrauen). Bei ps03 heißt eine kleine Zahl „zufrieden“. Die Vorlage polt darum um: In <code>demo</code> heißt 6 „sehr zufrieden“.</p>
    {predict('a1')}
    <p>{WHERE}</p>
    <Steps>
      <li>Führe die Vorlage aus. Sie polt ps03 um und rechnet die Regression von <code>demo</code> auf pt03, gewichtet. <Known session={5} what='rec(…, rules = "rev")' /> <Known session={7} what="summary()" />
        <Workshop k="a1" live /></li>
      <li>Such in der Tabelle Coefficients die Spalte B: die Konstante in der Zeile <code>(Intercept)</code>, die Steigung in der Zeile <code>pt03</code>. Oben unter <code>- N:</code> steht, wie viele Befragte mitrechnen.
        <p className="hilfe-zeile">ps03 und pt03 standen nur in einem Teil der Fragebögen; 1.596 Befragten wurden sie nicht gestellt (TNZ: SPLIT, kennst du aus Sitzung 1). Es rechnen nur die mit, die beide Fragen gültig beantwortet haben, gut 3.500.</p></li>
      <li>Rechne die Vorhersage für Menschen mit großem Vertrauen (pt03 = 7) aus. Die Vorlage rechnet noch das Beispiel aus Grundlage 1 (Lage 4). Tausch die drei markierten Zahlen: Konstante, Steigung und den Wert 7. <Known session={1} what="R als Taschenrechner" />
        <p className="hilfe-zeile">Kommazahlen schreibst du in R mit Punkt, etwa 2.288.</p>
        <Workshop k="a1r" live /></li>
      <li>Deuten: Was bedeuten Steigung und Konstante? (Fragen a1d und a1e unten)</li>
    </Steps>
    <TryOut idea="Was passiert, wenn du die Seiten tauschst und das Vertrauen aus der Zufriedenheit vorhersagst? Ist es dieselbe Gerade, nur rückwärts gelesen?" workshop={<Workshop k="frei_a1" live />} />
    {questions('a1')}
    <Hints steps={hints('a1')} />
    <NoGraphic>Diese Aufgabe hat keine Grafik. Alle Zahlen stehen in der Ausgabe von Schritt 1 und im Ergebnis von Schritt 3.</NoGraphic>
    <ErrorHelp />
  </TaskBlock>;
}

/* ---------- Aufgabe 2 ---------- */

export function Task2() {
  return <TaskBlock id="a2" n={2} title="Vertrauen oder Schicht: Was sagt mehr?" required kind="interpret"
    question="Sagt das Vertrauen in den Bundestag die Zufriedenheit mit der Demokratie besser vorher als die eigene Schicht?"
    goal="Am Ende kannst du R² und den typischen Fehler einer Regression lesen und begründen, warum eine pro Stufe fast gleich steile Gerade viel schlechter vorhersagen kann."
    foundationHref="#g2"
    basis={<a href="#g2">Grundlage 2, Wie gut passt die Gerade?</a>}>
    <p>In Aufgabe 1 hast du die Gerade für das Vertrauen in den Bundestag gerechnet. Jetzt vergleichst du sie mit einer zweiten Frage: Welcher Schicht rechnen sich die Befragten zu? (<code>id02</code>, 1 = Unterschicht, 2 = Arbeiterschicht, 3 = Mittelschicht, 4 = obere Mittelschicht, 5 = Oberschicht). Eine hohe Zahl heißt hier schon „höher“; umpolen musst du id02 nicht.</p>
    {predict('a2')}
    <p>{WHERE}</p>
    <Steps>
      <li>Führe die Vorlage aus, wie sie ist. Sie rechnet noch einmal die Regression aus Aufgabe 1 (das Umpolen steht wieder drin, weil jede Werkstatt frisch startet). Lies im Abschnitt Model Summary R Square und Std. Error of the Estimate, in Descriptive Statistics die Standardabweichung von demo.
        <Workshop k="a2" live /></li>
      <li>Tausch die markierte Stelle gegen id02 und führe die Vorlage erneut aus. Lies wieder R Square und dazu die Steigung B in der Zeile id02.</li>
      <li>Vergleiche die beiden Ausgaben: erst die Steigungen B, dann R² und den typischen Fehler. Was passt nicht zusammen? (Frage a2f)</li>
    </Steps>
    <TryOut idea="Sagt die Wirtschaftslage in Deutschland (ep01, 1 = sehr gut … 5 = sehr schlecht) die Zufriedenheit besser vorher als die Schicht? Und warum ist ihre Steigung negativ?" workshop={<Workshop k="frei_a2" live />} />
    {questions('a2')}
    <Plenum><p style={{ margin: '4px 0 0' }}>Das Vertrauen in den Bundestag sagt die Zufriedenheit mit der Demokratie gut vorher. Ist das eine Erklärung, oder fragen beide Fragen fast dasselbe? Bringt ein Argument für jede Seite mit.</p></Plenum>
    <Hints steps={hints('a2')} />
    <NoGraphic>Diese Aufgabe hat keine Grafik. Alle Zahlen stehen in den beiden Ausgaben.</NoGraphic>
    <ErrorHelp />
  </TaskBlock>;
}

/* ---------- Aufgabe 3 ---------- */

export function Task3() {
  return <TaskBlock id="a3" n={3} title="Für wen liegt die Gerade daneben?" required
    question="Sagt das Vertrauen in den Bundestag die Zufriedenheit für alle gleich gut vorher, oder für manche viel schlechter?"
    goal="Am Ende hast du für jede Person das Residuum gebildet, seine Streuung je Stufe des Vertrauens verglichen und den Levene-Test gelesen. Du kannst sagen, ob die Voraussetzung gleicher Fehlervarianz hält und für wen die Gerade am weitesten danebenliegt."
    foundationHref="#g3"
    basis={<a href="#k3a">Grundlage 3a, Gleiche Fehlervarianz</a>}>
    {predict('a3')}
    <p>{WHERE}</p>
    <Steps>
      <li>Die Vorlage bildet für jede Person die Vorhersage (Konstante + Steigung mal pt03) und das Residuum (beobachtet minus vorhergesagt). Noch stehen dort die Zahlen aus Grundlage 1. Tausch die beiden markierten Zahlen gegen Konstante und Steigung aus Aufgabe 1 und führe die Vorlage aus. <Known session={5} what="mutate()" /> <Badge>group_by(): neu heute</Badge> <Badge>levene_test(): neu heute</Badge>
        <p className="hilfe-zeile">Konstante 2.288, Steigung 0.465, mit Punkt.</p>
        <Workshop k="a3" live />
        <div className="box-gruen s9-erklaer">
          <p><b>Neu heute:</b> <code>group_by(pt03)</code> teilt die Befragten nach ihrer Antwort bei pt03 in sieben Gruppen. Alles, was danach kommt, rechnet R für jede Gruppe getrennt. <code>describe()</code> gibt darum sieben kleine Tabellen aus, eine je Stufe, in der Reihenfolge 1 bis 7. Nur 1 und 7 haben einen Namen (GAR KEIN VERTRAUEN, GROSSES VERTRAUEN); die Stufen 2 bis 6 zeigt R als „..“. N ist gewichtet gezählt. <code>drop_na(residuum)</code> lässt alle weg, für die es kein Residuum gibt, weil ps03 oder pt03 fehlt (kennst du aus Sitzung 4).</p>
        </div>
        <GroupBy /></li>
      <li>Lies in jeder der sieben Tabellen die Spalte SD: So stark streut das Residuum in dieser Stufe. Wo ist sie am größten, wo am kleinsten?
        <MoreDetail summary="Warum ändern Konstante und Steigung die SD nicht?">
          <p>Innerhalb einer Stufe sagt die Gerade allen denselben Wert vorher. Die SD des Residuums ist dort die SD der Zufriedenheit selbst. Darum stimmen die SD-Werte schon, bevor du die Zahlen tauschst; nur die Mittelwerte (Mean) brauchen die richtige Gerade.</p>
        </MoreDetail></li>
      <li>Lies die letzte Zeile der Ausgabe: den Levene-Test. „variances unequal“ heißt: Die Streuungen sind nicht gleich. Prüf dazu die Größe mit der Faustregel aus Sitzung 7: Ist die größte SD mehr als doppelt so groß wie die kleinste? <Known session={7} what="Faustregel" /></li>
      <li>Deuten: Was heißt das für einen Bericht? (Frage a3e)</li>
    </Steps>
    <TryOut idea={<>Wie sieht die Streuung des Residuums je Stufe als Boxplots aus? <code>to_label()</code> schreibt die Stufen an die Achse (kennst du aus Sitzung 4).</>} workshop={<Workshop k="frei_a3" live />} />
    {questions('a3')}
    <Plenum><p style={{ margin: '4px 0 0' }}>Die Gerade liegt bei Menschen ohne Vertrauen am weitesten daneben. Warum könnte das so sein? Und was heißt das, wenn eine Zeitung schreibt: „Wer dem Bundestag vertraut, ist zufrieden mit der Demokratie“?</p></Plenum>
    <Hints steps={hints('a3')} />
    <NoGraphic>Diese Aufgabe braucht keine Grafik. Das Bild zu Schritt 1 hat eine Textfassung; alle Zahlen stehen in der Ausgabe.</NoGraphic>
    <ErrorHelp />
  </TaskBlock>;
}

/* ---------- Aufgabe 4 ---------- */

/** Picture for step 3 of task 4: shown after „Antworten prüfen“ or via „Bild zeigen“, so it does not give the answers away. */
function LeftRightPicture() {
  const { state } = useChapterState();
  const [shown, setShown] = useState(false);
  const checked = QUESTIONS.a4.some(q => (state.answers[q.id] ?? '').trim() !== '');
  if (shown || checked) return <LeftRight />;
  return <div className="reihe-knoepfe"><button type="button" className="knopf hell" onClick={() => setShown(true)}>Bild zeigen</button>
    <span className="hilfe-zeile">Das Bild erscheint auch, sobald du deine Antworten prüfst.</span></div>;
}

export function Task4() {
  return <TaskBlock id="a4" n={4} title="Links, Mitte, rechts" required={false} kind="interpret"
    question="Sind Menschen umso weniger zufrieden mit der Demokratie, je weiter rechts sie sich einstufen?"
    goal="Am Ende kannst du eine Gerade mit den Mittelwerten je Stufe vergleichen und sagen, ob sie den Zusammenhang richtig beschreibt."
    foundationHref="#g4"
    basis={<a href="#g4">Grundlage 4, Gerade oder Kurve?</a>}>
    <p>Die Befragten stufen sich politisch selbst ein, von 1 (links) bis 10 (rechts) (<code>pa01</code>).</p>
    {predict('a4')}
    <p>{WHERE}</p>
    <Steps>
      <li>Führe die Vorlage aus. Sie rechnet die Gerade und die Mittelwerte von demo für jede Stufe von pa01.
        <p className="hilfe-zeile">Die zehn Tabellen stehen in der Reihenfolge 1 bis 10; nur 1 (LINKS) und 10 (RECHTS) haben einen Namen.</p>
        <Workshop k="a4" live /></li>
      <li>Rechne die Vorhersage der Geraden für „ganz links“ (pa01 = 1). Tausch die drei markierten Zahlen. Die Steigung ist negativ: Schreib sie mit Minus.
        <p className="hilfe-zeile"><code>4.857 + -0.140 * 1</code> und <code>4.857 - 0.140 * 1</code> ergeben dasselbe.</p>
        <Workshop k="a4r" live /></li>
      <li>Vergleiche: Vorhersage für ganz links gegen den Mittelwert der ersten Tabelle (LINKS).
        <LeftRightPicture /></li>
    </Steps>
    <TryOut idea="Zeigt die Lebenszufriedenheit dasselbe Muster nach Links-rechts?" workshop={<Workshop k="frei_a4" live />} />
    {questions('a4')}
    <Hints steps={hints('a4')} />
    <NoGraphic>Alle Zahlen stehen in der Ausgabe von Schritt 1 und im Ergebnis von Schritt 2; das Bild hat eine Textfassung.</NoGraphic>
    <ErrorHelp />
  </TaskBlock>;
}
