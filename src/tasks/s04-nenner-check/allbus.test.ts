// Läuft nur mit der eigenen GESIS-Datei: ALLBUS_SAV=/pfad/ZA8831_v1-3-0.sav node --import tsx --test src/tasks/s04-nenner-check/*.test.ts
// Die erwarteten Zahlen stammen aus R (tidyverse + mariposa 0.7.4) mit genau dem Code aus content.ts und rCodeFor().
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { readSav, type SavFile } from '../../sandbox/readSav';
import { allTables, cellCount, checkP1, checkP3, collapse, cutPercent, cutTable, fourfold, PARTY, percent, prepare, stairs, type Way } from './domain';

const file = process.env.ALLBUS_SAV;
const skip = !file && 'ALLBUS_SAV nicht gesetzt';
let cached: SavFile | null = null;
const load = () => {
  if (cached) return cached;
  const bytes = readFileSync(file!);
  return (cached = readSav(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)));
};
const r1 = (x: number) => Math.round(x * 10) / 10;

test('session 5: the numbers students read in R match the checks', { skip }, () => {
  const sav = load(), joint = prepare(sav), tables = allTables(joint);
  const party = fourfold(joint, PARTY);
  // allbus %>% crosstab(misstrauen, nichtwahl, percentages = "col") → 87,0 % bei 127 Befragten; "all" → row 6,5 / 2,3, total 4,6
  assert.deepEqual([r1(percent(party, 'a', 'col')), party.n.a], [87, 127]);
  assert.deepEqual([r1(percent(party, 'a', 'row')), r1(percent(party, 'c', 'row')), r1(percent(party, 'a', 'all'))], [6.5, 2.3, 4.6]);
  assert.match(checkP1(tables, joint, '87,0', '127')[0].text, /Genau so hat der Parteivorstand gerechnet/);
  const wrongCount = checkP1(tables, joint, '87,0', '146')[0].text;
  assert.match(wrongCount, /Der Prozentwert stimmt.*Zahl der Befragten in genau dieser Zelle/);
  assert.doesNotMatch(wrongCount, /127/);
  // rCodeFor(): Lesarten, in R mit untag_na() + mutate(misstrauen_lesart = rec(...), nichtwahl_lesart = rec(...)) + crosstab(..., "row") nachgerechnet.
  const cases: [Way, number, number, number][] = [
    [{ item: 'pe05', distrust: [3, 4], nonvote: [-8], else0: false, weighted: false }, 21.5, 11.7, 386],
    [{ item: 'pe05', distrust: [3, 4], nonvote: [-8, -7], else0: false, weighted: false }, 26.7, 15.0, 512],
    [{ item: 'pe05', distrust: [4], nonvote: [-9], else0: false, weighted: false }, 14.2, 6.9, 64],
    [{ item: 'pa35', distrust: [1, 3], nonvote: [], else0: false, weighted: true }, 6.7, 3.7, 86],
  ];
  for (const [way, distrusting, others, n] of cases) {
    const t = fourfold(joint, way);
    assert.deepEqual([r1(percent(t, 'a', 'row')), r1(percent(t, 'c', 'row')), cellCount(t, 'a')], [distrusting, others, n], `${way.item} ${way.distrust}`);
  }
  const p3 = { item: 'pe05' as const, distrust: [3, 4], nonvote: [-8], weighted: false, rowDistrust: '21,5', rowOthers: '11,7', n: '386' };
  assert.equal(checkP3(tables, joint, p3).at(-1)!.tone, 'ok');
  // untag_na() vergessen: Die Regel -8=1 greift nicht, R zeigt die Zahl ohne „weiß nicht“.
  const noUntag = fourfold(joint, { ...p3, nonvote: [], else0: false });
  assert.match(checkP3(tables, joint, { ...p3, rowDistrust: String(r1(percent(noUntag, 'a', 'row'))).replace('.', ','), rowOthers: '', n: String(noUntag.n.a) }).at(-1)!.text, /untag_na\(\) vergessen/);
  // Zusatz: allbus %>% crosstab(misstrauen_zahl, nichtwahl, percentages = "row") → 1,2 · 4,4 · 5,6 · 8,8 %, oberste Stufe 735 Befragte.
  const s = stairs(sav);
  assert.deepEqual(s.map(x => r1(x.share)), [1.2, 4.4, 5.6, 8.8]);
  assert.equal(s[3].n, 735);
});

test('session 5 cut table: all codes of pe01 and pv01, and the press-release cut gives 87,0 % like crosstab()', { skip }, () => {
  const t = cutTable(load());
  assert.deepEqual(t.rows.map(r => r.code), [1, 2, 3, 4, -8, -9, -11]);
  assert.deepEqual(t.cols.map(c => c.code), [1, 2, 3, 4, 6, 42, 90, 91, -7, -8, -9, -42, -50]);
  const total = [...t.n.values()].reduce((a, b) => a + b, 0);
  // Nichts eingeteilt: alle Befragten sind noch offen
  assert.equal(collapse(t, {}, {}).open, total);
  // Wie die Pressemitteilung: pe01 1–2 misstraut, 3–4 übrige; 91 wählt nicht, Parteien wählen, Rest fällt heraus
  const rows = { 1: 'distrust', 2: 'distrust', 3: 'others', 4: 'others', [-8]: 'out', [-9]: 'out', [-11]: 'out' } as const;
  const cols = { 1: 'vote', 2: 'vote', 3: 'vote', 4: 'vote', 6: 'vote', 42: 'vote', 90: 'vote', 91: 'nonvote', [-7]: 'out', [-8]: 'out', [-9]: 'out', [-42]: 'out', [-50]: 'out' } as const;
  const f = collapse(t, rows, cols);
  assert.deepEqual([f.a, f.open], [127, 0]);
  assert.equal(r1(cutPercent(f, 'a', 'col')!), 87);
  assert.equal(r1(cutPercent(f, 'a', 'row')!), 6.5);
  // „weiß nicht“ zählt zusätzlich als Nichtwahl: dieselbe Zelle wächst
  assert.ok(collapse(t, rows, { ...cols, [-8]: 'nonvote' }).a > 127);
});
