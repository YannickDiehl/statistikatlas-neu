import { useRef, useState, type FormEvent, type ReactNode } from 'react';
import { judge, type Question } from '../answers';
import { useChapterState } from '../ChapterContext';
import { useAnnounce } from './announce';
import { useFocusLater } from './focus';
import { withCode } from './rich';

type Shown = { kind: 'answer'; value: string } | { kind: 'error' } | null;

/**
 * „Kurz überlegen“ with radios and „Auflösen“, as in the prototype's foundation questions. Unlike the `Questions` block
 * it gives a feedback text per wrong option (`wrong`), shows `after` once answered and can offer a reset
 * („Wieder 22 Stunden“). The answer is saved in the chapter state like every other answer and checked again on reload.
 */
export function ChoiceCheck({ question, wrong, after, resetLabel }: {
  /** A choice question; a number question is a programming error. */
  question: Question;
  wrong?: Record<string, string>;
  /** Shown below the feedback once an answer is given (e.g. „So liest du das“). */
  after?: ReactNode;
  /** With an answer: a button that takes it back. */
  resetLabel?: string;
}) {
  const { id } = question;
  const { state, setAnswers } = useChapterState();
  const saved = state.answers[id] ?? '';
  const [draft, setDraft] = useState(saved);
  const [shown, announce] = useAnnounce<Shown>(saved ? { kind: 'answer', value: saved } : null, null);
  const first = useRef<HTMLInputElement>(null);
  const focusLater = useFocusLater();
  // After all hooks: a number question here is a programming error.
  if (question.kind !== 'choice') throw new Error(`ChoiceCheck: ${id} is not a choice question.`);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!draft) { announce({ kind: 'error' }); return; }
    setAnswers({ [id]: draft });
    announce({ kind: 'answer', value: draft });
  }

  function reset() {
    setAnswers({ [id]: '' });
    setDraft('');
    announce(null);
    focusLater(() => first.current);
  }

  const answered = saved !== '';
  const result = shown?.kind === 'answer' ? judge(question, shown.value) : 'open';
  const text = shown?.kind === 'error' ? 'Leg dich zuerst fest.'
    : shown?.kind === 'answer' ? (result === 'right' ? `Richtig. ${question.right}` : `Noch nicht. ${wrong?.[shown.value] ?? question.hint}`)
      : '';
  const cls = shown?.kind === 'error' || result === 'wrong' ? ' no' : result === 'right' ? ' ok' : '';

  return <form className="kurzueberlegen" id={id} noValidate onSubmit={submit}>
    <fieldset role="radiogroup" aria-labelledby={`${id}-l`} aria-invalid={result === 'wrong' || undefined} aria-describedby={text ? `${id}-r` : undefined}>
      <legend id={`${id}-l`}>{withCode(question.label)}</legend>
      <div className="radios">{question.options.map((o, i) => <label key={o.value}>
        <input type="radio" name={`${id}-wahl`} value={o.value} ref={i === 0 ? first : undefined} checked={draft === o.value}
          onChange={() => setDraft(o.value)} /> {withCode(o.label)}
      </label>)}</div>
    </fieldset>
    <div className="reihe-knoepfe">
      <button type="submit" className="knopf">Auflösen</button>
      {resetLabel && answered ? <button type="button" className="knopf hell" onClick={reset}>{resetLabel}</button> : null}
    </div>
    <p className={`rueck${cls}`} id={`${id}-r`} aria-live="polite">{text}</p>
    {answered ? after : null}
  </form>;
}
