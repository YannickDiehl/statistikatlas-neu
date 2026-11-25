// Feste Bilder von Sitzung 2 (Plan: s2-filter-sex, s2-ausgabe-lesen, s2-pa02a, s2-drei-beschriftungen, s2-pv01,
// s2-luecken, s2-bogen-a2, s2-split, s2-typen). Alle Steine sind konstruierte Beispiele.
import type { ReactNode } from 'react';
import { ALT } from '../content';
import { Arrow, Brick, C, Head, M, MONO, NameTag, PITCH, Pic, Plate, Sheet, Svg, T, TickBox } from './bricks';

/** Straight arrow from (x1, y1) to (x2, y2) with a drawn head (no markers: ids must stay unique on the page). */
export function LineArrow({ x1, y1, x2, y2, color = C.green, width = 3 }: { x1: number; y1: number; x2: number; y2: number; color?: string; width?: number }) {
  const a = Math.atan2(y2 - y1, x2 - x1), l = 12, s = 7;
  const bx = x2 - l * Math.cos(a), by = y2 - l * Math.sin(a);
  const p = (dx: number) => `${bx + dx * s * Math.sin(a)},${by - dx * s * Math.cos(a)}`;
  return <g>
    <line x1={x1} y1={y1} x2={bx} y2={by} stroke={color} strokeWidth={width} />
    <path d={`M${p(1)} L${x2},${y2} L${p(-1)} Z`} fill={color} />
  </g>;
}

/* ---------- R lesen: filter(sex == 2) ---------- */

type Row = { sex: [string, string]; ls01: string; rh08b: [string, string] };
const ROWS: Row[] = [
  { sex: ['1', 'MANN'], ls01: '7', rh08b: ['3', 'GAR NICHTS'] },
  { sex: ['2', 'FRAU'], ls01: '8', rh08b: ['3', 'GAR NICHTS'] },
  { sex: ['1', 'MANN'], ls01: '5', rh08b: ['2', 'ETWAS'] },
  { sex: ['2', 'FRAU'], ls01: '9', rh08b: ['1', 'VIEL'] },
  { sex: ['3', 'DIVERS'], ls01: '6', rh08b: ['3', 'GAR NICHTS'] },
  { sex: ['2', 'FRAU'], ls01: '8', rh08b: ['2', 'ETWAS'] },
];
const COLS = [{ dx: 0, w: 140 }, { dx: 150, w: 50 }, { dx: 210, w: 124 }];
const ROW0 = 96;

/** Three towers sex, ls01, rh08b of a plate at x0; gray rows fall away. */
function SexPlate({ x0, name, size, rows, gray = [] }: { x0: number; name: string; size: string; rows: Row[]; gray?: number[] }) {
  const bottom = ROW0 + rows.length * PITCH - 7;
  return <g>
    <NameTag x={x0} y={6} text={name} />
    <M x={x0 + name.length * 8.6 + 28} y={22} textAnchor="start" fill={C.mute}>{size}</M>
    {['sex', 'ls01', 'rh08b'].map((n, i) => <Head key={n} x={x0 + COLS[i].dx + COLS[i].w / 2} y={56} name={n} type="dbl+lbl" />)}
    {rows.map((r, j) => {
      const y = ROW0 + j * PITCH, k = gray.includes(j) ? 'gray' : 'num';
      return <g key={j}>
        <Brick x={x0} y={y} w={COLS[0].w} kind={k} value={r.sex[0]} label={r.sex[1]} />
        <Brick x={x0 + COLS[1].dx} y={y} w={COLS[1].w} kind={k} value={r.ls01} />
        <Brick x={x0 + COLS[2].dx} y={y} w={COLS[2].w} kind={k} value={r.rh08b[0]} label={r.rh08b[1]} />
      </g>;
    })}
    <T x={x0 + 352} y={ROW0 + 18} fontSize={18} fontWeight={800}>…</T>
    <Plate x={x0 - 6} y={bottom + 4} w={360} />
    <T x={x0 + 170} y={bottom + 30} fontSize={18} fontWeight={800}>⋮</T>
  </g>;
}

/** Code as coloured pieces: object ink, pipe and function green, condition orange. */
function CodeLine({ x, y, size = 15 }: { x: number; y: number; size?: number }) {
  return <text x={x} y={y} fontFamily={MONO} fontSize={size} fontWeight={700} fill={C.ink}>
    <tspan>frauen</tspan><tspan fill={C.mute}> &lt;- </tspan><tspan>allbus</tspan><tspan fill={C.green}> %&gt;% filter(</tspan>
    <tspan fill="#B86E0A">sex == 2</tspan><tspan fill={C.green}>)</tspan>
  </text>;
}

export function FilterSex({ caption }: { caption?: ReactNode }) {
  return <Pic alt={ALT.filterSex} caption={caption}>
    <Svg w={860} h={380}>
      <SexPlate x0={16} name="allbus" size="5,246 × 579" rows={ROWS} gray={[0, 2, 4]} />
      <Arrow x1={392} x2={476} y={196}>
        <text x={434} y={172} textAnchor="middle" fontFamily={MONO} fontSize={12} fontWeight={700}>
          <tspan fill={C.green}>filter(</tspan><tspan fill="#B86E0A">sex == 2</tspan><tspan fill={C.green}>)</tspan>
        </text>
      </Arrow>
      <SexPlate x0={496} name="frauen" size="2,672 × 579" rows={[ROWS[1], ROWS[3], ROWS[5]]} />
      <T x={666} y={270} fontSize={13} fontStyle="italic">alle Variablen bleiben</T>
      <CodeLine x={16} y={366} />
    </Svg>
  </Pic>;
}

/* ---------- Aufgabe 1: die Ausgabe lesen ---------- */

const OUT = [
  '# A tibble: 5,246 × 579',
  '   za_nr          doi   version respid substudy    mode    …',
  '   <dbl+lbl>      <chr> <chr>    <dbl> <dbl+lbl>   <dbl+l> …',
  ' 1 …              …     …          …   …           …',
  ' 2 …              …     …          …   …           …',
  '# ℹ 5,236 more rows',
  '# ℹ 571 more variables: eastwest <dbl+lbl>, …',
];
const CW = 7.8;

export function OutputRead({ caption }: { caption?: ReactNode }) {
  const y = [66, 94, 116, 138, 160, 190, 212];
  const at = (chars: number) => 16 + chars * CW;
  const note = (yy: number, text: string, color = C.ink) => <T x={560} y={yy + 4} textAnchor="start" fontSize={13} fontWeight={800} fill={color}>{text}</T>;
  return <Pic alt={ALT.ausgabe} caption={caption}>
    <Svg w={760} h={232}>
      <rect x={4} y={44} width={500} height={182} rx={8} fill="#FBF8F3" stroke="#EFE6DA" />
      {OUT.map((line, i) => <text key={i} x={16} y={y[i]} fontFamily={MONO} fontSize={13} xmlSpace="preserve"
        fill={i === 3 || i === 4 ? C.grayText : C.ink}>{line}</text>)}
      <rect x={at(12) - 2} y={52} width={5 * CW + 4} height={19} fill="none" stroke="#B86E0A" strokeWidth={2} rx={3} />
      <rect x={at(20) - 2} y={52} width={3 * CW + 4} height={19} fill="none" stroke={C.green} strokeWidth={2} rx={3} />
      <line x1={at(14.5)} y1={50} x2={110} y2={26} stroke="#B86E0A" strokeWidth={1.5} />
      <T x={110} y={20} fontSize={13} fontWeight={800} fill="#B86E0A">Zeilen = Fälle</T>
      <line x1={at(21.5)} y1={50} x2={300} y2={26} stroke={C.green} strokeWidth={1.5} />
      <T x={300} y={20} fontSize={13} fontWeight={800} fill="#2f7a4f">Spalten = Variablen</T>
      {[1, 2].map(i => <line key={i} x1={512} x2={552} y1={y[i] - 4} y2={y[i] - 4} stroke={C.mute} strokeWidth={1} />)}
      {note(y[1] - 4, 'Variablennamen')}
      {note(y[2] - 4, 'Typ (Grundlage 4)')}
      <path d={`M512,${y[3] - 12} h8 v${y[4] - y[3] + 12} h-8 M520,${(y[3] + y[4]) / 2 - 4} h32`} fill="none" stroke={C.mute} />
      {note((y[3] + y[4]) / 2 - 4, 'die ersten Zeilen', C.mute)}
      <path d={`M512,${y[5] - 12} h8 v${y[6] - y[5] + 12} h-8 M520,${(y[5] + y[6]) / 2 - 4} h32`} fill="none" stroke={C.mute} />
      {note((y[5] + y[6]) / 2 - 4, 'nicht gezeigt', C.mute)}
    </Svg>
  </Pic>;
}

/* ---------- Grundlage 2 ---------- */

export function Pa02a({ caption }: { caption?: ReactNode }) {
  const labels = ['SEHR STARK', 'STARK', 'MITTEL', 'WENIG', 'UEBERHAUPT NICHT'];
  const opts = ['sehr stark', 'stark', 'mittel', 'wenig', 'überhaupt nicht'];
  return <Pic alt={ALT.pa02a} caption={caption}>
    <Svg w={600} h={352}>
      <Head x={140} y={20} name="pa02a" type="dbl+lbl" />
      {labels.map((l, i) => <Brick key={l} x={40} y={56 + i * PITCH} w={200} kind="num" value={String(i + 1)} label={l} />)}
      <T x={140} y={250} fontSize={13} fontWeight={800} fill={C.ink}>fehlende Werte</T>
      <Brick x={40} y={268} w={200} kind="na" label="−42 DATENFEHLER: MFN" />
      <Brick x={40} y={302} w={200} kind="na" label="−9 KEINE ANGABE" />
      <T x={250} y={286} textAnchor="start" fontSize={13}>4-mal</T>
      <T x={250} y={320} textAnchor="start" fontSize={13}>17-mal</T>
      <Sheet x={370} y={40} w={210} h={166} title="Interesse für Politik">
        {opts.map((o, i) => <TickBox key={o} x={384} y={70 + i * 25} label={o} checked={i === 0} />)}
      </Sheet>
      <LineArrow x1={380} y1={75} x2={248} y2={70} color={C.cross} width={2.5} />
    </Svg>
  </Pic>;
}

export function DreiBeschriftungen() {
  const right = (y: number, text: string) => <T x={600} y={y} textAnchor="end" fontSize={14} fontWeight={800} fill={C.mute}>{text}</T>;
  return <Pic alt={ALT.dreiBeschriftungen}>
    <Svg w={610} h={168}>
      <NameTag x={20} y={12} text="pa02a" />
      {right(28, 'Variablenname')}
      <M x={20} y={78} textAnchor="start" fontSize={13.5} fontWeight={700}>POLITISCHES INTERESSE, BEFR. (ORDINAL)</M>
      {right(78, 'Variablenlabel')}
      <Brick x={20} y={122} w={170} kind="num" value="1" label="SEHR STARK" />
      <T x={207} y={140} fontSize={18} fontWeight={800}>…</T>
      <Brick x={224} y={122} w={214} kind="num" value="5" label="UEBERHAUPT NICHT" />
      {right(140, 'Wertelabels')}
    </Svg>
  </Pic>;
}

/** Codes of pv01 side by side, each with its sticker below; a gap where the 5 would be. */
export function Pv01({ codes }: { codes: [number, string][] }) {
  const w = 84;
  let x = 12;
  const items = codes.map(([code, label]) => {
    const at = x;
    x += w + (code === 4 ? 64 : 8);
    return { code, label, at };
  });
  const gap = items.find(i => i.code === 4)!.at + w + 32;
  return <Pic alt={ALT.pv01}>
    <Svg w={x + 4} h={124}>
      {items.map(({ code, label, at }) => {
        const words = label.split(' ');
        const lines = words.length > 2 ? [words.slice(0, 2).join(' '), words.slice(2).join(' ')] : words.length === 2 && label.length > 11 ? words : [label];
        return <g key={code}>
          <Brick x={at} y={18} w={w} kind="num" value={String(code)} studs={2} />
          <rect x={at} y={54} width={w} height={lines.length * 15 + 8} fill={C.sticker} />
          {lines.map((l, i) => <M key={i} x={at + w / 2} y={67 + i * 15} fontSize={Math.min(11, (w - 6) / (l.length * 0.62))} fontWeight={700}>{l}</M>)}
        </g>;
      })}
      <rect x={gap - 26} y={18} width={52} height={27} fill="none" stroke={C.grayLine} strokeDasharray="3 3" />
      <T x={gap} y={66} fontSize={12} fontWeight={700}>keine 5</T>
    </Svg>
  </Pic>;
}

/* ---------- Grundlage 3 ---------- */

export function Luecken() {
  return <Pic alt={ALT.luecken}>
    <Svg w={560} h={218}>
      <Head x={135} y={20} name="ls01" type="dbl+lbl" />
      <Brick x={30} y={58} w={210} kind="num" value="0" label="GANZ UNZUFRIEDEN" />
      <Brick x={30} y={58 + PITCH} w={210} kind="na" label="−9 KEINE ANGABE" />
      <Brick x={30} y={58 + 2 * PITCH} w={210} kind="na" label="−42 DATENFEHLER: MFN" />
      <Plate x={24} y={161} w={222} />
      <T x={135} y={188} fontSize={13}>Fragebogen A, B und C; fehlend: in R NA</T>
      <Head x={415} y={20} name="ps03" type="dbl+lbl" />
      <Brick x={330} y={58} w={170} kind="na" label="−11 TNZ: SPLIT" />
      <Plate x={324} y={93} w={182} />
      <T x={415} y={120} fontSize={13}>Fragebogen D; in R NA</T>
    </Svg>
  </Pic>;
}

/** A small sheet of Grundlage 3a (scale 0 to 10, or the missing question on version B). */
export function SmallSheet({ letter, crosses, missing = false, alt }: { letter: string; crosses: number[]; missing?: boolean; alt: string }) {
  return <Pic alt={alt}>
    <Svg w={330} h={112}>
      <Sheet x={4} y={4} w={322} h={104} title={missing ? `Fragebogen ${letter}, Version B` : `Fragebogen ${letter}`}>
        {missing ? <>
          <T x={16} y={46} textAnchor="start" fontSize={12} fill="#2B3540">12. Wie oft lesen Sie Zeitung?</T>
          <rect x={16} y={56} width={298} height={22} rx={3} fill="#F3EFE6" stroke={C.grayLine} strokeDasharray="4 3" />
          <T x={165} y={71} fontSize={11.5} fontStyle="italic" fill={C.mute}>Frage 13 fehlt in Version B</T>
          <T x={16} y={96} textAnchor="start" fontSize={12} fill="#2B3540">14. Wie stark interessieren Sie sich für Politik?</T>
        </> : <>
          <T x={16} y={42} textAnchor="start" fontSize={12} fill="#2B3540">Wie zufrieden sind Sie mit Ihrem Leben?</T>
          {Array.from({ length: 11 }, (_, i) => <g key={i}>
            <TickBox x={20 + i * 27} y={56} checked={crosses.includes(i)} size={13} />
            <T x={26.5 + i * 27} y={86} fontSize={11}>{String(i)}</T>
          </g>)}
          <T x={16} y={102} textAnchor="start" fontSize={10} fill={C.mute}>0 ganz unzufrieden … 10 ganz zufrieden</T>
        </>}
      </Sheet>
    </Svg>
  </Pic>;
}

/* ---------- Aufgabe 2: der Bogen ---------- */

export function BogenA2({ caption }: { caption?: ReactNode }) {
  const q = (y: number, text: string) => <T x={30} y={y} textAnchor="start" fontSize={13.5} fontWeight={800} fill={C.ink}>{text}</T>;
  const educ = ['ohne Abschluss', 'Volks-, Hauptschulabschluss', 'Mittlere Reife', 'Fachhochschulreife', 'Abitur, Hochschulreife', 'anderer Abschluss', 'Ich gehe noch zur Schule'];
  const ep = ['sehr gut', 'gut', 'teils/teils', 'schlecht', 'sehr schlecht'];
  const id = ['Unterschicht', 'Arbeiterschicht', 'Mittelschicht', 'obere Mittelschicht', 'Oberschicht', 'keiner dieser Schichten'];
  return <Pic alt={ALT.bogenA2} caption={caption}>
    <Svg w={660} h={392}>
      <Sheet x={8} y={6} w={644} h={380} title="Fragebogen, Seite 3">
        {q(54, '1. Wie alt sind Sie?')}
        <line x1={200} x2={330} y1={56} y2={56} stroke={C.paperLine} />
        <text x={210} y={52} fontFamily="'Segoe Print','Bradley Hand','Comic Sans MS',cursive" fontSize={17} fill="#2C4A8A">19 Jahre</text>
        {q(92, '2. Welchen allgemeinbildenden Schulabschluss haben Sie?')}
        {educ.map((o, i) => <TickBox key={o} x={i < 4 ? 40 : 330} y={104 + (i % 4) * 20} label={o} checked={i === 6} />)}
        {q(204, '3. Wie beurteilen Sie Ihre eigene wirtschaftliche Lage heute?')}
        {ep.map((o, i) => <TickBox key={o} x={40 + i * 118} y={216} label={o} checked={i === 3} />)}
        {q(260, '4. Welcher Schicht rechnen Sie sich selbst zu?')}
        {id.map((o, i) => <TickBox key={o} x={40 + (i % 3) * 200} y={272 + Math.floor(i / 3) * 22} label={o} checked={i === 1} />)}
        <line x1={20} x2={640} y1={336} y2={336} stroke={C.grayLine} />
        <T x={30} y={360} textAnchor="start" fontSize={12} fill={C.mute}>Variablennamen im ALLBUS: Frage 1 age, Frage 2 educ, Frage 3 ep03, Frage 4 id02</T>
      </Sheet>
    </Svg>
  </Pic>;
}

/* ---------- Aufgabe 3: zwei Versionen ---------- */

export function Split({ caption }: { caption?: ReactNode }) {
  const gap = (x: number, y: number, text: string) => <g>
    <rect x={x} y={y} width={232} height={22} rx={3} fill="#F3EFE6" stroke={C.grayLine} strokeDasharray="4 3" />
    <T x={x + 116} y={y + 15} fontSize={11} fontStyle="italic" fill={C.mute}>{text}</T>
  </g>;
  return <Pic alt={ALT.split} caption={caption}>
    <Svg w={820} h={262}>
      <Sheet x={6} y={6} w={256} h={116} title="Version A">
        <T x={18} y={44} textAnchor="start" fontSize={12} fill="#2B3540">Vertrauen in den Bundestag</T>
        {Array.from({ length: 7 }, (_, i) => <g key={i}>
          <TickBox x={20 + i * 30} y={54} checked={i === 4} size={12} />
          <T x={26 + i * 30} y={80} fontSize={10.5}>{String(i + 1)}</T>
        </g>)}
        {gap(18, 90, 'Mitmenschen: steht nicht in Version A')}
      </Sheet>
      <Sheet x={6} y={138} w={256} h={116} title="Version B">
        <T x={18} y={176} textAnchor="start" fontSize={12} fill="#2B3540">Vertrauen zu Mitmenschen</T>
        <TickBox x={20} y={184} label="man kann trauen" size={11} fontSize={10.5} />
        <TickBox x={130} y={184} label="kommt darauf an" checked size={11} fontSize={10.5} />
        <TickBox x={20} y={202} label="muss vorsichtig sein" size={11} fontSize={10.5} />
        {gap(18, 222, 'Bundestag: steht nicht in Version B')}
      </Sheet>
      <LineArrow x1={270} y1={64} x2={430} y2={110} />
      <LineArrow x1={270} y1={196} x2={430} y2={146} />
      <Head x={545} y={62} name="st01" type="dbl+lbl" />
      <Head x={715} y={62} name="pt03" type="dbl+lbl" />
      <Brick x={450} y={98} w={190} kind="na" label="−11 TNZ: SPLIT" />
      <Brick x={650} y={98} w={130} kind="num" value="5" />
      <Brick x={450} y={98 + PITCH} w={190} kind="num" value="3" label="KOMMT DARAUF AN" />
      <Brick x={650} y={98 + PITCH} w={130} kind="na" label="−11 TNZ: SPLIT" />
      <Plate x={444} y={163} w={342} />
      <T x={790} y={116} textAnchor="start" fontSize={12} fontWeight={800}>A</T>
      <T x={790} y={150} textAnchor="start" fontSize={12} fontWeight={800}>B</T>
    </Svg>
  </Pic>;
}

/* ---------- Grundlage 4a: Steine haben Farben ---------- */

export function Typen() {
  const legend: { x: number; w: number; brick: ReactNode; text: string }[] = [
    { x: 20, w: 70, brick: <Brick x={20} y={30} w={70} kind="num" value="52" />, text: 'Zahl <dbl>' },
    { x: 150, w: 110, brick: <Brick x={150} y={30} w={110} kind="chr" value="Lehrerin" />, text: 'Text <chr>' },
    { x: 320, w: 230, brick: <Brick x={320} y={30} w={230} kind="num" value="2" label="NEUE BUNDESLAENDER" />, text: 'Zahl mit Wertelabel <dbl+lbl>' },
    { x: 620, w: 70, brick: <Brick x={620} y={30} w={70} kind="na" />, text: 'fehlt NA' },
  ];
  const rows = [['Lehrerin', '34', '1', 'ALTE BUNDESLAENDER'], ['Koch', '52', '2', 'NEUE BUNDESLAENDER'], ['Pflegerin', '41', '1', 'ALTE BUNDESLAENDER']];
  return <Pic alt={ALT.typen}>
    <Svg w={720} h={300}>
      {legend.map(l => <g key={l.text}>{l.brick}<M x={l.x + l.w / 2} y={80} fontSize={12.5} fill={C.ink}>{l.text}</M></g>)}
      <line x1={10} x2={710} y1={100} y2={100} stroke="#EFE6DA" />
      <T x={20} y={124} textAnchor="start" fontSize={13} fontStyle="italic">zum Beispiel</T>
      <Head x={80} y={150} name="beruf" type="chr" />
      <Head x={190} y={150} name="alter" type="dbl" />
      <Head x={360} y={150} name="eastwest" type="dbl+lbl" />
      {rows.map((r, j) => <g key={j}>
        <Brick x={20} y={186 + j * PITCH} w={120} kind="chr" value={r[0]} />
        <Brick x={160} y={186 + j * PITCH} w={60} kind="num" value={r[1]} />
        <Brick x={240} y={186 + j * PITCH} w={240} kind="num" value={r[2]} label={r[3]} />
      </g>)}
      <Plate x={14} y={186 + 3 * PITCH - 3} w={472} />
    </Svg>
  </Pic>;
}
