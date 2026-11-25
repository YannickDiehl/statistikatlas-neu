/* Kapitel 1 „Einstieg“: Aufgaben, Zusatzinfos und eigene Schrittarten für die Lernpfad-Engine.
   Wird nach daten.js geladen; die Engine ruft window.KAPITEL(hilfen) einmal auf. */
'use strict';
window.KAPITEL = ({ D, T, esc, warum, probier }) => {

/* ---------- Verweise in Fragen und Hilfen an die neue Schrittzählung anpassen ----------
   Im Atlas war das Hochladen Schritt 1, ohne „Erst festlegen“. Hier ist „Erst festlegen“ Schritt 1:
   Jede Schrittnummer rückt um eins nach hinten. „Grundlage 2b“ usw. heißt jetzt „Verstehen zu Aufgabe 2“.
   Frage-IDs, Ziele und Lösungen bleiben unverändert. */
const verweis = s => s == null ? s : String(s)
  .replace(/Schritt (\d)/g, (_, n) => 'Schritt ' + (+n + 1))
  .replace(/Grundlage (\d)[a-d]?, Meldungs-Sortierer/g, 'Verstehen zu Aufgabe $1, „Die häufigsten Meldungen“')
  .replace(/Grundlage (\d)[a-d]?/g, 'Verstehen zu Aufgabe $1')
  .replace('Die Tabelle ‚Hilfe: R meldet einen Fehler‘ unter der Aufgabe', 'Die Tabelle ‚R meldet einen Fehler‘ unter der Aufgabe');
const fragen = g => D.QUESTIONS[g].map(q => ({ ...q, hint: verweis(q.hint), help: q.id === 'a1-env' ? 'Verstehen zu Aufgabe 1, „Vier Fenster“.' : verweis(q.help) }));
for (const k of Object.keys(D.HINTS)) D.HINTS[k] = D.HINTS[k].map(verweis);
D.ERROR_HELP = D.ERROR_HELP.map(r => ({ ...r, helps: r.helps.map(p => p && p.href === '#g1c' ? { ...p, text: 'Verstehen zu Aufgabe 1, „Ein Projekt“' } : p) }));

/** Festlegung aus PREDICTIONS (ID bleibt, etwa a1-fest), mit Auflösung nach den Fragen. */
const fest = (k, aufloesung) => ({ ...D.PREDICTIONS[k], aufloesung });

/** Code für RStudio (nur lesen und kopieren, nicht ins Journal). */
const rsCode = (key, notiz) => `<div class="cb"><div class="cb-kopf"><span class="cb-titel">${esc(T[key].title)}</span><span style="font-size:13px;color:var(--mute);margin-left:auto">${esc(notiz)}</span><button type="button" data-k1-kopie="${key}">Kopieren</button></div><pre aria-label="${esc(T[key].title)}">${esc(T[key].code)}</pre></div>`;
document.addEventListener('click', async e => {
  const b = e.target.closest('[data-k1-kopie]'); if (!b) return;
  try { await navigator.clipboard.writeText(T[b.dataset.k1Kopie].code); b.textContent = 'Kopiert ✓'; setTimeout(() => { b.textContent = 'Kopieren'; }, 1500); } catch { /* egal */ }
});

const ohneText = 'Alle Ausgaben dieser Aufgabe sind Text.';
const holen = 'Hol die Vorlage mit <b>→ Journal</b> in dein Lernjournal';

/* ---------- Aufgaben ---------- */
const TASKS = [
  { id: 'a1', n: 1, titel: 'Startklar', pflicht: true, grund: 'g1',
    frage: 'Hast du den ALLBUS in R, und wie groß ist er?',
    ziel: 'deine ALLBUS-Datei ist im Lernpfad gespeichert, du hast sie im Lernjournal und in RStudio eingelesen und kannst sagen, wie viele Befragte und Variablen sie hat und wie viele Zellen das sind.',
    schritte: [
      { id: 'a1-p', art: 'festlegen', titel: 'Erst festlegen', vorhersage: fest('a1', 'Der ALLBUS 2023 hat 5.246 Menschen befragt, also etwa 5.000.') },
      { id: 'a1-1', art: 'datei', titel: 'Deine ALLBUS-Datei laden', neu: true,
        text: 'Das Lernjournal und die Konsole rechnen mit deiner eigenen ALLBUS-Datei <code>ZA8831_v1-3-0.sav</code>. Du wählst sie hier <b>einmal</b>. Danach gilt sie für alle Sitzungen des Lernpfads, auch wenn du die Seite neu lädst oder den Browser schließt. Die Datei bleibt in deinem Browser auf deinem Rechner gespeichert. <b>Hochgeladen wird nichts</b>: Die Datei verlässt deinen Rechner nicht.',
        mehr: [warum('Woher bekomme ich die Datei?', 'Bei GESIS: kostenlos registrieren, nach ZA8831 suchen, die SPSS-Datei (.sav) herunterladen. Die Nutzung ist an dich gebunden: Gib die Datei nicht weiter und lade sie nirgends hoch.', 'k1-datei')] },
      { id: 'a1-2', art: 'code', titel: 'Wie groß ist der ALLBUS?', wk: ['a1_dim'], neu: true,
        text: `${holen} und führ sie dort aus: <b>▶ Ausführen</b> oder <kbd>Strg</kbd>/<kbd>Cmd</kbd> + <kbd>Enter</kbd> im Block. <code>allbus</code> ist im Journal schon deine Datei. <code>dim()</code> steht für <i>dimensions</i>: Die Funktion gibt zwei Zahlen aus, erst die Zeilen (Befragte), dann die Spalten (Variablen). Meldet die Statuszeile noch nicht ‚ALLBUS geladen‘, wartest du kurz.`,
        mehr: [warum('Was heißt [1]?', '<code>[1]</code> heißt: Hier beginnt die Ausgabe. Die Zahlen danach sind das Ergebnis.', 'k1-dim'),
          probier('Wie heißen die Variablen?', '<code>names()</code> zeigt alle Variablennamen. Woran erkennst du Variablen, die zusammengehören?', T.frei_a1.code, 'a1')] },
      { id: 'a1-3', art: 'code', titel: 'R rechnet: Wie viele Zellen sind das?', wk: ['a1_zellen'],
        text: `Jede Befragte hat für jede Variable eine Zelle. ${holen} und setz dort an den gelben Stellen die beiden Zahlen aus Schritt 3 ein, so wie R sie schreibt: ohne Tausenderpunkt, also <code>5246</code>, nicht <code>5.246</code>. Für R ist der Punkt ein Komma: <code>5.246</code> wäre fünf Komma zwei. Führ den Block dann im Journal aus. Die Vorlage hier in der Aufgabe bleibt, wie sie ist; geändert wird nur dein Block im Journal.`,
        mehr: [warum('R meldet „object \'Befragte\' not found“?', 'Unverändert ausgeführt meldet R ‚Objekt \'Befragte\' nicht gefunden‘ (im Journal englisch: object \'Befragte\' not found): Ohne Anführungszeichen liest R <code>Befragte</code> als Namen eines Objekts, und das gibt es nicht. Setz die Zahlen ein. R schreibt Kommazahlen mit Punkt: <code>2.5</code> heißt zweieinhalb.', 'k1-rechnen')] },
      { id: 'a1-4', art: 'rstudio', titel: 'Dasselbe in RStudio', haken: 'In RStudio erledigt',
        text: 'Öffne RStudio über dein Projekt, kopiere den Startblock in dein Skript und führ ihn Zeile für Zeile mit <kbd>Strg</kbd>/<kbd>Cmd</kbd> + <kbd>Enter</kbd> aus. Schau dann, in welchem Fenster <code>allbus</code> jetzt auftaucht.',
        html: rsCode('start', 'für dein Skript in RStudio'), baustein: 'Umgebung',
        mehr: [warum('Wie lege ich das Projekt an?', 'In RStudio: File → New Project … → New Directory → New Project. Namen (zum Beispiel <code>methoden-ib</code>) und Ort wählen, Create Project. Dann die Datei <code>ZA8831_v1-3-0.sav</code> in diesen Ordner verschieben und ein Skript im selben Ordner speichern.', 'k1-projekt'),
          warum('Farbige Zeilen beim Laden?', 'Beim Laden schreibt RStudio farbige Zeilen in die Konsole, etwa ‚Attaching core tidyverse packages‘ oder ‚Das folgende Objekt ist maskiert‘. Das sind Hinweise, keine Fehler.', 'r1'),
          warum('RStudio läuft noch nicht?', 'Dann beantwortest du die Fragen mit dem Lernjournal und holst die Installation mit dem Setup-Guide in ILIAS nach.')] },
      { id: 'a1-5', art: 'fragen', titel: 'Ergebnis festhalten', fragen: fragen('a1') },
    ],
    ohneGrafik: `${ohneText} Das Bild des Environments in Schritt 5 hat eine Textfassung; dieselben Zahlen gibt <code>dim(allbus)</code> als Text aus.` },

  { id: 'a2', n: 2, titel: 'Schon gefragt?', pflicht: true, grund: 'g2',
    frage: 'Hat der ALLBUS 2023 schon gefragt, was dich interessiert?',
    ziel: 'du hast für vier Ideen geprüft, ob der ALLBUS sie schon fragt, und kannst erklären, warum ‚kein Treffer‘ noch nicht ‚gibt es nicht‘ heißt und ein Treffer nicht immer passt.',
    info: 'Vier Ideen für Fragen an die Bevölkerung:<ol style="margin:4px 0 6px;padding-left:22px"><li>Halten die Leute etwas von Horoskopen?</li><li>Wie viele haben Angst vor Geflüchteten?</li><li>Vertrauen die Menschen der Politik noch?</li><li>Wie einsam sind die Menschen?</li></ol>Für jede suchst du im ALLBUS: Gibt es eine Variable, die das misst? Wenn nicht, müsste man die Frage neu stellen.',
    schritte: [
      { id: 'a2-p', art: 'festlegen', titel: 'Erst festlegen', vorhersage: fest('a2', D.A2_ALL_RIGHT) },
      { id: 'a2-1', art: 'code', titel: 'Idee 1: Horoskope', wk: ['a2_idee1'], neu: true,
        text: 'Die erste Suche ist vorgemacht. Hol sie mit <b>→ Journal</b> in dein Lernjournal, führ sie dort aus und lies das Variablenlabel.',
        mehr: [warum('Was zeigt die Ausgabe?', '<code>col</code> zeigt, an welcher Stelle die Variable im Datensatz steht, <code>name</code> den Variablennamen und <code>label</code> das Variablenlabel, eine kurze Beschreibung der Frage.', 'k2-suchen')] },
      { id: 'a2-2', art: 'code', titel: 'Idee 2: Angst vor Geflüchteten', wk: ['a2_idee2'],
        text: `${holen} und führ sie erst so aus, wie sie ist. Findet R nichts, ändere im Journal das gelbe Suchwort nach den Regeln aus „Verstehen“ (ae, oe, ue statt Umlaut, kurzer Wortanfang) und führ den Block noch einmal aus. Tipp: Ein kurzer Wortanfang findet auch abgekürzte Labels. Lies alle Treffer: Misst einer davon Angst?`,
        mehr: [warum('Kein Treffer: Was nun?', 'Kein Treffer heißt nicht ‚gibt es nicht‘. Probier ae, oe, ue statt ä, ö, ü, einen kürzeren Wortanfang oder ein anderes Wort.', 'k2-anders')] },
      { id: 'a2-3', art: 'code', titel: 'Idee 3: Vertrauen in die Politik', wk: ['a2_idee3'],
        text: `${holen}, führ sie aus und lies die Treffer. Misst einer davon Vertrauen? Wenn nicht: Welches Wort aus der Idee würde im Label stehen? Ändere im Journal die gelbe Stelle und führ den Block noch einmal aus.`,
        mehr: [warum('Was heißt „die Politik“?', '‚Die Politik‘ kann Verschiedenes meinen: den Bundestag, die Bundesregierung, die Parteien. Du musst entscheiden, was die Idee meint.', 'k2-passt')] },
      { id: 'a2-4', art: 'code', titel: 'Idee 4: Einsamkeit', wk: ['a2_idee4'],
        text: `${holen} und führ sie aus. Prüf jeden Treffer: Geht es wirklich um Einsamkeit? Probier danach im Journal weitere Wörter, etwa ‚allein‘ oder ‚freund‘.`,
        mehr: [warum('Was ist ein Scheintreffer?', '<code>find_var()</code> findet ein Suchwort auch mitten in einem anderen Wort. ‚tier‘ steckt in RESPEKTIEREN; mit Tieren hat diese Frage nichts zu tun. Lies darum jedes Label Wort für Wort.', 'k2-passt'),
          probier('Fragt der ALLBUS nach Tarot-Karten?', 'Wenn der ALLBUS nach Horoskopen fragt, fragt er vielleicht auch nach Tarot-Karten? Oder such nach einer Frage, die dich selbst interessiert.', T.frei_a2.code, 'a2')] },
      { id: 'a2-5', art: 'fragen', titel: 'Ergebnis festhalten', fragen: fragen('a2') },
    ],
    plenum: 'Bei welchen Ideen würdet ihr eine vorhandene Variable nehmen, bei welchen neu fragen? Bei Idee 2 und 3 gibt es keine eindeutige Antwort. Bringt eure Entscheidung und einen Satz Begründung mit.',
    ohneGrafik: ohneText },

  { id: 'a3', n: 3, titel: 'Belegen', pflicht: true, grund: 'g3',
    frage: 'Was genau misst die Variable, und wie viele haben gültig geantwortet?',
    ziel: 'du kannst für die Horoskop-Frage <code>rh08b</code> und die Vertrauensfrage <code>pt03</code> aus Aufgabe 2 sagen, was die Codes bedeuten, wie viele gültig geantwortet haben und wem die Frage gar nicht gestellt wurde.',
    schritte: [
      { id: 'a3-p', art: 'festlegen', titel: 'Erst festlegen', vorhersage: fest('a3', 'Gefragt wurden 3.650 der 5.246 Befragten, gut zwei Drittel (knapp 70 %).') },
      { id: 'a3-1', art: 'rstudio', titel: 'Im Codebuch nachschlagen (in RStudio)', haken: 'Nachgeschlagen, oder ohne RStudio übersprungen',
        text: 'Öffne in RStudio das ganze Codebuch und such darin mit <kbd>Strg</kbd> + <kbd>F</kbd> (Mac: <kbd>Cmd</kbd> + <kbd>F</kbd>) nach <code>rh08b</code>. Dort siehst du Variablenlabel, Codes, Wertelabels und Häufigkeiten. Die letzte Zeile der Vorlage schlägt nur <code>rh08b</code> nach. Ohne RStudio: weiter mit Schritt 3, dort steht dasselbe.',
        html: rsCode('a3_codebuch', 'für RStudio'),
        mehr: [warum('Warum nicht im Lernjournal?', 'Das Lernjournal hier im Browser kann den Viewer von RStudio nicht öffnen. Darum nimmst du in dieser Sitzung <code>frequency()</code>: Dort stehen die gültigen Antworten als eigene Zeile.', 'k3-codebuch')] },
      { id: 'a3-2', art: 'code', titel: 'Erster Blick auf rh08b', wk: ['a3_rh08b'], neu: true,
        text: `${holen} und führ sie dort aus. <code>frequency()</code> zählt aus, wie oft jeder Code vorkommt. Erstes Argument: der Datensatz, zweites: die Variable, ohne Anführungszeichen. Lies in der Ausgabe: Value ist der Code, Label das Wertelabel, N die Anzahl. Unter ‚Total valid‘ stehen die gültigen Antworten, darunter die fehlenden Werte. Ausführlich kommt <code>frequency()</code> in Sitzung 3.`,
        mehr: [warum('Total oder Total valid?', 'Die letzte Zeile ‚Total‘ sind alle Befragten, nicht alle Antworten. Wie viele geantwortet haben, steht in ‚Total valid‘.', 'k3-fehlend')] },
      { id: 'a3-3', art: 'code', titel: 'Die Vertrauensfrage pt03', wk: ['a3_pt03'],
        text: `${holen}, tausch dort die gelbe Variable gegen <code>pt03</code> und führ den Block aus. Bei den Codes 2 bis 6 steht als Wertelabel nur ‚..‘: Das sind Zwischenstufen zwischen GAR KEIN VERTRAUEN (1) und GROSSES VERTRAUEN (7) ohne eigenes Wort.`,
        mehr: [warum('Was heißt TNZ?', 'TNZ heißt ‚trifft nicht zu‘: Diesen Menschen wurde die Frage gar nicht gestellt. KEINE ANGABE heißt dagegen: gefragt, aber nicht geantwortet.', 'k3-fehlend'),
          probier('Parteien oder Bundestag?', 'Vertrauen die Befragten den politischen Parteien (<code>pt15</code>) weniger als dem Bundestag? Vergleiche, wie viele GAR KEIN VERTRAUEN und wie viele GROSSES VERTRAUEN haben.', T.frei_a3.code, 'a3')] },
      { id: 'a3-4', art: 'fragen', titel: 'Ergebnis festhalten', fragen: fragen('a3') },
    ],
    ohneGrafik: ohneText },

  { id: 'a4', n: 4, titel: 'Reparieren', pflicht: false, grund: 'g4',
    frage: 'Was will R dir mit einer Fehlermeldung sagen?',
    ziel: 'du hast vier kaputte Zeilen im Lernjournal mit Hilfe der Fehlermeldungen repariert und aus den reparierten Ausgaben je eine Zahl abgelesen.',
    info: 'In jeder Vorlage steckt genau ein Fehler. Hol sie mit <b>→ Journal</b> in dein Lernjournal, führ sie dort aus, lies die Meldung, repariere die Zeile im Journal und führ sie noch einmal aus. Die Vorlage hier in der Aufgabe bleibt kaputt, so siehst du jederzeit, wie sie anfangs aussah. Willst du von vorn anfangen, entfernst du den Block im Journal mit ✕ und holst die Vorlage neu.',
    schritte: [
      { id: 'a4-p', art: 'festlegen', titel: 'Erst festlegen', vorhersage: fest('a4', 'Eine Fehlermeldung ist eine Auskunft: Lies, wo und was, und schau auf den Namen in Anführungszeichen.') },
      ...[1, 2, 3, 4].map(i => ({ id: `a4-${i}`, art: 'code', titel: `Reparieren ${i}`, wk: [`a4_${i}`],
        text: i === 1
          ? 'Führ die Vorlage im Journal aus und lies die Meldung: Wo, was, und welcher Name steht darin? Repariere die Zeile im Journal und führ sie noch einmal aus. Erledigt ist der Schritt, sobald der Block ohne Fehler läuft.'
          : 'Wie bei Reparieren 1: im Journal ausführen, die Meldung lesen, die Zeile reparieren, noch einmal ausführen.',
        mehr: i === 4
          ? [warum('Wo steckt der Fehler?', 'Jede Meldung nennt einen Namen in Anführungszeichen oder Backticks. Genau dort steckt der Fehler.', 'k4-meldungen'),
            probier('Was ist erlaubt?', 'Manche Fehlermeldungen sagen dir sogar, was erlaubt ist. Die Vorlage sucht nur in den Variablennamen. Ändere <code>"name"</code> in <code>"titel"</code> und lies, welche Einstellungen R vorschlägt.', T.frei_a4.code, 'a4')]
          : [warum('Wo steckt der Fehler?', 'Jede Meldung nennt einen Namen in Anführungszeichen oder Backticks. Genau dort steckt der Fehler.', 'k4-meldungen')] })),
      { id: 'a4-5', art: 'fragen', titel: 'Ergebnis festhalten', fragen: fragen('a4') },
    ],
    ohneGrafik: ohneText },
];

/* ---------- Weiter, wenn du magst ---------- */
const FREI = {
  a1: [
    { stufe: 'Abwandeln', text: 'Wie heißen die Variablen? Woran erkennst du Variablen, die zusammengehören?', tipp: '<code>names(allbus)</code> zeigt alle Variablennamen. Variablen, die zusammengehören, haben oft ähnliche Namen: <code>lm27</code> bis <code>lm34</code> fragen alle, mit welchen Geräten jemand das Internet nutzt.' },
    { stufe: 'Eigene Frage', text: 'Der Osten ist im ALLBUS absichtlich stärker vertreten. Wie viele Befragte leben dort?', tipp: '<code>frequency(allbus, eastwest)</code> zählt aus; Code 2 heißt NEUE BUNDESLAENDER. <code>frequency()</code> lernst du in Aufgabe 3 kennen. Vergleiche mit dem Steckbrief in „Verstehen“.' },
  ],
  a2: [
    { stufe: 'Abwandeln', text: 'Wenn der ALLBUS nach Horoskopen fragt, fragt er vielleicht auch nach Tarot-Karten?', tipp: '<code>find_var(allbus, "tarot")</code>, dann das Variablenlabel lesen.' },
    { stufe: 'Erweitern', text: 'Fragt der ALLBUS, wie Menschen fernsehen?', tipp: 'Ein kurzer Wortanfang wie <code>"fernseh"</code> findet FERNSEHER und FERNSEHEN. Lies jedes Label: Geht es ums Fernsehen?' },
    { stufe: 'Eigene Frage', text: 'Such nach einer Frage, die dich selbst interessiert.', tipp: 'Probier mehrere Suchwörter: ae, oe, ue statt Umlaut, einen kurzen Wortanfang, ein Wort mit gleicher Bedeutung. Halte im Journal fest, ob du die Variable nehmen würdest.' },
  ],
  a3: [
    { stufe: 'Abwandeln', text: 'Vertrauen die Befragten den politischen Parteien (pt15) weniger als dem Bundestag?', tipp: '<code>frequency(allbus, pt15)</code>. Vergleiche, wie viele GAR KEIN VERTRAUEN und wie viele GROSSES VERTRAUEN haben.' },
    { stufe: 'Erweitern', text: 'Wem wurde die Frage gestellt, ob jemand das Internet mit dem Smartphone nutzt (lm30)?', tipp: '<code>frequency(allbus, lm30)</code>. Achte auf TNZ: FILTER: Die Frage ging nur an Menschen, die das Internet nutzen.' },
    { stufe: 'Eigene Frage', text: 'Nimm eine Variable aus deiner Suche in Aufgabe 2: Was heißen ihre Codes, und wie viele haben gültig geantwortet?', tipp: 'Variablenname klein und ohne Anführungszeichen in <code>frequency()</code>. Wurde die Frage allen gestellt? Schau auf die Zeilen mit TNZ.' },
  ],
  a4: [
    { stufe: 'Abwandeln', text: 'Manche Fehlermeldungen sagen dir sogar, was erlaubt ist.', tipp: '<code>find_var(allbus, "pt", search = "name")</code> sucht nur in den Variablennamen. Ändere <code>"name"</code> in <code>"titel"</code> und lies, welche Einstellungen R vorschlägt.' },
    { stufe: 'Erweitern', text: 'Bau selbst einen Fehler ein: Lass zwischen zwei Argumenten das Komma weg.', tipp: 'Zum Beispiel <code>find_var(allbus "klima")</code>. R meldet ‚unerwartete Zeichenkettenkonstante‘ (englisch: unexpected string constant).' },
  ],
};

/* ---------- Eigene Schrittarten dieses Kapitels ---------- */

/** Schritt „Datei laden“: Knopf öffnet die Dateiwahl der Seite (#datei). Erledigt, sobald die Statuszeile „ALLBUS geladen“ meldet. */
function datei(s, H) {
  const div = document.createElement('div');
  div.innerHTML = `<p style="margin:8px 0 4px"><button type="button" class="knopf" data-datei>ALLBUS-Datei wählen</button></p>
    <p class="rueck" role="status" aria-live="polite"></p>
    <ul style="margin:6px 0 0;padding-left:22px">
      <li><b>Warum bleibt die Datei bei dir?</b> Die Nutzung ist an dich gebunden: Gib die Datei nicht weiter und lade sie nirgends hoch. Deshalb bringt der Lernpfad keine Daten mit; du wählst deine eigene Datei.</li>
      <li><b>Wann musst du sie neu wählen?</b> Auf einem anderen Gerät oder in einem anderen Browser, wenn du die Website-Daten gelöscht hast oder Safari sie nach etwa sieben Tagen ohne Besuch entfernt hat. Dann erscheint oben auf der Seite der Knopf „ALLBUS-Datei wählen“.</li>
      <li>Ohne Datei kannst du alles lesen und deine Antworten prüfen. Nur <span aria-hidden="true">▶</span> Ausführen im Journal und in der Konsole braucht die Datei.</li>
    </ul>`;
  const rueck = H.$('.rueck', div), status = document.getElementById('r-status'), anfang = status ? status.textContent : '';
  const pruefen = () => {
    const t = status ? status.textContent : '';
    if (/ALLBUS geladen/.test(t)) { rueck.className = 'rueck ok'; rueck.textContent = '✓ Deine ALLBUS-Datei ist geladen. Du kannst mit Schritt 3 weitermachen.'; if (!H.S.fertig[s.id]) H.fertig(s.id); return; }
    if (t && t !== anfang) { rueck.className = 'rueck'; rueck.textContent = t; }
  };
  if (status) new MutationObserver(pruefen).observe(status, { childList: true, characterData: true, subtree: true });
  const feld = document.getElementById('datei');
  if (feld) feld.addEventListener('change', () => { if (feld.files && feld.files[0]) { rueck.className = 'rueck'; rueck.textContent = 'Datei gewählt. R startet und liest sie ein; das dauert etwa eine halbe Minute.'; } });
  pruefen();
  return div;
}

/** Schritt in RStudio: Code steht in s.html (zum Kopieren), dazu ein Haken zum Abhaken. */
function rstudio(s, H) {
  const lab = document.createElement('label'); lab.className = 'erledigt';
  lab.innerHTML = `<input type="checkbox" ${H.S.fertig[s.id] ? 'checked' : ''}> ${H.esc(s.haken)}`;
  H.$('input', lab).onchange = e => H.fertig(s.id, e.target.checked);
  return lab;
}

return { BILD: {}, TASKS, FREI, typen: { datei, rstudio } };
};
