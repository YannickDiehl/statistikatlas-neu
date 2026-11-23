// Sitzung 3 „Erste Auszählung“: die vier Grundlagen und der Überblick aus dem Plan sitzung03.md (§4 bis §9), ohne R-Code.
import { Badge, Card, InShort, Known, Mixup, MoreDetail, Tag } from '../blocks/Card';
import { Foundation } from '../blocks/Foundation';
import { MapLink as SharedMapLink } from '../blocks/MapLink';
import { ChoiceCheck, NumberCheck } from './checks';
import { K1B_Q, K1C_Q, K2B_AFTER, K2B_Q, K3A_Q, K3C_Q, K4_Q } from './content';
import { FrequencyTable, PercentFormula } from './figures/FrequencyTable';
import { HouseholdRow, MeanFormula } from './figures/HouseholdRow';
import { DescribeOutput, MiddleCheck, MiddleTree, ScaleLevels } from './figures/Middles';
import { Shelves } from './figures/Shelves';
import { HundredStones, ThreeBases } from './figures/Stones';
import { BookStrip, HouseholdStrip } from './figures/Strip';
import { TowerToTable } from './figures/TowerToTable';

/** Gray badge for what students know from Methoden Ia (shared `Known` with a free label). */
const KnownIa = ({ what }: { what: string }) => <Known label="kennst du aus Methoden Ia" what={what} />;

/** „→ In der freien Karte: …“: opens the term in the free map (shared MapLink). */
const MapLink = ({ term, label }: { term: string; label: string }) =>
  <SharedMapLink concept={term} className="s3-karte-link">{label}</SharedMapLink>;

/** Grundlage 1: Die Häufigkeitstabelle (1a Turm zur Tabelle, 1b Spalten von frequency(), 1c Modus und Median). */
export function Foundation1() {
  return <Foundation id="g1" n={1} title="Die Häufigkeitstabelle" taskHref="#a1"
    intro={<>Wie liest man eine Tabelle von <code>frequency()</code>, und wo stehen Modus und Median? Drei kurze Schritte, etwa 15 Minuten.</>}>

    <Card id="k1a" step="1a" title="Vom Turm zur Tabelle: Steine zählen"
      badge={<><Known session={2} what="Turm, Stein, Aufkleber" /><Known session={1} what="Spalte N" /></>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">In Sitzung 1 hast du in der Spalte N abgelesen, wie viele eine Antwort gegeben haben. Woher kommt diese Zahl? Der ALLBUS fragt, wie oft man in der Freizeit Bücher liest, mit fünf Antworten von „täglich“ bis „nie“. Hier siehst du den Turm la01 von zwölf Befragten, zum Beispiel. Jeder Stein ist eine Antwort, der Aufkleber sagt, was der Code bedeutet. Eine Person hat nichts angegeben: Ihr Stein ist leer, trägt aber einen Aufkleber mit dem Grund, KEINE ANGABE. Geh die drei Schritte durch.</p>
      <TowerToTable />
      <InShort>Eine Häufigkeitstabelle zählt, wie oft jeder Wert vorkommt. Diese Zahl heißt <b>absolute Häufigkeit</b>, in R die Spalte <b>N</b>. Gleiche Steine kommen auf einen Stapel, und N ist die Höhe des Stapels. Steine mit einem Missing-Code zählt die Tabelle getrennt: unter „Total missing“.</InShort>
      <MoreDetail summary="Warum der leere Stein einen Aufkleber hat">
        <p>Im ALLBUS fehlt keine Antwort einfach so. Jede Lücke hat einen Code mit Grund, etwa −9 KEINE ANGABE oder −11 TNZ: SPLIT. <code>read_spss()</code> macht daraus in R einen fehlenden Wert (NA), behält den Grund aber als Aufkleber. Darum kann <code>frequency()</code> dir unten in der Tabelle zeigen, warum wie viele Antworten fehlen. Mehr dazu in <a href="#g2">Grundlage 2</a>.</p>
      </MoreDetail>
      <Mixup>Die Spalte <b>Value</b> ist der Code, nicht die Anzahl. „4“ in der Spalte Value heißt SELTENER; wie viele das gesagt haben, steht in der Spalte N.</Mixup>
    </Card>

    <Card id="k1b" step="1b" title={<>Die Spalten von <code>frequency()</code></>}
      badge={<><Known session={1} what="Value, Label, N" /><Badge>Prozentspalten: neu heute</Badge></>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">So sieht die echte Tabelle für alle 5.246 Befragten aus. Wähl eine Spalte und schau, was sie zählt.</p>
      <FrequencyTable />
      <p className="absatz"><b>Formel lesen lernen:</b> So entsteht jede Prozentzahl der Tabelle.</p>
      <PercentFormula />
      <NumberCheck question={K1B_Q} />
      <InShort>Die Häufigkeitstabelle zeigt für jeden Wert die <b>absolute Häufigkeit</b> (N, wie viele) und die <b>relative Häufigkeit</b> (Prozent, welcher Anteil). Raw % rechnet mit allen Befragten, Valid % nur mit denen, die gültig geantwortet haben. <b>Kumulierte Prozent</b> (Cum. %) zählen die Valid % von oben nach unten zusammen: „bis einschließlich dieser Zeile“.</InShort>
      <MoreDetail summary="Die Kopfzeile und die Summenzeilen">
        <ul>
          <li>Die Kopfzeile <code># total N=5246 valid N=5223</code> nennt dieselben Zahlen wie Total und Total valid. Dahinter rechnet R Mittelwert (mean), Standardabweichung (sd) und Schiefe (skewness) mit den Codes aus, ob das sinnvoll ist oder nicht. Wann es sinnvoll ist, klärt <a href="#g3">Grundlage 3</a>.</li>
          <li>Raw % ergibt über alle Zeilen 100, Valid % nur über die gültigen. Darum steht bei den fehlenden Werten keine Valid-%-Zahl.</li>
          <li>Cum. % ergibt nur Sinn, wenn die Codes eine Reihenfolge haben, wie hier von „täglich“ bis „nie“. Bei Parteien oder Konfessionen hängt die Summe davon ab, in welcher Reihenfolge die Codes zufällig stehen.</li>
          <li>Die Prozentzahlen sind auf zwei Stellen gerundet. Zählst du gerundete Zahlen zusammen, kann am Ende 99,99 oder 100,01 herauskommen.</li>
          <li>Die Zahlen sind ungewichtet.</li>
        </ul>
      </MoreDetail>
      <Mixup>Cum. % ist nicht der Anteil einer einzelnen Antwort. 52,04 in der Zeile MIND. 1X PRO MONAT heißt: 52,04 % lesen mindestens einmal im Monat (täglich, wöchentlich oder monatlich), nicht: 52,04 % lesen genau einmal im Monat. Das sind 13,48 %.</Mixup>
      <MapLink term="frequency" label="Häufigkeiten" />
    </Card>

    <Card id="k1c" step="1c" title="Modus und Median aus der Tabelle" badge={<KnownIa what="Modus und Median" />} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Welche Antwort ist am häufigsten, und was antwortet die Person in der Mitte? Stell dir vor, alle 5.223 gültigen Antworten liegen der Reihe nach in einer langen Reihe, von „täglich“ bis „nie“. Das Bild zeigt diese Reihe auf 100 % gestaucht.</p>
      <BookStrip />
      <ChoiceCheck question={K1C_Q} />
      <InShort>Der <b>Modus</b> ist der häufigste Wert: die Zeile mit dem größten N. Der <b>Median</b> ist der Wert der Person in der Mitte, wenn alle gültigen Antworten der Reihe nach stehen. In der Tabelle ist das die erste Zeile, in der Cum. % die 50 erreicht.</InShort>
      <MoreDetail summary="Warum der Median eine Reihenfolge braucht">
        <ul>
          <li>Der Median setzt voraus, dass die Antworten eine Reihenfolge haben (ordinal oder metrisch). „Täglich“ liest mehr als „pro Woche“, das ergibt eine Reihe. Bei Parteien gibt es keine Reihe und damit keine Mitte, nur einen Modus.</li>
          <li>Bei la01 liegt der Median bei „mindestens einmal pro Monat“, der Modus bei „seltener“. Beides stimmt: Die größte Gruppe liest selten, aber gut die Hälfte (52,04 %) liest mindestens einmal im Monat.</li>
          <li>Trifft Cum. % genau die 50, liegt die Mitte zwischen dieser und der nächsten Stufe. Bei Tausenden Befragten kommt das kaum vor.</li>
          <li>Die Kopfzeile nennt mean=3.08. Bei Häufigkeitsstufen wie „täglich“ bis „nie“ sind die Abstände nicht gleich groß; ein Mittelwert von 3,08 lässt sich deshalb nur mit Vorsicht deuten. Mehr in <a href="#g3">Grundlage 3</a>.</li>
        </ul>
      </MoreDetail>
      <Mixup>Modus und Median verwechseln. Der höchste Stapel muss nicht in der Mitte stehen: Hier ist „seltener“ am häufigsten, die Mitte liegt bei „mindestens einmal pro Monat“.</Mixup>
      <MapLink term="median" label="Median" />
    </Card>
  </Foundation>;
}

/** Grundlage 2: Fehlende Werte: Wer zählt mit? (2a Gründe, 2b Prozent wovon?). */
export function Foundation2() {
  return <Foundation id="g2" n={2} title="Fehlende Werte: Wer zählt mit?" taskHref="#a2"
    intro="Warum fehlen Antworten, und wovon ist eine Prozentzahl ein Anteil? Zwei Schritte, etwa 12 Minuten.">

    <Card id="k2a" step="2a" title="Warum eine Antwort fehlt" badge={<Known session={2} what="Gründe für fehlende Werte" />} tag={{ kind: 'estimate', label: 'Zuordnen' }}>
      <p className="lead">Aus Sitzung 2 weißt du: Im ALLBUS steht hinter jeder Lücke ein negativer Code mit einem Grund. Zur Erinnerung eine kurze Übung mit den sieben Codes, die dir in diesem Kapitel begegnen. Fünf kennst du schon, −7 VERWEIGERT und −41 DATENFEHLER sind neu, aber ihre Namen verraten viel. Sortier sie: Wo entsteht die Lücke? Das brauchst du gleich, um zu entscheiden, wen du beim Prozentrechnen mitzählst.</p>
      <Shelves />
      <p className="absatz">Dazu kommen Codes, die zu einer bestimmten Frage gehören, etwa −6 KENNE ICH NICHT (Sitzung 1 und 2). −50 heißt bei der Wahlabsicht NICHT WAHLBERECHTIGT, bei der Schichteinstufung KEINER DER SCHICHTEN (15 Befragte). −32 NICHT GENERIERBAR steht bei Variablen, die der ALLBUS aus anderen Angaben berechnet, etwa die Zahl der Personen im Haushalt (102 Befragte). Was ein Code bei einer Variable heißt, steht im Codebuch und unten in der Tabelle von <code>frequency()</code>.</p>
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
      <MapLink term="missing" label="Fehlende Werte" />
    </Card>

    <Card id="k2b" step="2b" title="Prozent wovon?" badge={<Tag kind="estimate" label="Kurz überlegen" />} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">„Kann man den meisten Menschen vertrauen, oder muss man im Umgang mit anderen vorsichtig sein?“ Antworten: man kann trauen, man muss vorsichtig sein, kommt darauf an. Diese Frage (st01) kennst du vom Bogen in Sitzung 2. Wie viele sagen „kommt darauf an“? Das hängt davon ab, wen du mitzählst.</p>
      <HundredStones />
      <p className="absatz">Niemand hat seine Antwort geändert. Nur die Basis ist eine andere: einmal alle Befragten, einmal nur die, die gültig geantwortet haben. Die Tabelle von <code>frequency(st01)</code> zeigt beides nebeneinander: Raw % 27.89 und Valid % 41.10.</p>
      <ChoiceCheck question={K2B_Q} after={K2B_AFTER} />
      <InShort>Jede Prozentzahl hat eine <b>Prozentbasis</b>: die Gruppe, durch die geteilt wird. Raw % teilt durch alle Befragten, Valid % nur durch die gültigen Antworten. Wenn du eine Prozentzahl nennst, sag dazu, wovon.</InShort>
      <MoreDetail summary="Eine eigene Basis rechnen">
        <ThreeBases />
        <p>Manchmal passt keine der beiden Spalten. Soll „weiß nicht“ mitzählen, weil es eine Aussage ist, rechnest du selbst: <code>1463 / (3560 + 5) * 100</code>. Die Klammer sorgt dafür, dass R erst die Basis zusammenzählt und dann teilt.</p>
        <p>Bei st01 macht das kaum etwas aus, weil nur 5 Befragte „weiß nicht“ sagen. In <a href="#a2">Aufgabe 2</a> ist das anders.</p>
      </MoreDetail>
      <Mixup>Valid % heißt nicht „Prozent aller Befragten“. Valid % gilt nur für die, die gültig geantwortet haben. Wer fehlt, zählt dort nicht mit.</Mixup>
    </Card>
  </Foundation>;
}

/** Grundlage 3: Die Mitte (3a Reihe, 3b Skalenniveau, 3c describe()). */
export function Foundation3() {
  return <Foundation id="g3" n={3} title="Die Mitte: Modus, Median, Mittelwert" taskHref="#a3"
    intro="Welche Zahl beschreibt die Mitte, und welche passt zu welcher Variable? Drei Schritte, etwa 12 Minuten.">

    <Card id="k3a" step="3a" title="Die Mitte einer Reihe" badge={<KnownIa what="Mittelwert und Median" />} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Neun Befragte sagen, wie viele Personen in ihrem Haushalt leben, zum Beispiel. Geh die Schritte durch.</p>
      <HouseholdRow />
      <ChoiceCheck question={K3A_Q} />
      <InShort>Der <b>Mittelwert</b> (arithmetisches Mittel) ist die Summe aller Werte geteilt durch ihre Anzahl, der Schwerpunkt der Reihe. Der <b>Median</b> ist der Wert in der Mitte der sortierten Reihe. Ein einzelner Wert weit draußen zieht den Mittelwert mit, den Median kaum.</InShort>
      <MoreDetail summary="Formel lesen lernen: der Mittelwert">
        <MeanFormula />
        <p>Von innen nach außen gelesen: Erst zählst du alle Werte zusammen (Σx). Dann teilst du durch ihre Anzahl (n). Weil jeder Wert in die Summe eingeht, verschiebt ein einziger großer Wert das Ergebnis.</p>
        <p>Beim Median gibt es keine Rechnung mit allen Werten: Du sortierst und nimmst den mittleren. Bei einer geraden Anzahl liegt die Mitte zwischen zwei Werten; dann ist der Median der Wert genau dazwischen.</p>
        <p>Der <b>Modus</b>, der häufigste Wert, ist hier ebenfalls 2: Vier der neun Befragten leben zu zweit.</p>
      </MoreDetail>
      <Mixup>„Durchschnitt“ und „Mitte“ sind nicht dasselbe. Im Alltag sagt man „im Durchschnitt“ und meint oft „das Übliche“. Statistisch ist der Durchschnitt der Mittelwert, und der kann weit von der mittleren Person entfernt liegen.</Mixup>
    </Card>

    <Card id="k3b" step="3b" title="Welche Mitte passt zu welcher Variable?"
      badge={<><Known session={2} what="Codes sind Namen" /><Badge>Skalenniveau: neu heute</Badge></>} tag={{ kind: 'estimate', label: 'Zuordnen' }}>
      <p className="lead">In Sitzung 2 hast du gesehen: Der Mittelwert der Partei-Codes, 16,1, sagt nichts über die Wahlabsicht. Genau diese Zahl steht in der Kopfzeile von <code>frequency(pv01)</code>: <code>frequency()</code> rechnet dort immer einen Mittelwert aus, auch wo er nichts bedeutet. Bei der Konfession (rd01) steht mean=4.06. Die Codes sind dort 1 evangelisch (ohne Freikirchen), 3 römisch-katholisch, 6 keiner Religionsgemeinschaft und so weiter. Was wäre eine Konfession „4,06“? Ob eine Mitte sinnvoll ist, hängt vom Skalenniveau ab.</p>
      <ScaleLevels />
      <MiddleCheck />
      <InShort>Das <b>Skalenniveau</b> sagt, was die Codes einer Variable bedeuten. <b>Nominal</b>: nur Namen, dann gibt es nur den Modus. <b>Ordinal</b>: eine Reihenfolge, dazu der Median. <b>Metrisch</b>: gleiche Abstände, erst dann ist der Mittelwert sicher sinnvoll.</InShort>
      <MoreDetail summary="Nominal und der Median">
        <p>Auch bei der Konfession kannst du in <code>frequency(rd01)</code> die Spalte Cum. % lesen. Sie erreicht die 50 erst beim Code 5, „andere nicht-christliche Religion“ (Cum. % 49,31 bei Code 4, 52,32 bei Code 5). Ein „Median“ wäre das trotzdem nicht: Er hängt nur davon ab, in welcher Reihenfolge die Codes zufällig vergeben wurden. Stünde „keiner Religionsgemeinschaft“ vorn, käme etwas anderes heraus.</p>
      </MoreDetail>
      <MoreDetail summary="Ordinal und der Mittelwert">
        <p>In der Forschung werden Skalen wie „1 sehr gut bis 5 schlecht“ oft wie metrisch behandelt und gemittelt. Das ist eine Annahme: dass der Schritt von „gut“ zu „sehr gut“ genauso groß ist wie der von „schlecht“ zu „weniger gut“. Wer einen Mittelwert einer ordinalen Variable berichtet, sollte Median und Häufigkeiten danebenstellen.</p>
      </MoreDetail>
      <Mixup>Eine Zahl im Datensatz macht eine Variable nicht metrisch. Auch Parteien und Konfessionen sind im ALLBUS als Zahlen gespeichert. R rechnet mit ihnen, ob es Sinn ergibt oder nicht. Ob es Sinn ergibt, entscheidest du.</Mixup>
      <MapLink term="mean" label="Arithmetisches Mittel" />
    </Card>

    <Card id="k3c" step="3c" title={<>Kennzahlen mit <code>describe()</code></>} badge={<Badge>describe(): neu heute</Badge>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">So fasst <code>describe()</code> die Zahl der Personen im Haushalt für alle Befragten zusammen.</p>
      <DescribeOutput />
      <p className="absatz">So liest du die Zeile:</p>
      <ul className="s3-liste">
        <li><b>Mean</b> ist der Mittelwert: 2.342, also 2,34 Personen.</li>
        <li><b>Median</b>: 2.000, also 2 Personen. Die Person in der Mitte der Reihe lebt zu zweit; allein oder zu zweit leben mindestens die Hälfte der Befragten.</li>
        <li><b>N</b>: 5144 Befragte mit gültiger Angabe gehen in die Rechnung ein.</li>
        <li><b>Missing</b>: 102 ohne gültige Angabe, hier alle mit −32 NICHT GENERIERBAR. <code>describe()</code> zählt alle Gründe zusammen; welche es sind, zeigt <code>frequency()</code>.</li>
        <li><b>SD</b> ist die Standardabweichung, der typische Abstand zum Mittelwert (kennst du aus Methoden Ia). <b>Range</b>, <b>IQR</b> und <b>Skewness</b> liest du in Sitzung 4.</li>
      </ul>
      <ChoiceCheck question={K3C_Q} />
      <InShort><code>describe()</code> fasst eine Variable in Kennzahlen zusammen. Für die Mitte schaust du auf <b>Mean</b> (Mittelwert) und <b>Median</b>, für die Basis auf <b>N</b> (wie viele gültige Werte eingehen) und <b>Missing</b> (wie viele fehlen).</InShort>
      <Mixup>N in <code>describe()</code> ist nicht die Zahl aller Befragten, sondern die Zahl der gültigen Werte. Alle Befragten sind N plus Missing: 5.144 + 102 = 5.246.</Mixup>
      <MapLink term="describe" label="Deskriptiver Überblick" />
    </Card>
  </Foundation>;
}

/** Grundlage 4 (Zusatz): Liegt der Durchschnitt in der Mitte? */
export function Foundation4() {
  return <Foundation id="g4" n={4} title="Liegt der Durchschnitt in der Mitte?" taskHref="#a4"
    intro="Wie viele liegen über dem Mittelwert, und was verrät das? Etwa 5 Minuten.">
    <Card id="k4" step="4" title="Cum. % und der Mittelwert" badge={<Badge>Cum. %: Grundlage 1</Badge>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Im Mittel leben 2,34 Personen im Haushalt der Befragten (<a href="#k3c">Grundlage 3c</a>). Wie viele leben in einem größeren Haushalt als dem Durchschnitt? Die Spalte Cum. % von <code>frequency(dh04)</code> verrät es.</p>
      <HouseholdStrip />
      <NumberCheck question={K4_Q} />
      <InShort>Cum. % sagt, wie viel Prozent höchstens bis zu einem Wert kommen. <b>100 minus Cum. %</b> sind die, die darüber liegen. Über dem Median liegt höchstens die Hälfte, bei Variablen mit vielen verschiedenen Werten fast genau die Hälfte. Über dem Mittelwert können es bei einer schiefen Verteilung viel weniger oder viel mehr sein.</InShort>
      <MoreDetail summary="Schiefe Verteilungen">
        <p>Rechtsschiefe Verteilungen haben einen langen Auslauf zu großen Werten (Fachbegriff: Schiefe, mehr in Sitzung 4). Dann liegt der Mittelwert meist über dem Median, und meist liegt deutlich weniger als die Hälfte über dem Mittelwert. Bei wenigen Stufen wie hier kann auch über dem Median weniger als die Hälfte liegen: 44,46 % leben genau zu zweit, also genau auf dem Median, und über ihm liegen nur 32,58 %. Bei einem langen Auslauf zu kleinen Werten ist es umgekehrt. Wie viele über dem Mittelwert liegen, ist darum ein schneller Test, ob „Durchschnitt“ und „Mitte“ zusammenpassen.</p>
      </MoreDetail>
      <Mixup>„Durchschnitt“ heißt nicht, dass die Hälfte darüber liegt. Für den Median gilt: Über ihm liegt höchstens die Hälfte, unter ihm ebenso.</Mixup>
    </Card>
  </Foundation>;
}

/** Überblick: Eine Tabelle lesen, eine Mitte wählen (Ü1 vier Fragen, Ü2 Entscheidungsbaum, Ü3 Voraussetzungen). */
export function Overview() {
  return <Foundation id="g5" n="✓" title="Eine Tabelle lesen, eine Mitte wählen" eyebrow="Überblick zu allen Aufgaben"
    intro="Alle vier Themen zusammen: welche Zahl wofür steht und welche Mitte wann passt.">

    <Card id="u1" step="Ü1" title="Vier Fragen an eine Häufigkeitstabelle">
      <div className="s3-tabelle">
        <table className="daten voll">
          <caption className="sr-only">Vier Fragen an eine Häufigkeitstabelle</caption>
          <thead><tr><th scope="col">Frage</th><th scope="col">Wo in der Ausgabe</th><th scope="col">So schreibst du es</th></tr></thead>
          <tbody>
            <tr><td>Wie viele?</td><td>Spalte N</td><td>„2.067 Befragte erwarten eine etwas schlechtere Lage.“</td></tr>
            <tr><td>Welcher Anteil derer, die geantwortet haben?</td><td>Valid % (Basis: Total valid)</td><td>„39,8 % der Befragten mit gültiger Antwort erwarten eine etwas schlechtere Lage.“</td></tr>
            <tr><td>Welcher Anteil aller Befragten?</td><td>Raw % (Basis: Total)</td><td>„39,4 % aller Befragten, auch derer ohne gültige Antwort, erwarten eine etwas schlechtere Lage.“</td></tr>
            <tr><td>Wie viele bis zu einer Stufe?</td><td>Cum. %</td><td>„16,3 % der Befragten mit gültiger Antwort erwarten eine bessere Lage.“</td></tr>
          </tbody>
        </table>
      </div>
      <p className="absatz">Die Beispiele stammen aus <a href="#a1">Aufgabe 1</a> (ep04). Und immer dazu: wie viele fehlen (Total missing) und warum (Codes unten in der Tabelle). Alle Zahlen hier sind ungewichtet.</p>
    </Card>

    <Card id="u2" step="Ü2" title="Welche Mitte passt?">
      <MiddleTree />
      <InShort>Erst prüfen, wer mitzählt; dann die Mitte nach dem Skalenniveau wählen. Eine Prozentzahl ohne Basis und ein Mittelwert ohne Median können in die Irre führen.</InShort>
    </Card>

    <Card id="u3" step="Ü3" title="Voraussetzungen">
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
  </Foundation>;
}
