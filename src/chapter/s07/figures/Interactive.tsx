import { useState } from 'react';
import {
  ALARM, F_LAB, F_LAB_DISTANCES, F_LAB_FEEDBACK, F_LAB_GRAND, F_LAB_OFFSETS, F_LAB_SPREADS, N_DIFF, N_FEEDBACK, N_STEPS, type FLabRow, type NStep,
} from '../content';
import { de, pText, whole } from '../format';
import { T } from './Figures';

/* Grundlage 2a (n-Regler), 3a (Paare zählen), 3b (F-Labor): konstruierte Beispiele, alle Zahlen vorberechnet. */

const num = (x: number) => x.toLocaleString('de-DE', { maximumFractionDigits: 2 });
const pLine = (p: number, d = 3) => (p === 0 ? 'p < 0,001' : `p = ${pText(p, d)}`);

/* ---------- n-Regler ---------- */

const zeroInside = (s: NStep) => s.lo <= 0 && s.hi >= 0;
export const nStepText = (s: NStep) =>
  `${whole(s.n)} Befragte je Gruppe: 95-%-Intervall ${de(s.lo, 2)} bis ${de(s.hi, 2)}. ${zeroInside(s) ? N_FEEDBACK.open : N_FEEDBACK.significant}`;

export function NSlider() {
  const [k, setK] = useState(0);
  const s = N_STEPS[k], inside = zeroInside(s);
  const W = 640, pl = 24, pr = 24, x = (v: number) => pl + (v + 1) / 2.5 * (W - pl - pr), y = 62;
  return <div className="s07-nregler">
    <div className="feld">
      <label htmlFor="n-regler">Befragte je Gruppe</label>
      <input type="range" id="n-regler" min={0} max={N_STEPS.length - 1} step={1} value={k}
        aria-valuetext={`${whole(s.n)} Befragte je Gruppe`} onChange={e => setK(Number(e.target.value))} />
      <output htmlFor="n-regler" aria-live="off">{whole(s.n)}</output>
    </div>
    <div className="grafik" aria-hidden="true">
      <svg viewBox={`0 0 ${W} 120`} width="100%" focusable="false">
        <T x={pl} y={16} textAnchor="start" fontWeight={700}>Zum Beispiel: Unterschied 0,3 Punkte, Standardabweichung 2 in beiden Gruppen</T>
        <line x1={x(0)} x2={x(0)} y1={28} y2={92} stroke="#8a939c" strokeWidth={1.5} strokeDasharray="5 4" />
        <line x1={x(s.lo)} x2={x(s.hi)} y1={y} y2={y} stroke={inside ? '#9CC9C3' : '#1f7a70'} strokeWidth={inside ? 5 : 7}
          strokeDasharray={inside ? '9 6' : undefined} strokeLinecap="round" />
        <circle cx={x(N_DIFF)} cy={y} r={6} fill="#1E2D3C" />
        <line x1={pl} x2={W - pr} y1={92} y2={92} stroke="#9aa4ad" strokeWidth={1.5} />
        {[-1, -0.5, 0, 0.5, 1, 1.5].map(t => <T key={t} x={x(t)} y={108}>{de(t, 1)}</T>)}
      </svg>
    </div>
    <p className="s07-zeile">{`t = ${de(s.t, 2)}, ${pLine(s.p)}, Effektstärke d = 0,15`}</p>
    <p className={`rueck${inside ? '' : ' ok'}`} aria-live="polite">{nStepText(s)}</p>
    <p className="hilfe-zeile">{N_FEEDBACK.fixed}</p>
    <details className="werte">
      <summary>Werte als Tabelle</summary>
      <table className="daten">
        <caption>n-Regler, zum Beispiel: Unterschied 0,3, Standardabweichung 2</caption>
        <thead><tr><th scope="col">Befragte je Gruppe</th><th scope="col">Standardfehler</th><th scope="col">t</th><th scope="col">p</th><th scope="col">95-%-Intervall</th></tr></thead>
        <tbody>{N_STEPS.map(r => <tr key={r.n}><td>{whole(r.n)}</td><td>{de(r.se, 2)}</td><td>{de(r.t, 2)}</td><td>{pText(r.p)}</td><td>{`${de(r.lo, 2)} bis ${de(r.hi, 2)}`}</td></tr>)}</tbody>
      </table>
    </details>
  </div>;
}

/* ---------- Paare zählen ---------- */

const PALETTE = ['#86B9DE', '#8FCBA6', '#A79FE2', '#F0A27E', '#E39AB6', '#86CBC3'];
export const alarmText = (groups: number) => {
  const a = ALARM.find(x => x.groups === groups)!;
  return `${a.pairs} ${a.pairs === 1 ? 'Paar' : 'Paare'}. Wahrscheinlichkeit für mindestens einen Fehlalarm (Fehler 1. Art), wenn es nirgends einen Unterschied gibt: ${de(a.risk, 1)} %`;
};

export function PairsCounter() {
  const [k, setK] = useState(3);
  const c = 110, R = 80, pts = Array.from({ length: k }, (_, i) => {
    const a = -Math.PI / 2 + i * 2 * Math.PI / k;
    return { x: c + R * Math.cos(a), y: c + R * Math.sin(a) };
  });
  const lines = [];
  for (let i = 0; i < k; i++) for (let j = i + 1; j < k; j++) lines.push(<line key={`${i}-${j}`} x1={pts[i].x} y1={pts[i].y} x2={pts[j].x} y2={pts[j].y} stroke="#978B7B" strokeWidth={2} />);
  return <div className="s07-paare">
    <fieldset className="s07-schalter">
      <legend>Gruppen</legend>
      <div className="radios">{ALARM.map(a => <label key={a.groups}>
        <input type="radio" name="paare-gruppen" value={a.groups} checked={k === a.groups} onChange={() => setK(a.groups)} /> {String(a.groups)}
      </label>)}</div>
    </fieldset>
    <div className="grafik s07-kreis" aria-hidden="true">
      <svg viewBox="0 0 220 220" width="220" focusable="false">
        {lines}
        {pts.map((p, i) => <rect key={i} x={p.x - 14} y={p.y - 14} width={28} height={28} rx={8} fill={PALETTE[i]} stroke="#fff" strokeWidth={2} />)}
      </svg>
    </div>
    <p className="rueck text" aria-live="polite">{alarmText(k)}</p>
    <details className="werte">
      <summary>Werte als Tabelle</summary>
      <table className="daten">
        <caption>Paare und Fehlalarm-Risiko bei 5 % je Test</caption>
        <thead><tr><th scope="col">Gruppen</th><th scope="col">Paare</th><th scope="col">mindestens ein Fehlalarm</th></tr></thead>
        <tbody>{ALARM.map(a => <tr key={a.groups}><td>{a.groups}</td><td>{a.pairs}</td><td>{`${de(a.risk, 1)} %`}</td></tr>)}</tbody>
      </table>
    </details>
  </div>;
}

/* ---------- F-Labor ---------- */

export const labRow = (s: number, a: number) => F_LAB.find(r => r.s === s && r.a === a)!;
export const labFeedback = (row: FLabRow) => (row.a === 0 ? F_LAB_FEEDBACK.none : row.F >= 12 ? F_LAB_FEEDBACK.large : F_LAB_FEEDBACK.small);
export const labLine = (row: FLabRow) =>
  `Streuung zwischen (je Freiheitsgrad) ${num(row.msBetween)} ÷ Streuung innerhalb (je Freiheitsgrad) ${num(row.msWithin)} = F ${de(row.F, 2)}, ${pLine(row.p)}, η² ${de(row.eta2, 2)}`;

const GROUP_COLORS = ['#86B9DE', '#A79FE2', '#F0A27E'];

export function FLab() {
  const [si, setSi] = useState(1);
  const [ai, setAi] = useState(2);
  const [seen, setSeen] = useState<string[]>(['1|1']);
  const s = F_LAB_SPREADS[si].s, a = F_LAB_DISTANCES[ai], row = labRow(s, a);
  const choose = (nsi: number, nai: number) => {
    setSi(nsi); setAi(nai);
    const nr = labRow(F_LAB_SPREADS[nsi].s, F_LAB_DISTANCES[nai]);
    if (nr.F === 3) setSeen(old => (old.includes(`${nr.s}|${nr.a}`) ? old : [...old, `${nr.s}|${nr.a}`]));
  };
  const ratioSeen = seen.length >= 2;
  const W = 640, pl = 84, pr = 20, x = (v: number) => pl + (v + 1) / 12 * (W - pl - pr), rowH = 50, top = 16;
  const means = [F_LAB_GRAND - a, F_LAB_GRAND, F_LAB_GRAND + a];
  const base = top + 3 * rowH + 6;
  return <div className="s07-flabor">
    <div className="s07-zwei-schalter">
      <fieldset className="s07-schalter">
        <legend>Abstand der Gruppen</legend>
        <div className="radios">{F_LAB_DISTANCES.map((d, i) => <label key={d}>
          <input type="radio" name="flabor-abstand" value={d} checked={ai === i} onChange={() => choose(si, i)} /> {de(d, d % 1 ? 1 : 0)}
        </label>)}</div>
      </fieldset>
      <fieldset className="s07-schalter">
        <legend>Streuung in den Gruppen</legend>
        <div className="radios">{F_LAB_SPREADS.map((sp, i) => <label key={sp.label}>
          <input type="radio" name="flabor-streuung" value={sp.s} checked={si === i} onChange={() => choose(i, ai)} /> {sp.label}
        </label>)}</div>
      </fieldset>
    </div>
    <div className="grafik" aria-hidden="true">
      <svg viewBox={`0 0 ${W} ${base + 30}`} width="100%" focusable="false">
        <line x1={x(F_LAB_GRAND)} x2={x(F_LAB_GRAND)} y1={top - 6} y2={base} stroke="#8a939c" strokeWidth={1.5} strokeDasharray="5 4" />
        {means.map((m, g) => {
          const yc = top + g * rowH + rowH / 2 + 6, used: Record<string, number> = {};
          return <g key={g}>
            <T x={pl - 12} y={yc + 4} textAnchor="end" fontWeight={700} fill="#1E2D3C">{`Gruppe ${'ABC'[g]}`}</T>
            {F_LAB_OFFSETS.map((o, i) => {
              const v = m + o * s, key = String(v), level = used[key] ?? 0;
              used[key] = level + 1;
              return <circle key={i} cx={x(v)} cy={yc - level * 15} r={7} fill={GROUP_COLORS[g]} stroke="#fff" strokeWidth={1.5} />;
            })}
            <line x1={x(m)} x2={x(m)} y1={yc - 24} y2={yc + 12} stroke="#a0452f" strokeWidth={3} />
          </g>;
        })}
        <line x1={pl} x2={W - pr} y1={base} y2={base} stroke="#9aa4ad" strokeWidth={1.5} />
        {Array.from({ length: 13 }, (_, i) => i - 1).map(t => <T key={t} x={x(t)} y={base + 16} fontSize={11}>{String(t).replace('-', '−')}</T>)}
      </svg>
    </div>
    <p className="hilfe-zeile">Zum Beispiel: drei Gruppen mit je sechs Befragten. Roter Strich: Mittelwert der Gruppe, gestrichelt: Gesamtmittel 5.</p>
    <p className="s07-zeile">{labLine(row)}</p>
    <p className={`rueck${row.F >= 12 ? ' ok' : ''}`} aria-live="polite">{`${labFeedback(row)}${ratioSeen && row.F === 3 ? ` ${F_LAB_FEEDBACK.ratio}` : ''}`}</p>
    <details className="werte">
      <summary>Werte als Tabelle</summary>
      <table className="daten">
        <caption>F-Labor: alle Einstellungen (p mit 2 und 15 Freiheitsgraden)</caption>
        <thead><tr><th scope="col">Streuung s</th><th scope="col">Abstand a</th><th scope="col">QS zwischen</th><th scope="col">QS innerhalb</th><th scope="col">zwischen ÷ 2</th><th scope="col">innerhalb ÷ 15</th><th scope="col">F</th><th scope="col">p</th><th scope="col">η²</th></tr></thead>
        <tbody>{F_LAB.map(r => <tr key={`${r.s}|${r.a}`}>
          <td>{num(r.s)}</td><td>{num(r.a)}</td><td>{num(r.ssBetween)}</td><td>{num(r.ssWithin)}</td><td>{num(r.msBetween)}</td><td>{num(r.msWithin)}</td><td>{de(r.F, 2)}</td><td>{pText(r.p)}</td><td>{de(r.eta2, 2)}</td>
        </tr>)}</tbody>
      </table>
      <p className="box-notiz">{F_LAB_FEEDBACK.ratio}</p>
    </details>
  </div>;
}
