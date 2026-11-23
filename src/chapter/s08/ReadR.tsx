// Sitzung 8 „Index und Skala“: Vorweg R lesen (#r1 Startblock und Umpolen, #r2 ein Wert je Person und die Stimmigkeit), Plan Abschnitt 3.
import { Badge, Card, InShort, Known, Mixup, MoreDetail } from '../blocks/Card';
import { ALT } from './content';
import { Workshop } from './Workshop';

/** Vorweg: R lesen, two cards (h4): #r1 and #r2. */
export function ReadR() {
  return <>
    <Card id="r1" stone="R" title="Startblock und Umpolen: kennst du schon"
      badge={<><Known session={1} what="Startblock" /><Known session={5} what="mutate() und rec()" /></>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">Den Startblock kennst du aus Sitzung 1: Er lädt die Werkzeuge und legt den ALLBUS unter dem Namen <code>allbus</code> ab. In RStudio führst du ihn zu Beginn aus. In der Code-Werkstatt hier auf der Seite ist das schon erledigt.</p>
      <Workshop k="start" />
      <p className="hilfe-zeile">Rote Zeilen beim Laden, etwa „Attaching core tidyverse packages“, sind normal und kein Fehler. Öffne RStudio über dein Projekt. Findet R die Datei nicht, nimm wie in Sitzung 1 <code>allbus &lt;- read_spss(file.choose())</code>.</p>
      <p style={{ margin: '16px 0 0' }}>In Sitzung 5 hast du mit <code>mutate()</code> und <code>rec()</code> neue Variablen gebaut. Eine Regel davon brauchst du heute oft: <code>rules = "rev"</code> dreht eine Skala um. Aus der kleinsten Zahl wird die größte und umgekehrt; die Wörter wandern mit. Führe die Vorlage aus: Bei Code 1 steht jetzt STIMME GAR NICHT ZU.</p>
      <Workshop k="r_rev" live />
      <p className="hilfe-zeile">Ausgabe zur Kontrolle (Auszug): Code 1 STIMME GAR NICHT ZU 1098; Code 4 STIMME VOLL ZU 366 (vorher Code 1). Das Variablenlabel trägt den Zusatz <code>(recoded)</code>.</p>
      <p style={{ margin: '16px 0 0' }}>Wie in Sitzung 5 steht <code>mutate()</code> direkt in der Kette: Es baut die neue Variable, und die nächste Zeile benutzt sie sofort. So läuft jede Vorlage für sich. In RStudio bleibt die neue Variable danach nicht im Datensatz. Willst du sie behalten, legst du das Ergebnis wie in Sitzung 5 wieder unter <code>allbus</code> ab: <code>allbus &lt;- allbus %&gt;% mutate(…)</code>.</p>
      <InShort><code>mutate()</code> stellt neue Türme auf die Bauplatte, <code>rec(x, rules = "rev")</code> baut einen umgedrehten Turm. In einer Kette benutzt die nächste Zeile ihn gleich weiter.</InShort>
      <Mixup>Umpolen ändert nicht die Meinung der Befragten, nur die Zahl, die für sie steht. Aus STIMME VOLL ZU wird nicht „stimme nicht zu“; das Wort bleibt, nur sein Code wechselt von 1 auf 4.</Mixup>
    </Card>

    <Card id="r2" stone="R" title="Neu heute: ein Wert je Person und die Stimmigkeit"
      badge={<><Badge>row_means(), pick(), reliability(): neu heute</Badge><Known session={6} what="describe() mit Gewicht" /><Known session={7} what="summary()" /></>}
      tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">Bisher hat jede Funktion einen Turm angeschaut: <code>describe(age)</code> fasst alle Werte einer Variable zusammen. Heute rechnest du quer dazu, innerhalb einer Person. <code>row_means()</code> nimmt aus jeder Reihe der Bauplatte die Antworten auf mehrere Fragen und bildet ihren Mittelwert. So entsteht ein neuer Turm mit einem Wert je Person.</p>
      <div className="lesehilfe" role="img" aria-label={ALT.zeileR2}>
        <span><b style={{ background: '#E5E9EE' }}>fluechtlinge =</b><small>neuer Name</small></span>
        <span><b style={{ background: 'var(--gruenh)' }}>row_means(</b><small>Funktion: Mittelwert je Reihe</small></span>
        <span><b style={{ background: '#FFE3D2' }}>pick(mp16, mp17, mp18, mp19)</b><small>welche Türme</small></span>
        <span><b style={{ background: 'var(--gelbh)' }}>, min_valid = 3</b><small>mindestens so viele gültige Antworten</small></span>
        <span><b style={{ background: 'var(--gruenh)' }}>)</b><small>{' '}</small></span>
      </div>
      <p className="hilfe-zeile">Nimm für jede Person die Antworten auf mp16 bis mp19 und bilde ihren Mittelwert, aber nur, wenn mindestens drei davon gültig sind. Sonst bleibt der Wert leer (NA).</p>
      <Workshop k="r_rowmeans" live />
      <p className="hilfe-zeile">Ausgabe zur Kontrolle (gewichtet; Mean, Median, SD, Range, IQR, Skewness, N, Missing): <code className="s8-roh">fluechtlinge  2.457   2.500  0.838  4.000  1.000     0.094  3473     1773</code></p>
      <p style={{ margin: '16px 0 0' }}><code>reliability()</code> prüft, ob mehrere Fragen stimmig dasselbe messen. Kurz gibt es eine Zeile mit Cronbachs α; mit <code>summary()</code> bekommst du eine Tabelle mit einer Zeile je Frage. Was die Zahlen bedeuten, lernst du in <a href="#g2">Grundlage 2</a>.</p>
      <Workshop k="r_reliability" live />
      <p className="hilfe-zeile">Ausgabe zur Kontrolle (kurz): <code>Cronbach's Alpha = 0.726 (Acceptable), McDonald's Omega = 0.733, N = 3521</code></p>
      <InShort><code>row_means(pick(…), min_valid = …)</code> steht in <code>mutate()</code> und bildet einen Mittelwert je Person. <code>pick()</code> wählt die Türme aus, <code>min_valid</code> sagt, wie viele gültige Antworten jemand mindestens braucht. <code>reliability()</code> misst, wie stimmig die Fragen zusammen sind.</InShort>
      <MoreDetail summary="Wie R diese Ausgaben schreibt">
        <ul>
          <li><code>describe()</code> mit Gewicht zählt bei N die Gewichte zusammen (kennst du aus Sitzung 6). Darum steht dort 3473, obwohl 3.482 Personen einen Wert haben. Wie viele Personen einen Wert bekommen, siehst du ohne Gewicht.</li>
          <li><code>reliability()</code> rechnet nur mit Befragten, die alle genannten Fragen beantwortet haben (N listwise). Darum ist N dort oft kleiner als bei einer einzelnen Frage.</li>
          <li>Neben α steht ein Wort: Excellent, Good, Acceptable, Questionable oder Poor. Das ist die Faustregel, mit der mariposa α einstuft (<a href="#v2c">Grundlage 2c</a>).</li>
          <li>Mehr dazu im R-Workshop, Kapitel 5 (Skalen bilden mit <code>row_means</code>) und Kapitel 8 (<code>reliability</code>).</li>
        </ul>
      </MoreDetail>
      <Mixup><code>row_means(mp16, mp17)</code> ohne <code>pick()</code>: R meldet „<code>data</code> must be a data frame or tibble“. Die Fragen gehören in <code>pick()</code>, und <code>pick()</code> funktioniert nur in <code>mutate()</code>.</Mixup>
    </Card>
  </>;
}
