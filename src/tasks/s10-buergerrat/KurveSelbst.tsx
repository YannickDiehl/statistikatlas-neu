import { useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import type { SavFile } from '../../sandbox/readSav';
import { de } from '../kit/numbers';
import { CAT_DARK, ROLE } from '../kit/palette';
import { PERSONS, type PersonId } from './content';
import {
  AGE_MAX, AGE_STEP, clampCurve, CURVE_START, curveLogit, curveProb, curveStep, fitCurve, LOGIT_MAX, midAge, sameCurve, shiftMid, smartphoneData, type Curve,
} from './domain';

/** Zwei gleich gebaute Bilder: links Logit (Gerade), rechts Wahrscheinlichkeit (S-Kurve), beide über dem Alter 0–100. */
const W = 340, H = 250, L = 40, R = 16, T = 12, B = 40;
const px = (age: number) => L + (age / AGE_MAX) * (W - L - R);
const ageAt = (x: number) => ((x - L) / (W - L - R)) * AGE_MAX;
const pyLogit = (l: number) => T + ((LOGIT_MAX - l) / (2 * LOGIT_MAX)) * (H - T - B);
const logitAt = (y: number) => LOGIT_MAX - ((y - T) / (H - T - B)) * 2 * LOGIT_MAX;
const pyProb = (p: number) => T + (1 - p) * (H - T - B);
const AGE_TICKS = [0, 20, 40, 60, 80, 100];
const IDS: PersonId[] = ['jana', 'wiegand'];
/** Personen ohne Rollenfarbe: Orange gehört den echten Daten, Blau der eigenen Kurve, Türkis der Kurve aus R. */
const PERSON_COLOR: Record<PersonId, string> = { jana: CAT_DARK[7], wiegand: CAT_DARK[4] };
const YOU = ROLE.guess, DATA = ROLE.data, MODEL = ROLE.model;

const signed = (x: number, d: number) => { const v = Number(x.toFixed(d)); return `${v > 0 ? '+' : ''}${de(v === 0 ? 0 : x, d)}`; };
/** Chancen mit sinnvoller Genauigkeit – von 0,0003 bis 3.000. */
const odds = (x: number) => de(x, x >= 100 ? 0 : x >= 10 ? 1 : x >= 0.1 ? 2 : x >= 0.01 ? 3 : 4);
const pct = (p: number) => de(100 * p, 1);
/** „0,00 + 0,00 × Jahrzehnte“ bzw. „7,84 − 1,00 × Jahrzehnte“ */
const formula = (c: Curve) => `${de(c.a, 2)} ${c.b < 0 ? '−' : '+'} ${de(Math.abs(c.b), 2)} × Jahrzehnte`;
const path = (f: (age: number) => number, py: (v: number) => number) =>
  Array.from({ length: 101 }, (_, i) => `${i ? 'L' : 'M'}${px(i).toFixed(1)} ${py(f(i)).toFixed(1)}`).join(' ');

type HandleId = 'a' | 'b' | 'mid';

/** Ein Griff: großer unsichtbarer Trefferkreis, sichtbarer Ring; ziehbar (Maus, Finger, Stift) und mit Pfeiltasten bedienbar. */
function Handle({ id, x, y, label, valueText, value, min, max, horizontal, dragging, onDown, onMove, onUp, onKey }: {
  id: HandleId; x: number; y: number; label: string; valueText: string; value: number; min: number; max: number; horizontal?: boolean; dragging: boolean;
  onDown: (id: HandleId, e: PointerEvent<SVGGElement>) => void; onMove: (e: PointerEvent<SVGGElement>) => void; onUp: (e: PointerEvent<SVGGElement>) => void;
  onKey: (id: HandleId, e: KeyboardEvent<SVGGElement>) => void;
}) {
  return <g className={`s10-eye-handle${dragging ? ' is-dragging' : ''}`} role="slider" tabIndex={0} aria-label={label} aria-valuetext={valueText}
    aria-valuenow={Number(value.toFixed(2))} aria-valuemin={Number(min.toFixed(2))} aria-valuemax={Number(max.toFixed(2))} aria-orientation={horizontal ? 'horizontal' : 'vertical'}
    onPointerDown={e => onDown(id, e)} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} onKeyDown={e => onKey(id, e)}>
    <circle className="s10-eye-hit" cx={x} cy={y} r={18} />
    <circle className="s10-eye-knob" cx={x} cy={y} r={8} />
  </g>;
}

/** Einstieg Sitzung 11: Konstante und B selbst einstellen. Links die Gerade in Logits, rechts dieselbe Kurve als Wahrscheinlichkeit.
 *  Jana (24) und Herr Wiegand (67) stehen an ihrem Alter auf der eigenen Kurve; derselbe Schritt (zehn Jahre älter) in Logit, Chance und Wahrscheinlichkeit.
 *  Danach – erst festlegen, dann vergleichen – die echten Anteile aus dem ALLBUS (orange) und die Kurve aus R (türkis). */
export function KurveSelbst({ sav }: { sav: SavFile }) {
  const data = useMemo(() => smartphoneData(sav), [sav]);
  const [curve, setCurve] = useState<Curve>(CURVE_START);
  const [showData, setShowData] = useState(false);
  const [showR, setShowR] = useState(false);
  const [drag, setDrag] = useState<HandleId | null>(null);
  const logitSvg = useRef<SVGSVGElement>(null), probSvg = useRef<SVGSVGElement>(null);
  const changed = !sameCurve(curve, CURVE_START);
  const rCurve = data?.fit ? fitCurve(data.fit) : null;
  const mid = midAge(curve);
  const midVisible = mid !== null && mid >= 0 && mid <= AGE_MAX;
  const steps = Object.fromEntries(IDS.map(id => [id, curveStep(curve, PERSONS[id].age)])) as Record<PersonId, ReturnType<typeof curveStep>>;
  // Grenzen von B bei fester Konstante (der Griff am rechten Rand bleibt im Bild)
  const bMin = (-LOGIT_MAX - curve.a) / 10, bMax = (LOGIT_MAX - curve.a) / 10;
  const aMin = Math.max(-LOGIT_MAX, -LOGIT_MAX - 10 * curve.b), aMax = Math.min(LOGIT_MAX, LOGIT_MAX - 10 * curve.b);

  const svgPoint = (e: PointerEvent<SVGGElement>, svg: SVGSVGElement | null) => {
    const m = svg?.getScreenCTM();
    if (!m) return null;
    return new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
  };
  const apply = (id: HandleId, e: PointerEvent<SVGGElement>) => {
    if (id === 'mid') {
      const pt = svgPoint(e, probSvg.current);
      if (pt) setCurve(c => shiftMid(c, Math.min(AGE_MAX, Math.max(0, ageAt(pt.x)))));
      return;
    }
    const pt = svgPoint(e, logitSvg.current);
    if (!pt) return;
    const l = logitAt(pt.y);
    setCurve(c => (id === 'a' ? clampCurve({ a: l, b: c.b }, 'b') : clampCurve({ a: c.a, b: (l - c.a) / 10 }, 'a')));
  };
  const onDown = (id: HandleId, e: PointerEvent<SVGGElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    (e.currentTarget as SVGGElement).focus?.();
    setDrag(id);
    apply(id, e);
  };
  const onMove = (e: PointerEvent<SVGGElement>) => { if (drag) apply(drag, e); };
  const onUp = (e: PointerEvent<SVGGElement>) => {
    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    setDrag(null);
  };
  const onKey = (id: HandleId, e: KeyboardEvent<SVGGElement>) => {
    const dir = ({ ArrowUp: 1, ArrowRight: 1, PageUp: 10, ArrowDown: -1, ArrowLeft: -1, PageDown: -10 } as Record<string, number>)[e.key];
    if (!dir) return;
    e.preventDefault();
    const by = dir * (e.shiftKey ? 10 : 1);
    setCurve(c => id === 'a' ? clampCurve({ a: c.a + 0.1 * by, b: c.b }, 'b')
      : id === 'b' ? clampCurve({ a: c.a, b: c.b + 0.02 * by }, 'a')
      : midAge(c) === null ? c : shiftMid(c, Math.min(AGE_MAX, Math.max(0, Math.round(midAge(c)! + by)))));
  };
  const handleProps = { onDown, onMove, onUp, onKey };
  const reset = () => { setCurve(CURVE_START); setShowData(false); setShowR(false); };

  /** Gemeinsamer Rahmen beider Bilder: Raster, Achsen, grauer Bereich ohne Befragte (unter 18). */
  const frame = (yTicks: number[], py: (v: number) => number, yLabel: (v: number) => string, emphasis: number) => <>
    <rect x={px(0)} y={T} width={px(18) - px(0)} height={H - T - B} fill={ROLE.grid} opacity={0.6} />
    {yTicks.map(v => <g key={v}>
      <line x1={L} x2={W - R} y1={py(v)} y2={py(v)} stroke={v === emphasis ? ROLE.muted : ROLE.grid} strokeDasharray={v === emphasis ? '4 3' : undefined} />
      <text x={L - 6} y={py(v) + 4} textAnchor="end">{yLabel(v)}</text>
    </g>)}
    {AGE_TICKS.map(t => <text key={t} x={px(t)} y={H - B + 17} textAnchor="middle">{t}</text>)}
    <text x={(L + W - R) / 2} y={H - 6} textAnchor="middle">Alter in Jahren</text>
  </>;
  /** Treppe „zehn Jahre älter“ für eine Person: waagerecht ein Schritt, senkrecht die Änderung. */
  const stair = (id: PersonId, v: [number, number], py: (x: number) => number, text: string) => {
    const s = steps[id], c = PERSON_COLOR[id], x0 = px(s.age[0]), x1 = px(s.age[1]), y0 = py(v[0]), y1 = py(v[1]);
    return <g key={id}>
      <path d={`M${x0} ${y0} H${x1} V${y1}`} fill="none" stroke={c} strokeWidth={3} />
      <circle cx={x0} cy={y0} r={5} fill="#fff" stroke={c} strokeWidth={2.5} />
      <circle cx={x1} cy={y1} r={5} fill={c} />
      {/* Name links neben dem Startpunkt, auf der Seite, auf der die Kurve nicht weiterläuft */}
      <text x={x0 - 8} y={y0 + (v[1] > v[0] ? -8 : 16)} textAnchor="end" className="s10-eye-name" style={{ fill: c }}>{PERSONS[id].name}</text>
      {/* Kaum Änderung (flache Kurve): Zahl über die Linie statt auf sie */}
      <text x={x1 + 7} y={Math.abs(y1 - y0) < 14 ? Math.min(y0, y1) - 9 : (y0 + y1) / 2 + 4} className="s10-eye-step" style={{ fill: c }}>{text}</text>
    </g>;
  };

  const legend: [ReactNode, string][] = [
    [<i style={{ background: YOU }} />, 'deine Kurve'],
    ...IDS.map(id => [<i className="dot" style={{ background: PERSON_COLOR[id] }} />, `${PERSONS[id].name} (${PERSONS[id].age} → ${PERSONS[id].age + AGE_STEP} Jahre)`] as [ReactNode, string]),
    ...(showData ? [[<i className="dot" style={{ background: DATA }} />, 'Anteil im ALLBUS je Altersgruppe'] as [ReactNode, string]] : []),
    ...(showR ? [[<i style={{ background: MODEL }} />, 'Kurve aus R'] as [ReactNode, string]] : []),
  ];

  return <div className="s10-eye" style={{ '--s10-eye-you': YOU, '--s10-eye-you-light': ROLE.guessLight } as CSSProperties}>
    <p className="s10-eye-formula" aria-live="polite">Deine Kurve: Logit = <strong style={{ color: YOU }}>{formula(curve)}</strong>
      <small> (Jahrzehnte = Alter / 10; Konstante = Logit bei Alter 0, B = Änderung des Logits je zehn Jahre)</small></p>
    <div className="s10-eye-panels">
      <figure className="s10-eye-panel">
        <h4>Logit <small>so rechnet das Modell</small></h4>
        <svg ref={logitSvg} viewBox={`0 0 ${W} ${H}`} role="group" aria-label="Logit über dem Alter mit zwei Griffen: Konstante und B">
          {frame([-8, -4, 0, 4, 8], pyLogit, v => de(v, 0), 0)}
          {showData && data?.groups.filter(g => g.logit !== null && Math.abs(g.logit) <= LOGIT_MAX).map(g =>
            <circle key={g.from} cx={px(g.meanAge)} cy={pyLogit(g.logit!)} r={4.5} fill={DATA} stroke="#fff" strokeWidth={1} />)}
          {showR && rCurve && <path d={path(age => curveLogit(rCurve, age), pyLogit)} fill="none" stroke={MODEL} strokeWidth={2} />}
          <path d={path(age => curveLogit(curve, age), pyLogit)} fill="none" stroke={YOU} strokeWidth={2.5} />
          {IDS.map(id => stair(id, steps[id].logit, pyLogit, signed(steps[id].logit[1] - steps[id].logit[0], 2)))}
          <text x={px(0) + 14} y={pyLogit(curve.a) + (curve.a > 5 ? 20 : -12)} className="s10-eye-hlabel">Konstante</text>
          <text x={px(AGE_MAX) - 14} y={pyLogit(curve.a + 10 * curve.b) + (curve.a + 10 * curve.b > 5 ? 20 : -12)} textAnchor="end" className="s10-eye-hlabel">B</text>
          <Handle id="a" x={px(0)} y={pyLogit(curve.a)} label="Konstante (Logit bei Alter 0)" valueText={`Konstante ${de(curve.a, 2)}`}
            value={curve.a} min={aMin} max={aMax} dragging={drag === 'a'} {...handleProps} />
          <Handle id="b" x={px(AGE_MAX)} y={pyLogit(curve.a + 10 * curve.b)} label="B (Änderung des Logits je zehn Jahre)" valueText={`B ${de(curve.b, 2)} je zehn Jahre`}
            value={curve.b} min={bMin} max={bMax} dragging={drag === 'b'} {...handleProps} />
        </svg>
      </figure>
      <figure className="s10-eye-panel">
        <h4>Wahrscheinlichkeit <small>so liest man es</small></h4>
        <svg ref={probSvg} viewBox={`0 0 ${W} ${H}`} role="group" aria-label="Wahrscheinlichkeit über dem Alter: dieselbe Kurve als S-Kurve">
          {frame([0, 0.25, 0.5, 0.75, 1], pyProb, v => `${de(100 * v, 0)} %`, 0.5)}
          {showData && data?.groups.map(g => <circle key={g.from} cx={px(g.meanAge)} cy={pyProb(g.share)} r={4.5} fill={DATA} stroke="#fff" strokeWidth={1} />)}
          {showR && rCurve && <path d={path(age => curveProb(rCurve, age), pyProb)} fill="none" stroke={MODEL} strokeWidth={2} />}
          <path d={path(age => curveProb(curve, age), pyProb)} fill="none" stroke={YOU} strokeWidth={2.5} />
          {IDS.map(id => stair(id, steps[id].prob, pyProb, `${signed(100 * (steps[id].prob[1] - steps[id].prob[0]), 1)} Pp.`))}
          {midVisible && <>
            <text x={px(mid!)} y={pyProb(0.5) + (curve.b > 0 ? 24 : -14)} textAnchor="middle" className="s10-eye-hlabel">50 %</text>
            <Handle id="mid" x={px(mid!)} y={pyProb(0.5)} label="Mitte der S-Kurve (50 %) verschieben" valueText={`50 % bei ${de(mid!, 0)} Jahren`}
              value={mid!} min={0} max={AGE_MAX} horizontal dragging={drag === 'mid'} {...handleProps} />
          </>}
        </svg>
      </figure>
    </div>
    <p className="s10-eye-legend">{legend.map(([mark, text]) => <span key={text}>{mark}{text}</span>)}</p>
    <p className="task-field-help">Zieh die runden Griffe mit der Maus oder dem Finger: links die Konstante und B, rechts die Mitte der S-Kurve (sie erscheint, sobald die Kurve steigt oder fällt).
      Mit der Tab-Taste wählst du einen Griff, mit den Pfeiltasten bewegst du ihn, mit Umschalt in großen Schritten. Grau: unter 18, dort gibt es keine Befragten.</p>

    <div className="s10-eye-people" aria-live="polite">
      {IDS.map(id => {
        const s = steps[id], c = PERSON_COLOR[id], r = showR && rCurve ? curveStep(rCurve, PERSONS[id].age) : null;
        return <div key={id} className="s10-eye-person" style={{ borderTopColor: c }}>
          <p className="s10-eye-who" style={{ color: c }}>{PERSONS[id].name}: {s.age[0]} → {s.age[1]} Jahre</p>
          <dl>
            <dt>Logit</dt><dd>{de(s.logit[0], 2)} → {de(s.logit[1], 2)} <strong>({signed(s.logit[1] - s.logit[0], 2)})</strong></dd>
            <dt>Chance</dt><dd>{odds(s.odds[0])} → {odds(s.odds[1])} <strong>(×{de(s.odds[1] / s.odds[0], 2)})</strong></dd>
            <dt>Wahrscheinlichkeit</dt><dd>{pct(s.prob[0])} → {pct(s.prob[1])} % <strong>({signed(100 * (s.prob[1] - s.prob[0]), 1)} Prozentpunkte)</strong></dd>
          </dl>
          {r && <p className="s10-eye-rline" style={{ color: MODEL }}>Kurve aus R: {pct(r.prob[0])} → {pct(r.prob[1])} % ({signed(100 * (r.prob[1] - r.prob[0]), 1)} Prozentpunkte), Chance ×{de(r.odds[1] / r.odds[0], 2)}</p>}
        </div>;
      })}
    </div>

    {data ? <>
      <div className="sandbox-chips">
        <button type="button" aria-pressed={showData} disabled={!changed && !showData} onClick={() => { setShowData(!showData); if (showData) setShowR(false); }}>ALLBUS-Anteile zeigen</button>
        {rCurve && <button type="button" aria-pressed={showR} disabled={!showData} onClick={() => setShowR(!showR)}>Kurve aus R zeigen</button>}
        <button type="button" disabled={!changed && !showData && !showR} onClick={reset}>Zurück zum Start</button>
      </div>
      <p className="task-field-help">{!changed && !showData
        ? 'Stell zuerst deine eigene Kurve ein – dann kannst du sie mit den ALLBUS-Anteilen vergleichen.'
        : <>Die Punkte: Anteil der Befragten, die mit dem Smartphone ins Internet gehen (<code>lm30</code>), je Altersgruppe, gewichtet. Wer das Internet gar nicht nutzt, zählt als „nein“.
          {showR && rCurve && <> Die Kurve aus R schätzt <code>logistic_regression()</code> mit <code>weights = wghtpew</code> aus {data.fit!.cases.toLocaleString('de-DE')} Befragten: Logit = <strong style={{ color: MODEL }}>{formula(rCurve)}</strong>.</>}</>}</p>
    </> : <>
      <div className="sandbox-chips"><button type="button" disabled={!changed} onClick={reset}>Zurück zum Start</button></div>
      <p className="task-field-help">In deiner Datei fehlen <code>lm30</code> oder <code>age</code> – die ALLBUS-Anteile lassen sich hier nicht zeigen. Die Kurve kannst du trotzdem einstellen.</p>
    </>}
  </div>;
}
