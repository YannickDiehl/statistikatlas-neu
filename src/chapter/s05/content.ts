// Sitzung 5 „Kreuztabellen“: Zahlen, Vorlagen und Fragen aus docs/entwicklung/spezifikationen/2026-11-23-lernpfad-kapitel/sitzung05.md, nur Daten.
// Alle Zahlen: ALLBUS 2023, ZA8831 v1.3.0, ungewichtet (drei Vergleichswerte gewichtet), nur Aggregate. Geprüft in allbus.local.test.ts.
import type { Question } from '../answers';

/* ---------- Daten ---------- */

/** Größe der Bauplatte allbus (Zeilen × Spalten). */
export const ALLBUS_DIM = { rows: 5246, cols: 579 };

export type WorkRow = { id: 'voll' | 'teil' | 'neben' | 'nicht' | 'ohne'; label: string; n: number };
/** Erwerbsform `work`: Antworten mit Code und Zahl der Befragten (Grundlage 1, „Gruppen zuschneiden“). */
export const WORK: WorkRow[] = [
  { id: 'voll', label: 'Vollzeit, ganztags (1)', n: 2193 },
  { id: 'teil', label: 'Teilzeit (2)', n: 784 },
  { id: 'neben', label: 'nebenher berufstätig (3)', n: 385 },
  { id: 'nicht', label: 'nicht erwerbstätig (4)', n: 1849 },
  { id: 'ohne', label: 'ohne gültige Angabe (Datenfehler, keine Angabe)', n: 35 },
];

/** `teilzeit = rec(work, rules = "2:3=1 [Teilzeit]; 1=0 [Vollzeit]; else=NA")`, ausgezählt mit frequency(). */
export const TEILZEIT = { vollzeit: 2193, teilzeit: 1169, valid: 3362, system: 1884, validPct: [65.23, 34.77], mean: 0.35 };

export type Cross = {
  rows: string[]; cols: string[]; cells: number[][];
  /** Fälle mit fehlender Angabe bei mindestens einer der beiden Variablen. */
  missing: number;
};
/** crosstab(sex, teilzeit): Zeilen MANN, FRAU, DIVERS; Spalten Vollzeit, Teilzeit. */
export const SEX_TEILZEIT: Cross = { rows: ['Mann', 'Frau', 'Divers'], cols: ['Vollzeit', 'Teilzeit'], cells: [[1379, 301], [805, 860], [8, 6]], missing: 1887 };

/** crosstab(misstrauen, nichtwahl): Zeilen misstraut nicht, misstraut; Spalten würde wählen, würde nicht wählen. */
export const MISS_NW: Cross = { rows: ['misstraut nicht', 'misstraut'], cols: ['würde wählen', 'würde nicht wählen'], cells: [[810, 19], [1829, 127]], missing: 2461 };

/** frequency(pe01): Codes 1 bis 4, fehlend (TNZ: SPLIT und andere). */
export const PE01 = {
  labels: ['STIMME VOLL ZU', 'STIMME EHER ZU', 'STIMME EHER NICHT ZU', 'STIMME GAR NICHT ZU'],
  counts: [1144, 1486, 868, 100],
  validPct: [31.80, 41.30, 24.12, 2.78],
  valid: 3598, missing: 1648, split: 1596,
};
/** misstrauen gelöst (1:2=1, 3:4=0) und mit dem Platzhalter (1=1, 2:4=0). */
export const MISSTRAUEN = { yes: 2630, no: 968, valid: 3598, system: 1648, validPct: [26.90, 73.10], mean: 0.73, share: 73.1, placeholderYes: 1144, placeholderNo: 2454 };
/** nichtwahl: 91 = 1, 1:90 = 0, else = NA. */
export const NICHTWAHL = { yes: 236, no: 3748, valid: 3984, system: 1262, validPct: [94.08, 5.92], mean: 0.06, notEligible: 186, dontKnow: 603 };
/** Probier-Werkstatt A1: pe01 nur bei gültiger Wahlabsicht (drop_na(nichtwahl)). */
export const PE01_WITH_VOTE = { total: 3984, valid: 2785, validPct: [29.91, 40.32, 26.89, 2.87] };

/** ep01 Wirtschaftslage, Codes 1 bis 5 (Grundlage 4). */
export const EP01 = { labels: ['SEHR GUT', 'GUT', 'TEILS/TEILS', 'SCHLECHT', 'SEHR SCHLECHT'], counts: [95, 1338, 2684, 919, 158], n: 5194, mean: 2.94, meanRev: 3.06 };

/** pe05 umgepolt (rules = "rev"): Codes 1 bis 4 mit ihren Wörtern; fehlend wie pe05. */
export const PE05_UM = { labels: ['STIMME GAR NICHT ZU', 'STIMME EHER NICHT ZU', 'STIMME EHER ZU', 'STIMME VOLL ZU'], counts: [578, 1476, 1399, 149], split: 1596 };

/** Zeilenprozente „würde nicht wählen“ je Gruppe (Aufgabe 4); n je Zeile und N (valid). */
export const PE05_NW = {
  solved: { no: { n: 1267, pct: 3.2 }, yes: { n: 1512, pct: 6.9, count: 104 }, valid: 2779 },
  placeholder: { no: 4.2, yes: 10.6 },
  without: { no: 6.9, yes: 3.2 },
};

/** Probier-Werkstätten: West/Ost misstrauen (row %), pa35 mit zwei Regeln („würde nicht wählen“, row %). */
export const EAST_WEST = { west: 70.6, east: 78.3 };
export const PA35 = { split2: { yes: 8.3, no: 3.5 }, split3: { yes: 6.6, no: 1.8 } };

/** Überblick: chi_square(misstrauen, nichtwahl), ungewichtet. */
export const CHI = { chi2: 20.685, df: 1, n: 2785, v: 0.086, minExpected: 43.5 };

/** Gewichtete Vergleichswerte (wghtpew), nur in „Genauer erklärt“ und einer Rückmeldung. */
export const WEIGHTED = { womenPart: 53.5, menPart: 17.8, col87: 86.6 };

/* ---------- Prozent einer Kreuztabelle ---------- */

export type Basis = 'row' | 'col' | 'total';
const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
/** Randsummen: Zeilen, Spalten, alle. */
export function margins(c: Cross) {
  const rowSums = c.cells.map(sum);
  const colSums = c.cols.map((_, j) => sum(c.cells.map(r => r[j])));
  return { rowSums, colSums, n: sum(rowSums) };
}
/** Prozent einer Zelle (i, j) mit der Basis; i = rows.length ist die Zeile Total, j = cols.length die Spalte Total. */
export function percent(c: Cross, basis: Basis, i: number, j: number): number {
  const { rowSums, colSums, n } = margins(c);
  const count = i === c.rows.length ? (j === c.cols.length ? n : colSums[j]) : j === c.cols.length ? rowSums[i] : c.cells[i][j];
  const base = basis === 'total' ? n : basis === 'row' ? (i === c.rows.length ? n : rowSums[i]) : (j === c.cols.length ? n : colSums[j]);
  return count / base * 100;
}
/** Eine Nachkommastelle wie in der Ausgabe von crosstab(). */
export const round1 = (x: number) => Math.round(x * 10) / 10;

/* ---------- Gruppen zuschneiden (Grundlage 1) ---------- */

export type Group = '1' | '0' | 'na';
export const GROUP_LABELS: Record<Group, string> = { '1': 'Gruppe 1: Teilzeit', '0': 'Gruppe 0: Vollzeit', na: 'leer (NA): zählt nicht mit' };
/** Benannte Einteilungen in der Reihenfolge von WORK, mit Rückmeldung (Anteil in sitzung05-zahlen.R geprüft). */
export const CUTS: { id: string; groups: Group[]; share: number; text: string }[] = [
  { id: 'A', groups: ['0', '1', '1', 'na', 'na'], share: 34.8, text: '34,8 % der Erwerbstätigen arbeiten Teilzeit oder nebenher. So ist auch die Regel in ‚R lesen‘ gebaut.' },
  { id: 'B', groups: ['0', '1', 'na', 'na', 'na'], share: 26.3, text: '26,3 %: Wer nebenher arbeitet, zählt jetzt gar nicht mit. Die Zahl beantwortet eine engere Frage: Wie viele von denen, die Vollzeit oder Teilzeit arbeiten, arbeiten Teilzeit?' },
  { id: 'C', groups: ['0', '1', '0', 'na', 'na'], share: 23.3, text: '23,3 %: Nebenher Arbeitende zählen jetzt als Vollzeit. Passt das zu ihrer Antwort?' },
  { id: 'D', groups: ['0', '1', '1', '0', 'na'], share: 22.4, text: '22,4 %: Nicht Erwerbstätige zählen als Vollzeit. Die Basis sind jetzt fast alle Befragten, nicht die Erwerbstätigen.' },
  { id: 'E', groups: ['0', '1', '1', '0', '0'], share: 22.3, text: '22,3 %: So rechnet R mit else=0. Dann zählt auch, wer gar nichts angegeben hat, als Vollzeit.' },
  { id: 'F', groups: ['0', '1', '1', '1', 'na'], share: 57.9, text: '57,9 %: Nicht Erwerbstätige zählen als Teilzeit. Die Gruppe heißt Teilzeit, misst aber etwas anderes.' },
];
export const CUT_OTHER = (share: string) => `Deine Einteilung ergibt ${share} %. Frag dich bei jeder Zeile: Passt die Antwort zum Namen der Gruppe?`;

/* ---------- Basis-Schalter (Grundlage 2) ---------- */

/** Wortformen für die Sätze unter dem Basis-Schalter. */
export const ROW_WORDS = [
  { dative: 'Männern', predicate: 'Männer', nominative: 'Mann' },
  { dative: 'Frauen', predicate: 'Frauen', nominative: 'Frau' },
  { dative: 'Befragten mit der Angabe divers', predicate: 'Befragte mit der Angabe divers', nominative: 'divers' },
];
export const COL_WORDS = [
  { word: 'Vollzeit', dative: 'Vollzeitkräften', nominative: 'Vollzeit' },
  { word: 'Teilzeit oder nebenher', dative: 'Teilzeitkräften', nominative: 'Teilzeit' },
];
export const DIVERS_NOTE = 'Vorsicht: Die Basis sind nur 14 Menschen. Stünde eine Person in der anderen Spalte, läge der Wert gut 7 Prozentpunkte anders.';

/* ---------- Codevorlagen ---------- */

export type Template = { title: string; code: string; tryOut?: boolean };
const MISS = 'misstrauen = rec(pe01, rules = "1:2=1 [misstraut]; 3:4=0 [misstraut nicht]; else=NA")';
const NW = 'rec(pv01, rules = "91=1 [würde nicht wählen]; 1:90=0 [würde wählen]; else=NA")';
/** ⟦…⟧ markiert Stellen, die angepasst werden. Jede Vorlage bildet ihre neuen Variablen selbst (die Werkstatt startet frisch). */
export const TEMPLATES: Record<string, Template> = {
  start: { title: 'Startblock', code: `# Pakete laden und Daten einlesen
library(tidyverse)
library(mariposa)

allbus <- read_spss("ZA8831_v1-3-0.sav")` },
  r2_rec: { title: 'Vorlage: eine neue Variable bauen', code: `# Neue Variable teilzeit aus work bilden und gleich prüfen
allbus %>%
  mutate(
    teilzeit = rec(work, rules = "2:3=1 [Teilzeit]; 1=0 [Vollzeit]; else=NA")
  ) %>%
  frequency(teilzeit)` },
  r3_ct: { title: 'Vorlage: eine Kreuztabelle', code: `# Kreuztabelle: Geschlecht in den Zeilen, Teilzeit in den Spalten
# teilzeit bilden: wie in der Vorlage darüber
allbus %>%
  mutate(
    teilzeit = rec(work, rules = "2:3=1 [Teilzeit]; 1=0 [Vollzeit]; else=NA")
  ) %>%
  crosstab(sex, teilzeit, percentages = "row")` },
  a1_freq: { title: 'Die Codes von pe01', code: `# Welche Codes hat pe01?
allbus %>%
  frequency(pe01)` },
  a1_misstrauen: { title: 'Die Gruppe misstrauen bilden', code: `# Neue Variable misstrauen bilden und gleich prüfen
allbus %>%
  mutate(
    misstrauen = rec(pe01, rules = "⟦1⟧=1 [misstraut]; ⟦2:4⟧=0 [misstraut nicht]; else=NA")
  ) %>%
  frequency(misstrauen)` },
  a1_nichtwahl: { title: 'Die Gruppe nichtwahl bilden', code: `# Neue Variable nichtwahl bilden und gleich prüfen
allbus %>%
  mutate(
    nichtwahl = ${NW}
  ) %>%
  frequency(nichtwahl)` },
  frei_a1: { tryOut: true, title: 'Deine Probier-Werkstatt', code: `# Eine Idee: pe01 nur bei denen, die bei der Wahlabsicht eine gültige Angabe haben
# nichtwahl bilden: wie in Schritt 3
allbus %>%
  mutate(
    nichtwahl = ${NW}
  ) %>%
  drop_na(nichtwahl) %>%
  frequency(pe01)
` },
  a2_ct: { title: 'Welche Prozentbasis ergibt die 87 %?', code: `# Kreuztabelle: Welche Prozentbasis ergibt die 87 %?
# misstrauen und nichtwahl bilden: kennst du aus Aufgabe 1
allbus %>%
  mutate(
    ${MISS},
    nichtwahl  = ${NW}
  ) %>%
  crosstab(misstrauen, nichtwahl, percentages = "⟦row⟧")` },
  a2_all: { title: 'Alle drei Prozentbasen', code: `# Dieselbe Tabelle mit allen drei Prozentbasen
# misstrauen und nichtwahl bilden: kennst du aus Aufgabe 1
allbus %>%
  mutate(
    ${MISS},
    nichtwahl  = ${NW}
  ) %>%
  crosstab(misstrauen, nichtwahl, percentages = "all")` },
  frei_a2: { tryOut: true, title: 'Deine Probier-Werkstatt', code: `# Eine Idee: Misstrauen in West und Ost
# misstrauen bilden: kennst du aus Aufgabe 1
allbus %>%
  mutate(
    ${MISS}
  ) %>%
  crosstab(eastwest, misstrauen, percentages = "row")
` },
  a3_ct: { title: 'Misstrauende und übrige vergleichen', code: `# Misstrauende und übrige vergleichen
# misstrauen und nichtwahl bilden: kennst du aus Aufgabe 1
allbus %>%
  mutate(
    ${MISS},
    nichtwahl  = ${NW}
  ) %>%
  crosstab(misstrauen, nichtwahl, percentages = "⟦col⟧")` },
  frei_a3: { tryOut: true, title: 'Deine Probier-Werkstatt', code: `# Eine Idee: die Zeilenprozente als Balken auf 100 %
# misstrauen und nichtwahl bilden: kennst du aus Aufgabe 1
allbus %>%
  mutate(
    ${MISS},
    nichtwahl  = ${NW}
  ) %>%
  drop_na(misstrauen, nichtwahl) %>%
  to_label(misstrauen, nichtwahl) %>%
  ggplot(aes(x = misstrauen, fill = nichtwahl)) +
  geom_bar(position = "fill")
` },
  a4_um: { title: 'pe05 umpolen und prüfen', code: `# pe05 umpolen und gleich prüfen: Welches Wort steht jetzt bei Code 1?
allbus %>%
  mutate(
    pe05_um = rec(pe05, rules = "rev")
  ) %>%
  frequency(pe05_um)` },
  a4_mutate: { title: 'Gegenprobe: Misstrauen aus pe05', code: `# pe05 umpolen, Misstrauen daraus bilden und mit der Nichtwahl kreuzen
# nichtwahl bilden: kennst du aus Aufgabe 1
allbus %>%
  mutate(
    pe05_um         = rec(pe05, rules = "rev"),
    misstrauen_pe05 = rec(pe05_um, rules = "⟦1⟧=1 [misstraut]; ⟦2:4⟧=0 [misstraut nicht]; else=NA"),
    nichtwahl       = ${NW}
  ) %>%
  crosstab(misstrauen_pe05, nichtwahl, percentages = "row")` },
  a4_ohne: { title: 'Zum Vergleich: ohne Umpolen', code: `# Zum Vergleich: die Regel aus Aufgabe 1 ohne Umpolen auf pe05
# nichtwahl bilden: kennst du aus Aufgabe 1
allbus %>%
  mutate(
    misstrauen_ohne = rec(pe05, rules = "1:2=1 [misstraut]; 3:4=0 [misstraut nicht]; else=NA"),
    nichtwahl       = ${NW}
  ) %>%
  crosstab(misstrauen_ohne, nichtwahl, percentages = "row")` },
  frei_a4: { tryOut: true, title: 'Deine Probier-Werkstatt', code: `# Eine Idee: Gegenprobe mit pa35 („Politiker vertreten nur die Reichen“)
# 3 = teils/teils zählt hier als „misstraut nicht“. Probier auch 1:3=1 und 4:5=0.
allbus %>%
  mutate(
    misstrauen_pa35 = rec(pa35, rules = "1:2=1 [misstraut]; 3:5=0 [misstraut nicht]; else=NA"),
    nichtwahl       = ${NW}
  ) %>%
  crosstab(misstrauen_pa35, nichtwahl, percentages = "row")
` },
  ueb_chi: { title: 'Wiederholung: Chi-Quadrat-Test', code: `# Wiederholung: Ist der Unterschied größer, als der Zufall erwarten lässt?
# misstrauen und nichtwahl bilden: kennst du aus Aufgabe 1
allbus %>%
  mutate(
    ${MISS},
    nichtwahl  = ${NW}
  ) %>%
  chi_square(misstrauen, nichtwahl)` },
};

/* ---------- Antworten prüfen ---------- */

/**
 * Eine Frage dieser Sitzung: wie `Question`, dazu Rückmeldungen für typische falsche Werte (`wrong`, Schlüssel = Wert
 * bzw. Option), `whole` (ganze Zahl ±0,55 wie im alten Konzept) und `group` (Zuordnen: Auswahlfelder in einer Gruppe).
 */
export type Q5 = Question & { wrong?: Record<string, string>; whole?: boolean; group?: string };
type Extra = { short?: string; help?: string; wrong?: Record<string, string>; tolerance?: number };
const choice = (id: string, label: string, options: [string, string][], target: string, right: string, hint: string, extra: Extra & { group?: string } = {}): Q5 =>
  ({ id, label, kind: 'choice', options: options.map(([value, l]) => ({ value, label: l })), target, right, hint, ...extra });
const count = (id: string, label: string, target: number, right: string, hint: string, extra: Extra = {}): Q5 =>
  ({ id, label, kind: 'number', target, right, hint, ...extra });
/** Prozentwert: ±0,1, bei ganzzahliger Eingabe ±0,55. */
const pct = (id: string, label: string, target: number, right: string, hint: string, extra: Extra = {}): Q5 =>
  ({ id, label, kind: 'number', target, tolerance: 0.1, whole: true, right, hint, ...extra });

/** Hint of questions whose wrong options all have their own feedback: it never shows, so it stays minimal. */
const NO_HINT = 'Lies die Frage noch einmal.';

const BASES: [string, string][] = [['row', '`"row"` (Zeilenprozente)'], ['col', '`"col"` (Spaltenprozente)'], ['total', '`"total"` (Gesamtprozente)']];
const A2D_OPTIONS: [string, string][] = [['6.5', '6,5 %'], ['87.0', '87,0 %'], ['4.6', '4,6 %']];
const A2D_GROUP = 'Welche Zahl derselben Zelle beantwortet welche Frage?';
const A2D_HELP = 'Aus Schritt 2: row %, col %, total %.';
const A2D_HINT = 'Such die Gruppe nach ‚der‘: Sie ist die Basis. Misstrauende = Zeile, Nichtwählende = Spalte, alle = ganze Tabelle.';

export const QUESTIONS: Record<'a1' | 'a2' | 'a3' | 'a4', Q5[]> = {
  a1: [
    count('a1a', 'Wie viele Befragte zählen nach deiner Regel als „misstraut“?', 2630,
      '2.630 Befragte, 73,1 % der gültigen Antworten: 1.144 stimmen voll zu, 1.486 eher.',
      'Lies in frequency(misstrauen) die Spalte N in der Zeile ‚misstraut‘. Steht in deiner Regel 1:2=1 und 3:4=0?',
      { short: 'misstraut', help: 'Aus Schritt 2, Spalte N.', wrong: {
        1144: '1.144 sind nur die mit ‚stimme voll zu‘. ‚Stimme eher zu‘ (Code 2) ist auch Zustimmung: Regel 1:2=1, dann 3:4=0.',
        968: '968 ist die Gruppe ‚misstraut nicht‘. Gesucht ist die Zeile ‚misstraut‘.',
      } }),
    count('a1b', 'Wie viele Befragte würden nicht wählen?', 236,
      '236 Befragte sagen, sie würden nicht wählen, 3.748 würden wählen.',
      'Lies in frequency(nichtwahl) die Spalte N in der Zeile ‚würde nicht wählen‘.',
      { short: 'würde nicht wählen', help: 'Aus Schritt 3, Spalte N.', wrong: { 3748: '3.748 würden wählen. Gesucht ist die Zeile ‚würde nicht wählen‘.' } }),
    choice('a1c', 'Was ist in `nichtwahl` mit den 186 nicht Wahlberechtigten passiert?',
      [['nicht', 'Sie zählen als ‚würde nicht wählen‘'], ['waehlen', 'Sie zählen als ‚würde wählen‘'], ['na', 'Sie sind leer (NA) und zählen nicht mit']], 'na',
      'Code −50 steht weder bei 91 noch bei 1:90, also greift else=NA. Sie stehen mit allen anderen fehlenden Angaben in der Zeile ‚System‘ (1.262).',
      'Schau in die Regel: Aus 91 wird 1, aus 1 bis 90 wird 0. Kommt −50 darin vor? Was macht else=NA mit allem anderen?',
      { short: 'nicht Wahlberechtigte' }),
    choice('a1d', 'Über der Tabelle von `misstrauen` steht `mean=0.73`. Was heißt das?',
      [['anteil', '73 % der gültigen Antworten sind 1, also ‚misstraut‘'], ['skala', 'Die Befragten misstrauen im Schnitt mit 0,73 Punkten auf der Skala von 1 bis 4'], ['fehlen', '73 % der Antworten fehlen']], 'anteil',
      'Bei einer Dummyvariable ist der Mittelwert der Anteil der Einsen: 0,73 heißt 73 %, wie Valid % 73,10 in der Zeile ‚misstraut‘.',
      'Bei einer Variable mit nur 0 und 1 zählt jede 1 als eins, jede 0 als null. Der Mittelwert ist dann der Anteil der Einsen. Vergleiche mit Valid % in der Zeile ‚misstraut‘.',
      { short: 'mean=0.73', help: 'Grundlage 1, Genauer erklärt.' }),
  ],
  a2: [
    choice('a2a', 'Bei welcher Einstellung steht in der Zelle „misstraut“ und „würde nicht wählen“ 87.0%?', BASES, 'col',
      'Mit `percentages = "col"` steht dort 87.0%, also 87,0 %: Spaltenprozente. Die Nichtwählenden sind 100 %.',
      NO_HINT,
      { short: 'Einstellung', help: 'Probier in Schritt 1 alle drei Einstellungen und schau immer auf dieselbe Zelle.', wrong: {
        row: 'Bei "row" steht dort 6.5%: Anteil an den Misstrauenden. Probier "col".',
        total: 'Bei "total" steht dort 4.6%: Anteil an allen 2.785 in der Tabelle. Probier "col".',
      } }),
    count('a2b', 'Wie viele Befragte stecken in dieser Zelle?', 127,
      '127 Befragte misstrauen und würden nicht wählen.', 'Die obere Zahl in der Zelle ist die Anzahl.',
      { short: 'Anzahl in der Zelle', help: 'Die obere Zahl in der Zelle.', wrong: {
        146: '146 sind alle Nichtwählenden in der Tabelle (Zeile Total). Gesucht ist die Zelle selbst.',
        1956: '1.956 sind alle Misstrauenden (Spalte Total). Gesucht ist die Zelle selbst.',
      } }),
    count('a2c', 'Wie viele Nichtwählende stehen in der Tabelle? Sie sind bei den 87 % die 100 %.', 146,
      '146: 127 Misstrauende und 19 übrige. 127 von 146 sind 87,0 %.', 'Lies in der Zeile Total die Spalte ‚würde nicht wählen‘.',
      { short: 'Nichtwählende in der Tabelle', help: 'Zeile Total.', wrong: {
        236: '236 würden insgesamt nicht wählen. In der Tabelle stehen nur die, die auch pe01 beantwortet haben; pe01 stand nur in einem Teil der Fragebögen. Lies die Zeile Total.',
        2785: '2.785 sind alle in der Tabelle. Gesucht ist die Summe der Spalte ‚würde nicht wählen‘.',
      } }),
    choice('a2d1', '(1) Wie viele der Misstrauenden würden nicht wählen?', A2D_OPTIONS, '6.5',
      'Zeilenprozent: Die 1.956 Misstrauenden sind 100 %.', A2D_HINT, { short: 'Frage (1)', group: A2D_GROUP, help: A2D_HELP }),
    choice('a2d2', '(2) Wie viele der Nichtwählenden misstrauen?', A2D_OPTIONS, '87.0',
      'Spaltenprozent: Die 146 Nichtwählenden sind 100 %.', A2D_HINT, { short: 'Frage (2)', group: A2D_GROUP, help: A2D_HELP }),
    choice('a2d3', '(3) Wie viele aller Befragten in der Tabelle misstrauen und würden nicht wählen?', A2D_OPTIONS, '4.6',
      'Gesamtprozent: Alle 2.785 sind 100 %.', A2D_HINT, { short: 'Frage (3)', group: A2D_GROUP, help: A2D_HELP }),
    choice('a2e', 'Stimmt die Zahl aus dem Satz?',
      [['ja', 'Ja: 87,0 % der Nichtwählenden misstrauen den Politikern.'], ['row', 'Nein, R zeigt 6,5 %.'], ['gewicht', 'Nein, die Zahl stimmt nur gewichtet.']], 'ja',
      'Die Zahl stimmt, als Spaltenprozent. Ob sie die Behauptung ‚Wer misstraut, geht nicht wählen‘ trägt, prüfst du in Aufgabe 3.',
      '6,5 % ist eine andere Zahl derselben Zelle, mit einer anderen Basis. Beide stimmen; sie beantworten verschiedene Fragen. Gewichtet ändert sich wenig (86,6 %).',
      { short: 'Stimmt die Zahl?' }),
  ],
  a3: [
    choice('a3a', 'Welche Prozentbasis hast du eingestellt?', BASES, 'row',
      'Zeilenprozente: misstrauen steht in den Zeilen, also ist jede Gruppe 100 %. Jetzt vergleichst du Misstrauende mit übrigen.',
      NO_HINT,
      { short: 'Prozentbasis', wrong: {
        col: 'Bei "col" sind die Nichtwählenden 100 %; das war die Frage aus Aufgabe 2.',
        total: 'Bei "total" ist die ganze Tabelle 100 %; dann kannst du die Gruppen nicht vergleichen.',
      } }),
    pct('a3b', 'Wie viel Prozent der Misstrauenden würden nicht wählen?', 6.5,
      '6,5 %: 127 von 1.956 Misstrauenden.', 'Zeile ‚misstraut‘, Spalte ‚würde nicht wählen‘, mit "row".',
      { short: 'Misstrauende', help: 'Aus Schritt 1, Zeile ‚misstraut‘.', wrong: { 87: '87,0 % sind Spaltenprozente. Stell "row" ein.', 93.5: '93,5 % würden wählen. Gesucht ist die Spalte ‚würde nicht wählen‘.' } }),
    pct('a3c', 'Und wie viel Prozent der übrigen (Zeile „misstraut nicht“)?', 2.3,
      '2,3 %: 19 von 829.', 'Zeile ‚misstraut nicht‘, Spalte ‚würde nicht wählen‘.',
      { short: 'übrige', help: 'Aus Schritt 1, Zeile ‚misstraut nicht‘.', wrong: { 13: '13,0 % sind Spaltenprozente. Stell "row" ein.', 97.7: '97,7 % würden wählen. Gesucht ist ‚würde nicht wählen‘.' } }),
    pct('a3d', 'Um wie viele Prozentpunkte unterscheiden sich die beiden Gruppen?', 4.2,
      '4,2 Prozentpunkte: 6,5 minus 2,3. Misstrauende wollen fast dreimal so häufig nicht wählen, auf niedrigem Niveau.',
      'Zieh die beiden Prozentzahlen voneinander ab.',
      { short: 'Abstand', help: 'Prozentpunkte: abziehen.', wrong: { 2.8: '2,8 ist das Verhältnis (6,5 geteilt durch 2,3). Gefragt ist der Abstand: abziehen.' } }),
    choice('a3e', 'Welcher Satz passt zu deiner Tabelle?',
      [['gar', 'Wer Politikern misstraut, geht gar nicht mehr wählen.'], ['etwas', 'Misstrauende wollen etwas häufiger nicht wählen als die übrigen, 6,5 % gegenüber 2,3 %. Aber auch von ihnen wollen 93,5 % wählen.'], ['nichts', 'Misstrauen und Wahlabsicht haben nichts miteinander zu tun.']], 'etwas',
      'Genau: Es gibt einen Zusammenhang, aber ‚gar nicht mehr‘ trägt er nicht. Die große Mehrheit der Misstrauenden will wählen.',
      NO_HINT,
      { short: 'Satz', wrong: {
        gar: 'Dann müssten fast alle Misstrauenden ‚würde nicht wählen‘ sagen. Es sind 6,5 %.',
        nichts: 'Die Anteile unterscheiden sich: 6,5 % gegenüber 2,3 %. Ein Zusammenhang ist da, nur ein kleiner.',
      } }),
    choice('a3f', 'Zeigt die Tabelle, dass Misstrauen Menschen vom Wählen abhält?',
      [['ja', 'Ja, die Prozentzahlen beweisen es.'], ['nein', 'Nein: Sie zeigt einen Zusammenhang. Ob Misstrauen die Ursache ist, ob es umgekehrt wirkt oder ob etwas Drittes beides beeinflusst, etwa politisches Interesse, zeigt sie nicht.'], ['wenig', 'Nein, weil 6,5 % zu wenig sind.']], 'nein',
      'Eine Kreuztabelle zeigt, was zusammen vorkommt, nicht warum. Die Richtung ist hier eine Annahme.',
      NO_HINT,
      { short: 'Ursache', help: 'Grundlage 3, Genauer erklärt.', wrong: {
        ja: 'Prozent zeigen, was zusammen vorkommt. Eine Ursache bräuchte mehr: zeitliche Abfolge und den Ausschluss anderer Erklärungen.',
        wenig: 'Auch ein kleiner Unterschied ist ein Zusammenhang. Der Punkt ist ein anderer: Die Tabelle zeigt nicht, was Ursache ist.',
      } }),
  ],
  a4: [
    choice('a4a', 'Welches Wort steht nach dem Umpolen bei Code 1?',
      [['voll', 'STIMME VOLL ZU'], ['garnicht', 'STIMME GAR NICHT ZU'], ['split', 'TNZ: SPLIT']], 'garnicht',
      'Aus 4 ‚stimme gar nicht zu‘ wurde 1. Jetzt heißt eine kleine Zahl Misstrauen, wie bei pe01.',
      NO_HINT,
      { short: 'Code 1', help: 'Aus Schritt 1, Zeile mit Value 1.', wrong: {
        voll: 'Das war Code 1 vor dem Umpolen. Schau in die Ausgabe von Schritt 1.',
        split: 'TNZ: SPLIT ist ein fehlender Wert und bleibt leer.',
      } }),
    pct('a4b', 'Wie viel Prozent der Misstrauenden (nach pe05) würden nicht wählen?', 6.9,
      '6,9 %: 104 von 1.512.', 'Zeile ‚misstraut‘, Spalte ‚würde nicht wählen‘ in Schritt 2.',
      { short: 'Misstrauende nach pe05', help: 'Aus Schritt 2.', wrong: {
        10.6: 'Bei dir zählt nur Code 1 (‚stimme gar nicht zu‘). ‚Stimme eher nicht zu‘ (Code 2) ist auch Misstrauen: 1:2=1, 3:4=0.',
        3.2: 'Das ist die andere Zeile, oder deine Regel nimmt 3:4 als Misstrauen. Nach dem Umpolen heißen 1 und 2 Misstrauen.',
      } }),
    pct('a4c', 'Und wie viel Prozent der übrigen?', 3.2,
      '3,2 %: Auch mit pe05 wollen Misstrauende etwa doppelt so häufig nicht wählen.', 'Zeile ‚misstraut nicht‘, Spalte ‚würde nicht wählen‘.',
      { short: 'übrige nach pe05', help: 'Aus Schritt 2.', wrong: {
        4.2: 'Bei dir zählt nur Code 1. Passe die Regel an: 1:2=1, 3:4=0.',
        6.9: 'Das ist die Zeile ‚misstraut‘. Gesucht ist ‚misstraut nicht‘.',
      } }),
    choice('a4d', 'Was zeigt die Tabelle ohne Umpolen (Schritt 3)?',
      [['vertauscht', 'Die Gruppen sind vertauscht: Unter ‚misstraut‘ stehen die, die pe05 zustimmen, also vertrauen. Darum sieht es aus, als wollten Misstrauende seltener nicht wählen.'], ['gleich', 'Dasselbe Ergebnis wie mit Umpolen.'], ['falsch', 'R rechnet ohne Umpolen falsch.']], 'vertauscht',
      'Genau: 3,2 % und 6,9 % tauschen die Plätze. R rechnet richtig, aber die Regel passt nicht zur Richtung der Aussage.',
      NO_HINT,
      { short: 'ohne Umpolen', wrong: {
        gleich: 'Vergleiche die Zeile ‚misstraut‘ in Schritt 2 (6,9 %) und Schritt 3 (3,2 %).',
        falsch: 'R rechnet in beiden Fällen richtig. Der Unterschied liegt in der Regel: Ohne Umpolen heißt 1:2 bei pe05 Zustimmung, also Vertrauen.',
      } }),
    choice('a4e', 'Bestätigt die Gegenprobe dein Ergebnis aus Aufgabe 3?',
      [['ja', 'Ja: Auch mit pe05 wollen Misstrauende häufiger nicht wählen (6,9 % gegenüber 3,2 %), und auch hier wollen über 90 % von ihnen wählen.'], ['dreht', 'Nein, das Ergebnis dreht sich um.'], ['mehrheit', 'Nein, mit pe05 würde die Mehrheit der Misstrauenden nicht wählen.']], 'ja',
      'Zwei Aussagen, dasselbe Bild. Das macht das Ergebnis aus Aufgabe 3 belastbarer.',
      NO_HINT,
      { short: 'Gegenprobe', wrong: {
        dreht: 'Umgedreht ist es nur ohne Umpolen. Mit Umpolen zeigt es in dieselbe Richtung wie Aufgabe 3.',
        mehrheit: '93,1 % der Misstrauenden würden wählen.',
      } }),
  ],
};

/** Pflichtaufgaben: Aufgabe 1, 2 und 3. */
export const REQUIRED: Q5[] = [...QUESTIONS.a1, ...QUESTIONS.a2, ...QUESTIONS.a3];
/** Aufgabe 2: Wenn diese Fragen richtig sind, wird das Bild „Dieselben 127 Menschen, drei Nenner“ aufgedeckt. */
export const A2_REVEAL = ['a2a', 'a2b', 'a2c', 'a2d1', 'a2d2', 'a2d3'];

/* ---------- Kurz überlegen in den Grundlagen ---------- */

export const G1_Q: Q5 = pct('g1-frage', 'In R steht ‚else=0‘ statt ‚else=NA‘: Alles, was nicht Teilzeit oder nebenher ist, kommt in Gruppe 0. Wie viel Prozent sind dann Teilzeit?', 22.3,
  '22,3 %. Mit else=0 zählen auch die 1.849 nicht Erwerbstätigen und die 35 ohne Angabe als Vollzeit. Die Zahl sieht harmlos aus, beantwortet aber eine andere Frage.',
  'Leg alle Zeilen außer Teilzeit und nebenher in Gruppe 0, auch ‚ohne gültige Angabe‘, und lies den Anteil ab.',
  { short: 'mit else=0', tolerance: 0.05 /* 22,4 is grouping D (missing left out), not else=0 */, help: 'Probier es oben aus: Auch ‚ohne gültige Angabe‘ kommt in Gruppe 0. Eine Kommazahl reicht, zum Beispiel 12,5.', wrong: {
    34.8: '34,8 % sind es mit else=NA. Leg ‚nicht erwerbstätig‘ und ‚ohne gültige Angabe‘ in Gruppe 0.',
    22.4: '22,4 % ergibt sich, wenn ‚ohne gültige Angabe‘ leer bleibt. Mit else=0 kommt auch sie in Gruppe 0.',
  } });

export const G2_Q: Q5 = pct('g2-frage', 'Wie viel Prozent der Teilzeitkräfte sind Männer?', 25.8,
  '25,8 %, ein Spaltenprozent: Die 1.167 Teilzeitkräfte sind 100 %, davon sind 301 Männer.',
  'Wer ist 100 %? ‚Der Teilzeitkräfte‘: die Spalte Teilzeit. Stell den Schalter auf Spaltenprozente und wähle die Zelle Mann/Teilzeit.',
  { short: 'Männer unter den Teilzeitkräften', help: 'Probier es im Basis-Schalter aus. Eine Kommazahl reicht.', wrong: {
    17.9: '17,9 % ist der Anteil der Männer, die Teilzeit arbeiten: ein Zeilenprozent. Gefragt ist ‚der Teilzeitkräfte‘: Die Spalte Teilzeit ist 100 %.',
    9: '9,0 % ist ein Gesamtprozent: Männer in Teilzeit unter allen Erwerbstätigen. Gefragt ist ‚der Teilzeitkräfte‘.',
  } });

export const G3_Q1: Q5 = pct('g3-frage1', 'Um wie viele Prozentpunkte liegt der Teilzeitanteil der Frauen über dem der Männer?', 33.8,
  '33,8 Prozentpunkte: 51,7 minus 17,9.',
  'Nimm die beiden Teilzeit-Anteile, 51,7 und 17,9, und zieh den kleineren vom größeren ab.',
  { short: 'Abstand', help: 'Die Zahlen stehen im Bild. Prozentpunkte: abziehen.', wrong: {
    2.9: '2,9 ist das Verhältnis: Frauen arbeiten fast dreimal so häufig Teilzeit. Gefragt ist der Abstand: abziehen.',
  } });

export const G3_Q2: Q5 = choice('g3-frage2', 'Eine Schlagzeile: ‚Teilzeit ist Frauensache: 74 % der Teilzeitkräfte sind Frauen.‘ Welche Frage beantwortet die 74 %?',
  [['frauen', 'Wie viele der Frauen arbeiten Teilzeit?'], ['teilzeit', 'Wie viele der Teilzeitkräfte sind Frauen?'], ['vergleich', 'Arbeiten Frauen häufiger Teilzeit als Männer?']], 'teilzeit',
  'Ein Spaltenprozent: Die Teilzeitkräfte sind 100 %. Für den Vergleich von Frauen und Männern brauchst du die Zeilenprozente: 51,7 % gegenüber 17,9 %.',
  NO_HINT,
  { short: 'Schlagzeile', wrong: {
    frauen: 'Das wären die Zeilenprozente, 51,7 %. Die 74 % haben eine andere Basis: ‚der Teilzeitkräfte‘.',
    vergleich: 'Für einen Vergleich muss jede Gruppe der UV 100 % sein. Bei den 74 % sind die Teilzeitkräfte 100 %, nicht Frauen und Männer je für sich.',
  } });

export const G4_Q: Q5 = count('g4-frage', 'Nach dem Umpolen: Welcher Code steht bei ‚GUT‘?', 4,
  '4: Vorher war GUT die 2, und 6 − 2 = 4.', 'Such GUT im linken Turm (Code 2) und folge dem Pfeil.',
  { short: 'Code von GUT', help: 'Neuer Code = 6 − alter Code.', wrong: { 2: '2 war GUT vor dem Umpolen. Rechne 6 − 2.' } });

/* ---------- Überblick: Wer ist 100 %? ---------- */

export const U1_OPTIONS = ['alle im Osten', 'alle Misstrauenden', 'alle Befragten in der Tabelle', 'West und Ost je für sich'];
export const U1: { question: string; answer: number; right: string; wrong: string }[] = [
  { question: 'Wie viel Prozent der Befragten im Osten misstrauen den Politikern?', answer: 0, right: 'Basis: die Befragten im Osten.', wrong: 'Die Gruppe nach ‚der‘: die Befragten im Osten.' },
  { question: 'Wie viel Prozent der Misstrauenden leben im Osten?', answer: 1, right: 'Basis: die Misstrauenden.', wrong: 'Die Gruppe nach ‚der‘: die Misstrauenden.' },
  { question: 'Wie viel Prozent aller Befragten sind Misstrauende aus dem Osten?', answer: 2, right: 'Basis: alle. Das sind Gesamtprozente.', wrong: '‚Aller Befragten‘: Die ganze Tabelle ist 100 %.' },
  { question: 'Misstrauen Befragte im Osten häufiger als im Westen?', answer: 3, right: 'Ein Vergleich: Jede Gruppe der UV ist 100 %.', wrong: 'Für einen Vergleich ist jede Gruppe für sich 100 %, dann vergleichst du die Anteile.' },
];
export const U1_ALL_RIGHT = 'Alle vier richtig. In R gibt `crosstab(eastwest, misstrauen, percentages = "row")` die Antwort auf die letzte Frage: Im Westen misstrauen 70,6 %, im Osten 78,3 %.';

/** Ü2: Voraussetzungen der Kreuztabelle. */
export const PREREQUISITES: [string, string, string][] = [
  ['Variablen', 'zwei Variablen mit wenigen Stufen', 'Viele Stufen machen die Tabelle unlesbar. Erst zu Gruppen zusammenfassen (Grundlage 1) und sagen, wie.'],
  ['Gruppen', 'genug Menschen je Gruppe', 'Prozent aus 14 Menschen schwanken stark. n je Gruppe nennen.'],
  ['fehlende Werte', 'gültige Angaben bei beiden Variablen', 'Wer bei einer Variable fehlt, steht nicht in der Tabelle; bei Split-Fragen fast ein Drittel. N (valid) nennen.'],
  ['Prozentbasis', 'eine Basis, die zur Frage passt', 'Gleiche Zelle, andere Basis, andere Aussage. Immer sagen, wer 100 % ist.'],
  ['Deutung', 'eine begründete Leserichtung (UV, AV)', 'Ein Zusammenhang ist keine Ursache. Andere Erklärungen bedenken.'],
  ['Gewichtung', 'Aussagen über ganz Deutschland brauchen Gewichte', 'Der Osten ist im ALLBUS absichtlich stärker vertreten. Hier ungewichtet; Gewichtung in Sitzung 6.'],
];

/* ---------- Erst festlegen ---------- */

export const PREDICTIONS: Record<'a1' | 'a2' | 'a3' | 'a4', { id: string; prompt: string; options: string[]; resolve?: string }> = {
  a1: { id: 'a1', prompt: 'Was schätzt du: Wie viele der Befragten mit gültiger Antwort stimmen der Aussage ‚Die Politiker kümmern sich nicht viel darum, was Leute wie ich denken‘ zu, voll oder eher?', options: ['weniger als ein Drittel', 'etwa die Hälfte', 'mehr als zwei Drittel'], resolve: 'Tatsächlich sind es 73,1 %, also mehr als zwei Drittel.' },
  a2: { id: 'a2', prompt: 'Wer ist bei ‚87 Prozent der Nichtwähler‘ die Basis, also 100 %?', options: ['alle Befragten', 'die Nichtwählenden', 'die Misstrauenden'] },
  a3: { id: 'a3', prompt: 'Welche Gruppen musst du vergleichen, um die Leitfrage zu beantworten?', options: ['Misstrauende mit übrigen: Wie viele von ihnen würden nicht wählen?', 'Nichtwählende mit Wählenden: Wie viele von ihnen misstrauen?'] },
  a4: { id: 'a4', prompt: 'Du nimmst die Regel aus Aufgabe 1, `1:2=1 [misstraut]`, ohne Umpolen für pe05. Wen zählt die neue Variable dann als ‚misstraut‘?', options: ['Menschen, die den Politikern misstrauen', 'Menschen, die den Politikern vertrauen'] },
};

/* ---------- Hilfe in drei Stufen ---------- */

/** Stufe 1 Denkanstoß, Stufe 2 Wo schaue ich?, Stufe 3 Lösung; Code in `Backticks`. */
export const HINTS: Record<'a1' | 'a2' | 'a3' | 'a4', [string, string, string]> = {
  a1: [
    'Eine Regel liest du ‚aus diesen alten Codes wird dieser neue Code‘. Zustimmung heißt hier: ‚stimme voll zu‘ und ‚stimme eher zu‘. Welche Codes haben diese beiden Antworten?',
    'Die Codes von pe01 stehen in Schritt 1 in der Spalte Value. Von bis schreibt R mit Doppelpunkt: 1:2 heißt 1 bis 2. Die Größe der Gruppen steht in den Ausgaben von Schritt 2 und 3 in der Spalte N, der Mittelwert in der Kopfzeile darüber.',
    'In Schritt 2 heißt die Regel für misstrauen `"1:2=1 [misstraut]; 3:4=0 [misstraut nicht]; else=NA"`. Dann misstrauen 2.630 Befragte, 968 nicht; 236 würden nicht wählen, 3.748 wählen. Die 186 nicht Wahlberechtigten sind leer (NA). mean=0.73 heißt: 73 % misstrauen.',
  ],
  a2: [
    'Bei ‚87 Prozent der Nichtwähler‘ sind die Nichtwählenden 100 %. In der Tabelle sind sie eine Spalte.',
    'Stell in Schritt 1 `percentages = "col"` ein und lies die Zelle Zeile ‚misstraut‘, Spalte ‚würde nicht wählen‘: oben die Anzahl, darunter das Prozent. In Schritt 2 stehen row %, col % und total % derselben Zelle untereinander.',
    'Mit `"col"`: 87,0 %, 127 Befragte, Basis 146 Nichtwählende. Zuordnung: Misstrauende → 6,5 % (row), Nichtwählende → 87,0 % (col), alle → 4,6 % (total). Die Zahl stimmt.',
  ],
  a3: [
    'Die Leitfrage fragt nach den Misstrauenden: Wie viele von ihnen würden nicht wählen? Dann sind die Misstrauenden 100 %. Zum Vergleich brauchst du dieselbe Zahl für die übrigen.',
    'Stell `percentages = "row"` ein, weil misstrauen in den Zeilen steht. Lies in der Spalte ‚würde nicht wählen‘ beide Zeilen ab. Prozentpunkte: die beiden Zahlen abziehen.',
    'Mit `"row"`: Misstrauende 6,5 % (127 von 1.956), übrige 2,3 % (19 von 829), Abstand 4,2 Prozentpunkte. 93,5 % der Misstrauenden würden wählen. Ein Zusammenhang ja, ‚gar nicht mehr‘ nein. Die Tabelle zeigt keine Ursache.',
  ],
  a4: [
    'Wer pe05 zustimmt, vertraut. Nach dem Umpolen steht die kleine Zahl für Ablehnung, also für Misstrauen, genau wie bei pe01.',
    'Welches Wort bei welchem Code steht, zeigt Schritt 1. Misstrauen sind nach dem Umpolen die Codes 1 und 2. Die Prozent liest du in Schritt 2 in der Spalte ‚würde nicht wählen‘.',
    'Regel in Schritt 2: `"1:2=1 [misstraut]; 3:4=0 [misstraut nicht]; else=NA"`. Ergebnis: 6,9 % der Misstrauenden und 3,2 % der übrigen würden nicht wählen. Ohne Umpolen sind die Gruppen vertauscht (3,2 % und 6,9 %). Die Gegenprobe bestätigt Aufgabe 3.',
  ],
};

/* ---------- Hilfe bei R-Fehlermeldungen ---------- */

/** Text mit Code-Stücken und Links, ohne JSX. */
export type Rich = (string | { code: string } | { href: string; text: string })[];
export const ERROR_HELP_TITLE = 'Hilfe: R meldet einen Fehler';
export const ERROR_HELP_CAPTION = 'Was R sagt und was du tust';
export const ERROR_HELP: { says: Rich; helps: Rich }[] = [
  { says: [{ code: 'konnte Funktion "rec" nicht finden' }, ' (oder ', { code: '"%>%"' }, ', ', { code: '"crosstab"' }, '); englisch ', { code: 'could not find function "rec"' }], helps: ['Den ', { href: '#r1', text: 'Startblock aus „R lesen“' }, ' ausführen.'] },
  { says: [{ code: "Objekt 'allbus' nicht gefunden" }, ' / ', { code: "object 'allbus' not found" }], helps: ['Die Zeile mit ', { code: 'read_spss()' }, ' aus dem Startblock ausführen.'] },
  { says: [{ code: "Can't select columns that don't exist. ✖ Column `misstrauen` doesn't exist." }, ' oder ', { code: 'Row variable `misstrauen` not found in data.' }], helps: ['R kennt die Variable nicht. Steht die ', { code: 'mutate()' }, '-Zeile, die sie bildet, oben in derselben Vorlage, und ist der Name dort genauso geschrieben? Kopiere die Vorlage neu und ändere nur die markierten Stellen.'] },
  { says: ['Erst erscheint eine lange Tabelle (', { code: '# A tibble: 5,246 × …' }, '), dann ', { code: "Objekt 'misstrauen' nicht gefunden" }, ' / ', { code: "object 'misstrauen' not found" }], helps: ['Nach ', { code: ')' }, ' am Ende von ', { code: 'mutate(' }, ' fehlt ', { code: '%>%' }, '. Dann endet die Kette dort, und ', { code: 'crosstab()' }, ' oder ', { code: 'frequency()' }, ' bekommt keine Daten.'] },
  { says: [{ code: 'Invalid new value: "1 [misstraut], 3:4=0 …"' }], helps: ['Regeln trennt ein Semikolon ', { code: ';' }, ', kein Komma.'] },
  { says: [{ code: 'Invalid new value: "=1" in rule "1:2==1"' }], helps: ['In ', { code: 'rules' }, ' steht ein einfaches ', { code: '=' }, '. Das doppelte ', { code: '==' }, ' gehört in ', { code: 'filter()' }, '.'] },
  { says: [{ code: 'Invalid old value: "STIMME VOLL ZU"' }], helps: ['Links vom ', { code: '=' }, ' stehen Codes (Spalte Value in ', { code: 'frequency()' }, '), keine Wörter.'] },
  { says: [{ code: '`rules` is required' }], helps: ['Vor der Regel fehlt ', { code: 'rules =' }, '.'] },
  { says: [{ code: "Objekt 'misstraut' nicht gefunden" }, ' / ', { code: "object 'misstraut' not found" }], helps: ['Die Regel braucht Anführungszeichen außen herum: ', { code: 'rules = "1:2=1 [misstraut]; …"' }, '.'] },
  { says: [{ code: `'arg' sollte eines von '"row", "none", "col", "total", "all"' sein` }, ' / ', { code: "'arg' should be one of …" }], helps: [{ code: 'percentages' }, ' falsch geschrieben. Erlaubt sind ', { code: '"row"' }, ', ', { code: '"col"' }, ', ', { code: '"total"' }, ', ', { code: '"all"' }, ', in Anführungszeichen.'] },
  { says: ['In der Konsole erscheint ', { code: '+' }, ' und nichts passiert'], helps: ['Eine Klammer oder ein Anführungszeichen ist nicht geschlossen. Drück Esc und kopiere die Vorlage neu.'] },
  { says: ['Keine Fehlermeldung, aber eine Regel für einen fehlenden Wert (z. B. ', { code: '-8=2 [weiß nicht]' }, ') erzeugt keine neue Gruppe'], helps: ['Fehlende Werte sind für ', { code: 'rec()' }, ' schon leer; ihre Codes lassen sich in einer Regel nicht ansprechen. Für die Aufgaben ist das nicht nötig.'] },
  { says: ['Keine Fehlermeldung, aber die Zahl passt nicht'], helps: ['Prüf die neue Variable mit ', { code: 'frequency()' }, ': Stimmen die Gruppen? Und in der Tabelle: Wer ist 100 %, Zeile oder Spalte?'] },
];

/* ---------- Prüf dich selbst ---------- */

export const SELF_TEST: { question: string; options: string[]; answer: number; why: string }[] = [
  { question: 'In einer Tabelle steht: „78 % der Befragten im Osten misstrauen den Politikern.“ Wer ist 100 %?', options: ['alle Misstrauenden', 'alle Befragten im Osten', 'alle Befragten'], answer: 1, why: 'Die Gruppe nach ‚der‘ ist die Basis: die Befragten im Osten (Grundlage 2).' },
  { question: 'Was macht else=NA in rec()?', options: ['setzt alle nicht genannten Codes auf 0', 'macht alle nicht genannten Codes leer, sie zählen nicht mit', 'löscht die alte Variable'], answer: 1, why: 'Alles, was in keiner Regel steht, wird NA und fällt aus Tabellen und Prozenten heraus. Mit else=0 würde es als 0 mitgezählt (Grundlage 1).' },
  { question: 'Du willst wissen, ob Ältere häufiger wählen wollen als Jüngere. Altersgruppen stehen in den Zeilen. Welche Prozent nimmst du?', options: ['Zeilenprozente', 'Spaltenprozente', 'Gesamtprozente'], answer: 0, why: 'Das Alter ist die UV. Jede Altersgruppe ist 100 %, und sie steht in den Zeilen (Grundlage 3).' },
  { question: 'Ein Anteil steigt von 20 % auf 30 %. Wie beschreibst du das richtig?', options: ['um 10 Prozent', 'um 10 Prozentpunkte', 'um 30 Prozentpunkte'], answer: 1, why: 'Abstand zweier Anteile: abziehen, 30 − 20 = 10 Prozentpunkte. In Prozent wären es 50 % mehr (Grundlage 3).' },
  { question: 'Eine Aussage lautet „Ich vertraue …“, eine andere „Ich misstraue …“, beide von 1 „stimme voll zu“ bis 4. Was tust du, bevor du für beide dieselbe Regel nimmst?', options: ['nichts, die Codes sind gleich', 'eine der beiden umpolen', 'beide löschen'], answer: 1, why: 'Bei gleicher Regel hieße Code 1 einmal Vertrauen, einmal Misstrauen. Nach dem Umpolen meint eine kleine Zahl bei beiden dasselbe (Grundlage 4, Aufgabe 4).' },
  { question: 'Warum stehen in deiner Kreuztabelle nur 2.785 von 5.246 Befragten?', options: ['R hat Befragte zufällig weggelassen', 'wer bei einer der beiden Variablen keine gültige Angabe hat, fehlt', 'es sind nur Nichtwählende'], answer: 1, why: 'Eine Kreuztabelle braucht gültige Angaben bei beiden Variablen. pe01 stand zudem nur in einem Teil der Fragebögen. Darum nennst du N (valid) (Aufgabe 2).' },
];

/* ---------- Skript zum Mitnehmen ---------- */

export const SCRIPT_FILE = 'sitzung5.R';
/** Skript sitzung5.R, wörtlich aus dem Plan: alle neuen Variablen einmal oben, gelöste Stellen, ohne Probier-Werkstätten. */
export const SCRIPT = `# Sitzung 5: Kreuztabellen
# Statistikatlas, Methoden Ib, ALLBUS 2023 (ZA8831 v1.3.0), ungewichtet
# Angepasste Stellen stehen hier in ihrer gelösten Form.

# ---- Startblock ----
library(tidyverse)
library(mariposa)

allbus <- read_spss("ZA8831_v1-3-0.sav")

# ---- Alle neuen Variablen dieser Sitzung einmal bilden und ablegen ----
# teilzeit: R lesen; misstrauen, nichtwahl: Aufgabe 1; pe05_um bis misstrauen_ohne: Aufgabe 4
allbus <- allbus %>%
  mutate(
    teilzeit        = rec(work, rules = "2:3=1 [Teilzeit]; 1=0 [Vollzeit]; else=NA"),
    misstrauen      = rec(pe01, rules = "1:2=1 [misstraut]; 3:4=0 [misstraut nicht]; else=NA"),
    nichtwahl       = rec(pv01, rules = "91=1 [würde nicht wählen]; 1:90=0 [würde wählen]; else=NA"),
    pe05_um         = rec(pe05, rules = "rev"),
    misstrauen_pe05 = rec(pe05_um, rules = "1:2=1 [misstraut]; 3:4=0 [misstraut nicht]; else=NA"),
    misstrauen_ohne = rec(pe05, rules = "1:2=1 [misstraut]; 3:4=0 [misstraut nicht]; else=NA")
  )

# ---- R lesen: die neue Variable prüfen ----
allbus %>%
  frequency(teilzeit)

# ---- R lesen: eine Kreuztabelle ----
allbus %>%
  crosstab(sex, teilzeit, percentages = "row")

# ---- Aufgabe 1: Codes von pe01 ----
allbus %>%
  frequency(pe01)

# ---- Aufgabe 1: Gruppen prüfen ----
allbus %>%
  frequency(misstrauen)

allbus %>%
  frequency(nichtwahl)

# ---- Aufgabe 2: Spaltenprozente, die 87 % ----
allbus %>%
  crosstab(misstrauen, nichtwahl, percentages = "col")

# ---- Aufgabe 2: alle drei Prozentbasen ----
allbus %>%
  crosstab(misstrauen, nichtwahl, percentages = "all")

# ---- Aufgabe 3: Zeilenprozente, Gruppen vergleichen ----
allbus %>%
  crosstab(misstrauen, nichtwahl, percentages = "row")

# ---- Aufgabe 4: pe05 umgepolt prüfen ----
allbus %>%
  frequency(pe05_um)

# ---- Aufgabe 4: Gegenprobe ----
allbus %>%
  crosstab(misstrauen_pe05, nichtwahl, percentages = "row")

# ---- Aufgabe 4: zum Vergleich ohne Umpolen ----
allbus %>%
  crosstab(misstrauen_ohne, nichtwahl, percentages = "row")

# ---- Wiederholung: Chi-Quadrat ----
allbus %>%
  chi_square(misstrauen, nichtwahl)
`;

/* ---------- Textfassungen der Bilder ---------- */

export const ALT = {
  regel: 'Die Regel "2:3=1 [Teilzeit]; 1=0 [Vollzeit]; else=NA" in drei Teilen, getrennt durch Semikolons, die „nächste Regel“ bedeuten. Erster Teil: 2:3 sind die alten Codes 2 bis 3, das Gleichheitszeichen heißt „werden zu“, 1 ist der neue Code, Teilzeit in eckigen Klammern ist der Aufkleber; zusammen: Teilzeit und nebenher werden 1 mit dem Aufkleber Teilzeit. Zweiter Teil: Code 1 wird 0 mit dem Aufkleber Vollzeit. Dritter Teil: else=NA, alles andere wird leer, also nicht Erwerbstätige und alle ohne Angabe.',
  rec: 'Links der Turm work vom Typ dbl+lbl mit sechs Steinen, zum Beispiel sechs Befragte: 1 VOLLZEIT, GANZTAGS; 2 TEILZEIT; 4 NICHT ERWERBSTAETIG; 3 NEBENHER BERUFSTAE.; ein leerer gestrichelter Stein mit dem Aufkleber KEINE ANGABE; 1 VOLLZEIT, GANZTAGS. Ein grüner Pfeil mit dem Code rec(work, rules = "2:3=1 [Teilzeit]; 1=0 [Vollzeit]; else=NA") führt zum Turm teilzeit: 0 Vollzeit; 1 Teilzeit; ein leerer Stein NA, orange umrandet mit der Notiz else=NA; 1 Teilzeit; ein leerer Stein NA; 0 Vollzeit. Darunter wird die Bauplatte allbus mit 5,246 × 579 durch einen grünen Pfeil mutate() zur Bauplatte mit 5,246 × 580; ihr neuer Turm ganz rechts heißt teilzeit.',
  crosstab: 'Ausgabe von crosstab(sex, teilzeit, percentages = "row"). Kopf: Zeilenvariable sex, Spaltenvariable teilzeit, Zeilenprozente, N (valid) 3359, Missing 1887. Männer: 1379 Vollzeit (82,1 %), 301 Teilzeit (17,9 %), zusammen 1680. Frauen: 805 Vollzeit (48,3 %), 860 Teilzeit (51,7 %), zusammen 1665. Divers: 8 Vollzeit (57,1 %), 6 Teilzeit (42,9 %), zusammen 14. Total: 2192 Vollzeit (65,3 %), 1167 Teilzeit (34,7 %), zusammen 3359. Beschriftet sind: die Zeilen- und Spaltenvariable, die Art der Prozent, N und Missing, die Zelle Frau/Teilzeit mit Anzahl oben und Prozent unten, und die Total-Spalte und -Zeile als Summen.',
  mutateA1: 'Zwei Paare von Türmen aus der Bauplatte allbus, zum Beispiel fünf Befragte. Oben links pe01: 2 STIMME EHER ZU, 4 STIMME GAR NICHT ZU, ein leerer Stein mit dem Aufkleber TNZ: SPLIT, 1 STIMME VOLL ZU, 3 STIMME EHER NICHT ZU. Daneben der neue Turm misstrauen, verbunden durch dünne graue Linien in jeder Zeile: vier gestrichelte Steine mit Fragezeichen, beschriftet deine Regel aus Schritt 2, und in der Split-Zeile ein leerer Stein NA. Unten links pv01: 91 WUERDE NICHT WAEHLEN, 2 SPD, ein leerer Stein mit dem Aufkleber NICHT WAHLBERECHTIGT, 4 DIE GRUENEN, 1 CDU-CSU. Daneben, wieder durch graue Linien Zeile für Zeile verbunden, der neue Turm nichtwahl: 1 würde nicht wählen, 0 würde wählen, ein leerer Stein NA, orange umrandet mit der Notiz minus 50 steht in keiner Regel, else gleich NA, dann 0 würde wählen und 0 würde wählen.',
  dreiBasen: 'Dreimal dieselbe Kreuztabelle von Geschlecht und Erwerbsform; die Zelle Frau und Teilzeit, 860 Befragte, ist jedes Mal orange. Gelb ist die Basis. Links Zeilenprozente, jede Zeile ist 100 Prozent: 51,7 Prozent der Frauen arbeiten Teilzeit. In der Mitte Spaltenprozente, jede Spalte ist 100 Prozent: 73,7 Prozent der Teilzeitkräfte sind Frauen. Rechts Gesamtprozente, alle zusammen sind 100 Prozent: 25,6 Prozent aller Erwerbstätigen sind Frauen in Teilzeit. Alle Zahlen stehen in der Tabelle unter dem Bild.',
  leserichtung: 'Drei Balken auf 100 Prozent. Männer, 1.680 Personen: 82,1 Prozent Vollzeit, 17,9 Prozent Teilzeit. Frauen, 1.665 Personen: 48,3 Prozent Vollzeit, 51,7 Prozent Teilzeit. Divers, 14 Personen, blass gezeichnet mit dem Hinweis, dass Prozent bei so wenigen Menschen stark schwanken: 57,1 Prozent Vollzeit, 42,9 Prozent Teilzeit. Eine grüne Klammer zwischen den Teilzeit-Anteilen von Männern und Frauen: 51,7 minus 17,9 gleich 33,8 Prozentpunkte.',
  nenner: 'Drei waagrechte Balken, so lang wie ihr Nenner. Oben ein kurzer Balken, die 146 Nichtwählenden; das orange Stück von 127 Menschen füllt ihn fast ganz: 87,0 Prozent, Spaltenprozent. In der Mitte ein langer Balken, die 1.956 Misstrauenden; dasselbe orange Stück ist ein kleiner Teil: 6,5 Prozent, Zeilenprozent. Unten der längste Balken, alle 2.785 in der Tabelle: 4,6 Prozent, Gesamtprozent.',
  umpolen: 'Links die Wirtschaftslage vorher: Code 1 sehr gut, 95 Befragte; 2 gut, 1.338; 3 teils/teils, 2.684; 4 schlecht, 919; 5 sehr schlecht, 158. Rechts nach dem Umpolen: Code 1 sehr schlecht, 158; 2 schlecht, 919; 3 teils/teils, 2.684; 4 gut, 1.338; 5 sehr gut, 95. Pfeile verbinden gleiche Wörter. Formel: neuer Code gleich 6 minus alter Code, weil 1 plus 5 gleich 6; zum Beispiel 6 minus 1 gleich 5, 6 minus 2 gleich 4, 6 minus 3 gleich 3. Mittelwert vorher 2,94, nachher 3,06.',
  umpolenPe05: 'Links der Turm pe05, zum Beispiel fünf Befragte: 1 STIMME VOLL ZU, 3 STIMME EHER NICHT ZU, 4 STIMME GAR NICHT ZU, 2 STIMME EHER ZU und ein leerer Stein TNZ: SPLIT. Ein grüner Pfeil rec(pe05, rules = "rev") führt zum Turm pe05_um: 4 STIMME VOLL ZU, 2 STIMME EHER NICHT ZU, 1 STIMME GAR NICHT ZU, 3 STIMME EHER ZU und ein leerer Stein NA. Unter pe05_um sind die Codes 1 und 2 eingeklammert mit dem Text: jetzt wie bei pe01, kleine Zahl gleich Misstrauen. Unter pe05 grau: vorher, kleine Zahl gleich Vertrauen.',
} as const;
