/* Kapitel 11 „Logistische Regression“: Aufgaben und Zusatzinfos für die Lernpfad-Engine.
   Wird nach daten.js geladen; die Engine ruft window.KAPITEL(hilfen) einmal auf.
   Antwortprüfung mit den Sonderfällen aus content.ts (SPECIAL): PRUEFEN in bausteine.tsx. */
'use strict';
window.KAPITEL = ({ D, T, esc, warum, probier, denk }) => {

/* Kapitel 11 hat keine Aufgabenbilder (kein src/chapter/s11/bilder/), also kein D.SVG. denkHtml in der Engine fragt
   D.SVG[bild] aber auch für Bilder aus „Verstehen“ (BILDER in inhalt.tsx) ab; ein leeres Objekt verhindert den Fehler. */
D.SVG = D.SVG || {}; D.ALT = D.ALT || {};

/* Festlegung mit Auflösung: PREDICTIONS aus content.ts, „resolution“ erscheint, sobald alle Fragen der Aufgabe richtig sind. */
const fest = k => ({ ...D.PREDICTIONS[k], aufloesung: D.PREDICTIONS[k].resolution });

/* Die Rückmeldungen in content.ts verweisen auf die alten Grundlagen („Grundlage 2b“). Hier zeigen sie auf die Karten in „Verstehen“.
   Dieselbe Zuordnung nutzt PRUEFEN in bausteine.tsx für die Sonderfälle. Frage-IDs und Zielwerte bleiben unverändert. */
const KARTE = { '1b': 'Warum eine Gerade scheitert', '1c': 'Drei Sprachen', '2b': 'Exp(B): ein Faktor für die Chance', '3b': 'Gleicher Faktor, verschiedene Prozentpunkte', '3c': 'Eine Zahl im Mittel: der AME', '4a': 'Die Trefferquote einordnen', '4c': 'Pseudo-R²' };
const neuerVerweis = t => t.replace(/Grundlage (\d[a-c])/g, (m, k) => KARTE[k] ? `„${KARTE[k]}“ in Verstehen` : m);
/* Die Texte zählen die Schritte ohne „Erst festlegen“; auf der Seite ist Festlegen Schritt 1, alle anderen rücken eins weiter. */
const nr = t => t.replace(/Schritt (\d)(?: und (\d))?/g, (m, a, b) => 'Schritt ' + (+a + 1) + (b ? ' und ' + (+b + 1) : ''));
const neu = t => (t == null ? t : neuerVerweis(nr(t)));
const fragen = k => D.QUESTIONS[k].map(q => ({ ...q, right: neu(q.right), hint: neu(q.hint), help: neu(q.help) }));
Object.keys(D.HINTS).forEach(k => { D.HINTS[k] = D.HINTS[k].map(neu); });
/* „R meldet einen Fehler“: gearbeitet wird im Journal, nicht in einer Werkstatt. */
D.ERROR_HELP = D.ERROR_HELP.map(r => ({ ...r, says: r.says.map(x => (typeof x === 'string' ? x.replace(' (in der Werkstatt: ', ' (im Journal: ') : x)) }));

const RSTUDIO = warum('Lieber in RStudio?', 'Dann führst du dort vorher den Startblock aus (Pakete laden, ALLBUS einlesen). Danach kopierst du die Vorlage mit <b>Kopieren</b> in dein ⟪Skript⟫. Jede Vorlage bildet die Variablen, die sie braucht, selbst.<pre>' + esc(T.start.code) + '</pre>', 'r1');
const GEWICHT = warum('Warum weicht N ab?', 'Alle Zahlen in diesem Kapitel sind ⟪gewichtet⟫ mit <code>wghtpew</code>, genau wie die Ausgabe deiner Vorlagen (kennst du aus Sitzung 6). Darum steht unter N oft eine gewichtete Zahl, die etwas von der Zahl der befragten Personen abweicht.');

/* ---------- Aufgaben ---------- */
const TASKS = [
  { id: 'a1', n: 1, titel: 'Wer will wählen gehen?', pflicht: true, grund: 'g1',
    frage: 'Wie hängt die Absicht zu wählen damit zusammen, ob jemand Wählen für eine Bürgerpflicht hält?',
    ziel: 'du hast die Wahlabsicht als ⟪dichotome Variable|dichotom⟫ gebildet, also mit nur 0 und 1. Du liest in einer ⟪Kreuztabelle⟫, wie der Anteil der Wählenden mit dem Pflichtgefühl steigt. Mit zwei kleinen Rechnungen zeigst du, warum eine Gerade hier an ihre Grenze stößt und was die Odds (Chance) sind.',
    info: 'Der ALLBUS fragt, welche Partei man wählen würde, wenn am nächsten Sonntag Bundestagswahl wäre (<code>pv01</code>). Eine Antwort ist „würde nicht wählen“ (Code 91). Außerdem sollten die Befragten sagen, wie sehr sie zustimmen, dass die Beteiligung an Wahlen eine Bürgerpflicht ist (<code>pe09</code>, 1 = stimme voll zu bis 4 = stimme gar nicht zu). Diese Frage wurde nur einem Teil der Befragten gestellt, gut zwei Dritteln (1.596 haben ⟪TNZ: SPLIT⟫, kennst du aus Sitzung 1). Es geht um die geäußerte Absicht, nicht um tatsächliches Wählen.',
    infoMehr: [GEWICHT],
    schritte: [
      { id: 'a1-p', art: 'festlegen', titel: 'Erst festlegen', vorhersage: fest('a1'),
        mehr: [denk('Wie lege ich mich fest?', { grund: 'k1-worum',
          kurz: 'Du schätzt, wie viele Menschen wählen wollen, obwohl sie Wählen <b>gar nicht</b> für eine Bürgerpflicht halten. Es zählt nicht, ob du richtig liegst: Deine Festlegung ist der Vergleichspunkt, an dem du später merkst, ob dich das Ergebnis überrascht.',
          denken: [
            'Lies die Frage genau: Es geht nur um die Gruppe, die bei <code>pe09</code> „stimme gar nicht zu“ sagt, nicht um alle Befragten.',
            'Frag dich: Wie sehr hängt die Entscheidung zu wählen wohl am Pflichtgefühl, und was könnte sonst eine Rolle spielen?',
            'Bedenk, dass es um die geäußerte Absicht geht, nicht um tatsächliches Wählen.',
            'Wähl einen Bereich. Ob er stimmt, siehst du, sobald alle Fragen in Schritt 6 richtig sind.',
          ],
          verwechslung: 'Pflichtgefühl und Wahlabsicht sind zwei verschiedene Fragen. Wie eng sie zusammenhängen, zeigt erst die Kreuztabelle in Schritt 3.' })] },
      { id: 'a1-1', art: 'code', titel: 'Wählen als 0/1 bilden', wk: ['a1f'], bekannt: 'rec() aus Sitzung 5, weights aus Sitzung 6',
        text: 'Bilde die 0/1-Variable <code>waehlen</code> und zähl sie aus. <code>rec()</code> macht aus allen Parteien (1 bis 90) eine 1 und aus „würde nicht wählen“ (91) eine 0; alles andere wird NA, ein ⟪fehlender Wert⟫.',
        mehr: [denk('Warum ist Wählen die 1?', { grund: 'k1-null-eins',
          kurz: 'Die Wahlabsicht hat hier nur zwei Antworten. Eine solche <b>⟪dichotome⟫</b> Variable (kurz gesagt: eine mit genau zwei ⟪Ausprägungen⟫) kodiert man mit 0 und 1; <code>rec()</code> baut sie aus den vielen Codes von <code>pv01</code>. Wählen ist die 1, weil das Modell später die Wahrscheinlichkeit der 1 vorhersagt. In Sitzung 5 war es bei <code>nichtwahl</code> andersherum.',
          denken: [
            'Lies die Regel in <code>rec()</code> Teil für Teil: Welche Codes werden zur 1, welcher zur 0, und was passiert mit allem, was in keiner Regel vorkommt?',
            'Schau in der Ausgabe von <code>frequency()</code>, wo die Fälle ohne 0 oder 1 stehen.',
            'Vergleich die Spalten Raw % und Valid %: Welche rechnet mit allen Befragten, welche nur mit ⟪gültigen Antworten⟫?',
            'Such in der Kopfzeile <code>mean=</code>: Der ⟪Mittelwert⟫ einer 0/1-Variable ist der ⟪Anteil⟫ der Einsen.',
          ],
          bild: 'ZeroOneTower', bildtext: 'Ein anderes Beispiel: die dichotome Variable <code>lm30</code> (Smartphone genannt oder nicht) von zehn Befragten, im Bild ein Turm aus Nullen und Einsen. Der Mittelwert ist der Anteil der Einsen.',
          verwechslung: 'Die 0 heißt nicht „fehlt“: 0 ist eine gültige Antwort (würde nicht wählen). Fehlende Werte sind NA und zählen bei Valid % nicht mit.' }),
          RSTUDIO] },
      { id: 'a1-2', art: 'code', titel: 'Kreuztabelle: Anteil je Stufe', wk: ['a1k'], bekannt: 'crosstab() mit Zeilenprozent aus Sitzung 5', baustein: 'Umgepolt',
        text: 'Wie viel Prozent jeder Stufe wollen wählen? <code>pe09</code> läuft von „stimme voll zu“ (1) bis „stimme gar nicht zu“ (4). Damit ein höherer Wert mehr Pflichtgefühl heißt, wird die Variable ⟪umgepolt⟫: <code>pflicht</code> läuft von 1 = stimme gar nicht zu bis 4 = stimme voll zu. Lies in der Ausgabe die ⟪Zeilenprozente⟫, die Zeilen <code>row %</code>, in der Spalte „würde wählen“.',
        mehr: [denk('Was macht rules = "rev"?', { grund: 'k1-kreuz',
          kurz: '<code>rec(pe09, rules = "rev")</code> dreht die Codes um, damit ein höherer Wert mehr Pflichtgefühl heißt. Die Antworten bleiben dieselben, nur ihre Zahlen laufen andersherum. Die ⟪Kreuztabelle⟫ aus <code>crosstab()</code> mit <b>Zeilenprozent</b> (kurz gesagt: jede Zeile für sich auf 100 %) zeigt dann je Stufe, wie viel Prozent wählen wollen.',
          denken: [
            'Schau in die kleine Tabelle unter der Vorlage: Welche Antwort hat bei <code>pflicht</code> welchen Code?',
            'Such in der Ausgabe die Zeile der Stufe, die dich interessiert, und darunter die Zeile <code>row %</code>.',
            'Geh in dieser Zeile zur Spalte „würde wählen“. Daneben steht „würde nicht wählen“; zusammen ergeben beide 100 %.',
            'Lies die vier Stufen von oben nach unten: Wie verändert sich der Anteil von Stufe zu Stufe?',
          ],
          verwechslung: '⟪Spaltenprozent⟫ statt Zeilenprozent lesen. Dann steht da, wie sich die Wählenden auf die Stufen verteilen, nicht, wie viele jeder Stufe wählen wollen.' })] },
      { id: 'a1-3', art: 'code', titel: 'Prozentpunkte je Stufe', wk: ['a1r'], bekannt: 'R als Taschenrechner aus Sitzung 1',
        text: 'Wie viele ⟪Prozentpunkte⟫ bringt eine Stufe mehr Pflichtgefühl? Die Vorlage rechnet die erste Stufe vor: von „stimme gar nicht zu“ (61.4) zu „stimme eher nicht zu“ (78.3). Tausch im Journal die beiden markierten Zahlen gegen die Werte für die letzte Stufe, von „stimme eher zu“ zu „stimme voll zu“.',
        mehr: [denk('Wie rechne ich Prozentpunkte?', { grund: 'k1-gerade',
          kurz: '<b>Prozentpunkte</b> sind die Differenz zweier Prozentzahlen; kurz gesagt: Du ziehst die eine von der anderen ab. Die Vorlage rechnet so, was die erste Stufe Pflichtgefühl bringt. Du rechnest dasselbe für die letzte Stufe und vergleichst.',
          denken: [
            'Such in deiner Kreuztabelle aus Schritt 3 die Zeilen „stimme eher zu“ und „stimme voll zu“, jeweils <code>row %</code> unter „würde wählen“.',
            'Setz die größere Zahl zuerst ein, sonst kommt eine negative Zahl heraus.',
            'Vergleich dein Ergebnis mit der ersten Stufe aus der Vorlage: größer, kleiner oder gleich?',
            'Prüf jede der drei Erklärungen in Schritt 6 an deinen vier Anteilen: Was müsstest du in der Tabelle sehen, wenn sie stimmt?',
          ],
          verwechslung: 'Prozentpunkte und Prozent: Von 50 % auf 70 % sind es 20 Prozentpunkte. „20 % mehr“ hieße etwas anderes (20 % von 50).',
          zusatz: 'Kommazahlen schreibst du in R mit Punkt: <code>12.5</code>, nicht <code>12,5</code>.' })] },
      { id: 'a1-4', art: 'code', titel: 'Einen Anteil in Odds (Chance) umrechnen', wk: ['a1c'],
        text: 'Die Odds, auf Deutsch die Chance, sind Prozent „würde wählen“ geteilt durch Prozent „würde nicht wählen“. Die Vorlage rechnet „stimme gar nicht zu“ vor. Tausch im Journal die beiden markierten Zahlen gegen die Zeile „stimme voll zu“.',
        mehr: [denk('Was ist eine Chance?', { grund: 'k1-sprachen',
          kurz: 'Die <b>Odds</b> (deutsch: <b>Chance</b>) teilen Ja durch Nein in einer Gruppe. Kurz gesagt: Du teilst zwei Prozentzahlen aus derselben Zeile. Die Vorlage rechnet das für „stimme gar nicht zu“ vor; du rechnest „stimme voll zu“.',
          denken: [
            'Such in der Kreuztabelle aus Schritt 3 die Zeile „stimme voll zu“ und darunter <code>row %</code>.',
            'Oben in die Rechnung kommt Prozent „würde wählen“, unten Prozent „würde nicht wählen“. Beide stammen aus derselben Zeile.',
            'Sprich dein Ergebnis als „… zu 1“ aus: Welche Antwort steht vor dem „zu“, welche dahinter?',
          ],
          bild: 'ThreeLanguages', bildtext: 'Ein anderes Beispiel: Von 100 Internetnutzenden zwischen 70 und 79 nennen 77,7 das Smartphone, 22,3 nicht. Dieselbe Gruppe in drei Sprachen.',
          verwechslung: 'Im Alltag heißt „Chance“ oft Wahrscheinlichkeit („die Chance liegt bei 80 %“). Hier meint Chance immer die Odds, nicht die Wahrscheinlichkeit.' })] },
      { id: 'a1-5', art: 'fragen', titel: 'Ergebnis festhalten', fragen: fragen('a1'),
        mehr: [denk('Wo lese ich das ab?', { grund: 'k1-ergebnis',
          kurz: 'Jede der sieben Fragen hat einen festen Ort: die Regel in <code>rec()</code>, eine deiner Ausgaben aus Schritt 2 und 3 oder eine deiner Rechnungen aus Schritt 4 und 5.',
          denken: [
            '<b>Andere Antworten:</b> Lies den letzten Teil der Regel in <code>rec()</code> aus Schritt 2.',
            '<b>Wie viel Prozent wählen wollen:</b> Ausgabe von Schritt 2, Zeile „würde wählen“. Welche Spalte rechnet nur mit gültigen Antworten?',
            '<b>Anteil bei „stimme gar nicht zu“:</b> Kreuztabelle aus Schritt 3, Zeile <code>row %</code>, Spalte „würde wählen“.',
            '<b>Letzte Stufe und warum so wenig:</b> deine Rechnung aus Schritt 4. Prüf jede der drei Erklärungen an deinen vier Anteilen: Was müsstest du in der Tabelle sehen, wenn sie stimmt?',
            '<b>Chance und was sie heißt:</b> deine Rechnung aus Schritt 5. Prüf jede Deutung: Spricht sie über eine Gruppe oder über zwei, über Prozent oder über ein Verhältnis?',
          ],
          verwechslung: 'Fragt die Seite nach Prozent, will sie keinen Anteil: <code>mean=</code> zeigt einen Anteil zwischen 0 und 1.' })] },
    ],
    probier: { idee: 'Was sagt eine Gerade (⟪lineare Regression⟫ aus Sitzung 9) für die vier Stufen voraus?', code: T.frei_a1.code },
    ohneGrafik: 'Alle Zahlen stehen in den Ausgaben von <code>frequency()</code> und <code>crosstab()</code>. Das Bild in Schritt 3 hat eine Textfassung.' },

  { id: 'a2', n: 2, titel: 'Was heißt Exp(B) für das Pflichtgefühl?', pflicht: true, grund: 'g2',
    frage: 'Wie stark hängt die Absicht zu wählen mit dem Pflichtgefühl zusammen, wenn man das politische Interesse berücksichtigt?',
    ziel: 'du hast ein ⟪logistisches Modell⟫ gewichtet geschätzt und kannst in einem Satz sagen, was Exp(B) für das Pflichtgefühl und für das Interesse heißt, und warum nur gut die Hälfte der Befragten im Modell steckt.',
    info: 'Du erklärst <code>waehlen</code> (1 = würde wählen) aus Aufgabe 1 mit zwei ⟪Prädiktoren⟫: dem Pflichtgefühl (<code>pflicht</code>, 1 = stimme gar nicht zu bis 4 = stimme voll zu) und dem politischen Interesse (<code>pa02a</code>, 1 = sehr stark bis 5 = überhaupt nicht, kennst du aus Sitzung 2). Auch das Interesse wird umgepolt: <code>interesse</code> läuft von 1 = überhaupt nicht bis 5 = sehr stark. Höhere Werte heißen also mehr Pflichtgefühl und mehr Interesse.',
    schritte: [
      { id: 'a2-p', art: 'festlegen', titel: 'Erst festlegen', vorhersage: fest('a2'),
        mehr: [denk('Wie lege ich mich fest?', { grund: 'k2-faktor',
          kurz: 'Du schätzt einen <b>Faktor</b>, kurz gesagt ein „mal“: Mit welcher Zahl werden die ⟪Odds⟫ (die Chance) zu wählen malgenommen, wenn das Pflichtgefühl um eine Stufe steigt und das Interesse gleich bleibt? Es zählt nicht, ob du richtig liegst: Deine Festlegung ist der Vergleichspunkt, an dem du später merkst, ob dich das Ergebnis überrascht.',
          denken: [
            'Ein Faktor von 1 hieße: Die Chance bleibt gleich, kein Zusammenhang. Je weiter der Faktor von 1 weg ist, desto stärker der Zusammenhang.',
            'Erinnere dich an die Kreuztabelle aus Aufgabe 1: Wie verschieden waren die Stufen des Pflichtgefühls?',
            'Wähl eine Antwort. Ob sie stimmt, siehst du, sobald alle Fragen in Schritt 6 richtig sind.',
          ],
          verwechslung: 'Ein Faktor von 1,2 heißt nicht „1,2 % mehr“, sondern: Die Chance wird um 20 % größer.' })] },
      { id: 'a2-1', art: 'code', titel: 'Das logistische Modell schätzen', wk: ['a2'], neu: true, bekannt: 'mutate() mit rec() wie in Aufgabe 1',
        text: 'Die Vorlage bildet die Variablen wie in Aufgabe 1 und schätzt ein Modell, zunächst nur mit dem Pflichtgefühl. Lies in „Variables in the Equation“ Exp(B) für <code>pflicht</code> (3.888).',
        mehr: [denk('Wo steht was in der Ausgabe?', { grund: 'k2-ausgabe',
          kurz: 'Die ⟪Funktion⟫ <code>logistic_regression()</code> schätzt eine ⟪logistische Regression⟫, also ein Modell für eine 0/1-Variable. Aufgebaut ist sie wie <code>linear_regression()</code> aus Sitzung 9: links von <code>~</code> die ⟪abhängige Variable⟫ (0/1), rechts der Prädiktor, gewichtet. <code>summary()</code> zeigt viele Tabellen; für das Deuten brauchst du zuerst drei Stellen.',
          denken: [
            'Ganz oben <code>N:</code>, die gewichtete Zahl der ⟪Fälle⟫ im Modell. Vergleich sie mit der Zahl der Befragten: Wer könnte fehlen?',
            '„Dependent Variable Encoding“: Welche Antwort hat den Internal Value 1? Über sie spricht das ganze Modell.',
            '„Variables in the Equation“, Zeile <code>pflicht</code>: B zeigt die Richtung, ⟪Sig.⟫, ob der Zusammenhang signifikant ist, Exp(B) einen Faktor. Wofür er gilt, klärst du in Schritt 5.',
            'Die Zeile <code>(Intercept)</code> ist die ⟪Konstante⟫, kein Prädiktor.',
          ],
          bild: 'ReadOutput', bildtext: 'Ein anderes Beispiel: die Ausgabe des Smartphone-Modells aus „R lesen“. Die Knöpfe markieren die drei Stellen.',
          verwechslung: '<code>logistic_regression()</code> mit <code>pv01</code> statt <code>waehlen</code>: R meldet „must be binary“. Erst mit <code>rec()</code> eine 0/1-Variable bilden.' })] },
      { id: 'a2-2', art: 'journal', titel: 'Das Interesse dazunehmen', bekannt: 'mehrere Prädiktoren mit + aus Sitzung 10',
        text: 'Ändere im Journal deinen Block aus Schritt 2: Ersetze die markierte Stelle <code>pflicht</code> durch <code>pflicht + interesse</code>. Die Zeile heißt dann <code>logistic_regression(waehlen ~ pflicht + interesse, weights = wghtpew)</code>. Führe den Block erneut aus. Lies zuerst „Dependent Variable Encoding“, dann in „Variables in the Equation“ beide Zeilen.',
        mehr: [denk('Warum ändert sich Exp(B) des Pflichtgefühls?', { grund: 'k2-zwei',
          kurz: 'Mit <code>pflicht + interesse</code> stehen zwei Prädiktoren im Modell. Dann gilt jedes Exp(B) <b>bei gleichem Wert des anderen</b>, wie B in der multiplen Regression aus Sitzung 10. Fachlich heißt das: Der andere Prädiktor wird ⟪kontrolliert⟫. Darum kann sich Exp(B) des Pflichtgefühls gegenüber Schritt 2 ein wenig ändern.',
          denken: [
            'Ersetze nur die markierte Stelle und führe den ganzen Block erneut aus, auch den Teil mit <code>mutate()</code>.',
            'Prüf zuerst „Dependent Variable Encoding“: Ist die 1 dieselbe Antwort wie in Schritt 2?',
            'Such unter „Variables in the Equation“ die zwei Zeilen <code>pflicht</code> und <code>interesse</code>.',
            'Vergleich Exp(B) von <code>pflicht</code> mit dem Wert aus Schritt 2: größer oder kleiner? Was könnte das mit dem Interesse zu tun haben?',
          ],
          verwechslung: 'Exp(B) deutlich unter 1, obwohl mehr Pflichtgefühl mit mehr Wahlabsicht einhergehen sollte? Dann ist etwas andersherum: Ist „würde wählen“ die 1, und sind <code>pe09</code> und <code>pa02a</code> umgepolt?' })] },
      { id: 'a2-3', art: 'code', titel: 'Exp(B) in Prozent', wk: ['a2r'], bekannt: 'R als Taschenrechner aus Sitzung 1',
        text: 'Wie viel Prozent mehr Chance bringt eine Stufe mehr Interesse? Die Vorlage rechnet noch das Smartphone-Beispiel aus Verstehen vor (Alter, 0.927; im Kommentar steht „Grundlage 2“). Tausch im Journal die markierte Zahl gegen Exp(B) des Interesses.',
        mehr: [denk('Warum minus 1?', { grund: 'k2-faktor',
          kurz: 'Exp(B) ist ein Faktor. Ein Faktor von 1 heißt „bleibt gleich“, also 0 % Veränderung. Darum ziehst du 1 ab und nimmst mal 100: So wird aus dem Faktor eine <b>Veränderung in Prozent</b>. Die Vorlage rechnet das Smartphone-Beispiel vor.',
          denken: [
            'Such in der Ausgabe von Schritt 3, dem Modell mit beiden Prädiktoren, die Zeile <code>interesse</code>.',
            'Nimm die Spalte Exp(B), nicht B.',
            'Tausch in der Vorlage nur die markierte Zahl; Klammer, <code>- 1</code> und <code>* 100</code> bleiben stehen.',
            'Prüf das Vorzeichen: Ein Faktor über 1 ergibt ein Plus, einer unter 1 ein Minus.',
          ],
          bild: 'FormulaPercent', bildtext: 'Am Smartphone-Beispiel aus der Vorlage: Exp(B) = 0,927 für das Alter.',
          verwechslung: 'Den Faktor selbst als Prozent lesen. Exp(B) = 0,927 heißt nicht 0,927 %, sondern: Die Chance sinkt um 7,3 % je Lebensjahr.' })] },
      { id: 'a2-4', art: 'lesen', titel: 'Deuten: ein Faktor wofür?',
        text: 'Bevor du die Sätze in Schritt 6 beurteilst: Exp(B) ist ein Faktor. Wofür gilt er: für die Wahrscheinlichkeit, für die Chance oder für Prozentpunkte? Und unter welcher Bedingung, jetzt, da zwei Prädiktoren im Modell sind?',
        mehr: [denk('Wahrscheinlichkeit oder Chance?', { grund: 'k2-faktor',
          kurz: 'Exp(B) ist ein <b>Faktor</b>, kurz gesagt ein „mal“. Bevor du in Schritt 6 Sätze beurteilst, klärst du zwei Dinge: Worauf wirkt dieser Faktor, und unter welcher Bedingung gilt er, jetzt, da zwei Prädiktoren im Modell sind?',
          denken: [
            'Geh die drei Kandidaten durch: Wahrscheinlichkeit, Chance, Prozentpunkte.',
            'Probier jeden Kandidaten an einer Zahl aus Aufgabe 1 aus.',
            'Denk an Schritt 3: Was hält das Modell fest, wenn du Exp(B) des Pflichtgefühls liest?',
          ],
          verwechslung: 'B und Exp(B) verwechseln: B steht in Logits und wird addiert, Exp(B) ist der Faktor und wird malgenommen.' })] },
      { id: 'a2-5', art: 'fragen', titel: 'Ergebnis festhalten', fragen: fragen('a2'),
        mehr: [denk('Wo lese ich das ab?', { grund: 'k2-ergebnis',
          kurz: 'Alle Fragen in Schritt 6 beziehen sich auf das Modell mit beiden Prädiktoren, also auf deine Ausgabe nach Schritt 3, und auf deine Rechnung aus Schritt 4.',
          denken: [
            '<b>Wofür das Modell vorhersagt:</b> „Dependent Variable Encoding“, die Antwort mit dem Internal Value 1.',
            '<b>Exp(B) des Pflichtgefühls:</b> „Variables in the Equation“, Zeile <code>pflicht</code>, Spalte Exp(B).',
            '<b>Der richtige Satz:</b> deine Überlegung aus Schritt 5. Prüf bei jedem Satz: Worauf wirkt der Faktor, und unter welcher Bedingung gilt er?',
            '<b>Das Interesse in Prozent:</b> deine Rechnung aus Schritt 4.',
            '<b>Warum so wenige im Modell:</b> Vergleich <code>N:</code> mit der Zahl der Befragten. Was weißt du aus Aufgabe 1 über die Antworten zu <code>pe09</code> und <code>pv01</code>?',
          ],
          verwechslung: 'Das Modell aus Schritt 2 (nur Pflichtgefühl) statt des Modells mit beiden Prädiktoren ablesen, oder B statt Exp(B).' })] },
    ],
    probier: { idee: 'Bleibt der Zusammenhang, wenn auch das Alter im Modell ist?', code: T.frei_a2.code },
    ohneGrafik: 'Diese Aufgabe hat keine Grafik. Alle Zahlen stehen in der Ausgabe von <code>summary()</code>.' },

  { id: 'a3', n: 3, titel: 'Was heißt das in Prozent?', pflicht: true, grund: 'g3',
    frage: 'Was bringt eine Stufe mehr Pflichtgefühl, in Prozent ausgedrückt, und bringt sie allen gleich viel?',
    ziel: 'du hast für zwei Beispielpersonen berechnet, wie wahrscheinlich sie wählen wollen (die ⟪vorhergesagte Wahrscheinlichkeit⟫), mit und ohne eine Stufe mehr Pflichtgefühl, und kannst erklären, warum derselbe Faktor verschieden viele Prozentpunkte bringt. Du kennst den AME als eine Zahl für alle.',
    info: 'Zwei Beispielpersonen. Person A stimmt „eher nicht zu“, dass Wählen Bürgerpflicht ist, und interessiert sich „wenig“ für Politik. Person B stimmt „eher zu“ und interessiert sich „stark“. Auf den umgepolten Skalen (Pflichtgefühl: 1 = stimme gar nicht zu, 2 = stimme eher nicht zu, 3 = stimme eher zu, 4 = stimme voll zu; Interesse: 1 = überhaupt nicht, 2 = wenig, 3 = mittel, 4 = stark, 5 = sehr stark) hat A also <code>pflicht</code> 2 und <code>interesse</code> 2, B hat <code>pflicht</code> 3 und <code>interesse</code> 4. Die Zahlen des Modells kennst du aus Aufgabe 2: ⟪Konstante⟫ −2.154, B für pflicht 1.326, B für interesse 0.340.',
    schritte: [
      { id: 'a3-p', art: 'festlegen', titel: 'Erst festlegen', vorhersage: fest('a3'),
        mehr: [denk('Wie lege ich mich fest?', { grund: 'k3-zwei-schritte',
          kurz: 'Beide Personen bekommen eine Stufe mehr Pflichtgefühl. Du schätzt, bei wem die <b>Wahrscheinlichkeit</b> zu wählen dadurch um mehr <b>⟪Prozentpunkte⟫</b> steigt; kurz gesagt: um mehr Punkte auf der Skala von 0 bis 100 %. Es zählt nicht, ob du richtig liegst: Deine Festlegung ist dein Vergleichspunkt.',
          denken: [
            'Lies, wie A und B beschrieben sind: Wer hält Wählen eher für eine Pflicht, wer interessiert sich mehr für Politik?',
            'Frag dich, wo jede Person vor dem Schritt ungefähr steht: eher in der Mitte zwischen 0 und 100 % oder schon nah an einem Ende?',
            'Wähl eine Antwort. Ob sie stimmt, siehst du, sobald alle Fragen in Schritt 5 richtig sind.',
          ],
          verwechslung: 'Prozentpunkte und Prozent: Von 50 % auf 70 % sind es 20 Prozentpunkte. „20 % mehr“ hieße etwas anderes (20 % von 50).' })] },
      { id: 'a3-1', art: 'code', titel: 'Person A von Hand', wk: ['a3h'], neu: true,
        text: '<code>exp()</code> ist neu. Die Vorlage rechnet eine Person mit 1 und 1 (stimme gar nicht zu, überhaupt kein Interesse). Setz im Journal an den beiden markierten Stellen die Werte von Person A ein: die erste Stelle ist das Pflichtgefühl, die zweite das Interesse. R zeigt nacheinander Logit, Chance und Wahrscheinlichkeit.',
        mehr: [denk('Was rechnen die drei Zeilen?', { grund: 'k3-rueckweg',
          kurz: 'Die ⟪logistische Regression⟫ rechnet in Logits. Die Vorlage geht den Weg zurück, in drei Zeilen: erst der <b>⟪Logit⟫</b> (Konstante + B × Wert für jeden Prädiktor), dann mit <code>exp()</code> die <b>⟪Chance⟫</b>, dann Chance / (1 + Chance), die <b>Wahrscheinlichkeit</b>. <code>exp()</code> rechnet „e hoch“.',
          denken: [
            'Hol die Werte von Person A aus der Aufgabenbeschreibung, auf den umgepolten Skalen.',
            'Setz sie in der richtigen Reihenfolge ein: Die erste markierte Stelle steht hinter dem B des Pflichtgefühls, die zweite hinter dem B des Interesses.',
            'Führe alle Zeilen aus. R zeigt drei Zahlen: Welche ist der Logit, welche die Chance, welche die Wahrscheinlichkeit?',
            'Die Wahrscheinlichkeit steht als Anteil da: 0.38 heißt 38 %.',
          ],
          bild: 'WayBack', bildtext: 'Ein anderes Beispiel: eine 70-Jährige im Smartphone-Modell, in drei Schritten vom Logit zurück zur Wahrscheinlichkeit.',
          verwechslung: 'Die Chance als Wahrscheinlichkeit lesen. Wahrscheinlichkeiten liegen zwischen 0 und 1; eine Chance von 4,28 heißt „4,28 zu 1“, also 81,1 %.' })] },
      { id: 'a3-2', art: 'code', titel: 'Vier Personen mit predict()', wk: ['a3p'], neu: true, bekannt: 'Modell wie in Aufgabe 2',
        text: '<code>tibble()</code> und <code>predict()</code> sind neu. Jetzt rechnet R für vier Personen auf einmal: A, A mit einer Stufe mehr Pflichtgefühl, B und B mit einer Stufe mehr. Jede Spalte in <code>tibble()</code> zählt mit <code>c()</code> vier Werte auf, einen je Person. Die ersten zwei Personen stehen schon da. Setz im Journal an den markierten Stellen die Werte für B (pflicht 3, interesse 4) und B mit einer Stufe mehr (pflicht 4, interesse 4) ein.',
        mehr: [denk('Wie lese ich die Ausgabe?', { grund: 'k3-predict',
          kurz: '<code>tibble()</code> baut eine kleine Tabelle von Hand: jede Zeile eine Person, jede Spalte ein ⟪Prädiktor⟫. <code>predict(…, type = "response")</code> gibt für jede Person die <b>⟪vorhergesagte Wahrscheinlichkeit⟫</b> einer 1. So rechnet R vier Personen auf einmal, mit allen Stellen.',
          denken: [
            'Lies die beiden <code>c()</code> spaltenweise: Die erste Zahl in <code>pflicht</code> gehört zur ersten Zahl in <code>interesse</code>, und so weiter.',
            'Prüf vor dem Ausführen: Stehen an dritter und vierter Stelle die Werte von B und von B mit einer Stufe mehr?',
            'Über den Zahlen der Ausgabe stehen 1 bis 4, die vier Personen. Darunter stehen Anteile.',
            'Prozentpunkte: Person 2 minus Person 1 und Person 4 minus Person 3, jeweils mal 100. Vergleich die beiden Differenzen.',
          ],
          verwechslung: '<code>predict()</code> ohne <code>type = "response"</code>: Dann stehen da Logits, keine Wahrscheinlichkeiten.' })] },
      { id: 'a3-3', art: 'code', titel: 'Eine Zahl für alle: der AME', wk: ['a3m'], neu: true, bekannt: 'Modell wie in Aufgabe 2',
        text: '<code>marginal_effects()</code> ist neu. Lies in der Ausgabe den AME des Pflichtgefühls.',
        mehr: [denk('Was ist der AME?', { grund: 'k3-ame',
          kurz: 'Der <b>durchschnittliche marginale Effekt</b> (AME) sagt, um wie viele Prozentpunkte sich die Wahrscheinlichkeit je Einheit im Mittel über alle Befragten im Modell ändert. Kurz gesagt: eine Zahl in Prozentpunkten für alle zusammen. <code>marginal_effects()</code> rechnet ihn, <code>summary()</code> zeigt ihn als Tabelle.',
          denken: [
            'Such in der Tabelle die Zeile <code>pflicht</code>, Spalte AME.',
            'R zeigt den AME als Anteil. Wie wird daraus eine Zahl in Prozentpunkten?',
            'Vergleich ihn mit deinen Prozentpunkten für A und B aus Schritt 3: Wo liegt er?',
            'Frag dich: Für wen gilt diese Zahl, für eine bestimmte Person oder für alle im Modell zusammen?',
          ],
          verwechslung: 'Den Anteil für Prozentpunkte halten: Beim Smartphone-Modell heißt −0.005 −0,5 Prozentpunkte je Lebensjahr.' })] },
      { id: 'a3-4', art: 'fragen', titel: 'Ergebnis festhalten', fragen: fragen('a3'),
        mehr: [denk('Wo lese ich das ab?', { grund: 'k3-ergebnis',
          kurz: 'Die Fragen in Schritt 5 folgen den drei Vorlagen: erst Person A von Hand, dann die vier Personen mit <code>predict()</code>, dann der AME. Zum Schluss wählst du, was bei A und B gleich ist, und einen Satz für einen Bericht.',
          denken: [
            '<b>Chance und Wahrscheinlichkeit von A:</b> die zweite und dritte Zahl aus Schritt 2. Gefragt ist Prozent, R zeigt einen Anteil.',
            '<b>Prozentpunkte bei A und bei B:</b> die vier Anteile aus Schritt 3, jeweils die Differenz mal 100.',
            '<b>Was bei beiden gleich ist:</b> Geh die drei Sprachen durch, Logit, Chance, Wahrscheinlichkeit. Rechne für A und B in jeder der drei Sprachen nach, was sich ändert.',
            '<b>Der AME:</b> Schritt 4, Zeile <code>pflicht</code>, Spalte AME, mal 100.',
            '<b>Satz für den Bericht:</b> Welche Zahl verstehen Leserinnen ohne Statistik, und für wen gilt sie?',
          ],
          verwechslung: 'Anteil und Prozent: R zeigt etwa 0.55, gemeint sind 55 %.' })] },
      { id: 'a3-5', art: 'nachbild', titel: 'Im Bild: Person A und Person B', baustein: 'PersonAB',
        text: 'Wo stehen A und B auf ihrer S-Kurve, der Kurve der ⟪logistischen Regression⟫? Das Bild erscheint, sobald du die Fragen in Schritt 5 geprüft hast, damit es die Antworten nicht vorwegnimmt.',
        mehr: [denk('Was zeigt das Bild?', { grund: 'k3-ergebnis',
          kurz: 'Das Bild zeigt für Person A und Person B je eine S-Kurve über die vier Stufen des Pflichtgefühls und, wie weit jede Person mit ihrer zusätzlichen Stufe nach oben kommt. Es erscheint erst, wenn du die Fragen in Schritt 5 geprüft hast.',
          denken: [
            'Such auf jeder Kurve den Punkt vor und den Punkt nach der zusätzlichen Stufe.',
            'Vergleich, wie weit es jeweils nach oben geht, mit deinen Prozentpunkten aus Schritt 5.',
            'Frag dich: Wo ist die Kurve steil, wo flach, und wo steht jede Person?',
            'Halt deine Festlegung aus Schritt 1 daneben.',
          ],
          verwechslung: 'Die Höhe eines Punkts ist eine Wahrscheinlichkeit, keine Chance.',
          zusatz: 'Die Kurven sind mit den gerundeten Zahlen aus Aufgabe 2 gezeichnet, die Punkte stammen aus <code>predict()</code>.' })] },
    ],
    plenum: 'Welche Zahl gehört in eine Pressemitteilung: Exp(B) des Pflichtgefühls, die Prozentpunkte für Person A oder für Person B oder der AME? Bring eine Antwort mit Begründung mit und einen Satz, wie eine Zeitung die Zahl falsch verstehen könnte.',
    probier: { idee: 'Wie sieht die S-Kurve des Pflichtgefühls aus, wenn das Interesse mittel ist?', code: T.frei_a3.code },
    ohneGrafik: 'Alle Zahlen stehen in den Ausgaben der drei Vorlagen. Das Bild in Schritt 6 hat eine Textfassung.' },

  { id: 'a4', n: 4, titel: 'Erkennt das Modell, wer nicht wählen will?', pflicht: false, grund: 'g4',
    frage: 'Wie gut sagen Pflichtgefühl und Interesse die Wahlabsicht vorher?',
    ziel: 'du kannst einschätzen, was die Treffer eines Modells wert sind, das −2LL des Nullmodells ausrechnen und Nagelkerke R² richtig in einen Satz bringen.',
    schritte: [
      { id: 'a4-p', art: 'festlegen', titel: 'Erst festlegen', vorhersage: fest('a4'),
        mehr: [denk('Wie lege ich mich fest?', { grund: 'k4-treffer',
          kurz: 'Ein Modell sagt für jede Person „will wählen“ oder „will nicht wählen“ vorher. Die <b>Trefferquote</b> zählt, wie oft das stimmt; kurz gesagt: richtige Vorhersagen von 100. Du schätzt, wie viel 95 von 100 wert sind. Es zählt nicht, ob du richtig liegst: Deine Festlegung ist dein Vergleichspunkt.',
          denken: [
            'Frag dich, was eine Trefferquote misst und was nicht.',
            'Frag dich, womit du eine Trefferquote vergleichen würdest.',
            'Wähl eine Antwort. Ob dein Urteil trägt, siehst du, sobald alle Fragen in Schritt 5 richtig sind.',
          ],
          verwechslung: 'Die Trefferquote sagt nicht, wie sicher das Modell im Einzelfall ist. Sie zählt nur, ob die Vorhersage mit der Schwelle 50 % stimmt.' })] },
      { id: 'a4-1', art: 'code', titel: 'Die Güte-Tabellen ansehen', wk: ['a4'], bekannt: 'Modell wie in Aufgabe 2',
        text: 'Die Vorlage schätzt das Modell aus Aufgabe 2, diesmal mit dem Blick auf Classification Table (die ⟪Klassifikationstabelle⟫), Model Summary und Omnibus Tests.',
        mehr: [denk('Was steht in den drei Tabellen?', { grund: 'k4-tabellen',
          kurz: 'Die Vorlage ist das Modell aus Aufgabe 2. Neu ist nur der Blick: nicht auf die Prädiktoren, sondern auf drei Tabellen, die sagen, wie gut das Modell als Ganzes ist.',
          denken: [
            '<b>Classification Table:</b> In den Zeilen steht, was beobachtet wurde, in den Spalten, was das Modell mit der Schwelle 50 % vorhersagt. % Correct zeigt je Zeile, wie oft es bei dieser Antwort richtig liegt; Overall Percentage gilt für alle.',
            '<b>Model Summary:</b> ⟪−2 Log Likelihood|minus-2ll⟫ und drei Pseudo-R²; such Nagelkerke.',
            '<b>Omnibus Tests:</b> Chi-square und Sig., der Vergleich mit einem Modell ohne Prädiktoren.',
            'Schau dir die Zeile „würde nicht wählen“ genau an: Wie oft liegt das Modell dort richtig, verglichen mit der anderen Zeile?',
          ],
          verwechslung: '% Correct einer einzelnen Zeile für die Trefferquote halten. Die Trefferquote insgesamt steht unter Overall Percentage.' })] },
      { id: 'a4-2', art: 'code', titel: 'Die Regel „alle wählen“', wk: ['a4r'],
        text: 'Wie oft läge die Regel „alle wählen“ richtig? Die Vorlage rechnet noch das Smartphone-Beispiel aus Verstehen (im Kommentar steht „Grundlage 4“). Tausch im Journal die drei markierten Zahlen: oben die beiden Zellen der Zeile „würde wählen“, unten die Summe aller vier Zellen der Classification Table.',
        mehr: [denk('Woher kommt die Summe?', { grund: 'k4-treffer',
          kurz: 'Die Regel „alle wählen“ braucht kein Modell: Sie sagt für alle „würde wählen“ vorher. Sie liegt genau bei denen richtig, die wirklich wählen wollen. Ihre Trefferquote ist der Maßstab, an dem du das Modell misst.',
          denken: [
            'Such in der Classification Table die Zeile „würde wählen“: Ihre beiden Zellen kommen oben in die Rechnung.',
            'Für unten addierst du alle vier Zellen. Die Summe ist N oben in der Ausgabe (gewichtet).',
            'Tausch alle drei markierten Zahlen; die Rechnung selbst bleibt.',
            'Leg dein Ergebnis neben Overall Percentage: Wie groß ist der Abstand?',
          ],
          bild: 'HitRate', bildtext: 'Ein anderes Beispiel: die Classification Table des Smartphone-Modells. Die Knöpfe zeigen, wo das Modell richtig liegt und wo die Regel, für alle „Ja“ vorherzusagen, richtig liegt.',
          verwechslung: 'Den Anteil aus Aufgabe 1 nehmen. Die Regel misst man an denselben Befragten wie das Modell, also mit den Zellen der Classification Table.' })] },
      { id: 'a4-3', art: 'code', titel: '−2LL des Nullmodells', wk: ['a4l'],
        text: 'Die Vorlage rechnet noch das Smartphone-Beispiel aus Verstehen. Tausch im Journal die beiden Zahlen gegen −2 Log Likelihood (Model Summary) und Chi-square (Omnibus Tests) deines Modells.',
        mehr: [denk('Was ist das Nullmodell?', { grund: 'k4-2ll',
          kurz: '<b>⟪−2LL⟫</b> (−2 Log Likelihood) misst, wie schlecht die geschätzten Wahrscheinlichkeiten zu den beobachteten Nullen und Einsen passen; kleiner ist besser. Das <b>Nullmodell</b> kennt nur die Konstante und sagt allen denselben Anteil vorher. Es steht nicht direkt in der Ausgabe: −2LL des Modells plus Chi-square ergibt es.',
          denken: [
            'Such in der Model Summary −2 Log Likelihood deines Modells.',
            'Such in den Omnibus Tests Chi-square.',
            'Tausch beide Zahlen in der Vorlage, mit Punkt statt Komma.',
            'Prüf dein Ergebnis: Ist das Nullmodell größer als −2LL deines Modells? Warum muss es das sein?',
          ],
          bild: 'FormulaNull', bildtext: 'Am Smartphone-Beispiel aus der Vorlage.',
          verwechslung: '−2LL für sich allein deuten. Die Zahl hängt von der Zahl der Fälle ab; aussagekräftig ist nur der Vergleich mit dem Nullmodell.' })] },
      { id: 'a4-4', art: 'fragen', titel: 'Ergebnis festhalten', fragen: fragen('a4'),
        mehr: [denk('Wo lese ich das ab?', { grund: 'k4-ergebnis',
          kurz: 'Die Fragen in Schritt 5 nehmen die drei Tabellen aus Schritt 2 und deine Rechnungen aus Schritt 3 und 4 zusammen. Am Ende beurteilst du Nagelkerke R² und wählst, was in einen Bericht gehört.',
          denken: [
            '<b>Trefferquote:</b> Classification Table, Overall Percentage.',
            '<b>Regel „alle wählen“:</b> deine Rechnung aus Schritt 3.',
            '<b>Wer nicht wählen will:</b> Classification Table, Zeile „würde nicht wählen“, Spalte % Correct.',
            '<b>−2LL des Nullmodells:</b> deine Rechnung aus Schritt 4.',
            '<b>Nagelkerke R² und der Bericht:</b> Wie darf man Pseudo-R² lesen, und wie nicht?',
          ],
          verwechslung: '−2LL des Modells für das Nullmodell halten: Das Nullmodell steht nicht direkt in der Ausgabe.' })] },
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
