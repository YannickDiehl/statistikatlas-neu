// Sitzung 9: lokale Bausteine. TaskQuestions und QuickCheck arbeiten wie `Questions` und `ChoiceCheck` aus Sitzung 4,
// geben aber je Sonderfall eine eigene Rückmeldung (feedbackFor) und zeigen nach dem Prüfen die Auflösung der Festlegung.
import { useState, type FormEvent } from 'react';
import { useChapterState } from '../ChapterContext';
import { useAnnounce } from '../blocks/announce';
import { CodeWorkshop } from '../workshop/CodeWorkshop';
import { ERROR_HELP, ERROR_HELP_CAPTION, ERROR_HELP_TITLE, TEMPLATES, type Rich, type S9Question } from './content';
import { feedbackFor, rich } from './check';

/** A workshop for one template of `TEMPLATES` (id = template key). */
export function Workshop({ k, live = false }: { k: string; live?: boolean }) {
  const t = TEMPLATES[k];
  return <CodeWorkshop id={k} title={t.title} template={t.code} live={live} tryOut={t.tryOut} />;
}

type Checked = Record<string, string> | null;

/**
 * Answer questions of a task. „Antworten prüfen“ saves the answers and shows one line per question
 * („✓ / ✗ / • Frage: …“, with the special feedback of the plan), then the earlier prediction and its resolution.
 */
export function TaskQuestions({ id, questions, prediction }: {
  id: string;
  questions: S9Question[];
  prediction?: { id: string; resolution: string };
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

  const results = questions.map(q => (checked ? feedbackFor(q, checked[q.id]) : { result: 'open' as const, text: '' }));
  const allRight = !!checked && results.every(r => r.result === 'right');
  /** The resolution of the prediction only appears once no question of the task is open. */
  const noneOpen = !!checked && results.every(r => r.result !== 'open');
  const predicted = prediction ? state.predictions[prediction.id] : undefined;
  const set = (qid: string, v: string) => setDraft(d => ({ ...d, [qid]: v }));

  return <form className="fragen" id={id} noValidate onSubmit={submit}>
    {questions.map((q, i) => {
      const fid = `${id}-${q.id}`;
      const wrong = results[i].result === 'wrong' || undefined;
      const describedBy = [q.help ? `${fid}-hilfe` : '', checked ? `${fid}-r` : ''].filter(Boolean).join(' ') || undefined;
      const help = q.help ? <span className="hilfe-zeile" id={`${fid}-hilfe`}>{rich(q.help)}</span> : null;
      if (q.kind === 'number') return <div className="frage feld" key={q.id}>
        <label htmlFor={fid}>{rich(q.label)}</label>
        <input type="text" id={fid} inputMode="decimal" autoComplete="off" value={draft[q.id] ?? ''}
          onChange={e => set(q.id, e.target.value)} aria-invalid={wrong} aria-describedby={describedBy} />
        {help}
      </div>;
      return <fieldset className="frage" key={q.id} role="radiogroup" aria-labelledby={`${fid}-l`} aria-invalid={wrong} aria-describedby={describedBy}>
        <legend id={`${fid}-l`}>{rich(q.label)}</legend>
        <div className="radios">{q.options.map(o => <label key={o.value}>
          <input type="radio" name={fid} value={o.value} checked={draft[q.id] === o.value} onChange={() => set(q.id, o.value)} /> {rich(o.label)}
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
          const head = r.result === 'open' ? '•' : r.result === 'right' ? '✓' : '✗';
          return <div key={q.id} id={`${id}-${q.id}-r`} className={r.result}>{`${head} ${name}: `}{r.result === 'open' ? 'noch offen.' : rich(r.text)}</div>;
        })}
        {noneOpen && predicted ? <div className="festlegung">{`Deine Festlegung vorher war: ${predicted}.`}</div> : null}
        {noneOpen && prediction ? <div className="festlegung">{`Auflösung: ${prediction.resolution}`}</div> : null}
        {allRight ? <div>Alles richtig.</div> : null}
      </> : null}
    </div>
  </form>;
}

type Shown = { kind: 'answer'; value: string } | { kind: 'error' } | null;

/**
 * „Kurz überlegen“ in a foundation: one number field („Prüfen“) or radios („Auflösen“), feedback with special cases.
 * The answer is saved in the chapter state like every other answer and checked again on reload.
 */
export function QuickCheck({ question }: { question: S9Question }) {
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

  const fb = shown?.kind === 'answer' ? feedbackFor(question, shown.value) : null;
  const text = shown?.kind === 'error' ? (question.kind === 'choice' ? 'Leg dich zuerst fest.' : 'Trag zuerst eine Zahl ein.')
    : fb ? (fb.result === 'right' ? `Richtig. ${fb.text}` : fb.result === 'wrong' ? `Noch nicht. ${fb.text}` : 'Das lese ich nicht als Zahl. Schreib zum Beispiel 4,5.')
      : '';
  const bad = shown?.kind === 'error' || (fb && fb.result !== 'right');
  const cls = bad ? ' no' : fb?.result === 'right' ? ' ok' : '';
  const describedBy = [question.help ? `${id}-hilfe` : '', text ? `${id}-r` : ''].filter(Boolean).join(' ') || undefined;

  return <form className="kurzueberlegen" id={id} noValidate onSubmit={submit}>
    {question.kind === 'number'
      ? <div className="feld">
          <label htmlFor={`${id}-feld`}>{rich(question.label)}</label>
          <input type="text" id={`${id}-feld`} inputMode="decimal" autoComplete="off" value={draft}
            onChange={e => setDraft(e.target.value)} aria-invalid={fb?.result === 'wrong' || undefined} aria-describedby={describedBy} />
          {question.help ? <span className="hilfe-zeile" id={`${id}-hilfe`}>{rich(question.help)}</span> : null}
        </div>
      : <fieldset role="radiogroup" aria-labelledby={`${id}-l`} aria-invalid={fb?.result === 'wrong' || undefined} aria-describedby={describedBy}>
          <legend id={`${id}-l`}>{rich(question.label)}</legend>
          <div className="radios">{question.options.map(o => <label key={o.value}>
            <input type="radio" name={`${id}-wahl`} value={o.value} checked={draft === o.value} onChange={() => setDraft(o.value)} /> {rich(o.label)}
          </label>)}</div>
        </fieldset>}
    <div className="reihe-knoepfe"><button type="submit" className="knopf">{question.kind === 'number' ? 'Prüfen' : 'Auflösen'}</button></div>
    <p className={`rueck${cls}`} id={`${id}-r`} aria-live="polite">{rich(text)}</p>
  </form>;
}

function richParts(parts: Rich) {
  return parts.map((p, i) => typeof p === 'string' ? p : <code key={i}>{p.code}</code>);
}

/** „Hilfe: R meldet einen Fehler“ at the end of every task (closed details with a table). */
export function ErrorHelp() {
  return <details className="hilfe">
    <summary>{ERROR_HELP_TITLE}</summary>
    <table className="daten">
      <caption>{ERROR_HELP_CAPTION}</caption>
      <thead><tr><th scope="col">R meldet</th><th scope="col">Das hilft</th></tr></thead>
      <tbody>{ERROR_HELP.map((row, i) => <tr key={i}><td lang={i < 5 || i === 7 ? 'en' : undefined}>{richParts(row.says)}</td><td>{richParts(row.helps)}</td></tr>)}</tbody>
    </table>
  </details>;
}
