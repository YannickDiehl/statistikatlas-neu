// Läuft nur mit der eigenen GESIS-Datei: ALLBUS_SAV=/pfad/ZA8831_v1-3-0.sav node --import tsx --test src/chapter/s03/*.test.ts
// Prüft jede feste Zahl von Sitzung 3 gegen ZA8831 v1.3.0 (ungewichtet; CDU/CSU zusätzlich gewichtet mit wghtpew, wie
// frequency(pv01, weights = wghtpew)). Gültig heißt: kein Missing-Code, kein Systemmissing. Prozentwerte rundet der Test
// wie mariposa auf zwei Stellen; Cum. % aus den kumulierten Häufigkeiten. Die Rechnungen mit Beispielzahlen (Steine,
// Haushalte) prüft content.test.ts.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { isMissingCode, readSav, type SavFile } from '../../sandbox/readSav';
import { DH04, DW19, EP04, ID02_NONE, LA01, PV01, RD01, ST01 } from './content';

const file = process.env.ALLBUS_SAV;
const skip = !file && 'ALLBUS_SAV nicht gesetzt';
let cached: SavFile | null = null;
const load = () => {
  if (cached) return cached;
  const bytes = readFileSync(file!);
  return (cached = readSav(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)));
};
const column = (name: string) => {
  const v = load().byName.get(name);
  assert.ok(v, name);
  return v;
};
const valid = (name: string) => { const v = column(name); return [...v.values].filter(x => !isMissingCode(v, x)); };
const missing = (name: string) => { const v = column(name); return [...v.values].filter(x => isMissingCode(v, x)).length; };
const codeCount = (name: string, code: number) => [...column(name).values].filter(x => x === code).length;
const codeOf = (name: string, label: string) => {
  const hit = [...column(name).valueLabels].find(([, l]) => l.trim() === label);
  assert.ok(hit, `${name}: ${label}`);
  return hit[0];
};
const r2 = (x: number) => Math.round(x * 100) / 100;
const r3 = (x: number) => Math.round(x * 1000) / 1000;
const count = (xs: number[], v: number) => xs.filter(x => x === v).length;
const sorted = (xs: number[]) => [...xs].sort((a, b) => a - b);
const median = (xs: number[]) => { const s = sorted(xs), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
const sd = (xs: number[]) => { const m = mean(xs); return Math.sqrt(xs.reduce((a, x) => a + (x - m) ** 2, 0) / (xs.length - 1)); };
/** Schiefe wie SPSS und mariposa (G1 mit Korrektur für kleine Stichproben). */
const skewness = (xs: number[]) => {
  const n = xs.length, m = mean(xs), s = sd(xs);
  return n / ((n - 1) * (n - 2)) * xs.reduce((a, x) => a + ((x - m) / s) ** 3, 0);
};
const quantile7 = (xs: number[], p: number) => { const s = sorted(xs), h = (s.length - 1) * p, lo = Math.floor(h); return s[lo] + (h - lo) * ((s[lo + 1] ?? s[lo]) - s[lo]); };
/** Cum. % bis einschließlich `upTo`, wie frequency() es druckt. */
const cumPct = (xs: number[], upTo: number) => r2(xs.filter(x => x <= upTo).length / xs.length * 100);

test('la01: every cell of the table in Grundlage 1b', { skip }, () => {
  const xs = valid('la01'), total = column('la01').values.length;
  assert.equal(total, LA01.total);
  assert.equal(xs.length, LA01.valid);
  for (const row of LA01.rows) {
    assert.equal(codeOf('la01', row.label), row.value, row.label);
    const n = count(xs, row.value);
    assert.deepEqual([n, r2(n / total * 100), r2(n / xs.length * 100), cumPct(xs, row.value)], [row.n, row.raw, row.valid, row.cum], row.label);
  }
  for (const m of LA01.missing) assert.deepEqual([codeCount('la01', m.value), r2(codeCount('la01', m.value) / total * 100)], [m.n, m.raw], m.label);
  assert.equal(missing('la01'), LA01.totalMissing);
  assert.deepEqual([r2(xs.length / total * 100), r2(LA01.totalMissing / total * 100)], [LA01.rawValid, LA01.rawMissing]);
  assert.equal(r2(mean(xs)), LA01.mean);
  assert.equal(LA01.header, `# total N=${total} valid N=${xs.length} mean=${mean(xs).toFixed(2)} sd=${sd(xs).toFixed(2)} skewness=${skewness(xs).toFixed(2)}`);
  assert.equal(median(xs), 3);
});

test('ep04: valid, missing by reason, rows, mode and median (task 1)', { skip }, () => {
  const xs = valid('ep04'), total = 5246;
  assert.equal(xs.length, EP04.valid);
  assert.equal(missing('ep04'), EP04.totalMissing);
  assert.deepEqual([codeCount('ep04', -42), codeCount('ep04', -9), codeCount('ep04', -8)], [EP04.missing.dataError, EP04.missing.noAnswer, EP04.missing.dontKnow]);
  for (const row of EP04.rows) {
    assert.equal(codeOf('ep04', row.label), row.value, row.label);
    const n = count(xs, row.value);
    assert.deepEqual([n, r2(n / total * 100), r2(n / xs.length * 100), cumPct(xs, row.value)], [row.n, row.raw, row.valid, row.cum], row.label);
  }
  const counts = EP04.rows.map(r => r.n);
  assert.equal(EP04.rows[counts.indexOf(Math.max(...counts))].label, 'ETWAS SCHLECHTER');
  assert.equal(median(xs), 3);
  assert.equal(r2(mean(xs)), EP04.mean);
  assert.equal(EP04.header, `# total N=${total} valid N=${xs.length} mean=${mean(xs).toFixed(2)} sd=${sd(xs).toFixed(2)} skewness=${skewness(xs).toFixed(2)}`);
});

test('st01: answers, bases and missing reasons (Grundlage 2)', { skip }, () => {
  const xs = valid('st01'), total = 5246;
  const groups = [['MAN KANN TRAUEN', ST01.trust], ['MUSS VORSICHTIG SEIN', ST01.careful], ['KOMMT DARAUF AN', ST01.depends], ['SONSTIGES', ST01.other]] as const;
  for (const [label, g] of groups) {
    const n = count(xs, codeOf('st01', label));
    assert.deepEqual([n, r2(n / total * 100), r2(n / xs.length * 100)], [g.n, g.raw, g.valid], label);
  }
  assert.equal(xs.length, ST01.valid);
  assert.equal(missing('st01'), ST01.totalMissing);
  assert.equal(r2(ST01.totalMissing / total * 100), ST01.rawMissing);
  assert.deepEqual([codeCount('st01', -11), codeCount('st01', -42), codeCount('st01', -9), codeCount('st01', -8)],
    [ST01.missing.split, ST01.missing.dataError, ST01.missing.noAnswer, ST01.missing.dontKnow]);
  assert.equal(r2(ST01.depends.n / (ST01.valid + ST01.missing.dontKnow) * 100), ST01.ownBase);
});

test('pv01: CDU/CSU three ways, missing reasons, parties and the weighted comparison (task 2)', { skip }, () => {
  const v = column('pv01'), xs = valid('pv01'), total = 5246;
  const cdu = codeOf('pv01', 'CDU-CSU'), n = count(xs, cdu);
  assert.deepEqual([n, r2(n / total * 100), r2(n / xs.length * 100)], [PV01.cdu.n, PV01.cdu.raw, PV01.cdu.valid]);
  assert.equal(xs.length, PV01.valid);
  assert.equal(missing('pv01'), PV01.totalMissing);
  assert.equal(r2(PV01.totalMissing / total * 100), PV01.rawMissing);
  const m = PV01.missing;
  assert.deepEqual([codeCount('pv01', -50), codeCount('pv01', -42), codeCount('pv01', -9), codeCount('pv01', -8), codeCount('pv01', -7)],
    [m.notEligible, m.dataError, m.noAnswer, m.dontKnow, m.refused]);
  assert.equal(r2(m.dontKnow / total * 100), PV01.dontKnowRaw);
  assert.deepEqual([count(xs, codeOf('pv01', 'AFD')), count(xs, codeOf('pv01', 'FDP')), count(xs, codeOf('pv01', 'DIE LINKE')), count(xs, codeOf('pv01', 'DIE GRUENEN'))],
    [PV01.parties.afd, PV01.parties.fdp, PV01.parties.linke, PV01.parties.gruene]);
  assert.equal(r2(mean(xs)), PV01.mean);
  const dk = PV01.missing.dontKnow;
  assert.equal(dk, 603);
  assert.ok(dk > PV01.parties.afd && dk > PV01.parties.fdp && dk > PV01.parties.linke && dk < PV01.parties.gruene);
  assert.equal(r2(603 / (3984 + 603) * 100), 13.15);
  assert.equal(r2(PV01.parties.afd / (3984 + 603) * 100), 10.46);
  const w = column('wghtpew').values;
  let wCdu = 0, wAll = 0;
  v.values.forEach((x, i) => { if (!isMissingCode(v, x)) { wAll += w[i]; if (x === cdu) wCdu += w[i]; } });
  assert.equal(r2(wCdu / wAll * 100), PV01.cduValidWeighted);
});

test('dh04: describe() line, Valid % and Cum. % by household size, −32 (Grundlagen 3c and 4)', { skip }, () => {
  const xs = valid('dh04'), d = DH04.describe;
  assert.deepEqual([r3(mean(xs)), median(xs), r3(sd(xs)), Math.max(...xs) - Math.min(...xs), quantile7(xs, 0.75) - quantile7(xs, 0.25), r3(skewness(xs)), xs.length, missing('dh04')],
    [d.mean, d.median, d.sd, d.range, d.iqr, d.skewness, d.n, d.missing]);
  assert.equal(codeCount('dh04', -32), DH04.notGenerable);
  [1, 2, 3, 4, 5].forEach((k, i) => {
    assert.equal(r2(count(xs, k) / xs.length * 100), DH04.valid[i], `${k} Valid %`);
    assert.equal(cumPct(xs, k), DH04.cum[i], `${k} Cum. %`);
  });
  assert.equal(r2(xs.filter(x => x > d.mean).length / xs.length * 100), DH04.aboveMean);
});

test('rd01: mean in the header and Cum. % at codes 4 and 5 (Grundlage 3b)', { skip }, () => {
  const xs = valid('rd01');
  assert.equal(r2(mean(xs)), RD01.mean);
  assert.equal(cumPct(xs, 4), RD01.cumCode4);
  assert.equal(cumPct(xs, 5), RD01.cumCode5);
  assert.deepEqual([codeOf('rd01', 'EVANG.OHNE FREIKIRCH'), codeOf('rd01', 'ROEMISCH-KATHOLISCH'), codeOf('rd01', 'KEINER RELIGIONSGEM.')], [1, 3, 6]);
});

test('dw19: describe(), missing reasons, Cum. % around the mean, above the mean (tasks 3 and 4)', { skip }, () => {
  const xs = valid('dw19');
  assert.deepEqual([r3(mean(xs)), median(xs), xs.length, missing('dw19'), Math.max(...xs)], [DW19.mean, DW19.median, DW19.n, DW19.missing, DW19.max]);
  assert.deepEqual([codeCount('dw19', -10), codeCount('dw19', -9), codeCount('dw19', -41)],
    [DW19.missingParts.filter, DW19.missingParts.noAnswer, DW19.missingParts.dataError]);
  for (const [week, c] of Object.entries(DW19.cum)) assert.equal(cumPct(xs, Number(week)), c, `Cum. % bei ${week}`);
  assert.equal(xs.filter(x => x > DW19.mean).length, DW19.above);
  assert.equal(r2(DW19.above / DW19.n * 100), DW19.aboveShare);
  assert.equal(r2(100 - DW19.cum[54]), DW19.aboveShare);
});

test('Grundlage 2a: −50 KEINER DER SCHICHTEN at id02, −10 at dw19', { skip }, () => {
  assert.equal(codeCount('id02', -50), ID02_NONE);
  assert.equal(codeCount('dw19', -10), 4709);
});
