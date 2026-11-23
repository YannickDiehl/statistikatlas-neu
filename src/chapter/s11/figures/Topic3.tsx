// Sitzung 11, Thema 3: B8 (Rückweg zur Wahrscheinlichkeit), B9 (gleicher Faktor, verschiedene Prozentpunkte) und
// B10 (Person A und B, erst nach dem Prüfen). SVG ist dekorativ; jede Grafik hat eine Textfassung mit Werten.
import { useState, type FormEvent } from 'react';
import { useChapterState } from '../../ChapterContext';
import { useAnnounce } from '../../blocks/announce';
import { K3B, VOTE_MODEL, byHand } from '../content';
import { SvgText, de } from '../ui';
import { INK, TEAL } from './Topic1';
import { chanceText } from './Topic2';

/* ---------- B8 Rückweg ---------- */

export const B8_TEXT = 'Erstens der Logit: Konstante plus B mal Wert, 6,774 minus 0,076 mal 70 ergibt 1,454. Zweitens die Chance: e hoch 1,454 ergibt 4,28, also 4,28 zu 1. Drittens die Wahrscheinlichkeit: Chance geteilt durch 1 plus Chance, 4,28 geteilt durch 5,28 ergibt 0,811, also 81,1 Prozent.';

/** B8 `s11-rueckweg`: three steps from the logit back to the probability. */
export function WayBack() {
  return <ol className="s11-rueckweg" role="img" aria-label={B8_TEXT}>
    <li className="lila"><b>Logit = Konstante + B × Wert</b><span>6,774 − 0,076 × 70 = 1,454</span></li>
    <li className="gelb"><b>Chance = exp(Logit)</b><span>exp(1,454) = 4,28</span><small>„4,28 zu 1“</small></li>
    <li className="blau"><b>Wahrscheinlichkeit = Chance / (1 + Chance)</b><span>4,28 / 5,28 = 0,811</span><small>81,1 %</small></li>
  </ol>;
}

/* ---------- B9 Zwei Schritte ---------- */

export const B9_TEXT = 'Zwei Schritte von zehn Jahren auf derselben S-Kurve. Von 30 auf 40 Jahre: Logit von 4,494 auf 3,734, Chance von 89,5 auf 41,8, Wahrscheinlichkeit von 98,9 auf 97,7 Prozent, also minus 1,2 Prozentpunkte. Von 70 auf 80 Jahre: Logit von 1,454 auf 0,694, Chance von 4,28 auf 2,00, Wahrscheinlichkeit von 81,1 auf 66,7 Prozent, also minus 14,4 Prozentpunkte. In beiden Fällen sinkt der Logit um 0,76 und die Chance wird mit 0,47 malgenommen.';
export const B9_BEFORE = 'Die S-Kurve des Smartphone-Modells, Wahrscheinlichkeit nach Alter, mit zwei markierten Stellen: 30 Jahre und 70 Jahre. Wie viel jede bei zehn Jahren mehr verliert, zeigt das Bild nach dem Auflösen.';

const STEPS = [{ from: 30, color: '#2C6CA8', fill: '#EAF5FC' }, { from: 70, color: '#c97b55', fill: '#FFF0E8' }];
/** The three lines of the box next to a step: logit, chance, probability. */
export function stepLines(from: number): [string, string, string] {
  const a = byHand(from), b = byHand(from + 10);
  return [
    `Logit: ${de(b.logit - a.logit, 2)}`,
    `Chance: × ${de(b.chance / a.chance, 2)} (${chanceText(a.chance)} → ${chanceText(b.chance)})`,
    `Wahrscheinlichkeit: ${de(b.p - a.p, 1)} Prozentpunkte`,
  ];
}

/** B9 `s11-zwei-schritte`: first fix a guess (K3B), then „Auflösen“ draws both steps on the S-curve. */
export function TwoSteps() {
  const { state, setAnswers } = useChapterState();
  const saved = state.answers[K3B.id] ?? '';
  const [draft, setDraft] = useState(saved);
  const [resolved, setResolved] = useState(!!saved);
  const [msg, announce] = useAnnounce(saved ? `Deine Wahl: „${saved}“. ${K3B.resolution}` : '', '');

  function fix(e: FormEvent) {
    e.preventDefault();
    if (!draft) { announce('Leg dich zuerst fest.'); return; }
    setAnswers({ [K3B.id]: draft });
    announce(`Festgelegt: ${draft}. Drück jetzt „Auflösen“.`);
  }
  function resolve() {
    if (!saved) { announce('Leg dich zuerst fest.'); return; }
    setResolved(true);
    announce(`Deine Wahl: „${saved}“. ${K3B.resolution}`);
  }

  const W = 660, H = 330, L = 50, R = 250, T = 20, B = 40;
  const x = (a: number) => L + (a - 15) / 80 * (W - L - R);
  const y = (p: number) => T + (100 - p) / 100 * (H - T - B);
  const path = Array.from({ length: 78 }, (_, i) => 18 + i).map((a, i) => `${i ? 'L' : 'M'}${x(a).toFixed(1)},${y(byHand(a).p).toFixed(1)}`).join(' ');
  return <>
    <form className="kurzueberlegen" id={K3B.id} noValidate onSubmit={fix}>
      <fieldset role="radiogroup" aria-labelledby={`${K3B.id}-l`} aria-describedby={msg ? `${K3B.id}-r` : undefined}>
        <legend id={`${K3B.id}-l`}>{K3B.label}</legend>
        <div className="radios">{K3B.options.map(o => <label key={o}>
          <input type="radio" name={`${K3B.id}-wahl`} value={o} checked={draft === o} onChange={() => setDraft(o)} /> {o}
        </label>)}</div>
      </fieldset>
      <div className="reihe-knoepfe">
        <button type="submit" className="knopf">Festlegen</button>
        <button type="button" className="knopf hell" aria-disabled={!saved || undefined} onClick={resolve}>Auflösen</button>
      </div>
      <p className={`rueck${msg === 'Leg dich zuerst fest.' ? ' no' : ' text'}`} id={`${K3B.id}-r`} aria-live="polite">{msg}</p>
    </form>
    <div className="grafik" role="img" aria-label={resolved ? B9_TEXT : B9_BEFORE}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" aria-hidden="true" focusable="false">
        {[0, 25, 50, 75, 100].map(p => <g key={p}>
          <line x1={L} x2={W - R} y1={y(p)} y2={y(p)} stroke="#EFE6DA" />
          <SvgText x={L - 6} y={y(p) + 4} textAnchor="end" fontSize={11}>{`${p} %`}</SvgText>
        </g>)}
        {[20, 40, 60, 80].map(a => <SvgText key={a} x={x(a)} y={H - B + 16} fontSize={11}>{String(a)}</SvgText>)}
        <SvgText x={(L + W - R) / 2} y={H - 6} fontSize={12} fontWeight={700} fill={INK}>Alter in Jahren</SvgText>
        <line x1={L} x2={L} y1={T} y2={H - B} stroke={INK} strokeWidth={1.2} />
        <line x1={L} x2={W - R} y1={H - B} y2={H - B} stroke={INK} strokeWidth={1.2} />
        <path d={path} fill="none" stroke={TEAL} strokeWidth={3} />
        {STEPS.map((s, i) => {
          const a = byHand(s.from), b = byHand(s.from + 10);
          return <g key={s.from}>
            <circle cx={x(s.from)} cy={y(a.p)} r={6} fill={s.fill} stroke={s.color} strokeWidth={2.5} />
            {resolved ? <>
              <line x1={x(s.from)} x2={x(s.from + 10)} y1={y(a.p)} y2={y(a.p)} stroke={s.color} strokeWidth={2.5} />
              <line x1={x(s.from + 10)} x2={x(s.from + 10)} y1={y(a.p)} y2={y(b.p)} stroke={s.color} strokeWidth={4} />
              <circle cx={x(s.from + 10)} cy={y(b.p)} r={6} fill={s.color} />
              <g transform={`translate(${W - R + 14},${i ? 170 : 40})`}>
                <rect width={236} height={84} rx={10} fill={s.fill} stroke={s.color} />
                <SvgText x={10} y={20} textAnchor="start" fontWeight={800} fill={INK} fontSize={12.5}>{`${s.from} → ${s.from + 10} Jahre`}</SvgText>
                {stepLines(s.from).map((t, k) => <SvgText key={k} x={10} y={40 + k * 16} textAnchor="start" fontSize={10.5} fill={INK}>{t}</SvgText>)}
              </g>
            </> : <SvgText x={x(s.from)} y={y(a.p) + 22} fontSize={11.5} fontWeight={700} fill={s.color}>{`${s.from} Jahre`}</SvgText>}
          </g>;
        })}
      </svg>
    </div>
  </>;
}

/* ---------- B10 Person A und B ---------- */

export const B10_TEXT = 'Person A: Wahrscheinlichkeit von 76,4 auf 92,4 Prozent, plus 16,0 Prozentpunkte, Chance von 3,25 auf 12,2. Person B: von 96,0 auf 98,9 Prozent, plus 2,9 Prozentpunkte, Chance von 24,1 auf 90,8. Bei beiden wird die Chance mit 3,77 malgenommen.';

/** Probability (in %) with the rounded numbers of the output, for drawing the curve between the checked points. */
const voteCurve = (pflicht: number, interesse: number) => {
  const l = VOTE_MODEL.intercept + VOTE_MODEL.pflicht.b * pflicht + VOTE_MODEL.interesse.b * interesse;
  return 100 / (1 + Math.exp(-l));
};

/** B10 `s11-person-ab`: probability over the four levels of duty for interest 2 (A) and 4 (B); shown after the check. */
export function PersonAB() {
  const W = 600, H = 300, L = 56, R = 170, T = 20, B = 44;
  const x = (p: number) => L + (p - 1) / 3 * (W - L - R);
  const y = (v: number) => T + (100 - v) / 60 * (H - T - B);
  const [a, a1, b, b1] = VOTE_MODEL.predict.map(v => 100 * v);
  const people = [
    { name: 'A', interesse: 2, color: '#2C6CA8', from: 2, p0: a, p1: a1 },
    { name: 'B', interesse: 4, color: '#c97b55', from: 3, p0: b, p1: b1 },
  ];
  return <div className="grafik" role="img" aria-label={B10_TEXT}>
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" aria-hidden="true" focusable="false">
      {[40, 60, 80, 100].map(v => <g key={v}>
        <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} stroke="#EFE6DA" />
        <SvgText x={L - 6} y={y(v) + 4} textAnchor="end" fontSize={11}>{`${v} %`}</SvgText>
      </g>)}
      {[1, 2, 3, 4].map(p => <SvgText key={p} x={x(p)} y={H - B + 16} fontSize={11.5}>{String(p)}</SvgText>)}
      <SvgText x={(L + W - R) / 2} y={H - 6} fontSize={12} fontWeight={700} fill={INK}>Pflichtgefühl (1 = stimme gar nicht zu … 4 = stimme voll zu)</SvgText>
      <line x1={L} x2={L} y1={T} y2={H - B} stroke={INK} strokeWidth={1.2} />
      <line x1={L} x2={W - R} y1={H - B} y2={H - B} stroke={INK} strokeWidth={1.2} />
      {people.map((s, i) => {
        const d = Array.from({ length: 31 }, (_, k) => 1 + k / 10).map((p, k) => `${k ? 'L' : 'M'}${x(p).toFixed(1)},${y(voteCurve(p, s.interesse)).toFixed(1)}`).join(' ');
        return <g key={s.name}>
          <path d={d} fill="none" stroke={s.color} strokeWidth={2.5} opacity={0.7} />
          <line x1={x(s.from)} x2={x(s.from + 1)} y1={y(s.p0)} y2={y(s.p0)} stroke={s.color} strokeWidth={2} strokeDasharray="4 3" />
          <line x1={x(s.from + 1)} x2={x(s.from + 1)} y1={y(s.p0)} y2={y(s.p1)} stroke={s.color} strokeWidth={4} />
          <circle cx={x(s.from)} cy={y(s.p0)} r={6} fill="#fff" stroke={s.color} strokeWidth={2.5} />
          <circle cx={x(s.from + 1)} cy={y(s.p1)} r={6} fill={s.color} />
          <SvgText x={x(s.from + 1) + 8} y={y((s.p0 + s.p1) / 2) + 4} textAnchor="start" fontSize={12} fontWeight={800} fill={s.color}>{`+${de(s.p1 - s.p0, 1)}`}</SvgText>
          <g transform={`translate(${W - R + 16},${40 + i * 90})`}>
            <rect width={150} height={80} rx={10} fill="#fff" stroke={s.color} />
            <SvgText x={10} y={20} textAnchor="start" fontWeight={800} fill={INK} fontSize={12.5}>{`Person ${s.name} (Interesse ${s.interesse})`}</SvgText>
            <SvgText x={10} y={38} textAnchor="start" fontSize={11} fill={INK}>{`${de(s.p0, 1)} % → ${de(s.p1, 1)} %`}</SvgText>
            <SvgText x={10} y={54} textAnchor="start" fontSize={11} fill={INK}>{`+${de(s.p1 - s.p0, 1)} Prozentpunkte`}</SvgText>
            <SvgText x={10} y={70} textAnchor="start" fontSize={11} fill={INK}>{`Chance × ${de(VOTE_MODEL.pflicht.expB, 2)}`}</SvgText>
          </g>
        </g>;
      })}
    </svg>
  </div>;
}
