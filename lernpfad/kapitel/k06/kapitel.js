/* Kapitel 6 „Gewichtung und Zusammenhang“: Aufgaben, Zusatzinfos und eigene Schrittarten für die Lernpfad-Engine.
   Wird nach daten.js geladen; die Engine ruft window.KAPITEL(hilfen) einmal auf. */
'use strict';
window.KAPITEL = ({ D, T, esc, bild, warum, probier }) => {
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

const RSTUDIO = warum('Lieber in RStudio?', 'Dann führst du dort vorher den Startblock aus (Pakete laden, ALLBUS einlesen). Danach kopierst du die Vorlage mit <b>Kopieren</b> in dein Skript.<pre>' + esc(T.start.code) + '</pre>', 'r1');

/* ---------- Zusatzinfos mit Bild: Kapitel 6 hat keine bilder/ ---------- */
const BILD = {};

/* ---------- Aufgaben ---------- */
const TASKS = [
  { id: 'a1', n: 1, titel: 'Wie zufrieden ist Deutschland mit der Demokratie?', pflicht: true, grund: 'g1',
    frage: 'Wie viele Menschen in Deutschland sind mit der Demokratie zufrieden, und was ändert die Gewichtung daran?',
    ziel: 'du kannst sagen, wie viel Prozent mindestens etwas zufrieden sind, ohne und mit Gewicht, und erklären, warum die Zahl mit Gewicht anders ausfällt.',
    info: 'Der ALLBUS fragt nach der Zufriedenheit mit der Demokratie in Deutschland (<code>ps03</code>). Es gibt sechs Stufen: 1 sehr zufrieden, 2 ziemlich zufrieden, 3 etwas zufrieden, 4 etwas unzufrieden, 5 ziemlich unzufrieden, 6 sehr unzufrieden. Als „zufrieden“ zählen hier alle mit 1, 2 oder 3.',
    infoMehr: [warum('Warum fehlt fast ein Drittel?', 'Gut zwei Drittel der Befragten haben diese Frage bekommen. Die übrigen hatten eine andere Fragebogen-Variante und stehen bei den fehlenden Werten unter „TNZ: SPLIT“ (fehlende Werte kennst du aus Sitzung 3).', 'k1-cum')],
    schritte: [
      { id: 'a1-p', art: 'festlegen', titel: 'Erst festlegen', vorhersage: vor('a1') },
      { id: 'a1-1', art: 'code', titel: 'Ohne und mit Gewicht auszählen', wk: ['a1a'], neu: true, bekannt: 'Cum. % aus Sitzung 3',
        text: 'Die Vorlage zählt <code>ps03</code> zweimal aus: erst ohne, dann mit <code>weights = wghtpew</code>. Lies jeweils in der Spalte <b>Cum. %</b> die Zeile <b>3 ETWAS ZUFRIEDEN</b>. Cum. % zählt die Prozente von oben zusammen; in Zeile 3 steht also, wie viele 1, 2 oder 3 angegeben haben.',
        baustein: 'CumTabelle',
        mehr: [RSTUDIO,
          warum('Welche Tabelle ist gewichtet?', 'Die zweite. Sie trägt die Überschrift „Weighted Frequency Analysis Results“. Die Zahlen unter N sind dort keine Personen mehr, sondern Summen der Gewichte.', 'r1'),
          warum('Was macht das Gewicht?', 'Mit <code>weights = wghtpew</code> zählt eine Person aus dem Westen 1,22-fach, eine aus dem Osten 0,53-fach. Das gleicht aus, dass der ALLBUS den Osten absichtlich stärker befragt.', 'k1-gewicht')] },
      { id: 'a1-2', art: 'code', titel: 'In die Landesteile schauen', wk: ['a1b'], bekannt: 'filter() aus Sitzung 2',
        text: 'Die Vorlage zeigt den Osten (<code>eastwest == 2</code>), ohne und mit Gewicht. Hol sie ins Journal und führ sie aus. Dann tausch <b>im Journal</b> beide markierten Stellen gegen 1 (Westen) und führ den Block noch einmal aus. Beide Stellen müssen gleich sein.',
        mehr: [warum('Warum zwei markierte Stellen?', 'Die Kette steht zweimal da, einmal ohne und einmal mit Gewicht. Jede hat ihr eigenes <code>filter()</code>. Tauschst du nur eine Stelle, vergleichst du den Westen ohne Gewicht mit dem Osten mit Gewicht.', 'k1-landesteil')] },
      { id: 'a1-3', art: 'lesen', titel: 'Deuten',
        text: 'Vergleiche: Wie stark ändert das Gewicht die Zahl im Osten, wie stark für ganz Deutschland? Die Fragen im nächsten Schritt führen dich hin.',
        mehr: [warum('Wann ändert das Gewicht ein Ergebnis?', 'Nur wenn West und Ost zusammengezählt werden und sich unterscheiden. Mit Gewicht zählt der Westen mehr und der Osten weniger; das Ergebnis für Deutschland rückt näher an den Westen. Innerhalb eines Landesteils haben alle fast dasselbe Gewicht.', 'k1-mischung')] },
      { id: 'a1-4', art: 'fragen', titel: 'Ergebnis festhalten', fragen: Q('a1') },
    ],
    probier: { idee: 'Ändert die Gewichtung auch Mittelwert und Median?', code: T.frei_a1.code },
    ohneGrafik: 'Alle Antworten stehen in den Tabellen von <code>frequency()</code>. Die Beispieltabelle in Schritt 2 hat eine Textfassung.' },

  { id: 'a2', n: 2, titel: 'Zufriedenheit und Wahlabsicht', pflicht: true, grund: 'g2',
    frage: 'Hängt die Zufriedenheit mit der Demokratie damit zusammen, welche Partei jemand wählen würde?',
    ziel: 'du kannst mit Zeilenprozenten zeigen, in welchen Gruppen die Zufriedenheit hoch oder niedrig ist, und mit Cramér-V sagen, wie stark der Zusammenhang ist.',
    info: 'Die Wahlabsicht (<code>pv01</code>) fragt, welche Partei jemand bei einer Bundestagswahl wählen würde. Die Antworten: CDU-CSU, SPD, FDP, DIE GRUENEN, DIE LINKE, AFD, ANDERE PARTEI, WUERDE NICHT WAEHLEN. Wer nicht wahlberechtigt ist oder nichts angibt, fehlt. Die Zufriedenheit (<code>ps03</code>) teilst du wie in Aufgabe 1 in zwei Gruppen: zufrieden (1 bis 3) und unzufrieden (4 bis 6).',
    schritte: [
      { id: 'a2-p', art: 'festlegen', titel: 'Erst festlegen', vorhersage: vor('a2') },
      { id: 'a2-1', art: 'frage', titel: 'Skalenniveau bestimmen', frage: frage(D.QUESTIONS.a2[0]),
        text: 'Welches Skalenniveau hat die Wahlabsicht? Davon hängt ab, welches Maß passt.',
        mehr: [warum('nominal, ordinal, metrisch', 'Frag nach der Reihenfolge und nach den Abständen. Keine Reihenfolge: nominal. Reihenfolge, aber keine gleichen Abstände: ordinal. Gleiche Abstände: metrisch.', 'k2-niveau')] },
      { id: 'a2-2', art: 'code', titel: 'Kreuztabelle mit Zeilenprozenten', wk: ['a2b'], bekannt: 'mutate() mit rec() und crosstab() aus Sitzung 5',
        text: 'Die Kette bildet zuerst mit <code>mutate()</code> und <code>rec()</code> die neue Variable <code>zufrieden</code> (1 bis 3 zufrieden, 4 bis 6 unzufrieden) und reicht sie dann an <code>crosstab()</code> weiter, mit Zeilenprozenten und gewichtet. Neu ist nur <code>weights = wghtpew</code>.',
        mehr: [warum('Wie lese ich die Tabelle?', 'Jede Wahlabsicht hat zwei Zeilen: oben die Anzahl (gewichtet, also Summe der Gewichte), darunter „row %“. In der Spalte „zufrieden“ steht in der Zeile „row %“, wie viel Prozent dieser Gruppe mindestens etwas zufrieden sind.', 'k2-tabelle'),
          warum('Warum Zeilenprozente?', 'Die Wahlabsicht steht in den Zeilen und ist die Gruppe, die du vergleichst. Zeilenprozente sagen für jede Gruppe, wie sie sich aufteilt (kennst du aus Sitzung 5).', 'k2-tabelle')] },
      { id: 'a2-3', art: 'code', titel: 'Cramér-V rechnen', wk: ['a2c'], neu: true,
        text: 'Fass die ganze Tabelle in einer Zahl zusammen: Cramér-V, gewichtet. Die Vorlage bildet <code>zufrieden</code> noch einmal genauso wie in Schritt 3, damit sie auch für sich allein läuft; im Journal schadet die Wiederholung nicht. (Der Kommentar in der Vorlage zählt „Erst festlegen“ nicht mit und sagt darum „Schritt 2“.) R gibt nur eine Zahl aus, zum Beispiel <code>[1] 0.1234567</code>. Lies sie mit drei Nachkommastellen.',
        mehr: [warum('Wie entsteht V?', 'Aus χ²: Man vergleicht die Tabelle mit der Tabelle, die man ohne Zusammenhang erwarten würde, und macht daraus eine Zahl zwischen 0 und 1.', 'k2-chi'),
          warum('Wie stark ist stark?', 'Faustregel (nach Cohen): ab 0,1 schwach, ab 0,3 mittel, ab 0,5 stark.', 'k2-staerke')] },
      { id: 'a2-4', art: 'fragen', titel: 'Ergebnis festhalten', fragen: Q('a2').slice(1) },
    ],
    plenum: 'Heißt ein deutlicher Zusammenhang, dass die Wahlabsicht zufrieden oder unzufrieden macht, oder könnte es auch umgekehrt sein? Bringt einen Satz mit.',
    probier: { idee: 'Wie unterscheiden sich West und Ost, und was sagt Phi dazu?', code: T.frei_a2.code },
    ohneGrafik: 'Alles steht in Tabelle und Zahl: Zeilenprozente aus <code>crosstab()</code> in Schritt 3, V aus <code>cramers_v()</code> in Schritt 4.' },

  { id: 'a3', n: 3, titel: 'Wirtschaftslage und Demokratie', pflicht: true, grund: 'g3',
    frage: 'Sind Menschen, die die Wirtschaftslage in Deutschland schlechter einschätzen, unzufriedener mit der Demokratie?',
    ziel: 'du kannst Gamma und Tau-b für zwei geordnete Merkmale ausrechnen, Stärke und Richtung in einem Satz sagen und erklären, warum Gamma größer ausfällt.',
    info: 'Die Wirtschaftslage in Deutschland (<code>ep01</code>, kennst du aus Sitzung 5) hat fünf Stufen: 1 sehr gut, 2 gut, 3 teils/teils, 4 schlecht, 5 sehr schlecht. Ein höherer Code heißt also: schlechter eingeschätzt. Diesmal bleibt <code>ep01</code>, wie es ist. Die Zufriedenheit mit der Demokratie (<code>ps03</code>) polst du zuerst um, damit ein höherer Code „zufriedener“ heißt. Beide Merkmale haben eine Reihenfolge, aber keine sicher gleichen Abstände: ordinal.',
    schritte: [
      { id: 'a3-p', art: 'festlegen', titel: 'Erst festlegen', vorhersage: vor('a3') },
      { id: 'a3-1', art: 'code', titel: 'Umpolen und prüfen', wk: ['a3a'], bekannt: 'rules = "rev" aus Sitzung 5',
        text: 'Pole die Zufriedenheit um und prüfe es. In der Kontrolle muss bei Code 6 jetzt SEHR ZUFRIEDEN stehen.',
        mehr: [warum('Warum umpolen?', 'Im Datensatz heißt bei <code>ps03</code> die 1 „sehr zufrieden“. Nach dem Umpolen heißt ein höherer Code „zufriedener“. Dann lässt sich das Vorzeichen leichter in einen Satz übersetzen.', 'k3-umpolen')] },
      { id: 'a3-2', art: 'code', titel: 'Gamma und Tau-b rechnen', wk: ['a3b'], neu: true,
        text: 'Rechne Gamma und Tau-b, gewichtet. Die Vorlage polt oben noch einmal um wie in Schritt 2, damit sie auch für sich allein läuft; im Journal schadet das nicht. (Der Kommentar in der Vorlage zählt „Erst festlegen“ nicht mit und sagt darum „Schritt 1“.) Die Ausgabe hat zwei Teile: Zuerst kommt Gamma als einzelne Zahl hinter <code>[1]</code>, darunter der Block „Kendall\'s Tau“ mit der Zeile <code>tau = …</code>. Bei Gamma meldet R in Rot „2 cells (6.7%) has expected count &lt; 5 …“: ein Hinweis, kein Fehler. Das Bild zeigt die Codes beider Variablen als Pfeile; du brauchst es in Schritt 4.',
        baustein: 'Vorzeichen',
        mehr: [warum('Was vergleichen Gamma und Tau-b?', 'Paare von Befragten: gleichläufig (wer beim einen Merkmal höher liegt, liegt auch beim anderen höher) gegen gegenläufig. Gamma lässt Paare mit Gleichstand weg, Tau-b zählt sie mit.', 'k3-paare'),
          warum('Die Ausgabe lesen', 'R schreibt Kommazahlen mit Punkt: <code>-0.241</code> heißt −0,241. Den p-Wert und die Sternchen lässt du heute links liegen.', 'r2')] },
      { id: 'a3-3', art: 'lesen', titel: 'Deuten',
        text: 'Sag in einem Satz, was das Vorzeichen bedeutet, und ordne die Stärke mit Tau-b ein. Das Bild in Schritt 3 hilft beim Vorzeichen, die Fragen im nächsten Schritt führen dich hin.',
        mehr: [warum('Betrag und Vorzeichen', 'Der Betrag sagt, wie stark ein Zusammenhang ist; das Vorzeichen sagt, in welche Richtung. Positiv: Höhere Codes gehen mit höheren Codes einher. Negativ: Höhere Codes gehen mit niedrigeren einher.', 'k3-richtung')] },
      { id: 'a3-4', art: 'fragen', titel: 'Ergebnis festhalten', fragen: Q('a3') },
      { id: 'a3-5', art: 'ansehen', titel: 'Einordnen: dieselben Daten, fünf Maße', baustein: 'FuenfMasse',
        text: 'Für Zufriedenheit und Wirtschaftslage kann man auch die anderen Maße der Sitzung rechnen. Heraus kommen fünf verschiedene Zahlen, weil die Maße Verschiedenes messen. Vergleiche Zusammenhänge darum nur mit demselben Maß; V hat zudem kein Vorzeichen.',
        mehr: [warum('Welches Maß passt wann?', 'Das niedrigere Skalenniveau der beiden Variablen entscheidet. Ein Maß für ein höheres Niveau darfst du nicht nehmen; eins für ein niedrigeres geht, verschenkt aber Information.', 'k5-baum')] },
    ],
    plenum: 'Für dieselben Daten gibt es zwei Zahlen, Gamma und Tau-b. Welche schreibt ihr in einen Bericht, und was muss dazu?',
    probier: { idee: 'Hängt die Zufriedenheit genauso stark mit der eigenen wirtschaftlichen Lage zusammen (ep03)?', code: T.frei_a3.code },
    ohneGrafik: 'Das Bild in Schritt 3 hat eine Textfassung. Gamma steht hinter <code>[1]</code>, Tau-b in der Zeile <code>tau = …</code> der Ausgabe von Schritt 3.' },

  { id: 'a4', n: 4, titel: 'Lebenszufriedenheit und Demokratie', pflicht: false, grund: 'g4',
    frage: 'Sind Menschen, die mit ihrem Leben zufriedener sind, auch zufriedener mit der Demokratie, und gilt das in West und Ost?',
    ziel: 'du kannst Pearson-r und Spearman-ρ rechnen und einordnen und prüfen, ob der Zusammenhang in beiden Landesteilen gleich stark ist.',
    info: 'Die Lebenszufriedenheit (<code>ls01</code>) reicht von 0 (ganz unzufrieden) bis 10 (ganz zufrieden): elf Stufen, die man wie Zahlen mit gleichen Abständen behandeln darf (quasi-metrisch). Die Zufriedenheit mit der Demokratie hat sechs Stufen; umgepolt (höher = zufriedener) behandelst du sie hier ebenfalls als quasi-metrisch und vergleichst zur Sicherheit mit Spearman-ρ.',
    schritte: [
      { id: 'a4-p', art: 'festlegen', titel: 'Erst festlegen', vorhersage: vor('a4') },
      { id: 'a4-1', art: 'code', titel: 'Umpolen und Punktwolke', wk: ['a4a'], bekannt: 'ggplot() aus Sitzung 4',
        text: 'Pole um (wie in Aufgabe 3) und sieh dir die Punktwolke an. <code>geom_jitter()</code> streut die Punkte leicht, weil sie sonst bei so wenigen Stufen übereinanderliegen; <code>alpha = 0.2</code> macht sie durchscheinend, damit dichte Stellen dunkler wirken. Die Grafik, die R zeichnet, zeigt alle Befragten ohne Gewicht; für einen ersten Blick reicht das.',
        mehr: [warum('Textfassung der Punktwolke', esc(D.ALT.punktwolke)),
          warum('Warum erst die Punktwolke?', 'Pearson-r misst nur geradlinige Zusammenhänge. Ob die Punkte eher einer Geraden folgen, einem Bogen oder einzelnen Ausreißern, siehst du nur im Bild.', 'k4-punktwolke')] },
      { id: 'a4-2', art: 'code', titel: 'Pearson-r und Spearman-ρ', wk: ['a4b'], neu: true,
        text: 'Rechne Pearson-r (gewichtet) und Spearman-ρ. Die Vorlage polt oben wieder um, damit sie für sich allein läuft. Lies die Zahlen hinter <code>r =</code> und <code>rho =</code>.',
        mehr: [warum('Warum ohne Gewicht bei ρ?', '<code>spearman_rho()</code> rechnet immer ohne Gewicht. Für Aussagen über Deutschland ist das eine kleine Einschränkung, die du im Bericht nennst.', 'k4-ausreisser'),
          warum('Was misst r?', 'Wie gut sich die Punkte an eine steigende oder fallende Gerade halten, von −1 bis +1. ρ macht dasselbe mit Rangplätzen.', 'k4-pearson')] },
      { id: 'a4-3', art: 'code', titel: 'Drittvariable Landesteil prüfen', wk: ['a4c'],
        text: 'Rechne r einmal nur im Westen und einmal nur im Osten. Hol die Vorlage ins Journal und führ sie aus: Sie rechnet den Westen (1). Dann tausch <b>im Journal</b> die markierte 1 gegen 2 und führ den Block noch einmal aus: der Osten.',
        mehr: [warum('Wie prüft man eine Drittvariable?', 'Man rechnet denselben Zusammenhang innerhalb jeder Gruppe der Drittvariable und vergleicht mit dem Wert für alle. Bleibt er, erklärt sie ihn nicht; schrumpft er, erklärt sie einen Teil.', 'k4-dritt')] },
      { id: 'a4-4', art: 'fragen', titel: 'Ergebnis festhalten', fragen: Q('a4') },
    ],
    probier: { idee: 'Hängt die Links-rechts-Einstufung mit der Zufriedenheit zusammen?', code: T.frei_a4.code },
    ohneGrafik: 'Die Punktwolke ist nur zum Ansehen und hat eine Textfassung. Alle Antworten kommen aus Schritt 3 und 4: <code>r = …</code> und <code>rho = …</code> aus <code>pearson_cor()</code> und <code>spearman_rho()</code>.' },
];

/* ---------- Weiter, wenn du magst ---------- */
const FREI = {
  a1: [
    { stufe: 'Abwandeln', text: 'Ändert die Gewichtung auch Mittelwert und Median der Zufriedenheit?', tipp: '<code>allbus %&gt;% describe(ps03)</code>, einmal ohne und einmal mit <code>weights = wghtpew</code>. Vergleiche Mean und Median.' },
    { stufe: 'Erweitern', text: 'Wie viele gehören keiner Religionsgemeinschaft an, ohne und mit Gewicht?', tipp: 'Die Konfession steht in <code>rd01</code>; Code 6 heißt „keine“. Zähl sie wie in Schritt 2 einmal ohne, einmal mit Gewicht aus. Im Mischpult in „Verstehen“ siehst du, warum sich die Zahl hier stark ändert.' },
    { stufe: 'Eigene Frage', text: 'Such eine Frage, bei der sich West und Ost unterscheiden könnten, und vergleiche ohne und mit Gewicht.', tipp: 'Tipp im Journal ein paar Buchstaben und drück <kbd>Tab</kbd>: Die Vorschläge zeigen Variablen mit ihrer Frage. Je größer der Unterschied zwischen West und Ost, desto mehr ändert das Gewicht.' },
  ],
  a2: [
    { stufe: 'Abwandeln', text: 'Wie unterscheiden sich West und Ost in der Zufriedenheit, und was sagt Phi dazu?', tipp: '<code>crosstab(eastwest, zufrieden, percentages = "row", weights = wghtpew)</code> und <code>phi(eastwest, zufrieden, weights = wghtpew)</code>. Bei einer Vierfeldertafel zeigt <code>phi()</code> ein Vorzeichen; für die Stärke zählt der Betrag.' },
    { stufe: 'Erweitern', text: 'Was ändert sich an V, wenn du die Zufriedenheit mit allen sechs Stufen nimmst statt in zwei Gruppen?', tipp: '<code>cramers_v(pv01, ps03, weights = wghtpew)</code>, ganz ohne <code>mutate()</code>. Vergleiche mit V aus Schritt 4.' },
    { stufe: 'Eigene Frage', text: 'Hängt die Zufriedenheit mit der Konfession zusammen?', tipp: 'Die Konfession steht in <code>rd01</code> und hat keine Reihenfolge. Die Gruppen der Zufriedenheit bildest du wie in Schritt 3.' },
  ],
  a3: [
    { stufe: 'Abwandeln', text: 'Hängt die Zufriedenheit genauso stark mit der eigenen wirtschaftlichen Lage zusammen?', tipp: '<code>ep03</code> hat dieselben Codes wie <code>ep01</code>. Tausch in <code>kendall_tau()</code> die Variable aus.' },
    { stufe: 'Erweitern', text: 'Zeig den Zusammenhang als Tabelle: Wie viele sind je Einschätzung der Wirtschaftslage zufrieden?', tipp: 'Bilde <code>zufrieden</code> wie in Aufgabe 2 und nimm <code>crosstab(ep01, zufrieden, percentages = "row", weights = wghtpew)</code>.' },
    { stufe: 'Eigene Frage', text: 'Hängen Schicht und Gesundheit zusammen?', tipp: 'Die Vorlage in „Vorweg: R lesen“ rechnet Tau-b für <code>hs01</code> und <code>id02</code>. Denk ans Vorzeichen: Bei <code>hs01</code> heißt 1 „sehr gut“.' },
  ],
  a4: [
    { stufe: 'Abwandeln', text: 'Hängt die Links-rechts-Einstufung (pa01: 1 = links, 10 = rechts) mit der Zufriedenheit zusammen?', tipp: '<code>pearson_cor(zufriedenheit, pa01, weights = wghtpew)</code>. Für West oder Ost setzt du <code>filter(eastwest == 1) %&gt;%</code> davor, wie in Schritt 4.' },
    { stufe: 'Erweitern', text: 'Brauchen ältere Befragte länger für den Fragebogen? Vergleiche r und ρ mit allen Bögen und nur bis 180 Minuten.', tipp: '<code>pearson_cor(age, xt10, weights = wghtpew)</code> und <code>spearman_rho(age, xt10)</code>, dann dasselbe mit <code>filter(xt10 &lt;= 180)</code> davor. Was machen die Ausreißer mit r?' },
    { stufe: 'Eigene Frage', text: 'Prüf den Zusammenhang aus dieser Aufgabe mit einer anderen Drittvariable.', tipp: 'Rechne r innerhalb jeder Gruppe der Drittvariable, wie in Schritt 4 mit <code>filter()</code>, und vergleiche mit dem Wert für alle. Halte im Journal fest, was du gefunden hast.' },
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
