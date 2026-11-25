/* Kapitel 9 „Lineare Regression“: Aufgaben, Zusatzinfos und eine eigene Schrittart für die Lernpfad-Engine.
   Wird nach daten.js geladen; die Engine ruft window.KAPITEL(hilfen) einmal auf.
   Die Fragen kommen aus content.ts (QUESTIONS mit special/wrong); geprüft werden sie mit PRUEFEN aus bausteine.tsx. */
'use strict';
window.KAPITEL = ({ D, T, esc, bild, warum, probier }) => {

/* ---------- Anpassungen an die Seitenzählung ----------
   In jeder Aufgabe ist „Erst festlegen“ jetzt Schritt 1; alle bisherigen Schritte rücken um eins nach.
   Texte in Fragen und Hilfen, die „Schritt n“ nennen, zählen darum um eins weiter. IDs und Zahlen bleiben. */
const schritt = s => typeof s === 'string' ? s.replace(/Schritt (\d+)/g, (_, n) => `Schritt ${+n + 1}`)
  .replace('den Zahlen aus Grundlage 1', 'den Zahlen aus dem Beispiel in Verstehen (3.570 und 1.073)')
  .replace(/aus Grundlage 1/g, 'aus Verstehen (Lage 4)') : s;
const frage = q => ({
  ...q, label: schritt(q.label), help: schritt(q.help), hint: schritt(q.hint), right: schritt(q.right),
  special: q.special?.map(x => ({ ...x, text: schritt(x.text) })),
  wrong: q.wrong ? Object.fromEntries(Object.entries(q.wrong).map(([k, v]) => [k, schritt(v)])) : undefined,
});
const FRAGEN = k => D.QUESTIONS[k].map(frage);
for (const k of Object.keys(D.HINTS)) D.HINTS[k] = D.HINTS[k].map(schritt);
// Fehlerhilfe: Der Satz über die Code-Werkstatt gilt im Lernjournal nicht.
D.ERROR_HELP = D.ERROR_HELP.map(r => ({ ...r, helps: r.helps.map(p => typeof p === 'string'
  ? p.replace('In der Code-Werkstatt startet jede Vorlage frisch; das Umpolen muss in jeder Vorlage stehen, die ', 'Eine Kette ohne allbus <- speichert nichts; darum muss das Umpolen in jeder Vorlage stehen, die ')
  : p) }));

/** Festlegung aus PREDICTIONS; die Auflösung (resolution) erscheint, sobald alle Fragen der Aufgabe richtig sind. */
const P = k => ({ ...D.PREDICTIONS[k], aufloesung: D.PREDICTIONS[k].resolution });

/* ---------- Aufgaben ---------- */
const TASKS = [
  { id: 'a1', n: 1, titel: 'Vertrauen in den Bundestag und Zufriedenheit mit der Demokratie', pflicht: true, grund: 'g1',
    frage: 'Wie viel zufriedener mit der Demokratie sind Menschen, die dem Bundestag mehr vertrauen?',
    ziel: 'du hast die Gerade aus R abgelesen, kannst Konstante und Steigung in einem Satz deuten und hast eine Vorhersage von Hand ausgerechnet.',
    info: 'Der ALLBUS fragt, wie zufrieden man mit der Demokratie in Deutschland ist (<code>ps03</code>, 1 = sehr zufrieden … 6 = sehr unzufrieden), und wie viel Vertrauen man in den Bundestag hat (<code>pt03</code>, 1 = gar kein Vertrauen … 7 = großes Vertrauen). Bei ps03 heißt eine kleine Zahl „zufrieden“. Die Vorlage polt darum um: In <code>demo</code> heißt 6 „sehr zufrieden“.',
    infoMehr: [warum('Alle Zahlen gewichtet', 'Alle Zahlen aus dem ALLBUS sind in diesem Kapitel gewichtet (<code>weights = wghtpew</code>, kennst du aus Sitzung 6), genau wie die Ausgabe deiner Vorlagen.', 'r1')],
    schritte: [
      { id: 'a1-p', art: 'festlegen', titel: 'Erst festlegen', vorhersage: P('a1') },
      { id: 'a1-1', art: 'code', titel: 'Vorlage ausführen', wk: ['a1'], neu: true, bekannt: 'rec() aus Sitzung 5, summary() aus Sitzung 7',
        text: 'Die Vorlage polt ps03 um und rechnet die Regression von <code>demo</code> auf pt03, gewichtet. Neu ist <code>linear_regression()</code> mit der Formel <code>demo ~ pt03</code>: links, was vorhergesagt wird, rechts, woraus.',
        mehr: [warum('Lieber in RStudio?', 'Dann führst du dort vorher den Startblock aus (Pakete laden, ALLBUS einlesen). Danach kopierst du die Vorlage mit <b>Kopieren</b> in dein Skript.<pre>' + esc(T.start.code) + '</pre>', 'r1'),
          warum('Was heißt die Tilde?', '<code>linear_regression(y ~ x)</code> sagt y aus x vorher. Links von <code>~</code> steht die abhängige Variable (AV), rechts die unabhängige (UV, in der Regression auch Prädiktor). Zwischen beiden steht immer die Tilde, kein Komma.', 'r2')] },
      { id: 'a1-2', art: 'lesen', titel: 'Konstante, Steigung und N ablesen',
        text: 'Such in der Tabelle Coefficients die Spalte <b>B</b>: die Konstante in der Zeile <code>(Intercept)</code>, die Steigung in der Zeile <code>pt03</code>. Oben unter <code>- N:</code> steht, wie viele Befragte mitrechnen.',
        mehr: [warum('Wo steht was?', 'Wie die Ausgabe von <code>summary()</code> aufgebaut ist, zeigt „R lesen“ am Beispiel der Lebenszufriedenheit: Wähl dort eine Zahl, und sie wird markiert. Für die Gerade brauchst du B, nicht Beta und nicht Std. Error.', 'r3'),
          warum('Warum rechnen nicht alle mit?', 'ps03 und pt03 standen nur in einem Teil der Fragebögen; 1.596 Befragten wurden sie nicht gestellt (TNZ: SPLIT, kennst du aus Sitzung 1). Es rechnen nur die mit, die beide Fragen gültig beantwortet haben, deutlich weniger als die 5.246 Befragten.', 'k1-ablesen')] },
      { id: 'a1-3', art: 'code', titel: 'Vorhersage von Hand', wk: ['a1r'], bekannt: 'R als Taschenrechner aus Sitzung 1',
        text: 'Rechne die Vorhersage für Menschen mit großem Vertrauen (pt03 = 7) aus. Die Vorlage rechnet noch das Beispiel aus Verstehen (im Kommentar „Grundlage 1“: Lebenszufriedenheit bei Lage 4). Tausch im Journal die drei markierten Zahlen: Konstante, Steigung und den Wert 7.',
        mehr: [warum('Punkt statt Komma', 'Kommazahlen schreibst du in R mit Punkt, etwa 3.570 statt 3,570. R rechnet erst mal, dann plus: <code>Konstante + Steigung * 7</code> braucht keine Klammern.', 'k1-formel')] },
      { id: 'a1-4', art: 'lesen', titel: 'Deuten: Was bedeuten Steigung und Konstante?',
        text: 'Formuliere für dich je einen Satz, gern mit <b>+ Notiz</b> im Journal: Was sagt die Steigung über Menschen, die dem Bundestag eine Stufe mehr vertrauen? Und wofür steht die Konstante, wenn es bei pt03 gar keinen Wert 0 gibt? Die Fragen im nächsten Schritt greifen das auf.',
        mehr: [warum('Ein Satzmuster', '„Mit jeder Stufe mehr {UV} liegt die vorhergesagte {AV} um {B} Punkte höher.“ Die Regression zeigt einen Zusammenhang, keine Ursache: „wird dadurch zufriedener“ sagt mehr, als sie zeigen kann.', 'k1-deuten')] },
      { id: 'a1-5', art: 'fragen', titel: 'Ergebnis festhalten', fragen: FRAGEN('a1') },
    ],
    probier: { idee: 'Was passiert, wenn du die Seiten tauschst und das Vertrauen aus der Zufriedenheit vorhersagst?', code: T.frei_a1.code },
    ohneGrafik: 'Diese Aufgabe hat keine Grafik. Alle Zahlen stehen in der Ausgabe von Schritt 2 und im Ergebnis von Schritt 4.' },

  { id: 'a2', n: 2, titel: 'Vertrauen oder Schicht: Was sagt mehr?', pflicht: true, grund: 'g2',
    frage: 'Sagt das Vertrauen in den Bundestag die Zufriedenheit mit der Demokratie besser vorher als die eigene Schicht?',
    ziel: 'du kannst R² und den typischen Fehler einer Regression lesen und begründen, was eine fast gleich steile Gerade über die Güte der Vorhersage sagt und was nicht.',
    info: 'In Aufgabe 1 hast du die Gerade für das Vertrauen in den Bundestag gerechnet. Jetzt vergleichst du sie mit einer zweiten Frage: Welcher Schicht rechnen sich die Befragten zu? (<code>id02</code>, 1 = Unterschicht, 2 = Arbeiterschicht, 3 = Mittelschicht, 4 = obere Mittelschicht, 5 = Oberschicht). Eine hohe Zahl heißt hier schon „höher“; umpolen musst du id02 nicht.',
    schritte: [
      { id: 'a2-p', art: 'festlegen', titel: 'Erst festlegen', vorhersage: P('a2') },
      { id: 'a2-1', art: 'code', titel: 'Regression mit dem Vertrauen', wk: ['a2'],
        text: 'Führe die Vorlage aus, wie sie ist. Sie rechnet noch einmal die Regression aus Aufgabe 1; das Umpolen steht wieder drin, weil die Kette aus Aufgabe 1 <code>demo</code> nicht gespeichert hat. Lies im Abschnitt Model Summary <b>R Square</b> und <b>Std. Error of the Estimate</b>, in Descriptive Statistics die Standardabweichung von demo.',
        mehr: [warum('Was sagen R² und der typische Fehler?', 'R² sagt, um welchen Anteil die Fehlerquadrate mit der Geraden kleiner sind als mit dem Mittelwert allein. Der typische Fehler (Std. Error of the Estimate) sagt in Punkten der Zufriedenheit, wie weit die Vorhersage typischerweise danebenliegt. Die Standardabweichung von demo ist der typische Fehler, wenn man für alle nur den Mittelwert vorhersagt.', 'k2-r2')] },
      { id: 'a2-2', art: 'anpassen', titel: 'Die Schicht einsetzen', haken: 'Im Journal getauscht und ausgeführt',
        text: 'Tausch in deinem Journal-Block aus Schritt 2 die markierte Stelle <code>pt03</code> gegen <code>id02</code> und führe ihn erneut aus. Lies wieder <b>R Square</b> und dazu die Steigung <b>B</b> in der Zeile id02. Notier dir vorher die Zahlen für pt03, denn die neue Ausgabe ersetzt die alte. Oder du kopierst die Vorlage aus Schritt 2 mit <b>Kopieren</b> in einen Block <b>+ Eigener Code</b> und tauschst dort; dann stehen beide Ausgaben untereinander.',
        mehr: [warum('Muss ich die Schicht umpolen?', 'Nein. Bei id02 heißt eine hohe Zahl schon „höher“. Umgepolt wird nur ps03, die AV, und das steht in der Vorlage schon drin.', 'k2-vorlage')] },
      { id: 'a2-3', art: 'lesen', titel: 'Die beiden Ausgaben vergleichen',
        text: 'Vergleiche die beiden Ausgaben: erst die Steigungen B, dann R² und den typischen Fehler. Was passt nicht zusammen?',
        mehr: [warum('Steil heißt nicht gut', 'Die Steigung sagt, wie viel sich die Vorhersage pro Stufe ändert. R² sagt, wie nah die Befragten an der Geraden liegen. Beides musst du getrennt lesen.', 'k2-vergleich')] },
      { id: 'a2-4', art: 'fragen', titel: 'Ergebnis festhalten', fragen: FRAGEN('a2') },
    ],
    plenum: 'Das Vertrauen in den Bundestag sagt die Zufriedenheit mit der Demokratie gut vorher. Ist das eine Erklärung, oder fragen beide Fragen fast dasselbe? Bringt ein Argument für jede Seite mit.',
    probier: { idee: 'Sagt die Wirtschaftslage in Deutschland die Zufriedenheit besser vorher als die Schicht?', code: T.frei_a2.code },
    ohneGrafik: 'Diese Aufgabe hat keine Grafik. Alle Zahlen stehen in den beiden Ausgaben aus Schritt 2 und 3.' },

  { id: 'a3', n: 3, titel: 'Für wen liegt die Gerade daneben?', pflicht: true, grund: 'g3',
    frage: 'Sagt das Vertrauen in den Bundestag die Zufriedenheit für alle gleich gut vorher, oder für manche viel schlechter?',
    ziel: 'du hast für jede Person das Residuum gebildet, seine Streuung je Stufe des Vertrauens verglichen und den Levene-Test gelesen. Du kannst sagen, ob die Voraussetzung gleicher Fehlervarianz hält und für wen die Gerade am weitesten danebenliegt.',
    schritte: [
      { id: 'a3-p', art: 'festlegen', titel: 'Erst festlegen', vorhersage: P('a3') },
      { id: 'a3-1', art: 'code', titel: 'Residuum bilden und je Stufe beschreiben', wk: ['a3'], neu: true, bekannt: 'mutate() aus Sitzung 5',
        text: 'Die Vorlage bildet für jede Person die Vorhersage (Konstante + Steigung mal pt03) und das Residuum (beobachtet minus vorhergesagt). Noch stehen dort die Zahlen aus dem Beispiel in Verstehen zu Aufgabe 1. Tausch im Journal die beiden markierten Zahlen gegen Konstante und Steigung aus Aufgabe 1 (2.288 und 0.465, mit Punkt) und führe den Block aus. Neu sind <code>group_by()</code> und <code>levene_test()</code>.',
        mehr: [warum('Was macht group_by()?', '<code>group_by(pt03)</code> teilt die Befragten nach ihrer Antwort bei pt03 in sieben Gruppen. Alles, was danach kommt, rechnet R für jede Gruppe getrennt. <code>describe()</code> gibt darum sieben kleine Tabellen aus, eine je Stufe, in der Reihenfolge 1 bis 7. Nur 1 und 7 haben einen Namen (GAR KEIN VERTRAUEN, GROSSES VERTRAUEN); die Stufen 2 bis 6 zeigt R als „..“. N ist gewichtet gezählt. <code>drop_na(residuum)</code> lässt alle weg, für die es kein Residuum gibt, weil ps03 oder pt03 fehlt (kennst du aus Sitzung 4).', 'k3-groupby'),
          warum('Warum steht allbus <- am Anfang?', 'Die erste Kette speichert ihr Ergebnis wieder in <code>allbus</code>. So stehen <code>vorhersage</code> und <code>residuum</code> danach als Spalten im Datensatz, und die beiden Ketten darunter können sie benutzen.', 'k3-vorlage')] },
      { id: 'a3-2', art: 'lesen', titel: 'Die Streuung je Stufe lesen',
        text: 'Lies in jeder der sieben Tabellen die Spalte <b>SD</b>: So stark streut das Residuum in dieser Stufe. Wo ist sie am größten, wo am kleinsten?',
        mehr: [warum('Warum ändern Konstante und Steigung die SD nicht?', 'Innerhalb einer Stufe sagt die Gerade allen denselben Wert vorher. Die SD des Residuums ist dort die SD der Zufriedenheit selbst. Darum stimmen die SD-Werte schon, bevor du die Zahlen tauschst; nur die Mittelwerte (Mean) brauchen die richtige Gerade.', 'k3-sd')] },
      { id: 'a3-3', art: 'lesen', titel: 'Den Levene-Test lesen', bekannt: 'Faustregel aus Sitzung 7',
        text: 'Lies die letzte Zeile der Ausgabe: den Levene-Test. „variances unequal“ heißt: Die Streuungen sind nicht gleich. Prüf dazu die Größe mit der Faustregel aus Sitzung 7: Ist die größte SD mehr als doppelt so groß wie die kleinste?',
        mehr: [warum('Test und Faustregel: wozu beides?', 'Der Levene-Test sagt, ob die Streuungen verschieden sind; ist p kleiner als 0,05, schreibt R „variances unequal“. Bei Tausenden Befragten wird auch ein kleiner Unterschied signifikant. Ob der Unterschied groß ist, sagt die Faustregel.', 'k3-levene')] },
      { id: 'a3-4', art: 'lesen', titel: 'Deuten: Was heißt das für einen Bericht?',
        text: 'Überleg dir einen Satz für einen Bericht, gern mit <b>+ Notiz</b> im Journal: Für wen sagt die Gerade die Zufriedenheit genauer vorher, für wen ungenauer? Die Fragen im nächsten Schritt greifen das auf.',
        mehr: [warum('Was gehört in den Bericht?', 'Ein ehrlicher Bericht sagt, für wen die Vorhersage ungenau ist. Der typische Fehler und R² gelten für alle zusammen.', 'k3-bericht')] },
      { id: 'a3-5', art: 'fragen', titel: 'Ergebnis festhalten', fragen: FRAGEN('a3') },
    ],
    plenum: 'Die Gerade liegt bei Menschen ohne Vertrauen am weitesten daneben. Warum könnte das so sein? Und was heißt das, wenn eine Zeitung schreibt: „Wer dem Bundestag vertraut, ist zufrieden mit der Demokratie“?',
    probier: { idee: 'Wie sieht die Streuung des Residuums je Stufe als Boxplots aus?', code: T.frei_a3.code },
    ohneGrafik: 'Diese Aufgabe braucht keine Grafik. Alle Zahlen stehen in der Ausgabe von Schritt 2.' },

  { id: 'a4', n: 4, titel: 'Links, Mitte, rechts', pflicht: false, grund: 'g4',
    frage: 'Sind Menschen umso weniger zufrieden mit der Demokratie, je weiter rechts sie sich einstufen?',
    ziel: 'du kannst eine Gerade mit den Mittelwerten je Stufe vergleichen und sagen, ob sie den Zusammenhang richtig beschreibt.',
    info: 'Die Befragten stufen sich politisch selbst ein, von 1 (links) bis 10 (rechts) (<code>pa01</code>).',
    schritte: [
      { id: 'a4-p', art: 'festlegen', titel: 'Erst festlegen', vorhersage: P('a4') },
      { id: 'a4-1', art: 'code', titel: 'Gerade und Mittelwerte je Stufe', wk: ['a4'], bekannt: 'group_by() aus Aufgabe 3',
        text: 'Führe die Vorlage aus. Sie rechnet die Gerade und die Mittelwerte von demo für jede Stufe von pa01. Die zehn Tabellen stehen in der Reihenfolge 1 bis 10; nur 1 (LINKS) und 10 (RECHTS) haben einen Namen.',
        mehr: [warum('Warum Mittelwerte je Stufe?', 'Eine Gerade kann nur steigen oder fallen. Ob sie den Zusammenhang richtig beschreibt, siehst du, wenn du die Mittelwerte jeder Stufe neben sie legst.', 'k4-vergleich')] },
      { id: 'a4-2', art: 'code', titel: 'Vorhersage für ganz links', wk: ['a4r'],
        text: 'Rechne die Vorhersage der Geraden für „ganz links“ (pa01 = 1). Die Vorlage rechnet noch das Beispiel aus Verstehen zu Aufgabe 1 (Lage 4). Tausch im Journal die drei markierten Zahlen: Konstante, Steigung und den Wert 1. Die Steigung ist negativ: Schreib sie mit Minus. <code>Konstante + -Steigung * 1</code> und <code>Konstante - Steigung * 1</code> ergeben dasselbe.',
        mehr: [warum('Negative Steigung in Worten', 'Ist B negativ, sinkt die Vorhersage: „Mit jeder Stufe weiter rechts liegt die vorhergesagte Zufriedenheit um … Punkte niedriger.“', 'k4-minus')] },
      { id: 'a4-3', art: 'lesen', titel: 'Vergleichen: Gerade gegen Mittelwerte',
        text: 'Vergleiche die Vorhersage für ganz links mit dem Mittelwert der ersten Tabelle (LINKS). Lies dann die Mittelwerte der zehn Tabellen der Reihe nach: Fallen sie gleichmäßig, so wie die Gerade?',
        mehr: [warum('Wie prüfe ich, ob die Gerade passt?', 'Liegen die Mittelwerte der Stufen nahe an der Geraden, beschreibt sie den Zusammenhang gut. Liegen sie in einem Bogen um die Gerade, beschreibt sie ihn schlecht; dann berichtet man besser die Mittelwerte je Stufe.', 'k4-vergleich')] },
      { id: 'a4-4', art: 'fragen', titel: 'Ergebnis festhalten', fragen: FRAGEN('a4') },
      { id: 'a4-5', art: 'bild', titel: 'Im Bild: Gerade und Mittelwerte', baustein: 'LinksRechts',
        text: 'Das Bild legt die Mittelwerte je Stufe neben die Gerade aus R. Weil es die Antworten zeigt, erscheint es erst, sobald du deine Antworten in Schritt 5 geprüft hast, oder mit <b>Bild zeigen</b>.' },
    ],
    probier: { idee: 'Zeigt die Lebenszufriedenheit dasselbe Muster nach Links-rechts?', code: T.frei_a4.code },
    ohneGrafik: 'Alle Zahlen stehen in der Ausgabe von Schritt 2 und im Ergebnis von Schritt 3; das Bild in Schritt 6 hat eine Textfassung.' },
];

/* ---------- Weiter, wenn du magst ---------- */
const FREI = {
  a1: [
    { stufe: 'Abwandeln', text: 'Tausch die Seiten: Sag das Vertrauen aus der Zufriedenheit vorher. Ist es dieselbe Gerade, nur rückwärts gelesen?', tipp: 'In der Vorlage aus Schritt 2 wird aus <code>demo ~ pt03</code> die Formel <code>pt03 ~ demo</code>. Vergleiche danach B und R² mit Aufgabe 1.' },
    { stufe: 'Erweitern', text: 'Rechne die Vorhersage für alle sieben Stufen des Vertrauens auf einmal aus.', tipp: '<code>1:7</code> steht in R für die Zahlen 1 bis 7. <code>Konstante + Steigung * 1:7</code> rechnet alle sieben Vorhersagen in einer Zeile; setz deine Zahlen aus Schritt 3 ein.' },
    { stufe: 'Eigene Frage', text: 'Sagt das Vertrauen in den Bundestag auch die Lebenszufriedenheit vorher?', tipp: '<code>linear_regression(ls01 ~ pt03, weights = wghtpew)</code>. Bei ls01 (0 bis 10) heißt eine hohe Zahl schon „zufrieden“; umpolen musst du nicht.' },
  ],
  a2: [
    { stufe: 'Abwandeln', text: 'Sagt die Wirtschaftslage in Deutschland (ep01, 1 = sehr gut … 5 = sehr schlecht) die Zufriedenheit besser vorher als die Schicht? Und warum ist ihre Steigung negativ?', tipp: 'Nimm die Vorlage aus Schritt 2 und tausch die markierte Stelle gegen <code>ep01</code>. Achte auf die Richtung der Codes: Bei ep01 heißt 1 „sehr gut“.' },
    { stufe: 'Erweitern', text: 'Rechne R² selbst aus dem typischen Fehler und der Standardabweichung von demo nach.', tipp: '<code>1 - (Fehler / SD)^2</code>, mit den beiden Zahlen aus deiner Ausgabe statt der Wörter. Es kommt R² heraus, bis auf Rundung.' },
    { stufe: 'Eigene Frage', text: 'Welche andere Frage sagt die Zufriedenheit mit der Demokratie gut vorher?', tipp: 'Tausch die markierte Stelle gegen eine Variable deiner Wahl. Tipp im Journal ein paar Buchstaben, dann <kbd>Tab</kbd>: Die Vorschläge zeigen Variablen mit ihrer Frage. Prüf, in welche Richtung ihre Codes laufen.' },
  ],
  a3: [
    { stufe: 'Abwandeln', text: 'Zeig die Streuung des Residuums je Stufe als Boxplots.', tipp: '<code>to_label(pt03)</code> schreibt die Stufen an die Achse, <code>geom_boxplot()</code> zeichnet je Stufe einen Kasten (kennst du aus Sitzung 4). Ein langer Kasten heißt: Das Residuum streut dort stark.' },
    { stufe: 'Erweitern', text: 'Prüf die gleiche Fehlervarianz auch für das Beispiel aus Verstehen: Lebenszufriedenheit nach der eigenen wirtschaftlichen Lage.', tipp: 'Wie in der Vorlage, nur mit <code>lage = rec(ep03, rules = "rev")</code>, <code>vorhersage = 3.570 + 1.073 * lage</code> und <code>residuum = ls01 - vorhersage</code>; danach <code>group_by(lage)</code> und <code>levene_test(residuum, group = lage, weights = wghtpew)</code>.' },
    { stufe: 'Eigene Frage', text: 'Liegt die Gerade für Frauen und Männer gleich weit daneben?', tipp: 'Nach der Vorlage: <code>group_by(sex)</code> statt <code>group_by(pt03)</code> (sex: 1 Mann, 2 Frau, 3 divers) und <code>levene_test(residuum, group = sex, weights = wghtpew)</code>.' },
  ],
  a4: [
    { stufe: 'Abwandeln', text: 'Zeigt die Lebenszufriedenheit dasselbe Muster nach Links-rechts?', tipp: 'Nimm den unteren Teil der Vorlage aus Schritt 2 und tausch <code>demo</code> gegen <code>ls01</code>, auch in <code>drop_na()</code>.' },
    { stufe: 'Erweitern', text: 'Zeichne die Mittelwerte je Stufe als Linie.', tipp: '<code>allbus %&gt;% drop_na(demo, pa01) %&gt;% ggplot(aes(x = pa01, y = demo)) + stat_summary(fun = mean, geom = "line")</code>. Mit <code>+ stat_summary(fun = mean, geom = "point")</code> kommen Punkte dazu.' },
    { stufe: 'Eigene Frage', text: 'Fass die Einstufung in drei Gruppen zusammen (links, Mitte, rechts). Wie zufrieden ist jede Gruppe?', tipp: 'In <code>mutate()</code>: <code>richtung = rec(pa01, rules = "1:3=1 [links]; 4:7=2 [Mitte]; 8:10=3 [rechts]; else=NA")</code>, dann <code>group_by(richtung)</code> und <code>describe(demo, weights = wghtpew, show = c("mean", "sd"))</code>.' },
  ],
};

/* ---------- Eigene Schrittart: im Journal etwas ändern, ohne eigene Vorlage ---------- */
function anpassen(s, H) {
  const lab = document.createElement('label'); lab.className = 'erledigt';
  lab.innerHTML = `<input type="checkbox" ${H.S.fertig[s.id] ? 'checked' : ''}> ${H.esc(s.haken || 'Im Journal geändert und ausgeführt')}`;
  lab.querySelector('input').onchange = e => H.fertig(s.id, e.target.checked);
  return lab;
}

return { BILD: {}, TASKS, FREI, typen: { anpassen } };
};
