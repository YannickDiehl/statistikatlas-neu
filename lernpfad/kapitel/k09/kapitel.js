/* Kapitel 9 „Lineare Regression“: Aufgaben, Zusatzinfos und eine eigene Schrittart für die Lernpfad-Engine.
   Wird nach daten.js geladen; die Engine ruft window.KAPITEL(hilfen) einmal auf.
   Die Fragen kommen aus content.ts (QUESTIONS mit special/wrong); geprüft werden sie mit PRUEFEN aus bausteine.tsx. */
'use strict';
window.KAPITEL = ({ D, T, esc, bild, warum, probier, denk }) => {

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
      { id: 'a1-p', art: 'festlegen', titel: 'Erst festlegen', vorhersage: P('a1'),
        mehr: [denk('Wie lege ich mich fest?', { grund: 'k1-gerade',
          kurz: 'Du schätzt, wie weit die Vorhersagen für „gar kein Vertrauen“ (1) und „großes Vertrauen“ (7) auseinanderliegen. Das ist der Anstieg der Geraden über sechs Stufen. Es zählt nicht, ob du richtig liegst: Deine Festlegung ist der Vergleichspunkt, an dem du später merkst, ob dich das Ergebnis überrascht.',
          denken: [
            'Schau auf die Skala: Die Zufriedenheit mit der Demokratie (<code>demo</code>) reicht von 1 bis 6.',
            'Stell dir zwei Gruppen vor: Menschen, die dem Bundestag gar nicht vertrauen, und Menschen, die ihm sehr vertrauen. Wie verschieden zufrieden mit der Demokratie sind sie wohl im Mittel?',
            'Wähl eine Antwort. Ob sie passt, siehst du, sobald alle Fragen in Schritt 6 richtig sind.',
          ],
          verwechslung: 'Die Vorhersage gilt für eine Gruppe im Mittel, nicht für jede einzelne Person. Gefragt ist der Abstand zweier solcher Mittel.' })] },
      { id: 'a1-1', art: 'code', titel: 'Vorlage ausführen', wk: ['a1'], neu: true, bekannt: 'rec() aus Sitzung 5, summary() aus Sitzung 7',
        text: 'Die Vorlage polt ps03 um und rechnet die Regression von <code>demo</code> auf pt03, gewichtet. Neu ist <code>linear_regression()</code> mit der Formel <code>demo ~ pt03</code>: links, was vorhergesagt wird, rechts, woraus.',
        mehr: [denk('Was macht die Vorlage?', { grund: 'k1-vorlage',
          kurz: 'Die Vorlage hat zwei Teile. Erst polt <code>rec(ps03, rules = "rev")</code> die Zufriedenheit um: In <code>demo</code> heißt 6 „sehr zufrieden“. Dann rechnet <code>linear_regression()</code> die Gerade, gewichtet. Die Formel <code>demo ~ pt03</code> liest du als „demo aus pt03“: links die abhängige Variable (AV), rechts die unabhängige (UV, in der Regression auch <b>Prädiktor</b>).',
          denken: [
            'Lies die Zeile mit <code>mutate()</code>: Welche Variable wird umgepolt, und wie heißt sie danach?',
            'Frag dich, warum: Bei ps03 heißt eine kleine Zahl „zufrieden“, bei pt03 heißt eine große Zahl „viel Vertrauen“. Zeigt „mehr“ ohne Umpolen auf beiden Seiten in dieselbe Richtung?',
            'Such die Tilde <code>~</code>: Was steht links, was rechts? Zwischen beiden steht immer die Tilde, kein Komma.',
            'Schau oben in die Ausgabe: Steht dort <code>- Weights: wghtpew</code>? Dann ist das Gewicht dabei.',
          ],
          verwechslung: 'Umpolen ändert nicht die Antworten, nur die Richtung der Codes. Wer „sehr zufrieden“ gesagt hat, steht danach bei 6 statt bei 1.' }),
          warum('Lieber in RStudio?', 'Dann führst du dort vorher den Startblock aus (Pakete laden, ALLBUS einlesen). Danach kopierst du die Vorlage mit <b>Kopieren</b> in dein Skript.<pre>' + esc(T.start.code) + '</pre>', 'r1')] },
      { id: 'a1-2', art: 'lesen', titel: 'Konstante, Steigung und N ablesen',
        text: 'Such in der Tabelle Coefficients die Spalte <b>B</b>: die Konstante in der Zeile <code>(Intercept)</code>, die Steigung in der Zeile <code>pt03</code>. Oben unter <code>- N:</code> steht, wie viele Befragte mitrechnen.',
        mehr: [denk('Wo steht was?', { grund: 'k1-ablesen',
          kurz: 'Für die Gerade brauchst du drei Zahlen von zwei Stellen der Ausgabe. Die <b>Konstante</b> (Zeile <code>(Intercept)</code>) und die <b>Steigung</b> B (Zeile <code>pt03</code>) legen die Gerade fest; <b>N</b> sagt, wie viele Befragte mitrechnen. Was die beiden Zahlen bedeuten, steht in Verstehen.',
          denken: [
            'Such den Abschnitt Coefficients und darin die Spalte <b>B</b>.',
            'Geh in dieser Spalte zur Zeile <code>(Intercept)</code>: Das ist die Konstante. In der Zeile <code>pt03</code> steht die Steigung.',
            'Schau ganz nach oben in die Zeile <code>- N:</code>. Warum ist N kleiner als die Zahl aller Befragten?',
            'Unsicher, wie die Ausgabe aufgebaut ist? In „R lesen“ wählst du am Beispiel der Lebenszufriedenheit eine Zahl, und sie wird markiert.',
          ],
          verwechslung: 'In jeder Zeile stehen mehrere Zahlen nebeneinander. Lies den Spaltenkopf, bevor du eine Zahl nimmst.' }),
          warum('Warum rechnen nicht alle mit?', 'ps03 und pt03 standen nur in einem Teil der Fragebögen; 1.596 Befragten wurden sie nicht gestellt (TNZ: SPLIT, kennst du aus Sitzung 1). Es rechnen nur die mit, die beide Fragen gültig beantwortet haben, deutlich weniger als die 5.246 Befragten.', 'k1-ablesen')] },
      { id: 'a1-3', art: 'code', titel: 'Vorhersage von Hand', wk: ['a1r'], bekannt: 'R als Taschenrechner aus Sitzung 1',
        text: 'Rechne die Vorhersage für Menschen mit großem Vertrauen (pt03 = 7) aus. Die Vorlage rechnet noch das Beispiel aus Verstehen (im Kommentar „Grundlage 1“: Lebenszufriedenheit bei Lage 4). Tausch im Journal die drei markierten Zahlen: Konstante, Steigung und den Wert 7.',
        mehr: [denk('Wie rechne ich von Hand?', { grund: 'k1-formel',
          kurz: 'Jede Gerade ist durch zwei Zahlen festgelegt. Die <b>Vorhersage</b> für einen Wert der UV ist Konstante plus Steigung mal Wert. Die Vorlage rechnet das noch für das Beispiel aus Verstehen; du setzt die Zahlen dieser Aufgabe ein.',
          denken: [
            'Such die drei gelben Stellen: Welche ist die Konstante, welche die Steigung, welche der Wert der UV?',
            'Nimm Konstante und Steigung, die du in Schritt 3 abgelesen hast (Ausgabe aus Schritt 2, Coefficients, Spalte B), so wie R sie zeigt.',
            'Für welchen Wert von pt03 sagst du vorher? Die Aufgabe nennt ihn: großes Vertrauen.',
            'Prüf dein Ergebnis grob: Liegt es auf der Skala von 1 bis 6?',
          ],
          bild: 'FormulaSteps', bildtext: 'Das Beispiel aus Verstehen: die Lebenszufriedenheit bei guter Lage (Stufe 4). Klick dich durch die drei Rechenschritte.',
          verwechslung: 'Die Steigung wird mit dem Wert malgenommen, die Konstante nicht.',
          zusatz: 'Kommazahlen schreibst du in R mit Punkt, etwa 3.570 statt 3,570.' })] },
      { id: 'a1-4', art: 'lesen', titel: 'Deuten: Was bedeuten Steigung und Konstante?',
        text: 'Formuliere für dich je einen Satz, gern mit <b>+ Notiz</b> im Journal: Was sagt die Steigung über Menschen, die dem Bundestag eine Stufe mehr vertrauen? Und wofür steht die Konstante, wenn es bei pt03 gar keinen Wert 0 gibt? Die Fragen im nächsten Schritt greifen das auf.',
        mehr: [denk('Wie deute ich Steigung und Konstante?', { grund: 'k1-deuten',
          kurz: 'Die <b>Steigung</b> (B) und die <b>Konstante</b> legen die Gerade fest. In diesem Schritt übersetzt du beide in eigene Worte, bevor die Fragen kommen.',
          denken: [
            'Was ändert sich an der Vorhersage, wenn pt03 um eine Stufe steigt, und in welcher Einheit?',
            'Für die Konstante: Lies in Verstehen nach, was die Konstante einer Geraden ist, und frag dich, was sie in dieser Aufgabe über Befragte aussagt.',
            'Notier deine beiden Sätze mit <b>+ Notiz</b>; die Fragen im nächsten Schritt greifen sie auf.',
          ],
          verwechslung: 'Die Vorhersage gilt für eine Gruppe im Mittel. Einzelne Menschen liegen darüber oder darunter, oft weit.' })] },
      { id: 'a1-5', art: 'fragen', titel: 'Ergebnis festhalten', fragen: FRAGEN('a1'),
        mehr: [denk('Wo lese ich das ab?', { grund: 'k1-ergebnis',
          kurz: 'Jede Frage hat einen festen Ort: die Ausgabe aus Schritt 2, deine Rechnung aus Schritt 4 oder deine Sätze aus Schritt 5.',
          denken: [
            '<b>Konstante und Steigung:</b> Ausgabe aus Schritt 2, Coefficients, Spalte B, Zeilen <code>(Intercept)</code> und <code>pt03</code>. Gib sie so ein, wie R sie zeigt.',
            '<b>Vorhersage für großes Vertrauen:</b> das Ergebnis deiner Rechnung in Schritt 4.',
            '<b>Was Steigung und Konstante bedeuten:</b> Leg die Möglichkeiten neben deine Sätze aus Schritt 5.',
            '<b>N:</b> ganz oben in der Ausgabe, Zeile <code>- N:</code>.',
          ],
          verwechslung: 'Neben B stehen Beta und Std. Error. Für Konstante und Steigung zählt nur die Spalte B.' })] },
    ],
    probier: { idee: 'Was passiert, wenn du die Seiten tauschst und das Vertrauen aus der Zufriedenheit vorhersagst?', code: T.frei_a1.code },
    ohneGrafik: 'Diese Aufgabe hat keine Grafik. Alle Zahlen stehen in der Ausgabe von Schritt 2 und im Ergebnis von Schritt 4.' },

  { id: 'a2', n: 2, titel: 'Vertrauen oder Schicht: Was sagt mehr?', pflicht: true, grund: 'g2',
    frage: 'Sagt das Vertrauen in den Bundestag die Zufriedenheit mit der Demokratie besser vorher als die eigene Schicht?',
    ziel: 'du kannst R² und den typischen Fehler einer Regression lesen und begründen, was eine fast gleich steile Gerade über die Güte der Vorhersage sagt und was nicht.',
    info: 'In Aufgabe 1 hast du die Gerade für das Vertrauen in den Bundestag gerechnet. Jetzt vergleichst du sie mit einer zweiten Frage: Welcher Schicht rechnen sich die Befragten zu? (<code>id02</code>, 1 = Unterschicht, 2 = Arbeiterschicht, 3 = Mittelschicht, 4 = obere Mittelschicht, 5 = Oberschicht). Eine hohe Zahl heißt hier schon „höher“; umpolen musst du id02 nicht.',
    schritte: [
      { id: 'a2-p', art: 'festlegen', titel: 'Erst festlegen', vorhersage: P('a2'),
        mehr: [denk('Was heißt „besser vorhersagen“?', { grund: 'k2-r2',
          kurz: 'Du legst fest, welche der beiden Fragen die Zufriedenheit mit der Demokratie besser vorhersagt. Gemessen wird das später mit <b>R²</b> (erklärter Varianzanteil), kurz gesagt: wie gut eine Gerade die Befragten trifft, gemessen an einer Vorhersage ohne UV. Es zählt nicht, ob du richtig liegst.',
          denken: [
            'Lies beide Fragen noch einmal: Was wird bei pt03 gefragt, was bei id02?',
            'Stell dir vor, du kennst von einer Person nur ihre Antwort auf eine der beiden Fragen. Mit welcher könntest du ihre Zufriedenheit genauer raten?',
            'Wähl eine Antwort. Ob sie passt, siehst du, sobald alle Fragen in Schritt 5 richtig sind.',
          ] })] },
      { id: 'a2-1', art: 'code', titel: 'Regression mit dem Vertrauen', wk: ['a2'],
        text: 'Führe die Vorlage aus, wie sie ist. Sie rechnet noch einmal die Regression aus Aufgabe 1; das Umpolen steht wieder drin, weil die Kette aus Aufgabe 1 <code>demo</code> nicht gespeichert hat. Lies im Abschnitt Model Summary <b>R Square</b> und <b>Std. Error of the Estimate</b>, in Descriptive Statistics die Standardabweichung von demo.',
        mehr: [denk('Was sagen R² und der typische Fehler?', { grund: 'k2-r2',
          kurz: '<b>R²</b> (erklärter Varianzanteil) setzt die Fehler der Geraden ins Verhältnis zu den Fehlern einer Vorhersage, die nur den Mittelwert kennt. Der <b>typische Fehler</b> (Std. Error of the Estimate) sagt in Punkten der Zufriedenheit, wie weit die Vorhersage typischerweise danebenliegt.',
          denken: [
            'Such den Abschnitt Model Summary: Dort stehen R Square und Std. Error of the Estimate.',
            'Wie weit läge man typischerweise daneben, wenn man allen nur den Mittelwert vorhersagt? Such dafür in Descriptive Statistics die Standardabweichung von demo.',
            'Vergleich die beiden Fehler: Um wie viel liegt die Gerade näher an den Befragten als der Mittelwert allein?',
            'Notier dir die Zahlen mit <b>+ Notiz</b>: In Schritt 3 ersetzt die neue Ausgabe die alte.',
          ],
          bild: 'R2Squares', bildtext: 'Ein Beispiel mit acht Befragten: die Fehlerquadrate mit dem Mittelwert allein und mit der Geraden.',
          verwechslung: 'R und R Square stehen direkt untereinander. Lies die Zeilenbeschriftung genau, bevor du eine Zahl nimmst.' })] },
      { id: 'a2-2', art: 'anpassen', titel: 'Die Schicht einsetzen', haken: 'Im Journal getauscht und ausgeführt',
        text: 'Tausch in deinem Journal-Block aus Schritt 2 die markierte Stelle <code>pt03</code> gegen <code>id02</code> und führe ihn erneut aus. Lies wieder <b>R Square</b> und dazu die Steigung <b>B</b> in der Zeile id02. Notier dir vorher die Zahlen für pt03, denn die neue Ausgabe ersetzt die alte. Oder du kopierst die Vorlage aus Schritt 2 mit <b>Kopieren</b> in einen Block <b>+ Eigener Code</b> und tauschst dort; dann stehen beide Ausgaben untereinander.',
        mehr: [denk('Was tausche ich, was bleibt?', { grund: 'k2-vorlage',
          kurz: 'Du tauschst genau eine Stelle, die UV: Aus <code>demo ~ pt03</code> wird <code>demo ~ id02</code>. Die AV bleibt demo, darum bleibt auch das Umpolen von ps03. Mit derselben AV und einer anderen UV vergleichst du, welche UV die AV besser vorhersagt.',
          denken: [
            'Hast du die Zahlen für pt03 notiert? Die neue Ausgabe ersetzt die alte.',
            'Such die gelbe Stelle in der Formel und tausch nur sie.',
            'Prüf in der neuen Ausgabe, ob in Coefficients jetzt eine Zeile <code>id02</code> steht.',
            'Lies dann wieder R Square und die Steigung B in der Zeile <code>id02</code>.',
          ],
          verwechslung: 'Umgepolt wird nur die AV ps03, nicht die neue UV. Bei id02 heißt eine hohe Zahl schon „höher“.',
          zusatz: 'Willst du beide Ausgaben untereinander sehen, kopier die Vorlage aus Schritt 2 mit <b>Kopieren</b> in einen Block <b>+ Eigener Code</b> und tausch dort.' })] },
      { id: 'a2-3', art: 'lesen', titel: 'Die beiden Ausgaben vergleichen',
        text: 'Vergleiche die beiden Ausgaben: erst die Steigungen B, dann R² und den typischen Fehler. Was passt nicht zusammen?',
        mehr: [denk('Wie vergleiche ich die beiden Ausgaben?', { grund: 'k2-vergleich',
          kurz: 'Du legst zwei Ausgaben nebeneinander und liest zwei Arten von Zahlen: die <b>Steigung</b> B in Coefficients und <b>R²</b> mit dem typischen Fehler in Model Summary. Dabei achtest du darauf, ob beide dasselbe Bild ergeben.',
          denken: [
            'Leg die beiden Ausgaben nebeneinander. Vergleich zuerst nur die Steigungen B.',
            'Vergleich dann R² und den typischen Fehler.',
            'Passt die Reihenfolge bei B zur Reihenfolge bei R²? Wenn nicht: Was misst jede der beiden Zahlen?',
          ],
          verwechslung: 'B steht in Coefficients, R² in Model Summary. Achte darauf, aus welcher der beiden Ausgaben du gerade liest.' })] },
      { id: 'a2-4', art: 'fragen', titel: 'Ergebnis festhalten', fragen: FRAGEN('a2'),
        mehr: [denk('Wo lese ich das ab?', { grund: 'k2-ergebnis',
          kurz: 'Du hältst Zahlen aus zwei Ausgaben fest, der mit dem Vertrauen (Schritt 2) und der mit der Schicht (Schritt 3), dazu zwei Deutungen.',
          denken: [
            '<b>R² und typischer Fehler mit dem Vertrauen:</b> Ausgabe aus Schritt 2, Model Summary. Gib R² als Anteil ein, so wie R es zeigt, nicht in Prozent.',
            '<b>R² und Steigung mit der Schicht:</b> Ausgabe aus Schritt 3; die Steigung in der Zeile <code>id02</code>, Spalte B.',
            '<b>Was R² heißt:</b> Leg jede Möglichkeit neben die Erklärung von R² in Verstehen.',
            '<b>Steigung gegen R²:</b> Nimm deinen Vergleich aus Schritt 4.',
          ],
          verwechslung: 'In der Ausgabe gibt es mehrere Zahlen mit „Std.“ im Namen. Lies die Zeilenbeschriftung genau.' })] },
    ],
    plenum: 'Das Vertrauen in den Bundestag sagt die Zufriedenheit mit der Demokratie gut vorher. Ist das eine Erklärung, oder fragen beide Fragen fast dasselbe? Bringt ein Argument für jede Seite mit.',
    probier: { idee: 'Sagt die Wirtschaftslage in Deutschland die Zufriedenheit besser vorher als die Schicht?', code: T.frei_a2.code },
    ohneGrafik: 'Diese Aufgabe hat keine Grafik. Alle Zahlen stehen in den beiden Ausgaben aus Schritt 2 und 3.' },

  { id: 'a3', n: 3, titel: 'Für wen liegt die Gerade daneben?', pflicht: true, grund: 'g3',
    frage: 'Sagt das Vertrauen in den Bundestag die Zufriedenheit für alle gleich gut vorher, oder für manche viel schlechter?',
    ziel: 'du hast für jede Person das Residuum gebildet, seine Streuung je Stufe des Vertrauens verglichen und den Levene-Test gelesen. Du kannst sagen, ob die Voraussetzung gleicher Fehlervarianz hält und für wen die Gerade am weitesten danebenliegt.',
    schritte: [
      { id: 'a3-p', art: 'festlegen', titel: 'Erst festlegen', vorhersage: P('a3'),
        mehr: [denk('Wie lege ich mich fest?', { grund: 'k3-fehlervarianz',
          kurz: 'Die Gerade sagt allen in einer Stufe des Vertrauens denselben Wert vorher. Wie weit die Befragten um diesen Wert streuen, kann von Stufe zu Stufe verschieden sein. Streuen sie überall gleich stark, heißt das <b>gleiche Fehlervarianz</b>. Du legst fest, für wen die Gerade wohl weiter danebenliegt. Es zählt nicht, ob du richtig liegst.',
          denken: [
            'Denk an die Menschen ganz ohne Vertrauen in den Bundestag: Wie einig sind sie sich wohl in ihrer Zufriedenheit mit der Demokratie?',
            'Denk dann an die Menschen mit großem Vertrauen: Wie einig sind sie sich?',
            'Wähl eine Antwort. Ob sie passt, siehst du in Schritt 3, wenn du die Streuung je Stufe liest.',
          ],
          verwechslung: 'Gleiche Fehlervarianz heißt nicht, dass die Gruppen gleich zufrieden sind. Es geht darum, wie weit die Menschen jeder Gruppe um die Gerade herum streuen.' })] },
      { id: 'a3-1', art: 'code', titel: 'Residuum bilden und je Stufe beschreiben', wk: ['a3'], neu: true, bekannt: 'mutate() aus Sitzung 5',
        text: 'Die Vorlage bildet für jede Person die Vorhersage (Konstante + Steigung mal pt03) und das Residuum (beobachtet minus vorhergesagt). Noch stehen dort die Zahlen aus dem Beispiel in Verstehen zu Aufgabe 1. Tausch im Journal die beiden markierten Zahlen gegen Konstante und Steigung aus Aufgabe 1 (2.288 und 0.465, mit Punkt) und führe den Block aus. Neu sind <code>group_by()</code> und <code>levene_test()</code>.',
        mehr: [denk('Was macht die Vorlage?', { grund: 'k3-vorlage',
          kurz: 'Die Vorlage hat drei Teile. Erst bildet sie für jede Person die <b>Vorhersage</b> (Konstante plus Steigung mal pt03) und das <b>Residuum</b>, kurz gesagt: beobachtet minus vorhergesagt. Dann beschreibt sie das Residuum für jede Stufe von pt03 getrennt, und zuletzt testet sie, ob es überall gleich stark streut.',
          denken: [
            'Such die zwei gelben Zahlen: Noch stehen dort Konstante und Steigung aus dem Beispiel der Lebenszufriedenheit. Tausch sie gegen die Konstante und die Steigung, die du in Aufgabe 1 abgelesen hast, mit Punkt.',
            'Lies <code>allbus &lt;- allbus %&gt;%</code>: Die neuen Spalten werden im Datensatz gespeichert, damit die beiden Ketten darunter sie benutzen können.',
            'Lies <code>group_by(pt03)</code>: In wie viele Gruppen teilt es die Befragten, und was rechnet <code>describe()</code> danach für jede?',
            'Ganz unten steht <code>levene_test()</code>: Welche Variable wird verglichen, und was steht nach <code>group =</code>?',
          ],
          bild: 'GroupBy', bildtext: 'Zum Beispiel sechs Befragte: <code>group_by(pt03)</code> legt alle mit derselben Antwort bei pt03 auf eine eigene Platte.',
          verwechslung: 'Ein Komma in der Zahl, etwa <code>vorhersage = 3,570 + …</code>: R meldet keinen Fehler, liest aber nur 3 und bildet aus dem Rest eine eigene, unbenannte Spalte. In R schreibst du Kommazahlen mit Punkt.' }),
          warum('Was macht group_by()?', '<code>group_by(pt03)</code> teilt die Befragten nach ihrer Antwort bei pt03 in sieben Gruppen. Alles, was danach kommt, rechnet R für jede Gruppe getrennt. <code>describe()</code> gibt darum sieben kleine Tabellen aus, eine je Stufe, in der Reihenfolge 1 bis 7. Nur 1 und 7 haben einen Namen (GAR KEIN VERTRAUEN, GROSSES VERTRAUEN); die Stufen 2 bis 6 zeigt R als „..“. N ist gewichtet gezählt. <code>drop_na(residuum)</code> lässt alle weg, für die es kein Residuum gibt, weil ps03 oder pt03 fehlt (kennst du aus Sitzung 4).', 'k3-groupby')] },
      { id: 'a3-2', art: 'lesen', titel: 'Die Streuung je Stufe lesen',
        text: 'Lies in jeder der sieben Tabellen die Spalte <b>SD</b>: So stark streut das Residuum in dieser Stufe. Wo ist sie am größten, wo am kleinsten?',
        mehr: [denk('Wie lese ich die Streuung je Stufe?', { grund: 'k3-sd',
          kurz: 'Die Spalte <b>SD</b> sagt, wie stark die Residuen in einer Stufe streuen: wie unterschiedlich weit die Befragten dort über oder unter der Geraden liegen. Ob die Gerade die Stufe im Mittel trifft, zeigt <b>Mean</b>.',
          denken: [
            'Die sieben Tabellen stehen in der Reihenfolge 1 bis 7. Nur 1 und 7 haben einen Namen; die Stufen dazwischen zählst du ab.',
            'Geh die Spalte SD der Reihe nach durch: Wo ist sie am größten, wo am kleinsten?',
            'Wunder dich nicht, wenn die SD schon vor dem Tausch der Zahlen stimmt: Innerhalb einer Stufe sagt die Gerade allen denselben Wert vorher. Nur Mean braucht die richtige Gerade.',
            'Lies bei Mean das Vorzeichen mit: Was heißt ein positiver, was ein negativer Mittelwert, wenn das Residuum „beobachtet minus vorhergesagt“ ist?',
          ],
          bild: 'SpreadBars', bildtext: 'Ein anderes Beispiel: wie stark die Residuen der Lebenszufriedenheit in jeder Stufe der wirtschaftlichen Lage streuen. So liest du SD je Stufe als Säulen.',
          verwechslung: 'SD und Mean stehen nebeneinander. Lies den Spaltenkopf, bevor du eine Zahl nimmst.' })] },
      { id: 'a3-3', art: 'lesen', titel: 'Den Levene-Test lesen', bekannt: 'Faustregel aus Sitzung 7',
        text: 'Lies die letzte Zeile der Ausgabe: den Levene-Test. „variances unequal“ heißt: Die Streuungen sind nicht gleich. Prüf dazu die Größe mit der Faustregel aus Sitzung 7: Ist die größte SD mehr als doppelt so groß wie die kleinste?',
        mehr: [denk('Wie lese ich Test und Faustregel?', { grund: 'k3-levene',
          kurz: 'Du prüfst auf zwei Wegen, wie die Residuen in den sieben Stufen streuen: mit dem <b>Levene-Test</b> (letzte Zeile der Ausgabe, mit F und p) und mit der <b>Faustregel</b> aus Sitzung 7 (größte SD gegen kleinste).',
          denken: [
            'Such die letzte Zeile der Ausgabe: Was steht bei F und bei p, und was schreibt R dazu?',
            'Nimm aus Schritt 3 die größte und die kleinste SD und teil die größte durch die kleinste.',
            'Vergleich das Ergebnis mit 2: Ist die größte mehr als doppelt so groß?',
            'Leg beides zusammen: Was sagt der Test, was die Faustregel?',
          ],
          verwechslung: 'Der p-Wert steht in der letzten Zeile, die SD-Werte stehen in den sieben Tabellen. Für diesen Schritt brauchst du beide Stellen.' })] },
      { id: 'a3-4', art: 'lesen', titel: 'Deuten: Was heißt das für einen Bericht?',
        text: 'Überleg dir einen Satz für einen Bericht, gern mit <b>+ Notiz</b> im Journal: Für wen sagt die Gerade die Zufriedenheit genauer vorher, für wen ungenauer? Die Fragen im nächsten Schritt greifen das auf.',
        mehr: [denk('Wie wird daraus ein Satz?', { grund: 'k3-bericht',
          kurz: 'Du übersetzt die Zahlen aus Schritt 3 und 4 in einen Satz für Leser ohne Ausgabe.',
          denken: [
            'Wer steckt in den Stufen mit der größten und der kleinsten SD?',
            'Welche Zahl stützt deinen Satz?',
            'Gilt dein Satz für alle Befragten oder für bestimmte Gruppen?',
            'Notier den Satz mit <b>+ Notiz</b>; die Fragen im nächsten Schritt greifen ihn auf.',
          ] })] },
      { id: 'a3-5', art: 'fragen', titel: 'Ergebnis festhalten', fragen: FRAGEN('a3'),
        mehr: [denk('Wo lese ich das ab?', { grund: 'k3-bericht',
          kurz: 'Alle Zahlen stehen in der Ausgabe von Schritt 2: in den sieben Tabellen und in der letzten Zeile. Die beiden Deutungen hast du in Schritt 4 und 5 vorbereitet.',
          denken: [
            '<b>Kleinste Streuung und Streuung in Stufe 1:</b> Spalte SD; die erste Tabelle ist Stufe 1, die anderen zählst du ab.',
            '<b>Wie weit die Gerade in Stufe 7 im Mittel danebenliegt:</b> letzte Tabelle, Spalte Mean, mit Vorzeichen. Prüf vorher, ob in Schritt 2 die Zahlen aus Aufgabe 1 stehen.',
            '<b>Levene-Test und SD zusammen:</b> dein Ergebnis aus Schritt 4.',
            '<b>Der Satz für den Bericht:</b> dein Satz aus Schritt 5.',
          ],
          verwechslung: 'SD und Mean stehen nebeneinander. Gefragt ist mal die eine, mal die andere Spalte; lies die Frage genau.' })] },
    ],
    plenum: 'Die Gerade liegt bei Menschen ohne Vertrauen am weitesten daneben. Warum könnte das so sein? Und was heißt das, wenn eine Zeitung schreibt: „Wer dem Bundestag vertraut, ist zufrieden mit der Demokratie“?',
    probier: { idee: 'Wie sieht die Streuung des Residuums je Stufe als Boxplots aus?', code: T.frei_a3.code },
    ohneGrafik: 'Diese Aufgabe braucht keine Grafik. Alle Zahlen stehen in der Ausgabe von Schritt 2.' },

  { id: 'a4', n: 4, titel: 'Links, Mitte, rechts', pflicht: false, grund: 'g4',
    frage: 'Sind Menschen umso weniger zufrieden mit der Demokratie, je weiter rechts sie sich einstufen?',
    ziel: 'du kannst eine Gerade mit den Mittelwerten je Stufe vergleichen und sagen, ob sie den Zusammenhang richtig beschreibt.',
    info: 'Die Befragten stufen sich politisch selbst ein, von 1 (links) bis 10 (rechts) (<code>pa01</code>).',
    schritte: [
      { id: 'a4-p', art: 'festlegen', titel: 'Erst festlegen', vorhersage: P('a4'),
        mehr: [denk('Wie lege ich mich fest?', { grund: 'k4-kurve',
          kurz: 'Du legst fest, welche Form der Zusammenhang hat: wie die Zufriedenheit mit der Demokratie von links (1) nach rechts (10) verläuft. Es zählt nicht, ob du richtig liegst; deine Festlegung ist der Vergleichspunkt für Schritt 4.',
          denken: [
            'Geh in Gedanken von links (1) nach rechts (10): Wie zufrieden ist man wohl an jeder Stelle?',
            'Wähl eine Antwort. Ob sie passt, siehst du in Schritt 4, wenn du die Mittelwerte je Stufe liest.',
          ] })] },
      { id: 'a4-1', art: 'code', titel: 'Gerade und Mittelwerte je Stufe', wk: ['a4'], bekannt: 'group_by() aus Aufgabe 3',
        text: 'Führe die Vorlage aus. Sie rechnet die Gerade und die Mittelwerte von demo für jede Stufe von pa01. Die zehn Tabellen stehen in der Reihenfolge 1 bis 10; nur 1 (LINKS) und 10 (RECHTS) haben einen Namen.',
        mehr: [denk('Warum Mittelwerte je Stufe?', { grund: 'k4-vorlage',
          kurz: 'Die Vorlage rechnet zwei Dinge, die du danach vergleichst: die Gerade (<code>demo ~ pa01</code>) und die Mittelwerte von demo je Stufe von pa01. Eine Gerade kann nur steigen oder fallen. Ob sie den Zusammenhang richtig beschreibt, zeigen erst die Mittelwerte daneben.',
          denken: [
            'Lies den ersten Teil: <code>allbus &lt;- allbus %&gt;% mutate(…)</code> polt ps03 um und speichert demo, damit beide Ketten darunter es benutzen können.',
            'Lies die Regression: Konstante und Steigung stehen danach wie in Aufgabe 1 unter Coefficients, Spalte B.',
            'Lies den letzten Teil: <code>drop_na()</code>, <code>group_by(pa01)</code>, <code>describe()</code>. Wie viele Tabellen erwartest du?',
            'Achte auf die Richtung der Codes: pa01 ist nicht umgepolt, 1 heißt links, 10 rechts.',
          ],
          verwechslung: 'Mittelwert je Stufe und Vorhersage der Geraden sind verschiedene Zahlen: Das eine ist, was die Befragten einer Stufe im Mittel sagen, das andere, was die Gerade für sie vorhersagt.' })] },
      { id: 'a4-2', art: 'code', titel: 'Vorhersage für ganz links', wk: ['a4r'],
        text: 'Rechne die Vorhersage der Geraden für „ganz links“ (pa01 = 1). Die Vorlage rechnet noch das Beispiel aus Verstehen zu Aufgabe 1 (Lage 4). Tausch im Journal die drei markierten Zahlen: Konstante, Steigung und den Wert 1. Die Steigung ist negativ: Schreib sie mit Minus. <code>Konstante + -Steigung * 1</code> und <code>Konstante - Steigung * 1</code> ergeben dasselbe.',
        mehr: [denk('Mit Vorzeichen rechnen', { grund: 'k4-minus',
          kurz: 'Du rechnest wie in Aufgabe 1: Konstante plus Steigung mal Wert, diesmal für „ganz links“ (pa01 = 1). Das Vorzeichen gehört zur Steigung. Ist B negativ, sinkt die Vorhersage mit jeder Stufe nach rechts.',
          denken: [
            'Hol Konstante und Steigung aus der Ausgabe von Schritt 2, Coefficients, Spalte B, mit dem Vorzeichen, das R zeigt.',
            'Such die drei gelben Stellen und tausch sie: Konstante, Steigung, Wert 1.',
            'Prüf grob: Liegt deine Vorhersage für ganz links über oder unter der Konstante? Passt das zum Vorzeichen der Steigung?',
          ],
          verwechslung: 'Wer das Vorzeichen der Steigung nicht mitnimmt, rechnet in die falsche Richtung.',
          zusatz: '<code>Konstante + -Steigung * 1</code> und <code>Konstante - Steigung * 1</code> ergeben dasselbe. Kommazahlen schreibst du mit Punkt.' })] },
      { id: 'a4-3', art: 'lesen', titel: 'Vergleichen: Gerade gegen Mittelwerte',
        text: 'Vergleiche die Vorhersage für ganz links mit dem Mittelwert der ersten Tabelle (LINKS). Lies dann die Mittelwerte der zehn Tabellen der Reihe nach: Fallen sie gleichmäßig, so wie die Gerade?',
        mehr: [denk('Wie prüfe ich, ob die Gerade passt?', { grund: 'k4-vergleich',
          kurz: '<b>Linearität</b> heißt: Der Zusammenhang lässt sich durch eine Gerade beschreiben. Prüfen kannst du das, indem du die Mittelwerte jeder Stufe neben die Gerade legst, erst an einer Stelle, dann im Ganzen.',
          denken: [
            'Vergleich deine Vorhersage für ganz links aus Schritt 3 mit Mean in der ersten Tabelle (LINKS): Wie weit liegen sie auseinander?',
            'Lies dann Mean in allen zehn Tabellen der Reihe nach, von 1 bis 10, und schreib die Werte als Reihe auf.',
            'Welche Form haben die Mittelwerte, wenn du sie der Reihe nach liest? Und welche Form hat die Gerade?',
            'Wo liegen die Mittelwerte über der Vorhersage der Geraden, wo darunter?',
          ],
          verwechslung: 'Die Vorhersage für ganz links stammt aus deiner Rechnung in Schritt 3, der Mittelwert aus der ersten Tabelle: zwei verschiedene Zahlen.' })] },
      { id: 'a4-4', art: 'fragen', titel: 'Ergebnis festhalten', fragen: FRAGEN('a4'),
        mehr: [denk('Wo lese ich das ab?', { grund: 'k4-vergleich',
          kurz: 'Die Zahlen stehen in der Ausgabe von Schritt 2 und in deiner Rechnung aus Schritt 3. Die beiden Deutungen kommen aus deinem Vergleich in Schritt 4.',
          denken: [
            '<b>Steigung:</b> Ausgabe aus Schritt 2, Coefficients, Zeile <code>pa01</code>, Spalte B, mit Vorzeichen.',
            '<b>Vorhersage für ganz links:</b> dein Ergebnis aus Schritt 3.',
            '<b>Wie zufrieden die ganz Linken tatsächlich sind:</b> erste Tabelle (LINKS), Spalte Mean.',
            '<b>Muster und Folgerung:</b> deine Reihe der zehn Mittelwerte aus Schritt 4.',
          ],
          verwechslung: 'Neben Mean steht SD, die Streuung. Und neben B steht Beta; für die Steigung zählt B.' })] },
      { id: 'a4-5', art: 'bild', titel: 'Im Bild: Gerade und Mittelwerte', baustein: 'LinksRechts',
        text: 'Das Bild legt die Mittelwerte je Stufe neben die Gerade aus R. Weil es die Antworten zeigt, erscheint es erst, sobald du deine Antworten in Schritt 5 geprüft hast, oder mit <b>Bild zeigen</b>.',
        mehr: [denk('Wie lese ich das Bild?', { grund: 'k4-vergleich',
          kurz: 'Das Bild legt zwei Dinge übereinander: die Gerade aus R und die Mittelwerte der Befragten je Stufe. Weil es die Antworten zeigt, erscheint es erst nach dem Prüfen. Seine Textfassung nennt alle Mittelwerte.',
          denken: [
            'Such die grüne Gerade und die orangen Rauten: Was ist Vorhersage, was Mittelwert der Befragten?',
            'Geh von links nach rechts: Wo liegen die Rauten über der Geraden, wo darunter?',
            'Schau an den rechten Rand: Wie viele Befragte stehen hinter den letzten beiden Stufen (n im Bild)?',
            'Vergleich das Bild mit deiner Festlegung aus Schritt 1.',
          ],
          verwechslung: 'Die Rauten sind keine einzelnen Befragten, sondern Mittelwerte einer ganzen Stufe. Am rechten Rand stehen hinter ihnen nur wenige Befragte.' })] },
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
