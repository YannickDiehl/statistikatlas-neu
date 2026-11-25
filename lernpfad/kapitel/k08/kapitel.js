/* Kapitel 8 „Index und Skala“: Aufgaben, Zusatzinfos und eine eigene Schrittart für die Lernpfad-Engine.
   Wird nach daten.js geladen; die Engine ruft window.KAPITEL(hilfen) einmal auf. */
'use strict';
window.KAPITEL = ({ D, T, esc, warum, denk }) => {

/* ---------- Texte aus content.ts an die Seite anpassen ----------
   Auf der Seite ist „Erst festlegen“ Schritt 1. Fragen und Hilfen in content.ts zählen die Schritte ohne Festlegung,
   darum wird jede Schrittnummer dort um 1 erhöht. „Grundlage 4a“ gibt es hier nicht mehr; sie heißt „Verstehen zu Aufgabe 4“. */
const seite = s => typeof s !== 'string' ? s : s
  .replace(/Schritt (\d)/g, (_, n) => 'Schritt ' + (+n + 1))
  .replace(/Grundlage 4a/g, 'Verstehen zu Aufgabe 4');
const frage = q => ({
  ...q,
  label: seite(q.label), help: seite(q.help), right: seite(q.right), hint: seite(q.hint), short: seite(q.short),
  ...(q.special ? { special: q.special.map(x => ({ ...x, text: seite(x.text) })) } : {}),
  ...(q.alsoRight ? { alsoRight: q.alsoRight.map(x => ({ ...x, text: seite(x.text) })) } : {}),
});
const Q = key => D.QUESTIONS[key].map(frage).map(q => q.id === 'a1b'
  ? { ...q, help: 'Ausgabe von Schritt 3 (Block aus Schritt 2 mit `min_valid = 5`), Spalte N.' } : q);
// Hilfe in 3 Stufen und Fehlerhilfe liest die Engine direkt aus D: dort einmal anpassen.
for (const k of Object.keys(D.HINTS)) D.HINTS[k] = D.HINTS[k].map(seite);
// Nur der Kommentar der Vorlage, nicht der Code: Auf der Seite ist der Index-Schritt Schritt 2.
T.a1w.code = T.a1w.code.replace('wie in Schritt 1,', 'wie in Schritt 2,');
const lernjournal = p => typeof p === 'string' ? p.replace(' (Werkstatt: ', ' (im Lernjournal: ')
  : p.href === '#r1' ? { ...p, text: 'Startblock oben im Lernjournal' }
    : p.href === '#g3' ? { ...p, text: 'Verstehen zu Aufgabe 3' } : p;
D.ERROR_HELP = D.ERROR_HELP.map(r => ({ says: r.says.map(lernjournal), helps: r.helps.map(lernjournal) }));

/** Die Aussagen einer Aufgabe als Liste (Variable und Wortlaut). */
const aussagen = (items, titel) => `<p style="margin:10px 0 0"><b>${esc(titel)}</b></p><ul style="margin:4px 0 0;padding-left:20px">${items.map(([id, text]) => `<li><code>${esc(id)}</code> „${esc(text)}“</li>`).join('')}</ul>`;

const RSTUDIO = warum('Lieber in RStudio?', 'Dann führst du dort vorher den Startblock aus (Pakete laden, ALLBUS einlesen). Danach kopierst du die Vorlage mit <b>Kopieren</b> in dein ⟪Skript⟫.<pre>' + esc(T.start.code) + '</pre>', 'r1');

/* ---------- Aufgaben ---------- */
const TASKS = [
  { id: 'a1', n: 1, titel: 'Wie populistisch denken die Befragten?', pflicht: true, grund: 'g1',
    frage: 'Wie misst man Populismus mit sieben Aussagen, und wer bekommt einen Wert?',
    ziel: 'du hast für jede befragte Person einen Populismus-Wert gebildet, weißt, wie viele Befragte einen Wert bekommen, und kannst den Mittelwert in Worten deuten.',
    info: 'Populismus heißt grob: Man sieht „das Volk“ als Einheit gegen eine abgehobene Elite und will, dass das Volk selbst entscheidet. Populismus ist ein ⟪Konstrukt⟫: eine Idee, die man nicht direkt beobachten kann. Der ALLBUS 2023 misst sie darum mit sieben Aussagen, den ⟪Items|item⟫ (nur in einem Teil der Fragebögen). Antworten: 1 stimme voll zu, 2 stimme eher zu, 3 teils/teils, 4 lehne eher ab, 5 lehne ganz ab.'
      + aussagen(D.PA_ITEMS, 'Die sieben Populismus-Aussagen'),
    infoMehr: [warum('Mit oder ohne Gewicht?', 'Wie seit Sitzung 6 rechnest du Aussagen über alle Menschen in Deutschland ⟪gewichtet|gewichte⟫: Mittelwerte und Anteile eines Index mit <code>weights = wghtpew</code>. Zwei Dinge rechnest du heute ohne Gewicht: wie zuverlässig die Fragen zusammen messen (Cronbachs α) und wie viele Befragte einen Indexwert bekommen. Beides beschreibt das Messinstrument und die Befragung selbst, nicht die Bevölkerung. Gewichtet ändert sich α kaum.', 'v1-gewicht')],
    schritte: [
      { id: 'a1-p', art: 'festlegen', titel: 'Erst festlegen',
        vorhersage: { ...D.PREDICTIONS.a1, aufloesung: 'Der gewichtete Mittelwert liegt bei 2,646, also unter 3: Im Mittel stimmen die Befragten den Aussagen eher zu.' },
        mehr: [denk('Wie lege ich mich fest?', { grund: 'v1a',
          kurz: 'Du sagst vorher, wo der Mittelwert des Populismus-Index ungefähr liegt. Der Index ist der Mittelwert der sieben Antworten einer Person und bleibt auf der Antwortskala von 1 bis 5. Es zählt nicht, ob du richtig liegst; deine Festlegung ist dein Vergleichspunkt.',
          denken: [
            'Lies die Antwortskala genau: 1 heißt „stimme voll zu“, 5 „lehne ganz ab“. Eine kleine Zahl heißt hier also Zustimmung.',
            'Lies die sieben Aussagen in der Einleitung und überleg, ob die Befragten ihnen eher zustimmen oder sie eher ablehnen.',
            'Ein Wert unter 3 heißt im Mittel eher Zustimmung, um 3 teils/teils, über 3 eher Ablehnung. Wähl den Bereich, den du erwartest.',
          ],
          verwechslung: 'Ein Index ist kein Mittelwert über alle Befragten, sondern ein Wert <b>je Person</b>. Den Mittelwert über alle rechnest du danach, wie bei jeder Variable, mit <code>describe()</code>.' })] },
      { id: 'a1-1', art: 'code', titel: 'Index bilden: Wer bekommt einen Wert?', wk: ['a1'], neu: true, bekannt: 'describe() aus Sitzung 3',
        text: 'Die Vorlage bildet für jede befragte Person den ⟪Mittelwert⟫ ihrer sieben Antworten. Sie verlangt alle sieben (<code>min_valid = 7</code>). Führ sie im Journal aus und lies in der Spalte <b>N</b>, wie viele Befragte einen Wert bekommen.',
        mehr: [
          denk('Was macht row_means()?', { grund: 'v1b',
            kurz: 'Bisher hat jede Funktion eine ⟪Variable⟫ angeschaut, also eine Spalte. <code>row_means()</code> rechnet quer dazu, in der Zeile eines ⟪Falls|fall⟫: Es nimmt die Antworten einer Person auf die Fragen in <code>pick()</code> und bildet ihren Mittelwert. So entsteht ein <b>⟪Mittelwertindex⟫</b>, eine neue Variable mit einem Wert je Person. <code>min_valid</code> sagt, wie viele gültige Antworten jemand mindestens braucht.',
            denken: [
              'Lies die Zeile in <code>mutate()</code>: Wie heißt die neue Variable, und welche sieben Variablen stehen in <code>pick()</code>?',
              'Was verlangt <code>min_valid = 7</code>? Wer bekommt damit keinen Wert?',
              'Lies in der Ausgabe von <code>describe(populismus)</code> die Spalte N: die Zahl der Befragten mit Wert. Missing daneben zählt die ohne Wert.',
              'Frag dich, warum hier ohne Gewicht gerechnet wird: Zählst du Personen, oder beschreibst du die Bevölkerung?',
            ],
            bild: 'RowMean', bildtext: 'Drei Befragte mit den vier Fragen zu Geflüchteten, zum Beispiel. Geh die Schritte durch und schalte <code>min_valid</code> um.',
            verwechslung: 'Ein ⟪fehlender Wert⟫ zählt nicht als 0; er fällt einfach weg. Ohne <code>min_valid</code> reicht eine einzige Antwort für einen Wert.' }),
          RSTUDIO,
          warum('Warum hier ohne Gewicht?', 'Wie viele Befragte einen Wert bekommen, beschreibt die Befragung selbst, nicht die Bevölkerung. Personen zählst du darum ohne Gewicht. Mit Gewicht stünde bei N die Summe der Gewichte.', 'v1-gewicht')] },
      { id: 'a1-2', art: 'aendern', titel: 'Weniger streng: mindestens fünf Antworten', block: 'a1-1', baustein: 'MinValid',
        text: 'Wer eine oder zwei der sieben Aussagen nicht beantwortet hat, soll trotzdem einen Wert bekommen. Ändere im Journal im Block aus Schritt 2 die gelb markierte <code>7</code> in <code>5</code> (mindestens fünf von sieben) und führ den Block erneut aus. Wie viele Befragte bekommen jetzt einen Wert?',
        mehr: [denk('Wie streng soll min_valid sein?', { grund: 'v1-streng',
          kurz: 'Du lockerst die Regel: Statt aller sieben Antworten verlangt der Index nur noch mindestens fünf. Du änderst dafür im Journal nur die gelbe Zahl im Block aus Schritt 2 und führst ihn erneut aus. Eine verbreitete Faustregel ist: mindestens zwei Drittel der Items, bei sieben also 5.',
          denken: [
            'Such im Block aus Schritt 2 die gelbe <code>7</code> und setz <code>5</code> ein.',
            'Führ den ganzen Block erneut aus und lies wieder die Spalte N. Vergleich sie mit dem N aus Schritt 2.',
            'Frag dich, was <code>min_valid</code> genau regelt: Wer bekommt mit 5 einen Wert, wer weiterhin nicht?',
            'Bleib beim N ohne Gewicht: Hier zählst du Personen.',
          ],
          verwechslung: 'Eine lockere Regel ist nicht falsch, sondern eine Entscheidung: Zu streng, und viele bekommen keinen Wert; zu locker, und manche Werte beruhen auf einer einzigen Antwort. Regel und n gehören in den Bericht.' })] },
      { id: 'a1-3', art: 'code', titel: 'Mittelwert für alle: mit Gewicht', wk: ['a1w'], bekannt: 'weights = wghtpew aus Sitzung 6',
        text: 'Jetzt die Aussage über die Bevölkerung: Wie populistisch sind die Befragten im Mittel? Dafür rechnest du mit ⟪Gewicht|gewichte⟫. Die Vorlage baut den Index wie in Schritt 2, gleich mit <code>min_valid = 5</code>. Lies die Spalte <b>Mean</b>.',
        mehr: [denk('Warum steht bei N eine andere Zahl?', { grund: 'v1-gewicht',
          kurz: 'Jetzt fragst du nicht mehr „Wer bekommt einen Wert?“, sondern „Wie populistisch sind die Befragten im Mittel?“. Das ist eine Aussage über alle Menschen in Deutschland; darum rechnest du mit Gewicht (<code>weights = wghtpew</code>). Mit Gewicht zählt <code>describe()</code> bei N die Gewichte zusammen.',
          denken: [
            'Lies die Vorlage: Der Index wird gebaut wie in Schritt 2, aber gleich mit <code>min_valid = 5</code>, und <code>describe()</code> bekommt das Gewicht.',
            'Such in der Ausgabe die Spalte Mean. Daneben steht der ⟪Median⟫; der ist hier nicht gefragt.',
            'Schau auf N: Ist das noch die Zahl der Personen mit Wert? Wo hast du die gesehen?',
          ],
          verwechslung: 'Das gewichtete N als Zahl der Befragten lesen. Mit Gewicht ist N die Summe der Gewichte, keine Personenzahl.',
          zusatz: 'R schreibt Kommazahlen mit Punkt: <code>1.234</code> heißt 1,234.' })] },
      { id: 'a1-4', art: 'lesen', titel: 'Deuten: Was heißt der Mittelwert?',
        text: 'Was heißt der Mittelwert in Worten? Achte auf die Richtung der Antworten: 1 heißt „stimme voll zu“, 5 „lehne ganz ab“. Liegt der Wert näher an 1 oder an 5, und was bedeutet das für die Aussagen?',
        mehr: [denk('Woher kommt die Richtung?', { grund: 'v1c',
          kurz: 'Einen Index liest du wie die Antwortskala seiner Items. Die Richtung ergibt sich aus den Items, nicht aus dem Wort „Index“: Schau nach, wofür die 1 steht, und deute den Mittelwert damit.',
          denken: [
            'Nimm deinen Mittelwert aus Schritt 4.',
            'Leg ihn auf die Antwortskala: 1 „stimme voll zu“, 2 „stimme eher zu“, 3 „teils/teils“, 4 „lehne eher ab“, 5 „lehne ganz ab“. Zwischen welchen zwei Antworten liegt er?',
            'Frag dich: Was heißt Zustimmung zu diesen sieben Aussagen für das ⟪Konstrukt⟫ Populismus? Und was heißt dann ein niedriger Indexwert?',
          ],
          verwechslung: 'Eine kleine Zahl heißt nicht automatisch „wenig“. Bei den Fragen zu Geflüchteten heißt 1 zum Beispiel „Risiko überwiegt“; ein niedriger Wert heißt dort „eher Risiko“.' })] },
      { id: 'a1-5', art: 'fragen', titel: 'Ergebnis festhalten', fragen: Q('a1'),
        mehr: [denk('Wo lese ich das ab?', { grund: 'v1-ergebnis',
          kurz: 'Du hältst fünf Dinge fest, und jedes hat seinen Ort: zwei Zahlen aus der Ausgabe ohne Gewicht, eine aus der Ausgabe mit Gewicht, dazu zwei Fragen zum Verständnis.',
          denken: [
            '<b>Wert mit <code>min_valid = 7</code>:</b> Ausgabe von Schritt 2, Spalte N.',
            '<b>Wert mit <code>min_valid = 5</code>:</b> dieselbe Spalte, nachdem du in Schritt 3 die Zahl geändert und den Block erneut ausgeführt hast. Nicht das N aus Schritt 4: Das ist mit Gewicht.',
            '<b>Wer dazukommt:</b> Überleg, was <code>min_valid</code> regelt. <b>Gewichteter Mittelwert:</b> Schritt 4, Spalte Mean.',
            '<b>Deutung:</b> Achte auf die Richtung der Antwortskala, wie in Schritt 5.',
          ],
          verwechslung: 'Mean und Median verwechseln: Gefragt ist der Mittelwert, die Spalte Mean. Der Mittelwert ohne Gewicht aus Schritt 2 ist ein anderer.' })] },
    ],
    ohneGrafik: 'Alle Zahlen stehen in den Ausgaben von Schritt 2, 3 und 4. Das Bild in Schritt 3 hat eine Textfassung.' },

  { id: 'a2', n: 2, titel: 'Messen die sieben Aussagen dasselbe?', pflicht: true, grund: 'g2',
    frage: 'Darf man die sieben Populismus-Aussagen zu einem Index zusammenfassen, und passt jede dazu?',
    ziel: 'du kannst sagen, wie zuverlässig die sieben Items zusammen messen (Cronbachs α), welches am schwächsten zu den anderen passt, und begründen, ob es im Index bleiben soll.',
    info: 'In Aufgabe 1 hast du aus den sieben Aussagen pa29 bis pa35 einen Index gebildet. Ob das erlaubt ist, prüfst du jetzt.',
    infoMehr: [warum('Die sieben Aussagen', aussagen(D.PA_ITEMS, 'Die sieben Populismus-Aussagen') + '<p style="margin:8px 0 0">Antworten: 1 stimme voll zu, 2 stimme eher zu, 3 teils/teils, 4 lehne eher ab, 5 lehne ganz ab.</p>')],
    schritte: [
      { id: 'a2-p', art: 'festlegen', titel: 'Erst festlegen',
        vorhersage: { ...D.PREDICTIONS.a2, aufloesung: 'Am schwächsten passt pa29 („Abgeordnete nur dem Volk verpflichtet“) zu den anderen: Ihre Trennschärfe ist 0,348, alle anderen liegen zwischen 0,545 und 0,682.' },
        mehr: [denk('Wie lege ich mich fest?', { grund: 'v2a',
          kurz: 'Du sagst vorher, welche der sieben Aussagen am wenigsten zu den anderen passt. „Passen“ heißt: Dieselben Menschen antworten bei ihr ähnlich wie bei den anderen. Es zählt nicht, ob du richtig liegst; deine Festlegung ist dein Vergleichspunkt.',
          denken: [
            'Lies die sieben Aussagen noch einmal, in der Einleitung der Aufgabe.',
            'Frag dich bei jeder: Trifft sie denselben Kern wie die anderen, oder einen anderen Ausschnitt des ⟪Konstrukts⟫ Populismus?',
            'Stell dir eine Person vor, die den meisten Aussagen zustimmt: Bei welcher Aussage würde sie am ehesten anders antworten?',
            'Wähl eine Aussage. Sind in Schritt 5 alle Fragen richtig, steht deine Festlegung neben dem Ergebnis.',
          ],
          verwechslung: '„Passen“ heißt nicht, dass alle gleich antworten. Es heißt: Wer bei einem Item hoch liegt, liegt auch bei den anderen eher hoch.' })] },
      { id: 'a2-1', art: 'code', titel: 'Reliabilität berechnen', wk: ['a2'], neu: true, bekannt: 'summary() aus Sitzung 7',
        text: 'Führ die Vorlage im Journal aus. Oben steht Cronbachs α, unten unter „Item-Total Statistics“ je Item eine Zeile. Such das Item mit der schwächsten ⟪Trennschärfe⟫ (Spalte Corrected Item-Total): Es hängt am wenigsten mit den übrigen zusammen.',
        mehr: [
          denk('Wo steht was in der Ausgabe?', { grund: 'v2c',
            kurz: '<code>reliability()</code> prüft, wie zuverlässig die genannten Items zusammen messen. Das heißt <b>⟪Reliabilität⟫</b>, bei mehreren Items auch interne Konsistenz. Mit <code>summary()</code> zeigt R oben <b>⟪Cronbachs α⟫</b> für alle Items und ganz unten je Item die <b>Trennschärfe</b>: wie gut dieses Item zu den übrigen passt.',
            denken: [
              'Oben unter „Reliability Statistics“: Such die Zeile „Cronbach\'s Alpha“. Darunter stehen das standardisierte α und McDonalds ω; die brauchst du heute nicht.',
              'Spring über „Item Statistics“ und die Korrelationstabelle hinweg nach ganz unten zu „Item-Total Statistics“.',
              'Vergleich dort die Spalte Corrected Item-Total über alle sieben Zeilen: Welche Zahl ist die kleinste?',
              'Wirf einen Blick in die Spalte Alpha if Deleted daneben und vergleich sie mit dem α von oben. Das prüfst du in Schritt 3 nach.',
            ],
            bild: 'ReliabilityOutput', bildtext: 'Dieselbe Ausgabe für ein anderes Beispiel, die vier Fragen zur Verbundenheit mit Gemeinde, Bundesland, Deutschland und EU. Wähl eine Zahl und lies, was sie sagt.',
            verwechslung: 'Trennschärfe und „Alpha if Deleted“ verwechseln. Die Trennschärfe ist die Korrelation des Items mit der Summe der übrigen Items (hoch ist gut). „Alpha if Deleted“ ist α ohne das Item (höher als α heißt: das Item passt schlecht).' }),
          warum('Was ist Cronbachs α?', 'α fasst zusammen, wie eng die Items zusammenhängen: wie zuverlässig sie gemeinsam messen (Reliabilität). Faustregel: ab 0,7 annehmbar, ab 0,8 gut. α steigt aber auch mit der Zahl der Items und sagt nichts über die Validität.', 'v2b')] },
      { id: 'a2-2', art: 'code', titel: 'Gegenprobe ohne eine Aussage', wk: ['a2ohne'],
        text: 'Prüf nach, was „Alpha if Deleted“ bedeutet: Lösch in der Vorlage im Journal die markierte Aussage samt Komma und führ sie erneut aus.',
        mehr: [denk('Was prüfst du mit der Gegenprobe?', { grund: 'v2-gegenprobe',
          kurz: '„Alpha if Deleted“ sagt, wie hoch α ohne ein Item wäre. In der <b>Gegenprobe</b> rechnest du das nach: dieselbe Rechnung noch einmal, diesmal ohne die markierte Aussage.',
          denken: [
            'Die gelbe Stelle umfasst die Aussage samt Komma und Leerzeichen; lösch beides. Danach stehen in <code>reliability()</code> nur noch sechs Aussagen.',
            'Ohne <code>summary()</code> bekommst du die kurze Fassung: eine Zeile mit Cronbach\'s Alpha, McDonalds Omega und N. Lies „Cronbach\'s Alpha“.',
            'Vergleich die Zahl mit „Alpha if Deleted“ aus Schritt 2, in der Zeile der gelöschten Aussage.',
            'Schau auch auf N: <code>reliability()</code> rechnet nur mit Befragten, die alle genannten Aussagen beantwortet haben. Warum ist N ohne eine Aussage etwas größer?',
          ],
          bild: 'AlphaOhneBeispiel',
          verwechslung: 'Cronbach\'s Alpha und McDonalds ω stehen in derselben Zeile. Gefragt ist α.' })] },
      { id: 'a2-3', art: 'lesen', titel: 'Deuten: Soll die schwächste Aussage raus?',
        text: 'Soll die Aussage mit der schwächsten Trennschärfe aus dem Index? Denk an den Inhalt der Aussage: Gehört sie zum ⟪Konstrukt⟫ Populismus? Und überleg, wie viel α ohne sie gewinnt.',
        mehr: [denk('Was sagen die Faustregeln, was nicht?', { grund: 'v2-behalten',
          kurz: 'Hier wägst du ab, ob die Aussage mit der schwächsten Trennschärfe im Index bleiben soll. Dafür brauchst du zwei Blickwinkel, wie im Aufgabentext: was die Zahlen sagen und was die Aussage inhaltlich misst.',
          denken: [
            'Wie viel gewinnt α ohne die Aussage? Vergleich α aus Schritt 2 mit α aus Schritt 3: Wie groß ist der Gewinn in Zahlen (nachher minus vorher)?',
            'Lies den Wortlaut der Aussage. Trifft sie etwas von dem, was die Aufgabe unter Populismus versteht: das Volk als Einheit gegen eine abgehobene Elite, das Volk soll selbst entscheiden?',
            'Frag dich auch: Unterscheidet die Aussage zwischen den Befragten? Ein Item, dem fast alle zustimmen, sagt wenig darüber, wer mehr und wer weniger von einem Begriff hat.',
            'Entscheide dich und begründe mit beiden Blickwinkeln.',
          ],
          verwechslung: 'Die Grenzen 0,7 und 0,8 sind Gewohnheiten, keine Naturgesetze: 0,69 ist nicht schlecht und 0,71 nicht gut. Nenn immer die Zahl.' })] },
      { id: 'a2-4', art: 'fragen', titel: 'Ergebnis festhalten', fragen: Q('a2'),
        mehr: [denk('Wo lese ich das ab?', { grund: 'v2-ergebnis',
          kurz: 'Du hältst fünf Dinge fest: zwei Zahlen und eine Aussage aus den Ausgaben von Schritt 2 und 3, dazu zwei Überlegungen. Achte bei den Zahlen genau auf die Zeile; in der Ausgabe stehen ähnliche Werte nah beieinander.',
          denken: [
            '<b>Cronbachs α:</b> Schritt 2, ganz oben, Zeile „Cronbach\'s Alpha“, mit drei Nachkommastellen; nicht „Alpha (standardized)“, nicht ω.',
            '<b>Schwächste Trennschärfe:</b> Schritt 2, Spalte Corrected Item-Total, die kleinste Zahl.',
            '<b>Was α sagt:</b> Überleg, was α zusammenfasst und was es nicht prüft.',
            '<b>α ohne die Aussage:</b> Schritt 3, Zeile „Cronbach\'s Alpha =“. <b>Behalten oder streichen:</b> deine Überlegung aus Schritt 4.',
          ],
          verwechslung: 'R schreibt Kommazahlen mit Punkt: <code>0.123</code> heißt 0,123.' })] },
      { id: 'a2-5', art: 'nachher', titel: 'Im Bild: α ohne jede Aussage', baustein: 'AlphaOhne',
        text: 'Erst nach dem Prüfen: Das Bild zeigt für jede der sieben Aussagen, wie hoch α ohne sie wäre. Vergleich es mit deinen Antworten.',
        mehr: [denk('Wie lese ich das Bild?', { grund: 'v2-gegenprobe',
          kurz: 'Das Bild zeigt für jede der sieben Aussagen, wie hoch α ohne sie wäre. Es erscheint erst nach dem Prüfen und ist gebaut wie das Beispiel zur Verbundenheit in Verstehen.',
          denken: [
            'Such die gestrichelte Linie: Sie ist α mit allen sieben Aussagen.',
            'Geh die ⟪Balken|balkendiagramm⟫ durch: Reicht einer über die Linie hinaus? Dann wäre α ohne diese Aussage höher.',
            'Schau auf die Achse: Sie beginnt nicht bei 0, damit die kleinen Unterschiede sichtbar sind. Wie groß sind die Abstände in Zahlen?',
            'Vergleich das Bild mit deinen Antworten aus Schritt 5.',
          ],
          verwechslung: 'Eine Achse, die nicht bei 0 beginnt, lässt kleine Unterschiede groß aussehen. Lies die Zahlen, nicht nur die Längen.' })] },
    ],
    plenum: 'Würdet ihr pa29 im Index behalten? Bringt ein Argument für Behalten und eins für Streichen mit.',
    ohneGrafik: 'Alle Zahlen stehen in den Ausgaben von Schritt 2 und Schritt 3. Das Bild in Schritt 6 hat eine Textfassung.' },

  { id: 'a3', n: 3, titel: 'Andersherum gefragt: Einstellungen zu Islam und Muslimen', pflicht: true, grund: 'g3',
    frage: 'Wie fasst man sechs Aussagen, die in verschiedene Richtungen gestellt sind, richtig zu einem Index zusammen?',
    ziel: 'du hast die andersherum gestellten Aussagen erkannt und umgepolt und kannst sagen, wie sich Cronbachs α dadurch verändert und wofür ein hoher Wert jetzt steht.',
    info: 'Der ALLBUS 2023 misst in einem Teil der Fragebögen mit sechs Aussagen, wie Menschen in Deutschland zum Islam und zu Muslimen eingestellt sind. Solche Fragen sind in der Einstellungsforschung üblich, um Vorbehalte und Offenheit in der Bevölkerung zu beschreiben. Die Befragten sagen zu jeder Aussage, wie sehr sie zustimmen: von 1 „stimme gar nicht zu“ bis 7 „stimme voll und ganz zu“; dazwischen stehen nur Zahlen. Die Aussagen sind Fragen aus dem Fragebogen, keine Feststellungen dieses Kurses. Ob sie zutreffen, ist hier nicht die Frage: Du prüfst nur, wie man sie richtig zu einem Index zusammenfasst. Sinngemäß nach den ⟪Variablenlabels⟫:'
      + aussagen(D.MM_ITEMS, 'Die sechs Aussagen zu Islam und Muslimen'),
    schritte: [
      { id: 'a3-p', art: 'festlegen', titel: 'Erst festlegen',
        vorhersage: { ...D.PREDICTIONS.a3, aufloesung: 'Andersherum gestellt sind mm02 und mm05: Bei ihnen drückt Zustimmung eine offene Haltung aus, bei den anderen vier Vorbehalte.' },
        mehr: [denk('Wie lege ich mich fest?', { grund: 'v3a',
          kurz: 'Du sagst vorher, welche zwei der sechs Aussagen andersherum gestellt sind als die übrigen vier. „Andersherum“ heißt: Zustimmung bedeutet bei ihnen das Gegenteil von Zustimmung bei den anderen. Erkennen kannst du das am Wortlaut, noch bevor du rechnest.',
          denken: [
            'Lies die sechs Aussagen in der Einleitung der Aufgabe, eine nach der anderen.',
            'Frag dich bei jeder: Wofür spricht es, wenn jemand hier „stimme voll und ganz zu“ (7) sagt, eher für Vorbehalte oder eher für eine offene Haltung?',
            'Sortier die Aussagen nach dieser Antwort in zwei Gruppen.',
            'Wähl das Paar. Sind in Schritt 5 alle Fragen richtig, steht deine Festlegung neben dem Ergebnis.',
          ],
          verwechslung: 'Umpolen und ⟪Umkodieren⟫ in Gruppen verwechseln. Beim Umpolen bleiben alle Stufen erhalten, nur ihre Reihenfolge dreht sich.',
          zusatz: 'Die Aussagen sind Fragen aus dem Fragebogen, keine Feststellungen dieses Kurses. Du prüfst nur, wie man sie richtig zu einem Index zusammenfasst.' })] },
      { id: 'a3-1', art: 'code', titel: 'Reliabilität, so wie gefragt', wk: ['a3'], bekannt: 'reliability() aus Aufgabe 2',
        text: 'Die Vorlage rechnet α mit den sechs Aussagen so, wie sie im Datensatz stehen. Führ sie im Journal aus und schau auf α und auf die Spalte Corrected Item-Total.',
        mehr: [denk('Woran erkenne ich ein falsch gepoltes Item?', { grund: 'v3b',
          kurz: 'Die Vorlage rechnet α mit den sechs Aussagen so, wie sie im Datensatz stehen, mit <code>summary()</code> wie in Aufgabe 2. Schau, was dir in der Ausgabe auffällt: bei α und bei den Trennschärfen (Corrected Item-Total).',
          denken: [
            'Lies oben „Cronbach\'s Alpha“: Wie zuverlässig messen die sechs Aussagen zusammen, nach der Faustregel (ab 0,7 annehmbar, ab 0,8 gut)?',
            'Geh unten die Spalte Corrected Item-Total durch: Steht vor einer Zahl ein Minus?',
            'Frag dich: Was heißt eine negative Trennschärfe? Läuft das Item mit den anderen oder gegen sie?',
            'Vergleich mit deiner Festlegung aus Schritt 1: Passen die auffälligen Zeilen zum Wortlaut?',
          ],
          bild: 'ReverseLab', bildtext: 'Ein anderes Beispiel: vier Aussagen zu Rollenbildern in Familie und Beruf. Pol einzelne Aussagen um und sieh, was mit α und den Trennschärfen passiert.',
          verwechslung: 'Eine negative Trennschärfe zeigt, dass etwas nicht stimmt. Welche Items andersherum gefragt sind, sagt dir aber erst der Wortlaut: zuerst lesen, dann rechnen.' })] },
      { id: 'a3-2', art: 'code', titel: 'Umpolen und neu prüfen', wk: ['a3um'], bekannt: 'rec(…, rules = "rev") aus Sitzung 5',
        text: 'Die Vorlage baut mit <code>rec(…, rules = "rev")</code> zwei umgepolte Aussagen (Endung <code>_um</code>). Führst du sie so aus, ändert sich α noch nicht: In <code>reliability()</code> stehen noch die alten Aussagen. Tausch im Journal die beiden markierten Stellen gegen ihre umgepolte Fassung und führ die Vorlage erneut aus.',
        mehr: [denk('Was macht rules = "rev"?', { grund: 'v3-um',
          kurz: 'Die Vorlage hat zwei Teile: <code>mutate()</code> baut mit <code>rec(…, rules = "rev")</code> zwei umgepolte Aussagen (Endung <code>_um</code>), dann schätzt <code>reliability()</code> die Reliabilität. <code>rules = "rev"</code> spiegelt die Skala: Auf 1 bis 7 wird aus 1 eine 7 und aus 2 eine 6; die Wörter wandern mit, fehlende Werte bleiben leer.',
          denken: [
            'Führ die Vorlage zuerst unverändert aus: Ändert sich α? Schau, welche Namen in <code>reliability()</code> stehen.',
            'Tausch im Journal beide gelben Stellen gegen ihre umgepolte Fassung mit <code>_um</code> und führ den ganzen Block erneut aus.',
            'Lies wieder α und die Spalte Corrected Item-Total: Was hat sich bei den Trennschärfen geändert?',
          ],
          bild: 'Reverse',
          verwechslung: 'Nur eine der beiden Stellen tauschen. Dann steht die andere noch in der alten Richtung und läuft weiter gegen die übrigen.' }),
          warum('R meldet: „Column … doesn’t exist“?', 'Die umgepolte Variable gibt es nur in der Kette, die sie mit <code>mutate()</code> baut. Lass den <code>mutate()</code>-Teil stehen und führ den ganzen Block aus, nicht nur die letzte Zeile.', 'v3-um')] },
      { id: 'a3-3', art: 'lesen', titel: 'Deuten: Wofür steht eine hohe Zahl?',
        text: 'Wofür steht nach dem Umpolen eine hohe Zahl, bei allen sechs Aussagen? Lies dazu noch einmal die vier Aussagen, die du nicht umgepolt hast.',
        mehr: [denk('Warum die Richtung nennen?', { grund: 'v3-richtung',
          kurz: 'Nach dem Umpolen zeigen alle sechs Aussagen in dieselbe Richtung. In welche, bestimmen die Aussagen, die du <b>nicht</b> umgepolt hast. Einen Index deutest du immer mit seiner Richtung: Wofür steht eine hohe Zahl? Ohne diese Angabe kann niemand einen Indexwert lesen.',
          denken: [
            'Lies die vier Aussagen ohne <code>_um</code> noch einmal.',
            'Frag dich bei ihnen: Wofür steht dort eine 7, „stimme voll und ganz zu“?',
            'Prüf es an einer umgepolten Aussage: Welche Antwort auf die ursprüngliche Aussage steckt jetzt hinter einer 7?',
            'Formulier die Richtung in einem Satz: „Eine hohe Zahl steht für …“.',
          ],
          verwechslung: 'Die Richtung zu nennen ist keine Wertung. Die Aussagen sind Fragen aus dem Fragebogen; die Richtung sagt nur, was eine Zahl im Index bedeutet.' })] },
      { id: 'a3-4', art: 'fragen', titel: 'Ergebnis festhalten', fragen: Q('a3'),
        mehr: [denk('Wo lese ich das ab?', { grund: 'v3-ergebnis',
          kurz: 'Du hältst fünf Dinge fest: drei aus den Ausgaben von Schritt 2 und 3 und zwei Überlegungen. Leg dir beide Ausgaben nebeneinander, vor und nach dem Umpolen.',
          denken: [
            '<b>Negative Trennschärfe:</b> Schritt 2, Spalte Corrected Item-Total, die zwei Zahlen mit Minuszeichen.',
            '<b>α vorher und nachher:</b> Schritt 2 und Schritt 3, jeweils Zeile „Cronbach\'s Alpha“; nicht das standardisierte α darunter, nicht ω. Steht in Schritt 3 dieselbe Zahl wie in Schritt 2, rechnet R noch mit den alten Namen.',
            '<b>Die Richtung:</b> deine Überlegung aus Schritt 4.',
            '<b>Warum α vorher so niedrig war:</b> Vergleich α vor und nach dem Umpolen. Was hat sich zwischen beiden Rechnungen geändert, was nicht?',
          ],
          verwechslung: 'Tauschst du nur eine der beiden Stellen, kommt ein drittes α heraus, das weder „vorher“ noch „nachher“ ist.' })] },
      { id: 'a3-5', art: 'nachher', titel: 'Im Bild: Trennschärfen vorher und nachher', baustein: 'VorherNachher',
        text: 'Erst nach dem Prüfen: Das Bild zeigt die Trennschärfen der sechs Aussagen vor und nach dem Umpolen, mit α. Vergleich es mit deinen Antworten.',
        mehr: [denk('Wie lese ich das Bild?', { grund: 'v3b',
          kurz: 'Das Bild zeigt die ⟪Trennschärfen⟫ der sechs Items vor und nach dem ⟪Umpolen⟫, unter jedem Teil Cronbachs α. Es erscheint erst nach dem Prüfen und ist gebaut wie die Balken im Umpol-Labor in Verstehen.',
          denken: [
            'Jeder Balken ist die Trennschärfe einer Aussage. Ein Balken nach links (negativ) heißt: Diese Aussage ist anders ⟪gepolt|polung⟫ und läuft gegen die anderen.',
            'Vergleich die beiden Teile: Welche Balken wechseln die Seite?',
            'Lies unter jedem Teil α und vergleich es mit deinen Antworten aus Schritt 5.',
          ],
          verwechslung: 'Ein langer Balken nach links heißt nicht „besonders wichtig“, sondern: Diese Aussage läuft deutlich gegen die anderen.' })] },
    ],
    ohneGrafik: 'Alle Zahlen stehen in den Ausgaben von Schritt 2 und Schritt 3. Das Bild in Schritt 6 hat eine Textfassung.' },

  { id: 'a4', n: 4, titel: 'Im Schnitt oder durchgehend?', pflicht: false, grund: 'g4',
    frage: 'Wie viele Befragte sind „durchgehend“ populistisch, und wie viele nur im Schnitt?',
    ziel: 'du kannst sagen, wie viel Prozent drei Populismus-Aussagen allen zustimmen und wie viel Prozent ihnen im Schnitt zustimmen, und erklären, warum sich die beiden Zahlen unterscheiden.',
    info: 'In der Forschung wird diskutiert, ob man Populismus wie einen Mittelwert messen darf oder ob jemand allen Seiten des ⟪Konstrukts⟫ zustimmen muss. Du nimmst drei Aussagen, je eine für eine Seite des Populismus: pa31 (einfache Bürger statt Berufspolitiker: gegen die Elite), pa32 (Kompromiss ist Verrat: ein einiger Volkswille), pa33 (das Volk soll entscheiden). Zustimmung heißt hier 1 oder 2.',
    schritte: [
      { id: 'a4-p', art: 'festlegen', titel: 'Erst festlegen',
        vorhersage: { ...D.PREDICTIONS.a4, aufloesung: 'Allen drei Aussagen stimmen 14,2 % zu, im Schnitt stimmen 21,71 % zu: durchgehend sind es also 7,5 ⟪Prozentpunkte⟫ weniger.' },
        mehr: [denk('Wie lege ich mich fest?', { grund: 'v4a',
          kurz: 'Du vergleichst zwei Regeln, bevor du rechnest. „Allen drei zugestimmt“ heißt: bei jeder Aussage 1 oder 2. „Im Schnitt zugestimmt“ heißt: Mittelwert der drei Antworten höchstens 2. Es zählt nicht, ob du richtig liegst; deine Festlegung ist dein Vergleichspunkt.',
          denken: [
            'Lies die drei Aussagen pa31, pa32 und pa33 in der Einleitung der Aufgabe.',
            'Lies die beiden Regeln noch einmal: Was verlangt „allen drei zugestimmt“, was verlangt „im Schnitt zugestimmt“?',
            'Schätz, wie viele Befragte unter die eine und wie viele unter die andere Regel fallen, und wähl eine Antwort.',
            'Sind in Schritt 5 alle Fragen richtig, steht deine Festlegung neben dem Ergebnis.',
          ] })] },
      { id: 'a4-1', art: 'code', titel: 'Zustimmungen zählen', wk: ['a4'], neu: true, bekannt: 'rec() aus Sitzung 5, frequency() mit Gewicht aus Sitzung 6',
        text: 'Die Vorlage baut zwei Indizes in einer Kette: <code>zustimmungen</code> zählt, wie vielen der drei Aussagen jemand zustimmt (0 bis 3), <code>kurz</code> ist der Mittelwert der drei Antworten. Führ sie im Journal aus: Sie zeigt die Zahl der Zustimmungen.',
        mehr: [
          denk('Was macht row_sums()?', { grund: 'v4-zaehlen',
            kurz: 'Die Vorlage hat drei Teile. Zuerst macht <code>rec()</code> aus jeder Aussage eine 0/1-Variable, du ⟪rekodierst|rekodieren⟫ sie also: 1 heißt zugestimmt (1 oder 2), 0 nicht. Dann zählt <code>row_sums(pick(…))</code> die Einsen je Person (<code>zustimmungen</code>, 0 bis 3). Eine solche Summe heißt ⟪Summenindex⟫. Daneben bildet <code>row_means()</code> den Mittelwert <code>kurz</code>. Zum Schluss zeigt <code>frequency()</code> die Zustimmungen, gewichtet.',
            denken: [
              'Lies die Regel in <code>rec()</code>: Welche Antworten werden zu 1, welche zu 0, was wird <code>NA</code>?',
              'Was heißt bei <code>zustimmungen</code> „allen drei zugestimmt“? In welcher Zeile der Tabelle steht das?',
              'Warum steht auch bei <code>row_sums()</code> ein <code>min_valid = 3</code>? Was wäre sonst mit jemandem, der eine Aussage übersprungen hat?',
              'Lies in der Ausgabe von <code>frequency()</code> die Spalte Valid %: den ⟪Anteil|relative-haeufigkeit⟫ an allen mit Wert.',
            ],
            verwechslung: 'Die 0 in <code>z31</code> heißt „stimmt nicht zu“, nicht „lehnt ab“: Nach der Regel in <code>rec()</code> wird auch „teils/teils“ (3) zu 0.' }),
          RSTUDIO] },
      { id: 'a4-2', art: 'aendern', titel: 'Tauschen: der Mittelwertindex', block: 'a4-1',
        text: 'Ändere im Journal im Block aus Schritt 2 die gelb markierte Stelle <code>zustimmungen</code> in <code>kurz</code> und führ den Block erneut aus. Jetzt siehst du den Mittelwertindex. Er hat 13 mögliche Werte; R schreibt 1,33 als 1.33333333333333. „Im Schnitt Zustimmung“ heißt: Wert höchstens 2. Lies die Spalte ⟪Cum. %⟫ in der Zeile 2.',
        mehr: [denk('Was heißt Cum. %?', { grund: 'v4-kurz',
          kurz: 'Du tauschst im Journal nur die gelbe Stelle: <code>kurz</code> statt <code>zustimmungen</code>. Jetzt zeigt <code>frequency()</code> den Mittelwertindex. Ein Mittelwert aus drei Antworten von 1 bis 5 kann auch Drittelwerte haben; das sind 13 mögliche Werte.',
          denken: [
            'Führ den ganzen Block erneut aus; <code>kurz</code> wird in derselben Kette schon gebaut.',
            '„Im Schnitt Zustimmung“ heißt: Wert höchstens 2. Welche Werte gehören also dazu?',
            'Cum. % zählt die Prozente von oben bis zu dieser Zeile zusammen. In welcher Zeile stecken alle Werte bis einschließlich 2?',
          ],
          verwechslung: 'Für „höchstens“ liest du Cum. %, für „genau“ Valid %. Valid % in der Zeile 2 wären nur die mit genau 2.',
          zusatz: 'R schreibt 1,33 als 1.33333333333333.' })] },
      { id: 'a4-3', art: 'lesen', titel: 'Deuten: Warum im Schnitt mehr?',
        text: 'Warum sind es im Schnitt mehr als durchgehend? Denk an Person A und B, und überleg, welche Antworten jemand haben kann, der im Schnitt höchstens 2 hat, aber nicht allen drei Aussagen zustimmt.',
        mehr: [denk('Person A und B', { grund: 'v4a',
          kurz: 'Zwei Regeln, zwei Zahlen: „allen drei zugestimmt“ aus Schritt 2 und „im Schnitt zugestimmt“ aus Schritt 3. Hier überlegst du, warum die zweite Zahl größer ist. Zwei Beispielpersonen helfen dabei.',
          denken: [
            'Person A antwortet 1, 1 und 4, Person B 2, 2 und 2. Rechne für beide den Mittelwert aus.',
            'Prüf für beide die Regel „allen zugestimmt“ (bei jeder Aussage 1 oder 2): Wer erfüllt sie?',
            'Frag dich: Welche Antworten kann jemand haben, der im Schnitt höchstens 2 hat, aber nicht allen drei zustimmt?',
            'Formulier in einem Satz, was der Mittelwert mit den drei Antworten macht.',
          ],
          verwechslung: '„Im Schnitt Zustimmung“ heißt Wert höchstens 2, nicht genau 2: Dazu gehören auch 1, 1,33 und 1,67.' })] },
      { id: 'a4-4', art: 'fragen', titel: 'Ergebnis festhalten', fragen: Q('a4'),
        mehr: [denk('Wo lese ich das ab?', { grund: 'v4-ergebnis',
          kurz: 'Du hältst drei Dinge fest: zwei Prozentzahlen aus den Ausgaben von Schritt 2 und 3 und eine Begründung. Nimm die Ausgaben so, wie die Vorlage sie rechnet.',
          denken: [
            '<b>Allen drei zugestimmt:</b> Ausgabe von Schritt 2, Zeile 3, Spalte Valid %. Die Zeile 0 sind die, die keiner Aussage zustimmen.',
            '<b>Im Schnitt zugestimmt:</b> Ausgabe von Schritt 3, Zeile 2, Spalte Cum. %.',
            '<b>Warum im Schnitt mehr:</b> deine Überlegung aus Schritt 4 mit Person A und B.',
          ],
          verwechslung: 'Valid % und Cum. % verwechseln: In der Zeile 2 aus Schritt 3 ist Valid % nur der Anteil mit genau 2.' })] },
    ],
    plenum: 'Ist jemand populistisch, der zwei Aussagen zustimmt, eine davon voll, und bei der dritten „teils/teils“ sagt? Welche Regel passt besser zum Begriff: Mittelwert oder „allen zugestimmt“?',
    ohneGrafik: 'Diese Aufgabe hat keine Grafik. Alle Zahlen stehen in den Ausgaben von Schritt 2 und Schritt 3.' },
];

/* ---------- Weiter, wenn du magst (aus den Probier-Werkstätten des Kapitels) ---------- */
const FREI = {
  a1: [
    { stufe: 'Abwandeln', text: 'Wie viele Befragte bekommen einen Wert, wenn du nur vier von sieben Antworten verlangst?', tipp: 'Setz in deinem Block aus Schritt 2 <code>min_valid = 4</code>. Nach der Zwei-Drittel-Regel ist 4 zu locker, nach „mehr als die Hälfte“ gerade noch erlaubt.' },
    { stufe: 'Eigene Frage', text: 'Unterscheiden sich Westen und Osten im Populismus-Index?', tipp: 'Bau den Index wie in Schritt 4 und häng statt <code>describe()</code> den ⟪t-Test⟫ aus Sitzung 7 an: <code>t_test(populismus, group = eastwest, weights = wghtpew) %&gt;% summary()</code>.' },
  ],
  a2: [
    { stufe: 'Abwandeln', text: 'Wie hoch ist α für nur drei der sieben Aussagen?', tipp: '<code>reliability(pa31, pa32, pa33)</code>. Vergleich α mit dem Wert für alle sieben: Was macht die Zahl der Items mit α?' },
    { stufe: 'Eigene Frage', text: 'Wie zuverlässig messen die vier Fragen zu Geflüchteten (mp16 bis mp19) zusammen?', tipp: '<code>reliability(mp16, mp17, mp18, mp19) %&gt;% summary()</code>. Zeigen alle vier in dieselbe Richtung? Bei allen heißt 1 „Risiko überwiegt“.' },
  ],
  a3: [
    { stufe: 'Abwandeln', text: 'Was passiert mit α, wenn du nur eine der beiden Aussagen umpolst?', tipp: 'Tausch in deinem Block aus Schritt 3 nur <code>mm02</code> gegen <code>mm02_um</code>. Wie sehen die Trennschärfen jetzt aus?' },
    { stufe: 'Erweitern', text: 'Was passiert mit dem Index, wenn man das Umpolen vergisst?', tipp: 'Bilde in einem <code>mutate()</code> zwei Indizes mit <code>row_means(pick(…), min_valid = 5)</code>: einmal mit <code>mm02_um</code> und <code>mm05_um</code>, einmal mit <code>mm02</code> und <code>mm05</code>. Vergleich beide mit <code>describe(…, weights = wghtpew)</code>.' },
  ],
  a4: [
    { stufe: 'Abwandeln', text: 'Wie viele stimmen keiner der drei Aussagen zu, und heißt das schon „Ablehnung“?', tipp: 'Lies in Schritt 2 die Zeile 0. Schau in die Regel von <code>rec()</code>: Was passiert mit „teils/teils“ (3)?' },
    { stufe: 'Eigene Frage', text: 'Stimmen im Osten mehr Befragte allen drei Aussagen zu als im Westen?', tipp: 'Das <code>mutate()</code> bleibt. Statt <code>frequency()</code>: <code>crosstab(zustimmungen, eastwest, percentages = "col", weights = wghtpew)</code>.' },
  ],
};

/* ---------- Eigene Schrittart: im Journal ändern (Schritt ohne eigene Vorlage) ----------
   Öffnet den Block des genannten Schritts im Journal (über dessen „→ Journal“-Knopf) und lässt den Schritt abhaken. */
function aendern(s, H) {
  const div = document.createElement('div'); div.className = 'aendern';
  const t = TASKS.find(x => x.schritte.some(y => y.id === s.block));
  const nr = t ? t.schritte.findIndex(y => y.id === s.block) + 1 : '';
  div.innerHTML = `<div style="margin-top:8px"><button type="button" class="knopf hell">Block aus Schritt ${nr} im Journal öffnen</button></div>
    <label class="erledigt"><input type="checkbox" ${H.S.fertig[s.id] ? 'checked' : ''}> Im Journal geändert und erneut ausgeführt</label>`;
  div.querySelector('button').onclick = () => document.querySelector(`#${s.block} .ins-journal`)?.click();
  div.querySelector('input').onchange = e => H.fertig(s.id, e.target.checked);
  return div;
}

/* ---------- Eigene Schrittart: Bild nach dem Prüfen ----------
   Nur Text und Baustein (die Engine setzt beide); der Baustein meldet den Schritt beim Aufklappen als erledigt. */
const nachher = () => document.createDocumentFragment();

return { TASKS, FREI, typen: { aendern, nachher } };
};
