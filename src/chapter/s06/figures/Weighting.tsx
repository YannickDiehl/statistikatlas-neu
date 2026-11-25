// Thema 1 „Gewichtung“: Schätzen (s6-schaetzen-ost, s6-stichprobe), Gewicht als Bruch (s6-gewicht-bausteine),
// Mischpult (s6-mischpult) und die Beispieltabelle zu Cum. % (s6-cum-lesen).
import { useRef, useState } from 'react';
import { CAT, CAT_DARK } from '../../../tasks/kit/palette';
import { ALT, EASTWEST, MIX_P, NONE, NONE_EAST, NONE_WEST, WEIGHT, mix } from '../content';
import { Picture, SvgText, de, useFocusLater, whole } from './util';

const WEST = CAT[0], EAST = CAT[1], GRAY = '#d9d6ce';

/** Bauplatte aus 10 × 10 Steinen: die letzten `east` Steine in Ost-Farbe; ohne `east` alle grau. */
export function Plate({ east, title }: { east: number | null; title?: string }) {
  const s = 22, gap = 3, size = 10 * (s + gap) + gap, top = title ? 22 : 0;
  return <svg viewBox={`0 0 ${size} ${size + top}`} width="100%" aria-hidden="true" focusable="false" className="s6-platte">
    {title ? <SvgText x={size / 2} y={15} fontWeight={800} fill="#1E2D3C">{title}</SvgText> : null}
    {Array.from({ length: 100 }, (_, i) => {
      const fill = east === null ? GRAY : i >= 100 - east ? EAST : WEST;
      return <rect key={i} x={gap + (i % 10) * (s + gap)} y={top + gap + Math.floor(i / 10) * (s + gap)} width={s} height={s} rx={3} fill={fill} stroke="#fff" strokeWidth={0.5} />;
    })}
  </svg>;
}

/** Rückmeldung zum Tipp t (Befragte aus dem Osten von 100). */
export function estimateFeedback(t: number): string {
  if (t <= 22) return 'Du hast ungefähr den Anteil in der Bevölkerung getippt. Im ALLBUS sind es fast doppelt so viele: 32 von 100.';
  if (t <= 40) return 'Nah dran: 32 von 100 Befragten wohnen im Osten. In der Bevölkerung sind es nur 17.';
  return 'So viele sind es nicht: 32 von 100 Befragten wohnen im Osten, in der Bevölkerung 17.';
}

/** 1a: Wie viele von 100 Befragten wohnen im Osten? Regler, Tipp sperren, dann zwei Bauplatten (Stichprobe, Deutschland). */
export function EstimateEast() {
  const [t, setT] = useState(50);
  const [touched, setTouched] = useState(false);
  const [locked, setLocked] = useState(false);
  const feedback = useRef<HTMLParagraphElement>(null);
  const focusLater = useFocusLater();
  const sample = Math.round(EASTWEST.east.pct), germany = Math.round(EASTWEST.east.wPct);

  function reveal() {
    setLocked(true);
    focusLater(() => feedback.current);
  }

  return <div className="s6-schaetzen">
    <div className="feld">
      <label htmlFor="s6-ost-tipp">Befragte aus dem Osten (von 100)</label>
      <input type="range" id="s6-ost-tipp" min={0} max={100} step={1} value={t} disabled={locked} aria-valuetext={`${t} von 100`}
        onChange={e => { setT(Number(e.target.value)); setTouched(true); }} />
      <output htmlFor="s6-ost-tipp" aria-live="off">{t}</output>
    </div>
    {locked ? <Picture text={ALT.stichprobe} className="s6-stichprobe">
      <div className="s6-platten">
        <Plate east={sample} title="ALLBUS (Stichprobe)" />
        <Plate east={germany} title="Deutschland" />
      </div>
    </Picture> : null}
    <div className="s6-platten eine"><Plate east={touched || locked ? t : null} title={locked ? 'dein Tipp' : undefined} /></div>
    <p className="legende"><span><i style={{ background: WEST }} />West</span><span><i style={{ background: EAST }} />Ost</span></p>
    <div className="reihe-knoepfe">
      <button type="button" className="knopf" aria-disabled={locked || undefined} onClick={() => { if (!locked) reveal(); }}>Tipp abgeben und aufdecken</button>
    </div>
    <p className={`rueck${locked ? ' fest' : ''}`} aria-live="polite" tabIndex={-1} ref={feedback} id="s6-ost-r">{locked ? estimateFeedback(t) : ''}</p>
  </div>;
}

/** 1b: Gewicht = Anteil in Deutschland geteilt durch Anteil in der Stichprobe, als Bausteine; Liste als Textfassung. */
export function WeightBricks() {
  const rows = [
    { name: 'West', color: WEST, de: EASTWEST.west.wPct, sample: EASTWEST.west.pct, w: WEIGHT.west, say: 'Eine Person aus dem Westen zählt wie 1,22 Personen.' },
    { name: 'Ost', color: EAST, de: EASTWEST.east.wPct, sample: EASTWEST.east.pct, w: WEIGHT.east, say: 'Eine Person aus dem Osten zählt wie gut eine halbe Person.' },
  ];
  const probe = `${whole(EASTWEST.west.n)} Befragte im Westen mal 1,22 ergibt etwa ${whole(EASTWEST.west.wSum)}. ${whole(EASTWEST.east.n)} Befragte im Osten mal 0,53 ergibt etwa ${whole(EASTWEST.east.wSum)}. Zusammen ${whole(EASTWEST.total)}: so viele wie vorher, nur anders verteilt.`;
  return <figure className="ebild s6-bild">
    <div aria-hidden="true">
      <div className="formel">
        <span className="s6-stein">Gewicht</span><span>=</span>
        <span className="frac"><span>Anteil in Deutschland</span><span>Anteil in der Stichprobe</span></span>
      </div>
      <div className="s6-gewicht">
        <div>
          {rows.map(r => <div className="formel s6-zeile" key={r.name} style={{ borderColor: r.color }}>
            <b>{r.name}:</b>
            <span className="frac"><span>{`${de(r.de, 2)} %`}</span><span>{`${de(r.sample, 2)} %`}</span></span>
            <span>=</span><span className="gross">{de(r.w, 2)}</span>
            <span className="s6-satz">{r.say}</span>
          </div>)}
        </div>
        <div className="s6-stapel">
          {[0, 1, 2].map(i => <span key={`w${i}`} className="s6-breit" style={{ background: WEST }}>1,22</span>)}
          {[0, 1, 2].map(i => <span key={`o${i}`} className="s6-schmal" style={{ background: EAST }}>0,53</span>)}
          <small>Beispielsteine, kein echter Befragter</small>
        </div>
      </div>
      <p className="s6-probe"><b>Probe:</b> {probe}</p>
    </div>
    <ul className="sr-only">
      <li>Formel: Gewicht gleich Anteil in Deutschland geteilt durch Anteil in der Stichprobe.</li>
      {rows.map(r => <li key={r.name}>{`${r.name}: ${de(r.de, 2)} % geteilt durch ${de(r.sample, 2)} % gleich ${de(r.w, 2)}. ${r.say}`}</li>)}
      <li>{`Probe: ${probe}`}</li>
    </ul>
  </figure>;
}

/** Text unter dem Mischpult für den Ost-Anteil p (in %). */
export function mixText(p: number): string {
  const total = de(mix(p / 100), 1);
  if (Math.abs(p - MIX_P.sample) < 1e-9) return `Ost-Anteil 32,0 %: insgesamt ${total} % ohne Konfession. So rechnet der ALLBUS ohne Gewicht.`;
  if (Math.abs(p - MIX_P.germany) < 1e-9) return `Ost-Anteil 16,8 %: insgesamt ${total} % ohne Konfession. So rechnet der ALLBUS mit Gewicht.`;
  return `Ost-Anteil ${de(p, Number.isInteger(p) ? 0 : 1)} %: insgesamt ${total} % ohne Konfession.`;
}

/** 1c: Mischpult. Der Ost-Anteil verschiebt den Gesamtanteil „keine Konfession“ zwischen den Prozentwerten im Westen und im Osten. */
export function MixingDesk() {
  const [p, setP] = useState<number>(MIX_P.sample);
  const total = mix(p / 100);
  const w = 500, h = 104, l = 16, r = 16, y = 44, x = (v: number) => l + v / 100 * (w - l - r);
  return <div className="s6-mischpult">
    <div className="formel" role="group" aria-label="Formel: Anteil in ganz Deutschland gleich Anteil West an allen mal Prozent im Westen plus Anteil Ost an allen mal Prozent im Osten.">
      <span className="s6-stein" aria-hidden="true">Anteil in ganz Deutschland</span><span aria-hidden="true">=</span>
      <span className="s6-stein" aria-hidden="true" style={{ borderColor: WEST }}>Anteil West an allen</span><span aria-hidden="true">mal</span>
      <span className="s6-stein" aria-hidden="true" style={{ borderColor: WEST }}>Prozent im Westen</span><span aria-hidden="true">+</span>
      <span className="s6-stein" aria-hidden="true" style={{ borderColor: EAST }}>Anteil Ost an allen</span><span aria-hidden="true">mal</span>
      <span className="s6-stein" aria-hidden="true" style={{ borderColor: EAST }}>Prozent im Osten</span>
    </div>
    <div className="feld">
      <label htmlFor="s6-mischpult-p">Anteil der Befragten aus dem Osten</label>
      <input type="range" id="s6-mischpult-p" min={0} max={100} step={0.1} value={p} aria-valuetext={`${de(p, Number.isInteger(p) ? 0 : 1)} %`}
        onChange={e => setP(Number(e.target.value))} />
      <output htmlFor="s6-mischpult-p" aria-live="off">{`${de(p, Number.isInteger(p) ? 0 : 1)} %`}</output>
    </div>
    <div className="reihe-knoepfe">
      <button type="button" className="knopf hell" aria-pressed={p === MIX_P.sample} onClick={() => setP(MIX_P.sample)}>wie im ALLBUS (32,0 %)</button>
      <button type="button" className="knopf hell" aria-pressed={p === MIX_P.germany} onClick={() => setP(MIX_P.germany)}>wie in Deutschland (16,8 %)</button>
    </div>
    <div className="grafik">
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" aria-hidden="true" focusable="false">
        <rect x={x(0)} y={y} width={x(100) - x(0)} height={22} rx={4} fill="#f2efe8" stroke="#9aa4ad" />
        <rect x={x(0)} y={y} width={x(total) - x(0)} height={22} rx={4} fill={CAT[5]} />
        {[{ v: NONE.wWestPct, t: 'nur West', c: CAT_DARK[0] }, { v: NONE.wEastPct, t: 'nur Ost', c: CAT_DARK[1] }].map(m => <g key={m.t}>
          <line x1={x(m.v)} x2={x(m.v)} y1={y - 8} y2={y + 30} stroke={m.c} strokeWidth={2} strokeDasharray="4 3" />
          <SvgText x={x(m.v)} y={y - 12} fontSize={13} fill={m.c} fontWeight={700}>{`${m.t}: ${de(m.v, 1)} %`}</SvgText>
        </g>)}
        <SvgText x={x(total)} y={y + 50} fontSize={15} fill="#1E2D3C" fontWeight={800}>{`${de(total, 1)} %`}</SvgText>
        {[0, 100].map(v => <SvgText key={v} x={x(v)} y={y + 50} fontSize={13} textAnchor={v ? 'end' : 'start'}>{`${v} %`}</SvgText>)}
      </svg>
    </div>
    <p className="rueck text" aria-live="polite">{mixText(p)}</p>
    <ul className="s6-rechnung">
      <li><b>ohne Gewicht:</b> 0,68 × 33,7 + 0,32 × 77,4 = 22,9 + 24,8 = 47,7 %</li>
      <li><b>mit Gewicht:</b> 0,832 × 33,66 + 0,168 × 77,55 = 28,0 + 13,0 = 41,0 %</li>
    </ul>
    <p className="sr-only">{`${ALT.mischpult} Die Prozentwerte mit Gewicht genau: ${de(NONE_WEST, 2)} % im Westen, ${de(NONE_EAST, 2)} % im Osten.`}</p>
  </div>;
}

/** Am Schritt von Aufgabe 1: Beispieltabelle, die Cum. % als Summe der Valid % zeigt. */
export function CumTable() {
  const rows = [[1, 10, 10, 10], [2, 30, 30, 40], [3, 40, 40, 80], [4, 20, 20, 100]];
  return <Picture text={ALT.cumLesen} caption={<>Cum. % zählt die Prozente von oben zusammen. <span>Beispieltabelle</span></>}>
    <div className="s6-cum">
      <table className="daten">
        <thead><tr><th>Code</th><th>N</th><th>Valid %</th><th>Cum. %</th></tr></thead>
        <tbody>{rows.map(([c, n, v, cum]) => <tr key={c}>
          <td>{c}</td><td>{n}</td>
          <td className={c <= 2 ? 's6-mark' : undefined}>{v}</td>
          <td className={c === 2 ? 's6-mark' : undefined}>{cum}</td>
        </tr>)}</tbody>
      </table>
      <p className="s6-klammer">10 + 30 = 40: alle mit Code 1 oder 2</p>
    </div>
  </Picture>;
}
