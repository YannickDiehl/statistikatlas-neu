import { useMemo } from 'react';
import { Feedback } from '../kit/Feedback';
import { HintLadder } from '../kit/HintLadder';
import { PartnerToggle, type WorkMode } from '../kit/PartnerToggle';
import { PlenumCard } from '../kit/PlenumCard';
import { RBlock } from '../kit/RBlock';
import { RoleBrief } from '../kit/RoleBrief';
import { StepGuide } from '../kit/StepGuide';
import { Toolbox } from '../kit/Toolbox';
import { de } from '../kit/numbers';
import type { TaskProps } from '../types';
import { hints, INSTITUTE, PLACEHOLDERS, ROLE, ROLES, TEXTS, TOOLBOX_SCRIPT, VERSIONS } from './content';
import { Clouds } from './Clouds';
import {
  anovaDone, becauseNotes, checkEntry, cloudPopulation, commitGut, compareGut, gutCount, gutDone, gutTruth, uncommitGut, checkF, checkP, checkR, checkShare, checkTukey, computeFor, gutFixed, withGutLock, lockMarks, markNotes, matrixReady, meansDone, plenumLines, pp,
  rScriptFor, statusS06, toggleMark, toggleTukey, trap, trapReady, tryTukey, TUKEY_KEYS, unlockMarks, versionPair, weightedNotes, type S06State, type TEntry,
} from './domain';
import { InviteGrid, InviteLegend } from './Invites';
import { MatrixMarks, MatrixReveal } from './Matrix';
import { CellTable, TrapChart, TTestFields, TukeyTable, VersionChips, VersionTable } from './Parts';
import { Release } from './Release';
import { TextAnswer } from '../kit/TextAnswer';

const roleLabel = (r: keyof typeof ROLES, mode: WorkMode) => (mode === 'pair' ? `${r === 'panel' ? 'A' : 'B'} · ${ROLES[r]}` : ROLES[r]);
const diffText = (grouping: 'rep' | 'amt', diff: number | null) =>
  diff === null ? null : `Deine Differenz aus deinen Quoten: ${grouping === 'rep' ? '„mit“ − „ohne“' : '10 € − 5 €'} = ${pp(diff)}`;
/** Steht in einem t-Test-Eintrag schon etwas? Gespeicherte Eingaben bleiben sichtbar, auch wenn die Felder sonst noch zu wären. */
const typedIn = (e: { rep: TEntry; amt: TEntry }) => [...Object.values(e.rep), ...Object.values(e.amt)].some(x => x.trim() !== '');
const FIELDS_CLOSED = 'Die Felder öffnen sich, sobald du oben unter „Vorab“ deinen Tipp abgegeben hast.';

export function LetzteFrage({ data, state, onChange, onConcept }: TaskProps<S06State>) {
  const c = useMemo(() => computeFor(data.sav), [data.sav]);
  const cloudPop = useMemo(() => cloudPopulation(data.sav), [data.sav]);
  const change = (next: S06State) => onChange(withGutLock(c, next));
  const set = (patch: Partial<S06State>) => change({ ...state, ...patch });
  const role = (r: keyof typeof ROLES) => <span className="s06-role">{roleLabel(r, state.mode)}</span>;
  const setEntry = (station: 's1' | 's3', key: 'rep' | 'amt', e: TEntry) => set({ [station]: { ...state[station], [key]: e } } as Partial<S06State>);
  const s1rep = checkEntry(c, 'all', 'rep', state.s1.rep), s1amt = checkEntry(c, 'all', 'amt', state.s1.amt);
  const s3rep = checkEntry(c, 'online', 'rep', state.s3.rep), s3amt = checkEntry(c, 'online', 'amt', state.s3.amt);
  const rRep = checkR(c, 'wiederholung-papier', state.r.repPaper), rAmt = checkR(c, 'betrag-papier', state.r.amtPaper);
  const means = VERSIONS.map((v, i) => checkShare(c, { scope: 'online', grouping: 'version', level: v.code }, state.anova.means[i]));
  const tukey = checkTukey(c, state), anova = anovaDone(c, state), gutFixedNow = gutFixed(c, state);
  const showMatrix = matrixReady(c, state), showTrap = trapReady(c, state), showWeighted = anova;
  const trapData = showTrap ? trap(c) : null;
  const matrix = state.matrixView === 'weighted' ? c.matrix.weighted : c.matrix.unweighted;
  const gutN = gutCount(state.gut.rate), gutLockedNow = state.gutCommitted || gutFixedNow, meansOk = meansDone(c, state);
  const truth = meansOk && gutDone(c, state) && gutN !== null ? gutTruth(c, state) : null;
  const ownPoints = s1rep.valid && s1rep.diff !== null ? pp(s1rep.diff).replace(' Pp.', '') : null;
  // Erst festlegen, dann rechnen: Die Felder für Quoten aus R öffnen sich nach dem Tipp.
  const tipDone = gutDone(c, state);
  const open1 = tipDone || typedIn(state.s1), open3a = tipDone || typedIn(state.s3);
  const open3b = tipDone || [...state.anova.means, state.anova.F, state.anova.p].some(x => x.trim() !== '');

  return <div className="task s06">
    <RoleBrief role={ROLE} title="Die letzte Frage">
      <p><strong>Neuer Job: Panelaufbau beim {INSTITUTE}.</strong> Morgen um 9 Uhr geht unsere Jahresbefragung online. Ganz am Ende steht die Frage, von der wir leben: „Dürfen wir Sie zu weiteren Befragungen einladen?“ Wer Ja sagt, kommt in unser Panel. Das ist eine feste Gruppe, die wir immer wieder befragen.</p>
      <p>Offen ist nur, <em>wie</em> wir fragen. Versprechen wir 5 € oder 10 €? Und nennen wir das Geld nur am Schluss der Frage – oder schon am Anfang und am Schluss noch einmal?</p>
      <p>Raten musst du nicht. Der ALLBUS 2023 hat genau diese Frage als Experiment gestellt. Wer den Fragebogen selbst ausfüllte, online oder auf Papier, bekam per Los eine von vier Fassungen (Variable <code>splt23_3</code>). Die Antwort steht in <code>xr21</code> (1 = ja, 2 = nein).</p>
      <p>Bis 9 Uhr brauche ich die Fassung, die wir programmieren. Dazu die Zusagequote, die wir der Geschäftsführung versprechen – also den Anteil der Eingeladenen, die Ja sagen. Und einen Satz, den wir ausdrücklich <em>nicht</em> behaupten. <strong>Deine Unterschrift steht unter der Freigabe.</strong></p>
      <p>Die Leitfrage für alle Stationen: <strong>Welche Fassung bringt online die meisten Zusagen – und wie sicher ist das?</strong></p>
      <p><strong>Was du dabei lernst:</strong> zwei Gruppen mit dem t-Test vergleichen, vier Gruppen mit der einfaktoriellen ANOVA und dem Tukey-Test, mit einer Korrelationsmatrix prüfen, ob ein Experiment sauber ausgelost ist, und eine Quote mit Konfidenzintervall berichten.</p>
    </RoleBrief>
    <PartnerToggle mode={state.mode} onChange={mode => set({ mode })}
      solo="Du übernimmst beide Rollen nacheinander. Als Panelaufbau rechnest du die t-Tests (Stationen 1 und 3a) und willst eine starke Zahl liefern. Als Qualitätssicherung prüfst du mit Korrelationsmatrix, ANOVA und Tukey (Stationen 2 und 3b) und darfst ein Veto einlegen. Am Ende unterschreibst du in beiden Rollen."
      pair="A ist Panelaufbau: Stationen 1 und 3a (t-Tests). A will der Geschäftsführung eine starke Zahl liefern. B ist Qualitätssicherung: Stationen 2 und 3b (Korrelationsmatrix, ANOVA, Tukey). B darf ein Veto einlegen. Den Tipp gebt ihr jede:r für sich ab. Die Freigabe braucht beide Unterschriften mit je einem Satz." />

    <Toolbox file="letzte-frage-werkzeuge.R" code={TOOLBOX_SCRIPT} tools={[
      { fn: 'library(), read_spss(), codebook()', text: <>kennst du aus Sitzung 1: Pakete laden, Daten einlesen, im Codebuch nachsehen.</> },
      { fn: '%>%', text: <>kennst du aus Sitzung 4: Lies die Pipe als „und dann“. <code>allbus %&gt;% filter(…) %&gt;% t_test(…) %&gt;% summary()</code> heißt: Nimm <code>allbus</code>, behalte dann bestimmte Befragte, rechne dann den t-Test und zeig dann die ganze Ausgabe.</> },
      { fn: 'filter(), describe()', text: <>kennst du aus Sitzung 2 und 3: nur bestimmte Befragte behalten, Kennzahlen einer Variable berechnen. Steht <code>filter()</code> in der Kette vor einem Test, rechnet der Test nur mit diesen Befragten.</> },
      { fn: 'mutate() + rec()', text: <>kennst du aus Sitzung 5: bildet aus einer Variable eine neue; links vom <code>=</code> steht ihr Name. In <code>rules</code> steht, welcher Code welcher wird; mehrere Codes trennst du mit Komma. Der Trick für heute: Der Mittelwert einer 0/1-Variable ist der Anteil der Einsen.</> },
      { fn: 't_test()', isNew: true, text: <>vergleicht den Mittelwert einer Variable zwischen zwei Gruppen (<code>group = …</code>). Ohne <code>group</code> zeigt er einen Mittelwert mit 95-%-Konfidenzintervall (der Spanne, in der der wahre Wert vermutlich liegt).</> },
      { fn: 'summary()', isNew: true, text: <>zeigt die ausführliche Ausgabe eines Tests. Häng es mit <code>%&gt;%</code> hinter den Test, dann siehst du die ganze Tabelle, etwa beide Gruppenmittelwerte.</> },
      { fn: 'oneway_anova()', isNew: true, text: <>vergleicht die Mittelwerte von drei oder mehr Gruppen auf einmal (einfaktorielle ANOVA, auch Varianzanalyse). Sie sagt nur, ob sich <em>irgendeine</em> Gruppe unterscheidet.</> },
      { fn: 'tukey_test()', isNew: true, text: <>vergleicht nach der ANOVA alle Paare von Gruppen und rechnet dabei ein, dass es viele Vergleiche sind. Du hängst ihn mit <code>%&gt;%</code> direkt hinter <code>oneway_anova()</code>.</> },
      { fn: 'pearson_cor()', text: <>kennst du aus Sitzung 6 für zwei Variablen. Neu heute: Mit mehr Variablen rechnet es alle Paare auf einmal – das ist eine Korrelationsmatrix.</> },
      { fn: 'weights = wghtpew', text: <>kennst du aus Sitzung 6: rechnet gewichtet. Geht auch bei <code>t_test()</code> und <code>oneway_anova()</code>.</> },
    ]} />

    <section className="task-step">
      <h3>Einstieg · Zwei Gruppen, ein t-Test</h3>
      <StepGuide
        why={<>Bevor du in R rechnest: Ein t-Test vergleicht die Mittelwerte zweier Gruppen. Er fragt, ob der Unterschied größer ist, als es der Zufall der Stichprobe erwarten lässt. Hier siehst du echte ALLBUS-Daten: die Lebenszufriedenheit (<code>ls01</code>) im Westen und im Osten (<code>eastwest</code>). Aus allen Befragten jeder Gruppe ziehst du Stichproben. Du stellst Unterschied, Streuung und Gruppengröße selbst ein und siehst, wie t, p und das Konfidenzintervall reagieren.</>}
        steps={[
          'Zieh mehrmals eine neue Stichprobe. Was bleibt gleich, was springt: die Punkte, die roten Linien, t, p?',
          'Zieh eine rote Linie nach links oder rechts. Was passiert mit t, wenn die Gruppen weiter auseinanderliegen?',
          'Mach die Streuung kleiner und größer. Welcher Teil des Bruchs für t ändert sich – und wie das Intervall?',
          'Wähl verschiedene Gruppengrößen und zieh jeweils einige Stichproben. Wann liegt p meistens unter 0,05, wann selten?',
          'Sieh dir die Intervalle unter der Grafik an. Was haben die Stichproben gemeinsam, bei denen p unter 0,05 liegt?',
        ]}
        done="du sagen kannst, wovon t abhängt und wann p unter 0,05 rutscht." />
      {cloudPop
        ? <Clouds pop={cloudPop} />
        : <p className="sandbox-note">Für diesen Einstieg braucht die Datei die Variablen <code>ls01</code> und <code>eastwest</code>.</p>}
    </section>

    <section className="task-step">
      <h3>Vorab · Dein Bauchgefühl</h3>
      <StepGuide
        why="Du hast gesehen, wie ein t-Test auf Unterschied, Streuung und Gruppengröße reagiert. Jetzt geht es um die Einladungsfrage. Bevor du rechnest, legst du fest, was du erwartest. Nur so merkst du später, was die Daten dir Neues zeigen."
        steps={[
          'Lies die vier Fassungen in der Tabelle: Sie unterscheiden sich im Betrag und darin, wo das Geld im Fragetext steht.',
          'Wähl die Fassung, die du nach Bauchgefühl programmieren würdest.',
          'Schätz, wie viele von 100 Online-Eingeladenen bei dieser Fassung Ja sagen: Klick auf den letzten Umschlag, der Ja sagt. Dann gib deinen Tipp ab.',
        ]}
        done="dein Tipp abgegeben ist. Dann öffnen sich die Felder in den Stationen." />
      <VersionTable />
      <p className="task-prompt">Welche Fassung würdest du nach Bauchgefühl programmieren? Klick eine an.</p>
      <VersionChips label="Fassung nach Bauchgefühl" value={state.gut.version} disabled={gutLockedNow} onChange={v => set({ gut: { ...state.gut, version: v } })} />
      <p className="task-prompt">Wie viele von 100 Eingeladenen sagen online{state.gut.version ? ` bei ${state.gut.version}` : ''} Ja?
        <small className="task-field-help">Stell dir 100 Eingeladene vor. Klick auf einen Umschlag: Alle bis dorthin sagen Ja. Mit den Pfeiltasten geht es auch. Geschätzt – wird nicht geprüft.</small></p>
      <InviteGrid count={gutN} locked={gutLockedNow} onPick={n => set({ gut: { ...state.gut, rate: String(n) } })} label="Deine Schätzung: Wie viele von 100 Eingeladenen sagen Ja?" />
      <InviteLegend />
      <p className="s06-own" aria-live="polite">{gutN !== null ? `Du erwartest: ${gutN} von 100 sagen Ja (${gutN} %).` : state.gut.rate.trim() ? `Du erwartest: ${state.gut.rate.trim()}` : 'Du erwartest: – (noch kein Umschlag markiert)'}</p>
      <div className="sandbox-chips">
        {!gutLockedNow
          ? <button className="primary" disabled={!state.gut.version || gutN === null} onClick={() => change(commitGut(state))}>Tipp abgeben</button>
          : state.gut.version && gutN !== null
            ? <><span className="sandbox-note">Tipp abgegeben: {state.gut.version} mit {gutN} von 100.</span>{!gutFixedNow && <button className="sandbox-link" onClick={() => change(uncommitGut(c, state))}>Neu tippen</button>}</>
            : <span className="sandbox-note">Kein Tipp abgegeben – deine erste Quote aus R ist schon erkannt.</span>}
      </div>
      <p className="sandbox-note">{gutFixedNow
        ? 'Dein Tipp ist festgehalten, seit deine erste Quote aus R erkannt ist. Er bleibt ein Vorher.'
        : 'Dein Tipp wird nicht geprüft. In Station 3b siehst du ihn neben der echten Quote, am Ende steht er auf deiner Freigabe-Karte. „Neu tippen“ geht, bis deine erste Quote aus R erkannt ist.'}</p>
    </section>

    <section className="task-step">
      <h3>Station 1 · Erste Auswertung {role('panel')}</h3>
      <StepGuide
        why={<>Dein Tipp steht. Jetzt rechnest du nach – zuerst so, wie es naheliegt: mit allen, die die Einladungsfrage bekommen haben, online und Papier zusammen. Du vergleichst zweimal zwei Gruppen: ohne und mit Wiederholung, 5 € und 10 €. Für zwei Gruppen ist der t-Test da.</>}
        steps={[
          <>Sieh im Codebuch nach, welche Codes <code>xr21</code> und <code>splt23_3</code> haben.</>,
          <>Bilde aus <code>xr21</code> eine Variable <code>zusage</code> mit 1 = ja und 0 = nein. Ihr Mittelwert ist dann die Zusagequote. Welches Werkzeug kodiert um?</>,
          <>Fass die vier Fassungen zweimal zusammen: zu <code>wiederholung</code> (ohne: A1, B1; mit: A2, B2) und zu <code>betrag</code> (5 €: A1, A2; 10 €: B1, B2). Welche Codes gehören jeweils zusammen?</>,
          <>Vergleiche die Zusagequote mit je einem t-Test zwischen den Gruppen von <code>wiederholung</code> und von <code>betrag</code>. Wer im persönlichen Interview befragt wurde, bekam die Frage nicht; R lässt diese fehlenden Werte von selbst weg.</>,
          'Trag je Test beide Zusagequoten ein.',
        ]}
        done="alle vier Quoten grün bestätigt sind." />
      {!open1 && <p className="sandbox-note">{FIELDS_CLOSED}</p>}
      {open1 && <>
        <TTestFields id="s06-s1-rep" legend="t-Test Wiederholung (ohne/mit) · online und Papier zusammen" labels={['Wie hoch ist die Zusagequote „ohne“ Wiederholung?', 'Wie hoch ist die Zusagequote „mit“ Wiederholung?']} rows={['ohne', 'mit']}
          entry={state.s1.rep} onChange={e => setEntry('s1', 'rep', e)} notes={s1rep.notes} diff={diffText('rep', s1rep.diff)} />
        <TTestFields id="s06-s1-amt" legend="t-Test Betrag (5/10 €) · online und Papier zusammen" labels={['Wie hoch ist die Zusagequote bei 5 €?', 'Wie hoch ist die Zusagequote bei 10 €?']} rows={['5 Euro', '10 Euro']}
          entry={state.s1.amt} onChange={e => setEntry('s1', 'amt', e)} notes={s1amt.notes} diff={diffText('amt', s1amt.diff)} />
        <p className="sandbox-note">{TEXTS.sign}</p>
      </>}
      <details className="s06-details"><summary>Warum darf ich eine 0/1-Variable mit dem t-Test vergleichen?</summary>
        <p>{TEXTS.zeroOne} <button className="sandbox-link" onClick={() => onConcept('sampling_distribution')}>Stichprobenverteilung in der Karte</button></p>
      </details>
      {ownPoints && <p className="s06-voice">Die Geschäftsführung liest mit: „{ownPoints} Punkte durch die Wiederholung – das nehmen wir!“ Bevor du unterschreibst, prüft die Qualitätssicherung, ob die Gruppen überhaupt vergleichbar sind.</p>}
      <HintLadder key="s1" hint={hints.s1} onConcept={onConcept} file="letzte-frage-station1.R" />
    </section>

    <section className="task-step">
      <h3>Station 2 · Zufallscheck {role('qs')}</h3>
      <StepGuide
        why="Station 1 liefert einen großen Unterschied. Aber ist er fair gemessen? Das prüfst du jetzt. Hat das Los die Fassungen verteilt, darf die Fassung mit nichts zusammenhängen, was schon vor dem Los feststand – etwa mit dem Alter oder damit, ob jemand online oder auf Papier antwortet."
        steps={[
          'Erst festlegen: Klick in der leeren Matrix die Zellen an, die bei echter Auslosung ungefähr 0 sein müssten. Dann halte deine Markierung fest.',
          <>Bilde aus <code>mode</code> eine 0/1-Variable <code>papier</code> (0 = online, 1 = Papier).</>,
          <>Rechne die Korrelationen zwischen <code>wiederholung</code>, <code>betrag</code>, <code>papier</code>, <code>age</code> und <code>zusage</code> – alle Paare auf einmal. Welches Werkzeug kann das?</>,
          'Trag die zwei abgefragten Zellen ein. Dann siehst du die ganze Matrix neben deiner Markierung.',
          'Erklär in ein, zwei Sätzen, woher der Unterschied aus Station 1 kommt.',
        ]}
        done="die Matrix zu sehen ist und deine Erklärung steht." />
      <p className="task-prompt">Welche Zellen müssten bei echter Auslosung ungefähr 0 sein? Klick sie an – mehrere sind möglich.</p>
      <MatrixMarks marks={state.marks} locked={state.locked} onToggle={p => change(toggleMark(state, p))} />
      <div className="sandbox-chips">
        {!state.locked
          ? <button className="primary" onClick={() => change(lockMarks(state))} disabled={!state.marks.length}>Markierung festhalten</button>
          : <><span className="sandbox-note">Deine Markierung ist festgehalten.</span>{!showMatrix && <button className="sandbox-link" onClick={() => change(unlockMarks(state, c))}>Neu markieren</button>}</>}
      </div>
      {state.locked && <div className="task-grid">
        <label>Wie stark hängen wiederholung und papier zusammen?<small className="task-field-help">Korrelation r aus pearson_cor(): Zeile „wiederholung x papier“ – mit Vorzeichen, so wie R es zeigt</small><input type="text" inputMode="decimal" maxLength={12} value={state.r.repPaper} onChange={e => set({ r: { ...state.r, repPaper: e.target.value } })} /></label>
        <label>Wie stark hängen betrag und papier zusammen?<small className="task-field-help">Korrelation r aus pearson_cor(): Zeile „betrag x papier“ – mit Vorzeichen, so wie R es zeigt</small><input type="text" inputMode="decimal" maxLength={12} value={state.r.amtPaper} onChange={e => set({ r: { ...state.r, amtPaper: e.target.value } })} /></label>
      </div>}
      {state.locked && <Feedback notes={[...rRep.notes, ...rAmt.notes]} />}
      {showMatrix && <div className="s06-reveal">
        <p className="task-prompt">Welche Matrix willst du sehen? Klick zum Umschalten.</p>
        <div className="sandbox-chips" role="group" aria-label="Gewichtung der Matrix">
          <button aria-pressed={state.matrixView === 'unweighted'} onClick={() => set({ matrixView: 'unweighted' })}>ungewichtet</button>
          <button aria-pressed={state.matrixView === 'weighted'} onClick={() => set({ matrixView: 'weighted' })}>gewichtet</button>
        </div>
        <MatrixReveal m={matrix} marks={state.marks} weighted={state.matrixView === 'weighted'} />
        <ul className="s06-notes">{markNotes(c, state.marks, matrix).map(n => <li key={n}>{n}</li>)}</ul>
        <CellTable cells={c.cells} />
        <TextAnswer id="s06-because" maxLength={600} size="long"
          label={ownPoints ? `Warum kommen deine ${ownPoints} Punkte aus Station 1 nicht (nur) von der Wiederholung?` : 'Warum kommt der Unterschied aus Station 1 nicht (nur) von der Wiederholung?'}
          help="Ein, zwei Sätze – nutze die Matrix und die Tabelle „Wer bekam welche Fassung?“"
          example={PLACEHOLDERS.because} value={state.because} onChange={because => set({ because })} />
        <Feedback notes={becauseNotes(state.because)} />
      </div>}
      <HintLadder key="s2" hint={hints.s2} onConcept={onConcept} file="letzte-frage-station2.R" />
    </section>

    <section className="task-step">
      <h3>Station 3a · Der saubere Vergleich: nur online {role('panel')}</h3>
      <StepGuide
        why="In Station 1 hast du online und Papier zusammengenommen. Das Institut befragt aber nur online – und für die Freigabe zählt, was dort passiert. Also wiederholst du die beiden t-Tests nur für die Online-Befragten."
        steps={[
          <>Sieh im Codebuch bei <code>mode</code> nach: Welcher Code steht für online? Behalte nur diese Befragten.</>,
          'Rechne dieselben zwei t-Tests noch einmal – mit den Online-Befragten.',
          'Trag die Quoten ein und vergleiche mit Station 1: Welche Quote hat sich bewegt, welche nicht?',
        ]}
        done="alle vier Quoten grün bestätigt sind." />
      {!open3a && <p className="sandbox-note">{FIELDS_CLOSED}</p>}
      {open3a && <>
        <TTestFields id="s06-s3-rep" legend="t-Test Wiederholung (ohne/mit) · nur online" labels={['Wie hoch ist die Zusagequote „ohne“ Wiederholung?', 'Wie hoch ist die Zusagequote „mit“ Wiederholung?']} rows={['ohne', 'mit']}
          entry={state.s3.rep} onChange={e => setEntry('s3', 'rep', e)} notes={s3rep.notes} diff={diffText('rep', s3rep.diff)} />
        <TTestFields id="s06-s3-amt" legend="t-Test Betrag (5/10 €) · nur online" labels={['Wie hoch ist die Zusagequote bei 5 €?', 'Wie hoch ist die Zusagequote bei 10 €?']} rows={['5 Euro', '10 Euro']}
          entry={state.s3.amt} onChange={e => setEntry('s3', 'amt', e)} notes={s3amt.notes} diff={diffText('amt', s3amt.diff)} />
      </>}
      {trapData && <div className="s06-reveal">
        <h4>Die Falle</h4>
        <TrapChart trap={trapData} view={state.trapView} onView={v => set({ trapView: v })} />
        <p className="sandbox-note">{TEXTS.codebook}</p>
      </div>}
      {!trapData && s3rep.valid && !s1rep.valid && <p className="sandbox-note">Trag auch die Quoten „ohne/mit“ aus Station 1 ein – dann zeige ich dir, was zwischen beiden Rechnungen passiert ist.</p>}
      <HintLadder key="s3a" hint={hints.s3a} onConcept={onConcept} file="letzte-frage-station3.R" />
    </section>

    <section className="task-step">
      <h3>Station 3b · Vier Fassungen, sechs Paare {role('qs')}</h3>
      <StepGuide
        why="Bisher hast du immer zwei Gruppen verglichen. Programmiert wird aber eine von vier Fassungen. Ein t-Test schafft nur zwei Gruppen. Für vier auf einmal gibt es die einfaktorielle ANOVA: Sie sagt, ob sich irgendeine Fassung unterscheidet. Welche Paare es sind, zeigt danach der Tukey-Test."
        steps={[
          <>Rechne mit den Online-Befragten eine ANOVA: <code>zusage</code> nach den vier Fassungen in <code>splt23_3</code>.</>,
          'Trag die vier Zusagequoten ein, dazu F und p der ANOVA. Danach siehst du deinen Tipp neben der echten Quote.',
          'Rechne den Tukey-Test. Wähl alle Paare, die sich signifikant unterscheiden (p unter 0,05), und prüf deine Auswahl.',
        ]}
        done="deine Tukey-Auswahl grün bestätigt ist." />
      {!open3b && <p className="sandbox-note">{FIELDS_CLOSED}</p>}
      {open3b && <fieldset className="s06-fields">
        <legend>ANOVA · nur online</legend>
        <div className="task-grid">
          {VERSIONS.map((v, i) => <label key={v.id}>Wie hoch ist die Zusagequote von Fassung {v.id}?<small className="task-field-help">Zeile „{v.id} - …“, Spalte Mean unter „Descriptive Statistics“ – in Prozent oder so, wie R es zeigt</small><input type="text" inputMode="decimal" maxLength={12} value={state.anova.means[i]}
            onChange={e => set({ anova: { ...state.anova, means: state.anova.means.map((m, k) => (k === i ? e.target.value : m)) } })} /></label>)}
          <label>Wie groß ist der F-Wert der ANOVA?<small className="task-field-help">Zeile „Between Groups“, Spalte F unter „ANOVA Results“</small><input type="text" inputMode="decimal" maxLength={12} value={state.anova.F} onChange={e => set({ anova: { ...state.anova, F: e.target.value } })} /></label>
          <label>Wie groß ist der p-Wert der ANOVA?<small className="task-field-help">Dieselbe Zeile „Between Groups“, Spalte Sig – so, wie R ihn zeigt, mit drei Nachkommastellen</small><input type="text" inputMode="decimal" maxLength={12} value={state.anova.p} onChange={e => set({ anova: { ...state.anova, p: e.target.value } })} /></label>
        </div>
        <Feedback notes={[...means.flatMap(m => m.notes), ...checkF(c, state.anova.F).notes, ...checkP(c, state.anova.p).notes]} />
      </fieldset>}
      {truth && gutN !== null && <div className="s06-reveal">
        <h4>Dein Tipp neben der echten Quote</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 32px' }}>
          <figure style={{ margin: 0, flex: '1 1 240px', maxWidth: 330 }}>
            <figcaption className="s06-own">Dein Tipp<br /><span style={{ fontWeight: 400 }}>{gutN} von 100 sagen Ja</span></figcaption>
            <InviteGrid count={gutN} label="Dein Tipp" />
          </figure>
          <figure style={{ margin: 0, flex: '1 1 240px', maxWidth: 330 }}>
            <figcaption className="s06-own">Tatsächlich · {truth.label}<br /><span style={{ fontWeight: 400 }}>{Math.round(100 * truth.rate)} von 100 sagen Ja ({de(100 * truth.rate, 1)} %)</span></figcaption>
            <InviteGrid count={Math.round(100 * truth.rate)} label={`Tatsächlich, ${truth.label}`} />
          </figure>
        </div>
        <InviteLegend />
        <Feedback notes={[compareGut(gutN, truth.rate)]} />
      </div>}
      <p className="task-prompt">Welche Paare unterscheiden sich nach Tukey signifikant? Wähl alle aus und klick dann auf „Auswahl prüfen“.<small className="task-field-help">Signifikant heißt hier: In der Tukey-Ausgabe steht in der Spalte p-value ein Wert unter 0,05</small></p>
      {!anova && <p className="sandbox-note">Die Auswahl öffnet sich, sobald oben F oder p deiner ANOVA erkannt ist.</p>}
      <div className="sandbox-chips" role="group" aria-label="Signifikante Tukey-Paare">
        {TUKEY_KEYS.map(k => <button key={k} disabled={!anova} aria-pressed={state.tukey.includes(k)} onClick={() => change(toggleTukey(state, k))}>{versionPair(k)}</button>)}
        <button disabled={!anova} aria-pressed={state.tukey.includes('none')} onClick={() => change(toggleTukey(state, 'none'))}>kein Paar</button>
        <button className="primary" disabled={!anova || !state.tukey.length} onClick={() => change(tryTukey(state))}>Auswahl prüfen</button>
      </div>
      <Feedback notes={tukey.notes} />
      {tukey.correct && c.tukey.online && <TukeyTable rows={c.tukey.online} weighted={showWeighted ? c.tukey.onlineW : null} />}
      {showWeighted && <div className="s06-reveal">
        <h4>Dieselbe ANOVA mit Gewicht</h4>
        <ul className="s06-notes">{weightedNotes(c, { rep: s3rep.valid, amt: s3amt.valid, tukey: tukey.correct }).map(n => <li key={n}>{n}</li>)}</ul>
        <p>{TEXTS.weighted}</p>
        <p className="sandbox-note">Probier es selbst: Rechne dieselbe ANOVA noch einmal mit <code>weights = wghtpew</code> – wie in Sitzung 6.</p>
      </div>}
      <HintLadder key="s3b" hint={hints.s3b} onConcept={onConcept} file="letzte-frage-station3b.R" />
    </section>

    <Release c={c} state={state} onChange={change} onConcept={onConcept} done={{ meansDone: meansOk, tukeyDone: tukey.correct }} roleLabel={roleLabel} />

    <PlenumCard title="Freigabe · Die letzte Frage" lines={plenumLines(state, c)} file="letzte-frage-freigabe.md" />
    {statusS06(state) === 'done' && <details className="s02-solution"><summary>Ein vollständiges R-Skript zum Mitnehmen</summary><RBlock code={rScriptFor(state)} file="letzte-frage.R" /></details>}
  </div>;
}
