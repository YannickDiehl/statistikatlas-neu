// Kapitel 2, Reiter „Mitnehmen“: das Wichtigste (wörtlich aus Session2.tsx) mit Verweisen in Verstehen, Karten zum Nachlesen je Selbsttest-Frage.
import type { ReactNode } from 'react';
import { Begriff } from '@lernpfad/Begriff';
import type { MitnehmenDaten } from '../../react/typen';

const WICHTIG: [ReactNode, string, string][] = [
  [<>Ein Datensatz ist eine <Begriff id="datenmatrix">Datenmatrix</Begriff>: Zeile = Fall (befragte Person), Spalte = Variable, Zelle = Wert. Der ALLBUS 2023 hat 5.246 Fälle und 579 Variablen.</>, 'k1-matrix', 'Vom Fragebogen zur Zeile'],
  [<>Im Datensatz stehen <b>Codes</b>. Was sie bedeuten, sagen die <b>Wertelabels</b> im Codebuch; die <Begriff id="polung">Polung</Begriff> einer Skala legt der Fragebogen fest.</>, 'k2-richtung', '1 oder 5?'],
  [<>Codes für Kategorien sind Namen, keine Mengen: Mit ihnen zählt man, rechnet aber nicht. Was du rechnen darfst, sagt das <Begriff id="skalenniveau">Skalenniveau</Begriff>.</>, 'k2-namen', 'Codes sind Namen'],
  [<><b>Fehlende Werte</b> haben Gründe: nicht geantwortet (−9), nicht gewusst (−8), nicht gefragt (−10, −11), zwei Kreuze (−42). In R werden sie zu NA, der Grund bleibt im Codebuch als <Begriff id="missing-code">Missing-Code</Begriff> sichtbar.</>, 'k3-gruende', 'Die Gründe im Codebuch'],
  [<>Wo das Codebuch nicht entscheidet, braucht es eine dokumentierte Regel (<b>Konvention</b>).</>, 'k3-konvention', 'Fehler oder Konvention?'],
  [<><Begriff id="datentyp">Datentypen</Begriff>: Zahl <code>&lt;dbl&gt;</code>, Text <code>&lt;chr&gt;</code>, Zahl mit Wertelabel <code>&lt;dbl+lbl&gt;</code>. Umwandeln ändert die Form und lässt etwas weg.</>, 'k4-typen', 'Datentypen'],
  [<>In R: <code>&lt;-</code> legt ab, <code>codebook(daten, variable)</code> schlägt nach, <code>daten %&gt;% filter(variable == code)</code> behält nur bestimmte Fälle; alle Variablen bleiben.</>, 'k1-filter', 'Nur bestimmte Fälle: filter()'],
];

/** Je Frage aus SELF_TEST (content.ts), in derselben Reihenfolge. */
const SELBST_KARTE: [string, string][] = [
  ['k1-matrix', 'Vom Fragebogen zur Zeile'],
  ['k2-richtung', '1 oder 5?'],
  ['k3-boegen', 'Was trägst du ein?'],
  ['k1-filter', 'Nur bestimmte Fälle: filter()'],
  ['k2-namen', 'Codes sind Namen'],
];

export const MITNEHMEN: MitnehmenDaten = { wichtig: WICHTIG, selbstKarte: SELBST_KARTE, workshop: 'Kapitel 4' };
