import { Shuffle } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Feedback } from '../kit/Feedback';
import { HintLadder } from '../kit/HintLadder';
import { parseNumber } from '../kit/numbers';
import { PartnerToggle } from '../kit/PartnerToggle';
import { PlenumCard } from '../kit/PlenumCard';
import { RBlock } from '../kit/RBlock';
import { RoleBrief } from '../kit/RoleBrief';
import type { MeasureId } from '../kit/stats';
import { StepGuide } from '../kit/StepGuide';
import { Toolbox } from '../kit/Toolbox';
import type { TaskProps } from '../types';
import { CARDS, cardById, checkHint, hintTexts, ROLE, splitHints, STAMPS, TOOLBOX_SCRIPT, WORKSHOP, type CardId } from './content';
import { Board } from './Board';
import {
  boardTable, checkCodeFor, checkEntry, checkStamp, chooseMeasure, checkStrata, COMPARE_BY, compareRankGuess, CURRENCIES, defaultGuess, driverQuestion, fitNotes, guessRows, MEASURE_IDS,
  measureLabel, moveGuess, pickCard, plenumLines, prepare, randomCard, rCodeFor, recognised, reducedNote, reveal, revealNotes, rMeasureFor, rSetupFor, rSplitFor, scaffoldFor,
  splitScaffoldFor, stampRule, statusS05, strata, variants, VIEW_LABELS, VIEWS, type Currency, type S05State,
} from './domain';
import { MeasurePath } from './MeasurePath';
import { RankChart } from './RankChart';
import { RankGuess } from './RankGuess';
import { TextAnswer } from '../kit/TextAnswer';

const REGION: Record<string, { where: string; help: string }> = {
  West: { where: 'im Westen', help: 'Nur Befragte aus dem Westen (eastwest 1)' },
  Ost: { where: 'im Osten', help: 'Nur Befragte aus dem Osten (eastwest 2)' },
};
/** Frage über einem Teilwert: West/Ost mit dem gewählten Maß, bei „West oder Ost“ Gamma je Gruppe der Wirtschaftslage. */
const stratumQuestion = (card: CardId, measure: MeasureId | '', label: string) => card === 'eastwest'
  ? `Welches Gamma zeigt die Gruppe „${label}“?`
  : `Welchen Wert hat ${measure ? measureLabel(measure) : 'dein Maß'} ${REGION[label]?.where ?? `in ${label}`}?`;
const stratumHelp = (card: CardId, i: number, label: string) => card === 'eastwest'
  ? `Nur Befragte mit lage ${i + 1} – drei Nachkommastellen, ein Minuszeichen mit abtippen`
  : `${REGION[label]?.help ?? label} – drei Nachkommastellen, ein Minuszeichen mit abtippen`;

export function Treiber({ data, state, onChange, onConcept }: TaskProps<S05State>) {
  const set = (patch: Partial<S05State>) => onChange({ ...state, ...patch });
  const p = useMemo(() => prepare(data.sav), [data.sav]);
  const boardStart = useMemo(() => boardTable(p), [p]);
  const card = state.card ? cardById[state.card] : null;
  const vars = useMemo(() => (card ? variants(p, card) : []), [p, card]);
  const groups = card ? strata(p, card) : [];
  const main = card ? checkEntry(p, card, vars, state) : [];
  // Die Rangliste kommt nach dem eigenen Eintrag: Wert, Werte je Teil (West/Ost bzw. Wirtschaftslage), Urteil und Satz.
  const entered = parseNumber(state.value) !== null;
  const strataDone = groups.length > 0 && state.strata.slice(0, groups.length).every(v => parseNumber(v) !== null);
  const ready = Boolean(card && entered && strataDone && state.stamp && state.sentence.trim());
  const rev = useMemo(() => (ready ? reveal(p) : null), [p, ready]);
  const draw = () => onChange(pickCard(state, randomCard(state.card)));
  const setSecond = (patch: Partial<S05State['second']>) => set({ second: { ...state.second, ...patch } });
  const setMeasure = (measure: MeasureId | '') => onChange(chooseMeasure(state, measure));
  // Rang-Tipp: Ausgangsreihenfolge alphabetisch, bis die Karten verschoben werden. Verglichen wird zuerst mit dem eigenen Maß.
  const order = state.rankGuess.length ? state.rankGuess : defaultGuess();
  const [compareChoice, setCompareChoice] = useState<Currency | null>(null);
  const compareBy: Currency = compareChoice ?? (state.measure ? COMPARE_BY[state.measure] : 'tau');
  const rows = rev && state.rankLocked ? guessRows(state.rankGuess, rev, state.view, compareBy) : [];
  const reduced = rev && state.rankLocked ? reducedNote(rows, state.view, compareBy) : null;
  const ew = card?.id === 'eastwest';
  const split = ew ? 'innerhalb gleicher Wirtschaftslage' : 'in West und Ost';

  return <div className="task s05">
    <RoleBrief role="Analyst:in im Beratungsbüro" title="Treiber-Rangliste">
      <p><strong>Dein neuer Job: Analyst:in im {ROLE.office}.</strong> Der {ROLE.fund} vergibt nächstes Jahr 1,5 Millionen Euro an Projekte. Er will das Geld dorthin lenken, wo Zufriedenheit mit der Demokratie entsteht. Darum bestellt er bei euch eine Rangliste: Welche Merkmale hängen am stärksten mit der Demokratiezufriedenheit zusammen? Der Fonds nennt diese Merkmale „Treiber“.</p>
      <p>Die Daten: ALLBUS 2023, Variable <code>ps03</code> (1 = sehr zufrieden … 6 = sehr unzufrieden). Du bekommst einen Kandidaten zugelost und lieferst genau einen Eintrag. Drei Dinge musst du beachten:</p>
      <ul>
        <li>Die Rangliste soll für ganz Deutschland gelten. Im ALLBUS sind Ostdeutsche aber absichtlich überrepräsentiert: 32 % der Befragten statt rund 17 % der Bevölkerung.</li>
        <li>Es gibt nicht das eine Zusammenhangsmaß. Welches passt, hängt von deinen Variablen ab.</li>
        <li>Der Fonds fördert in West und Ost. Dein Zusammenhang sollte in beiden Landesteilen halten.</li>
      </ul>
      <p><strong>Dein Eintrag:</strong> Maß = Wert, die Richtung in Worten, dein Urteil zu West und Ost und ein Satz für den Fonds.</p>
      <p>Die Leitfrage: <strong>Was hängt mit der Zufriedenheit mit der Demokratie zusammen – und darf man es „Treiber“ nennen?</strong></p>
      <p><strong>Was du dabei lernst:</strong> das passende Zusammenhangsmaß wählen, mit Gewichten rechnen und mit einer Drittvariable prüfen, ob ein Zusammenhang hält.</p>
    </RoleBrief>
    <PartnerToggle mode={state.mode} onChange={mode => set({ mode })}
      solo="Du bist zuerst Analyst:in: Maß wählen, gewichtet rechnen, West und Ost prüfen, Satz schreiben. Dann liest du deinen Eintrag als Gegenleser:in des Fonds selbst gegen: zweites Maß, ohne Gewicht, Veto gegen „Treiber“."
      pair="A ist Analyst:in: Maß wählen, gewichtet rechnen, Satz schreiben. B ist Gegenleser:in des Fonds: prüft West und Ost, rechnet ein zweites Maß und ohne Gewicht und darf gegen das Wort „Treiber“ ein Veto einlegen. Am Ende einigt ihr euch auf einen Eintrag." />

    <Toolbox file="treiber-werkzeuge.R" code={TOOLBOX_SCRIPT} tools={[
      { fn: 'library(), read_spss(), codebook()', text: <>kennst du aus Sitzung 1: Pakete laden, Daten einlesen, im Codebuch nachsehen.</> },
      { fn: '%>%', text: <>kennst du aus Sitzung 4: Lies die Pipe als „und dann“. Vorn steht <code>allbus</code>, dahinter jeder Schritt in einer eigenen Zeile, z. B. <code>allbus %&gt;% cramers_v(…)</code>.</> },
      { fn: 'filter()', text: <>kennst du aus Sitzung 2: behält nur die Befragten, die eine Bedingung erfüllen. Steht es in der Kette vor einem Maß, rechnest du das Maß für diese Teilmenge, z. B. nur für Frauen.</> },
      { fn: 'mutate() + rec()', text: <>kennst du aus Sitzung 5: bildet neue Variablen. Links vom <code>=</code> steht der neue Name (etwa <code>gesundheit</code>), rechts <code>rec()</code> mit der alten Variable. <code>rules = "rev"</code> polt um, <code>rules = "1:2=1; 3=2; else=NA"</code> fasst Codes zusammen.</> },
      { fn: 'weights = wghtpew', isNew: true, text: <>kommt als Zusatz in die Klammern und rechnet gewichtet: Jede Person zählt so viel, dass West und Ost im selben Verhältnis stehen wie in der Bevölkerung. Fast alle mariposa-Funktionen kennen ihn, auch <code>frequency()</code>.</> },
      { fn: 'cramers_v()', isNew: true, text: <>Stärke eines Zusammenhangs aus der Kreuztabelle, von 0 bis 1, ohne Richtung. Für Kategorien ohne Reihenfolge (nominal).</> },
      { fn: 'phi()', isNew: true, text: <>wie Cramér-V, aber gedacht für zwei Variablen mit je zwei Ausprägungen (Vierfeldertafel).</> },
      { fn: 'goodman_gamma()', isNew: true, text: <>für geordnete Stufen: vergleicht Paare von Befragten – liegen sie auf beiden Variablen gleich- oder gegenläufig? Von −1 bis 1, das Vorzeichen zeigt die Richtung.</> },
      { fn: 'kendall_tau()', isNew: true, text: <>wie Gamma, zählt aber Paare mit Gleichstand (Bindungen) mit. Darum meist kleiner als Gamma.</> },
      { fn: 'spearman_rho()', isNew: true, text: <>Korrelation der Rangplätze, für geordnete Stufen. Gewichte nutzt sie nur, um Befragte auszuwählen – gewichtet und ungewichtet kommt dasselbe heraus.</> },
      { fn: 'pearson_cor()', isNew: true, text: <>für metrische Variablen: Wie eng liegen die Werte um eine steigende oder fallende Gerade? Von −1 bis 1.</> },
    ]} />
    <p className="sandbox-note"><code>cramers_v()</code>, <code>phi()</code> und <code>goodman_gamma()</code> geben nur die Zahl aus, z. B. <code>[1] 0.208698</code>. Die anderen drei schreiben sie hinter <code>tau =</code>, <code>rho =</code> oder <code>r =</code>. Die Warnung „expected count &lt; 5“ heißt: Manche Zellen der Kreuztabelle sind dünn besetzt. Für die Maße heute kannst du sie übergehen.</p>

    <section className="task-step">
      <h3>Einstieg · Eine Tabelle, vier Zusammenhangsmaße</h3>
      <StepGuide
        why="Bevor du in R rechnest: Ein Zusammenhangsmaß fasst eine ganze Kreuztabelle in einer einzigen Zahl zusammen. Hier siehst du eine echte Tabelle aus dem ALLBUS: Gesundheit und Zufriedenheit mit der Demokratie, beide in drei Stufen zusammengefasst. Du veränderst die Tabelle und siehst, wie vier Maße darauf reagieren."
        steps={[
          'Lies die Tabelle: In welchen Zellen stehen viele Befragte? Gehen gute Gesundheit und Zufriedenheit eher zusammen?',
          'Verschieb Befragte mit − und +. Wie musst du sie verteilen, damit die Maße steigen? Und wie, damit sie ins Minus gehen?',
          'Klick mehrmals auf „Spalten anders anordnen“. Welches Maß bleibt gleich, welche springen – und woran könnte das liegen?',
          'Klick auf „Zusammenhang auflösen“. Was zeigen die Maße jetzt?',
        ]}
        done="du sagen kannst, welches Maß auf die Reihenfolge der Stufen achtet und welches nicht." />
      <Board start={boardStart} />
    </section>

    <section className="task-step">
      <h3>1 · Deinen Kandidaten ziehen</h3>
      <StepGuide
        why="Du hast gesehen, wie Zusammenhangsmaße auf eine Tabelle reagieren. Jetzt geht es um die Rangliste: Jede:r im Raum liefert einen Eintrag. Deiner beginnt mit einem Kandidaten – einem Merkmal, das mit der Demokratiezufriedenheit zusammenhängen könnte."
        steps={[
          'Zieh eine Karte. Hast du eine Karte zugeteilt bekommen, wähl sie im Menü.',
          'Lies die Frage auf der Karte: Was bedeutet ein höherer Code?',
        ]}
        done="deine Karte zu sehen ist." />
      <div className="sandbox-chips">
        <button onClick={draw}><Shuffle size={14} aria-hidden="true" /> Karte ziehen</button>
        <label className="s05-pick">Oder hast du eine Karte zugeteilt bekommen?
          <select value={state.card ?? ''} onChange={e => onChange(pickCard(state, (e.target.value || null) as CardId | null))}>
            <option value="">Karte wählen</option>{CARDS.map(c => <option key={c.id} value={c.id}>{c.title}{c.joker ? ' (Joker)' : ''}</option>)}
          </select>
        </label>
      </div>
      {card && <article className="task-card s05-card">
        <h4>{card.title}{card.joker && <span className="s05-joker"> Joker</span>} <code>{card.source}</code></h4>
        <p>{card.question}</p>
        {card.joker && <p className="sandbox-note">Der Joker ist bewusst „zu gut“: Prüfe, ob er überhaupt ein eigener Kandidat ist.</p>}
      </article>}
    </section>

    {card && <>
      <section className="task-step">
        <h3>2 · Welches Zusammenhangsmaß passt?</h3>
        <StepGuide
          why="Du kennst deinen Kandidaten. Bevor du rechnest, legst du fest, womit. Welches Zusammenhangsmaß passt, hängt vom Skalenniveau beider Variablen ab."
          steps={[
            <>Lade die Daten und öffne das Codebuch. Such mit <kbd>Strg</kbd>/<kbd>Cmd</kbd> + <kbd>F</kbd> nach <code>ps03</code> und nach <code>{card.source}</code>. Welche Ausprägungen haben beide?</>,
            'Entscheide unten in drei Klicks: das Skalenniveau der Demokratiezufriedenheit, das Skalenniveau deines Kandidaten, dann das Maß. Was die Maße unterscheidet, steht auf den Karten und im Werkzeugkasten.',
          ]}
          done="ein Maß gewählt ist." />
        <MeasurePath key={card.id} card={card} outcomeLevel={state.outcomeLevel} level={state.level} measure={state.measure}
          onOutcome={outcomeLevel => set({ outcomeLevel })} onLevel={level => set({ level })} onMeasure={setMeasure} />
        <Feedback notes={fitNotes(p, card, vars, state.measure, recognised(vars, state.value))} />
      </section>

      <section className="task-step">
        <h3>3 · Gewichtet rechnen</h3>
        <StepGuide
          why="Dein Maß steht fest. Jetzt rechnest du – und zwar für Deutschland, nicht nur für die Stichprobe. Weil Ostdeutsche im ALLBUS überrepräsentiert sind, rechnest du mit dem Gewicht wghtpew."
          steps={[
            <>Pol <code>ps03</code> um, so dass ein höherer Code „zufriedener“ heißt. Nenn die neue Variable <code>zufriedenheit</code>.</>,
            card.recode ? card.recode.prep : <>Dein Kandidat <code>{card.source}</code> braucht keine Umkodierung. Fehlende Werte lässt R beim Rechnen von selbst weg.</>,
            <>Rechne dein Maß für <code>zufriedenheit</code> und {card.recode ? <code>{card.id}</code> : 'deinen Kandidaten'} – mit Gewicht. Welcher Zusatz in den Klammern rechnet gewichtet? Schau in den Werkzeugkasten.</>,
            card.high === null ? 'Trag den Wert ein. Cramér-V hat kein Vorzeichen – es zeigt nur die Stärke.' : 'Trag den Wert ein. Hat dein Maß ein Vorzeichen, lies es: Was heißt es in Worten?',
          ]}
          done="die Rückmeldung mit „Stimmt“ beginnt." />
        {!state.measure && !state.value.trim()
          ? <p className="sandbox-note">Wähl zuerst in Schritt 2 dein Maß – dann öffnet sich hier das Feld für deinen Wert.</p>
          : <>
            <label className="s04-check"><input type="checkbox" checked={state.weighted} onChange={e => set({ weighted: e.target.checked })} /> Ich rechne gewichtet (mit weights = wghtpew)</label>
            <div className="task-grid">
              <label>Welchen Wert zeigt R für {state.measure ? measureLabel(state.measure) : 'dein Maß'}?<small className="task-field-help">Für ganz Deutschland, mit der umgepolten Variable zufriedenheit. Auf drei Nachkommastellen, ein Minuszeichen mit abtippen – Komma oder Punkt geht beides</small><input type="text" inputMode="decimal" maxLength={12} value={state.value} onChange={e => set({ value: e.target.value })} /></label>
            </div>
            <Feedback notes={main} />
          </>}
        <HintLadder key={card.id} hint={{ ...hintTexts[card.level], workshop: WORKSHOP, scaffold: scaffoldFor(card), solution: `${rSetupFor(card)}\n\n${rMeasureFor(card)}` }} onConcept={onConcept} file="treiber-schritt3.R" />
      </section>

      <section className="task-step">
        <h3>4 · {ew ? 'Hält der Unterschied bei gleicher Wirtschaftslage?' : 'Hält der Zusammenhang in West und Ost?'}</h3>
        <StepGuide
          why={ew
            ? <>Du hast einen Wert für den Unterschied zwischen West und Ost. Aber im Osten wird auch die Wirtschaftslage etwas schlechter eingeschätzt. Liegt der Unterschied also am Landesteil – oder an der Wirtschaftslage? Die Wirtschaftslage ist hier eine <strong>Drittvariable</strong> (eine dritte Variable, die mit beiden zusammenhängen kann).</>
            : <>Du hast einen Wert für ganz Deutschland. Aber der Fonds fördert in West und Ost. Hält dein Zusammenhang in beiden Landesteilen? Der Landesteil ist hier eine <strong>Drittvariable</strong> (eine dritte Variable, die mit beiden zusammenhängen kann).</>}
          steps={ew ? [
            <>Fasse die Wirtschaftslage <code>ep01</code> in drei Gruppen zusammen: gut (1 und 2), teils/teils (3), schlecht (4 und 5). Nenn die neue Variable <code>lage</code>.</>,
            <>Bilde für jede Gruppe eine Teilmenge und rechne darin Gamma für <code>zufriedenheit</code> und <code>eastwest</code>. Gamma zeigt die Richtung – anders als Cramér-V. Das geht, weil <code>eastwest</code> nur zwei Ausprägungen hat: Da gibt es keine falsche Reihenfolge.</>,
            'Rechne zum Vergleich Gamma auch für ganz Deutschland (gewichtet, wie in Schritt 3). Liegen die drei Werte in der Nähe? Dann wähl dein Urteil.',
          ] : [
            'Teile die Befragten in zwei Teilmengen: nur West und nur Ost. Welches Werkzeug behält nur bestimmte Befragte?',
            'Rechne in beiden Teilmengen dasselbe Maß wie in Schritt 3. Innerhalb eines Landesteils ändert das Gewicht fast nichts – mit oder ohne geht beides.',
            'Vergleiche die beiden Werte mit deinem Wert für ganz Deutschland. Dann wähl dein Urteil.',
          ]}
          done="alle Teilwerte grün bestätigt sind und dein Urteil steht." />
        <div className="task-grid">
          {groups.map((g, i) => <label key={g.label}>{stratumQuestion(card.id, state.measure, g.label)}<small className="task-field-help">{stratumHelp(card.id, i, g.label)}</small><input type="text" inputMode="decimal" maxLength={12} value={state.strata[i] ?? ''}
            onChange={e => set({ strata: state.strata.map((v, k) => (k === i ? e.target.value : v)) })} /></label>)}
        </div>
        <Feedback notes={checkStrata(p, card, vars, state.measure, state.strata.slice(0, groups.length))} />
        <p className="task-prompt">{ew
          ? 'Was passiert mit dem Unterschied zwischen West und Ost innerhalb gleicher Wirtschaftslage? Wähl dein Urteil.'
          : 'Was passiert mit dem Zusammenhang, wenn du West und Ost getrennt rechnest? Wähl dein Urteil.'}</p>
        <div className="sandbox-chips" role="group" aria-label="Urteil">
          {STAMPS.map(s => <button key={s} aria-pressed={state.stamp === s} onClick={() => set({ stamp: s })}>{s}</button>)}
        </div>
        <Feedback notes={state.stamp && !strataDone
          ? [{ tone: 'hint', text: `Trag zuerst die Werte für ${groups.map(g => g.label).join(' und ')} ein – dann nenne ich meine Lesart nach der offengelegten Regel.` }]
          : checkStamp(p, card, vars, state.measure, state.stamp, state.strata.slice(0, groups.length))} />
        <details className="s05-rule"><summary>Nach welcher Regel liest die Rückmeldung?</summary><p>{stampRule(card)}</p></details>
        <HintLadder key={`split-${card.id}`} hint={{ ...(ew ? splitHints.economy : splitHints.regions), workshop: WORKSHOP, scaffold: splitScaffoldFor(card), solution: rSplitFor(card) }} onConcept={onConcept} file="treiber-schritt4.R" />
      </section>

      <section className="task-step">
        <h3>5 · Dein Satz für den Fonds</h3>
        <StepGuide
          why={`Du weißt jetzt drei Dinge: wie stark der Zusammenhang ist, in welche Richtung er zeigt und ob er ${split} hält. Das fasst du für den Fonds in einem Satz zusammen.`}
          steps={[
            'Nenn dein Maß und den Wert: Maß = Wert.',
            card.high === null ? 'Beschreib in Worten, wie stark der Zusammenhang ist. Eine Richtung gibt es bei Kategorien ohne Reihenfolge nicht.' : 'Beschreib die Richtung in Worten: Wer …, ist eher zufriedener oder unzufriedener mit der Demokratie?',
            `Nenn dein Urteil aus Schritt 4: Hält der Zusammenhang ${split}?`,
          ]}
          done="dein Satz steht." />
        <TextAnswer id="s05-sentence" maxLength={600} size="long" label="Was schreibst du dem Fonds in einem Satz?"
          help={`Maß = Wert, Richtung in Worten, dein Urteil ${split}`} value={state.sentence} onChange={sentence => set({ sentence })}
          example={ew
            ? 'Maß = Wert: Wer …, ist eher … mit der Demokratie – auch innerhalb gleicher Wirtschaftslage … (trägt / schrumpft / …).'
            : 'Maß = Wert: Wer …, ist eher … mit der Demokratie – in West und Ost … (trägt / schrumpft / …).'} />
        <Feedback notes={driverQuestion(state.sentence)} />
      </section>

      <section className="task-step">
        <h3>6 · Gegenlesen: Wie fest steht dein Wert?</h3>
        <StepGuide
          why="Bevor dein Eintrag in die Rangliste geht, liest ihn jemand vom Fonds gegen. Kommt mit einem anderen Maß dasselbe heraus? Was ändert das Gewicht? Und trägt das Wort „Treiber“?"
          steps={[
            card.level === 'nominal' && !ew
              ? 'Wähl ein zweites Zusammenhangsmaß und rechne es gewichtet. Für Kategorien ohne Reihenfolge bleibt außer Cramér-V nur Phi – gedacht für Vierfeldertafeln. Rechne es trotzdem: Was zeigt der Vergleich?'
              : 'Wähl ein zweites Zusammenhangsmaß und rechne es gewichtet. Am besten eines, das auch zu deinem Skalenniveau passt.',
            'Rechne dein erstes Maß noch einmal ohne Gewicht. Wie stark weicht es ab?',
            'Ein Zusammenhangsmaß zeigt, dass zwei Merkmale gemeinsam auftreten – nicht, was was bewirkt. Passt das Wort „Treiber“ für deinen Kandidaten? Wenn nicht, setz das Veto.',
          ]}
          done="beide Werte grün bestätigt sind und du über das Veto entschieden hast." />
        <div className="task-grid">
          <label>Welches zweite Maß rechnest du zum Vergleich?<small className="task-field-help">Ein anderes Zusammenhangsmaß als in Schritt 2</small><select value={state.second.measure} onChange={e => setSecond({ measure: e.target.value as MeasureId | '' })}>
            <option value="">Maß wählen</option>{MEASURE_IDS.filter(m => m !== state.measure).map(m => <option key={m} value={m}>{measureLabel(m)}</option>)}
          </select></label>
          <label>Welchen Wert hat dieses zweite Maß?<small className="task-field-help">Gewichtet, für ganz Deutschland – drei Nachkommastellen, ein Minuszeichen mit abtippen</small><input type="text" inputMode="decimal" maxLength={12} value={state.second.value} onChange={e => setSecond({ value: e.target.value })} /></label>
          <label>Welchen Wert hat dein erstes Maß ohne Gewicht?<small className="task-field-help">Dasselbe Maß wie in Schritt 3, nur ohne Gewicht – drei Nachkommastellen</small><input type="text" inputMode="decimal" maxLength={12} value={state.second.unweighted} onChange={e => setSecond({ unweighted: e.target.value })} /></label>
        </div>
        <Feedback notes={[
          ...checkEntry(p, card, vars, { measure: state.second.measure, weighted: true, value: state.second.value }),
          ...checkEntry(p, card, vars, { measure: state.measure, weighted: false, value: state.second.unweighted }),
          ...fitNotes(p, card, vars, state.second.measure, recognised(vars, state.second.value)),
        ]} />
        <label className="s04-check"><input type="checkbox" checked={state.second.veto} onChange={e => setSecond({ veto: e.target.checked })} /> Veto: Das Wort „Treiber“ passt für meinen Kandidaten nicht</label>
        <HintLadder key={`check-${card.id}`} hint={{ ...checkHint, workshop: WORKSHOP, scaffold: checkCodeFor(card, state.measure, state.second.measure, true), solution: checkCodeFor(card, state.measure, state.second.measure, false) }} onConcept={onConcept} file="treiber-schritt6.R" />
      </section>

      <section className="task-step">
        <h3>7 · Dein Tipp: Wer steht oben?</h3>
        <StepGuide
          why="Dein Eintrag ist fertig. Gleich siehst du die Rangliste aller Kandidaten. Leg dich vorher fest – nur so merkst du, was dich überrascht."
          steps={[
            'Sortiere die Karten: stärkster Zusammenhang mit der Demokratiezufriedenheit oben. Verschieb sie mit ↑ und ↓ oder zieh sie mit der Maus.',
            'Gib deinen Tipp ab. Danach ist er fest, und die Rangliste erscheint.',
          ]}
          done="dein Tipp abgegeben ist." />
        {!rev && <p className="sandbox-note">Dein Tipp öffnet sich, sobald Schritt 3 bis 5 ausgefüllt sind: dein Wert, die Teilwerte, dein Urteil und dein Satz.</p>}
        {rev && !state.rankLocked && <>
          <p className="task-prompt">Welche Kandidaten hängen am stärksten mit der Demokratiezufriedenheit zusammen? Sortiere die Karten: stärkster Zusammenhang oben.</p>
          <p className="task-field-help" style={{ margin: '0 0 8px' }}>Mit ↑ und ↓ verschieben oder die Karte ziehen. Erst nach dem Tipp siehst du die Rangliste.</p>
          <RankGuess order={order} own={card.id} locked={false} onMove={(from, to) => set({ rankGuess: moveGuess(order, from, to) })} />
          <button className="primary" onClick={() => set({ rankGuess: order, rankLocked: true })}>Tipp abgeben</button>
        </>}
        {rev && state.rankLocked && <p className="sandbox-note">Tipp abgegeben. Im nächsten Schritt steht er neben der echten Rangliste.</p>}
      </section>

      {rev && state.rankLocked && <section className="task-step">
        <h3>8 · Die Rangliste nach vier Zusammenhangsmaßen</h3>
        <StepGuide
          why="Hier stehen alle Kandidaten, berechnet aus deiner Datei mit vier Zusammenhangsmaßen. Jetzt siehst du, wie gut dein Tipp war – und wie sehr die Rangliste vom Maß abhängt."
          steps={[
            'Vergleiche deinen Tipp zuerst mit deinem eigenen Maß. Dann schalte auf die anderen Maße um: Welche Karten springen?',
            'Schalte die Ansicht um: ohne Gewicht, nur West, nur Ost. Wo ändert sich die Rangliste am stärksten?',
          ]}
          done="du weißt, welche Karte dich am meisten überrascht hat." />
        <p className="task-prompt">Welche Rangliste willst du sehen? Klick zum Umschalten.</p>
        <div className="sandbox-chips" role="group" aria-label="Ansicht">
          {VIEWS.map(v => <button key={v} aria-pressed={state.view === v} onClick={() => set({ view: v })}>{VIEW_LABELS[v]}</button>)}
        </div>
        <p className="task-prompt">Womit vergleichst du deinen Tipp? Zuerst steht dein eigenes Maß.</p>
        <div className="sandbox-chips" role="group" aria-label="Vergleich nach Maß">
          {CURRENCIES.map(m => <button key={m} aria-pressed={compareBy === m} onClick={() => setCompareChoice(m)}>{measureLabel(m)}</button>)}
        </div>
        {(state.measure === 'phi' || state.measure === 'rho') && <p className="sandbox-note">Dein Maß {measureLabel(state.measure)} ist hier nicht dabei. {state.measure === 'phi' ? 'Cramér-V nutzt dieselbe Information (die Kreuztabelle).' : 'Tau-b nutzt dieselbe Information (die Rangfolge).'}</p>}
        {reduced && <p className="sandbox-note" role="status">{reduced}</p>}
        <RankGuess order={state.rankGuess} own={card.id} locked rows={rows} measure={measureLabel(compareBy)} view={state.view} onMove={() => {}} />
        <Feedback notes={compareRankGuess(state.rankGuess, rev, state.view, compareBy)} />
        <p>So stehen alle Kandidaten da – jede Spalte ist ein anderes Zusammenhangsmaß. Deine Karte ist hervorgehoben.</p>
        <p className="sandbox-note">Cramér-V hat kein Vorzeichen (0 bis 1); Gamma, Tau-b und r zeigen die Richtung. Die Plätze richten sich nach dem Betrag.</p>
        <RankChart data={rev} view={state.view} own={card.id} />
        <ul className="s05-notes">{revealNotes(rev, state.view).map(n => <li key={n}>{n}</li>)}</ul>
      </section>}

      {rev && (state.rankLocked || state.recommendation.trim()) && <section className="task-step">
        <h3>9 · Deine Empfehlung an den Fonds</h3>
        <StepGuide
          why="Du hast gesehen: Die Rangliste hängt vom Maß ab, vom Gewicht und vom Landesteil. Jetzt berätst du den Fonds."
          steps={[
            'Wie sieht eine faire Rangliste aus: mit welchem Maß, mit oder ohne Gewicht?',
            'Passt das Wort „Treiber“? Was zeigt ein Zusammenhangsmaß – und was nicht?',
          ]}
          done="deine Empfehlung steht." />
        <TextAnswer id="s05-rec" maxLength={800} size="long" label="Was empfiehlst du dem Fonds: Wie sieht eine faire Rangliste aus – und passt das Wort „Treiber“?"
          help="Zwei bis drei Sätze: erst die Rangliste (Maß, Gewicht), dann das Wort „Treiber“"
          example="Eine faire Rangliste nutzt …, und zwar … gewichtet, weil … Das Wort „Treiber“ passt (nicht), denn ein Zusammenhangsmaß zeigt …"
          value={state.recommendation} onChange={recommendation => set({ recommendation })} />
        <p className="s02-takeaway"><strong>Das Wichtigste aus dieser Sitzung:</strong> Welches Zusammenhangsmaß passt, hängt vom Skalenniveau ab – und schon die Rangliste hängt vom Maß ab. Das Gewicht macht aus der Stichprobe ein Bild von Deutschland. Und ein Zusammenhang ist noch kein „Treiber“: Mit einer Drittvariable prüfst du, ob er hält.</p>
      </section>}
    </>}

    <PlenumCard title="Treiber-Rangliste" lines={plenumLines(state)} file="treiber-plenum.md" />
    {card && statusS05(state) === 'done' && <details className="s02-solution"><summary>Ein vollständiges R-Skript zum Mitnehmen</summary><RBlock code={rCodeFor(card)} file="treiber.R" /></details>}
  </div>;
}
