import test from 'node:test';
import assert from 'node:assert/strict';
import type { Eintrag } from './begriffe';

// Das Prüfskript ist .mjs ohne Typen: dynamisch laden.
const modulPfad = '../../scripts/begriffe-pruefen.mjs';
const { pruefeText, pruefeEintraege, pruefeQuelle, pruefeKapitelInhalt, exitCode, kartenIds } = (await import(modulPfad)) as {
  pruefeText: (t: string, v: Record<string, Eintrag>, ort: string, opt?: { begriffe?: string[]; verbot?: boolean }) => { funde: { stufe: string; text: string }[] };
  pruefeQuelle: (c: string, v: Record<string, Eintrag>, d: string, b?: string[]) => { funde: { stufe: string; text: string }[] };
  pruefeKapitelInhalt: (k: unknown, v: Record<string, Eintrag>) => { stufe: string; text: string }[];
  kartenIds: (c: string) => Set<string>;
  exitCode: (f: { stufe: string }[], streng: boolean) => number;
  pruefeEintraege: (v: Record<string, Eintrag>, kartenVon?: (nr: number) => string | null) => { stufe: string; text: string }[];
};

const klasse: Eintrag = { name: 'Klasse', fach: 'Fach.', kurz: 'Kurz.', bild: ['Kiste'], kapitel: 4 };
const median: Eintrag = { name: 'Median', fach: 'Fach.', kurz: 'Kurz.', kapitel: 3 };
const verz = { klasse, median };
const stufen = (t: string, opt = {}) => pruefeText(t, verz, 'test', opt).funde.map((f) => f.stufe);

test('unbekannte id ist ein Fehler', () => {
  assert.deepEqual(stufen('Der ⟪Wert|gibtsnicht⟫ zählt.'), ['Fehler']);
  assert.deepEqual(stufen('Der ⟪Median⟫ zählt.'), []);
});
test('Marke in Backticks ist ein Fehler', () => {
  assert.deepEqual(stufen('Rufe `⟪Median⟫` auf.'), ['Fehler']);
});
test('⟦2⟧ der Code-Werkstatt wird nie beanstandet', () => {
  assert.deepEqual(stufen('summarise(x = ⟦2⟧)'), []);
});
test('kurz mit drei Sätzen ist ein Fehler, „z. B.“ zählt nicht als Satzende', () => {
  const f = (kurz: string) => pruefeEintraege({ x: { ...median, kurz } }).map((g) => g.stufe);
  assert.deepEqual(f('Eins. Zwei. Drei.'), ['Fehler']);
  assert.deepEqual(f('Das gilt z. B. hier. Und das auch.'), []);
});
test('Bildwort ohne Fachbegriff in derselben Zeichenkette ist eine Warnung', () => {
  assert.deepEqual(stufen('Wirf es in die Kiste.', { begriffe: ['klasse'] }), ['Warnung']);
  assert.deepEqual(stufen('Die Klasse ist wie eine Kiste.', { begriffe: ['klasse'] }), []);
  assert.deepEqual(stufen('Die Kiste der ⟪Klasse|klasse⟫.', { begriffe: ['klasse'] }), []);
});
test('Marke im Titel ist ein Fehler (Quelltext, meta.json, Daten)', () => {
  const q = pruefeQuelle("{ id: 'a1', titel: 'Der ⟪Median⟫', pflicht: true }", verz, 'kapitel.js').funde.map((f) => f.stufe);
  assert.deepEqual(q, ['Fehler']);
  assert.deepEqual(pruefeQuelle("{ titel: 'Der Median' }", verz, 'kapitel.js').funde, []);
  const k = { k: 'k99', meta: { titel: 'Der ⟪Median⟫', begriffe: [] }, quellen: [], daten: { TEMPLATES: {}, X: { title: 'Der ⟪Median⟫' } } };
  assert.equal(pruefeKapitelInhalt(k, verz).filter((f) => f.stufe === 'Fehler').length, 2);
});
test('id aus meta.begriffe ohne Marke im Kapitel: Warnung, mit --streng Exit 1', () => {
  const kap = (code: string) => ({ k: 'k99', meta: { titel: 'T', begriffe: ['median'] }, quellen: [{ name: 'kapitel.js', code }], daten: null });
  const ohne = pruefeKapitelInhalt(kap("x = 'Der Median.'"), verz);
  assert.deepEqual(ohne.map((f) => f.stufe), ['Warnung']);
  assert.equal(exitCode(ohne, false), 0);
  assert.equal(exitCode(ohne, true), 1);
  assert.deepEqual(pruefeKapitelInhalt(kap("x = 'Der ⟪Median⟫.'"), verz), []);
});

test('karte: Karte im eigenen oder anderen Kapitel muss in inhalt.tsx stehen', () => {
  const quellen: Record<number, string> = { 4: '<Karte id="k1-ci">', 7: "{ id: 'k3-kisten' }" };
  const von = (nr: number) => quellen[nr] ?? null;
  const f = (karte: string, kapitel = 4) => pruefeEintraege({ x: { ...median, kapitel, karte } }, von).map((x) => x.stufe);
  assert.deepEqual(f('k1-ci'), []);
  assert.deepEqual(f('k07:k3-kisten'), []);
  assert.deepEqual(f('k3-kisten'), ['Fehler']);
  assert.deepEqual(f('k09:k1-ci'), ['Fehler']);
  assert.deepEqual(f('k07:fehlt'), ['Fehler']);
  assert.deepEqual(f('kaputt id'), ['Fehler']);
});

test('kartenIds erkennt jede Form: id="…", id: \'…\' und Paare in karten: [[…]]', () => {
  const code = `<section id="k1-jsx"> { id: 'g1', n: '1', karten: [['r1', 'Start'], ['k1-paar', "Titel, mit Komma"]] }, { id: 'g2', karten: [["k2-zwei", 'x']] }`;
  const ids = kartenIds(code);
  for (const id of ['k1-jsx', 'g1', 'r1', 'k1-paar', 'g2', 'k2-zwei']) assert.ok(ids.has(id), id);
  assert.ok(!ids.has('Start') && !ids.has('Titel, mit Komma'));
});
test('karte: Paar in karten: [[…]] zählt als vorhandene Karte', () => {
  const von = () => "{ id: 'vorweg', karten: [['r1', 'A'], ['r2', 'Die Pipe']] }";
  const f = (karte: string) => pruefeEintraege({ x: { ...median, kapitel: 2, karte } }, von).map((x) => x.stufe);
  assert.deepEqual(f('r2'), []);
  assert.deepEqual(f('r9'), ['Fehler']);
});

test('Marke zwischen zwei Inline-Code-Spans ist kein Backtick-Fehlalarm, in einem Paar schon', () => {
  const f = (c: string) => pruefeQuelle(c, verz, 'kapitel.js').funde.map((x) => x.stufe);
  assert.deepEqual(f("x = 'Mit `a` zählst du ⟪Median⟫, mit `b` nicht.'"), []);
  assert.deepEqual(f("x = 'Mit `a ⟪Median⟫ b` nicht.'"), ['Fehler']);
  assert.deepEqual(f("x = `Der ⟪Median⟫ ${n} und `"), []);
});
test('SCRIPT: kein Bildwort-Warnung, Marke bleibt Fehler', () => {
  const kap = (daten: unknown) => ({ k: 'k99', meta: { titel: 'T', begriffe: ['klasse'] }, quellen: [{ name: 'kapitel.js', code: "x = '⟪Klasse|klasse⟫'" }], daten });
  assert.deepEqual(pruefeKapitelInhalt(kap({ SCRIPT: 'Kiste = 1' }), verz), []);
  assert.deepEqual(pruefeKapitelInhalt(kap({ HILFE: 'Kiste' }), verz).map((f) => f.stufe), ['Warnung']);
  assert.deepEqual(pruefeKapitelInhalt(kap({ SCRIPT: '# ⟪Median⟫' }), verz).map((f) => f.stufe), ['Fehler']);
});
test('BILD in kapitel.js: Marke ist ein Fehler, sonst nicht', () => {
  const f = (c: string, d = 'k99 lernpfad/kapitel/k99/kapitel.js') => pruefeQuelle(c, verz, d).funde.map((x) => x.stufe);
  assert.deepEqual(f("const BILD = {\n a: 'Der ⟪Median⟫ { }', b: 'x',\n};\nconst T = 'Der ⟪Median⟫';"), ['Fehler']);
  assert.deepEqual(f("const BILD = {\n a: 'Der Median',\n};\nconst T = 'Der ⟪Median⟫';"), []);
  assert.deepEqual(f("const BILD = {};"), []);
});
test('interne Kennungen (value, target, match, id): keine Bildwort-Warnung, Marke ist Fehler', () => {
  const kap = (daten: unknown) => ({ k: 'k99', meta: { titel: 'T', begriffe: ['klasse'] }, quellen: [], daten });
  // „nicht benutzt“-Hinweise des Kapitels außer Acht lassen: nur Bildwort-Warnungen und Fehler zählen.
  const stufen2 = (d: unknown) => pruefeKapitelInhalt(kap(d), verz).filter((f) => f.stufe === 'Fehler' || /Bildwort/.test(f.text)).map((f) => f.stufe);
  assert.deepEqual(stufen2({ QUESTIONS: [{ options: [{ value: 'Kiste' }, { value: 'x', label: 'Kiste' }] }] }), ['Warnung']);
  assert.deepEqual(stufen2({ REQUIRED: [{ target: 'Kiste', match: 'Kiste', id: 'Kiste' }] }), []);
  assert.deepEqual(stufen2({ QUESTIONS: [{ options: [{ value: '⟪X|klasse⟫' }] }] }), ['Fehler']);
});

test('Marke in Verzeichnisfeldern ist ein Fehler', () => {
  for (const feld of ['name', 'fach', 'kurz']) {
    assert.deepEqual(pruefeEintraege({ x: { ...median, [feld]: 'Der ⟪Median⟫.' } }).map((g) => g.stufe), ['Fehler']);
  }
  assert.deepEqual(pruefeEintraege({ x: { ...median, bild: ['⟪Kiste⟫'] } }).map((g) => g.stufe), ['Fehler']);
  assert.deepEqual(pruefeEintraege({ x: { ...median, alias: ['⟪M⟫'] } }).map((g) => g.stufe), ['Fehler']);
  assert.deepEqual(pruefeEintraege({ x: median }), []);
});
test('PREDICTIONS.options: Marke ist Fehler, Bildwort ohne Warnung', () => {
  const kap = (daten: unknown) => ({ k: 'k99', meta: { titel: 'T', begriffe: ['klasse'] }, quellen: [], daten });
  const f = (daten: unknown) => pruefeKapitelInhalt(kap(daten), verz).filter((x) => x.stufe !== 'Warnung' || !/nirgends/.test(x.text)).map((x) => x.stufe);
  assert.deepEqual(f({ PREDICTIONS: [{ options: ['Eine ⟪Klasse|klasse⟫'] }] }), ['Fehler']);
  assert.deepEqual(f({ PREDICTIONS: [{ options: ['Die Kiste'] }] }), []);
});
