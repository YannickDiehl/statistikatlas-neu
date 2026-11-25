/* Kapitel 8 „Index und Skala“: Aufgaben, Zusatzinfos und eine eigene Schrittart für die Lernpfad-Engine.
   Wird nach daten.js geladen; die Engine ruft window.KAPITEL(hilfen) einmal auf. */
'use strict';
window.KAPITEL = ({ D, T, esc, warum }) => {

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

const RSTUDIO = warum('Lieber in RStudio?', 'Dann führst du dort vorher den Startblock aus (Pakete laden, ALLBUS einlesen). Danach kopierst du die Vorlage mit <b>Kopieren</b> in dein Skript.<pre>' + esc(T.start.code) + '</pre>', 'r1');

/* ---------- Aufgaben ---------- */
const TASKS = [
  { id: 'a1', n: 1, titel: 'Wie populistisch denken die Befragten?', pflicht: true, grund: 'g1',
    frage: 'Wie misst man Populismus mit sieben Aussagen, und wer bekommt einen Wert?',
    ziel: 'du hast für jede befragte Person einen Populismus-Wert gebildet, weißt, wie viele Befragte einen Wert bekommen, und kannst den Mittelwert in Worten deuten.',
    info: 'Populismus heißt grob: Man sieht „das Volk“ als Einheit gegen eine abgehobene Elite und will, dass das Volk selbst entscheidet. Der ALLBUS 2023 hat dazu sieben Aussagen gestellt (nur in einem Teil der Fragebögen). Antworten: 1 stimme voll zu, 2 stimme eher zu, 3 teils/teils, 4 lehne eher ab, 5 lehne ganz ab.'
      + aussagen(D.PA_ITEMS, 'Die sieben Populismus-Aussagen'),
    infoMehr: [warum('Mit oder ohne Gewicht?', 'Wie seit Sitzung 6 rechnest du Aussagen über alle Menschen in Deutschland gewichtet: Mittelwerte und Anteile eines Index mit <code>weights = wghtpew</code>. Zwei Dinge rechnest du heute ohne Gewicht: wie stimmig die Fragen sind (Cronbachs α) und wie viele Befragte einen Indexwert bekommen. Beides beschreibt das Messinstrument und die Befragung selbst, nicht die Bevölkerung. Gewichtet ändert sich α kaum.', 'v1-gewicht')],
    schritte: [
      { id: 'a1-p', art: 'festlegen', titel: 'Erst festlegen',
        vorhersage: { ...D.PREDICTIONS.a1, aufloesung: 'Der gewichtete Mittelwert liegt bei 2,646, also unter 3: Im Mittel stimmen die Befragten den Aussagen eher zu.' } },
      { id: 'a1-1', art: 'code', titel: 'Index bilden: Wer bekommt einen Wert?', wk: ['a1'], neu: true, bekannt: 'describe() aus Sitzung 3',
        text: 'Die Vorlage bildet für jede befragte Person den Mittelwert ihrer sieben Antworten. Sie verlangt alle sieben (<code>min_valid = 7</code>). Führ sie im Journal aus und lies in der Spalte <b>N</b>, wie viele Befragte einen Wert bekommen.',
        mehr: [RSTUDIO,
          warum('Was macht row_means()?', 'Bisher hat jede Funktion einen Turm angeschaut. <code>row_means()</code> rechnet quer dazu: Es nimmt aus jeder Reihe die Antworten auf die Fragen in <code>pick()</code> und bildet ihren Mittelwert. <code>min_valid</code> sagt, wie viele gültige Antworten jemand mindestens braucht; sonst bleibt der Wert leer (NA).', 'v1b'),
          warum('Warum hier ohne Gewicht?', 'Wie viele Befragte einen Wert bekommen, beschreibt die Befragung selbst, nicht die Bevölkerung. Personen zählst du darum ohne Gewicht. Mit Gewicht stünde bei N die Summe der Gewichte.', 'v1-gewicht')] },
      { id: 'a1-2', art: 'aendern', titel: 'Weniger streng: mindestens fünf Antworten', block: 'a1-1', baustein: 'MinValid',
        text: 'Wer eine oder zwei der sieben Aussagen nicht beantwortet hat, soll trotzdem einen Wert bekommen. Ändere im Journal im Block aus Schritt 2 die gelb markierte <code>7</code> in <code>5</code> (mindestens fünf von sieben) und führ den Block erneut aus. Wie viele Befragte bekommen jetzt einen Wert?',
        mehr: [warum('Wie streng soll min_valid sein?', 'Eine verbreitete Faustregel: mindestens zwei Drittel der Items (bei vier Items 3, bei sieben 5); lockerer: mehr als die Hälfte (bei sieben 4). Wichtig ist, dass du die Regel nennst.', 'v1-streng')] },
      { id: 'a1-3', art: 'code', titel: 'Mittelwert für alle: mit Gewicht', wk: ['a1w'], bekannt: 'weights = wghtpew aus Sitzung 6',
        text: 'Jetzt die Aussage über die Bevölkerung: Wie populistisch sind die Befragten im Mittel? Dafür rechnest du mit Gewicht. Die Vorlage baut den Index wie in Schritt 2, gleich mit <code>min_valid = 5</code>. Lies die Spalte <b>Mean</b>.',
        mehr: [warum('Warum steht bei N eine andere Zahl?', '<code>describe()</code> mit Gewicht zählt bei N die Gewichte zusammen (kennst du aus Sitzung 6). Wie viele Personen einen Wert bekommen, siehst du ohne Gewicht, wie in Schritt 2 und 3.', 'v1-gewicht')] },
      { id: 'a1-4', art: 'lesen', titel: 'Deuten: Was heißt der Mittelwert?',
        text: 'Was heißt der Mittelwert in Worten? Achte auf die Richtung der Antworten: 1 heißt „stimme voll zu“, 5 „lehne ganz ab“. Liegt der Wert näher an 1 oder an 5, und was bedeutet das für die Aussagen?',
        mehr: [warum('Woher kommt die Richtung?', 'Die Richtung eines Index ergibt sich aus den Items, nicht aus dem Wort „Index“. Schau immer nach, wofür die 1 steht.', 'v1c')] },
      { id: 'a1-5', art: 'fragen', titel: 'Ergebnis festhalten', fragen: Q('a1') },
    ],
    ohneGrafik: 'Alle Zahlen stehen in den Ausgaben von Schritt 2, 3 und 4. Das Bild in Schritt 3 hat eine Textfassung.' },

  { id: 'a2', n: 2, titel: 'Messen die sieben Aussagen dasselbe?', pflicht: true, grund: 'g2',
    frage: 'Darf man die sieben Populismus-Aussagen zu einem Index zusammenfassen, und passt jede dazu?',
    ziel: 'du kannst sagen, wie stimmig die sieben Aussagen sind (Cronbachs α), welche am schwächsten zu den anderen passt, und begründen, ob sie im Index bleiben soll.',
    info: 'In Aufgabe 1 hast du aus den sieben Aussagen pa29 bis pa35 einen Index gebildet. Ob das erlaubt ist, prüfst du jetzt.',
    infoMehr: [warum('Die sieben Aussagen', aussagen(D.PA_ITEMS, 'Die sieben Populismus-Aussagen') + '<p style="margin:8px 0 0">Antworten: 1 stimme voll zu, 2 stimme eher zu, 3 teils/teils, 4 lehne eher ab, 5 lehne ganz ab.</p>')],
    schritte: [
      { id: 'a2-p', art: 'festlegen', titel: 'Erst festlegen',
        vorhersage: { ...D.PREDICTIONS.a2, aufloesung: 'Am schwächsten passt pa29 („Abgeordnete nur dem Volk verpflichtet“) zu den anderen: Ihre Trennschärfe ist 0,348, alle anderen liegen zwischen 0,545 und 0,682.' } },
      { id: 'a2-1', art: 'code', titel: 'Stimmigkeit berechnen', wk: ['a2'], neu: true, bekannt: 'summary() aus Sitzung 7',
        text: 'Führ die Vorlage im Journal aus. Oben steht Cronbachs α, unten unter „Item-Total Statistics“ je Aussage eine Zeile. Such die Aussage mit der schwächsten Trennschärfe (Spalte Corrected Item-Total).',
        mehr: [warum('Was ist Cronbachs α?', 'α fasst zusammen, wie eng die Items zusammenhängen: wie stimmig sie gemeinsam messen (Reliabilität). Faustregel: ab 0,7 annehmbar, ab 0,8 gut. α steigt aber auch mit der Zahl der Items und sagt nichts über die Validität.', 'v2b'),
          warum('Wo steht was in der Ausgabe?', 'Oben unter „Reliability Statistics“ steht Cronbach\'s Alpha, darunter das standardisierte α und McDonalds ω. Ganz unten unter „Item-Total Statistics“ stehen je Item die Trennschärfe (Corrected Item-Total) und α ohne dieses Item (Alpha if Deleted). Dazwischen stehen „Item Statistics“ und die Korrelationstabelle; die brauchst du heute nicht.', 'v2c')] },
      { id: 'a2-2', art: 'code', titel: 'Gegenprobe ohne eine Aussage', wk: ['a2ohne'],
        text: 'Prüf nach, was „Alpha if Deleted“ bedeutet: Lösch in der Vorlage im Journal die markierte Aussage samt Komma und führ sie erneut aus.',
        mehr: [warum('Warum ändert sich N?', 'N ist jetzt 3441 statt 3427: Ohne die gelöschte Aussage zählen auch die 14 Befragten mit, die nur sie nicht beantwortet haben. <code>reliability()</code> rechnet nur mit Befragten, die alle genannten Aussagen beantwortet haben. α ist trotzdem dasselbe wie in „Alpha if Deleted“.', 'v2-gegenprobe')] },
      { id: 'a2-3', art: 'lesen', titel: 'Deuten: Soll die schwächste Aussage raus?',
        text: 'Soll die Aussage mit der schwächsten Trennschärfe aus dem Index? Denk an den Inhalt der Aussage: Gehört sie zum Begriff Populismus? Und überleg, wie viel α ohne sie gewinnt.',
        mehr: [warum('Was sagen die Faustregeln, was nicht?', 'Die Grenzen 0,7 oder 0,8 sind Gewohnheiten, keine Naturgesetze. Ein Item zu streichen, nur weil α dann etwas steigt, ist keine gute Regel: Wer Items streicht, verengt den Begriff.', 'v2-behalten')] },
      { id: 'a2-4', art: 'fragen', titel: 'Ergebnis festhalten', fragen: Q('a2') },
      { id: 'a2-5', art: 'nachher', titel: 'Im Bild: α ohne jede Aussage', baustein: 'AlphaOhne',
        text: 'Erst nach dem Prüfen: Das Bild zeigt für jede der sieben Aussagen, wie hoch α ohne sie wäre. Vergleich es mit deinen Antworten.',
        mehr: [warum('Wie lese ich das Bild?', 'Die gestrichelte Linie ist α mit allen sieben Aussagen. Ein Balken, der darüber hinausreicht, heißt: Ohne diese Aussage wäre α höher. Die Achse beginnt nicht bei 0, damit die kleinen Unterschiede sichtbar sind.', 'v2-gegenprobe')] },
    ],
    plenum: 'Würdet ihr pa29 im Index behalten? Bringt ein Argument für Behalten und eins für Streichen mit.',
    ohneGrafik: 'Alle Zahlen stehen in den Ausgaben von Schritt 2 und Schritt 3. Das Bild in Schritt 6 hat eine Textfassung.' },

  { id: 'a3', n: 3, titel: 'Andersherum gefragt: Einstellungen zu Islam und Muslimen', pflicht: true, grund: 'g3',
    frage: 'Wie fasst man sechs Aussagen, die in verschiedene Richtungen gestellt sind, richtig zu einem Index zusammen?',
    ziel: 'du hast die andersherum gestellten Aussagen erkannt und umgepolt und kannst sagen, wie sich Cronbachs α dadurch verändert und wofür ein hoher Wert jetzt steht.',
    info: 'Der ALLBUS 2023 misst in einem Teil der Fragebögen mit sechs Aussagen, wie Menschen in Deutschland zum Islam und zu Muslimen eingestellt sind. Solche Fragen sind in der Einstellungsforschung üblich, um Vorbehalte und Offenheit in der Bevölkerung zu beschreiben. Die Befragten sagen zu jeder Aussage, wie sehr sie zustimmen: von 1 „stimme gar nicht zu“ bis 7 „stimme voll und ganz zu“; dazwischen stehen nur Zahlen. Die Aussagen sind Fragen aus dem Fragebogen, keine Feststellungen dieses Kurses. Ob sie zutreffen, ist hier nicht die Frage: Du prüfst nur, wie man sie richtig zu einem Index zusammenfasst. Sinngemäß nach den Variablenlabels:'
      + aussagen(D.MM_ITEMS, 'Die sechs Aussagen zu Islam und Muslimen'),
    schritte: [
      { id: 'a3-p', art: 'festlegen', titel: 'Erst festlegen',
        vorhersage: { ...D.PREDICTIONS.a3, aufloesung: 'Andersherum gestellt sind mm02 und mm05: Bei ihnen drückt Zustimmung eine offene Haltung aus, bei den anderen vier Vorbehalte.' } },
      { id: 'a3-1', art: 'code', titel: 'Stimmigkeit, so wie gefragt', wk: ['a3'], bekannt: 'reliability() aus Aufgabe 2',
        text: 'Die Vorlage rechnet α mit den sechs Aussagen so, wie sie im Datensatz stehen. Führ sie im Journal aus und schau auf α und auf die Spalte Corrected Item-Total.',
        mehr: [warum('Woran erkenne ich ein falsch gepoltes Item?', 'An einer negativen Trennschärfe: Das Item läuft gegen die anderen. Welche Items andersherum gefragt sind, sagt dir aber erst der Wortlaut. Darum zuerst lesen, dann rechnen.', 'v3b')] },
      { id: 'a3-2', art: 'code', titel: 'Umpolen und neu prüfen', wk: ['a3um'], bekannt: 'rec(…, rules = "rev") aus Sitzung 5',
        text: 'Die Vorlage baut mit <code>rec(…, rules = "rev")</code> zwei umgepolte Aussagen (Endung <code>_um</code>). Führst du sie so aus, ändert sich α noch nicht: In <code>reliability()</code> stehen noch die alten Aussagen. Tausch im Journal die beiden markierten Stellen gegen ihre umgepolte Fassung und führ die Vorlage erneut aus.',
        mehr: [warum('Was macht rules = "rev"?', 'Aus der kleinsten Zahl wird die größte und umgekehrt: auf der Skala von 1 bis 7 aus 1 eine 7, aus 2 eine 6. Die Wörter wandern mit. Fehlende Werte bleiben leer.', 'v3a'),
          warum('R meldet: „Column … doesn’t exist“?', 'Die umgepolte Variable gibt es nur in der Kette, die sie mit <code>mutate()</code> baut. Lass den <code>mutate()</code>-Teil stehen und führ den ganzen Block aus, nicht nur die letzte Zeile.', 'v3-um')] },
      { id: 'a3-3', art: 'lesen', titel: 'Deuten: Wofür steht eine hohe Zahl?',
        text: 'Wofür steht nach dem Umpolen eine hohe Zahl, bei allen sechs Aussagen? Lies dazu noch einmal die vier Aussagen, die du nicht umgepolt hast.',
        mehr: [warum('Warum die Richtung nennen?', 'Einen Index deutest du immer mit seiner Richtung: Wofür steht eine hohe Zahl? Ohne diese Angabe kann niemand einen Indexwert lesen.', 'v3-richtung')] },
      { id: 'a3-4', art: 'fragen', titel: 'Ergebnis festhalten', fragen: Q('a3') },
      { id: 'a3-5', art: 'nachher', titel: 'Im Bild: Trennschärfen vorher und nachher', baustein: 'VorherNachher',
        text: 'Erst nach dem Prüfen: Das Bild zeigt die Trennschärfen der sechs Aussagen vor und nach dem Umpolen, mit α. Vergleich es mit deinen Antworten.',
        mehr: [warum('Wie lese ich das Bild?', 'Jeder Balken ist die Trennschärfe einer Aussage. Ein Balken nach links (negativ) heißt: Diese Aussage läuft gegen die anderen. Unter jedem Teil steht Cronbachs α.', 'v3b')] },
    ],
    ohneGrafik: 'Alle Zahlen stehen in den Ausgaben von Schritt 2 und Schritt 3. Das Bild in Schritt 6 hat eine Textfassung.' },

  { id: 'a4', n: 4, titel: 'Im Schnitt oder durchgehend?', pflicht: false, grund: 'g4',
    frage: 'Wie viele Befragte sind „durchgehend“ populistisch, und wie viele nur im Schnitt?',
    ziel: 'du kannst sagen, wie viel Prozent drei Populismus-Aussagen allen zustimmen und wie viel Prozent ihnen im Schnitt zustimmen, und erklären, warum sich die beiden Zahlen unterscheiden.',
    info: 'In der Forschung wird diskutiert, ob Populismus wie ein Mittelwert gemessen werden darf: Kann Zustimmung bei einer Seite des Begriffs eine Ablehnung bei einer anderen ausgleichen? Du nimmst drei Aussagen, je eine für eine Seite des Populismus: pa31 (einfache Bürger statt Berufspolitiker: gegen die Elite), pa32 (Kompromiss ist Verrat: ein einiger Volkswille), pa33 (das Volk soll entscheiden). Zustimmung heißt hier 1 oder 2.',
    schritte: [
      { id: 'a4-p', art: 'festlegen', titel: 'Erst festlegen',
        vorhersage: { ...D.PREDICTIONS.a4, aufloesung: 'Allen drei Aussagen stimmen 14,2 % zu, im Schnitt stimmen 21,71 % zu: durchgehend sind es also 7,5 Prozentpunkte weniger.' } },
      { id: 'a4-1', art: 'code', titel: 'Zustimmungen zählen', wk: ['a4'], neu: true, bekannt: 'rec() aus Sitzung 5, frequency() mit Gewicht aus Sitzung 6',
        text: 'Die Vorlage baut zwei Indizes in einer Kette: <code>zustimmungen</code> zählt, wie vielen der drei Aussagen jemand zustimmt (0 bis 3), <code>kurz</code> ist der Mittelwert der drei Antworten. Führ sie im Journal aus: Sie zeigt die Zahl der Zustimmungen.',
        mehr: [RSTUDIO,
          warum('Was macht row_sums()?', 'Zuerst macht <code>rec()</code> aus jeder Aussage eine 0/1-Variable: 1 heißt zugestimmt (1 oder 2), 0 nicht. <code>row_sums(pick(…))</code> zählt die Einsen je Person. Mit <code>min_valid = 3</code> bekommt nur einen Wert, wer alle drei beantwortet hat.', 'v4-zaehlen')] },
      { id: 'a4-2', art: 'aendern', titel: 'Tauschen: der Mittelwertindex', block: 'a4-1',
        text: 'Ändere im Journal im Block aus Schritt 2 die gelb markierte Stelle <code>zustimmungen</code> in <code>kurz</code> und führ den Block erneut aus. Jetzt siehst du den Mittelwertindex. Er hat 13 mögliche Werte; R schreibt 1,33 als 1.33333333333333. „Im Schnitt Zustimmung“ heißt: Wert höchstens 2. Lies die Spalte Cum. % in der Zeile 2.',
        mehr: [warum('Was heißt Cum. %?', 'Cum. % zählt die Prozente von oben bis zu dieser Zeile zusammen. In der Zeile 2 stecken also alle Werte bis einschließlich 2: 1, 1,33, 1,67 und 2.', 'v4-kurz')] },
      { id: 'a4-3', art: 'lesen', titel: 'Deuten: Warum im Schnitt mehr?',
        text: 'Warum sind es im Schnitt mehr als durchgehend? Denk an Person A und B, und überleg, welche Antworten jemand haben kann, der im Schnitt höchstens 2 hat, aber nicht allen drei Aussagen zustimmt.',
        mehr: [warum('Person A und B', 'Person A antwortet 1, 1 und 4, Person B 2, 2 und 2. Beide haben den Mittelwert 2, also „im Schnitt Zustimmung“. Allen zugestimmt hat aber nur Person B: Person A lehnt die dritte Aussage ab.', 'v4a')] },
      { id: 'a4-4', art: 'fragen', titel: 'Ergebnis festhalten', fragen: Q('a4') },
    ],
    plenum: 'Ist jemand populistisch, der zwei Aussagen zustimmt, eine davon voll, und bei der dritten „teils/teils“ sagt? Welche Regel passt besser zum Begriff: Mittelwert oder „allen zugestimmt“?',
    ohneGrafik: 'Diese Aufgabe hat keine Grafik. Alle Zahlen stehen in den Ausgaben von Schritt 2 und Schritt 3.' },
];

/* ---------- Weiter, wenn du magst (aus den Probier-Werkstätten des Kapitels) ---------- */
const FREI = {
  a1: [
    { stufe: 'Abwandeln', text: 'Wie viele Befragte bekommen einen Wert, wenn du nur vier von sieben Antworten verlangst?', tipp: 'Setz in deinem Block aus Schritt 2 <code>min_valid = 4</code>. Nach der Zwei-Drittel-Regel ist 4 zu locker, nach „mehr als die Hälfte“ gerade noch erlaubt.' },
    { stufe: 'Eigene Frage', text: 'Unterscheiden sich Westen und Osten im Populismus-Index?', tipp: 'Bau den Index wie in Schritt 4 und häng statt <code>describe()</code> den t-Test aus Sitzung 7 an: <code>t_test(populismus, group = eastwest, weights = wghtpew) %&gt;% summary()</code>.' },
  ],
  a2: [
    { stufe: 'Abwandeln', text: 'Wie stimmig sind nur drei der sieben Aussagen?', tipp: '<code>reliability(pa31, pa32, pa33)</code>. Vergleich α mit dem Wert für alle sieben: Was macht die Zahl der Items mit α?' },
    { stufe: 'Eigene Frage', text: 'Wie stimmig sind die vier Fragen zu Geflüchteten (mp16 bis mp19)?', tipp: '<code>reliability(mp16, mp17, mp18, mp19) %&gt;% summary()</code>. Zeigen alle vier in dieselbe Richtung? Bei allen heißt 1 „Risiko überwiegt“.' },
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
