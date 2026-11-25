// Interaktive Bilder von Sitzung 2: Bögen zur Bauplatte (1a), Umwandeln (4b), Ablauf (Ü1) und Zellen zuordnen (Ü2).
import { useState, type FormEvent, type ReactNode } from 'react';
import { useChapterState } from '../../ChapterContext';
import { useAnnounce } from '../../blocks/announce';
import { ALT, BOGEN_PLATTE, CELL_KINDS, CELLS, CONVERT_STATES, CONVERT_STONES, type Cell } from '../content';
import { Brick, C, Head, M, PITCH, Plate, Sheet, Svg, T, TickBox } from './bricks';

/** Text with `code` and **bold** parts. */
export function rt(text: string): ReactNode {
  return text.split(/(`[^`]+`|\*\*[^*]+\*\*)/).map((p, i) => p.startsWith('`') ? <code key={i}>{p.slice(1, -1)}</code>
    : p.startsWith('**') ? <b key={i}>{p.slice(2, -2)}</b> : p);
}

/* ---------- Grundlage 1a: vom Bogen zur Zeile ---------- */

const SEX_OPTS = ['ein Mann', 'eine Frau', 'divers'];
const RH_OPTS = ['viel', 'etwas', 'gar nichts'];
/** Crosses on the three sheets: sex option, ls01 value, rh08b option (−1 = no cross). */
const CROSSES: [number, number, number][] = [[1, 8, 2], [0, 0, 1], [1, 7, -1]];

/** The three paper sheets (decorative; the table below is the text version). */
function Sheets() {
  return <Svg w={628} h={236}>
    {CROSSES.map(([sex, ls, rh], k) => {
      const x = 4 + k * 208;
      return <Sheet key={k} x={x} y={4} w={200} h={228} title={`Fragebogen ${k + 1}`}>
        <T x={x + 10} y={42} textAnchor="start" fontSize={11} fontWeight={700} fill="#2B3540">1. Sie sind …</T>
        {SEX_OPTS.map((o, i) => <TickBox key={o} x={x + 12} y={50 + i * 16} label={o} checked={i === sex} size={10} fontSize={10.5} />)}
        <T x={x + 10} y={116} textAnchor="start" fontSize={10.5} fontWeight={700} fill="#2B3540">2. Wie zufrieden mit dem Leben?</T>
        {Array.from({ length: 11 }, (_, i) => <TickBox key={i} x={x + 12 + i * 16} y={124} checked={i === ls} size={10} />)}
        <T x={x + 17} y={148} fontSize={9.5}>0</T>
        <T x={x + 177} y={148} fontSize={9.5}>10</T>
        <T x={x + 10} y={170} textAnchor="start" fontSize={10.5} fontWeight={700} fill="#2B3540">3. Astrologie und Horoskope?</T>
        {RH_OPTS.map((o, i) => <TickBox key={o} x={x + 12} y={178 + i * 16} label={o} checked={i === rh} size={10} fontSize={10.5} />)}
      </Sheet>;
    })}
  </Svg>;
}

/** What the explanation box says about one stone. */
function explain(v: number, r: number): ReactNode {
  const { variable, question, cells } = BOGEN_PLATTE[v];
  const c = cells[r];
  let value: ReactNode;
  if (c.empty) value = <>Hier fehlt der Wert, im Bild ist der Stein leer: Auf Fragebogen {r + 1} steht kein Kreuz. Das ist ein <b>fehlender Wert</b>; das Wertelabel sagt, warum. Mehr dazu in Grundlage 3.</>;
  else if (variable === 'sex') value = <>In der Zelle steht ihr <b>Wert</b>: {c.value}, das Wertelabel heißt {c.label}.</>;
  else if (variable === 'ls01') value = c.label ? <>In der Zelle steht ihr <b>Wert</b>: {c.value}, ganz unzufrieden. Auch die 0 ist eine Antwort.</> : <>In der Zelle steht ihr <b>Wert</b>: {c.value}.</>;
  else value = <>In der Zelle steht ihr <b>Wert</b>: {c.value}, {c.label}.</>;
  return <><b>Zeile {r + 1}</b> ist ein <b>Fall</b>: die Person von Fragebogen {r + 1}. <b>Spalte {variable}</b> ist eine <b>Variable</b>: {question}. {value}</>;
}

const cellName = (c: Cell) => c.empty ? `fehlt, Wertelabel ${c.label}` : c.label ? `${c.value} ${c.label}` : c.value;
const tableCell = (c: Cell) => c.empty ? `fehlt (${c.label})` : c.label ? `${c.value} ${c.label}` : c.value;

/** One stone as a button (HTML, styled as a brick in s02.css). */
function StoneButton({ c, v, r, pressed, onPick }: { c: Cell; v: number; r: number; pressed: boolean; onPick: () => void }) {
  return <button type="button" className={`s2-stein${c.empty ? ' leer' : ''}`} aria-pressed={pressed}
    aria-label={`Zeile ${r + 1}, Variable ${BOGEN_PLATTE[v].variable}: ${cellName(c)}`}
    style={{ gridRow: r + 2, gridColumn: v + 2 }} onClick={onPick}>
    {c.value ? <span className="s2-code">{c.value}</span> : null}
    {c.label ? <span className={`s2-aufkleber${c.empty ? ' blass' : ''}`}>{c.label}</span> : null}
  </button>;
}

/** Grundlage 1a: three sheets become a data matrix (a plate in the picture); every cell is a button and explains case, variable and value. */
export function SheetsToPlate() {
  const [pick, setPick] = useState<{ v: number; r: number } | null>(null);
  return <>
    <div className="s2-bogen-platte">
      <div className="s2-boegen" aria-hidden="true"><Sheets /></div>
      <div className="s2-pfeil" aria-hidden="true">➜</div>
      <div className="s2-platte-wrap">
        <p className="s2-mass" aria-hidden="true">3 × 3</p>
        <div className="s2-platte" role="group" aria-label="Datenmatrix aus den drei Fragebögen: drei Fälle, drei Variablen">
          {BOGEN_PLATTE.map((t, v) => <div key={t.variable} className="s2-kopf" style={{ gridRow: 1, gridColumn: v + 2 }} aria-hidden="true">
            <b>{t.variable}</b><small>{'<dbl+lbl>'}</small>
          </div>)}
          {[0, 1, 2].map(r => <span key={r} className="s2-nr" style={{ gridRow: r + 2, gridColumn: 1 }} aria-hidden="true">{r + 1}</span>)}
          {pick ? <>
            <span className="s2-rahmen-reihe" style={{ gridRow: pick.r + 2, gridColumn: '1 / 5' }} aria-hidden="true" />
            <span className="s2-rahmen-turm" style={{ gridRow: '1 / 5', gridColumn: pick.v + 2 }} aria-hidden="true" />
          </> : null}
          {[0, 1, 2].map(r => BOGEN_PLATTE.map((t, v) => <StoneButton key={`${r}-${v}`} c={t.cells[r]} v={v} r={r}
            pressed={pick?.v === v && pick?.r === r} onPick={() => setPick({ v, r })} />))}
          <span className="s2-grund" style={{ gridRow: 5, gridColumn: '1 / 5' }} aria-hidden="true" />
        </div>
      </div>
    </div>
    <p className="erkl s2-erkl" aria-live="polite">{pick ? explain(pick.v, pick.r) : 'Wähl einen Wert aus, im Bild einen Stein.'}</p>
    <table className="daten">
      <caption>Drei Fragebögen als Datenmatrix</caption>
      <thead><tr><th scope="col">Zeile</th>{BOGEN_PLATTE.map(t => <th key={t.variable} scope="col">{t.variable}</th>)}</tr></thead>
      <tbody>{[0, 1, 2].map(r => <tr key={r}><th scope="row">{r + 1}</th>{BOGEN_PLATTE.map(t => <td key={t.variable}>{tableCell(t.cells[r])}</td>)}</tr>)}</tbody>
    </table>
    <p className="hilfe-zeile">Jede Zeile ist ein Fall, jede Spalte eine Variable, jede Zelle ein Wert. Die Fragebögen sind ein Beispiel mit drei Personen.</p>
  </>;
}

/* ---------- Grundlage 4b: Umwandeln ---------- */

type ConvertId = (typeof CONVERT_STATES)[number]['id'];

/** Text version of the variable sex in one state. */
export function convertText(id: ConvertId): string {
  const type = CONVERT_STATES.find(s => s.id === id)!.type;
  const stones = CONVERT_STONES.map(c => {
    if (c.empty) return id === 'original' ? `ein fehlender Wert mit dem Wertelabel ${c.label}` : 'ein fehlender Wert ohne Wertelabel, NA';
    return id === 'original' ? `${c.value} ${c.label}` : id === 'label' ? c.label : c.value;
  });
  const fallen = id === 'label' ? ' Das Wertelabel KEINE ANGABE liegt abgefallen daneben.' : '';
  return `Variable sex, Typ ${type}: ${stones.join(', ')}.${fallen} Die Werte sind ein Beispiel mit vier Befragten.`;
}

function ConvertTower({ id }: { id: ConvertId }) {
  const type = CONVERT_STATES.find(s => s.id === id)!.type;
  return <Svg w={420} h={196}>
    <Head x={110} y={20} name="sex" type={type} />
    {CONVERT_STONES.map((c, i) => {
      const y = 50 + i * PITCH;
      if (c.empty) return <Brick key={i} x={20} y={y} w={180} kind="na" label={id === 'original' ? c.label : undefined} />;
      if (id === 'original') return <Brick key={i} x={20} y={y} w={180} kind="num" value={c.value} label={c.label} />;
      if (id === 'label') return <Brick key={i} x={20} y={y} w={180} kind="chr" value={c.label} />;
      return <Brick key={i} x={20} y={y} w={180} kind="num" value={c.value} />;
    })}
    <Plate x={14} y={50 + 4 * PITCH - 3} w={192} />
    {id === 'label' ? <g transform="rotate(14 300 160)">
      <rect x={236} y={150} width={128} height={16} fill="#EFEBE2" stroke={C.grayLine} />
      <M x={300} y={162} fontSize={11} fontWeight={700} fill={C.grayText}>KEINE ANGABE</M>
    </g> : null}
    {id === 'label' ? <T x={300} y={140} fontSize={12} fontStyle="italic">abgefallen</T> : null}
  </Svg>;
}

/** Grundlage 4b: three switches change the variable sex; picture, text and text version follow. */
export function Convert() {
  const [id, setId] = useState<ConvertId>('original');
  const state = CONVERT_STATES.find(s => s.id === id)!;
  return <>
    <div className="s2-umschalter" role="group" aria-label="Variable sex umwandeln">
      {CONVERT_STATES.map(s => <button key={s.id} type="button" aria-pressed={s.id === id} onClick={() => setId(s.id)}>
        {s.button} <code>{`<${s.type}>`}</code>
      </button>)}
    </div>
    <div className="grafik s2-turm" role="img" aria-label={convertText(id)}><ConvertTower id={id} /></div>
    <p className="erkl" aria-live="polite">{rt(state.text)}</p>
    <details className="werte">
      <summary>Alle drei Zustände als Tabelle</summary>
      <table className="daten">
        <caption>Variable sex umwandeln</caption>
        <thead><tr>{CONVERT_STATES.map(s => <th key={s.id} scope="col">{s.button}</th>)}</tr></thead>
        <tbody>
          {CONVERT_STONES.map((c, i) => <tr key={i}>
            <td>{c.empty ? `fehlt (${c.label})` : `${c.value} ${c.label}`}</td>
            <td>{c.empty ? 'NA' : c.label}</td>
            <td>{c.empty ? 'NA' : c.value}</td>
          </tr>)}
          <tr>{CONVERT_STATES.map(s => <td key={s.id}>{`Typ: ${s.type}`}</td>)}</tr>
        </tbody>
      </table>
    </details>
  </>;
}

/* ---------- Überblick Ü1: vom Kreuz zur Zelle ---------- */

const STATIONS: { title: string; note?: string; text: string; picture: ReactNode }[] = [
  { title: 'Fragebogen', text: 'Kreuz bei „schlecht“', picture: <Svg w={170} h={96}>
    <Sheet x={4} y={4} w={162} h={88} title="Wirtschaftliche Lage">
      {['gut', 'teils/teils', 'schlecht'].map((o, i) => <TickBox key={o} x={16} y={30 + i * 19} label={o} checked={i === 2} />)}
    </Sheet>
  </Svg> },
  { title: 'Codebuch', note: 'Regel bei unklaren Kreuzen', text: 'ep03: 4 = SCHLECHT', picture: <Svg w={170} h={96}>
    <rect x={4} y={4} width={162} height={88} rx={6} fill="#FBF8F3" stroke="#EFE6DA" />
    <M x={16} y={30} textAnchor="start" fontSize={12} fontWeight={700}>ep03</M>
    <M x={16} y={52} textAnchor="start" fontSize={11.5}>3 = TEILS/TEILS</M>
    <rect x={12} y={60} width={130} height={18} rx={3} fill={C.sticker} />
    <M x={16} y={73} textAnchor="start" fontSize={11.5} fontWeight={700}>4 = SCHLECHT</M>
  </Svg> },
  { title: 'Zeile', note: 'fehlt? Grund als Code', text: '19, 7 NOCH SCHUELER, 4 SCHLECHT, 2 ARBEITERSCHICHT', picture: <Svg w={200} h={96}>
    {['age', 'educ', 'ep03', 'id02'].map((n, i) => <g key={n}>
      <M x={28 + i * 48} y={26} fontSize={11} fontWeight={700}>{n}</M>
      <Brick x={8 + i * 48} y={44} w={40} kind="num" value={['19', '7', '4', '2'][i]} studs={1} />
    </g>)}
    <Plate x={4} y={76} w={192} />
  </Svg> },
  { title: 'Datensatz', text: '5,246 × 579', picture: <Svg w={170} h={96}>
    {Array.from({ length: 5 }, (_, r) => Array.from({ length: 5 }, (_, k) => <rect key={`${r}-${k}`} x={12 + k * 30} y={8 + r * 15} width={26} height={11}
      fill={C.blue} stroke={C.blueLine} strokeWidth={0.6} />))}
    <rect x={8} y={8 + 2 * 15 - 3} width={154} height={17} fill="none" stroke={C.orange} strokeWidth={2.5} rx={2} />
    <Plate x={6} y={86} w={158} />
  </Svg> },
];

/** Überblick Ü1: four stations from the cross to the cell. */
export function Flow() {
  return <figure className="ebild">
    <div className="ebild-bild s2-ablauf" role="img" aria-label={ALT.ablauf}>
      {STATIONS.map((s, i) => <div className="s2-station" key={s.title}>
        <b><span>{i + 1}</span>{s.title}</b>
        {s.picture}
        <small className="s2-st-text">{s.text}</small>
        {s.note ? <small className="s2-st-schild">{s.note}</small> : null}
      </div>)}
    </div>
  </figure>;
}

/* ---------- Überblick Ü2: Was steht in dieser Zelle? ---------- */

type Checked = Record<string, string> | null;

/** Six cells, one select each; feedback per cell and a live summary. Saved like the other answers. */
export function CellAssign() {
  const { state, setAnswers } = useChapterState();
  const saved = Object.fromEntries(CELLS.map(c => [c.id, state.answers[c.id] ?? ''])) as Record<string, string>;
  const [draft, setDraft] = useState(saved);
  const [checked, announce] = useAnnounce<Checked>(Object.values(saved).some(Boolean) ? saved : null, null);

  function submit(e: FormEvent) {
    e.preventDefault();
    const snapshot = Object.fromEntries(CELLS.map(c => [c.id, draft[c.id] ?? '']));
    setAnswers(snapshot);
    announce(snapshot);
  }

  const results = CELLS.map(c => {
    const v = checked?.[c.id] ?? '';
    return v === '' ? null : Number(v) === c.answer;
  });
  const open = results.filter(r => r === null).length, right = results.filter(r => r === true).length;
  const summary = !checked ? '' : open ? `Noch ${open} ${open === 1 ? 'Zelle' : 'Zellen'} ohne Art.` : right === CELLS.length ? 'Alle sechs passen.' : `${right} von 6 passen. Unter jeder Zelle steht die Begründung.`;

  return <form className="kurzueberlegen weiss zuordnen" id="ue2-frage" noValidate onSubmit={submit}>
    <p>Ordne jede Zelle einer Art zu</p>
    {CELLS.map((c, i) => {
      const r = results[i];
      return <div className="frage feld" key={c.id}>
        <label htmlFor={c.id}><code>{`${c.variable} = ${c.value}`}</code></label>
        <select id={c.id} aria-describedby={`${c.id}-r`} value={draft[c.id] ?? ''} aria-invalid={r === null ? undefined : !r} className={r ? 'passt' : undefined}
          onChange={e => setDraft(d => ({ ...d, [c.id]: e.target.value }))}>
          <option value="">Art wählen</option>
          {CELL_KINDS.map((k, n) => <option key={k} value={String(n)}>{k}</option>)}
        </select>
        <span className="hilfe-zeile" id={`${c.id}-r`}>
          {r === null ? null : r ? <><b className="passt-ja">Passt.</b> {c.why}</> : <><b className="passt-nein">Passt nicht:</b> {c.why}</>}
        </span>
      </div>;
    })}
    <div className="reihe-knoepfe"><button type="submit" className="knopf">Prüfen</button></div>
    <p className={`rueck${checked ? (right === CELLS.length ? ' ok' : ' no') : ''}`} aria-live="polite">{summary}</p>
  </form>;
}
