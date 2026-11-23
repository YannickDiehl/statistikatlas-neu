import type { Hint } from '../kit/HintLadder';

export type AntragId = 'horoskop' | 'gefluechtete' | 'politik' | 'einsamkeit';
export const ANTRAG_IDS: readonly AntragId[] = ['horoskop', 'gefluechtete', 'politik', 'einsamkeit'];

export type Antrag = {
  id: AntragId;
  text: string;
  /** Rückmeldung zu Variablen, die man für diese Idee übernehmen könnte (spiegelt, bewertet nicht). */
  catalog: Record<string, string>;
  /** Variablen, die die Idee eindeutig treffen: Ihre Rückmeldung erscheint als „richtig“ (grün). */
  fits?: string[];
  /** Reaktion der Kollegin auf die Entscheidung „Neu fragen“ (intern: ask). */
  onAsk: { tone: 'ok' | 'hint'; text: string; needsReason: boolean };
  hint: Hint;
};

/** Schritt 1: nur das Einlesen. */
export const SETUP_SCRIPT = `library(tidyverse)
library(mariposa)

# ZA8831_v1-3-0.sav auswählen (nach Registrierung bei GESIS)
allbus <- read_spss(file.choose())
# oder direkt, wenn die Datei im Arbeitsverzeichnis liegt:
# allbus <- read_spss("ZA8831_v1-3-0.sav")
`;

/** Werkzeugkasten der Sitzung: Laden, Einlesen und beide Suchwege an einem neutralen Beispiel. */
export const TOOLBOX_SCRIPT = `# Pakete laden – immer zuerst, mariposa als Zweites
library(tidyverse)
library(mariposa)

# Daten einlesen: Datei im Fenster auswählen …
allbus <- read_spss(file.choose())
# … oder nur den Dateinamen angeben, wenn sie im Arbeitsverzeichnis liegt
# allbus <- read_spss("ZA8831_v1-3-0.sav")

# Variablen suchen, Beispiel: alles rund um Schule
find_var(allbus, "schul")

# Das ganze Codebuch öffnen, darin mit Strg+F / Cmd+F suchen
codebook(allbus)
`;

/** Schritt 2: das vorgemachte Beispiel (Idee 1) mit beiden Suchwegen. */
export const EXAMPLE_SCRIPT = `# Weg 1: in R suchen
find_var(allbus, "horoskop")

# Weg 2: das ganze Codebuch öffnen (Viewer unten rechts)
# und darin mit Strg+F / Cmd+F nach "horoskop" suchen
codebook(allbus)

# Den Treffer rh08b siehst du dir dann im Codebuch genau an:
# Codes, Wertelabels und Häufigkeiten (Spalte Freq.)
`;

export const handshakeHint: Hint = {
  think: 'RStudio hat vier Fenster. Welches davon zeigt, welche Daten R gerade geladen hat?',
  pointer: 'Oben rechts im Environment steht allbus mit „… obs. of … variables“. Klappt das Einlesen nicht, kopiere die Fehlermeldung aus R in das Feld „R zeigt eine Fehlermeldung?“ weiter oben.',
  concept: { id: 'data_import', label: 'Daten nach R einlesen' },
  workshop: 'Kap. 1, Environment und History',
  scaffold: 'library(tidyverse)\nlibrary(mariposa)\nallbus <- ____(file.choose())',
  solution: SETUP_SCRIPT,
};

export const antraege: Antrag[] = [
  {
    id: 'horoskop',
    text: 'Halten die Leute eigentlich etwas von Horoskopen?',
    catalog: { rh08b: 'Passt: Die Frage misst genau, was man von Astrologie und Horoskopen hält.' },
    fits: ['rh08b'],
    onAsk: { tone: 'hint', text: 'Die Kollegin: „Bist du sicher? Such spaßeshalber auch mal nach ‚tarot‘ – der ALLBUS fragt Überraschendes.“', needsReason: false },
    hint: {
      think: 'find_var() findet auch Wortteile. Ein kurzes Suchwort reicht.',
      pointer: 'find_var() durchsucht die Variablennamen und ihre Variablenlabels. Oder du öffnest mit codebook(allbus) das ganze Codebuch und suchst darin mit Strg+F (Mac: Cmd+F). Dort siehst du auch gleich die Codes mit ihren Wertelabels und wie oft jeder vorkommt.',
      concept: { id: 'codebook', label: 'Codebuch & Variablensuche' },
      workshop: '4.4.1 find_var()',
      scaffold: 'find_var(allbus, "____")\ncodebook(____)',
      solution: 'find_var(allbus, "horoskop")\ncodebook(allbus)   # darin rh08b nachschlagen',
    },
  },
  {
    id: 'gefluechtete',
    text: 'Wie viele haben Angst vor Geflüchteten?',
    catalog: {
      mp16: 'Misst, ob man Geflüchtete eher als Chance oder als Risiko für den Sozialstaat sieht. Ist ein „Risiko“ dasselbe wie Angst?',
      mp17: 'Misst, ob man Geflüchtete eher als Chance oder als Risiko für die Sicherheit sieht. Ist ein „Risiko“ dasselbe wie Angst?',
      mp18: 'Misst, ob man Geflüchtete eher als Chance oder als Risiko für das Zusammenleben sieht. Ist ein „Risiko“ dasselbe wie Angst?',
      mp19: 'Misst, ob man Geflüchtete eher als Chance oder als Risiko für die Wirtschaft sieht. Ist ein „Risiko“ dasselbe wie Angst?',
      mi05: 'Misst, ob man den Zuzug von Kriegsflüchtlingen begrenzen will. Das ist eine politische Forderung, kein Gefühl wie Angst.',
    },
    onAsk: { tone: 'hint', text: 'Einspruch der Kollegin: „Der ALLBUS schreibt ‚ü‘ als ‚ue‘. Hast du es so versucht – am besten nur mit dem Wortanfang?“', needsReason: true },
    hint: {
      think: 'Die Variablenlabels im ALLBUS stehen in Großbuchstaben und ohne Umlaute. Wie sähe „Flüchtling“ dort aus?',
      pointer: 'Aus ü wird ue. Such am besten nur nach dem Wortanfang, dann findest du auch gekürzte Variablenlabels.',
      concept: { id: 'codebook', label: 'Codebuch & Variablensuche' },
      workshop: '4.4.1 find_var()',
      scaffold: 'find_var(allbus, "fl____")\ncodebook(____)',
      solution: 'find_var(allbus, "fluecht")\ncodebook(allbus)   # darin mi05 und mp16 bis mp19 nachschlagen',
    },
  },
  {
    id: 'politik',
    text: 'Vertrauen die Menschen der Politik noch?',
    catalog: {
      pt03: 'Vertrauen in den Bundestag. Meint „die Politik“ das Parlament?',
      pt12: 'Vertrauen in die Bundesregierung. Meint „die Politik“ die Regierung?',
      pt15: 'Vertrauen in die politischen Parteien. Meint „die Politik“ die Parteien?',
      st01: 'Vertrauen zu Mitmenschen – das ist nicht die Politik.',
      pe01: 'Nah dran, aber nicht dasselbe: Die Frage „Politiker kümmern sich nicht um meine Gedanken“ misst Unzufriedenheit mit der Politik, nicht Vertrauen.',
    },
    onAsk: { tone: 'hint', text: 'Einspruch der Kollegin: „‚vertrauen‘ ergibt 16 Treffer. Bist du sicher, dass keiner passt?“', needsReason: true },
    hint: {
      think: 'Das Suchwort „vertrauen“ findet viele Fragen. Welche Einrichtung könnte mit „die Politik“ gemeint sein?',
      pointer: 'Mehrere Treffer vergleichst du im Codebuch: Öffne codebook(allbus) und such die Treffer nacheinander mit Strg+F (Mac: Cmd+F). Achte bei den fehlenden Werten auf „TNZ: SPLIT“: TNZ heißt „trifft nicht zu“. Die Frage wurde nur einem Teil der Befragten gestellt.',
      concept: { id: 'codebook', label: 'Codebuch & Variablensuche' },
      workshop: '4.4.2 codebook()',
      scaffold: 'find_var(allbus, "____")\ncodebook(____)',
      solution: 'find_var(allbus, "vertrauen")\ncodebook(allbus)   # darin pt03, pt12 und pt15 vergleichen',
    },
  },
  {
    id: 'einsamkeit',
    text: 'Wie einsam sind die Menschen?',
    catalog: {
      dp03: 'Falscher Treffer: „einsam“ steckt nur im Wort „gemeinsam“ (gemeinsamer Haushalt mit dem Partner).',
      xs01: 'Falscher Treffer: Hier geht es darum, ob das Interview allein durchgeführt wurde – nicht um Einsamkeit.',
      li04: 'Nah dran: Die Frage misst, wie wichtig einem Freunde und Bekannte sind – aber nicht, ob man sich einsam fühlt.',
    },
    onAsk: { tone: 'ok', text: 'Die Kollegin: „Ich finde auch nur falsche Treffer. Deine Entscheidung passt.“', needsReason: false },
    hint: {
      think: 'Prüf jeden Treffer: Geht es wirklich um Einsamkeit – oder steckt das Suchwort nur in einem anderen Wort?',
      pointer: 'Ein Treffer ist erst ein Kandidat. Ob die Frage wirklich passt, zeigen das Variablenlabel und die Ausprägungen im Codebuch.',
      concept: { id: 'codebook', label: 'Codebuch & Variablensuche' },
      workshop: '4.4.2 codebook()',
      scaffold: 'find_var(allbus, "____")\ncodebook(____)',
      solution: 'find_var(allbus, "einsam")\nfind_var(allbus, "allein")\ncodebook(allbus)   # darin dp03, xs01 und li04 nachschlagen',
    },
  },
];
export const antragById = Object.fromEntries(antraege.map(a => [a.id, a])) as Record<AntragId, Antrag>;

/** Typische Fehlermeldungen beim Einstieg (deutsch und englisch). */
export const ERROR_PATTERNS: { pattern: RegExp; cause: string; fix: string }[] = [
  { pattern: /there is no package called|es gibt kein Paket/i, cause: 'Ein Paket ist noch nicht installiert – welches, steht in der Meldung.', fix: 'Einmal install.packages("…") mit diesem Namen ausführen, zum Beispiel install.packages("tidyverse") oder install.packages("mariposa"). Danach die library()-Zeilen noch einmal ausführen.' },
  { pattern: /could not find function "%>%"|Funktion "%>%" nicht finden/i, cause: 'Die Pipe %>% kommt aus dem tidyverse.', fix: 'library(tidyverse) ausführen – in dieser Sitzung geht es aber auch ohne Pipe.' },
  { pattern: /could not find function|konnte Funktion .* nicht finden/i, cause: 'Das Paket ist nicht geladen oder der Funktionsname ist vertippt.', fix: 'library(tidyverse) und library(mariposa) ausführen und die Schreibweise prüfen.' },
  { pattern: /object '.*' not found|Objekt '.*' nicht gefunden/i, cause: 'R kennt dieses Objekt nicht.', fix: 'Die Zeile mit allbus <- read_spss(…) zuerst ausführen und die Schreibweise prüfen.' },
  { pattern: /cannot open|kann .* nicht öffnen|does not exist|existiert nicht/i, cause: 'Die Datei wurde nicht gefunden.', fix: 'read_spss(file.choose()) nutzen und die Datei im Dialog auswählen. Unter macOS liegt der Dialog manchmal hinter RStudio. read_spss("ZA8831_v1-3-0.sav") klappt nur, wenn die Datei im Arbeitsverzeichnis liegt – getwd() zeigt, welcher Ordner das ist.' },
  { pattern: /file choice cancelled|Dateiauswahl abgebrochen/i, cause: 'Der Auswahldialog wurde geschlossen.', fix: 'Die Zeile noch einmal ausführen und die Datei auswählen.' },
  { pattern: /unexpected|unerwartete/i, cause: 'Tippfehler im Code: Meist fehlt eine Klammer, ein Komma oder ein Anführungszeichen.', fix: 'Die Zeile Zeichen für Zeichen mit der Vorlage vergleichen.' },
  { pattern: /No variables found/i, cause: 'find_var() hat keinen Treffer.', fix: 'Anders suchen: ohne Umlaute (ae, oe, ue), nur mit dem Wortanfang oder mit einem anderen Wort gleicher Bedeutung.' },
];
