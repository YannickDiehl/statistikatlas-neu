import { Download, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { downloadText } from '../../domain/mariposa';
import type { SavFile } from '../../sandbox/readSav';
import { Feedback } from '../kit/Feedback';
import { HintLadder } from '../kit/HintLadder';
import { PartnerToggle } from '../kit/PartnerToggle';
import { PlenumCard } from '../kit/PlenumCard';
import { RBlock } from '../kit/RBlock';
import { RoleBrief } from '../kit/RoleBrief';
import { StepGuide } from '../kit/StepGuide';
import { Toolbox } from '../kit/Toolbox';
import type { TaskProps } from '../types';
import { antraege, EXAMPLE_SCRIPT, handshakeHint, TOOLBOX_SCRIPT, type Antrag, type AntragId } from './content';
import { checkHandshake, checkStamp, decodeError, findVar, lowestLabel, plenumLines, reportMarkdown, rScript, stampComplete, validCount, type S01State, type SearchResult, type Stamp } from './domain';
import type { WorkMode } from '../kit/PartnerToggle';
import { TextAnswer } from '../kit/TextAnswer';

const splitWords = (text: string) => text.split(/[,;\n]/).map(w => w.trim()).filter(Boolean);

/** Freitext für Suchwörter: Der Rohtext bleibt beim Tippen erhalten (Komma, Leerzeichen); übernommen werden die getrennten Wörter. */
function SearchWordsInput({ words, onChange }: { words: string[]; onChange: (words: string[]) => void }) {
  const [text, setText] = useState(words.join(', '));
  useEffect(() => {
    if (splitWords(text).join('|') !== words.join('|')) setText(words.join(', '));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words.join('|')]);
  return <input type="text" value={text} onChange={e => { setText(e.target.value); onChange(splitWords(e.target.value)); }} />;
}

function SearchTester({ sav, onSearched }: { sav: SavFile; onSearched: (word: string) => void }) {
  const [word, setWord] = useState('');
  const [result, setResult] = useState<{ word: string; r: SearchResult } | null>(null);
  const run = () => { const r = findVar(sav, word); setResult({ word: word.trim(), r }); if (r.ok) onSearched(word.trim()); };
  return <div className="s01-tester">
    <label className="sandbox-search">
      <Search size={16} aria-hidden="true" />
      <input type="search" value={word} placeholder="Suchwort testen, z. B. einen Wortanfang" aria-label="Suchwort testen"
        onChange={e => setWord(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') run(); }} />
      <button onClick={run}>Treffer zählen</button>
    </label>
    {result && (result.r.ok
      ? <><p className="sandbox-note" role="status">{result.r.hits.length === 0
          ? <>Kein Treffer für „{result.word}“. Probier ein anderes Suchwort.</>
          : <>{result.r.hits.length} Treffer für „{result.word}“. Welche Variablen das sind und was sie messen, siehst du in R.</>}</p><Feedback notes={result.r.notes} /></>
      : <p className="sandbox-error" role="status">{result.r.message}</p>)}
  </div>;
}

function StampEditor({ sav, antrag, stamp, onChange }: { sav: SavFile; antrag: Antrag | null; stamp: Stamp; onChange: (s: Stamp) => void }) {
  const set = (patch: Partial<Stamp>) => onChange({ ...stamp, ...patch });
  return <div className="s01-stamp">
    <p className="task-prompt">Gibt es im ALLBUS schon eine passende Frage?</p>
    <div className="sandbox-chips" role="group" aria-label="Entscheidung">
      <button aria-pressed={stamp.decision === 'take'} onClick={() => set({ decision: 'take' })}>Gibt es schon</button>
      <button aria-pressed={stamp.decision === 'ask'} onClick={() => set({ decision: 'ask' })}>Neu fragen</button>
    </div>
    {stamp.decision === 'take' && <>
      <p className="sandbox-note">Belege deine Wahl mit dem Codebuch: Such die Variable in <code>codebook(allbus)</code> mit <kbd>Strg</kbd> + <kbd>F</kbd> (Mac: <kbd>Cmd</kbd> + <kbd>F</kbd>). Dort stehen die Codes mit ihren Wertelabels und wie oft jeder Code vorkommt (Spalte Freq.).</p>
      <div className="task-grid">
        <label>Welche Variable passt?<small className="task-field-help">Ihr Name, so wie er in R steht</small><input type="text" value={stamp.variable} placeholder="z. B. rh08b" onChange={e => set({ variable: e.target.value })} /></label>
        <label>Welches Wertelabel steht beim kleinsten Code?<small className="task-field-help">Das Wort dazu im Codebuch – negative Codes zählen nicht</small><input type="text" value={stamp.lowest} onChange={e => set({ lowest: e.target.value })} /></label>
        <label>Wie viele Befragte haben gültig geantwortet?<small className="task-field-help">Alle Befragten minus die fehlenden Werte</small><input type="text" inputMode="numeric" value={stamp.valid} onChange={e => set({ valid: e.target.value })} /></label>
      </div>
      <p className="sandbox-note">Fehlende Werte erkennst du im Codebuch an den negativen Codes, etwa „KEINE ANGABE“ oder „TNZ“ (trifft nicht zu). Wie oft sie vorkommen, steht in der Spalte Freq.</p>
    </>}
    {stamp.decision === 'ask' && <>
      <div className="task-grid">
        <label>Mit welchen Suchwörtern hast du gesucht?<small className="task-field-help">Mindestens zwei, mit Komma getrennt. Wörter, die du oben mit „Treffer zählen“ getestet hast, stehen schon drin.</small><SearchWordsInput words={stamp.searches} onChange={searches => set({ searches })} /></label>
      </div>
      <TextAnswer label="Warum passt keiner der Treffer?" help="Ein Satz genügt: Wonach fragen die Treffer – und was wollte die Idee wissen?"
        example="z. B. Die Idee fragt, wie oft Menschen über Politik streiten. Die Treffer fragen nur, wie sehr sie sich für Politik interessieren."
        value={stamp.note} onChange={note => set({ note })} />
    </>}
    <Feedback notes={checkStamp(sav, antrag, stamp)} />
  </div>;
}

/** Wer bearbeitet welche Idee? Idee 1 ist das vorgemachte Beispiel. */
const cardBadge = (n: number, mode: WorkMode) => mode === 'solo'
  ? (n === 1 ? 'Beispiel' : '')
  : ['gemeinsam', 'Person A', 'Person B', 'beide, dann vergleichen'][n - 1] ?? '';

function AntragCard({ n, antrag, stamp, sav, badge, onChange, onConcept }: { n: number; antrag: Antrag; stamp: Stamp; sav: SavFile; badge: string; onChange: (s: Stamp) => void; onConcept: (id: string) => void }) {
  const addSearch = (word: string) => { if (!stamp.searches.includes(word)) onChange({ ...stamp, searches: [...stamp.searches, word] }); };
  return <article className="task-card s01-antrag" aria-labelledby={`s01-antrag-${antrag.id}`}>
    <h4 id={`s01-antrag-${antrag.id}`}>Idee {n}: „{antrag.text}“{badge && <span className="s01-badge">{badge}</span>}</h4>
    <SearchTester sav={sav} onSearched={addSearch} />
    <StampEditor sav={sav} antrag={antrag} stamp={stamp} onChange={onChange} />
    <HintLadder hint={antrag.hint} onConcept={onConcept} />
  </article>;
}

function ErrorDecoder() {
  const [message, setMessage] = useState('');
  const decoded = message.trim() ? decodeError(message) : null;
  return <details className="s01-decoder">
    <summary>R zeigt eine Fehlermeldung? Hier einfügen</summary>
    <textarea value={message} aria-label="Fehlermeldung aus R" placeholder="z. B. Fehler … konnte Funktion nicht finden" onChange={e => setMessage(e.target.value)} />
    {message.trim() && (decoded
      ? <p className="sandbox-note" role="status"><strong>{decoded.cause}</strong> {decoded.fix}</p>
      : <p className="sandbox-note" role="status">Diese Meldung kenne ich nicht. Vergleich deinen Code Zeichen für Zeichen mit der Vorlage oder frag jemanden neben dir.</p>)}
  </details>;
}

function EmergencyConsole({ sav }: { sav: SavFile }) {
  const [word, setWord] = useState('');
  const result = word.trim() ? findVar(sav, word) : null;
  return <details className="s01-emergency">
    <summary>R läuft gerade nicht? Hier vorläufig suchen</summary>
    <p className="sandbox-note">Diese Suche ahmt find_var() hier im Atlas nach. Sie zeigt Variablennamen und Variablenlabels, aber kein Codebuch. Schritt 1 lässt sich nur mit R abschließen.</p>
    <input type="search" value={word} aria-label="Notfallsuche" onChange={e => setWord(e.target.value)} />
    {result && (result.ok
      ? <ul className="sandbox-found">{result.hits.slice(0, 30).map(v => <li key={v.name}><code>{v.name}</code> <small>{v.label}</small></li>)}</ul>
      : <p className="sandbox-error">{result.message}</p>)}
  </details>;
}

/** Idee 1 vorgemacht: Suche, Treffer, Codebuch, Entscheidung. Zahlen kommen aus der geladenen Datei. */
function WorkedExample({ sav }: { sav: SavFile }) {
  const v = sav.byName.get('rh08b');
  const de = (x: number) => x.toLocaleString('de-DE');
  const valid = v ? validCount(v) : null;
  const lowest = v ? lowestLabel(v) : null;
  return <div className="task-card s01-example">
    <h4>Vorgemacht: Idee 1 „{antraege[0].text}“</h4>
    <p className="sandbox-note">So sieht eine Prüfung von Anfang bis Ende aus. Mach die Schritte in RStudio mit – die Ideen 2 bis 4 prüfst du danach genauso, aber selbst.</p>
    <RBlock code={EXAMPLE_SCRIPT} file="schon-gefragt-beispiel.R" />
    <ol className="s01-example-steps">
      <li><strong>Suchwort:</strong> „horoskop“ – kurz und ohne Umlaut.</li>
      <li><strong>Treffer:</strong> Beide Wege führen zu genau einer Variable: <code>rh08b</code> mit dem Variablenlabel „{v?.label ?? 'HALTE VON: ASTROLOGIE, HOROSKOPE'}“.</li>
      <li><strong>Genau hinsehen:</strong> Im Codebuch steht bei <code>rh08b</code> jede Ausprägung: jeden Code (die gespeicherte Zahl) mit seinem Wertelabel (dem Wort dazu){lowest && <> – beim kleinsten Code steht „{lowest}“</>}. Die negativen Codes sind fehlende Werte, etwa „KEINE ANGABE“.</li>
      {v && valid !== null && <li><strong>Gültige Antworten zählen:</strong> {de(sav.nCases)} Befragte minus {de(sav.nCases - valid)} fehlende Werte (Spalte Freq. bei den negativen Codes) = {de(valid)} gültige Antworten.</li>}
      <li><strong>Entscheidung:</strong> <em>Gibt es schon</em> – die Frage misst genau, was die Idee wissen will.</li>
    </ol>
    <p className="sandbox-note">Trag das Ergebnis jetzt in die Karte zu Idee 1 ein. So siehst du auch, wie die Rückmeldungen aussehen.</p>
  </div>;
}

export function SchonGefragt({ data, state, onChange, onConcept }: TaskProps<S01State>) {
  const set = (patch: Partial<S01State>) => onChange({ ...state, ...patch });
  const setStamp = (id: AntragId, stamp: Stamp) => set({ stamps: { ...state.stamps, [id]: stamp } });
  const decided = antraege.filter(a => stampComplete(state.stamps[a.id])).length;
  return <div className="task s01">
    <RoleBrief role="Referent:in im Abgeordnetenbüro" title="Schon gefragt?">
      <p><strong>Willkommen im Büro.</strong> Du arbeitest ab heute für eine Bundestagsabgeordnete. Sie will im Frühjahr eine eigene Umfrage durchführen lassen. Jede Frage darin kostet Geld. Deshalb lohnt sich ein Blick in den ALLBUS 2023: eine große Befragung, die die Wissenschaft frei nutzen darf. Was dort schon gut gefragt wurde, muss das Büro nicht noch einmal bezahlen.</p>
      <p>Auf deinem Tisch liegen vier Frageideen. Bei jeder entscheidest du:</p>
      <ul>
        <li><strong>Gibt es schon:</strong> Der ALLBUS hat eine passende Frage. Du nennst die Variable und belegst mit dem Codebuch, was sie misst.</li>
        <li><strong>Neu fragen:</strong> Der ALLBUS hat nichts Passendes. Du zeigst, mit welchen Suchwörtern du gesucht hast.</li>
      </ul>
      <p>Beide Fehler kosten etwas. Nimmst du eine Frage, die eigentlich etwas anderes misst, arbeitet das Büro mit falschen Zahlen. Lässt du eine Frage neu stellen, die es längst gibt, zahlt das Büro doppelt.</p>
      <p>Die Frage, die dich heute begleitet: <strong>Was hat der ALLBUS schon gefragt – und misst es wirklich, was das Büro wissen will?</strong></p>
      <p><strong>Was du dabei lernst:</strong> Daten in R einlesen, Variablen auf zwei Wegen suchen (mit <code>find_var()</code> oder im Codebuch) und nachlesen, was eine Frage genau misst.</p>
    </RoleBrief>
    <PartnerToggle mode={state.mode} onChange={mode => set({ mode })}
      solo="Du prüfst alle vier Ideen allein. Wählst du „Neu fragen“, meldet sich eine Kollegin mit einem Hinweis – vielleicht hast du etwas übersehen."
      pair="Idee 1 geht ihr gemeinsam am Beispiel durch. Dann prüft A Idee 2 und B Idee 3. Idee 4 prüft ihr beide und vergleicht, ob ihr zum selben Ergebnis kommt. Zum Schluss tauscht ihr: Wo die andere Person „Neu fragen“ gewählt hat, sucht ihr mit zwei eigenen Suchwörtern nach." />

    <Toolbox file="schon-gefragt-werkzeuge.R" code={TOOLBOX_SCRIPT} tools={[
      { fn: 'library()', isNew: true, text: <>lädt ein Paket. <code>library(tidyverse)</code> bringt eine Sammlung von Zusatzpaketen, <code>library(mariposa)</code> die Funktionen für unsere Auswertungen. Lade mariposa immer als Zweites.</> },
      { fn: 'read_spss()', isNew: true, text: <>liest eine SPSS-Datei ein. Mit <code>file.choose()</code> wählst du sie in einem Fenster aus; liegt sie im Arbeitsverzeichnis, reicht der Dateiname. Mit <code>allbus &lt;-</code> speicherst du die Daten unter dem Namen <code>allbus</code>.</> },
      { fn: 'find_var()', isNew: true, text: <>sucht alle Variablen, deren Name oder Variablenlabel (die kurze Beschreibung der Frage) ein Wort enthält.</> },
      { fn: 'codebook()', isNew: true, text: <>öffnet das ganze Codebuch im Viewer. Darin suchst du wie auf einer Webseite mit <kbd>Strg</kbd> + <kbd>F</kbd> (Mac: <kbd>Cmd</kbd> + <kbd>F</kbd>).</> },
    ]} />

    <section className="task-step">
      <h3>1 · Daten in R laden</h3>
      <StepGuide
        why="Bevor du suchen kannst, muss R die ALLBUS-Datei kennen. Zwei Zahlen zeigen dir, ob das Einlesen geklappt hat."
        steps={[
          <>Lade in RStudio die Pakete und lies die ALLBUS-Datei ein. Die Befehle dafür stehen im Werkzeugkasten oben. Für das Einlesen gibt es dort zwei Wege – such dir einen aus. Unter macOS liegt das Auswahlfenster manchmal hinter RStudio.</>,
          <>Schau ins Fenster oben rechts (<em>Environment</em>). Dort steht jetzt <code>allbus</code> mit „… obs. of … variables“. <em>obs.</em> steht für <em>observations</em>, also die Zahl der Befragten (jede Zeile im Datensatz ist eine befragte Person). <em>variables</em> sind die Variablen (je eine Frage, eine Spalte im Datensatz). Trag beide Zahlen unten ein.</>,
        ]}
        done="beide Zahlen grün bestätigt sind." />
      <div className="task-grid">
        <label>Wie viele Befragte hat der Datensatz?<small className="task-field-help">Die Zahl vor „obs.“ im Environment</small><input type="text" inputMode="numeric" value={state.cases} onChange={e => set({ cases: e.target.value })} /></label>
        <label>Wie viele Variablen hat der Datensatz?<small className="task-field-help">Die Zahl vor „variables“ im Environment</small><input type="text" inputMode="numeric" value={state.vars} onChange={e => set({ vars: e.target.value })} /></label>
      </div>
      <Feedback notes={checkHandshake(data.sav, state.cases, state.vars)} />
      <ErrorDecoder />
      <HintLadder hint={handshakeHint} onConcept={onConcept} />
    </section>

    <section className="task-step">
      <h3>2 · Die vier Ideen prüfen</h3>
      <StepGuide
        why="R kennt jetzt deine Daten. Also kannst du suchen: Für jede Idee findest du heraus, ob der ALLBUS sie schon abdeckt. Wichtig: Ein Suchtreffer heißt noch nicht, dass die Frage passt. Erst das Codebuch zeigt mit Variablenlabel und Ausprägungen (den möglichen Antworten), was wirklich gemessen wurde."
        steps={[
          <>Geh zuerst das vorgemachte Beispiel zu Idee 1 unten durch. Danach prüfst du die Ideen 2 bis 4 genauso.</>,
          <>Lies die Idee und überleg dir ein kurzes Suchwort. Ein Wortanfang reicht oft, etwa „vertrau“ statt „Vertrauen“. Die Variablenlabels (kurze Beschreibungen der Fragen) sind im ALLBUS ohne Umlaute geschrieben: aus ü wird ue.</>,
          <>Such nach dem Wort. Dafür gibt es zwei Wege – nimm den, der dir liegt, oder probier beide aus:
            <ul>
              <li><strong>In R suchen:</strong> <code>find_var(allbus, "suchwort")</code> listet alle Variablen, deren Name oder Variablenlabel das Wort enthält.</li>
              <li><strong>Im Codebuch suchen:</strong> <code>codebook(allbus)</code> öffnet das ganze Codebuch als Seite im Viewer (unten rechts). Über das Symbol <em>Show in new window</em> öffnest du es im Browser. Dort suchst du wie auf jeder Webseite mit <kbd>Strg</kbd> + <kbd>F</kbd> (Mac: <kbd>Cmd</kbd> + <kbd>F</kbd>).</li>
            </ul></>,
          <>Sieh dir jeden Treffer genau an: Was misst die Frage? Welche Ausprägungen gibt es? Das steht im Codebuch (<code>codebook(allbus)</code>) direkt bei der Variable.</>,
          <>Entscheide: <strong>Gibt es schon</strong> oder <strong>Neu fragen</strong>. Fülle dann die Felder aus, die erscheinen.</>,
        ]}
        done="alle vier Ideen eine Entscheidung haben. Die Rückmeldungen helfen dir: Grün heißt „stimmt“, gelb ist ein Hinweis zum Nachdenken, orange heißt „stimmt noch nicht“.">
        <p className="sandbox-note">Beide Wege haben Stärken: find_var() ist schnell, das Codebuch im Browser zeigt gleich Variablenlabel und Ausprägungen. Das Suchfeld in jeder Karte hier zählt nur, wie viele Treffer ein Suchwort hat – was die Treffer bedeuten, siehst du in R oder im Codebuch.</p>
      </StepGuide>
      <WorkedExample sav={data.sav} />
      <EmergencyConsole sav={data.sav} />
      <p className="s01-progress" role="status"><strong>{decided} von 4</strong> Ideen entschieden</p>
      {antraege.map((a, i) => <AntragCard key={a.id} n={i + 1} antrag={a} stamp={state.stamps[a.id]} sav={data.sav} badge={cardBadge(i + 1, state.mode)} onChange={s => setStamp(a.id, s)} onConcept={onConcept} />)}
    </section>

    <section className="task-step">
      <h3>3 · Deine eigene Idee (freiwillig)</h3>
      <StepGuide
        why="Du hast vier fremde Ideen geprüft und weißt, wie es geht. Jetzt bist du dran: Prüf eine Frage, die dich selbst interessiert, genauso wie die vier Ideen."
        steps={[
          'Schreib deine Frage in das Feld, zum Beispiel: „Wie oft streiten Menschen über Politik?“',
          'Such im ALLBUS danach – auf einem der Wege aus Schritt 2.',
          'Entscheide: Gibt es schon oder Neu fragen.',
        ]} />
      <TextAnswer id="s01-idea" label="Welche Frage würdest du 3.000 Menschen stellen?" help="Eine Frage, so wie du sie im Interview stellen würdest"
        example="z. B. Wie oft streiten Menschen über Politik?" value={state.idea} onChange={idea => set({ idea })} />
      {state.idea.trim() && <>
        <SearchTester sav={data.sav} onSearched={word => { if (!state.ideaStamp.searches.includes(word)) set({ ideaStamp: { ...state.ideaStamp, searches: [...state.ideaStamp.searches, word] } }); }} />
        <StampEditor sav={data.sav} antrag={null} stamp={state.ideaStamp} onChange={ideaStamp => set({ ideaStamp })} />
      </>}
    </section>

    <section className="task-step">
      <h3>4 · Ergebnis festhalten</h3>
      <StepGuide
        why="Alle Ideen sind entschieden. Zum Schluss hältst du fest, was du herausgefunden hast. Die Ergebniskarte unten ist für die gemeinsame Besprechung im Plenum."
        steps={[
          'Beantworte die Frage im Textfeld in ein bis zwei Sätzen.',
          'Prüf die Ergebniskarte: Stehen dort deine Entscheidungen?',
          'Lade den Prüfbericht und das R-Skript deiner Suche herunter. Das Skript kannst du später wieder in RStudio öffnen.',
        ]} />
      <TextAnswer id="s01-lesson" size="long" label="Welche Suche hat dich am meisten in die Irre geführt – und warum?"
        help="Ein bis zwei Sätze. Schreib auch dazu, welcher Suchweg dir am meisten geholfen hat: find_var() oder das Codebuch."
        example="z. B. Bei „…“ gab es viele Treffer, aber keiner fragte, was die Idee wissen wollte. Geholfen hat mir …, weil …"
        value={state.lesson} onChange={lesson => set({ lesson })} />
      <p className="s02-takeaway"><strong>Das Wichtigste aus dieser Sitzung:</strong> Ein Suchtreffer ist erst ein Kandidat. Ob eine Frage passt, zeigt das Codebuch: Variablenlabel, Ausprägungen und fehlende Werte. Und gültige Antworten gibt es oft weniger als Befragte.</p>
      <PlenumCard title="Eure Ergebnisse" lines={plenumLines(state)} file="schon-gefragt-plenum.md" />
      <div className="sandbox-chips">
        <button onClick={() => downloadText('pruefbericht-schon-gefragt.md', reportMarkdown(state), 'text/markdown;charset=utf-8')}><Download size={14} aria-hidden="true" /> Prüfbericht</button>
        <button onClick={() => downloadText('schon-gefragt-suche.R', rScript(state))}><Download size={14} aria-hidden="true" /> R-Skript deiner Suche</button>
      </div>
    </section>
  </div>;
}
