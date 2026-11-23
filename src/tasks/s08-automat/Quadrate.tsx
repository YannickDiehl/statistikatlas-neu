import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';
import { de } from '../kit/numbers';
import { CAT_DARK, lighten, ROLE } from '../kit/palette';
import {
  addPoint, clampEnd, lessThanMean, lineAt, lineThrough, movePoint, PLAY_MAX, PLAY_MIN, PLAY_X, PLAY_Y, playFit, playMean, playSsr, pointsChanged, removePoint,
  type Line, type PlayPoint,
} from './domain';

/** Welche Linie gerade gemessen wird: ihre Residuen und Quadrate stehen im Bild, ihre Fehlerquadrate als große Zahl daneben. */
type Which = 'mean' | 'own' | 'ols';
type Drag = { kind: 'point'; id: number } | { kind: 'end'; k: 0 | 1 } | null;

/** Feste Rollen: Durchschnitt = rot, deine Gerade = blau (Tipp), Gerade aus R = türkis (Modell); Punkte = orange (echte Daten). */
const LINE: Record<Which, string> = { mean: ROLE.mean, own: ROLE.guess, ols: ROLE.model };
const TEXT: Record<Which, string> = { mean: CAT_DARK[3], own: ROLE.guess, ols: CAT_DARK[5] };
const NAME: Record<Which, string> = { mean: 'Durchschnitt', own: 'Deine Gerade', ols: 'Gerade aus R' };
const OF: Record<Which, string> = { mean: 'des Durchschnitts', own: 'deiner Geraden', ols: 'der Geraden aus R' };
const ORDER: Which[] = ['mean', 'own', 'ols'];
/** Solange deine Gerade noch nicht gezogen ist, liegt sie gestrichelt waagerecht in der Mitte. */
const UNSET = (PLAY_Y[0] + PLAY_Y[1]) / 2;
const END_STEP = 50, END_BIG = 250;

const euro = (y: number) => `${de(y, 0)} €`;
const hours = (x: number) => `${de(x, Number.isInteger(x) ? 0 : 1)} Std.`;
const mio = (v: number) => `${de(v / 1e6, 1)} Mio.`;
const pct = (x: number) => `${de(100 * Math.abs(x), 1)} %`;
const rule = (l: Line) => `Konstante ${euro(l.a)} · Steigung ${l.b < 0 ? '−' : '+'}${de(Math.abs(l.b), 1)} € pro Wochenstunde`;

/** Einstieg Sitzung 9: 15 echte Befragte (Arbeitsstunden × Nettoeinkommen). Du legst erst selbst eine Gerade, dann blendest du die Gerade
 *  aus R ein, ziehst Punkte, fügst welche hinzu oder nimmst sie weg. Residuen als senkrechte Linien, auf Wunsch als Quadrate, dazu die
 *  Summe der Fehlerquadrate jeder Linie und R². Gerechnet wird mit kit/ols.ts wie linear_regression(). */
export function Quadrate({ start }: { start: PlayPoint[] }) {
  const [points, setPoints] = useState(start);
  const [ends, setEnds] = useState<[number, number] | null>(null);
  const [olsShown, setOlsShown] = useState(false);
  const [which, setWhich] = useState<Which>('own');
  const [squares, setSquares] = useState(false);
  const [sel, setSel] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [hoverEnd, setHoverEnd] = useState<0 | 1 | null>(null);
  const [focusEnd, setFocusEnd] = useState<0 | 1 | null>(null);
  const [drag, setDrag] = useState<Drag>(null);
  const clipId = `s08-play-clip${useId().replace(/:/g, '')}`;

  // Koordinatensystem in echter Pixelbreite, damit die Schrift auf schmalen Bildschirmen nicht schrumpft.
  const box = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [boxW, setBoxW] = useState<number | null>(null);
  useEffect(() => {
    const el = box.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(([e]) => setBoxW(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const W = boxW ? Math.max(300, Math.min(760, boxW)) : 560;
  const narrow = W < 480;
  const H = narrow ? 360 : 400, L = 74, R = 16, T = 36, B = 54;
  const sx = (x: number) => L + ((x - PLAY_X[0]) / (PLAY_X[1] - PLAY_X[0])) * (W - L - R);
  const sy = (y: number) => T + ((PLAY_Y[1] - y) / (PLAY_Y[1] - PLAY_Y[0])) * (H - T - B);
  const fx = (px: number) => PLAY_X[0] + ((px - L) / (W - L - R)) * (PLAY_X[1] - PLAY_X[0]);
  const fy = (py: number) => PLAY_Y[1] - ((py - T) / (H - T - B)) * (PLAY_Y[1] - PLAY_Y[0]);

  const fit = useMemo(() => playFit(points), [points]);
  const mean = playMean(points);
  const own: Line | null = ends ? lineThrough(PLAY_X[0], ends[0], PLAY_X[1], ends[1]) : null;
  const lines: Record<Which, Line | null> = { mean: { a: mean, b: 0 }, own, ols: olsShown && fit ? { a: fit.a, b: fit.b } : null };
  const sst = playSsr(points, lines.mean!);
  const ssr: Record<Which, number | null> = { mean: sst, own: own ? playSsr(points, own) : null, ols: lines.ols && fit ? fit.ssr : null };
  const measured = lines[which];
  const barMax = Math.max(...ORDER.map(w => ssr[w] ?? 0), 1);
  const changed = pointsChanged(start, points);

  const setEnd = (k: 0 | 1, y: number) => setEnds(prev => {
    const next: [number, number] = prev ? [...prev] : [UNSET, UNSET];
    next[k] = clampEnd(y);
    return next;
  });
  const remove = (id: number) => { setPoints(ps => removePoint(ps, id)); setSel(null); setHover(null); };
  const toPlot = (e: PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current, m = svg?.getScreenCTM();
    if (!svg || !m) return null;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const q = pt.matrixTransform(m.inverse());
    return { x: fx(q.x), y: fy(q.y) };
  };
  const grab = (d: NonNullable<Drag>) => (e: PointerEvent<SVGGElement>) => {
    e.preventDefault();
    svgRef.current?.setPointerCapture?.(e.pointerId);
    setDrag(d);
    if (d.kind === 'point') setSel(d.id);
  };
  const onMove = (e: PointerEvent<SVGSVGElement>) => {
    if (!drag) return;
    const q = toPlot(e);
    if (!q) return;
    if (drag.kind === 'point') setPoints(ps => movePoint(ps, drag.id, q.x, q.y));
    else setEnd(drag.k, q.y);
  };
  const stop = () => setDrag(null);
  const keyPoint = (q: PlayPoint) => (e: KeyboardEvent<SVGGElement>) => {
    const s = e.shiftKey ? 5 : 1;
    const d = ({ ArrowLeft: [-s, 0], ArrowRight: [s, 0], ArrowUp: [0, 50 * s], ArrowDown: [0, -50 * s] } as Record<string, [number, number]>)[e.key];
    if (d) { e.preventDefault(); setSel(q.id); setPoints(ps => movePoint(ps, q.id, q.x + d[0], q.y + d[1])); return; }
    if ((e.key === 'Delete' || e.key === 'Backspace') && points.length > PLAY_MIN) { e.preventDefault(); remove(q.id); }
  };
  const keyEnd = (k: 0 | 1) => (e: KeyboardEvent<SVGGElement>) => {
    const step = ({ ArrowUp: END_STEP, ArrowRight: END_STEP, ArrowDown: -END_STEP, ArrowLeft: -END_STEP, PageUp: 2 * END_BIG, PageDown: -2 * END_BIG } as Record<string, number>)[e.key];
    if (step === undefined) return;
    e.preventDefault();
    setEnd(k, (ends ? ends[k] : UNSET) + (e.shiftKey ? Math.sign(step) * END_BIG : step));
  };

  const yTicks = Array.from({ length: (PLAY_Y[1] - PLAY_Y[0]) / 1000 + 1 }, (_, i) => PLAY_Y[0] + 1000 * i);
  const xTicks = Array.from({ length: (PLAY_X[1] - PLAY_X[0]) / 10 + 1 }, (_, i) => PLAY_X[0] + 10 * i);
  const endYs: [number, number] = ends ?? [UNSET, UNSET];
  const shownId = drag?.kind === 'point' ? drag.id : hover ?? sel;
  const shownPoint = points.find(q => q.id === shownId) ?? null;
  const summary = `Streudiagramm mit ${points.length} Punkten: Arbeitsstunden pro Woche und Nettoeinkommen im Monat. ${own ? `Deine Gerade: ${rule(own)}.` : 'Deine Gerade ist noch nicht gezogen.'}${lines.ols ? ` Gerade aus R: ${rule(lines.ols)}.` : ''}`;
  const lineEl = (w: Which, l: Line, width: number, dash?: string) =>
    <line x1={sx(PLAY_X[0])} x2={sx(PLAY_X[1])} y1={sy(lineAt(l, PLAY_X[0]))} y2={sy(lineAt(l, PLAY_X[1]))} stroke={LINE[w]} strokeWidth={width} strokeDasharray={dash} strokeLinecap="round" />;

  return <div className="s08-play">
    <div className="s08-play-left" ref={box}>
      <figure className="s08-play-fig">
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className={`s08-play-svg${drag ? ' dragging' : ''}`} role="group" aria-label={summary}
          onPointerMove={onMove} onPointerUp={stop} onPointerCancel={stop}>
          <defs><clipPath id={clipId}><rect x={L} y={T} width={W - L - R} height={H - T - B} /></clipPath></defs>
          <text x={8} y={20} className="s08-play-axis">Nettoeinkommen im Monat</text>
          {yTicks.map(v => <g key={v}>
            <line x1={L} x2={W - R} y1={sy(v)} y2={sy(v)} stroke={ROLE.grid} />
            <text x={L - 16} y={sy(v) + 5} textAnchor="end">{euro(v)}</text>
          </g>)}
          {xTicks.map(v => <g key={v}>
            <line x1={sx(v)} x2={sx(v)} y1={H - B} y2={H - B + 6} stroke={ROLE.ink} />
            <text x={sx(v)} y={H - B + 22} textAnchor="middle">{v}</text>
          </g>)}
          <line x1={L} x2={W - R} y1={H - B} y2={H - B} stroke={ROLE.ink} />
          <text x={(L + W - R) / 2} y={H - 8} textAnchor="middle" className="s08-play-axis">Arbeitsstunden pro Woche</text>

          <g clipPath={`url(#${clipId})`}>
            {/* Residuen der gemessenen Linie: senkrecht vom Punkt zur Linie, auf Wunsch als Quadrat mit dieser Seitenlänge */}
            {measured && points.map(q => {
              const py = sy(q.y), ly = sy(lineAt(measured, q.x)), side = Math.abs(py - ly), x0 = sx(q.x);
              return <g key={q.id}>
                {squares && side > 0.5 && <rect x={x0 + side <= W - R ? x0 : x0 - side} y={Math.min(py, ly)} width={side} height={side}
                  fill={lighten(LINE[which], 0.55)} fillOpacity={0.35} stroke={LINE[which]} strokeOpacity={0.7} />}
                <line x1={x0} x2={x0} y1={py} y2={ly} stroke={LINE[which]} strokeWidth={2} />
              </g>;
            })}
            {lineEl('mean', lines.mean!, which === 'mean' ? 3 : 2, '7 5')}
            {lines.ols && lineEl('ols', lines.ols, which === 'ols' ? 4 : 3)}
            {lineEl('own', own ?? { a: UNSET, b: 0 }, own ? (which === 'own' ? 4 : 3) : 2, own ? undefined : '6 5')}
          </g>

          {points.map((q, i) => {
            const big = drag?.kind === 'point' && drag.id === q.id || hover === q.id;
            return <g key={q.id} className="s08-play-point" tabIndex={0} role="button" aria-roledescription="verschiebbarer Punkt"
              aria-label={`Punkt ${i + 1}: ${hours(q.x)}, ${euro(q.y)}. Pfeiltasten verschieben${points.length > PLAY_MIN ? ', Entf entfernt' : ''}.`}
              onPointerDown={grab({ kind: 'point', id: q.id })} onPointerEnter={() => setHover(q.id)} onPointerLeave={() => setHover(h => (h === q.id ? null : h))}
              onKeyDown={keyPoint(q)} onFocus={() => setSel(q.id)}>
              {sel === q.id && <circle cx={sx(q.x)} cy={sy(q.y)} r={14} fill="none" stroke={CAT_DARK[1]} strokeWidth={2} strokeDasharray="3 3" />}
              <circle cx={sx(q.x)} cy={sy(q.y)} r={big ? 9 : 7} fill={ROLE.data} stroke={CAT_DARK[1]} strokeWidth={1.5} />
              <circle cx={sx(q.x)} cy={sy(q.y)} r={16} fill="transparent" />
            </g>;
          })}

          {([0, 1] as const).map(k => {
            const cx = sx(PLAY_X[k]), cy = sy(endYs[k]), big = (drag?.kind === 'end' && drag.k === k) || hoverEnd === k || focusEnd === k;
            return <g key={k} className="s08-play-end" role="slider" tabIndex={0} aria-label={`Deine Gerade bei ${PLAY_X[k]} Stunden`}
              aria-valuemin={PLAY_Y[0]} aria-valuemax={PLAY_Y[1]} aria-valuenow={endYs[k]} aria-valuetext={ends ? euro(endYs[k]) : 'noch nicht gezogen'}
              onPointerDown={grab({ kind: 'end', k })} onPointerEnter={() => setHoverEnd(k)} onPointerLeave={() => setHoverEnd(null)}
              onKeyDown={keyEnd(k)} onFocus={() => setFocusEnd(k)} onBlur={() => setFocusEnd(null)}>
              {focusEnd === k && <circle cx={cx} cy={cy} r={19} fill="none" stroke={ROLE.guess} strokeWidth={2} strokeDasharray="3 3" />}
              <circle cx={cx} cy={cy} r={big ? 13 : 11} fill={ends ? ROLE.guess : '#fff'} stroke={ends ? '#fff' : ROLE.guess} strokeWidth={3} />
              <circle cx={cx} cy={cy} r={22} fill="transparent" />
              {!ends && <text x={cx + (k === 0 ? 18 : -18)} y={cy - 16} textAnchor={k === 0 ? 'start' : 'end'} className="s08-play-tag" style={{ fill: ROLE.guess }}>zieh mich</text>}
            </g>;
          })}

          {shownPoint && (() => {
            const cx = sx(shownPoint.x), cy = sy(shownPoint.y), anchor = cx < L + 90 ? 'start' : cx > W - R - 90 ? 'end' : 'middle';
            const res = measured ? shownPoint.y - lineAt(measured, shownPoint.x) : null;
            const up = cy > T + 56;
            return <g pointerEvents="none">
              <text x={cx} y={up ? cy - (res !== null ? 38 : 18) : cy + 30} textAnchor={anchor} className="s08-play-tag">{hours(shownPoint.x)} · {euro(shownPoint.y)}</text>
              {res !== null && <text x={cx} y={up ? cy - 18 : cy + 50} textAnchor={anchor} className="s08-play-tag s08-play-tag-sub" style={{ fill: TEXT[which] }}>
                Residuum {res >= 0 ? '+' : '−'}{de(Math.abs(res), 0)} €</text>}
            </g>;
          })()}
        </svg>
        <figcaption>Orange Punkte: {start.length} echte Befragte aus dem ALLBUS 2023, die erwerbstätig sind – ihre Arbeitsstunden pro Woche (dw15) und ihr Nettoeinkommen im Monat (incc, Mitte der angegebenen Einkommensgruppe).</figcaption>
      </figure>
      <div className="sandbox-chips">
        <button type="button" aria-pressed={squares} onClick={() => setSquares(!squares)}>Quadrate zeigen</button>
        <button type="button" disabled={points.length >= PLAY_MAX} onClick={() => setPoints(addPoint(points))}>Punkt hinzufügen</button>
        <button type="button" disabled={sel === null || points.length <= PLAY_MIN} onClick={() => sel !== null && remove(sel)}>Punkt entfernen</button>
        <button type="button" disabled={!changed} onClick={() => { setPoints(start); setSel(null); }}>Zurück zu den {start.length} Befragten</button>
      </div>
      <p className="task-field-help">Zieh die Punkte und die blauen Griffe mit Maus oder Finger. Ohne Maus: Tab auf einen Punkt oder Griff, dann Pfeiltasten (mit Umschalt in großen Schritten); Entf entfernt einen Punkt. „Punkt entfernen“ nimmt den zuletzt angeklickten Punkt weg. Ein neuer Punkt erscheint in der Mitte der Punktwolke.</p>
    </div>

    <div className="s08-play-panel">
      <p className="task-prompt">Wie weit liegen die Punkte neben der Linie?</p>
      <div className="s08-play-big" aria-live="polite">
        <strong style={{ color: TEXT[which] }}>{ssr[which] !== null ? mio(ssr[which]!) : '–'}</strong>
        <span>Summe der Fehlerquadrate {OF[which]}</span>
        <small>{which === 'mean'
          ? `Wer allen denselben Durchschnitt vorhersagt (${euro(mean)}), macht so viele Fehlerquadrate – wie der Faulpelz.`
          : which === 'own'
            ? (ssr.own === null ? 'Zieh zuerst die beiden blauen Griffe: Dann misst du deine Gerade.' : `Im Vergleich zum Durchschnitt: ${pct(lessThanMean(ssr.own, sst))} ${ssr.own <= sst ? 'weniger' : 'mehr'} Fehlerquadrate.`)
            : (fit && ssr.ols !== null ? `R² dieser Geraden: ${de(fit.r2, 3)}` : 'Für diese Punkte lässt sich keine Gerade bestimmen: Alle stehen bei derselben Stundenzahl.')}</small>
      </div>
      <p className="task-field-help s08-play-unit">Jedes Residuum (Punkt minus Linie, in Euro) mit sich selbst malgenommen, alle zusammengezählt – in Millionen.</p>
      {ORDER.map(w => {
        const l = lines[w], v = ssr[w];
        return <button key={w} type="button" className="s08-play-row" style={{ '--c': LINE[w], '--t': TEXT[w] } as CSSProperties} aria-pressed={which === w}
          disabled={!l} onClick={() => setWhich(w)} aria-label={`${NAME[w]} messen${v !== null ? `: ${mio(v)} Fehlerquadrate` : ''}`}>
          <b>{NAME[w]}</b>
          <strong>{v !== null ? de(v / 1e6, 1) : '–'}</strong>
          <span className="s08-play-bar" aria-hidden="true"><i style={{ width: `${v !== null ? (100 * v) / barMax : 0}%` }} /></span>
          <small>{w === 'mean' ? `immer ${euro(mean)}` : l ? rule(l) : w === 'own' ? 'noch nicht gezogen' : fit ? 'noch ausgeblendet' : 'nicht bestimmbar'}</small>
        </button>;
      })}
      {!olsShown && <>
        <button type="button" className="s08-play-show" disabled={!own} onClick={() => { setOlsShown(true); setWhich('ols'); }}>Gerade aus R einblenden</button>
        {!own && <p className="task-field-help">Leg zuerst deine eigene Gerade – dann kannst du sie mit der Geraden aus R vergleichen.</p>}
      </>}
    </div>
  </div>;
}
