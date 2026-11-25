import { C, T } from './plot';

/** Text version B5 (sitzung09.md). */
export const R2_TEXT = 'Mit dem Mittelwert allein ist die Quadratsumme der Residuen der acht Befragten 18, mit der Geraden 6. Die Gerade spart 12 von 18, das sind zwei Drittel: R² gleich 12 durch 18 gleich 0,67. Im echten ALLBUS: Die Gerade aus der Lage spart von der Quadratsumme 19.041 genau 3.859; übrig bleiben 15.182. R² gleich 1 minus 15.182 durch 19.041 gleich 0,203.';

/** Bild B5 „s9-r2“ (static): 18 squares against 6, the bracket „erklärt: 12“, and R² as a fraction of stones. */
export function R2Squares() {
  const s = 21, gap = 3, x0 = 10, row = (n: number, y: number) => Array.from({ length: n }, (_, i) =>
    <rect key={i} x={x0 + i * (s + gap)} y={y} width={s} height={s} rx={3} fill={C.orange} fillOpacity={0.55} stroke={C.orangeDark} strokeWidth={1} />);
  const end = (n: number) => x0 + n * (s + gap) - gap;
  return <figure className="ebild s9-r2">
    <div role="img" aria-label={R2_TEXT}>
      <svg viewBox="0 0 450 140" width="100%" aria-hidden="true" focusable="false">
        <T x={x0} y={18} textAnchor="start" fill={C.ink} fontSize={15}>mit dem Mittelwert (ohne UV)</T>
        <path d={`M${end(6) + 2},44 L${end(6) + 2},38 L${end(18)},38 L${end(18)},44`} fill="none" stroke={C.green} strokeWidth={2.5} />
        <T x={(end(6) + end(18)) / 2} y={32} fill={C.green} fontWeight={700} fontSize={15}>erklärt: 12</T>
        {row(18, 48)}
        <T x={x0} y={102} textAnchor="start" fill={C.ink} fontSize={15}>mit der Geraden</T>
        {row(6, 110)}
      </svg>
      <div className="s9-formel s9-formel-r2" aria-hidden="true">
        <span className="s9-stein s9-green"><b>R²</b></span><span className="s9-op">=</span>
        <span className="frac"><span>erklärte Quadrate 12</span><span>alle Quadrate 18</span></span>
        <span className="s9-op">=</span><span className="gross">0,67</span>
      </div>
      <p className="s9-formel-zeile" aria-hidden="true">= 1 − 6 / 18</p>
      <p className="s9-formel-zeile s9-echt" aria-hidden="true"><b>im echten ALLBUS:</b> 1 − <span className="s9-mini">Residual 15.182</span> / <span className="s9-mini">Total 19.041</span> = 0,203</p>
    </div>
  </figure>;
}
