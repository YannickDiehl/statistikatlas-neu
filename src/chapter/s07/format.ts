// Zahlen für Texte (deutsch) und für nachgebaute R-Ausgaben (wie R druckt).

/** Deutsche Zahl mit festen Nachkommastellen und echtem Minus („−0,60“). */
export const de = (x: number, d = 1) =>
  x.toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d }).replace('-', '−');
/** Ganze Zahl mit Tausenderpunkt („1.530“). */
export const whole = (x: number) => Math.round(x).toLocaleString('de-DE');
/** p im Text: 0 heißt „< 0,001“. */
export const pText = (p: number, d = 3) => (p === 0 ? '< 0,001' : de(p, d));
/** Zahl, wie R sie druckt („-0.660“, „1530“). */
export const r = (x: number, d = 3) => x.toFixed(d);
/** Rechtsbündig in `w` Zeichen. */
export const padL = (s: string | number, w: number) => String(s).padStart(w);
/** Linksbündig in `w` Zeichen. */
export const padR = (s: string | number, w: number) => String(s).padEnd(w);
