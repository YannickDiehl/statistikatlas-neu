/* Kapitel 6 „Gewichtung und Zusammenhang“: Aufgaben, Zusatzinfos und eigene Schrittarten für die Lernpfad-Engine.
   Wird nach daten.js geladen; die Engine ruft window.KAPITEL(hilfen) einmal auf. */
'use strict';
window.KAPITEL = ({ D, T, esc, bild, warum, probier, denk }) => {
// Dieses Kapitel hat keine bilder/; die Engine fragt in denk-Fenstern trotzdem D.SVG[bild] ab. Leeres Objekt, damit React-Bilder aus BILDER greifen.
if (!D.SVG) D.SVG = {};
const $ = (s, el = document) => el.querySelector(s);

/* ---------- Texte aus content.ts an die Seitenzählung anpassen ----------
   In content.ts zählen die Schritte ohne „Erst festlegen“. Auf der Seite ist „Erst festlegen“ Schritt 1,
   darum rückt jede Schrittnummer in Fragen und Hilfen um eins. Verweise auf „Grundlage …“ zeigen nach „Verstehen“. */
const umnummern = s => typeof s !== 'string' ? s : s
  .replace(/Schritt (\d+)/g, (m, n) => `Schritt ${Number(n) + 1}`)
  .replace('aus Grundlage 2c', 'in „Verstehen“ zu Aufgabe 2')
  .replace('Schau in Grundlage 3b', 'Schau in „Verstehen“ zu Aufgabe 3');
const frage = q => ({ ...q, label: umnummern(q.label), help: umnummern(q.help), right: umnummern(q.right), hint: umnummern(q.hint) });
const Q = k => D.QUESTIONS[k].map(frage);
for (const k of Object.keys(D.HINTS)) D.HINTS[k] = D.HINTS[k].map(umnummern);

/** „Erst festlegen“ mit der Auflösung aus content.ts (dort `resolution`; sie erscheint, wenn alle Fragen der Aufgabe richtig sind). */
const vor = k => { const p = D.PREDICTIONS[k]; return { id: p.id, prompt: p.prompt, options: p.options, aufloesung: p.resolution }; };

const RSTUDIO = warum('Lieber in RStudio?', 'Dann führst du dort vorher den Startblock aus (Pakete laden, ALLBUS einlesen). Danach kopierst du die Vorlage mit <b>Kopieren</b> in dein ⟪Skript⟫.<pre>' + esc(T.start.code) + '</pre>', 'r1');

/* ---------- Zusatzinfos mit Bild: Kapitel 6 hat keine bilder/ ---------- */
const BILD = {};

/* ---------- Aufgaben ---------- */
const TASKS = [
  { id: 'a1', n: 1, titel: 'Wie zufrieden ist Deutschland mit der Demokratie?', pflicht: true, grund: 'g1',
    frage: 'Wie viele Menschen in Deutschland sind mit der Demokratie zufrieden, und was ändert die Gewichtung daran?',
    ziel: 'du kannst sagen, wie viel Prozent mindestens etwas zufrieden sind, ohne und mit Gewicht, und erklären, warum die Zahl mit Gewicht anders ausfällt.',
    info: 'Der ALLBUS fragt nach der Zufriedenheit mit der Demokratie in Deutschland (<code>ps03</code>). Es gibt sechs ⟪Ausprägungen|auspraegung⟫: 1 sehr zufrieden, 2 ziemlich zufrieden, 3 etwas zufrieden, 4 etwas unzufrieden, 5 ziemlich unzufrieden, 6 sehr unzufrieden. Als „zufrieden“ zählen hier alle mit 1, 2 oder 3.',
    infoMehr: [warum('Warum fehlt fast ein Drittel?', 'Gut zwei Drittel der Befragten haben diese Frage bekommen. Die übrigen hatten eine andere Fragebogen-Variante und stehen bei den ⟪fehlenden Werten|fehlende-werte⟫ unter „⟪TNZ: SPLIT|tnz⟫“ (kennst du aus Sitzung 3).', 'k1-cum')],
    schritte: [
      { id: 'a1-p', art: 'festlegen', titel: 'Erst festlegen', vorhersage: vor('a1'),
        mehr: [denk('Wie lege ich mich fest?', { grund: 'k1-ost',
          kurz: 'Du sagst vorher, was mit dem ⟪Anteil|relative-haeufigkeit⟫ der Zufriedenen passiert, wenn du gewichtest. Es zählt nicht, ob du richtig liegst: Deine Festlegung ist der Vergleichspunkt. Vorab: Im ALLBUS ist der Osten absichtlich stärker vertreten als in Deutschland.',
          denken: [
            'Wie viele von 100 Befragten in der ⟪Stichprobe⟫ wohnen im Osten, und wie viele von 100 Erwachsenen in Deutschland?',
            'Das Gewicht soll die Befragten so zählen, wie Deutschland verteilt ist. Zählt der Osten dann mehr oder weniger als ohne Gewicht?',
            'Frag dich: Sind die Menschen in Ost und West wohl gleich zufrieden mit der Demokratie? Davon hängt ab, ob sich der Anteil überhaupt bewegt.',
            'Wähl eine Antwort. Ob sie stimmt, siehst du, wenn in Schritt 5 alle Fragen richtig sind.',
          ],
          verwechslung: 'Dass der Osten stärker vertreten ist, ist kein Fehler der Stichprobe, sondern geplant. Das Gewicht repariert keinen Fehler, es gleicht einen bekannten Plan aus.' })] },
      { id: 'a1-1', art: 'code', titel: 'Ohne und mit Gewicht auszählen', wk: ['a1a'], neu: true, bekannt: 'Cum. % aus Sitzung 3',
        text: 'Die Vorlage zählt <code>ps03</code> zweimal aus: erst ohne, dann mit <code>weights = wghtpew</code>. Lies jeweils in der Spalte <b>Cum. %</b> die Zeile <b>3 ETWAS ZUFRIEDEN</b>. Cum. % sind die ⟪kumulierten Prozent|kumulierte-haeufigkeit⟫: Sie zählen die Prozente von oben zusammen. In Zeile 3 steht also, wie viele 1, 2 oder 3 angegeben haben.',
        baustein: 'CumTabelle',
        mehr: [denk('Was macht das Gewicht?', { grund: 'k1-gewicht',
          kurz: 'Die Vorlage zählt <code>ps03</code> zweimal aus: erst ohne, dann mit <code>weights = wghtpew</code>. Mit diesem Gewicht zählt eine Person aus dem Westen 1,22-fach, eine aus dem Osten 0,53-fach. Woher diese Zahlen kommen, zeigt das Bild.',
          denken: [
            'Such die beiden Tabellen: Welche trägt die Überschrift „Weighted Frequency Analysis Results“?',
            'Geh in jeder Tabelle zur Zeile 3 ETWAS ZUFRIEDEN und dann in die Spalte <b>Cum. %</b>.',
            'Frag dich, was dort steht: der Anteil von Code 3 allein oder der Anteil aller, die 1, 2 oder 3 angegeben haben?',
            'Vergleich die beiden Zahlen: Ändert das Gewicht etwas, und in welche Richtung?',
          ],
          bild: 'Gewicht', bildtext: 'Das Gewicht ist der Anteil in Deutschland, der ⟪Grundgesamtheit⟫, geteilt durch den Anteil in der Stichprobe.',
          verwechslung: 'Cum. % in Zeile 3 ist nicht der Anteil von Code 3 allein. Den zeigt Valid %.',
          zusatz: 'In der gewichteten Tabelle sind die ⟪Häufigkeiten|absolute-haeufigkeit⟫ unter N keine Personenzahlen mehr, sondern Summen der Gewichte.' }),
          RSTUDIO,
          warum('Welche Tabelle ist gewichtet?', 'Die zweite. Sie trägt die Überschrift „Weighted Frequency Analysis Results“. Die Zahlen unter N sind dort keine Personen mehr, sondern Summen der Gewichte.', 'r1')] },
      { id: 'a1-2', art: 'code', titel: 'In die Landesteile schauen', wk: ['a1b'], bekannt: 'filter() aus Sitzung 2',
        text: 'Die Vorlage zeigt den Osten (<code>eastwest == 2</code>), ohne und mit Gewicht. Hol sie ins Journal und führ sie aus. Dann tausch <b>im Journal</b> beide markierten Stellen gegen 1 (Westen) und führ den Block noch einmal aus. Beide Stellen müssen gleich sein.',
        mehr: [denk('Warum zwei markierte Stellen?', { grund: 'k1-landesteil',
          kurz: '<code>filter(eastwest == 2)</code> behält nur die Befragten im Osten; 1 heißt Westen. Die Kette steht zweimal da, ohne und mit Gewicht, und jede hat ihr eigenes <code>filter()</code>. Darum gibt es zwei markierte Stellen, und beide müssen gleich sein.',
          denken: [
            'Führ die Vorlage zuerst so aus, wie sie ist: Das ist der Osten. Lies in beiden Tabellen Cum. % in Zeile 3.',
            'Tausch im Journal beide markierten Stellen gegen 1 und führ den Block noch einmal aus: der Westen.',
            'Vergleich innerhalb jedes Landesteils: Wie stark unterscheiden sich die Tabellen ohne und mit Gewicht?',
            'Vergleich dann Ost und West miteinander: Wo sind mehr Menschen mindestens etwas zufrieden?',
          ],
          verwechslung: 'Tauschst du nur eine Stelle, vergleichst du einen Landesteil ohne Gewicht mit dem anderen mit Gewicht.',
          zusatz: 'Das doppelte Gleichheitszeichen <code>==</code> fragt „ist gleich?“.' })] },
      { id: 'a1-3', art: 'lesen', titel: 'Deuten',
        text: 'Vergleiche: Wie stark ändert das Gewicht die Zahl im Osten, wie stark für ganz Deutschland? Die Fragen im nächsten Schritt führen dich hin.',
        mehr: [denk('Wann ändert das Gewicht ein Ergebnis?', { grund: 'k1-mischung',
          kurz: 'Die Zahl für ganz Deutschland ist eine <b>Mischung</b>: Anteil West an allen mal Prozent im Westen plus Anteil Ost an allen mal Prozent im Osten. Das Gewicht ändert die Prozentwerte in West und Ost kaum, wohl aber das Mischungsverhältnis. Innerhalb eines Landesteils haben alle fast dasselbe Gewicht.',
          denken: [
            'Leg deine Zahlen aus Schritt 3 nebeneinander: Welcher Landesteil hat den höheren Anteil Zufriedener?',
            'Schau auf die Gewichte, die das „?“ in Schritt 2 nennt: Welcher Landesteil hat ein Gewicht unter 1?',
            'Was folgt daraus: In welche Richtung muss sich die Zahl für Deutschland bewegen?',
            'Und warum bewegt sie sich innerhalb eines Landesteils kaum?',
          ],
          bild: 'Mischung', bildtext: 'Ein anderes Beispiel, damit nichts vorweggenommen ist: der Anteil ohne Konfession in West und Ost. Schieb den Regler für den Ost-Anteil und sieh, wie der Gesamtanteil ohne und mit Gewicht wandert.',
          verwechslung: '„Gewichtet ist genauer, ungewichtet ist falsch.“ Beide Zahlen sind richtig gerechnet. Die ungewichtete beschreibt die Befragten, die gewichtete schätzt Deutschland.' })] },
      { id: 'a1-4', art: 'fragen', titel: 'Ergebnis festhalten', fragen: Q('a1'),
        mehr: [denk('Wo lese ich das ab?', { grund: 'k1-ergebnis',
          kurz: 'Schritt 5 fragt nach vier Zahlen und einer Begründung. Jede Zahl steht in der Spalte Cum. %, Zeile 3, in einer der Tabellen aus Schritt 2 oder 3.',
          denken: [
            '<b>Ohne Gewicht:</b> die erste Tabelle aus Schritt 2.',
            '<b>Mit Gewicht:</b> die zweite Tabelle aus Schritt 2, mit „Weighted“ in der Überschrift.',
            '<b>Osten und Westen:</b> Schritt 3, einmal mit 2 und einmal mit 1 an beiden markierten Stellen. Ob ohne oder mit Gewicht, macht dort kaum einen Unterschied.',
            '<b>Warum:</b> Vergleich Ost und West und denk an die Mischung aus Schritt 4.',
          ],
          verwechslung: 'R schreibt Kommazahlen mit Punkt: 33.7 heißt 33,7.' })] },
    ],
    probier: { idee: 'Ändert die Gewichtung auch Mittelwert und Median?', code: T.frei_a1.code },
    ohneGrafik: 'Alle Antworten stehen in den Tabellen von <code>frequency()</code>. Die Beispieltabelle in Schritt 2 hat eine Textfassung.' },

  { id: 'a2', n: 2, titel: 'Zufriedenheit und Wahlabsicht', pflicht: true, grund: 'g2',
    frage: 'Hängt die Zufriedenheit mit der Demokratie damit zusammen, welche Partei jemand wählen würde?',
    ziel: 'du kannst mit Zeilenprozenten zeigen, bei welchen Parteien die Zufriedenheit hoch oder niedrig ist, und das passende Zusammenhangsmaß wählen und deuten.',
    info: 'Die Wahlabsicht (<code>pv01</code>) fragt, welche Partei jemand bei einer Bundestagswahl wählen würde. Die Antworten: CDU-CSU, SPD, FDP, DIE GRUENEN, DIE LINKE, AFD, ANDERE PARTEI, WUERDE NICHT WAEHLEN. Wer nicht wahlberechtigt ist oder nichts angibt, fehlt. Die Zufriedenheit (<code>ps03</code>) fasst du wie in Aufgabe 1 zu zwei Kategorien zusammen: zufrieden (1 bis 3) und unzufrieden (4 bis 6).',
    schritte: [
      { id: 'a2-p', art: 'festlegen', titel: 'Erst festlegen', vorhersage: vor('a2'),
        mehr: [denk('Wie lege ich mich fest?', { grund: 'k2-staerke',
          kurz: 'Du schätzt, wie stark Wahlabsicht und Zufriedenheit zusammenhängen. Es zählt nicht, ob du richtig liegst: Deine Festlegung ist der Vergleichspunkt. Die vier Antworten stammen aus der <b>⟪Faustregel nach Cohen⟫: ab 0,1 schwach, ab 0,3 mittel, ab 0,5 stark</b>.',
          denken: [
            'Stell dir die Menschen vor, die verschiedene Parteien wählen würden: Wären sie wohl alle ähnlich zufrieden mit der Demokratie?',
            'Je weiter die Anteile der Zufriedenen zwischen den Parteien auseinanderliegen, desto stärker ist der Zusammenhang.',
            'Wähl eine Antwort. Ob sie stimmt, siehst du, wenn in Schritt 5 alle Fragen richtig sind.',
          ],
          verwechslung: 'Ein großer Zusammenhang ist nicht automatisch ein wichtiger, und ein kleiner nicht automatisch unwichtig. Die Faustregel ordnet nur die Größe ein.' })] },
      { id: 'a2-1', art: 'frage', titel: 'Skalenniveau bestimmen', frage: frage(D.QUESTIONS.a2[0]),
        text: 'Welches Skalenniveau hat die Wahlabsicht? Davon hängt ab, welches Maß passt.',
        mehr: [denk('nominal, ordinal, metrisch', { grund: 'k2-niveau',
          kurz: 'Für jedes <b>Skalenniveau</b> gibt es eigene Zusammenhangsmaße. Kurz gesagt sagt das Skalenniveau, ob die Werte eine Reihenfolge haben und ob ihre Abstände gleich viel bedeuten.',
          denken: [
            'Lies die acht Antworten von <code>pv01</code> in der Aufgabe.',
            'Frag zuerst nach der Reihenfolge: Lässt sich eine Antwort sinnvoll über oder unter einer anderen einordnen?',
            'Frag nur dann, wenn es eine Reihenfolge gibt, nach den Abständen: Bedeuten sie überall gleich viel?',
            'Ordne dann zu: Welches der drei Skalenniveaus aus Sitzung 4 passt zu deinen zwei Antworten? Alle drei mit Beispielen stehen in „Verstehen“.',
          ],
          verwechslung: 'Bei zwei Variablen entscheidet das niedrigere Skalenniveau, welches Maß passt.' })] },
      { id: 'a2-2', art: 'code', titel: 'Kreuztabelle mit Zeilenprozenten', wk: ['a2b'], bekannt: 'mutate() mit rec() und crosstab() aus Sitzung 5',
        text: 'Die Kette ⟪rekodiert⟫ zuerst mit <code>mutate()</code> und <code>rec()</code> die Zufriedenheit: Die neue ⟪Variable⟫ <code>zufrieden</code> hat zwei Kategorien, 1 bis 3 zufrieden und 4 bis 6 unzufrieden. Dann zeigt <code>crosstab()</code> eine ⟪Kreuztabelle⟫ mit ⟪Zeilenprozenten⟫, gewichtet. Neu ist nur das ⟪Gewicht|gewichte⟫ in <code>weights = wghtpew</code>.',
        mehr: [denk('Wie lese ich die Tabelle?', { grund: 'k2-tabelle',
          kurz: 'Die Kette bildet mit <code>mutate()</code> und <code>rec()</code> die Variable <code>zufrieden</code>: Codes 1 bis 3 werden 1, Codes 4 bis 6 werden 0, alles andere wird leer. <code>crosstab()</code> zeigt dann je Wahlabsicht, wie sie sich auf zufrieden und unzufrieden aufteilt (<b>Zeilenprozente</b>), gewichtet.',
          denken: [
            'Such im Kopf der Ausgabe „Weights variable: wghtpew“: Ist gewichtet gerechnet?',
            'Jede Wahlabsicht hat zwei Zeilen: oben die Anzahl (Summe der Gewichte), darunter „row %“.',
            'Geh für eine Partei in die Zeile „row %“ und dann in die Spalte „zufrieden“: Das ist der Anteil der mindestens etwas Zufriedenen bei dieser Partei.',
            'Lass den Blick die Spalte „zufrieden“ hinablaufen: Wo ist der Anteil hoch, wo niedrig?',
          ],
          verwechslung: 'Die obere Zeile jeder Partei ist gewichtet keine Personenzahl, sondern eine Summe der Gewichte.' }),
          warum('Warum Zeilenprozente?', 'Die Wahlabsicht steht in den Zeilen; ihre Parteien vergleichst du. Zeilenprozente sagen für jede Partei, wie sie sich aufteilt (kennst du aus Sitzung 5).', 'k2-tabelle')] },
      { id: 'a2-3', art: 'code', titel: 'Den Zusammenhang in einer Zahl', wk: ['a2c'], neu: true,
        text: 'Fass die ganze Tabelle in einer Zahl zusammen: ⟪Cramér-V⟫, gewichtet. Die Vorlage bildet <code>zufrieden</code> noch einmal genauso wie in Schritt 3, damit sie auch für sich allein läuft; im Journal schadet die Wiederholung nicht. (Der Kommentar in der Vorlage zählt „Erst festlegen“ nicht mit und sagt darum „Schritt 2“.) R gibt nur eine Zahl aus, zum Beispiel <code>[1] 0.1234567</code>. Lies sie mit drei Nachkommastellen.',
        mehr: [denk('Wie entsteht V?', { grund: 'k2-chi',
          kurz: '<b>Cramér-V</b> fasst die ganze Kreuztabelle in einer Zahl zusammen. Man vergleicht sie mit den ⟪erwarteten Häufigkeiten|erwartete-haeufigkeit⟫, also der Tabelle ohne Zusammenhang. Der Abstand heißt <b>⟪χ²|chi-quadrat⟫</b>; daraus wird eine Zahl zwischen 0 und 1. <code>cramers_v()</code> erledigt das in einem Aufruf.',
          denken: [
            'Lies die Vorlage: Die <code>mutate()</code>-Zeilen bilden <code>zufrieden</code> wie in Schritt 3, damit sie für sich allein läuft.',
            'Prüf, ob <code>weights = wghtpew</code> in der Klammer steht.',
            'R antwortet mit einer Zahl hinter <code>[1]</code>. Die <code>[1]</code> nummeriert nur die Ausgabe.',
            'Lies die Zahl mit drei Nachkommastellen: 0 heißt kein Zusammenhang, 1 vollständiger.',
          ],
          bild: 'ChiQuadrat', bildtext: 'Am Beispiel von 100 Befragten (Region und Konfession): von χ² zu ⟪Phi⟫ und Cramér-V.',
          verwechslung: '„V = 0,36 heißt: 36 % hängen zusammen.“ V ist kein Prozentwert, sondern eine Zahl auf einer Skala von 0 bis 1.' }),
          warum('Wie stark ist stark?', '⟪Faustregel nach Cohen⟫: ab 0,1 schwach, ab 0,3 mittel, ab 0,5 stark.', 'k2-staerke')] },
      { id: 'a2-4', art: 'fragen', titel: 'Ergebnis festhalten', fragen: Q('a2').slice(1),
        mehr: [denk('Wo lese ich das ab?', { grund: 'k2-staerke',
          kurz: 'Schritt 5 fragt nach zwei Prozentzahlen, nach V, nach der Stärke und danach, was V über die Richtung sagt. Die Zahlen stehen in den Ausgaben von Schritt 3 und 4.',
          denken: [
            '<b>Prozente je Partei:</b> Schritt 3, Zeile „row %“ unter dem Parteinamen, Spalte zufrieden.',
            '<b>V:</b> Schritt 4, die Zahl hinter <code>[1]</code>.',
            '<b>Stärke:</b> Ordne V mit der ⟪Faustregel nach Cohen⟫ ein, im Bild als Lineal.',
            '<b>Richtung:</b> Überleg, was V messen kann und ob die Wahlabsicht eine Reihenfolge hat.',
          ],
          bild: 'Faustregel',
          verwechslung: 'R schreibt Kommazahlen mit Punkt: 0.33 heißt 0,33.' })] },
    ],
    plenum: 'Heißt ein deutlicher Zusammenhang, dass die Wahlabsicht zufrieden oder unzufrieden macht, oder könnte es auch umgekehrt sein? Bringt einen Satz mit.',
    probier: { idee: 'Wie unterscheiden sich West und Ost, und was sagt Phi dazu?', code: T.frei_a2.code },
    ohneGrafik: 'Alles steht in Tabelle und Zahl: Zeilenprozente aus <code>crosstab()</code> in Schritt 3, V aus <code>cramers_v()</code> in Schritt 4.' },

  { id: 'a3', n: 3, titel: 'Wirtschaftslage und Demokratie', pflicht: true, grund: 'g3',
    frage: 'Sind Menschen, die die Wirtschaftslage in Deutschland schlechter einschätzen, unzufriedener mit der Demokratie?',
    ziel: 'du kannst Gamma und Tau-b für zwei geordnete Merkmale ausrechnen, Stärke und Richtung in einem Satz sagen und erklären, warum Gamma größer ausfällt.',
    info: 'Die Wirtschaftslage in Deutschland (<code>ep01</code>, kennst du aus Sitzung 5) hat fünf ⟪Ausprägungen|auspraegung⟫: 1 sehr gut, 2 gut, 3 teils/teils, 4 schlecht, 5 sehr schlecht. Ein höherer Code heißt also: schlechter eingeschätzt. Diesmal bleibt <code>ep01</code>, wie es ist. Die Zufriedenheit mit der Demokratie (<code>ps03</code>) polst du zuerst um, damit ein höherer Code „zufriedener“ heißt. Beide Merkmale haben eine Reihenfolge, aber keine sicher gleichen Abstände: ⟪ordinal⟫.',
    schritte: [
      { id: 'a3-p', art: 'festlegen', titel: 'Erst festlegen', vorhersage: vor('a3'),
        mehr: [denk('Wie lege ich mich fest?', { grund: 'k3-richtung',
          kurz: 'Du sagst vorher, welches <b>Vorzeichen</b> du erwartest. Das Vorzeichen sagt, in welche Richtung zwei Merkmale zusammenhängen: Positiv heißt, höhere Codes gehen mit höheren Codes einher; negativ heißt, höhere mit niedrigeren. Es zählt nicht, ob du richtig liegst.',
          denken: [
            'Lies die Codes: Was heißt bei <code>zufriedenheit</code> (umgepolt) ein höherer Code, was bei <code>ep01</code>?',
            'Überleg in Worten: Ist jemand, der die Wirtschaftslage schlechter einschätzt, wohl eher zufriedener oder unzufriedener mit der Demokratie?',
            'Übersetz deine Vermutung: Gehen dann die höheren Codes beider Variablen zusammen oder gegeneinander?',
            'Wähl eine Antwort. Ob sie stimmt, siehst du, wenn in Schritt 5 alle Fragen richtig sind.',
          ],
          verwechslung: 'Das Vorzeichen hängt an der Kodierung: Polt man eine Variable um, dreht sich das Vorzeichen, der Zusammenhang bleibt derselbe.' })] },
      { id: 'a3-1', art: 'code', titel: 'Umpolen und prüfen', wk: ['a3a'], bekannt: 'rules = "rev" aus Sitzung 5',
        text: 'Pole die Zufriedenheit um und prüfe es. In der Kontrolle muss bei Code 6 jetzt SEHR ZUFRIEDEN stehen.',
        mehr: [denk('Warum umpolen?', { grund: 'k3-umpolen',
          kurz: 'Im ⟪Datensatz⟫ heißt bei <code>ps03</code> die 1 „sehr zufrieden“ und die 6 „sehr unzufrieden“. <code>rec(ps03, rules = "rev")</code> dreht das um (<b>⟪umpolen⟫</b>): Danach heißt ein höherer Code „zufriedener“, und das Vorzeichen lässt sich leichter in einen Satz übersetzen. Mit <code>allbus &lt;-</code> davor bleibt die neue Variable <code>zufriedenheit</code> im Datensatz.',
          denken: [
            'Lies die Vorlage: Welche Variable wird umgepolt, und wie heißt die neue?',
            'Schau nach dem Ausführen in die Kontrolle: Welches Wort steht jetzt bei ⟪Code⟫ 6?',
            'Frag dich: Warum bleibt <code>ep01</code>, wie es ist? Was heißt dort ein höherer Code?',
          ],
          verwechslung: 'Umpolen ändert nicht, was jemand geantwortet hat. Wer „sehr zufrieden“ gesagt hat, steht danach bei Code 6 statt bei Code 1.',
          zusatz: 'Meldet R später „Column `zufriedenheit` doesn\'t exist“, führ zuerst den Block mit <code>mutate()</code> aus.' })] },
      { id: 'a3-2', art: 'code', titel: 'Gamma und Tau-b rechnen', wk: ['a3b'], neu: true,
        text: 'Rechne ⟪Gamma⟫ und ⟪Tau-b⟫, gewichtet. Die Vorlage polt oben noch einmal um wie in Schritt 2, damit sie auch für sich allein läuft; im Journal schadet das nicht. (Der Kommentar in der Vorlage zählt „Erst festlegen“ nicht mit und sagt darum „Schritt 1“.) Die Ausgabe hat zwei Teile: Zuerst kommt Gamma als einzelne Zahl hinter <code>[1]</code>, darunter der Block „Kendall\'s Tau“ mit der Zeile <code>tau = …</code>. Bei Gamma meldet R in Rot „2 cells (6.7%) has expected count &lt; 5 …“: ein Hinweis, kein Fehler. Das Bild zeigt die Codes beider Variablen als Pfeile; du brauchst es in Schritt 4.',
        baustein: 'Vorzeichen',
        mehr: [denk('Was vergleichen Gamma und Tau-b?', { grund: 'k3-formel',
          kurz: 'Gamma und Tau-b vergleichen Paare von Befragten. <b>⟪Konkordant|konkordanz⟫</b> (gleichläufig): Wer bei einem Merkmal höher liegt, liegt auch beim anderen höher. <b>Diskordant</b> (gegenläufig): umgekehrt. Dazu kommen Paare, die bei einem Merkmal gleichauf liegen. Beide Maße reichen von −1 bis +1, gehen aber nicht gleich mit allen Paaren um.',
          denken: [
            'Lies die Vorlage: <code>goodman_gamma()</code> rechnet Gamma, <code>kendall_tau()</code> Tau-b, beide mit denselben zwei Variablen und gewichtet.',
            'In der Ausgabe kommt zuerst Gamma als einzelne Zahl hinter <code>[1]</code>, darunter der Block „Kendall\'s Tau“ mit der Zeile <code>tau = …</code>.',
            'Achte bei beiden Zahlen auf das Vorzeichen.',
            'Schau im Bild in die beiden Nenner: Welche Paare zählen bei Gamma mit, welche bei Tau-b?',
          ],
          bild: 'GammaTau', bildtext: 'Am Beispiel von fünf Befragten: 6 konkordante und 2 diskordante Paare, dazu je ein Paar gleichauf bei der Schicht und bei der Gesundheit.',
          verwechslung: '„Konkordant“ heißt nicht „gleiche Werte“. Ein Paar ist konkordant, wenn eine Person bei beiden Merkmalen höher liegt.' }),
          warum('Die Ausgabe lesen', 'R schreibt Kommazahlen mit Punkt: <code>-0.241</code> heißt −0,241. Den ⟪p-Wert⟫ und die Sternchen für ⟪Signifikanz|signifikanzniveau⟫ lässt du heute links liegen.', 'r2')] },
      { id: 'a3-3', art: 'lesen', titel: 'Deuten',
        text: 'Sag in einem Satz, was das Vorzeichen bedeutet, und ordne die Stärke mit Tau-b ein. Das Bild in Schritt 3 hilft beim Vorzeichen, die Fragen im nächsten Schritt führen dich hin.',
        mehr: [denk('Betrag und Vorzeichen', { grund: 'k3-richtung',
          kurz: 'Der <b>Betrag</b> sagt, wie stark ein Zusammenhang ist; das <b>Vorzeichen</b> sagt, in welche Richtung. Positiv: Höhere Codes gehen mit höheren Codes einher. Negativ: Höhere Codes gehen mit niedrigeren einher. Was „höher“ inhaltlich heißt, steht in den Codes.',
          denken: [
            'Nimm das Vorzeichen deiner Ergebnisse aus Schritt 3.',
            'Schau ins Bild in Schritt 3: Gehen bei diesem Vorzeichen beide Pfeile zusammen nach oben, oder geht der eine hoch und der andere runter?',
            'Übersetz in Worte: Was heißt ein höherer Code bei <code>ep01</code>, was bei <code>zufriedenheit</code>? Sag es als „Je …, desto …“.',
            'Für die Stärke nimmst du den Betrag von Tau-b, ohne Vorzeichen, und legst ihn auf die ⟪Faustregel nach Cohen⟫: ab 0,1 schwach, ab 0,3 mittel, ab 0,5 stark.',
          ],
          bild: 'Richtung', bildtext: 'Ein Beispiel außerhalb der Aufgabe: Schicht und Gesundheit. Schalte die Kodierung der Gesundheit um. Der Zusammenhang bleibt, nur das Vorzeichen dreht sich.',
          verwechslung: '„Negativ heißt schwach.“ Nein: −0,42 ist ein stärkerer Zusammenhang als +0,30. Für die Stärke zählt der Betrag.' })] },
      { id: 'a3-4', art: 'fragen', titel: 'Ergebnis festhalten', fragen: Q('a3'),
        mehr: [denk('Wo lese ich das ab?', { grund: 'k3-formel',
          kurz: 'Schritt 5 fragt nach zwei Zahlen, nach der Richtung, nach der Stärke und danach, warum Gamma dem Betrag nach größer ist. Die Zahlen stehen in der Ausgabe von Schritt 3.',
          denken: [
            '<b>Gamma:</b> die erste Zahl der Ausgabe, hinter <code>[1]</code>, mit Vorzeichen und drei Nachkommastellen.',
            '<b>Tau-b:</b> im Block „Kendall\'s Tau“ die Zahl hinter <code>tau =</code>.',
            '<b>Richtung und Stärke:</b> Das Vorzeichen übersetzt du mit dem Bild aus Schritt 3 in Worte, die Stärke liest du am Betrag von Tau-b ab.',
            '<b>Warum Gamma größer:</b> Vergleich, was Gamma und Tau-b im Nenner zählen.',
          ],
          verwechslung: 'Ohne <code>weights = wghtpew</code> kommen leicht andere Zahlen heraus. Prüf, ob das Gewicht in der Klammer steht.' })] },
      { id: 'a3-5', art: 'ansehen', titel: 'Einordnen: dieselben Daten, fünf Maße', baustein: 'FuenfMasse',
        text: 'Für Zufriedenheit und Wirtschaftslage kann man auch die anderen Maße der Sitzung rechnen. Heraus kommen fünf verschiedene Zahlen, weil die Maße Verschiedenes messen. Vergleiche Zusammenhänge darum nur mit demselben Maß; V hat zudem kein Vorzeichen.',
        mehr: [denk('Warum fünf verschiedene Zahlen?', { grund: 'k5-vergleich',
          kurz: 'Für dieselben zwei Variablen liefern verschiedene Maße verschiedene Zahlen, weil sie Verschiedenes messen. Vergleiche Zusammenhänge darum nur mit demselben Maß; V hat zudem kein Vorzeichen.',
          denken: [
            'Such im Bild deine beiden Werte aus Schritt 3 wieder.',
            'Frag dich bei jedem Maß: Was zählt es? Paare mit oder ohne ⟪Bindungen|bindung⟫, den Abstand von „kein Zusammenhang“, einen linearen Zusammenhang oder Ränge?',
            'Schau, welche Maße ein Vorzeichen haben und welches nicht.',
          ],
          verwechslung: '„Der eine Zusammenhang hat ein größeres Gamma als der andere ein V, also ist er stärker.“ Gamma und V sind verschiedene Maßstäbe; so lässt sich das nicht vergleichen.' }),
          warum('Welches Maß passt wann?', 'Das niedrigere ⟪Skalenniveau⟫ der beiden Variablen entscheidet. Ein Maß für ein höheres Niveau darfst du nicht nehmen; eins für ein niedrigeres geht, verschenkt aber Information.', 'k5-baum')] },
    ],
    plenum: 'Für dieselben Daten gibt es zwei Zahlen, Gamma und Tau-b. Welche schreibt ihr in einen Bericht, und was muss dazu?',
    probier: { idee: 'Hängt die Zufriedenheit genauso stark mit der eigenen wirtschaftlichen Lage zusammen (ep03)?', code: T.frei_a3.code },
    ohneGrafik: 'Das Bild in Schritt 3 hat eine Textfassung. Gamma steht hinter <code>[1]</code>, Tau-b in der Zeile <code>tau = …</code> der Ausgabe von Schritt 3.' },

  { id: 'a4', n: 4, titel: 'Lebenszufriedenheit und Demokratie', pflicht: false, grund: 'g4',
    frage: 'Sind Menschen, die mit ihrem Leben zufriedener sind, auch zufriedener mit der Demokratie, und gilt das in West und Ost?',
    ziel: 'du kannst Pearson-r und Spearman-ρ rechnen und einordnen und prüfen, ob der Zusammenhang in beiden Landesteilen gleich stark ist.',
    info: 'Die Lebenszufriedenheit (<code>ls01</code>) reicht von 0 (ganz unzufrieden) bis 10 (ganz zufrieden): elf Ausprägungen, die man wie Zahlen mit gleichen Abständen behandeln darf (quasi-metrisch). Die Zufriedenheit mit der Demokratie hat sechs Ausprägungen; umgepolt (höher = zufriedener) behandelst du sie hier ebenfalls als quasi-metrisch und vergleichst zur Sicherheit mit Spearman-ρ.',
    schritte: [
      { id: 'a4-p', art: 'festlegen', titel: 'Erst festlegen', vorhersage: vor('a4'),
        mehr: [denk('Wie lege ich mich fest?', { grund: 'k4-pearson',
          kurz: 'Du schätzt, wie stark Lebenszufriedenheit und Zufriedenheit mit der Demokratie zusammenhängen. Es zählt nicht, ob du richtig liegst: Deine Festlegung ist der Vergleichspunkt. Die Antworten stammen aus der ⟪Faustregel nach Cohen⟫: ab 0,1 schwach, ab 0,3 mittel, ab 0,5 stark.',
          denken: [
            'Stell dir Menschen vor, die mit ihrem Leben sehr zufrieden sind: Sind sie wohl auch mit der Demokratie zufriedener?',
            'Und Menschen, die mit ihrem Leben unzufrieden sind: Hängt ihr Urteil über die Demokratie eng daran oder kaum?',
            'Wähl eine Antwort. Ob sie stimmt, siehst du, wenn in Schritt 5 alle Fragen richtig sind.',
          ],
          verwechslung: 'Ein großer Zusammenhang ist nicht automatisch ein wichtiger, und ein kleiner nicht automatisch unwichtig.' })] },
      { id: 'a4-1', art: 'code', titel: 'Umpolen und Streudiagramm', wk: ['a4a'], bekannt: 'ggplot() aus Sitzung 4',
        text: 'Pole um (wie in Aufgabe 3) und sieh dir das ⟪Streudiagramm⟫ an, eine Wolke aus Punkten. <code>geom_jitter()</code> streut die Punkte leicht, weil sie sonst bei so wenigen Ausprägungen übereinanderliegen; <code>alpha = 0.2</code> macht sie durchscheinend, damit dichte Stellen dunkler wirken. Die Grafik, die R zeichnet, zeigt alle Befragten ohne Gewicht; für einen ersten Blick reicht das.',
        mehr: [denk('Warum erst das Streudiagramm?', { grund: 'k4-punktwolke',
          kurz: 'Pearson-r misst nur ⟪lineare|linear⟫ Zusammenhänge, bei denen die Punkte grob einer Geraden folgen. Ob sie das tun, einer Kurve folgen (⟪nichtlinear⟫) oder ob einzelne ⟪Ausreißer⟫ weit draußen liegen, siehst du nur im Bild. Darum schaust du zuerst das Streudiagramm an: Kurz gesagt ist jede Person ein Punkt mit ihren zwei Werten.',
          denken: [
            'Lies die Vorlage: Oben wird umgepolt wie in Aufgabe 3, <code>drop_na()</code> lässt alle weg, denen bei einer der beiden Variablen die Angabe fehlt.',
            '<code>aes(x = ls01, y = zufriedenheit)</code>: Lebenszufriedenheit nach rechts, Zufriedenheit mit der Demokratie nach oben.',
            'Schau, wo die Punkte dicht liegen: Steigt die Wolke nach rechts an, fällt sie ab oder liegt sie flach?',
            'Such nach Punkten weit draußen und nach einem nichtlinearen Verlauf, etwa erst steigend, dann fallend.',
          ],
          verwechslung: 'Die Punkte liegen nicht wirklich nebeneinander: <code>geom_jitter()</code> streut sie nur leicht, damit sie bei so wenigen Ausprägungen nicht übereinanderliegen.',
          zusatz: 'Die Grafik zeigt alle Befragten ohne Gewicht; für einen ersten Blick reicht das.' }),
          warum('Textfassung des Streudiagramms', esc(D.ALT.punktwolke))] },
      { id: 'a4-2', art: 'code', titel: 'Pearson-r und Spearman-ρ', wk: ['a4b'], neu: true,
        text: 'Rechne ⟪Pearson-r⟫ (gewichtet) und ⟪Spearman-ρ⟫. Die Vorlage polt oben wieder um, damit sie für sich allein läuft. Lies die Zahlen hinter <code>r =</code> und <code>rho =</code>.',
        mehr: [denk('Was misst r?', { grund: 'k4-pearson',
          kurz: '<b>Pearson-r</b> misst, wie gut sich Punkte an eine steigende oder fallende Gerade halten, von −1 bis +1: die Stärke des linearen Zusammenhangs. <b>Spearman-ρ</b> macht dasselbe mit Rängen statt mit den Werten selbst und verträgt darum Ausreißer. <code>pearson_cor()</code> rechnet gewichtet, <code>spearman_rho()</code> immer ohne Gewicht.',
          denken: [
            'Lies die Vorlage: Welche Zeile rechnet r, welche ρ? Wo steht das Gewicht?',
            'Such in der Ausgabe die Zahlen hinter <code>r =</code> und <code>rho =</code>.',
            'Vergleich beide: Liegen sie nah beieinander oder weit auseinander? Was sagt das über Ausreißer?',
            'Achte auf das Vorzeichen und leg den Betrag auf die Faustregel.',
          ],
          bild: 'PunkteLabor', bildtext: 'Ein Beispiel mit acht Befragten: Alter und Minuten für einen Fragebogen. Verschieb Person B und sieh, was mit r und ρ passiert.',
          verwechslung: '„r = 0 heißt: kein Zusammenhang.“ r = 0 heißt nur: kein ⟪linearer|linear⟫. Mit Ausreißern oder bei einem ⟪nichtlinearen⟫ Verlauf kann trotzdem einer da sein.' }),
          warum('Warum ohne Gewicht bei ρ?', '<code>spearman_rho()</code> rechnet immer ohne Gewicht. Für Aussagen über Deutschland ist das eine kleine Einschränkung, die du im Bericht nennst.', 'k4-ausreisser')] },
      { id: 'a4-3', art: 'code', titel: 'Drittvariable Landesteil prüfen', wk: ['a4c'],
        text: 'Prüf den Landesteil als ⟪Drittvariable⟫: Rechne r einmal nur im Westen und einmal nur im Osten. Hol die Vorlage ins Journal und führ sie aus: Sie rechnet den Westen (1). Dann tausch <b>im Journal</b> die markierte 1 gegen 2 und führ den Block noch einmal aus: der Osten.',
        mehr: [denk('Wie prüft man eine Drittvariable?', { grund: 'k4-dritt',
          kurz: 'Eine <b>Drittvariable</b> kann zwei Merkmale zugleich beeinflussen, als gemeinsame Ursache (⟪Confounding⟫). Prüfen kannst du das, indem du denselben Zusammenhang innerhalb jeder ⟪Kategorie|auspraegung⟫ der Drittvariable rechnest und mit dem Wert für alle vergleichst. Bleibt er, erklärt sie ihn nicht; schrumpft er, erklärt sie einen Teil.',
          denken: [
            'Führ die Vorlage aus: <code>filter(eastwest == 1)</code> behält den Westen. Lies r.',
            'Tausch im Journal die markierte 1 gegen 2 und führ den Block noch einmal aus: der Osten.',
            'Leg die beiden Werte neben den Wert für alle aus Schritt 3.',
            'Frag dich: Bleibt der Zusammenhang etwa gleich, schrumpft er, verschwindet er oder kehrt er sich um?',
          ],
          bild: 'Drittvariable', bildtext: 'Ein anderes Beispiel: Internetnutzung und Gesundheit, getrennt nach Alter.',
          verwechslung: '„Wenn der Zusammenhang schrumpft, war er falsch.“ Er war richtig gemessen; er sagt nur etwas anderes, als man zuerst dachte.' })] },
      { id: 'a4-4', art: 'fragen', titel: 'Ergebnis festhalten', fragen: Q('a4'),
        mehr: [denk('Wo lese ich das ab?', { grund: 'k4-dritt',
          kurz: 'Schritt 5 fragt nach r und ρ, nach der Stärke, nach r in West und Ost, nach der Rolle des Landesteils und nach einem Satz für einen Bericht.',
          denken: [
            '<b>r und ρ:</b> Schritt 3, die Zahlen hinter <code>r =</code> und <code>rho =</code>, mit drei Nachkommastellen.',
            '<b>Stärke:</b> den Betrag auf die Faustregel legen.',
            '<b>West und Ost:</b> Schritt 4, einmal mit 1 und einmal mit 2; dann mit dem Wert für alle vergleichen.',
            '<b>Der Satz:</b> Prüf jede Option an dem, was laut Überblick in jeden Bericht gehört.',
          ],
          verwechslung: 'Den Wert für alle aus Schritt 3 als Wert für den Westen eintragen. West und Ost kommen aus Schritt 4.' })] },
    ],
    probier: { idee: 'Hängt die Links-rechts-Einstufung mit der Zufriedenheit zusammen?', code: T.frei_a4.code },
    ohneGrafik: 'Das Streudiagramm ist nur zum Ansehen und hat eine Textfassung. Alle Antworten kommen aus Schritt 3 und 4: <code>r = …</code> und <code>rho = …</code> aus <code>pearson_cor()</code> und <code>spearman_rho()</code>.' },
];

/* ---------- Weiter, wenn du magst ---------- */
const FREI = {
  a1: [
    { stufe: 'Abwandeln', text: 'Ändert die Gewichtung auch ⟪Mittelwert⟫ und ⟪Median⟫ der Zufriedenheit?', tipp: '<code>allbus %&gt;% describe(ps03)</code>, einmal ohne und einmal mit <code>weights = wghtpew</code>. Vergleiche Mean und Median.' },
    { stufe: 'Erweitern', text: 'Wie viele gehören keiner Religionsgemeinschaft an, ohne und mit Gewicht?', tipp: 'Die Konfession steht in <code>rd01</code>; Code 6 heißt „keine“. Zähl sie wie in Schritt 2 einmal ohne, einmal mit Gewicht aus. Im Mischpult in „Verstehen“ siehst du, warum sich die Zahl hier stark ändert.' },
    { stufe: 'Eigene Frage', text: 'Such eine Frage, bei der sich West und Ost unterscheiden könnten, und vergleiche ohne und mit Gewicht.', tipp: 'Tipp im Journal ein paar Buchstaben und drück <kbd>Tab</kbd>: Die Vorschläge zeigen Variablen mit ihrer Frage. Je größer der Unterschied zwischen West und Ost, desto mehr ändert das Gewicht.' },
  ],
  a2: [
    { stufe: 'Abwandeln', text: 'Wie unterscheiden sich West und Ost in der Zufriedenheit, und was sagt Phi dazu?', tipp: '<code>crosstab(eastwest, zufrieden, percentages = "row", weights = wghtpew)</code> und <code>phi(eastwest, zufrieden, weights = wghtpew)</code>. Bei einer Vierfeldertafel zeigt <code>phi()</code> ein Vorzeichen; für die Stärke zählt der Betrag.' },
    { stufe: 'Erweitern', text: 'Was ändert sich an V, wenn du die Zufriedenheit mit allen sechs Ausprägungen nimmst statt in zwei Kategorien?', tipp: '<code>cramers_v(pv01, ps03, weights = wghtpew)</code>, ganz ohne <code>mutate()</code>. Vergleiche mit V aus Schritt 4.' },
    { stufe: 'Eigene Frage', text: 'Hängt die Zufriedenheit mit der Konfession zusammen?', tipp: 'Die Konfession steht in <code>rd01</code> und hat keine Reihenfolge. Die zwei Kategorien der Zufriedenheit bildest du wie in Schritt 3.' },
  ],
  a3: [
    { stufe: 'Abwandeln', text: 'Hängt die Zufriedenheit genauso stark mit der eigenen wirtschaftlichen Lage zusammen?', tipp: '<code>ep03</code> hat dieselben Codes wie <code>ep01</code>. Tausch in <code>kendall_tau()</code> die Variable aus.' },
    { stufe: 'Erweitern', text: 'Zeig den Zusammenhang als Tabelle: Wie viele sind je Einschätzung der Wirtschaftslage zufrieden?', tipp: 'Bilde <code>zufrieden</code> wie in Aufgabe 2 und nimm <code>crosstab(ep01, zufrieden, percentages = "row", weights = wghtpew)</code>.' },
    { stufe: 'Eigene Frage', text: 'Hängen Schicht und Gesundheit zusammen?', tipp: 'Die Vorlage in „Vorweg: R lesen“ rechnet Tau-b für <code>hs01</code> und <code>id02</code>. Denk ans Vorzeichen: Bei <code>hs01</code> heißt 1 „sehr gut“.' },
  ],
  a4: [
    { stufe: 'Abwandeln', text: 'Hängt die Links-rechts-Einstufung (pa01: 1 = links, 10 = rechts) mit der Zufriedenheit zusammen?', tipp: '<code>pearson_cor(zufriedenheit, pa01, weights = wghtpew)</code>. Für West oder Ost setzt du <code>filter(eastwest == 1) %&gt;%</code> davor, wie in Schritt 4.' },
    { stufe: 'Erweitern', text: 'Brauchen ältere Befragte länger für den Fragebogen? Vergleiche r und ρ mit allen ⟪Fällen|fall⟫ und nur bis 180 Minuten.', tipp: '<code>pearson_cor(age, xt10, weights = wghtpew)</code> und <code>spearman_rho(age, xt10)</code>, dann dasselbe mit <code>filter(xt10 &lt;= 180)</code> davor. Was machen die Ausreißer mit r?' },
    { stufe: 'Eigene Frage', text: 'Prüf den Zusammenhang aus dieser Aufgabe mit einer anderen Drittvariable.', tipp: 'Rechne r innerhalb jeder Kategorie der Drittvariable, wie in Schritt 4 mit <code>filter()</code>, und vergleiche mit dem Wert für alle. Halte im Journal fest, was du gefunden hast.' },
  ],
};

/* ---------- Eigene Schrittarten dieses Kapitels ---------- */

/** Eine einzelne Auswahlfrage mitten in der Aufgabe (Skalenniveau in Aufgabe 2). Die Antwort wird unter ihrer ID gespeichert. */
function frage1(s, H) {
  const q = s.frage; const f = document.createElement('form'); f.noValidate = true; f.className = 'fragen';
  const a = H.S.antwort[q.id] ?? '';
  f.innerHTML = `<div class="frage" data-q="${q.id}"><fieldset><legend>${H.codeHtml(q.label)}</legend><div class="radios">${q.options.map(o => `<label><input type="radio" name="${q.id}" value="${esc(o.value)}" ${a === o.value ? 'checked' : ''}> ${esc(o.label)}</label>`).join('')}</div></fieldset><p class="r" aria-live="polite"></p></div><div><button type="submit" class="knopf">Prüfen</button></div>`;
  const zeigen = () => {
    const v = H.S.antwort[q.id]; const box = $('.frage', f); if (!v) return;
    const J = window.LernpfadPruefen; let ok, text;
    if (J) { const j = J(q, v); ok = j.result === 'right'; text = j.text; } else { ok = v === q.target; text = ok ? q.right : q.hint; }
    box.className = 'frage ' + (ok ? 'ok' : 'no');
    $('.r', box).innerHTML = (ok ? 'Richtig: ' : 'Noch nicht. ') + H.codeHtml(text || '');
    if (ok) H.fertig(s.id);
  };
  f.onsubmit = ev => {
    ev.preventDefault(); const v = $('input:checked', f)?.value;
    if (!v) { $('.r', f).textContent = 'Wähl zuerst eine Antwort.'; return; }
    H.S.antwort[q.id] = v; H.sichern(); zeigen();
  };
  if (a) { if (document.readyState === 'complete') setTimeout(zeigen); else addEventListener('load', zeigen); }
  return f;
}

/** Ein Bild zum Ansehen nach „Ergebnis festhalten“: Haken „Angesehen“ unter dem Baustein. */
function ansehen(s, H) {
  const lab = document.createElement('label'); lab.className = 'erledigt';
  lab.innerHTML = `<input type="checkbox" ${H.S.fertig[s.id] ? 'checked' : ''}> Angesehen`;
  $('input', lab).onchange = e => H.fertig(s.id, e.target.checked);
  return lab;
}

return { BILD, TASKS, FREI, typen: { frage: frage1, ansehen } };
};
