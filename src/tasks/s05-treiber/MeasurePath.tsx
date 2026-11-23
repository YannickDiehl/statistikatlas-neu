import { useState, type CSSProperties } from 'react';
import { Feedback } from '../kit/Feedback';
import { MEASURES, type MeasureId } from '../kit/stats';
import { LEVEL_INFO, MEASURE_INFO, type Card, type Level } from './content';
import { checkLevel, checkOutcomeLevel, MEASURE_IDS, measureFit, measureLabel } from './domain';

const LEVELS: Level[] = ['nominal', 'ordinal', 'metrisch'];
const grid: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 8, margin: '0 0 10px' };
const cardBtn: CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2, width: '100%', textAlign: 'left', padding: '12px 14px', borderRadius: 10, minHeight: 64 };
const small: CSSProperties = { fontSize: 'var(--fs-caption)', color: 'var(--muted)', fontWeight: 400 };

/** Drei große Karten: nominal, ordinal, metrisch – je mit einem kleinen Beispiel der Ausprägungen. */
function LevelCards({ label, value, onPick }: { label: string; value: Level | ''; onPick: (l: Level) => void }) {
  return <div className="s05-level-cards" role="group" aria-label={label} style={grid}>
    {LEVELS.map(l => <button key={l} type="button" aria-pressed={value === l} onClick={() => onPick(l)} style={cardBtn}>
      <strong>{l}</strong>
      <span style={{ fontWeight: 400 }}>{LEVEL_INFO[l].line}</span>
      <span style={small}>z. B. {LEVEL_INFO[l].example}</span>
    </button>)}
  </div>;
}

/** Entscheidungspfad: Skalenniveau der Zufriedenheit → Skalenniveau des Kandidaten → Zusammenhangsmaß.
 *  Schreibt dieselben Felder wie bisher (level, measure); passende Maße leuchten, unpassende sind ausgegraut und lassen sich bewusst trotzdem wählen. */
export function MeasurePath({ card, outcomeLevel, level, measure, onOutcome, onLevel, onMeasure }: {
  card: Card; outcomeLevel: Level | ''; level: Level | ''; measure: MeasureId | '';
  onOutcome: (l: Level) => void; onLevel: (l: Level) => void; onMeasure: (m: MeasureId) => void;
}) {
  const [others, setOthers] = useState(false);
  const chosenMisfits = Boolean(measure && !measureFit(level, measure).fits);
  const showOthers = others || chosenMisfits;
  const misfits = MEASURE_IDS.filter(m => !measureFit(level, m).fits);
  return <div className="s05-path">
    <p className="task-prompt">Welches Skalenniveau haben deine beiden Variablen? Zuerst die Demokratiezufriedenheit: Welche Ausprägungen hat ps03 (1 sehr zufrieden … 6 sehr unzufrieden)?</p>
    <p className="task-field-help" style={{ margin: '0 0 8px' }}>Klick die passende Karte an. Du kannst jederzeit umentscheiden.</p>
    <LevelCards label="Skalenniveau der Demokratiezufriedenheit" value={outcomeLevel} onPick={onOutcome} />
    <Feedback notes={checkOutcomeLevel(outcomeLevel)} />

    {(outcomeLevel || level) && <>
      <p className="task-prompt">Und dein Kandidat „{card.title}“: Welche Ausprägungen hat er? Schau im Codebuch nach.</p>
      <LevelCards label="Skalenniveau des Kandidaten" value={level} onPick={onLevel} />
      <Feedback notes={checkLevel(card, level)} />
    </>}

    {(level || measure) && <>
      <p className="task-prompt">Welches Zusammenhangsmaß nimmst du?</p>
      <p className="task-field-help" style={{ margin: '0 0 8px' }}>{level ? `Grün markiert: passt zu „${level}“. Klick eine Karte an.` : 'Klick eine Karte an.'}</p>
      <div className="s05-measure-cards" role="group" aria-label="Zusammenhangsmaß" style={grid}>
        {MEASURE_IDS.map(m => {
          const fit = measureFit(level, m);
          const style: CSSProperties = fit.fits
            ? { ...cardBtn, borderLeft: level ? '5px solid var(--green)' : undefined }
            : { ...cardBtn, borderStyle: 'dashed' };
          return <button key={m} type="button" className={fit.fits ? 'fits' : 'misfit'} aria-pressed={measure === m} disabled={!fit.fits && !showOthers}
            onClick={() => onMeasure(m)} style={style}>
            <strong>{measureLabel(m)} <code style={{ fontWeight: 400, fontSize: 'var(--fs-caption)' }}>{MEASURES[m].r}()</code></strong>
            <span style={{ fontSize: 'var(--fs-caption)', fontWeight: 400 }}>{MEASURE_INFO[m].line}</span>
            {!fit.fits && <span style={small}>Passt nicht: {fit.reason}</span>}
          </button>;
        })}
      </div>
      {misfits.length > 0 && !showOthers && <button type="button" className="sandbox-link" onClick={() => setOthers(true)}>Anderes Maß trotzdem wählen</button>}
    </>}
  </div>;
}
