import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement as h, type ComponentType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ChapterStateProvider } from '../ChapterContext';
import type { ChapterState } from '../state';
import { ASSIGN, LAB_STEPS, THINK } from './content';
import { Foundation1, Foundation2, Foundation3, Foundation4, Overview } from './Foundations';
import { estimateFeedback, mixText } from './figures/Weighting';
import { END_TEXT, PAIRS, directionText, pairSentence } from './figures/Pairs';
import { labText, thirdText } from './figures/Correlation';
import { TREE_TEXT } from './figures/Overview';

const ALL: [string, ComponentType][] = [['Foundation1', Foundation1], ['Foundation2', Foundation2], ['Foundation3', Foundation3], ['Foundation4', Foundation4], ['Overview', Overview]];

function render(C: ComponentType, answers: Record<string, string> = {}) {
  const initial: ChapterState = { predictions: {}, answers };
  return renderToStaticMarkup(h(ChapterStateProvider, { sessionId: 6, initial }, h(C)));
}
const unescape = (s: string) => s.replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const textOf = (html: string) => unescape(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
function textById(html: string, id: string): string {
  const m = html.match(new RegExp(`<(\\w+)[^>]*\\bid="${id}"[^>]*>([\\s\\S]*?)</\\1>`));
  return m ? textOf(m[2]) : '';
}
function imageNames(html: string): string[] {
  return [...html.matchAll(/<[^>]*\brole="img"[^>]*>/g)].map(([tag]) => {
    const label = tag.match(/\baria-label="([^"]*)"/)?.[1];
    if (label !== undefined) return unescape(label);
    const ids = tag.match(/\baria-labelledby="([^"]*)"/)?.[1] ?? '';
    return ids.split(/\s+/).filter(Boolean).map(id => textById(html, id)).join(' ');
  });
}

test('every role="img" has a text version of at least 40 characters', () => {
  let count = 0;
  for (const [name, C] of ALL) for (const label of imageNames(render(C))) {
    count++;
    assert.ok(label.length >= 40, `${name}: "${label}"`);
  }
  assert.ok(count >= 4, 'strength ruler, outlier ruler, decision tree, five measures');
});

test('no R code in the foundations: no workshop and no <pre>', () => {
  for (const [name, C] of ALL) {
    const html = render(C);
    assert.doesNotMatch(html, /class="workshop"/, name);
    assert.doesNotMatch(html, /<pre/, name);
  }
});

test('foundation blocks with ids, skip links and step labels as in the plan', () => {
  const steps: Record<string, string[]> = { Foundation1: ['1a', '1b', '1c'], Foundation2: ['2a', '2b', '2c'], Foundation3: ['3a', '3b', '3c'], Foundation4: ['4a', '4b', '4c'], Overview: ['Ü1', 'Ü2', 'Ü3'] };
  ALL.forEach(([name, C], i) => {
    const html = render(C), n = i + 1;
    assert.match(html, new RegExp(`<section class="grund-block" id="g${n}"`), name);
    if (n <= 4) assert.match(html, new RegExp(`<a class="zur" href="#a${n}">Schon klar\\? Direkt zu Aufgabe ${n} ↓</a>`), name);
    else assert.doesNotMatch(html, /class="zur"/, name);
    const found = [...html.matchAll(/<span class="g-schritt"><span class="sr-only">Schritt <\/span>([^<]+)<\/span>/g)].map(m => m[1]);
    assert.deepEqual(found, steps[name], name);
  });
});

test('every slider has a label, aria-valuetext and a silent output', () => {
  for (const [name, C] of ALL) {
    const html = render(C);
    for (const [tag] of html.matchAll(/<input[^>]*type="range"[^>]*>/g)) {
      assert.match(tag, /aria-valuetext="[^"]+"/, `${name}: ${tag}`);
      const id = tag.match(/\bid="([^"]+)"/)?.[1];
      assert.ok(id && html.includes(`for="${id}"`), `${name}: label for ${id}`);
    }
    for (const [tag] of html.matchAll(/<output[^>]*>/g)) assert.match(tag, /aria-live="off"/, name);
  }
  const g1 = render(Foundation1);
  assert.match(g1, /aria-valuetext="50 von 100"/);
  assert.match(g1, /aria-valuetext="32 %"/);
});

test('„Kurz überlegen“: each foundation question sits in its card, with the help line where planned', () => {
  const where: Record<keyof typeof THINK, ComponentType> = { g1b: Foundation1, g2a: Foundation2, g2c: Foundation2, g3b: Foundation3, g3c: Foundation3, g4a: Foundation4, g4b: Foundation4, g4c: Foundation4 };
  for (const [id, C] of Object.entries(where)) {
    const html = render(C);
    assert.match(html, new RegExp(`<form class="fragen" id="${id}-q"`), id);
    const q = THINK[id as keyof typeof THINK];
    if (q.help) assert.ok(textOf(html).includes(q.help), `${id} help`);
  }
  assert.ok(render(Foundation1, { g1b: '0,34' }).includes(THINK.g1b.right));
  assert.ok(render(Foundation3, { g3c: 'b' }).includes(THINK.g3c.hint));
});

test('1a: guess feedback by range; 1c: mixing desk sentences and values', () => {
  assert.match(estimateFeedback(17), /^Du hast ungefähr den Anteil in der Bevölkerung getippt/);
  assert.match(estimateFeedback(22), /^Du hast ungefähr/);
  assert.match(estimateFeedback(23), /^Nah dran/);
  assert.match(estimateFeedback(40), /^Nah dran/);
  assert.match(estimateFeedback(41), /^So viele sind es nicht/);
  assert.equal(mixText(32), 'Ost-Anteil 32,0 %: insgesamt 47,7 % ohne Konfession. So rechnet der ALLBUS ohne Gewicht.');
  assert.equal(mixText(16.8), 'Ost-Anteil 16,8 %: insgesamt 41,0 % ohne Konfession. So rechnet der ALLBUS mit Gewicht.');
  assert.equal(mixText(0), 'Ost-Anteil 0 %: insgesamt 33,7 % ohne Konfession.');
  assert.equal(mixText(50), 'Ost-Anteil 50 %: insgesamt 55,6 % ohne Konfession.');
  assert.equal(mixText(100), 'Ost-Anteil 100 %: insgesamt 77,5 % ohne Konfession.');
  const g1 = render(Foundation1);
  assert.match(g1, /<p class="rueck text" aria-live="polite">Ost-Anteil 32,0 %: insgesamt 47,7 %/);
  assert.match(g1, /aria-pressed="true"[^>]*>wie im ALLBUS \(32,0 %\)/);
  assert.ok(textOf(g1).includes('Probe: 3.567 Befragte im Westen mal 1,22 ergibt etwa 4.363.'));
});

test('2a: table with three views, live sentence, all three tables as text; 2b five steps', () => {
  const g2 = render(Foundation2);
  assert.match(g2, /aria-pressed="true"[^>]*>beobachtet/);
  assert.match(g2, /aria-live="polite">So sind die 100 Befragten verteilt\./);
  const all = g2.match(/<details class="werte"><summary>Alle drei Ansichten als Tabellen<\/summary>([\s\S]*?)<\/details>/)?.[1] ?? '';
  assert.deepEqual([...all.matchAll(/<caption>([^<]*)<\/caption>/g)].map(m => m[1]), ['Beobachtet', 'Erwartet ohne Zusammenhang', 'Abweichung: beobachtet minus erwartet']);
  for (const v of ['44,8', '35,2', '11,2', '8,8', '↑ +7,2', '↓ −7,2']) assert.ok(all.includes(v), v);
  const t = textOf(g2);
  assert.ok(t.includes('χ² = 1,16 + 1,47 + 4,63 + 5,89 = 13,15'));
  assert.ok(t.includes('V gleich Wurzel aus Chi-Quadrat geteilt durch n mal, in Klammern, kleinere Zahl von Zeilen und Spalten minus 1.'));
  assert.ok(t.includes('51,84 / 8,8 = 5,89 (Ost, keine)'));
});

test('3a: pair sentences of the plan; 3c: both codings as text', () => {
  const s = (id: string) => pairSentence(PAIRS.find(p => p.id === id)!);
  assert.equal(s('AB'), 'B hat die höhere Schicht und die bessere Gesundheit: konkordant (gleichläufig).');
  assert.equal(s('BC'), 'C hat die höhere Schicht, aber die schlechtere Gesundheit: diskordant (gegenläufig).');
  assert.equal(s('DE'), 'E hat die höhere Schicht, aber die schlechtere Gesundheit: diskordant (gegenläufig).');
  assert.equal(s('CD'), 'C und D haben dieselbe Schicht: eine Bindung (Gleichstand), keine Richtung erkennbar.');
  assert.equal(s('BE'), 'B und E haben dieselbe Gesundheit: eine Bindung (Gleichstand).');
  assert.equal(END_TEXT, 'Endstand: 6 konkordant, 2 diskordant, 1 Bindung bei der Schicht, 1 bei der Gesundheit.');
  const g3 = render(Foundation3);
  assert.equal([...g3.matchAll(/aria-pressed="false"[^>]*>[A-E]{2}</g)].length, 10, 'ten pair buttons');
  assert.match(textOf(g3), /Textfassung: Personen und Paare A: Schicht 1, Gesundheit 1/);
  assert.match(directionText('data'), /^Gamma −0,36, Tau-b −0,24\. Negativ:/);
  assert.match(directionText('flipped'), /^Gamma 0,36, Tau-b 0,24\. Positiv:/);
  assert.ok(textOf(g3).includes(directionText('flipped')), 'both states in the text version');
  const table = g3.match(/<summary>Werte als Tabelle<\/summary>([\s\S]*?)<\/details>/)?.[1] ?? '';
  assert.equal([...table.matchAll(/<tr>/g)].length, 1 + 5);
  assert.match(textOf(table), /Unterschicht 17,6 34,6 24,9 14,1 8,8 205/);
});

test('4a: lab text for every step, stretched axis from 200; 4c: three states as text', () => {
  assert.equal(labText(0), 'Person B: 50 Minuten. r = 0,974, ρ = 0,952. Fast alle Punkte liegen in den Plus-Feldern: starker positiver Zusammenhang.');
  assert.equal(labText(4), 'Person B: 500 Minuten. r = −0,335, ρ = 0,476.');
  assert.match(labText(5), /^Person B: 1\.500 Minuten\. r = −0,377, ρ = 0,476\. Ein Fragebogen/);
  assert.equal(LAB_STEPS.length, 6);
  const g4 = render(Foundation4);
  assert.match(g4, /aria-live="polite">Person B: 50 Minuten/);
  assert.doesNotMatch(g4, /Achse gestreckt/);
  const states = g4.match(/<caption>r und ρ je Stufe der Minuten von Person B<\/caption>([\s\S]*?)<\/table>/)?.[1] ?? '';
  assert.equal([...states.matchAll(/<tr>/g)].length, 1 + 6);
  assert.match(thirdText('all'), /59,0 % gegen 24,0 %, Abstand 35 Prozentpunkte, Phi 0,22/);
  assert.match(thirdText('mid'), /48,3 % gegen 29,6 % \(867 und 98 Befragte, gewichtet\), Abstand 18,7 Punkte, Phi 0,11\./);
  assert.match(thirdText('old'), /35,5 % gegen 20,4 % \(310 und 255 Befragte, gewichtet\), Abstand 15,1 Punkte, Phi 0,17\. Innerhalb gleich alter Menschen/);
  assert.match(textOf(g4), /Internetnutzung: 98,5 % \(18 bis 59\), 89,8 % \(60 bis 74\), 54,9 % \(75 und älter\)/);
  assert.match(textOf(g4), /z-Wert; die Standardabweichung kennst du aus Sitzung 3/);
});

test('overview: decision tree read once, five assignments with feedback, requirements table', () => {
  const html = render(Overview);
  assert.match(html, /<div id="s6-baum-text" class="sr-only" aria-hidden="true">/);
  for (const m of ['Cramér-V', 'Phi', 'Tau-b', 'Gamma', 'Spearman-ρ', 'Pearson-r']) assert.ok(TREE_TEXT.includes(m), m);
  assert.equal((html.match(/<select/g) ?? []).length, 5);
  const checked = render(Overview, { u1: '0', u2: '0' });
  assert.ok(checked.includes(ASSIGN[0].right));
  assert.ok(checked.includes(ASSIGN[1].wrong));
  assert.ok(checked.includes('Noch 3 Paare ohne Maß.'));
  assert.equal([...html.matchAll(/<th scope="row">/g)].length, 6, 'six measures in Ü2');
});
