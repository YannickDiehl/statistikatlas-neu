/* Kapitel 2 „Vom Fragebogen zum Datensatz“: Aufgaben, Zusatzinfos und eine eigene Schrittart für die Lernpfad-Engine.
   Wird nach daten.js geladen; die Engine ruft window.KAPITEL(hilfen) einmal auf. */
'use strict';
window.KAPITEL = ({ D, T, esc, warum }) => {

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
        vorhersage: P('a1', 'Knapp ein Drittel: 1.656 von 5.246 Befragten (31,6 %) haben auf Papier geantwortet. Jede dieser Zeilen hat jemand abgetippt.') },
      { id: 'a1-1', art: 'code', titel: 'Die Bauplatte anzeigen', wk: ['a1a'],
        text: 'Führst du nur den Namen eines Objekts aus, zeigt R es an. Die erste Zeile der Ausgabe verrät die Größe: erst die Reihen, dann die Türme.',
        baustein: 'Ausgabe',
        mehr: [warum('Was steht in der Ausgabe?', 'Unter der ersten Zeile stehen die Namen der ersten Türme und in spitzen Klammern ihr Typ (mehr dazu in Aufgabe 4). Die Reihen zeigt R nur zum Teil, der Rest steht in den letzten Zeilen („more rows“, „more variables“). R schreibt Tausender mit Komma: 5,246 heißt 5.246. Im Environment steht derselbe Datensatz mit seiner Größe.', 'k1-ausgabe')] },
      { id: 'a1-2', art: 'code', titel: 'Nachschlagen', wk: ['a1b'],
        text: 'Schlag nach, welcher Code in <code>mode</code> für den Papierbogen steht. MAIL heißt: Papierbogen per Post.',
        mehr: [warum('Und PAPI?', 'Unter <code>Values</code> steht, welche Codes wirklich vorkommen. PAPI (Code 1, ein älterer Papier-Interviewweg) steht im Codebuch, kommt 2023 aber nicht vor.', 'k1-nachschlagen')] },
      { id: 'a1-3', art: 'code', titel: 'Nur die Papierbögen behalten', wk: ['a1c'], neu: true,
        text: 'Die Vorlage behält im Moment nur die Interviews (Code 2). Tausch im Journal die markierte <mark>2</mark> gegen den Code für Papierbögen aus Schritt 3 und führ sie aus. Lies in der ersten Zeile der Ausgabe ab, wie groß die neue Bauplatte ist.',
        mehr: [warum('Was heißt ==?', '<code>auswahl</code> ist ein neuer Name für das Ergebnis; <code>allbus</code> bleibt dabei unverändert. Mit <code>==</code> fragt R in jeder Reihe: Steht in <code>mode</code> dieser Code? Ein einzelnes <code>=</code> meldet einen Fehler („Did you mean <code>mode == …</code>?“).', 'k1-filter')] },
      { id: 'a1-4', art: 'fragen', titel: 'Ergebnis festhalten', fragen: Q('a1') },
    ],
    ohneGrafik: 'Alle Antworten stehen als Text in der R-Ausgabe; das Bild zum Aufbau der Ausgabe hat eine Textfassung.' },

  { id: 'a2', n: 2, titel: 'Ein Bogen wird zur Zeile', pflicht: true, grund: 'g2',
    frage: 'Welche Zahlen stehen in der Zeile dieser Person?',
    ziel: 'du hast aus einem ausgefüllten Papierbogen eine Zeile mit vier Codes gemacht und kannst begründen, warum ein höherer Code nicht immer „mehr“ bedeutet.',
    info: 'Vor dir liegt gleich ein ausgefüllter Papierbogen. Die Antworten sind ausgedacht; so einen Bogen gibt es im ALLBUS nicht. Mach daraus eine Zeile, wie sie im ALLBUS stehen würde. Welcher Code zu welchem Wertelabel gehört, steht im Codebuch.',
    schritte: [
      { id: 'a2-p', art: 'festlegen', titel: 'Erst festlegen',
        vorhersage: P('a2', 'Ohne Codebuch lässt es sich nicht wissen. Bei `ep03` beginnt die Skala mit 1 = SEHR GUT, „schlecht“ ist 4.') },
      { id: 'a2-1', art: 'erledigt', titel: 'Den Bogen ansehen', baustein: 'Bogen', haken: 'Bogen angesehen',
        text: 'Aus diesem Bogen machst du eine Zeile. Unter dem Bogen stehen die Namen der vier Variablen im ALLBUS.' },
      { id: 'a2-2', art: 'code', titel: 'Vier Variablen nachschlagen', wk: ['a2'],
        text: 'Die Vorlage zeigt für jede der vier Variablen einen Eintrag aus dem Codebuch: was gefragt wurde, welche Codes vorkommen und welches Wertelabel zu welchem Code gehört.',
        mehr: [warum('Wo steht was im Eintrag?', '<code>Label</code> ist das Variablenlabel (was gefragt wurde), <code>Values</code> zeigt die gültigen Codes, <code>Value labels</code> die Wertelabels, <code>Missing values</code> die fehlenden Werte mit Grund.', 'k2-eintrag')] },
      { id: 'a2-3', art: 'erledigt', titel: 'Vom Wort zum Code', haken: 'Zu jeder Antwort den Code gefunden',
        text: 'Such zu jeder Antwort auf dem Bogen das passende Wertelabel in deiner Ausgabe und nimm die Zahl davor. Achte auf die Richtung der Skala. Steht bei einer Variable kein Wertelabel für die Antwort, ist die Zahl selbst der Wert. Die vier Zahlen trägst du in Schritt 6 ein.',
        mehr: [warum('Und wenn das Wort anders klingt?', 'Der ALLBUS schreibt Wertelabels in Großbuchstaben und Umlaute als ae, oe, ue. Auf dem Bogen steht oft ein ganzer Satz, im Codebuch ein kurzes Wort. Such nach dem, was gemeint ist.', 'k2-zuordnen')] },
      { id: 'a2-4', art: 'lesen', titel: 'Deuten: Menge oder Name?',
        text: 'Lies deine fertige Zeile: Welche Zahl sagt etwas über eine Menge, welche ist nur ein Name? Dazu gehört die letzte Frage in Schritt 6.',
        mehr: [warum('Codes sind Namen', 'Codes für Kategorien sind wie Rückennummern: Sie benennen, sie zählen nichts ab. Ob eine Reihenfolge gilt, sagt das Wertelabel, nicht die Zahl.', 'k2-namen')] },
      { id: 'a2-5', art: 'fragen', titel: 'Ergebnis festhalten', fragen: Q('a2') },
    ],
    plenum: 'Optional: Hättet ihr „keiner dieser Schichten“ angekreuzt, stünde dort −50, ein fehlender Wert, obwohl die Person geantwortet hat. Ist das richtig so? Bringt eine Begründung mit.',
    ohneGrafik: 'Auf dem Bogen steht: Frage 1 Alter (<code>age</code>): 19 Jahre. Frage 2 Schulabschluss (<code>educ</code>): angekreuzt „Ich gehe noch zur Schule“. Frage 3 eigene wirtschaftliche Lage (<code>ep03</code>): angekreuzt „schlecht“. Frage 4 Schicht (<code>id02</code>): angekreuzt „Arbeiterschicht“. Alle Codes stehen als Text in der R-Ausgabe.' },

  { id: 'a3', n: 3, titel: 'Was nur auf Papier passiert', pflicht: true, grund: 'g3',
    frage: 'Welche fehlenden Werte gibt es im ALLBUS nur, weil es Papierbögen gibt?',
    ziel: 'du kannst sagen, wie der ALLBUS zwei Kreuze und nicht gestellte Fragen speichert, und mit Zahlen aus R begründen, warum „fehlt“ nicht gleich „fehlt“ ist.',
    info: 'Einen Papierbogen füllt man anders aus als einen Online-Fragebogen oder ein Interview mit Laptop. Und auf Papier wie online gab es zwei Fragebogenversionen, A und B. Beides hinterlässt Spuren in den fehlenden Werten. Du schaust dir drei Fragen an: die Links-rechts-Einstufung <code>pa01</code> (1 = links, 10 = rechts), das Vertrauen zu Mitmenschen <code>st01</code> und das Vertrauen in den Bundestag <code>pt03</code>.',
    schritte: [
      { id: 'a3-p', art: 'festlegen', titel: 'Erst festlegen',
        vorhersage: P('a3', 'Nein, nie: Bei `pa01` steht −42 bei allen Befragten genauso oft wie auf Papier, 24-mal. Im Interview und online lässt sich nur ein Kästchen wählen.') },
      { id: 'a3-1', art: 'code', titel: 'Codebuch der Papierbögen', wk: ['a3'], bekannt: 'filter() aus Aufgabe 1',
        text: 'Die Vorlage behält nur die Papierbögen und schlägt drei Fragen im Codebuch nach. Führ sie im Journal so aus, wie sie ist, und schau bei jeder Frage unter „Missing values“.',
        mehr: [warum('Wo stehen die Anzahlen?', 'Das Codebuch zählt jetzt nur die Papierbögen; oben bei „Observations“ steht, wie viele es sind. Die Anzahl eines Codes steht hinter „n =“. Steht dort keine, kommt der Code in dieser Auswahl nicht vor (wie −8 bei st01). In RStudio stehen die Anzahlen im Viewer in der Spalte Freq.', 'k3-gruende')] },
      { id: 'a3-2', art: 'erledigt', titel: 'Mit allen Befragten vergleichen', haken: 'Im Journal getauscht und ausgeführt',
        text: 'Tausch in deinem Block aus Schritt 2 die markierte Stelle <code>papier</code> gegen <code>allbus</code> und führ ihn noch einmal aus. Wie oft steht −42 bei <code>pa01</code> jetzt?',
        mehr: [warum('Woran sehe ich, dass es geklappt hat?', 'Oben muss jetzt „Observations: 5246“ stehen: Das Codebuch zählt alle Befragten.', 'k3-vergleich')] },
      { id: 'a3-3', art: 'erledigt', titel: 'Nicht gefragt zählen', haken: 'Im Journal zurückgetauscht und gezählt', baustein: 'Versionen',
        text: 'Zurück zu den Papierbögen: Trag im Journal wieder <code>papier</code> ein und führ den Block noch einmal aus. Wie oft steht −11 TNZ: SPLIT bei <code>st01</code>, wie oft bei <code>pt03</code>? Zähl beide zusammen und vergleiche mit der Zahl der Papierbögen aus Aufgabe 1.',
        mehr: [warum('Was heißt TNZ: SPLIT?', 'TNZ heißt „trifft nicht zu“: Die Person wurde nicht gefragt, weil die Frage nur in der anderen Fragebogenversion stand. Das ist etwas anderes als jemand, der nicht antworten wollte.', 'k3-split')] },
      { id: 'a3-4', art: 'fragen', titel: 'Ergebnis festhalten', fragen: Q('a3') },
    ],
    plenum: 'Im ganzen ALLBUS steht −42 in 638 Zellen, und 357 der 1.656 Papierbögen haben mindestens eine Mehrfachnennung. Online und im Interview gibt es keine. Was heißt das, wenn du später nur gültige Antworten auswertest: Wessen Antworten fallen häufiger weg? Und wäre es besser gewesen, beim Abtippen eines der zwei Kreuze zu nehmen? Bringt eine Begründung mit.',
    ohneGrafik: 'Alle Zahlen stehen als Text in der R-Ausgabe; das Bild zu den zwei Versionen hat eine Textfassung.' },

  { id: 'a4', n: 4, titel: 'Drei Typen auf einer Bauplatte', pflicht: false, grund: 'g4',
    frage: 'Welche Zahlen im ALLBUS sind Antworten, welche nur Namen?',
    ziel: 'du kannst in der Ausgabe von R den Datentyp eines Turms ablesen und begründen, warum man mit einer Kennnummer nicht rechnet, obwohl sie eine Zahl ist.',
    schritte: [
      { id: 'a4-p', art: 'festlegen', titel: 'Erst festlegen',
        vorhersage: P('a4', 'Nein: Die Kennnummer benennt Befragte und misst nichts. Typ und Bedeutung sind zweierlei.') },
      { id: 'a4-1', art: 'code', titel: 'Typen ablesen', wk: ['a4'],
        text: 'Führ die Vorlage im Journal aus und schau in die Zeile unter den Namen der Türme: Dort steht unter jedem Namen in spitzen Klammern sein Typ.',
        mehr: [warum('Was sind respid, doi und mode?', '<code>respid</code> ist die Kennnummer der befragten Person, <code>doi</code> die Internetadresse des Datensatzes, <code>mode</code> der Erhebungsweg aus Aufgabe 1. Ist das Fenster schmal, kürzt R Typen und Wörter mit „…“: <code>&lt;dbl+l&gt;</code> heißt <code>&lt;dbl+lbl&gt;</code>.', 'k4-typen')] },
      { id: 'a4-2', art: 'fragen', titel: 'Ergebnis festhalten', fragen: Q('a4') },
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
