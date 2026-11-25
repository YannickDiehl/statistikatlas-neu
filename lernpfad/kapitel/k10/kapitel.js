/* Kapitel 10 „Regression vertiefen“: Aufgaben, Zusatzinfos und eine eigene Schrittart für die Lernpfad-Engine.
   Wird nach daten.js geladen; die Engine ruft window.KAPITEL(hilfen) einmal auf.
   Vorlagen und Fragen kommen unverändert aus src/chapter/s10/content.ts; geprüft wird mit PRUEFEN aus bausteine.tsx. */
'use strict';
window.KAPITEL = ({ D, T, esc, bild, warum, probier }) => {

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
const RSTUDIO = warum('Lieber in RStudio?', 'Dann führst du dort vorher den Startblock aus (Pakete laden, ALLBUS einlesen). Danach kopierst du die Vorlage mit <b>Kopieren</b> in dein Skript.<pre>' + esc(T.start.code) + '</pre>', 'r1');
const ZAHLEN = 'Kommazahlen schreibst du mit Punkt, ein Minus gehört mit dazu, etwa <code>-0.5</code>.';

/* ---------- Aufgaben ---------- */
const TASKS = [
  { id: 'a1', n: 1, titel: 'Eigene Lage oder Lage des Landes?', pflicht: true, grund: 'g1',
    frage: 'Hängt die Zufriedenheit mit der Demokratie an der eigenen wirtschaftlichen Lage, oder daran, wie man die Lage in Deutschland sieht?',
    ziel: 'du kannst sagen, wie stark die eigene wirtschaftliche Lage mit der Demokratiezufriedenheit zusammenhängt, einmal allein und einmal bei gleicher Einschätzung der Lage Deutschlands, und erklären, warum sich die Zahl ändert.',
    info: 'Der ALLBUS fragt, wie zufrieden man mit der Demokratie in Deutschland ist (<code>ps03</code>), wie man die eigene wirtschaftliche Lage einschätzt (<code>ep03</code>) und wie die wirtschaftliche Lage in Deutschland (<code>ep01</code>). Alle drei zählen von „sehr gut“ oder „sehr zufrieden“ nach unten. Die Vorlage polt sie um: <code>demo</code> reicht dann von 1 (sehr unzufrieden) bis 6 (sehr zufrieden), <code>lage</code> und <code>dlage</code> von 1 (sehr schlecht) bis 5 (sehr gut).',
    infoMehr: [
      warum('Warum fehlen so viele Befragte?', 'Die Demokratiefrage haben nur etwa zwei Drittel der Befragten bekommen; die anderen haben TNZ: SPLIT (kennst du aus Sitzung 1).', 'k1-variablen'),
      warum('Alle Zahlen gewichtet', 'Alle Zahlen in diesem Kapitel sind gewichtet mit <code>wghtpew</code>, genau wie die Ausgabe deiner Vorlagen (kennst du aus Sitzung 6). In der Ausgabe ist N dann die Summe der Gewichte, gerundet, nicht die Zahl der Befragten.'),
    ],
    schritte: [
      { id: 'a1-p', art: 'festlegen', titel: 'Erst festlegen', vorhersage: festlegen('a1') },
      { id: 'a1-1', art: 'code', titel: 'Modell mit der eigenen Lage', wk: ['a1'], bekannt: 'linear_regression() aus Sitzung 9',
        text: 'Die Vorlage sagt die Demokratiezufriedenheit aus der eigenen Lage vorher. Lies unter <b>Coefficients</b> das B von <code>lage</code> und unter <b>Model Summary</b> R Square. Die gelbe Stelle in Zeile 9, <code>lage</code> in der Formel, ergänzt du in Schritt 3. (Der Kommentar in Zeile 2 der Vorlage sagt dazu „Schritt 2“; er zählt „Erst festlegen“ nicht mit.)',
        mehr: [RSTUDIO,
          warum('Was macht rec(…, rules = "rev")?', 'Umpolen kennst du aus Sitzung 5: Aus 1 wird die höchste Stufe und umgekehrt. Danach heißt eine höhere Zahl „zufriedener“ bzw. „besser“. <code>dlage</code> bildet die Vorlage schon jetzt; du brauchst es in Schritt 3.', 'k1-variablen'),
          warum('Wo steht was in der Ausgabe?', 'B steht unter Coefficients in der Spalte B, in der Zeile der Variable. R Square steht unter Model Summary. Im Kopf prüfst du Formula, Weights und N.', 'r2')] },
      { id: 'a1-2', art: 'aendern', titel: 'Die Lage Deutschlands dazunehmen', neu: true,
        text: 'Notier dir zuerst B von <code>lage</code> und R Square aus Schritt 2 mit <b>+ Notiz</b>; beim erneuten Ausführen wird die Ausgabe ersetzt, und die Zahlen brauchst du in Schritt 5. Ändere dann im Journal den Block „Schritt 2: Modell mit der eigenen Lage“: Schreib in Zeile 9 hinter die gelbe Stelle <code>lage</code> noch <code>+ dlage</code>, sodass dort <code>demo ~ lage + dlage</code> steht, und führ den Block erneut aus. Lies wieder B von <code>lage</code>, dazu B von <code>dlage</code> und R Square. Prüf in der Ausgabe die Zeile „Formula“: Dort muss <code>demo ~ lage + dlage</code> stehen.',
        mehr: [
          warum('Plus oder Komma?', 'Das <code>+</code> in der Formel heißt „und dieser Prädiktor auch“. Mit Komma (<code>demo ~ lage, dlage</code>) meldet R keinen Fehler, rechnet aber still nur mit <code>lage</code>. Darum die Zeile „Formula“ prüfen.', 'k1-formel'),
          warum('Muss ich dlage erst bilden?', 'Nein. Die Vorlage bildet <code>dlage</code> schon in <code>mutate()</code> (Zeile 7). Du änderst nur die Formel.')] },
      { id: 'a1-3', art: 'lesen', titel: 'Deuten: Was heißt die neue Zahl?',
        text: 'Vergleiche die beiden B von <code>lage</code>. Was heißt die neue Zahl, und warum ist sie anders? Dazu gibt es zwei Fragen im nächsten Schritt.',
        mehr: [
          warum('Was heißt „bei gleicher …“?', 'In einem Modell mit mehreren Prädiktoren gilt jedes B bei gleichen Werten der anderen Prädiktoren. Das Modell vergleicht Menschen, die sich nur in diesem einen Prädiktor unterscheiden.', 'k1-alter'),
          warum('Welche der beiden Zahlen stimmt?', 'Beide. Sie beantworten verschiedene Fragen: ohne Kontrolle, wie sich Menschen insgesamt unterscheiden; mit Kontrolle, wie sie sich unterscheiden, wenn der andere Prädiktor gleich ist.', 'k1-kontrolle'),
          probier('Besser oder schlechter in einem Jahr?', 'Spielt auch eine Rolle, ob man erwartet, dass die Lage Deutschlands in einem Jahr besser oder schlechter ist? Die Vorlage nimmt <code>zukunft</code> (ep04 umgepolt: höher = besser) als dritten Prädiktor dazu.', T.frei_a1.code, 'a1')] },
      { id: 'a1-4', art: 'fragen', titel: 'Ergebnis festhalten', fragen: fragen('a1') },
    ],
    probier: { idee: 'Spielt auch eine Rolle, ob man erwartet, dass die Lage Deutschlands in einem Jahr besser oder schlechter ist (ep04)?', code: T.frei_a1.code },
    ohneGrafik: 'Diese Aufgabe braucht keine Grafik. Alle Zahlen stehen in der Ausgabe von <code>summary()</code> unter Coefficients und Model Summary.' },

  { id: 'a2', n: 2, titel: 'Prägung oder Ort?', pflicht: true, grund: 'g2',
    frage: 'Im Osten sind die Befragten im Schnitt weniger zufrieden mit der Demokratie. Liegt das daran, wo jemand aufgewachsen ist, oder daran, wo er heute lebt?',
    ziel: 'du kannst für vier Gruppen sagen, wie weit sie von einer Referenzgruppe entfernt liegen, ob die Umgezogenen eher ihrer Herkunft oder ihrem Wohnort ähneln, und zeigen, dass ein Wechsel der Referenz die B ändert, die Vorhersagen aber nicht.',
    info: 'Die Variable <code>dg03</code> teilt die Befragten in vier Gruppen, je nachdem, wo sie ihre Jugend verbracht haben und wo sie heute befragt wurden:'
      + '<table class="daten"><caption class="sr-only">Die vier Gruppen von dg03</caption><thead><tr><th scope="col">Code</th><th scope="col">Gruppe</th><th scope="col">Dummy</th></tr></thead><tbody>'
      + '<tr><td>1</td><td>Ost-Bleibende: im Osten aufgewachsen, lebt im Osten</td><td><code>dg03_1</code></td></tr>'
      + '<tr><td>2</td><td>Ost→West: im Osten aufgewachsen, lebt im Westen</td><td><code>dg03_2</code></td></tr>'
      + '<tr><td>3</td><td>West→Ost: im Westen aufgewachsen, lebt im Osten</td><td><code>dg03_3</code></td></tr>'
      + '<tr><td>4</td><td>West-Bleibende: im Westen aufgewachsen, lebt im Westen</td><td><code>dg03_4</code></td></tr></tbody></table>'
      + '<b>Prägung:</b> Wer im Osten aufwuchs, bleibt so zufrieden oder unzufrieden wie dort, egal wo er heute lebt. Dann ähneln die Ost→West-Umgezogenen den Ost-Bleibenden. <b>Ort:</b> Es zählt, wo man heute lebt. Dann ähneln die West→Ost-Umgezogenen den Ost-Bleibenden. Die Umgezogenen sind wenige: Von den Befragten mit Demokratiefrage sind 91 von Ost nach West und 97 von West nach Ost gezogen (gezählt, nicht gewichtet).',
    infoMehr: [
      warum('Wertelabels im ALLBUS', 'Im Datensatz heißen die Gruppen O.JUGEND-O.INT. (1), O.JUGEND-W.INT. (2), W.JUGEND-O.INT. (3) und W.JUGEND-W.INT. (4): Jugend im Osten oder Westen, Interview im Osten oder Westen.'),
      warum('Die vier Gruppen als Raster', 'Zwei Zeilen (aufgewachsen im Osten oder im Westen), zwei Spalten (lebt heute im Osten oder im Westen). Bei Prägung wären die Gruppen einer Zeile gleich, bei Ort die Gruppen einer Spalte.', 'k2-gruppen'),
    ],
    schritte: [
      { id: 'a2-p', art: 'festlegen', titel: 'Erst festlegen', vorhersage: festlegen('a2') },
      { id: 'a2-1', art: 'code', titel: 'Herkunft und Wohnort als Dummies', wk: ['a2'], neu: true,
        text: '<code>to_dummy(dg03)</code> bildet die vier Dummies, in die Formel kommen drei. <code>dg03_4</code> fehlt, also sind die West-Bleibenden die Referenz. Lies unter Coefficients die Konstante (Intercept) und die drei B. Die gelbe Stelle in Zeile 9, <code>dg03_1</code>, tauschst du in Schritt 4.',
        mehr: [RSTUDIO,
          warum('Was macht to_dummy()?', 'Es macht aus einer Variable mit Gruppen für jede Gruppe eine 0/1-Variable. <code>dg03_1</code> ist 1 für die Gruppe mit dem Code 1 (Ost-Bleibende) und 0 für alle anderen. <code>demo</code> bildet die Vorlage wie in Aufgabe 1.', 'r3'),
          warum('Warum nur drei von vier Dummies?', 'Die Gruppe, deren Dummy in der Formel fehlt, ist die Referenz. Die Konstante ist ihr Mittelwert, jedes B der Abstand einer Gruppe zu ihr. Alle vier zusammen sagen nichts Neues (Dummyfalle).', 'k2-dummies')] },
      { id: 'a2-2', art: 'code', titel: 'Vorhersage für Ost→West rechnen', wk: ['a2_rechnen'], bekannt: 'R als Taschenrechner aus Sitzung 1',
        text: 'Die Vorhersage einer Gruppe ist Konstante plus B ihres Dummys. Die Vorlage rechnet noch das Beispiel aus Verstehen (im Kommentar „Grundlage 2a“): Konstante 7,042 plus B 0,652 für die Verheirateten, R gibt <code>[1] 7.694</code> aus. Tausch in Zeile 3 beide gelben Zahlen gegen die Konstante und das B von <code>dg03_2</code> aus Schritt 2 und führ den Block aus. ' + ZAHLEN,
        mehr: [warum('Woher kommt das Beispiel?', 'Im Modell <code>ls01 ~ verheiratet</code> ist die Konstante 7,042 der Mittelwert der Nicht-Verheirateten, B 0,652 der Abstand der Verheirateten. Konstante plus B ergibt 7,694, den Mittelwert der Verheirateten.', 'k2-zwei')] },
      { id: 'a2-3', art: 'aendern', titel: 'Die Referenz wechseln',
        text: 'Notier dir zuerst die Konstante und die B aus Schritt 2 und die Vorhersage aus Schritt 3 mit <b>+ Notiz</b>; beim erneuten Ausführen werden die Ausgaben ersetzt, und du brauchst sie in Schritt 6. Ändere dann im Journal den Block „Schritt 2: Herkunft und Wohnort als Dummies“: Tausch in Zeile 9 die gelbe Stelle <code>dg03_1</code> gegen <code>dg03_4</code> und führ ihn erneut aus. Jetzt fehlt <code>dg03_1</code>, die Ost-Bleibenden sind die Referenz. In der Zeile „Formula“ muss <code>demo ~ dg03_4 + dg03_2 + dg03_3</code> stehen. Lies wieder Konstante und B. Rechne dann im Block „Schritt 3: Vorhersage für Ost→West rechnen“ die Vorhersage für Ost→West noch einmal: die neue Konstante plus das neue B von <code>dg03_2</code>.',
        mehr: [warum('Was ändert sich, was nicht?', 'Mit der Referenz ändern sich die Konstante und alle B, denn jedes B ist jetzt der Abstand zu einer anderen Gruppe. Die Vorhersage jeder Gruppe, Konstante plus ihr B, bleibt gleich.', 'k2-wechsel')] },
      { id: 'a2-4', art: 'lesen', titel: 'Deuten: Muster und Unsicherheit',
        text: 'Welches Muster zeigen die Zahlen: Prägung, Ort oder keins von beiden? Und wie sicher sind sie? Schau bei den Umzugsgruppen auch auf das Konfidenzintervall (95% CI Lower und Upper, kennst du aus Sitzung 7). Dazu gibt es zwei Fragen im nächsten Schritt.',
        mehr: [
          warum('Woran erkenne ich das Muster?', 'Vergleiche die B der Umzugsgruppen mit dem B der Ost-Bleibenden, alle mit Referenz West-Bleibende. Bei Prägung läge Ost→West nah bei den Ost-Bleibenden, bei Ort läge West→Ost nah bei ihnen.', 'k2-deuten'),
          probier('Wer von West nach Ost zieht, hat oft Abitur. Ändert sich das Bild, wenn du das Abitur konstant hältst?', 'Die Vorlage nimmt <code>abitur</code> als vierten Prädiktor dazu.', T.frei_a2.code, 'a2')] },
      { id: 'a2-5', art: 'fragen', titel: 'Ergebnis festhalten', fragen: fragen('a2'),
        mehr: [warum('Warum steht N = 3.222 in der Ausgabe?', 'N = 3.222 ist die Summe der Gewichte. Gezählt sind es 3.254 Befragte: 1.003 Ost-Bleibende, 91 Ost→West, 97 West→Ost, 2.063 West-Bleibende. Weil der Osten im ALLBUS absichtlich stärker vertreten ist, zählen Befragte im Osten gewichtet weniger.')] },
    ],
    plenum: 'Ost→West hat mit Referenz West-Bleibende (Schritt 2) ein anderes B als mit Referenz Ost-Bleibende (Schritt 4). Welche Zahl würdet ihr in einem Zeitungsartikel nennen, und welchen Satz schreibt ihr dazu? Bringt eure Antwort mit.',
    probier: { idee: 'Wer von West nach Ost zieht, hat oft Abitur. Ändert sich das Bild, wenn du das Abitur konstant hältst?', code: T.frei_a2.code },
    ohneGrafik: 'Die vier Gruppen stehen als Tabelle oben in der Aufgabe. Alle Zahlen stehen in der Ausgabe von <code>summary()</code> unter Coefficients.' },

  { id: 'a3', n: 3, titel: 'Was wiegt mehr, und was bleibt von der Ost-West-Lücke?', pflicht: true, grund: 'g3',
    frage: 'Welche von vier Eigenschaften hängt am stärksten mit der Demokratiezufriedenheit zusammen, und wie groß bleibt der Abstand zwischen Ost und West, wenn die anderen drei gleich sind?',
    ziel: 'du kannst Prädiktoren mit Beta vergleichen, korrigiertes R² und VIF eines Modells lesen und sagen, wie viel von der Ost-West-Lücke bleibt, wenn wirtschaftliche Lage und Abitur konstant gehalten werden.',
    info: 'Ins Modell kommen vier Prädiktoren: die eigene wirtschaftliche Lage (<code>lage</code>) und die Lage Deutschlands (<code>dlage</code>) aus Aufgabe 1, beide von 1 sehr schlecht bis 5 sehr gut; das Wohngebiet (<code>ost</code>: 1 Osten, 0 Westen, eine 0/1-Variable) und der Schulabschluss (<code>abitur</code>: 1 Fachhochschulreife oder Abitur, 0 ohne Abschluss, Volks- oder Hauptschule oder Mittlere Reife; „anderer Abschluss“ und „noch Schüler“ fehlen im Modell).',
    schritte: [
      { id: 'a3-p', art: 'festlegen', titel: 'Erst festlegen', vorhersage: festlegen('a3') },
      { id: 'a3-1', art: 'code', titel: 'Modell mit vier Prädiktoren', wk: ['a3'], bekannt: '0/1-Variable mit rec() aus Sitzung 5',
        text: 'Lies unter <b>Coefficients</b> die Spalten B und Beta, unter <b>Model Summary</b> R Square und Adjusted R Square, unter <b>Collinearity Statistics</b> die VIF.',
        mehr: [RSTUDIO,
          warum('Wie entstehen ost und abitur?', '<code>rec()</code> macht aus <code>eastwest</code> und <code>educ</code> 0/1-Variablen. Bei <code>abitur</code> setzt <code>else=NA</code> alle übrigen Codes auf fehlend; diese Befragten fallen aus dem Modell.', 'k3-modell'),
          warum('Was ist Adjusted R Square?', 'Das korrigierte R². Es zieht für jeden Prädiktor etwas ab und steigt nur, wenn ein Prädiktor mehr erklärt als Zufall.', 'k3-r2'),
          warum('Was sagt der VIF?', 'Wie sehr ein Prädiktor schon in den anderen steckt. 1 heißt: gar nicht. Ab 10 meldet mariposa ein Problem.', 'k3-vif')] },
      { id: 'a3-2', art: 'lesen', titel: 'B und Beta vergleichen',
        text: 'Welcher Prädiktor hat das größte Beta? Vergleiche die Zahlen ohne Vorzeichen. Stimmt die Reihenfolge der B mit der Reihenfolge der Beta überein? Schau besonders auf <code>lage</code> und <code>abitur</code>.',
        mehr: [warum('Warum Beta und nicht B?', 'B hängt an der Einheit: Bei <code>lage</code> ist ein Schritt eine von fünf Stufen, bei <code>abitur</code> der ganze Schritt von „kein Abitur“ zu „Abitur“. Beta rechnet alle Prädiktoren auf dieselbe Einheit um, die Standardabweichung.', 'k3-beta')] },
      { id: 'a3-3', art: 'code', titel: 'Die Ost-West-Lücke allein', wk: ['a3_ost'],
        text: 'Zum Vergleich die Lücke ohne weitere Prädiktoren. Führ die zweite Vorlage aus und vergleiche B von <code>ost</code> mit dem aus Schritt 2.',
        mehr: [
          warum('Wie vergleiche ich die beiden B?', 'Teil das B mit Kontrollen durch das B ohne Kontrollen. Das Ergebnis sagt, welcher Anteil der Lücke bleibt, wenn Lage und Abitur gleich sind.', 'k3-luecke'),
          probier('Wie viel trägt die Lage Deutschlands?', 'Nimm sie heraus und vergleiche R², korrigiertes R² und die übrigen B.', T.frei_a3.code, 'a3')] },
      { id: 'a3-4', art: 'fragen', titel: 'Ergebnis festhalten', fragen: fragen('a3') },
    ],
    probier: { idee: 'Wie viel trägt die Lage Deutschlands? Nimm sie heraus und vergleiche R², korrigiertes R² und die übrigen B.', code: T.frei_a3.code },
    ohneGrafik: 'Diese Aufgabe hat keine Grafik. Alle Zahlen stehen in den Ausgaben der beiden Vorlagen.' },

  { id: 'a4', n: 4, titel: 'Ist die Ost-West-Lücke mit Abitur kleiner?', pflicht: false, grund: 'g4',
    frage: 'Sind Befragte mit Abitur im Osten ähnlich zufrieden mit der Demokratie wie im Westen, oder gilt die Ost-West-Lücke für beide gleich?',
    ziel: 'du kannst eine Interaktion rechnen und lesen, die Lücke in zwei Gruppen ausrechnen und begründen, ob sie sich unterscheidet. Dazu kannst du sagen, warum kleine Gruppen vorsichtig machen.',
    info: 'In Aufgabe 3 hast du gesehen, wie viel von der Ost-West-Lücke bleibt, wenn Lage und Abitur gleich sind. Das sagt aber noch nicht, ob die Lücke bei Befragten mit und ohne Abitur gleich groß ist. Das prüft eine Interaktion.',
    schritte: [
      { id: 'a4-p', art: 'festlegen', titel: 'Erst festlegen', vorhersage: festlegen('a4') },
      { id: 'a4-1', art: 'code', titel: 'Eine Lücke für alle', wk: ['a4'],
        text: 'Die Vorlage rechnet <code>demo ~ ost + abitur</code>: eine Lücke für alle. Lies B von <code>ost</code>. Die gelbe Stelle in Zeile 9, das Plus zwischen <code>ost</code> und <code>abitur</code>, tauschst du in Schritt 3.',
        mehr: [RSTUDIO] },
      { id: 'a4-2', art: 'aendern', titel: 'Plus gegen Sternchen tauschen', neu: true,
        text: 'Notier dir zuerst B von <code>ost</code> aus Schritt 2 mit <b>+ Notiz</b>; beim erneuten Ausführen wird die Ausgabe ersetzt. Ändere dann im Journal den Block „Schritt 2: Eine Lücke für alle“: Tausch in Zeile 9 das gelbe <code>+</code> gegen <code>*</code> und führ den Block erneut aus. Jetzt gibt es eine Zeile <code>ost:abitur</code>. Lies B, Sig. und das Konfidenzintervall dieser Zeile, dazu das neue B von <code>ost</code>.',
        mehr: [warum('Was heißt * in der Formel?', 'Beide Prädiktoren und dazu ihre Interaktion. Die Zeile mit dem Doppelpunkt sagt, um wie viel der Abstand in der zweiten Gruppe anders ist. B von <code>ost</code> gilt dann nur noch für die Befragten mit <code>abitur</code> = 0.', 'k4-stern')] },
      { id: 'a4-3', art: 'code', titel: 'Die Lücke mit Abitur rechnen', wk: ['a4_rechnen'],
        text: 'Die Lücke mit Abitur ist B von <code>ost</code> plus B von <code>ost:abitur</code>; B von <code>ost</code> ist jetzt die Lücke ohne Abitur. Die Vorlage rechnet noch das Beispiel aus Verstehen (im Kommentar „Grundlage 4b“), den Abstand der Erwerbstätigen ab 60; R gibt <code>[1] 0.056</code> aus. Tausch in Zeile 3 beide gelben Zahlen gegen B von <code>ost</code> und B von <code>ost:abitur</code> aus Schritt 3. ' + ZAHLEN,
        mehr: [warum('Woher kommt das Beispiel?', 'Im Modell <code>ls01 ~ erwerb * ab60</code> ist B von <code>erwerb</code> (1,091) der Abstand der Erwerbstätigen unter 60, B von <code>erwerb:ab60</code> (−1,035) sagt, um wie viel dieser Abstand ab 60 anders ist. Zusammen: 0,056.', 'k4-rechnen')] },
      { id: 'a4-4', art: 'lesen', titel: 'Deuten: Ist die Lücke anders?',
        text: 'Ist die Lücke mit Abitur anders? Und: In Aufgabe 2 beruhten zwei Gruppen auf 91 und 97 Befragten. Was folgt daraus für ihre B? Dazu gibt es zwei Fragen im nächsten Schritt.',
        mehr: [
          warum('Nicht signifikant, also gleich?', '„Nicht signifikant“ heißt „kein Hinweis auf einen Unterschied“, nicht „gleich“ (kennst du aus Sitzung 7). Wie groß ein Unterschied höchstens sein könnte, zeigt das Konfidenzintervall.', 'k4-deuten'),
          warum('Was haben kleine Gruppen damit zu tun?', 'In kleinen Gruppen hat jede einzelne Person mehr Gewicht. Wie stark ein einzelner Fall eine Gerade verschieben kann, zeigt das Bild mit Person L.', 'k4-einfluss'),
          probier('Ist die Lücke bei Menschen, die sich politisch links einstufen, anders?', '<code>links</code>: <code>pa01</code> 1 bis 4 = links, 5 bis 10 = Mitte oder rechts.', T.frei_a4.code, 'a4')] },
      { id: 'a4-5', art: 'fragen', titel: 'Ergebnis festhalten', fragen: fragen('a4') },
    ],
    plenum: 'Zwei Sätze zur Wahl: „Mit und ohne Abitur ist die Ost-West-Lücke gleich groß.“ und „Wir finden keinen Hinweis, dass die Ost-West-Lücke mit Abitur anders ist.“ Welcher passt zu den Daten, und warum ist der Unterschied wichtig? Zum Vergleich: Rechne die Probier-Idee mit der Links-rechts-Einstufung und schau, ob dort die Zeile mit dem Doppelpunkt signifikant ist.',
    probier: { idee: 'Ist die Lücke bei Menschen, die sich politisch links einstufen, anders?', code: T.frei_a4.code },
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
    { stufe: 'Eigene Frage', text: 'Was passiert, wenn du alle vier Dummies in die Formel schreibst?', tipp: 'Lies die Meldung über der Ausgabe genau. Das Stichwort ist die Dummyfalle.' },
  ],
  a3: [
    { stufe: 'Abwandeln', text: 'Wie viel trägt die Lage Deutschlands? Nimm sie heraus und vergleiche R², korrigiertes R² und die übrigen B.', tipp: 'Streich <code>dlage</code> in der Formel. Schau besonders auf B von <code>lage</code>: Erinnert es dich an Aufgabe 1?' },
    { stufe: 'Erweitern', text: 'Nimm das Alter als fünften Prädiktor dazu. Wo steht es in der Reihenfolge der Beta?', tipp: '<code>age</code> kommt direkt in die Formel. Vergleiche Beta ohne Vorzeichen, und schau auch auf die VIF.' },
    { stufe: 'Eigene Frage', text: 'Was passiert mit der Ost-West-Lücke, wenn du das Vertrauen in den Bundestag kontrollierst?', tipp: '<code>pt03</code> (Vertrauen in den Bundestag, 1 gar kein bis 7 großes Vertrauen) kommt direkt in die Formel; N wird etwas kleiner. Überleg vorher, ob man das kontrollieren sollte: „Was du kontrollierst“ im Überblick von „Verstehen“ hilft dabei.' },
  ],
  a4: [
    { stufe: 'Abwandeln', text: 'Ist die Lücke bei Menschen, die sich politisch links einstufen, anders?', tipp: 'Bilde <code>links = rec(pa01, rules = "1:4=1 [links]; 5:10=0 [Mitte oder rechts]; else=NA")</code> und rechne <code>demo ~ ost * links</code>. Lies die Zeile <code>ost:links</code>.' },
    { stufe: 'Erweitern', text: 'Rechne die Lücke für die links Eingestuften aus.', tipp: 'Wie in Schritt 4: B von <code>ost</code> plus B von <code>ost:links</code>, mit R als Taschenrechner.' },
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
