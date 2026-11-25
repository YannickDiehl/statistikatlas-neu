// Sitzung 6 „Gewichtung und Zusammenhang“: die vier Grundlagen und der Überblick aus sitzung06.md, ohne R-Code.
import type { ReactNode } from 'react';
import { Badge, Card, InShort, Known, Mixup, MoreDetail } from '../blocks/Card';
import { Foundation } from '../blocks/Foundation';
import { MapLink } from '../blocks/MapLink';
import { Questions } from '../blocks/Questions';
import type { Question } from '../answers';
import { THINK } from './content';
import { ChiBricks, Expected, StrengthRuler } from './figures/Crosstab';
import { OutlierRuler, PointLab, RBricks, ThirdVariable } from './figures/Correlation';
import { FiveMeasures, MeasureAssignment, MeasureTree } from './figures/Overview';
import { Direction, GammaBricks, LayerStack, PairCounter } from './figures/Pairs';
import { EstimateEast, MixingDesk, WeightBricks } from './figures/Weighting';

/** „Kurz überlegen“ with one question of THINK. */
function Think({ q }: { q: Question }) {
  return <div className="kurzueberlegen">
    <p>Kurz überlegen</p>
    <Questions id={`${q.id}-q`} questions={[q]} />
  </div>;
}


/** Grundlage 1: Gewichtung (1a Ost-Überquote, 1b Gewicht als Bruch, 1c Mischpult). */
export function Foundation1() {
  return <Foundation id="g1" n={1} title="Gewichtung" taskHref="#a1"
    intro="Warum zählt im ALLBUS nicht jede Person gleich, und was ändert das? Drei kurze Schritte, etwa 12 Minuten.">

    <Card id="k1a" step="1a" title="Der Osten ist absichtlich stärker vertreten" tag={{ kind: 'estimate', label: 'Schätzen' }}>
      <p className="lead">Der ALLBUS 2023 hat 5.246 Menschen befragt. In Deutschland wohnen knapp 17 von 100 Erwachsenen in den neuen Bundesländern (mit Ost-Berlin). Bevor du die Daten siehst: Wie viele von 100 Befragten im ALLBUS wohnen im Osten?</p>
      <EstimateEast />
      <InShort>Der ALLBUS befragt Menschen im Osten absichtlich häufiger, als es ihrem Anteil an der Bevölkerung entspricht. Fachbegriff: <b>disproportionale Stichprobe</b>. Für Aussagen über ganz Deutschland gleicht man das aus: Man <b>gewichtet</b>.</InShort>
      <MoreDetail summary="Warum befragt man den Osten stärker?">
        <p>Mit nur 17 von 100 kämen im ALLBUS knapp 900 Ostdeutsche zusammen. Für Aussagen über den Osten allein, etwa getrennt nach Alter oder Bildung, wäre das schnell zu wenig. Darum befragt der ALLBUS dort mehr Menschen. Der Preis: Wer alle Befragten einfach zusammenzählt, holt den Osten fast doppelt so stark ins Bild, wie er in Deutschland ist.</p>
      </MoreDetail>
      <Mixup>Die disproportionale Stichprobe ist kein Fehler, sondern geplant. Das Gewicht repariert keinen Fehler, es gleicht einen bekannten Plan aus.</Mixup>
    </Card>

    <Card id="k1b" step="1b" title="Formel lesen lernen: Wie groß ist ein Gewicht?" tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Im Westen wohnen 83,16 % der Bevölkerung, aber nur 67,99 % der Befragten. Im Osten ist es umgekehrt: 16,84 % der Bevölkerung, 32,01 % der Befragten.</p>
      <WeightBricks />
      <Think q={THINK.g1b} />
      <InShort>Ein Gewicht sagt, wie stark eine Person zählt. Fachbegriff: <b>Designgewicht</b>, im ALLBUS die Variable <code>wghtpew</code> (personenbezogenes Ost-West-Gewicht). Unter 1 zählt eine Person weniger, über 1 mehr.</InShort>
      <MoreDetail summary="Wie sieht wghtpew im Datensatz aus?">
        <p>Jede befragte Person hat einen Wert in <code>wghtpew</code>. Im Westen liegt er zwischen 1,20 und 1,25, im Osten zwischen 0,50 und 0,55; je Landesteil gibt es drei leicht verschiedene Werte, weil der ALLBUS 2023 aus mehreren Teilen der Erhebung besteht. Im Mittel liegt <code>wghtpew</code> bei genau 1, darum bleibt die Gesamtzahl gleich (5.246). Mehr zum Ziehen von Stichproben in der freien Karte.</p>
      </MoreDetail>
      <MapLink concept="weights">Gewichte</MapLink>
      <Mixup>„Gewichtet zählen die Ostdeutschen weniger, also sind sie weniger wichtig.“ Nein: Sie zählen genau so viel, wie es ihrem Anteil an der Bevölkerung entspricht. Ungewichtet zählten sie fast doppelt.</Mixup>
    </Card>

    <Card id="k1c" step="1c" title="Was die Gewichtung am Ergebnis ändert" tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Wie viele Menschen gehören keiner Religionsgemeinschaft an (Konfession „keine“)? Im Westen sind es 33,7 %, im Osten 77,5 %. Zusammengezählt ohne Gewicht ergibt das 47,7 %, mit Gewicht 41,0 %.</p>
      <MixingDesk />
      <InShort>Gewichtung verschiebt ein Ergebnis für ganz Deutschland nur, wenn sich West und Ost unterscheiden. Je größer der Unterschied, desto mehr ändert sie. Innerhalb von West oder Ost ändert sie fast nichts.</InShort>
      <MoreDetail summary="Warum bleibt innerhalb der Landesteile alles gleich?">
        <p>Im Osten haben alle fast dasselbe Gewicht. Ob jede Person 1 oder 0,53 zählt, ändert den Anteil im Osten darum kaum: 77,4 % ohne, 77,5 % mit Gewicht. Gewichtung wirkt erst, wenn man West und Ost zusammenzählt, weil sich dann das Mischungsverhältnis ändert.</p>
        <p>Daraus folgt: Für einen Vergleich West gegen Ost brauchst du das Gewicht nicht; für eine Zahl über ganz Deutschland schon. <code>wghtpew</code> gleicht nur die Ost-West-Verteilung aus. Dass manche Gruppen seltener an Umfragen teilnehmen, gleicht es nicht aus.</p>
      </MoreDetail>
      <Mixup>„Gewichtet ist genauer, ungewichtet ist falsch.“ Beide Zahlen sind richtig gerechnet; sie beantworten verschiedene Fragen. Die ungewichtete Zahl beschreibt die Befragten, die gewichtete schätzt Deutschland.</Mixup>
    </Card>
  </Foundation>;
}

/** Grundlage 2: Zusammenhang in der Kreuztabelle (2a erwartet, 2b χ² zu Phi und V, 2c Stärke). */
export function Foundation2() {
  return <Foundation id="g2" n={2} title="Zusammenhang in der Kreuztabelle" taskHref="#a2"
    intro="Wann hängen zwei Merkmale zusammen, und wie macht man daraus eine Zahl? Drei Schritte, ein konstruiertes Beispiel mit 100 Befragten, das ungefähr wie Deutschland verteilt ist; etwa 15 Minuten.">

    <Card id="k2a" step="2a" title="Was wäre, wenn es keinen Zusammenhang gäbe?" badge={<Known session={5} what="Kreuztabelle und Zeilenprozente" />} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Zum Beispiel 100 Befragte: 80 aus dem Westen, 20 aus dem Osten. Im Westen gehören 28 keiner Konfession an (35 %), im Osten 16 (80 %). Insgesamt sind es 44 von 100.</p>
      <Think q={THINK.g2a} />
      <Expected />
      <InShort>Zwei Merkmale hängen zusammen, wenn die Verteilung des einen in den Gruppen des anderen verschieden ist. Ohne Zusammenhang (Fachbegriff: <b>statistische Unabhängigkeit</b>) hätte jede Gruppe dieselben Prozente wie alle zusammen; daraus ergeben sich die <b>erwarteten Häufigkeiten</b>.</InShort>
      <Mixup>Erwartete Häufigkeiten sind keine Vorhersage, wie es sein sollte. Sie sind ein Vergleichsbild: so sähe die Tabelle aus, wenn es keinen Zusammenhang gäbe.</Mixup>
    </Card>

    <Card id="k2b" step="2b" title="Formel lesen lernen: von χ² zu Phi und Cramér-V" badge={<Badge>χ²: kennst du aus Sitzung 5 (Überblick, als Test)</Badge>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">In Sitzung 5 stand neben χ² schon eine Zahl V. Heute siehst du, wie sie entsteht.</p>
      <ChiBricks />
      <InShort><b>χ²</b> misst, wie weit eine Kreuztabelle von „kein Zusammenhang“ entfernt ist. <b>Phi</b> (für Vierfeldertafeln) und <b>Cramér-V</b> (für Tabellen jeder Größe) machen daraus eine Zahl zwischen 0 und 1: 0 heißt kein Zusammenhang, 1 heißt vollständiger Zusammenhang. Für die Stärke zählt diese Zahl ohne Vorzeichen.</InShort>
      <MoreDetail summary="Warum teilt man durch n, und wozu die Klammer?">
        <p>χ² wächst mit der Zahl der Befragten: Mit 200 statt 100 Befragten und denselben Prozenten verdoppelt es sich auf 26,30, der Zusammenhang ist aber derselbe. Phi und V teilen durch n und bleiben bei 0,36. Die Klammer (kleinere Zahl von Zeilen und Spalten minus 1) sorgt bei größeren Tabellen dafür, dass V nicht über 1 steigt.</p>
        <p>Echte Zahlen für Deutschland (gewichtet): Phi für „keine Konfession ja/nein“ und Region 0,33; Cramér-V für vier Konfessionsgruppen (evangelisch, katholisch, andere, keine) und Region 0,34. Ohne Gewicht wären es 0,41 und 0,42: V hängt auch davon ab, wie groß die Gruppen sind, und ohne Gewicht ist der Osten fast doppelt so groß. Für Aussagen über Deutschland gilt der gewichtete Wert.</p>
        <p>Prozente zur Konfession (gewichtet): Westen 28,4 % evangelisch, 31,0 % katholisch, 7,0 % andere, 33,7 % keine; Osten 14,7 %, 4,7 %, 3,0 %, 77,5 %.</p>
      </MoreDetail>
      <MapLink concept="chi_square">χ² Schritt für Schritt</MapLink>
      <MapLink concept="cramers_v">Cramér-V</MapLink>
      <MoreDetail summary="Warum zeigt R bei Phi manchmal ein Minus?">
        <p>Aus χ² gerechnet ist Phi nie negativ. <code>phi()</code> in R rechnet bei einer Vierfeldertafel aber mit einer gleichwertigen Formel, die zusätzlich ein Vorzeichen liefert; der Wert liegt dann zwischen −1 und +1. Plus heißt: Der jeweils größere Code der einen Variable kommt häufiger mit dem größeren Code der anderen vor; Minus heißt: mit dem kleineren.</p>
        <p>Tauschst du die Codes einer Variable, dreht sich das Vorzeichen, die Stärke bleibt. Für die Stärke liest du darum den Betrag (−0,15 ist so stark wie 0,15); welche Gruppen zusammengehören, liest du an den Prozenten der Kreuztabelle ab. Cramér-V hat nie ein Vorzeichen; bei zwei mal zwei Kategorien ist V gleich dem Betrag von Phi.</p>
      </MoreDetail>
      <Mixup>„V = 0,36 heißt: 36 % hängen zusammen.“ V ist kein Prozentwert. Es sagt nur, wie stark die Tabelle von „kein Zusammenhang“ abweicht, auf einer Skala von 0 bis 1.</Mixup>
    </Card>

    <Card id="k2c" step="2c" title="Wie stark ist stark?" tag={{ kind: 'picture', label: 'Im Bild' }}>
      <StrengthRuler />
      <Think q={THINK.g2c} />
      <InShort>Für die Stärke gibt es eine <b>Faustregel</b> (nach Cohen): ab 0,1 schwach, ab 0,3 mittel, ab 0,5 stark. Sie gilt für Cramér-V, Phi, Tau-b, Spearman-ρ und Pearson-r.</InShort>
      <MoreDetail summary="Faustregel mit Augenmaß">
        <p>Die Grenzen sind eine Verabredung, kein Naturgesetz. Ob 0,2 „wenig“ ist, hängt von der Frage ab: In den Sozialwissenschaften sind viele wichtige Zusammenhänge schwach. Gamma fällt meist größer aus als die anderen Maße (Thema 3); ordne die Stärke deshalb mit Tau-b ein.</p>
        <p>Bei Cramér-V passt die Faustregel genau für Tabellen mit nur zwei Zeilen oder zwei Spalten (wie in Aufgabe 2); für größere Tabellen setzt Cohen die Grenzen etwas niedriger an. Dieselbe Faustregel steht im R-Workshop, Kapitel 7.</p>
      </MoreDetail>
      <Mixup>Ein großer Zusammenhang ist nicht automatisch ein wichtiger, und ein kleiner nicht automatisch unwichtig. Die Faustregel ordnet nur die Größe ein.</Mixup>
    </Card>
  </Foundation>;
}

/** Grundlage 3: Paare vergleichen (3a Paar-Zähler, 3b Gamma und Tau-b, 3c Richtung). */
export function Foundation3() {
  return <Foundation id="g3" n={3} title="Paare vergleichen" taskHref="#a3"
    intro="Wenn beide Merkmale eine Reihenfolge haben, kann man mehr sagen als „hängt zusammen“: in welche Richtung. Drei Schritte, etwa 15 Minuten.">

    <Card id="k3a" step="3a" title="Konkordant oder diskordant?" tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Zum Beispiel fünf Befragte, A bis E. Jede Person stuft ihre Schicht ein (1 Unterschicht, 2 Arbeiterschicht, 3 Mittelschicht, 4 obere Mittelschicht) und ihre Gesundheit (1 schlecht, 2 weniger gut, 3 zufriedenstellend, 4 gut). A: Schicht 1, Gesundheit 1. B: 2 und 3. C: 3 und 2. D: 3 und 4. E: 4 und 3.</p>
      <p className="hilfe-zeile">Wähle ein Paar und ordne es ein: konkordant (gleichläufig), diskordant (gegenläufig) oder Bindung (Gleichstand).</p>
      <PairCounter />
      <InShort>Gamma und Tau-b vergleichen Paare von Befragten. <b>Gleichläufig</b> (Fachbegriff: konkordant): Wer bei einem Merkmal höher liegt, liegt auch beim anderen höher. <b>Gegenläufig</b> (diskordant): umgekehrt. <b>Gleichstand</b> (Bindung): Beide liegen bei mindestens einem Merkmal gleich hoch.</InShort>
      <Mixup>„Gleichläufig“ heißt nicht „gleiche Werte“. B (2 und 3) und D (3 und 4) sind gleichläufig, obwohl keine Zahl gleich ist: D liegt bei beiden höher.</Mixup>
    </Card>

    <Card id="k3b" step="3b" title="Formel lesen lernen: Gamma und Tau-b" tag={{ kind: 'picture', label: 'Im Bild' }}>
      <GammaBricks />
      <Think q={THINK.g3b} />
      <InShort><b>Gamma</b> (Fachbegriff: Goodman-Kruskal-Gamma) und <b>Tau-b</b> (Kendall-Tau-b) reichen von −1 bis +1. Gamma lässt Paare mit Gleichstand weg, Tau-b zählt sie im Nenner mit. Darum ist Tau-b dem Betrag nach nie größer als Gamma, meist deutlich kleiner.</InShort>
      <MoreDetail summary="Echte Zahlen und warum Gleichstände so wichtig sind">
        <p>Bei Variablen mit wenigen Ausprägungen haben sehr viele Paare eine Bindung (einen Gleichstand): Von Tausenden Befragten mit „Mittelschicht“ liegt jedes Paar bei der Schicht gleich auf. Gamma übergeht all diese Paare und fällt deshalb groß aus.</p>
        <p>Im ALLBUS (gewichtet) hängen Schicht und Gesundheit so zusammen: Gamma 0,36, Tau-b 0,24, wenn die Gesundheit so gepolt ist, dass ein höherer Code „besser“ heißt (warum das fürs Vorzeichen wichtig ist, zeigt 3c). Unter denen, die sich der Unterschicht zurechnen, beurteilen 22,9 % ihre Gesundheit als gut oder sehr gut, in der Arbeiterschicht 45,3 %, in der Mittelschicht 58,9 %, in der oberen Mittelschicht 76,8 %, in der Oberschicht 72,6 % (nur 62 Befragte, gewichtet). Spearman-ρ passt ebenfalls zu geordneten Stufen; es kommt in Thema 4.</p>
        <LayerStack />
      </MoreDetail>
      <MapLink concept="goodman_gamma">Gamma</MapLink>
      <MapLink concept="kendall_tau">Tau-b</MapLink>
      <Mixup>„Gamma ist größer, also ist Gamma besser.“ Gamma ist nur großzügiger, weil es Gleichstände weglässt. Vergleiche nie Gamma des einen mit Tau-b des anderen Zusammenhangs.</Mixup>
    </Card>

    <Card id="k3c" step="3c" title="Richtung: Das Vorzeichen hängt an der Kodierung" tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">Im Datensatz heißt bei der Gesundheit (<code>hs01</code>) die 1 „sehr gut“ und die 5 „schlecht“: Ein höherer Code ist also eine schlechtere Gesundheit. Bei der Schicht (<code>id02</code>) heißt ein höherer Code eine höhere Schicht.</p>
      <Think q={THINK.g3c} />
      <Direction />
      <InShort>Der <b>Betrag</b> sagt, wie stark ein Zusammenhang ist; das <b>Vorzeichen</b> sagt, in welche Richtung. Positiv: Höhere Codes gehen mit höheren Codes einher. Negativ: Höhere Codes gehen mit niedrigeren einher. Was „höher“ inhaltlich heißt, steht im Codebuch. Damit Sätze leicht fallen, polt man Variablen oft um, sodass ein höherer Code „mehr“ oder „besser“ heißt (Umpolen kennst du aus Sitzung 5).</InShort>
      <MoreDetail summary="Gamma braucht eine sinnvolle Reihenfolge">
        <p>Bei nominalen Merkmalen ist jede Reihenfolge willkürlich, und Gamma hängt davon ab. Beispiel Konfession und Gesundheit (gewichtet): In der Reihenfolge evangelisch, katholisch, andere, keine ist Gamma 0,04; in der Reihenfolge keine, evangelisch, katholisch, andere 0,01; in der Reihenfolge katholisch, keine, andere, evangelisch −0,03. Cramér-V bleibt in allen drei Fällen 0,045. Darum gilt: Gamma und Tau-b nur, wenn beide Merkmale eine Reihenfolge haben.</p>
      </MoreDetail>
      <Mixup>„Negativ heißt schwach.“ Nein: −0,42 ist ein stärkerer Zusammenhang als +0,30. Für die Stärke zählt der Betrag.</Mixup>
    </Card>
  </Foundation>;
}

/** Grundlage 4: Streudiagramm, Ausreißer, Drittvariable (4a Punkte-Labor, 4b Ausreißer, 4c Drittvariable). */
export function Foundation4() {
  return <Foundation id="g4" n={4} title="Streudiagramm, Ausreißer, Drittvariable" taskHref="#a4"
    intro="Wie misst man einen Zusammenhang, wenn die Abstände zwischen den Werten etwas bedeuten, und wann täuscht die Zahl? Drei Schritte, etwa 15 Minuten.">

    <Card id="k4a" step="4a" title="Formel lesen lernen: Pearson-r im Punkte-Labor" tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Zum Beispiel acht Befragte mit ihrem Alter und den Minuten, die sie für einen Fragebogen gebraucht haben. A: 22 Jahre, 45 Minuten. B: 29, 50. C: 35, 48. D: 41, 60. E: 48, 58. F: 56, 66. G: 63, 70. H: 71, 75. Mittelwerte: 45,6 Jahre und 59 Minuten.</p>
      <p className="hilfe-zeile">Das gestrichelte Kreuz geht durch die Mittelwerte. Oben rechts und unten links liegen die Plus-Felder, oben links und unten rechts die Minus-Felder. Eine Gerade wird nicht gezeichnet (Regression kommt in Sitzung 9).</p>
      <Think q={THINK.g4a} />
      <PointLab />
      <RBricks />
      <InShort><b>Pearson-r</b> misst, wie gut sich Punkte an eine steigende oder fallende Gerade halten, von −1 bis +1. <b>Spearman-ρ</b> (gesprochen „rho“) macht dasselbe mit Rängen statt mit den Werten selbst. Darum verträgt ρ Ausreißer und passt auch zu geordneten Stufen.</InShort>
      <Mixup>„r = 0,97 heißt: Ältere brauchen 97 % länger.“ r ist keine Prozentzahl und keine Steigung. Es sagt nur, wie eng die Punkte an einer Geraden liegen.</Mixup>
    </Card>

    <Card id="k4b" step="4b" title="Ausreißer und Kurven: Pearson oder Spearman?" badge={<Badge>Bearbeitungsdauer xt10: kennst du aus Sitzung 4</Badge>} tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Brauchen ältere Befragte länger für den Fragebogen? In Sitzung 4 hast du gesehen: Einzelne Fragebögen lagen wochenlang herum, also Zehntausende Minuten, während die Hälfte nach gut einer Stunde fertig war (Median 65 Minuten). Mit allen Bögen ergibt Pearson-r 0,003 (gewichtet), Spearman-ρ 0,24. Nur mit Bögen bis 180 Minuten: r = 0,25, ρ = 0,27.</p>
      <OutlierRuler />
      <Think q={THINK.g4b} />
      <InShort>Pearson-r braucht metrische Variablen (oder viele Ausprägungen mit etwa gleichen Abständen), einen linearen Zusammenhang und keine extremen Ausreißer. Sonst nimmst du Spearman-ρ.</InShort>
      <MoreDetail summary="Was r nicht sieht">
        <p>r misst nur lineare Zusammenhänge. Steigt etwas erst an und fällt dann wieder (nichtlinear, im Bild ein Bogen), kann r nahe 0 liegen, obwohl ein deutlicher Zusammenhang besteht. Darum: erst das Streudiagramm ansehen, dann rechnen. Für die Stärke gilt dieselbe Faustregel wie in Grundlage 2c.</p>
        <p>In R rechnet <code>spearman_rho()</code> immer ohne Gewicht; mit <code>weights = wghtpew</code> kommt derselbe Wert heraus (hier 0,238). Für Aussagen über Deutschland ist das eine kleine Einschränkung, die du im Bericht nennst.</p>
      </MoreDetail>
      <MapLink concept="pearson">Pearson-Korrelation</MapLink>
      <MapLink concept="spearman">Spearman-Korrelation</MapLink>
      <Mixup>„r = 0 heißt: kein Zusammenhang.“ r = 0 heißt nur: kein linearer. Mit Ausreißern oder bei einem nichtlinearen Verlauf kann trotzdem einer da sein.</Mixup>
    </Card>

    <Card id="k4c" step="4c" title="Zusammenhang ist keine Ursache: die Drittvariable" badge={<Known session={5} what="Ein Zusammenhang ist keine Ursache" />} tag={{ kind: 'interpret', label: 'Deuten' }}>
      <p className="lead">Neu ist, wie man eine Drittvariable prüft. Wer privat das Internet nutzt, beurteilt die eigene Gesundheit deutlich öfter als gut oder sehr gut: 59,0 % gegen 24,0 % (gewichtet, Phi = 0,22). Macht das Internet gesund?</p>
      <Think q={THINK.g4c} />
      <ThirdVariable />
      <InShort>Eine <b>Drittvariable</b> kann zwei Merkmale zugleich beeinflussen. Fachbegriff: <b>Confounding</b>; die Drittvariable heißt dann Störvariable (englisch Confounder), weil sie als gemeinsame Ursache dahinterstecken kann. Dann hängen beide zusammen, auch wenn das eine das andere gar nicht bewirkt. Prüfen kannst du das, indem du den Zusammenhang innerhalb von Gruppen der Drittvariable rechnest.</InShort>
      <MoreDetail summary="Schrumpft, bleibt, kehrt sich um">
        <p>Rechnet man innerhalb der Gruppen einer Drittvariable, kann der Zusammenhang bleiben (dann erklärt sie ihn nicht), schrumpfen (sie erklärt einen Teil), verschwinden oder sich sogar umkehren. Hier schrumpft er, verschwindet aber nicht.</p>
        <p>Ob der Rest eine Ursache ist, zeigt auch das nicht: Vielleicht nutzen Gesunde eher das Internet als umgekehrt. Ein Zusammenhangsmaß sagt nie, was was bewirkt. In Aufgabe 4 prüfst du, ob ein Zusammenhang in West und Ost gleich stark ist.</p>
      </MoreDetail>
      <MapLink concept="confounding">Confounding</MapLink>
      <Mixup>„Wenn der Zusammenhang schrumpft, war er falsch.“ Er war richtig gemessen. Er sagt nur etwas anderes, als man zuerst dachte.</Mixup>
    </Card>
  </Foundation>;
}

/** Überblick: Welches Maß für welche Variablen? (Ü1 Baum und Zuordnen, Ü2 Voraussetzungen, Ü3 fünf Maße). */
export function Overview() {
  return <Foundation id="g5" n="✓" title="Maß wählen, Grenzen kennen" eyebrow="Überblick zu allen Aufgaben"
    intro="Alle vier Themen zusammen: welches Maß wann passt und was es nicht zeigt. Etwa 5 Minuten.">

    <Card id="u1-karte" step="Ü1" title="Das niedrigere Skalenniveau entscheidet" tag={{ kind: 'estimate', label: 'Zuordnen' }}>
      <MeasureTree />
      <MeasureAssignment />
      <InShort>Zähl zuerst nicht die Werte, sondern frag nach der Reihenfolge und den Abständen beider Variablen. Das niedrigere Skalenniveau entscheidet, welches Maß passt. Ein Maß für ein höheres Niveau darfst du nicht nehmen; eins für ein niedrigeres geht, verschenkt aber Information.</InShort>
    </Card>

    <Card id="u2-karte" step="Ü2" title="Voraussetzungen und Eigenheiten" tag={{ kind: 'picture', label: 'Tabelle' }}>
      <table className="daten voll">
        <caption className="sr-only">Voraussetzungen und Eigenheiten je Maß</caption>
        <thead><tr><th scope="col">Maß</th><th scope="col">braucht</th><th scope="col">Wertebereich</th><th scope="col">Richtung</th><th scope="col">in mariposa gewichtet</th><th scope="col">Vorsicht</th></tr></thead>
        <tbody>
          <tr><th scope="row">Cramér-V</th><td>nominal (oder mehr)</td><td>0 bis 1</td><td>nein</td><td>ja</td><td>Hängt auch von der Tabellengröße und den Gruppengrößen ab; Richtung aus den Prozenten lesen.</td></tr>
          <tr><th scope="row">Phi</th><td>zwei mal zwei Kategorien</td><td>0 bis 1; <code>phi()</code> in R zeigt ein Vorzeichen, −1 bis +1</td><td>nur über die Codes: welche Gruppen zusammen vorkommen</td><td>ja</td><td>Das Vorzeichen dreht sich, wenn man die Codes einer Variable tauscht; Stärke am Betrag lesen, die Gruppen an den Prozenten.</td></tr>
          <tr><th scope="row">Gamma</th><td>ordinal</td><td>−1 bis +1</td><td>ja</td><td>ja</td><td>Lässt Gleichstände weg und fällt deshalb größer aus; nur mit sinnvoller Reihenfolge.</td></tr>
          <tr><th scope="row">Tau-b</th><td>ordinal</td><td>−1 bis +1</td><td>ja</td><td>ja</td><td>Zählt Gleichstände mit; gut zum Einordnen der Stärke.</td></tr>
          <tr><th scope="row">Spearman-ρ</th><td>ordinal oder metrisch</td><td>−1 bis +1</td><td>ja</td><td>nein, rechnet immer ohne Gewicht</td><td>Robust gegen Ausreißer.</td></tr>
          <tr><th scope="row">Pearson-r</th><td>metrisch</td><td>−1 bis +1</td><td>ja</td><td>ja</td><td>Nur geradlinige Zusammenhänge; Ausreißer verzerren.</td></tr>
        </tbody>
      </table>
      <p className="box-notiz">Für alle gilt: Für Aussagen über Deutschland gewichtet rechnen und „gewichtet“ dazuschreiben; n nennen; ein Zusammenhang ist keine Ursache.</p>
    </Card>

    <Card id="u3-karte" step="Ü3" title="Dieselben Daten, fünf Maße" tag={{ kind: 'picture', label: 'Im Bild' }}>
      <FiveMeasures />
      <InShort>Für dieselben Daten liefern die Maße verschiedene Zahlen, weil sie Verschiedenes messen. Vergleiche Zusammenhänge darum nur mit demselben Maß; V hat zudem kein Vorzeichen.</InShort>
      <Mixup>„Die Wirtschaftslage hängt mit Gamma 0,54 stärker mit der Demokratie zusammen als die Wahlabsicht mit V 0,48.“ Gamma und V sind verschiedene Maßstäbe; so lässt sich das nicht vergleichen.</Mixup>
    </Card>
  </Foundation>;
}
