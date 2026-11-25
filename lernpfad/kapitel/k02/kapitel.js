/* Kapitel 2 „Vom Fragebogen zum Datensatz“: Aufgaben, Zusatzinfos und eine eigene Schrittart für die Lernpfad-Engine.
   Wird nach daten.js geladen; die Engine ruft window.KAPITEL(hilfen) einmal auf. */
'use strict';
window.KAPITEL = ({ D, T, esc, warum, denk }) => {
/* Dieses Kapitel hat keine Aufgabenbilder (D.SVG). Die Engine fragt in den „?“-Fenstern zuerst D.SVG[bild] ab; ohne leeres Objekt bricht das Öffnen ab. */
if (!D.SVG) D.SVG = {};

/* Fragen aus content.ts (IDs und Ziele bleiben). Zwei Anpassungen an die Engine:
   - Backticks in den Antwortmöglichkeiten fallen weg, weil die Engine Optionen als reinen Text zeigt (a4: „`<dbl>` Zahl“ → „<dbl> Zahl“).
   - Die Engine setzt selbst „Richtig:“ bzw. „Noch nicht.“ davor; der gleiche Anfang in den Texten von s02 („Stimmt:“, „Genau.“,
     „Noch nicht.“) fällt darum weg, sonst stünde er doppelt da. */
/* Verweise auf die Grundlagen des Atlas zeigen auf die Karten in „Verstehen“. */
const VERWEISE = [
  ['Grundlage 1: Jede Reihe', 'Jede Reihe'],
  ['Grundlage 3b, Zeile −11.', 'Verstehen zu Aufgabe 3, „Nicht gefragt ist nicht verweigert“.'],
  ['in Grundlage 2c', 'in Verstehen zu Aufgabe 2 („Codes sind Namen“)'],
  ['Grundlage 4a, Häufige Verwechslung.', 'Verstehen zu Aufgabe 4, „Typ und Bedeutung“.'],
  ['Schau in Grundlage 4b, Zustand', 'Schau in Verstehen zu Aufgabe 4, „Umwandeln“, Zustand'],
  ['Grundlage 4b.', 'Verstehen zu Aufgabe 4, „Umwandeln“.'],
];
const verweis = t => VERWEISE.reduce((x, [a, b]) => x.split(a).join(b), t);
const ohneRichtig = t => verweis(t.replace(/^(Stimmt|Genau)[.:]\s*/, ''));
const ohneNoch = t => verweis(t.replace(/^Noch nicht\.\s*/, ''));
const jeWert = (o, f) => o && Object.fromEntries(Object.entries(o).map(([k, v]) => [k, f(v)]));
/* Schrittnummern: In s02 waren die Schritte von A3 ohne „Erst festlegen“ gezählt; auf der Seite ist die Vorlage Schritt 2,
   der Tausch Schritt 3. Reihenfolge wichtig: erst 2 → 3, dann 1 → 2. */
const SCHRITTE = { a3: t => t.split('Schritt 2').join('Schritt 3').split('Schritt 1').join('Schritt 2') };
/* Texte, die eine Antwort einer anderen Frage verraten würden (a1_papier = 1.656): Wortlaut ohne die Zahl; IDs und Ziele bleiben. */
const OHNE_LOESUNG = {
  a3_split: { label: 'Zusammen ergeben die beiden −11-Zahlen genau alle Papierbögen. Was heißt das?' },
  a1_wer: { optionen: { papier: 'nur für die Befragten, die auf Papier geantwortet haben' } },
};
const Q = g => D.QUESTIONS[g].map(q0 => {
  const nr = SCHRITTE[g] || (t => t), f = t => nr(verweis(t)), x = OHNE_LOESUNG[q0.id] || {};
  const q = { ...q0, ...(x.label ? { label: x.label } : {}) };
  return {
    ...q, right: nr(ohneRichtig(q.right)), hint: nr(ohneNoch(q.hint)), ...(q.help ? { help: f(q.help) } : {}),
    ...(q.specialInput ? { specialInput: jeWert(q.specialInput, t => nr(ohneNoch(t))) } : {}),
    ...(q.wrongByOption ? { wrongByOption: jeWert(q.wrongByOption, t => nr(ohneNoch(t))) } : {}),
    ...(q.options ? { options: q.options.map(o => ({ ...o, label: (x.optionen?.[o.value] ?? o.label).replace(/`/g, '') })) } : {}),
  };
});

/* Festlegungen aus PREDICTIONS (IDs a1 … a4 bleiben), ergänzt um eine Auflösung aus den Rückmeldungen der Fragen. */
const P = (k, aufloesung) => ({ ...D.PREDICTIONS[k], aufloesung });

/* ---------- Aufgaben ---------- */
const TASKS = [
  { id: 'a1', n: 1, titel: 'Wer hat auf Papier geantwortet?', pflicht: true, grund: 'g1',
    frage: 'Wie viele Zeilen des ALLBUS waren einmal ein Papierbogen?',
    ziel: 'du kannst in der Ausgabe von R Reihen und Türme ablesen, mit <code>filter()</code> nur die Papierbögen behalten und sagen, wie viele es sind, was mit den Variablen passiert und für wen ein Ergebnis dann gilt.',
    info: 'Der ALLBUS 2023 wurde auf drei Wegen erhoben: im persönlichen Interview, bei dem die Antworten direkt in einen Laptop getippt werden (<b>CAPI</b>), online (<b>CAWI</b>) und auf Papier, das per Post zurückkam (<b>MAIL</b>). Die Papierbögen musste jemand abtippen. Welche Zeilen das sind, verrät die Variable <code>mode</code>.',
    infoMehr: [warum('Lieber in RStudio?', 'Dann führst du dort vorher den Startblock aus (Pakete laden, ALLBUS einlesen). Danach kopierst du die Vorlagen mit <b>Kopieren</b> in dein Skript.<pre>' + esc(T.start.code) + '</pre>', 'r1')],
    schritte: [
      { id: 'a1-p', art: 'festlegen', titel: 'Erst festlegen',
        vorhersage: P('a1', 'Knapp ein Drittel: 1.656 von 5.246 Befragten (31,6 %) haben auf Papier geantwortet. Jede dieser Zeilen hat jemand abgetippt.'),
        mehr: [denk('Wie lege ich mich fest?', { grund: 'k1-wege',
          kurz: 'Du schätzt vorher, welcher Teil der Befragten auf Papier geantwortet hat. Es zählt nicht, ob du richtig liegst: Deine Festlegung ist der Vergleichspunkt, an dem du am Ende merkst, ob dein Bild vom ALLBUS gestimmt hat.',
          denken: [
            'Denk an die drei <b>Erhebungswege</b>: Interview mit Laptop (CAPI), online (CAWI) und Papierbogen per Post (MAIL).',
            'Frag dich: Wer füllt eher einen Papierbogen aus, wer eher online? Wie groß könnte die Papier-Gruppe unter allen Befragten sein?',
            'Wähl eine Antwort. Prüfen kannst du sie am Ende selbst: Zahl der Papierbögen geteilt durch alle Reihen ergibt den Anteil.',
          ],
          verwechslung: 'Gezählt werden Zeilen, nicht Fragen: Eine Zeile ist eine befragte Person (ein <b>Fall</b>), und jeder Papierbogen wurde zu genau einer Zeile.' })] },
      { id: 'a1-1', art: 'code', titel: 'Die Bauplatte anzeigen', wk: ['a1a'],
        text: 'Führst du nur den Namen eines Objekts aus, zeigt R es an. Die erste Zeile der Ausgabe verrät die Größe: erst die Reihen, dann die Türme.',
        baustein: 'Ausgabe',
        mehr: [denk('Was steht in der Ausgabe?', { grund: 'k1-ausgabe',
          kurz: 'Die Vorlage ist nur der Name <code>allbus</code>; R zeigt dann die Bauplatte an. Ein Datensatz ist eine <b>Datenmatrix</b>, kurz gesagt ein Rechteck: Jede Reihe ist eine befragte Person (ein <b>Fall</b>), jeder Turm eine <b>Variable</b>.',
          denken: [
            'Schau in die erste Zeile der Ausgabe: <code>A tibble: … × …</code>. Welche Zahl steht vor dem ×, welche dahinter?',
            'Erinnere dich an die Reihenfolge: erst die Reihen, dann die Türme.',
            'Darunter stehen die Namen der ersten Türme, in spitzen Klammern ihr Typ (mehr dazu in Aufgabe 4), dann die ersten Reihen. Die letzten Zeilen sagen, was R nicht zeigt („more rows“, „more variables“).',
            'Zur Kontrolle: Im Environment steht dieselbe Größe neben dem Namen <code>allbus</code>.',
          ],
          bild: 'SheetsToPlate', bildtext: 'Drei Bögen werden zu einer Bauplatte mit drei Reihen und drei Türmen. Tipp auf einen Stein. Die Bögen sind ein Beispiel mit drei Personen; der ALLBUS hat dieselbe Form, nur viel größer.',
          verwechslung: 'R schreibt Tausender mit Komma: 1,234 heißt 1.234, nicht eins Komma zwei. Ins Antwortfeld tippst du die Zahl ohne das Komma von R.' })] },
      { id: 'a1-2', art: 'code', titel: 'Nachschlagen', wk: ['a1b'],
        text: 'Schlag nach, welcher Code in <code>mode</code> für den Papierbogen steht. MAIL heißt: Papierbogen per Post.',
        mehr: [denk('Wie lese ich den Eintrag?', { grund: 'k1-nachschlagen',
          kurz: 'In <code>mode</code> steht kein Wort wie MAIL, sondern ein <b>Code</b>, eine Zahl. Was ein Code bedeutet, sagt sein <b>Wertelabel</b> im Codebuch. <code>codebook(allbus, mode)</code> zeigt den Eintrag dieser einen Variable.',
          denken: [
            'Such im Eintrag den Abschnitt <code>Value labels</code>: Dort steht jeweils ein Code, ein Gleichheitszeichen und das Wort.',
            'Such das Wort MAIL und nimm die Zahl davor. Die brauchst du in Schritt 4.',
            'Vergleiche mit <code>Values</code>: Dort stehen nur die Codes, die im Datensatz wirklich vorkommen. PAPI (Code 1, ein älterer Papier-Interviewweg) steht im Codebuch, kommt 2023 aber nicht vor.',
          ],
          verwechslung: '<code>filter(mode == "MAIL")</code> geht nicht: Im Turm liegen Zahlen, keine Wörter. Darum erst nachschlagen, dann auswählen.' })] },
      { id: 'a1-3', art: 'code', titel: 'Nur die Papierbögen behalten', wk: ['a1c'], neu: true,
        text: 'Die Vorlage behält im Moment nur die Interviews (Code 2). Tausch im Journal die markierte <mark>2</mark> gegen den Code für Papierbögen aus Schritt 3 und führ sie aus. Lies in der ersten Zeile der Ausgabe ab, wie groß die neue Bauplatte ist.',
        mehr: [denk('Was heißt ==?', { grund: 'k1-filter',
          kurz: 'Die Pipe <code>%&gt;%</code> gibt <code>allbus</code> an <code>filter()</code> weiter („und dann“). <code>filter(mode == …)</code> fragt in jeder Reihe: Steht in <code>mode</code> dieser Code? Mit <code>&lt;-</code> legst du das Ergebnis unter dem neuen Namen <code>auswahl</code> ab; <code>allbus</code> bleibt, wie es ist.',
          denken: [
            'Lies die Vorlage als Satz: „Nimm <code>allbus</code>, und dann behalte nur die Befragten, bei denen in <code>mode</code> der markierte Code steht.“',
            'Tausch nur die gelbe <mark>2</mark> (die Interviews) gegen den Code, den du in Schritt 3 nachgeschlagen hast.',
            'Lies in der ersten Zeile der Ausgabe ab, wie groß <code>auswahl</code> ist. Steht dort die Zahl der Interviews, ist die 2 noch drin.',
            'Leg die erste Zeile neben die aus Schritt 2: Welche der beiden Zahlen hat sich geändert, welche nicht?',
          ],
          verwechslung: 'Ein einzelnes <code>=</code> stellt ein Argument ein, <code>==</code> fragt „ist gleich?“. Bei <code>filter(mode = 2)</code> meldet R „Did you mean <code>mode == 2</code>?“.' })] },
      { id: 'a1-4', art: 'fragen', titel: 'Ergebnis festhalten', fragen: Q('a1'),
        mehr: [denk('Wo lese ich das ab?', { grund: 'k1-ergebnis',
          kurz: 'Jede Frage hat einen festen Ort: die Ausgabe aus Schritt 2, den Eintrag im Codebuch aus Schritt 3 oder die Ausgabe deiner Auswahl aus Schritt 4. Die letzte Frage liest du nicht ab, sondern überlegst sie dir an deiner Auswahl.',
          denken: [
            '<b>Reihen von <code>allbus</code>:</b> erste Zeile der Ausgabe aus Schritt 2, die Zahl vor dem ×.',
            '<b>Code für MAIL:</b> Schritt 3, unter <code>Value labels</code>.',
            '<b>Reihen deiner Auswahl:</b> erste Zeile der Ausgabe aus Schritt 4, nach dem Tausch.',
            '<b>Was <code>filter()</code> gemacht hat und für wen ein Ergebnis gilt:</b> Leg die ersten Zeilen aus Schritt 2 und 4 nebeneinander. Wer steht in <code>auswahl</code> noch drin?',
          ],
          verwechslung: 'R schreibt Tausender mit Komma. Ins Antwortfeld tippst du die Zahl ohne das Komma von R, also etwa 1234 oder 1.234.' })] },
    ],
    ohneGrafik: 'Alle Antworten stehen als Text in der R-Ausgabe; das Bild zum Aufbau der Ausgabe hat eine Textfassung.' },

  { id: 'a2', n: 2, titel: 'Ein Bogen wird zur Zeile', pflicht: true, grund: 'g2',
    frage: 'Welche Zahlen stehen in der Zeile dieser Person?',
    ziel: 'du hast aus einem ausgefüllten Papierbogen eine Zeile mit vier Codes gemacht und kannst begründen, warum ein höherer Code nicht immer „mehr“ bedeutet.',
    info: 'Vor dir liegt gleich ein ausgefüllter Papierbogen. Die Antworten sind ausgedacht; so einen Bogen gibt es im ALLBUS nicht. Mach daraus eine Zeile, wie sie im ALLBUS stehen würde. Welcher Code zu welchem Wertelabel gehört, steht im Codebuch.',
    schritte: [
      { id: 'a2-p', art: 'festlegen', titel: 'Erst festlegen',
        vorhersage: P('a2', 'Ohne Codebuch lässt es sich nicht wissen. Bei `ep03` beginnt die Skala mit 1 = SEHR GUT, „schlecht“ ist 4.'),
        mehr: [denk('Wie lege ich mich fest?', { grund: 'k2-richtung',
          kurz: 'Du legst fest, welche Zahl die Antwort „schlecht“ bei der eigenen wirtschaftlichen Lage (<code>ep03</code>) im Datensatz bekommt. Es zählt nicht, ob du richtig liegst: Deine Festlegung ist der Vergleichspunkt, an dem du später merkst, ob dich das Codebuch überrascht.',
          denken: [
            'Stell dir die Antworten auf dem Bogen vor: sehr gut, gut, teils/teils, schlecht, sehr schlecht.',
            'Überleg, ob die Zählung eher bei „sehr gut“ oder eher bei „sehr schlecht“ beginnen könnte.',
            'Wähl eine Antwort. Ob sie stimmt, siehst du in Schritt 3 im Eintrag des Codebuchs.',
          ] })] },
      { id: 'a2-1', art: 'erledigt', titel: 'Den Bogen ansehen', baustein: 'Bogen', haken: 'Bogen angesehen',
        text: 'Aus diesem Bogen machst du eine Zeile. Unter dem Bogen stehen die Namen der vier Variablen im ALLBUS.',
        mehr: [denk('Was steht auf dem Bogen?', { grund: 'k2-beschriftungen',
          kurz: 'Auf dem Bogen stehen die Fragen in Worten und die Antworten der Person, darunter die Namen der vier Variablen im ALLBUS. Jede Variable trägt drei Beschriftungen: den <b>Variablennamen</b> (kurz, für R), das <b>Variablenlabel</b> (was gefragt wurde) und die <b>Wertelabels</b> (was jeder Code bedeutet). Auf dem Bogen steht nur eine davon.',
          denken: [
            'Geh die vier Fragen durch: Wo hat die Person eine Zahl eingetragen, wo ein Kästchen angekreuzt?',
            'Merk dir zu jeder Frage den Variablennamen darunter. Mit ihm schlägst du in Schritt 3 nach.',
            'Frag dich: Steht die Zahl, die in den Datensatz kommt, schon auf dem Bogen? Oder brauchst du dafür das Codebuch?',
          ],
          bild: 'DreiBeschriftungen', bildtext: 'Die drei Beschriftungen am Beispiel des politischen Interesses (<code>pa02a</code>): Variablenname, Variablenlabel und Wertelabels.',
          verwechslung: 'Variablenlabel und Wertelabel: Das Variablenlabel beschriftet den ganzen Turm („Politisches Interesse“), ein Wertelabel einen einzelnen Code („SEHR STARK“).' })] },
      { id: 'a2-2', art: 'code', titel: 'Vier Variablen nachschlagen', wk: ['a2'],
        text: 'Die Vorlage zeigt für jede der vier Variablen einen Eintrag aus dem Codebuch: was gefragt wurde, welche Codes vorkommen und welches Wertelabel zu welchem Code gehört.',
        mehr: [denk('Wo steht was im Eintrag?', { grund: 'k2-eintrag',
          kurz: '<code>codebook()</code> schlägt hier vier Variablen auf einmal nach; mehrere trennst du mit Komma. Für jede erscheint ein eigener Eintrag mit <code>Label</code>, <code>Values</code>, <code>Value labels</code> und <code>Missing values</code>.',
          denken: [
            '<code>Label</code> ist das Variablenlabel: Passt es zur Frage auf dem Bogen?',
            '<code>Values</code> zählt die gültigen Codes auf. Steht dort nur ein Bereich „von – bis“, gibt es für die gültigen Werte keine Wertelabels.',
            '<code>Value labels</code> zeigt, welches Wort zu welchem Code gehört. Hier suchst du in Schritt 4 die Antworten vom Bogen.',
            '<code>Missing values</code> zeigt die fehlenden Werte mit Grund und Anzahl; darum geht es in Aufgabe 3.',
          ],
          verwechslung: 'Die Zahl in eckigen Klammern vor dem Namen ist die Position der Variable im Datensatz, kein Code.',
          zusatz: 'In RStudio öffnet sich derselbe Eintrag im Viewer als Tabelle; die Spalte Freq. zeigt dort zusätzlich, wie oft jeder gültige Code vorkommt.' })] },
      { id: 'a2-3', art: 'erledigt', titel: 'Vom Wort zum Code', haken: 'Zu jeder Antwort den Code gefunden',
        text: 'Such zu jeder Antwort auf dem Bogen das passende Wertelabel in deiner Ausgabe und nimm die Zahl davor. Achte auf die Richtung der Skala. Steht bei einer Variable kein Wertelabel für die Antwort, ist die Zahl selbst der Wert. Die vier Zahlen trägst du in Schritt 6 ein.',
        mehr: [denk('Und wenn das Wort anders klingt?', { grund: 'k2-zuordnen',
          kurz: 'Du tust, was beim ALLBUS mit jedem Papierbogen passiert ist: Du übersetzt jede Antwort mit dem Codebuch in einen Code. Das heißt <b>Erfassen</b> (auch: Kodieren), kurz gesagt: Kreuz suchen, nachschlagen, Zahl eintragen.',
          denken: [
            'Nimm eine Frage nach der anderen und such in deiner Ausgabe den Eintrag mit dem Variablennamen unter der Frage.',
            'Such unter <code>Value labels</code> das Wort, das zur Antwort passt, und nimm die Zahl davor. Auf dem Bogen steht oft ein ganzer Satz, im Codebuch ein kurzes Wort.',
            'Achte auf die Richtung der Skala: Für welche Antwort steht die 1?',
            'Gibt es für die Antwort kein Wertelabel, ist die Zahl auf dem Bogen selbst der Wert.',
          ],
          bild: 'Pa02a', bildtext: 'Ein anderes Beispiel, das politische Interesse (<code>pa02a</code>): Die Wertelabels kleben als gelbe Aufkleber an den Steinen. Das Kreuz bei „sehr stark“ wird zum Code 1.',
          verwechslung: 'Platz auf dem Bogen und Code: Wer abzählt, an welcher Stelle das Kreuz steht, statt im Codebuch nachzusehen, erfasst falsch.',
          zusatz: 'Der ALLBUS schreibt Wertelabels in Großbuchstaben und Umlaute als ae, oe, ue.' })] },
      { id: 'a2-4', art: 'lesen', titel: 'Deuten: Menge oder Name?',
        text: 'Lies deine fertige Zeile: Welche Zahl sagt etwas über eine Menge, welche ist nur ein Name? Dazu gehört die letzte Frage in Schritt 6.',
        mehr: [denk('Codes sind Namen', { grund: 'k2-namen',
          kurz: 'Eine Zahl im Datensatz kann Verschiedenes sein: Manche Zahlen messen eine Menge, manche sind Stufen einer Skala, manche sind nur Namen. Codes für Kategorien sind wie Rückennummern: Sie benennen, sie zählen nichts ab.',
          denken: [
            'Geh deine vier Zahlen durch und frag bei jeder: Was bedeutet sie laut Codebuch?',
            'Bei welcher Zahl ist „eins mehr“ überall gleich viel?',
            'Wo Codes für Stufen stehen: Ergeben die Wertelabels eine Reihenfolge, und in welche Richtung läuft sie?',
            'Für die letzte Frage in Schritt 6: Lies, was die beiden Wertelabels heißen, statt die Zahlen zu vergleichen.',
          ],
          bild: 'Pv01Codes', bildtext: 'Ein anderes Beispiel, die Wahlabsicht (<code>pv01</code>): Jede Partei hat einen Code. Die Linke hat die 6, die AfD die 42, eine 5 gibt es nicht.',
          verwechslung: 'Zahlen vergleichen statt Labels lesen: Was ein Code bedeutet, steht im Wertelabel. Lies es, bevor du zwei Codes vergleichst.' })] },
      { id: 'a2-5', art: 'fragen', titel: 'Ergebnis festhalten', fragen: Q('a2'),
        mehr: [denk('Wo lese ich das ab?', { grund: 'k2-ergebnis',
          kurz: 'Alles steht in der Ausgabe aus Schritt 3. Für die vier Zahlen liest du im Codebuch ab, für die letzte Frage vergleichst du zwei Wertelabels.',
          denken: [
            '<b>Bei <code>age</code>:</b> Schau, ob es für die Jahre Wertelabels gibt oder nur einen Bereich unter <code>Values</code>.',
            '<b>Bei <code>educ</code>, <code>ep03</code> und <code>id02</code>:</b> unter <code>Value labels</code> das passende Wort suchen und die Zahl davor nehmen. Bei <code>ep03</code> lohnt der Blick auf die Richtung.',
            '<b>Rangfolge bei <code>educ</code>:</b> Lies, was die beiden Codes heißen. Ergibt das eine Reihenfolge von Abschlüssen?',
          ],
          verwechslung: 'Ins Antwortfeld kommt der Code, nicht das Wort: die Zahl vor dem Gleichheitszeichen.' })] },
    ],
    plenum: 'Optional: Hättet ihr „keiner dieser Schichten“ angekreuzt, stünde dort −50, ein fehlender Wert, obwohl die Person geantwortet hat. Ist das richtig so? Bringt eine Begründung mit.',
    ohneGrafik: 'Auf dem Bogen steht: Frage 1 Alter (<code>age</code>): 19 Jahre. Frage 2 Schulabschluss (<code>educ</code>): angekreuzt „Ich gehe noch zur Schule“. Frage 3 eigene wirtschaftliche Lage (<code>ep03</code>): angekreuzt „schlecht“. Frage 4 Schicht (<code>id02</code>): angekreuzt „Arbeiterschicht“. Alle Codes stehen als Text in der R-Ausgabe.' },

  { id: 'a3', n: 3, titel: 'Was nur auf Papier passiert', pflicht: true, grund: 'g3',
    frage: 'Welche fehlenden Werte gibt es im ALLBUS nur, weil es Papierbögen gibt?',
    ziel: 'du kannst sagen, wie der ALLBUS zwei Kreuze und nicht gestellte Fragen speichert, und mit Zahlen aus R begründen, warum „fehlt“ nicht gleich „fehlt“ ist.',
    info: 'Einen Papierbogen füllt man anders aus als einen Online-Fragebogen oder ein Interview mit Laptop. Und auf Papier wie online gab es zwei Fragebogenversionen, A und B. Beides hinterlässt Spuren in den fehlenden Werten. Du schaust dir drei Fragen an: die Links-rechts-Einstufung <code>pa01</code> (1 = links, 10 = rechts), das Vertrauen zu Mitmenschen <code>st01</code> und das Vertrauen in den Bundestag <code>pt03</code>.',
    schritte: [
      { id: 'a3-p', art: 'festlegen', titel: 'Erst festlegen',
        vorhersage: P('a3', 'Nein, nie: Bei `pa01` steht −42 bei allen Befragten genauso oft wie auf Papier, 24-mal. Im Interview und online lässt sich nur ein Kästchen wählen.'),
        mehr: [denk('Wie lege ich mich fest?', { grund: 'k3-boegen',
          kurz: 'Du legst fest, ob der Code −42 DATENFEHLER: MFN bei der Links-rechts-Einstufung <code>pa01</code> auch bei Befragten vorkommt, die im Interview oder online geantwortet haben. MFN heißt <b>Mehrfachnennung</b>, kurz gesagt: mehrere Kreuze, und keines lässt sich nehmen. Es zählt nicht, ob du richtig liegst; deine Festlegung ist dein Vergleichspunkt.',
          denken: [
            'Stell dir die drei Wege vor: mit Stift auf Papier, online am Bildschirm und im Interview, bei dem jemand die Antwort in einen Laptop tippt.',
            'Überleg, wie das Antworten auf jedem dieser Wege abläuft.',
            'Wähl eine Antwort. Ob sie stimmt, siehst du in Schritt 3, wenn du Papierbögen und alle Befragten vergleichst.',
          ],
          verwechslung: 'Mehrfachnennung und keine Angabe: −42 heißt, die Person hat mehrere Kreuze gesetzt; −9 KEINE ANGABE heißt, sie hat gar nicht geantwortet.' })] },
      { id: 'a3-1', art: 'code', titel: 'Codebuch der Papierbögen', wk: ['a3'], bekannt: 'filter() aus Aufgabe 1',
        text: 'Die Vorlage behält nur die Papierbögen und schlägt drei Fragen im Codebuch nach. Führ sie im Journal so aus, wie sie ist, und schau bei jeder Frage unter „Missing values“.',
        mehr: [denk('Wo stehen die Anzahlen?', { grund: 'k3-gruende',
          kurz: 'Die Vorlage behält mit <code>filter()</code> nur die Papierbögen, legt sie unter <code>papier</code> ab und schlägt dann drei Variablen nach. Das erste Feld in <code>codebook()</code> sagt, welche Bauplatte gezählt wird. Unter „Missing values“ steht jeder <b>fehlende Wert</b> mit Grund und Anzahl.',
          denken: [
            'Schau zuerst oben nach „Observations“: Wie viele Reihen zählt das Codebuch gerade?',
            'Geh zu <code>pa01</code>, <code>st01</code> und <code>pt03</code>, jeweils unter „Missing values“.',
            'Lies jede Zeile als <code>Code = Wertelabel (n = …)</code>: Die Zahl hinter „n =“ sagt, wie oft der Code vorkommt.',
            'Steht hinter einem Code keine Anzahl, kommt er in dieser Auswahl nicht vor (wie −8 bei <code>st01</code>).',
          ],
          verwechslung: 'Leere Zelle und fehlender Wert mit Grund: Eine leer gelassene Zelle wird in R ein <code>NA</code> ohne Grund. Niemand weiß dann, ob die Person nicht geantwortet hat oder nicht gefragt wurde.',
          zusatz: 'In RStudio stehen die Anzahlen im Viewer in der Spalte Freq.' })] },
      { id: 'a3-2', art: 'erledigt', titel: 'Mit allen Befragten vergleichen', haken: 'Im Journal getauscht und ausgeführt',
        text: 'Tausch in deinem Block aus Schritt 2 die markierte Stelle <code>papier</code> gegen <code>allbus</code> und führ ihn noch einmal aus. Wie oft steht −42 bei <code>pa01</code> jetzt?',
        mehr: [denk('Woran sehe ich, dass es geklappt hat?', { grund: 'k3-vergleich',
          kurz: 'Du tauschst nur die markierte Stelle: <code>allbus</code> statt <code>papier</code>. Damit zählt das Codebuch alle Befragten. Die Papierbögen sind ein Teil davon: Jede Zelle, die bei <code>papier</code> gezählt wird, zählt bei <code>allbus</code> mit.',
          denken: [
            'Prüf oben: Steht dort „Observations: 5246“, zählt das Codebuch alle Befragten.',
            'Such bei <code>pa01</code> wieder die Zeile −42 und lies die Zahl hinter „n =“.',
            'Leg sie neben die Zahl aus Schritt 2. Der Unterschied sind genau die Fälle aus Interview und online. Wie groß ist er?',
          ],
          verwechslung: 'Dieselbe Zeile heißt nicht dasselbe: „n = …“ unter <code>papier</code> zählt nur Papierbögen, unter <code>allbus</code> alle. Schau zuerst nach „Observations“, bevor du eine Zahl abschreibst.',
          zusatz: 'Führ immer den ganzen Block aus. Läuft nur die Zeile mit <code>codebook()</code>, ohne dass <code>papier</code> vorher angelegt wurde, meldet R „object \'papier\' not found“.' })] },
      { id: 'a3-3', art: 'erledigt', titel: 'Nicht gefragt zählen', haken: 'Im Journal zurückgetauscht und gezählt', baustein: 'Versionen',
        text: 'Zurück zu den Papierbögen: Trag im Journal wieder <code>papier</code> ein und führ den Block noch einmal aus. Wie oft steht −11 TNZ: SPLIT bei <code>st01</code>, wie oft bei <code>pt03</code>? Zähl beide zusammen und vergleiche mit der Zahl der Papierbögen aus Aufgabe 1.',
        mehr: [denk('Was heißt TNZ: SPLIT?', { grund: 'k3-split',
          kurz: 'Online und auf Papier gab es zwei Fragebogenversionen, A und B; manche Fragen standen nur in einer davon. Wer eine Frage gar nicht bekommen hat, bekommt dafür im Datensatz einen eigenen Code. Welcher das ist, steht im Codebuch bei den Wertelabels.',
          denken: [
            'Trag wieder <code>papier</code> ein und prüf oben bei „Observations“: Zählt das Codebuch die Papierbögen?',
            'Lies bei <code>st01</code> und bei <code>pt03</code> die Zeile −11 ab, jeweils hinter „n =“.',
            'Zähl beide zusammen und vergleiche mit der Zahl der Papierbögen aus Aufgabe 1.',
            'Frag dich: Fehlen dieselben Personen bei beiden Fragen, oder fehlt jede nur bei einer?',
          ],
          verwechslung: '„Fehlt“ und „verweigert“: −9 KEINE ANGABE heißt gefragt, aber nicht geantwortet. Wer eine Frage nicht auf seinem Bogen hatte, wurde nicht gefragt.' })] },
      { id: 'a3-4', art: 'fragen', titel: 'Ergebnis festhalten', fragen: Q('a3'),
        mehr: [denk('Wo lese ich das ab?', { grund: 'k3-ergebnis',
          kurz: 'Du brauchst Zahlen aus zwei Ausgaben: einmal mit <code>papier</code>, einmal mit <code>allbus</code>. Bevor du eine Zahl abschreibst, schau oben nach „Observations“.',
          denken: [
            '<b>−42 bei <code>pa01</code>, Papier und alle:</b> dieselbe Zeile in beiden Ausgaben, hinter „n =“.',
            '<b>Wo Mehrfachnennungen vorkommen:</b> Vergleiche die beiden Zahlen. Wie viele bleiben für Interview und online übrig?',
            '<b>−11 bei <code>st01</code> und bei <code>pt03</code>:</b> die Ausgabe mit <code>papier</code>, Zeile −11 bei der jeweiligen Variable.',
            '<b>Was die Summe heißt:</b> Denk an die zwei Fragebogenversionen und daran, was „nicht gefragt“ von „nicht geantwortet“ unterscheidet.',
          ],
          verwechslung: 'Die Fragen zu −11 meinen die Papierbögen. Nimm dafür die Ausgabe mit <code>papier</code>, nicht die mit <code>allbus</code>; das verrät dir die Zahl bei „Observations“.' })] },
    ],
    plenum: 'Im ganzen ALLBUS steht −42 in 638 Zellen, und 357 der 1.656 Papierbögen haben mindestens eine Mehrfachnennung. Online und im Interview gibt es keine. Was heißt das, wenn du später nur gültige Antworten auswertest: Wessen Antworten fallen häufiger weg? Und wäre es besser gewesen, beim Abtippen eines der zwei Kreuze zu nehmen? Bringt eine Begründung mit.',
    ohneGrafik: 'Alle Zahlen stehen als Text in der R-Ausgabe; das Bild zu den zwei Versionen hat eine Textfassung.' },

  { id: 'a4', n: 4, titel: 'Drei Typen auf einer Bauplatte', pflicht: false, grund: 'g4',
    frage: 'Welche Zahlen im ALLBUS sind Antworten, welche nur Namen?',
    ziel: 'du kannst in der Ausgabe von R den Datentyp eines Turms ablesen und begründen, warum man mit einer Kennnummer nicht rechnet, obwohl sie eine Zahl ist.',
    schritte: [
      { id: 'a4-p', art: 'festlegen', titel: 'Erst festlegen',
        vorhersage: P('a4', 'Nein: Die Kennnummer benennt Befragte und misst nichts. Typ und Bedeutung sind zweierlei.'),
        mehr: [denk('Wie lege ich mich fest?', { grund: 'k4-bedeutung',
          kurz: 'Jede befragte Person hat im ALLBUS eine Kennnummer. Du legst fest, ob man mit ihr rechnen darf, etwa einen Mittelwert bilden. Es zählt nicht, ob du richtig liegst: Deine Festlegung ist dein Vergleichspunkt für Schritt 3.',
          denken: [
            'Überleg, wozu eine Kennnummer da ist.',
            'Frag dich: Woran würdest du erkennen, ob man mit einer Zahl rechnen darf?',
            'Wähl eine Antwort. Ob sie trägt, siehst du in Schritt 3.',
          ] })] },
      { id: 'a4-1', art: 'code', titel: 'Typen ablesen', wk: ['a4'],
        text: 'Führ die Vorlage im Journal aus und schau in die Zeile unter den Namen der Türme: Dort steht unter jedem Namen in spitzen Klammern sein Typ.',
        mehr: [denk('Was sind respid, doi und mode?', { grund: 'k4-typen',
          kurz: 'In R hat jeder Turm einen <b>Datentyp</b>, kurz gesagt: was für Steine darin liegen. Drei begegnen dir im ALLBUS: Zahl (<code>&lt;dbl&gt;</code>), Text (<code>&lt;chr&gt;</code>) und Zahl mit Wertelabel (<code>&lt;dbl+lbl&gt;</code>). In der Ausgabe steht der Typ in spitzen Klammern unter dem Namen.',
          denken: [
            'Such die Zeile unter den Namen der Türme: Dort stehen die Typen, in derselben Reihenfolge wie die Namen.',
            'Geh zu <code>respid</code> (Kennnummer der befragten Person), <code>doi</code> und <code>mode</code> (Erhebungsweg aus Aufgabe 1). Was steht jeweils darunter?',
            'Achte auf den Zusatz <code>+lbl</code>: Er heißt „mit Wertelabel“.',
            'Schau in die Spalte <code>mode</code>: Was steht vor der eckigen Klammer, was darin?',
          ],
          bild: 'Typen', bildtext: 'Drei Datentypen als Steinfarben, an einer Beispiel-Bauplatte mit drei Personen.',
          zusatz: 'Ist das Fenster schmal, kürzt R Typen und Wörter mit „…“: <code>&lt;dbl+l&gt;</code> heißt <code>&lt;dbl+lbl&gt;</code>.' })] },
      { id: 'a4-2', art: 'fragen', titel: 'Ergebnis festhalten', fragen: Q('a4'),
        mehr: [denk('Wo lese ich das ab?', { grund: 'k4-ergebnis',
          kurz: 'Die ersten drei Fragen liest du in der Ausgabe aus Schritt 2 ab, die letzten zwei begründest du. Dafür brauchst du zwei Gedanken aus Verstehen: was ein Typ sagt und was beim Umwandeln passiert.',
          denken: [
            '<b>Typ von <code>respid</code> und <code>doi</code>:</b> die Zeile unter den Namen, in derselben Reihenfolge wie die Namen.',
            '<b>Zelle in <code>mode</code>:</b> Was bedeutet die Zahl vor der eckigen Klammer, was das Wort darin? Den Code kennst du aus Aufgabe 1.',
            '<b>Mittelwert von <code>respid</code>:</b> Frag dich, was ein Mittelwert aller Kennnummern über die Befragten aussagen würde.',
            '<b>Nach dem Umwandeln:</b> Schau in Verstehen auf den Zustand „Aufkleber wird zum Wert“ in der Karte „Umwandeln“.',
          ],
          verwechslung: 'Umwandeln und Umkodieren: Umwandeln ändert nur die Form, nicht die Antworten.' })] },
    ],
    ohneGrafik: 'Alle Typen stehen als Text in der Ausgabe von R, in spitzen Klammern unter den Namen der Türme.' },
];

/* ---------- Weiter, wenn du magst ---------- */
const FREI = {
  a1: [
    { stufe: 'Abwandeln', text: 'Ergeben die drei Wege zusammen wirklich alle 5.246 Befragten, oder fehlt jemand? Die Interviews (2.003) und die Papierbögen kennst du schon.', tipp: 'Die Online-Befragten haben den Code 3 (CAWI):<pre>' + esc(T.frei_a1.code.trim()) + '</pre>Zähl dann die drei Zahlen zusammen.' },
    { stufe: 'Eigene Frage', text: 'Wie viele Befragte leben in den neuen Bundesländern?', tipp: 'Schlag zuerst nach, welcher Code in <code>eastwest</code> dafür steht: <code>codebook(allbus, eastwest)</code>. Dann behältst du mit <code>filter()</code> nur diese Reihen.' },
  ],
  a2: [
    { stufe: 'Abwandeln', text: 'Wie ist der Familienstand gespeichert, und gibt es dort eine Rangfolge?', tipp: '<pre>' + esc(T.frei_a2.code.trim()) + '</pre>Lies die Wertelabels: Ergibt eine höhere Zahl hier „mehr“?' },
    { stufe: 'Erweitern', text: 'Schlag eine Frage nach, deren Skala nur an den Enden beschriftet ist, etwa die Lebenszufriedenheit.', tipp: '<code>codebook(allbus, ls01)</code>: Zwischen 0 GANZ UNZUFRIEDEN und 10 GANZ ZUFRIEDEN steht nur „..“. Die Zahlen 1 bis 9 sprechen für sich.' },
    { stufe: 'Eigene Frage', text: 'Füll den Bogen für dich selbst aus: Welche vier Zahlen stünden in deiner Zeile?', tipp: 'Nimm die Ausgabe aus Schritt 3. Bei <code>age</code> ist die Zahl selbst der Wert.' },
  ],
  a3: [
    { stufe: 'Abwandeln', text: 'Gab es die zwei Versionen auch online, und im Interview?', tipp: '<pre>' + esc(T.frei_a3.code.trim()) + '</pre>Für das Interview tauschst du die 3 gegen die 2 (CAPI).' },
    { stufe: 'Erweitern', text: 'Wie oft steht −42 bei der Lebenszufriedenheit?', tipp: '<code>codebook(allbus, ls01)</code>, unter „Missing values“. Vergleiche mit <code>pa01</code>.' },
    { stufe: 'Eigene Frage', text: 'Welche Frage wird nur einem Teil der Befragten gestellt, weil eine Frage davor sie ausschließt?', tipp: 'Such im Codebuch nach −10 TNZ: FILTER, etwa bei den Arbeitsstunden: <code>codebook(allbus, dw15)</code>.' },
  ],
  a4: [
    { stufe: 'Abwandeln', text: 'Wie viele verschiedene Werte hat die Kennnummer respid?', tipp: '<pre>' + esc(T.frei_a4.code.trim()) + '</pre>Vergleiche mit der Zahl der Reihen von <code>allbus</code>.' },
    { stufe: 'Eigene Frage', text: 'Such eine Variable, bei der eine Zahl wirklich eine Menge misst, und eine, bei der sie nur benennt.', tipp: 'Das Alter misst Jahre, die Wahlabsicht benennt Parteien: <code>codebook(allbus, age, pv01)</code>. Achte auf die Wertelabels.' },
  ],
};

/* ---------- Eigene Schrittart: ein Schritt ohne eigene Vorlage, der im Journal erledigt wird ---------- */
/** Ändern oder Nachsehen im Journal (kein neuer Code-Block): ein Haken meldet den Schritt als erledigt. */
function erledigt(s, H) {
  const lab = document.createElement('label'); lab.className = 'erledigt';
  lab.innerHTML = `<input type="checkbox" ${H.S.fertig[s.id] ? 'checked' : ''}> ${H.esc(s.haken || 'Erledigt')}`;
  lab.querySelector('input').onchange = e => H.fertig(s.id, e.target.checked);
  return lab;
}

return { TASKS, FREI, typen: { erledigt } };
};
