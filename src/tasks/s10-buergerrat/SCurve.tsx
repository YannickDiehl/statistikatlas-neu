import { linkinv, logitOf, type LogitFit } from '../kit/logit';
import { de } from '../kit/numbers';
import { PERSONS, type PersonId } from './content';
import type { Profile } from './domain';
import { CAT_DARK, ROLE } from '../kit/palette';

const W = 560, H = 322, L = 52, R = 90, T = 16, B = 68;

/** S-Kurve der vorhergesagten Wahrscheinlichkeit über das Pflichtgefühl – je eine Kurve für das Interesse der beiden Ratsmitglieder,
 *  mit dem Schritt „eine Stufe mehr“ an ihrer Stelle. */
export function SCurve({ fit, profiles, range }: { fit: LogitFit; profiles: Record<PersonId, Profile>; range: [number, number] }) {
  const [lo, hi] = range;
  const x = (v: number) => L + ((v - lo) / (hi - lo || 1)) * (W - L - R);
  // Die y-Achse beginnt unter der niedrigsten Kurve (in Zehnerschritten), damit auch kleine Schritte oben sichtbar bleiben.
  const lowest = Math.min(...Object.values(profiles).map(pr => linkinv(logitOf(fit, [lo, pr[1]]))));
  const y0 = Math.max(0, Math.floor((lowest - 0.05) * 10) / 10);
  const y = (p: number) => T + ((1 - p) / (1 - y0)) * (H - T - B);
  const ids: PersonId[] = ['jana', 'wiegand'];
  const style: Record<PersonId, { stroke: string; dash?: string }> = { jana: { stroke: CAT_DARK[1] }, wiegand: { stroke: CAT_DARK[4], dash: '6 4' } };
  const curve = (interesse: number) => Array.from({ length: 61 }, (_, i) => lo + (i / 60) * (hi - lo))
    .map((v, i) => `${i ? 'L' : 'M'}${x(v).toFixed(1)} ${y(linkinv(logitOf(fit, [v, interesse]))).toFixed(1)}`).join(' ');
  const step = (id: PersonId) => {
    const [pf, int] = profiles[id];
    const a = linkinv(logitOf(fit, [pf, int])), b = linkinv(logitOf(fit, [pf + 1, int]));
    return { pf, a, b };
  };
  const steps = Object.fromEntries(ids.map(id => [id, step(id)])) as Record<PersonId, ReturnType<typeof step>>;
  const label = (id: PersonId) => `${PERSONS[id].name}: ${de(100 * steps[id].a, 1)} % → ${de(100 * steps[id].b, 1)} % (+${de(100 * (steps[id].b - steps[id].a), 1)} Prozentpunkte)`;
  const summary = `S-Kurve der Wahrscheinlichkeit zu wählen über das Pflichtgefühl. ${ids.map(label).join('; ')}.`;
  const ticks = Array.from({ length: Math.round(hi - lo) + 1 }, (_, i) => lo + i);
  return <figure className="s10-curve">
    <div className="s10-scroll" tabIndex={0} role="region" aria-label="S-Kurve">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={summary}>
        {Array.from({ length: Math.round((1 - y0) * 10) + 1 }, (_, i) => y0 + i / 10).filter((_, i, all) => all.length <= 6 || i % 2 === (all.length - 1) % 2).map(p => <g key={p}>
          <line x1={L} x2={W - R} y1={y(p)} y2={y(p)} className="grid" />
          <text x={L - 8} y={y(p) + 4} textAnchor="end">{de(100 * p, 0)} %</text>
        </g>)}
        {ticks.map(t => <text key={t} x={x(t)} y={H - B + 18} textAnchor="middle">{de(t, 0)}</text>)}
        <text x={(L + W - R) / 2} y={H - B + 38} textAnchor="middle">Pflichtgefühl (umgepolt: höher = mehr Zustimmung)</text>
        {ids.map((id, i) => <g key={id} transform={`translate(${L + i * 190} ${H - 10})`}>
          <line x1={0} x2={28} y1={-4} y2={-4} stroke={style[id].stroke} strokeWidth={2} strokeDasharray={style[id].dash} />
          <text x={34} y={0} className="name">{PERSONS[id].name} (Interesse {PERSONS[id].interest})</text>
        </g>)}
        {ids.map(id => {
          const s = steps[id], st = style[id];
          return <g key={id}>
            <path d={curve(profiles[id][1])} fill="none" stroke={st.stroke} strokeWidth={2} strokeDasharray={st.dash} />
            <path d={`M${x(s.pf)} ${y(s.a)} H${x(s.pf + 1)} V${y(s.b)}`} fill="none" stroke={st.stroke} strokeWidth={3} />
            <circle cx={x(s.pf)} cy={y(s.a)} r={5} fill="#fff" stroke={st.stroke} strokeWidth={2} />
            <circle cx={x(s.pf + 1)} cy={y(s.b)} r={5} fill={st.stroke} />
            <text x={x(s.pf + 1) + 8} y={(y(s.a) + y(s.b)) / 2 + 4} className="step">+{de(100 * (s.b - s.a), 1)} Pp.</text>
          </g>;
        })}
      </svg>
    </div>
    <figcaption>Vorhergesagte Wahrscheinlichkeit zu wählen – durchgezogen mit Janas Interesse, gestrichelt mit dem von Herrn Wiegand; die Achse beginnt bei {de(100 * y0, 0)} %. Derselbe Schritt nach rechts bringt unten auf der Kurve viel, oben wenig. {ids.map(label).join('; ')}.</figcaption>
  </figure>;
}

/** Nur Janas Kurve (Pflichtgefühl, Janas Interesse), Achse 0–100 %: an Janas Stelle das Modell (Punkt) und der eigene Tipp (Ring).
 *  Ohne die Schritte „eine Stufe mehr“ – die rechnet Station 4. */
export function JanaCurve({ fit, profile, range, guess }: { fit: LogitFit; profile: Profile; range: [number, number]; guess: number }) {
  const [lo, hi] = range, [pf, int] = profile;
  const Wc = 520, Hc = 280, l = 52, r = 130, t = 16, b = 52;
  const x = (v: number) => l + ((v - lo) / (hi - lo || 1)) * (Wc - l - r);
  const y = (p: number) => t + (1 - p) * (Hc - t - b);
  const path = Array.from({ length: 61 }, (_, i) => lo + (i / 60) * (hi - lo))
    .map((v, i) => `${i ? 'L' : 'M'}${x(v).toFixed(1)} ${y(linkinv(logitOf(fit, [v, int]))).toFixed(1)}`).join(' ');
  const p = linkinv(logitOf(fit, [pf, int])), g = guess / 100;
  const ticks = Array.from({ length: Math.round(hi - lo) + 1 }, (_, i) => lo + i);
  // Beschriftungen rechts neben den Punkten, bei Nähe auseinanderschieben
  let ly = y(p), gy = y(g);
  if (Math.abs(ly - gy) < 18) { const mid = (ly + gy) / 2, s = ly <= gy ? -1 : 1; ly = mid + s * 9; gy = mid - s * 9; }
  const model = `${de(100 * p, 1)} %`;
  return <figure className="s10-curve">
    <div className="s10-scroll" tabIndex={0} role="region" aria-label="Janas S-Kurve">
      <svg viewBox={`0 0 ${Wc} ${Hc}`} role="img" aria-label={`S-Kurve für Menschen wie Jana. An Janas Pflichtgefühl: Modell ${model}, dein Tipp ${guess} %.`}>
        {[0, 0.25, 0.5, 0.75, 1].map(q => <g key={q}>
          <line x1={l} x2={Wc - r} y1={y(q)} y2={y(q)} className="grid" />
          <text x={l - 8} y={y(q) + 4} textAnchor="end">{de(100 * q, 0)} %</text>
        </g>)}
        {ticks.map(v => <text key={v} x={x(v)} y={Hc - b + 18} textAnchor="middle">{de(v, 0)}</text>)}
        <text x={(l + Wc - r) / 2} y={Hc - b + 38} textAnchor="middle">Pflichtgefühl (umgepolt: höher = mehr Zustimmung)</text>
        <path d={path} fill="none" stroke={CAT_DARK[1]} strokeWidth={2.5} />
        <line x1={x(pf)} x2={x(pf)} y1={y(1)} y2={y(0)} stroke="#7d8377" strokeDasharray="4 3" />
        <line x1={x(pf)} x2={Wc - r + 6} y1={y(g)} y2={y(g)} stroke={ROLE.guess} strokeDasharray="2 3" />
        <line x1={x(pf)} x2={Wc - r + 6} y1={y(p)} y2={y(p)} stroke={ROLE.model} strokeDasharray="2 3" />
        <circle cx={x(pf)} cy={y(g)} r={7} fill="#fff" stroke={ROLE.guess} strokeWidth={3} />
        <circle cx={x(pf)} cy={y(p)} r={6} fill={ROLE.model} />
        <text x={Wc - r + 10} y={gy + 5} className="step" style={{ fill: ROLE.guess }}>Dein Tipp {guess} %</text>
        <text x={Wc - r + 10} y={ly + 5} className="step" style={{ fill: ROLE.model }}>Modell {model}</text>
      </svg>
    </div>
    <figcaption>Die Kurve für alle mit Janas Interesse. Gestrichelt senkrecht: Janas Pflichtgefühl. Punkt: das Modell, Ring: dein Tipp.</figcaption>
  </figure>;
}
