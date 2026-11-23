// Sitzung 11, Thema 1: Bilder B1 (Turm aus Nullen und Einsen), B2 (Gerade oder S-Kurve), B3 (drei Sprachen),
// Übersetzer und B4 (Decke). SVG ist dekorativ; jede Grafik hat eine gleichwertige Textfassung mit Werten.
import { useState, type KeyboardEvent } from 'react';
import { useAnnounce } from '../../blocks/announce';
import { AGE_GROUPS, CEILING, LINE, SMARTPHONE, TOWER, sCurve, straight } from '../content';
import { SvgText, de } from '../ui';

const ORANGE = '#F0A27E', ORANGE_D = '#c97b55', BROWN = '#8a4a2c', TEAL = '#2E8C86', RED = '#a0452f', INK = '#1E2D3C', GRAY = '#5F6A74';

/* ---------- B1 Turm lm30 ---------- */

export const B1_TEXT = 'Ein Turm lm30 aus zehn Steinen, zum Beispiel. Sieben Steine tragen eine 1 (Smartphone genannt), drei eine 0 (nicht genannt). Zählt man die Steine zusammen, kommt 7 heraus; geteilt durch 10 ergibt sich der Mittelwert 0,7. Das ist der Anteil der Einsen: 70 Prozent.';

/** B1 `s11-null-eins`: a tower of ten stones (seven ones, three zeros) and the mean as share of ones. */
export function ZeroOneTower() {
  const ones = TOWER.filter(v => v === 1).length;
  const sw = 150, sh = 24, x0 = 40, y0 = 62;
  return <div className="grafik" role="img" aria-label={B1_TEXT}>
    <svg viewBox="0 0 560 340" width="100%" aria-hidden="true" focusable="false">
      <SvgText x={20} y={18} textAnchor="start" fontStyle="italic" fontSize={12.5}>zum Beispiel zehn Befragte</SvgText>
      <SvgText x={x0 + sw / 2} y={38} fontSize={11} fontFamily="JetBrains Mono,monospace">{'<dbl+lbl>'}</SvgText>
      <SvgText x={x0 + sw / 2} y={55} fontSize={15} fontWeight={800} fill={INK} fontFamily="JetBrains Mono,monospace">lm30</SvgText>
      {TOWER.map((v, i) => <g key={i}>
        <rect x={x0} y={y0 + i * (sh + 3)} width={sw} height={sh} rx={6} fill={v ? '#8FCBA6' : '#FFFDF9'} stroke={v ? '#2f7a4f' : '#857A6B'} strokeWidth={1.5} />
        <SvgText x={x0 + 16} y={y0 + i * (sh + 3) + 17} fontWeight={800} fill={INK} fontSize={14}>{String(v)}</SvgText>
        <SvgText x={x0 + 88} y={y0 + i * (sh + 3) + 16} fontSize={10.5} fontWeight={700} fill={v ? '#1d4d32' : GRAY}>{v ? 'GENANNT' : 'NICHT GENANNT'}</SvgText>
      </g>)}
      <g>
        <rect x={250} y={88} width={150} height={44} rx={10} fill="#EDF8F1" stroke="#2f7a4f" />
        <SvgText x={325} y={106} fontSize={12}>Summe der Steine</SvgText>
        <SvgText x={325} y={124} fontSize={16} fontWeight={800} fill={INK}>{String(ones)}</SvgText>
        <line x1={250} x2={400} y1={146} y2={146} stroke={INK} strokeWidth={2.5} />
        <rect x={250} y={158} width={150} height={44} rx={10} fill="#fff" stroke="#857A6B" />
        <SvgText x={325} y={176} fontSize={12}>Anzahl der Steine</SvgText>
        <SvgText x={325} y={194} fontSize={16} fontWeight={800} fill={INK}>{String(TOWER.length)}</SvgText>
        <SvgText x={420} y={152} fontSize={22} fill={INK}>=</SvgText>
        <SvgText x={480} y={153} fontSize={24} fontWeight={800} fill={INK}>{de(ones / TOWER.length, 1)}</SvgText>
        <SvgText x={420} y={240} fontSize={14} fontWeight={700} fill="#2f7a4f" textAnchor="start">{`= ${Math.round(100 * ones / TOWER.length)} % haben eine 1`}</SvgText>
      </g>
    </svg>
  </div>;
}

/* ---------- B2 Gerade oder S-Kurve ---------- */

export type LineState = 'daten' | 'gerade' | 'kurve';
export const LINE_STATES: { id: LineState; label: string; sentence: string }[] = [
  { id: 'daten', label: 'Nur die Daten', sentence: 'Bis etwa 50 nennen fast alle das Smartphone, danach sinkt der Anteil immer schneller.' },
  { id: 'gerade', label: 'Mit Gerade', sentence: 'Die Gerade sagt für 18-Jährige 106,6 % voraus und unterschätzt die Mitte: Sie kann nicht biegen.' },
  { id: 'kurve', label: 'Mit S-Kurve', sentence: 'Die S-Kurve bleibt unter 100 % und folgt den Punkten: oben flach, in der Mitte steil.' },
];
const pct = (x: number) => de(100 * x, 1);
export const B2_AFTER = `Eine Gerade (lineare Regression) sagt für 18-Jährige ${pct(straight(18))} % voraus, für 95-Jährige ${pct(straight(95))} %. Eine S-Kurve (logistische Regression) sagt ${pct(SMARTPHONE.predict[18])} % und ${pct(SMARTPHONE.predict[95])} % voraus und liegt an jeder Altersgruppe höchstens 1,7 Prozentpunkte neben dem Anteil.`;

/** Accessible name of B2 for each state (short; the values are in the table below). */
export function lineImageText(state: LineState): string {
  const pts = `Sieben Punkte: Anteil der Internetnutzenden, die das Smartphone nennen, nach Alter, von ${de(AGE_GROUPS[0].share, 1)} % bei 18 bis 29 Jahren bis ${de(AGE_GROUPS[6].share, 1)} % bei 80 bis 99 Jahren; eine gestrichelte Linie bei 100 %.`;
  const line = ` Dazu eine Gerade von ${pct(straight(18))} % bei 18 Jahren bis ${pct(straight(95))} % bei 95 Jahren; bis etwa 32 Jahre liegt sie über 100 %.`;
  const curve = ` Dazu eine S-Kurve von ${pct(SMARTPHONE.predict[18])} % bei 18 Jahren bis ${pct(SMARTPHONE.predict[95])} % bei 95 Jahren, dicht an allen Punkten; die Gerade bleibt blass sichtbar.`;
  return pts + (state === 'gerade' ? line : state === 'kurve' ? curve : '');
}

/** B2 `s11-gerade-s`: shares by age group, with a straight line or an S-curve (three toggle buttons). */
export function LineOrCurve() {
  const [state, setState] = useState<LineState>('daten');
  const [sentence, announce] = useAnnounce(LINE_STATES[0].sentence, '');
  const W = 640, H = 340, L = 56, R = 20, T = 20, B = 46;
  const x = (a: number) => L + (a - 15) / 85 * (W - L - R);
  const y = (p: number) => T + (110 - p) / 110 * (H - T - B);
  const curve = Array.from({ length: 78 }, (_, i) => 18 + i).map((a, i) => `${i ? 'L' : 'M'}${x(a).toFixed(1)},${y(100 * sCurve(a)).toFixed(1)}`).join(' ');
  const over = (1 - LINE.intercept) / LINE.slope; // Alter, bis zu dem die Gerade über 100 % liegt
  function choose(s: LineState) {
    setState(s);
    announce(LINE_STATES.find(z => z.id === s)!.sentence);
  }
  return <>
    <div className="s11-umschalter" role="group" aria-label="Was das Bild zeigt">
      {LINE_STATES.map(s => <button key={s.id} type="button" className="knopf hell" aria-pressed={state === s.id} onClick={() => choose(s.id)}>{s.label}</button>)}
    </div>
    <div className="grafik" role="img" aria-label={lineImageText(state)}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" aria-hidden="true" focusable="false">
        {[0, 25, 50, 75, 100].map(p => <g key={p}>
          <line x1={L} x2={W - R} y1={y(p)} y2={y(p)} stroke="#EFE6DA" />
          <SvgText x={L - 8} y={y(p) + 4} textAnchor="end" fontSize={12}>{String(p)}</SvgText>
        </g>)}
        {[20, 40, 60, 80, 100].map(a => <SvgText key={a} x={x(a)} y={H - B + 18} fontSize={12}>{String(a)}</SvgText>)}
        <SvgText x={(L + W - R) / 2} y={H - 6} fontSize={12.5} fontWeight={700} fill={INK}>Alter in Jahren</SvgText>
        <SvgText x={14} y={(T + H - B) / 2} fontSize={12.5} fontWeight={700} fill={INK} transform={`rotate(-90 14 ${(T + H - B) / 2})`}>Anteil mit Smartphone (%)</SvgText>
        <line x1={L} x2={L} y1={T} y2={H - B} stroke={INK} strokeWidth={1.5} />
        <line x1={L} x2={W - R} y1={H - B} y2={H - B} stroke={INK} strokeWidth={1.5} />
        <line x1={L} x2={W - R} y1={y(100)} y2={y(100)} stroke={RED} strokeWidth={1.8} strokeDasharray="6 5" />
        <SvgText x={W - R - 4} y={y(100) - 6} textAnchor="end" fontSize={12} fontWeight={700} fill={RED}>100 %: mehr geht nicht</SvgText>
        {state !== 'daten' ? <g opacity={state === 'kurve' ? 0.3 : 1}>
          {state === 'gerade' ? <>
            <rect x={x(18)} y={y(110)} width={x(over) - x(18)} height={y(100) - y(110)} fill="#fdeeea" />
            <SvgText x={x(18) + 4} y={y(108)} textAnchor="start" fontSize={11.5} fontWeight={700} fill={RED}>über 100 %</SvgText>
          </> : null}
          <line x1={x(18)} x2={x(95)} y1={y(100 * straight(18))} y2={y(100 * straight(95))} stroke={BROWN} strokeWidth={3} />
          {state === 'gerade' ? <line x1={x(18)} x2={x(over)} y1={y(100 * straight(18))} y2={y(100)} stroke={RED} strokeWidth={4} /> : null}
        </g> : null}
        {state === 'kurve' ? <path d={curve} fill="none" stroke={TEAL} strokeWidth={3.5} /> : null}
        {AGE_GROUPS.map(g => <g key={g.label}>
          <circle cx={x(g.mid)} cy={y(g.share)} r={6} fill={ORANGE} stroke={ORANGE_D} strokeWidth={1.5} />
          <SvgText x={x(g.mid)} y={y(g.share) + 20} fontSize={10.5}>{g.label}</SvgText>
        </g>)}
      </svg>
    </div>
    <div className="legende" aria-hidden="true">
      <span><i style={{ background: ORANGE }} />echte Daten (gewichtet)</span>
      {state !== 'daten' ? <span><i style={{ background: BROWN }} />Gerade</span> : null}
      {state === 'kurve' ? <span><i style={{ background: TEAL }} />Modell (S-Kurve)</span> : null}
    </div>
    <p className="rueck text" aria-live="polite">{sentence}</p>
    <details className="werte">
      <summary>Werte als Tabelle</summary>
      <table className="daten">
        <caption>Anteil der Internetnutzenden, die das Smartphone nennen, nach Alter, gewichtet, ALLBUS 2023.</caption>
        <thead><tr><th scope="col">Altersgruppe</th><th scope="col">befragte Personen</th><th scope="col">Anteil mit Smartphone</th></tr></thead>
        <tbody>{AGE_GROUPS.map(g => <tr key={g.label}><td>{g.label}</td><td>{String(g.n)}</td><td>{`${de(g.share, 1)} %`}</td></tr>)}</tbody>
      </table>
      <p>{B2_AFTER}</p>
    </details>
  </>;
}

/* ---------- B3 Drei Sprachen ---------- */

export const B3_TEXT = 'Drei Sprachen für dieselbe Gruppe. Wahrscheinlichkeit: 77,7 von 100 nennen das Smartphone, das ist p gleich 0,777; sie liegt zwischen 0 und 1. Chance, englisch Odds: p geteilt durch 1 minus p, also 77,7 geteilt durch 22,3 gleich 3,48, gesprochen „3,48 zu 1“; sie liegt zwischen 0 und unendlich. Logit: der natürliche Logarithmus der Chance, ln von 3,48 gleich 1,25; er kann jede Zahl annehmen. Zurück geht es mit exp: e hoch Logit ergibt die Chance, und Chance geteilt durch 1 plus Chance ergibt die Wahrscheinlichkeit.';

/** B3 `s11-drei-sprachen`: three boxes with arrows forth (p / (1 − p), ln) and back (exp, Chance / (1 + Chance)). */
export function ThreeLanguages() {
  return <div className="s11-sprachen" role="img" aria-label={B3_TEXT}>
    <div className="s11-kaesten">
      <div className="s11-kasten blau"><b>Wahrscheinlichkeit p</b><span className="gross">77,7 von 100</span><small>von 0 bis 1 (0 bis 100 %)</small></div>
      <div className="s11-pfeil"><span>p / (1 − p)</span><i>→</i><i className="zurueck">←</i><span className="zurueck">Chance / (1 + Chance)</span></div>
      <div className="s11-kasten gelb"><b>Chance (Odds)</b><span className="gross">77,7 / 22,3 = 3,48</span><small>„3,48 zu 1“, von 0 bis unendlich</small></div>
      <div className="s11-pfeil"><span>ln( )</span><i>→</i><i className="zurueck">←</i><span className="zurueck">exp( )</span></div>
      <div className="s11-kasten lila"><b>Logit</b><span className="gross">ln(3,48) = 1,25</span><small>von minus bis plus unendlich</small></div>
    </div>
    <div className="s11-zeichen">
      <span><b>p</b><small>Anteil mit Ja</small></span>
      <span><b>1 − p</b><small>Anteil mit Nein</small></span>
      <span><b>ln</b><small>natürlicher Logarithmus, die Umkehrung von exp</small></span>
      <span><b>exp</b><small>e hoch …</small></span>
    </div>
  </div>;
}

/* ---------- Übersetzer ---------- */

/** Chance and logit with two decimals (whole numbers without decimals): „3,55“, „1“, „−4,60“. */
export const two = (x: number) => (Math.abs(Math.round(x * 100) / 100 - Math.round(x)) < 1e-9 ? de(Math.round(x), 0) : de(x, 2));
export const chanceOf = (p: number) => p / (100 - p);
export const logitOf = (p: number) => Math.log(chanceOf(p));
export const TRANSLATOR_ROWS = [1, 5, 10, 20, 25, 50, 75, 80, 90, 95, 99];
export const TRANSLATOR_GROUPS = 'Die echten Altersgruppen: 18–29 Jahre 99,2 %, Chance 124, Logit 4,82; 70–79 Jahre 77,7 %, Chance 3,48, Logit 1,25; 80–99 Jahre 59,3 %, Chance 1,46, Logit 0,38.';
export const TRANSLATOR_NOTES: Record<number, string> = {
  50: 'Bei 50 % ist die Chance 1 („1 zu 1“) und der Logit 0.',
  90: 'Von 90 auf 99 % sind es nur 9 Prozentpunkte, aber die Chance wächst von 9 auf 99.',
};

/** Live text of the translator. */
export function translatorText(p: number): string {
  return `Wahrscheinlichkeit ${p} %, Chance ${two(chanceOf(p))} („${two(chanceOf(p))} zu 1“), Logit ${two(logitOf(p))}.`;
}

/** „Übersetzer“ below B3: a slider for the probability (1 to 99 %), the chance and the logit, and 100 stones. */
export function Translator() {
  const [p, setP] = useState(78);
  const [live, announce] = useAnnounce(translatorText(78), '');
  function set(v: number) {
    const next = Math.min(99, Math.max(1, v));
    setP(next);
    announce(`${translatorText(next)}${TRANSLATOR_NOTES[next] ? ` ${TRANSLATOR_NOTES[next]}` : ''}`);
  }
  function key(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'PageUp' || e.key === 'PageDown') { e.preventDefault(); set(p + (e.key === 'PageUp' ? 10 : -10)); }
  }
  return <div className="s11-uebersetzer">
    <div className="feld">
      <label htmlFor="s11-p">Wahrscheinlichkeit</label>
      <input type="range" id="s11-p" min={1} max={99} step={1} value={p} aria-valuetext={`${p} %`} onKeyDown={key} onChange={e => set(Number(e.target.value))} />
      <output htmlFor="s11-p" aria-live="off">{`${p} %`}</output>
    </div>
    <div className="reihe-knoepfe" role="group" aria-label="Merkpunkte">
      {[50, 90, 99].map(v => <button key={v} type="button" className="knopf hell" onClick={() => set(v)}>{`${v} %`}</button>)}
    </div>
    <div className="s11-drei" aria-hidden="true">
      <span className="blau"><small>Wahrscheinlichkeit</small><b>{`${p} %`}</b></span>
      <span className="gelb"><small>Chance</small><b>{two(chanceOf(p))}</b><small>{`„${two(chanceOf(p))} zu 1“`}</small></span>
      <span className="lila"><small>Logit</small><b>{two(logitOf(p))}</b></span>
    </div>
    <p className="rueck text" aria-live="polite">{live}</p>
    <div className="s11-raster" aria-hidden="true">
      {Array.from({ length: 100 }, (_, i) => <i key={i} className={i < p ? 'ja' : undefined} />)}
    </div>
    <details className="werte">
      <summary>Werte als Tabelle</summary>
      <table className="daten">
        <caption>Wahrscheinlichkeit, Chance und Logit</caption>
        <thead><tr><th scope="col">Wahrscheinlichkeit</th><th scope="col">Chance</th><th scope="col">Logit</th></tr></thead>
        <tbody>{TRANSLATOR_ROWS.map(r => <tr key={r}><td>{`${r} %`}</td><td>{two(chanceOf(r))}</td><td>{two(logitOf(r))}</td></tr>)}</tbody>
      </table>
      <p>{TRANSLATOR_GROUPS}</p>
    </details>
  </div>;
}

/* ---------- B4 Decke ---------- */

export const B4_TEXT = 'Zum Beispiel vier Stufen mit 50, 70, 88 und 97 Prozent. Die Zuwächse werden nach oben kleiner: plus 20, plus 18, plus 9 Prozentpunkte, weil bis 100 Prozent immer weniger Platz bleibt. Mit gleich großen Schritten von 20 Punkten läge die vierte Stufe bei 110 Prozent, und das ist unmöglich.';

/** B4 `s11-decke`: four columns (constructed) with shrinking steps, pale columns with equal steps up to 110 %. */
export function Ceiling() {
  const W = 560, H = 300, base = 260, scale = 2;
  const y = (v: number) => base - v * scale;
  return <div className="grafik" role="img" aria-label={B4_TEXT}>
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" aria-hidden="true" focusable="false">
      <defs>
        <pattern id="s11-schraffur" width={6} height={6} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width={3} height={6} fill="#e3a493" />
        </pattern>
      </defs>
      <SvgText x={16} y={18} textAnchor="start" fontStyle="italic" fontSize={12.5}>zum Beispiel</SvgText>
      <line x1={40} x2={W - 16} y1={y(100)} y2={y(100)} stroke={RED} strokeWidth={1.8} strokeDasharray="6 5" />
      <SvgText x={44} y={y(100) - 6} textAnchor="start" fontSize={12} fontWeight={700} fill={RED}>100 %</SvgText>
      <line x1={40} x2={W - 16} y1={base} y2={base} stroke={INK} strokeWidth={1.5} />
      {CEILING.real.map((v, i) => {
        const cx = 90 + i * 120, e = CEILING.equal[i];
        return <g key={i}>
          <rect x={cx + 26} y={y(Math.min(e, 100))} width={34} height={base - y(Math.min(e, 100))} rx={4} fill="#F1EFFC" stroke="#c9c2ef" />
          {e > 100 ? <rect x={cx + 26} y={y(e)} width={34} height={y(100) - y(e)} rx={4} fill="url(#s11-schraffur)" stroke={RED} /> : null}
          <SvgText x={cx + 43} y={y(e) - 5} fontSize={11}>{`${e} %`}</SvgText>
          <rect x={cx - 20} y={y(v)} width={44} height={base - y(v)} rx={5} fill="#86B9DE" stroke="#2C6CA8" strokeWidth={1.5} />
          <SvgText x={cx + 2} y={y(v) - 6} fontSize={13} fontWeight={800} fill={INK}>{`${v} %`}</SvgText>
          <SvgText x={cx + 20} y={base + 18} fontSize={12.5} fontWeight={700} fill={INK}>{`Stufe ${i + 1}`}</SvgText>
          {i > 0 ? <SvgText x={cx - 40} y={y((CEILING.real[i - 1] + v) / 2) + 4} fontSize={12.5} fontWeight={800} fill="#2f7a4f">{`+${v - CEILING.real[i - 1]}`}</SvgText> : null}
        </g>;
      })}
      <SvgText x={W / 2} y={H - 4} fontSize={11.5}>blau: die Stufen; blass: gleich große Schritte von 20 Punkten</SvgText>
    </svg>
  </div>;
}

export { GRAY, INK, ORANGE, ORANGE_D, RED, TEAL, BROWN };
