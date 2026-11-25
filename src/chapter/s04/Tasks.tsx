// Sitzung 4 „Daten sehen“: Aufgaben 1 bis 4 aus prototyp/sitzung4.html (v11), mit Rätselkasten, Achsen-Frage und Fehlerhilfe.
import { useState, type FormEvent, type ReactNode } from 'react';
import { Badge } from '../blocks/Card';
import { Begriff } from '../Begriff';
import { Figure } from '../blocks/Figure';
import { Hints } from '../blocks/Hints';
import { Predict } from '../blocks/Predict';
import { Questions } from '../blocks/Questions';
import { NoGraphic, Plenum, Steps, TaskBlock } from '../blocks/TaskBlock';
import { TryOut } from '../blocks/TryOut';
import { useAnnounce } from '../blocks/announce';
import { withCode } from '../blocks/rich';
import { judge } from '../answers';
import { ALT, binwidth, dropNa, filter180, kette, toLabel, zoomFilter } from './bilder';
import {
  A1_AXIS, ERROR_HELP, ERROR_HELP_CAPTION, ERROR_HELP_TITLE, HINTS, PREDICTIONS, QUESTIONS,
  RIDDLE, RIDDLE_ALL_RIGHT, RIDDLE_B_TEXT, RIDDLE_FEATURES, RIDDLE_NAMES, type Rich, type RiddleVar,
} from './content';
import { Bars } from './figures/Bars';
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

/* ---------- Aufgabe 1 ---------- */

/** Step 5 of task 1: „Wo beginnt die Achse?“ – the same reasoning for every choice, not saved. */
function AxisQuestion() {
  const q = A1_AXIS;
  const [choice, setChoice] = useState('');
  const [shown, announce] = useAnnounce<string | null>(null, null);
  if (q.kind !== 'choice') return null;

  function submit(e: FormEvent) {
    e.preventDefault();
    announce(choice);
  }

  const result = shown ? judge(q, shown) : 'open';
  const text = shown === '' ? 'Leg dich zuerst fest.' : shown ? `${result === 'right' ? 'Richtig.' : 'Noch nicht.'} ${q.right}` : '';
  const cls = shown === '' || result === 'wrong' ? ' no' : result === 'right' ? ' ok' : '';
  return <form className="kurzueberlegen" id={q.id} style={{ marginTop: 8 }} noValidate onSubmit={submit}>
    <fieldset role="radiogroup" aria-labelledby={`${q.id}-l`} aria-invalid={cls === ' no' || undefined} aria-describedby={text ? `${q.id}-r` : undefined}>
      <legend id={`${q.id}-l`}>{q.label}</legend>
      <div className="radios">{q.options.map(o => <label key={o.value}>
        <input type="radio" name={`${q.id}-wahl`} value={o.value} checked={choice === o.value} onChange={() => setChoice(o.value)} /> {o.label}
      </label>)}</div>
    </fieldset>
    <div className="reihe-knoepfe"><button type="submit" className="knopf">Begründung ansehen</button></div>
    <p className={`rueck${cls}`} id={`${q.id}-r`} aria-live="polite">{text}</p>
  </form>;
}

export function Task1() {
  return <TaskBlock id="a1" n={1} title="Gesundheit zeigen" required
    question="Wie beurteilen die Befragten ihre Gesundheit?"
    goal="Am Ende hast du eine beschriftete Grafik der Gesundheit ohne fehlende Werte und kannst sagen, welche Einschätzung am häufigsten ist, wie viele Antworten fehlen und wie groß n ist."
    foundationHref="#g1"
    basis={<><a href="#g1">Grundlage 1, Balken und Häufigkeiten</a> und <a href="#r2">Schichten einer Grafik</a></>}>
    {predict('a1')}
    <Steps>
      <li>Arbeite in der Code-Werkstatt direkt hier oder in RStudio. In RStudio führst du vorher den <a href="#r1">Startblock in „R lesen“</a> aus.</li>
      <li>Führe die erste Vorlage aus. <code>to_label()</code> ersetzt die Codes durch ihre Wörter, damit auf der Achse „SEHR GUT“ statt 1 steht. <Badge>neu heute</Badge>
        <Figure svg={toLabel} alt={ALT.toLabel} caption={<><code>to_label(hs01)</code> tauscht jeden <Begriff id="code">Code</Begriff> gegen sein <Begriff id="wertelabel">Wertelabel</Begriff>: Aus 2 wird GUT. Ein fehlender Wert bleibt leer; sein Wertelabel KEINE ANGABE fällt ab, er ist jetzt einfach <code>NA</code>. <code>geom_bar()</code> stapelt gleiche Wörter zu Balken und gibt den fehlenden Werten einen eigenen Balken ganz rechts: NA. Über den Variablen steht der <Begriff id="datentyp">Datentyp</Begriff>: <code>&lt;dbl+lbl&gt;</code> heißt Zahl mit Wertelabel, <code>&lt;fct&gt;</code> heißt Wörter (<Begriff id="faktor">Faktor</Begriff>). <span>Im Bild ist jeder Wert ein Stein; das Beispiel hat sechs Befragte.</span></>} />
        <Workshop k="a1v" live /></li>
      <li>Schau ganz nach rechts: Dort steht ein Balken <b>NA</b>. (Überlappen sich in RStudio die Beschriftungen, zieh das Plots-Fenster breiter.) Das sind Personen ohne gültige Antwort. Bei Zahlen auf der Achse lässt ggplot fehlende Werte mit einer Warnung weg (wie bei der Lebenszufriedenheit in <a href="#r2">„Schichten“</a>), bei Wörtern zeigt es sie als eigenen Balken NA. Wie viele es sind, zeigt dir <code>allbus %&gt;% frequency(hs01)</code> in der Zeile „Total missing“ (kennst du aus Sitzung 3). Lass sie mit <code>drop_na(hs01)</code> weg und beschrifte die Grafik: Passe in der zweiten Vorlage die markierten Stellen an und führe sie aus.
        <Figure svg={dropNa} alt={ALT.dropNa} caption={<><code>drop_na(hs01)</code> schaut nur in die Variable <code>hs01</code>: Wer dort einen fehlenden Wert hat, fällt mit der ganzen Zeile weg (grau). Wer nur bei einer anderen Variable nichts angegeben hat, hier beim Alter, bleibt. Von 5.246 <Begriff id="fall">Fällen</Begriff> bleiben 5.209. R schreibt Tausender mit Komma: 5,246 heißt 5.246. <span>Im Bild ist jeder Wert ein Stein; das Beispiel hat fünf Befragte, die Fallzahlen stammen aus dem ALLBUS 2023.</span></>} />
        <Workshop k="a1n" live /></li>
      <li>Lies deinen fertigen Code einmal von oben nach unten. Wo reicht die <Begriff id="pipe">Pipe</Begriff> <code>%&gt;%</code> die Daten weiter, wo legt <code>+</code> eine Schicht auf, einen <Begriff id="layer">Layer</Begriff>?
        <Figure svg={kette} alt={ALT.kette} caption={<>Dein Code Zeile für Zeile. Bis <code>ggplot()</code> reicht <code>%&gt;%</code> den Datensatz jeweils ins erste Feld der nächsten Funktion. <code>ggplot(aes(x = hs01))</code> legt eine leere Fläche an (im Bild: eine Leinwand), mit den Ausprägungen auf der x-Achse. <code>+ geom_bar()</code> legt die Balken darauf und bringt die Zählachse mit. <code>labs()</code> aus deiner Vorlage ist eine weitere Schicht und kommt ebenfalls mit <code>+</code> dazu. <span>Balkenhöhen: ALLBUS 2023, ungewichtet, n = 5.209.</span></>} /></li>
      <li><b>Deuten: Wo beginnt die Achse?</b>
        <AxisQuestion />
        <p className="hilfe-zeile">Grundlage: <a href="#v7">Grundlage 1c: Ehrlich zeigen</a></p></li>
    </Steps>
    <TryOut idea="Wie schätzen Menschen ab 65 ihre Gesundheit ein?" workshop={<Workshop k="frei_a1" live />} />
    <Questions id="a1-fragen" questions={QUESTIONS.a1} predictionId={PREDICTIONS.a1.id} />
    <Hints steps={hints('a1')} />
    <NoGraphic><code>allbus %&gt;% frequency(hs01)</code> zeigt dieselben Zahlen als Tabelle.</NoGraphic>
    <ErrorHelp />
  </TaskBlock>;
}

/* ---------- Aufgabe 2 ---------- */

type Pic = keyof typeof RIDDLE;
const PICS = Object.keys(RIDDLE) as Pic[];
const VARS = Object.keys(RIDDLE_NAMES) as RiddleVar[];

/** Text version of a riddle picture: relative heights 0 to 10 (picture B has its own text). */
export function riddleText(k: Pic): string {
  const counts = RIDDLE[k].counts;
  if (k === 'B') return RIDDLE_B_TEXT;
  const max = Math.max(...counts);
  return `${counts.length} Balken, relative Höhen von links nach rechts: ${counts.map(a => Math.round(a / max * 10)).join(', ')}.`;
}

type RiddleResult = { ok: number; open: number; each: Partial<Record<Pic, boolean>> };

/** „Der Rätselkasten“: four unlabelled distributions, one select each, feedback per picture and overall. */
function Riddle() {
  const [choice, setChoice] = useState<Record<Pic, string>>({ A: '', B: '', C: '', D: '' });
  const [checked, setChecked] = useState<RiddleResult | null>(null);
  const [message, announce] = useAnnounce('', '');

  function submit(e: FormEvent) {
    e.preventDefault();
    const each: RiddleResult['each'] = {};
    let ok = 0, open = 0;
    for (const k of PICS) {
      if (!choice[k]) { open++; continue; }
      each[k] = choice[k] === RIDDLE[k].answer;
      if (each[k]) ok++;
    }
    setChecked({ ok, open, each });
    announce(open ? `Noch ${open} ohne Zuordnung.` : ok === 4 ? RIDDLE_ALL_RIGHT : `${ok} von 4 richtig. Unter jedem Bild steht, worauf du achten kannst.`);
  }

  return <form id="a2-form" noValidate onSubmit={submit}>
    <div className="raetsel">{PICS.map(k => {
      const counts = RIDDLE[k].counts;
      const right = checked?.each[k];
      return <figure key={k}>
        <figcaption>{k}</figcaption>
        <div><Bars values={counts.map((_, i) => i)} counts={counts} h={130} labels={k === 'B'} labelEvery={10} fill="#A79FE2" stroke="#6f63c9" /></div>
        <p className="sr-only" id={`a2-t${k}`}>{`Verteilung ${k}: ${riddleText(k)}`}</p>
        <label htmlFor={`a2-${k}`} style={{ fontWeight: 700, display: 'block', marginTop: 6 }}>{`Frage zu ${k}`}</label>
        <select id={`a2-${k}`} aria-describedby={`a2-t${k}${right !== undefined ? ` a2-r${k}` : ''}`} value={choice[k]} className={right ? 'passt' : undefined}
          aria-invalid={right === false || undefined} onChange={e => { setChoice(c => ({ ...c, [k]: e.target.value })); setChecked(c => c && { ...c, each: { ...c.each, [k]: undefined } }); }}>
          <option value="">wählen</option>
          {VARS.map(v => <option key={v} value={v}>{`${RIDDLE_NAMES[v]} (${v})`}</option>)}
        </select>
        <span className="hilfe-zeile" id={`a2-r${k}`}>
          {right === true ? <><b className="passt-ja">Passt:</b> {`${RIDDLE_FEATURES[k]}.`}</>
            : right === false ? <><b className="passt-nein">Passt nicht.</b> {`Achte auf: ${RIDDLE_FEATURES[k]}.`}</> : null}
        </span>
      </figure>;
    })}</div>
    <div className="reihe-knoepfe"><button type="submit" className="knopf">Prüfen</button></div>
    <div className={`rueck${checked ? (checked.ok === 4 ? ' ok' : ' no') : ''}`} aria-live="polite">{message}</div>
  </form>;
}

export function Task2() {
  return <TaskBlock id="a2" n={2} title="Der Rätselkasten" required={false} kind="interpret"
    question="Welche Frage steckt hinter welcher Form?"
    goal="Am Ende erkennst du an der Zahl der Ausprägungen, am Modus und an Häufungen, welche Frage hinter einer Verteilung steckt."
    foundationHref="#g2"
    basis={<a href="#g2">Grundlage 2, Formen von Verteilungen</a>}>
    <p>Vier Verteilungen ohne Beschriftung, fünf Fragen aus dem ALLBUS. Ordne zu. Eine Frage bleibt übrig. Achte auf drei Dinge: <b>Wie viele <Begriff id="auspraegung">Ausprägungen</Begriff></b>? <b>Wo liegt der <Begriff id="modus">Modus</Begriff></b>? Gibt es <b>Häufungen</b>?</p>
    <ul style={{ margin: '6px 0 0', fontSize: 15.5 }}>
      <li><code>dw15</code> Arbeitsstunden pro Woche</li>
      <li><code>pa01</code> Links-rechts-Einstufung (1 = links, 10 = rechts)</li>
      <li><code>pa02a</code> Politisches Interesse (1 = sehr stark, 5 = überhaupt nicht)</li>
      <li><code>vm20</code> Sterbehilfe bei dauerhafter Abhängigkeit (−3 sehr falsch, +3 sehr richtig; in R als 1 bis 7 gespeichert)</li>
      <li><code>pt03</code> Vertrauen in den Bundestag (1 = gar keins, 7 = großes)</li>
    </ul>
    <Riddle />
    <p style={{ marginTop: 12 }}>Prüfe eine Zuordnung in R. Tausch <b>beide</b> markierten Stellen gegen die Variable, die du prüfen willst; sie müssen gleich sein. Kontrolle: Unter der x-Achse steht dann die Beschriftung deiner Frage (bei älteren ggplot2-Versionen steht dort der Variablenname).</p>
    <Workshop k="a2" live />
    <TryOut idea="Wie verteilt sich die Frage, die übrig geblieben ist?" workshop={<Workshop k="frei_a2" live />} />
    <Hints steps={hints('a2')} />
    <NoGraphic>Unter jedem Bild steht eine Textfassung mit der Zahl der Balken und ihren Höhen. Prüfen kannst du in R mit {withCode('`allbus %>% frequency(pa01)`')}.</NoGraphic>
    <ErrorHelp />
  </TaskBlock>;
}

/* ---------- Aufgabe 3 ---------- */

export function Task3() {
  return <TaskBlock id="a3" n={3} title="Wie lange dauert der Fragebogen?" required={false}
    question="Wie lange brauchen die Befragten für den Fragebogen?"
    goal="Am Ende hast du ein Histogramm der Bearbeitungsdauer mit einem begründeten Ausschnitt und einer passenden Klassenbreite, und du siehst, wo Menschen runden."
    foundationHref="#g3"
    basis={<a href="#g3">Grundlage 3, das Histogramm</a>}>
    {predict('a3')}
    <Steps>
      <li>Lass dir die Kennzahlen der Bearbeitungsdauer <code>xt10</code> ausgeben. Schau auf Median und <Begriff id="spannweite">Spannweite</Begriff>. <b>Range</b> ist die Spannweite: größter minus kleinster Wert. <Badge>describe(): kennst du aus Sitzung 3</Badge>
        <Workshop k="a3d" live /></li>
      <li>Zeichne ein Histogramm ohne weitere Angaben. Was siehst du, und warum? R meldet zwei Dinge: dass es 30 <Begriff id="klasse">Klassen</Begriff> bildet, und dass 220 Zeilen ohne Wert weggelassen wurden. Beides ist keine Fehlermeldung, sondern ein Hinweis.
        <Workshop k="a3o" live /></li>
      <li>Schneide die extremen Fälle ab: <code>filter(xt10 &lt;= 180)</code> behält nur die Fälle bis 180 Minuten. Wie viele sind danach noch im Bild?
        <Figure svg={filter180} alt={ALT.filter180} caption={<><code>filter()</code> prüft jeden Fall: <code>xt10 &lt;= 180</code> ergibt TRUE, FALSE oder bei fehlender Dauer NA. Nur Fälle mit TRUE bleiben. Darum fallen zwei Gruppen weg: 497 Fälle über 180 Minuten und die 220 ohne Dauer. <span>Im Bild ist jeder Wert ein Stein; das Beispiel hat sechs Befragte, die Zahlen daneben stammen aus dem ALLBUS 2023.</span></>} />
        <Workshop k="a3n" live /></li>
      <li>Stell die Klassenbreite ein. <code>binwidth</code> ist ein Argument von <code>geom_histogram()</code>. Probier <code>binwidth = 5</code>, <code>binwidth = 30</code> und <code>binwidth = 1</code>. <code>boundary = 0</code> sorgt dafür, dass die Klassen bei 0, 5, 10 … beginnen.
        <Figure svg={binwidth} alt={ALT.binwidth} caption={<>Argumente stellen eine Funktion ein. <code>binwidth</code> legt fest, wie breit jede Klasse ist; lässt du es weg, bildet ggplot 30 Klassen. Dieselben sieben Fälle ergeben mit Klassen von 5 Minuten fünf niedrige Säulen, mit Klassen von 30 Minuten zwei hohe. <span>Im Bild ist jede Klasse eine Kiste; das Beispiel hat sieben Befragte.</span></>} />
        <Workshop k="a3m" live /></li>
    </Steps>
    <TryOut idea="Wie viele Fragebögen lagen länger als einen Tag herum, und über welchen Erhebungsweg kamen sie?" workshop={<Workshop k="frei_a3" live />} />
    <Questions id="a3-fragen" questions={QUESTIONS.a3} predictionId={PREDICTIONS.a3.id} />
    <Hints steps={hints('a3')} />
    <NoGraphic><code>allbus %&gt;% describe(xt10)</code> gibt Median und N. Wie oft jede Minutenzahl vorkommt, zeigt <code>allbus %&gt;% filter(xt10 &lt;= 180) %&gt;% frequency(xt10)</code>.</NoGraphic>
    <ErrorHelp />
  </TaskBlock>;
}

/* ---------- Aufgabe 4 ---------- */

export function Task4() {
  return <TaskBlock id="a4" n={4} title="Papier, online oder Interview?" required kind="interpret"
    question="Dauert das Ausfüllen auf Papier länger als online?"
    goal="Am Ende kannst du begründen, bei welchem Erhebungsweg das Ausfüllen am längsten dauert, und sagen, wer dabei im Bild fehlt."
    foundationHref="#g4"
    basis={<a href="#g4">Grundlage 4, Mitte, Streuung und Boxplot</a>}>
    <p>Der ALLBUS 2023 nutzte drei <Begriff id="erhebungsweg">Erhebungswege</Begriff> (<code>mode</code>): <b>CAPI</b> ist ein persönliches Interview mit Laptop, <b>CAWI</b> ein Online-Fragebogen, <b>MAIL</b> ein Papierbogen per Post (<code>mode == 4</code>, kennst du aus Sitzung 2). Die Bearbeitungsdauer <code>xt10</code> hat <Begriff id="ausreisser">Ausreißer</Begriff>: Einzelne Fragebögen lagen wochenlang herum (der längste gut sechs Wochen, über 61.000 Minuten). Damit man im Bild etwas sieht, muss man also einen Ausschnitt wählen. Dafür gibt es zwei Möglichkeiten, und sie führen zu verschiedenen Ergebnissen.</p>
    <p>Noch etwas fällt bei den Papierbögen auf: 71,5 % ihrer Dauerangaben sind Vielfache von 5, also etwa 45, 60 oder 90 Minuten. Beim Interview sind es 39,5 %, online 20 %. Das spricht dafür, dass auf Papier oft geschätzt und gerundet wurde. Bei 220 Papierbögen fehlt die Dauer ganz.</p>
    {predict('a4')}
    <Steps>
      <li><b>Hineinzoomen:</b> <code>coord_cartesian()</code> wählt einen <Begriff id="achsenausschnitt">Achsenausschnitt</Begriff>: Es zeigt nur den Bereich bis 180 Minuten, rechnet aber mit allen Fällen. R meldet dabei „Removed 220 rows“: Das sind die Papierbögen, bei denen die Dauer ganz fehlt.
        <Workshop k="a4" live /></li>
      <li><b>Abschneiden:</b> <code>filter()</code> wirft alle Fälle über 180 Minuten hinaus, bevor gerechnet wird. Vergleiche die beiden Bilder: Wo liegt jetzt die Medianlinie in der Box?
        <Figure svg={zoomFilter} alt={ALT.zoomFilter} caption={<>Die Linie in der Box ist der Median: der mittlere Wert, wenn man die Fälle nach Dauer sortiert. Beim Hineinzoomen rechnen alle Fälle mit, auch die, die über 180 aus dem Bild ragen. Beim Abschneiden fallen die Fälle über 180 Minuten weg, bevor gerechnet wird, und ein anderer Wert steht in der Mitte. <span>Im Bild ist jeder Wert ein Stein; das Beispiel hat sieben Papierbögen.</span></>} />
        <Workshop k="a4f" live /></li>
      <li>Hol dir die Zahlen für einen Erhebungsweg, einmal ohne und einmal mit Filter. Tausch die markierte Zahl: 2 = CAPI, 3 = CAWI, 4 = MAIL. <Badge>describe(): kennst du aus Sitzung 3</Badge><br /><code>show =</code> wählt aus, welche Kennzahlen <code>describe()</code> zeigt, hier Median und Quartile. In der Ausgabe ist <b>Q25</b> das untere <Begriff id="quartil">Quartil</Begriff> (Q1) und <b>Q75</b> das obere (Q3): die Ränder der Box. Das Komma in <code>filter(mode == 4, xt10 &lt;= 180)</code> heißt „und“: Es bleiben nur Papierbögen, die höchstens 180 Minuten dauerten.
        <Workshop k="a4z" live />
        <Workshop k="a4zf" live /></li>
    </Steps>
    <TryOut idea="Sind die Befragten bei den drei Erhebungswegen unterschiedlich alt?" workshop={<Workshop k="frei_a4" live />} />
    <Questions id="a4-fragen" questions={QUESTIONS.a4} predictionId={PREDICTIONS.a4.id} />
    <Plenum><p style={{ margin: '4px 0 0' }}>Welche der beiden Grafiken würdet ihr drucken, und was muss in die Bildunterschrift? Bringt eure Antwort mit.</p></Plenum>
    <Hints steps={hints('a4')} />
    <NoGraphic>Die Vorlagen in Schritt 3 geben Median, Quartile, N und Missing für jeden Erhebungsweg.</NoGraphic>
    <ErrorHelp />
  </TaskBlock>;
}
