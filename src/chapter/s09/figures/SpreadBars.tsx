import { LAGE_FIT, LAGE_LABELS, LAGE_STAGES } from '../content';
import { C, de, frame, T } from './plot';

const F = frame(560, 340, { l: 56, r: 120, t: 28, b: 70 }, [0.5, 5.5], [0, 3]);

/** Text version B6 (sitzung09.md). */
export const SPREAD_TEXT = 'Streuung der Residuen je Stufe der wirtschaftlichen Lage, gewichtet: sehr schlecht 2,72 Punkte (77 Befragte), schlecht 2,23 (435), teils/teils 1,82 (1.491), gut 1,58 (2.751), sehr gut 1,27 (378). Insgesamt 1,72. Bei sehr schlechter Lage liegt die Gerade etwa doppelt so weit daneben wie bei sehr guter.';

/** Small „fan“: points that lie further apart on the left (only a hint of the shape, constructed). */
function Fan({ x, y }: { x: number; y: number }) {
  const pts: [number, number][] = [[0, -30], [0, 28], [14, -22], [14, 18], [28, -14], [28, 12], [42, -8], [42, 6], [56, -3], [56, 4]];
  return <g>
    <line x1={x - 6} x2={x + 62} y1={y} y2={y} stroke={C.green} strokeWidth={2} />
    {pts.map(([dx, dy], i) => <circle key={i} cx={x + dx} cy={y + dy} r={3.5} fill={C.blue} stroke={C.blueDark} strokeWidth={0.8} />)}
    <T x={x + 28} y={y + 54} fontSize={13}>so sieht es in der</T>
    <T x={x + 28} y={y + 68} fontSize={13}>Punktwolke aus</T>
  </g>;
}

/** Bild B6 „s9-streuung-je-stufe“ (static): SD of the residuals per stage of lage, with the overall typical error. */
export function SpreadBars() {
  const bw = 48;
  return <figure className="ebild">
    <div className="ebild-bild" role="img" aria-label={SPREAD_TEXT}>
      <svg viewBox={`0 0 ${F.w} ${F.h}`} width="100%" aria-hidden="true" focusable="false">
        {[0, 1, 2, 3].map(v => <g key={v}>
          <line x1={F.l} x2={F.px(5.5)} y1={F.py(v)} y2={F.py(v)} stroke={C.line} />
          <T x={F.l - 9} y={F.py(v) + 4} textAnchor="end" fontSize={14}>{String(v)}</T>
        </g>)}
        <T x={14} y={F.py(1.5)} fill={C.ink} fontWeight={700} fontSize={14} transform={`rotate(-90 14 ${F.py(1.5)})`}>Streuung der Residuen (SD, Punkte)</T>
        <line x1={F.l} x2={F.px(5.5)} y1={F.py(LAGE_FIT.sigma)} y2={F.py(LAGE_FIT.sigma)} stroke={C.green} strokeWidth={2.5} strokeDasharray="8 5" />
        {LAGE_STAGES.sd.map((sd, i) => {
          const x = F.px(i + 1) - bw / 2, top = F.py(sd), stones = Math.max(1, Math.round(sd / 0.25));
          return <g key={i}>
            {Array.from({ length: stones }, (_, k) => {
              const y1 = F.py(0) - (k + 1) * (F.py(0) - top) / stones;
              return <rect key={k} x={x} y={y1 + 1} width={bw} height={(F.py(0) - top) / stones - 2} rx={2.5} fill={C.blue} stroke={C.blueDark} strokeWidth={0.6} />;
            })}
            <T x={F.px(i + 1)} y={top - 7} fill={C.ink} fontWeight={700} fontSize={15} stroke="#fff" strokeWidth={5} paintOrder="stroke">{de(sd, 2)}</T>
            <T x={F.px(i + 1)} y={F.py(0) + 19} fontSize={13} fill={C.ink}>{LAGE_LABELS[i]}</T>
            <T x={F.px(i + 1)} y={F.py(0) + 36} fontSize={13}>{i === 0 ? `n = ${LAGE_STAGES.n[i]}` : LAGE_STAGES.n[i].toLocaleString('de-DE')}</T>
          </g>;
        })}
        <T x={F.px(5.5) + 6} y={F.py(LAGE_FIT.sigma) - 4} textAnchor="start" fill={C.green} fontWeight={700} fontSize={14}>typischer Fehler</T>
        <T x={F.px(5.5) + 6} y={F.py(LAGE_FIT.sigma) + 14} textAnchor="start" fill={C.green} fontWeight={700} fontSize={14}>insgesamt: 1,72</T>
        <T x={F.px(3)} y={F.h - 6} fill={C.ink} fontWeight={700} fontSize={15}>Eigene wirtschaftliche Lage</T>
        <Fan x={F.px(5.5) + 28} y={F.py(0.55)} />
      </svg>
    </div>
  </figure>;
}
