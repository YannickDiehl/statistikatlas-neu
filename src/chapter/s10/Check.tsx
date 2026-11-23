// Sitzung 10: local answer blocks. The shared `Questions` block gives one hint per question; this chapter's plan has
// special cases (Sonderfälle) for typed values and a text per wrong option, plus a resolution after the prediction.
// Answers are saved in the chapter state like in `Questions`, so `chapterStatus` sees them.
import { useState, type FormEvent, type ReactNode } from 'react';
import { answerNumbers, judge } from '../answers';
import { useChapterState } from '../ChapterContext';
import { Part } from '../blocks/ChapterLayout';
import { scriptHref } from '../blocks/TakeAway';
import { useAnnounce } from '../blocks/announce';
import { withCode } from '../blocks/rich';
import type { S10Question, SelfTestItem } from './content';

/** Feedback for a wrong answer: the matching special case (then the hint), the text of the wrong option, or the hint. */
export function wrongText(q: S10Question, input: string): string {
  if (q.kind === 'choice') return q.wrong?.[input] ?? q.hint;
  const readings = answerNumbers(input);
  const hit = q.cases?.find(c => readings.some(x => Math.abs(x - c.value) <= (c.tolerance ?? q.tolerance ?? 0) + 1e-9));
  return hit ? `${hit.text} ${q.hint}` : q.hint;
}

type Checked = Record<string, string> | null;

/**
 * Answer questions of a task or a „Kurz überlegen“ with numbers. One line per question („✓ / ✗ / •“), the earlier
 * prediction and, once no question is open, the resolution.
 */
export function TaskQuestions({ id, questions, predictionId, resolution, submitLabel = 'Antworten prüfen' }: {
  id: string;
  questions: S10Question[];
  predictionId?: string;
  resolution?: string;
  submitLabel?: string;
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

  const results = questions.map(q => (checked ? judge(q, checked[q.id]) : 'open'));
  const allRight = !!checked && results.every(r => r === 'right');
  const noneOpen = !!checked && results.every(r => r !== 'open');
  const prediction = predictionId ? state.predictions[predictionId] : undefined;
  const set = (qid: string, v: string) => setDraft(d => ({ ...d, [qid]: v }));
  const single = questions.length === 1;

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
    <div className="reihe-knoepfe"><button type="submit" className="knopf">{submitLabel}</button></div>
    <div className={`rueck${checked ? (allRight ? ' ok' : ' no') : ''}`} aria-live="polite">
      {checked ? <>
        {questions.map((q, i) => {
          const r = results[i];
          const name = q.short ?? q.label;
          const text = single
            ? (r === 'open' ? 'Gib zuerst eine Zahl ein.' : r === 'right' ? `Richtig. ${q.right}` : `Noch nicht. ${wrongText(q, checked[q.id])}`)
            : (r === 'open' ? `• ${name}: noch offen.` : r === 'right' ? `✓ ${name}: ${q.right}` : `✗ ${name}: ${wrongText(q, checked[q.id])}`);
          return <div key={q.id} id={`${id}-${q.id}-r`} className={r}>{withCode(text)}</div>;
        })}
        {prediction ? <div className="festlegung">{`Deine Festlegung vorher war: ${prediction}.`}</div> : null}
        {prediction && resolution && noneOpen ? <div className="aufloesung">{withCode(`Auflösung: ${resolution}`)}</div> : null}
        {allRight && !single ? <div>Alles richtig.</div> : null}
      </> : null}
    </div>
  </form>;
}

/** „Kurz überlegen“ with a number field and „Prüfen“. */
export function NumberThink({ question }: { question: S10Question }) {
  return <div className="kurzueberlegen">
    <p>Kurz überlegen</p>
    <TaskQuestions id={`${question.id}-q`} questions={[question]} submitLabel="Prüfen" />
  </div>;
}

type Shown = { kind: 'answer'; value: string } | { kind: 'error' } | null;

/** „Kurz überlegen“ with radios and „Auflösen“: a text per wrong option, `after` once answered. Saved like other answers. */
export function ChoiceThink({ question, after }: { question: S10Question; after?: ReactNode }) {
  const { id } = question;
  const { state, setAnswers } = useChapterState();
  const saved = state.answers[id] ?? '';
  const [draft, setDraft] = useState(saved);
  const [shown, announce] = useAnnounce<Shown>(saved ? { kind: 'answer', value: saved } : null, null);
  if (question.kind !== 'choice') throw new Error(`ChoiceThink: ${id} is not a choice question.`);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!draft) { announce({ kind: 'error' }); return; }
    setAnswers({ [id]: draft });
    announce({ kind: 'answer', value: draft });
  }

  const result = shown?.kind === 'answer' ? judge(question, shown.value) : 'open';
  const text = shown?.kind === 'error' ? 'Leg dich zuerst fest.'
    : shown?.kind === 'answer' ? (result === 'right' ? `Richtig. ${question.right}` : `Noch nicht. ${wrongText(question, shown.value)}`) : '';
  const cls = shown?.kind === 'error' || result === 'wrong' ? ' no' : result === 'right' ? ' ok' : '';

  return <form className="kurzueberlegen" id={id} noValidate onSubmit={submit}>
    <fieldset role="radiogroup" aria-labelledby={`${id}-l`} aria-invalid={result === 'wrong' || undefined} aria-describedby={text ? `${id}-r` : undefined}>
      <legend id={`${id}-l`}><span className="kue">Kurz überlegen:</span> {withCode(question.label)}</legend>
      <div className="radios">{question.options.map(o => <label key={o.value}>
        <input type="radio" name={`${id}-wahl`} value={o.value} checked={draft === o.value} onChange={() => setDraft(o.value)} /> {withCode(o.label)}
      </label>)}</div>
    </fieldset>
    <div className="reihe-knoepfe"><button type="submit" className="knopf">Auflösen</button></div>
    <p className={`rueck${cls}`} id={`${id}-r`} aria-live="polite">{withCode(text)}</p>
    {saved ? after : null}
  </form>;
}

/** „Kurz überlegen“ with „Festlegen“: the same feedback for every choice, then `children` (the picture) is revealed. */
export function GuessReveal({ id, label, options, feedback, children }: {
  id: string; label: string; options: string[]; feedback: (picked: string) => string; children?: ReactNode;
}) {
  const { state, setAnswers } = useChapterState();
  const saved = state.answers[id] ?? '';
  const [draft, setDraft] = useState(saved);
  const [error, announceError] = useAnnounce('', '');

  function submit(e: FormEvent) {
    e.preventDefault();
    if (saved) return;
    if (!draft) { announceError('Leg dich zuerst fest.'); return; }
    setAnswers({ [id]: draft });
  }

  return <>
    <form className="kurzueberlegen" id={id} noValidate onSubmit={submit}>
      <fieldset role="radiogroup" aria-labelledby={`${id}-l`} aria-describedby={`${id}-r`}>
        <legend id={`${id}-l`}><span className="kue">Kurz überlegen:</span> {label}</legend>
        <div className="radios">{options.map(o => <label key={o}>
          <input type="radio" name={`${id}-wahl`} value={o} checked={(saved || draft) === o} disabled={!!saved} onChange={() => setDraft(o)} /> {o}
        </label>)}</div>
      </fieldset>
      <div className="reihe-knoepfe"><button type="submit" className="knopf" aria-disabled={!!saved || undefined}>Festlegen</button></div>
      <p className={`rueck${error && !saved ? ' no' : saved ? ' fest' : ''}`} id={`${id}-r`} aria-live="polite">{saved ? feedback(saved) : error}</p>
    </form>
    {saved ? children : <p className="hilfe-zeile">Das Bild erscheint, sobald du dich festgelegt hast.</p>}
  </>;
}

/* ---------- Mitnehmen ---------- */

function SelfTestQuestion({ n, item }: { n: number; item: SelfTestItem }) {
  const [choice, setChoice] = useState<number | null>(null);
  const [feedback, announce] = useAnnounce<{ ok: boolean | null; text: string }>({ ok: null, text: '' }, { ok: null, text: '' });

  function submit(e: FormEvent) {
    e.preventDefault();
    if (choice === null) { announce({ ok: false, text: 'Wähl zuerst eine Antwort.' }); return; }
    const ok = choice === item.answer;
    announce({ ok, text: `${ok ? 'Richtig. ' : 'Noch nicht. '}Deine Wahl: „${item.options[choice].text}“. ${item.options[choice].why}` });
  }

  return <form className="frage selbst" onSubmit={submit}>
    <fieldset>
      <legend>{withCode(`${n}. ${item.question}`)}</legend>
      <div className="radios">{item.options.map((o, k) => <label key={k}>
        <input type="radio" name={`selbsttest-${n}`} value={k} checked={choice === k} onChange={() => setChoice(k)} /> {o.text}
      </label>)}</div>
    </fieldset>
    <div className="reihe-knoepfe"><button type="submit" className="knopf hell">Prüfen</button></div>
    <p className={`rueck${feedback.ok === null ? '' : feedback.ok ? ' ok' : ' no'}`} aria-live="polite">{feedback.text}</p>
  </form>;
}

/**
 * „Zum Schluss: Mitnehmen“ like the shared `TakeAway`, but the self-test gives a reason for every option
 * (the shared `SelfTestItem` has one reason per question).
 */
export function TakeAway10({ points, selfTest, script, scriptName, more }: {
  points: ReactNode[]; selfTest: SelfTestItem[]; script: string; scriptName: string; more: { href: string; label: string };
}) {
  return <>
    <Part id="mitnehmen" tone="green" title="Zum Schluss: Mitnehmen" />
    <section className="wichtig" id="wichtig" aria-labelledby="wichtig-h">
      <h4 id="wichtig-h">Das Wichtigste aus dieser Sitzung</h4>
      <ul>{points.map((p, i) => <li key={i}>{p}</li>)}</ul>
    </section>
    <section className="karte" id="selbsttest" aria-labelledby="selbsttest-h">
      <div className="karte-kopf">
        <span className="st m c2" aria-hidden="true">✓</span>
        <h4 id="selbsttest-h">Prüf dich selbst</h4>
        <span className="art deuten">{`${selfTest.length} Fragen`}</span>
      </div>
      {selfTest.map((item, i) => <SelfTestQuestion key={i} n={i + 1} item={item} />)}
    </section>
    <section className="karte" id="skript" aria-labelledby="skript-h">
      <div className="karte-kopf"><span className="st m c2" aria-hidden="true">R</span><h4 id="skript-h">Dein Skript zum Mitnehmen</h4></div>
      <p>Alle Vorlagen dieser Sitzung in einer Datei, mit Kommentaren. Öffne sie in RStudio und führe sie Block für Block aus.</p>
      <div className="reihe-knoepfe">
        <a className="knopf" href={scriptHref(script)} download={scriptName}>{`Skript herunterladen (${scriptName})`}</a>
        <a className="mehr" href={more.href} target="_blank" rel="noreferrer">{`→ ${more.label}`}</a>
      </div>
    </section>
  </>;
}
