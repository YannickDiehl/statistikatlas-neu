import type { Hint } from '../kit/HintLadder';

export const S02_VARS = ['pa02a', 'pa01', 'pt03', 'st01', 'pv01', 'ls01'] as const;
export type S02Var = typeof S02_VARS[number];
export const SHEET_IDS = ['1', '2', '3'] as const;
export type SheetId = typeof SHEET_IDS[number];

/** Was richtig erfasst wäre – als Label oder Zahl; die Codes ermittelt der Browser zur Laufzeit aus der Datei. */
export type Soll = { kind: 'label'; label: string } | { kind: 'value'; value: number } | { kind: 'open'; options: string[] };
/** Wie der Bogen aussieht. */
export type Mark =
  | { kind: 'cross'; at: string[] }
  | { kind: 'struck'; struck: string; at: string }
  | { kind: 'between'; a: string; b: string }
  | { kind: 'note'; text: string }
  | { kind: 'empty' }
  | { kind: 'absent' };
export type Question = { variable: S02Var; text: string; options: string[] };
export type Sheet = { id: SheetId; version: 'A' | 'B'; cells: Record<S02Var, { mark: Mark; soll: Soll }> };
/** Eintrag des Kollegen Ben. */
export type Entry = { kind: 'label'; label: string } | { kind: 'value'; value: number } | { kind: 'blank' };

const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => String(a + i));

export const questions: Question[] = [
  { variable: 'pa02a', text: 'Wie stark interessieren Sie sich für Politik?', options: ['sehr stark', 'stark', 'mittel', 'wenig', 'überhaupt nicht'] },
  { variable: 'pa01', text: 'Viele Leute verwenden die Begriffe „links“ und „rechts“. Wo würden Sie sich selbst einstufen? (1 = links, 10 = rechts)', options: range(1, 10) },
  { variable: 'pt03', text: 'Wie viel Vertrauen haben Sie in den Bundestag? (1 = gar kein Vertrauen, 7 = großes Vertrauen)', options: range(1, 7) },
  { variable: 'st01', text: 'Kann man den meisten Menschen vertrauen, oder muss man im Umgang mit anderen vorsichtig sein?', options: ['Man kann den meisten trauen', 'Man muss vorsichtig sein', 'Kommt darauf an', 'Sonstiges'] },
  { variable: 'pv01', text: 'Wenn am nächsten Sonntag Bundestagswahl wäre: Welche Partei würden Sie wählen?', options: ['CDU/CSU', 'SPD', 'FDP', 'Bündnis 90/Die Grünen', 'Die Linke', 'AfD', 'eine andere Partei', 'Ich würde nicht wählen', 'Weiß nicht'] },
  { variable: 'ls01', text: 'Wie zufrieden sind Sie gegenwärtig, alles in allem, mit Ihrem Leben? (0 = ganz unzufrieden, 10 = ganz zufrieden)', options: range(0, 10) },
];

const label = (l: string): Soll => ({ kind: 'label', label: l });
const value = (v: number): Soll => ({ kind: 'value', value: v });
const cross = (...at: string[]): Mark => ({ kind: 'cross', at });

export const sheets: Sheet[] = [
  { id: '1', version: 'A', cells: {
    pa02a: { mark: cross('sehr stark'), soll: label('SEHR STARK') },
    pa01: { mark: cross('3'), soll: value(3) },
    pt03: { mark: cross('6'), soll: value(6) },
    st01: { mark: { kind: 'absent' }, soll: label('TNZ: SPLIT') },
    pv01: { mark: cross('Die Linke'), soll: label('DIE LINKE') },
    ls01: { mark: cross('8'), soll: value(8) },
  } },
  { id: '2', version: 'B', cells: {
    pa02a: { mark: { kind: 'struck', struck: 'mittel', at: 'wenig' }, soll: label('WENIG') },
    pa01: { mark: cross('5', '6'), soll: { kind: 'open', options: ['5', '6', 'DATENFEHLER: MFN'] } },
    pt03: { mark: { kind: 'absent' }, soll: label('TNZ: SPLIT') },
    st01: { mark: { kind: 'note', text: '„weiß nicht so recht, kommt auf die Leute an“' }, soll: { kind: 'open', options: ['KOMMT DARAUF AN', 'WEISS NICHT', 'KEINE ANGABE'] } },
    pv01: { mark: cross('Weiß nicht'), soll: label('WEISS NICHT') },
    ls01: { mark: { kind: 'between', a: '7', b: '8' }, soll: { kind: 'open', options: ['7', '8', 'KEINE ANGABE'] } },
  } },
  { id: '3', version: 'A', cells: {
    pa02a: { mark: cross('überhaupt nicht'), soll: label('UEBERHAUPT NICHT') },
    pa01: { mark: cross('8'), soll: value(8) },
    pt03: { mark: cross('1'), soll: label('GAR KEIN VERTRAUEN') },
    st01: { mark: { kind: 'absent' }, soll: label('TNZ: SPLIT') },
    pv01: { mark: { kind: 'empty' }, soll: label('KEINE ANGABE') },
    ls01: { mark: cross('0'), soll: value(0) },
  } },
];

const bv = (v: number): Entry => ({ kind: 'value', value: v });
const bl = (l: string): Entry => ({ kind: 'label', label: l });
/** Bens Ersterfassung: sechs Abweichungen mit typischen Fehlern. */
export const ben: Record<SheetId, Record<S02Var, Entry>> = {
  '1': { pa02a: bv(5), pa01: bv(3), pt03: bv(6), st01: { kind: 'blank' }, pv01: bv(5), ls01: bv(8) },
  '2': { pa02a: bl('WENIG'), pa01: bv(5), pt03: bl('TNZ: SPLIT'), st01: bl('WEISS NICHT'), pv01: bl('WEISS NICHT'), ls01: bv(8) },
  '3': { pa02a: bl('UEBERHAUPT NICHT'), pa01: bv(8), pt03: bl('GAR KEIN VERTRAUEN'), st01: bl('TNZ: SPLIT'), pv01: bl('KEINE ANGABE'), ls01: bl('KEINE ANGABE') },
};
export const benNotes: Record<string, string> = {
  '1.pa02a': 'Ben hat die Richtung der Skala verwechselt.',
  '1.pv01': 'Ben hat gezählt, an welcher Stelle die Partei auf dem Bogen steht, statt den Code im Codebuch nachzuschlagen.',
  '1.st01': 'Ben hat die Zelle leer gelassen. In R wird daraus NA – und niemand weiß mehr, warum die Antwort fehlt.',
  '2.pa01': 'Ben hat einfach das erste Kreuz genommen.',
  '2.ls01': 'Ben hat aufgerundet.',
  '3.ls01': 'Ben hat die 0 als „keine Angabe“ gelesen – sie ist eine gültige Antwort.',
};

/** Was im vorgemachten Beispiel zu Bogen 1 je Frage erklärt wird. */
export const exampleNotes: Record<S02Var, string> = {
  pa02a: 'Achtung, Richtung: Der Code 1 steht für SEHR STARK. Die Skala beginnt beim stärksten Interesse.',
  pa01: 'Bei Skalen von 1 bis 10 ist der Code einfach die angekreuzte Zahl.',
  pt03: 'Auch hier ist der Code die angekreuzte Zahl.',
  st01: 'Die Frage steht nicht auf dem Bogen, weil er Version A ist. Die Person wurde also nicht gefragt: Code für TNZ (trifft nicht zu).',
  pv01: 'DIE LINKE steht auf dem Bogen an fünfter Stelle, hat im Codebuch aber den Code 6. Codes sind Namen, keine Reihenfolge.',
  ls01: 'Code ist die angekreuzte Zahl.',
};

export const LOAD_SCRIPT = `library(tidyverse)
library(mariposa)

allbus <- read_spss(file.choose())
# oder direkt, wenn die Datei im Arbeitsverzeichnis liegt:
# allbus <- read_spss("ZA8831_v1-3-0.sav")
`;

/** Schritt 4: nur die Papierbögen behalten und im Codebuch zählen. */
export const PAPER_SCRIPT = `# Nur die Papierbögen behalten: mode 4 = MAIL (Papier per Post)
papier <- allbus %>% filter(mode == 4)

# Das Codebuch nur für die Papierbögen öffnen,
# darin mit Strg+F / Cmd+F nach pa01 und st01 suchen
codebook(papier)
`;

/** Schritt 5: Codes in Wörter umwandeln und zurück. */
export const CONVERT_SCRIPT = `# Codes in Wörter umwandeln: aus 42 wird "AFD"
partei <- to_label(allbus, pv01)
codebook(partei)   # darin nach pv01 suchen

# Und wieder zurück in Zahlen (die Wertelabels behalten)
partei <- to_numeric(partei, pv01, keep_labels = TRUE)
codebook(partei)   # wieder nach pv01 suchen
`;

/** Werkzeugkasten: alle Funktionen der Sitzung an neutralen Beispielen (Geschlecht statt Erhebungsart und Wahlabsicht). */
export const TOOLBOX_SCRIPT = `# Start wie in Sitzung 1
library(tidyverse)
library(mariposa)
allbus <- read_spss(file.choose())

# Das ganze Codebuch öffnen, darin mit Strg+F / Cmd+F suchen
codebook(allbus)

# Nur bestimmte Befragte behalten, Beispiel: nur Frauen (sex 2)
frauen <- allbus %>% filter(sex == 2)
codebook(frauen)   # Codebuch nur für diese Befragten

`;

export const R_SOLUTION = `library(tidyverse)
library(mariposa)

allbus <- read_spss(file.choose())

# Schritt 1: Welcher Code gehört zu welchem Wort?
# Das ganze Codebuch öffnen und darin mit Strg+F / Cmd+F
# nach pa02a, pa01, pt03, st01, pv01, ls01 und splt23_1 suchen
codebook(allbus)

# Schritt 4: Wie speichert der ALLBUS Papierbögen?
${PAPER_SCRIPT}
# Zusatz (freiwillig): Parteinamen statt Codes – und zurück
${CONVERT_SCRIPT}`;

export const hints: Record<'codes' | 'paper' | 'convert', Hint> = {
  codes: {
    think: 'Auf dem Papier stehen Wörter, im Datensatz Zahlen. Wo steht, welche Zahl zu welchem Wort gehört?',
    pointer: 'codebook(allbus) öffnet das ganze Codebuch. Mit Strg+F (Mac: Cmd+F) springst du zu pa02a, pa01 usw. Dort stehen das Variablenlabel, die Codes mit ihren Wertelabels und die fehlenden Werte.',
    concept: { id: 'labels', label: 'Variablen- & Wertelabels' },
    workshop: '4.4.2 codebook()',
    scaffold: 'codebook(___)\n# danach mit Strg+F / Cmd+F nach den Variablen suchen',
    solution: 'codebook(allbus)\n# danach mit Strg+F / Cmd+F nach pa02a, pa01, pt03,\n# st01, pv01, ls01 und splt23_1 suchen',
  },
  paper: {
    think: 'Welche Variable verrät, wie jemand teilgenommen hat – und welcher Code steht dort für MAIL (Papierbogen per Post)?',
    pointer: 'mode ist die Erhebungsart. Mit filter() behältst du nur die Befragten, die eine Bedingung erfüllen – wie im Werkzeugkasten bei den Frauen. Danach öffnest du das Codebuch nur für diese Befragten.',
    concept: { id: 'codebook', label: 'Codebuch & Variablensuche' },
    workshop: '4.5.2 Fälle filtern',
    scaffold: 'papier <- allbus %>% filter(mode == ___)\ncodebook(___)',
    solution: PAPER_SCRIPT,
  },
  convert: {
    think: 'Was passiert mit einem Code, wenn man ihn in ein Wort und wieder zurück in eine Zahl verwandelt?',
    pointer: 'to_label() macht aus Codes Wörter, to_numeric() macht daraus wieder Zahlen (beide oben im Zusatz erklärt). Nach jedem Schritt siehst du im Codebuch nach.',
    concept: { id: 'conversion', label: 'Datentypen umwandeln' },
    workshop: '4.6 Datentypen',
    scaffold: 'partei <- to_label(allbus, ___)\ncodebook(partei)\n\npartei <- to_numeric(partei, ___, keep_labels = TRUE)\ncodebook(partei)',
    solution: CONVERT_SCRIPT,
  },
};
