// Sitzung 8 „Index und Skala“: Zahlen, Vorlagen und Fragen aus docs/entwicklung/spezifikationen/2026-11-23-lernpfad-kapitel/sitzung08.md, nur Daten.
// Alle Zahlen: ALLBUS 2023, ZA8831 v1.3.0, nur Aggregate. Cronbachs α, Trennschärfen und Personenzahlen ungewichtet,
// Mittelwerte und Anteile über die Bevölkerung gewichtet mit wghtpew. Geprüft in allbus.local.test.ts.
import type { Question } from '../answers';
import { parseMarks } from '../workshop/editor';

/* ---------- Daten: Grundlage 1 (mp16 bis mp19, Geflüchtete) ---------- */

/** Anteil „Risiko“ (Code 1 oder 2) je Frage, gewichtet, Prozent (Cum. % bei 2). */
export const MP_RISK = { mp16: 64.87, mp17: 69.16, mp18: 49.44, mp19: 38.71 } as const;
/** Wie viele gültige Antworten auf mp16 bis mp19 die Befragten haben (ungewichtet). */
export const MP_VALID = { all4: 3424, three: 58, two: 15, one: 7 } as const;
/** Befragte mit Indexwert je Regel (ungewichtet). */
export const MP_INDEX_N = { min4: 3424, min3: 3482, none: 3504 } as const;
/** Summe der vier Fragen ohne min_valid: kleinster und größter Wert im ALLBUS. */
export const MP_SUM_RANGE = { min: 2, max: 20 } as const;
/** describe(fluechtlinge, weights = wghtpew) mit min_valid = 3 (R lesen, Karte R2). */
export const MP_DESCRIBE_W = { mean: 2.457, median: 2.5, sd: 0.838, n: 3473 } as const;
/** Index mit min_valid = 4, gewichtet: Mittelwert und Median. */
export const MP_INDEX_W = { mean: 2.452, median: 2.5 } as const;
/** Mit min_valid = 3 kommen Drittelwerte dazu: zusammen gewichtet so viel Prozent. */
export const MP_THIRDS_PERCENT = 1.15;

/** Bild B3: Index aus mp16 bis mp19 (min_valid = 4), gewichtet, Valid % und Cum. % je Wert. */
export const MP_INDEX = {
  values: [1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.25, 3.5, 3.75, 4, 4.25, 4.5, 4.75, 5],
  percent: [8.31, 3.73, 6.15, 6.52, 12.48, 9.33, 10.51, 8.87, 12.63, 7.36, 6.20, 4.25, 2.11, 0.70, 0.25, 0.09, 0.51],
  cum: [8.31, 12.04, 18.19, 24.71, 37.19, 46.52, 57.03, 65.90, 78.54, 85.90, 92.10, 96.35, 98.45, 99.16, 99.41, 99.49, 100],
  /** Unter 3, genau 3, über 3 (Prozent, gewichtet). */
  below3: 65.90,
  at3: 12.63,
  above3: 21.46,
  n: 3424,
};

/* ---------- Daten: Grundlage 2 (pn12, pn13, pn16, pn17, Verbundenheit) ---------- */

export const PN_IDS = ['pn12', 'pn13', 'pn16', 'pn17'] as const;
export const PN_NAMES = ['Gemeinde', 'Bundesland', 'Deutschland', 'EU'] as const;
/** Anteil „stark“ oder „ziemlich verbunden“ (Code 1 oder 2), gewichtet, Prozent. */
export const PN_CLOSE = [65.74, 63.28, 70.89, 49.48];
/** Korrelationen r, ungewichtet, listenweise n = 3.521. */
export const PN_COR = [
  [1, 0.568, 0.340, 0.190],
  [0.568, 1, 0.528, 0.304],
  [0.340, 0.528, 1, 0.495],
  [0.190, 0.304, 0.495, 1],
];
/** Mittlere Korrelation jedes Items mit den drei anderen. */
export const PN_MEAN_COR = [0.366, 0.467, 0.454, 0.330];
/** Mittlere Korrelation aller sechs Paare (r̄). */
export const PN_RBAR = 0.404;
/** summary(reliability(pn12, pn13, pn16, pn17)), ungewichtet. */
export const PN_REL = {
  alpha: 0.726, alphaStd: 0.731, omega: 0.733, omegaStd: 0.738, k: 4, n: 3521,
  items: [
    { id: 'pn12', meanIfDeleted: 7.001, varIfDeleted: 3.407, corrected: 0.457, alphaIfDeleted: 0.700, omegaIfDeleted: 0.717 },
    { id: 'pn13', meanIfDeleted: 6.941, varIfDeleted: 3.135, corrected: 0.620, alphaIfDeleted: 0.603, omegaIfDeleted: 0.643 },
    { id: 'pn16', meanIfDeleted: 7.020, varIfDeleted: 3.265, corrected: 0.603, alphaIfDeleted: 0.617, omegaIfDeleted: 0.668 },
    { id: 'pn17', meanIfDeleted: 6.634, varIfDeleted: 3.496, corrected: 0.402, alphaIfDeleted: 0.733, omegaIfDeleted: 0.756 },
  ],
};

/** Standardisiertes α aus k Items und mittlerer Korrelation r̄ (Formel in Karte 2b). */
export const alphaStd = (k: number, r: number) => (k * r) / (1 + (k - 1) * r);
/** Einstufung wie mariposa (.alpha_interpretation). */
export function alphaLabel(alpha: number): string {
  if (alpha < 0) return 'negative; check item coding';
  if (alpha >= 0.9) return 'Excellent';
  if (alpha >= 0.8) return 'Good';
  if (alpha >= 0.7) return 'Acceptable';
  if (alpha >= 0.6) return 'Questionable';
  return 'Poor';
}
/** Textalternative zum α-Rechner: [k, r̄, α]. */
export const ALPHA_EXAMPLES: [number, number, number][] = [
  [2, 0.404, 0.575], [4, 0.404, 0.731], [8, 0.404, 0.844], [12, 0.404, 0.891], [4, 0.2, 0.500], [4, 0.6, 0.857], [20, 0.2, 0.833],
];
/** Faustregeln unter Bild B6: α, was mariposa schreibt, was es heißt. */
export const ALPHA_RULES: [string, string, string][] = [
  ['ab 0,9', 'Excellent', 'sehr hoch; bei vielen Items oder fast gleichen Fragen'],
  ['0,8 bis unter 0,9', 'Good', 'gut'],
  ['0,7 bis unter 0,8', 'Acceptable', 'annehmbar, die übliche Untergrenze'],
  ['0,6 bis unter 0,7', 'Questionable', 'fraglich'],
  ['unter 0,6', 'Poor', 'schwach'],
  ['negativ', 'negative; check item coding', 'Items zeigen in verschiedene Richtungen: Polung prüfen'],
];

/* ---------- Daten: Grundlage 3 (fr07, fr08, fr03b, fr04b, Rollenbilder) ---------- */

export const FR_IDS = ['fr07', 'fr08', 'fr03b', 'fr04b'] as const;
export type FrId = (typeof FR_IDS)[number];
/** Kurzfassungen für das Umpol-Labor. */
export const FR_SHORT: Record<FrId, string> = {
  fr07: 'fr07 berufstätige Frau gute Mutter',
  fr08: 'fr08 beide Vollzeit, Haushalt teilen',
  fr03b: 'fr03b nicht arbeiten bei Kleinkind',
  fr04b: 'fr04b Frau zu Hause',
};
/** Zustimmung (Code 1 oder 2), gewichtet, Prozent. */
export const FR_AGREE: Record<FrId, number> = { fr07: 68.88, fr08: 66.91, fr03b: 36.21, fr04b: 20.06 };
/** R lesen, Karte R1: frequency(fr03b_um), Code 1 (vorher 4) und Code 4 (vorher 1). */
export const FR03B_REV = { code1: 1098, code4: 366 } as const;
/** Umpol-Labor: Schlüssel in der Reihenfolge fr07, fr08, fr03b, fr04b (U = umgepolt, - = wie gefragt); [α, Trennschärfen]. */
export const LAB: Record<string, [number, number, number, number, number]> = {
  '----': [-0.210, -0.168, -0.019, -0.112, -0.017],
  'U---': [0.183, 0.168, -0.399, 0.465, 0.372],
  '-U--': [-0.158, -0.530, 0.019, 0.213, 0.347],
  'UU--': [0.696, 0.530, 0.399, 0.526, 0.470],
  '--U-': [0.071, 0.421, 0.308, 0.112, -0.470],
  'U-U-': [-1.610, -0.421, -0.337, -0.465, -0.347],
  '-UU-': [-0.926, -0.213, -0.308, -0.213, -0.372],
  'UUU-': [-0.165, 0.213, 0.337, -0.526, 0.017],
  '---U': [-0.165, 0.213, 0.337, -0.526, 0.017],
  'U--U': [-0.926, -0.213, -0.308, -0.213, -0.372],
  '-U-U': [-1.610, -0.421, -0.337, -0.465, -0.347],
  'UU-U': [0.071, 0.421, 0.308, 0.112, -0.470],
  '--UU': [0.696, 0.530, 0.399, 0.526, 0.470],
  'U-UU': [-0.158, -0.530, 0.019, 0.213, 0.347],
  '-UUU': [0.183, 0.168, -0.399, 0.465, 0.372],
  'UUUU': [-0.210, -0.168, -0.019, -0.112, -0.017],
};
/** Befragte mit allen vier Rollenbild-Antworten (listenweise). */
export const LAB_N = 3517;
/** Nach dem Umpolen von fr03b und fr04b: α ohne fr08. */
export const LAB_ALPHA_WITHOUT_FR08 = 0.682;

/* ---------- Daten: Grundlage 4 (Inglehart) ---------- */

export type IngleGoal = { id: 'va01' | 'va02' | 'va03' | 'va04'; text: string; kind: 'M' | 'P' };
export const INGLE_GOALS: IngleGoal[] = [
  { id: 'va01', text: 'Aufrechterhaltung von Ruhe und Ordnung', kind: 'M' },
  { id: 'va02', text: 'Mehr Einfluss der Bürger auf die Entscheidungen der Regierung', kind: 'P' },
  { id: 'va03', text: 'Kampf gegen die steigenden Preise', kind: 'M' },
  { id: 'va04', text: 'Schutz des Rechtes auf freie Meinungsäußerung', kind: 'P' },
];
/** Typ nach Platz 1 und 2: Code von ingle und Name. */
export const INGLE_TYPES: Record<'PP' | 'PM' | 'MP' | 'MM', { code: number; name: string }> = {
  PP: { code: 1, name: 'Postmaterialist' },
  PM: { code: 2, name: 'postmaterialistischer Mischtyp' },
  MP: { code: 3, name: 'materialistischer Mischtyp' },
  MM: { code: 4, name: 'Materialist' },
};
/** frequency(ingle, weights = wghtpew): Valid % je Code 1 bis 4 und die gewichtete Anzahl ohne Zuordnung. */
export const INGLE_SHARES = [18.18, 31.30, 35.68, 14.84];
export const INGLE_NOT_GENERATED = 136;
/** describe(ingle, weights = wghtpew): Mittelwert der Typ-Codes (sinnlos, aber R rechnet ihn). */
export const INGLE_CODE_MEAN = 2.472;

/* ---------- Daten: Aufgaben ---------- */

/** Aufgabe 1: Populismus-Index aus pa29 bis pa35. */
export const POP = {
  nMin7: 3427, nMin5: 3595, extra: 168,
  meanMin7: 2.604, meanMin5: 2.602,
  missingMin7: 1819, missingMin5: 1651,
  weighted: { mean: 2.646, median: 2.714, sd: 0.760, n: 3591, nMin7: 3416, meanMin7: 2.648 },
};
/** Aufgabe 2: summary(reliability(pa29, …, pa35)), ungewichtet. */
export const PA_IDS = ['pa29', 'pa30', 'pa31', 'pa32', 'pa33', 'pa34', 'pa35'] as const;
export const PA_REL = {
  alpha: 0.833, alphaStd: 0.830, omega: 0.841, n: 3427,
  corrected: [0.348, 0.588, 0.648, 0.682, 0.639, 0.545, 0.619],
  alphaIfDeleted: [0.842, 0.811, 0.800, 0.794, 0.801, 0.817, 0.805],
  /** reliability(pa30, …, pa35): ohne pa29. */
  without29: { alpha: 0.842, omega: 0.844, n: 3441 },
  /** Gewichtet ändert sich α kaum. */
  alphaWeighted: 0.829,
  /** pa29: stimme voll oder eher zu, gewichtet, Prozent. */
  pa29Agree: 78.01,
};
/** Aufgabe 3: sechs Aussagen zu Islam und Muslimen, vor und nach dem Umpolen von mm02 und mm05. */
export const MM_IDS = ['mm01', 'mm02', 'mm03', 'mm04', 'mm05', 'mm06'] as const;
export const MM_REL = {
  n: 3069,
  before: { alpha: 0.177, alphaStd: 0.207, omega: 0.508, corrected: [0.289, -0.373, 0.442, 0.474, -0.411, 0.428] },
  after: { alpha: 0.840, alphaStd: 0.842, omega: 0.843, corrected: [0.709, 0.535, 0.633, 0.654, 0.539, 0.654] },
  onlyMm02: 0.540,
  onlyMm05: 0.620,
};
/** Aufgabe 4: Zahl der Zustimmungen (0 bis 3) und Mittelwert der drei Antworten, gewichtet. */
export const A4 = {
  agreements: [41.61, 26.19, 18.00, 14.20],
  nWeighted: 3471,
  meanUpTo2: 21.71,
  meanExactly2: 7.61,
  unweighted: { all3: 15.44, meanUpTo2: 23.35 },
  gap: 7.51,
  gapPartly: 7.3,
  gapReject: 0.2,
};

/* ---------- Beispieldaten der Grundlagen (keine ALLBUS-Daten) ---------- */

/** Bild B1: eine Befragte, Antworten zu Sozialstaat, Sicherheit, Zusammenleben, Wirtschaft. */
export const ONE_PERSON = [2, 2, 3, 4];
/** Bild B2: drei Befragte, Antworten auf mp16 bis mp19; null ist eine fehlende Antwort. */
export const THREE_ROWS: { name: string; values: (number | null)[] }[] = [
  { name: 'A', values: [2, 2, 3, 4] },
  { name: 'B', values: [1, 1, 2, null] },
  { name: 'C', values: [4, 3, 5, 4] },
];
/** Bild B-A1: fünf Befragte, Antworten auf pa29 bis pa35. Reihe 5 hat die Fragen nicht bekommen (Split). */
export const FIVE_ROWS: (number | null)[][] = [
  [1, 2, 3, 2, 2, 4, 3],
  [2, 2, null, 3, 2, 3, 2],
  [1, null, 2, null, 1, 2, 1],
  [null, null, null, 3, null, 4, null],
  [null, null, null, null, null, null, null],
];

/* ---------- Textfassungen der Bilder (Wortlaut aus dem Plan) ---------- */

export const ALT = {
  messfehler: 'Eine Achse von 1, Risiko überwiegt, bis 5, Chance überwiegt. Eine Befragte, zum Beispiel, antwortet beim Sozialstaat 2, bei der Sicherheit 2, beim Zusammenleben 3 und bei der Wirtschaft 4. Ihr Mittelwert aus den vier Antworten liegt bei 2,75. Er beschreibt ihre Haltung zum Thema insgesamt besser als jede einzelne Antwort.',
  reihe: 'Ein Datensatz mit den vier Variablen mp16 bis mp19 und drei Befragten, zum Beispiel. Person A antwortet 2, 2, 3 und 4, ihr Mittelwert ist 11 geteilt durch 4, also 2,75. Person B antwortet 1, 1 und 2, eine Antwort fehlt; ihr Mittelwert aus drei gültigen Antworten ist 4 geteilt durch 3, also 1,33. Person C antwortet 4, 3, 5 und 4, ihr Mittelwert ist 4. Die neue Variable fluechtlinge enthält 2,75, 1,33 und 4. Mit min_valid gleich 4 bekommt Person B keinen Wert, ihre Zelle bleibt leer, weil sie nur drei von vier Fragen beantwortet hat.',
  formelIndex: 'Indexwert gleich Summe der gültigen Antworten einer Person geteilt durch die Anzahl ihrer gültigen Antworten. Das gilt nur, wenn die Anzahl gültiger Antworten mindestens min_valid ist, sonst bleibt der Wert leer. Für Person B: 1 plus 1 plus 2 gleich 4, geteilt durch 3 ergibt 1,33.',
  indexFluechtlinge: 'Säulendiagramm des Index von 1 bis 5 in Viertelschritten, gewichtet, nur Befragte mit allen vier Antworten. Prozent je Wert: 1: 8,31; 1,25: 3,73; 1,5: 6,15; 1,75: 6,52; 2: 12,48; 2,25: 9,33; 2,5: 10,51; 2,75: 8,87; 3: 12,63; 3,25: 7,36; 3,5: 6,20; 3,75: 4,25; 4: 2,11; 4,25: 0,70; 4,5: 0,25; 4,75: 0,09; 5: 0,51. Unter 3 liegen zusammen 65,90 Prozent, genau 3 haben 12,63 Prozent, über 3 liegen 21,46 Prozent. Mittelwert 2,45, Median 2,5.',
  minValid: 'Fünf Befragte, zum Beispiel. Zeile 1 hat sieben gültige Antworten: 1, 2, 3, 2, 2, 4, 3, Mittelwert 2,43. Zeile 2 hat sechs: 2, 2, 3, 2, 3, 2, Mittelwert 2,33. Zeile 3 hat fünf: 1, 2, 1, 2, 1, Mittelwert 1,40. Zeile 4 hat zwei gültige Antworten, Zeile 5 keine, weil die Fragen dort nicht gestellt wurden. Mit min_valid gleich 7 bekommt nur Zeile 1 einen Wert, mit min_valid gleich 5 die Zeilen 1, 2 und 3.',
  korrelationen: 'Am engsten hängen Gemeinde und Bundesland zusammen (0,568), am schwächsten Gemeinde und EU (0,190). Mittlere Korrelation mit den anderen drei: Gemeinde 0,366, Bundesland 0,467, Deutschland 0,454, EU 0,330.',
  formelAlpha: 'Alpha gleich k mal r quer, geteilt durch 1 plus k minus 1 mal r quer. Dabei ist k die Zahl der Items und r quer die mittlere Korrelation zwischen ihnen. Für die Verbundenheit: k gleich 4, r quer gleich 0,404. Oben 4 mal 0,404 gleich 1,616, unten 1 plus 3 mal 0,404 gleich 2,212. 1,616 geteilt durch 2,212 ergibt 0,731.',
  alphaOhne: 'α ohne die jeweilige Aussage: pa29 0,842, pa30 0,811, pa31 0,800, pa32 0,794, pa33 0,801, pa34 0,817, pa35 0,805. Mit allen sieben ist α 0,833. Nur ohne pa29 wäre α höher.',
  umpolen: 'Eine Person, zum Beispiel, antwortet bei fr07 und fr08 mit 1, stimme voll zu, und bei fr03b und fr04b mit 4, stimme gar nicht zu. Sie denkt durchgehend gleichberechtigt. Ohne Umpolen ist ihr Mittelwert 2,5, als wäre sie unentschieden. Nach dem Umpolen von fr03b und fr04b werden aus den beiden 4 jeweils 1, und ihr Mittelwert ist 1. Umpolen heißt: neuer Wert gleich kleinster plus größter Code minus alter Wert, auf einer Skala von 1 bis 4 also 5 minus alter Wert.',
  vorherNachher: 'Trennschärfen vorher: mm01 0,289, mm02 minus 0,373, mm03 0,442, mm04 0,474, mm05 minus 0,411, mm06 0,428, Cronbachs Alpha 0,177. Nach dem Umpolen von mm02 und mm05: mm01 0,709, mm02_um 0,535, mm03 0,633, mm04 0,654, mm05_um 0,539, mm06 0,654, Cronbachs Alpha 0,840.',
  ausgleich: 'Person A antwortet 1, 1 und 4, Person B 2, 2 und 2, zum Beispiel. Beide haben den Mittelwert 2. Nach der Regel allen zugestimmt, also bei jeder Aussage 1 oder 2, gilt nur Person B, denn Person A lehnt die dritte Aussage mit 4 ab.',
  welcherIndex: 'Entscheidungsbaum. Erste Frage: Darf eine hohe Antwort bei einem Item eine niedrige bei einem anderen ausgleichen? Wenn nein, nimmst du einen Kombinationsindex mit einer festen Regel, etwa allen zugestimmt oder einen Typ aus Rängen wie beim Inglehart-Index; in R mit rec und row_sums. Wenn ja, zweite Frage: Zeigen alle Items in dieselbe Richtung? Wenn nein, erst umpolen, dann noch einmal fragen. Wenn ja, dritte Frage: Hängen die Items eng genug zusammen, also Cronbachs Alpha und Trennschärfen? Wenn nein, Items und Begriff überdenken. Wenn ja, bildest du einen Mittelwertindex mit row_means, pick und min_valid.',
  zeileR2: 'fluechtlinge gleich, der neue Name. row_means, die Funktion: Mittelwert je Zeile. pick mit mp16, mp17, mp18, mp19: welche Variablen. Komma, min_valid gleich 3: mindestens so viele gültige Antworten. Klammer zu.',
};

/* ---------- Codevorlagen ---------- */

export type Template = { title: string; code: string; tryOut?: boolean };
/** ⟦…⟧ markiert Stellen, die angepasst werden. Wortlaut wie im Plan (sitzung08.md), geprüft mit sitzung08-zahlen.R. */
export const TEMPLATES: Record<string, Template> = {
  start: { title: 'Startblock', code: `# Pakete laden und Daten einlesen
library(tidyverse)
library(mariposa)

allbus <- read_spss("ZA8831_v1-3-0.sav")` },
  r_rev: { title: 'Umpolen erinnert: fr03b', code: `# Umpolen wie in Sitzung 5: aus 1 wird 4, aus 2 wird 3 und so weiter
allbus %>%
  mutate(
    fr03b_um = rec(fr03b, rules = "rev")
  ) %>%
  frequency(fr03b_um)` },
  r_rowmeans: { title: 'Ein Wert je Person: Index zu Geflüchteten', code: `# Ein Wert je Person: Mittelwert der vier Fragen zu Geflüchteten
allbus %>%
  mutate(
    fluechtlinge = row_means(pick(mp16, mp17, mp18, mp19), min_valid = 3)
  ) %>%
  describe(fluechtlinge, weights = wghtpew)` },
  r_reliability: { title: 'Reliabilität: Verbundenheit', code: `# Wie zuverlässig messen die vier Fragen zur Verbundenheit zusammen? Kurz
allbus %>%
  reliability(pn12, pn13, pn16, pn17)

# Dasselbe ausführlich, mit einer Zeile je Item
allbus %>%
  reliability(pn12, pn13, pn16, pn17) %>%
  summary()` },
  a1: { title: 'Aufgabe 1: Populismus-Index, wer bekommt einen Wert', code: `# Populismus-Index: Mittelwert der sieben Aussagen je Person
# Wie viele Befragte bekommen einen Wert? Personen zählst du ohne Gewicht.
allbus %>%
  mutate(
    populismus = row_means(pick(pa29, pa30, pa31, pa32, pa33, pa34, pa35), min_valid = ⟦7⟧)
  ) %>%
  describe(populismus)` },
  a1w: { title: 'Aufgabe 1: Populismus-Index gewichtet', code: `# Populismus-Index wie in Schritt 1, mit mindestens fünf von sieben Antworten
# Wie populistisch sind die Befragten im Mittel? Aussage über alle: mit Gewicht
allbus %>%
  mutate(
    populismus = row_means(pick(pa29, pa30, pa31, pa32, pa33, pa34, pa35), min_valid = 5)
  ) %>%
  describe(populismus, weights = wghtpew)` },
  frei_a1: { tryOut: true, title: 'Deine Probier-Werkstatt', code: `# Eine Idee: Populismus-Index wie in Aufgabe 1, Westen und Osten im Vergleich
# (t-Test kennst du aus Sitzung 7)
allbus %>%
  mutate(
    populismus = row_means(pick(pa29, pa30, pa31, pa32, pa33, pa34, pa35), min_valid = 5)
  ) %>%
  t_test(populismus, group = eastwest, weights = wghtpew) %>%
  summary()
` },
  a2: { title: 'Aufgabe 2: Reliabilität der sieben Aussagen', code: `# Wie zuverlässig messen die sieben Populismus-Aussagen zusammen? Ausführlich mit summary()
allbus %>%
  reliability(pa29, pa30, pa31, pa32, pa33, pa34, pa35) %>%
  summary()` },
  a2ohne: { title: 'Aufgabe 2: Gegenprobe ohne ein Item', code: `# Gegenprobe: dieselbe Rechnung ohne ein Item
allbus %>%
  reliability(⟦pa29, ⟧pa30, pa31, pa32, pa33, pa34, pa35)` },
  frei_a2: { tryOut: true, title: 'Deine Probier-Werkstatt', code: `# Eine Idee: Wie zuverlässig messen nur drei der sieben Aussagen zusammen?
allbus %>%
  reliability(pa31, pa32, pa33)
` },
  a3: { title: 'Aufgabe 3: sechs Aussagen zu Islam und Muslimen, wie gefragt', code: `# Wie zuverlässig messen die sechs Aussagen zu Islam und Muslimen zusammen, so wie sie im Datensatz stehen?
allbus %>%
  reliability(mm01, mm02, mm03, mm04, mm05, mm06) %>%
  summary()` },
  a3um: { title: 'Aufgabe 3: umpolen und neu prüfen', code: `# Zwei Items umpolen: aus 1 wird 7, aus 2 wird 6 und so weiter
# Dann die Reliabilität mit den umgepolten Items statt der alten
allbus %>%
  mutate(
    mm02_um = rec(mm02, rules = "rev"),
    mm05_um = rec(mm05, rules = "rev")
  ) %>%
  reliability(mm01, ⟦mm02⟧, mm03, mm04, ⟦mm05⟧, mm06) %>%
  summary()` },
  frei_a3: { tryOut: true, title: 'Deine Probier-Werkstatt', code: `# Eine Idee: der Index mit und ohne Umpolen (umgepolt wie in Aufgabe 3)
allbus %>%
  mutate(
    mm02_um           = rec(mm02, rules = "rev"),
    mm05_um           = rec(mm05, rules = "rev"),
    vorbehalte        = row_means(pick(mm01, mm02_um, mm03, mm04, mm05_um, mm06), min_valid = 5),
    vorbehalte_falsch = row_means(pick(mm01, mm02, mm03, mm04, mm05, mm06), min_valid = 5)
  ) %>%
  describe(vorbehalte, vorbehalte_falsch, weights = wghtpew)
` },
  a4: { title: 'Aufgabe 4: Zahl der Zustimmungen und Mittelwert', code: `# Drei Aussagen, zwei Indizes: Zahl der Zustimmungen und Mittelwert
allbus %>%
  mutate(
    z31          = rec(pa31, rules = "1:2=1 [stimmt zu]; 3:5=0 [stimmt nicht zu]; else=NA"),
    z32          = rec(pa32, rules = "1:2=1 [stimmt zu]; 3:5=0 [stimmt nicht zu]; else=NA"),
    z33          = rec(pa33, rules = "1:2=1 [stimmt zu]; 3:5=0 [stimmt nicht zu]; else=NA"),
    zustimmungen = row_sums(pick(z31, z32, z33), min_valid = 3),
    kurz         = row_means(pick(pa31, pa32, pa33), min_valid = 3)
  ) %>%
  frequency(⟦zustimmungen⟧, weights = wghtpew)` },
  frei_a4: { tryOut: true, title: 'Deine Probier-Werkstatt', code: `# Eine Idee: Zahl der Zustimmungen wie in Aufgabe 4, Westen und Osten im Vergleich
allbus %>%
  mutate(
    z31          = rec(pa31, rules = "1:2=1 [stimmt zu]; 3:5=0 [stimmt nicht zu]; else=NA"),
    z32          = rec(pa32, rules = "1:2=1 [stimmt zu]; 3:5=0 [stimmt nicht zu]; else=NA"),
    z33          = rec(pa33, rules = "1:2=1 [stimmt zu]; 3:5=0 [stimmt nicht zu]; else=NA"),
    zustimmungen = row_sums(pick(z31, z32, z33), min_valid = 3)
  ) %>%
  crosstab(zustimmungen, eastwest, percentages = "col", weights = wghtpew)
` },
};

/* ---------- Fragen mit Sonderfällen ---------- */

/**
 * A question of this session. `special` gives its own feedback for a known wrong answer
 * (an option value, or a number with tolerance), checked after the target; `alsoRight` accepts a second option
 * with its own text (only in a „Kurz überlegen“).
 */
export type Special = { match: string | number; tolerance?: number; text: string };
export type S8Question = Question & { special?: Special[]; alsoRight?: { value: string; text: string }[] };

type Extra = { short?: string; help?: string; special?: Special[]; alsoRight?: { value: string; text: string }[] };
const choice = (id: string, label: string, options: [string, string][], target: string, right: string, hint: string, extra: Extra = {}): S8Question =>
  ({ id, label, kind: 'choice', options: options.map(([value, l]) => ({ value, label: l })), target, right, hint, ...extra });
const number = (id: string, label: string, target: number, right: string, hint: string, extra: Extra & { tolerance?: number } = {}): S8Question =>
  ({ id, label, kind: 'number', target, right, hint, ...extra });

/** Kurzfassungen der sieben Populismus-Aussagen (Festlegen in Aufgabe 2 und Frage a2b). */
export const PA_SHORT: [string, string][] = [
  ['pa29', 'pa29 Abgeordnete nur dem Volk verpflichtet'],
  ['pa30', 'pa30 Politiker reden zu viel, handeln zu wenig'],
  ['pa31', 'pa31 Einfache Bürger wären bessere Volksvertreter'],
  ['pa32', 'pa32 Kompromiss ist Verrat an Prinzipien'],
  ['pa33', 'pa33 Das Volk sollte entscheiden'],
  ['pa34', 'pa34 Das Volk ist sich einig'],
  ['pa35', 'pa35 Politiker vertreten nur die Reichen'],
];
/** Wortlaut der sieben Populismus-Aussagen (Tabelle in Aufgabe 1). */
export const PA_ITEMS: [string, string][] = [
  ['pa29', 'Die Abgeordneten im Bundestag sollten sich nur dem Willen des Volkes verpflichtet fühlen.'],
  ['pa30', 'Die Politiker reden zu viel und handeln zu wenig.'],
  ['pa31', 'Ein einfacher Bürger würde meine Interessen besser vertreten als ein Berufspolitiker.'],
  ['pa32', 'Was man in der Politik „Kompromiss“ nennt, ist in Wirklichkeit nur ein Verrat der eigenen Prinzipien.'],
  ['pa33', 'Das Volk, nicht die Politiker, sollte die wichtigsten politischen Entscheidungen treffen.'],
  ['pa34', 'Die Bürger sind sich im Prinzip einig darüber, was politisch passieren muss.'],
  ['pa35', 'Politiker vertreten nur die Interessen der Reichen.'],
];
/** Sinngemäßer Wortlaut der sechs Aussagen zu Islam und Muslimen (nach den Variablenlabels). */
export const MM_ITEMS: [string, string][] = [
  ['mm01', 'Die Ausübung des islamischen Glaubens in Deutschland sollte eingeschränkt werden.'],
  ['mm02', 'Der Islam passt in die deutsche Gesellschaft.'],
  ['mm03', 'Die Anwesenheit von Muslimen in Deutschland führt zu Konflikten.'],
  ['mm04', 'Der Staat sollte islamische Gruppen beobachten.'],
  ['mm05', 'Ein muslimischer Bürgermeister wäre in Ordnung.'],
  ['mm06', 'Unter den Muslimen in Deutschland gibt es viele religiöse Fanatiker.'],
];
const MM_PAIRS: [string, string][] = [['mm01-mm04', 'mm01 und mm04'], ['mm02-mm05', 'mm02 und mm05'], ['mm03-mm06', 'mm03 und mm06']];

/** Antwortfragen am Ende jeder Aufgabe (Tabellen in sitzung08.md). */
export const QUESTIONS: Record<'a1' | 'a2' | 'a3' | 'a4', S8Question[]> = {
  a1: [
    number('a1a', 'Wie viele Befragte bekommen mit `min_valid = 7` einen Indexwert?', 3427,
      '3.427 Befragte haben alle sieben Aussagen beantwortet.', 'Lies in der Ausgabe von Schritt 1 die Spalte N.', {
        short: 'Indexwert mit min_valid = 7', help: 'Aus `describe(populismus)` in Schritt 1, Spalte N.',
        special: [
          { match: 3595, text: 'Das ist N mit min_valid = 5 aus Schritt 2. Gefragt ist die erste Ausgabe mit 7.' },
          { match: 3416, text: 'Das ist N mit Gewicht (Summe der Gewichte). Personen zählst du mit der Vorlage aus Schritt 1, ohne Gewicht.' },
          { match: 1819, text: 'Das ist Missing: so viele bekommen keinen Wert.' },
        ],
      }),
    number('a1b', 'Wie viele Befragte bekommen mit `min_valid = 5` einen Indexwert?', 3595,
      '3.595 Befragte, also 168 mehr als mit 7. Fast alle, die die Fragen bekommen haben, haben auch fast alle beantwortet.', 'Setz in Schritt 1 min_valid = 5 und lies N.', {
        short: 'Indexwert mit min_valid = 5', help: 'Schritt 1 mit `min_valid = 5`, Spalte N.',
        special: [
          { match: 3427, text: 'Das ist noch das Ergebnis mit 7. Setz die markierte Zahl auf 5 und führe die Vorlage erneut aus.' },
          { match: 3591, text: 'Das ist N mit Gewicht aus Schritt 3. Personen zählst du ohne Gewicht (Schritt 1 mit 5).' },
          { match: 1651, text: 'Das ist Missing.' },
        ],
      }),
    choice('a1c', 'Wer bekommt mit `min_valid = 5` zusätzlich einen Wert?', [
      ['eins', 'Befragte, die eine oder zwei der sieben Aussagen nicht beantwortet haben'],
      ['null', 'Befragte, die gar keine Aussage beantwortet haben'],
      ['split', 'Befragte aus dem anderen Teil der Fragebögen (Split)'],
    ], 'eins', 'Genau. Sie haben fünf oder sechs ⟪gültige Antworten⟫; ihr Wert ist der Mittelwert dieser Antworten.',
    'Wer keine Antwort hat, bekommt nie einen Wert.', {
      short: 'wer dazukommt',
      special: [
        { match: 'null', text: 'Wer keine Antwort hat, bekommt nie einen Wert, auch ohne min_valid nicht.' },
        { match: 'split', text: 'Wer die Fragen nicht bekam, hat keine einzige Antwort und bekommt nie einen Wert.' },
      ],
    }),
    number('a1d', 'Wie hoch ist der gewichtete Mittelwert des Index (Schritt 3)?', 2.646,
      '2,646, gewichtet. Was das in Worten heißt, fragt die nächste Frage.', 'Lies in Schritt 3 die Spalte Mean.', {
        tolerance: 0.005, short: 'gewichteter Mittelwert', help: 'Aus Schritt 3, Spalte Mean. R schreibt Kommazahlen mit Punkt.',
        special: [
          { match: 2.602, tolerance: 0.002, text: 'Das ist der Mittelwert ohne Gewicht aus Schritt 1. Für die Aussage über alle nimm Schritt 3.' },
          { match: 2.604, tolerance: 0.002, text: 'Das ist der Mittelwert ohne Gewicht aus Schritt 1. Für die Aussage über alle nimm Schritt 3.' },
          { match: 2.714, tolerance: 0.002, text: 'Das ist der Median. Gesucht ist Mean.' },
        ],
      }),
    choice('a1e', 'Welcher Satz beschreibt den Mittelwert richtig?', [
      ['zu', 'Im Mittel stimmen die Befragten den Aussagen eher zu: Der Wert liegt zwischen „stimme eher zu“ (2) und „teils/teils“ (3).'],
      ['wenig', 'Die Befragten sind im Mittel wenig populistisch, denn 2,65 ist ein niedriger Wert auf einer Skala bis 5.'],
      ['anteil', '2,65 von 5 Befragten sind populistisch.'],
    ], 'zu', 'Genau. Bei diesen Aussagen heißt eine kleine Zahl Zustimmung. Ein niedriger Index heißt also: eher populistisch.',
    'Achte auf die Richtung: 1 heißt „stimme voll zu“.', {
      short: 'Deutung',
      special: [
        { match: 'wenig', text: 'Achte auf die Richtung: 1 heißt „stimme voll zu“. Ein niedriger Wert bedeutet hier mehr Zustimmung, also eher populistisch.' },
        { match: 'anteil', text: 'Der Index ist ein Wert je Person auf der Antwortskala 1 bis 5, kein Anteil an Personen.' },
      ],
    }),
  ],
  a2: [
    number('a2a', 'Wie hoch ist Cronbachs α der sieben Aussagen?', 0.833,
      'α = 0,833, nach der Faustregel gut (Good, ab 0,8).', 'Lies in Schritt 1 die Zeile „Cronbach\'s Alpha“.', {
        tolerance: 0.0015, short: 'Cronbachs α', help: 'Drei Nachkommastellen, wie R sie zeigt, zum Beispiel 0,123.',
        special: [
          { match: 0.830, tolerance: 0.0005, text: '0,830 steht bei „Alpha (standardized)“. Hast du gerundet? Trag alle drei Nachkommastellen von „Cronbach\'s Alpha“ ein.' },
          { match: 0.841, tolerance: 0.0005, text: 'Das ist McDonalds ω. Gesucht ist Cronbach\'s Alpha, zwei Zeilen darüber.' },
          { match: 0.842, tolerance: 0.0005, text: 'Das ist α ohne pa29. Gesucht ist α mit allen sieben, Schritt 1 oben.' },
        ],
      }),
    choice('a2b', 'Welche Aussage hat die schwächste Trennschärfe?', PA_SHORT, 'pa29',
      'pa29 („Abgeordnete nur dem Volk verpflichtet“) mit 0,348. Alle anderen liegen zwischen 0,545 und 0,682.',
      'Vergleich die Spalte „Corrected Item-Total“: Gesucht ist die kleinste Zahl.', {
        short: 'schwächste Trennschärfe', help: 'Spalte Corrected Item-Total in Schritt 1.',
        special: [{ match: 'pa34', text: 'pa34 hat mit 0,545 die zweitschwächste. Noch schwächer ist eine andere.' }],
      }),
    choice('a2c', 'Was sagt α = 0,833?', [
      ['stimmig', 'Die sieben Antworten einer Person hängen so eng zusammen, dass ihr Mittelwert zuverlässig misst.'],
      ['prozent', '83 % der Befragten antworten einheitlich.'],
      ['gueltig', 'Die sieben Aussagen messen nachweislich Populismus.'],
    ], 'stimmig', 'Genau. α schätzt die ⟪Reliabilität⟫ des Index: wie zuverlässig er misst.',
    'α fasst zusammen, wie eng die Items zusammenhängen.', {
      short: 'was α sagt',
      special: [
        { match: 'prozent', text: 'α ist kein Anteil von Befragten. Es fasst zusammen, wie eng die Items zusammenhängen.' },
        { match: 'gueltig', text: 'Ob die Aussagen Populismus treffen, ist eine Frage der ⟪Validität⟫. Die prüft α nicht; dafür schaust du auf den Inhalt.' },
      ],
    }),
    number('a2d', 'Wie hoch ist α ohne pa29 (Schritt 2)?', 0.842,
      '0,842, genau wie „Alpha if Deleted“ bei pa29. α steigt um 0,009.', 'Führe Schritt 2 ohne pa29 aus und lies „Cronbach\'s Alpha =“.', {
        tolerance: 0.0005, short: 'α ohne pa29', help: 'Aus Schritt 2, drei Nachkommastellen.',
        special: [
          { match: 0.841, tolerance: 0.0005, text: 'Das ist McDonalds ω aus Schritt 1 (alle sieben). Gesucht ist Cronbach\'s Alpha aus Schritt 2, ohne pa29.' },
          { match: 0.833, tolerance: 0.0005, text: 'Das ist noch α mit allen sieben. Lösch in der Vorlage `pa29, ` und führe sie erneut aus.' },
          { match: 0.844, tolerance: 0.0005, text: 'Das ist McDonalds ω. Gesucht ist Cronbach\'s Alpha in derselben Zeile.' },
          { match: 0.348, tolerance: 0.0005, text: 'Das ist die Trennschärfe von pa29. Gesucht ist α ohne pa29.' },
        ],
      }),
    choice('a2e', 'Soll pa29 aus dem Populismus-Index?', [
      ['raus', 'Ja: Ohne pa29 ist α höher, also muss sie raus.'],
      ['inhalt', 'Nicht automatisch: α steigt nur wenig (0,833 auf 0,842). Ob pa29 zum Begriff gehört, entscheidet der Inhalt.'],
      ['nie', 'Nein: Items darf man nie aus einem Index nehmen.'],
    ], 'inhalt', 'Genau. pa29 („Abgeordnete nur dem Volk verpflichtet“) trifft einen Kern von Populismus. Aber 78 % stimmen ihr voll oder eher zu (gewichtet), sie unterscheidet also kaum zwischen den Befragten. Beides gehört in die Entscheidung.',
    'Ob ein Item bleibt, entscheidet der Inhalt.', {
      short: 'pa29 behalten?',
      special: [
        { match: 'raus', text: 'Ein Gewinn von 0,009 ist sehr klein. Wer pa29 streicht, misst den Begriff enger. Das entscheidest du am Inhalt, nicht an der dritten Nachkommastelle.' },
        { match: 'nie', text: 'Items zu streichen ist erlaubt, wenn du es inhaltlich begründest und berichtest.' },
      ],
    }),
  ],
  a3: [
    choice('a3a', 'Welche zwei Aussagen haben in Schritt 1 eine negative Trennschärfe?', MM_PAIRS, 'mm02-mm05',
      'mm02 (−0,373) und mm05 (−0,411). Genau die beiden sind andersherum gestellt als die übrigen vier.',
      'Such in der Spalte Corrected Item-Total die beiden Zahlen mit Minuszeichen.', { short: 'negative Trennschärfe', help: 'Schritt 1, Spalte Corrected Item-Total.' }),
    number('a3b', 'Wie hoch ist Cronbachs α vor dem Umpolen?', 0.177,
      '0,177, nach der Faustregel schwach (Poor).', 'Lies in Schritt 1 die Zeile Cronbach\'s Alpha.', {
        tolerance: 0.0015, short: 'α vor dem Umpolen', help: 'Drei Nachkommastellen.',
        special: [
          { match: 0.207, tolerance: 0.0005, text: 'Das ist das standardisierte α. Gesucht ist „Cronbach\'s Alpha“ eine Zeile darüber.' },
          { match: 0.508, tolerance: 0.0005, text: 'Das ist McDonalds ω.' },
          { match: 0.840, tolerance: 0.0005, text: 'Das ist α nach dem Umpolen. Gesucht ist Schritt 1.' },
        ],
      }),
    number('a3c', 'Wie hoch ist Cronbachs α nach dem Umpolen (Schritt 2)?', 0.840,
      '0,840, nach der Faustregel gut (Good). Vorher 0,177.', 'Führe Schritt 2 mit mm02_um und mm05_um aus und lies Cronbach\'s Alpha.', {
        tolerance: 0.0015, short: 'α nach dem Umpolen', help: 'Aus Schritt 2, drei Nachkommastellen.',
        special: [
          { match: 0.177, tolerance: 0.0005, text: 'Das ist noch α vor dem Umpolen. In reliability() stehen noch mm02 und mm05; tausch sie gegen mm02_um und mm05_um.' },
          { match: 0.540, tolerance: 0.0005, text: 'Du hast nur mm02 getauscht. Tausch auch mm05 gegen mm05_um.' },
          { match: 0.620, tolerance: 0.0005, text: 'Du hast nur mm05 getauscht. Tausch auch mm02 gegen mm02_um.' },
          { match: 0.842, tolerance: 0.0005, text: 'Das ist das standardisierte α.' },
          { match: 0.843, tolerance: 0.0005, text: 'Das ist McDonalds ω.' },
        ],
      }),
    choice('a3d', 'Wofür steht nach dem Umpolen eine hohe Zahl bei allen sechs Aussagen?', [
      ['vorb', 'für mehr Vorbehalte gegenüber Islam und Muslimen'],
      ['offen', 'für mehr Offenheit gegenüber Islam und Muslimen'],
      ['versch', 'Das ist je nach Aussage verschieden.'],
    ], 'vorb', 'Genau. Bei mm01, mm03, mm04 und mm06 steht 7 schon für Vorbehalte. mm02_um und mm05_um sind so gedreht, dass 7 jetzt „stimme gar nicht zu“ heißt, also ebenfalls für Vorbehalte. Ein hoher ⟪Skalenwert⟫, also der Indexwert einer Person, steht damit für mehr Vorbehalte. Nenn diese Richtung immer mit.',
    'Lies die Aussagen noch einmal: Wofür steht bei den vier nicht umgepolten eine 7?', {
      short: 'Richtung',
      special: [
        { match: 'offen', text: 'Das galt nur für mm02 und mm05 vor dem Umpolen. Jetzt sind sie gedreht und passen zu den vier anderen.' },
        { match: 'versch', text: 'Genau das hat das Umpolen behoben: Jetzt bedeutet eine hohe Zahl überall dasselbe.' },
      ],
    }),
    choice('a3e', 'Warum war α vor dem Umpolen so niedrig?', [
      ['richtung', 'Zwei Aussagen zeigen in die andere Richtung; ihre Antworten heben die der anderen teilweise auf.'],
      ['begriff', 'Die sechs Aussagen messen ganz Verschiedenes.'],
      ['wenige', 'Zu wenige Befragte haben geantwortet.'],
    ], 'richtung', 'Genau. Nach dem ⟪Umpolen⟫ steigt α auf 0,840. Die Aussagen messen also ein gemeinsames ⟪Konstrukt⟫, sie waren nur verschieden ⟪gepolt|polung⟫.',
    'Vergleich α vor und nach dem Umpolen.', {
      short: 'warum so niedrig',
      special: [
        { match: 'begriff', text: 'Dann bliebe α auch nach dem Umpolen niedrig. Es steigt aber auf 0,840.' },
        { match: 'wenige', text: '3.069 Befragte sind viele. α hängt nicht davon ab, wie viele geantwortet haben.' },
      ],
    }),
  ],
  a4: [
    number('a4a', 'Wie viel Prozent stimmen allen drei Aussagen zu?', 14.2,
      '14,2 % (gewichtet) stimmen allen drei zu: durchgehend populistisch nach dieser Regel.', 'Lies in Schritt 1 die Zeile 3, Spalte Valid %.', {
        tolerance: 0.1, short: 'allen drei zugestimmt', help: 'Prozent, Valid % in der Zeile 3.',
        special: [
          { match: 15.44, tolerance: 0.1, text: 'Das ist der Anteil ohne Gewicht. Für eine Aussage über alle steht weights = wghtpew in der Vorlage; führe sie unverändert aus.' },
          { match: 41.61, tolerance: 0.1, text: 'Das sind die, die keiner Aussage zustimmen (Zeile 0).' },
        ],
      }),
    number('a4b', 'Wie viel Prozent stimmen im Schnitt zu (Mittelwert höchstens 2)?', 21.71,
      '21,71 %. Also stimmen 7,5 ⟪Prozentpunkte⟫ mehr im Schnitt zu als durchgehend.', 'Führe Schritt 2 mit kurz aus und lies Cum. % in der Zeile 2.', {
        tolerance: 0.1, short: 'im Schnitt zugestimmt', help: 'Cum. % in der Zeile 2.',
        special: [
          { match: 7.61, tolerance: 0.1, text: 'Das sind nur die mit genau 2. Höchstens 2 heißt: auch 1, 1,33 und 1,67. Lies Cum. % in der Zeile 2.' },
          { match: 23.35, tolerance: 0.1, text: 'Das ist ohne Gewicht.' },
          { match: 14.2, tolerance: 0.1, text: 'Das ist der Anteil „allen drei zugestimmt“ aus Schritt 1. Tausch zustimmungen gegen kurz.' },
        ],
      }),
    choice('a4c', 'Warum stimmen im Schnitt mehr zu als durchgehend?', [
      ['ausgleich', 'Im Mittelwert kann Zustimmung bei zwei Aussagen eine schwächere Antwort bei der dritten ausgleichen.'],
      ['gewicht', 'Weil der Mittelwertindex gewichtet ist und der andere nicht.'],
      ['fehlend', 'Weil beim Mittelwertindex mehr Befragte einen Wert haben.'],
    ], 'ausgleich', 'Genau. Der Mittelwertindex ist ein ⟪kompensatorischer Index|kompensatorisch⟫: Zustimmung bei zwei Aussagen kann eine schwächere Antwort bei der dritten ausgleichen. Die Regel „allen zugestimmt“ ist dagegen ein ⟪Kombinationsindex⟫: Bei ihr lässt sich nichts ausgleichen. Die 7,5 Prozentpunkte Unterschied sind fast alle Befragte, die zwei Aussagen zustimmen, mindestens einer davon voll, und bei der dritten „teils/teils“ sagen (7,3 Prozentpunkte). Dass eine echte Ablehnung ausgeglichen wird (etwa 1, 1, 4), kommt kaum vor (0,2 Prozentpunkte).',
    'Denk an Person A und B aus Grundlage 4a.', {
      short: 'warum mehr',
      special: [
        { match: 'gewicht', text: 'Beide sind gewichtet (weights = wghtpew in derselben Vorlage).' },
        { match: 'fehlend', text: 'Beide haben min_valid = 3 und dieselben 3.471 Befragten (gewichtet).' },
      ],
    }),
  ],
};

/** Pflichtaufgaben: Aufgabe 1, 2 und 3 (Aufgabe 4 ist Zusatz). */
export const REQUIRED: Question[] = [...QUESTIONS.a1, ...QUESTIONS.a2, ...QUESTIONS.a3];

/* ---------- Kurz überlegen in den Grundlagen ---------- */

export const CHECKS: Record<'g1a' | 'g1b' | 'g1c' | 'g2a' | 'g2b' | 'g2c' | 'g3a' | 'g3b' | 'g4b', S8Question> = {
  g1a: choice('g1a-frage', 'Welche Zahl beschreibt die Haltung dieser Befragten zu Geflüchteten insgesamt am besten?', [
    ['wirtschaft', 'ihre Antwort zur Wirtschaft (4)'],
    ['sozial', 'ihre Antwort zum Sozialstaat (2)'],
    ['mittel', 'der Mittelwert der vier Antworten (2,75)'],
  ], 'mittel', 'Genau. Jede einzelne Frage trifft nur einen Ausschnitt und enthält auch Zufall: einen schlechten Tag, eine missverstandene Formulierung. Im Mittelwert gleichen sich solche Ausrutscher teilweise aus.',
  'Eine einzelne Frage zeigt nur einen Ausschnitt. Mit der Wirtschaft allein wäre sie eher bei „Chance“, mit dem Sozialstaat allein eher bei „Risiko“. Der Mittelwert nimmt alle vier Ausschnitte zusammen.'),
  g1b: number('g1b-frage', 'Welchen Indexwert bekommt Person B mit `min_valid = 3`?', 1.33,
    '1,33: Drei gültige Antworten, 1 + 1 + 2 = 4, geteilt durch 3. Die fehlende Antwort zählt nicht als 0, sie fällt einfach weg.',
    'Zähl nur die gültigen Antworten zusammen und teile durch ihre Anzahl.', {
      tolerance: 0.01, short: 'Indexwert von Person B', help: 'Eine Kommazahl reicht, zum Beispiel 2,5.',
      special: [{ match: 1, tolerance: 0.01, text: 'Das wäre (1 + 1 + 2 + 0) / 4: Dann zähltest du die fehlende Antwort als 0. `row_means()` lässt sie weg und teilt durch 3.' }],
    }),
  g1c: number('g1c-frage', 'Wie viel Prozent der Befragten sehen Geflüchtete insgesamt eher als Risiko, haben also einen Indexwert unter 3?', 65.90,
    'Knapp zwei Drittel (65,9 %) haben einen Wert unter 3. Nur gut jeder Fünfte (21,5 %) liegt über 3, also eher bei „Chance“.',
    'Zähl die Säulen von 1 bis 2,75 zusammen oder lies „kumuliert“ in der Zeile 2,75.', {
      tolerance: 0.5, short: 'Indexwert unter 3', help: 'Zähl die blauen Säulen zusammen oder lies die Tabelle unter dem Bild. Eine Kommazahl reicht.',
      special: [{ match: 78.54, tolerance: 0.5, text: 'Da ist die Säule bei genau 3 mitgezählt. 3 heißt „weder noch“; gefragt ist „unter 3“.' }],
    }),
  g2a: choice('g2a-frage', 'Welche Ebene passt am wenigsten zu den anderen drei?', [
    ['gemeinde', 'Gemeinde'], ['bundesland', 'Bundesland'], ['deutschland', 'Deutschland'], ['eu', 'EU'],
  ], 'eu', 'Genau. Die EU hängt mit den anderen im Mittel am schwächsten zusammen (0,330), besonders mit der Gemeinde (0,190). Wer sich mit seinem Ort verbunden fühlt, fühlt sich nicht unbedingt mit Europa verbunden.',
  'Vergleich die mittlere Korrelation jeder Ebene mit den anderen drei.', {
    special: [{ match: 'gemeinde', text: 'Fast: Die Gemeinde hängt mit der EU kaum zusammen (0,190), mit dem Bundesland aber eng (0,568). Im Mittel ist die EU noch schwächer verbunden (0,330 gegen 0,366).' }],
  }),
  g2b: number('g2b-frage', 'Angenommen, es gäbe acht statt vier Fragen zur Verbundenheit, mit derselben mittleren Korrelation 0,404. Wie groß wäre α?', 0.844,
    '0,844. Die Items hängen nicht enger zusammen als vorher, aber es sind doppelt so viele. Darum steigt α von 0,731 auf 0,844.',
    'Setz k = 8 und r̄ = 0,404 in die Formel oder in den Rechner ein.', {
      tolerance: 0.005, short: 'α mit acht Fragen', help: 'Probier es im α-Rechner. Drei Nachkommastellen, zum Beispiel 0,123.',
      special: [{ match: 0.731, tolerance: 0.005, text: 'Das ist α für vier Items. Stell k auf 8.' }],
    }),
  g2c: choice('g2c-frage', 'Ohne welches Item würde α steigen?', [
    ['pn12', 'pn12 Gemeinde'], ['pn13', 'pn13 Bundesland'], ['pn16', 'pn16 Deutschland'], ['pn17', 'pn17 EU'],
  ], 'pn17', 'Genau: Ohne die EU läge α bei 0,733, mit ihr bei 0,726. Das ist nur ein kleiner Gewinn. Ob die EU in den Index gehört, ist eine inhaltliche Frage: Willst du Verbundenheit mit Deutschland und seinen Regionen messen oder räumliche Verbundenheit überhaupt?',
  'Vergleich jede Zahl in „Alpha if Deleted“ mit α = 0,726. Nur eine ist größer.', {
    special: [{ match: 'pn12', text: 'Ohne die Gemeinde fiele α auf 0,700. Such in „Alpha if Deleted“ die Zahl, die größer ist als 0,726.' }],
  }),
  g3a: number('g3a-frage', 'Auf einer Skala von 1 bis 7: Welche Zahl wird beim Umpolen aus einer 2?', 6,
    '6: 1 + 7 = 8, und 8 − 2 = 6. Aus 1 wird 7, aus 4 bleibt 4: Die Mitte bleibt in der Mitte.', '1 + 7 = 8, dann 8 minus 2.', {
      short: 'umgepolte 2', help: 'Kleinster plus größter Code, minus alter Wert.',
      special: [{ match: 5, text: 'Das wäre 7 − 2. Rechne mit kleinster plus größter Code: 1 + 7 = 8, dann 8 − 2.' }],
    }),
  g3b: choice('g3b-frage', 'Welche Items musst du umpolen, damit alle in dieselbe Richtung zeigen?', [
    ['fr03b-fr04b', 'fr03b und fr04b'], ['fr07-fr08', 'fr07 und fr08'], ['fr07-fr03b', 'fr07 und fr03b'], ['alle', 'alle vier'],
  ], 'fr03b-fr04b', 'Genau. Dann heißt eine kleine Zahl bei allen vier: gleichberechtigt. Auch umgekehrt ginge es: fr07 und fr08 umpolen. α ist in beiden Fällen 0,696; es dreht sich nur, wofür eine hohe Zahl steht.',
  'Pol nur die um, die andersherum gefragt sind.', {
    alsoRight: [{ value: 'fr07-fr08', text: 'Auch richtig. Dann heißt eine kleine Zahl bei allen vier: traditionell. α ist 0,696, genau wie beim Umpolen von fr03b und fr04b.' }],
    special: [
      { match: 'alle', text: 'Wenn du alle umpolst, zeigen sie wieder genauso gegeneinander wie vorher: α bleibt −0,210. Pol nur die um, die andersherum gefragt sind.' },
      { match: 'fr07-fr03b', text: 'Dann zeigen fr07 und fr04b in die eine Richtung, fr08 und fr03b in die andere. Probier es im Labor: α wird −1,610.' },
    ],
  }),
  g4b: choice('g4b-frage', 'Eine Person setzt „Ruhe und Ordnung“ auf Platz 1 und „freie Meinungsäußerung“ auf Platz 2. Welcher Typ ist sie?', [
    ['mat', 'Materialist'], ['mat-misch', 'materialistischer Mischtyp'], ['post-misch', 'postmaterialistischer Mischtyp'], ['post', 'Postmaterialist'],
  ], 'mat-misch', 'Genau: Platz 1 materialistisch, Platz 2 postmaterialistisch. Das ist mit 35,68 % der häufigste Typ.',
  'Schau nur auf Platz 1 und 2: Ruhe und Ordnung ist materialistisch (M), freie Meinungsäußerung postmaterialistisch (P). M vor P heißt materialistischer Mischtyp.'),
};

/* ---------- Erst festlegen ---------- */

export const PREDICTIONS: Record<'a1' | 'a2' | 'a3' | 'a4', { id: string; prompt: string; options: string[] }> = {
  a1: { id: 'a1', prompt: 'Wo liegt der Mittelwert des Populismus-Index ungefähr?', options: ['unter 3: im Mittel eher Zustimmung', 'um 3: im Mittel teils/teils', 'über 3: im Mittel eher Ablehnung'] },
  a2: { id: 'a2', prompt: 'Welche Aussage passt wohl am wenigsten zu den anderen?', options: PA_SHORT.map(([, l]) => l) },
  a3: { id: 'a3', prompt: 'Welche zwei Aussagen sind andersherum gestellt als die übrigen vier?', options: MM_PAIRS.map(([, l]) => l) },
  a4: { id: 'a4', prompt: 'Wie viele stimmen allen drei Aussagen zu, verglichen mit denen, die ihnen im Schnitt zustimmen?', options: ['etwa gleich viele', 'deutlich weniger', 'mehr'] },
};

/* ---------- Hilfe in drei Stufen ---------- */

/** Stufe 1 Denkanstoß, Stufe 2 Wo schaue ich?, Stufe 3 Lösung; Code in `Backticks`. */
export const HINTS: Record<'a1' | 'a2' | 'a3' | 'a4', [string, string, string]> = {
  a1: [
    'Der Index ist ein Wert je Person: der Mittelwert ihrer gültigen Antworten. Mit `min_valid` bestimmst du, wie viele Antworten jemand mindestens braucht. Personen zählst du ohne Gewicht, den Mittelwert für alle rechnest du mit Gewicht.',
    'In jeder Ausgabe von `describe()` steht eine Zeile `populismus`. N ist die Zahl der Werte, Mean der Mittelwert. Für a1a und a1b nimmst du Schritt 1 (einmal mit 7, einmal mit 5), für a1d Schritt 3. Wofür 1 und 5 stehen, steht in der Einleitung.',
    'Mit `min_valid = 7` bekommen 3.427 Befragte einen Wert, mit `min_valid = 5` sind es 3.595. Der gewichtete Mittelwert ist 2,646 (Median 2,714). Weil 1 „stimme voll zu“ heißt, bedeutet das: Im Mittel stimmen die Befragten eher zu, der Wert liegt zwischen „stimme eher zu“ und „teils/teils“.',
  ],
  a2: [
    'Cronbachs α sagt, wie eng alle sieben Aussagen zusammenhängen. Die Trennschärfe sagt, wie gut eine einzelne Aussage zu den übrigen passt. „Alpha if Deleted“ sagt, wie hoch α ohne diese Aussage wäre.',
    'In Schritt 1 steht α unter „Reliability Statistics“ in der Zeile „Cronbach\'s Alpha“. Unter „Item-Total Statistics“ suchst du in der Spalte „Corrected Item-Total“ die kleinste Zahl. In Schritt 2 steht α nach dem Löschen in der Zeile „Cronbach\'s Alpha =“.',
    'α = 0,833 (Good). Die schwächste Trennschärfe hat pa29 mit 0,348. Ohne pa29 läge α bei 0,842. Ob pa29 bleibt, ist eine inhaltliche Entscheidung: Sie trifft einen Kern des Begriffs, unterscheidet aber kaum, weil fast alle zustimmen. Beides ist vertretbar, wenn du es begründest.',
  ],
  a3: [
    'Lies die sechs Aussagen noch einmal: Wofür spricht bei jeder eine 7? Leg dann beide Ausgaben nebeneinander: Was ist bei α und den Trennschärfen anders, was gleich?',
    'α steht in beiden Ausgaben in der Zeile Cronbach\'s Alpha. Falsch gepolte Aussagen erkennst du in Schritt 1 an einem Minuszeichen in Corrected Item-Total. In Schritt 2 müssen in `reliability()` die Namen mit `_um` stehen, sonst rechnet R wieder mit den alten.',
    'Negative Trennschärfen haben mm02 (−0,373) und mm05 (−0,411). α vorher 0,177. In Schritt 2 heißt die Zeile `reliability(mm01, mm02_um, mm03, mm04, mm05_um, mm06)`; dann ist α 0,840 und alle Trennschärfen sind positiv. Eine hohe Zahl steht jetzt bei allen sechs für mehr Vorbehalte gegenüber Islam und Muslimen. α war vorher so niedrig, weil zwei Aussagen andersherum gepolt waren und gegen die anderen liefen.',
  ],
  a4: [
    '`zustimmungen` zählt, wie vielen Aussagen jemand mit 1 oder 2 zustimmt. `kurz` ist der Mittelwert der drei Antworten. Wer allen zustimmt, hat auch im Schnitt höchstens 2, aber nicht umgekehrt.',
    'Schritt 1: Zeile 3 (allen drei zugestimmt), Spalte Valid %. Schritt 2: Zeile 2, Spalte Cum. %; darin stecken alle Werte bis einschließlich 2.',
    'Allen drei stimmen 14,20 % zu, im Schnitt stimmen 21,71 % zu. 7,5 Prozentpunkte gelten nur nach der Mittelwertlogik als populistisch. Fast alle von ihnen stimmen zwei Aussagen zu, eine davon voll, und sagen bei der dritten „teils/teils“ (7,3 Prozentpunkte); eine echte Ablehnung wird nur selten ausgeglichen (0,2 Prozentpunkte).',
  ],
};

/* ---------- Hilfe bei R-Fehlermeldungen ---------- */

/** Text mit Code-Stücken und Links, ohne JSX. */
export type Rich = (string | { code: string } | { href: string; text: string })[];
export const ERROR_HELP_TITLE = 'Hilfe: R meldet einen Fehler';
export const ERROR_HELP_CAPTION = 'Was R sagt und was du tust';
export const ERROR_HELP: { says: Rich; helps: Rich }[] = [
  { says: [{ code: 'konnte Funktion "%>%" nicht finden' }, ' (Werkstatt: ', { code: 'could not find function "%>%"' }, ')'], helps: ['Den ', { href: '#r1', text: 'Startblock in „R lesen“' }, ' ausführen.'] },
  { says: [{ code: "Objekt 'allbus' nicht gefunden" }], helps: ['Die Zeile mit ', { code: 'read_spss()' }, ' aus dem Startblock ausführen.'] },
  { says: [{ code: "Can't select columns that don't exist. ✖ Column `mm02_um` doesn't exist." }], helps: ['Die umgepolte Variable gibt es nur in der Kette, die sie mit ', { code: 'mutate()' }, ' baut. Lass den ', { code: 'mutate()' }, '-Teil in der Vorlage stehen und führe die ganze Vorlage aus, nicht nur die letzte Zeile.'] },
  { says: [{ code: 'Column `pa3` doesn\'t exist' }], helps: ['Variablenname vertippt. Prüf ihn Zeichen für Zeichen: pa29 bis pa35, mm01 bis mm06 (mit Null).'] },
  { says: [{ code: 'In argument: `p = row_means(pa29, pa30, …)`. … `data` must be a data frame or tibble.' }], helps: ['Die Items gehören in ', { code: 'pick()' }, ': ', { code: 'row_means(pick(pa29, pa30, …), min_valid = 5)' }, '.'] },
  { says: [{ code: 'Caused by error in `pick()`: ! Must only be used inside data-masking verbs like `mutate()` …' }], helps: [{ code: 'row_means(pick(…))' }, ' steht immer in ', { code: 'mutate()' }, ', nicht direkt nach ', { code: '%>%' }, '.'] },
  { says: [{ code: '`min_valid` (8) is greater than the number of items (7). All rows will be "NA".' }, ' (Warnung)'], helps: [{ code: 'min_valid' }, ' darf höchstens so groß sein wie die Zahl der Items in ', { code: 'pick()' }, '.'] },
  { says: [{ code: '`min_valid` must be a positive whole number of items. ✖ Got 0.' }], helps: [{ code: 'min_valid' }, ' ist eine ganze Zahl ab 1, etwa 5.'] },
  { says: [{ code: '`rules` must be a single character string.' }], helps: ['Die Regel steht in Anführungszeichen: ', { code: 'rules = "rev"' }, '.'] },
  { says: [{ code: 'Invalid rule: "reverse". Expected format: "old=new".' }], helps: ['Umpolen heißt genau ', { code: 'rules = "rev"' }, '.'] },
  { says: [{ code: 'Unknown argument `weight` of `describe()`. ℹ Did you mean `weights` instead of `weight`?' }], helps: ['Mit s: ', { code: 'weights = wghtpew' }, '.'] },
  { says: [{ code: '`reliability()` requires at least 2 items.' }], helps: ['In ', { code: 'reliability()' }, ' gehören mindestens zwei Items, durch Kommas getrennt.'] },
  { says: [{ code: 'konnte Funktion "Reliability" nicht finden' }], helps: ['R unterscheidet Groß- und Kleinschreibung: ', { code: 'reliability()' }, ', ', { code: 'row_means()' }, ' klein.'] },
  { says: [{ code: "Warnmeldung: Cronbach's alpha is negative (…) … check the item codings." }], helps: ['Kein Fehler: Items zeigen in verschiedene Richtungen. Andersherum gefragte Items mit ', { code: 'rec(…, rules = "rev")' }, ' umpolen (', { href: '#g3', text: 'Grundlage 3' }, ').'] },
  { says: ['α ändert sich nach dem Umpolen nicht'], helps: ['In ', { code: 'reliability()' }, ' stehen noch die alten Namen. Tausch sie gegen die Namen mit ', { code: '_um' }, '.'] },
];

/* ---------- Prüf dich selbst ---------- */

export const SELF_TEST: { question: string; options: string[]; answer: number; why: string }[] = [
  { question: 'Eine Skala aus 20 Items hat α = 0,92. Was folgt daraus?', options: ['Die Skala misst sicher, was sie messen soll.', 'Die Items hängen zusammen; wie eng, sagt α allein nicht, weil α mit der Zahl der Items steigt.', '92 % der Befragten antworten einheitlich.'], answer: 1, why: 'Bei 20 Items reicht schon eine mittlere Korrelation von 0,2 für ein hohes α. Und ob die Skala das Richtige misst, ist eine Frage der Validität (Grundlage 2b und 2c).' },
  { question: 'Ein Item hat in summary() eine Trennschärfe von −0,35. Was tust du zuerst?', options: ['Item sofort streichen', 'Wortlaut lesen: Ist das Item andersherum gefragt? Dann umpolen.', 'Nichts, negative Werte sind normal'], answer: 1, why: 'Eine negative Trennschärfe heißt fast immer: Das Item zeigt in die andere Richtung. Nach dem Umpolen passt es meist (Grundlage 3, Aufgabe 3).' },
  { question: 'Eine Person hat drei von vier Items beantwortet. Der Index wird mit min_valid = 4 gebildet. Welchen Wert bekommt sie?', options: ['den Mittelwert ihrer drei Antworten', 'keinen Wert (NA)', 'den Mittelwert, wobei die fehlende Antwort als 0 zählt'], answer: 1, why: 'min_valid = 4 verlangt vier gültige Antworten. Mit min_valid = 3 bekäme sie den Mittelwert ihrer drei Antworten; als 0 zählt eine fehlende Antwort nie (Grundlage 1b).' },
  { question: 'Ein Populismus-Index hat bei einer Person den Wert 1,4. Die Items reichen von 1 „stimme voll zu“ bis 5 „lehne ganz ab“. Was heißt das?', options: ['Die Person ist kaum populistisch.', 'Die Person stimmt den Aussagen im Mittel stark zu, ist also eher populistisch.', 'Die Person hat 1,4 Aussagen zugestimmt.'], answer: 1, why: 'Ein niedriger Wert heißt hier Zustimmung. Die Richtung eines Index ergibt sich aus den Items (Aufgabe 1).' },
  { question: 'Befragte sollen vier Ziele in eine Rangfolge bringen. Welcher Index passt?', options: ['ein Mittelwertindex der vier Ränge', 'ein Kombinationsindex, der nach einer Regel aus den ersten Plätzen einen Typ bildet', 'Cronbachs α der vier Ränge'], answer: 1, why: 'Der Mittelwert von vier Rängen ist bei allen 2,5. Ein Kombinationsindex wie der Inglehart-Index nutzt die Reihenfolge (Grundlage 4b).' },
];

/* ---------- Skript zum Mitnehmen ---------- */

export const SCRIPT_FILE = 'sitzung8.R';
export const SCRIPT_PARTS = ['start', 'r_rev', 'r_rowmeans', 'r_reliability', 'a1', 'a1w', 'a2', 'a2ohne', 'a3', 'a3um', 'a4'];
/** Skript sitzung8.R: alle Vorlagen ohne Probier-Werkstätten, Marken stehen mit ihrem Beispielwert. */
export const SCRIPT = '# Sitzung 8: Index und Skala\n# Statistikatlas, Methoden Ib, ALLBUS 2023 (ZA8831 v1.3.0)\n# Markierte Stellen aus dem Atlas stehen hier mit ihrem Beispielwert.\n'
  + '# In Aufgabe 3 (a3um) musst du mm02 und mm05 in reliability() noch gegen mm02_um und mm05_um tauschen.\n\n'
  + SCRIPT_PARTS.map(k => `# ---- ${TEMPLATES[k].title} ----\n${parseMarks(TEMPLATES[k].code).code}\n`).join('\n');
