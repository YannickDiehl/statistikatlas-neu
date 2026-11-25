// Sitzung 3 „Erste Auszählung“: Zahlen, Vorlagen und Fragen aus dem Inhaltsplan sitzung03.md, nur Daten.
// Alle Zahlen: ALLBUS 2023, ZA8831 v1.3.0, ungewichtet (eine Vergleichszahl gewichtet), nur Aggregate.
// Geprüft in allbus.local.test.ts. Dozentenentscheid: kein Filter-Code für fehlende Werte.
import { answerNumbers, type Question } from '../answers';
import { parseMarks } from '../workshop/editor';

/* ---------- Daten: Häufigkeitstabellen, wie frequency() sie druckt ---------- */

export type FreqRow = { value: number; label: string; n: number; raw: number; valid: number; cum: number };
export type MissRow = { value: number; label: string; n: number; raw: number };

/** Grundlage 1: la01 (Freizeit: Bücher lesen), die echte Tabelle für alle 5.246 Befragten. */
export const LA01 = {
  title: 'la01 (FREIZEIT: BUECHER LESEN)',
  header: '# total N=5246 valid N=5223 mean=3.08 sd=1.42 skewness=-0.17',
  rows: [
    { value: 1, label: 'TAEGLICH', n: 1041, raw: 19.84, valid: 19.93, cum: 19.93 },
    { value: 2, label: 'MIND. 1X PRO WOCHE', n: 973, raw: 18.55, valid: 18.63, cum: 38.56 },
    { value: 3, label: 'MIND. 1X PRO MONAT', n: 704, raw: 13.42, valid: 13.48, cum: 52.04 },
    { value: 4, label: 'SELTENER', n: 1551, raw: 29.57, valid: 29.70, cum: 81.73 },
    { value: 5, label: 'NIE', n: 954, raw: 18.19, valid: 18.27, cum: 100.00 },
  ] as FreqRow[],
  missing: [
    { value: -42, label: 'DATENFEHLER: MFN', n: 4, raw: 0.08 },
    { value: -9, label: 'KEINE ANGABE', n: 19, raw: 0.36 },
  ] as MissRow[],
  valid: 5223, rawValid: 99.56, totalMissing: 23, rawMissing: 0.44, total: 5246, mean: 3.08,
};

/** Aufgabe 1: ep04 (Wirtschaftslage in Deutschland in einem Jahr). */
export const EP04 = {
  header: '# total N=5246 valid N=5188 mean=3.40 sd=0.87 skewness=-0.16',
  rows: [
    { value: 1, label: 'WESENTLICH BESSER', n: 34, raw: 0.65, valid: 0.66, cum: 0.66 },
    { value: 2, label: 'ETWAS BESSER', n: 813, raw: 15.50, valid: 15.67, cum: 16.33 },
    { value: 3, label: 'GLEICHBLEIBEND', n: 1836, raw: 35.00, valid: 35.39, cum: 51.72 },
    { value: 4, label: 'ETWAS SCHLECHTER', n: 2067, raw: 39.40, valid: 39.84, cum: 91.56 },
    { value: 5, label: 'WESENTL. SCHLECHTER', n: 438, raw: 8.35, valid: 8.44, cum: 100.00 },
  ] as FreqRow[],
  valid: 5188, totalMissing: 58,
  missing: { dataError: 5, noAnswer: 37, dontKnow: 16 },
  mean: 3.40,
};

/** Grundlage 2b: st01 (Vertrauen zu Mitmenschen). */
export const ST01 = {
  trust: { n: 865, raw: 16.49, valid: 24.30 },
  careful: { n: 1225, raw: 23.35, valid: 34.41 },
  depends: { n: 1463, raw: 27.89, valid: 41.10 },
  other: { n: 7, raw: 0.13, valid: 0.20 },
  valid: 3560, totalMissing: 1686, rawMissing: 32.14,
  missing: { split: 1647, dataError: 22, noAnswer: 12, dontKnow: 5 },
  /** Eigene Basis mit „weiß nicht“: 1463 / (3560 + 5) * 100. */
  ownBase: 41.04,
};

/** Hundert Steine nach größten Resten (Bild B5): trauen, vorsichtig, darauf an, fehlt. */
export function largestRemainder(percents: number[]): number[] {
  const base = percents.map(Math.floor);
  const rest = 100 - base.reduce((a, b) => a + b, 0);
  const order = percents.map((p, i) => ({ i, r: p - Math.floor(p) })).sort((a, b) => b.r - a.r).slice(0, rest);
  for (const { i } of order) base[i]++;
  return base;
}
/** Basis alle 5.246: trauen, vorsichtig, darauf an, sonstiges, fehlt. */
export const STONES_ALL = largestRemainder([ST01.trust.raw, ST01.careful.raw, ST01.depends.raw, ST01.other.raw, ST01.rawMissing]);
/** Basis 3.560 gültige: trauen, vorsichtig, darauf an, sonstiges. */
export const STONES_VALID = largestRemainder([ST01.trust.valid, ST01.careful.valid, ST01.depends.valid, ST01.other.valid]);

/** Aufgabe 2: pv01 (Wahlabsicht). */
export const PV01 = {
  cdu: { n: 988, raw: 18.83, valid: 24.80 },
  valid: 3984, totalMissing: 1262, rawMissing: 24.06, total: 5246,
  missing: { notEligible: 186, dataError: 18, noAnswer: 149, dontKnow: 603, refused: 306 },
  dontKnowRaw: 11.49,
  parties: { afd: 480, fdp: 325, linke: 260, gruene: 752 },
  /** CDU/CSU, Valid %, gewichtet mit wghtpew (Hinweis unter Aufgabe 2). */
  cduValidWeighted: 25.81,
  /** Kopfzeile von frequency(pv01): mean=16.14 (im Text gerundet 16,1). */
  mean: 16.14,
};

/** Grundlage 3c und 4: dh04 (Personen im Haushalt). */
export const DH04 = {
  describe: { mean: 2.342, median: 2, sd: 1.177, range: 11, iqr: 1, skewness: 1.209, n: 5144, missing: 102 },
  /** −32 NICHT GENERIERBAR. */
  notGenerable: 102,
  /** Valid % und Cum. % für 1 bis 5 Personen; 6 und mehr ist der Rest bis 100. */
  valid: [22.96, 44.46, 15.01, 12.58, 3.79],
  cum: [22.96, 67.42, 82.43, 95.00, 98.79],
  sixPlus: 1.21,
  aboveMean: 32.58,
};

/** Grundlage 3b: rd01 (Konfession). */
export const RD01 = { mean: 4.06, cumCode4: 49.31, cumCode5: 52.32 };

/** Aufgaben 3 und 4: dw19 (Dauer der Arbeitslosigkeit in Wochen). */
export const DW19 = {
  mean: 54.708, median: 26, n: 514, missing: 4732,
  missingParts: { filter: 4709, noAnswer: 16, dataError: 7 },
  max: 520,
  cum: { 52: 74.71, 53: 75.10, 54: 75.29, 55: 75.49 } as Record<number, number>,
  /** Befragte über dem Mittelwert (127 von 514, also 24,71 %). */
  above: 127,
  aboveShare: 24.71,
};

/** Grundlage 2a: Beispiele zu Codes einzelner Fragen. */
export const ID02_NONE = 15;

/* ---------- Konstruierte Beispiele (keine ALLBUS-Daten) ---------- */

/** Bild B1: Turm la01 von zwölf Befragten, von oben nach unten; null ist der leere Stein mit −9 KEINE ANGABE. */
export const TOWER12: (number | null)[] = [4, 1, 3, 4, 2, null, 1, 4, 5, 2, 4, 1];
export const LA01_LABELS: Record<number, string> = { 1: 'TAEGLICH', 2: 'MIND. 1X PRO WOCHE', 3: 'MIND. 1X PRO MONAT', 4: 'SELTENER', 5: 'NIE' };

/** Bild B8: neun Haushalte, von oben nach unten; dazu die WG mit 12 Personen. */
export const HOUSEHOLDS9 = [2, 1, 4, 2, 3, 2, 5, 1, 2];
export const WG = 12;

/* ---------- Textfassungen der Bilder ---------- */

export const TOWER_TEXT: [string, string, string] = [
  'Schritt 1: Die Datenreihe der Variable la01 als Turm mit zwölf Steinen, zum Beispiel zwölf Befragte. Jeder Stein ist ein Wert. Elf Werte tragen einen gültigen Code: dreimal 1 TÄGLICH, zweimal 2 MINDESTENS EINMAL PRO WOCHE, einmal 3 MINDESTENS EINMAL PRO MONAT, viermal 4 SELTENER, einmal 5 NIE. Ein Stein ist leer: ein fehlender Wert mit dem Missing-Code −9 KEINE ANGABE.',
  'Schritt 2: Gleiche Werte liegen jetzt auf einem Stapel nebeneinander, in der Reihenfolge der Codes: 3, 2, 1, 4 und 1 Steine, die Häufigkeiten der fünf Codes. Der fehlende Wert liegt getrennt darunter.',
  'Schritt 3: Neben jedem Stapel steht seine Höhe in der Spalte N: die absolute Häufigkeit. Die fünf Stapel zusammen sind 11 gültige Werte (Total valid), der leere Stein ist 1 fehlender Wert (Total missing), alle zusammen 12 (Total).',
];

export const PERCENT_FORMULA_TEXT = 'Prozent gleich absolute Häufigkeit geteilt durch Prozentbasis, mal 100. Für TAEGLICH mit der Basis 5.223 gültige Antworten: 1.041 geteilt durch 5.223 mal 100 ergibt 19,93, das ist Valid %. Mit der Basis 5.246 alle Befragten ergibt es 19,84, das ist Raw %.';

export const STRIP_LA01_TEXT = 'Ein Streifen von 0 bis 100 Prozent, in fünf Abschnitte geteilt, so breit wie die Valid %: täglich 19,93, mindestens einmal pro Woche 18,63, mindestens einmal pro Monat 13,48, seltener 29,70, nie 18,27. Die Grenzen liegen bei 19,93, 38,56, 52,04 und 81,73 Prozent.';
export const STRIP_LA01_SOLVED = 'Die Mitte bei 50 Prozent liegt im Abschnitt mindestens einmal pro Monat (zwischen 38,56 und 52,04): Das ist der Median. Der breiteste Abschnitt ist seltener: Das ist der Modus.';

export const SHELVES_TEXT = 'Drei Regale: 1 Studiendesign, die Frage kam nie bei der Person an. 2 Befragte, die Person hat so geantwortet oder nicht geantwortet. 3 Erfassung, der Wert ging beim Ausfüllen oder Abtippen verloren. Dazu sieben Missing-Codes zum Zuordnen, je mit einer Auswahlliste.';
export const SHELVES_SOLVED = 'Richtig ist: −11 und −10 ins Regal Studiendesign, −9, −8 und −7 ins Regal Befragte, −42 und −41 ins Regal Erfassung.';

export const STONES_TEXT = {
  all: 'Hundert Kästchen, jedes steht für ein Prozent aller 5.246 Befragten. 17 Kästchen man kann trauen, 23 muss vorsichtig sein, 28 kommt darauf an, 32 Kästchen sind leer: Hier fehlt die Antwort, meist weil die Frage nie gestellt wurde.',
  valid: 'Hundert Kästchen, jedes steht für ein Prozent der 3.560 gültigen Antworten. 24 Kästchen man kann trauen, 35 muss vorsichtig sein, 41 kommt darauf an. Leere Kästchen gibt es nicht mehr.',
};

export const BASES_TEXT = 'Dieselben 1.463 Antworten „kommt darauf an“, geteilt durch drei verschiedene Basen, jeweils mal 100. Durch alle 5.246 Befragten: 27,89 Prozent, das ist Raw %. Durch die 3.560 gültigen: 41,10 Prozent, das ist Valid %. Durch die gültigen plus die 5 „weiß nicht“, zusammen 3.565: 41,04 Prozent, eine eigene Basis.';

export const CDU_BASES_TEXT = 'Dieselben 988 Antworten CDU-CSU, geteilt durch drei Basen: alle 5.246 Befragten, darunter 1.262 ohne gültige Antwort, das ergibt Raw %. Die 3.984 gültigen plus die 603 „weiß nicht“, das rechnet die Vorlage. Nur die 3.984 gültigen, das ergibt Valid %. Je kleiner die Basis, desto größer der Anteil.';

export const ROW_TEXT: [string, string, string, string] = [
  'Eine Datenreihe mit neun Werten, zum Beispiel neun Befragte: 2, 1, 4, 2, 3, 2, 5, 1, 2 Personen im Haushalt.',
  'Sortiert: 1, 1, 2, 2, 2, 2, 3, 4, 5. Der fünfte Wert steht in der Mitte, vier davor, vier danach: 2. Das ist der Median.',
  'Alle Werte zusammen ergeben 22, geteilt durch 9 ergibt 2,44. Das ist der Mittelwert, der Schwerpunkt der Werte.',
  'Mit einer zehnten Person aus einer WG mit 12 Personen: Sortiert 1, 1, 2, 2, 2, 2, 3, 4, 5, 12. Die Mitte liegt zwischen dem fünften und sechsten Wert, beide sind 2: Der Median bleibt 2. Der Mittelwert steigt auf 34 geteilt durch 10, also 3,4.',
];

export const MEAN_FORMULA_TEXT = 'Der Mittelwert x quer ist die Summe aller Werte x geteilt durch ihre Anzahl n. Im Beispiel: Die Summe der neun Werte ist 22, n ist 9, 22 geteilt durch 9 ergibt 2,44.';

export const STRIP_DH04_TEXT = 'Ein Streifen von 0 bis 100 Prozent in sechs Abschnitten nach Valid %: 1 Person 22,96, 2 Personen 44,46, 3 Personen 15,01, 4 Personen 12,58, 5 Personen 3,79, 6 und mehr 1,21. Kumuliert: bis 1 Person 22,96, bis 2 Personen 67,42, bis 3 Personen 82,43, bis 4 Personen 95,00, bis 5 Personen 98,79. Der Mittelwert 2,34 liegt zwischen 2 und 3 Personen, der Median bei 2.';
export const STRIP_DH04_SOLVED = 'Höchstens 2 Personen: 67,42 Prozent. Über dem Mittelwert, also 3 Personen und mehr: 100 minus 67,42, das sind 32,58 Prozent.';

export const TREE_TEXT = 'Entscheidungsbaum. Erste Frage: Haben die Codes eine Reihenfolge? Wenn nein, ist die Variable nominal, du berichtest den Modus, zum Beispiel bei Wahlabsicht oder Konfession. Wenn ja, zweite Frage: Sind die Abstände gleich groß? Wenn nein, ist sie ordinal, du berichtest Median und Modus, zum Beispiel bei Bücher lesen oder Wirtschaftslage in einem Jahr. Wenn ja, ist sie metrisch, du berichtest Mittelwert und Median, zum Beispiel bei Personen im Haushalt oder Wochen ohne Arbeit. Liegen beide weit auseinander, gehören beide in den Bericht.';

/* ---------- Grundlage 1b: die vier Spalten ---------- */

export type Column = 'n' | 'raw' | 'valid' | 'cum';
export const COLUMNS: { key: Column; name: string; text: string }[] = [
  { key: 'n', name: 'N', text: ' ist die absolute Häufigkeit: wie viele Befragte diese Antwort gegeben haben. 1.551 Befragte lesen seltener als einmal im Monat Bücher. Unter der Linie stehen die fehlenden Antworten mit ihrem Grund: 4 Datenfehler, 19 ohne Angabe.' },
  { key: 'raw', name: 'Raw %', text: ' teilt durch alle 5.246 Befragten, auch durch die 23 ohne gültige Antwort. Darum haben auch die fehlenden Werte eine Prozentzahl, und erst alle Zeilen zusammen ergeben 100. 19,84 % aller Befragten lesen täglich.' },
  { key: 'valid', name: 'Valid %', text: ' teilt nur durch die 5.223 gültigen Antworten (Total valid). Fehlende Werte zählen nicht mit. 19,93 % derer, die geantwortet haben, lesen täglich.' },
  { key: 'cum', name: 'Cum. %', text: ' zählt die Valid % von oben nach unten zusammen. In der Zeile MIND. 1X PRO WOCHE steht 38.56: 19,93 + 18,63. So viel Prozent lesen mindestens einmal pro Woche.' },
];

/* ---------- Grundlage 2a: drei Regale, sieben Codes ---------- */

export const SHELVES: { n: 1 | 2 | 3; title: string; sub: string }[] = [
  { n: 1, title: 'Studiendesign', sub: 'Die Frage kam nie bei der Person an.' },
  { n: 2, title: 'Befragte', sub: 'Die Person hat so geantwortet oder nicht geantwortet.' },
  { n: 3, title: 'Erfassung', sub: 'Der Wert ging beim Ausfüllen oder Abtippen verloren.' },
];
export const MISSING_CODES: { code: number; label: string; shelf: 1 | 2 | 3; right: string; wrong: string }[] = [
  { code: -11, label: 'TNZ: SPLIT', shelf: 1, right: 'Richtig. TNZ heißt „trifft nicht zu“. Der ALLBUS hat zwei Fragebogenversionen; wer die andere Version hatte, hat die Frage nie gesehen.', wrong: 'Bei einem Split bekommt nur ein Teil der Befragten die Frage. Die Person konnte gar nicht antworten.' },
  { code: -10, label: 'TNZ: FILTER', shelf: 1, right: 'Richtig. Eine Filterfrage leitet die Person an der Frage vorbei, etwa Fragen zum Beruf, wenn jemand nicht berufstätig ist.', wrong: 'Bei einem Filter wird die Frage übersprungen, weil sie nicht passt. Die Person konnte gar nicht antworten.' },
  { code: -9, label: 'KEINE ANGABE', shelf: 2, right: 'Richtig. Die Frage wurde gestellt, aber nicht beantwortet.', wrong: 'Die Person hatte die Frage, hat aber nichts angegeben.' },
  { code: -8, label: 'WEISS NICHT', shelf: 2, right: 'Richtig. „Weiß nicht“ ist eine Antwort der Person, nur keine gültige im Sinne der Skala.', wrong: '„Weiß nicht“ hat die Person selbst gesagt oder angekreuzt.' },
  { code: -7, label: 'VERWEIGERT', shelf: 2, right: 'Richtig. Die Person wollte nicht antworten.', wrong: 'Verweigern ist eine Entscheidung der Person.' },
  { code: -42, label: 'DATENFEHLER: MFN', shelf: 3, right: 'Richtig. MFN heißt Mehrfachnennung: zwei Kreuze, wo nur eins erlaubt ist, wie beim Papierfragebogen mit zwei Kreuzen in Sitzung 2.', wrong: 'Zwei Kreuze auf dem Papierbogen: Die Antwort lässt sich beim Erfassen nicht eindeutig ablesen.' },
  { code: -41, label: 'DATENFEHLER', shelf: 3, right: 'Richtig. Ein Fehler in den Daten, der beim Erfassen oder Prüfen auffiel.', wrong: 'Ein Datenfehler entsteht nicht bei der Person, sondern in den Daten.' },
];

/* ---------- Grundlage 3b: Skalenniveau ---------- */

export type Yes = 'ja' | 'nein' | 'vorsicht';
export const SCALE_LEVELS: { level: string; codes: string; example: string; mode: Yes; median: Yes; mean: Yes }[] = [
  { level: 'nominal', codes: 'nur Namen, keine Reihenfolge', example: 'Konfession (rd01)', mode: 'ja', median: 'nein', mean: 'nein' },
  { level: 'ordinal', codes: 'Reihenfolge, aber ungleiche Abstände', example: 'Bücher lesen (la01), „täglich“ bis „nie“', mode: 'ja', median: 'ja', mean: 'vorsicht' },
  { level: 'metrisch', codes: 'Zahlen mit gleichen Abständen', example: 'Personen im Haushalt (dh04)', mode: 'ja', median: 'ja', mean: 'ja' },
];

export type Middle = 'modus' | 'median' | 'mittelwert';
export const MIDDLES: { key: Middle; label: string }[] = [
  { key: 'modus', label: 'Modus' }, { key: 'median', label: 'Median' }, { key: 'mittelwert', label: 'Mittelwert' },
];
/** Kurz überlegen 3b: welche Mitte zu welcher Variable (ohne Variablennamen, damit Sitzung 4 nichts vorweggenommen wird). */
export const MIDDLE_ROWS: {
  id: string; label: string; target: Middle[]; right: string;
  /** Rückmeldungen, wenn etwas fehlt oder zu viel ist; `general` wenn keine passt. */
  extra: Partial<Record<Middle, string>>; missing: Partial<Record<Middle, string>>; general: string;
}[] = [
  { id: 'k3b-wahl', label: 'Wahlabsicht, Parteien', target: ['modus'], right: 'Parteien sind nominal: nur der Modus.',
    extra: { median: 'Parteien haben keine Reihenfolge, also keine Mitte.', mittelwert: 'Ein Mittelwert aus Parteicodes ergibt keinen Sinn; die Codes sind nur Namen.' },
    missing: {}, general: 'Parteien sind nominal: nur der Modus.' },
  { id: 'k3b-gesundheit', label: 'Gesundheitszustand, sehr gut bis schlecht', target: ['modus', 'median'],
    right: 'Ordinal: Modus und Median. Ein Mittelwert setzt gleiche Abstände voraus, etwa zwischen „gut“ und „sehr gut“; die gibt es hier nicht sicher.',
    extra: { mittelwert: 'Ein Mittelwert setzt gleiche Abstände zwischen den Kategorien voraus. Ob „gut“ und „sehr gut“ so weit auseinanderliegen wie „schlecht“ und „weniger gut“, weiß niemand. Darum hier Modus und Median.' },
    missing: { median: 'Die Kategorien haben eine Reihenfolge; die Mitte lässt sich bestimmen.' }, general: 'Ordinal: Modus und Median.' },
  { id: 'k3b-alter', label: 'Alter in Jahren', target: ['modus', 'median', 'mittelwert'],
    right: 'Metrisch: Alle drei sind sinnvoll. Liegen Mittelwert und Median weit auseinander, gehören beide in den Bericht.',
    extra: {},
    missing: { mittelwert: 'Ein Jahr ist überall gleich lang; hier darfst du rechnen.', median: 'Was bei ordinalen Variablen geht, geht bei metrischen erst recht: Median und Modus sind auch beim Alter erlaubt.', modus: 'Was bei ordinalen Variablen geht, geht bei metrischen erst recht: Median und Modus sind auch beim Alter erlaubt.' },
    general: 'Metrisch: Alle drei sind sinnvoll.' },
];

/** Rückmeldung einer Zeile in 3b; `chosen` ist die Liste der angekreuzten Mitten. */
export function middleFeedback(row: (typeof MIDDLE_ROWS)[number], chosen: Middle[]): { ok: boolean; text: string } {
  const ok = row.target.length === chosen.length && row.target.every(m => chosen.includes(m));
  if (ok) return { ok, text: row.right };
  const texts: string[] = [];
  for (const m of MIDDLES.map(x => x.key)) {
    const has = chosen.includes(m), want = row.target.includes(m);
    const t = has && !want ? row.extra[m] : !has && want ? row.missing[m] : undefined;
    if (t && !texts.includes(t)) texts.push(t);
  }
  return { ok, text: texts.length ? texts.join(' ') : row.general };
}

/* ---------- Codevorlagen ---------- */

export type Template = { title: string; code: string; tryOut?: boolean };
/** ⟦…⟧ markiert Stellen, die angepasst werden. Wortlaut wie im Plan (sitzung03.md); Probier-Vorschläge mit freier Zeile am Ende. */
export const TEMPLATES: Record<string, Template> = {
  start: { title: 'Startblock', code: `# Pakete laden und Daten einlesen
library(tidyverse)
library(mariposa)

allbus <- read_spss("ZA8831_v1-3-0.sav")` },
  r_frequency: { title: 'Häufigkeitstabelle: Bücher lesen', code: `# Häufigkeitstabelle: Wie oft lesen die Befragten Bücher?
allbus %>%
  frequency(la01)` },
  r_describe: { title: 'Kennzahlen: Personen im Haushalt', code: `# Kennzahlen: Wie viele Personen leben im Haushalt?
allbus %>%
  describe(dh04)` },
  r_rechnen: { title: 'R als Taschenrechner', code: `# R als Taschenrechner: 1041 von 5223 gültigen Antworten in Prozent
1041 / 5223 * 100` },
  a1: { title: 'Aufgabe 1: Häufigkeitstabelle ep04', code: `# Häufigkeitstabelle: Wirtschaftslage in Deutschland in einem Jahr
allbus %>%
  frequency(ep04)` },
  a1r: { title: 'Aufgabe 1: zwei Zeilen zusammenzählen', code: `# Zwei Zeilen zusammenzählen (Valid %): hier „wesentlich besser“ und „etwas besser“
⟦0.66⟧ + ⟦15.67⟧` },
  a2: { title: 'Aufgabe 2: Häufigkeitstabelle pv01', code: `# Häufigkeitstabelle: Wahlabsicht bei der nächsten Bundestagswahl
allbus %>%
  frequency(pv01)` },
  a2r: { title: 'Aufgabe 2: eigene Basis', code: `# Eigene Basis: gültige Antworten plus „weiß nicht“
# N der Gruppe geteilt durch (3984 gültige + 603 „weiß nicht“), mal 100
⟦988⟧ / (3984 + 603) * 100` },
  a3: { title: 'Aufgabe 3: Kennzahlen dw19', code: `# Kennzahlen: Dauer der Arbeitslosigkeit in Wochen
allbus %>%
  describe(dw19)` },
  a3f: { title: 'Aufgabe 3: wer fehlt', code: `# Häufigkeitstabelle derselben Variable: Wer fehlt, steht ganz unten
allbus %>%
  frequency(dw19)` },
  a4: { title: 'Aufgabe 4: Cum. % der Wochen', code: `# Häufigkeitstabelle der Wochen mit Cum. %
allbus %>%
  frequency(dw19)` },
  a4r: { title: 'Aufgabe 4: über dem Mittelwert', code: `# Anteil über dem Mittelwert: 100 minus Cum. % der letzten Zeile darunter
100 - ⟦67.42⟧` },
  frei_a1: { tryOut: true, title: 'Deine Probier-Werkstatt', code: `# Eine Idee: die eigene wirtschaftliche Lage in einem Jahr
allbus %>%
  frequency(ep06)
` },
  frei_a2: { tryOut: true, title: 'Deine Probier-Werkstatt', code: `# Eine Idee: Sterbehilfe bei psychischer Krankheit, eine Frage mit vielen „weiß nicht“
allbus %>%
  frequency(vm21)
` },
  frei_a3: { tryOut: true, title: 'Deine Probier-Werkstatt', code: `# Eine Idee: nur Frauen (sex == 2), Befragte auswählen wie in Sitzung 2
frauen <- allbus %>%
  filter(sex == 2)

frauen %>%
  describe(dw19)
` },
  frei_a4: { tryOut: true, title: 'Deine Probier-Werkstatt', code: `# Eine Idee: dieselbe Dauer in sechs Stufen zusammengefasst
allbus %>%
  frequency(dw19c)
` },
};

/* ---------- Fragen ---------- */

/** Sonderfall einer Zahlenfrage: Eine bestimmte falsche Zahl bekommt einen eigenen Hinweis. */
export type Special = { at: number; tolerance?: number; text: string };
/** Eine Frage mit Sonderfällen (Zahl) oder Rückmeldungen je falscher Option (Auswahl). */
export type TaskQuestion = Question & { special?: Special[]; wrongBy?: Record<string, string> };

/** Der Hinweis zu einer gegebenen Antwort: Sonderfall, Rückmeldung zur Option oder der allgemeine Hinweis. */
export function hintFor(q: TaskQuestion, answer: string | undefined): string {
  const a = (answer ?? '').trim();
  if (!a) return q.hint;
  if (q.kind === 'choice') return q.wrongBy?.[a] ?? q.hint;
  const xs = answerNumbers(a);
  const hit = q.special?.find(s => xs.some(x => Math.abs(x - s.at) <= (s.tolerance ?? 0) + 1e-9));
  return hit ? hit.text : q.hint;
}

type Extra = { short?: string; help?: string; special?: Special[]; wrongBy?: Record<string, string> };
const choice = (id: string, label: string, options: [string, string][], target: string, right: string, hint: string, extra: Extra = {}): TaskQuestion =>
  ({ id, label, kind: 'choice', options: options.map(([value, l]) => ({ value, label: l })), target, right, hint, ...extra });
const number = (id: string, label: string, target: number, right: string, hint: string, extra: Extra & { tolerance?: number } = {}): TaskQuestion =>
  ({ id, label, kind: 'number', target, right, hint, ...extra });

const EP04_OPTIONS: [string, string][] = [['wb', 'wesentlich besser'], ['eb', 'etwas besser'], ['gl', 'gleichbleibend'], ['es', 'etwas schlechter'], ['ws', 'wesentlich schlechter']];

export const QUESTIONS: Record<'a1' | 'a2' | 'a3' | 'a4', TaskQuestion[]> = {
  a1: [
    number('a1a', 'Wie viele Befragte haben eine gültige Antwort gegeben?', 5188,
      '5.188 ⟪gültige Antworten|gueltige-werte⟫ (Total valid).', 'Lies die Zeile „Total valid“, Spalte N. Gemeint sind nur die Antworten 1 bis 5.',
      { short: 'gültige Antworten', help: 'Aus `frequency(ep04)`, Zeile „Total valid“.' }),
    number('a1b', 'Wie viele Antworten fehlen?', 58,
      '58 ⟪fehlende Werte|fehlende-werte⟫: 37 ohne Angabe, 16 „weiß nicht“, 5 Datenfehler.', 'Lies die Zeile „Total missing“, Spalte N.', { short: 'fehlende Antworten' }),
    choice('a1c', 'Welche Erwartung ist am häufigsten (Modus)?', EP04_OPTIONS, 'es',
      '„etwas schlechter“ ist der ⟪Modus|modus⟫: 2.067 Antworten, 39,84 % der gültigen.', 'Der Modus ist die Zeile mit dem größten N, nicht die mittlere Zeile der Tabelle.', { short: 'Modus' }),
    choice('a1d', 'In welcher Kategorie liegt der Median?', EP04_OPTIONS, 'gl',
      '„gleichbleibend“ ist der ⟪Median|median⟫: Dort erreicht ⟪Cum. %|kumulierte-haeufigkeit⟫ zum ersten Mal die 50 (51,72). Die Person in der Mitte erwartet also keine Veränderung.',
      'Geh in der Spalte Cum. % von oben nach unten: Wo kommst du zum ersten Mal auf 50 oder mehr?',
      { short: 'Median', wrongBy: { es: 'Das ist der Modus. Der Median ist die erste Kategorie, bei der Cum. % die 50 erreicht.' } }),
    number('a1e', 'Wie viel Prozent der gültigen Antworten erwarten eine schlechtere Lage (etwas oder wesentlich schlechter)?', 48.28,
      '48,28 %: 39,84 + 8,44. Oder: 100 minus 51,72.',
      'Tausch in der Vorlage aus Schritt 4 die markierten Zahlen gegen die Valid % von ETWAS SCHLECHTER und WESENTL. SCHLECHTER.',
      { tolerance: 0.1, short: 'schlechtere Lage', help: 'Prozent der gültigen Antworten, eine Kommazahl reicht.', special: [
        { at: 47.75, tolerance: 0.1, text: 'Das sind Raw %, also von allen 5.246. Gefragt ist der Anteil der gültigen Antworten (Valid %).' },
        { at: 16.33, tolerance: 0.05, text: 'Das sind die „besser“-Zeilen aus der Vorlage; tausch die beiden markierten Zahlen.' },
      ] }),
    choice('a1f', 'Welcher Satz beschreibt die Tabelle richtig?', [
      ['meisten', '„Die meisten Befragten erwarten eine schlechtere Wirtschaftslage.“'],
      ['knapp', '„Knapp die Hälfte der Befragten mit gültiger Antwort (48 %) erwartet eine schlechtere Lage, nur 16 % eine bessere.“'],
      ['mittel', '„Im Mittel erwarten die Befragten eine etwas schlechtere Lage.“'],
    ], 'knapp',
      'Genau. 48 % sind knapp die Hälfte, nicht „die meisten“. Und die Mitte (Median) liegt bei „gleichbleibend“.',
      '„Die meisten“ hieße mehr als die Hälfte. Schlechter erwarten 48,28 %, also knapp weniger als die Hälfte.',
      { short: 'Satz zur Tabelle', wrongBy: {
        meisten: '„Die meisten“ hieße mehr als die Hälfte. Schlechter erwarten 48,28 %, also knapp weniger als die Hälfte.',
        mittel: 'Die Person in der Mitte (Median) erwartet „gleichbleibend“; „etwas schlechter“ ist nur die häufigste Antwort.',
      } }),
  ],
  a2: [
    choice('a2a', 'Welcher Grund für eine fehlende Antwort kommt bei pv01 am häufigsten vor?', [
      ['m50', 'nicht wahlberechtigt (−50)'], ['m8', 'weiß nicht (−8)'], ['m7', 'verweigert (−7)'], ['m9', 'keine Angabe (−9)'],
    ], 'm8',
      '„weiß nicht“ mit 603 Befragten, 11,49 % aller Befragten und fast die Hälfte aller ⟪fehlenden Werte|fehlende-werte⟫. Dann folgen verweigert, nicht wahlberechtigt, keine Angabe und Datenfehler.',
      'Vergleiche im unteren Teil von `frequency(pv01)` die Zahlen in der Spalte N.', { short: 'häufigster Grund' }),
    number('a2b', 'Wie viele Befragte haben keine gültige Antwort (Total missing)?', 1262,
      '1.262, fast jede vierte befragte Person (24,06 %).', 'Lies die Zeile „Total missing“, Spalte N.', { short: 'Total missing' }),
    number('a2c', 'CDU/CSU: Wie viel Prozent aller Befragten (Raw %)?', 18.83,
      '18,83 %: 988 von allen 5.246.', 'Lies in der Zeile CDU-CSU die Spalte Raw %.',
      { tolerance: 0.1, short: 'CDU/CSU, Raw %', help: 'Eine Kommazahl reicht.', special: [{ at: 24.8, tolerance: 0.1, text: 'Das ist Valid %, also nur von den gültigen.' }] }),
    number('a2d', 'CDU/CSU: Wie viel Prozent der gültigen Antworten (Valid %)?', 24.8,
      '24,80 %: 988 von 3.984 gültigen.', 'Lies in der Zeile CDU-CSU die Spalte Valid %.',
      { tolerance: 0.1, short: 'CDU/CSU, Valid %', help: 'Eine Kommazahl reicht.', special: [{ at: 18.83, tolerance: 0.1, text: 'Das ist Raw %, also von allen.' }] }),
    number('a2e', 'Unentschlossene: Wie viel Prozent sind es, wenn „weiß nicht“ zur Basis gehört?', 13.15,
      '603 / (3.984 + 603) × 100 = 13,15 %. Auf dieser Basis sind die Unentschlossenen größer als AfD (10,46 %), FDP und Linke.',
      'Tausch in der Vorlage aus Schritt 3 die markierte Zahl 988 gegen 603. Der Nenner bleibt 3984 + 603.',
      { tolerance: 0.1, short: 'Unentschlossene, eigene Basis', help: 'Ergebnis der Vorlage aus Schritt 3, eine Kommazahl reicht.', special: [
        { at: 15.14, tolerance: 0.1, text: 'Die 603 gehören selbst zur Basis, darum teilst du durch 3984 + 603.' },
        { at: 11.49, tolerance: 0.1, text: 'Das ist Raw % von „weiß nicht“, also von allen 5.246.' },
        { at: 21.54, tolerance: 0.1, text: 'Das ist die CDU/CSU aus der Vorlage; tausch die markierte Zahl.' },
      ] }),
    choice('a2f', 'Eine Zeitung schreibt: „Ein Viertel der Befragten würde die Union wählen.“ Was sagst du dazu?', [
      ['stimmt', 'Stimmt, Valid % ist 24,8.'],
      ['ungenau', 'Ungenau: 24,8 % gilt nur für die 3.984 mit gültiger Antwort, von allen Befragten sind es 18,8 %. Der Satz muss die Basis nennen.'],
      ['falsch', 'Falsch gerechnet, richtig wären 21,5 %.'],
    ], 'ungenau',
      'Genau. Ehrlich wäre: „Knapp 25 % der Befragten mit einer gültigen Antwort würden die Union wählen; knapp ein Viertel aller Befragten gibt keine an.“ So nennt der Satz seine ⟪Prozentbasis|prozentbasis⟫.',
      'Die Zahl stimmt, der Satz nicht: „der Befragten“ klingt nach allen 5.246.',
      { short: 'Zeitungssatz', wrongBy: {
        stimmt: 'Die Zahl stimmt, der Satz nicht: „der Befragten“ klingt nach allen 5.246.',
        falsch: 'Alle drei Zahlen sind richtig gerechnet, nur mit verschiedenen Basen. Entscheidend ist, was der Satz behauptet.',
      } }),
  ],
  a3: [
    number('a3a', 'Mittelwert (Mean) der Dauer in Wochen:', 54.708,
      '54,7 Wochen, gut ein Jahr. R schreibt 54.708.', 'Lies in `describe(dw19)` die Spalte Mean.',
      { tolerance: 0.3, short: 'Mittelwert', help: 'Wochen, eine Kommazahl reicht; auf ganze Wochen gerundet geht auch.', special: [{ at: 26, text: 'Das ist der Median.' }] }),
    number('a3b', 'Median der Dauer in Wochen:', 26,
      '26 Wochen, ein halbes Jahr. R schreibt 26.000; der Punkt ist dort ein Komma.', 'Lies in `describe(dw19)` die Spalte Median.',
      { short: 'Median', help: 'Wochen.', special: [{ at: 54.7, tolerance: 0.3, text: 'Das ist der Mittelwert.' }] }),
    number('a3c', 'Wie viele Befragte gehen in diese Kennwerte ein (N)?', 514,
      '514 Befragte mit gültiger Angabe: die ⟪Fallzahl|fallzahl⟫.', 'Lies in `describe(dw19)` die Spalte N.',
      { short: 'N', special: [
        { at: 4732, text: 'Das ist Missing, also alle ohne gültige Angabe.' },
        { at: 5246, text: 'Das sind alle Befragten, auch die ohne Angabe.' },
      ] }),
    choice('a3d', 'Warum fehlt bei 4.732 Befragten die Dauer?', [
      ['verw', 'Die meisten wollten nicht antworten.'],
      ['filter', 'Die meisten wurden gar nicht gefragt (−10 TNZ: FILTER): Die Frage ging nur an Berufstätige, die in den letzten zehn Jahren arbeitslos waren.'],
      ['geloescht', 'R hat ungültige Werte gelöscht.'],
    ], 'filter',
      '4.709 der 4.732 tragen −10 ⟪TNZ: FILTER|tnz⟫. Eine Filterfrage hat sie an der Frage vorbeigeleitet. Dazu kommen 16 ohne Angabe und 7 Datenfehler. Beachte: Wer heute nicht erwerbstätig ist, also auch, wer gerade arbeitslos ist, wurde nicht gefragt. Die Zahlen beschreiben Berufstätige, die früher einmal arbeitslos waren.',
      'Schau ganz unten in `frequency(dw19)`: Welcher Code steht bei den meisten fehlenden? −10 heißt TNZ: FILTER (Grundlage 2).', { short: 'wer fehlt' }),
    choice('a3e', 'Welcher Satz beschreibt die typische Dauer am besten?', [
      ['mean', '„Wer arbeitslos war, war im Schnitt gut ein Jahr ohne Arbeit (55 Wochen).“'],
      ['median', '„Die Hälfte war höchstens ein halbes Jahr arbeitslos (Median 26 Wochen); wenige sehr lange Zeiten ziehen den Mittelwert auf 55 Wochen.“'],
      ['gleich', '„Mittelwert und Median sagen hier dasselbe.“'],
    ], 'median',
      'Genau. Der Mittelwert ist gut doppelt so groß wie der Median. Wenige sehr lange Zeiten, bis zu zehn Jahre, ziehen ihn nach oben. Solche Werte weit abseits der übrigen heißen ⟪Ausreißer|ausreisser⟫. Wer nur den Mittelwert nennt, macht die typische Arbeitslosigkeit doppelt so lang.',
      'Der Mittelwert stimmt, beschreibt aber nicht die typische Person: Die Hälfte war höchstens 26 Wochen arbeitslos.',
      { short: 'typische Dauer', wrongBy: {
        mean: 'Der Mittelwert stimmt, beschreibt aber nicht die typische Person: Die Hälfte war höchstens 26 Wochen arbeitslos.',
        gleich: '54,7 und 26 liegen weit auseinander.',
      } }),
    choice('a3f', 'In der Kopfzeile von `frequency(ep04)` aus Aufgabe 1 steht mean=3.40. Was gehört in deinen Bericht?', [
      ['mittel', '„Im Mittel 3,40: Die Befragten erwarten eine Lage zwischen gleichbleibend und etwas schlechter.“'],
      ['median', '„Median „gleichbleibend“, dazu die Anteile: 48 % erwarten schlechter, 16 % besser.“'],
      ['nichts', '„Bei ep04 lässt sich keine Mitte angeben.“'],
    ], 'median',
      'Genau. ep04 ist ⟪ordinal|ordinal⟫: Die Kategorien haben eine Reihenfolge, aber niemand weiß, ob „etwas“ und „wesentlich“ gleich weit auseinanderliegen. Darum Median und Häufigkeiten.',
      'Ein Mittelwert setzt gleiche Abstände zwischen den Kategorien voraus (metrisch). Bei „wesentlich besser“ bis „wesentlich schlechter“ ist das nicht gesichert.',
      { short: 'Bericht zu ep04', wrongBy: {
        mittel: 'Ein Mittelwert setzt gleiche Abstände zwischen den Kategorien voraus (metrisch). Bei „wesentlich besser“ bis „wesentlich schlechter“ ist das nicht gesichert.',
        nichts: 'Die Kategorien haben eine Reihenfolge, also gibt es einen Median (Grundlage 3b).',
      } }),
  ],
  a4: [
    number('a4a', 'Letzte Zeile unter dem Mittelwert: Welche Zahl steht dort in Cum. %?', 75.29,
      '75,29 in der Zeile 54 Wochen.',
      'Unter 54,7 liegt als letzte Wochenzahl die 54, nicht die 52.',
      { tolerance: 0.05, short: 'Cum. % bei 54 Wochen', help: 'Aus `frequency(dw19)`, Spalte Cum. %.', special: [
        { at: 74.71, text: 'Das ist die Zeile 52; danach kommen noch 53 und 54.' },
        { at: 75.10, text: 'Das ist die Zeile 53; danach kommt noch 54.' },
        { at: 75.49, text: 'Das ist 55, schon über dem Mittelwert.' },
      ] }),
    number('a4b', 'Wie viel Prozent liegen über dem Mittelwert?', 24.71,
      '100 − 75,29 = 24,71 %, das sind 127 der 514 Befragten.',
      'Tausch in der Vorlage aus Schritt 2 die markierte Zahl gegen deinen Cum.-%-Wert aus der ersten Frage.',
      { tolerance: 0.1, short: 'über dem Mittelwert', help: 'Prozent, eine Kommazahl reicht.', special: [
        { at: 32.58, tolerance: 0.1, text: 'Das ist das Beispiel aus Grundlage 4; tausch die markierte Zahl.' },
      ] }),
    choice('a4c', 'Was zeigt das?', [
      ['mitte', 'Der Mittelwert liegt in der Mitte der Rangfolge.'],
      ['viertel', 'Nur ein Viertel liegt über dem Mittelwert: Wenige sehr lange Zeiten ziehen ihn nach oben, die Mitte (Median 26) liegt viel tiefer.'],
      ['fehler', 'R hat sich verrechnet.'],
    ], 'viertel',
      'Genau. Drei Viertel liegen unter dem Mittelwert. Wenige sehr lange Zeiten ziehen ihn nach oben; die Verteilung läuft zu großen Werten lang aus. Sie ist ⟪rechtsschief|schiefe⟫.',
      'Über der Mitte läge die Hälfte. Hier ist es nur ein Viertel, also liegt der Mittelwert nicht in der Mitte. R rechnet richtig.', { short: 'Was das zeigt' }),
  ],
};

/** Pflichtaufgaben: Aufgaben 1, 2 und 3 (Aufgabe 4 ist Zusatz). */
export const REQUIRED: Question[] = [...QUESTIONS.a1, ...QUESTIONS.a2, ...QUESTIONS.a3];

/* ---------- Kurz überlegen in den Grundlagen ---------- */

export const K1B_Q = number('k1b-frage', 'Und von unten: Wie viel Prozent der gültigen Antworten lesen seltener als einmal im Monat oder nie Bücher?', 47.97,
  'Rund 48 %: 29,70 + 18,27 = 47,97. Oder von oben: 100 minus Cum. % bei MIND. 1X PRO MONAT, 100 − 52,04 = 47,96. Der kleine Unterschied kommt vom Runden der Prozentzahlen.',
  'Gefragt sind die beiden untersten Zeilen, SELTENER und NIE. Zähl ihre Valid % zusammen, oder zieh Cum. % der Zeile darüber (MIND. 1X PRO MONAT) von 100 ab.',
  { tolerance: 0.1, short: 'seltener oder nie', help: 'Eine Kommazahl reicht, zum Beispiel 12,5.', special: [
    { at: 18.27, tolerance: 0.1, text: 'Das ist nur NIE. Wer seltener als einmal im Monat liest, gehört auch dazu: Zähl SELTENER dazu.' },
    { at: 81.73, tolerance: 0.1, text: 'Das ist Cum. % bei SELTENER: alle von „täglich“ bis „seltener“. Gefragt sind nur die beiden untersten Zeilen.' },
    { at: 47.76, tolerance: 0.1, text: 'Das sind Raw %, also von allen 5.246. Gefragt ist der Anteil der gültigen Antworten (Valid %).' },
  ] });

export const K1C_Q = choice('k1c-frage', 'Die Person genau in der Mitte der sortierten Antworten: Wie oft liest sie Bücher?', [
  ['t', 'täglich'], ['w', 'mindestens einmal pro Woche'], ['m', 'mindestens einmal pro Monat'], ['s', 'seltener'], ['n', 'nie'],
], 'm',
  'Genau. Bis „pro Woche“ kommen erst 38,56 % zusammen, bis „pro Monat“ sind es 52,04 %. Die 50-%-Marke liegt also in der Kategorie „mindestens einmal pro Monat“: Das ist der Median.',
  'Geh in der Spalte Cum. % von oben nach unten. Die erste Zeile, in der du 50 erreichst oder überschreitest, ist die Kategorie der mittleren Person.',
  { wrongBy: { s: '„Seltener“ ist die häufigste Antwort, der Modus. Gefragt ist die Person in der Mitte: Geh in Cum. % von oben, bis du über 50 kommst.' } });

export const K2B_Q = choice('k2b-frage', 'Eine Zeitung will schreiben, wie viele bei st01 „kommt darauf an“ sagen. Welcher Satz ist am ehrlichsten?', [
  ['r28', '28 % der Befragten sagen: kommt darauf an.'],
  ['v41', '41 % der Befragten, die die Frage beantwortet haben, sagen: kommt darauf an.'],
  ['beide', 'Beide Zahlen sind falsch gerechnet; richtig wäre ein Wert dazwischen.'],
], 'v41',
  'Genau. Valid % mit Basis: Der Zusatz sagt, für wen die Zahl gilt. Ohne ihn klänge 41 % so, als gälte die Zahl für alle Befragten.',
  'Richtig gerechnet, aber irreführend: 28 % aller Befragten schließt die 1.647 ein, die die Frage nie bekommen haben. Ein knappes Drittel der Basis konnte gar nicht „kommt darauf an“ sagen.',
  { wrongBy: {
    r28: 'Richtig gerechnet, aber irreführend: 28 % aller Befragten schließt die 1.647 ein, die die Frage nie bekommen haben. Ein knappes Drittel der Basis konnte gar nicht „kommt darauf an“ sagen.',
    beide: 'Beide sind richtig gerechnet: 1.463 geteilt durch 5.246 und 1.463 geteilt durch 3.560. Entscheidend ist, was der Satz behauptet.',
  } });
export const K2B_AFTER = 'Am ehrlichsten: Valid % mit Basis nennen, also „41 % derer, die geantwortet haben (n = 3.560)“.';

export const K3A_Q = choice('k3a-frage', 'Eine zehnte Person kommt dazu: Sie lebt in einer Wohngemeinschaft mit 12 Personen. Was passiert mit Mittelwert und Median?', [
  ['beide', 'beide steigen'], ['mittel', 'nur der Mittelwert steigt'], ['median', 'nur der Median steigt'], ['nichts', 'nichts ändert sich'],
], 'mittel',
  'Genau. Der Mittelwert steigt von 2,44 auf 3,4, weil die 12 mit ihrem ganzen Gewicht in die Summe eingeht. Der Median bleibt 2, weil sich in der Mitte der sortierten Werte nichts ändert.',
  'Der Median schaut nur auf die Mitte der sortierten Werte. Dort stehen weiter zwei Werte mit 2. Der Mittelwert steigt auf 3,4.',
  { wrongBy: {
    beide: 'Der Median schaut nur auf die Mitte der sortierten Werte. Dort stehen weiter zwei Werte mit 2. Der Mittelwert steigt auf 3,4.',
    median: 'Andersherum: Der Mittelwert zählt jede Zahl zusammen und steigt auf 3,4. Der Median bleibt bei 2.',
    nichts: 'Der Median bleibt tatsächlich bei 2. Der Mittelwert aber steigt: 34 geteilt durch 10 ist 3,4.',
  } });

export const K3C_Q = choice('k3c-frage', 'Der Mittelwert liegt mit 2,34 über dem Median 2. Woran liegt das?', [
  ['gross', 'An den größeren Haushalten: Nach oben reichen die Werte viel weiter als nach unten'],
  ['fehlend', 'An den 102 fehlenden Angaben'],
  ['rundet', 'R rundet den Median ab'],
], 'gross',
  'Genau. Unter dem Median 2 gibt es nur noch Haushalte mit 1 Person, darüber Haushalte mit 3, 4, 5 und mehr Personen. Diese größeren Haushalte ziehen den Mittelwert nach oben, der Median bleibt bei 2.',
  'Fehlende Angaben gehen gar nicht in die Rechnung ein, weder in den Mittelwert noch in den Median.',
  { wrongBy: {
    fehlend: 'Fehlende Angaben gehen gar nicht in die Rechnung ein, weder in den Mittelwert noch in den Median.',
    rundet: 'R rundet nicht ab: 2.000 ist genau 2. Der Unterschied kommt von den großen Haushalten.',
  } });

export const K4_Q = number('k4-frage', 'Wie viel Prozent der Befragten leben in einem Haushalt mit mehr Personen als im Mittel (2,34)?', 32.58,
  '32,58 %: Bis 2 Personen kommen 67,42 % zusammen, über dem Mittelwert liegen also 100 − 67,42 = 32,58 %. Nur ein Drittel liegt über dem Mittelwert.',
  'Such in Cum. % die letzte Zeile unter dem Mittelwert 2,34, das ist 2 Personen (67,42), und zieh sie von 100 ab.',
  { tolerance: 0.1, short: 'über dem Mittelwert', help: 'Eine Kommazahl reicht.', special: [
    { at: 67.42, tolerance: 0.1, text: 'Das sind alle bis einschließlich 2 Personen, also höchstens beim Mittelwert. Gefragt ist der Rest: 100 minus diese Zahl.' },
    { at: 50, text: '50 % lägen darüber, wenn der Mittelwert genau in der Mitte der sortierten Werte stünde. Such in Cum. % die Zeile 2 Personen und zieh ihre Zahl von 100 ab.' },
  ] });

/* ---------- Erst festlegen ---------- */

export const PREDICTIONS: Record<'a1' | 'a2' | 'a3' | 'a4', { id: string; prompt: string; options: string[] }> = {
  a1: { id: 'a1', prompt: 'Erwarten mehr Befragte eine bessere oder eine schlechtere Wirtschaftslage?', options: ['mehr erwarten eine bessere', 'etwa gleich viele', 'mehr erwarten eine schlechtere'] },
  a2: { id: 'a2', prompt: 'Wie viel Prozent aller Befragten sagen bei der Wahlabsicht „weiß nicht“?', options: ['unter 5 %', '5 bis 15 %', 'über 15 %'] },
  a3: { id: 'a3', prompt: 'Wie liegt der Mittelwert der Dauer im Vergleich zum Median?', options: ['deutlich darüber', 'etwa gleich', 'deutlich darunter'] },
  a4: { id: 'a4', prompt: 'Wie viel Prozent liegen über dem Mittelwert von 54,7 Wochen?', options: ['etwa die Hälfte', 'deutlich weniger als die Hälfte', 'deutlich mehr als die Hälfte'] },
};

/* ---------- Hilfe in drei Stufen ---------- */

/** Stufe 1 Denkanstoß, Stufe 2 Wo schaue ich?, Stufe 3 Lösung; Code in `Backticks`. */
export const HINTS: Record<'a1' | 'a2' | 'a3' | 'a4', [string, string, string]> = {
  a1: [
    'Die Tabelle hat zwei Teile: oben die gültigen Antworten 1 bis 5, unten die fehlenden mit ihrem Grund. Der Modus ist die Kategorie mit der größten absoluten Häufigkeit, der Median die Kategorie der Person in der Mitte. Für „schlechter“ zählst du zwei Kategorien zusammen.',
    'Alles steht in der Ausgabe von `allbus %>% frequency(ep04)`. Total valid und Total missing in der Spalte N. Den Modus findest du an der größten Zahl in N, den Median in Cum. %. Zum Zusammenzählen nimmst du Valid %, nicht Raw %.',
    '5.188 gültige Antworten, 58 fehlen (37 ohne Angabe, 16 „weiß nicht“, 5 Datenfehler). Modus: „etwas schlechter“ (2.067, 39,84 %). Median: „gleichbleibend“ (Cum. % 51,72). Schlechter: `39.84 + 8.44` ergibt 48.28, also 48,28 %; besser 16,33 %. Richtig ist der Satz „Knapp die Hälfte der Befragten mit gültiger Antwort (48 %) erwartet eine schlechtere Lage, nur 16 % eine bessere.“',
  ],
  a2: [
    'Dieselben 988 Menschen ergeben verschiedene Prozentzahlen, je nachdem, wen du in die Basis zählst. Raw % teilt durch alle, Valid % durch die gültigen, und eine eigene Basis rechnest du selbst.',
    'Die fehlenden Werte und Total missing stehen unten in `allbus %>% frequency(pv01)`, die Prozente für CDU/CSU in der ersten Zeile. Für die eigene Basis führst du die Vorlage aus Schritt 3 aus, mit 603 statt 988 vorne.',
    'Häufigster Grund: „weiß nicht“ (603). Total missing: 1.262. CDU/CSU: Raw % 18,83, Valid % 24,80, mit „weiß nicht“ in der Basis 21,54. Unentschlossene: `603 / (3984 + 603) * 100` ergibt 13.14585, also 13,15 %. Der Zeitungssatz ist ungenau, weil er die Basis nicht nennt.',
  ],
  a3: [
    'Der Mittelwert zählt jeden Wert zusammen, auch die wenigen sehr langen. Der Median schaut nur auf die Person in der Mitte. Und nicht jede fehlende Angabe ist eine verweigerte: Wer wurde überhaupt gefragt?',
    'Mean, Median, N und Missing stehen in der Ausgabe von `allbus %>% describe(dw19)`. Die Gründe für die fehlenden Angaben stehen ganz unten in `allbus %>% frequency(dw19)`. Was −10 heißt, steht in Grundlage 2a. `codebook(allbus, dw18, dw19)` zeigt die beiden Fragen (in der Werkstatt als Text mit Wertelabels, in RStudio im Viewer): erst ob jemand in den letzten zehn Jahren arbeitslos war (dw18), dann wie lange (dw19). Für Aufgabe 1 zurück: Grundlage 3b.',
    'Mittelwert 54,7 Wochen, Median 26 Wochen, N = 514. Von den 4.732 fehlenden tragen 4.709 −10 TNZ: FILTER: nicht in Voll- oder Teilzeit berufstätig (auch wer gerade arbeitslos ist) oder in den letzten zehn Jahren nicht arbeitslos. Der Median beschreibt die typische Dauer besser, weil wenige sehr lange Zeiten (bis 520 Wochen) den Mittelwert auf mehr als das Doppelte ziehen. Bei ep04 (ordinal) berichtest du statt mean=3.40 den Median „gleichbleibend“ und die Häufigkeiten.',
  ],
  a4: [
    'Cum. % sagt, wie viele höchstens bis zu einer Wochenzahl kommen. Wer darüber liegt, ist der Rest bis 100.',
    'In `allbus %>% frequency(dw19)` stehen die Wochenzahlen in der Spalte Value. Such die letzte Zeile unter 54,7. Das ist 54. Dann rechnest du mit der Vorlage aus Schritt 2.',
    'In der Zeile 54 steht Cum. % 75,29. `100 - 75.29` ergibt 24.71: Nur 24,71 % (127 von 514) waren länger arbeitslos als im Mittel. Wenige sehr lange Zeiten ziehen den Mittelwert nach oben; die Mitte liegt bei 26 Wochen.',
  ],
};

/* ---------- Hilfe bei R-Fehlermeldungen ---------- */

/** Text mit Code-Stücken und Links, ohne JSX; `en` markiert die englische Meldung der Werkstatt. */
export type Rich = (string | { code: string; en?: boolean } | { href: string; text: string })[];
export const ERROR_HELP_TITLE = 'Hilfe: R meldet einen Fehler';
export const ERROR_HELP_INTRO = 'Vor dem Schrägstrich steht die Meldung, wie RStudio sie auf Deutsch zeigt, danach, wie die Code-Werkstatt sie auf Englisch zeigt.';
export const ERROR_HELP_CAPTION = 'Was R sagt und was du tust';
export const ERROR_HELP: { says: Rich; helps: Rich }[] = [
  { says: [{ code: 'konnte Funktion "%>%" nicht finden' }, ' / ', { code: 'could not find function "%>%"', en: true }],
    helps: ['Den ', { href: '#r1', text: 'Startblock in „R lesen“' }, ' ausführen.'] },
  { says: [{ code: "Objekt 'allbus' nicht gefunden" }, ' / ', { code: "object 'allbus' not found", en: true }],
    helps: ['Die Zeile mit ', { code: 'read_spss()' }, ' aus dem Startblock ausführen.'] },
  { says: [{ code: "File 'ZA8831_v1-3-0.sav' does not exist.", en: true }, ' (nur in RStudio)'],
    helps: ['Öffne RStudio über dein Projekt. Findet R die Datei nicht, nimm wie in Sitzung 1 ', { code: 'allbus <- read_spss(file.choose())' }, '.'] },
  { says: [{ code: "Can't select columns that don't exist. ✖ Column `ep4` doesn't exist.", en: true }, ' (in RStudio und Werkstatt gleich)'],
    helps: ['Der Variablenname ist vertippt. Prüf ihn Zeichen für Zeichen: ep04 mit Null, dw19 mit Eins und Neun.'] },
  { says: [{ code: 'konnte Funktion "Frequency" nicht finden' }, ' / ', { code: 'could not find function "Frequency"', en: true }],
    helps: ['R unterscheidet Groß- und Kleinschreibung: ', { code: 'frequency()' }, ' und ', { code: 'describe()' }, ' schreibst du klein.'] },
  { says: [{ code: "Unerwartete(s) ','" }, ' / ', { code: "unexpected ','", en: true }],
    helps: ['In R schreibst du Kommazahlen mit Punkt: ', { code: '39.84 + 8.44' }, ', nicht ', { code: '39,84 + 8,44' }, '.'] },
  { says: ['Ergebnis fast null, etwa ', { code: '0.01993107' }],
    helps: ['Tausenderpunkt weglassen: ', { code: '1041' }, ', nicht ', { code: '1.041' }, '.'] },
  { says: ['In RStudio erscheint ', { code: '+' }, ' und nichts passiert (in der Werkstatt: ', { code: 'unexpected end of input', en: true }, ')'],
    helps: ['Eine Klammer ist nicht geschlossen. In RStudio mit Esc abbrechen, dann die Klammern zählen: ', { code: '988 / (3984 + 603) * 100' }, '.'] },
  { says: ['Tabelle bricht um und ist schwer zu lesen'],
    helps: ['Das Konsolenfenster in RStudio breiter ziehen und die Vorlage erneut ausführen.'] },
];

/* ---------- Prüf dich selbst ---------- */

export const SELF_TEST: { question: string; options: string[]; answer: number; why: string }[] = [
  { question: 'In frequency() steht bei einer Antwort Raw % = 20 und Valid % = 30. Was heißt das?',
    options: ['20 % aller Befragten und 30 % derer mit gültiger Antwort haben so geantwortet', '30 % aller Befragten, 20 % der gültigen', 'Die Antwort wurde 20- oder 30-mal gegeben'],
    answer: 0, why: 'Raw % teilt durch alle Befragten, Valid % nur durch die gültigen. Weil die Basis kleiner ist, ist Valid % größer (Grundlage 2b).' },
  { question: 'In der Zeile „gut“ einer Skala von „sehr gut“ bis „schlecht“ steht Cum. % = 60. Was heißt das?',
    options: ['60 % antworten „gut“', '60 % antworten „gut“ oder „sehr gut“', '60 % antworten schlechter als „gut“'],
    answer: 1, why: 'Cum. % zählt von oben bis einschließlich dieser Zeile zusammen (Grundlage 1b).' },
  { question: 'Bei einer Frage wurde einem Drittel der Befragten die Frage nie gestellt (−11 TNZ: SPLIT). Welche Prozentzahl gehört in deinen Bericht?',
    options: ['Raw %, denn sie bezieht alle Befragten ein', 'Valid %, mit dem Zusatz, dass sie für die gilt, die geantwortet haben', 'egal, beide sind richtig gerechnet'],
    answer: 1, why: 'Raw % zählt auch die mit, die gar nicht antworten konnten, und macht den Anteil künstlich klein. Valid % mit Basis sagt ehrlich, für wen die Zahl gilt (Grundlage 2b).' },
  { question: 'frequency() zeigt bei der Konfession mean=4.06. Was berichtest du stattdessen?',
    options: ['den Median', 'den Modus, die häufigste Konfession', 'den Mittelwert, gerundet auf 4'],
    answer: 1, why: 'Konfessionen sind nominal: Die Codes sind nur Namen. Es bleibt nur der Modus (Grundlage 3b).' },
  { question: 'Zu neun Befragten kommt eine Person mit einem sehr großen Wert dazu. Was verändert sich stärker?',
    options: ['der Mittelwert', 'der Median', 'beide gleich stark'],
    answer: 0, why: 'Der Mittelwert zählt jeden Wert zusammen, der Median schaut nur auf die Mitte der sortierten Werte (Grundlage 3a).' },
];

/* ---------- Skript zum Mitnehmen ---------- */

export const SCRIPT_FILE = 'sitzung3.R';
export const SCRIPT_PARTS = ['start', 'r_frequency', 'r_describe', 'r_rechnen', 'a1', 'a1r', 'a2', 'a2r', 'a3', 'a3f', 'a4', 'a4r'];
/** Skript sitzung3.R: alle Vorlagen ohne Probier-Werkstätten, Marken stehen mit ihrem Beispielwert. */
export const SCRIPT = '# Sitzung 3: Erste Auszählung\n# Statistikatlas, Methoden Ib, ALLBUS 2023 (ZA8831 v1.3.0)\n# Markierte Stellen aus dem Atlas stehen hier mit ihrem Beispielwert.\n\n'
  + SCRIPT_PARTS.map(k => `# ---- ${TEMPLATES[k].title} ----\n${parseMarks(TEMPLATES[k].code).code}\n`).join('\n');
