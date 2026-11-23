import { useMemo } from 'react';
import { Feedback } from '../kit/Feedback';
import { HintLadder } from '../kit/HintLadder';
import { linkinv, logitOf } from '../kit/logit';
import { de } from '../kit/numbers';
import { PartnerToggle } from '../kit/PartnerToggle';
import { PlenumCard } from '../kit/PlenumCard';
import { RBlock } from '../kit/RBlock';
import { RoleBrief } from '../kit/RoleBrief';
import { StepGuide } from '../kit/StepGuide';
import { Toolbox } from '../kit/Toolbox';
import type { TaskProps } from '../types';
import { CAMPAIGN, CAMPAIGN_ANSWERS, DETOURS, hints, PERSONS, QUESTIONS, R_SOLUTION, TOOLBOX_SCRIPT, UNITS, WORKSHOP, type CampaignAnswer, type Unit } from './content';
import {
  answerNotes, CELLS, cellsOk, chainOk, checkAme, compareJana, janaOutOf100, janaRevealed, checkCells, checkChain, checkLikelihood, checkModel, checkReport, known,
  likelihoodOk, likelihoodReveal, NUMBER_MAX, odds3, plenumLines, prepare, sentenceNotes, statusS10, tafel, tafelNotes, tafelReady, type Cell, type Cells, type S10State,
} from './domain';
import { HundredPeople, MODEL, TIP } from './Hundred';
import { KurveSelbst } from './KurveSelbst';
import { JanaCurve, SCurve } from './SCurve';
import { Tafel } from './Tafel';
import { TextAnswer } from '../kit/TextAnswer';

const listJoin = (xs: string[]) => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} und ${xs[xs.length - 1]}` : xs[0] ?? '');
const numberInput = (label: string, help: string, value: string, onChange: (v: string) => void, key?: string) =>
  <label key={key}>{label}<small className="task-field-help">{help}</small><input type="text" inputMode="decimal" maxLength={NUMBER_MAX} value={value} onChange={e => onChange(e.target.value)} /></label>;

/** Fragen und Fundorte für Station 4 – je Sprache und Zelle (die Rückmeldung nutzt weiter die kurzen CELL_LABELS). */
const CELL_FIELDS: Record<'odds' | 'prob', Record<Cell, [string, string]>> = {
  odds: {
    janaUp: ['Welche Chance hat Jana mit einer Stufe mehr Pflichtgefühl?', 'Ausgangspunkt: Janas Chance aus Station 2'],
    wiegand: ['Welche Chance hat Herr Wiegand?', 'Wie bei Jana, mit seinen umgepolten Codes'],
    wiegandUp: ['Welche Chance hat Herr Wiegand mit einer Stufe mehr Pflichtgefühl?', 'Ausgangspunkt: seine Chance aus dem Feld davor'],
  },
  prob: {
    janaUp: ['Wie wahrscheinlich würde Jana mit einer Stufe mehr Pflichtgefühl wählen?', 'Aus predict() – als Anteil oder in Prozent'],
    wiegand: ['Wie wahrscheinlich würde Herr Wiegand wählen?', 'Aus predict() – als Anteil oder in Prozent'],
    wiegandUp: ['Wie wahrscheinlich würde Herr Wiegand mit einer Stufe mehr Pflichtgefühl wählen?', 'Aus predict() – als Anteil oder in Prozent'],
  },
};

export function Buergerrat({ data, state, onChange, onConcept }: TaskProps<S10State>) {
  const p = useMemo(() => prepare(data.sav), [data.sav]);
  const set = (patch: Partial<S10State>) => onChange({ ...state, ...patch });
  const pair = state.mode === 'pair';
  const k = known(p, state);
  const janaDone = chainOk(p, state.jana);
  // Sobald „Dein Tipp / Laut Modell“ sichtbar ist, verschwindet das gesperrte Figurenfeld oben – und mit ihm „Neu tippen“.
  const revealed = janaRevealed(p, state);
  // Wer schon gerechnet hat (gespeicherter Stand von vorher), behält seine Felder auch ohne Tipp.
  const janaStarted = [state.jana.logit, state.jana.odds, state.jana.prob].some(x => x.trim() !== '');
  const oddsDone = cellsOk(p, state.odds, 'odds'), probDone = cellsOk(p, state.prob, 'prob');
  const ready = tafelReady(p, state);
  const rows = ready ? tafel(p) : [];
  const setCells = (lang: 'odds' | 'prob', cell: keyof Cells, v: string) => set({ [lang]: { ...state[lang], [cell]: v } } as Partial<S10State>);
  const missing = [!janaDone && 'Janas drei Zahlen (Station 2)', !oddsDone && 'die drei Chancen', !probDone && 'die drei Wahrscheinlichkeiten',
    !(state.campaign && state.answer3.trim()) && 'deine Antwort auf Frage 3'].filter(Boolean) as string[];
  const llDone = likelihoodOk(p, state.likelihood);
  const setLl = (patch: Partial<S10State['likelihood']>) => set({ likelihood: { ...state.likelihood, ...patch } });
  const setReport = (patch: Partial<S10State['report']>) => set({ report: { ...state.report, ...patch } });
  const quote = (q: string) => <figure className="sandbox-quote"><blockquote>{q}</blockquote></figure>;

  return <div className="task s10">
    <RoleBrief role="Statistik-Dolmetscher:in" title="Dolmetschen für den Bürgerrat">
      <p>Du arbeitest als Statistik-Dolmetscher:in. Ein Bürgerrat berät, wie mehr Menschen wählen gehen. Seine Mitglieder wurden per Los bestimmt.</p>
      <p>Gestern hat ein Sachverständiger dem Rat ein Modell aus dem ALLBUS 2023 vorgestellt. Es erklärt, ob jemand wählen gehen will. Dafür nutzt es zwei Fragen: Wie sehr stimmt jemand zu, dass Wählen Bürgerpflicht ist (<code>pe09</code>)? Und wie stark interessiert er sich für Politik (<code>pa02a</code>)? Auf seiner Folie stand nur:</p>
      {quote('„Pflichtgefühl: Exp(B) = 3,77 ***“')}
      <p>Dann musste er zum Zug. Der Rat plant eine Kampagne {CAMPAIGN}. Die Moderatorin hat vier Fragen gesammelt:</p>
      <ol className="s10-questions">{QUESTIONS.map(q => <li key={q}>{q}</li>)}</ol>
      <p>Du hast die Datei des Sachverständigen nicht, aber denselben ALLBUS. Also rechnest du nach, bevor du übersetzt. Eine Musterantwort gibt es nicht – falsche Zahlen schon.</p>
      <p>Der rote Faden: <strong>Was heißt „Exp(B) = 3,77“ – für Jana, für Herrn Wiegand und für den Bericht?</strong></p>
      <p><strong>Was du dabei lernst:</strong> ein logistisches Modell in R schätzen, seine Zahlen zwischen Logit, Chance und Wahrscheinlichkeit übersetzen und entscheiden, welche Zahl Laien richtig verstehen.</p>
      <p className="sandbox-note">Gut zu wissen: Die Frage nach der Bürgerpflicht bekam nur eine Hälfte der Befragten (Split). Darum steckt im Modell gut die Hälfte der Befragten. Es geht um die geäußerte Absicht, nicht um tatsächliches Wählen.</p>
    </RoleBrief>
    <p className="task-prompt">Zwei Ratsmitglieder melden sich zu Wort:</p>
    <div className="s10-council">{Object.values(PERSONS).map(m => <article key={m.id} className="task-card">
      <h4>{m.name}, {m.age}</h4><p>{m.quote}</p>
    </article>)}</div>
    <PartnerToggle mode={state.mode} onChange={mode => set({ mode })}
      solo="Du übersetzt allein in beide Sprachen: erst in Chancen (von Hand, R rechnet wie ein Taschenrechner), dann in Wahrscheinlichkeiten (mit predict() und marginal_effects()). Am Ende schreibst du einen Satz, der beide Sprachen verbindet."
      pair="A übersetzt in Chancen: Jana von Hand, dann eine Stufe mehr mit × Exp(B). B übersetzt in Wahrscheinlichkeiten: mit predict() und marginal_effects(). A wird vermutlich „gleich“ sagen, B „bei Jana“. Einigt euch auf einen Satz für den Rat. Die Dolmetscher-Tafel erscheint erst, wenn beide Zahlenreihen auf einem Bildschirm stehen." />

    <Toolbox file="buergerrat-werkzeuge.R" code={TOOLBOX_SCRIPT} tools={[
      { fn: 'library(), read_spss(), codebook()', text: <>kennst du: Pakete laden, Daten einlesen, im Codebuch nachsehen.</> },
      { fn: '%>%', text: <>kennst du aus Sitzung 4: die Pipe, lies sie als „und dann“. Der Datensatz steht vorn: <code>allbus %&gt;% logistic_regression(…)</code>. Auch ein gespeichertes Modell lässt sich weiterreichen: <code>beispiel %&gt;% marginal_effects() %&gt;% summary()</code> heißt „nimm das Modell, berechne daraus die AME und zeig sie dann als Tabelle“.</> },
      { fn: 'mutate(), rec()', text: <>kennst du aus Sitzung 5: neue Variablen bilden, Codes zusammenfassen und mit <code>rules = "rev"</code> eine Skala umpolen. Links vom <code>=</code> steht der neue Name, mehrere stehen in einem <code>mutate()</code>.</> },
      { fn: '+ - * / ( )', text: <>kennst du aus Sitzung 3: R als Taschenrechner. Mit <code>&lt;-</code> speicherst du ein Ergebnis unter einem Namen.</> },
      { fn: 'summary()', text: <>kennst du aus Sitzung 7 bis 10: zeigt die ausführliche Ausgabe, etwa eines Modells.</> },
      { fn: 'logistic_regression()', isNew: true, text: <>schätzt ein Modell für eine Variable mit 1 und 0. Aufgebaut wie <code>linear_regression()</code>: abhängige Variable <code>~</code> Prädiktor <code>+</code> Prädiktor, mit <code>weights = wghtpew</code> gewichtet (Sitzung 6). <code>summary()</code> zeigt unter anderem die Tabellen <em>Variables in the Equation</em> (Spalten B und Exp(B)), <em>Model Summary</em> (−2 Log Likelihood), <em>Omnibus Tests</em> (Chi-square) und die <em>Classification Table</em> (Trefferquote).</> },
      { fn: 'exp()', isNew: true, text: <>rechnet „e hoch eine Zahl“. Aus einem Logit wird so eine Chance, aus B wird Exp(B).</> },
      { fn: 'tibble() + c()', isNew: true, text: <><code>tibble()</code> baut eine kleine Tabelle von Hand, zum Beispiel erfundene Befragte, für die das Modell etwas vorhersagen soll. <code>c()</code> zählt die Werte einer Variable auf, einen je Befragte: <code>c(30, 70)</code> sind zwei Befragte.</> },
      { fn: 'predict()', isNew: true, text: <>sagt für die Befragten einer Tabelle (<code>newdata</code>) vorher, wie wahrscheinlich bei ihnen eine 1 ist – mit <code>type = "response"</code>. Ohne dieses Argument bekommst du Logits.</> },
      { fn: 'marginal_effects()', isNew: true, text: <>berechnet für jeden Prädiktor den durchschnittlichen marginalen Effekt (AME). <code>summary()</code> zeigt ihn in der Spalte <em>AME</em>.</> },
    ]} />

    <section className="task-card" aria-label="Drei Sprachen für eine Zahl">
      <span className="learning-eyebrow">DREI SPRACHEN FÜR EINE ZAHL</span>
      <p>Ein logistisches Modell erklärt eine Variable mit zwei Ausprägungen: 1 = würde wählen, 0 = würde nicht wählen. Was es sagt, kannst du in drei Sprachen ausdrücken:</p>
      <ul>
        <li><strong>Wahrscheinlichkeit:</strong> Von 100 Menschen, die so antworten wie Jana, gehen so viele wählen. Sie liegt zwischen 0 und 1 (0 bis 100 %).</li>
        <li><strong>Chance</strong> (englisch Odds): Wie viele wählen auf eine Person, die nicht wählt? Chance = Wahrscheinlichkeit / (1 − Wahrscheinlichkeit). Eine Chance von 3 heißt „3 zu 1“, also 75 %. Sie liegt zwischen 0 und unendlich.</li>
        <li><strong>Logit:</strong> der Logarithmus der Chance. In dieser Sprache rechnet das Modell: Logit = Konstante + B × Wert, für jeden Prädiktor. <code>exp()</code> macht aus dem Logit die Chance, und Wahrscheinlichkeit = Chance / (1 + Chance).</li>
      </ul>
      <p>Zwei Zahlen fassen einen Prädiktor zusammen. <strong>Exp(B)</strong> (Chancenverhältnis, englisch Odds Ratio) ist ein Faktor: Eine Stufe mehr, und die Chance wird mit Exp(B) malgenommen. Der <strong>AME</strong> (durchschnittlicher marginaler Effekt) sagt, um wie viele Prozentpunkte die Wahrscheinlichkeit je Stufe steigt – im Mittel über alle Befragten.</p>
    </section>

    <section className="task-step">
      <h3>Einstieg · Die S-Kurve selbst einstellen</h3>
      <StepGuide
        why={<>Bevor du rechnest: Ein logistisches Modell rechnet mit einer Geraden in Logits. Wie wird daraus eine Wahrscheinlichkeit? Das probierst du an einem neutralen Beispiel aus dem ALLBUS aus: Wer geht mit dem Smartphone ins Internet – je nach Alter? Du stellst die Konstante und B selbst ein. Jana (24) und Herr Wiegand (67) stehen mit ihrem Alter auf deiner Kurve, und beide werden zehn Jahre älter.</>}
        steps={[
          'Zieh links die beiden Griffe. Was verändert die Konstante, was verändert B – an der Geraden und an der S-Kurve rechts?',
          'Überleg, bevor du Daten siehst: Wie viele Jüngere gehen mit dem Smartphone ins Internet, wie viele Ältere? Stell deine Kurve so ein.',
          'Zeig die ALLBUS-Anteile. Wo liegt deine Kurve daneben? Pass sie an und vergleich sie dann mit der Kurve aus R.',
          'Schau auf Jana und Herrn Wiegand: Was ändern zehn Jahre bei ihnen im Logit, in der Chance und in der Wahrscheinlichkeit? Was ist bei beiden gleich, was nicht – und woran liegt das?',
        ]}
        done="du in eigenen Worten sagen kannst, was ein Schritt von zehn Jahren in Logit, Chance und Wahrscheinlichkeit ändert – bei Jana und bei Herrn Wiegand." />
      <KurveSelbst sav={data.sav} />
    </section>

    <section className="task-step">
      <h3>Station 1 · Das Modell nachbauen</h3>
      <StepGuide
        why="Du hast gesehen, wie Konstante und B eine S-Kurve formen. Jetzt geht es um das echte Modell: Bevor du eine Zahl übersetzt, prüfst du, ob sie stimmt. Darum baust du das Modell des Sachverständigen mit deinem ALLBUS nach."
        steps={[
          <>Mach aus der Wahlabsicht <code>pv01</code> eine Variable mit 1 = würde wählen und 0 = würde nicht wählen. Schau im Codebuch nach: Welche Codes gehören wozu? Und was passiert mit „weiß nicht“ und „nicht wahlberechtigt“?</>,
          <>Schau auch nach, in welche Richtung <code>pe09</code> und <code>pa02a</code> laufen. Im Modell soll ein höherer Code mehr Pflichtgefühl und mehr Interesse heißen. Musst du umpolen?</>,
          'Schätz das Modell mit beiden Prädiktoren, gewichtet für Deutschland. Welches Werkzeug passt?',
          'Lies in der Ausgabe beide Exp(B) ab und trag sie ein.',
        ]}
        done="beide Exp(B) grün bestätigt sind." />
      <p className="sandbox-note">Meldet R „Nicht-ganzzahlige #Erfolge in einem binomial-GLM“? Das ist harmlos: Die Gewichte sind keine ganzen Zahlen. Die Schätzung stimmt trotzdem.</p>
      {p.problem ? <p className="sandbox-error" role="alert">Mit dieser Datei lässt sich das Modell nicht schätzen: {p.problem}</p> : <>
        <div className="task-grid">
          {numberInput('Wie groß ist Exp(B) für das Pflichtgefühl?', 'Aus summary(): Tabelle Variables in the Equation, Spalte Exp(B)', state.or.pflicht, v => set({ or: { ...state.or, pflicht: v } }))}
          {numberInput('Wie groß ist Exp(B) für das politische Interesse?', 'Dieselbe Tabelle, Zeile des Interesses', state.or.interesse, v => set({ or: { ...state.or, interesse: v } }))}
        </div>
        <Feedback notes={checkModel(p, state.or)} />
      </>}
      <HintLadder hint={{ ...hints.model, workshop: WORKSHOP }} onConcept={onConcept} file="buergerrat-modell.R" />
    </section>

    {!p.problem && <>
      <section className="task-step">
        <h3>Station 2 · {pair ? 'A: ' : ''}Jana von Hand übersetzen</h3>
        <StepGuide
          why={<>Du hast das Modell nachgebaut. Aber was heißt die Zahl für einzelne Menschen? Jana fragt: „Was heißt das für jemanden wie mich?“ Das Modell rechnet in Logits. Du übersetzt Schritt für Schritt in Chance und Wahrscheinlichkeit – vorher schätzt du.</>}
          steps={[
            'Schätz zuerst, ohne zu rechnen: Wie viele von 100 Menschen, die so antworten wie Jana, gehen wählen? Klick auf die Figuren und gib deinen Tipp ab.',
            'Übertrag Janas Antworten auf die umgepolten Skalen: Welcher Code wird aus „stimme eher nicht zu“, welcher aus „wenig“?',
            'Rechne Janas Logit aus der Konstanten und den B-Werten (Spalte B). Welches Werkzeug macht daraus die Chance?',
            'Mach aus der Chance die Wahrscheinlichkeit (siehe „Drei Sprachen für eine Zahl“).',
          ]}
          done="alle drei Zahlen grün sind und dein Tipp neben dem Modell steht." />
        {!revealed && <>
          <p className="task-prompt">Stell dir 100 Menschen wie Jana vor. Wie viele gehen wählen? Klick auf eine Figur – bis dorthin füllen sie sich.</p>
          <HundredPeople value={state.janaGuess} onPick={state.janaGuessLocked ? undefined : n => set({ janaGuess: n })}
            label={state.janaGuess === null ? '100 Menschen wie Jana, noch kein Tipp' : `Dein Tipp: ${state.janaGuess} von 100 Menschen wie Jana gehen wählen`} />
          <p role="status" style={{ margin: '4px 0 8px', fontSize: 'var(--fs-body)' }}>{state.janaGuess === null ? 'Noch kein Tipp.' : <>Dein Tipp: <strong style={{ color: TIP }}>{state.janaGuess} von 100</strong> gehen wählen.</>}</p>
          {!state.janaGuessLocked
            ? <button className="primary" disabled={state.janaGuess === null} onClick={() => set({ janaGuessLocked: true })}>Tipp abgeben</button>
            : <p className="sandbox-note">Tipp abgegeben. Jetzt rechnest du nach. <button className="sandbox-link" onClick={() => set({ janaGuessLocked: false })}>Neu tippen</button></p>}
        </>}
        {!(state.janaGuessLocked || janaStarted) ? <p className="sandbox-note">Gib zuerst deinen Tipp ab – dann rechnest du Janas Zahlen nach.</p> : <>
          <div className="task-grid">
            {numberInput('Wie groß ist Janas Logit?', 'Konstante und B aus Spalte B in summary() – mit drei Nachkommastellen rechnen', state.jana.logit, v => set({ jana: { ...state.jana, logit: v } }))}
            {numberInput('Wie groß ist Janas Chance zu wählen?', 'Ein Verhältnis wählen : nicht wählen – 2,5 hieße „2,5 zu 1“', state.jana.odds, v => set({ jana: { ...state.jana, odds: v } }))}
            {numberInput('Mit welcher Wahrscheinlichkeit würde Jana wählen?', 'Als Anteil (z. B. 0,65) oder in Prozent (65 %)', state.jana.prob, v => set({ jana: { ...state.jana, prob: v } }))}
          </div>
          <Feedback notes={checkChain(p, state.jana)} />
        </>}
        {janaDone && p.main && (() => {
          const l = logitOf(p.main, p.profiles.jana);
          return <p className="s10-reveal">Übersetzt: Janas Chance steht {odds3(Math.exp(l))} zu 1. Von 100 Menschen, die so antworten wie Jana, würden etwa {de(100 * linkinv(l), 0)} wählen gehen.</p>;
        })()}
        {revealed && state.janaGuess !== null && p.main && <div className="s10-reveal-block">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            <figure className="task-card" style={{ margin: 0 }}>
              <figcaption style={{ font: '600 var(--fs-ui)/1.4 var(--sans)', color: TIP }}>Dein Tipp: {state.janaGuess} von 100</figcaption>
              <HundredPeople value={state.janaGuess} label={`Dein Tipp: ${state.janaGuess} von 100 gehen wählen`} />
            </figure>
            <figure className="task-card" style={{ margin: 0 }}>
              <figcaption style={{ font: '600 var(--fs-ui)/1.4 var(--sans)', color: MODEL }}>Laut Modell: {janaOutOf100(p)} von 100</figcaption>
              <HundredPeople value={janaOutOf100(p)} color={MODEL} label={`Laut Modell: ${janaOutOf100(p)} von 100 gehen wählen`} />
            </figure>
          </div>
          <Feedback notes={compareJana(p, state.janaGuess)} />
          <JanaCurve fit={p.main} profile={p.profiles.jana} range={p.pflichtRange} guess={state.janaGuess} />
        </div>}
        <HintLadder hint={{ ...hints.jana, workshop: WORKSHOP }} onConcept={onConcept} file="buergerrat-jana.R" />
      </section>

      <section className="task-step">
        <h3>Station 3 · Frage 1 der Moderatorin</h3>
        <StepGuide
          why="Du kennst jetzt Janas Wahrscheinlichkeit und Exp(B). Damit kannst du die erste Frage der Moderatorin prüfen."
          steps={[
            'Mach die Probe an Jana: Nimm ihre Wahrscheinlichkeit mal Exp(B). Was kommt heraus – geht das?',
            'Überleg: Was vervielfacht Exp(B) dann – die Chance oder die Wahrscheinlichkeit?',
            'Antworte der Moderatorin in ein bis zwei Sätzen, sodass sie es ohne Statistik versteht.',
          ]}
          done="deine Antwort steht." />
        {quote(QUESTIONS[0])}
        <TextAnswer id="s10-answer1" maxLength={800} size="long" label="Was antwortest du der Moderatorin auf Frage 1?"
          help="Ein bis zwei Sätze ohne Statistik-Wörter. Die Probe an Jana darf als Beispiel vorkommen."
          example="Auf Frage 1 antworte ich: …, denn … An Jana sieht man das so: …" value={state.answer1} onChange={answer1 => set({ answer1 })} />
        <Feedback notes={answerNotes(state.answer1, k)} />
      </section>

      <section className="task-step">
        <h3>Station 4 · Eine Stufe mehr – für beide</h3>
        <StepGuide
          why={<>Frage 1 ist geklärt: Exp(B) vervielfacht die Chance, nicht die Wahrscheinlichkeit. Die Kampagne soll das Pflichtgefühl um eine Stufe heben. Was bringt das Menschen wie Jana, was Menschen wie Herrn Wiegand? Damit beantwortest du Frage 2 – und danach Frage 3.</>}
          steps={[
            'In Chancen brauchst du kein Modell mehr: Eine Stufe mehr heißt Chance × Exp(B). Für Herrn Wiegand rechnest du zuerst seine Chance – wie bei Jana, mit seinen umgepolten Codes.',
            'Für Wahrscheinlichkeiten lässt du R vorhersagen. Bau dir dafür erfundene Befragte: Jana und Herrn Wiegand, jeweils so, wie sie sind, und mit einer Stufe mehr Pflichtgefühl. Welche Werkzeuge passen?',
            'Vergleich: Bei wem wächst die Chance stärker, bei wem die Wahrscheinlichkeit? Beantworte dann Frage 3 und begründe deine Antwort.',
          ]}
          done="die Dolmetscher-Tafel erscheint und dein Satz für den Rat steht." />
        {quote(QUESTIONS[1])}
        <div className="s10-langs">
          <div className="task-card">
            <h4>{pair ? 'A · in Chancen' : 'Sprache 1 · Chancen'}</h4>
            <p className="sandbox-note">Ohne Modell: Eine Stufe mehr heißt Chance × Exp(B).</p>
            <div className="task-grid">{CELLS.map(c => numberInput(CELL_FIELDS.odds[c][0], CELL_FIELDS.odds[c][1], state.odds[c], v => setCells('odds', c, v), c))}</div>
            <Feedback notes={checkCells(p, state.odds, 'odds')} />
          </div>
          <div className="task-card">
            <h4>{pair ? 'B · in Wahrscheinlichkeiten' : 'Sprache 2 · Wahrscheinlichkeiten'}</h4>
            <p className="sandbox-note">Mit <code>predict()</code> für erfundene Befragte.</p>
            <div className="task-grid">{CELLS.map(c => numberInput(CELL_FIELDS.prob[c][0], CELL_FIELDS.prob[c][1], state.prob[c], v => setCells('prob', c, v), c))}</div>
            <Feedback notes={checkCells(p, state.prob, 'prob')} />
          </div>
        </div>
        <HintLadder hint={{ ...hints.profiles, workshop: WORKSHOP }} onConcept={onConcept} file="buergerrat-profile.R" />

        <h4 className="s10-sub">Frage 3</h4>
        {quote(QUESTIONS[2])}
        <p className="task-prompt">Was antwortest du auf Frage 3? Klick deine Antwort an.</p>
        <div className="sandbox-chips" role="group" aria-label="Antwort auf Frage 3">
          {CAMPAIGN_ANSWERS.map(a => <button key={a.id} aria-pressed={state.campaign === a.id} onClick={() => set({ campaign: a.id as CampaignAnswer })}>{a.label}</button>)}
        </div>
        <TextAnswer id="s10-answer3" maxLength={800} label="Wie begründest du deine Antwort auf Frage 3?" help="Ein Satz für den Rat – mit deinen Zahlen für Jana und Herrn Wiegand"
          example="Weil bei Jana … und bei Herrn Wiegand …" value={state.answer3} onChange={answer3 => set({ answer3 })} />
        {!ready && <p className="sandbox-note">Die Dolmetscher-Tafel erscheint, sobald {listJoin(missing)} {missing.length > 1 ? 'stehen' : 'steht'}.</p>}
        {ready && p.main && <div className="s10-reveal-block">
          <Tafel rows={rows} or={p.main.expB[1]} />
          <SCurve fit={p.main} profiles={p.profiles} range={p.pflichtRange} />
          <Feedback notes={tafelNotes(p, state.campaign, state.answer3)} />
          <TextAnswer id="s10-joint" maxLength={800} size="long" label={`${pair ? 'Wie sagt ihr es dem Rat in einem gemeinsamen Satz' : 'Wie sagst du es dem Rat in einem Satz'} – mit Chancen und mit Wahrscheinlichkeiten?`}
            help="Ein Satz, der beide Sprachen verbindet"
            example="Eine Stufe mehr Pflichtgefühl vervielfacht die Chance um …; in Wahrscheinlichkeiten heißt das bei Jana …, bei Herrn Wiegand …"
            value={state.joint} onChange={joint => set({ joint })} />
          <Feedback notes={sentenceNotes(state.joint, '', k)} />
        </div>}
      </section>

      <section className="task-step">
        <h3>Station 5 · {pair ? 'B: ' : ''}Die eine Zahl für den Bericht</h3>
        <StepGuide
          why="Die Tafel zeigt: Je nach Sprache bringt die Kampagne beiden gleich viel oder Jana viel mehr. Für den Abschlussbericht will der Rat trotzdem eine Zahl. Ein Kandidat gilt für alle Befragten: der durchschnittliche marginale Effekt (AME)."
          steps={[
            'Rechne den AME des Pflichtgefühls in R. Welches Werkzeug passt?',
            'Leg die Kandidaten nebeneinander: Exp(B), den AME und die Zahlen von deiner Tafel. Welche versteht der Rat richtig, welche führt in die Irre?',
            'Trag genau eine Zahl ein, wähl ihre Einheit und erklär sie in einem Satz für Laien.',
          ]}
          done="Zahl, Einheit und Satz stehen und die Rückmeldung zeigt, was deine Zahl zeigt und was sie verschweigt." />
        {quote(QUESTIONS[3])}
        <div className="task-grid">{numberInput('Wie groß ist der durchschnittliche marginale Effekt (AME) des Pflichtgefühls?', 'Aus marginal_effects(): Spalte AME – so, wie R ihn zeigt', state.ame, v => set({ ame: v }))}</div>
        <Feedback notes={checkAme(p, state.ame)} />
        <HintLadder hint={{ ...hints.ame, workshop: WORKSHOP }} onConcept={onConcept} file="buergerrat-ame.R" />
        <div className="task-grid">
          {numberInput('Welche Zahl kommt in den Bericht?', 'Genau eine Zahl – die Einheit wählst du daneben', state.report.number, v => setReport({ number: v }))}
          <label>In welcher Einheit steht die Zahl?<small className="task-field-help">So liest der Rat die Zahl</small><select value={state.report.unit} onChange={e => setReport({ unit: e.target.value as Unit | '' })}>
            <option value="">Einheit wählen</option>{UNITS.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}
          </select></label>
        </div>
        <Feedback notes={checkReport(p, state.report.number, state.report.unit, ready)} />
        <TextAnswer id="s10-sentence" maxLength={600} label="Wie erklärst du die Zahl in einem Satz für Laien?" help="Ein Satz: Zahl, Einheit und für wen sie gilt"
          example="Mit jeder Stufe mehr … steigt …" value={state.report.sentence} onChange={sentence => setReport({ sentence })} />
        <Feedback notes={sentenceNotes(state.report.sentence, state.report.unit, k)} />
      </section>

      <details className="task-step s10-extra">
        <summary>Zusatz · Trefferquote gegen Likelihood</summary>
        <StepGuide
          why="Zum Schluss ein Einwand aus dem Rat: Jemand hat gehört, das Modell liege „fast immer richtig“. Stimmt das – und heißt das, es ist ein gutes Modell?"
          steps={[
            'Lies in summary() die Trefferquote deines Modells ab: Bei wie viel Prozent der Befragten liegt es richtig?',
            'Vergleich mit der einfachsten Regel: „Alle wählen.“ Bei wie viel Prozent läge sie richtig? Die Anzahlen dafür stehen in derselben Tabelle.',
            'Lies −2LL deines Modells ab (−2 Log Likelihood). Es misst, wie schlecht das Modell die beobachteten Antworten trifft: Kleiner ist besser.',
            'Das Nullmodell hat nur die Konstante. Sein −2LL steht nicht direkt in der Ausgabe. Der Omnibus-Test zeigt aber mit Chi-square, um wie viel −2LL vom Nullmodell zu deinem Modell sinkt.',
          ]}
          done="alle vier Zahlen grün sind und du dem Ratsmitglied in einem Satz antwortest." />
        <div className="task-grid">
          {numberInput('Bei wie viel Prozent der Befragten liegt das Modell richtig?', 'Aus summary(): Classification Table, Zeile Overall Percentage', state.likelihood.hitModel, v => setLl({ hitModel: v }))}
          {numberInput('Bei wie viel Prozent läge die Regel „alle wählen“ richtig?', 'In Prozent – aus den Anzahlen der Classification Table ausgerechnet', state.likelihood.hitAll, v => setLl({ hitAll: v }))}
          {numberInput('Wie groß ist −2LL in deinem Modell?', 'Aus summary(): Model Summary, Zeile -2 Log Likelihood', state.likelihood.modelLL, v => setLl({ modelLL: v }))}
          {numberInput('Wie groß ist −2LL im Nullmodell (nur mit der Konstante)?', 'Steht nicht direkt in summary(): −2 Log Likelihood plus Chi-square aus den Omnibus Tests', state.likelihood.nullLL, v => setLl({ nullLL: v }))}
        </div>
        <Feedback notes={checkLikelihood(p, state.likelihood)} />
        <HintLadder hint={{ ...hints.likelihood, workshop: WORKSHOP }} onConcept={onConcept} file="buergerrat-likelihood.R" />
        {llDone && <>
          <ul className="s10-notes">{likelihoodReveal(p).map(t => <li key={t}>{t}</li>)}</ul>
          <TextAnswer id="s10-ll" maxLength={600} label="Was antwortest du dem Ratsmitglied, das gehört hat, das Modell liege „fast immer richtig“?"
            help="Ein Satz – vergleich die Trefferquote mit der Regel „alle wählen“"
            example="Das Modell liegt bei … % richtig, die Regel „alle wählen“ bei … %. Das heißt: …" value={state.likelihood.sentence} onChange={sentence => setLl({ sentence })} />
        </>}
      </details>

      <p className="s02-takeaway"><strong>Das Wichtigste aus dieser Sitzung:</strong> Exp(B) vervielfacht die Chance, nicht die Wahrscheinlichkeit. In Chancen bringt eine Stufe mehr allen dasselbe. In Wahrscheinlichkeiten hängt es davon ab, wo jemand startet: Wer ohnehin fast sicher wählt, gewinnt wenig. Wer eine Zahl berichtet, sagt darum dazu, in welcher Sprache sie spricht.</p>
    </>}

    <PlenumCard title="Ratskarte · Dolmetschen für den Bürgerrat" lines={plenumLines(state, p)} file="buergerrat-ratskarte.md" />
    <p className="sandbox-note">Im Raum: Verschiedene Zahlen, alle aus einem Modell, alle richtig. Stimmt ab, welche in den Bericht kommt. Welche versteht eine Zeitung falsch? Welche ist für Jana ehrlich?</p>
    {statusS10(state) === 'done' && <>
      <details className="s10-afterword">
        <summary>Nachwort: sechs typische Umwege</summary>
        <ol>{DETOURS.map(d => <li key={d.title}><strong>{d.title}.</strong> {d.text}</li>)}</ol>
        <p>Und das Wichtigste: In Wahrscheinlichkeiten hat das Logit-Modell eine eingebaute Wechselwirkung. Wie viel eine Stufe mehr bringt, hängt davon ab, wo jemand auf der S-Kurve steht. Das kennst du als Interaktion aus Sitzung 10. Deshalb gibt es nicht die eine Zahl, sondern eine Wahl der Sprache.</p>
      </details>
      <details className="s02-solution"><summary>Ein vollständiges R-Skript zum Mitnehmen</summary><RBlock code={R_SOLUTION.full} file="buergerrat.R" /></details>
    </>}
  </div>;
}
