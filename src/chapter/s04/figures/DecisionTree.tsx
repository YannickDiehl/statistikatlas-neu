import { useState, type FormEvent } from 'react';
import { useChapterState } from '../../ChapterContext';
import { useAnnounce } from '../../blocks/announce';
import { FR, FR_OPTIONS } from '../content';
import { SvgText } from './Bars';

export const TREE_TEXT = 'Entscheidungsbaum. Eine Variable mit wenigen Ausprägungen: Balken, geom_bar. Eine Variable mit vielen Werten: Histogramm, geom_histogram. Zwei Variablen mit wenigen Ausprägungen: Balken auf 100 Prozent, geom_bar mit position gleich fill. Zwei Variablen, eine mit vielen Werten und eine mit Gruppen: Boxplots, geom_boxplot. Zwei Variablen mit vielen Werten: Punkte, geom_point.';

const STROKE = '#978B7B';

function Node({ x, y, w, title, sub, fill = '#fff', stroke = STROKE }: { x: number; y: number; w: number; title: string; sub?: string; fill?: string; stroke?: string }) {
  return <g>
    <rect x={x - w / 2} y={y - 20} width={w} height={sub ? 46 : 36} rx={12} fill={fill} stroke={stroke} strokeWidth={2} />
    <SvgText x={x} y={y + (sub ? -1 : 3)} fill="#1E2D3C" fontWeight={800} fontSize={13.5}>{title}</SvgText>
    {sub ? <SvgText x={x} y={y + 17} fontFamily="JetBrains Mono,monospace" fontSize={11.5} fill="#5b4fb0">{sub}</SvgText> : null}
  </g>;
}

const Path = ({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) =>
  <path d={`M${x1},${y1} C${x1},${(y1 + y2) / 2} ${x2},${(y1 + y2) / 2} ${x2},${y2}`} fill="none" stroke={STROKE} strokeWidth={2} />;

/** Small sign on a path, one or two lines (v11). */
function Sign({ x, y, lines }: { x: number; y: number; lines: string[] }) {
  const w = Math.max(...lines.map(z => z.length)) * 6.3 + 14, h = lines.length * 14 + 6;
  return <g>
    <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={7} fill="#FFFCF3" stroke="#E9DFCF" strokeWidth={1} />
    {lines.map((z, k) => <SvgText key={k} x={x} y={y - h / 2 + 14 + k * 14} fontSize={11.5} fill="#5F6A74" fontWeight={700}>{z}</SvgText>)}
  </g>;
}

/** Überblick: decision tree „Welches Bild für welche Frage?“ (v11 with labelled path signs) and its text version. */
export function DecisionTree() {
  return <>
    <div className="grafik" role="img" aria-labelledby="baum-text">
      <svg viewBox="0 0 760 262" width="100%" aria-hidden="true" focusable="false">
        <Path x1={380} y1={38} x2={170} y2={98} /><Path x1={380} y1={38} x2={560} y2={98} />
        <Path x1={170} y1={126} x2={80} y2={194} /><Path x1={170} y1={126} x2={260} y2={194} />
        <Path x1={560} y1={126} x2={430} y2={194} /><Path x1={560} y1={126} x2={560} y2={194} /><Path x1={560} y1={126} x2={690} y2={194} />
        <Sign x={262} y={66} lines={['eine']} /><Sign x={482} y={66} lines={['zwei']} />
        <Sign x={80} y={158} lines={['wenige', 'Ausprägungen']} /><Sign x={260} y={158} lines={['viele Werte']} />
        <Sign x={430} y={158} lines={['beide wenige', 'Ausprägungen']} /><Sign x={560} y={158} lines={['eine viele Werte,', 'eine Gruppen']} /><Sign x={690} y={158} lines={['beide viele', 'Werte']} />
        <Node x={380} y={28} w={230} title="Wie viele Variablen?" fill="#FFF0E8" stroke="#F0A27E" />
        <Node x={170} y={108} w={150} title="eine Variable" fill="#FFF6DA" stroke="#E0C46A" />
        <Node x={560} y={108} w={150} title="zwei Variablen" fill="#FFF6DA" stroke="#E0C46A" />
        <Node x={80} y={214} w={140} title="Balken" sub="geom_bar()" fill="#EAF5FC" stroke="#86B9DE" />
        <Node x={260} y={214} w={150} title="Histogramm" sub="geom_histogram()" fill="#EAF5FC" stroke="#86B9DE" />
        <Node x={430} y={214} w={120} title="auf 100 %" sub={'position="fill"'} fill="#EAF5FC" stroke="#86B9DE" />
        <Node x={560} y={214} w={116} title="Boxplots" sub="geom_boxplot()" fill="#EAF5FC" stroke="#86B9DE" />
        <Node x={690} y={214} w={116} title="Punkte" sub="geom_point()" fill="#EAF5FC" stroke="#86B9DE" />
      </svg>
    </div>
    {/* Read once, as the name of the picture (aria-labelledby works on hidden elements). */}
    <div id="baum-text" className="sr-only" aria-hidden="true">{TREE_TEXT}</div>
  </>;
}

const answerId = (i: number) => `v6-${i + 1}`;
type Checked = Record<string, string> | null;

/** Überblick: assign a form to each of five questions; feedback per question and a live summary. Saved like other answers. */
export function Assignment() {
  const { state, setAnswers } = useChapterState();
  const saved = Object.fromEntries(FR.map((_, i) => [answerId(i), state.answers[answerId(i)] ?? ''])) as Record<string, string>;
  const [draft, setDraft] = useState(saved);
  const [checked, announce] = useAnnounce<Checked>(Object.values(saved).some(Boolean) ? saved : null, null);

  function submit(e: FormEvent) {
    e.preventDefault();
    const snapshot = Object.fromEntries(FR.map((_, i) => [answerId(i), draft[answerId(i)] ?? '']));
    setAnswers(snapshot);
    announce(snapshot);
  }

  const results = FR.map((f, i) => {
    const v = checked?.[answerId(i)] ?? '';
    return v === '' ? null : { ok: Number(v) === f.answer, chosen: FR_OPTIONS[Number(v)] ?? v };
  });
  const open = results.filter(r => r === null).length, right = results.filter(r => r?.ok).length;
  const summary = !checked ? '' : open ? `Noch ${open} ${open === 1 ? 'Frage' : 'Fragen'} ohne Form.` : right === FR.length ? 'Alle fünf passen.' : `${right} von 5 passen. Unter jeder Frage steht die Begründung.`;

  return <form className="kurzueberlegen weiss zuordnen" id="v6-frage" noValidate onSubmit={submit}>
    <p>Ordne jeder Frage eine Form zu</p>
    {FR.map((f, i) => {
      const id = answerId(i), r = results[i];
      return <div className="frage feld" key={id}>
        <label htmlFor={id}>{`${i + 1}. ${f.question}`}</label>
        <select id={id} aria-describedby={`v6-r${i + 1}`} value={draft[id] ?? ''} aria-invalid={r ? !r.ok : undefined} className={r?.ok ? 'passt' : undefined}
          onChange={e => setDraft(d => ({ ...d, [id]: e.target.value }))}>
          <option value="">Form wählen</option>
          {FR_OPTIONS.map((o, k) => <option key={o} value={String(k)}>{o}</option>)}
        </select>
        <span className="hilfe-zeile" id={`v6-r${i + 1}`}>
          {r ? (r.ok ? <><b className="passt-ja">Passt.</b> {f.why}</> : <><b className="passt-nein">Passt nicht:</b> {`${r.chosen} ist hier nicht die beste Wahl. ${f.why}`}</>) : null}
        </span>
      </div>;
    })}
    <div className="reihe-knoepfe"><button type="submit" className="knopf">Prüfen</button></div>
    <p className={`rueck${checked ? (right === FR.length ? ' ok' : ' no') : ''}`} aria-live="polite">{summary}</p>
  </form>;
}
