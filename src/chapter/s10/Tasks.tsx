// Sitzung 10 „Regression vertiefen“: Aufgaben 1 bis 4 aus dem Plan sitzung10.md, mit Fehlerhilfe.
import type { ReactNode } from 'react';
import { Badge, Known } from '../blocks/Card';
import { Hints } from '../blocks/Hints';
import { Predict } from '../blocks/Predict';
import { NoGraphic, Plenum, Steps, TaskBlock } from '../blocks/TaskBlock';
import { TryOut } from '../blocks/TryOut';
import { withCode } from '../blocks/rich';
import { TaskQuestions } from './Check';
import { ERROR_HELP, HINTS, PREDICTIONS, QUESTIONS, RESOLUTIONS } from './content';
import { FormulaGrows } from './figures/Formulas';
import { FourGroups } from './figures/Groups';
import { Workshop } from './Workshop';

type Key = 'a1' | 'a2' | 'a3' | 'a4';
const hints = (key: Key) => HINTS[key].map(h => <p key={h}>{withCode(h)}</p>) as [ReactNode, ReactNode, ReactNode];
const predict = (key: Key) => <Predict id={PREDICTIONS[key].id} prompt={PREDICTIONS[key].prompt} options={PREDICTIONS[key].options} />;
const questions = (key: Key) => <TaskQuestions id={`${key}-fragen`} questions={QUESTIONS[key]} predictionId={PREDICTIONS[key].id} resolution={RESOLUTIONS[key]} />;
/** The plan's sentence for screen readers about the marked places (the workshop lists the marks themselves). */
const Marks = ({ children }: { children: string }) => <p className="hilfe-zeile">{withCode(`Markierte Stelle: ${children}`)}</p>;
const Working = () => <p>Arbeite in der Code-Werkstatt direkt hier oder in RStudio. In RStudio führst du vorher den <a href="#r1">Startblock aus „R lesen“</a> aus.</p>;

/** „Hilfe: R meldet einen Fehler“ at the end of every task. */
export function ErrorHelp() {
  return <details className="hilfe">
    <summary>Hilfe: R meldet einen Fehler</summary>
    <table className="daten voll">
      <caption>Was R sagt, was passiert ist und was du tust</caption>
      <thead><tr><th scope="col">Meldung (Ausschnitt)</th><th scope="col">Was passiert ist</th><th scope="col">Was du tust</th></tr></thead>
      <tbody>{ERROR_HELP.map((row, i) => <tr key={i}>
        <td>{row.plain ? row.says : <code>{row.says}</code>}</td><td>{withCode(row.what)}</td><td>{withCode(row.todo)}</td>
      </tr>)}</tbody>
    </table>
  </details>;
}

export function Task1() {
  return <TaskBlock id="a1" n={1} title="Eigene Lage oder Lage des Landes?" required
    question="Hängt die Zufriedenheit mit der Demokratie an der eigenen wirtschaftlichen Lage, oder daran, wie man die Lage in Deutschland sieht?"
    goal="Am Ende kannst du sagen, wie stark die eigene wirtschaftliche Lage mit der Demokratiezufriedenheit zusammenhängt, einmal allein und einmal bei gleicher Einschätzung der Lage Deutschlands, und erklären, warum sich die Zahl ändert."
    foundationHref="#g1" basis={<a href="#g1">Grundlage 1, Mehrere Prädiktoren: konstant halten</a>}>
    <p>Der ALLBUS fragt, wie zufrieden man mit der Demokratie in Deutschland ist (<code>ps03</code>), wie man die eigene wirtschaftliche Lage einschätzt (<code>ep03</code>) und wie die wirtschaftliche Lage in Deutschland (<code>ep01</code>). Alle drei zählen von „sehr gut“ oder „sehr zufrieden“ nach unten. Die Vorlage polt sie um, damit eine höhere Zahl „zufriedener“ bzw. „besser“ heißt: <code>demo</code> reicht dann von 1 (sehr unzufrieden) bis 6 (sehr zufrieden), <code>lage</code> und <code>dlage</code> von 1 (sehr schlecht) bis 5 (sehr gut). Die Demokratiefrage haben nur etwa zwei Drittel der Befragten bekommen; die anderen haben TNZ: SPLIT (kennst du aus Sitzung 1).</p>
    {predict('a1')}
    <Working />
    <Steps>
      <li>Führe die Vorlage aus. Sie sagt die Demokratiezufriedenheit aus der eigenen Lage vorher. Lies unter Coefficients das B von <code>lage</code> und unter Model Summary R Square. <Badge>rec() mit rules = "rev": kennst du aus Sitzung 5</Badge> <Badge>demo und lage, linear_regression(): kennst du aus Sitzung 9</Badge>
        <Workshop k="a1" live />
        <Marks>Zeile 9: `lage` in der Formel, in Schritt 2 ergänzen.</Marks></li>
      <li>Nimm die Lage Deutschlands dazu: Schreib in der Formel hinter <code>lage</code> noch <code>+ dlage</code>, sodass dort <code>demo ~ lage + dlage</code> steht, und führe die Vorlage erneut aus. Lies wieder B von <code>lage</code>, dazu B von <code>dlage</code> und R Square.
        <p className="hilfe-zeile">Prüf in der Ausgabe die Zeile „Formula“: Dort muss <code>demo ~ lage + dlage</code> stehen.</p>
        <FormulaGrows /></li>
      <li>Deuten: Vergleiche die beiden B von <code>lage</code>. Was heißt die neue Zahl, und warum ist sie anders? (Fragen a1e und a1f unten)</li>
    </Steps>
    <TryOut idea="Spielt auch die erwartete Lage Deutschlands in einem Jahr (ep04) eine Rolle?" workshop={<Workshop k="frei_a1" live />} />
    {questions('a1')}
    <Hints steps={hints('a1')} />
    <NoGraphic>Diese Aufgabe braucht keine Grafik. Alle Zahlen stehen in der Ausgabe von <code>summary()</code> unter Coefficients und Model Summary.</NoGraphic>
    <ErrorHelp />
  </TaskBlock>;
}

export function Task2() {
  return <TaskBlock id="a2" n={2} title="Prägung oder Ort?" required
    question="Im Osten sind die Befragten im Schnitt weniger zufrieden mit der Demokratie. Liegt das daran, wo jemand aufgewachsen ist, oder daran, wo er heute lebt?"
    goal="Am Ende kannst du für vier Gruppen sagen, wie weit sie von einer Referenzgruppe entfernt liegen, ob die Umgezogenen eher ihrer Herkunft oder ihrem Wohnort ähneln, und zeigen, dass ein Wechsel der Referenz die B ändert, die Vorhersagen aber nicht."
    foundationHref="#g2" basis={<a href="#g2">Grundlage 2, Gruppen als Prädiktoren: Dummyvariablen</a>}>
    <p>Die Variable <code>dg03</code> teilt die Befragten in vier Gruppen, je nachdem, wo sie ihre Jugend verbracht haben und wo sie heute befragt wurden:</p>
    <table className="daten voll">
      <caption className="sr-only">Die vier Gruppen von dg03</caption>
      <thead><tr><th scope="col">Code</th><th scope="col">Wertelabel im ALLBUS</th><th scope="col">Gruppe</th><th scope="col">Dummy</th></tr></thead>
      <tbody>
        <tr><td>1</td><td>O.JUGEND-O.INT.</td><td>Ost-Bleibende: im Osten aufgewachsen, lebt im Osten</td><td><code>dg03_1</code></td></tr>
        <tr><td>2</td><td>O.JUGEND-W.INT.</td><td>Ost→West: im Osten aufgewachsen, lebt im Westen</td><td><code>dg03_2</code></td></tr>
        <tr><td>3</td><td>W.JUGEND-O.INT.</td><td>West→Ost: im Westen aufgewachsen, lebt im Osten</td><td><code>dg03_3</code></td></tr>
        <tr><td>4</td><td>W.JUGEND-W.INT.</td><td>West-Bleibende: im Westen aufgewachsen, lebt im Westen</td><td><code>dg03_4</code></td></tr>
      </tbody>
    </table>
    <p>Zwei Vermutungen stehen gegeneinander. <b>Prägung:</b> Wer im Osten aufwuchs, bleibt so zufrieden oder unzufrieden wie dort, egal wo er heute lebt. Dann ähneln die Ost→West-Umgezogenen den Ost-Bleibenden. <b>Ort:</b> Es zählt, wo man heute lebt. Dann ähneln die West→Ost-Umgezogenen den Ost-Bleibenden. Die Umgezogenen sind wenige: Von den Befragten mit Demokratiefrage sind 91 von Ost nach West und 97 von West nach Ost gezogen (gezählt, nicht gewichtet).</p>
    <FourGroups />
    {predict('a2')}
    <Working />
    <Steps>
      <li>Führe die Vorlage aus. <code>to_dummy(dg03)</code> bildet die vier Dummies, in die Formel kommen drei. <code>dg03_4</code> fehlt, also sind die West-Bleibenden die Referenz. Lies unter Coefficients die Konstante (Intercept) und die drei B. <Badge>to_dummy(): neu heute</Badge> <Badge>demo wie in Aufgabe 1</Badge>
        <Workshop k="a2" live />
        <Marks>Zeile 9: `dg03_1` in der Formel, in Schritt 3 tauschen.</Marks></li>
      <li>Rechne mit R als Taschenrechner die Vorhersage für die Gruppe Ost→West aus: Konstante plus B von <code>dg03_2</code>. Die Vorlage rechnet noch das Beispiel aus <a href="#v2a">Grundlage 2a</a> (Konstante 7,042 plus B 0,652 für die Verheirateten). Tausch beide markierten Zahlen gegen deine aus Schritt 1 und führe sie aus. <Known session={1} what="R als Taschenrechner" />
        <p className="hilfe-zeile">Kommazahlen mit Punkt, ein Minus gehört mit dazu, etwa <code>-0.5</code>.</p>
        <Workshop k="a2_rechnen" live />
        <Marks>Zeile 3: zwei Zahlen, die Konstante und das B. Vor dem Tausch gibt R `[1] 7.694` aus.</Marks></li>
      <li>Wechsle die Referenz zu den Ost-Bleibenden: Tausch in der ersten Vorlage <code>dg03_1</code> gegen <code>dg03_4</code> und führe sie erneut aus. Jetzt fehlt <code>dg03_1</code>. Lies wieder Konstante und B. Rechne die Vorhersage für Ost→West noch einmal mit der Taschenrechner-Vorlage: Konstante plus B von <code>dg03_2</code>.
        <p className="hilfe-zeile">In der Zeile „Formula“ muss jetzt <code>demo ~ dg03_4 + dg03_2 + dg03_3</code> stehen.</p></li>
      <li>Deuten: Welches Muster zeigen die Zahlen, und wie sicher sind sie? Schau bei den Umzugsgruppen auch auf das Konfidenzintervall (95% CI Lower und Upper, kennst du aus Sitzung 7). (Fragen a2d und a2e unten)</li>
    </Steps>
    <TryOut idea="Wer von West nach Ost zieht, hat oft Abitur. Ändert sich das Bild, wenn du das Abitur konstant hältst?" workshop={<Workshop k="frei_a2" live />} />
    {questions('a2')}
    <p className="hilfe-zeile">N = 3.222 in der Ausgabe ist die Summe der Gewichte. Gezählt sind es 3.254 Befragte: 1.003 Ost-Bleibende, 91 Ost→West, 97 West→Ost, 2.063 West-Bleibende. Weil der Osten im ALLBUS absichtlich stärker vertreten ist, zählen Befragte im Osten gewichtet weniger.</p>
    <Plenum><p style={{ margin: '4px 0 0' }}>Mit Referenz West-Bleibende hat Ost→West B = −0,166, mit Referenz Ost-Bleibende +0,540. Welche Zahl würdet ihr in einem Zeitungsartikel nennen, und welchen Satz schreibt ihr dazu?</p></Plenum>
    <Hints steps={hints('a2')} />
    <NoGraphic>Die Kreuztabelle in der Einleitung zeigt nur die vier Gruppen. Alle Zahlen stehen in der Ausgabe von <code>summary()</code> unter Coefficients.</NoGraphic>
    <ErrorHelp />
  </TaskBlock>;
}

export function Task3() {
  return <TaskBlock id="a3" n={3} title="Was wiegt mehr, und was bleibt vom Ost-West-Unterschied?" required kind="interpret"
    question="Welche von vier Eigenschaften hängt am stärksten mit der Demokratiezufriedenheit zusammen, und wie groß bleibt der Abstand zwischen Ost und West, wenn die anderen drei gleich sind?"
    goal="Am Ende kannst du Prädiktoren mit Beta vergleichen, korrigiertes R² und VIF eines Modells lesen und sagen, wie viel vom Ost-West-Unterschied bleibt, wenn wirtschaftliche Lage und Abitur konstant gehalten werden."
    foundationHref="#g3" basis={<a href="#g3">Grundlage 3, Vergleichen und prüfen</a>}>
    <p>Ins Modell kommen vier Prädiktoren: die eigene wirtschaftliche Lage (<code>lage</code>) und die Lage Deutschlands (<code>dlage</code>) aus Aufgabe 1, beide von 1 sehr schlecht bis 5 sehr gut; das Wohngebiet (<code>ost</code>: 1 Osten, 0 Westen, eine 0/1-Variable wie in Grundlage 2a) und der Schulabschluss (<code>abitur</code>: 1 Fachhochschulreife oder Abitur, 0 ohne Abschluss, Volks- oder Hauptschule oder Mittlere Reife; „anderer Abschluss“ und „noch Schüler“ fehlen im Modell).</p>
    {predict('a3')}
    <Working />
    <Steps>
      <li>Führe die Vorlage aus. Lies unter Coefficients die Spalten B und Beta, unter Model Summary R Square und Adjusted R Square, unter Collinearity Statistics die VIF. <Badge>0/1-Variable mit rec(): wie in Grundlage 2a</Badge>
        <Workshop k="a3" live /></li>
      <li>Vergleiche B und Beta: Welcher Prädiktor hat das größte Beta? Und stimmt die Reihenfolge der B mit der Reihenfolge der Beta überein? Schau besonders auf <code>lage</code> und <code>abitur</code>.</li>
      <li>Zum Vergleich: der Ost-West-Unterschied ohne weitere Prädiktoren, der Bruttoeffekt. Führe die zweite Vorlage aus und vergleiche B von <code>ost</code> mit dem aus Schritt 1.
        <Workshop k="a3_ost" live /></li>
    </Steps>
    <TryOut idea="Wie viel trägt die Lage Deutschlands? Nimm sie heraus und vergleiche R², korrigiertes R² und die übrigen B." workshop={<Workshop k="frei_a3" live />} />
    {questions('a3')}
    <Hints steps={hints('a3')} />
    <NoGraphic>Diese Aufgabe hat keine Grafik. Alle Zahlen stehen in den Ausgaben der beiden Vorlagen.</NoGraphic>
    <ErrorHelp />
  </TaskBlock>;
}

export function Task4() {
  return <TaskBlock id="a4" n={4} title="Ist der Ost-West-Unterschied mit Abitur kleiner?" required={false}
    question="Sind Befragte mit Abitur im Osten ähnlich zufrieden mit der Demokratie wie im Westen, oder gilt der Ost-West-Unterschied für beide gleich?"
    goal="Am Ende kannst du eine Interaktion rechnen und lesen, den Ost-West-Unterschied für Befragte mit und ohne Abitur ausrechnen und begründen, ob er verschieden groß ist. Dazu kannst du sagen, warum kleine Gruppen vorsichtig machen."
    foundationHref="#g4" basis={<a href="#g4">Grundlage 4, Grenzen des Modells</a>}>
    <p>In Aufgabe 3 ist der Ost-West-Unterschied mit Lage und Abitur im Modell nur wenig kleiner geworden. Das sagt aber noch nicht, ob der Unterschied bei Befragten mit und ohne Abitur gleich groß ist. Das prüft eine Interaktion.</p>
    {predict('a4')}
    <Working />
    <Steps>
      <li>Führe die Vorlage aus. Sie rechnet <code>demo ~ ost + abitur</code>: ein Unterschied für alle. Lies B von <code>ost</code>.
        <Workshop k="a4" live />
        <Marks>Zeile 9: das Plus zwischen `ost` und `abitur`, in Schritt 2 gegen ein Sternchen tauschen.</Marks></li>
      <li>Tausch das <code>+</code> gegen <code>*</code> und führe die Vorlage erneut aus. Jetzt gibt es eine Zeile <code>ost:abitur</code>. Lies B, Sig. und das Konfidenzintervall dieser Zeile. <Badge>* in der Formel: neu heute</Badge></li>
      <li>Rechne den Ost-West-Unterschied für Befragte mit Abitur aus: B von <code>ost</code> plus B von <code>ost:abitur</code>. B von <code>ost</code> ist jetzt der Unterschied ohne Abitur. Die Vorlage rechnet noch das Beispiel aus <a href="#v4b">Grundlage 4b</a> (Abstand der Erwerbstätigen ab 60). Tausch beide markierten Zahlen gegen deine aus Schritt 2.
        <p className="hilfe-zeile">Kommazahlen mit Punkt, ein Minus gehört mit dazu.</p>
        <Workshop k="a4_rechnen" live />
        <Marks>Zeile 3: zwei Zahlen, B von `ost` und B von `ost:abitur`. Vor dem Tausch gibt R `[1] 0.056` aus.</Marks></li>
      <li>Deuten: Ist der Unterschied mit Abitur anders? Und: In Aufgabe 2 beruhten zwei Gruppen auf 91 und 97 Befragten. Was folgt daraus für ihre B? (Fragen a4c und a4d unten)</li>
    </Steps>
    <TryOut idea="Ist der Ost-West-Unterschied bei Menschen, die sich politisch links einstufen, anders?" workshop={<Workshop k="frei_a4" live />} />
    {questions('a4')}
    <Plenum><p style={{ margin: '4px 0 0' }}>Zwei Sätze zur Wahl: „Mit und ohne Abitur ist der Ost-West-Unterschied gleich groß.“ und „Wir finden keinen Hinweis, dass der Ost-West-Unterschied mit Abitur anders ist.“ Welcher passt zu den Daten, und warum ist der Unterschied wichtig? Zum Vergleich: Die Probier-Idee mit der Links-rechts-Einstufung zeigt eine Interaktion, die signifikant ist.</p></Plenum>
    <Hints steps={hints('a4')} />
    <NoGraphic>Diese Aufgabe hat keine Grafik. Die Zahlen stehen in der Ausgabe der Vorlage, einmal mit <code>+</code> und einmal mit <code>*</code>.</NoGraphic>
    <ErrorHelp />
  </TaskBlock>;
}
