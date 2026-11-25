/* Kapitel 7 „Mittelwerte vergleichen“: Aufgaben und Zusatzinfos für die Lernpfad-Engine.
   Wird nach daten.js geladen; die Engine ruft window.KAPITEL(hilfen) einmal auf.
   Vorlagen, Fragen und Frage-IDs kommen unverändert aus src/chapter/s07/content.ts (IDs ohne Bindestrich, a1c und a3c gibt es nicht). */
'use strict';
window.KAPITEL = ({ D, T, esc, warum, probier }) => {

/* ---------- Abbildungen auf das Format der Engine ---------- */

/* Die Fragetexte verweisen auf Karten der alten Grundlagen („Karte 1c“) und auf alte Schrittnummern („Schritt 1“).
   Hier heißen die Karten nach ihrem Titel, und „Erst festlegen“ ist Schritt 1: Alle Schritte rücken um eins nach. */
const KARTE = {
  '1b': 'Signal durch Rauschen: der t-Wert',
  '1c': 'p-Wert und Konfidenzintervall in Worten',
  '1d': 'Wie groß ist der Unterschied? Die Effektstärke',
  '2c': 'Welch oder Student? Zwei Zeilen in der Ausgabe',
  '3b': 'Zwischen den Gruppen gegen innerhalb der Gruppen: F',
};
const umschreiben = s => (typeof s !== 'string' ? s : s
  .replace(/Karte (\d[a-d])/g, (_, k) => `Karte „${KARTE[k]}“ in Verstehen`)
  .replace('Lies Marke ④ in Grundlage 4.', 'Lies in Verstehen zu Aufgabe 4 Marke ④ der Korrelationsmatrix.')
  .replace('(das sind die 6 % aus Grundlage 3)', '(das sind die 6 % aus dem Beispiel in Verstehen)')
  .replace(/Schritt (\d)/g, (_, n) => `Schritt ${Number(n) + 1}`));
const fragen = k => D.QUESTIONS[k].map(q => ({ ...q, label: umschreiben(q.label), right: umschreiben(q.right), hint: umschreiben(q.hint), help: umschreiben(q.help) }));

/* „Erst festlegen“ mit Vergleich je gewählter Möglichkeit (ersetzt TipCompare). Gleiche ID wie in PREDICTIONS.
   Die Engine schreibt „Deine Festlegung: …“ davor; darum fällt der Vorspann „Dein Tipp: …“ der compare-Texte weg. */
const vorhersage = (k, eigen = {}) => {
  const p = D.PREDICTIONS[k];
  return { id: p.id, prompt: p.prompt, options: p.options,
    vergleich: Object.fromEntries(p.options.map(o => [o, eigen[o] || p.compare[o].replace(/^Dein Tipp: [^.]*\. /, '')])) };
};

/* ---------- Aufgaben ---------- */
const TASKS = [
  { id: 'a1', n: 1, titel: 'Vertrauen in den Bundestag', pflicht: true, grund: 'g1',
    frage: 'Vertrauen Menschen mit Abitur dem Bundestag mehr als Menschen ohne Abitur?',
    ziel: 'du kannst sagen, um wie viel sich die beiden Gruppen im Mittel unterscheiden, ob der Unterschied über den Zufall hinausgeht (t, p, Konfidenzintervall) und wie groß er ist (Hedges\' g).',
    info: 'Der ALLBUS fragt: <em>„Wie viel Vertrauen haben Sie in den Bundestag?“</em> (<code>pt03</code>, 1 = gar kein Vertrauen bis 7 = großes Vertrauen). Als „mit Abitur“ zählt, wer die Fachhochschulreife oder die allgemeine Hochschulreife hat (<code>educ</code> 4 oder 5), als „ohne Abitur“, wer keinen Abschluss, einen Haupt- oder Volksschulabschluss oder die Mittlere Reife hat (<code>educ</code> 1 bis 3).',
    infoMehr: [warum('Warum antworten nur gut 3.500?', 'Gestellt wurde die Frage nur etwa zwei Dritteln der Befragten: 1.596 haben sie nicht bekommen, im Datensatz steht bei ihnen „TNZ: SPLIT“. Wer noch zur Schule geht oder einen anderen Abschluss hat, fällt aus dem Vergleich heraus.', 'k1-gruppen')],
    schritte: [
      { id: 'a1-p', art: 'festlegen', titel: 'Erst festlegen', vorhersage: vorhersage('a1') },
      { id: 'a1-1', art: 'code', titel: 'Gruppen bilden und testen (Kurzfassung)', wk: ['a1_kurz'], neu: true,
        text: `Die Vorlage bildet mit <code>rec()</code> die Variable <code>abitur</code> und rechnet gleich einen t-Test. Hol sie mit <b>→ Journal</b> in dein Lernjournal und führe sie dort einmal aus, wie sie ist: Sie vergleicht das Alter. Zur Kontrolle: <code>${esc(D.A1_SHORT.age)}</code>. Mit Abitur sind die Befragten im Mittel jünger. Tausch dann <b>im Journal</b> die markierte Stelle <code>age</code> gegen <code>pt03</code> und führe den Block noch einmal aus. Lies die Zeile, die mit <code>t(</code> beginnt.`,
        mehr: [
          warum('Was heißt 1:3=0 [ohne Abitur]?', '<code>rec()</code> kennst du aus Sitzung 5. <code>1:3=0</code> heißt: Die Codes 1 bis 3 werden zu 0 mit dem Label „ohne Abitur“. <code>4:5=1</code> macht aus 4 und 5 die 1 „mit Abitur“. <code>else=NA</code>: Alles andere fehlt.', 'k1-vorlage'),
          warum('Was heißen t, p und g?', '<b>t</b> teilt den Unterschied durch sein Rauschen, den Standardfehler. <b>p</b> sagt, wie oft ein mindestens so großer Unterschied vorkäme, wenn es in der Bevölkerung keinen gäbe. <b>g</b> (Hedges\' g) sagt, wie groß der Unterschied ist.', 'k1b'),
          warum('Lieber in RStudio?', 'Dann führst du dort vorher den Startblock aus (Pakete laden, ALLBUS einlesen). Danach kopierst du die Vorlage mit <b>Kopieren</b> in dein Skript.<pre>' + esc(T.start.code) + '</pre>', 'r1'),
        ] },
      { id: 'a1-2', art: 'code', titel: 'Die ganze Tabelle', wk: ['a1_tabelle'],
        text: 'Für die Mittelwerte und das Konfidenzintervall hängt die zweite Vorlage <code>summary()</code> an. Sie ist schon fertig; der Kommentar „wie in Schritt 1“ meint die Kurzfassung in Schritt 2, er zählt „Erst festlegen“ nicht mit. Hol sie mit <b>→ Journal</b> ins Lernjournal und führe sie dort aus. Lies die Ausgabe in dieser Reihenfolge: zuerst die Gruppen, dann die Zeile „Equal variances not assumed“, dann die Effektstärke.',
        mehr: [
          warum('Wie lese ich die Tabelle?', '„Weighted Group Statistics“ zeigt N, Mittelwert (Mean) und Streuung je Gruppe. Die Zeile „Equal variances not assumed“ (Welch-Test) zeigt t, p, den Unterschied (Mean Diff.) und das 95-%-Konfidenzintervall. „Effect Sizes“ zeigt Hedges\' g. Ein Minus vor t und Mean Diff. heißt nur: Die zweite Gruppe liegt höher.', 'k1-tabelle'),
          warum('Warum die Welch-Zeile?', 'Beide Zeilen testen dasselbe; sie rechnen den Zufall nur verschieden ein. Welch nimmt jede Gruppe mit ihrer eigenen Streuung und braucht keine gleich starke Streuung in beiden Gruppen.', 'k2c'),
        ] },
      { id: 'a1-3', art: 'fragen', titel: 'Ergebnis festhalten', fragen: fragen('a1'),
        text: 'Die Fragen gehen die Ausgabe in der Reihenfolge eines Berichts durch: Welche Gruppe liegt höher, um wie viel, geht das über den Zufall hinaus, wo liegt der Unterschied plausibel, wie groß ist er? Wenn du fertig bist und Zeit hast: Schreib im Journal daraus einen Satz wie in einem Bericht.',
        mehr: [
          warum('Was gehört in einen Bericht-Satz?', 'Die Mittelwerte beider Gruppen, der Unterschied mit Einheit und Intervall, der Test mit p, die Effektstärke, dazu Quelle, Fallzahl und „gewichtet“. Ein Muster mit den Arbeitsstunden steht im Überblick von Verstehen.', 'kue2'),
          warum('Musterformulierung (verrät die Lösung)', D.A1_MODEL),
        ] },
    ],
    probier: { idee: 'Gilt der Unterschied auch beim Vertrauen in die Polizei (pt14)?', code: T.frei_a1.code },
    plenum: 'Bringt euren Bericht-Satz mit. Ist der Unterschied, den ihr gefunden habt, auf einer Skala von 1 bis 7 politisch bedeutsam? Und erklärt das Abitur den Unterschied, oder könnte etwas anderes dahinterstecken (etwa das Alter, siehe Schritt 2 vor dem Tausch)?',
    ohneGrafik: 'Alle Antworten stehen in der Textausgabe von <code>summary()</code>; diese Aufgabe braucht keine Grafik.' },

  { id: 'a2', n: 2, titel: 'Macht Abitur zufriedener?', pflicht: false, grund: 'g2',
    frage: 'Wie groß ist der Unterschied in der Lebenszufriedenheit zwischen Menschen mit und ohne Abitur, und hängt die Antwort davon ab, wen man fragt?',
    ziel: 'du kannst begründen, warum ein Unterschied signifikant und trotzdem klein sein kann, und warum die Welch-Zeile ein breiteres Intervall zeigt, wenn eine kleine Gruppe stärker streut als eine große.',
    info: 'Du vergleichst die Lebenszufriedenheit (<code>ls01</code>, 0 bis 10) zwischen ohne und mit Abitur, einmal bei allen Befragten und einmal nur bei den unter 30-Jährigen. Die Gruppen bildest du wie in <a href="#a1">Aufgabe 1</a>.',
    schritte: [
      { id: 'a2-p', art: 'festlegen', titel: 'Erst festlegen', vorhersage: vorhersage('a2') },
      { id: 'a2-1', art: 'code', titel: 'Alle Befragten', wk: ['a2_alle'],
        text: 'Hol die Vorlage ins Journal und führe sie dort aus. Lies den Unterschied (Mean Diff.), p und Hedges\' g.',
        mehr: [warum('Signifikant und klein, geht das?', 'Ja. Ob ein Unterschied signifikant ist, hängt an seiner Größe und an der Zahl der Befragten. Wie groß er ist, sagt die Effektstärke.', 'k2a')] },
      { id: 'a2-2', art: 'code', titel: 'Nur die unter 30-Jährigen', wk: ['a2_jung'], bekannt: 'filter() aus Sitzung 2',
        text: 'Die Vorlage hat eine Zeile mehr: <code>filter(age &lt; 30)</code>. Führe sie im Journal aus und vergleiche die beiden Zeilen „Equal variances assumed“ und „not assumed“: Wo ist das Intervall breiter?',
        mehr: [
          warum('Zwei Zeilen, zwei Intervalle?', 'Student nimmt eine gemeinsame Streuung für beide Gruppen an, Welch nimmt jede Gruppe mit ihrer eigenen Streuung und Größe. Schau dafür oben in der Gruppentabelle auf N und Std. Deviation.', 'k2c'),
          warum('Passt der t-Test bei so wenigen Befragten?', 'Als Faustregel reichen etwa 30 Befragte je Gruppe. Gleiche Streuung braucht nur der klassische Test, der Welch-Test kommt ohne aus.', 'k2b'),
        ] },
      { id: 'a2-3', art: 'fragen', titel: 'Ergebnis festhalten', fragen: fragen('a2') },
    ],
    probier: { idee: 'Wie sieht es bei den Befragten ab 65 aus?', code: T.frei_a2.code },
    ohneGrafik: 'Alle Antworten stehen in der Textausgabe von <code>summary()</code>; diese Aufgabe braucht keine Grafik.' },

  { id: 'a3', n: 3, titel: 'Links, rechts und der Wohnort', pflicht: true, grund: 'g3',
    frage: 'Stehen Menschen in der Großstadt politisch weiter links als in Kleinstadt und Dorf?',
    ziel: 'du kannst sagen, ob sich die Wohnorte in der Links-rechts-Einstufung unterscheiden (F, p), wie stark (η²) und welche Wohnorte genau (Tukey), und warum ein großer Unterschied in einer kleinen Gruppe nicht signifikant sein kann.',
    info: 'Der ALLBUS fragt: <em>„Viele Leute verwenden die Begriffe links und rechts … Wo würden Sie sich einordnen?“</em> (<code>pa01</code>, 1 = links bis 10 = rechts). Den Wohnort beschreiben die Befragten selbst (<code>gs01</code>): Großstadt, Vorort einer Großstadt, Mittel- oder Kleinstadt, ländliches Dorf, Einzelgehöft auf dem Land. Fünf Gruppen, also eine ANOVA.',
    schritte: [
      { id: 'a3-p', art: 'festlegen', titel: 'Erst festlegen', vorhersage: vorhersage('a3') },
      { id: 'a3-1', art: 'code', titel: 'Die ANOVA', wk: ['a3_anova'], neu: true,
        text: 'Hol die Vorlage ins Journal und führe sie dort aus, wie sie ist: Sie rechnet das Alter nach Erhebungsweg, das Beispiel aus Verstehen. Du solltest F = 160.989 wiederfinden. Tausch dann <b>im Journal</b> <code>age</code> gegen <code>pa01</code> und <code>mode</code> gegen <code>gs01</code> und führe den Block noch einmal aus.',
        mehr: [
          warum('Wie lese ich die Ausgabe der ANOVA?', 'Oben stehen die Gruppen mit N, Mittelwert und Standardabweichung. In der Zeile „Between Groups“ stehen F und p (Sig). Darunter folgt die Welch-ANOVA, ganz unten unter „Effect Sizes“ das Eta Squared (η²). In Verstehen ist die Ausgabe des Beispiels mit Marken erklärt.', 'k3-vorlage'),
          warum('Warum nicht zehn t-Tests?', 'Jeder Test hat 5 % Fehlalarm. Bei fünf Wohnorten gibt es zehn Paare, und die Chance auf mindestens einen Fehlalarm steigt auf etwa 40 %. Die ANOVA prüft mit einem einzigen Test, ob sich irgendwelche Gruppen unterscheiden.', 'k3a'),
        ] },
      { id: 'a3-2', art: 'code', titel: 'Welche Wohnorte genau?', wk: ['a3_tukey'], neu: true,
        text: 'Die zweite Vorlage hängt <code>tukey_test()</code> direkt hinter die ANOVA und <code>summary()</code> ans Ende. Sie ist fertig. Hol sie mit <b>→ Journal</b> ins Lernjournal und führe sie dort aus. Ohne <code>summary()</code> würde die Kurzfassung nur zählen, wie viele Paare signifikant sind; mit <code>summary()</code> siehst du alle zehn.',
        mehr: [warum('Was zeigt die Tukey-Tabelle?', 'Jede Zeile ist ein Paar: erste minus zweite Gruppe. Die p-Werte sind für die Zahl der Vergleiche korrigiert. Ein Paar unterscheidet sich signifikant, wenn p unter 0,05 liegt; dann enthält auch sein Intervall die 0 nicht.', 'k3c')] },
      { id: 'a3-3', art: 'fragen', titel: 'Ergebnis festhalten', fragen: fragen('a3'),
        text: 'Die Fragen gehen erst darauf ein, wo die Befragten stehen, dann ob sich die Wohnorte unterscheiden (F), wie stark (η²), welche Paare (Tukey) und warum ein Paar trotz großem Unterschied offen bleibt. Wenn du fertig bist und Zeit hast: Schreib im Journal einen Satz, was man über Stadt und Land sagen darf und was nicht.',
        mehr: [warum('Großer Unterschied, nicht signifikant?', 'Mit wenigen Befragten in einer Gruppe ist ihr Mittelwert unsicher: Der Standardfehler ist groß, das Intervall breit. Nicht signifikant heißt dann „nicht entschieden“, nicht „gleich“.', 'k3-ergebnis')] },
    ],
    probier: { idee: 'Sind Verheiratete zufriedener mit ihrem Leben als Ledige, Geschiedene oder Verwitwete?', code: T.frei_a3.code },
    plenum: 'Bringt euren Satz über Stadt und Land mit. Schreibt eine Schlagzeile, die stimmt, und eine, die zu weit geht. Woran liegt der Unterschied: am Wohnort selbst, oder wohnen in der Großstadt andere Menschen (jünger, mehr mit Abitur)?',
    ohneGrafik: 'Alle Antworten stehen in der Textausgabe von <code>summary()</code>; diese Aufgabe braucht keine Grafik. Die Ausgabe mit Marken in Verstehen ist nur eine Lesehilfe.' },

  { id: 'a4', n: 4, titel: 'Vertrauen in Institutionen', pflicht: false, grund: 'g4',
    frage: 'Hängt das Vertrauen in verschiedene Institutionen zusammen, und spielt das Alter dabei eine Rolle?',
    ziel: 'du kannst eine Korrelationsmatrix lesen: das stärkste Paar finden, signifikante von nicht signifikanten Paaren unterscheiden und erklären, warum die Fallzahlen je Paar verschieden sind.',
    info: 'Vier Vertrauensfragen (1 = gar kein Vertrauen bis 7 = großes Vertrauen): Bundestag (<code>pt03</code>), Bundesregierung (<code>pt12</code>), Polizei (<code>pt14</code>), Hochschulen und Universitäten (<code>pt11</code>). Dazu das Alter (<code>age</code>).',
    schritte: [
      { id: 'a4-p', art: 'festlegen', titel: 'Erst festlegen', vorhersage: vorhersage('a4', {
        'Bundestag und Bundesregierung': 'Stimmt: r = 0,79.',
        'Bundestag und Polizei': 'Bundestag und Polizei hängen mit r = 0,46 zusammen. Am stärksten hängen Bundestag und Bundesregierung zusammen: r = 0,79.',
        'Polizei und Hochschulen': 'Polizei und Hochschulen hängen mit r = 0,44 zusammen. Am stärksten hängen Bundestag und Bundesregierung zusammen: r = 0,79.',
      }) },
      { id: 'a4-1', art: 'code', titel: 'Die Matrix', wk: ['a4_matrix'], bekannt: 'pearson_cor() aus Sitzung 6',
        text: 'Hol die Vorlage ins Journal und führe sie dort aus. Lies zuerst die „Correlation Matrix“, dann die „Sample Size Matrix“.',
        mehr: [warum('Wie lese ich die Matrix?', 'Jede Zelle ist ein Paar. Die Diagonale ist jede Variable mit sich selbst, immer 1. Die Matrix ist gespiegelt: Lies nur eine Hälfte. Sterne heißen signifikant. Die „Sample Size Matrix“ zeigt, wie viele Befragte in jedes Paar eingehen.', 'k4a')] },
      { id: 'a4-2', art: 'fragen', titel: 'Ergebnis festhalten', fragen: fragen('a4') },
    ],
    probier: { idee: 'Neun Vertrauensfragen auf einmal: Wie viele Paare sind das, und wie viele bekommen Sterne?', code: T.frei_a4.code },
    ohneGrafik: 'Alle Antworten stehen in der Textausgabe von <code>summary()</code>; diese Aufgabe braucht keine Grafik.' },
];

/* ---------- Weiter, wenn du magst (die Probier-Ideen des Kapitels zuerst) ---------- */
const vorlage = k => 'Diese Vorlage kannst du kopieren und im Journal ausführen:<pre>' + esc(T[k].code.trim()) + '</pre>';
const FREI = {
  a1: [
    { stufe: 'Abwandeln', text: 'Gilt der Unterschied auch beim Vertrauen in die Polizei (pt14)?', tipp: vorlage('frei_a1') },
    { stufe: 'Erweitern', text: 'Schreib aus deiner Ausgabe einen Satz wie in einem Bericht.', tipp: 'Bausteine: beide Mittelwerte, der Unterschied mit Einheit und Intervall, der Test mit p, die Effektstärke, dazu Quelle, gewichtetes N und „gewichtet“. Ein Muster steht in Verstehen im Überblick.' },
    { stufe: 'Eigene Frage', text: 'Mit Abitur sind die Befragten im Mittel jünger. Bleibt der Unterschied im Vertrauen, wenn du nur eine Altersgruppe vergleichst?', tipp: 'Setz wie in Aufgabe 2 eine Zeile <code>filter(age &lt; 30)</code> vor <code>mutate()</code>, oder wähl eine andere Altersgrenze.' },
  ],
  a2: [
    { stufe: 'Abwandeln', text: 'Wie sieht es bei den Befragten ab 65 aus?', tipp: vorlage('frei_a2') },
    { stufe: 'Erweitern', text: 'Vergleiche alle Befragten, die unter 30-Jährigen und die ab 65-Jährigen: Wo ist der Unterschied am größten, wo am deutlichsten?', tipp: 'Halte für jede Gruppe Mean Diff., p und Hedges\' g fest. „Groß“ sagt g, „deutlich“ sagen t und p.' },
  ],
  a3: [
    { stufe: 'Abwandeln', text: 'Sind Verheiratete zufriedener mit ihrem Leben als Ledige, Geschiedene oder Verwitwete? Und wäre das eine Wirkung der Ehe?', tipp: vorlage('frei_a3') },
    { stufe: 'Erweitern', text: 'Unterscheiden sich die Wohnorte auch im Vertrauen in den Bundestag?', tipp: 'Nimm die Tukey-Vorlage aus Schritt 3 und tausch <code>pa01</code> gegen <code>pt03</code>.' },
    { stufe: 'Eigene Frage', text: 'Wohnen in der Großstadt andere Menschen, zum Beispiel jüngere?', tipp: 'Rechne eine ANOVA des Alters nach Wohnort: <code>oneway_anova(age, group = gs01, weights = wghtpew)</code>.' },
  ],
  a4: [
    { stufe: 'Abwandeln', text: 'Neun Vertrauensfragen auf einmal: Wie viele Paare sind das, und wie viele bekommen Sterne?', tipp: vorlage('frei_a4') + 'Häng <code>%&gt;% summary()</code> an, wenn du die ganze Matrix sehen willst.' },
    { stufe: 'Erweitern', text: 'Nimm die Lebenszufriedenheit (ls01) mit in die Matrix.', tipp: 'Schreib <code>ls01</code> in die Klammer von <code>pearson_cor()</code>, vor <code>weights =</code>.' },
  ],
};

return { BILD: {}, TASKS, FREI };
};
