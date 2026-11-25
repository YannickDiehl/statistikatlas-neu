// Sitzung 7 „Mittelwerte vergleichen“: Zahlen, Vorlagen und Fragen aus docs/entwicklung/spezifikationen/2026-11-23-lernpfad-kapitel/sitzung07.md, nur Daten.
// Alle Zahlen: ALLBUS 2023, ZA8831 v1.3.0, gewichtet mit wghtpew wie mariposa 0.7.4, nur Aggregate.
// Geprüft in allbus.local.test.ts (echte Datei) und content.test.ts (konstruierte Beispiele, Rechenwege); Quelle: sitzung07-zahlen.R.
import type { Question } from '../answers';
import { parseMarks } from '../workshop/editor';

/* ---------- Ausgaben von t_test() %>% summary() ---------- */

export type GroupRow = { label: string; n: number; mean: number; sd: number; se: number };
export type TestRow = { t: number; df: number; p: string; diff: number; se: number; lo: number; hi: number };
export type TTestOut = {
  groups: [GroupRow, GroupRow];
  /** Zeile „Equal variances assumed“ (Student); nicht in jedem Plan-Auszug. */
  student?: TestRow;
  /** Zeile „Equal variances not assumed“ (Welch). */
  welch: TestRow;
  effect: { d: number; g: number; glass: number; magnitude: string };
};

/** R lesen und Grundlage 1: Arbeitsstunden dw15 nach Geschlecht (rec: 1 Mann, 2 Frau, sonst NA). */
export const DW15_SEX: TTestOut = {
  groups: [
    { label: 'Mann', n: 1530, mean: 41.609, sd: 8.443, se: 0.216 },
    { label: 'Frau', n: 1427, mean: 33.620, sd: 10.287, se: 0.272 },
  ],
  student: { t: 23.144, df: 2955, p: '<.001', diff: 7.988, se: 0.345, lo: 7.311, hi: 8.665 },
  welch: { t: 22.988, df: 2763.588, p: '<.001', diff: 7.988, se: 0.348, lo: 7.307, hi: 8.670 },
  effect: { d: 0.852, g: 0.851, glass: 0.946, magnitude: 'large' },
};
/** Kurzfassung ohne summary() und gezählte (ungewichtete) Fallzahlen. */
export const DW15_SEX_SHORT = 't(2763.6) = 22.988, p < 0.001 ***, g = 0.851 (large), N = 2957';
export const DW15_SEX_COUNTED: [number, number] = [1491, 1442];
/** sex: Männer, Frauen, divers, fehlend (ungewichtet). */
export const SEX_COUNTS = { men: 2546, women: 2672, diverse: 18, missing: 10 };

/** Grundlage 1: Lebenszufriedenheit ls01 nach Geschlecht. */
export const LS01_SEX: TTestOut = {
  groups: [
    { label: 'Mann', n: 2519, mean: 7.399, sd: 1.913, se: 0.038 },
    { label: 'Frau', n: 2619, mean: 7.409, sd: 1.925, se: 0.038 },
  ],
  welch: { t: -0.187, df: 5130.525, p: '.852', diff: -0.010, se: 0.054, lo: -0.115, hi: 0.095 },
  effect: { d: -0.005, g: -0.005, glass: -0.005, magnitude: 'negligible' },
};

/** Grundlage 2a: Wichtigkeit von Politik li07 nach Geschlecht. */
export const LI07_SEX: TTestOut = {
  groups: [
    { label: 'Mann', n: 2533, mean: 4.519, sd: 1.477, se: 0.029 },
    { label: 'Frau', n: 2620, mean: 4.414, sd: 1.488, se: 0.029 },
  ],
  welch: { t: 2.555, df: 5147.565, p: '.011', diff: 0.106, se: 0.041, lo: 0.025, hi: 0.186 },
  effect: { d: 0.071, g: 0.071, glass: 0.071, magnitude: 'negligible' },
};

/** Aufgabe 1: Vertrauen in den Bundestag pt03 nach abitur (rec: educ 1:3 = 0 ohne, 4:5 = 1 mit Abitur). */
export const PT03_ABITUR: TTestOut = {
  groups: [
    { label: 'ohne Abitur', n: 1793, mean: 3.688, sd: 1.667, se: 0.039 },
    { label: 'mit Abitur', n: 1712, mean: 4.348, sd: 1.474, se: 0.036 },
  ],
  student: { t: -12.396, df: 3503, p: '<.001', diff: -0.660, se: 0.053, lo: -0.765, hi: -0.556 },
  welch: { t: -12.432, df: 3482.193, p: '<.001', diff: -0.660, se: 0.053, lo: -0.764, hi: -0.556 },
  effect: { d: -0.419, g: -0.419, glass: -0.396, magnitude: 'small' },
};
/** Aufgabe 1: Kurzfassungen der Vorlage a1_kurz vor (age) und nach dem Tausch (pt03). */
export const A1_SHORT = {
  age: 't(5059.1) = 22.239, p < 0.001 ***, g = 0.625 (medium), N = 5067',
  pt03: 't(3482.2) = -12.432, p < 0.001 ***, g = -0.419 (small), N = 3505',
};

/** pt03: gültige Antworten und „TNZ: SPLIT“ (-11, Frage nicht gestellt, etwa ein Drittel); gezählte Befragte ohne/mit Abitur; educ 4 und 5. */
export const PT03_FACTS = { valid: 3592, split: 1596, counted: [1832, 1681] as [number, number], educ4: 625, educ5: 1847 };

/** Aufgabe 2: Lebenszufriedenheit nach abitur, alle Befragten. */
export const LS01_ABITUR: TTestOut = {
  groups: [
    { label: 'ohne Abitur', n: 2539, mean: 7.239, sd: 2.117, se: 0.042 },
    { label: 'mit Abitur', n: 2487, mean: 7.582, sd: 1.682, se: 0.034 },
  ],
  welch: { t: -6.361, df: 4820.264, p: '<.001', diff: -0.343, se: 0.054, lo: -0.448, hi: -0.237 },
  effect: { d: -0.179, g: -0.179, glass: -0.162, magnitude: 'negligible' },
};
/** Aufgabe 2: dasselbe nur für Befragte unter 30. */
export const LS01_ABITUR_U30: TTestOut = {
  groups: [
    { label: 'ohne Abitur', n: 178, mean: 6.449, sd: 2.433, se: 0.182 },
    { label: 'mit Abitur', n: 491, mean: 7.435, sd: 1.596, se: 0.072 },
  ],
  student: { t: -6.077, df: 668, p: '<.001', diff: -0.986, se: 0.162, lo: -1.304, hi: -0.667 },
  welch: { t: -5.033, df: 235.165, p: '<.001', diff: -0.986, se: 0.196, lo: -1.371, hi: -0.600 },
  effect: { d: -0.531, g: -0.530, glass: -0.405, magnitude: 'medium' },
};

/* ---------- Ausgaben von oneway_anova() und tukey_test() ---------- */

export type AnovaGroup = GroupRow & { lo: number; hi: number };
export type AnovaOut = {
  groups: AnovaGroup[];
  between: { ss: number; df: number; ms: number; F: number; p: string };
  within: { ss: number; df: number; ms: number };
  total?: { ss: number; df: number };
  welch: { F: number; df1: number; df2: number; p: string };
  effect: { eta2: number; epsilon2: number; omega2: number; magnitude: string };
};
export type TukeyOut = { pair: string; diff: number; se: number; p: string; lo: number; hi: number };

/** Grundlage 3 und Vorlage a3_anova, wie sie startet: Alter nach Erhebungsweg (mode). */
export const AGE_MODE: AnovaOut = {
  groups: [
    { label: 'CAPI', n: 2002, mean: 51.772, sd: 18.258, se: 0.408, lo: 50.972, hi: 52.572 },
    { label: 'CAWI', n: 1623, mean: 46.749, sd: 16.587, se: 0.412, lo: 45.941, hi: 47.556 },
    { label: 'MAIL', n: 1599, mean: 57.953, sd: 18.250, se: 0.456, lo: 57.058, hi: 58.848 },
  ],
  between: { ss: 101483.969, df: 2, ms: 50741.984, F: 160.989, p: '<.001' },
  within: { ss: 1645598.339, df: 5221, ms: 315.188 },
  total: { ss: 1747082.307, df: 5223 },
  welch: { F: 166.127, df1: 2, df2: 3415.671, p: '<.001' },
  effect: { eta2: 0.058, epsilon2: 0.058, omega2: 0.058, magnitude: 'small' },
};
export const AGE_MODE_SHORT = 'F(2, 5221) = 160.989, p < 0.001 ***, eta2 = 0.058 (small), N = 5224';
export const AGE_MODE_TUKEY: TukeyOut[] = [
  { pair: 'CAPI - CAWI', diff: 5.023, se: 0.593, p: '<.001', lo: 3.633, hi: 6.413 },
  { pair: 'CAPI - MAIL', diff: -6.181, se: 0.595, p: '<.001', lo: -7.577, hi: -4.785 },
  { pair: 'CAWI - MAIL', diff: -11.204, se: 0.626, p: '<.001', lo: -12.671, hi: -9.738 },
];

/** Aufgabe 3: Links-rechts pa01 nach Wohnort gs01 (Codes 1 bis 5). */
export const PA01_GS01: AnovaOut = {
  groups: [
    { label: 'GROSSSTADT', n: 1053, mean: 4.453, sd: 1.855, se: 0.057, lo: 4.341, hi: 4.565 },
    { label: 'VORORT GROSSSTADT', n: 643, mean: 4.846, sd: 1.680, se: 0.066, lo: 4.715, hi: 4.976 },
    { label: 'MITTEL-, KLEINSTADT', n: 1719, mean: 5.043, sd: 1.747, se: 0.042, lo: 4.960, hi: 5.126 },
    { label: 'LAENDL. DORF', n: 1452, mean: 5.120, sd: 1.697, se: 0.045, lo: 5.033, hi: 5.208 },
    { label: 'EINZELHAUS, LAND', n: 62, mean: 5.053, sd: 1.905, se: 0.242, lo: 4.568, hi: 5.537 },
  ],
  between: { ss: 318.601, df: 4, ms: 79.650, F: 26.015, p: '<.001' },
  within: { ss: 15069.633, df: 4922, ms: 3.062 },
  welch: { F: 24.149, df1: 4, df2: 433.570, p: '<.001' },
  effect: { eta2: 0.021, epsilon2: 0.020, omega2: 0.020, magnitude: 'small' },
};
export const PA01_GS01_TUKEY: TukeyOut[] = [
  { pair: 'GROSSSTADT - VORORT GROSSSTADT', diff: -0.393, se: 0.088, p: '<.001', lo: -0.632, hi: -0.154 },
  { pair: 'GROSSSTADT - MITTEL-, KLEINSTADT', diff: -0.590, se: 0.068, p: '<.001', lo: -0.777, hi: -0.403 },
  { pair: 'GROSSSTADT - LAENDL. DORF', diff: -0.668, se: 0.071, p: '<.001', lo: -0.861, hi: -0.474 },
  { pair: 'GROSSSTADT - EINZELHAUS, LAND', diff: -0.600, se: 0.229, p: '.067', lo: -1.225, hi: 0.025 },
  { pair: 'VORORT GROSSSTADT - MITTEL-, KLEINSTADT', diff: -0.197, se: 0.081, p: '.105', lo: -0.418, hi: 0.023 },
  { pair: 'VORORT GROSSSTADT - LAENDL. DORF', diff: -0.275, se: 0.083, p: '.008', lo: -0.501, hi: -0.048 },
  { pair: 'VORORT GROSSSTADT - EINZELHAUS, LAND', diff: -0.207, se: 0.233, p: '.901', lo: -0.843, hi: 0.429 },
  { pair: 'MITTEL-, KLEINSTADT - LAENDL. DORF', diff: -0.077, se: 0.062, p: '.728', lo: -0.247, hi: 0.093 },
  { pair: 'MITTEL-, KLEINSTADT - EINZELHAUS, LAND', diff: -0.010, se: 0.227, p: '1.000', lo: -0.628, hi: 0.609 },
  { pair: 'LAENDL. DORF - EINZELHAUS, LAND', diff: 0.068, se: 0.227, p: '.998', lo: -0.552, hi: 0.688 },
];
export const PA01_GS01_TUKEY_SHORT = 'pa01: 10 comparisons, 4 significant (p < .05)';
/** Gezählte Befragte im Einzelhaus mit gültigem pa01 (gewichtet 62). */
export const PA01_EINZELHAUS_COUNTED = 55;

/* ---------- Korrelationsmatrizen von pearson_cor() %>% summary() ---------- */

export type CorOut = { vars: string[]; r: number[][]; p: string[][]; n: number[][] };

/** Grundlage 4: age, dw15, ls01, hs01 (gewichtet). p wie R druckt; Diagonale leer. */
export const COR_G4: CorOut = {
  vars: ['age', 'dw15', 'ls01', 'hs01'],
  r: [
    [1, -0.036, 0.075, 0.331],
    [-0.036, 1, 0.025, -0.031],
    [0.075, 0.025, 1, -0.380],
    [0.331, -0.031, -0.380, 1],
  ],
  p: [
    ['', '.051', '<.001', '<.001'],
    ['.051', '', '.180', '.087'],
    ['<.001', '.180', '', '<.001'],
    ['<.001', '.087', '<.001', ''],
  ],
  n: [
    [5224, 2957, 5142, 5189],
    [2957, 2968, 2945, 2963],
    [5142, 2945, 5164, 5148],
    [5189, 2963, 5148, 5210],
  ],
};
/** 95-%-KI des stärksten Paars ls01 × hs01. */
export const COR_G4_LS_HS_CI: [number, number] = [-0.403, -0.357];
export const COR_G4_NAMES: Record<string, string> = { age: 'Alter', dw15: 'Arbeitsstunden', ls01: 'Lebenszufriedenheit', hs01: 'Gesundheit (1 = sehr gut … 5 = schlecht)' };

/** Aufgabe 4: pt03, pt12, pt14, pt11, age (gewichtet). Nur zur Prüfung und für die Lösung, nicht auf der Seite. */
export const COR_A4: CorOut = {
  vars: ['pt03', 'pt12', 'pt14', 'pt11', 'age'],
  r: [
    [1, 0.790, 0.464, 0.461, 0.076],
    [0.790, 1, 0.476, 0.516, -0.007],
    [0.464, 0.476, 1, 0.442, 0.071],
    [0.461, 0.516, 0.442, 1, -0.080],
    [0.076, -0.007, 0.071, -0.080, 1],
  ],
  p: [
    ['', '<.001', '<.001', '<.001', '<.001'],
    ['<.001', '', '<.001', '<.001', '.680'],
    ['<.001', '<.001', '', '<.001', '<.001'],
    ['<.001', '<.001', '<.001', '', '<.001'],
    ['<.001', '.680', '<.001', '<.001', ''],
  ],
  n: [
    [3589, 3574, 3578, 3492, 3577],
    [3574, 0, 0, 0, 3592],
    [3578, 0, 0, 0, 3610],
    [3492, 0, 0, 0, 3510],
    [3577, 3592, 3610, 3510, 5224],
  ],
};
export const COR_A4_SHORT = '9/10 pairs significant (p < .05), N = 3492-3610';

/* ---------- Grundlage 1: Stichproben-Maschine (R, set.seed(2026), je 50 Männer und 50 Frauen nach wghtpew) ---------- */

export type MachineVar = 'dw15' | 'ls01';
/** p = 0 heißt „< 0,001“ (R rundet auf 0,000). */
export type Sample = { men: number; women: number; diff: number; lo: number; hi: number; t: number; p: number };
const row = (men: number, women: number, diff: number, lo: number, hi: number, t: number, p: number): Sample => ({ men, women, diff, lo, hi, t, p });

/** Die ersten 20 Stichproben, gerundet wie im Plan (Arbeitsstunden auf 0,1, Lebenszufriedenheit auf 0,01). */
export const SAMPLES: Record<MachineVar, Sample[]> = {
  dw15: [
    row(42.6, 34.2, 8.4, 5.1, 11.6, 5.17, 0), row(41.6, 33.6, 8.1, 4.5, 11.6, 4.49, 0), row(41.1, 32.3, 8.8, 5.2, 12.4, 4.88, 0),
    row(40.1, 34.1, 6.0, 2.3, 9.7, 3.25, 0.002), row(39.6, 33.8, 5.9, 1.5, 10.2, 2.67, 0.009), row(40.1, 33.3, 6.8, 2.9, 10.7, 3.45, 0.001),
    row(40.0, 31.6, 8.4, 4.7, 12.2, 4.48, 0), row(41.6, 30.3, 11.3, 7.5, 15.1, 5.92, 0), row(43.0, 34.6, 8.4, 4.9, 11.9, 4.77, 0),
    row(39.3, 31.2, 8.1, 4.1, 12.2, 4.00, 0), row(41.5, 34.4, 7.1, 3.7, 10.6, 4.12, 0), row(40.0, 34.1, 5.9, 1.8, 10.0, 2.84, 0.006),
    row(42.1, 33.7, 8.4, 4.8, 11.9, 4.60, 0), row(40.0, 32.9, 7.1, 4.2, 10.0, 4.86, 0), row(42.1, 35.0, 7.2, 3.8, 10.5, 4.19, 0),
    row(39.6, 33.6, 6.1, 2.0, 10.2, 2.93, 0.004), row(43.5, 32.7, 10.8, 6.7, 14.9, 5.22, 0), row(41.1, 32.4, 8.7, 4.5, 12.8, 4.17, 0),
    row(41.8, 33.7, 8.0, 4.0, 12.1, 3.94, 0), row(41.0, 34.9, 6.1, 2.3, 9.9, 3.19, 0.002),
  ],
  ls01: [
    row(7.18, 7.68, -0.50, -1.20, 0.20, -1.41, 0.16), row(7.64, 7.40, 0.24, -0.42, 0.90, 0.72, 0.47), row(7.40, 7.56, -0.16, -0.88, 0.56, -0.44, 0.66),
    row(7.10, 7.44, -0.34, -1.14, 0.46, -0.85, 0.40), row(7.24, 7.26, -0.02, -0.80, 0.76, -0.05, 0.96), row(7.10, 7.42, -0.32, -1.12, 0.48, -0.79, 0.43),
    row(7.32, 7.46, -0.14, -0.94, 0.66, -0.35, 0.73), row(7.14, 7.24, -0.10, -0.94, 0.74, -0.24, 0.81), row(7.60, 7.68, -0.08, -0.80, 0.64, -0.22, 0.83),
    row(7.84, 7.68, 0.16, -0.55, 0.87, 0.45, 0.66), row(7.38, 7.80, -0.42, -1.12, 0.28, -1.19, 0.24), row(7.10, 7.70, -0.60, -1.33, 0.13, -1.62, 0.11),
    row(7.92, 7.42, 0.50, -0.11, 1.11, 1.62, 0.11), row(7.38, 7.46, -0.08, -0.79, 0.63, -0.22, 0.82), row(7.02, 7.40, -0.38, -1.20, 0.44, -0.91, 0.36),
    row(7.68, 7.44, 0.24, -0.50, 0.98, 0.64, 0.52), row(7.74, 7.64, 0.10, -0.57, 0.77, 0.30, 0.77), row(7.14, 7.44, -0.30, -1.07, 0.47, -0.77, 0.44),
    row(7.30, 7.02, 0.28, -0.47, 1.03, 0.74, 0.46), row(7.14, 7.42, -0.28, -1.07, 0.51, -0.70, 0.49),
  ],
};

/** Stapel aller 1.000 Stichproben. Arbeitsstunden: Kisten [k, k + 1) von 1 bis 14. Lebenszufriedenheit: zwölf Kisten zu 0,2 von −1,2 bis 1,2, symmetrisch um 0. */
export const STACKS: Record<MachineVar, number[]> = {
  dw15: [1, 3, 5, 33, 95, 163, 196, 214, 149, 89, 41, 9, 2],
  ls01: [4, 16, 43, 101, 165, 176, 185, 159, 87, 42, 18, 4],
};
/** Wahrer Unterschied im ganzen (gewichteten) ALLBUS, Männer minus Frauen. */
export const TRUE_DIFF: Record<MachineVar, number> = { dw15: 7.99, ls01: -0.01 };
export const MACHINE: Record<MachineVar, { name: string; unit: string; decimals: number; early: string; all: string }> = {
  dw15: {
    name: 'Arbeitsstunden', unit: 'Stunden', decimals: 1,
    early: 'Jede Stichprobe zeigt einen anderen Unterschied. Aber bisher liegt jeder deutlich über 0.',
    all: 'Die Unterschiede der 1.000 Stichproben bilden annähernd eine Normalverteilung, eine Glocke um den wahren Unterschied von 7,99 Stunden. Sie reichen von 1,5 bis 13,8 Stunden, keiner liegt bei 0 oder darunter. Die typische Abweichung vom wahren Wert, der Standardfehler, ist 1,83 Stunden.',
  },
  ls01: {
    name: 'Lebenszufriedenheit', unit: 'Punkte', decimals: 2,
    early: 'Mal liegen die Männer vorn, mal die Frauen. Die Unterschiede pendeln um 0.',
    all: 'Auch hier annähernd eine Normalverteilung, eine Glocke, aber um 0: Im Mittel liegt der Unterschied bei −0,01. Einzelne Stichproben zeigen trotzdem gut einen Punkt Unterschied (bis 1,14), mal für die Männer, mal für die Frauen. Der Standardfehler ist 0,38 Punkte.',
  },
};
export const MACHINE_SHAPE = 'Die Stichprobenverteilung der Arbeitsstunden hat die Form einer Glocke (Normalverteilung) mit dem Gipfel bei 8 bis 9 Stunden; die der Lebenszufriedenheit eine Glocke mit dem Gipfel bei 0.';
/** Kennzahlen der 1.000 Stichproben (für Texte und Prüfung). */
export const MACHINE_FACTS = {
  dw15: { sd: 1.83, min: 1.5, max: 13.8, significant: 993, ciHitsTruth: 963 },
  ls01: { sd: 0.38, maxAbs: 1.14, falseAlarms: 54, atLeast05: 199, atLeast06: 127, atLeast08: 42, ciHitsTruth: 945 },
};

/* ---------- Grundlage 2a: n-Regler (konstruiert: Unterschied 0,3, Standardabweichung 2 in beiden Gruppen) ---------- */

export type NStep = { n: number; se: number; t: number; p: number; lo: number; hi: number };
/** p = 0 heißt „< 0,001“. */
export const N_STEPS: NStep[] = [
  { n: 25, se: 0.57, t: 0.53, p: 0.598, lo: -0.84, hi: 1.44 },
  { n: 50, se: 0.40, t: 0.75, p: 0.455, lo: -0.49, hi: 1.09 },
  { n: 100, se: 0.28, t: 1.06, p: 0.290, lo: -0.26, hi: 0.86 },
  { n: 200, se: 0.20, t: 1.50, p: 0.134, lo: -0.09, hi: 0.69 },
  { n: 400, se: 0.14, t: 2.12, p: 0.034, lo: 0.02, hi: 0.58 },
  { n: 800, se: 0.10, t: 3.00, p: 0.003, lo: 0.10, hi: 0.50 },
  { n: 1600, se: 0.07, t: 4.24, p: 0, lo: 0.16, hi: 0.44 },
  { n: 2500, se: 0.06, t: 5.30, p: 0, lo: 0.19, hi: 0.41 },
];
export const N_DIFF = 0.3;
export const N_SD = 2;
export const N_FEEDBACK = {
  open: 'Nicht signifikant: Das Intervall enthält die 0.',
  significant: 'Signifikant: Das Intervall enthält die 0 nicht mehr. Der Unterschied ist derselbe geblieben, nur die Stichprobe ist größer.',
  fixed: 'Die Effektstärke bleibt bei jeder Stufe 0,15.',
};

/* ---------- Grundlage 2c: Welch gegen Student (konstruiert) ---------- */

export const WELCH_EXAMPLE = {
  a: { n: 400, sd: 1 }, b: { n: 40, sd: 3 }, diff: 0.8,
  student: { pooledSd: 1.31, se: 0.22, t: 3.69, p: 0.0003 },
  welch: { se: 0.48, t: 1.68, p: 0.10, parts: [0.0025, 0.225] },
};

/* ---------- Grundlage 3a: Paare zählen ---------- */

export const ALARM: { groups: number; pairs: number; risk: number }[] = [
  { groups: 2, pairs: 1, risk: 5.0 },
  { groups: 3, pairs: 3, risk: 14.3 },
  { groups: 4, pairs: 6, risk: 26.5 },
  { groups: 5, pairs: 10, risk: 40.1 },
  { groups: 6, pairs: 15, risk: 53.7 },
];

/* ---------- Grundlage 3b: F-Labor (konstruiert: drei Gruppen zu je sechs) ---------- */

export const F_LAB_SPREADS = [{ s: 0.5, label: 'klein' }, { s: 1, label: 'mittel' }, { s: 2, label: 'groß' }];
export const F_LAB_DISTANCES = [0, 0.5, 1, 2];
/** Abweichungen der sechs Steine vom Gruppenmittel, mal s. */
export const F_LAB_OFFSETS = [-2, -1, 0, 0, 1, 2];
export const F_LAB_GRAND = 5;
/** p = 0 heißt „< 0,001“. */
export type FLabRow = { s: number; a: number; ssBetween: number; ssWithin: number; msBetween: number; msWithin: number; F: number; p: number; eta2: number };
const lab = (s: number, a: number, ssBetween: number, ssWithin: number, msBetween: number, msWithin: number, F: number, p: number, eta2: number): FLabRow =>
  ({ s, a, ssBetween, ssWithin, msBetween, msWithin, F, p, eta2 });
export const F_LAB: FLabRow[] = [
  lab(0.5, 0, 0, 7.5, 0, 0.5, 0, 1, 0), lab(0.5, 0.5, 3, 7.5, 1.5, 0.5, 3, 0.080, 0.29),
  lab(0.5, 1, 12, 7.5, 6, 0.5, 12, 0.001, 0.62), lab(0.5, 2, 48, 7.5, 24, 0.5, 48, 0, 0.86),
  lab(1, 0, 0, 30, 0, 2, 0, 1, 0), lab(1, 0.5, 3, 30, 1.5, 2, 0.75, 0.489, 0.09),
  lab(1, 1, 12, 30, 6, 2, 3, 0.080, 0.29), lab(1, 2, 48, 30, 24, 2, 12, 0.001, 0.62),
  lab(2, 0, 0, 120, 0, 8, 0, 1, 0), lab(2, 0.5, 3, 120, 1.5, 8, 0.19, 0.831, 0.02),
  lab(2, 1, 12, 120, 6, 8, 0.75, 0.489, 0.09), lab(2, 2, 48, 120, 24, 8, 3, 0.080, 0.29),
];
export const F_LAB_FEEDBACK = {
  none: 'Alle Gruppen liegen gleich: kein Unterschied zwischen den Gruppenmittelwerten, F = 0.',
  large: 'Die Gruppen liegen weit auseinander im Vergleich zur Streuung in ihnen: F ist groß, p klein.',
  small: 'Die Streuung in den Gruppen überdeckt den Abstand: F ist klein, nicht signifikant.',
  ratio: 'Doppelter Abstand und doppelte Streuung ergeben dasselbe F. Es zählt das Verhältnis.',
};

/* ---------- Codevorlagen ---------- */

export type Template = { title: string; code: string; tryOut?: boolean };
const ABITUR = '    abitur = rec(educ, rules = "1:3=0 [ohne Abitur]; 4:5=1 [mit Abitur]; else=NA")';
/** ⟦…⟧ markiert Stellen, die angepasst werden. Jede Vorlage läuft für sich (nur `allbus` muss existieren). */
export const TEMPLATES: Record<string, Template> = {
  start: { title: 'Startblock', code: `# Startblock: Pakete laden, Daten einlesen
library(tidyverse)
library(mariposa)

allbus <- read_spss("ZA8831_v1-3-0.sav")` },
  r_ttest: { title: 'Ein t-Test in R', code: `# t-Test: Arbeitsstunden von Männern und Frauen, gewichtet
allbus %>%
  mutate(
    geschlecht = rec(sex, rules = "1=1 [Mann]; 2=2 [Frau]; else=NA")
  ) %>%
  t_test(dw15, group = geschlecht, weights = wghtpew) %>%
  summary()` },
  a1_kurz: { title: 'Vorlage 1: Gruppen bilden und testen', code: `# t-Test: Unterschied zwischen ohne und mit Abitur, gewichtet
allbus %>%
  mutate(
${ABITUR}
  ) %>%
  t_test(⟦age⟧, group = abitur, weights = wghtpew)` },
  a1_tabelle: { title: 'Vorlage 2: die ganze Tabelle', code: `# Dieselbe Rechnung mit der ganzen Tabelle
# abitur bilden: wie in Schritt 1
allbus %>%
  mutate(
${ABITUR}
  ) %>%
  t_test(pt03, group = abitur, weights = wghtpew) %>%
  summary()` },
  frei_a1: { tryOut: true, title: 'Deine Probier-Werkstatt', code: `# Eine Idee: Vertrauen in die Polizei (pt14) mit und ohne Abitur
# abitur bilden: wie in Schritt 1
allbus %>%
  mutate(
${ABITUR}
  ) %>%
  t_test(pt14, group = abitur, weights = wghtpew)
` },
  a2_alle: { title: 'Vorlage 1: alle Befragten', code: `# Lebenszufriedenheit ohne und mit Abitur, alle Befragten
# abitur bilden: wie in Aufgabe 1
allbus %>%
  mutate(
${ABITUR}
  ) %>%
  t_test(ls01, group = abitur, weights = wghtpew) %>%
  summary()` },
  a2_jung: { title: 'Vorlage 2: nur Befragte unter 30', code: `# Dasselbe nur für Befragte unter 30 Jahren
# abitur bilden: wie in Aufgabe 1
allbus %>%
  filter(age < 30) %>%
  mutate(
${ABITUR}
  ) %>%
  t_test(ls01, group = abitur, weights = wghtpew) %>%
  summary()` },
  frei_a2: { tryOut: true, title: 'Deine Probier-Werkstatt', code: `# Eine Idee: Befragte ab 65 Jahren
# abitur bilden: wie in Aufgabe 1
allbus %>%
  filter(age >= 65) %>%
  mutate(
${ABITUR}
  ) %>%
  t_test(ls01, group = abitur, weights = wghtpew)
` },
  a3_anova: { title: 'Vorlage 1: die ANOVA', code: `# ANOVA: Mittelwerte von mehr als zwei Gruppen vergleichen, gewichtet
allbus %>%
  oneway_anova(⟦age⟧, group = ⟦mode⟧, weights = wghtpew) %>%
  summary()` },
  a3_tukey: { title: 'Vorlage 2: der Tukey-Test', code: `# Tukey: Welche Paare unterscheiden sich?
allbus %>%
  oneway_anova(pa01, group = gs01, weights = wghtpew) %>%
  tukey_test() %>%
  summary()` },
  frei_a3: { tryOut: true, title: 'Deine Probier-Werkstatt', code: `# Eine Idee: Lebenszufriedenheit nach Familienstand
allbus %>%
  oneway_anova(ls01, group = mstat, weights = wghtpew) %>%
  tukey_test() %>%
  summary()
` },
  a4_matrix: { title: 'Vorlage: die Korrelationsmatrix', code: `# Korrelationsmatrix: Vertrauen in vier Institutionen und Alter, gewichtet
allbus %>%
  pearson_cor(pt03, pt12, pt14, pt11, age, weights = wghtpew) %>%
  summary()` },
  frei_a4: { tryOut: true, title: 'Deine Probier-Werkstatt', code: `# Eine Idee: neun Vertrauensfragen auf einmal
allbus %>%
  pearson_cor(pt01, pt02, pt03, pt08, pt09, pt10, pt12, pt14, pt15, weights = wghtpew)
` },
};

/* ---------- Antworten prüfen ---------- */

type Extra = { short?: string; help?: string };
const choice = (id: string, label: string, options: [string, string][], target: string, right: string, hint: string, extra: Extra = {}): Question =>
  ({ id, label, kind: 'choice', options: options.map(([value, l]) => ({ value, label: l })), target, right, hint, ...extra });
const number = (id: string, label: string, target: number, right: string, hint: string, extra: Extra & { tolerance?: number } = {}): Question =>
  ({ id, label, kind: 'number', target, right, hint, ...extra });

const WITH_SIGN = 'Mit Vorzeichen, so wie R es druckt.';

export const QUESTIONS: Record<'a1' | 'a2' | 'a3' | 'a4', Question[]> = {
  a1: [
    choice('a1a', 'Welche Gruppe vertraut dem Bundestag im Mittel mehr?', [['ohne', 'ohne Abitur'], ['mit', 'mit Abitur']], 'mit',
      'Mit Abitur: im Mittel 4,35 gegen 3,69 ohne Abitur.',
      'Schau in der Tabelle „Weighted Group Statistics“ auf die Spalte Mean: Welche Zahl ist größer?', { short: 'höheres Vertrauen' }),
    number('a1b', 'Wie groß ist der Unterschied der Mittelwerte (Mean Diff.)?', -0.660,
      '−0,660: Ohne Abitur liegt 0,66 Punkte unter mit Abitur. Das Minus heißt nur, dass die zweite Gruppe (mit Abitur) höher liegt.',
      'Lies die Spalte „Mean Diff.“ in der Zeile „Equal variances not assumed“ und übernimm die Zahl mit Minus, so wie R sie druckt. Hast du noch `age` statt `pt03` in der Vorlage?',
      { tolerance: 0.005, short: 'Unterschied der Mittelwerte', help: 'So, wie R sie druckt, mit Vorzeichen. R schreibt Kommazahlen mit Punkt: `-0.123` heißt −0,123.' }),
    choice('a1d', 'In der Welch-Zeile stehen t = −12,432 und p < .001. Was heißt das?', [
      ['selten', 'Der Unterschied ist gut zwölfmal so groß wie sein Standardfehler. Gäbe es in der Bevölkerung keinen Unterschied, käme ein mindestens so großer in weniger als 1 von 1.000 Stichproben vor.'],
      ['sicher', 'Mit 99,9 % Wahrscheinlichkeit gibt es einen Unterschied.'],
      ['gross', 'Der Unterschied ist sehr groß.'],
    ], 'selten',
      'Genau: t teilt den Unterschied durch seinen ⟪Standardfehler⟫ (Karte 1b). Der ⟪p-Wert⟫ sagt, wie selten ein so großer Unterschied unter der ⟪Nullhypothese⟫ wäre, also ohne echten Unterschied (Karte 1c). Signifikant, also kaum durch Zufall zu erklären.',
      'p sagt nichts über die Größe (dafür gibt es g) und ist keine Wahrscheinlichkeit dafür, dass es einen Unterschied gibt. Lies Karte 1c, „Häufige Verwechslung“. Das Minus vor t zeigt nur, dass die zweite Gruppe (mit Abitur) höher liegt.',
      { short: 't und p', help: 'Die Zahlen stehen in der Zeile „Equal variances not assumed“ und in der Kurzfassung aus Schritt 1.' }),
    choice('a1e', 'Was sagt das 95-%-Konfidenzintervall von −0,764 bis −0,556?', [
      ['bereich', 'In der Bevölkerung liegt der Unterschied plausibel zwischen etwa 0,56 und 0,76 Punkten zugunsten der Gruppe mit Abitur.'],
      ['personen', '95 % der Befragten liegen zwischen −0,764 und −0,556.'],
      ['genau', 'Der Unterschied ist zu 95 % genau −0,660.'],
    ], 'bereich',
      'Richtig. Das ⟪Konfidenzintervall⟫ gibt an, wo der Unterschied in der Grundgesamtheit plausibel liegt. Die 0 liegt nicht darin, darum ist der Unterschied signifikant.',
      'Das Intervall beschreibt den Unterschied der Mittelwerte, nicht einzelne Personen. Es ist ein Bereich plausibler Werte, keine Wahrscheinlichkeit für einen einzelnen Wert.',
      { short: 'Konfidenzintervall' }),
    choice('a1f', 'Wie groß ist der Unterschied nach Hedges\' g?', [
      ['vernachl', 'vernachlässigbar (unter 0,2)'], ['klein', 'klein (0,2 bis unter 0,5)'], ['mittel', 'mittel (0,5 bis unter 0,8)'], ['gross', 'groß (ab 0,8)'],
    ], 'klein',
      '⟪Hedges\' g|hedges-g⟫ = −0,42: nach der ⟪Faustregel nach Cohen⟫ ein kleiner Effekt, mariposa schreibt „small“. Der Unterschied beträgt etwa zwei Fünftel einer Standardabweichung.',
      'Lies die Spalte Hedges\' g unter „Effect Sizes“ (−0,419) und lass das Minus weg; es zeigt nur die Richtung. Vergleiche den Betrag mit den Grenzen in Karte 1d.',
      { short: 'Hedges\' g', help: 'Unter „Effect Sizes“, Spalte Hedges\' g.' }),
  ],
  a2: [
    number('a2a', 'Alle Befragten: Welches Hedges\' g zeigt R?', -0.179,
      'g = −0,18: vernachlässigbar, mariposa schreibt „negligible“.',
      'Lies unter „Effect Sizes“ die Spalte Hedges\' g aus Schritt 1 und übernimm das Minus.',
      { tolerance: 0.005, short: 'Hedges\' g bei allen', help: WITH_SIGN }),
    choice('a2b', 'Alle Befragten: Was trifft zu?', [['beides', 'signifikant und groß'], ['sig_klein', 'signifikant, aber sehr klein'], ['nichts', 'nicht signifikant']], 'sig_klein',
      'Genau: p < 0,001, also ⟪signifikant⟫. Aber der Unterschied ist nur 0,34 Punkte auf einer Skala von 0 bis 10, und die ⟪Effektstärke⟫ g = −0,18 ist vernachlässigbar. Mit über 5.000 Befragten wird auch ein kleiner Unterschied signifikant.',
      'p ist kleiner als 0,001, also signifikant. Die Größe zeigt aber g: unter 0,2 heißt vernachlässigbar.', { short: 'signifikant oder groß' }),
    number('a2c', 'Unter 30: Wie groß ist der Unterschied der Mittelwerte (Mean Diff.)?', -0.986,
      '−0,986: Bei den Jüngeren liegen die ohne Abitur fast einen Punkt niedriger.',
      'Nimm die Ausgabe aus Schritt 2, Spalte Mean Diff., mit Minus.', { tolerance: 0.005, short: 'Unterschied unter 30', help: WITH_SIGN }),
    choice('a2d', 'Unter 30: Warum ist das Intervall in der Welch-Zeile breiter (−1,371 bis −0,600 statt −1,304 bis −0,667)?', [
      ['streuung', 'Die kleine Gruppe ohne Abitur (178) streut stärker (2,43 gegen 1,60); Welch rechnet ihre Unsicherheit ehrlich ein.'],
      ['fehler', 'R hat sich in einer der Zeilen verrechnet.'],
      ['gewicht', 'Welch rechnet ohne Gewicht.'],
    ], 'streuung',
      'Genau wie in Karte 2c: ungleich große Gruppen, und die kleine streut stärker. Student nimmt gleiche Streuungen an (⟪Varianzhomogenität⟫) und unterschätzt dann die Unsicherheit. Beide Zeilen sind hier signifikant, aber der ⟪Welch-Test⟫ ist der ehrlichere.',
      'Beide Zeilen rechnen richtig und beide gewichtet. Schau auf N und Std. Deviation in der Gruppentabelle und lies Karte 2c.', { short: 'breiteres Intervall' }),
  ],
  a3: [
    choice('a3a', 'Wo stehen die Befragten im Mittel am weitesten links?', [
      ['1', 'Großstadt'], ['2', 'Vorort einer Großstadt'], ['3', 'Mittel- oder Kleinstadt'], ['4', 'ländliches Dorf'], ['5', 'Einzelgehöft'],
    ], '1',
      'Großstadt: 4,45. Die anderen liegen zwischen 4,85 (Vorort) und 5,12 (Dorf).',
      '1 heißt links, 10 rechts: Gesucht ist der kleinste Mittelwert in der Spalte Mean. Hast du `age` und `mode` getauscht?',
      { short: 'am weitesten links', help: 'Kleinere Zahl = weiter links.' }),
    number('a3b', 'Welchen F-Wert zeigt die Zeile „Between Groups“?', 26.015,
      'F = 26,015 mit 4 und 4.922 Freiheitsgraden, p < 0,001: Mindestens ein Wohnort unterscheidet sich.',
      'Lies in „Weighted ANOVA Results“ die Spalte F in der Zeile „Between Groups“. Steht bei dir 160.989, hast du noch `age` und `mode` in der Vorlage.',
      { tolerance: 0.01, short: 'F-Wert', help: 'R schreibt Kommazahlen mit Punkt: `12.345` heißt 12,345.' }),
    choice('a3d', 'Lies unter „Effect Sizes“ das Eta Squared (η²). Was bedeutet der Wert?', [
      ['anteil', 'Etwa 2 % der Unterschiede in der Links-rechts-Einstufung gehen mit dem Wohnort einher; 98 % liegen innerhalb der Wohnorte.'],
      ['anteil6', 'Etwa 6 % der Unterschiede in der Links-rechts-Einstufung gehen mit dem Wohnort einher.'],
      ['personen', '2 % der Befragten wohnen in der Großstadt.'],
    ], 'anteil',
      'Genau: ⟪η²⟫ = 0,021, mariposa schreibt „small“. Der Unterschied ist signifikant, aber die ⟪Effektstärke⟫ ist klein: Innerhalb jedes Wohnorts gibt es fast die ganze Bandbreite von links bis rechts.',
      'η² ist ein Anteil an der gesamten Streuung, keine Zahl von Personen. R schreibt `0.021`, das sind 2,1 %. Steht bei dir 0.058, hast du noch `age` und `mode` in der Vorlage (das sind die 6 % aus Grundlage 3). Lies Karte 3b, „Häufige Verwechslung“.',
      { short: 'Eta-Quadrat', help: 'Unter „Effect Sizes“, Spalte Eta Squared.' }),
    number('a3e', 'Wie viele der zehn Paare unterscheiden sich laut Tukey signifikant?', 4,
      'Vier: Großstadt gegen Vorort, gegen Mittel-/Kleinstadt und gegen Dorf; dazu Vorort gegen Dorf.',
      'Zähl in der Tukey-Tabelle die Zeilen mit p-value unter .05 (mit Sternen). Die Kurzfassung ohne `summary()` nennt die Zahl auch.',
      { short: 'signifikante Paare', help: 'Zeilen mit Sternen zählen.' }),
    choice('a3f', 'Großstadt gegen Einzelgehöft: Der Unterschied (−0,600) ist fast so groß wie Großstadt gegen Dorf (−0,668), aber nicht signifikant (p = .067). Warum?', [
      ['wenige', 'Auf Einzelgehöften leben nur 62 Befragte (gewichtet); der Standardfehler ist groß, das Intervall (−1,225 bis 0,025) reicht über die 0.'],
      ['gleich', 'Auf Einzelgehöften steht man genauso links wie in der Großstadt.'],
      ['fehler', 'Tukey hat sich verrechnet.'],
    ], 'wenige',
      'Genau: Mit wenigen Befragten ist der Mittelwert unsicher (⟪Standardfehler⟫ 0,229 statt 0,071). Nicht signifikant heißt hier „nicht entschieden“, nicht „gleich“.',
      'Schau auf N in der Gruppentabelle (62) und auf Std. Error in der Tukey-Zeile. Nicht signifikant heißt nicht „kein Unterschied“ (Karte 1c).', { short: 'Einzelgehöft' }),
  ],
  a4: [
    number('a4a', 'Wie groß ist r zwischen Vertrauen in den Bundestag und in die Bundesregierung?', 0.790,
      'r = 0,79: ein sehr starker Zusammenhang. Wer dem einen vertraut, vertraut meist auch der anderen.',
      'Such die Zelle in Zeile `pt03`, Spalte `pt12` (oder umgekehrt) und lies die Zahl ohne Sterne.',
      { tolerance: 0.005, short: 'r Bundestag und Bundesregierung', help: 'R schreibt Kommazahlen mit Punkt: `0.123` heißt 0,123.' }),
    number('a4b', 'Wie viele der zehn Paare sind signifikant?', 9,
      'Neun von zehn. Nur Vertrauen in die Bundesregierung und Alter hängen nicht signifikant zusammen (r = −0,007, p = 0,680).',
      'Zähl in einer Hälfte der Matrix die Zellen mit Sternen, ohne die Diagonale. Die Kurzfassung ohne `summary()` nennt die Zahl auch.',
      { short: 'signifikante Paare', help: 'Diagonale nicht mitzählen.' }),
    choice('a4c', 'Alter und Vertrauen in den Bundestag: r = 0,076***. Was folgt daraus?', [
      ['schwach', 'Signifikant, aber sehr schwach: Mit dem Alter steigt das Vertrauen kaum.'],
      ['stark', 'Ältere vertrauen dem Bundestag viel mehr.'],
      ['nichts', 'Kein Zusammenhang, weil r unter 0,1 liegt.'],
    ], 'schwach',
      'Genau wie bei t-Test und ANOVA: Bei über 3.500 Befragten wird auch ein kleiner Zusammenhang signifikant. Groß ist er nicht.',
      'Die Sterne sagen „kaum Zufall“, die Zahl sagt die Stärke. 0,076 ist sehr schwach, aber nicht null.', { short: 'Alter und Bundestag' }),
    choice('a4d', 'Warum steht in der „Sample Size Matrix“ nicht überall dieselbe Zahl?', [
      ['paarweise', 'Jedes Paar nutzt alle, die bei beiden Variablen geantwortet haben.'],
      ['gewicht', 'Das Gewicht ändert sich von Paar zu Paar.'],
      ['fehler', 'Einige Werte wurden doppelt gezählt.'],
    ], 'paarweise',
      'Richtig: ⟪paarweiser Ausschluss⟫. Das Alter haben fast alle angegeben (5.224), die Vertrauensfragen wurden nur etwa zwei Dritteln der Befragten gestellt.',
      'Schau auf die Zeile `age`: Mit sich selbst hat das Alter 5.224, mit den Vertrauensfragen nur gut 3.500. Lies Marke ④ in Grundlage 4.', { short: 'Fallzahlen je Paar' }),
  ],
};

/** Pflichtaufgaben: Aufgabe 1 und Aufgabe 3. */
export const REQUIRED: Question[] = [...QUESTIONS.a1, ...QUESTIONS.a3];

/* ---------- Kurz überlegen in den Grundlagen und Zuordnen im Überblick ---------- */

export const G1B_Q: Question = choice('g1b', 'Die Gruppen wären viermal so groß, Unterschied und Streuung bleiben gleich. Was passiert mit t?',
  [['gleich', 't bleibt gleich'], ['doppelt', 't wird etwa doppelt so groß'], ['vier', 't wird viermal so groß']], 'doppelt',
  'Genau: Unter der Wurzel steht die Anzahl im Nenner. Viermal so viele Befragte machen den Standardfehler halb so groß (Wurzel aus 4 ist 2), und damit wird t doppelt so groß.',
  'Schau auf das Rauschen: Die Anzahl steht unter einer Wurzel. Viermal so viele Befragte halbieren den Standardfehler, t wird also doppelt so groß.',
  { short: 'viermal so große Gruppen' });

export const G1C_Q: Question = choice('g1c', 'In Stichprobe 12 liegen die Frauen 0,60 Punkte vorn, p = 0,11, Intervall −1,33 bis 0,13. Was folgt daraus?', [
  ['frauen', 'Frauen sind zufriedener als Männer.'],
  ['kein_beleg', 'Die Stichprobe reicht nicht als Beleg: Ein Unterschied dieser Größe entsteht auch ohne echten Unterschied leicht.'],
  ['gleich', 'Männer und Frauen sind sicher gleich zufrieden.'],
], 'kein_beleg',
  'Genau. p = 0,11 liegt über 0,05, und die 0 liegt im Intervall. Das heißt nicht, dass beide gleich sind; diese Stichprobe kann es nur nicht entscheiden.',
  'p = 0,11 liegt über 0,05, und das Intervall reicht über die 0. Damit ist der Unterschied kein Beleg für Frauen vorn, aber auch kein Beweis für Gleichheit: Nicht signifikant heißt nur „nicht entschieden“.',
  { short: 'Stichprobe 12' });

export const G2C_Q: Question = choice('g2c', 'In welcher Lage unterscheiden sich die beiden Zeilen der R-Ausgabe am stärksten?', [
  ['gleich', 'gleich große Gruppen, gleiche Streuung'],
  ['ungleich', 'ungleich große Gruppen, und die kleine Gruppe streut stärker'],
  ['gross', 'sehr große Gruppen'],
], 'ungleich',
  'Genau. Dann verlässt sich Student zu sehr auf die große Gruppe. Welch rechnet ehrlicher.',
  'Bei gleich großen Gruppen oder gleicher Streuung kommen beide fast auf dasselbe. Auseinander gehen sie, wenn eine kleine Gruppe stärker streut als eine große.',
  { short: 'zwei Zeilen' });

const UE_OPTIONS: [string, string][] = [['t', 't-Test'], ['anova', 'ANOVA und Tukey'], ['r', 'Korrelation(smatrix)'], ['kreuz', 'Kreuztabelle']];
const assign = (id: string, label: string, target: string, why: string, short: string): Question => choice(id, label, UE_OPTIONS, target, why, why, { short });
/** Überblick Ü1: welches Verfahren? Rückmeldung bei richtig und falsch gleich (wie Sitzung 4). */
export const UE_QUESTIONS: Question[] = [
  assign('ue1', 'Verdienen Menschen in Ost und West im Mittel gleich viel (Nettoeinkommen in Euro)?', 't', 'Eine metrische Variable, zwei Gruppen: t-Test.', 'Einkommen in Ost und West'),
  assign('ue2', 'Unterscheidet sich die Lebenszufriedenheit (0 bis 10) zwischen den fünf Schichten?', 'anova', 'Metrisch behandelt, fünf Gruppen: ANOVA, danach Tukey für die Paare.', 'Zufriedenheit nach Schicht'),
  assign('ue3', 'Hängen Alter, Einkommen und Arbeitsstunden miteinander zusammen?', 'r', 'Drei metrische Variablen, keine Gruppen: Korrelationsmatrix.', 'Alter, Einkommen, Stunden'),
  assign('ue4', 'Wählen Frauen und Männer verschiedene Parteien?', 'kreuz', 'Die Partei ist nominal, ein Mittelwert ergibt keinen Sinn: Kreuztabelle (Sitzung 5).', 'Partei nach Geschlecht'),
];

/* ---------- Erst festlegen ---------- */

export type Prediction = { id: string; prompt: string; options: string[]; /** Vergleich nach dem Prüfen, je gewählter Option. */ compare: Record<string, string> };
const PLACES: [string, string, string][] = [
  ['Großstadt', 'die Großstadt', '4,45'], ['Vorort einer Großstadt', 'der Vorort einer Großstadt', '4,85'], ['Mittel- oder Kleinstadt', 'die Mittel- oder Kleinstadt', '5,04'],
  ['ländliches Dorf', 'das ländliche Dorf', '5,12'], ['Einzelgehöft', 'das Einzelgehöft', '5,05'],
];
export const PREDICTIONS: Record<'a1' | 'a2' | 'a3' | 'a4', Prediction> = {
  a1: {
    id: 'a1-tipp', prompt: 'Welche Gruppe vertraut dem Bundestag im Mittel mehr?', options: ['ohne Abitur', 'mit Abitur', 'beide etwa gleich'],
    compare: {
      'mit Abitur': 'Dein Tipp: mit Abitur. Stimmt: 4,35 gegen 3,69.',
      'ohne Abitur': 'Dein Tipp: ohne Abitur. Die Daten sagen das Gegenteil: Mit Abitur liegt das Vertrauen bei 4,35, ohne bei 3,69.',
      'beide etwa gleich': 'Dein Tipp: etwa gleich. Der Unterschied ist 0,66 Punkte, und er ist deutlich größer als der Zufall (t = −12,4).',
    },
  },
  a2: {
    id: 'a2-tipp', prompt: 'Bei wem ist der Unterschied zwischen ohne und mit Abitur größer?', options: ['bei allen Befragten', 'bei den unter 30-Jährigen', 'etwa gleich'],
    compare: {
      'bei den unter 30-Jährigen': 'Dein Tipp: bei den Jüngeren. Stimmt: fast ein Punkt (0,99) gegen 0,34 bei allen.',
      'bei allen Befragten': 'Dein Tipp: bei allen. Die Daten zeigen das Gegenteil: Bei den unter 30-Jährigen ist der Unterschied fast dreimal so groß (0,99 gegen 0,34).',
      'etwa gleich': 'Dein Tipp: etwa gleich. Bei den unter 30-Jährigen sind es 0,99 Punkte, bei allen 0,34.',
    },
  },
  a3: {
    id: 'a3-tipp', prompt: 'Wo stehen die Befragten im Mittel am weitesten links?', options: PLACES.map(p => p[0]),
    compare: Object.fromEntries(PLACES.map(([label, phrase, mean], i) => [label, i === 0
      ? 'Dein Tipp: Großstadt. Stimmt: 4,45, alle anderen liegen zwischen 4,85 und 5,12.'
      : `Dein Tipp: ${label}. Am weitesten links steht die Großstadt (4,45); ${phrase} liegt bei ${mean}.`])),
  },
  a4: {
    id: 'a4-tipp', prompt: 'Welche zwei Institutionen hängen im Vertrauen am stärksten zusammen?', options: ['Bundestag und Bundesregierung', 'Bundestag und Polizei', 'Polizei und Hochschulen'],
    compare: {
      'Bundestag und Bundesregierung': 'Dein Tipp stimmt: r = 0,79.',
      'Bundestag und Polizei': 'Dein Tipp: Bundestag und Polizei (r = 0,46). Am stärksten hängen Bundestag und Bundesregierung zusammen: r = 0,79.',
      'Polizei und Hochschulen': 'Dein Tipp: Polizei und Hochschulen (r = 0,44). Am stärksten hängen Bundestag und Bundesregierung zusammen: r = 0,79.',
    },
  },
};

/* ---------- Hilfe in drei Stufen ---------- */

/** Stufe 1 Denkanstoß, Stufe 2 Wo schaue ich?, Stufe 3 Lösung; Code in `Backticks`. */
export const HINTS: Record<'a1' | 'a2' | 'a3' | 'a4', [string, string, string]> = {
  a1: [
    'Der t-Test vergleicht zwei Mittelwerte und fragt, ob der Unterschied größer ist als der Zufall. Du brauchst aus der Ausgabe: beide Mittelwerte, den Unterschied, t, p und das Intervall aus der Welch-Zeile und Hedges\' g.',
    'Mittelwerte: Tabelle „Weighted Group Statistics“, Spalte Mean. Unterschied, t, p und Intervall: Zeile „Equal variances not assumed“. Effektstärke: „Effect Sizes“, Spalte Hedges\' g. Steht bei dir noch `age` in der ersten Vorlage, tausche es gegen `pt03`.',
    'Ohne Abitur 3,69, mit Abitur 4,35. Unterschied −0,660 (das Minus heißt: mit Abitur liegt höher), t = −12,432, p < 0,001, 95-%-KI −0,764 bis −0,556, Hedges\' g = −0,42 (klein). Als Satz: Befragte mit Abitur vertrauen dem Bundestag im Mittel etwas mehr (4,35 gegen 3,69 auf der Skala von 1 bis 7). Der Unterschied ist signifikant, aber klein.',
  ],
  a2: [
    'Signifikant sagt: kaum Zufall. Groß sagt die Effektstärke. Beides kann auseinanderfallen.',
    'Hedges\' g steht unter „Effect Sizes“, der Unterschied in der Spalte Mean Diff. Für die Frage nach den Zeilen vergleiche die Spalten SE Diff. und 95% CI in den beiden Zeilen und die Spalten N und Std. Deviation oben.',
    'Alle: Unterschied −0,343, p < 0,001, g = −0,18: signifikant, aber vernachlässigbar. Unter 30: Unterschied −0,986, g = −0,53 (mittel). Die kleine Gruppe ohne Abitur (178) streut stärker (2,43) als die große mit Abitur (491; 1,60). Darum ist der Standardfehler bei Welch größer (0,196 statt 0,162) und das Intervall breiter.',
  ],
  a3: [
    'Erst fragt die ANOVA: Unterscheiden sich irgendwelche Wohnorte? Dann fragt Tukey: welche genau? Und η² sagt, wie viel der Wohnort überhaupt erklärt.',
    'Mittelwerte: „Weighted Descriptive Statistics“, Spalte Mean. F: Zeile „Between Groups“. η²: „Effect Sizes“. Paare: Tukey-Tabelle, Spalte p-value. Achte darauf, dass in der ersten Vorlage `pa01` und `gs01` stehen.',
    'Großstadt 4,45, Vorort 4,85, Mittel-/Kleinstadt 5,04, Dorf 5,12, Einzelgehöft 5,05. F(4, 4922) = 26,015, p < 0,001; Welch 24,149, ebenfalls p < 0,001. η² = 0,021: klein. Tukey: Die Großstadt unterscheidet sich von Vorort, Mittel-/Kleinstadt und Dorf, der Vorort vom Dorf. Zwischen Mittel-/Kleinstadt und Dorf ist kein Unterschied nachweisbar (p = .728; mit 0,08 Punkten wäre er ohnehin winzig). Das Einzelgehöft (62 Befragte, gewichtet) ist zu klein für eine Aussage. Als Satz: Großstädter stufen sich im Mittel etwas weiter links ein (um 0,4 bis 0,7 Punkte auf der Skala von 1 bis 10); der Wohnort erklärt aber nur rund 2 % der Unterschiede.',
  ],
  a4: [
    'Eine Matrix ist nur eine Sammlung von Paaren. Lies eine Hälfte, ohne die Diagonale.',
    'Stärke: Correlation Matrix. Signifikanz: Sterne oder Significance Matrix. Fallzahlen: Sample Size Matrix.',
    'Stärkstes Paar Bundestag und Bundesregierung, r = 0,790. Die fünf anderen Vertrauenspaare liegen zwischen 0,44 und 0,52. Neun von zehn Paaren signifikant; nicht signifikant ist Bundesregierung und Alter (−0,007, p = 0,680). Mit dem Alter hängen alle Vertrauensfragen nur sehr schwach zusammen (−0,08 bis 0,08). Die N sind verschieden, weil jedes Paar alle nimmt, die bei beiden geantwortet haben.',
  ],
};
/** Aufgabe 1: Musterformulierung, erscheint erst in Hilfe Stufe 3. */
export const A1_MODEL = '„Befragte mit Abitur vertrauen dem Bundestag im Mittel etwas mehr als Befragte ohne Abitur (4,35 gegen 3,69 auf einer Skala von 1 bis 7; Unterschied 0,66 Punkte, 95-%-KI 0,56 bis 0,76; Welch-t = −12,43, p < 0,001; Hedges\' g = −0,42, ein kleiner Effekt; ALLBUS 2023, gewichtet, gewichtetes N = 3.505).“';

/* ---------- Hilfe bei R-Fehlermeldungen ---------- */

/** Text mit Code-Stücken und Links, ohne JSX. */
export type Rich = (string | { code: string } | { href: string; text: string })[];
export const ERROR_HELP_TITLE = 'Hilfe: R meldet einen Fehler';
export const ERROR_HELP_CAPTION = 'Was R sagt, was passiert ist und was du tust';
export const ERROR_HELP: { says: Rich; why: Rich; helps: Rich }[] = [
  {
    says: [{ code: 'Grouping variable `mode` must have exactly 2 groups. ✖ Found 3: "CAPI", "CAWI", and "MAIL". ℹ For 3 or more groups use `oneway_anova()`' }],
    why: [{ code: 't_test()' }, ' vergleicht genau zwei Gruppen; die Gruppenvariable hat mehr. (Genauso bei ', { code: 'sex' }, ': Found 3: "MANN", "FRAU", and "DIVERS".)'],
    helps: ['Für drei oder mehr Gruppen ', { code: 'oneway_anova()' }, ' nehmen, oder mit ', { code: 'rec()' }, ' zwei Gruppen bilden wie bei ', { code: 'abitur' }, '.'],
  },
  {
    says: [{ code: "Can't select columns that don't exist. ✖ Column `abitur` doesn't exist." }],
    why: [{ code: 'abitur' }, ' gibt es nur, wenn die ', { code: 'mutate()' }, '-Zeilen davor mitlaufen.'],
    helps: ['Die ganze Vorlage ausführen, nicht nur die letzte Zeile (in RStudio alles markieren, dann Strg/Cmd+Enter).'],
  },
  {
    says: [{ code: 'Variable `pa01` is not numeric. `oneway_anova()` requires numeric dependent variables.' }],
    why: ['Die abhängige Variable wurde vorher mit ', { code: 'to_label()' }, ' in Wörter übersetzt.'],
    helps: [{ code: 'to_label()' }, ' für die abhängige Variable weglassen; mit Wörtern kann R keinen Mittelwert rechnen. (Für die Gruppenvariable stört ', { code: 'to_label()' }, ' nicht.)'],
  },
  {
    says: [{ code: 'Argument `group` is missing, with no default.' }],
    why: [{ code: 'group =' }, ' fehlt vor der Gruppenvariable.'],
    helps: [{ code: 'oneway_anova(pa01, group = gs01, …)' }, ' schreiben.'],
  },
  {
    says: [{ code: 'Unknown argument `weight` … Did you mean `weights` instead of `weight`?' }],
    why: ['Tippfehler beim Gewicht.'],
    helps: [{ code: 'weights = wghtpew' }, ', mit s.'],
  },
  {
    says: [{ code: '`tukey_test()` is not available for objects of class <t_test>.' }],
    why: ['Tukey hinter einem t-Test.'],
    helps: ['Bei zwei Gruppen brauchst du kein Tukey; der t-Test ist schon der Paarvergleich. Tukey nur hinter ', { code: 'oneway_anova()' }, '.'],
  },
  {
    says: [{ code: '`tukey_test()` is not available for objects of class <summary.oneway_anova>.' }],
    why: [{ code: 'summary()' }, ' steht vor ', { code: 'tukey_test()' }, '.'],
    helps: ['Reihenfolge: ', { code: 'oneway_anova(…) %>%' }, ' → ', { code: 'tukey_test() %>%' }, ' → ', { code: 'summary()' }, '.'],
  },
  {
    says: [{ code: 'could not find function "t_test"' }, ' (deutsch: ', { code: 'konnte Funktion "t_test" nicht finden' }, ')'],
    why: ['mariposa ist nicht geladen.'],
    helps: [{ href: '#r1', text: 'Startblock' }, ' ausführen (', { code: 'library(mariposa)' }, ').'],
  },
  {
    says: ['Keine Meldung, aber nur eine Zeile ', { code: 't(…) = …' }],
    why: [{ code: 'summary()' }, ' fehlt; das ist die Kurzfassung.'],
    helps: [{ code: '%>%' }, ' ans Zeilenende, darunter ', { code: 'summary()' }, '.'],
  },
  {
    says: ['Keine Meldung, aber zwei Blöcke „t-Test: pt03“ und „t-Test: abitur“ mit sehr großem t, ohne „Groups compared“'],
    why: [{ code: 'group =' }, ' fehlt; R testet jede Variable für sich gegen 0.'],
    helps: [{ code: 't_test(pt03, group = abitur, weights = wghtpew)' }, ' schreiben.'],
  },
];

/* ---------- Prüf dich selbst ---------- */

export const SELF_TEST: { question: string; options: string[]; answer: number; why: string }[] = [
  {
    question: 'Ein t-Test mit 5.000 Befragten ergibt p < 0,001 und Hedges\' g = 0,05. Was schreibst du?',
    options: ['Ein großer, sicherer Unterschied.', 'Ein signifikanter, aber vernachlässigbar kleiner Unterschied.', 'Kein Unterschied.'], answer: 1,
    why: 'p hängt an der Zahl der Befragten, g nicht. Bei 5.000 Befragten wird auch ein winziger Unterschied signifikant (Grundlage 2a).',
  },
  {
    question: 'Was misst der Standardfehler?',
    options: ['wie stark einzelne Befragte um ihren Mittelwert streuen', 'wie stark Mittelwerte oder Unterschiede von Stichprobe zu Stichprobe schwanken', 'den Fehler, den die Befragten beim Antworten machen'], answer: 1,
    why: 'Die Streuung der Einzelnen ist die Standardabweichung. Der Standardfehler gehört zum Mittelwert und wird mit mehr Befragten kleiner (Grundlage 1a).',
  },
  {
    question: 'Du vergleichst vier Gruppen mit sechs einzelnen t-Tests. Was ist das Problem?',
    options: ['Gibt es in Wahrheit keine Unterschiede, steigt mit sechs Tests die Chance, dass mindestens einer fälschlich anschlägt, auf etwa 26 %.', 't-Tests rechnen bei vier Gruppen falsch.', 'Es gibt kein Problem.'], answer: 0,
    why: 'Jeder Test hat ein Risiko von 5 % für einen Fehler 1. Art (Fehlalarm); bei sechs Paaren sind es zusammen etwa 26,5 % (Alpha-Fehler-Kumulierung). Darum ANOVA und danach Tukey (Grundlage 3a).',
  },
  {
    question: 'Das 95-%-Konfidenzintervall eines Unterschieds reicht von −0,2 bis 0,9. Was gilt?',
    options: ['Der Unterschied ist signifikant.', 'Der Unterschied ist nicht signifikant; ob es einen gibt, bleibt offen.', 'Die Gruppen sind gleich.'], answer: 1,
    why: 'Die 0 liegt im Intervall, also p ≥ 0,05. Das ist kein Beweis für Gleichheit; plausibel sind Werte von −0,2 bis 0,9 (Grundlage 1c).',
  },
  {
    question: 'Welche Zeile der t-Test-Ausgabe liest du, und warum?',
    options: ['„Equal variances assumed“, weil sie zuerst steht.', '„Equal variances not assumed“ (Welch), weil sie keine gleichen Streuungen voraussetzt.', 'Egal, beide sind immer gleich.'], answer: 1,
    why: 'Welch rechnet jede Gruppe mit ihrer eigenen Streuung. Bei ungleich großen Gruppen mit ungleicher Streuung können die Zeilen deutlich auseinandergehen (Grundlage 2c).',
  },
];

/* ---------- Skript zum Mitnehmen ---------- */

export const SCRIPT_FILE = 'sitzung7.R';
/** Reihenfolge wie im Plan; Probier-Ideen als eigener Abschnitt am Ende. Zusatzzeile: was an markierten Stellen zu tauschen ist. */
export const SCRIPT_PARTS: { key: string; note?: string }[] = [
  { key: 'start' },
  { key: 'r_ttest', note: '# R lesen: ein t-Test, Zeile für Zeile' },
  { key: 'a1_kurz', note: '# Aufgabe 1: Tausche age gegen pt03 (Vertrauen in den Bundestag)' },
  { key: 'a1_tabelle' },
  { key: 'a2_alle' },
  { key: 'a2_jung' },
  { key: 'a3_anova', note: '# Aufgabe 3: Tausche age gegen pa01 und mode gegen gs01' },
  { key: 'a3_tukey' },
  { key: 'a4_matrix' },
];
export const SCRIPT_IDEAS = ['frei_a1', 'frei_a2', 'frei_a3', 'frei_a4'];
const scriptBlock = (key: string, note?: string) =>
  `# ---- ${TEMPLATES[key].title} ----\n${note ? `${note}\n` : ''}${parseMarks(TEMPLATES[key].code).code.replace(/\n+$/, '')}\n`;
/** Skript sitzung7.R: alle Vorlagen, Marken mit ihrem Startwert, danach die Ideen zum Weiterdenken. */
export const SCRIPT = '# Sitzung 7: Mittelwerte vergleichen. ALLBUS 2023, gewichtet mit wghtpew.\n'
  + '# Statistikatlas, Methoden Ib, ALLBUS 2023 (ZA8831 v1.3.0)\n'
  + '# Markierte Stellen aus dem Atlas stehen hier mit ihrem Startwert.\n\n'
  + SCRIPT_PARTS.map(p => scriptBlock(p.key, p.note)).join('\n')
  + '\n# ==== Ideen zum Weiterdenken ====\n\n'
  + SCRIPT_IDEAS.map(k => `${parseMarks(TEMPLATES[k].code).code.replace(/\n+$/, '')}\n`).join('\n');

/* ---------- Textfassungen der Bilder ---------- */

export const ALT = {
  stack1c: 'Stichprobenverteilung der 1.000 Unterschiede in der Lebenszufriedenheit, Männer minus Frauen, in Klassen zu 0,2 Punkten von −1,2 bis 1,2. Von 1.000 Stichproben ohne echten Unterschied liegen 127 mindestens 0,6 Punkte von 0 entfernt (in eine der beiden Richtungen: 63 mit den Frauen vorn, 64 mit den Männern vorn), das sind etwa 13 %. Zum Vergleich: 199 liegen mindestens 0,5 Punkte entfernt (etwa 20 %), nur 42 mindestens 0,8 Punkte (etwa 4 %).',
  intervals: 'Alle 20 Intervalle enthalten den wahren Unterschied von 7,99 Stunden, keines enthält die 0. In allen 1.000 Stichproben enthalten 963 Intervalle den wahren Wert, also etwa 96 von 100.',
  ruler: 'Achse von 0 bis 1 Standardabweichung. Unter 0,2 vernachlässigbar, ab 0,2 klein, ab 0,5 mittel, ab 0,8 groß. Lebenszufriedenheit Männer gegen Frauen: 0,005. Arbeitsstunden Männer gegen Frauen: 0,85.',
  meansCi: 'Mittelwerte des Alters mit 95-%-Intervall nach Erhebungsweg, Achse von 40 bis 65 Jahren. CAPI: 51,8 Jahre (51,0 bis 52,6), N = 2.002. CAWI: 46,7 Jahre (45,9 bis 47,6), N = 1.623. MAIL: 58,0 Jahre (57,1 bis 58,8), N = 1.599.',
  tukeyAge: 'CAPI minus CAWI: 5,0 Jahre, p < 0,001, Intervall 3,6 bis 6,4. CAPI minus MAIL: −6,2 Jahre, p < 0,001, Intervall −7,6 bis −4,8. CAWI minus MAIL: −11,2 Jahre, p < 0,001, Intervall −12,7 bis −9,7. Alle drei Paare unterscheiden sich: Online-Befragte sind am jüngsten, Papier-Befragte am ältesten.',
};
