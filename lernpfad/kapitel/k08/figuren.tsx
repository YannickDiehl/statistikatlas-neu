// Erklärfassung für Verstehen: „α ohne jedes Item“ wie das Bild nach dem Prüfen in Aufgabe 2 (AlphaWithout),
// aber mit den vier Fragen zur Verbundenheit statt der sieben Populismus-Aussagen. So verrät es keine Antwort.
import { PN_IDS, PN_NAMES, PN_REL } from '@atlas/chapter/s08/content';
import { BLUE, INK, ORANGE, Pic, Svg, T, de } from '@atlas/chapter/s08/figures/kit';

const d3 = (x: number) => de(x, 3);

/** α ohne die jeweilige Frage zur Verbundenheit (pn12, pn13, pn16, pn17), Achse ab 0,58. */
export function AlphaOhneBeispiel() {
  const lo = 0.58, hi = 0.76, w = 700, pl = 170, pr = 70, x = (v: number) => pl + (v - lo) / (hi - lo) * (w - pl - pr);
  const ry = (i: number) => 20 + i * 34;
  const werte = PN_REL.items.map(it => it.alphaIfDeleted);
  const alt = `α ohne die jeweilige Frage zur Verbundenheit: ${PN_IDS.map((id, i) => `${PN_NAMES[i]} (${id}) ${d3(werte[i])}`).join(', ')}. Mit allen vier ist α ${d3(PN_REL.alpha)}. Nur ohne die EU wäre α höher, und auch nur um ${d3(werte[3] - PN_REL.alpha)}.`;
  return <Pic alt={alt} caption={<>Nur ohne die EU (pn17) läge α höher als mit allen vier Fragen. Die Achse beginnt bei 0,58, damit die kleinen Unterschiede sichtbar sind. <span>ALLBUS 2023, ungewichtet, n = 3.521.</span></>}>
    <Svg w={w} h={220}>
      {PN_IDS.map((id, i) => {
        const v = werte[i], up = v > PN_REL.alpha;
        return <g key={id}>
          <T x={pl - 10} y={ry(i) + 16} textAnchor="end" fill={INK} fontSize={12.5}>{`${PN_NAMES[i]} (${id})`}</T>
          <rect x={x(lo)} y={ry(i) + 2} width={x(v) - x(lo)} height={22} rx={3} fill={up ? '#FFD2BC' : BLUE.fill} stroke={up ? ORANGE : BLUE.stroke} strokeWidth={1.2} />
          <T x={x(v) + 6} y={ry(i) + 17} textAnchor="start" fontSize={12} fill={INK}>{d3(v)}</T>
        </g>;
      })}
      <line x1={x(PN_REL.alpha)} x2={x(PN_REL.alpha)} y1={10} y2={162} stroke={INK} strokeWidth={1.5} strokeDasharray="5 4" />
      <T x={x(PN_REL.alpha)} y={178} fontSize={11.5} fill={INK}>{`α mit allen vier: ${d3(PN_REL.alpha)}`}</T>
      <line x1={x(lo)} x2={x(hi)} y1={162} y2={162} stroke="#9aa4ad" strokeWidth={1.5} />
      {[0.6, 0.65, 0.7, 0.75].map(v => <T key={v} x={x(v)} y={196} fontSize={11}>{de(v, 2)}</T>)}
      <T x={(x(lo) + x(hi)) / 2} y={214} fontSize={11.5}>α ohne diese Frage</T>
    </Svg>
  </Pic>;
}
