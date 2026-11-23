// Sitzung 11: kleine Bausteine, die nur dieses Kapitel braucht (Sonderfall-Rückmeldung, Festlegen mit Auflösung, Fehlerhilfe, Werkstatt).
import { useState, type FormEvent, type ReactNode, type SVGProps } from 'react';
import { useChapterState } from '../ChapterContext';
import { Questions } from '../blocks/Questions';
import { useAnnounce } from '../blocks/announce';
import { withCode } from '../blocks/rich';
import type { Question } from '../answers';
import { CodeWorkshop } from '../workshop/CodeWorkshop';
import { ERROR_HELP, ERROR_HELP_CAPTION, ERROR_HELP_TITLE, TEMPLATES, withSpecialHint, type Rich } from './content';

/* ---------- Zahlen ---------- */

/** German number with fixed decimals and a real minus sign („−1,07“). */
export const de = (x: number, d = 1) =>
  x.toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d }).replace('-', '−');
/** Whole number with German thousands separator („4.813“). */
export const whole = (x: number) => Math.round(x).toLocaleString('de-DE');

/** SVG text with the defaults of the chapter figures (Nunito 13, gray, centred). */
export function SvgText({ children, ...props }: SVGProps<SVGTextElement>) {
  return <text fontFamily="Nunito,sans-serif" fontSize={13} fill="#5F6A74" textAnchor="middle" {...props}>{children}</text>;
}

/* ---------- Werkstatt ---------- */

/** A workshop for one template of `TEMPLATES` (id = template key). */
export function Workshop({ k, live = false }: { k: string; live?: boolean }) {
  const t = TEMPLATES[k];
  return <CodeWorkshop id={k} title={t.title} template={t.code} live={live} tryOut={t.tryOut} />;
}

/* ---------- Antworten mit Sonderfällen ---------- */

/**
 * The shared `Questions` block, with the hint of each question chosen from the saved answer: a known wrong answer
 * (e.g. the proportion 0,94 instead of 94 %) gets its own hint. After „Antworten prüfen“ the saved answers equal
 * the checked ones, so the feedback line shows the matching hint.
 */
export function SpecialQuestions({ id, questions, predictionId }: { id: string; questions: Question[]; predictionId?: string }) {
  const { state } = useChapterState();
  return <Questions id={id} questions={questions.map(q => withSpecialHint(q, state.answers[q.id]))} predictionId={predictionId} />;
}

/** True once every question has a saved answer (after „Antworten prüfen“): no question of the task is open any more. */
export function useAllAnswered(questions: Question[]) {
  const { state } = useChapterState();
  return questions.every(q => (state.answers[q.id] ?? '').trim() !== '');
}

/**
 * Once no question of the task is open: what really came out („Tatsächlich …“). The `Questions` block above already quotes
 * the prediction („Deine Festlegung vorher war: …“), so this line only adds the resolution.
 */
export function Resolution({ predictionId, questions, text }: { predictionId: string; questions: Question[]; text: string }) {
  const { state } = useChapterState();
  const checked = useAllAnswered(questions);
  const prediction = state.predictions[predictionId];
  return <p className="rueck fest" aria-live="polite">{checked && prediction ? text : ''}</p>;
}

/* ---------- Kurz überlegen: festlegen, dann auflösen ---------- */

/**
 * „Kurz überlegen“ with radios: after „Festlegen“ (or another button label) the resolution appears, the same for
 * every choice, prefixed with „Deine Wahl: …“. Saved in the chapter state like every answer.
 */
export function RevealChoice({ id, label, options, resolution, button = 'Festlegen', after }: {
  id: string; label: string; options: string[]; resolution: string; button?: string; after?: ReactNode;
}) {
  const { state, setAnswers } = useChapterState();
  const saved = state.answers[id] ?? '';
  const [draft, setDraft] = useState(saved);
  const [shown, announce] = useAnnounce<string | null>(saved || null, null);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!draft) { announce(''); return; }
    setAnswers({ [id]: draft });
    announce(draft);
  }

  const text = shown === '' ? 'Leg dich zuerst fest.' : shown ? `Deine Wahl: „${shown}“. ${resolution}` : '';
  return <form className="kurzueberlegen" id={id} noValidate onSubmit={submit}>
    <fieldset role="radiogroup" aria-labelledby={`${id}-l`} aria-describedby={text ? `${id}-r` : undefined}>
      <legend id={`${id}-l`}>{withCode(label)}</legend>
      <div className="radios">{options.map(o => <label key={o}>
        <input type="radio" name={`${id}-wahl`} value={o} checked={draft === o} onChange={() => setDraft(o)} /> {o}
      </label>)}</div>
    </fieldset>
    <div className="reihe-knoepfe"><button type="submit" className="knopf">{button}</button></div>
    <p className={`rueck${shown === '' ? ' no' : shown ? ' text' : ''}`} id={`${id}-r`} aria-live="polite">{text}</p>
    {shown ? after : null}
  </form>;
}

/* ---------- Fehlerhilfe ---------- */

function rich(parts: Rich): ReactNode {
  return parts.map((p, i) => typeof p === 'string' ? p
    : 'code' in p ? <code key={i}>{p.code}</code>
      : <a key={i} href={p.href}>{p.text}</a>);
}

/** „Hilfe: R meldet einen Fehler“ at the end of every task (closed details with a table). */
export function ErrorHelp() {
  return <details className="hilfe">
    <summary>{ERROR_HELP_TITLE}</summary>
    <table className="daten">
      <caption>{ERROR_HELP_CAPTION}</caption>
      <thead><tr><th scope="col">R meldet</th><th scope="col">Das hilft</th></tr></thead>
      <tbody>{ERROR_HELP.map((row, i) => <tr key={i}><td>{rich(row.says)}</td><td>{rich(row.helps)}</td></tr>)}</tbody>
    </table>
  </details>;
}
