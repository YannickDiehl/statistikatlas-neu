import { useMemo, useState } from 'react';
import { Feedback } from '../kit/Feedback';
import { HintLadder } from '../kit/HintLadder';
import { de, parseNumber } from '../kit/numbers';
import { PartnerToggle } from '../kit/PartnerToggle';
import { PlenumCard } from '../kit/PlenumCard';
import { RBlock } from '../kit/RBlock';
import { RoleBrief } from '../kit/RoleBrief';
import { StepGuide } from '../kit/StepGuide';
import { Toolbox } from '../kit/Toolbox';
import type { TaskProps } from '../types';
import { ChairRow, chairsOf, Hall, hoursLabel } from './Charts';
import { CHAIR_CODES, hints, R_SOLUTION, SELECTIONS, TOOLBOX_SCRIPT, type Selection } from './content';
import { checkRight, codeName, compareGuess, describeHours, diagnoseSeats, hoursFor, plenumLines, rawCounts, rightCorrect, statusS03, validCodes, checkSign, type Measure, type S03State } from './domain';
import type { Note } from '../kit/Feedback';
import { TextAnswer } from '../kit/TextAnswer';

export function Stuehle({ data, state, onChange, onConcept }: TaskProps<S03State>) {
  const set = (patch: Partial<S03State>) => onChange({ ...state, ...patch });
  const pv = data.sav.byName.get('pv01')!;
  const counts = useMemo(() => rawCounts(pv), [pv]);
  const valid = useMemo(() => validCodes(pv), [pv]);
  const present = CHAIR_CODES.filter(c => counts.has(c));
  const included = [...valid, ...CHAIR_CODES.filter(c => state.rule.includes(c))];
  const entered = new Map(included.map(c => [c, parseNumber(state.seats[String(c)] ?? '') ?? 0]));
  const diagnosis = state.built ? diagnoseSeats(pv, state.rule, entered) : null;
  // Neue Regel = neuer Saal: neu bauen, Stühle einer abgewählten Lücke verwerfen.
  const toggle = (code: number) => {
    const on = state.rule.includes(code), seats = { ...state.seats };
    if (on) delete seats[String(code)];
    set({ rule: on ? state.rule.filter(c => c !== code) : [...state.rule, code], seats, built: false });
  };
  const signDone = Boolean(state.sign.value.trim() && state.sign.measure && state.sign.selection && state.sign.right.trim());
  // Auflösung erst, wenn die Zahl aus R stimmt – sonst verriete der Vergleich die Lösung.
  const rightOk = rightCorrect(data.sav, state.sign.selection, state.sign.right);
  const revealed = signDone && state.guessLocked && rightOk;
  // Stühle gibt es nur ganz: Kommazahlen und Wörter in den Feldern benennen, statt sie still als 0 zu zählen.
  const seatNotes: Note[] = included.some(c => { const t = (state.seats[String(c)] ?? '').trim(); const x = parseNumber(t); return t !== '' && (x === null || !Number.isInteger(x) || x < 0); })
    ? [{ tone: 'warn', text: 'Stühle gibt es nur ganz: Trag in jedes Feld eine ganze Zahl ein (ohne Komma, ohne Wörter). Runde deine Prozente vorher.' }]
    : [];
  const rowSelection: Selection = state.sign.selection || 'gefragt';
  const rowValues = useMemo(() => hoursFor(data.sav, rowSelection), [data.sav, rowSelection]);
  const rowStats = useMemo(() => describeHours(rowValues), [rowValues]);

  const selections = SELECTIONS.filter(x => x.id !== 'alle0');
  // Saal 1: Welche Gruppe verteilt gerade per Klick ihre Stühle? (nur Ansicht, wird nicht gespeichert)
  const [painting, setPainting] = useState<number | null>(null);
  const hallGroups = included.map(c => ({ code: c, label: codeName(pv, c), seats: entered.get(c) ?? 0, missing: c < 0 }));
  const pickSeat = (index: number) => {
    if (painting === null) return;
    const start = hallGroups.slice(0, painting).reduce((a, g) => a + Math.max(0, g.seats), 0);
    const code = included[painting];
    set({ seats: { ...state.seats, [String(code)]: String(Math.max(0, index + 1 - start)) }, built: false });
  };
  const seatSum = [...entered.values()].reduce((a, b) => a + b, 0);

  return <div className="task s03">
    <RoleBrief role="Szenograf:in einer Ausstellung" title="Deutschland in 100 Stühlen">
      <p>Die Wanderausstellung „Deutschland in 100 Stühlen“ braucht deine Baupläne. Die Kuratorin schreibt dir:</p>
      <p>„Im ersten Saal stehen 100 Stühle für die Frage: Welche Partei würden Sie wählen, wenn am Sonntag Bundestagswahl wäre? Jeder Stuhl steht für ein Prozent. Auch wer keine Partei nennt, soll seinen Stuhl finden können. Im zweiten Saal stehen 100 Stühle in einer Reihe, sortiert nach Wochenarbeitsstunden. Darüber hängt ein Schild: ‚Hier arbeitet man im Mittel __ Stunden.‘ Am Freitag gehen die Pläne in die Schreinerei.“</p>
      <p>In beiden Sälen entscheidest du dieselbe Frage: <strong>Wer bekommt einen Stuhl – und wofür steht er dann?</strong></p>
      <p><strong>Was du dabei lernst:</strong> Häufigkeitstabellen lesen, mit fehlenden Werten umgehen und Mittelwert und Median vergleichen.</p>
    </RoleBrief>
    <PartnerToggle mode={state.mode} onChange={mode => set({ mode })}
      solo="Du planst beide Säle allein und entscheidest selbst, wer einen Stuhl bekommt."
      pair="A plant Saal 1 so, dass alle Befragten einen Stuhl bekommen, B so, dass nur klare Antworten einen Stuhl bekommen. Vergleicht eure Säle, einigt euch auf einen und schreibt den Saaltext gemeinsam. In Saal 2 rechnet A mit allen Gefragten, B nur mit Vollzeit." />

    <Toolbox file="stuehle-werkzeuge.R" code={TOOLBOX_SCRIPT} tools={[
      { fn: 'library(), read_spss(), codebook()', text: <>kennst du: Pakete laden, Daten einlesen, im Codebuch nachsehen.</> },
      { fn: '%>% filter()', text: <>kennst du aus Sitzung 2: <code>frauen &lt;- allbus %&gt;% filter(sex == 2)</code> behält nur die Befragten, die eine Bedingung erfüllen. Lies <code>%&gt;%</code> als „und dann“ – so schreibst du heute auch die neuen Werkzeuge: <code>allbus %&gt;% frequency(sex)</code>.</> },
      { fn: 'frequency()', isNew: true, text: <>zählt, wie oft jeder Code einer Variable vorkommt (Spalte N), und rechnet daraus Prozente: <em>Raw %</em> von allen Befragten, <em>Valid %</em> nur von den gültigen Antworten, <em>Cum. %</em> aufsummiert. Unten stehen die fehlenden Werte mit ihrer Anzahl.</> },
      { fn: 'describe()', isNew: true, text: <>fasst eine Variable in wenigen Zahlen zusammen, unter anderem Mittelwert (<em>Mean</em>), Median und Schiefe (<em>Skewness</em>). Fehlende Werte lässt sie automatisch weg.</> },
      { fn: '+ - * / ( )', isNew: true, text: <>R rechnet wie ein Taschenrechner: Tipp die Rechnung in die Konsole und drück Enter.</> },
    ]} />

    <section className="task-step">
      <h3>Saal 1 · Wer fehlt in der Tabelle?</h3>
      <StepGuide
        why="Bevor du Stühle verteilst, brauchst du einen Überblick: Wie viele Befragte nennen welche Partei – und wer nennt keine?"
        steps={[
          <>Zähl die Wahlabsicht <code>pv01</code> aus. Welches Werkzeug zählt, wie oft jeder Code vorkommt?</>,
          <>Schau dir die Tabelle an: Oben stehen die Parteien und „würde nicht wählen“, darunter die fehlenden Werte – jeder mit eigenem Code und eigener Anzahl.</>,
          <>Schreib zu jedem fehlenden Wert einen Halbsatz: Wer sind diese Menschen?</>,
        ]}
        done="zu jedem fehlenden Wert ein Halbsatz steht." />
      <p className="task-example"><strong>So kann ein Halbsatz aussehen</strong> – an einem Code, der kein fehlender Wert ist: Hinter 91 „würde nicht wählen“ stecken Menschen, die wählen dürften, es aber nicht vorhaben.</p>
      <div className="task-text-grid">
        {present.map(c => <TextAnswer key={c} label={<>Wer steckt hinter {c} „{codeName(pv, c)}“?</>} help="Ein Halbsatz genügt"
          example="Das sind Menschen, die …" value={state.who[String(c)] ?? ''} onChange={v => set({ who: { ...state.who, [String(c)]: v } })} />)}
      </div>
      <HintLadder hint={hints.count} onConcept={onConcept} />
    </section>

    <section className="task-step">
      <h3>Saal 1 · Wer bekommt einen Stuhl?</h3>
      <StepGuide
        why="Du weißt jetzt, wer hinter den fehlenden Werten steckt. Also entscheidest du, wofür ein Stuhl steht. Die Parteien und „würde nicht wählen“ bekommen immer einen. Bei den fehlenden Werten entscheidest du selbst. Es gibt kein Richtig oder Falsch – aber jede Entscheidung verändert die Prozente."
        steps={[
          'Klick bei jedem fehlenden Wert auf „Stuhl“ oder „kein Stuhl“.',
          'Begründe deine Entscheidung für „weiß nicht“ und für „nicht wahlberechtigt“ in je einem Satz.',
        ]}
        done="deine Regel steht und beide Begründungen ausgefüllt sind." />
      <p className="task-prompt">Bekommt diese Gruppe einen Stuhl? Klick zum Umschalten.</p>
      <div className="sandbox-chips" role="group" aria-label="Stuhlregel">
        {present.map(c => <button key={c} aria-pressed={state.rule.includes(c)} onClick={() => toggle(c)}>{codeName(pv, c)}: {state.rule.includes(c) ? 'Stuhl' : 'kein Stuhl'}</button>)}
      </div>
      <p className="task-example"><strong>So kann eine Begründung aussehen</strong> – an einer Gruppe, die immer einen Stuhl hat: „Würde nicht wählen“ bekommt einen Stuhl, weil diese Menschen eine klare Antwort auf die Frage gegeben haben.</p>
      <div className="task-text-grid">
        <TextAnswer label="Warum bekommt „weiß nicht“ (k)einen Stuhl?" help="Ein Satz genügt" example="„Weiß nicht“ bekommt (k)einen Stuhl, weil …"
          value={state.reasons.dk} onChange={v => set({ reasons: { ...state.reasons, dk: v } })} />
        <TextAnswer label="Warum bekommt „nicht wahlberechtigt“ (k)einen Stuhl?" help="Ein Satz genügt" example="„Nicht wahlberechtigt“ bekommt (k)einen Stuhl, weil …"
          value={state.reasons.nw} onChange={v => set({ reasons: { ...state.reasons, nw: v } })} />
      </div>
    </section>

    <section className="task-step">
      <h3>Saal 1 · Sitzplan berechnen</h3>
      <StepGuide
        why="Deine Regel steht. Sie legt fest, wer mitzählt – und daraus ergibt sich, wie viele der 100 Stühle jede Gruppe bekommt."
        steps={[
          <>Berechne für jede Gruppe mit Stuhl ihren Anteil in Prozent. Dafür gibt es zwei Wege:
            <ul>
              <li><strong>Ablesen:</strong> Bekommt kein fehlender Wert einen Stuhl, steht die Antwort schon in der Spalte <em>Valid %</em> (Prozent der gültigen Antworten). Bekommen alle einen Stuhl, nimm die Spalte <em>Raw %</em> (Prozent aller Befragten).</li>
              <li><strong>Selbst rechnen:</strong> Bei einer gemischten Regel teilst du das N der Gruppe durch die Summe der N aller Gruppen mit Stuhl und nimmst das mal 100. R rechnet dabei wie ein Taschenrechner (siehe Werkzeugkasten).</li>
            </ul></>,
          'Runde auf ganze Stühle. Dann verteil sie im Saal: Wähl eine Gruppe und klick auf den Stuhl, bis zu dem ihr Block reicht – oder tipp die Zahl ins Feld. Zusammen müssen es genau 100 sein.',
          'Wenn alle Stühle stehen, klick auf „Saal prüfen“ und schreib danach den Saaltext: Wofür steht ein Stuhl?',
        ]}
        done="dein Saal mit 100 Stühlen steht und der Saaltext geschrieben ist." />
      <p className="task-prompt">Für welche Gruppe verteilst du gerade Stühle? Wähl sie aus und klick dann im Saal auf ihren letzten Stuhl.</p>
      <div className="sandbox-chips" role="group" aria-label="Gruppe zum Verteilen">
        {hallGroups.map((g, i) => <button key={g.code} aria-pressed={painting === i} onClick={() => setPainting(painting === i ? null : i)}>{g.label}</button>)}
      </div>
      <Hall groups={hallGroups} active={painting} onPick={pickSeat} />
      <p className="task-prompt">Oder tipp die Zahl der Stühle direkt ein:</p>
      <div className="task-grid">
        {included.map(c => <label key={c}>{codeName(pv, c)}<input type="text" inputMode="numeric" value={state.seats[String(c)] ?? ''}
          onChange={e => set({ seats: { ...state.seats, [String(c)]: e.target.value }, built: false })} /></label>)}
      </div>
      <p className="s03-progress" role="status"><strong>{de(seatSum, Number.isInteger(seatSum) ? 0 : 1)} von 100</strong> Stühlen verteilt</p>
      <Feedback notes={seatNotes} />
      <button className="primary" disabled={seatSum === 0} onClick={() => set({ built: true })}>Saal prüfen</button>
      {diagnosis && <Feedback notes={diagnosis.notes} />}
      <HintLadder hint={hints.hall} onConcept={onConcept} />
      {state.built && <>
        <TextAnswer id="s03-hall-text" label="Saaltext: Wofür steht ein Stuhl?" help="Höchstens zwei Sätze. Der Text hängt an der Saaltür: Wer hereinkommt, soll wissen, wer hier sitzt – und wer nicht."
          example="Ein Stuhl steht für … Nicht im Saal sind …" value={state.hallText} onChange={hallText => set({ hallText })} />
      </>}
    </section>

    <section className="task-step">
      <h3>Saal 2 · Wer wurde nach den Stunden gefragt?</h3>
      <StepGuide
        why="Saal 1 zeigt, wofür die Menschen stimmen. Saal 2 zeigt, wie viel sie arbeiten – und wieder musst du zuerst klären, wer überhaupt einen Stuhl bekommt. Denn die Frage nach den Arbeitsstunden wurde nicht allen gestellt."
        steps={[
          <>Öffne das Codebuch und such mit <kbd>Strg</kbd> + <kbd>F</kbd> (Mac: <kbd>Cmd</kbd> + <kbd>F</kbd>) nach <code>dw15</code>, den Wochenarbeitsstunden. Wie viele Befragte haben −10 „TNZ: FILTER“, haben die Frage also gar nicht bekommen?</>,
          <>Such auch nach <code>work</code>: Dort steht, ob jemand Vollzeit (1), Teilzeit (2) oder gar nicht erwerbstätig ist.</>,
          <>Entscheide, wer in deiner Stuhlreihe sitzt, und wähl es unten aus. Für „nur Vollzeit“ oder „nur Teilzeit“ behältst du in R nur diese Befragten – wie in Sitzung 2 bei den Papierbögen.</>,
        ]}
        done="du gewählt hast, wer in deiner Reihe sitzt." />
      <div className="task-grid">
        <label>Wer sitzt in deiner Stuhlreihe?<small className="task-field-help">Deine Auswahl der Befragten – in R mit filter()</small><select value={state.sign.selection} onChange={e => set({ sign: { ...state.sign, selection: e.target.value as Selection | '' } })}>
          <option value="">Gruppe wählen</option>{selections.map(x => <option key={x.id} value={x.id}>{x.label}</option>)}
        </select></label>
      </div>
      <HintLadder hint={hints.who} onConcept={onConcept} />
    </section>

    <section className="task-step">
      <h3>Saal 2 · Dein Tipp: Wo sitzt der Durchschnitt?</h3>
      <StepGuide
        why="Du weißt jetzt, wer in deiner Reihe sitzt. Bevor du rechnest, schätzt du: Hier stehen die 100 Stühle deiner Auswahl, sortiert von wenig nach viel Arbeit. Unter jedem Stuhl steht, wie viele Stunden die Person dort arbeitet. Ab welchem Stuhl arbeiten die Menschen mehr als der Durchschnitt? Läge der Durchschnitt genau in der Mitte, wären es 50 Stühle."
        steps={[
          'Zeig mit der Maus auf die Stühle – ab dem Stuhl unter der Maus färbt sich die Reihe probeweise dunkel.',
          'Klick auf den ersten Stuhl, dessen Person mehr arbeitet als der Durchschnitt. Rechnen musst du dafür noch nicht – schätz nach Gefühl.',
          'Gib deinen Tipp ab. Danach rechnest du in den nächsten beiden Schritten nach.',
        ]}
        done="dein Tipp abgegeben ist." />
      {!state.sign.selection
        ? <p className="sandbox-note">Wähl zuerst oben, wer in deiner Reihe sitzt – dann erscheint deine Stuhlreihe.</p>
        : <>
          <p className="task-prompt">Ab welchem Stuhl arbeiten die Menschen mehr als der Durchschnitt? Zeig mit der Maus auf die Stühle (am Handy: antippen) und klick den ersten an.</p>
          <ChairRow values={rowValues} guess={state.guess} locked={state.guessLocked} onPick={guess => set({ guess })} />
          <div className={`s03-tip${state.guessLocked ? ' locked' : ''}`} role="status">
            {state.guess === null
              ? <p>Noch kein Tipp. Klick auf einen Stuhl.</p>
              : <p><strong>Dein Tipp:</strong> Ab Stuhl {state.guess + 1} ({hoursLabel(chairsOf(rowValues)[Math.min(99, state.guess)])} Stunden) arbeiten <strong>{100 - state.guess} von 100</strong> Menschen mehr als der Durchschnitt.</p>}
            {!state.guessLocked
              ? <button className="primary" disabled={state.guess === null} onClick={() => set({ guessLocked: true })}>Tipp abgeben</button>
              : <p className="sandbox-note">Abgegeben – jetzt rechnest du in R nach.{!state.sign.value.trim() && <> <button className="sandbox-link" onClick={() => set({ guessLocked: false })}>Neu tippen</button></>}</p>}
          </div>
        </>}
    </section>

    <section className="task-step">
      <h3>Saal 2 · Was steht auf dem Schild?</h3>
      <StepGuide
        why="Dein Tipp steht. Jetzt rechnest du – zuerst das Schild über der Stuhlreihe: „Hier arbeitet man im Mittel __ Stunden“. Für „im Mittel“ gibt es zwei Maße: den Mittelwert (den Durchschnitt) und den Median (die Mitte der sortierten Reihe)."
        steps={[
          'Berechne Mittelwert und Median der Arbeitsstunden – für genau die Befragten, die in deiner Reihe sitzen.',
          'Vergleich Mittelwert und Median: Welcher Wert beschreibt die Stuhlreihe besser?',
          'Wähl das Maß und trag die Zahl fürs Schild ein.',
        ]}
        done="Zahl und Maß zusammenpassen (grüne Rückmeldung)." />
      {!state.guessLocked && !state.sign.value.trim() && !state.sign.measure
        ? <p className="sandbox-note">Gib zuerst oben deinen Tipp in der Stuhlreihe ab – dann rechnest du hier nach.</p>
        : <>
      <div className="task-grid">
        <label>Welches Maß kommt aufs Schild?<small className="task-field-help">Mittelwert oder Median</small><select value={state.sign.measure} onChange={e => set({ sign: { ...state.sign, measure: e.target.value as Measure | '' } })}>
          <option value="">Maß wählen</option><option value="mean">Mittelwert</option><option value="median">Median</option>
        </select></label>
        <label>Welche Zahl steht auf dem Schild?<small className="task-field-help">Stunden pro Woche, aus describe() – Komma oder Punkt geht beides</small><input type="text" inputMode="decimal" value={state.sign.value} onChange={e => set({ sign: { ...state.sign, value: e.target.value } })} /></label>
      </div>
      <Feedback notes={checkSign(data.sav, { ...state.sign, right: '' })} />
      </>}
      <HintLadder hint={hints.sign} onConcept={onConcept} />
    </section>

    <section className="task-step">
      <h3>Saal 2 · Nachrechnen: Wer arbeitet mehr als der Durchschnitt?</h3>
      <StepGuide
        why="Dein Schild hängt, dein Tipp steht. Jetzt prüfst du den Tipp: Wie viele der 100 Stühle gehören wirklich Menschen, die mehr arbeiten als der Durchschnitt? Läge der Durchschnitt genau in der Mitte, wären es 50."
        steps={[
          <>Zähl die Stunden in R aus – wieder nur für die Befragten in deiner Reihe. In der Spalte <em>Cum. %</em> (kumulierte Prozent) steht, wie viel Prozent höchstens so viele Stunden arbeiten.</>,
          '100 minus Cum. % in der letzten Zeile unter dem Mittelwert ergibt die Stühle über dem Mittelwert. Trag die Zahl ein – dann siehst du deinen Tipp neben dem echten Mittelwert.',
        ]}
        done="die Zahl grün bestätigt ist und du deinen Tipp mit dem echten Mittelwert vergleichen kannst." />
      {state.guessLocked && <>
        <div className="task-grid">
          <label>Wie viele der 100 Stühle liegen über dem Mittelwert?<small className="task-field-help">Jetzt in R nachgerechnet: 100 minus Cum. % in der letzten Zeile unter dem Mittelwert</small><input type="text" inputMode="numeric" value={state.sign.right} onChange={e => set({ sign: { ...state.sign, right: e.target.value } })} /></label>
        </div>
        <Feedback notes={checkRight(data.sav, state.sign.selection, state.sign.right)} />
        {rightOk && !signDone && <p className="sandbox-note">Trag oben noch Maß und Zahl fürs Schild ein – dann siehst du deinen Tipp neben dem echten Mittelwert.</p>}
      </>}
      {revealed && <>
        <ChairRow values={rowValues} guess={state.guess} stats={rowStats} />
        <Feedback notes={compareGuess(state.guess ?? 50, rowStats)} />
      </>}
      <HintLadder hint={hints.row} onConcept={onConcept} file="stuehle.R" />
      <p className="s02-takeaway"><strong>Das Wichtigste aus dieser Sitzung:</strong> Eine Prozentzahl oder ein Mittelwert sagt erst etwas, wenn klar ist, wer mitzählt – und welches Maß gemeint ist.</p>
    </section>

    <PlenumCard title="Deutschland in 100 Stühlen" lines={plenumLines(state)} file="stuehle-plenum.md" />
    {statusS03(state) === 'done' && revealed && <details className="s02-solution"><summary>Ein vollständiges R-Skript zum Mitnehmen</summary><RBlock code={R_SOLUTION} file="stuehle.R" /></details>}
  </div>;
}
