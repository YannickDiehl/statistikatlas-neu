// Läuft nur mit der eigenen GESIS-Datei: ALLBUS_SAV=/pfad/ZA8831_v1-3-0.sav node --import tsx --test src/chapter/s02/*.test.ts
// Prüft jede feste Zahl von Sitzung 2 gegen ZA8831 v1.3.0 (ungewichtet; gezählt werden Codes und Zellen).
// Die Datei liefert die gespeicherten Codes, auch die fehlenden (−9, −11, −42 …), so wie codebook() sie unter „Missing values“ zählt.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { isMissingCode, readSav, type SavFile, type SavVariable } from '../../sandbox/readSav';
import { A2_CODES, A3, ALLBUS, LS01, MISSING, MODE, PA02A, PRINT, PV01, SEX, TYPES } from './content';

const file = process.env.ALLBUS_SAV;
const skip = !file && 'ALLBUS_SAV nicht gesetzt';
let cached: SavFile | null = null;
const load = () => {
  if (cached) return cached;
  const bytes = readFileSync(file!);
  return (cached = readSav(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)));
};
const v = (name: string) => {
  const x = load().byName.get(name);
  assert.ok(x, name);
  return x;
};
const all = () => true;
/** How often `code` is stored in a variable, optionally only for cases that `keep`. */
const count = (name: string, code: number, keep: (i: number) => boolean = all) => {
  const x = v(name).values;
  let n = 0;
  for (let i = 0; i < x.length; i++) if (x[i] === code && keep(i)) n++;
  return n;
};
const codeOf = (name: string, label: string) => {
  const hit = [...v(name).valueLabels].find(([, l]) => l === label);
  assert.ok(hit, `${name}: ${label}`);
  return hit[0];
};
const labelOf = (name: string, code: number) => v(name).valueLabels.get(code);
const mode = () => v('mode').values;
const isPaper = (i: number) => mode()[i] === 4;
const validValues = (name: string, keep: (i: number) => boolean = all) => {
  const x = v(name);
  return [...x.values].filter((y, i) => keep(i) && !isMissingCode(x, y));
};
/** Type in R after read_spss(): text, number with labels (value labels or user missing values), or plain number. */
const typeOf = (x: SavVariable) => x.kind === 'string' ? 'chr' : (x.valueLabels.size || x.missing.values.length || x.missing.range) ? 'dbl+lbl' : 'dbl';

test('the plate: 5.246 rows, 579 towers, 3.037.434 stones; the first nine names', { skip }, () => {
  const f = load();
  assert.deepEqual([f.nCases, f.variables.length, f.nCases * f.variables.length], [ALLBUS.rows, ALLBUS.cols, ALLBUS.cells]);
  assert.deepEqual(f.variables.slice(0, 9).map(x => x.name), PRINT.firstNames);
});

test('R lesen: sex codes and filter(sex == 2)', { skip }, () => {
  for (const [code, label] of SEX.labels) assert.equal(labelOf('sex', code), label);
  assert.equal(codeOf('sex', 'FRAU'), SEX.female);
  assert.equal(count('sex', 2), SEX.femaleRows);
});

test('task 1: mode codes, rows per mode, share on paper, mean age paper and online', { skip }, () => {
  assert.equal(v('mode').label, MODE.label);
  for (const [code, label] of MODE.labels) assert.equal(labelOf('mode', code), label);
  for (const [code, n] of Object.entries(MODE.n)) assert.equal(count('mode', Number(code)), n, `mode ${code}`);
  assert.equal(Math.round(MODE.n[4] / ALLBUS.rows * 1000) / 10, MODE.paperShare);
  const meanAge = (m: number) => { const a = validValues('age', i => mode()[i] === m); return Math.round(a.reduce((s, x) => s + x, 0) / a.length); };
  assert.deepEqual([meanAge(4), meanAge(3)], [MODE.meanAge.paper, MODE.meanAge.online]);
});

test('foundation 2: pa02a, pv01 and ls01 in the codebook', { skip }, () => {
  const f = load();
  assert.equal(f.variables.indexOf(v('pa02a')) + 1, PA02A.position);
  assert.equal(v('pa02a').label, PA02A.label);
  for (const [code, label] of PA02A.labels) assert.equal(labelOf('pa02a', code), label);
  for (const m of PA02A.missing) {
    assert.equal(labelOf('pa02a', m.code), m.label);
    assert.equal(count('pa02a', m.code), m.n);
  }
  for (const [code, label] of PV01.codes) assert.equal(labelOf('pv01', code), label);
  assert.equal(labelOf('pv01', 5), undefined, 'no code 5');
  assert.deepEqual([count('pv01', 42), count('pv01', 6), count('pv01', -8)], [PV01.afd, PV01.linke, PV01.dontKnow]);
  const pv = validValues('pv01');
  assert.equal(Math.round(pv.reduce((s, x) => s + x, 0) / pv.length * 10) / 10, PV01.meanOfCodes);
  assert.deepEqual([labelOf('ls01', 0), labelOf('ls01', 10), labelOf('ls01', 5)], [LS01.low, LS01.high, '..']);
});

test('foundation 1b and 3: empty stones and reasons', { skip }, () => {
  assert.deepEqual([count('ls01', 0), count('ls01', -9), count('ls01', -42)], [LS01.zero, LS01.noAnswer, LS01.multiple]);
  const ls = v('ls01');
  assert.equal(ls.values.length, ALLBUS.rows);
  assert.equal([...ls.values].filter(y => isMissingCode(ls, y)).length, LS01.empty);
  assert.equal(count('ps03', -11), MISSING.ps03Split);
  assert.equal(count('ps03', -11, i => v('splt23_1').values[i] === 2), MISSING.ps03Split, 'only version B');
  assert.equal(count('splt23_1', 2), MISSING.ps03Split, 'all of version B');
  assert.equal(labelOf('splt23_1', 2), 'SPLIT B');
  assert.equal(count('dw15', -10), MISSING.dw15Filter);
  assert.equal(count('rh08b', -6), MISSING.rh08bUnknown);
  for (const [name, code, label] of [['rh08b', -6, 'KENNE ICH NICHT'], ['pv01', -8, 'WEISS NICHT'], ['ls01', -9, 'KEINE ANGABE'], ['dw15', -10, 'TNZ: FILTER'], ['ps03', -11, 'TNZ: SPLIT'], ['ls01', -42, 'DATENFEHLER: MFN']] as const) {
    assert.equal(labelOf(name, code), label, `${name} ${code}`);
  }
  // 17 verschiedene fehlende Codes, die im Datensatz vorkommen (so zählt sie read_spss() als na_tag_map)
  const codes = new Set<number>();
  for (const x of load().variables) if (x.kind === 'numeric') for (const y of x.values) if (Number.isFinite(y) && isMissingCode(x, y)) codes.add(y);
  assert.equal(codes.size, MISSING.distinctCodes);
});

test('task 2: codebook facts of the made-up sheet; nobody has this row', { skip }, () => {
  const age = v('age');
  assert.deepEqual([...age.valueLabels.keys()].filter(k => k > 0), [], 'age has no labels for valid values');
  assert.equal(labelOf('age', A2_CODES.age.missing.code), A2_CODES.age.missing.label);
  const ages = validValues('age');
  assert.deepEqual([Math.min(...ages), Math.max(...ages)], [A2_CODES.age.min, A2_CODES.age.max]);
  assert.equal(codeOf('educ', A2_CODES.educ.pupilLabel), A2_CODES.educ.pupil);
  assert.equal(codeOf('educ', A2_CODES.educ.abiturLabel), A2_CODES.educ.abitur);
  assert.equal(codeOf('ep03', 'SCHLECHT'), A2_CODES.ep03.bad);
  assert.equal(codeOf('ep03', 'SEHR GUT'), A2_CODES.ep03.veryGood);
  assert.equal(codeOf('id02', 'ARBEITERSCHICHT'), A2_CODES.id02.working);
  assert.equal(codeOf('id02', 'KEINER DER SCHICHTEN'), A2_CODES.id02.none);
  assert.equal(count('id02', -50), A2_CODES.id02.noneN);
  assert.equal(codeOf('mstat', 'LEDIG'), A2_CODES.mstatSingle);
  const [a, e, p, d] = ['age', 'educ', 'ep03', 'id02'].map(n => v(n).values);
  let same = 0;
  for (let i = 0; i < a.length; i++) if (a[i] === 19 && e[i] === 7 && p[i] === 4 && d[i] === 2) same++;
  assert.equal(same, A2_CODES.sameRow);
});

test('task 3: −42 and −11 on paper and for everybody, versions A and B, the whole file', { skip }, () => {
  assert.deepEqual([count('pa01', -42, isPaper), count('pa01', -9, isPaper), count('st01', -42, isPaper), count('pt03', -42, isPaper)],
    [A3.paper.pa01Multiple, A3.paper.pa01NoAnswer, A3.paper.st01Multiple, A3.paper.pt03Multiple]);
  assert.deepEqual([count('st01', -11, isPaper), count('pt03', -11, isPaper)], [A3.paper.st01Split, A3.paper.pt03Split]);
  assert.equal(A3.paper.st01Split + A3.paper.pt03Split, MODE.n[4]);
  assert.equal(count('st01', -8, isPaper), 0, 'no −8 for st01 on paper');
  assert.deepEqual([count('pa01', -42), count('st01', -11), count('pt03', -11), count('pa01', -9)],
    [A3.all.pa01Multiple, A3.all.st01Split, A3.all.pt03Split, A3.all.pa01NoAnswer]);
  assert.equal(count('pa01', -42, i => mode()[i] !== 4), A3.otherModesMultiple);
  const split = v('splt23_1').values, st = v('st01').values, pt = v('pt03').values;
  assert.deepEqual([count('splt23_1', 1, isPaper), count('splt23_1', 2, isPaper)], [A3.versionA, A3.versionB]);
  let a = 0, b = 0, both = 0;
  for (let i = 0; i < st.length; i++) if (isPaper(i)) {
    if (split[i] === 1 && st[i] === -11) a++;
    if (split[i] === 2 && pt[i] === -11) b++;
    if (st[i] === -11 && pt[i] === -11) both++;
  }
  assert.deepEqual([a, b, both], [A3.versionA, A3.versionB, 0]);
  const online = (i: number) => mode()[i] === 3;
  assert.deepEqual([count('st01', -11, online), count('pt03', -11, online)], [A3.online.st01Split, A3.online.pt03Split]);
  assert.equal(count('st01', -11, i => mode()[i] === 2), 0, 'interview: everybody got st01');
  // −42 im ganzen Datensatz
  const f = load();
  let cells = 0, vars = 0;
  const rows = new Set<number>();
  for (const x of f.variables) {
    if (x.kind !== 'numeric') continue;
    let here = 0;
    x.values.forEach((y, i) => { if (y === -42) { here++; rows.add(i); } });
    cells += here;
    if (here) vars++;
  }
  const paperRows = [...rows].filter(isPaper).length;
  assert.deepEqual([cells, vars, paperRows, rows.size - paperRows], [A3.multiple.cells, A3.multiple.variables, A3.multiple.paperSheets, 0]);
  assert.equal(Math.round(paperRows / MODE.n[4] * 1000) / 10, A3.multiple.share);
});

test('foundation 4 and task 4: types and the identification number', { skip }, () => {
  const types = load().variables.map(typeOf);
  assert.deepEqual([types.filter(t => t === 'dbl+lbl').length, types.filter(t => t === 'chr').length, types.filter(t => t === 'dbl').length],
    [TYPES.labelled, TYPES.character, TYPES.double]);
  assert.deepEqual(['respid', 'doi', 'mode'].map(n => typeOf(v(n))), ['dbl', 'chr', 'dbl+lbl']);
  assert.equal(new Set(v('respid').values).size, TYPES.respidDistinct);
  assert.equal(labelOf('eastwest', 2), 'NEUE BUNDESLAENDER');
  assert.equal(labelOf('st01', 3), 'KOMMT DARAUF AN');
});

// Nicht in TypeScript nachgerechnet: wie viele Türme ein Ausdruck bei Breite 80 zeigt (8 bei allbus, 9 bei papier,
// „571 / 570 more variables“) und die gekürzte Zelle „4 [MAI…“. Das hängt von tibbles Spaltenbreiten der ersten zehn
// Reihen ab; sitzung02-zahlen.R prüft es mit capture.output(print(…)). Hier nur die Summe als Gegenprobe.
test('printout at width 80: visible plus more variables are all 579 towers', () => {
  assert.equal(PRINT.allbus.visible + PRINT.allbus.more, ALLBUS.cols);
  assert.equal(PRINT.papier.visible + PRINT.papier.more, ALLBUS.cols);
  assert.equal(PRINT.firstNames[PRINT.allbus.visible], PRINT.allbus.next);
});
