import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { MARKE } from './begriffe';

// Die Engine (lernpfad/engine/begriffe.js) ist ein schlichtes Browser-Skript: hier in einer vm mit Stub-window laden.
const datei = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../lernpfad/engine/begriffe.js');
const quelle = fs.readFileSync(datei, 'utf8');

type Teil = string | { text: string; id: string };
type Begriffe = { ohne: (text: string) => string; zerlege: (text: string) => Teil[]; karteZiel: (e: { karte?: string; kapitel: number }) => { kapitel: number; id: string } | null };

function laden(console: { warn: (...a: unknown[]) => void } = { warn() {} }): Begriffe {
  const window: Record<string, unknown> = {
    BEGRIFFE: {
      klasse: { name: 'Klasse', alias: ['Klassen'], fach: 'f', kurz: 'k', kapitel: 4 },
      median: { name: 'Median', fach: 'f', kurz: 'k', kapitel: 3 },
    },
    KMETA: { nr: 4, titel: 'Daten sehen', kapitel: 'k04', begriffe: [] },
  };
  vm.runInNewContext(quelle, { window, console });
  return window.Begriffe as Begriffe;
}
// Ergebnisse aus der vm in gewöhnliche Werte überführen (anderer Realm → deepStrictEqual sonst ungleich).
const zerlege = (s: string): Teil[] => JSON.parse(JSON.stringify(laden().zerlege(s)));

test('zerlege macht aus einer Marke mit id einen Begriff', () => {
  assert.deepEqual(zerlege('a ⟪Klassen|klasse⟫ b'), ['a ', { text: 'Klassen', id: 'klasse' }, ' b']);
});
test('zerlege lässt R-Code mit eckigen Klammern unverändert', () => {
  assert.deepEqual(zerlege("x[['a']]"), ["x[['a']]"]);
});
test('zerlege macht aus unbekannter id bloßen Text', () => {
  assert.deepEqual(zerlege('⟪Foo|gibtsnicht⟫'), ['Foo']);
  assert.deepEqual(zerlege('a ⟪Foo|gibtsnicht⟫ b'), ['a Foo b']);
});
test('zerlege löst Marken ohne id über Name und Alias auf', () => {
  assert.deepEqual(zerlege('⟪Klassen⟫ und ⟪median⟫'), [{ text: 'Klassen', id: 'klasse' }, ' und ', { text: 'median', id: 'median' }]);
  assert.deepEqual(zerlege('⟪Mitte⟫'), ['Mitte']);
});
test('zerlege lässt Werkstatt-Lücken ⟦…⟧ als bloßen Text stehen', () => {
  assert.deepEqual(zerlege('filter(eastwest == ⟦2⟧)'), ['filter(eastwest == ⟦2⟧)']);
  assert.deepEqual(zerlege('⟦Klassen|klasse⟧'), ['⟦Klassen|klasse⟧']);
});
test('zerlege ohne Verzeichnis: nur Text', () => {
  const window: Record<string, unknown> = {};
  vm.runInNewContext(quelle, { window });
  assert.deepEqual(JSON.parse(JSON.stringify((window.Begriffe as Begriffe).zerlege('⟪Klassen|klasse⟫!'))), ['Klassen!']);
});
test('Engine nutzt dieselbe Marken-Regex wie src/lib/begriffe.ts', () => {
  const m = quelle.match(/const MARKE = (\/.+\/[a-z]*);/);
  assert.ok(m, 'const MARKE = /…/g; in lernpfad/engine/begriffe.js');
  assert.equal(m[1], String(MARKE));
});
test('zerlege warnt einmal je unbekannter Marke, nie bei bekannter id', () => {
  const meldungen: string[] = [];
  const b = laden({ warn: (m: unknown) => meldungen.push(String(m)) });
  b.zerlege('⟪Klassen|klasse⟫ und ⟪Median⟫');
  assert.equal(meldungen.length, 0);
  b.zerlege('a ⟪Foo|gibtsnicht⟫ b');
  b.zerlege('noch einmal ⟪Foo|gibtsnicht⟫');
  assert.equal(meldungen.length, 1);
  assert.match(meldungen[0], /⟪Foo\|gibtsnicht⟫/);
  assert.match(meldungen[0], /bloßer Text/);
  b.zerlege('⟪Mitte⟫ und ⟦2⟧');
  assert.equal(meldungen.length, 2);
  assert.match(meldungen[1], /⟪Mitte⟫/);
});

test('karteZiel: eigene Kapitelnummer, Präfix kNN: oder nichts', () => {
  const z = (e: { karte?: string; kapitel: number }) => JSON.parse(JSON.stringify(laden().karteZiel(e)));
  assert.deepEqual(z({ karte: 'k3-kisten', kapitel: 4 }), { kapitel: 4, id: 'k3-kisten' });
  assert.deepEqual(z({ karte: 'k07:k1-ci', kapitel: 4 }), { kapitel: 7, id: 'k1-ci' });
  assert.equal(z({ kapitel: 4 }), null);
  assert.equal(z({ karte: '', kapitel: 4 }), null);
  assert.equal(z({ karte: 'k07:', kapitel: 4 }), null);
});

test('ohne ersetzt Marken durch ihren Text und lässt ⟦…⟧ unberührt', () => {
  const b = laden();
  assert.equal(b.ohne('a ⟪Klassen|klasse⟫ und ⟪Median⟫ b'), 'a Klassen und Median b');
  assert.equal(b.ohne('⟪Foo|gibtsnicht⟫ filter(x == ⟦2⟧)'), 'Foo filter(x == ⟦2⟧)');
  assert.equal(b.ohne("x[['a']]"), "x[['a']]");
});

test('Journal: Ergebnistext aus Kapitelstrings bleibt ohne Marken (ohne)', () => {
  const b = laden();
  const zeilen = ['Vermutet hatte ich: ⟪Median|median⟫.', 'Mitte: ⟪Klassen|klasse⟫ zählen'];
  assert.equal(b.ohne('Ergebnis\n' + zeilen.join('\n')), 'Ergebnis\nVermutet hatte ich: Median.\nMitte: Klassen zählen');
  assert.equal(b.ohne('⟦2⟧ bleibt'), '⟦2⟧ bleibt');
});
