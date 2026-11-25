// Sitzung 10, Grundlage 3: B8 Beta als Lineal, B10 Würfel und korrigiertes R², B12 VIF als überlappende Kreise.
import { useState } from 'react';
import { COLLINEAR, DICE, MODEL_AG } from '../content';
import { ArrowDef, C, Picture, Switches, T, TextVersion, de } from './common';

/* ---------- B8 ---------- */

type Unit = 'einheit' | 'sd';
const AGE_SD = MODEL_AG.age.bExact * MODEL_AG.desc.age.sd;
const HEALTH_SD = MODEL_AG.gesund.b * MODEL_AG.desc.gesund.sd;

export function betaText(u: Unit): string {
  return u === 'einheit'
    ? 'Pro Einheit: Ein Jahr mehr Alter bringt 0,024 Punkte Lebenszufriedenheit, eine Gesundheitsstufe 0,861.'
    : `Pro Standardabweichung: 18,2 Jahre mehr Alter bringen ${de(AGE_SD, 2)} Punkte, 1,01 Gesundheitsstufen bringen ${de(HEALTH_SD, 2)} Punkte. Die Gesundheit wiegt etwa doppelt so viel. Geteilt durch die Standardabweichung der Lebenszufriedenheit, 1,919, ergibt das Beta: 0,225 für das Alter, 0,454 für die Gesundheit.`;
}

/** Bild B8 `s10-beta-lineal`: two rulers and bars, per unit or per standard deviation. */
export function BetaRuler() {
  const [u, setU] = useState<Unit>('einheit');
  const w = 700, l = 130, iw = 520;
  const bx = (v: number) => l + v * iw;
  const rows = [
    { name: 'Alter', y: 40, step: u === 'einheit' ? { w: 1 / 81, label: '1 Jahr' } : { w: 18.212 / 81, label: '18,2 Jahre (1 SD)' }, bar: u === 'einheit' ? MODEL_AG.age.b : AGE_SD, scale: 'Alter 18 bis 99' },
    { name: 'Gesundheit', y: 160, step: u === 'einheit' ? { w: 1 / 4, label: '1 Stufe' } : { w: 1.012 / 4, label: '1,01 Stufen (1 SD)' }, bar: u === 'einheit' ? MODEL_AG.gesund.b : HEALTH_SD, scale: 'Gesundheit 1 bis 5' },
  ];
  return <>
    <Switches label="Einheit des Vergleichs" value={u} onChange={setU}
      options={[{ value: 'einheit', label: 'pro Einheit' }, { value: 'sd', label: 'pro Standardabweichung' }]} />
    <Picture label="Zwei Lineale für Alter und Gesundheit, je ein Schritt darauf und ein Balken für die vorhergesagte Veränderung der Lebenszufriedenheit. Die Werte stehen im Text unter dem Bild.">
      <svg viewBox={`0 0 ${w} 290`} width="100%" aria-hidden="true" focusable="false">
        {rows.map(r => <g key={r.name}>
          <T x={l - 12} y={r.y + 14} textAnchor="end" fill={C.ink} fontWeight={800}>{r.name}</T>
          <rect x={l} y={r.y} width={iw} height={20} rx={4} fill="#EDEBE6" stroke={C.gray} />
          {Array.from({ length: 9 }, (_, k) => <line key={k} x1={l + k * iw / 8} x2={l + k * iw / 8} y1={r.y} y2={r.y + 8} stroke={C.gray} />)}
          <rect x={l} y={r.y + 2} width={Math.max(3, r.step.w * iw)} height={16} rx={3} fill={C.blue} stroke={C.blueD} />
          <T x={l + Math.max(3, r.step.w * iw) + 8} y={r.y + 15} textAnchor="start" fill={C.blueD} fontWeight={800} fontSize={13.5}>{r.step.label}</T>
          <T x={l + iw} y={r.y - 6} textAnchor="end" fontSize={13}>{r.scale}</T>
          <rect x={l} y={r.y + 32} width={bx(r.bar) - l} height={22} rx={4} fill={C.orange} stroke={C.orangeD} />
          <T x={bx(r.bar) + 8} y={r.y + 48} textAnchor="start" fill={C.ink} fontWeight={800}>{de(r.bar, u === 'einheit' ? 3 : 2)}</T>
        </g>)}
        {[0, 0.25, 0.5, 0.75, 1].map(v => <g key={v}><line x1={bx(v)} x2={bx(v)} y1={250} y2={256} stroke={C.ink} /><T x={bx(v)} y={270} fontSize={13.5}>{de(v, v % 0.5 ? 2 : v % 1 ? 1 : 0)}</T></g>)}
        <line x1={l} x2={l + iw} y1={250} y2={250} stroke={C.ink} />
        <T x={l + iw / 2} y={286} fontSize={13}>vorhergesagte Veränderung der Lebenszufriedenheit (Punkte)</T>
        <T x={w - 10} y={124} textAnchor="end" fill={C.orangeD} fontWeight={800}>{u === 'einheit' ? 'B: pro Jahr gegen pro Stufe' : 'Gesundheit etwa doppelt so viel'}</T>
      </svg>
    </Picture>
    {u === 'sd' ? <p className="hilfe-zeile">Geteilt durch die SD der Lebenszufriedenheit (1,919) ergibt das Beta: Alter 0,225, Gesundheit 0,454.</p> : null}
    <TextVersion live>{betaText(u)}</TextVersion>
  </>;
}

/* ---------- B10 ---------- */

export function diceText(k: number): string {
  const d = DICE[k];
  const wie = ['keinem', 'einem', 'zwei', 'drei', 'vier'][k];
  return `Mit Gesundheit und ${wie} ${k < 2 ? 'Würfel' : 'Würfeln'}: R² ${de(d.r2, 2)}, korrigiertes R² ${de(d.adj, 2)}.`;
}

/** Bild B10 `s10-wuerfel`: add up to four dice as predictors; R² rises, the adjusted R² falls. */
export function Dice() {
  const [k, setK] = useState(0);
  const d = DICE[k];
  const l = 140, iw = 480, bx = (v: number) => l + v / 0.4 * iw;
  return <>
    <div className="s10-wuerfel-leiste">
      <div className="s10-bausteine klein" aria-label={`Formel des Modells: zufriedenheit ~ gesundheit${Array.from({ length: k }, (_, i) => ` + würfel${i + 1}`).join('')}`} role="img">
        <span className="bs code"><b>zufriedenheit ~ gesundheit</b></span>
        {Array.from({ length: k }, (_, i) => <span key={i} className="bs new"><b>{`+ ⚄ würfel${i + 1}`}</b></span>)}
      </div>
      <div className="reihe-knoepfe">
        <button type="button" className="knopf hell" aria-disabled={k === 4 || undefined} onClick={() => setK(v => Math.min(4, v + 1))}>+ Würfel</button>
        <button type="button" className="knopf hell" aria-disabled={k === 0 || undefined} onClick={() => setK(v => Math.max(0, v - 1))}>− Würfel</button>
      </div>
    </div>
    <Picture label="Zwei Balken: R² und korrigiertes R² auf einer Skala von 0 bis 0,4. Die Werte stehen im Text unter dem Bild.">
      <svg viewBox="0 0 700 150" width="100%" aria-hidden="true" focusable="false">
        {[['R²', d.r2, C.blue, C.blueD, 20], ['korrigiertes R²', d.adj, C.orange, C.orangeD, 66]].map(([name, v, f, s, y]) => <g key={name as string}>
          <T x={l - 10} y={(y as number) + 19} textAnchor="end" fill={C.ink} fontWeight={800}>{name as string}</T>
          <rect x={l} y={y as number} width={bx(v as number) - l} height={28} rx={4} fill={f as string} stroke={s as string} />
          <T x={bx(v as number) + 8} y={(y as number) + 19} textAnchor="start" fill={C.ink} fontWeight={800}>{de(v as number, 2)}</T>
        </g>)}
        <line x1={l} x2={l + iw} y1={110} y2={110} stroke={C.ink} />
        {[0, 0.1, 0.2, 0.3, 0.4].map(v => <g key={v}><line x1={bx(v)} x2={bx(v)} y1={110} y2={116} stroke={C.ink} /><T x={bx(v)} y={132} fontSize={13.5}>{de(v, 1)}</T></g>)}
      </svg>
    </Picture>
    <p className="hilfe-zeile">Die Würfel sagen nichts über Zufriedenheit. R² steigt trotzdem, das korrigierte R² sinkt.</p>
    <TextVersion live>{diceText(k)}</TextVersion>
    <details className="werte">
      <summary>Alle fünf Modelle als Tabelle</summary>
      <table className="daten">
        <caption>30 Befragte, zum Beispiel: Gesundheit und Würfel</caption>
        <thead><tr><th scope="col">Würfel im Modell</th><th scope="col">R²</th><th scope="col">korrigiertes R²</th></tr></thead>
        <tbody>{DICE.map((x, i) => <tr key={i}><th scope="row">{i}</th><td>{de(x.r2, 2)}</td><td>{de(x.adj, 2)}</td></tr>)}</tbody>
      </table>
    </details>
  </>;
}

/* ---------- B12 ---------- */

type Pair = 'gesundheit' | 'gruppe';

export function vifText(p: Pair): string {
  return p === 'gesundheit'
    ? 'Alter und Gesundheit überlappen wenig. B Alter 0,024 mit Standardfehler 0,001, VIF 1,12. B Gesundheit 0,861, VIF 1,12.'
    : 'Alter und Altersgruppe überlappen fast ganz. B Alter fällt auf 0,016 mit sechsmal so großem Standardfehler, 0,006; die Altersgruppe bekommt 0,121 und ist nicht signifikant. Der VIF ist bei beiden fast 19, über der Grenze von 10.';
}

/** Bild B12 `s10-vif-kreise`: two predictors as overlapping circles, the table as in R and a VIF scale. */
export function VifCircles() {
  const [p, setP] = useState<Pair>('gesundheit');
  const second = p === 'gesundheit' ? { name: 'Gesundheit', fill: C.green, stroke: C.greenD, dx: 150 } : { name: 'Altersgruppe', fill: C.blueL, stroke: C.blueD, dx: 22 };
  const top = 30, bottom = 250, vy = (v: number) => bottom - (v - 1) / 19 * (bottom - top);
  const maxVif = p === 'gesundheit' ? MODEL_AG.age.vif : COLLINEAR.age.vif;
  return <>
    <Switches label="Paar von Prädiktoren" value={p} onChange={setP}
      options={[{ value: 'gesundheit', label: 'Alter und Gesundheit' }, { value: 'gruppe', label: 'Alter und Altersgruppe' }]} />
    <div className="s10-zweispaltig">
      <Picture label="Zwei Kreise für zwei Prädiktoren; ihre Überlappung steht für das, was beide gemeinsam haben. Rechts eine VIF-Skala von 1 bis 20 mit der Grenze 10. Die Werte stehen im Text unter dem Bild.">
        <svg viewBox="0 0 620 280" width="100%" aria-hidden="true" focusable="false">
          <ArrowDef id="s10-pfeil-b12" color={C.ink} />
          <circle cx={150} cy={140} r={90} fill={C.blue} fillOpacity={0.6} stroke={C.blueD} strokeWidth={2} />
          <circle cx={150 + second.dx} cy={140} r={90} fill={second.fill} fillOpacity={0.6} stroke={second.stroke} strokeWidth={2} />
          <T x={p === 'gesundheit' ? 110 : 150} y={p === 'gesundheit' ? 145 : 120} fill={C.ink} fontWeight={800}>Alter</T>
          <T x={p === 'gesundheit' ? 340 : 172} y={p === 'gesundheit' ? 145 : 165} fill={C.ink} fontWeight={800}>{second.name}</T>
          <line x1={440} x2={440} y1={top} y2={bottom} stroke={C.ink} strokeWidth={1.5} />
          {[1, 5, 10, 15, 20].map(v => <g key={v}><line x1={436} x2={444} y1={vy(v)} y2={vy(v)} stroke={C.ink} /><T x={452} y={vy(v) + 4} textAnchor="start" fontSize={13.5}>{String(v)}</T></g>)}
          <line x1={420} x2={500} y1={vy(10)} y2={vy(10)} stroke={C.redD} strokeWidth={2} strokeDasharray="5 4" />
          <T x={470} y={vy(10) + 20} textAnchor="start" fill={C.redD} fontSize={13} fontWeight={700}><tspan x={470}>10: mariposa meldet</tspan><tspan x={470} dy={16}>ein Problem</tspan></T>
          <line x1={400} x2={432} y1={vy(maxVif)} y2={vy(maxVif)} stroke={C.ink} strokeWidth={2} markerEnd="url(#s10-pfeil-b12)" />
          <T x={396} y={vy(maxVif) + 4} textAnchor="end" fill={C.ink} fontWeight={800} fontSize={13.5}>{`VIF ${de(maxVif, p === 'gesundheit' ? 2 : 1)}`}</T>
          <T x={440} y={top - 12} fontSize={13.5}>VIF</T>
        </svg>
      </Picture>
      <table className="daten s10-koeff">
        <caption>{p === 'gesundheit' ? 'ls01 ~ age + gesund' : 'ls01 ~ age + agec + gesund'}</caption>
        <thead><tr><th scope="col">Term</th><th scope="col">B</th><th scope="col">Std. Error</th><th scope="col">Sig.</th><th scope="col">VIF</th></tr></thead>
        <tbody>{p === 'gesundheit' ? <>
          <tr><th scope="row">age</th><td>{MODEL_AG.age.b.toFixed(3)}</td><td>{MODEL_AG.age.se.toFixed(3)}</td><td>{MODEL_AG.age.p}</td><td>{MODEL_AG.age.vif.toFixed(3)}</td></tr>
          <tr><th scope="row">gesund</th><td>{MODEL_AG.gesund.b.toFixed(3)}</td><td>{MODEL_AG.gesund.se.toFixed(3)}</td><td>{MODEL_AG.gesund.p}</td><td>{MODEL_AG.gesund.vif.toFixed(3)}</td></tr>
        </> : <>
          <tr><th scope="row">age</th><td>{COLLINEAR.age.b.toFixed(3)}</td><td>{COLLINEAR.age.se.toFixed(3)}</td><td>{COLLINEAR.age.p}</td><td>{COLLINEAR.age.vif.toFixed(3)}</td></tr>
          <tr><th scope="row">agec</th><td>{COLLINEAR.agec.b.toFixed(3)}</td><td>{COLLINEAR.agec.se.toFixed(3)}</td><td>{COLLINEAR.agec.p}</td><td>{COLLINEAR.agec.vif.toFixed(3)}</td></tr>
          <tr className="grau"><th scope="row">gesund</th><td>{COLLINEAR.gesund.b.toFixed(3)}</td><td>{COLLINEAR.gesund.se.toFixed(3)}</td><td>{COLLINEAR.gesund.p}</td><td>{COLLINEAR.gesund.vif.toFixed(3)}</td></tr>
        </>}</tbody>
      </table>
    </div>
    <TextVersion live>{vifText(p)}</TextVersion>
  </>;
}
