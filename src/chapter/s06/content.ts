// Sitzung 6 „Gewichtung und Zusammenhang“: Zahlen, Vorlagen und Fragen aus sitzung06.md (Stand 23.11.2026), nur Daten.
// Alle Zahlen: ALLBUS 2023, ZA8831 v1.3.0, gewichtet mit wghtpew (ungewichtet nur zum Vergleich), nur Aggregate.
// Geprüft in allbus.local.test.ts; konstruierte Beispiele (100 Befragte, fünf Personen, acht Personen) in content.test.ts.
import type { Question } from '../answers';
import { parseMarks } from '../workshop/editor';
import { de } from './figures/util';

/* ---------- Daten: Gewichtung (Vorweg, Grundlage 1, Aufgabe 1) ---------- */

/** eastwest: Befragte und Anteile, ungewichtet und gewichtet (Summe der Gewichte). */
export const EASTWEST = {
  total: 5246,
  west: { n: 3567, pct: 67.99, wSum: 4363, wPct: 83.16 },
  east: { n: 1679, pct: 32.01, wSum: 883, wPct: 16.84 },
};

/** wghtpew: Spannen je Landesteil (zwei Stellen), je drei Werte, Mittel genau 1. */
export const WGHTPEW = { westFrom: 1.2, westTo: 1.25, eastFrom: 0.5, eastTo: 0.55, valuesPerPart: 3, mean: 1 };
/** Gewicht = Anteil in Deutschland / Anteil in der Stichprobe, zwei Stellen. */
export const WEIGHT = { west: 1.22, east: 0.53 };

/** rd01 = 6 („keine“ Konfession) gegen Mitglied, Zeilenprozente je Landesteil; gewichtete Zellen gerundet wie in crosstab(). */
export const NONE = {
  west: { pct: 33.7, wNone: 1440, wN: 4278 },
  east: { pct: 77.4, wNone: 670, wN: 864 },
  all: { pct: 47.7, wPct: 41.0 },
  /** gewichtete Quoten auf eine Stelle (Marken im Mischpult) */
  wWestPct: 33.7,
  wEastPct: 77.5,
};
/** Quoten „keine Konfession“, gewichtet, ungerundet (Mischpult rechnet damit). */
export const NONE_WEST = NONE.west.wNone / NONE.west.wN * 100;
export const NONE_EAST = NONE.east.wNone / NONE.east.wN * 100;
/** Mischpult: Gesamtanteil „keine Konfession“, wenn der Ost-Anteil an allen p (0 bis 1) ist. */
export const mix = (p: number) => (1 - p) * NONE_WEST + p * NONE_EAST;
/** Ost-Anteil an allen mit gültiger Konfession: ungewichtet (wie im ALLBUS) und gewichtet (wie in Deutschland), in %. */
export const MIX_P = { sample: 32.0, germany: 16.8 };

/** Aufgabe 1: ps03, Cum. % in Zeile 3 (Codes 1 bis 3), ungewichtet und gewichtet, gesamt und je Landesteil. */
export const PS03 = {
  valid: 3621, wValid: 3619, split: 1596, missing: 1625,
  cum3: 70.73, wCum3: 73.58,
  east: { cum3: 58.45, wCum3: 58.56, valid: 1177, wValid: 611 },
  west: { cum3: 76.64, wCum3: 76.63, valid: 2444, wValid: 3008 },
};

/* ---------- Daten: Grundlage 2 und Aufgabe 2 ---------- */

/** Konstruiertes Beispiel: 100 Befragte, Zeilen West/Ost, Spalten Mitglied/keine. */
export const TABLE_100 = { rows: ['West', 'Ost'], cols: ['Mitglied', 'keine'], observed: [[52, 28], [4, 16]] };

/** Konfession und Region, gewichtet (Zeilenprozente) und die Maße dazu. */
export const KONF = {
  groups: ['evangelisch', 'katholisch', 'andere', 'keine'],
  west: [28.4, 31.0, 7.0, 33.7],
  east: [14.7, 4.7, 3.0, 77.5],
  phi: { weighted: 0.33, unweighted: 0.41 },
  v: { weighted: 0.34, unweighted: 0.42 },
};

/** Aufgabe 2: zufrieden (1 bis 3) je Wahlabsicht pv01, Zeilenprozente gewichtet; n = gewichtete Gruppengröße. */
export const PARTIES: { code: number; label: string; pct: number; n: number }[] = [
  { code: 1, label: 'CDU-CSU', pct: 79.5, n: 716 },
  { code: 2, label: 'SPD', pct: 87.2, n: 562 },
  { code: 3, label: 'FDP', pct: 80.7, n: 243 },
  { code: 4, label: 'DIE GRUENEN', pct: 92.9, n: 574 },
  { code: 6, label: 'DIE LINKE', pct: 61.6, n: 146 },
  { code: 42, label: 'AFD', pct: 22.8, n: 268 },
  { code: 90, label: 'ANDERE PARTEI', pct: 51.6, n: 124 },
  { code: 91, label: 'WUERDE NICHT WAEHLEN', pct: 50.7, n: 142 },
];
export const A2 = { allPct: 74.8, nValid: 2775, v: 0.4783, vUnweighted: 0.484, vSixLevels: 0.248 };
/** Probier-Werkstatt A2: Zufriedenheit nach Landesteil. */
export const A2_TRY = { west: 76.6, east: 58.6, phi: -0.153 };

/* ---------- Daten: Grundlage 3 und Aufgabe 3 ---------- */

/** Fünf Personen A bis E: Schicht (1 bis 4) und Gesundheit (1 schlecht bis 4 gut). */
export const PERSONS: { name: string; layer: number; health: number }[] = [
  { name: 'A', layer: 1, health: 1 },
  { name: 'B', layer: 2, health: 3 },
  { name: 'C', layer: 3, health: 2 },
  { name: 'D', layer: 3, health: 4 },
  { name: 'E', layer: 4, health: 3 },
];
export type PairKind = 'gleichläufig' | 'gegenläufig' | 'Gleichstand Schicht' | 'Gleichstand Gesundheit';

/** Schicht (id02) und Gesundheit (hs01), gewichtet; „umgedreht“ heißt höher = besser. */
export const HS_ID = { gamma: 0.357, tau: 0.241, nTau: 5151 };
/** Gesundheit je Schicht in %, gewichtet, von schlecht bis sehr gut; n gewichtet. */
export const LAYER_STACK: { label: string; pct: number[]; n: number }[] = [
  { label: 'Unterschicht', pct: [17.6, 34.6, 24.9, 14.1, 8.8], n: 205 },
  { label: 'Arbeiterschicht', pct: [5.6, 17.0, 32.2, 34.2, 11.1], n: 1153 },
  { label: 'Mittelschicht', pct: [2.3, 9.9, 28.9, 42.7, 16.2], n: 2862 },
  { label: 'obere Mittelschicht', pct: [1.4, 3.7, 18.1, 46.8, 30.0], n: 871 },
  { label: 'Oberschicht', pct: [0.0, 3.2, 24.2, 33.9, 38.7], n: 62 },
];
export const HEALTH_LEVELS = ['schlecht', 'weniger gut', 'zufriedenstellend', 'gut', 'sehr gut'];
/** Gamma Konfession × Gesundheit in drei Reihenfolgen; V bleibt. */
export const KONF_ORDER = { gammas: [0.04, 0.01, -0.03], v: 0.045 };

/** Aufgabe 3: zufriedenheit (umgepolt) × ep01. */
export const A3 = { gamma: -0.5444, tau: -0.387, gammaUnweighted: -0.553, tauUnweighted: -0.393, n: 3593, tauEp03: -0.249 };
/** Zufriedene (1 bis 3) je Einschätzung der Wirtschaftslage, gewichtet. */
export const EP01_SATISFIED = [
  { label: 'sehr gut', pct: 95.7 }, { label: 'gut', pct: 90.1 }, { label: 'teils/teils', pct: 76.9 },
  { label: 'schlecht', pct: 45.6 }, { label: 'sehr schlecht', pct: 14.0 },
];

/* ---------- Daten: Grundlage 4 und Aufgabe 4 ---------- */

/** Acht Befragte A bis H: Alter und Minuten für den Fragebogen. */
export const LAB_PEOPLE: { name: string; age: number; minutes: number }[] = [
  { name: 'A', age: 22, minutes: 45 }, { name: 'B', age: 29, minutes: 50 }, { name: 'C', age: 35, minutes: 48 },
  { name: 'D', age: 41, minutes: 60 }, { name: 'E', age: 48, minutes: 58 }, { name: 'F', age: 56, minutes: 66 },
  { name: 'G', age: 63, minutes: 70 }, { name: 'H', age: 71, minutes: 75 },
];
/** Stufen für die Minuten von Person B mit r und ρ (drei Stellen) und dem Satz dazu. */
export const LAB_STEPS: { minutes: number; r: number; rho: number; text: string }[] = [
  { minutes: 50, r: 0.974, rho: 0.952, text: 'Fast alle Punkte liegen in den Plus-Feldern: starker positiver Zusammenhang.' },
  { minutes: 76, r: 0.597, rho: 0.476, text: 'B braucht jetzt am längsten von allen, obwohl B zu den Jüngsten gehört. r fällt deutlich, ρ auch, denn bei den Minuten springt B vom drittkleinsten auf den größten Rangplatz.' },
  { minutes: 100, r: 0.207, rho: 0.476, text: 'B liegt weit oben im Minus-Feld. r bricht ein; ρ bleibt, denn B ist ja schon die Langsamste.' },
  { minutes: 200, r: -0.205, rho: 0.476, text: 'Ein einziger Punkt dreht r ins Negative.' },
  { minutes: 500, r: -0.335, rho: 0.476, text: '' },
  { minutes: 1500, r: -0.377, rho: 0.476, text: 'Ein Bogen, der einen Tag herumlag: r zeigt jetzt einen negativen Zusammenhang, den die anderen sieben Personen gar nicht haben. ρ bleibt bei 0,476.' },
];
/** z-Werte und Produkte im Ausgangszustand (zwei Stellen, wie im Plan). */
export const LAB_Z = {
  age: [-1.39, -0.98, -0.62, -0.27, 0.14, 0.61, 1.02, 1.49],
  minutes: [-1.29, -0.83, -1.01, 0.09, -0.09, 0.64, 1.01, 1.47],
  products: [1.79, 0.81, 0.63, -0.03, -0.01, 0.39, 1.03, 2.2],
  sum: 6.81,
};

/** Alter × Bearbeitungsdauer xt10: r gewichtet, ρ; alle Bögen und nur bis 180 Minuten. */
export const AGE_XT10 = { rAll: 0.003, rhoAll: 0.238, r180: 0.245, rho180: 0.267, median: 65 };

/** Grundlage 4c: Internet (xr19) und gute oder sehr gute Gesundheit (hs01 1 bis 2), gewichtet. */
export const INTERNET = {
  all: { yes: 59.0, no: 24.0, phi: 0.22 },
  mid: { label: '60 bis 74 Jahre', yes: 48.3, no: 29.6, nYes: 867, nNo: 98, phi: 0.11 },
  old: { label: '75 und älter', yes: 35.5, no: 20.4, nYes: 310, nNo: 255, phi: 0.17 },
  use: [98.5, 89.8, 54.9],
  healthy: [67.2, 47.7, 29.1],
  valid: 3603,
  youngNo: 31,
};

/** Aufgabe 4: zufriedenheit (umgepolt) × ls01. */
export const A4 = { r: 0.265, rho: 0.268, rUnweighted: 0.26, west: 0.267, east: 0.239, pa01: -0.193, pa01West: -0.191, pa01East: -0.283 };

/** Überblick Ü3: fünf Maße für zufriedenheit × ep01, gewichtet (ρ ohne Gewicht). */
export const FIVE: { label: string; value: number }[] = [
  { label: 'Cramér-V', value: 0.28 },
  { label: 'Tau-b', value: -0.39 },
  { label: 'Spearman-ρ', value: -0.45 },
  { label: 'Pearson-r', value: -0.46 },
  { label: 'Gamma', value: -0.54 },
];

/* ---------- Codevorlagen ---------- */

export type Template = { title: string; code: string; tryOut?: boolean };
/** ⟦…⟧ markiert Stellen, die angepasst werden. Jede Vorlage läuft für sich mit dem frisch geladenen `allbus`. */
export const TEMPLATES: Record<string, Template> = {
  start: { title: 'Startblock', code: `# Pakete laden und Daten einlesen
library(tidyverse)
library(mariposa)

allbus <- read_spss("ZA8831_v1-3-0.sav")` },
  lesen_gewicht: { title: 'Wohnort ungewichtet und gewichtet', code: `# Wohnort West oder Ost: erst ungewichtet, dann gewichtet
allbus %>%
  frequency(eastwest)

allbus %>%
  frequency(eastwest, weights = wghtpew)` },
  lesen_mass: { title: 'Ein Zusammenhangsmaß', code: `# Ein Zusammenhangsmaß: zwei Variablen und das Gewicht in einer Klammer
allbus %>%
  kendall_tau(hs01, id02, weights = wghtpew)` },
  a1a: { title: 'Zufriedenheit ungewichtet und gewichtet', code: `# Zufriedenheit mit der Demokratie: erst ungewichtet, dann gewichtet
allbus %>%
  frequency(ps03)

allbus %>%
  frequency(ps03, weights = wghtpew)` },
  a1b: { title: 'Ein Landesteil, ungewichtet und gewichtet', code: `# Nur ein Landesteil (1 = West, 2 = Ost): erst ungewichtet, dann gewichtet
allbus %>%
  filter(eastwest == ⟦2⟧) %>%
  frequency(ps03)

allbus %>%
  filter(eastwest == ⟦2⟧) %>%
  frequency(ps03, weights = wghtpew)` },
  frei_a1: { tryOut: true, title: 'Deine Probier-Werkstatt', code: `# Eine Idee: Ändert die Gewichtung auch Mittelwert und Median?
allbus %>%
  describe(ps03)

allbus %>%
  describe(ps03, weights = wghtpew)
` },
  a2b: { title: 'Kreuztabelle mit Zeilenprozenten, gewichtet', code: `# Zufriedenheit in zwei Gruppen (1 bis 3 zufrieden, 4 bis 6 unzufrieden),
# dann Anteil Zufriedener je Wahlabsicht (Zeilenprozente), gewichtet
allbus %>%
  mutate(
    zufrieden = rec(ps03, rules = "1:3=1 [zufrieden]; 4:6=0 [unzufrieden]; else=NA")
  ) %>%
  crosstab(pv01, zufrieden, percentages = "row", weights = wghtpew)` },
  a2c: { title: 'Cramér-V, gewichtet', code: `# Cramér-V für Wahlabsicht und Zufriedenheit, gewichtet
# (zwei Gruppen bilden: kennst du aus Schritt 2)
allbus %>%
  mutate(
    zufrieden = rec(ps03, rules = "1:3=1 [zufrieden]; 4:6=0 [unzufrieden]; else=NA")
  ) %>%
  cramers_v(pv01, zufrieden, weights = wghtpew)` },
  frei_a2: { tryOut: true, title: 'Deine Probier-Werkstatt', code: `# Eine Idee: Zufriedenheit nach Landesteil, eine Vierfeldertafel mit Phi
allbus <- allbus %>%
  mutate(
    zufrieden = rec(ps03, rules = "1:3=1 [zufrieden]; 4:6=0 [unzufrieden]; else=NA")
  )

allbus %>%
  crosstab(eastwest, zufrieden, percentages = "row", weights = wghtpew)

allbus %>%
  phi(eastwest, zufrieden, weights = wghtpew)
` },
  a3a: { title: 'Zufriedenheit umpolen und prüfen', code: `# Zufriedenheit umpolen: höher heißt jetzt zufriedener
allbus <- allbus %>%
  mutate(
    zufriedenheit = rec(ps03, rules = "rev")
  )

# Kontrolle: Welches Wort steht jetzt bei Code 6?
allbus %>%
  frequency(zufriedenheit)` },
  a3b: { title: 'Gamma und Tau-b, gewichtet', code: `# Zufriedenheit umpolen: kennst du aus Schritt 1
allbus <- allbus %>%
  mutate(
    zufriedenheit = rec(ps03, rules = "rev")
  )

# Gamma für Zufriedenheit und Wirtschaftslage, gewichtet
allbus %>%
  goodman_gamma(zufriedenheit, ep01, weights = wghtpew)

# Tau-b für dieselben Variablen, gewichtet
allbus %>%
  kendall_tau(zufriedenheit, ep01, weights = wghtpew)` },
  frei_a3: { tryOut: true, title: 'Deine Probier-Werkstatt', code: `# Eine Idee: die eigene wirtschaftliche Lage (ep03) statt der Lage in Deutschland
allbus <- allbus %>%
  mutate(
    zufriedenheit = rec(ps03, rules = "rev")
  )

allbus %>%
  kendall_tau(zufriedenheit, ep03, weights = wghtpew)
` },
  a4a: { title: 'Umpolen und Punktwolke', code: `# Zufriedenheit umpolen (kennst du aus Aufgabe 3), dann die Punktwolke
allbus <- allbus %>%
  mutate(
    zufriedenheit = rec(ps03, rules = "rev")
  )

allbus %>%
  drop_na(ls01, zufriedenheit) %>%
  ggplot(aes(x = ls01, y = zufriedenheit)) +
  geom_jitter(alpha = 0.2)` },
  a4b: { title: 'Pearson-r und Spearman-ρ', code: `# Zufriedenheit umpolen: kennst du aus Aufgabe 3
allbus <- allbus %>%
  mutate(
    zufriedenheit = rec(ps03, rules = "rev")
  )

# Pearson r, gewichtet
allbus %>%
  pearson_cor(zufriedenheit, ls01, weights = wghtpew)

# Spearman rho zum Vergleich (rechnet ohne Gewicht)
allbus %>%
  spearman_rho(zufriedenheit, ls01)` },
  a4c: { title: 'Pearson-r in einem Landesteil', code: `# Pearson r in einem Landesteil (1 = West, 2 = Ost), gewichtet
# (Zufriedenheit umpolen: kennst du aus Aufgabe 3)
allbus %>%
  mutate(
    zufriedenheit = rec(ps03, rules = "rev")
  ) %>%
  filter(eastwest == ⟦1⟧) %>%
  pearson_cor(zufriedenheit, ls01, weights = wghtpew)` },
  frei_a4: { tryOut: true, title: 'Deine Probier-Werkstatt', code: `# Eine Idee: Links-rechts-Einstufung (pa01: 1 = links, 10 = rechts) und Zufriedenheit
allbus <- allbus %>%
  mutate(
    zufriedenheit = rec(ps03, rules = "rev")
  )

allbus %>%
  pearson_cor(zufriedenheit, pa01, weights = wghtpew)
` },
};

/* ---------- Antworten prüfen ---------- */

/** `short`: Name in der Rückmeldezeile; `help`: Hilfezeile unter dem Feld, Code in `Backticks`. */
type Extra = { short?: string; help?: string };
const choice = (id: string, label: string, options: [string, string][], target: string, right: string, hint: string, extra: Extra = {}): Question =>
  ({ id, label, kind: 'choice', options: options.map(([value, l]) => ({ value, label: l })), target, right, hint, ...extra });
const number = (id: string, label: string, target: number, right: string, hint: string, extra: Extra & { tolerance?: number } = {}): Question =>
  ({ id, label, kind: 'number', target, right, hint, ...extra });

const STRENGTH: [string, string][] = [['schwach', 'schwach'], ['mittel', 'mittel'], ['stark', 'stark']];

/** Antwortfragen der vier Aufgaben (Pflicht: A1 bis A3, Zusatz: A4). */
export const QUESTIONS: Record<'a1' | 'a2' | 'a3' | 'a4', Question[]> = {
  a1: [
    number('a1-ungewichtet', 'Wie viel Prozent sind ohne Gewicht mindestens etwas zufrieden (Codes 1 bis 3)?', 70.73,
      'Stimmt: 70,73 % haben 1, 2 oder 3 angegeben.', 'Lies in der ersten Tabelle von Schritt 1 die Spalte Cum. % in der Zeile 3 ETWAS ZUFRIEDEN.',
      { tolerance: 0.1, short: 'ohne Gewicht', help: 'Spalte Cum. %, Zeile 3, Tabelle ohne „Weighted“.' }),
    number('a1-gewichtet', 'Und mit Gewicht?', 73.58,
      'Stimmt: Mit Gewicht sind es 73,58 %, fast drei Prozentpunkte mehr.', 'Nimm die zweite Tabelle von Schritt 1, die mit „Weighted“ in der Überschrift.',
      { tolerance: 0.1, short: 'mit Gewicht', help: 'Spalte Cum. %, Zeile 3, Tabelle mit „Weighted“.' }),
    number('a1-ost', 'Wie viel Prozent sind im Osten mindestens etwas zufrieden?', 58.5,
      'Stimmt: Im Osten sind es 58,5 % (ohne Gewicht 58,45, mit Gewicht 58,56). Das Gewicht ändert hier fast nichts.', 'Führe Schritt 2 mit `eastwest == 2` aus und lies Cum. % in Zeile 3.',
      { tolerance: 0.1, short: 'Osten', help: 'Aus Schritt 2, `eastwest == 2`. Ob mit oder ohne Gewicht, zählt hier nicht.' }),
    number('a1-west', 'Und im Westen?', 76.6,
      'Stimmt: Im Westen sind es 76,6 %, gut 18 Prozentpunkte mehr als im Osten.', 'Tausche in Schritt 2 beide markierten Stellen gegen 1 und lies Cum. % in Zeile 3.',
      { tolerance: 0.1, short: 'Westen', help: 'Aus Schritt 2, `eastwest == 1`.' }),
    choice('a1-warum', 'Warum steigt der Anteil der Zufriedenen mit Gewicht?', [
      ['a', 'Im Osten sind weniger Menschen zufrieden, und mit Gewicht zählt der Osten nur so viel, wie es seinem Anteil an der Bevölkerung entspricht.'],
      ['b', 'Das Gewicht macht die Antworten jeder Person etwas zufriedener.'],
      ['c', 'Mit Gewicht zählen mehr Befragte, darum wird das Ergebnis höher.'],
    ], 'a',
    'Genau. Ohne Gewicht stammt ein Drittel der Antworten aus dem Osten, mit Gewicht nur ein Sechstel. Weil der Osten weniger zufrieden ist (58,5 % gegen 76,6 %), steigt der Anteil für ganz Deutschland.',
    'Vergleiche Ost und West aus Schritt 2: Wer ist zufriedener? Und welcher Landesteil zählt mit Gewicht weniger? Das Gewicht ändert keine Antwort und keine Personenzahl.',
    { short: 'Warum' }),
  ],
  a2: [
    choice('a2-niveau', 'Welches Skalenniveau hat die Wahlabsicht `pv01`?', [['nominal', 'nominal'], ['ordinal', 'ordinal'], ['metrisch', 'metrisch']], 'nominal',
      'Genau: Parteien haben keine Reihenfolge. Darum passt Cramér-V.', 'Lässt sich „SPD“ sinnvoll über oder unter „FDP“ einordnen? Kategorien ohne Reihenfolge heißen nominal.',
      { short: 'Skalenniveau' }),
    number('a2-gruene', 'Wie viel Prozent derer, die die Grünen wählen würden, sind mindestens etwas zufrieden?', 92.9,
      'Stimmt: 92,9 %.', 'Lies in Schritt 2 die Zeile DIE GRUENEN, darunter „row %“, Spalte zufrieden.',
      { tolerance: 0.1, short: 'Grüne', help: 'Zeile DIE GRUENEN, Zeile „row %“, Spalte zufrieden.' }),
    number('a2-afd', 'Und unter denen, die die AfD wählen würden?', 22.8,
      'Stimmt: 22,8 %. Zwischen den Gruppen liegen 70 Prozentpunkte.', 'Lies in Schritt 2 die Zeile AFD, darunter „row %“, Spalte zufrieden.',
      { tolerance: 0.1, short: 'AfD', help: 'Zeile AFD, Spalte zufrieden.' }),
    number('a2-v', 'Wie groß ist Cramér-V (gewichtet)?', 0.4783,
      'Stimmt: V = 0,478.', 'Führe Schritt 3 aus und lies die Zahl hinter `[1]`. Hast du `weights = wghtpew` drin? Ohne Gewicht kommt 0,484 heraus.',
      { tolerance: 0.005, short: 'Cramér-V', help: 'Drei Nachkommastellen, zum Beispiel 0,123.' }),
    choice('a2-staerke', 'Wie stark ist der Zusammenhang nach der Faustregel?', STRENGTH, 'mittel',
      'Ja: 0,48 liegt zwischen 0,3 und 0,5, also mittel, knapp unter stark.', 'Schau aufs Lineal aus Grundlage 2c: ab 0,3 mittel, ab 0,5 stark.',
      { short: 'Stärke' }),
    choice('a2-richtung', 'Was sagt dir V über die Richtung des Zusammenhangs?', [
      ['a', 'Nichts. Wer zufriedener ist, liest du an den Zeilenprozenten ab.'],
      ['b', 'V ist positiv, also sind Wählende weiter rechts zufriedener.'],
      ['c', 'V ist kleiner als 0,5, also sind die meisten unzufrieden.'],
    ], 'a',
    'Genau: V hat kein Vorzeichen, und bei Parteien gibt es kein „höher“. Wo die Zufriedenheit hoch oder niedrig ist, zeigen die Zeilenprozente.',
    'Bei nominalen Merkmalen gibt es keine Reihenfolge, also auch kein „je mehr, desto …“. V misst nur die Stärke.',
    { short: 'Richtung' }),
  ],
  a3: [
    number('a3-gamma', 'Wie groß ist Gamma (gewichtet)?', -0.5444,
      'Stimmt: Gamma = −0,544.', 'Führe Schritt 2 aus und lies die erste Zahl der Ausgabe, hinter `[1]`. Achte auf das Minus. Bei 0,544 ohne Minus: Hast du `ps03` umgepolt und `zufriedenheit` verwendet? Bei −0,553: Da fehlt `weights = wghtpew`.',
      { tolerance: 0.005, short: 'Gamma', help: 'Mit Vorzeichen und drei Nachkommastellen, zum Beispiel −0,123.' }),
    number('a3-tau', 'Wie groß ist Tau-b (gewichtet)?', -0.387,
      'Stimmt: Tau-b = −0,387.', 'Lies in Schritt 2 im Block „Kendall\'s Tau“ die Zahl hinter `tau =`. Bei −0,393 fehlt das Gewicht.',
      { tolerance: 0.005, short: 'Tau-b', help: 'Mit Vorzeichen, aus der Zeile `tau = …`.' }),
    choice('a3-richtung', 'Welcher Satz beschreibt die Richtung?', [
      ['a', 'Wer die Wirtschaftslage schlechter einschätzt, ist eher unzufriedener mit der Demokratie.'],
      ['b', 'Wer die Wirtschaftslage schlechter einschätzt, ist eher zufriedener mit der Demokratie.'],
      ['c', 'Das Minus heißt: Es gibt keinen Zusammenhang.'],
    ], 'a',
    'Genau: Ein höherer Code bei `ep01` (schlechter) geht mit einem niedrigeren Code bei `zufriedenheit` (unzufriedener) einher.',
    'Schau aufs Bild in Schritt 2: Negativ heißt, der eine Pfeil geht hoch, der andere runter. Bei `ep01` heißt höher „schlechter“, bei `zufriedenheit` „zufriedener“.',
    { short: 'Richtung' }),
    choice('a3-staerke', 'Wie stark ist der Zusammenhang nach der Faustregel (mit Tau-b eingeordnet)?', STRENGTH, 'mittel',
      'Ja: Der Betrag von Tau-b ist 0,387, also mittel.', 'Für die Stärke zählt der Betrag, ohne Vorzeichen: 0,387 liegt zwischen 0,3 und 0,5.',
      { short: 'Stärke' }),
    choice('a3-warum', 'Warum ist Gamma dem Betrag nach größer als Tau-b?', [
      ['a', 'Gamma lässt die vielen Paare mit Gleichstand weg, Tau-b zählt sie mit.'],
      ['b', 'Gamma rechnet mit Gewicht, Tau-b ohne.'],
      ['c', 'Gamma misst einen anderen Zusammenhang als Tau-b.'],
    ], 'a',
    'Genau: Bei fünf und sechs Stufen liegen sehr viele Paare bei einem Merkmal gleichauf. Gamma übergeht sie, darum fällt es größer aus.',
    'Schau in Grundlage 3b: Was steht bei Gamma im Nenner, was bei Tau-b? Beide hast du hier gewichtet gerechnet.',
    { short: 'Gamma größer' }),
  ],
  a4: [
    number('a4-r', 'Wie groß ist Pearson-r (gewichtet)?', 0.265,
      'Stimmt: r = 0,265.', 'Lies in Schritt 2 die Zahl hinter `r =`. Bei 0,260 fehlt das Gewicht; bei 0,268 hast du ρ eingetragen.',
      { tolerance: 0.0005, short: 'Pearson-r', help: 'Drei Nachkommastellen, wie in der Zeile `r = …`.' }),
    number('a4-rho', 'Wie groß ist Spearman-ρ?', 0.268,
      'Stimmt: ρ = 0,268, fast dasselbe wie r.', 'Lies in Schritt 2 die Zahl hinter `rho =`.',
      { tolerance: 0.0005, short: 'Spearman-ρ', help: 'Drei Nachkommastellen, Zeile `rho = …`.' }),
    choice('a4-staerke', 'Wie stark ist der Zusammenhang nach der Faustregel?', [['kein', 'kein oder sehr schwach'], ...STRENGTH], 'schwach',
      'Ja: 0,265 liegt zwischen 0,1 und 0,3, also schwach.', 'Vergleiche mit den Grenzen 0,1, 0,3 und 0,5.',
      { short: 'Stärke' }),
    number('a4-west', 'Wie groß ist r im Westen?', 0.267,
      'Stimmt: r = 0,267 im Westen.', 'Führe Schritt 3 mit `eastwest == 1` aus. Bei 0,265 hast du den Wert für alle aus Schritt 2 genommen.',
      { tolerance: 0.0005, short: 'r im Westen', help: 'Aus Schritt 3 mit 1, drei Nachkommastellen.' }),
    number('a4-ost', 'Und im Osten?', 0.239,
      'Stimmt: r = 0,239 im Osten.', 'Tausche in Schritt 3 die markierte 1 gegen 2.',
      { tolerance: 0.0005, short: 'r im Osten', help: 'Aus Schritt 3 mit 2, drei Nachkommastellen.' }),
    choice('a4-dritt', 'Erklärt der Landesteil den Zusammenhang?', [
      ['a', 'Nein: In West und Ost ist er etwa gleich stark wie insgesamt.'],
      ['b', 'Ja: Im Osten verschwindet er.'],
      ['c', 'Ja: Er kehrt sich im Osten um.'],
    ], 'a',
    'Genau: 0,267 im Westen, 0,239 im Osten, 0,265 insgesamt. Der Zusammenhang hält in beiden Landesteilen.',
    'Vergleiche die beiden Werte aus Schritt 3 mit dem Wert aus Schritt 2. Sind sie deutlich kleiner oder haben sie ein anderes Vorzeichen?',
    { short: 'Drittvariable' }),
    choice('a4-satz', 'Welcher Satz passt in einen Bericht?', [
      ['a', 'Lebenszufriedenheit macht zufrieden mit der Demokratie.'],
      ['b', 'Wer mit dem eigenen Leben zufriedener ist, ist im Schnitt etwas zufriedener mit der Demokratie (r = 0,27, gewichtet). Ob das eine das andere bewirkt, zeigt r nicht.'],
      ['c', 'Ein Viertel der Zufriedenheit mit der Demokratie kommt von der Lebenszufriedenheit.'],
    ], 'b',
    'Genau: Richtung, Stärke, Gewicht, und keine Ursache behauptet.',
    'r misst einen Zusammenhang, keine Ursache, und ist kein Prozentanteil.',
    { short: 'Bericht' }),
  ],
};

/** Pflichtaufgaben: Aufgabe 1 bis 3. */
export const REQUIRED: Question[] = [...QUESTIONS.a1, ...QUESTIONS.a2, ...QUESTIONS.a3];

/** „Kurz überlegen“ in den Grundlagen. */
export const THINK: Record<'g1b' | 'g2a' | 'g2c' | 'g3b' | 'g3c' | 'g4a' | 'g4b' | 'g4c', Question> = {
  g1b: number('g1b', 'Angenommen, eine Umfrage hätte 50 von 100 Befragten im Osten, in der Bevölkerung wären es 17 von 100. Welches Gewicht bekäme dann eine Person aus dem Osten?', 0.34,
    'Stimmt: 17 geteilt durch 50 ergibt 0,34. Je stärker eine Gruppe überrepräsentiert ist, desto kleiner ihr Gewicht.', 'Teile den Anteil in Deutschland (17) durch den Anteil in der Umfrage (50).',
    { tolerance: 0.01, short: 'Gewicht im Osten', help: 'Anteil in Deutschland geteilt durch Anteil in der Stichprobe. Eine Kommazahl reicht, zum Beispiel 0,75.' }),
  g2a: number('g2a', 'Wie viele Befragte aus dem Osten ohne Konfession würdest du erwarten, wenn Region und Konfession nichts miteinander zu tun hätten?', 8.8,
    'Stimmt: 20 × 44 / 100 = 8,8. Beobachtet sind 16, fast doppelt so viele.', 'Ohne Zusammenhang hätte der Osten denselben Anteil wie alle: 44 % von 20 Befragten.',
    { tolerance: 0.05, short: 'erwartet', help: 'Zeilensumme Ost mal Spaltensumme „keine“ geteilt durch alle 100.' }),
  g2c: choice('g2c', 'Phi für Konfession und Region ist 0,33. Wie stark ist der Zusammenhang nach der Faustregel?', STRENGTH, 'mittel',
    'Ja: 0,33 liegt knapp über 0,3, also mittel.', 'Schau aufs Lineal: Ab 0,3 beginnt „mittel“, ab 0,5 „stark“.', { short: 'Stärke' }),
  g3b: number('g3b', 'In einer Tabelle gibt es 30 gleichläufige und 10 gegenläufige Paare, dazu 20 Paare mit Gleichstand. Wie groß ist Gamma?', 0.5,
    'Stimmt: (30 − 10) / (30 + 10) = 0,5. Die 20 Paare mit Gleichstand spielen für Gamma keine Rolle; Tau-b wäre kleiner.', 'Die Paare mit Gleichstand gehören bei Gamma nicht in den Nenner: (30 − 10) / (30 + 10).',
    { tolerance: 0.01, short: 'Gamma', help: 'Gleichläufig minus gegenläufig, geteilt durch gleichläufig plus gegenläufig.' }),
  g3c: choice('g3c', 'Gamma für Schicht und Gesundheit ist −0,36, mit der Gesundheit wie im Datensatz (1 = sehr gut, 5 = schlecht). Was heißt das?', [
    ['a', 'Je höher die Schicht, desto besser die Gesundheit.'],
    ['b', 'Je höher die Schicht, desto schlechter die Gesundheit.'],
    ['c', 'Es gibt keinen Zusammenhang, weil das Vorzeichen negativ ist.'],
  ], 'a', 'Genau: Ein höherer Schichtcode geht mit kleineren Gesundheitscodes zusammen, und klein heißt hier gut.',
  'Lies die Codes: Bei der Gesundheit heißt ein kleinerer Code „besser“. Negativ heißt: höhere Schicht, kleinerer Code.', { short: 'Vorzeichen' }),
  g4a: choice('g4a', 'Person B (29 Jahre) braucht statt 50 Minuten 1.500, weil der Bogen einen Tag herumlag. Was passiert mit r?', [
    ['steigt', 'r steigt.'], ['sinkt', 'r sinkt stark, kann sogar negativ werden.'], ['gleich', 'r bleibt fast gleich.'],
  ], 'sinkt', 'Genau: Ein einziger Punkt weit draußen im Minus-Feld bringt ein riesiges negatives Produkt mit. r fällt auf −0,38.',
  'Probier es mit dem Schalter aus: B liegt dann weit oben links, im Minus-Feld.', { short: 'Ausreißer' }),
  g4b: choice('g4b', 'Mit allen Bögen: r = 0,003, ρ = 0,24. Welche Zahl beschreibt den Zusammenhang besser?', [
    ['r', 'r, weil es die genauen Minuten nutzt.'], ['rho', 'ρ, weil einzelne Bögen mit Zehntausenden Minuten r verzerren.'], ['beide', 'Beide gleich gut.'],
  ], 'rho', 'Ja: Rangplätze stört es nicht, wie weit ein Ausreißer draußen liegt. Ohne Ausreißer liegt auch r bei 0,25.',
  'Denk an Person B im Punkte-Labor: Ein Punkt weit draußen bestimmt r. Was ändert sich bei Rangplätzen?', { short: 'r oder ρ' }),
  g4c: choice('g4c', 'Was erwartest du: Wird der Unterschied zwischen Nutzern und Nicht-Nutzern innerhalb gleich alter Menschen größer oder kleiner?', [
    ['groesser', 'größer'], ['kleiner', 'kleiner'], ['gleich', 'gleich'],
  ], 'kleiner', 'Ja: Er schrumpft von 35 auf 15 bis 19 Prozentpunkte. Das Alter erklärt einen Teil.',
  'Schalte auf „60 bis 74“ und „75 und älter“ und vergleiche die Abstände mit „alle“.', { short: 'Drittvariable' }),
};

/* ---------- Überblick: Maß zuordnen ---------- */

export const MEASURE_OPTIONS = ['Cramér-V', 'Phi', 'Tau-b', 'Pearson-r', 'Spearman-ρ'];
/** Ü1: je Paar ein Maß (answer = Index in MEASURE_OPTIONS). */
export const ASSIGN: { id: string; pair: string; answer: number; right: string; wrong: string }[] = [
  { id: 'u1', pair: 'Familienstand und Wahlabsicht', answer: 0, right: 'Beide nominal, mehr als zwei Kategorien.', wrong: 'Hat der Familienstand eine Reihenfolge?' },
  { id: 'u2', pair: 'Geschlecht (Mann, Frau) und Gewerkschaftsmitglied (ja, nein)', answer: 1, right: 'Zwei mal zwei Kategorien: Phi (dem Betrag nach gleich Cramér-V).', wrong: 'Zähl die Kategorien: je zwei.' },
  { id: 'u3', pair: 'Politisches Interesse (sehr stark bis überhaupt nicht) und Schulabschluss (ohne bis Hochschulreife)', answer: 2, right: 'Beide geordnet, wenige Stufen. Gamma ginge auch, fällt aber größer aus.', wrong: 'Beide haben eine Reihenfolge, aber keine gleichen Abstände.' },
  { id: 'u4', pair: 'Alter und Arbeitsstunden pro Woche', answer: 3, right: 'Beide metrisch. Vorher die Punktwolke ansehen.', wrong: 'Jahre und Stunden haben gleiche Abstände.' },
  { id: 'u5', pair: 'Alter und Bearbeitungsdauer, wobei einzelne Bögen wochenlang herumlagen', answer: 4, right: 'Ausreißer verzerren r; Rangplätze nicht.', wrong: 'Denk an Grundlage 4b.' },
];

/* ---------- Erst festlegen ---------- */

const LEVELS4 = ['kein oder sehr schwach (unter 0,1)', 'schwach (0,1 bis 0,3)', 'mittel (0,3 bis 0,5)', 'stark (ab 0,5)'];
/** „Erst festlegen“ vor jeder Aufgabe, mit der Auflösung, die beim Prüfen dazukommt. */
export const PREDICTIONS: Record<'a1' | 'a2' | 'a3' | 'a4', { id: string; prompt: string; options: string[]; resolution: string }> = {
  a1: { id: 'a1-tipp', prompt: 'Was passiert mit dem Anteil der Zufriedenen, wenn du gewichtest?', options: ['Er steigt', 'Er sinkt', 'Er bleibt gleich'], resolution: 'Mit Gewicht steigt der Anteil von 70,7 % auf 73,6 %.' },
  a2: { id: 'a2-tipp', prompt: 'Wie stark ist der Zusammenhang zwischen Wahlabsicht und Zufriedenheit wohl?', options: LEVELS4, resolution: `R ergibt V = ${de(A2.v, 2)}: mittel, knapp unter stark.` },
  a3: { id: 'a3-tipp', prompt: 'Welches Vorzeichen erwartest du? Höhere Codes heißen bei der Zufriedenheit „zufriedener“ (nach dem Umpolen) und bei der Wirtschaftslage „schlechter“.', options: ['positiv', 'negativ', 'etwa 0'], resolution: 'Gamma ist −0,54: negativ.' },
  a4: { id: 'a4-tipp', prompt: 'Wie stark hängen Lebenszufriedenheit und Zufriedenheit mit der Demokratie zusammen?', options: LEVELS4, resolution: 'r = 0,265: schwach.' },
};

/* ---------- Hilfe in drei Stufen ---------- */

/** Stufe 1 Denkanstoß, Stufe 2 Wo schaue ich?, Stufe 3 Lösung; Code in `Backticks`. */
export const HINTS: Record<'a1' | 'a2' | 'a3' | 'a4', [string, string, string]> = {
  a1: [
    'Cum. % zählt von oben nach unten zusammen. In Zeile 3 stehen alle, die 1, 2 oder 3 angegeben haben. Mit Gewicht zählt eine Person aus dem Westen 1,22-fach, eine aus dem Osten 0,53-fach.',
    'Schritt 1 gibt zwei Tabellen untereinander: erst ohne Gewicht, dann mit der Überschrift „Weighted Frequency Analysis Results“. Für Ost und West nimmst du Schritt 2, einmal mit 2 und einmal mit 1 in beiden markierten Stellen.',
    'Ohne Gewicht sind 70,73 % mindestens etwas zufrieden, mit Gewicht 73,58 %. Im Osten sind es 58,45 % (mit Gewicht 58,56 %), im Westen 76,64 % (mit Gewicht 76,63 %). Ohne Gewicht stammt knapp ein Drittel der gültigen Antworten aus dem Osten (32,5 %), mit Gewicht etwa ein Sechstel (16,9 %). Darum rückt die Zahl für Deutschland näher an den Westen: 0,831 × 76,63 + 0,169 × 58,56 = 73,6 %. Für einen Bericht über Deutschland gilt: 73,6 % sind mindestens etwas zufrieden (ALLBUS 2023, gewichtet).',
  ],
  a2: [
    'Parteien haben keine Reihenfolge, darum misst du mit Cramér-V. V sagt, wie stark sich die Prozente zwischen den Gruppen unterscheiden. Wo die Unterschiede liegen, steht in der Kreuztabelle.',
    'Die Prozente für die Grünen und die AfD stehen in Schritt 2, jeweils in der Zeile „row %“ unter dem Parteinamen, in der Spalte zufrieden. V steht in Schritt 3 hinter `[1]`.',
    'Die Wahlabsicht ist nominal, also Cramér-V. Mindestens etwas zufrieden sind (gewichtet): Grüne 92,9 %, SPD 87,2 %, FDP 80,7 %, CDU-CSU 79,5 %, Linke 61,6 %, andere Partei 51,6 %, würde nicht wählen 50,7 %, AfD 22,8 %; alle zusammen 74,8 % (mehr als die 73,6 % aus Aufgabe 1, weil hier nur Befragte mit gültiger Wahlabsicht zählen). Cramér-V = 0,478, nach der Faustregel ein mittlerer Zusammenhang, knapp unter stark. V hat keine Richtung; dass die Zufriedenheit bei Grünen- und SPD-Wählenden hoch und bei AfD-Wählenden niedrig ist, liest du an den Zeilenprozenten ab.',
  ],
  a3: [
    'Für die Richtung brauchst du die Codes beider Variablen: Was heißt bei `zufriedenheit` ein höherer Code, was bei `ep01`? Für die Stärke zählt nur der Betrag.',
    'Gamma steht in der Ausgabe von Schritt 2 hinter `[1]`, Tau-b in der Zeile `tau = …`. Die Codes stehen in der Einleitung und in der Kontrolle von Schritt 1.',
    'Gamma = −0,544, Tau-b = −0,387 (gewichtet; ohne Gewicht −0,553 und −0,393). Negativ: Wer die Wirtschaftslage schlechter einschätzt, ist eher unzufriedener mit der Demokratie. Nach Tau-b ein mittlerer Zusammenhang. Gamma ist größer, weil es die vielen Paare mit Gleichstand weglässt. Zum Ansehen (gewichtet): Mindestens etwas zufrieden sind 95,7 % derer, die die Lage „sehr gut“ finden, 90,1 % bei „gut“, 76,9 % bei „teils/teils“, 45,6 % bei „schlecht“ und 14,0 % bei „sehr schlecht“.',
  ],
  a4: [
    'r und ρ stehen hinter `r =` und `rho =`. Für die Drittvariable rechnest du dasselbe Maß in jeder Gruppe und vergleichst mit dem Gesamtwert.',
    'Gesamtwerte in Schritt 2; West und Ost in Schritt 3, einmal mit 1 und einmal mit 2 an der markierten Stelle.',
    'r = 0,265 (gewichtet), ρ = 0,268: ein schwacher positiver Zusammenhang. Im Westen r = 0,267, im Osten 0,239; der Landesteil erklärt den Zusammenhang nicht. Satz: Wer mit dem eigenen Leben zufriedener ist, ist im Schnitt etwas zufriedener mit der Demokratie; eine Ursache zeigt r nicht.',
  ],
};

/* ---------- Hilfe bei R-Fehlermeldungen ---------- */

/** Text mit Code-Stücken und Links, ohne JSX. */
export type Rich = (string | { code: string } | { href: string; text: string })[];
export const ERROR_HELP_TITLE = 'Hilfe: R meldet einen Fehler';
export const ERROR_HELP_CAPTION = 'Was R sagt, was passiert ist und was du tust (Wortlaut englisch; in deutscher R-Version ähnlich)';
export const ERROR_HELP: { says: Rich; why: Rich; helps: Rich }[] = [
  { says: [{ code: 'Unknown argument `weight` of `frequency()`. Did you mean `weights` instead of `weight`?' }], why: ['Das s fehlt.'], helps: [{ code: 'weights = wghtpew' }, ' schreiben, mit s.'] },
  { says: [{ code: 'Weights variable `wghtpwe` not found in data.' }], why: ['Tippfehler im Namen des Gewichts.'], helps: ['Genau ', { code: 'wghtpew' }, ' schreiben: w, g, h, t, p, e, w.'] },
  { says: [{ code: "Can't select columns that don't exist. ✖ Column `zufriedenheit` doesn't exist." }], why: ['Die neue Variable gibt es noch nicht: Der Block mit ', { code: 'mutate()' }, ' wurde nicht ausgeführt (oder der Name ist anders geschrieben).'], helps: ['Erst den Block mit ', { code: 'mutate()' }, ' ausführen, dann das Maß. In RStudio nach einem Neustart auch den ', { href: '#r1', text: 'Startblock' }, '.'] },
  { says: [{ code: 'unexpected symbol' }, ' (deutsch: ', { code: 'unerwartetes Symbol' }, ')'], why: ['Zwischen den zwei Variablen fehlt ein Komma, z. B. ', { code: 'kendall_tau(zufriedenheit ep01)' }, '.'], helps: ['Komma setzen: ', { code: 'kendall_tau(zufriedenheit, ep01)' }, '.'] },
  { says: [{ code: 'could not find function "cramers_v"' }, ' (deutsch: ', { code: 'konnte Funktion "cramers_v" nicht finden' }, ')'], why: ['mariposa ist nicht geladen.'], helps: [{ href: '#r1', text: 'Startblock' }, ' ausführen (', { code: 'library(mariposa)' }, ').'] },
  { says: ['Warnung in Rot: ', { code: '2 cells (6.7%) has expected count < 5. Chi-squared approximation may be unreliable.' }], why: ['Kein Fehler: ein Hinweis zum χ²-Test, weil einige Zellen der Tabelle sehr klein sind.'], helps: ['Nichts; die Zahl darüber gilt.'] },
  { says: ['Kein Fehler, aber eine andere Zahl als erwartet (z. B. −0,553 statt −0,544)'], why: [{ code: 'weights = wghtpew' }, ' fehlt.'], helps: ['Gewicht in die Klammer setzen.'] },
  { says: ['Kein Fehler, aber das Vorzeichen ist umgekehrt (z. B. 0,544 statt −0,544)'], why: [{ code: 'ps03' }, ' statt ', { code: 'zufriedenheit' }, ' verwendet, also nicht umgepolt.'], helps: ['Den Block mit ', { code: 'rec(ps03, rules = "rev")' }, ' ausführen und ', { code: 'zufriedenheit' }, ' einsetzen.'] },
];

/* ---------- Prüf dich selbst ---------- */

export const SELF_TEST: { question: string; options: string[]; answer: number; why: string }[] = [
  { question: 'Ein Bericht über ganz Deutschland nennt den Anteil ohne Gewicht. Was ist das Problem?', options: ['Der Osten zählt fast doppelt so stark, wie er in Deutschland vertreten ist.', 'Ohne Gewicht fehlen Befragte.', 'Ohne Gewicht sind die Prozente falsch gerechnet.'], answer: 0, why: 'Der ALLBUS befragt den Osten absichtlich stärker. Gerechnet ist richtig, aber die Zahl beschreibt die Befragten, nicht Deutschland.' },
  { question: 'Du vergleichst nur den Osten mit dem Westen. Ändert das Gewicht die Prozente in den Landesteilen?', options: ['Kaum, weil innerhalb eines Landesteils alle fast dasselbe Gewicht haben.', 'Ja, stark.', 'Nur im Westen.'], answer: 0, why: 'Im Osten 58,45 % ohne, 58,56 % mit Gewicht. Das Gewicht wirkt erst, wenn West und Ost zusammengezählt werden.' },
  { question: 'Konfession (evangelisch, katholisch, andere, keine) und Wahlabsicht: Welches Maß passt?', options: ['Gamma', 'Cramér-V', 'Pearson-r'], answer: 1, why: 'Beide nominal. Gamma bräuchte eine sinnvolle Reihenfolge; die Konfessionen haben keine.' },
  { question: 'Zwischen Bildung (höher = höherer Abschluss) und einer Einstellung kommt Tau-b = −0,32 heraus. Was stimmt?', options: ['Schwach, weil negativ.', 'Mittel; höhere Bildung geht mit niedrigeren Codes der Einstellung einher.', 'Kein Zusammenhang.'], answer: 1, why: 'Der Betrag 0,32 zeigt die Stärke (mittel), das Minus die Richtung. Was ein niedrigerer Code bei der Einstellung heißt, steht im Codebuch.' },
  { question: 'Zwischen zwei metrischen Variablen kommt r = 0,02 heraus. Was schließt du?', options: ['Es gibt sicher keinen Zusammenhang.', 'Es gibt keinen geradlinigen Zusammenhang; Punktwolke und Spearman-ρ prüfen.', 'Die Variablen sind falsch kodiert.'], answer: 1, why: 'r sieht nur Geraden und reagiert stark auf Ausreißer. Beim Alter und der Bearbeitungsdauer war r = 0,003, ρ aber 0,24.' },
];

/* ---------- Skript zum Mitnehmen ---------- */

export const SCRIPT_FILE = 'sitzung6.R';
/** Reihenfolge der Vorlagen im Skript; Kommentare hinter einer Vorlage stehen in SCRIPT_NOTES. */
export const SCRIPT_PARTS = ['start', 'lesen_gewicht', 'lesen_mass', 'a1a', 'a1b', 'a2b', 'a2c', 'a3a', 'a3b', 'a4a', 'a4b', 'a4c'];
export const SCRIPT_IDEAS = ['frei_a1', 'frei_a2', 'frei_a3', 'frei_a4'];
const SCRIPT_NOTES: Record<string, string> = {
  a1b: '# Für den Westen: in beiden filter()-Zeilen 2 durch 1 ersetzen\n',
  a4c: '# Für den Osten: 1 durch 2 ersetzen\n',
};
const scriptCode = (k: string) => parseMarks(TEMPLATES[k].code).code.replace(/\n+$/, '');
/** Skript sitzung6.R: alle Vorlagen, Marken stehen mit ihrem Beispielwert; die Probier-Vorschläge am Ende. */
export const SCRIPT = '# Sitzung 6: Gewichtung und Zusammenhang\n# Statistikatlas, Methoden Ib, ALLBUS 2023 (ZA8831 v1.3.0)\n# Markierte Stellen aus dem Atlas stehen hier mit ihrem Beispielwert.\n\n'
  + SCRIPT_PARTS.map(k => `# ---- ${TEMPLATES[k].title} ----\n${scriptCode(k)}\n${SCRIPT_NOTES[k] ?? ''}`).join('\n')
  + '\n# ---- Ideen zum Weiterdenken ----\n'
  + SCRIPT_IDEAS.map(k => `${scriptCode(k)}\n`).join('\n');

/* ---------- Textfassungen der Bilder ---------- */

export const ALT = {
  stichprobe: 'Zwei Bauplatten aus je 100 Steinen. ALLBUS: 68 Steine West, 32 Ost (genau 67,99 % und 32,01 %, also 3.567 und 1.679 Befragte). Deutschland: 83 West, 17 Ost (83,16 % und 16,84 %, so verteilt das Gewicht die Befragten).',
  mischpult: 'Je größer der Anteil der Befragten aus dem Osten, desto näher rückt der Gesamtanteil an die Ost-Quote von 77,5 %. Bei 32,0 % Ost-Anteil (ALLBUS ohne Gewicht) sind es 47,7 %, bei 16,8 % (mit Gewicht) 41,0 %. Ganz ohne Osten wären es 33,7 %, nur mit Osten 77,5 %.',
  cumLesen: 'Beispieltabelle mit vier Codes. Valid %: 10, 30, 40, 20. Cum. %: 10, 40, 80, 100. Die 40 in Zeile 2 ist die Summe aus 10 und 30: alle, die Code 1 oder 2 angegeben haben.',
  lineal: 'Faustregel für die Stärke: unter 0,1 kein oder sehr schwacher Zusammenhang, ab 0,1 schwach, ab 0,3 mittel, ab 0,5 stark. Konfession und Region: Phi 0,33, also mittel.',
  vorzeichen: 'Zwei senkrechte Pfeile. Links zufriedenheit: unten 1 sehr unzufrieden, oben 6 sehr zufrieden. Rechts ep01: unten 1 sehr gut, oben 5 sehr schlecht. Positiv: beide Pfeile gehen zusammen nach oben, also: je schlechter die Lage eingeschätzt wird, desto zufriedener. Negativ: wenn der eine nach oben geht, geht der andere nach unten, also: je schlechter die Lage eingeschätzt wird, desto unzufriedener.',
  ausreisser: 'Lineal von −1 bis +1. r, alle Bögen: 0,003. ρ, alle Bögen: 0,24. r, bis 180 Minuten: 0,25. ρ, bis 180 Minuten: 0,27. Mit Ausreißern zeigt r fast nichts, ρ einen schwachen Zusammenhang. Ohne die Ausreißer sind beide ähnlich.',
  fuenf: 'Lineal von −1 bis +1 mit fünf Maßen für Zufriedenheit (umgepolt) und Wirtschaftslage, gewichtet: Cramér-V 0,28; Tau-b −0,39; Spearman-ρ −0,45; Pearson-r −0,46; Gamma −0,54. Für dieselben Daten liefern die Maße verschiedene Zahlen, weil sie Verschiedenes messen.',
  punktwolke: 'Punktwolke, x-Achse Lebenszufriedenheit 0 bis 10, y-Achse Zufriedenheit mit der Demokratie 1 bis 6. Die meisten Punkte liegen rechts oben (Lebenszufriedenheit 7 bis 9, Demokratie 4 bis 5). Links stehen wenige Punkte, sie streuen über alle Stufen. Die Wolke steigt nach rechts nur leicht an.',
};
