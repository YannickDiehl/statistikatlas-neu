// Überblick: Entscheidungsbaum (s6-entscheidungsbaum), Maß zuordnen (u1 bis u5), fünf Maße auf einem Lineal (s6-fuenf-masse).
import { useState, type FormEvent } from 'react';
import { CAT_DARK } from '../../../tasks/kit/palette';
import { useChapterState } from '../../ChapterContext';
import { useAnnounce } from '../../blocks/announce';
import { ALT, ASSIGN, FIVE, MEASURE_OPTIONS } from '../content';
import { Picture, Ruler, SvgText, de } from './util';

export const TREE_TEXT = 'Entscheidungsbaum. Start: Welches Skalenniveau haben beide Variablen? Das niedrigere zählt. Mindestens eine nominal: Cramér-V, cramers_v; beide mit genau zwei Kategorien: Phi, phi. Beide mindestens ordinal, mindestens eine ordinal: Tau-b, kendall_tau; daneben Gamma, goodman_gamma, und Spearman-ρ, spearman_rho. Beide metrisch: Pearson-r, pearson_cor; bei Ausreißern oder ohne geradlinigen Verlauf: Spearman-ρ.';

const STROKE = '#978B7B';
function Node({ x, y, w, title, sub, fill = '#EAF5FC', stroke = '#86B9DE' }: { x: number; y: number; w: number; title: string; sub?: string; fill?: string; stroke?: string }) {
  return <g>
    <rect x={x - w / 2} y={y - 20} width={w} height={sub ? 46 : 36} rx={12} fill={fill} stroke={stroke} strokeWidth={2} />
    <SvgText x={x} y={y + (sub ? -1 : 3)} fill="#1E2D3C" fontWeight={800} fontSize={13.5}>{title}</SvgText>
    {sub ? <SvgText x={x} y={y + 17} fontFamily="JetBrains Mono,monospace" fontSize={11} fill="#5b4fb0">{sub}</SvgText> : null}
  </g>;
}
const Path = ({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) =>
  <path d={`M${x1},${y1} C${x1},${(y1 + y2) / 2} ${x2},${(y1 + y2) / 2} ${x2},${y2}`} fill="none" stroke={STROKE} strokeWidth={2} />;
function Sign({ x, y, lines }: { x: number; y: number; lines: string[] }) {
  const w = Math.max(...lines.map(z => z.length)) * 6.3 + 14, h = lines.length * 14 + 6;
  return <g>
    <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={7} fill="#FFFCF3" stroke="#E9DFCF" strokeWidth={1} />
    {lines.map((z, k) => <SvgText key={k} x={x} y={y - h / 2 + 14 + k * 14} fontSize={11.5} fill="#5F6A74" fontWeight={700}>{z}</SvgText>)}
  </g>;
}

/** Ü1: Entscheidungsbaum „welches Maß?“; die Textfassung wird einmal als Name des Bildes gelesen. */
export function MeasureTree() {
  return <>
    <div className="grafik" role="img" aria-labelledby="s6-baum-text">
      <svg viewBox="0 0 760 330" width="100%" aria-hidden="true" focusable="false">
        <Path x1={380} y1={44} x2={130} y2={120} /><Path x1={380} y1={44} x2={380} y2={120} /><Path x1={380} y1={44} x2={640} y2={120} />
        <Path x1={130} y1={148} x2={130} y2={236} /><Path x1={380} y1={148} x2={380} y2={236} /><Path x1={640} y1={148} x2={640} y2={236} />
        <Sign x={240} y={78} lines={['mindestens', 'eine nominal']} /><Sign x={380} y={84} lines={['mindestens', 'eine ordinal']} /><Sign x={520} y={78} lines={['beide', 'metrisch']} />
        <Sign x={130} y={192} lines={['beide genau zwei', 'Kategorien']} /><Sign x={380} y={192} lines={['daneben']} /><Sign x={640} y={192} lines={['Ausreißer oder', 'nicht geradlinig']} />
        <Node x={380} y={30} w={420} title="Welches Skalenniveau? Das niedrigere zählt." fill="#FFF0E8" stroke="#F0A27E" />
        <Node x={130} y={134} w={170} title="Cramér-V" sub="cramers_v()" />
        <Node x={380} y={134} w={170} title="Tau-b" sub="kendall_tau()" />
        <Node x={640} y={134} w={170} title="Pearson-r" sub="pearson_cor()" />
        <Node x={130} y={256} w={150} title="Phi" sub="phi()" fill="#FFF6DA" stroke="#E0C46A" />
        <Node x={380} y={256} w={260} title="Gamma, Spearman-ρ" sub="goodman_gamma(), spearman_rho()" fill="#FFF6DA" stroke="#E0C46A" />
        <Node x={640} y={256} w={170} title="Spearman-ρ" sub="spearman_rho()" fill="#FFF6DA" stroke="#E0C46A" />
      </svg>
    </div>
    <div id="s6-baum-text" className="sr-only" aria-hidden="true">{TREE_TEXT}</div>
  </>;
}

type Checked = Record<string, string> | null;

/** Ü1: je Paar ein Maß wählen; Rückmeldung je Zeile und eine Zusammenfassung. Gespeichert wie andere Antworten. */
export function MeasureAssignment() {
  const { state, setAnswers } = useChapterState();
  const saved = Object.fromEntries(ASSIGN.map(a => [a.id, state.answers[a.id] ?? ''])) as Record<string, string>;
  const [draft, setDraft] = useState(saved);
  const [checked, announce] = useAnnounce<Checked>(Object.values(saved).some(Boolean) ? saved : null, null);

  function submit(e: FormEvent) {
    e.preventDefault();
    const snapshot = Object.fromEntries(ASSIGN.map(a => [a.id, draft[a.id] ?? '']));
    setAnswers(snapshot);
    announce(snapshot);
  }

  const results = ASSIGN.map(a => {
    const v = checked?.[a.id] ?? '';
    return v === '' ? null : Number(v) === a.answer;
  });
  const open = results.filter(r => r === null).length, right = results.filter(r => r === true).length;
  const summary = !checked ? '' : open ? `Noch ${open} ${open === 1 ? 'Paar' : 'Paare'} ohne Maß.` : right === ASSIGN.length ? 'Alle fünf passen.' : `${right} von 5 passen. Unter jedem Paar steht ein Hinweis.`;

  return <form className="kurzueberlegen weiss zuordnen" id="u-frage" noValidate onSubmit={submit}>
    <p>Ordne jedem Paar ein Maß zu</p>
    {ASSIGN.map((a, i) => {
      const r = results[i];
      return <div className="frage feld" key={a.id}>
        <label htmlFor={a.id}>{`${i + 1}. ${a.pair}`}</label>
        <select id={a.id} aria-describedby={`${a.id}-r`} value={draft[a.id] ?? ''} aria-invalid={r === false || undefined} className={r ? 'passt' : undefined}
          onChange={e => setDraft(d => ({ ...d, [a.id]: e.target.value }))}>
          <option value="">Maß wählen</option>
          {MEASURE_OPTIONS.map((o, k) => <option key={o} value={String(k)}>{o}</option>)}
        </select>
        <span className="hilfe-zeile" id={`${a.id}-r`}>
          {r === true ? <><b className="passt-ja">Passt.</b> {a.right}</> : r === false ? <><b className="passt-nein">Passt nicht:</b> {a.wrong}</> : null}
        </span>
      </div>;
    })}
    <div className="reihe-knoepfe"><button type="submit" className="knopf">Prüfen</button></div>
    <p className={`rueck${checked ? (right === ASSIGN.length ? ' ok' : ' no') : ''}`} aria-live="polite">{summary}</p>
  </form>;
}

/** Ü3: dieselben Daten, fünf Maße auf einem Lineal von −1 bis +1. */
export function FiveMeasures() {
  return <Picture text={ALT.fuenf} caption="Zufriedenheit (umgepolt) und Wirtschaftslage aus Aufgabe 3, ALLBUS 2023, gewichtet (ρ ohne Gewicht).">
    <Ruler from={-1} to={1} ticks={[-1, -0.5, 0, 0.5, 1]} height={200}
      marks={FIVE.map((m, i) => ({ value: m.value, label: `${m.label} ${de(m.value, 2)}`, color: CAT_DARK[i], row: m.value > 0 ? 0 : i - 1, shape: i % 2 ? 'diamond' : 'circle' }))} />
  </Picture>;
}
