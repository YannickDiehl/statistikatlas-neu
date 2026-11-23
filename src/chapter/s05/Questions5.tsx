import { useState, type FormEvent, type ReactNode } from 'react';
import { useChapterState } from '../ChapterContext';
import { useAnnounce } from '../blocks/announce';
import { withCode } from '../blocks/rich';
import { judge5, resolutionVisible, wrongText } from './check';
import type { Q5 } from './content';

type Checked = Record<string, string> | null;
type Block = { kind: 'one'; q: Q5 } | { kind: 'group'; label: string; items: Q5[] };

function blocks(questions: Q5[]): Block[] {
  const out: Block[] = [];
  for (const q of questions) {
    const last = out[out.length - 1];
    if (q.group && last?.kind === 'group' && last.label === q.group) last.items.push(q);
    else out.push(q.group ? { kind: 'group', label: q.group, items: [q] } : { kind: 'one', q });
  }
  return out;
}

/**
 * Antwortfragen wie der Baustein `Questions`, für diese Sitzung erweitert (Baustein bleibt unverändert):
 * Rückmeldung je typischem falschem Wert (`wrong`), ganze Zahlen ±0,55 (`whole`), Zuordnen mit Auswahlfeldern
 * in einer Gruppe (`group`) und ein Satz zur Auflösung der Festlegung (`resolve`).
 */
export function Questions5({ id, questions, predictionId, resolve, button = 'Antworten prüfen' }: {
  id: string;
  questions: Q5[];
  predictionId?: string;
  /** Satz nach „Deine Festlegung vorher war: …“. */
  resolve?: string;
  button?: string;
}) {
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

  const result = (q: Q5) => (checked ? judge5(q, checked[q.id]) : 'open');
  const allRight = !!checked && questions.every(q => result(q) === 'right');
  const prediction = predictionId ? state.predictions[predictionId] : undefined;
  const set = (qid: string, v: string) => setDraft(d => ({ ...d, [qid]: v }));
  const fid = (q: Q5) => `${id}-${q.id}`;
  const describedBy = (q: Q5) => [q.help ? `${fid(q)}-hilfe` : '', checked ? `${fid(q)}-r` : ''].filter(Boolean).join(' ') || undefined;
  const help = (q: Q5) => q.help ? <span className="hilfe-zeile" id={`${fid(q)}-hilfe`}>{withCode(q.help)}</span> : null;
  const wrong = (q: Q5) => result(q) === 'wrong' || undefined;

  function field(q: Q5): ReactNode {
    if (q.kind === 'number') return <div className="frage feld" key={q.id}>
      <label htmlFor={fid(q)}>{withCode(q.label)}</label>
      <input type="text" id={fid(q)} inputMode="decimal" autoComplete="off" value={draft[q.id] ?? ''}
        onChange={e => set(q.id, e.target.value)} aria-invalid={wrong(q)} aria-describedby={describedBy(q)} />
      {help(q)}
    </div>;
    if (q.group) return <div className="frage feld" key={q.id}>
      <label htmlFor={fid(q)}>{withCode(q.label)}</label>
      <select id={fid(q)} value={draft[q.id] ?? ''} aria-invalid={wrong(q)} aria-describedby={describedBy(q)} onChange={e => set(q.id, e.target.value)}>
        <option value="">wählen</option>
        {q.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {help(q)}
    </div>;
    return <fieldset className="frage" key={q.id} role="radiogroup" aria-labelledby={`${fid(q)}-l`} aria-invalid={wrong(q)} aria-describedby={describedBy(q)}>
      <legend id={`${fid(q)}-l`}>{withCode(q.label)}</legend>
      <div className="radios">{q.options.map(o => <label key={o.value}>
        <input type="radio" name={fid(q)} value={o.value} checked={draft[q.id] === o.value} onChange={() => set(q.id, o.value)} /> {withCode(o.label)}
      </label>)}</div>
      {help(q)}
    </fieldset>;
  }

  return <form className="fragen" id={id} noValidate onSubmit={submit}>
    {blocks(questions).map((b, i) => b.kind === 'one' ? field(b.q)
      : <fieldset className="frage s5-gruppe" key={`g${i}`}><legend>{withCode(b.label)}</legend>{b.items.map(field)}</fieldset>)}
    <div className="reihe-knoepfe"><button type="submit" className="knopf">{button}</button></div>
    <div className={`rueck${checked ? (allRight ? ' ok' : ' no') : ''}`} aria-live="polite">
      {checked ? <>
        {questions.map(q => {
          const r = result(q);
          const name = q.short ?? q.label;
          const text = r === 'open' ? `• ${name}: noch offen.` : r === 'right' ? `✓ ${name}: ${q.right}` : `✗ ${name}: ${wrongText(q, checked[q.id])}`;
          return <div key={q.id} id={`${fid(q)}-r`} className={r}>{withCode(text)}</div>;
        })}
        {prediction && resolutionVisible(questions, checked) ? <div className="festlegung">{`Deine Festlegung vorher war: ${prediction}.${resolve ? ` ${resolve}` : ''}`}</div> : null}
        {allRight ? <div>Alles richtig.</div> : null}
      </> : null}
    </div>
  </form>;
}
