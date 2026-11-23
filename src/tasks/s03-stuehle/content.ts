import type { Hint } from '../kit/HintLadder';

/** Missing-Codes der Wahlabsicht in der Reihenfolge, in der sie in der Stuhlregel erscheinen. */
export const CHAIR_CODES = [-8, -7, -50, -9, -42] as const;
export type Selection = 'gefragt' | 'vollzeit' | 'teilzeit' | 'alle0';
export const SELECTIONS: { id: Selection; label: string; short: string }[] = [
  { id: 'gefragt', label: 'alle, denen die Frage gestellt wurde (Voll- und Teilzeit)', short: 'aller Voll- und Teilzeitbeschäftigten' },
  { id: 'vollzeit', label: 'nur Vollzeit', short: 'der Vollzeitbeschäftigten' },
  { id: 'teilzeit', label: 'nur Teilzeit', short: 'der Teilzeitbeschäftigten' },
  { id: 'alle0', label: 'alle Befragten, Nicht-Erwerbstätige mit 0 Stunden', short: 'aller Befragten (Nicht-Erwerbstätige mit 0)' },
];

export const LOAD_SCRIPT = `library(tidyverse)
library(mariposa)

allbus <- read_spss(file.choose())
# oder direkt, wenn die Datei im Arbeitsverzeichnis liegt:
# allbus <- read_spss("ZA8831_v1-3-0.sav")
`;

/** Werkzeugkasten: alle Funktionen der Sitzung an neutralen Beispielen (Geschlecht und Alter statt Wahlabsicht und Arbeitsstunden). */
export const TOOLBOX_SCRIPT = `${LOAD_SCRIPT}
# Häufigkeitstabelle, Beispiel: Geschlecht
allbus %>% frequency(sex)

# Nur bestimmte Befragte behalten, Beispiel: nur Frauen (sex 2)
frauen <- allbus %>% filter(sex == 2)

# Kennzahlen einer Variable, Beispiel: Alter – für alle und nur für Frauen
allbus %>% describe(age)
frauen %>% describe(age)

# R als Taschenrechner: 25 von 100 sind wie viel Prozent?
25 / (25 + 75) * 100
`;

export const R_SOLUTION = `${LOAD_SCRIPT}
# Saal 1: Wahlabsicht auszählen
allbus %>% frequency(pv01)

# Sitzplan, Beispielregel: Außer den Parteien bekommt nur „weiß nicht“ einen Stuhl.
# N der Gruppe / Summe der N aller Gruppen mit Stuhl * 100
988 / (3984 + 603) * 100   # CDU/CSU

# Saal 2: Wer wurde nach den Stunden gefragt?
codebook(allbus)   # nach dw15 und work suchen
vollzeit <- allbus %>% filter(work == 1)
teilzeit <- allbus %>% filter(work == 2)

# Was steht auf dem Schild?
allbus %>% describe(dw15)
vollzeit %>% describe(dw15)
teilzeit %>% describe(dw15)

# Wie viele Stühle liegen über dem Mittelwert? (100 minus Cum. %)
allbus %>% frequency(dw15)
`;

export const hints: Record<'count' | 'hall' | 'who' | 'sign' | 'row', Hint> = {
  count: {
    think: 'Welches Werkzeug aus dem Werkzeugkasten zählt, wie oft jeder Code einer Variable vorkommt?',
    pointer: 'frequency() – wie im Werkzeugkasten beim Geschlecht, nur mit der Wahlabsicht. Die fehlenden Werte stehen unten in der Tabelle, unter „Total valid“, jeder mit Code, Wertelabel und Anzahl N.',
    concept: { id: 'missing', label: 'Fehlende Werte' },
    workshop: '4.8 Fehlende Werte',
    scaffold: 'allbus %>% frequency(___)',
    solution: 'allbus %>% frequency(pv01)',
  },
  hall: {
    think: 'Welche Spalte von frequency() verteilt 100 Prozent nur auf die gültigen Antworten – und welche auf alle Befragten? Passt eine davon zu deiner Regel?',
    pointer: 'Passt keine Spalte, rechnest du selbst: N der Gruppe geteilt durch die Summe der N aller Gruppen mit Stuhl, mal 100. Die N stehen in allbus %>% frequency(pv01).',
    concept: { id: 'missing', label: 'Fehlende Werte' },
    workshop: '4.8 Fehlende Werte',
    scaffold: '# N der Gruppe / Summe der N aller Gruppen mit Stuhl * 100\n988 / (3984 + ___) * 100',
    solution: '# Beispiel: Außer den Parteien bekommt nur „weiß nicht“ (N = 603) einen Stuhl\n988 / (3984 + 603) * 100   # CDU/CSU: rund 22 Stühle',
  },
  row: {
    think: 'Stell dir die Reihe sortiert vor. Bei welchem Stuhl liegt der Mittelwert – in der Mitte oder daneben?',
    pointer: 'In der Spalte Cum. % von frequency() steht, wie viel Prozent höchstens so viele Stunden arbeiten. Such die letzte Zeile unter dem Mittelwert; 100 minus diesen Wert liegen darüber.',
    concept: { id: 'describe', label: 'Deskriptiver Überblick' },
    workshop: '7.4.2 describe()',
    scaffold: '___ %>% frequency(dw15)\n# letzte Zeile unter dem Mittelwert suchen, dann:\n100 - ___',
    solution: 'allbus %>% frequency(dw15)\n# Mittelwert 37,89: letzte Zeile darunter ist 37,7 mit Cum. % = 33,79\n100 - 33.79   # rund 66 Stühle über dem Mittelwert',
  },
  who: {
    think: 'Wo steht, wem eine Frage gestellt wurde – und wer sie gar nicht bekommen hat?',
    pointer: 'Im Codebuch steht bei dw15 der fehlende Wert −10 „TNZ: FILTER“. In work steht, wer Vollzeit (1) oder Teilzeit (2) arbeitet. Mit filter() behältst du nur diese Befragten – wie im Werkzeugkasten bei den Frauen.',
    concept: { id: 'missing', label: 'Fehlende Werte' },
    workshop: '4.5.2 Fälle filtern',
    scaffold: 'codebook(allbus)   # nach dw15 und work suchen\nvollzeit <- allbus %>% filter(work == ___)',
    solution: 'codebook(allbus)   # nach dw15 und work suchen\nvollzeit <- allbus %>% filter(work == 1)\nteilzeit <- allbus %>% filter(work == 2)',
  },
  sign: {
    think: 'Welches Werkzeug fasst eine Variable in wenigen Zahlen zusammen – darunter Mittelwert und Median?',
    pointer: 'describe() zeigt Mean (Mittelwert) und Median. Für nur Vollzeit oder nur Teilzeit setzt du statt allbus deine gefilterten Daten ein – wie im Werkzeugkasten bei den Frauen.',
    concept: { id: 'describe', label: 'Deskriptiver Überblick' },
    workshop: '7.4.2 describe()',
    scaffold: '___ %>% describe(dw15)',
    solution: '# alle, denen die Frage gestellt wurde\ndescribe(allbus, dw15)\n# oder nur Vollzeit bzw. Teilzeit\ndescribe(vollzeit, dw15)\ndescribe(teilzeit, dw15)',
  },
};
