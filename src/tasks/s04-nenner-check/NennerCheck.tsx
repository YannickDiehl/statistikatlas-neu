import { useMemo } from 'react';
import { Feedback } from '../kit/Feedback';
import { HintLadder } from '../kit/HintLadder';
import { parseNumber } from '../kit/numbers';
import { PartnerToggle } from '../kit/PartnerToggle';
import { PlenumCard } from '../kit/PlenumCard';
import { RBlock } from '../kit/RBlock';
import { RoleBrief } from '../kit/RoleBrief';
import { StepGuide } from '../kit/StepGuide';
import { Toolbox } from '../kit/Toolbox';
import type { TaskProps } from '../types';
import { BaseTable, DenominatorBars, ReadingStrip } from './Charts';
import { Zuschnitt } from './Zuschnitt';
import { CAUSES, CAUSES_P1, CLAIMED, hints, ITEM_IDS, ITEMS, NONVOTE_EXTRAS, PRESS_RELEASE, R_SOLUTION, TOOLBOX_SCRIPT, type ItemId } from './content';
import {
  allTables, checkExtra, checkP1, checkP2, checkP3, checkSentence, CLAIM_AREA, compareBase, declaredWay, denominators,
  fourfold, percent, plenumLines, PARTY, prepare, questions, rCodeFor, readings, shortcut, statusS04, stairs, VERDICTS, type S04State,
} from './domain';
import { TextAnswer } from '../kit/TextAnswer';

const gapInput = { width: '5.5em', font: 'inherit', textAlign: 'right', border: '1px solid var(--line)', borderBottom: '2px solid #1f3f8f', borderRadius: 5, padding: '0 6px' } as const;

export function NennerCheck({ data, state, onChange, onConcept }: TaskProps<S04State>) {
  const set = (patch: Partial<S04State>) => onChange({ ...state, ...patch });
  const joint = useMemo(() => prepare(data.sav), [data.sav]);
  const tables = useMemo(() => allTables(joint), [joint]);
  const p1 = checkP1(tables, joint, state.p1.pct, state.p1.n);
  const p2 = checkP2(tables, joint, state.p2);
  const p3 = checkP3(tables, joint, state.p3);
  const way = declaredWay(state.p3);
  const p3ok = p3.some(n => n.tone === 'ok');
  const own = p3ok ? (() => { const t = fourfold(joint, way); return { way, distrusting: percent(t, 'a', 'row'), others: percent(t, 'c', 'row') }; })() : null;
  const setP3 = (patch: Partial<S04State['p3']>) => set({ p3: { ...state.p3, ...patch } });
  const item = ITEMS[state.p3.item];
  const p1ok = p1.some(n => n.tone === 'ok');
  // Erst festlegen, dann rechnen: Prüfauftrag 1 öffnet sich nach dem Tipp. Gespeicherte Eingaben bleiben sichtbar.
  const p1Open = state.baseLocked || Boolean(state.p1.pct.trim() || state.p1.n.trim());
  const revealed = p1ok && state.baseLocked && state.baseGuess !== null;
  // Prüfauftrag 2 verrät, wer bei den 87 % 100 % ist – darum erst nach dem Tipp (in Partnerarbeit rechnet B ihn parallel zu Prüfauftrag 1).
  const p2Open = state.baseLocked || Boolean(state.p2.rowDistrust.trim() || state.p2.rowOthers.trim() || state.p2.total.trim());
  const setFact = (patch: Partial<S04State['fact']>) => set({ fact: { ...state.fact, ...patch } });
  const toggle = (list: number[], code: number) => (list.includes(code) ? list.filter(c => c !== code) : [...list, code]);
  const extra = checkExtra(data.sav, state.extra);

  return <div className="task s04">
    <RoleBrief role="Faktenchecker:in" title="Prozentbasis-Check">
      <p>Du arbeitest in der Faktencheck-Redaktion „Nachgezählt“. Auf deinem Tisch liegt die Pressemitteilung eines Parteivorstands:</p>
      <figure className="sandbox-quote"><blockquote>{PRESS_RELEASE}</blockquote></figure>
      <p>Die Chefredaktion will bis zur Konferenz zwei Dinge wissen: <strong>Stimmt die Zahl? Und trägt sie die Behauptung?</strong> Du rechnest in RStudio nach und trägst hier deine Ergebnisse ein. Am Ende fällst du ein Urteil und schreibst einen Faktencheck-Satz mit zwei Zahlen.</p>
      <p>Die Leitfrage für alle Schritte: <strong>Gehen Menschen, die Politikern misstrauen, wirklich nicht mehr wählen?</strong></p>
      <p><strong>Was du dabei lernst:</strong> Kreuztabellen lesen, die passende Prozentbasis wählen (Zeilen-, Spalten- oder Gesamtprozente) und Variablen umkodieren und umpolen.</p>
    </RoleBrief>
    <PartnerToggle mode={state.mode} onChange={mode => set({ mode })}
      solo="Du gehst alle Schritte allein durch. Am Ende zeigt dir ein Streifen, wie andere Lesarten ausfallen. Die Gegenfragen nach deinem Urteil ersetzen das Gespräch."
      pair="Ihr gebt beide zuerst euren Tipp ab. Dann rechnet A Prüfauftrag 1 (die Zahl der Pressemitteilung), B gleichzeitig Prüfauftrag 2 (dieselbe Tabelle, andere Prozentbasis). Vergleicht danach: Steht bei euch dieselbe Anzahl Befragter in der Zelle „misstraut“ / „würde nicht wählen“? In Prüfauftrag 3 wählt jede und jeder eine eigene Lesart – die zwei müssen sich in mindestens einer Entscheidung unterscheiden. Am Ende schreibt ihr einen gemeinsamen Satz oder haltet fest, worin ihr uneins seid." />

    <Toolbox file="prozentbasis-werkzeuge.R" code={TOOLBOX_SCRIPT} tools={[
      { fn: 'library(), read_spss(), %>%, codebook()', text: <>kennst du aus Sitzung 1 und 4: Pakete laden, Daten einlesen, den Datensatz mit der Pipe an die nächste Funktion weiterreichen („und dann“), im Codebuch nachsehen (mit <kbd>Strg</kbd>/<kbd>Cmd</kbd> + <kbd>F</kbd> suchen).</> },
      { fn: 'frequency(), describe()', text: <>kennst du aus Sitzung 3: zählen aus, wie oft jeder Code vorkommt, und fassen eine Variable in Kennzahlen zusammen. Mit <code>frequency()</code> prüfst du nach dem Umkodieren, ob die neuen Gruppen stimmen.</> },
      { fn: 'mutate()', isNew: true, text: <>legt neue Variablen an: Links vom <code>=</code> steht der neue Name, rechts, wie sie entsteht – meist mit <code>rec()</code> oder einer Rechnung wie <code>age / 10</code>; mit <code>allbus &lt;- allbus %&gt;% mutate(…)</code> kommen sie in den Datensatz, die alten Variablen bleiben.</> },
      { fn: 'rec()', isNew: true, text: <>kodiert um: fasst alte Codes zu neuen Gruppen zusammen. In <code>rules</code> steht „alt=neu“, etwa <code>"4:5=1"</code> (4 bis 5 werden zu 1), dahinter in eckigen Klammern das Wertelabel; <code>else=NA</code> macht alles Übrige zu NA. Eine Variable mit nur 0 und 1 heißt Dummyvariable.</> },
      { fn: 'rec(…, rules = "rev")', isNew: true, text: <>polt um: dreht die Skala, sodass die erste Stufe zur letzten wird und umgekehrt.</> },
      { fn: 'crosstab()', isNew: true, text: <>baut eine Kreuztabelle: Wie viele Befragte stehen in jeder Kombination zweier Variablen? Zuerst kommt die Zeilen-, dann die Spaltenvariable. <code>percentages</code> legt die Prozentbasis fest: <code>"row"</code> – jede Zeile ist 100 %, <code>"col"</code> – jede Spalte, <code>"total"</code> – die ganze Tabelle, <code>"all"</code> zeigt alle drei.</> },
      { fn: 'untag_na()', isNew: true, text: <>holt die Codes fehlender Werte (etwa −8 „weiß nicht“) als normale Zahlen zurück. Erst dann kann <code>rec()</code> sie umkodieren. Danach zählen alle Codes als gültig – schreib darum <code>else=NA</code> dazu. Sie steht in der Kette vor <code>mutate()</code>.</> },
      { fn: 'row_sums()', isNew: true, text: <>für den Zusatz: zählt mehrere Variablen innerhalb einer Person zusammen, zum Beispiel wie viele ihrer Dummyvariablen 1 sind. In <code>mutate()</code> wählst du sie mit <code>pick()</code> aus; <code>min_valid</code> sagt, wie viele davon beantwortet sein müssen.</> },
    ]} />

    <section className="task-step">
      <h3>Einstieg · Die Tabelle selbst zuschneiden</h3>
      <StepGuide
        why="Bevor du in R rechnest: Hinter jeder Kreuztabelle stecken Entscheidungen. Hier siehst du die ganze Tabelle mit allen Codes – auch mit den fehlenden Werten. Du entscheidest selbst, wer als misstrauend zählt, wer als Nichtwähler:in und wer herausfällt."
        steps={[
          'Klick die Zeilenköpfe an: Welche Antworten auf pe01 bedeuten für dich Misstrauen, welche nicht – und welche lässt du ganz weg?',
          'Klick die Spaltenköpfe an: Wer wählt nicht, wer wählt, wer fällt heraus? Überleg bei jedem fehlenden Wert, warum du so entscheidest – etwa bei „weiß nicht“ oder „nicht wahlberechtigt“.',
          'Wähl rechts, wer 100 % ist, und beobachte, wie sich die Zahl verändert. Probier danach eine andere Einteilung.',
        ]}
        done="du eine Einteilung begründen kannst und weißt, welche Entscheidung die Zahl am stärksten verändert." />
      <Zuschnitt sav={data.sav} />
    </section>

    <section className="task-step">
      <h3>Vorab · Wer ist 100 %?</h3>
      <StepGuide
        why={<>Bevor du rechnest, legst du fest, wie du die Zahl liest. „87 Prozent der Nichtwähler“ ist ein Anteil. Jeder Anteil hat eine Prozentbasis: die Gruppe, die 100 % ist.</>}
        steps={[
          'Lies die Pressemitteilung noch einmal genau: Von welcher Gruppe sind es 87 Prozent?',
          <>Die Tabelle unten ist so aufgebaut wie die Kreuztabelle, die du gleich in R baust. Die {CLAIMED} % stehen in der Zelle „misstraut“ / „würde nicht wählen“.</>,
          'Klick an, wer 100 % ist: eine Zeile, eine Spalte oder die ganze Tabelle. Dann gib deinen Tipp ab.',
        ]}
        done="dein Tipp abgegeben ist. Ob er stimmt, siehst du in Prüfauftrag 1." />
      {!state.baseLocked && <p className="task-prompt">Wer ist bei den {CLAIMED} % 100 %? Zeig auf eine Zeile, eine Spalte oder „ganze Tabelle“ und klick sie an.</p>}
      <BaseTable pick={state.baseGuess} locked={state.baseLocked} claimed={CLAIMED} onPick={baseGuess => set({ baseGuess })} />
      {!state.baseLocked
        ? <button className="primary" disabled={state.baseGuess === null} onClick={() => set({ baseLocked: true })}>Tipp abgeben</button>
        : <p className="sandbox-note">Tipp abgegeben.{revealed
          ? ' Die Auflösung steht unten in Prüfauftrag 1.'
          : <> Jetzt rechnest du in Prüfauftrag 1 nach. <button className="sandbox-link" onClick={() => set({ baseLocked: false })}>Neu tippen</button></>}</p>}
    </section>

    <section className="task-step">
      <h3>Prüfauftrag 1 · Zahl nachbauen</h3>
      {!p1Open
        ? <p className="sandbox-note">Gib zuerst oben deinen Tipp ab: Wer ist bei den {CLAIMED} % 100 %? Dann geht es hier weiter.</p>
        : <>
          <StepGuide
            why="Dein Tipp steht. Jetzt prüfst du, ob die Zahl überhaupt stimmt. Dafür baust du die Tabelle des Parteivorstands in R nach."
            steps={[
              <>Sieh im Codebuch nach, wie das Item <code>pe01</code> („Die Politiker kümmern sich nicht viel darum, was Leute wie ich denken“) und die Wahlabsicht <code>pv01</code> kodiert sind. Welche Codes heißen Zustimmung? Welcher Code heißt „würde nicht wählen“?</>,
              <>Der Parteivorstand kennt je Variable nur zwei Gruppen. Mach aus beiden Variablen Dummyvariablen (nur 0 und 1): Bei <code>pe01</code> heißt 1 „misstraut“ (stimmt voll oder eher zu), 0 die übrigen Antworten. Bei <code>pv01</code> heißt 1 „würde nicht wählen“, 0 „nennt eine Partei“. Alles andere wird NA. Welches Werkzeug fasst Codes zusammen?</>,
              'Lass dir die Kreuztabelle zeigen: Misstrauen in den Zeilen, Nichtwahl in den Spalten. Welche Prozentbasis brauchst du, damit die 87 % herauskommen?',
              'Trag den Prozentwert und die Anzahl der Befragten aus derselben Zelle ein.',
            ]}
            done="beide Zahlen grün bestätigt sind. Dann siehst du, ob dein Tipp stimmt." />
          <div className="task-grid">
            <label>Welcher Prozentwert steht in deiner Tabelle bei „misstraut“ und „würde nicht wählen“?<small className="task-field-help">Der Prozentwert in dieser Zelle – Komma oder Punkt geht beides</small><input type="text" inputMode="decimal" maxLength={12} value={state.p1.pct} onChange={e => set({ p1: { ...state.p1, pct: e.target.value } })} /></label>
            <label>Wie viele Befragte stehen in derselben Zelle?<small className="task-field-help">Die Anzahl oben in der Zelle – nicht die Summe in der Zeile oder Spalte „Total“</small><input type="text" inputMode="numeric" maxLength={12} value={state.p1.n} onChange={e => set({ p1: { ...state.p1, n: e.target.value } })} /></label>
          </div>
          <Feedback notes={p1} />
          {revealed && <>
            <p className="task-prompt">Dein Tipp vom Anfang – und wer in der Pressemitteilung wirklich 100 % ist:</p>
            <BaseTable pick={state.baseGuess} locked actual={CLAIM_AREA} claimed={CLAIMED} />
            <Feedback notes={compareBase(state.baseGuess!)} />
          </>}
          {p1ok && !state.baseLocked && <p className="sandbox-note">Gib oben unter „Vorab“ noch deinen Tipp ab: Wer ist 100 %? Dann vergleichen wir ihn hier mit der Pressemitteilung.</p>}
          <details className="s04-causes"><summary>Mein R-Ergebnis sieht anders aus</summary><ul>{CAUSES_P1.map(c => <li key={c}>{c}</li>)}</ul></details>
          <HintLadder hint={hints.p1} onConcept={onConcept} file="prozentbasis-p1.R" />
        </>}
    </section>

    <section className="task-step">
      <h3>Prüfauftrag 2 · Eine Zelle, drei Prozentbasen</h3>
      {!p2Open
        ? <p className="sandbox-note">Gib zuerst oben deinen Tipp ab: Wer ist bei den {CLAIMED} % 100 %? Dann geht es hier weiter.</p>
        : <>
      <StepGuide
        why={<>{p1ok ? 'Die Zahl stimmt' : 'Ob die Zahl stimmt, zeigt Prüfauftrag 1'} – aber bei den {CLAIMED} % sind die Nichtwählenden 100 %. Die Behauptung „Wer Politikern misstraut, geht gar nicht mehr wählen“ spricht dagegen über die Misstrauenden. Also drehst du die Prozentbasis: Jetzt sollen die Misstrauenden 100 % sein.</>}
        steps={[
          'Lass dir dieselbe Tabelle noch einmal zeigen, diesmal mit allen drei Prozentangaben: Zeilen-, Spalten- und Gesamtprozente.',
          'Bleib in der Spalte „würde nicht wählen“. Wie viel Prozent der Misstrauenden stehen dort? Wie viel Prozent der Übrigen? Prozentbasis ist jeweils die eigene Zeile.',
          'Lies in der Zelle „misstraut“ / „würde nicht wählen“ auch ab, wie viel Prozent aller Befragten der Tabelle dort stehen.',
          'Vergleiche: Dieselben Befragten – und drei verschiedene Prozentzahlen.',
        ]}
        done="alle drei Zahlen grün sind. Dann erscheint ein Bild mit den drei Prozentbasen." />
      <div className="task-grid">
        <label>Wie viel Prozent der Misstrauenden wollen nicht wählen?<small className="task-field-help">Zelle „misstraut“ / „würde nicht wählen“. Prozentbasis: alle Misstrauenden = 100 %</small><input type="text" inputMode="decimal" maxLength={12} value={state.p2.rowDistrust} onChange={e => set({ p2: { ...state.p2, rowDistrust: e.target.value } })} /></label>
        <label>Wie viel Prozent der Übrigen wollen nicht wählen?<small className="task-field-help">Übrige = „misstraut nicht“. Zelle „misstraut nicht“ / „würde nicht wählen“. Prozentbasis: alle Übrigen = 100 %</small><input type="text" inputMode="decimal" maxLength={12} value={state.p2.rowOthers} onChange={e => set({ p2: { ...state.p2, rowOthers: e.target.value } })} /></label>
        <label>Wie viel Prozent aller Befragten stehen in der Zelle „misstraut“ / „würde nicht wählen“?<small className="task-field-help">Prozentbasis: alle Befragten in der Tabelle = 100 %</small><input type="text" inputMode="decimal" maxLength={12} value={state.p2.total} onChange={e => set({ p2: { ...state.p2, total: e.target.value } })} /></label>
      </div>
      <Feedback notes={p2} />
      {p2.length === 3 && p2.every(n => n.tone === 'ok') && <DenominatorBars {...denominators(joint)} />}
      <HintLadder hint={hints.p2} onConcept={onConcept} />
      </>}
    </section>

    <section className="task-step">
      <h3>Prüfauftrag 3 · Deine Lesart</h3>
      <StepGuide
        why="Mit den Misstrauenden als 100 % sieht die Zahl ganz anders aus. Doch auch die Tabelle selbst beruht auf Entscheidungen des Parteivorstands: welches Item Misstrauen misst, welche Antworten als Misstrauen zählen und was als Nichtwahl gilt. Hält das Ergebnis, wenn du anders entscheidest?"
        steps={[
          <>Wähl das Item, mit dem du Misstrauen misst. Achtung: Bei <code>pe05</code> heißt Zustimmung Vertrauen – dort ist Ablehnung das Misstrauen.</>,
          'Klick an, welche Antworten bei dir als Misstrauen zählen und ob fehlende Werte der Wahlabsicht (etwa „weiß nicht“) als Nichtwahl zählen. Mindestens eine Entscheidung muss anders sein als beim Parteivorstand.',
          'Bilde in R neue Dummyvariablen für deine Lesart. Ein fehlender Wert wie −8 lässt sich erst umkodieren, wenn du ihn als Code zurückgeholt hast (Werkzeugkasten).',
          'Lass dir die Kreuztabelle so zeigen, dass die Misstrauenden 100 % sind, und trag die drei Zahlen ein.',
        ]}
        done="deine Zahlen grün sind. Dann siehst du deine Lesart neben 18 anderen." />
      <div className="task-grid">
        <label>Mit welchem Item misst du Misstrauen?<small className="task-field-help">Das Item, nach dem du die Befragten einteilst</small><select value={state.p3.item} onChange={e => { const id = e.target.value as ItemId; setP3({ item: id, distrust: ITEMS[id].wide }); }}>
          {ITEM_IDS.map(id => <option key={id} value={id}>{id} · {ITEMS[id].title}</option>)}
        </select></label>
      </div>
      <p className="sandbox-note">{item.statement}</p>
      <p className="task-prompt">Welche Antworten zählen bei dir als Misstrauen? Klick zum Umschalten.</p>
      <div className="sandbox-chips" role="group" aria-label="Als Misstrauen zählt">
        {item.categories.map(c => <button key={c.code} aria-pressed={state.p3.distrust.includes(c.code)} onClick={() => setP3({ distrust: toggle(state.p3.distrust, c.code) })}>{c.code} {c.label}</button>)}
      </div>
      <p className="task-prompt">Welche fehlenden Werte der Wahlabsicht zählen außerdem als Nichtwahl? 91 „würde nicht wählen“ zählt immer. Klick zum Umschalten.</p>
      <div className="sandbox-chips" role="group" aria-label="Als Nichtwahl zählt außerdem">
        {NONVOTE_EXTRAS.map(e => <button key={e.code} aria-pressed={state.p3.nonvote.includes(e.code)} onClick={() => setP3({ nonvote: toggle(state.p3.nonvote, e.code) })}>{e.code} {e.label}</button>)}
      </div>
      {/* Gewichte kommen erst in Sitzung 6. Der Schalter bleibt nur für ältere Speicherstände, die gewichtet gerechnet haben – zum Abschalten. */}
      {state.p3.weighted && <label className="s04-check"><input type="checkbox" checked onChange={() => setP3({ weighted: false })} /> Ich rechne gewichtet (mit wghtpew) – Gewichte kommen erst in Sitzung 6</label>}
      {state.p3.distrust.length > 0 && <p className="sandbox-note">Deine Lesart: <strong>{shortcut(way)}</strong> – als Misstrauen zählen diese Codes von {state.p3.item}, als Nichtwahl diese Codes von pv01.</p>}
      <div className="task-grid">
        <label>Wie viel Prozent der Misstrauenden wollen nicht wählen – in deiner Lesart?<small className="task-field-help">Aus deiner neuen Tabelle: Zelle „misstraut“ / „würde nicht wählen“. Prozentbasis: alle Misstrauenden = 100 %</small><input type="text" inputMode="decimal" maxLength={12} value={state.p3.rowDistrust} onChange={e => setP3({ rowDistrust: e.target.value })} /></label>
        <label>Wie viel Prozent der Übrigen wollen nicht wählen – in deiner Lesart?<small className="task-field-help">Zelle „misstraut nicht“ / „würde nicht wählen“. Prozentbasis: alle Übrigen = 100 %</small><input type="text" inputMode="decimal" maxLength={12} value={state.p3.rowOthers} onChange={e => setP3({ rowOthers: e.target.value })} /></label>
        <label>Wie viele Befragte stehen in der Zelle „misstraut“ / „würde nicht wählen“?<small className="task-field-help">Die Anzahl oben in der Zelle{state.p3.weighted ? '. Gewichtet: auf ganze Befragte gerundet' : ''}</small><input type="text" inputMode="numeric" maxLength={12} value={state.p3.n} onChange={e => setP3({ n: e.target.value })} /></label>
      </div>
      <Feedback notes={p3} />
      <details className="s04-causes"><summary>Mein R-Ergebnis sieht anders aus</summary><ul>{CAUSES.map(c => <li key={c}>{c}</li>)}</ul></details>
      {own && <ReadingStrip readings={readings(joint)} own={own} claimed={CLAIMED} />}
      <HintLadder hint={{ ...hints.p3, solution: state.p3.distrust.length ? rCodeFor(way) : hints.p3.solution }} onConcept={onConcept} file="prozentbasis-p3.R" />
    </section>

    <section className="task-step">
      <h3>Urteil und Faktencheck-Satz</h3>
      <StepGuide
        why="Du hast jetzt die Zahl des Parteivorstands, dieselbe Tabelle mit anderer Prozentbasis und deine eigene Lesart. Damit kannst du der Chefredaktion antworten: Trägt die Zahl die Behauptung?"
        steps={[
          'Wähl ein Urteil und begründe es mit deinen Zahlen aus den Prüfaufträgen.',
          'Wähl die Lesart für deinen Faktencheck-Satz und trag die zwei Zahlen in die Lücken ein. Prozentbasis sind die Misstrauenden bzw. die Übrigen.',
          'Lies die Gegenfragen, die nach deinem Urteil erscheinen: Hält dein Urteil stand?',
        ]}
        done="Urteil und Begründung stehen und dein Satz grün bestätigt ist." />
      <p className="task-prompt">Wie urteilst du über die Pressemitteilung? Wähl ein Urteil.</p>
      <div className="sandbox-chips" role="group" aria-label="Urteil">
        {VERDICTS.map((v, i) => <button key={v} aria-pressed={state.verdict === i} onClick={() => set({ verdict: i })}>{v}</button>)}
      </div>
      <TextAnswer id="s04-reason" maxLength={600} size="long" label="Warum fällst du dieses Urteil?"
        help="Zwei bis drei Sätze. Stütz dich auf deine Zahlen aus den Prüfaufträgen und nenn die Prozentbasis."
        example="Mein Urteil: … Denn in Prüfauftrag … sieht man: Von den … sind … % …, von den … dagegen … %."
        value={state.reason} onChange={reason => set({ reason })} />
      <p className="task-prompt">Für welche Lesart schreibst du deinen Faktencheck-Satz?</p>
      <div className="sandbox-chips" role="group" aria-label="Lesart des Faktencheck-Satzes">
        <button aria-pressed={state.fact.reading === 'party'} onClick={() => setFact({ reading: 'party' })}>wie der Parteivorstand ({shortcut(PARTY)})</button>
        <button aria-pressed={state.fact.reading === 'own'} onClick={() => setFact({ reading: 'own' })}>deine Lesart aus Prüfauftrag 3{state.p3.distrust.length > 0 && ` (${shortcut(way)})`}</button>
      </div>
      <p className="task-prompt">Wie lautet dein Faktencheck-Satz? Trag die zwei Zahlen in die Lücken ein.</p>
      <p className="s04-sentence" style={{ fontSize: 'var(--fs-value)', lineHeight: 2.1, background: '#fff', border: '1px solid var(--line)', borderRadius: 8, padding: '8px 14px', margin: '0 0 4px' }}>
        Von denen, die misstrauen, wollen{' '}
        <input type="text" inputMode="decimal" maxLength={12} aria-label="Wie viel Prozent der Misstrauenden wollen nicht wählen?" value={state.fact.distrust} onChange={e => setFact({ distrust: e.target.value })} style={gapInput} />{' '}
        % nicht wählen, von den übrigen{' '}
        <input type="text" inputMode="decimal" maxLength={12} aria-label="Wie viel Prozent der Übrigen wollen nicht wählen?" value={state.fact.others} onChange={e => setFact({ others: e.target.value })} style={gapInput} />{' '}
        %.
      </p>
      <small className="task-field-help">Zeilenprozente aus Prüfauftrag 2 oder 3 – Komma oder Punkt geht beides.</small>
      {state.sentence.trim() && !state.fact.distrust.trim() && !state.fact.others.trim() && <p className="sandbox-note">Dein früher geschriebener Satz: „{state.sentence.trim()}“ – übertrag die zwei Zahlen in die Lücken.</p>}
      <Feedback notes={checkSentence(joint, state)} />
      {state.verdict !== null && <ul className="s04-questions">{questions(joint, state).map(q => <li key={q.id}>
        <strong>{q.title}</strong> {q.text}{q.concept && <> <button className="sandbox-link" onClick={() => onConcept(q.concept!)}>Karte öffnen</button></>}
      </li>)}</ul>}
      <p className="s02-takeaway"><strong>Das Wichtigste aus dieser Sitzung:</strong> Eine Prozentzahl sagt erst etwas, wenn klar ist, wer 100 % ist. „Von den Nichtwählenden misstrauen so viele“ und „von den Misstrauenden wählen so viele nicht“ beschreiben dieselben Befragten – und sind doch zwei verschiedene Aussagen.</p>
    </section>

    <details className="task-step s04-extra">
      <summary>Zusatz für Schnelle · Misstrauens-Zähler</summary>
      <StepGuide
        why="Bisher misst ein einziges Item Misstrauen. Wer bei mehreren Items misstrauisch antwortet, misstraut vielleicht stärker. Steigt dann auch der Anteil derer, die nicht wählen wollen?"
        steps={[
          <>Bilde für <code>pe01</code>, <code>pa35</code> und <code>pe05</code> je eine Dummyvariable: 1 = misstrauische Antwort. Achte bei <code>pe05</code> auf die Richtung.</>,
          'Zähl für jede Person, wie viele ihrer drei Dummyvariablen 1 sind (0 bis 3). Nur wer alle drei Items beantwortet hat, zählt mit.',
          'Kreuze den Zähler mit der Nichtwahl aus Prüfauftrag 1. Wie viel Prozent auf der obersten Stufe wollen nicht wählen?',
        ]}
        done="deine Zahl grün ist. Dann siehst du alle vier Stufen." />
      <div className="task-grid">
        <label>Wie viel Prozent derer, die bei allen drei Items misstrauisch antworten, wollen nicht wählen?<small className="task-field-help">Zeile 3 deines Zählers, Spalte „würde nicht wählen“. Prozentbasis: diese Zeile</small><input type="text" inputMode="decimal" maxLength={12} value={state.extra} onChange={e => set({ extra: e.target.value })} /></label>
      </div>
      <Feedback notes={extra} />
      {extra.some(n => n.tone === 'ok') && <p className="sandbox-note">Alle Stufen, Anteil „würde nicht wählen“: {stairs(data.sav).map(s => `${s.step}: ${s.share.toLocaleString('de-DE', { maximumFractionDigits: 1, minimumFractionDigits: 1 })} %`).join(' · ')}</p>}
      <HintLadder hint={hints.extra} onConcept={onConcept} />
    </details>

    <PlenumCard title="Prozentbasis-Check" lines={plenumLines(state)} file="prozentbasis-plenum.md" />
    {statusS04(state) === 'done' && parseNumber(state.p3.rowDistrust) !== null && <details className="s02-solution"><summary>Ein vollständiges R-Skript zum Mitnehmen</summary><RBlock code={R_SOLUTION} file="prozentbasis-check.R" /></details>}
  </div>;
}
