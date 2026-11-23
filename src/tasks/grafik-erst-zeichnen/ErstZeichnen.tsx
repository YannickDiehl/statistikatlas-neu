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
import { CAT } from '../kit/palette';
import { RCode } from '../kit/RCode';
import { AxisBars, PlanChart, Silhouette, SketchOverlay, SketchPad } from './Charts';
import {
  AXIS_MAX_START, CANDIDATES, GEOMS, hints, QUESTIONS, SILHOUETTE_IDS, SILHOUETTES, TOOLBOX_SCRIPT, VARS,
  type GeomId, type Level, type QuestionId,
} from './content';
import {
  axisNotes, axisTop, checkCaption, checkMeans, checkRead, compareSketch, meansOk, planCode, planPreview, plenumLines, questionById, rCodeFor,
  readOk, regionMeans, rSolution, silhouetteBars, silhouetteResults, silhouetteStory, sketchShares, sketchSummary, sketchTruth, statusGrafik,
  type GrafikState,
} from './domain';
import { TextAnswer } from '../kit/TextAnswer';

const LEVEL: Record<Level, { text: string; concept: string }> = {
  nominal: { text: 'Kategorien ohne Reihenfolge', concept: 'nominal' },
  ordinal: { text: 'geordnete Kategorien', concept: 'ordinal' },
  metric: { text: 'metrisch', concept: 'metric' },
};

export function ErstZeichnen({ data, state, onChange, onConcept }: TaskProps<GrafikState>) {
  const set = (patch: Partial<GrafikState>) => onChange({ ...state, ...patch });
  const sav = data.sav;
  const truth = useMemo(() => sketchTruth(sav), [sav]);
  const silhouettes = useMemo(() => Object.fromEntries(SILHOUETTE_IDS.map(id => [id, silhouetteBars(sav, SILHOUETTES[id])])), [sav]);
  const means = useMemo(() => regionMeans(sav), [sav]);
  const question = state.question ? questionById(state.question) : null;
  const { geom: planGeom, x: planX, second: planSecond } = state.plan;
  // Nach Bauplan-Feldern, nicht nach Objekt: Der Zustand wird bei jeder Eingabe neu gelesen, die Vorschau soll dann nicht neu rechnen.
  const preview = useMemo(() => (question ? planPreview(sav, question, { geom: planGeom, x: planX, second: planSecond }) : null), [sav, question, planGeom, planX, planSecond]);
  const own = sketchSummary(state.sketch);
  const revealed = state.locked && readOk(truth, state.sketch, state.read);
  const results = silhouetteResults(state);
  const geom = GEOMS.find(g => g.id === state.plan.geom);
  const link = (id: string, label: string) => <button className="sandbox-link" onClick={() => onConcept(id)}>{label}</button>;

  const chooseQuestion = (id: QuestionId) => {
    const q = questionById(id);
    if (id === state.question) return;
    // Neue Leitfrage, neues Bild: Die Bildunterschrift gehört zum alten.
    set({ question: id, plan: { geom: state.plan.geom, x: q.group, second: q.outcome }, caption: '' });
  };

  return <div className="task grafik">
    <RoleBrief role="Grafikredaktion eines Schulbuchverlags" title="Erst zeichnen, dann zeigen">
      <p>Der Verlag Kreidestrich plant für das Politikbuch der Oberstufe die Doppelseite „Wie geht es Deutschland?“. Die Lektorin schreibt dir:</p>
      <p>„Schülerinnen und Schüler glauben Grafiken mehr als Zahlen. Darum gilt bei uns: Vor jeder Grafik wird skizziert, was man erwartet – sonst merkt man nicht, was die Daten einem beibringen. Und keine Grafik geht in den Druck, die mehr verspricht als die Daten.“</p>
      <p>Die Leitfrage für alle vier Teile: <strong>Wie zeigt man ehrlich, wie es Deutschland geht?</strong> Du zeichnest in RStudio mit ggplot2 und trägst hier ein, was du abliest.</p>
      <p><strong>Was du dabei lernst:</strong> Grafiken mit ggplot2 bauen, für jede Variable die passende Form wählen und erkennen, wann eine Grafik übertreibt.</p>
    </RoleBrief>
    <PartnerToggle mode={state.mode} onChange={mode => set({ mode })}
      solo="Du skizzierst, rätst, baust und entscheidest selbst. Die Vorschau im Bauplan zeigt dir, was ggplot2 aus anderen Entscheidungen machen würde."
      pair="A skizziert die Lebenszufriedenheit, B ordnet verdeckt die Silhouetten zu; dann tauscht ihr und löst gemeinsam auf. Im Bauplan nehmt ihr dieselbe Frage, aber verschiedene Formen, und entscheidet, welche ins Buch kommt." />

    <Toolbox file="erst-zeichnen-werkzeuge.R" code={TOOLBOX_SCRIPT} tools={[
      { fn: 'library(), read_spss(), codebook()', text: <>kennst du aus Sitzung 1: Pakete laden, Daten einlesen, im Codebuch nachsehen.</> },
      { fn: '%>%', text: <>kennst du aus Sitzung 2 und 3: Lies die Pipe als „und dann“. Neu ist die Kette: Statt ein Zwischenergebnis wie <code>frauen</code> unter eigenem Namen zu speichern, hängst du mehrere Schritte aneinander – vorn der Datensatz, danach jeder Schritt in einer eigenen Zeile. Ab dieser Sitzung schreiben wir Code so.</> },
      { fn: 'filter(), to_label(), frequency(), describe()', text: <>kennst du aus Sitzung 2 und 3: Befragte auswählen, Codes in Wörter umwandeln, auszählen, Kennzahlen berechnen.</> },
      { fn: 'ggplot() + aes()', isNew: true, text: <>beginnt eine Grafik: Die Daten kommen mit <code>%&gt;%</code> hinein, <code>aes()</code> legt fest, welche Variable auf welche Achse (<code>x</code>, <code>y</code>) oder in die Farbe (<code>fill</code>) kommt. Alles Weitere hängst du mit <code>+</code> an, nicht mit <code>%&gt;%</code>.</> },
      { fn: 'geom_bar()', isNew: true, text: <>zeichnet einen Balken je Ausprägung und zählt, wie oft sie vorkommt – die Form für Kategorien.</> },
      { fn: 'geom_histogram()', isNew: true, text: <>fasst metrische Werte zu Balken zusammen; <code>binwidth</code> legt fest, wie breit ein Balken ist.</> },
      { fn: 'geom_bar(position = "fill")', isNew: true, text: <>für zwei kategoriale Variablen: Jeder Balken geht bis 100 %, die Farben zeigen die Anteile innerhalb der Gruppe. Mit <code>"dodge"</code> stehen die Balken nebeneinander, ohne Zusatz gestapelt.</> },
      { fn: 'geom_boxplot()', isNew: true, text: <>fasst metrische Werte je Gruppe zusammen: Der dicke Strich ist der Median, der Kasten die mittlere Hälfte.</> },
      { fn: 'geom_point(), geom_jitter()', isNew: true, text: <>zeichnen ein Streudiagramm: einen Punkt je Befragten, <code>x</code> und <code>y</code> sind nötig. <code>geom_jitter()</code> streut die Punkte ein wenig, damit gleiche Werte nicht genau übereinanderliegen; <code>alpha</code> macht sie durchsichtig.</> },
      { fn: '!is.na()', isNew: true, text: <>heißt „ist nicht fehlend“. In <code>filter()</code> lässt du damit fehlende Werte weg.</> },
      { fn: 'nrow()', isNew: true, text: <>zählt die Zeilen, also wie viele Befragte in deinen Daten stecken.</> },
      { fn: 'labs()', isNew: true, text: <>beschriftet die Grafik: Titel (<code>title</code>) und Quellenangabe (<code>caption</code>).</> },
    ]} />

    <section className="task-step">
      <h3>Teil 1 · Erst zeichnen</h3>
      <StepGuide
        why="Bevor du die Daten ansiehst, hältst du fest, was du erwartest. Nur so merkst du, was die Daten dir Neues zeigen."
        steps={[
          <>Lies die Frage: „Wie zufrieden sind Sie gegenwärtig, alles in allem, mit Ihrem Leben?“ 0 heißt ganz unzufrieden, 10 ganz zufrieden.</>,
          <>Zieh die Balken so hoch, wie du die Antworten von gut 5.000 Befragten erwartest. Nicht nachsehen – es zählt deine Erwartung. Dann gib die Skizze ab.</>,
          <>Zeichne danach die echte Verteilung in R (Variable <code>ls01</code>) und lies ab: Wo steht der höchste Balken, und wie hoch ist er ungefähr? Dafür gibt es zwei Wege: an deiner Grafik ablesen oder genau nachzählen mit einer Häufigkeitstabelle.</>,
        ]}
        done="deine Skizze neben der echten Verteilung steht." />
      <SketchPad heights={state.sketch} onChange={sketch => set({ sketch })} disabled={state.locked} />
      {own && <p className="sandbox-note">Deine Skizze: Gipfel bei {own.peak}, Mittel bei {de(own.mean)}.</p>}
      {!state.locked
        ? <button className="primary" disabled={!own} onClick={() => set({ locked: true })}>Skizze abgeben</button>
        : <p className="sandbox-note">Abgegeben.{!revealed && <> <button className="sandbox-link" onClick={() => set({ locked: false, read: { peak: '', count: '' } })}>Neu skizzieren</button></>}</p>}
      {state.locked && <>
        <p><strong>Die echte Verteilung:</strong> Zeichne sie jetzt in R und lies ab.</p>
        <div className="task-grid">
          <label>Bei welchem Wert steht der höchste Balken?<small className="task-field-help">Eine Zahl von 0 bis 10</small><input type="text" inputMode="numeric" maxLength={12} value={state.read.peak} onChange={e => set({ read: { ...state.read, peak: e.target.value } })} /></label>
          <label>Wie viele Befragte sind es dort ungefähr?<small className="task-field-help">An der y-Achse abgelesen – ungefähr reicht</small><input type="text" inputMode="numeric" maxLength={12} value={state.read.count} onChange={e => set({ read: { ...state.read, count: e.target.value } })} /></label>
        </div>
        <Feedback notes={checkRead(truth, state.sketch, state.read)} />
        {revealed && <>
          <SketchOverlay truth={truth} sketch={sketchShares(state.sketch)} />
          <Feedback notes={compareSketch(truth, state.sketch)} />
          <p className="sandbox-note">In der Karte: {link('mode', 'Modus')} · {link('shape', 'Schiefe')} · {link('empirical_distribution', 'Empirische Verteilung')}</p>
        </>}
        <HintLadder hint={hints.sketch} onConcept={onConcept} />
      </>}
    </section>

    <section className="task-step">
      <h3>Teil 2 · Rätselkasten: Welche Frage hat diese Form?</h3>
      <StepGuide
        why="Die Form einer Verteilung verrät viel über die Frage dahinter. Kannst du das auch umgekehrt lesen? Für den Rand der Doppelseite gibt es einen Rätselkasten: vier echte Verteilungen aus dem ALLBUS, ohne Achsen und ohne Titel."
        steps={[
          'Ordne jeder Silhouette eine Frage zu. Eine der fünf Fragen bleibt übrig.',
          'Prüf deinen Verdacht in R, bevor du auflöst: Wie viele Stufen hat jede Frage (Codebuch)? Wie sieht ihre Verteilung aus? Für Kategorien nimmst du Balken, für metrische Variablen ein Histogramm.',
          'Klick auf „Auflösen“.',
        ]}
        done="alle vier Silhouetten aufgelöst sind." />
      <ul className="grafik-candidates">
        {CANDIDATES.map(name => <li key={name}><strong>{VARS[name].title}</strong> <code>{name}</code><span>{VARS[name].question}</span><small>{VARS[name].scale}</small></li>)}
      </ul>
      <p className="s03-progress" role="status"><strong>{SILHOUETTE_IDS.filter(id => state.silhouettes[id]).length} von 4</strong> Silhouetten zugeordnet</p>
      <div className="grafik-silhouettes">
        {SILHOUETTE_IDS.map(id => {
          const r = results.find(x => x.id === id)!;
          return <figure key={id} className={state.solved ? (r.correct ? 'right' : 'wrong') : ''}>
            <Silhouette bars={silhouettes[id]} label={`Silhouette ${id}`} color={CAT[SILHOUETTE_IDS.indexOf(id) % CAT.length]} />
            <figcaption>
              <label>Silhouette {id} zeigt:<select value={state.silhouettes[id] ?? ''} disabled={state.solved} onChange={e => set({ silhouettes: { ...state.silhouettes, [id]: e.target.value } })}>
                <option value="">Frage wählen</option>
                {CANDIDATES.map(name => <option key={name} value={name}>{VARS[name].title}</option>)}
              </select></label>
              {state.solved && <p><strong>{r.correct ? 'Richtig' : `Das ist: ${VARS[r.truth].title}`}.</strong> {silhouetteStory(sav, id, r.chosen)}</p>}
            </figcaption>
          </figure>;
        })}
      </div>
      {!state.solved
        ? <button className="primary" disabled={SILHOUETTE_IDS.some(id => !state.silhouettes[id])} onClick={() => set({ solved: true })}>Auflösen</button>
        : <Feedback notes={[{ tone: results.every(r => r.correct) ? 'ok' : 'hint', text: `${results.filter(r => r.correct).length} von 4 richtig. Übrig bleibt: ${VARS[CANDIDATES.find(c => !Object.values(SILHOUETTES).includes(c))!].title}.` }]} />}
      <p className="sandbox-note">In der Karte: {link('discrete_continuous', 'Diskret & stetig')} · {link('frequency', 'Häufigkeiten')} · {link('codebook', 'Codebuch')}</p>
      <HintLadder hint={hints.silhouettes} onConcept={onConcept} />
    </section>

    <section className="task-step">
      <h3>Teil 3 · Der Bauplan</h3>
      <StepGuide
        why="Du kannst jetzt Formen lesen. Jetzt baust du selbst eine Grafik – zu einer von drei Fragen der Lektorin. Die Kunst ist, eine Form zu wählen, die zur Frage und zu den Variablen passt."
        steps={[
          'Wähl eine Frage.',
          'Entscheide, welche Form die Grafik hat und welche Variable wohin kommt (x, y oder Farbe). Die Vorschau zeigt sofort, was ggplot2 daraus macht – auch, wenn R einen Fehler melden würde. Probier ruhig Formen aus, die nicht passen.',
          'Bau die Grafik in R nach. Bereite die Daten vorher vor: Wörter statt Codes, fehlende Werte weglassen, n zählen. Das Muster steht im Werkzeugkasten.',
          'Schreib die Bildunterschrift: ein Satz, was das Bild zeigt, dazu n und Quelle.',
        ]}
        done="deine Bildunterschrift mit dem richtigen n grün bestätigt ist." />
      <p className="task-prompt">Zu welcher Frage baust du die Grafik?</p>
      <div className="sandbox-chips" role="group" aria-label="Frage für die Grafik">
        {QUESTIONS.map(q => <button key={q.id} aria-pressed={state.question === q.id} onClick={() => chooseQuestion(q.id)}>{q.text}</button>)}
      </div>
      {question && <>
        <ul className="grafik-vars">
          {[question.group, question.outcome].map(name => <li key={name}>
            <code>{name}</code> {VARS[name].title}: {VARS[name].scale} · {link(LEVEL[VARS[name].level].concept, LEVEL[VARS[name].level].text)}
          </li>)}
        </ul>
        <p className="task-prompt">Welche Form soll die Grafik haben?</p>
        <div className="sandbox-chips" role="group" aria-label="Form (geom)">
          {GEOMS.map(g => <button key={g.id} aria-pressed={state.plan.geom === g.id} onClick={() => set({ plan: { ...state.plan, geom: g.id as GeomId } })}>{g.label}</button>)}
        </div>
        <div className="task-grid">
          <label>Was kommt auf die x-Achse?<select value={state.plan.x} onChange={e => {
            const x = e.target.value;
            set({ plan: { ...state.plan, x, second: state.plan.second === x ? (x === question.group ? question.outcome : question.group) : state.plan.second } });
          }}>
            {[question.group, question.outcome].map(name => <option key={name} value={name}>{name} · {VARS[name].title}</option>)}
          </select></label>
          <label>{geom?.role === 'y' ? 'Was kommt auf die y-Achse?' : 'Was bestimmt die Farbe (fill)?'}<select value={state.plan.second} onChange={e => set({ plan: { ...state.plan, second: e.target.value } })}>
            <option value="">nichts</option>
            {[question.group, question.outcome].filter(n => n !== state.plan.x).map(name => <option key={name} value={name}>{name} · {VARS[name].title}</option>)}
          </select></label>
        </div>
        {state.plan.geom && <>
          <p className="sandbox-note">Dein Bauplan in ggplot2. Die Daten in <code>bild</code> bereitest du vorher selbst vor:</p>
          <pre className="sandbox-code"><code><RCode code={planCode(state.plan)} /></code></pre>
          {preview?.view && <PlanChart view={preview.view} />}
          <Feedback notes={preview?.notes ?? []} />
          <TextAnswer id="grafik-caption" maxLength={400} label="Welche Bildunterschrift bekommt dein Bild im Schulbuch?"
            help="Ein Satz, was das Bild zeigt – dahinter in Klammern Quelle und n (Zahl der Befragten im Bild)"
            example="z. B. So verteilen sich die Schulabschlüsse der Befragten (ALLBUS 2023, n = …)."
            value={state.caption} onChange={caption => set({ caption })} />
          <Feedback notes={checkCaption(sav, state.plan, state.caption)} />
        </>}
        <p className="sandbox-note">In der Karte: {link('quantile', 'Quantile (Boxplot)')} · {link('crosstab', 'Kreuztabelle')} · {link('labels', 'Wertelabels')} · {link('missing', 'Fehlende Werte')}</p>
        <HintLadder hint={{ ...hints.plan, solution: rCodeFor(question, state.plan) }} onConcept={onConcept} file="erst-zeichnen-bauplan.R" />
      </>}
    </section>

    <section className="task-step">
      <h3>Teil 4 · Wo beginnt die Achse?</h3>
      <StepGuide
        why="Deine Grafik ist fertig – doch für den Ost-West-Vergleich will die Chefredaktion Drama: „Mach den Unterschied sichtbar!“ Wie weit darf eine Grafik gehen, bevor sie mehr verspricht als die Daten?"
        steps={[
          <>Berechne in R die mittlere Lebenszufriedenheit (<code>ls01</code>) getrennt für West und Ost. In <code>eastwest</code> steht 1 für West und 2 für Ost.</>,
          'Trag beide Mittelwerte ein. Dann erscheint ein Schieberegler: Verschieb den Anfang der y-Achse und beobachte, wie sich das Bild verändert.',
          'Entscheide, wo die Achse beginnt, und begründe es der Chefredaktion.',
        ]}
        done="deine Antwort an die Chefredaktion steht." />
      <div className="task-grid">
        <label>Wie hoch ist die mittlere Lebenszufriedenheit im Westen?<small className="task-field-help">Mean aus describe(), nur Befragte aus dem Westen</small><input type="text" inputMode="decimal" maxLength={12} value={state.axis.west} onChange={e => set({ axis: { ...state.axis, west: e.target.value } })} /></label>
        <label>Wie hoch ist die mittlere Lebenszufriedenheit im Osten?<small className="task-field-help">Mean aus describe(), nur Befragte aus dem Osten</small><input type="text" inputMode="decimal" maxLength={12} value={state.axis.east} onChange={e => set({ axis: { ...state.axis, east: e.target.value } })} /></label>
      </div>
      <Feedback notes={checkMeans(sav, state.axis)} />
      {meansOk(sav, state.axis) && <>
        <label className="grafik-slider">Die y-Achse beginnt bei {de(state.axis.start)}
          <input type="range" min={0} max={AXIS_MAX_START} step={0.1} value={state.axis.start} onChange={e => set({ axis: { ...state.axis, start: Number(e.target.value) } })} />
        </label>
        <AxisBars west={means.west} east={means.east} start={state.axis.start} top={axisTop(means)} />
        <Feedback notes={axisNotes(sav, state.axis.start)} />
        <TextAnswer id="grafik-reason" maxLength={400} label="Was antwortest du der Chefredaktion: Warum beginnt die Achse dort?"
          help="Ein bis zwei Sätze. Denk an die Leserinnen und Leser: Was sehen sie, wenn die Achse woanders beginnt?"
          example="Die Achse beginnt bei …, weil …" value={state.axis.reason} onChange={reason => set({ axis: { ...state.axis, reason } })} />
      </>}
      <HintLadder hint={hints.axis} onConcept={onConcept} />
      <p className="s02-takeaway"><strong>Das Wichtigste aus dieser Sitzung:</strong> Eine Grafik ist ehrlich, wenn ihre Form zur Variable passt, sie sagt, wer im Bild steckt (n und Quelle), und ihre Achse nichts übertreibt.</p>
    </section>

    <PlenumCard title="Erst zeichnen, dann zeigen" lines={plenumLines(sav, state)} file="erst-zeichnen-plenum.md" />
    {statusGrafik(state) === 'done' && question && <details className="s02-solution"><summary>Ein vollständiges R-Skript zum Mitnehmen</summary><RBlock code={rSolution(question, state.plan)} file="erst-zeichnen.R" /></details>}
  </div>;
}
