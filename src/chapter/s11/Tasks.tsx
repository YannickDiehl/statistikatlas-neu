// Sitzung 11 „Logistische Regression“: Aufgaben 1 bis 4 aus sitzung11.md (§4 bis §8), mit Sonderfall-Rückmeldung und Fehlerhilfe.
import type { ReactNode } from 'react';
import { Badge, Known } from '../blocks/Card';
import { Hints } from '../blocks/Hints';
import { Predict } from '../blocks/Predict';
import { NoGraphic, Plenum, Steps, TaskBlock } from '../blocks/TaskBlock';
import { TryOut } from '../blocks/TryOut';
import { withCode } from '../blocks/rich';
import { CROSSTAB, HINTS, PREDICTIONS, QUESTIONS } from './content';
import { Ceiling } from './figures/Topic1';
import { PersonAB } from './figures/Topic3';
import { ErrorHelp, Resolution, SpecialQuestions, Workshop, useAllAnswered } from './ui';

const hints = (key: keyof typeof HINTS) => HINTS[key].map(h => <p key={h}>{withCode(h)}</p>) as [ReactNode, ReactNode, ReactNode];

function predict(key: keyof typeof PREDICTIONS) {
  const p = PREDICTIONS[key];
  return <Predict id={p.id} prompt={p.prompt} options={p.options} />;
}

/** Questions, then the resolution of the prediction („Tatsächlich …“). */
function Check({ k }: { k: keyof typeof QUESTIONS }) {
  const p = PREDICTIONS[k];
  return <>
    <SpecialQuestions id={`${k}-fragen`} questions={QUESTIONS[k]} predictionId={p.id} />
    <Resolution predictionId={p.id} questions={QUESTIONS[k]} text={p.resolution} />
  </>;
}

/** Table „umgepolt“ under step 2 of task 1 (also used in task 3). */
function Reversed() {
  return <table className="daten" id="umgepolt">
    <caption>umgepolt</caption>
    <thead><tr><th scope="col">Antwort</th><th scope="col"><code>pe09</code></th><th scope="col"><code>pflicht</code></th></tr></thead>
    <tbody>{[...CROSSTAB].reverse().map(r => <tr key={r.pflicht}><td>{r.answer}</td><td>{String(r.pe09)}</td><td>{String(r.pflicht)}</td></tr>)}</tbody>
  </table>;
}

/* ---------- Aufgabe 1 ---------- */

export function Task1() {
  return <TaskBlock id="a1" n={1} title="Wer will wählen gehen?" required
    question="Wie hängt die Absicht zu wählen damit zusammen, ob jemand Wählen für eine Bürgerpflicht hält?"
    goal="Am Ende hast du die Wahlabsicht als 0/1-Variable gebildet, liest in einer Kreuztabelle, wie der Anteil der Wählenden mit dem Pflichtgefühl steigt, und kannst mit zwei kleinen Rechnungen zeigen, warum eine Gerade hier an ihre Grenze stößt und was eine Chance ist."
    foundationHref="#g1"
    basis={<a href="#g1">Grundlage 1, Ja oder nein: warum keine Gerade?</a>}>
    <p>Der ALLBUS fragt, welche Partei man wählen würde, wenn am nächsten Sonntag Bundestagswahl wäre (<code>pv01</code>). Eine Antwort ist „würde nicht wählen“ (Code 91). Außerdem sollten die Befragten sagen, wie sehr sie zustimmen, dass die Beteiligung an Wahlen eine Bürgerpflicht ist (<code>pe09</code>, 1 = stimme voll zu bis 4 = stimme gar nicht zu). Diese Frage wurde nur einem Teil der Befragten gestellt, gut zwei Dritteln (1.596 haben TNZ: SPLIT, kennst du aus Sitzung 1). Es geht um die geäußerte Absicht, nicht um tatsächliches Wählen.</p>
    {predict('a1')}
    <p>Arbeite in der Code-Werkstatt direkt hier oder in RStudio. In RStudio führst du vorher den Startblock aus <a href="#r1">„R lesen“</a> aus.</p>
    <Steps>
      <li>Bilde die 0/1-Variable <code>waehlen</code> und zähl sie aus. <code>rec()</code> macht aus allen Parteien (1 bis 90) eine 1 und aus „würde nicht wählen“ (91) eine 0; alles andere wird NA. Führe die Vorlage aus. <Known session={5} what="rec() in mutate()" /> <Known session={6} what="weights" />
        <Workshop k="a1f" live />
        <p className="hilfe-zeile">In Sitzung 5 hast du <code>nichtwahl</code> andersherum gebildet (91 = 1). Heute ist Wählen die 1, weil das Modell die Wahrscheinlichkeit der 1 vorhersagt.</p></li>
      <li>Jetzt die Kreuztabelle: Wie viel Prozent jeder Stufe wollen wählen? <code>pe09</code> läuft von „stimme voll zu“ (1) bis „stimme gar nicht zu“ (4). Damit ein höherer Wert mehr Pflichtgefühl heißt, polt die Vorlage um: <code>pflicht</code> läuft von 1 = stimme gar nicht zu bis 4 = stimme voll zu. Führe die Vorlage aus und lies die Zeilen <code>row %</code> in der Spalte „würde wählen“. <Known session={5} what="crosstab() mit Zeilenprozent" />
        <Workshop k="a1k" live />
        <Reversed />
        <figure className="ebild">
          <Ceiling />
          <figcaption>Zu Schritt 2 und 3: Je näher ein Anteil an 100 % liegt, desto weniger kann die nächste Stufe noch bringen. <span>Die Säulen sind ein Beispiel, nicht die Zahlen deiner Kreuztabelle.</span></figcaption>
        </figure></li>
      <li>Wie viele Prozentpunkte bringt eine Stufe mehr Pflichtgefühl? Die Vorlage rechnet die erste Stufe vor: von „stimme gar nicht zu“ (61.4) zu „stimme eher nicht zu“ (78.3). Tausch die beiden markierten Zahlen gegen die Werte für die letzte Stufe, von „stimme eher zu“ zu „stimme voll zu“. <Known session={1} what="R als Taschenrechner" />
        <Workshop k="a1r" live />
        <p className="hilfe-zeile">Kommazahlen schreibst du in R mit Punkt, die größere Zahl zuerst.</p></li>
      <li>Rechne einen Anteil in eine Chance um (<a href="#k1c">Grundlage 1c</a>): Prozent „würde wählen“ geteilt durch Prozent „würde nicht wählen“. Die Vorlage rechnet „stimme gar nicht zu“ vor. Tausch die Zahlen gegen die Zeile „stimme voll zu“.
        <Workshop k="a1c" live /></li>
    </Steps>
    <TryOut idea="Was sagt eine Gerade (lineare Regression aus Sitzung 9) für die vier Stufen voraus?" workshop={<Workshop k="frei_a1" live />} />
    <Check k="a1" />
    <Hints steps={hints('a1')} />
    <NoGraphic>Alle Zahlen stehen in den Ausgaben von <code>frequency()</code> und <code>crosstab()</code>; Bild B4 hat eine Textfassung.</NoGraphic>
    <ErrorHelp />
  </TaskBlock>;
}

/* ---------- Aufgabe 2 ---------- */

export function Task2() {
  return <TaskBlock id="a2" n={2} title="Was heißt Exp(B) für das Pflichtgefühl?" required
    question="Wie stark hängt die Absicht zu wählen mit dem Pflichtgefühl zusammen, wenn man das politische Interesse berücksichtigt?"
    goal="Am Ende hast du ein logistisches Modell gewichtet geschätzt und kannst in einem Satz sagen, was Exp(B) für das Pflichtgefühl und für das Interesse heißt, und warum nur gut die Hälfte der Befragten im Modell steckt."
    foundationHref="#g2"
    basis={<a href="#g2">Grundlage 2, Das Modell: B und Exp(B)</a>}>
    <p>Du erklärst <code>waehlen</code> (1 = würde wählen) aus Aufgabe 1 mit zwei Prädiktoren: dem Pflichtgefühl (<code>pflicht</code>, 1 = stimme gar nicht zu bis 4 = stimme voll zu) und dem politischen Interesse (<code>pa02a</code>, 1 = sehr stark bis 5 = überhaupt nicht, kennst du aus Sitzung 2). Auch das Interesse wird umgepolt: <code>interesse</code> läuft von 1 = überhaupt nicht bis 5 = sehr stark. Höhere Werte heißen also mehr Pflichtgefühl und mehr Interesse.</p>
    {predict('a2')}
    <Steps>
      <li>Führe die Vorlage aus. Sie bildet die Variablen wie in Aufgabe 1 und schätzt ein Modell, zunächst nur mit dem Pflichtgefühl. Lies in „Variables in the Equation“ Exp(B) für <code>pflicht</code> (3.888). <Badge>logistic_regression(): neu heute</Badge> <Badge>mutate() mit rec(): wie in Aufgabe 1</Badge>
        <Workshop k="a2" live /></li>
      <li>Nimm das Interesse dazu: Ersetze die markierte Stelle durch <code>pflicht + interesse</code> und führe die Vorlage erneut aus. Mehrere Prädiktoren mit <code>+</code> kennst du aus Sitzung 10. Lies zuerst „Dependent Variable Encoding“, dann in „Variables in the Equation“ beide Zeilen.
        <p className="hilfe-zeile">Exp(B) des Pflichtgefühls ändert sich ein wenig, wenn das Interesse dazukommt: Jetzt gilt es „bei gleichem Interesse“.</p></li>
      <li>Wie viel Prozent mehr Chance bringt eine Stufe mehr Interesse? Die Vorlage rechnet das Beispiel aus <a href="#k2b">Grundlage 2</a> vor (Alter, 0.927). Tausch die markierte Zahl gegen Exp(B) des Interesses. <Known session={1} what="R als Taschenrechner" />
        <Workshop k="a2r" live /></li>
      <li>Deuten: Welcher Satz beschreibt das Pflichtgefühl richtig? (Frage a2c)</li>
    </Steps>
    <TryOut idea="Bleibt der Zusammenhang, wenn auch das Alter im Modell ist?" workshop={<Workshop k="frei_a2" live />} />
    <Check k="a2" />
    <Hints steps={hints('a2')} />
    <NoGraphic>Diese Aufgabe hat keine Grafik. Alle Zahlen stehen in der Ausgabe von <code>summary()</code>.</NoGraphic>
    <ErrorHelp />
  </TaskBlock>;
}

/* ---------- Aufgabe 3 ---------- */

/** B10 appears only when every question of task 3 is answered, so it does not give the answers away. */
function AfterCheck() {
  const checked = useAllAnswered(QUESTIONS.a3);
  return <div aria-live="polite">{checked ? <figure className="ebild">
    <PersonAB />
    <figcaption>Person A und Person B bekommen eine Stufe mehr Pflichtgefühl. <span>Die Kurven sind mit den gerundeten Zahlen aus Aufgabe 2 gezeichnet, die Punkte stammen aus <code>predict()</code>.</span></figcaption>
  </figure> : null}</div>;
}

export function Task3() {
  return <TaskBlock id="a3" n={3} title="Was heißt das in Prozent?" required
    question="Was bringt eine Stufe mehr Pflichtgefühl, in Prozent ausgedrückt, und bringt sie allen gleich viel?"
    goal="Am Ende hast du für zwei Beispielpersonen vorhergesagt, wie wahrscheinlich sie wählen wollen, mit und ohne eine Stufe mehr Pflichtgefühl, und kannst erklären, warum derselbe Faktor 3,77 verschieden viele Prozentpunkte bringt. Du kennst den AME als eine Zahl für alle."
    foundationHref="#g3"
    basis={<a href="#g3">Grundlage 3, Vorhergesagte Wahrscheinlichkeiten</a>}>
    <p>Zwei Beispielpersonen. Person A stimmt „eher nicht zu“, dass Wählen Bürgerpflicht ist, und interessiert sich „wenig“ für Politik. Person B stimmt „eher zu“ und interessiert sich „stark“. Auf den umgepolten Skalen (<a href="#umgepolt">Tabelle in Aufgabe 1</a>; Interesse: 1 = überhaupt nicht, 2 = wenig, 3 = mittel, 4 = stark, 5 = sehr stark) hat A also <code>pflicht</code> 2 und <code>interesse</code> 2, B hat <code>pflicht</code> 3 und <code>interesse</code> 4. Die Zahlen des Modells kennst du aus Aufgabe 2: Konstante −2.154, B für pflicht 1.326, B für interesse 0.340.</p>
    {predict('a3')}
    <Steps>
      <li>Rechne Person A von Hand, wie in <a href="#k3a">Grundlage 3a</a>. Die Vorlage rechnet eine Person mit 1 und 1 (stimme gar nicht zu, überhaupt kein Interesse). Setz an den beiden markierten Stellen die Werte von Person A ein und führe die Vorlage aus. R zeigt nacheinander Logit, Chance und Wahrscheinlichkeit. <Badge>exp(): neu heute</Badge>
        <Workshop k="a3h" live />
        <p className="hilfe-zeile">Die erste markierte Stelle ist das Pflichtgefühl, die zweite das Interesse.</p></li>
      <li>Jetzt lässt du R rechnen, für vier Personen auf einmal: A, A mit einer Stufe mehr Pflichtgefühl, B und B mit einer Stufe mehr. Die Vorlage schätzt das Modell wie in Aufgabe 2 und baut die vier Personen mit <code>tibble()</code>; jede Spalte zählt mit <code>c()</code> vier Werte auf, einen je Person. Die ersten zwei Personen stehen schon da. Setz an den markierten Stellen die Werte für B (pflicht 3, interesse 4) und B mit einer Stufe mehr (pflicht 4, interesse 4) ein. <Badge>tibble(), predict(): neu heute</Badge> <Badge>Modell: wie in Aufgabe 2</Badge>
        <Workshop k="a3p" live />
        <p className="hilfe-zeile">Unter 1 bis 4 stehen die Wahrscheinlichkeiten der vier Personen, als Anteil: 0.76 heißt 76 %. Prozentpunkte: Person 2 minus Person 1 und Person 4 minus Person 3, jeweils mal 100.</p></li>
      <li>Eine Zahl für alle: Führe die Vorlage aus und lies den AME des Pflichtgefühls. <Badge>marginal_effects(): neu heute</Badge>
        <Workshop k="a3m" live /></li>
    </Steps>
    <TryOut idea="Wie sieht die S-Kurve des Pflichtgefühls aus, wenn das Interesse mittel ist?" workshop={<Workshop k="frei_a3" live />} />
    <Check k="a3" />
    <AfterCheck />
    <Plenum><p style={{ margin: '4px 0 0' }}>Welche Zahl gehört in eine Pressemitteilung: 3,77, +16,0, +2,9 oder +5,4 Prozentpunkte? Bring eine Antwort mit Begründung mit und einen Satz, wie eine Zeitung die Zahl falsch verstehen könnte.</p></Plenum>
    <Hints steps={hints('a3')} />
    <NoGraphic>Alle Zahlen stehen in den Ausgaben der drei Vorlagen; Bild B10 hat eine Textfassung.</NoGraphic>
    <ErrorHelp />
  </TaskBlock>;
}

/* ---------- Aufgabe 4 ---------- */

export function Task4() {
  return <TaskBlock id="a4" n={4} title="Erkennt das Modell, wer nicht wählen will?" required={false} kind="interpret"
    question="Wie gut sagen Pflichtgefühl und Interesse die Wahlabsicht vorher?"
    goal="Am Ende kannst du die Trefferquote des Modells mit der einfachsten Regel vergleichen, das −2LL des Nullmodells ausrechnen und Nagelkerke R² richtig in einen Satz bringen."
    foundationHref="#g4"
    basis={<a href="#g4">Grundlage 4, Wie gut ist das Modell?</a>}>
    {predict('a4')}
    <Steps>
      <li>Führe die Vorlage aus: das Modell aus Aufgabe 2, diesmal mit dem Blick auf Classification Table, Model Summary und Omnibus Tests. <Badge>Modell: wie in Aufgabe 2</Badge>
        <Workshop k="a4" live /></li>
      <li>Wie oft läge die Regel „alle wählen“ richtig? Die Vorlage rechnet das Smartphone-Beispiel aus <a href="#k4a">Grundlage 4a</a>. Tausch die drei Zahlen: die beiden Zellen der Zeile „würde wählen“ und die Summe aller vier Zellen der Classification Table.
        <Workshop k="a4r" live />
        <p className="hilfe-zeile">Die Summe aller vier Zellen ist N oben in der Ausgabe (gewichtet).</p></li>
      <li>Rechne das −2LL des Nullmodells aus (<a href="#k4b">Grundlage 4b</a>). Tausch die Zahlen gegen −2 Log Likelihood (Model Summary) und Chi-square (Omnibus Tests) deines Modells.
        <Workshop k="a4l" live /></li>
    </Steps>
    <TryOut idea="Wie gut ist ein Modell nur mit dem Interesse? Vergleich die Kopfzeile mit deinem Modell." workshop={<Workshop k="frei_a4" live />} />
    <Check k="a4" />
    <Hints steps={hints('a4')} />
    <NoGraphic>Diese Aufgabe hat keine Grafik. Alle Zahlen stehen in der Ausgabe von <code>summary()</code>.</NoGraphic>
    <ErrorHelp />
  </TaskBlock>;
}
