// Thema 2 „Kategorien ohne Reihenfolge“: erwartet gegen beobachtet (s6-erwartet), χ² in Bausteinen (s6-chi-bausteine),
// Stärke-Lineal (s6-lineal-staerke).
import { useState } from 'react';
import { ROLE } from '../../../tasks/kit/palette';
import { ALT, KONF, TABLE_100 } from '../content';
import { Picture, Ruler, Toggle, de } from './util';

/** Zeilen- und Spaltensummen, erwartete Häufigkeiten, Abweichungen, χ²-Beiträge, χ² und Phi einer Tafel. */
export function chiParts(observed: number[][]) {
  const rowSum = observed.map(r => r.reduce((a, b) => a + b, 0));
  const colSum = observed[0].map((_, j) => observed.reduce((a, r) => a + r[j], 0));
  const n = rowSum.reduce((a, b) => a + b, 0);
  const expected = observed.map((r, i) => r.map((_, j) => rowSum[i] * colSum[j] / n));
  const deviation = observed.map((r, i) => r.map((o, j) => o - expected[i][j]));
  const contribution = deviation.map((r, i) => r.map((d, j) => d ** 2 / expected[i][j]));
  const chi2 = contribution.flat().reduce((a, b) => a + b, 0);
  return { rowSum, colSum, n, expected, deviation, contribution, chi2, phi: Math.sqrt(chi2 / n) };
}

type View = 'observed' | 'expected' | 'deviation';
const VIEWS: { value: View; label: string }[] = [
  { value: 'observed', label: 'beobachtet' }, { value: 'expected', label: 'erwartet ohne Zusammenhang' }, { value: 'deviation', label: 'Abweichung' },
];
const SENTENCE: Record<View, string> = {
  observed: 'So sind die 100 Befragten verteilt.',
  expected: 'Gäbe es keinen Zusammenhang, wären im Osten genauso viele ohne Konfession wie insgesamt: 44 %. Von 20 Befragten wären das 8,8.',
  deviation: 'Im Osten sind 7,2 Personen mehr ohne Konfession, als man ohne Zusammenhang erwarten würde. Die Abweichungen gleichen sich in jeder Zeile und Spalte aus.',
};
const CAPTION: Record<View, string> = { observed: 'Beobachtet', expected: 'Erwartet ohne Zusammenhang', deviation: 'Abweichung: beobachtet minus erwartet' };

const cell = (view: View, v: number) => view === 'observed' ? String(v)
  : view === 'expected' ? de(v, 1)
    : `${v > 0 ? '↑ +' : '↓ '}${de(v, 1)}`;

function Table({ view, compact = false }: { view: View; compact?: boolean }) {
  const p = chiParts(TABLE_100.observed);
  const values = view === 'observed' ? TABLE_100.observed : view === 'expected' ? p.expected : p.deviation;
  const color = view === 'observed' ? ROLE.data : view === 'expected' ? ROLE.model : undefined;
  return <table className={`daten s6-tafel${compact ? '' : ' gross'}`}>
    <caption>{CAPTION[view]}</caption>
    <thead><tr><th scope="col"><span className="sr-only">Region</span></th>{TABLE_100.cols.map(c => <th scope="col" key={c}>{c}</th>)}<th scope="col">zusammen</th></tr></thead>
    <tbody>
      {TABLE_100.rows.map((r, i) => <tr key={r}>
        <th scope="row">{r}</th>
        {values[i].map((v, j) => <td key={j} style={color ? { color, fontWeight: 800 } : { fontWeight: 800 }}>{cell(view, v)}</td>)}
        <td>{p.rowSum[i]}</td>
      </tr>)}
      <tr><th scope="row">zusammen</th>{p.colSum.map((c, j) => <td key={j}>{c}</td>)}<td>{p.n}</td></tr>
    </tbody>
  </table>;
}

/** 2a: Vierfeldertafel mit Umschalter beobachtet / erwartet / Abweichung. Die Tafel ist selbst die Textfassung. */
export function Expected() {
  const [view, setView] = useState<View>('observed');
  return <div className="s6-erwartet">
    <Toggle label="Was die Kreuztabelle zeigt" options={VIEWS} value={view} onChange={setView} />
    <Table view={view} />
    <p className="rueck text" aria-live="polite">{SENTENCE[view]}</p>
    {view === 'expected' ? <div className="formel" role="group" aria-label="Rechenregel: erwartet gleich Zeilensumme mal Spaltensumme geteilt durch alle. Beispiel Ost, keine: 20 mal 44 geteilt durch 100 gleich 8,8.">
      <span className="s6-stein" aria-hidden="true">erwartet</span><span aria-hidden="true">=</span>
      <span className="frac" aria-hidden="true"><span>Zeilensumme × Spaltensumme</span><span>alle</span></span>
      <span aria-hidden="true">Ost, keine:</span>
      <span className="frac" aria-hidden="true"><span>20 × 44</span><span>100</span></span><span aria-hidden="true">=</span><span className="gross" aria-hidden="true">8,8</span>
    </div> : null}
    <details className="werte">
      <summary>Alle drei Ansichten als Tabellen</summary>
      {VIEWS.map(v => <Table key={v.value} view={v.value} compact />)}
    </details>
  </div>;
}

/** 2b: χ² in vier Schritten, dazu Phi und Cramér-V; die Liste ist sichtbar und vorlesbar. */
export function ChiBricks() {
  const p = chiParts(TABLE_100.observed);
  const names = ['West, Mitglied', 'West, keine', 'Ost, Mitglied', 'Ost, keine'];
  const dev = p.deviation.flat(), exp = p.expected.flat(), con = p.contribution.flat();
  const sq = dev[0] ** 2;
  return <figure className="ebild s6-bild">
    <ol className="s6-bausteine" role="list">
      <li><span className="s6-nr" aria-hidden="true">1</span><div><b>Abweichung:</b> beobachtet minus erwartet, je Zelle: {dev.map(d => `${d > 0 ? '+' : ''}${de(d, 1)}`).join('; ')}.</div></li>
      <li><span className="s6-nr" aria-hidden="true">2</span><div><b>Quadrieren und durch erwartet teilen:</b>{' '}
        {con.map((c, i) => `${de(sq, 2)} / ${de(exp[i], 1)} = ${de(c, 2)} (${names[i]})`).join('; ')}.
        <span className="s6-merke">Durch erwartet teilen: Dieselbe Abweichung wiegt in einer kleinen Zelle schwerer.</span></div></li>
      <li><span className="s6-nr" aria-hidden="true">3</span><div><b>Zusammenzählen:</b> χ² = {con.map(c => de(c, 2)).join(' + ')} = {de(p.chi2, 2)} (gesprochen „Chi-Quadrat“).</div></li>
      <li><span className="s6-nr" aria-hidden="true">4</span><div><b>Durch die Zahl der Befragten teilen und die Wurzel ziehen:</b>{' '}
        <span aria-hidden="true">Phi = √(13,15 / 100) = 0,36.</span><span className="sr-only">Phi gleich Wurzel aus 13,15 geteilt durch 100, also 0,36.</span></div></li>
      <li><span className="s6-nr" aria-hidden="true">5</span><div><b>Für größere Tabellen:</b>{' '}
        <span aria-hidden="true">Cramér-V = √(χ² / (n × (kleinere Zahl von Zeilen und Spalten − 1)))</span>
        <span className="sr-only">V gleich Wurzel aus Chi-Quadrat geteilt durch n mal, in Klammern, kleinere Zahl von Zeilen und Spalten minus 1.</span>
        {' '}Bei zwei Zeilen ist die Klammer 1, darum ist V hier gleich Phi: 0,36.</div></li>
    </ol>
  </figure>;
}

/** 2c: Lineal 0 bis 1 mit der Faustregel und der Marke für Konfession und Region. */
export function StrengthRuler() {
  const c = ['#f3efe6', '#e3ddcf', '#cfc4ad', '#b3a585'];
  return <Picture text={ALT.lineal} caption="Faustregel für die Stärke (nach Cohen). Die Grenzen sind eine Verabredung.">
    <Ruler from={0} to={1} ticks={[0, 0.1, 0.3, 0.5, 1]} height={150}
      bands={[
        { from: 0, to: 0.1, label: 'unter 0,1: kein oder sehr schwach', fill: c[0], row: 1, start: true },
        { from: 0.1, to: 0.3, label: 'ab 0,1: schwach', fill: c[1] },
        { from: 0.3, to: 0.5, label: 'ab 0,3: mittel', fill: c[2] },
        { from: 0.5, to: 1, label: 'ab 0,5: stark', fill: c[3] },
      ]}
      marks={[{ value: KONF.phi.weighted, label: 'Konfession und Region (Phi, gewichtet): 0,33', color: ROLE.data, row: 1 }]} />
  </Picture>;
}
