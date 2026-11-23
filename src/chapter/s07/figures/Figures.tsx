import type { ReactNode, SVGProps } from 'react';
import { AGE_MODE, ALT, COR_G4, COR_G4_NAMES, DW15_SEX, SAMPLES, TRUE_DIFF, WELCH_EXAMPLE } from '../content';
import { de, r, whole } from '../format';
import { Mark } from './ROutput';

/* Unbewegte Bilder von Sitzung 7: Formeln als Bausteine, Intervalle, Lineal, Mittelwerte, Matrix, Entscheidungsbaum. */

const INK = '#5F6A74', RED = '#a0452f';
export function T({ children, ...p }: SVGProps<SVGTextElement>) {
  return <text fontFamily="Nunito,sans-serif" fontSize={12.5} fill={INK} textAnchor="middle" {...p}>{children}</text>;
}

/* ---------- Bild 1b: t als Bausteine ---------- */

function Stone({ tone, children, sub }: { tone: 'signal' | 'noise' | 'result'; children: ReactNode; sub?: string }) {
  return <span className={`s07-stein ${tone}`}><span>{children}</span>{sub ? <small>{sub}</small> : null}</span>;
}

/** Grundlage 1b: t = signal ÷ noise in three levels; the text is the text version. */
export function TFormula() {
  const [m, f] = DW15_SEX.groups;
  return <figure className="s07-bausteine" aria-label="t als Bausteine">
    <div className="ebene">
      <span className="frac" aria-hidden="true"><span><Stone tone="signal">Signal: Unterschied der Mittelwerte</Stone></span><span><Stone tone="noise">Rauschen: Standardfehler</Stone></span></span>
      <span className="sr-only">Signal geteilt durch Rauschen gleich t</span>
      <span aria-hidden="true">=</span><Stone tone="result">t</Stone>
    </div>
    <div className="pfeil" aria-hidden="true">↓</div>
    <div className="ebene">
      <Stone tone="noise">Standardfehler</Stone><span>= Wurzel aus (</span>
      <Stone tone="noise" sub="wie stark Männer streuen, wie viele Männer">Streuung Männer² ÷ Anzahl Männer</Stone><span>+</span>
      <Stone tone="noise" sub="wie stark Frauen streuen, wie viele Frauen">Streuung Frauen² ÷ Anzahl Frauen</Stone><span>)</span>
    </div>
    <div className="pfeil" aria-hidden="true">↓</div>
    <ul className="ebene zahlen">
      <li><b>Signal:</b> {`${de(m.mean, 3)} − ${de(f.mean, 3)} ≈ ${de(DW15_SEX.welch.diff, 3)} Stunden (R zieht die ungerundeten Mittelwerte ab; mit den gerundeten käme 7,989 heraus)`}</li>
      <li><b>Rauschen:</b> {`√(${de(m.sd, 3)}² ÷ ${whole(m.n)} + ${de(f.sd, 3)}² ÷ ${whole(f.n)}) = √(0,0466 + 0,0742) = √0,1208 ≈ 0,348 Stunden`}</li>
      <li><b>t</b> {'= 7,988 ÷ 0,348 ≈ 22,95, rund 23 (R rechnet mit allen Nachkommastellen: 22,988)'}</li>
    </ul>
  </figure>;
}

/* ---------- Bild 2c: Student gegen Welch ---------- */

export function WelchFormula() {
  const e = WELCH_EXAMPLE;
  return <figure className="s07-welch" aria-label="Zwei Arten, das Rauschen zu rechnen">
    <div className="spalten">
      <div className="spalte student">
        <p className="kopf">Student: eine gemeinsame Streuung für beide</p>
        <ul>
          <li>{`Gemeinsame Standardabweichung ≈ ${de(e.student.pooledSd, 2)} (wird von den ${e.a.n} eng liegenden Befragten bestimmt).`}</li>
          <li>{`Standardfehler = ${de(e.student.pooledSd, 2)} × √(1 ÷ ${e.a.n} + 1 ÷ ${e.b.n}) ≈ ${de(e.student.se, 2)}.`}</li>
          <li>{`t = ${de(e.diff, 1)} ÷ ${de(e.student.se, 2)} ≈ ${de(e.student.t, 2)}, p = ${de(e.student.p, 4)}.`}</li>
        </ul>
      </div>
      <div className="spalte welch">
        <p className="kopf">Welch: jede Gruppe mit ihrer eigenen Streuung</p>
        <ul>
          <li>{`Standardfehler = √(${e.a.sd}² ÷ ${e.a.n} + ${e.b.sd}² ÷ ${e.b.n}) = √(${de(e.welch.parts[0], 4)} + ${de(e.welch.parts[1], 3)}) ≈ ${de(e.welch.se, 2)}.`}</li>
          <li>{`t = ${de(e.diff, 1)} ÷ ${de(e.welch.se, 2)} ≈ ${de(e.welch.t, 2)}, p = ${de(e.welch.p, 2)}.`}</li>
        </ul>
      </div>
    </div>
    <div className="pfeil" aria-hidden="true">↓</div>
    <p className="fazit">Student: signifikant. Welch: nicht signifikant.</p>
  </figure>;
}

/* ---------- Bild 3b: F als Bausteine ---------- */

export function FFormula() {
  const b = AGE_MODE.between, w = AGE_MODE.within, total = AGE_MODE.total!;
  return <figure className="s07-bausteine" aria-label="F als Bausteine">
    <div className="ebene">
      <span className="frac" aria-hidden="true"><span><Stone tone="signal">Streuung zwischen den Gruppen ÷ Freiheitsgrade zwischen</Stone></span><span><Stone tone="noise">Streuung innerhalb der Gruppen ÷ Freiheitsgrade innerhalb</Stone></span></span>
      <span className="sr-only">Streuung zwischen den Gruppen geteilt durch Streuung innerhalb der Gruppen gleich F</span>
      <span aria-hidden="true">=</span><Stone tone="result">F</Stone>
    </div>
    <div className="pfeil" aria-hidden="true">↓</div>
    <ul className="ebene zahlen">
      <li><b>Streuung zwischen</b> = Summe über die Gruppen von (Anzahl × (Gruppenmittel − Gesamtmittel)²)</li>
      <li><b>Streuung innerhalb</b> = Summe der quadrierten Abstände jeder Person zu ihrem Gruppenmittel</li>
      <li>Fachbegriff für beide: Quadratsumme (Sum of Squares).</li>
    </ul>
    <div className="pfeil" aria-hidden="true">↓</div>
    <ul className="ebene zahlen">
      <li>{`${de(b.ss, 3)} ÷ ${b.df} = ${de(b.ms, 3)}`}</li>
      <li>{`${de(w.ss, 3)} ÷ ${whole(w.df)} = ${de(w.ms, 3)}`}</li>
      <li>{`F = ${de(b.ms, 3)} ÷ ${de(w.ms, 3)} ≈ 160,99`}</li>
      <li>{`Daneben: η² = Streuung zwischen ÷ gesamte Streuung = ${de(b.ss, 3)} ÷ ${de(total.ss, 3)} ≈ ${de(AGE_MODE.effect.eta2, 3)}`}</li>
    </ul>
  </figure>;
}

/* ---------- Bild 2b: vier Prüfsteine ---------- */

export function FourStones({ items }: { items: ReactNode[] }) {
  return <ol className="s07-pruefsteine">{items.map((it, i) => <li key={i}><span className="st m c7" aria-hidden="true">✓</span><div>{it}</div></li>)}</ol>;
}

/* ---------- Bild 1c-2: 20 Konfidenzintervalle ---------- */

export function Intervals() {
  const rows = SAMPLES.dw15, W = 640, pl = 40, pr = 20, pt = 30, rh = 13, H = pt + rows.length * rh + 40;
  const x = (v: number) => pl + v / 16 * (W - pl - pr);
  const base = pt + rows.length * rh + 4;
  return <div className="grafik" role="img" aria-label={`20 Konfidenzintervalle der Arbeitsstunden, Männer minus Frauen. ${rows.map((s, i) => `Stichprobe ${i + 1}: ${de(s.lo, 1)} bis ${de(s.hi, 1)}`).join('; ')}. ${ALT.intervals}`}>
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" aria-hidden="true" focusable="false">
      <line x1={x(0)} x2={x(0)} y1={pt - 12} y2={base} stroke="#8a939c" strokeWidth={1.5} strokeDasharray="5 4" />
      <T x={x(0) + 4} y={pt - 16} textAnchor="start">kein Unterschied</T>
      <line x1={x(TRUE_DIFF.dw15)} x2={x(TRUE_DIFF.dw15)} y1={pt - 12} y2={base} stroke={RED} strokeWidth={2.5} />
      <T x={x(TRUE_DIFF.dw15) + 5} y={pt - 16} textAnchor="start" fill={RED} fontWeight={700}>ganzer ALLBUS (7,99)</T>
      {rows.map((s, i) => {
        const y = pt + i * rh + rh / 2;
        return <g key={i}>
          <T x={pl - 8} y={y + 4} textAnchor="end" fontSize={10.5}>{String(i + 1)}</T>
          <line x1={x(s.lo)} x2={x(s.hi)} y1={y} y2={y} stroke="#2C6CA8" strokeWidth={2.5} strokeLinecap="round" />
          <circle cx={x(s.diff)} cy={y} r={3.5} fill="#1E2D3C" />
        </g>;
      })}
      <line x1={pl} x2={W - pr} y1={base} y2={base} stroke="#9aa4ad" strokeWidth={1.5} />
      {[0, 2, 4, 6, 8, 10, 12, 14, 16].map(t => <T key={t} x={x(t)} y={base + 15}>{String(t)}</T>)}
      <T x={(W + pl) / 2} y={H - 4}>Unterschied Männer minus Frauen (Stunden)</T>
    </svg>
  </div>;
}

/* ---------- Bild 1d: Effektstärken auf einem Lineal ---------- */

const BANDS = [
  { from: 0, to: 0.2, label: 'vernachlässigbar', fill: '#EEF0F2', text: '#1E2D3C' },
  { from: 0.2, to: 0.5, label: 'klein', fill: '#BFE3F7', text: '#1E2D3C' },
  { from: 0.5, to: 0.8, label: 'mittel', fill: '#86B9DE', text: '#1E2D3C' },
  { from: 0.8, to: 1, label: 'groß', fill: '#2C6CA8', text: '#fff' },
];
export function EffectRuler() {
  const W = 640, pl = 30, pr = 30, x = (v: number) => pl + v * (W - pl - pr), y = 84;
  return <div className="grafik" role="img" aria-label={ALT.ruler}>
    <svg viewBox={`0 0 ${W} 150`} width="100%" aria-hidden="true" focusable="false">
      {BANDS.map(b => <g key={b.label}>
        <rect x={x(b.from)} y={y} width={x(b.to) - x(b.from)} height={30} fill={b.fill} stroke="#fff" strokeWidth={1} />
        <T x={(x(b.from) + x(b.to)) / 2} y={y + 20} fill={b.text} fontWeight={700}>{b.label}</T>
      </g>)}
      {[0, 0.2, 0.5, 0.8, 1].map(t => <T key={t} x={x(t)} y={y + 48}>{de(t, 1)}</T>)}
      <T x={W / 2} y={146} fontSize={11.5}>Unterschied in Standardabweichungen</T>
      <path d={`M${x(0.005)},${y - 2} l-6,-10 h12 z`} fill="#F0A27E" />
      <T x={x(0.005) - 4} y={y - 18} textAnchor="start">Lebenszufriedenheit Männer/Frauen: 0,005 (kaum zu sehen)</T>
      <path d={`M${x(0.85)},${y - 2} l-6,-10 h12 z`} fill="#8a4a2c" />
      <T x={x(0.85) + 8} y={y - 42} textAnchor="end">Arbeitsstunden Männer/Frauen: 0,85</T>
      <line x1={x(0.85)} x2={x(0.85)} y1={y - 38} y2={y - 14} stroke="#8a4a2c" strokeWidth={1.5} />
    </svg>
  </div>;
}

/* ---------- Bild 3c-1: Mittelwerte mit Intervall ---------- */

export function MeansCI() {
  const W = 640, pl = 70, pr = 24, pt = 14, rh = 36, x = (v: number) => pl + (v - 40) / 25 * (W - pl - pr);
  const base = pt + AGE_MODE.groups.length * rh + 6;
  return <figure className="ebild">
    <div className="grafik" role="img" aria-label={ALT.meansCi}>
      <svg viewBox={`0 0 ${W} ${base + 40}`} width="100%" aria-hidden="true" focusable="false">
        {[40, 45, 50, 55, 60, 65].map(t => <g key={t}>
          <line x1={x(t)} x2={x(t)} y1={pt} y2={base} stroke="#EFE6DA" />
          <T x={x(t)} y={base + 16}>{String(t)}</T>
        </g>)}
        {AGE_MODE.groups.map((g, i) => {
          const y = pt + i * rh + rh / 2;
          return <g key={g.label}>
            <T x={pl - 10} y={y + 4} textAnchor="end" fontWeight={700} fill="#1E2D3C">{g.label}</T>
            <line x1={x(g.lo)} x2={x(g.hi)} y1={y} y2={y} stroke="#1E2D3C" strokeWidth={2} />
            <line x1={x(g.lo)} x2={x(g.lo)} y1={y - 6} y2={y + 6} stroke="#1E2D3C" strokeWidth={2} />
            <line x1={x(g.hi)} x2={x(g.hi)} y1={y - 6} y2={y + 6} stroke="#1E2D3C" strokeWidth={2} />
            <circle cx={x(g.mean)} cy={y} r={5} fill={RED} />
            <T x={x(g.hi) + 10} y={y + 4} textAnchor="start">{`${de(g.mean, 1)} Jahre`}</T>
          </g>;
        })}
        <line x1={pl} x2={W - pr} y1={base} y2={base} stroke="#9aa4ad" strokeWidth={1.5} />
        <T x={(W + pl) / 2} y={base + 34}>Alter in Jahren</T>
      </svg>
    </div>
    <figcaption>ALLBUS 2023, gewichtet, gewichtetes N = 5.224; Achse beginnt bei 40.</figcaption>
  </figure>;
}

/* ---------- Bild 4a: Korrelationsmatrix ---------- */

const stars = (p: string) => (p === '<.001' ? '***' : Number(p) < 0.01 ? '**' : Number(p) < 0.05 ? '*' : '');
const cellBg = (v: number) => {
  const a = Math.min(0.85, Math.abs(v) * 1.8).toFixed(2);
  return v >= 0 ? `rgba(240,162,126,${a})` : `rgba(134,185,222,${a})`;
};

export function CorrelationMatrix() {
  const { vars, r: rs, p, n } = COR_G4;
  const noStar = `p = ${vars.flatMap((_, i) => vars.slice(0, i).map((__, j) => p[i][j])).filter(x => !stars(x)).join(', ')}`;
  const head = (v: string) => <th scope="col" key={v}><code>{v}</code><small>{COR_G4_NAMES[v].replace(/ \(.*/, '')}</small></th>;
  return <figure className="s07-matrix">
    <div className="tabellen">
      <table className="daten">
        <caption>Correlation Matrix (r, Sterne: signifikant)</caption>
        <thead><tr><td />{vars.map(head)}</tr></thead>
        <tbody>{vars.map((v, i) => <tr key={v}>
          <th scope="row"><code>{v}</code><small>{COR_G4_NAMES[v].replace(/ \(.*/, '')}</small></th>
          {vars.map((_, j) => {
            if (i === j) return <td key={j} className="diag">1{i === 0 ? <Mark n={1} /> : null}</td>;
            if (j > i) return <td key={j} className="spiegel">{`${r(rs[i][j])}${stars(p[i][j])}`}{i === 0 && j === 1 ? <Mark n={2} /> : null}</td>;
            return <td key={j} style={{ background: cellBg(rs[i][j]) }}>{`${r(rs[i][j])}${stars(p[i][j])}`}{i === 3 && j === 2 ? <Mark n={3} /> : null}</td>;
          })}
        </tr>)}</tbody>
      </table>
      <table className="daten klein">
        <caption>Sample Size Matrix (N je Paar) <Mark n={4} /></caption>
        <thead><tr><td />{vars.map(v => <th scope="col" key={v}><code>{v}</code></th>)}</tr></thead>
        <tbody>{vars.map((v, i) => <tr key={v}><th scope="row"><code>{v}</code></th>{vars.map((_, j) => <td key={j}>{n[i][j]}</td>)}</tr>)}</tbody>
      </table>
    </div>
    <figcaption>
      <p className="hilfe-zeile">{`Gesundheit: ${COR_G4_NAMES.hs01.replace('Gesundheit ', '')}. Kräftig orange: positiv, kräftig blau: negativ; das Vorzeichen steht immer dabei. Ohne Stern: ${noStar}. R schreibt Kommazahlen mit Punkt.`}</p>
      <ol className="s07-legende">
        <li><Mark n={1} /> Diagonale: jede Variable mit sich selbst, immer 1.</li>
        <li><Mark n={2} /> Die Matrix ist gespiegelt; jedes Paar steht zweimal, lies nur eine Hälfte.</li>
        <li><Mark n={3} /> Sterne: signifikant.</li>
        <li><Mark n={4} /> N je Paar: Jedes Paar nutzt alle, die bei <b>beiden</b> Variablen geantwortet haben (paarweiser Ausschluss), darum sind die Zahlen verschieden.</li>
      </ol>
    </figcaption>
  </figure>;
}

/* ---------- Bild Ü1: Entscheidungsbaum ---------- */

const STROKE = '#978B7B';
function Node({ x, y, w, lines, sub, fill, stroke }: { x: number; y: number; w: number; lines: string[]; sub?: string; fill: string; stroke: string }) {
  const h = lines.length * 16 + (sub ? 18 : 0) + 14;
  return <g>
    <rect x={x - w / 2} y={y} width={w} height={h} rx={12} fill={fill} stroke={stroke} strokeWidth={2} />
    {lines.map((l, i) => <T key={i} x={x} y={y + 20 + i * 16} fill="#1E2D3C" fontWeight={800} fontSize={13}>{l}</T>)}
    {sub ? <T x={x} y={y + 20 + lines.length * 16} fontFamily="JetBrains Mono,monospace" fontSize={11} fill="#5b4fb0">{sub}</T> : null}
  </g>;
}
const Path = ({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) =>
  <path d={`M${x1},${y1} C${x1},${(y1 + y2) / 2} ${x2},${(y1 + y2) / 2} ${x2},${y2}`} fill="none" stroke={STROKE} strokeWidth={2} />;
function Sign({ x, y, text }: { x: number; y: number; text: string }) {
  const w = text.length * 6.4 + 14;
  return <g><rect x={x - w / 2} y={y - 10} width={w} height={20} rx={7} fill="#FFFCF3" stroke="#E9DFCF" />
    <T x={x} y={y + 4} fontSize={11.5} fontWeight={700}>{text}</T></g>;
}

export function DecisionTree() {
  return <>
    <div className="grafik">
      <svg viewBox="0 0 760 330" width="100%" aria-hidden="true" focusable="false">
        <Path x1={380} y1={50} x2={150} y2={120} /><Path x1={380} y1={50} x2={520} y2={120} />
        <Path x1={520} y1={150} x2={300} y2={230} /><Path x1={520} y1={150} x2={510} y2={230} /><Path x1={520} y1={150} x2={690} y2={230} />
        <Sign x={250} y={86} text="nein, wenige Stufen ohne gleiche Abstände" /><Sign x={470} y={86} text="ja" />
        <Sign x={390} y={198} text="zwei" /><Sign x={512} y={204} text="drei oder mehr" /><Sign x={668} y={176} text="zweite metrische Variable" />
        <Node x={380} y={6} w={430} lines={['Ist die Variable, deren Werte du vergleichst, metrisch?']} fill="#FFF0E8" stroke="#F0A27E" />
        <Node x={150} y={120} w={240} lines={['Kreuztabelle, Cramér-V', 'oder Rangmaß (Sitzung 5 und 6)']} fill="#EAF5FC" stroke="#86B9DE" />
        <Node x={520} y={120} w={190} lines={['Wie viele Gruppen?']} fill="#FFF6DA" stroke="#E0C46A" />
        <Node x={300} y={230} w={180} lines={['t-Test (Welch)']} sub="t_test(…, group = …)" fill="#EAF5FC" stroke="#86B9DE" />
        <Node x={510} y={230} w={220} lines={['ANOVA, danach Tukey']} sub="oneway_anova(), tukey_test()" fill="#EAF5FC" stroke="#86B9DE" />
        <Node x={690} y={230} w={130} lines={['Pearsons r;', 'viele: Matrix']} sub="pearson_cor()" fill="#EAF5FC" stroke="#86B9DE" />
      </svg>
    </div>
    <div className="sr-only">
      <p>Entscheidungsbaum „Welches Verfahren?“ als Liste:</p>
      <ul>
        <li>Ist die Variable, deren Werte du vergleichst, metrisch?
          <ul>
            <li>nein (wenige Stufen ohne gleiche Abstände): Kreuztabelle, Cramér-V oder Rangmaß (Sitzung 5 und 6)</li>
            <li>ja: Wie viele Gruppen?
              <ul>
                <li>zwei: t-Test (Welch), <code>t_test(…, group = …)</code></li>
                <li>drei oder mehr: ANOVA, danach Tukey, <code>oneway_anova()</code> und <code>tukey_test()</code></li>
                <li>keine Gruppen, sondern eine zweite metrische Variable: Pearsons r, <code>pearson_cor()</code>; bei vielen Variablen die Korrelationsmatrix</li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </>;
}
