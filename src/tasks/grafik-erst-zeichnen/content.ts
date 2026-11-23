import type { Hint } from '../kit/HintLadder';

/** Skalenniveau, wie es für die Wahl der Grafik zählt. Die 0–10-Skala gilt hier als metrisch (elf gleich weite Stufen). */
export type Level = 'nominal' | 'ordinal' | 'metric';
export type VarMeta = {
  name: string;
  title: string;
  /** Frage in Kurzform und Antwortskala, wie sie im Rätselkasten und im Bauplan stehen. */
  question: string;
  scale: string;
  level: Level;
  /** Name der Spalte im R-Code; to_label() behält den Variablennamen. */
  rName: string;
  /** Kurze Beschriftungen für Kategorien (statt der Großbuchstaben-Labels der Datei). */
  short?: Record<number, string>;
};

export const VARS: Record<string, VarMeta> = {
  ls01: { name: 'ls01', title: 'Lebenszufriedenheit', question: 'Wie zufrieden sind Sie gegenwärtig, alles in allem, mit Ihrem Leben?', scale: '0 ganz unzufrieden … 10 ganz zufrieden', level: 'metric', rName: 'ls01' },
  hs01: { name: 'hs01', title: 'Gesundheit', question: 'Wie würden Sie Ihren Gesundheitszustand im Allgemeinen beschreiben?', scale: '1 sehr gut · 2 gut · 3 zufriedenstellend · 4 weniger gut · 5 schlecht', level: 'ordinal', rName: 'hs01' },
  pa02a: { name: 'pa02a', title: 'Politisches Interesse', question: 'Wie stark interessieren Sie sich für Politik?', scale: '1 sehr stark · 2 stark · 3 mittel · 4 wenig · 5 überhaupt nicht', level: 'ordinal', rName: 'pa02a' },
  pa01: { name: 'pa01', title: 'Links-rechts', question: 'Wo würden Sie Ihre politischen Ansichten auf einer Skala von links nach rechts einstufen?', scale: '1 links … 10 rechts', level: 'ordinal', rName: 'pa01' },
  dw15: { name: 'dw15', title: 'Arbeitsstunden', question: 'Wie viele Stunden arbeiten Sie durchschnittlich pro Woche? (nur Erwerbstätige)', scale: 'Stunden, mit Nachkommastellen', level: 'metric', rName: 'dw15' },
  age: { name: 'age', title: 'Alter', question: 'Alter der befragten Person', scale: 'Jahre', level: 'metric', rName: 'age' },
  eastwest: { name: 'eastwest', title: 'Wohngebiet', question: 'Erhebungsgebiet: alte oder neue Bundesländer', scale: '1 West · 2 Ost', level: 'nominal', rName: 'eastwest', short: { 1: 'West', 2: 'Ost' } },
  sex: { name: 'sex', title: 'Geschlecht', question: 'Geschlecht der befragten Person', scale: '1 Mann · 2 Frau · 3 divers', level: 'nominal', rName: 'sex', short: { 1: 'Mann', 2: 'Frau', 3: 'divers' } },
  ps03: {
    name: 'ps03', title: 'Zufriedenheit mit der Demokratie', question: 'Wie zufrieden sind Sie – alles in allem – mit der Demokratie, so wie sie in Deutschland besteht?',
    scale: '1 sehr zufrieden … 6 sehr unzufrieden', level: 'ordinal', rName: 'ps03',
    short: { 1: 'sehr zufrieden', 2: 'ziemlich zufrieden', 3: 'etwas zufrieden', 4: 'etwas unzufrieden', 5: 'ziemlich unzufrieden', 6: 'sehr unzufrieden' },
  },
};

/* ---------- Teil 1 · Vorher-Skizze ---------- */

export const SKETCH_VAR = 'ls01';
export const SKETCH_CODES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

/* ---------- Teil 2 · Silhouetten ---------- */

export const SILHOUETTE_IDS = ['A', 'B', 'C', 'D'] as const;
export type SilhouetteId = typeof SILHOUETTE_IDS[number];
/** Feste Reihenfolge, damit der Raum dieselben Buchstaben vergleicht. */
export const SILHOUETTES: Record<SilhouetteId, string> = { A: 'hs01', B: 'dw15', C: 'pa01', D: 'age' };
/** Kandidaten im Rätselkasten: die vier richtigen und ein Köder mit derselben Stufenzahl wie A. */
export const CANDIDATES = ['pa02a', 'age', 'hs01', 'dw15', 'pa01'] as const;

/* ---------- Teil 3 · Bauplan ---------- */

export type GeomId = 'bar' | 'dodge' | 'fill' | 'histogram' | 'boxplot' | 'point' | 'jitter';
export type Role = 'fill' | 'y';
export const GEOMS: { id: GeomId; label: string; code: string; role: Role }[] = [
  { id: 'bar', label: 'Balken, gestapelt', code: 'geom_bar()', role: 'fill' },
  { id: 'dodge', label: 'Balken nebeneinander', code: 'geom_bar(position = "dodge")', role: 'fill' },
  { id: 'fill', label: 'Balken auf 100 %', code: 'geom_bar(position = "fill")', role: 'fill' },
  { id: 'histogram', label: 'Histogramm', code: 'geom_histogram()', role: 'fill' },
  { id: 'boxplot', label: 'Boxplot', code: 'geom_boxplot()', role: 'y' },
  { id: 'point', label: 'Punkte', code: 'geom_point()', role: 'y' },
  { id: 'jitter', label: 'Punkte, gestreut', code: 'geom_jitter(width = 0.3, height = 0.3, alpha = 0.2)', role: 'y' },
];
export const GEOM_IDS = GEOMS.map(g => g.id);

export type QuestionId = 'demokratie' | 'stunden' | 'alter';
export type Question = {
  id: QuestionId;
  short: string;
  text: string;
  /** Die Gruppe, nach der verglichen wird, und das Merkmal, das verglichen wird. */
  group: string;
  outcome: string;
};
export const QUESTIONS: Question[] = [
  { id: 'demokratie', short: 'Demokratie in Ost und West', text: 'Sind Menschen im Osten mit der Demokratie unzufriedener als im Westen?', group: 'eastwest', outcome: 'ps03' },
  { id: 'stunden', short: 'Arbeitsstunden nach Geschlecht', text: 'Arbeiten Frauen weniger Stunden als Männer?', group: 'sex', outcome: 'dw15' },
  { id: 'alter', short: 'Alter und Lebenszufriedenheit', text: 'Werden Menschen mit dem Alter zufriedener?', group: 'age', outcome: 'ls01' },
];
export const QUESTION_IDS = QUESTIONS.map(q => q.id);

/* ---------- Teil 4 · Achse ---------- */

export const AXIS_MAX_START = 7.1;

/* ---------- R ---------- */

export const R_SETUP = `# Pakete laden
library(tidyverse)
library(mariposa)

# Daten einlesen
allbus <- read_spss(file.choose())

# oder direkt, wenn die Datei im Arbeitsverzeichnis liegt:
# allbus <- read_spss("ZA8831_v1-3-0.sav")`;

/** Werkzeugkasten: alle Funktionen der Sitzung an neutralen Beispielen (Schulabschluss, Geschlecht, Haushaltsgröße und Einkommen statt der Aufgabenvariablen). */
export const TOOLBOX_SCRIPT = `${R_SETUP}

# Die Pipe %>% kennst du aus Sitzung 2 und 3 – lies sie als „und dann“.
# Bisher hast du Zwischenergebnisse unter einem eigenen Namen gespeichert:
# frauen <- allbus %>% filter(sex == 2)
# frauen %>% describe(age)

# Neu: mehrere Schritte zu einer Kette verbinden, jeder in einer eigenen Zeile.
# Nimm allbus, und dann behalte die Frauen, und dann beschreibe das Alter:
allbus %>%
  filter(sex == 2) %>%
  describe(age)

# Eine Grafik baust du in Schichten: Daten und Achsen (aes), dann die Form (geom).
# Die Daten kommen mit %>% hinein, zwischen den Schichten steht ein +.

# Kategorien: ein Balken je Ausprägung, Beispiel Schulabschluss
allbus %>%
  filter(!is.na(educ)) %>%
  ggplot(aes(x = educ)) +
  geom_bar()

# Metrische Variable: Histogramm, Beispiel Personen im Haushalt
allbus %>%
  filter(!is.na(dh04)) %>%
  ggplot(aes(x = dh04)) +
  geom_histogram(binwidth = 1)

# Daten für ein Bild mit zwei Variablen: Wörter statt Codes, fehlende Werte weglassen
bild <- allbus %>%
  to_label(educ) %>%
  filter(!is.na(educ), !is.na(dh04))

# n zählen: So viele Befragte stecken im Bild
bild %>%
  nrow()

# Zwei Variablen: ein Boxplot je Gruppe, mit Titel und Quelle
bild %>%
  ggplot(aes(x = educ, y = dh04)) +
  geom_boxplot() +
  labs(
    title   = "Personen im Haushalt nach Schulabschluss",
    caption = "ALLBUS 2023, n = …"
  )

# Zwei kategoriale Variablen: Balken auf 100 %, Anteile innerhalb jeder Gruppe
# Beispiel Geschlecht je Schulabschluss; position = "dodge" stellt die Balken nebeneinander
allbus %>%
  to_label(educ, sex) %>%
  filter(!is.na(educ), !is.na(sex)) %>%
  ggplot(aes(x = educ, fill = sex)) +
  geom_bar(position = "fill")

# Zwei metrische Variablen: ein Punkt je Befragten, leicht gestreut und halb durchsichtig
allbus %>%
  filter(!is.na(dh04), !is.na(incc)) %>%
  ggplot(aes(x = dh04, y = incc)) +
  geom_jitter(width = 0.3, height = 0.3, alpha = 0.2)
`;

export const R_SKETCH = `# Teil 1 · Die echte Verteilung
allbus %>%
  filter(!is.na(ls01)) %>%
  ggplot(aes(x = ls01)) +
  geom_bar()

# Genau nachzählen
allbus %>%
  frequency(ls01)`;

export const R_SILHOUETTES = `# Teil 2 · Wie viele Stufen hat welche Frage?
# Im Codebuch nach hs01, pa02a, pa01, dw15 und age suchen
codebook(allbus)

# Kategorien: ein Balken je Stufe, hier Gesundheit
allbus %>%
  filter(!is.na(hs01)) %>%
  ggplot(aes(x = hs01)) +
  geom_bar()

# Politisches Interesse
allbus %>%
  filter(!is.na(pa02a)) %>%
  ggplot(aes(x = pa02a)) +
  geom_bar()

# Links-rechts
allbus %>%
  filter(!is.na(pa01)) %>%
  ggplot(aes(x = pa01)) +
  geom_bar()

# Metrisch: ein Balken je Stunde, hier Arbeitsstunden
allbus %>%
  filter(!is.na(dw15)) %>%
  ggplot(aes(x = dw15)) +
  geom_histogram(binwidth = 1)

# Ein Balken je Jahr: Alter
allbus %>%
  filter(!is.na(age)) %>%
  ggplot(aes(x = age)) +
  geom_histogram(binwidth = 1)`;

export const R_AXIS = `# Teil 4 · Mittlere Lebenszufriedenheit im Westen (eastwest 1)
allbus %>%
  filter(eastwest == 1) %>%
  describe(ls01)

# Mittlere Lebenszufriedenheit im Osten (eastwest 2)
allbus %>%
  filter(eastwest == 2) %>%
  describe(ls01)`;

export const hints: Record<'sketch' | 'silhouettes' | 'plan' | 'axis', Hint> = {
  sketch: {
    think: 'Der höchste Balken zeigt die häufigste Antwort, den Modus. Seine Höhe liest du an der y-Achse ab – sie zählt Befragte, keine Prozente.',
    pointer: 'geom_bar() zählt, wie oft jeder Wert vorkommt. Fehlende Werte lässt du vorher mit filter(!is.na(ls01)) weg – sonst meldet R „Removed … rows“, und sie fallen trotzdem aus dem Bild. Genau nachzählen kannst du mit frequency().',
    concept: { id: 'mode', label: 'Modus' },
    workshop: '6.2.1 Häufigkeitsverteilung eines Items, 6.4.1 Eine kategoriale Variable',
    scaffold: `# Die echte Verteilung
allbus %>%
  filter(!is.na(___)) %>%
  ggplot(aes(x = ___)) +
  geom_bar()`,
    solution: R_SKETCH,
  },
  silhouettes: {
    think: 'Zähl die Balken: Wie viele Stufen hat die Frage? Und wo steht der höchste Balken – am Rand, in der Mitte oder auf einer runden Zahl?',
    pointer: 'Im Codebuch siehst du, wie viele Stufen eine Frage hat und was die 1 bedeutet. Metrische Variablen haben viele schmale Balken – dafür ist das Histogramm da.',
    concept: { id: 'discrete_continuous', label: 'Diskret & stetig' },
    workshop: '4.4.2 codebook(), 6.4 Geoms für verschiedene Datentypen',
    scaffold: `# Im Codebuch die Stufen nachsehen
codebook(allbus)

# Kategorien: Balken
allbus %>%
  filter(!is.na(___)) %>%
  ggplot(aes(x = ___)) +
  geom_bar()

# Metrisch: Histogramm
allbus %>%
  filter(!is.na(___)) %>%
  ggplot(aes(x = ___)) +
  geom_histogram(binwidth = 1)`,
    solution: R_SILHOUETTES,
  },
  plan: {
    think: 'Welche Variable bildet die Gruppen, welche Variable wird verglichen? Kategorien gehören auf x oder in die Farbe (fill), metrische Werte auf x (Histogramm) oder y (Boxplot, Punkte).',
    pointer: 'Bevor du zeichnest: to_label() macht aus Codes Wörter für die Beschriftung, filter() mit !is.na() lässt fehlende Werte weg, nrow() zählt, wer im Bild steckt. Die Schritte verbindest du mit %>%, zwischen den Schichten der Grafik steht ein +. Das Muster steht im Werkzeugkasten.',
    concept: { id: 'conversion', label: 'Datentypen umwandeln' },
    workshop: '6.3 Aufbau einer Grafik, 6.4 Geoms für verschiedene Datentypen, 6.7 Beschriftungen',
    scaffold: `# Daten vorbereiten: Wörter statt Codes, fehlende Werte weglassen
bild <- allbus %>%
  to_label(___, ___) %>%
  filter(!is.na(___), !is.na(___))

# n zählen
bild %>%
  nrow()

# Die Grafik
bild %>%
  ggplot(aes(x = ___, ___ = ___)) +
  geom____() +
  labs(caption = "ALLBUS 2023, n = ___")`,
    solution: '',
  },
  axis: {
    think: 'Erst die zwei Mittelwerte, dann das Bild. Wie hoch wäre jeder Balken, wenn die Achse bei 0 anfinge?',
    pointer: 'In eastwest steht 1 für West und 2 für Ost. Behalte jeweils nur eine Gruppe und lass dir mit describe() den Mittelwert (Mean) von ls01 zeigen.',
    concept: { id: 'mean', label: 'Arithmetisches Mittel' },
    workshop: '7.4.2 describe()',
    scaffold: `# Mittlere Lebenszufriedenheit in einer Gruppe
allbus %>%
  filter(eastwest == ___) %>%
  describe(___)`,
    solution: R_AXIS,
  },
};
