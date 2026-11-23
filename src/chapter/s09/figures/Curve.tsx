import { useState } from 'react';
import { ROOMS, ROOMS_LINE } from '../content';
import { Axes, C, frame, Note, T, Y10_TICKS } from './plot';

const F = frame(640, 380, { l: 56, r: 20, t: 26, b: 58 }, [13, 33], [0, 10]);

/** Text version B9 (sitzung09.md). */
export const CURVE_TEXT = 'Zehn Räume, zum Beispiel. Wohlbefinden bei 14, 16, 18, 20, 22, 24, 26, 28, 30 und 32 Grad: 2, 4, 6, 8, 9, 9, 8, 6, 4, 2. Es steigt bis 22 bis 24 Grad und fällt dann wieder. Die Gerade aus R ist waagerecht bei 5,8: Steigung 0, R² 0.';

/** Bild B9 „s9-kurve“: ten constructed rooms (inverted U); toggles for the flat line from R and for connecting the points. */
export function Curve() {
  const [line, setLine] = useState(true);
  const [connect, setConnect] = useState(false);
  return <div className="s9-bild">
    <div className="s9-umschalter" role="group" aria-label="Was das Bild zeigt">
      <button type="button" className="s9-schalter" aria-pressed={line} onClick={() => setLine(v => !v)}>Gerade zeigen</button>
      <button type="button" className="s9-schalter" aria-pressed={connect} onClick={() => setConnect(v => !v)}>Mittelwerte verbinden</button>
    </div>
    <svg viewBox={`0 0 ${F.w} ${F.h}`} width="100%" aria-hidden="true" focusable="false" className="s9-svg">
      <Note f={F}>zum Beispiel zehn Räume</Note>
      <Axes f={F} xTicks={[14, 16, 18, 20, 22, 24, 26, 28, 30, 32].map((v): [number, string] => [v, String(v)])} yTicks={Y10_TICKS}
        xTitle="Raumtemperatur (Grad)" yTitle="Wohlbefinden" />
      {connect ? <polyline points={ROOMS.map(p => `${F.px(p.x)},${F.py(p.y)}`).join(' ')} fill="none" stroke={C.orange} strokeWidth={3} strokeLinejoin="round" /> : null}
      {line ? <>
        <line x1={F.px(13.5)} x2={F.px(32.5)} y1={F.py(ROOMS_LINE.intercept)} y2={F.py(ROOMS_LINE.intercept)} stroke={C.green} strokeWidth={3.5} />
        <T x={F.px(23)} y={F.py(ROOMS_LINE.intercept) + 22} fill={C.green} fontWeight={700}>Gerade aus R: Steigung 0, R² = 0</T>
      </> : null}
      {ROOMS.map((p, i) => <circle key={i} cx={F.px(p.x)} cy={F.py(p.y)} r={8} fill={C.blue} stroke={C.blueDark} strokeWidth={1.5} />)}
    </svg>
    <p className="sr-only">{CURVE_TEXT}</p>
  </div>;
}
