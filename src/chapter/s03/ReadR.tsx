// Sitzung 3 „Erste Auszählung“: Vorweg R lesen (#r1 Startblock und eine Zeile, #r2 drei Werkzeuge), Plan sitzung03.md §3.
import { Badge, Card, InShort, Known, Mixup, MoreDetail } from '../blocks/Card';
import { Workshop } from './Workshop';
import { Begriff } from '../Begriff';

/** Vorweg: R lesen, two cards (h4): #r1 and #r2. */
export function ReadR() {
  return <>
    <Card id="r1" stone="R" title="R lesen: Startblock und eine Zeile"
      badge={<><Known session={1} what="Startblock und frequency()" /><Known session={2} what="Pipe" /></>}
      tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">Den Startblock kennst du aus Sitzung 1: Er lädt die Werkzeuge und legt den ALLBUS unter dem Namen <code>allbus</code> ab. <code>allbus</code> ist das <Begriff id="objekt">Objekt</Begriff> mit dem ganzen <Begriff id="datenmatrix">Datensatz</Begriff>, im Bild eine Bauplatte: jede Variable ein Turm, jeder Wert ein Stein. In RStudio führst du ihn zu Beginn aus. In der Code-Werkstatt hier auf der Seite ist das schon erledigt.</p>
      <Workshop k="start" />
      <p className="hilfe-zeile">Rote Zeilen beim Laden, etwa „Attaching core tidyverse packages“, sind normal und kein Fehler. Öffne RStudio über dein Projekt. Findet R die Datei nicht, nimm wie in Sitzung 1 <code>allbus &lt;- read_spss(file.choose())</code>.</p>
      <p className="absatz">So liest du eine Zeile: von links nach rechts, die Pipe <code>%&gt;%</code> sprichst du „und dann“.</p>
      <div className="lesehilfe" role="img" aria-label="allbus, das Objekt. Pipe, und dann. frequency, die Funktion: was passiert. In Klammern la01, das Argument: womit die Funktion arbeitet.">
        <span><b style={{ background: '#E5E9EE' }}>allbus</b><small>Objekt</small></span>
        <span><b style={{ background: 'var(--gelbh)' }}>%&gt;%</b><small>und dann</small></span>
        <span><b style={{ background: 'var(--gruenh)' }}>frequency(</b><small>Funktion: was passiert</small></span>
        <span><b style={{ background: '#FFE3D2' }}>la01</b><small>Argument: womit</small></span>
        <span><b style={{ background: 'var(--gruenh)' }}>)</b><small>{' '}</small></span>
      </div>
      <p className="absatz">Nimm <code>allbus</code>, und dann zähl aus, wie oft jede Antwort bei <code>la01</code> vorkommt.</p>
      <p className="absatz">In Sitzung 1 hast du <code>frequency(allbus, rh08b)</code> geschrieben: erst der Datensatz, dann die Variable. Mit der Pipe aus Sitzung 2 schreibst du dasselbe als <code>allbus %&gt;% frequency(rh08b)</code>. Beides gibt genau dieselbe Tabelle. Ab jetzt steht der Datensatz vorn, wie bei <code>filter()</code> in Sitzung 2; ab Sitzung 4 hängst du so mehrere Schritte aneinander.</p>
      <InShort>Eine <b><Begriff id="funktion">Funktion</Begriff></b> sagt, was passiert, ihr <b><Begriff id="argument">Argument</Begriff></b> sagt, womit. Die <b><Begriff id="pipe">Pipe</Begriff></b> <code>%&gt;%</code> setzt den Datensatz links in das erste Feld der Funktion rechts: <code>allbus %&gt;% frequency(la01)</code> ist dasselbe wie <code>frequency(allbus, la01)</code>. Heute steht hinter der Pipe immer genau ein Schritt.</InShort>
      <Mixup><code>frequency(la01)</code> ohne <code>allbus %&gt;%</code> davor: R weiß dann nicht, in welchem Datensatz la01 steht. Der Datensatz kommt immer zuerst.</Mixup>
    </Card>

    <Card id="r2" stone="R" title="Drei Werkzeuge für heute"
      badge={<><Known session={1} what="frequency() und Taschenrechner" /><Badge>describe(): neu heute</Badge></>}
      tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">Heute brauchst du drei Werkzeuge. Zwei kennst du schon und lernst sie heute genauer kennen, eins ist neu. Führe jede Vorlage einmal aus und schau dir die Ausgabe an. Was die einzelnen Spalten bedeuten, lernst du in den Grundlagen.</p>
      <ol className="schritte">
        <li><code>frequency()</code> zählt, wie oft jede Antwort vorkommt, und macht daraus eine Häufigkeitstabelle. In Sitzung 1 hast du darin Codes, Wertelabels und N gelesen; heute kommen die drei Prozentspalten dazu. Beispiel: Wie oft lesen die Befragten in ihrer Freizeit Bücher?
          <Workshop k="r_frequency" live /></li>
        <li>Neu: <code>describe()</code> fasst eine Variable mit Zahlen in wenigen Kennwerten zusammen, darunter Mittelwert und Median. Beispiel: Wie viele Personen leben im Haushalt der Befragten?
          <Workshop k="r_describe" live /></li>
        <li>R als Taschenrechner kennst du aus Sitzung 1: <code>/</code> teilt, <code>*</code> multipliziert, <code>+</code> und <code>-</code> zählen zusammen und ziehen ab, Klammern rechnet R zuerst. Heute rechnest du damit eine Prozentzahl selbst aus.
          <Workshop k="r_rechnen" live />
          <p className="hilfe-zeile">Zur Kontrolle: R antwortet mit <code>[1] 19.93107</code>.</p></li>
      </ol>
      <InShort><code>frequency()</code> zählt aus, <code>describe()</code> fasst zusammen, und mit <code>/</code>, <code>*</code>, <code>+</code>, <code>-</code> und Klammern rechnest du selbst.</InShort>
      <MoreDetail summary="Wie R Zahlen schreibt">
        <ul>
          <li>R schreibt Kommazahlen mit Punkt: 19.93 heißt 19,93. In <code>describe()</code> stehen bei Mean, Median und den anderen Kennwerten drei Nachkommastellen: 2.000 heißt 2, 26.000 heißt 26. N und Missing sind ganze Zahlen.</li>
          <li>Tausender schreibt R ohne Trennzeichen: 5223 heißt 5.223.</li>
          <li>Wenn du rechnest, schreibst du genauso: Komma nur mit Punkt (<code>39.84</code>), Tausender ohne Punkt (<code>5223</code>). Mit <code>1.041 / 5223 * 100</code> rechnet R „eins Komma null vier eins“ geteilt durch 5.223 und kommt auf 0.01993107, also fast null.</li>
          <li>Die Wertelabels stehen im ALLBUS in Großbuchstaben und ohne Umlaute, etwa TAEGLICH für „täglich“ oder WEISS NICHT.</li>
          <li>Breite Tabellen brechen in einer schmalen RStudio-Konsole um. Zieh das Konsolenfenster dann breiter.</li>
          <li>Mehr dazu im R-Workshop, Kapitel 7.4.1 (<code>frequency()</code>) und 7.4.2 (<code>describe()</code>).</li>
        </ul>
      </MoreDetail>
      <Mixup>Deutsches Komma in R: <code>39,84 + 8,44</code> ergibt einen Fehler („Unerwartete(s) ','“). In R heißt es <code>39.84 + 8.44</code>.</Mixup>
    </Card>
  </>;
}
