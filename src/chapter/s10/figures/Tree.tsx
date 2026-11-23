// Sitzung 10, Überblick Ü1: Entscheidungsbaum „Wie kommt eine Variable ins Modell?“ und die Zuordnung.
import { useState, type FormEvent } from 'react';
import { useChapterState } from '../../ChapterContext';
import { useAnnounce } from '../../blocks/announce';
import { ASSIGN, ASSIGN_OPTIONS } from '../content';
import { C, T } from './common';

export const TREE_TEXT = 'Entscheidungsbaum. Zahlen oder Stufen mit Reihenfolge kommen direkt in die Formel, bei Bedarf umgepolt. Zwei Gruppen werden zu einer 0/1-Variable mit rec; B ist der Abstand der Gruppe 1 zur Gruppe 0. Mehr als zwei Gruppen ohne Reihenfolge werden mit to_dummy zu Dummies; alle bis auf einen kommen in die Formel, der fehlende ist die Referenz. Gilt ein Abstand nicht für alle, kommt eine Interaktion mit Sternchen dazu.';

function Node({ x, y, w, lines, fill, stroke, mono }: { x: number; y: number; w: number; lines: string[]; fill: string; stroke: string; mono?: number[] }) {
  const h = lines.length * 16 + 14;
  return <g>
    <rect x={x - w / 2} y={y} width={w} height={h} rx={12} fill={fill} stroke={stroke} strokeWidth={2} />
    {lines.map((t, i) => <T key={i} x={x} y={y + 20 + i * 16} fill={mono?.includes(i) ? '#5b4fb0' : C.ink} fontWeight={mono?.includes(i) ? 600 : 800} fontSize={14}
      fontFamily={mono?.includes(i) ? 'JetBrains Mono,monospace' : undefined}>{t}</T>)}
  </g>;
}
const Path = ({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) =>
  <path d={`M${x1},${y1} C${x1},${(y1 + y2) / 2} ${x2},${(y1 + y2) / 2} ${x2},${y2}`} fill="none" stroke="#978B7B" strokeWidth={2} />;

/** Bild Ü1 `s10-entscheidungsbaum`. */
export function DecisionTree() {
  const leaf = { fill: '#EAF5FC', stroke: C.blue };
  const ask = { fill: '#FFF6DA', stroke: '#E0C46A' };
  return <>
    <div className="grafik" role="img" aria-labelledby="s10-baum-text">
      <svg viewBox="0 0 780 330" width="100%" aria-hidden="true" focusable="false">
        <Path x1={390} y1={44} x2={140} y2={110} /><Path x1={390} y1={44} x2={390} y2={110} /><Path x1={390} y1={44} x2={640} y2={110} />
        <Path x1={140} y1={156} x2={140} y2={204} /><Path x1={390} y1={156} x2={390} y2={204} /><Path x1={640} y1={156} x2={640} y2={204} />
        <Node x={390} y={14} w={240} lines={['Was für eine Variable?']} fill="#FFF0E8" stroke={C.orange} />
        <Node x={140} y={110} w={250} lines={['Zahl oder Stufen mit Reihenfolge', '(Alter, Lage 1 bis 5)']} {...ask} />
        <Node x={390} y={110} w={230} lines={['zwei Gruppen', '(Ost/West, Abitur ja/nein)']} {...ask} />
        <Node x={645} y={110} w={262} lines={['mehr als zwei Gruppen ohne', 'Reihenfolge (Familienstand, Herkunft)']} {...ask} />
        <Node x={140} y={204} w={250} lines={['direkt in die Formel;', 'bei Bedarf umpolen mit', 'rec(…, rules = "rev")']} mono={[2]} {...leaf} />
        <Node x={390} y={204} w={230} lines={['0/1-Variable mit rec()', 'B = Abstand der Gruppe 1', 'zur Gruppe 0']} {...leaf} />
        <Node x={645} y={204} w={262} lines={['to_dummy(), alle Dummies', 'bis auf einen in die Formel;', 'der fehlende ist die Referenz']} {...leaf} />
        <Node x={390} y={282} w={420} lines={['Zusatz: Gilt ein Abstand nicht für alle? → Interaktion mit *']} fill="#F1EFFC" stroke="#A79FE2" />
      </svg>
    </div>
    <div id="s10-baum-text" className="sr-only" aria-hidden="true">{TREE_TEXT}</div>
  </>;
}

const answerId = (i: number) => `u1-${i + 1}`;
type Checked = Record<string, string> | null;

/** Überblick: assign each variable a way into the model; feedback per row and a summary. */
export function Assignment() {
  const { state, setAnswers } = useChapterState();
  const saved = Object.fromEntries(ASSIGN.map((_, i) => [answerId(i), state.answers[answerId(i)] ?? ''])) as Record<string, string>;
  const [draft, setDraft] = useState(saved);
  const [checked, announce] = useAnnounce<Checked>(Object.values(saved).some(Boolean) ? saved : null, null);

  function submit(e: FormEvent) {
    e.preventDefault();
    const snapshot = Object.fromEntries(ASSIGN.map((_, i) => [answerId(i), draft[answerId(i)] ?? '']));
    setAnswers(snapshot);
    announce(snapshot);
  }

  const results = ASSIGN.map((a, i) => {
    const v = checked?.[answerId(i)] ?? '';
    return v === '' ? null : Number(v) === a.answer;
  });
  const right = results.filter(r => r === true).length, open = results.filter(r => r === null).length;
  const summary = !checked ? '' : open ? `Noch ${open} ohne Zuordnung.` : right === ASSIGN.length ? 'Alles richtig zugeordnet.' : `${right} von 3 richtig.`;

  return <form className="kurzueberlegen weiss zuordnen" id="u1-frage" noValidate onSubmit={submit}>
    <p>Wie kommt die Variable ins Modell?</p>
    {ASSIGN.map((a, i) => {
      const id = answerId(i), r = results[i];
      return <div className="frage feld" key={id}>
        <label htmlFor={id}>{`${i + 1}. ${a.question}`}</label>
        <select id={id} aria-describedby={`${id}-r`} value={draft[id] ?? ''} aria-invalid={r === false || undefined} className={r ? 'passt' : undefined}
          onChange={e => setDraft(d => ({ ...d, [id]: e.target.value }))}>
          <option value="">wählen</option>
          {ASSIGN_OPTIONS.map((o, k) => <option key={o} value={String(k)}>{o}</option>)}
        </select>
        <span className="hilfe-zeile" id={`${id}-r`}>
          {r === true ? <><b className="passt-ja">Passt.</b> {a.right}</> : r === false ? <><b className="passt-nein">Passt nicht:</b> {a.wrong}</> : null}
        </span>
      </div>;
    })}
    <div className="reihe-knoepfe"><button type="submit" className="knopf">Prüfen</button></div>
    <p className={`rueck${checked ? (right === ASSIGN.length ? ' ok' : ' no') : ''}`} aria-live="polite">{summary}</p>
  </form>;
}
