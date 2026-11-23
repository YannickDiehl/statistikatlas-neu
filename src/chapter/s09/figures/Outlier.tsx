import { useState } from 'react';
import { EIGHT, EIGHT_LINE, NINE_LINE, NINTH } from '../content';
import { Axes, C, frame, LAGE_TICKS, Line, Note, spread, T, Y10_TICKS } from './plot';

const F = frame(640, 400, { l: 56, r: 20, t: 26, b: 58 }, [0.5, 5.5], [0, 10]);

/** Text version B7 (sitzung09.md). */
export const OUTLIER_TEXT = 'Ohne die neunte Person: Gerade 4 plus 1 mal Lage, R² 0,67. Die neunte Person hat Lage 5 und Zufriedenheit 2. Zur alten Geraden hat sie ein Residuum von minus 7, quadriert 49, mehr als alle anderen Quadrate zusammen (6). Mit ihr wird die Gerade fast flach: 5,8 plus 0,2 mal Lage, R² 0,02.';

/** Bild B7 „s9-ausreisser“: the eight persons and their line; toggle the ninth person (5 | 2) and the line moves. */
export function Outlier() {
  const [withNinth, setWithNinth] = useState(false);
  const all = spread(withNinth ? [...EIGHT, NINTH] : EIGHT);
  const old = EIGHT_LINE.intercept + EIGHT_LINE.slope * NINTH.x, side = (old - NINTH.y) * F.ky;
  return <div className="s9-bild">
    <div className="s9-umschalter" role="group" aria-label="Neunte Person">
      <button type="button" className="s9-schalter" aria-pressed={withNinth} onClick={() => setWithNinth(true)}>Neunte Person dazunehmen</button>
      <button type="button" className="s9-schalter" aria-pressed={!withNinth} onClick={() => setWithNinth(false)}>ohne sie</button>
    </div>
    <svg viewBox={`0 0 ${F.w} ${F.h}`} width="100%" aria-hidden="true" focusable="false" className="s9-svg">
      <Note f={F}>{withNinth ? 'zum Beispiel neun Befragte' : 'zum Beispiel acht Befragte'}</Note>
      <Axes f={F} xTicks={LAGE_TICKS} yTicks={Y10_TICKS} xTitle="Eigene wirtschaftliche Lage" yTitle="Lebenszufriedenheit" />
      {withNinth ? <>
        <rect x={F.px(NINTH.x) - side - 1} y={F.py(old)} width={side} height={side} fill={C.orange} fillOpacity={0.2} stroke={C.orange} />
        <line x1={F.px(NINTH.x)} x2={F.px(NINTH.x)} y1={F.py(NINTH.y)} y2={F.py(old)} stroke={C.orange} strokeWidth={2.5} />
        <T x={F.px(NINTH.x) - side / 2} y={F.py(4.5)} fill={C.orangeDark} fontWeight={700}>Residuum −7, Quadrat 49</T>
        <Line f={F} a={EIGHT_LINE.intercept} b={EIGHT_LINE.slope} from={1} to={5} stroke={C.grayLight} strokeWidth={2} strokeDasharray="6 5" />
        <Line f={F} a={NINE_LINE.intercept} b={NINE_LINE.slope} from={1} to={5} stroke={C.green} strokeWidth={3.5} />
      </> : <Line f={F} a={EIGHT_LINE.intercept} b={EIGHT_LINE.slope} from={1} to={5} stroke={C.green} strokeWidth={3.5} />}
      {all.map((p, i) => {
        const ninth = withNinth && i === all.length - 1;
        return <circle key={i} cx={F.px(p.at)} cy={F.py(p.y)} r={8} fill={ninth ? C.red : C.blue} stroke={ninth ? '#6d2b1c' : C.blueDark} strokeWidth={1.5} />;
      })}
      {withNinth ? <T x={F.px(NINTH.x) - 14} y={F.py(NINTH.y) + 4} textAnchor="end" fill={C.red} fontWeight={700}>neunte Person</T> : null}
    </svg>
    <table className="daten">
      <caption>Steigung und R²</caption>
      <tbody>
        <tr className={withNinth ? undefined : 's9-jetzt'}><th scope="row">ohne sie</th><td>Steigung 1</td><td>R² 0,67</td></tr>
        <tr className={withNinth ? 's9-jetzt' : undefined}><th scope="row">mit ihr</th><td>Steigung 0,2</td><td>R² 0,02</td></tr>
      </tbody>
    </table>
    <p className="sr-only" aria-live="polite">{withNinth ? 'Die neunte Person ist dazugenommen. Die Gerade ist jetzt 5,8 plus 0,2 mal Lage.' : 'Ohne die neunte Person: Gerade 4 plus 1 mal Lage.'}</p>
    <p className="sr-only">{OUTLIER_TEXT}</p>
  </div>;
}
