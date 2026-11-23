// Zuordnen mit je einem select (Meldungs-Sortierer in Grundlage 4b, Werkzeug-Zuordnung im Überblick).
import { useState, type FormEvent, type ReactNode } from 'react';
import { useChapterState } from '../../ChapterContext';
import { useAnnounce } from '../../blocks/announce';
import { withCode } from '../../blocks/rich';
import { CAUSES, ERROR_CASES, SORTER_ALL_RIGHT, TOOL_QUESTIONS, TOOLS } from '../content';

export type MatchItem = { label: ReactNode; target: string; right: string; wrong: string };
type Checked = Record<string, string> | null;

/**
 * One select per item, „Prüfen“ gives „Passt: …“ / „Passt nicht. …“ under each item (aria-describedby)
 * and a summary in a live line. Choices are saved in the chapter state under `${id}-1` … like other answers.
 */
export function Match({ id, intro, items, options, placeholder, summary }: {
  id: string;
  intro: ReactNode;
  items: MatchItem[];
  options: [string, string][];
  placeholder: string;
  summary: (right: number, open: number) => string;
}) {
  const key = (i: number) => `${id}-${i + 1}`;
  const { state, setAnswers } = useChapterState();
  const saved = Object.fromEntries(items.map((_, i) => [key(i), state.answers[key(i)] ?? ''])) as Record<string, string>;
  const [draft, setDraft] = useState(saved);
  const [checked, announce] = useAnnounce<Checked>(Object.values(saved).some(Boolean) ? saved : null, null);

  function submit(e: FormEvent) {
    e.preventDefault();
    const snapshot = Object.fromEntries(items.map((_, i) => [key(i), draft[key(i)] ?? '']));
    setAnswers(snapshot);
    announce(snapshot);
  }

  const results = items.map((it, i) => {
    const v = checked?.[key(i)] ?? '';
    return v === '' ? null : v === it.target;
  });
  const open = results.filter(r => r === null).length, right = results.filter(r => r === true).length;

  return <form className="kurzueberlegen weiss zuordnen" id={id} noValidate onSubmit={submit}>
    <p>{intro}</p>
    {items.map((it, i) => {
      const fid = key(i), r = results[i];
      return <div className="frage feld" key={fid}>
        <label htmlFor={fid}>{it.label}</label>
        <select id={fid} aria-describedby={`${fid}-r`} value={draft[fid] ?? ''} aria-invalid={r === false || undefined} className={r ? 'passt' : undefined}
          onChange={e => setDraft(d => ({ ...d, [fid]: e.target.value }))}>
          <option value="">{placeholder}</option>
          {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <span className="hilfe-zeile" id={`${fid}-r`}>
          {r === true ? <><b className="passt-ja">Passt:</b> {withCode(it.right)}</> : r === false ? <><b className="passt-nein">Passt nicht.</b> {withCode(it.wrong)}</> : null}
        </span>
      </div>;
    })}
    <div className="reihe-knoepfe"><button type="submit" className="knopf">Prüfen</button></div>
    <p className={`rueck${checked ? (right === items.length ? ' ok' : ' no') : ''}`} aria-live="polite">{checked ? summary(right, open) : ''}</p>
  </form>;
}

/** Grundlage 4b: „Meldungs-Sortierer“, seven messages, six causes. */
export function MessageSorter() {
  const items: MatchItem[] = ERROR_CASES.map((c, i) => ({
    label: <>
      {`${i + 1}. `}<code>{c.code}</code>{' '}
      {c.only ? `${c.only}: ` : 'R meldet: '}<code>{c.message}</code>
      {c.en ? <>{' (Werkstatt: '}<code>{c.en}</code>{')'}</> : null}
      {c.note ? <>{'. '}{withCode(c.note)}</> : null}
    </>,
    target: c.target, right: c.right, wrong: c.wrong,
  }));
  return <Match id="g4-sort" intro="Ordne jeder Meldung ihre Ursache zu" items={items}
    options={CAUSES.map(([v, l]) => [v, `${v} ${l}`])} placeholder="Ursache wählen"
    summary={(right, open) => open ? `Noch ${open} ohne Zuordnung.` : right === items.length ? SORTER_ALL_RIGHT : `${right} von 7 richtig. Unter jeder Meldung steht, worauf du achten kannst.`} />;
}

/** Überblick: „Ordne jeder Frage ein Werkzeug zu“. */
export function ToolAssignment() {
  const items: MatchItem[] = TOOL_QUESTIONS.map((q, i) => ({ label: `${i + 1}. ${q.question}`, target: q.target, right: q.why, wrong: q.why }));
  return <Match id="ue-werkzeug" intro="Ordne jeder Frage ein Werkzeug zu" items={items} options={TOOLS} placeholder="Werkzeug wählen"
    summary={(right, open) => open ? `Noch ${open} ohne Zuordnung.` : right === items.length ? 'Alle fünf richtig.' : `${right} von 5 richtig. Unter jeder Frage steht, warum.`} />;
}
