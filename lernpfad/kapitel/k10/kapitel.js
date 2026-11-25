/* Kapitel 10 „Regression vertiefen“: Aufgaben, Zusatzinfos und eine eigene Schrittart für die Lernpfad-Engine.
   Wird nach daten.js geladen; die Engine ruft window.KAPITEL(hilfen) einmal auf.
   Vorlagen und Fragen kommen unverändert aus src/chapter/s10/content.ts; geprüft wird mit PRUEFEN aus bausteine.tsx. */
'use strict';
window.KAPITEL = ({ D, T, esc, bild, warum, probier, denk }) => {

/* ---------- Anpassungen an das Format der Engine (nur Darstellung, IDs bleiben) ---------- */
const ohneTicks = s => String(s).replace(/`([^`]+)`/g, '$1');
// Die Texte in content.ts zählen die Schritte ohne „Erst festlegen“. Auf dieser Seite ist „Erst festlegen“ Schritt 1,
// darum rückt jede Schrittnummer in Fragen und Hilfen um eins weiter („Schritt 2“ → „Schritt 3“).
const nr = t => (typeof t === 'string' ? t.replace(/Schritt (\d)/g, (_, n) => 'Schritt ' + (+n + 1)) : t);
/** Fragen einer Aufgabe: Schrittnummern wie auf der Seite, Möglichkeiten ohne Backticks (die Engine zeigt sie als Text),
    Verweis auf „Grundlage 4a“ wie im Reiter Verstehen. IDs, Zielwerte und Sonderfälle bleiben. */
const fragen = key => D.QUESTIONS[key].map(q => ({
  ...q,
  label: nr(q.label), help: nr(q.help), hint: nr(q.hint),
  short: q.short ? ohneTicks(q.short) : q.short,
  right: nr(q.right).replace('(Grundlage 4a)', '(Verstehen zu Aufgabe 4)'),
  ...(q.cases ? { cases: q.cases.map(c => ({ ...c, text: nr(c.text) })) } : {}),
  ...(q.wrong ? { wrong: Object.fromEntries(Object.entries(q.wrong).map(([k, v]) => [k, nr(v)])) } : {}),
  ...(q.options ? { options: q.options.map(o => ({ ...o, label: ohneTicks(o.label) })) } : {}),
}));
// Hilfe in 3 Stufen: dieselbe Verschiebung (die Engine liest D.HINTS beim Öffnen).
if (D.HINTS && !D.HINTS.__k10) { for (const k of Object.keys(D.HINTS)) D.HINTS[k] = D.HINTS[k].map(nr); Object.defineProperty(D.HINTS, '__k10', { value: true }); }
/** Festlegen mit der Auflösung aus RESOLUTIONS (erscheint, sobald alle Fragen der Aufgabe richtig sind). */
const festlegen = key => ({ ...D.PREDICTIONS[key], aufloesung: D.RESOLUTIONS[key] });

// „R meldet einen Fehler“: content.ts hat { says, plain, what, todo }, die Engine erwartet { says: Teile, helps: Teile }.
const teile = t => t.split(/`([^`]+)`/).map((x, i) => (i % 2 ? { code: x } : x)).filter(x => x !== '');
if (Array.isArray(D.ERROR_HELP) && D.ERROR_HELP.length && !D.ERROR_HELP[0].helps) {
  D.ERROR_HELP = D.ERROR_HELP.map(r => {
    const what = r.what.replace('Jede Werkstatt beginnt mit dem frischen `allbus`.', 'Jeder Block beginnt mit dem eingelesenen `allbus` und bildet seine Variablen selbst.');
    const todo = r.todo.replace('Mit „Zurücksetzen“ holst du sie zurück.', 'Fehlt etwas, kopier die Vorlage aus der Aufgabe neu.');
    return { says: r.plain ? [r.says] : [{ code: r.says }], helps: [...teile(what), ' ', ...teile(todo)] };
  });
}

/* ---------- Zusatzinfos ---------- */
const BILD = {};   // src/chapter/s10 hat keine bilder/
const RSTUDIO = warum('Lieber in RStudio?', 'Dann führst du dort vorher den Startblock aus (Pakete laden, ALLBUS einlesen). Danach kopierst du die Vorlage mit <b>Kopieren</b> in dein ⟪Skript⟫.<pre>' + esc(T.start.code) + '</pre>', 'r1');
const ZAHLEN = 'Kommazahlen schreibst du mit Punkt, ein Minus gehört mit dazu, etwa <code>-0.5</code>.';

/* ---------- Aufgaben ---------- */
const TASKS = [
  { id: 'a1', n: 1, titel: 'Eigene Lage oder Lage des Landes?', pflicht: true, grund: 'g1',
    frage: 'Hängt die Zufriedenheit mit der Demokratie an der eigenen wirtschaftlichen Lage, oder daran, wie man die Lage in Deutschland sieht?',
    ziel: 'du kannst sagen, wie stark die eigene wirtschaftliche Lage mit der Demokratiezufriedenheit zusammenhängt, einmal allein und einmal bei gleicher Einschätzung der Lage Deutschlands, und erklären, warum sich die Zahl ändert.',
    info: 'Der ALLBUS fragt, wie zufrieden man mit der Demokratie in Deutschland ist (<code>ps03</code>), wie man die eigene wirtschaftliche Lage einschätzt (<code>ep03</code>) und wie die wirtschaftliche Lage in Deutschland (<code>ep01</code>). Alle drei zählen von „sehr gut“ oder „sehr zufrieden“ nach unten. Die Vorlage polt sie um: <code>demo</code> reicht dann von 1 (sehr unzufrieden) bis 6 (sehr zufrieden), <code>lage</code> und <code>dlage</code> von 1 (sehr schlecht) bis 5 (sehr gut).',
    infoMehr: [
      warum('Warum fehlen so viele Befragte?', 'Die Demokratiefrage haben nur etwa zwei Drittel der Befragten bekommen; die anderen haben ⟪TNZ: SPLIT⟫ (kennst du aus Sitzung 1).', 'k1-variablen'),
      warum('Alle Zahlen gewichtet', 'Alle Zahlen in diesem Kapitel sind ⟪gewichtet⟫ mit <code>wghtpew</code>, genau wie die Ausgabe deiner Vorlagen (kennst du aus Sitzung 6). In der Ausgabe ist N dann die Summe der Gewichte, gerundet, nicht die Zahl der Befragten.'),
    ],
    schritte: [
      { id: 'a1-p', art: 'festlegen', titel: 'Erst festlegen', vorhersage: festlegen('a1'),
        mehr: [denk('Wie lege ich mich fest?', { grund: 'k1-alter',
          kurz: 'Du legst fest, was mit dem B der eigenen Lage passiert, sobald auch die Lage Deutschlands im Modell steht. Ein Modell mit mehreren ⟪Prädiktoren⟫ heißt <b>⟪multiple Regression⟫</b>. Es zählt nicht, ob du richtig liegst; deine Festlegung ist der Vergleichspunkt für später.',
          denken: [
            'Lies die drei Möglichkeiten.',
            'Stell dir Menschen vor, die die Lage Deutschlands gleich einschätzen: Was würdest du für den ⟪Zusammenhang⟫ der eigenen Lage erwarten?',
            'Wähl, was dir plausibel scheint; ob es passt, siehst du in Schritt 4.',
          ] })] },
      { id: 'a1-1', art: 'code', titel: 'Modell mit der eigenen Lage', wk: ['a1'], bekannt: 'linear_regression() aus Sitzung 9',
        text: 'Die Vorlage sagt die Demokratiezufriedenheit aus der eigenen Lage vorher. Lies unter <b>Coefficients</b> das B von <code>lage</code> und unter <b>Model Summary</b> R Square. Die gelbe Stelle in Zeile 9, <code>lage</code> in der Formel, ergänzt du in Schritt 3. (Der Kommentar in Zeile 2 der Vorlage sagt dazu „Schritt 2“; er zählt „Erst festlegen“ nicht mit.)',
        mehr: [denk('Was macht die Vorlage?', { grund: 'k1-variablen',
          kurz: 'Die Vorlage polt drei Variablen um, damit eine höhere Zahl „zufriedener“ bzw. „besser“ heißt: <code>demo</code> (1 bis 6), <code>lage</code> und <code>dlage</code> (1 bis 5). Dann rechnet sie <code>demo ~ lage</code>, gewichtet. <b>⟪B|regressionskoeffizient⟫</b> sagt, wie stark sich die Vorhersage mit jeder Stufe des Prädiktors ändert. <b>⟪R²⟫</b> sagt, welchen Anteil der ⟪Streuung⟫ das Modell erklärt.',
          denken: [
            'Lies <code>mutate()</code>: Welche drei ⟪Variablen⟫ entstehen, und aus welchen ALLBUS-Variablen?',
            'Schau in die Formel: <code>dlage</code> gibt es schon, steht aber noch nicht drin. Das kommt in Schritt 3.',
            'Such in der Ausgabe unter Coefficients die Zeile <code>lage</code>, Spalte B, und unter Model Summary R Square.',
            'Prüf im Kopf der Ausgabe Formula, Weights und N.',
          ],
          verwechslung: 'In der Zeile <code>lage</code> stehen mehrere Zahlen nebeneinander. Lies den Spaltenkopf, bevor du eine nimmst.',
          zusatz: 'Notier dir B und R Square gleich mit <b>+ Notiz</b>: Schritt 3 ersetzt die Ausgabe.' }),
          RSTUDIO,
          warum('Wo steht was in der Ausgabe?', 'B steht unter Coefficients in der Spalte B, in der Zeile der Variable. R Square steht unter Model Summary. Im Kopf prüfst du Formula, Weights und N.', 'r2')] },
      { id: 'a1-2', art: 'aendern', titel: 'Die Lage Deutschlands dazunehmen', neu: true,
        text: 'Notier dir zuerst B von <code>lage</code> und R Square aus Schritt 2 mit <b>+ Notiz</b>; beim erneuten Ausführen wird die Ausgabe ersetzt, und die Zahlen brauchst du in Schritt 5. Ändere dann im Journal den Block „Schritt 2: Modell mit der eigenen Lage“: Schreib in Zeile 9 hinter die gelbe Stelle <code>lage</code> noch <code>+ dlage</code>, sodass dort <code>demo ~ lage + dlage</code> steht, und führ den Block erneut aus. Lies wieder B von <code>lage</code>, dazu B von <code>dlage</code> und R Square. Prüf in der Ausgabe die Zeile „Formula“: Dort muss <code>demo ~ lage + dlage</code> stehen.',
        mehr: [
          denk('Plus oder Komma?', { grund: 'k1-formel',
            kurz: 'Du holst keine neue Vorlage, sondern änderst eine Stelle: In der Formel kommt ein Prädiktor dazu. Das <code>+</code> heißt „und dieser Prädiktor auch“. Jeder Prädiktor bekommt dann unter Coefficients seine eigene Zeile mit eigenem B.',
            denken: [
              'Hast du B von <code>lage</code> und R Square aus Schritt 2 notiert? Die neue Ausgabe ersetzt die alte.',
              'Such in Zeile 9 die gelbe Stelle <code>lage</code> und schreib dahinter <code>+ dlage</code>.',
              'Prüf nach dem Ausführen die Zeile „Formula“ und ob es unter Coefficients eine Zeile <code>dlage</code> gibt.',
              'Schau auf N: Ins Modell kommt nur, wer bei allen Variablen der Formel einen gültigen ⟪Wert⟫ hat (⟪fallweiser Ausschluss⟫).',
            ],
            verwechslung: 'Komma statt Plus: Mit <code>demo ~ lage, dlage</code> meldet R keinen Fehler, rechnet aber still nur mit <code>lage</code>.' }),
          warum('Muss ich dlage erst bilden?', 'Nein. Die Vorlage bildet <code>dlage</code> schon in <code>mutate()</code> (Zeile 7). Du änderst nur die Formel.')] },
      { id: 'a1-3', art: 'lesen', titel: 'Deuten: Was heißt die neue Zahl?',
        text: 'Vergleiche die beiden B von <code>lage</code>. Was heißt die neue Zahl, und warum ist sie anders? Dazu gibt es zwei Fragen im nächsten Schritt.',
        mehr: [
          denk('Was heißt die neue Zahl?', { grund: 'k1-alter',
            kurz: 'Im zweiten Modell steht die Lage Deutschlands mit im Modell. Den Fachbegriff dafür kennst du aus Verstehen: <b>konstant halten</b> oder <b>kontrollieren</b>. Was das für B heißt, überlegst du hier.',
            denken: [
              'Leg die beiden B von <code>lage</code> nebeneinander: Ist das zweite größer, kleiner oder etwa gleich?',
              'Frag dich, welche Menschen das zweite B vergleicht: Worin sind sie gleich, worin verschieden?',
              'Für das Warum: Öffne in Verstehen die Karte „Ein zweiter Prädiktor kann B verändern: Alter und Gesundheit“ und dort den Aufklapper „Warum sich B ändert, und wann nicht“. Welcher Fall passt zur Richtung, in die sich B bewegt hat?',
              'Notier in eigenen Worten mit <b>+ Notiz</b>, wen die neue Zahl vergleicht.',
            ],
            bild: 'AgeHealth', bildtext: 'Ein anderes Beispiel: Alter und Lebenszufriedenheit. Schalte auf „getrennt nach Gesundheit“ und vergleich die Linien mit dem Bild für alle zusammen.',
            verwechslung: '„Kontrolliert für die Lage Deutschlands“ heißt nicht, dass die Lage Deutschlands keine Rolle spielt. Sie hat ihr eigenes B.' }),
          warum('Welche der beiden Zahlen stimmt?', 'Beide. Sie beantworten verschiedene Fragen: ohne Kontrolle, wie sich Menschen insgesamt unterscheiden; mit Kontrolle, wie sie sich unterscheiden, wenn der andere Prädiktor gleich ist.', 'k1-kontrolle'),
          probier('Besser oder schlechter in einem Jahr?', 'Spielt auch eine Rolle, ob man erwartet, dass die Lage Deutschlands in einem Jahr besser oder schlechter ist? Die Vorlage nimmt <code>zukunft</code> (ep04 ⟪umgepolt⟫: höher = besser) als dritten Prädiktor dazu.', T.frei_a1.code, 'a1')] },
      { id: 'a1-4', art: 'fragen', titel: 'Ergebnis festhalten', fragen: fragen('a1'),
        mehr: [denk('Wo lese ich das ab?', { grund: 'k1-ergebnis',
          kurz: 'Du hältst vier Zahlen aus zwei Modellen fest und zwei Deutungen. Jede hat einen festen Ort: die Ausgabe aus Schritt 2, die Ausgabe nach Schritt 3 oder deinen Vergleich aus Schritt 4.',
          denken: [
            '<b>B von <code>lage</code> allein:</b> deine Notiz aus Schritt 2, Coefficients, Zeile <code>lage</code>, Spalte B.',
            '<b>B von <code>lage</code> und B von <code>dlage</code> mit beiden:</b> Ausgabe nach Schritt 3, dieselbe Spalte.',
            '<b>R Square mit beiden:</b> Model Summary in der Ausgabe nach Schritt 3.',
            '<b>Was die neue Zahl heißt und warum sie sich ändert:</b> Leg die Möglichkeiten neben deine Überlegungen aus Schritt 4.',
          ],
          verwechslung: 'Für jede Zahl gilt: erst die Zeile der Variable suchen, dann die Spalte lesen, nach der gefragt ist.' })] },
    ],
    probier: { idee: 'Spielt auch eine Rolle, ob man erwartet, dass die Lage Deutschlands in einem Jahr besser oder schlechter ist (ep04)?', code: T.frei_a1.code },
    ohneGrafik: 'Diese Aufgabe braucht keine Grafik. Alle Zahlen stehen in der Ausgabe von <code>summary()</code> unter Coefficients und Model Summary.' },

  { id: 'a2', n: 2, titel: 'Prägung oder Ort?', pflicht: true, grund: 'g2',
    frage: 'Im Osten sind die Befragten im Schnitt weniger zufrieden mit der Demokratie. Liegt das daran, wo jemand aufgewachsen ist, oder daran, wo er heute lebt?',
    ziel: 'du kannst für vier Gruppen sagen, wie weit sie von einer ⟪Referenzgruppe⟫ entfernt liegen, der Gruppe, mit der das Modell die anderen vergleicht, ob die Umgezogenen eher ihrer Herkunft oder ihrem Wohnort ähneln, und zeigen, dass ein Wechsel der Referenz die B ändert, die Vorhersagen aber nicht.',
    info: 'Die Variable <code>dg03</code> teilt die Befragten in vier Gruppen, je nachdem, wo sie ihre Jugend verbracht haben und wo sie heute befragt wurden:'
      + '<table class="daten"><caption class="sr-only">Die vier Gruppen von dg03</caption><thead><tr><th scope="col">Code</th><th scope="col">Gruppe</th><th scope="col">Dummy</th></tr></thead><tbody>'
      + '<tr><td>1</td><td>Ost-Bleibende: im Osten aufgewachsen, lebt im Osten</td><td><code>dg03_1</code></td></tr>'
      + '<tr><td>2</td><td>Ost→West: im Osten aufgewachsen, lebt im Westen</td><td><code>dg03_2</code></td></tr>'
      + '<tr><td>3</td><td>West→Ost: im Westen aufgewachsen, lebt im Osten</td><td><code>dg03_3</code></td></tr>'
      + '<tr><td>4</td><td>West-Bleibende: im Westen aufgewachsen, lebt im Westen</td><td><code>dg03_4</code></td></tr></tbody></table>'
      + '<b>Prägung:</b> Wer im Osten aufwuchs, bleibt so zufrieden oder unzufrieden wie dort, egal wo er heute lebt. Dann ähneln die Ost→West-Umgezogenen den Ost-Bleibenden. <b>Ort:</b> Es zählt, wo man heute lebt. Dann ähneln die West→Ost-Umgezogenen den Ost-Bleibenden. Die Umgezogenen sind wenige: Von den Befragten mit Demokratiefrage sind 91 von Ost nach West und 97 von West nach Ost gezogen (gezählt, nicht gewichtet).',
    infoMehr: [
      warum('Wertelabels im ALLBUS', 'Im ⟪Datensatz⟫ tragen die Gruppen diese ⟪Wertelabels⟫: O.JUGEND-O.INT. (1), O.JUGEND-W.INT. (2), W.JUGEND-O.INT. (3) und W.JUGEND-W.INT. (4). Gemeint ist: Jugend im Osten oder Westen, Interview im Osten oder Westen.'),
      warum('Die vier Gruppen als Kreuztabelle', 'Ordne die vier Gruppen wie in einer ⟪Kreuztabelle⟫: zwei Zeilen (aufgewachsen im Osten oder im Westen), zwei Spalten (lebt heute im Osten oder im Westen). Bei Prägung wären die Gruppen einer Zeile gleich, bei Ort die Gruppen einer Spalte.', 'k2-gruppen'),
    ],
    schritte: [
      { id: 'a2-p', art: 'festlegen', titel: 'Erst festlegen', vorhersage: festlegen('a2'),
        mehr: [denk('Wie lege ich mich fest?', { grund: 'k2-gruppen',
          kurz: 'Nur bei den Umgezogenen fallen Herkunft und Wohnort auseinander. Darum entscheidet sich an ihnen, welches Bild passt: <b>Prägung</b> (es zählt, wo man aufwuchs), <b>Ort</b> (es zählt, wo man heute lebt) oder keins von beiden. Es zählt nicht, ob du richtig liegst.',
          denken: [
            'Bei Prägung: Welche Umzugsgruppe müsste den Ost-Bleibenden ähneln? In der Kreuztabelle wären die Gruppen einer Zeile gleich.',
            'Bei Ort: Welche Umzugsgruppe müsste ihnen dann ähneln? Gleich wären die Gruppen einer Spalte.',
            'Überleg, was dir plausibler scheint, und wähl eine Antwort. Ob sie passt, siehst du in Schritt 5.',
          ],
          verwechslung: 'Prägung heißt: gleiche Zeile der Kreuztabelle (gleiche Herkunft). Ort heißt: gleiche Spalte (gleicher Wohnort).' })] },
      { id: 'a2-1', art: 'code', titel: 'Herkunft und Wohnort als Dummies', wk: ['a2'], neu: true,
        text: '<code>to_dummy(dg03)</code> bildet die vier Dummies, in die Formel kommen drei. <code>dg03_4</code> fehlt, also sind die West-Bleibenden die Referenz. Lies unter Coefficients die ⟪Konstante⟫ (Intercept) und die drei B. Die gelbe Stelle in Zeile 9, <code>dg03_1</code>, tauschst du in Schritt 4.',
        mehr: [denk('Warum nur drei von vier Dummies?', { grund: 'k2-dummies',
          kurz: '<code>to_dummy(dg03)</code> macht aus den vier Gruppen vier <b>⟪Dummyvariablen⟫</b>, kurz gesagt: je Gruppe eine 0/1-Variable. Ins Modell kommen nur drei. Die Gruppe, deren Dummy fehlt, ist die <b>⟪Referenzgruppe⟫</b>, der Vergleichspunkt: Die Konstante ist ihr ⟪Mittelwert⟫, und jedes B sagt, wie weit eine Gruppe von ihr entfernt liegt.',
          denken: [
            'Lies die Formel: Welcher der vier Dummies fehlt? Welche Gruppe ist damit die Referenz?',
            'Such unter Coefficients die Zeile (Intercept): Wessen Mittelwert ist das?',
            'Geh die drei Zeilen <code>dg03_1</code>, <code>dg03_2</code>, <code>dg03_3</code> durch: Zu welcher Gruppe gehört jede, und liegt sie über oder unter der Referenz?',
            'Lies die B mit Vorzeichen und notier sie dir mit <b>+ Notiz</b>; Schritt 4 ersetzt die Ausgabe.',
          ],
          bild: 'DummyTable', bildtext: 'Ein anderes Beispiel: der Familienstand mit fünf Gruppen als fünf 0/1-Variablen.',
          verwechslung: 'Lies die Zahl in der Zeile eines Dummys als Unterschied zur Referenzgruppe. Wie du daraus den Wert der Gruppe bekommst, rechnest du in Schritt 3.' }),
          RSTUDIO,
          warum('Was macht to_dummy()?', 'Es macht aus einer Variable mit Gruppen für jede Gruppe eine 0/1-Variable. <code>dg03_1</code> ist 1 für die Gruppe mit dem ⟪Code⟫ 1 (Ost-Bleibende) und 0 für alle anderen. <code>demo</code> bildet die Vorlage wie in Aufgabe 1.', 'r3')] },
      { id: 'a2-2', art: 'code', titel: 'Vorhersage für Ost→West rechnen', wk: ['a2_rechnen'], bekannt: 'R als Taschenrechner aus Sitzung 1',
        text: 'Die Vorhersage einer Gruppe ist Konstante plus B ihres Dummys. Die Vorlage rechnet noch das Beispiel aus Verstehen (im Kommentar „Grundlage 2a“): Konstante 7,042 plus B 0,652 für die Verheirateten, R gibt <code>[1] 7.694</code> aus. Tausch in Zeile 3 beide gelben Zahlen gegen die Konstante und das B von <code>dg03_2</code> aus Schritt 2 und führ den Block aus. ' + ZAHLEN,
        mehr: [denk('Wie rechne ich die Vorhersage?', { grund: 'k2-zwei',
          kurz: 'Für eine Gruppe ist die <b>⟪Vorhersage⟫</b> die Konstante plus das B ihres Dummys, denn ihr Dummy ist 1. Die Vorlage rechnet das noch für das Beispiel aus Verstehen: Im Modell <code>ls01 ~ verheiratet</code> ist 7,042 der Mittelwert der Nicht-Verheirateten, 0,652 der Unterschied der Verheirateten zu ihnen.',
          denken: [
            'Such die zwei gelben Zahlen in Zeile 3: Welche ist die Konstante, welche das B?',
            'Hol aus deiner Ausgabe von Schritt 2 die Konstante (Intercept) und das B der Gruppe Ost→West. Welcher Dummy gehört zu Ost→West?',
            'Übernimm das Vorzeichen, so wie R es zeigt.',
            'Prüf grob: Liegt die Vorhersage über oder unter der Konstante? Passt das zum Vorzeichen von B?',
          ],
          bild: 'TwoGroups', bildtext: 'Das Beispiel aus Verstehen: zwei Gruppen, die Konstante als Mittelwert der Gruppe mit 0, B als Unterschied zu ihr.',
          verwechslung: 'Prüf, ob beide gelben Stellen getauscht sind, nicht nur eine.',
          zusatz: 'Kommazahlen mit Punkt, ein Minus gehört mit dazu: Bei einem negativen B steht dort zum Beispiel <code>4.1 + -0.5</code>.' })] },
      { id: 'a2-3', art: 'aendern', titel: 'Die Referenz wechseln',
        text: 'Notier dir zuerst die Konstante und die B aus Schritt 2 und die Vorhersage aus Schritt 3 mit <b>+ Notiz</b>; beim erneuten Ausführen werden die Ausgaben ersetzt, und du brauchst sie in Schritt 6. Ändere dann im Journal den Block „Schritt 2: Herkunft und Wohnort als Dummies“: Tausch in Zeile 9 die gelbe Stelle <code>dg03_1</code> gegen <code>dg03_4</code> und führ ihn erneut aus. Jetzt fehlt <code>dg03_1</code>, die Ost-Bleibenden sind die Referenz. In der Zeile „Formula“ muss <code>demo ~ dg03_4 + dg03_2 + dg03_3</code> stehen. Lies wieder Konstante und B. Rechne dann im Block „Schritt 3: Vorhersage für Ost→West rechnen“ die Vorhersage für Ost→West noch einmal: die neue Konstante plus das neue B von <code>dg03_2</code>.',
        mehr: [denk('Was ändert sich, was nicht?', { grund: 'k2-wechsel',
          kurz: 'Du wechselst die Referenzgruppe. Damit ist jedes B der Unterschied zu einer anderen Gruppe als vorher. Und die Vorhersage für Ost→West: Was erwartest du, wenn du sie neu ausrechnest?',
          denken: [
            'Hast du Konstante, B und Vorhersage aus Schritt 2 und 3 notiert? Die neuen Ausgaben ersetzen die alten.',
            'Tausch in Zeile 9 nur <code>dg03_1</code> gegen <code>dg03_4</code>. Welche Gruppe fehlt jetzt in der Formel, wer ist also die Referenz?',
            'Prüf die Zeile „Formula“ und lies die neue Konstante und die neuen B, mit Vorzeichen.',
            'Rechne im Block aus Schritt 3 die Vorhersage für Ost→West noch einmal und vergleich sie mit der ersten.',
          ],
          bild: 'Reference', bildtext: 'Ein anderes Beispiel: der Familienstand. Schalte die Referenzgruppe um und beobachte Konstante, Pfeile und Vorhersagen.',
          verwechslung: 'Derselbe Unterschied kann mit anderer Referenz ein anderes Vorzeichen haben: Er wird dann von der anderen Seite gemessen.' })] },
      { id: 'a2-4', art: 'lesen', titel: 'Deuten: Muster und Unsicherheit',
        text: 'Welches Muster zeigen die Zahlen: Prägung, Ort oder keins von beiden? Und wie sicher sind sie? Schau bei den Umzugsgruppen auch auf das ⟪Konfidenzintervall⟫ (95% CI Lower und Upper, kennst du aus Sitzung 7). Dazu gibt es zwei Fragen im nächsten Schritt.',
        mehr: [
          denk('Woran erkenne ich das Muster?', { grund: 'k2-deuten',
            kurz: 'Mit Referenz West-Bleibende ist jedes B der Unterschied zu den West-Bleibenden. Bei Prägung läge Ost→West nah bei den Ost-Bleibenden, bei Ort läge West→Ost nah bei ihnen. Wie sicher das ist, zeigt das <b>Konfidenzintervall</b>, kurz gesagt: der Bereich, in dem der Unterschied in der Bevölkerung wohl liegt (Sitzung 7).',
            denken: [
              'Nimm die B aus Schritt 2 (Referenz West-Bleibende). Liegt das B jeder Umzugsgruppe nah am B der Ost-Bleibenden oder nah bei 0?',
              'Welches der drei Bilder aus Schritt 1 passt dazu?',
              'Lies bei den Umzugsgruppen 95% CI Lower und Upper: Schließt das Intervall 0 ein? Welche Unterschiede schließt es aus?',
              'Frag dich: Wie viele Befragte stehen hinter diesen beiden Gruppen?',
            ],
            verwechslung: 'Jedes B und jedes Intervall gilt für den Unterschied zur Referenzgruppe, nicht zu den anderen Gruppen.' }),
          probier('Wer von West nach Ost zieht, hat oft Abitur. Ändert sich das Bild, wenn du das Abitur konstant hältst?', 'Die Vorlage nimmt <code>abitur</code> als vierten Prädiktor dazu.', T.frei_a2.code, 'a2')] },
      { id: 'a2-5', art: 'fragen', titel: 'Ergebnis festhalten', fragen: fragen('a2'),
        mehr: [denk('Wo lese ich das ab?', { grund: 'k2-deuten',
          kurz: 'Die Zahlen stehen in den Ausgaben aus Schritt 2 bis 4, die beiden Deutungen kommen aus Schritt 5. Achte darauf, welche Referenz zu welcher Frage gehört.',
          denken: [
            '<b>Konstante und B der Ost-Bleibenden (Referenz West-Bleibende):</b> deine Notiz aus Schritt 2, Coefficients, Spalte B, mit Vorzeichen.',
            '<b>Vorhersage für Ost→West:</b> das Ergebnis der Taschenrechner-Vorlage aus Schritt 3.',
            '<b>Muster und Konfidenzintervalle:</b> deine Überlegungen aus Schritt 5.',
            '<b>Konstante mit Referenz Ost-Bleibende:</b> Ausgabe nach Schritt 4.',
          ],
          verwechslung: 'Achte bei jeder Frage darauf, welche Referenz gerade gilt: die aus Schritt 2 oder die aus Schritt 4.' }),
          warum('Warum steht N = 3.222 in der Ausgabe?', 'N = 3.222 ist die Summe der Gewichte. Gezählt sind es 3.254 Befragte: 1.003 Ost-Bleibende, 91 Ost→West, 97 West→Ost, 2.063 West-Bleibende. Weil der Osten im ALLBUS absichtlich stärker vertreten ist, zählen Befragte im Osten gewichtet weniger.')] },
    ],
    plenum: 'Ost→West hat mit Referenz West-Bleibende (Schritt 2) ein anderes B als mit Referenz Ost-Bleibende (Schritt 4). Welche Zahl würdet ihr in einem Zeitungsartikel nennen, und welchen Satz schreibt ihr dazu? Bringt eure Antwort mit.',
    probier: { idee: 'Wer von West nach Ost zieht, hat oft Abitur. Ändert sich das Bild, wenn du das Abitur konstant hältst?', code: T.frei_a2.code },
    ohneGrafik: 'Die vier Gruppen stehen als Tabelle oben in der Aufgabe. Alle Zahlen stehen in der Ausgabe von <code>summary()</code> unter Coefficients.' },

  { id: 'a3', n: 3, titel: 'Was wiegt mehr, und was bleibt vom Ost-West-Unterschied?', pflicht: true, grund: 'g3',
    frage: 'Welche von vier Eigenschaften hängt am stärksten mit der Demokratiezufriedenheit zusammen, und wie groß bleibt der Unterschied zwischen Ost und West, wenn die anderen drei gleich sind?',
    ziel: 'du kannst Prädiktoren mit Beta vergleichen, korrigiertes R² und VIF eines Modells lesen und sagen, wie viel vom Ost-West-Unterschied bleibt, wenn wirtschaftliche Lage und Abitur konstant gehalten werden.',
    info: 'Ins Modell kommen vier Prädiktoren: die eigene wirtschaftliche Lage (<code>lage</code>) und die Lage Deutschlands (<code>dlage</code>) aus Aufgabe 1, beide von 1 sehr schlecht bis 5 sehr gut; das Wohngebiet (<code>ost</code>: 1 Osten, 0 Westen, eine 0/1-Variable) und der Schulabschluss (<code>abitur</code>: 1 Fachhochschulreife oder Abitur, 0 ohne Abschluss, Volks- oder Hauptschule oder Mittlere Reife; „anderer Abschluss“ und „noch Schüler“ fehlen im Modell).',
    schritte: [
      { id: 'a3-p', art: 'festlegen', titel: 'Erst festlegen', vorhersage: festlegen('a3'),
        mehr: [denk('Wie lege ich mich fest?', { grund: 'k3-luecke',
          kurz: 'Der <b>Ost-West-Unterschied</b> (im Alltag oft „Ost-West-Lücke“) ist das B von <code>ost</code>: wie weit der Osten in der Demokratiezufriedenheit von der ⟪Referenzgruppe⟫ Westen entfernt liegt. Du legst fest, wie viel davon bleibt, wenn eigene Lage, Lage Deutschlands und Abitur konstant gehalten werden. Es zählt nicht, ob du richtig liegst.',
          denken: [
            'Frag dich: Unterscheiden sich Osten und Westen in diesen drei Dingen, in der eigenen Lage, im Blick auf die Lage Deutschlands, im Abitur?',
            'Und wie eng hängen diese drei mit der Demokratiezufriedenheit zusammen?',
            'Je mehr vom Ost-West-Unterschied mit diesen drei Dingen zusammenhängt, desto weniger bleibt. Wähl eine Antwort; ob sie passt, siehst du in Schritt 4.',
          ],
          verwechslung: 'Was bleibt, sagt nicht, woran der Unterschied liegt. Eine Regression zeigt Zusammenhänge, keine ⟪Ursachen⟫.' })] },
      { id: 'a3-1', art: 'code', titel: 'Modell mit vier Prädiktoren', wk: ['a3'], bekannt: '0/1-Variable mit rec() aus Sitzung 5',
        text: 'Lies unter <b>Coefficients</b> die Spalten B und Beta, unter <b>Model Summary</b> R Square und Adjusted R Square, unter <b>Collinearity Statistics</b> die VIF.',
        mehr: [denk('Wie entstehen ost und abitur?', { grund: 'k3-modell',
          kurz: 'Ins Modell kommen vier Prädiktoren. <code>lage</code> und <code>dlage</code> kennst du aus Aufgabe 1. <code>ost</code> und <code>abitur</code> macht <code>rec()</code> zu <b>0/1-Variablen</b>, kurz gesagt: 1 für die eine Gruppe, 0 für die andere. Jedes B gilt bei gleichen Werten der anderen drei; sie sind füreinander ⟪Kontrollvariablen⟫.',
          denken: [
            'Lies die beiden <code>rec()</code>-Zeilen: Wer bekommt bei <code>ost</code> die 1, wer bei <code>abitur</code>? Was macht <code>else=NA</code>?',
            'Such unter Coefficients die Spalten B und Beta nebeneinander.',
            'Such unter Model Summary R Square und Adjusted R Square, ganz unten unter Collinearity Statistics die VIF.',
            'Frag dich bei B von <code>ost</code>: Bei welchen gleichen Werten vergleicht es Osten und Westen?',
          ],
          verwechslung: 'Ein höheres R² heißt nicht, dass jeder Prädiktor etwas beiträgt. Das zeigt erst sein eigenes B mit Konfidenzintervall und ⟪Signifikanz⟫.' }),
          RSTUDIO,
          warum('Was ist Adjusted R Square?', 'Das korrigierte R², ein R² mit einer Korrektur für die Zahl der Prädiktoren. Wie die Korrektur wirkt, zeigt Verstehen.', 'k3-r2'),
          warum('Was sagt der VIF?', 'Wie sehr ein Prädiktor schon in den anderen steckt. 1 heißt: gar nicht. Wie du die Werte einordnest, überlegst du in Schritt 5.', 'k3-vif')] },
      { id: 'a3-2', art: 'lesen', titel: 'B und Beta vergleichen',
        text: 'Welcher Prädiktor hat das größte Beta? Vergleiche die Zahlen ohne Vorzeichen. Stimmt die Reihenfolge der B mit der Reihenfolge der Beta überein? Schau besonders auf <code>lage</code> und <code>abitur</code>.',
        mehr: [denk('Wie vergleiche ich B und Beta?', { grund: 'k3-beta',
          kurz: 'Der <b>standardisierte Koeffizient Beta</b> ist B, umgerechnet auf die ⟪Standardabweichung⟫.',
          denken: [
            'Geh die Spalte Beta durch und vergleich die Zahlen ohne Vorzeichen: Welcher Betrag ist der größte?',
            'Bring dann die B ohne Vorzeichen in eine Reihenfolge. Ist es dieselbe wie bei Beta?',
            'Schau auf <code>lage</code> und <code>abitur</code>: Welches B ist größer, welches Beta?',
          ],
          bild: 'BetaRuler', bildtext: 'Ein anderes Beispiel: Alter in Jahren und Gesundheit in Stufen, beide auf dasselbe Lineal gebracht.',
          verwechslung: 'B und Beta stehen nebeneinander. Lies den Spaltenkopf, bevor du vergleichst.' })] },
      { id: 'a3-3', art: 'code', titel: 'Der Ost-West-Unterschied allein', wk: ['a3_ost'],
        text: 'Zum Vergleich rechnet die zweite Vorlage <code>ost</code> ohne weitere Prädiktoren. Ihr B heißt ⟪Bruttoeffekt⟫: der Unterschied, den du siehst, wenn du nichts anderes berücksichtigst. Das B von <code>ost</code> aus Schritt 2 heißt ⟪Nettoeffekt⟫: der Unterschied, der bei gleicher Lage und gleichem Abitur bleibt. Führ die Vorlage aus und vergleiche die beiden.',
        mehr: [
          denk('Wie vergleiche ich die beiden B?', { grund: 'k3-luecke',
            kurz: 'Die zweite Vorlage rechnet <code>ost</code> allein: Ihr B ist der <b>Bruttoeffekt</b>, der Ost-West-Unterschied insgesamt, so wie die Menschen sind. Das B aus Schritt 2 ist der <b>Nettoeffekt</b>, der Unterschied bei gleicher Lage und gleichem Abitur. Der Anteil, der bleibt, ist Nettoeffekt ÷ Bruttoeffekt.',
            denken: [
              'Lies in der Ausgabe der zweiten Vorlage B von <code>ost</code>.',
              'Nimm B von <code>ost</code> aus Schritt 2 dazu.',
              'Teil den Nettoeffekt (B mit Kontrollen) durch den Bruttoeffekt (B ohne Kontrollen). Zum Beispiel: −0,3 ÷ −0,9 ≈ 0,33, dann bliebe ein Drittel.',
              'Je näher das Ergebnis an 1 liegt, desto weniger hängt der Ost-West-Unterschied an Lage und Abitur. Vergleich mit deiner Festlegung aus Schritt 1.',
            ],
            verwechslung: 'Beide B stimmen. Sie beantworten verschiedene Fragen: insgesamt, oder bei gleicher Lage und gleichem Abitur.',
            zusatz: ZAHLEN + ' Du kannst den Bruch mit R als Taschenrechner ausrechnen.' }),
          probier('Wie viel trägt die Lage Deutschlands?', 'Nimm sie heraus und vergleiche R², korrigiertes R² und die übrigen B.', T.frei_a3.code, 'a3')] },
      { id: 'a3-4', art: 'fragen', titel: 'Ergebnis festhalten', fragen: fragen('a3'),
        mehr: [denk('Wo lese ich das ab?', { grund: 'k3-luecke',
          kurz: 'Fast alles steht in der Ausgabe aus Schritt 2, nur B von <code>ost</code> allein steht in der Ausgabe aus Schritt 4.',
          denken: [
            '<b>Größtes Beta und Beta von <code>lage</code>:</b> Ausgabe aus Schritt 2, Spalte Beta, ohne Vorzeichen vergleichen.',
            '<b>Welcher Satz über B und Beta stimmt:</b> dein Vergleich aus Schritt 3.',
            '<b>Korrigiertes R² und VIF:</b> Model Summary, Zeile Adjusted R Square; ganz unten Collinearity Statistics, Spalte VIF. Wie man den VIF liest, steht in Verstehen auf der Karte „Zwei Prädiktoren, die fast dasselbe sagen: Multikollinearität“.',
            '<b>B von <code>ost</code> allein:</b> Ausgabe aus Schritt 4.',
          ],
          verwechslung: 'B und Beta stehen nebeneinander. Für die Fragen nach Beta zählt nur die Spalte Beta.' })] },
    ],
    probier: { idee: 'Wie viel trägt die Lage Deutschlands? Nimm sie heraus und vergleiche R², korrigiertes R² und die übrigen B.', code: T.frei_a3.code },
    ohneGrafik: 'Diese Aufgabe hat keine Grafik. Alle Zahlen stehen in den Ausgaben der beiden Vorlagen.' },

  { id: 'a4', n: 4, titel: 'Ist der Ost-West-Unterschied mit Abitur kleiner?', pflicht: false, grund: 'g4',
    frage: 'Sind Befragte mit Abitur im Osten ähnlich zufrieden mit der Demokratie wie im Westen, oder gilt der Ost-West-Unterschied für beide gleich?',
    ziel: 'du kannst eine Interaktion rechnen und lesen, den Ost-West-Unterschied für Befragte mit und ohne Abitur ausrechnen und begründen, ob er verschieden groß ist. Dazu kannst du sagen, warum kleine Gruppen vorsichtig machen.',
    info: 'In Aufgabe 3 hast du gesehen, wie viel vom Ost-West-Unterschied bleibt, wenn Lage und Abitur gleich sind: den ⟪Nettoeffekt⟫. Das sagt aber noch nicht, ob der Unterschied bei Befragten mit und ohne Abitur gleich groß ist. Das prüft eine Interaktion.',
    schritte: [
      { id: 'a4-p', art: 'festlegen', titel: 'Erst festlegen', vorhersage: festlegen('a4'),
        mehr: [denk('Wie lege ich mich fest?', { grund: 'k4-interaktion',
          kurz: 'Du legst fest, ob sich Osten und Westen unter Befragten mit Abitur anders unterscheiden als unter denen ohne. Gilt ein Unterschied nicht für alle gleich, heißt das <b>Interaktion</b>, kurz gesagt: Der Unterschied, den der eine Prädiktor macht, hängt vom anderen ab. Es zählt nicht, ob du richtig liegst.',
          denken: [
            'Stell dir zwei Vergleiche vor: Osten gegen Westen bei Befragten ohne Abitur, und Osten gegen Westen bei Befragten mit Abitur.',
            'Frag dich: Gibt es einen Grund, warum der Unterschied in der einen Gruppe größer oder kleiner sein sollte als in der anderen?',
            'Wähl eine Antwort. Ob sie passt, siehst du in Schritt 4 und 5.',
          ],
          verwechslung: 'Interaktion heißt nicht, dass Wohngebiet und Abitur miteinander zusammenhängen. Es heißt: Der Ost-West-Unterschied ist je nach Abitur verschieden groß.' })] },
      { id: 'a4-1', art: 'code', titel: 'Ein Unterschied für alle', wk: ['a4'],
        text: 'Die Vorlage rechnet <code>demo ~ ost + abitur</code>: ein Ost-West-Unterschied für alle. Lies B von <code>ost</code>. Die gelbe Stelle in Zeile 9, das Plus zwischen <code>ost</code> und <code>abitur</code>, tauschst du in Schritt 3.',
        mehr: [denk('Was macht die Vorlage?', { grund: 'k4-interaktion',
          kurz: 'Mit <code>+</code> zwischen <code>ost</code> und <code>abitur</code> nimmt das Modell an, dass sich Osten und Westen mit und ohne Abitur gleich stark unterscheiden: ein B von <code>ost</code> für alle. Ob das stimmt, prüft erst das Modell mit <code>*</code> in Schritt 3.',
          denken: [
            'Lies <code>mutate()</code>: <code>demo</code>, <code>ost</code> und <code>abitur</code> entstehen wie in Aufgabe 1 und 3.',
            'Lies die Formel: Wie viele B erwartest du unter Coefficients, außer der Konstante?',
            'Such die Zeile <code>ost</code>, Spalte B: Das ist der eine Ost-West-Unterschied für alle, bei gleichem Abitur.',
            'Notier dir dieses B mit <b>+ Notiz</b>: Schritt 3 ersetzt die Ausgabe.',
          ],
          verwechslung: 'B von <code>ost</code> ist hier kein Wert für Befragte mit oder ohne Abitur, sondern ein Unterschied, den das Modell für beide gleich annimmt.' }),
          RSTUDIO] },
      { id: 'a4-2', art: 'aendern', titel: 'Plus gegen Sternchen tauschen', neu: true,
        text: 'Notier dir zuerst B von <code>ost</code> aus Schritt 2 mit <b>+ Notiz</b>; beim erneuten Ausführen wird die Ausgabe ersetzt. Ändere dann im Journal den Block „Schritt 2: Ein Unterschied für alle“: Tausch in Zeile 9 das gelbe <code>+</code> gegen <code>*</code> und führ den Block erneut aus. Jetzt gibt es eine Zeile <code>ost:abitur</code>. Lies B, ⟪Sig.|p-wert⟫ und das Konfidenzintervall dieser Zeile, dazu das neue B von <code>ost</code>.',
        mehr: [denk('Was heißt * in der Formel?', { grund: 'k4-stern',
          kurz: '<code>ost * abitur</code> heißt: beide Prädiktoren und dazu ihre <b>Interaktion</b>. Die Zeile mit dem Doppelpunkt sagt, um wie viel B von <code>ost</code> für Befragte mit Abitur anders ist. Das B von <code>ost</code> selbst steht dann nur noch für die Befragten mit <code>abitur</code> = 0.',
          denken: [
            'Hast du B von <code>ost</code> aus Schritt 2 notiert? Dann tausch in Zeile 9 nur das gelbe <code>+</code> gegen <code>*</code>.',
            'Prüf nach dem Ausführen: Gibt es unter Coefficients eine Zeile <code>ost:abitur</code>?',
            'Lies in dieser Zeile drei Dinge: B, Sig. und das Konfidenzintervall (95% CI Lower und Upper).',
            'Lies dazu das neue B von <code>ost</code>: Für wen gilt es jetzt?',
          ],
          bild: 'InteractionPlot', bildtext: 'Ein anderes Beispiel: Erwerbstätigkeit und Alter ab 60. Der Unterschied zwischen Erwerbstätigen und Nicht-Erwerbstätigen hängt vom Alter ab.',
          verwechslung: '<code>*</code> in der Formel heißt nicht, dass du B malnimmst, sondern: beide Prädiktoren und ihre Interaktion.' })] },
      { id: 'a4-3', art: 'code', titel: 'Den Unterschied mit Abitur rechnen', wk: ['a4_rechnen'],
        text: 'Der Ost-West-Unterschied mit Abitur ist B von <code>ost</code> plus B von <code>ost:abitur</code>; B von <code>ost</code> ist jetzt der Unterschied ohne Abitur. Die Vorlage rechnet noch das Beispiel aus Verstehen (im Kommentar „Grundlage 4b“), den Unterschied der Erwerbstätigen ab 60; R gibt <code>[1] 0.056</code> aus. Tausch in Zeile 3 beide gelben Zahlen gegen B von <code>ost</code> und B von <code>ost:abitur</code> aus Schritt 3. ' + ZAHLEN,
        mehr: [denk('Wie rechne ich den Unterschied mit Abitur?', { grund: 'k4-rechnen',
          kurz: 'Mit Interaktion ergibt sich der Unterschied für die zweite Gruppe aus <b>B des Prädiktors plus B der Interaktion</b>. Die Vorlage rechnet das noch für das Beispiel aus Verstehen: Im Modell <code>ls01 ~ erwerb * ab60</code> ist 1,091 der Unterschied der Erwerbstätigen unter 60, −1,035 sagt, um wie viel er ab 60 anders ist.',
          denken: [
            'Such die zwei gelben Zahlen in Zeile 3: Welche ist B des Prädiktors, welche B der Interaktion?',
            'Hol aus der Ausgabe nach Schritt 3 B von <code>ost</code> und B von <code>ost:abitur</code>, beide mit dem Vorzeichen, das R zeigt.',
            'Tausch sie ein und führ den Block aus.',
            'Vergleich das Ergebnis mit B von <code>ost</code> nach Schritt 3, dem Unterschied ohne Abitur: Wie weit liegen die beiden auseinander?',
          ],
          verwechslung: 'Nimm B von <code>ost</code> aus dem Modell mit <code>*</code> (Schritt 3), nicht das aus Schritt 2 mit <code>+</code>.',
          zusatz: ZAHLEN })] },
      { id: 'a4-4', art: 'lesen', titel: 'Deuten: Ist der Unterschied anders?',
        text: 'Ist der Ost-West-Unterschied mit Abitur anders? Und: In Aufgabe 2 beruhten zwei Gruppen auf 91 und 97 Befragten. Was folgt daraus für ihre B? Dazu gibt es zwei Fragen im nächsten Schritt.',
        mehr: [
          denk('Was sagt die Zeile mit dem Doppelpunkt?', { grund: 'k4-deuten',
            kurz: 'Die Antwort auf die erste Frage steht in der Zeile <code>ost:abitur</code>, aber nicht in einer Zahl allein: B, Sig. und das <b>Konfidenzintervall</b> gehören zusammen (kennst du aus Sitzung 7). Die zweite Frage dreht sich um kleine Gruppen.',
            denken: [
              'Lies das Konfidenzintervall der Zeile: Von wo bis wo reicht es?',
              'Lies Sig. in derselben Zeile und erinner dich, was der Wert aussagt und was nicht (Sitzung 7).',
              'Leg B von <code>ost:abitur</code> neben B von <code>ost</code>.',
              'Für die zweite Frage: Wie viele Befragte standen in Aufgabe 2 hinter Ost→West, verglichen mit den anderen Gruppen? Was zeigt das Bild über einzelne ⟪Fälle⟫?',
            ],
            bild: 'EinflussErklaert', bildtext: 'Ein anderes Beispiel mit zwölf Befragten: Person L in vier Zuständen zum Durchschalten.',
            verwechslung: 'Sig. und Konfidenzintervall stehen in derselben Zeile wie B. Lies sie zusammen, nicht einzeln.' }),
          warum('Was haben kleine Gruppen damit zu tun?', 'Schau dir das Bild mit Person L an: Schalte die vier Zustände durch. Überleg dann, was das für eine Gruppe mit nur 91 Befragten heißt.', 'k4-einfluss'),
          probier('Ist der Ost-West-Unterschied bei Menschen, die sich politisch links einstufen, anders?', '<code>links</code>: <code>pa01</code> 1 bis 4 = links, 5 bis 10 = Mitte oder rechts.', T.frei_a4.code, 'a4')] },
      { id: 'a4-5', art: 'fragen', titel: 'Ergebnis festhalten', fragen: fragen('a4'),
        mehr: [denk('Wo lese ich das ab?', { grund: 'k4-deuten',
          kurz: 'Die Zahlen stehen in der Ausgabe nach Schritt 3 und in deiner Rechnung aus Schritt 4; die beiden Deutungen kommen aus Schritt 5.',
          denken: [
            '<b>B von <code>ost:abitur</code>:</b> Ausgabe nach Schritt 3, Spalte B.',
            '<b>Ost-West-Unterschied mit Abitur:</b> das Ergebnis der Taschenrechner-Vorlage aus Schritt 4.',
            '<b>Was die Zeile <code>ost:abitur</code> sagt:</b> B, Sig. und Konfidenzintervall zusammen, wie in Schritt 5.',
            '<b>Was kleine Gruppen bedeuten:</b> deine Überlegung aus Schritt 5 zu den 91 Ost→West-Umgezogenen.',
          ],
          verwechslung: 'Neben B steht Beta. Für die Zahl der Interaktion zählt die Spalte B.' })] },
    ],
    plenum: 'Zwei Sätze zur Wahl: „Mit und ohne Abitur ist der Ost-West-Unterschied gleich groß.“ und „Wir finden keinen Hinweis, dass der Ost-West-Unterschied mit Abitur anders ist.“ Welcher passt zu den Daten, und warum ist der Unterschied wichtig? Zum Vergleich: Rechne die Probier-Idee mit der Links-rechts-Einstufung und schau, ob dort die Zeile mit dem Doppelpunkt signifikant ist.',
    probier: { idee: 'Ist der Ost-West-Unterschied bei Menschen, die sich politisch links einstufen, anders?', code: T.frei_a4.code },
    ohneGrafik: 'Diese Aufgabe hat keine Grafik. Die Zahlen stehen in der Ausgabe der Vorlage, einmal mit <code>+</code> und einmal mit <code>*</code>.' },
];

const FREI = {
  a1: [
    { stufe: 'Erweitern', text: 'Spielt auch eine Rolle, ob man erwartet, dass die wirtschaftliche Lage Deutschlands in einem Jahr besser oder schlechter ist (ep04)?', tipp: '<code>ep04</code> zählt von 1 „wesentlich besser“ bis 5 „wesentlich schlechter“; umgepolt heißt eine höhere Zahl „besser“. Ergänze in <code>mutate()</code> die Zeile <code>zukunft = rec(ep04, rules = "rev")</code> und in der Formel <code>+ zukunft</code>. Was passiert mit den B von <code>lage</code> und <code>dlage</code>?' },
    { stufe: 'Abwandeln', text: 'Tausch die Reihenfolge der Prädiktoren: demo ~ dlage + lage. Ändert sich etwas?', tipp: 'Vergleiche B und R Square mit Schritt 3. Warum das so ist, steht in „Vorweg: R lesen“ unter „Plus in der Formel“.' },
    { stufe: 'Eigene Frage', text: 'Hängt die Demokratiezufriedenheit auch mit dem Alter zusammen, bei gleicher Einschätzung von eigener Lage und Lage Deutschlands?', tipp: '<code>age</code> kommt direkt in die Formel: <code>demo ~ lage + dlage + age</code>. Für deinen Satz hilft das Satzmuster im Überblick von „Verstehen“.' },
  ],
  a2: [
    { stufe: 'Erweitern', text: 'Wer von West nach Ost zieht, hat oft Abitur. Ändert sich das Bild, wenn du das Abitur konstant hältst?', tipp: 'Bilde <code>abitur</code> wie in Aufgabe 3 und nimm es als vierten Prädiktor dazu: <code>demo ~ dg03_1 + dg03_2 + dg03_3 + abitur</code>.' },
    { stufe: 'Abwandeln', text: 'Nimm die Ost→West-Umgezogenen als Referenz.', tipp: 'Lass <code>dg03_2</code> in der Formel weg und nimm dafür die drei anderen Dummies. Welche Zahlen ändern sich, welche Vorhersagen bleiben?' },
    { stufe: 'Eigene Frage', text: 'Was passiert, wenn du alle vier Dummies in die Formel schreibst?', tipp: 'Lies die Meldung über der Ausgabe genau. Das Stichwort ist die ⟪Dummyfalle⟫.' },
  ],
  a3: [
    { stufe: 'Abwandeln', text: 'Wie viel trägt die Lage Deutschlands? Nimm sie heraus und vergleiche R², korrigiertes R² und die übrigen B.', tipp: 'Streich <code>dlage</code> in der Formel. Schau besonders auf B von <code>lage</code>: Erinnert es dich an Aufgabe 1?' },
    { stufe: 'Erweitern', text: 'Nimm das Alter als fünften Prädiktor dazu. Wo steht es in der Reihenfolge der Beta?', tipp: '<code>age</code> kommt direkt in die Formel. Vergleiche Beta ohne Vorzeichen, und schau auch auf die VIF.' },
    { stufe: 'Eigene Frage', text: 'Was passiert mit dem Nettoeffekt von ost, wenn du zusätzlich das Vertrauen in den Bundestag kontrollierst?', tipp: '<code>pt03</code> (Vertrauen in den Bundestag, 1 gar kein bis 7 großes Vertrauen) kommt direkt in die Formel; N wird etwas kleiner. Überleg vorher, ob man das kontrollieren sollte: „Was du kontrollierst“ im Überblick von „Verstehen“ hilft dabei.' },
  ],
  a4: [
    { stufe: 'Abwandeln', text: 'Ist der Ost-West-Unterschied bei Menschen, die sich politisch links einstufen, anders?', tipp: 'Bilde <code>links = rec(pa01, rules = "1:4=1 [links]; 5:10=0 [Mitte oder rechts]; else=NA")</code> und rechne <code>demo ~ ost * links</code>. Lies die Zeile <code>ost:links</code>.' },
    { stufe: 'Erweitern', text: 'Rechne den Ost-West-Unterschied für die links Eingestuften aus.', tipp: 'Wie in Schritt 4: B von <code>ost</code> plus B von <code>ost:links</code>, mit R als Taschenrechner.' },
    { stufe: 'Eigene Frage', text: 'Hängt die eigene Lage im Osten genauso mit der Demokratiezufriedenheit zusammen wie im Westen?', tipp: 'Ergänze in <code>mutate()</code> der Vorlage die Zeile <code>lage = rec(ep03, rules = "rev")</code> wie in Aufgabe 1 und rechne <code>demo ~ lage * ost</code>. Die Zeile <code>lage:ost</code> sagt, um wie viel B der Lage im Osten anders ist.' },
  ],
};

/* ---------- Eigene Schrittart: Code im Journal ändern (ohne eigene Vorlage) ---------- */
/** Der Text sagt, was im Journal zu ändern ist; der Haken meldet den Schritt als erledigt (sonst bliebe er immer offen). */
function aendern(s, H) {
  const lab = document.createElement('label'); lab.className = 'erledigt';
  lab.innerHTML = `<input type="checkbox" ${H.S.fertig[s.id] ? 'checked' : ''}> Im Journal geändert und ausgeführt`;
  lab.querySelector('input').onchange = e => H.fertig(s.id, e.target.checked);
  return lab;
}

return { BILD, TASKS, FREI, typen: { aendern } };
};
