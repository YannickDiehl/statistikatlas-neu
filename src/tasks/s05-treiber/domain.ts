import type { SavFile } from '../../sandbox/readSav';
import type { Note } from '../kit/Feedback';
import { de, parseNumber } from '../kit/numbers';
import { WORK_MODES, type WorkMode } from '../kit/PartnerToggle';
import { crosstab, MEASURES, permutationV, validValues, type MeasureId } from '../kit/stats';
import { bool, oneOf, record, str } from '../kit/storage';
import type { TaskStatus } from '../types';
import { CARD_IDS, cardById, CARDS, KONF_ORDERS, LAGE, LEVEL_MEASURES, MEASURE_INFO, R_SETUP, STAMPS, type Card, type CardId, type Level, type Stamp } from './content';

export const MEASURE_IDS = ['V', 'phi', 'gamma', 'tau', 'rho', 'r'] as const satisfies readonly MeasureId[];
const SIGNED: MeasureId[] = ['gamma', 'tau', 'rho', 'r'];

/** Spalten, die alle Karten brauchen: Zufriedenheit (umgepolt und original), Gewicht, Landesteil, Wirtschaftslage-Gruppe. */
export type Prepared = { sav: SavFile; y: Float64Array; yOrig: Float64Array; w: Float64Array; east: Float64Array; lage: Float64Array };

export function prepare(sav: SavFile): Prepared {
  const yOrig = validValues(sav.byName.get('ps03')!);
  const ep01 = validValues(sav.byName.get('ep01')!);
  return {
    sav, yOrig,
    // rec(ps03, rules = "rev"): max + min − x = 7 − x, höher = zufriedener
    y: Float64Array.from(yOrig, v => (Number.isNaN(v) ? NaN : 7 - v)),
    w: validValues(sav.byName.get('wghtpew')!),
    east: validValues(sav.byName.get('eastwest')!),
    lage: Float64Array.from(ep01, v => (v <= 2 ? 1 : v === 3 ? 2 : v <= 5 ? 3 : NaN)),
  };
}

/** Werte einer Karte, nach der Umkodierung wie in R. */
export function cardValues(p: Prepared, card: Card, map = card.recode?.map): Float64Array {
  const raw = validValues(p.sav.byName.get(card.source)!);
  return map ? Float64Array.from(raw, v => (Number.isNaN(v) ? NaN : map(v) ?? NaN)) : raw;
}

export type Stratum = { label: string; keep: (i: number) => boolean };
/** West und Ost – bei der Karte „West oder Ost“ stattdessen die Wirtschaftslage als Drittvariable. */
export function strata(p: Prepared, card: Card): Stratum[] {
  if (card.id === 'eastwest') return LAGE.groups.map((label, g) => ({ label: `Wirtschaftslage ${label}`, keep: i => p.lage[i] === g + 1 }));
  return [{ label: 'West', keep: i => p.east[i] === 1 }, { label: 'Ost', keep: i => p.east[i] === 2 }];
}
const only = (x: Float64Array, keep: (i: number) => boolean) => Float64Array.from(x, (v, i) => (keep(i) ? v : NaN));

export type Variant = { measure: MeasureId; weighted: boolean; stratum: number; reversed: boolean; value: number };

/** Alle Werte einer Karte: Maß × Gewicht × gesamt/Landesteile × ps03 umgepolt oder original. */
export function variants(p: Prepared, card: Card): Variant[] {
  const x = cardValues(p, card), groups = strata(p, card), out: Variant[] = [];
  for (const measure of MEASURE_IDS) for (const reversed of SIGNED.includes(measure) ? [true, false] : [true]) {
    const y = reversed ? p.y : p.yOrig;
    for (const weighted of [true, false]) for (let s = -1; s < groups.length; s++) {
      const keep = s < 0 ? () => true : groups[s].keep;
      out.push({ measure, weighted, stratum: s, reversed, value: MEASURES[measure].fn(only(y, keep), only(x, keep), weighted ? p.w : null) });
    }
  }
  return out;
}

const decimals = (s: string) => (s.trim().replace(/^[−–-]/, '').split(/[.,]/)[1] ?? '').length;
/** Toleranz aus den eingegebenen Nachkommastellen: 0,54 → ±0,005; 0,544 → ±0,0005. */
export const tolerance = (input: string) => (decimals(input) >= 2 ? 0.5 * 10 ** -decimals(input) + 1e-9 : null);

const fmt = (x: number) => de(x, 3);
export const measureLabel = (m: MeasureId) => MEASURES[m].label;
const variantText = (v: Variant, groups: string[]) =>
  `${measureLabel(v.measure)} ${v.weighted ? 'mit' : 'ohne'} Gewicht${v.stratum >= 0 ? ` (${groups[v.stratum]})` : ''}${v.reversed ? '' : ', aber mit ps03 in der Originalkodierung'} = ${fmt(v.value)}`;

/** Richtungssatz in Worten. */
export function direction(card: Card, value: number): string {
  if (card.high === null) return 'Eine Richtung lässt sich hier nicht angeben.';
  if (Math.abs(value) < 0.03) return 'Der Zusammenhang ist so schwach, dass sich keine Richtung angeben lässt.';
  return `Wer ${card.high}, ist eher ${value > 0 ? 'zufriedener' : 'unzufriedener'} mit der Demokratie.`;
}

export type Entry = { measure: MeasureId | ''; weighted: boolean; value: string };

const matching = (vars: Variant[], x: number, tol: number) =>
  vars.filter(v => Math.abs(v.value - x) <= tol).sort((a, b) => Math.abs(a.value - x) - Math.abs(b.value - x));

/** Erkannt: Die eingetragene Zahl (mit mindestens zwei Nachkommastellen) entspricht irgendeiner Variante dieser Karte.
 *  Erst dann nennen die Denkanstöße Zahlen – eine beliebige eingetippte Zahl schaltet sie nicht frei. */
export function recognised(vars: Variant[], value: string): boolean {
  const x = parseNumber(value), tol = tolerance(value);
  return x !== null && tol !== null && matching(vars, x, tol).length > 0;
}

/** Wertedetektor: Welcher Variante entspricht die eingetragene Zahl? */
export function checkEntry(p: Prepared, card: Card, vars: Variant[], e: Entry): Note[] {
  const x = parseNumber(e.value);
  if (x === null || !e.measure) return [];
  const tol = tolerance(e.value);
  if (tol === null) return [{ tone: 'hint', text: 'Trag den Wert mit drei Nachkommastellen ein, so wie R ihn zeigt.' }];
  const groups = strata(p, card).map(s => s.label);
  const hits = matching(vars, x, tol);
  const notes: Note[] = [];
  if (e.measure === 'rho' && e.weighted) notes.push({ tone: 'hint', text: 'spearman_rho() nutzt Gewichte nur zur Fallauswahl – gewichtet und ungewichtet ist ρ hier gleich.' });
  const want = hits.find(v => v.measure === e.measure && v.weighted === e.weighted && v.stratum < 0 && v.reversed);
  if (want) return [...notes, { tone: 'ok', text: `Stimmt: ${variantText(want, groups)}. ${SIGNED.includes(want.measure) ? direction(card, want.value) : ''}`.trim() }];
  const same = hits.find(v => v.measure === e.measure && v.stratum < 0 && v.reversed);
  if (same) return [...notes, { tone: 'hint', text: `Das ist ${variantText(same, groups)}. ${e.weighted ? 'Für Deutschland rechnest du mit weights = wghtpew.' : 'Du hast oben „ohne Gewicht“ angegeben.'}` }];
  const orig = hits.find(v => !v.reversed);
  if (orig) return [...notes, { tone: 'warn', text: `Das ist ${variantText(orig, groups)}. Das Vorzeichen passt zu ps03 mit 1 = sehr zufrieden – hast du ps03 zuerst umgepolt?` }];
  const part = hits.find(v => v.stratum >= 0);
  if (part) return [...notes, { tone: 'hint', text: `Das ist ${variantText(part, groups)} – gesucht ist hier der Wert für ganz Deutschland.` }];
  if (hits[0]) return [...notes, { tone: 'hint', text: `Das ist ${variantText(hits[0], groups)} – oben hast du ${measureLabel(e.measure)} gewählt.` }];
  return [...notes, { tone: 'warn', text: 'Diesen Wert finde ich für diese Karte nicht. Prüfe Umpolen, Umkodierung und Gewicht.' }];
}

/** Werte für die Landesteile (bzw. Wirtschaftslage-Gruppen): mit oder ohne Gewicht, ps03 umgepolt. */
/** Bei der Karte „West oder Ost“ vergleicht man innerhalb der Wirtschaftslage-Gruppen mit Gamma (wie im Lösungsskript), sonst mit dem gewählten Maß. */
export const strataMeasure = (card: Card, measure: MeasureId | ''): MeasureId | '' => (card.id === 'eastwest' ? 'gamma' : measure);

export function checkStrata(p: Prepared, card: Card, vars: Variant[], chosen: MeasureId | '', inputs: string[]): Note[] {
  const measure = strataMeasure(card, chosen);
  if (!measure) return [];
  const groups = strata(p, card).map(s => s.label);
  return inputs.flatMap((input, s): Note[] => {
    const x = parseNumber(input), tol = tolerance(input);
    if (x === null || s >= groups.length) return [];
    if (tol === null) return [{ tone: 'hint', text: `${groups[s]}: bitte mit drei Nachkommastellen.` }];
    const close = (v: Variant) => Math.abs(v.value - x) <= tol;
    const hit = vars.find(v => v.measure === measure && v.stratum === s && v.reversed && close(v));
    if (hit) return [{ tone: 'ok', text: `${groups[s]}: ${measureLabel(measure)} = ${fmt(hit.value)} – stimmt.` }];
    // Bei „West oder Ost“ gehört in jede Gruppe Gamma; ein anderes Maß derselben Gruppe (z. B. Cramér-V) bekommt den Hinweis ohne Referenzzahl.
    if (card.id === 'eastwest' && !vars.some(v => v.measure === measure && v.stratum === s && close(v))) {
      const variant = vars.find(v => v.stratum === s && close(v));
      if (variant) return [{ tone: 'warn', text: `${groups[s]}: Das ist ${measureLabel(variant.measure)}. Bei dieser Karte rechnest du je Gruppe Gamma (goodman_gamma()), damit die Richtung sichtbar bleibt.` }];
    }
    const other = vars.find(close);
    const notFound = card.id === 'eastwest'
      ? 'Diesen Wert finde ich nicht. Bilde die Gruppen der Wirtschaftslage mit rec(), filtere je Gruppe mit filter() und rechne Gamma.'
      : 'Diesen Wert finde ich nicht. Behalte mit filter() nur einen Landesteil und rechne darin dasselbe Maß wie in Schritt 3.';
    return [{ tone: 'warn', text: `${groups[s]}: ${other ? `Das ist ${variantText(other, groups)}.` : notFound}` }];
  });
}

/** Offengelegte Regel für das Urteil; bei „West oder Ost“ sind die Teile die drei Gruppen der Wirtschaftslage, die Schwellen bleiben dieselben wie in stampReading(). */
export const stampRule = (card: Card | null): string => card?.id === 'eastwest'
  ? 'kehrt sich um: Die Gruppen der Wirtschaftslage haben verschiedene Vorzeichen, mindestens eine liegt bei 0,03 oder darüber, mindestens eine bei −0,03 oder darunter. · nur in einem Landesteil (hier: in einer Gruppe): Der größte Betrag ist mindestens doppelt so groß wie der kleinste, und der kleinste liegt unter 0,1. · schrumpft: Im Mittel liegen die Gruppen unter 85 % des Gesamtwerts. · Sonst: trägt.'
  : 'kehrt sich um: Die Landesteile haben verschiedene Vorzeichen, beide mindestens 0,03 vom Nullpunkt entfernt. · nur in einem Landesteil: Ein Wert ist mindestens doppelt so groß wie der andere, und der kleinere liegt unter 0,1. · schrumpft: Im Mittel liegen die Landesteile unter 85 % des Gesamtwerts. · Sonst: trägt.';

export function stampReading(total: number, parts: number[], signed: boolean): Stamp {
  const abs = parts.map(Math.abs);
  if (signed && parts.some(a => a >= 0.03) && parts.some(a => a <= -0.03)) return 'kehrt sich um';
  if (Math.max(...abs) >= 2 * Math.min(...abs) && Math.min(...abs) < 0.1) return 'nur in einem Landesteil';
  if (abs.reduce((a, b) => a + b, 0) / abs.length < 0.85 * Math.abs(total)) return 'schrumpft';
  return 'trägt';
}

/** Stimmen alle eingetragenen Werte je Teil (West/Ost bzw. Wirtschaftslage-Gruppe) mit dem Wertedetektor überein? Erst dann nennt die Lesart Zahlen. */
const strataVerified = (p: Prepared, card: Card, vars: Variant[], measure: MeasureId | '', inputs: string[]) => {
  const notes = checkStrata(p, card, vars, measure, inputs);
  return notes.length === strata(p, card).length && notes.every(n => n.tone === 'ok');
};

/** Die Lesart nach der Regel. Zahlen (Gesamtwert, Werte je Teil) nennt sie nur, wenn die eigenen Teilwerte stimmen. */
export function checkStamp(p: Prepared, card: Card, vars: Variant[], measure: MeasureId | '', stamp: Stamp | '', strataInputs: string[] = []): Note[] {
  if (!stamp) return [];
  const m = strataMeasure(card, measure || LEVEL_MEASURES[card.level][0]) as MeasureId;
  const total = vars.find(v => v.measure === m && v.weighted && v.stratum < 0 && v.reversed)!.value;
  const parts = strata(p, card).map((_, s) => vars.find(v => v.measure === m && !v.weighted && v.stratum === s && v.reversed)!.value);
  const mine = stampReading(total, parts, SIGNED.includes(m));
  const where = card.id === 'eastwest' ? 'in den drei Wirtschaftslage-Gruppen' : 'in West und Ost';
  const values = strataVerified(p, card, vars, measure, strataInputs) ? ` (${measureLabel(m)} gesamt ${fmt(total)}, ${where} ${parts.map(fmt).join(' / ')})` : '';
  return stamp === mine
    ? [{ tone: 'ok', text: `Meine Lesart nach der offengelegten Regel ist auch „${mine}“${values}.` }]
    : [{ tone: 'hint', text: `Nach der offengelegten Regel lese ich „${mine}“${values}. Dein Urteil ist „${stamp}“ – die Entscheidung bleibt bei dir; begründe sie im Satz.` }];
}

/** Passung von Maß und Skalenniveau: Denkanstöße, keine Bewertung. */
/** showNumbers: Werte erst nennen, wenn die eigene Rechnung eingetragen ist – vorher nur der Denkanstoß. */
export function fitNotes(p: Prepared, card: Card, vars: Variant[], measure: MeasureId | '', showNumbers = true): Note[] {
  if (!measure) return [];
  const v = (m: MeasureId, weighted = true) => vars.find(x => x.measure === m && x.weighted === weighted && x.stratum < 0 && x.reversed)!.value;
  const notes: Note[] = [];
  const x = cardValues(p, card), t = crosstab(p.y, x);
  if (measure === 'V' && card.level !== 'nominal' && !showNumbers) notes.push({ tone: 'hint', text: 'V nutzt die Reihenfolge der Stufen nicht. Nach deiner Rechnung zeige ich dir, wie groß V schon ohne jeden Zusammenhang wäre (Zufalls-V).' });
  if (measure === 'V' && card.level !== 'nominal' && showNumbers) {
    const rv = permutationV(p.y, x, p.w);
    notes.push({ tone: 'hint', text: v('V') < 1.5 * rv
      ? `Zufalls-V: Vertauscht man die Zufriedenheit zufällig, ergibt sich schon V ≈ ${fmt(rv)}. Dein V (${fmt(v('V'))}) ist fast nur Tabellengröße.`
      : `V nutzt die Reihenfolge der Stufen nicht. Zum Vergleich: Zufalls-V ≈ ${fmt(rv)}.` });
  }
  if (measure === 'phi' && Math.min(t.rows.length, t.cols.length) > 2) notes.push({ tone: 'hint', text: `Phi ist für Vierfeldertafeln gedacht; diese Tabelle ist ${t.rows.length}×${t.cols.length} groß – Phi kann hier über 1 steigen. Nimm Cramér-V.` });
  if ((measure === 'gamma' || measure === 'tau') && card.id === 'konf' && !showNumbers) notes.push({ tone: 'warn', text: 'Die Reihenfolge der Konfessionen ist willkürlich – Gamma und Tau-b hängen davon ab, wie du die Kategorien anordnest. Nach deiner Rechnung zeige ich dir drei Reihenfolgen.' });
  if ((measure === 'gamma' || measure === 'tau') && card.id === 'konf' && showNumbers) {
    const gammas = KONF_ORDERS.map(o => MEASURES.gamma.fn(p.y, cardValues(p, card, o.map), p.w));
    notes.push({ tone: 'warn', text: `Die Reihenfolge der Konfessionen ist willkürlich. Gamma je nach Reihenfolge: ${gammas.map(fmt).join(' / ')} (${KONF_ORDERS.map(o => o.label).join(' | ')}).` });
  }
  if (measure === 'gamma' && card.id !== 'konf') notes.push({ tone: 'hint', text: `Gamma übergeht Paare mit Bindungen und ist deshalb dem Betrag nach größer als Tau-b${showNumbers ? ` (γ ${fmt(v('gamma'))}, τ ${fmt(v('tau'))})` : ''}.` });
  if (measure === 'r' && card.level === 'ordinal') notes.push({ tone: 'hint', text: 'Pearson-r setzt gleiche Abstände zwischen den Stufen voraus. Hält das für diese Skala?' });
  return notes;
}

/** Entscheidungspfad: Passt ein Maß zum gewählten Skalenniveau des Kandidaten? Ohne Niveau ist nichts ausgegraut. */
export function measureFit(level: Level | '', m: MeasureId): { fits: boolean; reason: string } {
  if (!level) return { fits: true, reason: '' };
  return LEVEL_MEASURES[level].includes(m) ? { fits: true, reason: '' } : { fits: false, reason: MEASURE_INFO[m].misfit[level] ?? 'Passt nicht zu diesem Skalenniveau.' };
}

/** Skalenniveau der Demokratiezufriedenheit (ps03): sechs geordnete Stufen. */
export function checkOutcomeLevel(level: Level | ''): Note[] {
  if (!level) return [];
  if (level === 'ordinal') return [{ tone: 'ok', text: 'ordinal – sechs geordnete Stufen. Welches Maß passt, entscheidet darum dein Kandidat: Ist er metrisch, darfst du die sechs Stufen so behandeln, als wären die Abstände gleich (quasi-metrisch).' }];
  if (level === 'metrisch') return [{ tone: 'ok', text: 'Vertretbar: Sechs Stufen darf man so behandeln, als wären die Abstände gleich (quasi-metrisch). Streng genommen ist ps03 ordinal. Welches Maß passt, entscheidet darum dein Kandidat.' }];
  return [{ tone: 'hint', text: 'Die Stufen haben eine Reihenfolge: 1 sehr zufrieden … 6 sehr unzufrieden. Schau noch einmal hin.' }];
}

export function checkLevel(card: Card, level: Level | ''): Note[] {
  if (!level) return [];
  if (level === card.level || level === card.alsoLevel) return [{ tone: 'ok', text: `${level} – passt. Dazu passen ${LEVEL_MEASURES[level].map(measureLabel).join(', ')}.` }];
  return [{ tone: 'hint', text: `Schau noch einmal ins Codebuch: ${card.question}` }];
}

/* ---------- Enthüllung: Rangliste nach vier Zusammenhangsmaßen ---------- */

export const CURRENCIES = ['V', 'gamma', 'tau', 'r'] as const satisfies readonly MeasureId[];
export const VIEWS = ['weighted', 'unweighted', 'west', 'ost'] as const;
export type View = typeof VIEWS[number];
export const VIEW_LABELS: Record<View, string> = { weighted: 'gewichtet', unweighted: 'ohne Gewicht', west: 'nur West', ost: 'nur Ost' };
export type Reveal = Record<View, Record<CardId, Record<typeof CURRENCIES[number], number>>>;

export function reveal(p: Prepared): Reveal {
  const out = {} as Reveal;
  for (const view of VIEWS) {
    out[view] = {} as Reveal[View];
    const keep = view === 'west' ? (i: number) => p.east[i] === 1 : view === 'ost' ? (i: number) => p.east[i] === 2 : () => true;
    const y = only(p.y, keep), w = view === 'weighted' ? p.w : null;
    for (const card of CARDS) {
      const x = only(cardValues(p, card), keep);
      // Konfession hat keine Reihenfolge: nur V ist sinnvoll. „West oder Ost“ lässt sich nicht innerhalb eines Landesteils rechnen.
      const unordered = card.level === 'nominal' && card.id !== 'eastwest';
      out[view][card.id] = Object.fromEntries(CURRENCIES.map(m => [m, (card.id === 'eastwest' && (view === 'west' || view === 'ost')) || (unordered && m !== 'V') ? NaN : MEASURES[m].fn(y, x, w)])) as Reveal[View][CardId];
    }
  }
  return out;
}

/** Rangplätze nach Betrag (1 = stärkster Zusammenhang); nicht berechenbare Werte bekommen keinen Platz. */
export function ranks(values: Partial<Record<CardId, number>>): Partial<Record<CardId, number>> {
  const sorted = (Object.entries(values) as [CardId, number][]).filter(([, v]) => Number.isFinite(v)).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));
  return Object.fromEntries(sorted.map(([id], i) => [id, i + 1]));
}

export function revealNotes(r: Reveal, view: View): string[] {
  const byCurrency = Object.fromEntries(CURRENCIES.map(m => [m, ranks(Object.fromEntries(CARD_IDS.map(id => [id, r[view][id][m]])))])) as Record<typeof CURRENCIES[number], Partial<Record<CardId, number>>>;
  const notes: string[] = [];
  let jump: { id: CardId; from: number; to: number; m: string } | null = null;
  for (const id of CARD_IDS) for (const m of ['gamma', 'tau', 'r'] as const) {
    const a = byCurrency.V[id], b = byCurrency[m][id];
    if (a && b && (!jump || Math.abs(b - a) > Math.abs(jump.to - jump.from))) jump = { id, from: a, to: b, m: measureLabel(m) };
  }
  if (jump) notes.push(`${cardById[jump.id].title} steht bei V auf Platz ${jump.from}, bei ${jump.m} auf Platz ${jump.to}.`);
  const joker = CARDS.find(c => c.joker);
  if (joker && CURRENCIES.every(m => byCurrency[m][joker.id] === 1)) notes.push(`Der Joker „${cardById[joker.id].title}“ steht nach allen vier Maßen auf Platz 1 – kein Wunder: Er misst fast dasselbe wie die Demokratiezufriedenheit.`);
  const without = Object.fromEntries(CURRENCIES.map(m => [m, ranks(Object.fromEntries(CARD_IDS.filter(id => !cardById[id].joker).map(id => [id, r[view][id][m]])))])) as typeof byCurrency;
  const firsts = CARD_IDS.filter(id => !cardById[id].joker && CURRENCIES.every(m => without[m][id] === 1));
  if (firsts.length) notes.push(`Unter den übrigen Kandidaten steht nur ${cardById[firsts[0]].title} nach allen vier Maßen vorn.`);
  if (view === 'weighted') {
    // Diese beiden Bemerkungen gelten nur, wenn die Daten es hergeben (auf dem ALLBUS 2023: ja).
    const age = r.weighted.age.r, ageU = r.unweighted.age.r;
    if (Math.sign(r.west.age.r) !== Math.sign(r.ost.age.r)) notes.push(`Mit Gewicht ändert sich r für das Alter von ${fmt(ageU)} auf ${fmt(age)}: In West (${fmt(r.west.age.r)}) und Ost (${fmt(r.ost.age.r)}) zeigt der Zusammenhang in verschiedene Richtungen, ungewichtet rechnet die Ost-Überquote das gegeneinander auf.`);
    const ew = r.weighted.eastwest, ewU = r.unweighted.eastwest;
    if (Math.abs(ew.gamma - ewU.gamma) < 0.01 && Math.abs(ew.V - ewU.V) >= 0.02) notes.push(`Für West oder Ost bleibt Gamma mit Gewicht fast gleich (${fmt(ewU.gamma)} → ${fmt(ew.gamma)}), V nicht (${fmt(ewU.V)} → ${fmt(ew.V)}).`);
  }
  return notes;
}

/* ---------- Rang-Tipp vor der Enthüllung ---------- */

/** Eines der vier Maße der Rangliste (Typname aus früheren Fassungen). */
export type Currency = typeof CURRENCIES[number];
/** Womit der Tipp verglichen wird: das eigene Maß (Phi wie V, Spearman-ρ wie Tau-b – beide nutzen dieselbe Information). */
export const COMPARE_BY: Record<MeasureId, Currency> = { V: 'V', phi: 'V', gamma: 'gamma', tau: 'tau', rho: 'tau', r: 'r' };

/** Ausgangsreihenfolge des Tipps: alphabetisch nach Titel – verrät nichts über die Rangliste. */
export const defaultGuess = (): CardId[] => [...CARD_IDS].sort((a, b) => cardById[a].title.localeCompare(cardById[b].title, 'de'));

/** Eine Karte im Tipp verschieben (von Platz from auf Platz to, 0-basiert). */
export function moveGuess(order: CardId[], from: number, to: number): CardId[] {
  if (from === to || from < 0 || to < 0 || from >= order.length || to >= order.length) return order;
  const next = [...order];
  const [id] = next.splice(from, 1);
  next.splice(to, 0, id);
  return next;
}

const isGuess = (x: unknown): x is CardId[] =>
  Array.isArray(x) && x.length === CARD_IDS.length && CARD_IDS.every(id => x.includes(id));

export type GuessRow = { id: CardId; tip: number | null; place: number | null; shift: number | null };
/** Tipp neben der echten Rangliste. Hat eine Karte in diesem Maß keinen Platz, zählen beide Seiten ohne sie:
 *  tip = Platz im eigenen Tipp unter den Karten mit Platz (so steht er auch in der Liste), place = echter Platz, shift > 0 heißt „steht weiter oben als getippt“.
 *  Karten ohne Platz haben weder tip noch shift. */
export function guessRows(guess: CardId[], r: Reveal, view: View, currency: Currency): GuessRow[] {
  const real = ranks(Object.fromEntries(CARD_IDS.map(id => [id, r[view][id][currency]])));
  const placed = guess.filter(id => real[id]);
  return guess.map(id => {
    const place = real[id] ?? null;
    const tip = place ? placed.indexOf(id) + 1 : null;
    return { id, tip, place, shift: place && tip ? tip - place : null };
  });
}

/** Warum eine Karte in einer Ansicht keinen Platz hat. */
export function noPlaceReason(id: CardId, view: View): string {
  if (id === 'eastwest' && (view === 'west' || view === 'ost')) return 'innerhalb eines Landesteils nicht berechenbar';
  return 'keine Reihenfolge der Kategorien, darum nur mit Cramér-V';
}

/** Hinweis über der Vergleichsliste, wenn Karten ohne Platz herausfallen: Dann ist auch der Tipp ohne sie durchgezählt. */
export function reducedNote(rows: GuessRow[], view: View, currency: Currency): string | null {
  const out = rows.filter(x => x.place === null).map(x => x.id);
  if (!out.length || out.length === rows.length) return null;
  const names = out.map(id => `„${cardById[id].title}“ (${noPlaceReason(id, view)})`).join(' und ');
  const n = rows.length - out.length;
  return `${names} ${out.length === 1 ? 'hat' : 'haben'} nach ${measureLabel(currency)} (${VIEW_LABELS[view]}) keinen Platz. Darum zählen hier beide Seiten nur ${n} Karten: Dein Tipp ist ohne ${out.length === 1 ? 'diese Karte' : 'diese Karten'} neu durchgezählt, die Karten darunter rücken auf.`;
}

const meanOff = (rows: GuessRow[]) => {
  const placed = rows.filter(x => x.shift !== null);
  return placed.length ? placed.reduce((a, x) => a + Math.abs(x.shift!), 0) / placed.length : NaN;
};

/** Rückmeldung zum Tipp: wie weit daneben, wie viele genau, welche Karte am meisten überrascht – und dass die Rangliste vom Maß abhängt. */
export function compareRankGuess(guess: CardId[], r: Reveal, view: View, currency: Currency): Note[] {
  if (!isGuess(guess)) return [];
  const rows = guessRows(guess, r, view, currency), off = meanOff(rows);
  if (!Number.isFinite(off)) return [{ tone: 'hint', text: `Nach ${measureLabel(currency)} (${VIEW_LABELS[view]}) hat keine Karte einen Platz. Wähl ein anderes Maß zum Vergleich.` }];
  const exact = rows.filter(x => x.shift === 0).length;
  const unplaced = rows.filter(x => x.place === null).map(x => cardById[x.id].title);
  const without = unplaced.length ? ` (gezählt ohne ${unplaced.join(' und ')})` : '';
  const notes: Note[] = [{ tone: off <= 1.5 ? 'ok' : 'hint',
    text: `Nach ${measureLabel(currency)} (${VIEW_LABELS[view]}) liegt dein Tipp im Mittel ${de(off, 1)} Plätze daneben. ${exact === 0 ? 'Keine Karte hast du' : exact === 1 ? 'Eine Karte hast du' : `${exact} Karten hast du`} genau getroffen.` }];
  const surprise = rows.filter(x => x.shift !== null).sort((a, b) => Math.abs(b.shift!) - Math.abs(a.shift!))[0];
  if (surprise && surprise.shift !== 0) notes.push({ tone: 'hint',
    text: `Am meisten überrascht ${cardById[surprise.id].title}: getippt auf Platz ${surprise.tip}, tatsächlich Platz ${surprise.place}${without}.` });
  const others = CURRENCIES.map(m => [m, meanOff(guessRows(guess, r, view, m))] as const).filter(([, x]) => Number.isFinite(x));
  if (others.length > 1) notes.push({ tone: 'hint',
    text: `Im Mittel daneben je Maß: ${others.map(([m, x]) => `${measureLabel(m)} ${de(x, 1)}`).join(' · ')} Plätze. Die Rangliste hängt vom Maß ab.` });
  if (unplaced.length) notes.push({ tone: 'hint', text: `Ohne Platz nach ${measureLabel(currency)}: ${unplaced.join(', ')}. ${unplaced.length === 1 ? 'Diese Karte zählt' : 'Diese Karten zählen'} hier nicht mit – weder im Tipp noch in der Rangliste.` });
  return notes;
}

/* ---------- Gegenfrage, Zustand, Karte, R-Code ---------- */

export const DRIVER_WORDS = /\b(treib\w*|Treiber|bewirk\w*|verursach\w*|weil|führt|führen|sorgt|macht\s+\w+\s+zufrieden)\b/i;

export function driverQuestion(text: string): Note[] {
  return DRIVER_WORDS.test(text)
    ? [{ tone: 'hint', text: 'Du schreibst von einer Ursache. Zeigt ein Zusammenhangsmaß, was was bewirkt? Welche Drittvariable könnte beides beeinflussen – und kann die Richtung auch umgekehrt sein?' }]
    : [];
}

export type S05State = {
  mode: WorkMode;
  card: CardId | null;
  level: Level | '';
  measure: MeasureId | '';
  weighted: boolean;
  value: string;
  strata: string[];
  stamp: Stamp | '';
  sentence: string;
  second: { measure: MeasureId | ''; value: string; unweighted: string; veto: boolean };
  view: View;
  recommendation: string;
  /** Skalenniveau der Demokratiezufriedenheit (ps03) im Entscheidungspfad. */
  outcomeLevel: Level | '';
  /** Rang-Tipp vor der Enthüllung: alle Karten, stärkster Zusammenhang zuerst; leer = noch nicht sortiert. */
  rankGuess: CardId[];
  rankLocked: boolean;
};

export const initialS05 = (): S05State => ({
  mode: 'solo', card: null, level: '', measure: '', weighted: true, value: '', strata: ['', '', ''], stamp: '', sentence: '',
  second: { measure: '', value: '', unweighted: '', veto: false }, view: 'weighted', recommendation: '',
  outcomeLevel: '', rankGuess: [], rankLocked: false,
});

/** Maß wählen. Wählt man das Maß, das schon als zweites Maß steht, wird das zweite Maß samt Wert geleert – sonst stünde dasselbe Maß zweimal da. */
export const chooseMeasure = (s: S05State, measure: MeasureId | ''): S05State =>
  measure && measure === s.second.measure ? { ...s, measure, second: { ...s.second, measure: '', value: '' } } : { ...s, measure };

/** Neue Karte: alles, was an der Karte hängt, beginnt von vorn; nur die Arbeitsform bleibt. */
export const pickCard = (s: S05State, card: CardId | null): S05State => ({ ...initialS05(), mode: s.mode, card });

/** Zufällige Karte, nie dieselbe wie gerade – sonst ginge fertige Arbeit verloren. */
export function randomCard(current: CardId | null, next: () => number = Math.random): CardId {
  const pool = CARD_IDS.filter(id => id !== current);
  return pool[Math.min(pool.length - 1, Math.floor(next() * pool.length))];
}

export function parseS05(raw: unknown): S05State {
  const r = record(raw), sec = record(r.second), strataRaw = Array.isArray(r.strata) ? r.strata : [];
  return {
    mode: oneOf(r.mode, WORK_MODES, 'solo'),
    card: typeof r.card === 'string' && (CARD_IDS as string[]).includes(r.card) ? r.card as CardId : null,
    level: oneOf(r.level, ['nominal', 'ordinal', 'metrisch', ''] as const, ''),
    measure: oneOf(r.measure, [...MEASURE_IDS, ''] as const, ''),
    weighted: bool(r.weighted, true), value: str(r.value, 12),
    strata: [0, 1, 2].map(i => str(strataRaw[i], 12)),
    stamp: oneOf(r.stamp, [...STAMPS, ''] as const, ''), sentence: str(r.sentence, 600),
    second: { measure: oneOf(sec.measure, [...MEASURE_IDS, ''] as const, ''), value: str(sec.value, 12), unweighted: str(sec.unweighted, 12), veto: bool(sec.veto) },
    view: oneOf(r.view, VIEWS, 'weighted'), recommendation: str(r.recommendation, 800),
    outcomeLevel: oneOf(r.outcomeLevel, ['nominal', 'ordinal', 'metrisch', ''] as const, ''),
    rankGuess: isGuess(r.rankGuess) ? [...r.rankGuess] : [],
    rankLocked: bool(r.rankLocked) && isGuess(r.rankGuess),
  };
}

export function statusS05(s: S05State): TaskStatus {
  if (s.card && s.measure && s.value.trim() && s.stamp && s.sentence.trim() && s.recommendation.trim()) return 'done';
  return s.card || s.level || s.measure || s.value.trim() || s.sentence.trim() || s.recommendation.trim() ? 'running' : 'open';
}

export function plenumLines(s: S05State): [string, string][] {
  const card = s.card ? cardById[s.card] : null;
  return [
    ['Kandidat', card ? `${card.title} (${card.id})` : ''],
    ['Maß = Wert · Urteil', s.measure && s.value.trim() ? `${measureLabel(s.measure)} = ${s.value.trim()}${s.stamp ? ` · ${s.stamp}` : ''}` : ''],
    ['Zweites Maß', s.second.measure && s.second.value.trim() ? `${measureLabel(s.second.measure)} = ${s.second.value.trim()}` : ''],
    ['„Treiber“?', s.second.veto ? 'Veto: kein Treiber' : ''],
    ['Satz für den Fonds', s.sentence.trim()],
    ['Empfehlung', s.recommendation.trim()],
    ['Tipp: die ersten drei', s.rankLocked ? s.rankGuess.slice(0, 3).map(id => cardById[id].title).join(', ') : ''],
  ];
}

/* Schriftbild (docs/AUFGABEN-LEITFADEN.md, „Schriftbild“): jeder Block mit Überschrift als Kommentar darüber,
   %>% am Zeilenende, jede Funktion in eigener Zeile, mutate( mit einer Variable je Zeile, Leerzeile zwischen den Blöcken. */

/** Ein Block: Kommentarzeile(n) über dem Code. */
const block = (comment: string, code: string) => `# ${comment}\n${code}`;
const blocks = (...parts: string[]) => parts.join('\n\n');

/** Neue Variablen: mutate( endet die Zeile, je Variable eine Zeile, die = untereinander, die Klammer allein. */
const mutateCode = (vars: [string, string][]) => {
  const width = Math.max(...vars.map(([name]) => name.length));
  return `allbus <- allbus %>%\n  mutate(\n${vars.map(([name, expr]) => `    ${name.padEnd(width)} = ${expr}`).join(',\n')}\n  )`;
};
/** Ein Maß: Datensatz vorn, (filter() und) Maß je in eigener Zeile. */
const measureCode = (fn: string, args: string, filter?: string) =>
  `allbus %>%\n${filter ? `  filter(${filter}) %>%\n` : ''}  ${fn}(${args})`;

/** Einlesen, ps03 umpolen und die Karte umkodieren – im Schriftbild wie im Werkzeugkasten. */
export function rSetupFor(card: Card): string {
  const vars: [string, string][] = [['zufriedenheit', 'rec(ps03, rules = "rev")']];
  if (card.recode) vars.push([card.id, `rec(${card.source}, rules = "${card.recode.rules}")`]);
  return blocks(R_SETUP,
    block(`Codebuch öffnen: mit Strg/Cmd + F nach ps03 und ${card.source} suchen`, 'codebook(allbus)'),
    block(card.recode ? 'ps03 umpolen (höher = zufriedener) und den Kandidaten umkodieren' : 'ps03 umpolen: höher = zufriedener', mutateCode(vars)));
}

const mainFn = (card: Card) => (card.level === 'nominal' ? 'cramers_v' : card.level === 'ordinal' ? 'kendall_tau' : 'pearson_cor');

/** Schritt 3: das Maß gewichtet, für ganz Deutschland. */
export function rMeasureFor(card: Card): string {
  const args = `zufriedenheit, ${card.id}, weights = wghtpew`;
  return card.level === 'nominal'
    ? blocks(block('Schritt 3: Cramér-V, gewichtet', measureCode('cramers_v', args)),
      ...(card.id === 'eastwest' ? [block('Schritt 3: Gamma für ganz Deutschland, gewichtet – zum Vergleich mit Schritt 4', measureCode('goodman_gamma', args))] : []))
    : card.level === 'ordinal'
      ? blocks(block('Schritt 3: Gamma, gewichtet', measureCode('goodman_gamma', args)), block('Schritt 3: Tau-b, gewichtet', measureCode('kendall_tau', args)))
      : block('Schritt 3: Pearson-r, gewichtet', measureCode('pearson_cor', args));
}

/** Schritt 4: West und Ost getrennt – bei „West oder Ost“ innerhalb gleicher Wirtschaftslage. */
export function rSplitFor(card: Card): string {
  if (card.id === 'eastwest') return blocks(
    block('Schritt 4: die Wirtschaftslage in drei Gruppen (lage)', mutateCode([['lage', `rec(ep01, rules = "${LAGE.rules}")`]])),
    ...LAGE.groups.map((label, g) => block(`Schritt 4: Gamma in der Gruppe „${label}“ (lage ${g + 1})`, measureCode('goodman_gamma', 'zufriedenheit, eastwest', `lage == ${g + 1}`))));
  const fn = mainFn(card), args = `zufriedenheit, ${card.id}`;
  return blocks(
    block('Schritt 4: dasselbe Maß wie in Schritt 3, nur im Westen (eastwest 1)', measureCode(fn, args, 'eastwest == 1')),
    block('Schritt 4: dasselbe Maß, nur im Osten (eastwest 2)', measureCode(fn, args, 'eastwest == 2')));
}

/** Vollständiges R-Skript für eine Karte (Lösung in der Hilfe und Skript zum Mitnehmen). */
export function rCodeFor(card: Card): string {
  return blocks(rSetupFor(card), rMeasureFor(card), rSplitFor(card),
    block('Schritt 6: dasselbe Maß ohne Gewicht', measureCode(mainFn(card), `zufriedenheit, ${card.id}`)));
}

/** Lückencode für Schritt 3: Umpolen und das Maß mit Gewicht. */
export function scaffoldFor(card: Card): string {
  const vars: [string, string][] = [['zufriedenheit', 'rec(ps03, rules = "___")']];
  if (card.recode) vars.push([card.id, `rec(${card.source}, rules = "___")`]);
  const fn = card.level === 'nominal' ? 'cramers_v' : card.level === 'ordinal' ? 'goodman_gamma' : 'pearson_cor';
  return blocks(
    block(card.recode ? 'ps03 umpolen und den Kandidaten umkodieren' : 'ps03 umpolen', mutateCode(vars)),
    block('dein Maß, gewichtet: Was kommt hinter weights = ?', measureCode(fn, `zufriedenheit, ${card.id}, weights = ___`)));
}

/** Lückencode für Schritt 4. */
export function splitScaffoldFor(card: Card): string {
  if (card.id === 'eastwest') return blocks(
    block('die Wirtschaftslage in drei Gruppen (lage)', mutateCode([['lage', 'rec(ep01, rules = "___")']])),
    block('Gamma in einer Gruppe – für jede der drei Gruppen wiederholen', measureCode('goodman_gamma', 'zufriedenheit, ___', 'lage == ___')));
  const args = `zufriedenheit, ${card.id}`;
  return blocks(
    block('nur im Westen: dein Maß aus Schritt 3', measureCode('___', args, 'eastwest == ___')),
    block('nur im Osten: dasselbe Maß', measureCode('___', args, 'eastwest == ___')));
}

/** Zweites Maß für die Lösung in Schritt 6, wenn noch keins gewählt ist: ein anderes passendes Maß. */
export function fallbackSecond(card: Card, first: MeasureId | ''): MeasureId {
  if (card.id === 'eastwest') return first === 'gamma' ? 'V' : 'gamma';
  if (card.level === 'nominal') return first === 'phi' ? 'V' : 'phi';
  return LEVEL_MEASURES[card.level].find(m => m !== (first || mainMeasure(card)))!;
}
const mainMeasure = (card: Card): MeasureId => (card.level === 'nominal' ? 'V' : card.level === 'ordinal' ? 'tau' : 'r');

/** Schritt 6: Lückencode (blank) oder Lösung für ein zweites Maß (gewichtet) und das erste Maß ohne Gewicht. */
export function checkCodeFor(card: Card, first: MeasureId | '', second: MeasureId | '', blank: boolean): string {
  const one = first || mainMeasure(card), two = second || fallbackSecond(card, first);
  const phiNote = two === 'phi' && card.id !== 'eastwest' ? ' – Phi ist für 2 × 2 gedacht, hier nur zum Vergleich' : '';
  return blank
    ? blocks(block('zweites Maß, gewichtet: Welche Funktion?', measureCode('___', `zufriedenheit, ${card.id}, weights = wghtpew`)),
      block('dein erstes Maß ohne Gewicht: Welche Funktion? Vergleiche mit oben: Was fehlt hier?', measureCode('___', `zufriedenheit, ${card.id}`)))
    : blocks(block(`zweites Maß, gewichtet${phiNote}`, measureCode(MEASURES[two].r, `zufriedenheit, ${card.id}, weights = wghtpew`)),
      block('dein erstes Maß ohne Gewicht', measureCode(MEASURES[one].r, `zufriedenheit, ${card.id}`)));
}

/* ---------- Einstieg: Zusammenhang anfassen (Gesundheit × Demokratiezufriedenheit, je drei Stufen) ---------- */

/** Stufen der Tafel, von „wenig“ nach „viel“: Zeilen Gesundheit (hs01), Spalten Zufriedenheit mit der Demokratie (ps03 umgepolt). */
export const BOARD_ROWS = ['schlecht', 'mittel', 'gut'] as const;
export const BOARD_COLS = ['unzufrieden', 'teils/teils', 'zufrieden'] as const;
/** In R: mutate(gesundheit3 = rec(hs01, rules = "4:5=1; 3=2; 1:2=3; else=NA"), zufriedenheit3 = rec(ps03, rules = "5:6=1; 3:4=2; 1:2=3; else=NA")). */
const healthGroup = (v: number) => (v >= 4 && v <= 5 ? 0 : v === 3 ? 1 : v >= 1 && v <= 2 ? 2 : -1);
const satisfactionGroup = (v: number) => (v >= 5 && v <= 6 ? 0 : v >= 3 && v <= 4 ? 1 : v >= 1 && v <= 2 ? 2 : -1);

/** Die echte 3 × 3-Tafel aus dem ALLBUS (ungewichtet). */
export function boardTable(p: Prepared): number[][] {
  const hs = validValues(p.sav.byName.get('hs01')!), cells = BOARD_ROWS.map(() => BOARD_COLS.map(() => 0));
  for (let i = 0; i < hs.length; i++) {
    const r = healthGroup(hs[i]), c = satisfactionGroup(p.yOrig[i]);
    if (r >= 0 && c >= 0) cells[r][c] += 1;
  }
  return cells;
}

export type BoardMeasures = Record<'V' | 'gamma' | 'tau' | 'r', number>;
/** Maße der Tafel – mit denselben Funktionen wie die Aufgabe. Jede Zelle zählt so oft, wie Befragte darin sind;
 *  `rowOrder`/`colOrder` sagen, welche Stufe an welcher Stelle steht (Code = Position + 1). */
export function boardMeasures(cells: number[][], rowOrder: number[] = [0, 1, 2], colOrder: number[] = [0, 1, 2]): BoardMeasures {
  const x: number[] = [], y: number[] = [];
  rowOrder.forEach((r, ri) => colOrder.forEach((c, ci) => { for (let k = 0; k < cells[r][c]; k++) { x.push(ri + 1); y.push(ci + 1); } }));
  const safe = (v: number) => (Number.isFinite(v) ? v : 0);
  return { V: safe(MEASURES.V.fn(x, y, null)), gamma: safe(MEASURES.gamma.fn(x, y, null)), tau: safe(MEASURES.tau.fn(x, y, null)), r: safe(MEASURES.r.fn(x, y, null)) };
}

/** Dieselben Randsummen, aber ohne jeden Zusammenhang: jede Zelle = Zeilensumme × Spaltensumme / n.
 *  Gerundet wird je Zeile nach den größten Resten – so bleibt jede Zeilensumme exakt, die Spaltensummen weichen höchstens um 1 ab. */
export function independentBoard(cells: number[][]): number[][] {
  const rows = cells.map(r => r.reduce((a, b) => a + b, 0)), cols = cells[0].map((_, j) => cells.reduce((a, r) => a + r[j], 0));
  const n = rows.reduce((a, b) => a + b, 0);
  if (n === 0) return cells.map(r => r.map(() => 0));
  return rows.map(rs => {
    const exact = cols.map(cs => rs * cs / n), out = exact.map(Math.floor);
    let rest = rs - out.reduce((a, b) => a + b, 0);
    for (const j of exact.map((e, j) => j).sort((a, b) => (exact[b] - out[b]) - (exact[a] - out[a]))) { if (rest-- <= 0) break; out[j] += 1; }
    return out;
  });
}
