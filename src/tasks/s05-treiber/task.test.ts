import test from 'node:test';
import assert from 'node:assert/strict';
import { fixtureSav } from '../../sandbox/testData';
import { renderSession } from '../testRender';
import { cardById } from './content';
import { defaultGuess, initialS05, prepare, variants } from './domain';

const locked = { rankGuess: defaultGuess(), rankLocked: true };

const render = (state: object) => renderSession(5, true, { tasks: { s05: { ...initialS05(), ...state } } });

test('session 6 starts with the brief and the card draw', () => {
  const html = renderSession(5);
  assert.match(html, /Analyst:in im Beratungsbüro „Querschnitt“\./);
  assert.match(html, /Der Förderfonds „Gemeinsinn“ vergibt/);
  assert.match(html, /Karte ziehen/);
  assert.doesNotMatch(html, /2 · Welches Zusammenhangsmaß passt\?/);
  assert.match(html, /FÜR DAS PLENUM/);
});

test('session 6 opens with the board: one real table, four measures, no presets', () => {
  const html = renderSession(5);
  assert.match(html, /Einstieg · Eine Tabelle, vier Zusammenhangsmaße/);
  // Einstieg vor Schritt 1
  assert.ok(html.indexOf('Einstieg · Eine Tabelle') < html.indexOf('1 · Deinen Kandidaten ziehen'));
  assert.match(html, /Gesundheit \(hs01\) × Zufriedenheit mit der Demokratie \(ps03\)/);
  for (const label of ['Cramér-V', 'Gamma', 'Tau-b', 'Pearson-r']) assert.match(html, new RegExp(`aria-label="${label}: `));
  for (const button of ['Spalten anders anordnen', 'Zusammenhang auflösen', 'Zurück zu den ALLBUS-Zahlen']) assert.match(html, new RegExp(button));
  // Am Anfang ist nichts verändert: „Zurück“ ist ausgegraut.
  assert.match(html, /<button type="button" disabled="">Zurück zu den ALLBUS-Zahlen/);
});

test('a drawn card opens the steps; the ranking waits for value, stamp and sentence', () => {
  const card = render({ card: 'konf' });
  assert.match(card, /Konfession/);
  // Kein fertiger Code in den Schritten: die Umkodierung steht in Worten, der Code nur in der Hilfe (zugeklappt).
  assert.match(card, /Fasse sie mit rec\(\) zu vier Gruppen zusammen und nenne die neue Variable konf: evangelisch \(1 und 2\)/);
  assert.doesNotMatch(card, /rec\(rd01|rec\(ps03|cramers_v\(zufriedenheit|filter\(eastwest|mutate\(zufriedenheit/);
  assert.match(card, /4 · Hält der Zusammenhang in West und Ost\?/);
  assert.doesNotMatch(card, /Rangliste nach vier Zusammenhangsmaßen/);
  assert.doesNotMatch(card, /Gamma = −0,54/);
  assert.match(render({ card: 'eastwest' }), /4 · Hält der Unterschied bei gleicher Wirtschaftslage\?/);
  const entry = { card: 'ep01', measure: 'gamma', value: '-0,500', stamp: 'trägt', sentence: 'Satz', strata: ['-0,4', '-0,4', ''] };
  assert.match(render({ ...entry, strata: ['', '', ''] }), /Trag zuerst die Werte für West und Ost ein/);
  assert.doesNotMatch(render({ ...entry, sentence: '' }), /Rangliste nach vier Zusammenhangsmaßen/);
  assert.doesNotMatch(render({ ...entry, value: 'x' }), /Rangliste nach vier Zusammenhangsmaßen/);
  const ready = render({ ...entry, ...locked });
  assert.match(ready, /8 · Die Rangliste nach vier Zusammenhangsmaßen/);
  assert.match(ready, /Cramér-V hat kein Vorzeichen \(0 bis 1\); Gamma, Tau-b und r zeigen die Richtung\. Die Plätze richten sich nach dem Betrag\./);
  assert.match(ready, /Rangliste gewichtet: Cramér-V Platz 1/);
  assert.match(ready, /9 · Deine Empfehlung an den Fonds/);
});

test('the ranking waits until every part has a numeric value of its own', () => {
  const ranking = /8 · Die Rangliste nach vier Zusammenhangsmaßen/;
  const entry = { card: 'ep01', measure: 'gamma', value: '-0,500', stamp: 'trägt', sentence: 'Satz' };
  // leer, nur ein Teil, Platzhalter und Text: verborgen, dazu der Hinweis statt der Lesart
  for (const strata of [['', '', ''], ['-0,4', '', ''], ['', '-0,4', ''], ['x', 'y', ''], ['-0,4', 'abc', ''], ['-', '.', '']]) {
    const html = render({ ...entry, strata });
    assert.doesNotMatch(html, ranking, JSON.stringify(strata));
    assert.doesNotMatch(html, /9 · Deine Empfehlung an den Fonds/, JSON.stringify(strata));
    assert.match(html, /Trag zuerst die Werte für West und Ost ein/, JSON.stringify(strata));
  }
  // zahlenförmig (auch falsch, auch mit Komma oder Minuszeichen): die Enthüllung erscheint, samt Wert, Stempel und Satz
  for (const strata of [['-0,4', '-0,4', ''], ['0,999', '−0,1', ''], ['3', '4', 'x']]) assert.match(render({ ...entry, ...locked, strata }), ranking, JSON.stringify(strata));
  assert.doesNotMatch(render({ ...entry, ...locked, strata: ['-0,4', '-0,4', ''], stamp: '' }), ranking);
  assert.doesNotMatch(render({ ...entry, ...locked, strata: ['-0,4', '-0,4', ''], sentence: ' ' }), ranking);
  assert.doesNotMatch(render({ ...entry, ...locked, strata: ['-0,4', '-0,4', ''], value: '' }), ranking);
  // „West oder Ost“ hat drei Teile: erst wenn alle drei Zahlen stehen
  const ew = { card: 'eastwest', measure: 'gamma', value: '-0,350', stamp: 'trägt', sentence: 'Satz' };
  assert.doesNotMatch(render({ ...ew, strata: ['-0,3', '-0,3', ''] }), ranking);
  assert.match(render({ ...ew, ...locked, strata: ['-0,3', '-0,3', '-0,3'] }), ranking);
});

test('the stamp reading prints numbers only after correct strata values', () => {
  const p = prepare(fixtureSav()), ep01 = cardById.ep01, vars = variants(p, ep01);
  const part = (s: number) => vars.find(v => v.measure === 'tau' && !v.weighted && v.stratum === s && v.reversed)!.value.toFixed(3).replace('.', ',');
  const entry = { card: 'ep01', measure: 'tau', value: '-0,387', stamp: 'trägt', sentence: 'Satz' };
  const wrong = render({ ...entry, strata: ['0,999', '0,999', ''] });
  assert.match(wrong, /(Nach der offengelegten Regel lese ich|Meine Lesart nach der offengelegten Regel ist auch) „/);
  assert.doesNotMatch(wrong, /Tau-b gesamt/);
  assert.match(render({ ...entry, strata: [part(0), part(1), ''] }), /Tau-b gesamt .* in West und Ost /);
  assert.doesNotMatch(render({ ...entry, strata: [part(0), '0,999', ''] }), /Tau-b gesamt/);
});

test('the card West oder Ost names Gamma, the economy groups and the matching rule and sentence hint', () => {
  const ew = render({ card: 'eastwest' });
  assert.match(ew, /4 · Hält der Unterschied bei gleicher Wirtschaftslage\?/);
  assert.match(ew, /Die Wirtschaftslage ist hier eine <strong>Drittvariable<\/strong>/);
  assert.match(ew, /rechne darin Gamma für <code>zufriedenheit<\/code> und <code>eastwest<\/code>/);
  assert.match(ew, /Gruppen der Wirtschaftslage haben verschiedene Vorzeichen/);
  assert.doesNotMatch(ew, /Die Landesteile haben verschiedene Vorzeichen/);
  assert.match(ew, /placeholder="[^"]*auch innerhalb gleicher Wirtschaftslage[^"]*"/);
  assert.doesNotMatch(ew, /placeholder="[^"]*in West und Ost[^"]*"/);
  assert.doesNotMatch(ew, /nur West und nur Ost/);
  const ep = render({ card: 'ep01' });
  assert.match(ep, /Die Landesteile haben verschiedene Vorzeichen/);
  assert.match(ep, /placeholder="[^"]*in West und Ost[^"]*"/);
  assert.doesNotMatch(ep, /rechne darin Gamma/);
  assert.match(ep, /Der Landesteil ist hier eine <strong>Drittvariable<\/strong>/);
});

test('numbers in the fit prompts wait for a value the detector recognises', () => {
  const p = prepare(fixtureSav()), ep01 = cardById.ep01, vars = variants(p, ep01);
  const gammaW = vars.find(v => v.measure === 'gamma' && v.weighted && v.stratum < 0 && v.reversed)!.value.toFixed(3).replace('.', ',');
  const entry = { card: 'ep01', measure: 'gamma' };
  assert.match(render({ ...entry, value: gammaW }), /γ .*τ /);
  for (const value of ['0,999', '12,345', 'x', '0,5', '']) assert.doesNotMatch(render({ ...entry, value }), /γ .*τ /, value);
  // zweite Währung (das Hauptmaß Tau-b schweigt hier): Zahlen erst bei erkanntem zweiten Wert
  const second = (value: string) => render({ card: 'ep01', measure: 'tau', second: { measure: 'gamma', value, unweighted: '', veto: false } });
  assert.match(second(gammaW), /γ .*τ /);
  for (const value of ['0,999', '12,345', 'x', '0,5', '']) assert.doesNotMatch(second(value), /γ .*τ /, value);
});

test('a finished entry offers the full script and marks the session done', () => {
  const done = { card: 'age', measure: 'r', value: '0,059', stamp: 'kehrt sich um', sentence: 'Satz', recommendation: 'Empfehlung' };
  const html = render(done);
  assert.match(html, /vollständiges R-Skript/);
  assert.match(html, /Gewichtung und Zusammenhang<small>Aufgabe abgeschlossen/);
});

test('step 2 is a decision path: outcome, candidate, then measure cards that fit or are greyed with a reason', () => {
  const start = render({ card: 'ep01' });
  assert.match(start, /Welches Skalenniveau haben deine beiden Variablen\? Zuerst die Demokratiezufriedenheit/);
  assert.match(start, /Geordnete Stufen, Abstände unklar/);
  assert.match(start, /z\. B\. evangelisch · katholisch · keine/);
  assert.doesNotMatch(start, /Und dein Kandidat/);
  assert.doesNotMatch(start, /Welches Zusammenhangsmaß nimmst du\?/);
  const step2 = start.slice(start.indexOf('2 · Welches Zusammenhangsmaß passt'), start.indexOf('3 · Gewichtet rechnen'));
  assert.doesNotMatch(step2, /<select/);
  const outcome = render({ card: 'ep01', outcomeLevel: 'ordinal' });
  assert.match(outcome, /Und dein Kandidat „Wirtschaftslage in Deutschland“/);
  assert.match(outcome, /sechs geordnete Stufen/);
  assert.doesNotMatch(outcome, /Welches Zusammenhangsmaß nimmst du\?/);
  const path = render({ card: 'ep01', outcomeLevel: 'ordinal', level: 'ordinal' });
  assert.match(path, /Grün markiert: passt zu „ordinal“/);
  const button = (html: string, label: string) => html.match(new RegExp(`<button[^>]*>(?:(?!</button>).)*?<strong>${label} <code`))?.[0] ?? '';
  for (const fits of ['Gamma', 'Tau-b', 'Spearman-ρ']) assert.doesNotMatch(button(path, fits), /disabled/, fits);
  for (const misfit of ['Cramér-V', 'Phi', 'Pearson-r']) assert.match(button(path, misfit), /disabled=""/, misfit);
  assert.match(path, /Passt nicht: Nutzt die Reihenfolge der Stufen nicht\./);
  assert.match(path, /Passt nicht: Setzt gleiche Abstände zwischen den Stufen voraus\./);
  assert.match(path, /Anderes Maß trotzdem wählen/);
  // Ein bewusst gewähltes unpassendes Maß bleibt sichtbar gewählt, die Karten sind frei, und der Denkanstoß erscheint.
  const wrong = render({ card: 'ep01', outcomeLevel: 'ordinal', level: 'ordinal', measure: 'r' });
  assert.match(button(wrong, 'Pearson-r'), /aria-pressed="true"/);
  assert.doesNotMatch(button(wrong, 'Cramér-V'), /disabled/);
  assert.doesNotMatch(wrong, /Anderes Maß trotzdem wählen/);
  assert.match(wrong, /gleiche Abstände/);
  // Alte Spielstände ohne Zufriedenheits-Niveau zeigen trotzdem Kandidat und Maß.
  assert.match(render({ card: 'age', level: 'metrisch', measure: 'r' }), /Welches Zusammenhangsmaß nimmst du\?/);
});

test('the ranking waits for a locked rank guess, then shows the guess next to the real ranking', () => {
  const entry = { card: 'ep01', measure: 'gamma', value: '-0,500', stamp: 'trägt', sentence: 'Satz', strata: ['-0,4', '-0,4', ''] };
  const open = render(entry);
  assert.match(open, /7 · Dein Tipp: Wer steht oben\?/);
  assert.match(open, /Sortiere die Karten: stärkster Zusammenhang oben/);
  assert.match(open, /Tipp abgeben/);
  assert.match(open, /aria-label="Alter einen Platz nach oben"/);
  assert.doesNotMatch(open, /Rangliste nach vier Zusammenhangsmaßen|Rangliste gewichtet:|8 · Empfehlung an den Fonds/);
  const done = render({ ...entry, ...locked });
  // Die Rangliste ist sichtbar: kein „Neu tippen“ mehr, der Tipp bleibt fest.
  assert.doesNotMatch(done, /Neu tippen/);
  assert.doesNotMatch(done, /Tipp abgeben<\/button>|einen Platz nach oben/);
  assert.match(done, /Womit vergleichst du deinen Tipp\?/);
  assert.match(done, /getippt Platz \d+ · nach Gamma Platz \d+ · <strong>(↑ \d+ Pl(atz|ätze) höher als getippt|↓ \d+ Pl(atz|ätze) tiefer als getippt|genau getroffen)<\/strong>/);
  assert.match(done, /Nach Gamma \(gewichtet\) liegt dein Tipp im Mittel \d+,\d Plätze daneben/);
  assert.match(done, /Im Mittel daneben je Maß: Cramér-V/);
  assert.match(done, /nach Gamma ohne Platz \(keine Reihenfolge der Kategorien, darum nur mit Cramér-V\) · zählt hier nicht mit/);
  assert.match(done, /„Konfession“ \(keine Reihenfolge der Kategorien, darum nur mit Cramér-V\) hat nach Gamma \(gewichtet\) keinen Platz\. Darum zählen hier beide Seiten nur 12 Karten/);
  assert.match(done, /9 · Deine Empfehlung an den Fonds/);
  // Wer schon eine Empfehlung geschrieben hat, verliert sie nicht, auch ohne Tipp.
  assert.match(render({ ...entry, recommendation: 'Text' }), /9 · Deine Empfehlung an den Fonds/);
});

test('the toolbox follows the partner toggle and lists every measure of the session', () => {
  const html = render({});
  const toggle = html.indexOf('Arbeitsform'), box = html.indexOf('DEIN WERKZEUGKASTEN'), step1 = html.indexOf('1 · Deinen Kandidaten ziehen');
  assert.ok(toggle > 0 && toggle < box && box < step1, `${toggle} ${box} ${step1}`);
  const tools = html.slice(box, html.indexOf('</ul>', box));
  for (const fn of ['weights = wghtpew', 'cramers_v()', 'phi()', 'goodman_gamma()', 'kendall_tau()', 'spearman_rho()', 'pearson_cor()']) {
    assert.match(tools, new RegExp(`<code>${fn.replace(/[()]/g, '\\$&')}</code><span class="task-toolbox-new">neu</span>`), fn);
  }
  assert.match(tools, /<code>filter\(\)<\/code> kennst du aus Sitzung 2/);
  assert.match(tools, /<code>mutate\(\) \+ rec\(\)<\/code> kennst du aus Sitzung 5/);
  assert.match(tools, /<code>%&gt;%<\/code> kennst du aus Sitzung 4/);
  assert.doesNotMatch(tools, /Neu ist nur die Kombination|suffix/);
  assert.doesNotMatch(html, /\|&gt;/);
  assert.match(html, /library\(tidyverse\)\nlibrary\(mariposa\)/);
});

test('no game jargon in any visible text, at any stage', () => {
  const stages = [
    {}, { card: 'konf' }, { card: 'eastwest' },
    { card: 'ep01', measure: 'gamma', value: '-0,500', stamp: 'trägt', sentence: 'Satz', strata: ['-0,4', '-0,4', ''] },
    { card: 'ep01', measure: 'gamma', value: '-0,500', stamp: 'schrumpft', sentence: 'Satz', strata: ['-0,4', '-0,4', ''], ...locked, recommendation: 'x', second: { measure: 'tau', value: '-0,387', unweighted: '', veto: true } },
  ];
  for (const st of stages) assert.doesNotMatch(render(st), /Stempel|stempel|Währung/, JSON.stringify(st));
});

test('every step opens with a transition and the session ends with a takeaway', () => {
  const done = render({ card: 'ep01', measure: 'gamma', value: '-0,500', stamp: 'trägt', sentence: 'Satz', strata: ['-0,4', '-0,4', ''], ...locked });
  const steps = [...done.matchAll(/<h3>(\d) · /g)].map(m => m[1]);
  assert.deepEqual(steps, ['1', '2', '3', '4', '5', '6', '7', '8', '9']);
  // neun nummerierte Schritte plus der Einstieg
  assert.equal((done.match(/class="task-guide-why"/g) ?? []).length, 10);
  assert.match(done, /<p class="s02-takeaway"><strong>Das Wichtigste aus dieser Sitzung:<\/strong>/);
  assert.match(renderSession(5), /<strong>Was du dabei lernst:<\/strong>/);
});

test('the value field opens only after a measure is chosen; stored values stay visible', () => {
  assert.match(render({ card: 'ep01' }), /Wähl zuerst in Schritt 2 dein Maß/);
  assert.doesNotMatch(render({ card: 'ep01' }), /Welchen Wert zeigt R für/);
  assert.match(render({ card: 'ep01', measure: 'tau' }), /Welchen Wert zeigt R für Tau-b\?/);
  assert.match(render({ card: 'ep01', value: '-0,387' }), /value="-0,387"/);
});

test('the comparison list numbers the guess the same way the badges count', () => {
  // Alphabetischer Tipp: Konfession steht auf Platz 7 und fällt bei Gamma heraus – die Karten darunter rücken einen Platz auf.
  const html = render({ card: 'ep01', measure: 'gamma', value: '-0,500', stamp: 'trägt', sentence: 'Satz', strata: ['-0,4', '-0,4', ''], ...locked });
  const items = [...html.matchAll(/<li class="s05-guess-card[^"]*"[^>]*><span[^>]*>([^<]+)<\/span>(?:(?!<\/li>).)*?<\/li>/g)].map(m => m[0]);
  assert.equal(items.length, 13);
  const guess = defaultGuess();
  let n = 0;
  items.forEach((li, i) => {
    const shown = li.match(/aria-hidden="true">([^<]+)</)![1];
    if (guess[i] === 'konf') { assert.equal(shown, '–'); assert.match(li, /ohne Platz/); return; }
    n += 1;
    assert.equal(shown, `${n}.`, li);
    const m = li.match(/getippt Platz (\d+) · nach Gamma Platz (\d+) · <strong>(?:(↑|↓) (\d+) Pl|genau)/)!;
    assert.equal(Number(m[1]), n, li);
    const shift = m[3] ? (m[3] === '↑' ? 1 : -1) * Number(m[4]) : 0;
    assert.equal(Number(m[1]) - Number(m[2]), shift, li);
  });
});
