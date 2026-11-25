import { useRef, useState } from 'react';
import { LS01, LS01_MISSING, LS01_N, ZW } from '../content';
import { Bars, SvgText, de, useFocusLater, whole } from './Bars';

const VALUES = [...Array(11).keys()];
/** The 20 valid stones of the tower, counted per value 0 to 10. */
const COUNTS20 = VALUES.map(i => ZW.filter(v => v === i).length);
const VALID20 = COUNTS20.reduce((a, b) => a + b, 0);
const MISSING20 = ZW.filter(v => v === null).length;
/** Values nobody in the tower gave („0 bis 3“). */
const EMPTY20 = VALUES.filter(i => !COUNTS20[i]);
/** In the view with all answers one stone stands for this many people (rounded), 30 stones for the highest stack. */
const STONES_ALL = 30;
const MODE = LS01.indexOf(Math.max(...LS01));
const PER_STONE = Math.round(LS01[MODE] / STONES_ALL);

export type TowerStage = 0 | 1 | 2;

/** Text version of the tower picture for each stage. */
export function towerText(stage: TowerStage): string {
  if (stage === 0) return `Die Variable ls01 als Turm mit ${ZW.length} Steinen, je ein Wert, ungeordnet: ${ZW.map(v => (v === null ? 'NA, ein leerer Stein' : v)).join(', ')}.`;
  if (stage === 1) {
    const empty = EMPTY20.length ? ` Die Werte ${EMPTY20[0]} bis ${EMPTY20[EMPTY20.length - 1]} hat niemand angegeben.` : '';
    return `Sortiert: ${COUNTS20.map((a, i) => (a ? `${a} Steine bei ${i}` : '')).filter(Boolean).join(', ')}. Jeder Stapel zeigt eine Häufigkeit; der fehlende Wert liegt auf keinem Stapel.${empty}`;
  }
  return `Alle ${whole(LS01_N)} gültigen Werte, ein Stein für ${PER_STONE} Befragte. Die größte Häufigkeit, der höchste Stapel, liegt bei ${MODE} mit ${whole(LS01[MODE])} Befragten.`;
}

function Tower() {
  const w = 640, h = 290;
  return <svg viewBox={`0 0 ${w} ${h}`} width="100%" aria-hidden="true" focusable="false">
    <rect x={210} y={h - 18} width={220} height={14} rx={4} fill="#C6ECE8" />
    {ZW.map((v, j) => {
      const y = h - 32 - j * 12, empty = v === null;
      return <g key={j}>
        <rect x={286} y={y} width={68} height={10.5} rx={2.5} fill={empty ? '#fff' : '#86B9DE'} stroke={empty ? '#5F6A74' : '#5f97c2'}
          strokeWidth={empty ? 1.2 : 0.8} strokeDasharray={empty ? '3 2' : undefined} />
        <SvgText x={320} y={y + 9} fontSize={10} fill="#1E2D3C" fontWeight={700}>{empty ? 'NA' : String(v)}</SvgText>
      </g>;
    })}
    <rect x={290} y={4} width={60} height={20} rx={6} fill="#1E2D3C" />
    <SvgText x={320} y={18} fill="#fff" fontFamily="JetBrains Mono,monospace" fontSize={12}>ls01</SvgText>
  </svg>;
}

/**
 * Grundlage 1b „Vom Turm zum Stapel“: the tower ls01 of 21 people, sorted into stacks, then all 5.164 answers.
 * The text version below the picture changes with each stage (aria-live).
 */
export function TowerToStack() {
  const [stage, setStage] = useState<TowerStage>(0);
  const next = useRef<HTMLButtonElement>(null);
  const table = useRef<HTMLTableElement>(null);
  const focusLater = useFocusLater();

  const text = towerText(stage);

  return <>
    <div className="grafik">
      {stage === 0 ? <Tower /> : null}
      {stage === 1 ? <Bars values={VALUES} counts={COUNTS20} w={760} h={230} right={128} stones={Math.max(...COUNTS20)}>
        <g>
          <rect x={660} y={196} width={60} height={12} rx={2.5} fill="#fff" stroke="#5F6A74" strokeDasharray="3 2" strokeWidth={1.2} />
          <SvgText x={690} y={206} fontSize={10} fill="#1E2D3C" fontWeight={700}>NA</SvgText>
          <SvgText x={690} y={186} fontSize={11}>auf keinem Stapel</SvgText>
        </g>
      </Bars> : null}
      {stage === 2 ? <>
        <Bars values={VALUES} counts={LS01} h={260} stones={STONES_ALL} highlight={MODE} minStone />
        <p className="hilfe-zeile">{`Ein Stein steht jetzt für ${PER_STONE} Befragte (gerundet), jeder Wert zählt mit. Hervorgehoben: der Stapel bei ${MODE}, die größte Häufigkeit.`}</p>
      </> : null}
    </div>
    <p className="sr-only" aria-live="polite">{text}</p>
    <div className="reihe-knoepfe">
      {stage === 0 ? <button type="button" className="knopf" onClick={() => { setStage(1); focusLater(() => next.current); }}>Steine nach Wert sortieren</button> : null}
      {stage === 1 ? <button type="button" className="knopf hell" ref={next} onClick={() => { setStage(2); focusLater(() => table.current); }}>{`Jetzt mit allen ${whole(LS01_N)} Antworten`}</button> : null}
    </div>
    {stage > 0 ? <div>
      <table className="daten" ref={table} tabIndex={stage === 2 ? -1 : undefined}>
        <caption>Häufigkeitstabelle: der Stapel als Zahlen</caption>
        <thead><tr><th scope="col">Wert</th><th scope="col">Steine (Anzahl)</th><th scope="col">Anteil</th></tr></thead>
        {stage === 1
          ? <tbody>
              {COUNTS20.map((a, i) => <tr key={i}><td>{i}</td><td>{a}</td><td>{`${de(a / VALID20 * 100, 0)} %`}</td></tr>)}
              <tr><th scope="row">gültig zusammen</th><td>{VALID20}</td><td>100 %</td></tr>
              <tr><th scope="row">fehlend (NA)</th><td>{MISSING20}</td><td>zählt nicht mit</td></tr>
            </tbody>
          : <tbody>
              {LS01.map((a, i) => <tr key={i}><td>{i}</td><td>{whole(a)}</td><td>{`${de(a / LS01_N * 100, 1)} %`}</td></tr>)}
              <tr><th scope="row">gültig zusammen</th><td>{whole(LS01_N)}</td><td>100 %</td></tr>
              <tr><th scope="row">fehlend</th><td>{LS01_MISSING}</td><td>zählt nicht mit</td></tr>
            </tbody>}
      </table>
    </div> : null}
  </>;
}
