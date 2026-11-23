// Sitzung 10 „Regression vertiefen“: die vier Grundlagen und der Überblick aus dem Plan sitzung10.md, ohne R-Code-Werkstatt.
import { Badge, Card, InShort, Known, Mixup, MoreDetail } from '../blocks/Card';
import { Foundation } from '../blocks/Foundation';
import { MapLink } from '../blocks/MapLink';
import { ChoiceThink, GuessReveal, NumberThink } from './Check';
import { K1A_GUESS, THINK } from './content';
import { AgeHealth } from './figures/AgeHealth';
import { BetaRuler, Dice, VifCircles } from './figures/Compare';
import { FormulaAdjR2, FormulaBeta, FormulaTwo } from './figures/Formulas';
import { DummyTable, Reference, TwoGroups } from './figures/Groups';
import { Influence, InteractionPlot } from './figures/Limits';
import { Assignment, DecisionTree } from './figures/Tree';

/** „→ In der freien Karte: …“: opens the concept in the free map (shared MapLink). */
function MapHint({ concept, children }: { concept: string; children: string }) {
  return <MapLink concept={concept} className="s10-karte">{children}</MapLink>;
}

/** Grundlage 1: Mehrere Prädiktoren, konstant halten (1a, 1b, 1c). */
export function Foundation1() {
  return <Foundation id="g1" n={1} title="Mehrere Prädiktoren: konstant halten" taskHref="#a1"
    intro="Was ändert sich, wenn ein zweiter Prädiktor ins Modell kommt? Drei Schritte, etwa 15 Minuten.">

    <Card id="v1a" step="1a" title="Sind Ältere zufriedener?" tag={{ kind: 'estimate', label: 'Kurz überlegen' }} badge={<Badge>Im Bild</Badge>}>
      <p className="lead">Der ALLBUS fragt, wie zufrieden man alles in allem mit seinem Leben ist, von 0 bis 10. Bevor du die Daten siehst: Wer ist im Schnitt zufriedener, die Jüngsten (18 bis 29) oder die Ältesten (75 und älter)?</p>
      <GuessReveal id={K1A_GUESS.id} label={K1A_GUESS.label} options={K1A_GUESS.options} feedback={K1A_GUESS.feedback}>
        <AgeHealth />
        <div className="leseart"><p><b className="t">So liest du das:</b> In jeder Gesundheitsgruppe sind Ältere deutlich zufriedener als Jüngere. Zusammen sieht man davon nur wenig, weil Ältere öfter krank sind, und Krankheit drückt die Zufriedenheit. Zwei Dinge wirken gegeneinander: das Alter nach oben, die schlechtere Gesundheit nach unten.</p></div>
      </GuessReveal>
      <ChoiceThink question={THINK.k1a} />
      <InShort>In einer <b>multiplen Regression</b> stehen mehrere Prädiktoren im Modell. Jedes B sagt dann, wie sich die Vorhersage ändert, wenn sich nur dieser Prädiktor um eins erhöht und die anderen gleich bleiben. Das nennt man <b>konstant halten</b> oder <b>kontrollieren</b>: B für das Alter vergleicht Menschen mit gleicher Gesundheit.</InShort>
      <MoreDetail summary="Warum sich B ändert, und wann nicht">
        <ul>
          <li>B ändert sich, wenn der neue Prädiktor mit beiden zusammenhängt: mit dem alten Prädiktor (Ältere sind seltener gesund) und mit der abhängigen Variable (Gesündere sind zufriedener).</li>
          <li>Hier hat die Gesundheit den Zusammenhang <b>verdeckt</b>: B steigt. Häufiger ist der umgekehrte Fall: Ein Teil des Zusammenhangs gehört eigentlich zum neuen Prädiktor, und B wird kleiner. Welcher Fall in Aufgabe 1 eintritt, findest du dort selbst heraus.</li>
          <li>Hängt der neue Prädiktor mit dem alten gar nicht zusammen, bleibt B fast gleich. Dann steigt nur R².</li>
          <li>R² steigt hier von 0,006 (Alter allein) auf 0,190. Die Gesundheit erklärt viel mehr von der Lebenszufriedenheit als das Alter.</li>
          <li>Eine Feinheit: Alter allein rechnet R mit 5.142 Befragten (gewichtet), mit Gesundheit mit 5.128, weil einige keine Gesundheitsangabe haben. Bei so wenigen Fehlenden ändert das die Zahlen kaum.</li>
        </ul>
      </MoreDetail>
      <Mixup>„Mit Gesundheit im Modell“ heißt nicht, dass die Gesundheit aus den Daten entfernt wird. Alle Befragten bleiben drin. Das Modell rechnet nur so, als hätten alle dieselbe Gesundheit.</Mixup>
    </Card>

    <Card id="v1b" step="1b" title="Formel lesen lernen: Vorhersage mit zwei Prädiktoren" badge={<Known session={9} what="Vorhersage" />} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Das Modell aus Alter und Gesundheit macht für jede Person eine Vorhersage. Nimm zwei Personen, zum Beispiel: Frau A ist 40 Jahre alt, Herr B ist 50, beide schätzen ihre Gesundheit als „gut“ ein (gesund = 4).</p>
      <FormulaTwo />
      <p className="absatz">Von links nach rechts gelesen: Starte bei der Konstante, leg für jedes Jahr 0,024 dazu und für jede Gesundheitsstufe 0,861. Vergleichst du zwei Personen, die sich nur in einem Prädiktor unterscheiden, fällt alles andere weg. Genau das ist „konstant halten“.</p>
      <NumberThink question={THINK.k1b} />
      <InShort>Die <b>Vorhersage</b> einer multiplen Regression ist Konstante plus jedes B mal seinem Wert. Unterscheiden sich zwei Personen nur in einem Prädiktor, ist ihr Unterschied genau dieses B mal den Unterschied im Prädiktor.</InShort>
      <MoreDetail summary="Was die Konstante hier heißt">
        <p>Die Konstante 3,095 ist die Vorhersage für Alter 0 und Gesundheit 0. Beides gibt es nicht (gesund reicht von 1 bis 5). Die Konstante ist hier nur der Startwert der Rechnung, keine Aussage über Menschen. Das kennst du aus Sitzung 9. Bei Dummies (Grundlage 2) bekommt sie wieder eine Bedeutung.</p>
      </MoreDetail>
      <Mixup>B der Gesundheit (0,861) ist viel größer als B des Alters (0,024). Das heißt nicht, dass die Gesundheit 36-mal so wichtig ist: Ein Jahr ist ein viel kleinerer Schritt als eine Gesundheitsstufe. Wie man fair vergleicht, zeigt Grundlage 3.</Mixup>
    </Card>

    <Card id="v1c" step="1c" title="Was kontrollieren heißt, und was nicht" badge={<Known session={6} what="Drittvariable" />} tag={{ kind: 'estimate', label: 'Kurz überlegen' }}>
      <p className="lead">Zwei Zahlen für das Alter: 0,008 (ohne Gesundheit) und 0,024 (mit Gesundheit). Welche stimmt?</p>
      <ChoiceThink question={THINK.k1c} />
      <InShort>Beide B stimmen. Sie beantworten verschiedene Fragen. Ohne Kontrolle: Wie unterscheiden sich die Gruppen insgesamt? Mit Kontrolle: Wie unterscheiden sie sich, wenn der kontrollierte Prädiktor gleich ist? Sag beim Berichten immer dazu, was konstant gehalten wurde.</InShort>
      <MoreDetail summary="Was man kontrollieren sollte">
        <ul>
          <li>Gut zum Kontrollieren sind <b>gemeinsame Ursachen</b> (Fachbegriff: Confounder; die Drittvariable aus Sitzung 6): Dinge, die vor beiden Variablen feststehen und beide beeinflussen können, etwa Geschlecht oder wo jemand aufgewachsen ist.</li>
          <li>Vorsicht bei <b>Folgen</b>: Die Gesundheit ist zum Teil eine Folge des Alters. Wer sie kontrolliert, fragt nach dem Alter „ohne den Weg über die Gesundheit“. Das ist eine berechtigte Frage, aber nicht dieselbe wie „Wie hängt das Alter mit der Zufriedenheit zusammen?“.</li>
          <li>Nicht kontrollieren solltest du etwas, das sehr Ähnliches misst wie die abhängige Variable oder eher ihre Folge ist. Dann rechnest du einen Teil dessen heraus, was du eigentlich verstehen willst.</li>
          <li>Eine Regression zeigt Zusammenhänge. Auch mit vielen Kontrollen beweist sie keine Ursache: Es kann immer etwas fehlen, das man nicht gemessen hat.</li>
        </ul>
      </MoreDetail>
      <Mixup>„Kontrolliert für Gesundheit“ heißt nicht „Gesundheit spielt keine Rolle“. Es heißt: Der Zusammenhang des Alters ist so berechnet, als wären alle gleich gesund. Die Gesundheit selbst hat ihr eigenes, großes B.</Mixup>
      <MapHint concept="confounding">Confounding und gemeinsame Ursachen</MapHint>
    </Card>
  </Foundation>;
}

/** Grundlage 2: Gruppen als Prädiktoren, Dummyvariablen (2a, 2b, 2c). */
export function Foundation2() {
  return <Foundation id="g2" n={2} title="Gruppen als Prädiktoren: Dummyvariablen" taskHref="#a2"
    intro="Wie kommen Gruppen wie der Familienstand in eine Regression? Drei Schritte, etwa 12 Minuten.">

    <Card id="v2a" step="2a" title="Zwei Gruppen: eine 0/1-Variable"
      badge={<><Known session={5} what="Dummyvariable mit 0 und 1" /> <Known session={7} what="Mittelwertvergleich" /></>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Sind Verheiratete zufriedener mit ihrem Leben? Teil die Befragten in zwei Gruppen: verheiratet und zusammenlebend (1) und alle anderen (0). Eine solche Variable mit nur 0 und 1 heißt Dummyvariable. Im Modell <code>ls01 ~ verheiratet</code> rechnet R: Konstante 7,042, B 0,652.</p>
      <TwoGroups />
      <NumberThink question={THINK.k2a} />
      <InShort>Eine <b>Dummyvariable</b> ist 1 für eine Gruppe und 0 für alle anderen. Im Modell ist die <b>Konstante</b> der Mittelwert der Gruppe mit 0, und <b>B</b> ist der Abstand der Gruppe mit 1 zu ihr.</InShort>
      <MoreDetail summary="Dasselbe wie ein Mittelwertvergleich">
        <p>Mit nur einer Dummyvariable im Modell ist B genau der Unterschied der beiden Gruppenmittelwerte, den du in Sitzung 7 mit dem t-Test geprüft hast. Der Vorteil der Regression: Du kannst weitere Prädiktoren dazunehmen und den Abstand bei gleichem Alter oder gleicher Gesundheit berechnen.</p>
      </MoreDetail>
      <Mixup>Bei einer Dummyvariable ist „eine Stufe mehr“ der ganze Schritt von der einen Gruppe zur anderen. B = 0,652 heißt nicht „ein bisschen verheirateter“.</Mixup>
    </Card>

    <Card id="v2b" step="2b" title="Mehr als zwei Gruppen: ein Dummy je Gruppe, eine bleibt draußen" badge={<Badge>Im Bild</Badge>} tag={{ kind: 'estimate', label: 'Ausprobieren' }}>
      <p className="lead">Der Familienstand hat fünf Gruppen: verheiratet (1), verheiratet getrennt lebend (2), verwitwet (3), geschieden (4), ledig (5). Die Codes 1 bis 5 sind nur Namen, keine Stufen. „Geschieden“ ist nicht „doppelt so viel“ wie „getrennt lebend“. Darum bekommt jede Gruppe ihre eigene 0/1-Variable.</p>
      <DummyTable />
      <p className="absatz">Ins Modell kommen nur vier der fünf Dummies. Die Gruppe, die draußen bleibt, heißt <b>Referenzgruppe</b>. Ihr Mittelwert ist die Konstante, und jedes B ist der Abstand einer Gruppe zur Referenz. Welche Gruppe die Referenz ist, entscheidest du. Probier es aus.</p>
      <Reference />
      <NumberThink question={THINK.k2b} />
      <InShort>Eine Variable mit k Gruppen kommt als <b>k − 1 Dummies</b> ins Modell. Die weggelassene Gruppe ist die <b>Referenzgruppe</b>: Die Konstante ist ihr Mittelwert, jedes B der Abstand einer Gruppe zu ihr. Andere Referenz, andere B, aber dieselben Vorhersagen.</InShort>
      <MoreDetail summary="Welche Referenz wählen?">
        <ul>
          <li>Nimm als Referenz die Gruppe, mit der du vergleichen willst. Oft ist das die größte Gruppe oder eine, die man als „normal“ ansieht. Sag im Bericht immer, welche Gruppe die Referenz ist.</li>
          <li>Eine sehr kleine Referenzgruppe ist ungünstig: Ihr Mittelwert ist unsicher, und damit werden alle B unsicher. Mit „getrennt lebend“ (85 Befragte gewichtet) als Referenz sind die Konfidenzintervalle viel breiter als mit „verheiratet“ (2.823).</li>
          <li>Signifikanz gilt immer für den Abstand zur Referenz. „Geschieden ist nicht signifikant“ heißt nur: nicht deutlich anders als die Referenz.</li>
          <li>Es gibt eine Abkürzung: Mit <code>to_label(mstat)</code> vor <code>linear_regression()</code> macht R die Dummies selbst und nimmt die erste Gruppe als Referenz. Darauf weist die Notiz „Use to_label() first …“ in der Ausgabe hin. Heute nutzt du <code>to_dummy()</code>, weil du dann selbst siehst und wählst, wer die Referenz ist.</li>
        </ul>
      </MoreDetail>
      <Mixup>B eines Dummys ist nicht der Mittelwert der Gruppe, sondern ihr Abstand zur Referenz. Der Mittelwert ist Konstante plus B.</Mixup>
    </Card>

    <Card id="v2c" step="2c" title="Die Dummyfalle, und warum die Codes nicht als Zahl ins Modell gehören" tag={{ kind: 'estimate', label: 'Kurz überlegen' }}>
      <p className="lead">Was passiert, wenn du alle fünf Dummies ins Modell nimmst? R meldet: <code>ℹ Excluded due to perfect collinearity (matching SPSS): `mstat_5`</code> und rechnet mit vier.</p>
      <ChoiceThink question={THINK.k2c} />
      <InShort>Die <b>Dummyfalle</b>: Alle Dummies einer Variable zusammen sagen nichts Neues, weil jede Person in genau einer Gruppe ist. Darum bleibt eine draußen. mariposa wirft sie selbst hinaus und meldet es; welche Gruppe dann die Referenz ist, steht in der Meldung.</InShort>
      <MoreDetail summary="Codes als Zahl: was dann passiert">
        <p>Nimmst du <code>mstat</code> ohne Dummies ins Modell, rechnet R mit den Codes 1 bis 5, als wären es Stufen. Heraus kommt B = −0,171 „pro Stufe Familienstand“, als wäre „ledig“ (5) viermal so weit weg von „verheiratet“ wie „getrennt lebend“ (2). Das ergibt keinen Sinn. Die Notiz „labelled predictor mstat entered with its numeric codes“ warnt dich davor.</p>
      </MoreDetail>
      <Mixup>Eine Zahl im Datensatz macht eine Variable nicht zu einer Stufe (Codes sind oft nur Namen, kennst du aus Sitzung 2). Familienstand, Partei oder Herkunft kommen als Dummies ins Modell, nicht als Zahl.</Mixup>
      <MapHint concept="dummy">Dummyvariablen</MapHint>
    </Card>
  </Foundation>;
}

/** Grundlage 3: Vergleichen und prüfen (3a Beta, 3b korrigiertes R², 3c Multikollinearität). */
export function Foundation3() {
  return <Foundation id="g3" n={3} title="Vergleichen und prüfen: Beta, korrigiertes R², Multikollinearität" taskHref="#a3"
    intro="Welcher Prädiktor wiegt mehr, was taugt R² bei vielen Prädiktoren, und wann stören sich Prädiktoren gegenseitig? Drei Schritte, etwa 15 Minuten.">

    <Card id="v3a" step="3a" title="Wer wiegt mehr? Beta"
      badge={<><Known session={3} what="Standardabweichung" /> <Badge>Beta: kennst du aus Sitzung 9, neu zum Vergleichen</Badge></>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Im Modell aus <a href="#r1">R lesen</a> ist B für das Alter 0,024 pro Jahr und für die Gesundheit 0,861 pro Stufe. Ein Jahr und eine Gesundheitsstufe sind verschieden große Schritte. Fair vergleichen kannst du erst, wenn beide in derselben Einheit gemessen sind. Diese Einheit ist die Standardabweichung: ein typischer Abstand vom Mittelwert.</p>
      <BetaRuler />
      <h6 className="zwischen">Formel lesen lernen</h6>
      <FormulaBeta />
      <p className="absatz">Von innen nach außen: Erst rechnest du B auf einen typischen Schritt des Prädiktors um (mal SD des Prädiktors). Dann drückst du das Ergebnis in typischen Schritten der abhängigen Variable aus (geteilt durch ihre SD). So haben alle Prädiktoren dieselbe Einheit.</p>
      <ChoiceThink question={THINK.k3a} />
      <InShort>Der <b>standardisierte Koeffizient Beta</b> ist B in Standardabweichungen: Um wie viele Standardabweichungen ändert sich die Vorhersage, wenn der Prädiktor um eine Standardabweichung steigt? Mit Beta vergleichst du Prädiktoren in einem Modell. B brauchst du für Vorhersagen und für Sätze in der Einheit der Variable.</InShort>
      <MoreDetail summary="Grenzen von Beta">
        <ul>
          <li>In Sitzung 9 war Beta mit nur einer UV gleich der Korrelation r. Mit mehreren Prädiktoren gilt das nicht mehr: Beta ist dann der Zusammenhang bei gleichen Werten der anderen Prädiktoren, in Standardabweichungen.</li>
          <li>Beta vergleicht nur innerhalb eines Modells und derselben Daten. Zwischen Studien oder Gruppen vergleicht man besser B.</li>
          <li>Bei 0/1-Variablen hängt Beta auch davon ab, wie groß die Gruppen sind: Ein großer Abstand, der nur wenige betrifft, bekommt ein kleines Beta. Beta sagt dann: Wie viel bewegt dieser Prädiktor in der ganzen Bevölkerung? Den Abstand zwischen den Gruppen liest du an B.</li>
          <li>Rechnest du mit den gerundeten Zahlen nach, weicht das Ergebnis manchmal in der dritten Stelle ab: 0,024 × 18,212 ÷ 1,919 ergibt 0,228, R gibt 0,225 aus, weil es mit dem ungerundeten B (0,0237) rechnet.</li>
          <li>Die Konstante hat kein Beta. Darum ist ihre Zelle in der Spalte Beta leer.</li>
        </ul>
      </MoreDetail>
      <Mixup>Das größte B ist nicht automatisch der stärkste Prädiktor. B hängt an der Einheit: In Monaten gemessen hätte das Alter ein zwölfmal kleineres B, in Jahrzehnten ein zehnmal größeres. Beta bleibt gleich.</Mixup>
    </Card>

    <Card id="v3b" step="3b" title="R² steigt immer: das korrigierte R²" badge={<Known session={9} what="R² und Adjusted R Square" />} tag={{ kind: 'estimate', label: 'Ausprobieren' }}>
      <p className="lead">Jeder zusätzliche Prädiktor lässt R² steigen, auch einer, der mit nichts zu tun hat. Probier es mit 30 Befragten, zum Beispiel: Die Lebenszufriedenheit wird aus der Gesundheit vorhergesagt. Dann kommen Würfel dazu, für jede Person einmal gewürfelt.</p>
      <Dice />
      <h6 className="zwischen">Formel lesen lernen</h6>
      <FormulaAdjR2 />
      <p className="absatz">Von innen nach außen: Der nicht erklärte Teil (1 − R²) wird mit einem Bruch etwas größer gemacht. Der Bruch ist umso größer, je mehr Prädiktoren auf je weniger Befragte kommen. Bei Tausenden Befragten ist er fast 1.</p>
      <ChoiceThink question={THINK.k3b} />
      <InShort><b>R²</b> steigt mit jedem Prädiktor, auch einem nutzlosen. Das <b>korrigierte R²</b> (Adjusted R Square) zieht für jeden Prädiktor etwas ab und steigt nur, wenn ein neuer Prädiktor mehr erklärt, als ein Zufallsprädiktor wie ein Würfel im Schnitt erklären würde. Vergleichst du Modelle mit verschieden vielen Prädiktoren, nimm das korrigierte R².</InShort>
      <MoreDetail summary="Wann der Unterschied zählt">
        <p>Bei den meisten ALLBUS-Modellen mit Tausenden Befragten liegen R² und korrigiertes R² gleichauf. Rechnest du aber nur mit einer kleinen Gruppe, etwa den 91 Ost→West-Umgezogenen aus Aufgabe 2, und nimmst viele Prädiktoren, kann R² gut aussehen, während das korrigierte R² fast null ist. Das korrigierte R² kann sogar negativ werden: Dann erklärt das Modell weniger, als so viele Prädiktoren schon durch Zufall erklären würden.</p>
      </MoreDetail>
      <Mixup>Ein höheres R² heißt nicht, dass jeder Prädiktor etwas beiträgt. Ob ein einzelner Prädiktor etwas beiträgt, siehst du an seinem B, seinem Konfidenzintervall und seiner Signifikanz.</Mixup>
    </Card>

    <Card id="v3c" step="3c" title="Zwei Prädiktoren, die fast dasselbe sagen: Multikollinearität" tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Was passiert, wenn zwei Prädiktoren fast dasselbe messen? Nimm zum Alter in Jahren noch die Altersgruppe dazu (<code>agec</code>: 18–29, 30–44 und so weiter). Wer 70 ist, ist auch in der Gruppe 60–74. Die beiden laufen fast immer zusammen.</p>
      <VifCircles />
      <ChoiceThink question={THINK.k3c} />
      <InShort><b>Multikollinearität</b> heißt: Prädiktoren hängen so eng zusammen, dass das Modell ihre Anteile kaum trennen kann. Die B werden unsicher (große Standardfehler) und können springen. Der <b>VIF</b> (Varianzinflationsfaktor) misst das je Prädiktor: 1 heißt unabhängig von den anderen, ab 10 meldet mariposa ein Problem, manche sagen schon ab 5.</InShort>
      <MoreDetail summary="VIF und Toleranz lesen">
        <ul>
          <li>Die <b>Toleranz</b> ist 1 geteilt durch den VIF. Sie sagt, welcher Anteil eines Prädiktors nicht schon in den anderen steckt. Toleranz 0,053 beim Alter heißt: Nur gut 5 % der Streuung des Alters stecken nicht schon in den anderen Prädiktoren, hier vor allem in der Altersgruppe.</li>
          <li>Was tun? Einen der beiden weglassen oder beide zu einem Index zusammenfassen (Sitzung 8). Wichtig ist, dass jeder Prädiktor etwas Eigenes misst.</li>
          <li>Die Dummyfalle aus Grundlage 2 ist der Extremfall: Der fünfte Dummy steckt ganz in den anderen vier, der VIF wäre unendlich. Darum wirft R ihn hinaus.</li>
          <li>In Modellen mit Interaktion (Grundlage 4) ist ein höherer VIF normal, weil die Interaktion aus den beiden Prädiktoren gebaut ist. Dort deutet man ihn nicht als Problem.</li>
        </ul>
      </MoreDetail>
      <Mixup>Multikollinearität heißt nicht, dass Prädiktor und abhängige Variable eng zusammenhängen. Das ist erwünscht. Gemeint ist der Zusammenhang der Prädiktoren untereinander.</Mixup>
      <MapHint concept="multicollinearity">Multikollinearität</MapHint>
    </Card>
  </Foundation>;
}

/** Grundlage 4: Grenzen des Modells (4a Ausreißer und Einfluss, 4b Interaktion). */
export function Foundation4() {
  return <Foundation id="g4" n={4} title="Grenzen des Modells: Einfluss und Interaktion" taskHref="#a4"
    intro="Wann kippt ein einzelner Fall die Gerade, und was, wenn ein Zusammenhang nicht für alle gleich ist? Zwei Schritte, etwa 12 Minuten.">

    <Card id="v4a" step="4a" title="Ein einzelner Fall kann die Gerade kippen: Ausreißer und Einfluss"
      badge={<><Badge>Ausreißer: kennst du aus Sitzung 4 und 9</Badge> <Badge>Einfluss: neu heute</Badge></>} tag={{ kind: 'estimate', label: 'Ausprobieren' }}>
      <p className="lead">Elf Befragte, zum Beispiel, mit Alter und Lebenszufriedenheit. Die Gerade steigt leicht. Jetzt kommt eine zwölfte Person dazu, Person L. Sie ist sehr unzufrieden (1). Wo sie steht, entscheidet, was mit der Geraden passiert.</p>
      <ChoiceThink question={THINK.k4a} />
      <Influence />
      <InShort>In der Regression unterscheidet man drei Dinge. Ein <b>Ausreißer</b> liegt weit weg von der Geraden (großes Residuum). Ein Fall mit großer <b>Hebelwirkung</b> (Fachbegriff: Leverage) liegt beim Prädiktor weit draußen. <b>Einfluss</b> hat ein Fall, wenn das Modell ohne ihn deutlich andere B ergibt. Das passiert vor allem, wenn beides zusammenkommt: weit draußen und weit weg von der Geraden.</InShort>
      <MoreDetail summary="Und im ALLBUS?">
        <ul>
          <li>Bei Tausenden Befragten kippt ein Einzelner die Gerade kaum. Bei kleinen Gruppen ist das anders: Die 91 Ost→West-Umgezogenen aus Aufgabe 2 tragen ihr B allein. Wenige ungewöhnliche Personen können es merklich verschieben. Auch darum ist ihr Konfidenzintervall breit.</li>
          <li>Was tun? Ausreißer nicht einfach löschen. Erst prüfen, ob es ein Fehler ist (wie die wochenlangen Fragebögen in Sitzung 4). Ist es keiner, rechnet man das Modell einmal mit und einmal ohne die auffälligen Fälle und berichtet, ob sich das Ergebnis ändert.</li>
          <li>Für den Einfluss gibt es Maßzahlen, etwa Cooks Distanz; mariposa gibt keine aus. Die Idee dahinter ist genau der Vergleich mit und ohne den Fall. Für diese Prüfung reicht <code>filter()</code> aus Sitzung 2 vor <code>linear_regression()</code>.</li>
        </ul>
      </MoreDetail>
      <Mixup>Ein Ausreißer ist nicht automatisch ein Fehler, und weit draußen heißt nicht automatisch Einfluss: L am Rand auf der Geraden (Zustand 4) liegt weit draußen, ändert die Steigung aber kaum. L in der Mitte (Zustand 2) ist ein deutlicher Ausreißer, kippt die Steigung aber nicht.</Mixup>
      <MapHint concept="outliers_influence">Ausreißer und Einfluss</MapHint>
    </Card>

    <Card id="v4b" step="4b" title="Gilt ein Abstand für alle? Interaktion" badge={<Badge>Im Bild</Badge>} tag={{ kind: 'estimate', label: 'Kurz überlegen' }}>
      <p className="lead">Sind Erwerbstätige zufriedener mit ihrem Leben als Nicht-Erwerbstätige? Das hängt vom Alter ab. Unter 60 heißt „nicht erwerbstätig“ oft arbeitslos, krank oder in Ausbildung, ab 60 meist in Rente.</p>
      <InteractionPlot />
      <p className="absatz">Im Modell schreibt man dafür <code>ls01 ~ erwerb * ab60</code>. R gibt vier Zeilen aus: Konstante 6,339 (nicht erwerbstätig, unter 60), <code>erwerb</code> 1,091 (Abstand der Erwerbstätigen unter 60), <code>ab60</code> 1,233 (Abstand der Älteren zu den Jüngeren, beide nicht erwerbstätig), <code>erwerb:ab60</code> −1,035 (um so viel ist der Erwerbs-Abstand ab 60 anders). Der Doppelpunkt bezeichnet die Interaktion.</p>
      <NumberThink question={THINK.k4b} />
      <InShort>Eine <b>Interaktion</b> heißt: Der Zusammenhang eines Prädiktors hängt vom Wert eines anderen ab. In R schreibst du <code>*</code> statt <code>+</code>. Die Zeile mit dem Doppelpunkt sagt, um wie viel der Abstand in der zweiten Gruppe anders ist. Ist sie klein und nicht signifikant, zeigen die Daten keinen Hinweis, dass der Abstand in den Gruppen verschieden ist; dann reicht meist das Modell mit <code>+</code>. „Nicht signifikant“ heißt aber nicht „sicher gleich“ (kennst du aus Sitzung 7): Wie groß ein Unterschied höchstens sein könnte, zeigt das Konfidenzintervall.</InShort>
      <MoreDetail summary="B lesen, wenn eine Interaktion im Modell ist">
        <ul>
          <li>Mit Interaktion gilt B von <code>erwerb</code> nur für die Gruppe, in der <code>ab60</code> 0 ist, also unter 60. Es ist kein Durchschnitt über alle mehr.</li>
          <li>Ohne Interaktion (<code>ls01 ~ erwerb + ab60</code>) nimmt das Modell an, dass der Abstand in beiden Altersgruppen gleich ist. Das ist eine Voraussetzung: Stimmt sie nicht, beschreibt ein einzelnes B niemanden richtig.</li>
          <li>Die VIF steigen in Modellen mit Interaktion, weil <code>erwerb:ab60</code> aus <code>erwerb</code> und <code>ab60</code> gebaut ist. Das ist hier kein Problem (siehe Grundlage 3c).</li>
        </ul>
      </MoreDetail>
      <Mixup>Interaktion heißt nicht, dass zwei Prädiktoren miteinander zusammenhängen. Erwerbstätigkeit und Alter hängen zusammen (Ältere sind seltener erwerbstätig), das ist Thema von Grundlage 1 und 3c. Interaktion heißt: Der Abstand, den der eine Prädiktor macht, ist je nach dem anderen verschieden.</Mixup>
      <MapHint concept="interaction">Interaktion</MapHint>
    </Card>
  </Foundation>;
}

/** Überblick: Ein Modell bauen und prüfen (Ü1 bis Ü4). */
export function Overview() {
  return <Foundation id="g5" n="✓" title="Ein Modell bauen und prüfen" eyebrow="Überblick zu allen Aufgaben"
    intro="Alle vier Themen zusammen: wie Variablen ins Modell kommen, was du kontrollierst und was du prüfst.">
    <Card id="u1" step="Ü1" title="Wie kommt eine Variable ins Modell?" tag={{ kind: 'estimate', label: 'Zuordnen' }}>
      <DecisionTree />
      <Assignment />
    </Card>
    <Card id="u2" step="Ü2" title="Was du kontrollierst">
      <table className="daten voll">
        <caption className="sr-only">Was du kontrollierst</caption>
        <thead><tr><th scope="col">Art von Variable</th><th scope="col">Beispiel aus diesem Kapitel</th><th scope="col">kontrollieren?</th></tr></thead>
        <tbody>
          <tr><td>gemeinsame Ursache: steht vor beiden fest</td><td>das Alter, wenn du fragst, wie Gesundheit und Lebenszufriedenheit zusammenhängen</td><td>ja</td></tr>
          <tr><td>Folge oder Zwischenschritt</td><td>Gesundheit beim Alter</td><td>nur, wenn du genau nach „bei gleicher …“ fragst; dann so berichten</td></tr>
          <tr><td>misst sehr Ähnliches wie die abhängige Variable oder ist eher ihre Folge</td><td>Vertrauen in den Bundestag, wenn du nach der Ost-West-Lücke in der Demokratiezufriedenheit fragst (der enge Zusammenhang der beiden: Sitzung 9)</td><td>nein, es rechnet einen Teil dessen heraus, was du messen willst</td></tr>
          <tr><td>misst fast dasselbe wie ein anderer Prädiktor</td><td>Alter und Altersgruppe</td><td>nein, einen weglassen oder Index bilden</td></tr>
        </tbody>
      </table>
      <p className="absatz">Bei jeder Kontrolle gehört in den Bericht: was konstant gehalten wurde, und was das B dann bedeutet.</p>
    </Card>
    <Card id="u3" step="Ü3" title="Voraussetzungen: was jede multiple Regression braucht">
      <table className="daten voll">
        <caption className="sr-only">Voraussetzungen der multiplen Regression</caption>
        <thead><tr><th scope="col">Voraussetzung</th><th scope="col">So prüfst du</th><th scope="col">Wo im Kapitel</th></tr></thead>
        <tbody>
          <tr><td>abhängige Variable metrisch oder mit vielen Stufen</td><td>Skalenniveau, Codebuch</td><td>Sitzung 9</td></tr>
          <tr><td>linearer Zusammenhang je Prädiktor</td><td>Mittelwerte je Stufe, Punktwolke</td><td>Sitzung 9</td></tr>
          <tr><td>gleiche Fehlervarianz</td><td>Residuen je Stufe, <code>levene_test()</code></td><td>Sitzung 9</td></tr>
          <tr><td>keine starke Multikollinearität</td><td>VIF unter 10 (besser unter 5), keine Dummyfalle</td><td><a href="#v2c">Grundlage 2c</a>, <a href="#v3c">3c</a>, <a href="#a3">Aufgabe 3</a></td></tr>
          <tr><td>keine einzelnen Fälle mit großem Einfluss</td><td>Modell mit und ohne auffällige Fälle vergleichen</td><td><a href="#v4a">Grundlage 4a</a></td></tr>
          <tr><td>gleicher Zusammenhang für alle</td><td>sonst Interaktion ins Modell</td><td><a href="#v4b">Grundlage 4b</a>, <a href="#a4">Aufgabe 4</a></td></tr>
          <tr><td>genug Befragte je Gruppe und je Prädiktor</td><td>N, Gruppengrößen, korrigiertes R²</td><td><a href="#a2">Aufgabe 2</a>, <a href="#v3b">Grundlage 3b</a></td></tr>
          <tr><td>Aussagen über Deutschland</td><td>gewichtet rechnen</td><td>Sitzung 6</td></tr>
        </tbody>
      </table>
      <p className="absatz">Für alle gilt: Eine Regression zeigt Zusammenhänge. Ob etwas Ursache ist, entscheidet nicht die Zahl, sondern die Begründung, was vor was kommt und was fehlen könnte.</p>
    </Card>
    <Card id="u4" step="Ü4" title="So schreibst du einen Satz über ein B">
      <div className="box-gruen">
        <p className="box-notiz">„Bei gleicher/gleichem [kontrollierte Prädiktoren] geht [ein Schritt im Prädiktor] mit [B] Punkten mehr/weniger [abhängige Variable] einher.“</p>
        <p className="box-notiz">Für Dummies: „[Gruppe] liegt im Mittel [B] Punkte über/unter [Referenzgruppe], bei gleicher/gleichem [Kontrollen].“</p>
      </div>
      <p className="absatz">Beispiel aus Grundlage 1: „Bei gleicher Gesundheit geht ein Jahr mehr Alter mit 0,024 Punkten mehr Lebenszufriedenheit einher; zehn Jahre mit 0,24 Punkten.“</p>
      <Mixup>„einhergehen“ ist kein umständliches Wort für „bewirken“. Es sagt genau, was die Regression zeigt: Wer höhere Werte hat, hat im Mittel auch höhere Vorhersagen.</Mixup>
    </Card>
  </Foundation>;
}
