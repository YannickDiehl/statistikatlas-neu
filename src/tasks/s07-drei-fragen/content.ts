import type { Hint } from '../kit/HintLadder';

export type ItemId = 'pa29' | 'pa30' | 'pa31' | 'pa32' | 'pa33' | 'pa34' | 'pa35';
export const ITEM_IDS: readonly ItemId[] = ['pa29', 'pa30', 'pa31', 'pa32', 'pa33', 'pa34', 'pa35'];

/** Die drei Seiten des Populismus – nur als Hilfe, nie vorab (Spezifikation 4.7). Zuordnung als Vorschlag. */
export type FacetId = 'V' | 'E' | 'H';
export const FACET_IDS: readonly FacetId[] = ['V', 'E', 'H'];
export const FACETS: Record<FacetId, { name: string; gist: string }> = {
  V: { name: 'Volkssouveränität', gist: 'Das Volk soll selbst entscheiden, nicht die Politik.' },
  E: { name: 'Anti-Elitismus', gist: 'Die Politiker als abgehobene Elite, die nicht für die Leute da ist.' },
  H: { name: 'Einheit des Volkes', gist: 'Es gibt einen gemeinsamen Volkswillen; wer Kompromisse schließt, verrät ihn.' },
};

export type Item = { id: ItemId; short: string; statement: string; facet: FacetId };
export const ITEMS: Record<ItemId, Item> = {
  pa29: { id: 'pa29', short: 'Abgeordnete nur dem Volk verpflichtet', statement: 'Die Abgeordneten im Bundestag sollten sich nur dem Willen des Volkes verpflichtet fühlen.', facet: 'V' },
  pa30: { id: 'pa30', short: 'Politiker reden zu viel, handeln zu wenig', statement: 'Die Politiker reden zu viel und handeln zu wenig.', facet: 'E' },
  pa31: { id: 'pa31', short: 'Einfache Bürger wären bessere Volksvertreter', statement: 'Ein einfacher Bürger würde meine Interessen besser vertreten als ein Berufspolitiker.', facet: 'E' },
  pa32: { id: 'pa32', short: 'Kompromiss ist Verrat an Prinzipien', statement: 'Was man in der Politik „Kompromiss“ nennt, ist in Wirklichkeit nur ein Verrat der eigenen Prinzipien.', facet: 'H' },
  pa33: { id: 'pa33', short: 'Das Volk sollte entscheiden', statement: 'Das Volk, nicht die Politiker, sollte die wichtigsten politischen Entscheidungen treffen.', facet: 'V' },
  pa34: { id: 'pa34', short: 'Das Volk ist sich einig', statement: 'Die Bürger sind sich im Prinzip einig darüber, was politisch passieren muss.', facet: 'H' },
  pa35: { id: 'pa35', short: 'Politiker vertreten nur die Reichen', statement: 'Politiker vertreten nur die Interessen der Reichen.', facet: 'E' },
};
export const SCALE = '1 stimme voll zu · 2 stimme eher zu · 3 teils/teils · 4 lehne eher ab · 5 lehne ganz ab';

export const ROLE = {
  app: 'Wochenfaden',
  barometer: 'Wochenfaden-Barometer',
};

/** Gründe für die Pflichtfrage, die der Browser bei zu einheitlicher Wahl je Gruppe auslost. */
export const DUTY_REASONS = [
  'Sie stand schon in der Vorgängerstudie – nur mit ihr lässt sich die neue Reihe an die alte anschließen.',
  'Die Chefredaktion zitiert sie jede Woche in der Push-Nachricht.',
  'Ein Partnermedium in Österreich stellt genau diese Frage – nur so lassen sich beide Länder vergleichen.',
  'Die Leserschaft hat sie in einer Abstimmung zur wichtigsten Frage gewählt.',
  'Die App zeigt sie jeden Montag auf dem Sperrbildschirm – viele Leserinnen und Leser kennen sie schon.',
  'Der Beirat der App besteht darauf, weil sie den Kern des Begriffs trifft.',
  'Die Werbekampagne zum Barometer ist mit ihr schon gedruckt.',
] as const;

export const WORKSHOP = '5 Daten transformieren und Skalen bilden (row_means) · 7 Uni- und Bivariate Analyse (pearson_cor) · 8 Latente Strukturen (reliability)';

export const R_SETUP = `library(tidyverse)
library(mariposa)

allbus <- read_spss(file.choose())
# oder direkt, wenn die Datei im Arbeitsverzeichnis liegt:
# allbus <- read_spss("ZA8831_v1-3-0.sav")`;

/** Werkzeugkasten: alle Funktionen der Sitzung an neutralen Beispielen (Vertrauen in Institutionen statt der Populismus-Items). */
export const TOOLBOX_SCRIPT = `${R_SETUP}

# Codebuch öffnen, mit Strg/Cmd + F nach pt02, pt08, pt14 suchen
# (1 = gar kein … 7 = großes Vertrauen)
codebook(allbus)

# Wie stimmig messen drei Items dasselbe?
# Beispiel: Vertrauen in Verfassungsgericht, Justiz, Polizei
rechtsstaat <- allbus %>%
  reliability(pt02, pt08, pt14)

# Kurz: Cronbachs α und McDonalds ω
rechtsstaat

# Ausführlich, mit „Corrected Item-Total“ und „Alpha if Deleted“
summary(rechtsstaat)

# Mittelwertindex: ein Skalenwert pro Person
allbus <- allbus %>%
  mutate(
    recht  = row_means(pick(pt02, pt08, pt14), min_valid = 3),
    medien = row_means(pick(pt09, pt10), min_valid = 2)
  )

# Kennzahlen des Index
allbus %>%
  describe(recht)

# Wie eng hängen zwei Indizes zusammen?
allbus %>%
  pearson_cor(recht, medien)

# Für die Kür: 0/1-Variablen bilden, Zustimmungen je Person zählen
allbus <- allbus %>%
  mutate(
    v_polizei  = rec(pt14, rules = "5:7=1 [vertraut]; 1:4=0 [vertraut nicht]"),
    v_justiz   = rec(pt08, rules = "5:7=1 [vertraut]; 1:4=0 [vertraut nicht]"),
    n_vertraut = row_sums(pick(v_polizei, v_justiz), min_valid = 2)
  )

# Gewichtet auszählen, Prozent von allen Befragten
allbus %>%
  crosstab(n_vertraut, eastwest, percentages = "total", weights = wghtpew)

# Umpolen, falls ein Item andersherum gefragt ist: aus 1 wird 7, aus 7 wird 1
# (pt09: Vertrauen ins Fernsehen – umgepolt heißt eine hohe Zahl „wenig Vertrauen“)
allbus <- allbus %>%
  mutate(
    misstrauen_tv = rec(pt09, rules = "rev")
  )
`;

export const R_BATTERY = `# Schritt 1 · Die ganze Batterie: im Codebuch nach pa29 bis pa35 suchen
codebook(allbus)

# Stimmigkeit aller sieben Items, ausführlich: oben Cronbachs α,
# unten je Item „Corrected Item-Total“ (Trennschärfe)
allbus %>%
  reliability(pa29, pa30, pa31, pa32, pa33, pa34, pa35) %>%
  summary()`;

export const hints: Record<'battery' | 'proposal' | 'kuer', Omit<Hint, 'scaffold' | 'solution'> & { scaffold?: string }> = {
  battery: {
    think: 'Eine einzige Funktion rechnet die Stimmigkeit aller sieben Items. In der ausführlichen Fassung zeigt sie auch, wie gut jedes Item zu den übrigen passt.',
    pointer: 'reliability() mit allen sieben Items, das Ergebnis dann in summary(): Oben steht Cronbachs α, unten unter „Item-Total Statistics“ je Item die Trennschärfe (Spalte „Corrected Item-Total“). Das Muster steht im Werkzeugkasten.',
    concept: { id: 'reliability', label: 'Reliabilität · Alpha & Omega' },
    workshop: '8 Latente Strukturen (reliability)',
    scaffold: '# Stimmigkeit aller sieben Items, ausführlich\nallbus %>%\n  reliability(___, ___, ___, ___, ___, ___, ___) %>%\n  summary()',
  },
  proposal: {
    think: 'Du brauchst eine Zahl für die Stimmigkeit deiner drei Items. Außerdem für jede Person zwei Werte – einen aus deinen drei Items, einen aus den vier gestrichenen –, die du miteinander korrelierst.',
    pointer: 'reliability() zeigt Cronbachs α. row_means() in mutate() bildet den Mittelwert je Person; min_valid legt fest, wie viele Antworten jemand mindestens braucht, um einen Wert zu bekommen. pearson_cor() korreliert die beiden Werte. Das Muster steht im Werkzeugkasten.',
    concept: { id: 'item_score', label: 'Skalenwert pro Person' },
    workshop: WORKSHOP,
  },
  kuer: {
    think: 'Der Mittelwertindex fragt: Liegt der Durchschnitt auf der Seite der Zustimmung? Der Kombinationsindex fragt: Hat die Person allen drei Items zugestimmt? Bilde für jedes Item eine 0/1-Variable und zähl.',
    pointer: 'rec() macht aus 1–2 eine 1 und aus 3–5 eine 0; row_sums() zählt die Zustimmungen je Person. crosstab() mit weights = wghtpew und percentages = "total": Den Anteil nach dem Mittelwertindex liest du in der Zeile mit Kurzwert höchstens 2 ganz rechts (Total, total %), den Anteil nach dem Kombinationsindex in der Spalte, in der alle drei zugestimmt haben, ganz unten (Total) – wer allen dreien zustimmt, stimmt auch im Schnitt zu.',
    concept: { id: 'row_operations', label: 'Rechnen innerhalb einer Person' },
    workshop: '5 Daten transformieren und Skalen bilden (rec, row_sums) · 7 Uni- und Bivariate Analyse (crosstab)',
  },
};

/** Denkanstöße für die Rolle „Inhalt“: erst die Frage, dann die drei Seiten als Vorschlag. */
export const FACET_HELP = {
  think: 'Lies die sieben Items noch einmal langsam: Worum geht es jeweils – um die Politiker, um das Volk als Ganzes oder darum, wer entscheiden soll? Gruppiere sie für dich.',
  reveal: 'Eine gängige Lesart unterscheidet drei Seiten des Populismus. Die Zuordnung ist ein Vorschlag – du darfst anders sortieren und im Satz begründen.',
};

/* ---------- Einstieg: Stimmigkeit anfassen ----------
 * Bewusst eine andere Batterie als die Aufgabe (pa29–pa35) und der Werkzeugkasten (pt…): Rollenbilder in Familie und Beruf,
 * im ALLBUS 2023 einem Teil der Befragten gestellt. Die Items zeigen in verschiedene Richtungen – Umpolen wirkt hier wirklich. */
export type FrId = 'fr07' | 'fr08' | 'fr03b' | 'fr04b' | 'fr05b' | 'fr09' | 'fr10' | 'fr12';
/** Reihenfolge wie im Datensatz – nicht nach Richtung sortiert, damit die Anordnung nichts verrät. */
export const FR_IDS: readonly FrId[] = ['fr07', 'fr08', 'fr03b', 'fr04b', 'fr05b', 'fr09', 'fr10', 'fr12'];
/** Kurzfassungen nach den Variablenlabels; den genauen Wortlaut zeigt der ALLBUS-Fragebogen. */
export const FR_ITEMS: Record<FrId, string> = {
  fr07: 'Eine berufstätige Frau kann eine genauso gute Mutter sein.',
  fr08: 'Beide Eltern sollten Vollzeit arbeiten und sich den Haushalt teilen.',
  fr03b: 'Eine Frau sollte nicht arbeiten, solange ihr Kind klein ist.',
  fr04b: 'Die Frau sollte zu Hause bleiben und die Kinder versorgen.',
  fr05b: 'Eine berufstätige Frau ist die bessere Mutter.',
  fr09: 'Ein Mann, der voll arbeitet, ist ein schlechterer Vater.',
  fr10: 'Auch wenn beide arbeiten, bleibt der Haushalt Sache der Frau.',
  fr12: 'Auch ein Mann kann Haushalt und Kinder übernehmen.',
};
export const FR_SCALE = '1 stimme voll zu · 2 stimme eher zu · 3 stimme eher nicht zu · 4 stimme gar nicht zu';
