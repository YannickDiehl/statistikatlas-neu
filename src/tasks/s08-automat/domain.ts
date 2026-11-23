import type { SavFile } from '../../sandbox/readSav';
import type { Note } from '../kit/Feedback';
import { de, halfUnit, numberReadings } from '../kit/numbers';
import { groupStats, levene, tryOls, type GroupStat, type LeveneResult, type OlsFit } from '../kit/ols';
import { WORK_MODES, type WorkMode } from '../kit/PartnerToggle';
import { random, validValues } from '../kit/stats';
import { bool, oneOf, record, str } from '../kit/storage';
import type { TaskStatus } from '../types';
import { DECISIONS, GUESSES, INPUT_IDS, INPUTS, inputById, LOAD_SCRIPT, PROBE_SIZE, type Decision, type Guess, type InputId, type InputItem } from './content';

/* ---------- Daten ---------- */

/** Zufriedenheit umgepolt (rec(ps03, rules = "rev") = 7 − ps03, höher = zufriedener) und original, Gewicht. */
export type Prepared = { sav: SavFile; y: Float64Array; yOrig: Float64Array; w: Float64Array };

export function prepare(sav: SavFile): Prepared {
  const yOrig = validValues(sav.byName.get('ps03')!);
  return { sav, yOrig, y: Float64Array.from(yOrig, v => (Number.isNaN(v) ? NaN : 7 - v)), w: validValues(sav.byName.get('wghtpew')!) };
}

export const inputValues = (p: Prepared, item: InputItem) => validValues(p.sav.byName.get(item.id)!);

/** Gruppen für „Gleich gut für alle?“: die Werte selbst, beim Alter die fünf Altersgruppen aus rec(). */
export function groupValues(p: Prepared, item: InputItem): Float64Array {
  const x = inputValues(p, item), g = item.groups;
  return g ? Float64Array.from(x, v => (Number.isNaN(v) ? NaN : g.map(v) ?? NaN)) : x;
}

export const levelName = (item: InputItem, v: number) =>
  item.groups ? `Alter ${item.groups.labels[v - 1] ?? v}` : item.levels?.[v] ? `Eingabe ${v} („${item.levels[v]}“)` : `Eingabe ${v}`;

/* ---------- Einstellen: Varianten des Automaten ---------- */

export type VariantKind = 'main' | 'unweighted' | 'orig' | 'origUnweighted' | 'swapped' | 'swappedUnweighted' | 'grouped';
export type Variant = { kind: VariantKind; weighted: boolean; a: number; b: number; r2: number; adjR2: number; beta: number; fit: OlsFit };
const ACCEPTED: VariantKind[] = ['main', 'unweighted'];

/** Alle Rechenwege, die für eine Eingabefrage vorkommen: mit/ohne Gewicht, umgepolt oder nicht, Achsen vertauscht, beim Alter die Gruppen. */
export function variants(p: Prepared, item: InputItem): Variant[] {
  const x = inputValues(p, item), out: Variant[] = [];
  const add = (kind: VariantKind, weighted: boolean, y: Float64Array, xs: Float64Array) => {
    const fit = tryOls(y, [xs], weighted ? p.w : null);
    if (fit) out.push({ kind, weighted, a: fit.coef[0], b: fit.coef[1], r2: fit.r2, adjR2: fit.adjR2, beta: fit.beta[1], fit });
  };
  add('main', true, p.y, x);
  add('unweighted', false, p.y, x);
  add('orig', true, p.yOrig, x);
  add('origUnweighted', false, p.yOrig, x);
  add('swapped', true, x, p.y);
  add('swappedUnweighted', false, x, p.y);
  if (item.groups) add('grouped', true, p.y, groupValues(p, item));
  return out;
}

export type Reading = { x: number; decimals: number };
const roundTo = (v: number, d: number) => Math.round(v * 10 ** d) / 10 ** d;
/** Die Lesart einer Eingabe, die zu value passt: die aus R zuerst („2.288“ = 2,288), dann die deutsche („2.288“ = 2288);
 *  „%“ am Ende und „+“ vorn stören nicht. Toleranz: halbe Einheit der eingegebenen Stellen, mindestens minDecimals Stellen –
 *  außer R druckt die Zahl kürzer, weil describe() Nullen am Ende weglässt (1,300 → „1.3“). */
export function matchReading(value: number, input: string, minDecimals = 2, printed = 3): Reading | null {
  if (!Number.isFinite(value)) return null;
  const rs = numberReadings(input);
  for (const [k, r] of rs.entries()) {
    if (r.decimals >= minDecimals ? Math.abs(value - r.x) <= halfUnit(r.decimals)
      // weggelassene Nullen am Ende gibt es nur bei der Lesart aus R (der ersten), nicht beim deutschen Tausenderpunkt
      : k === 0 && Math.abs(roundTo(value, printed) - r.x) <= 1e-9) return r;
  }
  return null;
}
const within = (value: number, input: string, minDecimals = 2) => matchReading(value, input, minDecimals) !== null;
const notNumber = (input: string) => numberReadings(input).length === 0;
/** Zu wenige Nachkommastellen – gemessen an der ersten Lesart (so druckt R). */
const coarse = (input: string, minDecimals = 2) => (numberReadings(input)[0]?.decimals ?? 0) < minDecimals;
const fmt = (x: number, d = 3) => de(x, d);
/** Eine eingetragene Zahl, die zu einem der Werte passt, in deutscher Schreibweise (Komma, echtes Minus); sonst der Rohtext, markiert. */
export function shown(input: string, values: number[], minDecimals = 2): string {
  for (const v of values) { const r = matchReading(v, input, minDecimals); if (r) return de(r.x, r.decimals); }
  return `${input.trim()} (noch nicht geprüft)`;
}
/** „a + b · x“ bzw. „a − |b| · x“ */
const formula = (a: number, b: number, x: string, da = 3, db = 3) => `${de(a, da)} ${b < 0 ? '−' : '+'} ${de(Math.abs(b), db)} · ${x}`;

export type Setting = { a: string; b: string; r2: string };
type Field = keyof Setting;
const FIELD_LABEL: Record<Field, string> = { a: 'Konstante', b: 'Steigung', r2: 'R²' };

/** Erkannt: Konstante, Steigung und R² passen alle zu derselben gültigen Rechnung (gewichtet oder ohne Gewicht). */
export function recognisedSetting(vars: Variant[], s: Setting): Variant | null {
  return vars.find(v => ACCEPTED.includes(v.kind) && within(v.a, s.a) && within(v.b, s.b) && within(v.r2, s.r2)) ?? null;
}

/** Wertedetektor für die drei Einstellungen des Automaten. */
export const NOT_ESTIMABLE = 'Mit deiner Datei lässt sich dieser Automat nicht einstellen: Zu wenige Befragte haben beide Fragen beantwortet, oder die Eingabe streut nicht. Wähle eine andere Frage.';

export function checkSetting(item: InputItem, vars: Variant[], s: Setting): Note[] {
  if (!vars.some(v => v.kind === 'main')) return [{ tone: 'warn', text: NOT_ESTIMABLE }];
  const hit = recognisedSetting(vars, s);
  const ra = hit && matchReading(hit.a, s.a), rb = hit && matchReading(hit.b, s.b), rr = hit && matchReading(hit.r2, s.r2);
  if (hit && ra && rb && rr) return hit.kind === 'main'
    ? [{ tone: 'ok', text: `Stimmt: Der Automat zeigt ${formula(ra.x, rb.x, 'Eingabe', ra.decimals, rb.decimals)}, gewichtet für ganz Deutschland. R² = ${de(rr.x, rr.decimals)}.` }]
    : [{ tone: 'hint', text: `Das stimmt für die Befragten ohne Gewicht. Im ALLBUS ist der Osten stärker vertreten als in der Bevölkerung – soll dein Automat für ganz Deutschland sprechen? Beides gilt; die Karte vermerkt „ungewichtet“.` }];
  const get = (kind: VariantKind) => vars.find(v => v.kind === kind);
  const notes: Note[] = [];
  const good = (f: Field) => ACCEPTED.some(k => { const v = get(k); return v && within(v[f], s[f]); });
  for (const f of ['a', 'b', 'r2'] as Field[]) {
    if (!s[f].trim()) continue;
    const label = FIELD_LABEL[f];
    if (notNumber(s[f])) { notes.push({ tone: 'warn', text: `${label}: Das ist keine Zahl.` }); continue; }
    if (good(f)) continue;
    if (coarse(s[f])) { notes.push({ tone: 'hint', text: `${label}: Trag den Wert mit drei Nachkommastellen ein, so wie R ihn zeigt.` }); continue; }
    const match = (kind: VariantKind, field: keyof Variant = f) => { const v = get(kind); return v !== undefined && within(v[field] as number, s[f]); };
    if (f !== 'r2' && (match('orig') || match('origUnweighted'))) notes.push({ tone: 'warn', text: f === 'b'
      ? `${label}: Das Vorzeichen ist gedreht. Die Zahl passt zu ps03 ohne Umpolen – dort heißt 1 „sehr zufrieden“. Pol zuerst mit rec(ps03, rules = "rev") um.`
      : `${label}: Die Zahl passt zu ps03 ohne Umpolen (1 = sehr zufrieden). Pol zuerst mit rec(ps03, rules = "rev") um.` });
    else if (f !== 'r2' && (match('swapped') || match('swappedUnweighted'))) notes.push({ tone: 'hint', text: `${label}: Das ist die Gerade von der Zufriedenheit zur Eingabe (Achsen vertauscht) – eine andere Gerade, nicht dieselbe rückwärts gelesen. Der Automat sagt die Zufriedenheit vorher: demokratie ~ ${item.id}.` });
    else if (f === 'b' && (match('main', 'beta') || match('unweighted', 'beta'))) notes.push({ tone: 'hint', text: `${label}: Das ist Beta, der standardisierte Koeffizient. Der Automat braucht B – die Änderung in Skalenpunkten pro Stufe.` });
    else if (f === 'r2' && (match('main', 'adjR2') || match('unweighted', 'adjR2'))) notes.push({ tone: 'hint', text: `${label}: Das ist das korrigierte R² (Adjusted R Square). Gesucht ist „R Square“.` });
    else if (f === 'r2' && ACCEPTED.some(k => { const v = get(k); return v && within(Math.sqrt(v.r2), s.r2); })) notes.push({ tone: 'hint', text: `${label}: Das ist R, die Wurzel aus R².` });
    else if (match('grouped')) notes.push({ tone: 'hint', text: `${label}: Das passt zum Automaten mit den fünf Altersgruppen. Eingestellt wird er mit dem Alter in Jahren; die Gruppen brauchst du erst für „Gleich gut für alle?“.` });
    else notes.push({ tone: 'warn', text: `${label}: Diesen Wert finde ich nicht. Prüfe Umpolen, Gewicht und die Spalte B der Tabelle Coefficients.` });
  }
  if ((['a', 'b', 'r2'] as Field[]).every(good)) {
    // Jede Zahl passt zu einer gültigen Rechnung, aber nicht alle zu derselben: gewichtet und ungewichtet gemischt.
    notes.push({ tone: 'hint', text: 'Jede Zahl für sich passt, aber nicht alle zur selben Rechnung – ein Teil ist gewichtet, ein Teil ohne Gewicht gerechnet.' });
  }
  return notes;
}

/* ---------- Deine Gerade zuerst: tippen, dann in R nachrechnen ---------- */

/** Eine Gerade als Regel des Automaten: Anzeige = a + b · Eingabe. */
export type Line = { a: number; b: number };
export const lineAt = (l: Line, x: number) => l.a + l.b * x;
/** Gerade durch die beiden Griffe: Höhe yLeft bei x0, Höhe yRight bei x1. */
export function lineThrough(x0: number, yLeft: number, x1: number, yRight: number): Line {
  const b = x1 === x0 ? 0 : (yRight - yLeft) / (x1 - x0);
  return { a: yLeft - b * x0, b };
}
/** Die Griffe bleiben auf der Skala der Zufriedenheit (1 bis 6) und rasten auf Zehntel ein. */
export const clampShow = (y: number) => Math.round(10 * Math.min(6, Math.max(1, y))) / 10;

export type ScatterDot = { x: number; mean: number; n: number };
export type Scatter = { xMin: number; xMax: number; dots: ScatterDot[]; binned: boolean; nMax: number };

/** Ab so vielen verschiedenen Eingabewerten fasst das Streudiagramm Fünferschritte zusammen (Alter), damit es lesbar bleibt. */
const MAX_DOTS = 15;

/** Streudiagramm für den Tipp: mittlere Zufriedenheit (umgepolt) je Eingabewert, gewichtet wie die Rechnung v, über die Fälle des Modells.
 *  Beim Alter ein Punkt je fünf Jahrgänge, gesetzt auf das mittlere Alter der Gruppe. */
export function scatter(p: Prepared, item: InputItem, v: Variant): Scatter {
  const x = inputValues(p, item), rows = v.fit.rows;
  let xMin = Infinity, xMax = -Infinity;
  for (const i of rows) { if (x[i] < xMin) xMin = x[i]; if (x[i] > xMax) xMax = x[i]; }
  const binned = new Set(rows.map(i => x[i])).size > MAX_DOTS;
  const by = new Map<number, { sw: number; swx: number; swy: number; n: number }>();
  for (const i of rows) {
    const key = binned ? xMin + 5 * Math.floor((x[i] - xMin) / 5) : x[i], w = v.weighted ? p.w[i] : 1;
    const e = by.get(key) ?? { sw: 0, swx: 0, swy: 0, n: 0 };
    e.sw += w; e.swx += w * x[i]; e.swy += w * p.y[i]; e.n += 1; by.set(key, e);
  }
  const dots = [...by.entries()].sort((a, b) => a[0] - b[0]).map(([key, e]) => ({ x: binned ? e.swx / e.sw : key, mean: e.swy / e.sw, n: e.n }));
  return { xMin, xMax, dots, binned, nMax: Math.max(1, ...dots.map(d => d.n)) };
}

/** Konstante und Steigung passen zu einer gültigen Rechnung (R² braucht der Vergleich der Geraden nicht). */
export function recognisedLine(vars: Variant[], s: Setting): Variant | null {
  return recognisedSetting(vars, s) ?? vars.find(v => ACCEPTED.includes(v.kind) && within(v.a, s.a) && within(v.b, s.b)) ?? null;
}

/** Fehlerquadrate (Summe der quadrierten Residuen) einer beliebigen Geraden über dieselben Befragten und Gewichte wie die Rechnung v. */
export function lineSse(p: Prepared, item: InputItem, v: Variant, l: Line): number {
  const x = inputValues(p, item);
  let sse = 0;
  for (const i of v.fit.rows) { const r = p.y[i] - lineAt(l, x[i]); sse += (v.weighted ? p.w[i] : 1) * r * r; }
  return sse;
}

/** So heißt eine Eingabe am Automaten: „Antwort 1 („gar kein Vertrauen“)“ bzw. „Alter 18“. */
export const answerName = (item: InputItem, x: number) =>
  item.groups ? `Alter ${de(x, 0)}` : item.levels?.[x] ? `Antwort ${x} („${item.levels[x]}“)` : `Antwort ${de(x, Number.isInteger(x) ? 0 : 1)}`;

/** Unterschiede bis zu so vielen Skalenpunkten gelten beim Tipp als „passt“. */
const LINE_TOL = 0.25;
/** Ändert sich die Anzeige über alle Antworten um weniger als so viele Skalenpunkte, ist die Gerade „fast flach“ (Alter: 0,3). */
const LINE_FLAT = 0.5;

/** Vergleich der getippten Geraden mit der echten aus R, in Worten des Automaten. sse: Fehlerquadrate beider Geraden. */
export function compareLine(item: InputItem, own: Line, real: Line, xMin: number, xMax: number, sse?: { own: number; real: number }): Note[] {
  const notes: Note[] = [];
  const ownRise = own.b * (xMax - xMin), realRise = real.b * (xMax - xMin);
  const move = (r: number) => (Math.abs(r) < 0.05 ? 'bleibt fast gleich' : r > 0 ? `steigt um ${de(r, 1)} Punkte` : `fällt um ${de(-r, 1)} Punkte`);
  const ownFlat = Math.abs(ownRise) < LINE_FLAT, realFlat = Math.abs(realRise) < LINE_FLAT;
  const intro = `Von ${answerName(item, xMin)} bis ${answerName(item, xMax)}: Deine Anzeige ${move(ownRise)}, die echte ${move(realRise)}.`;
  if (ownFlat && realFlat) notes.push({ tone: 'ok', text: `${intro} Beide Geraden sind fast flach – diese Frage verrät wenig über die Zufriedenheit.` });
  else if (!ownFlat && !realFlat && Math.sign(ownRise) !== Math.sign(realRise)) notes.push({ tone: 'hint', text: `${intro} Deine Gerade ${ownRise > 0 ? 'steigt' : 'fällt'}, die echte ${realRise > 0 ? 'steigt' : 'fällt'} – du hast die Richtung des Zusammenhangs falsch eingeschätzt. Schau auf die Codes: Was heißt bei dieser Frage eine hohe Zahl?` });
  else if (Math.abs(ownRise - realRise) <= LINE_TOL) notes.push({ tone: 'ok', text: `${intro} Deine Steigung passt gut.` });
  else if (Math.abs(ownRise) > Math.abs(realRise)) notes.push({ tone: 'hint', text: `${intro} Deine Gerade ist steiler als die echte – du hast den Zusammenhang überschätzt.${realFlat ? ' Die echte ist fast flach.' : ''}` });
  else notes.push({ tone: 'hint', text: `${intro} Deine Gerade ist flacher als die echte – du hast den Zusammenhang unterschätzt.` });

  const mid = Math.round((xMin + xMax) / 2), diff = lineAt(own, mid) - lineAt(real, mid);
  if (Math.abs(diff) > LINE_TOL) notes.push({ tone: 'hint', text: `Insgesamt liegt deine Gerade zu ${diff > 0 ? 'hoch' : 'tief'}: Bei ${answerName(item, mid)} zeigt dein Automat ${de(lineAt(own, mid), 1)}, der echte ${de(lineAt(real, mid), 1)}.` });

  const numbers = `In Zahlen: deine Konstante ${de(own.a, 2)}, deine Steigung ${de(own.b, 3)}; aus R: Konstante ${de(real.a, 2)}, Steigung ${de(real.b, 3)}.`;
  notes.push({ tone: 'hint', text: xMin > 0 && Math.abs(own.a - real.a) > 0.5
    ? `${numbers} Die Konstanten liegen weiter auseinander, weil Eingabe 0 links außerhalb der Skala liegt – dort wirkt jeder Unterschied in der Steigung voll.`
    : numbers });

  if (sse && Number.isFinite(sse.own) && Number.isFinite(sse.real) && sse.real > 0) {
    const more = sse.own / sse.real - 1;
    notes.push(more < 0.01
      ? { tone: 'ok', text: `Fehlerquadrate über alle Befragten: deine Gerade ${de(sse.own, 0)}, die echte ${de(sse.real, 0)} – fast gleich. Sehr gut geschätzt.` }
      : { tone: 'hint', text: `Fehlerquadrate (Summe der quadrierten Residuen) über alle Befragten: deine Gerade ${de(sse.own, 0)}, die echte ${de(sse.real, 0)} – deine hat ${de(100 * more, 0)} % mehr. Die echte Gerade liegt im Schnitt näher an den Punkten; keine Gerade kommt mit weniger Fehlerquadraten aus. Genau das heißt „kleinste Quadrate“.` });
  }
  return notes;
}

/* ---------- Der eingestellte Automat ---------- */

export type Machine = {
  item: InputItem;
  weighted: boolean;
  fit: OlsFit;
  /** Eingetragene Konstante und Steigung (so rechnet der Automat der Studierenden). */
  a: number;
  b: number;
  /** Fälle des Modells: Eingabe, Antwort, Gewicht des Automaten (ohne Gewicht: 1), echtes wghtpew, Gruppe für die Streuung. */
  x: number[];
  y: number[];
  w: number[];
  wReal: number[];
  g: number[];
  /** Faulpelz: zeigt allen den (gewichteten) Durchschnitt. */
  mean: number;
};

export function machineFor(p: Prepared, item: InputItem, v: Variant, s: Setting): Machine {
  const x = inputValues(p, item), g = groupValues(p, item), rows = v.fit.rows;
  return {
    // Konstante und Steigung in der Lesart, die zum Modell passt („2.288“ aus R ist 2,288, nicht 2288).
    item, weighted: v.weighted, fit: v.fit, a: matchReading(v.a, s.a)?.x ?? v.a, b: matchReading(v.b, s.b)?.x ?? v.b,
    x: rows.map(i => x[i]), y: rows.map(i => p.y[i]), w: rows.map(i => (v.weighted ? p.w[i] : 1)), wReal: rows.map(i => p.w[i]), g: rows.map(i => g[i]), mean: v.fit.yMean,
  };
}

/** Anzeige von Hand: Konstante + Steigung × Eingabe. */
export function checkDisplay(m: Machine, x: number, input: string): Note[] {
  const rs = numberReadings(input);
  if (!rs.length) return input.trim() ? [{ tone: 'warn', text: `Eingabe ${x}: Das ist keine Zahl.` }] : [];
  // jede Lesart mit mindestens zwei Stellen; Toleranz ihre halbe Einheit, mindestens 0,011 (Rundung von Konstante und Steigung)
  const hits = (target: number) => rs.some(r => r.decimals >= 2 && Math.abs(r.x - target) <= Math.max(halfUnit(r.decimals), 0.011));
  const mine = m.a + m.b * x, exact = m.fit.coef[0] + m.fit.coef[1] * x;
  if (hits(mine) || hits(exact)) return [{ tone: 'ok', text: `Eingabe ${x}: ${formula(m.a, m.b, String(x))} = ${de(mine, 2)} – stimmt.` }];
  if (rs[0].decimals < 2) return [{ tone: 'hint', text: `Eingabe ${x}: bitte mit zwei Nachkommastellen.` }];
  if (hits(m.b * x)) return [{ tone: 'hint', text: `Eingabe ${x}: Da fehlt die Konstante – der Automat startet bei der Anzeige für Eingabe 0.` }];
  if (hits(m.a)) return [{ tone: 'hint', text: `Eingabe ${x}: Das ist nur die Konstante. Die Steigung mal Eingabe kommt dazu.` }];
  return [{ tone: 'warn', text: `Eingabe ${x}: Rechne Konstante + Steigung × Eingabe mit deinen Zahlen aus Schritt 3.` }];
}
export const displayOk = (m: Machine, x: number, input: string) => checkDisplay(m, x, input).some(n => n.tone === 'ok');

/* ---------- Besucherprobe und Auflösung ---------- */

/** Zieht die Besuchergruppe: mit dem Gruppencode als Startwert, auf allen Rechnern mit derselben Datei gleich.
 *  Mit Gewicht wird proportional zu wghtpew gezogen (Efraimidis–Spirakis), damit die Gruppe für ganz Deutschland steht. */
export function drawVisitors(m: Machine, code: number, size = PROBE_SIZE): number[] {
  const next = random(code);
  const keys = m.y.map((_, i) => [Math.log(next()) / m.w[i], i] as const);
  return keys.sort((p, q) => q[0] - p[0] || p[1] - q[1]).slice(0, Math.min(size, keys.length)).map(([, i]) => i).sort((p, q) => m.x[p] - m.x[q] || p - q);
}

export type ProbeRow = { x: number; y: number; show: number; lazy: number; hit: boolean; lazyHit: boolean };
export function probeRows(m: Machine, positions: number[]): ProbeRow[] {
  return positions.map(i => {
    const show = m.a + m.b * m.x[i];
    return { x: m.x[i], y: m.y[i], show, lazy: m.mean, hit: Math.abs(m.y[i] - show) <= 1, lazyHit: Math.abs(m.y[i] - m.mean) <= 1 };
  });
}
export function probeTotals(rows: ProbeRow[]) {
  return {
    sse: rows.reduce((a, r) => a + (r.y - r.show) ** 2, 0), lazySse: rows.reduce((a, r) => a + (r.y - r.lazy) ** 2, 0),
    hits: rows.filter(r => r.hit).length, lazyHits: rows.filter(r => r.lazyHit).length,
  };
}

export type Resolution = {
  sse: number; sst: number; reduction: number; hit: number; lazyHit: number; mean: number;
  /** Antworten, die der Faulpelz auf ±1 trifft, mit ihrem Anteil. */
  near: { value: number; share: number }[];
  /** Sind das die häufigsten Antworten (so viele Plätze, wie es nahe Antworten gibt)? */
  nearAreTop: boolean;
};

/** Auflösung über alle Befragten: Fehlerquadrate und Trefferquote (±1) des Automaten gegen den Faulpelz (mit den exakten Koeffizienten). */
export function resolution(m: Machine): Resolution {
  const sw = m.w.reduce((a, b) => a + b, 0);
  let hit = 0, lazyHit = 0;
  m.y.forEach((y, i) => {
    if (Math.abs(y - m.fit.fitted[i]) <= 1) hit += m.w[i];
    if (Math.abs(y - m.mean) <= 1) lazyHit += m.w[i];
  });
  const shares = [...new Set(m.y)].sort((a, b) => a - b).map(v => ({ value: v, share: m.y.reduce((a, y, i) => a + (y === v ? m.w[i] : 0), 0) / sw }));
  const near = shares.filter(v => Math.abs(v.value - m.mean) <= 1);
  const top = [...shares].sort((a, b) => b.share - a.share).slice(0, near.length).map(v => v.value);
  const nearAreTop = near.length > 0 && near.every(v => top.includes(v.value));
  return { sse: m.fit.ssResidual, sst: m.fit.ssTotal, reduction: 1 - m.fit.ssResidual / m.fit.ssTotal, hit: hit / sw, lazyHit: lazyHit / sw, mean: m.mean, near, nearAreTop };
}

/** Dein Tipp „Wer trifft öfter?“ gegen die Auflösung. Gleich oft heißt: weniger als 0,5 Prozentpunkte Unterschied. */
export function compareGuess(guess: Guess | '', res: Resolution): Note[] {
  if (!guess) return [];
  const diff = res.hit - res.lazyHit;
  const truth: Guess = Math.abs(diff) < 0.005 ? 'beide gleich oft' : diff > 0 ? 'Automat' : 'Faulpelz';
  const said = truth === 'beide gleich oft' ? 'beide treffen (fast) gleich oft' : `der ${truth} trifft öfter`;
  return guess === truth
    ? [{ tone: 'ok', text: `Dein Tipp stimmt: ${said}.` }]
    : [{ tone: 'hint', text: `Dein Tipp: ${guess === 'beide gleich oft' ? 'beide gleich oft' : `der ${guess}`}. Die Daten: ${said}. Warum, steht darunter.` }];
}

/** Fehlerquadratsumme und Treffer (±1) einer beliebigen Geraden über die Befragten des Automaten – für die getippte Gerade in der Auflösung. */
export function lineScore(m: Machine, a: number, b: number) {
  let sse = 0, hit = 0, sw = 0;
  m.y.forEach((y, i) => { const r = y - a - b * m.x[i]; sse += m.w[i] * r * r; if (Math.abs(r) <= 1) hit += m.w[i]; sw += m.w[i]; });
  return { sse, hit: hit / sw };
}

/* ---------- Gleich gut für alle? ---------- */

export type Spread = {
  /** mit wghtpew gerechnet? (Beim Automaten ohne Gewicht wird die gewichtete Streuung als Variante aus dem Lösungsskript ebenfalls angenommen.) */
  weighted: boolean;
  groups: (GroupStat & { label: string })[];
  /** Standardfehler der Schätzung aus linear_regression() (Bezugslinie). */
  sigma: number;
  min: number; max: number; minAt: number; maxAt: number;
  /** dieselben Kennwerte nur über Stufen mit mindestens 30 Fällen */
  minBig: number; maxBig: number;
  other: { min: number; max: number };
  overallSd: number;
};

const residuals = (m: Machine) => m.y.map((y, i) => y - m.fit.fitted[i]);

/** Residuen-SD je Eingabestufe wie describe(daneben, weights = wghtpew) nach Gruppen (Rundung der Koeffizienten ändert sie nicht).
 *  Standard: so gewichtet wie der Automat; weighted wählt die Gewichtung ausdrücklich (echtes wghtpew oder ohne). */
export function spread(m: Machine, weighted = m.weighted): Spread {
  const r = residuals(m), ww = weighted ? m.wReal : r.map(() => 1);
  const stats = groupStats(r, m.g, weighted ? m.wReal : null);
  const groups = stats.map(s => ({ ...s, label: levelName(m.item, s.value) }));
  const finite = groups.filter(s => Number.isFinite(s.sd)), big = finite.filter(s => s.n >= 30);
  const lo = finite.reduce((a, s) => (s.sd < a.sd ? s : a), finite[0]), hi = finite.reduce((a, s) => (s.sd > a.sd ? s : a), finite[0]);
  const otherStats = groupStats(r, m.g, weighted ? null : m.wReal).filter(s => Number.isFinite(s.sd));
  const sds = (list: { sd: number }[]) => list.map(s => s.sd);
  const sw = ww.reduce((a, b) => a + b, 0), rm = r.reduce((a, v, i) => a + ww[i] * v, 0) / sw;
  return {
    weighted, groups, sigma: m.fit.sigma,
    min: lo?.sd ?? NaN, max: hi?.sd ?? NaN, minAt: lo?.value ?? NaN, maxAt: hi?.value ?? NaN,
    minBig: big.length ? Math.min(...sds(big)) : NaN, maxBig: big.length ? Math.max(...sds(big)) : NaN,
    other: { min: otherStats.length ? Math.min(...sds(otherStats)) : NaN, max: otherStats.length ? Math.max(...sds(otherStats)) : NaN },
    overallSd: Math.sqrt(r.reduce((a, v, i) => a + ww[i] * (v - rm) ** 2, 0) / (weighted ? sw - 1 : r.length - 1)),
  };
}

/** Kleinste und größte Residuen-SD: erkannt, wenn beide zu einer Streuungstabelle passen (alle Stufen oder nur Stufen ab 30 Fällen). */
export function spreadRecognised(s: Spread, lo: string, hi: string): boolean {
  const pair = [lo, hi];
  const ok = (a: number, b: number) => (within(a, pair[0]) && within(b, pair[1])) || (within(b, pair[0]) && within(a, pair[1]));
  return ok(s.min, s.max) || ok(s.minBig, s.maxBig);
}

/** Welche Streuungstabelle passt zu den Einträgen? Die eigene Gewichtung; beim Automaten ohne Gewicht auch die gewichtete
 *  (das Lösungsskript schreibt weights = wghtpew – die Streuung je Stufe ist so wie so vertretbar). */
export function recognisedSpread(m: Machine, lo: string, hi: string): Spread | null {
  const own = spread(m);
  if (spreadRecognised(own, lo, hi)) return own;
  if (!m.weighted) { const w = spread(m, true); if (spreadRecognised(w, lo, hi)) return w; }
  return null;
}

export function checkSpread(m: Machine, s: Spread, lo: string, hi: string): Note[] {
  if (!lo.trim() && !hi.trim()) return [];
  const hit = recognisedSpread(m, lo, hi);
  if (hit) {
    const big = !(within(hit.min, lo) || within(hit.min, hi)) || !(within(hit.max, lo) || within(hit.max, hi));
    const other = hit.weighted !== m.weighted ? ' Du hast die Streuung mit Gewicht gerechnet, deinen Automaten ohne – beides ist vertretbar; die Balken zeigen deine Rechnung.' : '';
    return [{ tone: 'ok', text: `Stimmt: Am genauesten ist der Automat bei ${levelName(m.item, hit.minAt)}, am ungenauesten bei ${levelName(m.item, hit.maxAt)}.${big ? ' (Du hast nur Stufen mit mindestens 30 Befragten verglichen – auch gut.)' : ''}${other}` }];
  }
  const notes: Note[] = [];
  for (const [label, input] of [['Kleinste SD', lo], ['Größte SD', hi]] as const) {
    if (!input.trim()) continue;
    if (notNumber(input)) { notes.push({ tone: 'warn', text: `${label}: Das ist keine Zahl.` }); continue; }
    const near = (v: number) => within(v, input);
    if (near(s.min) || near(s.max) || near(s.minBig) || near(s.maxBig)) continue;
    if (coarse(input)) { notes.push({ tone: 'hint', text: `${label}: bitte mit drei Nachkommastellen, so wie describe() sie zeigt.` }); continue; }
    if (near(s.other.min) || near(s.other.max)) notes.push({ tone: 'hint', text: m.weighted
      ? `${label}: Das ist die SD ohne Gewicht. Rechne so wie deinen Automaten, mit weights = wghtpew.`
      : `${label}: Das ist die SD mit Gewicht – dann trag beide Werte mit Gewicht ein (oder beide ohne, wie dein Automat).` });
    else if (near(s.sigma) || near(s.overallSd)) notes.push({ tone: 'hint', text: `${label}: Das ist die Streuung über alle Befragten. Gesucht ist die kleinste bzw. größte SD je ${m.item.groups ? 'Altersgruppe' : 'Eingabe'} – teile vorher mit group_by() auf.` });
    else if (s.groups.some(gr => near(gr.sd))) notes.push({ tone: 'hint', text: `${label}: Das ist die SD bei ${levelName(m.item, s.groups.find(gr => near(gr.sd))!.value)} – vergleiche alle Stufen.` });
    else if (s.groups.some(gr => near(gr.mean))) notes.push({ tone: 'hint', text: `${label}: Das ist ein Mittelwert der Residuen. Gesucht ist die Spalte SD.` });
    else notes.push({ tone: 'warn', text: `${label}: Diesen Wert finde ich nicht. Bilde das Residuum (Antwort minus Anzeige) und lass describe() je ${m.item.groups ? 'Altersgruppe' : 'Eingabe'} rechnen.` });
  }
  return notes;
}

/** Levene-Test auf die Residuen je Stufe: wie gerechnet (Mittelwert, eigene Gewichtung), mit der anderen Gewichtung (echtes wghtpew
 *  bzw. ohne) und mit dem Median als Zentrum. */
export function leveneVariants(m: Machine): Record<'main' | 'other' | 'median', LeveneResult> {
  const r = residuals(m), w = m.weighted ? m.wReal : null;
  return { main: levene(r, m.g, w), other: levene(r, m.g, m.weighted ? null : m.wReal), median: levene(r, m.g, w, 'median') };
}

export function checkLevene(m: Machine, lv: ReturnType<typeof leveneVariants>, input: string): Note[] {
  if (notNumber(input)) return input.trim() ? [{ tone: 'warn', text: 'Das ist keine Zahl.' }] : [];
  const near = (v: number) => within(v, input, 1);
  const p = (r: LeveneResult) => (r.p < 0.001 ? 'p < 0,001' : `p = ${de(r.p, 3)}`);
  const ok = (r: LeveneResult, extra = '') => [{ tone: 'ok' as const, text: `Stimmt: F(${r.df1}; ${de(r.df2, 1)}) = ${de(r.F, 3)}, ${p(r)}. ${r.p < 0.05 ? 'Die Streuung ist nicht für alle gleich – die Voraussetzung gleicher Fehlervarianz hält nicht.' : 'Der Test findet keinen klaren Unterschied der Streuung.'}${m.item.groups ? '' : ' Weil die Anzeige je Stufe gleich ist, vergleicht der Test hier dasselbe wie für die Zufriedenheit selbst.'} Ein Teil der Unterschiede kommt vom Rand der Skala: Wo viele ganz oben antworten, kann die Antwort nicht weit über der Anzeige liegen.${extra}` }];
  if (near(lv.main.F)) return ok(lv.main);
  // Automat ohne Gewicht, Levene wie im Gerüst mit weights = wghtpew: vertretbar
  if (!m.weighted && near(lv.other.F)) return ok(lv.other, ' (Mit Gewicht gerechnet, deinen Automaten ohne – beides ist vertretbar.)');
  if (coarse(input, 1)) return [{ tone: 'hint', text: 'Trag F mit Nachkommastellen ein, so wie levene_test() es zeigt.' }];
  if (near(lv.other.F)) return [{ tone: 'hint', text: 'Das ist Levene ohne Gewicht. Rechne so wie deinen Automaten, mit weights = wghtpew.' }];
  if (near(lv.median.F)) return [{ tone: 'hint', text: 'Das ist die Variante mit dem Median als Zentrum (Brown–Forsythe). mariposa nimmt als Standard den Mittelwert.' }];
  return [{ tone: 'warn', text: `Diesen F-Wert finde ich nicht. Rechne levene_test() mit dem Residuum, ${m.item.groups ? 'den Altersgruppen' : 'der Eingabe'} als group und weights = wghtpew.` }];
}

/* ---------- Schild: Gegenfragen ---------- */

const ERROR_WORDS = /±|\+\/-|daneben|abweich|fehler|spanne|ungenau|genauigkeit|streu|irr(t|en)|schwank/i;
// \b kennt in JavaScript nur ASCII-Buchstaben („weiß“ endet auf ß) – deshalb Grenzen über \p{L}.
const OVERCLAIM = /(?<!\p{L})(wei(ß|ss)|genau|du bist|Sie sind|so zufrieden bist)(?!\p{L})/iu;
const CAUSAL = /\b(macht|machen|führt|führen|bewirk\w*|verursach\w*|sorgt|weil|deshalb|daher|wegen|Einfluss|beeinfluss\w*|Wirkung|wirkt)\b/i;
const GROUP_WORDS = /\b(bei|für)\s+(manche\w*|einige\w*|Menschen|Leuten|Besucher\w*|Personen|allen|jede\w*|wenig\w*|kein\w*|viel\w*|gar|niedrig\w*|hoh\w*)|nicht für alle|nicht bei allen|Gruppe|je nach/i;

/** Regelbasierte Gegenfragen zum Schild – Denkanstöße, keine Bewertung. Zahlen nur, wenn die eigene Streuung erkannt ist. */
export function signQuestions(text: string, item: InputItem, s: Spread | null): Note[] {
  if (!text.trim()) return [];
  const notes: Note[] = [];
  if (!ERROR_WORDS.test(text)) notes.push({ tone: 'hint', text: s ? `Wie weit liegt er typischerweise daneben? Im Mittel etwa ±${fmt(s.sigma, 2)} Punkte.` : 'Wie weit liegt er typischerweise daneben?' });
  if (OVERCLAIM.test(text)) notes.push({ tone: 'hint', text: 'Er zeigt einen Durchschnitt von Menschen mit derselben Antwort – nicht, was die Person vor dem Automaten denkt.' });
  if (CAUSAL.test(text)) notes.push({ tone: 'hint', text: item.otherWay });
  if (s && s.max / s.min > 1.5 && !GROUP_WORDS.test(text)) notes.push({ tone: 'hint', text: `Für wen liegt er weiter daneben? Bei ${levelName(item, s.maxAt)} typischerweise ±${fmt(s.max, 2)}, bei ${levelName(item, s.minAt)} nur ±${fmt(s.min, 2)}.` });
  if (!s && !GROUP_WORDS.test(text)) notes.push({ tone: 'hint', text: 'Liegt er für alle gleich weit daneben? Das zeigt Schritt 6.' });
  if (!notes.length) notes.push({ tone: 'ok', text: 'Dein Schild sagt, wie weit der Automat danebenliegt, und behauptet keine Ursache. Lies es noch einmal wie eine Schulklasse: Verstehst du jedes Wort?' });
  return notes;
}

/* ---------- Automaten-Parade (alle zehn Eingaben aus der eigenen Datei) ---------- */

export type ParadeRow = { item: InputItem; n: number; b: number; r2: number; p: number; hit: number; lazyHit: number; sdMin: number; sdMax: number; edges: [number, number] };

export function parade(p: Prepared, weighted: boolean): ParadeRow[] {
  return INPUTS.flatMap(item => {
    const fit = tryOls(p.y, [inputValues(p, item)], weighted ? p.w : null);
    if (!fit) return [];
    const v: Variant = { kind: weighted ? 'main' : 'unweighted', weighted, a: fit.coef[0], b: fit.coef[1], r2: fit.r2, adjR2: fit.adjR2, beta: fit.beta[1], fit };
    const m = machineFor(p, item, v, { a: '', b: '', r2: '' });
    const res = resolution(m), sp = spread(m);
    const first = sp.groups[0], last = sp.groups[sp.groups.length - 1];
    return [{ item, n: fit.n, b: fit.coef[1], r2: fit.r2, p: fit.p[1], hit: res.hit, lazyHit: res.lazyHit, sdMin: sp.min, sdMax: sp.max, edges: [first?.mean ?? NaN, last?.mean ?? NaN] as [number, number] }];
  });
}

/** Wie oft trifft der Automat seltener als der Faulpelz? (gleich oft zählt nicht) */
export const worseThanLazy = (rows: ParadeRow[]) => rows.filter(r => r.hit < r.lazyHit - 1e-12).length;

export function paradeNotes(rows: ParadeRow[]): string[] {
  const notes: string[] = [];
  const worse = worseThanLazy(rows), equal = rows.filter(r => Math.abs(r.hit - r.lazyHit) <= 1e-12).length;
  notes.push(`Bei ${worse} von ${rows.length} Eingaben trifft der Automat auf ±1 seltener als der Faulpelz${equal ? `, bei ${equal} genau gleich oft` : ''} – obwohl jeder Automat weniger Fehlerquadrate macht.`);
  const best = [...rows].sort((a, b) => b.r2 - a.r2)[0];
  if (best) notes.push(`Das größte R² hat ${best.item.title} (${fmt(best.r2)}). Misst diese Frage etwas anderes als das, was der Automat vorhersagt?`);
  const signif = rows.filter(r => r.p < 0.001 && r.r2 < 0.01);
  for (const r of signif) notes.push(`${r.item.title}: p < 0,001, aber R² = ${fmt(r.r2)} – signifikant heißt nicht brauchbar.`);
  return notes;
}

/* ---------- Zustand, Plenum, R-Code ---------- */

export type S08State = {
  mode: WorkMode;
  input: InputId | null;
  reason: string;
  /** Deine Gerade zuerst: getippte Regel des Automaten (vor R) und ob der Tipp abgegeben ist. */
  myLine: Line | null;
  lineLocked: boolean;
  a: string; b: string; r2: string;
  shows: [string, string];
  code: string;
  guess: Guess | '';
  /** Tipp „Wer trifft öfter?“ abgegeben – erst dann erscheint die Auflösung (danach kein neuer Tipp). */
  guessLocked: boolean;
  sdMin: string; sdMax: string;
  levene: string;
  sign: string;
  decision: Decision | '';
  signedTech: boolean;
  signedCurator: boolean;
};

export const initialS08 = (): S08State => ({
  mode: 'solo', input: null, reason: '', myLine: null, lineLocked: false, a: '', b: '', r2: '', shows: ['', ''], code: '', guess: '', guessLocked: false, sdMin: '', sdMax: '', levene: '',
  sign: '', decision: '', signedTech: false, signedCurator: false,
});

/** Neue Eingabefrage: alles, was am Automaten hängt, beginnt von vorn; Arbeitsform und Gruppencode bleiben. */
export const pickInput = (s: S08State, input: InputId | null): S08State => ({ ...initialS08(), mode: s.mode, code: s.code, input });

/** Ein Gruppencode ist eine drei- oder vierstellige Zahl (im Seminar für alle gleich). */
export const codeNumber = (code: string) => (/^\d{3,4}$/.test(code.trim()) ? Number(code.trim()) : null);

/** Eine gespeicherte Gerade: zwei endliche Zahlen in vernünftiger Größe, sonst keine. */
function parseLine(raw: unknown): Line | null {
  const l = record(raw);
  const ok = (x: unknown, max: number): x is number => typeof x === 'number' && Number.isFinite(x) && Math.abs(x) <= max;
  return ok(l.a, 1e4) && ok(l.b, 1e3) ? { a: l.a, b: l.b } : null;
}

export function parseS08(raw: unknown): S08State {
  const r = record(raw), shows = Array.isArray(r.shows) ? r.shows : [];
  const myLine = parseLine(r.myLine);
  const guess = oneOf(r.guess, [...GUESSES, ''] as const, '');
  return {
    mode: oneOf(r.mode, WORK_MODES, 'solo'),
    input: typeof r.input === 'string' && (INPUT_IDS as string[]).includes(r.input) ? r.input as InputId : null,
    reason: str(r.reason, 400), myLine, lineLocked: bool(r.lineLocked) && myLine !== null, a: str(r.a, 12), b: str(r.b, 12), r2: str(r.r2, 12),
    shows: [str(shows[0], 12), str(shows[1], 12)], code: str(r.code, 4),
    // Ältere Stände kennen guessLocked nicht: Dort war die Auflösung mit dem Tipp schon sichtbar – also abgegeben.
    guess, guessLocked: guess !== '' && bool(r.guessLocked, true),
    sdMin: str(r.sdMin, 12), sdMax: str(r.sdMax, 12), levene: str(r.levene, 12), sign: str(r.sign, 400),
    decision: oneOf(r.decision, [...DECISIONS, ''] as const, ''), signedTech: bool(r.signedTech), signedCurator: bool(r.signedCurator),
  };
}

export function statusS08(s: S08State): TaskStatus {
  // Die Treffer-Wendung (Tipp und Auflösung) gehört zum Kern.
  if (s.input && s.a.trim() && s.b.trim() && s.r2.trim() && s.guess && s.guessLocked && s.sdMin.trim() && s.sdMax.trim() && s.sign.trim() && s.decision) return 'done';
  return s.input || s.a.trim() || s.sign.trim() || s.decision ? 'running' : 'open';
}

/** Plenumskarte: erkannte Zahlen in deutscher Schreibweise, noch nicht erkannte als Rohtext mit Vermerk. */
export function plenumLines(s: S08State, recognised: Variant | null, res: Resolution | null, sp: Spread | null = null): [string, string][] {
  const item = s.input ? inputById[s.input] : null;
  const signed = s.mode === 'pair' ? [s.signedTech && 'Technik', s.signedCurator && 'Kuratorin'].filter(Boolean).join(' und ') : '';
  const unchecked = (text: string) => `${text} (noch nicht geprüft)`;
  const sds = sp ? [sp.min, sp.max, sp.minBig, sp.maxBig] : [];
  return [
    ['Eingabe', item ? `${item.title} (${item.id})${recognised ? (recognised.weighted ? ' · gewichtet' : ' · ungewichtet') : ''}` : ''],
    ['b · R²', s.b.trim() && s.r2.trim()
      ? recognised ? `b = ${shown(s.b, [recognised.b])} · R² = ${shown(s.r2, [recognised.r2])}` : unchecked(`b = ${s.b.trim()} · R² = ${s.r2.trim()}`)
      : ''],
    ['Getippte Steigung', s.lineLocked && s.myLine
      ? `${de(s.myLine.b, 3)}${recognised ? ` (aus R: ${de(recognised.b, 3)})` : ''}`
      : ''],
    ['Treffer ±1', res ? `Automat ${de(100 * res.hit, 1)} % · Faulpelz ${de(100 * res.lazyHit, 1)} %` : ''],
    ['Daneben je Stufe', s.sdMin.trim() && s.sdMax.trim()
      ? sp ? `±${shown(s.sdMin, sds)} bis ±${shown(s.sdMax, sds)}` : unchecked(`±${s.sdMin.trim()} bis ±${s.sdMax.trim()}`)
      : ''],
    ['Entscheidung', s.decision ? `${s.decision}${signed ? ` (unterschrieben: ${signed})` : ''}` : ''],
    ['Schild', s.sign.trim()],
  ];
}

/** Eine Zahl so, wie man sie in R tippt: Punkt als Dezimalzeichen, drei Stellen. */
const rNum = (x: number) => x.toFixed(3);
/** „a + b * x“ bzw. „a - |b| * x“ für den R-Code. */
const rFormula = (a: number, b: number, x: string) => `${rNum(a)} ${b < 0 ? '-' : '+'} ${rNum(Math.abs(b))} * ${x}`;
/** Woran der Automat die Streuung aufteilt: die Eingabe selbst, beim Alter die fünf Gruppen. */
const groupVar = (item: InputItem) => item.groups?.name ?? item.id;
/** Beim Alter: fünf Altersgruppen als neue Variable (für describe() je Gruppe und levene_test()). */
const groupLines = (item: InputItem) => (item.groups ? [
  '# Altersgruppen bilden: einzelne Jahrgänge haben zu wenige Befragte',
  'allbus <- allbus %>%',
  '  mutate(',
  `    ${item.groups.name} = rec(${item.id}, rules = "${item.groups.rules}")`,
  '  )', '',
] : []);
/** Anzeige und Residuum in einem mutate(); Platzhalter ___ für die Lückenfassung. */
const residualLines = (anzeige: string, daneben: string) => [
  'allbus <- allbus %>%',
  '  mutate(',
  `    anzeige = ${anzeige},`,
  `    daneben = ${daneben}`,
  '  )',
];

const setupLines = (item: InputItem) => [
  LOAD_SCRIPT, '',
  `# Im Codebuch mit Strg/Cmd + F nach ps03 und ${item.id} suchen`,
  'codebook(allbus)', '',
  '# Hohe Werte sollen „zufrieden“ heißen: ps03 umpolen',
  'allbus <- allbus %>%',
  '  mutate(',
  '    demokratie = rec(ps03, rules = "rev")',
  '  )',
];

/** Lösung zu „Automat einstellen“: umpolen, gewichtet rechnen, summary() lesen – ohne Zahlen, die rechnet R. */
export const rSettingSolution = (item: InputItem) => [
  ...setupLines(item), '',
  '# Automat einstellen: gewichtet, damit er für ganz Deutschland spricht',
  'automat <- allbus %>%',
  `  linear_regression(demokratie ~ ${item.id}, weights = wghtpew)`, '',
  '# Konstante und Steigung: Coefficients, Spalte B · R²: Model Summary, R Square',
  'summary(automat)',
].join('\n');

/** Vollständiges Skript (Hilfestufe 4 bei „Gleich gut für alle?“ und zum Mitnehmen): einstellen, Anzeige und Residuum, Streuung je Stufe, Levene.
 *  line: Konstante und Steigung der gewichteten Rechnung aus der eigenen Datei (abgetippt wie aus summary()). */
export function rSolution(item: InputItem, line: Line | null): string {
  const g = groupVar(item);
  return [
    rSettingSolution(item), '',
    '# Anzeige und Residuum: Konstante und Steigung aus summary() abtippen',
    ...residualLines(line ? rFormula(line.a, line.b, item.id) : `___ + ___ * ${item.id}`, 'demokratie - anzeige'), '',
    ...groupLines(item),
    `# Gleich gut für alle? Streuung der Residuen je ${item.groups ? 'Altersgruppe' : 'Eingabe'}`,
    'allbus %>%',
    `  group_by(${g}) %>%`,
    '  describe(daneben, weights = wghtpew)', '',
    '# Profi: Test der Voraussetzung gleicher Fehlervarianz',
    'allbus %>%',
    `  levene_test(daneben, group = ${g}, weights = wghtpew)`,
  ].join('\n');
}

export const scaffoldSetting = (item: InputItem) => [
  '# Was heißt bei ps03 die 1? Im Codebuch nachsehen',
  'codebook(allbus)', '',
  '# ps03 umpolen',
  'allbus <- allbus %>%',
  '  mutate(',
  '    demokratie = rec(___, rules = "___")',
  '  )', '',
  '# Automat einstellen',
  'automat <- allbus %>%',
  `  linear_regression(___ ~ ${item.id}, weights = ___)`, '',
  '# Ausführliche Ausgabe',
  'summary(automat)',
].join('\n');

export const scaffoldSpread = (item: InputItem) => [
  '# Anzeige und Residuum',
  ...residualLines(`___ + ___ * ${item.id}`, '___ - ___'), '',
  ...groupLines(item),
  `# Streuung der Residuen je ${item.groups ? 'Altersgruppe' : 'Eingabe'}`,
  'allbus %>%',
  '  group_by(___) %>%',
  '  describe(daneben, weights = ___)',
].join('\n');

/* ---------- Einstieg: eine Gerade durch Punkte legen (Arbeitsstunden dw15 × Nettoeinkommen incc) ---------- */
// Bewusst keine Variable der Aufgabe (weder ps03 noch eine der zehn Eingabefragen): Das Spiel zeigt das Verfahren, nicht die Lösung.

/** Mitte jeder Einkommensgruppe von incc in Euro: Code 1 „unter 200 Euro“ → 100, Code 2 „200 – 299 Euro“ → 250 … Code 25 „7500 – 9999 Euro“ → 8750.
 *  Code 26 „10000 Euro und mehr“ ist nach oben offen und bleibt außen vor. In R: rec(incc, rules = "1=100; 2=250; …; 25=8750; else=NA"). */
export const INCOME_MID = [100, 250, 350, 450, 562.5, 687.5, 812.5, 937.5, 1062.5, 1187.5, 1312.5, 1437.5, 1625, 1875, 2125, 2375, 2625, 2875, 3250, 3750, 4250, 4750, 5500, 6750, 8750];
export const incomeMid = (code: number) => (Number.isInteger(code) && code >= 1 && code <= INCOME_MID.length ? INCOME_MID[code - 1] : NaN);

/** So viele Befragte zeigt das Spiel, beginnend mit der PLAY_START-ten Befragten der Auswahl. */
export const PLAY_COUNT = 15;
export const PLAY_START = 50;
/** Grenzen der Zeichenfläche: Stunden pro Woche und Euro im Monat. Punkte und Griffe bleiben darin. */
export const PLAY_X: [number, number] = [0, 70];
export const PLAY_Y: [number, number] = [0, 6000];
/** Höchstens so viele Punkte (mit hinzugefügten), mindestens so viele (eine Gerade braucht mehr als zwei, sonst passt sie immer). */
export const PLAY_MAX = 25;
export const PLAY_MIN = 3;

export type PlayPoint = { id: number; x: number; y: number };

/** Die Punkte zum Anfassen, nach einer festen Regel (in R nachprüfbar, siehe allbus.local.test.ts):
 *  alle Befragten mit Arbeitsstunden ab 1 (dw15) und einer Einkommensgruppe von 1 bis 25 (incc), in der Reihenfolge der Datei;
 *  davon jede step-te mit step = Anzahl ÷ count (abgerundet), beginnend mit der start-ten.
 *  In R: allbus %>% filter(dw15 >= 1, incc <= 25) %>% slice(seq(start, by = step, length.out = count)).
 *  Bei kleinen Dateien rutscht der Anfang in den ersten Schritt ((start − 1) mod step). null, wenn eine Variable fehlt oder zu wenige Befragte passen. */
export function playPoints(sav: SavFile, count = PLAY_COUNT, start = PLAY_START): PlayPoint[] | null {
  const pool = playPool(sav);
  if (!pool) return null;
  const step = Math.floor(pool.length / count);
  if (step < 1) return null;
  const first = (start - 1) % step;
  return Array.from({ length: count }, (_, k) => ({ id: k, ...pool[first + k * step] }));
}

/** Alle Befragten, aus denen die Punkte gezogen werden (Arbeitsstunden ab 1, Einkommensgruppe 1 bis 25), in der Reihenfolge der Datei. */
export function playPool(sav: SavFile): { x: number; y: number }[] | null {
  const hours = sav.byName.get('dw15'), income = sav.byName.get('incc');
  if (!hours || !income) return null;
  const h = validValues(hours), inc = validValues(income), out: { x: number; y: number }[] = [];
  for (let i = 0; i < h.length; i++) if (Number.isFinite(h[i]) && h[i] >= 1 && Number.isFinite(incomeMid(inc[i]))) out.push({ x: h[i], y: incomeMid(inc[i]) });
  return out;
}

/** Gerade aus R für die aktuellen Punkte: lm(y ~ x) ohne Gewicht, mit den Fehlerquadraten der Geraden (ssr) und des Durchschnitts (sst).
 *  null, wenn keine Gerade bestimmbar ist (weniger als drei Punkte oder alle auf derselben Stundenzahl). */
export type PlayFit = { a: number; b: number; r2: number; ssr: number; sst: number; mean: number };
export function playFit(points: PlayPoint[]): PlayFit | null {
  const fit = tryOls(points.map(q => q.y), [points.map(q => q.x)]);
  if (!fit || !fit.coef.every(Number.isFinite)) return null;
  return { a: fit.coef[0], b: fit.coef[1], r2: fit.r2, ssr: fit.ssResidual, sst: fit.ssTotal, mean: fit.yMean };
}

export const playMean = (points: PlayPoint[]) => points.reduce((s, q) => s + q.y, 0) / points.length;
/** Summe der Fehlerquadrate einer beliebigen Geraden: jedes Residuum (Punkt minus Gerade) mit sich selbst malgenommen, alles zusammengezählt. */
export const playSsr = (points: PlayPoint[], line: Line) => points.reduce((s, q) => s + (q.y - lineAt(line, q.x)) ** 2, 0);
/** Um welchen Anteil eine Gerade weniger Fehlerquadrate macht als der Durchschnitt (für die Gerade aus R ist das R²; negativ = mehr als der Durchschnitt). */
export const lessThanMean = (ssr: number, sst: number) => (sst > 0 ? 1 - ssr / sst : NaN);

const clamp = (v: number, [lo, hi]: [number, number]) => Math.min(hi, Math.max(lo, v));
/** Ein Punkt bleibt auf der Fläche und rastet ein: halbe Stunden, volle 10 Euro. */
export const clampPoint = (x: number, y: number) => ({ x: Math.round(2 * clamp(x, PLAY_X)) / 2, y: Math.round(clamp(y, PLAY_Y) / 10) * 10 });
/** Höhe eines Griffs der eigenen Geraden: auf der Fläche, auf 10 Euro gerundet. */
export const clampEnd = (y: number) => Math.round(clamp(y, PLAY_Y) / 10) * 10;

export const movePoint = (points: PlayPoint[], id: number, x: number, y: number): PlayPoint[] =>
  points.map(q => (q.id === id ? { id, ...clampPoint(x, y) } : q));

/** Ein neuer Punkt genau im Schwerpunkt (mittlere Stunden, mittleres Einkommen): Dort ändert er die Gerade aus R nicht –
 *  erst wenn man ihn wegzieht. Gibt die Liste unverändert zurück, wenn schon PLAY_MAX Punkte da sind. */
export function addPoint(points: PlayPoint[]): PlayPoint[] {
  if (points.length >= PLAY_MAX || points.length === 0) return points;
  const id = Math.max(...points.map(q => q.id)) + 1;
  return [...points, { id, x: points.reduce((s, q) => s + q.x, 0) / points.length, y: playMean(points) }];
}

export const removePoint = (points: PlayPoint[], id: number): PlayPoint[] => (points.length <= PLAY_MIN ? points : points.filter(q => q.id !== id));

/** Hat sich gegenüber dem Start etwas geändert (Punkt verschoben, hinzugefügt oder entfernt)? */
export const pointsChanged = (start: PlayPoint[], now: PlayPoint[]) =>
  start.length !== now.length || start.some((q, i) => now[i].id !== q.id || now[i].x !== q.x || now[i].y !== q.y);
