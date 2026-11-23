// Bild s1-pi08: die Ausgabe von frequency(allbus, pi08) als echte Tabelle; fünf Knöpfe heben Teile hervor.
import { useState } from 'react';
import { freqTotals, PI08, PI08_HEAD, type Freq } from '../content';
import { bold } from './SearchLab';

export type Part = 'codes' | 'labels' | 'n' | 'valid' | 'missing';
export const PARTS: { id: Part; button: string; text: string }[] = [
  { id: 'codes', button: 'Codes', text: '**Codes** sind die Zahlen im Datensatz. Die positiven (1 bis 4) sind Antworten, die negativen (−42 bis −8) sind fehlende Werte.' },
  { id: 'labels', button: 'Wertelabels', text: '**Wertelabels** übersetzen jeden Code in Worte: 4 heißt MENSCHL. URSACHEN.' },
  { id: 'n', button: 'Anzahl', text: '**N** zählt, wie viele Befragte diesen Code haben: 1.812 sagen ‚menschliche Ursachen‘.' },
  { id: 'valid', button: 'gültige Antworten', text: '**Total valid** sind die gültigen Antworten: 3.507 Befragte haben eine der vier Antworten gegeben.' },
  { id: 'missing', button: 'fehlende Werte', text: '**Fehlende Werte** haben negative Codes: 1.739 Befragte haben keine gültige Antwort.' },
];

/** Percent with two decimals as R prints it („1.33“). */
const pct = (a: number, b: number) => (Math.round(a / b * 10000) / 100).toFixed(2);
/** Code as R prints it. */
const code = (v: number) => String(v);

/** Rows of the table with raw, valid and cumulative percent (computed from N, as mariposa does). */
export function freqLines(f: Freq) {
  const { valid, missing, total } = freqTotals(f);
  let cum = 0;
  const answers = f.rows.filter(r => r.value >= 0).map(r => {
    cum += r.n;
    return { ...r, raw: pct(r.n, total), valid: pct(r.n, valid), cum: pct(cum, valid) };
  });
  const missings = f.rows.filter(r => r.value < 0).map(r => ({ ...r, raw: pct(r.n, total) }));
  return { answers, missings, valid, missing, total, validRaw: pct(valid, total), missingRaw: pct(missing, total) };
}

const HL: Record<Part, { background: string; outline?: string }> = {
  codes: { background: '#F1EFFC' }, labels: { background: '#FFF0E8' }, n: { background: '#EAF5FC' },
  valid: { background: '#EDF8F1', outline: '2px solid #2f7a4f' }, missing: { background: '#fdeeea', outline: '2px solid #a0452f' },
};

/** Grundlage 3a: frequency(allbus, pi08) with toggles „Zeig mir …“ (several at once) and one live sentence per toggle. */
export function FrequencyTable() {
  const [on, setOn] = useState<Part[]>([]);
  const has = (p: Part) => on.includes(p);
  const t = freqLines(PI08);
  const cell = (p: Part) => (has(p) ? { background: HL[p].background } : undefined);
  const row = (p: 'valid' | 'missing') => (has(p) ? { background: HL[p].background, outline: HL[p].outline, outlineOffset: -2 } : undefined);
  const toggle = (p: Part) => setOn(o => (o.includes(p) ? o.filter(x => x !== p) : [...o, p]));
  return <div className="s1-pi08">
    <p className="s1-zeig" id="s1-pi08-zeig">Zeig mir …</p>
    <div className="s1-wahl" role="group" aria-labelledby="s1-pi08-zeig">
      {PARTS.map(p => <button key={p.id} type="button" aria-pressed={has(p.id)} onClick={() => toggle(p.id)}>{p.button}</button>)}
    </div>
    <div className="s1-tabelle">
      <p className="s1-tkopf"><code>{`${PI08.name} (${PI08.label})`}</code><br /><code>{`# total N=${t.total} valid N=${t.valid} mean=${PI08_HEAD.mean} sd=${PI08_HEAD.sd} skewness=${PI08_HEAD.skewness}`}</code></p>
      <table className="daten s1-freq">
        <caption>Ausgabe von frequency(allbus, pi08), ALLBUS 2023, ungewichtet</caption>
        <thead><tr>{['Value', 'Label', 'N', 'Raw %', 'Valid %', 'Cum. %'].map(h => <th key={h} scope="col">{h}</th>)}</tr></thead>
        <tbody>
          {t.answers.map(r => <tr key={r.value}>
            <td style={cell('codes')}>{code(r.value)}</td><td style={cell('labels')}>{r.label}</td><td style={cell('n')}>{r.n}</td>
            <td>{r.raw}</td><td>{r.valid}</td><td>{r.cum}</td>
          </tr>)}
          <tr className="s1-summe" style={row('valid')}><th scope="row" colSpan={2}>Total valid</th><td style={cell('n')}>{t.valid}</td><td>{t.validRaw}</td><td>100.00</td><td></td></tr>
          {t.missings.map(r => <tr key={r.value} style={row('missing')}>
            <td style={cell('codes')}>{code(r.value)}</td><td style={cell('labels')}>{r.label}</td><td style={cell('n')}>{r.n}</td>
            <td>{r.raw}</td><td></td><td></td>
          </tr>)}
          <tr className="s1-summe" style={row('missing')}><th scope="row" colSpan={2}>Total missing</th><td style={cell('n')}>{t.missing}</td><td>{t.missingRaw}</td><td></td><td></td></tr>
          <tr className="s1-summe"><th scope="row" colSpan={2}>Total</th><td style={cell('n')}>{t.total}</td><td>100.00</td><td></td><td></td></tr>
        </tbody>
      </table>
    </div>
    <div className="erkl" aria-live="polite">{PARTS.filter(p => has(p.id)).map(p => <p key={p.id}>{bold(p.text)}</p>)}</div>
  </div>;
}
