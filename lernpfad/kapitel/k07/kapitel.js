/* Kapitel 7 „Mittelwerte vergleichen“: Aufgaben und Zusatzinfos für die Lernpfad-Engine.
   Wird nach daten.js geladen; die Engine ruft window.KAPITEL(hilfen) einmal auf.
   Vorlagen, Fragen und Frage-IDs kommen unverändert aus src/chapter/s07/content.ts (IDs ohne Bindestrich, a1c und a3c gibt es nicht). */
'use strict';
window.KAPITEL = ({ D, T, esc, warum, probier, denk }) => {

/* ---------- Abbildungen auf das Format der Engine ---------- */

/* Die Fragetexte verweisen auf Karten der alten Grundlagen („Karte 1c“) und auf alte Schrittnummern („Schritt 1“).
   Hier heißen die Karten nach ihrem Titel, und „Erst festlegen“ ist Schritt 1: Alle Schritte rücken um eins nach. */
const KARTE = {
  '1b': 'Der t-Wert: Unterschied durch Standardfehler',
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
    infoMehr: [warum('Warum antworten nur gut 3.500?', 'Gestellt wurde die Frage nur etwa zwei Dritteln der Befragten: 1.596 haben sie nicht bekommen, im ⟪Datensatz⟫ steht bei ihnen „⟪TNZ: SPLIT|tnz⟫“. Wer noch zur Schule geht oder einen anderen Abschluss hat, fällt aus dem Vergleich heraus.', 'k1-gruppen')],
    schritte: [
      { id: 'a1-p', art: 'festlegen', titel: 'Erst festlegen', vorhersage: vorhersage('a1'),
        mehr: [denk('Wie lege ich mich fest?', { grund: 'k1-gruppen',
          kurz: 'Du sagst vorher, welche Gruppe dem Bundestag im Mittel mehr vertraut. Es zählt nicht, ob du richtig liegst: Deine Festlegung ist der Vergleichspunkt, an dem du später merkst, ob dich das Ergebnis überrascht.',
          denken: [
            'Was wird verglichen? Der <b>⟪Mittelwert⟫</b> des Vertrauens in den Bundestag (<code>pt03</code>, 1 = gar kein Vertrauen bis 7 = großes Vertrauen) in jeder Gruppe, nicht das Vertrauen einzelner Personen.',
            'Wer gehört wohin? „Mit Abitur“ heißt Fachhochschulreife oder allgemeine Hochschulreife; „ohne Abitur“ heißt kein Abschluss, Haupt- oder Volksschulabschluss oder Mittlere Reife.',
            'Überleg, was für einen Unterschied im Vertrauen spricht und was dagegen. Auch „beide etwa gleich“ ist eine mögliche Festlegung.',
            'Wähl eine Antwort. Sind in Schritt 4 alle Fragen richtig, steht deine Festlegung neben dem Ergebnis.',
          ],
          verwechslung: 'Verglichen werden Mittelwerte von Gruppen, nicht einzelne Personen: Auch in der Gruppe, die im Mittel höher liegt, gibt es Menschen mit wenig Vertrauen.' })] },
      { id: 'a1-1', art: 'code', titel: 'Gruppen bilden und testen (Kurzfassung)', wk: ['a1_kurz'], neu: true,
        text: `Die Vorlage bildet mit <code>rec()</code> die ⟪Variable⟫ <code>abitur</code> und rechnet gleich einen ⟪t-Test⟫, einen Test für den Unterschied zweier Mittelwerte. Hol sie mit <b>→ Journal</b> in dein Lernjournal und führe sie dort einmal aus, wie sie ist: Sie vergleicht das Alter. Zur Kontrolle: <code>${esc(D.A1_SHORT.age)}</code>. Mit Abitur sind die Befragten im Mittel jünger. Tausch dann <b>im Journal</b> die markierte Stelle <code>age</code> gegen <code>pt03</code> und führe den Block noch einmal aus. Lies die Zeile, die mit <code>t(</code> beginnt.`,
        mehr: [
          denk('Was macht die Vorlage?', { grund: 'k1-vorlage',
            kurz: 'Die Vorlage macht zwei Dinge nacheinander. <code>rec()</code> ⟪rekodiert|rekodieren⟫ <code>educ</code> in die Variable <code>abitur</code> mit zwei Gruppen; sie ist hier die ⟪unabhängige Variable⟫. <code>t_test()</code> vergleicht dann die Mittelwerte der beiden Gruppen. Sie rechnet zuerst mit dem Alter, zur Kontrolle; erst danach tauschst du <code>age</code> gegen <code>pt03</code>.',
            denken: [
              'Lies die Regel in <code>rec()</code>: Welche ⟪Codes⟫ von <code>educ</code> werden zu 0 „ohne Abitur“, welche zu 1 „mit Abitur“, und was wird zu <code>NA</code>, also zum ⟪fehlenden Wert⟫?',
              'Lies <code>t_test()</code> von links nach rechts: zuerst die ⟪abhängige Variable⟫, deren Mittelwerte verglichen werden, nach <code>group =</code> die Gruppen, dann das ⟪Gewicht⟫.',
              'Führ den Block einmal so aus und vergleich die Zeile mit der Kontrollausgabe im Text. Stimmt sie, tausch im Journal die gelbe Stelle und führ den Block noch einmal aus.',
              'Lies die Zeile, die mit <code>t(</code> beginnt, von links nach rechts: ⟪Freiheitsgrade⟫ (df), t, p, g und N. R rechnet immer erste minus zweite Gruppe: Was sagt dir dann das Vorzeichen von t?',
            ],
            bild: 'TFormula', bildtext: 'Ein anderes Beispiel: die Arbeitsstunden von Männern und Frauen. Der t-Wert teilt den Unterschied der Mittelwerte durch seinen ⟪Standardfehler⟫, im Bild: Signal durch Rauschen.',
            verwechslung: 'Die Zeile <code>t(…) = …</code> ist nur die Kurzfassung. Mittelwerte und Konfidenzintervall stehen dort nicht; die holt erst <code>summary()</code> in Schritt 3.' }),
          warum('Was heißen t, p und g?', '<b>t</b>, der t-Wert, teilt den Unterschied durch seinen Standardfehler, im Bild: Signal durch Rauschen. <b>p</b> sagt, wie oft ein mindestens so großer Unterschied vorkäme, wenn es in der ⟪Grundgesamtheit⟫ keinen gäbe. <b>g</b> (Hedges\' g) sagt, wie groß der Unterschied ist.', 'k1b'),
          warum('Lieber in RStudio?', 'Dann führst du dort vorher den Startblock aus (Pakete laden, ALLBUS einlesen). Danach kopierst du die Vorlage mit <b>Kopieren</b> in dein ⟪Skript⟫.<pre>' + esc(T.start.code) + '</pre>', 'r1'),
        ] },
      { id: 'a1-2', art: 'code', titel: 'Die ganze Tabelle', wk: ['a1_tabelle'],
        text: 'Für die Mittelwerte und das Konfidenzintervall hängt die zweite Vorlage <code>summary()</code> an. Sie ist schon fertig; der Kommentar „wie in Schritt 1“ meint die Kurzfassung in Schritt 2, er zählt „Erst festlegen“ nicht mit. Hol sie mit <b>→ Journal</b> ins Lernjournal und führe sie dort aus. Lies die Ausgabe in dieser Reihenfolge: zuerst die Gruppen, dann die Zeile „Equal variances not assumed“, dann die Effektstärke.',
        mehr: [
          denk('Wie lese ich die Tabelle?', { grund: 'k1-tabelle',
            kurz: 'Mit <code>summary()</code> zeigt R statt einer Zeile die ganze Tabelle in drei Teilen: die Gruppen, den Test und die Effektstärke. Du liest sie in dieser Reihenfolge und beim Test nur die Zeile „Equal variances not assumed“. Das ist der <b>⟪Welch-Test⟫</b>, eine Form des t-Tests.',
            denken: [
              '<b>Weighted Group Statistics:</b> Welche Gruppe steht oben, welche unten? Lies je Gruppe N und Mean.',
              '<b>Weighted Independent Samples Test:</b> Such die Zeile „Equal variances not assumed“. Dort stehen t, p, der Unterschied der Mittelwerte (Mean Diff.) und das 95-%-Konfidenzintervall (95% CI Lower bis Upper).',
              '<b>Effect Sizes:</b> Von den drei Maßen brauchst du nur Hedges\' g.',
              'Vergleich t, p und g mit deiner Kurzfassung aus Schritt 2: Die Kurzfassung zeigt genau die Welch-Zeile.',
            ],
            verwechslung: 'Ein Minus vor t und Mean Diff. ist kein Fehler. Es heißt nur: Die zweite Gruppe liegt höher. R schreibt Kommazahlen mit Punkt: <code>-0.123</code> heißt −0,123.' }),
          warum('Warum die Welch-Zeile?', 'Beide Zeilen testen dasselbe; sie rechnen nur den ⟪Standardfehler⟫ verschieden aus. Welch nimmt jede Gruppe mit ihrer eigenen ⟪Streuung⟫. Er braucht keine gleich starke Streuung in beiden Gruppen, also keine ⟪Varianzhomogenität⟫.', 'k2c'),
        ] },
      { id: 'a1-3', art: 'fragen', titel: 'Ergebnis festhalten', fragen: fragen('a1'),
        text: 'Die Fragen gehen die Ausgabe in der Reihenfolge eines Berichts durch: Welche Gruppe liegt höher, um wie viel, geht das über den Zufall hinaus, wo liegt der Unterschied plausibel, wie groß ist er? Wenn du fertig bist und Zeit hast: Schreib im Journal daraus einen Satz wie in einem Bericht.',
        mehr: [
          denk('Wo lese ich das ab?', { grund: 'k1-ergebnis',
            kurz: 'Die Fragen gehen die Ausgabe aus Schritt 3 in der Reihenfolge eines Berichts durch. Jede Antwort hat einen festen Ort in der Tabelle. Bei den Fragen zur Deutung hilft dir, was t, p, das Konfidenzintervall und g jeweils messen.',
            denken: [
              '<b>Welche Gruppe höher, um wie viel:</b> Spalte Mean in „Weighted Group Statistics“; Mean Diff. in der Zeile „Equal variances not assumed“, mit Vorzeichen, so wie R sie druckt.',
              '<b>t und p:</b> Frag dich, was t durch was teilt und unter welcher Annahme p gerechnet wird. Beides steht in Verstehen bei „Der t-Wert“ und „p-Wert und Konfidenzintervall“.',
              '<b>Konfidenzintervall:</b> Frag dich, wofür das Intervall einen Bereich angibt, und ob die 0 darin liegt.',
              '<b>Hedges\' g:</b> unter „Effect Sizes“. Lass ein Vorzeichen weg und vergleich den Betrag mit den Grenzen 0,2, 0,5 und 0,8.',
            ],
            bild: 'EffectRuler', bildtext: 'Die Grenzen 0,2, 0,5 und 0,8 mit zwei anderen Beispielen: Lebenszufriedenheit (0,005) und Arbeitsstunden (0,85) von Männern und Frauen.',
            verwechslung: 'Mean Diff. ist ein Unterschied in Punkten der Skala, Hedges\' g eine Zahl ohne Einheit, gemessen in Standardabweichungen. Für die Größe fragst du g.' }),
          warum('Was gehört in einen Bericht-Satz?', 'Die Mittelwerte beider Gruppen, der Unterschied mit Einheit und Intervall, der Test mit p, die Effektstärke, dazu Quelle, ⟪Fallzahl⟫ und „gewichtet“. Ein Muster mit den Arbeitsstunden steht im Überblick von Verstehen.', 'kue2'),
          warum('Musterformulierung (verrät die Lösung)', D.A1_MODEL),
        ] },
    ],
    probier: { idee: 'Gilt der Unterschied auch beim Vertrauen in die Polizei (pt14)?', code: T.frei_a1.code },
    plenum: 'Bringt euren Bericht-Satz mit. Ist der Unterschied, den ihr gefunden habt, auf einer Skala von 1 bis 7 politisch bedeutsam? Und erklärt das Abitur den Unterschied, oder könnte eine ⟪Drittvariable⟫ dahinterstecken (etwa das Alter, siehe Schritt 2 vor dem Tausch)?',
    ohneGrafik: 'Alle Antworten stehen in der Textausgabe von <code>summary()</code>; diese Aufgabe braucht keine Grafik.' },

  { id: 'a2', n: 2, titel: 'Macht Abitur zufriedener?', pflicht: false, grund: 'g2',
    frage: 'Wie groß ist der Unterschied in der Lebenszufriedenheit zwischen Menschen mit und ohne Abitur, und hängt die Antwort davon ab, wen man fragt?',
    ziel: 'du kannst prüfen, ob ein signifikanter Unterschied auch groß ist, und erklären, wann die Welch-Zeile ein breiteres Intervall zeigt.',
    info: 'Du vergleichst die Lebenszufriedenheit (<code>ls01</code>, 0 bis 10) zwischen ohne und mit Abitur, einmal bei allen Befragten und einmal nur bei den unter 30-Jährigen. Die Gruppen bildest du wie in <a href="#a1">Aufgabe 1</a>.',
    schritte: [
      { id: 'a2-p', art: 'festlegen', titel: 'Erst festlegen', vorhersage: vorhersage('a2'),
        mehr: [denk('Wie lege ich mich fest?', { grund: 'k2-frage',
          kurz: 'Du sagst vorher, bei wem der Unterschied in der Lebenszufriedenheit zwischen ohne und mit Abitur größer ist: bei allen Befragten oder bei den unter 30-Jährigen. Es zählt nicht, ob du richtig liegst; deine Festlegung ist dein Vergleichspunkt.',
          denken: [
            '„Größer“ meint den Unterschied der Mittelwerte in Punkten der Skala von 0 bis 10, die Spalte Mean Diff.',
            'Überleg, was das Abitur mit der Lebenszufriedenheit zu tun haben könnte, und ob das in jungen Jahren anders sein könnte als über alle Altersgruppen hinweg.',
            'Bedenk: Bei den unter 30-Jährigen gehen viel weniger Befragte ein. Das macht die Rechnung unsicherer, der ⟪Standardfehler⟫ wird größer. Es sagt aber noch nichts darüber, wie groß der Unterschied ist.',
            'Wähl eine Antwort. Sind in Schritt 4 alle Fragen richtig, steht deine Festlegung neben dem Ergebnis.',
          ],
          verwechslung: '„Signifikant“, „groß“ und „größer als bei anderen“ sind drei verschiedene Aussagen: p sagt das Erste, die Effektstärke das Zweite, der Vergleich zweier Rechnungen das Dritte.' })] },
      { id: 'a2-1', art: 'code', titel: 'Alle Befragten', wk: ['a2_alle'],
        text: 'Hol die Vorlage ins Journal und führe sie dort aus. Lies den Unterschied (Mean Diff.), p und Hedges\' g.',
        mehr: [denk('Signifikant oder groß?', { grund: 'k2a',
          kurz: 'Du rechnest den t-Test für die Lebenszufriedenheit (<code>ls01</code>, 0 bis 10) mit allen Befragten. Drei Zahlen beantworten drei Fragen: <b>Mean Diff.</b> sagt, wie viele Punkte die Gruppen auseinanderliegen, <b>p</b>, ob das über den Zufall hinausgeht, <b>Hedges\' g</b>, wie groß der Unterschied im Verhältnis zur Streuung ist.',
          denken: [
            'Lies Mean Diff. und p in der Zeile „Equal variances not assumed“, g unter „Effect Sizes“.',
            'Beurteil p und g getrennt: Liegt p unter 0,05? Und in welchen Bereich der Faustregel (0,2, 0,5, 0,8) fällt der Betrag von g?',
            'Schau auf N in der Gruppentabelle: Wie viele Befragte gehen ein? Was macht diese ⟪Fallzahl⟫ mit dem ⟪Standardfehler⟫ und damit mit p?',
            'Setz Mean Diff. in Beziehung zur Skala von 0 bis 10.',
          ],
          verwechslung: 'p und g beantworten verschiedene Fragen: p, ob ein Unterschied über den Zufall hinausgeht, g, wie groß er ist. Beurteil beide getrennt, bevor du antwortest.' })] },
      { id: 'a2-2', art: 'code', titel: 'Nur die unter 30-Jährigen', wk: ['a2_jung'], bekannt: 'filter() aus Sitzung 2',
        text: 'Die Vorlage hat eine Zeile mehr: <code>filter(age &lt; 30)</code>. Führe sie im Journal aus und vergleiche die beiden Zeilen „Equal variances assumed“ und „not assumed“: Wo ist das Intervall breiter?',
        mehr: [
          denk('Zwei Zeilen, zwei Intervalle?', { grund: 'k2c',
            kurz: '<code>filter(age &lt; 30)</code> behält nur die unter 30-Jährigen, bevor gerechnet wird. Danach vergleichst du die zwei Zeilen des Tests: „Equal variances assumed“ (<b>Student</b>) nimmt eine gemeinsame Streuung für beide Gruppen an, „not assumed“ (<b>Welch</b>) nimmt jede Gruppe mit ihrer eigenen Streuung und Größe.',
            denken: [
              'Lies in beiden Zeilen SE Diff. und das 95-%-⟪Konfidenzintervall⟫ (Lower bis Upper): Wo ist das Intervall breiter?',
              'Schau dann oben in die Gruppentabelle: Wie viele Befragte (N) hat jede Gruppe, und wie stark streut sie (⟪Standardabweichung⟫, Std. Deviation)?',
              'Frag dich: Welche Zeile rechnet die Streuung jeder Gruppe für sich ein, und welche verlässt sich auf eine gemeinsame?',
              'Prüf auch, ob in jeder Gruppe noch genug Befragte sind (Faustregel: etwa 30 je Gruppe).',
            ],
            bild: 'WelchFormula', bildtext: 'Ein anderes Beispiel: Gruppe A hat 400 Befragte mit Standardabweichung 1, Gruppe B 40 Befragte mit Standardabweichung 3; B liegt im Mittel 0,8 Punkte höher.',
            verwechslung: '„Equal variances not assumed“ heißt nicht, dass die Streuungen ungleich <b>sind</b>. Es heißt nur, dass der Test es nicht <b>voraussetzt</b>.',
            zusatz: '<code>filter(age &lt; 30)</code> heißt „jünger als 30“; wer genau 30 ist, fällt heraus.' }),
          warum('Passt der t-Test bei so wenigen Befragten?', 'Als Faustregel reichen etwa 30 Befragte je Gruppe. Gleiche Streuung braucht nur der klassische Test, der Welch-Test kommt ohne aus.', 'k2b'),
        ] },
      { id: 'a2-3', art: 'fragen', titel: 'Ergebnis festhalten', fragen: fragen('a2'),
        mehr: [denk('Wo lese ich das ab?', { grund: 'k2-ergebnis',
          kurz: 'Die ersten zwei Fragen gehören zu Schritt 2 (alle Befragten), die letzten zwei zu Schritt 3 (unter 30). Leg dir beide Ausgaben nebeneinander.',
          denken: [
            '<b>Hedges\' g bei allen:</b> Ausgabe von Schritt 2, „Effect Sizes“, mit Vorzeichen, so wie R es druckt.',
            '<b>Signifikant oder groß:</b> Beurteil p und g getrennt. Die Faustregel für g steht in Verstehen bei „Effektstärke“.',
            '<b>Unterschied unter 30:</b> Ausgabe von Schritt 3, Spalte Mean Diff., mit Vorzeichen, so wie R sie druckt.',
            '<b>Warum ein Intervall breiter ist:</b> Vergleich oben N und Std. Deviation der beiden Gruppen und überleg, welche Zeile diese Unterschiede einrechnet.',
          ],
          verwechslung: 'R schreibt Kommazahlen mit Punkt: <code>-0.123</code> heißt −0,123.' })] },
    ],
    probier: { idee: 'Wie sieht es bei den Befragten ab 65 aus?', code: T.frei_a2.code },
    ohneGrafik: 'Alle Antworten stehen in der Textausgabe von <code>summary()</code>; diese Aufgabe braucht keine Grafik.' },

  { id: 'a3', n: 3, titel: 'Links, rechts und der Wohnort', pflicht: true, grund: 'g3',
    frage: 'Stehen Menschen in der Großstadt politisch weiter links als in Kleinstadt und Dorf?',
    ziel: 'du kannst sagen, ob sich die Wohnorte in der Links-rechts-Einstufung unterscheiden (F, p), wie stark (η²) und welche Wohnorte genau (Tukey), und warum ein großer Unterschied in einer kleinen Gruppe nicht signifikant sein kann.',
    info: 'Der ALLBUS fragt: <em>„Viele Leute verwenden die Begriffe links und rechts … Wo würden Sie sich einordnen?“</em> (<code>pa01</code>, 1 = links bis 10 = rechts). Den Wohnort beschreiben die Befragten selbst (<code>gs01</code>): Großstadt, Vorort einer Großstadt, Mittel- oder Kleinstadt, ländliches Dorf, Einzelgehöft auf dem Land. Fünf Gruppen, also eine ANOVA.',
    schritte: [
      { id: 'a3-p', art: 'festlegen', titel: 'Erst festlegen', vorhersage: vorhersage('a3'),
        mehr: [denk('Wie lege ich mich fest?', { grund: 'k3-frage',
          kurz: 'Du sagst vorher, an welchem Wohnort die Befragten im Mittel am weitesten links stehen. Es zählt nicht, ob du richtig liegst; deine Festlegung ist dein Vergleichspunkt für später.',
          denken: [
            'Lies die Skala: <code>pa01</code> geht von 1 = links bis 10 = rechts. „Weiter links“ heißt also ein kleinerer Mittelwert.',
            'Geh die fünf Wohnorte durch: Großstadt, Vorort einer Großstadt, Mittel- oder Kleinstadt, ländliches Dorf, Einzelgehöft. Den Wohnort beschreiben die Befragten selbst.',
            'Überleg, was du über politische Einstellungen in Stadt und Land weißt, und wähl einen Wohnort.',
            'Sind in Schritt 4 alle Fragen richtig, steht deine Festlegung neben dem Ergebnis.',
          ],
          verwechslung: 'Ein Unterschied in den Mittelwerten ist noch kein Befund: Ob sich die Wohnorte über den Zufall hinaus unterscheiden, sagt erst die ANOVA in Schritt 2.' })] },
      { id: 'a3-1', art: 'code', titel: 'Die ANOVA', wk: ['a3_anova'], neu: true,
        text: 'Hol die Vorlage ins Journal und führe sie dort aus, wie sie ist: Sie rechnet das Alter nach ⟪Erhebungsweg⟫, das Beispiel aus Verstehen. Du solltest F = 160.989 wiederfinden. Tausch dann <b>im Journal</b> <code>age</code> gegen <code>pa01</code> und <code>mode</code> gegen <code>gs01</code> und führe den Block noch einmal aus.',
        mehr: [
          denk('Wie lese ich die Ausgabe der ANOVA?', { grund: 'k3-vorlage',
            kurz: 'Die <b>⟪einfaktorielle Varianzanalyse (ANOVA)|anova⟫</b> vergleicht die Mittelwerte von drei oder mehr Gruppen mit einem einzigen Test. „Einfaktoriell“ heißt: Eine einzige unabhängige Variable bildet die Gruppen, hier der Wohnort. Die Vorlage startet mit dem Beispiel aus Verstehen, dem Alter nach Erhebungsweg; erst wenn das läuft, tauschst du die zwei gelben Stellen.',
            denken: [
              'Führ die Vorlage aus, wie sie ist, und such F = 160.989. Dann weißt du, dass alles läuft.',
              'Tausch im Journal <code>age</code> gegen <code>pa01</code> und <code>mode</code> gegen <code>gs01</code> und führ den Block noch einmal aus. Steht danach noch 160.989 da, ist ein Tausch nicht angekommen.',
              'Lies die neue Ausgabe von oben nach unten: die Gruppen mit N, Mean und Std. Deviation, dann F und p in der Zeile „Between Groups“, darunter die Welch-Zeile, ganz unten Eta Squared (η²) unter „Effect Sizes“.',
              'Frag dich bei F: Was wird hier durch was geteilt? Und bei η²: Wovon ist es ein Anteil?',
            ],
            bild: 'FFormula', bildtext: 'Das Beispiel aus der Vorlage, Alter nach Erhebungsweg (gewichtet): So entsteht F, und daneben η².',
            verwechslung: '„ANOVA signifikant“ heißt nicht „alle Gruppen unterscheiden sich“. Es reicht, dass sich eine Gruppe von einer anderen unterscheidet; welche, sagt erst Tukey in Schritt 3.' }),
          warum('Warum nicht zehn t-Tests?', 'Jeder Test hat ein Risiko von 5 % für einen ⟪Fehler 1. Art⟫, einen Fehlalarm. Bei fünf Wohnorten gibt es zehn Paare, und die Chance auf mindestens einen Fehlalarm steigt auf etwa 40 %. Das heißt ⟪Alpha-Fehler-Kumulierung⟫. Die ANOVA prüft mit einem einzigen Test, ob sich irgendwelche Gruppen unterscheiden.', 'k3a'),
        ] },
      { id: 'a3-2', art: 'code', titel: 'Welche Wohnorte genau?', wk: ['a3_tukey'], neu: true,
        text: 'Die zweite Vorlage hängt <code>tukey_test()</code> direkt hinter die ANOVA und <code>summary()</code> ans Ende. Sie ist fertig. Hol sie mit <b>→ Journal</b> ins Lernjournal und führe sie dort aus. Ohne <code>summary()</code> würde die Kurzfassung nur zählen, wie viele Paare signifikant sind; mit <code>summary()</code> siehst du alle zehn.',
        mehr: [denk('Was zeigt die Tukey-Tabelle?', { grund: 'k3c',
          kurz: 'Die ANOVA sagt nur, ob sich irgendwelche Wohnorte unterscheiden. Der <b>⟪Tukey-Test⟫</b> vergleicht danach alle Paare und rechnet ein, dass es mehrere Vergleiche sind: Seine ⟪p-Werte⟫ sind für die Zahl der Vergleiche korrigiert.',
          denken: [
            'Lies die Kette: <code>tukey_test()</code> arbeitet mit dem Ergebnis der ANOVA weiter, <code>summary()</code> steht am Ende.',
            'Jede Zeile ist ein Paar: erste minus zweite Gruppe. Lies je Zeile Mean Diff., Std. Error, p-value und das ⟪Konfidenzintervall⟫ (Lower CI bis Upper CI).',
            'Frag dich je Zeile: Liegt p unter 0,05? Enthält das Intervall die 0? Beides muss zusammenpassen.',
          ],
          bild: 'MeansCI', bildtext: 'Das Beispiel Alter nach Erhebungsweg: die Mittelwerte der drei Erhebungswege mit ihren 95-%-Intervallen (gewichtet; die Achse beginnt bei 40). Das sind Intervalle der Mittelwerte, nicht der Unterschiede in der Tukey-Tabelle.',
          verwechslung: 'Steht <code>summary()</code> vor <code>tukey_test()</code>, meldet R einen Fehler: <code>tukey_test()</code> braucht das Ergebnis der ANOVA, <code>summary()</code> gehört ans Ende.' })] },
      { id: 'a3-3', art: 'fragen', titel: 'Ergebnis festhalten', fragen: fragen('a3'),
        text: 'Die Fragen gehen erst darauf ein, wo die Befragten stehen, dann ob sich die Wohnorte unterscheiden (F), wie stark (η²), welche Paare (Tukey) und warum ein Paar trotz großem Unterschied offen bleibt. Wenn du fertig bist und Zeit hast: Schreib im Journal einen Satz, was man über Stadt und Land sagen darf und was nicht.',
        mehr: [denk('Wo lese ich das ab?', { grund: 'k3-ergebnis',
          kurz: 'Die Fragen folgen den Ausgaben von oben nach unten: erst die Mittelwerte, dann F, η² und die Paare aus Tukey. Zum Schluss geht es um ein Paar, das trotz großem Unterschied nicht signifikant ist.',
          denken: [
            '<b>Am weitesten links:</b> „Weighted Descriptive Statistics“, Spalte Mean. Denk an die Richtung der Skala: 1 = links.',
            '<b>F:</b> „Weighted ANOVA Results“, Zeile „Between Groups“, Spalte F. <b>η²:</b> unter „Effect Sizes“, Spalte Eta Squared; frag dich, wovon es ein Anteil ist.',
            '<b>Signifikante Paare:</b> In der Tukey-Tabelle aus Schritt 3 die Zeilen mit p-value unter .05 zählen.',
            '<b>Das Paar, das offen bleibt:</b> Schau auf N dieser Gruppe in der Gruppentabelle und auf Std. Error in ihrer Tukey-Zeile. Was hängt am Standardfehler, und wie breit wird dadurch das Intervall?',
          ],
          verwechslung: 'R schreibt Kommazahlen mit Punkt: <code>12.345</code> heißt 12,345.' })] },
    ],
    probier: { idee: 'Sind Verheiratete zufriedener mit ihrem Leben als Ledige, Geschiedene oder Verwitwete?', code: T.frei_a3.code },
    plenum: 'Bringt euren Satz über Stadt und Land mit. Schreibt eine Schlagzeile, die stimmt, und eine, die zu weit geht. Woran liegt der Unterschied: am Wohnort selbst, oder an einer Drittvariable, weil in der Großstadt andere Menschen wohnen (jünger, mehr mit Abitur)?',
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
      }),
        mehr: [denk('Wie lege ich mich fest?', { grund: 'k4-frage',
          kurz: 'Du sagst vorher, welche zwei Institutionen im Vertrauen am stärksten zusammenhängen. Es zählt nicht, ob du richtig liegst; deine Festlegung ist dein Vergleichspunkt für die Matrix.',
          denken: [
            '„Hängen zusammen“ heißt: Wer der einen Institution mehr vertraut, vertraut der anderen eher auch mehr (oder, bei negativem r, eher weniger). Diesen ⟪Zusammenhang⟫ misst ⟪Pearsons r⟫.',
            'Überleg für jedes der drei Paare, was dafür und was dagegen spricht, dass Menschen beiden ähnlich viel vertrauen.',
            'Wähl ein Paar. Sind in Schritt 3 alle Fragen richtig, steht deine Festlegung neben dem Ergebnis.',
          ],
          verwechslung: 'Für die Stärke zählt der Betrag von r; das Vorzeichen sagt nur die Richtung.' })] },
      { id: 'a4-1', art: 'code', titel: 'Die Matrix', wk: ['a4_matrix'], bekannt: 'pearson_cor() aus Sitzung 6',
        text: 'Hol die Vorlage ins Journal und führe sie dort aus. Lies zuerst die „Correlation Matrix“, dann die „Sample Size Matrix“.',
        mehr: [denk('Wie lese ich die Matrix?', { grund: 'k4a',
          kurz: 'Eine <b>⟪Korrelationsmatrix⟫</b> zeigt die Korrelation jedes Paars aus mehreren Variablen in einer Tabelle. Die Vorlage gibt <code>pearson_cor()</code> fünf Variablen und das Gewicht; <code>summary()</code> holt die ganze Ausgabe.',
          denken: [
            'Such zuerst die Diagonale: Was steht dort, und warum?',
            'Die Matrix ist gespiegelt. Entscheide dich für eine Hälfte und lies nur sie, ohne die Diagonale.',
            'Lies in jeder Zelle die Zahl (Stärke und Richtung) und die Sterne (signifikant) getrennt.',
            'Schau dann in die „Sample Size Matrix“: Sie zeigt, wie viele Befragte in jedes Paar eingehen.',
          ],
          verwechslung: 'Ein Minus heißt nicht „schlecht“ oder „kein Zusammenhang“. Es sagt nur die Richtung: Steigt die eine Zahl, sinkt die andere.' })] },
      { id: 'a4-2', art: 'fragen', titel: 'Ergebnis festhalten', fragen: fragen('a4'),
        mehr: [denk('Wo lese ich das ab?', { grund: 'k4-ergebnis',
          kurz: 'Alle Antworten stehen in der Ausgabe aus Schritt 2. Zwei Fragen wollen Zahlen, zwei wollen wissen, was die Zahlen bedeuten.',
          denken: [
            '<b>r eines Paars:</b> die Zelle in der Zeile der einen und der Spalte der anderen Variable, ohne Sterne gelesen.',
            '<b>Wie viele Paare signifikant:</b> in einer Hälfte der Matrix die Zellen mit Sternen zählen, ohne die Diagonale.',
            '<b>Kleines r mit Sternen:</b> Frag dich, was die Sterne sagen und was die Zahl. Denk an Aufgabe 2: Wie viele Befragte gehen ein?',
            '<b>Verschiedene N:</b> Vergleich in der „Sample Size Matrix“ die Zeile <code>age</code> mit den anderen. Wem wurden die Vertrauensfragen gestellt, wem das Alter?',
          ],
          verwechslung: 'R schreibt Kommazahlen mit Punkt: <code>0.123</code> heißt 0,123.' })] },
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
