// Thema 3 „Geordnete Kategorien“: Paar-Zähler (s6-paare), Gamma und Tau-b in Bausteinen (s6-gamma-bausteine),
// Gesundheit je Schicht (s6-schicht-stapel), Richtung und Kodierung (s6-richtung), Vorzeichen lesen (s6-vorzeichen-lesen).
import { useState } from 'react';
import { CAT, CAT_DARK, ROLE, ordered } from '../../../tasks/kit/palette';
import { useAnnounce } from '../../blocks/announce';
import { ALT, HEALTH_LEVELS, LAYER_STACK, PERSONS, type PairKind } from '../content';
import { Picture, Ruler, SvgText, Toggle, de, whole } from './util';

type Person = (typeof PERSONS)[number];
export type Pair = { id: string; a: Person; b: Person; kind: PairKind };

/** Die zehn Paare in der Reihenfolge AB, AC, …, DE mit ihrer Einordnung. */
export const PAIRS: Pair[] = PERSONS.flatMap((a, i) => PERSONS.slice(i + 1).map(b => {
  const dx = Math.sign(b.layer - a.layer), dy = Math.sign(b.health - a.health);
  const kind: PairKind = dx === 0 ? 'Bindung Schicht' : dy === 0 ? 'Bindung Gesundheit' : dx === dy ? 'konkordant' : 'diskordant';
  return { id: a.name + b.name, a, b, kind };
}));

/** Rückmeldesatz zu einem Paar (richtig eingeordnet). */
export function pairSentence(p: Pair): string {
  const hi = p.a.layer > p.b.layer ? p.a : p.b;
  if (p.kind === 'konkordant') return `${hi.name} hat die höhere Schicht und die bessere Gesundheit: konkordant (gleichläufig).`;
  if (p.kind === 'diskordant') return `${hi.name} hat die höhere Schicht, aber die schlechtere Gesundheit: diskordant (gegenläufig).`;
  if (p.kind === 'Bindung Schicht') return `${p.a.name} und ${p.b.name} haben dieselbe Schicht: eine Bindung (Gleichstand), keine Richtung erkennbar.`;
  return `${p.a.name} und ${p.b.name} haben dieselbe Gesundheit: eine Bindung (Gleichstand).`;
}
const WRONG = 'Vergleiche zuerst die Schicht: Wer liegt höher? Hat diese Person auch die bessere Gesundheit?';
type Choice = 'konkordant' | 'diskordant' | 'Bindung';
const matches = (p: Pair, c: Choice) => c === 'Bindung' ? p.kind.startsWith('Bindung') : p.kind === c;

export function pairCounts(done: Record<string, true>) {
  const of = (k: PairKind) => PAIRS.filter(p => done[p.id] && p.kind === k).length;
  return { con: of('konkordant'), dis: of('diskordant'), tieLayer: of('Bindung Schicht'), tieHealth: of('Bindung Gesundheit') };
}
export const END_TEXT = 'Endstand: 6 konkordant, 2 diskordant, 1 Bindung bei der Schicht, 1 bei der Gesundheit.';

function Raster({ pair }: { pair: Pair | null }) {
  const w = 300, h = 260, l = 46, b = 40, step = 52;
  const x = (v: number) => l + (v - 0.5) * step, y = (v: number) => h - b - (v - 0.5) * step;
  const on = (p: Person) => !!pair && (pair.a === p || pair.b === p);
  return <svg viewBox={`0 0 ${w} ${h}`} width="100%" aria-hidden="true" focusable="false">
    {[1, 2, 3, 4].map(v => <g key={v}>
      <SvgText x={x(v)} y={h - b + 18} fontSize={12}>{String(v)}</SvgText>
      <SvgText x={l - 14} y={y(v) + 4} fontSize={12}>{String(v)}</SvgText>
      <line x1={x(v)} x2={x(v)} y1={y(4.5)} y2={y(0.5)} stroke="#eee8dc" />
      <line x1={x(0.5)} x2={x(4.5)} y1={y(v)} y2={y(v)} stroke="#eee8dc" />
    </g>)}
    <line x1={x(0.5)} x2={x(4.5)} y1={y(0.5)} y2={y(0.5)} stroke="#1E2D3C" strokeWidth={1.5} />
    <line x1={x(0.5)} x2={x(0.5)} y1={y(0.5)} y2={y(4.5)} stroke="#1E2D3C" strokeWidth={1.5} />
    <SvgText x={(x(0.5) + x(4.5)) / 2} y={h - 6} fontSize={12} fontWeight={700}>Schicht</SvgText>
    <SvgText x={12} y={(y(0.5) + y(4.5)) / 2} fontSize={12} fontWeight={700} transform={`rotate(-90 12 ${(y(0.5) + y(4.5)) / 2})`}>Gesundheit</SvgText>
    {pair ? <line x1={x(pair.a.layer)} y1={y(pair.a.health)} x2={x(pair.b.layer)} y2={y(pair.b.health)} stroke={ROLE.data} strokeWidth={3} /> : null}
    {PERSONS.map(p => <g key={p.name}>
      <rect x={x(p.layer) - 15} y={y(p.health) - 15} width={30} height={30} rx={6} fill={on(p) ? ROLE.dataLight : '#FFE7A3'} stroke={on(p) ? ROLE.data : '#EFC867'} strokeWidth={on(p) ? 3 : 1.5} />
      <SvgText x={x(p.layer)} y={y(p.health) + 5} fontSize={15} fontWeight={800} fill="#1E2D3C">{p.name}</SvgText>
    </g>)}
  </svg>;
}

/** 3a: Paar-Zähler. Ein Paar wählen, einordnen; Zähler und Rückmeldung per aria-live; „Alle zeigen“ ordnet alles ein. */
export function PairCounter() {
  const [selected, setSelected] = useState<string | null>(null);
  const [done, setDone] = useState<Record<string, true>>({});
  const [message, announce] = useAnnounce('', '');
  const [ok, setOk] = useState<boolean | null>(null);
  const pair = PAIRS.find(p => p.id === selected) ?? null;
  const c = pairCounts(done), all = PAIRS.every(p => done[p.id]);

  function classify(choice: Choice) {
    if (!pair) { setOk(false); announce('Wähle zuerst ein Paar.'); return; }
    if (matches(pair, choice)) {
      const next = { ...done, [pair.id]: true as const };
      setDone(next);
      setOk(true);
      announce(`${pairSentence(pair)}${PAIRS.every(p => next[p.id]) ? ` ${END_TEXT}` : ''}`);
    } else { setOk(false); announce(WRONG); }
  }

  function showAll() {
    setDone(Object.fromEntries(PAIRS.map(p => [p.id, true as const])));
    setOk(true);
    announce(END_TEXT);
  }

  return <div className="s6-paare">
    <div className="s6-paare-grid">
      <div className="grafik"><Raster pair={pair} /></div>
      <div>
        <p className="s6-zaehler" aria-live="off">{`konkordant ${c.con}, diskordant ${c.dis}, Bindung bei Schicht ${c.tieLayer}, Bindung bei Gesundheit ${c.tieHealth}`}</p>
        <div className="s6-umschalter" role="group" aria-label="Paar wählen">
          {PAIRS.map(p => <button key={p.id} type="button" className="knopf hell" aria-pressed={p.id === selected}
            onClick={() => setSelected(p.id)}>{p.id}{done[p.id] ? <span aria-label=", eingeordnet"> ✓</span> : null}</button>)}
        </div>
        <div className="s6-umschalter" role="group" aria-label={pair ? `Paar ${pair.id} einordnen` : 'Paar einordnen'}>
          {(['konkordant', 'diskordant', 'Bindung'] as Choice[]).map(k => <button key={k} type="button" className="knopf" onClick={() => classify(k)}>{k}</button>)}
        </div>
        <div className="reihe-knoepfe"><button type="button" className="knopf hell" onClick={showAll}>Alle zeigen</button></div>
      </div>
    </div>
    <p className={`rueck${ok === null ? '' : ok ? ' ok' : ' no'}`} aria-live="polite">{message}</p>
    {all ? <p className="s6-endstand">{END_TEXT}</p> : null}
    <details className="werte">
      <summary>Textfassung: Personen und Paare</summary>
      <ul>{PERSONS.map(p => <li key={p.name}>{`${p.name}: Schicht ${p.layer}, Gesundheit ${p.health}`}</li>)}</ul>
      <ul>{PAIRS.map(p => <li key={p.id}>{`${p.id}: ${p.kind}`}</li>)}</ul>
      <p>{END_TEXT}</p>
    </details>
  </div>;
}

/** 3b: Gamma und Tau-b als Bausteine mit den eingesetzten Zahlen. */
export function GammaBricks() {
  return <figure className="ebild s6-bild">
    <div aria-hidden="true">
      <div className="formel">
        <b>Gamma</b><span>=</span>
        <span className="frac"><span>konkordant − diskordant</span><span>konkordant + diskordant</span></span><span>=</span>
        <span className="frac"><span>6 − 2</span><span>6 + 2</span></span><span>=</span><span>4 / 8</span><span>=</span><span className="gross">0,5</span>
        <span className="s6-merke">Paare mit Gleichstand fallen weg.</span>
      </div>
      <div className="formel">
        <b>Tau-b</b><span>=</span>
        <span className="frac"><span>konkordant − diskordant</span><span>√( [konkordant + diskordant + Gleichstand nur bei der Schicht] × [konkordant + diskordant + Gleichstand nur bei der Gesundheit] )</span></span><span>=</span>
        <span className="frac"><span>4</span><span>√(9 × 9)</span></span><span>=</span><span>4 / 9</span><span>=</span><span className="gross">0,44</span>
        <span className="s6-merke">Paare mit Gleichstand zählen mit.</span>
      </div>
      <p className="s6-probe">Zähler: Überwiegen die konkordanten Paare, wird das Maß positiv, überwiegen die diskordanten, negativ.</p>
    </div>
    <ul className="sr-only">
      <li>Gamma gleich konkordant minus diskordant, geteilt durch konkordant plus diskordant. Eingesetzt: 6 minus 2 geteilt durch 6 plus 2, also 4 geteilt durch 8 gleich 0,5. Paare mit Gleichstand fallen weg.</li>
      <li>Tau-b gleich konkordant minus diskordant, geteilt durch die Wurzel aus dem Produkt von zwei Klammern: konkordant plus diskordant plus Gleichstand nur bei der Schicht, mal konkordant plus diskordant plus Gleichstand nur bei der Gesundheit. Eingesetzt: 4 geteilt durch Wurzel aus 9 mal 9, also 4 geteilt durch 9 gleich 0,44. Paare mit Gleichstand zählen mit.</li>
      <li>Zähler: Überwiegen die konkordanten Paare, wird das Maß positiv, überwiegen die diskordanten, negativ.</li>
    </ul>
  </figure>;
}

/** Gesundheit je Schicht (gewichtet) als Balken auf 100 %; die Tabelle ist die Textfassung. */
export function LayerStack() {
  const colors = ordered(5), w = 540, rowH = 34, l = 150, r = 20, top = 8, h = top + LAYER_STACK.length * rowH + 8;
  const x = (v: number) => l + v / 100 * (w - l - r);
  return <figure className="ebild s6-bild">
    <div className="grafik" aria-hidden="true">
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" focusable="false">
        {LAYER_STACK.map((row, i) => {
          let acc = 0;
          return <g key={row.label}>
            <SvgText x={l - 8} y={top + i * rowH + 20} textAnchor="end" fontSize={13.5} fill="#1E2D3C" fontWeight={700}>{row.label}</SvgText>
            {row.pct.map((v, k) => {
              const x0 = x(acc); acc += v;
              return <rect key={k} x={x0} y={top + i * rowH + 4} width={Math.max(0, x(acc) - x0)} height={rowH - 10} fill={colors[k]} stroke="#fff" strokeWidth={0.8} />;
            })}
          </g>;
        })}
      </svg>
      <p className="legende">{HEALTH_LEVELS.map((s, k) => <span key={s}><i style={{ background: colors[k] }} />{s}</span>)}</p>
    </div>
    <figcaption>ALLBUS 2023, gewichtet. Je höher die Schicht, desto größer der Teil rechts: gut und sehr gut.</figcaption>
    <details className="werte">
      <summary>Werte als Tabelle</summary>
      <table className="daten">
        <caption>Gesundheit je Schicht in Prozent, gewichtet</caption>
        <thead><tr><th scope="col">Schicht</th>{HEALTH_LEVELS.map(s => <th scope="col" key={s}>{s}</th>)}<th scope="col">n</th></tr></thead>
        <tbody>{LAYER_STACK.map(row => <tr key={row.label}><th scope="row">{row.label}</th>{row.pct.map((v, k) => <td key={k}>{de(v, 1)}</td>)}<td>{whole(row.n)}</td></tr>)}</tbody>
      </table>
    </details>
  </figure>;
}

type Coding = 'data' | 'flipped';
const CODING_TEXT: Record<Coding, { label: string; gamma: number; tau: number; text: string }> = {
  data: { label: 'Gesundheit wie im Datensatz (1 = sehr gut)', gamma: -0.36, tau: -0.24, text: 'Negativ: Höhere Schicht geht mit kleineren Gesundheitscodes einher. Kleinere Codes heißen hier bessere Gesundheit.' },
  flipped: { label: 'Gesundheit umgedreht (höher = besser)', gamma: 0.36, tau: 0.24, text: 'Positiv: Je höher die Schicht, desto besser im Schnitt die Gesundheit. Derselbe Zusammenhang, nur das Vorzeichen hat sich gedreht.' },
};
export const directionText = (c: Coding) => `Gamma ${de(CODING_TEXT[c].gamma, 2)}, Tau-b ${de(CODING_TEXT[c].tau, 2)}. ${CODING_TEXT[c].text}`;

/** 3c: Schalter für die Kodierung der Gesundheit; Gamma und Tau-b als Marken auf dem Lineal von −1 bis +1. */
export function Direction() {
  const [c, setC] = useState<Coding>('data');
  const t = CODING_TEXT[c];
  return <div className="s6-richtung">
    <Toggle label="Kodierung der Gesundheit" value={c} onChange={setC}
      options={(['data', 'flipped'] as Coding[]).map(v => ({ value: v, label: CODING_TEXT[v].label }))} />
    <div className="grafik">
      <Ruler from={-1} to={1} ticks={[-1, -0.5, 0, 0.5, 1]} marks={[
        { value: t.gamma, label: `Gamma ${de(t.gamma, 2)}`, color: CAT_DARK[0], row: 1 },
        { value: t.tau, label: `Tau-b ${de(t.tau, 2)}`, color: CAT[1], shape: 'diamond' },
      ]} height={130} />
    </div>
    <p className="rueck text" aria-live="polite">{directionText(c)}</p>
    <p className="sr-only">{`Textfassung beider Stellungen. ${CODING_TEXT.data.label}: ${directionText('data')} ${CODING_TEXT.flipped.label}: ${directionText('flipped')}`}</p>
  </div>;
}

/** Am Schritt von Aufgabe 3: zwei senkrechte Pfeile mit den Codes beider Variablen, ohne Zahlen der Lösung. */
export function SignSchema() {
  const arrow = (x: number, name: string, low: string, high: string, color: string) => <g>
    <SvgText x={x} y={18} fontWeight={800} fill="#1E2D3C" fontFamily="JetBrains Mono,monospace" fontSize={13}>{name}</SvgText>
    <line x1={x} x2={x} y1={170} y2={44} stroke={color} strokeWidth={4} />
    <path d={`M${x - 10},${50} L${x},${32} L${x + 10},${50} Z`} fill={color} />
    <SvgText x={x} y={190} fontSize={12.5}>{low}</SvgText>
    <SvgText x={x + 16} y={66} textAnchor="start" fontSize={12.5}>{high}</SvgText>
  </g>;
  return <Picture text={ALT.vorzeichen} caption={<>
    <b>positiv:</b> beide Pfeile gehen zusammen nach oben, also: je schlechter die Lage eingeschätzt wird, desto zufriedener.{' '}
    <b>negativ:</b> wenn der eine nach oben geht, geht der andere nach unten, also: je schlechter die Lage eingeschätzt wird, desto unzufriedener.</>}>
    <svg viewBox="0 0 420 200" width="100%" style={{ maxWidth: 460 }} aria-hidden="true" focusable="false">
      {arrow(110, 'zufriedenheit', '1 sehr unzufrieden', '6 sehr zufrieden', CAT_DARK[2])}
      {arrow(300, 'ep01', '1 sehr gut', '5 sehr schlecht', CAT_DARK[3])}
    </svg>
  </Picture>;
}
