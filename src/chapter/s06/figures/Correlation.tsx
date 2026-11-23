// Thema 4 „Zahlen mit Abständen“: Punkte-Labor (s6-punktlabor), r in Bausteinen (s6-r-bausteine),
// Ausreißer-Lineal (s6-ausreisser-lineal) und die Drittvariable (s6-drittvariable).
import { useState } from 'react';
import { CAT, CAT_DARK, ROLE } from '../../../tasks/kit/palette';
import { pearson, spearman } from '../../../tasks/kit/stats';
import { AGE_XT10, ALT, INTERNET, LAB_PEOPLE, LAB_STEPS, LAB_Z } from '../content';
import { Picture, Ruler, SvgText, Toggle, de, whole } from './util';

/** Alter und Minuten der acht Personen, wenn Person B `minutes` braucht. */
export function labData(minutes: number) {
  const ages = LAB_PEOPLE.map(p => p.age), mins = LAB_PEOPLE.map(p => (p.name === 'B' ? minutes : p.minutes));
  const mx = ages.reduce((a, b) => a + b, 0) / ages.length, my = mins.reduce((a, b) => a + b, 0) / mins.length;
  return { ages, mins, mx, my, r: pearson(ages, mins), rho: spearman(ages, mins) };
}

/** Live-Text des Labors für Stufe k. */
export function labText(k: number): string {
  const s = LAB_STEPS[k], d = labData(s.minutes);
  return `Person B: ${whole(s.minutes)} Minuten. r = ${de(d.r, 3)}, ρ = ${de(d.rho, 3)}.${s.text ? ` ${s.text}` : ''}`;
}

/** Lage einer Person im Kreuz der Mittelwerte: Plus-Feld (beide auf derselben Seite) oder Minus-Feld. */
const field = (dx: number, dy: number) => (dx * dy > 0 ? 'Plus-Feld' : dx * dy < 0 ? 'Minus-Feld' : 'auf einer Linie');

/** 4a: Punktwolke mit dem Kreuz der Mittelwerte; ein Stufenschalter verschiebt Person B. */
export function PointLab() {
  const [k, setK] = useState(0);
  const s = LAB_STEPS[k], d = labData(s.minutes), stretched = s.minutes >= 200;
  const w = 520, h = 300, l = 52, r = 16, t = 16, b = 40;
  const yMin = stretched ? 0 : 40, yMax = stretched ? Math.ceil(s.minutes * 1.1 / 100) * 100 : 110;
  const x = (v: number) => l + (v - 20) / 55 * (w - l - r), y = (v: number) => t + (yMax - v) / (yMax - yMin) * (h - t - b);
  const yTicks = stretched ? [0, yMax / 2, yMax] : [40, 60, 80, 100];
  const cx = x(d.mx), cy = y(d.my);
  return <div className="s6-labor">
    <Toggle label="Minuten von Person B" value={k} onChange={setK}
      options={LAB_STEPS.map((st, i) => ({ value: i, label: `${whole(st.minutes)} Min.` }))} />
    <div className="grafik">
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" aria-hidden="true" focusable="false">
        <rect x={cx} y={t} width={x(75) - cx} height={cy - t} fill="#EDF8F1" />
        <rect x={l} y={cy} width={cx - l} height={h - b - cy} fill="#EDF8F1" />
        <rect x={l} y={t} width={cx - l} height={cy - t} fill="#fdeeea" />
        <rect x={cx} y={cy} width={x(75) - cx} height={h - b - cy} fill="#fdeeea" />
        {[[x(75) - 18, t + 22, '+'], [l + 18, h - b - 10, '+'], [l + 18, t + 22, '−'], [x(75) - 18, h - b - 10, '−']].map(([px, py, sign], i) =>
          <SvgText key={i} x={px as number} y={py as number} fontSize={22} fontWeight={800} fill={sign === '+' ? '#2f7a4f' : '#a0452f'}>{sign as string}</SvgText>)}
        <line x1={cx} x2={cx} y1={t} y2={h - b} stroke="#5F6A74" strokeDasharray="5 4" strokeWidth={1.5} />
        <line x1={l} x2={x(75)} y1={cy} y2={cy} stroke="#5F6A74" strokeDasharray="5 4" strokeWidth={1.5} />
        <line x1={l} x2={x(75)} y1={h - b} y2={h - b} stroke="#1E2D3C" strokeWidth={1.5} />
        <line x1={l} x2={l} y1={t} y2={h - b} stroke="#1E2D3C" strokeWidth={1.5} />
        {[20, 30, 40, 50, 60, 70].map(v => <SvgText key={v} x={x(v)} y={h - b + 17} fontSize={13}>{String(v)}</SvgText>)}
        {yTicks.map(v => <SvgText key={v} x={l - 8} y={y(v) + 4} textAnchor="end" fontSize={13}>{whole(v)}</SvgText>)}
        <SvgText x={(l + x(75)) / 2} y={h - 4} fontSize={13} fontWeight={700}>Alter in Jahren</SvgText>
        <SvgText x={14} y={(t + h - b) / 2} fontSize={12} fontWeight={700} transform={`rotate(-90 14 ${(t + h - b) / 2})`}>Minuten</SvgText>
        {LAB_PEOPLE.map((p, i) => <g key={p.name}>
          <rect x={x(d.ages[i]) - 11} y={y(d.mins[i]) - 11} width={22} height={22} rx={5} fill={p.name === 'B' ? ROLE.dataLight : '#FFE7A3'} stroke={p.name === 'B' ? ROLE.data : '#EFC867'} strokeWidth={2} />
          <SvgText x={x(d.ages[i])} y={y(d.mins[i]) + 4.5} fontSize={12.5} fontWeight={800} fill="#1E2D3C">{p.name}</SvgText>
        </g>)}
      </svg>
    </div>
    {stretched ? <p className="hilfe-zeile s6-gestreckt">Achse gestreckt</p> : null}
    <p className="rueck text" aria-live="polite">{labText(k)}</p>
    <details className="werte">
      <summary>Textfassung: Personen und Zustände</summary>
      <ul>{LAB_PEOPLE.map((p, i) => <li key={p.name}>{`${p.name}: ${d.ages[i]} Jahre, ${whole(d.mins[i])} Minuten, ${field(d.ages[i] - d.mx, d.mins[i] - d.my)}`}</li>)}</ul>
      <p>{`Kreuz der Mittelwerte: ${de(d.mx, 1)} Jahre und ${de(d.my, 1)} Minuten.`}</p>
      <table className="daten">
        <caption>r und ρ je Stufe der Minuten von Person B</caption>
        <thead><tr><th scope="col">Minuten von B</th><th scope="col">r</th><th scope="col">ρ</th></tr></thead>
        <tbody>{LAB_STEPS.map(st => <tr key={st.minutes}><td>{whole(st.minutes)}</td><td>{de(st.r, 3)}</td><td>{de(st.rho, 3)}</td></tr>)}</tbody>
      </table>
    </details>
  </div>;
}

/** Bausteine von r im Ausgangszustand: z-Werte, Produkte, Summe durch n − 1. */
export function RBricks() {
  const list = (xs: number[]) => xs.map(v => de(v, 2)).join(', ');
  return <figure className="ebild s6-bild">
    <ol className="s6-bausteine" role="list">
      <li><span className="s6-nr" aria-hidden="true">1</span><div><b>Abstand vom Mittelwert, gemessen in Standardabweichungen</b> (Fachbegriff: z-Wert; Standardabweichung kennst du aus Sitzung 3). Alter A bis H: {list(LAB_Z.age)}. Minuten A bis H: {list(LAB_Z.minutes)}.</div></li>
      <li><span className="s6-nr" aria-hidden="true">2</span><div><b>Je Person malnehmen:</b> {list(LAB_Z.products)}. <span className="s6-merke">Beide auf derselben Seite des Mittelwerts: Plus. Auf verschiedenen Seiten: Minus.</span></div></li>
      <li><span className="s6-nr" aria-hidden="true">3</span><div><b>Zusammenzählen und durch n − 1 teilen:</b> {de(LAB_Z.sum, 2)} / 7 = 0,97.</div></li>
      <li><span className="s6-nr" aria-hidden="true">=</span><div><b>Ergebnis:</b> r = 0,97 (genau 0,974).{' '}
        <span className="sr-only">Formel: r gleich Summe der Produkte der z-Werte, geteilt durch n minus 1.</span></div></li>
    </ol>
  </figure>;
}

/** 4b: Lineal mit r und ρ für Alter und Bearbeitungsdauer, mit und ohne Ausreißer. */
export function OutlierRuler() {
  return <Picture text={ALT.ausreisser} caption="Alter und Bearbeitungsdauer, ALLBUS 2023 (r gewichtet). Kreise: r, Rauten: ρ.">
    <Ruler from={-1} to={1} ticks={[-1, -0.5, 0, 0.5, 1]} height={190} marks={[
      { value: AGE_XT10.rAll, label: `r, alle Bögen: ${de(AGE_XT10.rAll, 3)}`, color: CAT_DARK[0], row: 0 },
      { value: AGE_XT10.rhoAll, label: `ρ, alle Bögen: ${de(AGE_XT10.rhoAll, 2)}`, color: CAT_DARK[1], shape: 'diamond', row: 1 },
      { value: AGE_XT10.r180, label: `r, bis 180 Minuten: ${de(AGE_XT10.r180, 2)}`, color: CAT_DARK[0], row: 2 },
      { value: AGE_XT10.rho180, label: `ρ, bis 180 Minuten: ${de(AGE_XT10.rho180, 2)}`, color: CAT_DARK[1], shape: 'diamond', row: 3 },
    ]} />
  </Picture>;
}

type Group = 'all' | 'mid' | 'old';
const GROUPS: { value: Group; label: string }[] = [{ value: 'all', label: 'alle' }, { value: 'mid', label: '60 bis 74 Jahre' }, { value: 'old', label: '75 und älter' }];

/** Live-Satz der Drittvariable je Gruppe. */
export function thirdText(g: Group): string {
  if (g === 'all') return `Alle: ${de(INTERNET.all.yes, 1)} % gegen ${de(INTERNET.all.no, 1)} %, Abstand 35 Prozentpunkte, Phi ${de(INTERNET.all.phi, 2)}. Ein deutlicher Unterschied. Aber die Nicht-Nutzer sind im Schnitt viel älter.`;
  const s = INTERNET[g];
  const gap = de(s.yes - s.no, 1);
  const tail = g === 'old' ? ' Innerhalb gleich alter Menschen schrumpft der Unterschied auf etwa die Hälfte. Ein Teil des Zusammenhangs kommt vom Alter.' : '';
  return `${s.label}: ${de(s.yes, 1)} % gegen ${de(s.no, 1)} % (${whole(s.nYes)} und ${whole(s.nNo)} Befragte, gewichtet), Abstand ${gap} Punkte, Phi ${de(s.phi, 2)}.${tail}`;
}

/** 4c: Pfeilbild Alter → Internet, Alter → Gesundheit; Balken „gute oder sehr gute Gesundheit“ je Gruppe mit Umschalter. */
export function ThirdVariable() {
  const [g, setG] = useState<Group>('all');
  const v = g === 'all' ? INTERNET.all : INTERNET[g];
  const w = 520, h = 170, l = 150, r = 50, x = (p: number) => l + p / 100 * (w - l - r);
  const bars = [{ label: 'nutzt Internet', value: v.yes, color: CAT[0] }, { label: 'nutzt kein Internet', value: v.no, color: CAT[1] }];
  return <div className="s6-dritt">
    <div className="grafik" aria-hidden="true">
      <svg viewBox="0 0 620 170" width="100%" focusable="false" style={{ maxWidth: 640 }}>
        <defs><marker id="s6-pfeil" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 Z" fill="#978B7B" /></marker></defs>
        {[[20, 62, 'Alter', '#FFF0E8', '#F0A27E'], [400, 12, 'Internet nutzen', '#EAF5FC', '#86B9DE'], [400, 112, 'Gesundheit', '#EDF8F1', '#8FCBA6']].map(([bx, by, text, fill, stroke]) =>
          <g key={text as string}>
            <rect x={bx as number} y={by as number} width={180} height={44} rx={12} fill={fill as string} stroke={stroke as string} strokeWidth={2} />
            <SvgText x={(bx as number) + 90} y={(by as number) + 27} fontSize={14} fontWeight={800} fill="#1E2D3C">{text as string}</SvgText>
          </g>)}
        <path d="M200,76 C300,76 300,34 398,34" fill="none" stroke="#978B7B" strokeWidth={2} markerEnd="url(#s6-pfeil)" />
        <path d="M200,92 C300,92 300,134 398,134" fill="none" stroke="#978B7B" strokeWidth={2} markerEnd="url(#s6-pfeil)" />
        <SvgText x={290} y={44} fontSize={13} fontWeight={700}>Ältere nutzen es seltener</SvgText>
        <SvgText x={290} y={138} fontSize={13} fontWeight={700}>Ältere sind seltener gesund</SvgText>
        <line x1={490} x2={490} y1={58} y2={110} stroke="#5F6A74" strokeWidth={2} strokeDasharray="5 4" />
        <SvgText x={506} y={90} fontSize={18} fontWeight={800} fill="#1E2D3C">?</SvgText>
      </svg>
    </div>
    <Toggle label="Altersgruppe" options={GROUPS} value={g} onChange={setG} />
    <div className="grafik" aria-hidden="true">
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" focusable="false" style={{ maxWidth: 600 }}>
        <SvgText x={l} y={16} textAnchor="start" fontSize={13} fontWeight={700}>gute oder sehr gute Gesundheit (%, gewichtet)</SvgText>
        {bars.map((bar, i) => <g key={bar.label}>
          <SvgText x={l - 8} y={52 + i * 56} textAnchor="end" fontSize={12.5} fill="#1E2D3C" fontWeight={700}>{bar.label}</SvgText>
          <rect x={x(0)} y={30 + i * 56} width={x(bar.value) - x(0)} height={36} rx={4} fill={bar.color} />
          <SvgText x={x(bar.value) + 6} y={53 + i * 56} textAnchor="start" fontSize={13} fontWeight={800} fill="#1E2D3C">{`${de(bar.value, 1)} %`}</SvgText>
        </g>)}
        <line x1={x(0)} x2={x(0)} y1={24} y2={150} stroke="#1E2D3C" strokeWidth={1.5} />
      </svg>
    </div>
    <p className="rueck text" aria-live="polite">{thirdText(g)}</p>
    <p className="hilfe-zeile">Unter 60 nutzen 98,5 % das Internet; für einen Vergleich bleiben dort zu wenige ohne Internet (31, gewichtet).</p>
    <p className="hilfe-zeile">Vergleiche hier die Prozentpunkte. Phi hängt auch davon ab, wie ungleich groß die Gruppen sind: Bei 60 bis 74 nutzen fast alle das Internet, darum fällt Phi dort kleiner aus, obwohl der Abstand größer ist.</p>
    <details className="werte">
      <summary>Textfassung: Pfeilbild und Zahlen</summary>
      <p>Pfeilbild: Das Alter wirkt auf beides. Ältere nutzen das Internet seltener, und Ältere sind seltener gesund. Zwischen „Internet nutzen“ und „Gesundheit“ steht eine gestrichelte Linie mit Fragezeichen.</p>
      <table className="daten">
        <caption>Gute oder sehr gute Gesundheit in Prozent, gewichtet</caption>
        <thead><tr><th scope="col">Gruppe</th><th scope="col">nutzt Internet</th><th scope="col">nutzt kein Internet</th><th scope="col">Abstand</th><th scope="col">Phi</th></tr></thead>
        <tbody>
          <tr><th scope="row">alle</th><td>59,0</td><td>24,0</td><td>35,0</td><td>0,22</td></tr>
          <tr><th scope="row">60 bis 74 Jahre (867 und 98)</th><td>48,3</td><td>29,6</td><td>18,7</td><td>0,11</td></tr>
          <tr><th scope="row">75 und älter (310 und 255)</th><td>35,5</td><td>20,4</td><td>15,1</td><td>0,17</td></tr>
        </tbody>
      </table>
      <p>{`Internetnutzung: ${de(INTERNET.use[0], 1)} % (18 bis 59), ${de(INTERNET.use[1], 1)} % (60 bis 74), ${de(INTERNET.use[2], 1)} % (75 und älter). Gute oder sehr gute Gesundheit: ${de(INTERNET.healthy[0], 1)} %, ${de(INTERNET.healthy[1], 1)} %, ${de(INTERNET.healthy[2], 1)} %. Die Internet-Frage bekamen nicht alle Befragten (gewichtet ${whole(INTERNET.valid)} gültige).`}</p>
    </details>
  </div>;
}
