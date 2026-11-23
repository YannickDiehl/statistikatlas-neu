import type { SavFile } from '../../sandbox/readSav';
import type { Note } from '../kit/Feedback';
import { de, halfUnit, numberReadings, parseNumber } from '../kit/numbers';
import { predictCi, tryOls, wobble, dfbeta, type OlsFit } from '../kit/ols';
import { WORK_MODES, type WorkMode } from '../kit/PartnerToggle';
import { validValues } from '../kit/stats';
import { bool, oneOf, record, str } from '../kit/storage';
import type { TaskStatus } from '../types';
import {
  COMMON_CAUSES, CONTROL_IDS, controlById, CONTROLS, GROUP_IDS, GROUPS, hints, MAX_WORDS, MOVERS, PATTERN_CARDS, PATTERNS, R_LOAD, SORT_LABEL, SORTS, WOBBLE_K,
  type ControlId, type GroupId, type Pattern, type Sort,
  BUILDER_CODES, BUILDER_HEALTH_VAR, BUILDER_VARS, HEALTH_CODES, type BuilderBy, type BuilderCode, type BuilderHealth, type HealthCode,
} from './content';

/* ---------- Daten ---------- */

export type Prepared = {
  sav: SavFile;
  /** demokratie = rec(ps03, rules = "rev"): höher = zufriedener */
  y: Float64Array;
  yOrig: Float64Array;
  pt03: Float64Array;
  w: Float64Array;
  /** dg03 mit gültigen Codes 1–4, sonst NaN */
  dg: Float64Array;
  dummy: Record<GroupId, Float64Array>;
  /** ost = rec(eastwest, "1=0; 2=1"), ostjugend = rec(dg03, "1:2=1; 3:4=0") */
  ost: Float64Array;
  ostjugend: Float64Array;
  controls: Record<ControlId, Float64Array>;
};

const mapValid = (x: Float64Array, f: (v: number) => number | null) => Float64Array.from(x, v => (Number.isNaN(v) ? NaN : f(v) ?? NaN));

export function prepare(sav: SavFile): Prepared {
  const col = (name: string) => validValues(sav.byName.get(name)!);
  const yOrig = col('ps03');
  const dg = mapValid(col('dg03'), v => (v >= 1 && v <= 4 ? v : null));
  const dummy = Object.fromEntries(GROUP_IDS.map(g => [g, mapValid(dg, v => (v === g ? 1 : 0))])) as Record<GroupId, Float64Array>;
  const controls = Object.fromEntries(CONTROLS.map(c => [c.id, c.map ? mapValid(col(c.source), c.map) : col(c.source)])) as Record<ControlId, Float64Array>;
  return {
    sav, yOrig, y: mapValid(yOrig, v => 7 - v), pt03: col('pt03'), w: col('wghtpew'), dg, dummy,
    ost: mapValid(col('eastwest'), v => (v === 1 ? 0 : v === 2 ? 1 : null)), ostjugend: mapValid(dg, v => (v <= 2 ? 1 : 0)), controls,
  };
}

/* ---------- Modelle ---------- */

export type Outcome = 'rev' | 'orig' | 'pt03';
export type ModelSpec = { outcome: Outcome; ref: GroupId; controls: ControlId[]; weighted: boolean };
export type Model = {
  spec: ModelSpec;
  fit: OlsFit;
  c: number;
  /** Abstand jeder Gruppe zur Referenz (Referenz = 0) */
  b: Record<GroupId, number>;
  ci: Record<GroupId, [number, number]>;
  /** ungewichtete Fälle je Gruppe im Modell */
  n: Record<GroupId, number>;
};

export const others = (ref: GroupId) => GROUP_IDS.filter(g => g !== ref);
const orderedControls = (controls: ControlId[]) => CONTROL_IDS.filter(id => controls.includes(id));

/** Modell-Cache je Datei: jede Kombination wird höchstens einmal geschätzt. null heißt: nicht schätzbar. */
export function modelStore(p: Prepared) {
  const cache = new Map<string, Model | null>();
  return (spec: ModelSpec): Model | null => {
    const controls = orderedControls(spec.controls);
    const key = `${spec.outcome}|${spec.ref}|${controls.join(',')}|${spec.weighted}`;
    if (cache.has(key)) return cache.get(key)!;
    const y = spec.outcome === 'rev' ? p.y : spec.outcome === 'orig' ? p.yOrig : p.pt03;
    const groups = others(spec.ref);
    const fit = tryOls(y, [...groups.map(g => p.dummy[g]), ...controls.map(c => p.controls[c])], spec.weighted ? p.w : null,
      { names: [...groups.map(g => GROUPS[g].dummy), ...controls] });
    let model: Model | null = null;
    if (fit) {
      const b = { [spec.ref]: 0 } as Record<GroupId, number>, ci = { [spec.ref]: [0, 0] } as Record<GroupId, [number, number]>;
      groups.forEach((g, j) => { b[g] = fit.coef[j + 1]; ci[g] = [fit.ciLower[j + 1], fit.ciUpper[j + 1]]; });
      const n = Object.fromEntries(GROUP_IDS.map(g => [g, fit.rows.filter(i => p.dg[i] === g).length])) as Record<GroupId, number>;
      model = { spec: { ...spec, controls }, fit, c: fit.coef[0], b, ci, n };
    }
    cache.set(key, model);
    return model;
  };
}
export type Models = ReturnType<typeof modelStore>;
export const core = (models: Models, ref: GroupId, outcome: Outcome = 'rev', weighted = true) => models({ outcome, ref, controls: [], weighted });

/** Vorhersage je Gruppe mit Konfidenzintervall (im Modell ohne Kontrollen; bei jeder Referenz gleich). */
export function predictions(m: Model): Record<GroupId, { fit: number; lower: number; upper: number; n: number }> {
  const groups = others(m.spec.ref);
  return Object.fromEntries(GROUP_IDS.map(g => {
    const x = [...groups.map(h => (h === g ? 1 : 0)), ...m.spec.controls.map(() => 0)];
    const r = predictCi(m.fit, x);
    return [g, { fit: r.fit, lower: r.lower, upper: r.upper, n: m.n[g] }];
  })) as Record<GroupId, { fit: number; lower: number; upper: number; n: number }>;
}

/* ---------- Eingaben prüfen ---------- */

export type Reading = { x: number; decimals: number };
const roundTo = (v: number, d: number) => Math.round(v * 10 ** d) / 10 ** d;
/** Die Lesart einer Eingabe, die zu value passt: die aus R zuerst („3.995“ = 3,995), dann die deutsche („3.995“ = 3995);
 *  „%“ am Ende und „+“ vorn stören nicht. Toleranz: halbe Einheit der eingegebenen Stellen, mindestens minDecimals Stellen –
 *  außer R druckt die Zahl kürzer, weil Nullen am Ende wegfallen (0,500 → „0.5“). */
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
const fmt = (x: number, d = 2) => de(x, d);
/** Eine eingetragene Zahl, die zu einem der Werte passt, in deutscher Schreibweise; sonst der Rohtext, markiert. */
export function shown(input: string, values: number[], minDecimals = 2): string {
  for (const v of values) { const r = matchReading(v, input, minDecimals); if (r) return de(r.x, r.decimals); }
  return `${input.trim()} (noch nicht geprüft)`;
}

export type ModelEntry = { c: string; b: [string, string, string, string] };
export const emptyEntry = (): ModelEntry => ({ c: '', b: ['', '', '', ''] });
type Field = 'c' | GroupId;
const fieldLabel = (f: Field) => (f === 'c' ? 'Konstante' : GROUPS[f].short);
const fieldInput = (e: ModelEntry, f: Field) => (f === 'c' ? e.c : e.b[f - 1]);
const fieldValue = (m: Model, f: Field) => (f === 'c' ? m.c : m.b[f]);

/** „den Ost-Bleibenden“ bzw. „der Gruppe Ost→West“ (Dativ, für Sätze wie „Abstand zu …“). */
const toGroup = (g: GroupId) => (g === 1 || g === 4 ? `den ${GROUPS[g].short}n` : `der Gruppe ${GROUPS[g].short}`);

type Alternative = { values: number[]; text: string };

/** Erkannt: alle Felder (Konstante nur, wenn verlangt) passen zum Hauptmodell. */
export function modelRecognised(m: Model | null, ref: GroupId, e: ModelEntry, withConstant = true): boolean {
  if (!m) return false;
  const fields: Field[] = [...(withConstant ? ['c' as const] : []), ...others(ref)];
  return fields.every(f => within(fieldValue(m, f), fieldInput(e, f)));
}

/** Wertedetektor für eine Koeffiziententabelle: stimmt sie, passt sie zu einer bekannten Variante, oder was fehlt? */
function checkTable(m: Model | null, ref: GroupId, e: ModelEntry, withConstant: boolean, alternatives: Alternative[], okText?: string): Note[] {
  const fields: Field[] = [...(withConstant ? ['c' as const] : []), ...others(ref)];
  const entered = fields.filter(f => fieldInput(e, f).trim());
  if (!entered.length) return [];
  if (!m) return [{ tone: 'warn', text: 'Dieses Modell lässt sich mit deiner Datei nicht schätzen – eine Gruppe ist leer oder die Prädiktoren sind kollinear. Prüfe Referenzgruppe und Kontrollen.' }];
  const bad = entered.find(f => notNumber(fieldInput(e, f)));
  if (bad) return [{ tone: 'warn', text: `${fieldLabel(bad)}: Das ist keine Zahl.` }];
  const wrong = entered.filter(f => !within(fieldValue(m, f), fieldInput(e, f)));
  const short = wrong.find(f => coarse(fieldInput(e, f)));
  if (short) return [{ tone: 'hint', text: `${fieldLabel(short)}: Trag die Werte mit drei Nachkommastellen ein, so wie R sie zeigt.` }];
  if (!wrong.length) return entered.length === fields.length
    ? [{ tone: 'ok', text: okText ?? (withConstant
      ? `Stimmt: Die Konstante ist die mittlere Zufriedenheit der Referenzgruppe (${GROUPS[ref].short}); jedes B ist der Abstand einer Gruppe zu ihr, kein eigener Gruppenwert.`
      : `Stimmt: Jedes B ist der Abstand einer Gruppe zur Referenzgruppe (${GROUPS[ref].short}), kein eigener Gruppenwert.`) }]
    : [{ tone: 'hint', text: `Bisher stimmt alles – trag noch ${fields.filter(f => !entered.includes(f)).map(fieldLabel).join(', ')} ein.` }];
  const alt = alternatives.find(a => wrong.every(f => a.values.some(v => within(v, fieldInput(e, f)))));
  if (alt) return [{ tone: 'warn', text: alt.text }];
  const right = entered.filter(f => !wrong.includes(f));
  return [{ tone: 'warn', text: `${wrong.map(fieldLabel).join(', ')}: Diesen Wert finde ich nicht.${right.length ? ` (${right.map(fieldLabel).join(', ')} ${right.length > 1 ? 'stimmen' : 'stimmt'}.)` : ''} Prüfe Umpolen, Gewicht und welche drei Dummies im Modell stehen.` }];
}

const values = (m: Model | null) => (m ? [m.c, ...others(m.spec.ref).map(g => m.b[g])] : []);

const altCache = new WeakMap<Models, Map<GroupId, Alternative[]>>();

/** Varianten des Gruppenmodells: ohne Gewicht, ohne Umpolen, andere Referenz (Dummyfalle), dg03 als Zahl, eastwest allein.
 *  Je Datei und Referenz einmal gerechnet. */
export function coreAlternatives(p: Prepared, models: Models, ref: GroupId): Alternative[] {
  const byRef = altCache.get(models) ?? new Map<GroupId, Alternative[]>();
  altCache.set(models, byRef);
  const hit = byRef.get(ref);
  if (hit) return hit;
  const out: Alternative[] = [];
  byRef.set(ref, out);
  const add = (m: Model | null, text: string) => { if (m) out.push({ values: values(m), text }); };
  add(core(models, ref, 'rev', false), 'Das ist das Modell ohne Gewicht. Warum ändert das Gewicht die Koeffizienten kaum, die Unsicherheit bei West→Ost aber deutlich? Für den Film rechnest du mit weights = wghtpew.');
  add(core(models, ref, 'orig'), 'Die Vorzeichen passen zu ps03 ohne Umpolen (1 = sehr zufrieden). Pol ps03 zuerst um – wie im Werkzeugkasten hs01.');
  add(core(models, ref, 'orig', false), 'Das ist ps03 ohne Umpolen und ohne Gewicht. Pol um und rechne mit weights = wghtpew.');
  for (const r of others(ref)) {
    const trap = r === 4 ? ' Oder stehen alle vier Dummies im Modell? Dann wirft R den letzten hinaus (mariposa meldet „Excluded due to perfect collinearity“). Das ist die Dummyfalle – nimm nur drei.' : '';
    add(core(models, r), `Diese Zahlen passen zur Referenzgruppe ${GROUPS[r].short} – oben hast du ${GROUPS[ref].short} gewählt.${trap}`);
    add(core(models, r, 'rev', false), `Das ist die Referenzgruppe ${GROUPS[r].short} ohne Gewicht – oben hast du ${GROUPS[ref].short} gewählt.`);
    add(core(models, r, 'orig'), `Das ist die Referenzgruppe ${GROUPS[r].short} mit ps03 ohne Umpolen – oben hast du ${GROUPS[ref].short} gewählt.`);
  }
  for (const [outcome, weighted] of [['rev', true], ['orig', true], ['rev', false]] as const) {
    const fit = tryOls(outcome === 'rev' ? p.y : p.yOrig, [p.dg], weighted ? p.w : null);
    if (fit) out.push({ values: fit.coef, text: 'Eine Zahl für vier Gruppen: dg03 als Zahl behandelt die Gruppen wie eine Skala von 1 bis 4. Nimm die Dummies aus to_dummy().' });
    const ew = tryOls(outcome === 'rev' ? p.y : p.yOrig, [p.ost], weighted ? p.w : null);
    if (ew) out.push({ values: ew.coef, text: 'Das ist der Ost-West-Unterschied allein (Wohnort). Die vier Gruppen brauchen die Dummies aus dg03.' });
  }
  return out;
}

export function checkModel(p: Prepared, models: Models, ref: GroupId, e: ModelEntry): Note[] {
  return checkTable(core(models, ref), ref, e, true, coreAlternatives(p, models, ref));
}

/** Modell mit Kontrollen: die drei B der Gruppen. */
export function checkControlled(models: Models, ref: GroupId, controls: ControlId[], e: ModelEntry): Note[] {
  const main = models({ outcome: 'rev', ref, controls, weighted: true });
  const alts: Alternative[] = [];
  const add = (m: Model | null, text: string) => { if (m) alts.push({ values: values(m), text }); };
  add(core(models, ref), 'Das sind die Werte ohne Kontrollen. Nimm die angekreuzten Kontrollen mit + ins Modell.');
  add(models({ outcome: 'rev', ref, controls, weighted: false }), 'Das ist das Modell mit Kontrollen, aber ohne Gewicht. Rechne mit weights = wghtpew.');
  add(models({ outcome: 'orig', ref, controls, weighted: true }), 'Die Vorzeichen passen zu ps03 ohne Umpolen. Pol zuerst um.');
  for (const c of controls) add(models({ outcome: 'rev', ref, controls: controls.filter(x => x !== c), weighted: true }), `Da fehlt eine Kontrolle: ${controlById[c].title}. Oben ist sie angekreuzt.`);
  for (const c of CONTROL_IDS.filter(x => !controls.includes(x))) add(models({ outcome: 'rev', ref, controls: [...controls, c], weighted: true }), `Das Modell enthält zusätzlich ${controlById[c].title} – oben ist diese Kontrolle nicht angekreuzt.`);
  return checkTable(main, ref, e, false, alts,
    `Stimmt: Das sind die Abstände zu ${toGroup(ref)} bei gleichen Werten deiner Kontrollen (${controls.map(c => controlById[c].title).join(', ')}).`);
}

/** Gegenprobe mit pt03 (Vertrauen in den Bundestag) als abhängige Variable. */
export function checkCounter(models: Models, ref: GroupId, e: ModelEntry): Note[] {
  const alts: Alternative[] = [];
  const u = core(models, ref, 'pt03', false);
  if (u) alts.push({ values: values(u), text: 'Das ist die Gegenprobe ohne Gewicht. Rechne mit weights = wghtpew.' });
  const ps = core(models, ref);
  if (ps) alts.push({ values: values(ps), text: 'Das sind die Werte für die Demokratiezufriedenheit. In der Gegenprobe steht pt03 links vom ~.' });
  for (const r of others(ref)) { const m = core(models, r, 'pt03'); if (m) alts.push({ values: values(m), text: `Diese Zahlen passen zur Referenzgruppe ${GROUPS[r].short} – nimm dieselbe Referenzgruppe wie oben (${GROUPS[ref].short}).` }); }
  return checkTable(core(models, ref, 'pt03'), ref, e, false, alts,
    `Stimmt: So weit liegen die Gruppen beim Vertrauen in den Bundestag von ${toGroup(ref)} entfernt – vergleich es mit deinen Abständen bei der Zufriedenheit.`);
}

/** Die Lesart einer Vorhersage-Eingabe, die zu Konstante + B passt (aus den eigenen, erkannten Tabellenwerten oder exakt);
 *  mindestens zwei Stellen, Toleranz die halbe Einheit, mindestens 0,011 (Rundung der Tabellenwerte). */
/** Die eigenen Tabellenwerte für Konstante und B einer Gruppe, in der Lesart, die zum Modell passt („3.995“ = 3,995);
 *  B = 0, wenn die Gruppe die Referenz ist. null, solange eines der Felder keine Zahl ist. */
export function predictionParts(m: Model, e: ModelEntry, group: GroupId = 2): { c: number; b: number } | null {
  const read = (inp: string, value: number) => matchReading(value, inp)?.x ?? numberReadings(inp)[0]?.x ?? null;
  const c = read(e.c, m.c), b = group === m.spec.ref ? 0 : read(e.b[group - 1], m.b[group]);
  return c !== null && b !== null ? { c, b } : null;
}

export function predictionReading(m: Model, e: ModelEntry, input: string, group: GroupId = 2): Reading | null {
  const exact = m.c + m.b[group];
  const parts = predictionParts(m, e, group);
  const mine = parts ? parts.c + parts.b : NaN;
  return numberReadings(input).find(r => r.decimals >= 2 && [exact, mine].some(t => Math.abs(r.x - t) <= Math.max(halfUnit(r.decimals), 0.011))) ?? null;
}

/** Vorhersage für Ost→West aus der eigenen Tabelle: Konstante + B (oder die Konstante, wenn Ost→West die Referenz ist). */
export function checkPrediction(m: Model | null, e: ModelEntry, input: string, group: GroupId = 2): Note[] {
  const rs = numberReadings(input);
  if (!m || !rs.length) return input.trim() && !rs.length ? [{ tone: 'warn', text: 'Das ist keine Zahl.' }] : [];
  const ref = m.spec.ref, exact = m.c + m.b[group];
  if (predictionReading(m, e, input, group)) return [{ tone: 'ok', text: `Stimmt: ${group === ref ? `${GROUPS[group].short} ist die Referenzgruppe, die Vorhersage ist die Konstante.` : `Konstante + B(${GROUPS[group].short}) = ${fmt(exact)}.`} Diese Zahl muss bei jeder Referenzgruppe herauskommen.` }];
  if (rs[0].decimals < 2) return [{ tone: 'hint', text: 'Bitte mit zwei Nachkommastellen.' }];
  const hits = (target: number) => rs.some(r => r.decimals >= 2 && Math.abs(r.x - target) <= Math.max(halfUnit(r.decimals), 0.011));
  if (group !== ref && hits(m.b[group])) return [{ tone: 'hint', text: 'Das ist nur der Abstand zur Referenzgruppe. Die Vorhersage ist Konstante + B.' }];
  if (group !== ref && hits(m.c)) return [{ tone: 'hint', text: 'Das ist die Konstante – die Vorhersage der Referenzgruppe. Für Ost→West kommt das B dazu.' }];
  return [{ tone: 'warn', text: 'Rechne Konstante + B der Gruppe aus deiner Tabelle.' }];
}

/* ---------- Wie viele Umgezogene? ---------- */

export type MoverVariant = { key: 'all' | 'allWeighted' | 'model' | 'modelWeighted'; ow: number; wo: number; text: string };

export function moverVariants(p: Prepared): MoverVariant[] {
  const count = (g: GroupId, weighted: boolean, model: boolean) => {
    let s = 0;
    for (let i = 0; i < p.dg.length; i++) if (p.dg[i] === g && (!model || Number.isFinite(p.y[i])) && (!weighted || Number.isFinite(p.w[i]))) s += weighted ? p.w[i] : 1;
    return s;
  };
  return [
    { key: 'all', ow: count(2, false, false), wo: count(3, false, false), text: 'Das ist die Häufigkeit ohne Gewicht über alle Befragten.' },
    { key: 'allWeighted', ow: count(2, true, false), wo: count(3, true, false), text: 'Das ist die gewichtete Häufigkeit über alle Befragten – so viele stünden für Deutschland.' },
    { key: 'model', ow: count(2, false, true), wo: count(3, false, true), text: 'Das sind die Umgezogenen, die auch ps03 beantwortet haben – genau sie tragen das Modell.' },
    { key: 'modelWeighted', ow: count(2, true, true), wo: count(3, true, true), text: 'Das ist die gewichtete Zahl der Umgezogenen mit ps03.' },
  ];
}

const countTol = (input: string) => Math.max(halfUnit(numberReadings(input)[0]?.decimals ?? 0), 0.5 + 1e-9);
const nearCount = (v: number, input: string) => { const x = parseNumber(input); return x !== null && Math.abs(x - v) <= countTol(input); };

export function moversRecognised(vars: MoverVariant[], ow: string, wo: string): MoverVariant | null {
  return vars.find(v => nearCount(v.ow, ow) && nearCount(v.wo, wo)) ?? null;
}

export function checkMovers(vars: MoverVariant[], ow: string, wo: string): Note[] {
  if (!ow.trim() || !wo.trim()) return [];
  if (parseNumber(ow) === null || parseNumber(wo) === null) return [{ tone: 'warn', text: 'Bitte zwei Zahlen eintragen.' }];
  const hit = moversRecognised(vars, ow, wo);
  const model = vars.find(v => v.key === 'model')!;
  const film = `Im Modell stehen nur Befragte, denen ps03 gestellt wurde (Split): ${de(model.ow, 0)} Ost→West und ${de(model.wo, 0)} West→Ost. So wenige Menschen tragen den Film.`;
  if (hit) return [{ tone: 'ok', text: `${hit.text} ${hit.key === 'model' ? '' : film}`.trim() }];
  if (vars.some(v => nearCount(v.ow, wo) && nearCount(v.wo, ow))) return [{ tone: 'hint', text: 'Vertauscht? Ost→West heißt: im Osten aufgewachsen, lebt heute im Westen (dg03 = 2).' }];
  return [{ tone: 'warn', text: 'Diese Zahlen finde ich nicht. Gesucht ist Spalte N in der Häufigkeitstabelle von dg03: Ost→West ist Code 2, West→Ost Code 3.' }];
}

/* ---------- Wer zieht um? Selektion ---------- */

export type Selection = {
  /** gewichtet aus ungerundeten Zellen */
  weighted: Record<GroupId, number>;
  /** gewichtet wie crosstab() in mariposa 0.7.4 druckt: Zellen erst auf ganze Befragte gerundet, dann Prozent (West→Ost 52/67 = 77,6 % statt 78,0 %) */
  printed: Record<GroupId, number>;
  unweighted: Record<GroupId, number>;
  model: number; modelUnweighted: number;
  /** Spaltenprozente (Anteil West→Ost unter allen mit Abitur), ungerundet und wie gedruckt */
  col: number; colPrinted: number;
};

/** Abitur-Anteile je Gruppe wie allbus %>% crosstab(dg03, abi, percentages = "row", weights = wghtpew). */
export function selection(p: Prepared): Selection {
  const abi = p.controls.abi;
  const cells = (g: GroupId, weighted: boolean, model: boolean) => {
    let yes = 0, all = 0;
    for (let i = 0; i < p.dg.length; i++) {
      if (p.dg[i] !== g || !Number.isFinite(abi[i]) || (model && !Number.isFinite(p.y[i]))) continue;
      const w = weighted ? p.w[i] : 1;
      all += w; if (abi[i] === 1) yes += w;
    }
    return { yes, no: all - yes };
  };
  const share = (g: GroupId, weighted: boolean, model: boolean) => { const c = cells(g, weighted, model); return 100 * c.yes / (c.yes + c.no); };
  const rounded = Object.fromEntries(GROUP_IDS.map(g => { const c = cells(g, true, false); return [g, { yes: Math.round(c.yes), no: Math.round(c.no) }]; })) as Record<GroupId, { yes: number; no: number }>;
  let colYes = 0, colAll = 0;
  for (let i = 0; i < p.dg.length; i++) if (Number.isFinite(p.dg[i]) && abi[i] === 1) { colAll += p.w[i]; if (p.dg[i] === 3) colYes += p.w[i]; }
  const yesAll = GROUP_IDS.reduce((a, g) => a + rounded[g].yes, 0);
  return {
    weighted: Object.fromEntries(GROUP_IDS.map(g => [g, share(g, true, false)])) as Record<GroupId, number>,
    printed: Object.fromEntries(GROUP_IDS.map(g => [g, 100 * rounded[g].yes / (rounded[g].yes + rounded[g].no)])) as Record<GroupId, number>,
    unweighted: Object.fromEntries(GROUP_IDS.map(g => [g, share(g, false, false)])) as Record<GroupId, number>,
    model: share(3, true, true), modelUnweighted: share(3, false, true), col: 100 * colYes / colAll, colPrinted: 100 * rounded[3].yes / yesAll,
  };
}

/** Prozent wie R sie druckt („78.0%“) oder deutsch („78,0“); jede Lesart mit ihrer halben Einheit. */
const nearPct = (v: number, input: string) => Number.isFinite(v) && numberReadings(input).some(r => Math.abs(r.x - v) <= halfUnit(r.decimals));

const weightedHit = (s: Selection, input: string) => [s.weighted[3], s.printed[3]].some(v => nearPct(v, input) || nearPct(v / 100, input));

export const selectionRecognised = (s: Selection, input: string) =>
  weightedHit(s, input) || [s.unweighted[3], s.model, s.modelUnweighted].some(v => nearPct(v, input) || nearPct(v / 100, input));

export function checkSelection(s: Selection, input: string): Note[] {
  if (notNumber(input)) return input.trim() ? [{ tone: 'warn', text: 'Das ist keine Zahl.' }] : [];
  const all = `Abitur-Anteile (gewichtet): ${GROUP_IDS.map(g => `${GROUPS[g].short} ${de(s.printed[g], 1)} %`).join(', ')}.`;
  if (weightedHit(s, input)) return [{ tone: 'ok', text: `Stimmt (gewichtet). ${all} Die West→Ost-Umgezogenen sind eine eigene Auswahl – das ist Selektion.` }];
  if (nearPct(s.unweighted[3], input)) return [{ tone: 'ok', text: `Stimmt (ohne Gewicht; gewichtet ${de(s.printed[3], 1)} %). ${all} Die West→Ost-Umgezogenen sind eine eigene Auswahl – das ist Selektion.` }];
  if (nearPct(s.model, input) || nearPct(s.modelUnweighted, input)) return [{ tone: 'ok', text: `Stimmt für die Befragten mit ps03. Über alle: ${all}` }];
  if ([s.weighted[3], s.printed[3], s.unweighted[3]].some(v => nearPct(100 - v, input))) return [{ tone: 'hint', text: 'Das ist der Anteil ohne Abitur. Gesucht ist die Spalte mit Abitur (Code 1 deiner neuen Variable).' }];
  const other = GROUP_IDS.find(g => g !== 3 && [s.weighted[g], s.printed[g], s.unweighted[g]].some(v => nearPct(v, input)));
  if (other) return [{ tone: 'hint', text: `Das ist die Zeile ${GROUPS[other].short}. Gesucht ist West→Ost (dg03 = 3, W.JUGEND-O.INT.).` }];
  if (nearPct(s.col, input) || nearPct(s.colPrinted, input)) return [{ tone: 'hint', text: 'Das sind Spaltenprozente: welcher Teil aller Befragten mit Abitur West→Ost gezogen ist. Gesucht sind Zeilenprozente – Prozentbasis sind alle West→Ost-Umgezogenen.' }];
  return [{ tone: 'warn', text: 'Diesen Wert finde ich nicht. Gesucht sind gewichtete Zeilenprozente: Prozentbasis sind alle West→Ost-Umgezogenen. Prüfe auch deine Abitur-Variable (Codes 4 und 5 von educ).' }];
}

/** Denkanstoß zur Sortierung einer Kontrollkarte – keine Musterlösung. */
export function sortNote(id: ControlId, sort: Sort | ''): Note[] {
  if (!sort) return [];
  const c = controlById[id];
  // neutral: ein Argument für die gewählte Seite und eines für die andere – keine Musterlösung (Spezifikation §2)
  const [pro, con] = sort === 'vorher' ? [c.before, c.after] : [c.after, c.before];
  return [{ tone: 'hint', text: `${c.title} – ein Argument dafür: ${pro} Bedenke auch: ${con}` }];
}

/** Wie ändern die Kontrollen die drei Abstände? */
export function controlEffect(models: Models, ref: GroupId, controls: ControlId[]): { g: GroupId; without: number; with: number }[] | null {
  const a = core(models, ref), b = models({ outcome: 'rev', ref, controls, weighted: true });
  return a && b ? others(ref).map(g => ({ g, without: a.b[g], with: b.b[g] })) : null;
}

/* ---------- Interaktion (Profi) ---------- */

export type Interaction = { fit: OlsFit; additive: OlsFit | null; unweighted: OlsFit | null; orig: OlsFit | null };

export function interaction(p: Prepared): Interaction | null {
  const prod = Float64Array.from(p.ost, (v, i) => v * p.ostjugend[i]);
  const fit = tryOls(p.y, [p.ost, p.ostjugend, prod], p.w, { names: ['ost', 'ostjugend', 'ost:ostjugend'] });
  if (!fit) return null;
  return {
    fit, additive: tryOls(p.y, [p.ost, p.ostjugend], p.w), unweighted: tryOls(p.y, [p.ost, p.ostjugend, prod], null), orig: tryOls(p.yOrig, [p.ost, p.ostjugend, prod], p.w),
  };
}

export const interactionRecognised = (it: Interaction | null, input: string) => Boolean(it && within(it.fit.coef[3], input));

export function checkInteraction(it: Interaction | null, coreR2: number, input: string): Note[] {
  if (notNumber(input)) return input.trim() ? [{ tone: 'warn', text: 'Das ist keine Zahl.' }] : [];
  if (!it) return [{ tone: 'warn', text: 'Das Interaktionsmodell lässt sich mit deiner Datei nicht schätzen.' }];
  const f = it.fit;
  if (within(f.coef[3], input)) return [{ tone: 'ok', text: `Stimmt: ost:ostjugend = ${fmt(f.coef[3], 3)} (${f.p[3] < 0.001 ? 'p < 0,001' : `p = ${de(f.p[3], 3)}`}). Die Ost-Bleibenden liegen um so viel anders, als ost und ostjugend einzeln erwarten ließen. R² = ${fmt(f.r2, 3)} – wie im Modell mit vier Gruppen (${fmt(coreR2, 3)}): dieselbe Information, zweite Schreibweise.` }];
  if (coarse(input)) return [{ tone: 'hint', text: 'Bitte mit drei Nachkommastellen, so wie R sie zeigt.' }];
  if (it.orig && within(it.orig.coef[3], input)) return [{ tone: 'warn', text: 'Das Vorzeichen passt zu ps03 ohne Umpolen. Pol zuerst um.' }];
  if (it.unweighted && within(it.unweighted.coef[3], input)) return [{ tone: 'hint', text: 'Das ist die Interaktion ohne Gewicht. Rechne mit weights = wghtpew.' }];
  if (it.additive && it.additive.coef.slice(1).some(v => within(v, input))) return [{ tone: 'hint', text: 'Das ist das Modell ohne Interaktion: Die beiden Variablen sind mit + verbunden. Für die Interaktion verbindest du sie mit *.' }];
  if (within(f.coef[1], input) || within(f.coef[2], input)) return [{ tone: 'hint', text: 'Das ist der Koeffizient für ost bzw. ostjugend. Gesucht ist die Zeile ost:ostjugend.' }];
  if (within(f.p[3], input)) return [{ tone: 'hint', text: 'Das ist der p-Wert. Gesucht ist B der Zeile ost:ostjugend.' }];
  return [{ tone: 'warn', text: 'Diesen Wert finde ich nicht. Prüfe die beiden 0/1-Variablen (ost: 1 = wohnt im Osten; ostjugend: 1 = im Osten aufgewachsen), das Umpolen von ps03 und das Gewicht.' }];
}

/* ---------- Wackeltest und Tafel ---------- */

export type Wobble = { g: GroupId; full: number; lo: number; hi: number };

/** Wackeltest (Einfluss): Jeder Gruppenabstand ohne die fünf Befragten, die ihn am stärksten nach oben bzw. nach unten ziehen (DFBETA). */
export function wobbleTest(m: Model, k = WOBBLE_K): Wobble[] {
  const db = dfbeta(m.fit);
  return others(m.spec.ref).map((g, j) => {
    const r = wobble(m.fit, j + 1, k, db);
    const vals = [r.withoutUp, r.withoutDown];
    return { g, full: m.b[g], lo: Math.min(...vals), hi: Math.max(...vals) };
  });
}

/** VIF der drei Dummies wie in mariposa „Collinearity Statistics“: 1 / (1 − R²) aus der gewichteten Regression jedes Dummys
 *  auf die beiden anderen, auf den Befragten des Modells. Kleine Referenzgruppe → hohe VIF (Multikollinearität durch die Wahl). */
export function dummyVif(p: Prepared, m: Model): Record<GroupId, number> {
  const groups = others(m.spec.ref), inModel = new Uint8Array(p.dg.length);
  for (const i of m.fit.rows) inModel[i] = 1;
  const only = (x: Float64Array) => Float64Array.from(x, (v, i) => (inModel[i] ? v : NaN));
  const out = { [m.spec.ref]: NaN } as Record<GroupId, number>;
  for (const g of groups) {
    const fit = tryOls(only(p.dummy[g]), groups.filter(h => h !== g).map(h => only(p.dummy[h])), m.spec.weighted ? p.w : null);
    out[g] = fit ? 1 / (1 - fit.r2) : NaN;
  }
  return out;
}

/** Größter VIF eines Modells mit Gruppe (für die Tafel). */
export function maxVif(p: Prepared, m: Model): { g: GroupId; vif: number } | null {
  const v = dummyVif(p, m);
  return others(m.spec.ref).reduce<{ g: GroupId; vif: number } | null>((best, g) => (Number.isFinite(v[g]) && (!best || v[g] > best.vif) ? { g, vif: v[g] } : best), null);
}

/** Tafel der anderen Schnittplätze: dieselbe Frage mit jeder Referenz. */
export function board(models: Models): { ref: GroupId; model: Model }[] {
  return GROUP_IDS.flatMap(ref => { const m = core(models, ref); return m ? [{ ref, model: m }] : []; });
}

/* ---------- Tipp vor dem Modell: Prägung, Ort oder dazwischen? ---------- */

type Mover = 2 | 3;
export type PatternReading = {
  pattern: Pattern;
  /** Lage jeder Gruppe zwischen Ost-Bleibenden (0) und West-Bleibenden (1) – dieselbe Skala wie die Skizzen der Karten */
  pos: Record<GroupId, number>;
  movers: Record<Mover, Pattern>;
};

/** Welches Muster zeigen die Vorhersagen? Je Umgezogenen-Gruppe: im Drittel bei der Erwartung von „Ort“, bei der von „Prägung“
 *  oder in der Mitte; beide gleich → dieses Muster, sonst „dazwischen“. null, wenn die Bleibenden gleich zufrieden sind. */
export function patternOf(m: Model): PatternReading | null {
  const pr = predictions(m), span = pr[4].fit - pr[1].fit;
  if (!Number.isFinite(span) || Math.abs(span) < 1e-9) return null;
  const pos = Object.fromEntries(GROUP_IDS.map(g => [g, (pr[g].fit - pr[1].fit) / span])) as Record<GroupId, number>;
  // „Ort“ erwartet Ost→West bei den West-Bleibenden (1) und West→Ost bei den Ost-Bleibenden (0); „Prägung“ umgekehrt.
  const verdict = (ort: number): Pattern => (ort >= 2 / 3 ? 'ort' : ort <= 1 / 3 ? 'praegung' : 'dazwischen');
  const movers: Record<Mover, Pattern> = { 2: verdict(pos[2]), 3: verdict(1 - pos[3]) };
  return { pattern: movers[2] === movers[3] ? movers[2] : 'dazwischen', pos, movers };
}

export const patternName = (x: Pattern) => (x === 'dazwischen' ? 'etwas dazwischen' : `„${PATTERN_CARDS[x].title}“`);

/** Rückmeldung zum Tipp: Treffer oder nicht, wo die beiden Umgezogenen-Gruppen liegen, und wie viele Befragte das tragen. */
export function comparePattern(pick: Pattern, m: Model): Note[] {
  const r = patternOf(m);
  if (!r) return [{ tone: 'hint', text: 'Ost- und West-Bleibende sind in deiner Datei gleich zufrieden – dann trennt die Schablone die beiden Lager nicht.' }];
  const pr = predictions(m);
  const where = (g: Mover) => {
    const v = r.movers[g];
    if (v === 'dazwischen') return `${GROUPS[g].short} (${fmt(pr[g].fit)}) liegt etwa in der Mitte zwischen Ost- und West-Bleibenden.`;
    const near: GroupId = r.pos[g] >= 0.5 ? 4 : 1, off = near === 4 ? r.pos[g] - 1 : -r.pos[g];
    const how = off > 0.2 ? 'sogar jenseits der' : off >= -0.2 ? 'nah bei den' : 'näher bei den';
    return `${GROUPS[g].short} (${fmt(pr[g].fit)}) liegt ${how} ${GROUPS[near].short}n (${fmt(pr[near].fit)}) – so erwartet es „${PATTERN_CARDS[v].title}“.`;
  };
  const split = r.movers[2] !== r.movers[3] && r.movers[2] !== 'dazwischen' && r.movers[3] !== 'dazwischen';
  return [
    { tone: pick === r.pattern ? 'ok' : 'hint', text: `Dein Tipp: ${patternName(pick)}. Deine Daten zeigen: ${patternName(r.pattern)}.` },
    { tone: 'hint', text: `${where(2)} ${where(3)}${split ? ' Kein Lager erklärt beide Gruppen.' : ''}` },
    { tone: 'hint', text: `Vorsicht: Das Muster tragen nur ${m.n[2]} Ost→West- und ${m.n[3]} West→Ost-Befragte. Wie fest es steht, zeigen die Konfidenzintervalle und später der Wackeltest.` },
  ];
}

/* ---------- Welche Gruppe entscheidet den Streit? ---------- */

export function checkDecide(groups: GroupId[]): Note[] {
  if (!groups.length) return [];
  if (groups.some(g => MOVERS.includes(g))) return [{ tone: 'ok', text: 'Genau: Nur bei den Umgezogenen sagen „Prägung“ und „Ort“ Verschiedenes voraus. Bei den Bleibenden erwarten beide Lager dasselbe.' }];
  return [{ tone: 'hint', text: 'Bei den Bleibenden erwarten beide Lager dasselbe. Welche Gruppen trennen Prägung und Ort?' }];
}

/* ---------- Off-Text: Gegenfragen ---------- */

const CAUSAL = /\b(macht|machen|prägt|prägen|geprägt|weil|deshalb|daher|führt|führen|verursach\w*|bewirk\w*|sorgt|liegt\s+an|liegt\s+am)\b/i;
const SWEEPING = /\b(alle|immer|jede[rsnm]?|niemand|nie|keine[rn]?|die Ostdeutschen|die Westdeutschen)\b/i;
const EAST_TO_WEST = /in den Westen|nach Westen|Ost\s*→\s*West|Ost-West-Umgezogen|aus dem Osten/i;
const WEST_TO_EAST = /in den Osten|nach Osten|West\s*→\s*Ost|West-Ost-Umgezogen|aus dem Westen/i;
const HEDGE = /\b(etwa|rund|ungefähr|vermutlich|wohl|unsicher\w*|kleine[rn]?|wenige[rn]?|Spanne|zwischen|kaum|vielleicht|deutet|scheint|eher|wenig)\b/i;

export const wordCount = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

export type OffContext = {
  selection: Selection | null;
  movers: MoverVariant | null;
  wobble: Wobble[] | null;
  consequences: ControlId[];
  effectWithout: { g: GroupId; value: number }[] | null;
};

/** Gegenfragen zum Off-Text-Satz (Regelwerk wie in „Belege es!“): Denkanstöße ohne Bewertung. Zahlen nur, wo die eigenen Werte erkannt sind. */
export function offQuestions(text: string, ctx: OffContext): Note[] {
  if (!text.trim()) return [];
  const notes: Note[] = [];
  const words = wordCount(text);
  if (words > MAX_WORDS) notes.push({ tone: 'warn', text: `${words} Wörter – die Sprecherin hat Platz für höchstens ${MAX_WORDS}.` });
  if (CAUSAL.test(text)) notes.push({ tone: 'hint', text: ctx.selection
    ? `Wer zieht um? Von den West→Ost-Umgezogenen haben ${de(ctx.selection.printed[3], 0)} % Abitur (West-Bleibende ${de(ctx.selection.printed[4], 0)} %) – die Gruppen unterscheiden sich schon, bevor jemand umzieht.`
    : 'Wer zieht um? Unterscheiden sich die Umgezogenen schon, bevor sie umziehen?' });
  if (SWEEPING.test(text)) notes.push({ tone: 'hint', text: ctx.movers
    ? `Wie viele Menschen tragen diesen Satz? Im Modell ${de(ctx.movers.ow, 0)} Ost→West und ${de(ctx.movers.wo, 0)} West→Ost.`
    : 'Wie viele Menschen tragen diesen Satz?' });
  const ew = EAST_TO_WEST.test(text), we = WEST_TO_EAST.test(text);
  if (ew !== we) notes.push({ tone: 'hint', text: `Und die andere Gruppe? Du sprichst nur von ${ew ? 'Ost→West' : 'West→Ost'}.` });
  if (ctx.consequences.length) notes.push({ tone: 'hint', text: `Du hast ${ctx.consequences.map(c => controlById[c].title).join(' und ')} kontrolliert – das kann eine Folge des Umzugs sein.${ctx.effectWithout ? ` Ohne diese Kontrolle: ${ctx.effectWithout.map(x => `${GROUPS[x.g].short} ${fmt(x.value, 2)}`).join(', ')}.` : ''}` });
  if (!HEDGE.test(text)) notes.push({ tone: 'hint', text: ctx.wobble
    ? `Wie sicher ist das? Wackeltest ohne die fünf einflussreichsten Befragten: ${ctx.wobble.filter(x => MOVERS.includes(x.g)).map(x => `${GROUPS[x.g].short} zwischen ${fmt(x.lo)} und ${fmt(x.hi)}`).join(', ')}.`
    : 'Wie sicher ist das? Wie viele Menschen tragen die Zahl, und wie stark wackelt sie?' });
  if (!notes.length) notes.push({ tone: 'ok', text: 'Dein Satz hält den Gegenfragen stand: vorsichtig, ohne Ursache, für beide Gruppen. Lies ihn laut – passt er in den Atem der Sprecherin?' });
  return notes;
}

/* ---------- Zustand ---------- */

export type S09State = {
  mode: WorkMode;
  decide: GroupId[];
  decideText: string;
  /** Tipp vor dem Modell: welches Muster die Daten zeigen; erst „abgegeben“ zählt er */
  pattern: Pattern | '';
  patternLocked: boolean;
  movers: [string, string];
  ref: GroupId | 0;
  refReason: string;
  model: ModelEntry;
  pred: string;
  second: { ref: GroupId | 0; model: ModelEntry; pred: string };
  abi: string;
  sort: Record<ControlId, Sort | ''>;
  controls: ControlId[];
  cmodel: ModelEntry;
  inter: string;
  counter: ModelEntry;
  offText: string;
};

const emptySort = () => Object.fromEntries(CONTROL_IDS.map(id => [id, ''])) as Record<ControlId, Sort | ''>;

export const initialS09 = (): S09State => ({
  mode: 'solo', decide: [], decideText: '', pattern: '', patternLocked: false, movers: ['', ''], ref: 0, refReason: '', model: emptyEntry(), pred: '',
  second: { ref: 0, model: emptyEntry(), pred: '' }, abi: '', sort: emptySort(), controls: [], cmodel: emptyEntry(), inter: '', counter: emptyEntry(), offText: '',
});

/** Neue Referenz: Tabellen, die an ihr hängen, beginnen von vorn; die zweite Referenz nur, wenn sie jetzt gleich wäre. */
export function chooseRef(s: S09State, ref: GroupId | 0): S09State {
  if (ref === s.ref) return s;
  return { ...s, ref, refReason: '', model: emptyEntry(), pred: '', cmodel: emptyEntry(), counter: emptyEntry(), second: s.second.ref === ref ? { ref: 0, model: emptyEntry(), pred: '' } : s.second };
}
export const chooseSecondRef = (s: S09State, ref: GroupId | 0): S09State =>
  ref === s.second.ref ? s : { ...s, second: { ref, model: emptyEntry(), pred: '' } };
/** Andere Kontrollen: die Tabelle mit Kontrollen beginnt von vorn. */
export const toggleControl = (s: S09State, id: ControlId): S09State =>
  ({ ...s, controls: s.controls.includes(id) ? s.controls.filter(c => c !== id) : orderedControls([...s.controls, id]), cmodel: emptyEntry() });

const isGroup = (x: unknown): x is GroupId => x === 1 || x === 2 || x === 3 || x === 4;
function parseEntry(raw: unknown): ModelEntry {
  const r = record(raw), b = Array.isArray(r.b) ? r.b : [];
  return { c: str(r.c, 12), b: [0, 1, 2, 3].map(i => str(b[i], 12)) as ModelEntry['b'] };
}

export function parseS09(raw: unknown): S09State {
  const r = record(raw), second = record(r.second), sort = record(r.sort), movers = Array.isArray(r.movers) ? r.movers : [];
  const ref = isGroup(r.ref) ? r.ref : 0, secondRef = isGroup(second.ref) && second.ref !== ref ? second.ref : 0;
  return {
    mode: oneOf(r.mode, WORK_MODES, 'solo'),
    decide: Array.isArray(r.decide) ? GROUP_IDS.filter(g => (r.decide as unknown[]).includes(g)) : [],
    decideText: str(r.decideText, 400), movers: [str(movers[0], 12), str(movers[1], 12)],
    pattern: oneOf(r.pattern, [...PATTERNS, ''] as const, ''), patternLocked: bool(r.patternLocked) && PATTERNS.includes(r.pattern as Pattern),
    ref, refReason: str(r.refReason, 400), model: parseEntry(r.model), pred: str(r.pred, 12),
    second: { ref: secondRef, model: parseEntry(second.model), pred: str(second.pred, 12) },
    abi: str(r.abi, 12),
    sort: Object.fromEntries(CONTROL_IDS.map(id => [id, oneOf(sort[id], [...SORTS, ''] as const, '')])) as Record<ControlId, Sort | ''>,
    controls: Array.isArray(r.controls) ? CONTROL_IDS.filter(id => (r.controls as unknown[]).includes(id)) : [],
    cmodel: parseEntry(r.cmodel), inter: str(r.inter, 12), counter: parseEntry(r.counter), offText: str(r.offText, 400),
  };
}

const filled = (e: ModelEntry, ref: GroupId | 0, withConstant: boolean) =>
  ref !== 0 && (!withConstant || e.c.trim() !== '') && others(ref).every(g => e.b[g - 1].trim() !== '');

export function statusS09(s: S09State): TaskStatus {
  if (s.ref && filled(s.model, s.ref, true) && s.pred.trim() && s.movers.every(m => m.trim()) && s.abi.trim() && filled(s.cmodel, s.ref, false) && s.offText.trim()) return 'done';
  return s.decide.length || s.patternLocked || s.movers.some(m => m.trim()) || s.ref || s.offText.trim() ? 'running' : 'open';
}

/** Schnittplan-Karte: erkannte Zahlen in deutscher Schreibweise, noch nicht erkannte als Rohtext mit Vermerk. */
export function plenumLines(s: S09State, models: Models | null = null): [string, string][] {
  const ref = s.ref ? GROUPS[s.ref] : null;
  const notControlled = CONTROL_IDS.filter(id => s.sort[id] === 'folge' && !s.controls.includes(id)).map(id => controlById[id].title);
  const unchecked = (text: string) => `${text.trim()} (noch nicht geprüft)`;
  const main = models && s.ref ? core(models, s.ref) : null;
  const mainOk = Boolean(s.ref && main && modelRecognised(main, s.ref, s.model));
  const pred = (m: Model | null, ok: boolean, e: ModelEntry, input: string) => {
    const r = m && ok ? predictionReading(m, e, input) : null;
    return r ? de(r.x, r.decimals) : unchecked(input);
  };
  const second = models && s.second.ref ? core(models, s.second.ref) : null;
  const secondOk = Boolean(s.second.ref && second && modelRecognised(second, s.second.ref, s.second.model));
  const lines: [string, string][] = [
    ['Referenzgruppe', ref ? ref.short : ''],
    ['B Ost→West', !s.ref ? '' : s.ref === 2 ? 'Referenz' : !s.model.b[1].trim() ? '' : mainOk && main ? shown(s.model.b[1], [main.b[2]]) : unchecked(s.model.b[1])],
    ['Vorhersage Ost→West', s.pred.trim() ? pred(main, mainOk, s.model, s.pred) : ''],
    ['Kontrolliert', s.controls.map(id => controlById[id].title).join(', ')],
    ['Bewusst nicht kontrolliert', notControlled.length ? `${notControlled.join(', ')} (${SORT_LABEL.folge})` : ''],
    ['Off-Text', s.offText.trim()],
    ['Tipp vor dem Modell', s.patternLocked && s.pattern ? PATTERN_CARDS[s.pattern].title : ''],
  ];
  if (s.second.ref) lines.splice(3, 0, ['Zweite Referenz', `${GROUPS[s.second.ref].short}${s.second.pred.trim() ? ` · Vorhersage Ost→West ${pred(second, secondOk, s.second.model, s.second.pred)}` : ''}`]);
  return lines;
}

/* ---------- R-Code (nur Hilfestufen und Skript zum Mitnehmen) ---------- */

export const dummyTerms = (ref: GroupId) => others(ref).map(g => GROUPS[g].dummy).join(' + ');

/** Ein Schritt einer Kette, zwei Leerzeichen eingerückt; zu lange Argumentlisten werden nach dem Komma umbrochen (höchstens 100 Zeichen je Zeile). */
const step = (fn: string, args: string[]) => {
  const one = `  ${fn}(${args.join(', ')})`;
  return one.length <= 100 ? one : [`  ${fn}(`, ...args.map((a, i) => `    ${a}${i < args.length - 1 ? ',' : ''}`), '  )'].join('\n');
};

/** Modell als Objekt, danach summary() über die Pipe – jeweils eigener Block mit Leerzeile dazwischen. */
const modelBlock = (name: string, formula: string) => [
  `${name} <- allbus %>%`,
  step('linear_regression', [formula, 'weights = wghtpew']), '',
  `${name} %>%`,
  '  summary()',
].join('\n');

/** Schritt 2: einlesen und die vier Gruppen auszählen. */
export const rMovers = () => [
  R_LOAD, '',
  '# Im Codebuch mit Strg/Cmd + F nach dg03 suchen',
  'codebook(allbus)', '',
  '# Wie viele Befragte in jeder Gruppe? (dg03: Jugend Ost/West × Wohnort heute Ost/West)',
  'allbus %>%',
  '  frequency(dg03)',
].join('\n');

/** Vorbereitung fürs Modell: umpolen und die vier Dummies anlegen. */
export const rPrepare = () => [
  '# Zufriedenheit umpolen (höher = zufriedener), dann die Dummies:',
  '# eine 0/1-Variable je Gruppe (dg03_1 bis dg03_4)',
  'allbus <- allbus %>%',
  '  mutate(',
  '    demokratie = rec(ps03, rules = "rev")',
  '  ) %>%',
  '  to_dummy(dg03)',
].join('\n');

/** Einlesen und vorbereiten – der Anfang jeder Lösung ab Schritt 3. */
export const rSetup = () => `${R_LOAD}\n\n${rPrepare()}`;

export const rModel = (ref: GroupId, outcome: 'demo' | 'pt03' = 'demo') => {
  const name = outcome === 'demo' ? 'modell' : 'gegenprobe';
  const dependent = outcome === 'demo' ? 'demokratie' : 'pt03';
  return [
    `# Referenzgruppe: ${GROUPS[ref].short} – ihr Dummy (${GROUPS[ref].dummy}) bleibt draußen; nie alle vier zugleich`,
    modelBlock(name, `${dependent} ~ ${dummyTerms(ref)}`),
  ].join('\n');
};

export function rControls(ref: GroupId, controls: ControlId[]): string {
  const formula = `demokratie ~ ${[dummyTerms(ref), ...orderedControls(controls)].join(' + ')}`;
  return [
    '# Abitur und Geschlecht als 0/1-Variablen',
    'allbus <- allbus %>%',
    '  mutate(',
    `    abi  = rec(educ, rules = "${controlById.abi.rules}"),`,
    `    frau = rec(sex, rules = "${controlById.frau.rules}")`,
    '  )', '',
    '# Wer zieht um? Abitur-Anteil je Gruppe (Zeilenprozente, gewichtet)',
    'allbus %>%',
    '  crosstab(dg03, abi, percentages = "row", weights = wghtpew)', '',
    `# Modell mit Kontrollen${controls.length ? '' : ' (noch keine angekreuzt)'}`,
    modelBlock('modell_k', formula),
  ].join('\n');
}

export const rInteraction = () => [
  '# Profi: dieselbe Frage als Interaktion – zwei 0/1-Variablen',
  'allbus <- allbus %>%',
  '  mutate(',
  '    ost       = rec(eastwest, rules = "1=0 [West]; 2=1 [Ost]"),',
  '    ostjugend = rec(dg03, rules = "1:2=1 [Jugend Ost]; 3:4=0 [Jugend West]")',
  '  )', '',
  '# Interaktion mit *: beide Einzeleffekte plus die Zeile ost:ostjugend',
  modelBlock('modell_i', 'demokratie ~ ost * ostjugend'),
].join('\n');

/** Vollständiges Skript zum Mitnehmen für eine Referenzgruppe und eine Kontrollauswahl. */
export function rSolution(ref: GroupId, controls: ControlId[] = COMMON_CAUSES): string {
  return [
    rMovers(), '',
    rPrepare(), '',
    '# Modell mit drei Dummies',
    rModel(ref), '',
    rControls(ref, controls), '',
    '# Gegenprobe: Vertrauen in den Bundestag statt Demokratiezufriedenheit',
    rModel(ref, 'pt03'), '',
    rInteraction(),
  ].join('\n');
}

export const scaffoldMovers = () => hints.movers.scaffold;

export const scaffoldModel = () => [
  '# Zufriedenheit umpolen, dann die Dummies anlegen',
  'allbus <- allbus %>%',
  '  mutate(',
  '    demokratie = rec(___, rules = "___")',
  '  ) %>%',
  '  to_dummy(___)', '',
  '# Modell mit drei Dummies',
  'modell <- allbus %>%',
  '  linear_regression(demokratie ~ ___ + ___ + ___, weights = ___)', '',
  'modell %>%',
  '  summary()',
].join('\n');

export const scaffoldControls = (ref: GroupId) => [
  '# Abitur und Geschlecht als 0/1-Variablen',
  'allbus <- allbus %>%',
  '  mutate(',
  '    abi  = rec(educ, rules = "___=0 [kein Abitur]; ___=1 [(Fach-)Abitur]; else=NA"),',
  '    frau = rec(sex, rules = "___")',
  '  )', '',
  '# Abitur-Anteil je Gruppe',
  'allbus %>%',
  '  crosstab(dg03, ___, percentages = "___", weights = wghtpew)', '',
  '# Modell mit Kontrollen',
  modelBlock('modell_k', `demokratie ~ ${dummyTerms(ref)} + ___ + ___`),
].join('\n');

export const scaffoldCounter = () => [
  '# Gegenprobe: dieselben Dummies, eine andere abhängige Variable',
  modelBlock('gegenprobe', '___ ~ ___ + ___ + ___'),
].join('\n');

export const scaffoldInteraction = () => [
  '# Zwei 0/1-Variablen: wohnt im Osten, im Osten aufgewachsen',
  'allbus <- allbus %>%',
  '  mutate(',
  '    ost       = rec(eastwest, rules = "___"),',
  '    ostjugend = rec(dg03, rules = "___")',
  '  )', '',
  '# Interaktion mit *',
  modelBlock('modell_i', 'demokratie ~ ___ * ___'),
].join('\n');

/* ---------- Einstieg: Referenzgruppe, Kontrolle und Interaktion ausprobieren ----------
 * Lebenszufriedenheit (ls01) nach Schicht oder Altersgruppe, Gesundheit als Kontrolle (+) oder Interaktion (*), gewichtet mit wghtpew.
 * Regel für die Fallauswahl: Alle Varianten einer Gruppenvariable rechnen mit denselben Befragten – gültig bei ls01, der Gruppe,
 * der Gesundheit und dem Gewicht –, auch wenn die Gesundheit (noch) nicht im Modell steht. So ändert ein Umschalten nur das Modell,
 * nie die Befragten. In R: filter(!is.na(ls01), !is.na(schicht), !is.na(gesundheit)) vor linear_regression(…, weights = wghtpew). */

export type BuilderData = {
  y: Float64Array;
  w: Float64Array;
  /** Gruppencodes 1–3 je Gruppenvariable (wie rec()), sonst NaN */
  by: Record<BuilderBy, Float64Array>;
  /** gesundheit = rec(hs01, "1:2=1; 3:5=2"), sonst NaN */
  health: Float64Array;
};

export function builderData(sav: SavFile): BuilderData {
  const col = (name: string) => validValues(sav.byName.get(name)!);
  return {
    y: col('ls01'), w: col('wghtpew'), health: mapValid(col(BUILDER_HEALTH_VAR.source), BUILDER_HEALTH_VAR.map),
    by: { schicht: mapValid(col(BUILDER_VARS.schicht.source), BUILDER_VARS.schicht.map), alter: mapValid(col(BUILDER_VARS.alter.source), BUILDER_VARS.alter.map) },
  };
}

export type BuilderSpec = { by: BuilderBy; health: BuilderHealth; ref: BuilderCode; refH: HealthCode };
export type BuilderTerm = { name: string; kind: 'const' | 'group' | 'health' | 'inter'; g?: BuilderCode; h?: HealthCode; b: number };
/** Ein Balken: eine Gruppe (ohne Gesundheit) bzw. eine Gruppe × Gesundheit. parts = die Stücke von unten nach oben, fit = ihre Summe. */
export type BuilderCell = { g: BuilderCode; h: HealthCode | null; parts: BuilderTerm[]; fit: number; n: number };
export type BuilderModel = { spec: BuilderSpec; formula: string; terms: BuilderTerm[]; cells: BuilderCell[]; n: number; nPrinted: number; r2: number };

const dummyName = (by: BuilderBy, g: BuilderCode) => `${by}_${g}`;
const healthName = (h: HealthCode) => `${BUILDER_HEALTH_VAR.name}_${h}`;

/** Die Formel, wie man sie in R schreibt: ls01 ~ schicht_2 + schicht_3, … + gesundheit_2, (schicht_2 + schicht_3) * gesundheit_2. */
export function builderFormula(spec: BuilderSpec): string {
  const groups = BUILDER_CODES.filter(g => g !== spec.ref).map(g => dummyName(spec.by, g));
  const h = healthName(spec.refH === 1 ? 2 : 1);
  if (spec.health === 'ohne') return `ls01 ~ ${groups.join(' + ')}`;
  if (spec.health === 'plus') return `ls01 ~ ${[...groups, h].join(' + ')}`;
  return `ls01 ~ (${groups.join(' + ')}) * ${h}`;
}

/** Schätzt ein Modell des Einstiegs wie mariposa linear_regression(…, weights = wghtpew) auf den festen Befragten (siehe oben).
 *  Koeffizienten in der Reihenfolge, in der R sie druckt: Konstante, Gruppen-Dummies, Gesundheit, Interaktionen. null = nicht schätzbar. */
export function builderModel(d: BuilderData, spec: BuilderSpec): BuilderModel | null {
  const g = d.by[spec.by];
  const groups = BUILDER_CODES.filter(x => x !== spec.ref);
  const hOther: HealthCode = spec.refH === 1 ? 2 : 1;
  const dummy = (x: Float64Array, code: number) => Float64Array.from(x, v => (Number.isNaN(v) ? NaN : v === code ? 1 : 0));
  const gx = groups.map(k => dummy(g, k)), hx = dummy(d.health, hOther);
  const xs: Float64Array[] = [...gx], terms: Omit<BuilderTerm, 'b'>[] = [{ name: '(Intercept)', kind: 'const' }, ...groups.map(k => ({ name: dummyName(spec.by, k), kind: 'group' as const, g: k }))];
  if (spec.health !== 'ohne') { xs.push(hx); terms.push({ name: healthName(hOther), kind: 'health', h: hOther }); }
  if (spec.health === 'mal') groups.forEach((k, j) => {
    xs.push(Float64Array.from(gx[j], (v, i) => v * hx[i]));
    terms.push({ name: `${dummyName(spec.by, k)}:${healthName(hOther)}`, kind: 'inter', g: k, h: hOther });
  });
  const keep = (i: number) => Number.isFinite(d.y[i]) && Number.isFinite(g[i]) && Number.isFinite(d.health[i]) && Number.isFinite(d.w[i]);
  const fit = tryOls(d.y, xs, d.w, { names: terms.slice(1).map(t => t.name), keep });
  if (!fit) return null;
  const coefs: BuilderTerm[] = terms.map((t, j) => ({ ...t, b: fit.coef[j] }));
  const hs: (HealthCode | null)[] = spec.health === 'ohne' ? [null] : HEALTH_CODES;
  const cells: BuilderCell[] = BUILDER_CODES.flatMap(k => hs.map(h => {
    const parts = coefs.filter(t => t.kind === 'const'
      || (t.kind === 'group' && t.g === k)
      || (t.kind === 'health' && t.h === h)
      || (t.kind === 'inter' && t.g === k && t.h === h));
    const n = fit.rows.filter(i => g[i] === k && (h === null || d.health[i] === h)).length;
    return { g: k, h, parts, fit: parts.reduce((a, t) => a + t.b, 0), n };
  }));
  return { spec, formula: builderFormula(spec), terms: coefs, cells, n: fit.n, nPrinted: fit.nPrinted, r2: fit.r2 };
}

/** Die Höhe eines Balkens hängt nicht an den Referenzen – darum lässt sie sich zeigen, bevor eine Referenz gewählt ist. */
export const builderHeights = (d: BuilderData, by: BuilderBy, health: BuilderHealth) => builderModel(d, { by, health, ref: 1, refH: 1 });

/** Wo lag die Oberkante eines Balkens vor der letzten Änderung? Ohne Gesundheit davor: die Höhe der ganzen Gruppe.
 *  Hatte das Modell davor die Gesundheit und jetzt nicht mehr, gibt es keinen einen Vergleichswert (null). */
export function ghostFit(before: BuilderModel | null, cell: Pick<BuilderCell, 'g' | 'h'>): number | null {
  if (!before) return null;
  const hit = before.spec.health === 'ohne' ? before.cells.find(c => c.g === cell.g) : cell.h === null ? undefined : before.cells.find(c => c.g === cell.g && c.h === cell.h);
  return hit ? hit.fit : null;
}

/** Derselbe Koeffizient (gleicher Name) im Modell vor der letzten Änderung, sonst null. */
export const termBefore = (before: BuilderModel | null, name: string) => before?.terms.find(t => t.name === name)?.b ?? null;
