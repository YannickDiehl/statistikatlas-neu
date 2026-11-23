import test from 'node:test';
import assert from 'node:assert/strict';
import { renderSession, testData } from '../testRender';
import { fourfold, initialS04, PARTY, percent, prepare } from './domain';

const joint = prepare(testData().sav);
const fmt = (x: number) => x.toFixed(1).replace('.', ',');
const party = fourfold(joint, PARTY);
const own = fourfold(joint, { item: 'pe05', distrust: [3, 4], nonvote: [-8], else0: false, weighted: false });
const p1 = { pct: fmt(percent(party, 'a', 'col')), n: String(party.n.a) };
const p2 = { rowDistrust: fmt(percent(party, 'a', 'row')), rowOthers: fmt(percent(party, 'c', 'row')), total: fmt(percent(party, 'a', 'all')) };
const p3 = { ...initialS04().p3, rowDistrust: fmt(percent(own, 'a', 'row')), rowOthers: fmt(percent(own, 'c', 'row')), n: String(own.n.a) };
const render = (state: object) => renderSession(4, true, { tasks: { s04: { ...initialS04(), ...state } } });
const steps = (html: string) => [...html.matchAll(/<h3>([^<]+)<\/h3>/g)].map(m => m[1]);

test('session 5 shows role, steps in order, the takeaway and the plenum card', () => {
  const html = renderSession(4);
  assert.match(html, /Faktencheck-Redaktion „Nachgezählt“/);
  assert.match(html, /87 Prozent der Nichtwähler/);
  assert.match(html, /Die Leitfrage für alle Schritte: <strong>Gehen Menschen, die Politikern misstrauen, wirklich nicht mehr wählen\?<\/strong>/);
  assert.match(html, /<strong>Was du dabei lernst:<\/strong> Kreuztabellen lesen/);
  assert.deepEqual(steps(html).filter(s => /Vorab|Prüfauftrag|Urteil/.test(s)),
    ['Vorab · Wer ist 100 %?', 'Prüfauftrag 1 · Zahl nachbauen', 'Prüfauftrag 2 · Eine Zelle, drei Prozentbasen', 'Prüfauftrag 3 · Deine Lesart', 'Urteil und Faktencheck-Satz']);
  // Jeder Schritt beginnt mit einer Überleitung (Prüfauftrag 1 und 2 erst nach dem Tipp, dazu Einstieg und Zusatz).
  assert.equal([...html.matchAll(/class="task-guide-why"/g)].length, 5);
  const tipped = render({ baseGuess: 'total', baseLocked: true });
  assert.equal([...tipped.matchAll(/class="task-guide-why"/g)].length, 7);
  assert.match(tipped, /Dein Tipp steht\. Jetzt prüfst du, ob die Zahl überhaupt stimmt/);
  // Prüfauftrag 2 nennt die Prozentbasis der 87 % – vor dem Tipp wäre das die Auflösung.
  assert.doesNotMatch(html, /sind die Nichtwählenden 100 %/);
  assert.match(tipped, /Ob die Zahl stimmt, zeigt Prüfauftrag 1 – aber bei den 87 % sind die Nichtwählenden 100 %/);
  assert.match(html, /Mit den Misstrauenden als 100 % sieht die Zahl ganz anders aus/);
  assert.match(html, /<p class="s02-takeaway"><strong>Das Wichtigste aus dieser Sitzung:<\/strong> Eine Prozentzahl sagt erst etwas, wenn klar ist, wer 100 % ist/);
  assert.match(html, /FÜR DAS PLENUM/);
  assert.doesNotMatch(html, /drei Prozentbasen –/);
  assert.doesNotMatch(html, /18 Lesarten/);
  assert.doesNotMatch(html, /vollständiges R-Skript/);
  assert.match(render({ mode: 'pair' }), /Dann rechnet A Prüfauftrag 1 \(die Zahl der Pressemitteilung\), B gleichzeitig Prüfauftrag 2/);
});

test('the toolbox shows every tool on neutral variables, the steps show no solution code', () => {
  const html = renderSession(4);
  assert.match(html, /DEIN WERKZEUGKASTEN/);
  for (const fn of ['rec()', 'rec(…, rules = &quot;rev&quot;)', 'crosstab()', 'untag_na()', 'mutate()', 'row_sums()']) {
    assert.ok(html.includes(`<code>${fn}</code><span class="task-toolbox-new">neu</span>`), fn);
  }
  assert.match(html, /<code>frequency\(\), describe\(\)<\/code> kennst du aus Sitzung 3/);
  assert.match(html, /library\(tidyverse\)\nlibrary\(mariposa\)/);
  assert.match(html, /<code>library\(\), read_spss\(\), %&gt;%, codebook\(\)<\/code> kennst du aus Sitzung 1 und 4/);
  // Pipe-Stil: neue Variablen mit sprechendem Namen über mutate() + rec(), Aufrufe mit dem Datensatz vorn.
  assert.match(html, /allbus &lt;- allbus %&gt;%\n  mutate\(\n    hochschulreife = rec\(educ, rules = &quot;4:5=1 \[Hochschulreife\]/);
  assert.match(html, /mutate\(\n    gesundheit = rec\(hs01, rules = &quot;rev&quot;\)\n  \)/);
  assert.match(html, /allbus %&gt;%\n  crosstab\(eastwest, hochschulreife, percentages = &quot;row&quot;\)/);
  assert.match(html, /allbus &lt;- allbus %&gt;%\n  untag_na\(ep01\) %&gt;%\n  mutate\(\n    wirtschaftslage = rec\(ep01/);
  assert.match(html, /mutate\(\n    alter_jahrzehnte = age \/ 10\n  \)/);
  assert.match(html, /row_sums\(pick\(hochschulreife, interesse\), min_valid = 2\)/);
  // Keine Aufgabenvariablen im Code, kein fertiger Lösungscode, keine nicht eingeführten Funktionen, kein Altstil.
  assert.doesNotMatch(html, /rec\((allbus, )?(pe01|pe05|pa35|pv01)|crosstab\((allbus, )?(pe01|pe05|misstrauen)|untag_na\((allbus, )?pv01\)/);
  assert.equal(html.split('percentages = &quot;col&quot;').length - 1, 1, 'Spaltenprozente nur im Werkzeugkasten-Beispiel');
  assert.doesNotMatch(html, /\|&gt;|suffix =|rec\(allbus|crosstab\(allbus|frequency\(allbus|mutate\(allbus|row_sums\(allbus|summary\(|chi_square|library\(dplyr\)/);
  assert.doesNotMatch(html, /Nenner|Dummys|Fälle|fehlende Angaben/);
});

test('Prüfauftrag 1 opens only after the tip is locked; saved inputs stay visible', () => {
  const start = renderSession(4);
  assert.match(start, /Gib zuerst oben deinen Tipp ab: Wer ist bei den 87 % 100 %\? Dann geht es hier weiter\./);
  assert.doesNotMatch(start, /Welcher Prozentwert steht in deiner Tabelle/);
  assert.doesNotMatch(render({ baseGuess: 'total' }), /Welcher Prozentwert steht in deiner Tabelle/);
  assert.match(render({ baseGuess: 'total', baseLocked: true }), /Welcher Prozentwert steht in deiner Tabelle/);
  // Ältere Stände mit eingetragenen Zahlen, aber ohne abgegebenen Tipp: Felder bleiben sichtbar, der Tipp wird nachgefordert.
  const saved = render({ p1 });
  assert.match(saved, new RegExp(`value="${p1.pct}"`));
  assert.match(saved, /Gib oben unter „Vorab“ noch deinen Tipp ab/);
});

test('draws the picture of the bases and the strip only once the numbers are right', () => {
  const html = render({ p2, p3 });
  assert.match(html, /Dieselben \d+ Befragten, drei Prozentbasen/);
  assert.match(html, /Nur die Prozentbasis wechselt – die Gruppe, die 100 % ist: [\d,]+ % unter den \d+ Nichtwählenden/);
  assert.match(html, /18 Lesarten: Von den Misstrauenden wollen/);
  assert.doesNotMatch(render({ p2: { ...p2, total: '99,9' }, p3 }), /drei Prozentbasen –/);
  assert.doesNotMatch(render({ p2, p3: { ...p3, rowDistrust: '99,9' } }), /18 Lesarten/);
  assert.match(render({ p3: { ...p3, item: 'pa35', distrust: [1, 2], nonvote: [] } }), /Deine Lesart: <strong>pa35 1–2 · pv01 91<\/strong>/);
  // Gewichte kommen erst in Sitzung 6: kein Schalter, außer ein älterer Stand hat gewichtet gerechnet.
  assert.doesNotMatch(renderSession(4), /type="checkbox"/);
  assert.match(render({ p3: { ...p3, weighted: true } }), /type="checkbox" checked=""\/> Ich rechne gewichtet/);
});

test('asks at most three questions after a verdict and offers the full script when done', () => {
  const done = { p1, p2, p3, verdict: 2, baseGuess: 'col-nonvote', baseLocked: true,
    reason: 'Misstrauen führt nicht zur Nichtwahl', sentence: 'Von denen, die misstrauen, wollen 6,5 % nicht wählen, von den übrigen 2,3 %.' };
  const html = render(done);
  const titles = [...html.matchAll(/<li><strong>([^<]+)<\/strong>/g)].map(m => m[1]);
  assert.deepEqual(titles, ['Du nennst eine Ursache.', 'Was ist mit „weiß nicht“?', 'Wie viele Befragte stehen hinter der Zahl?']);
  assert.match(html, /vollständiges R-Skript/);
  assert.match(html, /prozentbasis-check\.R/);
  assert.match(html, /Kreuztabellen<small>Aufgabe abgeschlossen/);
  // Eine falsche Eingabe verrät über die Gegenfragen keine Zahlen.
  const wrong = [...render({ ...done, p1: { pct: 'x', n: '' }, p3: { ...p3, rowDistrust: '99,9' } }).matchAll(/<li><strong>([^<]+)<\/strong>/g)].map(m => m[1]);
  assert.deepEqual(wrong, ['Du nennst eine Ursache.', 'Absicht ist nicht Verhalten.']);
});

test('the base guess is a clickable crosstab that locks, and „Neu tippen“ disappears once revealed', () => {
  const open = renderSession(4);
  assert.match(open, /Wer ist bei den 87 % 100 %\? Zeig auf eine Zeile, eine Spalte oder „ganze Tabelle“ und klick sie an\./);
  for (const area of ['Die ganze Tabelle', 'Spalte „würde wählen“', 'Spalte „würde nicht wählen“', 'Zeile „misstraut nicht“', 'Zeile „misstraut“']) {
    assert.match(open, new RegExp(`aria-pressed="false" aria-label="${area} als 100 % wählen"`));
  }
  assert.match(open, /<button class="primary" disabled="">Tipp abgeben<\/button>/);
  assert.match(open, /Noch kein Tipp/);
  // Gewählt, aber noch offen: Bereich umrandet, Tipp abgeben möglich.
  const picked = render({ baseGuess: 'row-distrust' });
  assert.match(picked, /aria-pressed="true" aria-label="Zeile „misstraut“ als 100 % wählen"/);
  assert.match(picked, />Diese Zeile = 100 %<\/span>/);
  assert.match(picked, /<button class="primary">Tipp abgeben<\/button>/);
  // Gesperrt: keine Knöpfe mehr in der Tabelle, „Neu tippen“ statt „Tipp abgeben“, noch keine Auflösung.
  const locked = render({ baseGuess: 'row-distrust', baseLocked: true });
  assert.doesNotMatch(locked, /als 100 % wählen/);
  assert.match(locked, /Dein Tipp: Diese Zeile = 100 % – alle Misstrauenden\..*Tipp abgegeben\. Jetzt rechnest du in Prüfauftrag 1 nach\. <button class="sandbox-link">Neu tippen/);
  assert.doesNotMatch(locked, /Grün umrandet/);
  // Prüfauftrag 1 stimmt: Vergleich mit der Prozentbasis der Pressemitteilung – und kein „Neu tippen“ mehr.
  const revealed = render({ baseGuess: 'row-distrust', baseLocked: true, p1 });
  assert.match(revealed, />Diese Spalte = 100 %<\/span>.*Grün umrandet: So rechnet die Pressemitteilung\. 100 % sind alle, die nicht wählen wollen/);
  assert.match(revealed, /Tipp abgegeben\. Die Auflösung steht unten in Prüfauftrag 1\./);
  assert.doesNotMatch(revealed, /Neu tippen/);
  assert.match(revealed, /Dein Tipp: alle Misstrauenden sind 100 % \(Zeilenprozente\)/);
  assert.match(render({ baseGuess: 'col-nonvote', baseLocked: true, p1 }), /Richtig getippt/);
  assert.match(render({ baseGuess: 'total', baseLocked: true }), /Mein Tipp: Bei den 87 % sind 100 % …<\/dt><dd>alle Befragten in der Tabelle \(Gesamtprozente\)/);
});

test('the fact sentence is a gap sentence with two checked numbers', () => {
  const html = renderSession(4);
  assert.match(html, /Von denen, die misstrauen, wollen <input[^>]*aria-label="Wie viel Prozent der Misstrauenden wollen nicht wählen\?"/);
  assert.match(html, /von den übrigen <input[^>]*aria-label="Wie viel Prozent der Übrigen wollen nicht wählen\?"/);
  assert.doesNotMatch(html, /id="s04-sentence"/);
  const ok = render({ p2, fact: { reading: 'party', distrust: p2.rowDistrust, others: p2.rowOthers } });
  assert.match(ok, /Stimmt für die Lesart des Parteivorstands/);
  assert.match(ok, new RegExp(`Von denen, die misstrauen, wollen ${p2.rowDistrust} % nicht wählen, von den übrigen ${p2.rowOthers} % \\(Lesart pe01 1–2 · pv01 91\\)`));
  assert.match(render({ p3, fact: { reading: 'own', distrust: p3.rowDistrust, others: p3.rowOthers } }), /Stimmt für deine Lesart pe05 3–4 · pv01 91, -8/);
  assert.match(render({ sentence: 'Misstrauen ist verbreitet.' }), /Dein früher geschriebener Satz: „Misstrauen ist verbreitet\.“/);
});

test('session 5 starts with the cut table: every head open, nothing preset, three bases', () => {
  const html = renderSession(4);
  // Der erste Arbeitsschritt, noch vor dem Tipp zur Prozentbasis
  assert.deepEqual(steps(html).filter(s => /Einstieg|Vorab/.test(s)), ['Einstieg · Die Tabelle selbst zuschneiden', 'Vorab · Wer ist 100 %?']);
  assert.match(html, /pe01 „Politiker kümmern sich nicht um Leute wie mich“ \(Zeilen\) × pv01 Wahlabsicht/);
  // Kein Kopf ist vorbelegt
  assert.doesNotMatch(html, /class="(row-distrust|row-others|col-nonvote|col-vote)"/);
  assert.match(html, /Zeile 1 stimme voll zu: offen/);
  assert.match(html, /Spalte 91 würde nicht wählen: offen/);
  assert.match(html, /aria-label="Prozentbasis"[\s\S]*die Nichtwählenden/);
  assert.match(html, /Teil Zeilen und Spalten ein/);
});
