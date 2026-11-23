// Local „Kurz überlegen“ and answer blocks of session 3. The shared `Questions` block shows one hint per question;
// session 3 has extra hints for typical wrong numbers and per wrong option, so this file wraps it (no shared block changed).
import { useState, type FormEvent } from 'react';
import { judge } from '../answers';
import { useChapterState } from '../ChapterContext';
import { Questions } from '../blocks/Questions';
import { useAnnounce } from '../blocks/announce';
import { withCode } from '../blocks/rich';
import { hintFor, type TaskQuestion } from './content';

/**
 * The shared `Questions` block with hints that follow the saved answer: a special case („Das sind Raw %“) or the
 * feedback of the chosen option. `Questions` saves the answers on „Antworten prüfen“ and checks exactly those saved
 * answers, so the hint computed from the saved answer always belongs to the shown result.
 */
export function SmartQuestions({ id, questions, predictionId }: { id: string; questions: TaskQuestion[]; predictionId?: string }) {
  const { state } = useChapterState();
  const shaped = questions.map(q => ({ ...q, hint: hintFor(q, state.answers[q.id]) }));
  return <Questions id={id} questions={shaped} predictionId={predictionId} />;
}

type Shown = { kind: 'answer'; value: string } | { kind: 'error' } | null;

/**
 * „Kurz überlegen“ with radios and „Auflösen“ (port of session 4's ChoiceCheck): feedback per wrong option from
 * `wrongBy`, `after` once answered. Saved in the chapter state and checked again on reload, so pictures can react.
 */
export function ChoiceCheck({ question, after }: { question: TaskQuestion; after?: string }) {
  const { id } = question;
  const { state, setAnswers } = useChapterState();
  const saved = state.answers[id] ?? '';
  const [draft, setDraft] = useState(saved);
  const [shown, announce] = useAnnounce<Shown>(saved ? { kind: 'answer', value: saved } : null, null);
  if (question.kind !== 'choice') throw new Error(`ChoiceCheck: ${id} is not a choice question.`);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!draft) { announce({ kind: 'error' }); return; }
    setAnswers({ [id]: draft });
    announce({ kind: 'answer', value: draft });
  }

  const result = shown?.kind === 'answer' ? judge(question, shown.value) : 'open';
  const right = question.right.startsWith('Genau') ? question.right : `Richtig. ${question.right}`;
  const text = shown?.kind === 'error' ? 'Leg dich zuerst fest.'
    : shown?.kind === 'answer' ? (result === 'right' ? right : `Noch nicht. ${hintFor(question, shown.value)}`)
      : '';
  const cls = shown?.kind === 'error' || result === 'wrong' ? ' no' : result === 'right' ? ' ok' : '';

  return <form className="kurzueberlegen" id={id} noValidate onSubmit={submit}>
    <fieldset role="radiogroup" aria-labelledby={`${id}-l`} aria-invalid={result === 'wrong' || undefined} aria-describedby={text ? `${id}-r` : undefined}>
      <legend id={`${id}-l`}><span className="s3-ku">Kurz überlegen: </span>{withCode(question.label)}</legend>
      <div className="radios">{question.options.map(o => <label key={o.value}>
        <input type="radio" name={`${id}-wahl`} value={o.value} checked={draft === o.value} onChange={() => setDraft(o.value)} /> {withCode(o.label)}
      </label>)}</div>
    </fieldset>
    <div className="reihe-knoepfe"><button type="submit" className="knopf">Auflösen</button></div>
    <p className={`rueck${cls}`} id={`${id}-r`} aria-live="polite">{text}{after && shown?.kind === 'answer' ? ` ${after}` : ''}</p>
  </form>;
}

/** A number „Kurz überlegen“ with a check button: the shared answer block inside the yellow box. */
export function NumberCheck({ question }: { question: TaskQuestion }) {
  return <div className="kurzueberlegen">
    <p>Kurz überlegen</p>
    <SmartQuestions id={`${question.id}-q`} questions={[question]} />
  </div>;
}
