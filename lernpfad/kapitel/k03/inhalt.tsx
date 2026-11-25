// Kapitel 3, Reiter „Verstehen“ (Muster aus k04/KONZEPT.md): je Aufgabe erklären, was in jedem Schritt passiert und warum.
// Keine Übungen: Die „Kurz überlegen“-Fragen, das Regal-Zuordnen und das Mitten-Ankreuzen der Grundlagen sind hier
// Fließtext oder rhetorische Fragen mit Antwort. Beispiele (la01, st01, dh04) sind andere Variablen als in den Aufgaben.
import { Card, InShort, Mixup, MoreDetail, Badge } from '@atlas/chapter/blocks/Card';
import { HeadingLevel } from '@atlas/chapter/blocks/level';
import { ReadR } from '@atlas/chapter/s03/ReadR';
import { TowerToTable } from '@atlas/chapter/s03/figures/TowerToTable';
import { FrequencyTable, PercentFormula } from '@atlas/chapter/s03/figures/FrequencyTable';
import { HundredStones, ThreeBases } from '@atlas/chapter/s03/figures/Stones';
import { MeanFormula } from '@atlas/chapter/s03/figures/HouseholdRow';
import { DescribeOutput, ScaleLevels } from '@atlas/chapter/s03/figures/Middles';
import '@atlas/chapter/s03/s03.css';
import type { Thema } from '../../react/typen';
import { BuecherStreifen, HaushaltsReihe, HaushaltsStreifen, MitteBaum, RegaleErklaert } from './figuren';
import { Abschnitt, Bezug, Code, Frage } from '../../react/gemeinsam';

/* ---------- Vorweg ---------- */
export function Vorweg() {
  return <section className="grund-block" id="vorweg" aria-labelledby="vorweg-h">
    <div className="g-kopf">
      <span className="st m c7" aria-hidden="true">R</span>
      <div><div className="ueber">Vorweg, für alle Aufgaben</div><h4 id="vorweg-h">R lesen</h4></div>
    </div>
    <p className="g-intro">Alle vier Aufgaben arbeiten mit drei Werkzeugen: <code>frequency()</code>, <code>describe()</code> und R als Taschenrechner. Hier steht, wie du eine Zeile wie <code>allbus %&gt;% frequency(la01)</code> liest und was die drei Werkzeuge tun. Alle Zahlen in diesem Kapitel sind ungewichtet, genau wie die Ausgabe deiner Vorlagen. Gewichtet ändern sie sich etwas; das ist Thema in Sitzung 6.</p>
    <HeadingLevel.Provider value={5}><ReadR /></HeadingLevel.Provider>
  </section>;
}

/* ---------- Aufgabe 1 ---------- */
export function Verstehen1() {
  return <Abschnitt id="g1" n={1} titel="Wie geht es der Wirtschaft in einem Jahr?"
    frage="Erwarten die Befragten, dass es der Wirtschaft in Deutschland in einem Jahr besser oder schlechter geht?"
    ziel="eine ausgezählte Häufigkeitstabelle und kannst sagen, wie viele gültig geantwortet haben, wie viele Antworten fehlen, welche Erwartung am häufigsten ist und wo die Mitte liegt, und du hast einen Anteil mit R selbst zusammengezählt."
    weg={[
      ['Schritt 1', '#a1-p', 'Erst festlegen: Erwarten mehr eine bessere oder eine schlechtere Lage?', 'k1-turm'],
      ['Schritt 2', '#a1-1', 'Vorlage ausführen: frequency() zählt Steine', 'k1-turm'],
      ['Schritt 3', '#a1-2', 'die Tabelle von unten lesen: gültig, fehlend, Gründe', 'k1-spalten'],
      ['Schritt 4', '#a1-3', 'Modus und Median suchen', 'k1-mitte'],
      ['Schritt 5', '#a1-4', 'zwei Zeilen mit R zusammenzählen', 'k1-rechnen'],
      ['Schritt 6', '#a1-5', 'Deuten: Welcher Satz passt?', 'k1-ergebnis'],
      ['Schritt 7', '#a1-6', 'Ergebnis festhalten', 'k1-ergebnis'],
    ]}>

    <Card id="k1-turm" title="Vom Turm zur Tabelle: was frequency() zählt" badge={<Bezug href="#a1-p">zu Schritt 1 und 2</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Die Frage der Aufgabe fragt nicht nach einer einzelnen Zahl, sondern danach, wie viele Befragte welche Antwort gegeben haben. Genau das zählt <code>frequency()</code> aus. Woher kommen die Zahlen in der Tabelle? Am Beispiel einer anderen Frage, wie oft man in der Freizeit Bücher liest (<code>la01</code>, fünf Antworten von „täglich“ bis „nie“), siehst du den Turm von zwölf Befragten, zum Beispiel. Jeder Stein ist eine Antwort, der Aufkleber sagt, was der Code bedeutet. Eine Person hat nichts angegeben: Ihr Stein ist leer, trägt aber einen Aufkleber mit dem Grund, KEINE ANGABE. Geh die drei Schritte durch.</p>
      <TowerToTable />
      <p>Die Vorlage in Schritt 2 macht dasselbe mit <code>ep04</code> und allen 5.246 Befragten. Lies sie wie in <a href="#r1">„R lesen“</a>: Nimm den ALLBUS, und dann zähl aus, wie oft jede Antwort bei <code>ep04</code> vorkommt. Auf den Steinen stehen dort die Codes 1 „wesentlich besser“ bis 5 „wesentlich schlechter“.</p>
      <Code k="a1" />
      <Frage>Und warum sollst du in Schritt 1 vorher festlegen, was du erwartest?</Frage>
      <p>Wer vorher eine Erwartung notiert, merkt hinterher, wo das eigene Bild danebenlag. Ohne Festlegung wirkt jedes Ergebnis im Nachhinein „klar“. Darum wählst du zuerst, ob wohl mehr eine bessere oder eine schlechtere Lage erwarten. Holst du am Ende deine Ergebnisse ins Journal, steht deine Festlegung daneben.</p>
      <InShort>Eine Häufigkeitstabelle zählt, wie oft jeder Wert vorkommt. Diese Zahl heißt <b>absolute Häufigkeit</b>, in R die Spalte <b>N</b>. Gleiche Steine kommen auf einen Stapel, und N ist die Höhe des Stapels. Steine mit einem Missing-Code zählt die Tabelle getrennt: unter „Total missing“.</InShort>
      <MoreDetail summary="Warum der leere Stein einen Aufkleber hat">
        <p>Im ALLBUS fehlt keine Antwort einfach so. Jede Lücke hat einen Code mit Grund, etwa −9 KEINE ANGABE oder −11 TNZ: SPLIT. <code>read_spss()</code> macht daraus in R einen fehlenden Wert (NA), behält den Grund aber als Aufkleber. Darum kann <code>frequency()</code> dir unten in der Tabelle zeigen, warum wie viele Antworten fehlen. Mehr dazu in <a href="#k2-gruende">Verstehen zu Aufgabe 2</a>.</p>
      </MoreDetail>
      <Mixup>Die Spalte <b>Value</b> ist der Code, nicht die Anzahl. „4“ in der Spalte Value heißt bei den Büchern SELTENER; wie viele das gesagt haben, steht in der Spalte N.</Mixup>
    </Card>

    <Card id="k1-spalten" title="Die Spalten von frequency(): von unten gelesen" badge={<Bezug href="#a1-2">zu Schritt 3</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">In Schritt 3 liest du die Tabelle von unten. So sieht die echte Tabelle zu den Büchern für alle 5.246 Befragten aus. Wähl eine Spalte und schau, was sie zählt.</p>
      <FrequencyTable />
      <Frage>Wo stehen die gültigen und wo die fehlenden Antworten?</Frage>
      <p>Oben stehen die gültigen Antworten 1 bis 5, darunter die Zeile <b>Total valid</b>: alle gültigen zusammen, bei den Büchern 5.223. Unter der Linie folgen die fehlenden Antworten, jede mit ihrem Code und Grund, hier −42 DATENFEHLER: MFN (4) und −9 KEINE ANGABE (19). <b>Total missing</b> zählt sie zusammen (23), <b>Total</b> sind alle Befragten (5.246). Bei <code>ep04</code> liest du in Schritt 3 genauso: Total valid, Total missing, und darüber die Codes mit ihren Gründen.</p>
      <p><b>Formel lesen lernen:</b> So entsteht jede Prozentzahl der Tabelle.</p>
      <PercentFormula />
      <InShort>Die Häufigkeitstabelle zeigt für jeden Wert die <b>absolute Häufigkeit</b> (N, wie viele) und die <b>relative Häufigkeit</b> (Prozent, welcher Anteil). Raw % rechnet mit allen Befragten, Valid % nur mit denen, die gültig geantwortet haben. <b>Kumulierte Prozent</b> (Cum. %) zählen die Valid % von oben nach unten zusammen: „bis einschließlich dieser Zeile“.</InShort>
      <MoreDetail summary="Die Kopfzeile und die Summenzeilen">
        <ul>
          <li>Die Kopfzeile <code># total N=5246 valid N=5223</code> nennt dieselben Zahlen wie Total und Total valid. Dahinter rechnet R Mittelwert (mean), Standardabweichung (sd) und Schiefe (skewness) mit den Codes aus, ob das sinnvoll ist oder nicht. Wann es sinnvoll ist, klärt <a href="#k3-skala">Verstehen zu Aufgabe 3</a>.</li>
          <li>Raw % ergibt über alle Zeilen 100, Valid % nur über die gültigen. Darum steht bei den fehlenden Werten keine Valid-%-Zahl.</li>
          <li>Cum. % ergibt nur Sinn, wenn die Codes eine Reihenfolge haben, wie hier von „täglich“ bis „nie“. Bei Parteien oder Konfessionen hängt die Summe davon ab, in welcher Reihenfolge die Codes zufällig stehen.</li>
          <li>Die Prozentzahlen sind auf zwei Stellen gerundet. Zählst du gerundete Zahlen zusammen, kann am Ende 99,99 oder 100,01 herauskommen.</li>
        </ul>
      </MoreDetail>
      <Mixup>Cum. % ist nicht der Anteil einer einzelnen Antwort. 52,04 in der Zeile MIND. 1X PRO MONAT heißt: 52,04 % lesen mindestens einmal im Monat (täglich, wöchentlich oder monatlich), nicht: 52,04 % lesen genau einmal im Monat. Das sind 13,48 %.</Mixup>
    </Card>

    <Card id="k1-mitte" title="Modus und Median aus der Tabelle" badge={<Bezug href="#a1-3">zu Schritt 4</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Welche Antwort ist am häufigsten, und was antwortet die Person in der Mitte? Beides kennst du aus Methoden Ia. Stell dir vor, alle 5.223 gültigen Antworten zu den Büchern liegen der Reihe nach in einer langen Reihe, von „täglich“ bis „nie“. Das Bild zeigt diese Reihe auf 100 % gestaucht, mit der Mitte bei 50 %.</p>
      <BuecherStreifen />
      <Frage>Die Person genau in der Mitte der Reihe: Wie oft liest sie Bücher?</Frage>
      <p>Geh in der Spalte Cum. % von oben nach unten. Bis „mindestens einmal pro Woche“ kommen erst 38,56 % zusammen, bis „mindestens einmal pro Monat“ sind es 52,04 %. Die 50-%-Marke liegt also in der Stufe „mindestens einmal pro Monat“: Das ist der <b>Median</b>. Allgemein: Die erste Zeile, in der Cum. % die 50 erreicht oder überschreitet, ist die Stufe der mittleren Person.</p>
      <Frage>Und warum ist „seltener“ dann nicht die Mitte?</Frage>
      <p>„Seltener“ ist die häufigste Antwort, mit 1.551 die größte Zahl in N: der <b>Modus</b>. Der höchste Stapel muss nicht in der Mitte der Reihe stehen. In Schritt 4 suchst du bei <code>ep04</code> genauso: den Modus an der größten Zahl in N, den Median an der ersten Zeile mit Cum. % ab 50.</p>
      <InShort>Der <b>Modus</b> ist der häufigste Wert: die Zeile mit dem größten N. Der <b>Median</b> ist der Wert der Person in der Mitte, wenn alle gültigen Antworten der Reihe nach stehen. In der Tabelle ist das die erste Zeile, in der Cum. % die 50 erreicht.</InShort>
      <MoreDetail summary="Warum der Median eine Reihenfolge braucht">
        <ul>
          <li>Der Median setzt voraus, dass die Antworten eine Reihenfolge haben (ordinal oder metrisch). „Täglich“ liest mehr als „pro Woche“, das ergibt eine Reihe. Bei Parteien gibt es keine Reihe und damit keine Mitte, nur einen Modus.</li>
          <li>Bei <code>la01</code> liegt der Median bei „mindestens einmal pro Monat“, der Modus bei „seltener“. Beides stimmt: Die größte Gruppe liest selten, aber gut die Hälfte (52,04 %) liest mindestens einmal im Monat.</li>
          <li>Trifft Cum. % genau die 50, liegt die Mitte zwischen dieser und der nächsten Stufe. Bei Tausenden Befragten kommt das kaum vor.</li>
          <li>Die Kopfzeile nennt mean=3.08. Bei Häufigkeitsstufen wie „täglich“ bis „nie“ sind die Abstände nicht gleich groß; ein Mittelwert von 3,08 lässt sich deshalb nur mit Vorsicht deuten. Mehr in <a href="#k3-skala">Verstehen zu Aufgabe 3</a>.</li>
        </ul>
      </MoreDetail>
      <Mixup>Modus und Median verwechseln. Der Modus ist nicht die mittlere Zeile der Tabelle, sondern die Zeile mit dem größten N. Und die Mitte liegt dort, wo Cum. % die 50 erreicht.</Mixup>
    </Card>

    <Card id="k1-rechnen" title="Zwei Zeilen zusammenzählen: R als Taschenrechner" badge={<Bezug href="#a1-4">zu Schritt 5</Bezug>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">Wie viele erwarten eine schlechtere Lage? Dafür gibt es keine eigene Zeile: „etwas schlechter“ und „wesentlich schlechter“ sind zwei Stufen. Du zählst ihre Anteile zusammen, mit R als Taschenrechner aus Sitzung 1.</p>
      <Code k="a1r" />
      <Frage>Was rechnet die Vorlage?</Frage>
      <p>Sie zählt die Valid % der beiden „besser“-Zeilen zusammen: <code>0.66 + 15.67</code> ergibt 16.33. Das ist genau die Zahl in Cum. % bei ETWAS BESSER, denn Cum. % zählt die Valid % von oben zusammen. Die beiden markierten Zahlen tauschst du im Journal gegen die Valid % der beiden „schlechter“-Zeilen.</p>
      <Frage>Warum Valid % und nicht Raw %?</Frage>
      <p>Gefragt ist der Anteil der gültigen Antworten. Raw % teilt durch alle 5.246 Befragten, auch durch die ohne gültige Antwort. Valid % teilt nur durch die, die geantwortet haben. Weil diese Basis kleiner ist, ist Valid % ein wenig größer als Raw %.</p>
      <Frage>Geht es auch von unten?</Frage>
      <p>Ja. Bei den Büchern: Wie viel Prozent der gültigen Antworten lesen seltener als einmal im Monat oder nie? Das sind die beiden untersten Zeilen, SELTENER und NIE: 29,70 + 18,27 = 47,97. Oder von oben: 100 minus Cum. % der Zeile darüber (MIND. 1X PRO MONAT), 100 − 52,04 = 47,96. Der kleine Unterschied kommt vom Runden der Prozentzahlen. Nur NIE (18,27) wäre zu wenig, und Cum. % bei SELTENER (81,73) zählt alle von „täglich“ bis „seltener“.</p>
      <InShort>Zwei Stufen zusammen sind die Summe ihrer Valid %. Mit Cum. % geht es auch: 100 minus Cum. % der Zeile darüber.</InShort>
      <Mixup>Kommazahlen mit Komma: <code>29,70 + 18,27</code> ergibt in R einen Fehler („Unerwartete(s) ','“). In R schreibst du Kommazahlen mit Punkt, <code>29.70 + 18.27</code>, und Tausender ohne Punkt.</Mixup>
    </Card>

    <Card id="k1-ergebnis" title="Deuten und festhalten: ein Satz zur Tabelle" badge={<Bezug href="#a1-5">zu Schritt 6 und 7</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">In Schritt 6 wählst du einen Satz, der die Tabelle richtig beschreibt. Drei Dinge entscheiden, ob ein Satz stimmt.</p>
      <ul className="s3-liste">
        <li><b>„Die meisten“</b> heißt mehr als die Hälfte. Bei den Büchern ist „seltener“ mit 29,70 % die häufigste Antwort, aber nicht die Antwort der meisten.</li>
        <li><b>„Im Mittel“</b> klingt nach der Mitte. Die Mitte einer geordneten Antwortreihe ist der Median, nicht die häufigste Antwort. Modus und Median können verschiedene Stufen sein (<a href="#k1-mitte">Modus und Median</a>).</li>
        <li><b>Die Basis:</b> Ein Anteil in Valid % gilt für die Befragten mit gültiger Antwort. Ein ehrlicher Satz sagt das dazu (mehr in <a href="#k2-satz">Verstehen zu Aufgabe 2</a>).</li>
      </ul>
      <Frage>Und wo liest du ab, was Schritt 7 wissen will?</Frage>
      <ul className="s3-liste">
        <li><b>Gültige Antworten:</b> Zeile „Total valid“, Spalte N. Gemeint sind nur die Antworten 1 bis 5.</li>
        <li><b>Fehlende Antworten:</b> Zeile „Total missing“, Spalte N.</li>
        <li><b>Modus:</b> die Zeile mit dem größten N, nicht die mittlere Zeile der Tabelle.</li>
        <li><b>Median:</b> die erste Zeile, in der Cum. % die 50 erreicht.</li>
        <li><b>Schlechtere Lage:</b> das Ergebnis deiner Vorlage aus Schritt 5, in Valid %.</li>
        <li><b>Der Satz:</b> die drei Punkte oben.</li>
      </ul>
      <p>Holst du die Ergebnisse ins Journal, steht deine Festlegung aus Schritt 1 daneben. Lag sie daneben, ist das kein Fehler, sondern genau der Moment, für den man vorher festlegt.</p>
    </Card>
  </Abschnitt>;
}

/* ---------- Aufgabe 2 ---------- */
export function Verstehen2() {
  return <Abschnitt id="g2" n={2} titel="Wahlabsicht: drei Prozentzahlen für dieselbe Partei"
    frage="Wie groß ist die Union, und wie groß sind die Unentschlossenen, je nachdem, wen du mitzählst?"
    ziel="für eine Partei drei Prozentzahlen, jede mit ihrer Basis, und kannst begründen, welche Zahl zu welchem Satz passt."
    weg={[
      ['Schritt 1', '#a2-p', 'Erst festlegen: Wie viele sagen „weiß nicht“?', 'k2-gruende'],
      ['Schritt 2', '#a2-1', 'Vorlage ausführen: die Gründe für fehlende Antworten', 'k2-gruende'],
      ['Schritt 3', '#a2-2', 'Raw % und Valid % für CDU/CSU', 'k2-basis'],
      ['Schritt 4', '#a2-3', 'eine eigene Basis rechnen', 'k2-eigen'],
      ['Schritt 5', '#a2-4', 'Deuten: der Zeitungssatz', 'k2-satz'],
      ['Schritt 6', '#a2-5', 'Ergebnis festhalten', 'k2-satz'],
    ]}>

    <Card id="k2-gruende" title="Warum eine Antwort fehlt" badge={<Bezug href="#a2-p">zu Schritt 1 und 2</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Aus Sitzung 2 weißt du: Im ALLBUS steht hinter jeder Lücke ein negativer Code mit einem Grund. Wo eine Lücke entsteht, sortieren drei Regale. Hier stehen die sieben Codes, die dir in diesem Kapitel begegnen, schon im richtigen Regal. Fünf kennst du, −7 VERWEIGERT und −41 DATENFEHLER sind neu, aber ihre Namen verraten viel.</p>
      <RegaleErklaert />
      <p>Dazu kommen Codes, die zu einer bestimmten Frage gehören, etwa −6 KENNE ICH NICHT (Sitzung 1 und 2). −50 heißt bei der Wahlabsicht NICHT WAHLBERECHTIGT, bei der Schichteinstufung KEINER DER SCHICHTEN (15 Befragte). −32 NICHT GENERIERBAR steht bei Variablen, die der ALLBUS aus anderen Angaben berechnet, etwa die Zahl der Personen im Haushalt (102 Befragte). Was ein Code bei einer Variable heißt, steht im Codebuch und unten in der Tabelle von <code>frequency()</code>.</p>
      <Frage>Was hat das mit Schritt 1 und 2 zu tun?</Frage>
      <Code k="a2" />
      <p>Die Vorlage in Schritt 2 zählt die Wahlabsicht aus, genauso wie <code>frequency(ep04)</code> in Aufgabe 1. „Weiß nicht“ (−8) steht bei der Wahlabsicht als eigene Zeile unter der Linie. Wie viele das sind, steht in der Spalte N, ihr Anteil an allen Befragten in Raw %. Genau danach fragt deine Festlegung in Schritt 1. In Schritt 2 vergleichst du die Zahlen in N unter der Linie: Die größte gehört zum häufigsten Grund.</p>
      <InShort><b>Fehlende Werte</b> (Fachbegriff auch Missing) sind Antworten, die nicht in die Auswertung eingehen. Im ALLBUS trägt jede einen Code mit Grund: nie gefragt (Studiendesign), nicht beantwortet (Befragte) oder beim Erfassen verloren. <code>frequency()</code> zeigt sie unter der Linie mit Grund und Anzahl und zählt sie zusammen unter „Total missing“.</InShort>
      <MoreDetail summary="Was R aus den Codes macht">
        <ul>
          <li>Wie in Sitzung 2: <code>read_spss()</code> aus mariposa liest jeden Missing-Code als fehlenden Wert (NA), behält aber den Code und sein Wertelabel als Aufkleber. Deshalb kann <code>frequency()</code> die Gründe getrennt zählen, während <code>describe()</code> alle zusammen unter „Missing“ meldet.</li>
          <li>Für Mittelwert und Prozent zählen fehlende Werte nicht mit. Das ist meistens richtig. Aber nicht jede Lücke ist gleich: Wer nie gefragt wurde, hat keine Meinung verweigert. Und „weiß nicht“ kann selbst eine Aussage sein, etwa bei einer Wahlabsicht.</li>
          <li>Fehlende Werte ausdrücklich weglassen, etwa für eine Grafik, lernst du in Sitzung 4.</li>
          <li>Mehr dazu im R-Workshop, Kapitel 4.8.</li>
        </ul>
      </MoreDetail>
      <Mixup>Fehlend heißt nicht „hat die Antwort verweigert“. Bei der Frage nach dem Vertrauen zu Mitmenschen (st01) fehlen 1.686 Antworten, aber 1.647 davon tragen −11 TNZ: SPLIT: Diese Menschen wurden nie gefragt.</Mixup>
    </Card>

    <Card id="k2-basis" title="Prozent wovon? Raw % und Valid %" badge={<Bezug href="#a2-2">zu Schritt 3</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">„Kann man den meisten Menschen vertrauen, oder muss man im Umgang mit anderen vorsichtig sein?“ Antworten: man kann trauen, man muss vorsichtig sein, kommt darauf an. Diese Frage (st01) kennst du vom Bogen in Sitzung 2. Wie viele sagen „kommt darauf an“? Das hängt davon ab, wen du mitzählst. Schalte die Basis um.</p>
      <HundredStones />
      <p>Niemand hat seine Antwort geändert. Nur die Basis ist eine andere: einmal alle Befragten, einmal nur die, die gültig geantwortet haben. Die Tabelle von <code>frequency(st01)</code> zeigt beides nebeneinander: Raw % 27.89 und Valid % 41.10.</p>
      <Frage>Und bei der CDU/CSU in Schritt 3?</Frage>
      <p>Dort liest du in der Zeile CDU-CSU dieselben zwei Spalten ab. Raw % teilt die Stimmen für die Union durch alle 5.246 Befragten, Valid % nur durch die 3.984 mit gültiger Antwort. Je mehr Antworten fehlen, desto weiter liegen die beiden Zahlen auseinander.</p>
      <InShort>Jede Prozentzahl hat eine <b>Prozentbasis</b>: die Gruppe, durch die geteilt wird. Raw % teilt durch alle Befragten, Valid % nur durch die gültigen Antworten. Wenn du eine Prozentzahl nennst, sag dazu, wovon.</InShort>
      <Mixup>Valid % heißt nicht „Prozent aller Befragten“. Valid % gilt nur für die, die gültig geantwortet haben. Wer fehlt, zählt dort nicht mit.</Mixup>
    </Card>

    <Card id="k2-eigen" title="Eine eigene Basis rechnen" badge={<Bezug href="#a2-3">zu Schritt 4</Bezug>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">Manchmal passt keine der beiden Spalten. Soll „weiß nicht“ mitzählen, weil es auch eine Aussage ist, rechnest du die Basis selbst. Bei st01 sieht das so aus: dieselben 1.463 Antworten „kommt darauf an“, geteilt durch drei verschiedene Basen.</p>
      <ThreeBases />
      <p>Mit „weiß nicht“ in der Basis rechnest du <code>1463 / (3560 + 5) * 100</code>. Bei st01 macht das kaum etwas aus, weil nur 5 Befragte „weiß nicht“ sagen. Bei der Wahlabsicht ist das anders.</p>
      <Code k="a2r" />
      <Frage>Was steht wo in der Vorlage?</Frage>
      <ul className="s3-liste">
        <li><b>Zähler:</b> vor dem Schrägstrich, die Gruppe, deren Anteil du willst. In der Vorlage ist das die CDU/CSU mit 988 Stimmen.</li>
        <li><b>Basis:</b> hinter dem Schrägstrich in Klammern, 3984 gültige plus 603 „weiß nicht“. Die Klammer sorgt dafür, dass R erst die Basis zusammenzählt und dann teilt.</li>
        <li><b>Mal 100:</b> <code>* 100</code> macht aus dem Anteil eine Prozentzahl.</li>
      </ul>
      <Frage>Und für die Unentschlossenen?</Frage>
      <p>Dann wechselt nur der Zähler: Statt der CDU/CSU steht dort die Gruppe „weiß nicht“. Die Basis bleibt, wie sie ist, denn die Unentschlossenen gehören selbst zu der Basis, die du festgelegt hast.</p>
      <InShort>Eine <b>eigene Basis</b> legst du selbst fest, wenn keine Spalte der Tabelle passt. Je kleiner die Basis, desto größer der Anteil. Sag im Satz dazu, wer in der Basis steckt.</InShort>
      <Mixup>Ohne Klammer gilt Punkt vor Strich: <code>988 / 3984 + 603 * 100</code> teilt nur durch 3984 und zählt dann 60.300 dazu. Die Klammer um die Basis gehört immer dazu.</Mixup>
    </Card>

    <Card id="k2-satz" title="Ein ehrlicher Satz nennt die Basis" badge={<Bezug href="#a2-4">zu Schritt 5 und 6</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">Prozentzahlen mit verschiedenen Basen können alle richtig gerechnet sein, nur sagen sie Verschiedenes. Welche in einen Satz gehört, entscheidet, was der Satz behauptet.</p>
      <Frage>Eine Zeitung will schreiben, wie viele bei st01 „kommt darauf an“ sagen. Welcher Satz ist am ehrlichsten?</Frage>
      <p>„28 % der Befragten sagen: kommt darauf an“ ist richtig gerechnet, aber irreführend: 28 % aller Befragten schließt die 1.647 ein, die die Frage nie bekommen haben. Ein knappes Drittel der Basis konnte gar nicht „kommt darauf an“ sagen. Am ehrlichsten ist Valid % mit Basis: „41 % derer, die geantwortet haben (n = 3.560)“. Der Zusatz sagt, für wen die Zahl gilt. Ohne ihn klänge 41 % so, als gälte die Zahl für alle Befragten.</p>
      <Frage>Woran erkennst du, auf welche Basis sich ein Satz bezieht?</Frage>
      <p>An den Wörtern. Bei st01 klingt „28 % der Befragten“ nach allen Befragten, und das stimmt dort auch. „41 % derer, die geantwortet haben“ nennt die kleinere Basis. Stünde dort „41 % der Befragten“, wäre die Zahl richtig gerechnet und der Satz trotzdem irreführend, weil seine Wörter eine andere Basis versprechen.</p>
      <Frage>Und wo liest du ab, was Schritt 6 wissen will?</Frage>
      <ul className="s3-liste">
        <li><b>Häufigster Grund:</b> unter der Linie in <code>frequency(pv01)</code>, die größte Zahl in N.</li>
        <li><b>Total missing:</b> die Zeile mit diesem Namen, Spalte N.</li>
        <li><b>Raw % und Valid %:</b> die Zeile CDU-CSU, die beiden Spalten.</li>
        <li><b>Die eigene Basis:</b> das Ergebnis deiner Vorlage aus Schritt 4, mit getauschtem Zähler.</li>
        <li><b>Der Zeitungssatz:</b> die beiden Fragen oben.</li>
      </ul>
      <MoreDetail summary="Ungewichtet">
        <p>Alle Zahlen hier sind ungewichtet, genau wie die Ausgabe deiner Vorlagen. Gewichtet ändern sie sich etwas; das ist Thema in Sitzung 6.</p>
      </MoreDetail>
    </Card>
  </Abschnitt>;
}

/* ---------- Aufgabe 3 ---------- */
export function Verstehen3() {
  return <Abschnitt id="g3" n={3} titel="Wie lange dauert Arbeitslosigkeit?"
    frage="Wie lange waren Menschen ohne Arbeit, und welche Zahl beschreibt das ehrlich?"
    ziel="Mittelwert, Median und N aus describe() abgelesen und kannst sagen, wer in diesen Zahlen fehlt und welche Zahl die typische Dauer besser beschreibt."
    weg={[
      ['Schritt 1', '#a3-p', 'Erst festlegen: Mittelwert im Vergleich zum Median', 'k3-reihe'],
      ['Schritt 2', '#a3-1', 'describe(): Mean, Median, N und Missing', 'k3-describe'],
      ['Schritt 3', '#a3-2', 'Wer fehlt? Die Gründe ganz unten in frequency()', 'k3-wer'],
      ['Schritt 4', '#a3-3', 'Mittelwert und Median vergleichen', 'k3-schief'],
      ['Schritt 5', '#a3-4', 'Deuten: ein Satz für den Bericht, und ep04 aus Aufgabe 1', 'k3-skala'],
      ['Schritt 6', '#a3-5', 'Ergebnis festhalten', 'k3-ergebnis'],
    ]}>

    <Card id="k3-reihe" title="Die Mitte einer Reihe: Mittelwert und Median" badge={<Bezug href="#a3-p">zu Schritt 1</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">In Schritt 1 legst du dich fest, bevor du rechnest: So merkst du hinterher, ob dein Bild von den Daten gestimmt hat. Mittelwert und Median kennst du aus Methoden Ia. Neun Befragte sagen, wie viele Personen in ihrem Haushalt leben, zum Beispiel. Geh die Schritte durch; der letzte zeigt, was ein einzelner großer Wert macht.</p>
      <HaushaltsReihe />
      <Frage>Was passiert, wenn eine zehnte Person dazukommt, die in einer Wohngemeinschaft mit 12 Personen lebt?</Frage>
      <p>Der Mittelwert steigt von 2,44 auf 3,4, weil die 12 mit ihrem ganzen Gewicht in die Summe eingeht: 34 geteilt durch 10. Der Median bleibt 2, weil sich in der Mitte der Reihe nichts ändert. Dort stehen weiter zwei Steine mit 2.</p>
      <InShort>Der <b>Mittelwert</b> (arithmetisches Mittel) ist die Summe aller Werte geteilt durch ihre Anzahl, der Schwerpunkt der Reihe. Der <b>Median</b> ist der Wert in der Mitte der sortierten Reihe. Ein einzelner Wert weit draußen zieht den Mittelwert mit, den Median kaum.</InShort>
      <MoreDetail summary="Formel lesen lernen: der Mittelwert">
        <MeanFormula />
        <p>Von innen nach außen gelesen: Erst zählst du alle Werte zusammen (Σx). Dann teilst du durch ihre Anzahl (n). Weil jeder Wert in die Summe eingeht, verschiebt ein einziger großer Wert das Ergebnis.</p>
        <p>Beim Median gibt es keine Rechnung mit allen Werten: Du sortierst und nimmst den mittleren. Bei einer geraden Anzahl liegt die Mitte zwischen zwei Werten; dann ist der Median der Wert genau dazwischen.</p>
        <p>Der <b>Modus</b>, der häufigste Wert, ist hier ebenfalls 2: Vier der neun Befragten leben zu zweit.</p>
      </MoreDetail>
      <Mixup>„Durchschnitt“ und „Mitte“ sind nicht dasselbe. Im Alltag sagt man „im Durchschnitt“ und meint oft „das Übliche“. Statistisch ist der Durchschnitt der Mittelwert, und der kann weit von der mittleren Person entfernt liegen.</Mixup>
    </Card>

    <Card id="k3-describe" title="Kennzahlen mit describe()" badge={<Bezug href="#a3-1">zu Schritt 2</Bezug>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead"><code>describe()</code> ist heute neu. Es fasst eine Variable mit Zahlen in wenigen Kennzahlen zusammen. So sieht die Ausgabe für die Zahl der Personen im Haushalt aus, für alle Befragten.</p>
      <DescribeOutput />
      <p>So liest du die Zeile:</p>
      <ul className="s3-liste">
        <li><b>Mean</b> ist der Mittelwert: 2.342, also 2,34 Personen.</li>
        <li><b>Median</b>: 2.000, also 2 Personen. Die Person in der Mitte der Reihe lebt zu zweit; allein oder zu zweit leben mindestens die Hälfte der Befragten.</li>
        <li><b>N</b>: 5144 Befragte mit gültiger Angabe gehen in die Rechnung ein.</li>
        <li><b>Missing</b>: 102 ohne gültige Angabe, hier alle mit −32 NICHT GENERIERBAR. <code>describe()</code> zählt alle Gründe zusammen; welche es sind, zeigt <code>frequency()</code>.</li>
        <li><b>SD</b> ist die Standardabweichung, der typische Abstand zum Mittelwert (kennst du aus Methoden Ia). <b>Range</b>, <b>IQR</b> und <b>Skewness</b> liest du in Sitzung 4.</li>
      </ul>
      <Frage>Warum liegt der Mittelwert mit 2,34 über dem Median 2?</Frage>
      <p>An den größeren Haushalten: Nach oben reicht die Reihe viel weiter als nach unten. Unter dem Median 2 gibt es nur noch Haushalte mit 1 Person, darüber Haushalte mit 3, 4, 5 und mehr Personen. Diese größeren Haushalte ziehen den Mittelwert nach oben, der Median bleibt bei 2. An den 102 fehlenden Angaben liegt es nicht: Fehlende Angaben gehen gar nicht in die Rechnung ein, weder in den Mittelwert noch in den Median. Und R rundet nicht ab: 2.000 ist genau 2.</p>
      <p>Die Vorlage in Schritt 2 macht dasselbe mit <code>dw19</code>, der Dauer der Arbeitslosigkeit in Wochen.</p>
      <Code k="a3" />
      <InShort><code>describe()</code> fasst eine Variable in Kennzahlen zusammen. Für die Mitte schaust du auf <b>Mean</b> (Mittelwert) und <b>Median</b>, für die Basis auf <b>N</b> (wie viele gültige Werte eingehen) und <b>Missing</b> (wie viele fehlen).</InShort>
      <Mixup>N in <code>describe()</code> ist nicht die Zahl aller Befragten, sondern die Zahl der gültigen Werte. Alle Befragten sind N plus Missing: 5.144 + 102 = 5.246.</Mixup>
    </Card>

    <Card id="k3-wer" title="Wer fehlt? Die Gründe stehen ganz unten" badge={<Bezug href="#a3-2">zu Schritt 3</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead"><code>describe()</code> meldet unter Missing nur, wie viele fehlen, nicht warum. Die Gründe zeigt die Häufigkeitstabelle derselben Variable, ganz unten unter der Linie.</p>
      <Code k="a3f" />
      <Frage>Warum ist diese Tabelle so lang?</Frage>
      <p>Weil jede Wochenzahl eine eigene Zeile hat. Bei einer Variable mit vielen verschiedenen Werten wird die Häufigkeitstabelle lang. Die gültigen Werte stehen der Größe nach untereinander, die längsten Zeiten am Ende der gültigen Zeilen. Darunter folgen die fehlenden, jede mit Code, Grund und Anzahl.</p>
      <Frage>Welche Gründe können hinter den fehlenden Angaben stecken?</Frage>
      <p>Dieselben drei Regale wie in <a href="#k2-gruende">Verstehen zu Aufgabe 2</a>: nie gefragt, nicht beantwortet oder beim Erfassen verloren. Bei dieser Frage hilft es, sich an den Weg durch den Fragebogen zu erinnern: Der ALLBUS fragt alle, die in Voll- oder Teilzeit berufstätig sind, ob sie in den letzten zehn Jahren arbeitslos waren. Wer ja sagt, wird gefragt, wie lange. Wer an einer Frage vorbeigeleitet wurde, steht mit einem eigenen Code unter der Linie. Welcher Code bei den meisten steht, siehst du ganz unten in der Tabelle.</p>
      <InShort>Eine <b>Filterfrage</b> leitet Befragte an Fragen vorbei, die nicht zu ihnen passen.</InShort>
      <Frage>Was heißt das für die Kennzahlen aus Schritt 2?</Frage>
      <p>Sie beschreiben nur die, an die die Frage ging und die gültig geantwortet haben. Wer nie gefragt wurde, hat nichts verweigert. Darum gehört zu jeder Kennzahl die Angabe, für wen sie gilt.</p>
      <Mixup>Missing in <code>describe()</code> ist kein Grund, sondern eine Summe. Welche Codes dahinterstecken und wie viele es je Code sind, zeigt nur <code>frequency()</code>.</Mixup>
    </Card>

    <Card id="k3-schief" title="Mittelwert und Median vergleichen" badge={<Bezug href="#a3-3">zu Schritt 4</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">In Schritt 4 vergleichst du die beiden Zahlen aus Schritt 2. Liegen sie weit auseinander, lohnt die Frage: Was zieht den Mittelwert weg?</p>
      <Frage>Was kann einen Mittelwert so weit ziehen?</Frage>
      <p>Wenige sehr große Werte. Der Mittelwert zählt jeden Wert zusammen, auch die wenigen sehr großen. Der Median schaut nur auf die Person in der Mitte. In der Reihe der Haushalte reichte eine einzige WG mit 12 Personen, um den Mittelwert von 2,44 auf 3,4 zu heben; der Median blieb bei 2 (<a href="#k3-reihe">Die Mitte einer Reihe</a>). Bei der Arbeitslosigkeit reichen die längsten Zeiten bis 520 Wochen, das sind zehn Jahre. Wo sie stehen, siehst du am Ende der gültigen Zeilen der Tabelle aus Schritt 3.</p>
      <Frage>Welche Zahl beschreibt dann das Typische?</Frage>
      <p>Der Median sagt, was für die Person in der Mitte gilt: Die eine Hälfte liegt darunter oder gleichauf, die andere darüber. Der Mittelwert ist richtig gerechnet, beschreibt bei einem langen Auslauf zu großen Werten aber nicht die typische Person. Liegen beide weit auseinander, gehören beide in den Bericht, und der Satz sagt dazu, was den Mittelwert zieht.</p>
      <InShort>Der Mittelwert folgt wenigen extremen Werten, der Median bleibt in der Mitte. Liegen sie weit auseinander, gehören beide in den Bericht.</InShort>
      <Mixup>„Im Schnitt“ heißt im Alltag oft „normalerweise“. Statistisch ist der Schnitt der Mittelwert, und der kann weit von der mittleren Person entfernt liegen.</Mixup>
    </Card>

    <Card id="k3-skala" title="Welche Mitte passt zu welcher Variable?" badge={<Bezug href="#a3-4">zu Schritt 5</Bezug>} tag={{ kind: 'interpret', label: 'Hintergrund' }}>
      <p className="lead">In Sitzung 2 hast du gesehen: Der Mittelwert der Partei-Codes, 16,1, sagt nichts über die Wahlabsicht. Genau diese Zahl steht in der Kopfzeile von <code>frequency(pv01)</code>: <code>frequency()</code> rechnet dort immer einen Mittelwert aus, auch wo er nichts bedeutet. Bei der Konfession (rd01) steht mean=4.06. Die Codes sind dort 1 evangelisch (ohne Freikirchen), 3 römisch-katholisch, 6 keiner Religionsgemeinschaft und so weiter. Was wäre eine Konfession „4,06“? Ob eine Mitte sinnvoll ist, hängt vom <b>Skalenniveau</b> ab.</p>
      <ScaleLevels />
      <Frage>Wie wendet man das auf eine Variable an?</Frage>
      <ul className="s3-liste">
        <li><b>Wahlabsicht, Parteien:</b> nominal, nur der Modus. Parteien haben keine Reihenfolge, also keine Mitte. Ein Mittelwert aus Parteicodes ergibt keinen Sinn; die Codes sind nur Namen.</li>
        <li><b>Gesundheitszustand, sehr gut bis schlecht:</b> ordinal, Modus und Median. Ein Mittelwert setzt gleiche Abstände zwischen den Stufen voraus. Ob „gut“ und „sehr gut“ so weit auseinanderliegen wie „schlecht“ und „weniger gut“, weiß niemand.</li>
        <li><b>Alter in Jahren:</b> metrisch, alle drei sind sinnvoll. Ein Jahr ist überall gleich lang; hier darfst du rechnen. Bei schiefen Verteilungen gehören Mittelwert und Median zusammen in den Bericht.</li>
      </ul>
      <Frage>Und der Blick zurück auf Aufgabe 1?</Frage>
      <p>In der Kopfzeile jeder Tabelle von <code>frequency()</code> steht ein Mittelwert, auch bei <code>ep04</code>. R rechnet ihn immer aus, ob er etwas bedeutet oder nicht. Ob er in deinen Bericht gehört, entscheiden zwei Fragen: Haben die Stufen eine Reihenfolge? Und sind die Abstände zwischen ihnen gleich groß?</p>
      <InShort>Das <b>Skalenniveau</b> sagt, was die Codes einer Variable bedeuten. <b>Nominal</b>: nur Namen, dann gibt es nur den Modus. <b>Ordinal</b>: eine Reihenfolge, dazu der Median. <b>Metrisch</b>: gleiche Abstände, erst dann ist der Mittelwert sicher sinnvoll.</InShort>
      <MoreDetail summary="Nominal und der Median">
        <p>Auch bei der Konfession kannst du in <code>frequency(rd01)</code> die Spalte Cum. % lesen. Sie erreicht die 50 erst beim Code 5, „andere nicht-christliche Religion“ (Cum. % 49,31 bei Code 4, 52,32 bei Code 5). Ein „Median“ wäre das trotzdem nicht: Er hängt nur davon ab, in welcher Reihenfolge die Codes zufällig vergeben wurden. Stünde „keiner Religionsgemeinschaft“ vorn, käme etwas anderes heraus.</p>
      </MoreDetail>
      <MoreDetail summary="Ordinal und der Mittelwert">
        <p>In der Forschung werden Skalen wie „1 sehr gut bis 5 schlecht“ oft wie metrisch behandelt und gemittelt. Das ist eine Annahme: dass der Schritt von „gut“ zu „sehr gut“ genauso groß ist wie der von „schlecht“ zu „weniger gut“. Wer einen Mittelwert einer ordinalen Variable berichtet, sollte Median und Häufigkeiten danebenstellen.</p>
      </MoreDetail>
      <Mixup>Eine Zahl im Datensatz macht eine Variable nicht metrisch. Auch Parteien und Konfessionen sind im ALLBUS als Zahlen gespeichert. R rechnet mit ihnen, ob es Sinn ergibt oder nicht. Ob es Sinn ergibt, entscheidest du.</Mixup>
    </Card>

    <Card id="k3-ergebnis" title="Ergebnis festhalten: wo du was abliest" badge={<Bezug href="#a3-5">zu Schritt 6</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">In Schritt 6 hältst du sechs Dinge fest. Jedes hat einen Ort, an dem du es ablesen oder begründen kannst.</p>
      <ul className="s3-liste">
        <li><b>Mittelwert und Median:</b> in <code>describe(dw19)</code> die Spalten Mean und Median. R schreibt drei Nachkommastellen mit Punkt.</li>
        <li><b>N:</b> in derselben Ausgabe die Spalte N, nicht Missing und nicht alle Befragten (<a href="#k3-describe">Kennzahlen mit describe()</a>).</li>
        <li><b>Warum die Dauer fehlt:</b> die Codes ganz unten in <code>frequency(dw19)</code> (<a href="#k3-wer">Wer fehlt?</a>).</li>
        <li><b>Die typische Dauer:</b> <a href="#k3-schief">Mittelwert und Median vergleichen</a>.</li>
        <li><b>Der Bericht zu ep04:</b> <a href="#k3-skala">Welche Mitte passt zu welcher Variable?</a></li>
      </ul>
    </Card>
  </Abschnitt>;
}

/* ---------- Aufgabe 4 ---------- */
export function Verstehen4() {
  return <Abschnitt id="g4" n={4} titel="Wie viele liegen über dem Durchschnitt?"
    frage="Wie viele waren länger arbeitslos als der Durchschnitt?"
    ziel="mit Cum. % und dem Taschenrechner ausgerechnet, wie viel Prozent über dem Mittelwert liegen, und kannst sagen, was das über die Verteilung verrät."
    weg={[
      ['Schritt 1', '#a4-p', 'Erst festlegen: Liegt die Hälfte über dem Mittelwert?', 'k4-cum'],
      ['Schritt 2', '#a4-1', 'die letzte Zeile unter dem Mittelwert finden', 'k4-zeile'],
      ['Schritt 3', '#a4-2', '100 minus Cum. % rechnen', 'k4-cum'],
      ['Schritt 4', '#a4-3', 'Ergebnis festhalten: was das über die Verteilung sagt', 'k4-zeile'],
    ]}>

    <Card id="k4-cum" title="Cum. % und der Mittelwert" badge={<Bezug href="#a4-p">zu Schritt 1 und 3</Bezug>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Im Mittel leben 2,34 Personen im Haushalt der Befragten (<a href="#k3-describe">Kennzahlen mit describe()</a>). Wie viele leben in einem größeren Haushalt als dem Durchschnitt? Die Spalte Cum. % von <code>frequency(dh04)</code> verrät es. Das Bild zeigt die Haushaltsgrößen als Streifen von 0 bis 100 %.</p>
      <HaushaltsStreifen />
      <Frage>Wie viel Prozent leben in einem Haushalt mit mehr Personen als im Durchschnitt?</Frage>
      <p>Such in Cum. % die letzte Zeile unter dem Mittelwert 2,34: Das ist 2 Personen, mit 67,42. So viele leben höchstens zu zweit, also höchstens beim Mittelwert. Über dem Mittelwert liegt der Rest: 100 − 67,42 = 32,58 %. Nur ein Drittel liegt über dem Durchschnitt. 50 % lägen darüber, wenn der Mittelwert genau in der Mitte der Reihe stünde.</p>
      <Code k="a4r" />
      <p>Genau diese Rechnung steht in der Vorlage von Schritt 3. Die markierte Zahl tauschst du im Journal gegen den Wert aus Cum. %, den du in Schritt 2 bei der Dauer der Arbeitslosigkeit findest.</p>
      <InShort>Cum. % sagt, wie viel Prozent höchstens bis zu einem Wert kommen. <b>100 minus Cum. %</b> sind die, die darüber liegen. Über dem Median liegt höchstens die Hälfte, bei Variablen mit vielen verschiedenen Werten fast genau die Hälfte. Über dem Mittelwert können es bei einer schiefen Verteilung viel weniger oder viel mehr sein.</InShort>
      <MoreDetail summary="Schiefe Verteilungen">
        <p>Rechtsschiefe Verteilungen haben einen langen Auslauf zu großen Werten (Fachbegriff: Schiefe, mehr in Sitzung 4). Dann liegt der Mittelwert meist über dem Median, und meist liegt deutlich weniger als die Hälfte über dem Mittelwert. Bei wenigen Stufen wie hier kann auch über dem Median weniger als die Hälfte liegen: 44,46 % leben genau zu zweit, also genau auf dem Median, und über ihm liegen nur 32,58 %. Bei einem langen Auslauf zu kleinen Werten ist es umgekehrt. Wie viele über dem Mittelwert liegen, ist darum ein schneller Test, ob „Durchschnitt“ und „Mitte“ zusammenpassen.</p>
      </MoreDetail>
      <Mixup>„Durchschnitt“ heißt nicht, dass die Hälfte darüber liegt. Für den Median gilt: Über ihm liegt höchstens die Hälfte, unter ihm ebenso.</Mixup>
    </Card>

    <Card id="k4-zeile" title="Die letzte Zeile unter dem Mittelwert" badge={<Bezug href="#a4-1">zu Schritt 2 und 4</Bezug>} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">In Schritt 2 suchst du in der langen Tabelle der Wochen die richtige Zeile. Die Vorlage ist dieselbe Häufigkeitstabelle wie in Aufgabe 3, Schritt 3.</p>
      <Code k="a4" />
      <p>In der Spalte <b>Value</b> stehen die Wochenzahlen der Größe nach. Der Mittelwert aus Aufgabe 3 ist selbst keine Wochenzahl, die jemand angegeben hat. Gesucht ist die größte Wochenzahl unter dem Mittelwert aus Aufgabe 3, die in der Tabelle steht, und in ihrer Zeile die Zahl in Cum. %.</p>
      <Frage>Warum genau diese Zeile?</Frage>
      <p>Cum. % zählt von oben bis einschließlich dieser Zeile zusammen. In der letzten Zeile unter dem Mittelwert stehen also alle, die höchstens so lange arbeitslos waren wie der Durchschnitt. Nimmst du eine Zeile zu früh, fehlen dir die Wochenzahlen danach, die noch unter dem Mittelwert liegen. Nimmst du die erste Zeile über dem Mittelwert, zählst du schon Menschen über dem Mittelwert mit.</p>
      <Frage>Was verrät das Ergebnis über die Verteilung?</Frage>
      <p>Das fragt Schritt 4. Vergleiche dein Ergebnis mit der Hälfte und denk an das Haushaltsbeispiel oben und an Mittelwert und Median aus <a href="#k3-schief">Aufgabe 3</a>.</p>
      <InShort>Eine Verteilung mit einem langen Auslauf zu großen Werten heißt <b>rechtsschief</b>. Wenige sehr große Werte ziehen dann den Mittelwert nach oben.</InShort>
    </Card>
  </Abschnitt>;
}

/* ---------- Überblick ---------- */
export function Ueberblick() {
  return <section className="grund-block" id="g5" aria-labelledby="g5-h">
    <div className="g-kopf">
      <span className="st m c7" aria-hidden="true">✓</span>
      <div><div className="ueber">Überblick über alle Aufgaben</div><h4 id="g5-h">Eine Tabelle lesen, eine Mitte wählen</h4></div>
    </div>
    <p className="g-intro">Alle vier Aufgaben zusammen: welche Zahl wofür steht und welche Mitte wann passt.</p>
    <HeadingLevel.Provider value={5}>
      <Card id="k5-tabelle" title="Vier Fragen an eine Häufigkeitstabelle" badge={<Badge>für alle Aufgaben</Badge>} tag={{ kind: 'interpret', label: 'Hintergrund' }}>
        <div className="s3-tabelle">
          <table className="daten voll">
            <caption className="sr-only">Vier Fragen an eine Häufigkeitstabelle</caption>
            <thead><tr><th scope="col">Frage</th><th scope="col">Wo in der Ausgabe</th><th scope="col">So schreibst du es</th></tr></thead>
            <tbody>
              <tr><td>Wie viele?</td><td>Spalte N</td><td>„1.551 Befragte lesen seltener als einmal im Monat Bücher.“</td></tr>
              <tr><td>Welcher Anteil derer, die geantwortet haben?</td><td>Valid % (Basis: Total valid)</td><td>„29,7 % der Befragten mit gültiger Antwort lesen seltener als einmal im Monat Bücher.“</td></tr>
              <tr><td>Welcher Anteil aller Befragten?</td><td>Raw % (Basis: Total)</td><td>„29,6 % aller Befragten, auch derer ohne gültige Antwort, lesen seltener als einmal im Monat Bücher.“</td></tr>
              <tr><td>Wie viele bis zu einer Stufe?</td><td>Cum. %</td><td>„38,6 % der Befragten mit gültiger Antwort lesen mindestens einmal pro Woche Bücher.“</td></tr>
            </tbody>
          </table>
        </div>
        <p>Die Beispiele stammen aus der Tabelle zu den Büchern (<code>la01</code>, <a href="#k1-spalten">Die Spalten von frequency()</a>). Und immer dazu: wie viele fehlen (Total missing) und warum (Codes unten in der Tabelle). Alle Zahlen hier sind ungewichtet.</p>
      </Card>

      <Card id="k5-mitte" title="Welche Mitte passt?" badge={<Badge>Modus, Median, Mittelwert</Badge>} tag={{ kind: 'picture', label: 'Im Bild' }}>
        <MitteBaum />
        <InShort>Erst prüfen, wer mitzählt; dann die Mitte nach dem Skalenniveau wählen. Eine Prozentzahl ohne Basis und ein Mittelwert ohne Median können in die Irre führen.</InShort>
      </Card>

      <Card id="k5-voraus" title="Voraussetzungen" badge={<Badge>je Kennzahl</Badge>} tag={{ kind: 'interpret', label: 'Hintergrund' }}>
        <div className="s3-tabelle">
          <table className="daten voll">
            <caption className="sr-only">Voraussetzungen je Kennzahl</caption>
            <thead><tr><th scope="col">Kennzahl</th><th scope="col">braucht</th><th scope="col">Vorsicht</th></tr></thead>
            <tbody>
              <tr><td>Raw %, Valid %</td><td>jede Variable, auch nominal</td><td>Basis nennen; bei Split und Filter ist Raw % fast immer irreführend.</td></tr>
              <tr><td>Cum. %</td><td>geordnete Codes</td><td>Bei nominalen Variablen hängt Cum. % von der zufälligen Reihenfolge der Codes ab.</td></tr>
              <tr><td>Modus</td><td>jede Variable, auch nominal</td><td>Bei mehreren fast gleich hohen Stapeln wenig aussagekräftig.</td></tr>
              <tr><td>Median</td><td>geordnete Codes</td><td>Liegt Cum. % genau bei 50, liegt er zwischen zwei Stufen.</td></tr>
              <tr><td>Mittelwert</td><td>gleiche Abstände (metrisch)</td><td>Wird von wenigen extremen Werten gezogen; die Kopfzeile von <code>frequency()</code> rechnet ihn auch dort, wo er nichts bedeutet.</td></tr>
            </tbody>
          </table>
        </div>
        <Mixup>Fehlende Werte „verschwinden“ nicht. Sie stehen in jeder Tabelle unten, mit Grund. Wer sie nicht nennt, verschweigt, für wen die Zahl gilt.</Mixup>
      </Card>
    </HeadingLevel.Provider>
  </section>;
}

/* ---------- Themen für den Reiter „Verstehen“ (Reihenfolge, Karten für die rechte Leiste) ---------- */
export const THEMEN: Thema[] = [
  { id: 'vorweg', n: 'R', kurz: 'R lesen', titel: 'Vorweg: R lesen', minuten: 10, Inhalt: Vorweg,
    karten: [['r1', 'Startblock und eine Zeile'], ['r2', 'Drei Werkzeuge für heute']] },
  { id: 'g1', n: '1', kurz: 'Aufgabe 1', titel: 'Wie geht es der Wirtschaft in einem Jahr?', minuten: 15, Inhalt: Verstehen1, aufgabe: 1,
    karten: [['k1-turm', 'Vom Turm zur Tabelle'], ['k1-spalten', 'Die Spalten von frequency()'], ['k1-mitte', 'Modus und Median'], ['k1-rechnen', 'Zwei Zeilen zusammenzählen'], ['k1-ergebnis', 'Ein Satz zur Tabelle']] },
  { id: 'g2', n: '2', kurz: 'Aufgabe 2', titel: 'Wahlabsicht: drei Prozentzahlen', minuten: 12, Inhalt: Verstehen2, aufgabe: 2,
    karten: [['k2-gruende', 'Warum eine Antwort fehlt'], ['k2-basis', 'Prozent wovon?'], ['k2-eigen', 'Eine eigene Basis rechnen'], ['k2-satz', 'Ein ehrlicher Satz']] },
  { id: 'g3', n: '3', kurz: 'Aufgabe 3', titel: 'Wie lange dauert Arbeitslosigkeit?', minuten: 15, Inhalt: Verstehen3, aufgabe: 3,
    karten: [['k3-reihe', 'Die Mitte einer Reihe'], ['k3-describe', 'Kennzahlen mit describe()'], ['k3-wer', 'Wer fehlt?'], ['k3-schief', 'Mittelwert und Median vergleichen'], ['k3-skala', 'Welche Mitte passt?'], ['k3-ergebnis', 'Ergebnis festhalten']] },
  { id: 'g4', n: '4', kurz: 'Aufgabe 4', titel: 'Wie viele liegen über dem Durchschnitt?', minuten: 5, Inhalt: Verstehen4, aufgabe: 4,
    karten: [['k4-cum', 'Cum. % und der Mittelwert'], ['k4-zeile', 'Die letzte Zeile unter dem Mittelwert']] },
  { id: 'g5', n: '✓', kurz: 'Überblick', titel: 'Eine Tabelle lesen, eine Mitte wählen', minuten: 5, Inhalt: Ueberblick,
    karten: [['k5-tabelle', 'Vier Fragen an eine Tabelle'], ['k5-mitte', 'Welche Mitte passt?'], ['k5-voraus', 'Voraussetzungen']] },
];

/* Bilder für die ausgebauten „?“-Fenster in den Aufgaben (Engine: denk(…, { bild: Name })). Nur Bilder, die schon in Verstehen stehen. */
export const BILDER = { TowerToTable, FrequencyTable, BuecherStreifen, RegaleErklaert, HundredStones, ThreeBases, DescribeOutput, HaushaltsReihe, ScaleLevels, HaushaltsStreifen };
