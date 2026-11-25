// Sitzung 3 „Erste Auszählung“: Aufgaben 1 bis 4 aus dem Plan sitzung03.md (§4 bis §8), mit Fehlerhilfe.
import type { ReactNode } from 'react';
import { Badge, Known } from '../blocks/Card';
import { Hints } from '../blocks/Hints';
import { Predict } from '../blocks/Predict';
import { NoGraphic, Plenum, Steps, TaskBlock } from '../blocks/TaskBlock';
import { TryOut } from '../blocks/TryOut';
import { withCode } from '../blocks/rich';
import { SmartQuestions } from './checks';
import { ERROR_HELP, ERROR_HELP_CAPTION, ERROR_HELP_INTRO, ERROR_HELP_TITLE, HINTS, PREDICTIONS, PV01, QUESTIONS, type Rich } from './content';
import { OneNumeratorThreeBases } from './figures/Stones';
import { Workshop } from './Workshop';

/* ---------- Gemeinsame Teile ---------- */

const hints = (key: keyof typeof HINTS) => HINTS[key].map(h => <p key={h}>{withCode(h)}</p>) as [ReactNode, ReactNode, ReactNode];

function rich(parts: Rich): ReactNode {
  return parts.map((p, i) => typeof p === 'string' ? p
    : 'code' in p ? <code key={i} lang={p.en ? 'en' : undefined}>{p.code}</code>
      : <a key={i} href={p.href}>{p.text}</a>);
}

/** „Hilfe: R meldet einen Fehler“ at the end of every task (closed details with a table, German / English message). */
export function ErrorHelp() {
  return <details className="hilfe">
    <summary>{ERROR_HELP_TITLE}</summary>
    <p>{ERROR_HELP_INTRO}</p>
    <div className="s3-tabelle">
      <table className="daten voll">
        <caption>{ERROR_HELP_CAPTION}</caption>
        <thead><tr><th scope="col">R meldet</th><th scope="col">Das hilft</th></tr></thead>
        <tbody>{ERROR_HELP.map((row, i) => <tr key={i}><td>{rich(row.says)}</td><td>{rich(row.helps)}</td></tr>)}</tbody>
      </table>
    </div>
  </details>;
}

function predict(key: keyof typeof PREDICTIONS) {
  const p = PREDICTIONS[key];
  return <Predict id={p.id} prompt={p.prompt} options={p.options} />;
}

const WorkHere = () => <p>Arbeite in der Code-Werkstatt direkt hier oder in RStudio. In RStudio führst du vorher den <a href="#r1">Startblock aus „R lesen“</a> aus.</p>;
const Calculator = () => <Known session={1} what="R als Taschenrechner" />;

/* ---------- Aufgabe 1 ---------- */

export function Task1() {
  return <TaskBlock id="a1" n={1} title="Wie geht es der Wirtschaft in einem Jahr?" required
    question="Erwarten die Befragten, dass es der Wirtschaft in Deutschland in einem Jahr besser oder schlechter geht?"
    goal="Am Ende kannst du aus einer Häufigkeitstabelle ablesen, wie viele gültig geantwortet haben und wie viele Antworten fehlen, welche Erwartung am häufigsten ist (Modus) und wo die Mitte liegt (Median), und du hast einen Anteil mit R selbst zusammengezählt."
    foundationHref="#g1"
    basis={<a href="#g1">Grundlage 1, Die Häufigkeitstabelle</a>}>
    <p>Der ALLBUS 2023 fragt, wie die wirtschaftliche Lage in Deutschland in einem Jahr sein wird, verglichen mit heute. Antworten von 1 „wesentlich besser“ bis 5 „wesentlich schlechter“. Die Variable heißt ep04.</p>
    {predict('a1')}
    <WorkHere />
    <Steps>
      <li>Führe die Vorlage aus. Sie zählt aus, wie oft jede Erwartung vorkommt. <Known session={1} what="frequency()" />
        <Workshop k="a1" live /></li>
      <li>Lies die Tabelle von unten: Wie viele haben gültig geantwortet (Total valid), wie viele Antworten fehlen (Total missing), und aus welchen Gründen?</li>
      <li>Such den Modus (die Zeile mit dem größten N) und den Median (die erste Zeile, in der Cum. % die 50 erreicht).</li>
      <li>Wie viele erwarten eine schlechtere Lage? Dafür zählst du zwei Zeilen zusammen. Die Vorlage zeigt, wie das geht: Sie zählt die Valid % der beiden „besser“-Zeilen zusammen und kommt auf 16.33, genau die Zahl in Cum. % bei ETWAS BESSER. Tausch die beiden markierten Zahlen gegen die Valid % von ETWAS SCHLECHTER und WESENTL. SCHLECHTER und führe die Vorlage erneut aus. <Calculator />
        <p className="hilfe-zeile">Kommazahlen schreibst du in R mit Punkt, etwa 15.67.</p>
        <Workshop k="a1r" live /></li>
      <li><b>Deuten:</b> Welcher Satz beschreibt die Tabelle richtig? (Frage unten)</li>
    </Steps>
    <TryOut idea="Sehen die Befragten ihre eigene wirtschaftliche Lage in einem Jahr ähnlich?" workshop={<Workshop k="frei_a1" live />} />
    <SmartQuestions id="a1-fragen" questions={QUESTIONS.a1} predictionId={PREDICTIONS.a1.id} />
    <Plenum><p>Für Deutschland erwartet fast die Hälfte eine schlechtere Lage. Wie ist das für die eigene Lage? Schau in die Probier-Werkstatt (ep06) und bring eine Vermutung mit, woran der Unterschied liegen könnte.</p></Plenum>
    <Hints steps={hints('a1')} />
    <NoGraphic>Diese Aufgabe hat keine Grafik. Alle Zahlen stehen in der Ausgabe von <code>allbus %&gt;% frequency(ep04)</code>.</NoGraphic>
    <ErrorHelp />
  </TaskBlock>;
}

/* ---------- Aufgabe 2 ---------- */

export function Task2() {
  return <TaskBlock id="a2" n={2} title="Wahlabsicht: drei Prozentzahlen für dieselbe Partei" required
    question="Wie groß ist die Union, und wie groß sind die Unentschlossenen, je nachdem, wen du mitzählst?"
    goal="Am Ende kannst du für eine Partei drei Prozentzahlen nennen, jede mit ihrer Basis, und begründen, welche Zahl zu welchem Satz passt."
    foundationHref="#g2"
    basis={<a href="#g2">Grundlage 2, Fehlende Werte: Wer zählt mit?</a>}>
    <p>Der ALLBUS fragt, welche Partei man wählen würde, wenn am nächsten Sonntag Bundestagswahl wäre. Die Variable heißt pv01. Hier fehlt fast ein Viertel der Antworten, aus fünf verschiedenen Gründen.</p>
    {predict('a2')}
    <WorkHere />
    <Steps>
      <li>Führe die Vorlage aus und schau zuerst nach unten: Welche Gründe für eine fehlende Antwort gibt es, und welcher ist am häufigsten?
        <Workshop k="a2" live /></li>
      <li>Such die Zeile CDU-CSU. Lies zwei Prozentzahlen ab: Raw % (von allen Befragten) und Valid % (von den gültigen Antworten).</li>
      <li>Eine dritte Basis rechnest du selbst: Die Unentschlossenen („weiß nicht“) sollen mitzählen, weil auch sie eine Aussage machen. Die Basis ist dann 3.984 gültige plus 603 „weiß nicht“. Die Vorlage rechnet so für CDU/CSU. Tausch die markierte Zahl gegen die Zahl der „weiß nicht“-Antworten und führe sie erneut aus: Wie groß sind die Unentschlossenen auf dieser Basis? <Calculator />
        <p className="hilfe-zeile">Die Klammer sorgt dafür, dass R erst die Basis zusammenzählt und dann teilt.</p>
        <OneNumeratorThreeBases />
        <Workshop k="a2r" live /></li>
      <li><b>Deuten:</b> Eine Zeitung schreibt „Ein Viertel der Befragten würde die Union wählen.“ Passt das? (Frage unten)</li>
    </Steps>
    <TryOut idea="Bei welcher Frage sagen besonders viele „weiß nicht“? Probier die Sterbehilfe bei psychischer Krankheit (vm21) oder eine eigene Variable." workshop={<Workshop k="frei_a2" live />} />
    <SmartQuestions id="a2-fragen" questions={QUESTIONS.a2} predictionId={PREDICTIONS.a2.id} />
    <p className="hilfe-zeile">{`Ungewichtet. Mit Gewichtung kommt die CDU/CSU auf ${PV01.cduValidWeighted.toLocaleString('de-DE')} % der gültigen Antworten statt 24,80 %; warum, zeigt Sitzung 6.`}</p>
    <Plenum><p>Sollen die 603 Unentschlossenen in einer Wahlumfrage mitzählen? Und die 186 Nicht-Wahlberechtigten? Bringt je einen Satz mit, für wen eure Zahl gilt.</p></Plenum>
    <Hints steps={hints('a2')} />
    <NoGraphic>Das Bild in Schritt 3 zeigt nur die drei Basen. Alle Zahlen stehen in <code>allbus %&gt;% frequency(pv01)</code> und in der Ausgabe der Vorlage.</NoGraphic>
    <ErrorHelp />
  </TaskBlock>;
}

/* ---------- Aufgabe 3 ---------- */

export function Task3() {
  return <TaskBlock id="a3" n={3} title="Wie lange dauert Arbeitslosigkeit?" required kind="interpret"
    question="Wie lange waren Menschen ohne Arbeit, und welche Zahl beschreibt das ehrlich?"
    goal={<>Am Ende kannst du mit <code>describe()</code> Mittelwert, Median und N ablesen, sagen, wer in diesen Zahlen fehlt, und begründen, welche Zahl die typische Dauer besser beschreibt.</>}
    foundationHref="#g3"
    basis={<a href="#g3">Grundlage 3, Die Mitte: Modus, Median, Mittelwert</a>}>
    <p>Der ALLBUS fragt alle, die in Voll- oder Teilzeit berufstätig sind, ob sie in den letzten zehn Jahren arbeitslos waren. Wer ja sagt, wird gefragt, wie lange. Die Antwort steht in Wochen in der Variable dw19.</p>
    {predict('a3')}
    <WorkHere />
    <Steps>
      <li>Führe die Vorlage aus und lies Mean, Median, N und Missing ab. <Badge>describe(): neu heute</Badge>
        <p className="hilfe-zeile">R schreibt drei Nachkommastellen mit Punkt: 26.000 heißt 26.</p>
        <Workshop k="a3" live /></li>
      <li>Bei 4.732 Befragten fehlt die Dauer. Warum? <code>describe()</code> sagt es nicht. Führe die Häufigkeitstabelle aus und schau ganz nach unten. Die Tabelle ist lang, weil jede Wochenzahl eine eigene Zeile hat.
        <Workshop k="a3f" live /></li>
      <li>Vergleiche Mittelwert und Median. Was zieht den Mittelwert so weit nach oben? Ein Blick ans Ende der gültigen Zeilen hilft: Die längsten Zeiten reichen bis 520 Wochen, das sind zehn Jahre.</li>
      <li><b>Deuten:</b> Welcher Satz gehört in einen Bericht? Und zum Schluss ein Blick zurück auf <a href="#a1">Aufgabe 1</a>: Was machst du mit dem Mittelwert in der Kopfzeile von <code>frequency(ep04)</code>? (Fragen unten)</li>
    </Steps>
    <TryOut idea={<>Waren Frauen anders lange arbeitslos als Männer? Der Vorschlag wählt wie in Sitzung 2 nur die Frauen aus (<code>sex == 2</code>); für Männer tauschst du die 2 gegen eine 1. Der Name <code>frauen</code> ist nur ein Name; wenn du magst, nennst du das Objekt <code>maenner</code>, dann aber an beiden Stellen. <Known session={2} what="filter()" /></>}
      workshop={<Workshop k="frei_a3" live />} />
    <SmartQuestions id="a3-fragen" questions={QUESTIONS.a3} predictionId={PREDICTIONS.a3.id} />
    <Plenum><p>Eine Zeitung schreibt: „Arbeitslose bleiben im Schnitt über ein Jahr ohne Job.“ Was ist richtig daran, was fehlt? Denkt an den Median und daran, wer gefragt wurde: Wer gerade arbeitslos ist, steht nicht in dw19.</p></Plenum>
    <Hints steps={hints('a3')} />
    <NoGraphic>Diese Aufgabe hat keine Grafik. Alle Zahlen stehen in der Ausgabe der beiden Vorlagen.</NoGraphic>
    <ErrorHelp />
  </TaskBlock>;
}

/* ---------- Aufgabe 4 ---------- */

export function Task4() {
  return <TaskBlock id="a4" n={4} title="Wie viele liegen über dem Mittelwert?" required={false}
    question="Wie viele waren länger arbeitslos als im Mittel?"
    goal="Am Ende kannst du mit Cum. % und dem Taschenrechner ausrechnen, wie viel Prozent über dem Mittelwert liegen, und sagen, was das über die Verteilung verrät."
    foundationHref="#g4"
    basis={<a href="#g4">Grundlage 4, Liegt der Mittelwert in der Mitte?</a>}>
    <p>In <a href="#a3">Aufgabe 3</a> lag der Mittelwert der Arbeitslosigkeitsdauer bei 54,7 Wochen. Liegt die Hälfte darüber?</p>
    {predict('a4')}
    <WorkHere />
    <Steps>
      <li>Führe die Häufigkeitstabelle aus. Geh in der Spalte Value nach unten bis zur letzten Wochenzahl unter dem Mittelwert 54,7. Welche Zahl steht dort in Cum. %?
        <Workshop k="a4" live /></li>
      <li>Rechne 100 minus diese Zahl. Die Vorlage rechnet das Beispiel aus <a href="#g4">Grundlage 4</a> (Personen im Haushalt). Tausch die markierte Zahl gegen deinen Wert aus Schritt 1. <Calculator />
        <Workshop k="a4r" live /></li>
    </Steps>
    <TryOut idea="Der ALLBUS hat die Wochen auch in sechs Kategorien zusammengefasst (dw19c). In welcher Kategorie liegt dort der Median, und passt das zu 26 Wochen?" workshop={<Workshop k="frei_a4" live />} />
    <SmartQuestions id="a4-fragen" questions={QUESTIONS.a4} predictionId={PREDICTIONS.a4.id} />
    <Hints steps={hints('a4')} />
    <NoGraphic>Diese Aufgabe hat keine Grafik. Alle Zahlen stehen in <code>allbus %&gt;% frequency(dw19)</code>.</NoGraphic>
    <ErrorHelp />
  </TaskBlock>;
}
