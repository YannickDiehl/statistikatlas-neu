import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement as h, type ComponentType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ChapterStateProvider } from '../ChapterContext';
import type { ChapterState } from '../state';
import { K1B, K3B, K4A } from './content';
import { Foundation1, Foundation2, Foundation3, Foundation4, Overview } from './Foundations';
import { B1_TEXT, B2_AFTER, B3_TEXT, B4_TEXT, LINE_STATES, TRANSLATOR_GROUPS, lineImageText, translatorText } from './figures/Topic1';
import { B5A_TEXT, B5_AFTER, B6B_TEXT, B6_TEXT, OUTPUT_LINES, OUTPUT_PARTS, chainText } from './figures/Topic2';
import { B10_TEXT, B8_TEXT, B9_BEFORE, B9_TEXT } from './figures/Topic3';
import { B11_MODEL, B11_RULE, B12B_TEXT, B12_TEXT, B13_TEXT } from './figures/Topic4';

const ALL: [string, ComponentType][] = [['Foundation1', Foundation1], ['Foundation2', Foundation2], ['Foundation3', Foundation3], ['Foundation4', Foundation4], ['Overview', Overview]];

function render(C: ComponentType, answers: Record<string, string> = {}) {
  const initial: ChapterState = { predictions: {}, answers };
  return renderToStaticMarkup(h(ChapterStateProvider, { sessionId: 11, initial }, h(C)));
}

const unescape = (s: string) => s.replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const textOf = (html: string) => unescape(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const imageNames = (html: string) => [...html.matchAll(/<[^>]*\brole="img"[^>]*>/g)].map(([tag]) => unescape(tag.match(/\baria-label="([^"]*)"/)?.[1] ?? ''));

test('every role="img" has a text version of at least 40 characters', () => {
  let count = 0;
  for (const [name, C] of ALL) {
    for (const answers of [{}, { [K3B.id]: K3B.options[1] }] as Record<string, string>[]) {
      for (const label of imageNames(render(C, answers))) {
        count++;
        assert.ok(label.length >= 40, `${name}: "${label}"`);
      }
    }
  }
  assert.equal(count, 2 * 12, "B1, B2, B3, B5a, B5, B6, B6b, B8, B9, B12, B12b, B13 in both states");
});

test('the text versions of the plan are the accessible names of the pictures', () => {
  const names = ALL.flatMap(([, C]) => imageNames(render(C)));
  for (const t of [B1_TEXT, B3_TEXT, B5A_TEXT, B6_TEXT, B6B_TEXT, B8_TEXT, B9_BEFORE, B12_TEXT, B12B_TEXT, B13_TEXT, lineImageText('daten')]) assert.ok(names.includes(t), t.slice(0, 50));
  assert.ok(imageNames(render(Foundation3, { [K3B.id]: K3B.options[0] })).includes(B9_TEXT), 'B9 after the guess');
  // Wortlaut der Textfassungen aus dem Plan
  assert.match(B1_TEXT, /^Ein Turm lm30 aus zehn Steinen, zum Beispiel\. Sieben Steine tragen eine 1/);
  assert.match(B4_TEXT, /plus 20, plus 18, plus 9 Prozentpunkte/);
  assert.equal(B2_AFTER, 'Eine Gerade (lineare Regression) sagt für 18-Jährige 106,6 % voraus, für 95-Jährige 70,1 %. Eine S-Kurve (logistische Regression) sagt 99,6 % und 39,4 % voraus und liegt an jeder Altersgruppe höchstens 1,7 Prozentpunkte neben dem Anteil.');
  assert.equal(B11_MODEL, 'Richtig: 4 + 4.393 = 4.397 von 4.813, das sind 91,4 %.');
  assert.equal(B11_RULE, 'Wer für alle „Ja“ sagt, liegt bei allen richtig, die das Smartphone nennen: 5 + 4.393 = 4.398 von 4.813, das sind 91,4 %. Genauso gut wie das Modell, sogar um einen (gewichteten) Fall besser.');
  assert.match(B10_TEXT, /Bei beiden wird die Chance mit 3,77 malgenommen\.$/);
});

test('no workshop in the foundations; the only <pre> is the output in 2c', () => {
  for (const [name, C] of ALL) assert.doesNotMatch(render(C), /class="workshop"/, name);
  const g2 = render(Foundation2);
  assert.equal((g2.match(/<pre/g) ?? []).length, 1);
  assert.equal(OUTPUT_LINES.length, 18);
  for (const [name, C] of ALL.filter(([n]) => n !== 'Foundation2')) assert.doesNotMatch(render(C), /<pre/, name);
});

test('foundation blocks with ids, skip links and step labels', () => {
  const steps: Record<string, string[]> = { Foundation1: ['1a', '1b', '1c'], Foundation2: ['2a', '2b', '2c'], Foundation3: ['3a', '3b', '3c'], Foundation4: ['4a', '4b', '4c'], Overview: ['Ü1', 'Ü2', 'Ü3'] };
  ALL.forEach(([name, C], i) => {
    const html = render(C);
    const n = i + 1;
    assert.match(html, new RegExp(`<section class="grund-block" id="g${n}"`), name);
    if (n <= 4) assert.match(html, new RegExp(`<a class="zur" href="#a${n}">Schon klar\\? Direkt zu Aufgabe ${n} ↓</a>`), name);
    else assert.match(html, /Überblick zu allen Aufgaben/);
    const found = [...html.matchAll(/<span class="g-schritt"><span class="sr-only">Schritt <\/span>([^<]+)<\/span>/g)].map(m => m[1]);
    assert.deepEqual(found, steps[name], name);
  });
});

test('cards carry the labels of the plan', () => {
  const g1 = textOf(render(Foundation1));
  assert.match(g1, /Turm und Stein: kennst du aus Sitzung 2/);
  assert.match(g1, /Mittelwert: kennst du aus Sitzung 3/);
  assert.match(g1, /Gerade: kennst du aus Sitzung 9 Kurz überlegen Im Bild/);
  assert.match(textOf(render(Foundation2)), /Sig\.: kennst du aus Sitzung 7 und 9/);
  assert.match(textOf(render(Foundation3)), /Prozentpunkte: kennst du aus Sitzung 5/);
  assert.match(textOf(render(Foundation4)), /R²: kennst du aus Sitzung 9/);
});

test('every slider has a label and aria-valuetext; toggles use aria-pressed', () => {
  for (const [name, C] of ALL) {
    const html = render(C);
    for (const [tag] of html.matchAll(/<input[^>]*type="range"[^>]*>/g)) {
      assert.match(tag, /aria-valuetext="[^"]+"/, `${name}: ${tag}`);
      const id = tag.match(/\bid="([^"]+)"/)?.[1];
      assert.ok(id && html.includes(`for="${id}"`), `${name}: label for ${id}`);
    }
  }
  assert.match(render(Foundation1), /aria-valuetext="78 %"/);
  assert.match(render(Foundation2), /aria-valuetext="70 Jahre"/);
  const g1 = render(Foundation1);
  assert.deepEqual([...g1.matchAll(/<button type="button" class="knopf hell" aria-pressed="(true|false)">([^<]*)<\/button>/g)].map(m => `${m[2]} ${m[1]}`),
    LINE_STATES.map((s, i) => `${s.label} ${i === 0}`));
  assert.equal([...render(Foundation2).matchAll(/aria-pressed="false"/g)].length, OUTPUT_PARTS.length);
  assert.equal([...render(Foundation4).matchAll(/aria-pressed="(true|false)"/g)].length, 2);
});

test('live texts with values: B2 sentence, translator, B5 chain, B7 explanations, B11', () => {
  const g1 = render(Foundation1);
  assert.match(g1, /<p class="rueck text" aria-live="polite">Bis etwa 50 nennen fast alle das Smartphone, danach sinkt der Anteil immer schneller\.<\/p>/);
  assert.equal(translatorText(78), 'Wahrscheinlichkeit 78 %, Chance 3,55 („3,55 zu 1“), Logit 1,27.');
  assert.equal(translatorText(50), 'Wahrscheinlichkeit 50 %, Chance 1 („1 zu 1“), Logit 0.');
  assert.ok(textOf(g1).includes(translatorText(78)));
  assert.ok(textOf(g1).includes(TRANSLATOR_GROUPS));
  assert.match(g1, /<caption>Wahrscheinlichkeit, Chance und Logit<\/caption>/);
  assert.match(g1, /<caption>Anteil der Internetnutzenden, die das Smartphone nennen, nach Alter, gewichtet, ALLBUS 2023\.<\/caption>/);
  assert.equal([...g1.matchAll(/<div class="s11-raster"[^>]*>([\s\S]*?)<\/div>/g)][0][1].match(/class="ja"/g)?.length, 78);
  assert.equal(chainText(70), 'Alter 70 → Logit 1,454 → Chance 4,28 → Wahrscheinlichkeit 81,1 %');
  const g2 = textOf(render(Foundation2));
  assert.ok(g2.includes(chainText(70)));
  assert.ok(g2.includes(B5_AFTER));
  for (const o of OUTPUT_PARTS) assert.ok(g2.includes(o.text), o.label);
  assert.ok(textOf(render(Foundation4)).includes(B11_MODEL));
  assert.ok(textOf(render(Foundation4)).includes(B11_RULE));
});

test('Kurz überlegen 1b and 4a: the resolution after choosing, quoting the choice; B9 resolves only after the guess', () => {
  assert.doesNotMatch(render(Foundation1), /106,6 % voraus, für alle unter 32/);
  assert.ok(textOf(render(Foundation1, { [K1B.id]: 'genau 100 %' })).includes(`Deine Wahl: „genau 100 %“. ${K1B.resolution}`));
  assert.ok(textOf(render(Foundation4, { [K4A.id]: 'fast alle' })).includes(`Deine Wahl: „fast alle“. ${K4A.resolution}`));
  const before = render(Foundation3);
  assert.doesNotMatch(textOf(before), /zwölfmal so viel/);
  assert.match(before, /<button type="button" class="knopf hell" aria-disabled="true">Auflösen<\/button>/);
  const after = textOf(render(Foundation3, { [K3B.id]: 'bei beiden gleich' }));
  assert.ok(after.includes(`Deine Wahl: „bei beiden gleich“. ${K3B.resolution}`));
});

test('overview: three languages table, decision tree, requirements', () => {
  const o = textOf(render(Overview));
  assert.match(o, /Chance Exp\(B\) × 3,77 ja/);
  assert.match(o, /Wahrscheinlichkeit im Mittel AME mittlere Steigung: 5,4 Prozentpunkte je Stufe/);
  assert.match(o, /146 Befragte, die nicht wählen wollen \(gezählt\), bei 2 Prädiktoren/);
  assert.match(o, /ungewichtet Exp\(B\) 3,703 statt 3,765/);
  assert.match(o, /Hosmer-Lemeshow Sig\. \.039/);
});

test('review findings: B7 figure named by aria-labelledby, no label on the focusable pre; B5 keyboard hint and population', () => {
  const g2 = render(Foundation2);
  const pre = g2.match(/<pre[^>]*>/)?.[0] ?? '';
  assert.doesNotMatch(pre, /aria-label/);
  assert.match(g2, /<figure[^>]*aria-labelledby="s11-ausgabe-t"/);
  assert.match(g2, /id="s11-ausgabe-t"/);
  assert.match(textOf(g2), /Mit den Pfeiltasten gehst du zehn Jahre weiter/);
  assert.match(imageNames(g2).join(' '), /Internetnutzende/);
  assert.match(textOf(render(Foundation3, { [K3B.id]: 'bei beiden gleich' })), /Der Logit sinkt bei beiden um 0,76, die Chance wird bei beiden mit 0,47 malgenommen\./);
  assert.match(B9_TEXT, /In beiden Fällen sinkt der Logit um 0,76 und die Chance wird mit 0,47 malgenommen\.|Der Logit sinkt bei beiden um 0,76, die Chance wird bei beiden mit 0,47 malgenommen\./);
});
