// Sitzung 8: Antwortprüfung mit Sonderfällen. Der gemeinsame Baustein `Questions` kennt nur eine Rückmeldung für falsch;
// der Plan von Sitzung 8 gibt zu bekannten Verwechslungen (ω statt α, gewichtetes N, Median statt Mittelwert …) eigene Texte.
// Gespeichert wird wie in `Questions` im Kapitelzustand, der Status rechnet weiter mit `judge()`.
import { useState, type FormEvent } from 'react';
import { answerNumbers, judge } from '../answers';
import { useChapterState } from '../ChapterContext';
import { useAnnounce } from '../blocks/announce';
import { withCode } from '../blocks/rich';
import type { S8Question } from './content';

export type Verdict = { result: 'open' | 'right' | 'wrong'; text: string };

/** Result and feedback text of one answer: the target first, then a second right option, then the special cases, else the hint. */
export function verdict(q: S8Question, input: string | undefined): Verdict {
  const text = (input ?? '').trim();
  const base = judge(q, text);
  if (base === 'open') return { result: 'open', text: '' };
  if (base === 'right') return { result: 'right', text: q.right };
  if (q.kind === 'choice') {
    const also = q.alsoRight?.find(a => a.value === text);
    if (also) return { result: 'right', text: also.text };
    const s = q.special?.find(x => x.match === text);
    return { result: 'wrong', text: s ? s.text : q.hint };
  }
  const readings = answerNumbers(text);
  const s = q.special?.find(x => typeof x.match === 'number' && readings.some(r => Math.abs(r - (x.match as number)) <= (x.tolerance ?? 0) + 1e-9));
  return { result: 'wrong', text: s ? s.text : q.hint };
}

type Checked = Record<string, string> | null;

/**
 * Answer questions at the end of a task, like the shared `Questions` block („✓ / ✗ / • Frage: …“, prediction, „Alles richtig.“),
 * but a wrong answer gets the text of its special case.
 */
export function TaskQuestions({ id, questions, predictionId }: { id: string; questions: S8Question[]; predictionId?: string }) {
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

  const verdicts = questions.map(q => (checked ? verdict(q, checked[q.id]) : { result: 'open' as const, text: '' }));
  const allRight = !!checked && verdicts.every(v => v.result === 'right');
  const prediction = predictionId ? state.predictions[predictionId] : undefined;
  const set = (qid: string, v: string) => setDraft(d => ({ ...d, [qid]: v }));

  return <form className="fragen" id={id} noValidate onSubmit={submit}>
    {questions.map((q, i) => {
      const fid = `${id}-${q.id}`;
      const wrong = verdicts[i].result === 'wrong' || undefined;
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
          const v = verdicts[i];
          const name = q.short ?? q.label;
          const text = v.result === 'open' ? `• ${name}: noch offen.` : `${v.result === 'right' ? '✓' : '✗'} ${name}: ${v.text}`;
          return <div key={q.id} id={`${id}-${q.id}-r`} className={v.result}>{withCode(text)}</div>;
        })}
        {prediction && verdicts.every(v => v.result !== 'open') ? <div className="festlegung">{`Deine Festlegung vorher war: ${prediction}.`}</div> : null}
        {allRight ? <div>Alles richtig.</div> : null}
      </> : null}
    </div>
  </form>;
}

type Shown = { kind: 'answer'; value: string } | { kind: 'error' } | null;

/**
 * „Kurz überlegen“ in a foundation: one question, radios with „Auflösen“ or a number field with „Prüfen“,
 * feedback per answer (special cases, a second right option). Saved in the chapter state like every other answer.
 */
export function QuickCheck({ question }: { question: S8Question }) {
  const { id } = question;
  const { state, setAnswers } = useChapterState();
  const saved = state.answers[id] ?? '';
  const [draft, setDraft] = useState(saved);
  const [shown, announce] = useAnnounce<Shown>(saved ? { kind: 'answer', value: saved } : null, null);

  function submit(e: FormEvent) {
    e.preventDefault();
    const v = draft.trim();
    if (!v) { announce({ kind: 'error' }); return; }
    setAnswers({ [id]: v });
    announce({ kind: 'answer', value: v });
  }

  const v = shown?.kind === 'answer' ? verdict(question, shown.value) : null;
  const text = shown?.kind === 'error' ? (question.kind === 'choice' ? 'Leg dich zuerst fest.' : 'Trag zuerst eine Zahl ein.')
    : v && v.result !== 'open' ? `${v.result === 'right' ? 'Richtig.' : 'Noch nicht.'} ${v.text}` : '';
  const bad = shown?.kind === 'error' || v?.result === 'wrong';
  const cls = bad ? ' no' : v?.result === 'right' ? ' ok' : '';
  const help = question.help ? <span className="hilfe-zeile" id={`${id}-hilfe`}>{withCode(question.help)}</span> : null;
  const describedBy = [question.help ? `${id}-hilfe` : '', text ? `${id}-r` : ''].filter(Boolean).join(' ') || undefined;

  return <form className="kurzueberlegen" id={id} noValidate onSubmit={submit}>
    {question.kind === 'choice'
      ? <fieldset role="radiogroup" aria-labelledby={`${id}-l`} aria-invalid={bad || undefined} aria-describedby={describedBy}>
          <legend id={`${id}-l`}>{withCode(`Kurz überlegen: ${question.label}`)}</legend>
          <div className="radios">{question.options.map(o => <label key={o.value}>
            <input type="radio" name={`${id}-wahl`} value={o.value} checked={draft === o.value} onChange={() => setDraft(o.value)} /> {withCode(o.label)}
          </label>)}</div>
        </fieldset>
      : <div className="frage feld">
          <label htmlFor={`${id}-feld`}>{withCode(`Kurz überlegen: ${question.label}`)}</label>
          <input type="text" id={`${id}-feld`} inputMode="decimal" autoComplete="off" value={draft}
            onChange={e => setDraft(e.target.value)} aria-invalid={bad || undefined} aria-describedby={describedBy} />
          {help}
        </div>}
    <div className="reihe-knoepfe"><button type="submit" className="knopf">{question.kind === 'choice' ? 'Auflösen' : 'Prüfen'}</button></div>
    <p className={`rueck${cls}`} id={`${id}-r`} aria-live="polite">{withCode(text)}</p>
  </form>;
}
