// Erklärfassungen von Atlas-Bildern aus Sitzung 3, die dort erst nach einer Antwort vollständig sind oder eine Übung tragen:
// Bücher-Streifen (Median und Modus), Haushalts-Streifen (Klammern), Haushalts-Reihe (Schritt mit der WG),
// Regale (statt Zuordnen) und Entscheidungsbaum (Beispiele ohne die Variablen der Aufgaben).
import { useState, type ReactNode } from 'react';
import { ChapterStateProvider } from '@atlas/chapter/ChapterContext';
import { HOUSEHOLDS9, K1C_Q, K4_Q, MISSING_CODES, ROW_TEXT, SHELVES, WG } from '@atlas/chapter/s03/content';
import { BookStrip, HouseholdStrip } from '@atlas/chapter/s03/figures/Strip';
import { ROW_STATS } from '@atlas/chapter/s03/figures/HouseholdRow';
import { C, StepNav, SvgText, TextVersion, de } from '@atlas/chapter/s03/figures/util';

/**
 * Zeigt ein Atlas-Bild im aufgelösten Zustand, ohne dass jemand antwortet: eine eigene, nur lesende Speicher-Ebene
 * mit einer Beispielantwort. Sie schreibt nichts in den Speicher, weil die Bilder nie selbst eine Antwort setzen.
 */
function Aufgeloest({ antworten, children }: { antworten: Record<string, string>; children: ReactNode }) {
  return <ChapterStateProvider sessionId={3} initial={{ predictions: {}, answers: antworten }}>{children}</ChapterStateProvider>;
}

/** Bücher lesen (la01) als Streifen von 0 bis 100 %, mit der Mitte bei 50 %, dem Median und dem Modus. */
export const BuecherStreifen = () => <Aufgeloest antworten={{ [K1C_Q.id]: String(K1C_Q.target) }}><BookStrip /></Aufgeloest>;

/** Personen im Haushalt (dh04) als Streifen, mit Mittelwert, Median und den Klammern „höchstens 2“ und „über dem Mittelwert“. */
export const HaushaltsStreifen = () => <Aufgeloest antworten={{ [K4_Q.id]: String(K4_Q.target) }}><HouseholdStrip /></Aufgeloest>;

/* ---------- Die Mitte der sortierten Werte: neun Haushalte, dann mit der WG (alle vier Schritte von Anfang an) ---------- */
const xr = (v: number) => 170 + v * 45;
const BASE = 250, SH = 22, SW = 34;

function Stein({ x, y, v, rahmen }: { x: number; y: number; v: number; rahmen?: boolean }) {
  return <g>
    <rect x={x} y={y} width={SW} height={SH - 2} rx={3} fill={C.blue} stroke={rahmen ? C.orangeDark : C.blueStroke} strokeWidth={rahmen ? 3 : 1} />
    <SvgText x={x + SW / 2} y={y + 15} fontSize={12.5} fill={C.ink} fontWeight={800}>{String(v)}</SvgText>
  </g>;
}

function Turm() {
  return <g>
    <SvgText x={16} y={22} textAnchor="start" fontStyle="italic" fontSize={12.5}>zum Beispiel neun Befragte</SvgText>
    <SvgText x={80} y={48} fontFamily="JetBrains Mono,monospace" fontSize={11}>{'<dbl>'}</SvgText>
    <rect x={48} y={53} width={64} height={20} rx={6} fill={C.ink} />
    <SvgText x={80} y={67} fill="#fff" fontFamily="JetBrains Mono,monospace" fontSize={12}>dh04</SvgText>
    {HOUSEHOLDS9.map((v, i) => <Stein key={i} x={63} y={80 + i * 22} v={v} />)}
    <rect x={40} y={80 + 9 * 22 + 2} width={80} height={10} rx={4} fill={C.plate} />
  </g>;
}

function Lineal({ schritt }: { schritt: number }) {
  const mitWg = schritt === 3;
  const werte = [...HOUSEHOLDS9, ...(mitWg ? [WG] : [])].sort((a, b) => a - b);
  const n = werte.length, mitte = (n - 1) / 2;
  const istMitte = (i: number) => (n % 2 ? i === mitte : i === Math.floor(mitte) || i === Math.ceil(mitte));
  const st = mitWg ? ROW_STATS.ten : ROW_STATS.nine;
  const hoehe: Record<number, number> = {};
  return <g>
    {werte.map((v, i) => <g key={`r${i}`}>
      <SvgText x={150 + i * 40 + SW / 2} y={34} fontSize={11}>{`${i + 1}.`}</SvgText>
      <Stein x={150 + i * 40} y={40} v={v} rahmen={istMitte(i)} />
    </g>)}
    {n % 2 ? <>
      <path d={`M150,70 V76 H${150 + 3 * 40 + SW} V70`} fill="none" stroke={C.mute} strokeWidth={1.5} />
      <SvgText x={150 + 1.5 * 40 + SW / 2} y={92} fontSize={11.5}>4 Werte</SvgText>
      <path d={`M${150 + 5 * 40},70 V76 H${150 + 8 * 40 + SW} V70`} fill="none" stroke={C.mute} strokeWidth={1.5} />
      <SvgText x={150 + 6.5 * 40 + SW / 2} y={92} fontSize={11.5}>4 Werte</SvgText>
    </> : null}
    {werte.map((v, i) => {
      const k = hoehe[v] = (hoehe[v] ?? 0) + 1;
      return <Stein key={`s${i}`} x={xr(v) - SW / 2} y={BASE - k * SH} v={v} rahmen={(mitWg && v === WG) || (!mitWg && i === 4)} />;
    })}
    {mitWg ? <SvgText x={xr(WG)} y={BASE - SH - 6} fontSize={11} fill={C.orangeDark} fontWeight={800}>neu</SvgText> : null}
    <line x1={xr(0)} x2={xr(12)} y1={BASE + 2} y2={BASE + 2} stroke={C.ink} strokeWidth={2} />
    {Array.from({ length: 13 }, (_, v) => <g key={v}>
      <line x1={xr(v)} x2={xr(v)} y1={BASE + 2} y2={BASE + (v % 2 ? 6 : 9)} stroke={C.ink} />
      {v % 2 ? null : <SvgText x={xr(v)} y={BASE + 22} fontSize={11.5}>{String(v)}</SvgText>}
    </g>)}
    <line x1={xr(st.median)} x2={xr(st.median)} y1={BASE - 4 * SH - 16} y2={BASE + 2} stroke={C.orangeDark} strokeWidth={2.2} strokeDasharray="5 4" />
    <SvgText x={xr(st.median) + 6} y={BASE - 4 * SH - 6} textAnchor="start" fontSize={12} fill={C.orangeDark} fontWeight={800}>
      {mitWg ? 'Median 2 (zwischen dem 5. und 6. Wert)' : `Median ${st.median}`}</SvgText>
    {schritt >= 2 ? <>
      {mitWg ? <path d={`M${xr(ROW_STATS.nine.mean)},${BASE + 28} l-8,14 h16 Z`} fill={C.orange} opacity={0.3} /> : null}
      <path d={`M${xr(st.mean)},${BASE + 28} l-9,16 h18 Z`} fill={C.orange} stroke={C.orangeDark} />
      <SvgText x={xr(st.mean) + 14} y={BASE + 42} textAnchor="start" fontSize={12} fill={C.ink} fontWeight={800}>{`Mittelwert ${de(st.mean, mitWg ? 1 : 2)}`}</SvgText>
    </> : null}
  </g>;
}

/** Bild „Die Mitte der sortierten Werte“: Datenreihe, sortiert, Mittelwert und, als vierter Schritt, die zehnte Person aus der WG. */
export function HaushaltsReihe() {
  const [schritt, setSchritt] = useState(0);
  const st = schritt === 3 ? ROW_STATS.ten : ROW_STATS.nine;
  const sortiert = [...HOUSEHOLDS9].sort((a, b) => a - b);
  return <div>
    <StepNav steps={['Datenreihe', 'sortiert', 'Mittelwert', 'mit der WG']} current={schritt} onSelect={setSchritt} label="Schritte: die Mitte der sortierten Werte" />
    <div className="grafik" role="img" aria-label={`Schritt ${schritt + 1}: ${ROW_TEXT[schritt]}`}>
      <svg viewBox="0 0 760 300" width="100%" aria-hidden="true" focusable="false">
        {schritt === 0 ? <Turm /> : <Lineal schritt={schritt} />}
      </svg>
    </div>
    {schritt >= 2 ? <div className="s3-rechnung" aria-hidden="true">
      {schritt === 3
        ? <><span>{`${ROW_STATS.nine.sum} + ${WG} = ${ROW_STATS.ten.sum}`}</span><span>{`${ROW_STATS.ten.sum} geteilt durch 10 Werte = ${de(ROW_STATS.ten.mean, 1)}`}</span></>
        : <><span>{`${sortiert.join(' + ')} = ${st.sum}`}</span><span>{`${st.sum} geteilt durch 9 Werte = ${de(st.mean)}`}</span></>}
      <small>Das Dreieck ist der Mittelwert, der Schwerpunkt: Auf diesem Punkt würde das Lineal im Gleichgewicht liegen.</small>
    </div> : null}
    <p className="sr-only" aria-live="polite">{`Schritt ${schritt + 1}: ${ROW_TEXT[schritt]}`}</p>
    <TextVersion><p>{ROW_TEXT.map((t, i) => `Schritt ${i + 1}: ${t}`).join(' ')}</p></TextVersion>
  </div>;
}

/* ---------- Drei Regale: jeder Code schon an seinem Platz, mit der Begründung aus der Zuordnungsübung ---------- */
const minus = (n: number) => String(n).replace('-', '−');

export function RegaleErklaert() {
  return <ul className="s3-regal-liste v-regale" aria-label="Drei Regale für fehlende Werte" style={{ gridTemplateColumns: '1fr' }}>
    {SHELVES.map(s => <li key={s.n} className="s3-regal">
      <b>{`Regal ${s.n}: ${s.title}`}</b><span>{s.sub}</span>
      <ul className="s3-liste">{MISSING_CODES.filter(c => c.shelf === s.n).map(c => <li key={c.code}>
        <span className="s3-code-stein"><span className="s3-code">{minus(c.code)}</span><span className="s3-leer" aria-hidden="true"></span><span className="s3-aufkleber">{c.label}</span></span>
        {c.right.replace(/^Richtig\.\s*/, '')}
      </li>)}</ul>
    </li>)}
  </ul>;
}

/* ---------- Welche Mitte passt? Entscheidungsbaum ---------- */
const STRICH = '#978B7B';
function Knoten({ x, y, w, zeilen, blatt, unter }: { x: number; y: number; w: number; zeilen: string[]; blatt?: boolean; unter?: string }) {
  const h = 22 + zeilen.length * 17 + (unter ? 16 : 0);
  return <g>
    <rect x={x - w / 2} y={y} width={w} height={h} rx={12} fill={blatt ? '#CDEFD9' : '#fff'} stroke={blatt ? '#8FCBA6' : C.ink} strokeWidth={2} />
    {zeilen.map((l, k) => <SvgText key={k} x={x} y={y + 24 + k * 17} fill={C.ink} fontWeight={800} fontSize={13.5}>{l}</SvgText>)}
    {unter ? <SvgText x={x} y={y + 24 + zeilen.length * 17} fontSize={11.5} fill={C.mute}>{unter}</SvgText> : null}
  </g>;
}
function Pfeil({ x1, y1, x2, y2, text }: { x1: number; y1: number; x2: number; y2: number; text: string }) {
  return <g>
    <path d={`M${x1},${y1} C${x1},${(y1 + y2) / 2} ${x2},${(y1 + y2) / 2} ${x2},${y2 - 6}`} fill="none" stroke={STRICH} strokeWidth={2} />
    <path d={`M${x2 - 5},${y2 - 8} L${x2},${y2} L${x2 + 5},${y2 - 8}`} fill="none" stroke={STRICH} strokeWidth={2} />
    <rect x={(x1 + x2) / 2 - 20} y={(y1 + y2) / 2 - 11} width={40} height={20} rx={7} fill="#FFFCF3" stroke="#E9DFCF" />
    <SvgText x={(x1 + x2) / 2} y={(y1 + y2) / 2 + 4} fontSize={12} fontWeight={800}>{text}</SvgText>
  </g>;
}
const BAUM_TEXT = 'Entscheidungsbaum. Erste Frage: Haben die Codes eine Reihenfolge? Wenn nein, ist die Variable nominal, du berichtest den Modus, zum Beispiel bei Wahlabsicht oder Konfession. Wenn ja, zweite Frage: Sind die Abstände gleich groß? Wenn nein, ist sie ordinal, du berichtest Median und Modus, zum Beispiel bei Bücher lesen oder dem Gesundheitszustand. Wenn ja, ist sie metrisch, du berichtest Mittelwert und Median, zum Beispiel bei Personen im Haushalt oder dem Alter in Jahren. Liegen beide weit auseinander, gehören beide in den Bericht.';

export function MitteBaum() {
  return <div className="grafik" role="img" aria-label={BAUM_TEXT}>
    <svg viewBox="0 0 760 338" width="100%" aria-hidden="true" focusable="false">
      <Pfeil x1={300} y1={49} x2={140} y2={120} text="nein" />
      <Pfeil x1={300} y1={49} x2={470} y2={120} text="ja" />
      <Pfeil x1={470} y1={159} x2={335} y2={240} text="nein" />
      <Pfeil x1={470} y1={159} x2={622} y2={240} text="ja" />
      <Knoten x={300} y={10} w={300} zeilen={['Haben die Codes eine Reihenfolge?']} />
      <Knoten x={140} y={120} w={220} zeilen={['nominal: Modus']} blatt unter="Wahlabsicht, Konfession" />
      <Knoten x={470} y={120} w={260} zeilen={['Sind die Abstände gleich groß?']} />
      <Knoten x={335} y={240} w={250} zeilen={['ordinal: Median und Modus']} blatt unter="Bücher lesen, Gesundheitszustand" />
      <Knoten x={622} y={240} w={236} zeilen={['metrisch:', 'Mittelwert und Median']} blatt unter="Personen im Haushalt, Alter" />
      <SvgText x={622} y={326} fontSize={11.5} fontStyle="italic">liegen sie weit auseinander: beide berichten</SvgText>
    </svg>
  </div>;
}
