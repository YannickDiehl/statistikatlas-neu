// Erklärfassungen der drei Atlas-Bilder aus Sitzung 7, die ihre Ansicht über Optionsfelder (radio) wechseln:
// Stichproben-Maschine (1a), Paare zählen (3a) und F-Labor (3b). Sie zeigen nur, prüfen nichts; hier wählt man die Ansicht
// über beschriftete Knöpfe statt über Formularfelder. Zeichnung, Zahlen und Texte kommen unverändert aus src/chapter/s07.
import { useEffect, useRef, useState } from 'react';
import { ALARM, F_LAB_DISTANCES, F_LAB_FEEDBACK, F_LAB_GRAND, F_LAB_OFFSETS, F_LAB_SPREADS, MACHINE, SAMPLES, STACKS, type MachineVar } from '@atlas/chapter/s07/content';
import { MachineValues, StackSvg, binOf, firstStacks, machineText } from '@atlas/chapter/s07/figures/Machine';
import { alarmText, labFeedback, labLine, labRow } from '@atlas/chapter/s07/figures/Interactive';
import { T } from '@atlas/chapter/s07/figures/Figures';
import { de, pText } from '@atlas/chapter/s07/format';

/** Eine Gruppe von Umschaltknöpfen (aria-pressed), gestaltet wie die Schritt-Leiste der Atlas-Bilder. */
function Wahl<V extends string | number>({ titel, optionen, wert, setze }: { titel: string; optionen: [V, string][]; wert: V; setze: (v: V) => void }) {
  return <div className="s07-schalter" role="group" aria-label={titel}>
    <p className="v-wahl-titel" aria-hidden="true" style={{ margin: 0, fontWeight: 800 }}>{titel}</p>
    <ul className="schritt-nav" style={{ marginTop: 4 }}>
      {optionen.map(([v, label]) => {
        const an = v === wert;
        return <li key={String(v)}><button type="button" aria-pressed={an} onClick={() => setze(v)}
          style={an ? { borderColor: 'var(--k2)', background: 'var(--kh)' } : undefined}>{label}</button></li>;
      })}
    </ul>
  </div>;
}

/* ---------- 1a: Stichproben-Maschine ---------- */

const stichprobenZeile = (v: MachineVar, k: number) => {
  const s = SAMPLES[v][k - 1], d = MACHINE[v].decimals;
  return `Stichprobe ${k}: Männer ${de(s.men, d)}, Frauen ${de(s.women, d)}, Unterschied ${de(s.diff, d)} ${MACHINE[v].unit}.`;
};

/** Wie SamplingMachine: erst 20 Stichproben einzeln, dann 980 auf einmal; die Frage wählt man mit Knöpfen. */
export function StichprobenMaschine() {
  const [v, setV] = useState<MachineVar>('dw15');
  const [zahl, setZahl] = useState(0);
  const ziehenRef = useRef<HTMLButtonElement>(null);
  const vornRef = useRef<HTMLButtonElement>(null);
  const fokus = useRef<'vorn' | 'ziehen' | null>(null);
  useEffect(() => {
    if (fokus.current === 'vorn' && zahl === 1000) vornRef.current?.focus();
    else if (fokus.current === 'ziehen' && zahl === 0) ziehenRef.current?.focus();
    fokus.current = null;
  }, [zahl]);

  const spalten = zahl === 1000
    ? STACKS[v].map(c => ({ count: c }))
    : firstStacks(v, zahl).map((c, k) => ({ count: c, last: zahl > 0 && binOf(v, SAMPLES[v][zahl - 1].diff) === k }));
  const ziehen = () => { if (zahl < 20) setZahl(zahl + 1); else { fokus.current = 'vorn'; setZahl(1000); } };
  const zeile = zahl === 0 ? 'Noch keine Stichprobe gezogen.' : zahl <= 20 ? stichprobenZeile(v, zahl) : 'Alle 1.000 Stichproben gezogen. 1 Kästchen = 10 Stichproben.';
  const rueck = zahl === 0 ? '' : zahl <= 20 ? MACHINE[v].early : MACHINE[v].all;

  return <div className="s07-maschine">
    <Wahl titel="Welche Frage?" optionen={[['dw15', MACHINE.dw15.name], ['ls01', MACHINE.ls01.name]]} wert={v} setze={n => { setV(n); setZahl(0); }} />
    <div className="reihe-knoepfe">
      {zahl < 1000 ? <button type="button" className="knopf" ref={ziehenRef} onClick={ziehen}>{zahl < 20 ? 'Neue Stichprobe ziehen' : '980 weitere auf einmal'}</button> : null}
      <button type="button" className="knopf hell" ref={vornRef} onClick={() => { if (zahl === 0) ziehenRef.current?.focus(); else fokus.current = 'ziehen'; setZahl(0); }}>Von vorn</button>
    </div>
    <p className="s07-zeile" aria-live="polite">{zeile}</p>
    <div className="grafik" role="img" aria-label={machineText(v, zahl)}>
      <StackSvg v={v} cols={spalten} perStone={zahl === 1000 ? 10 : 1} truth={zahl === 1000} countsOver={zahl === 1000 ? 'all' : undefined} />
    </div>
    <p className="rueck text" aria-live="polite">{rueck}</p>
    <MachineValues />
  </div>;
}

/* ---------- 3a: Paare zählen ---------- */

const FARBEN = ['#86B9DE', '#8FCBA6', '#A79FE2', '#F0A27E', '#E39AB6', '#86CBC3'];

/** Wie PairsCounter: 2 bis 6 Gruppen, jedes Paar eine Linie, darunter das Fehlalarm-Risiko. */
export function PaareZaehlen() {
  const [k, setK] = useState(3);
  const c = 110, R = 80, punkte = Array.from({ length: k }, (_, i) => {
    const a = -Math.PI / 2 + i * 2 * Math.PI / k;
    return { x: c + R * Math.cos(a), y: c + R * Math.sin(a) };
  });
  const linien = [];
  for (let i = 0; i < k; i++) for (let j = i + 1; j < k; j++) linien.push(<line key={`${i}-${j}`} x1={punkte[i].x} y1={punkte[i].y} x2={punkte[j].x} y2={punkte[j].y} stroke="#978B7B" strokeWidth={2} />);
  return <div className="s07-paare">
    <Wahl titel="Wie viele Gruppen?" optionen={ALARM.map(a => [a.groups, String(a.groups)] as [number, string])} wert={k} setze={setK} />
    <div className="grafik s07-kreis" aria-hidden="true">
      <svg viewBox="0 0 220 220" width="220" focusable="false">
        {linien}
        {punkte.map((p, i) => <rect key={i} x={p.x - 14} y={p.y - 14} width={28} height={28} rx={8} fill={FARBEN[i]} stroke="#fff" strokeWidth={2} />)}
      </svg>
    </div>
    <p className="rueck text" aria-live="polite">{`${k} Gruppen: ${alarmText(k)}`}</p>
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

/* ---------- 3b: F-Labor ---------- */

const GRUPPENFARBEN = ['#86B9DE', '#A79FE2', '#F0A27E'];
const num = (x: number) => x.toLocaleString('de-DE', { maximumFractionDigits: 2 });

/** Wie FLab: Abstand und Streuung wählen, F, p und η² ablesen. */
export function FLabor() {
  const [si, setSi] = useState(1);
  const [ai, setAi] = useState(2);
  const s = F_LAB_SPREADS[si].s, a = F_LAB_DISTANCES[ai], row = labRow(s, a);
  const waehle = (nsi: number, nai: number) => {
    setSi(nsi); setAi(nai);
  };
  const W = 640, pl = 84, pr = 20, x = (v: number) => pl + (v + 1) / 12 * (W - pl - pr), rowH = 50, top = 16;
  const mittel = [F_LAB_GRAND - a, F_LAB_GRAND, F_LAB_GRAND + a];
  const basis = top + 3 * rowH + 6;
  return <div className="s07-flabor">
    <div className="s07-zwei-schalter">
      <Wahl titel="Abstand der Gruppen" optionen={F_LAB_DISTANCES.map((d, i) => [i, de(d, d % 1 ? 1 : 0)] as [number, string])} wert={ai} setze={i => waehle(si, i)} />
      <Wahl titel="Streuung in den Gruppen" optionen={F_LAB_SPREADS.map((sp, i) => [i, sp.label] as [number, string])} wert={si} setze={i => waehle(i, ai)} />
    </div>
    <div className="grafik" aria-hidden="true">
      <svg viewBox={`0 0 ${W} ${basis + 30}`} width="100%" focusable="false">
        <line x1={x(F_LAB_GRAND)} x2={x(F_LAB_GRAND)} y1={top - 6} y2={basis} stroke="#8a939c" strokeWidth={1.5} strokeDasharray="5 4" />
        {mittel.map((m, g) => {
          const yc = top + g * rowH + rowH / 2 + 6, belegt: Record<string, number> = {};
          return <g key={g}>
            <T x={pl - 12} y={yc + 4} textAnchor="end" fontWeight={700} fill="#1E2D3C">{`Gruppe ${'ABC'[g]}`}</T>
            {F_LAB_OFFSETS.map((o, i) => {
              const v = m + o * s, key = String(v), stufe = belegt[key] ?? 0;
              belegt[key] = stufe + 1;
              return <circle key={i} cx={x(v)} cy={yc - stufe * 15} r={7} fill={GRUPPENFARBEN[g]} stroke="#fff" strokeWidth={1.5} />;
            })}
            <line x1={x(m)} x2={x(m)} y1={yc - 24} y2={yc + 12} stroke="#a0452f" strokeWidth={3} />
          </g>;
        })}
        <line x1={pl} x2={W - pr} y1={basis} y2={basis} stroke="#9aa4ad" strokeWidth={1.5} />
        {Array.from({ length: 13 }, (_, i) => i - 1).map(t => <T key={t} x={x(t)} y={basis + 16} fontSize={11}>{String(t).replace('-', '−')}</T>)}
      </svg>
    </div>
    <p className="hilfe-zeile">Zum Beispiel: drei Gruppen mit je sechs Befragten. Roter Strich: Mittelwert der Gruppe, gestrichelt: Gesamtmittel 5.</p>
    <p className="s07-zeile" aria-live="polite">{labLine(row)}</p>
    <p className={`rueck${row.F >= 12 ? ' ok' : ''}`} aria-live="polite">{`${labFeedback(row)}${row.F === 3 ? ` ${F_LAB_FEEDBACK.ratio}` : ''}`}</p>
    <details className="werte">
      <summary>Werte als Tabelle</summary>
      <table className="daten">
        <caption>F-Labor: alle Einstellungen (p mit 2 und 15 Freiheitsgraden)</caption>
        <thead><tr><th scope="col">Streuung s</th><th scope="col">Abstand a</th><th scope="col">QS zwischen</th><th scope="col">QS innerhalb</th><th scope="col">zwischen ÷ 2</th><th scope="col">innerhalb ÷ 15</th><th scope="col">F</th><th scope="col">p</th><th scope="col">η²</th></tr></thead>
        <tbody>{F_LAB_SPREADS.flatMap(sp => F_LAB_DISTANCES.map(d => labRow(sp.s, d))).map(r => <tr key={`${r.s}|${r.a}`}>
          <td>{num(r.s)}</td><td>{num(r.a)}</td><td>{num(r.ssBetween)}</td><td>{num(r.ssWithin)}</td><td>{num(r.msBetween)}</td><td>{num(r.msWithin)}</td><td>{de(r.F, 2)}</td><td>{pText(r.p)}</td><td>{de(r.eta2, 2)}</td>
        </tr>)}</tbody>
      </table>
      <p className="box-notiz">{F_LAB_FEEDBACK.ratio}</p>
    </details>
  </div>;
}
