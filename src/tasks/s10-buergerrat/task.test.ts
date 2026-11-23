import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { fakeSav, fixtureSav } from '../../sandbox/testData';
import type { LogitFit } from '../kit/logit';
import { renderSession } from '../testRender';
import { Buergerrat } from './Buergerrat';
import { KurveSelbst } from './KurveSelbst';
import { initialS10, personNumbers, prepare, type S10State } from './domain';

const render = (state: Partial<S10State>) => renderSession(10, true, { tasks: { s10: { ...initialS10(), ...state } } });
const p = prepare(fixtureSav()), m = p.main as LogitFit;
const fmt = (x: number, d = 3) => x.toFixed(d).replace('.', ',');
const jana = personNumbers(m, p.profiles.jana), wiegand = personNumbers(m, p.profiles.wiegand);
const right = {
  or: { pflicht: fmt(m.expB[1]), interesse: fmt(m.expB[2]) },
  jana: { logit: fmt(jana.logit[0]), odds: fmt(jana.odds[0]), prob: fmt(jana.prob[0]) },
  odds: { janaUp: fmt(jana.odds[1], 2), wiegand: fmt(wiegand.odds[0], 2), wiegandUp: fmt(wiegand.odds[1], 2) },
  prob: { janaUp: fmt(jana.prob[1]), wiegand: fmt(wiegand.prob[0]), wiegandUp: fmt(wiegand.prob[1]) },
};
const answered = { ...right, campaign: 'depends' as const, answer3: 'Kommt auf die Sprache an.' };
const TAFEL = /Dolmetscher-Tafel: eine Stufe mehr Pflichtgefühl in drei Sprachen/;
// Referenzwerte der Testdatei, die vor dem eigenen Eintrag nirgends stehen dürfen
const secrets = ['2,615', '2,417', '50,5', '72,7', '94,0', '97,6', '22,2', '+3,6', '15,6', '40,7', '10,3'];

test('session 11 starts with the brief, both council members and the first station', () => {
  const html = renderSession(10);
  assert.match(html, /AUFGABE · STATISTIK-DOLMETSCHER:IN/);
  assert.match(html, /Du arbeitest als Statistik-Dolmetscher:in\./);
  assert.match(html, /Der rote Faden: <strong>Was heißt „Exp\(B\) = 3,77“ – für Jana, für Herrn Wiegand und für den Bericht\?<\/strong>/);
  assert.match(html, /<strong>Was du dabei lernst:<\/strong>/);
  assert.match(html, /„Pflichtgefühl: Exp\(B\) = 3,77 \*\*\*“/);
  assert.match(html, /Jana, 24/);
  assert.match(html, /Herr Wiegand, 67/);
  for (const title of ['Station 1 · Das Modell nachbauen', 'Station 2 · Jana von Hand übersetzen', 'Station 3 · Frage 1 der Moderatorin', 'Station 4 · Eine Stufe mehr – für beide',
    'Station 5 · Die eine Zahl für den Bericht', 'Zusatz · Trefferquote gegen Likelihood']) assert.ok(html.includes(title), title);
  assert.match(html, /Meldet R „Nicht-ganzzahlige #Erfolge in einem binomial-GLM“\? Das ist harmlos/);
  // jede Station beginnt mit einer Überleitung und Denkschritten, am Ende steht der Merksatz
  assert.equal((html.match(/So gehst du vor/g) ?? []).length, 7);
  assert.equal((html.match(/class="task-guide-why"/g) ?? []).length, 7);
  assert.match(html, /class="task-guide-why">Du hast gesehen, wie Konstante und B eine S-Kurve formen\. Jetzt geht es um das echte Modell:/);
  assert.match(html, /class="task-guide-why">Du hast das Modell nachgebaut\./);
  assert.match(html, /class="task-guide-why">Du kennst jetzt Janas Wahrscheinlichkeit und Exp\(B\)\./);
  assert.match(html, /class="task-guide-why">Frage 1 ist geklärt:/);
  assert.match(html, /class="task-guide-why">Die Tafel zeigt:/);
  assert.match(html, /class="s02-takeaway"><strong>Das Wichtigste aus dieser Sitzung:<\/strong> Exp\(B\) vervielfacht die Chance, nicht die Wahrscheinlichkeit\./);
  assert.ok(html.indexOf('s02-takeaway') < html.indexOf('FÜR DAS PLENUM'));
  // Drei Sprachen, einmal erklärt
  assert.match(html, /DREI SPRACHEN FÜR EINE ZAHL/);
  for (const t of ['<strong>Wahrscheinlichkeit:</strong>', '<strong>Chance</strong> (englisch Odds)', '<strong>Logit:</strong>', '<strong>Exp(B)</strong> (Chancenverhältnis', '<strong>AME</strong> (durchschnittlicher marginaler Effekt)'])
    assert.ok(html.includes(t), t);
  // Die Schritte zeigen keinen fertigen Code der Aufgaben
  assert.doesNotMatch(html, /waehlen ~|rec\(pv01|rec\(pe09|null\.deviance|coef\(|\|&gt;|modell %&gt;%|library\(dplyr\)|predict\(modell/);
  assert.match(html, /FÜR DAS PLENUM/);
  assert.doesNotMatch(html, /fiktiv/i);
  for (const s of secrets) assert.ok(!html.includes(s), s);
  assert.doesNotMatch(html, TAFEL);
  assert.doesNotMatch(html, /Nachwort/);
  const empty = renderSession(10, false);
  assert.match(empty, /Dolmetschen für den Bürgerrat/);
  assert.match(empty, /ALLBUS-Datei hierher ziehen/);
});

test('numbers appear only after the own entry is recognised', () => {
  // Station 2: die Übersetzung für Jana erst nach drei richtigen Zahlen
  assert.doesNotMatch(render({ jana: { ...right.jana, prob: '0,999' } }), /Übersetzt: Janas Chance/);
  assert.match(render({ jana: right.jana }), /Übersetzt: Janas Chance steht 1,02 zu 1\. Von 100 Menschen, die so antworten wie Jana, würden etwa 50 wählen gehen\./);
  // Station 3: die Gegenfrage rechnet erst mit Janas Zahl, wenn Exp(B) und Janas Wahrscheinlichkeit stimmen
  const times = { answer1: 'Ja, 3,77-mal so wahrscheinlich.' };
  assert.doesNotMatch(render(times), /Probier es an Jana: /);
  assert.match(render(times), /Probier es an Jana aus: Nimm ihre Wahrscheinlichkeit/);
  assert.match(render({ ...times, or: right.or, jana: right.jana }), /Probier es an Jana: 50,5 % × 2,61 = 132 % – geht das\?/);
  // Wrong entries never show the right values
  const wrong = render({ or: { pflicht: '9,999', interesse: '9,999' }, jana: { logit: '9,99', odds: '9,99', prob: '0,999' }, odds: { janaUp: '9,99', wiegand: '9,99', wiegandUp: '9,99' },
    prob: { janaUp: '0,111', wiegand: '0,222', wiegandUp: '0,333' }, campaign: 'jana', answer3: 'Bei Jana.', ame: '0,999', report: { number: '9,99', unit: 'pp', sentence: 'x' } });
  for (const s of secrets) assert.ok(!wrong.includes(s), s);
  assert.doesNotMatch(wrong, TAFEL);
});

test('the interpreter board waits for Jana, all six cells and the answer to question 3', () => {
  const ready = render(answered);
  assert.match(ready, TAFEL);
  assert.match(ready, /50,5 → 72,7 % <strong>\(\+22,2 Prozentpunkte\)<\/strong>/);
  assert.match(ready, /1,02 → 2,66 <strong>\(×2,61\)<\/strong>/);
  assert.match(ready, /role="img" aria-label="S-Kurve der Wahrscheinlichkeit zu wählen über das Pflichtgefühl\. Jana: 50,5 % → 72,7 % \(\+22,2 Prozentpunkte\); Herr Wiegand: 94,0 % → 97,6 % \(\+3,6 Prozentpunkte\)\."/);
  assert.match(ready, /Genau: Die Antwort hängt an der Sprache/);
  assert.match(ready, /Wie sagst du es dem Rat in einem Satz – mit Chancen und mit Wahrscheinlichkeiten\?/);
  assert.match(ready, /class="s10-scroll" tabindex="0" role="region" aria-label="Dolmetscher-Tafel"/);
  for (const patch of [{ campaign: '' as const }, { answer3: '' }, { jana: { ...right.jana, odds: '' } }, { odds: { ...right.odds, wiegandUp: '1,00' } }, { prob: { ...right.prob, janaUp: 'x' } }]) {
    const html = render({ ...answered, ...patch });
    assert.doesNotMatch(html, TAFEL, JSON.stringify(patch));
    assert.match(html, /Die Dolmetscher-Tafel erscheint, sobald/);
  }
  assert.match(render({ ...answered, campaign: '' }), /sobald deine Antwort auf Frage 3 steht\./);
  assert.match(render({ ...answered, jana: { ...right.jana, odds: '' }, prob: { ...right.prob, janaUp: '' } }), /sobald Janas drei Zahlen \(Station 2\) und die drei Wahrscheinlichkeiten stehen\./);
});

test('changing the answer to question 3 changes only the derived notes, never the typed texts', () => {
  const a = render({ ...answered, joint: 'Unser Satz.', campaign: 'jana' });
  const b = render({ ...answered, joint: 'Unser Satz.', campaign: 'same' });
  assert.match(a, /Du sagst „bei Jana“/);
  assert.match(b, /Du sagst „bei beiden gleich“/);
  for (const html of [a, b]) assert.match(html, />Unser Satz\.<\/textarea>/);
});

test('the partner variant splits the two languages and asks for a shared sentence', () => {
  const pair = render({ ...answered, mode: 'pair' });
  assert.match(pair, /A übersetzt in Chancen: Jana von Hand/);
  assert.match(pair, /Station 2 · A: Jana von Hand übersetzen/);
  assert.match(pair, /A · in Chancen/);
  assert.match(pair, /B · in Wahrscheinlichkeiten/);
  assert.match(pair, /Wie sagt ihr es dem Rat in einem gemeinsamen Satz/);
  assert.match(pair, /Die Dolmetscher-Tafel erscheint erst, wenn beide Zahlenreihen auf einem Bildschirm stehen\./);
  assert.match(pair, /Station 5 · B: Die eine Zahl für den Bericht/);
  const solo = render(answered);
  assert.match(solo, /Sprache 1 · Chancen/);
  assert.match(solo, /Sprache 2 · Wahrscheinlichkeiten/);
  assert.doesNotMatch(solo, /A · in Chancen/);
  assert.match(solo, /Station 5 · Die eine Zahl für den Bericht/);
  assert.match(solo, /inputMode="decimal" maxLength="24"/);
  assert.doesNotMatch(solo, /maxLength="16"/);
});

test('the report number is recognised, persons’ numbers appear only after the board', () => {
  const report = { ame: fmt(p.ame[0]), report: { number: fmt(100 * p.ame[0], 1), unit: 'pp' as const, sentence: 'Im Schnitt steigt die Wahrscheinlichkeit.' } };
  const before = render(report);
  assert.match(before, /Das ist der durchschnittliche marginale Effekt \(AME\)\./);
  assert.match(before, /Stimmt: Im Mittel über alle Befragten steigt die Wahrscheinlichkeit je Stufe Pflichtgefühl um 10,3 Prozentpunkte\./);
  assert.doesNotMatch(before, /22,2/);
  assert.match(render({ ...answered, ...report }), /für Menschen wie Jana 22,2, wie Herrn Wiegand 3,6 Prozentpunkte/);
  assert.match(render({ report: { number: fmt(100 * p.ame[0], 1), unit: 'pct', sentence: '' } }), /Prozent oder Prozentpunkte\?/);
  // vor der Tafel ist das Feld kein Orakel für die Werte der Ratsmitglieder
  const oracle = render({ report: { number: fmt(100 * wiegand.prob[0], 0), unit: 'pct', sentence: '' } });
  assert.match(oracle, /erst ein, wenn die Dolmetscher-Tafel offen ist/);
  assert.doesNotMatch(oracle, /Das ist eine Wahrscheinlichkeit/);
});

test('the likelihood station reveals its lesson after four right entries', () => {
  const c = m.classification;
  const ll = { hitModel: fmt(c.overall, 1), hitAll: fmt(100 * c.n1 / (c.n0 + c.n1), 1), nullLL: fmt(m.minus2LLNull, 1), modelLL: fmt(m.minus2LL, 1), sentence: '' };
  assert.match(render({ likelihood: ll }), /Von 5 Nichtwählenden erkennt das Modell 2/);
  assert.match(render({ likelihood: ll }), /Was antwortest du dem Ratsmitglied/);
  assert.doesNotMatch(render({ likelihood: { ...ll, modelLL: '99,9' } }), /Nichtwählenden erkennt/);
});

test('a finished task fills the council card, offers the afterword and marks the session done', () => {
  const done = render({ ...answered, answer1: 'Nein – die Chance ist so viel höher, nicht die Wahrscheinlichkeit.', joint: 'In Chancen gleich, in Prozentpunkten bei Jana mehr.',
    report: { number: fmt(100 * p.ame[0], 1), unit: 'pp', sentence: 'Im Mittel steigt die Wahrscheinlichkeit um 10 Prozentpunkte.' } });
  assert.match(done, /Ratskarte · Dolmetschen für den Bürgerrat/);
  assert.match(done, /<dt>Die eine Zahl für den Bericht<\/dt><dd>10,3 Prozentpunkte · AME<\/dd>/);
  assert.match(done, /<dt>Frage 3 · Bei wem bewirkt die Kampagne mehr\?<\/dt><dd>kommt auf die Sprache an – Kommt auf die Sprache an\.<\/dd>/);
  assert.match(done, /Nachwort: sechs typische Umwege/);
  assert.match(done, /vollständiges R-Skript/);
  assert.match(done, /Logistische Regression<small>Aufgabe abgeschlossen/);
});

test('a file on which the model cannot be estimated shows an explanation instead of stations', () => {
  const sav = fakeSav({
    pv01: { values: [1, 1, 1, 91, 91, 91, 2, 2], missingFrom: -1 }, pe09: { values: [1, 1, 1, 4, 4, 4, 1, 1], missingFrom: -1 },
    pa02a: { values: [1, 2, 3, 1, 2, 3, 4, 5], missingFrom: -1 }, wghtpew: { values: [1, 1, 1, 1, 1, 1, 1, 1] },
  });
  const html = renderToStaticMarkup(createElement(Buergerrat, {
    data: { sav, fileName: 'x.sav', version: 'v1.3.0', bytes: new ArrayBuffer(0) }, state: initialS10(), onChange: () => {}, onConcept: () => {},
  }));
  assert.match(html, /role="alert">Mit dieser Datei lässt sich das Modell nicht schätzen: Die Prädiktoren trennen die beiden Ausgänge/);
  assert.doesNotMatch(html, /Station 2 · Jana von Hand/);
  assert.doesNotMatch(html, /Das Wichtigste aus dieser Sitzung/);
  assert.doesNotMatch(html, /NaN/);
});

test('station 2 starts with a guess: 100 people like Jana, locked before the numbers, compared after the own probability', () => {
  const start = renderSession(10);
  assert.match(start, /Stell dir 100 Menschen wie Jana vor\. Wie viele gehen wählen\? Klick auf eine Figur/);
  assert.equal((start.match(/aria-label="\d+ von 100 gehen wählen"/g) ?? []).length, 100);
  assert.match(start, /<button class="primary" disabled="">Tipp abgeben<\/button>/);
  assert.match(start, /Gib zuerst deinen Tipp ab – dann rechnest du Janas Zahlen nach\./);
  assert.doesNotMatch(start, /Wie groß ist Janas Logit\?/);
  const picked = render({ janaGuess: 70 });
  assert.match(picked, /Dein Tipp: <strong[^>]*>70 von 100<\/strong> gehen wählen\./);
  assert.equal((picked.match(/aria-pressed="true" style="padding:0/g) ?? []).length, 70);
  const locked = render({ janaGuess: 70, janaGuessLocked: true });
  assert.match(locked, /Tipp abgegeben\. Jetzt rechnest du nach\./);
  assert.match(locked, /Neu tippen/);
  assert.match(locked, /Wie groß ist Janas Logit\?/);
  assert.equal((locked.match(/aria-label="\d+ von 100 gehen wählen"/g) ?? []).length, 0);
  for (const s of secrets) assert.ok(!locked.includes(s), s);
  // Wrong probability: no comparison, no curve
  const wrong = render({ janaGuess: 70, janaGuessLocked: true, jana: { ...right.jana, prob: '0,999' } });
  assert.doesNotMatch(wrong, /Laut Modell:/);
  assert.doesNotMatch(wrong, /Janas S-Kurve/);
  // Right probability: both groups of 100, one line of feedback, Jana's curve with both points – no re-guessing
  const done = render({ janaGuess: 70, janaGuessLocked: true, jana: { logit: '', odds: '', prob: right.jana.prob } });
  assert.match(done, /Dein Tipp: 70 von 100<\/figcaption>/);
  assert.match(done, /Laut Modell: 50 von 100<\/figcaption>/);
  assert.match(done, /Dein Tipp: 70 von 100\. Laut Modell gehen 50 von 100 Menschen wie Jana wählen – du hast um 20 überschätzt\./);
  assert.match(done, /aria-label="S-Kurve für Menschen wie Jana\. An Janas Pflichtgefühl: Modell 50,5 %, dein Tipp 70 %\."/);
  assert.doesNotMatch(done, /Neu tippen/);
  // Der Tipp steht nur noch einmal: Das gesperrte Figurenfeld oben verschwindet, sobald der Vergleich sichtbar ist
  assert.doesNotMatch(done, /Stell dir 100 Menschen wie Jana vor/);
  assert.doesNotMatch(done, /aria-label="Dein Tipp: 70 von 100 Menschen wie Jana gehen wählen"/);
  assert.doesNotMatch(done, /Tipp abgegeben\. Jetzt rechnest du nach\./);
  assert.equal((done.match(/aria-label="Dein Tipp: 70 von 100 gehen wählen"/g) ?? []).length, 1);
  // Vorher, mit gesperrtem Tipp, steht das Figurenfeld noch oben – mit „Neu tippen“
  assert.match(locked, /role="img" aria-label="Dein Tipp: 70 von 100 Menschen wie Jana gehen wählen"/);
  // the steps of station 4 stay hidden
  for (const s of ['72,7', '94,0', '97,6', '22,2']) assert.ok(!done.includes(s), s);
  assert.match(render({ janaGuess: 52, janaGuessLocked: true, jana: right.jana }), /tone-ok">Gut geschätzt: Dein Tipp 52 von 100, laut Modell 50 von 100\./);
  // Saved work from before the guess existed keeps its fields
  const old = render({ jana: right.jana });
  assert.match(old, /Wie groß ist Janas Logit\?/);
  assert.doesNotMatch(old, /Laut Modell:/);
});

test('the toolbox follows the partner choice and lists every function of the session', () => {
  const html = renderSession(10);
  assert.match(html, /DEIN WERKZEUGKASTEN/);
  assert.ok(html.indexOf('task-partner') < html.indexOf('DEIN WERKZEUGKASTEN'));
  assert.ok(html.indexOf('DEIN WERKZEUGKASTEN') < html.indexOf('Station 1 · Das Modell nachbauen'));
  const box = html.slice(html.indexOf('DEIN WERKZEUGKASTEN'), html.indexOf('DREI SPRACHEN'));
  for (const fn of ['logistic_regression()', 'exp()', 'tibble() + c()', 'predict()', 'marginal_effects()'])
    assert.match(box, new RegExp(`<code>${fn.replace(/[()+]/g, '\\$&')}</code><span class="task-toolbox-new">neu</span>`), fn);
  for (const fn of ['library(), read_spss(), codebook()', '%&gt;%', 'mutate(), rec()', 'summary()', '+ - * / ( )'])
    assert.ok(box.includes(`<code>${fn}</code> kennst du`), fn);
  // Beispiele an neutralen Variablen, nicht an denen der Aufgaben
  assert.match(box, /beispiel &lt;- allbus %&gt;%\n  logistic_regression\(abitur ~ age, weights = wghtpew\)/);
  assert.match(box, /beispiel %&gt;%\n  predict\(newdata = leute, type = &quot;response&quot;\)/);
  assert.match(box, /beispiel %&gt;%\n  marginal_effects\(\) %&gt;%\n  summary\(\)/);
  assert.doesNotMatch(box, /\|&gt;/);
  assert.match(box, /library\(tidyverse\)\nlibrary\(mariposa\)/);
  assert.doesNotMatch(box, /pv01|pe09|pa02a|waehlen|pflicht\b/);
});

test('the likelihood station asks for the null model only with tools from summary()', () => {
  const html = render({});
  assert.match(html, /Steht nicht direkt in summary\(\): −2 Log Likelihood plus Chi-square aus den Omnibus Tests/);
  assert.match(html, /Der Omnibus-Test zeigt aber mit Chi-square, um wie viel −2LL vom Nullmodell zu deinem Modell sinkt\./);
  assert.doesNotMatch(html, /null\.deviance|modell\$/);
});

test('session 11 opens with the curve lab: own constant and B, Jana and Herr Wiegand on the curve, nothing preset', () => {
  const html = renderSession(10);
  assert.match(html, /<h3>Einstieg · Die S-Kurve selbst einstellen<\/h3>/);
  // nach Werkzeugkasten und „Drei Sprachen“, vor Station 1
  assert.ok(html.indexOf('DREI SPRACHEN') < html.indexOf('Einstieg · Die S-Kurve'));
  assert.ok(html.indexOf('Einstieg · Die S-Kurve') < html.indexOf('Station 1 · Das Modell nachbauen'));
  const lab = html.slice(html.indexOf('Einstieg · Die S-Kurve'), html.indexOf('Station 1 · Das Modell nachbauen'));
  // zwei Griffe an der Geraden, tastaturbedienbar; die Mitte der S-Kurve gibt es erst, wenn die Kurve steigt oder fällt
  assert.match(lab, /role="slider" tabindex="0" aria-label="Konstante \(Logit bei Alter 0\)" aria-valuetext="Konstante 0,00"/);
  assert.match(lab, /role="slider" tabindex="0" aria-label="B \(Änderung des Logits je zehn Jahre\)" aria-valuetext="B 0,00 je zehn Jahre"/);
  assert.doesNotMatch(lab, /Mitte der S-Kurve \(50 %\) verschieben/);
  // Start ohne Vorgabe: waagerecht bei 50 %, für beide keine Änderung
  assert.match(lab, /Logit = <strong[^>]*>0,00 \+ 0,00 × Jahrzehnte<\/strong>/);
  assert.match(lab, /Jana: 24 → 34 Jahre/);
  assert.match(lab, /Herr Wiegand: 67 → 77 Jahre/);
  assert.equal((lab.match(/50,0 → 50,0 % <strong>\(0,0 Prozentpunkte\)<\/strong>/g) ?? []).length, 2);
  assert.match(lab, /<button type="button" disabled="">Zurück zum Start<\/button>/);
  // Die Testdatei hat kein lm30: Die Kurve geht, die ALLBUS-Anteile nicht
  assert.match(lab, /In deiner Datei fehlen <code>lm30<\/code> oder <code>age<\/code>/);
  assert.doesNotMatch(lab, /Kurve aus R zeigen/);
  // keine Werte der Aufgabe
  for (const s of secrets) assert.ok(!lab.includes(s), s);
  assert.doesNotMatch(lab, /pv01|pe09|pa02a|Pflichtgefühl/);
});

test('with lm30 in the file, data and R curve wait for the own curve', () => {
  const sav = fakeSav({
    lm30: { values: [1, 1, 1, 0, 1, 1, 0, -10, 1, 0, -10, -10], missingFrom: -1 },
    age: { values: [20, 22, 30, 31, 50, 52, 70, 72, 80, 88, 90, 86], missingFrom: -1 },
    wghtpew: { values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
  });
  const html = renderToStaticMarkup(createElement(KurveSelbst, { sav }));
  assert.match(html, /<button type="button" aria-pressed="false" disabled="">ALLBUS-Anteile zeigen<\/button>/);
  assert.match(html, /<button type="button" aria-pressed="false" disabled="">Kurve aus R zeigen<\/button>/);
  assert.match(html, /Stell zuerst deine eigene Kurve ein – dann kannst du sie mit den ALLBUS-Anteilen vergleichen\./);
  assert.doesNotMatch(html, /In deiner Datei fehlen/);
  assert.doesNotMatch(html, /NaN/);
});
