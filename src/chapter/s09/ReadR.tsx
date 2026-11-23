// Sitzung 9 „Lineare Regression“: Vorweg R lesen (#r1 Startblock, #r2 Formel mit Tilde, #r3 Ausgabe von summary()) aus sitzung09.md.
import { Badge, Card, InShort, Known, Mixup, MoreDetail } from '../blocks/Card';
import { Workshop } from './blocks';
import { SHORT_OUTPUT } from './content';
import { OutputPicker } from './figures/OutputPicker';

/** Text version of the line picture „s9-zeile-tilde“. */
export const TILDE_TEXT = 'Nimm allbus, und dann sag die Lebenszufriedenheit aus der wirtschaftlichen Lage vorher, gewichtet. Die Bausteine der Reihe nach: allbus, das Objekt. Pipe, und dann. linear_regression, die Funktion: was passiert. ls01, links von der Tilde: was vorhergesagt wird, die AV. Tilde: „aus“. lage, rechts von der Tilde: woraus, die UV. Komma weights gleich wghtpew, das Argument: gewichtet. Klammer zu.';

/** Vorweg: R lesen, three cards (h4). */
export function ReadR() {
  return <>
    <Card id="r1" stone="R" title="Startblock und was du schon kennst" tag={{ kind: 'picture', label: 'Code lesen' }}
      badge={<><Known session={1} what="Startblock" /><Known session={5} what="mutate() und rec()" /><Known session={6} what="weights" /></>}>
      <p className="lead">Den Startblock kennst du aus Sitzung 1. In RStudio führst du ihn zu Beginn aus. In der Code-Werkstatt hier auf der Seite ist das schon erledigt.</p>
      <Workshop k="start" />
      <p className="hilfe-zeile">Rote Zeilen beim Laden, etwa „Attaching core tidyverse packages“, sind normal und kein Fehler. Findet R die Datei nicht, nimm wie in Sitzung 1 <code>allbus &lt;- read_spss(file.choose())</code>.</p>
      <p style={{ margin: '16px 0 0' }}>Heute kommen drei Dinge aus früheren Sitzungen in fast jeder Vorlage vor:</p>
      <ul>
        <li><code>mutate(lage = rec(ep03, rules = "rev"))</code> polt eine Variable um (Sitzung 5). Danach heißt eine hohe Zahl „gut“. Das brauchst du, damit „mehr“ auf beiden Achsen in dieselbe Richtung zeigt.</li>
        <li><code>weights = wghtpew</code> gewichtet die Befragten so, dass die Zahlen für ganz Deutschland gelten (Sitzung 6). Der Osten ist im ALLBUS absichtlich stärker vertreten.</li>
        <li><code>%&gt;% summary()</code> zeigt die ausführliche Ausgabe (Sitzung 7).</li>
      </ul>
      <div className="box-gruen s9-wichtig">
        <p><b>Wichtig in der Code-Werkstatt</b></p>
        <p>Jede Werkstatt startet mit dem frisch geladenen ALLBUS. Was eine andere Werkstatt umgepolt oder neu gebildet hat, kennt sie nicht. Darum steht das Umpolen in jeder Vorlage, die es braucht, noch einmal.</p>
      </div>
    </Card>

    <Card id="r2" stone="R" title="Eine Formel mit Tilde: y ~ x" tag={{ kind: 'picture', label: 'Code lesen' }}
      badge={<><Badge>neu heute</Badge><Known session={5} what="AV und UV" /></>}>
      <p className="lead">Neu heute ist die Funktion <code>linear_regression()</code>. In ihre Klammer schreibst du eine Formel mit der Tilde <code>~</code>. Links steht, was vorhergesagt wird, rechts, woraus. So liest du die Zeile:</p>
      <div className="lesehilfe s9-zeile" role="img" aria-label={TILDE_TEXT}>
        <span><b style={{ background: '#E5E9EE' }}>allbus</b><small>Objekt</small></span>
        <span><b style={{ background: 'var(--gelbh)' }}>%&gt;%</b><small>und dann</small></span>
        <span><b style={{ background: 'var(--gruenh)' }}>linear_regression(</b><small>Funktion: was passiert</small></span>
        <span><b style={{ background: '#FFE3D2' }}>ls01</b><small>links von ~: was vorhergesagt wird, AV</small></span>
        <span><b style={{ background: 'var(--lilah)' }}>~</b><small>„aus“</small></span>
        <span><b style={{ background: 'var(--blauh)' }}>lage</b><small>rechts von ~: woraus, UV</small></span>
        <span><b style={{ background: '#FFE3D2' }}>, weights = wghtpew</b><small>Argument: gewichtet</small></span>
        <span><b style={{ background: 'var(--gruenh)' }}>)</b><small>{' '}</small></span>
      </div>
      <p className="s9-satz">Nimm allbus, und dann sag die Lebenszufriedenheit aus der wirtschaftlichen Lage vorher, gewichtet.</p>
      <Workshop k="r_kurz" live />
      <p style={{ margin: '12px 0 0' }}>Ausgabe zur Kontrolle:</p>
      <pre className="code solo s9-kontrolle" tabIndex={0} aria-label="Ausgabe zur Kontrolle">{SHORT_OUTPUT}</pre>
      <InShort><code>linear_regression(y ~ x)</code> sagt y aus x vorher. Die <b>abhängige Variable</b> (AV, das y) steht links von der Tilde, die <b>unabhängige Variable</b> (UV, das x) rechts. In der Regression heißt die UV auch <b>Prädiktor</b>, kurz gesagt: das, woraus vorhergesagt wird. Ohne <code>summary()</code> zeigt R eine Zeile mit R², Test und N.</InShort>
      <Mixup>Ein Komma statt der Tilde: <code>linear_regression(ls01, lage)</code>. R meldet dann „<code>formula</code> must be a formula object“. Zwischen AV und UV steht immer <code>~</code>.</Mixup>
    </Card>

    <Card id="r3" stone="R" title="Die Ausgabe von summary() lesen" tag={{ kind: 'picture', label: 'Im Bild' }}
      badge={<Known session={7} what="summary()" />}>
      <p className="lead">Mit <code>summary()</code> zeigt R alles, was du heute brauchst. Führe die Vorlage aus und wähl dann eine Zahl. Was sie bedeutet, lernst du in den Grundlagen; hier geht es darum, wo sie steht.</p>
      <Workshop k="r_summary" live />
      <OutputPicker />
      <MoreDetail summary="Was der Rest der Ausgabe bedeutet">
        <ul>
          <li><b>Method: ENTER</b> heißt: Alle UV kommen auf einmal ins Modell. Heute ist es nur eine.</li>
          <li>Die <b>Note</b> sagt nur: R rechnet mit den Codes 1 bis 5 von lage, wie SPSS. Das ist hier gewollt. Die zweite Zeile nennt einen anderen Weg (jede Stufe als eigene Gruppe); den lernst du in Sitzung 10 kennen.</li>
          <li><b>Std. Error</b> und <b>95% CI</b> zeigen, wie genau B geschätzt ist; <b>t</b> und <b>Sig.</b> testen, ob B von 0 verschieden ist (p-Wert, kennst du aus Sitzung 7). Bei Tausenden Befragten ist fast jede Steigung signifikant. Ob sie groß genug ist, um wichtig zu sein, sagen B und R².</li>
          <li><b>Adjusted R Square</b> ist R² mit einem kleinen Abzug für jede UV. Mit einer UV und Tausenden Befragten ist er gleich. Er wird in Sitzung 10 wichtig.</li>
          <li>Die Abschnitte <b>ANOVA</b> und <b>Collinearity Statistics</b> brauchst du heute nicht; ANOVA zeigt die Quadratsummen aus Grundlage 2c, Collinearity wird in Sitzung 10 wichtig.</li>
          <li>R schreibt Kommazahlen mit Punkt: 3.570 heißt 3,570.</li>
        </ul>
      </MoreDetail>
      <Mixup>B und Beta. Für die Gerade und jede Vorhersage brauchst du <b>B</b>. Beta ist dieselbe Steigung, umgerechnet in Standardabweichungen; mit einer UV ist sie gleich r.</Mixup>
    </Card>
  </>;
}
