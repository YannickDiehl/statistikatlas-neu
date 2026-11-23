import type { Hint } from '../kit/HintLadder';

export const INSTITUTE = 'Institut Wiederfrage';
export const ROLE = 'Panelaufbau im Umfrageinstitut';
export const ROLES = { panel: 'Panelaufbau', qs: 'Qualitätssicherung' } as const;

/** Die vier Fassungen der Einladungsfrage (splt23_3). */
export type VersionId = 'A1' | 'A2' | 'B1' | 'B2';
export type Version = { id: VersionId; code: 1 | 2 | 3 | 4; amount: 5 | 10; repeat: boolean; money: string; placement: string };
export const VERSIONS: Version[] = [
  { id: 'A1', code: 1, amount: 5, repeat: false, money: '5 € bei Teilnahme', placement: 'Geld nur am Schluss der Frage genannt' },
  { id: 'A2', code: 2, amount: 5, repeat: true, money: '5 € bei Teilnahme', placement: 'am Anfang genannt und am Schluss wiederholt' },
  { id: 'B1', code: 3, amount: 10, repeat: false, money: '10 € (5 € fürs Ja, 5 € bei Teilnahme)', placement: 'Geld nur am Schluss der Frage genannt' },
  { id: 'B2', code: 4, amount: 10, repeat: true, money: '10 € (5 € fürs Ja, 5 € bei Teilnahme)', placement: 'am Anfang genannt und am Schluss wiederholt' },
];
export const VERSION_IDS = VERSIONS.map(v => v.id);
export const versionByCode = (code: number) => VERSIONS.find(v => v.code === code) ?? null;
export const versionById = (id: VersionId) => VERSIONS.find(v => v.id === id)!;

/** Die fünf Variablen der Korrelationsmatrix, in der Reihenfolge des Lösungsskripts. */
export const MATRIX_VARS = ['wiederholung', 'betrag', 'papier', 'age', 'zusage'] as const;
export type MatrixVar = typeof MATRIX_VARS[number];
export const MATRIX_LABELS: Record<MatrixVar, string> = { wiederholung: 'wiederholung', betrag: 'betrag', papier: 'papier', age: 'age', zusage: 'zusage' };
export type PairId = 'wiederholung-betrag' | 'wiederholung-papier' | 'wiederholung-age' | 'wiederholung-zusage' | 'betrag-papier' | 'betrag-age'
  | 'betrag-zusage' | 'papier-age' | 'papier-zusage' | 'age-zusage';
export const PAIRS: { id: PairId; a: MatrixVar; b: MatrixVar; i: number; j: number }[] = MATRIX_VARS.flatMap((a, i) =>
  MATRIX_VARS.slice(i + 1).map((b, k) => ({ id: `${a}-${b}` as PairId, a, b, i, j: i + 1 + k })));
export const PAIR_IDS = PAIRS.map(p => p.id);
/** Diese Zellen müssten bei echter Auslosung ≈ 0 sein: Fassungsmerkmale gegen Merkmale, die vor dem Los feststehen, und gegeneinander. */
export const BALANCE_PAIRS: PairId[] = ['wiederholung-betrag', 'wiederholung-papier', 'wiederholung-age', 'betrag-papier', 'betrag-age'];

/** Was eine Zelle der Matrix bedeutet – ohne Zahlen, die kommen aus der Datei. */
export const PAIR_MEANING: Record<PairId, string> = {
  'wiederholung-betrag': 'Beide stammen aus derselben Auslosung. Bei gleich großen Gruppen hingen sie nicht zusammen.',
  'wiederholung-papier': 'Wer die Wiederholung bekam, dürfte nicht häufiger online oder auf Papier antworten.',
  'wiederholung-age': 'Das Los kennt das Alter nicht.',
  'wiederholung-zusage': 'Hier darf etwas stehen: Das ist der Effekt, nach dem du suchst – oder etwas, das wie einer aussieht.',
  'betrag-papier': 'Wer 10 € angeboten bekam, dürfte nicht häufiger online oder auf Papier antworten.',
  'betrag-age': 'Das Los kennt das Alter nicht.',
  'betrag-zusage': 'Hier darf etwas stehen: Das ist die Wirkung des Betrags.',
  'papier-age': 'Papier und Alter stehen beide schon vor dem Los fest. Dass sie zusammenhängen, sagt nichts über das Los.',
  'papier-zusage': 'Ob jemand online oder auf Papier antwortet, ist nicht ausgelost – die Befragten haben es selbst gewählt.',
  'age-zusage': 'Das Alter ist nicht ausgelost.',
};

/* ---------- R ---------- */

export const R_SETUP = `# Pakete laden: tidyverse zuerst, mariposa als Zweites
library(tidyverse)
library(mariposa)

# Daten einlesen: Datei im Fenster auswählen …
allbus <- read_spss(file.choose())
# … oder direkt, wenn die Datei im Arbeitsverzeichnis liegt:
# allbus <- read_spss("ZA8831_v1-3-0.sav")`;

/** Werkzeugkasten: alle Funktionen der Sitzung an neutralen Beispielen (Schulabschluss, Lebenszufriedenheit, politisches Interesse statt der Einladungsfrage). */
export const TOOLBOX_SCRIPT = `${R_SETUP}

# Umkodieren: Aus dem Schulabschluss (educ) wird die 0/1-Variable abitur.
# Mehrere Codes trennst du in rules mit Komma.
allbus <- allbus %>%
  mutate(
    abitur = rec(educ, rules = "1,2,3=0 [ohne Abitur]; 4,5=1 [mit Abitur]; else=NA")
  )

# Der Mittelwert einer 0/1-Variable ist der Anteil der Einsen: Wie viele haben Abitur?
allbus %>%
  describe(abitur)

# t-Test: Unterscheidet sich die Lebenszufriedenheit (ls01) mit und ohne Abitur? Kurzfassung
allbus %>%
  t_test(ls01, group = abitur)

# Derselbe t-Test mit summary(): die ganze Tabelle mit beiden Mittelwerten
allbus %>%
  t_test(ls01, group = abitur) %>%
  summary()

# t-Test ohne group: ein Mittelwert mit 95-%-Konfidenzintervall,
# Beispiel: nur Ostdeutschland (eastwest 2)
allbus %>%
  filter(eastwest == 2) %>%
  t_test(ls01) %>%
  summary()

# ANOVA: Lebenszufriedenheit nach politischem Interesse (pa02a, fünf Stufen)
allbus %>%
  oneway_anova(ls01, group = pa02a) %>%
  summary()

# Danach Tukey: Welche Paare unterscheiden sich? tukey_test() kommt direkt hinter die ANOVA.
allbus %>%
  oneway_anova(ls01, group = pa02a) %>%
  tukey_test() %>%
  summary()

# Korrelationsmatrix: alle Paare aus vier Variablen auf einmal
allbus %>%
  pearson_cor(abitur, ls01, pa02a, dh04)
`;

export const R_S1 = `# Station 1 · Erste Auswertung: online und Papier zusammen
# Codebuch öffnen: nach xr21, splt23_3 und mode suchen
codebook(allbus)

# Zusage als 0/1-Variable, die vier Fassungen zweimal zusammengefasst
allbus <- allbus %>%
  mutate(
    zusage       = rec(xr21, rules = "1=1 [ja]; 2=0 [nein]; else=NA"),
    wiederholung = rec(splt23_3, rules = "1,3=0 [ohne]; 2,4=1 [mit]; else=NA"),
    betrag       = rec(splt23_3, rules = "1,2=5 [5 Euro]; 3,4=10 [10 Euro]; else=NA")
  )

# t-Test Wiederholung. Wer die Einladungsfrage nicht bekam (persönliches Interview),
# hat fehlende Werte – t_test() lässt sie weg.
allbus %>%
  t_test(zusage, group = wiederholung) %>%
  summary()

# t-Test Betrag
allbus %>%
  t_test(zusage, group = betrag) %>%
  summary()`;

export const R_S2 = `# Station 2 · Zufallscheck: Was hängt mit der Fassung zusammen, obwohl das Los es nicht dürfte?
# papier als 0/1-Variable
allbus <- allbus %>%
  mutate(
    papier = rec(mode, rules = "3=0 [online]; 4=1 [Papier]; else=NA")
  )

# Korrelationsmatrix der fünf Variablen
allbus %>%
  pearson_cor(wiederholung, betrag, papier, age, zusage)`;

export const R_S3A = `# Station 3a · Der saubere Vergleich: nur online (mode 3) – so befragt das Institut
# t-Test Wiederholung, nur online
allbus %>%
  filter(mode == 3) %>%
  t_test(zusage, group = wiederholung) %>%
  summary()

# t-Test Betrag, nur online
allbus %>%
  filter(mode == 3) %>%
  t_test(zusage, group = betrag) %>%
  summary()`;

export const R_S3B = `# Station 3b · Vier Fassungen auf einmal: ANOVA, danach Tukey für die sechs Paare
# ANOVA, nur online
allbus %>%
  filter(mode == 3) %>%
  oneway_anova(zusage, group = splt23_3) %>%
  summary()

# Tukey direkt hinter der ANOVA
allbus %>%
  filter(mode == 3) %>%
  oneway_anova(zusage, group = splt23_3) %>%
  tukey_test() %>%
  summary()`;

export const R_WEIGHTED = `# Dieselbe ANOVA mit Gewicht
allbus %>%
  filter(mode == 3) %>%
  oneway_anova(zusage, group = splt23_3, weights = wghtpew)`;

/** Quote einer Fassung mit 95-%-Intervall: t-Test ohne group. */
export const rRelease = (code: number) => `# Station 4 · Freigabe: Quote der gewählten Fassung mit 95-%-Intervall
# (splt23_3: 1 = A1, 2 = A2, 3 = B1, 4 = B2)
allbus %>%
  filter(mode == 3) %>%
  filter(splt23_3 == ${code}) %>%
  t_test(zusage) %>%
  summary()`;

export const rSolution = (code = 1) => [R_SETUP, R_S1, R_S2, R_S3A, R_S3B, R_WEIGHTED, rRelease(code)].join('\n\n') + '\n';

const WORKSHOP = '5 Daten transformieren und Skalen bilden (rec) · 7.6 Mittelwertvergleiche';

export const hints: Record<'s1' | 's2' | 's3a' | 's3b' | 's4', Hint> = {
  s1: {
    think: 'Die Zusagequote ist der Anteil der Ja-Antworten. Welche Variable hat genau diesen Anteil als Mittelwert? Und welche Fassungen gehören zu „ohne“ und „mit“ Wiederholung, welche zu 5 € und 10 €?',
    pointer: 'Mit mutate() und rec() machst du aus xr21 eine 0/1-Variable: 1 = ja bleibt 1, 2 = nein wird 0, alles andere NA. Genauso fasst du splt23_3 zweimal zusammen; mehrere Codes trennst du mit Komma. t_test() mit group vergleicht zwei Gruppen; hängst du summary() mit %>% dahinter, zeigt R beide Mittelwerte – wie im Werkzeugkasten bei abitur.',
    concept: { id: 't_test', label: 't-Test' },
    workshop: WORKSHOP,
    scaffold: `# Zusage als 0/1-Variable, die vier Fassungen zweimal zusammengefasst
allbus <- allbus %>%
  mutate(
    zusage       = rec(xr21, rules = "1=___ [ja]; 2=___ [nein]; else=NA"),
    wiederholung = rec(splt23_3, rules = "___=0 [ohne]; ___=1 [mit]; else=NA"),
    betrag       = rec(splt23_3, rules = "1,2=5 [5 Euro]; ___=10 [10 Euro]; else=NA")
  )

# t-Test Wiederholung
allbus %>%
  t_test(zusage, group = ___) %>%
  summary()

# t-Test Betrag
allbus %>%
  t_test(zusage, group = ___) %>%
  summary()`,
    solution: `${R_SETUP}\n\n${R_S1}`,
  },
  s2: {
    think: 'Das Los weiß nichts über das Alter. Es weiß auch nicht, ob jemand online oder auf Papier antwortet. Welche Zellen der Matrix müssten also nahe 0 liegen?',
    pointer: 'Für papier machst du aus mode eine 0/1-Variable: 3 = online wird 0, 4 = Papier wird 1. pearson_cor() mit fünf Variablen rechnet alle zehn Paare auf einmal – wie im Werkzeugkasten mit vier Variablen.',
    concept: { id: 'correlation_matrix', label: 'Korrelationsmatrix' },
    workshop: '7 Uni- und Bivariate Analyse (7.5.3 Korrelation)',
    scaffold: `# papier als 0/1-Variable
allbus <- allbus %>%
  mutate(
    papier = rec(mode, rules = "3=___ [online]; 4=___ [Papier]; else=NA")
  )

# Korrelationsmatrix der fünf Variablen
allbus %>%
  pearson_cor(wiederholung, betrag, ___, age, zusage)`,
    solution: `${R_SETUP}\n\n${R_S1}\n\n${R_S2}`,
  },
  s3a: {
    think: 'Das Institut befragt nur online. Welcher Code steht in mode für online?',
    pointer: 'Mit filter() behältst du nur die Online-Befragten (im Codebuch bei mode nachsehen). Setz filter() in die Kette zwischen allbus und t_test() – wie im Werkzeugkasten bei Ostdeutschland. Dann rechnest du dieselben zwei t-Tests wie in Station 1.',
    concept: { id: 'confounding', label: 'Confounding' },
    workshop: WORKSHOP,
    scaffold: `# t-Test Wiederholung, nur online
allbus %>%
  filter(mode == ___) %>%
  t_test(zusage, group = wiederholung) %>%
  summary()

# t-Test Betrag, nur online
allbus %>%
  filter(mode == ___) %>%
  t_test(zusage, group = betrag) %>%
  summary()`,
    solution: `${R_SETUP}\n\n${R_S1}\n\n${R_S3A}`,
  },
  s3b: {
    think: 'Vier Fassungen auf einmal: Ein t-Test vergleicht nur zwei Gruppen. Welches Werkzeug vergleicht vier Mittelwerte – und welches sagt danach, welche Paare sich unterscheiden?',
    pointer: 'oneway_anova() mit group = splt23_3 prüft, ob sich irgendeine Fassung unterscheidet. Häng tukey_test() mit %>% direkt hinter die ANOVA – wie im Werkzeugkasten. Tukey vergleicht alle sechs Paare und rechnet dabei ein, dass es sechs Vergleiche sind.',
    concept: { id: 'oneway_anova', label: 'Einfaktorielle ANOVA' },
    workshop: WORKSHOP,
    scaffold: `# ANOVA, nur online
allbus %>%
  filter(mode == 3) %>%
  oneway_anova(zusage, group = ___) %>%
  summary()

# Tukey direkt hinter der ANOVA: Welche Funktion?
allbus %>%
  filter(mode == 3) %>%
  oneway_anova(zusage, group = ___) %>%
  ___() %>%
  summary()`,
    solution: `${R_SETUP}\n\n${R_S1}\n\n${R_S3A}\n\n${R_S3B}\n\n${R_WEIGHTED}`,
  },
  s4: {
    think: 'Eine Quote ohne Spanne ist ein Versprechen ohne Sicherheitsabstand. Wie breit ist das Intervall für deine Fassung – online?',
    pointer: 'Behalte von den Online-Befragten nur deine Fassung (splt23_3: 1 = A1, 2 = A2, 3 = B1, 4 = B2): ein zweites filter() in der Kette. t_test() ohne group mit summary() dahinter zeigt die Quote (Mean) mit 95-%-Intervall – wie im Werkzeugkasten für Ostdeutschland.',
    concept: { id: 'confidence', label: 'Konfidenzintervall' },
    workshop: '7.6 Mittelwertvergleiche',
    scaffold: '# Quote deiner Fassung mit 95-%-Intervall, nur online\nallbus %>%\n  filter(mode == 3) %>%\n  filter(splt23_3 == ___) %>%\n  t_test(___) %>%\n  summary()',
    solution: rSolution(1),
  },
};

export const TEXTS = {
  zeroOne: 'zusage kennt nur 0 und 1. Normalverteilt ist das nicht. Der t-Test braucht aber keine normalverteilten Einzelwerte, sondern annähernd normalverteilte Mittelwerte. Stell dir vor, man zöge immer neue Stichproben dieser Größe: Die Quoten würden sich fast wie eine Glockenkurve verteilen (Stichprobenverteilung). Bei Hunderten Befragten je Gruppe ist das gegeben. Eine Kreuztabelle mit χ² käme hier zum selben Ergebnis.',
  sign: 'mariposa vergleicht die Gruppen in der Reihenfolge ihrer Codes: zuerst „ohne“ (0), dann „mit“ (1); zuerst 5 Euro, dann 10 Euro (Zeile „Groups compared“). Liegt die zweite Gruppe höher, sind t und die Differenz (Mean Diff.) negativ. Trag t so ein, wie R es zeigt – oder ohne Minus.',
  codebook: 'Im Codebuch steht es in einem Nebensatz: Auf Papier gab es aus Kostengründen nur A1 und B1. Online wurden alle vier Fassungen etwa gleich oft verteilt. Ausgelost ist also nur innerhalb von online und innerhalb von Papier – nicht über beide hinweg.',
  cells: 'Leicht von 0 verschoben, weil die Gruppen ungleich groß sind: Auf Papier fehlen die Fassungen mit Wiederholung. Dann hängen Betrag und Wiederholung rechnerisch ein wenig zusammen, ohne dass das Los versagt hätte.',
  trap: 'Nicht die Wiederholung hat sich verändert, sondern die Vergleichsgruppe.',
  weighted: 'Gewichte sind für Aussagen über die ganze Bevölkerung da. Im Experiment bildet das Los die Gruppen – deshalb rechnen wir ungewichtet. Aber: Wenn eine vertretbare Rechenentscheidung aus „signifikant“ „nicht signifikant“ macht, ist der Befund knapp. Das gehört in die Freigabe.',
  profi: 'Profi-Frage: Der Betrag hängt an der Fragebogenhälfte splt23_1 (A1 und A2 = Split A, B1 und B2 = Split B). Die beiden Hälften hatten auch sonst ein etwas anderes Frageprogramm. Wie sicher ist dann der Satz „10 € bringen …“?',
};

export const PLACEHOLDERS = {
  because: 'Die Punkte kommen nicht (nur) von der Wiederholung, weil …',
  notClaimed: 'Was wir nicht behaupten: …',
  signPanel: 'Ich verspreche der Geschäftsführung …, weil …',
  signQs: 'Ich gebe frei, weil … / Veto, weil …',
};
