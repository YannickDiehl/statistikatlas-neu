import type { MeasureId } from '../kit/stats';

export type Level = 'nominal' | 'ordinal' | 'metrisch';
export type CardId = 'ep01' | 'ep03' | 'ls01' | 'id02' | 'eastwest' | 'educ5' | 'pa01' | 'rp01' | 'konf' | 'gs01' | 'age' | 'pa02a' | 'pt03';
export type Card = {
  id: CardId;
  /** Variable in der Datei. */
  source: string;
  title: string;
  question: string;
  level: Level;
  /** Ebenfalls vertretbares Skalenniveau (quasi-metrische Skalen, Dichotomien). */
  alsoLevel?: Level;
  /** Was ein höherer Code bedeutet – für den Richtungssatz; null bei rein nominalen Karten. */
  high: string | null;
  /** Umkodierung wie in R: rec(source, rules = …) als neue Variable id; TS-Spiegel map; prep sagt in Worten, was zu tun ist (ohne Code). */
  recode?: { rules: string; map: (x: number) => number | null; prep: string };
  joker?: boolean;
};

const konfMap = (x: number) => (x === 1 || x === 2 ? 1 : x === 3 ? 2 : x === 4 || x === 5 ? 3 : x === 6 ? 4 : null);

export const CARDS: Card[] = [
  { id: 'ep01', source: 'ep01', title: 'Wirtschaftslage in Deutschland', question: 'Wie beurteilen Sie ganz allgemein die heutige wirtschaftliche Lage in Deutschland? (1 sehr gut … 5 sehr schlecht)', level: 'ordinal', high: 'die Wirtschaftslage schlechter einschätzt' },
  { id: 'ep03', source: 'ep03', title: 'Eigene wirtschaftliche Lage', question: 'Und Ihre eigene wirtschaftliche Lage heute? (1 sehr gut … 5 sehr schlecht)', level: 'ordinal', high: 'die eigene Lage schlechter einschätzt' },
  { id: 'ls01', source: 'ls01', title: 'Lebenszufriedenheit', question: 'Wie zufrieden sind Sie gegenwärtig, alles in allem, mit Ihrem Leben? (0 ganz unzufrieden … 10 ganz zufrieden)', level: 'metrisch', alsoLevel: 'ordinal', high: 'zufriedener mit dem eigenen Leben ist' },
  { id: 'id02', source: 'id02', title: 'Schicht', question: 'Welcher Schicht rechnen Sie sich selbst eher zu? (1 Unterschicht … 5 Oberschicht)', level: 'ordinal', high: 'sich einer höheren Schicht zurechnet' },
  { id: 'eastwest', source: 'eastwest', title: 'Wohnort West oder Ost', question: 'Erhebungsgebiet: alte (1) oder neue (2) Bundesländer', level: 'nominal', alsoLevel: 'ordinal', high: 'im Osten wohnt' },
  { id: 'educ5', source: 'educ', title: 'Schulabschluss', question: 'Allgemeiner Schulabschluss (1 ohne … 5 Hochschulreife; „anderer Abschluss“ und „noch Schüler“ fallen heraus)', level: 'ordinal', high: 'einen höheren Schulabschluss hat',
    recode: { rules: '1:5=copy; else=NA', map: x => (x >= 1 && x <= 5 ? x : null),
      prep: 'educ hat sieben Codes. Die Codes 1 bis 5 bilden eine Reihenfolge; 6 „anderer Abschluss“ und 7 „noch Schüler“ passen nicht hinein. Bilde mit rec() die neue Variable educ5: 1 bis 5 bleiben, alles andere wird NA.' } },
  { id: 'pa01', source: 'pa01', title: 'Links-rechts-Selbsteinstufung', question: 'Wo würden Sie sich selbst auf einer Skala von 1 (links) bis 10 (rechts) einstufen?', level: 'metrisch', alsoLevel: 'ordinal', high: 'sich weiter rechts einstuft' },
  { id: 'rp01', source: 'rp01', title: 'Kirchgang', question: 'Wie oft gehen Sie in die Kirche? (1 über einmal pro Woche … 6 nie)', level: 'ordinal', high: 'seltener in die Kirche geht' },
  { id: 'konf', source: 'rd01', title: 'Konfession', question: 'Welcher Religionsgemeinschaft gehören Sie an? (evangelisch, katholisch, andere, keine)', level: 'nominal', high: null,
    recode: { rules: '1:2=1 [evangelisch]; 3=2 [katholisch]; 4:5=3 [andere]; 6=4 [keine]; else=NA', map: konfMap,
      prep: 'rd01 hat sechs Codes. Fasse sie mit rec() zu vier Gruppen zusammen und nenne die neue Variable konf: evangelisch (1 und 2), katholisch (3), andere (4 und 5), keine (6).' } },
  { id: 'gs01', source: 'gs01', title: 'Wohnort: Stadt oder Land', question: 'Wie würden Sie Ihren Wohnort beschreiben? (1 Großstadt … 5 Einzelhaus auf dem Land)', level: 'ordinal', high: 'ländlicher wohnt' },
  { id: 'age', source: 'age', title: 'Alter', question: 'Alter in Jahren', level: 'metrisch', high: 'älter ist' },
  { id: 'pa02a', source: 'pa02a', title: 'Politisches Interesse', question: 'Wie stark interessieren Sie sich für Politik? (1 sehr stark … 5 überhaupt nicht)', level: 'ordinal', high: 'sich weniger für Politik interessiert' },
  { id: 'pt03', source: 'pt03', title: 'Vertrauen in den Bundestag', question: 'Wie viel Vertrauen haben Sie in den Bundestag? (1 gar kein … 7 großes Vertrauen)', level: 'ordinal', high: 'dem Bundestag mehr vertraut', joker: true },
];
export const CARD_IDS = CARDS.map(c => c.id) as CardId[];
export const cardById = Object.fromEntries(CARDS.map(c => [c.id, c])) as Record<CardId, Card>;

/** Konfession in zwei weiteren, ebenso willkürlichen Reihenfolgen (für Gamma). */
export const KONF_ORDERS: { label: string; rules: string; map: (x: number) => number | null }[] = [
  { label: 'evangelisch, katholisch, andere, keine', rules: '1:2=1; 3=2; 4:5=3; 6=4; else=NA', map: konfMap },
  { label: 'keine, evangelisch, katholisch, andere', rules: '6=1; 1:2=2; 3=3; 4:5=4; else=NA', map: x => (x === 6 ? 1 : x === 1 || x === 2 ? 2 : x === 3 ? 3 : x === 4 || x === 5 ? 4 : null) },
  { label: 'katholisch, keine, andere, evangelisch', rules: '3=1; 6=2; 4:5=3; 1:2=4; else=NA', map: x => (x === 3 ? 1 : x === 6 ? 2 : x === 4 || x === 5 ? 3 : x === 1 || x === 2 ? 4 : null) },
];

export const LEVEL_MEASURES: Record<Level, MeasureId[]> = {
  nominal: ['V', 'phi'],
  ordinal: ['gamma', 'tau', 'rho'],
  metrisch: ['r', 'rho'],
};

/** Entscheidungspfad: Karten für die drei Skalenniveaus – mit einem kleinen Beispiel, wie die Ausprägungen aussehen. */
export const LEVEL_INFO: Record<Level, { line: string; example: string }> = {
  nominal: { line: 'Kategorien ohne Reihenfolge', example: 'evangelisch · katholisch · keine' },
  ordinal: { line: 'Geordnete Stufen, Abstände unklar', example: 'sehr gut < gut < … < sehr schlecht' },
  metrisch: { line: 'Zahlen mit gleichen Abständen', example: '18, 19, 20 … Jahre' },
};

/** Entscheidungspfad: ein Satz je Zusammenhangsmaß und der Grund, warum es zu einem Skalenniveau nicht passt. */
export const MEASURE_INFO: Record<MeasureId, { line: string; misfit: Partial<Record<Level, string>> }> = {
  V: { line: 'Stärke aus der Kreuztabelle, 0 bis 1, ohne Richtung.',
    misfit: { ordinal: 'Nutzt die Reihenfolge der Stufen nicht.', metrisch: 'Nutzt weder Reihenfolge noch Abstände.' } },
  phi: { line: 'Wie Cramér-V, gedacht für Vierfeldertafeln (2 × 2).',
    misfit: { ordinal: 'Nur für zwei mal zwei Kategorien, ohne Reihenfolge.', metrisch: 'Nur für zwei mal zwei Kategorien, ohne Reihenfolge.' } },
  gamma: { line: 'Vergleicht Paare von Befragten: gleich- oder gegenläufig. Paare mit Gleichstand (Bindungen) fallen weg.',
    misfit: { nominal: 'Braucht eine Reihenfolge – Kategorien haben keine.', metrisch: 'Nutzt nur die Reihenfolge, nicht die Abstände.' } },
  tau: { line: 'Wie Gamma, zählt Paare mit Gleichstand aber mit – meist kleiner.',
    misfit: { nominal: 'Braucht eine Reihenfolge – Kategorien haben keine.', metrisch: 'Nutzt nur die Reihenfolge, nicht die Abstände.' } },
  rho: { line: 'Pearson-r auf Rangplätzen statt auf den Werten.',
    misfit: { nominal: 'Braucht Rangplätze – Kategorien haben keine.' } },
  r: { line: 'Nutzt die Abstände selbst; misst lineare Zusammenhänge.',
    misfit: { nominal: 'Braucht Zahlen mit gleichen Abständen.', ordinal: 'Setzt gleiche Abstände zwischen den Stufen voraus.' } },
};

/** Urteil über den Zusammenhang in den Teilen (gespeichert unter dem alten Schlüssel stamp). */
export const STAMPS = ['trägt', 'schrumpft', 'nur in einem Landesteil', 'kehrt sich um'] as const;
export type Stamp = typeof STAMPS[number];

/** Die Wirtschaftslage als Drittvariable für die Karte „West oder Ost“. */
export const LAGE = { rules: '1:2=1 [gut]; 3=2 [teils/teils]; 4:5=3 [schlecht]; else=NA', groups: ['gut', 'teils/teils', 'schlecht'] };

export const ROLE = {
  office: 'Beratungsbüro „Querschnitt“',
  fund: 'Förderfonds „Gemeinsinn“',
};

export const R_SETUP = `# Pakete laden: tidyverse zuerst, mariposa als Zweites
library(tidyverse)
library(mariposa)

# Daten einlesen: Datei im Fenster auswählen …
allbus <- read_spss(file.choose())
# … oder direkt, wenn die Datei im Arbeitsverzeichnis liegt:
# allbus <- read_spss("ZA8831_v1-3-0.sav")`;

/** Werkzeugkasten: alle Funktionen der Sitzung an neutralen Beispielen (Gesundheit, Geschlecht, Einkommen, Mitgliedschaften, Arbeitsstunden – keine Variable der Aufgaben). */
export const TOOLBOX_SCRIPT = `${R_SETUP}

# Gewichtet rechnen, Beispiel Gesundheit: erst ohne Gewicht …
allbus %>%
  frequency(hs01)

# … dann mit weights = wghtpew in den Klammern
allbus %>%
  frequency(hs01, weights = wghtpew)

# Umpolen, damit ein höherer Code „gesünder“ heißt (kennst du aus Sitzung 5)
allbus <- allbus %>%
  mutate(
    gesundheit = rec(hs01, rules = "rev")
  )

# Nominal: Cramér-V, Beispiel Gesundheit und Geschlecht
allbus %>%
  cramers_v(gesundheit, sex, weights = wghtpew)

# Je zwei Ausprägungen: Phi, Beispiel Gewerkschafts- und Parteimitglied
allbus %>%
  phi(sm01, sm03, weights = wghtpew)

# Geordnete Stufen: Gamma, Beispiel Gesundheit und Einkommensgruppe
allbus %>%
  goodman_gamma(gesundheit, incc, weights = wghtpew)

# Geordnete Stufen: Tau-b, dasselbe Beispiel
allbus %>%
  kendall_tau(gesundheit, incc, weights = wghtpew)

# Geordnete Stufen: Spearman-Rho, dasselbe Beispiel
allbus %>%
  spearman_rho(gesundheit, incc)

# Metrisch: Pearson-r, Beispiel Arbeitsstunden und Personen im Haushalt
allbus %>%
  pearson_cor(dw15, dh04, weights = wghtpew)

# Dasselbe Maß in einer Teilmenge, Beispiel: nur Frauen (sex 2)
allbus %>%
  filter(sex == 2) %>%
  goodman_gamma(gesundheit, incc)
`;

/** Hilfe in Schritt 3 (Maß, gewichtet) je Skalenniveau. */
export const hintTexts: Record<Level, { think: string; pointer: string; concept: { id: string; label: string } }> = {
  nominal: {
    think: 'Kategorien ohne Reihenfolge: Welches Maß braucht keine Rangfolge? Und wie zählen Ost und West im richtigen Verhältnis?',
    pointer: 'cramers_v() misst die Stärke aus der Kreuztabelle. Mit weights = wghtpew in den Klammern rechnest du für Deutschland. Vorher polst du ps03 mit mutate() und rec() um – wie im Werkzeugkasten bei der Gesundheit.',
    concept: { id: 'cramers_v', label: 'Cramér-V' },
  },
  ordinal: {
    think: 'Geordnete Stufen ohne gleiche Abstände: Welche Maße nutzen nur die Reihenfolge? Und wie zählen Ost und West im richtigen Verhältnis?',
    pointer: 'goodman_gamma(), kendall_tau() und spearman_rho() nutzen die Reihenfolge. Mit weights = wghtpew in den Klammern rechnest du für Deutschland. Vorher polst du ps03 mit mutate() und rec() um – wie im Werkzeugkasten bei der Gesundheit.',
    concept: { id: 'kendall_tau', label: 'Kendall Tau-b' },
  },
  metrisch: {
    think: 'Viele Stufen mit gleichen Abständen: Welches Maß nutzt die Abstände selbst? Und wie zählen Ost und West im richtigen Verhältnis?',
    pointer: 'pearson_cor() nutzt die Abstände. Mit weights = wghtpew in den Klammern rechnest du für Deutschland; spearman_rho() nutzt Gewichte nur zur Auswahl der Befragten. Vorher polst du ps03 mit mutate() und rec() um – wie im Werkzeugkasten bei der Gesundheit.',
    concept: { id: 'pearson', label: 'Pearson-Korrelation' },
  },
};

/** Hilfe in Schritt 4: West und Ost getrennt bzw. innerhalb gleicher Wirtschaftslage. */
export const splitHints = {
  regions: {
    think: 'Du willst wissen, ob der Zusammenhang in beiden Landesteilen gilt. Dafür rechnest du dasselbe Maß zweimal: einmal nur mit Befragten aus dem Westen, einmal nur mit Befragten aus dem Osten.',
    pointer: 'In eastwest steht 1 für West und 2 für Ost. filter() behält nur die Befragten eines Landesteils – wie im Werkzeugkasten bei den Frauen. Dahinter hängst du dein Maß mit %>% direkt an.',
    concept: { id: 'confounding', label: 'Confounding' },
  },
  economy: {
    think: 'Im Osten wird die Wirtschaftslage etwas schlechter eingeschätzt. Vergleiche West und Ost darum nur unter Befragten, die die Wirtschaftslage gleich einschätzen.',
    pointer: 'Fasse ep01 mit mutate() und rec() in drei Gruppen zusammen (gut, teils/teils, schlecht) und nenne die neue Variable lage. filter() behält je Gruppe nur diese Befragten. Dahinter hängst du mit %>% goodman_gamma() für zufriedenheit und eastwest an.',
    concept: { id: 'confounding', label: 'Confounding' },
  },
};

/** Hilfe in Schritt 6: zweites Maß und ohne Gewicht. */
export const checkHint = {
  think: 'Welche Maße passen außerdem zu deinem Skalenniveau? Und was musst du weglassen, damit R ohne Gewicht rechnet?',
  pointer: 'Die grün markierten Karten in Schritt 2 passen zu deinem Skalenniveau. Ohne Gewicht rechnest du, wenn du weights = wghtpew einfach weglässt.',
  concept: { id: 'weights', label: 'Gewichte' },
};
export const WORKSHOP = '7 Uni- und Bivariate Analyse (Gewichtung, Zusammenhangsmaße)';
