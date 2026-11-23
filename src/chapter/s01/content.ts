// Sitzung 1 „Einstieg“: Zahlen, Vorlagen und Fragen aus docs/entwicklung/spezifikationen/2026-11-23-lernpfad-kapitel/sitzung01.md, nur Daten.
// Alle Zahlen: ALLBUS 2023, ZA8831 v1.3.0, ungewichtet, nur Aggregate. Geprüft in allbus.local.test.ts.
import type { Question } from '../answers';
import { parseMarks } from '../workshop/editor';

/* ---------- Daten ---------- */

/** Größe des Datensatzes (dim(allbus)). */
export const DIM = { rows: 5246, cols: 579 };
/** Zellen und Tage bei einer Zelle pro Sekunde (a1_zellen mit 5246 und 579). */
export const CELLS = 3037434;
export const DAYS = '35.15549';
/** Wer 5.246 mit Tausenderpunkt einsetzt, rechnet mit 5,246: so viele Tage (gerundet). */
export const DAYS_WITH_POINT = 0.0352;
/** Dasselbe, wie R es ausgibt (0.03515549): auf vier Stellen gekürzt, im Text mit „…“ dahinter. */
export const DAYS_WITH_POINT_TEXT = String(Math.floor((DIM.rows / 1000) * DIM.cols / 86400 * 1e4) / 1e4);
/** Grundlage 1b: Befragte im Osten (eastwest = 2, NEUE BUNDESLAENDER) und ihr Anteil in Prozent. */
export const EAST = { n: 1679, percent: 32 };

/** Eine Zeile der Ausgabe von find_var(): Position im Datensatz, Name, Variablenlabel. */
export type Hit = { col: number; name: string; label: string };

/** Grundlage 2b, Suchwort-Labor: Suchwort, Ausgabe genau wie in R (mariposa 0.7.4, Breite 80), was man daraus lernt. */
export type LabWord = { word: string; hits: Hit[]; output: string; lesson: string };
export const LAB: LabWord[] = [
  { word: 'bücher', hits: [], output: 'No variables found matching "bücher".', lesson: 'Kein Treffer, obwohl es die Frage gibt: Die Labels schreiben ü als UE.' },
  { word: 'buecher', hits: [{ col: 25, name: 'la01', label: 'FREIZEIT: BUECHER LESEN' }], output: '  col name                   label\n1  25 la01 FREIZEIT: BUECHER LESEN', lesson: 'Mit ue statt ü klappt es. Groß- und Kleinschreibung ist egal.' },
  { word: 'handy', hits: [], output: 'No variables found matching "handy".', lesson: 'Kein Treffer: Der ALLBUS sagt nicht Handy …' },
  { word: 'smartphone', hits: [{ col: 20, name: 'lm30', label: 'INTERNETNUTZUNG MIT: SMARTPHONE' }], output: '  col name                           label\n1  20 lm30 INTERNETNUTZUNG MIT: SMARTPHONE', lesson: '… sondern Smartphone. Probier Wörter mit gleicher Bedeutung.' },
  { word: 'tier', hits: [{ col: 47, name: 'vi01', label: 'WICHTIG: GESETZ UND ORDNUNG RESPEKTIEREN' }], output: '  col name                                    label\n1  47 vi01 WICHTIG: GESETZ UND ORDNUNG RESPEKTIEREN', lesson: 'Ein **Scheintreffer**: ‚tier‘ steckt in RESPEKTIEREN. Mit Tieren hat die Frage nichts zu tun.' },
  {
    word: 'internet',
    hits: [
      { col: 15, name: 'xr19', label: 'NUTZEN SIE PRIVAT DAS INTERNET?' },
      { col: 16, name: 'xr20', label: 'HAEUFIGKEIT INTERNETNUTZUNG PRIVAT' },
      { col: 17, name: 'lm27', label: 'INTERNETNUTZUNG MIT: PC' },
      { col: 18, name: 'lm28', label: 'INTERNETNUTZUNG MIT: LAPTOP' },
      { col: 19, name: 'lm29', label: 'INTERNETNUTZUNG MIT: TABLET' },
      { col: 20, name: 'lm30', label: 'INTERNETNUTZUNG MIT: SMARTPHONE' },
      { col: 21, name: 'lm31', label: 'INTERNETNUTZUNG MIT: FERNSEHER' },
      { col: 22, name: 'lm32', label: 'INTERNETNUTZUNG MIT: SPIELEKONSOLE' },
      { col: 23, name: 'lm33', label: 'INTERNETNUTZUNG MIT: E-BOOK-READER' },
      { col: 24, name: 'lm34', label: 'INTERNETNUTZUNG MIT: ANDERE GERAETE' },
    ],
    output: [
      '   col name                               label',
      '1   15 xr19     NUTZEN SIE PRIVAT DAS INTERNET?',
      '2   16 xr20  HAEUFIGKEIT INTERNETNUTZUNG PRIVAT',
      '3   17 lm27             INTERNETNUTZUNG MIT: PC',
      '4   18 lm28         INTERNETNUTZUNG MIT: LAPTOP',
      '5   19 lm29         INTERNETNUTZUNG MIT: TABLET',
      '6   20 lm30     INTERNETNUTZUNG MIT: SMARTPHONE',
      '7   21 lm31      INTERNETNUTZUNG MIT: FERNSEHER',
      '8   22 lm32  INTERNETNUTZUNG MIT: SPIELEKONSOLE',
      '9   23 lm33  INTERNETNUTZUNG MIT: E-BOOK-READER',
      '10  24 lm34 INTERNETNUTZUNG MIT: ANDERE GERAETE',
    ].join('\n'),
    lesson: 'Viele Treffer: Jetzt musst du die Labels lesen und die passende Variable auswählen.',
  },
  { word: 'klima', hits: [{ col: 531, name: 'pi08', label: 'MEINUNG UEBER DEN KLIMAWANDEL' }], output: '  col name                         label\n1 531 pi08 MEINUNG UEBER DEN KLIMAWANDEL', lesson: 'Ein Treffer, und er passt. Was die Codes von pi08 bedeuten, zeigt Thema 3.' },
];

/** Bild s1-find-var: sechs Zeilen der Liste aller Variablen. */
export const FIND_VAR_ROWS: [string, string][] = [
  ['la01', 'FREIZEIT: BUECHER LESEN'],
  ['li03', 'WICHTIGKEIT: FREIZEIT UND ERHOLUNG'],
  ['lm30', 'INTERNETNUTZUNG MIT: SMARTPHONE'],
  ['pi08', 'MEINUNG UEBER DEN KLIMAWANDEL'],
  ['vi01', 'WICHTIG: GESETZ UND ORDNUNG RESPEKTIEREN'],
  ['xr19', 'NUTZEN SIE PRIVAT DAS INTERNET?'],
];

/** Suchwörter mit ihren Treffern (Namen), die im Kapitel genannt werden. Geprüft in allbus.local.test.ts. */
export const SEARCHES: Record<string, string[]> = {
  sport: [],
  freizeit: ['la01', 'li03'],
  fernseh: ['lm31', 'pt09'],
  horoskop: ['rh08b'],
  'flüchtling': [],
  fluecht: ['mi05', 'mp16', 'mp17', 'mp18', 'mp19'],
  fluechtling: ['mi05'],
  angst: [],
  politik: ['li07', 'lp05', 'pe01', 'pe04', 'pe05', 'pe06', 'pa30', 'pa35'],
  einsam: ['dp03'],
  allein: ['xs01'],
  freund: ['li04', 'mc04'],
  tarot: ['rh09b'],
  nachbar: ['li08', 'mc03'],
  kirche: ['li09', 'mn06', 'rd04', 'rd08', 'rd11', 'rd13', 'rd15', 'rd20', 'rd21', 'pt06', 'pt07'],
  'ärztl': [],
  aerzt: ['ca04'],
};
/** „vertrauen“ findet 16 Variablen, darunter diese vier. */
export const TRUST = { hits: 16, among: ['pt03', 'pt12', 'pt15', 'st01'] };
/** Variablenlabels, die im Kapitel wörtlich stehen. */
export const LABELS: Record<string, string> = {
  rh08b: 'HALTE VON: ASTROLOGIE, HOROSKOPE',
  rh09b: 'HALTE VON: TAROT-KARTEN, WAHRSAGEN',
  mi05: 'ZUZUG VON: KRIEGSFLUECHTLINGEN',
  mp16: 'FLUECHTL. CHANCE O.RISIKO: SOZIALSTAAT',
  pt03: 'VERTRAUEN: BUNDESTAG',
  pt12: 'VERTRAUEN: BUNDESREGIERUNG',
  pt15: 'VERTRAUEN: POLITISCHE PARTEIEN',
  st01: 'VERTRAUEN ZU MITMENSCHEN',
  dp03: 'LEBENSPARTNER: GEMEINSAMER HAUSHALT?',
  xs01: 'INTERVIEW: ALLEINE DURCHGEFUEHRT',
  li04: 'WICHTIGKEIT: FREUNDE UND BEKANNTE',
  mc04: 'AUSLAENDER: KONTAKT IM FREUNDESKREIS?',
  li08: 'WICHTIGKEIT: NACHBARSCHAFT',
  mc03: 'AUSLAENDER: KONTAKT IN D. NACHBARSCHAFT?',
  ca04: 'VERHALTENSBEURTEIL: AERZTL. STERBEHILFE',
};
/** In den Variablennamen: 15 Variablen enthalten „pt“ (pt01 bis pt20). */
export const PT_IN_NAMES = 15;

/** Eine Zeile einer frequency()-Tabelle: Code, Wertelabel, N (fehlende Werte haben negative Codes). */
export type FreqRow = { value: number; label: string; n: number };
export type Freq = { name: string; label: string; total: number; rows: FreqRow[] };
const freq = (name: string, label: string, rows: [number, string, number][]): Freq =>
  ({ name, label, total: 5246, rows: rows.map(([value, l, n]) => ({ value, label: l, n })) });

/** Grundlage 3a: frequency(allbus, pi08). */
export const PI08 = freq('pi08', 'MEINUNG UEBER DEN KLIMAWANDEL', [
  [1, 'KEINE KLIMAAENDERUNG', 70], [2, 'NATUERLICHE URSACHEN', 270], [3, 'MENSCH+NATUR', 1355], [4, 'MENSCHL. URSACHEN', 1812],
  [-42, 'DATENFEHLER: MFN', 20], [-11, 'TNZ: SPLIT', 1647], [-9, 'KEINE ANGABE', 52], [-8, 'WEISS NICHT', 20],
]);
/** Kopfzeile der Ausgabe von frequency(allbus, pi08), wie mariposa sie druckt. */
export const PI08_HEAD = { mean: '3.40', sd: '0.72', skewness: '-1.09' };
/** Aufgabe 3, Schritt 2: frequency(allbus, rh08b). */
export const RH08B = freq('rh08b', 'HALTE VON: ASTROLOGIE, HOROSKOPE', [
  [1, 'VIEL', 169], [2, 'ETWAS', 1321], [3, 'GAR NICHTS', 3540],
  [-42, 'DATENFEHLER: MFN', 4], [-9, 'KEINE ANGABE', 34], [-6, 'KENNE ICH NICHT', 178],
]);
/** Aufgabe 3, Schritt 3: frequency(allbus, pt03). */
export const PT03 = freq('pt03', 'VERTRAUEN: BUNDESTAG', [
  [1, 'GAR KEIN VERTRAUEN', 365], [2, '..', 386], [3, '..', 556], [4, '..', 837], [5, '..', 820], [6, '..', 472], [7, 'GROSSES VERTRAUEN', 156],
  [-42, 'DATENFEHLER: MFN', 3], [-11, 'TNZ: SPLIT', 1596], [-9, 'KEINE ANGABE', 55],
]);
/** Probier-Werkstatt A3 zum Vergleich: pt15, die beiden Enden und die gültigen Antworten. */
export const PT15 = { none: 539, great: 28, valid: 3586 };
/** Grundlage 3b, Genauer erklärt: TNZ: FILTER bei lm30, TNZ: MODE bei xr19 (= online Befragte, mode 3). */
export const TNZ = { lm30Filter: 436, xr19Mode: 1587 };
/** Aufgabe 4 (repariert): Tarot kenne ich nicht, Freunde sehr wichtig. */
export const RH09B_UNKNOWN = 248;
export const LI04 = { code7: 1534, valid: 5218 };

/** Gültige Antworten, fehlende Werte und alle Befragten einer Tabelle. */
export function freqTotals(f: Freq) {
  const valid = f.rows.filter(r => r.value >= 0).reduce((s, r) => s + r.n, 0);
  const missing = f.rows.filter(r => r.value < 0).reduce((s, r) => s + r.n, 0);
  return { valid, missing, total: valid + missing };
}

/* ---------- Codevorlagen ---------- */

export type Template = { title: string; code: string; tryOut?: boolean };
/** ⟦…⟧ markiert Stellen, die angepasst werden. Die A4-Vorlagen enthalten absichtlich je einen Fehler und keine Marke. */
export const TEMPLATES: Record<string, Template> = {
  start: { title: 'Startblock', code: `# Pakete laden und Daten einlesen
library(tidyverse)
library(mariposa)

allbus <- read_spss("ZA8831_v1-3-0.sav")` },
  a1_dim: { title: 'Vorlage: Zeilen und Spalten zählen', code: `# Wie viele Zeilen (Befragte) und Spalten (Variablen) hat allbus?
dim(allbus)` },
  a1_zellen: { title: 'Vorlage: Zellen zählen', code: `# Zellen zählen: Befragte mal Variablen, unter dem Namen zellen ablegen
zellen <- ⟦Befragte⟧ * ⟦Variablen⟧

# zellen anzeigen
zellen

# Bei einer Zelle pro Sekunde: Sekunden in Tage (durch 60, durch 60, durch 24)
zellen / 60 / 60 / 24` },
  frei_a1: { tryOut: true, title: 'Deine Probier-Werkstatt', code: `# Eine Idee: alle Variablennamen anzeigen
names(allbus)
` },
  a2_idee1: { title: 'Idee 1: Horoskope', code: `# Idee 1: Gibt es eine Frage zu Horoskopen?
find_var(allbus, "horoskop")` },
  a2_idee2: { title: 'Idee 2: Geflüchtete', code: `# Idee 2: Gibt es eine Frage zu Geflüchteten?
find_var(allbus, "⟦flüchtling⟧")` },
  a2_idee3: { title: 'Idee 3: Vertrauen in die Politik', code: `# Idee 3: Gibt es eine Frage zum Vertrauen in die Politik?
find_var(allbus, "⟦politik⟧")` },
  a2_idee4: { title: 'Idee 4: Einsamkeit', code: `# Idee 4: Gibt es eine Frage zur Einsamkeit?
find_var(allbus, "⟦einsam⟧")` },
  frei_a2: { tryOut: true, title: 'Deine Probier-Werkstatt', code: `# Eine Idee: Fragt der ALLBUS auch nach Tarot-Karten?
# Danach: Such nach deiner eigenen Idee
find_var(allbus, "tarot")
` },
  a3_codebuch: { title: 'Codebuch öffnen (in RStudio)', code: `# Das ganze Codebuch im Viewer öffnen (in RStudio)
# Darin mit Strg + F (Mac: Cmd + F) nach rh08b suchen
codebook(allbus)

# Nur eine Variable nachschlagen
codebook(allbus, rh08b)` },
  a3_rh08b: { title: 'Vorlage: Horoskope auszählen', code: `# Codes, Wertelabels und Anzahlen der Horoskop-Frage
frequency(allbus, rh08b)` },
  a3_pt03: { title: 'Vorlage: eine Variable auszählen', code: `# Codes, Wertelabels und Anzahlen einer Variable
frequency(allbus, ⟦rh08b⟧)` },
  frei_a3: { tryOut: true, title: 'Deine Probier-Werkstatt', code: `# Eine Idee: Vertrauen in die politischen Parteien
frequency(allbus, pt15)
` },
  a4_1: { title: 'Reparieren 1', code: `# Wie viele kennen Tarot-Karten nicht?
frequenzy(allbus, rh09b)` },
  a4_2: { title: 'Reparieren 2', code: `# Gibt es Fragen zur Nachbarschaft?
find_var(allbus, nachbar)` },
  a4_3: { title: 'Reparieren 3', code: `# Wie wichtig sind Freunde und Bekannte?
frequency(allbus, Li04)` },
  a4_4: { title: 'Reparieren 4', code: `# Welche Fragen drehen sich um die Kirche?
find_var(allbus, "kirche"` },
  frei_a4: { tryOut: true, title: 'Deine Probier-Werkstatt', code: `# Eine Idee: nur in den Variablennamen suchen
# Probier danach search = "titel" und lies die Meldung
find_var(allbus, "pt", search = "name")
` },
};

/** Workshops that run in the browser; `start` and `a3_codebuch` are copy-only (RStudio). */
export const COPY_ONLY = ['start', 'a3_codebuch'];
/** A4 templates: one error each, no marks (the error must not be given away). */
export const BROKEN = ['a4_1', 'a4_2', 'a4_3', 'a4_4'];

/** Ersetzt die Marken einer Vorlage der Reihe nach durch `values`. */
export function fill(key: string, ...values: string[]): string {
  let i = 0;
  return TEMPLATES[key].code.replace(/⟦(.*?)⟧/g, (_, word: string) => values[i++] ?? word);
}

/** A4, repariert: dieselbe Kommentarzeile, die eine Zeile ohne Fehler. */
export const REPAIRED: Record<string, string> = {
  a4_1: 'frequency(allbus, rh09b)',
  a4_2: 'find_var(allbus, "nachbar")',
  a4_3: 'frequency(allbus, li04)',
  a4_4: 'find_var(allbus, "kirche")',
};
const repaired = (key: string) => `${TEMPLATES[key].code.split('\n')[0]}\n${REPAIRED[key]}`;

/**
 * Alle Vorlagen so, wie sie in RStudio laufen sollen: Marken mit dem Wert gefüllt, den die Aufgabe verlangt,
 * die A4-Zeilen repariert. Daraus entstehen das Skript und die R-Prüfung (scripts/chapter-r-export.ts).
 */
export const R_CHECK: Record<string, Template> = {
  start: TEMPLATES.start,
  a1_dim: TEMPLATES.a1_dim,
  a1_zellen: { title: TEMPLATES.a1_zellen.title, code: fill('a1_zellen', '5246', '579') },
  frei_a1: TEMPLATES.frei_a1,
  a2_idee1: TEMPLATES.a2_idee1,
  a2_idee2: { title: TEMPLATES.a2_idee2.title, code: fill('a2_idee2', 'fluecht') },
  a2_idee3: { title: TEMPLATES.a2_idee3.title, code: fill('a2_idee3', 'vertrauen') },
  a2_idee4: { title: TEMPLATES.a2_idee4.title, code: fill('a2_idee4', 'einsam') },
  frei_a2: TEMPLATES.frei_a2,
  a3_codebuch: TEMPLATES.a3_codebuch,
  a3_rh08b: TEMPLATES.a3_rh08b,
  a3_pt03: { title: TEMPLATES.a3_pt03.title, code: fill('a3_pt03', 'pt03') },
  frei_a3: TEMPLATES.frei_a3,
  a4_1: { title: 'Repariert 1', code: repaired('a4_1') },
  a4_2: { title: 'Repariert 2', code: repaired('a4_2') },
  a4_3: { title: 'Repariert 3', code: repaired('a4_3') },
  a4_4: { title: 'Repariert 4', code: repaired('a4_4') },
  frei_a4: TEMPLATES.frei_a4,
};

/* ---------- Antworten prüfen ---------- */

type Extra = { short?: string; help?: string };
const choice = (id: string, label: string, options: [string, string][], target: string, right: string, hint: string, extra: Extra = {}): Question =>
  ({ id, label, kind: 'choice', options: options.map(([value, l]) => ({ value, label: l })), target, right, hint, ...extra });
const number = (id: string, label: string, target: number, right: string, hint: string, extra: Extra & { tolerance?: number } = {}): Question =>
  ({ id, label, kind: 'number', target, right, hint, ...extra });

/** Antwortfragen am Ende jeder Aufgabe (Ziele = Ausgabe von R, ganzzahlig, Toleranz 0). */
export const QUESTIONS: Record<'a1' | 'a2' | 'a3' | 'a4', Question[]> = {
  a1: [
    number('a1-befragte', 'Wie viele Befragte (Zeilen) hat `allbus`?', 5246,
      '5.246 Befragte. R schreibt die Zahl ohne Punkt: 5246.', 'Führe in Schritt 2 `dim(allbus)` aus. Die erste Zahl nach `[1]` sind die Zeilen, also die Befragten.',
      { short: 'Befragte', help: 'Aus Schritt 2, erste Zahl.' }),
    number('a1-variablen', 'Wie viele Variablen (Spalten) hat `allbus`?', 579,
      '579 Variablen, jede eine Frage oder eine Angabe zum Interview.', 'Die zweite Zahl nach `[1]` in Schritt 2 sind die Spalten, also die Variablen.',
      { short: 'Variablen', help: 'Aus Schritt 2, zweite Zahl.' }),
    choice('a1-tage', 'Bei einer Zelle pro Sekunde: Wie lange bräuchtest du für alle Zellen?', [['4', 'etwa 4 Tage'], ['35', 'etwa 35 Tage'], ['350', 'etwa 350 Tage']], '35',
      'Etwa 35 Tage und Nächte: 3.037.434 Zellen sind 3.037.434 Sekunden. Spätestens hier lohnt sich R.',
      `Setz in Schritt 3 beide Zahlen aus \`dim(allbus)\` ein, ohne Tausenderpunkt (\`5246\`), und lies die letzte Ausgabe. R schreibt Kommazahlen mit Punkt: 35.15549 heißt etwa 35. Steht bei dir ${DAYS_WITH_POINT_TEXT}…, hast du \`5.246\` geschrieben.`,
      { short: 'Tage', help: 'Aus Schritt 3, letzte Zeile der Ausgabe.' }),
    choice('a1-env', 'Wo zeigt dir RStudio, dass `allbus` angekommen ist?', [['konsole', 'in der Konsole unten links'], ['env', 'im Environment oben rechts'], ['viewer', 'im Viewer unten rechts']], 'env',
      'Im Environment steht `allbus` mit „5246 obs. of 579 variables“: obs. sind die Befragten, variables die Variablen.',
      'Die Konsole zeigt, was R antwortet. Welche Objekte R kennt, listet das Environment (Grundlage 1a).',
      { short: 'Environment', help: 'Grundlage 1a, Fenster „Environment“.' }),
  ],
  a2: [
    choice('a2-horoskop', 'Idee 1: Welche Variable misst, was die Befragten von Horoskopen halten?', [['rh08b', 'rh08b'], ['rh09b', 'rh09b'], ['la01', 'la01']], 'rh08b',
      'rh08b, Variablenlabel HALTE VON: ASTROLOGIE, HOROSKOPE. Ein Treffer, und er passt.',
      'Lies das Variablenlabel in der Ausgabe von Schritt 1. rh09b ist Tarot, la01 Bücherlesen.',
      { short: 'Idee 1', help: 'Schritt 1.' }),
    number('a2-fluecht', 'Idee 2: Wie viele Treffer findet `find_var()` mit dem Suchwort `"fluecht"`?', 5,
      '5 Treffer: mi05 und mp16 bis mp19. Mit ‚flüchtling‘ gab es keinen, weil die Labels ü als UE schreiben.',
      'Schreib ü als ue und nimm nur den Wortanfang: `"fluecht"`. Mit ‚fluechtling‘ findest du nur mi05, weil mp16 bis mp19 FLUECHTL. abkürzen. Zähl die Zeilen der Ausgabe.',
      { short: 'Idee 2, Treffer', help: 'Schritt 2, Suchwort `"fluecht"`.' }),
    choice('a2-angst', 'Idee 2: Messen mp16 bis mp19 die Angst vor Geflüchteten?', [
      ['genau', 'Ja, sie fragen nach Angst vor Geflüchteten.'],
      ['risiko', 'Nicht genau: Sie fragen, ob Geflüchtete eher eine Chance oder ein Risiko sind.'],
      ['zuzug', 'Nein, sie fragen, ob man den Zuzug begrenzen will.'],
    ], 'risiko',
    'Genau: Die Labels sagen CHANCE O.RISIKO. Ein Risiko für die Sicherheit zu sehen ist nicht dasselbe wie Angst. Ob eine Variable misst, was du meinst, heißt Gültigkeit (Validität). Kurz gesagt: Passt die Frage zu deiner Idee? Ob man mp16 bis mp19 trotzdem nimmt, ist eine Entscheidung, die du begründest.',
    'Lies die Labels: FLUECHTL. CHANCE O.RISIKO. Das Wort Angst steht nirgends; den Zuzug fragt mi05.',
    { short: 'Idee 2, Angst', help: 'Schritt 2, Labels der Treffer.' }),
    choice('a2-bundestag', 'Idee 3: Mit ‚der Politik‘ ist der Bundestag gemeint. Welche Variable nimmst du?', [['pe01', 'pe01'], ['pt03', 'pt03'], ['pt12', 'pt12'], ['st01', 'st01']], 'pt03',
      'pt03, VERTRAUEN: BUNDESTAG. Gefunden erst mit ‚vertrauen‘; die Suche nach ‚politik‘ findet keine Vertrauensfrage.',
      'pe01 fand die Suche nach ‚politik‘, misst aber, ob Politiker sich um einen kümmern, nicht Vertrauen. pt12 ist die Bundesregierung, st01 das Vertrauen zu Mitmenschen. Such mit `"vertrauen"`.',
      { short: 'Idee 3', help: 'Schritt 3, Suchwort `"vertrauen"`.' }),
    choice('a2-einsam', 'Idee 4: Was folgt für die Einsamkeit?', [
      ['dp03', 'dp03 misst Einsamkeit.'],
      ['neu', 'Keine Variable misst Einsamkeit: dp03 und xs01 sind Scheintreffer, li04 ist nur nah dran. Die Frage müsste man neu stellen.'],
      ['kaputt', 'find_var() funktioniert bei diesem Wort nicht.'],
    ], 'neu',
    'Genau: In GEMEINSAMER steckt ‚einsam‘, xs01 fragt, ob das Interview allein durchgeführt wurde. li04 fragt, wie wichtig Freunde sind, nicht, ob man sich einsam fühlt.',
    'Lies die Labels: dp03 heißt LEBENSPARTNER: GEMEINSAMER HAUSHALT?. find_var() funktioniert; es findet ‚einsam‘ eben auch mitten in einem anderen Wort.',
    { short: 'Idee 4', help: 'Schritt 4, Labels lesen.' }),
  ],
  a3: [
    choice('a3-code1', 'rh08b: Was bedeutet der Code 1?', [['viel', 'VIEL'], ['nichts', 'GAR NICHTS'], ['kenne', 'KENNE ICH NICHT']], 'viel',
      'Code 1 heißt VIEL: 169 Befragte halten viel von Horoskopen.',
      'In der Zeile mit Value 1 steht rechts das Wertelabel. KENNE ICH NICHT hat den Code −6, ist also ein fehlender Wert.',
      { short: 'Code 1', help: 'Schritt 2, Spalte Label.' }),
    number('a3-kenne', 'rh08b: Wie viele Befragte kennen Horoskope nicht?', 178,
      '178 Befragte mit dem Code −6 KENNE ICH NICHT. Sie zählen zu den fehlenden Werten.',
      'Such in Schritt 2 unter ‚Total valid‘ die Zeile KENNE ICH NICHT und lies Spalte N.',
      { short: 'kennen Horoskope nicht', help: 'Schritt 2, unter Total valid.' }),
    number('a3-gueltig-rh', 'rh08b: Wie viele gültige Antworten gibt es?', 5030,
      '5.030 gültige Antworten: alle 5.246 minus 216 fehlende Werte.',
      'Gesucht ist ‚Total valid‘, nicht ‚Total‘. Total sind alle Befragten.',
      { short: 'gültige Antworten rh08b', help: 'Schritt 2, Zeile Total valid.' }),
    number('a3-split', 'pt03: Wie vielen Befragten wurde die Frage gar nicht gestellt?', 1596,
      '1.596 Befragte mit −11 TNZ: SPLIT. Gefragt wurden also 3.650, gut zwei Drittel (knapp 70 %).',
      'Gesucht ist die Zeile mit TNZ (trifft nicht zu). KEINE ANGABE heißt: gefragt, aber nicht geantwortet. Hast du in Schritt 3 `pt03` eingesetzt?',
      { short: 'nicht gefragt', help: 'Schritt 3, Zeile −11.' }),
    number('a3-gueltig-pt', 'pt03: Wie viele gültige Antworten gibt es?', 3592,
      '3.592 gültige Antworten. Für Aussagen zum Vertrauen in den Bundestag zählen nur sie.',
      'Lies in Schritt 3 die Zeile ‚Total valid‘. Steht dort 5030, hast du noch rh08b ausgezählt: Tausch die markierte Stelle gegen `pt03`.',
      { short: 'gültige Antworten pt03', help: 'Schritt 3, Zeile Total valid.' }),
    choice('a3-tnz', 'Was heißt TNZ: SPLIT bei pt03?', [
      ['wollte', 'Die Person wollte nicht antworten.'],
      ['split', 'Die Frage stand nicht in ihrer Fassung des Fragebogens; sie wurde ihr gar nicht gestellt.'],
      ['verloren', 'Die Antwort ist verloren gegangen.'],
    ], 'split',
    'Genau: Der ALLBUS hat mehrere Fassungen des Fragebogens. Wer nicht antworten wollte, hat KEINE ANGABE (−9).',
    'TNZ heißt ‚trifft nicht zu‘: Die Frage kam bei dieser Person gar nicht vor. Nicht antworten wollen ist KEINE ANGABE (−9), verlorene Antworten sind DATENFEHLER (−42).',
    { short: 'TNZ: SPLIT', help: 'Grundlage 3b.' }),
  ],
  a4: [
    number('a4-tarot', 'Reparieren 1: Wie viele Befragte kennen Tarot-Karten nicht?', 248,
      '248 mit −6 KENNE ICH NICHT. Der Fehler war ein Tippfehler im Funktionsnamen: frequency.',
      'R kennt keine Funktion `frequenzy`. Schreib `frequency` und lies dann die Zeile KENNE ICH NICHT.',
      { short: 'Reparieren 1', help: 'Schritt 1, Zeile −6.' }),
    number('a4-nachbar', 'Reparieren 2: Wie viele Treffer findet die Suche nach Nachbarschaft?', 2,
      '2 Treffer: li08 und mc03. Das Suchwort braucht Anführungszeichen.',
      'Die Meldung sagt: pattern muss ein Text sein. Setz `nachbar` in Anführungszeichen und zähl die Zeilen.',
      { short: 'Reparieren 2', help: 'Schritt 2.' }),
    number('a4-freunde', 'Reparieren 3: Wie viele Befragte finden Freunde und Bekannte sehr wichtig (Code 7)?', 1534,
      '1.534 Befragte. Der Variablenname ist klein geschrieben: li04.',
      'Column `Li04` doesn\'t exist: Schreib den Namen klein, `li04`, und lies in Spalte N die Zeile mit Value 7.',
      { short: 'Reparieren 3', help: 'Schritt 3, Value 7.' }),
    number('a4-kirche', 'Reparieren 4: Wie viele Treffer findet die Suche nach ‚kirche‘?', 11,
      '11 Treffer, von WICHTIGKEIT: KIRCHE bis zum Vertrauen in die Kirchen. Die schließende Klammer hatte gefehlt.',
      'Am Ende der Zeile fehlt die schließende Klammer `)`. Ergänze sie und zähl die Zeilen der Ausgabe.',
      { short: 'Reparieren 4', help: 'Schritt 4.' }),
    choice('a4-plus', 'In der RStudio-Konsole steht am Anfang ein `+` statt `>`. Was ist los?', [
      ['kaputt', 'R ist abgestürzt.'],
      ['wartet', 'R wartet auf den Rest der Zeile: Meist fehlt eine Klammer oder ein Anführungszeichen.'],
      ['plus', 'R will etwas addieren.'],
    ], 'wartet',
    'Genau: Esc drücken, die Zeile im Skript reparieren und neu ausführen.',
    'R ist nicht abgestürzt. Das `+` heißt: Die letzte Zeile ist noch nicht fertig (Grundlage 4b).',
    { short: 'Plus in der Konsole', help: 'Grundlage 4b, „Wenn die Konsole + zeigt“.' }),
  ],
};

/** Pflichtaufgaben: Aufgabe 1, 2 und 3 (Aufgabe 4 ist Zusatz). */
export const REQUIRED: Question[] = [...QUESTIONS.a1, ...QUESTIONS.a2, ...QUESTIONS.a3];
/** Zusatz zur Rückmeldung von Aufgabe 2, wenn alles richtig ist. */
export const A2_ALL_RIGHT = '‚Kein Treffer‘ hieß bei Idee 2 nur: anders schreiben.';

/* ---------- Kurz überlegen in den Grundlagen ---------- */

export const G1_SKRIPT: Question = choice('g1-skript', 'Wo schreibst du Code, den du nächste Woche wieder brauchst?',
  [['konsole', 'in der Konsole'], ['skript', 'im Skript'], ['env', 'im Environment']], 'skript',
  'Genau: Das Skript speicherst du als .R-Datei. Die Konsole vergisst alles, sobald du RStudio schließt.',
  'Die Konsole führt aus, vergisst aber alles beim Schließen; das Environment zeigt nur, was R gerade kennt. Aufheben kannst du Code nur im Skript.',
  { short: 'Code aufheben' });
export const G1_PROJEKT: Question = choice('g1-projekt', 'Dein Skript liegt im Projektordner, die ALLBUS-Datei aber noch in Downloads. Was passiert bei `read_spss("ZA8831_v1-3-0.sav")`?',
  [['klappt', 'Es klappt, R sucht auf dem ganzen Rechner.'], ['fehlt', 'R meldet, dass die Datei nicht existiert.'], ['funktion', 'R meldet, dass es die Funktion nicht kennt.']], 'fehlt',
  'Genau: R sucht nur im Arbeitsordner und meldet ‚does not exist‘. Verschieb die Datei in den Projektordner.',
  'R sucht nicht auf dem ganzen Rechner, sondern nur im Arbeitsordner, beim Projekt also im Projektordner. Die Funktion kennt R, sobald mariposa geladen ist; nur die Datei fehlt dort.',
  { short: 'Datei in Downloads' });
export const G1_PAKETE: Question = choice('g1-pakete', 'Du öffnest RStudio am nächsten Tag. Was führst du aus, bevor du arbeitest?',
  [['alles', '`install.packages()` und den Startblock'], ['start', 'nur den Startblock: `library()` und `read_spss()`'], ['nichts', 'nichts, R merkt sich alles']], 'start',
  'Genau: Installiert bleibt installiert. Laden und Einlesen gelten aber nur, solange RStudio offen ist; deshalb steht der Startblock am Anfang jedes Skripts.',
  '`install.packages()` brauchst du nur einmal pro Rechner. Nach dem Schließen vergisst R aber, welche Pakete geladen waren und was `allbus` ist. Darum führst du jedes Mal den Startblock aus.',
  { short: 'Am nächsten Tag' });
export const G2_SPORT: Question = choice('g2-sport', 'Du willst wissen, ob der ALLBUS nach Sport fragt. `find_var(allbus, "sport")` findet nichts. Was probierst du als Nächstes?',
  [['aufgeben', 'Nichts mehr: Die Frage gibt es nicht.'], ['anders', 'Ein allgemeineres Wort, etwa `"freizeit"`.'], ['gross', 'Dasselbe Wort in Großbuchstaben: `"SPORT"`.']], 'anders',
  'Genau. ‚freizeit‘ findet la01 (FREIZEIT: BUECHER LESEN) und li03 (WICHTIGKEIT: FREIZEIT UND ERHOLUNG). Eine Sportfrage ist nicht dabei; sicher bist du erst nach mehreren Suchwörtern und einem Blick ins Codebuch.',
  '`find_var()` achtet nicht auf Groß- und Kleinschreibung, ‚SPORT‘ findet genauso wenig. Aufgeben ist zu früh: Ein anderes Wort findet vielleicht, was du suchst.',
  { short: 'Sport' });
export const G3_GEFRAGT: Question = number('g3-gefragt', 'Wie vielen Befragten wurde die Klimafrage pi08 gestellt?', 3599,
  '3.599: alle 5.246 minus die 1.647 mit TNZ: SPLIT. Gültig geantwortet haben davon 3.507.',
  'Zieh nur die Zeile −11 TNZ: SPLIT von allen 5.246 ab. Wer KEINE ANGABE oder WEISS NICHT hat, wurde gefragt, hat aber nicht gültig geantwortet.',
  { short: 'gefragt', help: 'Gefragt wurden alle außer denen mit TNZ.' });

/* ---------- Erst festlegen ---------- */

/** „Erst festlegen:“ vor jeder Aufgabe; der Text kann Code in `Backticks` enthalten. */
export const PREDICTIONS: Record<'a1' | 'a2' | 'a3' | 'a4', { id: string; prompt: string; options: string[] }> = {
  a1: { id: 'a1-fest', prompt: 'Wie viele Menschen hat der ALLBUS 2023 befragt, was schätzt du?', options: ['etwa 500', 'etwa 5.000', 'etwa 50.000', 'etwa 500.000'] },
  a2: { id: 'a2-fest', prompt: '`find_var()` findet zu einem Suchwort nichts. Was heißt das?', options: ['Der ALLBUS hat diese Frage nicht.', 'Vielleicht schreibt der ALLBUS es anders, als ich gesucht habe.', 'R hat einen Fehler gemacht.'] },
  a3: { id: 'a3-fest', prompt: 'Wie vielen Befragten wurde die Frage nach dem Vertrauen in den Bundestag (pt03) gestellt?', options: ['allen', 'etwa zwei Dritteln', 'etwa der Hälfte'] },
  a4: { id: 'a4-fest', prompt: 'R zeigt eine Fehlermeldung. Was machst du zuerst?', options: ['Den ganzen Code neu abtippen.', 'Die Meldung lesen: Welcher Name steht darin?', 'RStudio neu starten.'] },
};

/* ---------- Hilfe in drei Stufen ---------- */

/** Stufe 1 Denkanstoß, Stufe 2 Wo schaue ich?, Stufe 3 Lösung; Code in `Backticks`. */
export const HINTS: Record<'a1' | 'a2' | 'a3' | 'a4', [string, string, string]> = {
  a1: [
    'Jede Befragte ist eine Zeile, jede Variable eine Spalte. Eine Funktion in dieser Aufgabe zählt beides, die andere Vorlage rechnet mit diesen Zahlen weiter.',
    'Die beiden Zahlen stehen in der Ausgabe von `dim(allbus)` in Schritt 2. Setz sie in Schritt 3 an den markierten Stellen ein, ohne Punkt, also `5246` und nicht `5.246`. In RStudio stehen dieselben Zahlen im Environment hinter `allbus`.',
    '`dim(allbus)` gibt `5246 579` aus: 5.246 Befragte, 579 Variablen. In Schritt 3 steht dann `zellen <- 5246 * 579`; R antwortet 3037434 Zellen und 35.15549 Tage, also gut 35 Tage. In RStudio zeigt das Environment ‚allbus: 5246 obs. of 579 variables‘.',
  ],
  a2: [
    'Die Variablenlabels stehen in Großbuchstaben, ohne Umlaute und oft abgekürzt. Wie sähe ‚Flüchtling‘ dort aus? Und: Ein Treffer ist erst ein Kandidat. Passt das Label wirklich zur Idee?',
    'Grundlage 2b, Suchwort-Labor: ‚bücher‘ gegen ‚buecher‘ und der Scheintreffer ‚tier‘. In jeder Ausgabe steht rechts das Variablenlabel; lies es Wort für Wort.',
    'Idee 1: `find_var(allbus, "horoskop")` findet rh08b. Idee 2: `"flüchtling"` findet nichts, `"fluecht"` findet 5 Treffer: mi05 (Zuzug begrenzen) und mp16 bis mp19 (Chance oder Risiko); Angst misst keine genau. Idee 3: `"politik"` findet 8 Treffer ohne Vertrauen, `"vertrauen"` 16, darunter pt03 (Bundestag), pt12 (Bundesregierung), pt15 (Parteien). Idee 4: `"einsam"` findet nur dp03 (gemEINSAMer Haushalt), `"allein"` nur xs01 (Interview allein), `"freund"` li04 (Freunde wichtig): keine Frage zur Einsamkeit.',
  ],
  a3: [
    'In jeder Ausgabe stehen oben die Antworten, dann ‚Total valid‘, darunter die fehlenden Werte mit negativen Codes. Welche Zeile sagt ‚nicht gefragt‘, welche ‚gefragt, aber nicht geantwortet‘?',
    'rh08b: Schritt 2. pt03: Schritt 3, nachdem du `rh08b` gegen `pt03` getauscht hast. Codes stehen in Spalte Value, Wertelabels in Label, Anzahlen in N.',
    'rh08b: Code 1 heißt VIEL, 178 kennen Horoskope nicht (−6), 5.030 gültige Antworten. pt03: 1.596 wurde die Frage nicht gestellt (−11 TNZ: SPLIT), gefragt wurden also 3.650 (gut zwei Drittel), gültig geantwortet haben 3.592. TNZ: SPLIT heißt: Die Frage stand nicht in ihrer Fassung des Fragebogens.',
  ],
  a4: [
    'Jede Meldung nennt einen Namen in Anführungszeichen oder Backticks. Genau dort steckt der Fehler. Vergleiche die Schreibweise mit Grundlage 4b.',
    'Grundlage 4b, Meldungs-Sortierer: Jede der vier Meldungen steht dort fast wörtlich, nur mit einem anderen Namen. Such die Meldung, die zu deiner passt, und lies, welche Ursache dazugehört. Die Tabelle ‚Hilfe: R meldet einen Fehler‘ unter der Aufgabe sagt dir, was hilft.',
    '1 `frequency(allbus, rh09b)`: 248 kennen Tarot nicht. 2 `find_var(allbus, "nachbar")`: 2 Treffer. 3 `frequency(allbus, li04)`: 1.534 bei Code 7. 4 `find_var(allbus, "kirche")`: 11 Treffer. Ein `+` in der Konsole heißt: R wartet auf den Rest der Zeile.',
  ],
};

/* ---------- Grundlage 4b: Meldungs-Sortierer ---------- */

export const CAUSES: [string, string][] = [
  ['A', 'Funktionsname vertippt oder Paket nicht geladen'],
  ['B', 'Objekt- oder Variablenname falsch geschrieben (Groß- und Kleinschreibung zählt)'],
  ['C', 'Anführungszeichen fehlen'],
  ['D', 'Klammer fehlt, die Zeile ist nicht fertig'],
  ['E', 'Datei liegt nicht im Projektordner'],
  ['F', 'Paket nicht installiert'],
];
/**
 * Sieben Meldungen; `message` wie in RStudio (deutsch), `en` die Fassung der Werkstatt, wo sie abweicht.
 * `only`: die Meldung gibt es nur dort, `note` sagt, was sonst passiert. Rückmeldungen mit Code in `Backticks`.
 */
export type ErrorCase = { code: string; message: string; en?: string; only?: string; note?: string; target: string; right: string; wrong: string };
export const ERROR_CASES: ErrorCase[] = [
  { code: 'codebuch(allbus)', message: 'konnte Funktion "codebuch" nicht finden', en: 'could not find function "codebuch"', target: 'A',
    right: 'Die Funktion heißt `codebook`. Dieselbe Meldung kommt, wenn `library(mariposa)` fehlt.', wrong: 'R kennt keine Funktion dieses Namens: vertippt oder Paket nicht geladen.' },
  { code: 'find_var(Allbus, "klima")', message: "Objekt 'Allbus' nicht gefunden", en: "object 'Allbus' not found", target: 'B',
    right: 'R unterscheidet groß und klein: `allbus` gibt es, `Allbus` nicht.', wrong: 'Der Name in Anführungszeichen ist `Allbus` mit großem A.' },
  { code: 'frequency(allbus, Pi08)', message: "Can't select columns that don't exist. ✖ Column `Pi08` doesn't exist.", target: 'B',
    right: 'Variablennamen sind klein geschrieben: `pi08`.', wrong: 'Column heißt Spalte, also Variable. Schau auf die Schreibweise von `Pi08`.' },
  { code: 'find_var(allbus, klima)', message: '`pattern` must be a single character string.', target: 'C',
    right: 'Das Suchwort ist ein Text und braucht Anführungszeichen: `"klima"`.', wrong: 'Pattern heißt Suchmuster; es muss ein Text sein.' },
  { code: 'find_var(allbus, "klima"', message: 'unexpected end of input', only: 'Werkstatt', note: 'In RStudio erscheint keine Meldung, die Konsole zeigt nur `+` und wartet.', target: 'D',
    right: 'Die schließende Klammer fehlt. R wartet auf den Rest.', wrong: 'Die Zeile endet, bevor die Klammer zu ist.' },
  { code: 'read_spss("ZA8831_v1-3-0.sav")', message: "File 'ZA8831_v1-3-0.sav' does not exist.", target: 'E',
    right: 'R sucht im Arbeitsordner. Leg die Datei in den Projektordner oder nimm `file.choose()`.', wrong: 'Den Dateinamen kennt R, die Datei liegt nur nicht dort, wo R sucht.' },
  { code: 'library(mariposa)', message: 'es gibt kein Paket namens ‘mariposa’', en: "there is no package called 'mariposa'", target: 'F',
    right: 'Einmal `install.packages("mariposa")` ausführen.', wrong: 'Laden geht erst, wenn das Paket installiert ist.' },
];
export const SORTER_ALL_RIGHT = 'Alle sieben richtig. Die meisten Fehler sind Tippfehler; der Name in der Meldung zeigt dir, wo.';

/* ---------- Überblick: Werkzeug zuordnen ---------- */

export const TOOLS: [string, string][] = [
  ['start', 'Startblock ausführen'], ['dim', 'dim()'], ['find', 'find_var()'], ['freq', 'frequency()'], ['cb', 'codebook() in RStudio'],
];
export const TOOL_QUESTIONS: { question: string; target: string; why: string }[] = [
  { question: "R meldet: Objekt 'allbus' nicht gefunden.", target: 'start', why: 'Erst der Startblock legt `allbus` an.' },
  { question: 'Gibt es eine Frage zum Bücherlesen?', target: 'find', why: 'Suchen in Namen und Variablenlabels: `find_var()`.' },
  { question: 'Welche Codes hat pi08, und wie viele haben gültig geantwortet? Du arbeitest hier in der Werkstatt.', target: 'freq', why: 'Für eine Variable als Text: `frequency()`. Den Viewer von `codebook()` gibt es nur in RStudio.' },
  { question: 'Du willst alle Variablen mit ihren Codes durchblättern und mit Strg + F suchen.', target: 'cb', why: 'Das ganze Codebuch im Viewer: `codebook(allbus)`.' },
  { question: 'Ist der ganze Datensatz angekommen: wie viele Befragte, wie viele Variablen?', target: 'dim', why: '`dim(allbus)` zählt Zeilen und Spalten.' },
];

/* ---------- Hilfe bei R-Fehlermeldungen ---------- */

/** Text mit Code-Stücken und Links, ohne JSX. */
export type Rich = (string | { code: string } | { href: string; text: string })[];
export const ERROR_HELP_TITLE = 'Hilfe: R meldet einen Fehler';
export const ERROR_HELP_CAPTION = 'Was R sagt und was du tust';
export const ERROR_HELP: { says: Rich; helps: Rich }[] = [
  { says: [{ code: 'es gibt kein Paket namens ‘mariposa’' }, ' / ', { code: "there is no package called 'mariposa'" }], helps: ['Einmal ', { code: 'install.packages("mariposa")' }, ' ausführen (ebenso ', { code: '"tidyverse"' }, '), dann den Startblock noch einmal.'] },
  { says: [{ code: 'konnte Funktion "find_var" nicht finden' }, ' / ', { code: 'could not find function "find_var"' }], helps: ['Den Startblock ausführen (', { code: 'library(mariposa)' }, '). Läuft er schon: Schreibweise der Funktion prüfen.'] },
  { says: [{ code: "Objekt 'allbus' nicht gefunden" }, ' / ', { code: "object 'allbus' not found" }], helps: ['Die Zeile mit ', { code: 'read_spss()' }, ' aus dem Startblock ausführen; ', { code: 'allbus' }, ' klein schreiben.'] },
  { says: [{ code: "File 'ZA8831_v1-3-0.sav' does not exist." }], helps: ['RStudio über dein Projekt öffnen und die Datei in den Projektordner legen (', { href: '#g1c', text: 'Grundlage 1c' }, '). Sonst ', { code: 'allbus <- read_spss(file.choose())' }, '; unter macOS öffnet sich das Fenster manchmal hinter RStudio.'] },
  { says: [{ code: '`pattern` must be a single character string.' }], helps: ['Das Suchwort in Anführungszeichen setzen: ', { code: 'find_var(allbus, "klima")' }, '.'] },
  { says: [{ code: "Can't select columns that don't exist. ✖ Column `…` doesn't exist." }], helps: ['Den Variablennamen klein und genau so schreiben, wie ', { code: 'find_var()' }, ' ihn zeigt.'] },
  { says: [{ code: 'unerwartetes Ende der Eingabe' }, ' / ', { code: 'unexpected end of input' }, '; die Konsole zeigt ', { code: '+' }], helps: ['Eine Klammer oder ein Anführungszeichen fehlt. In der Konsole Esc drücken, die Zeile reparieren.'] },
  { says: [{ code: 'unerwartete Zeichenkettenkonstante' }, ' / ', { code: 'unexpected string constant' }], helps: ['Zwischen zwei Argumenten fehlt ein Komma.'] },
  { says: [{ code: 'No variables found matching "…".' }], helps: ['Kein Fehler: anders suchen (ae, oe, ue statt Umlaut, kürzerer Wortanfang, anderes Wort).'] },
  { says: [{ code: "Objekt 'Befragte' nicht gefunden" }, ' / ', { code: "object 'Befragte' not found" }, ' (Aufgabe 1)'], helps: ['Die markierten Stellen durch Zahlen ersetzen.'] },
  { says: ['Farbige Zeilen beim Laden: „Attaching core tidyverse packages“, „Conflicts“, „Das folgende Objekt ist maskiert“ (englisch: „masked from“)'], helps: ['Kein Fehler. Weiterarbeiten.'] },
];

/* ---------- Prüf dich selbst ---------- */

export const SELF_TEST: { question: string; options: string[]; answer: number; why: string }[] = [
  { question: 'In allbus <- read_spss("ZA8831_v1-3-0.sav"): Was ist allbus?', options: ['eine Funktion', 'ein Objekt: der Name, unter dem R den Datensatz ablegt', 'ein Argument'], answer: 1,
    why: '<- legt das Ergebnis rechts unter dem Namen links ab. read_spss() ist die Funktion, der Dateiname ihr Argument (Vorweg: R lesen).' },
  { question: 'find_var(allbus, "ärztl") findet nichts. Was probierst du als Nächstes?', options: ['nichts, die Frage gibt es nicht', '"aerzt"', '"ÄRZTL"'], answer: 1,
    why: 'Die Labels schreiben ä als AE. "aerzt" findet ca04 VERHALTENSBEURTEIL: AERZTL. STERBEHILFE. Groß- und Kleinschreibung ist egal (Grundlage 2).' },
  { question: 'Bei einer Frage steht ‚−11 TNZ: SPLIT‘ mit 1.647 Befragten. Was heißt das?', options: ['1.647 wollten nicht antworten', '1.647 wurde die Frage gar nicht gestellt', '1.647 haben ‚weiß nicht‘ gesagt'], answer: 1,
    why: 'TNZ heißt ‚trifft nicht zu‘: Die Frage stand nicht in ihrer Fassung des Fragebogens. Nicht antworten wollen ist KEINE ANGABE, ‚weiß nicht‘ hat einen eigenen Code (Grundlage 3b).' },
  { question: 'find_var() findet zu deinem Suchwort einen Treffer. Was weißt du jetzt?', options: ['Die Variable misst genau, was ich suche.', 'Das Suchwort steht im Namen oder im Variablenlabel. Ob die Variable passt, zeigen Label und Codes.', 'Die Frage wurde allen gestellt.'], answer: 1,
    why: '‚tier‘ findet RESPEKTIEREN, ‚einsam‘ findet GEMEINSAMER HAUSHALT. Ein Treffer ist ein Kandidat (Grundlage 2, Aufgabe 2).' },
  { question: "Du startest RStudio neu und führst sofort find_var(allbus, \"klima\") aus. R meldet: Objekt 'allbus' nicht gefunden. Was fehlt?", options: ['install.packages("mariposa")', 'der Startblock: library() und read_spss()', 'Anführungszeichen um allbus'], answer: 1,
    why: 'Nach dem Neustart kennt R weder die Pakete noch allbus. Installiert bleibt installiert; laden und einlesen musst du jedes Mal (Grundlage 1d).' },
];

/* ---------- Skript zum Mitnehmen ---------- */

export const SCRIPT_FILE = 'sitzung1.R';
const START_FALLBACK = '# Findet R die Datei nicht: allbus <- read_spss(file.choose())';
/** Teile des Skripts in der Reihenfolge des Plans; A4 erscheint repariert. */
export const SCRIPT_PARTS = ['start', 'a1_dim', 'a1_zellen', 'a2_idee1', 'a2_idee2', 'a2_idee3', 'a2_idee4', 'a3_codebuch', 'a3_rh08b', 'a3_pt03', 'a4_1', 'a4_2', 'a4_3', 'a4_4'];
const scriptPart = (k: string) => {
  const t = R_CHECK[k];
  const code = parseMarks(t.code).code + (k === 'start' ? `\n${START_FALLBACK}` : '');
  return `# ---- ${t.title} ----\n${code}\n`;
};
/** Skript sitzung1.R: alle Vorlagen ohne Probier-Werkstätten, Marken mit dem Wert der Aufgabe, A4 repariert. */
export const SCRIPT = '# Sitzung 1: Einstieg\n# Statistikatlas, Methoden Ib, ALLBUS 2023 (ZA8831 v1.3.0)\n# Markierte Stellen aus dem Atlas stehen hier mit ihrem Beispielwert.\n\n'
  + SCRIPT_PARTS.map(scriptPart).join('\n');

/* ---------- Textfassungen der Bilder ---------- */

export const ALT = {
  zeile: 'Erste Zeile: allbus ist das Objekt, also ein Name. Der Pfeil heißt: lege ab unter. read_spss ist die Funktion, sie sagt, was passiert. Der Dateiname in Anführungszeichen ist ihr Argument. Zweite Zeile: find_var ist die Funktion. Ihr erstes Argument ist das Objekt allbus ohne Anführungszeichen, ein Komma trennt es vom zweiten Argument, dem Text klima in Anführungszeichen.',
  werkstatt: 'Schema einer Code-Werkstatt. Oben eine Kopfleiste mit dem Namen der Vorlage und drei Knöpfen: Ausführen führt den Code aus, Zurücksetzen holt die Vorlage zurück, Kopieren kopiert deinen Code für RStudio. Darunter der Code mit Zeilennummern; zwei Stellen sind gelb markiert, dort passt du an. Darunter eine Leiste zum Einfügen von Zeichen: Pipe, Pfeil, Anführungszeichen, Klammern. Ganz unten das Feld Ausgabe mit der Antwort von R.',
  projekt: 'Zwei Fälle. Links liegt die Datei ZA8831_v1-3-0.sav im Projektordner methoden-ib, zusammen mit methoden-ib.Rproj und sitzung1.R. read_spss mit dem Dateinamen findet sie. Rechts liegt die Datei noch im Ordner Downloads, der Projektordner enthält nur methoden-ib.Rproj und sitzung1.R. R sucht im Projektordner und meldet: File ZA8831_v1-3-0.sav does not exist.',
  pakete: 'install.packages mit dem Namen in Anführungszeichen installiert ein Paket einmal. library mit dem Namen lädt es in jeder Sitzung.',
  environment: 'Ausschnitt aus dem Environment in RStudio. Unter Data steht allbus, daneben: Zahl obs. of Zahl variables. Die erste Zahl sind die Befragten (Zeilen), die zweite die Variablen (Spalten). Die Zahlen sind im Bild ausgelassen.',
  findVar: 'find_var sucht das Suchwort buecher in zwei Spalten einer Liste aller Variablen: im Namen und im Variablenlabel. Gezeigt sind sechs Variablen, darunter la01 FREIZEIT: BUECHER LESEN. Nur dort steht BUECHER, also gibt es einen Treffer: la01.',
  formel: 'Gültige Antworten gleich alle Befragten minus alle fehlenden Werte. Für pi08: 3.507 gleich 5.246 minus 1.739. Die 1.739 fehlenden Werte sind 20 Datenfehler, 1.647 nicht gefragt, 52 keine Angabe und 20 weiß nicht.',
  fehler: 'Konsole: find_var(allbus, klima). Darunter rot: Fehler in find_var(allbus, klima): pattern must be a single character string. Object klima not found, a variable name is not accepted here. Erstens zeigt die Meldung, wo: in find_var. Zweitens, was: Das Suchmuster muss ein Text sein. Drittens einen Hinweis: klima wurde als Name gelesen; es fehlen Anführungszeichen.',
  weg: 'Ablauf in fünf Schritten. Erstens Projekt öffnen; die Datei liegt im Projektordner. Zweitens den Startblock ausführen: library und read_spss; allbus steht dann im Environment, prüfen mit dim(allbus). Drittens suchen mit find_var: kurzer Wortanfang, ü als ue; bei keinem Treffer anders suchen. Viertens lesen mit frequency oder codebook: Codes, Wertelabels, fehlende Werte. Fünftens entscheiden: passt, nah dran oder neu fragen. Bei jeder Fehlermeldung: lesen, wo, was, welcher Name.',
};

/** Bild s1-rstudio: die vier Fenster mit ihrem Text (Code in `Backticks`). */
export const PANES: { id: 'skript' | 'konsole' | 'env' | 'files'; button: string; name: string; where: string; text: string }[] = [
  { id: 'skript', button: 'Skript', name: 'Skript', where: 'oben links', text: 'Hier schreibst du deinen Code und speicherst ihn als Datei mit der Endung .R. So hast du ihn nächste Woche noch. Eine Zeile führst du aus, indem du den Cursor hineinsetzt und Strg/Cmd + Enter drückst. Fehlt das Fenster, öffnest du es über File → New File → R Script.' },
  { id: 'konsole', button: 'Konsole', name: 'Konsole', where: 'unten links', text: 'Hier führt R den Code aus und antwortet, auch mit Fehlermeldungen. Was du direkt hier tippst, ist nach dem Schließen weg.' },
  { id: 'env', button: 'Environment', name: 'Environment', where: 'oben rechts', text: 'Zeigt alle Objekte, die R gerade kennt. Nach dem Einlesen steht hier `allbus`, dahinter, wie viele Befragte (obs.) und Variablen (variables) der Datensatz hat.' },
  { id: 'files', button: 'Files und Viewer', name: 'Files, Plots, Viewer, Help', where: 'unten rechts', text: 'Files zeigt die Dateien in deinem Projektordner, Plots deine Grafiken, Viewer das Codebuch aus `codebook()`, Help die Hilfeseiten.' },
];
