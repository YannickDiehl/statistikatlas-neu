// Sitzung 6 „Gewichtung und Zusammenhang“: Vorweg R lesen (#r1 Gewicht als Argument, #r2 ein Zusammenhangsmaß) aus sitzung06.md.
import { Card, InShort, Known, Mixup, MoreDetail } from '../blocks/Card';
import { withCode } from '../blocks/rich';
import { EASTWEST, HS_ID } from './content';
import { Picture, de, whole } from './figures/util';
import { Workshop } from './Workshop';

const LINE: { code: string; say: string; bg: string }[] = [
  { code: 'allbus', say: 'Objekt: der ganze Datensatz', bg: '#E5E9EE' },
  { code: '%>%', say: 'und dann', bg: 'var(--gelbh)' },
  { code: 'frequency(', say: 'Funktion: zähle aus', bg: 'var(--gruenh)' },
  { code: 'eastwest', say: 'Argument: welche Variable', bg: '#FFE3D2' },
  { code: 'weights = wghtpew', say: 'Argument: und lass dabei jede Person so viel zählen, wie ihr Gewicht sagt', bg: 'var(--lilah)' },
  { code: ')', say: '', bg: 'var(--gruenh)' },
];
export const LINE_TEXT = LINE.map(p => `${p.code}${p.say ? `, ${p.say}` : ''}`).join('. ') + '.';

export const OUTPUT_TEXT = `Ausgabe in drei Zeilen: „Kendall's Tau: hs01 x id02 [Weighted]“, „tau = -0.241, p < 0.001 ***, N = 5151“, „Use summary() for detailed output.“ Pfeile: tau = -0.241 ist das Maß. p < 0.001 *** ist der p-Wert, heute nicht nötig. N = 5151: so viele zählen mit (gewichtet: Summe der Gewichte). [Weighted]: gewichtet gerechnet.`;

const FUNCTIONS: { code: string; measure: string; fits: string; weight: string; output: string }[] = [
  { code: 'cramers_v(x, y, weights = wghtpew)', measure: 'Cramér-V', fits: 'nominal', weight: 'ja', output: 'nur die Zahl hinter `[1]`' },
  { code: 'phi(x, y, weights = wghtpew)', measure: 'Phi', fits: 'zwei mal zwei Kategorien', weight: 'ja', output: 'nur die Zahl, manchmal mit Minus (Thema 2)' },
  { code: 'goodman_gamma(x, y, weights = wghtpew)', measure: 'Gamma', fits: 'ordinal', weight: 'ja', output: 'nur die Zahl' },
  { code: 'kendall_tau(x, y, weights = wghtpew)', measure: 'Tau-b', fits: 'ordinal', weight: 'ja', output: '`tau = …`' },
  { code: 'spearman_rho(x, y)', measure: 'Spearman-ρ', fits: 'ordinal, metrisch', weight: 'rechnet immer ohne Gewicht', output: '`rho = …`' },
  { code: 'pearson_cor(x, y, weights = wghtpew)', measure: 'Pearson-r', fits: 'metrisch', weight: 'ja', output: '`r = …`' },
];

/** Vorweg: R lesen, two cards (h4): #r1 and #r2. */
export function ReadR() {
  return <>
    <Card id="r1" stone="R" title="Neu heute: ein Gewicht als Argument"
      badge={<><Known session={1} what="Startblock" /> <Known session={3} what="frequency()" /></>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">Den Startblock kennst du: Er lädt die Werkzeuge und legt den ALLBUS unter dem Namen <code>allbus</code> ab. In der Code-Werkstatt hier ist das schon erledigt, in RStudio führst du ihn zu Beginn aus.</p>
      <Workshop k="start" />
      <p style={{ margin: '16px 0 0' }}>Neu ist heute ein Argument, das du an fast jede Funktion hängen kannst: <code>weights = wghtpew</code>. <b>So liest du die Zeile:</b></p>
      <div className="lesehilfe" role="img" aria-label={`Die Zeile Baustein für Baustein: ${LINE_TEXT}`}>
        {LINE.map(p => <span key={p.code}><b style={{ background: p.bg }}>{p.code}</b><small>{p.say || ' '}</small></span>)}
      </div>
      <p style={{ margin: '16px 0 0' }}>Probier es aus:</p>
      <Workshop k="lesen_gewicht" live />
      <p className="absatz">{`Die zweite Tabelle trägt die Überschrift „Weighted Frequency Analysis Results“. Ungewichtet wohnen ${de(EASTWEST.east.pct, 2)} % der Befragten im Osten (NEUE BUNDESLAENDER), gewichtet ${de(EASTWEST.east.wPct, 2)} %. Warum, klärt Thema 1.`}</p>
      <InShort><code>weights = wghtpew</code> lässt jede Person so viel zählen, wie ihr Gewicht sagt. Das Argument steht in der Klammer der Funktion, die gewichtet rechnen soll, und gilt nur dort.</InShort>
      <MoreDetail summary="Muss ich das Gewicht jedes Mal hinschreiben?">
        <p>Ja. In SPSS schaltet man die Gewichtung einmal für alles ein. In R gehört <code>weights = wghtpew</code> in jede Funktion, die gewichtet rechnen soll; R merkt es sich nicht für die nächste Zeile. Fehlt es, rechnet R ungewichtet, ohne zu warnen.</p>
        <p>Daran erkennst du eine gewichtete Ausgabe: „Weighted“ in der Überschrift von <code>frequency()</code> und <code>describe()</code>, „[Weighted]“ hinter den Variablennamen bei <code>kendall_tau()</code> und <code>pearson_cor()</code>, „Weights variable: wghtpew“ im Kopf von <code>crosstab()</code>. Bei <code>cramers_v()</code>, <code>phi()</code> und <code>goodman_gamma()</code> siehst du nur eine Zahl; dort zeigt allein dein Code, ob gewichtet wurde.</p>
        <p>{`Die Zahlen unter N sind gewichtet keine Personen mehr, sondern Summen der Gewichte (im Osten ${whole(EASTWEST.east.wSum)} statt ${whole(EASTWEST.east.n)}).`}</p>
      </MoreDetail>
      <Mixup><code>weights = wghtpew</code> und <code>filter()</code>. Das Gewicht ändert, wie viel jede Person zählt; alle bleiben drin. <code>filter()</code> ändert, wer überhaupt mitzählt.</Mixup>
    </Card>

    <Card id="r2" stone="R" title="Ein Zusammenhangsmaß in R: zwei Variablen, eine Zahl" tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">Alle Zusammenhangsmaße dieser Sitzung haben dieselbe Form: Datensatz vorn, dann die Funktion mit zwei Variablen und, wenn es um Deutschland geht, dem Gewicht.</p>
      <Workshop k="lesen_mass" live />
      <p style={{ margin: '16px 0 0' }}>R antwortet so:</p>
      <Picture text={OUTPUT_TEXT} className="s6-ausgabe">
        <div className="s6-ausgabe-grid">
          <pre className="code solo" lang="en">{`Kendall's Tau: hs01 x id02 [Weighted]\n  tau = -0.241, p < 0.001 ***, N = ${HS_ID.nTau}\nUse summary() for detailed output.`}</pre>
          <ul className="s6-pfeile">
            <li><code>tau = -0.241</code> → das Maß</li>
            <li><code>p &lt; 0.001 ***</code> → p-Wert, heute nicht nötig</li>
            <li><code>N = 5151</code> → so viele zählen mit (gewichtet: Summe der Gewichte)</li>
            <li><code>[Weighted]</code> → gewichtet gerechnet</li>
          </ul>
        </div>
      </Picture>
      <table className="daten voll">
        <caption>Die Funktionen der Sitzung</caption>
        <thead><tr><th scope="col">Funktion</th><th scope="col">Maß</th><th scope="col">passt zu</th><th scope="col">Gewicht?</th><th scope="col">Ausgabe</th></tr></thead>
        <tbody>{FUNCTIONS.map(f => <tr key={f.measure}><td><code>{f.code}</code></td><td>{f.measure}</td><td>{f.fits}</td><td>{f.weight}</td><td>{withCode(f.output)}</td></tr>)}</tbody>
      </table>
      <InShort>Ein Zusammenhangsmaß bekommt zwei Variablen und gibt eine Zahl zurück. Lies die Zahl hinter dem Gleichheitszeichen; R schreibt Kommazahlen mit Punkt: <code>-0.241</code> heißt −0,241.</InShort>
      <MoreDetail summary="p-Wert, Sternchen und Warnungen">
        <p>Den p-Wert und die Sternchen lässt du heute links liegen. Kurz begegnet ist dir ein p-Wert beim Chi-Quadrat-Test in Sitzung 5; was er genau bedeutet, kommt in Sitzung 7. Heute zählt nur die Zahl des Maßes.</p>
        <p>Bei <code>cramers_v()</code>, <code>phi()</code> und <code>goodman_gamma()</code> meldet R manchmal in Rot „2 cells (6.7%) has expected count &lt; 5. Chi-squared approximation may be unreliable.“ Das ist ein Hinweis zum χ²-Test, kein Fehler; die Zahl darüber kannst du verwenden.</p>
        <p>Die Reihenfolge der zwei Variablen ändert den Wert nicht: <code>kendall_tau(hs01, id02)</code> und <code>kendall_tau(id02, hs01)</code> geben dasselbe.</p>
      </MoreDetail>
      <Mixup><code>[1]</code> ist keine Zahl des Ergebnisses. R nummeriert damit nur die Ausgabe; das Ergebnis steht dahinter.</Mixup>
    </Card>
  </>;
}
