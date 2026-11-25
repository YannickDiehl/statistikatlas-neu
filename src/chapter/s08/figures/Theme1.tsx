// Sitzung 8, Thema 1: Bilder B1 (Messfehler), B2 (eine Zeile, ein Wert), B2b (Formel), B3 (Index im ALLBUS), B-A1 (min_valid).
import { useState } from 'react';
import { ALT, FIVE_ROWS, MP_INDEX, MP_INDEX_W, ONE_PERSON, THREE_ROWS } from '../content';
import { BLUE, GRAY, GREEN, INK, ORANGE, Pic, Stone, Svg, T, de, short } from './kit';

/* ---------- B1 s8-messfehler ---------- */

/** Bild B1: vier Antworten einer Befragten auf einer Achse, ihr Mittelwert 2,75. */
export function MeasurementError() {
  const x = (v: number) => 80 + (v - 1) * 135;
  const labels = ['Sozialstaat', 'Sicherheit', 'Zusammenleben', 'Wirtschaft'];
  const mean = ONE_PERSON.reduce((a, b) => a + b, 0) / ONE_PERSON.length;
  const sw = 50, sh = 26;
  // Stones at 2 are stacked; label above the top one, the lower one gets its label to the left.
  const placed = ONE_PERSON.map((v, i) => ({ v, label: labels[i], level: ONE_PERSON.slice(0, i).filter(u => u === v).length }));
  return <Pic alt={ALT.messfehler}>
    <Svg w={700} h={250}>
      <T x={20} y={22} textAnchor="start" fontStyle="italic" fill={GRAY}>zum Beispiel eine Befragte</T>
      <line x1={x(mean)} x2={x(mean)} y1={44} y2={232} stroke={GRAY} strokeWidth={1.5} strokeDasharray="5 4" />
      <T x={x(mean)} y={40} fill="#5F6A74" fontSize={12}>ihre Haltung, geschätzt aus vier Fragen</T>
      <line x1={60} x2={640} y1={170} y2={170} stroke="#9aa4ad" strokeWidth={2} />
      {[1, 2, 3, 4, 5].map(v => <g key={v}>
        <line x1={x(v)} x2={x(v)} y1={165} y2={175} stroke="#9aa4ad" strokeWidth={2} />
        <T x={x(v)} y={192} fill={INK} fontWeight={700}>{String(v)}</T>
      </g>)}
      <T x={x(1)} y={212} fontSize={12}>Risiko überwiegt</T>
      <T x={x(5)} y={212} fontSize={12}>Chance überwiegt</T>
      {placed.map(p => {
        const sy = 168 - sh - 2 - p.level * (sh + 4);
        const top = !placed.some(q => q.v === p.v && q.level > p.level);
        return <g key={p.label}>
          <Stone x={x(p.v) - sw / 2} y={sy} w={sw} h={sh} value={String(p.v)} />
          {top ? <T x={x(p.v)} y={sy - 6} fontSize={12} fill={INK}>{p.label}</T>
            : <T x={x(p.v) - sw / 2 - 6} y={sy + sh / 2 + 4} fontSize={12} fill={INK} textAnchor="end">{p.label}</T>}
        </g>;
      })}
      <path d={`M${x(mean)},${176} L${x(mean) - 8},${190} L${x(mean) + 8},${190} Z`} fill={GREEN.stroke} />
      <T x={x(mean)} y={232} fill={GREEN.stroke} fontWeight={700} fontSize={12.5}>{`Mittelwert ${short(mean)}`}</T>
    </Svg>
  </Pic>;
}

/* ---------- B2 s8-reihe ---------- */

const STEP_NAMES = ['Zeile lesen', 'Mittelwert der Zeile', 'neue Variable'];
const valid = (vs: (number | null)[]) => vs.filter((v): v is number => v !== null);
const rowMean = (vs: (number | null)[]) => { const g = valid(vs); return g.reduce((a, b) => a + b, 0) / g.length; };
const formula = (vs: (number | null)[]) => { const g = valid(vs); return `(${g.join(' + ')}) / ${g.length} = ${short(Math.round(rowMean(vs) * 100) / 100)}`; };

/** Live text of picture B2 after step `s` with the given min_valid. */
export function rowText(s: number, minValid: 3 | 4): string {
  const [a, b, c] = THREE_ROWS;
  if (s === 1) return `Person A: ${valid(a.values).slice(0, -1).join(', ')} und ${valid(a.values).at(-1)}.`;
  if (s === 2) return `Mittelwert je Zeile. Person A: ${formula(a.values)}. Person B: ${formula(b.values)}, der fehlende Wert zählt nicht mit. Person C: ${formula(c.values)}.`;
  const bText = minValid === 4 ? 'leer (NA), nur 3 von 4 gültig' : short(Math.round(rowMean(b.values) * 100) / 100);
  return `Neue Variable fluechtlinge mit min_valid = ${minValid}: Person A ${short(rowMean(a.values))}, Person B ${bText}, Person C ${short(rowMean(c.values))}.`;
}

/** Bild B2: eine Zeile des Datensatzes, ihr Mittelwert und die neue Variable; drei Schritte und ein Umschalter für min_valid. */
export function RowMean() {
  const [s, setS] = useState(1);
  const [minValid, setMinValid] = useState<3 | 4>(3);
  const cols = ['mp16', 'mp17', 'mp18', 'mp19'];
  const cx = (j: number) => 70 + j * 66, ry = (i: number) => 70 + i * 48, sw = 52, sh = 32;
  const bOut = s === 3 && minValid === 4;
  return <div className="s8-reihe">
    <ul className="schritt-nav" aria-label="Schritte">
      {STEP_NAMES.map((name, i) => <li key={name}>
        <button type="button" aria-current={i + 1 === s ? 'step' : 'false'} onClick={() => setS(i + 1)}>{`Schritt ${i + 1}: ${name}`}</button>
      </li>)}
    </ul>
    <div className="s8-umschalter" role="group" aria-label="min_valid">
      {([4, 3] as const).map(m => <button key={m} type="button" aria-pressed={minValid === m} onClick={() => setMinValid(m)}>{`min_valid = ${m}`}</button>)}
    </div>
    <div className="grafik">
      <Svg w={760} h={240}>
        <T x={14} y={18} textAnchor="start" fontStyle="italic" fill={GRAY}>zum Beispiel drei Befragte</T>
        {cols.map((c, j) => <g key={c}>
          <T x={cx(j) + sw / 2} y={38} fontSize={10.5} fill={GRAY}>{'<dbl+lbl>'}</T>
          <T x={cx(j) + sw / 2} y={54} fill={INK} fontWeight={700} fontFamily="JetBrains Mono,monospace" fontSize={12.5}>{c}</T>
        </g>)}
        {THREE_ROWS.map((row, i) => <g key={row.name}>
          <T x={40} y={ry(i) + sh / 2 + 5} fill={INK} fontWeight={700}>{row.name}</T>
          {row.values.map((v, j) => <Stone key={j} x={cx(j)} y={ry(i)} w={sw} h={sh} value={v === null ? undefined : String(v)} empty={v === null}
            dim={v === null && s >= 2} />)}
          {s >= 2 && row.values.includes(null)
            ? <T x={cx(3) + sw / 2} y={ry(i) + sh + 11} fontSize={10} fill={GRAY}>zählt nicht mit</T> : null}
          {s >= 2 ? <g opacity={row.name === 'B' && bOut ? 0.5 : 1}>
            <T x={350} y={ry(i) + sh / 2 + 5} textAnchor="start" fill={row.name === 'B' && bOut ? GRAY : INK} fontFamily="JetBrains Mono,monospace" fontSize={13}>{formula(row.values)}</T>
            {row.name === 'B' && bOut ? <line x1={346} x2={520} y1={ry(i) + sh / 2} y2={ry(i) + sh / 2} stroke={GRAY} strokeWidth={1.5} /> : null}
          </g> : null}
        </g>)}
        {s === 1 ? <rect x={cx(0) - 6} y={ry(0) - 6} width={3 * 66 + sw + 12} height={sh + 12} rx={8} fill="none" stroke={ORANGE} strokeWidth={3} /> : null}
        {s === 3 ? <g>
          <T x={640} y={38} fontSize={10.5} fill={GRAY}>{'<dbl>'}</T>
          <T x={640} y={54} fill={INK} fontWeight={700} fontFamily="JetBrains Mono,monospace" fontSize={12.5}>fluechtlinge</T>
          {THREE_ROWS.map((row, i) => {
            const out = row.name === 'B' && bOut;
            return <g key={row.name}>
              <Stone x={606} y={ry(i)} w={68} h={sh} value={out ? undefined : short(Math.round(rowMean(row.values) * 100) / 100)} empty={out} fill={GREEN.fill} stroke={GREEN.stroke} />
              {out ? <T x={640} y={ry(i) + sh + 11} fontSize={10} fill={GRAY}>nur 3 von 4 gültig</T> : null}
            </g>;
          })}
        </g> : null}
      </Svg>
    </div>
    <p className="rueck text" aria-live="polite">{rowText(s, minValid)}</p>
    <details className="werte"><summary>Das ganze Bild als Text</summary><p>{ALT.reihe}</p></details>
  </div>;
}

/* ---------- B2b s8-formel-index ---------- */

/** Bild B2b: die Formel des Mittelwertindex als Bausteine, mit Bedingung und eingesetzt für Person B. */
export function IndexFormula() {
  return <div className="formel s8-formel" role="group" aria-label="Formel für den Indexwert einer Person">
    <span className="frac" aria-hidden="true"><span>Summe der gültigen Antworten einer Person</span><span>Anzahl ihrer gültigen Antworten</span></span>
    <span aria-hidden="true">=</span><span className="gross" aria-hidden="true">Indexwert</span>
    <span className="s8-bedingung" aria-hidden="true">nur wenn Anzahl gültiger Antworten ≥ min_valid, sonst leer (NA)</span>
    <span className="s8-eingesetzt" aria-hidden="true">Person B: (1 + 1 + 2) / 3 = 1,33, denn 3 ≥ 3</span>
    <span className="sr-only">{ALT.formelIndex}</span>
  </div>;
}

/* ---------- B3 s8-index-fluechtlinge ---------- */

/** Bild B3: Verteilung des Index aus mp16 bis mp19 (min_valid = 4), gewichtet, mit Tabelle. */
export function IndexBars() {
  const w = 700, h = 270, pad = { l: 40, r: 12, t: 26, b: 58 }, iw = w - pad.l - pad.r, ih = h - pad.t - pad.b, top = 14;
  const n = MP_INDEX.values.length, bw = iw / n;
  const x = (v: number) => pad.l + ((v - 1) / 0.25 + 0.5) * bw, y = (p: number) => pad.t + ih - p / top * ih;
  return <>
    <Pic alt={ALT.indexFluechtlinge} caption={<>Index aus mp16 bis mp19, nur Befragte mit allen vier Antworten (min_valid = 4). ALLBUS 2023, gewichtet, n = 3.424 Befragte. Mit min_valid = 3 kommen 58 Befragte dazu, die auch Drittelwerte wie 2,33 haben können (zusammen 1,15 %); das Bild ändert sich dadurch kaum, der Mittelwert steigt nur von 2,452 auf 2,457 (die Zahl aus der Vorlage in „R lesen“).</>}>
      <Svg w={w} h={h}>
        {[0, 5, 10].map(p => <g key={p}>
          <line x1={pad.l} x2={w - pad.r} y1={y(p)} y2={y(p)} stroke="#EFE6DA" strokeWidth={1} />
          <T x={pad.l - 8} y={y(p) + 4} textAnchor="end" fontSize={11}>{String(p)}</T>
        </g>)}
        <T x={pad.l - 30} y={pad.t - 10} textAnchor="start" fontSize={11}>Prozent</T>
        {MP_INDEX.values.map((v, i) => {
          const p = MP_INDEX.percent[i], col = v < 3 ? BLUE : v === 3 ? { fill: '#D5DADF', stroke: GRAY } : GREEN;
          return <rect key={v} x={x(v) - bw * 0.38} y={y(p)} width={bw * 0.76} height={y(0) - y(p)} rx={2} fill={col.fill} stroke={col.stroke} strokeWidth={1} />;
        })}
        <line x1={pad.l} x2={w - pad.r} y1={y(0)} y2={y(0)} stroke="#9aa4ad" strokeWidth={1.5} />
        <line x1={x(MP_INDEX_W.median)} x2={x(MP_INDEX_W.median)} y1={pad.t - 6} y2={y(0)} stroke="#8a4a2c" strokeWidth={2} strokeDasharray="4 3" />
        <path d={`M${x(MP_INDEX_W.mean)},${y(0) + 4} L${x(MP_INDEX_W.mean) - 7},${y(0) + 16} L${x(MP_INDEX_W.mean) + 7},${y(0) + 16} Z`} fill={GREEN.stroke} />
        {[1, 2, 3, 4, 5].map(v => <T key={v} x={x(v)} y={y(0) + 30} fill={INK} fontWeight={700}>{String(v)}</T>)}
        <T x={x(1)} y={y(0) + 48} fontSize={11.5}>Risiko überwiegt</T>
        <T x={x(3)} y={y(0) + 48} fontSize={11.5}>weder noch</T>
        <T x={x(5) - 20} y={y(0) + 48} fontSize={11.5}>Chance überwiegt</T>
      </Svg>
    </Pic>
    <details className="werte">
      <summary>Alle Werte als Tabelle</summary>
      <table className="daten">
        <caption>Index zu Geflüchteten, gewichtet, Prozent der Befragten mit Indexwert</caption>
        <thead><tr><th scope="col">Wert</th><th scope="col">Prozent</th><th scope="col">kumuliert</th></tr></thead>
        <tbody>{MP_INDEX.values.map((v, i) => <tr key={v}><td>{short(v)}</td><td>{de(MP_INDEX.percent[i], 2)}</td><td>{de(MP_INDEX.cum[i], 2)}</td></tr>)}</tbody>
      </table>
    </details>
  </>;
}

/* ---------- B-A1 s8-min-valid ---------- */

/** Bild B-A1: fünf Befragte mit unterschiedlich vielen gültigen Antworten und ihr Wert bei min_valid = 7 und 5. */
export function MinValid() {
  const cols = ['pa29', 'pa30', 'pa31', 'pa32', 'pa33', 'pa34', 'pa35'];
  const cx = (j: number) => 50 + j * 54, ry = (i: number) => 56 + i * 40, sw = 46, sh = 28;
  const value = (vs: (number | null)[], m: number) => (valid(vs).length >= m && valid(vs).length > 0 ? de(rowMean(vs), 2) : undefined);
  return <Pic alt={ALT.minValid} caption={<>Je kleiner min_valid, desto mehr Befragte bekommen einen Wert. Wer die Fragen gar nicht bekam (Split), bekommt nie einen. <span>Die Werte sind ein Beispiel mit fünf Befragten.</span></>}>
    <Svg w={760} h={262}>
      {cols.map((c, j) => <T key={c} x={cx(j) + sw / 2} y={40} fill={INK} fontWeight={700} fontFamily="JetBrains Mono,monospace" fontSize={12}>{c}</T>)}
      <T x={448} y={40} fill={INK} fontWeight={700}>gültig</T>
      <T x={556} y={30} fill={INK} fontWeight={700} fontFamily="JetBrains Mono,monospace" fontSize={11.5}>min_valid = 7</T>
      <T x={676} y={30} fill={INK} fontWeight={700} fontFamily="JetBrains Mono,monospace" fontSize={11.5}>min_valid = 5</T>
      {FIVE_ROWS.map((row, i) => {
        const n = valid(row).length, gray = n < 5;
        return <g key={i}>
          <T x={22} y={ry(i) + sh / 2 + 5} fill={INK} fontWeight={700}>{String(i + 1)}</T>
          {row.map((v, j) => <Stone key={j} x={cx(j)} y={ry(i)} w={sw} h={sh} value={v === null ? undefined : String(v)} empty={v === null} dim={gray} />)}
          {i === 4 ? <g>
            <rect x={cx(0) + 2} y={ry(i) + 6} width={sw + 34} height={16} rx={4} fill="#FFF6DA" stroke="#E0C46A" />
            <T x={cx(0) + 4 + (sw + 30) / 2} y={ry(i) + 18} fontSize={9.5} fill="#7a5c0c" fontWeight={700}>TNZ: SPLIT</T>
          </g> : null}
          <T x={448} y={ry(i) + sh / 2 + 5} fill={INK} fontWeight={700}>{String(n)}</T>
          {[7, 5].map((m, k) => {
            const val = value(row, m);
            return <Stone key={m} x={k ? 640 : 520} y={ry(i)} w={72} h={sh} value={val} empty={val === undefined} fill={GREEN.fill} stroke={GREEN.stroke} />;
          })}
        </g>;
      })}
    </Svg>
  </Pic>;
}
