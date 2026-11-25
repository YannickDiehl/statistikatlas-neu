/* Kapitel 11 „Logistische Regression“: Aufgaben und Zusatzinfos für die Lernpfad-Engine.
   Wird nach daten.js geladen; die Engine ruft window.KAPITEL(hilfen) einmal auf.
   Antwortprüfung mit den Sonderfällen aus content.ts (SPECIAL): PRUEFEN in bausteine.tsx. */
'use strict';
window.KAPITEL = ({ D, T, esc, warum, probier }) => {

/* Festlegung mit Auflösung: PREDICTIONS aus content.ts, „resolution“ erscheint, sobald alle Fragen der Aufgabe richtig sind. */
const fest = k => ({ ...D.PREDICTIONS[k], aufloesung: D.PREDICTIONS[k].resolution });

/* Die Rückmeldungen in content.ts verweisen auf die alten Grundlagen („Grundlage 2b“). Hier zeigen sie auf die Karten in „Verstehen“.
   Dieselbe Zuordnung nutzt PRUEFEN in bausteine.tsx für die Sonderfälle. Frage-IDs und Zielwerte bleiben unverändert. */
const KARTE = { '1b': 'Warum eine Gerade scheitert', '1c': 'Drei Sprachen', '2b': 'Exp(B): ein Faktor für die Chance', '3b': 'Gleicher Faktor, verschiedene Prozentpunkte', '3c': 'Eine Zahl im Mittel: der AME', '4a': 'Trefferquote: besser als Raten?', '4c': 'Pseudo-R²' };
const neuerVerweis = t => t.replace(/Grundlage (\d[a-c])/g, (m, k) => KARTE[k] ? `„${KARTE[k]}“ in Verstehen` : m);
/* Die Texte zählen die Schritte ohne „Erst festlegen“; auf der Seite ist Festlegen Schritt 1, alle anderen rücken eins weiter. */
const nr = t => t.replace(/Schritt (\d)(?: und (\d))?/g, (m, a, b) => 'Schritt ' + (+a + 1) + (b ? ' und ' + (+b + 1) : ''));
const neu = t => (t == null ? t : neuerVerweis(nr(t)));
const fragen = k => D.QUESTIONS[k].map(q => ({ ...q, right: neu(q.right), hint: neu(q.hint), help: neu(q.help) }));
Object.keys(D.HINTS).forEach(k => { D.HINTS[k] = D.HINTS[k].map(neu); });
/* „R meldet einen Fehler“: gearbeitet wird im Journal, nicht in einer Werkstatt. */
D.ERROR_HELP = D.ERROR_HELP.map(r => ({ ...r, says: r.says.map(x => (typeof x === 'string' ? x.replace(' (in der Werkstatt: ', ' (im Journal: ') : x)) }));

const RSTUDIO = warum('Lieber in RStudio?', 'Dann führst du dort vorher den Startblock aus (Pakete laden, ALLBUS einlesen). Danach kopierst du die Vorlage mit <b>Kopieren</b> in dein Skript. Jede Vorlage bildet die Variablen, die sie braucht, selbst.<pre>' + esc(T.start.code) + '</pre>', 'r1');
const GEWICHT = warum('Warum weicht N ab?', 'Alle Zahlen in diesem Kapitel sind gewichtet mit <code>wghtpew</code>, genau wie die Ausgabe deiner Vorlagen (kennst du aus Sitzung 6). Darum steht unter N oft eine gewichtete Zahl, die etwas von der Zahl der befragten Personen abweicht.');

/* ---------- Aufgaben ---------- */
const TASKS = [
  { id: 'a1', n: 1, titel: 'Wer will wählen gehen?', pflicht: true, grund: 'g1',
    frage: 'Wie hängt die Absicht zu wählen damit zusammen, ob jemand Wählen für eine Bürgerpflicht hält?',
    ziel: 'du hast die Wahlabsicht als 0/1-Variable gebildet, liest in einer Kreuztabelle, wie der Anteil der Wählenden mit dem Pflichtgefühl steigt, und kannst mit zwei kleinen Rechnungen zeigen, warum eine Gerade hier an ihre Grenze stößt und was eine Chance ist.',
    info: 'Der ALLBUS fragt, welche Partei man wählen würde, wenn am nächsten Sonntag Bundestagswahl wäre (<code>pv01</code>). Eine Antwort ist „würde nicht wählen“ (Code 91). Außerdem sollten die Befragten sagen, wie sehr sie zustimmen, dass die Beteiligung an Wahlen eine Bürgerpflicht ist (<code>pe09</code>, 1 = stimme voll zu bis 4 = stimme gar nicht zu). Diese Frage wurde nur einem Teil der Befragten gestellt, gut zwei Dritteln (1.596 haben TNZ: SPLIT, kennst du aus Sitzung 1). Es geht um die geäußerte Absicht, nicht um tatsächliches Wählen.',
    infoMehr: [GEWICHT],
    schritte: [
      { id: 'a1-p', art: 'festlegen', titel: 'Erst festlegen', vorhersage: fest('a1') },
      { id: 'a1-1', art: 'code', titel: 'Wählen als 0/1 bilden', wk: ['a1f'], bekannt: 'rec() aus Sitzung 5, weights aus Sitzung 6',
        text: 'Bilde die 0/1-Variable <code>waehlen</code> und zähl sie aus. <code>rec()</code> macht aus allen Parteien (1 bis 90) eine 1 und aus „würde nicht wählen“ (91) eine 0; alles andere wird NA.',
        mehr: [RSTUDIO,
          warum('Warum ist Wählen die 1?', 'In Sitzung 5 hast du <code>nichtwahl</code> andersherum gebildet (91 = 1). Heute ist Wählen die 1, weil das Modell die Wahrscheinlichkeit der 1 vorhersagt.', 'k1-null-eins')] },
      { id: 'a1-2', art: 'code', titel: 'Kreuztabelle: Anteil je Stufe', wk: ['a1k'], bekannt: 'crosstab() mit Zeilenprozent aus Sitzung 5', baustein: 'Umgepolt',
        text: 'Wie viel Prozent jeder Stufe wollen wählen? <code>pe09</code> läuft von „stimme voll zu“ (1) bis „stimme gar nicht zu“ (4). Damit ein höherer Wert mehr Pflichtgefühl heißt, polt die Vorlage um: <code>pflicht</code> läuft von 1 = stimme gar nicht zu bis 4 = stimme voll zu. Lies in der Ausgabe die Zeilen <code>row %</code> in der Spalte „würde wählen“.',
        mehr: [warum('Was macht rules = "rev"?', '<code>rec(pe09, rules = "rev")</code> dreht die Codes um: aus 1 wird 4, aus 2 wird 3 und so weiter. Die Antworten bleiben dieselben, nur die Zahlen dazu laufen andersherum. Die Tabelle unter der Vorlage zeigt, welche Antwort welchen Code hat.', 'k1-kreuz')] },
      { id: 'a1-3', art: 'code', titel: 'Prozentpunkte je Stufe', wk: ['a1r'], bekannt: 'R als Taschenrechner aus Sitzung 1',
        text: 'Wie viele Prozentpunkte bringt eine Stufe mehr Pflichtgefühl? Die Vorlage rechnet die erste Stufe vor: von „stimme gar nicht zu“ (61.4) zu „stimme eher nicht zu“ (78.3). Tausch im Journal die beiden markierten Zahlen gegen die Werte für die letzte Stufe, von „stimme eher zu“ zu „stimme voll zu“.',
        mehr: [warum('Punkt oder Komma?', 'Kommazahlen schreibst du in R mit Punkt, die größere Zahl zuerst. Sonst kommt eine negative Zahl heraus.'),
          warum('Warum werden die Schritte kleiner?', 'Je näher ein Anteil an 100 % liegt, desto weniger kann die nächste Stufe noch bringen. Darum folgen Anteile einer S-Kurve, keiner Geraden.', 'k1-gerade')] },
      { id: 'a1-4', art: 'code', titel: 'Einen Anteil in eine Chance umrechnen', wk: ['a1c'],
        text: 'Eine Chance ist Prozent „würde wählen“ geteilt durch Prozent „würde nicht wählen“. Die Vorlage rechnet „stimme gar nicht zu“ vor. Tausch im Journal die beiden markierten Zahlen gegen die Zeile „stimme voll zu“.',
        mehr: [warum('Was ist eine Chance?', 'Die Chance (englisch Odds) teilt Ja durch Nein in einer Gruppe: „3 zu 1“ heißt, auf eine Person mit Nein kommen drei mit Ja. Sie ist keine Prozentzahl.', 'k1-sprachen')] },
      { id: 'a1-5', art: 'fragen', titel: 'Ergebnis festhalten', fragen: fragen('a1') },
    ],
    probier: { idee: 'Was sagt eine Gerade (lineare Regression aus Sitzung 9) für die vier Stufen voraus?', code: T.frei_a1.code },
    ohneGrafik: 'Alle Zahlen stehen in den Ausgaben von <code>frequency()</code> und <code>crosstab()</code>. Das Bild in Schritt 3 hat eine Textfassung.' },

  { id: 'a2', n: 2, titel: 'Was heißt Exp(B) für das Pflichtgefühl?', pflicht: true, grund: 'g2',
    frage: 'Wie stark hängt die Absicht zu wählen mit dem Pflichtgefühl zusammen, wenn man das politische Interesse berücksichtigt?',
    ziel: 'du hast ein logistisches Modell gewichtet geschätzt und kannst in einem Satz sagen, was Exp(B) für das Pflichtgefühl und für das Interesse heißt, und warum nur gut die Hälfte der Befragten im Modell steckt.',
    info: 'Du erklärst <code>waehlen</code> (1 = würde wählen) aus Aufgabe 1 mit zwei Prädiktoren: dem Pflichtgefühl (<code>pflicht</code>, 1 = stimme gar nicht zu bis 4 = stimme voll zu) und dem politischen Interesse (<code>pa02a</code>, 1 = sehr stark bis 5 = überhaupt nicht, kennst du aus Sitzung 2). Auch das Interesse wird umgepolt: <code>interesse</code> läuft von 1 = überhaupt nicht bis 5 = sehr stark. Höhere Werte heißen also mehr Pflichtgefühl und mehr Interesse.',
    schritte: [
      { id: 'a2-p', art: 'festlegen', titel: 'Erst festlegen', vorhersage: fest('a2') },
      { id: 'a2-1', art: 'code', titel: 'Das logistische Modell schätzen', wk: ['a2'], neu: true, bekannt: 'mutate() mit rec() wie in Aufgabe 1',
        text: 'Die Vorlage bildet die Variablen wie in Aufgabe 1 und schätzt ein Modell, zunächst nur mit dem Pflichtgefühl. Lies in „Variables in the Equation“ Exp(B) für <code>pflicht</code> (3.888).',
        mehr: [warum('Wo steht was in der Ausgabe?', 'Zuerst „Dependent Variable Encoding“: Welche Antwort ist die 1? Dann in „Variables in the Equation“ je Prädiktor B (Richtung), Sig. (signifikant?) und Exp(B) (Faktor für die Chance). Ganz oben steht <code>N:</code>, die gewichtete Zahl der Fälle im Modell.', 'k2-ausgabe')] },
      { id: 'a2-2', art: 'journal', titel: 'Das Interesse dazunehmen', bekannt: 'mehrere Prädiktoren mit + aus Sitzung 10',
        text: 'Ändere im Journal deinen Block aus Schritt 2: Ersetze die markierte Stelle <code>pflicht</code> durch <code>pflicht + interesse</code>. Die Zeile heißt dann <code>logistic_regression(waehlen ~ pflicht + interesse, weights = wghtpew)</code>. Führe den Block erneut aus. Lies zuerst „Dependent Variable Encoding“, dann in „Variables in the Equation“ beide Zeilen.',
        mehr: [warum('Warum ändert sich Exp(B) des Pflichtgefühls?', 'Exp(B) des Pflichtgefühls ändert sich ein wenig, wenn das Interesse dazukommt: Jetzt gilt es „bei gleichem Interesse“, wie B in der multiplen Regression aus Sitzung 10.', 'k2-zwei')] },
      { id: 'a2-3', art: 'code', titel: 'Exp(B) in Prozent', wk: ['a2r'], bekannt: 'R als Taschenrechner aus Sitzung 1',
        text: 'Wie viel Prozent mehr Chance bringt eine Stufe mehr Interesse? Die Vorlage rechnet noch das Smartphone-Beispiel aus Verstehen vor (Alter, 0.927; im Kommentar steht „Grundlage 2“). Tausch im Journal die markierte Zahl gegen Exp(B) des Interesses.',
        mehr: [warum('Warum minus 1?', 'Exp(B) ist ein Faktor. Ein Faktor von 1 heißt „bleibt gleich“, also 0 % Veränderung. Darum zieht man 1 ab und nimmt mal 100: Aus 0,927 wird −7,3 %.', 'k2-faktor')] },
      { id: 'a2-4', art: 'lesen', titel: 'Deuten: ein Faktor wofür?',
        text: 'Bevor du die Sätze in Schritt 6 beurteilst: Exp(B) ist ein Faktor. Wofür gilt er: für die Wahrscheinlichkeit, für die Chance oder für Prozentpunkte? Und unter welcher Bedingung, jetzt, da zwei Prädiktoren im Modell sind?',
        mehr: [warum('Wahrscheinlichkeit oder Chance?', 'Mach die Probe: Eine Wahrscheinlichkeit von 60 % kann sich nicht verdoppeln, das wären 120 %. Eine Chance kann es.', 'k2-faktor')] },
      { id: 'a2-5', art: 'fragen', titel: 'Ergebnis festhalten', fragen: fragen('a2') },
    ],
    probier: { idee: 'Bleibt der Zusammenhang, wenn auch das Alter im Modell ist?', code: T.frei_a2.code },
    ohneGrafik: 'Diese Aufgabe hat keine Grafik. Alle Zahlen stehen in der Ausgabe von <code>summary()</code>.' },

  { id: 'a3', n: 3, titel: 'Was heißt das in Prozent?', pflicht: true, grund: 'g3',
    frage: 'Was bringt eine Stufe mehr Pflichtgefühl, in Prozent ausgedrückt, und bringt sie allen gleich viel?',
    ziel: 'du hast für zwei Beispielpersonen vorhergesagt, wie wahrscheinlich sie wählen wollen, mit und ohne eine Stufe mehr Pflichtgefühl, und kannst erklären, warum derselbe Faktor verschieden viele Prozentpunkte bringt. Du kennst den AME als eine Zahl für alle.',
    info: 'Zwei Beispielpersonen. Person A stimmt „eher nicht zu“, dass Wählen Bürgerpflicht ist, und interessiert sich „wenig“ für Politik. Person B stimmt „eher zu“ und interessiert sich „stark“. Auf den umgepolten Skalen (Pflichtgefühl: 1 = stimme gar nicht zu, 2 = stimme eher nicht zu, 3 = stimme eher zu, 4 = stimme voll zu; Interesse: 1 = überhaupt nicht, 2 = wenig, 3 = mittel, 4 = stark, 5 = sehr stark) hat A also <code>pflicht</code> 2 und <code>interesse</code> 2, B hat <code>pflicht</code> 3 und <code>interesse</code> 4. Die Zahlen des Modells kennst du aus Aufgabe 2: Konstante −2.154, B für pflicht 1.326, B für interesse 0.340.',
    schritte: [
      { id: 'a3-p', art: 'festlegen', titel: 'Erst festlegen', vorhersage: fest('a3') },
      { id: 'a3-1', art: 'code', titel: 'Person A von Hand', wk: ['a3h'], neu: true,
        text: '<code>exp()</code> ist neu. Die Vorlage rechnet eine Person mit 1 und 1 (stimme gar nicht zu, überhaupt kein Interesse). Setz im Journal an den beiden markierten Stellen die Werte von Person A ein: die erste Stelle ist das Pflichtgefühl, die zweite das Interesse. R zeigt nacheinander Logit, Chance und Wahrscheinlichkeit.',
        mehr: [warum('Was rechnen die drei Zeilen?', 'Erst der Logit: Konstante + B × Wert für jeden Prädiktor. Dann die Chance: <code>exp(logit)</code>. Dann die Wahrscheinlichkeit: Chance / (1 + Chance). R zeigt sie als Anteil: 0.38 heißt 38 %.', 'k3-rueckweg')] },
      { id: 'a3-2', art: 'code', titel: 'Vier Personen mit predict()', wk: ['a3p'], neu: true, bekannt: 'Modell wie in Aufgabe 2',
        text: '<code>tibble()</code> und <code>predict()</code> sind neu. Jetzt rechnet R für vier Personen auf einmal: A, A mit einer Stufe mehr Pflichtgefühl, B und B mit einer Stufe mehr. Jede Spalte in <code>tibble()</code> zählt mit <code>c()</code> vier Werte auf, einen je Person. Die ersten zwei Personen stehen schon da. Setz im Journal an den markierten Stellen die Werte für B (pflicht 3, interesse 4) und B mit einer Stufe mehr (pflicht 4, interesse 4) ein.',
        mehr: [warum('Wie lese ich die Ausgabe?', 'Unter 1 bis 4 stehen die Wahrscheinlichkeiten der vier Personen, als Anteil: 0.76 heißt 76 %. Prozentpunkte: Person 2 minus Person 1 und Person 4 minus Person 3, jeweils mal 100.', 'k3-predict')] },
      { id: 'a3-3', art: 'code', titel: 'Eine Zahl für alle: der AME', wk: ['a3m'], neu: true, bekannt: 'Modell wie in Aufgabe 2',
        text: '<code>marginal_effects()</code> ist neu. Lies in der Ausgabe den AME des Pflichtgefühls.',
        mehr: [warum('Was ist der AME?', 'Der durchschnittliche marginale Effekt sagt, um wie viele Prozentpunkte sich die Wahrscheinlichkeit je Einheit im Mittel über alle Befragten im Modell ändert. R zeigt ihn als Anteil.', 'k3-ame')] },
      { id: 'a3-4', art: 'fragen', titel: 'Ergebnis festhalten', fragen: fragen('a3') },
      { id: 'a3-5', art: 'nachbild', titel: 'Im Bild: Person A und Person B', baustein: 'PersonAB',
        text: 'Wo stehen A und B auf ihrer S-Kurve? Das Bild erscheint, sobald du die Fragen in Schritt 5 geprüft hast, damit es die Antworten nicht vorwegnimmt.' },
    ],
    plenum: 'Welche Zahl gehört in eine Pressemitteilung: Exp(B) des Pflichtgefühls, die Prozentpunkte für Person A oder für Person B oder der AME? Bring eine Antwort mit Begründung mit und einen Satz, wie eine Zeitung die Zahl falsch verstehen könnte.',
    probier: { idee: 'Wie sieht die S-Kurve des Pflichtgefühls aus, wenn das Interesse mittel ist?', code: T.frei_a3.code },
    ohneGrafik: 'Alle Zahlen stehen in den Ausgaben der drei Vorlagen. Das Bild in Schritt 6 hat eine Textfassung.' },

  { id: 'a4', n: 4, titel: 'Erkennt das Modell, wer nicht wählen will?', pflicht: false, grund: 'g4',
    frage: 'Wie gut sagen Pflichtgefühl und Interesse die Wahlabsicht vorher?',
    ziel: 'du kannst die Trefferquote des Modells mit der einfachsten Regel vergleichen, das −2LL des Nullmodells ausrechnen und Nagelkerke R² richtig in einen Satz bringen.',
    schritte: [
      { id: 'a4-p', art: 'festlegen', titel: 'Erst festlegen', vorhersage: fest('a4') },
      { id: 'a4-1', art: 'code', titel: 'Die Güte-Tabellen ansehen', wk: ['a4'], bekannt: 'Modell wie in Aufgabe 2',
        text: 'Die Vorlage schätzt das Modell aus Aufgabe 2, diesmal mit dem Blick auf Classification Table, Model Summary und Omnibus Tests.',
        mehr: [warum('Was steht in den drei Tabellen?', 'Classification Table: wie oft das Modell mit der Schwelle 50 % richtig liegt, insgesamt und je Antwort. Model Summary: −2 Log Likelihood und Pseudo-R². Omnibus Tests: Chi-square und Sig., der Vergleich mit dem Nullmodell.', 'k4-tabellen')] },
      { id: 'a4-2', art: 'code', titel: 'Die Regel „alle wählen“', wk: ['a4r'],
        text: 'Wie oft läge die Regel „alle wählen“ richtig? Die Vorlage rechnet noch das Smartphone-Beispiel aus Verstehen (im Kommentar steht „Grundlage 4“). Tausch im Journal die drei markierten Zahlen: oben die beiden Zellen der Zeile „würde wählen“, unten die Summe aller vier Zellen der Classification Table.',
        mehr: [warum('Woher kommt die Summe?', 'Die Summe aller vier Zellen ist N oben in der Ausgabe (gewichtet).', 'k4-treffer')] },
      { id: 'a4-3', art: 'code', titel: '−2LL des Nullmodells', wk: ['a4l'],
        text: 'Die Vorlage rechnet noch das Smartphone-Beispiel aus Verstehen. Tausch im Journal die beiden Zahlen gegen −2 Log Likelihood (Model Summary) und Chi-square (Omnibus Tests) deines Modells.',
        mehr: [warum('Was ist das Nullmodell?', 'Ein Modell, das nur die Konstante kennt und allen denselben Anteil vorhersagt. Es steht nicht direkt in der Ausgabe: −2LL des Modells plus Chi-square ergibt es.', 'k4-2ll')] },
      { id: 'a4-4', art: 'fragen', titel: 'Ergebnis festhalten', fragen: fragen('a4') },
    ],
    probier: { idee: 'Wie gut ist ein Modell nur mit dem Interesse? Vergleich die Kopfzeile mit deinem Modell.', code: T.frei_a4.code },
    ohneGrafik: 'Diese Aufgabe hat keine Grafik. Alle Zahlen stehen in der Ausgabe von <code>summary()</code>.' },
];

/* ---------- Weiter, wenn du magst ---------- */
const FREI = {
  a1: [
    { stufe: 'Abwandeln', text: 'Rechne die Chance für alle vier Stufen aus. Wie wächst sie von Stufe zu Stufe?', tipp: 'Mit der Vorlage aus Schritt 5: je Zeile der Kreuztabelle Prozent „würde wählen“ geteilt durch Prozent „würde nicht wählen“.' },
    { stufe: 'Erweitern', text: 'Was sagt eine Gerade (lineare Regression aus Sitzung 9) für die vier Stufen voraus?', tipp: 'Nimm die Vorlage aus Schritt 3 und ersetze <code>crosstab(…)</code> durch <code>linear_regression(waehlen ~ pflicht, weights = wghtpew) %&gt;% summary()</code>. Rechne dann Konstante + B × 4: Wie nah kommt die Vorhersage an 1?' },
    { stufe: 'Eigene Frage', text: 'Hängt die Wahlabsicht auch mit dem politischen Interesse zusammen? Steigen die Anteile gleichmäßig?', tipp: 'Bilde in <code>mutate()</code> zusätzlich <code>interesse = rec(pa02a, rules = "rev")</code> und nimm <code>crosstab(interesse, waehlen, percentages = "row", weights = wghtpew)</code>.' },
  ],
  a2: [
    { stufe: 'Abwandeln', text: 'Bleibt Exp(B) des Pflichtgefühls, wenn auch das Alter im Modell ist?', tipp: 'Schreib <code>waehlen ~ pflicht + interesse + age</code>. Vergleich Exp(B) von <code>pflicht</code> mit deinem Modell und achte auf N.' },
    { stufe: 'Erweitern', text: 'Was ändert die Gewichtung am Ergebnis?', tipp: 'Lass <code>, weights = wghtpew</code> weg und vergleich Exp(B) des Pflichtgefühls mit dem gewichteten Modell.' },
    { stufe: 'Eigene Frage', text: 'Welche andere Einstellung könnte mit der Wahlabsicht zusammenhängen?', tipp: 'Tipp im Journal ein paar Buchstaben eines Stichworts und drück <kbd>Tab</kbd>: Die Vorschläge zeigen Variablen mit ihrer Frage. Höhere Werte sollten „mehr“ heißen, sonst polst du mit <code>rules = "rev"</code> um.' },
  ],
  a3: [
    { stufe: 'Abwandeln', text: 'Wie sieht die S-Kurve des Pflichtgefühls aus, wenn das Interesse mittel ist?', tipp: 'In <code>tibble()</code>: <code>pflicht = c(1, 2, 3, 4)</code> und <code>interesse = c(3, 3, 3, 3)</code>. Zwischen welchen Stufen ist der Sprung am größten?' },
    { stufe: 'Erweitern', text: 'Rechne Person B auch von Hand und vergleich mit predict().', tipp: 'In der Vorlage aus Schritt 2 setzt du 3 und 4 ein. Die Wahrscheinlichkeit sollte nahe an der dritten Zahl aus <code>predict()</code> liegen; kleine Abweichungen kommen vom Runden.' },
    { stufe: 'Eigene Frage', text: 'Bau dir eine eigene Beispielperson, etwa mit deinen eigenen Antworten.', tipp: 'Eine fünfte Person in <code>tibble()</code>: je eine Zahl mehr in beiden <code>c()</code>. Jede Spalte braucht gleich viele Werte.' },
  ],
  a4: [
    { stufe: 'Abwandeln', text: 'Wie gut ist ein Modell nur mit dem Interesse?', tipp: 'Lass das Pflichtgefühl weg und vergleich in der Kopfzeile Nagelkerke R2, chi2 und Accuracy mit deinem Modell. Achte auf N: Ohne das Pflichtgefühl stecken mehr Befragte im Modell.' },
    { stufe: 'Erweitern', text: 'Wie oft läge die Regel „alle wollen nicht wählen“ richtig?', tipp: 'Mit der Vorlage aus Schritt 3: oben die beiden Zellen der Zeile „würde nicht wählen“.' },
    { stufe: 'Eigene Frage', text: 'Welches Merkmal könnte helfen, die zu erkennen, die nicht wählen wollen?', tipp: 'Nimm es mit <code>+</code> ins Modell und schau in der Classification Table auf die Zeile „würde nicht wählen“, Spalte % Correct.' },
  ],
};

return { TASKS, FREI };
};
