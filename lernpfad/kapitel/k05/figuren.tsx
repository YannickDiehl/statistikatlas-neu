// Erklärfassungen von Atlas-Bildern aus Kapitel 5, die dort eine Übung oder Eingabe eingebaut haben:
// Kategorien zusammenfassen (Radioknöpfe je Zeile), Basis-Schalter (Radioknöpfe) und ein Nenner-Bild mit kleinem Beispiel
// statt der echten Zahlen (das Atlas-Bild verrät die Antworten zu Aufgabe 2).
import { useState } from 'react';
import '@atlas/chapter/s05/s05.css';
import { CUTS, GROUP_LABELS, SEX_TEILZEIT, WORK, percent, type Basis } from '@atlas/chapter/s05/content';
import { cutResult, ruleInWords, baseSentence } from '@atlas/chapter/s05/figures/Interactive';
import { BASIS_TITLE, countOf, frame, pctText } from '@atlas/chapter/s05/figures/Tables';
import { COLORS, Canvas, Fig, T, de, whole } from '@atlas/chapter/s05/figures/parts';

/* ---------- Kategorien zusammenfassen: sechs fertige Umkodierungen zum Durchschalten ---------- */

const NAMEN: Record<string, string> = {
  A: 'wie in R lesen',
  B: 'nebenher leer',
  C: 'nebenher als Vollzeit',
  D: 'nicht Erwerbstätige als Vollzeit',
  E: 'else=0',
  F: 'nicht Erwerbstätige als Teilzeit',
};

/** Die Rückmeldung zu C endet mit einer Frage; hier steht die Antwort gleich dabei. */
const ANTWORT: Record<string, string> = { C: ' Nein: Wer nebenher arbeitet, arbeitet nicht Vollzeit.' };

/** Kategorien zusammenfassen ohne Eingabe: Man schaltet durch die Umkodierungen A bis F (CUTS) und sieht Anteil und Rückmeldung. */
export function ZuschnittZeigen() {
  const [i, setI] = useState(0);
  const cut = CUTS[i], r = cutResult(cut.groups), sum = r.n1 + r.n0;
  return <div className="s5-zuschnitt">
    <ul className="schritt-nav" aria-label="Umkodierungen zum Durchschalten">
      {CUTS.map((c, k) => <li key={c.id}><button type="button" aria-current={k === i ? 'step' : 'false'} onClick={() => setI(k)}>{`${c.id}: ${NAMEN[c.id]}`}</button></li>)}
    </ul>
    <table className="daten s5-zuschnitt-tabelle">
      <caption>{`Umkodierung ${cut.id}: Antworten auf die Frage nach der Erwerbstätigkeit und ihre neue Kategorie`}</caption>
      <thead><tr><th scope="col">Antwort (Code)</th><th scope="col">Befragte</th><th scope="col">neue Kategorie</th></tr></thead>
      <tbody>{WORK.map((w, k) => <tr key={w.id}>
        <th scope="row">{w.label}</th>
        <td>{whole(w.n)}</td>
        <td>{GROUP_LABELS[cut.groups[k]]}</td>
      </tr>)}</tbody>
    </table>
    <div className="s5-zuschnitt-ergebnis" aria-live="polite">
      <ul>
        <li>{`Kategorie 1 (Teilzeit): ${whole(r.n1)}`}</li>
        <li>{`Kategorie 0 (Vollzeit): ${whole(r.n0)}`}</li>
        <li>{`leer: ${whole(r.nL)}`}</li>
      </ul>
      {r.share !== null ? <>
        <div className="s5-balken" aria-hidden="true">
          <span className="s5-b1" style={{ width: `${r.n1 / sum * 100}%` }}>{`${de(r.share)} %`}</span>
          <span className="s5-b0" style={{ width: `${r.n0 / sum * 100}%` }}>{`${de(100 - r.share)} %`}</span>
        </div>
        <p>{`Anteil Teilzeit: ${de(r.share)} %, gerechnet als ${whole(r.n1)} geteilt durch (${whole(r.n1)} + ${whole(r.n0)}).`}</p>
      </> : null}
      <p>{ruleInWords(cut.groups).replace(/^Deine Regel/, 'Die Regel')}</p>
      <p className="s5-rueck"><b>{cut.text}{ANTWORT[cut.id] ?? ''}</b></p>
    </div>
  </div>;
}

/* ---------- Basis-Schalter: Knöpfe statt Radioknöpfe ---------- */

/** Basis-Schalter als reines Bild zum Durchklicken: Prozentbasis und Zelle wählen, die Basis ist gelb umrahmt. */
export function BasisSchalter() {
  const c = SEX_TEILZEIT;
  const [basis, setBasis] = useState<Basis>('row');
  const [cell, setCell] = useState<[number, number]>([1, 1]);
  const rows = [...c.rows, 'Total'], cols = [...c.cols, 'Total'];
  return <div className="s5-schalter">
    <ul className="schritt-nav" aria-label="Welche Prozent?">
      {(['row', 'col', 'total'] as Basis[]).map(b => <li key={b}><button type="button" aria-current={basis === b ? 'step' : 'false'} onClick={() => setBasis(b)}>{BASIS_TITLE[b][0]}</button></li>)}
    </ul>
    <table className="s5-kreuz">
      <caption className="sr-only">{`Geschlecht und Erwerbsform, ${BASIS_TITLE[basis][0]}. Wähle eine Zelle.`}</caption>
      <thead><tr><td></td>{cols.map(h => <th scope="col" key={h}>{h}</th>)}</tr></thead>
      <tbody>{rows.map((r, i) => <tr key={r}>
        <th scope="row">{r}</th>
        {cols.map((col, j) => {
          const inner = i < c.rows.length && j < c.cols.length;
          const chosen = cell[0] === i && cell[1] === j;
          const p = pctText(percent(c, basis, i, j));
          const content = <><b>{whole(countOf(c, i, j))}</b><span>{`${p} %`}</span></>;
          return <td key={col} style={frame(c, basis, i, j, cell)} className={chosen ? 's5-zelle' : undefined}>
            {inner ? <button type="button" aria-pressed={chosen} aria-label={`${r}, ${col}: ${whole(countOf(c, i, j))}, ${p} Prozent`}
              onClick={() => setCell([i, j])}>{content}</button> : content}
          </td>;
        })}
      </tr>)}</tbody>
    </table>
    <p className="s5-satz" aria-live="polite">{baseSentence(basis, cell[0], cell[1])}</p>
  </div>;
}

/* ---------- Dieselben Menschen, drei Nenner: kleines Beispiel ---------- */

/** Beispiel mit 40 Befragten: In der Zelle „misstraut“ und „würde nicht wählen“ stehen 6 Menschen. */
const BSP = { zelle: 6, spalte: 8, zeile: 20, alle: 40 };

export function NennerBeispiel() {
  const { zelle, spalte, zeile, alle } = BSP;
  const reihen = [
    { name: 'Nichtwählende', base: spalte },
    { name: 'Misstrauende', base: zeile },
    { name: 'alle in der Tabelle', base: alle },
  ];
  const alt = `Drei waagrechte Balken, so lang wie ihr Nenner, zum Beispiel 40 Befragte. Oben ein kurzer Balken, ${spalte} Nichtwählende; das orange Stück von ${zelle} Menschen füllt ihn zum größten Teil: ${zelle} von ${spalte} sind 75 Prozent. In der Mitte ein längerer Balken, ${zeile} Misstrauende; dasselbe orange Stück: ${zelle} von ${zeile} sind 30 Prozent. Unten der längste Balken, alle ${alle}: ${zelle} von ${alle} sind 15 Prozent.`;
  const x0 = 12, W = 520, tx = 552;
  return <Fig alt={alt} caption={<>Das orange Stück ist immer gleich: dieselben {zelle} Menschen, die misstrauen und nicht wählen würden. Wie groß es wirkt, hängt am Balken, in den du es legst. <span>Die Zahlen sind ein Beispiel mit {alle} Befragten.</span></>}>
    <Canvas w={800} h={210}>
      {reihen.map((r, i) => {
        const y = 24 + i * 62, len = W * r.base / alle, pct = Math.round(zelle / r.base * 100);
        return <g key={r.name}>
          <T x={x0} y={y} textAnchor="start" fontSize={14.5} fill={COLORS.ink} fontWeight={700}>{`${r.name}: ${r.base}`}</T>
          <rect x={x0} y={y + 8} width={len} height={28} fill="#E4E1D8" stroke="#8d877b" />
          <rect x={x0} y={y + 8} width={W * zelle / alle} height={28} fill={COLORS.orange} stroke={COLORS.orangeD} />
          <T x={tx} y={y + 27} textAnchor="start" fontSize={14} fill={COLORS.ink}>{`${zelle} von ${r.base} = ${pct} %`}</T>
        </g>;
      })}
    </Canvas>
  </Fig>;
}

