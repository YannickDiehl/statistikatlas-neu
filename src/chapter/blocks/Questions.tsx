import { useState, type FormEvent } from 'react';
import { judgeWithFeedback, type Question } from '../answers';
import { useChapterState } from '../ChapterContext';
import { useAnnounce } from './announce';
import { withCode } from './rich';

type Checked = Record<string, string> | null;

/**
 * Answer questions of a task. „Antworten prüfen“ saves the answers in the chapter state and shows one line per question
 * („✓ / ✗ / • Frage: …“), the earlier prediction and „Alles richtig.“. Saved answers are checked again on reload.
 * A wrong answer shows its own feedback from `specialInput` (number) or `wrongByOption` (choice) when there is one, else `hint`.
 */
export function Questions({ id, questions, predictionId }: { id: string; questions: Question[]; predictionId?: string }) {
  const { state, setAnswers } = useChapterState();
  const saved = Object.fromEntries(questions.map(q => [q.id, state.answers[q.id] ?? ''])) as Record<string, string>;
  const hasSaved = Object.values(saved).some(v => v.trim() !== '');
  const [draft, setDraft] = useState<Record<string, string>>(saved);
  const [checked, announce] = useAnnounce<Checked>(hasSaved ? saved : null, null);

  function submit(e: FormEvent) {
    e.preventDefault();
    const snapshot = Object.fromEntries(questions.map(q => [q.id, (draft[q.id] ?? '').trim()]));
    setAnswers(snapshot);
    announce(snapshot);
  }

  const judged = questions.map(q => (checked ? judgeWithFeedback(q, checked[q.id]) : { result: 'open' as const, text: '' }));
  const results = judged.map(j => j.result);
  const allRight = !!checked && results.every(r => r === 'right');
  const prediction = predictionId ? state.predictions[predictionId] : undefined;
  const set = (qid: string, v: string) => setDraft(d => ({ ...d, [qid]: v }));

  return <form className="fragen" id={id} noValidate onSubmit={submit}>
    {questions.map((q, i) => {
      const fid = `${id}-${q.id}`;
      const wrong = results[i] === 'wrong' || undefined;
      const describedBy = [q.help ? `${fid}-hilfe` : '', checked ? `${fid}-r` : ''].filter(Boolean).join(' ') || undefined;
      const help = q.help ? <span className="hilfe-zeile" id={`${fid}-hilfe`}>{withCode(q.help)}</span> : null;
      if (q.kind === 'number') return <div className="frage feld" key={q.id}>
        <label htmlFor={fid}>{withCode(q.label)}</label>
        <input type="text" id={fid} inputMode="decimal" autoComplete="off" value={draft[q.id] ?? ''}
          onChange={e => set(q.id, e.target.value)} aria-invalid={wrong} aria-describedby={describedBy} />
        {help}
      </div>;
      return <fieldset className="frage" key={q.id} role="radiogroup" aria-labelledby={`${fid}-l`} aria-invalid={wrong} aria-describedby={describedBy}>
        <legend id={`${fid}-l`}>{withCode(q.label)}</legend>
        <div className="radios">{q.options.map(o => <label key={o.value}>
          <input type="radio" name={fid} value={o.value} checked={draft[q.id] === o.value} onChange={() => set(q.id, o.value)} /> {withCode(o.label)}
        </label>)}</div>
        {help}
      </fieldset>;
    })}
    <div className="reihe-knoepfe"><button type="submit" className="knopf">Antworten prüfen</button></div>
    <div className={`rueck${checked ? (allRight ? ' ok' : ' no') : ''}`} aria-live="polite">
      {checked ? <>
        {questions.map((q, i) => {
          const r = results[i];
          const name = q.short ?? q.label;
          const text = r === 'open' ? `• ${name}: noch offen.` : r === 'right' ? `✓ ${name}: ${q.right}` : `✗ ${name}: ${judged[i].text}`;
          return <div key={q.id} id={`${id}-${q.id}-r`} className={r}>{withCode(text)}</div>;
        })}
        {prediction ? <div className="festlegung">{`Deine Festlegung vorher war: ${prediction}.`}</div> : null}
        {allRight ? <div>Alles richtig.</div> : null}
      </> : null}
    </div>
  </form>;
}
