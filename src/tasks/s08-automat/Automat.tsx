import { Calculator, Equal, Shuffle, Sofa } from 'lucide-react';
import { useMemo, useState } from 'react';
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
import { LineGuess, ParadeTable, ProbeChart, SpreadChart } from './Charts';
import { DECISIONS, GUESSES, hints, INPUTS, inputById, MIN_CASES, ROLE, TOOLBOX_SCRIPT, WORKSHOP, type Guess, type InputId, type InputItem } from './content';
import {
  answerName, checkDisplay, compareGuess, checkLevene, checkSetting, checkSpread, codeNumber, compareLine, displayOk, drawVisitors, leveneVariants, lineAt, lineScore, lineSse,
  machineFor, NOT_ESTIMABLE, parade, paradeNotes, pickInput, playPoints, plenumLines, prepare, probeRows, probeTotals, recognisedLine, recognisedSetting, recognisedSpread,
  resolution, rSettingSolution, rSolution, scaffoldSetting, scaffoldSpread, scatter, shown as shownInput, signQuestions, spread, statusS08, variants,
  type Line, type Machine, type Resolution, type S08State, type Scatter, type Variant,
} from './domain';
import { TextAnswer } from '../kit/TextAnswer';
import { Quadrate } from './Quadrate';

const pct = (x: number) => `${de(100 * x, 1)} %`;
type Patch = (patch: Partial<S08State>) => void;

/** Die drei Antworten auf „Wer trifft öfter?“, jede mit einem Bild ihres Gegenstands. */
const GUESS_ICON: Record<Guess, typeof Sofa> = { Automat: Calculator, Faulpelz: Sofa, 'beide gleich oft': Equal };

export function Automat({ data, state, onChange, onConcept }: TaskProps<S08State>) {
  const set: Patch = patch => onChange({ ...state, ...patch });
  const p = useMemo(() => prepare(data.sav), [data.sav]);
  const playStart = useMemo(() => playPoints(data.sav), [data.sav]);
  const item = state.input ? inputById[state.input] : null;
  const vars = useMemo(() => (item ? variants(p, item) : []), [p, item]);
  const main = vars.find(v => v.kind === 'main') ?? null;
  const setting = { a: state.a, b: state.b, r2: state.r2 };
  const rec = item ? recognisedSetting(vars, setting) : null;
  // Deine Gerade zuerst: Punkte aus der gewichteten Rechnung; der Vergleich öffnet, sobald Konstante und Steigung aus R stimmen.
  const sc = useMemo(() => (item && main ? scatter(p, item, main) : null), [p, item, main]);
  const lineVar = item ? recognisedLine(vars, setting) : null;
  // Die echte Gerade ist sichtbar – ab jetzt gibt es keinen neuen Tipp mehr.
  const lineShown = Boolean(sc && state.lineLocked && state.myLine && lineVar);
  const fieldsOpen = !sc || state.lineLocked || Boolean(state.a.trim() || state.b.trim() || state.r2.trim());
  const machine = useMemo(() => (item && rec ? machineFor(p, item, rec, { a: state.a, b: state.b, r2: state.r2 }) : null), [p, item, rec, state.a, state.b, state.r2]);
  const res = useMemo(() => (machine ? resolution(machine) : null), [machine]);
  const sp = useMemo(() => (machine ? spread(machine) : null), [machine]);
  // erkannte Streuungstabelle (eigene Gewichtung; beim Automaten ohne Gewicht auch die gewichtete aus dem Skript)
  const spOk = useMemo(() => (machine ? recognisedSpread(machine, state.sdMin, state.sdMax) : null), [machine, state.sdMin, state.sdMax]);
  const lv = useMemo(() => (machine ? leveneVariants(machine) : null), [machine]);
  const code = codeNumber(state.code);
  const visitors = useMemo(() => (machine && code !== null ? probeRows(machine, drawVisitors(machine, code)) : []), [machine, code]);
  const totals = probeTotals(visitors);
  const shown = Boolean(res && state.guess && state.guessLocked);
  // Zu zweit gibt die Kuratorin Besucherprobe und Auflösung erst frei, wenn sie zwei Anzeigen selbst nachgerechnet hat.
  const displaysOk = Boolean(machine && item && displayOk(machine, item.probe[0], state.shows[0]) && displayOk(machine, item.probe[1], state.shows[1]));
  const paradeRows = useMemo(() => (rec && state.decision ? parade(p, rec.weighted) : null), [p, rec, state.decision]);
  const pair = state.mode === 'pair';
  const probeOpen = !pair || displaysOk;
  const tag = (who: string) => (pair ? ` · ${who}` : '');
  const newCode = () => set({ code: String(100 + Math.floor(Math.random() * 900)) });
  // Lösungsskript mit Konstante und Steigung der gewichteten Rechnung aus der eigenen Datei, so wie summary() sie druckt.
  const mainLine = main ? { a: main.a, b: main.b } : null;
  const stage = item?.groups ? 'Altersgruppe' : 'Eingabe';

  return <div className="task s08">
    <RoleBrief role="Technik im Besucherzentrum" title="Der Demokratie-Automat">
      <p><strong>Dein neuer Job: Technik im {ROLE.place}.</strong> Im Foyer soll ab März ein Automat stehen. Besucher:innen tippen eine Antwort über sich ein. Der Automat zeigt dann an: „Menschen wie du sind im Schnitt so zufrieden mit der Demokratie in Deutschland: …“ Die Zahlen kommen aus dem ALLBUS 2023.</p>
      <p>Die Kuratorin {ROLE.curator} schreibt dir: „Du baust den Automaten. Welche Frage er stellt, entscheidest du. Bis Freitag brauche ich drei Dinge: die Formel, mit der er rechnet, eine Probe, wie weit er danebenliegt, und das Schild, das neben ihm hängt. Das Schild muss ehrlich sein, es lesen auch Schulklassen. Und der Automat soll für alle funktionieren, nicht nur für manche.“</p>
      <p>Gegen deinen Automaten tritt der <strong>„Faulpelz“</strong> an. Er rechnet gar nicht: Er zeigt allen denselben Durchschnitt, egal was sie eintippen. Dein Automat soll zeigen, dass er mehr kann.</p>
      <p>Die Leitfrage: <strong>Wie gut sagt eine Gerade aus einer einzigen Antwort voraus, wie zufrieden jemand mit der Demokratie ist – und für wen liegt sie daneben?</strong></p>
      <p><strong>Was du dabei lernst:</strong> eine lineare Regression in R rechnen, Konstante, Steigung und R² lesen, Residuen bilden und prüfen, ob die Gerade für alle gleich gut passt.</p>
    </RoleBrief>
    <PartnerToggle mode={state.mode} onChange={mode => set({ mode })}
      solo="Du bist erst Technik (Gerade tippen, Automat in R einstellen), dann Kuratorin (zwei Anzeigen nachrechnen, Besucherprobe, Schild). Am Ende zeigt dir die Automaten-Parade alle zehn Eingabefragen aus deiner Datei."
      pair="A ist Technik und stellt den Automaten in R ein. B ist Kuratorin: gibt erst frei, wenn sie zwei Anzeigen selbst nachgerechnet hat, führt die Besucherprobe durch und schreibt das Schild. Beim zweiten R-Schritt tauscht ihr; die Entscheidung unterschreibt ihr beide." />

    <Toolbox file="automat-werkzeuge.R" code={TOOLBOX_SCRIPT} tools={[
      { fn: 'library(), read_spss(), %>%, codebook()', text: <>kennst du aus Sitzung 1 und 4: Pakete laden, Daten einlesen, Schritte mit der Pipe verketten (lies <code>%&gt;%</code> als „und dann“), im Codebuch nachsehen.</> },
      { fn: 'mutate() + rec()', text: <>kennst du aus Sitzung 5: <code>rec()</code> kodiert eine Variable um. Mit <code>rules = "rev"</code> polst du sie um (der kleinste Code wird der größte), mit Regeln wie <code>"18:29=1"</code> fasst du Codes zusammen. <code>mutate()</code> legt das Ergebnis unter einem neuen Namen in <code>allbus</code> ab (<code>allbus &lt;- allbus %&gt;% mutate(…)</code>) – und rechnet auch neue Variablen aus anderen aus, etwa Konstante + Steigung × Eingabe. Mehrere neue Variablen stehen durch Kommas getrennt in einem <code>mutate()</code>.</> },
      { fn: 'weights = wghtpew', text: <>kennst du aus Sitzung 6: gewichtet die Befragten so, dass das Ergebnis für ganz Deutschland gilt. Der Osten ist im ALLBUS stärker vertreten als in der Bevölkerung.</> },
      { fn: 'linear_regression()', isNew: true, text: <>legt eine Gerade durch die Daten. In der Formel <code>y ~ x</code> steht links, was vorhergesagt wird (abhängige Variable), rechts, woraus (unabhängige Variable). Die Kurzausgabe zeigt in der ersten Zeile R².</> },
      { fn: 'summary()', text: <>kennst du aus Sitzung 7 und 8. Bei einer Regression zeigt sie die ausführliche Ausgabe: In der Tabelle <em>Coefficients</em>, Spalte <em>B</em>, stehen die Konstante (Zeile <em>(Intercept)</em>) und die Steigung; unter <em>Model Summary</em> steht R² als <em>R Square</em>.</> },
      { fn: 'group_by()', isNew: true, text: <>teilt die Befragten nach den Codes einer Variable in Gruppen. <code>describe()</code> (kennst du aus Sitzung 3) zeigt danach die Kennzahlen für jede Gruppe getrennt, zum Beispiel die SD (Standardabweichung). Beides steht in einer Kette: <code>allbus %&gt;% group_by(…) %&gt;% describe(…)</code>.</> },
      { fn: 'levene_test()', isNew: true, text: <>prüft, ob eine Variable in allen Gruppen gleich stark streut. Ein kleiner p-Wert heißt: Die Streuung ist nicht überall gleich.</> },
      { fn: '+ - * /', text: <>kennst du aus Sitzung 3: R rechnet wie ein Taschenrechner.</> },
    ]} />

    <section className="task-step">
      <h3>Einstieg · Eine Gerade durch die Punkte legen</h3>
      <StepGuide
        why="Bevor du den Automaten baust: Eine lineare Regression legt eine Gerade durch eine Punktwolke. Hier siehst du 15 echte Befragte aus dem ALLBUS: wie viele Stunden sie pro Woche arbeiten und wie viel Geld sie im Monat netto bekommen. Wie weit ein Punkt über oder unter einer Linie liegt, heißt Residuum. Du legst selbst eine Gerade, vergleichst sie mit der Geraden aus R und verschiebst Punkte."
        steps={[
          'Zieh die beiden blauen Griffe, bis deine Gerade gut durch die Punkte läuft. Woran machst du fest, was „gut“ ist?',
          'Schalte die Quadrate ein. Was passiert mit der großen Zahl, wenn du deine Gerade bewegst? Wie klein bekommst du sie?',
          'Blende die Gerade aus R ein. Wo liegt sie im Vergleich zu deiner? Klick die Zeilen an und vergleiche die Fehlerquadrate.',
          'Zieh einzelne Punkte weit nach oben oder zur Seite. Welche Punkte bewegen die Gerade aus R stark, welche kaum? Was macht ein neuer Punkt?',
          'Klick auf „Durchschnitt“. Was hat R² mit den Fehlerquadraten des Durchschnitts und der Geraden aus R zu tun?',
        ]}
        done="du in einem Satz sagen kannst, nach welcher Regel R seine Gerade legt." />
      {playStart
        ? <Quadrate start={playStart} />
        : <p className="sandbox-note" role="note">Für diese Grafik fehlen in deiner Datei die Variablen dw15 (Arbeitsstunden) oder incc (Einkommen), oder zu wenige Befragte haben beide beantwortet.</p>}
    </section>

    <section className="task-step">
      <h3>1 · Welche Frage stellt der Automat?</h3>
      <StepGuide
        why="Du hast an 15 Befragten ausprobiert, wie eine Gerade durch Punkte gelegt wird. Jetzt baust du den Automaten. Er stellt den Besucher:innen genau eine Frage. Welche, entscheidest du. Davon hängt ab, wie viel er über die Zufriedenheit mit der Demokratie verraten kann."
        steps={[
          'Lies die zehn vorbereiteten Eingabefragen im Menü. Im Seminar werden sie nach Sitzreihen verteilt.',
          'Überleg: Bei welcher Frage erwartest du einen deutlichen Zusammenhang mit der Zufriedenheit – und bei welcher kaum einen?',
          'Wähl eine Frage und schreib in einem Satz, warum.',
        ]}
        done="deine Frage gewählt und begründet ist." />
      <div className="task-grid">
        <label>Welche Frage stellt dein Automat den Besucher:innen?<small className="task-field-help">Aus dieser einen Antwort sagt er die Zufriedenheit mit der Demokratie vorher</small><select value={state.input ?? ''} onChange={e => onChange(pickInput(state, (e.target.value || null) as InputId | null))}>
          <option value="">Frage wählen</option>{INPUTS.map((it, i) => <option key={it.id} value={it.id}>{i + 1} · {it.title}</option>)}
        </select></label>
      </div>
      {item && <article className="task-card s08-card">
        <h4>{item.title} <code>{item.id}</code></h4>
        <p className="s08-ask">„{item.ask}“</p>
        <p className="sandbox-note">{item.scale}</p>
        {main && main.fit.n < MIN_CASES && <p className="sandbox-note" role="note">Nur {main.fit.n} Befragte haben diese Frage und ps03 beantwortet – der Automat steht auf wackligen Beinen.</p>}
        <TextAnswer id="s08-reason" maxLength={400} label="Warum hast du diese Frage gewählt?" help="Ein Satz: Was vermutest du – wie hängt diese Frage mit ps03 zusammen, das der Automat anzeigt?"
          example="Ich vermute: Wer hier …, der … eher …" value={state.reason} onChange={reason => set({ reason })} />
      </article>}
    </section>

    {item && <>
      <section className="task-step">
        <h3>2 · Deine Gerade zuerst{tag('Technik')}</h3>
        {!sc
          ? <p className="sandbox-note" role="note">{NOT_ESTIMABLE}</p>
          : <MyLine item={item} sc={sc} state={state} set={set} revealed={lineShown} />}
      </section>

      {main && <section className="task-step">
        <h3>3 · Automat einstellen (R){tag('Technik')}</h3>
        <StepGuide
          why="Dein Tipp steht. Jetzt rechnet R die Gerade aus, die am besten zu allen Befragten passt. Das ist eine lineare Regression."
          steps={[
            <>Im Diagramm aus Schritt 2 heißt 6 „sehr zufrieden“. Schau im Codebuch nach: Was heißt bei <code>ps03</code> die 1? Passt die Richtung nicht, polst du ps03 zuerst um.</>,
            <>Stell den Automaten mit einer linearen Regression ein. Vorhergesagt wird die Zufriedenheit, und zwar aus deiner Eingabefrage <code>{item.id}</code>. Rechne gewichtet – der Automat soll für ganz Deutschland sprechen.</>,
            <>Lies in der ausführlichen Ausgabe drei Zahlen ab: die <strong>Konstante</strong> (was der Automat bei Eingabe 0 anzeigt), die <strong>Steigung</strong> (um wie viel sich die Anzeige pro Stufe ändert) und <strong>R²</strong> (welchen Anteil der Unterschiede in der Zufriedenheit die Gerade erklärt).</>,
          ]}
          done="alle drei Zahlen grün bestätigt sind. Dann siehst du deine Gerade neben der echten." />
        {!fieldsOpen && <p className="sandbox-note">Gib zuerst in Schritt 2 deinen Tipp ab – dann trägst du hier die Zahlen aus R ein.</p>}
        {fieldsOpen && <><div className="task-grid">
          <label>Wie groß ist die Konstante (die Anzeige bei Eingabe 0)?<small className="task-field-help">Aus summary(), Tabelle Coefficients: Zeile (Intercept), Spalte B – drei Nachkommastellen</small><input type="text" inputMode="decimal" maxLength={12} value={state.a} onChange={e => set({ a: e.target.value })} /></label>
          <label>Wie groß ist die Steigung (die Änderung der Anzeige pro Stufe)?<small className="task-field-help">Tabelle Coefficients: Zeile {item.id}, Spalte B – drei Nachkommastellen, ein Minuszeichen mit abtippen</small><input type="text" inputMode="decimal" maxLength={12} value={state.b} onChange={e => set({ b: e.target.value })} /></label>
          <label>Welchen Anteil der Unterschiede in der Zufriedenheit erklärt der Automat (R²)?<small className="task-field-help">Aus summary(), Tabelle Model Summary: Zeile R Square</small><input type="text" inputMode="decimal" maxLength={12} value={state.r2} onChange={e => set({ r2: e.target.value })} /></label>
        </div>
        <Feedback notes={checkSetting(item, vars, setting)} />
        <HintLadder key={`setting-${item.id}`} hint={{ ...hints.setting, workshop: WORKSHOP, scaffold: scaffoldSetting(item), solution: rSettingSolution(item) }} onConcept={onConcept} file="automat-einstellen.R" /></>}
        {sc && lineShown && state.myLine && lineVar && <LineReveal p={p} item={item} sc={sc} own={state.myLine} v={lineVar} />}
      </section>}

      {machine && <Testing machine={machine} state={state} set={set} visitors={visitors} totals={totals} code={code} newCode={newCode} tag={tag} probeOpen={probeOpen} />}

      {machine && res && probeOpen && <GuessStep machine={machine} res={res} state={state} set={set} r2={rec ? shownInput(state.r2, [rec.r2]) : state.r2.trim()} shown={shown} />}

      {machine && sp && <section className="task-step">
        <h3>6 · Gleich gut für alle? (R){pair ? ' · Rollentausch: Kuratorin rechnet, Technik prüft' : ''}</h3>
        <StepGuide
          why="Du weißt jetzt, wie gut der Automat im Schnitt ist. Die Kuratorin will aber, dass er für alle funktioniert. Liegt er bei manchen Eingaben weiter daneben als bei anderen?"
          steps={[
            <>Bilde in R zwei neue Variablen: die Anzeige des Automaten (Konstante + Steigung × Eingabe, mit deinen Zahlen aus Schritt 3) und das Residuum (Antwort minus Anzeige).</>,
            ...(item.groups ? [<>Beim Alter haben einzelne Jahrgänge zu wenige Befragte. Fasse das Alter darum zu fünf Gruppen zusammen: 18–29, 30–44, 45–59, 60–74 und 75+.</>] : []),
            <>Lass dir die Standardabweichung (SD) der Residuen getrennt für jede {stage} zeigen, gewichtet. Die SD sagt, wie weit der Automat dort typischerweise danebenliegt.</>,
            'Trag die kleinste und die größte SD ein.',
          ]}
          done="beide Werte grün bestätigt sind. Dann erscheinen die Balken für alle Stufen." />
        <div className="task-grid">
          <label>Wie groß ist die kleinste SD der Residuen?<small className="task-field-help">Spalte SD aus describe(), je {stage} getrennt – der kleinste Wert, drei Nachkommastellen</small><input type="text" inputMode="decimal" maxLength={12} value={state.sdMin} onChange={e => set({ sdMin: e.target.value })} /></label>
          <label>Wie groß ist die größte SD der Residuen?<small className="task-field-help">Dieselbe Spalte SD – der größte Wert, drei Nachkommastellen</small><input type="text" inputMode="decimal" maxLength={12} value={state.sdMax} onChange={e => set({ sdMax: e.target.value })} /></label>
        </div>
        <Feedback notes={checkSpread(machine, sp, state.sdMin, state.sdMax)} />
        <HintLadder key={`spread-${item.id}`} hint={{ ...hints.spread, workshop: WORKSHOP, scaffold: scaffoldSpread(item), solution: rSolution(item, mainLine) }} onConcept={onConcept} file="automat.R" />
        {spOk
          ? <SpreadChart spread={spOk} item={item} />
          : <p className="sandbox-note">Nach deinem Eintrag siehst du die Streuung aller Stufen als Balken, dazu die mittleren Residuen: Liegt die Gerade dort zu hoch oder zu tief?</p>}
        <details className="s08-extra">
          <summary>Profi-Zusatz: Levene-Test der Voraussetzung</summary>
          <p>Eine Regression setzt voraus, dass die Residuen überall gleich stark streuen (gleiche Fehlervarianz). Der Levene-Test prüft das: Er vergleicht die Streuung der Residuen über alle Stufen.</p>
          <div className="task-grid"><label>Wie groß ist der F-Wert des Levene-Tests?<small className="task-field-help">Ausgabe von levene_test(): die Zahl nach „F(…, …) =“</small><input type="text" inputMode="decimal" maxLength={12} value={state.levene} onChange={e => set({ levene: e.target.value })} /></label></div>
          {lv && <Feedback notes={checkLevene(machine, lv, state.levene)} />}
        </details>
      </section>}

      <section className="task-step">
        <h3>7 · Schild und Entscheidung{tag('Kuratorin schreibt, beide unterschreiben')}</h3>
        <StepGuide
          why="Du weißt jetzt, wie gut der Automat im Schnitt trifft und für wen er weiter danebenliegt. Das gehört aufs Schild – ehrlich und so, dass auch Schulklassen es verstehen."
          steps={[
            'Schreib zwei, drei Sätze: Was zeigt der Automat? Wie weit liegt er typischerweise daneben? Für wen ist er ungenauer?',
            'Lies die Gegenfragen unter deinem Schild und bessere nach. Behauptet dein Schild eine Ursache, die eine Gerade gar nicht zeigen kann?',
            `Entscheide: freigeben, nur mit Schild freigeben oder eine andere Frage vorschlagen.${pair ? ' Dann unterschreibt ihr beide.' : ''}`,
          ]}
          done="dein Schild steht und die Entscheidung getroffen ist." />
        <label className="sandbox-label" htmlFor="s08-sign">Was steht auf dem Schild neben dem Automaten? (zwei, drei Sätze, die auch Schulklassen verstehen)</label>
        <textarea id="s08-sign" maxLength={400} value={state.sign} placeholder="Dieser Automat zeigt … Er liegt typischerweise … daneben, am weitesten bei …"
          onChange={e => set({ sign: e.target.value })} />
        <Feedback notes={signQuestions(state.sign, item, spOk)} />
        <p className="task-prompt">Wie entscheidest du: Darf der Automat ins Foyer?</p>
        <div className="sandbox-chips" role="group" aria-label="Entscheidung">
          {DECISIONS.map(d => <button key={d} aria-pressed={state.decision === d} onClick={() => set({ decision: d })}>{d}</button>)}
        </div>
        {pair && <div className="s08-signatures">
          <label className="s04-check"><input type="checkbox" checked={state.signedTech} onChange={e => set({ signedTech: e.target.checked })} /> Technik unterschreibt</label>
          <label className="s04-check"><input type="checkbox" checked={state.signedCurator} onChange={e => set({ signedCurator: e.target.checked })} /> Kuratorin unterschreibt</label>
        </div>}
      </section>

      {paradeRows && <section className="task-step">
        <h3>8 · Automaten-Parade</h3>
        <StepGuide
          why="Deine Entscheidung steht. Wie hätten die anderen neun Fragen abgeschnitten?"
          steps={[
            'Deck die Parade auf – im Seminar erst nach dem Plenum.',
            'Vergleiche: Welche Frage hat das größte R²? Bei welchen trifft der Automat seltener als der Faulpelz?',
          ]} />
        <details className="s08-extra">
          <summary>Parade aufdecken (im Seminar erst nach dem Plenum)</summary>
          <p>So schneiden alle zehn Eingabefragen aus deiner Datei ab ({rec?.weighted ? 'gewichtet' : 'ohne Gewicht'}); ↓ heißt: trifft seltener als der Faulpelz.</p>
          <ParadeTable rows={paradeRows} own={item.id} />
          <ul className="s08-notes">{paradeNotes(paradeRows).map(n => <li key={n}>{n}</li>)}</ul>
        </details>
      </section>}

      <p className="s02-takeaway"><strong>Das Wichtigste aus dieser Sitzung:</strong> Eine Regressionsgerade sagt für jede Eingabe einen Durchschnitt voraus: Konstante + Steigung × Eingabe. R wählt die Gerade mit den kleinsten Fehlerquadraten. R² sagt, um welchen Anteil sie weniger Fehlerquadrate macht als der Durchschnitt allein – nicht, wie oft sie trifft. Ob sie für alle gleich gut passt, zeigen erst die Residuen je Gruppe.</p>
    </>}

    <PlenumCard title="Der Demokratie-Automat" lines={plenumLines(state, rec, shown ? res : null, spOk)} file="automat-plenum.md" />
    {item && statusS08(state) === 'done' && <details className="s02-solution"><summary>Ein vollständiges R-Skript zum Mitnehmen</summary><RBlock code={rSolution(item, mainLine)} file="automat.R" /></details>}
  </div>;
}

/** Schritt 4: Anzeige von Hand, Automat im Probebetrieb, Besucherprobe. */
function Testing({ machine, state, set, visitors, totals, code, newCode, tag, probeOpen }: {
  machine: Machine; state: S08State; set: Patch; visitors: ReturnType<typeof probeRows>; totals: ReturnType<typeof probeTotals>;
  code: number | null; newCode: () => void; tag: (who: string) => string; probeOpen: boolean;
}) {
  const item = machine.item, [x1, x2] = item.probe;
  const both = displayOk(machine, x1, state.shows[0]) && displayOk(machine, x2, state.shows[1]);
  const inputName = (x: number) => (item.groups ? `Alter ${x}` : item.levels?.[x] ? `Eingabe ${x} („${item.levels[x]}“)` : `Eingabe ${x}`);
  const setShow = (i: 0 | 1, v: string) => set({ shows: (i === 0 ? [v, state.shows[1]] : [state.shows[0], v]) as [string, string] });
  return <section className="task-step">
    <h3>4 · Testen: von Hand und mit Besucher:innen{tag('Kuratorin')}</h3>
    <StepGuide
      why="Der Automat ist eingestellt. Bevor er ins Foyer darf, prüft die Kuratorin ihn: Rechnet er so, wie du denkst? Und wie weit liegt er bei echten Menschen daneben?"
      steps={[
        'Rechne zwei Anzeigen von Hand nach: Konstante + Steigung × Eingabe, mit deinen Zahlen aus Schritt 3.',
        'Probier den Automaten danach im Probebetrieb aus: Tipp verschiedene Eingaben ein.',
        'Zieh eine Besuchergruppe mit einem Gruppencode (im Seminar alle denselben). Vergleiche für jede Person: Wie weit liegen Automat und Faulpelz daneben?',
      ]}
      done="beide Anzeigen grün bestätigt sind und du deine Besuchergruppe gesehen hast." />
    <div className="task-grid">
      <label>Was zeigt der Automat bei {inputName(x1)} an?<small className="task-field-help">Konstante + Steigung × {x1}, mit deinen Zahlen aus Schritt 3 – zwei Nachkommastellen</small><input type="text" inputMode="decimal" maxLength={12} value={state.shows[0]} onChange={e => setShow(0, e.target.value)} /></label>
      <label>Was zeigt der Automat bei {inputName(x2)} an?<small className="task-field-help">Konstante + Steigung × {x2}, mit deinen Zahlen aus Schritt 3 – zwei Nachkommastellen</small><input type="text" inputMode="decimal" maxLength={12} value={state.shows[1]} onChange={e => setShow(1, e.target.value)} /></label>
    </div>
    <Feedback notes={[...checkDisplay(machine, x1, state.shows[0]), ...checkDisplay(machine, x2, state.shows[1])]} />
    {both && <>
      <p className="sandbox-note">Und bei Eingabe 0 zeigt er die Konstante, {de(machine.a, 3)}. {item.zero}</p>
      <Display key={item.id} machine={machine} />
    </>}
    <h4 className="s08-sub">Besucherprobe</h4>
    {!probeOpen && <p className="sandbox-note">Die Kuratorin gibt die Besucherprobe erst frei, wenn sie zwei Anzeigen selbst nachgerechnet hat.</p>}
    {probeOpen && <>
      <p>Eine Besuchergruppe zieht 20 Befragte aus deiner Datei. Du siehst nur Eingabe und Antwort – und wie weit Automat und Faulpelz danebenliegen. Mit demselben Gruppencode ziehen alle Rechner im Raum dieselben Personen.</p>
      <div className="sandbox-chips">
        <label className="s08-code">Gruppencode (drei oder vier Ziffern) <input type="text" inputMode="numeric" maxLength={4} value={state.code} onChange={e => set({ code: e.target.value.replace(/\D/g, '') })} /></label>
        <button onClick={newCode}><Shuffle size={14} aria-hidden="true" /> Neue Besuchergruppe</button>
      </div>
      {code === null && state.code.trim() !== '' && <p className="sandbox-note">Der Gruppencode hat drei oder vier Ziffern.</p>}
      {visitors.length > 0 && <>
        <ProbeChart rows={visitors} item={item} />
        <p className="sandbox-note">Wie weit die Anzeige neben der Antwort liegt (Antwort minus Anzeige), heißt <strong>Residuum</strong>. Die <strong>Fehlerquadrate</strong> sind alle Residuen, jedes mit sich selbst malgenommen und dann zusammengezählt – große Fehler zählen so besonders stark. Ein <strong>Treffer</strong> heißt: höchstens 1 Punkt daneben.</p>
        <p><strong>Deine Gruppe:</strong> Fehlerquadrate Automat {de(totals.sse, 1)}, Faulpelz {de(totals.lazySse, 1)} · Treffer auf ±1: Automat {totals.hits}, Faulpelz {totals.lazyHits} von {visitors.length}.</p>
      </>}
    </>}
  </section>;
}

/** Schritt 5: erst festlegen, wer öfter trifft, dann die Auflösung über alle Befragten – mit der eigenen getippten Geraden zum Vergleich.
 *  Die Auflösung erscheint mit dem abgegebenen Tipp; einen neuen Tipp gibt es danach nicht mehr. */
function GuessStep({ machine, res, state, set, r2, shown }: { machine: Machine; res: Resolution; state: S08State; set: Patch; r2: string; shown: boolean }) {
  const own = state.lineLocked && state.myLine ? lineScore(machine, state.myLine.a, state.myLine.b) : null;
  return <section className="task-step">
    <h3>5 · Wer trifft öfter: Automat oder Faulpelz?</h3>
    <StepGuide
      why="In deiner Besuchergruppe hast du 20 Menschen gesehen. Wie schneiden Automat und Faulpelz bei allen Befragten ab?"
      steps={[
        'Ein Treffer heißt: Die Anzeige liegt höchstens 1 Punkt neben der Antwort.',
        'Leg dich fest, bevor du die Auflösung siehst: Wer trifft über alle Befragten öfter? Klick eine Antwort an und gib deinen Tipp ab.',
        'Lies die Auflösung: Wer macht weniger Fehlerquadrate, wer trifft öfter – und was hat das mit deinem R² zu tun?',
      ]}
      done="du erklären kannst, warum weniger Fehlerquadrate nicht automatisch mehr Treffer heißen." />
    {!state.guessLocked && <>
      <p className="task-prompt">Wer liegt über alle Befragten öfter höchstens 1 Punkt neben der Antwort? Klick an.</p>
      <div className="sandbox-chips" role="group" aria-label="Tipp: Wer trifft öfter?">
        {GUESSES.map(g => { const Icon = GUESS_ICON[g]; return <button key={g} aria-pressed={state.guess === g} onClick={() => set({ guess: g })}><Icon size={16} aria-hidden="true" /> {g}</button>; })}
      </div>
    </>}
    <div className={`s03-tip${state.guessLocked ? ' locked' : ''}`} role="status">
      <p>{state.guess ? <><strong>Dein Tipp:</strong> {state.guess === 'beide gleich oft' ? 'Beide treffen gleich oft.' : `Der ${state.guess} trifft öfter.`}</> : 'Noch kein Tipp. Klick oben eine Antwort an.'}</p>
      {!state.guessLocked
        ? <button className="primary" disabled={!state.guess} onClick={() => set({ guessLocked: true })}>Tipp abgeben</button>
        : <p className="sandbox-note">Abgegeben – die Auflösung steht darunter.</p>}
    </div>
    {shown && <div className="s08-reveal" aria-live="polite">
      <Feedback notes={compareGuess(state.guess, res)} />
      <p><strong>Fehlerquadrate:</strong> Automat {de(res.sse, 0)}, Faulpelz {de(res.sst, 0)} – also {pct(res.reduction)} weniger. Das ist dein R² ({r2}).</p>
      <p><strong>Treffer auf ±1:</strong> Automat {pct(res.hit)}, Faulpelz {pct(res.lazyHit)}.{res.hit < res.lazyHit - 1e-12 ? ' Der Automat trifft seltener als der Faulpelz!' : Math.abs(res.hit - res.lazyHit) <= 1e-12 ? ' Beide treffen genau gleich oft.' : ''}</p>
      <p className="sandbox-note">Warum ist der Faulpelz so gut? Er zeigt allen {de(res.mean, 2)}. Damit liegt er bei allen, die {res.near.map(n => `${n.value} (${pct(n.share)})`).join(' oder ')} geantwortet haben, höchstens 1 daneben – {res.nearAreTop ? 'das sind die häufigsten Antworten' : `zusammen ${pct(res.near.reduce((a, n) => a + n.share, 0))} aller Antworten`}. Weniger Fehlerquadrate heißt nicht mehr Treffer.</p>
      {own && <p><strong>Und deine getippte Gerade aus Schritt 2?</strong> Fehlerquadrate {de(own.sse, 0)}, Treffer auf ±1: {pct(own.hit)}. {own.hit > res.hit + 1e-12
        ? 'Sie trifft sogar öfter als die Gerade aus R – obwohl sie mehr Fehlerquadrate macht. Die Gerade aus R macht die Fehlerquadrate so klein wie möglich, nicht die Zahl der Fehlschüsse.'
        : 'Die Gerade aus R macht weniger Fehlerquadrate – das schafft keine andere Gerade.'}</p>}
    </div>}
  </section>;
}

/** Der Automat im Probebetrieb: eine Eingabe tippen, die Anzeige erscheint. */
function Display({ machine }: { machine: Machine }) {
  const item = machine.item;
  const [x, setX] = useState(item.probe[0]);
  const show = machine.a + machine.b * x;
  return <div className="s08-display">
    <label>{item.ask} <input type="number" value={x} onChange={e => setX(Number(e.target.value))} /></label>
    <output aria-live="polite">Menschen wie du sind im Schnitt so zufrieden mit der Demokratie: <strong>{de(show, 1)}</strong> von 6</output>
  </div>;
}

/** Schritt 2 · Deine Gerade zuerst: Bevor R rechnet, stellst du die Regel des Automaten selbst ein – zwei Griffe auf der Geraden.
 *  „Neu tippen“ gibt es nur, solange die echte Gerade (Schritt 3) noch nicht sichtbar ist. */
function MyLine({ item, sc, state, set, revealed }: { item: InputItem; sc: Scatter; state: S08State; set: Patch; revealed: boolean }) {
  const line = state.myLine, locked = state.lineLocked;
  const show = (x: number) => (line ? de(Math.min(6, Math.max(1, lineAt(line, x))), 1) : '');
  return <>
    <StepGuide
      why="Du hast deine Frage. Bevor R rechnet, legst du fest, wie dein Automat rechnen soll. So siehst du hinterher, was die Daten dir Neues zeigen."
      steps={[
        <>Jeder grüne Punkt zeigt, wie zufrieden die Befragten mit einer {sc.binned ? 'Altersstufe' : 'Antwort'} im Schnitt sind: 1 heißt sehr unzufrieden, 6 sehr zufrieden.</>,
        'Zieh die beiden blauen Punkte nach oben oder unten, bis die Gerade gut zu den orangen Punkten passt. Die Gerade ist die Regel deines Automaten: Für jede Eingabe zeigt er ihre Höhe an.',
        'Gib deinen Tipp ab. Danach rechnest du in R nach.',
      ]}
      done="dein Tipp abgegeben ist." />
    {!locked && <p className="task-prompt">Zieh die beiden blauen Punkte nach oben oder unten, bis die Gerade gut zu den orangen Punkten passt.</p>}
    <LineGuess item={item} sc={sc} line={line} locked={locked} onLine={myLine => set({ myLine })} />
    <div className={`s03-tip${locked ? ' locked' : ''}`} role="status" style={{ maxWidth: 'none' }}>
      <p><strong>Dein Automat:</strong> {line
        ? <>Bei {answerName(item, sc.xMin)} zeigt er {show(sc.xMin)}, bei {answerName(item, sc.xMax)} zeigt er {show(sc.xMax)}.</>
        : <>Was zeigt er bei {answerName(item, sc.xMin)}, was bei {answerName(item, sc.xMax)}?</>}</p>
      {!locked
        ? <button className="primary" disabled={!line} onClick={() => set({ lineLocked: true })}>Tipp abgeben</button>
        : revealed
          ? <p className="sandbox-note">Abgegeben. Die echte Gerade steht jetzt in Schritt 3 neben deiner.</p>
          : <p className="sandbox-note">Abgegeben – jetzt rechnest du in R nach. <button className="sandbox-link" onClick={() => set({ lineLocked: false })}>Neu tippen</button></p>}
    </div>
    {!locked && !line && <small className="task-field-help" style={{ display: 'block', marginTop: 4 }}>Ohne Maus: Tab auf einen blauen Punkt, dann Pfeiltasten.</small>}
  </>;
}

/** Nach den richtigen Zahlen aus R: deine Gerade neben der echten, in Worten verglichen, mit den Fehlerquadraten beider. */
function LineReveal({ p, item, sc, own, v }: { p: ReturnType<typeof prepare>; item: InputItem; sc: Scatter; own: Line; v: Variant }) {
  const real = { a: v.a, b: v.b };
  const sse = useMemo(() => ({ own: lineSse(p, item, v, own), real: v.fit.ssResidual }), [p, item, v, own]);
  return <>
    <h4 className="s08-sub">Dein Automat gegen den echten</h4>
    <LineGuess item={item} sc={sc} line={own} real={real} locked />
    <Feedback notes={compareLine(item, own, real, sc.xMin, sc.xMax, sse)} />
  </>;
}
