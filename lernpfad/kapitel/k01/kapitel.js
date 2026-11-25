/* Kapitel 1 „Einstieg“: Aufgaben, Zusatzinfos und eigene Schrittarten für die Lernpfad-Engine.
   Wird nach daten.js geladen; die Engine ruft window.KAPITEL(hilfen) einmal auf. */
'use strict';
window.KAPITEL = ({ D, T, esc, warum, probier, denk }) => {

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
/* Kapitel 1 hat keine Aufgabenbilder (kein src/chapter/s01/bilder/). Die Engine schaut für „Im Bild“ in den
   ?-Fenstern zuerst in D.SVG nach; ohne leere Tabellen bricht sie dort ab, bevor sie die React-Bilder (BILDER) zeigt. */
D.SVG = D.SVG || {}; D.ALT = D.ALT || {};
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
      { id: 'a1-p', art: 'festlegen', titel: 'Erst festlegen', vorhersage: fest('a1', 'Der ALLBUS 2023 hat 5.246 Menschen befragt, also etwa 5.000.'),
        mehr: [denk('Wie lege ich mich fest?', { grund: 'k1-allbus',
          kurz: 'Du schätzt, wie viele Menschen der <b>ALLBUS</b> 2023 befragt hat. Es zählt nicht, ob du richtig liegst: Deine Festlegung ist der Vergleichspunkt, an dem du später merkst, ob dich die Größe überrascht.',
          denken: [
            'Wer wurde gefragt? Eine Zufallsstichprobe von Erwachsenen in Privathaushalten in Deutschland, nicht alle Menschen.',
            'Stell dir vor, wie viel Arbeit jedes einzelne Interview macht: Wie viele schafft eine Befragung wohl?',
            'Und andersherum: Wie viele braucht man, damit die Befragten für ganz Deutschland etwas sagen können?',
            'Wähl eine Größenordnung. In Schritt 3 zählt R nach.',
          ],
          verwechslung: 'Befragte und Bevölkerung: Der ALLBUS befragt eine <b>⟪Stichprobe⟫</b>, also nur einen Teil der Menschen in Deutschland. Was in der Datei steht, gilt zuerst für die Befragten.' })] },
      { id: 'a1-1', art: 'datei', titel: 'Deine ALLBUS-Datei laden', neu: true,
        text: 'Das Lernjournal und die Konsole rechnen mit deiner eigenen ALLBUS-Datei <code>ZA8831_v1-3-0.sav</code>. Du wählst sie hier <b>einmal</b>. Danach gilt sie für alle Sitzungen des Lernpfads, auch wenn du die Seite neu lädst oder den Browser schließt. Die Datei bleibt in deinem Browser auf deinem Rechner gespeichert. <b>Hochgeladen wird nichts</b>: Die Datei verlässt deinen Rechner nicht.',
        mehr: [denk('Woher bekomme ich die Datei?', { grund: 'k1-datei',
          kurz: 'Lernjournal und Konsole rechnen mit deiner eigenen ALLBUS-Datei. Du wählst sie einmal; sie bleibt in deinem Browser auf deinem Rechner. Hochgeladen wird nichts.',
          denken: [
            'Hast du die Datei schon? Sonst: bei GESIS kostenlos registrieren, nach ZA8831 suchen, die SPSS-Datei (.sav) herunterladen.',
            'Prüf den Namen: <code>ZA8831_v1-3-0.sav</code>.',
            'Klick auf „ALLBUS-Datei wählen“ und wähl sie aus.',
            'Warte, bis die Statuszeile „ALLBUS geladen“ meldet. Das dauert etwa eine halbe Minute.',
          ],
          verwechslung: 'Wählen ist nicht Hochladen. Die Datei verlässt deinen Rechner nicht; R liest sie direkt in deinem Browser.',
          zusatz: 'Die Nutzung ist an dich gebunden: Gib die Datei nicht weiter und lade sie nirgends hoch.' })] },
      { id: 'a1-2', art: 'code', titel: 'Wie groß ist der ALLBUS?', wk: ['a1_dim'], neu: true,
        text: `${holen} und führ sie dort aus: <b>▶ Ausführen</b> oder <kbd>Strg</kbd>/<kbd>Cmd</kbd> + <kbd>Enter</kbd> im Block. <code>allbus</code> ist im Journal schon deine Datei. <code>dim()</code> steht für <i>dimensions</i>: Die ⟪Funktion⟫, also der Befehl vor den Klammern, gibt zwei Zahlen aus, erst die Zeilen, dann die Spalten. Jede Zeile ist ein ⟪Fall⟫, hier eine befragte Person. Jede Spalte ist eine ⟪Variable⟫. Meldet die Statuszeile noch nicht ‚ALLBUS geladen‘, wartest du kurz.`,
        mehr: [denk('Was heißt [1]?', { grund: 'k1-dim',
          kurz: 'Ein Datensatz ist eine Tabelle, in der Fachsprache eine <b>⟪Datenmatrix⟫</b>. Jede Zeile ist ein <b>Fall</b>, hier eine befragte Person, jede Spalte eine <b>Variable</b>. <code>dim()</code> zählt beides und gibt zwei Zahlen aus.',
          denken: [
            'Hol die Vorlage ins Journal und führ sie aus, sobald die Statuszeile „ALLBUS geladen“ meldet.',
            'Lies die Ausgabe: <code>[1]</code> heißt nur „hier beginnt die Ausgabe“. Das Ergebnis steht danach.',
            'Frag dich: Welche der zwei Zahlen zählt die Zeilen, welche die Spalten?',
            'Vergleich die Zahl der Befragten mit deiner Festlegung aus Schritt 1.',
          ],
          verwechslung: 'Zeilen und Spalten: Die Zeilen sind die Fälle, hier die Befragten. Die Spalten sind die Variablen: zu jeder Frage eine, dazu Angaben über das Interview.' }),
          probier('Wie heißen die Variablen?', '<code>names()</code> zeigt alle Variablennamen. Woran erkennst du Variablen, die zusammengehören?', T.frei_a1.code, 'a1')] },
      { id: 'a1-3', art: 'code', titel: 'R rechnet: Wie viele Zellen sind das?', wk: ['a1_zellen'],
        text: `Jede Befragte hat für jede ⟪Variable⟫ eine Zelle. In der Zelle steht ihr ⟪Wert⟫, also ihre Antwort auf diese Frage. ${holen} und setz dort an den gelben Stellen die beiden Zahlen aus Schritt 3 ein, so wie R sie schreibt: ohne Tausenderpunkt, also <code>5246</code>, nicht <code>5.246</code>. Für R ist der Punkt ein Komma: <code>5.246</code> wäre fünf Komma zwei. Führ den Block dann im Journal aus. Die Vorlage hier in der Aufgabe bleibt, wie sie ist; geändert wird nur dein Block im Journal.`,
        mehr: [denk('Was gehört an die gelben Stellen?', { grund: 'k1-rechnen',
          kurz: 'Die Vorlage rechnet Befragte mal Variablen und legt das Ergebnis mit <code>&lt;-</code> unter dem Namen <code>zellen</code> ab, als <b>⟪Objekt⟫</b>. Die letzte Zeile rechnet die Zellen in Tage um, bei einer Zelle pro Sekunde.',
          denken: [
            'Hol die beiden Zahlen aus deiner Ausgabe von Schritt 3.',
            'Setz sie im Journal an den gelben Stellen ein, ohne Tausenderpunkt: Für R ist der Punkt ein Komma.',
            'Führ den Block aus: Welche Zeile der Ausgabe zeigt die Zellen, welche die Tage?',
            'Lies die Tage genau: R schreibt Kommazahlen mit Punkt. Wie viele ganze Tage sind das?',
          ],
          verwechslung: 'Ablegen und anzeigen: <code>zellen &lt;- …</code> zeigt nichts an, R merkt sich das Ergebnis nur. Erst die Zeile <code>zellen</code> zeigt es.',
          zusatz: 'Unverändert ausgeführt meldet R „object \'Befragte\' not found“: Ohne Anführungszeichen liest R <code>Befragte</code> als Namen eines Objekts, und das gibt es nicht. Setz die Zahlen ein.' })] },
      { id: 'a1-4', art: 'rstudio', titel: 'Dasselbe in RStudio', haken: 'In RStudio erledigt',
        text: 'Öffne RStudio über dein Projekt, kopiere den Startblock in dein ⟪Skript⟫, die Datei für deinen Code, und führ ihn Zeile für Zeile mit <kbd>Strg</kbd>/<kbd>Cmd</kbd> + <kbd>Enter</kbd> aus. Schau dann, in welchem Fenster <code>allbus</code> jetzt auftaucht.',
        html: rsCode('start', 'für dein Skript in RStudio'), baustein: 'Umgebung',
        mehr: [denk('Wie lege ich das Projekt an?', { grund: 'k1-projekt',
          kurz: 'R sucht Dateien nur im <b>Arbeitsordner</b>. Ein <b>RStudio-Projekt</b> macht deinen Projektordner zum Arbeitsordner, jedes Mal, wenn du es öffnest. Liegt die ALLBUS-Datei dort, findet der Startblock sie.',
          denken: [
            'Öffne RStudio über dein Projekt (Doppelklick auf die Datei <code>.Rproj</code>), nicht über das Skript.',
            'Schau unter Files: Liegt <code>ZA8831_v1-3-0.sav</code> im Projektordner?',
            'Kopier den Startblock ins Skript und führ ihn Zeile für Zeile aus: <kbd>Strg</kbd>/<kbd>Cmd</kbd> + <kbd>Enter</kbd>.',
            'Schau nach der letzten Zeile in alle vier Fenster: Wo ist etwas Neues dazugekommen?',
          ],
          bild: 'ProjectPicture', bildtext: 'Liegt die Datei im Projektordner, findet <code>read_spss()</code> sie. Liegt sie noch in Downloads, meldet R, dass sie nicht existiert.',
          verwechslung: 'Projekt und Skript: Das Projekt ist der Ordner mit der Datei <code>.Rproj</code>, das Skript eine einzelne <code>.R</code>-Datei darin. Wer nur das Skript öffnet, hat oft den falschen Arbeitsordner.',
          zusatz: 'Projekt anlegen: File → New Project … → New Directory → New Project. Namen (zum Beispiel <code>methoden-ib</code>) und Ort wählen, Create Project. Dann die Datei <code>ZA8831_v1-3-0.sav</code> in diesen Ordner verschieben und ein Skript im selben Ordner speichern.' }),
          warum('Farbige Zeilen beim Laden?', 'Beim Laden schreibt RStudio farbige Zeilen in die ⟪Konsole⟫, das Fenster, in dem R antwortet. Das sind etwa ‚Attaching core tidyverse packages‘ oder ‚Das folgende Objekt ist maskiert‘. Das sind Hinweise, keine Fehler.', 'r1'),
          warum('RStudio läuft noch nicht?', 'Dann beantwortest du die Fragen mit dem Lernjournal und holst die Installation mit dem Setup-Guide in ILIAS nach.')] },
      { id: 'a1-5', art: 'fragen', titel: 'Ergebnis festhalten', fragen: fragen('a1'),
        mehr: [denk('Wo lese ich das ab?', { grund: 'k1-ergebnis',
          kurz: 'Jede der vier Fragen hat einen festen Ort: die Ausgabe von <code>dim(allbus)</code> in Schritt 3, die Ausgabe der Rechnung in Schritt 4 oder die Fenster von RStudio aus Schritt 5.',
          denken: [
            '<b>Befragte:</b> die erste Zahl nach <code>[1]</code> in der Ausgabe von Schritt 3.',
            '<b>Variablen:</b> die zweite Zahl in derselben Ausgabe.',
            '<b>Wie lange bei einer Zelle pro Sekunde:</b> die letzte Zeile der Ausgabe von Schritt 4. Denk daran, dass R Kommazahlen mit Punkt schreibt.',
            '<b>Wo <code>allbus</code> ankommt:</b> Frag dich, welches der vier Fenster die Objekte auflistet, die R gerade kennt.',
          ],
          verwechslung: 'Steht bei den Tagen eine Zahl unter 1, hast du in Schritt 4 eine Zahl mit Tausenderpunkt eingesetzt. Für R ist der Punkt ein Komma.' })] },
    ],
    ohneGrafik: `${ohneText} Das Bild aus RStudio in Schritt 5 hat eine Textfassung; dieselben Zahlen gibt <code>dim(allbus)</code> als Text aus.` },

  { id: 'a2', n: 2, titel: 'Schon gefragt?', pflicht: true, grund: 'g2',
    frage: 'Hat der ALLBUS 2023 schon gefragt, was dich interessiert?',
    ziel: 'du hast für vier Ideen geprüft, ob der ALLBUS sie schon fragt, und kannst erklären, warum ‚kein Treffer‘ noch nicht ‚gibt es nicht‘ heißt und ein Treffer nicht immer passt.',
    info: 'Vier Ideen für Fragen an die Bevölkerung:<ol style="margin:4px 0 6px;padding-left:22px"><li>Halten die Leute etwas von Horoskopen?</li><li>Wie viele haben Angst vor Geflüchteten?</li><li>Vertrauen die Menschen der Politik noch?</li><li>Wie einsam sind die Menschen?</li></ol>Für jede suchst du im ALLBUS: Gibt es eine Variable, die das misst? Wenn nicht, müsste man die Frage neu stellen.',
    schritte: [
      { id: 'a2-p', art: 'festlegen', titel: 'Erst festlegen', vorhersage: fest('a2', D.A2_ALL_RIGHT),
        mehr: [denk('Wie lege ich mich fest?', { grund: 'k2-label',
          kurz: '<code>find_var()</code> sucht ein Wort in den <b>Variablennamen</b> und <b>⟪Variablenlabels⟫</b> des ALLBUS. Bevor du suchst, legst du fest, was ein leeres Ergebnis für dich heißt. Es zählt nicht, ob du richtig liegst.',
          denken: [
            'Denk an Suchfelder, die du kennst: Was schließt du, wenn eine Suche leer bleibt?',
            'Geh die drei Antworten durch und frag dich bei jeder: Was müsste stimmen, damit sie zutrifft?',
            'Wähl die Antwort, die du für am wahrscheinlichsten hältst. In den Schritten 2 bis 5 siehst du, wie sich Suchen anfühlt.',
          ],
          verwechslung: 'Variablenname und Variablenlabel: <code>la01</code> ist der Name, mit dem du die Variable in R ansprichst; FREIZEIT: BUECHER LESEN ist das Label, eine kurze Beschreibung der Frage.' })] },
      { id: 'a2-1', art: 'code', titel: 'Idee 1: Horoskope', wk: ['a2_idee1'], neu: true,
        text: 'Die erste Suche ist vorgemacht. Hol sie mit <b>→ Journal</b> in dein Lernjournal, führ sie dort aus und lies das ⟪Variablenlabel⟫, die kurze Beschreibung der Frage.',
        mehr: [denk('Was zeigt die Ausgabe?', { grund: 'k2-suchen',
          kurz: '<code>find_var(allbus, "horoskop")</code> sucht den Wortteil ‚horoskop‘ in allen Variablennamen und Variablenlabels. Das erste ⟪Argument⟫ in den Klammern ist der Datensatz ohne Anführungszeichen, das zweite das Suchwort in Anführungszeichen.',
          denken: [
            'Führ die Vorlage im Journal aus.',
            'Lies die Ausgabe Spalte für Spalte: <code>col</code> ist die Stelle im Datensatz, <code>name</code> der Variablenname, <code>label</code> das Variablenlabel.',
            'Lies das Label Wort für Wort: Fragt es nach dem, was Idee 1 wissen will?',
          ],
          bild: 'FindVarPicture', bildtext: 'So sucht <code>find_var()</code>, am Beispiel ‚buecher‘: Das Suchwort wird in Namen und Labels aller Variablen gesucht.',
          verwechslung: 'Die Zahl in Spalte <code>col</code> ist nicht die Zahl der Treffer, sondern die Stelle der Variable im Datensatz.' })] },
      { id: 'a2-2', art: 'code', titel: 'Idee 2: Angst vor Geflüchteten', wk: ['a2_idee2'],
        text: `${holen} und führ sie erst so aus, wie sie ist. Findet R nichts, ändere im Journal das gelbe Suchwort nach den Regeln aus „Verstehen“ (ae, oe, ue statt Umlaut, kurzer Wortanfang) und führ den Block noch einmal aus. Tipp: Ein kurzer Wortanfang findet auch abgekürzte Labels. Lies alle Treffer: Misst einer davon Angst?`,
        mehr: [denk('Kein Treffer: Was nun?', { grund: 'k2-anders',
          kurz: 'Die Variablenlabels stehen in GROSSBUCHSTABEN, ohne Umlaute (ü wird UE) und oft abgekürzt. Findet R nichts, liegt das oft an der Schreibweise. <b>Kein Treffer</b> heißt darum nicht „gibt es nicht“.',
          denken: [
            'Führ die Vorlage erst so aus, wie sie ist. Was meldet R?',
            'Wie sähe dein Suchwort ohne Umlaut aus?',
            'Labels sind oft abgekürzt: Wie kurz kannst du den Wortanfang machen, damit er noch zum Thema passt?',
            'Lies dann jedes Label Wort für Wort: Was genau wird gefragt, und ist das dasselbe wie Angst?',
          ],
          bild: 'SearchLab', bildtext: 'Wähl ein Suchwort und lies, was R antwortet. Die Beispiele stammen aus dem ALLBUS 2023; die Suchwörter deiner Aufgabe sind nicht dabei.',
          verwechslung: '‚SPORT‘ in Großbuchstaben findet genauso wenig wie ‚sport‘: <code>find_var()</code> achtet nicht auf Groß- und Kleinschreibung.' })] },
      { id: 'a2-3', art: 'code', titel: 'Idee 3: Vertrauen in die Politik', wk: ['a2_idee3'],
        text: `${holen}, führ sie aus und lies die Treffer. Misst einer davon Vertrauen? Wenn nicht: Welches Wort aus der Idee würde im Label stehen? Ändere im Journal die gelbe Stelle und führ den Block noch einmal aus.`,
        mehr: [denk('Was heißt „die Politik“?', { grund: 'k2-passt',
          kurz: 'Diesmal findet R etwas. Ein Treffer ist aber erst ein Kandidat. Lies sein ⟪Variablenlabel⟫ und prüf, worum es in der Frage dahinter geht.',
          denken: [
            'Lies jedes Label der Treffer: Geht es darin um Vertrauen?',
            'Frag dich, was „die Politik“ meinen kann: den Bundestag, die Bundesregierung, die Parteien?',
            'Welches Wort aus der Idee würde im Label stehen? Setz es an die gelbe Stelle und führ den Block noch einmal aus.',
            'Vergleich die neuen Treffer mit dem, was du unter „der Politik“ verstehst.',
          ],
          verwechslung: 'Dass dein Suchwort im Label steht, heißt nur, dass die Buchstaben vorkommen. Worum es in der Frage geht, sagt erst das ganze Label.' })] },
      { id: 'a2-4', art: 'code', titel: 'Idee 4: Einsamkeit', wk: ['a2_idee4'],
        text: `${holen} und führ sie aus. Prüf jeden Treffer: Geht es wirklich um Einsamkeit? Probier danach im Journal weitere Wörter, etwa ‚allein‘ oder ‚freund‘.`,
        mehr: [denk('Was ist ein Scheintreffer?', { grund: 'k2-passt',
          kurz: '<code>find_var()</code> findet ein Suchwort auch mitten in einem anderen Wort. Dann passen die Buchstaben, aber nicht unbedingt das Thema.',
          denken: [
            'Führ die Vorlage aus und lies jedes Label Wort für Wort.',
            'Such im Label, wo dein Suchwort steckt: als eigenes Wort oder mitten in einem anderen?',
            'Probier weitere Wörter wie ‚allein‘ oder ‚freund‘ und prüf jeden Treffer genauso.',
            'Frag dich bei jedem Treffer: Misst er genau das, etwas Verwandtes oder etwas anderes?',
          ],
          verwechslung: '‚tier‘ steckt in RESPEKTIEREN. Mit Tieren hat diese Frage trotzdem nichts zu tun.' }),
          probier('Fragt der ALLBUS nach Tarot-Karten?', 'Wenn der ALLBUS nach Horoskopen fragt, fragt er vielleicht auch nach Tarot-Karten? Oder such nach einer Frage, die dich selbst interessiert.', T.frei_a2.code, 'a2')] },
      { id: 'a2-5', art: 'fragen', titel: 'Ergebnis festhalten', fragen: fragen('a2'),
        mehr: [denk('Wo lese ich das ab?', { grund: 'k2-ergebnis',
          kurz: 'Die Fragen wollen zweierlei: etwas ablesen und etwas entscheiden. Abgelesen wird in den Ausgaben von Schritt 2 bis 5, entschieden mit dem Blick auf die Idee.',
          denken: [
            '<b>Welche Variable?</b> Lies das Variablenlabel jedes Treffers und vergleich es mit der Idee.',
            '<b>Wie viele Treffer?</b> Führ die Suche mit dem Suchwort aus, das die Frage nennt, und zähl die Zeilen der Ausgabe. R nummeriert sie am linken Rand.',
            '<b>Misst sie, was die Idee meint?</b> Lies das Label Wort für Wort: Steht dort, was die Idee wissen will, oder etwas Ähnliches?',
            '<b>Was folgt daraus?</b> Entscheide für jede Idee, ob du eine vorhandene Variable nehmen würdest, und begründe es mit dem Label.',
          ],
          verwechslung: 'Die Zahl in Spalte <code>col</code> ist nicht die Zahl der Treffer, sondern die Stelle der Variable im Datensatz.' })] },
    ],
    plenum: 'Bei welchen Ideen würdet ihr eine vorhandene Variable nehmen, bei welchen neu fragen? Bei Idee 2 und 3 gibt es keine eindeutige Antwort. Bringt eure Entscheidung und einen Satz Begründung mit.',
    ohneGrafik: ohneText },

  { id: 'a3', n: 3, titel: 'Belegen', pflicht: true, grund: 'g3',
    frage: 'Was genau misst die Variable, und wie viele haben gültig geantwortet?',
    ziel: 'du kannst für die Horoskop-Frage <code>rh08b</code> und die Vertrauensfrage <code>pt03</code> aus Aufgabe 2 sagen, was die Codes bedeuten, wie viele gültig geantwortet haben und wem die Frage gar nicht gestellt wurde.',
    schritte: [
      { id: 'a3-p', art: 'festlegen', titel: 'Erst festlegen', vorhersage: fest('a3', 'Gefragt wurden 3.650 der 5.246 Befragten, gut zwei Drittel (knapp 70 %).'),
        mehr: [denk('Wie lege ich mich fest?', { grund: 'k3-fehlend',
          kurz: 'Du schätzt, wie vielen Befragten die Frage nach dem Vertrauen in den Bundestag (<code>pt03</code>) gestellt wurde. Es zählt nicht, ob du richtig liegst: Deine Festlegung ist der Vergleichspunkt für Schritt 4.',
          denken: [
            'Geh die drei Antworten durch und frag dich bei jeder: Was müsste dafür gelten?',
            'Wähl die Antwort, die dir am plausibelsten scheint; eine Begründung brauchst du nicht.',
            'Wie es bei <code>pt03</code> war, liest du in Schritt 4 nach.',
          ],
          verwechslung: 'Gefragt und gültig geantwortet sind zweierlei. Wer KEINE ANGABE hat, wurde gefragt, hat aber nicht gültig geantwortet.' })] },
      { id: 'a3-1', art: 'rstudio', titel: 'Im Codebuch nachschlagen (in RStudio)', haken: 'Nachgeschlagen, oder ohne RStudio übersprungen',
        text: 'Öffne in RStudio das ganze ⟪Codebuch⟫, die Beschreibung aller Variablen, und such darin mit <kbd>Strg</kbd> + <kbd>F</kbd> (Mac: <kbd>Cmd</kbd> + <kbd>F</kbd>) nach <code>rh08b</code>. Dort siehst du Variablenlabel, Codes, Wertelabels und Häufigkeiten. Die letzte Zeile der Vorlage schlägt nur <code>rh08b</code> nach. Ohne RStudio: weiter mit Schritt 3, dort steht dasselbe.',
        html: rsCode('a3_codebuch', 'für RStudio'),
        mehr: [denk('Wie schlage ich nach?', { grund: 'k3-codebuch',
          kurz: 'Das <b>Codebuch</b> listet für jede Variable Name, Variablenlabel, Codes mit Wertelabels und wie oft jeder Code vorkommt. <code>codebook(allbus)</code> öffnet es in RStudio im Viewer unten rechts.',
          denken: [
            'Führ in RStudio zuerst den Startblock aus, dann <code>codebook(allbus)</code>.',
            'Öffne das Codebuch mit „Show in new window“ im Browser und such mit <kbd>Strg</kbd>/<kbd>Cmd</kbd> + <kbd>F</kbd> nach <code>rh08b</code>.',
            'Lies dort nacheinander: Variablenlabel, Codes mit Wertelabels, Häufigkeiten.',
            'Ohne RStudio überspringst du den Schritt; Schritt 3 zeigt dasselbe.',
          ],
          verwechslung: 'Variablenlabel und Wertelabel: Das <b>⟪Variablenlabel⟫</b> beschreibt die ganze Variable, ein <b>⟪Wertelabel⟫</b> nur einen Code.',
          zusatz: 'Warum nicht im Lernjournal? Das Lernjournal im Browser kann den Viewer von RStudio nicht öffnen. Darum nimmst du in dieser Sitzung <code>frequency()</code>: Dort stehen die gültigen Antworten als eigene Zeile.' })] },
      { id: 'a3-2', art: 'code', titel: 'Erster Blick auf rh08b', wk: ['a3_rh08b'], neu: true,
        text: `${holen} und führ sie dort aus. <code>frequency()</code> zählt aus, wie oft jeder Code vorkommt. Erstes Argument: der Datensatz, zweites: die Variable, ohne Anführungszeichen. Lies in der Ausgabe: Value ist der ⟪Code⟫, also die Zahl, unter der eine Antwort gespeichert ist. Label ist das ⟪Wertelabel⟫, das Wort zu dieser Zahl, und N die Anzahl. Unter ‚Total valid‘ stehen die ⟪gültigen Antworten|gueltige-werte⟫, mit denen du rechnest. Darunter stehen die ⟪fehlenden Werte⟫, also Befragte ohne verwertbare Antwort. Ausführlich kommt <code>frequency()</code> in Sitzung 3.`,
        mehr: [denk('Total oder Total valid?', { grund: 'k3-codes',
          kurz: '<code>frequency()</code> zählt aus, wie oft jeder <b>Code</b> vorkommt. Oben stehen die Antworten, dann die Zeile ‚Total valid‘, darunter die <b>fehlenden Werte</b> mit negativen Codes.',
          denken: [
            'Führ die Vorlage im Journal aus.',
            'Lies die Ausgabe Spalte für Spalte: Value ist der Code, Label das Wertelabel, N die Anzahl.',
            'Such die Zeile ‚Total valid‘: Was steht darüber, was darunter?',
            'Frag dich bei jeder Zeile unter ‚Total valid‘: Was ist mit diesen Menschen passiert?',
          ],
          verwechslung: 'Total und Total valid: Die letzte Zeile ‚Total‘ sind alle Befragten, nicht alle Antworten. Wie viele gültig geantwortet haben, steht in ‚Total valid‘.' })] },
      { id: 'a3-3', art: 'code', titel: 'Die Vertrauensfrage pt03', wk: ['a3_pt03'],
        text: `${holen}, tausch dort die gelbe Variable gegen <code>pt03</code> und führ den Block aus. Bei den Codes 2 bis 6 steht als Wertelabel nur ‚..‘: Diese ⟪Ausprägungen⟫ liegen zwischen GAR KEIN VERTRAUEN (1) und GROSSES VERTRAUEN (7) und haben kein eigenes Wort.`,
        mehr: [denk('Was ist neu bei pt03?', { grund: 'k3-fehlend',
          kurz: 'Du zählst dieselbe Art Ausgabe für eine zweite Variable aus. Unter ‚Total valid‘ stehen wieder die <b>⟪fehlenden Werte⟫</b>; bei <code>pt03</code> ist einer davon <b>⟪TNZ⟫</b>, kurz für ‚trifft nicht zu‘.',
          denken: [
            'Tausch im Journal die gelbe Stelle gegen <code>pt03</code> und führ den Block aus. Steht oben VERTRAUEN: BUNDESTAG?',
            'Lies die Codes 1 bis 7: Nur die beiden Enden haben ein Wertelabel aus Wörtern, 2 bis 6 liegen dazwischen.',
            'Vergleich die Zeilen unter ‚Total valid‘ mit denen von <code>rh08b</code>: Welche Zeile ist neu?',
            'Vergleich TNZ: SPLIT mit KEINE ANGABE: Was unterscheidet die Befragten mit diesen beiden Codes?',
          ],
          verwechslung: 'Code und Menge: Code 7 heißt nicht „sieben Personen“. Wie viele so geantwortet haben, steht in Spalte N.',
          zusatz: 'Steht bei ‚Total valid‘ dieselbe Zahl wie bei <code>rh08b</code>, hast du noch die alte Variable ausgezählt.' }),
          probier('Parteien oder Bundestag?', 'Vertrauen die Befragten den politischen Parteien (<code>pt15</code>) weniger als dem Bundestag? Vergleiche, wie viele GAR KEIN VERTRAUEN und wie viele GROSSES VERTRAUEN haben.', T.frei_a3.code, 'a3')] },
      { id: 'a3-4', art: 'fragen', titel: 'Ergebnis festhalten', fragen: fragen('a3'),
        mehr: [denk('Wo lese ich das ab?', { grund: 'k3-ergebnis',
          kurz: 'Du liest zwei Ausgaben: die von Schritt 3 für <code>rh08b</code> und die von Schritt 4 für <code>pt03</code>. Jede Frage hat dort eine feste Zeile.',
          denken: [
            '<b>Was ein Code bedeutet:</b> In der Zeile mit diesem Value steht rechts das Wertelabel.',
            '<b>Wie viele Horoskope nicht kennen:</b> Diese Antwort ist ein fehlender Wert. Such sie unter ‚Total valid‘ und lies Spalte N.',
            '<b>Gültige Antworten:</b> die Zeile ‚Total valid‘ der passenden Ausgabe.',
            '<b>Nicht gestellt und TNZ:</b> die Zeilen unter ‚Total valid‘ in Schritt 4. Vergleich TNZ: SPLIT mit KEINE ANGABE.',
          ],
          verwechslung: 'Total ist nicht Total valid. ‚Total‘ zählt alle Befragten, ‚Total valid‘ nur die gültigen Antworten.' })] },
    ],
    ohneGrafik: ohneText },

  { id: 'a4', n: 4, titel: 'Reparieren', pflicht: false, grund: 'g4',
    frage: 'Was will R dir mit einer Fehlermeldung sagen?',
    ziel: 'du hast vier kaputte Zeilen im Lernjournal mit Hilfe der Fehlermeldungen repariert und aus den reparierten Ausgaben je eine Zahl abgelesen.',
    info: 'In jeder Vorlage steckt genau ein Fehler. Hol sie mit <b>→ Journal</b> in dein Lernjournal, führ sie dort aus, lies die Meldung, repariere die Zeile im Journal und führ sie noch einmal aus. Die Vorlage hier in der Aufgabe bleibt kaputt, so siehst du jederzeit, wie sie anfangs aussah. Willst du von vorn anfangen, entfernst du den Block im Journal mit ✕ und holst die Vorlage neu.',
    schritte: [
      { id: 'a4-p', art: 'festlegen', titel: 'Erst festlegen', vorhersage: fest('a4', 'Eine Fehlermeldung ist eine Auskunft: Lies, wo und was, und schau auf den Namen in Anführungszeichen.'),
        mehr: [denk('Wie lege ich mich fest?', { grund: 'k4-lesen',
          kurz: 'Du legst fest, was du als Erstes tust, wenn R mit einer <b>Fehlermeldung</b> antwortet. Es zählt nicht, ob du richtig liegst: Beim Reparieren merkst du, ob dein Vorgehen trägt.',
          denken: [
            'Erinnere dich an das letzte Mal, als ein Programm einen Fehler gemeldet hat: Was hast du zuerst getan?',
            'Geh die drei Möglichkeiten durch: Welche kommt deinem gewohnten Vorgehen am nächsten?',
            'Leg dich fest. In Schritt 2 bis 5 probierst du dein Vorgehen an vier kaputten Zeilen aus.',
          ],
          verwechslung: 'Rot ist nicht immer ein Fehler. Auch die Meldungen beim Laden der ⟪Pakete⟫ sind farbig; Fehler beginnen mit ‚Fehler‘ oder ‚Error‘.' })] },
      ...[1, 2, 3, 4].map(i => ({ id: `a4-${i}`, art: 'code', titel: `Reparieren ${i}`, wk: [`a4_${i}`],
        text: i === 1
          ? 'Führ die Vorlage im Journal aus und lies die Meldung: Wo, was, und welcher Name steht darin? Repariere die Zeile im Journal und führ sie noch einmal aus. Erledigt ist der Schritt, sobald der Block ohne Fehler läuft.'
          : 'Wie bei Reparieren 1: im Journal ausführen, die Meldung lesen, die Zeile reparieren, noch einmal ausführen.',
        mehr: [denk('Wo steckt der Fehler?', { grund: 'k4-reparieren',
          kurz: 'In jeder Vorlage steckt genau ein Fehler. Die Meldung sagt dir, wo (in welcher ⟪Funktion⟫) und was schiefging. Der Name in Anführungszeichen oder Backticks zeigt meist die Stelle, die du ändern musst; fehlt eine Klammer, steht oft kein Name da.',
          denken: [
            'Führ die Vorlage im Journal aus und lies die Meldung von vorn: Wo? Was?',
            'Such den Namen in Anführungszeichen oder Backticks: Wo steht er in deiner Zeile?',
            'Lies die Kommentarzeile darüber: Was soll die Zeile tun? Vergleich sie mit den Vorlagen aus Aufgabe 2 und 3, die schon liefen.',
            'Ändere nur diese eine Stelle und führ den Block noch einmal aus. Läuft er ohne Fehler, ist der Schritt erledigt.',
          ],
          verwechslung: 'Fehler und Hinweis: Nur ein Fehler (Error, Fehler) heißt, dass es kein Ergebnis gibt. ‚No variables found matching …‘ ist ein Hinweis, kein Fehler.',
          zusatz: 'Willst du von vorn anfangen, entfernst du den Block im Journal mit ✕ und holst die Vorlage neu.' }),
          ...(i === 4 ? [probier('Was ist erlaubt?', 'Manche Fehlermeldungen sagen dir sogar, was erlaubt ist. Die Vorlage sucht nur in den Variablennamen. Ändere <code>"name"</code> in <code>"titel"</code> und lies, welche Einstellungen R vorschlägt.', T.frei_a4.code, 'a4')] : [])] })),
      { id: 'a4-5', art: 'fragen', titel: 'Ergebnis festhalten', fragen: fragen('a4'),
        mehr: [denk('Wo lese ich das ab?', { grund: 'k4-ergebnis',
          kurz: 'Die Zahlen stehen erst in der Ausgabe, wenn die Zeile repariert ist. Vorher gibt es nur die Meldung.',
          denken: [
            'Prüf zuerst, ob alle vier Blöcke im Journal ohne Fehler laufen.',
            '<b>Bei <code>frequency()</code>:</b> Such die Zeile mit dem gefragten Code oder Wertelabel und lies Spalte N. Fehlende Werte stehen unter ‚Total valid‘.',
            '<b>Bei <code>find_var()</code>:</b> Zähl die Treffer, also die Zeilen der Ausgabe.',
            '<b>Die Frage zur RStudio-Konsole:</b> Was ein <code>+</code> am Zeilenanfang heißt, steht in Verstehen unter „Wenn die Konsole + zeigt“.',
          ],
          verwechslung: 'Code und Menge: Code 7 heißt nicht „sieben Personen“. Wie viele diesen Code haben, steht in Spalte N.' })] },
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
