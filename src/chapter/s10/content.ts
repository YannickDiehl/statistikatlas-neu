// Sitzung 10 „Regression vertiefen“: Zahlen, Vorlagen und Fragen aus docs/entwicklung/spezifikationen/2026-11-23-lernpfad-kapitel/sitzung10.md, nur Daten.
// Alle Zahlen: ALLBUS 2023, ZA8831 v1.3.0, gewichtet mit wghtpew, nur Aggregate. Geprüft in allbus.local.test.ts
// (und im Plan mit sitzung10-zahlen.R gegen mariposa 0.7.4). Punkte und Steine mit Einzelwerten sind konstruierte Beispiele.
import type { Question } from '../answers';
import { parseMarks } from '../workshop/editor';

/* ---------- Fragen mit Sonderfällen ---------- */

/** A typed value that is a known mix-up (Sonderfall): its own feedback instead of the general hint. */
export type Case = { value: number; /** default: the question's tolerance */ tolerance?: number; text: string };
/** A question of this chapter: number questions may carry special cases, choice questions a text per wrong option. */
export type S10Question = Question & { cases?: Case[]; wrong?: Record<string, string> };

type Extra = { short?: string; help?: string };
const choice = (id: string, label: string, options: [string, string][], target: string, right: string, wrong: Record<string, string>, extra: Extra = {}): S10Question =>
  ({ id, label, kind: 'choice', options: options.map(([value, l]) => ({ value, label: l })), target, right, hint: Object.values(wrong).join(' '), wrong, ...extra });
const number = (id: string, label: string, target: number, tolerance: number, right: string, hint: string, cases: Case[] = [], extra: Extra = {}): S10Question =>
  ({ id, label, kind: 'number', target, tolerance, right, hint, cases, ...extra });

/* ---------- Ausgabe von r_modell (Bild R2) ---------- */

/** The output of template `r_modell` as R prints it (mariposa 0.7.4), without the final „Signif. codes“ line. */
export const OUTPUT_LINES = `Weighted Linear Regression Results
----------------------------------
- Formula: ls01 ~ age + gesund
- Method: ENTER (all predictors)
- N: 5128
- Weights: wghtpew
- Note: labelled predictors age, gesund entered with their numeric codes, as SPSS REGRESSION does.
  Use to_label() first to enter them as dummy-coded categories.

  Descriptive Statistics
  --------------------------------------
  Variable    Mean  Std. Deviation     N
  --------------------------------------
  ls01       7.407           1.919  5128
  age       52.032          18.212  5128
  gesund     3.573           1.012  5128
  --------------------------------------

  Model Summary
  ----------------------------------
  R                            0.436
  R Square                     0.190
  Adjusted R Square            0.190
  Std. Error of the Estimate   1.728
  ----------------------------------

  ANOVA
  ------------------------------------------------------------------
  Source      Sum of Squares    df  Mean Square        F   Sig.
  ------------------------------------------------------------------
  Regression        3585.593     2     1792.797  600.742  <.001  ***
  Residual         15293.382  5125        2.984
  Total            18878.975  5127
  ------------------------------------------------------------------

  Coefficients
  -------------------------------------------------------------------------------------
  Term             B  Std. Error   Beta       t   Sig.  95% CI Lower  95% CI Upper
  -------------------------------------------------------------------------------------
  (Intercept)  3.095       0.135         22.854  <.001         2.830         3.361  ***
  age          0.024       0.001  0.225  16.931  <.001         0.021         0.026  ***
  gesund       0.861       0.025  0.454  34.124  <.001         0.811         0.910  ***
  -------------------------------------------------------------------------------------

  Collinearity Statistics
  ------------------------
  Term    Tolerance    VIF
  ------------------------
  age         0.893  1.120
  gesund      0.893  1.120
  ------------------------
  VIF > 10 (Tolerance < 0.1) indicates problematic collinearity.`.split('\n');

export type OutputBlock = 'kopf' | 'beschreibung' | 'modell' | 'anova' | 'koeffizienten' | 'kollinearitaet';
/** First line (0-based) of each block in OUTPUT_LINES; a block runs to the next one. */
export const OUTPUT_BLOCKS: { block: OutputBlock; from: number; to: number; name: string }[] = [
  { block: 'kopf', from: 0, to: 9, name: 'Kopf' },
  { block: 'beschreibung', from: 9, to: 18, name: 'Descriptive Statistics' },
  { block: 'modell', from: 18, to: 26, name: 'Model Summary' },
  { block: 'anova', from: 26, to: 35, name: 'ANOVA' },
  { block: 'koeffizienten', from: 35, to: 44, name: 'Coefficients' },
  { block: 'kollinearitaet', from: 44, to: 52, name: 'Collinearity Statistics' },
];
/** The four blocks with a switch and their explanation (Karte R2). */
export const OUTPUT_EXPLAIN: { block: OutputBlock; label: string; text: string }[] = [
  { block: 'kopf', label: 'Kopf', text: 'Hier prüfst du, ob R das Richtige gerechnet hat: Formula zeigt das Modell, Weights das Gewicht. N ist bei Gewichtung die Summe der Gewichte, gerundet (Sitzung 6). In das Modell gehen nur Befragte ein, die bei allen Variablen der Formel einen gültigen Wert haben. Die Notiz „labelled predictors age, gesund entered with their numeric codes“ heißt: R rechnet mit den Codes als Zahlen, beim Alter mit den Jahren, bei `gesund` mit 1 bis 5. Bei Jahren und Stufen ist das gewollt. Bei Gruppen ohne Reihenfolge wäre es falsch; dafür gibt es Dummies (Grundlage 2).' },
  { block: 'modell', label: 'Model Summary', text: 'R Square kennst du aus Sitzung 9: Alter und Gesundheit zusammen erklären 19,0 % der Streuung der Lebenszufriedenheit. Adjusted R Square, das korrigierte R², hast du in Sitzung 9 kurz gesehen: Mit einer UV war es gleich R². Ab heute zählt es, denn es zieht für jeden Prädiktor ein wenig ab (Grundlage 3). Hier sind beide 0.190.' },
  { block: 'koeffizienten', label: 'Coefficients', text: 'Jede Zeile ein Prädiktor. B kennst du aus Sitzung 9. Neu: Jedes B gilt jetzt „bei gleichen Werten der anderen Prädiktoren“ (Grundlage 1). Beta kennst du aus Sitzung 9 als Steigung in Standardabweichungen. Mit mehreren Prädiktoren ist Beta nicht mehr gleich r, sondern dient zum Vergleichen der Prädiktoren (Grundlage 3). Sig. und 95% CI kennst du aus Sitzung 7.' },
  { block: 'kollinearitaet', label: 'Collinearity Statistics', text: 'Neu: Der VIF sagt, wie sehr ein Prädiktor schon in den anderen steckt. 1 heißt: gar nicht. Ab 10 meldet mariposa ein Problem. Hier 1.120: kein Problem (Grundlage 3).' },
];

/* ---------- Daten der Grundlagen (ALLBUS, gewichtet) ---------- */

/** Modell `ls01 ~ age + gesund` (Vorlage r_modell). */
export const MODEL_AG = {
  formula: 'ls01 ~ age + gesund', weights: 'wghtpew', n: 5128, r: 0.436, r2: 0.190, adjR2: 0.190, see: 1.728,
  desc: { ls01: { mean: 7.407, sd: 1.919 }, age: { mean: 52.032, sd: 18.212 }, gesund: { mean: 3.573, sd: 1.012 } },
  intercept: { b: 3.095, se: 0.135, t: 22.854, lower: 2.830, upper: 3.361 },
  age: { p: '<.001', b: 0.024, bExact: 0.0237, se: 0.001, beta: 0.225, t: 16.931, lower: 0.021, upper: 0.026, tolerance: 0.893, vif: 1.120 },
  gesund: { p: '<.001', b: 0.861, se: 0.025, beta: 0.454, t: 34.124, lower: 0.811, upper: 0.910, tolerance: 0.893, vif: 1.120 },
};
/** Modell `ls01 ~ age` allein. */
export const MODEL_AGE_ONLY = { n: 5142, b: 0.008, bExact: 0.0079, beta: 0.075, r2: 0.006 };

export const AGE_GROUPS = ['18–29', '30–44', '45–59', '60–74', '75+'];
/** Bild B1: mittlere Lebenszufriedenheit je Altersgruppe, gleiche Befragte (Angaben zu Alter, Gesundheit, Lebenszufriedenheit). */
export const B1 = {
  all: [7.15, 7.33, 7.36, 7.55, 7.65],
  health: [
    { key: 'gut', name: 'Gesundheit gut', note: 'sehr gut oder gut', means: [7.56, 7.76, 7.94, 8.24, 8.41], rise: 0.85 },
    { key: 'mittel', name: 'zufriedenstellend', note: 'zufriedenstellend', means: [6.25, 6.59, 7.05, 7.42, 7.74], rise: 1.49 },
    { key: 'schlecht', name: 'Gesundheit schlecht', note: 'weniger gut oder schlecht', means: [4.78, 5.26, 5.71, 6.01, 6.73], rise: 1.95 },
  ],
  /** Prozent gut | zufriedenstellend | schlecht je Altersgruppe, nach größten Resten gerundet. */
  shares: [[76, 17, 7], [73, 19, 8], [57, 28, 15], [48, 34, 18], [29, 42, 29]],
  smallestCell: 46,
};

/** Grundlage 2a: `ls01 ~ verheiratet`. */
export const MARRIED = { intercept: 7.042, b: 0.652, r2: 0.028, meanMarried: 7.69, meanOther: 7.04, prediction: 7.694 };

export const MSTAT = ['verheiratet', 'getrennt lebend', 'verwitwet', 'geschieden', 'ledig'];
/** Karte 2b: Konstante und B je Referenz (Reihenfolge der Gruppen wie MSTAT, null = Referenz). */
export const REFERENCES: { intercept: number; b: (number | null)[] }[] = [
  { intercept: 7.695, b: [null, -1.085, -0.462, -0.712, -0.653] },
  { intercept: 6.610, b: [1.085, null, 0.623, 0.373, 0.432] },
  { intercept: 7.233, b: [0.462, -0.623, null, -0.250, -0.191] },
  { intercept: 6.983, b: [0.712, -0.373, 0.250, null, 0.059] },
  { intercept: 7.042, b: [0.653, -0.432, 0.191, -0.059, null] },
];
/** Vorhersagen je Gruppe, bei jeder Referenz gleich. */
export const MSTAT_PREDICTIONS = [7.695, 6.610, 7.233, 6.983, 7.042];
export const MSTAT_R2 = 0.030;
/** Gewichtete Gruppengrößen (Lebenszufriedenheit und Familienstand gültig). */
export const MSTAT_WEIGHTED = { married: 2823, separated: 85, single: 1459 };
/** Vorlage r_dummy: frequency(mstat_1, weights = wghtpew). */
export const MSTAT_1_FREQ = { zero: { n: 2343, valid: 45.01 }, one: { n: 2863, valid: 54.99 }, system: 40 };
/** Karte 2c: mstat als Zahl im Modell. */
export const MSTAT_AS_NUMBER = -0.171;

/** Karte 3c: `ls01 ~ age + agec + gesund` und `ls01 ~ agec + gesund`. */
export const COLLINEAR = {
  age: { b: 0.016, se: 0.006, p: '.006', vif: 18.995, tolerance: 0.053 },
  agec: { b: 0.121, se: 0.084, p: '.153', vif: 18.963 },
  gesund: { b: 0.862, se: 0.025, p: '<.001', vif: 1.121 },
  agecAlone: { b: 0.344, vif: 1.118 },
};

/** Karte 3b: konstruiertes Beispiel mit 30 Befragten (nachgerechnet in sitzung10-zahlen.R, set.seed(107)). */
export const DICE = [
  { r2: 0.27, adj: 0.25 }, { r2: 0.28, adj: 0.23 }, { r2: 0.29, adj: 0.21 }, { r2: 0.30, adj: 0.19 }, { r2: 0.31, adj: 0.17 },
];

/** Karte 4a: konstruiertes Beispiel, elf Befragte (Alter, Lebenszufriedenheit) und Person L in vier Zuständen. */
export const INFLUENCE_POINTS: [number, number][] = [[22, 6], [28, 8], [33, 6], [38, 7], [44, 8], [49, 6], [53, 8], [58, 7], [63, 8], [68, 7], [74, 8]];
export const INFLUENCE_STATES: { key: string; label: string; l: [number, number] | null; intercept: number; b: number }[] = [
  { key: 'ohne', label: 'ohne L', l: null, intercept: 6.14, b: 0.022 },
  { key: 'mitte', label: 'L in der Mitte', l: [48, 1], intercept: 5.61, b: 0.022 },
  { key: 'rand', label: 'L am Rand, weit weg von der Geraden', l: [95, 1], intercept: 8.85, b: -0.042 },
  { key: 'gerade', label: 'L am Rand, auf der Geraden', l: [95, 8], intercept: 6.21, b: 0.020 },
];

/** Karte 4b: Lebenszufriedenheit nach Erwerbstätigkeit (work 1 bis 3) und Alter ab 60. */
export const INTERACTION = {
  cells: { under60: [6.34, 7.43], over60: [7.57, 7.63] },
  intercept: 6.339, erwerb: 1.091, ab60: 1.233, both: -1.035, gapOver60: 0.056,
};

/* ---------- Daten der Aufgaben (ALLBUS, gewichtet) ---------- */

export const A1 = {
  one: { n: 3603, intercept: 2.5, lage: 0.461, beta: 0.29, r2: 0.084 },
  two: { n: 3589, lage: 0.198, lageBeta: 0.124, dlage: 0.668, dlageBeta: 0.415, r2: 0.228, vif: 1.185 },
};
export const A2 = {
  nPrinted: 3222, mean: 4.122, r2: 0.041,
  west: { intercept: 4.243, b: [-0.705, -0.166, -0.034], beta: [-0.202, -0.024, -0.003], lower: [-0.824, -0.404, -0.385], upper: [-0.587, 0.072, 0.317] },
  east: { intercept: 3.537, west: 0.705, b2: 0.540, b3: 0.671 },
  prediction: 4.077,
  counted: [1003, 91, 97, 2063],
};
export const A3 = {
  n: 3503, r2: 0.259, adjR2: 0.258, intercept: 1.557, eastShare: 0.170,
  b: { lage: 0.176, dlage: 0.635, ost: -0.521, abitur: 0.216 },
  beta: { lage: 0.110, dlage: 0.394, ost: -0.154, abitur: 0.085 },
  vif: { lage: 1.198, dlage: 1.208, ost: 1.005, abitur: 1.055 },
  ostAlone: { intercept: 4.265, b: -0.624, beta: -0.183, r2: 0.034 },
};
export const A4 = {
  plus: { ost: -0.604, abitur: 0.460 },
  times: { intercept: 4.042, ost: -0.631, abitur: 0.450, both: 0.060, beta: 0.012, p: '.590', lower: -0.158, upper: 0.277, r2: 0.067 },
  gapWithAbitur: -0.571,
};
/** ps03 hat nur, wer im Split die Frage bekam; die anderen haben TNZ: SPLIT (Code −11). */
export const PS03_SPLIT = 1596;

/* ---------- Codevorlagen ---------- */

export type Template = { title: string; code: string; tryOut?: boolean };
/** ⟦…⟧ markiert Stellen, die angepasst werden. Wortlaut wie im Plan (content.test.ts prüft das). */
export const TEMPLATES: Record<string, Template> = {
  start: { title: 'Startblock', code: `# Pakete laden und Daten einlesen
library(tidyverse)
library(mariposa)

allbus <- read_spss("ZA8831_v1-3-0.sav")` },
  r_modell: { title: 'Vorlage: ein Modell mit zwei Prädiktoren', code: `# Lebenszufriedenheit aus Alter und Gesundheit (gesund umgepolt: höher = gesünder)
allbus %>%
  mutate(
    gesund = rec(hs01, rules = "rev")
  ) %>%
  linear_regression(ls01 ~ age + gesund, weights = wghtpew) %>%
  summary()` },
  r_dummy: { title: 'Vorlage: to_dummy()', code: `# Aus dem Familienstand fünf 0/1-Variablen machen, eine davon auszählen
allbus %>%
  to_dummy(mstat) %>%
  frequency(mstat_1, weights = wghtpew)` },
  a1: { title: 'Vorlage: Demokratiezufriedenheit aus der wirtschaftlichen Lage', code: `# Demokratiezufriedenheit aus der eigenen wirtschaftlichen Lage
# umgepolt, damit höher = zufriedener bzw. besser (dlage brauchst du in Schritt 2)
allbus %>%
  mutate(
    demo  = rec(ps03, rules = "rev"),
    lage  = rec(ep03, rules = "rev"),
    dlage = rec(ep01, rules = "rev")
  ) %>%
  linear_regression(demo ~ ⟦lage⟧, weights = wghtpew) %>%
  summary()` },
  a2: { title: 'Vorlage: Herkunft und Wohnort als Dummies', code: `# Demokratiezufriedenheit nach Herkunft und Wohnort
# demo wie in Aufgabe 1; to_dummy() macht aus dg03 vier 0/1-Variablen
# Referenz ist die Gruppe, die in der Formel fehlt (hier dg03_4, West-Bleibende)
allbus %>%
  mutate(
    demo = rec(ps03, rules = "rev")
  ) %>%
  to_dummy(dg03) %>%
  linear_regression(demo ~ ⟦dg03_1⟧ + dg03_2 + dg03_3, weights = wghtpew) %>%
  summary()` },
  a2_rechnen: { title: 'R als Taschenrechner: Vorhersage einer Gruppe', code: `# Vorhersage einer Gruppe: Konstante plus B ihres Dummys
# (hier noch das Beispiel aus Grundlage 2a: Verheiratete)
⟦7.042⟧ + ⟦0.652⟧` },
  a3: { title: 'Vorlage: vier Prädiktoren', code: `# Demokratiezufriedenheit aus vier Prädiktoren
# demo, lage und dlage wie in Aufgabe 1; ost und abitur als 0/1-Variablen
allbus %>%
  mutate(
    demo   = rec(ps03, rules = "rev"),
    lage   = rec(ep03, rules = "rev"),
    dlage  = rec(ep01, rules = "rev"),
    ost    = rec(eastwest, rules = "1=0 [West]; 2=1 [Ost]"),
    abitur = rec(educ, rules = "1:3=0 [kein Abitur]; 4:5=1 [Abitur]; else=NA")
  ) %>%
  linear_regression(demo ~ lage + dlage + ost + abitur, weights = wghtpew) %>%
  summary()` },
  // E13: ohne Markierung, weil die Antworten die Vorlage unverändert nutzen (im Plan steht ⟦ost⟧ nur als Einladung).
  a3_ost: { title: 'Vorlage: der Ost-West-Unterschied allein', code: `# Zum Vergleich: der Ost-West-Unterschied ohne weitere Prädiktoren
# demo wie in Aufgabe 1, ost wie oben
allbus %>%
  mutate(
    demo = rec(ps03, rules = "rev"),
    ost  = rec(eastwest, rules = "1=0 [West]; 2=1 [Ost]")
  ) %>%
  linear_regression(demo ~ ost, weights = wghtpew) %>%
  summary()` },
  a4: { title: 'Vorlage: Ost-West-Unterschied und Abitur', code: `# Ost-West-Unterschied und Abitur
# demo wie in Aufgabe 1, ost und abitur wie in Aufgabe 3
allbus %>%
  mutate(
    demo   = rec(ps03, rules = "rev"),
    ost    = rec(eastwest, rules = "1=0 [West]; 2=1 [Ost]"),
    abitur = rec(educ, rules = "1:3=0 [kein Abitur]; 4:5=1 [Abitur]; else=NA")
  ) %>%
  linear_regression(demo ~ ost ⟦+⟧ abitur, weights = wghtpew) %>%
  summary()` },
  a4_rechnen: { title: 'R als Taschenrechner: Unterschied in der zweiten Gruppe', code: `# Unterschied in der zweiten Gruppe: B des Prädiktors plus B der Interaktion
# (hier noch das Beispiel aus Grundlage 4b: Erwerbstätige ab 60)
⟦1.091⟧ + ⟦-1.035⟧` },
  frei_a1: { tryOut: true, title: 'Deine Probier-Werkstatt', code: `# Eine Idee: Kommt die erwartete Lage Deutschlands in einem Jahr noch dazu?
# demo, lage und dlage wie in Aufgabe 1, dazu zukunft (ep04 umgepolt: höher = besser)
allbus %>%
  mutate(
    demo    = rec(ps03, rules = "rev"),
    lage    = rec(ep03, rules = "rev"),
    dlage   = rec(ep01, rules = "rev"),
    zukunft = rec(ep04, rules = "rev")
  ) %>%
  linear_regression(demo ~ lage + dlage + zukunft, weights = wghtpew) %>%
  summary()` },
  frei_a2: { tryOut: true, title: 'Deine Probier-Werkstatt', code: `# Eine Idee: das Abitur konstant halten (Modell wie in Aufgabe 2, dazu abitur)
allbus %>%
  mutate(
    demo   = rec(ps03, rules = "rev"),
    abitur = rec(educ, rules = "1:3=0 [kein Abitur]; 4:5=1 [Abitur]; else=NA")
  ) %>%
  to_dummy(dg03) %>%
  linear_regression(demo ~ dg03_1 + dg03_2 + dg03_3 + abitur, weights = wghtpew) %>%
  summary()` },
  frei_a3: { tryOut: true, title: 'Deine Probier-Werkstatt', code: `# Eine Idee: dasselbe Modell ohne die Lage Deutschlands (dlage)
allbus %>%
  mutate(
    demo   = rec(ps03, rules = "rev"),
    lage   = rec(ep03, rules = "rev"),
    ost    = rec(eastwest, rules = "1=0 [West]; 2=1 [Ost]"),
    abitur = rec(educ, rules = "1:3=0 [kein Abitur]; 4:5=1 [Abitur]; else=NA")
  ) %>%
  linear_regression(demo ~ lage + ost + abitur, weights = wghtpew) %>%
  summary()` },
  frei_a4: { tryOut: true, title: 'Deine Probier-Werkstatt', code: `# Eine Idee: Ist der Ost-West-Unterschied bei Menschen, die sich links einstufen, anders?
# links: pa01 1 bis 4 = links, 5 bis 10 = Mitte oder rechts
allbus %>%
  mutate(
    demo  = rec(ps03, rules = "rev"),
    ost   = rec(eastwest, rules = "1=0 [West]; 2=1 [Ost]"),
    links = rec(pa01, rules = "1:4=1 [links]; 5:10=0 [Mitte oder rechts]; else=NA")
  ) %>%
  linear_regression(demo ~ ost * links, weights = wghtpew) %>%
  summary()` },
};

/** A template with its marks replaced in order (`solve('a2_rechnen', '4.243', '-0.166')`); without values the example values stay. */
export function solve(key: string, ...values: string[]): string {
  let i = 0;
  return TEMPLATES[key].code.replace(/⟦(.*?)⟧/g, (_, word: string) => values[i++] ?? word);
}

/* ---------- Antworten prüfen ---------- */

export const QUESTIONS: Record<'a1' | 'a2' | 'a3' | 'a4', S10Question[]> = {
  a1: [
    number('a1a', 'Modell nur mit `lage`: Wie groß ist B von `lage`?', 0.461, 0.005,
      '0,461: Pro Stufe bessere eigene Lage sagt das Modell 0,46 Punkte mehr Demokratiezufriedenheit voraus.',
      'Lies unter Coefficients in der Zeile `lage` die Spalte B.',
      [{ value: 2.5, tolerance: 0.005, text: 'Das ist die Konstante (Intercept).' }, { value: 0.29, tolerance: 0.005, text: 'Das ist Beta, gefragt ist B.' }],
      { short: 'B von `lage` allein', help: 'Aus Schritt 1, Spalte B.' }),
    number('a1b', 'Modell mit `lage + dlage`: Wie groß ist B von `lage` jetzt?', 0.198, 0.005,
      '0,198: weniger als halb so viel wie allein.',
      'Hast du `+ dlage` ergänzt? In der Zeile „Formula“ muss `demo ~ lage + dlage` stehen.',
      [{ value: 0.461, text: 'Das ist noch das Modell aus Schritt 1.' }],
      { short: 'B von `lage` mit `dlage`', help: 'Aus Schritt 2, Zeile `lage`, Spalte B.' }),
    number('a1c', 'Modell mit `lage + dlage`: Wie groß ist B von `dlage`?', 0.668, 0.005,
      '0,668: Pro Stufe bessere Einschätzung der Lage Deutschlands 0,67 Punkte mehr, bei gleicher eigener Lage.',
      'Lies die Zeile `dlage`, Spalte B.',
      [{ value: 0.415, tolerance: 0.005, text: 'Das ist Beta.' }],
      { short: 'B von `dlage`' }),
    number('a1d', 'Wie groß ist R Square im Modell mit beiden Prädiktoren?', 0.228, 0.005,
      '0,228: Beide zusammen erklären knapp 23 % der Streuung, die eigene Lage allein 8,4 %.',
      'Lies unter Model Summary die Zeile R Square.',
      [{ value: 0.084, text: 'Das ist das Modell aus Schritt 1.' }],
      { short: 'R Square mit beiden' }),
    choice('a1e', 'Was heißt B = 0,198 für `lage` im Modell mit beiden?', [
      ['gleich', '„Bei gleicher Einschätzung der Lage Deutschlands geht eine Stufe bessere eigene Lage mit 0,2 Punkten mehr Demokratiezufriedenheit einher.“'],
      ['prozent', '„Die eigene Lage erklärt 19,8 % der Demokratiezufriedenheit.“'],
      ['macht', '„Wer seine eigene Lage um eine Stufe verbessert, wird dadurch 0,2 Punkte zufriedener mit der Demokratie.“'],
    ], 'gleich', 'Genau: B gilt bei gleichem Wert des anderen Prädiktors.', {
      prozent: 'B ist keine Prozentzahl. Wie viel erklärt wird, sagt R², und das für das ganze Modell.',
      macht: 'Die Regression vergleicht Menschen, sie zeigt nicht, was passiert, wenn sich eine Person verändert. „Dadurch“ behauptet eine Ursache.',
    }, { short: 'Was B heißt' }),
    choice('a1f', 'Warum ist B von `lage` mit `dlage` im Modell kleiner?', [
      ['zusammen', '„Wer die eigene Lage gut einschätzt, sieht meist auch die Lage Deutschlands besser. Ein Teil des ersten B gehörte zur Einschätzung der Lage Deutschlands.“'],
      ['r2', '„Weil R² größer geworden ist.“'],
      ['weniger', '„Weil im zweiten Modell weniger Befragte sind.“'],
    ], 'zusammen', 'Genau. Die beiden Einschätzungen hängen zusammen. Mit der Lage Deutschlands als ⟪Kontrollvariable⟫ vergleicht B nur noch Menschen, die das Land gleich einschätzen; für die eigene Lage bleibt 0,198.', {
      r2: 'R² steigt, weil `dlage` viel erklärt. Das ändert aber nicht von selbst B von `lage`; B ändert sich, weil die beiden Prädiktoren zusammenhängen.',
      weniger: 'N sinkt nur von 3.603 auf 3.589 (gewichtet). Das erklärt keinen Sprung von 0,461 auf 0,198.',
    }, { short: 'Warum B kleiner wird' }),
  ],
  a2: [
    number('a2a', 'Referenz West-Bleibende: Wie groß ist die Konstante (Intercept)?', 4.243, 0.005,
      '4,243: die mittlere Demokratiezufriedenheit der West-Bleibenden, auf der Skala von 1 bis 6.',
      'Lies unter Coefficients die Zeile (Intercept), Spalte B.',
      [{ value: 4.122, tolerance: 0.005, text: 'Das ist der Mittelwert aller Befragten im Modell (Descriptive Statistics).' },
        { value: 3.537, text: 'Das ist die Konstante mit Referenz Ost-Bleibende; die gehört zu Schritt 3.' }],
      { short: 'Konstante, Referenz West-Bleibende', help: 'Aus Schritt 1.' }),
    number('a2b', 'Referenz West-Bleibende: Wie groß ist B der Ost-Bleibenden (`dg03_1`)?', -0.705, 0.005,
      '−0,705: Die Ost-Bleibenden liegen 0,7 Punkte unter den West-Bleibenden.',
      'Lies die Zeile `dg03_1`, Spalte B, mit Vorzeichen.',
      [{ value: 0.705, text: 'Das Vorzeichen fehlt; die Ost-Bleibenden sind weniger zufrieden.' }, { value: -0.202, tolerance: 0.005, text: 'Das ist Beta.' }],
      { short: 'B der Ost-Bleibenden' }),
    number('a2c', 'Welchen Wert sagt das Modell für die Gruppe Ost→West voraus?', 4.077, 0.01,
      '4,077: Konstante 4,243 plus B −0,166.',
      'Vorhersage einer Gruppe: Konstante plus B ihres Dummys.',
      [{ value: -0.166, text: 'Das ist nur der Unterschied zur Referenzgruppe.' }],
      { short: 'Vorhersage Ost→West', help: 'Ergebnis von Schritt 2.' }),
    choice('a2d', 'Welches Muster zeigen die Daten?', [
      ['praegung', '„Prägung: Ost→West ähnelt den Ost-Bleibenden“'],
      ['ort', '„Ort: West→Ost ähnelt den Ost-Bleibenden“'],
      ['weder', '„Weder noch: Beide Umzugsgruppen liegen nah bei den West-Bleibenden“'],
    ], 'weder', 'Genau. Ost→West liegt 0,17, West→Ost 0,03 unter den West-Bleibenden; die Ost-Bleibenden 0,71. Der Unterschied sitzt bei denen, die im Osten aufwuchsen und dort leben. Eine mögliche Erklärung: Wer umzieht, unterscheidet sich auch sonst von denen, die bleiben.', {
      praegung: 'Dann müsste Ost→West etwa −0,7 haben wie die Ost-Bleibenden. Es sind −0,17.',
      ort: 'Dann müsste West→Ost etwa −0,7 haben. Es sind −0,03.',
    }, { short: 'Muster' }),
    choice('a2e', 'Bei Ost→West reicht das Konfidenzintervall von −0,404 bis 0,072, bei West→Ost von −0,385 bis 0,317. Was heißt das?', [
      ['null', '„Ein Abstand von 0 zu den West-Bleibenden ist mit den Daten vereinbar. Die Gruppen sind klein, die Lage ist unsicher.“'],
      ['gleich', '„Die Umzugsgruppen sind sicher genauso zufrieden wie die West-Bleibenden.“'],
      ['falsch', '„Das Modell ist falsch, weil die Intervalle so breit sind.“'],
    ], 'null', 'Genau. Beide Intervalle schließen 0 ein; mit 91 und 97 Befragten bleibt viel Unsicherheit. Aber beide Intervalle enden weit vor −0,7: Dass die Umgezogenen so unzufrieden sind wie die Ost-Bleibenden, passt nicht zu den Daten.', {
      gleich: 'Ein Intervall um 0 heißt nicht „sicher gleich“, sondern „Abstand 0 ist möglich, aber auch einige Zehntel“.',
      falsch: 'Breite Intervalle sind kein Fehler, sondern ehrlich: Bei wenigen Befragten weiß man weniger genau.',
    }, { short: 'Konfidenzintervalle' }),
    number('a2f', 'Referenz Ost-Bleibende (Schritt 3): Wie groß ist jetzt die Konstante?', 3.537, 0.005,
      '3,537: der Mittelwert der Ost-Bleibenden. Vorhersage Ost→West jetzt: 3,537 plus 0,540 = 4,077, genau wie vorher. Andere Referenz, andere B, gleiche Vorhersagen.',
      'Hast du `dg03_1` gegen `dg03_4` getauscht? In der Zeile „Formula“ muss `demo ~ dg03_4 + dg03_2 + dg03_3` stehen.',
      [{ value: 4.243, text: 'Das ist noch die Referenz West-Bleibende.' }],
      { short: 'Konstante, Referenz Ost-Bleibende', help: 'Aus Schritt 3.' }),
  ],
  a3: [
    choice('a3a', 'Welcher Prädiktor hat den größten Betrag von Beta?', [['lage', '`lage`'], ['dlage', '`dlage`'], ['ost', '`ost`'], ['abitur', '`abitur`']], 'dlage',
      'Die Lage Deutschlands, Beta 0,394. Danach kommt `ost` mit −0,154 (Betrag 0,154).', {
        lage: 'Vergleiche in der Spalte Beta die Zahlen ohne Vorzeichen.',
        ost: 'B von `ost` ist mit −0,521 fast so groß wie das von `dlage`, aber Beta ist viel kleiner (−0,154): Bei `ost` ist ein Schritt der ganze Weg von West nach Ost, und der ⟪Anteil|relative-haeufigkeit⟫ im Osten liegt bei nur 17 %.',
        abitur: 'Vergleiche in der Spalte Beta die Zahlen ohne Vorzeichen.',
      }, { short: 'größtes Beta', help: 'Spalte Beta, ohne Vorzeichen vergleichen.' }),
    number('a3b', 'Wie groß ist Beta von `lage`?', 0.110, 0.002, '0,110.',
      'Lies die Zeile `lage`, Spalte Beta (nicht B).',
      [{ value: 0.176, tolerance: 0.002, text: 'Das ist B.' }],
      { short: 'Beta von `lage`' }),
    choice('a3c', '`abitur` hat das größere B (0,216) als `lage` (0,176). Welcher Satz stimmt?', [
      ['abitur', '„Abitur hängt stärker mit der Demokratiezufriedenheit zusammen als die eigene Lage, weil sein B größer ist.“'],
      ['lage', '„Gemessen an Beta hängt die eigene Lage etwas stärker zusammen (0,110 gegen 0,085). B ist größer bei abitur, weil ein Schritt dort der ganze Schritt von „kein Abitur“ zu „Abitur“ ist.“'],
      ['gleich', '„Beide hängen gleich stark zusammen.“'],
    ], 'lage', 'Genau. Die Reihenfolge der B und der Beta ist hier verschieden. Zum Vergleichen nimmst du ⟪Beta⟫, den standardisierten Koeffizienten.', {
      abitur: 'B hängt an der Einheit. `lage` hat fünf Stufen, `abitur` nur zwei; vergleiche Beta: 0,110 gegen 0,085.',
      gleich: 'Beta unterscheidet sich, 0,110 gegen 0,085. Der Unterschied ist klein, aber da.',
    }, { short: 'B gegen Beta' }),
    number('a3d', 'Wie groß ist das korrigierte R² (Adjusted R Square)?', 0.258, 0.0004,
      '0,258, fast gleich R² 0,259: Bei über 3.500 Befragten (gewichtet) und vier Prädiktoren zieht die Korrektur fast nichts ab; das ⟪korrigierte R²⟫ liegt fast bei R².',
      'Lies unter Model Summary die Zeile Adjusted R Square.',
      [{ value: 0.259, tolerance: 0.0004, text: 'Das ist R Square ohne Korrektur.' }],
      { short: 'korrigiertes R²' }),
    choice('a3e', 'Was sagen die VIF-Werte (1,005 bis 1,208)?', [
      ['gut', '„Kein Problem: Die Prädiktoren hängen kaum untereinander zusammen.“'],
      ['schlecht', '„Problem: Die Werte liegen über 1, also gibt es Multikollinearität.“'],
      ['avz', '„Die Prädiktoren hängen kaum mit der Demokratiezufriedenheit zusammen.“'],
    ], 'gut', 'Genau. Der größte VIF ist 1,208 (dlage), weit unter 10. Eigene Lage und Lage Deutschlands hängen etwas zusammen, das hast du in Aufgabe 1 gesehen, aber nicht so eng, dass das Modell sie nicht trennen kann. Starke ⟪Multikollinearität⟫ liegt also nicht vor.', {
      schlecht: '1 ist der kleinste mögliche VIF. Ein Problem meldet mariposa ab 10.',
      avz: 'Der VIF sagt nichts über den Zusammenhang mit der abhängigen Variable, nur über die Prädiktoren untereinander.',
    }, { short: 'VIF', help: 'Collinearity Statistics, Spalte VIF.' }),
    number('a3f', 'Zweite Vorlage, `ost` allein: Wie groß ist B von `ost`?', -0.624, 0.005,
      '−0,624 ist der ⟪Bruttoeffekt⟫ ohne Kontrollen, −0,521 der ⟪Nettoeffekt⟫ mit Lage und Abitur. Gut vier Fünftel bleiben (0,521 ÷ 0,624 ≈ 0,83). Nur ein kleiner Teil des Ost-West-Unterschieds hängt mit Lage und Abitur zusammen.',
      'Lies in der Ausgabe der zweiten Vorlage die Zeile `ost`, Spalte B.',
      [{ value: -0.521, text: 'Das ist das B aus der ersten Vorlage, mit Kontrollen.' }],
      { short: 'B von `ost` allein', help: 'Aus Schritt 3.' }),
  ],
  a4: [
    number('a4a', 'Modell mit `*`: Wie groß ist B von `ost:abitur`?', 0.060, 0.005,
      '0,060: In diesen Daten ist der Ost-West-Unterschied mit Abitur um 0,06 Punkte kleiner (weniger negativ). Ob das mehr als Zufall ist, klärt Frage a4c.',
      'Hast du `+` gegen `*` getauscht? Dann gibt es eine Zeile `ost:abitur`, Spalte B.',
      [{ value: 0.012, tolerance: 0.002, text: 'Das ist Beta.' }],
      { short: 'B von `ost:abitur`', help: 'Aus Schritt 2.' }),
    number('a4b', 'Wie groß ist der Ost-West-Unterschied bei Befragten mit Abitur?', -0.571, 0.01,
      '−0,571: −0,631 plus 0,060. Ohne Abitur −0,631.',
      'Der Unterschied mit Abitur ist B von `ost` (ohne Abitur) plus B der Interaktion.',
      [{ value: -0.604, tolerance: 0.005, text: 'Das ist B von `ost` aus Schritt 1, ein Unterschied für alle.' }, { value: -0.631, text: 'Das ist der Unterschied ohne Abitur.' }],
      { short: 'Unterschied mit Abitur', help: 'Ergebnis von Schritt 3.' }),
    choice('a4c', 'Was sagt die Zeile `ost:abitur` über den Ost-West-Unterschied mit und ohne Abitur?', [
      ['nein', '„Die Daten zeigen keinen deutlichen Unterschied: 0,06 ist klein, nicht signifikant (Sig. ,590), und das Konfidenzintervall von −0,158 bis 0,277 schließt 0 ein.“'],
      ['ja', '„Mit Abitur ist der Unterschied kleiner, also hilft Bildung gegen Unzufriedenheit im Osten.“'],
      ['gleich', '„Der Unterschied ist mit und ohne Abitur nachweislich gleich groß, weil das Ergebnis nicht signifikant ist.“'],
    ], 'nein', 'Genau. Mit Abitur liegt die Demokratiezufriedenheit im Westen 0,450 höher, im Osten 0,510 (0,450 + 0,060): fast derselbe Abstand. Dass sich der Ost-West-Unterschied mit Abitur ändert, zeigen die Daten nicht; darum reicht das einfachere Modell ohne ⟪Interaktion⟫ (Schritt 1). Ganz ausschließen lässt sich das nicht: Nach dem Intervall könnte der Unterschied mit Abitur auch bis zu 0,28 Punkte kleiner oder bis zu 0,16 Punkte größer sein.', {
      ja: '0,06 ist sehr wenig, und die Daten passen auch zu 0 oder zu einem etwas größeren Unterschied (Intervall −0,158 bis 0,277). Und „hilft gegen“ behauptet eine Ursache.',
      gleich: '„Nicht signifikant“ heißt „kein Hinweis auf einen Unterschied“, nicht „gleich“ (kennst du aus Sitzung 7). Das Intervall reicht von −0,158 bis 0,277; auch ein mittlerer Unterschied passt noch zu den Daten.',
    }, { short: 'Zeile `ost:abitur`', help: 'Zeile `ost:abitur`: B, Sig., 95% CI.' }),
    choice('a4d', 'In Aufgabe 2 beruhte B von Ost→West auf 91 Befragten. Was folgt daraus?', [
      ['einfluss', '„Wenige ungewöhnliche Personen können dieses B merklich verschieben. Darum ist das Konfidenzintervall breit, und man prüft, ob das Ergebnis ohne auffällige Fälle hält.“'],
      ['egal', '„Nichts, die Gewichtung gleicht kleine Gruppen aus.“'],
      ['falsch', '„Das B ist falsch und sollte nicht berichtet werden.“'],
    ], 'einfluss', 'Genau. Bei kleinen Gruppen haben einzelne Fälle mehr ⟪Einfluss⟫ (Grundlage 4a): Ohne einen solchen Fall könnte B deutlich anders liegen. Berichten darf man das B, aber mit Konfidenzintervall und dem Hinweis auf die kleine Gruppe.', {
      egal: 'Die Gewichtung passt die Anteile an, sie macht aus 91 Befragten nicht mehr Information.',
      falsch: 'Das B ist richtig gerechnet, nur unsicher. Unsicherheit berichtet man, statt das Ergebnis wegzulassen.',
    }, { short: 'kleine Gruppen' }),
  ],
};

/** Pflichtaufgaben: Aufgabe 1 bis 3. */
export const REQUIRED: Question[] = [...QUESTIONS.a1, ...QUESTIONS.a2, ...QUESTIONS.a3];

/** Auflösung unter den Antworten, sobald jede Frage beantwortet ist. */
export const RESOLUTIONS: Record<'a1' | 'a2' | 'a3' | 'a4', string> = {
  a1: 'B der eigenen Lage fällt von 0,461 auf 0,198, also auf weniger als die Hälfte. Im Beispiel mit Alter und Gesundheit war es umgekehrt: Dort wurde B größer, eine ⟪Suppression⟫.',
  a2: 'Weder noch: Ost→West liegt 0,17 und West→Ost 0,03 unter den West-Bleibenden, die Ost-Bleibenden 0,71.',
  a3: 'Das meiste: Vom ⟪Bruttoeffekt⟫ −0,624 bleiben als ⟪Nettoeffekt⟫ −0,521, gut vier Fünftel.',
  a4: 'Kein deutlicher Unterschied: −0,631 ohne, −0,571 mit Abitur. Der Unterschied von 0,060 ist nicht signifikant; ganz ausschließen lässt sich ein Unterschied aber nicht (Konfidenzintervall −0,158 bis 0,277).',
};

/* ---------- Kurz überlegen in den Grundlagen ---------- */

/** 1a, erste Frage: festlegen, dann wird das Bild aufgedeckt (gleiche Rückmeldung für jede Wahl). */
export const K1A_GUESS = {
  id: 'k1a',
  label: 'Wer ist im Schnitt zufriedener, die Jüngsten (18 bis 29) oder die Ältesten (75 und älter)?',
  options: ['die Jüngsten', 'etwa gleich', 'die Ältesten'],
  feedback: (picked: string) => `Du hast „${picked}“ gewählt. Die Daten: Die Ältesten sind im Schnitt etwas zufriedener, 7,65 gegen 7,15. Spannend wird es, wenn man die Gesundheit dazunimmt.`,
};

export const THINK: Record<string, S10Question> = {
  k1a: choice('k1a-b', 'Eine Regression mit Alter allein ergibt für das Alter B = 0,008 pro Jahr. Was passiert mit B, wenn die Gesundheit als zweiter Prädiktor ins Modell kommt?',
    [['kleiner', 'B wird kleiner'], ['gleich', 'B bleibt gleich'], ['groesser', 'B wird größer']], 'groesser',
    'Genau. Mit Gesundheit im Modell ist B für das Alter 0,024, dreimal so groß. Das Modell vergleicht jetzt Ältere und Jüngere mit gleicher Gesundheit, wie die drei farbigen Linien.', {
      kleiner: 'Oft wird ein B kleiner, wenn ein zweiter Prädiktor dazukommt. Hier nicht: Die Gesundheit hat den Alterszusammenhang verdeckt, nicht erklärt (⟪Suppression⟫). Mit Gesundheit im Modell ist B 0,024.',
      gleich: 'Gleich bliebe B nur, wenn Alter und Gesundheit nichts miteinander zu tun hätten. Ältere sind aber seltener gesund. B steigt auf 0,024.',
    }),
  k1b: number('k1b', 'Zwei Personen sind gleich alt. Eine schätzt ihre Gesundheit „sehr gut“ ein (gesund = 5), die andere „zufriedenstellend“ (gesund = 3). Um wie viel liegt die Vorhersage der ersten höher?', 1.722, 0.01,
    '1,722: zwei Stufen mal 0,861. Das Alter fällt weg, weil es bei beiden gleich ist.',
    'Die beiden unterscheiden sich um zwei Gesundheitsstufen (5 minus 3). Jede Stufe bringt 0,861.',
    [{ value: 0.861, tolerance: 0.01, text: 'Das ist eine Stufe. Von 3 bis 5 sind es zwei.' }],
    { short: 'Unterschied der Vorhersagen', help: 'Eine Kommazahl reicht, zum Beispiel 0,5.' }),
  k1c: choice('k1c', 'Eine Journalistin fragt: „Unterscheiden sich Ältere und Jüngere mit gleicher Gesundheit in ihrer Lebenszufriedenheit?“ Welche Zahl beantwortet genau diese Frage?',
    [['008', '0,008 pro Jahr'], ['024', '0,024 pro Jahr'], ['keine', 'keine von beiden']], '024',
    'Genau. 0,024 vergleicht Menschen mit gleicher Gesundheit. 0,008 beantwortet eine andere Frage: Wie unterscheiden sich Ältere und Jüngere insgesamt, so wie sie sind, mit ihrer Gesundheit?', {
      '008': '0,008 vergleicht Ältere und Jüngere insgesamt, so wie sie sind, also auch mit ihrer schlechteren Gesundheit. Für „bei gleicher Gesundheit“ brauchst du das Modell mit Gesundheit: 0,024.',
      keine: 'Beide beantworten eine Frage, nur verschiedene. „Bei gleicher Gesundheit“ ist das Modell mit Gesundheit: 0,024.',
    }),
  k2a: number('k2a', 'Welche mittlere Lebenszufriedenheit sagt das Modell für die Verheirateten voraus?', 7.694, 0.01,
    '7,694: 7,042 plus 0,652. Das ist genau der Mittelwert der Verheirateten (gerundet 7,69).',
    'Für die Verheirateten ist die Dummyvariable 1. Rechne Konstante plus B mal 1.',
    [{ value: 0.652, text: 'Das ist nur der Unterschied. Die Vorhersage ist Konstante plus Unterschied.' }],
    { short: 'Vorhersage Verheiratete', help: 'Konstante plus B. Eine Kommazahl reicht.' }),
  k2b: number('k2b', 'Stell die Referenz auf „verheiratet“. Wie groß ist dann B für die Ledigen?', -0.653, 0.005,
    '−0,653: Ledige liegen 0,653 Punkte unter den Verheirateten. Mit der Referenz „ledig“ stand dort +0,653 für die Verheirateten: derselbe Unterschied, nur von der anderen Seite.',
    'Mit der Referenz „verheiratet“ ist jedes B der Unterschied zu den Verheirateten. Ledige sind weniger zufrieden, das B ist also negativ.',
    [{ value: 0.653, text: 'Das Vorzeichen fehlt: Ledige liegen unter den Verheirateten.' }],
    { short: 'B der Ledigen' }),
  k2c: choice('k2c', 'Warum wirft R den fünften Dummy hinaus?',
    [['wenige', 'Weil die Ledigen zu wenige sind'], ['neu', 'Weil der fünfte Dummy nichts Neues sagt: Wer bei den anderen vier überall 0 hat, ist ledig'], ['vier', 'Weil R höchstens vier Prädiktoren rechnen kann']], 'neu',
    'Genau. Der fünfte Dummy steckt vollständig in den anderen vier. Ein Modell kann zwei Dinge, die immer zusammen auftreten, nicht auseinanderhalten. Das nennt man perfekte Multikollinearität; bei Dummies heißt sie ⟪Dummyfalle⟫. Mehr dazu in Grundlage 3.', {
      wenige: 'Ledige sind mit 1.459 (gewichtet) die zweitgrößte Gruppe. Der Grund ist ein anderer: Der fünfte Dummy sagt nichts Neues.',
      vier: 'R rechnet auch mit viel mehr Prädiktoren. Hier stört, dass der fünfte Dummy schon in den anderen vier steckt.',
    }),
  k3a: choice('k3a', 'Welcher Prädiktor hängt stärker mit der Lebenszufriedenheit zusammen?',
    [['alter', 'das Alter'], ['gesundheit', 'die Gesundheit'], ['unklar', 'kann man nicht sagen']], 'gesundheit',
    'Genau: Beta 0,454 gegen 0,225, etwa doppelt so viel.', {
      alter: 'Pro Standardabweichung bringt das Alter 0,43 Punkte, die Gesundheit 0,87. Beta: 0,225 gegen 0,454.',
      unklar: 'Mit B allein nicht, weil Jahre und Stufen verschieden sind. Mit Beta schon: 0,454 gegen 0,225.',
    }),
  k3b: choice('k3b', 'Im Modell aus R lesen sind R² und korrigiertes R² beide 0,190. Warum ziehen die zwei Prädiktoren dort fast nichts ab?',
    [['gut', 'Weil das Modell sehr gut ist'], ['viele', 'Weil auf jeden Prädiktor über 2.500 Befragte kommen'], ['wichtig', 'Weil Alter und Gesundheit wichtig sind']], 'viele',
    'Genau. Mit 5.128 Befragten und 2 Prädiktoren ist der Abzug winzig. Wichtig wird das korrigierte R² bei kleinen Gruppen und vielen Prädiktoren.', {
      gut: 'R² 0,19 ist ordentlich, aber das ist nicht der Grund. Der Abzug hängt nur an n und k: 5.128 Befragte, 2 Prädiktoren.',
      wichtig: 'Auch unwichtige Prädiktoren würden hier kaum etwas abziehen. Entscheidend sind viele Befragte für wenige Prädiktoren.',
    }),
  k3c: choice('k3c', 'Im zweiten Modell ist die Altersgruppe nicht signifikant (Sig. ,153). Heißt das, dass das Alter in Gruppen nichts mit der Zufriedenheit zu tun hat?',
    [['ja', 'Ja, die Altersgruppe spielt keine Rolle'], ['nein', 'Nein: Alter und Altersgruppe teilen sich fast dieselbe Information, und das Modell kann sie nicht auseinanderhalten']], 'nein',
    'Genau. Allein mit der Gesundheit hat die Altersgruppe ein deutliches B (0,344 pro Gruppe, VIF 1,1). Erst neben dem Alter in Jahren verliert sie, weil fast alles, was sie weiß, schon im Alter steckt.', {
      ja: 'Ohne das Alter in Jahren ist die Altersgruppe sehr wohl deutlich (B 0,344, Sig. <,001). Neben dem Alter in Jahren hat sie nur nichts Eigenes mehr zu sagen.',
    }),
  k4a: choice('k4a', 'In welchem Fall verändert Person L die Steigung am stärksten?',
    [['mitte', 'L in der Mitte, sehr unzufrieden'], ['rand', 'L ganz rechts, sehr unzufrieden'], ['erwartet', 'L ganz rechts, so zufrieden wie erwartet']], 'rand',
    'Genau. Großen ⟪Einfluss⟫ hat ein Fall, der beim Prädiktor weit draußen liegt und zugleich weit weg von der Geraden. Hier dreht sich die Steigung von +0,022 auf −0,042.', {
      mitte: 'In der Mitte zieht L die Gerade nur nach unten, ihre Neigung bleibt 0,022. Weit draußen wirkt L wie an einem langen Hebel.',
      erwartet: 'Weit draußen allein reicht nicht. Liegt L auf der Geraden, bestätigt L sie nur: Steigung 0,020.',
    }),
  k4b: number('k4b', 'Wie groß ist der Unterschied zwischen Erwerbstätigen und Nicht-Erwerbstätigen ab 60 laut Modell? Rechne B von `erwerb` plus B von `erwerb:ab60`.', 0.056, 0.01,
    '0,056: 1,091 minus 1,035. Ab 60 macht die Erwerbstätigkeit fast keinen Unterschied, unter 60 einen großen (1,091).',
    'Der Unterschied ab 60 ist der Unterschied unter 60 (B von `erwerb`, 1,091) plus die Interaktion (−1,035).',
    [{ value: 1.091, text: 'Das ist der Unterschied unter 60. Ab 60 kommt die Interaktion dazu.' }],
    { short: 'Unterschied ab 60' }),
};

/** Überblick: Zuordnen (Index in ASSIGN_OPTIONS). */
export const ASSIGN_OPTIONS = ['direkt', '0/1 mit rec()', 'to_dummy()'];
export const ASSIGN: { question: string; answer: number; right: string; wrong: string }[] = [
  { question: 'Konfession (evangelisch, katholisch, andere, keine)', answer: 2, right: 'Vier Gruppen ohne Reihenfolge: Dummies, eine als Referenz.', wrong: 'Die Codes der Konfession sind Namen, keine Stufen. Mehr als zwei Gruppen: to_dummy().' },
  { question: 'Vertrauen in die Polizei, 1 bis 7', answer: 0, right: 'Stufen mit Reihenfolge: direkt.', wrong: 'Sieben Stufen mit Reihenfolge kommen direkt in die Formel.' },
  { question: 'deutsche Staatsangehörigkeit, ja oder nein', answer: 1, right: 'Zwei Gruppen: eine 0/1-Variable.', wrong: 'Bei zwei Gruppen reicht eine 0/1-Variable mit rec().' },
];

/* ---------- Erst festlegen ---------- */

export const PREDICTIONS: Record<'a1' | 'a2' | 'a3' | 'a4', { id: string; prompt: string; options: string[] }> = {
  a1: { id: 'a1', prompt: 'Was passiert mit dem B der eigenen Lage, wenn die Lage Deutschlands als zweiter Prädiktor dazukommt?', options: ['wird deutlich kleiner', 'bleibt etwa gleich', 'wird größer'] },
  a2: { id: 'a2', prompt: 'Welches Muster erwartest du?', options: ['Prägung: Ost→West ähnelt den Ost-Bleibenden', 'Ort: West→Ost ähnelt den Ost-Bleibenden', 'Weder noch: Beide Umzugsgruppen ähneln den West-Bleibenden'] },
  a3: { id: 'a3', prompt: 'Wie viel bleibt vom Ost-West-Unterschied, wenn Lage und Abitur konstant gehalten werden?', options: ['fast nichts', 'etwa die Hälfte', 'das meiste'] },
  a4: { id: 'a4', prompt: 'Wie groß ist der Ost-West-Unterschied bei Befragten mit Abitur, verglichen mit denen ohne?', options: ['deutlich kleiner', 'kaum anders', 'deutlich größer'] },
};

/* ---------- Hilfe in drei Stufen ---------- */

export const HINTS: Record<'a1' | 'a2' | 'a3' | 'a4', [string, string, string]> = {
  a1: [
    'Im ersten Modell steckt in B von `lage` alles, was mit der eigenen Lage zusammenhängt, auch die Einschätzung des Landes, die oft mitläuft. Im zweiten Modell hat die Lage Deutschlands ihre eigene Zeile. B von `lage` gilt jetzt bei gleicher Einschätzung des Landes.',
    'B steht unter Coefficients in der Spalte B, in der Zeile der Variable. R Square steht unter Model Summary. Für Schritt 2 änderst du nur die Formel: `demo ~ lage + dlage`. Die Variable `dlage` bildet die Vorlage schon in `mutate()`.',
    'Schritt 1: B von `lage` 0,461, R² 0,084. Schritt 2 mit `demo ~ lage + dlage`: B von `lage` 0,198, B von `dlage` 0,668, R² 0,228. Richtig ist der Satz „Bei gleicher Einschätzung der Lage Deutschlands geht eine Stufe bessere eigene Lage mit 0,2 Punkten mehr Demokratiezufriedenheit einher.“ B wird kleiner, weil die beiden Einschätzungen zusammenhängen.',
  ],
  a2: [
    'Die Konstante ist der Mittelwert der Gruppe, deren Dummy in der Formel fehlt. Jedes B ist der Unterschied einer Gruppe zu ihr. Die Vorhersage einer Gruppe ist Konstante plus ihr B.',
    'Konstante und B stehen unter Coefficients in der Spalte B: (Intercept) ist die Konstante, `dg03_1` die Ost-Bleibenden, `dg03_2` Ost→West, `dg03_3` West→Ost. Die Konfidenzintervalle stehen in den Spalten 95% CI Lower und Upper. Für Schritt 3 tauschst du nur `dg03_1` gegen `dg03_4`.',
    'Referenz West-Bleibende: Konstante 4,243; Ost-Bleibende −0,705; Ost→West −0,166 (KI −0,404 bis 0,072); West→Ost −0,034 (KI −0,385 bis 0,317). Vorhersage Ost→West: in der Taschenrechner-Vorlage `4.243 + -0.166`, ergibt 4.077. Referenz Ost-Bleibende: Konstante 3,537; West-Bleibende +0,705; Ost→West +0,540; West→Ost +0,671; Vorhersage Ost→West 3,537 + 0,540 = 4,077. Muster: weder Prägung noch Ort; beide Umzugsgruppen liegen nah bei den West-Bleibenden, sicher ist das bei so kleinen Gruppen aber nicht.',
  ],
  a3: [
    'B sagt, wie viel sich die Vorhersage pro Schritt ändert, und ein Schritt ist bei jedem Prädiktor etwas anderes. Beta rechnet alle auf dieselbe Einheit um. Für den Ost-West-Unterschied vergleichst du B von `ost` mit und ohne die anderen Prädiktoren.',
    'B und Beta stehen unter Coefficients, nebeneinander. Adjusted R Square steht unter Model Summary, die VIF ganz unten unter Collinearity Statistics. Das B von `ost` ohne Kontrollen steht in der Ausgabe der zweiten Vorlage.',
    'B: lage 0,176, dlage 0,635, ost −0,521, abitur 0,216. Beta: lage 0,110, dlage 0,394, ost −0,154, abitur 0,085. Am stärksten: die Lage Deutschlands. `abitur` hat das größere B als `lage`, aber das kleinere Beta. R² 0,259, korrigiert 0,258. VIF 1,005 bis 1,208: kein Problem. `ost` allein: −0,624; mit Kontrollen −0,521, gut vier Fünftel bleiben.',
  ],
  a4: [
    'Mit `*` bekommt das Modell eine eigene Zeile für die Frage „Ist der Unterschied in der zweiten Gruppe anders?“. B von `ost` gilt dann nur für die Gruppe mit `abitur` = 0.',
    'Unter Coefficients die Zeilen `ost` und `ost:abitur`, Spalten B, Sig. und 95% CI. Für den Unterschied mit Abitur zählst du die beiden B zusammen.',
    'Schritt 1 (`+`): ost −0,604, abitur 0,460. Schritt 2 (`*`): Konstante 4,042, ost −0,631, abitur 0,450, ost:abitur 0,060 (Sig. ,590; KI −0,158 bis 0,277). Unterschied mit Abitur: in der Taschenrechner-Vorlage `-0.631 + 0.060`, ergibt −0,571. Dass sich der Ost-West-Unterschied mit Abitur ändert, zeigen die Daten nicht (Sig. ,590, das Intervall schließt 0 ein); „sicher gleich“ ist das aber nicht. Kleine Gruppen wie die 91 Ost→West-Umgezogenen: einzelne Fälle haben mehr Einfluss, das B ist unsicher, also mit Konfidenzintervall berichten.',
  ],
};

/* ---------- Hilfe bei R-Fehlermeldungen ---------- */

/** Spalte „R meldet“ ist R-Text (als Code gezeigt, ausser `plain`); die anderen Spalten mit Code in `Backticks`. */
export const ERROR_HELP: { says: string; plain?: boolean; what: string; todo: string }[] = [
  { says: 'Variables not found in data: `demo` and `lage`.', what: 'Die Variablen gibt es noch nicht: Der `mutate()`-Teil fehlt oder wurde gelöscht. Jede Werkstatt beginnt mit dem frischen `allbus`.', todo: 'Die ganze Vorlage ausführen, mit `mutate()`. Mit „Zurücksetzen“ holst du sie zurück.' },
  { says: 'Variable not found in data: `dg03_5`.', what: '`dg03` hat nur vier Gruppen, also gibt es nur `dg03_1` bis `dg03_4`.', todo: 'Nur Dummies mit vorhandenen Codes nehmen.' },
  { says: 'Variables not found in data: `dg03_1` and `dg03_2`.', what: '`to_dummy(dg03)` fehlt in der Pipe.', todo: 'Die Zeile `to_dummy(dg03) %>%` vor `linear_regression()` stehen lassen.' },
  { says: 'konnte Funktion "dlage" nicht finden', what: 'In der Formel steht `%>%` statt `+` (`demo ~ lage %>% dlage`).', todo: 'Prädiktoren in der Formel mit `+` verbinden.' },
  { says: "Unerwartete(s) ','", what: 'In der Formel steht ein `+` ohne Prädiktor dahinter (`demo ~ lage + , weights = …`).', todo: 'Den Prädiktor hinter `+` ergänzen oder das `+` löschen.' },
  { says: 'kein Fehler, aber in „Formula“ fehlt ein Prädiktor', plain: true, what: 'Komma statt Plus (`demo ~ lage, dlage`). R rechnet still nur mit `lage`.', todo: 'Zeile „Formula“ prüfen; Prädiktoren mit `+` verbinden.' },
  { says: 'ℹ Excluded due to perfect collinearity (matching SPSS): `dg03_4`', what: 'Kein Fehler: Alle vier Dummies stehen in der Formel (Dummyfalle). R wirft einen hinaus; er wird zur Referenz.', todo: 'Absichtlich einen Dummy weglassen, damit du selbst wählst, wer die Referenz ist.' },
  { says: 'Note: labelled predictor(s) … entered with their numeric codes', what: 'Kein Fehler: R rechnet mit den Codes als Zahlen.', todo: 'Bei Stufen (Lage 1 bis 5) in Ordnung. Bei Gruppen ohne Reihenfolge Dummies bilden.' },
  { says: 'Kopfzeile „Linear Regression Results“ ohne „Weighted“', plain: true, what: '`weights = wghtpew` fehlt; die Zahlen weichen dann von den Zielwerten ab.', todo: '`weights = wghtpew` ergänzen.' },
  { says: 'konnte Funktion "linear_regresion" nicht finden', what: 'Tippfehler im Funktionsnamen.', todo: '`linear_regression` mit zwei s.' },
];

/* ---------- Prüf dich selbst ---------- */

export type SelfTestItem = { question: string; options: { text: string; why: string }[]; answer: number };
export const SELF_TEST: SelfTestItem[] = [
  { question: 'Im Modell `ls01 ~ age + gesund` ist B für `age` 0,024. Was heißt das?', answer: 0, options: [
    { text: 'Bei gleicher Gesundheit geht ein Jahr mehr mit 0,024 Punkten mehr Lebenszufriedenheit einher.', why: 'Genau: B gilt bei gleichem Wert der anderen Prädiktoren.' },
    { text: 'Ältere sind insgesamt 0,024 Punkte pro Jahr zufriedener.', why: 'Insgesamt, ohne Gesundheit, sind es 0,008 pro Jahr. 0,024 gilt bei gleicher Gesundheit.' },
    { text: 'Das Alter erklärt 2,4 % der Lebenszufriedenheit.', why: 'B ist keine Prozentzahl; wie viel erklärt wird, sagt R².' },
  ] },
  { question: 'Mit Referenz „ledig“ hat „geschieden“ B = −0,059. Was ist −0,059?', answer: 0, options: [
    { text: 'der Abstand der Geschiedenen zu den Ledigen', why: 'Genau. Der Mittelwert der Geschiedenen ist Konstante plus B: 7,042 − 0,059 = 6,983.' },
    { text: 'die mittlere Zufriedenheit der Geschiedenen', why: 'Das wäre Konstante plus B, 6,983. B allein ist der Abstand.' },
    { text: 'der Abstand der Geschiedenen zum Durchschnitt aller', why: 'Verglichen wird mit der Referenzgruppe, nicht mit allen.' },
  ] },
  { question: 'Prädiktor A hat B = 0,8 und Beta = 0,10, Prädiktor B hat B = 0,02 und Beta = 0,30 (im selben Modell). Welcher hängt stärker mit der abhängigen Variable zusammen?', answer: 0, options: [
    { text: 'B, wegen des größeren Beta', why: 'Genau. B hängt an der Einheit, Beta nicht.' },
    { text: 'A, wegen des größeren B', why: 'Ein großes B kann von einer großen Einheit kommen. Vergleich mit Beta.' },
    { text: 'Beide gleich stark', why: 'Beta unterscheidet sich deutlich: 0,30 gegen 0,10.' },
  ] },
  { question: 'Ein Modell mit 40 Befragten und 8 Prädiktoren hat R² 0,30 und korrigiertes R² 0,12. Was schließt du?', answer: 0, options: [
    { text: 'Ein großer Teil von R² könnte Zufall sein; viele Prädiktoren für wenige Befragte.', why: 'Genau. Die Korrektur zieht viel ab, weil auf jeden Prädiktor nur 5 Befragte kommen.' },
    { text: 'Das Modell erklärt sicher 30 %.', why: 'R² steigt mit jedem Prädiktor, auch mit nutzlosen. Bei so wenigen Befragten ist das korrigierte R² ehrlicher.' },
    { text: 'R hat falsch gerechnet.', why: 'Beide Zahlen sind richtig. Sie unterscheiden sich, weil das korrigierte R² für jeden Prädiktor etwas abzieht.' },
  ] },
  { question: 'Zwei Prädiktoren haben VIF 15. Was passiert?', answer: 0, options: [
    { text: 'Ihre B werden unsicher, weil das Modell die beiden kaum trennen kann.', why: 'Genau. Die Standardfehler werden groß, B kann springen.' },
    { text: 'Beide hängen sehr stark mit der abhängigen Variable zusammen.', why: 'Der VIF misst den Zusammenhang der Prädiktoren untereinander, nicht mit der abhängigen Variable.' },
    { text: 'Nichts, VIF ist nur eine Zusatzinformation.', why: 'Ab 10 meldet mariposa ein Problem. Einen weglassen oder zusammenfassen.' },
  ] },
  { question: 'Du willst wissen, ob Ostdeutsche weniger zufrieden mit der Demokratie sind. Solltest du das Vertrauen in den Bundestag kontrollieren?', answer: 0, options: [
    { text: 'Nein: Es misst sehr Ähnliches wie die Demokratiezufriedenheit und kann selbst eine Folge davon sein.', why: 'Genau. Wer es kontrolliert, rechnet einen großen Teil dessen heraus, was er messen will.' },
    { text: 'Ja: Je mehr Kontrollen, desto genauer.', why: 'Mehr Kontrollen sind nicht automatisch besser. Kontrolliere gemeinsame Ursachen, nicht Variablen, die fast dasselbe messen wie die abhängige Variable oder aus ihr folgen.' },
    { text: 'Ja, weil es mit beiden zusammenhängt.', why: 'Zusammenhang allein reicht nicht. Entscheidend ist, ob es vorher feststeht (gemeinsame Ursache) oder fast dasselbe misst.' },
  ] },
];

/* ---------- Skript zum Mitnehmen ---------- */

export const SCRIPT_FILE = 'sitzung10.R';
const plain = (key: string) => parseMarks(TEMPLATES[key].code).code;
/** sitzung10.R in der Reihenfolge des Plans: Vorlagen gelöst, Blöcke durch eine Leerzeile getrennt. */
export const SCRIPT = [
  '# Sitzung 10: Regression vertiefen\n# ALLBUS 2023, gewichtet mit wghtpew',
  plain('start'),
  '# --- R lesen ---', plain('r_modell'), plain('r_dummy'),
  '# --- Aufgabe 1 ---\n# Schritt 1 mit demo ~ lage, Schritt 2 mit demo ~ lage + dlage',
  solve('a1', 'lage + dlage'),
  '# --- Aufgabe 2 ---', plain('a2'),
  solve('a2_rechnen', '4.243', '-0.166'),
  '# Referenz Ost-Bleibende: dg03_1 fehlt', solve('a2', 'dg03_4'),
  solve('a2_rechnen', '3.537', '0.540'),
  '# --- Aufgabe 3 ---', plain('a3'), plain('a3_ost'),
  '# --- Aufgabe 4 (Zusatz) ---', solve('a4', '*'),
  solve('a4_rechnen', '-0.631', '0.060'),
  '# --- Ideen zum Weiterdenken ---', plain('frei_a1'), plain('frei_a2'), plain('frei_a3'), plain('frei_a4'),
].join('\n\n') + '\n';
