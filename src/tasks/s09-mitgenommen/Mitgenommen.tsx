import { useMemo } from 'react';
import { Feedback } from '../kit/Feedback';
import { HintLadder } from '../kit/HintLadder';
import { de } from '../kit/numbers';
import { PartnerToggle } from '../kit/PartnerToggle';
import { PlenumCard } from '../kit/PlenumCard';
import { RBlock } from '../kit/RBlock';
import { RoleBrief } from '../kit/RoleBrief';
import { StepGuide } from '../kit/StepGuide';
import { Toolbox } from '../kit/Toolbox';
import type { TaskProps } from '../types';
import { BoardTable, CoefTable, PatternCards, PatternCompare, PredictionBlocks, TemplateChart, WobbleList } from './Charts';
import { CONTROLS, GROUP_IDS, GROUPS, hints, MAX_WORDS, MOVERS, PATTERN_CARDS, ROLE, SORT_LABEL, SORTS, TEMPLATE, TOOLBOX_SCRIPT, WORKSHOP, type ControlId, type GroupId } from './content';
import {
  board, builderData, checkControlled, checkCounter, checkDecide, checkInteraction, checkModel, checkMovers, checkPrediction, checkSelection, chooseRef, chooseSecondRef,
  comparePattern, controlEffect, maxVif, predictionParts, predictionReading, core, interaction, interactionRecognised, modelRecognised, modelStore, moverVariants, moversRecognised,
  offQuestions, others, plenumLines, prepare, rControls, rInteraction, rModel, rMovers, rSetup, rSolution, scaffoldControls, scaffoldCounter, scaffoldInteraction,
  scaffoldModel, selection, selectionRecognised, sortNote, statusS09, toggleControl, wobbleTest, wordCount, type ModelEntry, type S09State,
} from './domain';
import { TextAnswer } from '../kit/TextAnswer';
import { ModelBuilder } from './ModelBuilder';

const hasEntry = (e: ModelEntry) => e.c.trim() !== '' || e.b.some(x => x.trim() !== '');

export function Mitgenommen({ data, state, onChange, onConcept }: TaskProps<S09State>) {
  const set = (patch: Partial<S09State>) => onChange({ ...state, ...patch });
  const p = useMemo(() => prepare(data.sav), [data.sav]);
  const models = useMemo(() => modelStore(p), [p]);
  const movers = useMemo(() => moverVariants(p), [p]);
  const sel = useMemo(() => selection(p), [p]);
  const it = useMemo(() => interaction(p), [p]);
  const builder = useMemo(() => builderData(data.sav), [data.sav]);
  const ref = state.ref || null;
  const main = ref ? core(models, ref) : null;
  const modelOk = Boolean(ref && modelRecognised(main, ref, state.model));
  const second = state.second.ref ? core(models, state.second.ref) : null;
  const secondOk = Boolean(state.second.ref && modelRecognised(second, state.second.ref, state.second.model));
  const controlled = ref ? models({ outcome: 'rev', ref, controls: state.controls, weighted: true }) : null;
  const controlledOk = Boolean(ref && modelRecognised(controlled, ref, state.cmodel, false));
  const counter = ref ? core(models, ref, 'pt03') : null;
  const counterOk = Boolean(ref && modelRecognised(counter, ref, state.counter, false));
  const moverHit = moversRecognised(movers, state.movers[0], state.movers[1]);
  const selOk = selectionRecognised(sel, state.abi);
  const wob = useMemo(() => (modelOk && main ? wobbleTest(main) : null), [modelOk, main]);
  const consequences = state.controls.filter(id => CONTROLS.find(c => c.id === id)!.consequence);
  // „Ohne diese Kontrolle“ kann das Hauptmodell selbst sein (nur Folge-Kontrollen angekreuzt) – deshalb erst nach der eigenen Tabelle.
  const without = ref && modelOk && controlledOk && consequences.length ? models({ outcome: 'rev', ref, controls: state.controls.filter(c => !consequences.includes(c)), weighted: true }) : null;
  const effect = ref && controlledOk ? controlEffect(models, ref, state.controls) : null;
  const parts = modelOk && main ? predictionParts(main, state.model) : null;
  const predHit = modelOk && main && state.pred.trim() ? predictionReading(main, state.model, state.pred) : null;
  const predShown = predHit ? de(predHit.x, predHit.decimals) : null;
  // Erst festlegen, dann rechnen: Die Felder für die eigene Tabelle öffnen sich nach dem Tipp (gespeicherte Eingaben bleiben sichtbar).
  const tableOpen = state.patternLocked || hasEntry(state.model);
  const boardRows = useMemo(() => board(models), [models]);
  const boardVif = useMemo(() => boardRows.map(r => ({ ref: r.ref, vif: maxVif(p, r.model) })), [p, boardRows]);
  const worstVif = boardVif.reduce<(typeof boardVif)[number] | null>((a, x) => (x.vif && (!a?.vif || x.vif.vif > a.vif.vif) ? x : a), null);
  const pair = state.mode === 'pair';
  const tag = (who: string) => (pair ? ` · ${who}` : '');
  const field = (id: string, label: string, help: string, value: string, onValue: (v: string) => void, example?: string) =>
    <TextAnswer id={id} maxLength={400} label={label} help={help} example={example} value={value} onChange={onValue} />;

  return <div className="task s09">
    <RoleBrief role="Recherche für einen Dokumentarfilm" title="Mitgenommen">
      <p><strong>Neuer Job: Datenrecherche in der {ROLE.desk}.</strong> Die Redaktion dreht den Film „{ROLE.film}“. Er handelt von Menschen, die zwischen Ost- und Westdeutschland umgezogen sind. Redakteurin {ROLE.editor} schreibt dir:</p>
      <p>„Ostdeutsche sind im Schnitt unzufriedener mit der Demokratie. Das wissen alle. Uns interessiert: Was nehmen Menschen mit, wenn sie umziehen? In der Redaktion gibt es zwei Lager. Die einen sagen: Es ist die <strong>Prägung</strong>. Wer im Osten aufwuchs, bleibt unzufriedener – egal, wo er heute lebt. Die anderen sagen: Es ist der <strong>Ort</strong>. Wer in den Osten zieht, wird so unzufrieden wie die neuen Nachbarn. Am Ende des Films sagt unsere Sprecherin einen Satz dazu. Du schreibst ihn. Er muss stimmen. Und er darf nicht mehr behaupten, als die Daten tragen.“</p>
      <p><strong>Du lieferst</strong> einen Off-Text-Satz (höchstens {MAX_WORDS} Wörter) und eine Schnittplan-Karte mit deinen Zahlen. Grundlage ist die Demokratiezufriedenheit <code>ps03</code>, umgepolt: höher heißt zufriedener.</p>
      <p>Die Leitfrage: <strong>Nehmen Umgezogene ihre Zufriedenheit mit – oder übernehmen sie die ihres neuen Wohnorts?</strong></p>
      <p><strong>Was du dabei lernst:</strong> Gruppen mit Dummies in eine Regression bringen, eine Referenzgruppe wählen und lesen, Kontrollvariablen begründen und eine Interaktion deuten.</p>
    </RoleBrief>
    <PartnerToggle mode={state.mode} onChange={mode => set({ mode })}
      solo="Du rechnest allein mit zwei Referenzgruppen nacheinander. Dafür änderst du nur die Formel. Selektion, Kontrollen und Gegenprobe machst du auch selbst. Danach zeigt dir eine Tafel alle vier Referenzgruppen."
      pair="A ist „Schnittplatz Ost“ und rechnet mit der Referenzgruppe Ost-Bleibende. B ist „Schnittplatz West“ und rechnet mit der Referenzgruppe West-Bleibende. Gleicht eure Vorhersagen ab – sie müssen übereinstimmen. Danach prüft A Selektion und Kontrollen, B die Gegenprobe. Den Off-Text schreibt ihr gemeinsam." />

    <Toolbox file="mitgenommen-werkzeuge.R" code={TOOLBOX_SCRIPT} tools={[
      { fn: 'library(), read_spss(), codebook()', text: <>kennst du: Pakete laden, Daten einlesen, im Codebuch nachsehen.</> },
      { fn: '%>%', text: <>kennst du aus Sitzung 4: die Pipe, lies sie als „und dann“. Der Datensatz steht vorn: <code>allbus %&gt;% frequency(work)</code>. Mit <code>allbus &lt;- allbus %&gt;% …</code> bleiben neue Variablen im Datensatz gespeichert.</> },
      { fn: 'frequency()', text: <>kennst du aus Sitzung 3: zählt, wie oft jeder Code vorkommt (Spalte N).</> },
      { fn: 'mutate() + rec()', text: <>kennst du aus Sitzung 5: legt neue Variablen an, links vom <code>=</code> steht ihr neuer Name. Mehrere schreibst du in ein <code>mutate()</code>. Mit <code>rules</code> fasst <code>rec()</code> Codes zusammen (<code>"1:2=1; 3:5=0"</code>) oder polt um (<code>"rev"</code>).</> },
      { fn: 'crosstab()', text: <>kennst du aus Sitzung 5 und 6: <code>percentages = "row"</code> rechnet Zeilenprozente, <code>weights = wghtpew</code> gewichtet.</> },
      { fn: 'linear_regression() + summary()', text: <>kennst du aus Sitzung 9: <code>summary()</code> zeigt die Tabelle <em>Coefficients</em> mit der Konstante (Zeile <em>(Intercept)</em>) und den B.</> },
      { fn: 'to_dummy()', isNew: true, text: <>zerlegt eine Variable mit mehreren Gruppen in <strong>Dummies</strong>: je Ausprägung eine 0/1-Variable (1 = gehört zur Gruppe, 0 = nicht), benannt mit <code>_1</code>, <code>_2</code> … Ins Modell kommen alle bis auf einen. Die weggelassene Gruppe ist die <strong>Referenzgruppe</strong>.</> },
      { fn: 'y ~ x1 + x2 + x3', isNew: true, text: <>mehrere Prädiktoren, mit <code>+</code> verbunden. Jedes B gilt dann bei gleichen Werten der übrigen Prädiktoren. So nimmst du auch Kontrollvariablen auf.</> },
      { fn: 'y ~ x1 * x2', isNew: true, text: <>Interaktion: R schätzt beide Einzeleffekte und dazu die Zeile <code>x1:x2</code>. Sie zeigt, wie viel anders beide zusammen wirken als die Summe der einzelnen.</> },
    ]} />

    <section className="task-step">
      <h3>Einstieg · Referenzgruppe, Kontrolle und Interaktion ausprobieren</h3>
      <StepGuide
        why={<>Bevor du in R rechnest: Ein Modell mit Dummies setzt jede Vorhersage aus Stücken zusammen – aus der Konstante und einem oder mehreren B. Hier siehst du echte ALLBUS-Zahlen zur Lebenszufriedenheit (<code>ls01</code>, 0 bis 10), eingeteilt nach Schicht oder Altersgruppe. Du stellst das Modell selbst ein und siehst, wie sich die Stücke verschieben.</>}
        steps={[
          'Wähl eine Referenzgruppe – mit den Knöpfen oder mit einem Klick auf einen Balken. Welcher Balken besteht jetzt nur aus der Konstante?',
          'Wechsle die Referenzgruppe mehrmals. Was passiert mit der Konstante und den B? Und was mit der Höhe der Balken?',
          'Nimm die Gesundheit als Kontrolle dazu (+). Wie verändern sich die B der Gruppen? Woran könnte das liegen?',
          'Stell auf Interaktion (*). Bei welchen Balken kommt noch ein Stück dazu – und was misst es?',
          'Wechsle zur Altersgruppe und nimm die Gesundheit wieder als Kontrolle dazu. Was ist jetzt anders als bei der Schicht?',
        ]}
        done="du in eigenen Worten sagen kannst, was die Wahl der Referenzgruppe, eine Kontrolle und eine Interaktion mit den Balken machen." />
      <ModelBuilder data={builder} />
    </section>

    <section className="task-step">
      <h3>1 · Prägung oder Ort?</h3>
      <StepGuide
        why="Du hast gesehen, wie ein Modell seine Vorhersagen aus Konstante und B zusammensetzt. Jetzt zum Film: Bevor du rechnest, klärst du, woran sich der Streit überhaupt entscheiden lässt. Beide Lager sagen für vier Gruppen etwas voraus: für die Ost-Bleibenden, die West-Bleibenden und die Umgezogenen in beide Richtungen."
        steps={[
          'Lies die Tabelle: Was erwartet „Prägung“, was erwartet „Ort“ für jede Gruppe?',
          'Klick die Gruppen an, bei denen sich die beiden Lager widersprechen. Begründe in einem Satz, warum gerade dieser Vergleich den Streit entscheidet.',
          'Gib dann deinen Tipp ab, ohne nachzusehen: Welches Muster zeigen die Daten? Klick eine Karte an und dann auf „Tipp abgeben“.',
        ]}
        done="dein Tipp abgegeben ist. Ob er stimmt, siehst du in Schritt 4." />
      <div className="s09-scroll" tabIndex={0} role="region" aria-label="Was die beiden Lager erwarten">
        <table className="s09-table">
          <thead><tr><th scope="col">Gruppe (dg03)</th><th scope="col">„Prägung“ erwartet</th><th scope="col">„Ort“ erwartet</th></tr></thead>
          <tbody>{GROUP_IDS.map(g => <tr key={g}><th scope="row">{GROUPS[g].short}<small> · {GROUPS[g].label}</small></th><td>{TEMPLATE[g].praegung}</td><td>{TEMPLATE[g].ort}</td></tr>)}</tbody>
        </table>
      </div>
      <p className="task-prompt">Welche Gruppe entscheidet den Streit? Du kannst mehrere anklicken.</p>
      <div className="sandbox-chips" role="group" aria-label="Gruppen, die den Streit entscheiden">
        {GROUP_IDS.map(g => <button key={g} aria-pressed={state.decide.includes(g)}
          onClick={() => set({ decide: state.decide.includes(g) ? state.decide.filter(x => x !== g) : GROUP_IDS.filter(x => x === g || state.decide.includes(x)) })}>{GROUPS[g].short}</button>)}
      </div>
      <Feedback notes={checkDecide(state.decide)} />
      {field('s09-decide', 'Welcher Vergleich entscheidet den Streit – und warum?', 'Ein Satz genügt', state.decideText, decideText => set({ decideText }), 'Entscheidend ist der Vergleich von … mit …, weil genau darüber gestritten wird.')}
      <h4 className="s09-sub">Dein Tipp, bevor du rechnest</h4>
      <p className="task-prompt">Was zeigen die Daten, glaubst du? Klick eine Karte an.</p>
      <PatternCards pick={state.pattern} locked={state.patternLocked} onPick={pattern => set({ pattern })} />
      {!state.patternLocked
        ? <button className="primary" disabled={!state.pattern} onClick={() => set({ patternLocked: true })}>Tipp abgeben</button>
        : <p className="sandbox-note">Tipp abgegeben: {state.pattern && PATTERN_CARDS[state.pattern].title}. Ob er stimmt, siehst du in Schritt 4.{!modelOk && <> <button className="sandbox-link" onClick={() => set({ patternLocked: false })}>Neu tippen</button></>}</p>}
    </section>

    <section className="task-step">
      <h3>2 · Wie viele Umgezogene tragen den Film? (R)</h3>
      <StepGuide
        why="Du weißt jetzt: Nur die Umgezogenen trennen die beiden Lager. Also prüfst du zuerst, wie viele es davon im ALLBUS gibt. Davon hängt ab, wie sicher dein Satz am Ende sein kann."
        steps={[
          <>Lies die Daten ein und such im Codebuch die Variable <code>dg03</code>. Sie verbindet zwei Fragen: Wo bist du aufgewachsen (Jugend), und wo lebst du heute (Interview)? Welcher Code gehört zu welcher Gruppe?</>,
          'Zähl aus, wie viele Befragte in jeder Gruppe sind. Welches Werkzeug zählt, wie oft jeder Code vorkommt?',
          'Trag die beiden Gruppen der Umgezogenen ein.',
        ]}
        done="beide Zahlen grün bestätigt sind." />
      <div className="task-grid">
        <label>Wie viele Befragte sind von Ost nach West gezogen?<small className="task-field-help">Spalte N der Häufigkeitstabelle – die Gruppe „im Osten aufgewachsen, lebt heute im Westen“</small><input type="text" inputMode="numeric" maxLength={12} value={state.movers[0]} onChange={e => set({ movers: [e.target.value, state.movers[1]] })} /></label>
        <label>Wie viele Befragte sind von West nach Ost gezogen?<small className="task-field-help">Spalte N der Häufigkeitstabelle – die Gruppe „im Westen aufgewachsen, lebt heute im Osten“</small><input type="text" inputMode="numeric" maxLength={12} value={state.movers[1]} onChange={e => set({ movers: [state.movers[0], e.target.value] })} /></label>
      </div>
      <Feedback notes={checkMovers(movers, state.movers[0], state.movers[1])} />
      {!moverHit && <HintLadder hint={{ ...hints.movers, solution: rMovers() }} onConcept={onConcept} file="mitgenommen-start.R" />}
    </section>

    <section className="task-step">
      <h3>3 · Dummies bauen: Mit wem vergleicht der Film? (R){tag('A: Ost-Bleibende, B: West-Bleibende')}</h3>
      <StepGuide
        why={<>Du kennst jetzt die vier Gruppen und weißt, wie klein zwei davon sind. Eine Regression rechnet aber mit Zahlen, nicht mit Gruppennamen. Darum zerlegst du <code>dg03</code> in <strong>Dummies</strong>: 0/1-Variablen, eine je Gruppe (1 = gehört dazu, 0 = nicht). Eine Gruppe bleibt draußen. Sie ist die <strong>Referenzgruppe</strong>: Mit ihr vergleicht das Modell alle anderen.</>}
        steps={[
          pair ? 'Wählt eure Referenzgruppe: A die Ost-Bleibenden, B die West-Bleibenden. Begründet sie in einem Satz.' : 'Wähl deine Referenzgruppe und begründe sie in einem Satz. Im Seminar wird sie zugeteilt, allein wählst du frei.',
          <>Pol in R zuerst <code>ps03</code> um, damit höher „zufriedener“ heißt. Leg dann die Dummies für <code>dg03</code> an.</>,
          'Rechne die gewichtete Regression der umgepolten Zufriedenheit auf die Dummies. Welche drei gehören ins Modell, welcher bleibt draußen?',
          <>Trag die Konstante und die drei B aus der Tabelle <em>Coefficients</em> ein.</>,
        ]}
        done="deine Tabelle grün bestätigt ist." />
      <p className="task-prompt">Welche Gruppe ist deine Referenzgruppe?</p>
      <div className="sandbox-chips" role="group" aria-label="Referenzgruppe">
        {GROUP_IDS.map(g => <button key={g} aria-pressed={state.ref === g} onClick={() => onChange(chooseRef(state, g))}>{GROUPS[g].short}</button>)}
      </div>
      {ref && main === null && <p className="sandbox-note" role="note">Mit dieser Referenzgruppe lässt sich das Modell in deiner Datei nicht schätzen – eine Gruppe ist leer.</p>}
      {ref && <>
        {field('s09-ref', 'Warum vergleichst du mit dieser Gruppe?', 'Ein Satz genügt', state.refReason, refReason => set({ refReason }), 'Ich vergleiche mit …, weil …')}
        {tableOpen
          ? <>
            <ModelInputs refGroup={ref} entry={state.model} withConstant onChange={model => set({ model })} label="Modell" prompt="Was steht in deiner Tabelle Coefficients?" />
            <Feedback notes={checkModel(p, models, ref, state.model)} />
            {!modelOk && <HintLadder key={`model-${ref}`} hint={{ ...hints.model, workshop: WORKSHOP, scaffold: scaffoldModel(), solution: `${rSetup()}\n\n${rModel(ref)}` }} onConcept={onConcept} file="mitgenommen-modell.R" />}
          </>
          : <p className="sandbox-note">Gib zuerst in Schritt 1 deinen Tipp ab. Dann öffnen sich hier die Felder für deine Tabelle.</p>}
      </>}
    </section>

    {ref && <section className="task-step">
      <h3>4 · Dein Tipp und deine Zahlen</h3>
      <StepGuide
        why={`Deine Tabelle steht. Jetzt liest du sie: Die Konstante ist die mittlere Zufriedenheit der Referenzgruppe (${GROUPS[ref].short}). Jedes B ist der Abstand einer Gruppe zu ihr. Daraus ergibt sich, wo jede Gruppe liegt – und ob dein Tipp aus Schritt 1 stimmt.`}
        steps={[
          'Vergleich deinen Tipp mit dem Muster deiner Daten. Achte auf die Konfidenzintervalle der beiden kleinen Gruppen.',
          'Rechne die Vorhersage für Ost→West aus deiner Tabelle aus. Die Bauklötze zeigen, wie die Zahl entsteht.',
        ]}
        done="deine Vorhersage grün bestätigt ist." />
      {!modelOk
        ? <p className="sandbox-note">Sobald deine Tabelle in Schritt 3 stimmt, siehst du hier Konfidenzintervalle, die Vorhersagen je Gruppe und deinen Tipp neben deinen Daten.</p>
        : !state.patternLocked || !state.pattern
          ? <p className="sandbox-note">Gib zuerst in Schritt 1 deinen Tipp ab: Welches Muster erwartest du? Dann zeige ich dir hier deine Zahlen neben deinem Tipp.</p>
          : main && <>
            <CoefTable model={main} />
            <PatternCompare pick={state.pattern} model={main} />
            <Feedback notes={comparePattern(state.pattern, main)} />
            <TemplateChart model={main} />
            <h4 className="s09-sub">Die Vorhersage als Baukasten</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ flex: '1 1 220px', maxWidth: 360 }}>
                <div className="task-grid"><label>Welche Zufriedenheit sagt dein Modell für Ost→West vorher?<small className="task-field-help">Aus deiner Tabelle ausrechnen – zwei Nachkommastellen</small><input type="text" inputMode="decimal" maxLength={12} value={state.pred} onChange={e => set({ pred: e.target.value })} /></label></div>
                <Feedback notes={checkPrediction(main, state.model, state.pred)} />
              </div>
              {parts && <PredictionBlocks refGroup={ref} c={parts.c} b={parts.b} predShown={predShown} />}
            </div>
          </>}
    </section>}

    {ref && <section className="task-step">
      <h3>5 · {pair ? 'Der andere Schnittplatz' : 'Zweite Referenzgruppe'} (R)</h3>
      <StepGuide
        why="Dein Modell vergleicht alles mit einer Gruppe. Hängt das Ergebnis davon ab, welche du gewählt hast? Das prüfst du mit einer zweiten Referenzgruppe."
        steps={pair
          ? ['Wählt die Referenzgruppe des anderen Schnittplatzes.', 'Tragt seine Tabelle ein und rechnet die Vorhersage für Ost→West aus. Vergleicht sie mit eurer eigenen.']
          : ['Wähl eine zweite Referenzgruppe.', 'Ändere in R nur die Formel: Welcher Dummy fällt jetzt heraus, welcher kommt dazu?', 'Trag die neue Tabelle ein und rechne wieder die Vorhersage für Ost→West aus. Was bleibt gleich, was ändert sich?']}
        done="beide Tabellen stimmen. Dann erscheint die Tafel mit allen vier Referenzgruppen." />
      <p className="task-prompt">{pair ? 'Welche Referenzgruppe hat der andere Schnittplatz?' : 'Mit welcher Referenzgruppe rechnest du noch einmal?'}</p>
      <div className="sandbox-chips" role="group" aria-label="Zweite Referenzgruppe">
        {others(ref).map(g => <button key={g} aria-pressed={state.second.ref === g} onClick={() => onChange(chooseSecondRef(state, g))}>{GROUPS[g].short}</button>)}
      </div>
      {state.second.ref !== 0 && <>
        <ModelInputs refGroup={state.second.ref} entry={state.second.model} withConstant onChange={model => set({ second: { ...state.second, model } })} label="Zweites Modell" prompt="Was steht in der Tabelle Coefficients mit dieser Referenzgruppe?" />
        <Feedback notes={checkModel(p, models, state.second.ref, state.second.model)} />
        <div className="task-grid"><label>Welche Zufriedenheit sagt dieses Modell für Ost→West vorher?<small className="task-field-help">Aus den Zahlen dieser Tabelle ausrechnen – zwei Nachkommastellen</small><input type="text" inputMode="decimal" maxLength={12} value={state.second.pred} onChange={e => set({ second: { ...state.second, pred: e.target.value } })} /></label></div>
        {secondOk && <Feedback notes={checkPrediction(second, state.second.model, state.second.pred)} />}
        {!secondOk && <HintLadder key={`second-${state.second.ref}`} hint={{ ...hints.model, workshop: WORKSHOP, scaffold: scaffoldModel(), solution: `${rSetup()}\n\n${rModel(state.second.ref)}` }} onConcept={onConcept} file="mitgenommen-modell.R" />}
      </>}
      {modelOk && secondOk && <>
        <h4 className="s09-sub">Tafel der anderen Schnittplätze</h4>
        <BoardTable rows={boardRows} own={[ref, state.second.ref as GroupId]} vif={Object.fromEntries(boardVif.map(x => [x.ref, x.vif?.vif ?? NaN]))} />
        <p className="sandbox-note">Die Koeffizienten hängen an der Referenzgruppe, die Vorhersagen nicht. Ein B ist kein Wert einer Gruppe, sondern ihr Abstand zur Referenzgruppe.</p>
        {worstVif?.vif && worstVif.vif.vif >= 2 && <p className="sandbox-note">Schau in R auch in die Tabelle <em>Collinearity Statistics</em>. Der VIF zeigt, wie stark ein Prädiktor an den anderen hängt (Multikollinearität; über 10 gilt als Problem). Mit der kleinen Referenzgruppe {GROUPS[worstVif.ref].short} steigt er bis {de(worstVif.vif.vif, 1)}: Die Dummies hängen dann aneinander, weil fast niemand in der Referenzgruppe ist. Die Vorhersagen bleiben gleich, aber die B werden unsicherer. <button className="sandbox-link" onClick={() => onConcept('multicollinearity')}>Multikollinearität in der Karte</button></p>}
      </>}
    </section>}

    {ref && <section className="task-step">
      <h3>6 · Wer zieht um? Selektion und Kontrollen (R){tag('A')}</h3>
      <StepGuide
        why="Du weißt jetzt, wo die Umgezogenen liegen – egal, mit welcher Gruppe du vergleichst. Aber zieht jeder gleich oft um? Unterscheiden sich die Umgezogenen schon vorher, steckt dieser Unterschied mit im Abstand. Also prüfst du, wer umzieht, und nimmst passende Kontrollvariablen ins Modell."
        steps={[
          <>Bilde aus <code>educ</code> eine 0/1-Variable für das Abitur: 1 = Fachhochschulreife oder Abitur, 0 = ein niedrigerer Abschluss. Die Codes stehen im Codebuch.</>,
          'Prüf mit einer gewichteten Kreuztabelle, wie viel Prozent jeder Gruppe Abitur haben. Welche Prozentbasis brauchst du: die ganze Zeile oder die ganze Spalte?',
          'Sortier die Kontrollkarten: Stand die Variable schon fest, bevor jemand umzog – oder kann sie eine Folge des Umzugs sein?',
          <>Kreuz deine Kontrollen an und nimm sie ins Modell auf. Für das Geschlecht brauchst du wieder eine 0/1-Variable (1 = Frau, aus <code>sex</code>). Trag die drei B der Gruppen ein.</>,
        ]}
        done="Abitur-Anteil und Modell mit Kontrollen grün bestätigt sind." />
      <div className="task-grid"><label>Wie viel Prozent der West→Ost-Umgezogenen haben Abitur?<small className="task-field-help">Aus deiner Kreuztabelle: Zeile W.JUGEND-O.INT. (dg03 = 3) – mit einer Nachkommastelle</small><input type="text" inputMode="decimal" maxLength={12} value={state.abi} onChange={e => set({ abi: e.target.value })} /></label></div>
      <Feedback notes={checkSelection(sel, state.abi)} />
      <p className="task-prompt">Stand die Variable schon fest, bevor jemand umzog – oder kann sie eine Folge des Umzugs sein? Ordne jede Karte ein.</p>
      <ul className="s09-cards">{CONTROLS.map(c => <li key={c.id}>
        <span className="s09-card-title">{c.title}</span>
        <span className="sandbox-chips" role="group" aria-label={`${c.title} einordnen`}>
          {SORTS.map(s => <button key={s} aria-pressed={state.sort[c.id] === s} onClick={() => set({ sort: { ...state.sort, [c.id]: s } })}>{SORT_LABEL[s]}</button>)}
        </span>
        <Feedback notes={sortNote(c.id, state.sort[c.id])} />
      </li>)}</ul>
      <fieldset className="s09-controls">
        <legend>Welche Variablen nimmst du als Kontrollen ins Modell? Kreuz sie an.</legend>
        {CONTROLS.map(c => <label key={c.id} className="s04-check"><input type="checkbox" checked={state.controls.includes(c.id)} onChange={() => onChange(toggleControl(state, c.id as ControlId))} /> {c.title}</label>)}
      </fieldset>
      {state.controls.length > 0 && <>
        <ModelInputs refGroup={ref} entry={state.cmodel} withConstant={false} onChange={cmodel => set({ cmodel })} label="Modell mit Kontrollen" prompt="Wie groß sind die B der Gruppen im Modell mit deinen Kontrollen?" />
        <Feedback notes={checkControlled(models, ref, state.controls, state.cmodel)} />
      </>}
      {!(selOk && controlledOk) && <HintLadder key={`controls-${ref}`} hint={{ ...hints.controls, workshop: WORKSHOP, scaffold: scaffoldControls(ref), solution: `${rSetup()}\n\n${rControls(ref, state.controls)}` }} onConcept={onConcept} file="mitgenommen-kontrollen.R" />}
      {modelOk && effect && <div className="s09-scroll" tabIndex={0} role="region" aria-label="Abstände ohne und mit Kontrollen">
        <table className="s09-table">
          <caption>Abstand zur Referenzgruppe {GROUPS[ref].short}: ohne und mit Kontrollen</caption>
          <thead><tr><th scope="col">Gruppe</th><th scope="col">ohne</th><th scope="col">mit</th></tr></thead>
          <tbody>{effect.map(x => <tr key={x.g}><th scope="row">{GROUPS[x.g].short}</th><td>{de(x.without, 3)}</td><td>{de(x.with, 3)}</td></tr>)}</tbody>
        </table>
        {effect.some(x => Math.abs(x.with) > Math.abs(x.without) + 0.05) && <p className="sandbox-note">Eine Kontrolle kann einen Abstand auch vergrößern: {effect.filter(x => Math.abs(x.with) > Math.abs(x.without) + 0.05).map(x => `${GROUPS[x.g].short} ${de(x.without, 2)} → ${de(x.with, 2)}`).join(', ')}.</p>}
      </div>}
    </section>}

    {ref && <section className="task-step">
      <h3>7 · Gegenprobe mit dem Vertrauen in den Bundestag (R){pair ? ' · B' : ' · allein optional'}</h3>
      <StepGuide
        why={<>Deine Abstände stehen, mit und ohne Kontrollen. Zeigt eine verwandte Frage dasselbe Muster? Dann steht dein Satz auf festerem Boden. Also rechnest du dasselbe Modell mit dem Vertrauen in den Bundestag (<code>pt03</code>: 1 = gar kein Vertrauen, 7 = großes Vertrauen).</>}
        steps={[
          `Nimm dieselben drei Dummies wie in Schritt 3 (Referenzgruppe ${GROUPS[ref].short}). Was muss sich in der Formel ändern?`,
          'Trag die drei B ein und vergleich sie mit deinen Abständen bei der Zufriedenheit.',
        ]}
        done="die Gegenprobe grün bestätigt ist." />
      <ModelInputs refGroup={ref} entry={state.counter} withConstant={false} onChange={counter => set({ counter })} label="Gegenprobe" prompt="Wie groß sind die B der Gruppen, wenn das Vertrauen die abhängige Variable ist?" />
      <Feedback notes={checkCounter(models, ref, state.counter)} />
      {!counterOk && <HintLadder key={`counter-${ref}`} hint={{ ...hints.counter, workshop: WORKSHOP, scaffold: scaffoldCounter(), solution: `${rSetup()}\n\n${rModel(ref, 'pt03')}` }} onConcept={onConcept} file="mitgenommen-gegenprobe.R" />}
      {modelOk && counterOk && main && counter && <p className="sandbox-note">Abstand zur Referenzgruppe {GROUPS[ref].short} – Zufriedenheit / Vertrauen: {others(ref).map(g => `${GROUPS[g].short} ${de(main.b[g], 2)} / ${de(counter.b[g], 2)}`).join(', ')}.</p>}
    </section>}

    <section className="task-step">
      <details className="s09-extra">
        <summary>8 · Profi: dieselbe Frage als Interaktion (R)</summary>
        <StepGuide
          why="Bisher hast du vier Gruppen verglichen. Dieselbe Frage lässt sich auch mit zwei 0/1-Variablen stellen: im Osten aufgewachsen und im Osten wohnend. Eine Interaktion zeigt, ob beide zusammen anders wirken als die Summe der einzelnen."
          steps={[
            <>Bilde zwei 0/1-Variablen: <code>ost</code> (1 = wohnt heute im Osten, aus <code>eastwest</code>) und <code>ostjugend</code> (1 = im Osten aufgewachsen, aus <code>dg03</code>).</>,
            'Rechne die gewichtete Regression der umgepolten Zufriedenheit auf beide – mit ihrer Interaktion.',
            'Trag den Koeffizienten der Interaktion ein.',
          ]}
          done="der Wert grün bestätigt ist." />
        <div className="task-grid"><label>Wie groß ist der Interaktionseffekt?<small className="task-field-help">Zeile ost:ostjugend, Spalte B – drei Nachkommastellen</small><input type="text" inputMode="decimal" maxLength={12} value={state.inter} onChange={e => set({ inter: e.target.value })} /></label></div>
        <Feedback notes={checkInteraction(it, core(models, 4)?.fit.r2 ?? NaN, state.inter)} />
        {!interactionRecognised(it, state.inter) && <HintLadder hint={{ ...hints.interaction, workshop: WORKSHOP, scaffold: scaffoldInteraction(), solution: `${rSetup()}\n\n${rInteraction()}` }} onConcept={onConcept} file="mitgenommen-interaktion.R" />}
      </details>
    </section>

    <section className="task-step">
      <h3>9 · Der Off-Text{pair ? ' · gemeinsam' : ''}</h3>
      <StepGuide
        why="Du hast jetzt alles beisammen: das Muster, wie viele Befragte es tragen, wer umzieht und was Kontrollen ändern. Bevor du den Satz schreibst, prüft der Wackeltest, wie stark deine Abstände an einzelnen Befragten hängen."
        steps={[
          'Lies den Wackeltest: Wie weit bewegen sich die Abstände ohne die fünf Befragten, die am stärksten ziehen?',
          `Schreib den Satz der Sprecherin: höchstens ${MAX_WORDS} Wörter, nur so viel, wie die Daten tragen.`,
          'Lies die Gegenfragen darunter. Überarbeite deinen Satz, bis du jede beantworten kannst.',
        ]}
        done="dein Satz steht und du jede Gegenfrage beantworten kannst." />
      {wob && main
        ? <>
          <h4 className="s09-sub">Wackeltest</h4>
          <p>Wie stark hängen deine Abstände an einzelnen Befragten? Ich schätze jedes Modell neu: einmal ohne die fünf Befragten, die den Abstand am stärksten nach oben ziehen, einmal ohne die fünf, die ihn nach unten ziehen. <button className="sandbox-link" onClick={() => onConcept('outliers_influence')}>Ausreißer &amp; Einfluss in der Karte</button></p>
          <WobbleList rows={wob} model={main} />
        </>
        : <p className="sandbox-note">Der Wackeltest erscheint, sobald deine Tabelle in Schritt 3 stimmt.</p>}
      <TextAnswer id="s09-off" maxLength={400} size="long" label="Welchen Satz sagt die Sprecherin am Ende des Films?"
        help={`Höchstens ${MAX_WORDS} Wörter, verständlich fürs Fernsehpublikum – bisher ${wordCount(state.offText)} Wörter`}
        example="Wer …, hat im Schnitt … als …, auch wenn …" value={state.offText} onChange={offText => set({ offText })} />
      <Feedback notes={offQuestions(state.offText, {
        selection: selOk ? sel : null,
        movers: moverHit ? movers.find(v => v.key === 'model')! : null,
        wobble: wob,
        consequences,
        effectWithout: without ? MOVERS.filter(g => g !== ref).map(g => ({ g, value: without.b[g] })) : null,
      })} />
      <p className="s02-takeaway"><strong>Das Wichtigste aus dieser Sitzung:</strong> Das B eines Dummys ist der Abstand zur Referenzgruppe, kein eigener Gruppenwert – die Vorhersagen bleiben bei jeder Referenzgruppe gleich. Kontrollieren darfst du nur, was vor der Ursache feststand. Und wenige Befragte tragen nur einen vorsichtigen Satz.</p>
    </section>

    <PlenumCard title="Schnittplan-Karte · Mitgenommen" lines={plenumLines(state, models)} file="mitgenommen-schnittplan.md" />
    {ref && statusS09(state) === 'done' && <details className="s02-solution"><summary>Ein vollständiges R-Skript zum Mitnehmen</summary><RBlock code={rSolution(ref, state.controls.length ? state.controls : undefined)} file="mitgenommen.R" /></details>}
  </div>;
}

/** Eingabefelder für eine Koeffiziententabelle: Konstante (optional) und B je Gruppe, die Referenzgruppe bleibt leer. */
function ModelInputs({ refGroup, entry, withConstant, onChange, label, prompt }: { refGroup: GroupId; entry: ModelEntry; withConstant: boolean; onChange: (e: ModelEntry) => void; label: string; prompt: string }) {
  const setB = (g: GroupId, v: string) => onChange({ ...entry, b: entry.b.map((x, i) => (i === g - 1 ? v : x)) as ModelEntry['b'] });
  return <>
    <p className="task-prompt">{prompt}</p>
    <div className="task-grid" role="group" aria-label={label}>
      {withConstant && <label>Wie groß ist die Konstante?<small className="task-field-help">Zeile (Intercept), Spalte B – drei Nachkommastellen</small><input type="text" inputMode="decimal" maxLength={12} value={entry.c} onChange={e => onChange({ ...entry, c: e.target.value })} /></label>}
      {GROUP_IDS.map(g => g === refGroup
        ? <label key={g}>B für {GROUPS[g].short}<small className="task-field-help">Deine Referenzgruppe – ihr Dummy steht nicht im Modell</small><input type="text" value="Referenz" readOnly aria-readonly="true" tabIndex={-1} /></label>
        : <label key={g}>Wie groß ist B für {GROUPS[g].short}?<small className="task-field-help">Zeile {GROUPS[g].dummy}, Spalte B – drei Nachkommastellen</small><input type="text" inputMode="decimal" maxLength={12} value={entry.b[g - 1]} onChange={e => setB(g, e.target.value)} /></label>)}
    </div>
  </>;
}
