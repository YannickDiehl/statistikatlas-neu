import { useState } from 'react';
import { BASES_TEXT, CDU_BASES_TEXT, PV01, ST01, STONES_ALL, STONES_TEXT, STONES_VALID } from '../content';
import { C, SvgText, de, whole } from './util';

type Base = 'all' | 'valid';
/** Colours with at least 3:1 against the page: green, dark orange, ink; missing stones are dashed and empty. */
const FILL = ['#2f7a4f', '#C26A3C', '#1E2D3C'];
const NAMES = ['kann trauen', 'vorsichtig sein', 'kommt darauf an'];

/** Stone colours in reading order (row by row): trust, careful, depends, then missing (null). */
export function stoneOrder(base: Base): (number | null)[] {
  const [trust, careful, depends, , missing = 0] = base === 'all' ? STONES_ALL : STONES_VALID;
  return [...Array(trust).fill(0), ...Array(careful).fill(1), ...Array(depends).fill(2), ...Array(missing).fill(null)];
}

function Grid({ base }: { base: Base }) {
  const cells = stoneOrder(base), s = 26;
  return <svg viewBox={`0 0 ${10 * s + 4} ${10 * s + 4}`} width="100%" aria-hidden="true" focusable="false">
    {cells.map((c, i) => {
      const x = 2 + (i % 10) * s, y = 2 + Math.floor(i / 10) * s;
      return c === null
        ? <rect key={i} x={x + 2} y={y + 2} width={s - 4} height={s - 4} rx={4} fill="#fff" stroke={C.mute} strokeWidth={1.3} strokeDasharray="3 2.5" />
        : <g key={i}>
            <rect x={x + 2} y={y + 2} width={s - 4} height={s - 4} rx={4} fill={FILL[c]} />
            <circle cx={x + s / 2} cy={y + s / 2} r={6} fill="none" stroke="#fff" strokeOpacity={0.55} strokeWidth={2} />
          </g>;
    })}
  </svg>;
}

/**
 * Bild B5 „Prozent wovon?“: hundred stones for st01, one per percent, with the base switched between all 5.246
 * and the 3.560 valid answers. The legend carries the numbers; the text version changes with the base (aria-live).
 */
export function HundredStones() {
  const [base, setBase] = useState<Base>('all');
  const pct = base === 'all' ? [ST01.trust.raw, ST01.careful.raw, ST01.depends.raw] : [ST01.trust.valid, ST01.careful.valid, ST01.depends.valid];
  const big = base === 'all' ? Math.round(ST01.depends.raw) : Math.round(ST01.depends.valid);
  return <>
    <div className="reihe-knoepfe s3-druck" role="group" aria-label="Basis wählen">
      <button type="button" className="knopf hell" aria-pressed={base === 'all'} onClick={() => setBase('all')}>{`Basis: alle ${whole(5246)} Befragten`}</button>
      <button type="button" className="knopf hell" aria-pressed={base === 'valid'} onClick={() => setBase('valid')}>{`Basis: ${whole(ST01.valid)} gültige Antworten`}</button>
    </div>
    <div className="s3-hundert">
      <div className="s3-raster"><Grid base={base} /></div>
      <ul className="s3-legende">
        <li className="s3-basis">{base === 'all' ? `Basis: alle ${whole(5246)}` : `Basis: ${whole(ST01.valid)} gültige`}</li>
        {NAMES.map((n, i) => <li key={n}><i style={{ background: FILL[i] }} aria-hidden="true"></i>{`${n} ${de(pct[i], 1)} %`}</li>)}
        {base === 'all' ? <li><i className="s3-leer-chip" aria-hidden="true"></i>{`fehlt ${de(ST01.rawMissing, 1)} %`}</li> : null}
        <li className="gross">{`kommt darauf an: ${big} %`}</li>
      </ul>
    </div>
    <p className="hilfe-zeile">„Sonstiges“ (7 Personen, unter 1 %) bekommt keinen eigenen Stein. ALLBUS 2023, ungewichtet.</p>
    <p className="sr-only" aria-live="polite">{STONES_TEXT[base]}</p>
  </>;
}

/** Bild B6 „Eine eigene Basis rechnen“: one numerator, three bases. */
export function ThreeBases() {
  const rows: [string, string, string][] = [
    [`alle ${whole(5246)}`, de(ST01.depends.raw), 'Raw %'],
    [`gültige ${whole(ST01.valid)}`, de(ST01.depends.valid), 'Valid %'],
    [`gültige plus „weiß nicht“ ${whole(ST01.valid)} + ${ST01.missing.dontKnow} = ${whole(ST01.valid + ST01.missing.dontKnow)}`, de(ST01.ownBase), 'eigene Basis'],
  ];
  return <div className="formel s3-formel" role="img" aria-label={BASES_TEXT}>
    <span className="s3-zaehler">{whole(ST01.depends.n)}</span>
    <span>Steine im Stapel, geteilt durch:</span>
    <ul className="s3-eingesetzt">{rows.map(([b, v, name]) => <li key={name}>{`${b} → ${v} (${name})`}</li>)}</ul>
  </div>;
}

/** Bild B7 „Ein Zähler, drei Nenner“ (static): 988 CDU-CSU stones over three plates of different length, no results. */
export function OneNumeratorThreeBases() {
  const W = 760, plateY = 150, scale = 220 / PV01.total;
  const plates = [
    { x: 30, n: PV01.total, label: `alle Befragten ${whole(PV01.total)}`, col: 'Raw %', part: { n: PV01.totalMissing, text: `fehlt ${whole(PV01.totalMissing)}`, fill: '#D5DADF' } },
    { x: 280, n: PV01.valid + PV01.missing.dontKnow, label: `gültige plus „weiß nicht“ ${whole(PV01.valid)} + ${PV01.missing.dontKnow}`, col: 'deine Basis (Vorlage)', part: { n: PV01.missing.dontKnow, text: `weiß nicht ${PV01.missing.dontKnow}`, fill: '#FFF6DA' } },
    { x: 530, n: PV01.valid, label: `gültige ${whole(PV01.valid)}`, col: 'Valid %', part: null },
  ];
  return <figure className="ebild">
    <div className="ebild-bild" role="img" aria-label={CDU_BASES_TEXT}>
      <svg viewBox={`0 0 ${W} 250`} width="100%" aria-hidden="true" focusable="false">
        <g>
          {Array.from({ length: 6 }, (_, k) => <rect key={k} x={300 + k * 27} y={20} width={24} height={22} rx={3} fill={C.blue} stroke={C.blueStroke} />)}
          <rect x={300} y={46} width={159} height={22} rx={4} fill={C.yellow} stroke={C.yellowStroke} />
          <SvgText x={380} y={61} fontSize={12} fill={C.ink} fontWeight={800}>CDU-CSU</SvgText>
          <SvgText x={474} y={38} textAnchor="start" fontSize={18} fill={C.ink} fontWeight={800}>{String(PV01.cdu.n)}</SvgText>
          <SvgText x={474} y={58} textAnchor="start" fontSize={12}>Steine im Stapel</SvgText>
        </g>
        {plates.map(p => {
          const w = p.n * scale;
          return <g key={p.col}>
            <line x1={p.x} x2={p.x + 220} y1={plateY - 34} y2={plateY - 34} stroke={C.ink} strokeWidth={2.5} />
            <rect x={p.x} y={plateY - 18} width={w} height={22} rx={4} fill={C.plate} stroke="#86CBC3" />
            {p.part ? <rect x={p.x + w - p.part.n * scale} y={plateY - 18} width={p.part.n * scale} height={22} rx={4} fill={p.part.fill} stroke={C.mute} strokeDasharray="3 2" /> : null}
            {p.part ? <SvgText x={p.x + w - p.part.n * scale / 2} y={plateY + 20} fontSize={11}>{p.part.text}</SvgText> : null}
            <SvgText x={p.x + 110} y={plateY + 42} fontSize={12} fill={C.ink} fontWeight={700}>{p.label}</SvgText>
            <SvgText x={p.x + 110} y={plateY + 62} fontSize={12.5} fill={C.blueDark} fontWeight={800}>{p.col}</SvgText>
          </g>;
        })}
        <SvgText x={W - 10} y={plateY + 88} textAnchor="end" fontSize={11.5} fontStyle="italic">kleinere Basis, größerer Anteil</SvgText>
      </svg>
    </div>
    <figcaption>Ein Zähler, drei Nenner: dieselben 988 Antworten CDU-CSU über drei verschieden langen Basen. <span>Die Ergebnisse stehen nicht im Bild; Raw % und Valid % liest du in der Tabelle ab, deine Basis rechnet die Vorlage.</span></figcaption>
  </figure>;
}
