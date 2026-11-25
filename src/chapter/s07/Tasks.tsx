// Sitzung 7 „Mittelwerte vergleichen“: Aufgaben 1 bis 4 aus sitzung07.md §4–§7, mit Tipp-Vergleich und Fehlerhilfe.
import type { ReactNode } from 'react';
import { Hints } from '../blocks/Hints';
import { Predict } from '../blocks/Predict';
import { Questions } from '../blocks/Questions';
import { NoGraphic, Plenum, Steps, TaskBlock } from '../blocks/TaskBlock';
import { TryOut } from '../blocks/TryOut';
import { withCode } from '../blocks/rich';
import { judgeWithFeedback } from '../answers';
import { useChapterState } from '../ChapterContext';
import { A1_MODEL, A1_SHORT, ERROR_HELP, ERROR_HELP_CAPTION, ERROR_HELP_TITLE, HINTS, PREDICTIONS, QUESTIONS, type Rich } from './content';
import { ReadAnova } from './figures/ROutput';
import { Workshop } from './Workshop';

type Key = keyof typeof PREDICTIONS;

/* ---------- Gemeinsame Teile ---------- */

const hints = (key: Key, extra?: ReactNode) =>
  HINTS[key].map((h, i) => <div key={h}><p>{withCode(h)}</p>{i === 2 ? extra : null}</div>) as [ReactNode, ReactNode, ReactNode];

function rich(parts: Rich): ReactNode {
  return parts.map((p, i) => typeof p === 'string' ? p
    : 'code' in p ? <code key={i}>{p.code}</code>
      : <a key={i} href={p.href}>{p.text}</a>);
}

/** „Hilfe: R meldet einen Fehler“ at the end of every task (closed details with a three-column table). */
export function ErrorHelp() {
  return <details className="hilfe">
    <summary>{ERROR_HELP_TITLE}</summary>
    <table className="daten">
      <caption>{ERROR_HELP_CAPTION}</caption>
      <thead><tr><th scope="col">R meldet</th><th scope="col">Was passiert ist</th><th scope="col">Was du tust</th></tr></thead>
      <tbody>{ERROR_HELP.map((row, i) => <tr key={i}><td>{rich(row.says)}</td><td>{rich(row.why)}</td><td>{rich(row.helps)}</td></tr>)}</tbody>
    </table>
  </details>;
}

function predict(key: Key) {
  const p = PREDICTIONS[key];
  return <Predict id={p.id} prompt={p.prompt} options={p.options} />;
}

/**
 * Once no question of the task is open: the prediction set before, compared with the data (wording per choice from the plan).
 * Local to session 7: the shared Questions block only quotes the prediction („Deine Festlegung vorher war: …“).
 */
export function TipCompare({ task }: { task: Key }) {
  const { state } = useChapterState();
  const p = PREDICTIONS[task], tip = state.predictions[p.id];
  const noneOpen = QUESTIONS[task].every(q => judgeWithFeedback(q, state.answers[q.id]).result !== 'open');
  const text = tip && noneOpen ? p.compare[tip] ?? `Deine Festlegung vorher war: ${tip}.` : '';
  return <p className={`rueck${text ? ' fest' : ''} s07-tipp`} id={`${task}-tipp-vergleich`} aria-live="polite">{text}</p>;
}

function Answers({ task }: { task: Key }) {
  return <>
    <Questions id={`${task}-fragen`} questions={QUESTIONS[task]} />
    <TipCompare task={task} />
  </>;
}

const BEFORE_STEPS = <p className="hilfe-zeile">Arbeite in der Code-Werkstatt direkt hier oder in RStudio. In RStudio führst du vorher den <a href="#r1">Startblock in „R lesen“</a> aus.</p>;

/* ---------- Aufgabe 1 ---------- */

export function Task1() {
  return <TaskBlock id="a1" n={1} title="Vertrauen in den Bundestag" required
    question="Vertrauen Menschen mit Abitur dem Bundestag mehr als Menschen ohne Abitur?"
    goal="Am Ende kannst du sagen, um wie viel sich die beiden Gruppen im Mittel unterscheiden, ob der Unterschied über den Zufall hinausgeht (t, p, Konfidenzintervall) und wie groß er ist (Hedges' g)."
    foundationHref="#g1"
    basis={<><a href="#g1">Grundlage 1 (Zufall oder Unterschied?)</a> und <a href="#r2">„Ein t-Test in R“ in Vorweg</a></>}>
    <p>Der ALLBUS fragt: <em>„Wie viel Vertrauen haben Sie in den Bundestag?“</em> (<code>pt03</code>, 1 = gar kein Vertrauen bis 7 = großes Vertrauen). Gestellt wurde die Frage nur etwa zwei Dritteln der Befragten (1.596 haben sie nicht bekommen, im Datensatz „TNZ: SPLIT“), darum haben gut 3.500 Befragte geantwortet. Als „mit Abitur“ zählt hier, wer die Fachhochschulreife oder die allgemeine Hochschulreife hat (<code>educ</code> 4 oder 5), als „ohne Abitur“, wer keinen Abschluss, einen Haupt- oder Volksschulabschluss oder die Mittlere Reife hat (<code>educ</code> 1 bis 3). Wer noch zur Schule geht oder einen anderen Abschluss hat, fällt heraus.</p>
    {predict('a1')}
    {BEFORE_STEPS}
    <Steps>
      <li><b>Gruppen bilden und testen (Kurzfassung).</b> Die Vorlage bildet mit <code>rec()</code> die Variable <code>abitur</code> (kennst du aus Sitzung 5): <code>1:3=0</code> heißt, die Codes 1 bis 3 werden zu 0 „ohne Abitur“, <code>4:5=1</code> macht aus 4 und 5 die 1 „mit Abitur“, alles andere fehlt. Dann rechnet sie gleich einen t-Test. Führe sie einmal aus, wie sie ist: Sie vergleicht das Alter. Tausch dann die markierte Stelle <code>age</code> gegen <code>pt03</code> und führe sie noch einmal aus. Lies die Zeile, die mit <code>t(</code> beginnt: t, p und g kennst du aus <a href="#g1">Grundlage 1</a>.
        <Workshop k="a1_kurz" live />
        <p className="hilfe-zeile">Kontrolle vor dem Tausch: <code>{A1_SHORT.age}</code>. Mit Abitur sind die Befragten im Mittel jünger.</p></li>
      <li><b>Die ganze Tabelle.</b> Für die Mittelwerte und das Konfidenzintervall hängst du <code>summary()</code> an. Die zweite Vorlage ist schon fertig. Führe sie aus und lies sie mit der <a href="#r2">Lesehilfe aus „R lesen“</a>: zuerst die Gruppen, dann die Zeile „Equal variances not assumed“, dann die Effektstärke.
        <Workshop k="a1_tabelle" live /></li>
      <li><b>Deuten.</b> Beantworte die Fragen unten. Sie gehen die Ausgabe in der Reihenfolge eines Berichts durch: Welche Gruppe liegt höher, um wie viel, geht das über den Zufall hinaus, wo liegt der Unterschied plausibel, wie groß ist er? Wenn du fertig bist und Zeit hast: Schreib daraus einen Satz wie in einem Bericht (fürs Plenum).</li>
    </Steps>
    <TryOut idea={<>Gilt der Unterschied auch beim Vertrauen in die Polizei (<code>pt14</code>)?</>} workshop={<Workshop k="frei_a1" live />} />
    <Answers task="a1" />
    <Plenum><p style={{ margin: '4px 0 0' }}>Bringt euren Bericht-Satz aus Schritt 3 mit. Ist ein Unterschied von 0,66 Punkten auf einer Skala von 1 bis 7 politisch bedeutsam? Und erklärt das Abitur den Unterschied, oder könnte etwas anderes dahinterstecken (etwa das Alter, siehe Schritt 1 vor dem Tausch)?</p></Plenum>
    <Hints steps={hints('a1', <p><b>Musterformulierung:</b> {A1_MODEL}</p>)} />
    <NoGraphic>Alle Antworten stehen in der Textausgabe von <code>summary()</code>; diese Aufgabe braucht keine Grafik.</NoGraphic>
    <ErrorHelp />
  </TaskBlock>;
}

/* ---------- Aufgabe 2 ---------- */

export function Task2() {
  return <TaskBlock id="a2" n={2} title="Macht Abitur zufriedener?" required={false} kind="interpret"
    question="Wie groß ist der Unterschied in der Lebenszufriedenheit zwischen Menschen mit und ohne Abitur, und hängt die Antwort davon ab, wen man fragt?"
    goal="Am Ende kannst du prüfen, ob ein signifikanter Unterschied auch groß ist, und erklären, wann die Welch-Zeile ein breiteres Intervall zeigt."
    foundationHref="#g2"
    basis={<a href="#g2">Grundlage 2 (Signifikant, groß oder beides?)</a>}>
    <p>Du vergleichst die Lebenszufriedenheit (<code>ls01</code>, 0 bis 10) zwischen ohne und mit Abitur, einmal bei allen Befragten und einmal nur bei den unter 30-Jährigen. Die Gruppen bildest du wie in <a href="#a1">Aufgabe 1</a>.</p>
    {predict('a2')}
    {BEFORE_STEPS}
    <Steps>
      <li><b>Alle Befragten.</b> Führe die Vorlage aus. Lies Unterschied, p und Hedges&apos; g.
        <Workshop k="a2_alle" live /></li>
      <li><b>Nur die unter 30-Jährigen.</b> Die Vorlage hat eine Zeile mehr: <code>filter(age &lt; 30)</code> (kennst du aus Sitzung 2). Vergleiche die beiden Zeilen „Equal variances assumed“ und „not assumed“: Wo ist das Intervall breiter?
        <Workshop k="a2_jung" live /></li>
    </Steps>
    <TryOut idea="Wie sieht es bei den Befragten ab 65 aus?" workshop={<Workshop k="frei_a2" live />} />
    <Answers task="a2" />
    <Hints steps={hints('a2')} />
    <NoGraphic>Alle Antworten stehen in der Textausgabe von <code>summary()</code>; diese Aufgabe braucht keine Grafik.</NoGraphic>
    <ErrorHelp />
  </TaskBlock>;
}

/* ---------- Aufgabe 3 ---------- */

export function Task3() {
  return <TaskBlock id="a3" n={3} title="Links, rechts und der Wohnort" required
    question="Stehen Menschen in der Großstadt politisch weiter links als in Kleinstadt und Dorf?"
    goal="Am Ende kannst du sagen, ob sich die Wohnorte in der Links-rechts-Einstufung unterscheiden (F, p), wie stark (η²) und welche Wohnorte genau (Tukey), und warum ein großer Unterschied in einer kleinen Gruppe nicht signifikant sein kann."
    foundationHref="#g3"
    basis={<a href="#g3">Grundlage 3 (Mehr als zwei Gruppen)</a>}>
    <p>Der ALLBUS fragt: <em>„Viele Leute verwenden die Begriffe links und rechts … Wo würden Sie sich einordnen?“</em> (<code>pa01</code>, 1 = links bis 10 = rechts). Den Wohnort beschreiben die Befragten selbst (<code>gs01</code>): Großstadt, Vorort einer Großstadt, Mittel- oder Kleinstadt, ländliches Dorf, Einzelgehöft auf dem Land. Fünf Gruppen, also eine ANOVA.</p>
    {predict('a3')}
    {BEFORE_STEPS}
    <Steps>
      <li><b>Die ANOVA.</b> Führe die Vorlage aus, wie sie ist: Sie rechnet das Alter nach Erhebungsweg aus <a href="#g3">Grundlage 3</a>; du solltest F = 160.989 wiederfinden. Tausch dann <code>age</code> gegen <code>pa01</code> und <code>mode</code> gegen <code>gs01</code> und führe sie noch einmal aus.
        <Workshop k="a3_anova" live />
        <ReadAnova /></li>
      <li><b>Welche Wohnorte genau?</b> Hänge <code>tukey_test()</code> direkt hinter die ANOVA, <code>summary()</code> ans Ende. Die Vorlage ist fertig. Die Kurzfassung ohne <code>summary()</code> würde nur zählen, wie viele Paare signifikant sind; mit <code>summary()</code> siehst du alle zehn.
        <Workshop k="a3_tukey" live /></li>
      <li><b>Deuten.</b> Beantworte die Fragen unten: erst wo, dann ob (F), wie stark (η²), welche Paare (Tukey) und warum ein Paar trotz großem Unterschied offen bleibt. Wenn du fertig bist und Zeit hast: Schreib einen Satz, was man über Stadt und Land sagen darf und was nicht (fürs Plenum).</li>
    </Steps>
    <TryOut idea="Sind Verheiratete zufriedener mit ihrem Leben als Ledige, Geschiedene oder Verwitwete? Und wäre das eine Wirkung der Ehe?" workshop={<Workshop k="frei_a3" live />} />
    <Answers task="a3" />
    <Plenum><p style={{ margin: '4px 0 0' }}>Bringt euren Satz aus Schritt 3 mit. Schreibt eine Schlagzeile, die stimmt, und eine, die zu weit geht. Woran liegt der Unterschied: am Wohnort selbst, oder wohnen in der Großstadt andere Menschen (jünger, mehr mit Abitur)?</p></Plenum>
    <Hints steps={hints('a3')} />
    <NoGraphic>Alle Antworten stehen in der Textausgabe von <code>summary()</code>; diese Aufgabe braucht keine Grafik. Das Bild in Schritt 1 ist nur eine Lesehilfe.</NoGraphic>
    <ErrorHelp />
  </TaskBlock>;
}

/* ---------- Aufgabe 4 ---------- */

export function Task4() {
  return <TaskBlock id="a4" n={4} title="Vertrauen in Institutionen" required={false} kind="interpret"
    question="Hängt das Vertrauen in verschiedene Institutionen zusammen, und spielt das Alter dabei eine Rolle?"
    goal="Am Ende kannst du eine Korrelationsmatrix lesen: das stärkste Paar finden, signifikante von nicht signifikanten Paaren unterscheiden und erklären, warum die Fallzahlen je Paar verschieden sind."
    foundationHref="#g4"
    basis={<a href="#g4">Grundlage 4 (Viele Paare auf einen Blick)</a>}>
    <p>Vier Vertrauensfragen (1 = gar kein Vertrauen bis 7 = großes Vertrauen): Bundestag (<code>pt03</code>), Bundesregierung (<code>pt12</code>), Polizei (<code>pt14</code>), Hochschulen und Universitäten (<code>pt11</code>). Dazu das Alter (<code>age</code>).</p>
    {predict('a4')}
    {BEFORE_STEPS}
    <Steps>
      <li><b>Die Matrix.</b> Führe die Vorlage aus. Lies zuerst die „Correlation Matrix“, dann die „Sample Size Matrix“.
        <Workshop k="a4_matrix" live /></li>
    </Steps>
    <TryOut idea="neun Vertrauensfragen auf einmal. Wie viele Paare sind das, und wie viele bekommen Sterne?" workshop={<Workshop k="frei_a4" live />} />
    <Answers task="a4" />
    <Hints steps={hints('a4')} />
    <NoGraphic>Alle Antworten stehen in der Textausgabe von <code>summary()</code>; diese Aufgabe braucht keine Grafik.</NoGraphic>
    <ErrorHelp />
  </TaskBlock>;
}
