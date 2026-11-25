// Erklärfassung eines Atlas-Bildes mit eingebauter Übung: „Erst schätzen“ (src/chapter/s09/figures/Estimate.tsx)
// lässt eine eigene Gerade ziehen und vergleicht sie. Hier ohne Schätzen: die Punktwolke, auf Knopfdruck die Gerade aus R
// und die Mittelwerte der Stufen. Die Knöpfe zeigen nur, sie prüfen nichts.
import { useState } from 'react';
import { LAGE_CROSSTAB, LAGE_PREDICTIONS, LAGE_STAGES } from '@atlas/chapter/s09/content';
import { ESTIMATE_LINE_TEXT, ESTIMATE_TEXT } from '@atlas/chapter/s09/figures/Estimate';
import { Axes, C, de, Diamond, frame, LAGE_TICKS, T, Y10_TICKS } from '@atlas/chapter/s09/figures/plot';

const F = frame(640, 420, { l: 56, r: 20, t: 22, b: 58 }, [0.5, 5.5], [0, 10]);
const MAX_N = Math.max(...LAGE_CROSSTAB.flat());
/** Radius = √N × Faktor wie im Atlas-Bild; der größte Kreis (908) bekommt etwa 14 px. */
const radius = (n: number) => Math.sqrt(n) * 14 / Math.sqrt(MAX_N);
const MEANS_TEXT = 'Die Mittelwerte der Stufen (Rauten) liegen nahe an der Geraden: ' + LAGE_STAGES.mean.map((m, i) => `${['sehr schlecht', 'schlecht', 'teils/teils', 'gut', 'sehr gut'][i]} ${de(m, 2)}`).join(', ') + '.';

/** Punktwolke Lebenszufriedenheit nach Lage; Gerade aus R und Mittelwerte der Stufen zum Zuschalten. */
export function PunktwolkeMitGerade() {
  const [gerade, setGerade] = useState(false);
  const [mittel, setMittel] = useState(false);
  const text = [ESTIMATE_TEXT, gerade ? ESTIMATE_LINE_TEXT : '', mittel ? MEANS_TEXT : ''].filter(Boolean).join(' ');
  return <div className="s9-bild">
    <div className="s9-umschalter" role="group" aria-label="Was das Bild zeigt">
      <button type="button" className="s9-schalter" aria-pressed={gerade} onClick={() => setGerade(v => !v)}>Gerade aus R zeigen</button>
      <button type="button" className="s9-schalter" aria-pressed={mittel} onClick={() => setMittel(v => !v)}>Mittelwerte der Stufen zeigen</button>
    </div>
    <div role="img" aria-label={text}>
      <svg viewBox={`0 0 ${F.w} ${F.h}`} width="100%" className="s9-svg" aria-hidden="true" focusable="false">
        <Axes f={F} xTicks={LAGE_TICKS} yTicks={Y10_TICKS} xTitle="Eigene wirtschaftliche Lage" yTitle="Lebenszufriedenheit" />
        {LAGE_CROSSTAB.flatMap((row, ls) => row.map((n, k) => n > 0
          ? <circle key={`${ls}-${k}`} cx={F.px(k + 1)} cy={F.py(ls)} r={radius(n)} fill={C.blue} fillOpacity={0.55} stroke={C.blueDark} strokeWidth={0.8} />
          : null))}
        {gerade ? <>
          <line x1={F.px(1)} x2={F.px(5)} y1={F.py(LAGE_PREDICTIONS[0])} y2={F.py(LAGE_PREDICTIONS[4])} stroke={C.green} strokeWidth={3.5} strokeLinecap="round" />
          <T x={F.px(4.95)} y={F.py(LAGE_PREDICTIONS[4]) - 16} textAnchor="end" fill={C.green} fontWeight={700}>Gerade aus R: 3,570 + 1,073 × Lage</T>
        </> : null}
        {mittel ? <>
          {LAGE_STAGES.mean.map((m, i) => <Diamond key={i} x={F.px(i + 1)} y={F.py(m)} />)}
          <Diamond x={F.l + 14} y={F.t + 10} s={6} />
          <T x={F.l + 26} y={F.t + 14} textAnchor="start" fill={C.ink}>Mittelwert der Stufe</T>
        </> : null}
      </svg>
    </div>
    <p className="hilfe-zeile">Je größer der Kreis, desto mehr Befragte haben genau diese Kombination angegeben. ALLBUS 2023, gewichtet, 5.133 Befragte.</p>
  </div>;
}
