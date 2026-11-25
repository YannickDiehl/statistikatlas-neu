/* Kapitel 4 „Daten sehen“: Aufgaben, Zusatzinfos und eigene Schrittarten für die Lernpfad-Engine.
   Wird nach daten.js geladen; die Engine ruft window.KAPITEL(hilfen) einmal auf. */
'use strict';
window.KAPITEL = ({ D, T, esc, bild, warum, probier, denk }) => {
const $ = (s, el = document) => el.querySelector(s);

// Die Texte in content.ts zählen die Schritte ohne „Erst festlegen“; auf der Seite ist Festlegen Schritt 1.
const plus = t => String(t).replace(/Schritt (\d)/g, (_, n) => 'Schritt ' + (+n + 1));
for (const k of ['a3', 'a4']) if (Array.isArray(D.HINTS?.[k])) D.HINTS[k] = D.HINTS[k].map(plus);
for (const q of D.QUESTIONS?.a3 || []) if (q.help) q.help = plus(q.help);

/* ---------- Zusatzinfos (öffnen sich in der Leiste rechts) ---------- */
const BILD = {
  toLabel: '<code>to_label(hs01)</code> tauscht jede Zahl gegen ihren Aufkleber: Aus 2 wird GUT. Ein leerer Stein bleibt leer; sein Aufkleber KEINE ANGABE fällt ab, er ist jetzt einfach <code>NA</code>. <code>geom_bar()</code> stapelt gleiche Wörter zu Balken und gibt den leeren Steinen einen eigenen Balken ganz rechts: NA. <span>Die Steine sind ein Beispiel mit sechs Befragten.</span>',
  dropNa: '<code>drop_na(hs01)</code> schaut nur in den Turm <code>hs01</code>: Wer dort einen leeren Stein hat, fällt mit der ganzen Reihe weg (grau). Wer nur bei einer anderen Variable nichts angegeben hat, hier beim Alter, bleibt. Von 5.246 Reihen bleiben 5.209. R schreibt Tausender mit Komma: 5,246 heißt 5.246. <span>Die Steine sind ein Beispiel mit fünf Befragten; die Reihenzahlen stammen aus dem ALLBUS 2023.</span>',
  kette: 'Bis <code>ggplot()</code> reicht <code>%&gt;%</code> die Bauplatte jeweils ins erste Feld der nächsten Funktion. <code>ggplot(aes(x = hs01))</code> legt die leere Leinwand an. <code>+ geom_bar()</code> legt die Balken darauf. <code>labs()</code> ist eine weitere Schicht und kommt ebenfalls mit <code>+</code> dazu. <span>Balkenhöhen: ALLBUS 2023, ungewichtet, n = 5.209.</span>',
  filter180: '<code>filter()</code> prüft jede Reihe: <code>xt10 &lt;= 180</code> ergibt TRUE, FALSE oder bei fehlender Dauer NA. Nur Reihen mit TRUE bleiben. Darum fallen zwei Gruppen weg: 497 Bögen über 180 Minuten und die 220 ohne Dauer. <span>Die Steine sind ein Beispiel mit sechs Bögen; die Zahlen daneben stammen aus dem ALLBUS 2023.</span>',
  binwidth: '<code>binwidth</code> legt fest, wie breit jede Kiste ist; lässt du es weg, nimmt ggplot 30 Kisten. Dieselben sieben Bögen ergeben mit Kisten von 5 Minuten fünf niedrige Säulen, mit Kisten von 30 Minuten zwei hohe. <code>boundary = 0</code> lässt die Kisten bei 0, 5, 10 … beginnen. <span>Die Steine sind ein Beispiel mit sieben Bögen.</span>',
  zoomFilter: 'Der Strich im Kasten ist der Median: der mittlere Stein, wenn man die Bögen nach Dauer sortiert. Beim Hineinzoomen rechnen alle Steine mit, auch die, die über 180 aus dem Bild ragen. Beim Abschneiden fallen die langen Bögen weg, bevor gerechnet wird, und ein anderer Stein steht in der Mitte. <span>Die Steine sind ein Beispiel mit sieben Papierbögen.</span>',
};

/* ---------- Aufgaben ---------- */
const TASKS = [
  { id: 'a1', n: 1, titel: 'Gesundheit zeigen', pflicht: true, grund: 'g1',
    frage: 'Wie beurteilen die Befragten ihre Gesundheit?',
    ziel: 'eine beschriftete Grafik ohne fehlende Werte, und du kannst sagen, welche Einschätzung am häufigsten ist und wie groß n ist.',
    schritte: [
      { id: 'a1-p', art: 'festlegen', titel: 'Erst festlegen', pred: 'a1',
        mehr: [denk('Wie lege ich mich fest?', { grund: 'k1-verteilung',
          kurz: 'Du sagst vorher, welche Antwort du am häufigsten erwartest. Es zählt nicht, ob du richtig liegst: Deine Festlegung ist der Vergleichspunkt, an dem du später merkst, ob dich das Ergebnis überrascht.',
          denken: [
            'Wer wurde gefragt? Im ALLBUS sind es Erwachsene aller Altersgruppen, nicht nur junge Menschen.',
            'Stell dir vor, wie die meisten dieser Menschen ihre Gesundheit beschreiben würden: eher in der Mitte der Skala oder eher an einem Ende?',
            'Wähl eine Antwort. Ob sie stimmt, siehst du in Schritt 6.',
          ],
          verwechslung: 'Der häufigste Wert heißt <b>Modus</b>; im Bild ist er der höchste Balken.' })] },
      { id: 'a1-1', art: 'code', titel: 'Vorlage ausführen', wk: ['a1v'], neu: true,
        text: 'Die Vorlage zeichnet die Gesundheit als Balken. <code>to_label()</code> schreibt Wörter statt Codes auf die Achse.',
        mehr: [denk('Was macht die Vorlage?', { grund: 'k1-stapel',
          kurz: '<code>geom_bar()</code> zählt, wie viele Personen jede Antwort gegeben haben, und stellt jede Zahl als Balken dar. <code>to_label()</code> sorgt dafür, dass unter den Balken Wörter stehen statt Codes.',
          denken: [
            'Lies die Vorlage Zeile für Zeile: Welche Variable kommt auf die x-Achse?',
            'Was zählt die y-Achse: Personen oder Prozent?',
            'Schau unter die Balken: Stehen dort Wörter? Wenn nur Zahlen dastehen, fehlt <code>to_label()</code>.',
          ],
          bild: 'TurmZumStapel', bildtext: 'Klick dich durch die fünf Schritte. Das Beispiel hat zwölf Befragte; deine Grafik macht dasselbe mit allen.',
          verwechslung: 'Die y-Achse von <code>geom_bar()</code> zeigt Anzahlen (<code>count</code>), keine Prozent.' }),
          bild('toLabel', 'Bild: Was to_label() tut'), warum('Lieber in RStudio?', 'Dann führst du dort vorher den Startblock aus (Pakete laden, ALLBUS einlesen). Danach kopierst du die Vorlage mit <b>Kopieren</b> in dein Skript.<pre>' + esc(T.start.code) + '</pre>', 'r1')] },
      { id: 'a1-2', art: 'code', titel: 'Fehlende Werte weglassen und beschriften', wk: ['a1n'],
        text: 'Ganz rechts steht ein Balken <b>NA</b>: Personen ohne gültige Antwort. <code>drop_na(hs01)</code> lässt sie weg. Fülle die zwei markierten Stellen.',
        mehr: [denk('Warum gibt es einen NA-Balken?', { grund: 'k1-na',
          kurz: 'Im Balken <b>NA</b> stehen Personen ohne gültige Antwort. Stehen Wörter auf der Achse, gibt ggplot ihnen einen eigenen Balken. <code>drop_na(hs01)</code> lässt sie weg, bevor gezeichnet wird.',
          denken: [
            'Schau in deine erste Grafik: Welcher Balken gehört zu keiner Antwort?',
            'Frag dich: Gehören diese Personen zur Frage „Wie beurteilen die Befragten ihre Gesundheit?“?',
            'Achte auf die Reihenfolge in der Vorlage: Erst aussortieren (<code>drop_na()</code>), dann zeichnen (<code>ggplot()</code>).',
            'Für die gelben Stellen: Was zeigt die Grafik in wenigen Wörtern (<code>title</code>)? Und wie viele Personen bleiben nach <code>drop_na()</code> übrig (<code>n</code>)? Die Zahl findest du mit <code>frequency(hs01)</code> in der Zeile „Total valid“.',
          ],
          verwechslung: '<code>drop_na(hs01)</code> entfernt nicht alle, die irgendwo eine Lücke haben, sondern nur die, denen bei <code>hs01</code> die Antwort fehlt.',
          zusatz: 'Überlappen sich in RStudio die Beschriftungen, zieh das Plots-Fenster breiter.' }),
          probier('Wie viele fehlen?', 'Die Zeile „Total missing“ zählt den NA-Balken, „Total valid“ ist dein n.', 'allbus %>%\n  frequency(hs01)', 'a1')] },
      { id: 'a1-3', art: 'lesen', titel: 'Die Kette lesen',
        text: 'Lies deine fertige Kette von oben nach unten: Wo reicht <code>%&gt;%</code> die Daten weiter, wo legt <code>+</code> eine Schicht auf?',
        mehr: [denk('Pipe und Plus', { grund: 'k1-kette',
          kurz: 'Die Kette hat zwei Teile. Bis <code>ggplot()</code> arbeitest du mit Daten: <code>%&gt;%</code> reicht sie weiter („und dann“). Ab <code>ggplot()</code> arbeitest du an einem Bild: <code>+</code> legt eine Schicht auf.',
          denken: [
            'Such die Zeile mit <code>ggplot()</code>: Sie teilt die Kette in zwei Teile.',
            'Geh den oberen Teil durch: Was passiert in jeder Zeile mit den Daten?',
            'Geh den unteren Teil durch: Welche Schicht legt jedes <code>+</code> auf das Bild?',
          ],
          verwechslung: '<code>%&gt;%</code> statt <code>+</code> nach <code>ggplot()</code>. R meldet dann „`mapping` must be created by `aes()`“.' })] },
      { id: 'a1-4', art: 'achse', titel: 'Deuten: Wo beginnt die Achse?', frage: D.A1_AXIS,
        mehr: [denk('Ehrlich zeigen', { grund: 'k1-achse',
          kurz: 'Bei Balken liest das Auge die <b>Länge</b>. Wo eine Achse beginnt, bestimmt, welche Längen man sieht.',
          denken: [
            'Stell dir deine Grafik mit einer y-Achse vor, die erst bei 500 beginnt: Was bliebe von den kürzeren Balken übrig?',
            'Vergleich zwei Balken: Wie viel länger wirkt der eine dann im Vergleich zu vorher?',
            'Frag dich: Ändern sich die Zahlen, oder nur der Eindruck? Und welcher Eindruck passt zu den Zahlen?',
          ],
          bild: 'AchseVergleich', bildtext: 'Ein anderes Beispiel: die mittlere Lebenszufriedenheit in West und Ost, einmal mit Achse ab 0 und einmal abgeschnitten.' })] },
      { id: 'a1-5', art: 'fragen', titel: 'Ergebnis festhalten', fragen: 'a1',
        mehr: [denk('Wo lese ich das ab?', { grund: 'k1-ergebnis',
          kurz: 'Jede der Fragen hat einen festen Ort, an dem du die Antwort ablesen kannst: deine erste Grafik, deine fertige Grafik oder die Tabelle von <code>frequency(hs01)</code>.',
          denken: [
            '<b>Balken ganz rechts:</b> Schau in die erste Grafik, die noch Wörter und alle Befragten zeigt.',
            '<b>Wie viele darin stecken:</b> Führ <code>allbus %&gt;% frequency(hs01)</code> aus und such die Zeile „Total missing“.',
            '<b>n für die Bildunterschrift:</b> dieselbe Tabelle, Zeile „Total valid“.',
            '<b>Häufigste Antwort:</b> Such in der fertigen Grafik den höchsten Balken und lies das Wort darunter. Vergleich es mit deiner Festlegung aus Schritt 1.',
          ],
          verwechslung: 'R schreibt Tausender mit Komma: 5,246 heißt 5.246.' })] },
    ],
    probier: { idee: 'Wie schätzen Menschen ab 65 ihre Gesundheit ein?', code: T.frei_a1.code },
    ohneGrafik: '<code>allbus %&gt;% frequency(hs01)</code> zeigt dieselben Zahlen als Tabelle.' },

  { id: 'a2', n: 2, titel: 'Der Rätselkasten', pflicht: false, grund: 'g2',
    frage: 'Welche Frage steckt hinter welcher Form?',
    ziel: 'du erkennst an Stufenzahl, Gipfel und Häufungen, welche Frage hinter einer Verteilung steckt.',
    schritte: [
      { id: 'a2-1', art: 'raetsel', titel: 'Zuordnen',
        text: 'Vier Verteilungen ohne Beschriftung, fünf Fragen. Eine Frage bleibt übrig. Achte auf <b>Stufen</b>, <b>Gipfel</b> und <b>Häufungen</b>.',
        mehr: [denk('Woran erkenne ich Formen?', { grund: 'k2-formen',
          kurz: 'Im Rätselkasten fehlen die Beschriftungen, es bleibt die <b>Form</b> der Verteilung. Drei Dinge verraten die Frage dahinter: wie viele <b>Stufen</b> es gibt, wo der <b>Gipfel</b> liegt und ob einzelne Werte als <b>Häufungen</b> herausragen.',
          denken: [
            'Zähl bei jedem Bild die Säulen und vergleich sie mit den Skalen in der Liste: Welche Fragen haben überhaupt so viele Stufen?',
            'Bleiben zwei Fragen mit gleich vielen Stufen übrig, schau auf den Gipfel: Wo würdest du bei dieser Frage die meisten Antworten erwarten, in der Mitte oder an einem Ende?',
            'Was heißt es, wenn eine Form sehr viele verschiedene Werte hat?',
            'Eine Frage bleibt übrig. Du musst nicht alle fünf unterbringen.',
          ],
          bild: 'Shapes', bildtext: 'Vier andere Fragen aus dem ALLBUS 2023, mit Beschriftung. Das Dreieck zeigt den Mittelwert, der Strich den Median. Keine davon steht im Rätselkasten.',
          verwechslung: 'Der <b>Gipfel</b> ist die höchste Säule, nicht die Mitte der Skala. Gibt es mehrere Gipfel, heißt das oft: Die Befragten sind gespalten.' })] },
      { id: 'a2-2', art: 'code', titel: 'Eine Zuordnung in R prüfen', wk: ['a2'],
        text: 'Tausch <b>beide</b> markierten Stellen gegen die Variable, die du prüfen willst.',
        mehr: [denk('Woran sehe ich, dass es geklappt hat?', { grund: 'k2-pruefen',
          kurz: 'Die Vorlage zeichnet eine Verteilung als Balken. Die Variable steht zweimal in der Kette: In <code>drop_na()</code> sagt sie, bei welcher Frage fehlende Werte wegfallen, in <code>aes(x = …)</code>, welche Frage gezählt wird.',
          denken: [
            'Nimm ein Bild aus Schritt 1, bei dem du unsicher bist, und die Variable, die du ihm zugeordnet hast.',
            'Tausch im Journal beide gelben Stellen gegen diesen Namen und führ den Block aus.',
            'Vergleich deine Grafik mit dem Bild: Stimmt die Zahl der Säulen, liegt der Gipfel an derselben Stelle?',
            'Lies die Beschriftung unter der x-Achse: Ist das die Frage, die du gemeint hast?',
          ],
          verwechslung: 'Dieselbe Form heißt nicht dieselbe Frage. Zwei Fragen mit gleich vielen Stufen und ähnlichem Gipfel sehen sich ähnlich; erst die Beschriftung sagt, welche es ist.',
          zusatz: 'Unter der x-Achse steht die Beschriftung der Frage (bei älteren ggplot2-Versionen der Variablenname). Tauschst du nur eine Stelle, zeigt die Grafik die falsche Variable oder lässt bei der falschen Frage Personen weg.' })] },
    ],
    probier: { idee: 'Wie verteilt sich die Frage, die übrig geblieben ist?', code: T.frei_a2.code },
    ohneGrafik: 'Jedes Bild hat eine Textfassung mit Stufenzahl und Höhen. Prüfen kannst du mit <code>allbus %&gt;% frequency(pa01)</code>.' },

  { id: 'a3', n: 3, titel: 'Wie lange dauert der Fragebogen?', pflicht: false, grund: 'g3',
    frage: 'Wie lange brauchen die Befragten für den Fragebogen?',
    ziel: 'ein Histogramm der Bearbeitungsdauer mit begründetem Ausschnitt und passender Kistenbreite.',
    schritte: [
      { id: 'a3-p', art: 'festlegen', titel: 'Erst festlegen', pred: 'a3',
        mehr: [denk('Wie lege ich mich fest?', { grund: 'k3-kennzahlen',
          kurz: 'Du schätzt, wie viele Minuten die Hälfte der Befragten höchstens für den Fragebogen braucht. Das ist der <b>Median</b>: Die eine Hälfte braucht so lange oder kürzer, die andere länger. Es zählt nicht, ob du richtig liegst.',
          denken: [
            'Stell dir vor, du füllst den ganzen ALLBUS-Fragebogen aus: Wie lange würdest du selbst wohl brauchen?',
            'Frag dich, ob die meisten schneller oder langsamer wären als du.',
            'Denk an die Mitte, nicht an die Langsamsten: Ein paar Bögen, die lange herumliegen, verschieben den Median kaum.',
            'Gib eine Zahl in Minuten ein. Ob sie passt, siehst du in Schritt 2.',
          ],
          verwechslung: 'Gefragt ist nicht der Durchschnitt (der <b>Mittelwert</b>), sondern die Mitte der Reihe (der <b>Median</b>). Bei sehr langen Ausreißern liegen beide weit auseinander.' })] },
      { id: 'a3-1', art: 'code', titel: 'Kennzahlen ansehen', wk: ['a3d'], bekannt: 'describe() aus Sitzung 3',
        text: 'Schau auf Median und Spannweite der Bearbeitungsdauer <code>xt10</code>.',
        mehr: [denk('Was ist Range?', { grund: 'k3-kennzahlen',
          kurz: '<code>describe(xt10)</code> gibt dir Kennzahlen der Bearbeitungsdauer in Minuten. Der <b>Median</b> ist die Mitte der Reihe. <b>Range</b> ist die Spannweite: größter minus kleinster Wert.',
          denken: [
            'Such in der Ausgabe die Spalten Median und Range.',
            'Lies Range und frag dich: Wie viele Tage oder Wochen wären das? Ein Tag hat 1.440 Minuten.',
            'Vergleich Mittelwert und Median: Liegen sie nah beieinander oder weit auseinander? Was sagt das über sehr lange Bögen?',
            'Vergleich den Median mit deiner Festlegung aus Schritt 1.',
          ],
          verwechslung: 'R schreibt Kommazahlen mit Punkt: 12.500 heißt in der Ausgabe zwölfeinhalb, nicht zwölftausendfünfhundert.' })] },
      { id: 'a3-2', art: 'code', titel: 'Histogramm ohne Angaben', wk: ['a3o'],
        text: 'Was siehst du, und warum?',
        mehr: [denk('Warum sieht das Bild so aus?', { grund: 'k3-erstes',
          kurz: 'Ein <b>Histogramm</b> sammelt die Werte in Kisten (Fachbegriff: <b>Klassen</b>) und zählt, wie viele in jede fallen. Ohne weitere Angabe teilt R die Strecke vom kleinsten bis zum größten Wert in 30 gleich breite Kisten.',
          denken: [
            'Schau auf die x-Achse: Bis zu welchem Wert reicht sie?',
            'Vergleich das mit Range aus Schritt 2.',
            'Rechne grob: Wird diese Strecke in 30 Kisten geteilt, wie breit ist dann eine Kiste?',
            'Frag dich: In welche Kiste fallen dann die meisten Bögen, und wie viele bleiben für die übrigen?',
          ],
          verwechslung: 'Eine Säule im Histogramm steht für eine Kiste voller Werte, nicht für einen einzelnen Wert wie ein Balken bei <code>geom_bar()</code>.',
          zusatz: 'Die zwei Meldungen von R sind Hinweise, keine Fehler: R hat selbst 30 Kisten gewählt, und 220 Zeilen ohne Dauer wurden weggelassen.' })] },
      { id: 'a3-3', art: 'code', titel: 'Extreme abschneiden', wk: ['a3n'],
        text: '<code>filter(xt10 &lt;= 180)</code> behält nur Bögen bis 180 Minuten. Wie viele bleiben?',
        mehr: [denk('Wer bleibt im Ausschnitt?', { grund: 'k3-kisten',
          kurz: '<code>filter(xt10 &lt;= 180)</code> prüft jede Reihe und behält nur Bögen bis 180 Minuten. <code>describe()</code> rechnet danach nur noch mit ihnen. So ein <b>Ausschnitt</b> ist eine Entscheidung, und sie gehört in die Bildunterschrift.',
          denken: [
            'Lies die Bedingung: Was ergibt sie für einen Bogen mit 240 Minuten? Und für einen Bogen ohne Dauer?',
            'Führ die Vorlage aus und such die Spalte N: So viele Bögen bleiben.',
            'Frag dich, welche zwei Gruppen weggefallen sind.',
            'Vergleich Median und Mittelwert mit Schritt 2: Was hat sich stark bewegt, was kaum?',
          ],
          verwechslung: 'Ohne Dauer heißt nicht „unter 180“. Für fehlende Werte ergibt die Prüfung <code>NA</code>, nicht <code>TRUE</code>, und <code>filter()</code> behält nur Reihen mit <code>TRUE</code>.' })] },
      { id: 'a3-4', art: 'code', titel: 'Kistenbreite einstellen', wk: ['a3m'],
        text: 'Probier <code>binwidth = 5</code>, <code>30</code> und <code>1</code>.',
        mehr: [denk('Wie wirkt binwidth?', { grund: 'k3-breite',
          kurz: '<code>binwidth</code> legt fest, wie breit jede Kiste ist; <code>boundary = 0</code> lässt die Kisten bei 0, 5, 10 … beginnen. Die Kistenbreite verändert, was du von der Form siehst; vergleiche selbst.',
          denken: [
            'Ändere im Journal nur die gelbe Zahl und führ den Block jedes Mal neu aus: erst 5, dann 30, dann 1.',
            'Bei 5: Wo liegt der Gipfel, und zu welcher Seite läuft die Form aus?',
            'Bei 1: Ragen einzelne Säulen heraus? Lies die Minutenzahl darunter: eine runde oder eine krumme Zahl?',
            'Zurück auf 30: Was siehst du jetzt an den Stellen, an denen bei 1 Säulen herausragten?',
          ],
          bild: 'binwidth',
          verwechslung: '<code>binwidth = 30</code> heißt Kisten von 30 Minuten Breite, nicht 30 Kisten wie in der Meldung aus Schritt 3.' })] },
      { id: 'a3-5', art: 'fragen', titel: 'Ergebnis festhalten', fragen: 'a3',
        mehr: [denk('Wo lese ich das ab?', { grund: 'k3-breite',
          kurz: 'Jede Frage hat einen festen Ort in deinen Ausgaben: die Kennzahlen aus Schritt 2 und 4 oder die Histogramme aus Schritt 3 und 5.',
          denken: [
            '<b>Median:</b> die Ausgabe von <code>describe(xt10)</code> in Schritt 2, Spalte Median.',
            '<b>Warum fast nur eine Säule:</b> Vergleich die x-Achse aus Schritt 3 mit Range aus Schritt 2.',
            '<b>Wie viele bleiben:</b> die Ausgabe von Schritt 4, Spalte N.',
            '<b>Spitzen:</b> das Histogramm aus Schritt 5, erst mit <code>binwidth = 1</code>, dann mit <code>30</code>.',
          ],
          verwechslung: 'In der Ausgabe von <code>describe()</code> ist der Punkt ein Komma. Lies die Zahl darum genau, bevor du sie einträgst.' })] },
    ],
    probier: { idee: 'Wie viele Bögen lagen länger als einen Tag herum, und auf welchem Weg kamen sie?', code: T.frei_a3.code },
    ohneGrafik: '<code>allbus %&gt;% filter(xt10 &lt;= 180) %&gt;% frequency(xt10)</code> zeigt die Rundungsspitzen: bei 60 stehen 216 Bögen, bei 59 nur 38.' },

  { id: 'a4', n: 4, titel: 'Papier, online oder Interview?', pflicht: true, grund: 'g4',
    frage: 'Dauert das Ausfüllen auf Papier länger als online?',
    ziel: 'du kannst begründen, auf welchem Weg das Ausfüllen am längsten dauert, und sagen, wer dabei im Bild fehlt.',
    info: 'Der ALLBUS 2023 wurde auf drei Wegen erhoben (<code>mode</code>): <b>CAPI</b> Interview mit Laptop, <b>CAWI</b> online, <b>MAIL</b> Papier per Post.',
    infoMehr: [warum('Ausreißer und gerundete Angaben', 'Einzelne Bögen lagen wochenlang herum (der längste über 61.000 Minuten). Damit man etwas sieht, wählt man einen Ausschnitt – dafür gibt es zwei Wege mit verschiedenen Ergebnissen. Außerdem sind 71,5 % der Papier-Angaben Vielfache von 5 (Interview 39,5 %, online 20 %): auf Papier wurde oft geschätzt. Bei 220 Papierbögen fehlt die Dauer ganz.')],
    schritte: [
      { id: 'a4-p', art: 'festlegen', titel: 'Erst festlegen', pred: 'a4',
        mehr: [denk('Wie lege ich mich fest?', { grund: 'k4-wege',
          kurz: 'Du legst fest, auf welchem der drei Wege das Ausfüllen wohl am längsten dauert: <b>CAPI</b> (Interview mit Laptop), <b>CAWI</b> (online) oder <b>MAIL</b> (Papier per Post). Es zählt nicht, ob du richtig liegst; deine Festlegung ist der Vergleichspunkt für später.',
          denken: [
            'Im Interview führt jemand durch den Bogen. Was bedeutet das für das Tempo?',
            'Online und auf Papier füllt man allein aus und kann unterbrechen. Was macht das mit der Dauer?',
            'Wähl einen Weg. Ob er passt, siehst du ab Schritt 2.',
          ],
          verwechslung: '„Am längsten“ meint hier die typische Dauer auf einem Weg, den <b>Median</b>, nicht den einen Bogen, der am längsten herumlag.' })] },
      { id: 'a4-1', art: 'code', titel: 'Hineinzoomen', wk: ['a4'],
        text: '<code>coord_cartesian()</code> zeigt nur 0 bis 180 Minuten, rechnet aber mit <b>allen</b> Bögen.',
        mehr: [denk('Wie lese ich den Boxplot?', { grund: 'k4-lineal',
          kurz: 'Ein <b>Boxplot</b> zeigt je Weg den <b>Median</b> als Strich und die mittlere Hälfte der Bögen als Kasten. <code>coord_cartesian()</code> ist eine Lupe: Das Bild zeigt nur 0 bis 180 Minuten, gerechnet wird aber mit allen Bögen.',
          denken: [
            'Lies unter den Kästen, welcher zu welchem Weg gehört. <code>to_label(mode)</code> schreibt die Namen hin.',
            'Such in jedem Kasten den Strich und vergleich die Höhe der drei Striche.',
            'Denk an das, was du nicht siehst: Bögen über 180 Minuten ragen aus dem Bild, rechnen aber mit. Auf welchem Weg könnten viele davon stecken?',
            'Vergleich mit deiner Festlegung aus Schritt 1.',
          ],
          bild: 'LinealZumBoxplot', bildtext: 'Klick dich durch die Schritte: Elf Befragte nennen ihre Wochenarbeitsstunden. Die letzten zwei zeigen, was Ausreißer und Weglassen mit der Mitte machen.',
          verwechslung: 'Ein breiterer Abschnitt im Boxplot heißt nicht „mehr Leute“. In jedem Viertel stehen gleich viele, sie liegen nur weiter auseinander.',
          zusatz: '„Removed 220 rows“: Das sind die Papierbögen, bei denen die Dauer ganz fehlt. Sie können in keinem Bild auftauchen.' })] },
      { id: 'a4-2', art: 'code', titel: 'Abschneiden', wk: ['a4f'],
        text: '<code>filter()</code> wirft Bögen über 180 Minuten hinaus, <b>bevor</b> gerechnet wird. Wo liegt jetzt der Strich im Kasten?',
        mehr: [denk('Zoomen oder abschneiden?', { grund: 'k4-zoom',
          kurz: '<code>filter(xt10 &lt;= 180)</code> wirft die Bögen über 180 Minuten hinaus, <b>bevor</b> gerechnet wird. Die Lupe aus Schritt 2 hat nur den Blick verändert. Darum können Kästen und Striche jetzt an einer anderen Stelle liegen.',
          denken: [
            'Vergleich die Kette mit Schritt 2: Was ist neu, was fehlt?',
            'Frag dich: Welche Bögen sind schon weg, wenn <code>ggplot()</code> den Kasten berechnet?',
            'Leg beide Bilder nebeneinander und vergleich je Weg den Strich: Wo bewegt er sich viel, wo kaum?',
            'Frag dich, auf welchem Weg besonders viele lange Bögen herausgefallen sein könnten.',
          ],
          bild: 'zoomFilter', bildtext: 'Der Strich im Kasten ist der Median: der mittlere Stein, wenn man die Bögen nach Dauer sortiert. Beim Hineinzoomen rechnen alle Steine mit, auch die, die über 180 aus dem Bild ragen. Beim Abschneiden fallen die langen Bögen weg, bevor gerechnet wird, und ein anderer Stein steht in der Mitte. <span>Die Steine sind ein Beispiel mit sieben Bögen.</span>',
          verwechslung: 'Die Lupe ändert nur, was du siehst. <code>filter()</code> ändert, wer mitgerechnet wird.' }),
          warum('Was zeigt ein Boxplot?', 'Der Strich ist der Median, der Kasten reicht vom unteren zum oberen Quartil (Q1 bis Q3): In ihm liegt die mittlere Hälfte.', 'k4-lineal')] },
      { id: 'a4-3', art: 'code', titel: 'Zahlen je Weg vergleichen', wk: ['a4z', 'a4zf'], bekannt: 'describe() aus Sitzung 3',
        text: 'Tausch die markierte Zahl: 2 = CAPI, 3 = CAWI, 4 = MAIL. Einmal ohne, einmal mit Filter.',
        mehr: [denk('Was heißen show, Q25 und Q75?', { grund: 'k4-zahlen',
          kurz: '<code>describe()</code> rechnet für einen Weg Median und Quartile aus, einmal mit allen Bögen, einmal nur bis 180 Minuten. <code>show =</code> wählt die Kennzahlen. <b>Q25</b> ist das untere Quartil (Q1), <b>Q75</b> das obere (Q3): die Ränder des Kastens.',
          denken: [
            'Tausch in der ersten Vorlage die gelbe Zahl nacheinander gegen 2, 3 und 4. Notier je Weg Median und N.',
            'Mach dasselbe mit der zweiten Vorlage. Das Komma in <code>filter(mode == 4, xt10 &lt;= 180)</code> heißt „und“: Beides muss stimmen.',
            'Vergleich je Weg ohne und mit Filter: Wie stark ändern sich N und Median?',
            'Schau auch auf Missing: Auf welchem Weg fehlen Angaben ganz?',
          ],
          verwechslung: 'Im Filter steht <code>==</code>, nicht <code>=</code>. Das doppelte Gleichheitszeichen fragt „ist gleich?“.' })] },
      { id: 'a4-4', art: 'fragen', titel: 'Ergebnis festhalten', fragen: 'a4',
        mehr: [denk('Wo lese ich das ab?', { grund: 'k4-zahlen',
          kurz: 'Die Fragen vergleichen Hineinzoomen und Abschneiden. Du liest in den Grafiken aus Schritt 2 und 3 und in den Zahlen aus Schritt 4.',
          denken: [
            '<b>Höchster Median mit allen Bögen:</b> die Striche in Schritt 2 oder die Ausgaben ohne Filter aus Schritt 4.',
            '<b>Höchster Median nach dem Abschneiden:</b> die Striche in Schritt 3 oder die Ausgaben mit Filter aus Schritt 4.',
            '<b>Herausgefallene Papierbögen:</b> N für <code>mode == 4</code> ohne Filter minus N mit Filter.',
            '<b>Reihenfolge und Bericht:</b> Vergleich, wie viele Bögen je Weg herausfallen. Frag dich bei jeder Aussage: Gilt sie für alle Bögen oder nur für einen Ausschnitt?',
          ],
          verwechslung: 'Der Strich im Kasten ist der Median, nicht der Mittelwert.' })] },
    ],
    plenum: 'Welche der beiden Grafiken würdet ihr drucken, und was muss in die Bildunterschrift? Bringt eure Antwort mit.',
    probier: { idee: 'Sind die Befragten auf den drei Wegen unterschiedlich alt?', code: T.frei_a4.code },
    ohneGrafik: 'Die Vorlagen in Schritt 4 geben Median, Quartile, N und Missing für jeden Weg.' },
];
const FREI = {
  a1: [
    { stufe: 'Abwandeln', text: 'Zeig eine andere Frage mit wenigen Stufen als Balken, zum Beispiel das politische Interesse (pa02a).', tipp: 'Kopier deine Kette aus Schritt 3 und tausch überall <code>hs01</code> aus. Tipp: Tipp im Journal ein paar Buchstaben, dann <kbd>Tab</kbd> – die Vorschläge zeigen Variablen mit ihrer Frage.' },
    { stufe: 'Erweitern', text: 'Mach die Grafik schöner: farbige Balken, und lange Beschriftungen gut lesbar.', tipp: '<code>geom_bar(fill = "steelblue")</code> färbt die Balken, <code>+ coord_flip()</code> legt sie quer.' },
    { stufe: 'Eigene Frage', text: 'Schätzen Menschen in Ost und West ihre Gesundheit anders ein?', tipp: '<code>+ facet_wrap(~ eastwest)</code> zeichnet für jede Gruppe ein eigenes Bild; mit <code>to_label(eastwest)</code> steht Ost und West dran. Achtung: Die Gruppen sind verschieden groß. Was heißt das für den Vergleich?' },
  ],
  a2: [
    { stufe: 'Abwandeln', text: 'Such dir eine Frage, schätze vorher ihre Form, und prüf dann.', tipp: 'Tipp im Journal ein Stichwort-Anfang wie <code>pt</code> und drück <kbd>Tab</kbd>: Die Vorschläge zeigen die Variablen mit ihrer Frage. Dann die Vorlage aus Schritt 2 nehmen.' },
    { stufe: 'Eigene Frage', text: 'Bau ein Rätsel für deine Sitznachbarn: eine Verteilung ohne Beschriftung.', tipp: '<code>+ labs(x = NULL, y = NULL)</code> entfernt die Achsentitel.' },
  ],
  a3: [
    { stufe: 'Abwandeln', text: 'Zeichne ein Histogramm des Alters (age). Bei welcher Kistenbreite erkennt man die Form am besten?', tipp: 'Probier <code>binwidth = 1</code>, <code>5</code> und <code>10</code>.' },
    { stufe: 'Erweitern', text: 'Zeichne den Median als senkrechte Linie ins Histogramm.', tipp: '<code>+ geom_vline(xintercept = 65)</code>. Den Median holst du dir mit <code>describe()</code>; nach dem Filter ist er ein anderer.' },
    { stufe: 'Eigene Frage', text: 'Brauchen ältere Befragte länger für den Fragebogen?', tipp: 'Zwei Variablen mit vielen Werten: Punkte. <code>ggplot(aes(x = age, y = xt10)) + geom_point(alpha = 0.2)</code>, vorher <code>filter(xt10 &lt;= 180)</code>.' },
  ],
  a4: [
    { stufe: 'Abwandeln', text: 'Sind die Befragten auf den drei Wegen unterschiedlich alt?', tipp: 'Nimm die Boxplot-Vorlage und tausch <code>xt10</code> gegen <code>age</code>. Brauchst du dann noch einen Ausschnitt?' },
    { stufe: 'Erweitern', text: 'Was verschweigt der Kasten? Zeig die ganze Form der Dauer je Weg.', tipp: '<code>geom_violin()</code> statt <code>geom_boxplot()</code>. Was siehst du beim Papier?' },
    { stufe: 'Eigene Frage', text: 'Stell deine eigene Frage an die Bearbeitungsdauer oder den Erhebungsweg.', tipp: 'Variablen schlägt dir das Journal mit <kbd>Tab</kbd> vor. Halte im Journal fest, was du gefunden hast.' },
  ],
};

/* ---------- Eigene Schrittarten dieses Kapitels ---------- */
function achse(s, H) {
  const q = s.frage; const f = document.createElement('form'); f.noValidate = true; f.className = 'fragen';
  f.innerHTML = `<div class="frage"><fieldset><legend>${esc(q.label)}</legend><div class="radios">${q.options.map(o => `<label><input type="radio" name="achse" value="${o.value}"> ${esc(o.label)}</label>`).join('')}</div></fieldset><p class="r" aria-live="polite"></p></div><div><button type="submit" class="knopf hell">Begründung ansehen</button></div>`;
  f.onsubmit = ev => {
    ev.preventDefault(); const v = f.querySelector('input:checked')?.value; const box = $('.frage', f);
    if (!v) { $('.r', box).textContent = 'Leg dich zuerst fest.'; return; }
    box.className = 'frage ' + (v === q.target ? 'ok' : 'no');
    $('.r', box).textContent = (v === q.target ? 'Richtig. ' : 'Noch nicht. ') + q.right; H.fertig(s.id);
  };
  return f;
}

function saeulen(counts) {
  const max = Math.max(...counts), w = 220, h = 110, bw = w / counts.length;
  return `<svg viewBox="0 0 ${w} ${h + 4}" aria-hidden="true">${counts.map((c, i) => { const hh = Math.max(1, c / max * h); return `<rect x="${i * bw + bw * .1}" y="${h - hh}" width="${bw * .8}" height="${hh}" fill="#A79FE2" stroke="#6f63c9" stroke-width="${counts.length > 20 ? 0 : 1}"/>`; }).join('')}<line x1="0" x2="${w}" y1="${h}" y2="${h}" stroke="#857A6B"/></svg>`;
}
function raetsel(s, H) {
  const div = document.createElement('div');
  const vars = Object.keys(D.RIDDLE_NAMES);
  div.innerHTML = `    <ul class="raetsel-vars" aria-label="Fünf Fragen zur Auswahl"><li><code>dw15</code> Arbeitsstunden/Woche</li><li><code>pa01</code> Links-rechts (1–10)</li><li><code>pa02a</code> Polit. Interesse (1 sehr stark – 5 gar nicht)</li><li><code>vm20</code> Sterbehilfe (−3 bis +3)</li><li><code>pt03</code> Vertrauen Bundestag (1–7)</li></ul>
    <form class="raetsel" novalidate>${Object.keys(D.RIDDLE).map(k => {
      const c = D.RIDDLE[k].counts, max = Math.max(...c);
      const text = k === 'B' ? 'viele schmale Säulen von 0 bis 90, bei 40 mit Abstand die höchste.' : `${c.length} Säulen, relative Höhen: ${c.map(a => Math.round(a / max * 10)).join(', ')}.`;
      return `<figure><figcaption>${k}</figcaption>${saeulen(c)}<p class="sr-only" id="rt-${k}">Verteilung ${k}: ${text}</p>
        <select aria-label="Frage zu ${k}" aria-describedby="rt-${k}" data-k="${k}"><option value="">wählen</option>${vars.map(v => `<option value="${v}">${esc(D.RIDDLE_NAMES[v])}</option>`).join('')}</select><p class="r" aria-live="polite"></p></figure>`;
    }).join('')}</form><div style="margin-top:8px"><button type="button" class="knopf">Prüfen</button> <span class="rueck" aria-live="polite"></span></div>`;
  $('.knopf', div).onclick = () => {
    let ok = 0;
    div.querySelectorAll('select').forEach(sel => {
      const k = sel.dataset.k, r = $('.r', sel.parentNode);
      if (!sel.value) { r.textContent = ''; return; }
      const ja = sel.value === D.RIDDLE[k].answer; if (ja) ok++;
      r.className = 'r ' + (ja ? 'ok' : 'no'); r.textContent = (ja ? 'Passt: ' : 'Achte auf: ') + D.RIDDLE_FEATURES[k] + '.';
    });
    $('.rueck', div).textContent = ok === 4 ? D.RIDDLE_ALL_RIGHT : `${ok} von 4 richtig.`;
    if (ok === 4) H.fertig(s.id);
  };
  return div;
}


return { BILD, TASKS, FREI, typen: { achse, raetsel } };
};
