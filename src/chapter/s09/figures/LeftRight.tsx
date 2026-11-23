import { A4_FIT } from '../content';
import { Axes, C, de, Diamond, frame, T } from './plot';

const F = frame(640, 360, { l: 60, r: 20, t: 20, b: 76 }, [0.5, 10.5], [2, 5]);

/** Text version B10 (sitzung09.md). */
export const LEFT_RIGHT_TEXT = 'Mittelwerte der Zufriedenheit je Stufe von 1 links bis 10 rechts: 3,86; 4,37; 4,55; 4,49; 4,18; 4,06; 3,81; 3,85; 2,78; 2,54. Die Gerade fällt gleichmäßig von 4,72 auf 3,46. Ganz links liegt der Mittelwert 0,85 unter der Geraden, ganz rechts 0,92 (Stufe 9: 0,82); in der Mitte (Stufen 3 bis 6) liegt er knapp darüber.';

/** Bild B10 „s9-links-rechts“: means of demo per stage of pa01 against the falling line from R. */
export function LeftRight() {
  const xTicks = Array.from({ length: 10 }, (_, i): [number, string] => [i + 1, i === 0 ? '1 links' : i === 9 ? '10 rechts' : String(i + 1)]);
  const yTicks: [number, string][] = [2, 2.5, 3, 3.5, 4, 4.5, 5].map((v): [number, string] => [v, Number.isInteger(v) ? String(v) : '']);
  return <figure className="ebild">
    <div className="ebild-bild" role="img" aria-label={LEFT_RIGHT_TEXT}>
      <svg viewBox={`0 0 ${F.w} ${F.h}`} width="100%" aria-hidden="true" focusable="false">
        <Axes f={F} xTicks={xTicks} yTicks={yTicks} xTitle="Links-rechts-Einstufung (pa01)" yTitle="Zufriedenheit mit der Demokratie (1 bis 6)" />
        <line x1={F.px(1)} x2={F.px(10)} y1={F.py(A4_FIT.predict1)} y2={F.py(A4_FIT.predict10)} stroke={C.green} strokeWidth={3.5} strokeLinecap="round" />
        <T x={F.px(10)} y={F.py(A4_FIT.predict10) + 22} textAnchor="end" fill={C.green} fontWeight={700} fontSize={12}>Gerade aus R</T>
        <polyline points={A4_FIT.mean.map((m, i) => `${F.px(i + 1)},${F.py(m)}`).join(' ')} fill="none" stroke={C.orange} strokeWidth={2.5} />
        {A4_FIT.mean.map((m, i) => <g key={i}>
          <Diamond x={F.px(i + 1)} y={F.py(m)} />
          <T x={F.px(i + 1)} y={F.py(m) + (i >= 8 ? 20 : -12)} fontSize={13} fill={C.ink}>{de(m, 2)}</T>
        </g>)}
        {[8, 9].map(i => <T key={i} x={F.px(i + 1)} y={F.py(2) + 34} fontSize={13}>{`n = ${A4_FIT.nStage[i]}`}</T>)}
      </svg>
    </div>
    <figcaption>Orange: Mittelwert je Stufe (Rauten, verbunden). Grün: die Gerade aus R. <span>ALLBUS 2023, gewichtet, 3.444 Befragte.</span></figcaption>
  </figure>;
}
