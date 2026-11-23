// Bilder mit Türmen und Steinen: rec(), mutate() in Aufgabe 1, Umpolen in Grundlage 4 und Aufgabe 4.
import type { ReactNode } from 'react';
import { ALT, EP01 } from '../content';
import { Arrow, COLORS, Canvas, Fig, STONE, T, Tower, de, rowY, towerWidth, whole, type Stone } from './parts';

const mid = (y: number, i: number) => rowY(y, i) + STONE.h / 2;

/** Bauplatte als Leiste mit Name und Größe. */
function Plate({ x, y, w, text }: { x: number; y: number; w: number; text: string }) {
  return <g>
    <rect x={x} y={y} width={w} height={40} rx={8} fill="#FFF6DA" stroke="#E0C46A" strokeWidth={2} />
    <T x={x + 14} y={y + 26} mono fontSize={14.5} textAnchor="start" fill={COLORS.ink}>{text}</T>
  </g>;
}

/* ---------- R2: rec() und mutate() ---------- */

const WORK_STONES: Stone[] = [
  { code: '1', label: 'VOLLZEIT, GANZTAGS' }, { code: '2', label: 'TEILZEIT' }, { code: '4', label: 'NICHT ERWERBSTAETIG' },
  { code: '3', label: 'NEBENHER BERUFSTAE.' }, { code: null, label: 'KEINE ANGABE' }, { code: '1', label: 'VOLLZEIT, GANZTAGS' },
];
const TEILZEIT_STONES: Stone[] = [
  { code: '0', label: 'Vollzeit' }, { code: '1', label: 'Teilzeit' }, { code: null, hot: true }, { code: '1', label: 'Teilzeit' }, { code: null }, { code: '0', label: 'Vollzeit' },
];

/** Bild „Turm → neuer Turm, Bauplatte wächst“ (s5-rec). */
export function RecFigure({ caption }: { caption: ReactNode }) {
  const y = 62, lx = 16, rx = 540;
  return <Fig alt={ALT.rec} caption={caption}>
    <Canvas w={730} h={420}>
      <Tower x={lx} y={y} name="work" stones={WORK_STONES} />
      <Arrow x1={lx + towerWidth(WORK_STONES) + 12} x2={rx - 12} y={mid(y, 2) + 8} size={12.5} label={['rec(work, rules = "2:3=1 [Teilzeit];', '1=0 [Vollzeit]; else=NA")']} />
      <Tower x={rx} y={y} name="teilzeit" stones={TEILZEIT_STONES} highlight />
      <T x={rx + STONE.w + 12} y={mid(y, 2) + 5} textAnchor="start" fontSize={14} fill={COLORS.orangeD} fontWeight={700} fontFamily="JetBrains Mono,monospace">else=NA</T>
      <Plate x={16} y={336} w={250} text="allbus  5,246 × 579" />
      <Arrow x1={278} x2={420} y={356} label={['mutate()']} />
      <Plate x={430} y={336} w={250} text="allbus  5,246 × 580" />
      <rect x={690} y={322} width={28} height={66} rx={5} fill="#E3F4E8" stroke={COLORS.green} strokeWidth={2.5} />
      <T x={724} y={410} mono fontSize={13} textAnchor="end" fill={COLORS.green} fontWeight={700}>teilzeit</T>
    </Canvas>
  </Fig>;
}

/* ---------- Aufgabe 1: zwei neue Türme ---------- */

const PE01_STONES: Stone[] = [
  { code: '2', label: 'STIMME EHER ZU' }, { code: '4', label: 'STIMME GAR NICHT ZU' }, { code: null, label: 'TNZ: SPLIT' },
  { code: '1', label: 'STIMME VOLL ZU' }, { code: '3', label: 'STIMME EHER NICHT ZU' },
];
const PV01_STONES: Stone[] = [
  { code: '91', label: 'WUERDE NICHT WAEHLEN' }, { code: '2', label: 'SPD' }, { code: null, label: 'NICHT WAHLBERECHTIGT' },
  { code: '4', label: 'DIE GRUENEN' }, { code: '1', label: 'CDU-CSU' },
];
const NW_STONES: Stone[] = [
  { code: '1', label: 'würde nicht wählen' }, { code: '0', label: 'würde wählen' }, { code: null, hot: true }, { code: '0', label: 'würde wählen' }, { code: '0', label: 'würde wählen' },
];
const MISS_STONES: Stone[] = [{ code: null, open: true }, { code: null, open: true }, { code: null }, { code: null, open: true }, { code: null, open: true }];

/** Thin grey line per row: the same person in the old and in the new tower. */
function RowLines({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  return <g aria-hidden="true">{[0, 1, 2, 3, 4].map(i => <line key={i} x1={x1} x2={x2} y1={mid(y, i)} y2={mid(y, i)} stroke="#b9b3a8" strokeWidth={1.3} />)}</g>;
}

/** Bild „zwei neue Türme“ (s5-mutate-a1): old and new tower side by side, grey lines connect the rows of one person. */
export function MutateA1Figure({ caption }: { caption: ReactNode }) {
  const y1 = 62, y2 = 324, ox = 22, nx = 300;
  const box = (y: number) => <rect x={6} y={y - 52} width={548} height={242} rx={14} fill="#FFFCF3" stroke="#E0C46A" strokeWidth={2} />;
  return <Fig alt={ALT.mutateA1} caption={caption}>
    <Canvas w={560} h={526}>
      {box(y1)}
      <T x={20} y={y1 - 36} mono fontSize={14} textAnchor="start" fill={COLORS.ink} fontWeight={700}>allbus</T>
      <Tower x={ox} y={y1} name="pe01" stones={PE01_STONES} />
      <RowLines x1={ox + towerWidth(PE01_STONES) + 6} x2={nx - 6} y={y1} />
      <T x={(ox + towerWidth(PE01_STONES) + nx) / 2} y={y1 - 8} mono fontSize={12} fill="#1f6b43" fontWeight={600}>mutate()</T>
      <Tower x={nx} y={y1} name="misstrauen" stones={MISS_STONES} highlight />
      <T x={nx + STONE.w + 12} y={mid(y1, 1)} textAnchor="start" fontSize={14} fill={COLORS.ink}>deine Regel</T>
      <T x={nx + STONE.w + 12} y={mid(y1, 1) + 17} textAnchor="start" fontSize={14} fill={COLORS.ink}>aus Schritt 2</T>
      {box(y2)}
      <T x={20} y={y2 - 36} mono fontSize={14} textAnchor="start" fill={COLORS.ink} fontWeight={700}>allbus</T>
      <Tower x={ox} y={y2} name="pv01" stones={PV01_STONES} />
      <RowLines x1={ox + towerWidth(PV01_STONES) + 6} x2={nx - 6} y={y2} />
      <T x={(ox + towerWidth(PV01_STONES) + nx) / 2} y={y2 - 8} mono fontSize={12} fill="#1f6b43" fontWeight={600}>mutate()</T>
      <Tower x={nx} y={y2} name="nichtwahl" stones={NW_STONES} highlight />
      <T x={nx + STONE.w + 10} y={mid(y2, 2) - 1} textAnchor="start" fontSize={13} fill={COLORS.orangeD} fontWeight={700}>−50 steht in keiner Regel:</T>
      <T x={nx + STONE.w + 10} y={mid(y2, 2) + 14} textAnchor="start" fontSize={13} fill={COLORS.orangeD} fontWeight={700} fontFamily="JetBrains Mono,monospace">else=NA</T>
    </Canvas>
  </Fig>;
}

/* ---------- Grundlage 4: ep01 umpolen ---------- */

/** Bild „Wenn 1 sehr gut heißt“ (s5-umpolen): Turm vorher und nachher, Pfeile verbinden gleiche Wörter. */
export function UmpolenFigure({ caption }: { caption: ReactNode }) {
  const y = 62, lx = 30, rx = 470;
  const k = EP01.labels.length;
  // von oben nach unten: Code 5 bis 1
  const before: Stone[] = EP01.labels.map((label, i) => ({ code: String(i + 1), label })).reverse();
  const afterTop: Stone[] = EP01.labels.map((label, i) => ({ code: String(k - i), label }));
  const lw = towerWidth(before);
  const countOf = (label: string) => whole(EP01.counts[EP01.labels.indexOf(label)]);
  return <Fig alt={ALT.umpolen} caption={caption}>
    <Canvas w={730} h={450}>
      <defs><marker id="s5-pfeil-umpolen" viewBox="0 0 10 10" refX={9} refY={5} markerWidth={7} markerHeight={7} orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill={COLORS.green} /></marker></defs>
      <Tower x={lx} y={y} name="ep01" type="vorher" stones={before} />
      <Tower x={rx} y={y} name="nach dem Umpolen" type="" stones={afterTop} />
      {before.map((s, i) => <T key={`b${i}`} x={lx + lw + 8} y={mid(y, i) + 4} textAnchor="start" fontSize={13}>{countOf(s.label!)}</T>)}
      {afterTop.map((s, i) => <T key={`a${i}`} x={rx + towerWidth(afterTop) + 8} y={mid(y, i) + 4} textAnchor="start" fontSize={13}>{countOf(s.label!)}</T>)}
      {before.map((s, i) => {
        const j = afterTop.findIndex(a => a.label === s.label);
        const x1 = lx + lw + 56, x2 = rx - 8, y1 = mid(y, i), y2 = mid(y, j);
        return <line key={`p${i}`} x1={x1} x2={x2} y1={y1} y2={y2} stroke={COLORS.green} strokeWidth={2} markerEnd="url(#s5-pfeil-umpolen)" />;
      })}
      <g transform="translate(30,276)">
        <rect x={0} y={0} width={670} height={156} rx={12} fill="#FFFDF9" stroke={COLORS.line} strokeWidth={2} />
        <rect x={20} y={18} width={110} height={34} rx={8} fill="#EDF8F1" stroke={COLORS.green} />
        <T x={75} y={41} fontSize={15} fill={COLORS.ink} fontWeight={800}>neuer Code</T>
        <T x={148} y={42} fontSize={20} fill="#8a4a2c">=</T>
        <rect x={166} y={18} width={36} height={34} rx={8} fill="#F1EFFC" stroke={COLORS.lilaD} />
        <T x={184} y={42} fontSize={18} fill={COLORS.lilaD} fontWeight={800} fontFamily="JetBrains Mono,monospace">6</T>
        <T x={220} y={42} fontSize={20} fill="#8a4a2c">−</T>
        <rect x={238} y={18} width={110} height={34} rx={8} fill="#EAF5FC" stroke={COLORS.blueD} />
        <T x={293} y={41} fontSize={15} fill={COLORS.ink} fontWeight={800}>alter Code</T>
        <T x={184} y={74} fontSize={14}>kleinster plus größter Code: 1 + 5</T>
        {['6 − 1 = 5', '6 − 2 = 4', '6 − 3 = 3'].map((t, i) => <T key={t} x={20 + i * 150} y={106} textAnchor="start" fontSize={15} fontFamily="JetBrains Mono,monospace" fill={COLORS.ink}>{t}</T>)}
        <T x={20} y={136} textAnchor="start" fontSize={15} fill={COLORS.ink} fontWeight={700}>{`Mittelwert vorher ${de(EP01.mean, 2)}  →  nachher ${de(EP01.meanRev, 2)} (= 6 − ${de(EP01.mean, 2)})`}</T>
      </g>
    </Canvas>
  </Fig>;
}

/* ---------- Aufgabe 4: pe05 umpolen ---------- */

const PE05_STONES: Stone[] = [
  { code: '1', label: 'STIMME VOLL ZU' }, { code: '3', label: 'STIMME EHER NICHT ZU' }, { code: '4', label: 'STIMME GAR NICHT ZU' },
  { code: '2', label: 'STIMME EHER ZU' }, { code: null, label: 'TNZ: SPLIT' },
];
const PE05_UM_STONES: Stone[] = [
  { code: '4', label: 'STIMME VOLL ZU' }, { code: '2', label: 'STIMME EHER NICHT ZU' }, { code: '1', label: 'STIMME GAR NICHT ZU' },
  { code: '3', label: 'STIMME EHER ZU' }, { code: null },
];

/** Markierung der Steine mit Code 1 und 2 (links neben dem Turm). */
function Small({ x, y, stones, color }: { x: number; y: number; stones: Stone[]; color: string }) {
  return <>{stones.map((s, i) => (s.code === '1' || s.code === '2')
    ? <rect key={i} x={x - 9} y={rowY(y, i)} width={5} height={STONE.h} rx={2} fill={color} /> : null)}</>;
}

/** Bild „pe05 umpolen“ (s5-umpolen-pe05). */
export function UmpolenPe05Figure({ caption }: { caption: ReactNode }) {
  const y = 62, lx = 22, rx = 480;
  return <Fig alt={ALT.umpolenPe05} caption={caption}>
    <Canvas w={730} h={316}>
      <Small x={lx} y={y} stones={PE05_STONES} color="#b9b3a8" />
      <Tower x={lx} y={y} name="pe05" stones={PE05_STONES} />
      <Arrow x1={lx + towerWidth(PE05_STONES) + 8} x2={rx - 14} y={mid(y, 2)} size={12.5} label={['rec(pe05, rules = "rev")']} />
      <Small x={rx} y={y} stones={PE05_UM_STONES} color={COLORS.green} />
      <Tower x={rx} y={y} name="pe05_um" stones={PE05_UM_STONES} highlight />
      <T x={lx - 9} y={284} textAnchor="start" fontSize={14} fill="#8a8478">Codes 1 und 2 vorher:</T>
      <T x={lx - 9} y={302} textAnchor="start" fontSize={14} fill="#8a8478">kleine Zahl = Vertrauen</T>
      <T x={rx - 9} y={284} textAnchor="start" fontSize={14} fill={COLORS.green} fontWeight={700}>Codes 1 und 2 jetzt wie bei pe01:</T>
      <T x={rx - 9} y={302} textAnchor="start" fontSize={14} fill={COLORS.green} fontWeight={700}>kleine Zahl = Misstrauen</T>
    </Canvas>
  </Fig>;
}
