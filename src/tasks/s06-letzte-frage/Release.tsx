import { Feedback } from '../kit/Feedback';
import { HintLadder } from '../kit/HintLadder';
import type { WorkMode } from '../kit/PartnerToggle';
import { StepGuide } from '../kit/StepGuide';
import { hints, PLACEHOLDERS, ROLES, TEXTS } from './content';
import { checkAmount, checkRelease, chooseRelease, releaseState, releaseTape, rScriptFor, type Computed, type S06State } from './domain';
import { VersionChips } from './Parts';
import { SpanTape } from './Tape';
import { TextAnswer } from '../kit/TextAnswer';

/** Station 4: Fassung, Quote mit Spanne, Wirkung des Betrags, der Nicht-Satz und zwei Unterschriften. Am Ende der Kasten mit dem Wichtigsten. */
export function Release({ c, state, onChange, onConcept, done, roleLabel }: {
  c: Computed; state: S06State; onChange: (s: S06State) => void; onConcept: (id: string) => void; done: { meansDone: boolean; tukeyDone: boolean }; roleLabel: (r: keyof typeof ROLES, mode: WorkMode) => string;
}) {
  const r = state.release;
  const setRelease = (patch: Partial<S06State['release']>) => onChange({ ...state, release: { ...r, ...patch } });
  const setSign = (patch: Partial<S06State['sign']>) => onChange({ ...state, sign: { ...state.sign, ...patch } });
  const release = releaseState(state);
  // Allein spielst du beide Rollen: „du“; zu zweit entscheidet ihr gemeinsam.
  const solo = state.mode !== 'pair';
  return <section className="task-step">
    <h3>Station 4 · Freigabe <span className="s06-role">beide Rollen</span></h3>
    <StepGuide
      why={`Du kennst jetzt die vier Online-Quoten und weißt, welche Unterschiede tragen. Morgen um 9 Uhr wird programmiert. Jetzt ${solo ? 'entscheidest du' : 'entscheidet ihr'}: Welche Fassung, welche Quote – und mit welcher Spanne? Eine Quote aus einer Stichprobe ist nie genau. Das 95-%-Konfidenzintervall zeigt, wie weit sie danebenliegen kann.`}
      steps={[
        solo ? 'Wähl die Fassung, die du freigibst.' : 'Wählt die Fassung, die ihr freigebt.',
        'Behalte nur die Online-Befragten mit dieser Fassung. Ein t-Test ohne Gruppe zeigt dir ihre Zusagequote mit 95-%-Konfidenzintervall.',
        'Trag Quote und Spanne ein. Das Maßband zeichnet mit. Dazu kommt die Differenz 10 € minus 5 € aus Station 3a.',
        solo ? 'Schreib den Satz, den du ausdrücklich nicht behauptest. Dann unterschreibst du in beiden Rollen – oder legst als Qualitätssicherung ein Veto ein.' : 'Schreibt den Satz, den ihr ausdrücklich nicht behauptet. Dann unterschreibt ihr – oder die Qualitätssicherung legt ein Veto ein.',
      ]}
      done="beide Unterschriften stehen. Dann füllt sich die Ergebniskarte." />
    <p className="task-prompt">{solo ? 'Welche Fassung gibst du frei? Klick eine an.' : 'Welche Fassung gebt ihr frei? Klickt eine an.'}</p>
    <VersionChips label="Fassung für die Freigabe" value={r.version} onChange={v => onChange(chooseRelease(state, v))} />
    {r.version && <p className="sandbox-note">Wechselst du die Fassung, beginnen Quote, Spanne und Unterschriften von vorn.</p>}
    {r.version && <>
      <div className="task-grid">
        <label>Welche Online-Quote versprichst du der Geschäftsführung?<small className="task-field-help">Zusagequote deiner Fassung, nur online, in Prozent – Spalte Mean im t-Test ohne group</small><input type="text" inputMode="decimal" maxLength={12} value={r.rate} onChange={e => setRelease({ rate: e.target.value })} /></label>
        <label>Wo beginnt deine Spanne nach unten?<small className="task-field-help">Untere Grenze in Prozent – in derselben Ausgabe unter „95% CI Lower“</small><input type="text" inputMode="decimal" maxLength={12} value={r.low} onChange={e => setRelease({ low: e.target.value })} /></label>
        <label>Wo endet deine Spanne nach oben?<small className="task-field-help">Obere Grenze in Prozent – unter „95% CI Upper“</small><input type="text" inputMode="decimal" maxLength={12} value={r.high} onChange={e => setRelease({ high: e.target.value })} /></label>
        <label>Wie viele Prozentpunkte mehr Zusagen bringen 10 € statt 5 €?<small className="task-field-help">Differenz der Zusagequoten, nur online – aus deinem t-Test zum Betrag in Station 3a (Spalte Mean Diff., mit oder ohne Minus)</small><input type="text" inputMode="decimal" maxLength={12} value={r.amount} onChange={e => setRelease({ amount: e.target.value })} /></label>
      </div>
      <SpanTape tape={releaseTape(c, state, done.meansDone)} />
      <Feedback notes={[...checkRelease(c, state, done), ...checkAmount(c, r.amount).notes]} />
      <TextAnswer id="s06-not" maxLength={600} label={solo ? 'Welchen Satz behauptest du ausdrücklich nicht?' : 'Welchen Satz behauptet ihr ausdrücklich nicht?'}
        help="Ein Satz: Was könnte jemand aus euren Zahlen herauslesen, das sie gar nicht zeigen?"
        example={PLACEHOLDERS.notClaimed} value={r.notClaimed} onChange={notClaimed => setRelease({ notClaimed })} />
      <details className="s06-details"><summary>Profi-Frage zum Betrag</summary>
        <p>{TEXTS.profi}</p>
        <p className="sandbox-note">{c.splitMatch ? 'In deiner Datei deckt sich der Betrag vollständig mit splt23_1.' : 'In deiner Datei deckt sich der Betrag nicht vollständig mit splt23_1.'}</p>
      </details>
      <HintLadder key={`s4-${r.version}`} hint={{ ...hints.s4, solution: rScriptFor(state) }} onConcept={onConcept} file="letzte-frage.R" />
      <div className="s06-sign">
        <div>
          <TextAnswer id="s06-sign-panel" maxLength={400} label={<>Unterschrift {roleLabel('panel', state.mode)}: Was versprichst du der Geschäftsführung – und warum?</>}
            help="Ein Satz mit Quote und Spanne" example={PLACEHOLDERS.signPanel} value={state.sign.panel} onChange={panel => setSign({ panel })} />
        </div>
        <div>
          <TextAnswer id="s06-sign-qs" maxLength={400} label={<>Unterschrift {roleLabel('qs', state.mode)}: Gibst du frei – oder legst du ein Veto ein?</>}
            help="Ein Satz mit Begründung" example={PLACEHOLDERS.signQs} value={state.sign.qs} onChange={qs => setSign({ qs })} />
          <label className="s04-check"><input type="checkbox" checked={state.sign.veto} onChange={e => setSign({ veto: e.target.checked })} /> Veto einlegen: So geben wir nicht frei</label>
        </div>
      </div>
      <p className={`s06-state s06-state-${release}`} aria-live="polite">Freigabe: {release === 'Veto' ? 'Veto der Qualitätssicherung – die Fassung wird so nicht programmiert.' : release === 'freigegeben' ? 'freigegeben mit zwei Unterschriften.' : 'noch offen – es fehlen Unterschriften.'}</p>
    </>}
    <p className="s02-takeaway"><strong>Das Wichtigste aus dieser Sitzung:</strong> Ein Mittelwertvergleich ist nur so gut wie die Gruppen, die er vergleicht. Prüf deshalb zuerst, ob die Gruppen vergleichbar sind. Zwei Gruppen vergleichst du mit dem t-Test, mehr als zwei mit der ANOVA und danach mit Tukey. Und zu jeder Quote gehört ihre Spanne.</p>
  </section>;
}
