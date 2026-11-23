import test from 'node:test';
import assert from 'node:assert/strict';
import { fixtureSav } from '../../sandbox/testData';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { renderSession } from '../testRender';
import { ModelBuilder } from './ModelBuilder';
import { COMMON_CAUSES, GROUP_IDS } from './content';
import { builderData, builderModel, core, initialS09, interaction, modelStore, prepare, selection, type Model, type ModelEntry } from './domain';

const render = (state: object) => renderSession(9, true, { tasks: { s09: { ...initialS09(), ...state } } });
const p = prepare(fixtureSav()), models = modelStore(p);
const f3 = (x: number) => x.toFixed(3).replace('.', ',').replace('-', '−');
const entry = (m: Model, withC = true): ModelEntry => ({ c: withC ? f3(m.c) : '', b: GROUP_IDS.map(g => (g === m.spec.ref ? '' : f3(m.b[g]))) as ModelEntry['b'] });
const m4 = core(models, 4)!, m1 = core(models, 1)!;
const pred = (m: Model) => (m.c + m.b[2]).toFixed(2).replace('.', ',');

test('session 10 starts with the brief of the documentary desk and the two camps', () => {
  const html = renderSession(9);
  assert.match(html, /Neuer Job: Datenrecherche in der Doku-Redaktion „Zweiufer“\./);
  assert.match(html, /Redakteurin Mara Lindqvist schreibt dir/);
  assert.match(html, /„Prägung“ erwartet/);
  assert.match(html, /Die Leitfrage: <strong>Nehmen Umgezogene ihre Zufriedenheit mit/);
  assert.match(html, /<strong>Was du dabei lernst:<\/strong> Gruppen mit Dummies/);
  assert.match(html, /2 · Wie viele Umgezogene tragen den Film\? \(R\)/);
  assert.match(html, /3 · Dummies bauen: Mit wem vergleicht der Film\? \(R\)/);
  assert.doesNotMatch(html, /Zweite Referenzgruppe/);
  assert.doesNotMatch(html, /fiktiv|Zwischenhalt/i);
  assert.match(html, /Schnittplan-Karte · Mitgenommen/);
  assert.match(html, /<strong>Das Wichtigste aus dieser Sitzung:<\/strong> Das B eines Dummys ist der Abstand zur Referenzgruppe/);
});

test('the toolbox follows the partner toggle: new tools marked, known ones named, example script on neutral variables', () => {
  const html = renderSession(9);
  assert.ok(html.indexOf('task-partner') < html.indexOf('DEIN WERKZEUGKASTEN'));
  assert.ok(html.indexOf('DEIN WERKZEUGKASTEN') < html.indexOf('1 · Prägung oder Ort?'));
  for (const fn of ['to_dummy()', 'y ~ x1 + x2 + x3', 'y ~ x1 * x2']) assert.ok(html.includes(`<code>${fn}</code><span class="task-toolbox-new">neu</span>`), fn);
  for (const fn of ['%&gt;%', 'frequency()', 'mutate() + rec()', 'crosstab()', 'linear_regression() + summary()']) assert.ok(html.includes(`<code>${fn}</code> kennst du aus Sitzung`), fn);
  assert.ok(html.includes('<code>%&gt;%</code> kennst du aus Sitzung 4'));
  assert.match(html, /modell &lt;- allbus %&gt;%\n  linear_regression\(ls01 ~ work_1 \+ work_2 \+ work_3, weights = wghtpew\)/);
  assert.doesNotMatch(html, /\|&gt;/);
});

test('every step opens with a transition and thinking steps; no ready-made task code outside the help', () => {
  const html = render({ ref: 4, pattern: 'ort', patternLocked: true, second: { ref: 1, model: entry(m1), pred: '' }, controls: COMMON_CAUSES });
  for (const why of ['Bevor du in R rechnest: Ein Modell mit Dummies', 'Du hast gesehen, wie ein Modell seine Vorhersagen aus Konstante und B zusammensetzt', 'Bevor du rechnest, klärst du', 'Du weißt jetzt: Nur die Umgezogenen trennen', 'Eine Regression rechnet aber mit Zahlen', 'Deine Tabelle steht. Jetzt liest du sie',
    'Hängt das Ergebnis davon ab, welche du gewählt hast', 'Aber zieht jeder gleich oft um', 'Zeigt eine verwandte Frage dasselbe Muster', 'Dieselbe Frage lässt sich auch mit zwei 0/1-Variablen stellen', 'Du hast jetzt alles beisammen']) {
    assert.match(html, new RegExp(`<p class="task-guide-why">[^<]*(<[^>]+>[^<]*)*${why}`), why);
  }
  // neun nummerierte Schritte plus der Einstieg
  assert.equal((html.match(/class="task-guide-why"/g) ?? []).length, 10);
  // Lösungscode nur in der (geschlossenen) Hilfeleiter und im Skript zum Mitnehmen
  assert.doesNotMatch(html, /frequency\((allbus, )?dg03\)|to_dummy\((allbus, )?dg03\)|demokratie ~ dg03_|pt03 ~ dg03_|crosstab\((allbus, )?dg03|ost \* ostjugend|rec\(ps03/);
});

test('coefficients, CIs, predictions and the template wait for the own recognised table', () => {
  // Erst festlegen, dann rechnen: ohne Tipp bleiben die Felder der Tabelle zu
  const noTip = render({ ref: 4 });
  assert.match(noTip, /Gib zuerst in Schritt 1 deinen Tipp ab\. Dann öffnen sich hier die Felder für deine Tabelle\./);
  assert.doesNotMatch(noTip, /Wie groß ist die Konstante\?/);
  const chosen = render({ ref: 4, pattern: 'ort', patternLocked: true });
  assert.doesNotMatch(chosen, /linear_regression\(demokratie ~ dg03_1/);
  assert.doesNotMatch(chosen, /pt03 ~ dg03_1|crosstab\(dg03, abi|ost \* ostjugend/);
  assert.match(chosen, /readOnly="" aria-readonly="true" tabindex="-1" value="Referenz"/);
  assert.match(chosen, /Wie groß ist die Konstante\?<small class="task-field-help">Zeile \(Intercept\), Spalte B/);
  for (const n of [f3(m4.c), f3(m4.b[2])]) assert.doesNotMatch(chosen, new RegExp(n), n);
  assert.doesNotMatch(chosen, /95-%-Konfidenzintervall/);
  assert.match(chosen, /Sobald deine Tabelle in Schritt 3 stimmt, siehst du hier Konfidenzintervalle/);
  const wrong = render({ ref: 4, model: entry(core(models, 4, 'orig')!) });
  assert.match(wrong, /ohne Umpolen/);
  assert.doesNotMatch(wrong, /95-%-Konfidenzintervall/);
  const ok = render({ ref: 4, model: entry(m4), pattern: 'ort', patternLocked: true });
  assert.match(ok, /Referenzgruppe West-Bleibende: Abstand zur Referenzgruppe \(B\) und Vorhersage je Gruppe/);
  assert.match(ok, /Gestrichelt: wo die Umgezogenen liegen müssten/);
  assert.match(ok, /Welche Zufriedenheit sagt dein Modell für Ost→West vorher\?/);
  // Wackeltest steht erst nach der erkannten Tabelle beim Off-Text
  assert.doesNotMatch(chosen, /<h4 class="s09-sub">Wackeltest<\/h4>/);
  assert.match(chosen, /Der Wackeltest erscheint, sobald deine Tabelle in Schritt 3 stimmt\./);
  assert.match(ok, /<h4 class="s09-sub">Wackeltest<\/h4>/);
});

test('the board of the other cutting rooms waits for a second recognised reference that differs from the first', () => {
  const first = { ref: 4, model: entry(m4), pred: pred(m4) };
  assert.doesNotMatch(render(first), /<h4 class="s09-sub">Tafel der anderen Schnittplätze<\/h4>/);
  assert.doesNotMatch(render({ ...first, second: { ref: 1, model: { ...entry(m1), c: '9,999' }, pred: '' } }), /<h4 class="s09-sub">Tafel der anderen Schnittplätze<\/h4>/);
  const both = render({ ...first, second: { ref: 1, model: entry(m1), pred: pred(m1) } });
  assert.match(both, /<h4 class="s09-sub">Tafel der anderen Schnittplätze<\/h4>/);
  assert.match(both, /Die Koeffizienten hängen an der Referenzgruppe, die Vorhersagen nicht/);
  assert.match(both, /<th scope="row">größter VIF<\/th>/);
  assert.match(both, /Stimmt: Konstante \+ B\(Ost→West\) = /);
  // Die zweite Referenz kann nicht dieselbe sein wie die erste
  assert.doesNotMatch(render({ ...first, second: { ref: 4, model: entry(m4), pred: '' } }), /<h4 class="s09-sub">Tafel der anderen Schnittplätze<\/h4>/);
});

test('selection, controls and their effect appear only after recognised own values', () => {
  const s = selection(p), base = { ref: 4, model: entry(m4) };
  const before = render({ ...base, abi: '99,9' });
  assert.doesNotMatch(before, /Abitur-Anteile:/);
  assert.match(render({ ...base, abi: s.weighted[3].toFixed(1).replace('.', ',') }), /Stimmt \(gewichtet\)\. Abitur-Anteile \(gewichtet\):/);
  const cc = models({ outcome: 'rev', ref: 4, controls: COMMON_CAUSES, weighted: true })!;
  assert.doesNotMatch(render({ ...base, controls: COMMON_CAUSES }), /ohne und mit Kontrollen/);
  const withC = render({ ...base, controls: COMMON_CAUSES, cmodel: entry(cc, false) });
  assert.match(withC, /Abstand zur Referenzgruppe West-Bleibende: ohne und mit Kontrollen/);
  assert.doesNotMatch(withC, /demokratie ~ dg03_1 \+ dg03_2 \+ dg03_3 \+ age/);
  const sorted = render({ ...base, sort: { ...initialS09().sort, pt03: 'vorher' } });
  assert.match(sorted, /Vertrauen in den Bundestag – ein Argument dafür: .* Bedenke auch: /);
  assert.doesNotMatch(sorted, /tone-ok">Vertrauen in den Bundestag/);
});

test('the interaction and the counter-check reveal details only after the own value', () => {
  const it = interaction(p)!;
  assert.doesNotMatch(render({}), /Stimmt: ost:ostjugend/);
  assert.match(render({ inter: f3(it.fit.coef[3]) }), /Stimmt: ost:ostjugend = .*zweite Schreibweise/);
  const pt = core(models, 4, 'pt03')!;
  const counter = render({ ref: 4, model: entry(m4), counter: entry(pt, false) });
  assert.match(counter, /Zufriedenheit \/ Vertrauen: Ost-Bleibende/);
  assert.doesNotMatch(render({ ref: 4, model: entry(m4) }), /Zufriedenheit \/ Vertrauen:/);
});

test('off-text questions: qualitative first, with numbers after the own recognised values', () => {
  const text = 'Die Prägung macht alle Ostdeutschen unzufrieden, wenn sie in den Westen ziehen.';
  const plain = render({ offText: text });
  assert.match(plain, /Wer zieht um\? Unterscheiden sich die Umgezogenen schon, bevor sie umziehen\?/);
  assert.match(plain, /Wie viele Menschen tragen diesen Satz\?<\/li>/);
  assert.match(plain, /bisher 12 Wörter/);
  const numbers = render({ offText: text, movers: ['12', '7'], abi: selection(p).weighted[3].toFixed(1).replace('.', ','), ref: 4, model: entry(m4) });
  assert.match(numbers, /Im Modell 12 Ost→West und 7 West→Ost/);
  assert.match(numbers, /Wackeltest ohne die fünf einflussreichsten Befragten: Ost→West zwischen/);
});

test('pair variant: two cutting rooms, roles A and B; the finished card and the script', () => {
  const pair = render({ mode: 'pair', ref: 1 });
  assert.match(pair, /A ist „Schnittplatz Ost“ und rechnet mit der Referenzgruppe Ost-Bleibende\. B ist „Schnittplatz West“/);
  assert.match(pair, /3 · Dummies bauen: Mit wem vergleicht der Film\? \(R\) · A: Ost-Bleibende, B: West-Bleibende/);
  assert.match(pair, /5 · Der andere Schnittplatz \(R\)/);
  assert.match(pair, /7 · Gegenprobe mit dem Vertrauen in den Bundestag \(R\) · B/);
  assert.doesNotMatch(render({ ref: 1 }), /Der andere Schnittplatz/);
  const cc = models({ outcome: 'rev', ref: 4, controls: COMMON_CAUSES, weighted: true })!;
  const done = render({ ref: 4, model: entry(m4), pred: pred(m4), movers: ['12', '7'], abi: '40,3', controls: COMMON_CAUSES, cmodel: entry(cc, false), offText: 'Satz' });
  assert.match(done, /vollständiges R-Skript/);
  assert.match(done, /library\(tidyverse\)\nlibrary\(mariposa\)/);
  assert.match(done, /Regression vertiefen<small>Aufgabe abgeschlossen/);
  assert.match(done, /<dt>Referenzgruppe<\/dt><dd>West-Bleibende<\/dd>/);
  assert.match(done, /<dt>Kontrolliert<\/dt><dd>Alter, Geschlecht \(Frau\), Abitur<\/dd>/);
});

test('main-model numbers stay hidden until the own first table is recognised (counter-check, board, controls)', () => {
  const cc = models({ outcome: 'rev', ref: 4, controls: COMMON_CAUSES, weighted: true })!, pt = core(models, 4, 'pt03')!;
  const noModel = { ref: 4, second: { ref: 1, model: entry(m1), pred: pred(m1) }, controls: COMMON_CAUSES, cmodel: entry(cc, false), counter: entry(pt, false) };
  const hidden = render(noModel);
  assert.doesNotMatch(hidden, /Zufriedenheit \/ Vertrauen:/);
  assert.doesNotMatch(hidden, /<h4 class="s09-sub">Tafel der anderen Schnittplätze<\/h4>/);
  assert.doesNotMatch(hidden, /ohne und mit Kontrollen/);
  // (B Ost-Bleibende steht als −B West-Bleibende in der eigenen zweiten Tabelle – das hat die Person selbst getippt)
  for (const n of [f3(m4.c), f3(m4.b[2]), f3(m4.b[3])]) assert.doesNotMatch(hidden, new RegExp(n), n);
  const shown = render({ ...noModel, model: entry(m4) });
  assert.match(shown, /Zufriedenheit \/ Vertrauen:/);
  assert.match(shown, /<h4 class="s09-sub">Tafel der anderen Schnittplätze<\/h4>/);
  assert.match(shown, /ohne und mit Kontrollen/);
});

test('entries typed as R prints them open the tables and the plenum card shows normalised values', () => {
  const dot = (x: number) => x.toFixed(3).replace('-', '−');
  const e = { c: dot(m4.c), b: GROUP_IDS.map(g => (g === 4 ? '' : dot(m4.b[g]))) };
  const s = selection(p);
  const html = render({ ref: 4, model: e, pattern: 'dazwischen', patternLocked: true, pred: (Number(dot(m4.c)) + Number(dot(m4.b[2]))).toFixed(3), abi: `${s.printed[3].toFixed(1)}%` });
  assert.match(html, /Referenzgruppe West-Bleibende: Abstand zur Referenzgruppe/);
  assert.match(html, /Stimmt \(gewichtet\)\. Abitur-Anteile \(gewichtet\):/);
  assert.match(html, new RegExp(`<dt>B Ost→West</dt><dd>${f3(m4.b[2])}</dd>`));
  assert.doesNotMatch(html, /noch nicht geprüft/);
});

test('with only consequence controls, the off-text counter-question gives no main-model numbers before the own table', () => {
  // „ohne diese Kontrolle“ ist hier das Hauptmodell selbst
  const cm = models({ outcome: 'rev', ref: 4, controls: ['di08c'], weighted: true })!;
  const state = { ref: 4, controls: ['di08c'], cmodel: entry(cm, false), offText: 'Wer umzieht, bleibt etwa so zufrieden wie die West-Bleibenden, in den Osten wie in den Westen.' };
  const hidden = render(state);
  assert.match(hidden, /Einkommen heute kontrolliert – das kann eine Folge des Umzugs sein\.<\/li>/);
  assert.doesNotMatch(hidden, /Ohne diese Kontrolle/);
  for (const n of [f3(m4.c), f3(m4.b[1]), f3(m4.b[2]), f3(m4.b[3]), m4.b[2].toFixed(2).replace('.', ','), m4.b[3].toFixed(2).replace('.', ',')]) assert.doesNotMatch(hidden, new RegExp(n), n);
  assert.match(render({ ...state, model: entry(m4) }), /Ohne diese Kontrolle: Ost→West /);
});

test('the pattern guess: three picture cards, locked with „Tipp abgeben“, compared after the own table', () => {
  const start = renderSession(9);
  assert.match(start, /Was zeigen die Daten, glaubst du\? Klick eine Karte an\./);
  for (const t of ['Wer im Osten aufwuchs, bleibt so\\.', 'Es zählt, wo man heute lebt\\.', 'Etwas dazwischen']) assert.match(start, new RegExp(t));
  assert.match(start, /<button class="primary" disabled="">Tipp abgeben<\/button>/);
  const picked = render({ pattern: 'praegung' });
  assert.match(picked, /aria-pressed="true"[^>]*>.*✓ Prägung/);
  assert.match(picked, /<button class="primary">Tipp abgeben<\/button>/);
  const locked = render({ pattern: 'praegung', patternLocked: true });
  assert.match(locked, /Tipp abgegeben: Prägung\./);
  assert.match(locked, /Neu tippen/);
  assert.match(locked, /aria-disabled="true"/);
  // Ohne abgegebenen Tipp bleibt die Schablone zu
  const noTip = render({ ref: 4, model: entry(m4) });
  assert.match(noTip, /Gib zuerst in Schritt 1 deinen Tipp ab/);
  assert.doesNotMatch(noTip, /Gestrichelt: wo die Umgezogenen liegen müssten/);
  assert.doesNotMatch(noTip, /Deine Daten zeigen/);
  // Nach der eigenen Tabelle: Tipp neben den Daten, kein Neu-Tippen mehr
  const done = render({ ref: 4, model: entry(m4), pattern: 'ort', patternLocked: true });
  assert.match(done, /Dein Tipp: Ort<\/figcaption>/);
  assert.match(done, /Deine Daten: etwas dazwischen<\/figcaption>/);
  assert.match(done, /Dein Tipp: „Ort“\. Deine Daten zeigen: etwas dazwischen\./);
  assert.doesNotMatch(done, /Neu tippen/);
  assert.match(render({ ref: 4, model: entry(m4), pattern: 'dazwischen', patternLocked: true }), /tone-ok">Dein Tipp: etwas dazwischen\./);
});

test('the prediction as building blocks: Konstante block, B block, top edge = Vorhersage, from the own numbers', () => {
  const tip = { pattern: 'ort', patternLocked: true };
  assert.doesNotMatch(render({ ref: 4, ...tip }), /Baukasten aus deinen Zahlen/);
  const open = render({ ref: 4, model: entry(m4), ...tip });
  assert.match(open, /aria-label="Baukasten aus deinen Zahlen: Konstante 3,995 \(Referenzgruppe West-Bleibende\) plus B Ost→West \+0,169, ergibt die Vorhersage – noch offen\."/);
  assert.match(open, />= Vorhersage \?<\/text>/);
  assert.match(open, />\+ B Ost→West<\/text>/);
  const solved = render({ ref: 4, model: entry(m4), pred: pred(m4), ...tip });
  assert.match(solved, />= Vorhersage 4,16<\/text>/);
  // Entered with R’s dots: the blocks read the own numbers the same way
  const dot = (x: number) => x.toFixed(3).replace('-', '−');
  assert.match(render({ ref: 4, ...tip, model: { c: dot(m4.c), b: GROUP_IDS.map(g => (g === 4 ? '' : dot(m4.b[g]))) as ModelEntry['b'] } }), /Konstante 3,995 \(Referenzgruppe West-Bleibende\) plus B Ost→West \+0,169/);
  // Negative B goes down
  const m1n = render({ ref: 3, model: entry(core(models, 3)!), ...tip });
  assert.match(m1n, /Konstante 4,714 \(Referenzgruppe West→Ost\) plus B Ost→West −0,550/);
  assert.match(m1n, />−0,550<\/text>/);
  // Ost→West as reference: no B block
  assert.match(render({ ref: 2, model: entry(core(models, 2)!), ...tip }), /kein B – Ost→West ist die Referenzgruppe/);
});

test('Einstieg: the model builder sits between the toolbox and step 1, with open references and neutral variables', () => {
  const html = renderSession(9);
  assert.match(html, /<h3>Einstieg · Referenzgruppe, Kontrolle und Interaktion ausprobieren<\/h3>/);
  assert.ok(html.indexOf('DEIN WERKZEUGKASTEN') < html.indexOf('Einstieg · Referenzgruppe'));
  assert.ok(html.indexOf('Einstieg · Referenzgruppe') < html.indexOf('1 · Prägung oder Ort?'));
  const part = html.slice(html.indexOf('Einstieg · Referenzgruppe'), html.indexOf('1 · Prägung oder Ort?'));
  // Bedienelemente: Gruppenvariable, Referenzgruppe, Gesundheit (+ / *), Balken als Knöpfe, „Zurück“ ausgegraut
  for (const label of ['Gruppenvariable', 'Referenzgruppe Schicht', 'Gesundheit im Modell']) assert.match(part, new RegExp(`role="group" aria-label="${label}"`), label);
  for (const b of ['Schicht', 'Altersgruppe', 'untere', 'mittlere', 'obere', 'nein', 'ja, als Kontrolle \\(\\+\\)', 'ja, mit Interaktion \\(\\*\\)']) assert.match(part, new RegExp(`>${b}</button>`), b);
  assert.equal((part.match(/class="s09-mb-bar"/g) ?? []).length, 3);
  assert.match(part, /aria-label="Mittelschicht: Vorhersage \d,\d\d\. Als Referenz wählen\."/);
  assert.match(part, /<button type="button" class="s09-mb-reset" disabled="">Zurück zum Anfang<\/button>/);
  // Nichts vorgegeben: keine Referenz gewählt, noch keine Konstante, keine B, keine Formel
  assert.doesNotMatch(part, /aria-pressed="true">(untere|mittlere|obere)/);
  assert.match(part, /Wähl eine Referenzgruppe – mit den Knöpfen oder mit einem Klick auf einen Balken\./);
  assert.doesNotMatch(part, /Formel in R|\(Intercept\)|s09-mb-coefs/);
  // Neutrale Variablen, keine Variable des Films im Modell
  assert.match(part, /Lebenszufriedenheit \(<code>ls01<\/code>/);
  assert.doesNotMatch(part, /ps03|dg03|eastwest|pt03|demokratie/);
});

test('Einstieg: with references chosen, every bar is Konstante + B, the coefficients follow R and the last setting stays as a ghost', () => {
  const d = builderData(fixtureSav());
  const draw = (start: Parameters<typeof ModelBuilder>[0]['start']) => renderToStaticMarkup(createElement(ModelBuilder, { data: d, start }));
  const m = builderModel(d, { by: 'schicht', health: 'mal', ref: 2, refH: 1 })!;
  const html = draw({ now: { health: 'mal', ref: 2, refH: 1 }, before: { health: 'plus', ref: 2, refH: 1 } });
  assert.match(html, /Formel in R: <code>ls01 ~ \(schicht_1 \+ schicht_3\) \* gesundheit_2<\/code>/);
  assert.equal((html.match(/class="s09-mb-bar"/g) ?? []).length, 6);
  // Referenzbalken nur Konstante, kombinierter Balken vier Stücke
  const bars = html.split('class="s09-mb-bar"').slice(1);
  const segs = bars.map(b => (b.split('</button>')[0].match(/class="s09-mb-seg/g) ?? []).length);
  assert.deepEqual(segs, [2, 4, 1, 2, 2, 4]);
  for (const t of m.terms) assert.match(html, new RegExp(`<code>${t.name.replace(/[()]/g, '\\$&')}</code>`), t.name);
  assert.match(html, /<th scope="col">vorher<\/th>/);
  assert.equal((html.match(/class="s09-mb-ghost"/g) ?? []).length, 6);
  assert.match(html, /Zeig auf einen Balken: Dann steht hier, wie sich seine Höhe zusammensetzt\./);
  assert.match(html, /aria-label="Mittelschicht, Gesundheit sehr gut oder gut: Vorhersage \d,\d{3} \(Konstante\) = \d,\d\d\. Als Referenz wählen\."/);
  assert.match(html, /<button type="button" class="s09-mb-reset">Zurück zum Anfang<\/button>/);
  // Gesundheit gewählt, aber noch ohne Referenz: Balken ganz, keine Zerlegung, keine Formel
  const open = draw({ now: { health: 'plus', ref: 1, refH: null } });
  assert.match(open, /Wähl auch bei der Gesundheit eine Referenz\./);
  assert.equal((open.match(/s09-mb-seg whole/g) ?? []).length, 6);
  assert.doesNotMatch(open, /Formel in R/);
  // Von der Gesundheit zurück zu „nein“: kein Geist, weil es keinen einen Vergleichswert gibt
  assert.doesNotMatch(draw({ now: { health: 'ohne', ref: 1, refH: 1 }, before: { health: 'plus', ref: 1, refH: 1 } }), /class="s09-mb-ghost"/);
});
