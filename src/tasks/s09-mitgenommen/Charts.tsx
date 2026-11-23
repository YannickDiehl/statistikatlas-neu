import { de } from '../kit/numbers';
import { GROUP_IDS, GROUPS, PATTERN_CARDS, PATTERNS, type GroupId, type Pattern } from './content';
import { patternName, patternOf, predictions, type Model, type Wobble } from './domain';
import { CAT, CAT_DARK, ROLE } from '../kit/palette';

const INK = ROLE.ink, GHOST = '#9b9a8e';
/** Eine feste Farbe je Gruppe, in allen Grafiken dieser Sitzung gleich: Ost-Bleibende, Ost→West, West→Ost, West-Bleibende. */
const GROUP_COLORS = [CAT[4], CAT[1], CAT[5], CAT[0]], GROUP_DARK = [CAT_DARK[4], CAT_DARK[1], CAT_DARK[5], CAT_DARK[0]];
const ci = (lo: number, hi: number) => `[${de(lo, 2)}; ${de(hi, 2)}]`;

/** Schablone: vorhergesagte Zufriedenheit je Gruppe mit Konfidenzintervall, dazu als Geister, was „Prägung“ und „Ort“ erwarten. */
export function TemplateChart({ model }: { model: Model }) {
  const pr = predictions(model);
  const lo = Math.min(...GROUP_IDS.map(g => pr[g].lower)), hi = Math.max(...GROUP_IDS.map(g => pr[g].upper));
  const pad = 0.1 * (hi - lo || 1), min = lo - pad, max = hi + pad;
  const W = 640, H = 300, left = 56, right = 20, top = 36, bottom = 64;
  const x = (i: number) => left + (i + 0.5) * ((W - left - right) / 4);
  const y = (v: number) => top + (1 - (v - min) / (max - min)) * (H - top - bottom);
  // Prägung: Ost→West wie Ost-Bleibende, West→Ost wie West-Bleibende; Ort: umgekehrt.
  const ghosts: { g: GroupId; kind: 'Prägung' | 'Ort'; v: number }[] = [
    { g: 2, kind: 'Prägung', v: pr[1].fit }, { g: 3, kind: 'Prägung', v: pr[4].fit }, { g: 2, kind: 'Ort', v: pr[4].fit }, { g: 3, kind: 'Ort', v: pr[1].fit },
  ];
  const ticks = [0, 1, 2, 3, 4].map(k => min + (k / 4) * (max - min));
  const summary = `Vorhergesagte Zufriedenheit: ${GROUP_IDS.map(g => `${GROUPS[g].short} ${de(pr[g].fit, 2)} ${ci(pr[g].lower, pr[g].upper)}`).join('; ')}. „Prägung“ erwartet Ost→West bei ${de(pr[1].fit, 2)}, „Ort“ West→Ost bei ${de(pr[1].fit, 2)}.`;
  return <figure className="s09-template">
    <div className="s09-scroll" tabIndex={0} role="region" aria-label="Schablone als Grafik">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={summary}>
        {ticks.map(t => <g key={t}><line x1={left} x2={W - right} y1={y(t)} y2={y(t)} stroke="#e4e2d8" /><text x={left - 8} y={y(t) + 4} textAnchor="end">{de(t, 2)}</text></g>)}
        {ghosts.map((gh, i) => {
          const cx = x(gh.g - 1) + (gh.kind === 'Prägung' ? -22 : 22);
          return <g key={i}>
            <line x1={cx - 12} x2={cx + 12} y1={y(gh.v)} y2={y(gh.v)} stroke={GHOST} strokeWidth={2} strokeDasharray="4 3" />
            <text x={cx} y={y(gh.v) - 6} textAnchor="middle" className="ghost">{gh.kind}</text>
          </g>;
        })}
        {GROUP_IDS.map((g, i) => <g key={g}>
          <line x1={x(i)} x2={x(i)} y1={y(pr[g].lower)} y2={y(pr[g].upper)} stroke={GROUP_DARK[i]} strokeWidth={2.5} />
          <line x1={x(i) - 6} x2={x(i) + 6} y1={y(pr[g].lower)} y2={y(pr[g].lower)} stroke={GROUP_DARK[i]} strokeWidth={2.5} />
          <line x1={x(i) - 6} x2={x(i) + 6} y1={y(pr[g].upper)} y2={y(pr[g].upper)} stroke={GROUP_DARK[i]} strokeWidth={2.5} />
          <circle cx={x(i)} cy={y(pr[g].fit)} r={7} fill={GROUP_COLORS[i]} stroke={GROUP_DARK[i]} strokeWidth={1.5} />
          <text x={x(i)} y={H - bottom + 20} textAnchor="middle" className="head" style={{ fill: GROUP_DARK[i] }}>{GROUPS[g].short}</text>
          <text x={x(i)} y={H - bottom + 38} textAnchor="middle">n = {pr[g].n}</text>
        </g>)}
        <text x={left} y={18}>Vorhersage je Gruppe mit 95-%-Konfidenzintervall (höher = zufriedener)</text>
      </svg>
    </div>
    <figcaption>Gestrichelt: wo die Umgezogenen liegen müssten, wenn „Prägung“ bzw. „Ort“ stimmte. Das Bild ist bei jeder Referenzgruppe dasselbe.</figcaption>
  </figure>;
}

/** Koeffiziententabelle mit Konfidenzintervallen und Vorhersagen je Gruppe. */
export function CoefTable({ model }: { model: Model }) {
  const pr = predictions(model), ref = model.spec.ref;
  return <div className="s09-scroll" tabIndex={0} role="region" aria-label="Koeffizienten und Vorhersagen">
    <table className="s09-table">
      <caption>Referenzgruppe {GROUPS[ref].short}: Abstand zur Referenzgruppe (B) und Vorhersage je Gruppe, jeweils mit 95-%-Konfidenzintervall</caption>
      <thead><tr><th scope="col">Gruppe</th><th scope="col">n</th><th scope="col">B [KI]</th><th scope="col">Vorhersage [KI]</th></tr></thead>
      <tbody>{GROUP_IDS.map(g => <tr key={g} className={g === ref ? 'ref' : ''}>
        <th scope="row">{GROUPS[g].short}</th><td>{model.n[g]}</td>
        <td>{g === ref ? 'Referenz' : `${de(model.b[g], 2)} ${ci(model.ci[g][0], model.ci[g][1])}`}</td>
        <td>{de(pr[g].fit, 2)} {ci(pr[g].lower, pr[g].upper)}</td>
      </tr>)}</tbody>
    </table>
  </div>;
}

/** Tafel der anderen Schnittplätze: dieselbe Frage mit jeder Referenz. */
export function BoardTable({ rows, own, vif }: { rows: { ref: GroupId; model: Model }[]; own: GroupId[]; vif?: Partial<Record<GroupId, number>> }) {
  const pr = rows[0] ? predictions(rows[0].model) : null;
  return <div className="s09-scroll" tabIndex={0} role="region" aria-label="Tafel der anderen Schnittplätze">
    <table className="s09-table s09-board">
      <caption>Tafel der anderen Schnittplätze: Konstante und B je Referenzgruppe – die Vorhersage ist bei jeder Referenzgruppe gleich</caption>
      <thead><tr><th scope="col">Referenzgruppe →</th>{rows.map(r => <th key={r.ref} scope="col" className={own.includes(r.ref) ? 'own' : ''}>{GROUPS[r.ref].short}</th>)}<th scope="col">Vorhersage</th></tr></thead>
      <tbody>
        <tr><th scope="row">Konstante</th>{rows.map(r => <td key={r.ref} className={own.includes(r.ref) ? 'own' : ''}>{de(r.model.c, 2)}</td>)}<td /></tr>
        {GROUP_IDS.map(g => <tr key={g}><th scope="row">{GROUPS[g].short}</th>
          {rows.map(r => <td key={r.ref} className={own.includes(r.ref) ? 'own' : ''}>{g === r.ref ? 'Referenz' : de(r.model.b[g], 2)}</td>)}
          <td>{pr ? de(pr[g].fit, 2) : '–'}</td>
        </tr>)}
        {vif && <tr><th scope="row">größter VIF</th>{rows.map(r => <td key={r.ref} className={own.includes(r.ref) ? 'own' : ''}>{vif[r.ref] !== undefined && Number.isFinite(vif[r.ref]) ? de(vif[r.ref]!, 1) : '–'}</td>)}<td /></tr>}
      </tbody>
    </table>
  </div>;
}

/** Wackeltest als Liste: voller Wert und Spanne ohne die fünf einflussreichsten Befragten. */
export function WobbleList({ rows, model }: { rows: Wobble[]; model: Model }) {
  return <ul className="s09-wobble">{rows.map(r => <li key={r.g}>
    <strong>{GROUPS[r.g].short}</strong> (Abstand zur Referenzgruppe {GROUPS[model.spec.ref].short}, n = {model.n[r.g]}): {de(r.full, 2)} – ohne die fünf Befragten, die am stärksten ziehen, {Number.isFinite(r.lo) ? `zwischen ${de(r.lo, 2)} und ${de(r.hi, 2)}` : 'nicht mehr schätzbar'}.
  </li>)}</ul>;
}


/* ---------- Tipp vor dem Modell: drei Bildkarten ---------- */

const SKETCH_LABELS = ['Ost', 'O→W', 'W→O', 'West'];
const MUTED = ROLE.muted;

/** Mini-Skizze: die vier Gruppen als Punkte, unten unzufriedener, oben zufriedener; gestrichelt die Höhe der beiden Bleibenden. */
export function PatternSketch({ pos, label }: { pos: number[]; label: string }) {
  const W = 180, H = 96, top = 16, bottom = 62;
  const y = (v: number) => bottom - Math.max(-0.3, Math.min(1.3, v)) * (bottom - top);
  const x = (i: number) => 58 + i * 36;
  return <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} style={{ width: '100%', maxWidth: 240, height: 'auto', display: 'block', font: '11px var(--sans)' }}>
    {[0, 1].map(v => <line key={v} x1={40} x2={W - 6} y1={y(v)} y2={y(v)} stroke="#cdd0c4" strokeDasharray="3 3" />)}
    <line x1={14} x2={14} y1={bottom} y2={top} stroke={MUTED} />
    <polygon points={`10,${top + 6} 18,${top + 6} 14,${top - 1}`} fill={MUTED} />
    <text transform={`translate(28 ${(top + bottom) / 2}) rotate(-90)`} textAnchor="middle" fill={MUTED} fontSize={10}>zufriedener</text>
    {pos.map((v, i) => {
      const mover = i === 1 || i === 2;
      return <g key={i}>
        <circle cx={x(i)} cy={y(v)} r={mover ? 7 : 6} fill={GROUP_COLORS[i]} stroke={GROUP_DARK[i]} />
        <text x={x(i)} y={H - 6} textAnchor="middle" fill={GROUP_DARK[i]} fontWeight={mover ? 600 : 400}>{SKETCH_LABELS[i]}</text>
      </g>;
    })}
  </svg>;
}

const sketchLabel = (pos: number[]) => `Skizze: ${GROUP_IDS.map((g, i) => `${GROUPS[g].short} ${pos[i] >= 0.67 ? 'oben' : pos[i] <= 0.33 ? 'unten' : 'in der Mitte'}`).join(', ')}.`;

/** Drei große Bildkarten zum Anklicken: Prägung, Ort, etwas dazwischen. Nach „Tipp abgeben“ gesperrt. */
export function PatternCards({ pick, locked, onPick }: { pick: Pattern | ''; locked: boolean; onPick: (p: Pattern) => void }) {
  return <div role="group" aria-label="Dein Tipp: Welches Muster zeigen die Daten?" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, margin: '0 0 12px' }}>
    {PATTERNS.map(id => {
      const on = pick === id, card = PATTERN_CARDS[id];
      return <button key={id} type="button" aria-pressed={on} aria-disabled={locked || undefined} onClick={() => { if (!locked) onPick(id); }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 6, textAlign: 'left', padding: '12px 14px', borderWidth: 2, borderRadius: 10, cursor: locked ? 'default' : 'pointer', opacity: locked && !on ? 0.5 : 1 }}>
        <PatternSketch pos={card.sketch} label={sketchLabel(card.sketch)} />
        <span style={{ fontSize: 'var(--fs-lead)', fontWeight: 600 }}>{on ? '✓ ' : ''}{card.title}</span>
        <span style={{ fontWeight: 400, color: 'var(--ink)' }}>{card.text}</span>
      </button>;
    })}
  </div>;
}

/** Nach dem Modell: der eigene Tipp neben dem Muster der eigenen Zahlen – in derselben Skizze. */
export function PatternCompare({ pick, model }: { pick: Pattern; model: Model }) {
  const r = patternOf(model);
  if (!r) return null;
  const real = GROUP_IDS.map(g => r.pos[g]);
  const card = (title: string, pos: number[]) => <figure className="task-card" style={{ margin: 0, padding: '10px 14px' }}>
    <figcaption style={{ font: '600 var(--fs-ui)/1.4 var(--sans)', marginBottom: 4 }}>{title}</figcaption>
    <PatternSketch pos={pos} label={sketchLabel(pos)} />
  </figure>;
  return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10, margin: '12px 0' }}>
    {card(`Dein Tipp: ${PATTERN_CARDS[pick].title}`, PATTERN_CARDS[pick].sketch)}
    {card(`Deine Daten: ${patternName(r.pattern).replace(/[„“]/g, '')}`, real)}
  </div>;
}

/* ---------- Vorhersage als Baukasten ---------- */

const signed3 = (x: number) => `${x > 0 ? '+' : ''}${de(x, 3)}`;

/** Bauklötze aus den eigenen Zahlen: Klotz „Konstante“ (Höhe der Referenzgruppe), darauf der Klotz B (nach unten, wenn negativ);
 *  die Oberkante ist die Vorhersage. predShown: die eigene Vorhersage, sobald sie stimmt – sonst „?“. */
export function PredictionBlocks({ refGroup, group = 2, c, b, predShown }: { refGroup: GroupId; group?: GroupId; c: number; b: number; predShown: string | null }) {
  const W = 380, H = 330, top = 28, base = 304, x0 = 150, bw = 80;
  const sum = c + b, isRef = group === refGroup;
  const lo = Math.min(1, c, sum), hi = Math.max(6, c, sum);
  const y = (v: number) => base - ((v - lo) / (hi - lo || 1)) * (base - top);
  const ticks = Array.from({ length: Math.floor(hi) - Math.ceil(lo) + 1 }, (_, i) => Math.ceil(lo) + i);
  const bTop = y(Math.max(c, sum)), bH = Math.max(2, Math.abs(y(sum) - y(c)));
  const kMid = y((lo + Math.min(c, sum)) / 2), bMid = (y(c) + y(sum)) / 2;
  const short = GROUPS[refGroup].short, who = GROUPS[group].short;
  const nubs = (yTop: number, fill: string, stroke: string) => [x0 + 14, x0 + bw - 30].map(nx => <rect key={nx} x={nx} y={yTop - 6} width={16} height={6} rx={2} fill={fill} stroke={stroke} />);
  const summary = `Baukasten aus deinen Zahlen: Konstante ${de(c, 3)} (Referenzgruppe ${short})${isRef ? `, kein B – ${who} ist die Referenzgruppe` : ` plus B ${who} ${signed3(b)}`}, ergibt die Vorhersage ${predShown ?? '– noch offen'}.`;
  const ax = x0 - 12, dir = sum >= c ? -1 : 1;
  return <figure style={{ margin: '8px 0', flex: '1 1 340px', maxWidth: 480 }}>
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={summary} style={{ width: '100%', height: 'auto', display: 'block', background: '#fff', border: '1px solid var(--line)', borderRadius: 8, font: 'var(--fs-caption) var(--sans)' }}>
      <text x={8} y={16} fill={MUTED} fontSize={12}>Zufriedenheit (höher = zufriedener)</text>
      <line x1={28} x2={28} y1={y(lo)} y2={y(hi)} stroke={MUTED} />
      {ticks.map(t => <g key={t}><line x1={24} x2={28} y1={y(t)} y2={y(t)} stroke={MUTED} /><text x={20} y={y(t) + 4} textAnchor="end" fill={MUTED} fontSize={12}>{t}</text></g>)}
      <line x1={28} x2={W - 8} y1={base} y2={base} stroke={INK} />
      {/* Klotz 1: Konstante */}
      <rect x={x0} y={y(c)} width={bw} height={base - y(c)} rx={4} fill={ROLE.modelLight} stroke={ROLE.model} strokeWidth={1.5} />
      {(isRef || b <= 0) && nubs(y(c), ROLE.modelLight, ROLE.model)}
      <text x={x0 + bw + 10} y={kMid - 18} fill={INK} fontWeight={600}>Konstante {de(c, 3)}</text>
      <text x={x0 + bw + 10} y={kMid} fill={INK}>(Referenzgruppe</text>
      <text x={x0 + bw + 10} y={kMid + 18} fill={INK}>{short})</text>
      {/* Klotz 2: B, oben drauf oder nach unten */}
      {!isRef && <>
        {b > 0 && nubs(bTop, '#e3b98a', '#a8692e')}
        <rect x={x0} y={bTop} width={bw} height={bH} rx={3} fill={b > 0 ? '#e3b98a' : '#f4dccb'} stroke="#a8692e" strokeWidth={1.5} strokeDasharray={b > 0 ? undefined : '4 3'} />
        <line x1={ax} x2={ax} y1={y(c)} y2={y(sum)} stroke="#a8692e" strokeWidth={2} />
        <polygon points={`${ax - 5},${y(sum) - dir * 7} ${ax + 5},${y(sum) - dir * 7} ${ax},${y(sum)}`} fill="#a8692e" />
        <text x={ax - 10} y={bMid - 2} textAnchor="end" fill="#7a4a1f" fontWeight={600}>+ B {who}</text>
        <text x={ax - 10} y={bMid + 16} textAnchor="end" fill="#7a4a1f">{signed3(b)}</text>
      </>}
      {isRef && <>
        <text x={x0 - 10} y={y(c) - 2} textAnchor="end" fill="#7a4a1f" fontWeight={600}>kein B:</text>
        <text x={x0 - 10} y={y(c) + 16} textAnchor="end" fill="#7a4a1f">{who} ist</text>
        <text x={x0 - 10} y={y(c) + 34} textAnchor="end" fill="#7a4a1f">die Referenz</text>
      </>}
      {/* Oberkante = Vorhersage */}
      <line x1={x0 - 4} x2={x0 + bw + 8} y1={y(sum)} y2={y(sum)} stroke={INK} strokeWidth={3} />
      <text x={x0 + bw + 10} y={y(sum) + 5} fill={INK} fontWeight={600}>= Vorhersage {predShown ?? '?'}</text>
    </svg>
    <figcaption style={{ fontSize: 'var(--fs-caption)', color: 'var(--muted)', marginTop: 4 }}>Gebaut aus deinen Zahlen: Konstante + B. Die Oberkante ist die Vorhersage für {who}.</figcaption>
  </figure>;
}
