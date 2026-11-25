// Sitzung 11 „Logistische Regression“: Zahlen, Vorlagen und Fragen aus docs/entwicklung/spezifikationen/2026-11-23-lernpfad-kapitel/sitzung11.md, nur Daten.
// Alle Zahlen: ALLBUS 2023, ZA8831 v1.3.0, gewichtet mit wghtpew, nur Aggregate. Geprüft in allbus.local.test.ts und sitzung11-zahlen.R.
import { answerNumbers, judge, type Question } from '../answers';
import { parseMarks } from '../workshop/editor';

/* ---------- Daten: Smartphone-Modell (Grundlagen, lm30 ~ age, Internetnutzende) ---------- */

/** Grundlage 1b: Anteil mit Smartphone je Altersgruppe (gewichtet), gezählte Befragte, gewichtetes Mittel des Alters (ganze Jahre). */
export const AGE_GROUPS: { label: string; mid: number; n: number; share: number }[] = [
  { label: '18–29', mid: 24, n: 692, share: 99.2 },
  { label: '30–39', mid: 35, n: 791, share: 98.5 },
  { label: '40–49', mid: 44, n: 712, share: 96.8 },
  { label: '50–59', mid: 55, n: 974, share: 94.0 },
  { label: '60–69', mid: 64, n: 902, share: 85.4 },
  { label: '70–79', mid: 74, n: 550, share: 77.7 },
  { label: '80–99', mid: 83, n: 156, share: 59.3 },
];

/** Die Gerade (lineare Regression lm30 ~ age, gewichtet): Konstante, B mit mehr Stellen, B wie gedruckt, R². */
export const LINE = { intercept: 1.151, slope: -0.00474, slopePrinted: -0.005, r2: 0.084 };

/** Das logistische Modell lm30 ~ age, gewichtet, wie mariposa 0.7.4 es druckt. */
export const SMARTPHONE = {
  intercept: 6.774, b: -0.076, bExact: -0.0758, expB: 0.927, ciLower: 0.919, ciUpper: 0.935, se: 0.004, wald: 328.394,
  interceptSe: 0.276, interceptWald: 604.222, interceptExpB: 874.684,
  n: 4813, cases: 4777, mean: 0.914,
  minus2LL: 2370.945, chi2: 453.95, minus2LLNull: 2824.895, coxSnell: 0.09, nagelkerke: 0.203, mcfadden: 0.161, hosmerSig: 0.378,
  /** Classification Table (gewichtet, gerundet): beobachtet × vorhergesagt. */
  table: { no: { no: 4, yes: 411, pct: 0.9 }, yes: { no: 5, yes: 4393, pct: 99.9 }, overall: 91.4 },
  ame: -0.005, ameExact: -0.00532, ameSe: '3.04e-04',
  /** predict(type = "response") mit ungerundeten Zahlen, als Anteil */
  predict: { 18: 0.996, 30: 0.9890025, 40: 0.977, 70: 0.812, 80: 0.6698802, 95: 0.394 } as Record<number, number>,
  /** predict() ohne type = "response": Logit der 30-Jährigen */
  logit30: 4.499,
};

/** Logit, Chance und Wahrscheinlichkeit (in %) mit den gerundeten Zahlen der Ausgabe (6,774 und −0,076), wie Studierende nachrechnen. */
export function byHand(age: number) {
  const logit = SMARTPHONE.intercept + SMARTPHONE.b * age;
  const chance = Math.exp(logit);
  return { logit, chance, p: 100 * chance / (1 + chance) };
}
/** S-Kurve in B2 und B9: p(Alter) = 1 / (1 + e^−(6,774 − 0,0758 × Alter)). */
export const sCurve = (age: number) => 1 / (1 + Math.exp(-(SMARTPHONE.intercept + SMARTPHONE.bExact * age)));
/** Die Gerade aus 1b: Vorhersage = 1,151 − 0,00474 × Alter (Anteil). */
export const straight = (age: number) => LINE.intercept + LINE.slope * age;

/** Reglerstellungen in B5 (Alter 20 bis 90). */
export const SLIDER_AGES = [20, 30, 40, 50, 60, 70, 80, 90];

/* ---------- Daten: Wahlabsicht (Aufgaben, pv01, pe09, pa02a) ---------- */

/** Aufgabe 1, Schritt 1: frequency(waehlen, weights = wghtpew). */
export const VOTE_FREQ = { total: 5246, valid: 3977, no: 232, yes: 3745, rawYes: 71.38, validYes: 94.17, validNo: 5.83, system: 1269, mean: 0.94 };

/** Aufgabe 1, Schritt 2: crosstab(pflicht, waehlen, percentages = "row"), gewichtet; pflicht 1 = stimme gar nicht zu … 4 = stimme voll zu. */
export const CROSSTAB: { pflicht: number; answer: string; pe09: number; no: number; yes: number; total: number; rowNo: number; rowYes: number }[] = [
  { pflicht: 1, answer: 'stimme gar nicht zu', pe09: 4, no: 39, yes: 62, total: 101, rowNo: 38.6, rowYes: 61.4 },
  { pflicht: 2, answer: 'stimme eher nicht zu', pe09: 3, no: 48, yes: 173, total: 221, rowNo: 21.7, rowYes: 78.3 },
  { pflicht: 3, answer: 'stimme eher zu', pe09: 2, no: 34, yes: 623, total: 657, rowNo: 5.2, rowYes: 94.8 },
  { pflicht: 4, answer: 'stimme voll zu', pe09: 1, no: 21, yes: 1759, total: 1780, rowNo: 1.2, rowYes: 98.8 },
];
export const CROSSTAB_TOTAL = { no: 142, yes: 2617, total: 2759 };

/** Aufgabe 2 bis 4: waehlen ~ pflicht + interesse, gewichtet. */
export const VOTE_MODEL = {
  intercept: -2.154, interceptSe: 0.371, interceptExpB: 0.116,
  pflicht: { b: 1.326, se: 0.09, wald: 214.993, expB: 3.765, ciLower: 3.154, ciUpper: 4.495, ame: 0.054 },
  interesse: { b: 0.34, se: 0.096, wald: 12.513, expB: 1.405, ciLower: 1.164, ciUpper: 1.696, ame: 0.014 },
  n: 2758, cases: 2778, casesNo: 146, sumW: 2757.7,
  minus2LL: 856.448, chi2: 265.831, minus2LLNull: 1122.279, coxSnell: 0.092, nagelkerke: 0.275, mcfadden: 0.237, hosmerSig: 0.039,
  table: { no: { no: 18, yes: 125, pct: 12.8 }, yes: { no: 12, yes: 2603, pct: 99.5 }, overall: 95.1 },
  /** predict() für A (2 | 2), A + 1 (3 | 2), B (3 | 4), B + 1 (4 | 4) */
  predict: [0.7644409, 0.9243475, 0.9601851, 0.9891065],
  /** Probier-Werkstatt A3: pflicht 1 bis 4 bei interesse 3 */
  steps: [0.5477045, 0.8201193, 0.9449511, 0.9847629],
  /** ungewichtet geschätzt: Exp(B) des Pflichtgefühls */
  unweightedExpB: 3.703,
};
/** Aufgabe 2, Schritt 1: nur mit dem Pflichtgefühl. */
export const VOTE_MODEL_PFLICHT = { intercept: -1.16, b: 1.358, expB: 3.888, ciLower: 3.267, ciUpper: 4.628, n: 2759 };
/** Probier-Werkstatt A2: mit dem Alter. */
export const VOTE_MODEL_AGE = { pflichtExpB: 3.724, interesseExpB: 1.408, ageExpB: 1.008, ageSig: 0.146, n: 2751 };
/** Probier-Werkstatt A4: nur mit dem Interesse. */
export const VOTE_MODEL_INTEREST = { nagelkerke: 0.05, chi2: 72.45, accuracy: 94.2, n: 3970 };
/** pe09: gültig und TNZ: SPLIT (ungewichtet). */
export const PE09 = { valid: 3602, split: 1596 };
/** Wahlabsicht je Interesse (Zeilenprozent „würde wählen“, gewichtet), interesse 1 = überhaupt nicht … 5 = sehr stark. */
export const INTEREST_ROWS: Record<1 | 4 | 5, number> = { 1: 70.2, 4: 97.5, 5: 94.1 };

/* ---------- Codevorlagen ---------- */

export type Template = { title: string; code: string; tryOut?: boolean };
const REC3 = `    waehlen   = rec(pv01, rules = "1:90=1 [würde wählen]; 91=0 [würde nicht wählen]; else=NA"),
    pflicht   = rec(pe09, rules = "rev"),
    interesse = rec(pa02a, rules = "rev")`;

/** ⟦…⟧ markiert Stellen, die angepasst werden. Jede Vorlage läuft für sich (die Werkstatt lädt `allbus` vor jedem Ausführen neu). */
export const TEMPLATES: Record<string, Template> = {
  start: { title: 'Startblock', code: `# Pakete laden und Daten einlesen
library(tidyverse)
library(mariposa)

allbus <- read_spss("ZA8831_v1-3-0.sav")` },
  r_modell: { title: 'Logistisches Modell: Smartphone nach Alter', code: `# Logistisches Modell: Internet mit dem Smartphone (lm30) nach Alter, gewichtet
smartphone <- allbus %>%
  logistic_regression(lm30 ~ age, weights = wghtpew)

# Kurz: eine Zeile mit den wichtigsten Zahlen
smartphone

# Ausführlich: alle Tabellen
smartphone %>%
  summary()` },
  r_exp: { title: 'Aus B wird Exp(B)', code: `# Aus B wird Exp(B): e hoch B
exp(-0.076)` },
  r_predict: { title: 'Vorhergesagte Wahrscheinlichkeiten für zwei Beispielpersonen', code: `# Modell wie oben, dann zwei Beispielpersonen: 30 und 80 Jahre alt
smartphone <- allbus %>%
  logistic_regression(lm30 ~ age, weights = wghtpew)

leute <- tibble(
  age = c(30, 80)
)

smartphone %>%
  predict(newdata = leute, type = "response")` },
  r_ame: { title: 'Durchschnittlicher marginaler Effekt', code: `# Durchschnittlicher marginaler Effekt (AME) des Alters
allbus %>%
  logistic_regression(lm30 ~ age, weights = wghtpew) %>%
  marginal_effects() %>%
  summary()` },
  a1f: { title: 'Aufgabe 1: Wählen als 0/1', code: `# Wählen als 0/1 bilden und auszählen, gewichtet
allbus %>%
  mutate(
    waehlen = rec(pv01, rules = "1:90=1 [würde wählen]; 91=0 [würde nicht wählen]; else=NA")
  ) %>%
  frequency(waehlen, weights = wghtpew)` },
  a1k: { title: 'Aufgabe 1: Kreuztabelle Pflichtgefühl × Wählen', code: `# Wählen als 0/1 und Pflichtgefühl umgepolt; Kreuztabelle mit Zeilenprozent, gewichtet
allbus %>%
  mutate(
    waehlen = rec(pv01, rules = "1:90=1 [würde wählen]; 91=0 [würde nicht wählen]; else=NA"),
    pflicht = rec(pe09, rules = "rev")
  ) %>%
  crosstab(pflicht, waehlen, percentages = "row", weights = wghtpew)` },
  a1r: { title: 'Aufgabe 1: Prozentpunkte je Stufe', code: `# Wie viele Prozentpunkte bringt eine Stufe? Hier die erste Stufe
⟦78.3⟧ - ⟦61.4⟧` },
  a1c: { title: 'Aufgabe 1: Chance', code: `# Chance = Prozent „wählen“ geteilt durch Prozent „nicht wählen“, hier „stimme gar nicht zu“
⟦61.4⟧ / ⟦38.6⟧` },
  frei_a1: { tryOut: true, title: 'Deine Probier-Werkstatt', code: `# Eine Idee: Was sagt eine Gerade (lineare Regression) für die vier Stufen voraus?
allbus %>%
  mutate(
    waehlen = rec(pv01, rules = "1:90=1 [würde wählen]; 91=0 [würde nicht wählen]; else=NA"),
    pflicht = rec(pe09, rules = "rev")
  ) %>%
  linear_regression(waehlen ~ pflicht, weights = wghtpew) %>%
  summary()` },
  a2: { title: 'Aufgabe 2: logistisches Modell', code: `# Variablen wie in Aufgabe 1, dazu Interesse umgepolt; dann das logistische Modell, gewichtet
modell <- allbus %>%
  mutate(
${REC3}
  ) %>%
  logistic_regression(waehlen ~ ⟦pflicht⟧, weights = wghtpew)

modell %>%
  summary()` },
  a2r: { title: 'Aufgabe 2: Exp(B) in Prozent', code: `# Exp(B) als Veränderung der Chance in Prozent, hier das Alter aus Grundlage 2
(⟦0.927⟧ - 1) * 100` },
  frei_a2: { tryOut: true, title: 'Deine Probier-Werkstatt', code: `# Eine Idee: Bleibt Exp(B) des Pflichtgefühls, wenn auch das Alter im Modell ist?
allbus %>%
  mutate(
${REC3}
  ) %>%
  logistic_regression(waehlen ~ pflicht + interesse + age, weights = wghtpew) %>%
  summary()` },
  a3h: { title: 'Aufgabe 3: von Hand', code: `# Von Hand: Logit, Chance, Wahrscheinlichkeit (Konstante und B aus Aufgabe 2, Spalte B)
logit <- -2.154 + 1.326 * ⟦1⟧ + 0.340 * ⟦1⟧

logit

chance <- exp(logit)

chance

chance / (1 + chance)` },
  a3p: { title: 'Aufgabe 3: predict() für vier Personen', code: `# Modell wie in Aufgabe 2
modell <- allbus %>%
  mutate(
${REC3}
  ) %>%
  logistic_regression(waehlen ~ pflicht + interesse, weights = wghtpew)

# Vier Beispielpersonen: A, A mit einer Stufe mehr Pflichtgefühl, B, B mit einer Stufe mehr
profile <- tibble(
  pflicht   = c(2, 3, ⟦2⟧, ⟦3⟧),
  interesse = c(2, 2, ⟦2⟧, ⟦2⟧)
)

modell %>%
  predict(newdata = profile, type = "response")` },
  a3m: { title: 'Aufgabe 3: AME', code: `# Modell wie in Aufgabe 2, dann der durchschnittliche marginale Effekt (AME)
allbus %>%
  mutate(
${REC3}
  ) %>%
  logistic_regression(waehlen ~ pflicht + interesse, weights = wghtpew) %>%
  marginal_effects() %>%
  summary()` },
  frei_a3: { tryOut: true, title: 'Deine Probier-Werkstatt', code: `# Eine Idee: Modell wie in Aufgabe 2; alle vier Stufen Pflichtgefühl bei mittlerem Interesse
modell <- allbus %>%
  mutate(
${REC3}
  ) %>%
  logistic_regression(waehlen ~ pflicht + interesse, weights = wghtpew)

stufen <- tibble(
  pflicht   = c(1, 2, 3, 4),
  interesse = c(3, 3, 3, 3)
)

modell %>%
  predict(newdata = stufen, type = "response")` },
  a4: { title: 'Aufgabe 4: Modellgüte', code: `# Modell wie in Aufgabe 2, ausführliche Ausgabe
allbus %>%
  mutate(
${REC3}
  ) %>%
  logistic_regression(waehlen ~ pflicht + interesse, weights = wghtpew) %>%
  summary()` },
  a4r: { title: 'Aufgabe 4: Regel „alle wählen“', code: `# Wie oft läge die Regel „alle Ja“ richtig? Hier das Smartphone-Beispiel aus Grundlage 4
(⟦5⟧ + ⟦4393⟧) / ⟦4813⟧ * 100` },
  a4l: { title: 'Aufgabe 4: −2LL des Nullmodells', code: `# −2LL des Nullmodells = −2LL des Modells + Chi-square; hier das Smartphone-Beispiel
⟦2370.945⟧ + ⟦453.950⟧` },
  frei_a4: { tryOut: true, title: 'Deine Probier-Werkstatt', code: `# Eine Idee: Wie gut ist ein Modell nur mit dem Interesse?
allbus %>%
  mutate(
    waehlen   = rec(pv01, rules = "1:90=1 [würde wählen]; 91=0 [würde nicht wählen]; else=NA"),
    interesse = rec(pa02a, rules = "rev")
  ) %>%
  logistic_regression(waehlen ~ interesse, weights = wghtpew)` },
};

/* ---------- Antworten prüfen ---------- */

type Extra = { short?: string; help?: string };
const choice = (id: string, label: string, options: [string, string][], target: string, right: string, hint: string, extra: Extra = {}): Question =>
  ({ id, label, kind: 'choice', options: options.map(([value, l]) => ({ value, label: l })), target, right, hint, ...extra });
const number = (id: string, label: string, target: number, tolerance: number, right: string, hint: string, extra: Extra = {}): Question =>
  ({ id, label, kind: 'number', target, tolerance, right, hint, ...extra });

/** Fragen am Ende jeder Aufgabe (Ids wie im Plan). `hint` ist die allgemeine Rückmeldung; Sonderfälle stehen in SPECIAL. */
export const QUESTIONS: Record<'a1' | 'a2' | 'a3' | 'a4', Question[]> = {
  a1: [
    choice('a1a', 'Was passiert mit Befragten, die „weiß nicht“ oder „nicht wahlberechtigt“ angegeben haben?',
      [['na', 'Sie werden NA und zählen nicht mit'], ['null', 'Sie zählen als 0, also „würde nicht wählen“'], ['eins', 'Sie zählen als 1']], 'na',
      'Genau: `else=NA` macht alles außer 1 bis 91 zu NA. In der Ausgabe stehen sie unter „System“ (gewichtet 1.269). Wer nicht wählen darf oder noch unentschieden ist, hat sich nicht gegen das Wählen entschieden.',
      'Schau auf `else=NA` in der Regel: Alles, was nicht 1 bis 90 oder 91 ist, wird fehlend. Als 0 zählt nur Code 91.',
      { short: '„weiß nicht“ und „nicht wahlberechtigt“', help: 'Aus der Regel in `rec()`.' }),
    number('a1b', 'Wie viel Prozent der Befragten mit gültiger Antwort wollen wählen?', 94.17, 0.2,
      '94,17 % (Valid %). Dasselbe steht als Mittelwert in der Kopfzeile: mean=0.94. Der Mittelwert einer ⟪0/1-Variable⟫ ist der ⟪Anteil⟫ der Einsen.',
      'Lies in der Zeile „würde wählen“ die Spalte Valid %.',
      { short: 'Anteil, der wählen will', help: 'Prozent, eine Kommazahl reicht.' }),
    number('a1c', 'Wie viel Prozent derer, die „stimme gar nicht zu“ sagen, wollen trotzdem wählen?', 61.4, 0.1,
      '61,4 %, fast zwei Drittel. Bei „stimme voll zu“ sind es 98,8 %.',
      'Lies in der Zeile STIMME GAR NICHT ZU die Zeile `row %`, Spalte „würde wählen“.',
      { short: 'Wählen bei „stimme gar nicht zu“', help: 'Aus der Kreuztabelle, Schritt 2.' }),
    number('a1d', 'Wie viele Prozentpunkte bringt die letzte Stufe, von „stimme eher zu“ zu „stimme voll zu“?', 4, 0.1,
      '4,0 Prozentpunkte (98,8 − 94,8). Die erste Stufe brachte 16,9, die zweite 16,5.',
      'Tausch in der Vorlage aus Schritt 3 die Zahlen: 98.8 und 94.8.',
      { short: 'letzte Stufe', help: 'Prozentpunkte, eine Kommazahl reicht.' }),
    choice('a1e', 'Warum bringt die letzte Stufe so wenig?',
      [['decke', 'Oben ist kaum noch Platz: Bei 94,8 % fehlen bis 100 % nur 5,2 Prozentpunkte.'], ['schwach', 'Bei „stimme voll zu“ wirkt das Pflichtgefühl schwächer.'], ['gewicht', 'Das liegt an der Gewichtung.']], 'decke',
      'Genau. Brächte jede Stufe so viel wie die erste, läge „stimme voll zu“ bei 61,4 + 3 × 16,9 = 112,1 %. Mehr als alle geht nicht. Deshalb flacht der Anstieg oben ab, ein ⟪Deckeneffekt⟫: Die Anteile folgen einer S-Kurve, keiner Geraden (Grundlage 1b).',
      'Schau, wie weit 94,8 % von 100 % entfernt sind. Wie viel kann eine Stufe da noch bringen? Grundlage 1b.',
      { short: 'warum so wenig' }),
    number('a1f', 'Wie groß ist die Chance zu wählen bei „stimme voll zu“?', 82.33, 1.6,
      'Etwa 82 („82 zu 1“): 98,8 / 1,2 = 82,33. Bei „stimme gar nicht zu“ war sie 1,59.',
      'Tausch in der Vorlage aus Schritt 4 die Zahlen: 98.8 und 1.2.',
      { short: 'Chance bei „stimme voll zu“', help: 'Eine Zahl, eine Kommazahl reicht.' }),
    choice('a1g', 'Was heißt diese Chance?',
      [['zuEins', 'Auf eine Person, die nicht wählen will, kommen etwa 82, die wählen wollen.'], ['prozent', '82 % wollen wählen.'], ['mal', 'Wählen ist 82-mal so wahrscheinlich wie bei „stimme gar nicht zu“.']], 'zuEins',
      'Genau: Die ⟪Odds⟫ (Chance) sind ein Verhältnis Ja zu Nein (Grundlage 1c).',
      'Eine Chance ist keine Prozentzahl und kein Vergleich zweier Gruppen, sondern „Ja zu Nein“ in einer Gruppe: 98,8 zu 1,2.',
      { short: 'was die Chance heißt' }),
  ],
  a2: [
    choice('a2a', 'Wofür sagt das Modell die Wahrscheinlichkeit vorher?',
      [['waehlen', 'für „würde wählen“'], ['nicht', 'für „würde nicht wählen“'], ['beide', 'für beides zugleich']], 'waehlen',
      'Genau: Internal Value 1 ist „würde wählen“. Alle Zahlen sprechen also über die Absicht zu wählen.',
      'Schau in „Dependent Variable Encoding“: Welche Antwort hat den Internal Value 1?',
      { short: 'die 1 im Modell', help: 'Ganz oben in `summary()`.' }),
    number('a2b', 'Wie groß ist Exp(B) für das Pflichtgefühl, wenn das Interesse im Modell ist?', 3.765, 0.01,
      '3,765, gerundet 3,77. Ohne Interesse waren es 3,888: Ein kleiner Teil des ⟪Zusammenhangs⟫ geht auf das Interesse zurück.',
      'Lies Exp(B) in der Zeile `pflicht`, nachdem du `pflicht + interesse` eingesetzt hast.',
      { short: 'Exp(B) Pflichtgefühl', help: 'Aus `summary()`, Spalte Exp(B).' }),
    choice('a2c', 'Welcher Satz beschreibt das Pflichtgefühl richtig?',
      [['chance', 'Bei gleichem Interesse wird die Chance zu wählen mit jeder Stufe mehr Pflichtgefühl etwa 3,8-mal so groß.'],
        ['wahrsch', 'Mit jeder Stufe mehr Pflichtgefühl gehen Menschen 3,8-mal so wahrscheinlich wählen.'],
        ['pp', 'Mit jeder Stufe mehr Pflichtgefühl steigt die Wahrscheinlichkeit um 3,77 Prozentpunkte.']], 'chance',
      'Genau: Exp(B) heißt auch ⟪Odds Ratio⟫ (Chancenverhältnis). Es ist ein Faktor für die Chance, und er gilt bei gleichem Interesse.',
      'Exp(B) vervielfacht die Chance, nicht die Wahrscheinlichkeit, und ist keine Differenz in Prozentpunkten. Grundlage 2b.',
      { short: 'Satz zum Pflichtgefühl' }),
    number('a2d', 'Um wie viel Prozent steigt die Chance zu wählen je Stufe mehr Interesse?', 40.5, 0.6,
      'Um 40,5 %: (1,405 − 1) × 100. Exp(B) des Interesses ist 1,405, deutlich kleiner als beim Pflichtgefühl, aber ebenfalls ⟪signifikant⟫ (Sig. <.001).',
      'Tausch in der Vorlage aus Schritt 3 die 0.927 gegen Exp(B) von `interesse`.',
      { short: 'Interesse in Prozent', help: 'Prozent, eine Kommazahl reicht.' }),
    choice('a2e', 'Im Modell stecken N = 2.758 (gewichtet), befragt wurden 5.246. Warum so wenige?',
      [['split', 'Die Pflichtfrage bekam nur ein Teil der Befragten (Split-Teil), und wer bei einer der drei Variablen fehlt, fällt heraus.'], ['gewicht', 'Die Gewichtung hat Befragte gelöscht.'], ['fehler', 'R hat nur einen Teil eingelesen.']], 'split',
      'Genau: `pe09` haben nur 3.602 Befragte gültig beantwortet (1.596 TNZ: SPLIT). Dazu fallen alle ohne Wahlabsicht heraus (weiß nicht, nicht wahlberechtigt …). Gezählt sind es 2.778 Personen, gewichtet 2.758.',
      'Ein Modell nutzt nur Fälle, die bei allen Variablen eine gültige Antwort haben. Welche der drei Fragen wurde nicht allen gestellt?',
      { short: 'warum so wenige' }),
  ],
  a3: [
    number('a3a', 'Wie groß ist die Chance zu wählen bei Person A?', 3.248, 0.01,
      '3,248, also gut „3 zu 1“: exp(1,178).',
      'Setz in Schritt 1 an beiden markierten Stellen 2 ein; die Chance ist die zweite Zahl der Ausgabe.',
      { short: 'Chance von Person A', help: 'Zweite Zahl der Ausgabe von Schritt 1.' }),
    number('a3b', 'Mit welcher Wahrscheinlichkeit will Person A wählen, in Prozent?', 76.45, 0.11,
      '76,5 %: Von 100 Menschen wie A wollen etwa 76 wählen. `predict()` gibt mit ungerundeten Zahlen 76,4 %.',
      'Dritte Zahl der Ausgabe von Schritt 1, mal 100.',
      { short: 'Wahrscheinlichkeit von Person A', help: 'In Prozent, eine Kommazahl reicht. R zeigt einen Anteil: 0.55 heißt 55 %.' }),
    number('a3c', 'Um wie viele Prozentpunkte steigt die Wahrscheinlichkeit bei Person A mit einer Stufe mehr Pflichtgefühl?', 16, 0.15,
      '+16,0 Prozentpunkte: von 76,4 % auf 92,4 %.',
      'Person 2 minus Person 1 aus Schritt 2, mal 100: 0.9243 − 0.7644.',
      { short: 'Person A, eine Stufe mehr', help: 'Prozentpunkte, eine Kommazahl reicht.' }),
    number('a3d', 'Um wie viele Prozentpunkte steigt sie bei Person B?', 2.9, 0.15,
      '+2,9 Prozentpunkte: von 96,0 % auf 98,9 %. B startet schon fast oben.',
      'Person 4 minus Person 3 aus Schritt 2, mal 100.',
      { short: 'Person B, eine Stufe mehr', help: 'Prozentpunkte, eine Kommazahl reicht.' }),
    choice('a3e', 'Was ist bei A und B gleich?',
      [['chance', 'Die Chance wird mit 3,77 malgenommen.'], ['pp', 'Die Wahrscheinlichkeit steigt um gleich viele Prozentpunkte.'], ['nichts', 'Nichts, die Personen sind zu verschieden.']], 'chance',
      'Genau: A von 3,25 auf 12,2, B von 24,1 auf 90,8, beide × 3,77. Auch der Logit steigt bei beiden um 1,33. Nur in Prozentpunkten unterscheiden sie sich (16,0 gegen 2,9), weil B schon oben auf der S-Kurve steht (Grundlage 3b). Dort ist kaum noch Platz nach oben: ein ⟪Deckeneffekt⟫.',
      'Vergleich deine beiden Antworten zu Prozentpunkten: gleich? Rechne die Chancen nach: Wahrscheinlichkeit / (1 − Wahrscheinlichkeit). Grundlage 3b.',
      { short: 'was gleich ist' }),
    number('a3f', 'Wie groß ist der AME des Pflichtgefühls, in Prozentpunkten je Stufe, im Mittel über alle Befragten im Modell?', 5.4, 0.1,
      '5,4 Prozentpunkte (AME 0.054). Ein Mittel aus vielen Menschen wie B, bei denen wenig passiert, und wenigen wie A. Es gilt für die 2.758 (gewichtet) im Modell, also der Split-Teil mit gültigen Antworten. Der AME ist die mittlere Steigung der S-Kurve; eine ganze Stufe bringt meist etwas weniger (Grundlage 3c).',
      'Lies die Zeile `pflicht`, Spalte AME, mal 100.',
      { short: 'AME des Pflichtgefühls', help: 'Prozentpunkte, eine Kommazahl reicht.' }),
    choice('a3g', 'Welcher Satz gehört in einen Bericht für Leserinnen ohne Statistik?',
      [['gut', 'Je Stufe mehr Pflichtgefühl steigt die Wahrscheinlichkeit, wählen zu wollen, im Mittel um etwa 5 Prozentpunkte (mittlerer marginaler Effekt; eine ganze Stufe bringt meist etwas weniger) – bei Menschen, die ohnehin fast sicher wählen, weniger, bei Zögernden mehr.'],
        ['mal', 'Wer eine Stufe mehr Pflichtgefühl hat, geht 3,77-mal so wahrscheinlich wählen.'],
        ['alle', 'Eine Stufe mehr Pflichtgefühl erhöht bei allen die Wahlbeteiligung um 5,4 %.']], 'gut',
      'Genau: Prozentpunkte, „im Mittel“ wie beim ⟪AME⟫ und der Hinweis auf den Ausgangspunkt. Und „wollen“: Es geht um die Absicht, und das Modell vergleicht Menschen; ob eine Kampagne für mehr Pflichtgefühl wirkt, zeigt es nicht.',
      'Ein guter Satz nennt Prozentpunkte, sagt „im Mittel“ und spricht von der Absicht, nicht von der Beteiligung.',
      { short: 'Satz für den Bericht' }),
  ],
  a4: [
    number('a4a', 'Bei wie viel Prozent der Befragten im Modell liegt es richtig?', 95.1, 0.05,
      '95,1 % (Overall Percentage).',
      'Classification Table, Zeile Overall Percentage.',
      { short: 'Trefferquote', help: 'Prozent, aus `summary()`.' }),
    number('a4b', 'Bei wie viel Prozent derselben Befragten läge die Regel „alle wählen“ richtig?', 94.82, 0.05,
      '94,82 %: (12 + 2603) / 2758 × 100. Das Modell trifft nur 0,3 Prozentpunkte öfter. 94,82 % ist der Anteil derer, die wählen wollen, unter den 2.758 im Modell (dem Split-Teil mit gültigen Antworten bei allen drei Fragen), etwas mehr als die 94,17 % aus Aufgabe 1. Diesen Anteil der häufigeren Antwort nennt man ⟪Basisrate⟫.',
      'Tausch in der Vorlage aus Schritt 2: 12 und 2603 oben, 2758 unten (18 + 125 + 12 + 2603).',
      { short: 'Regel „alle wählen“', help: 'Prozent, zwei Kommastellen reichen.' }),
    number('a4c', 'Wie viel Prozent der Befragten, die nicht wählen wollen, erkennt das Modell?', 12.8, 0.25,
      '12,8 %: 18 von 143 (R rechnet mit ungerundeten Zellen, von Hand mit den gedruckten Zahlen kommen 12,6 heraus). Fast alle, die nicht wählen wollen, sagt das Modell als Wählende vorher. Dieser Anteil heißt ⟪Spezifität⟫: wie viele Nullen das Modell als 0 erkennt. Für die Einsen, die ⟪Sensitivität⟫, sind es 99,5 %.',
      'Classification Table, Zeile „würde nicht wählen“, Spalte % Correct.',
      { short: 'erkannt, wer nicht wählen will', help: 'Prozent, aus `summary()`.' }),
    number('a4d', 'Wie groß ist −2LL im Nullmodell (nur mit der Konstante)?', 1122.279, 0.05,
      '1.122,279 = 856,448 + 265,831, das −2LL des ⟪Nullmodells⟫. Das Modell senkt −2LL um 23,7 %; genau das ist McFadden R² (0,237).',
      'Tausch in der Vorlage aus Schritt 3: −2 Log Likelihood (856.448) und Chi-square (265.831).',
      { short: '−2LL im Nullmodell', help: 'Eine Zahl, die Kommastellen von R reichen.' }),
    choice('a4e', 'Welcher Satz zu Nagelkerke R² = 0,275 stimmt?',
      [['gut', 'Das Modell passt deutlich besser als eines ohne Prädiktoren; einen Anteil erklärter Varianz darf man daraus nicht lesen.'], ['prozent', 'Pflichtgefühl und Interesse erklären 27,5 % der Wahlabsicht.'], ['schlecht', 'Unter 0,5 ist ein Modell wertlos.']], 'gut',
      'Genau. Nach der groben Faustregel ist 0,275 brauchbar; als Prozent erklärter Varianz liest man ⟪Pseudo-R²⟫ nicht (Grundlage 4c).',
      'Pseudo-R² ist kein Anteil erklärter Varianz und hat keine harte Grenze. Grundlage 4c.',
      { short: 'Nagelkerke R²' }),
    choice('a4f', 'Was gehört in deinen Bericht?',
      [['beides', 'Das Modell trifft 95,1 %, aber die Regel „alle wählen“ schon 94,8 %; von denen, die nicht wählen wollen, erkennt es nur 12,8 %. −2LL sinkt deutlich (Omnibus-Test signifikant, Nagelkerke 0,275).'], ['nur', 'Das Modell ist mit 95 % Trefferquote sehr gut.']], 'beides',
      'Genau: die ⟪Trefferquote⟫ immer mit der Basisrate vergleichen, der einfachsten Regel, und die seltene Gruppe nennen. Der Zusammenhang ist trotzdem deutlich.',
      'Die Trefferquote allein täuscht bei seltenen Antworten: Nur gut 5 % wollen nicht wählen. Grundlage 4a.',
      { short: 'Bericht' }),
  ],
};

/** Pflichtaufgaben: Aufgabe 1 bis 3 (Aufgabe 4 ist Zusatz). */
export const REQUIRED: Question[] = [...QUESTIONS.a1, ...QUESTIONS.a2, ...QUESTIONS.a3];

/* ---------- Kurz überlegen in den Grundlagen ---------- */

/** Grundlage 1b: Auswahl, Festlegen, danach Auflösen (gleiche Auflösung für jede Wahl). */
export const K1B = {
  id: 'k1b-frage',
  label: 'Eine lineare Regression aus Sitzung 9 legt eine Gerade durch diese Anteile. Was sagt sie wohl für 18-Jährige voraus?',
  options: ['etwa 95 %', 'genau 100 %', 'mehr als 100 %'],
  resolution: 'Die Gerade sagt für 18-Jährige 106,6 % voraus, für alle unter 32 Jahren mehr als 100 %. Mehr als alle geht nicht.',
};
/** Grundlage 1c: Zahl, Prüfen. */
export const K1C_Q: Question = number('k1c-frage', 'Eine Gruppe hat die Chance 4. Wie viel Prozent der Gruppe sagen Ja?', 80, 0.5,
  'Genau: Chance 4 heißt „4 zu 1“, also 4 von 5 Personen: 80 %. Rechnung: 4 / (1 + 4) = 0,8.',
  'Chance 4 heißt: auf eine Person mit Nein kommen vier mit Ja. Wie viele von fünf sagen Ja? Rechne Chance / (1 + Chance).',
  { short: 'Chance 4 in Prozent', help: 'In Prozent, eine ganze Zahl reicht.' });
/** Grundlage 2b: Auswahl, Prüfen. */
export const K2B_Q: Question = choice('k2b-frage', 'Bei einem anderen Modell steht Exp(B) = 2. Was heißt das?',
  [['chance', 'Die Chance verdoppelt sich je Einheit'], ['wahrsch', 'Die Wahrscheinlichkeit verdoppelt sich je Einheit'], ['pp', 'Die Wahrscheinlichkeit steigt um 2 Prozentpunkte']], 'chance',
  'Genau. Exp(B) vervielfacht die Chance. Bei 50 % (Chance 1) wird daraus Chance 2, also 67 %, nicht 100 %.',
  'Exp(B) ist ein Faktor für die Chance (Ja zu Nein). Eine Wahrscheinlichkeit von 60 % kann sich nicht verdoppeln, das wären 120 %.',
  { short: 'Exp(B) = 2' });
/** Grundlage 3b: Auswahl, Festlegen, dann Auflösen im Bild B9. */
export const K3B = {
  id: 'k3b-frage',
  label: 'Bei wem sinkt die Wahrscheinlichkeit um mehr Prozentpunkte?',
  options: ['von 30 auf 40', 'von 70 auf 80', 'bei beiden gleich'],
  resolution: 'Der Logit sinkt bei beiden um 0,76, die Chance wird bei beiden mit 0,47 malgenommen. In Prozentpunkten verliert die 70-Jährige zwölfmal so viel: −14,4 statt −1,2. Oben auf der S-Kurve ist sie flach, in der Mitte steil.',
};
/** Grundlage 4a: Auswahl mit Auflösung. */
export const K4A = {
  id: 'k4a-frage',
  label: 'Wie viele der 415 Internetnutzenden (gewichtet), die das Smartphone nicht nennen, erkennt das Modell?',
  options: ['fast alle', 'etwa die Hälfte', 'fast keine'],
  resolution: 'Fast keine: 4 von 415 (0,9 %). Für fast alle Internetnutzenden liegt die vorhergesagte Wahrscheinlichkeit über 50 %, also sagt das Modell „Ja“. Nur bei den Ältesten fällt sie unter 50 % (ab etwa 90 Jahren).',
};

/* ---------- Sonderfälle der Rückmeldung ---------- */

/** Eine falsche Antwort, die einen eigenen Hinweis bekommt: eine Zahl (± tol) oder eine Option. */
export type Special = { at: number | string; tol?: number; text: string };
/** Sonderfälle je Frage-Id (aus den Spalten „Text falsch / Hinweis“ des Plans). */
export const SPECIAL: Record<string, Special[]> = {
  a1b: [
    { at: 0.94, tol: 0.01, text: 'Das ist der Mittelwert als Anteil; gefragt ist Prozent, also 94.' },
    { at: 71.38, tol: 0.1, text: 'Das sind Raw %, von allen Befragten.' },
  ],
  a1c: [{ at: 38.6, tol: 0.05, text: 'Das sind die, die nicht wählen wollen.' }],
  a1d: [
    { at: 16.9, tol: 0.05, text: 'Das ist die erste Stufe aus der Vorlage.' },
    { at: -4, tol: 0.05, text: 'Die größere Zahl zuerst.' },
  ],
  a1f: [
    { at: 1.59, tol: 0.01, text: 'Das ist die Vorlage für „stimme gar nicht zu“.' },
    { at: 0.012, tol: 0.001, text: 'Du hast „nicht wählen“ durch „wählen“ geteilt.' },
    { at: 98.8, tol: 0.05, text: 'Das ist der Anteil, nicht die Chance.' },
  ],
  a2b: [
    { at: 3.888, tol: 0.01, text: 'Das ist das Modell nur mit dem Pflichtgefühl; setz `pflicht + interesse` ein.' },
    { at: 1.326, tol: 0.005, text: 'Das ist B, nicht Exp(B).' },
    { at: 1.358, tol: 0.005, text: 'Das ist B, nicht Exp(B).' },
    { at: 0.27, tol: 0.01, text: 'Kehrwert; ist die 1 richtig kodiert und ist umgepolt?' },
  ],
  a2c: [
    { at: 'wahrsch', text: 'Mach die Probe an der ersten Stufe aus Aufgabe 1: 61,4 % × 3,8 wären 233 %. Exp(B) vervielfacht die Chance, nicht die Wahrscheinlichkeit. Grundlage 2b.' },
    { at: 'pp', text: 'Exp(B) ist ein Faktor, keine Differenz in Prozentpunkten. Grundlage 2b.' },
  ],
  a2d: [
    { at: -7.3, tol: 0.1, text: 'Das ist das Beispiel aus der Vorlage.' },
    { at: 1.405, tol: 0.005, text: 'Das ist der Faktor; gefragt ist die Veränderung in Prozent.' },
    { at: 276.5, tol: 1, text: 'Das ist das Pflichtgefühl.' },
  ],
  a3a: [
    { at: 0.614, tol: 0.01, text: 'Das ist die Vorlage mit 1 und 1.' },
    { at: 1.178, tol: 0.005, text: 'Das ist der Logit.' },
    { at: 0.765, tol: 0.005, text: 'Das ist die Wahrscheinlichkeit.' },
    { at: 76.5, tol: 0.1, text: 'Das ist die Wahrscheinlichkeit.' },
  ],
  a3b: [
    { at: 0.76, tol: 0.01, text: 'Das ist der Anteil; gefragt ist Prozent.' },
    { at: 38, tol: 0.1, text: 'Das ist die Vorlage mit 1 und 1.' },
  ],
  a3c: [{ at: 0.16, tol: 0.005, text: 'Mal 100 rechnen.' }],
  a3d: [
    { at: 16, tol: 0.15, text: 'Du hast die markierten Stellen noch nicht auf Person B gesetzt (3, 4 und 4, 4).' },
    { at: 0.029, tol: 0.002, text: 'Mal 100 rechnen.' },
  ],
  a3f: [
    { at: 0.054, tol: 0.001, text: 'R zeigt einen Anteil; das sind 5,4 Prozentpunkte.' },
    { at: 1.4, tol: 0.05, text: 'Das ist das Interesse.' },
  ],
  a3g: [
    { at: 'mal', text: 'Probe an Person A: 76,4 % × 3,77 wären 288 %.' },
    { at: 'alle', text: 'Der AME ist ein Mittelwert in Prozentpunkten, nicht „bei allen“ und nicht Prozent; außerdem misst die Frage die Absicht, nicht die Beteiligung.' },
  ],
  a4a: [{ at: 99.5, tol: 0.05, text: 'Das gilt nur für die, die wählen wollen.' }],
  a4b: [
    { at: 91.38, tol: 0.05, text: 'Das ist das Smartphone-Beispiel.' },
    { at: 94.17, tol: 0.05, text: 'Das ist der Anteil aus Aufgabe 1, über alle mit gültiger Wahlabsicht; die Regel muss man an denselben Befragten messen wie das Modell, also an der Classification Table.' },
    { at: 5.18, tol: 0.05, text: 'Das ist die Regel „alle nicht“.' },
  ],
  a4d: [
    { at: 2824.895, tol: 0.05, text: 'Das ist das Smartphone-Beispiel.' },
    { at: 856.448, tol: 0.05, text: 'Das ist −2LL des Modells selbst.' },
  ],
  'k1c-frage': [{ at: 400, tol: 0.5, text: 'Eine Chance ist kein Vielfaches einer Wahrscheinlichkeit. Mehr als 100 % gibt es nicht.' }],
};

/** The special case an answer hits, if it is wrong and matches one. */
export function specialFor(q: Question, answer: string | undefined): Special | undefined {
  if (judge(q, answer) !== 'wrong') return undefined;
  const list = SPECIAL[q.id] ?? [];
  if (q.kind === 'choice') return list.find(s => s.at === (answer ?? '').trim());
  const readings = answerNumbers(answer ?? '');
  return list.find(s => typeof s.at === 'number' && readings.some(x => Math.abs(x - (s.at as number)) <= (s.tol ?? 0) + 1e-9));
}

/** The question with the hint for this answer: a special case first, then the general hint. */
export function withSpecialHint(q: Question, answer: string | undefined): Question {
  const s = specialFor(q, answer);
  if (!s) return q;
  // Bei Auswahlfragen ersetzt der Sonderfall den allgemeinen Hinweis, bei Zahlen steht er davor.
  return { ...q, hint: q.kind === 'choice' ? s.text : `${s.text} ${q.hint}` };
}

/* ---------- Erst festlegen ---------- */

export const PREDICTIONS: Record<'a1' | 'a2' | 'a3' | 'a4', { id: string; prompt: string; options: string[]; resolution: string }> = {
  a1: { id: 'a1', prompt: 'Wie viel Prozent derer, die Wählen gar nicht für eine Bürgerpflicht halten, wollen trotzdem wählen?', options: ['unter 40 %', '40 bis 55 %', 'über 55 %'],
    resolution: 'Tatsächlich wollen 61,4 % derer, die Wählen gar nicht für eine Bürgerpflicht halten, trotzdem wählen.' },
  a2: { id: 'a2', prompt: 'Eine Stufe mehr Pflichtgefühl, bei gleichem Interesse: Mit welchem Faktor ändert sich wohl die Chance zu wählen?', options: ['etwa × 1,2', 'etwa × 4', 'etwa × 20'],
    resolution: 'Tatsächlich wird die Chance je Stufe mit 3,77 malgenommen, also knapp vervierfacht.' },
  a3: { id: 'a3', prompt: 'Beide bekommen eine Stufe mehr Pflichtgefühl. Bei wem steigt die Wahrscheinlichkeit zu wählen um mehr Prozentpunkte?', options: ['bei Person A', 'bei Person B', 'bei beiden gleich'],
    resolution: 'Tatsächlich bringt die Stufe bei Person A 16,0, bei Person B 2,9 Prozentpunkte; in Chancen bei beiden × 3,77.' },
  a4: { id: 'a4', prompt: 'Stell dir vor, ein Modell sagt für 95 von 100 Befragten richtig vorher, ob sie wählen wollen. Wie gut ist das?', options: ['sehr gut, fast immer richtig', 'kommt darauf an, wie oft man mit Raten richtig läge', 'schlecht'],
    resolution: 'Tatsächlich liegt das Modell aus Aufgabe 2 bei 95,1 % richtig, aber schon die Regel „alle wählen“ träfe 94,8 %.' },
};

/* ---------- Hilfe in drei Stufen ---------- */

export const HINTS: Record<'a1' | 'a2' | 'a3' | 'a4', [string, string, string]> = {
  a1: [
    'Die Kreuztabelle zeigt je Stufe, wie viel Prozent wählen wollen. Schau, wie groß die Schritte von Stufe zu Stufe sind und wie viel Platz bis 100 % bleibt. Eine Chance teilt „wählen“ durch „nicht wählen“.',
    'Valid % und mean= in der Ausgabe von Schritt 1. Die Prozente je Stufe in Schritt 2, Zeilen `row %`, Spalte „würde wählen“; daneben „würde nicht wählen“. In Schritt 3 und 4 tauschst du die markierten Zahlen gegen diese Prozente.',
    '„Weiß nicht“ und „nicht wahlberechtigt“ werden NA. 94,17 % wollen wählen (mean=0.94). Je Stufe Pflichtgefühl: 61,4 %, 78,3 %, 94,8 %, 98,8 %. Die letzte Stufe bringt `98.8 - 94.8`, also 4 Prozentpunkte, weil oben kaum Platz ist. Chance bei „stimme voll zu“: `98.8 / 1.2` ergibt 82.33333, also „82 zu 1“.',
  ],
  a2: [
    'Das Modell spricht über die 1. Exp(B) ist ein Faktor für die Chance „wählen zu nicht wählen“. Bei zwei Prädiktoren gilt jeder Faktor bei gleichem Wert des anderen.',
    'Nach dem Einsetzen von `pflicht + interesse`: „Dependent Variable Encoding“ für die 1, „Variables in the Equation“ Spalte Exp(B) für die Faktoren, `N:` oben in der Ausgabe. Für Prozent rechnest du (Exp(B) − 1) × 100.',
    'Die 1 ist „würde wählen“. Mit `waehlen ~ pflicht + interesse`: pflicht B 1,326, Exp(B) 3,765 (Konfidenzintervall 3,154 bis 4,495); interesse B 0,340, Exp(B) 1,405, also `(1.405 - 1) * 100` = 40,5 % mehr Chance je Stufe. Satz: „Bei gleichem Interesse wird die Chance zu wählen mit jeder Stufe mehr Pflichtgefühl etwa 3,8-mal so groß.“ N = 2.758 (gewichtet), weil `pe09` nur einem Teil der Befragten (dem Split-Teil, gut zwei Drittel) gestellt wurde und Fälle mit fehlenden Werten herausfallen.',
  ],
  a3: [
    'Das Modell rechnet in Logits. Von dort geht es mit `exp()` zur Chance und mit Chance / (1 + Chance) zur Wahrscheinlichkeit. In Chancen wirkt eine Stufe überall gleich, in Prozentpunkten nicht.',
    'Schritt 1: drei Zahlen, Logit, Chance, Wahrscheinlichkeit (als Anteil). Schritt 2: vier Anteile für A, A+1, B, B+1; Prozentpunkte sind Differenzen mal 100. Schritt 3: Spalte AME, Zeile `pflicht`.',
    'Person A von Hand: Logit 1,178, Chance 3,248, Wahrscheinlichkeit 0,765, also 76,5 %. Mit `predict()` (in `profile` stehen `pflicht = c(2, 3, 3, 4)` und `interesse = c(2, 2, 4, 4)`): 0.7644409, 0.9243475, 0.9601851, 0.9891065. A gewinnt 16,0 Prozentpunkte, B 2,9. Gleich ist die ⟪Odds Ratio⟫, der Faktor für die Chance: × 3,77. AME 0.054, also im Mittel 5,4 Prozentpunkte (mittlere Steigung je Stufe; eine ganze Stufe bringt etwas weniger).',
  ],
  a4: [
    'Wenn fast alle wählen wollen, liegt man mit „alle wählen“ fast immer richtig. Vergleich das Modell mit dieser Regel. −2LL vergleicht man mit dem Nullmodell.',
    'Classification Table: Overall Percentage, die Zeile „würde nicht wählen“ und die vier Zellen. Model Summary: −2 Log Likelihood und Nagelkerke R Square. Omnibus Tests: Chi-square.',
    'Trefferquote 95,1 %, Regel „alle wählen“ `(12 + 2603) / 2758 * 100` = 94,82 %. Von 143 (gewichtet), die nicht wählen wollen, erkennt das Modell 18 (12,8 %). −2LL Nullmodell `856.448 + 265.831` = 1.122,279; das Modell senkt es um 265,831 (Omnibus-Test Sig. <.001), McFadden 0,237, Nagelkerke 0,275. Das Modell erklärt die Wahlabsicht deutlich, kann aber kaum vorhersagen, wer nicht wählen will.',
  ],
};

/* ---------- Beispieldaten der Grundlagen (keine ALLBUS-Daten) ---------- */

/** B1: Turm lm30 von zehn Befragten, von oben, zum Beispiel. */
export const TOWER = [1, 1, 0, 1, 1, 1, 0, 1, 1, 0];
/** B4: konstruierte Stufen (zum Beispiel) und gedachte gleich große Schritte. */
export const CEILING = { real: [50, 70, 88, 97], equal: [50, 70, 90, 110] };

/* ---------- Hilfe bei R-Fehlermeldungen ---------- */

/** Text mit Code-Stücken und Links, ohne JSX. */
export type Rich = (string | { code: string } | { href: string; text: string })[];
export const ERROR_HELP_TITLE = 'Hilfe: R meldet einen Fehler';
export const ERROR_HELP_CAPTION = 'Was R sagt und was du tust';
export const ERROR_HELP: { says: Rich; helps: Rich }[] = [
  { says: [{ code: 'konnte Funktion "logistic_regression" nicht finden' }, ' oder ', { code: 'konnte Funktion "%>%" nicht finden' }], helps: ['Den ', { href: '#r1', text: 'Startblock in „R lesen“' }, ' ausführen.'] },
  { says: [{ code: 'Variables not found in data: `waehlen` and `pflicht`.' }], helps: ['Die Variablen gibt es nur, wenn ', { code: 'mutate()' }, ' mit ', { code: 'rec()' }, ' in derselben Kette steht. Nimm die ganze Vorlage, auch den Teil „wie in Aufgabe 1“.'] },
  { says: [{ code: 'Dependent variable `pv01` must be binary: it has 8 distinct values.' }], helps: ['Links von ', { code: '~' }, ' steht eine Variable mit mehr als zwei Werten. Nimm die 0/1-Variable ', { code: 'waehlen' }, '.'] },
  { says: [{ code: 'Tibble columns must have compatible sizes.' }], helps: ['In ', { code: 'tibble()' }, ' hat ein ', { code: 'c()' }, ' mehr oder weniger Zahlen als das andere. Jede Spalte braucht vier Werte, einen je Person.'] },
  { says: [{ code: "Objekt 'age' nicht gefunden" }, ' (bei ', { code: 'predict()' }, ')'], helps: ['Die Spalten in ', { code: 'tibble()' }, ' müssen genau so heißen wie die Prädiktoren im Modell.'] },
  { says: [{ code: 'konnte Funktion "marginal_effect" nicht finden' }], helps: ['Schreibweise: ', { code: 'marginal_effects()' }, ' mit s am Ende.'] },
  { says: [{ code: 'konnte Funktion "Exp" nicht finden' }], helps: ['R unterscheidet Groß- und Kleinschreibung: ', { code: 'exp()' }, ' klein.'] },
  { says: [{ code: "Unerwartete(s) ','" }], helps: ['Kommazahlen in R mit Punkt: ', { code: '98.8 / 1.2' }, ', nicht ', { code: '98,8 / 1,2' }, '.'] },
  { says: [{ code: 'predict()' }, ' gibt Zahlen über 1, etwa ', { code: '4.499' }], helps: [{ code: 'type = "response"' }, ' fehlt; das sind Logits, keine Wahrscheinlichkeiten.'] },
  { says: ['Exp(B) deutlich unter 1, etwa 0,27'], helps: ['Richtung prüfen: Ist „würde wählen“ die 1, und sind ', { code: 'pe09' }, ' und ', { code: 'pa02a' }, ' mit ', { code: 'rules = "rev"' }, ' umgepolt? 0,27 ist der Kehrwert von 3,77.'] },
  { says: ['In RStudio erscheint ', { code: '+' }, ' und nichts passiert (in der Werkstatt: ', { code: 'unerwartetes Ende der Eingabe' }, ')'], helps: ['Eine Klammer ist nicht geschlossen. In RStudio mit Esc abbrechen, dann die Klammern zählen.'] },
];

/* ---------- Prüf dich selbst ---------- */

export const SELF_TEST: { question: string; options: string[]; answer: number; why: string }[] = [
  { question: 'Eine Gruppe hat die Wahrscheinlichkeit 75 %. Wie groß ist ihre Chance?', options: ['0,75', '3', '75'], answer: 1, why: 'Chance = 75 / 25 = 3, also „3 zu 1“ (Grundlage 1c).' },
  { question: 'In einem Modell steht für einen Prädiktor B = −0,5. Was gilt für Exp(B)?', options: ['größer als 1', 'genau 1', 'kleiner als 1'], answer: 2, why: 'Negatives B heißt: Der Logit sinkt, die Chance wird kleiner. Exp(−0,5) ist etwa 0,61 (Grundlage 2b).' },
  { question: 'Exp(B) = 2 für ein Merkmal. Eine Person hat die Wahrscheinlichkeit 60 %. Was gilt mit einer Einheit mehr?', options: ['120 %', 'Die Chance steigt von 1,5 auf 3, die Wahrscheinlichkeit auf 75 %', '62 %'], answer: 1, why: 'Exp(B) vervielfacht die Chance: 60 / 40 = 1,5, mal 2 ist 3, und 3 / (1 + 3) = 0,75 (Grundlagen 2b und 3a).' },
  { question: 'Dasselbe Exp(B) bringt Person X +15 Prozentpunkte und Person Y +2. Was ist wahrscheinlich?', options: ['X startet in der Mitte der S-Kurve, Y nahe 100 %', 'Das Modell ist falsch', 'Bei Y wirkt das Merkmal schwächer'], answer: 0, why: 'In Chancen wirkt es bei beiden gleich; in Prozentpunkten ist die S-Kurve in der Mitte steil und an den Rändern flach (Grundlage 3b).' },
  { question: 'Nur 3 % einer Stichprobe sagen Ja. Ein Modell trifft 97 % richtig. Was folgt daraus?', options: ['Das Modell ist sehr gut', 'Noch nichts: Die Regel „alle Nein“ trifft auch 97 %', 'Das Modell ist schlecht'], answer: 1, why: 'Bei seltenen Antworten erreicht schon die einfachste Regel eine hohe Trefferquote: Sie trifft so oft, wie die Basisrate angibt. Erst der Vergleich und −2LL zeigen, was das Modell leistet (Grundlage 4a).' },
];

/* ---------- Skript zum Mitnehmen ---------- */

export const SCRIPT_FILE = 'sitzung11.R';
export const SCRIPT_PARTS = ['start', 'r_modell', 'r_exp', 'r_predict', 'r_ame', 'a1f', 'a1k', 'a1r', 'a1c', 'a2', 'a2r', 'a3h', 'a3p', 'a3m', 'a4', 'a4r', 'a4l'];
/** Skript sitzung11.R: alle Vorlagen ohne Probier-Werkstätten, Marken stehen mit ihrem Beispielwert. */
export const SCRIPT = '# Sitzung 11: Logistische Regression\n# Statistikatlas, Methoden Ib, ALLBUS 2023 (ZA8831 v1.3.0), gewichtet mit wghtpew\n# Markierte Stellen aus dem Atlas stehen hier mit ihrem Beispielwert.\n\n'
  + SCRIPT_PARTS.map(k => `# ---- ${TEMPLATES[k].title} ----\n${parseMarks(TEMPLATES[k].code).code}\n`).join('\n');
