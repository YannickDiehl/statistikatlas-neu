// Sitzung 8, Thema 3: B7 (Umpolen), B8 (Umpol-Labor), B-A3 (Trennschärfen vorher und nachher).
import { useState } from 'react';
import { ALT, FR_IDS, FR_SHORT, LAB, LAB_N, MM_IDS, MM_REL, alphaLabel, type FrId } from '../content';
import { BLUE, GRAY, GREEN, INK, ORANGE, Pic, Stone, Svg, T, de, whole } from './kit';

const d3 = (x: number) => de(x, 3);

/* ---------- B7 s8-umpolen ---------- */

/** Bild B7: eine Person vor und nach dem Umpolen von fr03b und fr04b, darunter die Formel als Bausteine. */
export function Reverse() {
  const before = [1, 1, 4, 4], after = [1, 1, 1, 1];
  const names = ['fr07', 'fr08', 'fr03b', 'fr04b'];
  const stickers = ['STIMME VOLL ZU', 'STIMME VOLL ZU', 'STIMME GAR NICHT ZU', 'STIMME GAR NICHT ZU'];
  const ry = (i: number) => 30 + i * 52, sw = 46, sh = 28;
  return <Pic alt={ALT.umpolen} caption={<>Eine Person mit durchgehend gleichberechtigtem Rollenbild, zum Beispiel. Ohne Umpolen landet sie mit 2,5 scheinbar in der Mitte, nach dem Umpolen bei 1.</>}>
    <Svg w={720} h={250}>
      {names.map((n, i) => <g key={n}>
        <T x={60} y={ry(i) + 19} textAnchor="end" fill={INK} fontFamily="JetBrains Mono,monospace" fontSize={12}>{n}</T>
        <Stone x={70} y={ry(i)} w={sw} h={sh} value={String(before[i])} label={stickers[i]} />
        <T x={470} y={ry(i) + 19} textAnchor="end" fill={INK} fontFamily="JetBrains Mono,monospace" fontSize={12}>{i >= 2 ? `${n}_um` : n}</T>
        <Stone x={480} y={ry(i)} w={sw} h={sh} value={String(after[i])} label={stickers[i]} />
        {i >= 2 ? <g>
          <line x1={200} x2={300} y1={ry(i) + 14} y2={ry(i) + 14} stroke={GREEN.stroke} strokeWidth={2.5} />
          <path d={`M300,${ry(i) + 8} L312,${ry(i) + 14} L300,${ry(i) + 20} Z`} fill={GREEN.stroke} />
          <T x={256} y={ry(i) + 6} fontSize={10.5} fill={GREEN.stroke} fontFamily="JetBrains Mono,monospace">{'rec(…, rules = "rev")'}</T>
        </g> : null}
      </g>)}
      <rect x={150} y={40} width={64} height={30} rx={8} fill="#fff" stroke={INK} strokeWidth={1.5} />
      <T x={182} y={60} fill={INK} fontWeight={700} fontSize={12}>2,5</T>
      <T x={182} y={32} fontSize={11}>Mittelwert</T>
      <T x={182} y={88} fontSize={11} fill={ORANGE} fontWeight={700}>sieht aus wie</T>
      <T x={182} y={101} fontSize={11} fill={ORANGE} fontWeight={700}>teils/teils</T>
      <rect x={572} y={40} width={64} height={30} rx={8} fill="#fff" stroke={INK} strokeWidth={1.5} />
      <T x={604} y={60} fill={INK} fontWeight={700} fontSize={12}>1</T>
      <T x={604} y={32} fontSize={11}>Mittelwert</T>
      <T x={604} y={88} fontSize={11} fill={GREEN.stroke} fontWeight={700}>durchgehend</T>
      <T x={604} y={101} fontSize={11} fill={GREEN.stroke} fontWeight={700}>gleichberechtigt</T>
    </Svg>
    <div className="formel s8-formel" aria-hidden="true">
      <span className="s8-baustein">neuer Wert</span><span>=</span>
      <span>(</span><span className="s8-baustein">kleinster Code</span><span>+</span><span className="s8-baustein">größter Code</span><span>)</span>
      <span>−</span><span className="s8-baustein">alter Wert</span>
      <span className="s8-eingesetzt">Skala 1 bis 4: 5 − 4 = 1; Skala 1 bis 7: 8 − 2 = 6</span>
    </div>
  </Pic>;
}

/* ---------- B8 s8-umpol-labor ---------- */

type Flip = Record<FrId, boolean>;
export const labKey = (f: Flip) => FR_IDS.map(id => (f[id] ? 'U' : '-')).join('');

/** Live text of the lab for one state. */
export function labText(f: Flip): string {
  const [a, ...ts] = LAB[labKey(f)];
  const parts = FR_IDS.map((id, i) => `${id} ${d3(ts[i])}`).join(', ');
  let text = `Cronbachs α = ${d3(a)} (${alphaLabel(a)}). Trennschärfen: ${parts}.`;
  if (a < 0) text += ' α ist negativ: Die Items zeigen in verschiedene Richtungen. R meldet dann „Cronbach\'s alpha is negative … check the item codings“.';
  if (labKey(f) === 'UU--' || labKey(f) === '--UU') {
    text += ` Alle vier Trennschärfen sind positiv, α = 0,696. Jetzt zeigen alle Items in dieselbe Richtung. ${labKey(f) === '--UU' ? 'Hohe Zahl heißt jetzt bei allen: eher traditionell.' : 'Hohe Zahl heißt jetzt bei allen: eher gleichberechtigt.'}`;
  }
  return text;
}

/** Umpol-Labor: je Item ein Schalter; α und die vier Trennschärfen für alle 16 Zustände. */
export function ReverseLab() {
  const [f, setF] = useState<Flip>({ fr07: false, fr08: false, fr03b: false, fr04b: false });
  const [a, ...ts] = LAB[labKey(f)];
  const w = 660, x0 = 330, scale = 260 / 0.6, ry = (i: number) => 14 + i * 34;
  return <div className="s8-labor">
    <ul className="s8-schalter">{FR_IDS.map(id => <li key={id}>
      <button type="button" role="switch" aria-checked={f[id]} onClick={() => setF(s => ({ ...s, [id]: !s[id] }))}>
        <span className="s8-knopf" aria-hidden="true"></span>
        <span>{FR_SHORT[id]}</span>
        <small>{f[id] ? 'umgepolt' : 'so wie gefragt'}</small>
      </button>
    </li>)}</ul>
    <p className="rueck text" aria-live="polite">{labText(f)}</p>
    <div className="grafik">
      <Svg w={w} h={170}>
        {FR_IDS.map((id, i) => {
          const t = ts[i], neg = t < 0;
          return <g key={id}>
            <T x={14} y={ry(i) + 16} textAnchor="start" fill={INK} fontFamily="JetBrains Mono,monospace" fontSize={12}>{f[id] ? `${id}_um` : id}</T>
            <rect x={neg ? x0 + t * scale : x0} y={ry(i) + 3} width={Math.abs(t) * scale} height={18} rx={3}
              fill={neg ? '#FFD2BC' : BLUE.fill} stroke={neg ? ORANGE : BLUE.stroke} strokeWidth={1.2} />
            <T x={neg ? x0 + t * scale - 6 : x0 + t * scale + 6} y={ry(i) + 16} textAnchor={neg ? 'end' : 'start'} fontSize={12} fill={INK}>{d3(t)}</T>
          </g>;
        })}
        <line x1={x0} x2={x0} y1={6} y2={150} stroke={INK} strokeWidth={1.5} />
        {[-0.6, 0, 0.6].map(v => <T key={v} x={x0 + v * scale} y={166} fontSize={11}>{de(v, 1)}</T>)}
      </Svg>
    </div>
    <p className="hilfe-zeile">{`Cronbachs α = ${d3(a)}. Gerechnet mit den ${whole(LAB_N)} Befragten, die alle vier beantwortet haben.`}</p>
    <details className="werte">
      <summary>Alle 16 Möglichkeiten als Tabelle</summary>
      <table className="daten">
        <caption>α und Trennschärfen je Zustand (Reihenfolge fr07, fr08, fr03b, fr04b; U = umgepolt, - = wie gefragt)</caption>
        <thead><tr><th scope="col">Zustand</th><th scope="col">α</th>{FR_IDS.map(id => <th scope="col" key={id}>{id}</th>)}</tr></thead>
        <tbody>{Object.entries(LAB).map(([k, v]) => <tr key={k}><td><code>{k}</code></td>{v.map((x, i) => <td key={i}>{d3(x)}</td>)}</tr>)}</tbody>
      </table>
    </details>
  </div>;
}

/* ---------- B-A3 s8-trennschaerfe-vorher-nachher ---------- */

function Panel({ title, values, names, alpha }: { title: string; values: number[]; names: string[]; alpha: number }) {
  const lo = -0.5, hi = 0.8, pl = 74, w = 330, x = (v: number) => pl + (v - lo) / (hi - lo) * (w - pl - 20), ry = (i: number) => 34 + i * 30;
  return <svg viewBox={`0 0 ${w} 270`} aria-hidden="true" focusable="false">
    <T x={w / 2} y={18} fill={INK} fontWeight={800}>{title}</T>
    {values.map((v, i) => {
      const neg = v < 0;
      return <g key={i}>
        <T x={pl - 8} y={ry(i) + 15} textAnchor="end" fill={INK} fontFamily="JetBrains Mono,monospace" fontSize={11.5}>{names[i]}</T>
        <rect x={neg ? x(v) : x(0)} y={ry(i) + 2} width={Math.abs(x(v) - x(0))} height={18} rx={3} fill={neg ? '#FFD2BC' : BLUE.fill} stroke={neg ? ORANGE : BLUE.stroke} strokeWidth={1.2} />
        <T x={neg ? x(0) + 4 : x(v) + 4} y={ry(i) + 15} textAnchor="start" fontSize={11} fill={INK}>{d3(v)}</T>
      </g>;
    })}
    <line x1={x(0)} x2={x(0)} y1={28} y2={214} stroke={INK} strokeWidth={1.5} />
    <line x1={x(lo)} x2={x(hi)} y1={214} y2={214} stroke="#9aa4ad" strokeWidth={1.2} />
    {[-0.5, 0, 0.5].map(v => <T key={v} x={x(v)} y={230} fontSize={10.5}>{de(v, 1)}</T>)}
    <T x={(x(lo) + x(hi)) / 2} y={246} fontSize={11} fill={GRAY}>Trennschärfe</T>
    <T x={w / 2} y={264} fill={INK} fontWeight={700}>{`α = ${d3(alpha)}`}</T>
  </svg>;
}

/** Bild B-A3: Trennschärfen der sechs Aussagen vor und nach dem Umpolen von mm02 und mm05. */
export function BeforeAfter() {
  const after = MM_IDS.map(id => (id === 'mm02' || id === 'mm05' ? `${id}_um` : id));
  return <Pic alt={ALT.vorherNachher} className="s8-zwei" caption={<>Vorher zeigen zwei Balken nach links: Diese Aussagen laufen gegen die anderen. Nach dem Umpolen passen alle sechs. <span>ALLBUS 2023, ungewichtet, n = 3.069.</span></>}>
    <div className="s8-paar">
      <Panel title="vorher" values={MM_REL.before.corrected} names={[...MM_IDS]} alpha={MM_REL.before.alpha} />
      <Panel title="nach dem Umpolen" values={MM_REL.after.corrected} names={after} alpha={MM_REL.after.alpha} />
    </div>
  </Pic>;
}
