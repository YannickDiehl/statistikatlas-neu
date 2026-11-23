import { memo, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { de } from '../kit/numbers';
import { ROLE } from '../kit/palette';
import { random } from '../kit/stats';
import {
  CLOUD_GROUPS, CLOUD_SCALE, CLOUD_SIZES, CLOUD_SPREADS, CLOUD_START, CLOUD_WINDOW, clampShift, cloudChanged, cloudDraw, cloudN, cloudOutside, cloudShiftRange, cloudTrueDiff,
  type CloudPair, type CloudPopulation, type CloudResult, type CloudSettings, type CloudSize,
} from './domain';

const count = (x: number) => x.toLocaleString('de-DE');
const signed = (x: number, d = 3) => `${x > 0 ? '+' : ''}${de(x, d)}`;
/** p so, wie R ihn druckt: drei Nachkommastellen, sehr kleine Werte als „< 0,001“. */
const pText = (p: number) => (p < 0.001 ? '< 0,001' : de(p, 3));
const factor = (f: number) => `×${String(f).replace('.', ',')}`;
const MAX_DRAWS = 20, MAX_DOTS = 1000;
/** Feste Höhen je Punkt innerhalb seines Streifens, damit Befragte mit demselben Code nicht übereinanderliegen. */
const JITTER = (() => { const r = random(2023); return Array.from({ length: MAX_DOTS }, () => r()); })();

/* Maße in Pixeln: links die Spalte mit den Gruppennamen, darunter die Achse. */
const LABEL = 72, PAD = 14, TOP = 12, ROW = 66, GAP = 16, ROW_H = 13;
const rowY = (k: number) => TOP + k * (ROW + GAP);
const AXIS_Y = TOP + 2 * ROW + GAP + 8;
const DOT_H = AXIS_Y + 28;
const WIDTH = CLOUD_WINDOW[1] - CLOUD_WINDOW[0];
/** Unterschiede bekommen dieselbe Länge pro Skalenpunkt wie die Punktwolken – um 0 herum. */
const DIFF_WINDOW: CloudPair<number> = [-WIDTH / 2, WIDTH / 2];
const dotLook = (n: number) => (n <= 30 ? { r: 5, o: 0.8 } : n <= 100 ? { r: 4, o: 0.65 } : n <= 300 ? { r: 3, o: 0.5 } : { r: 2.2, o: 0.35 });

/** Punkte einer Gruppe ohne Verschiebung (die kommt als transform dazu, so bleibt das Ziehen flüssig). */
const Dots = memo(function Dots({ values, y0, x0, px, n }: { values: number[]; y0: number; x0: number; px: number; n: number }) {
  const { r, o } = dotLook(n);
  return <g fill={ROLE.data} fillOpacity={o}>
    {values.slice(0, MAX_DOTS).map((v, i) => <circle key={i} cx={x0 + v * px} cy={y0 + r + 3 + JITTER[i] * (ROW - 2 * r - 6)} r={r} />)}
  </g>;
});

/** Breite des Elements in Pixeln, damit Schrift und Punkte bei 390 px genauso groß bleiben wie am Bildschirm. */
function useWidth(initial: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(initial);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.max(280, Math.round(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

/** Einstieg Sitzung 7: zwei Gruppen als Punktwolken aus echten ALLBUS-Werten. Unterschied (rote Linien ziehen), Streuung und Gruppengröße
 *  stellen die Studierenden selbst ein; t, p und das Konfidenzintervall rechnen live mit – wie t_test() in R. */
export function Clouds({ pop }: { pop: CloudPopulation }) {
  const [settings, setSettings] = useState<CloudSettings>(CLOUD_START);
  /** Gezogene Stichproben mit den aktuellen Einstellungen (die letzte ist die gezeigte). Neue Einstellungen behalten nur die aktuelle. */
  const [seeds, setSeeds] = useState<number[]>([1]);
  const [dragging, setDragging] = useState<0 | 1 | null>(null);
  const drag = useRef<{ k: 0 | 1; x: number; shift: number } | null>(null);
  const [boxRef, width] = useWidth(640);
  const clip = `s06-clouds-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  const seed = seeds[seeds.length - 1];
  const n = cloudN(pop, settings.size);
  const base = useMemo(() => cloudDraw(pop, { ...settings, shift: [0, 0] }, seed).values, [pop, settings.size, settings.spread, seed]);
  const results = useMemo(() => seeds.map(s => cloudDraw(pop, settings, s).result), [pop, settings, seeds]);
  const result = results[results.length - 1];
  const trueDiff = cloudTrueDiff(pop, settings);
  const changed = cloudChanged(settings);
  const all = settings.size === 'alle';

  const px = (width - LABEL - PAD) / WIDTH;
  const x = (v: number) => LABEL + (v - CLOUD_WINDOW[0]) * px;
  const xd = (v: number) => LABEL + (Math.min(DIFF_WINDOW[1], Math.max(DIFF_WINDOW[0], v)) - DIFF_WINDOW[0]) * px;
  const ticks = Array.from({ length: CLOUD_SCALE[1] - CLOUD_SCALE[0] + 1 }, (_, i) => CLOUD_SCALE[0] + i).filter(v => px >= 26 || v % 2 === 0);
  const diffTicks = Array.from({ length: 13 }, (_, i) => i - 6).filter(v => px >= 26 || v % 2 === 0);

  const update = (next: CloudSettings) => { setSettings(next); setSeeds(prev => [prev[prev.length - 1]]); };
  const setShift = (k: 0 | 1, value: number) => {
    const v = clampShift(pop.centers[k], value);
    if (v !== settings.shift[k]) update({ ...settings, shift: (k === 0 ? [v, settings.shift[1]] : [settings.shift[0], v]) as CloudPair<number> });
  };
  const draw = () => setSeeds(prev => [...prev, prev[prev.length - 1] + 1].slice(-MAX_DRAWS));
  const onDown = (k: 0 | 1) => (e: PointerEvent<SVGGElement>) => {
    e.currentTarget.setPointerCapture?.(e.pointerId);
    drag.current = { k, x: e.clientX, shift: settings.shift[k] };
    setDragging(k);
  };
  const onMove = (e: PointerEvent<SVGGElement>) => { const d = drag.current; if (d) setShift(d.k, d.shift + (e.clientX - d.x) / px); };
  const onUp = () => { drag.current = null; setDragging(null); };
  const onKey = (k: 0 | 1) => (e: KeyboardEvent<SVGGElement>) => {
    const [lo, hi] = cloudShiftRange(pop.centers[k]), s = settings.shift[k];
    const to: Record<string, number> = { ArrowLeft: s - 0.1, ArrowDown: s - 0.1, ArrowRight: s + 0.1, ArrowUp: s + 0.1, PageDown: s - 0.5, PageUp: s + 0.5, Home: lo, End: hi };
    if (!(e.key in to)) return;
    e.preventDefault();
    setShift(k, to[e.key]);
  };
  const sampleMean = (k: 0 | 1) => result ? result.means[k] : base[k].reduce((a, b) => a + b, 0) / base[k].length + settings.shift[k];

  return <div className="s06-clouds">
    <div className="s06-clouds-top">
      <div className="s06-clouds-controls">
        <p className="task-prompt">Wie viele Befragte ziehst du je Gruppe?</p>
        <div className="sandbox-chips" role="group" aria-label="Befragte je Gruppe">
          {CLOUD_SIZES.map(s => <button key={s} type="button" aria-pressed={settings.size === s} onClick={() => update({ ...settings, size: s })}>
            {s === 'alle' ? `alle (${count(pop.values[0].length)} / ${count(pop.values[1].length)})` : count(s)}
          </button>)}
        </div>
        <p className="task-prompt">Wie stark streuen die Werte um ihren Mittelwert?</p>
        <div className="sandbox-chips" role="group" aria-label="Streuung">
          {CLOUD_SPREADS.map(f => <button key={f} type="button" aria-pressed={settings.spread === f} aria-label={`Streuung ${factor(f).slice(1)}-fach`}
            onClick={() => update({ ...settings, spread: f })}>{factor(f)}</button>)}
        </div>
        <p className="task-field-help">×1 heißt: so stark wie im ALLBUS. Den Unterschied stellst du in der Grafik ein: Zieh eine rote Linie nach links oder rechts – oder wähl sie mit der Tab-Taste und nimm die Pfeiltasten.</p>
      </div>
      <Measures result={result} />
    </div>

    <div ref={boxRef} className="s06-clouds-plots">
      <svg className="s06-clouds-svg" width={width} height={DOT_H} viewBox={`0 0 ${width} ${DOT_H}`} role="group"
        aria-label={`Punktwolken der Lebenszufriedenheit: ${CLOUD_GROUPS.map((g, k) => `${g} ${count(n[k])} Befragte, Mittelwert ${de(sampleMean(k as 0 | 1), 2)}`).join('; ')}`}>
        <defs><clipPath id={clip}><rect x={x(CLOUD_WINDOW[0])} y={0} width={WIDTH * px} height={DOT_H} /></clipPath></defs>
        <rect className="s06-clouds-off" x={x(CLOUD_WINDOW[0])} y={TOP - 4} width={(CLOUD_SCALE[0] - CLOUD_WINDOW[0]) * px} height={2 * ROW + GAP + 8} />
        <rect className="s06-clouds-off" x={x(CLOUD_SCALE[1])} y={TOP - 4} width={(CLOUD_WINDOW[1] - CLOUD_SCALE[1]) * px} height={2 * ROW + GAP + 8} />
        {CLOUD_GROUPS.map((g, i) => {
          const k = i as 0 | 1, y0 = rowY(k), shift = settings.shift[k], m = sampleMean(k), [below, above] = cloudOutside(base[k].slice(0, MAX_DOTS).map(v => v + shift));
          const [lo, hi] = cloudShiftRange(pop.centers[k]);
          return <g key={g}>
            <line className="s06-clouds-base" x1={x(CLOUD_WINDOW[0])} x2={x(CLOUD_WINDOW[1])} y1={y0 + ROW} y2={y0 + ROW} />
            <text className="s06-clouds-group" x={0} y={y0 + 18}>{g}</text>
            <text x={0} y={y0 + 37}>n = {count(n[k])}</text>
            {shift !== 0 && <text x={0} y={y0 + 56}>{signed(shift, 2)}</text>}
            <g clipPath={`url(#${clip})`}>
              <g transform={`translate(${shift * px} 0)`}><Dots values={base[k]} y0={y0} x0={x(0)} px={px} n={n[k]} /></g>
            </g>
            {below > 0 && <text className="s06-clouds-edge" x={x(CLOUD_WINDOW[0]) + 3} y={y0 + 14}>◂ {count(below)}</text>}
            {above > 0 && <text className="s06-clouds-edge" x={x(CLOUD_WINDOW[1]) - 3} y={y0 + 14} textAnchor="end">{count(above)} ▸</text>}
            <line x1={x(pop.centers[k] + shift)} x2={x(pop.centers[k] + shift)} y1={y0} y2={y0 + ROW} stroke={ROLE.mean} strokeWidth={1.5} strokeDasharray="5 4" />
            <g className={`s06-clouds-handle${dragging === k ? ' is-dragging' : ''}`} style={{ color: ROLE.mean }} tabIndex={0} role="slider"
              aria-label={`Mittelwert ${g} verschieben`} aria-valuemin={Number((pop.centers[k] + lo).toFixed(2))} aria-valuemax={Number((pop.centers[k] + hi).toFixed(2))}
              aria-valuenow={Number((pop.centers[k] + shift).toFixed(2))} aria-valuetext={`Mittelwert aller Befragten ${de(pop.centers[k] + shift, 2)}, verschoben um ${signed(shift, 2)}`}
              onPointerDown={onDown(k)} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} onKeyDown={onKey(k)}>
              <rect className="s06-clouds-hit" x={x(m) - 14} y={y0 - 6} width={28} height={ROW + 6} />
              <line x1={x(m)} x2={x(m)} y1={y0} y2={y0 + ROW} stroke="currentColor" strokeWidth={3} />
              <circle className="s06-clouds-ring" cx={x(m)} cy={y0} r={11} />
              <circle className="s06-clouds-knob" cx={x(m)} cy={y0} r={7} stroke="currentColor" strokeWidth={2.5} />
            </g>
          </g>;
        })}
        <line className="s06-clouds-axis" x1={x(CLOUD_WINDOW[0])} x2={x(CLOUD_WINDOW[1])} y1={AXIS_Y} y2={AXIS_Y} />
        {ticks.map(v => <g key={v}>
          <line className="s06-clouds-axis" x1={x(v)} x2={x(v)} y1={AXIS_Y} y2={AXIS_Y + 5} />
          <text x={x(v)} y={AXIS_Y + 21} textAnchor="middle">{v}</text>
        </g>)}
      </svg>
      <p className="task-field-help">Lebenszufriedenheit (ls01): 0 = ganz unzufrieden, 10 = ganz zufrieden. Jede Zeile ist eine Gruppe aus eastwest.
        {(n[0] > MAX_DOTS || n[1] > MAX_DOTS) && ` Gezeigt sind höchstens ${count(MAX_DOTS)} Punkte je Gruppe; gerechnet wird mit allen.`}</p>
      <div className="s06-clouds-legend" aria-hidden="true">
        <span><i className="s06-clouds-dot" style={{ background: ROLE.data }} />eine befragte Person</span>
        <span><i className="s06-clouds-line" style={{ borderColor: ROLE.mean }} />Mittelwert der Stichprobe (zum Verschieben ziehen)</span>
        <span><i className="s06-clouds-line is-dashed" style={{ borderColor: ROLE.mean }} />Mittelwert aller Befragten der Gruppe</span>
        <span><i className="s06-clouds-area" />außerhalb der Antwortskala – nur im Gedankenspiel</span>
      </div>

      <div className="sandbox-chips s06-clouds-actions">
        <button type="button" className="primary" disabled={all} onClick={draw}>Neue Stichprobe ziehen</button>
        <button type="button" disabled={!changed} onClick={() => update({ ...settings, spread: 1, shift: [0, 0] })}>Zurück zu den ALLBUS-Zahlen</button>
      </div>
      {all && <p className="task-field-help">Mit allen Befragten gibt es nichts mehr zu ziehen: Jede Ziehung wäre dieselbe. Ohne Verschiebung und mit ×1 stehen hier dieselben Zahlen wie in R bei <code>allbus %&gt;% t_test(ls01, group = eastwest)</code>.</p>}

      <svg className="s06-clouds-svg" width={width} height={TOP + Math.max(6, results.length) * ROW_H + 34} viewBox={`0 0 ${width} ${TOP + Math.max(6, results.length) * ROW_H + 34}`}
        role="img" aria-label={results.length === 1
          ? `Konfidenzintervall der aktuellen Stichprobe, p ${result && result.p < 0.05 ? 'unter' : 'nicht unter'} 0,05`
          : `Konfidenzintervalle der letzten ${results.length} Stichproben, davon ${results.filter(r => r && r.p < 0.05).length} mit p unter 0,05`}>
        {(() => {
          const rows = [...results].reverse(), bottom = TOP + Math.max(6, results.length) * ROW_H;
          return <>
            <line className="s06-clouds-zero" x1={xd(0)} x2={xd(0)} y1={TOP - 6} y2={bottom} />
            <line x1={xd(trueDiff)} x2={xd(trueDiff)} y1={TOP - 6} y2={bottom} stroke={ROLE.mean} strokeWidth={1.5} strokeDasharray="5 4" />
            {rows.map((r: CloudResult | null, i) => {
              if (!r) return null;
              const y = TOP + i * ROW_H + ROW_H / 2, color = r.p < 0.05 ? ROLE.model : ROLE.modelLight;
              return <g key={seeds[seeds.length - 1 - i]}>
                {i === 0 && <text x={0} y={y + 5}>jetzt</text>}
                <line x1={xd(r.ci[0])} x2={xd(r.ci[1])} y1={y} y2={y} stroke={color} strokeWidth={i === 0 ? 5 : 3} strokeLinecap="round" />
                <circle cx={xd(r.diff)} cy={y} r={i === 0 ? 4.5 : 3} fill={ROLE.model} stroke="#fff" strokeWidth={1} />
              </g>;
            })}
            <line className="s06-clouds-axis" x1={xd(DIFF_WINDOW[0])} x2={xd(DIFF_WINDOW[1])} y1={bottom + 4} y2={bottom + 4} />
            {diffTicks.map(v => <g key={v}>
              <line className="s06-clouds-axis" x1={xd(v)} x2={xd(v)} y1={bottom + 4} y2={bottom + 9} />
              <text x={xd(v)} y={bottom + 25} textAnchor="middle">{v > 0 ? `+${v}` : de(v, 0)}</text>
            </g>)}
          </>;
        })()}
      </svg>
      <p className="task-field-help">Unterschied der Mittelwerte West − Ost mit 95-%-Konfidenzintervall, eine Zeile je Stichprobe, oben die neueste. Kräftiges Türkis: p unter 0,05. Rot gestrichelt: der Unterschied unter allen Befragten. Neue Einstellungen beginnen eine neue Reihe.</p>
    </div>
  </div>;
}

/** Was t_test() aus der gezeigten Stichprobe rechnet: t als Bruch aus Unterschied und Standardfehler, dazu df, p und das Intervall. */
function Measures({ result }: { result: CloudResult | null }) {
  if (!result) return <div className="s06-clouds-measures" aria-live="polite"><p className="sandbox-note">Mit so wenigen Befragten lässt sich kein t-Test rechnen.</p></div>;
  return <div className="s06-clouds-measures" aria-live="polite">
    <p className="task-prompt">Was der t-Test aus deiner Stichprobe rechnet</p>
    <div className="s06-clouds-means">
      {CLOUD_GROUPS.map((g, k) => <span key={g}><small>Mittelwert {g}</small><strong style={{ color: ROLE.mean }}>{de(result.means[k], 3)}</strong></span>)}
    </div>
    <div className="s06-clouds-t">
      <span>t =</span>
      <span className="s06-clouds-frac">
        <span><small>Unterschied West − Ost</small>{signed(result.diff)}</span>
        <span><small>Standardfehler</small>{de(result.se, 3)}</span>
      </span>
      <span>=</span>
      <strong className="s06-clouds-big" style={{ color: ROLE.model }}>{de(result.t, 3)}</strong>
    </div>
    <dl className="s06-clouds-dl">
      <div><dt>Freiheitsgrade (df)</dt><dd>{de(result.df, 1)}</dd></div>
      <div><dt>p</dt><dd style={{ color: ROLE.model }}>{pText(result.p)}</dd></div>
      <div><dt>95-%-Konfidenzintervall des Unterschieds</dt><dd style={{ color: ROLE.model }}>{de(result.ci[0], 3)} bis {de(result.ci[1], 3)}</dd></div>
    </dl>
  </div>;
}
