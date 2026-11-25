import test from 'node:test';
import assert from 'node:assert/strict';
import { ohneMarken, aufloesen, markenEntfernen, type Eintrag } from './begriffe';

const median: Eintrag = { name: 'Median', fach: 'Median', kurz: 'Mitte', kapitel: 4 };

test('ohneMarken ersetzt Marken durch ihren Text', () => {
  assert.equal(ohneMarken('Die ⟪Klassen|klasse⟫ und der ⟪Median⟫'), 'Die Klassen und der Median');
});
test('ohneMarken lässt Code unverändert', () => {
  assert.equal(ohneMarken("x[['a']] [[1]]"), "x[['a']] [[1]]");
  assert.equal(ohneMarken("[['na','NA']]"), "[['na','NA']]");
});
test('aufloesen nutzt id, name oder alias', () => {
  assert.equal(aufloesen('Median', undefined, { median }), 'median');
  assert.equal(aufloesen('median', undefined, { median }), 'median');
  assert.equal(aufloesen('Mitte', undefined, { m: { ...median, alias: ['Mitte'] } }), 'm');
  assert.equal(aufloesen('Medians', undefined, { median }), null);
  assert.equal(aufloesen('x', 'klasse', {}), null);
  assert.equal(aufloesen('x', 'median', { median }), 'median');
});
const S = process.cwd() + '/src/';
test('Plugin entfernt Marken nur unter src/ der Wurzel', () => {
  const p = markenEntfernen() as unknown as { transform: (c: string, id: string) => unknown };
  const code = 'const a = "⟪Kisten|klasse⟫";';
  const r = p.transform(code, S + 'chapter/s04/content.ts') as { code: string };
  assert.equal(r.code, 'const a = "Kisten";');
  assert.equal(p.transform(code, '/x/node_modules/foo/src/a.ts?x'), undefined);
  assert.equal(p.transform(code, '/fremd/src/a.ts'), undefined);
  assert.equal(p.transform(code, process.cwd() + '/scripts/a.ts'), undefined);
  assert.equal(p.transform('const a = 1;', S + 'a.ts'), undefined);
  assert.equal(p.transform(code, S + 'a.css'), undefined);
});
test('ohneMarken lässt Marken über Zeilenumbrüche hinweg unverändert', () => {
  assert.equal(ohneMarken('⟪a\nb⟫'), '⟪a\nb⟫');
});
test('aufloesen kennt keine Prototyp-Schlüssel als id', () => {
  assert.equal(aufloesen('x', 'toString', { median }), null);
  assert.equal(aufloesen('x', 'constructor', { median }), null);
});
test('Werkstatt-Lücken ⟦…⟧ bleiben unberührt', () => {
  assert.equal(ohneMarken('⟦0.66⟧'), '⟦0.66⟧');
  assert.equal(ohneMarken('allbus %>% filter(eastwest == ⟦2⟧)'), 'allbus %>% filter(eastwest == ⟦2⟧)');
  const p = markenEntfernen() as unknown as { transform: (c: string, id: string) => unknown };
  assert.equal(p.transform('const s = "x ⟦2⟧ y";', S + 'chapter/s02/content.ts'), undefined);
  assert.equal(p.transform('const r = /⟦(.*?)⟧/g;', S + 'chapter/workshop/editor.ts'), undefined);
});
