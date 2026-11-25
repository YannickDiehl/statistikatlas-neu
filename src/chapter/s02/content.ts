// Sitzung 2 „Vom Fragebogen zum Datensatz“: Zahlen, Vorlagen, Fragen und Texte aus
// docs/entwicklung/spezifikationen/2026-11-23-lernpfad-kapitel/sitzung02.md, nur Daten.
// Alle Zahlen: ALLBUS 2023, ZA8831 v1.3.0, ungewichtet, nur Aggregate. Geprüft in allbus.local.test.ts.
// Bauplatten in Bildern und Bögen sind konstruierte Beispiele, keine Werte befragter Personen.
import type { Question } from '../answers';
import { parseMarks } from '../workshop/editor';

/* ---------- Feste Werte (Plan, Abschnitt 12) ---------- */

export const ALLBUS = { rows: 5246, cols: 579, cells: 3037434 };
/** `filter(sex == 2)`; sex: 1 MANN, 2 FRAU, 3 DIVERS. */
export const SEX = { labels: [[1, 'MANN'], [2, 'FRAU'], [3, 'DIVERS']] as [number, string][], female: 2, femaleRows: 2672 };
/** Erhebungsweg mode: 1 PAPI (kommt 2023 nicht vor), 2 CAPI, 3 CAWI, 4 MAIL. */
export const MODE = {
  label: 'ERHEBUNGSMODUS DER ALLBUS-HAUPTBEFRAGUNG',
  labels: [[1, 'PAPI'], [2, 'CAPI'], [3, 'CAWI'], [4, 'MAIL']] as [number, string][],
  n: { 1: 0, 2: 2003, 3: 1587, 4: 1656 } as Record<number, number>,
  paperShare: 31.6,
  /** Mittleres Alter (gerundet) der Papier- und der Online-Befragten. */
  meanAge: { paper: 58, online: 47 },
};
/** Politisches Interesse pa02a, Position 239 im Datensatz. */
export const PA02A = {
  position: 239,
  label: 'POLITISCHES INTERESSE, BEFR. (ORDINAL)',
  labels: [[1, 'SEHR STARK'], [2, 'STARK'], [3, 'MITTEL'], [4, 'WENIG'], [5, 'UEBERHAUPT NICHT']] as [number, string][],
  missing: [{ code: -42, label: 'DATENFEHLER: MFN', n: 4 }, { code: -9, label: 'KEINE ANGABE', n: 17 }],
};
/** Wahlabsicht pv01: gültige Codes mit Wertelabels (keine 5). */
export const PV01 = {
  codes: [[1, 'CDU-CSU'], [2, 'SPD'], [3, 'FDP'], [4, 'DIE GRUENEN'], [6, 'DIE LINKE'], [42, 'AFD'], [90, 'ANDERE PARTEI'], [91, 'WUERDE NICHT WAEHLEN']] as [number, string][],
  afd: 480,
  linke: 260,
  /** „Mittelwert“ aller gültigen Codes, gerundet auf eine Stelle. */
  meanOfCodes: 16.1,
  dontKnow: 603,
};
/** Lebenszufriedenheit ls01. */
export const LS01 = { zero: 26, noAnswer: 81, multiple: 1, empty: 82, low: 'GANZ UNZUFRIEDEN', high: 'GANZ ZUFRIEDEN' };
/** Fehlende Werte aus Grundlage 3b. */
export const MISSING = { ps03Split: 1596, dw15Filter: 2263, rh08bUnknown: 178, distinctCodes: 17 };
/** Aufgabe 2: Strukturfakten des Codebuchs (der Bogen ist ausgedacht). */
export const A2_CODES = {
  age: { min: 18, max: 99, missing: { code: -32, label: 'NICHT GENERIERBAR' } },
  educ: { pupil: 7, pupilLabel: 'NOCH SCHUELER', abitur: 5, abiturLabel: 'HOCHSCHULREIFE' },
  ep03: { bad: 4, badLabel: 'SCHLECHT', veryGood: 1 },
  id02: { working: 2, workingLabel: 'ARBEITERSCHICHT', none: -50, noneN: 15 },
  /** Befragte mit age 19, educ 7, ep03 4 und id02 2 zugleich. */
  sameRow: 0,
  mstatSingle: 5,
};
/** Aufgabe 3: fehlende Werte auf Papier (mode 4) und bei allen. */
export const A3 = {
  paper: { pa01Multiple: 24, st01Split: 858, pt03Split: 798, pa01NoAnswer: 54, st01Multiple: 22, pt03Multiple: 3 },
  all: { pa01Multiple: 24, st01Split: 1647, pt03Split: 1596, pa01NoAnswer: 225 },
  otherModesMultiple: 0,
  versionA: 858,
  versionB: 798,
  online: { st01Split: 789, pt03Split: 798 },
  /** −42 im ganzen ALLBUS: Zellen, Variablen, Papierbögen mit mindestens einer Mehrfachnennung. */
  multiple: { cells: 638, variables: 202, paperSheets: 357, share: 21.6 },
};
/** Grundlage 4 und Aufgabe 4: Datentypen. */
export const TYPES = { labelled: 576, character: 2, double: 1, respidDistinct: 5246 };
/** Ausdruck einer Bauplatte bei Breite 80 (aus sitzung02-zahlen.R; hängt von den ersten zehn Reihen ab). */
export const PRINT = {
  allbus: { visible: 8, more: 571, next: 'eastwest' },
  papier: { visible: 9, more: 570, next: 'german' },
  firstNames: ['za_nr', 'doi', 'version', 'respid', 'substudy', 'mode', 'splt23_1', 'splt23_2', 'eastwest'],
};

/* ---------- Codevorlagen ---------- */

export type Template = { title: string; code: string; tryOut?: boolean };
/** ⟦…⟧ markiert Stellen, die angepasst werden. Jede Vorlage legt ihre Objekte selbst an (außer allbus). */
export const TEMPLATES: Record<string, Template> = {
  start: { title: 'Startblock', code: `# Pakete laden und Daten einlesen
library(tidyverse)
library(mariposa)

allbus <- read_spss("ZA8831_v1-3-0.sav")` },
  rlesen: { title: 'Vorlage: nachschlagen und auswählen', code: `# Nachschlagen: Welcher Code steht für FRAU?
codebook(allbus, sex)

# Nur die Befragten behalten, bei denen sex gleich 2 ist
frauen <- allbus %>%
  filter(sex == 2)

# Den neuen Datensatz anzeigen
frauen` },
  a1a: { title: 'Vorlage 1: den Datensatz anzeigen', code: `# Den ganzen Datensatz anzeigen
allbus` },
  a1b: { title: 'Vorlage 2: nachschlagen', code: `# Welcher Code steht für den Papierbogen?
codebook(allbus, mode)` },
  a1c: { title: 'Vorlage 3: nur einen Erhebungsweg behalten', code: `# Nur die Befragten mit einem Code in mode behalten
auswahl <- allbus %>%
  filter(mode == ⟦2⟧)

# Den neuen Datensatz anzeigen
auswahl` },
  a2: { title: 'Vorlage: vier Variablen nachschlagen', code: `# Codes und Wertelabels für die vier Fragen des Fragebogens
codebook(allbus, age, educ, ep03, id02)` },
  a3: { title: 'Vorlage: Codebuch der Papierbögen', code: `# Nur die Papierbögen behalten
papier <- allbus %>%
  filter(mode == 4)

# Codebuch für drei Fragen, nur Papierbögen
codebook(⟦papier⟧, pa01, st01, pt03)` },
  a4: { title: 'Vorlage: Papierbögen anzeigen', code: `# Nur die Papierbögen behalten und anzeigen
papier <- allbus %>%
  filter(mode == 4)

papier` },
  frei_a1: { tryOut: true, title: 'Deine Probier-Werkstatt', code: `# Eine Idee: nur die Online-Befragten (mode 3 = CAWI)
online <- allbus %>%
  filter(mode == 3)

online
` },
  frei_a2: { tryOut: true, title: 'Deine Probier-Werkstatt', code: `# Eine Idee: Wie ist der Familienstand gespeichert?
codebook(allbus, mstat)
` },
  frei_a3: { tryOut: true, title: 'Deine Probier-Werkstatt', code: `# Eine Idee: Gab es die zwei Versionen auch online? (mode 3 = CAWI)
online <- allbus %>%
  filter(mode == 3)

codebook(online, st01, pt03)
` },
  frei_a4: { tryOut: true, title: 'Deine Probier-Werkstatt', code: `# Eine Idee: Wie viele verschiedene Werte hat die Kennnummer respid?
codebook(allbus, respid)
` },
};

/* ---------- Antworten prüfen ---------- */

type Extra = { short?: string; help?: string; specialInput?: Record<string, string>; wrongByOption?: Record<string, string> };
const choice = (id: string, label: string, options: [string, string][], target: string, right: string, hint: string, extra: Extra = {}): Question =>
  ({ id, label, kind: 'choice', options: options.map(([value, l]) => ({ value, label: l })), target, right, hint, ...extra });
/** The same feedback for several spellings of one wrong number. */
const inputs = (spellings: string[], text: string): Record<string, string> => Object.fromEntries(spellings.map(x => [x, text]));
const number = (id: string, label: string, target: number, right: string, hint: string, extra: Extra = {}): Question =>
  ({ id, label, kind: 'number', target, right, hint, ...extra });

/**
 * Antwortfragen der vier Aufgaben (Ids wie im Plan). Die Rückmeldungen für bestimmte falsche Zahlen
 * (579, 2.003, 5.246, ep03 = 2, educ = 5) stehen in `specialInput` der jeweiligen Frage.
 * „Dein Tipp vorhin“ zeigt der Baustein selbst unter den Rückmeldungen.
 */
export const QUESTIONS: Record<'a1' | 'a2' | 'a3' | 'a4', Question[]> = {
  a1: [
    number('a1_reihen', 'Wie viele ⟪Fälle|fall⟫ (Zeilen) hat `allbus`?', 5246,
      'Stimmt: 5.246 Fälle, eine Zeile für jede befragte Person. R schreibt sie als 5,246.',
      'Noch nicht. Schau in die erste Zeile der Ausgabe von Vorlage 1: Die erste Zahl nach „A tibble:“ zählt die Zeilen, also die Fälle.',
      { short: 'Fälle von allbus', specialInput: { '579': 'Noch nicht. 579 sind die Variablen (Spalten). Gefragt sind die Fälle (Zeilen), die erste Zahl.' }, help: 'Erste Zeile der Ausgabe von Vorlage 1. R schreibt 5,246; tipp die Zahl als 5246 oder 5.246.' }),
    number('a1_code', 'Welcher Code steht in `mode` für den Papierbogen (MAIL)?', 4,
      'Stimmt: 4 = MAIL, der Papierbogen per Post. 2 ist das Interview (CAPI), 3 online (CAWI).',
      'Noch nicht. Such in der Ausgabe von Vorlage 2 unter „Value labels“ das Wort MAIL.',
      { short: 'Code für MAIL', help: 'Aus Vorlage 2, Value labels.' }),
    number('a1_papier', 'Wie viele Fälle hat deine Auswahl mit dem Papier-Code?', 1656,
      'Stimmt: 1.656 Fälle stammen von Papierbögen, knapp ein Drittel aller Befragten (31,6 %). Jede dieser Zeilen hat jemand abgetippt.',
      'Noch nicht. Hast du die markierte 2 gegen den Code für MAIL getauscht? Dann steht die Zahl in der ersten Zeile der Ausgabe.',
      { short: 'Fälle auf Papier', specialInput: {
        ...inputs(['2003', '2.003', '2,003'], 'Noch nicht. Hast du die markierte 2 gegen den Code für MAIL getauscht? Dann steht die Zahl in der ersten Zeile der Ausgabe. 2.003 sind die Interviews.'),
        ...inputs(['5246', '5.246', '5,246'], 'Noch nicht. Das ist noch der ganze ALLBUS. Hast du Vorlage 3 ausgeführt?'),
      }, help: 'Erste Zeile der Ausgabe von Vorlage 3, nach dem Tausch. Tipp die Zahl ohne das Komma von R.' }),
    choice('a1_was', 'Was hat `filter()` mit dem Datensatz gemacht?',
      [['reihen', 'Fälle (Zeilen) weggelassen, alle 579 Variablen behalten'], ['tuerme', 'Variablen (Spalten) weggelassen, alle 5.246 Fälle behalten'], ['codes', 'die Codes in mode verändert']], 'reihen',
      'Genau. `filter()` wählt Fälle aus; jede verbliebene Person behält alle ihre Antworten.',
      'Schau noch einmal auf die erste Zeile: Die zweite Zahl, die der Variablen, ist dieselbe wie bei `allbus`. Geändert hat sich nur die Zahl der Fälle.',
      { short: 'Was filter() macht', help: 'Vergleiche die erste Zeile von Vorlage 1 und Vorlage 3.' }),
    choice('a1_wer', 'Deuten: Du rechnest mit `auswahl` weiter, etwa wie zufrieden die Menschen mit ihrem Leben sind. Für wen gilt dein Ergebnis?',
      [['alle', 'für alle 5.246 Befragten des ALLBUS'], ['papier', 'nur für die 1.656 Befragten, die auf Papier geantwortet haben'], ['de', 'für alle Menschen in Deutschland']], 'papier',
      'Genau. Eine Auswahl ändert, über wen du sprichst. Wer auf Papier antwortet, kann sich von den anderen unterscheiden: Die Papier-Befragten sind im Schnitt 58 Jahre alt, die Online-Befragten 47.',
      '`filter()` hat alle anderen Fälle weggelassen. Was du mit `auswahl` ausrechnest, beschreibt nur die Fälle, die noch da sind: die 1.656 Papier-Befragten.',
      { short: 'Für wen das Ergebnis gilt', help: 'Grundlage 1: Jeder Fall ist eine Person. Wer ist in `auswahl` noch drin?' }),
  ],
  a2: [
    choice('a2_age', 'Was trägst du bei `age` ein?',
      [['zahl', 'die Zahl vom Fragebogen, also 19'], ['label', 'den Code des Wertelabels für 19 Jahre'], ['m32', '−32']], 'zahl',
      'Stimmt. Für ⟪gültige Werte|gueltige-werte⟫ hat `age` keine Wertelabels (unter `Values` steht nur 18 - 99); die Zahl ist selbst die Antwort: Jahre. Nur der fehlende Wert −32 NICHT GENERIERBAR trägt ein Label.',
      'Schau bei age nach „Value labels“: Es gibt keine für die Jahre. −32 ist ein fehlender Wert. Die Zahl vom Fragebogen ist schon der Wert.',
      { short: 'age', help: 'Aus der Vorlage, age, Values.' }),
    number('a2_educ', 'Welcher Code gehört bei `educ` zum Wertelabel für „Ich gehe noch zur Schule“?', 7,
      'Stimmt: 7 = NOCH SCHUELER.',
      'Noch nicht. Such unter „Value labels“ von educ das Wertelabel für jemanden, der noch zur Schule geht.',
      { short: 'educ', specialInput: { '5': 'Noch nicht. 5 ist HOCHSCHULREIFE. Die Person geht aber noch zur Schule.' }, help: 'Aus der Vorlage, educ, Value labels.' }),
    number('a2_ep03', 'Welcher Code gehört bei `ep03` zum angekreuzten „schlecht“?', 4,
      'Stimmt: 4 = SCHLECHT. Die Skala beginnt mit 1 = SEHR GUT. Diese ⟪Polung|polung⟫ heißt: Eine höhere Zahl steht hier für eine schlechtere Lage.',
      'Noch nicht. Bei ep03 steht 1 für SEHR GUT. In welche Richtung läuft die Skala, und wo steht SCHLECHT?',
      { short: 'ep03', specialInput: { '2': 'Noch nicht. 2 wäre GUT. Viele erwarten, dass die höhere Zahl „besser“ heißt; hier ist es umgekehrt.' }, help: 'Aus der Vorlage, ep03, Value labels.' }),
    number('a2_id02', 'Welcher Code gehört bei `id02` zur angekreuzten „Arbeiterschicht“?', 2,
      'Stimmt: 2 = ARBEITERSCHICHT.',
      'Noch nicht. Such unter „Value labels“ von id02 das Wort ARBEITERSCHICHT.',
      { short: 'id02', help: 'Aus der Vorlage, id02, Value labels.' }),
    choice('a2_rang', 'Jemand anderes hat bei `educ` den Code 5. Hat diese Person einen höheren Abschluss als die Person auf deinem Fragebogen mit der 7?',
      [['nein', 'Nein, umgekehrt: 7 ist der höchste Abschluss.'], ['ja', 'Ja: 5 heißt HOCHSCHULREIFE, 7 heißt NOCH SCHUELER, also noch gar kein Abschluss.'], ['offen', 'Das kann man nicht sagen.']], 'ja',
      'Genau. Bei `educ` laufen die Codes 1 bis 5 von ohne Abschluss bis Hochschulreife; 6 und 7 hängen hinten an und passen in keine Rangfolge. Codes sind Namen: Ob eine Reihenfolge gilt, sagt das Wertelabel, nicht die Zahl. Nur die Kategorien 1 bis 5 sind ⟪geordnete Kategorien|ordinal⟫.',
      'Lies die Wertelabels von educ: Was heißt 5, was heißt 7? Die höhere Zahl ist hier nicht der höhere Abschluss.',
      { short: 'Rangfolge bei educ', help: 'Aus der Vorlage, educ, Value labels.' }),
  ],
  a3: [
    number('a3_mfn_papier', 'Wie oft steht −42 bei `pa01` in den Papierbögen?', 24,
      'Stimmt: 24 Papierbögen haben bei der Links-rechts-Frage mehrere Kreuze.',
      'Noch nicht. Schau in Schritt 1 bei pa01 unter „Missing values“ in die Zeile mit −42. Die Zahl steht hinter „n =“.',
      { short: '−42 bei pa01, Papier', help: 'Schritt 1, pa01, Zeile −42.' }),
    number('a3_mfn_alle', 'Wie oft steht −42 bei `pa01` bei allen Befragten?', 24,
      'Stimmt: ebenfalls 24.',
      'Noch nicht. Hast du in Schritt 2 `papier` gegen `allbus` getauscht? Oben muss „Observations: 5246“ stehen.',
      { short: '−42 bei pa01, alle', help: 'Schritt 2, pa01, Zeile −42.' }),
    choice('a3_wo', 'Wo kommen Mehrfachnennungen bei `pa01` also vor?',
      [['gleich', 'überall gleich oft'], ['papier', 'nur auf Papier'], ['online', 'vor allem online']], 'papier',
      'Genau: 24 bei allen, 24 auf Papier, also im Interview und online kein einziges Mal. Dort lässt sich nur ein Kästchen wählen.',
      'Vergleiche die beiden Zahlen: Wenn alle 24 Mehrfachnennungen auch unter den Papierbögen sind, wie viele bleiben dann für Interview und online?',
      { short: 'Wo Mehrfachnennungen vorkommen', help: 'Vergleiche Schritt 1 und Schritt 2.' }),
    number('a3_st01', 'Wie oft steht −11 TNZ: SPLIT bei `st01` in den Papierbögen?', 858,
      'Stimmt: Bei st01 steht in 858 Papierbögen −11.',
      'Noch nicht. Nimm die Ausgabe für `papier` (Observations: 1656), Variable st01, Zeile −11. 1.647 wäre bei allen Befragten.',
      { short: '−11 bei st01, Papier', help: 'Schritt 1, st01, Zeile −11.' }),
    number('a3_pt03', 'Wie oft steht −11 TNZ: SPLIT bei `pt03` in den Papierbögen?', 798,
      'Stimmt: Bei pt03 steht in 798 Papierbögen −11.',
      'Noch nicht. Nimm die Ausgabe für `papier`, Variable pt03, Zeile −11. 1.596 wäre bei allen Befragten.',
      { short: '−11 bei pt03, Papier', help: 'Schritt 1, pt03, Zeile −11.' }),
    choice('a3_split', '858 + 798 = 1.656, genau alle Papierbögen. Was heißt das?',
      [['verweigert', '1.656 Menschen wollten bei beiden Fragen nicht antworten.'], ['version', 'Jeder Papierbogen hatte genau eine der beiden Fragen nicht: Version A ohne st01, Version B ohne pt03.'], ['fehler', 'Bei den Papierbögen ist etwas schiefgegangen.']], 'version',
      'Genau. Die 858 Papierfragebögen der Version A hatten keine Frage nach dem Vertrauen zu Mitmenschen, die 798 der Version B keine nach dem Bundestag. Jeder Papierfragebogen war entweder Version A oder Version B, darum überschneiden sich die beiden Teilgruppen nicht. −11 ⟪TNZ: SPLIT|tnz⟫ heißt: nicht gefragt, nicht „nicht geantwortet“.',
      '−11 TNZ: SPLIT heißt „nicht gefragt“. Wer nicht gefragt wurde, hat auch nicht verweigert. Zusammen sind es genau alle 1.656 Papierbögen: Jeder fehlt bei genau einer der beiden Fragen.',
      { short: 'Was −11 heißt', help: 'Grundlage 3b, Zeile −11.' }),
  ],
  a4: [
    choice('a4_respid', 'Welchen Typ hat `respid`?',
      [['dbl', '`<dbl>` Zahl'], ['chr', '`<chr>` Text'], ['lbl', '`<dbl+lbl>` Zahl mit Wertelabel']], 'dbl',
      'Stimmt: `respid` ist die einzige Variable im ALLBUS, die eine Zahl ganz ohne Wertelabel ist.',
      'Schau in der Ausgabe unter den Namen `respid`: Dort steht `<dbl>`, ohne `+lbl`.',
      { short: 'Typ von respid', help: 'Zeile unter den Namen, bei respid.' }),
    choice('a4_doi', 'Welchen Typ hat `doi`?',
      [['dbl', '`<dbl>` Zahl'], ['chr', '`<chr>` Text'], ['lbl', '`<dbl+lbl>` Zahl mit Wertelabel']], 'chr',
      'Stimmt: Die Internetadresse ist Text. Mit Text kann man nicht rechnen, man kann ihn nur lesen und vergleichen.',
      'Schau unter `doi`: Dort steht `<chr>`, character, Text.',
      { short: 'Typ von doi', help: 'Zeile unter den Namen, bei doi.' }),
    choice('a4_mode', 'In der Spalte `mode` steht in jeder Zeile `4 [MAIL]` (gekürzt `4 [MAI…`). Was ist das?',
      [['code', 'die Zahl 4 mit dem Wertelabel MAIL'], ['vier', 'vier Papierbögen'], ['wort', 'das Wort MAIL in Zeile 4']], 'code',
      'Genau: der Code 4, und in eckigen Klammern sein Wertelabel MAIL. So zeigt R den ⟪Datentyp⟫ `<dbl+lbl>`.',
      'Vor der Klammer steht der Code, in der Klammer das Wertelabel. Den Code 4 kennst du aus Aufgabe 1.',
      { short: 'Zelle in mode', help: 'Spalte mode in der Ausgabe.' }),
    choice('a4_rechnen', 'Ist ein Mittelwert von `respid` eine sinnvolle Aussage?',
      [['ja', 'ja, sie ist eine Zahl ohne Wertelabel'], ['nein', 'nein: respid ist eine Kennnummer, sie benennt Befragte und misst nichts']], 'nein',
      'Genau. Typ und Bedeutung sind zweierlei: `<dbl>` sagt nur, dass Zahlen in der Spalte stehen. Ob man mit ihnen rechnen darf, hängt davon ab, was sie messen. Das beschreibt das ⟪Skalenniveau⟫: Eine Kennnummer ist ⟪nominal⟫, sie benennt nur.',
      'Eine Kennnummer ist wie ein Name. Der Mittelwert aller Kennnummern sagt nichts über die Befragten, genauso wenig wie der Mittelwert der Partei-Codes in Grundlage 2c.',
      { short: 'Mittelwert von respid', help: 'Grundlage 4a, Häufige Verwechslung.' }),
    choice('a4_wort', 'Würde man bei `mode` das Wertelabel zum Wert machen (Sitzung 4): Was stünde dann in jeder Zelle von `papier`?',
      [['4', '4'], ['mail', 'MAIL'], ['beides', '4 [MAIL]']], 'mail',
      'Genau: das Wort MAIL, gespeichert als ⟪Faktor⟫ (Typ `<fct>`). Die 4 wäre weg.',
      'Schau in Grundlage 4b, Zustand „Wertelabel wird zum Wert“: Aus der Zahl mit Wertelabel wird das Wort.',
      { short: 'Wertelabel als Wert', help: 'Grundlage 4b.' }),
  ],
};

/** Pflichtaufgaben: Aufgabe 1, 2 und 3 (Aufgabe 4 ist Zusatz). */
export const REQUIRED: Question[] = [...QUESTIONS.a1, ...QUESTIONS.a2, ...QUESTIONS.a3];

/* ---------- Kurz überlegen in den Grundlagen ---------- */

/** Grundlage 1b: Wie viele Werte hat eine Variable? (Rückmeldung je falscher Wahl in G1_TURM_WRONG). Rückmeldungen in den
 * Grundlagen beginnen ohne „Genau“, weil „Kurz überlegen“ selbst „Richtig.“ davorsetzt. */
export const G1_TURM: Question = choice('g1_turm', 'Wie viele Zellen hat eine einzelne Variable, etwa die Lebenszufriedenheit `ls01`?',
  [['579', '579'], ['5246', '5.246'], ['geantwortet', 'so viele, wie Personen geantwortet haben']], '5246',
  'Einen Wert für jede befragte Person, also 5.246. Auch wer nicht geantwortet hat, hat bei dieser Variable eine Zelle, mit einem fehlenden Wert und seinem Grund. Bei `ls01` fehlen 82 Werte. Darum ist ein Datensatz immer ein Rechteck.',
  '579 ist die Zahl der Variablen. Eine Variable ist eine Spalte und hat einen Wert für jeden Fall, also für jede Person: 5.246.');
export const G1_TURM_WRONG: Record<string, string> = {
  '579': '579 ist die Zahl der Variablen. Eine Variable ist eine Spalte und hat einen Wert für jeden Fall, also für jede Person: 5.246.',
  geantwortet: 'Auch wer nicht geantwortet hat, bekommt eine Zelle: einen fehlenden Wert, zu dem der Grund gespeichert ist (Grundlage 3). So hat jede Variable 5.246 Werte.',
};

/** Grundlage 2a: „1 oder 5?“ (die Rückmeldung zu 5 steht in G2_EINS_WRONG). */
export const G2_EINS: Question = choice('g2_eins', 'Welche Zahl bekommt „sehr stark“?',
  [['1', '1'], ['5', '5']], '1',
  '1 = SEHR STARK, 5 = UEBERHAUPT NICHT. Raten hätte hier aber genauso gut danebengehen können. Woher man das sicher weiß? Nur aus dem Codebuch.',
  'Viele tippen auf 5, weil mehr Interesse nach einer höheren Zahl klingt. Im ALLBUS ist es umgekehrt: 1 = SEHR STARK, 5 = UEBERHAUPT NICHT. Woher man das weiß? Nur aus dem Codebuch.');

/** Grundlage 2c: „Mittelwert“ der Partei-Codes. */
export const G2_MITTEL: Question = choice('g2_mittel', 'Rechnet man trotzdem den Mittelwert aller gültigen Codes von `pv01` aus, kommt 16,1 heraus. Was sagt diese Zahl über die Wahlabsicht?',
  [['zwischen', 'Die durchschnittliche Wahlabsicht liegt zwischen der Linken (6) und der AfD (42).'], ['nichts', 'Nichts: Für 16,1 gibt es keine Partei, die Codes sind nur Namen.'], ['klein', 'Die meisten wählen eine Partei mit kleinem Code.']], 'nichts',
  'Bei Codes für Kategorien ohne Reihenfolge, also ⟪nominalen|nominal⟫ Codes, ist ein Mittelwert sinnlos. Zählen kannst du sie, rechnen nicht. Wie oft jede Partei genannt wird, zeigt `frequency()` (kennst du aus Sitzung 1); Prozente dazu kommen in Sitzung 3.',
  'Der Mittelwert behandelt die Codes wie Mengen. Die 42 der AfD ist aber nicht siebenmal so viel wie die 6 der Linken. Für 16,1 gibt es keine Partei.');

export type Sheet = { id: string; letter: string; question: string; picture: string; options: [string, string][]; target: string; right: string; wrong: string };
/** Grundlage 3a: vier Fragebögen; was steht im Datensatz? */
export const SHEETS: Sheet[] = [
  { id: 'g3_a', letter: 'A', question: 'Lebenszufriedenheit 0 bis 10', picture: 'Lebenszufriedenheit 0 bis 10, Kreuz bei 0',
    options: [['0', '0'], ['-9', '−9'], ['leer', 'leer lassen']], target: '0',
    right: 'Die 0 ist eine Antwort: GANZ UNZUFRIEDEN. Im ALLBUS 2023 haben 26 Befragte sie gegeben.',
    wrong: 'Die Person hat geantwortet, ganz unzufrieden. Die 0 ist ein gültiger Wert, kein Fehlen.' },
  { id: 'g3_b', letter: 'B', question: 'Lebenszufriedenheit 0 bis 10', picture: 'Lebenszufriedenheit 0 bis 10, kein Kreuz',
    options: [['0', '0'], ['-9', '−9'], ['leer', 'leer lassen']], target: '-9',
    right: '−9 KEINE ANGABE. Bei 81 Befragten steht dieser Code.',
    wrong: '0 hieße „ganz unzufrieden“, das hat die Person nicht gesagt. Leer lassen wäre schlechter: R wüsste dann nur „fehlt“, aber nicht warum. Der ALLBUS speichert −9 KEINE ANGABE.' },
  { id: 'g3_c', letter: 'C', question: 'Lebenszufriedenheit 0 bis 10', picture: 'Lebenszufriedenheit 0 bis 10, Kreuze bei 7 und 8',
    options: [['7', '7'], ['7.5', '7,5'], ['-42', '−42']], target: '-42',
    right: '−42 DATENFEHLER: MFN, MFN heißt Mehrfachnennung. Der ALLBUS rät nicht, welches Kreuz gemeint war.',
    wrong: '7,5 gibt es als Code nicht. Und das erste Kreuz zu nehmen, wäre geraten. Der ALLBUS speichert −42 DATENFEHLER: MFN (Mehrfachnennung).' },
  { id: 'g3_d', letter: 'D', question: 'Demokratiezufriedenheit', picture: 'Demokratiezufriedenheit, die Frage steht auf diesem Fragebogen gar nicht, im Kopf steht „Version B“; zu sehen sind Frage 12 und Frage 14, dazwischen der Hinweis „Frage 13 fehlt in Version B“',
    options: [['-9', '−9'], ['-11', '−11'], ['leer', 'leer lassen']], target: '-11',
    right: '−11 TNZ: SPLIT. TNZ heißt „trifft nicht zu“ (kennst du aus Sitzung 1): Die Person wurde nicht gefragt. 1.596 Befragte haben diese Frage nicht bekommen, alle mit Version B.',
    wrong: '−9 hieße, die Person hat nicht geantwortet. Sie wurde aber gar nicht gefragt: Die Frage stand nur in der anderen Fragebogenversion. Dafür gibt es −11 TNZ: SPLIT.' },
];
export const SHEET_QUESTIONS: Question[] = SHEETS.map(s => choice(s.id, `Fragebogen ${s.letter}, ${s.picture}: Was steht im Datensatz?`, s.options, s.target, s.right, s.wrong));

/** Grundlage 3c: Fehler oder Konvention? (gleiche Rückmeldung bei jeder Wahl) */
export const CONVENTION: Question[] = ([
  ['g3_k1', 'Die Linke steht auf dem Fragebogen an fünfter Stelle; jemand trägt bei `pv01` die 5 ein.', 'fehler',
    'Fehler: Das Codebuch sagt eindeutig 6 = DIE LINKE (Grundlage 2c).'],
  ['g3_k2', 'Bei der Lebenszufriedenheit sitzt das Kreuz genau auf der Linie zwischen 7 und 8.', 'konvention',
    'Konvention: Das Codebuch kennt kein Kreuz auf der Linie. Jemand muss eine Regel festlegen, etwa „zählt als −42“ oder „zählt als das Kästchen, in dem der größere Teil des Kreuzes liegt“, und sie für alle Fragebögen gleich anwenden.'],
  ['g3_k3', 'Eine Frage steht nicht auf dem Fragebogen; jemand trägt −9 KEINE ANGABE ein.', 'fehler',
    'Fehler: Die Person wurde nicht gefragt. Dafür gibt es −11 TNZ: SPLIT.'],
] as const).map(([id, label, target, text]) => choice(id, label, [['fehler', 'Fehler gegen das Codebuch'], ['konvention', 'Konvention']], target, text, text));

/** Grundlage 4b: Was geht verloren, wenn das Wertelabel zum Wert wird? */
export const G4_VERLUST: Question = choice('g4_verlust', 'Was geht verloren, wenn das Wertelabel zum Wert wird?',
  [['woerter', 'die Wörter'], ['grund', 'der Grund, warum ein Wert fehlt, und die Codes'], ['nichts', 'nichts']], 'grund',
  'Für eine Grafik ist das in Ordnung. Willst du wissen, warum Werte fehlen, schau vorher ins Codebuch.',
  'Schalte auf „Wertelabel wird zum Wert“ und schau auf den fehlenden Wert und auf die Zahlen.');

/* ---------- Erst festlegen ---------- */

export const PREDICTIONS: Record<'a1' | 'a2' | 'a3' | 'a4', { id: string; prompt: string; options: string[] }> = {
  a1: { id: 'a1', prompt: 'Schätz: Welcher Teil der 5.246 Befragten hat wohl auf Papier geantwortet?', options: ['etwa ein Zehntel', 'etwa ein Drittel', 'etwa die Hälfte'] },
  a2: { id: 'a2', prompt: 'Welche Zahl bekommt „schlecht“ bei der eigenen wirtschaftlichen Lage?', options: ['2', '4', 'Das kann ich ohne Codebuch nicht wissen.'] },
  a3: { id: 'a3', prompt: 'Kommt der Code für Mehrfachnennung (−42) bei pa01 auch bei Befragten vor, die im Interview oder online geantwortet haben?', options: ['ja, ähnlich oft wie auf Papier', 'ja, aber seltener', 'nein, nie'] },
  a4: { id: 'a4', prompt: 'Jede befragte Person hat eine Kennnummer. Darf man mit ihr rechnen, etwa einen Mittelwert bilden?', options: ['ja, es ist eine Zahl', 'nein', 'kommt darauf an'] },
};

/* ---------- Hilfe in drei Stufen ---------- */

/** Stufe 1 Denkanstoß, Stufe 2 Wo schaue ich?, Stufe 3 Lösung; Code in `Backticks`. */
export const HINTS: Record<'a1' | 'a2' | 'a3' | 'a4', [string, string, string]> = {
  a1: [
    'Ein Datensatz hat zwei Maße: Fälle (Zeilen) und Variablen (Spalten). `filter()` fragt jeden Fall, ob er bleiben darf. Was soll mit den Variablen passieren?',
    'Die Größe steht immer in der ersten Zeile der Ausgabe: `A tibble: Fälle × Variablen`. Den Code für MAIL findest du in Vorlage 2 unter ‚Value labels‘. In Vorlage 3 tauschst du nur die markierte Zahl.',
    '`allbus` hat 5.246 Fälle und 579 Variablen. MAIL hat den Code 4. Mit `filter(mode == 4)` bleiben 1.656 Fälle und weiterhin 579 Variablen: 1.656 Papierbögen, knapp ein Drittel. `filter()` lässt Fälle weg und behält alle Variablen. Was du mit `auswahl` ausrechnest, gilt darum nur für die 1.656 Papier-Befragten.',
  ],
  a2: [
    'Auf dem Papier stehen Wörter, im Datensatz Codes. Das Codebuch verbindet beides. Und Vorsicht: Die Reihenfolge der Zahlen sagt nicht, was ‚mehr‘ ist.',
    'In der Ausgabe der Vorlage steht für jede Variable ein Block. Unter ‚Value labels‘ suchst du das Wort vom Fragebogen und nimmst die Zahl davor. Bei age gibt es keine ‚Value labels‘ für Jahre.',
    'Die Zeile für diesen ausgedachten Fragebogen lautet: age 19 (die Zahl selbst, ohne Wertelabel), educ 7 (NOCH SCHUELER), ep03 4 (SCHLECHT), id02 2 (ARBEITERSCHICHT). Bei educ heißt 7 NOCH SCHUELER und liegt damit nicht über 5 HOCHSCHULREIFE. Bei ep03 beginnt die Skala mit 1 = SEHR GUT, ‚schlecht‘ ist 4.',
  ],
  a3: [
    'Ein Code für zwei Kreuze: Wo kann man überhaupt zwei Kreuze setzen? Vergleiche dazu die Papierbögen mit allen Befragten. Und überleg: Was bedeutet −11 TNZ: SPLIT genau?',
    'Alle Zahlen stehen in der Ausgabe der Vorlage unter ‚Missing values‘, hinter ‚n =‘. Achte darauf, ob oben ‚Observations: 1656‘ (nur Papier) oder ‚5246‘ (alle) steht.',
    'Bei pa01 steht −42 in 24 Papierbögen und bei allen Befragten ebenfalls 24-mal: Mehrfachnennungen gibt es nur auf Papier. Bei st01 steht −11 in 858 Papierbögen, bei pt03 in 798; zusammen 1.656, also jeder Papierbogen genau einmal: Version A hatte st01 nicht, Version B pt03 nicht. Im ganzen ALLBUS steht −42 in 638 Zellen aus 202 Variablen, alle aus Papierbögen; 357 der 1.656 Papierbögen (21,6 %) haben mindestens eine Mehrfachnennung.',
  ],
  a4: [
    'Der Typ steht in spitzen Klammern unter dem Namen. `dbl` heißt Zahl, `chr` Text, `+lbl` heißt: mit Wertelabel.',
    'Die Zeile unter den Namen enthält die Typen, in derselben Reihenfolge wie die Namen: doi ist die zweite Variable, respid die vierte, mode die sechste.',
    'respid ist `<dbl>`, doi `<chr>`, mode `<dbl+lbl>`: In `papier` steht dort überall der Code 4 mit seinem Wertelabel MAIL. Ein Mittelwert von respid sagt nichts, denn die Kennnummer benennt nur. Würde man bei mode das Wertelabel zum Wert machen, stünde überall MAIL.',
  ],
};
/** Gelöste Vorlage unter Hilfe-Stufe 3 von Aufgabe 1. */
export const A1_SOLVED = `auswahl <- allbus %>%
  filter(mode == 4)

auswahl`;

/* ---------- Überblick ---------- */

export const CELL_KINDS = [
  'Antwort auf einer Skala (mit Rangfolge oder als Menge)',
  'Code für eine Kategorie ohne Reihenfolge',
  'fehlender Wert mit Grund',
  'Kennnummer',
];
/** Überblick Ü2: sechs ausgedachte Zellen; `answer` ist der Index in CELL_KINDS. */
export const CELLS: { id: string; variable: string; value: string; answer: number; why: string }[] = [
  { id: 'u_1', variable: 'ls01', value: '0', answer: 0, why: 'Die 0 ist eine Antwort, die unterste ⟪Ausprägung|auspraegung⟫ von 0 bis 10: ganz unzufrieden. Wie man mit solchen Skalen rechnen darf, hängt vom ⟪Skalenniveau⟫ ab; mehr dazu in Sitzung 3.' },
  { id: 'u_2', variable: 'ls01', value: '−9', answer: 2, why: '−9 heißt KEINE ANGABE; in R ist das NA.' },
  { id: 'u_3', variable: 'pv01', value: '42', answer: 1, why: '42 ist der Name der AfD, keine Menge und kein Rang: Die Codes sind ⟪nominal⟫.' },
  { id: 'u_4', variable: 'respid', value: '17', answer: 3, why: 'Die Nummer benennt eine Person.' },
  { id: 'u_5', variable: 'ps03', value: '−11', answer: 2, why: '−11 TNZ: SPLIT: nicht gefragt.' },
  { id: 'u_6', variable: 'age', value: '52', answer: 0, why: 'Jahre sind ⟪metrisch⟫: Die Zahl misst eine Menge, ein Jahr mehr ist überall gleich viel.' },
];

/* ---------- Hilfe bei R-Fehlermeldungen ---------- */

/** Text mit Code-Stücken und Links, ohne JSX. */
export type Rich = (string | { code: string } | { href: string; text: string })[];
export const ERROR_HELP_TITLE = 'Hilfe: R meldet einen Fehler';
export const ERROR_HELP_CAPTION = 'Was R sagt, woran es liegt und was du tust';
export const ERROR_HELP: { says: Rich; cause: Rich; helps: Rich }[] = [
  { says: [{ code: 'We detected a named input. … Did you mean mode == 4?' }], cause: [{ code: 'filter(mode = 4)' }, ' mit einem Gleichheitszeichen'], helps: ['In ', { code: 'filter()' }, ' vergleichst du mit ', { code: '==' }, '.'] },
  { says: [{ code: 'konnte Funktion "%>%" nicht finden' }, ' / ', { code: 'could not find function "%>%"' }], cause: ['Startblock nicht ausgeführt (tidyverse fehlt)'], helps: [{ href: '#r1', text: 'Startblock aus R lesen' }, ' ausführen, dann noch einmal.'] },
  { says: [{ code: "Objekt 'papier' nicht gefunden" }, ' / ', { code: "object 'papier' not found" }], cause: ['nur die Zeile ', { code: 'codebook(papier, …)' }, ' ausgeführt, die Zeile mit ', { code: 'papier <- …' }, ' davor nicht; oder Tippfehler im Namen'], helps: ['Die ganze Vorlage ausführen (in RStudio beide Zeilen markieren). Namen genau so schreiben, wie sie angelegt wurden.'] },
  { says: [{ code: "Can't select columns that don't exist. ✖ Column 'Age' doesn't exist." }], cause: ['Variablenname falsch geschrieben (R unterscheidet Groß- und Kleinschreibung)'], helps: ['Name klein und genau wie im Codebuch: ', { code: 'age' }, ', ', { code: 'pa01' }, '. Im Zweifel mit ', { code: 'find_var()' }, ' suchen (Sitzung 1).'] },
  { says: [{ code: "Can't combine x <character> and y <double>." }], cause: [{ code: 'filter(mode == "MAIL")' }, ': Wort statt Code'], helps: ['Den Code nehmen: ', { code: 'filter(mode == 4)' }, '.'] },
  { says: ['keine Fehlermeldung, aber ', { code: '# A tibble: 0 × 579' }], cause: ['ein Code, der nicht vorkommt, etwa ', { code: 'filter(mode == 1)' }, ' (PAPI gab es 2023 nicht)'], helps: ['Unter ', { code: 'Values:' }, ' im Codebuch nachsehen, welche Codes vorkommen.'] },
  { says: [{ code: 'Datei existiert nicht' }, ' / ', { code: 'does not exist' }, ' beim Einlesen'], cause: ['Datei liegt nicht im Arbeitsordner'], helps: [{ code: 'allbus <- read_spss(file.choose())' }, ' und die Datei auswählen (Sitzung 1).'] },
];

/* ---------- Prüf dich selbst ---------- */

export const SELF_TEST: { question: string; options: string[]; answer: number; why: string }[] = [
  { question: 'Was ist in einem Datensatz eine Zeile?', options: ['eine Frage', 'ein Fall, also eine befragte Person', 'eine Antwortmöglichkeit'], answer: 1,
    why: 'Die Zeilen sind die Fälle, die Spalten die Variablen (Grundlage 1).' },
  { question: 'Bei pa02a steht im Codebuch 1 = SEHR STARK … 5 = UEBERHAUPT NICHT. Jemand hat den Code 4. Wie stark interessiert er sich für Politik?', options: ['stark', 'wenig', 'sehr stark'], answer: 1,
    why: '4 = WENIG. Die Skala läuft von stark zu schwach; höher heißt hier weniger (Grundlage 2a).' },
  { question: 'Auf einem Fragebogen ist bei einer Frage kein Kreuz. Was speichert der ALLBUS?', options: ['0', 'nichts, die Zelle bleibt leer', '−9 KEINE ANGABE'], answer: 2,
    why: '0 wäre eine Antwort, eine leere Zelle verliert den Grund. −9 hält fest: gefragt, nicht geantwortet (Grundlage 3a).' },
  { question: 'Was macht allbus %>% filter(mode == 3)?', options: ['behält nur die Online-Befragten, alle Variablen bleiben', 'behält nur die Variable mode', 'setzt bei allen mode auf 3'], answer: 0,
    why: 'filter() wählt Fälle aus. Code 3 ist CAWI, online: 1.587 Fälle, weiterhin 579 Variablen (R lesen, Aufgabe 1).' },
  { question: 'Warum ist ein „Mittelwert“ der Wahlabsicht pv01 Unsinn?', options: ['weil zu viele Werte fehlen', 'weil die Codes Namen für Parteien sind, keine Mengen', 'weil R damit nicht rechnen kann'], answer: 1,
    why: '42 = AfD ist ein Name, wie eine Rückennummer: Die Codes sind ⟪nominal⟫. R würde rechnen (16,1), die Zahl bedeutet aber nichts (Grundlage 2c).' },
];

/* ---------- Skript zum Mitnehmen ---------- */

export const SCRIPT_FILE = 'sitzung2.R';
export const SCRIPT_PARTS = ['start', 'rlesen', 'a1a', 'a1b', 'a1c', 'a2', 'a3', 'a4'];
/** Zusätzliche Kommentarzeile über einer Vorlage im Skript. */
const SCRIPT_NOTES: Record<string, string> = { a1c: '# Für die Papierbögen: die 2 gegen den Code für MAIL tauschen' };
/** Skript sitzung2.R: alle Vorlagen ohne Probier-Werkstätten, Marken stehen mit ihrem Beispielwert. */
export const SCRIPT = '# Sitzung 2: Vom Fragebogen zum Datensatz\n# Statistikatlas, Methoden Ib, ALLBUS 2023 (ZA8831 v1.3.0)\n# Markierte Stellen aus dem Atlas stehen hier mit ihrem Beispielwert.\n\n'
  + SCRIPT_PARTS.map(k => `# ---- ${TEMPLATES[k].title} ----\n${SCRIPT_NOTES[k] ? `${SCRIPT_NOTES[k]}\n` : ''}${parseMarks(TEMPLATES[k].code).code}\n`).join('\n');

/* ---------- Textfassungen der Bilder ---------- */

export const ALT = {
  filterSex: 'Links der Datensatz allbus mit 5.246 Fällen (Zeilen) und 579 Variablen (Spalten), gezeigt sind sechs Zeilen der Variablen sex, ls01 und rh08b. Drei Zeilen haben bei sex den Code 2 mit dem Wertelabel FRAU, die anderen 1 MANN oder 3 DIVERS; diese drei sind grau. Der Pfeil filter(sex == 2) führt zum Datensatz frauen mit 2.672 Fällen und weiterhin 579 Variablen: Nur die FRAU-Zeilen bleiben, alle Variablen bleiben erhalten. Die Werte sind ein Beispiel mit sechs Befragten; die Fallzahlen stammen aus dem ALLBUS 2023.',
  ausgabe: 'Aufbau der Ausgabe von allbus: Die erste Zeile lautet A tibble: 5,246 × 579, also 5.246 Fälle (Zeilen) mal 579 Variablen (Spalten). Es folgen die Namen der ersten Variablen, darunter in spitzen Klammern ihr Typ, dann die ersten Zeilen. Am Ende steht, wie viele Zeilen und Variablen nicht gezeigt sind.',
  pa02a: 'Codebuch-Eintrag von pa02a, Politisches Interesse: 1 SEHR STARK, 2 STARK, 3 MITTEL, 4 WENIG, 5 UEBERHAUPT NICHT. Fehlende Werte: −42 DATENFEHLER: MFN, 4-mal; −9 KEINE ANGABE, 17-mal. Das Kreuz bei ‚sehr stark‘ wird zum Code 1.',
  dreiBeschriftungen: 'Die drei Beschriftungen von pa02a: der Variablenname pa02a, das Variablenlabel POLITISCHES INTERESSE, BEFR. (ORDINAL) und die Wertelabels, zum Beispiel 1 SEHR STARK bis 5 UEBERHAUPT NICHT.',
  pv01: 'Codes der Wahlabsicht pv01: 1 CDU-CSU, 2 SPD, 3 FDP, 4 DIE GRUENEN, 6 DIE LINKE, 42 AFD, 90 ANDERE PARTEI, 91 WUERDE NICHT WAEHLEN. Den Code 5 gibt es nicht.',
  luecken: 'Die vier Fragebögen im Datensatz. ls01: der Wert 0 mit dem Wertelabel GANZ UNZUFRIEDEN, dann zwei fehlende Werte mit den Gründen −9 KEINE ANGABE und −42 DATENFEHLER: MFN. ps03: ein fehlender Wert mit dem Grund −11 TNZ: SPLIT. Fehlende Werte sind in R NA; der Grund bleibt als Wertelabel erhalten.',
  bogenA2: 'Ausgefüllter Papierbogen, ein ausgedachtes Beispiel. Frage 1 Alter (age): 19 Jahre eingetragen. Frage 2 Schulabschluss (educ): angekreuzt ‚Ich gehe noch zur Schule‘. Frage 3 eigene wirtschaftliche Lage (ep03), Antworten sehr gut, gut, teils/teils, schlecht, sehr schlecht: angekreuzt ‚schlecht‘. Frage 4 Schicht (id02), Antworten Unterschicht, Arbeiterschicht, Mittelschicht, obere Mittelschicht, Oberschicht, keiner dieser Schichten: angekreuzt ‚Arbeiterschicht‘.',
  split: 'Zwei Papierfragebögen, ein Beispiel. Version A enthält die Frage nach dem Vertrauen in den Bundestag (pt03), aber nicht die nach dem Vertrauen zu Mitmenschen (st01); im Datensatz steht bei st01 −11 TNZ: SPLIT. Version B enthält st01, aber nicht pt03; dort steht bei pt03 −11 TNZ: SPLIT. Jeder Fall hat also genau einen der beiden fehlenden Werte.',
  typen: 'Drei Datentypen, im Bild als Farben der Steine. Zahl, in R <dbl>, blauer Stein, zum Beispiel 52. Text, <chr>, lila Stein, zum Beispiel Lehrerin. Zahl mit Wertelabel, <dbl+lbl>, blauer Stein mit gelbem Aufkleber für das Wertelabel, zum Beispiel 2 mit NEUE BUNDESLAENDER. Ein fehlender Wert ist ein leerer Stein, NA. Beispiel-Datensatz mit drei Personen: beruf (Text) Lehrerin, Koch, Pflegerin; alter (Zahl) 34, 52, 41; eastwest (Zahl mit Wertelabel) 1 ALTE BUNDESLAENDER, 2 NEUE BUNDESLAENDER, 1 ALTE BUNDESLAENDER.',
  ablauf: 'Vom Kreuz zur Zelle in vier Schritten: Das Kreuz auf dem Fragebogen wird mit dem Codebuch in einen Code übersetzt; bei unklaren Kreuzen gilt eine aufgeschriebene Regel. Die Codes einer Person bilden eine Zeile, fehlende Antworten bekommen einen Code mit Grund. Alle Zeilen zusammen sind der Datensatz, beim ALLBUS 5.246 Zeilen und 579 Variablen.',
};

/* ---------- Beispieldaten der Bilder (konstruiert, keine ALLBUS-Daten) ---------- */

export type Cell = { value: string; label?: string; empty?: boolean };
/** Grundlage 1a: drei Fragebögen als Datenmatrix (Variable für Variable: sex, ls01, rh08b). */
export const BOGEN_PLATTE: { variable: string; question: string; cells: Cell[] }[] = [
  { variable: 'sex', question: 'das Geschlecht', cells: [{ value: '2', label: 'FRAU' }, { value: '1', label: 'MANN' }, { value: '2', label: 'FRAU' }] },
  { variable: 'ls01', question: 'die Lebenszufriedenheit', cells: [{ value: '8' }, { value: '0', label: 'GANZ UNZUFRIEDEN' }, { value: '7' }] },
  { variable: 'rh08b', question: 'was die Person von Astrologie und Horoskopen hält', cells: [{ value: '3', label: 'GAR NICHTS' }, { value: '2', label: 'ETWAS' }, { value: '', label: 'KEINE ANGABE', empty: true }] },
];

/** Grundlage 4b: Variable sex in drei Zuständen (Original, Wertelabel wird zum Wert, Wertelabel entfernen). */
export const CONVERT_STATES = [
  { id: 'original', button: 'Original', type: 'dbl+lbl',
    text: 'So liegt `sex` im ALLBUS: Zahl und Wertelabel gehören zusammen, auch der fehlende Wert hat seinen Grund.' },
  { id: 'label', button: 'Wertelabel wird zum Wert', type: 'fct',
    text: 'Jetzt stehen Wörter in der Variable, ein **Faktor**: Wörter mit fester Reihenfolge. Die Zahlen sind weg, und der fehlende Wert ist nur noch NA: Sein Grund KEINE ANGABE ist verloren. In R heißt diese Umwandlung `to_label()`; du lernst sie in Sitzung 4 kennen, wenn auf einer Grafik Wörter stehen sollen.' },
  { id: 'numeric', button: 'Wertelabel entfernen', type: 'dbl',
    text: 'Jetzt bleiben nur die Zahlen. Was 1 und 2 bedeuten, steht nicht mehr in der Variable; dafür brauchst du wieder das Codebuch.' },
] as const;
/** Die vier Werte der Variable sex (Beispiel). */
export const CONVERT_STONES: Cell[] = [{ value: '1', label: 'MANN' }, { value: '2', label: 'FRAU' }, { value: '2', label: 'FRAU' }, { value: '', label: 'KEINE ANGABE', empty: true }];
