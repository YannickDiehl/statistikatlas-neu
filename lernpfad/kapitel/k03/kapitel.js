/* Kapitel 3 „Erste Auszählung“: Aufgaben und Zusatzinfos für die Lernpfad-Engine.
   Wird nach daten.js geladen; die Engine ruft window.KAPITEL(hilfen) einmal auf.
   Die Antwortprüfung mit Hinweisen je typischer falscher Zahl (special) und je Option (wrongBy) kommt aus
   bausteine.tsx (PRUEFEN, nutzt hintFor aus src/chapter/s03/content.ts). */
'use strict';
window.KAPITEL = ({ D, T, esc, bild, warum, probier, denk }) => {
/* Dieses Kapitel hat keine Aufgabenbilder (D.SVG). Die Engine fragt in den „?“-Fenstern zuerst D.SVG[bild] ab; ohne leeres Objekt bricht das Öffnen ab. */
if (!D.SVG) D.SVG = {};

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
const festlegen = (id, aufloesung, fenster) => ({ id: id + '-p', art: 'festlegen', titel: 'Erst festlegen', pred: id, vorhersage: { ...D.PREDICTIONS[id], aufloesung }, mehr: [fenster] });
/** Gemeinsamer Satz der Festlegen-Fenster. */
const VERGLEICH = 'Es zählt nicht, ob du richtig liegst: Deine Festlegung ist der Vergleichspunkt, an dem du später merkst, ob dich das Ergebnis überrascht.';
const RECHNER = 'R als Taschenrechner aus Sitzung 1';

/* ---------- Aufgaben ---------- */
const TASKS = [
  { id: 'a1', n: 1, titel: 'Wie geht es der Wirtschaft in einem Jahr?', pflicht: true, grund: 'g1',
    frage: 'Erwarten die Befragten, dass es der Wirtschaft in Deutschland in einem Jahr besser oder schlechter geht?',
    ziel: 'du kannst aus einer Häufigkeitstabelle ablesen, wie viele gültig geantwortet haben und wie viele Antworten fehlen, welche Erwartung am häufigsten ist (Modus) und wo die Mitte liegt (Median), und du hast einen Anteil mit R selbst zusammengezählt.',
    info: 'Der ALLBUS 2023 fragt, wie die wirtschaftliche Lage in Deutschland in einem Jahr sein wird, verglichen mit heute. Antworten von 1 „wesentlich besser“ bis 5 „wesentlich schlechter“. Die Variable heißt <code>ep04</code>.',
    infoMehr: [warum('Ungewichtet', 'Alle Zahlen in diesem Kapitel sind ungewichtet, genau wie die Ausgabe deiner Vorlagen. Gewichtet ändern sie sich etwas; das ist Thema in Sitzung 6.')],
    schritte: [
      festlegen('a1', 'Mehr erwarten eine schlechtere Lage: 48,28 % der gültigen Antworten gegenüber 16,33 %, die eine bessere erwarten.',
        denk('Wie lege ich mich fest?', { grund: 'k1-turm',
          kurz: 'Du sagst vorher, ob mehr Befragte erwarten, dass die Wirtschaftslage in Deutschland in einem Jahr besser wird, oder mehr, dass sie schlechter wird. ' + VERGLEICH,
          denken: [
            'Lies die Frage genau: Es geht um die Lage in ganz Deutschland in einem Jahr, verglichen mit heute, nicht um die eigene Lage.',
            'Die Antworten reichen von 1 „wesentlich besser“ über „gleichbleibend“ bis 5 „wesentlich schlechter“.',
            'Wähl eine Antwort. Prüfen kannst du sie in Schritt 5, wenn du die „schlechter“-Zeilen zusammenzählst und mit den „besser“-Zeilen vergleichst.',
          ] })),
      { id: 'a1-1', art: 'code', titel: 'Vorlage ausführen', wk: ['a1'], bekannt: 'frequency() aus Sitzung 1',
        text: 'Die Vorlage zählt aus, wie oft jede Erwartung vorkommt.',
        mehr: [denk('Was zählt frequency()?', { grund: 'k1-turm',
          kurz: '<code>allbus %&gt;% frequency(ep04)</code> heißt: Nimm den ALLBUS, und dann zähl aus, wie oft jede Antwort vorkommt. Gleiche Antworten kommen auf einen Stapel; die Höhe jedes Stapels ist die <b>absolute Häufigkeit</b>, in R die Spalte <b>N</b>.',
          denken: [
            'Lies die Vorlage als Satz: Welche Variable wird ausgezählt?',
            'Schau in die Spalte Value: Dort stehen die Codes 1 bis 5, daneben ihr Wertelabel.',
            'Schau in die Spalte N: Wie viele Steine liegen auf jedem Stapel?',
            'Ganz unten stehen die fehlenden Antworten. Die liest du in Schritt 3.',
          ],
          bild: 'TowerToTable', bildtext: 'Ein Beispiel mit zwölf Befragten und einer anderen Frage: wie oft man in der Freizeit Bücher liest. Geh die drei Schritte durch; deine Vorlage macht dasselbe mit <code>ep04</code> und allen Befragten.',
          verwechslung: 'Die Spalte <b>Value</b> ist der Code, nicht die Anzahl. Wie viele eine Antwort gegeben haben, steht in N.' }),
          warum('Lieber in RStudio?', 'Dann führst du dort vorher den Startblock aus (Pakete laden, ALLBUS einlesen). Danach kopierst du die Vorlage mit <b>Kopieren</b> in dein Skript.<pre>' + esc(T.start.code) + '</pre>', 'r1')] },
      { id: 'a1-2', art: 'lesen', titel: 'Die Tabelle von unten lesen',
        text: 'Wie viele haben gültig geantwortet (<b>Total valid</b>), wie viele Antworten fehlen (<b>Total missing</b>), und aus welchen Gründen?',
        mehr: [denk('Was steht unter der Linie?', { grund: 'k1-spalten',
          kurz: 'Die Tabelle hat zwei Teile. Oben stehen die gültigen Antworten 1 bis 5, darunter <b>Total valid</b>: alle gültigen zusammen. Unter der Linie folgen die fehlenden Antworten, jede mit Code und Grund; <b>Total missing</b> zählt sie zusammen.',
          denken: [
            'Fang unten an: Such die Zeilen „Total valid“, „Total missing“ und „Total“.',
            'Lies bei jeder die Spalte N, nicht die Prozentspalten.',
            'Geh die Zeilen unter der Linie durch: Welche Codes stehen dort, und was sagen ihre Wertelabels über den Grund?',
            'Prüf zur Kontrolle: Gültige und fehlende zusammen ergeben alle Befragten.',
          ],
          bild: 'FrequencyTable', bildtext: 'Die echte Tabelle einer anderen Frage, wie oft die Befragten Bücher lesen. Wähl eine Spalte und lies, was sie zählt.',
          verwechslung: '„Total valid“ zählt nur die gültigen Antworten 1 bis 5. „Total“ sind alle Befragten, auch die ohne gültige Antwort.' })] },
      { id: 'a1-3', art: 'lesen', titel: 'Modus und Median suchen',
        text: 'Such den Modus (die Zeile mit dem größten N) und den Median (die erste Zeile, in der Cum. % die 50 erreicht).',
        mehr: [denk('Modus oder Median?', { grund: 'k1-mitte',
          kurz: 'Der <b>Modus</b> ist der häufigste Wert, kurz gesagt der höchste Stapel. Der <b>Median</b> ist der Wert der Person in der Mitte, wenn alle gültigen Antworten der Reihe nach stehen. Die Spalte <b>Cum. %</b> (kumulierte Prozent) zählt die Valid % von oben nach unten zusammen.',
          denken: [
            'Für den Modus: Geh die Spalte N durch und such die größte Zahl. Welche Antwort steht in dieser Zeile?',
            'Für den Median: Geh in der Spalte Cum. % von oben nach unten. In welcher Zeile erreichst du zum ersten Mal 50 oder mehr?',
            'Vergleiche die beiden Zeilen: Ist es dieselbe Stufe oder nicht?',
          ],
          bild: 'BuecherStreifen', bildtext: 'Wieder das Beispiel Bücher lesen: alle gültigen Antworten der Reihe nach, auf 100 % gestaucht, mit der Mitte bei 50 %.',
          verwechslung: 'Der Modus ist nicht die mittlere Zeile der Tabelle, sondern die Zeile mit dem größten N.' })] },
      { id: 'a1-4', art: 'code', titel: 'Zwei Zeilen zusammenzählen', wk: ['a1r'], bekannt: RECHNER,
        text: 'Wie viele erwarten eine schlechtere Lage? Dafür zählst du zwei Zeilen zusammen. Die Vorlage zeigt, wie das geht: Sie zählt die Valid % der beiden „besser“-Zeilen zusammen und kommt auf 16.33, genau die Zahl in Cum. % bei ETWAS BESSER. Tausch im Journal die beiden markierten Zahlen gegen die Valid % von ETWAS SCHLECHTER und WESENTL. SCHLECHTER.',
        mehr: [denk('Warum Valid %?', { grund: 'k1-rechnen',
          kurz: 'Für „schlechter“ gibt es keine eigene Zeile: „etwas schlechter“ und „wesentlich schlechter“ sind zwei Stufen. Du zählst ihre Anteile zusammen, mit R als Taschenrechner. Gefragt ist der Anteil der gültigen Antworten, darum nimmst du <b>Valid %</b>.',
          denken: [
            'Lies die Vorlage: Sie zählt die Valid % der beiden „besser“-Zeilen zusammen. Vergleiche ihr Ergebnis mit Cum. % bei ETWAS BESSER.',
            'Such in deiner Tabelle die Zeilen ETWAS SCHLECHTER und WESENTL. SCHLECHTER, Spalte Valid %.',
            'Tausch die beiden markierten Zahlen gegen diese Werte und führ die Zeile aus.',
            'Zur Kontrolle geht es auch von oben, mit Cum. %: 100 minus Cum. % der Zeile direkt über ETWAS SCHLECHTER.',
          ],
          verwechslung: 'Raw % teilt durch alle 5.246 Befragten, auch durch die ohne gültige Antwort. Valid % teilt nur durch die, die geantwortet haben.' }),
          warum('Komma oder Punkt?', 'Kommazahlen schreibst du in R mit Punkt, etwa <code>15.67</code>. Mit Komma meldet R einen Fehler.', 'r2')] },
      { id: 'a1-5', art: 'lesen', titel: 'Deuten: Welcher Satz passt?',
        text: 'Welcher Satz beschreibt die Tabelle richtig? Die Sätze stehen im nächsten Schritt. Achte darauf, was „die meisten“ heißt und wo die Mitte liegt.',
        mehr: [denk('Worauf achten?', { grund: 'k1-ergebnis',
          kurz: 'Ein Satz über eine Tabelle stimmt nur, wenn seine Wörter zu den Zahlen passen. Drei Dinge entscheiden: was „die meisten“ heißt, was „im Mittel“ meint und für wen ein Anteil gilt.',
          denken: [
            'Was müsste gelten, damit „die meisten“ stimmt? Leg dein Ergebnis aus Schritt 5 daneben.',
            'Was meint „im Mittel“? Schau dir dazu deine Stufen aus Schritt 4 an.',
            'Für wen gilt ein Anteil in Valid %, und welche Gruppe nennt der Satz?',
            'Prüf jeden der drei Sätze einzeln an diesen drei Punkten.',
          ],
          verwechslung: 'Modus und Median können verschiedene Stufen sein: Die häufigste Antwort ist nicht automatisch die Antwort in der Mitte.' })] },
      { id: 'a1-6', art: 'fragen', titel: 'Ergebnis festhalten', fragen: 'a1',
        mehr: [denk('Wo lese ich das ab?', { grund: 'k1-ergebnis',
          kurz: 'Fast alles steht in der Ausgabe von <code>frequency(ep04)</code>; ein Wert kommt aus deiner Rechnung in Schritt 5. Jede Frage hat ihren festen Ort.',
          denken: [
            '<b>Gültige und fehlende Antworten:</b> Zeilen „Total valid“ und „Total missing“, Spalte N.',
            '<b>Modus:</b> die Zeile mit dem größten N. <b>Median:</b> die erste Zeile, in der Cum. % die 50 erreicht.',
            '<b>Schlechtere Lage:</b> das Ergebnis deiner Vorlage aus Schritt 5, in Valid %.',
            '<b>Der Satz:</b> deine Prüfung aus Schritt 6.',
          ],
          verwechslung: 'Cum. % ist nicht der Anteil einer einzelnen Antwort, sondern aller Antworten bis einschließlich dieser Zeile.' })] },
    ],
    plenum: 'Erwarten die Befragten für ihre eigene wirtschaftliche Lage etwas anderes als für Deutschland? Schau mit ep06 nach (unter „Weiter, wenn du magst“) und bring eine Vermutung mit, woran ein Unterschied liegen könnte.',
    probier: { idee: 'Sehen die Befragten ihre eigene wirtschaftliche Lage in einem Jahr ähnlich?', code: T.frei_a1.code },
    ohneGrafik: 'Diese Aufgabe hat keine Grafik. Alle Zahlen stehen in der Ausgabe von <code>allbus %&gt;% frequency(ep04)</code>.' },

  { id: 'a2', n: 2, titel: 'Wahlabsicht: drei Prozentzahlen für dieselbe Partei', pflicht: true, grund: 'g2',
    frage: 'Wie groß ist die Union, und wie groß sind die Unentschlossenen, je nachdem, wen du mitzählst?',
    ziel: 'du kannst für eine Partei drei Prozentzahlen nennen, jede mit ihrer Basis, und begründen, welche Zahl zu welchem Satz passt.',
    info: 'Der ALLBUS fragt, welche Partei man wählen würde, wenn am nächsten Sonntag Bundestagswahl wäre. Die Variable heißt <code>pv01</code>. Hier fehlt fast ein Viertel der Antworten, aus fünf verschiedenen Gründen.',
    schritte: [
      festlegen('a2', '„Weiß nicht“ sagen 603 Befragte, das sind 11,49 % aller Befragten: zwischen 5 und 15 %.',
        denk('Wie lege ich mich fest?', { grund: 'k2-gruende',
          kurz: 'Du schätzt, wie viel Prozent aller Befragten bei der Wahlabsicht „weiß nicht“ sagen. ' + VERGLEICH,
          denken: [
            'Lies die Frage: „Wenn am nächsten Sonntag Bundestagswahl wäre …“. Wer könnte darauf keine Partei nennen?',
            '„Weiß nicht“ ist nur einer von mehreren Gründen, warum eine Antwort fehlt. Andere sagen nichts, verweigern die Antwort oder dürfen nicht wählen.',
            'Wähl eine Antwort. Ob sie stimmt, siehst du in Schritt 2, unter der Linie in der Spalte Raw %.',
          ],
          verwechslung: 'Fehlend heißt nicht „hat die Antwort verweigert“: Jede Lücke hat ihren eigenen Grund.' })),
      { id: 'a2-1', art: 'code', titel: 'Vorlage ausführen und nach unten schauen', wk: ['a2'], bekannt: 'frequency() aus Sitzung 1',
        text: 'Die Vorlage zählt die Wahlabsicht aus. Schau zuerst nach unten: Welche Gründe für eine fehlende Antwort gibt es, und welcher ist am häufigsten?',
        mehr: [denk('Was heißen die Codes?', { grund: 'k2-gruende',
          kurz: 'Unter der Linie stehen die <b>fehlenden Werte</b>, kurz gesagt: Antworten, die nicht in die Auswertung eingehen. Jeder trägt einen Code mit Grund, etwa −9 KEINE ANGABE, −8 WEISS NICHT oder −7 VERWEIGERT. <b>Total missing</b> zählt alle zusammen.',
          denken: [
            'Schau zuerst nach unten, unter die Linie.',
            'Lies jede Zeile: Code, Wertelabel, Zahl in N.',
            'Vergleiche die Zahlen in N: Die größte gehört zum häufigsten Grund.',
            'Frag dich bei jedem Grund: Wurde die Person gefragt? Hat sie geantwortet?',
          ],
          bild: 'RegaleErklaert', bildtext: 'Drei Regale für fehlende Werte: nie gefragt (Studiendesign), nicht beantwortet (Befragte) oder beim Erfassen verloren.',
          verwechslung: '−50 heißt nicht bei jeder Variable dasselbe: Bei der Wahlabsicht ist es NICHT WAHLBERECHTIGT, bei der Schichteinstufung KEINER DER SCHICHTEN.' })] },
      { id: 'a2-2', art: 'lesen', titel: 'Zwei Prozentzahlen für CDU/CSU',
        text: 'Such die Zeile CDU-CSU. Lies zwei Prozentzahlen ab: Raw % (von allen Befragten) und Valid % (von den gültigen Antworten).',
        mehr: [denk('Raw % oder Valid %?', { grund: 'k2-basis',
          kurz: 'Jede Prozentzahl hat eine <b>Prozentbasis</b>, kurz gesagt: die Gruppe, durch die geteilt wird. <b>Raw %</b> teilt durch alle Befragten, <b>Valid %</b> nur durch die gültigen Antworten. Niemand hat seine Antwort geändert, nur die Basis ist eine andere.',
          denken: [
            'Such die Zeile CDU-CSU.',
            'Lies in dieser Zeile die Spalten Raw % und Valid %.',
            'Frag dich bei jeder Zahl: Durch wen wurde geteilt, durch alle Befragten oder nur durch die mit gültiger Antwort?',
            'Je mehr Antworten fehlen, desto weiter liegen die beiden Zahlen auseinander. Passt das zu dem, was du unter der Linie gesehen hast?',
          ],
          bild: 'HundredStones', bildtext: 'Ein anderes Beispiel, das Vertrauen zu Mitmenschen (<code>st01</code>): Schalte die Basis um. Niemand ändert seine Antwort, nur die Basis wechselt.',
          verwechslung: 'Valid % heißt nicht „Prozent aller Befragten“. Wer fehlt, zählt dort nicht mit.' })] },
      { id: 'a2-3', art: 'code', titel: 'Eine eigene Basis rechnen', wk: ['a2r'], bekannt: RECHNER, baustein: 'DreiBasen',
        text: 'Eine dritte Basis rechnest du selbst: Die Unentschlossenen („weiß nicht“) sollen mitzählen, weil auch sie eine Aussage machen. Die Basis ist dann 3.984 gültige plus 603 „weiß nicht“. Die Vorlage rechnet so für CDU/CSU. Tausch im Journal die markierte Zahl gegen die Zahl der „weiß nicht“-Antworten: Wie groß sind die Unentschlossenen auf dieser Basis?',
        mehr: [denk('Wozu die Klammer?', { grund: 'k2-eigen',
          kurz: 'Passt keine Spalte der Tabelle, legst du die Basis selbst fest: eine <b>eigene Basis</b>. Vor dem Schrägstrich steht der <b>Zähler</b>, die Gruppe, deren Anteil du willst. Dahinter steht in Klammern die Basis; die Klammer sorgt dafür, dass R erst die Basis zusammenzählt und dann teilt.',
          denken: [
            'Lies die Vorlage: Wer steht im Zähler, wer in der Basis?',
            'Tausch nur den Zähler gegen die Zahl der „weiß nicht“-Antworten aus Schritt 2.',
            'Lass die Basis, wie sie ist: Die Unentschlossenen gehören selbst zu der Basis, die du festgelegt hast.',
            'Führ die Zeile aus und lies das Ergebnis als Prozent.',
          ],
          bild: 'ThreeBases', bildtext: 'Ein anderes Beispiel, <code>st01</code>: dieselben 1.463 Antworten „kommt darauf an“, geteilt durch drei verschiedene Basen.',
          verwechslung: 'Ohne Klammer gilt Punkt vor Strich: R teilt dann nur durch die gültigen und zählt danach etwas dazu. Die Klammer um die Basis gehört immer dazu.' })] },
      { id: 'a2-4', art: 'lesen', titel: 'Deuten: der Zeitungssatz',
        text: 'Eine Zeitung schreibt: „Ein Viertel der Befragten würde die Union wählen.“ Passt das? Die Antwortmöglichkeiten stehen im nächsten Schritt.',
        mehr: [denk('Worauf achten?', { grund: 'k2-satz',
          kurz: 'Prozentzahlen mit verschiedenen Basen sagen Verschiedenes. Ob ein Satz passt, entscheiden seine Wörter: Für wen behauptet er die Zahl?',
          denken: [
            'Lies den Zeitungssatz Wort für Wort: Wen meint „der Befragten“?',
            'Such unter deinen Prozentzahlen für CDU/CSU die, die zu „ein Viertel“ passen könnte. Mit welcher Basis wurde sie gerechnet?',
            'Frag dich: Passt die Basis der Zahl zu der Gruppe, die der Satz nennt?',
          ] })] },
      { id: 'a2-5', art: 'fragen', titel: 'Ergebnis festhalten', fragen: 'a2',
        mehr: [denk('Wo lese ich das ab?', { grund: 'k2-satz',
          kurz: 'Die Zahlen stehen in <code>frequency(pv01)</code> und in deiner Rechnung aus Schritt 4. Für den Zeitungssatz nimmst du deine Überlegung aus Schritt 5.',
          denken: [
            '<b>Häufigster Grund:</b> unter der Linie, die größte Zahl in N.',
            '<b>Total missing:</b> die Zeile mit diesem Namen, Spalte N.',
            '<b>Raw % und Valid %:</b> die Zeile CDU-CSU, die beiden Spalten.',
            '<b>Eigene Basis:</b> das Ergebnis deiner Vorlage aus Schritt 4, mit getauschtem Zähler.',
          ],
          verwechslung: 'Raw % und Valid % stehen in derselben Zeile nebeneinander. Lies die Spaltenköpfe, bevor du eine Zahl abschreibst.' }),
          warum('Und gewichtet?', 'Alle Zahlen hier sind ungewichtet. Mit Gewichtung kommt die CDU/CSU auf 25,81 % der gültigen Antworten; warum, zeigt Sitzung 6.')] },
    ],
    plenum: 'Sollen die 603 Unentschlossenen in einer Wahlumfrage mitzählen? Und die 186 Nicht-Wahlberechtigten? Bringt je einen Satz mit, für wen eure Zahl gilt.',
    probier: { idee: 'Bei welcher Frage sagen besonders viele „weiß nicht“?', code: T.frei_a2.code },
    ohneGrafik: 'Das Bild in Schritt 4 zeigt nur die drei Basen. Alle Zahlen stehen in <code>allbus %&gt;% frequency(pv01)</code> und in der Ausgabe der Vorlage.' },

  { id: 'a3', n: 3, titel: 'Wie lange dauert Arbeitslosigkeit?', pflicht: true, grund: 'g3',
    frage: 'Wie lange waren Menschen ohne Arbeit, und welche Zahl beschreibt das ehrlich?',
    ziel: 'du kannst mit <code>describe()</code> Mittelwert, Median und N ablesen, sagen, wer in diesen Zahlen fehlt, und begründen, welche Zahl die typische Dauer besser beschreibt.',
    info: 'Der ALLBUS fragt alle, die in Voll- oder Teilzeit berufstätig sind, ob sie in den letzten zehn Jahren arbeitslos waren. Wer ja sagt, wird gefragt, wie lange. Die Antwort steht in Wochen in der Variable <code>dw19</code>.',
    schritte: [
      festlegen('a3', 'Der Mittelwert (54,7 Wochen) liegt deutlich über dem Median (26 Wochen), er ist gut doppelt so groß.',
        denk('Wie lege ich mich fest?', { grund: 'k3-reihe',
          kurz: 'Du legst fest, wo der Mittelwert der Arbeitslosigkeitsdauer im Vergleich zum Median liegt, bevor du rechnest. ' + VERGLEICH,
          denken: [
            'Erinnere dich: Der <b>Mittelwert</b> ist die Summe aller Werte geteilt durch ihre Anzahl, der <b>Median</b> der Wert der Person in der Mitte der sortierten Reihe.',
            'Stell dir vor, wie die Wochenzahlen verteilt sein könnten: eher gleichmäßig um eine Mitte oder eher ungleich?',
            'Wähl eine Antwort. Ob sie stimmt, siehst du in Schritt 2.',
          ],
          verwechslung: '„Durchschnitt“ und „Mitte“ sind nicht dasselbe: Der Durchschnitt ist der Mittelwert, die Mitte der Median.' })),
      { id: 'a3-1', art: 'code', titel: 'Kennzahlen ablesen', wk: ['a3'], neu: true,
        text: 'Die Vorlage fasst die Dauer in Kennzahlen zusammen. Lies Mean, Median, N und Missing ab.',
        mehr: [denk('Wie schreibt R die Zahlen?', { grund: 'k3-describe',
          kurz: '<code>describe()</code> ist neu. Es fasst eine Variable mit Zahlen in wenigen Kennzahlen zusammen. Für die Mitte schaust du auf <b>Mean</b> (Mittelwert) und <b>Median</b>, für die Basis auf <b>N</b> (wie viele gültige Werte eingehen) und <b>Missing</b> (wie viele fehlen).',
          denken: [
            'Lies die Vorlage als Satz: Welche Variable wird beschrieben?',
            'Such in der Ausgabe die Spaltenköpfe Mean, Median, N und Missing und lies die Zahl darunter.',
            'Lies Kommazahlen richtig: R schreibt drei Nachkommastellen mit Punkt; 2.342 heißt 2,342, 2.000 heißt 2. N und Missing sind ganze Zahlen.',
            'SD, Range, IQR und Skewness brauchst du in dieser Aufgabe nicht.',
          ],
          bild: 'DescribeOutput', bildtext: 'Ein anderes Beispiel: <code>describe(dh04)</code>, die Zahl der Personen im Haushalt, für alle Befragten.',
          verwechslung: 'N in <code>describe()</code> ist nicht die Zahl aller Befragten, sondern die Zahl der gültigen Werte. Alle Befragten sind N plus Missing.' })] },
      { id: 'a3-2', art: 'code', titel: 'Wer fehlt?', wk: ['a3f'], bekannt: 'frequency() aus Sitzung 1',
        text: 'Bei 4.732 Befragten fehlt die Dauer. Warum? <code>describe()</code> sagt es nicht. Die Häufigkeitstabelle derselben Variable zeigt es ganz unten. Sie ist lang, weil jede Wochenzahl eine eigene Zeile hat.',
        mehr: [denk('Wo stehen die Gründe?', { grund: 'k3-wer',
          kurz: '<code>describe()</code> meldet unter Missing nur, wie viele fehlen, nicht warum. Die Gründe zeigt die Häufigkeitstabelle derselben Variable, ganz unten unter der Linie, jeder mit Code und Anzahl.',
          denken: [
            'Geh in der Ausgabe ganz nach unten, unter die gültigen Wochenzahlen.',
            'Lies jede Zeile unter der Linie: Code, Grund, Zahl in N. Welcher Code steht bei den meisten?',
            'Erinnere dich an den Weg durch den Fragebogen: Wer wurde überhaupt nach der Dauer gefragt?',
            'Was die Codes heißen, zeigen die drei Regale in „Verstehen zu Aufgabe 2“.',
          ],
          verwechslung: 'Missing in <code>describe()</code> ist kein Grund, sondern eine Summe. Welche Codes dahinterstecken, zeigt nur <code>frequency()</code>.' }),
          probier('Wie lauten die beiden Fragen?', '<code>codebook()</code> zeigt erst die Frage, ob jemand in den letzten zehn Jahren arbeitslos war (dw18), dann die Frage, wie lange (dw19).', 'codebook(allbus, dw18, dw19)', 'a3')] },
      { id: 'a3-3', art: 'lesen', titel: 'Mittelwert und Median vergleichen',
        text: 'Vergleiche Mittelwert und Median. Was zieht den Mittelwert so weit nach oben? Ein Blick ans Ende der gültigen Zeilen in der Tabelle aus Schritt 3 hilft: Die längsten Zeiten reichen bis 520 Wochen, das sind zehn Jahre.',
        mehr: [denk('Was zieht den Mittelwert?', { grund: 'k3-schief',
          kurz: 'Der Mittelwert zählt jeden Wert zusammen, auch die wenigen sehr großen. Der Median schaut nur auf die Person in der Mitte der sortierten Reihe. Darum können beide weit auseinanderliegen.',
          denken: [
            'Leg Mittelwert und Median aus Schritt 2 nebeneinander: Wie weit liegen sie auseinander?',
            'Schau in der Tabelle aus Schritt 3 ans Ende der gültigen Zeilen: Wie lang sind die längsten Zeiten, und wie viele Befragte stehen dort?',
            'Frag dich: Was würde mit jeder der beiden Zahlen passieren, wenn diese längsten Zeiten fehlten?',
          ],
          bild: 'HaushaltsReihe', bildtext: 'Ein Beispiel mit neun Haushalten. Der letzte Schritt zeigt, was ein einzelner großer Wert mit Mittelwert und Median macht.',
          verwechslung: 'Ein großer Abstand zwischen Mittelwert und Median ist kein Rechenfehler: Beide sind richtig gerechnet, sie beschreiben nur Verschiedenes.' })] },
      { id: 'a3-4', art: 'lesen', titel: 'Deuten: ein Satz für den Bericht',
        text: 'Welcher Satz gehört in einen Bericht? Und zum Schluss ein Blick zurück auf Aufgabe 1: Was machst du mit dem Mittelwert in der Kopfzeile von <code>frequency(ep04)</code>? Die Antwortmöglichkeiten stehen im nächsten Schritt.',
        mehr: [denk('Welche Mitte passt?', { grund: 'k3-skala',
          kurz: 'Welche Mitte in einen Bericht gehört, hängt vom <b>Skalenniveau</b> ab, kurz gesagt: davon, was die Codes einer Variable bedeuten. Zwei Fragen entscheiden: Haben die Codes eine Reihenfolge? Und sind die Abstände zwischen ihnen gleich groß?',
          denken: [
            'Für den Satz zur Dauer: Prüf jeden Satz an deinen Zahlen aus Schritt 2 und an deinem Vergleich aus Schritt 4.',
            'Für <code>ep04</code> aus Aufgabe 1: Geh die beiden Fragen durch. Haben „wesentlich besser“ bis „wesentlich schlechter“ eine Reihenfolge? Sind die Abstände zwischen den Stufen gleich groß?',
          ],
          bild: 'ScaleLevels', bildtext: 'Welche Mitte zu welchem Skalenniveau passt, an Beispielen, die nicht die Variablen der Aufgaben sind.',
          verwechslung: 'Eine Zahl im Datensatz macht eine Variable nicht metrisch. Auch Parteien sind im ALLBUS als Zahlen gespeichert.' })] },
      { id: 'a3-5', art: 'fragen', titel: 'Ergebnis festhalten', fragen: 'a3',
        mehr: [denk('Wo lese ich das ab?', { grund: 'k3-ergebnis',
          kurz: 'Die Kennzahlen stehen in <code>describe(dw19)</code>, die Gründe ganz unten in <code>frequency(dw19)</code>. Die letzten beiden Fragen begründest du mit deinen Überlegungen aus Schritt 4 und 5.',
          denken: [
            '<b>Mittelwert und Median:</b> in <code>describe(dw19)</code> die Spalten Mean und Median.',
            '<b>N:</b> dieselbe Ausgabe, Spalte N, nicht Missing und nicht alle Befragten.',
            '<b>Warum die Dauer fehlt:</b> der Code, der ganz unten in <code>frequency(dw19)</code> bei den meisten steht.',
            '<b>Typische Dauer und Bericht zu <code>ep04</code>:</b> dein Vergleich aus Schritt 4 und die zwei Fragen zum Skalenniveau aus Schritt 5.',
          ],
          verwechslung: 'Mean und Median stehen in derselben Zeile nebeneinander. Lies die Spaltenköpfe, bevor du eine Zahl abschreibst.' })] },
    ],
    plenum: 'Eine Zeitung schreibt: „Arbeitslose bleiben im Schnitt über ein Jahr ohne Job.“ Was ist richtig daran, was fehlt? Denkt an den Median und daran, wer gefragt wurde: Wer gerade arbeitslos ist, steht nicht in dw19.',
    probier: { idee: 'Waren Frauen anders lange arbeitslos als Männer?', code: T.frei_a3.code },
    ohneGrafik: 'Diese Aufgabe hat keine Grafik. Alle Zahlen stehen in der Ausgabe der beiden Vorlagen.' },

  { id: 'a4', n: 4, titel: 'Wie viele liegen über dem Durchschnitt?', pflicht: false, grund: 'g4',
    frage: 'Wie viele waren länger arbeitslos als der Durchschnitt?',
    ziel: 'du kannst mit Cum. % und dem Taschenrechner ausrechnen, wie viel Prozent über dem Mittelwert liegen, und sagen, was das über die Verteilung verrät.',
    info: 'In Aufgabe 3 lag der Mittelwert der Arbeitslosigkeitsdauer bei 54,7 Wochen. Liegt die Hälfte darüber?',
    schritte: [
      festlegen('a4', 'Über dem Mittelwert liegen 24,71 %, das sind 127 der 514 Befragten: deutlich weniger als die Hälfte.',
        denk('Wie lege ich mich fest?', { grund: 'k4-cum',
          kurz: 'Du schätzt, wie viel Prozent der Befragten länger arbeitslos waren als der Durchschnitt, also über dem Mittelwert liegen. ' + VERGLEICH,
          denken: [
            'Schätz, wie viele Befragte wohl länger arbeitslos waren als der Mittelwert aus Aufgabe 3.',
            'Wähl eine Antwort. Ob sie stimmt, siehst du in Schritt 3.',
          ] })),
      { id: 'a4-1', art: 'code', titel: 'Cum. % der Wochen ablesen', wk: ['a4'],
        text: 'Die Vorlage zeigt die Häufigkeitstabelle der Wochen, dieselbe wie in Aufgabe 3. Geh in der Spalte Value nach unten bis zur letzten Wochenzahl unter dem Mittelwert 54,7. Welche Zahl steht dort in Cum. %?',
        mehr: [denk('Welche Zeile genau?', { grund: 'k4-zeile',
          kurz: 'In der Spalte Value stehen die Wochenzahlen der Größe nach. Der Mittelwert ist selbst keine Wochenzahl, die jemand angegeben hat. Gesucht ist die größte Wochenzahl unter dem Mittelwert, die in der Tabelle steht, und in ihrer Zeile die Zahl in <b>Cum. %</b>.',
          denken: [
            'Geh in der Spalte Value nach unten, bis die Wochenzahlen den Mittelwert überschreiten.',
            'Nimm die Zeile direkt davor: die letzte Wochenzahl unter dem Mittelwert.',
            'Prüf: Steht zwischen dieser Zeile und dem Mittelwert noch eine Wochenzahl? Dann ist es noch nicht die letzte.',
            'Lies in dieser Zeile die Spalte Cum. %.',
          ],
          verwechslung: 'Die erste Zeile über dem Mittelwert ist eine zu weit: Dann zählst du schon Menschen über dem Mittelwert mit.' })] },
      { id: 'a4-2', art: 'code', titel: '100 minus Cum. % rechnen', wk: ['a4r'], bekannt: RECHNER,
        text: 'Rechne 100 minus diese Zahl. Die Vorlage rechnet das Beispiel aus „Verstehen zu Aufgabe 4“ (Personen im Haushalt). Tausch im Journal die markierte Zahl gegen deinen Wert aus Schritt 2.',
        mehr: [denk('Warum 100 minus?', { grund: 'k4-cum',
          kurz: '<b>Cum. %</b> sagt, wie viel Prozent höchstens bis zu einem Wert kommen. Wer darüber liegt, ist der Rest bis 100. Die Vorlage rechnet das für das Beispiel mit den Personen im Haushalt.',
          denken: [
            'Lies die Vorlage: <code>100 - 67.42</code> rechnet das Haushaltsbeispiel.',
            'Tausch die markierte Zahl gegen deinen Cum.-%-Wert aus Schritt 2, mit Punkt statt Komma.',
            'Führ die Zeile aus und lies das Ergebnis: So viel Prozent liegen über dem Mittelwert.',
          ],
          bild: 'HaushaltsStreifen', bildtext: 'Das Beispiel aus der Vorlage, Personen im Haushalt: Die Klammern zeigen, wer höchstens beim Mittelwert liegt und wer darüber.',
          verwechslung: 'Das Ergebnis der unveränderten Vorlage gehört zum Haushaltsbeispiel, nicht zur Arbeitslosigkeit.' })] },
      { id: 'a4-3', art: 'fragen', titel: 'Ergebnis festhalten', fragen: 'a4',
        mehr: [denk('Was verrät das?', { grund: 'k4-zeile',
          kurz: 'Zwei Zahlen hast du schon. Die dritte Frage deutest du: Was sagt dein Ergebnis über die Verteilung der Dauer?',
          denken: [
            '<b>Cum. %:</b> dein Wert aus Schritt 2.',
            '<b>Über dem Mittelwert:</b> das Ergebnis deiner Rechnung aus Schritt 3.',
            '<b>Was das zeigt:</b> Vergleiche dein Ergebnis mit der Hälfte. Denk an Mittelwert und Median aus Aufgabe 3 und an das Haushaltsbeispiel.',
          ],
          verwechslung: 'Cum. % zählt bis einschließlich der Zeile: Die Zeile selbst gehört zu „höchstens“, nicht zu „darüber“.' })] },
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
