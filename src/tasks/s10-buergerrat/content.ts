import type { Hint } from '../kit/HintLadder';

/** Die beiden Ratsmitglieder mit ihren Antworten in den Originalcodes (pe09: 1 voll zu … 4 gar nicht zu; pa02a: 1 sehr stark … 5 überhaupt nicht). */
export type PersonId = 'jana' | 'wiegand';
export type Person = { id: PersonId; name: string; dative: string; age: number; quote: string; pe09: number; pa02a: number; interest: string };
export const PERSONS: Record<PersonId, Person> = {
  jana: { id: 'jana', name: 'Jana', dative: 'Jana', age: 24, quote: '„Bürgerpflicht? Stimme eher nicht zu. Politik interessiert mich wenig.“', pe09: 3, pa02a: 4, interest: 'wenig' },
  wiegand: { id: 'wiegand', name: 'Herr Wiegand', dative: 'Herrn Wiegand', age: 67, quote: '„Bürgerpflicht – stimme eher zu. Politik interessiert mich stark.“', pe09: 2, pa02a: 2, interest: 'stark' },
};

/** Die Zahl auf der Folie des Sachverständigen. */
export const EXPERT_OR = 3.77;
export const CAMPAIGN = '„Wählen ist Ehrensache“';

export const QUESTIONS = [
  '„Heißt 3,77, dass Menschen mit einer Stufe mehr Pflichtgefühl 3,77-mal so wahrscheinlich wählen gehen?“',
  '„Wie wahrscheinlich geht jemand wie Jana wählen, wie wahrscheinlich jemand wie Herr Wiegand – und was ändert jeweils eine Stufe mehr Pflichtgefühl?“',
  '„Bei wem bewirkt unsere Kampagne mehr?“',
  '„Für den Abschlussbericht brauchen wir eine Zahl. Welche?“',
];

export const CAMPAIGN_ANSWERS = [
  { id: 'jana', label: 'bei Jana' },
  { id: 'wiegand', label: 'bei Herrn Wiegand' },
  { id: 'same', label: 'bei beiden gleich' },
  { id: 'depends', label: 'kommt auf die Sprache an' },
] as const;
export type CampaignAnswer = typeof CAMPAIGN_ANSWERS[number]['id'];

/** label: Auswahlliste; suffix: hinter der Zahl auf der Ratskarte („2,61-fach“, „5,4 Prozentpunkte“). */
export const UNITS = [
  { id: 'pp', label: 'Prozentpunkte', suffix: ' Prozentpunkte' },
  { id: 'pct', label: 'Prozent', suffix: ' Prozent' },
  { id: 'times', label: '-fach (Faktor)', suffix: '-fach' },
  { id: 'logit', label: 'Logit-Einheiten', suffix: ' Logit-Einheiten' },
  { id: 'none', label: 'ohne Einheit', suffix: '' },
] as const;
export type Unit = typeof UNITS[number]['id'];

/** Die sechs typischen Umwege, die der Browser erkennt (Nachwort; ohne Zahlen, weil sie von der Datei abhängen). */
export const DETOURS = [
  { title: 'Ohne Gewicht gerechnet', text: 'Der ALLBUS befragt Ostdeutsche absichtlich häufiger. Für eine Aussage über Deutschland gehört weights = wghtpew in das Modell; ohne Gewicht liegt Exp(B) etwas daneben.' },
  { title: 'Gegenrichtung', text: 'Wer Nichtwahl als 1 kodiert oder beide Skalen nicht umpolt, bekommt Kehrwerte: Aus einem Exp(B) über 1 wird eines unter 1.' },
  { title: 'Eine Skala nicht umgepolt', text: 'pe09 läuft von „stimme voll zu“ (1) bis „stimme gar nicht zu“ (4), pa02a von „sehr stark“ (1) bis „überhaupt nicht“ (5). Ohne rec(…, rules = "rev") heißt ein höherer Wert weniger Pflichtgefühl bzw. weniger Interesse.' },
  { title: 'Nichtwahl zu weit gefasst', text: '„Weiß nicht“, „nicht wahlberechtigt“ (−50) oder alle fehlenden Werte als 0 zu zählen, verwässert den Vergleich: Wer keine Absicht geäußert hat oder nicht wählen darf, entscheidet sich nicht gegen das Wählen (Sitzung 5).' },
  { title: 'Chance als Wahrscheinlichkeit gelesen', text: 'Eine Chance von 3 heißt „3 zu 1“, also 75 %. Wahrscheinlichkeiten liegen zwischen 0 und 1, Chancen zwischen 0 und unendlich.' },
  { title: 'Exp(B) als „x-mal so wahrscheinlich“ gelesen', text: 'Exp(B) vervielfacht die Chance, nicht die Wahrscheinlichkeit. Wer schon zu 80 % wählt, kann nicht dreimal so wahrscheinlich wählen – das wären 240 %.' },
] as const;

export const WORKSHOP = '9 Erklärungsmodelle (9.8 Logistische Regression), zu rec() Kap. 5';

/* ---------- R-Code (Werkzeugkasten, Hilfestufen und Lösungsskripte) ---------- */

export const R_START = `library(tidyverse)
library(mariposa)

allbus <- read_spss(file.choose())
# oder direkt, wenn die Datei im Arbeitsverzeichnis liegt:
# allbus <- read_spss("ZA8831_v1-3-0.sav")`;

/** Werkzeugkasten: alle Funktionen der Sitzung an einem neutralen Beispiel (Abitur und Alter statt Wahlabsicht, Pflichtgefühl und Interesse). */
export const TOOLBOX_SCRIPT = `${R_START}

# 0/1-Variable bilden, Beispiel: Abitur (educ 4 und 5) gegen kein Abitur (educ 1 bis 3)
allbus <- allbus %>%
  mutate(
    abitur = rec(educ, rules = "4:5=1 [Abitur]; 1:3=0 [kein Abitur]; else=NA")
  )

# Logistisches Modell: Hängt das Abitur mit dem Alter zusammen? Gewichtet für Deutschland.
beispiel <- allbus %>%
  logistic_regression(abitur ~ age, weights = wghtpew)

beispiel %>%
  summary()

# Von Hand für eine 30-Jährige: Logit, Chance, Wahrscheinlichkeit
# (Konstante 1.811 und B -0.035 aus der Spalte B von summary)
logit <- 1.811 - 0.035 * 30

chance <- exp(logit)

chance / (1 + chance)

# Dasselbe macht predict() – für erfundene Befragte mit 30 und mit 70 Jahren
leute <- tibble(age = c(30, 70))

beispiel %>%
  predict(newdata = leute, type = "response")

# Durchschnittlicher marginaler Effekt: Um wie viel ändert sich die Wahrscheinlichkeit
# je Lebensjahr – im Mittel?
beispiel %>%
  marginal_effects() %>%
  summary()`;

const R_RECODE = `# Wählen 1/0 aus pv01: „weiß nicht“, „nicht wahlberechtigt“ und andere fehlende Werte werden NA.
# Beide Skalen umpolen, damit ein höherer Wert mehr Pflichtgefühl und mehr Interesse heißt:
# pflicht jetzt 1 = stimme gar nicht zu … 4 = stimme voll zu,
# interesse jetzt 1 = überhaupt nicht … 5 = sehr stark
allbus <- allbus %>%
  mutate(
    waehlen   = rec(pv01, rules = "1:90=1 [würde wählen]; 91=0 [würde nicht wählen]; else=NA"),
    pflicht   = rec(pe09, rules = "rev"),
    interesse = rec(pa02a, rules = "rev")
  )`;

const R_MODEL = `# Station 1: das Modell des Sachverständigen. Falls R „Nicht-ganzzahlige #Erfolge
# in einem binomial-GLM“ meldet: harmlos, die Gewichte sind keine ganzen Zahlen.
modell <- allbus %>%
  logistic_regression(waehlen ~ pflicht + interesse, weights = wghtpew)

modell %>%
  summary()`;

const R_JANA = `# Station 2: Jana von Hand. Umgepolt: Pflichtgefühl 2, Interesse 2.
# Logit = Konstante + B × Wert, die B-Werte aus der Spalte B von summary()
logit_jana <- -2.154 + 1.326 * 2 + 0.340 * 2

# Logit anzeigen: 1.178
logit_jana

# Chance = exp(Logit)
chance_jana <- exp(logit_jana)

# Chance anzeigen: 3.248, also gut 3 zu 1
chance_jana

# Wahrscheinlichkeit = Chance / (1 + Chance): 0.765
chance_jana / (1 + chance_jana)`;

const R_PROFILES = `# Station 4 in Chancen: eine Stufe mehr heißt Chance × Exp(B)
# Jana mit einer Stufe mehr: 12.23
3.248 * 3.765

# Herr Wiegand, umgepolt: Pflichtgefühl 3, Interesse 4 – seine Chance: 24.14
exp(-2.154 + 1.326 * 3 + 0.340 * 4)

# Herr Wiegand mit einer Stufe mehr: 90.89
24.14 * 3.765

# Station 4 in Wahrscheinlichkeiten: vier erfundene Befragte
# 1 = Jana, 2 = Jana mit einer Stufe mehr, 3 = Herr Wiegand, 4 = Herr Wiegand mit einer Stufe mehr
profile <- tibble(
  pflicht   = c(2, 3, 3, 4),
  interesse = c(2, 2, 4, 4)
)

modell %>%
  predict(newdata = profile, type = "response")`;

const R_AME = `# Station 5: durchschnittlicher marginaler Effekt (Spalte AME, als Anteil)
modell %>%
  marginal_effects() %>%
  summary()`;

const R_LIKELIHOOD = `# Zusatz: Trefferquote gegen Likelihood – alles steht in summary()
# Trefferquote des Modells: Classification Table, Zeile Overall Percentage.
# Regel „alle wählen“: Wählende geteilt durch alle Befragten im Modell
# (Anzahlen aus der Classification Table) – ergibt 94.8
(12 + 2603) / (18 + 125 + 12 + 2603) * 100

# −2LL des Nullmodells: −2 Log Likelihood (Model Summary)
# plus Chi-square (Omnibus Tests) – ergibt 1122.279
856.448 + 265.831`;

const join = (...parts: string[]) => parts.join('\n\n');
export const R_SOLUTION = {
  model: join(R_START, R_RECODE, R_MODEL),
  jana: R_JANA,
  profiles: R_PROFILES,
  ame: R_AME,
  likelihood: R_LIKELIHOOD,
  full: join(R_START, R_RECODE, R_MODEL, R_JANA, R_PROFILES, R_AME,
    '# ---- Zusatz (freiwillig) ----\n# Die ganze Modellausgabe noch einmal\nmodell %>%\n  summary()', R_LIKELIHOOD),
};

export const hints: Record<'model' | 'jana' | 'profiles' | 'ame' | 'likelihood', Hint> = {
  model: {
    think: 'pv01 ist keine 0/1-Variable. Welche Codes heißen „würde wählen“, welcher „würde nicht wählen“? Und in welche Richtung laufen pe09 und pa02a – heißt ein höherer Code mehr oder weniger Pflichtgefühl?',
    pointer: 'Im Codebuch (codebook(allbus), dann Strg/Cmd + F) stehen die Wertelabels von pv01, pe09 und pa02a. rec() in mutate() baut die 0/1-Variable und polt mit rules = "rev" um. logistic_regression() schätzt das Modell, mit weights = wghtpew für Deutschland. Exp(B) steht in summary().',
    concept: { id: 'logistic_regression', label: 'Logistische Regression' },
    scaffold: `# Wählen 1/0 bilden und beide Skalen umpolen
allbus <- allbus %>%
  mutate(
    waehlen   = rec(pv01, rules = "___=1 [würde wählen]; ___=0 [würde nicht wählen]; else=NA"),
    pflicht   = rec(pe09, rules = "___"),
    interesse = rec(pa02a, rules = "___")
  )

# Logistisches Modell, gewichtet
modell <- allbus %>%
  logistic_regression(___ ~ ___ + ___, weights = ___)

modell %>%
  summary()`,
    solution: R_SOLUTION.model,
  },
  jana: {
    think: 'Das Modell rechnet in Logits. Setz Janas Antworten ein – aber auf den umgepolten Skalen: Welcher Code wird aus „stimme eher nicht zu“ und aus „wenig“?',
    pointer: 'Logit = Konstante + B × Wert, für jeden Prädiktor; die Zahlen stehen in der Ausgabe von summary(), Spalte B. Chance = exp(Logit). Wahrscheinlichkeit = Chance / (1 + Chance). Im Werkzeugkasten steht dieselbe Rechnung für eine 30-Jährige.',
    concept: { id: 'logit', label: 'Wahrscheinlichkeit, Odds & Logit' },
    scaffold: `# Logit: Janas umgepolte Werte einsetzen
logit_jana <- -2.154 + 1.326 * ___ + 0.340 * ___

logit_jana

# Chance
chance_jana <- ___(logit_jana)

chance_jana

# Wahrscheinlichkeit
chance_jana / (___ + chance_jana)`,
    solution: R_SOLUTION.jana,
  },
  profiles: {
    think: 'In Chancen brauchst du kein Modell mehr: Eine Stufe mehr Pflichtgefühl multipliziert die Chance mit Exp(B). Für Wahrscheinlichkeiten lässt du R vorhersagen – für erfundene Befragte, die so antworten wie die beiden Ratsmitglieder.',
    pointer: 'tibble() baut die erfundenen Befragten, predict() mit type = "response" liefert ihre Wahrscheinlichkeiten (ohne type = "response" kämen Logits). Herr Wiegand sagt „stimme eher zu“ und „stark“ – wieder auf den umgepolten Skalen.',
    concept: { id: 'logit', label: 'Wahrscheinlichkeit, Odds & Logit' },
    scaffold: `# Jana mit einer Stufe mehr
3.248 * ___

# Herr Wiegand
exp(-2.154 + 1.326 * ___ + 0.340 * ___)

# Vier erfundene Befragte
profile <- tibble(
  pflicht   = c(2, 3, ___, ___),
  interesse = c(2, 2, ___, ___)
)

modell %>%
  predict(newdata = profile, type = "___")`,
    solution: R_SOLUTION.profiles,
  },
  ame: {
    think: 'Welche Zahl gilt für alle – und versteht jemand ohne Statistik? Der durchschnittliche marginale Effekt (AME) mittelt über alle Befragten, wie stark die Wahrscheinlichkeit je Stufe steigt.',
    pointer: 'marginal_effects() berechnet den AME je Prädiktor, summary() zeigt die Tabelle. Der AME ist ein Anteil: 0,12 hieße 12 Prozentpunkte. Prozentpunkte sind Differenzen von Prozentwerten, keine Prozente.',
    concept: { id: 'marginal_effects', label: 'Marginale Effekte' },
    scaffold: '# Durchschnittlicher marginaler Effekt\nmodell %>%\n  ___() %>%\n  summary()',
    solution: R_SOLUTION.ame,
  },
  likelihood: {
    think: 'Wie oft läge die simple Regel „alle wählen“ richtig? Und was misst −2LL, wenn nicht die Trefferquote?',
    pointer: 'Alles steht in der Ausgabe von summary(). Trefferquote: Classification Table, Overall Percentage. Für „alle wählen“ teilst du die Wählenden durch alle Befragten der Tabelle. −2LL deines Modells: Model Summary. Das Nullmodell (nur die Konstante) steht nicht direkt da – aber der Omnibus-Test zeigt mit Chi-square, um wie viel −2LL vom Nullmodell zu deinem Modell sinkt.',
    concept: { id: 'likelihood', label: 'Likelihood' },
    scaffold: `# Regel „alle wählen“
(12 + 2603) / (___ + ___ + 12 + 2603) * 100

# −2LL des Nullmodells
856.448 + ___`,
    solution: R_SOLUTION.likelihood,
  },
};
