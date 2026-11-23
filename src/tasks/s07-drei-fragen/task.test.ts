import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { fakeSav, fixtureSav } from '../../sandbox/testData';
import { renderSession } from '../testRender';
import { DreiFragen } from './DreiFragen';
import { agreeText } from './GuessCards';
import { detailOf, dutyFor, initialS07, kuer, prepare, type S07State } from './domain';

const render = (state: Partial<S07State>) => renderSession(7, true, { tasks: { s07: { ...initialS07(), ...state } } });
const p = prepare(fixtureSav());
const A = p.byKey['pa31+pa32+pa33'], B = p.byKey['pa29+pa30+pa33'];
const f3 = (x: number) => x.toFixed(3).replace('.', ',');
const f4 = (x: number) => x.toFixed(4).replace('.', ',');
const entered: Partial<S07State> = {
  a: { struck: ['pa29', 'pa30', 'pa34', 'pa35'], why: 'stimmig', alpha: f4(A.alpha), r: f4(A.r) },
  b: { struck: ['pa31', 'pa32', 'pa34', 'pa35'], why: 'Inhalt', alpha: f4(B.alpha), r: f4(B.r) },
};
const LANDSCAPE = /Die stimmigste Kurzskala ist/;

test('session 8 starts with the news app brief, the seven questions and the battery check', () => {
  const html = renderSession(7);
  assert.match(html, /AUFGABE · DATENTEAM EINER NACHRICHTEN-APP/);
  assert.match(html, /Drei Fragen müssen reichen/);
  assert.match(html, /Neuer Job: Datenteam der Nachrichten-App „Wochenfaden“\./);
  assert.match(html, /„Wochenfaden-Barometer“/);
  assert.doesNotMatch(html, /fiktiv|Querschnitt|Feldinstitut/);
  assert.match(html, /ein Umfrageinstitut 2\.000 Menschen befragen/);
  assert.match(html, /Der rote Faden: <strong>Welche drei Items messen Populismus/);
  assert.match(html, /<strong>Was du dabei lernst:<\/strong>/);
  // Die Begriffe der Sitzung werden einmal schlicht erklärt.
  assert.match(html, /<strong>Item<\/strong>: eine einzelne Frage, die mit anderen zusammen etwas misst/);
  assert.match(html, /<strong>Stimmigkeit:<\/strong>.*Cronbachs α/);
  assert.match(html, /<strong>Stellvertreter-Wert:<\/strong>.*Korrelation r/);
  // Vor dem Tipp: keine Zustimmungsprozente auf den Karten, noch keine Felder für R-Ergebnisse.
  assert.match(html, /pa29<\/code> Abgeordnete nur dem Volk verpflichtet<\/span>/);
  assert.doesNotMatch(html, /% Zustimmung|class="s07-agree"/);
  assert.doesNotMatch(html, /Wie stimmig messen alle sieben Items dasselbe\?<small/);
  assert.match(html, /2 · Rolle 1: Stimmigkeit/);
  assert.match(html, /3 · Rolle 2: Inhalt – jetzt wechselst du die Seite/);
  assert.match(html, /erscheint, sobald für beide Vorschläge Stimmigkeit und Stellvertreter-Wert eingetragen und erkannt sind/);
  assert.doesNotMatch(html, /5 · Deine Wahl/);
  assert.match(html, /FÜR DAS PLENUM/);
  // Die drei Seiten des Begriffs erscheinen nicht vorab.
  assert.doesNotMatch(html, /Volkssouveränität|Anti-Elitismus|Einheit des Volkes/);
  assert.match(html, /<button>Welche Seiten hat der Begriff\?<\/button>/);
  // Gekürzte Aussagen stehen ohne Anführungszeichen, mit dem Hinweis auf den Fragebogen.
  assert.match(html, /serif">Die Abgeordneten im Bundestag sollten sich nur dem Willen des Volkes verpflichtet fühlen\.<\/span>/);
  assert.doesNotMatch(html, /(<p>|serif">)„/);
  assert.match(html, /Die Items sind gekürzt; den genauen Wortlaut zeigt der ALLBUS-Fragebogen\./);
});

test('no numbers from the file before the own entry: neither alpha, omega nor the short scale values', () => {
  const champion = p.triples.find(t => t.rankAlpha === 1)!;
  const secrets = [p.full.alpha, p.full.omega, A.alpha, A.r, B.alpha, B.r, p.full.items[0].corrected, champion.alpha].map(f3);
  const cases: [Partial<S07State>, string[]][] = [
    [{}, secrets],
    [{ a: { ...entered.a!, alpha: '', r: '' } }, secrets],
    // Eigene, erkannte Werte werden bestätigt; B hat noch keinen erkannten r-Wert: nichts sonst aus der Datei.
    [{ ...entered, b: { ...entered.b!, r: '0,999' } }, [p.full.alpha, p.full.omega, B.r, p.full.items[0].corrected, champion.alpha].map(f3)],
  ];
  for (const [state, hidden] of cases) {
    const html = render(state).replace(/value="[^"]*"/g, '');
    for (const s of hidden) assert.doesNotMatch(html, new RegExp(s), `${s} in ${JSON.stringify(state)}`);
    assert.doesNotMatch(html, LANDSCAPE);
  }
});

test('striking four questions opens the entry fields; three struck asks for one more', () => {
  const three = render({ a: { struck: ['pa29', 'pa30', 'pa34'], why: '', alpha: '', r: '' } });
  assert.match(three, /Noch 1 Item streichen\./);
  assert.doesNotMatch(three, /Wie gut sagen deine drei Items die vier gestrichenen voraus\?/);
  const four = render({ a: { struck: ['pa29', 'pa30', 'pa34', 'pa35'], why: '', alpha: '', r: '' } });
  assert.match(four, /Gestrichen: pa29 \+ pa30 \+ pa34 \+ pa35\. Es bleiben: pa31 \+ pa32 \+ pa33\./);
  assert.match(four, /Wie stimmig messen deine drei Items dasselbe\?<small class="task-field-help">Die Stimmigkeit: Cronbachs α/);
  assert.match(four, /Wie gut sagen deine drei Items die vier gestrichenen voraus\?/);
  // Kein fertiger Code im Schritt: die Lösung steht nur in der Hilfe.
  assert.doesNotMatch(four, /row_means\(pick\(pa|reliability\((allbus, )?pa/);
  assert.match(four, /aria-pressed="true" disabled=""|aria-pressed="false" disabled=""/);
  const ok = render({ a: { ...entered.a! } });
  assert.match(ok, /Stimmt: Die Stimmigkeit deiner drei Items ist α = /);
  assert.match(ok, /Stimmt: Der Stellvertreter-Wert deiner Kurzskala ist r = /);
});

test('the landscape waits for both proposals and accepts the min_valid variant', () => {
  assert.doesNotMatch(render({ a: entered.a }), LANDSCAPE);
  assert.doesNotMatch(render({ ...entered, a: { ...entered.a!, alpha: f4(A.omega) } }), LANDSCAPE);
  assert.doesNotMatch(render({ ...entered, b: { ...entered.b!, alpha: 'x' } }), LANDSCAPE);
  const html = render(entered);
  assert.match(html, LANDSCAPE);
  assert.match(html, /role="img" aria-label="35 Kurzskalen: Stimmigkeit α von/);
  assert.match(html, /Stimmigkeit: pa31 \+ pa32 \+ pa33, α 0,599, r 0,685\. Inhalt: pa29 \+ pa30 \+ pa33/);
  assert.match(html, /Alle 35 Kurzskalen als Tabelle/);
  assert.match(html, /5 · Deine Wahl/);
  assert.match(html, /Pflichtfrage bei zu einheitlicher Wahl/);
  assert.match(render({ ...entered, a: { ...entered.a!, r: f4(detailOf(p, A).rAny[0]) } }), LANDSCAPE);
});

test('the three sides appear only as help and then name what a proposal misses', () => {
  const think = render({ ...entered, facetLevel: 1 });
  assert.match(think, /Denkanstoß\.<\/strong> Lies die sieben Items/);
  assert.doesNotMatch(think, /Volkssouveränität/);
  const shown = render({ ...entered, facetLevel: 2 });
  assert.match(shown, /Volkssouveränität<\/strong> \(V\)/);
  assert.match(shown, /Vorschlag Inhalt: Aus „Einheit des Volkes“ ist kein Item mehr dabei\./);
  assert.match(shown, /Vorschlag Stimmigkeit: Jede der drei Seiten ist mit einem Item vertreten\./);
  assert.match(shown, /<th scope="col">Seiten<\/th>/);
  assert.doesNotMatch(render(entered), /<th scope="col">Seiten<\/th>/);
});

test('partner variant: A for consistency, B for content, and an agreement', () => {
  const html = render({ ...entered, mode: 'pair' });
  assert.match(html, /A achtet auf die Stimmigkeit: möglichst hohes α, Blick auf die Trennschärfen\. B achtet auf den Inhalt/);
  assert.match(html, /Der Vorschlag von A<!-- --> misst möglichst stimmig|Der Vorschlag von A misst möglichst stimmig/);
  assert.match(html, /Jetzt entscheidet ihr gemeinsam/);
  assert.match(html, /2 · Person A: Stimmigkeit/);
  assert.match(html, /3 · Person B: Inhalt/);
  assert.match(html, /Einigt euch auf eine\./);
  assert.match(html, /Stimmigkeit: pa31 \+ pa32 \+ pa33, α 0,599|A: pa31 \+ pa32 \+ pa33, α 0,599/);
});

test('final choice, duty question and plenum card', () => {
  const duty = dutyFor(2);
  const html = render({ ...entered, final: ['pa31', 'pa32', 'pa33'], sentence: 'die Einheit des Volkes', reason: 'Stellvertreter', duty: 2 });
  assert.match(html, new RegExp(`Pflichtfrage für Gruppe 2: ${duty.item}`));
  if (!['pa31', 'pa32', 'pa33'].includes(duty.item)) assert.match(html, new RegExp(`Deine Pflichtfrage ${duty.item} fehlt in dieser Auswahl`));
  assert.match(html, /<dt>Kurzskala<\/dt><dd>pa31 \+ pa32 \+ pa33<\/dd>/);
  assert.match(html, /<dt>Punkt im Kreuz \(α \| r\)<\/dt><dd>0,599 \| 0,685<\/dd>/);
  assert.match(html, /<dt>Was sie nicht mehr misst<\/dt><dd>die Einheit des Volkes<\/dd>/);
  assert.match(html, /<dt>Pflichtfrage \(Gruppe 2\)<\/dt>/);
  assert.match(html, /Kür \(optional, etwa 10 Minuten\)/);
  assert.match(html, /vollständiges R-Skript/);
  assert.match(html, /Index und Skala<small>Aufgabe abgeschlossen/);
  assert.match(render({ ...entered, final: ['pa29', 'pa31', 'pa32'] }), /pa29 trifft den Kern des Begriffs/);
  // Allein „du“, zu zweit „ihr“
  const other = ['pa29', 'pa30', 'pa31', 'pa32', 'pa33', 'pa34', 'pa35'].filter(i => i !== duty.item).slice(0, 3) as S07State['final'];
  const alone = render({ ...entered, final: other, duty: 2 });
  assert.match(alone, new RegExp(`Deine Pflichtfrage ${duty.item} fehlt in dieser Auswahl\\. Wähle`));
  assert.match(alone, /Sie muss in deiner Kurzskala bleiben: Wähle oben neu/);
  assert.doesNotMatch(alone, /Eure Pflichtfrage|eurer Kurzskala/);
  const pair = render({ ...entered, mode: 'pair', final: other, duty: 2 });
  assert.match(pair, new RegExp(`Eure Pflichtfrage ${duty.item} fehlt in dieser Auswahl\\. Wählt`));
  assert.match(pair, /Sie muss in eurer Kurzskala bleiben: Wählt oben neu/);
  assert.match(render({ ...entered, final: ['pa31', 'pa32', 'pa33'], sentence: 'nichts' }), /Jede Kurzskala verliert etwas/);
  // Vor der Enthüllung: Wahl steht auf der Karte, der Punkt im Kreuz noch nicht.
  const early = render({ final: ['pa31', 'pa32', 'pa33'] });
  assert.match(early, /<dt>Punkt im Kreuz \(α \| r\)<\/dt><dd>–<\/dd>/);
  assert.doesNotMatch(early, /Kür \(optional/);
});

test('the bonus task reveals the gap only after both shares are recognised', () => {
  const k = kuer(p, ['pa31', 'pa32', 'pa33']);
  const f1 = (x: number) => x.toFixed(2).replace('.', ',');
  const base = { ...entered, final: ['pa31', 'pa32', 'pa33'] } as Partial<S07State>;
  assert.doesNotMatch(render({ ...base, kuer: { mean: f1(k.meanW), all: '' } }), /nur nach der Mittelwertlogik/);
  assert.match(render({ ...base, kuer: { mean: f1(k.meanW), all: f1(k.allW) } }), /gelten nur nach der Mittelwertlogik als populistisch/);
  assert.match(render({ ...base, kuer: { mean: '21', all: '' } }), /mit einer Nachkommastelle/);
  // aus crosstab() kopiert, mit Punkt und Prozentzeichen
  const pasted = render({ ...base, kuer: { mean: `${k.meanW.toFixed(1)}%`, all: `${k.allW.toFixed(1)}%` } });
  assert.match(pasted, /gelten nur nach der Mittelwertlogik als populistisch/);
  assert.doesNotMatch(pasted, /nicht als Zahl/);
  assert.match(pasted, new RegExp(`<dt>Kür</dt><dd>${k.meanW.toFixed(1).replace('.', ',')} % im Schnitt · ${k.allW.toFixed(1).replace('.', ',')} % durchgehend</dd>`));
});

test('a file without complete answers gets an explanation instead of NaN', () => {
  const col = { values: [-11, 1, -11, 2], missingFrom: -1 };
  const sav = fakeSav({ pa29: col, pa30: col, pa31: { values: [3, -9, -11, -11], missingFrom: -1 }, pa32: col, pa33: col, pa34: col, pa35: col, wghtpew: { values: [1, 1, 1, 1] } });
  const state = { ...initialS07(), battery: { alpha: '0,833', weakest: 'pa29' as const, value: '0,348' }, a: { struck: ['pa29', 'pa30', 'pa34', 'pa35'] as const, why: '', alpha: '0,759', r: '0,758' } };
  const html = renderToStaticMarkup(createElement(DreiFragen, {
    data: { sav, fileName: 'ZA8831_v1-3-0.sav', version: 'v1.3.0', bytes: new ArrayBuffer(0) }, state: { ...state, a: { ...state.a, struck: [...state.a.struck] } }, onChange: () => {}, onConcept: () => {},
  }));
  assert.match(html, /weniger als zwei Befragte alle sieben Items beantwortet/);
  assert.doesNotMatch(html, /NaN/);
  assert.doesNotMatch(html, LANDSCAPE);
});

test('weakest item: a tip on the cards first, then the fields, then tip and result side by side', () => {
  const open = render({});
  assert.match(open, /Welches der sieben Items passt am schlechtesten zu den anderen\?/);
  assert.match(open, /<button class="primary" disabled="">Tipp abgeben<\/button>/);
  assert.doesNotMatch(open, /Welches Item passt laut R am schlechtesten zu den übrigen\?/);
  assert.match(open, /Gib oben zuerst deinen Tipp ab/);
  const picked = render({ weakGuess: 'pa34' });
  assert.match(picked, /aria-pressed="true"[^>]*>.{0,200}pa34<\/code>/);
  assert.match(picked, /✓ Dein Tipp: passt am schlechtesten/);
  const locked = render({ weakGuess: 'pa34', weakGuessLocked: true });
  assert.match(locked, /Tipp abgegeben: pa34/);
  assert.match(locked, /Neu tippen/);
  assert.match(locked, /Welches Item passt laut R am schlechtesten zu den übrigen\?/);
  assert.match(locked, /Wie stimmig messen alle sieben Items dasselbe\?<small/);
  assert.doesNotMatch(locked, /Dein Tipp neben dem Ergebnis aus R/);
  // falsche Frage eingetragen: noch kein Vergleich
  assert.doesNotMatch(render({ weakGuess: 'pa34', weakGuessLocked: true, battery: { alpha: '', weakest: 'pa31', value: '' } }), /Dein Tipp neben dem Ergebnis aus R/);
  const shownHtml = render({ weakGuess: 'pa34', weakGuessLocked: true, battery: { alpha: '', weakest: 'pa29', value: '' } });
  assert.match(shownHtml, /Dein Tipp neben dem Ergebnis aus R/);
  assert.match(shownHtml, /Dein Tipp pa34 hat eine Trennschärfe von/);
  assert.match(shownHtml, /schwächste Trennschärfe in R/);
  assert.doesNotMatch(shownHtml, /Neu tippen/);
  assert.match(render({ weakGuess: 'pa29', weakGuessLocked: true, battery: { alpha: '', weakest: 'pa29', value: '' } }), /Gut gespürt: pa29 ist tatsächlich/);
  // gespeicherter Stand ohne Tipp, aber mit gewählter Frage: Felder bleiben offen
  assert.match(render({ battery: { alpha: '', weakest: 'pa31', value: '' } }), /Welches Item passt laut R am schlechtesten zu den übrigen\?/);
  assert.match(render({ battery: { alpha: '0,833', weakest: '', value: '' } }), /Wie stimmig messen alle sieben Items dasselbe\?<small/);
});

test('toolbox: every function of the session, new ones marked, examples on trust items instead of the task items', () => {
  const html = render({});
  assert.match(html, /DEIN WERKZEUGKASTEN/);
  const box = html.slice(html.indexOf('DEIN WERKZEUGKASTEN'), html.indexOf('Einstieg · '));
  for (const fn of ['reliability()', 'summary()', 'mutate()', 'row_means()', 'pearson_cor()', 'rec(), row_sums(), crosstab()', 'codebook()']) assert.ok(box.includes(fn), fn);
  for (const fn of ['reliability()', 'row_means()']) assert.match(box, new RegExp(`<code>${fn.replace(/[()]/g, '\\$&')}</code><span class="task-toolbox-new">neu</span>`), fn);
  assert.match(box, /<code>mutate\(\)<\/code> kennst du aus Sitzung 5/);
  assert.match(box, /<code>pearson_cor\(\)<\/code> kennst du aus Sitzung 6/);
  assert.match(box, /library\(tidyverse\)\nlibrary\(mariposa\)/);
  assert.match(box, /\ncodebook\(allbus\)\n/);
  // Pipe-Stil: Datensatz vorn, neue Variablen in einem mutate() (im HTML steht %>% als %&gt;%).
  assert.match(box, /<code>library\(\), read_spss\(\), %&gt;%, codebook\(\), describe\(\)<\/code> kennst du aus Sitzung 1, 3 und 4/);
  assert.match(box, /rechtsstaat &lt;- allbus %&gt;%\n  reliability\(pt02, pt08, pt14\)/);
  assert.match(box, /allbus &lt;- allbus %&gt;%\n  mutate\(\n    recht  = row_means\(pick\(pt02, pt08, pt14\), min_valid = 3\)/);
  assert.match(box, /allbus %&gt;%\n  describe\(recht\)/);
  assert.match(box, /allbus %&gt;%\n  pearson_cor\(recht, medien\)/);
  assert.match(box, /allbus %&gt;%\n  crosstab\(n_vertraut, eastwest, percentages = &quot;total&quot;, weights = wghtpew\)/);
  assert.match(box, /misstrauen_tv = rec\(pt09, rules = &quot;rev&quot;\)/);
  assert.doesNotMatch(box, /pa(29|3[0-5])|\|&gt;|codebook\(allbus, |suffix =|_r = rec/);
  assert.doesNotMatch(box.replace(/codebook\(allbus\)/g, ''), /\(allbus\b/);
});

test('story arc: a transition at the start of every step, thinking steps and a takeaway at the end', () => {
  const html = render(entered);
  assert.equal(html.match(/So gehst du vor/g)?.length, 6);
  assert.match(html, /Du hast gesehen, wie α darauf reagiert, welche Items in der Skala stehen und in welche Richtung sie zeigen\. Jetzt geht es um die sieben Populismus-Items\. Bevor du streichst/);
  assert.match(html, /Bevor du streichst, brauchst du einen Überblick/);
  assert.match(html, /Du weißt jetzt, wie stimmig alle sieben Items sind/);
  assert.match(html, /Dein erster Vorschlag<!-- --> misst möglichst stimmig|Dein erster Vorschlag misst möglichst stimmig/);
  assert.match(html, /Du hast jetzt zwei Vorschläge mit je zwei Zahlen/);
  assert.match(html, /Das Bild zeigt: Stimmigkeit und Stellvertreter-Wert ziehen nicht immer in dieselbe Richtung/);
  assert.match(html, /<p class="s02-takeaway"><strong>Das Wichtigste aus dieser Sitzung:<\/strong>/);
  assert.ok(html.indexOf('s02-takeaway') < html.indexOf('FÜR DAS PLENUM'));
  assert.doesNotMatch(render({}), /s02-takeaway/);
  const kuer = render({ ...entered, final: ['pa31', 'pa32', 'pa33'] });
  assert.match(kuer, /Deine Kurzskala steht\. Die App will daraus eine Push-Nachricht machen/);
  assert.match(kuer, /Kombinationsindex:<\/strong> Wer stimmt <em>allen drei<\/em> Items zu\?/);
  // Lösungscode nur in der Hilfe, nicht im Schritt
  assert.doesNotMatch(kuer, /rec\(pa3|row_sums\(pick\(z1/);
});

test('agreement percentages on the cards appear only with the comparison, not already after locking', () => {
  const picked = render({ weakGuess: 'pa30' });
  assert.doesNotMatch(picked, /% Zustimmung/);
  const locked = render({ weakGuess: 'pa30', weakGuessLocked: true });
  assert.doesNotMatch(locked, /% Zustimmung|Die Prozent zählen/);
  assert.match(locked, /Neu tippen/);
  // falsches Item eingetragen: noch kein Vergleich, noch keine Prozente
  assert.doesNotMatch(render({ weakGuess: 'pa30', weakGuessLocked: true, battery: { alpha: '', weakest: 'pa31', value: '' } }), /% Zustimmung/);
  const shown = render({ weakGuess: 'pa30', weakGuessLocked: true, battery: { alpha: '', weakest: 'pa29', value: '' } });
  assert.match(shown, /Dein Tipp neben dem Ergebnis aus R/);
  assert.equal(shown.match(/<span class="s07-agree">\d+ % Zustimmung<\/span>/g)?.length, 7);
  assert.match(shown, /Die Prozent zählen, wer voll oder eher zustimmt \(gewichtet\)\./);
  assert.doesNotMatch(shown, /Neu tippen/);
  assert.equal(agreeText(false, 0.78), '');
  assert.equal(agreeText(true, 0.78), '78 % Zustimmung');
  assert.equal(agreeText(true, NaN), '');
});

test('bonus help lines do not depend on the student\'s own value labels', () => {
  const html = render({ ...entered, final: ['pa31', 'pa32', 'pa33'] });
  assert.match(html, /die Zeile mit Kurzwert höchstens 2/);
  assert.match(html, /die Spalte, in der alle drei zugestimmt haben/);
  assert.doesNotMatch(html, /task-field-help">[^<]*(„im Schnitt Zustimmung“|„allen drei zugestimmt“)/);
});

/** Datei mit den Aufgaben-Items und den acht Einstiegs-Items (fr03b, fr04b, fr09, fr10 laufen gegen die übrigen). */
function savWithRoleItems() {
  const n = 40, col = (f: (i: number) => number) => ({ values: Array.from({ length: n }, (_, i) => f(i)), missingFrom: -1 });
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const latent = Array.from({ length: n }, rnd);
  const item = (flip: boolean) => col(i => { const v = Math.min(4, Math.max(1, Math.round(1 + 3 * latent[i] + 2 * (rnd() - 0.5)))); return flip ? 5 - v : v; });
  const pa = (k: number) => col(i => 1 + ((i * k) % 5));
  return fakeSav({
    pa29: pa(1), pa30: pa(2), pa31: pa(3), pa32: pa(4), pa33: pa(6), pa34: pa(7), pa35: pa(8), wghtpew: { values: Array(n).fill(1) },
    fr07: item(false), fr08: item(false), fr03b: item(true), fr04b: item(true), fr05b: item(false), fr09: item(true), fr10: item(true), fr12: item(false),
  });
}

test('Einstieg: heat map of eight role items before step 1 – all items in, none reversed, nothing preset', () => {
  const plain = render({});
  const intro = plain.indexOf('Einstieg · Acht Items, eine Zahl für die Stimmigkeit');
  assert.ok(intro > plain.indexOf('DEIN WERKZEUGKASTEN') && intro < plain.indexOf('1 · Die sieben Items'));
  assert.match(plain, /Die <strong>Heatmap<\/strong> \(eine Tabelle, in der Farben die Zahlen zeigen\)/);
  assert.match(plain, /Spielt es eine Rolle, welche Seite du umpolst\?/);
  // Die Testdatei hat die Items nicht: Hinweis statt Heatmap.
  assert.match(plain, /Diese Datei enthält die Items fr07, fr08, fr03b, fr04b, fr05b, fr09, fr10 und fr12 nicht/);
  assert.doesNotMatch(plain, /class="s07-rel"/);

  const html = renderToStaticMarkup(createElement(DreiFragen, {
    data: { sav: savWithRoleItems(), fileName: 'ZA8831_v1-3-0.sav', version: 'v1.3.0', bytes: new ArrayBuffer(0) }, state: initialS07(), onChange: () => {}, onConcept: () => {},
  }));
  const el = html.slice(html.indexOf('class="s07-rel"'), html.indexOf('1 · Die sieben Items'));
  assert.ok(el.length > 0);
  assert.equal(el.match(/<input type="checkbox"[^>]*checked=""/g)?.length, 8);
  assert.equal(el.match(/aria-pressed="false"[^>]*aria-label="fr\w+ umpolen"/g)?.length, 8);
  assert.doesNotMatch(el, /aria-pressed="true"/);
  assert.match(el, /<button type="button" disabled="">Zurück zum Datensatz<\/button>/);
  assert.equal(el.match(/<th scope="col"/g)?.length, 8);
  assert.equal(el.match(/<td class="s07-rel-diag"><\/td>/g)?.length, 8);
  assert.equal(el.match(/<td style="background:#/g)?.length, 56);
  assert.match(el, /Cronbachs α<\/span><strong>−?\d,\d{3}<\/strong>/);
  assert.match(el, /8 Items · 40 Befragte haben alle 8 beantwortet/);
  assert.match(el, /Trennschärfe <b[^>]*>−?\d,\d{3}<\/b> · α ohne dieses Item/);
  assert.match(el, /So sähe deine Auswahl in R aus/);
  assert.match(el.replace(/<[^>]+>/g, ''), /reliability\(fr07, fr08, fr03b, fr04b, fr05b, fr09, fr10, fr12\)/);
  assert.doesNotMatch(el, /NaN|pa(29|3[0-5])/);
  // Negative und positive Korrelationen sehen verschieden aus.
  const colors = new Set([...el.matchAll(/<td style="background:(#[0-9a-f]{6})"[^>]*>(−?)\d?,/g)].map(m => `${m[2] ? 'neg' : 'pos'}:${m[1].slice(1, 3) > m[1].slice(3, 5) ? 'red' : 'green'}`));
  assert.deepEqual([...colors].sort(), ['neg:red', 'pos:green']);
});
