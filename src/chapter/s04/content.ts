// Sitzung 4 „Daten sehen“: Zahlen, Vorlagen und Fragen aus prototyp/sitzung4.html (v11), nur Daten.
// Alle Zahlen: ALLBUS 2023, ZA8831 v1.3.0, ungewichtet, nur Aggregate. Geprüft in allbus.local.test.ts.
import type { Question } from '../answers';
import { parseMarks } from '../workshop/editor';

/* ---------- Daten ---------- */

/** Lebenszufriedenheit ls01, Häufigkeiten der Antworten 0 bis 10 (n = 5.164, 82 fehlend). */
export const LS01 = [26, 29, 81, 120, 174, 413, 416, 998, 1506, 868, 533];
export const LS01_N = 5164;
export const LS01_MISSING = 82;

export type Form = {
  id: string; name: string; question: string; scale: string;
  values: number[]; counts: number[]; recognize: string; means: string;
};
/** Grundlage 2: vier Formen von Verteilungen. */
export const FORMS: Form[] = [
  { id: 'mp05', name: 'Ungefähr symmetrisch', question: '„Ausländer stützen die Rentensicherung“', scale: '1 = stimme gar nicht zu … 7 = stimme voll und ganz zu', values: [1, 2, 3, 4, 5, 6, 7], counts: [443, 420, 454, 792, 601, 427, 420], recognize: 'Modus in der Mitte, beide Seiten ähnlich hoch.', means: 'Die Meinungen streuen breit, die Mitte ist am häufigsten.' },
  { id: 'ls01', name: 'Linksschief', question: 'Lebenszufriedenheit', scale: '0 = ganz unzufrieden … 10 = ganz zufrieden', values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], counts: LS01, recognize: 'Modus rechts, nach links flach auslaufend.', means: 'Die meisten sind zufrieden. Wenige sehr Unzufriedene ziehen den Mittelwert unter den Median.' },
  { id: 'dk11', name: 'Rechtsschief', question: 'Kinder im Haushalt', scale: 'Anzahl, 0 bis 7', values: [0, 1, 2, 3, 4, 5, 6, 7], counts: [3602, 724, 571, 146, 18, 7, 4, 2], recognize: 'Modus ganz links, nach rechts lang auslaufend.', means: 'Bei 71 % der Befragten lebt kein Kind im Haushalt. Wenige große Familien ziehen den Mittelwert über den Median.' },
  { id: 'vm18', name: 'Mehrgipflig', question: 'Bewertung der Leihmutterschaft', scale: '−3 sehr falsch … +3 sehr richtig', values: [-3, -2, -1, 0, 1, 2, 3], counts: [835, 359, 275, 664, 291, 254, 352], recognize: 'Mehrgipflig: hohe Balken bei −3 und bei 0, ein kleinerer bei +3.', means: 'Die Befragten sind gespalten. Mittelwert und Median liegen in der Mitte, wo vergleichsweise wenige stehen.' },
];

/** Alter age, Häufigkeiten für 18 bis 99 Jahre (n = 5.223). */
export const AGE_FROM = 18;
export const AGE = [41, 57, 54, 44, 61, 60, 56, 51, 57, 62, 60, 91, 70, 73, 67, 89, 74, 88, 90, 77, 84, 87, 77, 70, 90, 74, 80, 63, 69, 80, 45, 70, 70, 82, 95, 97, 111, 101, 98, 108, 99, 138, 117, 99, 107, 97, 102, 95, 98, 94, 82, 87, 88, 87, 81, 74, 65, 66, 59, 45, 44, 53, 36, 49, 39, 55, 51, 24, 24, 17, 22, 11, 15, 7, 12, 4, 4, 0, 0, 2, 0, 1];

/** Arbeitsstunden pro Woche dw15, Häufigkeiten für 0 bis 90 Stunden (n = 2.945). */
export const DW15 = [4, 0, 3, 1, 1, 5, 0, 3, 1, 2, 20, 3, 13, 2, 5, 18, 11, 6, 13, 14, 115, 11, 9, 7, 18, 73, 16, 9, 28, 7, 205, 10, 64, 10, 19, 153, 33, 83, 176, 211, 759, 79, 109, 42, 27, 179, 14, 6, 30, 3, 174, 0, 4, 1, 6, 35, 1, 0, 1, 0, 56, 0, 0, 1, 0, 15, 0, 0, 0, 0, 14, 0, 0, 1, 0, 2, 0, 0, 0, 0, 2, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1];

/** Aufgabe 1: Gesundheitszustand hs01. */
export const HS01 = {
  values: [1, 2, 3, 4, 5],
  labels: ['sehr gut', 'gut', 'zufriedenstellend', 'weniger gut', 'schlecht'],
  counts: [864, 2071, 1470, 616, 188],
  valid: 5209,
  missing: 37,
  missingParts: { dataError: 5, noAnswer: 32 },
};

/** Aufgabe 3 und 4: Bearbeitungsdauer xt10 in Minuten; mode: 2 = CAPI, 3 = CAWI, 4 = MAIL. */
export const XT10 = {
  n: 5026,
  missing: 220,
  median: 65,
  min: 8,
  max: 61895,
  range: 61887,
  over180: 497,
  upTo180: 4529,
  /** Bei binwidth = 1 (nur bis 180 Minuten): Bögen mit genau 60 und 59 Minuten. */
  at60: 216,
  at59: 38,
  byMode: {
    MAIL: { code: 4, label: 'Papier', n: 1436, median: 75, nUpTo180: 1130, medianUpTo180: 60, missing: 220, multiplesOf5: 71.5 },
    CAPI: { code: 2, label: 'Interview', n: 2003, median: 70, nUpTo180: 1989, medianUpTo180: 70, missing: 0, multiplesOf5: 39.5 },
    CAWI: { code: 3, label: 'online', n: 1587, median: 49, nUpTo180: 1410, medianUpTo180: 45, missing: 0, multiplesOf5: 20.0 },
  },
};

export type AgeBox = { group: 'West' | 'Ost'; n: number; lo: number; q1: number; median: number; q3: number; hi: number };
/** Grundlage 1c (Achse) und „Echter Boxplot“: West (eastwest = 1) und Ost (eastwest = 2). */
export const WEST_EAST: { ls01: { west: { mean: number; n: number }; east: { mean: number; n: number } }; age: [AgeBox, AgeBox] } = {
  ls01: { west: { mean: 7.4387, n: 3510 }, east: { mean: 7.1790, n: 1654 } },
  age: [
    { group: 'West', n: 3553, lo: 18, q1: 36, median: 53, q3: 66, hi: 97 },
    { group: 'Ost', n: 1670, lo: 18, q1: 39, median: 56, q3: 68, hi: 99 },
  ],
};

/* ---------- A2 Rätselkasten ---------- */

export type RiddleVar = 'dw15' | 'pa01' | 'pa02a' | 'vm20' | 'pt03';
/** Vier Bilder; Häufigkeiten der gültigen Codes von links nach rechts (dw15: 0 bis 90 Stunden). */
export const RIDDLE: Record<'A' | 'B' | 'C' | 'D', { counts: number[]; answer: RiddleVar }> = {
  A: { counts: [377, 242, 199, 594, 461, 539, 747], answer: 'vm20' },
  B: { counts: DW15, answer: 'dw15' },
  C: { counts: [527, 1542, 2303, 663, 190], answer: 'pa02a' },
  D: { counts: [186, 250, 751, 672, 1381, 1001, 407, 227, 65, 57], answer: 'pa01' },
};
export const RIDDLE_NAMES: Record<RiddleVar, string> = { dw15: 'Arbeitsstunden', pa01: 'Links-rechts', pa02a: 'Politisches Interesse', vm20: 'Sterbehilfe', pt03: 'Vertrauen Bundestag' };
export const RIDDLE_FEATURES: Record<'A' | 'B' | 'C' | 'D', string> = {
  A: 'sieben Ausprägungen, Modus ganz rechts',
  B: 'viele Werte, der Balken bei 40 ragt weit heraus, Spitzen bei runden Zahlen',
  C: 'fünf Ausprägungen, Modus in der Mitte',
  D: 'zehn Ausprägungen, Modus bei 5',
};
/** Textfassung von Bild B (die anderen Bilder beschreibt der Prototyp über relative Höhen aus den Zahlen). */
export const RIDDLE_B_TEXT = 'viele schmale Balken von 0 bis 90, Achse in Zehnerschritten. Bei 40 steht mit Abstand der höchste Balken (Höhe 10). Deutlich niedriger, etwa Höhe 3: bei 30 und 39; etwa Höhe 2: bei 20, 35, 38, 45 und 50. Dazwischen fast nichts.';
export const RIDDLE_ALL_RIGHT = 'Alle vier richtig. Übrig bleibt das Vertrauen in den Bundestag: sieben Ausprägungen, Modus in der Mitte.';

/* ---------- Codevorlagen ---------- */

export type Template = { title: string; code: string; tryOut?: boolean };
/** ⟦…⟧ markiert Stellen, die angepasst werden. */
export const TEMPLATES: Record<string, Template> = {
  start: { title: 'Startblock', code: `# Pakete laden und Daten einlesen
library(tidyverse)
library(mariposa)

allbus <- read_spss("ZA8831_v1-3-0.sav")` },
  schichten: { title: 'Vorlage: Balkendiagramm', code: `# Balkendiagramm der Lebenszufriedenheit
allbus %>%
  drop_na(ls01) %>%
  ggplot(aes(x = ls01)) +
  geom_bar() +
  labs(
    title = "Lebenszufriedenheit",
    caption = "ALLBUS 2023, n = 5.164, ungewichtet"
  )` },
  a1v: { title: 'Vorlage 1: Gesundheit, mit fehlenden Werten', code: `# Verteilung der Gesundheit mit Wörtern auf der Achse
allbus %>%
  to_label(hs01) %>%
  ggplot(aes(x = hs01)) +
  geom_bar()` },
  a1n: { title: 'Vorlage 2: ohne fehlende Werte, beschriftet', code: `# Fehlende Werte weglassen und beschriften
allbus %>%
  to_label(hs01) %>%
  drop_na(hs01) %>%
  ggplot(aes(x = hs01)) +
  geom_bar() +
  labs(
    title = "⟦Titel⟧",
    caption = "ALLBUS 2023, n = ⟦Zahl⟧, ungewichtet"
  )` },
  a2: { title: 'Vorlage: eine Verteilung prüfen', code: `# Eine Verteilung als Balken zeigen
allbus %>%
  drop_na(⟦pa01⟧) %>%
  ggplot(aes(x = ⟦pa01⟧)) +
  geom_bar()` },
  a3d: { title: 'Kennzahlen der Bearbeitungsdauer', code: `# Kennzahlen der Bearbeitungsdauer in Minuten
allbus %>%
  describe(xt10)` },
  a3o: { title: 'Histogramm ohne Angaben', code: `# Histogramm ohne weitere Angaben
allbus %>%
  ggplot(aes(x = xt10)) +
  geom_histogram()` },
  a3m: { title: 'Histogramm mit Ausschnitt und Klassenbreite', code: `# Nur Fälle bis 180 Minuten, Klassen von 5 Minuten
allbus %>%
  filter(xt10 <= 180) %>%
  ggplot(aes(x = xt10)) +
  geom_histogram(binwidth = ⟦5⟧, boundary = 0)` },
  a3n: { title: 'Kennzahlen nach dem Ausschnitt', code: `# Kennzahlen nur für Fälle bis 180 Minuten
allbus %>%
  filter(xt10 <= 180) %>%
  describe(xt10)` },
  a4: { title: 'Boxplots, hineingezoomt (alle Fälle zählen)', code: `# Dauer nach Erhebungsweg, Blick auf 0 bis 180 Minuten
allbus %>%
  to_label(mode) %>%
  ggplot(aes(x = mode, y = xt10)) +
  geom_boxplot() +
  coord_cartesian(ylim = c(0, ⟦180⟧))` },
  a4f: { title: 'Boxplots, abgeschnitten (nur Fälle bis 180 Minuten)', code: `# Dauer nach Erhebungsweg, lange Fälle vorher entfernt
allbus %>%
  filter(xt10 <= 180) %>%
  to_label(mode) %>%
  ggplot(aes(x = mode, y = xt10)) +
  geom_boxplot()` },
  a4z: { title: 'Zahlen für einen Erhebungsweg, alle Fälle', code: `# Median, Quartile und N für einen Erhebungsweg
allbus %>%
  filter(mode == ⟦4⟧) %>%
  describe(xt10, show = c("median", "quantiles"))` },
  frei_a1: { tryOut: true, title: 'Deine Probier-Werkstatt', code: `# Eine Idee: Gesundheit nur bei Menschen ab 65 Jahren
allbus %>%
  filter(age >= 65) %>%
  frequency(hs01)
` },
  frei_a2: { tryOut: true, title: 'Deine Probier-Werkstatt', code: `# Eine Idee: die Frage, die übrig geblieben ist
allbus %>%
  drop_na(pt03) %>%
  ggplot(aes(x = pt03)) +
  geom_bar()
` },
  frei_a3: { tryOut: true, title: 'Deine Probier-Werkstatt', code: `# Eine Idee: Fälle, die länger als einen Tag (1440 Minuten) dauerten
allbus %>%
  filter(xt10 > 1440) %>%
  frequency(mode)
` },
  frei_a4: { tryOut: true, title: 'Deine Probier-Werkstatt', code: `# Eine Idee: Alter nach Erhebungsweg
allbus %>%
  to_label(mode) %>%
  ggplot(aes(x = mode, y = age)) +
  geom_boxplot()
` },
  a4zf: { title: 'Zahlen für einen Erhebungsweg, nur bis 180 Minuten', code: `# Dieselben Zahlen, aber nur für Fälle bis 180 Minuten
allbus %>%
  filter(mode == ⟦4⟧, xt10 <= 180) %>%
  describe(xt10, show = c("median", "quantiles"))` },
};

/* ---------- Antworten prüfen ---------- */

/** `short`: Name in der Rückmeldezeile (wie im Prototyp in `pruefe(...)`); `help`: Hilfezeile unter dem Feld, Code in `Backticks`. */
type Extra = { short?: string; help?: string };
const choice = (id: string, label: string, options: [string, string][], target: string, right: string, hint: string, extra: Extra = {}): Question =>
  ({ id, label, kind: 'choice', options: options.map(([value, l]) => ({ value, label: l })), target, right, hint, ...extra });
const number = (id: string, label: string, target: number, right: string, hint: string, extra: Extra & { tolerance?: number } = {}): Question =>
  ({ id, label, kind: 'number', target, right, hint, ...extra });

/** Fragen am Ende von Aufgabe 1, 3 und 4 (Aufgabe 2 hat den Rätselkasten). Ids wie die Felder im Prototyp. */
export const QUESTIONS: Record<'a1' | 'a3' | 'a4', Question[]> = {
  a1: [
    choice('a1a', 'Was steht unter dem Balken ganz rechts in der ersten Grafik?', [['schlecht', 'SCHLECHT'], ['na', 'NA'], ['sehrgut', 'SEHR GUT']], 'na',
      'NA, Personen ohne gültige Antwort.', 'Schau auf die Beschriftung ganz rechts: Bei Wörtern auf der Achse zeigt ggplot fehlende Werte als eigenen Balken „NA“.', { short: 'Balken ganz rechts' }),
    number('a1b', 'Wie viele Personen stecken im NA-Balken?', 37,
      '37 (5 Datenfehler, 32 keine Angabe).', 'In frequency(hs01) steht die Zahl in der Zeile „Total missing“.', { short: 'Personen im NA-Balken', help: 'Tipp: `allbus %>% frequency(hs01)`, Zeile „Total missing“.' }),
    number('a1c', 'Welche Zahl gehört nach `n =` in deine Bildunterschrift?', 5209,
      '5.209 gültige Antworten.', 'Gemeint sind alle, die nach drop_na() übrig bleiben: „Total valid“ in frequency(hs01).', { short: 'n für die Bildunterschrift' }),
    choice('a1d', 'Welche Antwort ist am häufigsten?', [['sehr gut', 'sehr gut'], ['gut', 'gut'], ['zufriedenstellend', 'zufriedenstellend']], 'gut',
      '„gut“ mit 2.071 Personen, das sind 40 %.', 'Der höchste Balken steht über „GUT“. Achtung: 1 heißt hier „sehr gut“, ohne to_label() würdest du nur Zahlen sehen.', { short: 'häufigste Antwort' }),
  ],
  a3: [
    number('a3a', 'Median der Bearbeitungsdauer in Minuten (alle Befragten):', 65,
      '65 Minuten. R schreibt 65.000 – der Punkt ist dort ein Komma.', 'Lies in describe(xt10) die Spalte Median. Achtung: R schreibt 65.000, gemeint ist 65.', { short: 'Median', help: 'R schreibt Kommazahlen mit Punkt: 65.000 heißt 65.' }),
    choice('a3b', 'Warum zeigt das Histogramm ohne Angaben fast nur eine Säule?', [['fehler', 'R hat einen Fehler gemacht'], ['max', 'Einzelne Fälle dauerten wochenlang, die Achse reicht bis über 60.000 Minuten'], ['gleich', 'Alle haben gleich lange gebraucht']], 'max',
      'Die ⟪Spannweite⟫ (Range) beträgt 61.887 Minuten, gut sechs Wochen zwischen kürzestem und längstem Fall. Solche ⟪Ausreißer⟫ dehnen die Achse, alle anderen landen in der ersten Klasse.', 'R rechnet richtig. Schau in describe(xt10) auf Range: Die Achse muss bis zum größten Wert reichen.', { short: 'Histogramm mit einer Säule' }),
    number('a3c', 'Wie viele Fälle bleiben mit `filter(xt10 <= 180)` übrig?', 4529,
      '4.529 von 5.026 Fällen; das ist die neue ⟪Fallzahl⟫ n.', 'Führe allbus %>% filter(xt10 <= 180) %>% describe(xt10) aus und lies N.', { short: 'übrige Fälle', help: 'Aus der Vorlage in Schritt 3, Spalte N.' }),
    choice('a3d', 'Bei `binwidth = 1`: Bei welcher Minutenzahl steht die höchste Säule im Histogramm?', [['45', 'bei 45 Minuten'], ['60', 'bei 60 Minuten'], ['150', 'bei 150 Minuten']], '60',
      'Bei 60 Minuten stehen 216 Fälle, bei 59 nur 38: Wer die Dauer schätzt, rundet auf volle Stunden. So entstehen ⟪Rundungsspitzen⟫.', 'Stell binwidth = 1 ein und such die höchste Säule im Histogramm. Achte auf runde Zahlen.', { short: 'Spitze' }),
    choice('a3e', 'Was passiert mit diesen Spitzen bei `binwidth = 30`?', [['weg', 'Sie verschwinden in breiten Klassen'], ['hoeher', 'Sie werden noch deutlicher']], 'weg',
      'In Klassen von 30 Minuten fallen die Rundungsspitzen mit ihren Nachbarn zusammen und verschwinden.', 'Probier binwidth = 30 aus und vergleiche.', { short: 'breite Klassen' }),
  ],
  a4: [
    choice('a4a', 'Hineinzoomen (alle Fälle): Welcher Erhebungsweg hat den höchsten Median?', [['CAPI', 'CAPI'], ['CAWI', 'CAWI'], ['MAIL', 'MAIL']], 'MAIL',
      'Papier (MAIL) mit 75 Minuten, dann Interview 70 und online 49.', 'Schau auf die Medianlinie in der Box im ersten Bild (coord_cartesian) oder nimm die Vorlage „alle Fälle“ für jeden Erhebungsweg.', { short: 'Hineinzoomen' }),
    choice('a4b', 'Abschneiden mit `filter()`: Welcher Erhebungsweg hat jetzt den höchsten Median?', [['CAPI', 'CAPI'], ['CAWI', 'CAWI'], ['MAIL', 'MAIL']], 'CAPI',
      'Jetzt liegt das Interview vorn (70), Papier fällt auf 60.', 'Schau ins zweite Bild (filter) oder nimm die Vorlage „nur bis 180 Minuten“.', { short: 'Abschneiden' }),
    number('a4c', 'Wie viele Papierbögen (MAIL) fallen durch den Filter heraus?', 306,
      '1.436 minus 1.130 sind 306 Fälle, gut jeder fünfte Papierbogen.', 'Lies N für mode == 4 einmal ohne (1.436) und einmal mit Filter und zieh ab.', { short: 'herausgefallene Papierbögen', help: 'Vergleiche N für `mode == 4` ohne und mit Filter.' }),
    choice('a4d', 'Warum dreht sich die Reihenfolge?', [['lang', 'Der Filter wirft vor allem lange Papierbögen hinaus, aber kaum Interviews'], ['falsch', 'R rechnet beim Filtern falsch'], ['zoom', 'Beim Hineinzoomen werden die Werte verändert']], 'lang',
      'Der Filter wirft 306 Papierbögen hinaus, aber nur 14 Interviews. Übrig bleiben vor allem die schnellen Papierbögen.', 'R rechnet richtig, und Hineinzoomen ändert keine Werte. Zähl je Erhebungsweg, wie viele Fälle herausfallen.', { short: 'Reihenfolge' }),
    choice('a4e', 'Was gehört in deinen Bericht?', [['capi', '„Das Interview dauert am längsten.“'], ['ehrlich', '„Mit allen Fällen dauert Papier am längsten. Die Papier-Dauer ist aber oft geschätzt, und bei 220 Papierbögen fehlt sie ganz.“']], 'ehrlich',
      'Genau: alle Fälle zeigen und sagen, was die Zahlen einschränkt. Wer die langen Fälle wegfiltert, bekommt ein ⟪verzerrtes|verzerrung⟫ Bild: Papier sieht schneller aus, als es ist.', 'Diese Aussage stimmt nur, wenn man vorher die langen Papierbögen hinauswirft. Ein Bericht sagt, wer im Bild fehlt.', { short: 'Bericht' }),
  ],
};

/** Pflichtaufgaben: Aufgabe 1 und Aufgabe 4. */
export const REQUIRED: Question[] = [...QUESTIONS.a1, ...QUESTIONS.a4];

const AXIS_FEEDBACK = 'Bei einem ⟪Balkendiagramm⟫ liest das Auge die Länge. Ab 0 ist „gut“ (2.071) 2,4-mal so lang wie „sehr gut“ (864). Ab 500 wäre er 4,3-mal so lang, und „schlecht“ (188) verschwände ganz unter der Achse. Die Zahlen bleiben gleich, aber das Bild sagt etwas anderes.';
/** Aufgabe 1, Schritt 4: Kurz überlegen zur y-Achse (gleiche Begründung bei jeder Wahl). */
export const A1_AXIS: Question = choice('a1-achse',
  'Eine Kollegin schlägt vor, die y-Achse deiner Grafik erst bei 500 beginnen zu lassen, damit man die Unterschiede besser sieht. Was antwortest du?',
  [['gut', 'Gute Idee, dann sieht man mehr'], ['null', 'Lieber nicht, Balken beginnen bei 0'], ['egal', 'Egal, die Zahlen bleiben ja gleich']],
  'null', AXIS_FEEDBACK, AXIS_FEEDBACK);

/** Grundlage 4: Kurz überlegen zur Kurzarbeit null (die 22 Stunden werden zu 0); die Antwort verändert das Bild. */
export const V4_Q: Question = choice('v4-frage',
  'Kurz überlegen: Die Person mit 22 Stunden ist ab nächster Woche in Kurzarbeit null, sie arbeitet 0 Stunden. Was passiert mit Mittelwert und Median?',
  [['a', 'beide sinken'], ['b', 'nur der Mittelwert sinkt'], ['c', 'nur der Median sinkt'], ['d', 'nichts ändert sich']],
  'b', 'Das Bild zeigt es: Das Dreieck rutscht von 37,4 auf 35,4, der Median-Strich bleibt bei 40.',
  'Nur der Mittelwert sinkt: von 37,4 auf 35,4. Der Median bleibt bei 40, weil die mittlere Person dieselbe bleibt.');

/** Grundlage 4: Kurz überlegen, wenn 44 und 45 Stunden wegfallen. */
export const V4_Q2: Question = choice('v4-frage2',
  'Kurz überlegen: Die zwei Personen mit 44 und 45 Stunden fallen aus der Auswertung. Wo liegt jetzt der Median?',
  [['40', 'weiter bei 40 Stunden'], ['38', 'bei 38 Stunden'], ['43', 'bei 43 Stunden']],
  '38', 'Von neun Personen steht die fünfte in der Mitte: 38 Stunden.',
  'Es fallen Werte am oberen Ende weg, die Mitte rutscht also nach unten: Von neun Personen arbeitet die fünfte 38 Stunden.');
/** Rückmeldung je falscher Wahl bei V4_Q2 (der Prototyp unterscheidet 40 von 43). */
export const V4_Q2_WRONG: Record<'40' | '43', string> = {
  '40': 'Die 40 war die Mitte von elf Personen. Ohne 44 und 45 bleiben neun, und die fünfte arbeitet 38 Stunden.',
  '43': 'Es fallen Werte am oberen Ende weg, die Mitte rutscht also nach unten: Von neun Personen arbeitet die fünfte 38 Stunden.',
};

/** Grundlage 1: Kurz überlegen zum Anteil der 7 (Toleranz wie im Prototyp: 19,3 ± 0,8). */
export const V2_Q: Question = number('v2-frage', 'Wie viel Prozent der gültigen Antworten sind eine 7?', 19.3,
  '998 geteilt durch 5.164 ergibt 19,3 %.', 'Teil die absolute Häufigkeit der 7 durch alle gültigen Antworten: 998 / 5.164. Mal 100 ergibt Prozent.',
  { tolerance: 0.8, short: 'Anteil der 7', help: '998 Befragte haben 7 angegeben. Eine Kommazahl reicht, zum Beispiel 12,5.' });

const INCOME_FEEDBACK = 'Beim Einkommen liegen die meisten im unteren Bereich, wenige sehr hohe Einkommen bilden einen langen Auslauf nach rechts: rechtsschief. Der Mittelwert liegt deshalb über dem Median – darum berichtet man beim Einkommen meist den Median.';
/** Grundlage 2: Kurz überlegen zur Form beim Einkommen (gleiche Begründung bei jeder Wahl). */
export const V3_Q: Question = choice('v3-frage',
  'Kurz überlegen: Beim Einkommen verdienen wenige Menschen sehr viel. Welche Form erwartest du?',
  [['links', 'linksschief'], ['sym', 'symmetrisch'], ['rechts', 'rechtsschief']],
  'rechts', INCOME_FEEDBACK, INCOME_FEEDBACK, { short: 'Form beim Einkommen' });

/* ---------- Erst festlegen ---------- */

/** „Erst festlegen:“ vor Aufgabe 1, 3 und 4. Ohne `options` ist es ein Textfeld (Zahl). */
export const PREDICTIONS: Record<'a1' | 'a3' | 'a4', { id: string; prompt: string; options?: string[] }> = {
  a1: { id: 'a1', prompt: 'Welche Antwort wird wohl am häufigsten gegeben?', options: ['sehr gut', 'gut', 'zufriedenstellend', 'weniger gut', 'schlecht'] },
  a3: { id: 'a3', prompt: 'Wie viele Minuten braucht die Hälfte der Befragten höchstens?' },
  a4: { id: 'a4', prompt: 'Bei welchem Erhebungsweg dauert es am längsten?', options: ['Interview (CAPI)', 'online (CAWI)', 'Papier (MAIL)'] },
};

/* ---------- Hilfe in drei Stufen ---------- */

/** Stufe 1 Denkanstoß, Stufe 2 Wo schaue ich?, Stufe 3 Lösung; Code in `Backticks`. */
export const HINTS: Record<'a1' | 'a2' | 'a3' | 'a4', [string, string, string]> = {
  a1: [
    'Schau dir jeden Balken der ersten Grafik an: Steht einer für Personen ohne gültige Antwort? `drop_na(hs01)` lässt genau diese Personen weg. Die Zahl für die Bildunterschrift sind alle, die übrig bleiben.',
    'Führe `allbus %>% frequency(hs01)` aus. Die Zeile „Total missing“ zählt den NA-Balken, „Total valid“ ist dein n. Den häufigsten Wert erkennst du an der größten Zahl in der Spalte N.',
    'Im NA-Balken stecken 37 Personen, übrig bleiben 5.209. Am häufigsten ist „gut“ (2.071 Personen, 40 %). In der zweiten Vorlage ersetzt du den Titel durch `"Gesundheitszustand"` und n durch `5.209`.',
  ],
  a2: [
    'Zähl zuerst die Balken. Fünf ⟪Ausprägungen⟫ hat nur eine der Fragen. Viele schmale Balken, einer davon ragt weit heraus: Das deutet auf eine offene Zahlenangabe, bei der Menschen runden.',
    'Zähl die Balken von A bis D und vergleiche mit den Fragen in der Liste: fünf Ausprägungen hat `pa02a`, zehn `pa01`, sieben `vm20` und `pt03`, viele Werte `dw15`. Bei den beiden mit sieben Ausprägungen entscheidet die Lage des ⟪Modus⟫.',
    'A: Sterbehilfe (sieben Ausprägungen, Modus ganz rechts). B: Arbeitsstunden (viele Werte, der Balken bei 40 ragt weit heraus, Spitzen bei runden Zahlen). C: Politisches Interesse (fünf Ausprägungen, Modus bei „mittel“). D: Links-rechts (zehn Ausprägungen, Modus bei 5). Übrig bleibt das Vertrauen in den Bundestag. Hinter der Zahl der Ausprägungen steckt das ⟪Skalenniveau⟫: Die Arbeitsstunden sind ⟪metrisch⟫, die anderen Fragen haben ⟪geordnete Kategorien|ordinal⟫.',
  ],
  a3: [
    'Ein Histogramm reicht vom kleinsten bis zum größten Wert. Was passiert mit den übrigen Säulen, wenn ein einziger Wert sehr weit draußen liegt? Und überleg: Wie schreibt man eine Dauer auf, die man nur schätzt?',
    'Median und Spannweite (Range) stehen in der Ausgabe von Schritt 1. Die Zahl der Fälle nach dem Ausschnitt steht in Schritt 3 in der Spalte N. Die Spitzen siehst du in Schritt 4 mit `binwidth = 1`.',
    'Median 65 Minuten, Range 61.887 Minuten, also gut sechs Wochen (vermutlich unterbrochene Fragebögen, also ⟪Ausreißer⟫). Mit dem Filter bleiben 4.529 von 5.026 Fällen; `filter()` lässt dabei auch die 220 fehlenden Angaben weg. Mit Klassen von 1 Minute ragt im Histogramm die Säule bei 60 heraus (216 Fälle, bei 59 nur 38), kleinere Spitzen bei 45, 75 und 90: Menschen runden, es entstehen ⟪Rundungsspitzen⟫. Bei Klassen von 30 Minuten verschwinden die Spitzen. In die Bildunterschrift gehört: nur Fälle bis 180 Minuten, n = 4.529.',
  ],
  a4: [
    'Der Median ist die Linie in der Box. Hineinzoomen ändert nur das Bild, `filter()` ändert, wer mitgerechnet wird. Frag dich: Bei welchem Erhebungsweg gibt es besonders viele sehr lange Fälle?',
    'Die Mediane liest du in den Ausgaben von Schritt 3 ab, je Erhebungsweg einmal ohne und einmal mit Filter. Wie viele herausfallen, siehst du an N. Wie viele Angaben ganz fehlen, steht unter „Missing“.',
    'Mit allen Fällen: Papier 75, Interview 70, online 49 Minuten. Mit Filter: Interview 70, Papier 60, online 45. Der Filter wirft 306 von 1.436 Papierbögen hinaus (21 %), aber nur 14 von 2.003 Interviews. Dazu kommt: 71,5 % der Papier-Angaben sind Vielfache von 5, beim Interview 39,5 %, online 20 %; auf Papier wurde also vermutlich oft geschätzt. Bei 220 Papierbögen fehlt die Dauer ganz. Mit dem Filter wäre der Vergleich ⟪verzerrt|verzerrung⟫. Ehrlich ist: Hineinzoomen, und in der Bildunterschrift sagen, dass die Papier-Dauer geschätzt ist und 220 Angaben fehlen.',
  ],
};

/* ---------- Beispieldaten der Grundlagen (keine ALLBUS-Daten) ---------- */

/** V2 Turm zum Stapel: 21 Befragte zu ls01, ungeordnet; null ist die eine ohne Antwort (NA). */
export const ZW: (number | null)[] = [8, 7, 9, 5, 8, 10, 6, 8, 7, 4, null, 8, 9, 7, 8, 5, 10, 8, 9, 6, 7];

/** V3 Labor: fünf Formen auf der Skala 0 bis 10 (Säulenhöhen), dazu die zweigipflige Form. */
export const LAB_NAMES = ['stark linksschief', 'leicht linksschief', 'symmetrisch', 'leicht rechtsschief', 'stark rechtsschief'];
export const LAB: number[][] = [[1, 1, 1, 2, 2, 2, 2, 3, 5, 9, 12], [0, 1, 1, 1, 2, 3, 4, 6, 9, 8, 5], [1, 1, 2, 4, 7, 10, 7, 4, 2, 1, 1], [5, 8, 9, 6, 4, 3, 2, 1, 1, 1, 0], [12, 9, 5, 3, 2, 2, 2, 2, 1, 1, 1]];
export const ZWEI = [1, 3, 6, 7, 4, 2, 2, 4, 6, 4, 1];

/** V4 Lineal: Wochenarbeitsstunden von elf Personen (Q1 34, Median 40, Q3 43). */
export const BASIS = [22, 28, 34, 34, 38, 40, 40, 43, 43, 44, 45];

/** V6 Zuordnung: welche Form passt zu welcher Frage (answer = Index in FR_OPTIONS). */
export const FR_OPTIONS = ['Balken', 'Histogramm', 'Boxplots', 'Balken auf 100 %', 'Punkte'];
export const FR: { question: string; answer: number; why: string }[] = [
  { question: 'Wie viele Kinder leben in den Haushalten? (dk11)', answer: 0, why: 'Eine Variable mit wenigen Ausprägungen (0 bis 7): Balken.' },
  { question: 'Wie alt sind die Befragten? (age)', answer: 1, why: 'Eine Variable mit vielen Werten (18 bis 99): Histogramm.' },
  { question: 'Ist das Alter im Osten anders verteilt als im Westen? (age nach eastwest)', answer: 2, why: 'Viele Werte (Alter) nach zwei Gruppen: Boxplots nebeneinander.' },
  { question: 'Bewerten Ost und West die Leihmutterschaft unterschiedlich? (vm18 nach eastwest)', answer: 3, why: 'Zwei Variablen mit wenigen Ausprägungen: Balken auf 100 %, damit die ungleich großen Gruppen vergleichbar werden.' },
  { question: 'Hängt das Alter der Befragten mit dem Alter ihrer Ehepartner zusammen? (age und scage)', answer: 4, why: 'Zwei Variablen mit vielen Werten: Punkte, ein Paar je Punkt.' },
];

/* ---------- Hilfe bei R-Fehlermeldungen ---------- */

/** Text mit Code-Stücken und Links, ohne JSX. */
export type Rich = (string | { code: string } | { href: string; text: string })[];
export const ERROR_HELP_TITLE = 'Hilfe: R meldet einen Fehler';
export const ERROR_HELP_CAPTION = 'Was R sagt und was du tust';
export const ERROR_HELP: { says: Rich; helps: Rich }[] = [
  { says: [{ code: 'konnte Funktion "%>%" nicht finden' }], helps: ['Den ', { href: '#r1', text: 'Startblock in „R lesen“' }, ' ausführen.'] },
  { says: [{ code: "Objekt 'allbus' nicht gefunden" }], helps: ['Die Zeile mit ', { code: 'read_spss()' }, ' aus dem Startblock ausführen.'] },
  { says: [{ code: "'ZA8831_v1-3-0.sav' does not exist" }], helps: ['Öffne RStudio über dein Projekt. Findet R die Datei nicht, nimm wie in Sitzung 1 ', { code: 'allbus <- read_spss(file.choose())' }, '.'] },
  { says: [{ code: "Objekt 'Gesundheitszustand' nicht gefunden" }], helps: ['Beim Titel fehlen die Anführungszeichen: ', { code: 'title = "Gesundheitszustand"' }, '.'] },
  { says: [{ code: '`data` must be a data frame' }], helps: ['Eine Zeile steht an der falschen Stelle. Kopiere die Vorlage neu und ändere nur die markierten Stellen.'] },
  { says: ['Grafik zeigt die falsche Variable'], helps: ['Alle markierten Stellen tauschen, nicht nur eine. Prüfe den Namen unter der x-Achse.'] },
];

/* ---------- Prüf dich selbst ---------- */

export const SELF_TEST: { question: string; options: string[]; answer: number; why: string }[] = [
  { question: 'Eine Verteilung hat ihren Modus ganz rechts und läuft nach links flach aus. Wie heißt sie?', options: ['rechtsschief', 'linksschief', 'symmetrisch'], answer: 1, why: 'Links liegt der lange, flache Teil, darum heißt sie linksschief (Grundlage 2).' },
  { question: 'Ein paar Personen arbeiten 80 Stunden. Welche Zahl bleibt eher in der Mitte?', options: ['Mittelwert', 'Median'], answer: 1, why: 'Der Median: Er hängt nur an der mittleren Person, nicht an den Extremen (Grundlage 4).' },
  { question: 'Du willst das Alter in Ost und West vergleichen. Welche Grafik?', options: ['Balken', 'Boxplots', 'Punkte'], answer: 1, why: 'Viele Werte nach Gruppen: Boxplots nebeneinander (Überblick).' },
  { question: 'Was macht drop_na(hs01)?', options: ['setzt fehlende Werte auf 0', 'lässt Personen ohne gültige Antwort bei hs01 weg', 'löscht die Variable hs01'], answer: 1, why: 'Es lässt nur die Zeilen weg, in denen hs01 fehlt. Alle anderen bleiben (Vorweg: „Eine Grafik entsteht in Schichten“, und Aufgabe 1).' },
  { question: 'Ein Balkendiagramm beginnt bei 7. Was musst du tun?', options: ['nichts, das ist üblich', 'die Achse bei 0 beginnen lassen oder den Ausschnitt in der Bildunterschrift nennen', 'die Balken dicker machen'], answer: 1, why: 'Bei einem Balkendiagramm liest das Auge die Länge. Ein abgeschnittener Balken übertreibt Unterschiede (Grundlage 1c).' },
];

/* ---------- Skript zum Mitnehmen ---------- */

export const SCRIPT_FILE = 'sitzung4.R';
export const SCRIPT_PARTS = ['start', 'schichten', 'a1v', 'a1n', 'a2', 'a3d', 'a3o', 'a3n', 'a3m', 'a4', 'a4f', 'a4z', 'a4zf'];
/** Skript sitzung4.R: alle Vorlagen ohne Probier-Werkstätten, Marken stehen mit ihrem Beispielwert. */
export const SCRIPT = '# Sitzung 4: Daten sehen\n# Statistikatlas, Methoden Ib, ALLBUS 2023 (ZA8831 v1.3.0)\n# Markierte Stellen aus dem Atlas stehen hier mit ihrem Beispielwert.\n\n'
  + SCRIPT_PARTS.map(k => `# ---- ${TEMPLATES[k].title} ----\n${parseMarks(TEMPLATES[k].code).code}\n`).join('\n');
