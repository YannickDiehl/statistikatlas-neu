// Bedienelemente: Kategorien zusammenfassen (Grundlage 1), Basis-Schalter (Grundlage 2), Wer ist 100 %? (Überblick).
import { useRef, useState, type FormEvent } from 'react';
import { useChapterState } from '../../ChapterContext';
import { useAnnounce } from '../../blocks/announce';
import { withCode } from '../../blocks/rich';
import {
  COL_WORDS, CUTS, CUT_OTHER, DIVERS_NOTE, GROUP_LABELS, ROW_WORDS, SEX_TEILZEIT, U1, U1_ALL_RIGHT, U1_OPTIONS, WORK,
  margins, percent, round1, type Basis, type Group,
} from '../content';
import { de, whole } from './parts';
import { BASIS_TITLE, countOf, frame, pctText } from './Tables';

/* ---------- Grundlage 1: Kategorien zusammenfassen ---------- */

const GROUPS: Group[] = ['1', '0', 'na'];

export type CutResult = { n1: number; n0: number; nL: number; open: number; share: number | null; feedback: string };

/** Counts, share and feedback for an assignment of the five rows (null = still open). */
export function cutResult(groups: (Group | null)[]): CutResult {
  const sumOf = (g: Group) => WORK.reduce((a, w, i) => a + (groups[i] === g ? w.n : 0), 0);
  const n1 = sumOf('1'), n0 = sumOf('0'), nL = sumOf('na'), open = groups.filter(g => g === null).length;
  const share = n1 && n0 ? n1 / (n1 + n0) * 100 : null;
  let feedback = '';
  if (!open) {
    const named = CUTS.find(c => c.groups.every((g, i) => g === groups[i]));
    feedback = named ? named.text : share === null ? 'Noch kein Anteil: Kategorie 1 und Kategorie 0 brauchen je mindestens eine Zeile.' : CUT_OTHER(de(share));
  }
  return { n1, n0, nL, open, share, feedback };
}

/** The rule in words, answers in the order of the table. */
export function ruleInWords(groups: (Group | null)[]): string {
  const names = (g: Group) => WORK.filter((_, i) => groups[i] === g).map(w => w.label.replace(/ \(.*\)$/, '')).join(', ') || 'nichts';
  return `Deine Regel in Worten: Teilzeit (1): ${names('1')}. Vollzeit (0): ${names('0')}. leer: ${names('na')}.`;
}

export function GroupCutter() {
  const [groups, setGroups] = useState<(Group | null)[]>(WORK.map(() => null));
  const first = useRef<HTMLInputElement>(null);
  const r = cutResult(groups);
  const set = (i: number, g: Group) => setGroups(gs => gs.map((x, k) => (k === i ? g : x)));
  const sum = r.n1 + r.n0;
  return <div className="s5-zuschnitt">
    <table className="daten s5-zuschnitt-tabelle" role="table">
      <caption>Antworten auf die Frage nach der Erwerbstätigkeit</caption>
      <thead role="rowgroup"><tr role="row"><th scope="col" role="columnheader">Antwort (Code)</th><th scope="col" role="columnheader">Befragte</th><th scope="col" role="columnheader">neue Kategorie</th></tr></thead>
      <tbody role="rowgroup">{WORK.map((w, i) => <tr key={w.id} role="row">
        <th scope="row" role="rowheader">{w.label}</th>
        <td role="cell">{whole(w.n)}</td>
        <td role="cell"><fieldset className="s5-wahl">
          <legend className="sr-only">{`${w.label}, ${whole(w.n)} Befragte`}</legend>
          {GROUPS.map((g, k) => <label key={g}>
            <input type="radio" name={`s5-zuschnitt-${w.id}`} value={g} checked={groups[i] === g} ref={i === 0 && k === 0 ? first : undefined}
              onChange={() => set(i, g)} /> {GROUP_LABELS[g]}
          </label>)}
        </fieldset></td>
      </tr>)}</tbody>
    </table>
    <div className="s5-zuschnitt-ergebnis" aria-live="polite">
      <ul>
        <li>{`Kategorie 1 (Teilzeit): ${whole(r.n1)}`}</li>
        <li>{`Kategorie 0 (Vollzeit): ${whole(r.n0)}`}</li>
        <li>{`leer: ${whole(r.nL)}`}</li>
        <li>{`noch offen: ${whole(WORK.reduce((a, w, i) => a + (groups[i] === null ? w.n : 0), 0))}`}</li>
      </ul>
      {r.share !== null ? <>
        <div className="s5-balken" aria-hidden="true">
          <span className="s5-b1" style={{ width: `${r.n1 / sum * 100}%` }}>{`${de(r.share)} %`}</span>
          <span className="s5-b0" style={{ width: `${r.n0 / sum * 100}%` }}>{`${de(100 - r.share)} %`}</span>
        </div>
        <p>{`Anteil Teilzeit: ${de(r.share)} %, gerechnet als ${whole(r.n1)} geteilt durch (${whole(r.n1)} + ${whole(r.n0)}).`}</p>
      </> : null}
      <p>{ruleInWords(groups)}</p>
      {r.open ? <p>{r.open === 1 ? 'Noch 1 Zeile offen.' : `Noch ${r.open} Zeilen offen.`}</p> : <p className="s5-rueck"><b>{r.feedback}</b></p>}
    </div>
    <div className="reihe-knoepfe"><button type="button" className="knopf hell" onClick={() => { setGroups(WORK.map(() => null)); first.current?.focus(); }}>Zurücksetzen</button></div>
  </div>;
}

/* ---------- Grundlage 2: Basis-Schalter ---------- */

/** Sentence under the switch for cell (i, j) with the basis. */
export function baseSentence(basis: Basis, i: number, j: number): string {
  const c = SEX_TEILZEIT, { rowSums, colSums, n } = margins(c), count = whole(c.cells[i][j]);
  const p = de(round1(percent(c, basis, i, j))), r = ROW_WORDS[i], k = COL_WORDS[j];
  const text = basis === 'row'
    ? `Von den ${whole(rowSums[i])} ${r.dative} arbeiten ${count} ${k.word}: ${p} %. Die Basis ist die Zeile ${r.nominative}.`
    : basis === 'col'
      ? `Von den ${whole(colSums[j])} ${k.dative} sind ${count} ${r.predicate}: ${p} %. Die Basis ist die Spalte ${k.nominative}.`
      : `Von allen ${whole(n)} Erwerbstätigen in der Tabelle sind ${count} ${r.predicate} in ${k.nominative}: ${p} %. Die Basis ist die ganze Tabelle.`;
  return basis === 'row' && i === 2 ? `${text} ${DIVERS_NOTE}` : text;
}

export function BaseSwitch() {
  const c = SEX_TEILZEIT;
  const [basis, setBasis] = useState<Basis>('row');
  const [cell, setCell] = useState<[number, number]>([1, 1]);
  const rows = [...c.rows, 'Total'], cols = [...c.cols, 'Total'];
  return <div className="s5-schalter">
    <fieldset className="s5-schalter-wahl">
      <legend>Welche Prozent?</legend>
      <div className="radios">{(['row', 'col', 'total'] as Basis[]).map(b => <label key={b}>
        <input type="radio" name="s5-basis" value={b} checked={basis === b} onChange={() => setBasis(b)} /> {BASIS_TITLE[b][0]}
      </label>)}</div>
    </fieldset>
    <table className="s5-kreuz">
      <caption className="sr-only">{`Geschlecht und Erwerbsform, ${BASIS_TITLE[basis][0]}. Wähle eine Zelle.`}</caption>
      <thead><tr><td></td>{cols.map(h => <th scope="col" key={h}>{h}</th>)}</tr></thead>
      <tbody>{rows.map((r, i) => <tr key={r}>
        <th scope="row">{r}</th>
        {cols.map((col, j) => {
          const inner = i < c.rows.length && j < c.cols.length;
          const chosen = cell[0] === i && cell[1] === j;
          const content = <><b>{whole(countOf(c, i, j))}</b><span>{`${pctText(percent(c, basis, i, j))} %`}</span></>;
          return <td key={col} style={frame(c, basis, i, j, cell)} className={chosen ? 's5-zelle' : undefined}>
            {inner ? <button type="button" aria-pressed={chosen} aria-label={`${r}, ${col}: ${whole(countOf(c, i, j))}, ${pctText(percent(c, basis, i, j))} Prozent`}
              onClick={() => setCell([i, j])}>{content}</button> : content}
          </td>;
        })}
      </tr>)}</tbody>
    </table>
    <p className="s5-satz" aria-live="polite">{baseSentence(basis, cell[0], cell[1])}</p>
  </div>;
}

/* ---------- Überblick: Wer ist 100 %? ---------- */

const answerId = (i: number) => `u1-${i + 1}`;
type Checked = Record<string, string> | null;

export function WhoIs100() {
  const { state, setAnswers } = useChapterState();
  const saved = Object.fromEntries(U1.map((_, i) => [answerId(i), state.answers[answerId(i)] ?? ''])) as Record<string, string>;
  const [draft, setDraft] = useState(saved);
  const [checked, announce] = useAnnounce<Checked>(Object.values(saved).some(Boolean) ? saved : null, null);

  function submit(e: FormEvent) {
    e.preventDefault();
    const snapshot = Object.fromEntries(U1.map((_, i) => [answerId(i), draft[answerId(i)] ?? '']));
    setAnswers(snapshot);
    announce(snapshot);
  }

  const results = U1.map((u, i) => {
    const v = checked?.[answerId(i)] ?? '';
    return v === '' ? null : Number(v) === u.answer;
  });
  const right = results.filter(Boolean).length;
  const open = results.filter(r => r === null).length;
  const summary = !checked ? '' : right === U1.length ? U1_ALL_RIGHT : open === U1.length ? 'Wähl zuerst für jede Frage eine Basis.' : `${right} von 4 richtig. Unter jedem Feld steht, worauf du achten kannst.`;

  return <form className="kurzueberlegen weiss zuordnen" id="u1-frage" noValidate onSubmit={submit}>
    <p>Wer ist 100 %? Wähle für jede Frage die Basis</p>
    {U1.map((u, i) => {
      const id = answerId(i), ok = results[i];
      return <div className="frage feld" key={id}>
        <label htmlFor={id}>{`${i + 1}. ${u.question}`}</label>
        <select id={id} value={draft[id] ?? ''} aria-invalid={ok === false || undefined} className={ok ? 'passt' : undefined}
          aria-describedby={ok === null ? undefined : `u1-r${i + 1}`} onChange={e => setDraft(d => ({ ...d, [id]: e.target.value }))}>
          <option value="">Basis wählen</option>
          {U1_OPTIONS.map((o, k) => <option key={o} value={String(k)}>{o}</option>)}
        </select>
        <span className="hilfe-zeile" id={`u1-r${i + 1}`}>
          {ok === null ? null : ok ? <><b className="passt-ja">Richtig.</b> {u.right}</> : <><b className="passt-nein">Noch nicht.</b> {u.wrong}</>}
        </span>
      </div>;
    })}
    <div className="reihe-knoepfe"><button type="submit" className="knopf">Prüfen</button></div>
    <p className={`rueck${checked ? (right === U1.length ? ' ok' : ' no') : ''}`} aria-live="polite">{withCode(summary)}</p>
  </form>;
}
