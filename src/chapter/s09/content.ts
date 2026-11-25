// Sitzung 9 „Lineare Regression“: Zahlen, Vorlagen, Fragen und Texte aus sitzung09.md (Inhaltsplan, geprüft 23.11.2026), nur Daten.
// Alle ALLBUS-Zahlen: ZA8831 v1.3.0, gewichtet mit wghtpew, nur Aggregate. Geprüft in allbus.local.test.ts.
// Einzelne Punkte (acht Befragte, neun Befragte, zehn Räume) sind konstruierte Beispiele, geprüft in content.test.ts.
import type { Question } from '../answers';
import { parseMarks } from '../workshop/editor';

/* ---------- Grundlagen: Lebenszufriedenheit (ls01) aus der wirtschaftlichen Lage (ep03 umgepolt = lage) ---------- */

export const LAGE_LABELS = ['sehr schlecht', 'schlecht', 'teils/teils', 'gut', 'sehr gut'];

/** Gewichtete Zellenzahlen aus crosstab(ls01, lage, weights = wghtpew): Zeilen ls01 0 bis 10, Spalten lage 1 bis 5. */
export const LAGE_CROSSTAB: number[][] = [
  [9, 6, 5, 8, 0],
  [2, 14, 5, 7, 1],
  [8, 22, 21, 24, 2],
  [11, 39, 49, 16, 1],
  [11, 36, 78, 48, 1],
  [11, 88, 187, 95, 2],
  [6, 59, 183, 140, 3],
  [10, 73, 372, 518, 26],
  [4, 70, 382, 908, 117],
  [1, 14, 135, 620, 119],
  [4, 15, 74, 367, 105],
];

/** group_by(lage) %>% describe(ls01, weights = wghtpew): Mittelwert, SD und gewichtetes N je Stufe. */
export const LAGE_STAGES = {
  mean: [4.377, 5.641, 6.809, 7.905, 8.680],
  sd: [2.715, 2.228, 1.816, 1.584, 1.269],
  n: [77, 435, 1491, 2751, 378],
};

/** linear_regression(ls01 ~ lage, weights = wghtpew) und was dazugehört. */
export const LAGE_FIT = {
  intercept: 3.570, slope: 1.073, beta: 0.450, r: 0.450, r2: 0.203, adjR2: 0.203, sigma: 1.720, n: 5133,
  F: 1304.29, dfResidual: 5131,
  meanY: 7.398, sdY: 1.926, meanX: 3.568, sdX: 0.808,
  ssRegression: 3858.902, ssResidual: 15182.029, ssTotal: 19040.931,
  /** levene_test(rest, group = lage, weights = wghtpew) mit rest = ls01 − (3.570 + 1.073 × lage). */
  levene: { F: 67.176, df1: 4, df2: 5128.5 },
  /** Mittelwert je Stufe minus Gerade, mit ungerundeten Koeffizienten (Grundlage 4, „Und im ALLBUS?“). */
  deviations: [-0.266, -0.074, 0.020, 0.043, -0.255],
};
/** Vorhersagen der Geraden 3,570 + 1,073 × Lage für Lage 1 bis 5. */
export const LAGE_PREDICTIONS = [4.643, 5.716, 6.789, 7.862, 8.935];
/** Anstieg der Geraden von „sehr schlecht“ bis „sehr gut“ (4 × 1,073). */
export const LAGE_RISE = 4.29;

/** Die Ausgabe von summary() für ls01 ~ lage, wie R sie druckt, ohne Trennstriche und ohne ANOVA und Collinearity (Bild B0). */
export const SUMMARY_LINES = [
  'Weighted Linear Regression Results',
  '- Formula: ls01 ~ lage',
  '- Method: ENTER (all predictors)',
  '- N: 5133',
  '- Weights: wghtpew',
  '- Note: labelled predictor lage entered with its numeric codes, as SPSS REGRESSION does.',
  '  Use to_label() first to enter it as dummy-coded categories.',
  '',
  '  Descriptive Statistics',
  '  Variable   Mean  Std. Deviation     N',
  '  ls01      7.398           1.926  5133',
  '  lage      3.568           0.808  5133',
  '',
  '  Model Summary',
  '  R                            0.450',
  '  R Square                     0.203',
  '  Adjusted R Square            0.203',
  '  Std. Error of the Estimate   1.720',
  '',
  '  Coefficients',
  '  Term             B  Std. Error   Beta       t   Sig.  95% CI Lower  95% CI Upper',
  '  (Intercept)  3.570       0.109         32.839  <.001         3.357         3.783  ***',
  '  lage         1.073       0.030  0.450  36.115  <.001         1.015         1.131  ***',
];
/** Die zugeklappten Abschnitte der Ausgabe („… weitere Abschnitte“). */
export const SUMMARY_MORE_LINES = [
  '  ANOVA',
  '  Source      Sum of Squares    df  Mean Square         F   Sig.',
  '  Regression        3858.902     1     3858.902  1304.291  <.001  ***',
  '  Residual         15182.029  5131        2.959',
  '  Total            19040.931  5132',
  '',
  '  Collinearity Statistics',
  '  Term  Tolerance    VIF',
  '  lage      1.000  1.000',
  '  VIF > 10 (Tolerance < 0.1) indicates problematic collinearity.',
  '',
  "Signif. codes: 0 '***' 0.001 '**' 0.01 '*' 0.05",
];

export type OutputPick = { id: string; label: string; cells: { line: number; text: string }[]; text: string };
/** Bild B0: sechs Umschalter über der Ausgabe; `cells` sind die markierten Stellen (Zeile in SUMMARY_LINES, Text). */
export const OUTPUT_PICKS: OutputPick[] = [
  { id: 'konstante', label: 'Konstante', cells: [{ line: 21, text: '3.570' }],
    text: 'Die **Konstante** (auch Achsenabschnitt) steht in der Zeile `(Intercept)`, Spalte B: 3,570. Das ist die Höhe der Geraden bei lage = 0. Mehr in Grundlage 1.' },
  { id: 'steigung', label: 'Steigung', cells: [{ line: 22, text: '1.073' }],
    text: 'Die **Steigung** (Regressionskoeffizient B) steht in der Zeile der UV, Spalte B: 1,073. So viel steigt die Vorhersage pro Stufe. Mehr in Grundlage 1.' },
  { id: 'beta', label: 'Beta', cells: [{ line: 22, text: '0.450' }],
    text: '**Beta** ist die Steigung in Standardabweichungen gemessen (standardisierter Koeffizient). Mit nur einer UV ist Beta gleich der Pearson-Korrelation r aus Sitzung 6; R oben in Model Summary ist dieselbe Zahl ohne Vorzeichen. Für Vorhersagen brauchst du B, nicht Beta.' },
  { id: 'r2', label: 'R²', cells: [{ line: 15, text: '0.203' }],
    text: '**R Square** ist R²: 0,203. Die Gerade erklärt gut 20 % der Streuung der Lebenszufriedenheit. Mehr in Grundlage 2.' },
  { id: 'fehler', label: 'Standardfehler der Schätzung', cells: [{ line: 17, text: '1.720' }],
    text: '**Std. Error of the Estimate** ist der Standardfehler der Schätzung. Er sagt, wie weit die Vorhersage typischerweise danebenliegt: 1,72 Punkte. Mehr in Grundlage 2.' },
  { id: 'n', label: 'N', cells: [{ line: 3, text: '5133' }, { line: 10, text: '5133' }, { line: 11, text: '5133' }],
    text: '**N** sind alle, die bei beiden Variablen eine gültige Antwort haben: 5.133. Wer bei einer fehlt, fällt weg.' },
];

/** Ausgabe zur Kontrolle in „R lesen“, Karte R2 (r_kurz ohne summary()). */
export const SHORT_OUTPUT = `Linear Regression: ls01 ~ lage [Weighted]
  R2 = 0.203, adj.R2 = 0.203, F(1, 5131) = 1304.29, p < 0.001 ***, N = 5133
Use summary() for detailed output.`;

/* ---------- Konstruierte Beispiele (keine ALLBUS-Daten) ---------- */

export type Point = { x: number; y: number };
/** Grundlage 2 und 3: acht Befragte, zum Beispiel. Beste Gerade 4 + 1 × Lage, Schwerpunkt (3 | 7). */
export const EIGHT: Point[] = [{ x: 1, y: 4 }, { x: 2, y: 6 }, { x: 2, y: 7 }, { x: 3, y: 6 }, { x: 3, y: 8 }, { x: 4, y: 8 }, { x: 4, y: 9 }, { x: 5, y: 8 }];
export const EIGHT_LINE = { intercept: 4, slope: 1, centre: { x: 3, y: 7 }, sse: 6, sseMean: 18, r2: 0.67 };
/** Grundlage 3b: die neunte Person und die Gerade mit ihr. */
export const NINTH: Point = { x: 5, y: 2 };
export const NINE_LINE = { intercept: 5.8, slope: 0.2, r2: 0.02, r2Exact: 0.015 };
/** Grundlage 4: zehn Räume, zum Beispiel (Raumtemperatur in Grad, Wohlbefinden 0 bis 10). */
export const ROOMS: Point[] = [14, 16, 18, 20, 22, 24, 26, 28, 30, 32].map((x, i) => ({ x, y: [2, 4, 6, 8, 9, 9, 8, 6, 4, 2][i] }));
export const ROOMS_LINE = { intercept: 5.8, slope: 0, r2: 0 };
/** Überblick, Bild „Fächer“: links weit gestreut, rechts eng (nur Form). */
export const FAN: Point[] = [{ x: 1, y: 2 }, { x: 1, y: 8 }, { x: 2, y: 3 }, { x: 2, y: 8 }, { x: 3, y: 5 }, { x: 3, y: 8 }, { x: 4, y: 6.5 }, { x: 4, y: 8 }, { x: 5, y: 7.5 }, { x: 5, y: 8.5 }];

/** Regler in Grundlage 2b: Steigungen −1 bis 3 in Schritten von 0,25 und die Summe der Fehlerquadrate (18 − 24 b + 12 b²). */
export const SLOPES = Array.from({ length: 17 }, (_, i) => -1 + i * 0.25);
export const SSE_BY_SLOPE = [54, 42.75, 33, 24.75, 18, 12.75, 9, 6.75, 6, 6.75, 9, 12.75, 18, 24.75, 33, 42.75, 54];
export const SSE_MAX = 54;

/* ---------- Aufgaben: ALLBUS-Zahlen ---------- */

/** Aufgabe 1 und 2: demo ~ pt03, gewichtet. */
export const A1_FIT = {
  intercept: 2.288, slope: 0.465, beta: 0.588, r: 0.588, r2: 0.346, sigma: 1.031, n: 3575,
  seIntercept: 0.046, seSlope: 0.011, meanDemo: 4.157, sdDemo: 1.274, sdPt03: 1.610, msResidual: 1.063,
  /** Diagnosevarianten für die Rückmeldungen. */
  unweighted: { intercept: 2.168, slope: 0.479 },
  notReversed: { intercept: 4.712, slope: -0.465 },
  swapped: { intercept: 0.929, slope: 0.743 },
  /** Vorhersage pt03 = 7 mit den gedruckten (5,543) und den ungerundeten Koeffizienten (5,545). */
  predict7: 5.543, predict7Exact: 5.545, predict1: 2.753, diff1to7: 2.79,
  /** Befragte, denen ps03 und pt03 nicht gestellt wurden (TNZ: SPLIT), und alle Befragten. */
  split: 1596, all: 5246,
};
/** Aufgabe 2: demo ~ id02, gewichtet. */
export const A2_FIT = {
  intercept: 2.966, slope: 0.412, beta: 0.246, r: 0.246, r2: 0.060, sigma: 1.233, n: 3575, sdId02: 0.759,
  /** Arbeiter- und Mittelschicht, gewichtet, in Prozent (22,17 + 55,98). */
  middle: 78,
};
/** Probier-Idee zu Aufgabe 2: demo ~ ep01 (nicht im Kapitel, nur zur Kontrolle). */
export const EP01_FIT = { slope: -0.746, r2: 0.215, n: 3593 };
/** Aufgabe 3: Residuum je Stufe von pt03 (mit 2.288 und 0.465), gewichtet; N gewichtet gezählt. */
export const A3_STAGES = {
  mean: [-0.289, -0.029, 0.084, 0.157, 0.065, -0.112, -0.405],
  sd: [1.325, 1.250, 1.165, 0.988, 0.853, 0.713, 0.952],
  n: [329, 367, 538, 847, 835, 493, 166],
  /** Mittelwerte, wenn die Zahlen aus Grundlage 1 (3.570, 1.073) stehen bleiben: Stufe 1, 6 und 7. */
  meanUntouched: { 1: -2.179, 6: -5.042, 7: -5.943 },
  levene: { F: 74.86, df1: 6, df2: 3567.9 },
  /** Mittelwert von demo in Stufe 7. */
  demo7: 5.138,
};
/** Aufgabe 4: demo ~ pa01 und die Mittelwerte je Stufe. */
export const A4_FIT = {
  intercept: 4.857, slope: -0.14, beta: -0.193, r2: 0.037, nModel: 3444, predict1: 4.717, predict10: 3.457,
  mean: [3.864, 4.369, 4.549, 4.488, 4.175, 4.057, 3.811, 3.845, 2.776, 2.536],
  sd1: 1.339,
  nStage: [106, 163, 508, 481, 945, 719, 286, 160, 37, 38],
};

/* ---------- Codevorlagen ---------- */

export type Template = { title: string; code: string; tryOut?: boolean };
/** ⟦…⟧ markiert Stellen, die angepasst werden. Wörtlich aus sitzung09.md. */
export const TEMPLATES: Record<string, Template> = {
  start: { title: 'Startblock', code: `# Pakete laden und Daten einlesen
library(tidyverse)
library(mariposa)

allbus <- read_spss("ZA8831_v1-3-0.sav")` },
  r_kurz: { title: 'Regression: Lebenszufriedenheit aus der Lage, kurz', code: `# Lineare Regression: Lebenszufriedenheit aus der wirtschaftlichen Lage vorhersagen
# (ep03 umpolen wie in Sitzung 5: hohe Zahl = gute Lage)
allbus %>%
  mutate(
    lage = rec(ep03, rules = "rev")
  ) %>%
  linear_regression(ls01 ~ lage, weights = wghtpew)` },
  r_summary: { title: 'Regression: Lebenszufriedenheit aus der Lage, ausführlich', code: `# Dieselbe Regression ausführlich: mit summary() wie in Sitzung 7
allbus %>%
  mutate(
    lage = rec(ep03, rules = "rev")
  ) %>%
  linear_regression(ls01 ~ lage, weights = wghtpew) %>%
  summary()` },
  a1: { title: 'Aufgabe 1: Zufriedenheit mit der Demokratie aus dem Vertrauen', code: `# Zufriedenheit mit der Demokratie umpolen (hohe Zahl = zufrieden),
# dann aus dem Vertrauen in den Bundestag vorhersagen
allbus %>%
  mutate(
    demo = rec(ps03, rules = "rev")
  ) %>%
  linear_regression(demo ~ pt03, weights = wghtpew) %>%
  summary()` },
  a1r: { title: 'Aufgabe 1: Vorhersage von Hand', code: `# Vorhersage von Hand: Konstante + Steigung * Wert
# (hier noch das Beispiel aus Grundlage 1: lage = 4)
⟦3.570⟧ + ⟦1.073⟧ * ⟦4⟧` },
  frei_a1: { tryOut: true, title: 'Deine Probier-Werkstatt', code: `# Eine Idee: die Seiten tauschen und das Vertrauen aus der Zufriedenheit vorhersagen
allbus %>%
  mutate(
    demo = rec(ps03, rules = "rev")
  ) %>%
  linear_regression(pt03 ~ demo, weights = wghtpew) %>%
  summary()
` },
  a2: { title: 'Aufgabe 2: R² vergleichen (pt03, dann id02)', code: `# Wie gut sagt eine Frage die Zufriedenheit mit der Demokratie vorher?
# (umpolen wie in Aufgabe 1)
allbus %>%
  mutate(
    demo = rec(ps03, rules = "rev")
  ) %>%
  linear_regression(demo ~ ⟦pt03⟧, weights = wghtpew) %>%
  summary()` },
  frei_a2: { tryOut: true, title: 'Deine Probier-Werkstatt', code: `# Eine Idee: die Wirtschaftslage in Deutschland (ep01, 1 = sehr gut) als Vorhersage
allbus %>%
  mutate(
    demo = rec(ps03, rules = "rev")
  ) %>%
  linear_regression(demo ~ ep01, weights = wghtpew) %>%
  summary()
` },
  a3: { title: 'Aufgabe 3: Residuen je Stufe und Levene-Test', code: `# Vorhersage und Residuum für jede Person (umpolen wie in Aufgabe 1)
allbus <- allbus %>%
  mutate(
    demo       = rec(ps03, rules = "rev"),
    vorhersage = ⟦3.570⟧ + ⟦1.073⟧ * pt03,
    residuum   = demo - vorhersage
  )

# Mittelwert und Streuung des Residuums, getrennt für jede Stufe des Vertrauens
allbus %>%
  drop_na(residuum) %>%
  group_by(pt03) %>%
  describe(residuum, weights = wghtpew, show = c("mean", "sd"))

# Test: Streut das Residuum in allen Stufen gleich stark?
allbus %>%
  levene_test(residuum, group = pt03, weights = wghtpew)` },
  frei_a3: { tryOut: true, title: 'Deine Probier-Werkstatt', code: `# Eine Idee: das Residuum je Stufe als Boxplots (wie in Sitzung 4)
allbus %>%
  mutate(
    demo       = rec(ps03, rules = "rev"),
    vorhersage = 2.288 + 0.465 * pt03,
    residuum   = demo - vorhersage
  ) %>%
  drop_na(residuum) %>%
  to_label(pt03) %>%
  ggplot(aes(x = pt03, y = residuum)) +
  geom_boxplot()
` },
  a4: { title: 'Aufgabe 4: Gerade und Mittelwerte je Stufe', code: `# Links-rechts und Zufriedenheit mit der Demokratie (umpolen wie in Aufgabe 1)
allbus <- allbus %>%
  mutate(
    demo = rec(ps03, rules = "rev")
  )

# Die Gerade
allbus %>%
  linear_regression(demo ~ pa01, weights = wghtpew) %>%
  summary()

# Mittelwerte je Stufe der Links-rechts-Einstufung
allbus %>%
  drop_na(demo, pa01) %>%
  group_by(pa01) %>%
  describe(demo, weights = wghtpew, show = c("mean", "sd"))` },
  a4r: { title: 'Aufgabe 4: Vorhersage für ganz links', code: `# Vorhersage von Hand für „ganz links“ (pa01 = 1)
# (hier noch das Beispiel aus Grundlage 1: lage = 4)
⟦3.570⟧ + ⟦1.073⟧ * ⟦4⟧` },
  frei_a4: { tryOut: true, title: 'Deine Probier-Werkstatt', code: `# Eine Idee: die Lebenszufriedenheit nach Links-rechts
allbus %>%
  drop_na(ls01, pa01) %>%
  group_by(pa01) %>%
  describe(ls01, weights = wghtpew, show = c("mean", "sd"))
` },
};

/* ---------- Fragen mit Sonderfällen ---------- */

/** Eine falsche Zahl, die einen eigenen Hinweis bekommt (Toleranz wie die Frage, wenn nicht angegeben). */
export type Special = { at: number[]; text: string; tolerance?: number };
/**
 * Frage dieser Sitzung: wie `Question`, dazu Sonderfälle für bestimmte falsche Zahlen (`special`)
 * und eigene Rückmeldungen für bestimmte falsche Optionen (`wrong`). Ohne Treffer gilt `hint`.
 */
export type S9Question = Question & { special?: Special[]; wrong?: Record<string, string> };

type Extra = { short?: string; help?: string; special?: Special[]; wrong?: Record<string, string> };
const choice = (id: string, label: string, options: [string, string][], target: string, right: string, hint: string, extra: Extra = {}): S9Question =>
  ({ id, label, kind: 'choice', options: options.map(([value, l]) => ({ value, label: l })), target, right, hint, ...extra });
const number = (id: string, label: string, target: number, right: string, hint: string, extra: Extra & { tolerance?: number } = {}): S9Question =>
  ({ id, label, kind: 'number', target, right, hint, ...extra });
const sp = (at: number | number[], text: string, tolerance?: number): Special => ({ at: Array.isArray(at) ? at : [at], text, tolerance });

/** Antwortfragen der vier Aufgaben, Ids wie im Plan. */
export const QUESTIONS: Record<'a1' | 'a2' | 'a3' | 'a4', S9Question[]> = {
  a1: [
    number('a1a', 'Wie groß ist die Konstante?', 2.288, 'Konstante 2,288 (Zeile `(Intercept)`, Spalte B).',
      'Lies in Coefficients die Zeile `(Intercept)`, Spalte B.',
      { tolerance: 0.001, short: 'Konstante', help: 'Zahl aus Spalte B, so wie R sie zeigt.', special: [
        sp(0.046, 'Das ist der Standardfehler (Std. Error). Gesucht ist B.'),
        sp(4.157, 'Das ist der Mittelwert von demo (Descriptive Statistics). Gesucht ist B in der Zeile (Intercept).'),
        sp(2.168, 'Das stimmt ohne Gewicht. Steht `weights = wghtpew` noch in deiner Vorlage?'),
        sp(4.712, 'Diese Zahl kommt heraus, wenn ps03 nicht umgepolt ist. Rechne mit `demo`.'),
      ] }),
    number('a1b', 'Wie groß ist die Steigung?', 0.465, 'Steigung 0,465 (Zeile `pt03`, Spalte B).',
      'Lies die Zeile `pt03`, Spalte B.',
      { tolerance: 0.001, short: 'Steigung', special: [
        sp(0.588, 'Das ist Beta, der standardisierte Koeffizient. Für die Gerade brauchst du B.'),
        sp(0.011, 'Das ist der Standardfehler.'),
        sp(0.479, 'Das stimmt ohne Gewicht. Steht `weights = wghtpew` noch in deiner Vorlage?'),
        sp(-0.465, 'Das Vorzeichen ist gedreht: ps03 ist nicht umgepolt. Rechne mit `demo`.'),
        sp(0.743, 'Das ist die Gerade mit getauschten Seiten (pt03 ~ demo). Gesucht ist demo ~ pt03.'),
      ] }),
    number('a1c', 'Welche Zufriedenheit sagt die Gerade für Menschen mit großem Vertrauen (pt03 = 7) vorher?', 5.543,
      '5,543: 2,288 + 0,465 × 7. Auf der Skala bis 6 ist das „ziemlich“ bis „sehr zufrieden“.',
      'Setz in Schritt 3 Konstante, Steigung und 7 ein.',
      { tolerance: 0.005, short: 'Vorhersage für pt03 = 7', help: 'Ergebnis aus Schritt 3.', special: [
        sp(7.862, 'Das ist noch das Beispiel aus Grundlage 1. Tausch alle drei markierten Zahlen.'),
        sp(2.753, 'Das ist die Vorhersage für pt03 = 1. Gefragt ist großes Vertrauen, 7.'),
        sp(2.79, 'Das ist der Unterschied zwischen 1 und 7. Gefragt ist die Vorhersage selbst.'),
        sp(19.271, 'Erst mal, dann plus: (2,288 + 0,465) × 7 ist zu viel. In R rechnet `2.288 + 0.465 * 7` richtig.'),
      ] }),
    choice('a1d', 'Was bedeutet die Steigung 0,465?', [
      ['a', 'Mit jeder Stufe mehr Vertrauen in den Bundestag liegt die vorhergesagte Zufriedenheit mit der Demokratie um knapp einen halben Punkt höher.'],
      ['b', '46,5 % der Befragten sind mit der Demokratie zufrieden.'],
      ['c', 'Wer dem Bundestag eine Stufe mehr vertraut, wird dadurch um 0,465 Punkte zufriedener.'],
    ], 'a', 'Genau: B ist die Änderung der Vorhersage pro Stufe der UV, in Punkten der AV.',
    'B ist die Änderung der Vorhersage pro Stufe der UV, in Punkten der AV.',
    { short: 'Steigung in Worten', wrong: {
      b: 'B ist kein Prozentwert. Es ist die Änderung in Punkten der Zufriedenheit pro Stufe Vertrauen.',
      c: '„Wird dadurch zufriedener“ behauptet eine ⟪Ursache|kausalitaet⟫. Die Regression zeigt nur: Wer mehr vertraut, ist im Mittel zufriedener. Es kann auch umgekehrt sein, oder beides hat eine ⟪gemeinsame Ursache|confounding⟫ (Zusammenhang ist keine Ursache, kennst du aus Sitzung 5).',
    } }),
    choice('a1e', 'Was bedeutet hier die Konstante?', [
      ['a', 'die vorhergesagte Zufriedenheit bei Vertrauen 0, einer Stufe, die es nicht gibt'],
      ['b', 'die Zufriedenheit der Menschen ganz ohne Vertrauen (Stufe 1)'],
      ['c', 'die durchschnittliche Zufriedenheit aller Befragten'],
    ], 'a', 'Genau. pt03 läuft von 1 bis 7; bei 0 gibt es niemanden. Die ⟪Konstante⟫ ist hier nur der Achsenabschnitt: die Höhe der Geraden bei pt03 = 0, wo sie die y-Achse schneiden würde. Du brauchst sie zum Rechnen, deuten kannst du sie hier nicht.',
    'Die Konstante ist die Höhe der Geraden beim Wert 0 der UV.',
    { short: 'Konstante in Worten', wrong: {
      b: 'Für Stufe 1 sagt die Gerade 2,288 + 0,465 = 2,753 vorher. Die Konstante gilt für den Wert 0.',
      c: 'Der Durchschnitt aller ist 4,157 (Descriptive Statistics).',
    } }),
    number('a1f', 'Wie viele Befragte rechnen mit (N)?', 3575, '3.575: alle, die beide Fragen gültig beantwortet haben.',
      'Lies oben die Zeile `- N:`.',
      { short: 'N', help: 'Aus `summary()`, Zeile `- N:`.', special: [
        sp(5246, 'Das sind alle Befragten. ps03 und pt03 standen nur in einem Teil der Fragebögen (TNZ: SPLIT); es rechnen nur die mit, die beide gültig beantwortet haben.'),
      ] }),
  ],
  a2: [
    number('a2a', 'Wie groß ist R² mit dem Vertrauen in den Bundestag (pt03)?', 0.346, 'R² = 0,346.',
      'Lies R Square im Abschnitt Model Summary.',
      { tolerance: 0.001, short: 'R² mit pt03', help: 'Aus Schritt 1, Model Summary.', special: [
        sp(34.6, 'In Prozent richtig gedacht. Trag die Zahl so ein, wie R sie zeigt: 0.346.', 0.05),
        sp(0.588, 'Das ist R, die Korrelation. R² ist R mal R.'),
      ] }),
    choice('a2b', 'Was heißt R² = 0,346?', [
      ['a', 'Mit dem Vertrauen sind die quadrierten Residuen zusammen gut ein Drittel kleiner als ohne UV.'],
      ['b', '34,6 % der Befragten sind mit der Demokratie zufrieden.'],
      ['c', 'Die Vorhersage stimmt bei 34,6 % der Befragten genau.'],
    ], 'a', 'Genau: ⟪R²⟫ vergleicht die Gerade mit dem Mittelwert. Gut ein Drittel der Streuung der Zufriedenheit hängt mit dem Vertrauen zusammen.',
    'R² vergleicht die Quadratsumme der Residuen mit und ohne UV.',
    { short: 'R² in Worten', wrong: {
      b: 'R² sagt nichts darüber, wie viele zufrieden sind. Es vergleicht die Quadratsumme der Residuen mit und ohne UV.',
      c: 'Genau treffen muss die Gerade niemanden. R² sagt, um wie viel die Quadratsumme der Residuen kleiner wird.',
    } }),
    number('a2c', 'Wie weit liegt die Vorhersage mit pt03 typischerweise daneben (Std. Error of the Estimate)?', 1.031,
      '1,031 Punkte. Ohne Vertrauen, nur mit dem Mittelwert, wären es 1,274 (Standardabweichung von demo).',
      'Lies Std. Error of the Estimate.',
      { tolerance: 0.001, short: 'Std. Error of the Estimate', help: 'Aus Schritt 1, Model Summary.', special: [
        sp(1.274, 'Das ist die Standardabweichung von demo: So weit liegt der Mittelwert allein typischerweise daneben. Gesucht ist der Fehler der Geraden.'),
        sp(1.063, 'Das ist Mean Square in der ANOVA-Tabelle, ein quadrierter Wert.'),
        sp(0.046, 'Das ist der Standardfehler der Konstante.'),
      ] }),
    number('a2d', 'Wie groß ist R² mit der Schicht (id02)?', 0.060, 'R² = 0,060: Mit der Schicht ist die Quadratsumme der Residuen nur um 6 % kleiner als mit dem Mittelwert.',
      'Tausch in Schritt 2 pt03 gegen id02.',
      { tolerance: 0.001, short: 'R² mit id02', help: 'Aus Schritt 2.', special: [
        sp(0.346, 'Das ist noch das Ergebnis für pt03. Tausch die markierte Stelle gegen id02.'),
        sp(0.246, 'Das ist R. Gesucht ist R Square.'),
      ] }),
    number('a2e', 'Wie groß ist die Steigung (B) der Schicht?', 0.412,
      '0,412: Mit jeder Schicht höher liegt die vorhergesagte Zufriedenheit um 0,41 Punkte höher, fast so viel wie pro Stufe Vertrauen (0,465).',
      'Zeile id02, Spalte B.',
      { tolerance: 0.001, short: 'Steigung der Schicht', help: 'Aus Schritt 2, Coefficients.', special: [
        sp(0.246, 'Das ist Beta. Gesucht ist B.'),
        sp(2.966, 'Das ist die Konstante.'),
        sp(0.465, 'Das ist noch die Steigung von pt03.'),
      ] }),
    choice('a2f', 'Die Steigungen sind fast gleich. Warum sagt die Schicht trotzdem viel weniger vorher?', [
      ['a', 'Bei der Schicht liegen die Befragten viel weiter von der Geraden entfernt; R² misst die Nähe der Punkte, nicht die Steilheit.'],
      ['b', 'Die Schicht hat weniger Stufen, darum ist ihre Gerade ungenauer berechnet.'],
      ['c', 'Bei der Schicht haben weniger Befragte geantwortet.'],
    ], 'a', 'Genau. Steigung und R² beantworten verschiedene Fragen: wie viel sich die Vorhersage ändert, und wie nah die Punkte an der Geraden liegen. Der ⟪Standardfehler der Schätzung⟫ (Std. Error of the Estimate) zeigt es auch: 1,233 bei der Schicht gegen 1,031 beim Vertrauen. Dazu kommt: Gut drei Viertel ordnen sich der Arbeiter- oder Mittelschicht zu (⟪Anteil|relative-haeufigkeit⟫ 78 %); die Schicht streut wenig (Standardabweichung 0,76 gegen 1,61 beim Vertrauen). Über so wenige genutzte Stufen ändert auch eine steile Gerade die Vorhersage kaum.',
    'Steigung und R² beantworten verschiedene Fragen.',
    { short: 'Steigung und R²', wrong: {
      b: 'Die Zahl der Stufen ist nicht der Grund. Vergleiche Std. Error of the Estimate: 1,233 bei der Schicht, 1,031 beim Vertrauen.',
      c: 'Beide Rechnungen haben N = 3.575. An der Zahl der Befragten liegt es nicht.',
    } }),
  ],
  a3: [
    choice('a3a', 'In welcher Stufe des Vertrauens streut das Residuum am wenigsten?', [
      ['s1', '1 (gar kein Vertrauen)'], ['s2', '2'], ['s3', '3'], ['s4', '4'], ['s5', '5'], ['s6', '6'], ['s7', '7 (großes Vertrauen)'],
    ], 's6', 'Stufe 6: SD 0,713. Hier liegt die Gerade am nächsten an den Befragten.',
    'Vergleiche die Spalte SD der sieben Tabellen; die sechste Tabelle ist Stufe 6.',
    { short: 'kleinste Streuung', help: 'Die Tabellen stehen in der Reihenfolge 1 bis 7.', wrong: {
      s7: 'Stufe 7 hat SD 0,952. Eine Tabelle davor ist es weniger.',
      s1: 'Stufe 1 hat die größte SD, 1,325.',
    } }),
    number('a3b', 'Wie stark streut das Residuum bei Menschen ganz ohne Vertrauen (Stufe 1)?', 1.325,
      '1,325, fast doppelt so viel wie in Stufe 6 (0,713) und mehr als der ⟪Standardfehler der Schätzung⟫ insgesamt (1,031).',
      'Erste Tabelle (GAR KEIN VERTRAUEN), Spalte SD.',
      { tolerance: 0.001, short: 'Streuung in Stufe 1', help: 'Spalte SD, Gruppe GAR KEIN VERTRAUEN.', special: [
        sp([-0.289, -2.179], 'Das ist der Mittelwert (Mean). Gesucht ist SD.'),
        sp(1.031, 'Das ist der Standardfehler der Schätzung für alle zusammen. Gesucht ist die SD in Stufe 1.'),
      ] }),
    number('a3c', 'Um wie viel liegt die Gerade bei großem Vertrauen (Stufe 7) im Mittel daneben (Mittelwert des Residuums)?', -0.405,
      '−0,405: Bei großem Vertrauen sagt die Gerade im Mittel 0,4 Punkte zu viel vorher (5,54 statt 5,14). Die Gerade kommt nahe an das Ende der Skala (6), höher kann niemand antworten; die Befragten bleiben im Mittel darunter.',
      'Letzte Tabelle (GROSSES VERTRAUEN), Spalte Mean.',
      { tolerance: 0.01, short: 'mittleres Residuum in Stufe 7', help: 'Spalte Mean, Gruppe GROSSES VERTRAUEN.', special: [
        sp(-5.943, 'Das ist mit den Zahlen aus Grundlage 1 gerechnet. Tausch in Schritt 1 die markierten Zahlen gegen 2.288 und 0.465.'),
        sp(0.405, 'Achte auf das Minuszeichen: Die Befragten liegen im Mittel unter der Geraden.'),
        sp(0.952, 'Das ist SD. Gesucht ist Mean.', 0.001),
      ] }),
    choice('a3d', 'Was zeigen der Levene-Test (F = 74,86, p < 0,001) und die SD-Werte zusammen?', [
      ['a', 'Die Streuung des Residuums ist nicht in allen Stufen gleich; die Voraussetzung gleicher Fehlervarianz hält nicht. Die größte SD ist fast doppelt so groß wie die kleinste: ein spürbarer Unterschied.'],
      ['b', 'Die Streuungen sind gleich, denn die größte SD ist nicht mehr als doppelt so groß wie die kleinste.'],
      ['c', 'Die Gerade ist falsch berechnet.'],
      ['d', '75 % der Vorhersagen liegen daneben.'],
    ], 'a', 'Genau. Im ⟪Levene-Test⟫ heißt p < 0,001: So verschiedene Streuungen wären bei gleichen Streuungen in der Bevölkerung sehr unwahrscheinlich. Die Größe zeigen die SD-Werte: 1,325 zu 0,713 ist das 1,86-Fache, knapp unter der Faustregel „mehr als doppelt“ aus Sitzung 7. Also: Die Voraussetzung ⟪gleicher Fehlervarianz|gleiche-fehlervarianz⟫ hält nicht, und der Unterschied ist groß genug, um ihn zu berichten.',
    'Der Test sagt, ob die Streuungen verschieden sind, die SD-Werte, wie groß der Unterschied ist.',
    { short: 'Levene-Test und SD', help: 'Letzte Zeile der Ausgabe und die Spalte SD.', wrong: {
      b: 'Die Faustregel sagt, ob ein Unterschied groß ist, nicht ob es ihn gibt. Der Levene-Test zeigt mit p < 0,001, dass die Streuungen nicht gleich sind. Das 1,86-Fache ist knapp unter „deutlich“, aber weit weg von gleich.',
      c: 'Die Gerade ist richtig berechnet. Der Test sagt nur, dass sie nicht für alle gleich genau ist.',
      d: 'F ist keine Prozentzahl. Es misst, wie verschieden die Streuungen sind; p sagt, ob das Zufall sein kann.',
    } }),
    choice('a3e', 'Welcher Satz gehört in einen Bericht?', [
      ['a', 'Die Gerade sagt die Zufriedenheit für Menschen ohne Vertrauen in den Bundestag ungenauer vorher (Streuung der Residuen 1,33) als für Menschen mit viel Vertrauen (0,71 in Stufe 6).'],
      ['b', 'Die Gerade passt für alle gleich gut, denn R² ist 0,35.'],
      ['c', 'Für Menschen ohne Vertrauen ist die Gerade falsch; man sollte sie aus der Auswertung nehmen.'],
    ], 'a', 'Genau. Ein ehrlicher Bericht sagt, für wen die Vorhersage ungenau ist. Hier sind es ausgerechnet die, die dem Bundestag nicht vertrauen.',
    'Ein Bericht sagt, für wen die Vorhersage ungenau ist.',
    { short: 'Bericht', wrong: {
      b: 'R² gilt für alle zusammen. Ob die Gerade für jede Gruppe gleich gut passt, zeigt erst die SD je Stufe.',
      c: 'Niemand wird herausgenommen, nur weil die Gerade für ihn schlechter passt. Man berichtet es.',
    } }),
  ],
  a4: [
    number('a4a', 'Wie groß ist die Steigung (B) von pa01?', -0.14,
      '−0,140: Mit jeder Stufe weiter rechts liegt die vorhergesagte Zufriedenheit um 0,14 Punkte niedriger.',
      'Zeile pa01, Spalte B.',
      { tolerance: 0.001, short: 'Steigung von pa01', help: 'Aus `summary()`, Coefficients.', special: [
        sp(0.14, 'Achte auf das Minus: Die Gerade fällt.'),
        sp(-0.193, 'Das ist Beta. Gesucht ist B.'),
      ] }),
    number('a4b', 'Welche Zufriedenheit sagt die Gerade für „ganz links“ (pa01 = 1) vorher?', 4.717,
      '4,717: 4,857 − 0,140 × 1.',
      'Schritt 2: Konstante 4.857, Steigung −0.140, Wert 1.',
      { tolerance: 0.005, short: 'Vorhersage für ganz links', help: 'Ergebnis aus Schritt 2.', special: [
        sp(7.862, 'Das ist noch das Beispiel aus Grundlage 1.'),
        sp(4.997, 'Die Steigung ist negativ: 4.857 - 0.140 * 1.'),
      ] }),
    number('a4c', 'Wie zufrieden sind die ganz Linken (pa01 = 1) im Mittel tatsächlich?', 3.864,
      '3,864, fast einen Punkt (0,85) weniger, als die Gerade vorhersagt.',
      'Erste Tabelle (LINKS), Spalte Mean.',
      { tolerance: 0.001, short: 'Mittelwert ganz links', help: 'Spalte Mean, Gruppe LINKS.', special: [
        sp(1.339, 'Das ist SD. Gesucht ist Mean.'),
      ] }),
    choice('a4d', 'Welches Muster zeigen die Mittelwerte?', [
      ['a', 'Beide Ränder sind weniger zufrieden als die Mitte; ganz rechts am wenigsten.'],
      ['b', 'Die Zufriedenheit sinkt gleichmäßig von links nach rechts.'],
      ['c', 'Alle Stufen sind etwa gleich zufrieden.'],
    ], 'a', 'Genau: von 3,86 links über 4,55 in Stufe 3 bis 2,54 rechts. Die Mittelwerte steigen erst und fallen dann; rechts liegen sie am tiefsten.',
    'Lies die Mean-Werte der Reihe nach.',
    { short: 'Muster', wrong: {
      b: 'Lies die Mean-Werte der Reihe nach: Von Stufe 1 bis 3 steigen sie, danach fallen sie.',
      c: 'Zwischen 2,54 und 4,55 liegen zwei Punkte, fast die Hälfte der Skala.',
    } }),
    choice('a4e', 'Was folgt daraus für die Gerade?', [
      ['a', 'Sie beschreibt den Zusammenhang schlecht: Den ganz Linken sagt sie den höchsten Wert vorher, obwohl sie unzufriedener sind als die Mitte. Besser die Mittelwerte je Stufe berichten.'],
      ['b', 'Sie ist trotzdem richtig, denn B ist signifikant (p < 0,001).'],
      ['c', 'Sie ist richtig, R² = 0,037 ist nur klein, weil viele nicht geantwortet haben.'],
    ], 'a', 'Genau. Der Zusammenhang ist ⟪nichtlinear⟫: Die Mittelwerte bilden eine Kurve. Damit ist die Voraussetzung ⟪Linearität|linear⟫ verletzt. R² = 0,037 ist auch deshalb so klein, weil eine Gerade diese Kurve nicht abbilden kann.',
    'Vergleiche, was die Gerade vorhersagt, mit den Mittelwerten je Stufe.',
    { short: 'Folgerung', wrong: {
      b: 'Signifikant heißt nur, dass die Steigung nicht 0 ist. Ob eine Gerade die richtige Form ist, sagt p nicht.',
      c: 'Es rechnen 3.444 Befragte mit. R² ist klein, weil die Gerade die Form der Mittelwerte nicht trifft.',
    } }),
  ],
};

/** Pflichtaufgaben: Aufgabe 1, 2 und 3 (Aufgabe 4 ist Zusatz). */
export const REQUIRED: S9Question[] = [...QUESTIONS.a1, ...QUESTIONS.a2, ...QUESTIONS.a3];

/* ---------- Kurz überlegen in den Grundlagen ---------- */

/** Grundlage 1b: Vorhersage für schlechte Lage. */
export const K1B_Q: S9Question = number('k1b-frage', 'Kurz überlegen: Welche Lebenszufriedenheit sagt die Gerade für Befragte mit schlechter Lage (Stufe 2) vorher?', 5.716,
  '5,716: 3,570 + 1,073 × 2. Im Bild ist das die Höhe der grünen Geraden über „schlecht“.',
  'Setz 2 in die Formel ein: 3,570 plus 1,073 mal 2.',
  { tolerance: 0.01, short: 'Vorhersage für schlechte Lage', help: 'Rechne 3,570 plus 1,073 mal 2. Zwei Nachkommastellen reichen.', special: [
    sp(5.641, 'Das ist der Mittelwert der Befragten mit schlechter Lage (die Raute). Gefragt ist der Wert auf der Geraden: Konstante plus Steigung mal 2.'),
    sp(9.286, 'Erst mal, dann plus: Die Steigung wird mit 2 malgenommen, die Konstante nicht.'),
  ] });

/** Grundlage 1c: Was bedeutet die Konstante? */
export const K1C_Q: S9Question = choice('k1c-frage', 'Kurz überlegen: Was bedeutet hier die Konstante 3,570?', [
  ['a', 'die vorhergesagte Lebenszufriedenheit bei Lage 0, einer Stufe, die es nicht gibt'],
  ['b', 'die Lebenszufriedenheit der Befragten mit sehr schlechter Lage'],
  ['c', 'die durchschnittliche Lebenszufriedenheit aller Befragten'],
], 'a', 'Genau. Die Gerade schneidet bei Lage 0 die y-Achse. Weil es Lage 0 nicht gibt, deutet man die Konstante hier nicht, man braucht sie nur zum Rechnen.',
'Die Konstante ist die Höhe der Geraden bei UV = 0.', { short: 'Konstante', wrong: {
  b: 'Für sehr schlechte Lage (Stufe 1) sagt die Gerade 3,570 + 1,073 = 4,643 vorher. Die Konstante gilt für den Wert 0.',
  c: 'Der Durchschnitt aller ist 7,398 (Descriptive Statistics). Die Konstante ist die Höhe bei UV = 0.',
} });

/** Grundlage 2c: R² in Prozent. */
export const K2C_Q: S9Question = number('k2c-frage', 'Kurz überlegen: Wie viel Prozent der Streuung der Lebenszufriedenheit erklärt die wirtschaftliche Lage im ALLBUS?', 20.3,
  '20,3 %: R² = 0,203. Gut ein Fünftel der Unterschiede in der Lebenszufriedenheit hängt (linear) mit der Lage zusammen; knapp vier Fünftel nicht.',
  'Lies R Square in der Ausgabe aus „R lesen“ und nimm sie mal 100.',
  { tolerance: 0.1, short: 'R² in Prozent', help: 'R² steht in „R lesen“ bei R Square. In Prozent: mal 100.', special: [
    sp(0.203, 'Richtig gelesen, das ist R² als Anteil. In Prozent: mal 100.', 0.001),
    sp(45, 'Das ist R, die Korrelation. R² ist R mal R: 0,45 mal 0,45 ≈ 0,20.', 0.1),
    sp(0.45, 'Das ist R, die Korrelation. R² ist R mal R: 0,45 mal 0,45 ≈ 0,20.', 0.001),
  ] });

/** Grundlage 3a: für wen am ungenauesten? */
export const K3A_Q: S9Question = choice('k3a-frage', 'Kurz überlegen: Für wen ist die Vorhersage der Lebenszufriedenheit am ungenauesten?', [
  ['a', 'für Menschen mit sehr schlechter Lage'], ['b', 'für Menschen mit sehr guter Lage'], ['c', 'für alle gleich, die Gerade ist ja eine'],
], 'a', 'Genau. Bei sehr schlechter Lage streuen die Residuen mit 2,72 Punkten am stärksten: Manche sind trotzdem sehr zufrieden, andere sehr unzufrieden. Bei sehr guter Lage sind sich die Befragten einiger (1,27).',
'Schau, welche Säule am höchsten ist.', { short: 'ungenaueste Vorhersage', wrong: {
  b: 'Bei sehr guter Lage ist die Streuung am kleinsten (1,27). Schau, welche Säule am höchsten ist.',
  c: 'Die Gerade ist eine, aber die Punkte liegen unterschiedlich weit von ihr entfernt. Genau das zeigen die Säulen.',
} });

/** Grundlage 3b: die neunte Person. */
export const K3B_Q: S9Question = choice('k3b-frage', 'Kurz überlegen: Was passiert mit der Steigung, wenn die neunte Person dazukommt?', [
  ['a', 'Sie wird viel flacher.'], ['b', 'Sie bleibt ungefähr gleich, es ist ja nur eine von neun.'], ['c', 'Sie wird steiler.'],
], 'a', 'Genau: von 1 auf 0,2. Ein Punkt weit draußen hat ein großes Quadrat, und die Gerade dreht sich zu ihm, um es kleiner zu machen.',
'Die Gerade wird flacher.', { short: 'Steigung mit der neunten Person', wrong: {
  b: 'Eine Person kann viel bewegen, wenn sie weit draußen und am Rand der UV liegt. Ihr Quadrat (49) ist größer als alle anderen zusammen.',
  c: 'Sie liegt unten rechts und zieht die Gerade rechts nach unten. Die Gerade wird flacher.',
} });

/** Grundlage 4: flache Gerade. */
export const K4_Q: S9Question = choice('k4-frage', 'Kurz überlegen: Die Gerade ist flach, R² ist 0. Heißt das, das Wohlbefinden hängt nicht mit der Temperatur zusammen?', [
  ['ja', 'Ja, R² = 0 heißt kein Zusammenhang.'], ['nein', 'Nein: Der Zusammenhang ist stark, aber nicht gerade. Eine Gerade kann ihn nicht zeigen.'],
], 'nein', 'Genau. Die Regression misst nur den geraden (linearen) Teil eines Zusammenhangs, wie r in Sitzung 6. Eine solche Kurve hat keinen.',
'R² = 0 heißt nur: kein **linearer** Zusammenhang. Schau auf die Punkte: Sie bilden eine deutliche Kurve.', { short: 'flache Gerade' });

/* ---------- Erst festlegen ---------- */

/** „Erst festlegen“ vor jeder Aufgabe, mit der Auflösung beim Prüfen. */
export const PREDICTIONS: Record<'a1' | 'a2' | 'a3' | 'a4', { id: string; prompt: string; options: string[]; resolution: string }> = {
  a1: { id: 'a1', prompt: 'Eine Person mit großem Vertrauen (7) und eine ganz ohne Vertrauen (1): Um wie viele Punkte auf der Zufriedenheitsskala von 1 bis 6 unterscheidet sich die Vorhersage wohl?',
    options: ['kaum, weniger als einen halben Punkt', 'etwa 1 Punkt', 'etwa 3 Punkte', 'mehr als 4 Punkte'],
    resolution: 'Von 1 bis 7 sind es sechs Stufen: 6 mal 0,465 = 2,79, also etwa 3 Punkte auf einer Skala von 1 bis 6.' },
  a2: { id: 'a2', prompt: 'Welche Frage sagt die Zufriedenheit mit der Demokratie besser vorher?',
    options: ['das Vertrauen in den Bundestag', 'die Schicht', 'beide etwa gleich gut'],
    resolution: 'R² für das Vertrauen 0,346, für die Schicht 0,060: Das Vertrauen sagt fast sechsmal so viel vorher.' },
  a3: { id: 'a3', prompt: 'Für wen liegt die Gerade wohl weiter daneben?',
    options: ['für Menschen ganz ohne Vertrauen (Stufe 1)', 'für Menschen mit großem Vertrauen (Stufe 7)', 'für alle etwa gleich'],
    resolution: 'Stufe 1: Streuung 1,325; Stufe 7: 0,952; am kleinsten in Stufe 6: 0,713. Ganz ohne Vertrauen liegt die Gerade fast doppelt so weit daneben wie in Stufe 6.' },
  a4: { id: 'a4', prompt: 'Wie hängt die Zufriedenheit mit der Demokratie mit der Links-rechts-Einstufung zusammen?',
    options: ['Sie sinkt gleichmäßig von links nach rechts.', 'Beide Ränder sind weniger zufrieden als die Mitte.', 'Es gibt keinen Zusammenhang.'],
    resolution: 'Beide Ränder sind weniger zufrieden: ganz links 3,86, in Stufe 3 4,55, ganz rechts 2,54. Die Gerade fällt nur, weil rechts der Abfall stärker ist.' },
};

/* ---------- Hilfe in drei Stufen ---------- */

/** Stufe 1 Denkanstoß, Stufe 2 Wo schaue ich?, Stufe 3 Lösung; Code in `Backticks`. */
export const HINTS: Record<'a1' | 'a2' | 'a3' | 'a4', [string, string, string]> = {
  a1: [
    'Die Gerade braucht zwei Zahlen: ihre Höhe bei 0 (Konstante) und wie stark sie pro Stufe steigt (Steigung). Beide stehen in derselben Spalte der Ausgabe. Die Vorhersage ist Konstante plus Steigung mal Wert.',
    'In der Ausgabe von Schritt 1, Abschnitt Coefficients, Spalte B: Zeile `(Intercept)` ist die Konstante, Zeile `pt03` die Steigung. Nicht Beta, nicht Std. Error. N steht oben unter `- N:`. In Schritt 3 tauschst du alle drei markierten Zahlen.',
    'Konstante 2,288, Steigung 0,465, N = 3.575. In Schritt 3: `2.288 + 0.465 * 7` ergibt 5.543. Die Steigung heißt: Mit jeder Stufe mehr Vertrauen liegt die vorhergesagte Zufriedenheit um knapp einen halben Punkt höher. Die Konstante ist die Höhe bei Vertrauen 0, das es nicht gibt; man deutet sie hier nicht. Von 1 bis 7 unterscheidet sich die Vorhersage um 6 × 0,465 = 2,79 Punkte.',
  ],
  a2: [
    'R² vergleicht die quadrierten Residuen der Geraden mit denen des Mittelwerts. Frag dich bei jeder Zahl, was sie misst: wie stark sich die Vorhersage ändert, oder wie nah die Befragten an ihr liegen.',
    'R Square und Std. Error of the Estimate stehen im Abschnitt Model Summary, die Standardabweichung von demo in Descriptive Statistics, B in Coefficients. Für die Schicht tauschst du in der Vorlage pt03 gegen id02.',
    'Vertrauen: R² = 0,346, Std. Error of the Estimate 1,031 (ohne UV 1,274). Schicht: R² = 0,060, B = 0,412, Std. Error of the Estimate 1,233. Die Steigungen sind fast gleich, aber bei der Schicht streuen die Befragten viel weiter um die Gerade. Das Vertrauen sagt die Zufriedenheit fast sechsmal so gut vorher.',
  ],
  a3: [
    'Das Residuum ist, wie weit eine Person von der Geraden entfernt ist. Wenn es in einer Gruppe stark streut, liegt die Gerade dort oft weit daneben. group_by() rechnet das für jede Stufe getrennt.',
    'Sieben Tabellen, in der Reihenfolge 1 bis 7. Die Streuung steht in der Spalte SD, der mittlere Abstand in Mean. Der Levene-Test steht ganz unten. Für Mean brauchst du in Schritt 1 Konstante und Steigung aus Aufgabe 1.',
    'Mit 2.288 und 0.465: SD je Stufe 1,325; 1,250; 1,165; 0,988; 0,853; 0,713; 0,952. Am kleinsten in Stufe 6, am größten in Stufe 1. Mean in Stufe 7: −0,405. Levene: F(6; 3.567,9) = 74,86, p < 0,001, die Streuungen sind ungleich. Größe: 1,325 zu 0,713 ist das 1,86-Fache, knapp unter der Faustregel „mehr als doppelt“. Für den Bericht: Ganz ohne Vertrauen liegt die Gerade fast doppelt so weit daneben wie in Stufe 6.',
  ],
  a4: [
    'Eine Gerade kann nur steigen oder fallen. Vergleiche, was sie für die ganz Linken vorhersagt, mit dem, was die ganz Linken im Mittel tatsächlich sagen.',
    'B steht in Coefficients (Zeile pa01). Die Mittelwerte stehen in den zehn Tabellen in der Spalte Mean, von links (1) nach rechts (10).',
    'B = −0,140, Konstante 4,857, R² = 0,037. Vorhersage ganz links 4,717, tatsächlich 3,864; ganz rechts 3,457 gegen 2,536. Die Mittelwerte steigen bis Stufe 3 (4,549) und fallen dann. Eine Gerade beschreibt diese Form schlecht; besser die Mittelwerte je Stufe berichten. Die Stufen 9 und 10 sind klein (gewichtet 37 und 38 Befragte).',
  ],
};

/* ---------- Hilfe bei R-Fehlermeldungen ---------- */

/** Text mit Code-Stücken, ohne JSX. */
export type Rich = (string | { code: string })[];
export const ERROR_HELP_TITLE = 'Hilfe: R meldet einen Fehler';
export const ERROR_HELP_CAPTION = 'Was R sagt und was du tust';
export const ERROR_HELP: { says: Rich; helps: Rich }[] = [
  { says: [{ code: 'Variable not found in data: `demo`' }], helps: [{ code: 'demo' }, ' gibt es nur, wenn ps03 vorher umgepolt wurde. Führe die ganze Vorlage aus, mit dem ', { code: 'mutate()' }, '-Block. In der Code-Werkstatt startet jede Vorlage frisch; das Umpolen muss in jeder Vorlage stehen, die ', { code: 'demo' }, ' braucht.'] },
  { says: [{ code: 'Variable not found in data: `pt3`' }], helps: ['Der Variablenname ist vertippt. Prüf ihn Zeichen für Zeichen: pt03 mit Null, id02, pa01.'] },
  { says: [{ code: '`formula` must be a formula object (e.g., `y ~ x1 + x2`)' }], helps: ['Zwischen AV und UV steht die Tilde: ', { code: 'demo ~ pt03' }, ', kein Komma. Die Tilde tippst du auf dem Mac mit Alt + N (danach Leertaste), unter Windows mit AltGr + ', { code: '+' }, '.'] },
  { says: [{ code: 'Unknown argument `weight` of `linear_regression()`' }], helps: ['Das Argument heißt ', { code: 'weights' }, ', mit s.'] },
  { says: [{ code: '`group` is required for Levene\'s test' }], helps: [{ code: 'levene_test()' }, ' braucht die Gruppe: ', { code: 'levene_test(residuum, group = pt03, weights = wghtpew)' }, '.'] },
  { says: [{ code: "Unerwartete(s) ','" }, ' (englisch: ', { code: "unexpected ','" }, ')'], helps: ['Kommazahlen schreibst du in R mit Punkt: ', { code: '2.288 + 0.465 * 7' }, '.'] },
  { says: ['Kein Fehler, aber eine Spalte ', { code: '288 + 0.465 * pt03' }, ' und Mittelwerte weit weg'], helps: ['In ', { code: 'mutate()' }, ' steht ', { code: '2,288' }, ' mit Komma. R liest ', { code: 'vorhersage = 2' }, ' und eine zweite, unbenannte Spalte. Schreib ', { code: '2.288' }, '.'] },
  { says: [{ code: 'Unknown `show` value' }], helps: ['Bei ', { code: 'show =' }, ' gibt es nur bestimmte Namen, etwa ', { code: '"mean"' }, ' und ', { code: '"sd"' }, '. N zeigt ', { code: 'describe()' }, ' immer.'] },
  { says: ['In RStudio erscheint ', { code: '+' }, ' und nichts passiert'], helps: ['Eine Klammer ist nicht geschlossen. Mit Esc abbrechen und die Klammern zählen.'] },
  { says: ['Die Ausgabe ist sehr lang und bricht um'], helps: ['Zieh das Konsolenfenster in RStudio breiter. Bei ', { code: 'group_by()' }, ' gibt R für jede Gruppe eine eigene kleine Tabelle aus; scroll nach oben.'] },
];

/* ---------- Prüf dich selbst ---------- */

export const SELF_TEST: { question: string; options: string[]; answer: number; why: string }[] = [
  { question: 'Eine Regression des Wohlbefindens (0 bis 10) auf die Schlafstunden ergibt B = 0,3. Was heißt das?',
    options: ['Mit jeder Stunde mehr Schlaf liegt das vorhergesagte Wohlbefinden um 0,3 Punkte höher.', '30 % des Wohlbefindens hängen am Schlaf.', 'Wer eine Stunde mehr schläft, fühlt sich dadurch um 0,3 Punkte wohler.'],
    answer: 0, why: 'B ist die Änderung der Vorhersage pro Einheit der UV, in Punkten der AV. „Dadurch“ wäre eine Ursache, die die Regression nicht zeigt (Grundlage 1b, Überblick Ü3).' },
  { question: 'Eine Person liegt im Streudiagramm 2 Punkte unter der Geraden. Wie groß ist ihr Residuum?',
    options: ['−2', '+2', '4'],
    answer: 0, why: 'Residuum = beobachtet minus vorhergesagt. Unter der Geraden ist es negativ. Quadriert wäre es 4 (Grundlage 2a).' },
  { question: 'Zwei Regressionen: A hat B = 0,8 und R² = 0,05, B hat B = 0,3 und R² = 0,40. Welche UV sagt die AV besser vorher?',
    options: ['A, weil die Gerade steiler ist.', 'B, weil die Punkte viel näher an der Geraden liegen.', 'Das lässt sich nicht sagen.'],
    answer: 1, why: 'Wie gut eine Gerade vorhersagt, sagt R², nicht die Steigung (Grundlage 2c, Aufgabe 2).' },
  { question: 'Im Streudiagramm liegen die Punkte links eng an der Geraden und rechts weit gestreut. Welche Voraussetzung ist verletzt?',
    options: ['Linearität', 'gleiche Fehlervarianz', 'keine Ausreißer'],
    answer: 1, why: 'Ein Fächer im ⟪Streudiagramm⟫ heißt ⟪Heteroskedastizität|gleiche-fehlervarianz⟫: Die Residuen streuen nicht überall gleich stark (Grundlage 3a).' },
  { question: 'Die Gerade für Alter und Stunden Sport pro Woche ist fast flach, R² = 0,01. Was kannst du sicher sagen?',
    options: ['Alter und Sport hängen nicht zusammen.', 'Es gibt kaum einen linearen Zusammenhang; ein nichtlinearer wäre noch möglich.', 'Die Regression wurde falsch gerechnet.'],
    answer: 1, why: 'R² misst nur den ⟪linearen|linear⟫ Teil eines Zusammenhangs, wie r in Sitzung 6. Ob ein ⟪nichtlinearer Zusammenhang|nichtlinear⟫ dahintersteckt, etwa eine Kurve, zeigen die Mittelwerte je Stufe (Grundlage 4).' },
];

/* ---------- Skript zum Mitnehmen ---------- */

export const SCRIPT_FILE = 'sitzung9.R';
export const SCRIPT_PARTS = ['start', 'r_kurz', 'r_summary', 'a1', 'a1r', 'a2', 'a3', 'a4', 'a4r'];
const SCRIPT_NOTES: Record<string, string> = { a3: '# Tausch 3.570 und 1.073 gegen Konstante und Steigung aus Aufgabe 1.\n' };
/** Skript sitzung9.R: alle Vorlagen ohne Probier-Werkstätten, Marken stehen mit ihrem Beispielwert. */
export const SCRIPT = '# Sitzung 9: Lineare Regression\n# Statistikatlas, Methoden Ib, ALLBUS 2023 (ZA8831 v1.3.0), gewichtet mit wghtpew\n# Markierte Stellen aus dem Atlas stehen hier mit ihrem Beispielwert.\n\n'
  + SCRIPT_PARTS.map(k => `# ---- ${TEMPLATES[k].title} ----\n${SCRIPT_NOTES[k] ?? ''}${parseMarks(TEMPLATES[k].code).code}\n`).join('\n');
