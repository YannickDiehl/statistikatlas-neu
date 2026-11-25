// Erklärfassungen von Atlas-Bildern, die dort eine Übung eingebaut haben (Lineal mit Kurzarbeit-Frage, Achse mit Tipp-Feld).
import { useState, type ReactNode } from 'react';
import { SvgText, de } from '@atlas/chapter/s04/figures/Bars';

const BASIS = [22, 28, 34, 34, 38, 40, 40, 43, 43, 44, 45];
const mitte = (s: number[]) => { const n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
/** Quartile als Mitte der unteren und oberen Hälfte (die mittlere Person zählt zu keiner Hälfte). */
const quartile = (s: number[]) => { const h = Math.floor(s.length / 2); return [mitte(s.slice(0, h)), mitte(s.slice(s.length - h))]; };

type Stufe = { name: string; werte: number[]; median: boolean; quart: boolean; kasten: boolean; grenze?: boolean; neu?: number[]; text: ReactNode };
const STUFEN: Stufe[] = [
  { name: 'Mittelwert', werte: BASIS, median: false, quart: false, kasten: false,
    text: <><b>Mittelwert:</b> Stell dir das Lineal als Wippe vor. Der Mittelwert ist der Punkt, an dem sie im Gleichgewicht ist: alle Stunden zusammen (411) geteilt durch 11 Personen = <b>37,4 Stunden</b>. Kurz gesagt: der Schwerpunkt.</> },
  { name: 'Median', werte: BASIS, median: true, quart: false, kasten: false,
    text: <><b>Median:</b> Zähl von links. Die sechste Person steht genau in der Mitte: fünf links, fünf rechts. Sie arbeitet <b>40 Stunden</b>. Kurz gesagt: Die eine Hälfte arbeitet weniger, die andere mehr.</> },
  { name: 'Quartile', werte: BASIS, median: true, quart: true, kasten: false,
    text: <><b>Quartile:</b> Teil jede Hälfte noch einmal in der Mitte. Die dritte Person (<b>34 Stunden</b>) ist das untere Quartil (Q1), die neunte (<b>43 Stunden</b>) das obere (Q3). Kurz gesagt: Zwischen ihnen steht die mittlere Hälfte der Personen.</> },
  { name: 'Box und Whisker', werte: BASIS, median: true, quart: true, kasten: true,
    text: <><b>Box und Whisker:</b> Um die mittlere Hälfte kommt ein Kasten, die <b>Box</b>; der Median kommt als Linie hinein. Die <b>Whisker</b> (im Bild: Antennen) reichen bis zum kleinsten und größten Wert, höchstens anderthalb Boxlängen weit. Fertig ist der <b>Boxplot</b>. Die Länge der Box (43 − 34 = 9 Stunden) heißt <b>Interquartilsabstand</b>.</> },
  { name: 'Ein Ausreißer', werte: [0, ...BASIS.slice(1)], median: true, quart: true, kasten: true, grenze: true, neu: [0],
    text: <><b>Was passiert, wenn die Person mit 22 Stunden in Kurzarbeit null geht?</b> Sie arbeitet jetzt 0 Stunden. Der Mittelwert fällt von 37,4 auf <b>35,4</b>, der Median bleibt bei <b>40</b>: Die Person in der Mitte ist dieselbe. Die 0 liegt links der Grenze (34 − 1,5 × 9 = 20,5), darum zeichnet R sie als eigenen Punkt, als <b>Ausreißer</b>. Der Whisker endet jetzt bei 28 Stunden. Ein Ausreißer ist kein Fehler: Er wird markiert, nicht gelöscht.</> },
  { name: 'Zwei fallen weg', werte: BASIS.slice(0, 9), median: true, quart: false, kasten: false,
    text: <><b>Und wenn die zwei Personen mit 44 und 45 Stunden aus der Auswertung fallen?</b> Neun bleiben. Die fünfte steht jetzt in der Mitte, und sie arbeitet <b>38 Stunden</b>. Der Median rutscht nach unten, weil am oberen Ende Personen fehlen. Ein einzelner Ausreißer bewegt den Median kaum, wer aber Personen weglässt, verschiebt die Mitte der Reihe. Genau das passiert in Aufgabe 4, wenn <code>filter()</code> lange Fälle hinauswirft.</> },
];

function Lineal({ st }: { st: Stufe }) {
  const w = 540, h = 300, line = 170, x = (v: number) => 22 + v / 50 * (w - 44);
  const s = [...st.werte].sort((a, b) => a - b), taken: { s: number; x: number }[] = [];
  const mean = s.reduce((a, b) => a + b, 0) / s.length, med = mitte(s), [q1, q3] = quartile(s), mi = (s.length - 1) / 2, h2 = Math.floor(s.length / 2);
  const ticks: ReactNode[] = [];
  for (let v = 0; v <= 50; v += 5) {
    ticks.push(<line key={`t${v}`} x1={x(v)} x2={x(v)} y1={line} y2={line + (v % 10 ? 5 : 9)} stroke="#1E2D3C" />);
    if (v % 10 === 0) ticks.push(<SvgText key={`l${v}`} x={x(v)} y={line + 22} fontSize={12}>{`${v} Std.`}</SvgText>);
  }
  const leute = s.map((v, i) => {
    let k = 1; while (taken.some(b => b.s === k && Math.abs(b.x - x(v)) < 23)) k++;
    taken.push({ s: k, x: x(v) });
    const y = line - 6 - k * 25, istMitte = st.median && i === mi, quart = st.quart && (i === (h2 - 1) / 2 || i === s.length - 1 - (h2 - 1) / 2), neu = st.neu?.includes(v);
    return <g key={i}>
      <rect x={x(v) - 11} y={y} width={22} height={22} rx={5} strokeWidth={1.5}
        fill={neu ? '#fdeeea' : istMitte ? '#FFD2BC' : quart ? '#E6D3F2' : '#FFF6DA'}
        stroke={neu ? '#a0452f' : istMitte ? '#c97b55' : quart ? '#8a6fc9' : '#E0C46A'} />
      <SvgText x={x(v)} y={y + 15} fontSize={11} fill="#1E2D3C" fontWeight={800}>{String(i + 1)}</SvgText>
    </g>;
  });
  let kasten: ReactNode = null;
  if (st.kasten) {
    const by = 258, grenze = q1 - 1.5 * (q3 - q1), drin = s.filter(v => v >= grenze), draussen = s.filter(v => v < grenze);
    const lo = Math.min(...drin), hi = Math.max(...s);
    kasten = <>
      <line x1={x(lo)} x2={x(q1)} y1={by} y2={by} stroke="#1E2D3C" strokeWidth={2} />
      <line x1={x(q3)} x2={x(hi)} y1={by} y2={by} stroke="#1E2D3C" strokeWidth={2} />
      {[lo, hi].map((v, k) => <line key={k} x1={x(v)} x2={x(v)} y1={by - 8} y2={by + 8} stroke="#1E2D3C" strokeWidth={2} />)}
      <rect x={x(q1)} y={by - 18} width={x(q3) - x(q1)} height={36} rx={5} fill="#FFF0E8" stroke="#1E2D3C" strokeWidth={2.2} />
      <line x1={x(med)} x2={x(med)} y1={by - 18} y2={by + 18} stroke="#8a4a2c" strokeWidth={3.5} />
      {draussen.map((v, k) => <circle key={k} cx={x(v)} cy={by} r={6} fill="#fdeeea" stroke="#a0452f" strokeWidth={2} />)}
      {st.grenze ? <>
        <line x1={x(grenze)} x2={x(grenze)} y1={by - 26} y2={by + 26} stroke="#a0452f" strokeWidth={1.8} strokeDasharray="4 3" />
        <SvgText x={x(grenze)} y={by - 30} fontSize={11.5} fill="#a0452f" fontWeight={800}>{`Grenze ${de(grenze, 1)}`}</SvgText>
      </> : null}
      <SvgText x={x(lo) + (x(q1) - x(lo)) / 2} y={by - 8} fontSize={11.5}>Whisker</SvgText>
      <SvgText x={x(q1) - 4} y={by + 34} fontSize={11.5} textAnchor="start">Box: mittlere Hälfte</SvgText>
    </>;
  }
  return <svg viewBox={`0 0 ${w} ${h}`} width="100%" aria-hidden="true" focusable="false">
    <line x1={x(0)} x2={x(50)} y1={line} y2={line} stroke="#1E2D3C" strokeWidth={2} />
    {ticks}{leute}
    <path d={`M${x(mean) - 9},${line + 2} L${x(mean) + 9},${line + 2} L${x(mean)},${line - 12} Z`} fill="#2C6CA8" />
    <SvgText x={x(mean)} y={line + 40} fill="#2C6CA8" fontWeight={800} fontSize={12.5}>{`Mittelwert ${de(mean, 1)}`}</SvgText>
    {st.median ? <>
      <line x1={x(med)} x2={x(med)} y1={22} y2={line} stroke="#8a4a2c" strokeWidth={2.5} strokeDasharray="5 4" />
      <SvgText x={x(med)} y={16} fill="#8a4a2c" fontWeight={800} fontSize={12.5}>{`Median ${de(med, 0)}`}</SvgText>
    </> : null}
    {st.quart ? [q1, q3].map((v, i) => <g key={i}>
      <line x1={x(v)} x2={x(v)} y1={34} y2={line} stroke="#8a6fc9" strokeWidth={1.8} strokeDasharray="3 4" />
      <SvgText x={x(v) + (i ? 22 : -22)} y={30} fill="#5b4fb0" fontWeight={800} fontSize={12.5}>{`${i ? 'Q3' : 'Q1'} ${de(v, 0)}`}</SvgText>
    </g>) : null}
    {kasten}
  </svg>;
}

const linealText = (st: Stufe) => {
  const s = [...st.werte].sort((a, b) => a - b), mean = s.reduce((a, b) => a + b, 0) / s.length, [q1, q3] = quartile(s);
  return `${s.length} Personen auf dem Lineal: ${s.join(', ')} Stunden. Mittelwert ${de(mean, 1)}.`
    + (st.median ? ` Median ${de(mitte(s), 0)}.` : '') + (st.quart ? ` Quartile ${de(q1, 0)} und ${de(q3, 0)}.` : '')
    + (st.kasten ? (st.grenze ? ' Box von 34 bis 43, Whisker von 28 bis 45, die 0 ist ein Ausreißer-Punkt.' : ' Box von 34 bis 43, Whisker von 22 bis 45.') : '');
};

/** Vom Lineal zum Boxplot in sechs Schritten, ohne Frage: Die beiden „Was wäre, wenn“-Fälle sind eigene Schritte. */
export function LinealZumBoxplot() {
  const [i, setI] = useState(0); const st = STUFEN[i];
  return <>
    <ul className="schritt-nav" aria-label="Schritte vom Lineal zum Boxplot">
      {STUFEN.map((x, k) => <li key={x.name}><button type="button" aria-current={k === i ? 'step' : 'false'} onClick={() => setI(k)}>{`${k + 1}: ${x.name}`}</button></li>)}
    </ul>
    <div className="grafik" role="img" aria-label={linealText(st)}><Lineal st={st} /></div>
    <div className="erkl" aria-live="polite">{st.text}</div>
  </>;
}

/** Dieselben zwei Mittelwerte zweimal: Achse ab 0 und Achse ab 7. */
export function AchseVergleich() {
  const W = 7.44, O = 7.18;
  const tafel = (x0: number, start: number, titel: string) => {
    const ende = start === 0 ? 10 : 7.5, top = 34, ih = 150, y = (v: number) => top + ih - (v - start) / (ende - start) * ih;
    const ticks = start === 0 ? [0, 2, 4, 6, 8, 10] : [7, 7.1, 7.2, 7.3, 7.4, 7.5];
    return <g>
      <SvgText x={x0 + 120} y={18} fontSize={14} fill="#1E2D3C" fontWeight={800}>{titel}</SvgText>
      {ticks.map(t => <g key={t}><line x1={x0 + 30} x2={x0 + 230} y1={y(t)} y2={y(t)} stroke="#EFE6DA" /><SvgText x={x0 + 20} y={y(t) + 4} fontSize={11} textAnchor="end">{de(t, start === 0 ? 0 : 1)}</SvgText></g>)}
      {[[W, 'West'], [O, 'Ost']].map(([v, n], k) => <g key={k}>
        <rect x={x0 + 55 + k * 95} y={y(v as number)} width={60} height={top + ih - y(v as number)} rx={4} fill={k ? '#BFE3F7' : '#FFD2BC'} stroke={k ? '#2C6CA8' : '#c97b55'} strokeWidth={1.5} />
        <SvgText x={x0 + 85 + k * 95} y={y(v as number) - 6} fontSize={12} fill="#1E2D3C" fontWeight={800}>{de(v as number, 2)}</SvgText>
        <SvgText x={x0 + 85 + k * 95} y={top + ih + 18} fontSize={12.5} fill="#1E2D3C">{n as string}</SvgText>
      </g>)}
      <line x1={x0 + 30} x2={x0 + 230} y1={top + ih} y2={top + ih} stroke="#1E2D3C" strokeWidth={1.5} />
    </g>;
  };
  return <div className="grafik" role="img" aria-label="Zwei Balkengrafiken mit denselben Mittelwerten der Lebenszufriedenheit, West 7,44 und Ost 7,18. Links beginnt die Achse bei 0: Die Balken sind fast gleich lang. Rechts beginnt die Achse bei 7 und endet bei 7,5: Der West-Balken wirkt mehr als doppelt so lang wie der Ost-Balken.">
    <svg viewBox="0 0 520 210" width="100%" aria-hidden="true" focusable="false">{tafel(0, 0, 'Achse beginnt bei 0')}{tafel(270, 7, 'Achse beginnt bei 7')}</svg>
  </div>;
}

/* ---------- Vom Turm zum Stapel, am Beispiel hs01 (Aufgabe 1) ---------- */
const KAT = ['sehr gut', 'gut', 'zufriedenstellend', 'weniger gut', 'schlecht', 'NA'] as const;
const KURZ = ['sehr gut', 'gut', 'zufriedenst.', 'weniger gut', 'schlecht', 'NA'];
const FARBE: [string, string][] = [['#BFE3F7', '#2C6CA8'], ['#CDEFD9', '#2f7a4f'], ['#FFE7A3', '#a07a10'], ['#FFD2BC', '#c97b55'], ['#E6D3F2', '#8a6fc9'], ['#fff', '#8a949e']];
/** Zwölf Befragte, wie sie im Datensatz untereinander stehen (Index in KAT). */
const TURM = [1, 2, 0, 5, 2, 1, 3, 2, 0, 1, 4, 2];
const TZ_SCHRITTE: { name: string; text: ReactNode; bild: string }[] = [
  { name: 'Die Variable', bild: 'Die Variable hs01 als Turm aus zwölf Steinen, ein Stein je Fall, in der Reihenfolge des Datensatzes. Auf jedem Stein steht der Wert als Wort. Ein Stein ist leer und gestrichelt: NA.',
    text: <>In R ist <code>hs01</code> eine <b>Variable</b>, im Bild ein Turm: ein Stein je <b>Fall</b>, also je befragter Person, hier zum Beispiel zwölf. Nach <code>to_label()</code> steht auf jedem Stein ein Wort statt eines Codes. Ein Stein ist leer: Diese Person hat keine gültige Antwort, in R <code>NA</code>.</> },
  { name: 'Sortieren', bild: 'Die zwölf Steine (Werte) sind nach ihrer Antwort auf sechs Stapel verteilt, ein Stapel je Antwort, seine Höhe ist ihre Häufigkeit: sehr gut 2, gut 3, zufriedenstellend 4, weniger gut 1, schlecht 1, NA 1.',
    text: <><code>geom_bar()</code> sortiert die Steine nach ihrer Antwort und legt gleiche aufeinander. Die Reihenfolge auf der Achse kommt von den Codes: 1 heißt „sehr gut“, 5 heißt „schlecht“. Der leere Stein bekommt einen eigenen Stapel: <b>NA</b>.</> },
  { name: 'Zählen', bild: 'Dieselben Stapel mit einer y-Achse count von 0 bis 4 und der absoluten Häufigkeit über jedem Stapel: 2, 3, 4, 1, 1 und 1 bei NA.',
    text: <>Die Höhe jedes Stapels ist die Zahl der Personen, die <b>absolute Häufigkeit</b>. Genau das zeigt die y-Achse: <code>count</code>. So sieht deine Grafik nach <b>Schritt 2</b> der Aufgabe aus, nur mit 5.246 statt zwölf Personen.</> },
  { name: 'Fehlende weglassen', bild: 'Der Stapel NA mit dem fehlenden Wert ist verschwunden. Fünf Stapel bleiben, ihre Häufigkeiten ergeben zusammen elf.',
    text: <><code>drop_na(hs01)</code> nimmt den leeren Stein heraus, <b>bevor</b> gezeichnet wird. Der Stapel NA verschwindet. Übrig bleiben elf gültige Antworten: <b>n = 11</b>. Das ist <b>Schritt 3</b> der Aufgabe.</> },
  { name: 'Anteil', bild: 'Der Stapel zufriedenstellend ist hervorgehoben: absolute Häufigkeit 4 von 11 gültigen Werten, etwa 36 Prozent.',
    text: <>Wie groß ist ein Stapel im Vergleich zu allen? Teil die Steine im Stapel durch alle gültigen Steine: 4 von 11 sagen „zufriedenstellend“, das sind etwa 36 %. Das ist die <b>relative Häufigkeit</b>. Der leere Stein zählt nicht mit, er ist ja keine Antwort.</> },
];

export function TurmZumStapel() {
  const [s, setS] = useState(0);
  const basis = 236, h = 18, sw = 62, spalte = (k: number) => 130 + k * 74, nachKat: number[] = [0, 0, 0, 0, 0, 0];
  const steine = TURM.map((k, i) => {
    const imStapel = nachKat[k]++;
    const x = s === 0 ? 40 : spalte(k) - sw / 2, y = s === 0 ? basis - (i + 1) * h : basis - (imStapel + 1) * h;
    const weg = k === 5 && s >= 3, blass = s === 4 && k !== 2;
    return <g key={i} className="tz-stein" style={{ transform: `translate(${x}px, ${y}px)`, opacity: weg ? 0 : blass ? 0.35 : 1 }}>
      <rect width={sw} height={h - 2} rx={4} fill={FARBE[k][0]} stroke={FARBE[k][1]} strokeWidth={s === 4 && k === 2 ? 2.4 : 1.4} strokeDasharray={k === 5 ? '4 3' : undefined} />
      {s === 0 ? <SvgText x={sw / 2} y={12} fontSize={10.5} fill="#1E2D3C" fontWeight={700}>{KURZ[k]}</SvgText> : null}
    </g>;
  });
  const zahl = [2, 3, 4, 1, 1, 1];
  return <>
    <ul className="schritt-nav" aria-label="Von der Variable zur Häufigkeit">
      {TZ_SCHRITTE.map((x, k) => <li key={x.name}><button type="button" aria-current={k === s ? 'step' : 'false'} onClick={() => setS(k)}>{`${k + 1}: ${x.name}`}</button></li>)}
    </ul>
    <div className="grafik tz" role="img" aria-label={TZ_SCHRITTE[s].bild}>
      <svg viewBox={s === 0 ? '18 0 106 240' : '44 108 516 186'} width="100%" style={s === 0 ? { maxWidth: 190, display: 'block', margin: '0 auto' } : undefined} aria-hidden="true" focusable="false">
        {s === 0 ? <SvgText x={71} y={basis - 12 * h - 8} fontSize={13} fill="#1E2D3C" fontWeight={800}>hs01</SvgText> : null}
        {s >= 1 ? <>
          <line x1={88} x2={spalte(5) + 40} y1={basis} y2={basis} stroke="#1E2D3C" strokeWidth={1.5} />
          {KAT.map((n, k) => (k === 5 && s >= 3) ? null : <g key={n}>
            {n === 'zufriedenstellend'
              ? <><SvgText x={spalte(k)} y={basis + 17} fontSize={13}>zufrieden-</SvgText><SvgText x={spalte(k)} y={basis + 32} fontSize={13}>stellend</SvgText></>
              : <SvgText x={spalte(k)} y={basis + 17} fontSize={13}>{n}</SvgText>}
          </g>)}
        </> : null}
        {s >= 2 ? <>
          <line x1={92} x2={92} y1={basis} y2={basis - 4 * h - 6} stroke="#1E2D3C" strokeWidth={1.2} />
          {[0, 1, 2, 3, 4].map(t => <g key={t}><line x1={88} x2={92} y1={basis - t * h} y2={basis - t * h} stroke="#1E2D3C" /><SvgText x={83} y={basis - t * h + 4} fontSize={12} textAnchor="end">{String(t)}</SvgText></g>)}
          <SvgText x={60} y={basis - 2 * h} fontSize={11} transform={`rotate(-90 60 ${basis - 2 * h})`}>count</SvgText>
          {zahl.map((z, k) => (k === 5 && s >= 3) ? null : <SvgText key={k} x={spalte(k)} y={basis - z * h - 8} fontSize={16} fill="#1E2D3C" fontWeight={800}>{String(z)}</SvgText>)}
        </> : null}
        {steine}
        {s >= 3 ? <SvgText x={spalte(5)} y={basis - 8} fontSize={15} fill="#a0452f" fontWeight={800}>n = 11</SvgText> : null}
      </svg>
    </div>
    {s === 4 ? <div className="formel" role="group" aria-label="Formel für die relative Häufigkeit">
      <span><b>Anteil</b> „zufriedenstellend“</span><span aria-hidden="true">=</span>
      <span className="frac" aria-hidden="true"><span>Steine im Stapel</span><span>alle gültigen Steine</span></span><span aria-hidden="true">=</span>
      <span className="frac" aria-hidden="true"><span>4</span><span>11</span></span><span aria-hidden="true">≈</span><span className="gross" aria-hidden="true">36 %</span>
      <span className="sr-only">Anteil zufriedenstellend gleich absolute Häufigkeit, also Steine im Stapel, geteilt durch alle gültigen Werte: 4 geteilt durch 11, also etwa 36 Prozent.</span>
    </div> : null}
    <div className="erkl" aria-live="polite">{TZ_SCHRITTE[s].text}</div>
  </>;
}
