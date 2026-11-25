/* Kapitel 5 „Kreuztabellen“: Aufgaben und Zusatzinfos für die Lernpfad-Engine.
   Wird nach daten.js geladen; die Engine ruft window.KAPITEL(hilfen) einmal auf.
   Geprüft wird mit PRUEFEN aus bausteine.tsx (check.ts des Atlas: ganze Zahlen ±0,55, Rückmeldung je typischem Wert). */
'use strict';
window.KAPITEL = ({ D, T, esc, warum, denk }) => {
// Dieses Kapitel hat keine bilder/; die Engine fragt in denk-Fenstern trotzdem D.SVG[bild] ab. Leeres Objekt, damit React-Bilder aus BILDER greifen.
if (!D.SVG) D.SVG = {};

/* ---------- Schrittnummern ----------
   Im Atlas zählten die Schritte ohne Festlegung. Auf dieser Seite ist „Erst festlegen“ Schritt 1,
   darum steht jede Aufgabe hier um eins weiter: „Schritt 2“ in content.ts ist hier Schritt 3. */
const weiter = s => typeof s === 'string'
  ? s.replace(/(Schritt(?:e|en)?)((?: (?:\d|und|bis))+)/g, (m, w, r) => w + r.replace(/\d/g, d => String(+d + 1)))
  : s;
/** Hinweise, die auf Grundlagen-Karten des Atlas zeigten, zeigen hier auf Verstehen. */
const HILFE_NEU = {
  a1d: 'Verstehen zu Aufgabe 1: Dummyvariable.',
  a3f: 'Verstehen zu Aufgabe 3: Zusammenhang und Ursache.',
};
const frage = q => {
  const neu = { ...q, label: weiter(q.label), help: HILFE_NEU[q.id] ?? weiter(q.help), hint: weiter(q.hint), right: weiter(q.right) };
  if (q.wrong) neu.wrong = Object.fromEntries(Object.entries(q.wrong).map(([k, v]) => [k, weiter(v)]));
  return neu;
};
const FRAGEN = Object.fromEntries(Object.entries(D.QUESTIONS).map(([k, qs]) => [k, qs.map(frage)]));
// Hilfe in drei Stufen: dieselben Texte, Schrittnummern wie auf dieser Seite (die Engine liest D.HINTS).
for (const k of Object.keys(D.HINTS)) D.HINTS[k] = D.HINTS[k].map(weiter);

/** Festlegung aus PREDICTIONS; `resolve` wird zur Auflösung, sobald alle Fragen der Aufgabe richtig sind. */
const festlegung = k => {
  const p = D.PREDICTIONS[k];
  return { id: p.id, prompt: p.prompt, options: p.options, ...(p.resolve ? { aufloesung: p.resolve } : {}) };
};

/* ---------- Aufgaben ---------- */
const TASKS = [
  { id: 'a1', n: 1, titel: 'Zwei Gruppen für die Wahlfrage', pflicht: true, grund: 'g1',
    frage: 'Wer misstraut den Politikern, und wer würde nicht wählen?',
    ziel: 'zwei neue Variablen mit nur 0 und 1, <code>misstrauen</code> und <code>nichtwahl</code>, und du kannst sagen, wie groß jede Gruppe ist und wer herausfällt.',
    info: 'Im ALLBUS 2023 sollten die Befragten sagen, ob sie dieser Aussage zustimmen: „Die Politiker kümmern sich nicht viel darum, was Leute wie ich denken.“ (<code>pe01</code>, von „stimme voll zu“ bis „stimme gar nicht zu“). Und sie wurden gefragt, welche Partei sie wählen würden, wenn am nächsten Sonntag Bundestagswahl wäre (<code>pv01</code>, kennst du aus Sitzung 2 und 3). Wer antwortet, er würde nicht wählen, hat den Code 91. Für eine Kreuztabelle brauchst du aus beiden Fragen je zwei Gruppen.',
    infoMehr: [warum('Misst pe01 wirklich Misstrauen?', 'Das ist eine Frage der <b>Gültigkeit</b> (kennst du aus Sitzung 1): Streng genommen fragt <code>pe01</code>, ob man sich von Politikern beachtet fühlt, nicht nach Vertrauen. Wir nennen die Gruppe hier kurz <code>misstrauen</code>. Wenn du über das Ergebnis berichtest, nennst du die genaue Aussage.', 'k1-aussage')],
    schritte: [
      { id: 'a1-p', art: 'festlegen', titel: 'Erst festlegen', vorhersage: festlegung('a1'),
        mehr: [denk('Wie lege ich mich fest?', { grund: 'k1-aussage',
          kurz: 'Du schätzt, wie viele der Befragten mit gültiger Antwort der Aussage zustimmen, voll oder eher. Es zählt nicht, ob du richtig liegst: Deine Festlegung ist der Vergleichspunkt, an dem du später merkst, ob dich das Ergebnis überrascht.',
          denken: [
            'Lies die Aussage genau: „Die Politiker kümmern sich nicht viel darum, was Leute wie ich denken.“ Wer zustimmt, fühlt sich von Politikern nicht beachtet.',
            'Zustimmung gibt es in zwei Stärken, „voll“ und „eher“. Hier zählen beide.',
            'Gezählt werden nur Befragte mit gültiger Antwort. Wer die Frage nicht bekommen hat, zählt nicht mit.',
            'Wähl eine der drei Spannen. Ob sie stimmt, siehst du, wenn in Schritt 5 alle Fragen richtig sind.',
          ],
          verwechslung: '<code>pe01</code> fragt streng genommen, ob man sich von Politikern beachtet fühlt, nicht nach Vertrauen. Der Name <code>misstrauen</code> ist eine Abkürzung; im Bericht nennst du die genaue Aussage (<b>Gültigkeit</b>).' })] },
      { id: 'a1-1', art: 'code', titel: 'Die Codes von pe01 ansehen', wk: ['a1_freq'], bekannt: 'frequency() aus Sitzung 3',
        text: 'Führe die Vorlage im Journal aus. In der Spalte Value steht der Code jeder Antwort, daneben ihr Wort. Unten fällt eine große Zahl auf: 1.596 Befragte bei ‚TNZ: SPLIT‘. Das heißt: Diese Frage stand nur in einem Teil der Fragebögen (Fragebogensplit). Diese Menschen haben also nicht verweigert, sie wurden nicht gefragt.',
        mehr: [denk('Was heißt Fragebogensplit?', { grund: 'k1-codes',
          kurz: '<code>frequency(pe01)</code> zeigt jede Antwort mit ihrem <b>Code</b> (Spalte Value), ihrem Wort, ihrer Anzahl (N) und ihrem Anteil (Valid %). Darunter stehen die fehlenden Werte. Viele fehlen wegen des <b>Fragebogensplits</b>: Kurz gesagt, nicht alle Befragten bekamen diese Frage.',
          denken: [
            'Such die Spalte Value: Welcher Code gehört zu welchem Wort? Diese Codes brauchst du in Schritt 3 für die Regel.',
            'Schau unter die gültigen Antworten: Welche Zeilen sind fehlende Werte, und welche davon ist die größte?',
            'Frag dich: Haben diese Menschen verweigert, oder wurden sie gar nicht gefragt? Der Aufkleber ‚TNZ: SPLIT‘ sagt es dir.',
            'Merk dir: Wer bei <code>pe01</code> fehlt, fehlt später auch in jeder Tabelle mit <code>pe01</code>.',
          ],
          verwechslung: 'Fehlend heißt nicht verweigert. Wer im Split die Frage nicht bekam, hat keine Antwort, ohne verweigert zu haben.' })] },
      { id: 'a1-2', art: 'code', titel: 'Die Gruppe misstrauen bilden und prüfen', wk: ['a1_misstrauen'], neu: true,
        text: 'Eine Regel liest du ‚aus diesen alten Codes wird dieser neue Code‘: <code>1=1</code> heißt, aus 1 wird 1; <code>2:4=0</code> heißt, aus 2 bis 4 wird 0. Die Vorlage zählt bisher nur ‚stimme voll zu‘ als Misstrauen. Wer zustimmt, ob voll oder eher, sagt aber, dass sich Politiker nicht kümmern. Passe im Journal die beiden markierten Stellen an: Welche Codes gehören zu ‚misstraut‘, welche zu ‚misstraut nicht‘? Die Codes stehen in Schritt 2 in der Spalte Value. Die Kette bildet die Variable und zählt sie gleich aus: Schau auf die Spalte N und auf die Kopfzeile mit <code>mean=</code>.',
        mehr: [denk('Wie lese ich die Vorlage?', { grund: 'k1-regel',
          kurz: '<code>mutate()</code> fügt die neue Variable <code>misstrauen</code> hinzu, <code>rec()</code> kodiert die Codes von <code>pe01</code> nach der Regel in <code>rules</code> um (<b>umkodieren</b>), <code>frequency()</code> zählt das Ergebnis gleich aus. Du passt nur die gelben alten Codes links vom <code>=</code> an.',
          denken: [
            'Lies jeden Teil der Regel als ‚aus diesen alten Codes wird dieser neue Code‘. Was zählt die Vorlage bisher als ‚misstraut‘?',
            'Geh zu den Wörtern aus Schritt 2: Welche Antworten sagen, dass sich Politiker nicht kümmern? Welche Codes stehen daneben in Value?',
            'Mehrere Codes schreibst du von bis mit Doppelpunkt, Regeln trennt ein Semikolon. Prüf, ob jeder gültige Code in einer der beiden Gruppen landet.',
            'Schau nach dem Ausführen auf die Spalte N und die Kopfzeile mit <code>mean=</code>: Passt jede Gruppe zu ihrem Namen?',
          ],
          bild: 'Regel', bildtext: 'So ist jede Regel gebaut, hier am Beispiel <code>teilzeit</code> aus „R lesen“. Deine Regel für <code>misstrauen</code> folgt demselben Muster.',
          verwechslung: 'Regeln trennt ein Semikolon <code>;</code>, kein Komma. Mit Komma meldet R <code>Invalid new value</code>. Und links vom <code>=</code> stehen Codes, keine Wörter.' }),
          warum('Warum heißt das eine Entscheidung?', 'Welche Antworten in eine Gruppe gehören, entscheidet die Frage, nicht die Statistik. Jede Einteilung ergibt eine andere Zahl. Darum sagst du im Bericht, wie du zusammengefasst hast.', 'k1-zuschnitt')] },
      { id: 'a1-3', art: 'code', titel: 'Die Gruppe nichtwahl bilden und prüfen', wk: ['a1_nichtwahl'],
        text: 'Diese Regel ist fertig: <code>91=1</code> heißt, aus 91 wird 1; <code>1:90=0</code> heißt, aus 1 bis 90 wird 0 (das sind alle Parteien); alles andere wird leer. Führe die Vorlage im Journal aus und schau, wie viele in jeder Gruppe sind und wie viele leer bleiben (Zeile System).',
        mehr: [denk('Was steht in der Zeile System?', { grund: 'k1-nichtwahl',
          kurz: 'Die Regel für <code>nichtwahl</code> ist fertig: <code>91=1</code> macht aus „würde nicht wählen“ eine 1, <code>1:90=0</code> macht aus jeder Partei eine 0. Jeder Code, der in keiner Regel steht, fällt unter <code>else</code>. Bei neuen Variablen fasst <code>frequency()</code> alle Leeren in der Zeile <b>System</b> zusammen.',
          denken: [
            'Lies die beiden Regeln: Welche Codes von <code>pv01</code> kommen darin vor?',
            'Welche Antworten gibt es bei <code>pv01</code> außer den Parteien und 91? Kommen ihre Codes in einer der beiden Regeln vor?',
            'Schau nach dem Ausführen auf die Spalte N: Wie viele sind in Gruppe 1, wie viele in Gruppe 0?',
            'Schau dann in die Zeile System: Wer alles steckt darin?',
          ],
          verwechslung: '„leer“ und „0“: Eine 0 ist eine Antwort („trifft nicht zu“) und zählt im Nenner mit. Leer (NA) heißt „gehört nicht dazu“ und fällt aus der Rechnung.' })] },
      { id: 'a1-4', art: 'fragen', titel: 'Ergebnis festhalten', fragen: FRAGEN.a1,
        mehr: [denk('Wo lese ich das ab?', { grund: 'k1-ergebnis',
          kurz: 'Jede der Fragen hat einen festen Ort: die Ausgabe von Schritt 3 für <code>misstrauen</code>, die von Schritt 4 für <code>nichtwahl</code> und die Regel selbst für alle, die herausfallen.',
          denken: [
            '<b>Wie viele misstrauen:</b> Ausgabe von Schritt 3, Spalte N, Zeile ‚misstraut‘. Prüf vorher, ob deine Regel zu den Wörtern aus Schritt 2 passt.',
            '<b>Wie viele nicht wählen würden:</b> Ausgabe von Schritt 4, Spalte N, Zeile ‚würde nicht wählen‘.',
            '<b>Nicht Wahlberechtigte:</b> Kommt ihr Code in einer der beiden Regeln vor? Wenn nicht, greift <code>else</code>.',
            '<b><code>mean=</code>:</b> Bei einer Variable mit nur 0 und 1 zählt jede 1 als eins und jede 0 als null. Was ergibt dann der Mittelwert? Vergleich die Zahl mit Valid % in der Zeile ‚misstraut‘.',
          ],
          verwechslung: 'R schreibt Tausender mit Komma: 1,596 heißt 1.596.' })] },
      { id: 'a1-5', art: 'bild', titel: 'Im Bild: zwei neue Türme', baustein: 'MutateA1',
        mehr: [denk('Was zeigt das Bild?', { grund: 'k1-ergebnis',
          kurz: 'Das Bild erscheint, wenn in Schritt 5 alle Fragen richtig sind. Es zeigt an fünf Beispiel-Befragten, was <code>mutate()</code> gemacht hat: Neben <code>pe01</code> und <code>pv01</code> stehen zwei neue Türme, <code>misstrauen</code> und <code>nichtwahl</code>.',
          denken: [
            'Folge jeder grauen Linie: Aus welchem alten Stein wird welcher neue?',
            'Welcher leere Stein ist orange markiert, und warum?',
            'Vergleich mit deinen Regeln aus Schritt 3 und 4: Passt jeder neue Stein dazu?',
          ],
          verwechslung: '<code>mutate()</code> ersetzt die alte Variable nicht. <code>pe01</code> und <code>pv01</code> bleiben, wie sie waren; die neuen Türme kommen dazu.' })] },
    ],
    probier: { idee: 'Antworten die Befragten mit gültiger Wahlabsicht anders auf pe01?', code: T.frei_a1.code },
    ohneGrafik: 'Alle Antworten stehen in den Tabellen der Schritte 2 bis 4. Das Bild in Schritt 6 hat eine Textfassung.' },

  { id: 'a2', n: 2, titel: 'Stimmt die 87 %?', pflicht: true, grund: 'g2',
    frage: 'Angenommen, du liest diesen Satz: „87 Prozent der Nichtwähler sagen, dass sich Politiker nicht darum kümmern, was Leute wie sie denken.“ Stimmt die Zahl, und worauf bezieht sie sich?',
    ziel: 'du hast die 87 % in R gefunden, kannst sagen, wer dabei 100 % ist, und weißt, welche Zahl derselben Zelle welche Frage beantwortet.',
    schritte: [
      { id: 'a2-p', art: 'festlegen', titel: 'Erst festlegen', vorhersage: festlegung('a2'),
        mehr: [denk('Wie finde ich die Basis?', { grund: 'k2-drei',
          kurz: 'Eine Prozentzahl sagt erst etwas, wenn klar ist, wer 100 % ist: die <b>Basis</b>, kurz gesagt der Nenner. Du legst fest, welche Gruppe bei „87 Prozent der Nichtwähler“ die 100 % bildet. In Schritt 2 prüfst du es in R.',
          denken: [
            'Lies den Satz langsam: Über welche Menschen spricht er, und wer davon wäre 100 %?',
            'Stell dir die Kreuztabelle vor: Wäre diese Gruppe eine Zeile, eine Spalte oder die ganze Tabelle?',
            'Wähl eine Antwort. In Schritt 2 prüfst du sie in R.',
          ],
          verwechslung: 'Spaltenprozente lesen und eine Aussage über die Zeile machen: „73,7 % der Teilzeitkräfte sind Frauen“ heißt nicht „73,7 % der Frauen arbeiten Teilzeit“.' })] },
      { id: 'a2-1', art: 'code', titel: 'Die Prozentbasis finden, die 87 % ergibt', wk: ['a2_ct'], neu: true,
        text: 'Die ersten Zeilen der Vorlage bilden <code>misstrauen</code> und <code>nichtwahl</code> wie in Aufgabe 1. Du änderst im Journal nur die letzte Zeile. Die Vorlage zeigt Zeilenprozente (<code>"row"</code>). Probier auch <code>"col"</code> (Spaltenprozente) und <code>"total"</code> (Gesamtprozente). Schau jedes Mal auf dieselbe Zelle: Zeile ‚misstraut‘, Spalte ‚würde nicht wählen‘. Bei welcher Basis steht dort 87.0%?',
        mehr: [denk('Woran erkenne ich, wer 100 % ist?', { grund: 'k2-code',
          kurz: '<code>percentages =</code> legt fest, worauf sich die Prozent in jeder Zelle beziehen: <code>"row"</code> nimmt jede Zeile als 100 % (<b>Zeilenprozente</b>), <code>"col"</code> jede Spalte (<b>Spaltenprozente</b>), <code>"total"</code> die ganze Tabelle (<b>Gesamtprozente</b>). Die Anzahl in der Zelle bleibt gleich, nur der Nenner wechselt.',
          denken: [
            'Such zuerst die Zelle: Zeile ‚misstraut‘, Spalte ‚würde nicht wählen‘. Oben steht die Anzahl, darunter das Prozent.',
            'Stell im Journal die letzte Zeile nacheinander auf alle drei Einstellungen und schau jedes Mal auf dieselbe Zelle.',
            'Prüf an der Kopfzeile <code>- Percentages:</code> und an den 100 %, welche Basis gerade gilt: am Ende jeder Zeile, unter jeder Spalte oder nur ganz unten rechts?',
            'Vergleich mit dem Satz aus der Aufgabe: Bei welcher Einstellung ist die Gruppe nach „der“ die 100 %?',
          ],
          bild: 'BasisSchalter', bildtext: 'Am Beispiel der Erwerbstätigkeit: Stell die Prozent um und wähle eine Zelle. Gelb umrahmt ist die Basis, der Satz darunter sagt, welche Frage die Zahl beantwortet.',
          verwechslung: '<code>percentages</code> falsch geschrieben oder ohne Anführungszeichen: R meldet <code>\'arg\' should be one of …</code>. Erlaubt sind <code>"row"</code>, <code>"col"</code>, <code>"total"</code> und <code>"all"</code>.',
          zusatz: 'R schreibt Kommazahlen mit Punkt: 51.7% heißt 51,7 %.' }),
          warum('Warum stehen die mutate()-Zeilen schon wieder da?', 'Jede Vorlage bildet ihre Variablen selbst. So läuft sie für sich allein, auch wenn du die Vorlagen aus Aufgabe 1 nicht oder in anderer Reihenfolge ausgeführt hast.', 'k2-neu')] },
      { id: 'a2-2', art: 'code', titel: 'Eine Zelle, drei Prozentbasen', wk: ['a2_all'],
        text: 'Mit <code>"all"</code> stehen in jeder Zelle drei Prozentzahlen untereinander: <code>row %</code>, <code>col %</code> und <code>total %</code>. Alle drei gehören zu denselben Menschen in dieser Zelle. Ordne in Schritt 4 jeder Frage ihre Zahl zu.',
        mehr: [denk('Drei Zahlen in einer Zelle', { grund: 'k2-all',
          kurz: 'Mit <code>"all"</code> stehen in jeder Zelle unter der Anzahl drei Prozentzahlen: <code>row %</code>, <code>col %</code> und <code>total %</code>. Alle drei teilen dieselbe Anzahl, nur durch verschiedene Nenner.',
          denken: [
            'Such wieder die Zelle ‚misstraut‘ und ‚würde nicht wählen‘ und lies die drei Prozent untereinander.',
            'Frag dich bei jeder Zahl: Wer ist hier 100 %, die Zeile, die Spalte oder alle in der Tabelle?',
            'Nimm dann jede der drei Fragen aus Schritt 4 und such die Gruppe nach „der“: Steht sie in den Zeilen, in den Spalten, oder sind es alle?',
            'Die Nenner selbst findest du am Rand, in der Spalte und der Zeile Total.',
          ],
          bild: 'NennerBeispiel',
          verwechslung: 'Die drei Prozentzahlen einer Zelle ergeben zusammen keine 100 %. Jede hat ihren eigenen Nenner.' }),
          warum('Wer steht überhaupt in der Tabelle?', 'Nur wer bei <b>beiden</b> Variablen eine gültige Angabe hat. Wie viele das sind, steht in der Kopfzeile bei <code>N (valid)</code>, wie viele fehlen, bei <code>Missing</code>.', 'k2-ergebnis')] },
      { id: 'a2-3', art: 'fragen', titel: 'Ergebnis festhalten', fragen: FRAGEN.a2,
        text: 'Bei (1) bis (3) geht es um eine Zelle: Welche Zahl derselben Zelle beantwortet welche Frage?',
        mehr: [denk('Wo lese ich das ab?', { grund: 'k2-ergebnis',
          kurz: 'Schritt 4 fragt nach der Einstellung, nach der Anzahl in der Zelle, nach der Basis, nach der Zuordnung der drei Zahlen und danach, ob die Zahl aus dem Satz stimmt. Alles steht in den Ausgaben von Schritt 2 und 3.',
          denken: [
            '<b>Einstellung:</b> Bei welcher der drei Einstellungen aus Schritt 2 stand in der Zelle die Zahl aus dem Satz?',
            '<b>Anzahl und Basis:</b> Die Anzahl ist die obere Zahl in der Zelle, nicht die Summe am Rand. Die Nichtwählenden in der Tabelle stehen in der Zeile Total unter ‚würde nicht wählen‘.',
            '<b>Zuordnung (1) bis (3):</b> Such in jeder Frage die Gruppe nach „der“ und nimm aus Schritt 3 die Prozentzahl mit dieser Basis.',
            '<b>Stimmt die Zahl?</b> Steht sie in einer der Ausgaben? Ob sie die Leitfrage beantwortet, klärt erst Aufgabe 3.',
          ],
          verwechslung: 'Die Zahl der Nichtwählenden in der Tabelle ist nicht die aus <code>frequency(nichtwahl)</code>. In der Tabelle fehlen alle ohne gültige Angabe bei <code>pe01</code>.' })] },
      { id: 'a2-4', art: 'bild', titel: 'Im Bild: dieselben Menschen, drei Nenner', baustein: 'Nenner',
        mehr: [denk('Was zeigt das Bild?', { grund: 'k2-all',
          kurz: 'Das Bild erscheint, wenn in Schritt 4 die Fragen zur Einstellung, zur Anzahl, zu den Nichtwählenden und (1) bis (3) richtig sind. Es legt dieselben Menschen aus der Zelle in drei Balken, die so lang sind wie ihr Nenner.',
          denken: [
            'Das orange Stück ist in allen drei Balken gleich groß. Warum wirkt es einmal fast wie alles und einmal klein?',
            'Ordne jeden Balken einer Basis zu: Zeilen-, Spalten- oder Gesamtprozent.',
            'Leg das Bild neben deine Zuordnung aus Schritt 4.',
          ],
          verwechslung: 'Ein hohes Prozent heißt nicht, dass viele Menschen gemeint sind. Dieselben Menschen können ein großer Teil einer kleinen Gruppe und ein kleiner Teil aller sein.' })] },
    ],
    probier: { idee: 'Misstrauen Befragte im Osten häufiger als im Westen?', code: T.frei_a2.code },
    ohneGrafik: 'Alle Zahlen stehen in der Ausgabe von Schritt 3. Das Bild in Schritt 5 hat eine Textfassung.' },

  { id: 'a3', n: 3, titel: 'Gehen Misstrauende nicht mehr wählen?', pflicht: true, grund: 'g3',
    frage: 'Gehen Misstrauende nicht mehr wählen?',
    ziel: 'du kannst mit der passenden Prozentbasis sagen, ob Misstrauende häufiger nicht wählen wollen als die übrigen, um wie viele Prozentpunkte, und was die Tabelle nicht zeigt.',
    info: 'In Aufgabe 2 hast du gesehen: Die 87 % stimmen, aber ihre Basis sind die Nichtwählenden. Die Leitfrage fragt etwas anderes: ob Misstrauen mit Nichtwahl zusammenhängt. Welche Gruppen du dafür vergleichen musst, legst du gleich fest.',
    schritte: [
      { id: 'a3-p', art: 'festlegen', titel: 'Erst festlegen', vorhersage: festlegung('a3'),
        mehr: [denk('Welche Gruppen vergleiche ich?', { grund: 'k3-vergleich',
          kurz: 'Die Leitfrage fragt nach einem Unterschied. Fair vergleichen kannst du nur, wenn jede Gruppe der <b>unabhängigen Variable (UV)</b>, kurz gesagt der möglichen Ursache, für sich 100 % ist. Dann vergleichst du zwischen diesen Gruppen den Anteil der <b>abhängigen Variable (AV)</b>, also dessen, was erklärt werden soll.',
          denken: [
            'Lies die Leitfrage: Über welche Gruppe macht sie eine Aussage, und was soll bei ihr häufiger vorkommen?',
            'Frag dich: Was soll hier was erklären? Was ist die UV, was die AV?',
            'Prüf beide Optionen: Welche setzt die Gruppen der UV auf 100 % und vergleicht dann ihren Anteil an der AV?',
            'Wähl eine. Ob sie trägt, merkst du beim Vergleichen in Schritt 3.',
          ],
          verwechslung: 'Den Frauenanteil unter Teilzeit- und Vollzeitkräften vergleichen statt den Teilzeit-Anteil von Frauen und Männern: Dann ist die AV 100 %, nicht die UV.' })] },
      { id: 'a3-1', art: 'code', titel: 'Die Prozentbasis einstellen', wk: ['a3_ct'],
        text: 'Die ersten Zeilen bilden wieder <code>misstrauen</code> und <code>nichtwahl</code> wie in Aufgabe 1. Die Vorlage nutzt noch die Spaltenprozente aus Aufgabe 2. <code>misstrauen</code> ist hier die mögliche Ursache (UV) und steht in den Zeilen. Stell im Journal die markierte Stelle so ein, dass jede Gruppe von <code>misstrauen</code> 100 % ist.',
        mehr: [denk('Welche Gruppe ist 100 %?', { grund: 'k3-code',
          kurz: 'Für einen Vergleich ist jede Gruppe der UV für sich 100 %. <code>crosstab()</code> setzt die erste Variable in die Zeilen, die zweite in die Spalten. Wo die UV steht, entscheidet, welche Einstellung das leistet.',
          denken: [
            'Schau in die letzte Zeile der Vorlage: Welche Variable steht zuerst, welche an zweiter Stelle? Wo landet also <code>misstrauen</code>?',
            'Erinner dich an Aufgabe 2: Welche Einstellung nimmt die Zeilen als 100 %, welche die Spalten, welche die ganze Tabelle?',
            'Führ die Vorlage aus und prüf an der Ausgabe: Steht 100.0% jetzt am Ende jeder Gruppe von <code>misstrauen</code>?',
          ],
          verwechslung: 'Die passende Einstellung hängt nicht an den Wörtern „Zeile“ und „Spalte“, sondern daran, wo die UV steht. Tauschst du die Reihenfolge in <code>crosstab()</code>, tauscht auch die passende Einstellung.' })] },
      { id: 'a3-2', art: 'lesen', titel: 'Vergleichen und deuten',
        text: 'Lies in der Spalte ‚würde nicht wählen‘ beide Gruppen ab und zieh ab: Das ist der Abstand in Prozentpunkten. Schau auch in die Spalte ‚würde wählen‘: Wie viele der Misstrauenden wollen wählen?',
        mehr: [denk('Prozent oder Prozentpunkte?', { grund: 'k3-deuten',
          kurz: 'Du liest in der Spalte ‚würde nicht wählen‘ beide Gruppen ab und beschreibst den Unterschied. Den Abstand zweier Anteile bekommst du durch Abziehen: <b>Prozentpunkte</b>. Teilen ergibt das Verhältnis, „wievielmal so häufig“. Beides ist richtig, aber nicht dasselbe.',
          denken: [
            'Geh in die Spalte ‚würde nicht wählen‘: Welches Prozent steht in der Zeile ‚misstraut‘, welches in ‚misstraut nicht‘?',
            'Zieh die kleinere Zahl von der größeren ab. Das ist der Abstand in Prozentpunkten.',
            'Schau dann in die Spalte ‚würde wählen‘: Wie viele der Misstrauenden wollen wählen? Passt ein Satz mit „alle“ oder „keiner mehr“ dazu?',
            'Frag dich zuletzt: Zeigt eine Kreuztabelle, was zusammen vorkommt, oder auch, warum?',
          ],
          bild: 'Prozentpunkte', bildtext: 'Am Beispiel der Erwerbstätigkeit: derselbe Unterschied einmal als Abstand, einmal als Verhältnis.',
          verwechslung: 'Prozent und Prozentpunkte: Steigt ein Anteil von 20 % auf 30 %, sind das 10 Prozentpunkte mehr, aber 50 Prozent mehr.',
          zusatz: 'Nenne zu jeder Gruppe ihr n. Prozent aus wenigen Menschen wackeln.' })] },
      { id: 'a3-3', art: 'fragen', titel: 'Ergebnis festhalten', fragen: FRAGEN.a3,
        mehr: [denk('Wo lese ich das ab?', { grund: 'k3-ergebnis',
          kurz: 'Schritt 4 fragt nach der Basis, nach den beiden Anteilen, nach ihrem Abstand, nach einem passenden Satz und danach, ob die Tabelle eine Ursache zeigt. Alle Zahlen stehen in der Tabelle aus Schritt 2.',
          denken: [
            '<b>Basis und Anteile:</b> Welche Einstellung hast du in Schritt 2 gewählt? Lies dann in der Spalte ‚würde nicht wählen‘ beide Zeilen ab.',
            '<b>Abstand:</b> abziehen, in Prozentpunkten.',
            '<b>Passender Satz:</b> Er muss zum Unterschied <b>und</b> zur Spalte ‚würde wählen‘ passen. Prüf jedes starke Wort.',
            '<b>Ursache:</b> Zeigt eine Kreuztabelle, was zusammen vorkommt, oder auch, warum?',
          ],
          verwechslung: 'Den Abstand durch Teilen statt durch Abziehen bilden: Das ergibt ein Verhältnis, keine Prozentpunkte.' })] },
    ],
    plenum: 'Schreib deinen Faktencheck in zwei Sätzen ins Journal und bring ihn mit: Was stimmt an „87 Prozent der Nichtwähler …“, und beantwortet die Zahl die Frage, ob Misstrauende nicht mehr wählen gehen? Nenne beide Zahlen mit ihrer Basis.',
    probier: { idee: 'Wie sieht die Tabelle als Bild aus?', code: T.frei_a3.code },
    ohneGrafik: 'Die Tabelle aus Schritt 2 enthält alle Zahlen.' },

  { id: 'a4', n: 4, titel: 'Gegenprobe mit einer umgedrehten Aussage', pflicht: false, grund: 'g4',
    frage: 'Kommt dasselbe heraus, wenn man Misstrauen mit einer anderen Aussage misst?',
    ziel: 'du hast eine zweite Aussage umgepolt, daraus eine Misstrauens-Gruppe gebildet und weißt, warum die Regel aus Aufgabe 1 ohne Umpolen das Gegenteil misst.',
    info: 'Im selben Fragebogenteil stand die Aussage: „Die Politiker vertreten die Interessen der Bevölkerung.“ (<code>pe05</code>, wieder von 1 „stimme voll zu“ bis 4 „stimme gar nicht zu“). Wer hier zustimmt, vertraut den Politikern. Misstrauen zeigt, wer <b>nicht</b> zustimmt. Die Aussage ist also andersherum gestellt als <code>pe01</code>.',
    schritte: [
      { id: 'a4-p', art: 'festlegen', titel: 'Erst festlegen', vorhersage: festlegung('a4'),
        mehr: [denk('Was misst die Regel?', { grund: 'k4-richtung',
          kurz: 'Eine Regel arbeitet nur mit Codes; sie kennt die Aussage dahinter nicht. Du legst fest, wen die Regel aus Aufgabe 1 als ‚misstraut‘ zählt, wenn du sie unverändert auf <code>pe05</code> anwendest.',
          denken: [
            'Lies beide Aussagen in den Aufgaben 1 und 4 noch einmal.',
            'Schau dir die Regel aus Aufgabe 1 an: Sie arbeitet nur mit Codes.',
            'Wähl eine Option. In Schritt 4 siehst du, was ohne Umpolen herauskommt.',
          ],
          verwechslung: 'Umpolen ist kein Fehlerbeheben. Die Daten waren vorher nicht falsch, sie zählten nur in die andere Richtung.' })] },
      { id: 'a4-1', art: 'code', titel: 'pe05 umpolen', wk: ['a4_um'], neu: true,
        text: '<code>rules = "rev"</code> dreht die Codes um: Aus 1 wird 4, aus 2 wird 3, aus 3 wird 2, aus 4 wird 1. Prüf in der Ausgabe im Journal, welches Wort jetzt bei Code 1 steht.',
        mehr: [denk('Wie rechnet rev?', { grund: 'k4-umpolen',
          kurz: '<code>rec(pe05, rules = "rev")</code> dreht die Codes der Skala um (<b>umpolen</b>): Kurz gesagt wird der kleinste zum größten und umgekehrt. R rechnet kleinster plus größter minus alter Code. Die Antworten bleiben dieselben, die Wörter wandern mit ihren Codes mit.',
          denken: [
            'Nimm ein Wort aus <code>pe05</code>, etwa „stimme eher zu“: Welchen Code hatte es vorher, und welchen bekommt es nach der Rechnung?',
            'Lies in der Ausgabe von <code>frequency(pe05_um)</code> die Spalte Value und daneben das Wort: Was steht jetzt bei Code 1?',
            'Schau auf die fehlenden Werte: Bleiben sie leer?',
          ],
          bild: 'Umpolen', bildtext: 'Am Beispiel der Wirtschaftslage mit fünf Stufen. Bei <code>pe05</code> mit vier Stufen geht es genauso.',
          verwechslung: 'Umpolen ändert keine Antwort und keine Anzahl. In jeder Stufe stehen gleich viele Menschen wie vorher, nur unter einem anderen Code.' })] },
      { id: 'a4-2', art: 'code', titel: 'Die Misstrauens-Gruppe bilden und vergleichen', wk: ['a4_mutate'],
        text: 'Die Kette polt pe05 wie in Schritt 2 um, bildet daraus <code>misstrauen_pe05</code> und dazu <code>nichtwahl</code> wie in Aufgabe 1. Wie in Aufgabe 1 zählt bisher nur der äußerste Code als Misstrauen. Passe im Journal die markierten Stellen an: Welche Codes von <code>pe05_um</code> heißen jetzt Misstrauen? Das Wort zu jedem Code steht in der Ausgabe von Schritt 2.',
        mehr: [denk('Welche Codes heißen jetzt Misstrauen?', { grund: 'k4-gegenprobe',
          kurz: 'Ein einziges <code>mutate()</code> bildet drei Variablen von oben nach unten: <code>pe05_um</code>, daraus <code>misstrauen_pe05</code>, dann <code>nichtwahl</code>. Die gelben Stellen sind wieder alte Codes, diesmal von <code>pe05_um</code>. <code>crosstab()</code> vergleicht die Gruppen dann mit Zeilenprozenten wie in Aufgabe 3.',
          denken: [
            'Hol dir die Ausgabe aus Schritt 2: Welches Wort steht jetzt bei welchem Code von <code>pe05_um</code>?',
            'Frag dich wie in Aufgabe 1: Welche Antworten auf „Die Politiker vertreten die Interessen der Bevölkerung.“ zeigen Misstrauen, und in wie vielen Stärken gibt es sie?',
            'Trag diese Codes links vom <code>=</code> bei ‚misstraut‘ ein, die übrigen bei ‚misstraut nicht‘.',
            'Lies dann in der Spalte ‚würde nicht wählen‘ beide Zeilen ab.',
          ],
          verwechslung: 'Fehlt eine der Zeilen im <code>mutate()</code>, meldet R, dass es die Variable nicht gibt. Kopiere die Vorlage dann neu und ändere nur die markierten Stellen.' })] },
      { id: 'a4-3', art: 'code', titel: 'Zum Vergleich: ohne Umpolen', wk: ['a4_ohne'],
        text: 'Was wäre passiert, wenn du die Regel aus Aufgabe 1 einfach auf pe05 übertragen hättest? Führe die Vorlage im Journal aus und vergleiche mit Schritt 3. Hier fehlt die Zeile mit <code>rev</code>.',
        mehr: [denk('Rechnet R hier falsch?', { grund: 'k4-ohne',
          kurz: 'Die Vorlage überträgt die Regel aus Aufgabe 1 ohne Umpolen auf <code>pe05</code>; die Zeile mit <code>rev</code> fehlt. Sonst ist die Kette gebaut wie in Schritt 3.',
          denken: [
            'Lies die Regel: Welche Codes von <code>pe05</code> zählen hier als ‚misstraut‘?',
            'Schau in die Aufgabe: Was sagen Menschen mit diesen Codes über die Politiker?',
            'Leg die Tabelle neben die aus Schritt 3: Was ist mit der Zeile ‚misstraut‘ passiert?',
            'Frag dich: Liegt ein Unterschied zu Schritt 3 an R oder an der Regel?',
          ],
          verwechslung: 'Ohne die Zeile mit <code>rev</code> bezieht sich die Regel auf die Codes von <code>pe05</code>, nicht auf die von <code>pe05_um</code>.' })] },
      { id: 'a4-4', art: 'fragen', titel: 'Ergebnis festhalten', fragen: FRAGEN.a4,
        mehr: [denk('Wo lese ich das ab?', { grund: 'k4-ohne',
          kurz: 'Schritt 5 fragt nach dem Wort bei Code 1, nach den beiden Anteilen mit <code>pe05</code>, nach der Tabelle ohne Umpolen und danach, ob die Gegenprobe Aufgabe 3 bestätigt.',
          denken: [
            '<b>Wort bei Code 1:</b> die Ausgabe von Schritt 2, Zeile mit Value 1.',
            '<b>Die beiden Anteile:</b> die Tabelle aus Schritt 3, Spalte ‚würde nicht wählen‘, beide Zeilen.',
            '<b>Ohne Umpolen:</b> Vergleich die Zeile ‚misstraut‘ in Schritt 3 und Schritt 4. Wer steht jeweils darin?',
            '<b>Gegenprobe:</b> Zeigt der Vergleich aus Schritt 3 in dieselbe Richtung wie Aufgabe 3? Und wie viele der Misstrauenden würden trotzdem wählen?',
          ],
          verwechslung: 'R schreibt Kommazahlen mit Punkt: 51.7% heißt 51,7 %.' })] },
      { id: 'a4-5', art: 'bild', titel: 'Im Bild: pe05 umgepolt', baustein: 'UmpolenPe05',
        mehr: [denk('Was zeigt das Bild?', { grund: 'k4-umpolen',
          kurz: 'Das Bild erscheint, wenn in Schritt 5 alle Fragen richtig sind. Es zeigt an fünf Beispiel-Befragten, wie <code>rules = "rev"</code> die Codes von <code>pe05</code> dreht und die Wörter mitwandern.',
          denken: [
            'Folge jedem Stein: Welcher Code wird zu welchem, und welches Wort nimmt er mit?',
            'Schau auf die Klammer unter <code>pe05_um</code>: Welche Codes heißen jetzt Misstrauen, wie bei <code>pe01</code>?',
            'Vergleich mit deiner Regel aus Schritt 3.',
          ],
          verwechslung: 'Ein fehlender Wert bekommt beim Umpolen keinen Code. Er bleibt leer.' })] },
    ],
    probier: { idee: 'Eine dritte Aussage mit fünf Stufen: pa35', code: T.frei_a4.code },
    ohneGrafik: 'Alle Zahlen stehen in den Ausgaben der Schritte 2 bis 4. Das Bild in Schritt 6 hat eine Textfassung.' },
];

/* ---------- Weiter, wenn du magst (aus den Probier-Werkstätten des Atlas) ---------- */
const FREI = {
  a1: [
    { stufe: 'Erweitern', text: 'Bei nichtwahl fallen 1.262 Befragte heraus, darunter 603 mit „weiß nicht“. Antworten die übrigen auf pe01 anders als alle zusammen?', tipp: 'Bilde <code>nichtwahl</code> wie in Schritt 4, dann <code>drop_na(nichtwahl) %&gt;% frequency(pe01)</code> (<code>drop_na()</code> kennst du aus Sitzung 4). Vergleiche die Spalte Valid % mit Schritt 2.' },
    { stufe: 'Abwandeln', text: 'Zähl nur ‚stimme voll zu‘ als Misstrauen. Wie groß ist die Gruppe dann, und was beantwortet sie?', tipp: 'Das ist die Regel, mit der die Vorlage in Schritt 3 beginnt: <code>1=1</code>, <code>2:4=0</code>. Jede Einteilung ist eine Entscheidung, die du nennst.' },
    { stufe: 'Eigene Frage', text: 'Bilde aus einer anderen Frage mit vier Stufen zwei Gruppen.', tipp: 'Erst <code>frequency()</code>: Welche Codes stehen in Value? Dann <code>mutate(neu = rec(alt, rules = "…"))</code> und wieder <code>frequency(neu)</code>. Variablen schlägt dir das Journal mit <kbd>Tab</kbd> vor.' },
  ],
  a2: [
    { stufe: 'Erweitern', text: 'Misstrauen Befragte im Osten häufiger als im Westen?', tipp: 'Bilde <code>misstrauen</code> wie in Aufgabe 1, dann <code>crosstab(eastwest, misstrauen, percentages = "row")</code>. Wer ist hier 100 %?' },
    { stufe: 'Abwandeln', text: 'Tausch die Reihenfolge: crosstab(nichtwahl, misstrauen, …). Bei welcher Einstellung steht jetzt die 87 %?', tipp: 'Die erste Variable kommt in die Zeilen. Tauschst du sie, tauschen auch Zeilen- und Spaltenprozente ihre Namen.' },
  ],
  a3: [
    { stufe: 'Erweitern', text: 'Wie sieht die Tabelle als Bild aus? Balken auf 100 % zeigen genau die Zeilenprozente.', tipp: '<code>drop_na(misstrauen, nichtwahl) %&gt;% to_label(misstrauen, nichtwahl) %&gt;% ggplot(aes(x = misstrauen, fill = nichtwahl)) + geom_bar(position = "fill")</code>. <code>drop_na()</code>, <code>to_label()</code> und <code>position = "fill"</code> kennst du aus Sitzung 4.' },
    { stufe: 'Erweitern', text: 'Ist der Unterschied größer, als der Zufall erwarten lässt? (Wiederholung aus der Vorlesung)', tipp: '<code>chi_square(misstrauen, nichtwahl)</code> statt <code>crosstab()</code>. Was der Test sagt und was nicht, steht in Verstehen im Überblick.' },
  ],
  a4: [
    { stufe: 'Erweitern', text: 'Eine dritte Aussage, „Politiker vertreten nur die Interessen der Reichen“ (pa35), hat fünf Stufen mit „teils/teils“ in der Mitte. Wohin gehört „teils/teils“, und ändert das etwas?', tipp: '<code>misstrauen_pa35 = rec(pa35, rules = "1:2=1 [misstraut]; 3:5=0 [misstraut nicht]; else=NA")</code> zählt teils/teils als „misstraut nicht“. Probier auch <code>1:3=1</code> und <code>4:5=0</code>.' },
    { stufe: 'Abwandeln', text: 'Pol die Wirtschaftslage (ep01) um und prüf, welches Wort danach bei Code 1 steht.', tipp: '<code>mutate(ep01_um = rec(ep01, rules = "rev")) %&gt;% frequency(ep01_um)</code>. Bei fünf Stufen gilt: neuer Code = 6 − alter Code.' },
  ],
};

return { TASKS, FREI };
};
