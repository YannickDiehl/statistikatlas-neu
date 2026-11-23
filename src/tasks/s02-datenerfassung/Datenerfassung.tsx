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
import { benNotes, hints, R_SOLUTION, TOOLBOX_SCRIPT, S02_VARS, SHEET_IDS, sheets, type S02Var, type SheetId } from './content';
import { benEntries, cellKey, checkCell, checkNumbers, decodeRow, diffEntries, editCell, encodeRow, gradeCell, mineOf, plenumLines, scanCode, settleCell, type Entries, type S02State } from './domain';
import { Example } from './Example';
import { PaperSheet } from './PaperSheet';
import { TextAnswer } from '../kit/TextAnswer';

const sheetById = Object.fromEntries(sheets.map(s => [s.id, s])) as Record<SheetId, (typeof sheets)[number]>;

function EntryGrid({ sav, state, set }: { sav: SavFile; state: S02State; set: (patch: Partial<S02State>) => void }) {
  const setCell = (sheet: SheetId, v: S02Var, value: string) => set(editCell(state, sheet, v, value));
  const messages: string[] = [];
  const open: { sheet: SheetId; variable: S02Var }[] = [];
  for (const sheet of SHEET_IDS) for (const v of S02_VARS) {
    const input = state.entries[sheet][v];
    if (!state.graded) {
      const check = checkCell(sav, v, input);
      if (input.trim() && check.state === 'invalid') messages.push(`Bogen ${sheet}, ${v}: ${check.message}`);
      continue;
    }
    const grade = gradeCell(sav, sheetById[sheet], v, input);
    if (grade.status === 'open') open.push({ sheet, variable: v });
    else if (grade.status !== 'match') messages.push(`Bogen ${sheet}, ${v}: ${grade.message}`);
  }
  const filled = SHEET_IDS.reduce((n, id) => n + S02_VARS.filter(v => state.entries[id][v].trim()).length, 0);
  return <>
    <p className="s02-progress" role="status"><strong>{filled} von 18</strong> Zellen ausgefüllt</p>
    <p className="task-prompt">Trag in jede Zelle den Code ein, den du im Codebuch gefunden hast – eine Zahl, auch negative wie −11.</p>
    <table className="sandbox-table s02-grid">
      <caption className="sr-only">Erfassungsraster: je Variable ein Code pro Bogen</caption>
      <thead><tr><th scope="col">Variable</th>{SHEET_IDS.map(id => <th key={id} scope="col">Bogen {id}</th>)}</tr></thead>
      <tbody>{S02_VARS.map(v => <tr key={v}>
        <th scope="row"><code>{v}</code></th>
        {SHEET_IDS.map(id => {
          const grade = state.graded ? gradeCell(sav, sheetById[id], v, state.entries[id][v]).status : '';
          return <td key={id}><input type="text" className={grade ? `grade-${grade}` : ''} aria-label={`Bogen ${id}, ${v}`}
            value={state.entries[id][v]} onChange={e => setCell(id, v, e.target.value)} /></td>;
        })}
      </tr>)}</tbody>
    </table>
    {messages.length > 0 && <ul className="task-feedback">{messages.map(m => <li key={m} className="tone-warn">{m}</li>)}</ul>}
    {!state.graded
      ? <button className="primary" onClick={() => set({ graded: true })}>Erfassung abschließen</button>
      : open.length > 0 && <div className="s02-rules">
          <p>Hier musstest du entscheiden, weil das Kreuz nicht eindeutig war. Schreib zu jeder Zelle deine Regel auf – so, dass jemand anderes beim nächsten Bogen genauso entscheiden würde:</p>
          {open.map(({ sheet, variable }) => {
            const key = cellKey(sheet, variable);
            return <TextAnswer key={key} label={<>Welche Regel gilt für Bogen {sheet}, <code>{variable}</code>?</>}
              help={`Du hast ${state.entries[sheet][variable]} eingetragen. Schreib die Regel so allgemein, dass sie auch für den nächsten Bogen passt.`}
              example="z. B. Ist ein Kästchen nur halb angekreuzt, zählt es als Kreuz."
              value={state.rules[key] ?? ''} onChange={v => set({ rules: { ...state.rules, [key]: v } })} />;
          })}
        </div>}
  </>;
}

function DoubleEntry({ sav, state, set }: { sav: SavFile; state: S02State; set: (patch: Partial<S02State>) => void }) {
  const partner = state.mode === 'pair' ? decodeRow(state.partnerCode) : null;
  const other: Entries | null = state.mode === 'pair' ? partner : benEntries(sav);
  const who = state.mode === 'pair' ? 'Partner:in' : 'Ben';
  const current = other ? diffEntries(state.entries, other) : [];
  // Geschlichtete Zeilen bleiben stehen, auch wenn die Zahlen nach „Übernehmen“ übereinstimmen.
  const settledRows = Object.keys(state.settled).map(k => { const [sheet, variable] = k.split('.') as [SheetId, S02Var]; return { sheet, variable }; });
  const diffs = [...current, ...settledRows.filter(r => !current.some(c => c.sheet === r.sheet && c.variable === r.variable))]
    .sort((a, b) => SHEET_IDS.indexOf(a.sheet) - SHEET_IDS.indexOf(b.sheet) || S02_VARS.indexOf(a.variable) - S02_VARS.indexOf(b.variable));
  const mine = (sheet: SheetId, variable: S02Var) => mineOf(state, sheet, variable);
  const settle = (sheet: SheetId, variable: S02Var, choice: 'mine' | 'other') => set(settleCell(state, other, sheet, variable, choice));
  return <>
    {state.mode === 'pair' && <div className="task-grid">
      <label>Dein Zeilencode<small className="task-field-help">Diesen Code gibst du der anderen Person</small><input type="text" readOnly value={encodeRow(state.entries)} /></label>
      <label>Zeilencode der anderen Person<small className="task-field-help">Hier eintippen, was sie dir gibt</small><input type="text" value={state.partnerCode} onChange={e => set({ partnerCode: e.target.value })} /></label>
    </div>}
    {state.mode === 'pair' && state.partnerCode.trim() && !partner && <p className="sandbox-error">Der Code ist unvollständig. Er beginnt mit „S02:“ und hat 18 Werte.</p>}
    {other && (diffs.length === 0
      ? <p className="sandbox-note">Keine Abweichungen zu {who} – ihr habt alle Zellen gleich erfasst.</p>
      : <ul className="s02-diffs">{diffs.map(({ sheet, variable }) => {
          const key = cellKey(sheet, variable);
          const settled = state.settled[key];
          return <li key={key}>
            <span>Bogen {sheet}, <code>{variable}</code>: du {mine(sheet, variable) || 'leer'} · {who} {other[sheet][variable] || 'leer'}</span>
            <span className="sandbox-chips">
              <button aria-pressed={settled === 'mine'} aria-label={`Meine Zahl bleibt – Bogen ${sheet}, ${variable}`} onClick={() => settle(sheet, variable, 'mine')}>Meine Zahl bleibt</button>
              <button aria-pressed={settled === 'other'} aria-label={`Übernehmen – Bogen ${sheet}, ${variable}, Zahl von ${who}`} onClick={() => settle(sheet, variable, 'other')}>Übernehmen</button>
            </span>
            {settled && state.mode === 'solo' && benNotes[key] && <small>{benNotes[key]}</small>}
          </li>;
        })}</ul>)}
  </>;
}

export function Datenerfassung({ data, state, onChange, onConcept }: TaskProps<S02State>) {
  const set = (patch: Partial<S02State>) => onChange({ ...state, ...patch });
  const scan = state.revealed ? scanCode(data.sav, -42) : null;
  const paperNotes = checkNumbers(data.sav, { ...state.numbers, afd: '' });
  const convertNotes = checkNumbers(data.sav, { mfn: '', dk: '', afd: state.numbers.afd });
  // Das Skript zum Mitnehmen erscheint, wenn beide Zahlen aus Schritt 4 stimmen; der Zusatz zum Umwandeln ist freiwillig.
  const allRight = paperNotes.length === 2 && paperNotes.every(n => n.tone === 'ok');
  return <div className="task s02">
    <RoleBrief role="Datenerfasser:in im Umfrageinstitut" title="Erster Tag in der Datenerfassung">
      <p>Du fängst heute in der Erfassungsstelle eines Umfrageinstituts an. Fast jede dritte Zeile im ALLBUS 2023 war einmal ein Papierfragebogen: 1.656 Befragte haben ihren Bogen per Post zurückgeschickt. Jemand musste aus ihren Kreuzen Zahlen machen. Heute bist du das.</p>
      <p>Vor dir liegen drei ausgefüllte Bögen. Aus jedem Bogen machst du eine Zeile im Datensatz, so wie sie im ALLBUS stehen könnte. Dabei hilft dir das Codebuch: Auf dem Papier stehen Wörter, im Datensatz stehen Codes (die gespeicherten Zahlen). Welcher Code zu welchem Wort gehört, steht im Codebuch.</p>
      <p>Nicht jedes Kreuz ist eindeutig. Wo du entscheiden musst, entscheidest du – und schreibst eine Regel auf, damit alle anderen genauso erfassen. Außerdem wird jeder Bogen zweimal erfasst, von dir und von einer zweiten Person (Doppelerfassung). Wo ihr euch unterscheidet, schaust du noch einmal hin. So fallen Tippfehler auf.</p>
      <p>Am Ende vergleichst du deine Regeln mit denen des echten ALLBUS.</p>
      <p>Die Frage, die dich heute begleitet: <strong>Wie wird aus einem Kreuz auf Papier ein Code im Datensatz – und was geht dabei verloren?</strong></p>
      <p><strong>Was du dabei lernst:</strong> wie aus Kreuzen auf Papier Codes im Datensatz werden, wie der ALLBUS fehlende Werte speichert und warum Codes mehr speichern als Wörter.</p>
    </RoleBrief>
    <PartnerToggle mode={state.mode} onChange={mode => set({ mode })}
      solo="Dein Kollege Ben hat die Bögen schon einmal erfasst. In Schritt 3 vergleichst du deine Zeilen mit seinen."
      pair="A und B erfassen die Bögen jede:r für sich, ohne sich abzusprechen. In Schritt 3 tauscht ihr eure Zeilencodes aus und vergleicht. Schritt 4 übernimmt A, B schaut im Codebuch mit nach; erklärt euch danach gegenseitig, was ihr herausgefunden habt. Schritt 5 macht ihr gemeinsam." />

    <Toolbox file="datenerfassung-werkzeuge.R" code={TOOLBOX_SCRIPT} tools={[
      { fn: 'library(), read_spss()', text: <>kennst du aus Sitzung 1: Pakete laden und Daten einlesen.</> },
      { fn: 'codebook()', text: <>kennst du aus Sitzung 1. Neu: Du kannst das Codebuch auch nur für einen Teil der Befragten öffnen, etwa <code>codebook(frauen)</code>.</> },
      { fn: '%>% filter()', isNew: true, text: <>behält nur die Befragten, die eine Bedingung erfüllen – wie auf der Folie. Lies <code>%&gt;%</code> als „und dann“: <code>frauen &lt;- allbus %&gt;% filter(sex == 2)</code> heißt: Nimm den ALLBUS, und dann behalte nur die Befragten, bei denen in <code>sex</code> der Code 2 steht. <code>==</code> bedeutet „ist gleich“; mit <code>&lt;-</code> speicherst du das Ergebnis unter einem neuen Namen.</> },
    ]} />

    <section className="task-step">
      <h3>1 · Welcher Code gehört zu welchem Wort?</h3>
      <StepGuide
        why="Auf dem Papier stehen Wörter, im Datensatz Codes. Das Codebuch verbindet beides. Bevor du erfasst, schaust du nach, welcher Code zu welcher Antwort gehört."
        steps={[
          <>Lies die Daten ein wie in Sitzung 1 und öffne das ganze Codebuch. Die Befehle stehen im Werkzeugkasten.</>,
          <>Such im Codebuch mit <kbd>Strg</kbd> + <kbd>F</kbd> (Mac: <kbd>Cmd</kbd> + <kbd>F</kbd>) nacheinander die sechs Variablen der Bögen: <code>pa02a</code>, <code>pa01</code>, <code>pt03</code>, <code>st01</code>, <code>pv01</code>, <code>ls01</code>.</>,
          <>Sieh dir für jede Variable die Ausprägungen an (die möglichen Antworten): Welcher Code gehört zu welchem Wertelabel? Und in welche Richtung läuft die Skala – steht 1 für „viel“ oder für „wenig“?</>,
          <>Achte auf die fehlenden Werte (negative Codes). Wichtig ist vor allem −11 „TNZ: SPLIT“: Der ALLBUS hat zwei Fragebogen-Versionen, A und B. Manche Fragen stehen nur in einer Version. Wer die andere Version bekommen hat, erhält bei dieser Frage −11 (trifft nicht zu). Wer welche Version hatte, steht in <code>splt23_1</code> – such auch danach.</>,
        ]}
        done="du für jede der sechs Variablen weißt, wo du die Codes nachschlägst. Lass das Codebuch offen – du brauchst es in Schritt 2." />
      <HintLadder hint={hints.codes} onConcept={onConcept} />
    </section>

    <section className="task-step">
      <h3>2 · Bögen erfassen</h3>
      <StepGuide
        why="Du weißt jetzt, wo die Codes stehen. Also geht es an die Bögen: Aus jedem Bogen machst du eine Zeile, indem du für jede Frage den passenden Code in die Tabelle einträgst."
        steps={[
          <>Geh zuerst das vorgemachte Beispiel zu Bogen 1 durch und trag dessen Codes in die Spalte „Bogen 1“ ein.</>,
          <>Erfasse dann Bogen 2 und 3 selbst: Kreuz suchen, im Codebuch den Code nachschlagen, Zahl eintragen.</>,
          <>Nicht immer ist das Kreuz klar. Es gibt drei typische Fälle:
            <ul>
              <li><strong>Die Frage fehlt auf dem Bogen:</strong> Sie stand in dieser Version nicht drin. Trag den fehlenden Wert für „nicht gefragt“ ein (TNZ).</li>
              <li><strong>Kein Kreuz:</strong> Die Person hat nicht geantwortet. Trag den fehlenden Wert für „keine Angabe“ ein.</li>
              <li><strong>Das Kreuz ist nicht eindeutig</strong> (zwei Kreuze, Kreuz auf der Linie, Randnotiz): Entscheide dich für einen Code. Deine Regel dazu schreibst du gleich auf.</li>
            </ul></>,
          <>Klick auf „Erfassung abschließen“. Die Tabelle zeigt dann: grün heißt „stimmt“, rot heißt „passt nicht zum Codebuch“, gelb heißt „hier musstest du entscheiden“. Für jede gelbe Zelle schreibst du deine Regel auf.</>,
        ]}
        done="alle 18 Zellen ausgefüllt sind und jede gelbe Zelle eine Regel hat." />
      <Example sav={data.sav} />
      <div className="s02-sheets">{sheets.map(s => <PaperSheet key={s.id} sheet={s} />)}</div>
      <EntryGrid sav={data.sav} state={state} set={set} />
    </section>

    {!state.graded && <section className="task-step">
      <h3>3 · Doppelerfassung: vergleichen</h3>
      <p className="sandbox-note">Dieser Schritt öffnet sich, sobald du in Schritt 2 alle Bögen erfasst und auf „Erfassung abschließen“ geklickt hast.</p>
    </section>}

    {state.graded && <section className="task-step">
      <h3>3 · Doppelerfassung: vergleichen</h3>
      <StepGuide
        why={`Deine Zeilen sind fertig – aber jeder Bogen wird zweimal erfasst. Jetzt kommt der Abgleich mit ${state.mode === 'pair' ? 'der anderen Person' : 'Ben'}. Manche Abweichungen sind einfache Fehler. Andere entstehen dort, wo das Kreuz unklar war: Da hatte jede:r eine eigene Regel.`}
        steps={state.mode === 'pair' ? [
          'Gib deinen Zeilencode an die andere Person weiter und tipp ihren Code in das zweite Feld ein.',
          'Unten erscheinen alle Zellen, in denen sich eure Zeilen unterscheiden. Schaut bei jeder Abweichung gemeinsam auf den Bogen und ins Codebuch.',
          'Entscheide: „Meine Zahl bleibt“ oder „Übernehmen“ (dann gilt die Zahl der anderen Person).',
        ] : [
          'Unten stehen alle Zellen, in denen sich deine Zeile und Bens Zeile unterscheiden.',
          'Schau bei jeder Abweichung noch einmal auf den Bogen und ins Codebuch.',
          'Entscheide: „Meine Zahl bleibt“ oder „Übernehmen“ (dann gilt Bens Zahl). Danach erfährst du, was Ben falsch gemacht hat – falls er etwas falsch gemacht hat.',
        ]}
        done="du bei jeder Abweichung entschieden hast." />
      <DoubleEntry sav={data.sav} state={state} set={set} />
    </section>}

    <section className="task-step">
      <h3>4 · Wie speichert der ALLBUS Papierbögen?</h3>
      <StepGuide
        why={<>Beim Doppelkreuz auf Bogen 2 gibt es keine eindeutige Lösung{state.mode === 'solo' && <> – Ben hat zum Beispiel einfach das erste Kreuz genommen</>}. Vor genau diesem Problem stand das Institut auch bei den 1.656 echten Papierbögen. Wie hat der ALLBUS es gelöst? Und kommt „weiß nicht“ auf Papier überhaupt vor? Das schaust du jetzt im Datensatz nach.</>}
        steps={[
          <>Finde im Codebuch die Variable, die verrät, wie jemand teilgenommen hat (Tipp: Such nach „modus“). Welcher Code steht dort für Papierbögen per Post?</>,
          <>Behalte nur die Papierbögen und speichere sie unter einem eigenen Namen, zum Beispiel <code>papier</code>. Das passende Werkzeug findest du im Werkzeugkasten.</>,
          <>Öffne das Codebuch nur für die Papierbögen und such nach <code>pa01</code>. Wie viele haben den Code −42 („DATENFEHLER: MFN“)? MFN heißt Mehrfachnennung, also mehrere Kreuze. Die Zahl steht in der Spalte Freq.</>,
          <>Schau genauso bei <code>st01</code> nach: Wie oft kommt der Code −8 (WEISS NICHT) auf Papier vor?</>,
        ]}
        done="beide Zahlen grün bestätigt sind. Du brauchst sie gleich für deine Regel." />
      <div className="task-grid">
        <label>Wie viele Papierbögen haben bei pa01 den Code −42?<small className="task-field-help">Im Codebuch der Papierbögen, Spalte Freq.</small><input type="text" inputMode="numeric" value={state.numbers.mfn} onChange={e => set({ numbers: { ...state.numbers, mfn: e.target.value } })} /></label>
        <label>Wie viele Papierbögen haben bei st01 den Code −8?<small className="task-field-help">Ebenfalls Spalte Freq. – auch 0 ist eine Antwort</small><input type="text" inputMode="numeric" value={state.numbers.dk} onChange={e => set({ numbers: { ...state.numbers, dk: e.target.value } })} /></label>
      </div>
      <Feedback notes={paperNotes} />
      <HintLadder hint={hints.paper} onConcept={onConcept} />
      {!state.revealed
        ? <button onClick={() => set({ revealed: true })}>Wo steht −42 im ganzen Datensatz?</button>
        : scan && <p className="s02-reveal" role="status">
            {scan.total.toLocaleString('de-DE')} Zellen mit −42 („Mehrfachnennung“) in {scan.variables} Variablen: {scan.byMode.map(m => `${m.label} ${m.n.toLocaleString('de-DE')}`).join(' · ')} (CAPI = persönliches Interview, CAWI = online, MAIL = Papier per Post).
            {scan.byMode.every(m => m.label === 'MAIL' || m.n === 0) && ' Diesen Code gibt es nur, weil es Papier gibt.'}
          </p>}
    </section>

    <section className="task-step">
      <h3>5 · Deine Regel festlegen</h3>
      <StepGuide
        why="Jetzt kennst du die Lösung des ALLBUS. Für alle 1.656 Papierbögen muss eine gemeinsame Regel gelten – sonst erfasst jede Person anders, und derselbe Code bedeutet nicht mehr dasselbe."
        steps={[
          'Nimm dir einen unklaren Fall von Bogen 2 vor: das Doppelkreuz, das Kreuz auf der Linie oder die Randnotiz.',
          'Entscheide: Bleibst du bei deiner Regel aus Schritt 2, oder übernimmst du die Lösung des ALLBUS aus Schritt 4?',
          'Schreib die Regel mit Begründung so auf, dass jemand anderes sie ohne Rückfrage anwenden kann.',
        ]}
        done="deine Regel mit Begründung im Feld steht." />
      <TextAnswer id="s02-rule" size="long" label="Welche Regel soll für alle 1.656 Papierbögen gelten – und warum?"
        help="Erst die Regel (Wenn …, dann …), dann die Begründung. Nimm einen anderen Fall als im Beispiel."
        example="z. B. Ist ein Kästchen nur halb angekreuzt, zählt es als Kreuz. Denn die Person wollte erkennbar antworten – nur der Stift war ungenau."
        value={state.plenumRule} onChange={plenumRule => set({ plenumRule })} />
          <p className="s02-takeaway"><strong>Das Wichtigste aus dieser Sitzung:</strong> Codes speichern mehr als Wörter. Sie halten nicht nur fest, was jemand geantwortet hat, sondern auch, warum eine Antwort fehlt. Darum braucht jede Erfassung eine klare Regel – sonst bedeutet derselbe Code nicht mehr dasselbe.</p>
      <PlenumCard title="Bogen 2 und deine Regel" lines={plenumLines(state)} file="datenerfassung-plenum.md" />
      {allRight && <details className="s02-solution"><summary>Dein ganzes R-Skript zum Mitnehmen</summary><RBlock code={R_SOLUTION} file="datenerfassung.R" /></details>}
    </section>

    <details className="task-step s10-extra">
      <summary>Zusatz (freiwillig) · Parteinamen statt Codes</summary>
      <StepGuide
        why="Für Neugierige – im Seminar war das kein Thema. Die Institutsleitung möchte für einen Bericht Parteinamen statt Codes sehen, das Auswertungsteam danach wieder Zahlen zum Rechnen. Bleibt beim Umwandeln alles erhalten?"
        introduces={[
          { fn: 'to_label()', text: <>macht aus den Codes einer Variable ihre Wertelabels: Aus 42 wird „AFD“.</> },
          { fn: 'to_numeric()', text: <>macht aus Wörtern wieder Zahlen. Mit <code>keep_labels = TRUE</code> bleiben die Wertelabels dabei erhalten.</> },
        ]}
        steps={[
          <>Wandle die Wahlabsicht <code>pv01</code> in Wörter um und speichere das Ergebnis unter einem eigenen Namen, zum Beispiel <code>partei</code>. Sieh im Codebuch nach: Stehen dort jetzt Parteinamen?</>,
          <>Wandle die Parteinamen wieder in Zahlen um und behalte dabei die Wertelabels. Welchen Code hat die AfD jetzt?</>,
          <>Vergleich die fehlenden Werte vor und nach dem Umwandeln: Was ist aus den Gründen geworden (−8 WEISS NICHT, −9 KEINE ANGABE …)?</>,
        ]}
        done="die Zahl grün bestätigt ist." />
      <div className="task-grid">
        <label>Welchen Code hat die AfD nach dem Umwandeln?<small className="task-field-help">Die Zahl beim Wertelabel AFD im Codebuch</small><input type="text" inputMode="numeric" value={state.numbers.afd} onChange={e => set({ numbers: { ...state.numbers, afd: e.target.value } })} /></label>
      </div>
      <Feedback notes={convertNotes} />
      <HintLadder hint={hints.convert} onConcept={onConcept} />
    </details>
  </div>;
}
