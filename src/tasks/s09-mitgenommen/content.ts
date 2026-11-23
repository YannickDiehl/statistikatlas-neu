/** dg03: Jugend in Ost oder West × Interview in Ost oder West (Codes wie im ALLBUS). */
export type GroupId = 1 | 2 | 3 | 4;
export const GROUP_IDS: GroupId[] = [1, 2, 3, 4];
export type Group = { id: GroupId; short: string; label: string; dummy: string };
export const GROUPS: Record<GroupId, Group> = {
  1: { id: 1, short: 'Ost-Bleibende', label: 'im Osten aufgewachsen, lebt im Osten', dummy: 'dg03_1' },
  2: { id: 2, short: 'Ost→West', label: 'im Osten aufgewachsen, lebt im Westen', dummy: 'dg03_2' },
  3: { id: 3, short: 'West→Ost', label: 'im Westen aufgewachsen, lebt im Osten', dummy: 'dg03_3' },
  4: { id: 4, short: 'West-Bleibende', label: 'im Westen aufgewachsen, lebt im Westen', dummy: 'dg03_4' },
};
export const MOVERS: GroupId[] = [2, 3];

/** Was die beiden Lager für die vier Gruppen erwarten (höher = zufriedener). */
export const TEMPLATE: Record<GroupId, { praegung: string; ort: string }> = {
  1: { praegung: 'unzufriedener', ort: 'unzufriedener' },
  2: { praegung: 'unzufriedener – wie die Ost-Bleibenden', ort: 'zufriedener – wie die West-Bleibenden' },
  3: { praegung: 'zufriedener – wie die West-Bleibenden', ort: 'unzufriedener – wie die Ost-Bleibenden' },
  4: { praegung: 'zufriedener', ort: 'zufriedener' },
};

/** Der Tipp vor dem Modell: Welches Muster zeigen die Daten? sketch = Lage der vier Gruppen (Reihenfolge wie GROUP_IDS)
 *  zwischen den Ost-Bleibenden (0) und den West-Bleibenden (1). */
export const PATTERNS = ['praegung', 'ort', 'dazwischen'] as const;
export type Pattern = typeof PATTERNS[number];
export const PATTERN_CARDS: Record<Pattern, { title: string; text: string; sketch: [number, number, number, number] }> = {
  praegung: { title: 'Prägung', text: 'Wer im Osten aufwuchs, bleibt so.', sketch: [0, 0, 1, 1] },
  ort: { title: 'Ort', text: 'Es zählt, wo man heute lebt.', sketch: [0, 1, 0, 1] },
  dazwischen: { title: 'Etwas dazwischen', text: 'Die Umgezogenen landen zwischen beiden Lagern.', sketch: [0, 0.5, 0.5, 1] },
};

export type ControlId ='age' | 'frau' | 'abi' | 'di08c' | 'ep03' | 'pt03';
export type Control = {
  id: ControlId;
  title: string;
  source: string;
  /** Umkodierung wie in R (rec(source, rules = …)); ohne: Variable wie sie ist. */
  rules?: string;
  map?: (x: number) => number | null;
  /** Ein Argument für „stand vor dem Umzug fest“ und eines für „kann Folge des Umzugs sein“ – beide werden gezeigt, keine Musterlösung. */
  before: string;
  after: string;
  /** Heute gemessen, kann eine Folge des Umzugs sein (für die Gegenfrage zum Off-Text). */
  consequence: boolean;
};

export const CONTROLS: Control[] = [
  { id: 'age', title: 'Alter', source: 'age', consequence: false,
    before: 'Das Alter steht fest, bevor jemand umzieht.', after: 'Wann jemand umzieht, hängt am Lebensalter – aber verändert ein Umzug das Alter?' },
  { id: 'frau', title: 'Geschlecht (Frau)', source: 'sex', rules: '1=0 [Mann]; 2=1 [Frau]; else=NA', map: x => (x === 1 ? 0 : x === 2 ? 1 : null), consequence: false,
    before: 'Das Geschlecht steht vor dem Umzug fest.', after: 'Frauen und Männer ziehen vielleicht unterschiedlich oft um – macht das das Geschlecht zur Folge des Umzugs?' },
  { id: 'abi', title: 'Abitur', source: 'educ', rules: '1:3=0 [kein Abitur]; 4:5=1 [(Fach-)Abitur]; else=NA', map: x => (x >= 1 && x <= 3 ? 0 : x === 4 || x === 5 ? 1 : null), consequence: false,
    before: 'Den Schulabschluss macht man meist in der Jugend – dort, wo man aufgewachsen ist.', after: 'Manche holen einen Abschluss später nach, auch nach einem Umzug.' },
  { id: 'di08c', title: 'Einkommen heute', source: 'di08c', consequence: true,
    before: 'Wer mehr verdient, kann leichter umziehen – das Einkommen könnte schon vorher eine Rolle gespielt haben.', after: 'Das Einkommen wird heute gemessen; wer für eine Stelle umzieht, verdient danach oft anders.' },
  { id: 'ep03', title: 'Eigene wirtschaftliche Lage', source: 'ep03', consequence: true,
    before: 'Wer wirtschaftlich gut dasteht, zieht vielleicht eher um.', after: 'Die eigene Lage wird heute eingeschätzt, nach dem Umzug – der Umzug kann sie verändert haben.' },
  { id: 'pt03', title: 'Vertrauen in den Bundestag', source: 'pt03', consequence: true,
    before: 'Vertrauen in Institutionen bringt man vielleicht aus der Jugend mit.', after: 'Vertrauen wird heute gemessen, kann sich am neuen Ort ändern und misst fast dasselbe wie die Zufriedenheit.' },
];
export const CONTROL_IDS = CONTROLS.map(c => c.id);
export const controlById = Object.fromEntries(CONTROLS.map(c => [c.id, c])) as Record<ControlId, Control>;
/** Die Kontrollen der Lösung: nur, was vor dem Umzug feststand. */
export const COMMON_CAUSES: ControlId[] = ['age', 'frau', 'abi'];

export const SORTS = ['vorher', 'folge'] as const;
export type Sort = typeof SORTS[number];
export const SORT_LABEL: Record<Sort, string> = { vorher: 'stand vor dem Umzug fest', folge: 'kann Folge des Umzugs sein' };

export const ROLE = {
  desk: 'Doku-Redaktion „Zweiufer“',
  editor: 'Mara Lindqvist',
  film: 'Mitgenommen',
};

/** Höchstens so viele Wörter hat der Off-Text-Satz. */
export const MAX_WORDS = 30;
/** Wackeltest: ohne so viele Befragte, die einen Koeffizienten am stärksten nach oben bzw. unten ziehen. */
export const WOBBLE_K = 5;

export const WORKSHOP = '9 Erklärungsmodelle (9.3 Dummy-Codierung, 9.4 Multiple lineare Regression, 9.5 VIF)';

/* ---------- R: Werkzeugkasten ---------- */

export const R_LOAD = `library(tidyverse)
library(mariposa)

allbus <- read_spss(file.choose())
# oder direkt, wenn die Datei im Arbeitsverzeichnis liegt:
# allbus <- read_spss("ZA8831_v1-3-0.sav")`;

/** Werkzeugkasten: alle Funktionen der Sitzung an neutralen Beispielen
 *  (Lebenszufriedenheit ls01, Erwerbstätigkeit work, Gesundheit hs01 statt Demokratiezufriedenheit, dg03 und den Kontrollen). */
export const TOOLBOX_SCRIPT = `${R_LOAD}

# Im Codebuch mit Strg/Cmd + F nach work und hs01 suchen
codebook(allbus)

# Wie viele Befragte in jeder Gruppe? Beispiel: Erwerbstätigkeit
allbus %>%
  frequency(work)

# Neue Variablen mit rec() in mutate(): gesund umgepolt (höher = gesünder),
# vollzeit und gut zu 0/1 zusammengefasst. Dann die Dummies:
# eine 0/1-Variable je Ausprägung (work_1 bis work_4)
allbus <- allbus %>%
  mutate(
    gesund   = rec(hs01, rules = "rev"),
    vollzeit = rec(work, rules = "1=1 [Vollzeit]; 2:4=0 [nicht Vollzeit]; else=NA"),
    gut      = rec(hs01, rules = "1:2=1 [gut]; 3:5=0 [nicht gut]; else=NA")
  ) %>%
  to_dummy(work)

# Kreuztabelle mit Zeilenprozenten, gewichtet: Wie viel Prozent jeder Gruppe sind gut gesund?
allbus %>%
  crosstab(work, gut, percentages = "row", weights = wghtpew)

# Drei der vier Dummies ins Modell: work_4 (nicht erwerbstätig) ist die Referenzgruppe
modell <- allbus %>%
  linear_regression(ls01 ~ work_1 + work_2 + work_3, weights = wghtpew)

modell %>%
  summary()

# Eine Kontrolle mit + dazunehmen
modell_k <- allbus %>%
  linear_regression(ls01 ~ work_1 + work_2 + work_3 + gesund, weights = wghtpew)

modell_k %>%
  summary()

# Interaktion mit *: beide Einzeleffekte plus die Zeile vollzeit:gut
modell_i <- allbus %>%
  linear_regression(ls01 ~ vollzeit * gut, weights = wghtpew)

modell_i %>%
  summary()
`;

export const hints = {
  movers: {
    think: 'dg03 verbindet zwei Fragen: Wo bist du aufgewachsen, und wo lebst du heute? Welches Werkzeug zählt, wie oft jeder Code vorkommt?',
    pointer: 'Im Codebuch steht bei dg03, welcher Code welche Gruppe ist: O.JUGEND-W.INT. heißt „Jugend im Osten, Interview im Westen“. frequency() zählt aus – die Anzahl steht in Spalte N.',
    concept: { id: 'frequency', label: 'Häufigkeiten' },
    scaffold: '# Im Codebuch nach dg03 suchen\ncodebook(allbus)\n\n# Die Gruppen auszählen\nallbus %>%\n  frequency(___)',
  },
  model: {
    think: 'Vier Gruppen: Wie viele 0/1-Variablen brauchst du, damit jede Gruppe erkennbar ist? Woran erkennt man die Gruppe, bei der alle null sind?',
    pointer: 'to_dummy() legt für jede der vier Gruppen eine 0/1-Variable an (dg03_1 bis dg03_4). Ins Modell kommen drei – die weggelassene Gruppe ist die Referenzgruppe. Nie alle vier zugleich: Das ist die Dummyfalle. Vorher polst du ps03 um, wie im Werkzeugkasten bei hs01.',
    concept: { id: 'dummy', label: 'Dummyvariablen' },
  },
  controls: {
    think: 'Was stand fest, bevor jemand umzog? Nur solche Variablen können gemeinsame Ursache von Umzug und Zufriedenheit sein.',
    pointer: 'Im Codebuch: educ 4 und 5 sind Fachhochschulreife und Abitur, sex 2 heißt Frau. crosstab() zeigt mit Zeilenprozenten und Gewicht, wer umzieht. Kontrollen nimmst du mit + ins Modell auf – wie im Werkzeugkasten gesund.',
    concept: { id: 'confounding', label: 'Confounding · gemeinsame Ursachen' },
  },
  counter: {
    think: 'Dasselbe Modell, nur eine andere abhängige Variable: Was steht links vom ~?',
    pointer: 'Die drei Dummies bleiben dieselben wie bei deiner Referenzgruppe; links steht pt03 statt der umgepolten Zufriedenheit. pt03 wird nicht umgepolt (höher = mehr Vertrauen).',
    concept: { id: 'dummy', label: 'Dummyvariablen' },
  },
  interaction: {
    think: 'Zwei 0/1-Variablen: im Osten aufgewachsen (ostjugend) und im Osten wohnend (ost). Die Ost-Bleibenden haben beide. Ist ihr Abstand mehr als die Summe der beiden einzelnen?',
    pointer: 'Im Codebuch: eastwest 2 heißt Osten; dg03 1 und 2 heißen Jugend im Osten. Ein * zwischen zwei Variablen schreibt R als beide Einzeleffekte plus ihre Interaktion – wie im Werkzeugkasten vollzeit * gut. Den Interaktionskoeffizienten findest du in der Zeile mit dem Doppelpunkt.',
    concept: { id: 'interaction', label: 'Interaktion' },
  },
};

/* ---------- Einstieg: Referenzgruppe, Kontrolle und Interaktion ausprobieren ----------
 * Neutrale Variablen, keine aus dem Film: Lebenszufriedenheit (ls01, 0–10) nach Schicht (id02) oder Altersgruppe (age),
 * Gesundheit (hs01) als Kontrolle bzw. Interaktion. Gruppen wie rec(…) + to_dummy(…) in R (geprüft in allbus.local.test.ts). */

export type BuilderBy = 'schicht' | 'alter';
export const BUILDER_BYS: BuilderBy[] = ['schicht', 'alter'];
export type BuilderCode = 1 | 2 | 3;
export const BUILDER_CODES: BuilderCode[] = [1, 2, 3];
export type HealthCode = 1 | 2;
export const HEALTH_CODES: HealthCode[] = [1, 2];
/** ohne Gesundheit, Gesundheit mit + (Kontrolle) oder mit * (Interaktion). */
export type BuilderHealth = 'ohne' | 'plus' | 'mal';
export const BUILDER_HEALTHS: BuilderHealth[] = ['ohne', 'plus', 'mal'];
export const BUILDER_HEALTH_LABEL: Record<BuilderHealth, string> = { ohne: 'nein', plus: 'ja, als Kontrolle (+)', mal: 'ja, mit Interaktion (*)' };

export type BuilderVar = {
  title: string;
  source: string;
  /** rec()-Regeln wie in R; to_dummy() macht daraus name_1 bis name_3. */
  rules: string;
  map: (x: number) => BuilderCode | null;
  short: [string, string, string];
  long: [string, string, string];
};
export const BUILDER_VARS: Record<BuilderBy, BuilderVar> = {
  schicht: {
    title: 'Schicht', source: 'id02', rules: '1:2=1 [untere]; 3=2 [mittlere]; 4:5=3 [obere]; else=NA',
    map: x => (x === 1 || x === 2 ? 1 : x === 3 ? 2 : x === 4 || x === 5 ? 3 : null),
    short: ['untere', 'mittlere', 'obere'],
    long: ['untere Schicht (Unter- oder Arbeiterschicht)', 'Mittelschicht', 'obere Schicht (obere Mittel- oder Oberschicht)'],
  },
  alter: {
    title: 'Altersgruppe', source: 'age', rules: '18:39=1 [18-39]; 40:59=2 [40-59]; 60:99=3 [60+]; else=NA',
    map: x => (x >= 18 && x <= 39 ? 1 : x >= 40 && x <= 59 ? 2 : x >= 60 && x <= 99 ? 3 : null),
    short: ['18–39', '40–59', '60+'],
    long: ['18 bis 39 Jahre', '40 bis 59 Jahre', '60 Jahre und älter'],
  },
};
export const BUILDER_HEALTH_VAR = {
  title: 'Gesundheit', source: 'hs01', name: 'gesundheit', rules: '1:2=1 [gut]; 3:5=2 [nicht gut]; else=NA',
  map: (x: number): HealthCode | null => (x === 1 || x === 2 ? 1 : x >= 3 && x <= 5 ? 2 : null),
  short: ['gut', 'nicht gut'] as [string, string],
  long: ['Gesundheit sehr gut oder gut', 'Gesundheit zufriedenstellend, weniger gut oder schlecht'] as [string, string],
};
