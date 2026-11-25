import { useState, type FormEvent } from 'react';
import { useChapterState } from '../../ChapterContext';
import { useAnnounce } from '../../blocks/announce';
import { MISSING_CODES, SHELVES, SHELVES_SOLVED, SHELVES_TEXT } from '../content';

const answerId = (code: number) => `k2a${code}`;
type Checked = Record<string, string> | null;

/** Summary after „Prüfen“: open stones, all right, or how many are right. */
export function shelvesSummary(checked: Record<string, string>): string {
  const chosen = MISSING_CODES.map(c => checked[answerId(c.code)] ?? '');
  const open = chosen.filter(v => v === '').length;
  if (open) return `Noch ${open} ${open === 1 ? 'Code' : 'Codes'} ohne Regal.`;
  const right = MISSING_CODES.filter((c, i) => chosen[i] === String(c.shelf)).length;
  return right === MISSING_CODES.length ? 'Alle sieben richtig sortiert.' : `${right} von 7 richtig. Unter jedem Code steht, worauf du achten kannst.`;
}

/** Feedback texts of the stones put on the wrong shelf, for the live summary („−42 DATENFEHLER: …“). */
export function shelvesWrongTexts(checked: Record<string, string>): string {
  return MISSING_CODES.filter(c => (checked[answerId(c.code)] ?? '') !== '' && checked[answerId(c.code)] !== String(c.shelf))
    .map(c => `Noch nicht, ${String(c.code).replace('-', '−')} ${c.label}: ${c.wrong}`).join(' ');
}

function CodeStone({ code, label, hidden }: { code: number; label: string; hidden?: boolean }) {
  return <span className="s3-code-stein" aria-hidden={hidden || undefined}><span className="s3-code">{String(code).replace('-', '−')}</span><span className="s3-leer" aria-hidden="true"></span><span className="s3-aufkleber">{label}</span></span>;
}

/**
 * Bild B4 „Warum eine Antwort fehlt“: three shelves and seven missing codes, one select per code.
 * Right stones move into their shelf; feedback per stone and a live summary. Saved like other answers.
 */
export function Shelves() {
  const { state, setAnswers } = useChapterState();
  const saved = Object.fromEntries(MISSING_CODES.map(c => [answerId(c.code), state.answers[answerId(c.code)] ?? ''])) as Record<string, string>;
  const [draft, setDraft] = useState(saved);
  const [checked, announce] = useAnnounce<Checked>(Object.values(saved).some(Boolean) ? saved : null, null);

  function submit(e: FormEvent) {
    e.preventDefault();
    const snapshot = Object.fromEntries(MISSING_CODES.map(c => [answerId(c.code), draft[answerId(c.code)] ?? '']));
    setAnswers(snapshot);
    announce(snapshot);
  }

  const result = (code: number, shelf: number) => {
    const v = checked?.[answerId(code)] ?? '';
    return v === '' ? null : v === String(shelf);
  };
  const placed = (shelf: number) => MISSING_CODES.filter(c => c.shelf === shelf && result(c.code, c.shelf) === true);
  const summary = checked ? shelvesSummary(checked) : '';
  const allRight = summary === 'Alle sieben richtig sortiert.';

  return <form className="kurzueberlegen weiss zuordnen s3-regale" id="k2a-frage" noValidate onSubmit={submit}>
    <p className="sr-only">{SHELVES_TEXT}</p>
    <ul className="s3-regal-liste" aria-label="Drei Regale">
      {SHELVES.map(s => <li key={s.n} className="s3-regal">
        <b>{`${s.n} ${s.title}`}</b><span>{s.sub}</span>
        <span className="s3-im-regal">{placed(s.n).map(c => <CodeStone key={c.code} code={c.code} label={c.label} />)}</span>
      </li>)}
    </ul>
    <div className="s3-steine">
      {MISSING_CODES.map(c => {
        const id = answerId(c.code), r = result(c.code, c.shelf);
        return <div className="frage feld s3-stein-feld" key={c.code}>
          {r === true ? null : <CodeStone code={c.code} label={c.label} hidden />}
          <label htmlFor={id}>{`Regal für ${String(c.code).replace('-', '−')} ${c.label}`}</label>
          <select id={id} aria-describedby={`${id}-r`} value={draft[id] ?? ''} aria-invalid={r === false || undefined} className={r ? 'passt' : undefined}
            onChange={e => setDraft(d => ({ ...d, [id]: e.target.value }))}>
            <option value="">Regal wählen</option>
            {SHELVES.map(s => <option key={s.n} value={String(s.n)}>{`${s.n} ${s.title}`}</option>)}
          </select>
          <span className="hilfe-zeile" id={`${id}-r`}>
            {r === true ? <b className="passt-ja">{c.right}</b> : r === false ? <><b className="passt-nein">Noch nicht.</b> {c.wrong}</> : null}
          </span>
        </div>;
      })}
    </div>
    <div className="reihe-knoepfe"><button type="submit" className="knopf">Prüfen</button></div>
    <p className={`rueck${checked ? (allRight ? ' ok' : ' no') : ''}`} aria-live="polite">{checked ? [summary, shelvesWrongTexts(checked), summary.startsWith('Noch') ? '' : SHELVES_SOLVED].filter(Boolean).join(' ') : ''}</p>
  </form>;
}
