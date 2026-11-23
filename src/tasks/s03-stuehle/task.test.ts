import test from 'node:test';
import assert from 'node:assert/strict';
import { renderSession, testData } from '../testRender';
import { initialS03, rightOf } from './domain';

test('session 3 shows both halls, the chair rule and the plenum card', () => {
  const html = renderSession(2);
  assert.match(html, /Deutschland in 100 Stühlen/);
  assert.match(html, /Saal 1 · Wer fehlt in der Tabelle\?/);
  assert.match(html, /weiß nicht: kein Stuhl/);
  assert.match(html, /Saal prüfen/);
  assert.match(html, /Saal 2 · Dein Tipp: Wo sitzt der Durchschnitt\?/);
  assert.match(html, /Saal 2 · Nachrechnen/);
  assert.ok(html.indexOf('Dein Tipp: Wo sitzt') < html.indexOf('Was steht auf dem Schild?'), 'der Tipp kommt vor der Rechnung');
  assert.match(html, /FÜR DAS PLENUM/);
  assert.doesNotMatch(html, /Saaltext \(höchstens zwei Sätze\)/);
  assert.match(html, /So gehst du vor/);
  assert.match(html, /DEIN WERKZEUGKASTEN/);
  // Wie auf den Folien: einfache Pipe, ein Schritt pro Zeile
  assert.match(html, /allbus %&gt;% frequency\(sex\)/);
  assert.match(html, /allbus %&gt;% describe\(age\)/);
  assert.doesNotMatch(html, /frequency\(allbus|describe\(allbus|allbus %&gt;% frequency\(pv01\)|allbus %&gt;% describe\(dw15\)|work == 1|988 \//);
  assert.match(html, /library\(tidyverse\)/);
  assert.doesNotMatch(html, /\bfre\(|untag_na|mutate\(|nrow\(/);
  assert.doesNotMatch(html, /Nicht-Erwerbstätige mit 0 Stunden/);
});

test('a built hall shows the diagnosis, the grid and the hall text field', () => {
  const state = { ...initialS03(), built: true, seats: { '1': '100' }, sign: { value: '40', measure: 'median' as const, selection: 'gefragt' as const, right: String(rightOf(testData().sav, 'gefragt')) }, guess: 50, guessLocked: true };
  const html = renderSession(2, true, { tasks: { s03: state } });
  assert.match(html, /Saal mit 100 Stühlen/);
  assert.match(html, /Saaltext/);
  assert.match(html, /100 Stühle sortiert nach Stunden\. Q1/);
});

test('the chair row and the full script wait until the student has committed', () => {
  const start = renderSession(2);
  assert.doesNotMatch(start, /liegen über dem Mittelwert/);
  assert.doesNotMatch(start, /vollständiges R-Skript/);
  const sign = { value: '40', measure: 'median' as const, selection: 'gefragt' as const, right: '' };
  const noCount = renderSession(2, true, { tasks: { s03: { ...initialS03(), sign } } });
  assert.doesNotMatch(noCount, /100 Stühle sortiert nach Stunden\. Q1/);
  assert.match(noCount, /100 Stühle sortiert nach Stunden, ohne Kennzahlen/);
  assert.match(noCount, /disabled="">Tipp abgeben/);
  assert.doesNotMatch(noCount, /Wie viele der 100 Stühle liegen über dem Mittelwert/);
  assert.match(noCount, /klick den ersten an/);
  assert.match(noCount, /Noch kein Tipp/);
  const bare = { ...initialS03(), built: true, sign: { ...sign, right: 'x' } };
  assert.doesNotMatch(renderSession(2, true, { tasks: { s03: bare } }), /vollständiges R-Skript/);
  const right = String(rightOf(testData().sav, 'gefragt'));
  const wrong = { ...bare, seats: { '1': '100' }, hallText: 'Ein Stuhl ist ein Prozent.', sign: { ...sign, right: String(Number(right) + 20) }, guess: 50, guessLocked: true };
  const notYet = renderSession(2, true, { tasks: { s03: wrong } });
  assert.doesNotMatch(notYet, /100 Stühle sortiert nach Stunden\. Q1/, 'a wrong count must not reveal the mean');
  assert.doesNotMatch(notYet, /vollständiges R-Skript/);
  assert.doesNotMatch(notYet, /Neu tippen/, 'nach dem Schild-Wert ist der Tipp fest');
  const tipOnly = renderSession(2, true, { tasks: { s03: { ...initialS03(), sign: { ...sign, value: '', measure: '' as const }, guess: 40, guessLocked: true } } });
  assert.match(tipOnly, /Neu tippen/);
  assert.match(tipOnly, /Welche Zahl steht auf dem Schild/);
  const noTip = renderSession(2, true, { tasks: { s03: { ...initialS03(), sign: { ...sign, value: '', measure: '' as const } } } });
  assert.match(noTip, /Gib zuerst oben deinen Tipp in der Stuhlreihe ab/);
  const done = { ...wrong, sign: { ...sign, right } };
  const revealed = renderSession(2, true, { tasks: { s03: done } });
  assert.match(revealed, /100 Stühle sortiert nach Stunden\. Q1/);
  assert.doesNotMatch(revealed, /Neu tippen/);
  assert.match(revealed, /Dein Tipp/);
  assert.match(revealed, /Dein Tipp: 50 Stühle über dem Mittelwert/);
  assert.match(renderSession(2, true, { tasks: { s03: done } }), /vollständiges R-Skript/);
});

test('a hall with too many chairs grows an extra row', () => {
  const html = renderSession(2, true, { tasks: { s03: { ...initialS03(), built: true, seats: { '1': '101' } } } });
  assert.match(html, /viewBox="0 0 400 440"/);
  assert.match(html, /Saal mit 101 Stühlen/);
});
