import { useState, type KeyboardEvent } from 'react';
import { EIGHT, EIGHT_LINE, type Point } from '../content';
import { useAnnounce } from '../../blocks/announce';
import { Axes, C, frame, Line, LAGE_TICKS, Note, num, spread, T, Y10_TICKS } from './plot';

const F = frame(640, 400, { l: 56, r: 20, t: 26, b: 58 }, [0.5, 5.5], [0, 10]);
const { intercept: A, slope: B } = EIGHT_LINE;

/** Feedback for one person (sitzung09.md, B3). */
export function residualText(p: Point): string {
  const pred = A + B * p.x, r = p.y - pred;
  const sentence = r > 0 ? 'Sie liegt über der Geraden, zufriedener als vorhergesagt.'
    : r < 0 ? 'Sie liegt unter der Geraden, weniger zufrieden als vorhergesagt.' : 'Sie liegt genau auf der Geraden.';
  return `Person mit Lage ${p.x} und Zufriedenheit ${p.y}: Die Gerade sagt ${num(pred)} vorher. Residuum: ${p.y} minus ${num(pred)} = ${num(r)}. ${sentence}`;
}

/** Text version B3 (sitzung09.md). */
export const RESIDUALS_TEXT = 'Acht Befragte, zum Beispiel. Lage und Lebenszufriedenheit: 1 und 4; 2 und 6; 2 und 7; 3 und 6; 3 und 8; 4 und 8; 4 und 9; 5 und 8. Die Gerade 4 plus 1 mal Lage sagt für Lage 1 bis 5 die Werte 5, 6, 7, 8 und 9 vorher. Residuen, also beobachtet minus vorhergesagt: minus 1, 0, plus 1, minus 1, plus 1, 0, plus 1, minus 1. Die Mittelwerte beider Variablen (3 und 7) liegen genau auf der Geraden.';

/** Bild B3 „s9-residuen“: eight constructed persons, the line 4 + 1 × Lage, residual lines; every point is a button. */
export function Residuals() {
  const [chosen, setChosen] = useState<number | null>(null);
  const [text, announce] = useAnnounce('', '');
  const pts = spread(EIGHT);
  const choose = (i: number) => { setChosen(i); announce(residualText(EIGHT[i])); };
  const onKey = (i: number) => (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(i); }
  };
  return <div className="s9-bild">
    <div role="group" aria-label="Acht Befragte, zum Beispiel, mit der Geraden 4 plus 1 mal Lage. Jeder Punkt ist ein Knopf." aria-describedby="s9-residuen-text">
      <svg viewBox={`0 0 ${F.w} ${F.h}`} width="100%" className="s9-svg">
        <g aria-hidden="true">
          <Note f={F}>zum Beispiel acht Befragte</Note>
          <Axes f={F} xTicks={LAGE_TICKS} yTicks={Y10_TICKS} xTitle="Eigene wirtschaftliche Lage" yTitle="Lebenszufriedenheit" />
          <Line f={F} a={A} b={B} from={1} to={5} stroke={C.green} strokeWidth={3.5} />
          {pts.map((p, i) => <line key={i} x1={F.px(p.at)} x2={F.px(p.at)} y1={F.py(p.y)} y2={F.py(A + B * p.x)} stroke={C.orange} strokeWidth={chosen === i ? 4 : 2.5} />)}
          <g stroke={C.gray} strokeWidth={2}>
            <line x1={F.px(3) - 6} x2={F.px(3) + 6} y1={F.py(7) - 6} y2={F.py(7) + 6} />
            <line x1={F.px(3) - 6} x2={F.px(3) + 6} y1={F.py(7) + 6} y2={F.py(7) - 6} />
          </g>
          <T x={F.px(3) + 12} y={F.py(7) + 22} textAnchor="start" fontSize={12}>Schwerpunkt: Mittelwerte 3 und 7</T>
        </g>
        {pts.map((p, i) => <g key={i} role="button" tabIndex={0} className="s9-punkt" aria-pressed={chosen === i}
          aria-label={`Person mit Lage ${p.x} und Zufriedenheit ${p.y}`} onClick={() => choose(i)} onKeyDown={onKey(i)}>
          <circle cx={F.px(p.at)} cy={F.py(p.y)} r={16} fill="transparent" />
          <circle cx={F.px(p.at)} cy={F.py(p.y)} r={chosen === i ? 11 : 9} fill={C.blue} stroke={C.blueDark} strokeWidth={chosen === i ? 3 : 1.5} />
        </g>)}
      </svg>
    </div>
    <p className="sr-only" id="s9-residuen-text">{RESIDUALS_TEXT}</p>
    <p className={`rueck${text ? ' fest' : ''}`} aria-live="polite">{text || 'Tipp einen Punkt an.'}</p>
  </div>;
}
