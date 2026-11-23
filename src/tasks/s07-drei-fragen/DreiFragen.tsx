import { useMemo } from 'react';
import { Feedback, type Note } from '../kit/Feedback';
import { HintLadder } from '../kit/HintLadder';
import { de } from '../kit/numbers';
import { PartnerToggle } from '../kit/PartnerToggle';
import { PlenumCard } from '../kit/PlenumCard';
import { RBlock } from '../kit/RBlock';
import { RoleBrief } from '../kit/RoleBrief';
import { StepGuide } from '../kit/StepGuide';
import { Toolbox } from '../kit/Toolbox';
import type { TaskProps } from '../types';
import { FACET_HELP, FACET_IDS, FACETS, hints, ITEM_IDS, ITEMS, R_BATTERY, R_SETUP, ROLE, SCALE, TOOLBOX_SCRIPT, type ItemId } from './content';
import {
  BATTERY_NOT_FOUND, batteryVariants, checkNumber, checkWeakest, chooseFinal, compareWeakGuess, lockWeakGuess, pickWeakGuess, unlockWeakGuess, weakestItem, weakFieldsOpen, weakGuessRevealed, DUTY_GROUPS, dutyFor, dutyInstruction, dutyMissing, facetNote, keptOf, keyOf, kuer, KUER_NOT_FOUND,
  kuerAllVariants, kuerMeanVariants, kuerReveal, labelOf, landscapeNotes, pa29Note, plenumLines, prepare, prepareFr, recognised, revealReady, rKuer,
  rScript, scaffoldKuer, statusS07, toggleStrike, TRIPLES, type Proposal, type S07State,
} from './domain';
import { GuessCards } from './GuessCards';
import { ItemHeatmap } from './ItemHeatmap';
import { Landscape } from './Landscape';
import { ProposalStep } from './ProposalStep';
import { TextAnswer } from '../kit/TextAnswer';

export function DreiFragen({ data, state, onChange, onConcept }: TaskProps<S07State>) {
  const set = (patch: Partial<S07State>) => onChange({ ...state, ...patch });
  const p = useMemo(() => prepare(data.sav), [data.sav]);
  const fr = useMemo(() => prepareFr(data.sav), [data.sav]);
  const solo = state.mode === 'solo';
  const a = keptOf(state.a.struck), b = keptOf(state.b.struck);
  const ready = revealReady(p, state);
  const finalStats = ready && state.final.length === 3 ? p.byKey[keyOf(state.final)] : null;
  const duty = state.duty ? dutyFor(state.duty) : null;
  const facetsShown = state.facetLevel === 2;
  const k = useMemo(() => (finalStats ? kuer(p, finalStats.items) : null), [p, finalStats]);
  const batteryOk = recognised(batteryVariants(p), state.battery.alpha);
  const patchProposal = (which: 'a' | 'b') => (patch: Partial<Proposal>) => set({ [which]: { ...state[which], ...patch } });
  const setBattery = (patch: Partial<S07State['battery']>) => set({ battery: { ...state.battery, ...patch } });
  const setKuer = (patch: Partial<S07State['kuer']>) => set({ kuer: { ...state.kuer, ...patch } });

  const contentNotes = (items: ItemId[] | null, name: string): Note[] =>
    facetsShown && items ? [{ ...facetNote(items), text: `${name}: ${facetNote(items).text}` }] : [];
  const sameAsA = a && b && keyOf(a) === keyOf(b)
    ? [{ tone: 'hint' as const, text: 'Das ist dieselbe Auswahl wie beim ersten Vorschlag. Das ist erlaubt. Prüf aber mit der Brille des Inhalts, ob wirklich alle Seiten des Begriffs vertreten sind.' }]
    : [];
  const finalNotes: Note[] = finalStats ? [
    ...(facetsShown ? [facetNote(finalStats.items)] : []),
    ...pa29Note(p, finalStats.items),
    ...(duty ? dutyMissing(duty.item, finalStats.items, solo) : []),
  ] : [];
  const sentenceNotes: Note[] = /^\s*(nichts|alles)\b/i.test(state.sentence)
    ? [{ tone: 'hint', text: 'Jede Kurzskala verliert etwas. Welche Seite des Begriffs ist mit drei Items schwächer vertreten als mit sieben? Und welche Befragten unterscheidet sie nicht mehr?' }]
    : [];
  const guessShown = weakGuessRevealed(p, state);
  const realWeakest = guessShown ? weakestItem(p) : null;
  const meanOk = k ? recognised(kuerMeanVariants(k), state.kuer.mean, 1) : false;
  const allOk = k ? recognised(kuerAllVariants(k), state.kuer.all, 1) : false;

  return <div className="task s07">
    <RoleBrief role="Datenteam einer Nachrichten-App" title="Drei Fragen müssen reichen">
      <p><strong>Neuer Job: Datenteam der Nachrichten-App „{ROLE.app}“.</strong> Jede Woche lässt die App ein Umfrageinstitut 2.000 Menschen befragen. Das Ergebnis heißt „{ROLE.barometer}“. Bisher stehen darin sieben Fragen zum Populismus. Ab Januar ist nur noch Platz für drei.</p>
      <p>Die Kurzskala läuft dann drei Jahre lang unverändert. Wer später etwas tauscht, zerreißt die Zeitreihe: Die Wochen davor und danach lassen sich nicht mehr vergleichen. Du entscheidest, welche vier Fragen wegfallen. Testen kannst du deine Wahl am ALLBUS 2023. Dort hat ein Teil der Befragten alle sieben Fragen beantwortet.</p>
      <p>Jede der sieben Fragen ist ein <strong>Item</strong>: eine einzelne Frage, die mit anderen zusammen etwas misst. Zwei Zahlen helfen dir beim Kürzen:</p>
      <ul>
        <li><strong>Stimmigkeit:</strong> Messen deine drei Items dasselbe? Die Zahl dafür heißt Cronbachs α. Sie liegt meist zwischen 0 und 1. Je näher an 1, desto einheitlicher antworten die Befragten auf deine drei Items.</li>
        <li><strong>Stellvertreter-Wert:</strong> Sagen deine drei Items voraus, was die vier gestrichenen ergeben hätten? Die Zahl dafür ist die Korrelation r zwischen dem Mittelwert deiner drei Items und dem Mittelwert der vier gestrichenen.</li>
      </ul>
      <p><strong>Abgabe bis Sitzungsende:</strong> deine drei Items, beide Zahlen und ein Satz: „Was meine Kurzskala nicht mehr misst: …“ Eine einzige richtige Lösung gibt es nicht.</p>
      <p>Der rote Faden: <strong>Welche drei Items messen Populismus fast so gut wie alle sieben – und was geht beim Kürzen verloren?</strong></p>
      <p><strong>Was du dabei lernst:</strong> mehrere Items zu einem Index zusammenfassen (ein Skalenwert pro Person), mit Cronbachs α prüfen, ob sie zuverlässig dasselbe messen (Reliabilität), und Stimmigkeit gegen Inhalt abwägen.</p>
    </RoleBrief>
    <PartnerToggle mode={state.mode} onChange={mode => set({ mode })}
      solo="Du übernimmst nacheinander beide Rollen. Erst kürzt du mit Blick auf die Stimmigkeit, dann mit Blick auf den Inhalt. Danach vergleichst du beide Vorschläge mit allen 35 möglichen Kurzskalen und entscheidest dich."
      pair="A achtet auf die Stimmigkeit: möglichst hohes α, Blick auf die Trennschärfen. B achtet auf den Inhalt: Jede Seite des Begriffs soll erhalten bleiben. Jede Person macht einen Vorschlag und rechnet beide Zahlen dafür. Danach vergleicht ihr und einigt euch auf eine Kurzskala." />

    <Toolbox file="drei-fragen-werkzeuge.R" code={TOOLBOX_SCRIPT} tools={[
      { fn: 'library(), read_spss(), %>%, codebook(), describe()', text: <>kennst du aus Sitzung 1, 3 und 4: Pakete laden, Daten einlesen, Schritte mit der Pipe verketten (lies <code>%&gt;%</code> als „und dann“: <code>allbus %&gt;% describe(recht)</code>), im Codebuch nachsehen, Kennzahlen einer Variable berechnen.</> },
      { fn: 'reliability()', isNew: true, text: <>prüft, wie stimmig mehrere Items dasselbe messen. Kurz zeigt es Cronbachs α (meist zwischen 0 und 1, je höher, desto stimmiger) und McDonalds ω, eine verwandte Kennzahl. Alle Items müssen dafür in dieselbe Richtung zeigen.</> },
      { fn: 'summary()', text: <>kennst du aus Sitzung 7: zeigt hier das Ergebnis von <code>reliability()</code> ausführlich. Unter „Item-Total Statistics“ steht je Item die Trennschärfe (Spalte „Corrected Item-Total“: wie eng ein Item mit den übrigen zusammenhängt) und „Alpha if Deleted“ (α ohne dieses Item).</> },
      { fn: 'mutate()', text: <>kennst du aus Sitzung 5: legt neue Variablen an. Mit <code>allbus &lt;- allbus %&gt;% mutate(…)</code> bleiben sie im Datensatz gespeichert; mehrere neue Variablen stehen durch Kommas getrennt in einem <code>mutate()</code>.</> },
      { fn: 'row_means()', isNew: true, text: <>bildet einen Mittelwertindex: den Mittelwert über mehrere Items, für jede Person einzeln – ihren Skalenwert. In <code>pick()</code> stehen die Items, <code>min_valid</code> sagt, wie viele davon jemand mindestens beantwortet haben muss.</> },
      { fn: 'pearson_cor()', text: <>kennst du aus Sitzung 6: die Korrelation r zweier metrischer Variablen, zwischen −1 und 1.</> },
      { fn: 'rec(), row_sums(), crosstab()', text: <>kennst du aus Sitzung 5, nur für die Kür: <code>rec()</code> kodiert um (zum Beispiel 5–7 zu 1 und 1–4 zu 0; mit <code>rules = "rev"</code> polst du ein Item um), <code>row_sums()</code> zählt je Person (die Items stehen wie bei <code>row_means()</code> in <code>pick()</code>), <code>crosstab()</code> mit <code>weights = wghtpew</code> zählt gewichtet aus.</> },
    ]} />

    <section className="task-step">
      <h3>Einstieg · Acht Items, eine Zahl für die Stimmigkeit</h3>
      <StepGuide
        why={<>Bevor du an die Populismus-Items gehst: Cronbachs α fasst in einer Zahl zusammen, wie eng mehrere Items zusammenhängen. Hier siehst du acht echte Items aus dem ALLBUS – über Frauen und Männer in Familie und Beruf. Die <strong>Heatmap</strong> (eine Tabelle, in der Farben die Zahlen zeigen) gibt für je zwei Items die Korrelation r an. Du nimmst Items heraus, polst sie um und siehst, wie α darauf reagiert.</>}
        steps={[
          'Lies die acht Items und die Antwortskala darunter. Was heißt ein kleiner Code bei jedem einzelnen Item – welche Haltung steckt dahinter?',
          'Schau auf die Heatmap und auf α. Wo ist die Heatmap rot, wo grün? Was haben die Items gemeinsam, die rot zu den übrigen stehen?',
          'Pol Items um. Was passiert mit den Farben und mit α? Spielt es eine Rolle, welche Seite du umpolst?',
          'Nimm einzelne Items heraus und wieder hinein. Wann steigt α, wann fällt es? Würdest du ein Item streichen, nur weil α ohne es höher ist?',
        ]}
        done="du sagen kannst, was Umpolen und Herausnehmen mit α machen." />
      {fr
        ? <ItemHeatmap data={fr} />
        : <p className="sandbox-note">Diese Datei enthält die Items fr07, fr08, fr03b, fr04b, fr05b, fr09, fr10 und fr12 nicht. Mit der vollständigen Datei ZA8831 v1.3.0 erscheint hier die Heatmap.</p>}
    </section>

    <section className="task-step">
      <h3>1 · Die sieben Items: Welches passt am schlechtesten?</h3>
      <StepGuide
        why="Du hast gesehen, wie α darauf reagiert, welche Items in der Skala stehen und in welche Richtung sie zeigen. Jetzt geht es um die sieben Populismus-Items. Bevor du streichst, brauchst du einen Überblick: Wie stimmig messen alle sieben Items dasselbe? Und welches passt am schlechtesten zu den übrigen? Erst tippst du, dann rechnest du nach."
        steps={[
          <>Lies die sieben Items. Die Antwortskala: {SCALE}. Ein kleiner Code heißt also Zustimmung. Alle sieben zeigen in dieselbe Richtung – umpolen musst du nichts.</>,
          'Tipp zuerst: Welches Item passt deiner Meinung nach am schlechtesten zu den anderen? Klick seine Karte an und gib den Tipp ab. Sobald du das schwächste Item aus R eingetragen hast, siehst du auf jeder Karte, wie viel Prozent der Menschen in Deutschland zustimmen.',
          <>Rechne dann in R nach. Die Items heißen <code>pa29</code> bis <code>pa35</code>. Welches Werkzeug misst, wie stimmig mehrere Items dasselbe messen – und zeigt ausführlich, wie eng jedes Item mit den übrigen zusammenhängt?</>,
          'Trag α aller sieben Items ein, dann das Item mit der kleinsten Trennschärfe und seinen Wert.',
        ]}
        done="alle drei Werte grün bestätigt sind und du deinen Tipp neben dem Ergebnis aus R siehst." />
      <p className="task-prompt">Dein Tipp, bevor du rechnest: Welches der sieben Items passt am schlechtesten zu den anderen?
        <small className="task-field-help">Klick eine Karte an. Ein zweiter Klick nimmt den Tipp zurück.</small></p>
      <GuessCards guess={state.weakGuess} locked={state.weakGuessLocked} weakest={realWeakest} agree={p.agree} showAgree={guessShown} onPick={id => onChange(pickWeakGuess(state, id))} />
      <div className="sandbox-chips">
        {!state.weakGuessLocked
          ? <button className="primary" disabled={!state.weakGuess} onClick={() => onChange(lockWeakGuess(state))}>Tipp abgeben</button>
          : <><span className="sandbox-note">Tipp abgegeben: {state.weakGuess}. Jetzt rechnest du in R nach.</span>{!guessShown && <button className="sandbox-link" onClick={() => onChange(unlockWeakGuess(p, state))}>Neu tippen</button>}</>}
      </div>
      <p className="sandbox-note">Die Items sind gekürzt; den genauen Wortlaut zeigt der ALLBUS-Fragebogen.{guessShown ? ' Die Prozent zählen, wer voll oder eher zustimmt (gewichtet).' : ''}</p>
      {!Number.isFinite(p.full.alpha) && <p className="sandbox-error" role="alert">In dieser Datei haben weniger als zwei Befragte alle sieben Items beantwortet. Stimmigkeit und Stellvertreter-Wert lassen sich damit nicht berechnen. Bitte lade die vollständige Datei ZA8831 v1.3.0.</p>}
      {weakFieldsOpen(state)
        ? <div className="task-grid">
          <label>Wie stimmig messen alle sieben Items dasselbe?<small className="task-field-help">Cronbachs α: Zeile „Cronbach's Alpha“ – drei Nachkommastellen, so wie R es zeigt</small><input type="text" inputMode="decimal" maxLength={12} value={state.battery.alpha} onChange={e => setBattery({ alpha: e.target.value })} /></label>
          <label>Welches Item passt laut R am schlechtesten zu den übrigen?<small className="task-field-help">Das mit der kleinsten Trennschärfe: Spalte „Corrected Item-Total“ unter „Item-Total Statistics“</small><select value={state.battery.weakest} onChange={e => setBattery({ weakest: e.target.value as ItemId | '' })}>
            <option value="">Item wählen</option>{ITEM_IDS.map(id => <option key={id} value={id}>{id}</option>)}
          </select></label>
          <label>Wie groß ist seine Trennschärfe?<small className="task-field-help">Dieselbe Zeile, Spalte „Corrected Item-Total“ – drei Nachkommastellen</small><input type="text" inputMode="decimal" maxLength={12} value={state.battery.value} onChange={e => setBattery({ value: e.target.value })} /></label>
        </div>
        : <p className="sandbox-note">Gib oben zuerst deinen Tipp ab. Dann öffnen sich hier die Felder für deine Ergebnisse aus R.</p>}
      <Feedback notes={[...checkNumber(batteryVariants(p), state.battery.alpha, BATTERY_NOT_FOUND), ...checkWeakest(p, state.battery.weakest, state.battery.value)]} />
      {guessShown && realWeakest && state.weakGuess && <div className="s07-guess-compare">
        <p className="task-prompt">Dein Tipp neben dem Ergebnis aus R</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {([['Dein Tipp', state.weakGuess, 'var(--green)'], ['Laut R am schwächsten', realWeakest, 'var(--red)']] as const).map(([title, id, color]) =>
            <div key={title} className="task-card" style={{ flex: '1 1 240px', margin: 0, padding: '10px 14px', borderLeft: `5px solid ${color}` }}>
              <p style={{ margin: '0 0 4px', font: '600 var(--fs-caption)/1.3 var(--sans)', color, textTransform: 'uppercase', letterSpacing: '.04em' }}>{title}</p>
              <p style={{ margin: 0, font: '600 var(--fs-ui)/1.4 var(--sans)' }}><code>{id}</code> {ITEMS[id].short}</p>
              <p style={{ margin: '4px 0 0', font: 'var(--fs-ui)/1.4 Georgia,serif' }}>{ITEMS[id].statement}</p>
            </div>)}
        </div>
        <Feedback notes={compareWeakGuess(p, state.weakGuess)} />
      </div>}
      <HintLadder hint={{ ...hints.battery, scaffold: hints.battery.scaffold!, solution: `${R_SETUP}\n\n${R_BATTERY}` }} onConcept={onConcept} file="drei-fragen-batterie.R" />
    </section>

    <ProposalStep which="a" heading={solo ? '2 · Rolle 1: Stimmigkeit' : '2 · Person A: Stimmigkeit'} proposal={state.a} p={p}
      onToggle={id => onChange(toggleStrike(state, 'a', id))} onPatch={patchProposal('a')} onConcept={onConcept}>
      <StepGuide
        why={<>Du weißt jetzt, wie stimmig alle sieben Items sind und welches am schwächsten passt. Jetzt {solo ? 'kürzt du' : 'kürzt A'} zum ersten Mal – mit der Brille der Stimmigkeit: Die drei Items, die bleiben, sollen möglichst einheitlich dasselbe messen.</>}
        steps={[
          'Streich vier Items. Die Trennschärfen aus Schritt 1 zeigen, welche Items gut zu den übrigen passen. Begründe deine Wahl in einem Satz.',
          'Rechne in R die Stimmigkeit deiner drei Items. Das Werkzeug kennst du aus Schritt 1.',
          <>Bilde für alle Befragten zwei Skalenwerte: den <strong>Kurzwert</strong> (Mittelwert ihrer Antworten auf deine drei Items) und den <strong>Restwert</strong> (Mittelwert auf den vier gestrichenen). Welches Werkzeug rechnet einen Mittelwert innerhalb einer Person? Zähl nur, wer alle Items beantwortet hat.</>,
          'Korreliere Kurzwert und Restwert. Dieses r ist dein Stellvertreter-Wert: Je näher an 1, desto besser sagt deine Kurzskala voraus, was die vier gestrichenen Items ergeben hätten.',
        ]}
        done="α und r grün bestätigt sind." />
    </ProposalStep>

    <ProposalStep which="b" heading={solo ? '3 · Rolle 2: Inhalt – jetzt wechselst du die Seite' : '3 · Person B: Inhalt'} proposal={state.b} p={p}
      onToggle={id => onChange(toggleStrike(state, 'b', id))} onPatch={patchProposal('b')} onConcept={onConcept}
      extra={[...contentNotes(a, 'Vorschlag Stimmigkeit'), ...contentNotes(b, 'Vorschlag Inhalt'), ...sameAsA]}>
      <StepGuide
        why={<>{solo ? 'Dein erster Vorschlag' : 'Der Vorschlag von A'} misst möglichst stimmig. Aber trägt er noch den ganzen Begriff? {solo ? 'Jetzt wechselst du die Seite' : 'Jetzt ist B dran'} – mit der Brille des Inhalts: Die Kurzskala soll alle Seiten von Populismus abdecken, nicht nur eine.</>}
        steps={[
          'Lies die sieben Items noch einmal: Worum geht es jeweils? Sortier sie für dich nach Seiten des Begriffs. Wenn du nicht weiterkommst, hilft der Knopf unter dieser Anleitung.',
          'Streich vier Items so, dass möglichst jede Seite erhalten bleibt. Begründe deine Wahl in einem Satz.',
          'Rechne dieselben zwei Zahlen wie in Schritt 2. In deinem Skript tauschst du nur die Items aus.',
        ]}
        done="α und r grün bestätigt sind." />
      <div className="s07-facets">
        {state.facetLevel === 0 && <button onClick={() => set({ facetLevel: 1 })}>Welche Seiten hat der Begriff?</button>}
        {state.facetLevel >= 1 && <p><strong>Denkanstoß.</strong> {FACET_HELP.think}</p>}
        {state.facetLevel === 1 && <button onClick={() => set({ facetLevel: 2 })}>Die drei Seiten zeigen</button>}
        {facetsShown && <>
          <p>{FACET_HELP.reveal}</p>
          <ul className="s07-facet-list">{FACET_IDS.map(fid => <li key={fid}>
            <strong>{FACETS[fid].name}</strong> ({fid}): {FACETS[fid].gist} – {ITEM_IDS.filter(id => ITEMS[id].facet === fid).join(', ')}
          </li>)}</ul>
        </>}
      </div>
    </ProposalStep>

    <section className="task-step">
      <h3>4 · Alle 35 Kurzskalen im Vergleich</h3>
      <StepGuide
        why="Du hast jetzt zwei Vorschläge mit je zwei Zahlen. Aber wie gut sind sie im Vergleich? Aus sieben Items lassen sich 35 verschiedene Dreiergruppen bilden. Der Browser hat für jede α und r gerechnet."
        steps={[
          'Such deine beiden Vorschläge im Bild. Jeder Punkt ist eine Kurzskala: rechts die stimmigen, oben die guten Stellvertreter.',
          'Prüf: Liegen die stimmigsten Kurzskalen auch ganz oben? Oder muss man sich zwischen beidem entscheiden?',
          'Lies die Hinweise unter dem Bild.',
        ]}
        done="du weißt, wo deine Vorschläge im Vergleich stehen." />
      {!ready && <p className="sandbox-note">Das Bild aller 35 Kurzskalen erscheint, sobald für beide Vorschläge Stimmigkeit und Stellvertreter-Wert eingetragen und erkannt sind.</p>}
      {ready && a && b && <>
        <Landscape triples={p.triples} duty={duty?.item ?? null} showFacets={facetsShown}
          marks={[{ key: keyOf(a), label: solo ? 'Stimmigkeit' : 'A' }, { key: keyOf(b), label: solo ? 'Inhalt' : 'B' }, ...(finalStats ? [{ key: finalStats.key, label: 'Wahl' }] : [])]} />
        <ul className="s07-notes">{landscapeNotes(p, [a, b], batteryOk).map(n => <li key={n}>{n}</li>)}</ul>
      </>}
    </section>

    {ready && a && b && <section className="task-step">
      <h3>5 · Deine Wahl</h3>
      <StepGuide
        why={<>Das Bild zeigt: Stimmigkeit und Stellvertreter-Wert ziehen nicht immer in dieselbe Richtung. Jetzt {solo ? 'entscheidest du' : 'entscheidet ihr gemeinsam'}, welche Kurzskala drei Jahre lang im Barometer steht.</>}
        steps={[
          <>Übernimm einen Vorschlag oder wähl eine andere Kurzskala aus der Liste. Umentscheiden ist ausdrücklich erlaubt.{solo ? '' : ' Einigt euch auf eine.'}</>,
          'Nur wenn die Lehrperson es ansagt, weil der Raum fast überall dieselbe Kurzskala gewählt hat: Trag eure Gruppennummer ein. Der Browser lost dann eine Pflichtfrage aus, die in der Kurzskala bleiben muss. Sonst lässt du diesen Teil weg.',
          'Begründe deine Wahl und schreib den Satz: Was misst deine Kurzskala nicht mehr?',
        ]}
        done="Kurzskala, Begründung und Satz stehen." />
      <p className="task-prompt">Welche Kurzskala nimmst du? Übernimm einen Vorschlag – oder wähl unten eine andere.</p>
      <div className="sandbox-chips" role="group" aria-label="Vorschlag übernehmen">
        <button aria-pressed={keyOf(state.final) === keyOf(a)} onClick={() => onChange(chooseFinal(state, a))}>Stimmigkeit übernehmen ({labelOf(a)})</button>
        <button aria-pressed={keyOf(state.final) === keyOf(b)} onClick={() => onChange(chooseFinal(state, b))}>Inhalt übernehmen ({labelOf(b)})</button>
      </div>
      <div className="task-grid">
        <label>Oder lieber eine andere Kurzskala?<small className="task-field-help">Alle 35 möglichen Dreiergruppen, jeweils mit α und r</small><select value={state.final.length === 3 ? keyOf(state.final) : ''} onChange={e => onChange(chooseFinal(state, e.target.value ? e.target.value.split('+') as ItemId[] : []))}>
          <option value="">Kurzskala wählen</option>
          {TRIPLES.map(t => { const s = p.byKey[keyOf(t)]; return <option key={s.key} value={s.key}>{labelOf(t)} (α {de(s.alpha, 3)} · r {de(s.r, 3)})</option>; })}
        </select></label>
      </div>
      <Feedback notes={finalNotes} />
      <div className="s07-duty">
        <p className="task-prompt">Pflichtfrage bei zu einheitlicher Wahl</p>
        <p className="sandbox-note">Die Auslosung hängt nur an der Gruppennummer: Jedes Gerät zieht für dieselbe Nummer dieselbe Pflichtfrage.</p>
        <div className="task-grid">
          <label>Welche Nummer hat eure Gruppe?<small className="task-field-help">Nur nötig, wenn die Lehrperson es ansagt – sonst „keine Pflichtfrage“ lassen</small><select value={state.duty ?? ''} onChange={e => set({ duty: e.target.value ? Number(e.target.value) : null })}>
            <option value="">keine Pflichtfrage</option>
            {Array.from({ length: DUTY_GROUPS }, (_, i) => i + 1).map(g => <option key={g} value={g}>Gruppe {g}</option>)}
          </select></label>
        </div>
        {duty && <p className="s07-duty-draw" aria-live="polite"><strong>Pflichtfrage für Gruppe {state.duty}: {duty.item}</strong> – {ITEMS[duty.item].statement} Grund: {duty.reason} {dutyInstruction(duty.item, state.final, solo)}</p>}
      </div>
      <TextAnswer id="s07-reason" maxLength={600} size="long" label="Warum nimmst du genau diese drei Items?"
        help="Ein, zwei Sätze: Was decken die drei zusammen ab – und was sagen deine Zahlen dazu?"
        example="Ich nehme …, … und …, weil sie zusammen … abdecken. Alpha liegt bei …, also …"
        value={state.reason} onChange={reason => set({ reason })} />
      <TextAnswer id="s07-sentence" maxLength={400} label="Was misst deine Kurzskala nicht mehr?" help="Ein Satz – was fehlt, seit vier Items gestrichen sind?"
        example="Was meine Kurzskala nicht mehr misst: …" value={state.sentence} onChange={sentence => set({ sentence })} />
      <Feedback notes={sentenceNotes} />
      <p className="s02-takeaway"><strong>Das Wichtigste aus dieser Sitzung:</strong> Ein Mittelwertindex fasst mehrere Items zu einem Skalenwert pro Person zusammen. Cronbachs α zeigt, ob die Items stimmig dasselbe messen – aber nicht, ob sie den ganzen Begriff abdecken. Wer eine Skala kürzt, wägt Stimmigkeit gegen Inhalt ab.</p>
    </section>}

    {finalStats && k && <details className="task-step s07-kuer">
      <summary>Kür (optional, etwa 10 Minuten): Mittelwertindex gegen Kombinationsindex</summary>
      <StepGuide
        why={<>Deine Kurzskala steht. Die App will daraus eine Push-Nachricht machen: Wie viele Menschen denken populistisch? Die Antwort hängt davon ab, wie du die drei Antworten zu einem Index zusammenfasst. Du rechnest beide Anteile für {labelOf(finalStats.items)}.</>}
        steps={[
          <><strong>Mittelwertindex:</strong> Wer stimmt <em>im Schnitt</em> zu? Das ist, wer einen Kurzwert von höchstens 2 hat. Mach daraus eine 0/1-Variable. Denk daran: Ein Mittelwert aus drei Antworten kann auch 2,33 oder 2,67 sein.</>,
          <><strong>Kombinationsindex:</strong> Wer stimmt <em>allen drei</em> Items zu? Mach aus jedem Item eine 0/1-Variable (1 = stimmt voll oder eher zu) und zähl je Person die Zustimmungen. Wer drei hat, bekommt in einer zweiten 0/1-Variable eine 1.</>,
          'Leg die beiden 0/1-Variablen in eine Kreuztabelle: gewichtet, weil es um eine Aussage über Deutschland geht, und mit Prozent von allen Befragten in der Tabelle.',
        ]}
        done="beide Anteile grün bestätigt sind." />
      <div className="task-grid">
        <label>Wie viel Prozent stimmen nach dem Mittelwertindex zu?<small className="task-field-help">Gewichtet, aus der Kreuztabelle: die Zeile mit Kurzwert höchstens 2, ganz rechts in der Spalte Total, „total %“ – eine Nachkommastelle</small><input type="text" inputMode="decimal" maxLength={12} value={state.kuer.mean} onChange={e => setKuer({ mean: e.target.value })} /></label>
        <label>Wie viel Prozent stimmen allen drei Items zu (Kombinationsindex)?<small className="task-field-help">Gewichtet, aus der Kreuztabelle: die Spalte, in der alle drei zugestimmt haben, ganz unten in der Zeile Total, „total %“ – eine Nachkommastelle</small><input type="text" inputMode="decimal" maxLength={12} value={state.kuer.all} onChange={e => setKuer({ all: e.target.value })} /></label>
      </div>
      <Feedback notes={[
        ...checkNumber(kuerMeanVariants(k), state.kuer.mean, KUER_NOT_FOUND, 1, 'Trag den Anteil mit einer Nachkommastelle ein, so wie crosstab() ihn zeigt.'),
        ...checkNumber(kuerAllVariants(k), state.kuer.all, KUER_NOT_FOUND, 1, 'Trag den Anteil mit einer Nachkommastelle ein, so wie crosstab() ihn zeigt.'),
        ...(meanOk && allOk ? [{ tone: 'ok' as const, text: kuerReveal(k) }] : []),
      ]} />
      <HintLadder key={finalStats.key} hint={{ ...hints.kuer, scaffold: scaffoldKuer, solution: `${R_SETUP}\n\n${rKuer(finalStats.items)}` }} onConcept={onConcept} file="drei-fragen-kuer.R" />
    </details>}

    <PlenumCard title="Drei Fragen müssen reichen" lines={plenumLines(state, finalStats)} file="drei-fragen-plenum.md" />
    {statusS07(state) === 'done' && <details className="s02-solution"><summary>Ein vollständiges R-Skript zum Mitnehmen</summary>
      <RBlock code={rScript(a, b, state.final.length === 3 ? state.final : null)} file="drei-fragen.R" />
    </details>}
  </div>;
}
