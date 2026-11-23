import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement as h, type ComponentType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ChapterStateProvider } from '../ChapterContext';
import type { ChapterState } from '../state';
import { CHECKS, INGLE_GOALS, LAB } from './content';
import { Foundation1, Foundation2, Foundation3, Foundation4, Overview } from './Foundations';
import { rowText } from './figures/Theme1';
import { calcText, corStep, corText, OUTPUT_TEXT } from './figures/Theme2';
import { labKey, labText } from './figures/Theme3';
import { INGLE_DISTRIBUTION, ingleText, ingleType } from './figures/Theme4';

const ALL: [string, ComponentType][] = [['Foundation1', Foundation1], ['Foundation2', Foundation2], ['Foundation3', Foundation3], ['Foundation4', Foundation4], ['Overview', Overview]];

function render(C: ComponentType, answers: Record<string, string> = {}) {
  const initial: ChapterState = { predictions: {}, answers };
  return renderToStaticMarkup(h(ChapterStateProvider, { sessionId: 8, initial }, h(C)));
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
  assert.ok(count >= 5, String(count));
});

test('no R code in the foundations: no workshop and no <pre>', () => {
  for (const [name, C] of ALL) {
    const html = render(C);
    assert.doesNotMatch(html, /class="workshop"/, name);
    assert.doesNotMatch(html, /<pre/, name);
  }
});

test('foundation blocks with ids, skip links and step labels as in the plan', () => {
  const steps: Record<string, string[]> = { Foundation1: ['1a', '1b', '1c'], Foundation2: ['2a', '2b', '2c'], Foundation3: ['3a', '3b'], Foundation4: ['4a', '4b'], Overview: ['Ü1', 'Ü2', 'Ü3'] };
  ALL.forEach(([name, C], i) => {
    const html = render(C), n = i + 1;
    assert.match(html, new RegExp(`<section class="grund-block" id="g${n}"`), name);
    if (n <= 4) assert.match(html, new RegExp(`<a class="zur" href="#a${n}">Schon klar\\? Direkt zu Aufgabe ${n} ↓</a>`), name);
    else assert.doesNotMatch(html, /class="zur"/, name);
    const found = [...html.matchAll(/<span class="g-schritt"><span class="sr-only">Schritt <\/span>([^<]+)<\/span>/g)].map(m => m[1]);
    assert.deepEqual(found, steps[name], name);
  });
});

test('every „Kurz überlegen“ of the plan is there, labelled, with its feedback after an answer', () => {
  const where: [ComponentType, (keyof typeof CHECKS)[]][] = [[Foundation1, ['g1a', 'g1b', 'g1c']], [Foundation2, ['g2a', 'g2b', 'g2c']], [Foundation3, ['g3a', 'g3b']], [Foundation4, ['g4b']]];
  for (const [C, keys] of where) for (const k of keys) {
    const q = CHECKS[k];
    const before = render(C);
    assert.match(before, new RegExp(`<form class="kurzueberlegen" id="${q.id}"`), k);
    assert.match(before, new RegExp(`id="${q.id}-r" aria-live="polite"`), k);
    const answer = String(q.target);
    const after = render(C, { [q.id]: answer });
    assert.ok(textOf(after).includes(`Richtig. ${textOf(q.right)}`.replace(/`/g, '')), k);
  }
  const wrong = render(Foundation1, { 'g1b-frage': '1' });
  assert.match(textOf(wrong), /Noch nicht\. Das wäre \(1 \+ 1 \+ 2 \+ 0\) \/ 4/);
  assert.match(render(Foundation1, { 'g1b-frage': '1' }), /aria-invalid="true"/);
  assert.match(textOf(render(Foundation3, { 'g3b-frage': 'fr07-fr08' })), /Richtig\. Auch richtig\./);
});

test('every slider has a label and aria-valuetext; switches and toggles expose their state', () => {
  for (const [name, C] of ALL) {
    const html = render(C);
    for (const [tag] of html.matchAll(/<input[^>]*type="range"[^>]*>/g)) {
      assert.match(tag, /aria-valuetext="[^"]+"/, `${name}: ${tag}`);
      const id = tag.match(/\bid="([^"]+)"/)?.[1];
      assert.ok(id && html.includes(`for="${id}"`), `${name}: label for ${id}`);
    }
    for (const [tag] of html.matchAll(/<output[^>]*>/g)) assert.match(tag, /aria-live="off"/);
  }
  const g2 = render(Foundation2);
  assert.equal((g2.match(/type="range"/g) ?? []).length, 2);
  assert.match(g2, /aria-valuetext="4 Items"/);
  assert.equal((g2.match(/aria-pressed="false"/g) ?? []).length, 4 + 3, 'four levels in B4, three numbers in B6');
  const g3 = render(Foundation3);
  assert.equal((g3.match(/role="switch" aria-checked="false"/g) ?? []).length, 4);
  const g1 = render(Foundation1);
  assert.match(g1, /<button type="button" aria-pressed="true">min_valid = 3<\/button>/);
  assert.match(g1, /aria-current="step"[^>]*>Schritt 1: Reihe lesen/);
});

test('live texts follow the state: row, correlations, calculator, output, lab, Inglehart', () => {
  assert.equal(rowText(1, 3), 'Person A: 2, 2, 3 und 4.');
  assert.match(rowText(2, 3), /Person B: \(1 \+ 1 \+ 2\) \/ 3 = 1,33, der leere Stein zählt nicht mit/);
  assert.equal(rowText(3, 3), 'Neuer Turm fluechtlinge mit min_valid = 3: Person A 2,75, Person B 1,33, Person C 4.');
  assert.match(rowText(3, 4), /Person B leer \(NA\), nur 3 von 4 gültig/);

  assert.equal(corText(null), 'Wähl eine Ebene.');
  assert.equal(corText(3), 'EU: mittlere Korrelation mit den anderen drei 0,330.');
  assert.deepEqual([0.19, 0.304, 0.568].map(corStep), ['hell', 'mittel', 'kraeftig']);

  assert.equal(calcText(4, 0.404), 'k = 4, r̄ = 0,404: α = (4 × 0,404) / (1 + 3 × 0,404) = 0,731, Acceptable.');
  assert.match(calcText(8, 0.404), /= 0,844, Good\.$/);
  assert.match(calcText(20, 0.2), /= 0,833, Good\.$/);

  assert.match(OUTPUT_TEXT.deleted, /0,733 statt 0,726/);

  const none = { fr07: false, fr08: false, fr03b: false, fr04b: false };
  assert.equal(labKey(none), '----');
  assert.match(labText(none), /^Cronbachs α = −0,210 \(negative; check item coding\)\. .*α ist negativ/);
  assert.match(labText({ ...none, fr03b: true, fr04b: true }), /α = 0,696 \(Questionable\).*eher traditionell\.$/);
  assert.match(labText({ ...none, fr07: true, fr08: true }), /eher gleichberechtigt\.$/);
  assert.doesNotMatch(labText({ ...none, fr07: true }), /dieselbe Richtung/);
  assert.equal(Object.keys(LAB).length, 16);

  assert.equal(ingleType(INGLE_GOALS).name, 'materialistischer Mischtyp');
  assert.equal(ingleText(INGLE_GOALS), 'Platz 1: Aufrechterhaltung von Ruhe und Ordnung, Platz 2: Mehr Einfluss der Bürger auf die Entscheidungen der Regierung → Typ: materialistischer Mischtyp.');
  const [a, b, c, d] = INGLE_GOALS;
  assert.equal(ingleType([b, d, a, c]).name, 'Postmaterialist');
  assert.equal(ingleType([d, c, a, b]).name, 'postmaterialistischer Mischtyp');
  assert.equal(ingleType([a, c, b, d]).name, 'Materialist');
  assert.match(INGLE_DISTRIBUTION, /Postmaterialisten 18,18 %.*materialistischer Mischtyp 35,68 %.*gewichtete Anzahl 136/);
});

test('screen reader details: tables with captions, the tree text read once, value tables in details', () => {
  const g1 = render(Foundation1);
  const table = g1.match(/<details class="werte"><summary>Alle Werte als Tabelle<\/summary>([\s\S]*?)<\/details>/)?.[1] ?? '';
  assert.equal((table.match(/<tr>/g) ?? []).length, 1 + 17);
  assert.match(table, /<td>2,75<\/td><td>8,87<\/td><td>65,90<\/td>/);
  const g2 = render(Foundation2);
  assert.match(g2, /<caption>Korrelationen der vier Fragen zur Verbundenheit, ALLBUS 2023, ungewichtet, n = 3\.521<\/caption>/);
  assert.match(g2, /<th scope="col"[^>]*>EU \(pn17\)<\/th>/);
  assert.match(g2, /data-concept="reliability"/);
  assert.match(g2, /id="s8-r"[^>]*aria-valuetext="0,400"/);
  assert.match(g2, /<caption>So stuft mariposa α ein<\/caption>/);
  assert.match(g2, /<summary>Alle drei Zahlen erklärt<\/summary>/);
  assert.match(render(Foundation3), /<summary>Alle 16 Möglichkeiten als Tabelle<\/summary>/);
  const ov = render(Overview);
  assert.match(ov, /<div id="s8-baum-text" class="sr-only" aria-hidden="true">Entscheidungsbaum\./);
  assert.match(ov, /<ol class="s8-ablauf" aria-label="Fünf Schritte vom Item zum Index">/);
});
