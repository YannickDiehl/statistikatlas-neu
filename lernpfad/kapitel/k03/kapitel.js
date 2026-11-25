/* Kapitel 3 „Erste Auszählung“: Aufgaben und Zusatzinfos für die Lernpfad-Engine.
   Wird nach daten.js geladen; die Engine ruft window.KAPITEL(hilfen) einmal auf.
   Die Antwortprüfung mit Hinweisen je typischer falscher Zahl (special) und je Option (wrongBy) kommt aus
   bausteine.tsx (PRUEFEN, nutzt hintFor aus src/chapter/s03/content.ts). */
'use strict';
window.KAPITEL = ({ D, T, esc, bild, warum, probier }) => {

/* ---------- Texte aus content.ts an den Fokus-Aufbau anpassen ----------
   Die Seite zählt „Erst festlegen“ als Schritt 1; im Atlas hieß dieselbe Vorlage einen Schritt früher.
   Verweise auf „Grundlage …“ zeigen jetzt auf den Reiter „Verstehen“, die Werkstatt heißt hier Journal.
   Nur Texte werden getauscht, keine IDs, keine Zielwerte, kein Code. */
const tausche = (ziel, paare) => {
  const neu = s => paare.reduce((t, [a, b]) => t.split(a).join(b), s);
  const geh = o => {
    if (!o || typeof o !== 'object') return;
    for (const k of Object.keys(o)) { if (typeof o[k] === 'string') o[k] = neu(o[k]); else geh(o[k]); }
  };
  geh(ziel);
};
const VERSTEHEN = n => `„Verstehen zu Aufgabe ${n}“`;
tausche([D.QUESTIONS.a1, D.HINTS.a1], [['Vorlage aus Schritt 4', 'Vorlage aus Schritt 5']]);
tausche([D.QUESTIONS.a2, D.HINTS.a2], [['Vorlage aus Schritt 3', 'Vorlage aus Schritt 4']]);
tausche([D.QUESTIONS.a3, D.HINTS.a3], [
  ['(Grundlage 2)', `(${VERSTEHEN(2)})`],
  ['(Grundlage 3b)', `(${VERSTEHEN(3)})`],
  ['steht in Grundlage 2a', `steht in ${VERSTEHEN(2)}`],
  ['Für Aufgabe 1 zurück: Grundlage 3b.', `Für den Blick zurück auf Aufgabe 1: ${VERSTEHEN(3)}, Karte „Welche Mitte passt zu welcher Variable?“.`],
  ['in der Werkstatt als Text', 'im Journal als Text'],
]);
tausche([D.QUESTIONS.a4, D.HINTS.a4], [['Vorlage aus Schritt 2', 'Vorlage aus Schritt 3'], ['das Beispiel aus Grundlage 4', `das Beispiel aus ${VERSTEHEN(4)}`]]);
// Fehlerhilfe: Journal statt Werkstatt; das Komma-Beispiel nicht mit den Zahlen aus Aufgabe 1 (sonst steht die Lösung von a1e da).
tausche(D.ERROR_HELP, [
  ['Startblock in „R lesen“', 'Startblock (oben im Journal, erklärt in „R lesen“)'],
  [' (in RStudio und Werkstatt gleich)', ' (in RStudio und im Journal gleich)'],
  [' (in der Werkstatt: ', ' (im Journal: '],
  ['39.84 + 8.44', '29.70 + 18.27'], ['39,84 + 8,44', '29,70 + 18,27'],
]);

/* ---------- Festlegen: dieselben Vorhersagen (IDs a1 … a4), mit Auflösung nach den Fragen ---------- */
const festlegen = (id, aufloesung) => ({ id: id + '-p', art: 'festlegen', titel: 'Erst festlegen', pred: id, vorhersage: { ...D.PREDICTIONS[id], aufloesung } });
const RECHNER = 'R als Taschenrechner aus Sitzung 1';

/* ---------- Aufgaben ---------- */
const TASKS = [
  { id: 'a1', n: 1, titel: 'Wie geht es der Wirtschaft in einem Jahr?', pflicht: true, grund: 'g1',
    frage: 'Erwarten die Befragten, dass es der Wirtschaft in Deutschland in einem Jahr besser oder schlechter geht?',
    ziel: 'du kannst aus einer Häufigkeitstabelle ablesen, wie viele gültig geantwortet haben und wie viele Antworten fehlen, welche Erwartung am häufigsten ist (Modus) und wo die Mitte liegt (Median), und du hast einen Anteil mit R selbst zusammengezählt.',
    info: 'Der ALLBUS 2023 fragt, wie die wirtschaftliche Lage in Deutschland in einem Jahr sein wird, verglichen mit heute. Antworten von 1 „wesentlich besser“ bis 5 „wesentlich schlechter“. Die Variable heißt <code>ep04</code>.',
    infoMehr: [warum('Ungewichtet', 'Alle Zahlen in diesem Kapitel sind ungewichtet, genau wie die Ausgabe deiner Vorlagen. Gewichtet ändern sie sich etwas; das ist Thema in Sitzung 6.')],
    schritte: [
      festlegen('a1', 'Mehr erwarten eine schlechtere Lage: 48,28 % der gültigen Antworten gegenüber 16,33 %, die eine bessere erwarten.'),
      { id: 'a1-1', art: 'code', titel: 'Vorlage ausführen', wk: ['a1'], bekannt: 'frequency() aus Sitzung 1',
        text: 'Die Vorlage zählt aus, wie oft jede Erwartung vorkommt.',
        mehr: [warum('Lieber in RStudio?', 'Dann führst du dort vorher den Startblock aus (Pakete laden, ALLBUS einlesen). Danach kopierst du die Vorlage mit <b>Kopieren</b> in dein Skript.<pre>' + esc(T.start.code) + '</pre>', 'r1'),
          warum('Was zählt frequency()?', 'Gleiche Antworten kommen auf einen Stapel. Die Höhe jedes Stapels steht in der Spalte <b>N</b>. Die Spalte <b>Value</b> ist der Code, nicht die Anzahl.', 'k1-turm')] },
      { id: 'a1-2', art: 'lesen', titel: 'Die Tabelle von unten lesen',
        text: 'Wie viele haben gültig geantwortet (<b>Total valid</b>), wie viele Antworten fehlen (<b>Total missing</b>), und aus welchen Gründen?',
        mehr: [warum('Was steht unter der Linie?', '<b>Total valid</b> zählt alle gültigen Antworten 1 bis 5 zusammen. Unter der Linie stehen die fehlenden Antworten, jede mit Code und Grund; <b>Total missing</b> zählt sie zusammen.', 'k1-spalten')] },
      { id: 'a1-3', art: 'lesen', titel: 'Modus und Median suchen',
        text: 'Such den Modus (die Zeile mit dem größten N) und den Median (die erste Zeile, in der Cum. % die 50 erreicht).',
        mehr: [warum('Modus oder Median?', 'Der <b>Modus</b> ist die häufigste Antwort. Der <b>Median</b> ist die Antwort der Person in der Mitte, wenn alle gültigen Antworten der Reihe nach stehen. Der höchste Stapel muss nicht in der Mitte stehen.', 'k1-mitte')] },
      { id: 'a1-4', art: 'code', titel: 'Zwei Zeilen zusammenzählen', wk: ['a1r'], bekannt: RECHNER,
        text: 'Wie viele erwarten eine schlechtere Lage? Dafür zählst du zwei Zeilen zusammen. Die Vorlage zeigt, wie das geht: Sie zählt die Valid % der beiden „besser“-Zeilen zusammen und kommt auf 16.33, genau die Zahl in Cum. % bei ETWAS BESSER. Tausch im Journal die beiden markierten Zahlen gegen die Valid % von ETWAS SCHLECHTER und WESENTL. SCHLECHTER.',
        mehr: [warum('Komma oder Punkt?', 'Kommazahlen schreibst du in R mit Punkt, etwa <code>15.67</code>. Mit Komma meldet R einen Fehler.', 'r2'),
          warum('Warum Valid %?', 'Gefragt ist der Anteil der gültigen Antworten. Raw % teilt durch alle 5.246 Befragten, auch durch die ohne gültige Antwort.', 'k1-rechnen')] },
      { id: 'a1-5', art: 'lesen', titel: 'Deuten: Welcher Satz passt?',
        text: 'Welcher Satz beschreibt die Tabelle richtig? Die Sätze stehen im nächsten Schritt. Achte darauf, was „die meisten“ heißt und wo die Mitte liegt.',
        mehr: [warum('Worauf achten?', '„Die meisten“ heißt mehr als die Hälfte. „Im Mittel“ meint die Mitte, und die Mitte einer geordneten Reihe ist der Median, nicht die häufigste Antwort.', 'k1-ergebnis')] },
      { id: 'a1-6', art: 'fragen', titel: 'Ergebnis festhalten', fragen: 'a1' },
    ],
    plenum: 'Erwarten die Befragten für ihre eigene wirtschaftliche Lage etwas anderes als für Deutschland? Schau mit ep06 nach (unter „Weiter, wenn du magst“) und bring eine Vermutung mit, woran ein Unterschied liegen könnte.',
    probier: { idee: 'Sehen die Befragten ihre eigene wirtschaftliche Lage in einem Jahr ähnlich?', code: T.frei_a1.code },
    ohneGrafik: 'Diese Aufgabe hat keine Grafik. Alle Zahlen stehen in der Ausgabe von <code>allbus %&gt;% frequency(ep04)</code>.' },

  { id: 'a2', n: 2, titel: 'Wahlabsicht: drei Prozentzahlen für dieselbe Partei', pflicht: true, grund: 'g2',
    frage: 'Wie groß ist die Union, und wie groß sind die Unentschlossenen, je nachdem, wen du mitzählst?',
    ziel: 'du kannst für eine Partei drei Prozentzahlen nennen, jede mit ihrer Basis, und begründen, welche Zahl zu welchem Satz passt.',
    info: 'Der ALLBUS fragt, welche Partei man wählen würde, wenn am nächsten Sonntag Bundestagswahl wäre. Die Variable heißt <code>pv01</code>. Hier fehlt fast ein Viertel der Antworten, aus fünf verschiedenen Gründen.',
    schritte: [
      festlegen('a2', '„Weiß nicht“ sagen 603 Befragte, das sind 11,49 % aller Befragten: zwischen 5 und 15 %.'),
      { id: 'a2-1', art: 'code', titel: 'Vorlage ausführen und nach unten schauen', wk: ['a2'], bekannt: 'frequency() aus Sitzung 1',
        text: 'Die Vorlage zählt die Wahlabsicht aus. Schau zuerst nach unten: Welche Gründe für eine fehlende Antwort gibt es, und welcher ist am häufigsten?',
        mehr: [warum('Was heißen die Codes?', 'Jede Lücke hat einen Code mit Grund, etwa −9 KEINE ANGABE, −8 WEISS NICHT oder −7 VERWEIGERT. −50 heißt bei der Wahlabsicht NICHT WAHLBERECHTIGT. Wie viele es je Grund sind, steht in der Spalte N.', 'k2-gruende')] },
      { id: 'a2-2', art: 'lesen', titel: 'Zwei Prozentzahlen für CDU/CSU',
        text: 'Such die Zeile CDU-CSU. Lies zwei Prozentzahlen ab: Raw % (von allen Befragten) und Valid % (von den gültigen Antworten).',
        mehr: [warum('Raw % oder Valid %?', 'Raw % teilt durch alle 5.246 Befragten, Valid % nur durch die gültigen Antworten. Niemand hat seine Antwort geändert, nur die Basis ist eine andere.', 'k2-basis')] },
      { id: 'a2-3', art: 'code', titel: 'Eine eigene Basis rechnen', wk: ['a2r'], bekannt: RECHNER, baustein: 'DreiBasen',
        text: 'Eine dritte Basis rechnest du selbst: Die Unentschlossenen („weiß nicht“) sollen mitzählen, weil auch sie eine Aussage machen. Die Basis ist dann 3.984 gültige plus 603 „weiß nicht“. Die Vorlage rechnet so für CDU/CSU. Tausch im Journal die markierte Zahl gegen die Zahl der „weiß nicht“-Antworten: Wie groß sind die Unentschlossenen auf dieser Basis?',
        mehr: [warum('Wozu die Klammer?', 'Die Klammer sorgt dafür, dass R erst die Basis zusammenzählt und dann teilt.', 'k2-eigen')] },
      { id: 'a2-4', art: 'lesen', titel: 'Deuten: der Zeitungssatz',
        text: 'Eine Zeitung schreibt: „Ein Viertel der Befragten würde die Union wählen.“ Passt das? Die Antwortmöglichkeiten stehen im nächsten Schritt.',
        mehr: [warum('Worauf achten?', 'Prozentzahlen mit verschiedenen Basen können alle richtig gerechnet sein. Achte darauf, für wen der Satz die Zahl behauptet.', 'k2-satz')] },
      { id: 'a2-5', art: 'fragen', titel: 'Ergebnis festhalten', fragen: 'a2',
        mehr: [warum('Und gewichtet?', 'Alle Zahlen hier sind ungewichtet. Mit Gewichtung kommt die CDU/CSU auf 25,81 % der gültigen Antworten; warum, zeigt Sitzung 6.')] },
    ],
    plenum: 'Sollen die 603 Unentschlossenen in einer Wahlumfrage mitzählen? Und die 186 Nicht-Wahlberechtigten? Bringt je einen Satz mit, für wen eure Zahl gilt.',
    probier: { idee: 'Bei welcher Frage sagen besonders viele „weiß nicht“?', code: T.frei_a2.code },
    ohneGrafik: 'Das Bild in Schritt 4 zeigt nur die drei Basen. Alle Zahlen stehen in <code>allbus %&gt;% frequency(pv01)</code> und in der Ausgabe der Vorlage.' },

  { id: 'a3', n: 3, titel: 'Wie lange dauert Arbeitslosigkeit?', pflicht: true, grund: 'g3',
    frage: 'Wie lange waren Menschen ohne Arbeit, und welche Zahl beschreibt das ehrlich?',
    ziel: 'du kannst mit <code>describe()</code> Mittelwert, Median und N ablesen, sagen, wer in diesen Zahlen fehlt, und begründen, welche Zahl die typische Dauer besser beschreibt.',
    info: 'Der ALLBUS fragt alle, die in Voll- oder Teilzeit berufstätig sind, ob sie in den letzten zehn Jahren arbeitslos waren. Wer ja sagt, wird gefragt, wie lange. Die Antwort steht in Wochen in der Variable <code>dw19</code>.',
    schritte: [
      festlegen('a3', 'Der Mittelwert (54,7 Wochen) liegt deutlich über dem Median (26 Wochen), er ist gut doppelt so groß.'),
      { id: 'a3-1', art: 'code', titel: 'Kennzahlen ablesen', wk: ['a3'], neu: true,
        text: 'Die Vorlage fasst die Dauer in Kennzahlen zusammen. Lies Mean, Median, N und Missing ab.',
        mehr: [warum('Wie schreibt R die Zahlen?', 'R schreibt drei Nachkommastellen mit Punkt: 2.000 heißt 2. N und Missing sind ganze Zahlen.', 'k3-describe')] },
      { id: 'a3-2', art: 'code', titel: 'Wer fehlt?', wk: ['a3f'], bekannt: 'frequency() aus Sitzung 1',
        text: 'Bei 4.732 Befragten fehlt die Dauer. Warum? <code>describe()</code> sagt es nicht. Die Häufigkeitstabelle derselben Variable zeigt es ganz unten. Sie ist lang, weil jede Wochenzahl eine eigene Zeile hat.',
        mehr: [warum('Wo stehen die Gründe?', 'Unter der Linie, nach den gültigen Wochenzahlen: jeder Code mit seinem Grund und der Zahl in N. Was die Codes heißen, steht in „Verstehen zu Aufgabe 2“.', 'k3-wer'),
          probier('Wie lauten die beiden Fragen?', '<code>codebook()</code> zeigt erst die Frage, ob jemand in den letzten zehn Jahren arbeitslos war (dw18), dann die Frage, wie lange (dw19).', 'codebook(allbus, dw18, dw19)', 'a3')] },
      { id: 'a3-3', art: 'lesen', titel: 'Mittelwert und Median vergleichen',
        text: 'Vergleiche Mittelwert und Median. Was zieht den Mittelwert so weit nach oben? Ein Blick ans Ende der gültigen Zeilen in der Tabelle aus Schritt 3 hilft: Die längsten Zeiten reichen bis 520 Wochen, das sind zehn Jahre.',
        mehr: [warum('Was zieht den Mittelwert?', 'Der Mittelwert zählt jeden Wert zusammen, auch die wenigen sehr großen. Der Median schaut nur auf die Person in der Mitte.', 'k3-schief')] },
      { id: 'a3-4', art: 'lesen', titel: 'Deuten: ein Satz für den Bericht',
        text: 'Welcher Satz gehört in einen Bericht? Und zum Schluss ein Blick zurück auf Aufgabe 1: Was machst du mit dem Mittelwert in der Kopfzeile von <code>frequency(ep04)</code>? Die Antwortmöglichkeiten stehen im nächsten Schritt.',
        mehr: [warum('Welche Mitte passt?', 'Das sagt das Skalenniveau: Haben die Codes eine Reihenfolge, und sind die Abstände zwischen ihnen gleich groß?', 'k3-skala')] },
      { id: 'a3-5', art: 'fragen', titel: 'Ergebnis festhalten', fragen: 'a3' },
    ],
    plenum: 'Eine Zeitung schreibt: „Arbeitslose bleiben im Schnitt über ein Jahr ohne Job.“ Was ist richtig daran, was fehlt? Denkt an den Median und daran, wer gefragt wurde: Wer gerade arbeitslos ist, steht nicht in dw19.',
    probier: { idee: 'Waren Frauen anders lange arbeitslos als Männer?', code: T.frei_a3.code },
    ohneGrafik: 'Diese Aufgabe hat keine Grafik. Alle Zahlen stehen in der Ausgabe der beiden Vorlagen.' },

  { id: 'a4', n: 4, titel: 'Wie viele liegen über dem Durchschnitt?', pflicht: false, grund: 'g4',
    frage: 'Wie viele waren länger arbeitslos als der Durchschnitt?',
    ziel: 'du kannst mit Cum. % und dem Taschenrechner ausrechnen, wie viel Prozent über dem Mittelwert liegen, und sagen, was das über die Verteilung verrät.',
    info: 'In Aufgabe 3 lag der Mittelwert der Arbeitslosigkeitsdauer bei 54,7 Wochen. Liegt die Hälfte darüber?',
    schritte: [
      festlegen('a4', 'Über dem Mittelwert liegen 24,71 %, das sind 127 der 514 Befragten: deutlich weniger als die Hälfte.'),
      { id: 'a4-1', art: 'code', titel: 'Cum. % der Wochen ablesen', wk: ['a4'],
        text: 'Die Vorlage zeigt die Häufigkeitstabelle der Wochen, dieselbe wie in Aufgabe 3. Geh in der Spalte Value nach unten bis zur letzten Wochenzahl unter dem Mittelwert 54,7. Welche Zahl steht dort in Cum. %?',
        mehr: [warum('Welche Zeile genau?', 'Die größte Wochenzahl unter 54,7, die in der Tabelle steht. Cum. % zählt von oben bis einschließlich dieser Zeile zusammen.', 'k4-zeile')] },
      { id: 'a4-2', art: 'code', titel: '100 minus Cum. % rechnen', wk: ['a4r'], bekannt: RECHNER,
        text: 'Rechne 100 minus diese Zahl. Die Vorlage rechnet das Beispiel aus „Verstehen zu Aufgabe 4“ (Personen im Haushalt). Tausch im Journal die markierte Zahl gegen deinen Wert aus Schritt 2.',
        mehr: [warum('Warum 100 minus?', 'Cum. % sagt, wie viel Prozent höchstens bis zu einem Wert kommen. Wer darüber liegt, ist der Rest bis 100.', 'k4-cum')] },
      { id: 'a4-3', art: 'fragen', titel: 'Ergebnis festhalten', fragen: 'a4' },
    ],
    probier: { idee: 'In welcher Stufe liegt der Median, wenn die Wochen in sechs Stufen zusammengefasst sind?', code: T.frei_a4.code },
    ohneGrafik: 'Diese Aufgabe hat keine Grafik. Alle Zahlen stehen in <code>allbus %&gt;% frequency(dw19)</code>.' },
];

/* ---------- Weiter, wenn du magst (aus den Probier-Werkstätten des Atlas) ---------- */
const FREI = {
  a1: [
    { stufe: 'Abwandeln', text: 'Sehen die Befragten ihre eigene wirtschaftliche Lage in einem Jahr ähnlich wie die Lage in Deutschland?', tipp: '<code>allbus %&gt;% frequency(ep06)</code> zählt die Erwartung für die eigene Lage aus. Vergleiche Modus, Median und die Valid % der beiden „schlechter“-Zeilen mit <code>ep04</code>.' },
    { stufe: 'Erweitern', text: 'Schreib zu deiner Tabelle für die eigene Lage einen Satz, der die Basis nennt.', tipp: '„… % der Befragten mit gültiger Antwort …“ heißt: Valid %. Zum Zusammenzählen zweier Zeilen nimmst du R als Taschenrechner wie in Schritt 5.' },
    { stufe: 'Eigene Frage', text: 'Such dir eine andere Frage mit geordneten Stufen und bestimme Modus und Median.', tipp: 'Tipp im Journal ein paar Buchstaben, dann <kbd>Tab</kbd>: Die Vorschläge zeigen Variablen mit ihrer Frage. Der Median ist die erste Zeile mit Cum. % ab 50.' },
  ],
  a2: [
    { stufe: 'Abwandeln', text: 'Bei welcher Frage sagen besonders viele „weiß nicht“? Probier die Sterbehilfe bei psychischer Krankheit (vm21) oder eine eigene Variable.', tipp: '<code>allbus %&gt;% frequency(vm21)</code>. Vergleiche in einer Zeile Raw % und Valid %: Je mehr fehlen, desto weiter liegen sie auseinander.' },
    { stufe: 'Erweitern', text: 'Rechne für eine andere Partei alle drei Prozentzahlen, zum Beispiel für die Grünen (752 Stimmen).', tipp: 'Raw % und Valid % stehen in der Tabelle. Die eigene Basis: <code>752 / (3984 + 603) * 100</code>.' },
    { stufe: 'Eigene Frage', text: 'Was ändert sich, wenn auch die 186 Nicht-Wahlberechtigten zur Basis gehören?', tipp: 'Zähl sie in der Klammer dazu: <code>988 / (3984 + 603 + 186) * 100</code>. Für wen gilt deine Zahl dann?' },
  ],
  a3: [
    { stufe: 'Abwandeln', text: 'Waren Frauen anders lange arbeitslos als Männer?', tipp: 'Wähl wie in Sitzung 2 nur die Frauen aus:<pre>frauen &lt;- allbus %&gt;%\n  filter(sex == 2)\n\nfrauen %&gt;%\n  describe(dw19)</pre>Für Männer tauschst du die 2 gegen eine 1. Der Name <code>frauen</code> ist nur ein Name; wenn du magst, nennst du das Objekt <code>maenner</code>, dann aber an beiden Stellen.' },
    { stufe: 'Erweitern', text: 'Schau nach, wie die beiden Fragen zur Arbeitslosigkeit genau lauten.', tipp: '<code>codebook(allbus, dw18, dw19)</code> zeigt erst die Frage, ob jemand in den letzten zehn Jahren arbeitslos war (dw18), dann die Frage, wie lange (dw19).' },
  ],
  a4: [
    { stufe: 'Abwandeln', text: 'Der ALLBUS hat die Wochen auch in sechs Stufen zusammengefasst (dw19c). In welcher Stufe liegt dort der Median, und passt das zu 26 Wochen?', tipp: '<code>allbus %&gt;% frequency(dw19c)</code>. Der Median ist die erste Zeile, in der Cum. % die 50 erreicht.' },
    { stufe: 'Erweitern', text: 'Wie viel Prozent liegen über dem Median von 26 Wochen?', tipp: 'Such in der Tabelle aus Schritt 2 die Zeile 26 und rechne 100 minus ihre Cum. %. Liegt höchstens die Hälfte darüber?' },
  ],
};

return { BILD: {}, TASKS, FREI };
};
