import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { de } from '../kit/numbers';
import type { InputItem } from './content';
import { answerName, clampShow, lineAt, lineThrough, levelName, type Line, type ParadeRow, type ProbeRow, type Scatter, type Spread } from './domain';
import { CAT, CAT_DARK, ROLE } from '../kit/palette';

const INK = ROLE.ink, LAZY = '#9b9a8e', ANSWER = ROLE.data, MINE = ROLE.guess, REAL = ROLE.model;

/** Deine Gerade zuerst: mittlere Zufriedenheit je Antwort als Punkte (Fläche ~ Zahl der Befragten), dazu die Regel deines Automaten
 *  als Gerade mit zwei Griffen bei der kleinsten und der größten Antwort. Ziehen, Klicken oder Pfeiltasten auf einem Griff setzen
 *  seine Höhe; real zeigt die echte Gerade aus R dazu. */
export function LineGuess({ item, sc, line, real = null, locked, onLine }: {
  item: InputItem; sc: Scatter; line: Line | null; real?: Line | null; locked: boolean; onLine?: (l: Line) => void;
}) {
  const [drag, setDrag] = useState<0 | 1 | null>(null);
  const [hover, setHover] = useState<0 | 1 | null>(null);
  const [focus, setFocus] = useState<0 | 1 | null>(null);
  // Schmale Bildschirme: eigenes, schmales Koordinatensystem in echter Pixelbreite, damit die Schrift nicht schrumpft.
  const box = useRef<HTMLElement>(null);
  const [boxW, setBoxW] = useState<number | null>(null);
  useEffect(() => {
    const el = box.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(([e]) => setBoxW(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const narrow = boxW !== null && boxW < 560;
  // Beim Alter stehen auf schmalen Bildschirmen zu viele Punkte nebeneinander – dort ohne Zahlen.
  const showN = !(narrow && sc.binned);
  const W = narrow ? Math.max(300, boxW!) : 640, H = narrow ? 380 : 400;
  const left = narrow ? 34 : 150, right = narrow ? 24 : 40, top = narrow ? 76 : 44, bottom = narrow ? 78 : 78;
  const { xMin, xMax } = sc, span = xMax - xMin || 1;
  const pad = sc.binned ? span * 0.04 : 0.5;
  const x0 = xMin - pad, x1 = xMax + pad;
  const sx = (v: number) => left + ((v - x0) / (x1 - x0)) * (W - left - right);
  const sy = (v: number) => top + ((6.3 - v) / 5.6) * (H - top - bottom);
  const fy = (py: number) => 6.3 - ((py - top) / (H - top - bottom)) * 5.6;
  const ends: [number, number] = line ? [clampShow(lineAt(line, xMin)), clampShow(lineAt(line, xMax))] : [3.5, 3.5];
  const xs = [xMin, xMax];
  const active = !locked && Boolean(onLine);
  const setEnd = (k: 0 | 1, y: number) => {
    const next: [number, number] = [...ends];
    next[k] = clampShow(y);
    onLine?.(lineThrough(xMin, next[0], xMax, next[1]));
  };
  const toSvg = (e: PointerEvent<SVGSVGElement>) => {
    const svg = e.currentTarget, m = svg.getScreenCTM();
    if (!m) return null;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    return pt.matrixTransform(m.inverse());
  };
  const down = (e: PointerEvent<SVGSVGElement>) => {
    if (!active) return;
    const pt = toSvg(e);
    if (!pt) return;
    const k: 0 | 1 = pt.x < (sx(xMin) + sx(xMax)) / 2 ? 0 : 1;
    setDrag(k); setEnd(k, fy(pt.y));
    e.currentTarget.setPointerCapture(e.pointerId);
    e.preventDefault();
  };
  const move = (e: PointerEvent<SVGSVGElement>) => {
    if (drag === null || !active) return;
    const pt = toSvg(e);
    if (pt) setEnd(drag, fy(pt.y));
  };
  const up = () => setDrag(null);
  const key = (k: 0 | 1) => (e: KeyboardEvent<SVGGElement>) => {
    if (!active) return;
    const step = { ArrowUp: 0.1, ArrowRight: 0.1, ArrowDown: -0.1, ArrowLeft: -0.1, PageUp: 0.5, PageDown: -0.5 }[e.key];
    if (step === undefined) return;
    e.preventDefault();
    setEnd(k, ends[k] + step);
  };
  const xTicks = sc.binned
    ? Array.from({ length: Math.floor(xMax / 10) - Math.ceil(xMin / 10) + 1 }, (_, i) => 10 * (Math.ceil(xMin / 10) + i))
    : Array.from({ length: xMax - xMin + 1 }, (_, i) => xMin + i);
  const r = (n: number) => 4 + 12 * Math.sqrt(n / sc.nMax);
  const rule = line ? `Bei ${answerName(item, xMin)} zeigt dein Automat ${de(ends[0], 1)}, bei ${answerName(item, xMax)} zeigt er ${de(ends[1], 1)}.` : 'Deine Gerade ist noch nicht gesetzt.';
  const summary = `Streudiagramm: mittlere Zufriedenheit mit der Demokratie je ${item.groups ? 'Altersgruppe' : 'Antwort'}, ${sc.dots.length} Punkte. ${rule}${real ? ` Die echte Gerade aus R zeigt ${de(lineAt(real, xMin), 1)} und ${de(lineAt(real, xMax), 1)}.` : ''}`;
  const halo = { paintOrder: 'stroke' as const, stroke: '#fff', strokeWidth: 4, strokeLinejoin: 'round' as const };
  return <figure ref={box} className="s08-line" style={{ margin: '12px 0' }}>
    <svg viewBox={`0 0 ${W} ${H}`} role={active ? 'group' : 'img'} aria-label={summary} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
      style={{ width: '100%', height: 'auto', background: '#fff', border: '1px solid var(--line, #d9d6cb)', borderRadius: 8, touchAction: active ? 'none' : 'auto', cursor: active ? (drag !== null ? 'grabbing' : 'pointer') : 'default', userSelect: 'none', font: 'var(--fs-caption) var(--sans, sans-serif)' }}>
      {narrow
        ? <><text x={8} y={18} fill={INK} fontWeight={600}>Anzeige: Zufriedenheit mit der Demokratie</text>
          <text x={8} y={37} fill="#6b6a60" fontSize={13}>6 = sehr zufrieden … 1 = sehr unzufrieden</text></>
        : <><text x={left - 12} y={20} textAnchor="end" fill={INK} fontWeight={600}>Anzeige</text>
          <text x={left} y={20} fill="#6b6a60">Zufriedenheit mit der Demokratie</text></>}
      {[1, 2, 3, 4, 5, 6].map(v => <g key={v}>
        <line x1={left} x2={W - right} y1={sy(v)} y2={sy(v)} stroke="#ecebe4" />
        <text x={left - 10} y={sy(v) + 5} textAnchor="end" fill={INK}>{v}</text>
        {!narrow && (v === 1 || v === 6) && <text x={left - 28} y={sy(v) + 5} textAnchor="end" fill="#6b6a60">{v === 6 ? 'sehr zufrieden' : 'sehr unzufrieden'}</text>}
      </g>)}
      {xTicks.map(v => <g key={v}>
        <line x1={sx(v)} x2={sx(v)} y1={H - bottom} y2={H - bottom + 6} stroke={INK} />
        <text x={sx(v)} y={H - bottom + 22} textAnchor="middle" fill={INK}>{v}</text>
      </g>)}
      <line x1={left} x2={W - right} y1={H - bottom} y2={H - bottom} stroke={INK} />
      {!item.groups && narrow && item.levels?.[xMin] && item.levels?.[xMax] && <text x={(left + W - right) / 2} y={H - bottom + 42} textAnchor="middle" fill="#6b6a60" fontSize={13}>{xMin} = {item.levels[xMin]} · {xMax} = {item.levels[xMax]}</text>}
      {!item.groups && !narrow && item.levels?.[xMin] && <text x={sx(xMin)} y={H - bottom + 42} textAnchor="start" fill="#6b6a60">{item.levels[xMin]}</text>}
      {!item.groups && !narrow && item.levels?.[xMax] && <text x={sx(xMax)} y={H - bottom + 42} textAnchor="end" fill="#6b6a60">{item.levels[xMax]}</text>}
      <text x={(left + W - right) / 2} y={H - 8} textAnchor="middle" fill={INK} fontWeight={600}>Eingabe: {narrow ? item.title : item.ask}</text>
      {sc.dots.map((d, i) => <g key={d.x}>
        <circle cx={sx(d.x)} cy={sy(d.mean)} r={r(d.n)} fill={ANSWER} fillOpacity={0.7} stroke={CAT_DARK[1]} />
        {/* viele Punkte (Alter): Zahlen abwechselnd versetzt, damit sie sich nicht überdecken */}
        {showN && <text x={sx(d.x)} y={sy(d.mean) + r(d.n) + 13 + (sc.binned && i % 2 ? 12 : 0)} textAnchor="middle" fill="#8a897e" fontSize={narrow ? 12 : 11} style={halo}>{d.n}</text>}
      </g>)}
      {narrow
        ? <g fontSize={13}>
          <line x1={8} x2={30} y1={54} y2={54} stroke={MINE} strokeWidth={4} />
          <text x={35} y={58} fill={MINE} fontWeight={600}>dein Automat</text>
          {real && <><line x1={142} x2={164} y1={54} y2={54} stroke={REAL} strokeWidth={4} />
            <text x={169} y={58} fill={REAL} fontWeight={600}>echter Automat (R)</text></>}
        </g>
        : <g fontSize={13}>
          <line x1={W - right - 150} x2={W - right - 126} y1={14} y2={14} stroke={MINE} strokeWidth={4} />
          <text x={W - right - 120} y={18} fill={MINE} fontWeight={600}>dein Automat</text>
          {real && <><line x1={W - right - 150} x2={W - right - 126} y1={32} y2={32} stroke={REAL} strokeWidth={4} />
            <text x={W - right - 120} y={36} fill={REAL} fontWeight={600}>echter Automat (R)</text></>}
        </g>}
      {real && <line x1={sx(xMin)} x2={sx(xMax)} y1={sy(lineAt(real, xMin))} y2={sy(lineAt(real, xMax))} stroke={REAL} strokeWidth={4} />}
      <line x1={sx(xMin)} x2={sx(xMax)} y1={sy(ends[0])} y2={sy(ends[1])} stroke={MINE} strokeWidth={line ? 4 : 2} strokeDasharray={line ? undefined : '6 5'} />
      {xs.map((xv, i) => {
        const k = i as 0 | 1, cx = sx(xv), cy = sy(ends[k]), big = drag === k || hover === k || focus === k;
        const label = line ? `zeigt ${de(ends[k], 1)}` : 'zieh mich';
        // Beschriftung auf der Seite, auf der die Gerade nicht verläuft
        const below = k === 0 ? ends[1] > ends[0] + 0.05 : ends[1] < ends[0] - 0.05;
        return <g key={k} role="slider" tabIndex={active ? 0 : -1} aria-label={`Anzeige deines Automaten bei ${answerName(item, xv)}`}
          aria-valuemin={1} aria-valuemax={6} aria-valuenow={ends[k]} aria-valuetext={line ? `zeigt ${de(ends[k], 1)}` : 'noch nicht gesetzt'} aria-disabled={!active}
          onKeyDown={key(k)} onFocus={() => setFocus(k)} onBlur={() => setFocus(null)} onPointerEnter={() => setHover(k)} onPointerLeave={() => setHover(null)}
          style={{ cursor: active ? (drag === k ? 'grabbing' : 'grab') : 'default', outline: 'none' }}>
          {active && focus === k && <circle cx={cx} cy={cy} r={22} fill="none" stroke={MINE} strokeWidth={2} strokeDasharray="3 3" />}
          <circle cx={cx} cy={cy} r={active && big ? 16 : 13} fill={line ? MINE : '#fff'} stroke={line ? '#fff' : MINE} strokeWidth={3} />
          {active && <circle cx={cx} cy={cy} r={24} fill="transparent" />}
          <text x={cx + (k === 0 ? 20 : -20)} y={below ? cy + 34 : cy - 20} textAnchor={k === 0 ? 'start' : 'end'} fill={MINE} fontWeight={700} fontSize={16} style={halo}>{label}</text>
        </g>;
      })}
    </svg>
    <figcaption style={{ fontSize: 'var(--fs-caption)', color: 'var(--muted, #6b6a60)', marginTop: 6 }}>
      {sc.binned
        ? 'Orange Punkte: So zufrieden sind die Befragten eines Alters im Schnitt (je fünf Jahrgänge zusammengefasst).'
        : 'Orange Punkte: So zufrieden sind die Befragten mit dieser Antwort im Schnitt.'} Je größer der Punkt, desto mehr Befragte{showN ? ' (Zahl darunter)' : ''}.
    </figcaption>
  </figure>;
}

/** Besucherprobe: je Person Antwort (Punkt), Anzeige des Automaten (Strich) und Faulpelz (gestrichelt); das Residuum als Linie. */
export function ProbeChart({ rows, item }: { rows: ProbeRow[]; item: InputItem }) {
  const W = 640, left = 110, right = 24, top = 30, step = 18;
  const x = (v: number) => left + ((v - 1) / 5) * (W - left - right);
  const H = top + rows.length * step + 10;
  const summary = `Besucherprobe mit ${rows.length} Befragten: Antwort, Anzeige des Automaten und des Faulpelzes je Person. Der Automat trifft ${rows.filter(r => r.hit).length}-mal auf ±1, der Faulpelz ${rows.filter(r => r.lazyHit).length}-mal.`;
  return <figure className="s08-probe">
    <div className="s08-scroll" tabIndex={0} role="region" aria-label="Besucherprobe als Grafik">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={summary}>
        {[1, 2, 3, 4, 5, 6].map(v => <g key={v}>
          <line x1={x(v)} x2={x(v)} y1={top - 8} y2={H - 6} stroke="#e4e2d8" />
          <text x={x(v)} y={16} textAnchor="middle" className="axis">{v}</text>
        </g>)}
        {rows.map((r, i) => {
          const cy = top + i * step + step / 2;
          return <g key={i}>
            <text x={left - 10} y={cy + 4} textAnchor="end">{item.groups ? `Alter ${r.x}` : `Eingabe ${r.x}`}</text>
            <line x1={x(r.show)} x2={x(r.y)} y1={cy} y2={cy} stroke={INK} strokeWidth={2} />
            <line x1={x(r.lazy)} x2={x(r.lazy)} y1={cy - 6} y2={cy + 6} stroke={LAZY} strokeWidth={2} strokeDasharray="2 2" />
            <line x1={x(r.show)} x2={x(r.show)} y1={cy - 7} y2={cy + 7} stroke={INK} strokeWidth={3} />
            <circle cx={x(r.y)} cy={cy} r={4.5} fill={ANSWER} />
          </g>;
        })}
      </svg>
    </div>
    <figcaption>Skala 1 (sehr unzufrieden) bis 6 (sehr zufrieden). Punkt = Antwort, dicker Strich = Anzeige des Automaten, gestrichelt = Faulpelz, Linie = wie weit der Automat danebenliegt.</figcaption>
    <details className="s08-table-toggle"><summary>Als Tabelle</summary>
      <div className="s08-scroll" tabIndex={0} role="region" aria-label="Besucherprobe als Tabelle">
        <table className="s08-table">
          <thead><tr><th scope="col">{item.groups ? 'Alter' : 'Eingabe'}</th><th scope="col">Antwort</th><th scope="col">Automat</th><th scope="col">daneben</th><th scope="col">Faulpelz</th><th scope="col">daneben</th></tr></thead>
          <tbody>{rows.map((r, i) => <tr key={i}>
            <td>{r.x}</td><td>{r.y}</td><td>{de(r.show, 2)}</td><td>{de(r.y - r.show, 2)}{r.hit ? ' ✓' : ''}</td><td>{de(r.lazy, 2)}</td><td>{de(r.y - r.lazy, 2)}{r.lazyHit ? ' ✓' : ''}</td>
          </tr>)}</tbody>
        </table>
      </div>
    </details>
  </figure>;
}

/** Residuen-SD je Eingabestufe als Balken mit Bezugslinie beim Standardfehler der Schätzung; darunter die Residuenmittel. */
export function SpreadChart({ spread, item }: { spread: Spread; item: InputItem }) {
  const groups = spread.groups;
  const W = 720, left = 270, right = 70, top = 24, step = 24;
  const top2 = Math.max(spread.max, spread.sigma) * 1.15 || 1;
  const x = (v: number) => left + (v / top2) * (W - left - right);
  const H = top + groups.length * step + 16;
  const summary = `Residuen-SD je Stufe von ${de(spread.min, 2)} (${levelName(item, spread.minAt)}) bis ${de(spread.max, 2)} (${levelName(item, spread.maxAt)}); über alle ${de(spread.sigma, 2)}.`;
  return <figure className="s08-spread">
    <div className="s08-scroll" tabIndex={0} role="region" aria-label="Streuung je Stufe als Grafik">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={summary}>
        <line x1={x(spread.sigma)} x2={x(spread.sigma)} y1={top - 10} y2={H - 8} stroke={INK} strokeDasharray="4 3" />
        <text x={x(spread.sigma)} y={12} textAnchor="middle" className="axis">alle: {de(spread.sigma, 2)}</text>
        {groups.map((g, i) => {
          const cy = top + i * step;
          return <g key={g.value}>
            <text x={left - 10} y={cy + 14} textAnchor="end">{g.label}</text>
            {Number.isFinite(g.sd)
              ? <><rect x={left} y={cy + 3} width={Math.max(0, x(g.sd) - left)} height={step - 8} fill={g.value === spread.maxAt ? CAT[3] : CAT[0]} />
                <text x={x(g.sd) + 6} y={cy + 14}>{de(g.sd, 2)}{g.n < 30 ? ` (n = ${g.n})` : ''}</text></>
              : <text x={left + 4} y={cy + 14}>zu wenige Befragte</text>}
          </g>;
        })}
      </svg>
    </div>
    <div className="s08-scroll" tabIndex={0} role="region" aria-label="Streuung und Residuenmittel als Tabelle">
      <table className="s08-table">
        <caption>Je Stufe: Befragte, Residuen-SD (wie weit er typischerweise danebenliegt) und Residuenmittel (liegt die Gerade dort zu hoch oder zu tief?)</caption>
        <thead><tr><th scope="col">Stufe</th><th scope="col">n</th><th scope="col">SD</th><th scope="col">Mittel</th></tr></thead>
        <tbody>{groups.map(g => <tr key={g.value}><th scope="row">{g.label}</th><td>{g.n}</td><td>{de(g.sd, 3)}</td><td>{de(g.mean, 2)}</td></tr>)}</tbody>
      </table>
    </div>
  </figure>;
}

/** Automaten-Parade: alle zehn Eingaben aus der eigenen Datei. */
export function ParadeTable({ rows, own }: { rows: ParadeRow[]; own: string | null }) {
  return <div className="s08-scroll" tabIndex={0} role="region" aria-label="Automaten-Parade">
    <table className="s08-table s08-parade">
      <caption>Automaten-Parade: Steigung, R², Treffer auf ±1 gegen den Faulpelz und Streuung der Residuen je Stufe</caption>
      <thead><tr><th scope="col">Eingabe</th><th scope="col">b</th><th scope="col">R²</th><th scope="col">Treffer</th><th scope="col">Faulpelz</th><th scope="col">daneben je Stufe</th></tr></thead>
      <tbody>{rows.map(r => <tr key={r.item.id} className={r.item.id === own ? 'own' : ''}>
        <th scope="row">{r.item.title}</th><td>{de(r.b, 3)}</td><td>{de(r.r2, 3)}</td>
        <td>{de(100 * r.hit, 1)} %{r.hit < r.lazyHit - 1e-12 ? ' ↓' : ''}</td><td>{de(100 * r.lazyHit, 1)} %</td><td>{de(r.sdMin, 2)}–{de(r.sdMax, 2)}</td>
      </tr>)}</tbody>
    </table>
  </div>;
}
