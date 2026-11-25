// Sitzung 10 „Regression vertiefen“: Vorweg R lesen (#r1 Modell mit mehreren Prädiktoren, #r2 Ausgabe von summary(), #r3 to_dummy()).
import { Badge, Card, InShort, Known, Mixup, MoreDetail } from '../blocks/Card';
import { Begriff } from '../Begriff';
import { MSTAT_1_FREQ } from './content';
import { FormulaLine } from './figures/Formulas';
import { OutputReader } from './figures/Output';
import { Workshop } from './Workshop';

/** Vorweg: R lesen, three cards (h4). */
export function ReadR() {
  return <>
    <Card id="r1" stone="R" title="Ein Modell mit mehreren Prädiktoren"
      badge={<><Known session={1} what="Startblock" /> <Known session={9} what="linear_regression() und summary()" /> <Badge>mehrere Prädiktoren: neu heute</Badge></>}
      tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">Den Startblock kennst du aus Sitzung 1. In RStudio führst du ihn zu Beginn aus. In der Code-Werkstatt hier auf der Seite ist das schon erledigt, und jede Werkstatt beginnt mit dem frisch geladenen <code>allbus</code>. Darum bildet jede Vorlage die Variablen, die sie braucht, selbst.</p>
      <Workshop k="start" />
      <p className="hilfe-zeile">Rote Zeilen beim Laden, etwa „Attaching core tidyverse packages“, sind normal und kein Fehler. Findet R die Datei nicht, nimm wie in Sitzung 1 <code>allbus &lt;- read_spss(file.choose())</code>.</p>
      <p className="absatz">In Sitzung 9 stand rechts vom <code>~</code> ein Prädiktor. Heute stehen dort mehrere, verbunden mit <code>+</code>. So liest du die Formel: links, was vorhergesagt wird, rechts, woraus.</p>
      <FormulaLine />
      <p className="hilfe-zeile">Sag die Lebenszufriedenheit aus Alter und Gesundheit vorher, gewichtet.</p>
      <Workshop k="r_modell" live />
      <p className="absatz"><code>hs01</code> zählt von 1 „sehr gut“ bis 5 „schlecht“. Umgepolt heißt <code>gesund</code> 5 „sehr gut“ und 1 „schlecht“, damit eine höhere Zahl „gesünder“ heißt (<Begriff id="umpolen">umpolen</Begriff> kennst du aus Sitzung 5).</p>
      <InShort>In der Formel steht links vom <code>~</code> die <Begriff id="abhaengige-variable">abhängige Variable</Begriff> (AV), rechts stehen die Prädiktoren, verbunden mit <code>+</code>. <Begriff id="praediktor">Prädiktor</Begriff> ist ein anderes Wort für <Begriff id="unabhaengige-variable">unabhängige Variable</Begriff> (Prädiktor kennst du aus Sitzung 9, AV und UV aus Sitzung 5). Jeder Prädiktor bekommt in der Ausgabe eine eigene Zeile mit seinem B.</InShort>
      <MoreDetail summary="Plus in der Formel und Plus bei ggplot">
        <ul>
          <li>Das <code>+</code> in der Formel heißt „und dieser Prädiktor auch“. Es rechnet nichts zusammen. Mit dem <code>+</code> zwischen ggplot-Schichten aus Sitzung 4 hat es nur das Zeichen gemeinsam.</li>
          <li>Die Reihenfolge der Prädiktoren ändert an den Zahlen nichts. <code>ls01 ~ gesund + age</code> ergibt dieselben B wie <code>ls01 ~ age + gesund</code>.</li>
          <li>In <a href="#a4">Aufgabe 4</a> (Zusatz) kommt <code>*</code> statt <code>+</code> vor. Das heißt: beide Prädiktoren und dazu ihre Interaktion. Was das ist, steht in <a href="#g4">Grundlage 4</a>.</li>
          <li>Mehr dazu im R-Workshop, Kapitel 9.4 (Multiple lineare Regression).</li>
        </ul>
      </MoreDetail>
      <Mixup>Komma statt Plus. <code>linear_regression(demo ~ lage, dlage, weights = wghtpew)</code> gibt keinen Fehler, aber R rechnet still das Modell nur mit <code>lage</code>. Prüf in der Ausgabe die Zeile „Formula“: Dort muss jeder Prädiktor stehen.</Mixup>
    </Card>

    <Card id="r2" stone="R" title="Die Ausgabe von summary() lesen"
      badge={<><Known session={9} what="Model Summary, B, Beta, Konstante, Adjusted R Square" /> <Badge>Adjusted R Square wichtig ab heute</Badge> <Badge>Collinearity Statistics (VIF): neu heute</Badge></>}
      tag={{ kind: 'picture', label: 'Im Bild' }}>
      <p className="lead">Die Ausgabe ist lang. Heute brauchst du drei Blöcke. Wähl einen Block und lies, was darin steht.</p>
      <OutputReader />
      <InShort>Für ein Modell mit mehreren Prädiktoren liest du drei Blöcke: <b>Model Summary</b> (R² und korrigiertes R²), <b>Coefficients</b> (B, Beta, Sig., Konfidenzintervall je Prädiktor) und <b>Collinearity Statistics</b> (VIF). Im Kopf prüfst du Formel, Gewicht und N.</InShort>
      <MoreDetail summary="Warum N kleiner ist als bei einer Variable allein">
        <p>Im Modell zählt nur, wer bei allen Variablen der Formel einen gültigen Wert hat. Fehlt einer Person die Gesundheit, fällt sie ganz heraus. Darum kann N von Modell zu Modell schwanken, wenn du Prädiktoren hinzunimmst. Das nennt man <Begriff id="ausschluss">fallweisen Ausschluss</Begriff> (listwise).</p>
      </MoreDetail>
      <Mixup>Descriptive Statistics zeigt Mittelwerte und Standardabweichungen der Variablen, nicht die Ergebnisse des Modells. B und Beta stehen erst unter Coefficients.</Mixup>
    </Card>

    <Card id="r3" stone="R" title="Neu: to_dummy()" badge={<Badge>to_dummy(): neu heute</Badge>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead"><code>to_dummy()</code> macht aus einer Variable mit Gruppen für jede Gruppe eine eigene 0/1-Variable. Aus dem Familienstand <code>mstat</code> mit fünf Gruppen werden <code>mstat_1</code> bis <code>mstat_5</code>: Die Zahl hinter dem Unterstrich ist der Code der Gruppe. <code>mstat_1</code> ist 1 für alle Verheirateten (Code 1) und 0 für alle anderen. Was das für die Regression bedeutet, zeigt <a href="#g2">Grundlage 2</a>.</p>
      <Workshop k="r_dummy" live />
      <p className="hilfe-zeile">{`Zur Kontrolle: Zeile 0 mit N ${MSTAT_1_FREQ.zero.n} und Valid % ${MSTAT_1_FREQ.zero.valid.toFixed(2)}, Zeile 1 mit N ${MSTAT_1_FREQ.one.n} und Valid % ${MSTAT_1_FREQ.one.valid.toFixed(2)}; „System“ ${MSTAT_1_FREQ.system} (Befragte ohne Familienstand bekommen auch bei den Dummies keinen Wert).`}</p>
      <InShort><code>to_dummy(mstat)</code> hängt an die Daten für jede Gruppe eine 0/1-Variable an: 1 heißt „gehört zu dieser Gruppe“, 0 heißt „gehört nicht dazu“. Die Namen sind Variable, Unterstrich, Code.</InShort>
      <MoreDetail summary="to_dummy() in der Pipe">
        <p><code>to_dummy()</code> steht direkt in der <Begriff id="pipe">Pipe</Begriff>, ohne <code>mutate()</code>, wie <code>to_label()</code> aus Sitzung 4. Danach kannst du die neuen Variablen in derselben Pipe benutzen, etwa in der Formel von <code>linear_regression()</code>. Welcher Code welche Gruppe ist, steht im <Begriff id="codebuch">Codebuch</Begriff> oder in <code>frequency(mstat)</code>. Mehr im R-Workshop, Kapitel 9.3 (Dummy-Codierung).</p>
      </MoreDetail>
      <Mixup><code>mstat_1</code> heißt nicht „die erste Zeile“ oder „die erste Person“, sondern „Gruppe mit dem Code 1“. Bei <code>dg03</code> in Aufgabe 2 ist <code>dg03_4</code> die Gruppe mit dem Code 4.</Mixup>
    </Card>
  </>;
}
