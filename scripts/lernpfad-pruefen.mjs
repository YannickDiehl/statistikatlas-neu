// Prüft gebaute Lernpfad-Kapitel in einem unsichtbaren Chrome (playwright-core, Chrome des Systems).
// Voraussetzung: dist/ wird ausgeliefert, z. B. `cd dist && python3 -m http.server 8777 --bind 127.0.0.1`.
// Aufruf: node scripts/lernpfad-pruefen.mjs k04 [k05 …]   (Basis-URL mit LERNPFAD_URL ändern)
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import fs from 'node:fs';

function playwright() {
  const kandidaten = [process.cwd() + '/node_modules/'];
  try { const npx = execSync('ls -d ~/.npm/_npx/*/node_modules/playwright-core 2>/dev/null', { encoding: 'utf8', shell: '/bin/zsh' }).trim().split('\n'); kandidaten.push(...npx.map(p => p.replace(/playwright-core$/, ''))); } catch { /* keine */ }
  for (const k of kandidaten) { try { if (fs.existsSync(k + 'playwright-core')) return createRequire(k)('playwright-core'); } catch { /* weiter */ } }
  throw new Error('playwright-core nicht gefunden (npx playwright-core einmal ausführen).');
}
const { chromium } = playwright();
const basis = process.env.LERNPFAD_URL || 'http://127.0.0.1:8777/lernpfad/';
const kapitel = process.argv.slice(2);
const browser = await chromium.launch({ channel: 'chrome', headless: true });
let fehlerGesamt = 0;
for (const k of kapitel) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const fehler = [];
  page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) fehler.push('console: ' + m.text().slice(0, 300)); });
  page.on('pageerror', e => fehler.push('pageerror: ' + e.message.slice(0, 300)));
  page.on('response', r => { if (r.status() >= 400 && r.url().includes('/lernpfad/')) fehler.push(`HTTP ${r.status()} ${r.url()}`); });
  await page.route(/webr\.r-wasm|r-universe|repo\.r-wasm|fonts\.g/, r => r.abort());
  await page.goto(basis + k + '/'); await page.waitForTimeout(1200);
  const bericht = await page.evaluate(async () => {
    const $$ = (s, el = document) => [...el.querySelectorAll(s)];
    const aufgaben = $$('#aufgaben .aufgabe').map(a => ({ id: a.id, schritte: $$('.schritt', a).map(s => s.id) }));
    const schrittIds = new Set(aufgaben.flatMap(a => a.schritte));
    const leereCode = $$('#aufgaben .cb').filter(c => !c.querySelector('pre')?.textContent.trim()).length;
    // Verstehen: jedes Thema einmal zeigen
    const themen = $$('.v-themen button');
    const karten = new Set(); const verweise = []; const eingaben = [];
    for (const b of themen) { b.click(); await new Promise(r => setTimeout(r, 120)); }
    $$('#p-verstehen .karte[id]').forEach(c => karten.add(c.id));
    $$('#p-verstehen a[href^="#"]').forEach(a => verweise.push(a.getAttribute('href').slice(1)));
    $$('#p-verstehen input, #p-verstehen select, #p-verstehen textarea, #p-verstehen form').forEach(e => {
      const t = e.tagName === 'INPUT' ? e.type : e.tagName.toLowerCase();
      if (!['range', 'checkbox'].includes(t)) eingaben.push(t + (e.id ? '#' + e.id : ''));
    });
    $$('#p-verstehen button').forEach(b => { if (/prüfen|festlegen|aufdecken|tipp abgeben/i.test(b.textContent)) eingaben.push('Knopf: ' + b.textContent.trim()); });
    const alleIds = new Set($$('[id]').map(e => e.id));
    const toteVerweise = [...new Set(verweise)].filter(id => !alleIds.has(id) && !schrittIds.has(id));
    const railKarten = $$('#f-verstehen .r-schritte a, #f-verstehen .r-liste > li > a').map(a => a.getAttribute('href').slice(1));
    // Mitnehmen
    const mitVerweise = $$('#p-mitnehmen .m-nachlesen').map(a => a.getAttribute('href').slice(1)).filter(id => !karten.has(id));
    const selbst = $$('#p-mitnehmen #selbsttest form').length;
    // Aufgaben-Verweise nach Verstehen (Warum-Einträge mit grund) prüft die Engine beim Öffnen; hier: grund-Ziele der Aufgaben
    return { titel: document.title, aufgaben: aufgaben.map(a => `${a.id}:${a.schritte.length}`).join(' '), codeBloecke: $$('#aufgaben .cb').length, leereCode,
      themen: themen.length, karten: karten.size, toteVerweise, eingabenInVerstehen: eingaben, mitnehmenOhneKarte: mitVerweise, selbsttest: selbst,
      bausteineOhneInhalt: $$('[data-baustein]').filter(b => !b.children.length).map(b => b.dataset.baustein) };
  });
  // Querformat-iPad und Hochformat: keine waagerechte Überbreite
  for (const [w, h] of [[1024, 690], [768, 954]]) {
    await page.setViewportSize({ width: w, height: h }); await page.waitForTimeout(200);
    const ueber = await page.evaluate(() => { document.querySelector('#tab-aufgaben').click(); return document.documentElement.scrollWidth - innerWidth; });
    if (ueber > 2) fehler.push(`${w}x${h}: Seite ${ueber}px zu breit`);
  }
  const probleme = [...fehler, ...bericht.toteVerweise.map(v => 'toter Verweis #' + v), ...bericht.eingabenInVerstehen.map(e => 'Eingabe in Verstehen: ' + e),
    ...bericht.mitnehmenOhneKarte.map(v => 'Mitnehmen verweist auf fehlende Karte #' + v), ...bericht.bausteineOhneInhalt.map(b => 'Baustein leer: ' + b), ...(bericht.leereCode ? [`${bericht.leereCode} leere Code-Blöcke`] : [])];
  fehlerGesamt += probleme.length;
  console.log(`\n== ${k}: ${bericht.titel}\n   Aufgaben ${bericht.aufgaben} | Code ${bericht.codeBloecke} | Themen ${bericht.themen} | Karten ${bericht.karten} | Selbsttest ${bericht.selbsttest}`);
  console.log(probleme.length ? probleme.map(p => '   ✗ ' + p).join('\n') : '   ✓ keine Probleme gefunden');
  await page.close();
}
await browser.close();
process.exit(fehlerGesamt ? 1 : 0);
