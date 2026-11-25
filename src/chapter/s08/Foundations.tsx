// Sitzung 8 „Index und Skala“: die vier Grundlagen und der Überblick (Plan Abschnitte 4 bis 7 und 9), ohne R-Code.
import { Badge, Card, InShort, Known, Mixup, MoreDetail } from '../blocks/Card';
import { MapLink } from '../blocks/MapLink';
import { Foundation } from '../blocks/Foundation';
import { QuickCheck } from './Checks';
import { CHECKS, INGLE_GOALS } from './content';
import { IndexBars, IndexFormula, MeasurementError, RowMean } from './figures/Theme1';
import { AlphaCalculator, AlphaFormula, AlphaRules, CorrelationTable, ReliabilityOutput } from './figures/Theme2';
import { Reverse, ReverseLab } from './figures/Theme3';
import { Balance, Flow, Inglehart, WhichIndex } from './figures/Theme4';

/** Grundlage 1: Mehrere Fragen, ein Wert (1a Warum mehrere Fragen?, 1b Eine Reihe, ein Wert, 1c Der Index im ALLBUS). */
export function Foundation1() {
  return <Foundation id="g1" n={1} title="Mehrere Fragen, ein Wert" taskHref="#a1"
    intro="Warum fragt man dasselbe mehrmals, und wie wird daraus eine Zahl je Person? Drei kurze Schritte, etwa 12 Minuten.">

    <Card id="v1a" step="1a" title="Warum mehrere Fragen?" badge={<><Badge>Messfehler: Wiederholung aus der Vorlesung</Badge><Known session={1} what="mp16 bis mp19" /></>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Wie sehen die Menschen in Deutschland Geflüchtete: eher als Chance oder eher als Risiko? Die vier Fragen dazu hast du in Sitzung 1 mit <code>find_var()</code> gefunden. Eine einzige Frage reicht dafür nicht. Jemand denkt vielleicht beim Sozialstaat an Risiken, bei der Wirtschaft an Chancen. Der ALLBUS 2023 fragt deshalb viermal: Bringen Geflüchtete für den Sozialstaat, für die Sicherheit, für das Zusammenleben und für die Wirtschaft eher Chancen oder eher Risiken? Antworten von 1 „Risiko überwiegt“ bis 5 „Chance überwiegt“.</p>
      <p className="absatz">Die vier Fragen bekommen verschiedene Antworten. „Risiko“ (1 oder 2) sagen beim Sozialstaat 64,9 %, bei der Sicherheit 69,2 %, beim Zusammenleben 49,4 % und bei der Wirtschaft nur 38,7 % (gewichtet). Jede Frage trifft einen anderen Ausschnitt desselben Themas.</p>
      <MeasurementError />
      <QuickCheck question={CHECKS.g1a} />
      <InShort>Einstellungen wie „Haltung zu Geflüchteten“ oder „Populismus“ kann man nicht direkt beobachten. Man fragt deshalb mehrere <b>Items</b> (einzelne Fragen oder Aussagen) und fasst sie zu einem <b>Index</b> zusammen. Jedes Item hat einen eigenen <b>Messfehler</b>; im Mittelwert mehrerer Items gleichen sich zufällige Fehler teilweise aus.</InShort>
      <MoreDetail summary="Index, Skala, Item">
        <ul>
          <li>Ein <b>Item</b> ist eine einzelne Frage mit ihren Antworten, etwa mp16. Eine <b>Itembatterie</b> sind mehrere Items, die nacheinander mit denselben Antworten gestellt werden.</li>
          <li>Ein <b>Index</b> fasst mehrere Items nach einer Regel zu einer neuen Variable zusammen. Die häufigste Regel ist der Mittelwert: der <b>Mittelwertindex</b>. Sind die Items vorher auf Stimmigkeit geprüft, spricht man oft von einer <b>Skala</b>. Im Alltag werden beide Wörter fast gleich gebraucht.</li>
          <li>Der gemeinsame Begriff hinter den Items heißt <b>Konstrukt</b> oder latente Variable: etwas, das wir nicht sehen, aber an mehreren Antworten ablesen wollen.</li>
          <li>Mehrere Items helfen gegen zufällige Fehler. Gegen einen gemeinsamen Fehler helfen sie nicht: Wenn alle vier Fragen etwas anderes messen als gedacht, misst auch ihr Mittelwert das Falsche. Das ist eine Frage der <b>Validität</b> (Gültigkeit), nicht der Genauigkeit.</li>
        </ul>
      </MoreDetail>
      <Mixup>Ein Index ist kein Mittelwert über alle Befragten. Er ist ein Wert <b>je Person</b>, also eine neue Variable. Den Mittelwert über alle Befragten rechnest du danach, wie bei jeder Variable, mit <code>describe()</code>.</Mixup>
    </Card>

    <Card id="v1b" step="1b" title="Eine Reihe, ein Wert" badge={<Known session={2} what="Datenmatrix, Variable, Fall" />} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Auf der Bauplatte ist jede Variable ein Turm und jede Person eine Reihe. Für einen Index schaust du nicht in einen Turm, sondern quer durch eine Reihe: Welche vier Antworten hat diese Person gegeben? Hier drei Befragte, zum Beispiel. Person B hat eine Frage nicht beantwortet. Geh die Schritte durch.</p>
      <RowMean />
      <p className="absatz"><b>Formel lesen lernen:</b> So steht der Mittelwertindex als Formel.</p>
      <IndexFormula />
      <QuickCheck question={CHECKS.g1b} />
      <InShort>Ein <b>Mittelwertindex</b> ist der Mittelwert der gültigen Antworten einer Person: ein neuer Turm mit einem Wert je Reihe. <b><code>min_valid</code></b> legt fest, wie viele gültige Antworten jemand mindestens braucht, um einen Wert zu bekommen. Ohne <code>min_valid</code> reicht eine einzige Antwort.</InShort>
      <MoreDetail summary="Wie streng soll min_valid sein?">
        <ul>
          <li>Mit <code>min_valid</code> gleich der Zahl der Items bekommt nur einen Wert, wer alle Fragen beantwortet hat. Das ist streng, aber jeder Wert beruht auf denselben Fragen.</li>
          <li>Eine verbreitete Faustregel: mindestens zwei Drittel der Items oder mehr als die Hälfte. Bei vier Items also 3, bei sieben Items 5. Wichtig ist, dass du die Regel nennst.</li>
          <li>Bei den Fragen zu Geflüchteten haben 3.424 Befragte alle vier beantwortet, 58 drei, 15 zwei und 7 nur eine. Mit <code>min_valid = 4</code> bekommen 3.424 einen Wert, mit <code>min_valid = 3</code> sind es 3.482, ganz ohne <code>min_valid</code> 3.504.</li>
          <li>Warum der Mittelwert und nicht die Summe? Die Summe hängt davon ab, wie viele Fragen jemand beantwortet hat: Wer nur eine Frage beantwortet, hat eine kleine Summe und sähe aus wie jemand mit viel „Risiko“. Ohne <code>min_valid</code> reicht die Summe der vier Fragen im ALLBUS von 2 bis 20, obwohl mit allen vier Antworten nur 4 bis 20 möglich sind. Der Mittelwert bleibt auf der Antwortskala von 1 bis 5 und lässt sich wie eine Antwort lesen. Eine Summe (<code>row_sums()</code>) nimmst du, wenn du etwas zählen willst (Thema 4).</li>
        </ul>
      </MoreDetail>
      <Mixup>Eine fehlende Antwort ist keine 0. <code>row_means()</code> lässt sie weg und teilt durch die Zahl der gültigen Antworten. Würde sie als 0 zählen, sähe Person B noch viel mehr nach „Risiko“ aus, nur weil sie eine Frage übersprungen hat.</Mixup>
    </Card>

    <Card id="v1c" step="1c" title="Der Index im ALLBUS" badge={<Known session={6} what="Gewichtet" />} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">So verteilt sich der Index über alle Befragten, die alle vier Fragen beantwortet haben (gewichtet). Weil ein Mittelwert aus vier Antworten auch Zwischenwerte hat, gibt es 17 mögliche Werte: 1; 1,25; 1,5 … 5.</p>
      <IndexBars />
      <QuickCheck question={CHECKS.g1c} />
      <InShort>Den Index liest du wie die Antwortskala: Hier heißt ein niedriger Wert „eher Risiko“, ein hoher „eher Chance“. Wie bei jeder Variable gehören Verteilung, Mittelwert, Median und n in den Bericht, und dazu die Regel, wer einen Wert bekommt.</InShort>
      <MoreDetail summary="Was ein Indexwert von 2,5 heißt">
        <ul>
          <li>2,5 liegt zwischen „eher Risiko“ (2) und „weder noch“ (3). Es kann heißen: viermal ungefähr 2 oder 3, oder zweimal 1 und zweimal 4. Der Index zeigt die Gesamttendenz, nicht das Muster dahinter (mehr dazu in Thema 4).</li>
          <li>Die Zahlen sind gewichtet, weil sie etwas über alle Menschen in Deutschland sagen. Wie viele Personen einen Wert haben (3.424 mit allen vier Antworten), zählst du ohne Gewicht.</li>
        </ul>
      </MoreDetail>
      <Mixup>Die Richtung eines Index ergibt sich aus den Items, nicht aus dem Wort „Index“. Bei diesen Fragen ist 1 „Risiko“; ein niedriger Wert heißt also nicht „wenig Haltung“, sondern „eher Risiko“. Schau immer nach, wofür die 1 steht.</Mixup>
      <MapLink concept="row_operations" className="absatz s8-karte">Mittelwertindex</MapLink>
      <MapLink concept="item_score" className="absatz s8-karte">Skalenwert pro Person</MapLink>
    </Card>
  </Foundation>;
}

/** Grundlage 2: Passen die Fragen zusammen? (2a Stimmig, 2b Formel für α, 2c Die Ausgabe von reliability()). */
export function Foundation2() {
  return <Foundation id="g2" n={2} title="Passen die Fragen zusammen?" taskHref="#a2"
    intro="Wann darf man Fragen zu einem Index zusammenfassen, und was misst Cronbachs α? Drei Schritte, etwa 15 Minuten.">

    <Card id="v2a" step="2a" title="Stimmig heißt: dieselben Menschen antworten ähnlich" badge={<><Known session={6} what="Korrelation r" /><Known session={7} what="Korrelationsmatrix" /></>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Wie verbunden fühlen sich die Menschen mit ihrer Gemeinde, ihrem Bundesland, Deutschland und der EU? Antworten von 1 „stark verbunden“ bis 4 „gar nicht verbunden“. Stark oder ziemlich verbunden fühlen sich mit der Gemeinde 65,7 %, mit dem Bundesland 63,3 %, mit Deutschland 70,9 % und mit der EU 49,5 % (gewichtet). Darf man daraus einen Index „Verbundenheit“ machen? Das hängt davon ab, ob dieselben Menschen bei allen vier ähnlich antworten.</p>
      <CorrelationTable />
      <QuickCheck question={CHECKS.g2a} />
      <InShort>Items passen zusammen, wenn dieselben Menschen bei ihnen ähnlich antworten, wenn sie also positiv miteinander <b>korrelieren</b>. Je höher die Korrelationen, desto stimmiger misst der Index einen gemeinsamen Begriff. Diese Stimmigkeit heißt <b>Reliabilität</b> (Zuverlässigkeit); genauer: <b>interne Konsistenz</b>.</InShort>
      <MoreDetail summary="Reliabilität und Validität">
        <ul>
          <li><b>Reliabilität</b> fragt: Misst das Instrument zuverlässig, also mit wenig Zufall? Bei einem Index heißt das: Zeigen die Items in dieselbe Richtung und hängen sie eng zusammen?</li>
          <li><b>Validität</b> fragt: Misst das Instrument das, was es messen soll? Vier Fragen zur Lieblingsfarbe könnten sehr stimmig sein und trotzdem keine Verbundenheit messen.</li>
          <li>Reliabilität ist eine Voraussetzung für Validität, aber kein Beweis dafür. Ob die Items den Begriff treffen, entscheidest du am Inhalt.</li>
        </ul>
      </MoreDetail>
      <Mixup>Stimmig heißt nicht, dass alle gleich antworten. Die Antworten dürfen über die Befragten weit streuen. Stimmig heißt: Wer bei einem Item hoch liegt, liegt auch bei den anderen eher hoch.</Mixup>
    </Card>

    <Card id="v2b" step="2b" title="Formel lesen lernen: Cronbachs α" tag={{ kind: 'picture', label: 'Im Bild, Ausprobieren' }}>
      <p className="lead">Cronbachs α fasst die Korrelationen aller Items in einer Zahl zusammen. In einer einfachen Form hängt α nur von zwei Dingen ab: wie viele Items es sind und wie eng sie im Mittel zusammenhängen.</p>
      <AlphaFormula />
      <h6 className="zwischen">α-Rechner</h6>
      <p className="unter-zwischen">Verändere k und r̄ und beobachte, wie sich α verändert.</p>
      <AlphaCalculator />
      <QuickCheck question={CHECKS.g2b} />
      <InShort><b>Cronbachs α</b> liegt meist zwischen 0 und 1. Es steigt, wenn die Items enger zusammenhängen, <b>und</b> wenn es mehr Items sind. Ein hohes α heißt also nicht automatisch, dass die Items eng zusammenhängen; es können auch einfach viele sein.</InShort>
      <MoreDetail summary="Welches α druckt R?">
        <ul>
          <li>Die Formel oben ist das <b>standardisierte α</b>; <code>summary()</code> zeigt es als „Alpha (standardized)“: für die Verbundenheit 0,731. Ganz oben steht „Cronbach's Alpha“ (0,726). Es rechnet mit den Varianzen der Antworten statt mit Korrelationen. Meist liegen beide nah beieinander; berichtet wird üblicherweise „Cronbach's Alpha“.</li>
          <li>Daneben druckt R <b>McDonalds ω</b> (Omega, 0,733). ω lässt jedes Item unterschiedlich stark am gemeinsamen Begriff hängen, α behandelt alle gleich. Liegen α und ω nah beieinander, ist das ein gutes Zeichen. In dieser Sitzung schaust du auf α.</li>
          <li>α kann auch negativ werden. Das passiert, wenn Items in verschiedene Richtungen zeigen (Thema 3).</li>
        </ul>
      </MoreDetail>
      <Mixup>α ist kein Prozentwert und kein Anteil von Befragten. α = 0,73 heißt nicht „73 % antworten stimmig“, sondern: Die Items hängen so eng zusammen, dass ihr Mittelwert recht zuverlässig misst.</Mixup>
    </Card>

    <Card id="v2c" step="2c" title="Die Ausgabe von reliability() lesen" badge={<Known session={7} what="summary()" />} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">So sieht die ausführliche Ausgabe für die vier Fragen zur Verbundenheit aus (Vorlage in <a href="#r2">R lesen, Karte R2</a>). Wähl eine Zahl und schau, was sie sagt.</p>
      <ReliabilityOutput />
      <AlphaRules />
      <QuickCheck question={CHECKS.g2c} />
      <InShort><code>reliability()</code> zeigt oben <b>Cronbachs α</b> für alle Items, unten je Item die <b>Trennschärfe</b> (Corrected Item-Total) und <b>α ohne dieses Item</b> (Alpha if Deleted). Ein Item mit niedriger Trennschärfe passt schlecht zu den anderen. Steigt α ohne ein Item, prüfst du am Inhalt, ob es wirklich zum Begriff gehört.</InShort>
      <MoreDetail summary="Grenzen der Faustregeln">
        <ul>
          <li>Die Grenzen 0,7 oder 0,8 sind Gewohnheiten, keine Naturgesetze. 0,69 ist nicht schlecht und 0,71 nicht gut; nenn immer die Zahl.</li>
          <li>α steigt mit der Zahl der Items (Karte 2b). Bei 20 Items reicht schon eine mittlere Korrelation von 0,2 für α = 0,833. Bei drei oder vier Items ist ein α um 0,7 dagegen schon ordentlich.</li>
          <li>Ein sehr hohes α (über 0,95) kann heißen, dass die Items fast dasselbe fragen. Dann misst der Index einen engen Ausschnitt des Begriffs.</li>
          <li>α prüft nicht, ob die Items <b>einen</b> gemeinsamen Begriff messen. Auch zwei Gruppen von Items, die je unter sich eng zusammenhängen, können ein hohes α ergeben. Ob es eine oder mehrere Dimensionen sind, zeigt ein eigenes Verfahren, die Faktorenanalyse; sie kommt im Lernpfad nicht vor. Hier hilft dir der Inhalt: Gehören die Items zu einem Begriff?</li>
          <li>α prüft nicht die Validität (Karte 2a).</li>
          <li>Ein Item zu streichen, nur weil α dann etwas steigt, ist keine gute Regel. Wer Items streicht, verengt den Begriff.</li>
        </ul>
      </MoreDetail>
      <Mixup>Trennschärfe und „Alpha if Deleted“ verwechseln. Die Trennschärfe ist die Korrelation des Items mit den anderen (hoch ist gut). „Alpha if Deleted“ ist α ohne das Item (höher als α heißt: das Item passt schlecht).</Mixup>
      <MapLink concept="reliability" className="absatz s8-karte">Reliabilität, Alpha und Omega</MapLink>
    </Card>
  </Foundation>;
}

/** Grundlage 3: Alle in eine Richtung (3a Andersherum gefragt, 3b Umpol-Labor). */
export function Foundation3() {
  return <Foundation id="g3" n={3} title="Alle in eine Richtung" taskHref="#a3"
    intro="Was passiert, wenn Fragen andersherum gestellt sind, und wie bringst du sie in eine Richtung? Zwei Schritte, etwa 10 Minuten.">

    <Card id="v3a" step="3a" title="Andersherum gefragt" badge={<Known session={5} what="Umpolen" />} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Der ALLBUS fragt nach Rollenbildern in Familie und Beruf. Antworten von 1 „stimme voll zu“ bis 4 „stimme gar nicht zu“. Vier der Aussagen:</p>
      <ul>
        <li>fr07 „Eine berufstätige Frau kann eine genauso gute Mutter sein.“ (stimmen zu: 68,9 %)</li>
        <li>fr08 „Beide Eltern sollten Vollzeit arbeiten und sich den Haushalt teilen.“ (66,9 %)</li>
        <li>fr03b „Eine Frau sollte nicht arbeiten, solange ihr Kind klein ist.“ (36,2 %)</li>
        <li>fr04b „Die Frau sollte zu Hause bleiben und die Kinder versorgen.“ (20,1 %)</li>
      </ul>
      <p>(gewichtet; Kurzfassungen nach den Variablenlabels.) Wer bei fr07 voll zustimmt, denkt eher gleichberechtigt. Wer bei fr03b voll zustimmt, denkt eher traditionell. Dieselbe 1 bedeutet also zweimal das Gegenteil.</p>
      <Reverse />
      <QuickCheck question={CHECKS.g3a} />
      <InShort>Bevor du Items zu einem Index zusammenfasst, müssen alle in <b>dieselbe Richtung</b> zeigen: Eine hohe Zahl muss bei jedem Item dasselbe bedeuten. Andersherum gefragte Items (Fachbegriff: <b>invertierte Items</b>) polst du um: Die Skala wird gespiegelt, aus der kleinsten Zahl wird die größte.</InShort>
      <MoreDetail summary="Warum fragt man überhaupt andersherum?">
        <ul>
          <li>Manche Menschen stimmen fast allem zu, egal was gefragt wird (<b>Zustimmungstendenz</b>, englisch Acquiescence). Sind einige Aussagen andersherum gestellt, fällt das auf und verzerrt den Index weniger.</li>
          <li><code>rec(x, rules = "rev")</code> nimmt dafür den kleinsten und den größten Code der Skala, so wie die Wertelabels sie angeben, nicht die kleinste und größte Antwort, die tatsächlich vorkommt (kennst du aus Sitzung 5). Fehlende Werte bleiben leer. Das Wort zur Antwort wandert mit: Bei fr03b_um steht STIMME GAR NICHT ZU jetzt bei Code 1.</li>
          <li>Welche Items umgepolt werden, entscheidest du am Wortlaut, bevor du rechnest. Die Rechnung (Thema 2) zeigt dir dann, ob du richtig lagst: Ein falsch gepoltes Item hat eine negative Trennschärfe.</li>
        </ul>
      </MoreDetail>
      <Mixup>Umpolen und Umkodieren in Gruppen verwechseln. Beim Umpolen bleiben alle Stufen erhalten, nur ihre Reihenfolge dreht sich. Beim Zusammenfassen in Gruppen (Sitzung 5) werden aus mehreren Stufen wenige.</Mixup>
    </Card>

    <Card id="v3b" step="3b" title="Umpol-Labor" badge={<Badge>Cronbachs α: Grundlage 2</Badge>} tag={{ kind: 'estimate', label: 'Ausprobieren' }}>
      <p className="lead">Hier kannst du jedes der vier Items umpolen und sofort sehen, was mit α und den Trennschärfen passiert. Gerechnet mit den 3.517 Befragten, die alle vier beantwortet haben.</p>
      <ReverseLab />
      <QuickCheck question={CHECKS.g3b} />
      <InShort>Ein <b>negatives α</b> oder eine <b>negative Trennschärfe</b> sind fast immer ein Zeichen für ein falsch gepoltes Item. Nach dem Umpolen sind die Trennschärfen positiv. Ob du die einen oder die anderen umpolst, ändert α nicht, nur die Richtung des Index.</InShort>
      <MoreDetail summary="Was α nach dem Umpolen sagt">
        <ul>
          <li>Mit α = 0,696 liegen die vier Rollenbild-Items knapp unter der üblichen Grenze 0,7 (mariposa: Questionable). Bei vier Items ist das kein schlechter Wert (Grundlage 2c).</li>
          <li>Die schwächste Trennschärfe hat fr08 (0,399). Ohne fr08 läge α bei 0,682, also niedriger: fr08 trägt also trotzdem etwas bei.</li>
          <li>Bei diesen vier Items, zwei in jeder Richtung, sind ohne Umpolen alle vier Trennschärfen negativ. Die Rechnung zeigt dann nur, dass etwas nicht stimmt, aber nicht, welche Items andersherum sind; das sagt dir erst der Wortlaut. Darum zuerst lesen, dann rechnen.</li>
        </ul>
      </MoreDetail>
      <Mixup>Umpolen „verbessert“ nicht die Daten. Es macht nur sichtbar, dass die Antworten zusammenpassen. Ein Item, das inhaltlich nicht passt, wird durch Umpolen nicht passend.</Mixup>
    </Card>
  </Foundation>;
}

/** Grundlage 4: Ausgleichen oder alle? (4a Ausgleich im Mittelwert, 4b Inglehart). */
export function Foundation4() {
  return <Foundation id="g4" n={4} title="Ausgleichen oder alle?" taskHref="#a4"
    intro="Wann ist ein Mittelwert die falsche Regel, und wie sieht ein Kombinationsindex aus? Zwei Schritte, etwa 8 Minuten.">

    <Card id="v4a" step="4a" title="Ausgleich im Mittelwert" tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Zwei Befragte, zum Beispiel, antworten auf drei Aussagen einer Skala von 1 „stimme voll zu“ bis 5 „lehne ganz ab“. Person A: 1, 1, 4. Person B: 2, 2, 2. Beide haben den Mittelwert 2, also „im Schnitt Zustimmung“. Aber Person A lehnt eine Aussage ab, Person B stimmt allen zu.</p>
      <Balance />
      <InShort>Ein Mittelwertindex ist <b>kompensatorisch</b>: Eine hohe Antwort kann eine niedrige ausgleichen. Ein <b>Kombinationsindex</b> verbindet die Antworten nach einer festen Regel, etwa „bei allen zugestimmt“ oder „diese Antwort zuerst, jene an zweiter Stelle“. Welche Regel passt, folgt aus dem Begriff, den du messen willst.</InShort>
      <MoreDetail summary="Zählen mit row_sums()">
        <ul>
          <li>Für eine Regel wie „allen zugestimmt“ machst du zuerst aus jedem Item eine 0/1-Variable mit <code>rec()</code> (kennst du aus Sitzung 5): 1 heißt zugestimmt, 0 nicht. Dann zählt <code>row_sums(pick(…))</code> die Einsen je Person: 0 bis 3 Zustimmungen. „Allen zugestimmt“ heißt dann: Summe 3.</li>
          <li>Bei <code>row_sums()</code> ist <code>min_valid</code> besonders wichtig. Ohne <code>min_valid</code> zählt R nur die gültigen Antworten zusammen, und wer eine Frage übersprungen hat, sieht aus, als hätte er dort nicht zugestimmt. Mit <code>min_valid</code> gleich der Zahl der Items bekommt nur einen Wert, wer alle beantwortet hat.</li>
          <li>Auch eine Summe ist ein Index (<b>Summenindex</b>). Ohne fehlende Werte enthält er dieselbe Information wie der Mittelwert, nur auf einer anderen Skala.</li>
        </ul>
      </MoreDetail>
      <Mixup>„Im Schnitt Zustimmung“ und „überall Zustimmung“ gleichsetzen. Der Mittelwert sagt nichts darüber, ob jemand bei jeder Aussage zustimmt.</Mixup>
    </Card>

    <Card id="v4b" step="4b" title="Ein klassischer Kombinationsindex: Inglehart" badge={<Known session={6} what="Gewichtet" />} tag={{ kind: 'estimate', label: 'Ausprobieren' }}>
      <p className="lead">Der Politikwissenschaftler Ronald Inglehart hat Menschen vier politische Ziele in eine Rangfolge bringen lassen. Zwei Ziele gelten als materialistisch (Sicherheit und Wohlstand), zwei als postmaterialistisch (Mitbestimmung und Freiheit):</p>
      <ul>{INGLE_GOALS.map(g => <li key={g.id}>{`„${g.text}“ (${g.id}, ${g.kind === 'M' ? 'materialistisch' : 'postmaterialistisch'})`}</li>)}</ul>
      <p>Der ALLBUS bildet daraus den Inglehart-Index (ingle). Er schaut nur auf Platz 1 und Platz 2. Ordne die Ziele mit den Knöpfen und schau, welcher Typ herauskommt.</p>
      <Inglehart />
      <QuickCheck question={CHECKS.g4b} />
      <InShort>Der Inglehart-Index ist ein <b>Kombinationsindex</b>: Er verbindet zwei Antworten nach einer Regel zu einem Typ. Ein Mittelwert wäre hier sinnlos.</InShort>
      <MoreDetail summary="Warum hier kein Mittelwert?">
        <ul>
          <li>Jede Person vergibt die Plätze 1, 2, 3 und 4 genau einmal. Der Mittelwert ihrer vier Ränge ist deshalb bei allen 2,5. Ein Mittelwertindex würde alle Menschen gleich machen.</li>
          <li>Der Typ ist eine neue Variable mit vier Stufen, nominal bis ordinal. Du beschreibst ihn wie jede kategoriale Variable mit Anteilen (<code>frequency()</code> mit Gewicht), nicht mit einem Mittelwert.</li>
          <li>Die Zahlen sind gewichtet, weil sie Anteile in der Bevölkerung beschreiben.</li>
        </ul>
      </MoreDetail>
      <Mixup>Den Code des Typs (1 bis 4) wie eine Messzahl behandeln. <code>describe(ingle, weights = wghtpew)</code> rechnet zwar einen Mittelwert aus (2,472), aber als „mittlerer Inglehart-Wert“ sagt er nichts: Die Codes sind Namen der Typen mit einer groben Reihenfolge, keine gleich großen Abstände.</Mixup>
    </Card>
  </Foundation>;
}

/** Überblick „Vom Item zum Index“: fünf Schritte, Welcher Index?, Voraussetzungen. */
export function Overview() {
  return <Foundation id="g5" n="✓" title="Vom Item zum Index" eyebrow="Überblick zu allen Aufgaben"
    intro="Alle vier Themen zusammen: in welcher Reihenfolge du einen Index baust und welcher Index wann passt.">
    <Card id="u1" step="Ü1" title="Vom Item zum Index in fünf Schritten" tag={{ kind: 'picture', label: 'Im Bild' }}>
      <Flow />
      <p className="absatz">In den Aufgaben hast du die Schritte in anderer Reihenfolge geübt: erst den Index (A1), dann die Stimmigkeit (A2), dann die Richtung (A3). In einer eigenen Auswertung gehst du von 1 bis 5.</p>
    </Card>
    <Card id="u2" step="Ü2" title="Welcher Index?" tag={{ kind: 'picture', label: 'Im Bild' }}>
      <WhichIndex />
      <InShort>Zuerst entscheidet der Begriff (darf man ausgleichen?), dann prüfen Richtung und α, ob die Items zusammen einen Mittelwert tragen.</InShort>
    </Card>
    <Card id="u3" step="Ü3" title="Voraussetzungen">
      <table className="daten voll">
        <caption className="sr-only">Voraussetzungen je Schritt</caption>
        <thead><tr><th scope="col">Schritt</th><th scope="col">braucht</th><th scope="col">Vorsicht</th></tr></thead>
        <tbody>
          <tr><td>Mittelwertindex</td><td>Items mit gleicher Antwortskala, alle in derselben Richtung, ein gemeinsamer Begriff</td><td>Mittelwert lässt Ausgleich zu; Richtung des Index nennen („1 heißt …“).</td></tr>
          <tr><td><code>min_valid</code></td><td>eine begründete Regel, wie viele Antworten nötig sind</td><td>Zu streng: viele ohne Wert; zu locker: Werte aus einer einzigen Antwort. Regel und n berichten.</td></tr>
          <tr><td>Cronbachs α</td><td>mindestens zwei Items, Befragte mit allen Antworten (listenweise)</td><td>Steigt mit der Zahl der Items; prüft weder eine Dimension noch die Validität; Faustregeln sind keine Grenzen.</td></tr>
          <tr><td>Trennschärfe, α ohne Item</td><td>dieselbe Ausgabe</td><td>Ein Item nicht nur wegen der dritten Nachkommastelle streichen; der Inhalt entscheidet.</td></tr>
          <tr><td>Kombinationsindex</td><td>eine inhaltlich begründete Regel</td><td>Mit <code>row_sums()</code> immer <code>min_valid</code> setzen; Ergebnis ist eine kategoriale Variable: Anteile berichten, keinen Mittelwert der Codes.</td></tr>
          <tr><td>Gewichtung</td><td><code>weights = wghtpew</code> für Aussagen über die Bevölkerung</td><td>α und Personenzahlen ohne Gewicht; gewichtet ändert sich α kaum.</td></tr>
        </tbody>
      </table>
      <Mixup>„Hohes α, also gute Skala.“ α sagt nur, dass die Items zusammenpassen. Ob sie das Richtige messen (Validität) und ob ein Mittelwert zum Begriff passt, entscheidest du am Inhalt.</Mixup>
    </Card>
  </Foundation>;
}
