// Sitzung 8, Thema 2: B4 (Korrelationstabelle), B5 (Formel für α), α-Rechner, B6 (Ausgabe von reliability()), B-A2 (α ohne Aussage).
import { useState } from 'react';
import {
  ALPHA_EXAMPLES, ALPHA_RULES, ALT, PA_IDS, PA_REL, PN_COR, PN_IDS, PN_MEAN_COR, PN_NAMES, PN_REL, PN_RBAR, alphaLabel, alphaStd,
} from '../content';
import { BLUE, GRAY, GREEN, INK, ORANGE, Pic, Svg, T, de } from './kit';

const d3 = (x: number) => de(x, 3);
/** R prints three decimals with a point. */
const r3 = (x: number) => x.toFixed(3);

/* ---------- B4 s8-korrelationen-pn ---------- */

/** Colour step of a correlation: under 0,3 light, 0,3 to 0,5 middle, over 0,5 strong. */
export const corStep = (r: number) => (r < 0.3 ? 'hell' : r <= 0.5 ? 'mittel' : 'kraeftig');

/** Text after choosing a level in picture B4. */
export const corText = (i: number | null) => (i === null ? 'Wähl eine Ebene.'
  : `${PN_NAMES[i]}: mittlere Korrelation mit den anderen drei ${d3(PN_MEAN_COR[i])}.`);

/** Bild B4: Korrelationen der vier Fragen zur Verbundenheit; ein Knopf je Ebene hebt Zeile und Spalte hervor. */
export function CorrelationTable() {
  const [sel, setSel] = useState<number | null>(null);
  const head = PN_IDS.map((id, i) => `${PN_NAMES[i]} (${id})`);
  return <div className="s8-kor">
    <div className="s8-umschalter" role="group" aria-label="Ebene wählen">
      {PN_NAMES.map((n, i) => <button key={n} type="button" aria-pressed={sel === i} onClick={() => setSel(sel === i ? null : i)}>{n}</button>)}
    </div>
    <div className="grafik">
      <table className="daten s8-matrix">
        <caption>Korrelationen der vier Fragen zur Verbundenheit, ALLBUS 2023, ungewichtet, n = 3.521</caption>
        <thead><tr><td></td>{head.map((h, j) => <th scope="col" key={h} className={sel === j ? 'wahl' : undefined}>{h}</th>)}</tr></thead>
        <tbody>{PN_COR.map((row, i) => <tr key={i} className={sel === i ? 'wahl' : undefined}>
          <th scope="row">{head[i]}</th>
          {row.map((r, j) => <td key={j} className={`${i === j ? 'diag' : corStep(r)}${sel === j ? ' wahl' : ''}`}>{i === j ? '1' : d3(r)}</td>)}
        </tr>)}</tbody>
      </table>
    </div>
    <p className="rueck text" aria-live="polite">{corText(sel)}</p>
    <p className="hilfe-zeile">{ALT.korrelationen}</p>
    <p className="hilfe-zeile">Eine solche Tabelle kennst du aus Sitzung 7 (<code>pearson_cor()</code> mit mehreren Variablen). Ein Unterschied: Hier zählen nur die 3.521 Befragten, die alle vier Fragen beantwortet haben (listenweiser Ausschluss), nicht jedes Paar für sich. So rechnet auch Cronbachs α. Die Tabelle steht deshalb in der ausführlichen Ausgabe von <code>reliability()</code> gleich mit (Inter-Item Correlation Matrix, Karte 2c).</p>
  </div>;
}

/* ---------- B5 s8-formel-alpha ---------- */

/** Bild B5: die standardisierte Formel für α als Bausteine, eingesetzt für die Verbundenheit. */
export function AlphaFormula() {
  return <div className="formel s8-formel" role="group" aria-label="Formel für Cronbachs α">
    <span className="gross" aria-hidden="true">α</span><span aria-hidden="true">=</span>
    <span className="frac s8-gross-frac" aria-hidden="true">
      <span><b className="s8-k">k</b> × <b className="s8-r">r̄</b></span>
      <span>1 + (<b className="s8-k">k</b> − 1) × <b className="s8-r">r̄</b></span>
    </span>
    <span className="s8-legende" aria-hidden="true"><b className="s8-k">k</b> Zahl der Items <b className="s8-r">r̄</b> mittlere Korrelation</span>
    <span className="s8-eingesetzt" aria-hidden="true">k = 4, r̄ = 0,404: oben 4 × 0,404 = 1,616; unten 1 + 3 × 0,404 = 2,212; α = 1,616 / 2,212 = 0,731</span>
    <span className="s8-eingesetzt klein" aria-hidden="true">Die mittlere Korrelation 0,404 ist der Durchschnitt der sechs Zahlen aus der Tabelle: (0,568 + 0,340 + 0,190 + 0,528 + 0,304 + 0,495) / 6.</span>
    <span className="sr-only">{ALT.formelAlpha}</span>
  </div>;
}

/* ---------- α-Rechner ---------- */

/** Live text of the α calculator. */
export function calcText(k: number, r: number): string {
  const a = Math.round(alphaStd(k, r) * 1000) / 1000;
  return `k = ${k}, r̄ = ${de(r, 3)}: α = (${k} × ${de(r, 3)}) / (1 + ${k - 1} × ${de(r, 3)}) = ${d3(a)}, ${alphaLabel(a)}.`;
}

/** α-Rechner: Schieberegler für k und r̄, Einstufung wie mariposa, Balken von 0 bis 1. */
export function AlphaCalculator() {
  const [k, setK] = useState(4);
  const [r, setR] = useState(0.4);
  const a = alphaStd(k, r);
  const x = (v: number) => 20 + v * 620;
  return <div className="s8-rechner">
    <div className="feld">
      <label htmlFor="s8-k">Zahl der Items k</label>
      <input type="range" id="s8-k" min={2} max={20} step={1} value={k} aria-valuetext={`${k} Items`} onChange={e => setK(Number(e.target.value))} />
      <output htmlFor="s8-k" aria-live="off">{k}</output>
    </div>
    <div className="feld">
      <label htmlFor="s8-r">mittlere Korrelation r̄</label>
      <input type="range" id="s8-r" min={0} max={0.9} step={0.01} value={r} aria-valuetext={de(r, 3)} onChange={e => setR(Number(e.target.value))} />
      <output htmlFor="s8-r" aria-live="off">{de(r, 3)}</output>
    </div>
    <div className="reihe-knoepfe"><button type="button" className="knopf hell" onClick={() => { setK(4); setR(PN_RBAR); }}>Verbundenheit einsetzen</button></div>
    <p className="rueck text" aria-live="polite">{calcText(k, r)}</p>
    <div className="grafik">
      <Svg w={660} h={60}>
        <line x1={x(0)} x2={x(1)} y1={30} y2={30} stroke="#9aa4ad" strokeWidth={6} strokeLinecap="round" />
        {[0.6, 0.7, 0.8, 0.9].map(m => <g key={m}>
          <line x1={x(m)} x2={x(m)} y1={20} y2={40} stroke={GRAY} strokeWidth={2} />
          <T x={x(m)} y={55} fontSize={11}>{de(m, 1)}</T>
        </g>)}
        <T x={x(0)} y={55} fontSize={11}>0</T><T x={x(1)} y={55} fontSize={11}>1</T>
        <circle cx={x(Math.max(0, Math.min(1, a)))} cy={30} r={9} fill={GREEN.stroke} />
      </Svg>
    </div>
    <details className="werte">
      <summary>Beispiele</summary>
      <table className="daten">
        <caption>α für einige k und r̄</caption>
        <thead><tr><th scope="col">k</th><th scope="col">r̄</th><th scope="col">α</th></tr></thead>
        <tbody>{ALPHA_EXAMPLES.map(([kk, rr, aa]) => <tr key={`${kk}-${rr}`}><td>{kk}</td><td>{de(rr, rr === 0.404 ? 3 : 1)}</td><td>{d3(aa)}</td></tr>)}</tbody>
      </table>
    </details>
  </div>;
}

/* ---------- B6 s8-reliability-ausgabe ---------- */

type Pick6 = 'alpha' | 'corrected' | 'deleted';
const PICK_LABELS: [Pick6, string][] = [['alpha', "Cronbach's Alpha"], ['corrected', 'Corrected Item-Total'], ['deleted', 'Alpha if Deleted']];
export const OUTPUT_TEXT: Record<Pick6, string> = {
  alpha: 'Cronbachs α = 0,726, mit allen vier Items. In der kurzen Ausgabe steht dahinter „Acceptable“: nach der Faustregel annehmbar (ab 0,7). Gerechnet mit den 3.521 Befragten, die alle vier Fragen beantwortet haben.',
  corrected: 'Das ist die Trennschärfe: die Korrelation eines Items mit der Summe der übrigen Items. Sie zeigt, wie gut ein Item zu den anderen passt. pn13 (Bundesland) passt am besten (0,620), pn17 (EU) am schwächsten (0,402).',
  deleted: 'So hoch wäre α ohne dieses Item. Nur bei pn17 (EU) läge α ohne das Item höher als mit ihm: 0,733 statt 0,726. Ohne pn13 (Bundesland) fiele α deutlich, auf 0,603.',
};

/** Bild B6: die Ausgabe von summary(reliability(pn12, pn13, pn16, pn17)) mit drei Knöpfen, die je eine Zahl erklären. */
export function ReliabilityOutput() {
  const [sel, setSel] = useState<Pick6 | null>(null);
  const stats: [string, string, boolean][] = [
    ["Cronbach's Alpha:", r3(PN_REL.alpha), sel === 'alpha'],
    ['Alpha (standardized):', r3(PN_REL.alphaStd), false],
    ["McDonald's Omega:", r3(PN_REL.omega), false],
    ['Omega (standardized):', r3(PN_REL.omegaStd), false],
    ['N of Items:', String(PN_REL.k), false],
    ['N (listwise):', String(PN_REL.n), sel === 'alpha'],
  ];
  const hl = (col: Pick6, id: string) => (sel === col ? (id === 'pn17' ? 'wahl stark' : 'wahl') : undefined);
  return <div className="s8-ausgabe">
    <div className="s8-umschalter" role="group" aria-label="Zahl wählen">
      {PICK_LABELS.map(([k, l]) => <button key={k} type="button" lang="en" aria-pressed={sel === k} onClick={() => setSel(sel === k ? null : k)}>{l}</button>)}
    </div>
    <div className="grafik">
      <table className="daten s8-r-aus" lang="en">
        <caption>Reliability Statistics</caption>
        <tbody>{stats.map(([l, v, on]) => <tr key={l} className={on ? 'wahl' : undefined}><th scope="row">{l}</th><td className={l.startsWith('Cronbach') && sel === 'deleted' ? 'gestrichelt' : undefined}>{v}</td></tr>)}</tbody>
      </table>
      <table className="daten s8-r-aus" lang="en">
        <caption>Item-Total Statistics</caption>
        <thead><tr>
          <th scope="col">Item</th><th scope="col">Scale Mean if Deleted</th><th scope="col">Scale Var. if Deleted</th>
          <th scope="col" className={sel === 'corrected' ? 'wahl' : undefined}>Corrected Item-Total</th>
          <th scope="col" className={sel === 'deleted' ? 'wahl' : undefined}>Alpha if Deleted</th><th scope="col">Omega if Deleted</th>
        </tr></thead>
        <tbody>{PN_REL.items.map(it => <tr key={it.id}>
          <th scope="row">{it.id}</th><td>{r3(it.meanIfDeleted)}</td><td>{r3(it.varIfDeleted)}</td>
          <td className={hl('corrected', it.id)}>{r3(it.corrected)}</td><td className={hl('deleted', it.id)}>{r3(it.alphaIfDeleted)}</td><td>{r3(it.omegaIfDeleted)}</td>
        </tr>)}</tbody>
      </table>
    </div>
    <p className="rueck text" aria-live="polite">{sel ? OUTPUT_TEXT[sel] : 'Wähl eine Zahl.'}</p>
    <p className="hilfe-zeile">Die übrigen Spalten brauchst du heute nicht. In deiner eigenen Ausgabe stehen zwischen den beiden Teilen noch zwei weitere: „Item Statistics“ (Mittelwert und Streuung je Item) und „Inter-Item Correlation Matrix“ (die Korrelationstabelle aus Karte 2a). Für α und die Trennschärfe springst du zu „Reliability Statistics“ oben und „Item-Total Statistics“ ganz unten.</p>
    <details className="werte">
      <summary>Alle drei Zahlen erklärt</summary>
      <ul>{PICK_LABELS.map(([k, l]) => <li key={k}><b lang="en">{l}:</b> {OUTPUT_TEXT[k]}</li>)}</ul>
    </details>
  </div>;
}

/** Faustregeln unter Bild B6. */
export function AlphaRules() {
  return <table className="daten voll">
    <caption>So stuft mariposa α ein</caption>
    <thead><tr><th scope="col">α</th><th scope="col">mariposa schreibt</th><th scope="col">heißt etwa</th></tr></thead>
    <tbody>{ALPHA_RULES.map(([a, m, s]) => <tr key={a}><td>{a}</td><td lang="en">{m}</td><td>{s}</td></tr>)}</tbody>
  </table>;
}

/* ---------- B-A2 s8-alpha-ohne ---------- */

/** Bild B-A2: α ohne die jeweilige Aussage, Achse ab 0,78. */
export function AlphaWithout() {
  const lo = 0.78, hi = 0.85, w = 700, pl = 70, pr = 70, x = (v: number) => pl + (v - lo) / (hi - lo) * (w - pl - pr);
  const ry = (i: number) => 20 + i * 30;
  return <Pic alt={ALT.alphaOhne} caption={<>Nur ohne pa29 läge α höher als mit allen sieben, und auch nur um 0,009. Die Achse beginnt bei 0,78, damit die kleinen Unterschiede sichtbar sind. <span>ALLBUS 2023, ungewichtet, n = 3.427.</span></>}>
    <Svg w={w} h={290}>
      {PA_IDS.map((id, i) => {
        const v = PA_REL.alphaIfDeleted[i], up = v > PA_REL.alpha;
        return <g key={id}>
          <T x={pl - 10} y={ry(i) + 15} textAnchor="end" fill={INK} fontFamily="JetBrains Mono,monospace" fontSize={12.5}>{id}</T>
          <rect x={x(lo)} y={ry(i) + 2} width={x(v) - x(lo)} height={20} rx={3} fill={up ? '#FFD2BC' : BLUE.fill} stroke={up ? ORANGE : BLUE.stroke} strokeWidth={1.2} />
          <T x={x(v) + 6} y={ry(i) + 16} textAnchor="start" fontSize={12} fill={INK}>{d3(v)}</T>
        </g>;
      })}
      <line x1={x(PA_REL.alpha)} x2={x(PA_REL.alpha)} y1={10} y2={232} stroke={INK} strokeWidth={1.5} strokeDasharray="5 4" />
      <T x={x(PA_REL.alpha)} y={248} fontSize={11.5} fill={INK}>α mit allen sieben: 0,833</T>
      <line x1={x(lo)} x2={x(hi)} y1={232} y2={232} stroke="#9aa4ad" strokeWidth={1.5} />
      {[0.78, 0.8, 0.82, 0.84].map(v => <T key={v} x={x(v)} y={266} fontSize={11}>{de(v, 2)}</T>)}
      <T x={(x(lo) + x(hi)) / 2} y={284} fontSize={11.5}>α ohne diese Aussage</T>
    </Svg>
  </Pic>;
}
