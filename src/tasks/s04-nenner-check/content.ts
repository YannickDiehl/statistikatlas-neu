import type { Hint } from '../kit/HintLadder';

export type ItemId = 'pe01' | 'pa35' | 'pe05';
export type Category = { code: number; label: string };
export type Item = {
  id: ItemId;
  title: string;
  statement: string;
  categories: Category[];
  /** Zustimmung heißt hier Vertrauen: vor dem Zusammenfassen umpolen. */
  reversed: boolean;
  /** Misstrauen eng bzw. weit gefasst, in den Originalcodes. */
  strict: number[];
  wide: number[];
};

const agree4: Category[] = [
  { code: 1, label: 'stimme voll zu' }, { code: 2, label: 'stimme eher zu' },
  { code: 3, label: 'stimme eher nicht zu' }, { code: 4, label: 'stimme gar nicht zu' },
];

export const ITEM_IDS = ['pe01', 'pa35', 'pe05'] as const;
export const ITEMS: Record<ItemId, Item> = {
  pe01: {
    id: 'pe01', title: 'Politiker kümmern sich nicht um Leute wie mich',
    statement: '„Die Politiker kümmern sich nicht viel darum, was Leute wie ich denken.“',
    categories: agree4, reversed: false, strict: [1], wide: [1, 2],
  },
  pa35: {
    id: 'pa35', title: 'Politiker vertreten nur die Reichen',
    statement: '„Politiker vertreten nur die Interessen der Reichen.“',
    categories: [
      { code: 1, label: 'stimme voll zu' }, { code: 2, label: 'stimme eher zu' }, { code: 3, label: 'teils/teils' },
      { code: 4, label: 'lehne eher ab' }, { code: 5, label: 'lehne ganz ab' },
    ],
    reversed: false, strict: [1], wide: [1, 2],
  },
  pe05: {
    id: 'pe05', title: 'Politiker vertreten die Interessen der Bevölkerung',
    statement: '„Die Politiker vertreten die Interessen der Bevölkerung.“',
    categories: agree4, reversed: true, strict: [4], wide: [3, 4],
  },
};

/** Fehlende Werte der Wahlabsicht, die man als Nichtwahl zählen kann. */
export const NONVOTE_EXTRAS = [
  { code: -8, short: 'wn', label: '„weiß nicht“' },
  { code: -7, short: 'vw', label: '„verweigert“' },
  { code: -9, short: 'ka', label: '„keine Angabe“' },
] as const;
export const NOT_ELIGIBLE = -50;

export const PRESS_RELEASE = '„Wer Politikern misstraut, geht gar nicht mehr wählen. Die Zahlen sind eindeutig: 87 Prozent der Nichtwähler sagen, dass sich Politiker nicht darum kümmern, was Leute wie sie denken. (Quelle: ALLBUS 2023)“';
export const CLAIMED = 87;

export const R_SETUP = `# Pakete laden
library(tidyverse)
library(mariposa)

# Daten einlesen
allbus <- read_spss(file.choose())

# oder direkt, wenn die Datei im Arbeitsverzeichnis liegt:
# allbus <- read_spss("ZA8831_v1-3-0.sav")`;

/** Werkzeugkasten: alle Funktionen der Sitzung an neutralen Beispielen (Schulabschluss, Gesundheit, Wohngebiet, Wirtschaftslage, politisches Interesse). */
export const TOOLBOX_SCRIPT = `${R_SETUP}

# Umkodieren: Codes zu neuen Gruppen zusammenfassen, Beispiel Schulabschluss (educ)
# 4 bis 5 = Hochschulreife (1), 1 bis 3 = keine (0); alles andere wird NA
allbus <- allbus %>%
  mutate(
    hochschulreife = rec(educ, rules = "4:5=1 [Hochschulreife]; 1:3=0 [keine Hochschulreife]; else=NA")
  )

# Prüfen: Stimmen die neuen Gruppen?
allbus %>%
  frequency(hochschulreife)

# Umpolen: die Skala umdrehen, Beispiel Gesundheit (hs01)
# vorher 1 = sehr gut … 5 = schlecht, danach 1 = schlecht … 5 = sehr gut
allbus <- allbus %>%
  mutate(
    gesundheit = rec(hs01, rules = "rev")
  )

# Prüfen: Ist die Skala umgedreht?
allbus %>%
  frequency(gesundheit)

# Kreuztabelle: Zeilen = Wohngebiet (eastwest), Spalten = Hochschulreife
# Zeilenprozente: jede Zeile = 100 %
allbus %>%
  crosstab(eastwest, hochschulreife, percentages = "row")

# Spaltenprozente: jede Spalte = 100 %
allbus %>%
  crosstab(eastwest, hochschulreife, percentages = "col")

# Alle drei: Zeilen-, Spalten- und Gesamtprozente
allbus %>%
  crosstab(eastwest, hochschulreife, percentages = "all")

# Fehlende Werte als Codes zurückholen, Beispiel Wirtschaftslage (ep01): -8 = „weiß nicht“
allbus <- allbus %>%
  untag_na(ep01) %>%
  mutate(
    wirtschaftslage = rec(ep01, rules = "1:2=1 [gut]; 3:5=0 [nicht gut]; -8=2 [weiß nicht]; else=NA")
  )

# Prüfen: Steht „weiß nicht“ jetzt als eigene Gruppe da?
allbus %>%
  frequency(wirtschaftslage)

# Rechnen in mutate(), Beispiel Alter in Jahrzehnten
allbus <- allbus %>%
  mutate(
    alter_jahrzehnte = age / 10
  )

# Kennzahlen der neuen Variable
allbus %>%
  describe(alter_jahrzehnte)

# Für den Zusatz · Rechnen innerhalb einer Person:
# Wie viele von zwei Merkmalen treffen zu? Hochschulreife und starkes Interesse (pa02a)
allbus <- allbus %>%
  mutate(
    interesse = rec(pa02a, rules = "1:2=1 [stark]; 3:5=0 [nicht stark]; else=NA"),
    zahl      = row_sums(pick(hochschulreife, interesse), min_valid = 2)
  )

# Wie viele Befragte haben 0, 1 oder 2 der Merkmale?
allbus %>%
  frequency(zahl)
`;

export const R_P1 = `# Prüfauftrag 1 · Zahl nachbauen: zwei Dummyvariablen (nur 0 und 1)
allbus <- allbus %>%
  mutate(
    misstrauen = rec(pe01, rules = "1:2=1 [misstraut]; 3:4=0 [misstraut nicht]; else=NA"),
    nichtwahl  = rec(pv01, rules = "91=1 [würde nicht wählen]; 1:90=0 [würde wählen]; else=NA")
  )

# Prüfen: Stimmen die neuen Gruppen?
allbus %>%
  frequency(misstrauen)

allbus %>%
  frequency(nichtwahl)

# Spaltenprozente: Jede Spalte ist 100 % – die 87 % beziehen sich auf die Nichtwählenden
allbus %>%
  crosstab(misstrauen, nichtwahl, percentages = "col")`;

export const R_P2 = `# Prüfauftrag 2 · Eine Zelle, drei Prozentbasen
# row % = Zeilenprozente, col % = Spaltenprozente, total % = Gesamtprozente
allbus %>%
  crosstab(misstrauen, nichtwahl, percentages = "all")`;

export const R_P3_EXAMPLE = `# Prüfauftrag 3 · Beispiel-Lesart: Gegenprobe mit pe05, „weiß nicht“ zählt als Nichtwahl
# pe05 misst Vertrauen: Wer nicht zustimmt (3 bis 4), zählt als misstrauend.
# untag_na() holt -8 „weiß nicht“ als Code zurück, dann zählt er als Nichtwahl.
allbus <- allbus %>%
  untag_na(pv01) %>%
  mutate(
    misstrauen_lesart = rec(pe05, rules = "3:4=1 [misstraut]; 1:2=0 [misstraut nicht]; else=NA"),
    nichtwahl_lesart  = rec(pv01, rules = "91=1 [würde nicht wählen]; -8=1; 1:90=0 [würde wählen]; else=NA")
  )

# Zeilenprozente: Die Misstrauenden sind 100 %
allbus %>%
  crosstab(misstrauen_lesart, nichtwahl_lesart, percentages = "row")`;

export const R_EXTRA = `# Zusatz · Misstrauens-Zähler: Rechnen innerhalb einer Person
# Je Item eine Dummyvariable: 1 = misstrauische Antwort, bei pe05 ist Ablehnung Misstrauen.
# misstrauen_zahl zählt, wie viele der drei Dummyvariablen 1 sind –
# nur wer alle drei Items beantwortet hat. nichtwahl wie in Prüfauftrag 1.
allbus <- allbus %>%
  mutate(
    misstrauen_pe01 = rec(pe01, rules = "1:2=1 [misstraut]; 3:4=0 [misstraut nicht]; else=NA"),
    misstrauen_pa35 = rec(pa35, rules = "1:2=1; 3:5=0; else=NA"),
    misstrauen_pe05 = rec(pe05, rules = "3:4=1; 1:2=0; else=NA"),
    misstrauen_zahl = row_sums(
      pick(misstrauen_pe01, misstrauen_pa35, misstrauen_pe05),
      min_valid = 3
    ),
    nichtwahl       = rec(pv01, rules = "91=1 [würde nicht wählen]; 1:90=0 [würde wählen]; else=NA")
  )

# Zeilenprozente: Jede Stufe des Zählers ist 100 %
allbus %>%
  crosstab(misstrauen_zahl, nichtwahl, percentages = "row")`;

export const R_SOLUTION = `${R_SETUP}\n\n${R_P1}\n\n${R_P2}\n\n${R_P3_EXAMPLE}\n\n${R_EXTRA}\n`;

export const hints: Record<'p1' | 'p2' | 'p3' | 'extra', Hint> = {
  p1: {
    think: 'Die Pressemitteilung kennt je Variable nur zwei Gruppen: misstraut oder nicht, wählt oder nicht. Du brauchst also zwei Variablen mit nur 0 und 1 (Dummyvariablen). Und: Wer ist bei „87 Prozent der Nichtwähler“ 100 %?',
    pointer: 'rec() fasst Codes zusammen, mutate() legt damit eine neue Variable mit eigenem Namen an – im Werkzeugkasten am Schulabschluss. crosstab() zeigt die Kreuztabelle; mit percentages = "row", "col" oder "total" legst du fest, wer 100 % ist.',
    concept: { id: 'recode', label: 'Rekodieren' },
    workshop: '5 Daten transformieren und Skalen bilden (rec) · 7 Uni- und Bivariate Analyse (crosstab)',
    scaffold: `# Zwei Dummyvariablen bilden
allbus <- allbus %>%
  mutate(
    misstrauen = rec(pe01, rules = "___=1 [misstraut]; ___=0 [misstraut nicht]; else=NA"),
    nichtwahl  = rec(pv01, rules = "___=1 [würde nicht wählen]; ___=0 [würde wählen]; else=NA")
  )

# Kreuztabelle mit der passenden Prozentbasis
allbus %>%
  crosstab(misstrauen, nichtwahl, percentages = "___")`,
    solution: R_P1,
  },
  p2: {
    think: 'Dieselben Befragten in derselben Zelle – nur die Prozentbasis wechselt. Wer ist jetzt 100 %: die Nichtwählenden, die Misstrauenden oder alle?',
    pointer: 'percentages = "all" zeigt in jeder Zelle drei Prozentzahlen: row % (Zeilenprozente), col % (Spaltenprozente) und total % (Gesamtprozente).',
    concept: { id: 'crosstab', label: 'Kreuztabelle' },
    workshop: '7 Uni- und Bivariate Analyse (crosstab)',
    scaffold: `# Dieselbe Kreuztabelle mit allen drei Prozentangaben
allbus %>%
  crosstab(misstrauen, nichtwahl, percentages = "___")`,
    solution: R_P2,
  },
  p3: {
    think: 'Wer pe05 zustimmt, vertraut den Politikern – oder misstraut er ihnen? Und: −8 „weiß nicht“ ist in R ein fehlender Wert. rec() kann ihn erst umkodieren, wenn du ihn als Code zurückgeholt hast.',
    pointer: 'Für pe05 gibt es zwei Wege: die Codes direkt andersherum zusammenfassen (3:4=1) oder erst umpolen mit rules = "rev". untag_na() holt −8 als Code zurück – im Werkzeugkasten an der Wirtschaftslage. Gib den neuen Variablen eigene Namen, damit die Tabelle aus Prüfauftrag 1 erhalten bleibt.',
    concept: { id: 'missing_tools', label: 'Missing-Codes aufbereiten' },
    workshop: '4 Datenimport und Inspektion (fehlende Werte)',
    scaffold: `# Fehlende Werte zurückholen, dann zwei neue Dummyvariablen für deine Lesart
allbus <- allbus %>%
  untag_na(___) %>%
  mutate(
    misstrauen_lesart = rec(pe05, rules = "___=1 [misstraut]; ___=0 [misstraut nicht]; else=NA"),
    nichtwahl_lesart  = rec(pv01, rules = "91=1 [würde nicht wählen]; ___=1; 1:90=0 [würde wählen]; else=NA")
  )

# Kreuztabelle: Die Misstrauenden sind 100 %
allbus %>%
  crosstab(misstrauen_lesart, nichtwahl_lesart, percentages = "___")`,
    solution: R_P3_EXAMPLE,
  },
  extra: {
    think: 'Jede Person bekommt drei Nullen oder Einsen. Ihre Summe zählt, wie vielen Items sie misstrauisch antwortet.',
    pointer: 'In mutate() bildest du die drei Dummyvariablen und gleich danach den Zähler: row_sums(pick(…)) zählt innerhalb einer Person zusammen. Mit min_valid = 3 zählt nur, wer alle drei Items beantwortet hat. Das Muster steht im Werkzeugkasten.',
    concept: { id: 'row_operations', label: 'Rechnen innerhalb einer Person' },
    scaffold: `# Drei Dummyvariablen und der Zähler
allbus <- allbus %>%
  mutate(
    misstrauen_pe01 = rec(pe01, rules = "1:2=1; 3:4=0; else=NA"),
    misstrauen_pa35 = rec(pa35, rules = "___"),
    misstrauen_pe05 = rec(pe05, rules = "___"),
    misstrauen_zahl = row_sums(
      pick(misstrauen_pe01, misstrauen_pa35, misstrauen_pe05),
      min_valid = ___
    )
  )

# Zähler mit der Nichtwahl aus Prüfauftrag 1 kreuzen
allbus %>%
  crosstab(misstrauen_zahl, nichtwahl, percentages = "___")`,
    solution: R_EXTRA,
  },
};

/** Typische Ursachen, wenn das eigene R-Ergebnis anders aussieht. */
export const CAUSES = [
  'untag_na() vergessen: Ohne sie sieht rec() den Code −8 „weiß nicht“ nicht – deine Regel „-8=1“ greift dann nicht.',
  'Zeilen und Spalten vertauscht: Nennt crosstab() zuerst die Nichtwahl und dann das Misstrauen, tauschen auch Zeilen- und Spaltenprozente die Rollen.',
  'Regel von pe01 auf pe05 übertragen: pe05 misst Vertrauen. Wer dort zustimmt, misstraut gerade nicht.',
  'else=0 statt else=NA: Dann zählen auch Nicht-Wahlberechtigte und andere fehlende Werte als „würde wählen“.',
  'Falsche Zelle abgelesen: Die Tabelle hat vier Zellen. Gesucht ist die Zelle „misstraut“ / „würde nicht wählen“.',
];
/** In Prüfauftrag 1 gibt es weder pe05 noch „weiß nicht“: nur die Ursachen, die dort vorkommen können. */
export const CAUSES_P1 = CAUSES.filter(c => !c.startsWith('untag_na()') && !c.startsWith('Regel von pe01'));
