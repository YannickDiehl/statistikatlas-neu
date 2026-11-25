/* Kapitel 4 „Daten sehen“: Aufgaben, Zusatzinfos und eigene Schrittarten für die Lernpfad-Engine.
   Wird nach daten.js geladen; die Engine ruft window.KAPITEL(hilfen) einmal auf. */
'use strict';
window.KAPITEL = ({ D, T, esc, bild, warum, probier }) => {
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
      { id: 'a1-p', art: 'festlegen', titel: 'Erst festlegen', pred: 'a1' },
      { id: 'a1-1', art: 'code', titel: 'Vorlage ausführen', wk: ['a1v'], neu: true,
        text: 'Die Vorlage zeichnet die Gesundheit als Balken. <code>to_label()</code> schreibt Wörter statt Codes auf die Achse.',
        mehr: [bild('toLabel', 'Bild: Was to_label() tut'), warum('Lieber in RStudio?', 'Dann führst du dort vorher den Startblock aus (Pakete laden, ALLBUS einlesen). Danach kopierst du die Vorlage mit <b>Kopieren</b> in dein Skript.<pre>' + esc(T.start.code) + '</pre>', 'r1')] },
      { id: 'a1-2', art: 'code', titel: 'Fehlende Werte weglassen und beschriften', wk: ['a1n'],
        text: 'Ganz rechts steht ein Balken <b>NA</b>: Personen ohne gültige Antwort. <code>drop_na(hs01)</code> lässt sie weg. Fülle die zwei markierten Stellen.',
        mehr: [bild('dropNa', 'Bild: Was drop_na() tut'),
          warum('Warum gibt es einen NA-Balken?', 'Bei Zahlen auf der Achse lässt ggplot fehlende Werte mit einer Warnung weg („Removed n rows“). Bei Wörtern zeigt es sie als eigenen Balken <b>NA</b>. Überlappen sich in RStudio die Beschriftungen, zieh das Plots-Fenster breiter.', 'k1-na'),
          probier('Wie viele fehlen?', 'Die Zeile „Total missing“ zählt den NA-Balken, „Total valid“ ist dein n.', 'allbus %>%\n  frequency(hs01)', 'a1')] },
      { id: 'a1-3', art: 'lesen', titel: 'Die Kette lesen',
        text: 'Lies deine fertige Kette von oben nach unten: Wo reicht <code>%&gt;%</code> die Daten weiter, wo legt <code>+</code> eine Schicht auf?',
        mehr: [bild('kette', 'Bild: Die Kette Zeile für Zeile'), warum('Pipe und Plus', 'Bis <code>ggplot()</code> arbeitest du mit Daten: <code>%&gt;%</code> reicht sie weiter. Ab <code>ggplot()</code> arbeitest du an einem Bild: <code>+</code> legt Schichten auf.', 'k1-kette')] },
      { id: 'a1-4', art: 'achse', titel: 'Deuten: Wo beginnt die Achse?', frage: D.A1_AXIS,
        mehr: [warum('Ehrlich zeigen', 'Bei Balken liest das Auge die Länge. Darum beginnen Balken bei 0. Wer einen Ausschnitt zeigt, sagt es in der Bildunterschrift.', 'k1-achse')] },
      { id: 'a1-5', art: 'fragen', titel: 'Ergebnis festhalten', fragen: 'a1' },
    ],
    probier: { idee: 'Wie schätzen Menschen ab 65 ihre Gesundheit ein?', code: T.frei_a1.code },
    ohneGrafik: '<code>allbus %&gt;% frequency(hs01)</code> zeigt dieselben Zahlen als Tabelle.' },

  { id: 'a2', n: 2, titel: 'Der Rätselkasten', pflicht: false, grund: 'g2',
    frage: 'Welche Frage steckt hinter welcher Form?',
    ziel: 'du erkennst an Stufenzahl, Gipfel und Häufungen, welche Frage hinter einer Verteilung steckt.',
    schritte: [
      { id: 'a2-1', art: 'raetsel', titel: 'Zuordnen',
        text: 'Vier Verteilungen ohne Beschriftung, fünf Fragen. Eine Frage bleibt übrig. Achte auf <b>Stufen</b>, <b>Gipfel</b> und <b>Häufungen</b>.',
        mehr: [warum('Woran erkenne ich Formen?', 'Symmetrisch: Gipfel in der Mitte. Linksschief: Gipfel rechts, Auslauf nach links. Rechtsschief: Gipfel links, Auslauf nach rechts. Mehrgipflig: die Befragten sind gespalten.', 'k2-formen')] },
      { id: 'a2-2', art: 'code', titel: 'Eine Zuordnung in R prüfen', wk: ['a2'],
        text: 'Tausch <b>beide</b> markierten Stellen gegen die Variable, die du prüfen willst.',
        mehr: [warum('Woran sehe ich, dass es geklappt hat?', 'Unter der x-Achse steht die Beschriftung deiner Frage (bei älteren ggplot2-Versionen der Variablenname). Tauschst du nur eine Stelle, zeigt die Grafik die falsche Variable.')] },
    ],
    probier: { idee: 'Wie verteilt sich die Frage, die übrig geblieben ist?', code: T.frei_a2.code },
    ohneGrafik: 'Jedes Bild hat eine Textfassung mit Stufenzahl und Höhen. Prüfen kannst du mit <code>allbus %&gt;% frequency(pa01)</code>.' },

  { id: 'a3', n: 3, titel: 'Wie lange dauert der Fragebogen?', pflicht: false, grund: 'g3',
    frage: 'Wie lange brauchen die Befragten für den Fragebogen?',
    ziel: 'ein Histogramm der Bearbeitungsdauer mit begründetem Ausschnitt und passender Kistenbreite.',
    schritte: [
      { id: 'a3-p', art: 'festlegen', titel: 'Erst festlegen', pred: 'a3' },
      { id: 'a3-1', art: 'code', titel: 'Kennzahlen ansehen', wk: ['a3d'], bekannt: 'describe() aus Sitzung 3',
        text: 'Schau auf Median und Spannweite der Bearbeitungsdauer <code>xt10</code>.',
        mehr: [warum('Was ist Range?', '<b>Range</b> ist die Spannweite: größter minus kleinster Wert. R schreibt Kommazahlen mit Punkt: 65.000 heißt 65.')] },
      { id: 'a3-2', art: 'code', titel: 'Histogramm ohne Angaben', wk: ['a3o'],
        text: 'Was siehst du, und warum?',
        mehr: [warum('Zwei Hinweise von R', 'R meldet, dass es 30 Kisten nimmt, und dass 220 Zeilen ohne Wert weggelassen wurden. Beides ist keine Fehlermeldung, sondern ein Hinweis.', 'k3-erstes')] },
      { id: 'a3-3', art: 'code', titel: 'Extreme abschneiden', wk: ['a3n'],
        text: '<code>filter(xt10 &lt;= 180)</code> behält nur Bögen bis 180 Minuten. Wie viele bleiben?',
        mehr: [bild('filter180', 'Bild: Was filter() prüft')] },
      { id: 'a3-4', art: 'code', titel: 'Kistenbreite einstellen', wk: ['a3m'],
        text: 'Probier <code>binwidth = 5</code>, <code>30</code> und <code>1</code>.',
        mehr: [bild('binwidth', 'Bild: Wie binwidth wirkt')] },
      { id: 'a3-5', art: 'fragen', titel: 'Ergebnis festhalten', fragen: 'a3' },
    ],
    probier: { idee: 'Wie viele Bögen lagen länger als einen Tag herum, und auf welchem Weg kamen sie?', code: T.frei_a3.code },
    ohneGrafik: '<code>allbus %&gt;% filter(xt10 &lt;= 180) %&gt;% frequency(xt10)</code> zeigt die Rundungsspitzen: bei 60 stehen 216 Bögen, bei 59 nur 38.' },

  { id: 'a4', n: 4, titel: 'Papier, online oder Interview?', pflicht: true, grund: 'g4',
    frage: 'Dauert das Ausfüllen auf Papier länger als online?',
    ziel: 'du kannst begründen, auf welchem Weg das Ausfüllen am längsten dauert, und sagen, wer dabei im Bild fehlt.',
    info: 'Der ALLBUS 2023 wurde auf drei Wegen erhoben (<code>mode</code>): <b>CAPI</b> Interview mit Laptop, <b>CAWI</b> online, <b>MAIL</b> Papier per Post.',
    infoMehr: [warum('Ausreißer und gerundete Angaben', 'Einzelne Bögen lagen wochenlang herum (der längste über 61.000 Minuten). Damit man etwas sieht, wählt man einen Ausschnitt – dafür gibt es zwei Wege mit verschiedenen Ergebnissen. Außerdem sind 71,5 % der Papier-Angaben Vielfache von 5 (Interview 39,5 %, online 20 %): auf Papier wurde oft geschätzt. Bei 220 Papierbögen fehlt die Dauer ganz.')],
    schritte: [
      { id: 'a4-p', art: 'festlegen', titel: 'Erst festlegen', pred: 'a4' },
      { id: 'a4-1', art: 'code', titel: 'Hineinzoomen', wk: ['a4'],
        text: '<code>coord_cartesian()</code> zeigt nur 0 bis 180 Minuten, rechnet aber mit <b>allen</b> Bögen.',
        mehr: [warum('„Removed 220 rows“?', 'Das sind die Papierbögen, bei denen die Dauer ganz fehlt. Sie können in keinem Bild auftauchen.')] },
      { id: 'a4-2', art: 'code', titel: 'Abschneiden', wk: ['a4f'],
        text: '<code>filter()</code> wirft Bögen über 180 Minuten hinaus, <b>bevor</b> gerechnet wird. Wo liegt jetzt der Strich im Kasten?',
        mehr: [bild('zoomFilter', 'Bild: Zoomen oder abschneiden'), warum('Was zeigt ein Boxplot?', 'Der Strich ist der Median, der Kasten reicht vom unteren zum oberen Quartil (Q1 bis Q3): In ihm liegt die mittlere Hälfte.', 'k4-lineal')] },
      { id: 'a4-3', art: 'code', titel: 'Zahlen je Weg vergleichen', wk: ['a4z', 'a4zf'], bekannt: 'describe() aus Sitzung 3',
        text: 'Tausch die markierte Zahl: 2 = CAPI, 3 = CAWI, 4 = MAIL. Einmal ohne, einmal mit Filter.',
        mehr: [warum('Was heißen show, Q25 und Q75?', '<code>show =</code> wählt, welche Kennzahlen <code>describe()</code> zeigt. <b>Q25</b> ist das untere Quartil (Q1), <b>Q75</b> das obere (Q3): die Ränder des Kastens. Das Komma in <code>filter(mode == 4, xt10 &lt;= 180)</code> heißt „und“.')] },
      { id: 'a4-4', art: 'fragen', titel: 'Ergebnis festhalten', fragen: 'a4' },
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
