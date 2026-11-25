// Sitzung 8, Thema 4 und Überblick: B9 (Ausgleich), B10 (Inglehart), Ü1 (fünf Schritte), Ü2 (Welcher Index?).
import { useEffect, useRef, useState } from 'react';
import { ALT, INGLE_GOALS, INGLE_NOT_GENERATED, INGLE_SHARES, INGLE_TYPES, type IngleGoal } from '../content';
import { BLUE, GRAY, GREEN, INK, ORANGE, Pic, Stone, Svg, T, de } from './kit';

/* ---------- B9 s8-ausgleich ---------- */

/** Bild B9: zwei Befragte mit gleichem Mittelwert; nur eine stimmt allen drei Aussagen zu. */
export function Balance() {
  const rows = [{ name: 'A', values: [1, 1, 4], all: false }, { name: 'B', values: [2, 2, 2], all: true }];
  const ry = (i: number) => 50 + i * 64;
  return <Pic alt={ALT.ausgleich} caption={<>Beide haben den Mittelwert 2. Die Regel „allen zugestimmt“ erfüllt nur Person B. <span>Die Werte sind ein Beispiel mit zwei Befragten.</span></>}>
    <Svg w={700} h={190}>
      <T x={430} y={30} fill={INK} fontWeight={700}>Mittelwert</T>
      <T x={580} y={30} fill={INK} fontWeight={700}>allen zugestimmt (1 oder 2)?</T>
      {rows.map((r, i) => <g key={r.name}>
        <T x={30} y={ry(i) + 19} fill={INK} fontWeight={700}>{r.name}</T>
        {r.values.map((v, j) => {
          const odd = r.name === 'A' && v === 4;
          return <g key={j}>
            <Stone x={60 + j * 74} y={ry(i)} w={56} h={28} value={String(v)} label={v === 4 ? 'LEHNE EHER AB' : v === 2 ? 'STIMME EHER ZU' : 'STIMME VOLL ZU'} />
            {odd ? <rect x={60 + j * 74 - 4} y={ry(i) - 4} width={64} height={36} rx={7} fill="none" stroke={ORANGE} strokeWidth={2.5} /> : null}
          </g>;
        })}
        <Stone x={400} y={ry(i)} w={60} h={28} value="2" fill={GREEN.fill} stroke={GREEN.stroke} />
        <Stone x={550} y={ry(i)} w={60} h={28} value={r.all ? 'ja' : 'nein'} fill={r.all ? GREEN.fill : '#E5E9EE'} stroke={r.all ? GREEN.stroke : GRAY} />
      </g>)}
    </Svg>
  </Pic>;
}

/* ---------- B10 s8-inglehart ---------- */

/** Type of an order of the four goals: places 1 and 2 decide. */
export function ingleType(order: IngleGoal[]) {
  const key = `${order[0].kind}${order[1].kind}` as keyof typeof INGLE_TYPES;
  return INGLE_TYPES[key];
}
export const ingleText = (order: IngleGoal[]) => `Platz 1: ${order[0].text}, Platz 2: ${order[1].text} → Typ: ${ingleType(order).name}.`;
const TYPE_ORDER = [INGLE_TYPES.PP, INGLE_TYPES.PM, INGLE_TYPES.MP, INGLE_TYPES.MM];
export const INGLE_DISTRIBUTION = `So verteilen sich die Befragten (gewichtet): Postmaterialisten ${de(INGLE_SHARES[0], 2)} %, postmaterialistischer Mischtyp ${de(INGLE_SHARES[1], 2)} %, materialistischer Mischtyp ${de(INGLE_SHARES[2], 2)} %, Materialisten ${de(INGLE_SHARES[3], 2)} %. Bei wenigen Befragten (gewichtete Anzahl ${INGLE_NOT_GENERATED}) war keine Zuordnung möglich.`;

/** Inglehart: vier Ziele mit Knöpfen ordnen; Platz 1 und 2 ergeben den Typ; darunter die Verteilung im ALLBUS. */
export function Inglehart() {
  const [order, setOrder] = useState<IngleGoal[]>(INGLE_GOALS);
  const buttons = useRef(new Map<string, HTMLButtonElement | null>());
  const pending = useRef<string | null>(null);
  // Moving a card moves its DOM node; keep the focus on the pressed button, or on its partner once it is disabled at the edge.
  useEffect(() => {
    const key = pending.current;
    if (!key) return;
    pending.current = null;
    const [id, dir] = key.split(':');
    const b = buttons.current.get(key);
    (b && !b.disabled ? b : buttons.current.get(`${id}:${dir === 'up' ? 'down' : 'up'}`))?.focus();
  });
  const move = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= order.length) return;
    const next = [...order];
    [next[i], next[j]] = [next[j], next[i]];
    pending.current = `${order[i].id}:${d < 0 ? 'up' : 'down'}`;
    setOrder(next);
  };
  const type = ingleType(order);
  let left = 0;
  return <div className="s8-ingle">
    <ol className="s8-plaetze">{order.map((g, i) => <li key={g.id} className={`${g.kind === 'M' ? 'm' : 'p'}${i < 2 ? ' zaehlt' : ''}`}>
      <span className="s8-platz" aria-hidden="true">{i + 1}</span>
      <span className="s8-ziel"><b aria-hidden="true" className="s8-mp">{g.kind}</b>{` ${g.text} `}<span className="sr-only">{`(${g.id}, ${g.kind === 'M' ? 'materialistisch' : 'postmaterialistisch'}${i < 2 ? ', zählt' : ''})`}</span></span>
      {i < 2 ? <span className="s8-zaehlt" aria-hidden="true">zählt</span> : null}
      <span className="s8-pfeile">
        <button type="button" disabled={i === 0} aria-label={`${g.text} nach oben`} ref={el => { buttons.current.set(`${g.id}:up`, el); }}
          onClick={() => move(i, -1)}>nach oben</button>
        <button type="button" disabled={i === order.length - 1} aria-label={`${g.text} nach unten`} ref={el => { buttons.current.set(`${g.id}:down`, el); }}
          onClick={() => move(i, 1)}>nach unten</button>
      </span>
    </li>)}</ol>
    <p className="rueck text" aria-live="polite">{ingleText(order)}</p>
    <p className="hilfe-zeile">{INGLE_DISTRIBUTION}</p>
    <div className="grafik">
      <Svg w={700} h={56}>
        {TYPE_ORDER.map((t, i) => {
          const wdt = INGLE_SHARES[i] / 100 * 680, x = 10 + left;
          left += wdt;
          const on = t.code === type.code;
          return <g key={t.code}>
            <rect x={x} y={8} width={wdt - 2} height={38} rx={4} fill={on ? '#FFE7A3' : i < 2 ? GREEN.fill : BLUE.fill} stroke={on ? '#C9921C' : i < 2 ? GREEN.stroke : BLUE.stroke} strokeWidth={on ? 3 : 1} />
            <T x={x + wdt / 2} y={25} fontSize={10.5} fill={INK} fontWeight={on ? 800 : 600}>{t.name.replace('postmaterialistischer', 'postmat.').replace('materialistischer', 'mat.')}</T>
            <T x={x + wdt / 2} y={40} fontSize={11} fill={INK}>{`${de(INGLE_SHARES[i], 2)} %`}</T>
          </g>;
        })}
      </Svg>
    </div>
    <table className="daten">
      <caption>Regel des Inglehart-Index</caption>
      <thead><tr><th scope="col">Platz 1</th><th scope="col">Platz 2</th><th scope="col">Typ (ingle)</th></tr></thead>
      <tbody>{(['PP', 'PM', 'MP', 'MM'] as const).map(k => <tr key={k}><td>{k[0]}</td><td>{k[1]}</td><td>{`${INGLE_TYPES[k].name} (${INGLE_TYPES[k].code})`}</td></tr>)}</tbody>
    </table>
  </div>;
}

/* ---------- Ü1 s8-ablauf ---------- */

const FLOW: [string, string][] = [
  ['Items lesen: Was messen sie, wofür steht die 1?', 'frequency()'],
  ['Gleiche Richtung herstellen', 'rec(…, rules = "rev")'],
  ['Reliabilität prüfen: α, Trennschärfen', 'reliability() + summary()'],
  ['Index bilden: Regel für fehlende Antworten', 'row_means(pick(…), min_valid = …)'],
  ['Beschreiben und deuten, mit Gewicht', 'describe(…, weights = wghtpew)'],
];

/** Bild Ü1: fünf Schritte vom Item zum Index (eine geordnete Liste, die Textfassung liest der Screenreader als Namen). */
export function Flow() {
  return <ol className="s8-ablauf" aria-label="Fünf Schritte vom Item zum Index">
    {FLOW.map(([t, f], i) => <li key={t}>
      <span className="st m c2" aria-hidden="true">{i + 1}</span>
      <span>{t}</span>
      <code>{f}</code>
    </li>)}
  </ol>;
}

/* ---------- Ü2 s8-welcher-index ---------- */

const STROKE = '#978B7B';
function Box({ x, y, w, h = 44, lines, sub, leaf = false, gray = false }: { x: number; y: number; w: number; h?: number; lines: string[]; sub?: string; leaf?: boolean; gray?: boolean }) {
  const fill = gray ? '#EEF0F2' : leaf ? GREEN.fill : '#fff', stroke = gray ? GRAY : leaf ? GREEN.stroke : INK;
  return <g>
    <rect x={x - w / 2} y={y} width={w} height={h} rx={leaf ? 8 : 12} fill={fill} stroke={stroke} strokeWidth={2} />
    {lines.map((l, k) => <T key={k} x={x} y={y + 17 + k * 15} fill={INK} fontWeight={k === 0 && leaf ? 800 : 700} fontSize={12}>{l}</T>)}
    {sub ? <T x={x} y={y + h - 8} fontFamily="JetBrains Mono,monospace" fontSize={10.5} fill="#5b4fb0">{sub}</T> : null}
  </g>;
}
const Arrow = ({ x1, y1, x2, y2, label, lx, ly }: { x1: number; y1: number; x2: number; y2: number; label: string; lx: number; ly: number }) => <g>
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={STROKE} strokeWidth={2} markerEnd="url(#s8-pfeil)" />
  <T x={lx} y={ly} fontSize={11.5} fontWeight={800} fill={label === 'ja' ? GREEN.stroke : ORANGE}>{label}</T>
</g>;

/** Bild Ü2: Entscheidungsbaum „Welcher Index?“ mit Textfassung (einmal gelesen, als Name des Bildes). */
export function WhichIndex() {
  return <>
    <div className="grafik" role="img" aria-labelledby="s8-baum-text">
      <Svg w={760} h={420}>
        <defs><marker id="s8-pfeil" viewBox="0 0 10 10" refX={9} refY={5} markerWidth={7} markerHeight={7} orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 Z" fill={STROKE} /></marker></defs>
        <Box x={260} y={10} w={480} lines={['Darf eine hohe Antwort bei einem Item eine niedrige', 'bei einem anderen ausgleichen?']} />
        <Arrow x1={500} y1={32} x2={580} y2={32} label="nein" lx={540} ly={26} />
        <Box x={670} y={4} w={176} h={98} leaf lines={['Kombinationsindex', 'feste Regel, etwa', '„allen zugestimmt“', 'oder ein Typ aus Rängen']} sub="rec() + row_sums()" />
        <T x={670} y={118} fontSize={10.5} fill={GRAY}>Inglehart-Index,</T>
        <T x={670} y={131} fontSize={10.5} fill={GRAY}>durchgehend populistisch</T>
        <Arrow x1={260} y1={54} x2={260} y2={136} label="ja" lx={276} ly={100} />
        <Box x={260} y={138} w={330} lines={['Zeigen alle Items in dieselbe Richtung?']} h={36} />
        <Arrow x1={425} y1={156} x2={508} y2={156} label="nein" lx={466} ly={150} />
        <Box x={598} y={140} w={176} h={50} lines={['erst umpolen']} sub={'rec(…, rules = "rev")'} />
        <path d={`M598,190 C598,216 470,216 430,172`} fill="none" stroke={STROKE} strokeWidth={2} markerEnd="url(#s8-pfeil)" />
        <Arrow x1={260} y1={174} x2={260} y2={246} label="ja" lx={276} ly={214} />
        <Box x={260} y={248} w={420} lines={['Hängen die Items eng genug zusammen', '(α, Trennschärfen)?']} />
        <Arrow x1={470} y1={270} x2={540} y2={270} label="nein" lx={505} ly={264} />
        <Box x={640} y={244} w={200} h={64} gray lines={['Items und Begriff überdenken:', 'ein Item zu viel?', 'zwei Dimensionen?']} />
        <Arrow x1={260} y1={292} x2={260} y2={334} label="ja" lx={276} ly={318} />
        <Box x={260} y={336} w={300} h={50} leaf lines={['Mittelwertindex']} sub="row_means(pick(…), min_valid = …)" />
        <T x={260} y={404} fontSize={10.5} fill={GRAY}>Populismus, Haltung zu Geflüchteten</T>
      </Svg>
    </div>
    {/* Read once, as the name of the picture (aria-labelledby works on hidden elements). */}
    <div id="s8-baum-text" className="sr-only" aria-hidden="true">{ALT.welcherIndex}</div>
  </>;
}
