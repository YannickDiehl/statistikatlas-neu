import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { fakeSav, fixtureSav } from '../../sandbox/testData';
import { renderSession } from '../testRender';
import { inputById } from './content';
import { initialS08, leveneVariants, machineFor, playPoints, prepare, spread, variants, type Variant } from './domain';
import { Quadrate } from './Quadrate';

const render = (state: object) => renderSession(8, true, { tasks: { s08: { ...initialS08(), ...state } } });
const p = prepare(fixtureSav()), vars = variants(p, inputById.pt03);
const get = (kind: Variant['kind']) => vars.find(v => v.kind === kind)!;
const f3 = (x: number) => x.toFixed(3).replace('.', ',').replace('-', '−');
const main = get('main');
const setting = { input: 'pt03', a: f3(main.a), b: f3(main.b), r2: f3(main.r2) };
const machine = machineFor(p, inputById.pt03, main, setting), sp = spread(machine);

test('session 9 starts with the brief in the visitor centre and the choice of the question', () => {
  const html = renderSession(8);
  assert.match(html, /Dein neuer Job: Technik im Besucherzentrum des Landtags\./);
  assert.match(html, /Die Kuratorin Ida Lorenzen schreibt dir/);
  assert.match(html, /10 · Vertrauen in den Bundestag/);
  assert.doesNotMatch(html, /Automat einstellen/);
  assert.doesNotMatch(html, /fiktiv/i);
  assert.match(html, /FÜR DAS PLENUM/);
  // Rollentext: Faulpelz einmal erklärt, Leitfrage und Lernziel
  assert.match(html, /„Faulpelz“<\/strong> an\. Er rechnet gar nicht: Er zeigt allen denselben Durchschnitt/);
  assert.match(html, /Die Leitfrage: <strong>/);
  assert.match(html, /<strong>Was du dabei lernst:<\/strong>/);
  assert.match(html, /So gehst du vor/);
  assert.doesNotMatch(html, /Das Wichtigste aus dieser Sitzung/);
});

test('session 9 shows the toolbox: new and known tools, examples on neutral variables, pipe style', () => {
  const html = renderSession(8);
  assert.match(html, /DEIN WERKZEUGKASTEN/);
  for (const fn of ['linear_regression()', 'group_by()', 'levene_test()']) assert.match(html, new RegExp(`<code>${fn.replace(/[()]/g, '\\$&')}</code><span class="task-toolbox-new">neu</span>`), fn);
  assert.match(html, /<code>library\(\), read_spss\(\), %&gt;%, codebook\(\)<\/code> kennst du aus Sitzung 1 und 4/);
  assert.match(html, /<code>mutate\(\) \+ rec\(\)<\/code> kennst du aus Sitzung 5/);
  assert.match(html, /<code>weights = wghtpew<\/code> kennst du aus Sitzung 6/);
  assert.match(html, /library\(tidyverse\)\nlibrary\(mariposa\)/);
  // Pipe-Stil (im HTML steht %>% als %&gt;%)
  assert.match(html, /modell &lt;- allbus %&gt;%\n  linear_regression\(ausblick ~ pt12, weights = wghtpew\)/);
  assert.match(html, /allbus %&gt;%\n  group_by\(pt12\) %&gt;%\n  describe\(residuum, weights = wghtpew\)/);
  assert.match(html, /allbus %&gt;%\n  levene_test\(residuum, group = pt12, weights = wghtpew\)/);
  assert.doesNotMatch(html, /\|&gt;|library\(dplyr\)|demokratie ~|ps03, rules|nach_vertrauen/);
  assert.doesNotMatch(html.replace(/codebook\(allbus\)/g, ''), /\(allbus\b/);
});

test('no automaton numbers before the own setting is recognised; testing opens afterwards', () => {
  const chosen = render({ input: 'pt03' });
  assert.match(chosen, /2 · Deine Gerade zuerst/);
  assert.match(chosen, /3 · Automat einstellen \(R\)/);
  // kein fertiger Lösungscode im Schritt: Umpolen und Regression stehen nur in der Hilfe (zu) und im Werkzeugkasten (andere Variablen)
  assert.doesNotMatch(chosen, /rec\(ps03|demokratie ~ pt03|linear_regression\((allbus, )?demokratie/);
  assert.match(chosen, /Was heißt bei <code>ps03<\/code> die 1\?/);
  assert.match(chosen, /Das Wichtigste aus dieser Sitzung/);
  for (const n of [f3(main.a), f3(main.b), f3(main.r2)]) assert.doesNotMatch(chosen, new RegExp(n), n);
  assert.doesNotMatch(chosen, /4 · Testen/);
  // falsch umgepolt: Diagnose, aber kein Testen
  const orig = get('orig');
  const wrong = render({ input: 'pt03', a: f3(orig.a), b: f3(orig.b), r2: f3(orig.r2) });
  assert.match(wrong, /ohne Umpolen/);
  assert.doesNotMatch(wrong, /4 · Testen/);
  assert.doesNotMatch(wrong, new RegExp(f3(main.a)));
  const ready = render(setting);
  assert.match(ready, /4 · Testen/);
  assert.match(ready, /Besucherprobe/);
  assert.doesNotMatch(ready, /Besucherprobe mit 20 Befragten/);
  // ohne Gewicht gerechnet: gilt auch, die Karte vermerkt es
  const u = get('unweighted');
  const unweighted = render({ input: 'pt03', a: f3(u.a), b: f3(u.b), r2: f3(u.r2) });
  assert.match(unweighted, /4 · Testen/);
  assert.match(unweighted, /\(pt03\) · ungewichtet/);
});

test('the visitor probe needs a group code; the resolution waits for the tip', () => {
  const probe = render({ ...setting, code: '417' });
  assert.match(probe, /Besucherprobe mit 20 Befragten/);
  assert.match(probe, /Deine Gruppe:<\/strong> Fehlerquadrate Automat/);
  assert.doesNotMatch(probe, /weniger\. Das ist dein R²/);
  assert.match(render({ ...setting, code: '41' }), /drei oder vier Ziffern/);
  // erst festlegen: angeklickt, aber nicht abgegeben – noch keine Auflösung
  const picked = render({ ...setting, guess: 'Faulpelz' });
  assert.match(picked, /5 · Wer trifft öfter: Automat oder Faulpelz\?/);
  assert.match(picked, /<strong>Dein Tipp:<\/strong> Der Faulpelz trifft öfter\./);
  assert.match(picked, /<button class="primary">Tipp abgeben<\/button>/);
  assert.doesNotMatch(picked, /weniger\. Das ist dein R²/);
  assert.match(render(setting), /<button class="primary" disabled="">Tipp abgeben<\/button>/);
  const tip = render({ ...setting, guess: 'Faulpelz', guessLocked: true });
  assert.match(tip, /weniger\. Das ist dein R² \(0,052\)/);
  assert.match(tip, /Warum ist der Faulpelz so gut\?/);
  // abgegeben: keine Knöpfe zum Umentscheiden, kein neuer Tipp
  assert.match(tip, /Abgegeben – die Auflösung steht darunter\./);
  assert.doesNotMatch(tip, /aria-label="Tipp: Wer trifft öfter\?"/);
  assert.doesNotMatch(tip, /Knöpfe|type="range"/);
  // die eigene getippte Gerade kommt in der Auflösung mit
  assert.match(render({ ...setting, guess: 'Automat', guessLocked: true, myLine: { a: main.a, b: main.b }, lineLocked: true }), /Und deine getippte Gerade aus Schritt 2\?<\/strong> Fehlerquadrate/);
});

test('the hand displays open the machine in test mode', () => {
  const at = (x: number) => (machine.a + machine.b * x).toFixed(2).replace('.', ',');
  const html = render({ ...setting, shows: [at(2), at(6)] });
  assert.match(html, /Eingabe 2: 5,126 − 0,217 · 2 = .* – stimmt/);
  assert.match(html, /Und bei Eingabe 0 zeigt er die Konstante/);
  assert.match(html, /Menschen wie du sind im Schnitt so zufrieden mit der Demokratie: <strong>/);
  assert.doesNotMatch(render({ ...setting, shows: [at(2), ''] }), /Und bei Eingabe 0/);
});

test('the spread chart and numbers in the sign questions wait for recognised residual spreads', () => {
  const before = render({ ...setting, sign: 'Der Automat zeigt, wie zufrieden Menschen wie du sind.' });
  assert.match(before, /6 · Gleich gut für alle\? \(R\)/);
  assert.doesNotMatch(before, /Je Stufe: Befragte, Residuen-SD/);
  assert.match(before, /Nach deinem Eintrag siehst du die Streuung aller Stufen/);
  assert.match(before, /Wie weit liegt er typischerweise daneben\?<\/li>/);
  assert.doesNotMatch(render({ ...setting, sdMin: '0,999', sdMax: '9,999' }), /Je Stufe: Befragte, Residuen-SD/);
  const after = render({ ...setting, sdMin: f3(sp.min), sdMax: f3(sp.max), sign: 'Der Automat zeigt, wie zufrieden Menschen wie du sind.' });
  assert.match(after, /Je Stufe: Befragte, Residuen-SD/);
  assert.match(after, /Wie weit liegt er typischerweise daneben\? Im Mittel etwa ±/);
  assert.match(after, /Für wen liegt er weiter daneben\? Bei Eingabe 7/);
});

test('Levene details appear only after the own F value', () => {
  const lv = leveneVariants(machine);
  assert.doesNotMatch(render(setting), /Stimmt: F\(/);
  assert.match(render({ ...setting, levene: lv.main.F.toFixed(3).replace('.', ',') }), /Stimmt: F\(6; 12,3\)/);
});

test('the parade waits for the decision; the pair variant splits the roles and signs twice', () => {
  assert.doesNotMatch(render(setting), /8 · Automaten-Parade/);
  const decided = render({ ...setting, decision: 'freigeben' });
  assert.match(decided, /8 · Automaten-Parade/);
  assert.match(decided, /Parade aufdecken \(im Seminar erst nach dem Plenum\)/);
  assert.match(decided, /Bei \d+ von 10 Eingaben trifft der Automat/);
  const pair = render({ ...setting, mode: 'pair' });
  assert.match(pair, /A ist Technik und stellt den Automaten in R ein\. B ist Kuratorin/);
  assert.match(pair, /3 · Automat einstellen \(R\) · Technik/);
  assert.match(pair, /2 · Deine Gerade zuerst · Technik/);
  assert.match(pair, /4 · Testen: von Hand und mit Besucher:innen · Kuratorin/);
  assert.match(pair, /Rollentausch: Kuratorin rechnet, Technik prüft/);
  assert.match(pair, /Technik unterschreibt/);
  assert.doesNotMatch(render(setting), /Technik unterschreibt/);
});

test('a finished automaton offers the full script, fills the plenum card and marks the session done', () => {
  const done = { ...setting, sdMin: f3(sp.min), sdMax: f3(sp.max), sign: 'Schild', decision: 'nur mit Schild freigeben', guess: 'Automat', guessLocked: true };
  const html = render(done);
  assert.match(html, /vollständiges R-Skript/);
  assert.match(html, /Lineare Regression<small>Aufgabe abgeschlossen/);
  assert.match(html, /<dt>Treffer ±1<\/dt><dd>Automat \d+,\d % · Faulpelz \d+,\d %<\/dd>/);
  assert.match(html, /<dt>Entscheidung<\/dt><dd>nur mit Schild freigeben<\/dd>/);
});

test('pair mode: the curator opens probe and resolution only after her two hand displays', () => {
  const at = (x: number) => (machine.a + machine.b * x).toFixed(2).replace('.', ',');
  const closed = render({ ...setting, mode: 'pair', code: '417', guess: 'Automat', guessLocked: true });
  assert.match(closed, /Die Kuratorin gibt die Besucherprobe erst frei/);
  assert.doesNotMatch(closed, /Besucherprobe mit 20 Befragten/);
  assert.doesNotMatch(closed, /5 · Wer trifft öfter: Automat oder Faulpelz\?/);
  const open = render({ ...setting, mode: 'pair', code: '417', guess: 'Automat', guessLocked: true, shows: [at(2), at(6)] });
  assert.match(open, /Besucherprobe mit 20 Befragten/);
  assert.match(open, /5 · Wer trifft öfter: Automat oder Faulpelz\?/);
  // allein bleibt die Probe ohne Handrechnung offen
  assert.match(render({ ...setting, code: '417' }), /Besucherprobe mit 20 Befragten/);
});

test('entries typed as R prints them (dot decimals) open the automaton', () => {
  const dot = (x: number) => x.toFixed(3).replace('-', '−');
  const html = render({ input: 'pt03', a: dot(main.a), b: dot(main.b), r2: dot(main.r2), guess: 'Automat', guessLocked: true, sdMin: dot(sp.min), sdMax: dot(sp.max) });
  assert.match(html, /Stimmt: Der Automat zeigt 5,126 − 0,217 · Eingabe/);
  assert.match(html, /4 · Testen/);
  assert.match(html, /Das ist dein R² \(0,052\)/);
  assert.match(html, /Je Stufe: Befragte, Residuen-SD/);
  assert.match(html, /<dt>b · R²<\/dt><dd>b = −0,217 · R² = 0,052<\/dd>/);
  assert.doesNotMatch(html, /Knöpfe/);
});

test('a question that cannot be estimated shows the explanation exactly once', async () => {
  const { createElement } = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const { fakeSav } = await import('../../sandbox/testData');
  const { Automat } = await import('./Automat');
  const { NOT_ESTIMABLE } = await import('./domain');
  const sav = fakeSav({ ps03: { values: [1, 2, 3, 4], missingFrom: -1 }, wghtpew: { values: [1, 1, 1, 1] }, pt03: { values: [4, 4, 4, 4], missingFrom: -1 } });
  for (const typed of [{}, { a: '1,000', b: '0,500', r2: '0,100' }]) {
    const html = renderToStaticMarkup(createElement(Automat, { data: { sav, fileName: 'x.sav', version: 'v1.3.0', bytes: new ArrayBuffer(0) }, state: { ...initialS08(), input: 'pt03', ...typed }, onChange: () => {}, onConcept: () => {} }));
    assert.equal(html.split(NOT_ESTIMABLE).length - 1, 1, JSON.stringify(typed));
    assert.doesNotMatch(html, /4 · Testen/);
  }
});

test('your line first: scatter and two handles before R; the fields for R wait for the tip', () => {
  const open = render({ input: 'pt03' });
  assert.match(open, /Deine Gerade zuerst/);
  assert.match(open, /Zieh die beiden blauen Punkte nach oben oder unten/);
  assert.equal(open.split('role="slider"').length - 1, 2);
  assert.match(open, /aria-label="Anzeige deines Automaten bei Antwort 1 \(„gar kein Vertrauen“\)"/);
  assert.match(open, />zieh mich</);
  assert.match(open, /Zufriedenheit mit der Demokratie/);
  assert.match(open, /Eingabe: Wie viel Vertrauen hast du in den Bundestag\?/);
  assert.match(open, /<button class="primary" disabled="">Tipp abgeben<\/button>/);
  assert.match(open, /Gib zuerst in Schritt 2 deinen Tipp ab/);
  assert.doesNotMatch(open, /Wie groß ist die Konstante/);
  assert.doesNotMatch(open, /Dein Automat gegen den echten/);
  // gezogen, noch nicht abgegeben: die Regel des Automaten in Worten
  const set = render({ input: 'pt03', myLine: { a: 2.5, b: 0.4 } });
  assert.match(set, /<strong>Dein Automat:<\/strong> Bei Antwort 1 \(„gar kein Vertrauen“\) zeigt er 2,9, bei Antwort 7 \(„großes Vertrauen“\) zeigt er 5,3\./);
  assert.match(set, />zeigt 2,9</);
  assert.match(set, /<button class="primary">Tipp abgeben<\/button>/);
  assert.doesNotMatch(set, /Wie groß ist die Konstante/);
  // abgegeben: gesperrt, R-Felder offen, Vergleich noch zu
  const locked = render({ input: 'pt03', myLine: { a: 2.5, b: 0.4 }, lineLocked: true });
  assert.match(locked, /Abgegeben – jetzt rechnest du in R nach\./);
  assert.match(locked, /Neu tippen/);
  assert.doesNotMatch(locked, /tabindex="0"/);
  assert.match(locked, /Wie groß ist die Konstante/);
  assert.doesNotMatch(locked, /Dein Automat gegen den echten/);
  assert.doesNotMatch(locked, /echter Automat \(R\)/);
});

test('your line first: after the right constant and slope from R the real line and the comparison appear', () => {
  const mine = { a: main.a + 0.4, b: main.b * 0.5 };
  const html = render({ ...setting, myLine: mine, lineLocked: true });
  assert.match(html, /Dein Automat gegen den echten/);
  assert.match(html, /echter Automat \(R\)/);
  assert.match(html, /du hast den Zusammenhang (über|unter)schätzt|Deine Steigung passt gut|Richtung des Zusammenhangs/);
  assert.match(html, /aus R: Konstante 5,13, Steigung −0,217/);
  assert.match(html, /Fehlerquadrate \(Summe der quadrierten Residuen\) über alle Befragten: deine Gerade/);
  // R² fehlt noch: Konstante und Steigung genügen für den Vergleich
  assert.match(render({ ...setting, r2: '', myLine: mine, lineLocked: true }), /Dein Automat gegen den echten/);
  // ohne abgegebenen Tipp kein Vergleich, auch wenn die Zahlen stimmen
  assert.doesNotMatch(render({ ...setting, myLine: mine }), /Dein Automat gegen den echten/);
  assert.doesNotMatch(render({ ...setting, myLine: mine, lineLocked: true, b: '9,999' }), /Dein Automat gegen den echten/);
});

test('tip lock: „Neu tippen“ only while the real line is hidden', () => {
  const mine = { a: main.a + 0.4, b: main.b * 0.5 };
  // abgegeben, R-Zahlen fehlen oder stimmen nicht: neuer Tipp erlaubt
  assert.match(render({ input: 'pt03', myLine: mine, lineLocked: true }), />Neu tippen<\/button>/);
  assert.match(render({ ...setting, b: '9,999', myLine: mine, lineLocked: true }), />Neu tippen<\/button>/);
  // echte Gerade sichtbar: gesperrt, kein neuer Tipp
  const shown = render({ ...setting, myLine: mine, lineLocked: true });
  assert.match(shown, /Dein Automat gegen den echten/);
  assert.doesNotMatch(shown, /Neu tippen/);
  assert.match(shown, /Abgegeben\. Die echte Gerade steht jetzt in Schritt 3 neben deiner\./);
  assert.doesNotMatch(shown, /tabindex="0" aria-label="Anzeige deines Automaten/);
});

test('your line first works for age as well (handles at the youngest and oldest age)', () => {
  const html = render({ input: 'age' });
  assert.equal(html.split('role="slider"').length - 1, 2);
  assert.match(html, /aria-label="Anzeige deines Automaten bei Alter \d+"/);
  assert.match(html, /Eingabe: Wie alt bist du\?/);
});

test('Einstieg: right after the toolbox and before step 1 – with a hint when the file lacks dw15 or incc', () => {
  const html = renderSession(8);
  const tools = html.indexOf('DEIN WERKZEUGKASTEN'), intro = html.indexOf('Einstieg · Eine Gerade durch die Punkte legen'), one = html.indexOf('1 · Welche Frage stellt der Automat?');
  assert.ok(tools >= 0 && intro > tools && one > intro, `${tools} ${intro} ${one}`);
  assert.equal(html.split('task-guide-why').length - 1, 2);
  // Denkfragen statt Antworten, Überleitung in Schritt 1
  assert.match(html, /Woran machst du fest, was „gut“ ist\?/);
  assert.match(html, /Was hat R² mit den Fehlerquadraten des Durchschnitts und der Geraden aus R zu tun\?/);
  assert.match(html, /Du hast an 15 Befragten ausprobiert, wie eine Gerade durch Punkte gelegt wird\. Jetzt baust du den Automaten\./);
  // die Testdatei hat kein incc: Hinweis statt Grafik
  assert.match(html, /Für diese Grafik fehlen in deiner Datei die Variablen dw15 \(Arbeitsstunden\) oder incc \(Einkommen\)/);
  assert.doesNotMatch(html, /s08-play-svg/);
});

test('Einstieg: points, handles and controls – the line from R waits for your own line', () => {
  const n = 30;
  const sav = fakeSav({ dw15: { values: Array.from({ length: n }, (_, i) => 10 + i) }, incc: { values: Array.from({ length: n }, (_, i) => ((7 * i) % 25) + 1) } });
  const html = renderToStaticMarkup(createElement(Quadrate, { start: playPoints(sav)! }));
  assert.equal(html.split('aria-roledescription="verschiebbarer Punkt"').length - 1, 15);
  assert.equal(html.split('role="slider"').length - 1, 2);
  assert.match(html, /aria-label="Deine Gerade bei 0 Stunden"/);
  assert.match(html, /aria-label="Deine Gerade bei 70 Stunden"/);
  assert.match(html, /aria-label="Punkt 1: 11 Std\., 938 €\. Pfeiltasten verschieben, Entf entfernt\."/);
  assert.match(html, />zieh mich</);
  assert.match(html, /Arbeitsstunden pro Woche/);
  assert.match(html, /Nettoeinkommen im Monat/);
  // Bedienelemente: Quadrate an/aus, Punkt hinzufügen; Entfernen und Zurück erst, wenn es etwas zu tun gibt
  assert.match(html, /<button type="button" aria-pressed="false">Quadrate zeigen<\/button>/);
  assert.match(html, /<button type="button">Punkt hinzufügen<\/button>/);
  assert.match(html, /<button type="button" disabled="">Punkt entfernen<\/button>/);
  assert.match(html, /<button type="button" disabled="">Zurück zu den 15 Befragten<\/button>/);
  // erst festlegen, dann vergleichen: die Gerade aus R ist ausgeblendet, bis deine Gerade liegt
  assert.match(html, /<button type="button" class="s08-play-show" disabled="">Gerade aus R einblenden<\/button>/);
  assert.match(html, /noch ausgeblendet/);
  assert.match(html, /Zieh zuerst die beiden blauen Griffe/);
  assert.doesNotMatch(html, /R² dieser Geraden/);
  // der Durchschnitt ist von Anfang an messbar (wie der Faulpelz)
  assert.match(html, /aria-label="Durchschnitt messen: [\d,]+ Mio\. Fehlerquadrate"/);
  assert.match(html, /Orange Punkte: 15 echte Befragte aus dem ALLBUS 2023/);
});
