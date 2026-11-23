import test from 'node:test';
import assert from 'node:assert/strict';
import { renderSession } from '../testRender';
import { taskRegistry } from '../registry';

test('session 1 shows the task: file first, then handshake, four ideas and the plenum card', () => {
  assert.equal(taskRegistry.s01?.title, 'Schon gefragt?');
  const empty = renderSession(0, false);
  assert.match(empty, /AUFGABE · REFERENT:IN IM ABGEORDNETENBÜRO/);
  assert.match(empty, /ALLBUS-Datei hierher ziehen/);
  const html = renderSession(0);
  assert.match(html, /Willkommen im Büro/);
  assert.match(html, /1 · Daten in R laden/);
  assert.match(html, /So gehst du vor/);
  assert.match(html, /Vorgemacht: Idee 1/);
  assert.match(html, /find_var\(allbus, &quot;horoskop&quot;\)|find_var\(allbus, "horoskop"\)/);
  assert.match(html, /<strong>0 von 4<\/strong> Ideen entschieden/);
  assert.match(html, /Deine eigene Idee \(freiwillig\)/);
  assert.match(html, /read_spss\(file\.choose\(\)\)/);
  for (const idea of ['Horoskopen', 'Angst vor Geflüchteten', 'Politik noch', 'einsam']) assert.match(html, new RegExp(idea));
  assert.match(html, /R läuft gerade nicht\?/);
  assert.match(html, /FÜR DAS PLENUM/);
  assert.match(html, /Muss neu gefragt werden/);
  assert.match(html, /Aufgabe offen/);
});

test('the rail shows running and finished status for session 1', () => {
  const running = renderSession(0, true, { tasks: { s01: { cases: '5246' } } });
  assert.match(running, /Einstieg<small>Aufgabe läuft<\/small>/);
  const stamp = (decision: 'take' | 'ask', extra: object) => ({ decision, variable: '', lowest: '', valid: '', searches: [], note: '', ...extra });
  const done = renderSession(0, true, { tasks: { s01: { stamps: {
    horoskop: stamp('take', { variable: 'rh08b' }), gefluechtete: stamp('ask', { searches: ['angst', 'fluecht'] }),
    politik: stamp('take', { variable: 'pt03' }), einsamkeit: stamp('ask', { searches: ['einsam', 'allein'] }),
  } } } });
  assert.match(done, /Einstieg<small>Aufgabe abgeschlossen<\/small><\/strong><svg/);
  assert.match(done, /class="current done"/);
});
