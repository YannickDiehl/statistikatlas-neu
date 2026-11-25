import { useState, type FormEvent } from 'react';
import { useChapterState } from '../../ChapterContext';
import { useAnnounce } from '../../blocks/announce';
import { DH04, MIDDLES, MIDDLE_ROWS, SCALE_LEVELS, TREE_TEXT, middleFeedback, type Middle, type Yes } from '../content';
import { C, SvgText } from './util';

const YES: Record<Yes, { sign: string; text: string; cls: string }> = {
  ja: { sign: '✓', text: 'ja', cls: 's3-ja' },
  nein: { sign: '–', text: 'nein', cls: 's3-nein' },
  vorsicht: { sign: '!', text: 'nur mit Vorsicht', cls: 's3-vorsicht' },
};
const Cell = ({ v }: { v: Yes }) => <td className={YES[v].cls}><span aria-hidden="true">{YES[v].sign}</span> {YES[v].text}</td>;

/** Bild B10 „Skalenniveau“ as a real table: three steps of stones (nominal at the bottom of the stairs). */
export function ScaleLevels() {
  return <div className="s3-tabelle">
    <table className="daten voll s3-stufen">
      <caption>Welche Mitte passt zu welchem Skalenniveau?</caption>
      <thead><tr>{['Skalenniveau', 'Was die Codes sagen', 'Beispiel', 'Modus', 'Median', 'Mittelwert'].map(h => <th key={h} scope="col">{h}</th>)}</tr></thead>
      <tbody>{SCALE_LEVELS.map((s, i) => <tr key={s.level}>
        <th scope="row"><span className="s3-treppe" aria-hidden="true">{Array.from({ length: i + 1 }, (_, k) => <i key={k}></i>)}</span>{s.level}</th>
        <td>{s.codes}</td><td>{s.example}</td><Cell v={s.mode} /><Cell v={s.median} /><Cell v={s.mean} />
      </tr>)}</tbody>
    </table>
  </div>;
}

type Checked = Record<string, string> | null;
const parse = (v: string | undefined) => (v ? v.split(',').filter(Boolean) : []) as Middle[];

/** Summary of 3b after „Prüfen“. */
export function middlesSummary(checked: Record<string, string>): string {
  const right = MIDDLE_ROWS.filter(r => middleFeedback(r, parse(checked[r.id])).ok).length;
  return right === MIDDLE_ROWS.length ? 'Alles richtig zugeordnet.' : `${right} von 3 Zeilen richtig.`;
}

/** Feedback texts of the rows that are not right yet, for the live summary. */
export function middlesWrongTexts(checked: Record<string, string>): string {
  return MIDDLE_ROWS.map(r => ({ r, fb: middleFeedback(r, parse(checked[r.id])) })).filter(x => !x.fb.ok)
    .map(x => `Noch nicht, ${x.r.label}: ${x.fb.text}`).join(' ');
}

/** Kurz überlegen 3b: three checkboxes (Modus, Median, Mittelwert) per variable; feedback per row and overall. Saved as „modus,median“. */
export function MiddleCheck() {
  const { state, setAnswers } = useChapterState();
  const saved = Object.fromEntries(MIDDLE_ROWS.map(r => [r.id, state.answers[r.id] ?? ''])) as Record<string, string>;
  const [draft, setDraft] = useState<Record<string, Middle[]>>(() => Object.fromEntries(MIDDLE_ROWS.map(r => [r.id, parse(saved[r.id])])));
  const [checked, announce] = useAnnounce<Checked>(Object.values(saved).some(Boolean) ? saved : null, null);

  function toggle(row: string, m: Middle) {
    setDraft(d => ({ ...d, [row]: d[row].includes(m) ? d[row].filter(x => x !== m) : MIDDLES.map(x => x.key).filter(k => k === m || d[row].includes(k)) }));
  }
  function submit(e: FormEvent) {
    e.preventDefault();
    // An empty row is saved as „-“ so that it counts as answered (and wrong).
    const snapshot = Object.fromEntries(MIDDLE_ROWS.map(r => [r.id, draft[r.id].join(',') || '-']));
    setAnswers(snapshot);
    announce(snapshot);
  }

  return <form className="kurzueberlegen weiss" id="k3b-frage" noValidate onSubmit={submit}>
    <p>Kurz überlegen: Welche Mitte darfst du berichten? Kreuz für jede Variable alles an, was sinnvoll ist.</p>
    {MIDDLE_ROWS.map(r => {
      const fb = checked ? middleFeedback(r, parse(checked[r.id])) : null;
      return <fieldset className="frage s3-mitten" key={r.id} aria-describedby={fb ? `${r.id}-r` : undefined} aria-invalid={fb && !fb.ok ? true : undefined}>
        <legend>{r.label}</legend>
        <div className="radios">{MIDDLES.map(m => <label key={m.key}>
          <input type="checkbox" name={`${r.id}-${m.key}`} checked={draft[r.id].includes(m.key)} onChange={() => toggle(r.id, m.key)} /> {m.label}
        </label>)}</div>
        <span className="hilfe-zeile" id={`${r.id}-r`}>
          {fb ? <><b className={fb.ok ? 'passt-ja' : 'passt-nein'}>{fb.ok ? 'Passt.' : 'Noch nicht.'}</b> {fb.text}</> : null}
        </span>
      </fieldset>;
    })}
    <div className="reihe-knoepfe"><button type="submit" className="knopf">Prüfen</button></div>
    <p className={`rueck${checked ? (middlesSummary(checked) === 'Alles richtig zugeordnet.' ? ' ok' : ' no') : ''}`} aria-live="polite">{checked ? [middlesSummary(checked), middlesWrongTexts(checked)].filter(Boolean).join(' ') : ''}</p>
  </form>;
}

/** describe(dh04) as R prints it; the four columns Mean, Median, N and Missing are framed. */
export const DESCRIBE_LINES = [
  'Descriptive Statistics',
  '----------------------',
  '',
  '  ----------------------------------------------------------------------',
  '  Variable   Mean  Median     SD   Range    IQR  Skewness     N  Missing',
  '  ----------------------------------------------------------------------',
  '  dh04      2.342   2.000  1.177  11.000  1.000     1.209  5144      102',
  '  ----------------------------------------------------------------------',
];
const HEAD = 4, DATA = 6;
const FOCUS = ['Mean', 'Median', 'N', 'Missing'];

/** Character ranges of the columns in the header line (right-aligned: a column ends where its name ends). */
function columnRanges() {
  const head = DESCRIBE_LINES[HEAD], data = DESCRIBE_LINES[DATA];
  const ranges: { name: string; from: number; to: number }[] = [];
  for (const m of head.matchAll(/\S+/g)) {
    const to = m.index + m[0].length;
    let from = m.index;
    while (from > 0 && data[from - 1] !== ' ') from--;
    ranges.push({ name: m[0], from: Math.min(from, m.index), to });
  }
  return ranges;
}

function marked(line: string) {
  const parts: (string | { text: string; hl: boolean })[] = [];
  let at = 0;
  for (const r of columnRanges()) {
    if (r.name === 'Variable') continue;
    parts.push(line.slice(at, r.from), { text: line.slice(r.from, r.to), hl: FOCUS.includes(r.name) });
    at = r.to;
  }
  parts.push(line.slice(at));
  return parts.map((p, i) => typeof p === 'string' ? p : <span key={i} className={p.hl ? 's3-hl' : 's3-grau'}>{p.text}</span>);
}

/** Karte 3c: the describe() output with highlighted columns, and the same numbers as a table. */
export function DescribeOutput() {
  const d = DH04.describe;
  return <>
    <pre className="s3-ausgabe s3-describe" role="region" aria-label="Ausgabe von describe(dh04)" tabIndex={0}>
      {DESCRIBE_LINES.map((l, i) => <span key={i}>{i === HEAD || i === DATA ? marked(l) : l}{'\n'}</span>)}
    </pre>
    <details className="genauer s3-alle">
      <summary>Ausgabe als Tabelle</summary>
      <div className="s3-tabelle">
        <table className="daten">
          <caption>describe(dh04)</caption>
          <thead><tr>{['Variable', 'Mean', 'Median', 'SD', 'Range', 'IQR', 'Skewness', 'N', 'Missing'].map(h => <th key={h} scope="col">{h}</th>)}</tr></thead>
          <tbody><tr><th scope="row">dh04</th><td>{d.mean.toFixed(3)}</td><td>{d.median.toFixed(3)}</td><td>{d.sd.toFixed(3)}</td><td>{d.range.toFixed(3)}</td>
            <td>{d.iqr.toFixed(3)}</td><td>{d.skewness.toFixed(3)}</td><td>{d.n}</td><td>{d.missing}</td></tr></tbody>
        </table>
      </div>
    </details>
  </>;
}

/* ---------- Überblick: Entscheidungsbaum ---------- */

const STROKE = '#978B7B';
function Node({ x, y, w, lines, leaf, sub }: { x: number; y: number; w: number; lines: string[]; leaf?: boolean; sub?: string }) {
  const h = 22 + lines.length * 17 + (sub ? 16 : 0);
  return <g>
    <rect x={x - w / 2} y={y} width={w} height={h} rx={12} fill={leaf ? '#CDEFD9' : '#fff'} stroke={leaf ? '#8FCBA6' : C.ink} strokeWidth={2} />
    {lines.map((l, k) => <SvgText key={k} x={x} y={y + 24 + k * 17} fill={C.ink} fontWeight={800} fontSize={13.5}>{l}</SvgText>)}
    {sub ? <SvgText x={x} y={y + 24 + lines.length * 17} fontSize={11.5} fill={C.mute}>{sub}</SvgText> : null}
  </g>;
}
function Arrow({ x1, y1, x2, y2, label }: { x1: number; y1: number; x2: number; y2: number; label: string }) {
  return <g>
    <path d={`M${x1},${y1} C${x1},${(y1 + y2) / 2} ${x2},${(y1 + y2) / 2} ${x2},${y2 - 6}`} fill="none" stroke={STROKE} strokeWidth={2} />
    <path d={`M${x2 - 5},${y2 - 8} L${x2},${y2} L${x2 + 5},${y2 - 8}`} fill="none" stroke={STROKE} strokeWidth={2} />
    <rect x={(x1 + x2) / 2 - 20} y={(y1 + y2) / 2 - 11} width={40} height={20} rx={7} fill="#FFFCF3" stroke="#E9DFCF" />
    <SvgText x={(x1 + x2) / 2} y={(y1 + y2) / 2 + 4} fontSize={12} fontWeight={800}>{label}</SvgText>
  </g>;
}

/** Bild B12 „Welche Mitte passt?“: decision tree, text version read once via aria-labelledby. */
export function MiddleTree() {
  return <>
    <div className="grafik" role="img" aria-labelledby="mitte-baum-text">
      <svg viewBox="0 0 760 338" width="100%" aria-hidden="true" focusable="false">
        <Arrow x1={300} y1={49} x2={140} y2={120} label="nein" />
        <Arrow x1={300} y1={49} x2={470} y2={120} label="ja" />
        <Arrow x1={470} y1={159} x2={335} y2={240} label="nein" />
        <Arrow x1={470} y1={159} x2={622} y2={240} label="ja" />
        <Node x={300} y={10} w={300} lines={['Haben die Codes eine Reihenfolge?']} />
        <Node x={140} y={120} w={220} lines={['nominal: Modus']} leaf sub="Wahlabsicht, Konfession" />
        <Node x={470} y={120} w={260} lines={['Sind die Abstände gleich groß?']} />
        <Node x={335} y={240} w={250} lines={['ordinal: Median und Modus']} leaf sub="Bücher lesen, Wirtschaftslage in einem Jahr" />
        <Node x={622} y={240} w={236} lines={['metrisch:', 'Mittelwert und Median']} leaf sub="Personen im Haushalt, Wochen ohne Arbeit" />
        <SvgText x={622} y={326} fontSize={11.5} fontStyle="italic">liegen sie weit auseinander: beide berichten</SvgText>
      </svg>
    </div>
    <div id="mitte-baum-text" className="sr-only" aria-hidden="true">{TREE_TEXT}</div>
  </>;
}
