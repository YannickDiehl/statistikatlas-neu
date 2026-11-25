/* Kapitel 5 „Kreuztabellen“: Aufgaben und Zusatzinfos für die Lernpfad-Engine.
   Wird nach daten.js geladen; die Engine ruft window.KAPITEL(hilfen) einmal auf.
   Geprüft wird mit PRUEFEN aus bausteine.tsx (check.ts des Atlas: ganze Zahlen ±0,55, Rückmeldung je typischem Wert). */
'use strict';
window.KAPITEL = ({ D, T, esc, warum }) => {

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
      { id: 'a1-p', art: 'festlegen', titel: 'Erst festlegen', vorhersage: festlegung('a1') },
      { id: 'a1-1', art: 'code', titel: 'Die Codes von pe01 ansehen', wk: ['a1_freq'], bekannt: 'frequency() aus Sitzung 3',
        text: 'Führe die Vorlage im Journal aus. In der Spalte Value steht der Code jeder Antwort, daneben ihr Wort. Unten fällt eine große Zahl auf: 1.596 Befragte bei ‚TNZ: SPLIT‘. Das heißt: Diese Frage stand nur in einem Teil der Fragebögen (Fragebogensplit). Diese Menschen haben also nicht verweigert, sie wurden nicht gefragt.',
        mehr: [warum('Was heißt Fragebogensplit?', 'Nicht alle Befragten bekommen alle Fragen. <code>pe01</code> stand nur in einem Teil der Fragebögen. Wer sie nicht bekam, hat in <code>pe01</code> einen fehlenden Wert mit dem Aufkleber ‚TNZ: SPLIT‘ und fehlt später in jeder Tabelle mit <code>pe01</code>.', 'k1-codes')] },
      { id: 'a1-2', art: 'code', titel: 'Die Gruppe misstrauen bilden und prüfen', wk: ['a1_misstrauen'], neu: true,
        text: 'Eine Regel liest du ‚aus diesen alten Codes wird dieser neue Code‘: <code>1=1</code> heißt, aus 1 wird 1; <code>2:4=0</code> heißt, aus 2 bis 4 wird 0. Die Vorlage zählt bisher nur ‚stimme voll zu‘ als Misstrauen. Wer zustimmt, ob voll oder eher, sagt aber, dass sich Politiker nicht kümmern. Passe im Journal die beiden markierten Stellen an: Welche Codes gehören zu ‚misstraut‘, welche zu ‚misstraut nicht‘? Die Codes stehen in Schritt 2 in der Spalte Value. Die Kette bildet die Variable und zählt sie gleich aus: Schau auf die Spalte N und auf die Kopfzeile mit <code>mean=</code>.',
        mehr: [warum('Wie lese ich die Vorlage?', '<code>mutate()</code> fügt eine Variable hinzu, <code>rec()</code> kodiert nach der Regel in <code>rules</code> um, <code>frequency()</code> zählt die neue Variable gleich aus. Regeln trennt ein Semikolon, <code>else=NA</code> macht alles andere leer.', 'r2'),
          warum('Warum heißt das eine Entscheidung?', 'Welche Antworten in eine Gruppe gehören, entscheidet die Frage, nicht die Statistik. Jede Einteilung ergibt eine andere Zahl. Darum sagst du im Bericht, wie du zusammengefasst hast.', 'k1-zuschnitt')] },
      { id: 'a1-3', art: 'code', titel: 'Die Gruppe nichtwahl bilden und prüfen', wk: ['a1_nichtwahl'],
        text: 'Diese Regel ist fertig: <code>91=1</code> heißt, aus 91 wird 1; <code>1:90=0</code> heißt, aus 1 bis 90 wird 0 (das sind alle Parteien); alles andere wird leer. Führe die Vorlage im Journal aus und schau, wie viele in jeder Gruppe sind und wie viele leer bleiben (Zeile System).',
        mehr: [warum('Was steht in der Zeile System?', 'Bei neuen Variablen fasst <code>frequency()</code> alle Leeren in der Zeile <b>System</b> zusammen: alle, die in der alten Variable fehlten, und alle, deren Code in keiner Regel stand.', 'k1-nichtwahl')] },
      { id: 'a1-4', art: 'fragen', titel: 'Ergebnis festhalten', fragen: FRAGEN.a1 },
      { id: 'a1-5', art: 'bild', titel: 'Im Bild: zwei neue Türme', baustein: 'MutateA1' },
    ],
    probier: { idee: 'Antworten die Befragten mit gültiger Wahlabsicht anders auf pe01?', code: T.frei_a1.code },
    ohneGrafik: 'Alle Antworten stehen in den Tabellen der Schritte 2 bis 4. Das Bild in Schritt 6 hat eine Textfassung.' },

  { id: 'a2', n: 2, titel: 'Stimmt die 87 %?', pflicht: true, grund: 'g2',
    frage: 'Angenommen, du liest diesen Satz: „87 Prozent der Nichtwähler sagen, dass sich Politiker nicht darum kümmern, was Leute wie sie denken.“ Stimmt die Zahl, und worauf bezieht sie sich?',
    ziel: 'du hast die 87 % in R gefunden, kannst sagen, wer dabei 100 % ist, und weißt, welche Zahl derselben Zelle welche Frage beantwortet.',
    schritte: [
      { id: 'a2-p', art: 'festlegen', titel: 'Erst festlegen', vorhersage: festlegung('a2') },
      { id: 'a2-1', art: 'code', titel: 'Die Prozentbasis finden, die 87 % ergibt', wk: ['a2_ct'], neu: true,
        text: 'Die ersten Zeilen der Vorlage bilden <code>misstrauen</code> und <code>nichtwahl</code> wie in Aufgabe 1. Du änderst im Journal nur die letzte Zeile. Die Vorlage zeigt Zeilenprozente (<code>"row"</code>). Probier auch <code>"col"</code> (Spaltenprozente) und <code>"total"</code> (Gesamtprozente). Schau jedes Mal auf dieselbe Zelle: Zeile ‚misstraut‘, Spalte ‚würde nicht wählen‘. Bei welcher Basis steht dort 87.0%?',
        mehr: [warum('Woran erkenne ich, wer 100 % ist?', 'Such die 100 %: Bei Zeilenprozenten ergibt jede Zeile zusammen 100 %, bei Spaltenprozenten jede Spalte, bei Gesamtprozenten nur die ganze Tabelle. In einem Satz ist die Gruppe nach „der“ die Basis.', 'k2-drei'),
          warum('Warum stehen die mutate()-Zeilen schon wieder da?', 'Jede Vorlage bildet ihre Variablen selbst. So läuft sie für sich allein, auch wenn du die Vorlagen aus Aufgabe 1 nicht oder in anderer Reihenfolge ausgeführt hast.', 'k2-neu')] },
      { id: 'a2-2', art: 'code', titel: 'Eine Zelle, drei Prozentbasen', wk: ['a2_all'],
        text: 'Mit <code>"all"</code> stehen in jeder Zelle drei Prozentzahlen untereinander: <code>row %</code>, <code>col %</code> und <code>total %</code>. Alle drei gehören zu denselben Menschen in dieser Zelle. Ordne in Schritt 4 jeder Frage ihre Zahl zu.',
        mehr: [warum('Wer steht überhaupt in der Tabelle?', 'Nur wer bei <b>beiden</b> Variablen eine gültige Angabe hat. Wie viele das sind, steht in der Kopfzeile bei <code>N (valid)</code>, wie viele fehlen, bei <code>Missing</code>.', 'k2-ergebnis')] },
      { id: 'a2-3', art: 'fragen', titel: 'Ergebnis festhalten', fragen: FRAGEN.a2,
        text: 'Bei (1) bis (3) geht es um eine Zelle: Welche Zahl derselben Zelle beantwortet welche Frage?' },
      { id: 'a2-4', art: 'bild', titel: 'Im Bild: dieselben Menschen, drei Nenner', baustein: 'Nenner' },
    ],
    probier: { idee: 'Misstrauen Befragte im Osten häufiger als im Westen?', code: T.frei_a2.code },
    ohneGrafik: 'Alle Zahlen stehen in der Ausgabe von Schritt 3. Das Bild in Schritt 5 hat eine Textfassung.' },

  { id: 'a3', n: 3, titel: 'Gehen Misstrauende nicht mehr wählen?', pflicht: true, grund: 'g3',
    frage: 'Gehen Misstrauende nicht mehr wählen?',
    ziel: 'du kannst mit der passenden Prozentbasis sagen, ob Misstrauende häufiger nicht wählen wollen als die übrigen, um wie viele Prozentpunkte, und was die Tabelle nicht zeigt.',
    info: 'In Aufgabe 2 hast du gesehen: Die 87 % stimmen, aber ihre Basis sind die Nichtwählenden. Die Leitfrage fragt etwas anderes: ob Misstrauen mit Nichtwahl zusammenhängt. Welche Gruppen du dafür vergleichen musst, legst du gleich fest.',
    schritte: [
      { id: 'a3-p', art: 'festlegen', titel: 'Erst festlegen', vorhersage: festlegung('a3') },
      { id: 'a3-1', art: 'code', titel: 'Die Prozentbasis einstellen', wk: ['a3_ct'],
        text: 'Die ersten Zeilen bilden wieder <code>misstrauen</code> und <code>nichtwahl</code> wie in Aufgabe 1. Die Vorlage nutzt noch die Spaltenprozente aus Aufgabe 2. <code>misstrauen</code> ist hier die mögliche Ursache (UV) und steht in den Zeilen. Stell im Journal die markierte Stelle so ein, dass jede Gruppe von <code>misstrauen</code> 100 % ist.',
        mehr: [warum('Welche Gruppe ist 100 %?', 'Für einen Vergleich ist jede Gruppe der UV für sich 100 %. Wo die UV steht, Zeilen oder Spalten, entscheidet, welche Einstellung das leistet.', 'k3-code')] },
      { id: 'a3-2', art: 'lesen', titel: 'Vergleichen und deuten',
        text: 'Lies in der Spalte ‚würde nicht wählen‘ beide Gruppen ab und zieh ab: Das ist der Abstand in Prozentpunkten. Schau auch in die Spalte ‚würde wählen‘: Wie viele der Misstrauenden wollen wählen?',
        mehr: [warum('Prozent oder Prozentpunkte?', 'Den Abstand zweier Anteile bekommst du durch Abziehen: Prozentpunkte. Teilen ergibt das Verhältnis („wievielmal so häufig“). Beides ist richtig, aber nicht dasselbe.', 'k3-deuten')] },
      { id: 'a3-3', art: 'fragen', titel: 'Ergebnis festhalten', fragen: FRAGEN.a3 },
    ],
    plenum: 'Schreib deinen Faktencheck in zwei Sätzen ins Journal und bring ihn mit: Was stimmt an „87 Prozent der Nichtwähler …“, und beantwortet die Zahl die Frage, ob Misstrauende nicht mehr wählen gehen? Nenne beide Zahlen mit ihrer Basis.',
    probier: { idee: 'Wie sieht die Tabelle als Bild aus?', code: T.frei_a3.code },
    ohneGrafik: 'Die Tabelle aus Schritt 2 enthält alle Zahlen.' },

  { id: 'a4', n: 4, titel: 'Gegenprobe mit einer umgedrehten Aussage', pflicht: false, grund: 'g4',
    frage: 'Kommt dasselbe heraus, wenn man Misstrauen mit einer anderen Aussage misst?',
    ziel: 'du hast eine zweite Aussage umgepolt, daraus eine Misstrauens-Gruppe gebildet und weißt, warum die Regel aus Aufgabe 1 ohne Umpolen das Gegenteil misst.',
    info: 'Im selben Fragebogenteil stand die Aussage: „Die Politiker vertreten die Interessen der Bevölkerung.“ (<code>pe05</code>, wieder von 1 „stimme voll zu“ bis 4 „stimme gar nicht zu“). Wer hier zustimmt, vertraut den Politikern. Misstrauen zeigt, wer <b>nicht</b> zustimmt. Die Aussage ist also andersherum gestellt als <code>pe01</code>.',
    schritte: [
      { id: 'a4-p', art: 'festlegen', titel: 'Erst festlegen', vorhersage: festlegung('a4') },
      { id: 'a4-1', art: 'code', titel: 'pe05 umpolen', wk: ['a4_um'], neu: true,
        text: '<code>rules = "rev"</code> dreht die Codes um: Aus 1 wird 4, aus 2 wird 3, aus 3 wird 2, aus 4 wird 1. Prüf in der Ausgabe im Journal, welches Wort jetzt bei Code 1 steht.',
        mehr: [warum('Wie rechnet rev?', '<code>rec()</code> nimmt den kleinsten und den größten Code der Skala, so wie die Wertelabels sie angeben, und rechnet kleinster plus größter minus alter Code. Fehlende Werte bleiben leer, die Aufkleber wandern mit.', 'k4-umpolen')] },
      { id: 'a4-2', art: 'code', titel: 'Die Misstrauens-Gruppe bilden und vergleichen', wk: ['a4_mutate'],
        text: 'Die Kette polt pe05 wie in Schritt 2 um, bildet daraus <code>misstrauen_pe05</code> und dazu <code>nichtwahl</code> wie in Aufgabe 1. Wie in Aufgabe 1 zählt bisher nur der äußerste Code als Misstrauen. Passe im Journal die markierten Stellen an: Welche Codes von <code>pe05_um</code> heißen jetzt Misstrauen? Das Wort zu jedem Code steht in der Ausgabe von Schritt 2.',
        mehr: [warum('Drei Variablen in einem mutate()?', 'Ja. <code>mutate()</code> bildet die Variablen von oben nach unten. <code>misstrauen_pe05</code> kann darum <code>pe05_um</code> benutzen, das eine Zeile darüber entsteht.', 'k4-gegenprobe')] },
      { id: 'a4-3', art: 'code', titel: 'Zum Vergleich: ohne Umpolen', wk: ['a4_ohne'],
        text: 'Was wäre passiert, wenn du die Regel aus Aufgabe 1 einfach auf pe05 übertragen hättest? Führe die Vorlage im Journal aus und vergleiche mit Schritt 3. Hier fehlt die Zeile mit <code>rev</code>.',
        mehr: [warum('Rechnet R hier falsch?', 'Nein. R rechnet in beiden Fällen richtig. Entscheidend ist, ob die Regel zur Richtung der Aussage passt.', 'k4-ohne')] },
      { id: 'a4-4', art: 'fragen', titel: 'Ergebnis festhalten', fragen: FRAGEN.a4 },
      { id: 'a4-5', art: 'bild', titel: 'Im Bild: pe05 umgepolt', baustein: 'UmpolenPe05' },
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
