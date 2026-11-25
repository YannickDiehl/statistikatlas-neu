import { EIGHT, FAN, NINE_LINE, NINTH, ROOMS, ROOMS_LINE, EIGHT_LINE, type Point } from '../content';
import { C, frame, leastSquares, spread, T } from './plot';

/** Text version B11 (sitzung09.md). */
export const ASSUMPTIONS_TEXT = 'Vier kleine Bilder. Erstens: Punkte liegen gleichmäßig um eine steigende Gerade, alles in Ordnung. Zweitens: Punkte bilden eine Kurve, die Gerade ist flach, Linearität verletzt. Drittens: ein einzelner Punkt unten rechts zieht die Gerade flach, ein Ausreißer. Viertens: links streuen die Punkte weit, rechts eng, gleiche Fehlervarianz verletzt.';

function Small({ title, points, line, x, red }: { title: string; points: Point[]; line: { a: number; b: number }; x: [number, number]; red?: Point }) {
  const f = frame(200, 170, { l: 12, r: 10, t: 30, b: 14 }, x, [0, 10]);
  const pts = spread(points, (x[1] - x[0]) * 0.012);
  return <div className="s9-klein">
    <svg viewBox={`0 0 ${f.w} ${f.h}`} width="100%" aria-hidden="true" focusable="false">
      <T x={f.w / 2} y={18} fill={C.ink} fontWeight={700} fontSize={14}>{title}</T>
      <rect x={f.l} y={f.t} width={f.w - f.l - f.r} height={f.h - f.t - f.b} fill="#fff" stroke={C.line} />
      <line x1={f.px(x[0])} x2={f.px(x[1])} y1={f.py(line.a + line.b * x[0])} y2={f.py(line.a + line.b * x[1])} stroke={C.green} strokeWidth={2.5} />
      {pts.map((p, i) => {
        const isRed = red && p.x === red.x && p.y === red.y;
        return <circle key={i} cx={f.px(p.at)} cy={f.py(p.y)} r={4.5} fill={isRed ? C.red : C.blue} stroke={isRed ? '#6d2b1c' : C.blueDark} strokeWidth={1} />;
      })}
    </svg>
  </div>;
}

/** Bild B11 „s9-voraussetzungen“: four small constructed scatterplots (fits, curve, outlier, fan). */
export function Assumptions() {
  return <figure className="ebild">
    <div className="s9-vier" role="img" aria-label={ASSUMPTIONS_TEXT}>
      <Small title="passt" points={EIGHT} line={{ a: EIGHT_LINE.intercept, b: EIGHT_LINE.slope }} x={[0.5, 5.5]} />
      <Small title="Kurve" points={ROOMS} line={{ a: ROOMS_LINE.intercept, b: ROOMS_LINE.slope }} x={[13, 33]} />
      <Small title="Ausreißer" points={[...EIGHT, NINTH]} line={{ a: NINE_LINE.intercept, b: NINE_LINE.slope }} x={[0.5, 5.5]} red={NINTH} />
      <Small title="ungleiche Streuung" points={FAN} line={leastSquares(FAN)} x={[0.5, 5.5]} />
    </div>
  </figure>;
}
