import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement as h, type ComponentType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ChapterStateProvider } from '../ChapterContext';
import type { ChapterState } from '../state';
import { F_LAB, F_LAB_FEEDBACK, MACHINE, N_FEEDBACK, N_STEPS, SAMPLES } from './content';
import { Foundation1, Foundation2, Foundation3, Foundation4, Overview } from './Foundations';
import { alarmText, labFeedback, labLine, labRow, nStepText } from './figures/Interactive';
import { firstStacks, machineText } from './figures/Machine';

const ALL: [string, ComponentType][] = [['Foundation1', Foundation1], ['Foundation2', Foundation2], ['Foundation3', Foundation3], ['Foundation4', Foundation4], ['Overview', Overview]];

function render(C: ComponentType, answers: Record<string, string> = {}) {
  const initial: ChapterState = { predictions: {}, answers };
  return renderToStaticMarkup(h(ChapterStateProvider, { sessionId: 7, initial }, h(C)));
}

const unescape = (s: string) => s.replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const textOf = (html: string) => unescape(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const imageNames = (html: string) => [...html.matchAll(/<[^>]*\brole="img"[^>]*>/g)].map(([tag]) => unescape(tag.match(/\baria-label="([^"]*)"/)?.[1] ?? ''));

test('every role="img" has a text version of at least 40 characters', () => {
  let count = 0;
  for (const [name, C] of ALL) for (const label of imageNames(render(C))) {
    count++;
    assert.ok(label.length >= 40, `${name}: "${label}"`);
  }
  assert.ok(count >= 5, 'machine, stack 1c-1, intervals, ruler, means with interval');
});

test('no R code to run in the foundations: no workshop, no textarea, no <pre>', () => {
  for (const [name, C] of ALL) {
    const html = render(C);
    assert.doesNotMatch(html, /class="workshop"|<textarea|<pre/, name);
  }
});

test('foundation blocks with ids, skip links and step labels as in the plan', () => {
  const steps: Record<string, string[]> = { Foundation1: ['1a', '1b', '1c', '1d'], Foundation2: ['2a', '2b', '2c'], Foundation3: ['3a', '3b', '3c'], Foundation4: ['4a'], Overview: ['Ü1', 'Ü2'] };
  ALL.forEach(([name, C], i) => {
    const html = render(C), n = i + 1;
    assert.match(html, new RegExp(`<section class="grund-block" id="g${n}"`), name);
    if (n <= 4) assert.match(html, new RegExp(`<a class="zur" href="#a${n}">Schon klar\\? Direkt zu Aufgabe ${n} ↓</a>`), name);
    else assert.doesNotMatch(html, /class="zur"/, name);
    const found = [...html.matchAll(/<span class="g-schritt"><span class="sr-only">Schritt <\/span>([^<]+)<\/span>/g)].map(m => m[1]);
    assert.deepEqual(found, steps[name], name);
  });
  assert.match(textOf(render(Foundation1)), /Grundlage zu Aufgabe 1 Zufall oder Unterschied\?/);
  assert.match(textOf(render(Overview)), /Überblick zu allen Aufgaben Vergleichen, prüfen, berichten/);
});

test('every slider has a label and aria-valuetext; radio groups have a legend', () => {
  for (const [name, C] of ALL) {
    const html = render(C);
    for (const [tag] of html.matchAll(/<input[^>]*type="range"[^>]*>/g)) {
      assert.match(tag, /aria-valuetext="[^"]+"/, `${name}: ${tag}`);
      const id = tag.match(/\bid="([^"]+)"/)?.[1];
      assert.ok(id && html.includes(`for="${id}"`), `${name}: label for ${id}`);
    }
    for (const fs of html.match(/<fieldset class="s07-schalter">[\s\S]*?<\/fieldset>/g) ?? []) assert.match(fs, /<legend>[^<]+<\/legend>/, name);
  }
  assert.match(render(Foundation2), /aria-valuetext="25 Befragte je Gruppe"/);
});

test('foundation 1: machine starts empty, text version with both tables and stack lists', () => {
  const html = render(Foundation1), t = textOf(html);
  assert.match(html, /<button type="button" class="knopf">Neue Stichprobe ziehen<\/button>/);
  assert.match(html, /<button type="button" class="knopf hell">Von vorn<\/button>/);
  assert.match(html, /<p class="s07-zeile" aria-live="polite">Noch keine Stichprobe gezogen\.<\/p>/);
  assert.match(t, /Arbeitsstunden: die ersten 20 Stichproben/);
  assert.match(t, /Lebenszufriedenheit: die ersten 20 Stichproben/);
  assert.match(t, /12 7,10 7,70 −0,60 −1,33 bis 0,13 −1,62 0,11/);
  assert.match(t, /8 bis 9 Stunden: 214/);
  assert.match(t, /−1,2 bis −1,0 Punkte: 4/);
  assert.match(t, /Der Stapel der Arbeitsstunden hat die Form einer Glocke mit dem Gipfel bei 8 bis 9 Stunden/);
  assert.ok(imageNames(html).some(n => n.includes('liegen 127 mindestens 0,6 Punkte von 0 entfernt (in eine der beiden Richtungen: 63 mit den Frauen vorn, 64 mit den Männern vorn)')));
  assert.match(t, /Normalverteilung: kennst du aus der Vorlesung/);
  assert.match(t, /kennst du aus Sitzung 5 Ein Stück davon kennst du schon/);
});

test('machine text follows the state: empty, the samples drawn, all 1.000', () => {
  assert.match(machineText('dw15', 0), /Noch keine Stichprobe gezogen/);
  assert.equal(machineText('dw15', 1), 'Stapel der Unterschiede Männer minus Frauen, Arbeitsstunden, nach 1 Stichprobe. Steine je Kiste: 1 bei 8 bis 9.');
  assert.match(machineText('ls01', 12), /nach 12 Stichproben/);
  assert.match(machineText('ls01', 1000), /ein Stein für 10 Stichproben, rote Linie beim wahren Unterschied von −0,01/);
  assert.equal(firstStacks('dw15', 20).reduce((a, b) => a + b, 0), 20);
  assert.ok(SAMPLES.dw15.every(s => s.diff > 0));
  assert.match(MACHINE.dw15.all, /keiner liegt bei 0 oder darunter/);
});

test('foundation 1: formula with the numbers, the two questions and their feedback', () => {
  const t = textOf(render(Foundation1));
  assert.match(t, /√\(8,443² ÷ 1\.530 \+ 10,287² ÷ 1\.427\) = √\(0,0466 \+ 0,0742\) = √0,1208 ≈ 0,348 Stunden/);
  assert.match(t, /t = 7,988 ÷ 0,348 ≈ 22,95, rund 23/);
  assert.match(render(Foundation1, { g1b: 'doppelt' }), /Wurzel aus 4 ist 2/);
  assert.match(render(Foundation1, { g1c: 'frauen' }), /Nicht signifikant heißt nur „nicht entschieden“/);
});

test('n slider: text per step, significance from 400 on, fixed effect size', () => {
  assert.equal(nStepText(N_STEPS[0]), `25 Befragte je Gruppe: 95-%-Intervall −0,84 bis 1,44. ${N_FEEDBACK.open}`);
  assert.equal(nStepText(N_STEPS[4]), `400 Befragte je Gruppe: 95-%-Intervall 0,02 bis 0,58. ${N_FEEDBACK.significant}`);
  const t = textOf(render(Foundation2));
  assert.match(t, /t = 0,53, p = 0,598, Effektstärke d = 0,15/);
  assert.match(t, /Die Effektstärke bleibt bei jeder Stufe 0,15\./);
  assert.match(t, /1\.600 0,07 4,24 < 0,001 0,16 bis 0,44/);
  assert.match(t, /Student: signifikant\. Welch: nicht signifikant\./);
  assert.match(t, /Standardfehler = √\(1² ÷ 400 \+ 3² ÷ 40\) = √\(0,0025 \+ 0,225\) ≈ 0,48/);
});

test('pairs, F lab and F as building blocks', () => {
  assert.equal(alarmText(5), '10 Paare. Wahrscheinlichkeit für mindestens einen Fehlalarm, wenn es nirgends einen Unterschied gibt: 40,1 %');
  assert.equal(alarmText(2), '1 Paar. Wahrscheinlichkeit für mindestens einen Fehlalarm, wenn es nirgends einen Unterschied gibt: 5,0 %');
  assert.equal(labLine(labRow(1, 1)), 'Streuung zwischen (je Freiheitsgrad) 6 ÷ Streuung innerhalb (je Freiheitsgrad) 2 = F 3,00, p = 0,080, η² 0,29');
  assert.equal(labLine(labRow(0.5, 2)), 'Streuung zwischen (je Freiheitsgrad) 24 ÷ Streuung innerhalb (je Freiheitsgrad) 0,5 = F 48,00, p < 0,001, η² 0,86');
  assert.equal(labFeedback(labRow(2, 0)), F_LAB_FEEDBACK.none);
  assert.equal(labFeedback(labRow(1, 2)), F_LAB_FEEDBACK.large);
  assert.equal(labFeedback(labRow(2, 1)), F_LAB_FEEDBACK.small);
  for (const r of F_LAB) assert.ok(labFeedback(r), `${r.s} ${r.a}`);
  const t = textOf(render(Foundation3));
  assert.match(t, /3 Paare\. Wahrscheinlichkeit für mindestens einen Fehlalarm, wenn es nirgends einen Unterschied gibt: 14,3 %/);
  assert.match(t, /Doppelter Abstand und doppelte Streuung ergeben dasselbe F\. Es zählt das Verhältnis\./);
  assert.match(t, /101\.483,969 ÷ 2 = 50\.741,984/);
  assert.match(t, /1\.645\.598,339 ÷ 5\.221 = 315,188/);
  assert.match(t, /η² = Streuung zwischen ÷ gesamte Streuung = 101\.483,969 ÷ 1\.747\.082,307 ≈ 0,058/);
  assert.match(t, /CAWI - MAIL\s+-11\.204\s+0\.626/);
  assert.match(t, /Alle drei Paare unterscheiden sich: Online-Befragte sind am jüngsten, Papier-Befragte am ältesten\./);
  assert.match(t, /ALLBUS 2023, gewichtet, gewichtetes N = 5\.224; Achse beginnt bei 40\./);
});

test('foundation 4: the matrix with r, stars, N per pair and the four marks', () => {
  const html = render(Foundation4), t = textOf(html);
  assert.match(t, /-0\.380\*\*\*/);
  assert.match(t, /0\.331\*\*\*/);
  assert.match(t, /-0\.036 /);
  for (const n of ['5224', '2957', '5142', '5189', '2968', '2945', '2963', '5164', '5148', '5210']) assert.ok(t.includes(n), n);
  assert.equal([...html.matchAll(/class="s07-marke"/g)].length, 8, 'four marks in the tables, four in the legend');
  assert.match(t, /paarweiser Ausschluss/);
  assert.match(t, /Pearsons r: kennst du aus Sitzung 6/);
});

test('overview: decision tree as a nested list, four assignments with the same reason for right and wrong', () => {
  const html = render(Overview);
  assert.match(html, /<div class="sr-only"><p>Entscheidungsbaum „Welches Verfahren\?“ als Liste:<\/p><ul><li>/);
  assert.equal([...html.matchAll(/<fieldset class="frage"/g)].length, 4);
  const answered = textOf(render(Overview, { ue1: 't', ue2: 't', ue3: 'r', ue4: 'kreuz' }));
  assert.match(answered, /✓ Einkommen in Ost und West: Eine metrische Variable, zwei Gruppen: t-Test\./);
  assert.match(answered, /✗ Zufriedenheit nach Schicht: Metrisch behandelt, fünf Gruppen: ANOVA, danach Tukey für die Paare\./);
  assert.match(textOf(html), /gewichtetes N = 2\.957/);
  assert.match(textOf(html), /gezählt waren es hier 2\.933 Erwerbstätige/);
});

test('formula fractions: the visual fraction is hidden from screen readers, a sentence says it in words', () => {
  const t = render(Foundation1), f = render(Foundation3);
  assert.match(t, /<span class="frac" aria-hidden="true">/);
  assert.match(f, /<span class="frac" aria-hidden="true">/);
  assert.match(t, /<span class="sr-only">Signal geteilt durch Rauschen gleich t<\/span>/);
  assert.match(f, /<span class="sr-only">Streuung zwischen den Gruppen geteilt durch Streuung innerhalb der Gruppen gleich F<\/span>/);
});

test('foundation 4: the non-significant p-values are in the help line', () => {
  assert.match(textOf(render(Foundation4)), /Ohne Stern: p = \.051, \.180, \.087/);
});

test('free-map links where a concept exists', () => {
  assert.match(render(Foundation1), /data-concept="sd"/);
  assert.match(render(Foundation3), /data-concept="ss"/);
  assert.match(render(Foundation4), /data-concept="pearson"/);
});
