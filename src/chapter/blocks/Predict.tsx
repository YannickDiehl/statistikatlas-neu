import { useState, type FormEvent, type ReactNode } from 'react';
import { useChapterState } from '../ChapterContext';
import { useAnnounce } from './announce';

/**
 * „Erst festlegen“: a prediction before the task, saved in `predictions[id]` and quoted when the answers are checked.
 * With `options` a radio group, without a text field. Once fixed it cannot be changed.
 */
export function Predict({ id, prompt, options }: { id: string; prompt: ReactNode; options?: string[] }) {
  const { state, setPrediction } = useChapterState();
  const saved = state.predictions[id] ?? '';
  const [local, setLocal] = useState('');
  const fixedValue = saved || local;
  const fixed = fixedValue !== '';
  const [choice, setChoice] = useState('');
  const [error, announceError] = useAnnounce('', '');

  function submit(e: FormEvent) {
    e.preventDefault();
    if (fixed) return;
    const v = choice.trim();
    if (!v) { announceError('Leg dich zuerst fest.'); return; }
    setLocal(v);
    setPrediction(id, v);
  }

  const shown = fixed ? fixedValue : choice;
  return <form className="festlegen" onSubmit={submit}>
    {options
      ? <fieldset>
          <legend><b>Erst festlegen:</b> {prompt}</legend>
          <div className="radios">{options.map(o => <label key={o}>
            <input type="radio" name={`${id}-f`} value={o} checked={shown === o} disabled={fixed} onChange={() => setChoice(o)} /> {o}
          </label>)}</div>
        </fieldset>
      : <div className="feld">
          <label htmlFor={`${id}-f`}><b>Erst festlegen:</b> {prompt}</label>
          <input type="text" id={`${id}-f`} inputMode="numeric" autoComplete="off" value={shown} readOnly={fixed} onChange={e => setChoice(e.target.value)} />
        </div>}
    <div className="reihe-knoepfe"><button type="submit" className="knopf" aria-disabled={fixed || undefined}>Tipp abgeben</button></div>
    <p className={`rueck${error ? ' no' : fixed ? ' fest' : ''}`} aria-live="polite">
      {fixed ? `Festgelegt: ${fixedValue}. Die Auflösung bekommst du, wenn du am Ende der Aufgabe deine Antworten prüfst.` : error}
    </p>
  </form>;
}
