// Sitzung 1 „Einstieg“: Aufgaben 1 bis 4 mit Datei laden, Antwortfragen, Hilfen und Fehlerhilfe.
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { DataDrop } from '../../sandbox/ui/DataDrop';
import { judge } from '../answers';
import { useAllbus } from '../allbusContext';
import { useChapterState } from '../ChapterContext';
import { Badge } from '../blocks/Card';
import { Hints } from '../blocks/Hints';
import { Predict } from '../blocks/Predict';
import { Questions } from '../blocks/Questions';
import { withCode } from '../blocks/rich';
import { NoGraphic, Plenum, Steps, TaskBlock } from '../blocks/TaskBlock';
import { TryOut } from '../blocks/TryOut';
import { A2_ALL_RIGHT, ERROR_HELP, ERROR_HELP_CAPTION, ERROR_HELP_TITLE, HINTS, PREDICTIONS, QUESTIONS, type Rich } from './content';
import { EnvironmentPicture } from './figures/Pictures';
import { Workshop } from './ReadR';

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
      <thead><tr><th scope="col">R meldet (RStudio deutsch / Werkstatt englisch)</th><th scope="col">Das hilft</th></tr></thead>
      <tbody>{ERROR_HELP.map((row, i) => <tr key={i}><td>{rich(row.says)}</td><td>{rich(row.helps)}</td></tr>)}</tbody>
    </table>
  </details>;
}

function predict(key: keyof typeof PREDICTIONS) {
  const p = PREDICTIONS[key];
  return <Predict id={p.id} prompt={withCode(p.prompt)} options={p.options} />;
}

const NO_GRAPHIC = 'Alle Ausgaben dieser Aufgabe sind Text.';

/* ---------- Aufgabe 1 ---------- */

/** Text of the „already stored“ state that replaces the drop zone. */
export const FILE_STORED = '✓ Deine ALLBUS-Datei ist gespeichert. Du kannst direkt mit Schritt 2 weitermachen.';

/** Text when the file is loaded but the browser could not keep it. */
export const FILE_NOT_STORED = '✓ Deine ALLBUS-Datei ist geladen. Dein Browser speichert sie aber nicht: Nach dem Neuladen wählst du sie hier erneut.';

/** Step 1 of task 1: the real drop zone of the atlas, wired to the chapter's ALLBUS context; once a file is there, a status line. */
export function FileStep() {
  const { data, setData, markStored, notStored, restoring } = useAllbus();
  const statusRef = useRef<HTMLParagraphElement>(null);
  const [viaZone, setViaZone] = useState(false);
  // Focus the status line only when the file came through this zone, never on restore after page load.
  useEffect(() => { if (viaZone && data) statusRef.current?.focus(); }, [viaZone, data]);
  return <>
    <p>Die Code-Werkstatt rechnet mit deiner eigenen ALLBUS-Datei. Du lädst sie hier <b>einmal</b>. Danach gilt sie für alle Sitzungen des Lernpfads, auch wenn du die Seite neu lädst oder den Browser schließt. Die Datei bleibt in deinem Browser auf deinem Rechner gespeichert, bis du sie entfernst. <b>Hochgeladen wird nichts</b>: Die Datei verlässt deinen Rechner nicht.</p>
    <div role="status">
      {data ? <p className="rueck ok s1-gespeichert" tabIndex={-1} ref={statusRef}>{notStored ? FILE_NOT_STORED : FILE_STORED}</p> : null}
    </div>
    {data || restoring ? null
      : <div className="s1-datei"><DataDrop onLoaded={d => { setViaZone(true); setData(d); }} onStored={markStored} /></div>}
    <ul className="s1-liste">
      <li><b>Entfernen:</b> Links unter der Sitzungsliste steht ‚Gespeicherte ALLBUS-Datei entfernen‘. Danach ist die Datei aus dem Browser gelöscht; auf deinem Rechner bleibt deine heruntergeladene Datei natürlich erhalten.</li>
      <li><b>Wann musst du sie neu laden?</b> Auf einem anderen Gerät oder in einem anderen Browser, wenn du die Website-Daten gelöscht hast oder Safari sie nach etwa sieben Tagen ohne Besuch entfernt hat. Dann bittet dich die Code-Werkstatt selbst darum.</li>
      <li>Ohne Datei kannst du alles lesen und deine Antworten prüfen. Nur <span aria-hidden="true">▶</span> Ausführen braucht die Datei.</li>
    </ul>
  </>;
}

export function Task1() {
  return <TaskBlock id="a1" n={1} title="Startklar" required
    question="Hast du den ALLBUS in R, und wie groß ist er?"
    goal="Am Ende ist deine ALLBUS-Datei im Lernpfad gespeichert, du hast sie in der Code-Werkstatt und in RStudio eingelesen und kannst sagen, wie viele Befragte und Variablen sie hat und wie viele Zellen das sind."
    foundationHref="#g1"
    basis={<><a href="#g1">Grundlage 1, R, RStudio und deine Datei</a> und <a href="#r2">Vorweg: Die Code-Werkstatt</a></>}>
    {predict('a1')}
    <Steps>
      <li><b>Deine ALLBUS-Datei laden.</b> <Badge>neu</Badge>
        <FileStep /></li>
      <li><b>Wie groß ist der ALLBUS?</b> <Badge>neu</Badge> Jetzt deine erste Werkstatt. <code>allbus</code> ist hier schon deine Datei. <code>dim()</code> steht für <i>dimensions</i>: Die Funktion gibt zwei Zahlen aus, erst die Zeilen (Befragte), dann die Spalten (Variablen). Drück <b><span aria-hidden="true">▶</span> Ausführen</b> oder setz den Cursor in die Zeile und drück Strg/Cmd + Enter. Beim ersten Mal startet R; das dauert etwa eine halbe Minute.
        <Workshop k="a1_dim" />
        <p className="hilfe-zeile"><code>[1]</code> heißt: Hier beginnt die Ausgabe. Die Zahlen danach sind das Ergebnis.</p></li>
      <li><b>R rechnet: Wie viele Zellen sind das?</b> Jede Befragte hat für jede Variable eine Zelle. Setz an den markierten Stellen die beiden Zahlen aus Schritt 2 ein, so wie R sie schreibt: ohne Tausenderpunkt, also <code>5246</code>, nicht <code>5.246</code>. Für R ist der Punkt ein Komma: <code>5.246</code> wäre fünf Komma zwei. Führ die Vorlage dann aus. Probier danach Zurücksetzen: Die Vorlage kommt zurück.
        <Workshop k="a1_zellen" />
        <p className="hilfe-zeile">Unverändert ausgeführt meldet R ‚Objekt 'Befragte' nicht gefunden‘ (in der Werkstatt englisch: object 'Befragte' not found): Ohne Anführungszeichen liest R <code>Befragte</code> als Namen eines Objekts, und das gibt es nicht. Setz die Zahlen ein. R schreibt Kommazahlen mit Punkt: 35.15549 heißt etwa 35,2.</p></li>
      <li><b>Dasselbe in RStudio.</b> Öffne RStudio über dein Projekt (<a href="#g1c">Grundlage 1c</a>), kopiere den Startblock in dein Skript und führ ihn Zeile für Zeile mit Strg/Cmd + Enter aus. Schau dann oben rechts ins Environment.
        <Workshop k="start" id="start-a1" />
        <EnvironmentPicture caption={<>So zeigt RStudio dein Objekt <code>allbus</code>. Die Zahlen siehst du bei dir; sie sind dieselben wie bei <code>dim(allbus)</code>.</>} />
        <p className="hilfe-zeile">Läuft RStudio bei dir noch nicht, kannst du die Fragen mit der Werkstatt beantworten und die Installation mit dem Setup-Guide in ILIAS nachholen.</p></li>
    </Steps>
    <TryOut idea={<>Wie heißen die Variablen? <code>names()</code> zeigt alle Variablennamen. Woran erkennst du Variablen, die zusammengehören?</>} workshop={<Workshop k="frei_a1" />} />
    <Questions id="a1-fragen" questions={QUESTIONS.a1} predictionId={PREDICTIONS.a1.id} />
    <Hints steps={hints('a1')} />
    <NoGraphic>{NO_GRAPHIC}</NoGraphic>
    <ErrorHelp />
  </TaskBlock>;
}

/* ---------- Aufgabe 2 ---------- */

/** The extra sentence after „Alles richtig.“ of task 2 (the Questions block has no slot for it). */
function A2Extra() {
  const { state } = useChapterState();
  const all = QUESTIONS.a2.every(q => judge(q, state.answers[q.id]) === 'right');
  return <p className="rueck ok" aria-live="polite">{all ? A2_ALL_RIGHT : ''}</p>;
}

export function Task2() {
  return <TaskBlock id="a2" n={2} title="Schon gefragt?" required kind="interpret"
    question="Hat der ALLBUS 2023 schon gefragt, was dich interessiert?"
    goal="Am Ende hast du für vier Ideen geprüft, ob der ALLBUS sie schon fragt, und kannst erklären, warum ‚kein Treffer‘ noch nicht ‚gibt es nicht‘ heißt und ein Treffer nicht immer passt."
    foundationHref="#g2"
    basis={<a href="#g2">Grundlage 2, Variablen finden</a>}>
    <p>Vier Ideen für Fragen an die Bevölkerung:</p>
    <ol className="s1-liste">
      <li>Halten die Leute etwas von Horoskopen?</li>
      <li>Wie viele haben Angst vor Geflüchteten?</li>
      <li>Vertrauen die Menschen der Politik noch?</li>
      <li>Wie einsam sind die Menschen?</li>
    </ol>
    <p>Für jede suchst du im ALLBUS: Gibt es eine Variable, die das misst? Wenn nicht, müsste man die Frage neu stellen.</p>
    {predict('a2')}
    <Steps>
      <li><b>Idee 1: Horoskope.</b> Die erste Suche ist vorgemacht. Führ sie aus und lies das Variablenlabel.
        <Workshop k="a2_idee1" /></li>
      <li><b>Idee 2: Angst vor Geflüchteten.</b> Führ die Vorlage erst so aus, wie sie ist. Findet R nichts, ändere das markierte Suchwort so, wie du es in <a href="#g2">Grundlage 2</a> gelernt hast, und führ sie noch einmal aus. Tipp: Ein kurzer Wortanfang findet auch abgekürzte Labels. Lies alle Treffer: Misst einer davon Angst?
        <Workshop k="a2_idee2" /></li>
      <li><b>Idee 3: Vertrauen in die Politik.</b> Führ die Vorlage aus und lies die Treffer. Misst einer davon Vertrauen? Wenn nicht: Welches Wort aus der Idee würde im Label stehen? Ändere die markierte Stelle.
        <Workshop k="a2_idee3" />
        <p className="hilfe-zeile">‚Die Politik‘ kann Verschiedenes meinen: den Bundestag, die Bundesregierung, die Parteien. Du musst entscheiden, was die Idee meint.</p></li>
      <li><b>Idee 4: Einsamkeit.</b> Führ die Vorlage aus. Prüf jeden Treffer: Geht es wirklich um Einsamkeit? Probier danach weitere Wörter, etwa ‚allein‘ oder ‚freund‘.
        <Workshop k="a2_idee4" /></li>
    </Steps>
    <TryOut idea="Wenn der ALLBUS nach Horoskopen fragt, fragt er vielleicht auch nach Tarot-Karten? Oder such nach einer Frage, die dich selbst interessiert." workshop={<Workshop k="frei_a2" />} />
    <Questions id="a2-fragen" questions={QUESTIONS.a2} predictionId={PREDICTIONS.a2.id} />
    <A2Extra />
    <Plenum><p style={{ margin: '4px 0 0' }}>Bei welchen Ideen würdet ihr eine vorhandene Variable nehmen, bei welchen neu fragen? Bei Idee 2 und 3 gibt es keine eindeutige Antwort. Bringt eure Entscheidung und einen Satz Begründung mit.</p></Plenum>
    <Hints steps={hints('a2')} />
    <NoGraphic>{NO_GRAPHIC}</NoGraphic>
    <ErrorHelp />
  </TaskBlock>;
}

/* ---------- Aufgabe 3 ---------- */

export function Task3() {
  return <TaskBlock id="a3" n={3} title="Belegen" required
    question="Was genau misst die Variable, und wie viele haben gültig geantwortet?"
    goal={<>Am Ende kannst du für die Horoskop-Frage <code>rh08b</code> und die Vertrauensfrage <code>pt03</code> aus Aufgabe 2 sagen, was die Codes bedeuten, wie viele gültig geantwortet haben und wem die Frage gar nicht gestellt wurde.</>}
    foundationHref="#g3"
    basis={<a href="#g3">Grundlage 3, Codebuch und erster Blick</a>}>
    {predict('a3')}
    <Steps>
      <li><b>Im Codebuch nachschlagen (in RStudio).</b> Öffne in RStudio das ganze Codebuch und such darin mit Strg + F (Mac: Cmd + F) nach <code>rh08b</code>. Dort siehst du Variablenlabel, Codes, Wertelabels und Häufigkeiten. Die letzte Zeile der Vorlage schlägt nur <code>rh08b</code> nach. Ohne RStudio: weiter mit Schritt 2, dort steht dasselbe.
        <Workshop k="a3_codebuch" /></li>
      <li><b>Erster Blick auf rh08b.</b> <Badge>neu: erster Blick, ausführlich in Sitzung 3</Badge> <code>frequency()</code> zählt aus, wie oft jeder Code vorkommt. Erstes Argument: der Datensatz, zweites: die Variable, ohne Anführungszeichen. Lies in der Ausgabe: Value ist der Code, Label das Wertelabel, N die Anzahl. Unter ‚Total valid‘ stehen die gültigen Antworten, darunter die fehlenden Werte.
        <Workshop k="a3_rh08b" /></li>
      <li><b>Die Vertrauensfrage pt03.</b> Tausch die markierte Variable gegen <code>pt03</code> und führ die Vorlage aus. Bei den Codes 2 bis 6 steht als Wertelabel nur ‚..‘: Diese Ausprägungen liegen zwischen GAR KEIN VERTRAUEN (1) und GROSSES VERTRAUEN (7) und haben kein eigenes Wort.
        <Workshop k="a3_pt03" /></li>
    </Steps>
    <TryOut idea={<>Vertrauen die Befragten den politischen Parteien (<code>pt15</code>) weniger als dem Bundestag? Vergleiche, wie viele GAR KEIN VERTRAUEN und wie viele GROSSES VERTRAUEN haben.</>} workshop={<Workshop k="frei_a3" />} />
    <Questions id="a3-fragen" questions={QUESTIONS.a3} predictionId={PREDICTIONS.a3.id} />
    <Hints steps={hints('a3')} />
    <NoGraphic>{NO_GRAPHIC}</NoGraphic>
    <ErrorHelp />
  </TaskBlock>;
}

/* ---------- Aufgabe 4 ---------- */

export function Task4() {
  return <TaskBlock id="a4" n={4} title="Reparieren" required={false}
    question="Was will R dir mit einer Fehlermeldung sagen?"
    goal="Am Ende hast du vier kaputte Zeilen mit Hilfe der Fehlermeldungen repariert und aus den reparierten Ausgaben je eine Zahl abgelesen."
    foundationHref="#g4"
    basis={<a href="#g4">Grundlage 4, Fehlermeldungen lesen</a>}>
    {predict('a4')}
    <p>In jeder Vorlage steckt genau ein Fehler. Führ sie aus, lies die Meldung, repariere die Zeile und führ sie noch einmal aus. Zurücksetzen holt die kaputte Zeile zurück.</p>
    <Steps>
      <li><Workshop k="a4_1" /></li>
      <li><Workshop k="a4_2" /></li>
      <li><Workshop k="a4_3" /></li>
      <li><Workshop k="a4_4" /></li>
    </Steps>
    <TryOut idea={<>Manche Fehlermeldungen sagen dir sogar, was erlaubt ist. Die Vorlage sucht nur in den Variablennamen. Ändere <code>"name"</code> in <code>"titel"</code> und lies, welche Einstellungen R vorschlägt.</>} workshop={<Workshop k="frei_a4" />} />
    <Questions id="a4-fragen" questions={QUESTIONS.a4} predictionId={PREDICTIONS.a4.id} />
    <Hints steps={hints('a4')} />
    <NoGraphic>{NO_GRAPHIC}</NoGraphic>
    <ErrorHelp />
  </TaskBlock>;
}
