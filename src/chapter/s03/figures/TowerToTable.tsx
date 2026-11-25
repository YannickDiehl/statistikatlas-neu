import { useState } from 'react';
import { LA01_LABELS, TOWER12, TOWER_TEXT } from '../content';
import { Bracket, C, StepNav, SvgText, TextVersion } from './util';

const CODES = [1, 2, 3, 4, 5];
/** Stones per code (stack height) and the empty stones. */
export const TOWER_COUNTS = CODES.map(c => TOWER12.filter(v => v === c).length);
export const TOWER_EMPTY = TOWER12.filter(v => v === null).length;
export const TOWER_VALID = TOWER_COUNTS.reduce((a, b) => a + b, 0);

const W = 880, H = 440;
const STONE_H = 24, STEP_Y = 27, TOP = 80;
const ROW_Y = (i: number) => 92 + i * 40;
const MISS_Y = ROW_Y(5) + 16;
const STACK_X = 506, STACK_W = 26, STACK_GAP = 3;

function Sticker({ x, y, w, text }: { x: number; y: number; w: number; text: string }) {
  return <g>
    <rect x={x} y={y} width={w} height={STONE_H} rx={4} fill={C.yellow} stroke={C.yellowStroke} />
    <SvgText x={x + w / 2} y={y + 16} fontSize={10} fill={C.ink} fontWeight={700}>{text}</SvgText>
  </g>;
}

function CodeStone({ x, y, value, w = 32 }: { x: number; y: number; value: number | null; w?: number }) {
  const empty = value === null;
  return <g>
    <rect x={x} y={y} width={w} height={STONE_H} rx={3} fill={empty ? '#fff' : C.blue} stroke={empty ? C.mute : C.blueStroke}
      strokeWidth={empty ? 1.3 : 1} strokeDasharray={empty ? '4 3' : undefined} />
    {empty ? null : <SvgText x={x + w / 2} y={y + 17} fontSize={13} fill={C.ink} fontWeight={800}>{String(value)}</SvgText>}
  </g>;
}

/** The tower la01 (decorative; gray from step 2 on, its stones have moved). */
function Tower({ moved }: { moved: boolean }) {
  return <g opacity={moved ? 0.3 : 1}>
    <SvgText x={180} y={50} fontFamily="JetBrains Mono,monospace" fontSize={11}>{'<dbl+lbl>'}</SvgText>
    <rect x={146} y={55} width={68} height={20} rx={6} fill={C.ink} />
    <SvgText x={180} y={69} fill="#fff" fontFamily="JetBrains Mono,monospace" fontSize={12}>la01</SvgText>
    {TOWER12.map((v, i) => {
      const y = TOP + i * STEP_Y;
      return <g key={i}>
        {v === null ? <SvgText x={96} y={y + 17} textAnchor="end" fontSize={12} fontWeight={700}>−9</SvgText> : null}
        <CodeStone x={100} y={y} value={v} />
        <Sticker x={136} y={y} w={124} text={v === null ? 'KEINE ANGABE' : LA01_LABELS[v]} />
      </g>;
    })}
    <rect x={84} y={TOP + 12 * STEP_Y + 2} width={192} height={12} rx={4} fill={C.plate} />
  </g>;
}

/** Step 2 and 3: one row per code, the stones side by side; step 3 adds Value, Label, N and the brackets. */
function Stacks({ table }: { table: boolean }) {
  return <g>
    {table ? <g>
      <SvgText x={342} y={ROW_Y(0) - 10} fill={C.ink} fontWeight={800}>Value</SvgText>
      <SvgText x={428} y={ROW_Y(0) - 10} fill={C.ink} fontWeight={800}>Label</SvgText>
      <SvgText x={650} y={ROW_Y(0) - 10} fill={C.ink} fontWeight={800}>N</SvgText>
    </g> : null}
    {CODES.map((c, i) => <g key={c}>
      {table ? <>
        <SvgText x={342} y={ROW_Y(i) + 17} fill={C.ink} fontSize={13}>{String(c)}</SvgText>
        <Sticker x={364} y={ROW_Y(i)} w={130} text={LA01_LABELS[c]} />
        <SvgText x={650} y={ROW_Y(i) + 17} fill={C.ink} fontSize={15} fontWeight={800}>{String(TOWER_COUNTS[i])}</SvgText>
      </> : null}
      {Array.from({ length: TOWER_COUNTS[i] }, (_, k) => <CodeStone key={k} x={STACK_X + k * (STACK_W + STACK_GAP)} y={ROW_Y(i)} value={c} w={STACK_W} />)}
    </g>)}
    <line x1={326} x2={670} y1={ROW_Y(5)} y2={ROW_Y(5)} stroke="#9aa4ad" strokeWidth={1.2} />
    {table ? <>
      <SvgText x={342} y={MISS_Y + 17} fontSize={13}>−9</SvgText>
      <Sticker x={364} y={MISS_Y} w={130} text="KEINE ANGABE" />
      <SvgText x={650} y={MISS_Y + 17} fill={C.mute} fontSize={15} fontWeight={800}>{String(TOWER_EMPTY)}</SvgText>
      <Bracket x={684} y1={ROW_Y(0)} y2={ROW_Y(4) + STONE_H} />
      <SvgText x={694} y={ROW_Y(2) + 10} textAnchor="start" fill={C.ink} fontWeight={800}>{`Total valid ${TOWER_VALID}`}</SvgText>
      <Bracket x={684} y1={MISS_Y} y2={MISS_Y + STONE_H} color={C.mute} />
      <SvgText x={694} y={MISS_Y + 17} textAnchor="start" fontWeight={800}>{`Total missing ${TOWER_EMPTY}`}</SvgText>
      <Bracket x={840} y1={ROW_Y(0) - 4} y2={MISS_Y + STONE_H + 4} />
      <SvgText x={848} y={ROW_Y(3) - 2} textAnchor="start" fill={C.ink} fontWeight={800}>Total</SvgText>
      <SvgText x={848} y={ROW_Y(3) + 14} textAnchor="start" fill={C.ink} fontWeight={800}>{String(TOWER12.length)}</SvgText>
    </> : <SvgText x={STACK_X - 8} y={MISS_Y + 17} textAnchor="end" fontSize={12} fontWeight={700}>−9 KEINE ANGABE</SvgText>}
    <CodeStone x={STACK_X} y={MISS_Y} value={null} w={STACK_W} />
  </g>;
}

/**
 * Bild B1 „Vom Turm zur Tabelle“: twelve stones of la01 (an example), sorted into stacks, then read as a table.
 * The text of the current step is announced (aria-live); the whole text version sits below the picture.
 */
export function TowerToTable() {
  const [step, setStep] = useState(0);
  return <>
    <StepNav steps={['Datenreihe', 'Häufigkeiten', 'Tabelle']} current={step} onSelect={setStep} />
    <div className="grafik">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" aria-hidden="true" focusable="false">
        <SvgText x={16} y={22} textAnchor="start" fontStyle="italic" fontSize={12.5}>zum Beispiel zwölf Befragte</SvgText>
        <Tower moved={step > 0} />
        {step > 0 ? <Stacks table={step === 2} /> : null}
      </svg>
    </div>
    <p className="sr-only" aria-live="polite">{TOWER_TEXT[step]}</p>
    <TextVersion><p>{TOWER_TEXT.join(' ')}</p></TextVersion>
  </>;
}
