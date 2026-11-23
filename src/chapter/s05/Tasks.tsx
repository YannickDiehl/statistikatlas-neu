// Sitzung 5 „Kreuztabellen“: Aufgaben 1 bis 4 mit Fehlerhilfe.
import type { ReactNode } from 'react';
import { useChapterState } from '../ChapterContext';
import { Badge } from '../blocks/Card';
import { Hints } from '../blocks/Hints';
import { Predict } from '../blocks/Predict';
import { NoGraphic, Plenum, Steps, TaskBlock } from '../blocks/TaskBlock';
import { TryOut } from '../blocks/TryOut';
import { withCode } from '../blocks/rich';
import { judge5 } from './check';
import { A2_REVEAL, ERROR_HELP, ERROR_HELP_CAPTION, ERROR_HELP_TITLE, HINTS, PREDICTIONS, QUESTIONS, type Rich } from './content';
import { DenominatorFigure } from './figures/Bars5';
import { MutateA1Figure, UmpolenPe05Figure } from './figures/Towers';
import { Questions5 } from './Questions5';
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
  return <Predict id={p.id} prompt={withCode(p.prompt)} options={p.options} />;
}

/* ---------- Aufgabe 1 ---------- */

export function Task1() {
  return <TaskBlock id="a1" n={1} title="Zwei Gruppen für die Wahlfrage" required
    question="Wer misstraut den Politikern, und wer würde nicht wählen?"
    goal={<>Am Ende hast du zwei neue Variablen mit nur 0 und 1, <code>misstrauen</code> und <code>nichtwahl</code>, und kannst sagen, wie groß jede Gruppe ist und wer herausfällt.</>}
    foundationHref="#g1"
    basis={<><a href="#g1">Grundlage 1, Gruppen bilden</a>; Vorweg: <a href="#r2">eine neue Variable mit <code>mutate()</code> und <code>rec()</code></a></>}>
    <p>Im ALLBUS 2023 sollten die Befragten sagen, ob sie dieser Aussage zustimmen: „Die Politiker kümmern sich nicht viel darum, was Leute wie ich denken.“ (<code>pe01</code>, von „stimme voll zu“ bis „stimme gar nicht zu“). Und sie wurden gefragt, welche Partei sie wählen würden, wenn am nächsten Sonntag Bundestagswahl wäre (<code>pv01</code>). Wer antwortet, er würde nicht wählen, hat den Code 91. Für eine Kreuztabelle brauchst du aus beiden Fragen je zwei Gruppen. <Badge><code>pv01</code> und seine fehlenden Werte: kennst du aus Sitzung 2 und 3</Badge></p>
    <p>Ob die Zustimmung zu dieser Aussage Misstrauen misst, ist eine Frage der <b>Gültigkeit</b> (kennst du aus Sitzung 1): Streng genommen fragt <code>pe01</code>, ob man sich von Politikern beachtet fühlt, nicht nach Vertrauen. Wir nennen die Gruppe hier kurz <code>misstrauen</code>. Wenn du über das Ergebnis berichtest, nennst du die genaue Aussage.</p>
    {predict('a1')}
    <Steps>
      <li><b>Schau dir die Codes von <code>pe01</code> an.</b> <Badge>frequency(): kennst du aus Sitzung 3</Badge><br />
        Führe die Vorlage aus. In der Spalte Value steht der Code jeder Antwort, daneben ihr Wort. Unten fällt eine große Zahl auf: 1.596 Befragte bei ‚TNZ: SPLIT‘. Das heißt: Diese Frage stand nur in einem Teil der Fragebögen (Fragebogensplit). Diese Menschen haben also nicht verweigert, sie wurden nicht gefragt.
        <Workshop k="a1_freq" live /></li>
      <li><b>Bilde die Gruppe <code>misstrauen</code> und prüfe sie.</b> <Badge>neu heute</Badge><br />
        Eine Regel liest du ‚aus diesen alten Codes wird dieser neue Code‘: <code>1=1</code> heißt, aus 1 wird 1; <code>2:4=0</code> heißt, aus 2 bis 4 wird 0. Die Vorlage zählt bisher nur ‚stimme voll zu‘ als Misstrauen. Wer zustimmt, ob voll oder eher, sagt aber, dass sich Politiker nicht kümmern. Passe die beiden markierten Stellen an: Welche Codes gehören zu ‚misstraut‘, welche zu ‚misstraut nicht‘? Die Codes stehen in Schritt 1 in der Spalte Value. Die Kette bildet die Variable und zählt sie gleich aus: Schau auf die Spalte N und auf die Kopfzeile mit <code>mean=</code>.
        <Workshop k="a1_misstrauen" live /></li>
      <li><b>Bilde die Gruppe <code>nichtwahl</code> und prüfe sie.</b><br />
        Diese Regel ist fertig: <code>91=1</code> heißt, aus 91 wird 1; <code>1:90=0</code> heißt, aus 1 bis 90 wird 0 (das sind alle Parteien); alles andere wird leer. Führe die Vorlage aus und schau, wie viele in jeder Gruppe sind und wie viele leer bleiben (Zeile System).
        <Workshop k="a1_nichtwahl" live />
        <MutateA1Figure caption={<><code>mutate()</code> stellt neue Türme neben die alten, in Schritt 2 <code>misstrauen</code>, in Schritt 3 <code>nichtwahl</code>. Bei <code>nichtwahl</code> wird aus 91 eine 1 und aus jeder Partei eine 0. Wer nicht wahlberechtigt ist (Code −50), steht in keiner Regel und wird mit <code>else=NA</code> leer. Wer im Split die Frage nicht bekam, bleibt auch bei <code>misstrauen</code> leer. Wie die übrigen Steine von <code>misstrauen</code> aussehen, entscheidet deine Regel. <span>Die Steine sind ein Beispiel mit fünf Befragten.</span></>} /></li>
    </Steps>
    <TryOut idea={<>Bei <code>nichtwahl</code> fallen 1.262 Befragte heraus, darunter 603 mit „weiß nicht“ (kennst du aus Sitzung 3). Antworten die übrigen auf <code>pe01</code> anders als alle zusammen? Der Vorschlag behält nur, wer bei <code>nichtwahl</code> eine gültige Angabe hat (<code>drop_na()</code> kennst du aus Sitzung 4), und zählt dann <code>pe01</code> aus. Vergleiche die Spalte Valid % mit Schritt 1.</>}
      workshop={<Workshop k="frei_a1" live />} />
    <Questions5 id="a1-fragen" questions={QUESTIONS.a1} predictionId={PREDICTIONS.a1.id} resolve={PREDICTIONS.a1.resolve} />
    <Hints steps={hints('a1')} />
    <NoGraphic>Alle Antworten stehen in den Tabellen der Schritte 1 bis 3.</NoGraphic>
    <ErrorHelp />
  </TaskBlock>;
}

/* ---------- Aufgabe 2 ---------- */

/** The picture „Dieselben 127 Menschen, drei Nenner“ appears once a2a to a2d are right. */
function Reveal() {
  const { state } = useChapterState();
  const all = QUESTIONS.a2.filter(q => A2_REVEAL.includes(q.id));
  if (!all.every(q => judge5(q, state.answers[q.id]) === 'right')) return null;
  return <DenominatorFigure caption={<>Das orange Stück ist immer gleich: 127 Menschen, die misstrauen und nicht wählen würden. Wie groß es wirkt, hängt am Balken, in den du es legst. <span>ALLBUS 2023, n = 2.785, ungewichtet.</span></>} />;
}

export function Task2() {
  return <TaskBlock id="a2" n={2} title="Stimmt die 87 %?" required
    question="Angenommen, du liest diesen Satz: „87 Prozent der Nichtwähler sagen, dass sich Politiker nicht darum kümmern, was Leute wie sie denken.“ Stimmt die Zahl, und worauf bezieht sie sich?"
    goal="Am Ende hast du die 87 % in R gefunden, kannst sagen, wer dabei 100 % ist, und weißt, welche Zahl derselben Zelle welche Frage beantwortet."
    foundationHref="#g2"
    basis={<><a href="#g2">Grundlage 2, Eine Zelle, drei Prozentbasen</a>; Vorweg: <a href="#r3">Kreuztabelle lesen</a></>}>
    {predict('a2')}
    <Steps>
      <li><b>Finde die Prozentbasis, die 87 % ergibt.</b> <Badge>neu heute</Badge><br />
        Die ersten Zeilen der Vorlage bilden <code>misstrauen</code> und <code>nichtwahl</code> wie in Aufgabe 1. Du änderst nur die letzte Zeile. Die Vorlage zeigt Zeilenprozente (<code>"row"</code>). Probier auch <code>"col"</code> (Spaltenprozente) und <code>"total"</code> (Gesamtprozente). Schau jedes Mal auf dieselbe Zelle: Zeile ‚misstraut‘, Spalte ‚würde nicht wählen‘. Bei welcher Basis steht dort 87.0%?
        <Workshop k="a2_ct" live /></li>
      <li><b>Eine Zelle, drei Prozentbasen.</b><br />
        Mit <code>"all"</code> stehen in jeder Zelle drei Prozentzahlen untereinander: <code>row %</code>, <code>col %</code> und <code>total %</code>. Alle drei gehören zu denselben 127 Menschen. Ordne unten jeder Frage ihre Zahl zu.
        <Workshop k="a2_all" live /></li>
    </Steps>
    <TryOut idea="Misstrauen Befragte im Osten häufiger als im Westen?" workshop={<Workshop k="frei_a2" live />} />
    <Questions5 id="a2-fragen" questions={QUESTIONS.a2} predictionId={PREDICTIONS.a2.id} />
    <Reveal />
    <Hints steps={hints('a2')} />
    <NoGraphic>Alle Zahlen stehen in der Ausgabe von Schritt 2.</NoGraphic>
    <ErrorHelp />
  </TaskBlock>;
}

/* ---------- Aufgabe 3 ---------- */

export function Task3() {
  return <TaskBlock id="a3" n={3} title="Gehen Misstrauende nicht mehr wählen?" required kind="interpret"
    question="Gehen Misstrauende nicht mehr wählen?"
    goal="Am Ende kannst du mit der passenden Prozentbasis sagen, ob Misstrauende häufiger nicht wählen wollen als die übrigen, um wie viele Prozentpunkte, und was die Tabelle nicht zeigt."
    foundationHref="#g3"
    basis={<a href="#g3">Grundlage 3, Leserichtung</a>}>
    <p>In Aufgabe 2 hast du gesehen: Die 87 % stimmen, aber ihre Basis sind die Nichtwählenden. Die Leitfrage fragt etwas anderes: Ob Misstrauen mit Nichtwahl zusammenhängt, siehst du nur, wenn du Misstrauende mit den übrigen vergleichst.</p>
    {predict('a3')}
    <Steps>
      <li><b>Stell die Prozentbasis ein.</b><br />
        Die ersten Zeilen bilden wieder <code>misstrauen</code> und <code>nichtwahl</code> wie in Aufgabe 1. Die Vorlage nutzt noch die Spaltenprozente aus Aufgabe 2. <code>misstrauen</code> ist hier die mögliche Ursache (UV) und steht in den Zeilen. Stell die markierte Stelle so ein, dass jede Gruppe von <code>misstrauen</code> 100 % ist.
        <Workshop k="a3_ct" live /></li>
      <li><b>Vergleiche und deute.</b><br />
        Lies in der Spalte ‚würde nicht wählen‘ beide Gruppen ab und zieh ab: Das ist der Abstand in Prozentpunkten. Schau auch in die Spalte ‚würde wählen‘: Wie viele der Misstrauenden wollen wählen?</li>
    </Steps>
    <TryOut idea={<>Wie sieht die Tabelle als Bild aus? Balken auf 100 % zeigen genau die Zeilenprozente. <code>drop_na()</code>, <code>to_label()</code> und <code>position = "fill"</code> kennst du aus Sitzung 4.</>}
      workshop={<Workshop k="frei_a3" live />} />
    <Questions5 id="a3-fragen" questions={QUESTIONS.a3} predictionId={PREDICTIONS.a3.id} />
    <Plenum><p style={{ margin: '4px 0 0' }}>Euer Faktencheck in zwei Sätzen: Was stimmt an „87 Prozent der Nichtwähler …“, und beantwortet die Zahl die Frage, ob Misstrauende nicht mehr wählen gehen? Nennt beide Zahlen mit ihrer Basis.</p></Plenum>
    <Hints steps={hints('a3')} />
    <NoGraphic>Die Tabelle aus Schritt 1 enthält alle Zahlen.</NoGraphic>
    <ErrorHelp />
  </TaskBlock>;
}

/* ---------- Aufgabe 4 ---------- */

export function Task4() {
  return <TaskBlock id="a4" n={4} title="Gegenprobe mit einer umgedrehten Aussage" required={false}
    question="Kommt dasselbe heraus, wenn man Misstrauen mit einer anderen Aussage misst?"
    goal="Am Ende hast du eine zweite Aussage umgepolt, daraus eine Misstrauens-Gruppe gebildet und weißt, warum die Regel aus Aufgabe 1 ohne Umpolen das Gegenteil misst."
    foundationHref="#g4"
    basis={<a href="#g4">Grundlage 4, Umpolen</a>}>
    <p>Im selben Fragebogenteil stand die Aussage: „Die Politiker vertreten die Interessen der Bevölkerung.“ (<code>pe05</code>, wieder von 1 „stimme voll zu“ bis 4 „stimme gar nicht zu“). Wer hier zustimmt, vertraut den Politikern. Misstrauen zeigt, wer <b>nicht</b> zustimmt. Die Aussage ist also andersherum gestellt als <code>pe01</code>.</p>
    {predict('a4')}
    <Steps>
      <li><b>Pol pe05 um.</b> <Badge>neu heute</Badge><br />
        <code>rules = "rev"</code> dreht die Codes um: Aus 1 wird 4, aus 2 wird 3, aus 3 wird 2, aus 4 wird 1. Prüf in der Ausgabe, welches Wort jetzt bei Code 1 steht.
        <Workshop k="a4_um" live />
        <UmpolenPe05Figure caption={<>Umpolen dreht die Codes, die Wörter wandern mit. Danach heißt eine kleine Zahl bei pe05 dasselbe wie bei pe01: Misstrauen. Fehlende Werte bleiben leer. <span>Die Steine sind ein Beispiel mit fünf Befragten.</span></>} /></li>
      <li><b>Bilde die Misstrauens-Gruppe und vergleiche.</b><br />
        Die Kette polt pe05 wie in Schritt 1 um, bildet daraus <code>misstrauen_pe05</code> und dazu <code>nichtwahl</code> wie in Aufgabe 1. Nach dem Umpolen steht bei <code>pe05_um</code> die 1 für ‚stimme gar nicht zu‘ und die 2 für ‚stimme eher nicht zu‘. Wie in Aufgabe 1 zählt bisher nur der äußerste Code als Misstrauen. Passe die markierten Stellen an: Welche Codes von <code>pe05_um</code> heißen jetzt Misstrauen?
        <Workshop k="a4_mutate" live /></li>
      <li><b>Zum Vergleich: ohne Umpolen.</b><br />
        Was wäre passiert, wenn du die Regel aus Aufgabe 1 einfach auf pe05 übertragen hättest? Führe die Vorlage aus und vergleiche mit Schritt 2. Hier fehlt die Zeile mit <code>rev</code>.
        <Workshop k="a4_ohne" live /></li>
    </Steps>
    <TryOut idea={<>Eine dritte Aussage, „Politiker vertreten nur die Interessen der Reichen“ (<code>pa35</code>), hat fünf Stufen mit „teils/teils“ in der Mitte. Wohin gehört „teils/teils“, und ändert das etwas?</>}
      workshop={<Workshop k="frei_a4" live />} />
    <Questions5 id="a4-fragen" questions={QUESTIONS.a4} predictionId={PREDICTIONS.a4.id} />
    <Hints steps={hints('a4')} />
    <NoGraphic>Alle Zahlen stehen in den Ausgaben der Schritte 1 bis 3.</NoGraphic>
    <ErrorHelp />
  </TaskBlock>;
}
