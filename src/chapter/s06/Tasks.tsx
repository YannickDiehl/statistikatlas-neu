// Sitzung 6 „Gewichtung und Zusammenhang“: Aufgaben 1 bis 4 aus sitzung06.md, mit Fehlerhilfe.
import type { ReactNode } from 'react';
import { Badge, Known } from '../blocks/Card';
import { Hints } from '../blocks/Hints';
import { Predict } from '../blocks/Predict';
import { Questions } from '../blocks/Questions';
import { NoGraphic, Plenum, Steps, TaskBlock } from '../blocks/TaskBlock';
import { TryOut } from '../blocks/TryOut';
import { withCode } from '../blocks/rich';
import { judgeWithFeedback } from '../answers';
import { useChapterState } from '../ChapterContext';
import { de } from './figures/util';
import { A2, ALT, ERROR_HELP, ERROR_HELP_CAPTION, ERROR_HELP_TITLE, HINTS, PREDICTIONS, QUESTIONS, type Rich } from './content';
import { SignSchema } from './figures/Pairs';
import { CumTable } from './figures/Weighting';
import { Workshop } from './Workshop';

type Key = 'a1' | 'a2' | 'a3' | 'a4';
const hints = (key: Key) => HINTS[key].map(h => <p key={h}>{withCode(h)}</p>) as [ReactNode, ReactNode, ReactNode];

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
 * The resolution of „Erst festlegen“: shown once there is a prediction and no question of the task is open any more
 * (the Questions block quotes the prediction; this line adds what R gives).
 */
function Resolution({ k }: { k: Key }) {
  const { state } = useChapterState();
  const p = PREDICTIONS[k];
  const checked = QUESTIONS[k].every(q => judgeWithFeedback(q, state.answers[q.id]).result !== 'open');
  const show = !!state.predictions[p.id] && checked;
  return <p className={`rueck${show ? ' fest' : ''}`} aria-live="polite">{show ? `Auflösung zu deinem Tipp: ${p.resolution}` : ''}</p>;
}

const WORK_HINT = <p>Arbeite in der Code-Werkstatt direkt hier oder in RStudio. In RStudio führst du vorher den Startblock aus <a href="#r1">„R lesen“</a> aus.</p>;

/* ---------- Aufgabe 1 ---------- */

export function Task1() {
  return <TaskBlock id="a1" n={1} title="Wie zufrieden ist Deutschland mit der Demokratie?" required
    question="Wie viele Menschen in Deutschland sind mit der Demokratie zufrieden, und was ändert die Gewichtung daran?"
    goal="Am Ende kannst du sagen, wie viel Prozent mindestens etwas zufrieden sind, ohne und mit Gewicht, und erklären, warum die Zahl mit Gewicht anders ausfällt."
    foundationHref="#g1"
    basis={<a href="#g1">Grundlage 1, Gewichtung</a>}>
    <p>Der ALLBUS fragt nach der Zufriedenheit mit der Demokratie in Deutschland (<code>ps03</code>). Es gibt sechs Ausprägungen: 1 sehr zufrieden, 2 ziemlich zufrieden, 3 etwas zufrieden, 4 etwas unzufrieden, 5 ziemlich unzufrieden, 6 sehr unzufrieden. Gut zwei Drittel der Befragten haben diese Frage bekommen; die übrigen hatten eine andere Fragebogen-Variante und stehen bei den fehlenden Werten unter „TNZ: SPLIT“ (fehlende Werte kennst du aus Sitzung 3). Als „zufrieden“ zählen hier alle mit 1, 2 oder 3.</p>
    {predict('a1')}
    {WORK_HINT}
    <Steps>
      <li>Zähle <code>ps03</code> einmal ohne und einmal mit Gewicht aus. Lies jeweils in der Spalte <b>Cum. %</b> die Zeile <b>3 ETWAS ZUFRIEDEN</b>. <Known session={3} what="Cum. %" /> Cum. % zählt die Prozente von oben zusammen; in Zeile 3 steht also, wie viele 1, 2 oder 3 angegeben haben.
        <Workshop k="a1a" live />
        <CumTable /></li>
      <li>Schau in die Landesteile. Die Vorlage zeigt den Osten (<code>eastwest == 2</code>). Führe sie aus, dann tausche beide markierten Stellen gegen 1 (Westen) und führe sie noch einmal aus. Beide Stellen müssen gleich sein. <Known session={2} what="filter()" />
        <Workshop k="a1b" live /></li>
      <li><b>Deuten:</b> Vergleiche: Wie stark ändert das Gewicht die Zahl im Osten, wie stark für ganz Deutschland? Die Fragen unten führen dich hin.</li>
    </Steps>
    <Questions id="a1-fragen" questions={QUESTIONS.a1} predictionId={PREDICTIONS.a1.id} />
    <Resolution k="a1" />
    <Hints steps={hints('a1')} />
    <NoGraphic>Alle Antworten stehen in den Tabellen von <code>frequency()</code>.</NoGraphic>
    <TryOut idea="Ändert die Gewichtung auch Mittelwert und Median?" workshop={<Workshop k="frei_a1" live />} />
    <ErrorHelp />
  </TaskBlock>;
}

/* ---------- Aufgabe 2 ---------- */

export function Task2() {
  return <TaskBlock id="a2" n={2} title="Zufriedenheit und Wahlabsicht" required
    question="Hängt die Zufriedenheit mit der Demokratie damit zusammen, welche Partei jemand wählen würde?"
    goal="Am Ende kannst du mit Zeilenprozenten zeigen, bei welchen Parteien die Zufriedenheit hoch oder niedrig ist, und mit Cramér-V sagen, wie stark der Zusammenhang ist."
    foundationHref="#g2"
    basis={<a href="#g2">Grundlage 2, χ², Phi und Cramér-V</a>}>
    <p>Die Wahlabsicht (<code>pv01</code>) fragt, welche Partei jemand bei einer Bundestagswahl wählen würde. Die Antworten: CDU-CSU, SPD, FDP, DIE GRUENEN, DIE LINKE, AFD, ANDERE PARTEI, WUERDE NICHT WAEHLEN. Wer nicht wahlberechtigt ist oder nichts angibt, fehlt. Die Zufriedenheit (<code>ps03</code>) teilst du wie in Aufgabe 1 in zwei Gruppen: zufrieden (1 bis 3) und unzufrieden (4 bis 6).</p>
    {predict('a2')}
    {WORK_HINT}
    <Steps>
      <li>Welches Skalenniveau hat die Wahlabsicht? Beantworte zuerst die Frage zum Skalenniveau unten. Davon hängt ab, welches Maß passt.</li>
      <li>Teile die Zufriedenheit in zwei Gruppen und lass dir die Kreuztabelle mit Zeilenprozenten ausgeben, gewichtet. Die Kette bildet zuerst mit <code>mutate()</code> und <code>rec()</code> die neue Variable <code>zufrieden</code> (1 bis 3 zufrieden, 4 bis 6 unzufrieden) und reicht sie dann an <code>crosstab()</code> weiter. <Known session={5} what="mutate() mit rec()" /> <Known session={5} what="crosstab()" /> <Badge>neu nur weights = wghtpew</Badge>
        <br />Jede Wahlabsicht hat zwei Zeilen: oben die Anzahl (gewichtet, also Summe der Gewichte), darunter „row %“. In der Spalte „zufrieden“ steht in der Zeile „row %“, wie viel Prozent dieser Gruppe mindestens etwas zufrieden sind. Die Wahlabsicht steht in den Zeilen und ist hier die Gruppe, die du vergleichst; darum Zeilenprozente (kennst du aus Sitzung 5).
        <Workshop k="a2b" live /></li>
      <li>Fass die ganze Tabelle in einer Zahl zusammen: Cramér-V, gewichtet. <Badge>neu heute: cramers_v()</Badge> Jede Werkstatt beginnt mit dem frisch geladenen <code>allbus</code>; darum bildet die Vorlage <code>zufrieden</code> noch einmal genauso wie in Schritt 2.
        <Workshop k="a2c" live />
        <p className="hilfe-zeile">R gibt nur eine Zahl aus, zum Beispiel <code>[1] 0.1234567</code>. Lies sie mit drei Nachkommastellen.</p></li>
    </Steps>
    <Questions id="a2-fragen" questions={QUESTIONS.a2} predictionId={PREDICTIONS.a2.id} />
    <Resolution k="a2" />
    <Plenum><p style={{ margin: '4px 0 0' }}>V = {de(A2.v, 2)} ist ein deutlicher Zusammenhang. Heißt das, die Wahlabsicht macht zufrieden oder unzufrieden, oder könnte es auch umgekehrt sein? Bringt einen Satz mit.</p></Plenum>
    <Hints steps={hints('a2')} />
    <NoGraphic>Ja, alles steht in Tabelle und Zahl: Zeilenprozente aus <code>crosstab()</code> in Schritt 2, V aus <code>cramers_v()</code> in Schritt 3.</NoGraphic>
    <TryOut idea={<>Wie unterscheiden sich West und Ost, und was sagt Phi dazu? Bei einer Vierfeldertafel zeigt <code>phi()</code> ein Vorzeichen (<a href="#k2b">Grundlage 2b</a>); für die Stärke zählt der Betrag.</>}
      workshop={<Workshop k="frei_a2" live />} />
    <ErrorHelp />
  </TaskBlock>;
}

/* ---------- Aufgabe 3 ---------- */

export function Task3() {
  return <TaskBlock id="a3" n={3} title="Wirtschaftslage und Demokratie" required
    question="Sind Menschen, die die Wirtschaftslage in Deutschland schlechter einschätzen, unzufriedener mit der Demokratie?"
    goal="Am Ende kannst du Gamma und Tau-b für zwei geordnete Merkmale ausrechnen, Stärke und Richtung in einem Satz sagen und erklären, warum Gamma größer ausfällt."
    foundationHref="#g3"
    basis={<a href="#g3">Grundlage 3, Gamma und Tau-b</a>}>
    <p>Die Wirtschaftslage in Deutschland (<code>ep01</code>) <Badge>kennst du aus Sitzung 5, Grundlage Umpolen</Badge> hat fünf Ausprägungen: 1 sehr gut, 2 gut, 3 teils/teils, 4 schlecht, 5 sehr schlecht. Ein höherer Code heißt also: schlechter eingeschätzt. Diesmal bleibt <code>ep01</code>, wie es ist. Die Zufriedenheit mit der Demokratie (<code>ps03</code>) polst du zuerst um, damit ein höherer Code „zufriedener“ heißt. Beide Merkmale haben eine Reihenfolge, aber keine sicher gleichen Abstände: ordinal.</p>
    {predict('a3')}
    {WORK_HINT}
    <Steps>
      <li>Pole die Zufriedenheit um und prüfe es. <Known session={5} what={'rules = "rev"'} /> In der Kontrolle muss bei Code 6 jetzt SEHR ZUFRIEDEN stehen.
        <Workshop k="a3a" live /></li>
      <li>Rechne Gamma und Tau-b, gewichtet. <Badge>neu heute: goodman_gamma() und kendall_tau()</Badge> Jede Werkstatt beginnt mit dem frisch geladenen <code>allbus</code>; darum polt die Vorlage oben noch einmal um wie in Schritt 1. Die Ausgabe hat zwei Teile: Zuerst kommt Gamma als einzelne Zahl hinter <code>[1]</code>, darunter der Block „Kendall's Tau“ mit der Zeile <code>tau = …</code>. Bei Gamma meldet R in Rot „2 cells (6.7%) has expected count &lt; 5 …“: ein Hinweis, kein Fehler.
        <Workshop k="a3b" live />
        <SignSchema /></li>
      <li><b>Deuten:</b> Sag in einem Satz, was das Vorzeichen bedeutet, und ordne die Stärke mit Tau-b ein (Fragen unten).</li>
    </Steps>
    <Questions id="a3-fragen" questions={QUESTIONS.a3} predictionId={PREDICTIONS.a3.id} />
    <Resolution k="a3" />
    <Plenum><p style={{ margin: '4px 0 0' }}>Für dieselben Daten gibt es −0,54 (Gamma) und −0,39 (Tau-b). Welche Zahl schreibt ihr in einen Bericht, und was muss dazu?</p></Plenum>
    <Hints steps={hints('a3')} />
    <NoGraphic>Ja; das Bild in Schritt 2 ist auch als Text da. Gamma steht hinter <code>[1]</code>, Tau-b in der Zeile <code>tau = …</code> der Ausgabe von Schritt 2.</NoGraphic>
    <TryOut idea={<>Hängt die Zufriedenheit genauso stark mit der eigenen wirtschaftlichen Lage zusammen (<code>ep03</code>, gleiche Codes wie <code>ep01</code>)?</>}
      workshop={<Workshop k="frei_a3" live />} />
    <ErrorHelp />
  </TaskBlock>;
}

/* ---------- Aufgabe 4 ---------- */

export function Task4() {
  return <TaskBlock id="a4" n={4} title="Lebenszufriedenheit und Demokratie" required={false}
    question="Sind Menschen, die mit ihrem Leben zufriedener sind, auch zufriedener mit der Demokratie, und gilt das in West und Ost?"
    goal="Am Ende kannst du Pearson-r und Spearman-ρ rechnen und einordnen und prüfen, ob der Zusammenhang in beiden Landesteilen gleich stark ist."
    foundationHref="#g4"
    basis={<a href="#g4">Grundlage 4</a>}>
    <p>Die Lebenszufriedenheit (<code>ls01</code>) reicht von 0 (ganz unzufrieden) bis 10 (ganz zufrieden); elf Ausprägungen, die man wie Zahlen mit gleichen Abständen behandeln darf (quasi-metrisch). Die Zufriedenheit mit der Demokratie hat sechs Ausprägungen; umgepolt (höher = zufriedener) behandelst du sie hier ebenfalls als quasi-metrisch und vergleichst zur Sicherheit mit Spearman-ρ.</p>
    {predict('a4')}
    {WORK_HINT}
    <Steps>
      <li>Pole um (wie in Aufgabe 3) und sieh dir das Streudiagramm an. <code>geom_jitter()</code> streut die Punkte leicht, weil sie sonst bei so wenigen Ausprägungen übereinanderliegen (in Sitzung 4 im Überblick erwähnt; <code>ggplot()</code> kennst du von dort); <code>alpha = 0.2</code> macht sie durchscheinend, damit dichte Stellen dunkler wirken. Das Bild zeigt alle Befragten ohne Gewicht; für einen ersten Blick reicht das.
        <Workshop k="a4a" live />
        <p className="sr-only">{`Textfassung der Grafik: ${ALT.punktwolke}`}</p></li>
      <li>Rechne Pearson-r (gewichtet) und Spearman-ρ. <Badge>neu heute: pearson_cor() und spearman_rho()</Badge> Die Vorlage polt oben wieder um, weil jede Werkstatt mit dem frisch geladenen <code>allbus</code> beginnt.
        <Workshop k="a4b" live /></li>
      <li>Prüfe die Drittvariable Landesteil: Rechne r einmal nur im Westen (1, wie vorgegeben) und einmal nur im Osten (tausche die markierte Stelle gegen 2).
        <Workshop k="a4c" live /></li>
    </Steps>
    <Questions id="a4-fragen" questions={QUESTIONS.a4} predictionId={PREDICTIONS.a4.id} />
    <Resolution k="a4" />
    <Hints steps={hints('a4')} />
    <NoGraphic>Ja; die Punktwolke ist nur zum Ansehen, alle Antworten kommen aus Schritt 2 und 3: <code>r = …</code> und <code>rho = …</code> aus <code>pearson_cor()</code> und <code>spearman_rho()</code>.</NoGraphic>
    <TryOut idea={<>Hängt die Links-rechts-Einstufung mit der Zufriedenheit zusammen? Für West oder Ost setzt du die Zeile <code>filter(eastwest == 1) %&gt;%</code> aus Schritt 3 vor <code>pearson_cor()</code>.</>}
      workshop={<Workshop k="frei_a4" live />} />
    <ErrorHelp />
  </TaskBlock>;
}
