// Sitzung 11 „Logistische Regression“: Vorweg R lesen (#r1 ein logistisches Modell, #r2 vier neue Werkzeuge), aus sitzung11.md §3.
import { Badge, Card, InShort, Known, Mixup, MoreDetail } from '../blocks/Card';
import { Workshop } from './ui';

export const R1_LINE_TEXT = 'smartphone, Name für das Modell. Pfeil, ablegen unter diesem Namen. allbus, die Daten, und dann. logistic_regression, die Funktion: logistisches Modell. lm30, erklärt wird: 0 oder 1. Tilde, erklärt durch. age, der Prädiktor. Komma weights gleich wghtpew, gewichtet.';

/** Vorweg: R lesen, two cards (h4): #r1 and #r2. */
export function ReadR() {
  return <>
    <Card id="r1" stone="R" title="R lesen: ein logistisches Modell"
      badge={<><Known session={1} what="Startblock" /><Known session={9} what="Modell wie linear_regression()" /><Badge>logistic_regression(): neu heute</Badge></>}
      tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">Den Startblock kennst du aus Sitzung 1. In RStudio führst du ihn zu Beginn aus. In der Code-Werkstatt hier auf der Seite ist das schon erledigt; dort wird <code>allbus</code> vor jedem Ausführen frisch geladen. Darum bildet jede Vorlage die Variablen, die sie braucht, selbst.</p>
      <Workshop k="start" />
      <p className="hilfe-zeile">Rote Zeilen beim Laden, etwa „Attaching core tidyverse packages“, sind normal und kein Fehler. Findet R die Datei nicht, nimm wie in Sitzung 1 <code>allbus &lt;- read_spss(file.choose())</code>.</p>
      <p style={{ margin: '16px 0 0' }}>Ein logistisches Modell schreibst du genau wie eine lineare Regression aus Sitzung 9: links von <code>~</code> steht, was erklärt wird, rechts, womit. Neu ist nur der Name der Funktion. Das Beispiel kennst du aus den Grundlagen: Gehen Menschen mit dem Smartphone ins Internet (<code>lm30</code>, 1 = genannt, 0 = nicht genannt), je nach Alter (<code>age</code>)?</p>
      <div className="lesehilfe" role="img" aria-label={R1_LINE_TEXT}>
        <span><b style={{ background: '#E5E9EE' }}>smartphone &lt;-</b><small>Name für das Modell</small></span>
        <span><b style={{ background: 'var(--gelbh)' }}>allbus %&gt;%</b><small>Daten, und dann</small></span>
        <span><b style={{ background: 'var(--gruenh)' }}>logistic_regression(</b><small>Funktion: logistisches Modell</small></span>
        <span><b style={{ background: '#FFE3D2' }}>lm30</b><small>erklärt wird: 0 oder 1</small></span>
        <span><b style={{ background: 'var(--lilah)' }}>~</b><small>„erklärt durch“</small></span>
        <span><b style={{ background: '#FFE3D2' }}>age</b><small>Prädiktor</small></span>
        <span><b style={{ background: 'var(--gruenh)' }}>, weights = wghtpew)</b><small>gewichtet</small></span>
      </div>
      <p className="hilfe-zeile">Nimm allbus, und dann schätz ein logistisches Modell für lm30, erklärt durch das Alter, gewichtet, und leg es unter dem Namen smartphone ab.</p>
      <Workshop k="r_modell" live />
      <p className="hilfe-zeile">Ausgabe der Kurzzeile zur Kontrolle: <code>Nagelkerke R2 = 0.203, chi2(1) = 453.95, p &lt; 0.001 ***, Accuracy = 91.4%, N = 4813</code></p>
      <InShort><code>logistic_regression()</code> schätzt ein Modell für eine Variable mit 0 und 1. Aufgebaut ist es wie <code>linear_regression()</code>. Mit <code>summary()</code> siehst du alle Tabellen; was darin steht, lernst du in den Grundlagen 2 und 4.</InShort>
      <MoreDetail summary="Was die ersten Zeilen der Ausgabe sagen">
        <ul>
          <li><code>[P(lm30 = GENANNT)]</code> sagt, wofür das Modell eine Wahrscheinlichkeit schätzt: für die 1, hier „Smartphone genannt“. Unter „Dependent Variable Encoding“ steht dasselbe als Tabelle.</li>
          <li><code>Note: labelled predictor age entered with its numeric codes</code> ist kein Fehler. R rechnet mit den Zahlen der Variable, hier den Lebensjahren. Bei Skalen wie „stimme voll zu“ bis „stimme gar nicht zu“ heißt das: R behandelt die Stufen 1, 2, 3, 4 wie gleich weit auseinander (mehr dazu in den Voraussetzungen im <a href="#ueberblick">Überblick</a>).</li>
          <li><code>N: 4813</code> ist gewichtet, also die Summe der Gewichte. Gezählt stecken 4.777 Personen im Modell: alle Internetnutzenden mit gültiger Antwort bei <code>lm30</code> und beim Alter (<code>lm30</code> wird nur Internetnutzenden gestellt, die übrigen haben TNZ: FILTER, kennst du aus Sitzung 1). Alle Zahlen dieses Modells gelten darum nur für Menschen, die das Internet nutzen.</li>
          <li>Mehr dazu im R-Workshop, Kapitel 9.8 (Logistische Regression).</li>
        </ul>
      </MoreDetail>
      <Mixup><code>logistic_regression()</code> mit einer Variable, die mehr als zwei Werte hat, etwa <code>pv01</code> mit allen Parteien. R meldet dann „must be binary“. Erst mit <code>rec()</code> eine 0/1-Variable bilden.</Mixup>
    </Card>

    <Card id="r2" stone="R" title="Vier neue Werkzeuge" badge={<Badge>exp(), tibble(), predict(), marginal_effects(): neu heute</Badge>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">Mit vier kleinen Werkzeugen übersetzt du ein Modell in Zahlen, die man versteht. Führe jede Vorlage einmal aus. Was die Zahlen bedeuten, lernst du in den Grundlagen 2 und 3.</p>
      <ol className="s11-werkzeuge">
        <li><p><code>exp()</code> rechnet „e hoch eine Zahl“ (e ist ungefähr 2,718). Damit wird aus B die Zahl Exp(B) und aus einem Logit eine Chance.</p>
          <Workshop k="r_exp" live />
          <p className="hilfe-zeile">Ausgabe zur Kontrolle: <code>[1] 0.9268162</code>, in der Modellausgabe gerundet <code>0.927</code>.</p></li>
        <li><p><code>tibble()</code> baut eine kleine Tabelle von Hand, zum Beispiel Beispielpersonen. <code>c()</code> zählt die Werte einer Spalte auf, einen je Person. <code>predict()</code> sagt für diese Personen vorher, wie wahrscheinlich bei ihnen eine 1 ist. Wichtig ist <code>type = "response"</code>: Ohne dieses Argument bekommst du Logits statt Wahrscheinlichkeiten.</p>
          <Workshop k="r_predict" live />
          <p className="hilfe-zeile">Ausgabe zur Kontrolle: <code>0.9890025 0.6698802</code> (über den Zahlen stehen 1 und 2: die erste und die zweite Person). R zeigt Anteile: 0.989 heißt 98,9 %.</p></li>
        <li><p><code>marginal_effects()</code> rechnet den durchschnittlichen marginalen Effekt (AME): um wie viel sich die Wahrscheinlichkeit je Einheit im Mittel ändert. <code>summary()</code> zeigt ihn in der Spalte AME. Das Modell steht hier direkt in der Kette: erst schätzen, dann den AME, dann die Tabelle.</p>
          <Workshop k="r_ame" live />
          <p className="hilfe-zeile">Ausgabe zur Kontrolle: Zeile <code>age  -0.005  3.04e-04  -17.529  &lt;.001  -0.006  -0.005  ***</code>.</p></li>
      </ol>
      <InShort><code>exp()</code> übersetzt in Chancen, <code>tibble()</code> mit <code>c()</code> baut Beispielpersonen, <code>predict(…, type = "response")</code> gibt ihre Wahrscheinlichkeiten, <code>marginal_effects()</code> den mittleren Effekt in Prozentpunkten.</InShort>
      <MoreDetail summary="Wie R diese Zahlen schreibt">
        <ul>
          <li><code>3.04e-04</code> heißt 3,04 mal 10 hoch −4, also 0,000304. R schreibt sehr kleine Zahlen so.</li>
          <li>Der AME ist ein Anteil: −0.005 heißt −0,5 Prozentpunkte je Lebensjahr.</li>
          <li>In <code>tibble()</code> braucht jede Spalte gleich viele Werte. Zwei Personen heißt: in jedem <code>c()</code> zwei Zahlen. Die Spalten heißen genau wie die Prädiktoren im Modell (hier <code>age</code>).</li>
          <li>Unter der AME-Tabelle steht „Factor rows show the average discrete change vs. the reference level.“ Das betrifft nur Prädiktoren, die als Gruppen ins Modell gehen (mit <code>to_label()</code>). Hier gibt es keine; du kannst den Satz überspringen.</li>
        </ul>
      </MoreDetail>
      <Mixup><code>predict()</code> ohne <code>type = "response"</code>. Dann steht bei der 30-Jährigen 4.499 statt 0.989: Das ist ihr Logit, keine Wahrscheinlichkeit.</Mixup>
    </Card>
  </>;
}
