import test from 'node:test';
import assert from 'node:assert/strict';
import { fixtureSav } from '../../sandbox/testData';
import { renderSession } from '../testRender';
import { compute, initialS06, prepare, type S06State } from './domain';

const render = (state: Partial<S06State>) => renderSession(6, true, { tasks: { s06: { ...initialS06(), ...state } } });
const c = compute(prepare(fixtureSav()));
const pctIn = (x: number) => (100 * x).toFixed(1).replace('.', ',');
const propIn = (x: number) => x.toFixed(3).replace('.', ',').replace('-', '−');
const shown = (x: number, digits = 1) => x.toFixed(digits).replace('.', ',').replace('-', '−');
const share = (scope: 'all' | 'online', grouping: 'rep' | 'amt' | 'version', level: number) =>
  c.shares.find(v => v.scope === scope && v.grouping === grouping && v.level === level && !v.weighted && v.coding === 'ok')!.value;
const empty = { a: '', b: '', t: '' };
const rep = (scope: 'all' | 'online') => ({ a: pctIn(share(scope, 'rep', 0)), b: pctIn(share(scope, 'rep', 1)), t: '' });
const rOf = (pair: string) => propIn(c.rs.find(v => v.pair === pair && v.scope === 'all' && !v.weighted)!.value);
const fOnline = c.fs.find(v => v.scope === 'online' && v.kind === 'classical' && !v.weighted)!;

test('session 7 starts with the brief, the four versions and the gut feeling – no numbers from the file', () => {
  const html = render({});
  assert.match(html, /AUFGABE · PANELAUFBAU IM UMFRAGEINSTITUT/);
  assert.match(html, /Neuer Job: Panelaufbau beim Institut Wiederfrage\./);
  assert.match(html, /„Dürfen wir Sie zu weiteren Befragungen einladen\?“/);
  assert.doesNotMatch(html, /fiktiv/i);
  assert.match(html, /Die vier Fassungen der Einladungsfrage/);
  assert.match(html, /Vorab · Dein Bauchgefühl/);
  for (const h of ['Station 1 · Erste Auswertung', 'Station 2 · Zufallscheck', 'Station 3a · Der saubere Vergleich: nur online', 'Station 3b · Vier Fassungen, sechs Paare', 'Station 4 · Freigabe']) assert.match(html, new RegExp(h));
  assert.match(html, /FÜR DAS PLENUM/);
  assert.match(html, /Freigabe · Die letzte Frage/);
  // keine Enthüllung, kein Wert aus der Datei
  assert.doesNotMatch(html, /Die Falle|Dieselbe ANOVA mit Gewicht|Korrelationsmatrix über alle|Tukey-Paarvergleiche nur online|Wer bekam welche Fassung|Zum Vergleich/);
  for (const x of [share('all', 'rep', 0), share('all', 'rep', 1), share('online', 'rep', 0), share('online', 'version', 1)]) assert.doesNotMatch(html, new RegExp(`${pctIn(x)} %`));
  assert.doesNotMatch(html, new RegExp(rOf('wiederholung-papier')));
  // Das Aufgabenblatt fragt r erst nach der festgehaltenen Markierung ab.
  assert.doesNotMatch(html, /Wie stark hängen wiederholung und papier zusammen\?/);
  assert.match(html, /Markierung festhalten/);
});

test('session 7 opens with two dot clouds: real ls01 values West and Ost, own settings, t as a fraction', () => {
  const html = render({});
  assert.match(html, /Einstieg · Zwei Gruppen, ein t-Test/);
  // Einstieg nach dem Werkzeugkasten, vor dem Vorab-Schritt; der Vorab-Schritt knüpft daran an
  assert.ok(html.indexOf('DEIN WERKZEUGKASTEN') < html.indexOf('Einstieg · Zwei Gruppen'));
  assert.ok(html.indexOf('Einstieg · Zwei Gruppen') < html.indexOf('Vorab · Dein Bauchgefühl'));
  assert.match(html, /Du hast gesehen, wie ein t-Test auf Unterschied, Streuung und Gruppengröße reagiert\. Jetzt geht es um die Einladungsfrage\./);
  // Bedienung: Gruppengröße und Streuung wählbar, zwei ziehbare Mittelwert-Linien, neue Stichprobe, Zurück erst nach einer Änderung
  for (const s of ['>10<', '>30<', '>100<', '>300<', '>1.000<', '>alle (']) assert.ok(html.includes(s), s);
  assert.match(html, /<button type="button" aria-pressed="true">30<\/button>/);
  for (const f of ['×0,25', '×0,5', '×0,75', '×1', '×1,25', '×1,5']) assert.ok(html.includes(`>${f}</button>`), f);
  assert.match(html, /aria-label="Streuung 1-fach" aria-pressed="true"|aria-pressed="true" aria-label="Streuung 1-fach"/);
  assert.match(html, /tabindex="0" role="slider" aria-label="Mittelwert West verschieben"/);
  assert.match(html, /tabindex="0" role="slider" aria-label="Mittelwert Ost verschieben"/);
  assert.match(html, /<button type="button" class="primary">Neue Stichprobe ziehen<\/button>/);
  assert.match(html, /<button type="button" disabled="">Zurück zu den ALLBUS-Zahlen<\/button>/);
  // was der t-Test rechnet: Unterschied über Standardfehler, dazu df, p und Intervall
  for (const s of ['Was der t-Test aus deiner Stichprobe rechnet', 'Unterschied West − Ost', 'Standardfehler', 'Freiheitsgrade (df)', '95-%-Konfidenzintervall des Unterschieds']) assert.ok(html.includes(s), s);
  // keine Vorgabe, keine Zielmarke: nichts verschoben, nichts gestreckt
  assert.doesNotMatch(html, /verschoben um [+−]/);
});

test('station 1: recognised shares give the own difference and the voice of the management', () => {
  const html = render({ s1: { rep: { ...rep('all'), t: '' }, amt: empty } });
  assert.match(html, /Stimmt: Zusagequote „ohne“ Wiederholung, online und Papier zusammen, ungewichtet/);
  assert.match(html, /Deine Differenz aus deinen Quoten: „mit“ − „ohne“ = \+14,8 Pp\./);
  assert.match(html, /Die Geschäftsführung liest mit: „\+14,8 Punkte durch die Wiederholung/);
  const wrong = render({ s1: { rep: { a: '12,3', b: '45,6', t: '' }, amt: empty } });
  assert.match(wrong, /Diese Quote für „ohne“ Wiederholung finde ich nicht/);
  assert.doesNotMatch(wrong, /Geschäftsführung liest mit|Deine Differenz/);
  assert.match(render({ s1: { rep: { a: '1,577', b: '', t: '' }, amt: empty } }), /Ein Mittelwert über 1/);
});

test('station 2: r only after the locked marks, the matrix only after recognised r', () => {
  const marks = ['wiederholung-papier' as const, 'betrag-papier' as const];
  const open = render({ marks });
  assert.match(open, /aria-pressed="true"[^>]*aria-label="wiederholung × papier: müsste ≈ 0 sein"/);
  assert.doesNotMatch(open, /Wie stark hängen wiederholung und papier zusammen\?/);
  const locked = render({ marks, locked: true });
  assert.match(locked, /Deine Markierung ist festgehalten/);
  assert.match(locked, /disabled=""[^>]*aria-label="betrag × age: müsste ≈ 0 sein"/);
  assert.match(locked, /Wie stark hängen wiederholung und papier zusammen\?/);
  assert.doesNotMatch(locked, /Korrelationsmatrix über alle/);
  const r = { repPaper: rOf('wiederholung-papier'), amtPaper: rOf('betrag-papier') };
  assert.doesNotMatch(render({ marks, locked: true, r: { ...r, amtPaper: '0,999' } }), /Korrelationsmatrix über alle/);
  const reveal = render({ marks, locked: true, r });
  assert.match(reveal, /Korrelationsmatrix für online und Papier zusammen, ungewichtet/);
  assert.match(reveal, /markiert · ≠ 0: nicht ausgelost/);
  assert.doesNotMatch(reveal, /Los verletzt/);
  // Werte aus anderen Zellen öffnen die Matrix nicht
  assert.doesNotMatch(render({ marks, locked: true, r: { repPaper: rOf('age-zusage'), amtPaper: rOf('papier-zusage') } }), /Korrelationsmatrix über alle/);
  assert.match(reveal, /Auf Papier gab es aus Kostengründen nur A1 und B1/);
  assert.match(reveal, /Wer bekam welche Fassung\?/);
  assert.match(reveal, /Warum kommt der Unterschied aus Station 1 nicht \(nur\) von der Wiederholung\?/);
  assert.match(render({ marks, locked: true, r, s1: { rep: rep('all'), amt: empty } }), /Warum kommen deine \+14,8 Punkte aus Station 1 nicht \(nur\) von der Wiederholung\?/);
  assert.match(render({ marks, locked: true, r, matrixView: 'weighted' }), /Korrelationsmatrix für online und Papier zusammen, gewichtet/);
});

test('station 3a: the trap appears after the own shares over all and online', () => {
  const trapHtml = render({ s1: { rep: rep('all'), amt: empty }, s3: { rep: rep('online'), amt: empty } });
  assert.match(trapHtml, /Die Falle/);
  assert.match(trapHtml, /Nicht die Wiederholung hat sich verändert, sondern die Vergleichsgruppe\./);
  assert.match(trapHtml, /„mit“ bleibt stehen – alle Befragten mit Wiederholung haben online geantwortet\./);
  assert.match(trapHtml, /role="img" aria-label="Zusagequote „ohne“ Wiederholung: online und Papier zusammen/);
  assert.match(trapHtml, /Unter „ohne“ steckten 19 Papier-Befragte/);
  assert.match(render({ s1: { rep: rep('all'), amt: empty }, s3: { rep: rep('online'), amt: empty }, trapView: 'online' }), /aria-pressed="true">nur online/);
  const half = render({ s3: { rep: rep('online'), amt: empty } });
  assert.doesNotMatch(half, /Die Falle/);
  assert.match(half, /Trag auch die Quoten „ohne\/mit“ aus Station 1 ein/);
  assert.doesNotMatch(render({ s1: { rep: rep('all'), amt: empty }, s3: { rep: rep('all'), amt: empty } }), /Die Falle/);
});

test('station 3b: ANOVA entries, Tukey only after the own ANOVA and „Auswahl prüfen“, the weighted reveal without station 3a', () => {
  const means = [1, 2, 3, 4].map(k => pctIn(share('online', 'version', k)));
  const anova = { means, F: propIn(fOnline.value), p: '' };
  const html = render({ anova });
  assert.match(html, /Stimmt: Zusagequote Fassung A1, nur online, ungewichtet = 80,0 %/);
  assert.match(html, /Stimmt: F\(3; 10\) = 0,238/);
  assert.match(html, /Dieselbe ANOVA mit Gewicht/);
  assert.match(html, /Mit wghtpew: F\(3; 9\) = 0,201/);
  // Die Online-t-Tests aus Station 3a und Tukey gewichtet bleiben verborgen, solange sie nicht eingetragen bzw. geprüft sind.
  assert.doesNotMatch(html, /Wiederholung online: ungewichtet|Betrag online: ungewichtet|Tukey gewichtet/);
  assert.match(render({ anova, s3: { rep: rep('online'), amt: empty } }), /Wiederholung online: ungewichtet/);
  assert.doesNotMatch(render({ anova: { means, F: '0,999', p: '' } }), /Dieselbe ANOVA mit Gewicht/);
  // ohne eigene ANOVA: Auswahl gesperrt, keine Tabelle, kein Urteil – auch nicht mit gespeicherter „richtiger“ Auswahl
  const locked = render({ tukey: ['none'], tukeyTried: ['none'] });
  assert.match(locked, /Die Auswahl öffnet sich, sobald oben F oder p deiner ANOVA erkannt ist/);
  assert.match(locked, /<button disabled="" aria-pressed="false">A2 – B2<\/button>/);
  assert.doesNotMatch(locked, /Tukey-Paarvergleiche nur online|Stimmt: Nach Tukey/);
  // mit ANOVA, aber ungeprüft: kein Urteil
  const unchecked = render({ anova, tukey: ['none'] });
  assert.doesNotMatch(unchecked, /Tukey-Paarvergleiche nur online|Stimmt: Nach Tukey|Noch nicht/);
  assert.match(unchecked, /Auswahl prüfen/);
  const wrong = render({ anova, tukey: ['4-2'], tukeyTried: ['4-2'] });
  assert.match(wrong, /Noch nicht: Deine Auswahl passt nicht zur Tukey-Tabelle/);
  assert.doesNotMatch(wrong, /Tukey-Paarvergleiche nur online|A2 – B2 ist/);
  const table = render({ anova, tukey: ['none'], tukeyTried: ['none'] });
  assert.match(table, /Stimmt: Nach Tukey unterscheidet sich kein Paar signifikant\./);
  assert.match(table, /Tukey-Paarvergleiche nur online/);
  assert.match(table, /p gewichtet/);
  assert.match(table, /Tukey gewichtet: kein Paar signifikant/);
  assert.match(table, /<td>,937<\/td>/);   // p wie mariposa, ohne führende Null
});

test('station 4: inputs after the version, the interval after the own rate and span, two signatures', () => {
  assert.doesNotMatch(render({}), /Welche Online-Quote versprichst du der Geschäftsführung\?/);
  const chosen = render({ release: { ...initialS06().release, version: 'A1' } });
  assert.match(chosen, /Welche Online-Quote versprichst du der Geschäftsführung\?/);
  assert.match(chosen, /Hast du die vier Fassungen online verglichen/);
  assert.doesNotMatch(chosen, /Balken/);
  const means = [1, 2, 3, 4].map(k => pctIn(share('online', 'version', k)));
  assert.match(render({ anova: { means, F: '', p: '' }, release: { ...initialS06().release, version: 'A1' } }), /höchsten Balken\. Hast du mit Tukey geprüft/);
  assert.doesNotMatch(chosen, /Zum Vergleich/);
  const rate = render({ release: { ...initialS06().release, version: 'A1', rate: '75' } });
  assert.match(rate, /Wie breit ist dein Intervall\?/);
  assert.doesNotMatch(rate, /Zum Vergleich/);
  const ci = c.rates[0]!;
  // beliebige Spanne ohne eigene vier Quoten: kein Intervall aus der Datei
  const span = render({ release: { ...initialS06().release, version: 'A1', rate: '75', low: '70', high: '80' } });
  assert.doesNotMatch(span, /Zum Vergleich|95-%-Intervall aus t_test/);
  assert.match(span, /Woran misst du deine Spanne\?/);
  assert.match(render({ anova: { means, F: '', p: '' }, release: { ...initialS06().release, version: 'A1', rate: '75', low: '70', high: '80' } }),
    new RegExp(`Zum Vergleich: A1 online, ungewichtet: ${shown(100 * ci.mean)} %`));
  const own = render({ release: { ...initialS06().release, version: 'A1', rate: '75', low: shown(100 * ci.ci[0]), high: shown(100 * ci.ci[1]) } });
  assert.match(own, /Das ist das 95-%-Intervall aus t_test\(\) für A1 online/);
  assert.match(span, /Unterschrift Panelaufbau: Was versprichst du der Geschäftsführung/);
  assert.match(span, /Freigabe: noch offen/);
  const veto = render({ release: { ...initialS06().release, version: 'A1' }, sign: { panel: 'Ich verspreche 75 %.', qs: 'Veto.', veto: true } });
  assert.match(veto, /Freigabe: Veto der Qualitätssicherung/);
  assert.match(veto, /<dt>Freigabe<\/dt><dd>Veto der Qualitätssicherung<\/dd>/);
});

test('the pair variant names A and B on every station and on the signatures', () => {
  const pair = render({ mode: 'pair', release: { ...initialS06().release, version: 'B1' } });
  assert.match(pair, /A ist Panelaufbau: Stationen 1 und 3a/);
  assert.match(pair, /Station 1 · Erste Auswertung <span class="s06-role">A · Panelaufbau<\/span>/);
  assert.match(pair, /Station 2 · Zufallscheck <span class="s06-role">B · Qualitätssicherung<\/span>/);
  assert.match(pair, /Unterschrift A · Panelaufbau/);
  assert.match(pair, /Unterschrift B · Qualitätssicherung/);
  assert.match(render({}), /Station 1 · Erste Auswertung <span class="s06-role">Panelaufbau<\/span>/);
});

test('a signed release completes the session, fills the card and offers the full script', () => {
  const done = render({
    gut: { version: 'B2', rate: '80' },
    release: { version: 'B1', rate: '67', low: '62', high: '72', amount: '4,5', notClaimed: 'Dass die Wiederholung wirkt.' },
    sign: { panel: 'Ich verspreche 67 %.', qs: 'Ich gebe frei.', veto: false },
  });
  assert.match(done, /Mittelwerte vergleichen<small>Aufgabe abgeschlossen/);
  assert.match(done, /<dt>Fassung<\/dt><dd>B1 · 10 € \(5 € fürs Ja, 5 € bei Teilnahme\), Geld nur am Schluss der Frage genannt<\/dd>/);
  assert.match(done, /<dt>Versprochene Online-Quote<\/dt><dd>67 % \(Spanne 62–72 %\)<\/dd>/);
  assert.match(done, /<dt>Was wir nicht behaupten<\/dt><dd>Dass die Wiederholung wirkt\.<\/dd>/);
  assert.match(done, /<dt>Freigabe<\/dt><dd>freigegeben mit zwei Unterschriften<\/dd>/);
  assert.match(done, /<dt>Bauchgefühl vorher<\/dt><dd>B2 · 80 %<\/dd>/);
  assert.match(done, /vollständiges R-Skript/);
  assert.match(done, /allbus %&gt;%\n  filter\(mode == 3\) %&gt;%\n  filter\(splt23_3 == 3\) %&gt;%\n  t_test\(zusage\) %&gt;%\n  summary\(\)/);
  assert.doesNotMatch(render({}), /vollständiges R-Skript/);
});

test('gut feeling locks after the first recognised number, t is optional, station 3a does not spoil station 2, rates print in percent', () => {
  const open = render({ gut: { version: 'B2', rate: '80' } });
  assert.doesNotMatch(open, /<button disabled="" aria-pressed="true">B2<\/button>/);
  assert.match(open, /„Neu tippen“ geht, bis deine erste Quote aus R erkannt ist/);
  const fixed = render({ gut: { version: 'B2', rate: '80' }, s1: { rep: rep('all'), amt: empty } });
  assert.match(fixed, /<button disabled="" aria-pressed="true">B2<\/button>/);
  assert.match(fixed, /role="img" aria-label="Deine Schätzung: Wie viele von 100 Eingeladenen sagen Ja\?: 80 von 100 sagen Ja"/);
  assert.match(fixed, /Du erwartest: 80 von 100 sagen Ja \(80 %\)\./);
  assert.doesNotMatch(fixed, /Neu tippen/);
  assert.match(fixed, /Dein Tipp ist festgehalten/);
  // gelöscht nach dem Festhalten: bleibt fest
  assert.match(render({ gut: { version: 'B2', rate: '80' }, gutFixed: true }), /<button disabled="" aria-pressed="true">B2<\/button>/);
  assert.doesNotMatch(open, /Welch-t-Wert ein/);
  // erst festlegen, dann rechnen: Die Felder öffnen sich nach dem Tipp
  assert.doesNotMatch(open, /Welchen t-Wert zeigt R\? \(freiwillig\)/);
  assert.match(open, /Die Felder öffnen sich, sobald du oben unter „Vorab“ deinen Tipp abgegeben hast\./);
  assert.match(render({ gut: { version: 'B2', rate: '80' }, gutCommitted: true }), /Welchen t-Wert zeigt R\? \(freiwillig\)/);
  assert.doesNotMatch(open, /nur online gab es alle vier Fassungen/);
  const card = render({ gut: { version: 'A2', rate: '0,8' }, release: { ...initialS06().release, version: 'B1', rate: '0,67', low: '0,62', high: '0,72' } });
  assert.match(card, /<dt>Versprochene Online-Quote<\/dt><dd>67 % \(Spanne 62–72 %\)<\/dd>/);
  assert.match(card, /<dt>Bauchgefühl vorher<\/dt><dd>A2 · 80 %<\/dd>/);
});

test('gut feeling: 100 envelopes to click, „Tipp abgeben“ locks, the real rate appears next to it after the four own rates', () => {
  const open = render({});
  assert.match(open, /Stell dir 100 Eingeladene vor\./);
  assert.match(open, /role="slider" tabindex="0" aria-label="Deine Schätzung: Wie viele von 100 Eingeladenen sagen Ja\?"/);
  assert.match(open, /<button class="primary" disabled="">Tipp abgeben<\/button>/);
  assert.match(render({ gut: { version: 'B1', rate: '' } }), /<button class="primary" disabled="">Tipp abgeben<\/button>/);
  assert.match(render({ gut: { version: 'B1', rate: '60' } }), /<button class="primary">Tipp abgeben<\/button>/);
  const committed = render({ gut: { version: 'B1', rate: '60' }, gutCommitted: true });
  assert.match(committed, /Tipp abgegeben: B1 mit 60 von 100\./);
  assert.match(committed, /Neu tippen/);
  assert.match(committed, /<button disabled="" aria-pressed="true">B1<\/button>/);
  assert.doesNotMatch(committed, /Dein Tipp neben der echten Quote/);
  // nach den eigenen vier Quoten online: Tipp und echte Quote als Umschläge nebeneinander
  const means = [1, 2, 3, 4].map(k => pctIn(share('online', 'version', k)));
  const real = c.rates[2]!.mean;
  const compared = render({ gut: { version: 'B1', rate: '60' }, gutCommitted: true, anova: { means, F: '', p: '' } });
  assert.match(compared, /Dein Tipp neben der echten Quote/);
  assert.match(compared, new RegExp(`Tatsächlich · Fassung B1, nur online<br/><span style="font-weight:400">${Math.round(100 * real)} von 100 sagen Ja`));
  assert.match(compared, /von 100 erwartet, tatsächlich sagen/);
  // Die erste erkannte Quote hält den Tipp fest: dann Vergleich, aber kein „Neu tippen“ mehr
  const auto = render({ gut: { version: 'B1', rate: '60' }, anova: { means, F: '', p: '' } });
  assert.match(auto, /Dein Tipp neben der echten Quote/);
  assert.doesNotMatch(auto, /Neu tippen/);
  // ohne Tipp kein Vergleich
  assert.doesNotMatch(render({ gut: { version: 'B1', rate: '' }, anova: { means, F: '', p: '' } }), /Dein Tipp neben der echten Quote/);
  assert.match(render({ anova: { means, F: '', p: '' } }), /Kein Tipp abgegeben – deine erste Quote aus R ist schon erkannt\./);
});

test('release: the tape draws span and rate live; the 95 % interval only after the own interval or the four own rates', () => {
  const ci = c.rates[0]!;
  const empty = render({ release: { ...initialS06().release, version: 'A1' } });
  assert.match(empty, /aria-label="Maßband von 0 bis 100 Prozent – noch leer\."/);
  assert.match(empty, /Ein 95-%-Konfidenzintervall ist eine Spanne um die Quote aus der Stichprobe/);
  const span = render({ release: { ...initialS06().release, version: 'A1', rate: '75', low: '70', high: '80' } });
  assert.match(span, /aria-label="Maßband von 0 bis 100 Prozent: deine Spanne von 70 bis 80 %, versprochene Quote 75 %\."/);
  assert.doesNotMatch(span, /95-%-Intervall aus R/);
  const own = render({ release: { ...initialS06().release, version: 'A1', rate: '75', low: shown(100 * ci.ci[0]), high: shown(100 * ci.ci[1]) } });
  assert.match(own, /95-%-Intervall aus R von/);
  assert.match(own, /Orange gestrichelt:/);
});

test('toolbox after the partner toggle, thinking steps with transitions, no task code in the steps, takeaway at the end', () => {
  const html = render({});
  assert.match(html, /DEIN WERKZEUGKASTEN/);
  assert.ok(html.indexOf('DEIN WERKZEUGKASTEN') > html.indexOf('A ist Panelaufbau') || html.indexOf('DEIN WERKZEUGKASTEN') > html.indexOf('Du übernimmst beide Rollen'));
  assert.ok(html.indexOf('DEIN WERKZEUGKASTEN') < html.indexOf('Vorab · Dein Bauchgefühl'));
  for (const fn of ['t_test()', 'oneway_anova()', 'tukey_test()']) assert.match(html, new RegExp(`<code>${fn.replace(/[()]/g, '\\$&')}</code><span class="task-toolbox-new">neu</span>`));
  assert.match(html, /<code>mutate\(\) \+ rec\(\)<\/code> kennst du aus Sitzung 5/);
  assert.match(html, /allbus %&gt;%\n  filter\(eastwest == 2\) %&gt;%\n  t_test\(ls01\) %&gt;%\n  summary\(\)/);
  assert.match(html, /allbus %&gt;%\n  oneway_anova\(ls01, group = pa02a\) %&gt;%\n  tukey_test\(\)/);
  assert.match(html, /<code>%&gt;%<\/code> kennst du aus Sitzung 4/);
  assert.doesNotMatch(html, /\|&gt;|kennst du: /);
  assert.match(html, /library\(tidyverse\)\nlibrary\(mariposa\)/);
  // kein fertiger Lösungscode im Aufgabenblatt (nur in der Hilfe und im Skript zum Mitnehmen)
  assert.doesNotMatch(html, /rec\(xr21|rec\(splt23_3|t_test\(zusage|oneway_anova\(zusage|filter\(mode|mutate\(zusage|Selbstausfüller/);
  // jede Station beginnt mit einer Überleitung und Denkschritten (fünf Stationen, Vorab und der Einstieg)
  assert.equal((html.match(/class="task-guide-why"/g) ?? []).length, 7);
  assert.equal((html.match(/So gehst du vor/g) ?? []).length, 7);
  assert.match(html, /Die Leitfrage für alle Stationen: <strong>Welche Fassung bringt online die meisten Zusagen – und wie sicher ist das\?<\/strong>/);
  assert.match(html, /<strong>Was du dabei lernst:<\/strong>/);
  assert.match(html, /<strong>Das Wichtigste aus dieser Sitzung:<\/strong>/);
  assert.ok(html.indexOf('Das Wichtigste aus dieser Sitzung') < html.indexOf('FÜR DAS PLENUM'));
});

test('station 2: „Neu markieren“ only until the matrix is revealed', () => {
  const marks = ['wiederholung-papier' as const];
  assert.match(render({ marks, locked: true }), /Neu markieren/);
  assert.doesNotMatch(render({ marks, locked: true, r: { repPaper: rOf('wiederholung-papier'), amtPaper: rOf('betrag-papier') } }), /Neu markieren/);
});
